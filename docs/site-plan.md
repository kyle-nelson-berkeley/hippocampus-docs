# HippoCampusRobotics documentation site — plan

*Phase-0 checkpoint · 2026-08-28 · author: first build session.*
*This file is the architecture record. Progress lives in `PROGRESS.md`; per-phase evidence in the run result files.*

## 1. What this site is

One home for the HippoCampusRobotics lab:

1. **Setup** — replaces <https://hippocampusrobotics.github.io/docs/> (the Sphinx site).
2. **Projects** — the whole team's work, active and past, grouped from all 94 org repos + the CAD repo.
3. **Search** — in-browser search over every code repo + CAD, precomputed static index, deep links.
4. **Agent tools** — the lab's MCP servers, documented from scratch for new users.
5. (Private, separate repo) **Team onboarding** — gets a new member's agents working with this site.

It supersedes Kyle's learning-to-swim story site as the team record. Staging deploys to
Kyle's own GitHub Pages (public repo — **gated on Kyle's approval**); the org stays untouched.

## 2. Tech stack — zero-build static, vanilla JS

**Choice: no framework, no npm, no build step.** `index.html` + `css/site.css` + `js/app.js`
(hash router + renderers) + one vendored MIT library (`js/marked.min.js` for Markdown).
Content is Markdown files under `content/` plus strict-JSON registries under `data/`;
`tools/check.py` (stdlib-only) is the pre-commit gate, in the spirit of the story site's
proven model. Serving is `python3 -m http.server` locally and GitHub Pages as-is in production.

Why: the story site demonstrated that this model is the one agents and humans both edit
safely — data-driven pages, a strict-JSON contract, a check gate that fails loudly, and
nothing to install. A generator (Sphinx/MkDocs/Astro) would add a build pipeline the
site-update MCP (phase 4) would have to drive, plus dependency drift; the custom search UI
and portfolio-style project pages need hand-built JS/CSS either way. GitHub Pages serves
static files, so zero-build deploys byte-identical to local preview. Hash routing
(`#/setup/...`) avoids GH-Pages 404 tricks and keeps every page deep-linkable.

Migration tooling (`tools/rst_convert.py`, run once, output committed) converts the old
site's RST; it is not a runtime or deploy dependency. Dark theme default (portfolio look)
with a light toggle via CSS custom properties.

## 3. Site map

```
#/                         Home: what the lab is, the four sections, search bar
#/setup                    Setup index (replaces hippocampusrobotics.github.io/docs)
#/setup/<page>             Migrated + reorganized setup pages (see §4 groups)
#/projects                 Projects index — card grid (portfolio Engineering.tsx layout)
#/projects/<id>            Project page — portfolio ProjectDetail.tsx layout:
                           title/status header, overview, sidebar (repos, hardware,
                           docs links), sections (What it is / How it works / Status)
#/tools                    Agent tools index
#/tools/<id>               Per-tool page: what it does, from-scratch setup, examples,
                           safety/cost notes (runpod-mcp, onshape-mcp, cloudinary gap note)
#/search?q=...             Search results (also a header search box on every page)
#/about                    Colophon: how the site is built, conventions, how to edit
```

## 4. Content inventory

### 4.1 Setup (from the `docs` repo, Sphinx RST, cloned at HEAD 2026-08-28)

- **97 RST pages** exist; the live site serves all of them 1:1 (verified: even
  toctree-orphans like `hardware/acoustic_modems` return 200).
- Plan: **migrate 69 current-generation pages**, **drop 28** (the `ros_deprecated`
  subtree: 27 pages + its `misc/ros_deprecated.rst` index) with the reason
  "deprecated ROS 1 content; superseded by the ROS 2 pages; preserved in the old
  site and its git history".
- The full page-by-page parity table is written during phase 1 to
  `docs/setup-parity.md` (done-bar 2 artifact) with counts found/migrated/dropped.
- New Setup groups (reorganized, Diátaxis-leaning, old caption in parentheses):
  Getting started (Getting Started) · Concepts (Concepts) · Raspberry Pi setup
  (Raspberry Pi Setup) · Vehicle bring-up (HippoCampus: ESC/FCU/motors; BlueROV pages)
  · Hardware reference (Hardware + Work in the Lab) · Lab systems (Qualisys, Gantry,
  Time sync, Cameras, RF) · Contributing (Contributing) · plus per-page redirects
  documented in the parity table.
