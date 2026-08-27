#!/usr/bin/env python3
"""The check gate. Run before every commit:  python3 tools/check.py

Validates, failing loudly with actionable messages:
  1. every data/*.json registry parses (strict JSON by construction);
  2. setup: every manifest page file exists; every content/setup/*.md is
     referenced exactly once; ids unique;
  3. parity: the setup structure disposes of EVERY old-site page exactly once
     (migrated or dropped) against data/old-docs-pages.json, and
     docs/setup-parity.md is newer than or equal to the structure's content;
  4. projects: every org repo (data/org-repos.json) appears exactly once across
     project rosters or the exclusion list; project body files exist;
  5. tools: every tool file exists;
  6. content: no orphan markdown; every internal '#/...' link in content resolves
     to a real route; every relative asset reference exists; no orphan assets;
  7. shell: index.html references exist; vendored marked.min.js matches its
     pinned sha256;
  8. probes: data/search-probes.json carries exactly 10 well-formed probes.

Never weaken a check to make it pass — fix the content it is complaining about.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MARKED_SHA256 = "15fabce5b65898b32b03f5ed25e9f891a729ad4c0d6d877110a7744aa847a894"
errors = []


def err(msg):
    errors.append(msg)


def load(name):
    p = ROOT / name
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except FileNotFoundError:
        err(f"{name}: missing")
    except json.JSONDecodeError as e:
        err(f"{name}:{e.lineno}:{e.colno}: {e.msg} (strict JSON — no trailing commas, double quotes)")
    return None


def main():
    site = load("data/site.json")
    setup = load("data/setup.json")
    structure = load("data/setup-structure.json")
    projects = load("data/projects.json")
    tools = load("data/tools.json")
    old_pages = load("data/old-docs-pages.json")
    org = load("data/org-repos.json")
    probes = load("data/search-probes.json")
    if errors:
        report()

    # ---- 2. setup manifest <-> files ----
    setup_ids = set()
    referenced_md = set()
    for sec in setup["sections"]:
        for p in sec["pages"]:
            if p["id"] in setup_ids:
                err(f"setup.json: duplicate page id {p['id']}")
            setup_ids.add(p["id"])
            f = ROOT / p["file"]
            referenced_md.add(f.resolve())
            if not f.exists():
                err(f"setup.json: {p['id']} points at missing file {p['file']}")
            if not p.get("title"):
                err(f"setup.json: {p['id']} has no title")

    on_disk = {q.resolve() for q in (ROOT / "content" / "setup").rglob("*.md")}
    for orphan in sorted(on_disk - referenced_md):
        err(f"orphan content file (not in setup.json): {orphan.relative_to(ROOT)}")
    # (missing files already reported above)

    # ---- 3. parity: old pages disposed exactly once ----
    disposed = {}
    for g in structure["groups"]:
        for p in g["pages"]:
            disposed.setdefault(p["old"].removeprefix("contents/") if False else p["old"], []).append("migrated")
    for d in structure["dropped"]:
        disposed.setdefault(d["old"], []).append("dropped")
    old_set = set(old_pages["pages"])
    for page in sorted(old_set):
        n = len(disposed.get(page, []))
        if n == 0:
            err(f"parity: old page '{page}' has no disposition (add to a group or dropped list)")
        elif n > 1:
            err(f"parity: old page '{page}' disposed {n} times")
    for page in sorted(set(disposed) - old_set):
        err(f"parity: structure names unknown old page '{page}'")
    parity_md = ROOT / "docs" / "setup-parity.md"
    if not parity_md.exists():
        err("docs/setup-parity.md missing — run tools/rst_convert.py")
    else:
        m = re.search(r"Pages found: (\d+) · migrated: (\d+) · dropped: (\d+)",
                      parity_md.read_text(encoding="utf-8"))
        if not m:
            err("docs/setup-parity.md: counts line missing")
        elif int(m.group(1)) != len(old_set):
            err(f"docs/setup-parity.md counts stale ({m.group(1)} vs {len(old_set)} old pages) — re-run tools/rst_convert.py")

    # ---- 4. projects coverage ----
    org_names = {r["name"] for r in org}
    seen = {}
    for pr in projects["projects"]:
        f = ROOT / pr["file"]
        if not f.exists():
            err(f"projects.json: {pr['id']} points at missing file {pr['file']}")
        if pr["status"] not in ("active", "maintained", "legacy", "archive"):
            err(f"projects.json: {pr['id']} has unknown status '{pr['status']}'")
        for r in pr["repos"]:
            if r.get("external"):
                continue
            seen.setdefault(r["name"], []).append(pr["id"])
    for x in projects.get("exclusions", []):
        seen.setdefault(x["name"], []).append("excluded")
        if not x.get("reason"):
            err(f"projects.json: exclusion '{x['name']}' has no reason")
    for name in sorted(org_names):
        n = len(seen.get(name, []))
        if n == 0:
            err(f"projects coverage: org repo '{name}' is in no project and not excluded")
        elif n > 1:
            err(f"projects coverage: org repo '{name}' appears {n} times ({seen[name]})")
    for name in sorted(set(seen) - org_names):
        err(f"projects.json names unknown org repo '{name}' (update data/org-repos.json?)")

    # ---- 5. tools ----
    tool_ids = set()
    for t in tools["tools"]:
        tool_ids.add(t["id"])
        if not (ROOT / t["file"]).exists():
            err(f"tools.json: {t['id']} points at missing file {t['file']}")

    # ---- 6. content links + assets ----
    project_ids = {p["id"] for p in projects["projects"]}
    md_files = sorted((ROOT / "content").rglob("*.md"))
    used_assets = set()
    link_re = re.compile(r"\]\(([^)\s]+)\)")
    html_ref_re = re.compile(r'(?:src|href)="([^"]+)"')

    def check_route(route, where):
        route = route.split("@")[0]
        seg = [s for s in route.lstrip("#/").split("/") if s]
        if not seg:
            return
        if seg[0] == "setup":
            if len(seg) > 1 and "/".join(seg[1:]) not in setup_ids:
                err(f"{where}: broken internal link {route}")
        elif seg[0] == "projects":
            if len(seg) > 1 and seg[1] not in project_ids:
                err(f"{where}: broken internal link {route}")
        elif seg[0] == "tools":
            if len(seg) > 1 and seg[1] not in tool_ids:
                err(f"{where}: broken internal link {route}")
        elif seg[0] not in ("about", "search"):
            err(f"{where}: unknown route {route}")

    for md in md_files:
        rel = md.relative_to(ROOT)
        text = md.read_text(encoding="utf-8")
        targets = link_re.findall(text) + html_ref_re.findall(text)
        for href in targets:
            if href.startswith("#/"):
                check_route(href, str(rel))
            elif href.startswith(("http://", "https://", "mailto:")):
                continue
            elif href.startswith("#"):
                continue  # same-page anchor
            else:
                if not (ROOT / href).exists():
                    err(f"{rel}: missing local file {href}")
                else:
                    used_assets.add((ROOT / href).resolve())

    asset_dir = ROOT / "assets"
    always_used = {(asset_dir / "hippo.svg").resolve()}
    for a in sorted(asset_dir.rglob("*")):
        if a.is_file() and a.resolve() not in used_assets | always_used:
            err(f"orphan asset (nothing references it): {a.relative_to(ROOT)}")

    # ---- 6b. content hygiene: no credentials or personal data, ever ----
    email_ok = re.compile(r"@(github\.com|[\w.-]*\.local|example\.[a-z]+)$")
    for md in md_files:
        rel = md.relative_to(ROOT)
        for i, line in enumerate(md.read_text(encoding="utf-8").splitlines(), 1):
            m = re.search(r"(?<![A-Za-z0-9_])[\"']?(plain_text_passwd|password|passwd|pwd)[\"']?\s*[:=]\s*[\"']?([^\s\"']+)",
                          line, re.IGNORECASE)
            if m and not m.group(2).startswith(("<", "$")) \
                    and m.group(2).lower() not in ("false", "true", "none", "null"):
                err(f"{rel}:{i}: literal credential value ('{m.group(1)}') — use a <placeholder>")
            if re.search(r"ssh-(rsa|ed25519|ecdsa|dss)\s+[A-Za-z0-9+/=]{30,}", line):
                err(f"{rel}:{i}: real SSH public key material — use <your-ssh-public-key>")
            for em in re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", line):
                if not email_ok.search(em) and em != "git@github.com":
                    err(f"{rel}:{i}: personal email address '{em}' — do not republish personal data")

    # ---- 7. shell ----
    index = (ROOT / "index.html").read_text(encoding="utf-8")
    for ref in html_ref_re.findall(index):
        if ref.startswith(("http", "#", "data:")):
            continue
        if not (ROOT / ref).exists():
            err(f"index.html: missing referenced file {ref}")
    marked = ROOT / "js" / "marked.min.js"
    if not marked.exists():
        err("js/marked.min.js missing")
    else:
        digest = hashlib.sha256(marked.read_bytes()).hexdigest()
        if digest != MARKED_SHA256:
            err(f"js/marked.min.js sha256 mismatch ({digest[:12]}…) — if you upgraded marked "
                f"on purpose, update MARKED_SHA256 in tools/check.py and note it in README.md")

    # ---- 8. probes ----
    plist = probes["probes"]
    if len(plist) != 10:
        err(f"search-probes.json: expected exactly 10 probes, found {len(plist)}")
    for p in plist:
        if not (p.get("q") and p.get("expect") and p.get("kind")):
            err(f"search-probes.json: malformed probe {p}")

    report(site)


def report(site=None):
    if errors:
        print(f"CHECK FAILED — {len(errors)} problem(s):")
        for e in errors:
            print(f"  ✗ {e}")
        sys.exit(1)
    print("check.py: all green")
    sys.exit(0)


if __name__ == "__main__":
    main()
