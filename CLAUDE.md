# hippocampus-docs — agent operating rules

Zero-build static site. There is NO build step: what you edit is what serves.

## The one law

Run `python3 tools/check.py` after every change; it must print "all green" before any
commit. When images, `data/cloudinary-manifest.json`, or people-card links changed, ALSO
run `python3 tools/check_urls.py` (the network half of the gate — it probes exactly those
URLs; check.py stays offline) and it must pass. Never weaken a check to pass it — fix the
content it complains about.

## Edit map

- Setup page prose: `content/setup/<group>/<page>.md` (Markdown; raw-HTML wrappers
  `<div class="adm adm-note">`/`<div class="tabs">` are part of the dialect).
- Setup structure: prefer re-running `tools/rst_convert.py` over hand-editing
  `data/setup.json` (the converter also regenerates `docs/setup-parity.md`). The converter
  reads `data/cloudinary-manifest.json`: images with a manifest entry are emitted as
  Cloudinary URLs (the site serves images from the CDN; local `assets/` files are the
  upload sources); an image without an entry is listed loudly at the end of the run and
  must be uploaded before commit.
- Images: hosted on Cloudinary (folder `hippocampus-docs/`), mapped in
  `data/cloudinary-manifest.json`. Upload via the cloudinary-upload skill from the
  portfolio repo (credentials live there), add the manifest entry, reference the manifest
  URL. Local originals stay in `assets/` as sources. Exceptions that stay local:
  `assets/hippo.svg` (brand mark) and the `.stl`/`.3mf`/`.pdf` downloads.
- Projects: facts in `data/projects.json` (strict JSON), prose in
  `content/projects/<id>.md`. Coverage rule: every org repo in exactly one project.
- Tools: `data/tools.json` + `content/tools/<id>.md`.
- People roster (About page cards): `data/people.json` — a card is name, title, optional
  photo (a manifest URL), optional link; link decisions are recorded in
  `docs/people-links.md`. Cards without a link get no hover affordance.
- After content changes, refresh the site search shard:
  `python3 tools/build_search_index.py --site-only` (plain python3; the full code
  reindex needs clones + graphify — see the script header).

## Hard rules

- No credentials, key material, or personal emails in content — check.py enforces;
  placeholders look like `<yours>`.
- No new dependencies, no npm, no build tooling. Vendored marked stays sha256-pinned.
- Preview: `./tools/serve.sh` → http://localhost:8130 (file:// cannot fetch content).
- Publishing anything (GitHub repo, Pages) is Kyle-gated — build locally.