- `fav_docs` (course docs) is **reference, not migration source** — the Setup section
  replaces `docs` only; fav_docs pages are linked where they add course context.
- The `docs` repo has **no license file**; content is the lab's own. Every migrated
  page carries a "migrated from <old URL>" provenance line. Org cut-over remains a
  team decision (out of scope).
- Images: referenced files under `res/images/` are copied into `assets/setup/`.

### 4.2 Projects (94 org repos + 1 external CAD repo)

Org enumerated 2026-08-28 via `gh repo list HippoCampusRobotics` → `data/org-repos.json`
(94 repos; the brief said 93 — the difference is the `.github` org-profile repo).
Grouping draft (~15 projects; final roster lives in `data/projects.json`, and
`tools/check.py` enforces: every org repo appears exactly once across project rosters
or the exclusion list):

| Project | Repos (†= upstream fork, *= external) |
|---|---|
| HippoCampus vehicle | hippocampus-cad*, hippocampus_pcbs, hardware, hardware_interfaces, esc, esc_serial, teensy_esc_controller, tgy†, TeensyST7735, camera |
| Core software stack (ROS 2) | hippo_core, hippo_common, hippo_common_msgs, hippo_msgs, hippo_control, hippo_control_msgs, hippo_robot, hippo_full, state_estimation, state_estimation_msgs, remote_control, stabilizer, switch, Firmware†, px4_msgs† |
| Simulation | hippo_sim, hippo_gz_plugins, hippo_simulation, sitl_gazebo†, acoustic_simulator, UWRange_acoustic_simulator† |
| Localization | visual_localization, mu_auv_localization†, ext_auv_localization†, acoustic_localization, RF_Localization†, rf_localization_ros†, apriltag_ros†, apriltag_msgs†, apriltag_viz, apriltags, vision |
| Acoustics & DVL | dvl, dvl_msgs, acoustic_msgs, acoustic_msgs-release |
| Scalar-field exploration & path planning | scalar_field_belief, scalar_field_sim, scalar_field_interfaces, path_planning, rapid_trajectories, rapid_trajectories_msgs, ir_field_hardware, ir_adc_read |
| UVMS (BlueROV2 + Alpha 5 arm) | uvms, uvms_msgs, alpha_msgs |
| Lab & tank infrastructure | qualisys_bridge, gantry, gantry_control, gantry_gui, gantry_msgs, rqt_gantry, buttons, buttons_msgs |
| Radio & communications | SiK†, radio_firmware, radio_tools, hippolink, hippolink_ros, sdr, sdr_msgs, mavlink†, mavlink_headers, mavros† |
| Cameras | mjpeg_cam, mjpeg_cam_ros1†, event_camera_example |
| Deployment & infrastructure | hippo_deployment, hippo_infrastructure, buildbot, hippo-release |
| Legacy ROS 1 stack (archive) | hippocampus_common, hippocampus_msgs, hippocampus_sim, control, multi_uuv, howto, bag2to1 |
| Teaching (Formulas & Vehicles) | fav_docs, python-onramp |
| Documentation & site | docs, hippocampusrobotics.github.io |
| Fun | hippo-christmas |

Exclusions (with reasons): `.github` (org profile config, not a project).
Statuses (active/maintained/legacy) derive from `pushedAt` + role, reviewed by hand.
People: project pages name no individuals beyond what is public in the org (and any
naming beyond that is a Kyle-approval item).

CAD: index **FinnBreu/hippocampus-cad only** (canonical, not a fork; Kyle's copy is a
fork at the identical HEAD `68fc2ad`, zero divergence — verified 2026-08-28).

### 4.3 Agent tools

- `runpod-mcp` (public at kyle-nelson-berkeley/runpod-mcp) — document as
  "external GPU compute for the lab", generalized beyond the learning-to-swim project.
- `onshape-mcp` (public at kyle-nelson-berkeley/onshape-mcp) — CAD access for agents.
- Cloudinary: **no MCP exists**; the closest is Kyle's `cloudinary-upload` skill.
  The tools section documents the gap honestly instead of inventing a repo.
- Phase-0 security audit (gitleaks 8.30.1, working tree + full history + PII greps):
  see §7 — zero secrets; two low-severity hygiene items queued for the phase-3
  Kyle-approval batch.

## 5. Search design (phase 2)

- **Corpus**: (a) site pages (setup/projects/tools) split by heading; (b) every org
  code repo via graphify AST extraction (deterministic, no LLM/API key needed for code)
  → symbols: classes, functions, files with repo + path; (c) CAD part list from
  `data/cad-tree.json` (190 files — .ipt/.iam/.dwg part names).
