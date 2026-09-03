#!/usr/bin/env python3
"""The liveness gate — the ONLINE twin of tools/check.py.

  python3 tools/check_urls.py            # image URLs fatal, people links advisory
  python3 tools/check_urls.py --strict    # people links fatal too

tools/check.py is offline by design: it proves the manifest and the content
agree with each other, but it cannot know whether a URL still serves. This
script asks the network:

  1. every res.cloudinary.com URL referenced in content/**.md and index.html;
  2. every 'url' in data/cloudinary-manifest.json;
  3. when data/people.json exists: every "photo" URL (joins set 1/2) and every
     "link" URL (a separate, softer set).

Image URLs must answer 200 — a broken image is a broken page, so any failure is
fatal. People links are advisory unless --strict: a transient tuhh.de outage
must never teach a future editor to delete a link that is in fact fine.

Stdlib only (urllib) — no dependencies, like every other tool here.
"""
import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CLOUDINARY_RE = re.compile(r"https?://res\.cloudinary\.com/[^\s)\"'<>\]]+")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")
TIMEOUT = 15
WORKERS = 4          # polite: a handful of connections, never a flood


def _walk(node, path=""):
    """Yield (key-name, string value) for every string in a JSON document."""
    if isinstance(node, dict):
        for k, v in node.items():
            yield from _walk(v, str(k))
    elif isinstance(node, list):
        for v in node:
            yield from _walk(v, path)
    elif isinstance(node, str):
        yield path, node


def collect(root=ROOT):
    """Return (image_urls, people_links) as sets. Never touches the network."""
    images, links = set(), set()

    texts = [p.read_text(encoding="utf-8") for p in sorted((root / "content").rglob("*.md"))]
    index = root / "index.html"
    if index.exists():
        texts.append(index.read_text(encoding="utf-8"))
    for text in texts:
        for url in CLOUDINARY_RE.findall(text):
            images.add(url.rstrip(".,;:"))

    manifest = root / "data" / "cloudinary-manifest.json"
    if manifest.exists():
        try:
            doc = json.loads(manifest.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            print(f"data/cloudinary-manifest.json: not valid JSON ({e}) — run check.py")
            sys.exit(1)
        for a in doc.get("assets", []):
            if a.get("url"):
                images.add(a["url"])

    people = root / "data" / "people.json"          # not there yet; that is fine
    if people.exists():
        try:
            doc = json.loads(people.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            print(f"data/people.json: not valid JSON ({e}) — run check.py")
            sys.exit(1)
        for key, value in _walk(doc):
            if not value.startswith(("http://", "https://")):
                continue
            if key == "photo":
                images.add(value)
            elif key == "link":
                links.add(value)
    return images, links


def _request(url, method):
    req = urllib.request.Request(url, method=method, headers={
        "User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        if method == "GET":
            resp.read(1)            # touch the body, do not download it
        return resp.status


def _status(url, method):
    try:
        return _request(url, method), None
    except urllib.error.HTTPError as e:
        return e.code, None
    except Exception as e:          # URLError, timeout, DNS, TLS…
        return None, f"{type(e).__name__}: {e}"


def _attempt(url):
    """One full attempt: HEAD, then GET when HEAD is refused. -> (ok, detail)"""
    code, netfail = _status(url, "HEAD")
    if netfail:
        return False, netfail
    if code == 200:
        return True, "200"
    if code in (403, 405, 501) or code >= 500:   # servers that dislike HEAD
        code, netfail = _status(url, "GET")
        if netfail:
            return False, netfail
        if code == 200:
            return True, "200"
    return False, f"HTTP {code}"


def probe(url):
    """Return (ok, detail). One short retry on a network wobble or a 5xx."""
    ok, detail = _attempt(url)
    if ok:
        return True, detail
    if not detail.startswith("HTTP ") or detail.startswith("HTTP 5"):
        time.sleep(1.5)
        ok, detail = _attempt(url)
    return ok, detail


def run(urls):
    urls = sorted(urls)
    if not urls:
        return []
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        return list(zip(urls, pool.map(probe, urls)))


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--strict", action="store_true",
                    help="treat a failing people.json link as fatal too")
    args = ap.parse_args()

    images, links = collect()
    img_results = run(images)
    link_results = run(links)

    img_bad = [(u, d) for u, (ok, d) in img_results if not ok]
    link_bad = [(u, d) for u, (ok, d) in link_results if not ok]

    print(f"images: {len(img_results)} referenced / "
          f"{len(img_results) - len(img_bad)} passing")
    if links:
        print(f"people links: {len(link_results)} referenced / "
              f"{len(link_results) - len(link_bad)} passing")

    if img_bad:
        print(f"\ndead image URL — the page is broken until this serves again "
              f"({len(img_bad)}):")
        for u, d in img_bad:
            print(f"  ✗ {u} — {d}")
    if link_bad:
        head = "stale link — verify and edit data/people.json"
        print(f"\n{head} ({len(link_bad)}"
              f"{'' if args.strict else ', non-fatal'}):")
        for u, d in link_bad:
            print(f"  {'✗' if args.strict else '!'} {u} — {d}")

    fatal = bool(img_bad) or (args.strict and bool(link_bad))
    if fatal:
        sys.exit(1)
    print("check_urls.py: all reachable")
    sys.exit(0)


if __name__ == "__main__":
    main()
