# onshape-mcp

**CAD access for agents.** An MCP server that lets an AI agent read
[Onshape](https://www.onshape.com/) documents: list parts and assemblies, read metadata,
and pull the structure a docs or analysis task needs — without a human exporting files
by hand.

Repository: <https://github.com/kyle-nelson-berkeley/onshape-mcp> (public; security-audited
2026-08-28 — gitleaks over full history and working tree, zero findings).

<div class="adm adm-note"><p class="adm-title">Status</p>

The from-scratch setup guide (Onshape API keys, permissions, first agent query) lands here
in the agent-tools build phase. Until then the repository's own README is the reference.

</div>

## Where it fits in the lab

The canonical HippoCampus CAD lives in
[FinnBreu/hippocampus-cad](https://github.com/FinnBreu/hippocampus-cad) as Autodesk
Inventor files; Onshape is used for cloud-collaborative work. This tool covers the
Onshape side. CAD **part search** on this site does not need it — that runs on a
precomputed index of the CAD repository's file tree.
