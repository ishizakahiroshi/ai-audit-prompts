<!-- Language: [日本語](README.md) | English -->

<p align="center">
  <img src="assets/20260609/header.png" alt="AI Code Audit Prompts" width="100%">
</p>

# AI Code Audit Prompts

A collection of paste-ready prompts for getting AI agents (Claude Code / Codex CLI, etc.) to perform "security, vulnerability, bug, and maintainability audits, plus fixes that don't break existing behavior." Only project-agnostic, reusable templates live here.

## What this is

- A set of prompts in `docs/`, picked by tool (Claude / Codex) and DB category (with DB / without DB), for running heavy code audits.
- Every prompt shares the same premises: "no builds, commits, production DB operations, or sweeping rewrites," "run all the way through without stopping," and "record anything that needs a human decision and move on."
- The invariants that all prompts must uphold are canonicalized in [docs/README_invariants.md](docs/README_invariants.md).
- This prompt collection comes with no warranty. AI audits can produce false positives and misses. Always have a human review the results — including confirmed findings — before applying them to production. Use at your own risk.

## How to use

<p align="center">
  <img src="assets/20260609/how_it_works.png" alt="How it works" width="100%">
</p>

### 1. Clone this repository

```
git clone <URL of this repository> ai-audit-prompts
```

You can put it anywhere (it doesn't depend on any specific local path).

### 2. In the project you want to audit, give the AI the following prompt

Replace `<repo>` with the path where you cloned this repo.

For Claude Code (ultracode — multi-agent parallel):

```
Read <repo>/docs/README_activation.md, pick the claude_ultracode audit prompt, and run it. Use ultracode.
```

With arguments:

```
Read <repo>/docs/README_activation.md, pick the claude_ultracode audit prompt, and run it. Use ultracode.
DB category: with DB
Intensity: mid
Scope: investigate only
Perspective: security & vulnerabilities
Target: src/api/
Exclude: src/api/tests/
```

For Claude Fable (deep single-agent reasoning):

```
/model claude-fable-5
```

**Quick version (full defaults):**

```
Read <repo>/docs/README_activation.md, pick the claude_fable audit prompt, and run it.
```

**Detailed version (narrowing arguments):**

```
Read <repo>/docs/README_activation.md, pick the claude_fable audit prompt, and run it.
DB category: with DB
Intensity: mid
Scope: investigate only
Perspective: security & vulnerabilities
Target: src/api/
Exclude: src/api/tests/
```

For Codex CLI:

```
Read <repo>/docs/README_activation.md, pick the codex audit prompt, and run it.
```

With arguments:

```
Read <repo>/docs/README_activation.md, pick the codex audit prompt, and run it.
DB category: with DB
Intensity: mid
Scope: investigate only
Perspective: security & vulnerabilities
Target: src/api/
Exclude: src/api/tests/
```

- You don't need to name the file directly; the activation rules auto-select by tool × DB category.
- Omit `DB category` to auto-detect from the repo. Omit any other argument to use its default value.
- The trailing `ultracode` in the Claude version is a switch for multi-agent parallelism. Drop it when you want a lighter run.
- Reports come back in the language you use — ask in English and you get English, ask in Japanese and you get Japanese. No translation needed.

### 2-b. Diagnosing a live server (fully read-only)

To diagnose a live server reachable over SSH — its vulnerabilities and misconfigurations — and get remediation advice (rather than auditing a repo), launch a server-diagnosis prompt. It never changes the server's state; remediations are advice only and must be applied by a human.

Claude Code (ultracode, parallel):

```
Read <repo>/docs/README_activation.md, pick the claude_ultracode server-diagnosis prompt, and run it. Use ultracode.
Connection: AI connects
Target host: user@example.com
```

Claude Fable:

```
/model claude-fable-5
```

```
Read <repo>/docs/README_activation.md, pick the claude_fable server-diagnosis prompt, and run it.
Connection: AI connects
Target host: user@example.com
Intensity: mid
Perspective: SSH config, network & exposed services, firewall
```

Codex CLI:

```
Read <repo>/docs/README_activation.md, pick the codex server-diagnosis prompt, and run it.
Connection: AI connects
Target host: user@example.com
```

- If Claude Code is already running on the target server, use `Connection: on server` (no target host needed).
- Arguments are optional (defaults: AI connects, intensity high, all perspectives). But "AI connects" requires a target host.
- **Use only on servers you own or are authorized to assess.** The server's state is never changed; have a human review every remediation before applying it.

### 3. (Optional) Plant a keyword in the project

If writing the path every time is tedious, add the snippet below to the target project's `CLAUDE.md` (or `AGENTS.md` for Codex) so it launches just by saying "run audit." See the "Instructions to put in each project" section of [docs/README_activation.md](docs/README_activation.md) for details.

## Directory layout

```
docs/
  README_activation.md        ← auto-selection rules for which prompt to use (read first)
  README_naming.md            ← file naming scheme
  README_invariants.md        ← invariants for code-audit prompts (canonical)
  README_invariants_server.md ← invariants for server-diagnosis prompts (canonical)
  claude_ultracode_audit_db_app.md       ← Claude ultracode / code audit / with DB
  claude_ultracode_audit_db_less_app.md  ← Claude ultracode / code audit / without DB
  claude_fable_audit_db_app.md          ← Claude Fable / code audit / with DB
  claude_fable_audit_db_less_app.md     ← Claude Fable / code audit / without DB
  codex_audit_db_app.md                  ← Codex / code audit / with DB
  codex_audit_db_less_app.md             ← Codex / code audit / without DB
  claude_ultracode_audit_server.md       ← Claude ultracode / server diagnosis (read-only)
  claude_fable_audit_server.md           ← Claude Fable / server diagnosis (read-only)
  codex_audit_server.md                  ← Codex / server diagnosis (read-only)
```

There are two families. **Code audit** (review a repo for security, vulnerabilities, bugs, and maintainability, and fix within the bounds of not breaking existing behavior) and **server diagnosis** (diagnose a live server reachable over SSH, fully read-only, and report remediation advice — never applying changes).

The codex versions are detailed/enumerated, claude_ultracode versions are condensed (parallel fan-out), and claude_fable versions use deep single-agent reasoning — the granularity differs, but the invariants within each family are identical: code audit is canonicalized in [docs/README_invariants.md](docs/README_invariants.md), server diagnosis in [docs/README_invariants_server.md](docs/README_invariants_server.md).

### About server diagnosis (important)

The server-diagnosis prompts (`*_audit_server.md`) have a different safety boundary from code audit:

- **Fully read-only**: they never change the live server's state (no config changes, service restarts, package updates, firewall changes, user changes, or reboots). Remediations are reported as advice only and **applied by a human** (to avoid production outages and SSH lockouts).
- **Connection method is an argument**: the default is "AI connects" (the AI runs `ssh <host> '<read-only command>'` from your machine to diagnose). If Claude Code is already running on the server, use "on server."
- SSH and firewall remediations always come with lockout-avoidance steps.
- Use at your own risk, and **only on servers you own or are authorized to assess.**

## What does NOT belong here (important)

This is for reusable templates only. The following must **never be committed** (`.gitignore` guards against it, but enforce it operationally too):

- Credentials, secrets, API keys, tokens, private keys, passwords
- Internal/engagement-specific information such as server configs, IPs, hostnames, or customer names
- Investigation notes, logs, plans, or result reports for specific projects

The line this repo draws: keep only the "method" of how to run an audit.
