# Build progress

One dated checkpoint per phase. Depth lives in `docs/site-plan.md`; run evidence in the
result files under `~/.claude-os/prompts/`.

## Phase 0 — recon + inventory + public-repo audit · 2026-08-28

- **Audit (ran first, repos are already public)**: gitleaks 8.30.1 over fresh clones of
  kyle-nelson-berkeley/{runpod-mcp, onshape-mcp} — full git history AND working tree:
  **zero findings** in both. Manual history greps: no `/Users/kyle` paths; all `rpa_*`
  strings are test fixtures with scrub assertions. Two low-severity items queued for the
  phase-3 Kyle batch (real-looking pod id `on2ghkedz0vbjr` + pod name + $0.56 in runpod-mcp
  test fixtures; author-email attribution noted FYI). Nothing hot.
- **Org inventory**: 94 repos enumerated (brief said 93; the extra is `.github`) →
  `data/org-repos.json`. All 94 READMEs skimmed; grouping draft: 15 projects + 1 exclusion
  (site-plan §4.2).
- **Setup source**: the old site is Sphinx RST — 97 pages, all served 1:1 (orphans included,
  spot-checked live with 200s). Plan: migrate 69, drop 28 (`ros_deprecated` subtree)
  with reasons. Directive census done (code-block 265, notes 58, tabs 36, figures 20 …)
  → custom `tools/rst_convert.py` is feasible; pandoc not needed.
- **CAD**: FinnBreu/hippocampus-cad is canonical (not a fork), 190 files at `68fc2ad`;
  Kyle's copy is a fork at the identical commit (zero divergence) → index FinnBreu only.
  Snapshot in `data/cad-tree.json`.
- **Cloudinary**: no MCP exists; closest is the `cloudinary-upload` skill. Documented as a
  gap, not invented.
- **NotebookLM**: 11 grounding queries against "Documenting Robotics Projects"
  (f29ca7f4…, queries only, no new research passes) → conventions in site-plan §6.
- **Probes**: 10 search probes defined from verified real content (site-plan §5).
- **Decisions**: zero-build vanilla static stack (site-plan §2); hash routing; strict-JSON
  registries + `tools/check.py` gate; search = static JSON shards + client-side BM25-ish
  scoring, graphify AST for code; forks indexed shallowly (scope rule, logged).
- **Open Kyle gates**: site-plan §8 (staging repo publicity is gate #1).