- **Index**: static JSON shards under `search/` (`site.json`, `cad.json`,
  `code-<repo>.json`), a `search/manifest.json` listing shards; shards lazy-load on
  first search. Tokenization splits camelCase/snake_case; scoring is BM25-ish with
  field boosts (exact name ≫ heading ≫ body) — "semantic" is served by indexing
  graphify's summarized/aliased node names plus enrichment metadata (repo, folder,
  section), not by runtime embeddings (static site, $0, no keys).
- **Deep links**: site hits → `#/setup/<page>@<heading-slug>`; code hits → GitHub blob
  URL (repo default branch + file path); CAD hits → GitHub blob URL in FinnBreu's repo.
- **Size honesty**: per-shard byte budget (target ≤ 300 KB/repo, total ≤ ~10 MB);
  anything dropped to meet it is logged in the phase-2 checkpoint, never silent.
- **Graphify list**: all non-fork org repos get AST graphify; upstream forks
  (Firmware, px4_msgs, mavlink, mavros, SiK, tgy, sitl_gazebo, apriltag_msgs,
  apriltag_ros, mjpeg_cam_ros1, RF_Localization, rf_localization_ros,
  mu_auv_localization, ext_auv_localization, UWRange_acoustic_simulator) are indexed
  **shallowly** (top-level file list only) — their content is upstream's, and full
  symbol indexes of PX4 alone would dwarf the lab's own code. Logged as a scope rule,
  not a truncation.
- Derived indexes are committed to THIS repo only — never to any source repo.

### The 10 probe queries (done-bar 4; verified against real content 2026-08-28)

| # | Query | Expected top-3 deep link |
|---|---|---|
| 1 | `GeometricController` | hippo_control `include/hippo_control/attitude_control/geometric_controller.hpp` (class verified) |
| 2 | `thruster model` | hippo_control `include/hippo_control/thruster_model.hpp` |
| 3 | `ScalarFieldBelief` | scalar_field_belief `scalar_field_belief/belief.py` (class verified) |
| 4 | `ekf` | qualisys_bridge `include/qualisys_bridge/ekf.hpp` |
| 5 | `pixhawk` | CAD `internals/board_pixhawk-6c.ipt` |
| 6 | `pressure sensor` | CAD `base/bluerobotics_pressure_sensor.ipt` |
| 7 | `install ros` | Setup page migrated from `getting_started/ros_installation` |
| 8 | `uart` | Setup page migrated from `raspberry_pi_setup/uart_configuration` |
| 9 | `qualisys` | Project page "Lab & tank infrastructure" (or its qualisys_bridge entry) |
| 10 | `runpod` | Tools page for runpod-mcp |

### Search phase 3 — the librarian walks the graph (2026-09-05)

The keyword index above still answers single words and exact symbol names on its own, with
zero network. Every multi-word query is also sent to the librarian, a Vercel function
(`api/librarian.js`) that walks the site's own knowledge graph (`data/graph/`) in at most two
model calls (three counting one fallback call):

- **Hop 1 — survey.** The model sees the query, the keyword hits (may be empty) and a ~43 KB
  catalog with an id per entry: every page (`page:<route>`), every repository (`repo:<name>`,
  with project, fork flag and up to 6 main symbols) and every CAD part (`cad:<path>`). It
  returns direct hits with a one-line `why` each and, only when the keyword list is short
  (fewer than 3 hits — the case keyword search failed on), up to 3 repositories worth opening.
- **Hop 2 — walk.** Only when hop 1 opened repositories: the model sees each opened repo's
  condensed graphify shard (description, main symbols with paths, communities), its file list
  and the index symbols sharing a query token, plus the wiki-graph neighbours of the hop-1 hits
  (in and out edges). It returns the final ranking, which may add `sym:` and `file:` ids.
- **Resolution.** Every id is checked against real site data and turned into a row
  byte-identical to the client's own index row (pages → route, repos → GitHub URL, symbols and
  CAD → GitHub blob URL); unknown ids are dropped; at most 8 rows. A keyword hit the model kept
  always leads the graph rows, and the browser pins a local leader whose title covers every
  query word to position 1.
- **Budget.** 13 s of search time inside the function's 15 s `maxDuration`; at most 3 calls;
  each call clamped to the time left and never started with under 2.5 s remaining. Models are
  free `:free` OpenRouter entries only (NVIDIA Nemotron super primary, Nemotron nano fallback),
  never Llama; the account buys no credit, so the free tier's 50 requests per day is the real
  cap — roughly 16 graph searches a day before the keyword answer takes over.
