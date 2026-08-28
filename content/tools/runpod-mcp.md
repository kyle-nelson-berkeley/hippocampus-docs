# runpod-mcp

**External GPU compute for the lab.** An MCP server that lets an AI agent rent a cloud
GPU on [RunPod](https://www.runpod.io/), run long jobs on it, watch them, and — the part
that matters — reliably stop the meter. It was built for a reinforcement-learning
replication and generalizes to any lab task that needs a big GPU for a few hours:
training runs, large simulations, batch renders.

Repository: <https://github.com/kyle-nelson-berkeley/runpod-mcp> · MIT · Python.
Security audit 2026-08-28: gitleaks 8.30.1 over the full git history AND working tree —
**zero findings** (evidence: `docs/security-audit-2026-08-28.md` in this site's repo).

<div class="adm adm-warning"><p class="adm-title">Costs real money</p>

A running pod bills by the minute whether you use it or not. This server's guardrails
(cost ceilings, idle watchdog, dead-man switch) exist because of that. Never start a pod
you do not have a plan to stop, and prefer `supervise` runs over manual pods.

</div>

## What an agent gets

- **Pod lifecycle with guardrails in code**: one pod per configured vehicle/profile,
  a fixed GPU type, no spot instances, network volume required, and termination only
  with an explicit typed confirmation string. Deletion is never automatic.
- **Jobs that survive disconnects**: a job runs detached on the pod with its state on
  the network volume — your laptop can sleep; the job, its log, and its exit code are
  still there. Wall-clock ceilings are enforced with `timeout`.
- **Watchers on both sides**: an idle watchdog on the pod stops it when nothing is
  running; a Mac-side `deadman.sh` arms a local stop-fuse; `supervise.sh` runs the whole
  launch→poll→pull→stop loop unattended.
- **Billing as a tool call**: "what did this cost" is answered by the server, not a
  dashboard visit.

## From-scratch setup (no lab context assumed)

Prerequisites: a Mac (the API key lives in the macOS Keychain), [Claude Code](https://claude.com/claude-code)
or another MCP client, Python 3.11+, an SSH keypair at `~/.ssh/id_ed25519` (create one
with `ssh-keygen -t ed25519` if you have none).

1. Create a RunPod account at <https://www.runpod.io/> and add billing credit
   (start small — $10 goes a long way on a single-GPU pod).
2. Create an API key in the RunPod console (Settings → API Keys) and store it in the
   macOS Keychain — never in a file or shell history:

   ```console
   $ security add-generic-password -a <your-macos-username> -s runpod-api-key -w '<yours>'
   ```

3. Clone the server:

   ```console
   $ git clone https://github.com/kyle-nelson-berkeley/runpod-mcp.git
   ```

4. Tell the server your Keychain account name: the lookup account is set in
   `runpod_mcp/config.py` (it ships with the author's username; change it to yours —
   the same name you used with `-a` above).
5. Adapt the pod profile: `pod_defaults.yaml` defines the pod names, GPU type, and
   volume the guardrails enforce. As shipped they carry the original project's names —
   rename them for your task. The guardrail model ("only these named pods, only this
   GPU") is the feature; the names are just configuration.
6. Register the server in your project's `.mcp.json` (absolute path; `run.sh` creates
   its own virtualenv on first launch):

   ```json
   {
     "mcpServers": {
       "runpod": { "command": "bash", "args": ["/absolute/path/to/runpod-mcp/run.sh"] }
     }
   }
   ```

7. Verify before spending a cent — the offline tests need no network and no key:

   ```console
   $ runpod-mcp/.venv/bin/python -m pytest runpod-mcp/tests -q
   ```

   Then a read-only live check (a few $0 GET calls):

   ```console
   $ RUNPOD_MCP_LIVE=1 runpod-mcp/.venv/bin/python -m pytest runpod-mcp/tests/test_live.py -q
   ```

8. First real use: start your agent, ask it to list pods (read-only), then to start
   one with a cost ceiling. Confirm you can stop it from the RunPod console too —
   know your manual override before trusting the automatic ones.

## Safety model (why it is shaped this way)

Every path that touches money is explicit: nothing auto-starts, deletion requires a
typed confirmation, and the API key is fetched from the Keychain at call time — never
written to disk, logs, or error messages (the test suite asserts the scrubbing).
Use placeholders like `RUNPOD_API_KEY=<yours>` in any config you copy; never commit a
real key.
