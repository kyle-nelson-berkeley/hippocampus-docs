# onshape-mcp

**CAD access for agents.** An MCP server that drives [Onshape](https://www.onshape.com/)
from an AI agent through the Onshape REST API: parametric modeling (sketches, extrudes,
revolves, fillets, patterns), FeatureScript queries, and STL/STEP export with
verification. An agent can build and modify real parts, not just read them.

Repository: <https://github.com/kyle-nelson-berkeley/onshape-mcp> · MIT · Python.
Security audit 2026-08-28: gitleaks 8.30.1 over the full git history AND working tree —
**zero findings** (evidence: `docs/security-audit-2026-08-28.md` in this site's repo).

<div class="adm adm-attention"><p class="adm-title">API quota</p>

Onshape EDU/Free accounts get roughly **2,500 API calls per user per year**. Exhaustion
returns HTTP 402 and no retry fixes it. The server keeps a persistent call counter at
`~/.config/onshape-mcp/call_log` — watch it, do not poll, and prefer the zero-cost
analysis tools (`analyze_stl`, `compare_stl`).

</div>

## From-scratch setup (no lab context assumed)

Prerequisites: [uv](https://docs.astral.sh/uv/) (`brew install uv`), an Onshape account
(free/EDU is fine), [Claude Code](https://claude.com/claude-code) or another MCP client.

1. Create API keys at <https://dev-portal.onshape.com/keys> — you get an access key and
   a secret key pair.
2. Clone and install:

   ```console
   $ git clone https://github.com/kyle-nelson-berkeley/onshape-mcp.git
   $ cd onshape-mcp
   $ uv sync --no-editable
   ```

   (`--no-editable` is deliberate: on macOS, editable installs under `.venv` can
   silently stop importing with Python ≥3.13.8 — the README explains the details.)

3. Store the credentials — the interactive setup writes them to
   `~/.config/onshape-mcp/.env` with permissions `600`, never into the project:

   ```console
   $ uv run --no-editable onshape-mcp setup
   $ uv run --no-editable onshape-mcp doctor   # live auth smoke test (4 API calls)
   ```

4. Register the server in the project where you want it, replacing the path:

   ```console
   $ /absolute/path/to/onshape-mcp/install.sh
   ```

   or by hand in that project's `.mcp.json`:

   ```json
   {
     "mcpServers": {
       "onshape": {
         "command": "uv",
         "args": ["run", "--quiet", "--no-editable", "--project", "/absolute/path/to/onshape-mcp", "onshape-mcp"]
       }
     }
   }
   ```

5. Verify offline (no API calls, no credentials needed):

   ```console
   $ uv run --no-editable pytest
   ```

## The rules that keep agents out of trouble

- **Transient entity IDs go stale after any mutation** — re-query with `find_entities`
  right before using them. Feature IDs are stable; prefer them.
- **Check `featureStatus` after every modeling call**: `OK` proceed, `ERROR` fix or
  delete the feature before continuing.
- Units default to inches; dimension strings like `"25 mm"` pass through. File paths
  must be absolute.
- Be frugal with calls (see the quota box above).

## Where it fits in the lab

The canonical HippoCampus CAD lives in
[FinnBreu/hippocampus-cad](https://github.com/FinnBreu/hippocampus-cad) as Autodesk
Inventor files; Onshape is the cloud-collaborative side. This site's CAD **search** does
not use this server — part search runs on a precomputed index of the CAD repository.
