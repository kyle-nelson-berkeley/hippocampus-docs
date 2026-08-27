# runpod-mcp

**External GPU compute for the lab.** An MCP server that lets an AI agent rent a cloud
GPU on [RunPod](https://www.runpod.io/), run a job on it, watch it, and — the part that
matters — reliably stop it so it cannot burn money unattended. It was built for a
reinforcement-learning replication and is general: any lab task that needs a big GPU for
an hour fits.

Repository: <https://github.com/kyle-nelson-berkeley/runpod-mcp> (public; security-audited
2026-08-28 — gitleaks over full history and working tree, zero findings).

<div class="adm adm-note"><p class="adm-title">Status</p>

The from-scratch setup guide (install, RunPod account, API key handling, first dry-run,
cost guardrails) lands here in the agent-tools build phase. Until then the repository's
own README is the reference.

</div>

## What it gives an agent

- Start and stop pods with an explicit cost ceiling and an idle watchdog — the watchdog
  runs **on the pod**, so it stops the meter even if your machine disconnects.
- Run commands and sync files over SSH without hand-managing keys per pod.
- A billing view, so "what did this cost" is a tool call, not a dashboard visit.

## Safety model (why it is shaped this way)

Every path that touches money is deliberately explicit: nothing auto-starts, deletion is
never automatic, and the API key is fetched from the OS keychain at call time — it is
never written to disk, logs, or error messages (the test suite asserts exactly that).
Use placeholders like `RUNPOD_API_KEY=<yours>` in any config you copy; never commit a
real key.