- **Degradation.** A failed hop 2 returns the hop-1 rows (`partial: true`); a failed hop 1
  returns 502 and the browser shows the keyword answer with a notice; when every failure is an
  upstream 429 the response says `exhausted: true` and the notice says the daily free requests
  are spent. A repeated query in the same session is answered from memory, never re-sent.
- **Probes.** The two motivating queries ("ESC I2C firmware", "motor mount CAD") are
  `kind: "semantic"` entries in `data/search-probes.json` (expected targets in the top 3);
  `tools/bench_librarian.mjs --probes` measures all twelve against a base URL, and
  `tools/dev_site.mjs --mock-provider=graph|quota` exercises the plumbing without spending quota.

## 6. Conventions (grounded in the "Documenting Robotics Projects" notebook, queried 2026-08-28)

- **Docs-as-code**: prose in Markdown, in git, PR-reviewed; no external wiki.
- **Diátaxis-leaning IA**: tutorials (Getting started) / how-to (bring-up, lab systems)
  / reference (hardware, projects) / explanation (concepts) kept distinct.
- **Setup-guide shape**: requirements up front; numbered chronological steps;
  a verification step ends every guide; callout boxes separate safety warnings.
- **Project-page shape**: elevator pitch + status badge; real photo over CAD render
  where available; quick links; directory/repo map; hardware facts; testing/verification.
- **Search shape**: heading-split chunks, metadata-enriched (file, section, repo names)
  for keyword search; TOC on long pages; stable anchors.
- **Docs-as-you-go** (for the site itself and phase 4): update docs in the same change
  as the public surface they describe; `tools/check.py` is the automated review gate;
  ownership is per-section and machine-checkable (registries in `data/`).
- **Agent-consumable**: strict-JSON registries, one obvious edit path per content type,
  a check gate that explains failures — the conventions the phase-4 MCP will encode.

## 7. Phase-0 public-repo audit (already-exposed code)

`gitleaks 8.30.1` (`gitleaks git` = full history; `gitleaks dir` = working tree) on
fresh clones of kyle-nelson-berkeley/{runpod-mcp, onshape-mcp}, plus manual greps of
`git log --all -p` for emails, `/Users/kyle` paths, names, key shapes, and account IDs.

- **Zero gitleaks findings** in both repos, both modes.
- No `/Users/kyle` paths anywhere in either history.
- All `rpa_*` strings are deliberate test fixtures with scrub assertions.
- Low-severity (phase-3 fix batch, needs Kyle's push approval):
  1. runpod-mcp `tests/test_tools.py` uses what looks like a **real pod id**
     (`on2ghkedz0vbjr`, pod name `lts-replication`, billing amount $0.56) as fixture
     data. Not a credential; against Kyle's own no-pod-ids hygiene rule. Fix: replace
     with an obviously fake id.
  2. `kyle-nelson@berkeley.edu` appears as git author identity and in
     `pyproject.toml` authors (both repos) — Kyle's normal public attribution;
     flagged for awareness, no action proposed.

## 8. Kyle approval gates (open questions, phase-batched)

1. **Phase 1→staging**: create the public site repo under kyle-nelson-berkeley and
   enable GitHub Pages (public the moment it exists). Until approved: local git only.
2. **Phase 3**: push the runpod-mcp fixture fix (item 7.1); approve tools-section
   content about the two public repos.
3. **Phase 4**: create the private onboarding repo (`hippocampus-team-onboarding`).
4. Any naming of team members beyond what is public in the org.
5. FYI item for the underwater-localization repo (not this build): its CLAUDE.md rule
   "do not deep-read the HippoCampusRobotics org" deserves an update note now that
   Kyle authorized whole-org reading for this docs build.

## 9. Phase plan

- **Phase 0 (this checkpoint)**: recon, audit, inventory, this plan. ✔
- **Phase 1**: skeleton, Setup migration (69 pages + parity table), Projects section
  (15 project pages + coverage check), local serve + link check, codex-review.
- **Phase 2**: graphify pipeline → `search/` shards; search UI; verify the 10 probes.
- **Phase 3**: tools section; sanitized fixes from §7 (Kyle-gated pushes).
- **Phase 4**: private onboarding repo + site-update MCP/SDK (lives in that repo).
