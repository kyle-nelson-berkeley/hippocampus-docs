# hippocampus-docs — agent operating rules

Zero-build static site. There is NO build step: what you edit is what serves.

## The one law

Run `python3 tools/check.py` after every change; it must print "all green" before any
commit. Never weaken a check to pass it — fix the content it complains about.

## Edit map

- Setup page prose: `content/setup/<group>/<page>.md` (Markdown; raw-HTML wrappers
  `<div class="adm adm-note">`/`<div class="tabs">` are part of the dialect).
- Setup structure: prefer re-running `tools/rst_convert.py` over hand-editing
  `data/setup.json` (the converter also regenerates `docs/setup-parity.md`).
- Projects: facts in `data/projects.json` (strict JSON), prose in
  `content/projects/<id>.md`. Coverage rule: every org repo in exactly one project.
- Tools: `data/tools.json` + `content/tools/<id>.md`.
- After content changes, refresh the site search shard:
  `python3 tools/build_search_index.py --site-only` (plain python3; the full code
  reindex needs clones + graphify — see the script header).

## Hard rules

- No credentials, key material, or personal emails in content — check.py enforces;
  placeholders look like `<yours>`.
- No new dependencies, no npm, no build tooling. Vendored marked stays sha256-pinned.
- Preview: `./tools/serve.sh` → http://localhost:8130 (file:// cannot fetch content).
- Publishing anything (GitHub repo, Pages) is Kyle-gated — build locally.
