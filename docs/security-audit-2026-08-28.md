# Security audit — the two already-public MCP repos

*2026-08-28 · Auditor: build session (phase 0 of the docs-site build) · Kyle's standing
instruction: "Make sure you do security passes on these we don't want anything of mine
getting leaked."*

## Scope

Both repos were ALREADY public under `kyle-nelson-berkeley` before this build, so the
audit ran first, on fresh clones, covering the **working tree AND the full git history**.

| Repo | Tool + mode | Result |
|---|---|---|
| runpod-mcp | gitleaks 8.30.1 `git` (full history) | **0 findings** |
| runpod-mcp | gitleaks 8.30.1 `dir` (working tree) | **0 findings** |
| onshape-mcp | gitleaks 8.30.1 `git` (full history) | **0 findings** |
| onshape-mcp | gitleaks 8.30.1 `dir` (working tree) | **0 findings** |

Supplementary manual greps over `git log --all -p` (both repos): email addresses,
`/Users/kyle` paths, name strings, key shapes (`rpa_*`, `sk-*`, `AKIA*`, bearer tokens),
and account/pod-id shapes.

## Findings

1. **Zero credentials** anywhere in either history. Every `rpa_*` string is a deliberate
   test fixture with an assertion that it gets scrubbed (the tests exist to PROVE key
   scrubbing works).
2. **Zero local paths** (`/Users/...`) in either history.
3. **LOW — runpod-mcp**: `tests/test_tools.py` and `tests/test_jobs.py` used a
   real-looking pod id `on2ghkedz0vbjr` (pod name `lts-replication`, billing amount
   $0.56) as fixture data. Not a credential — a pod id is useless without the API key
   and the pod is long gone — but it is exactly the class of value Kyle's hygiene rules
   keep out of public repos. **Fix prepared** (not pushed — Kyle gate):
   `docs/pending-approvals/runpod-mcp-fixture-scrub.patch` replaces it with
   `fakefakefake00`. Proven safe: the repo's offline suite gives byte-identical results
   before and after (381 passed; the 13 failures + 20 errors in both runs are the
   documented standalone-clone limitation — tests that cross-check files of the parent
   learning-to-swim project).
4. **FYI — both repos**: `kyle-nelson@berkeley.edu` appears as git author identity and
   in `pyproject.toml` authors. That is Kyle's normal public attribution; no action
   proposed.

## Related finding outside these repos (raise with the team)

The **live org docs site** page
`contents/raspberry_pi_setup/ubuntu_24.04_server_64bit` publishes a working default
password (`plain_text_passwd`) with `ssh_pwauth: true`, plus maintainers' personal SSH
keys and email addresses. This site's migration scrubs all of it (converter policy +
check-gate rule); the old site still serves it. Kyle: worth a heads-up to the team.

## Publication rule honored

Nothing was pushed to any public repo in this build; the patch above waits for Kyle's
explicit approval. Any repo published fresh must start from a clean initial commit.
