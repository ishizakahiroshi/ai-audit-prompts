<!-- Language: [日本語](README.md) | English -->

<p align="center">
  <img src="assets/20260609/header.png" alt="AI Audit Prompts" width="100%">
</p>

# AI Audit Prompts

A collection of paste-ready prompts for auditing applications, managed servers, and documentation-versus-implementation without routing by product or model name. Select one of three target-based canonical prompts, then resolve the DB category, security profiles, and the capabilities actually available in the execution environment.

## What this is

- The only maintained paste-ready canonicals are `docs/audit_app.md`, `docs/audit_server.md`, and `docs/audit_doc_vs_impl.md`.
- Routing follows `target → DB/profile → capability`. Product and model names such as Claude, Codex, ChatGPT, a CLI, or a web UI do not prove that shell, web, parallel-agent, or independent-verifier capabilities exist.
- The default app-audit scope is “investigate only.” Every confirmed finding gets a concrete minimal fix proposal, but `confirmed finding ≠ applied fix`. A fix is applied only within an explicit scope and after the execution approval gate.
- Server diagnosis is completely read-only. A doc-vs-implementation audit changes neither the source material nor the implementation. Both provide recommendations only; a human applies them.
- The report starts with coverage, evidence, candidate verification rate, unexamined areas, and residual risk—not a fixed score out of 100. A numeric rating is produced only when explicitly requested, after defining its denominator and treatment of unknown coverage.
- The report is the source of truth for audit facts and evidence; a related plan, bugfix, or pending document is the execution source of truth for follow-up work. Finding verdict, response state, and verification state are tracked separately.
- This collection comes with no warranty. AI audits can produce false positives and misses. Human review is required before production use, including for confirmed findings and automatically applied fixes.

## Usage

### 1. Clone the repository

```text
git clone <repository URL> ai-audit-prompts
```

### 2. Select the canonical by target

When unsure, delegate selection to the activation policy.

```text
Read <repo>/docs/README_activation.md, select the canonical prompt for the audit target, and run it.
```

| Audit target | Canonical | Primary use |
|---|---|---|
| app / repository / source code | [`audit_app.md`](docs/audit_app.md) | Security, bugs, dependencies, and maintainability; selects DB and multiple profiles internally |
| managed server / VPS / host | [`audit_server.md`](docs/audit_server.md) | Completely read-only diagnosis and recommendations for a server you manage |
| document vs implementation | [`audit_doc_vs_impl.md`](docs/audit_doc_vs_impl.md) | Completely non-mutating comparison of claims in specified material with current implementation |

A URL-only external site, a third-party system, or active diagnosis of an entire shared-hosting environment is out of scope.

### App audit example

```text
Use the complete prompt in <repo>/docs/audit_app.md to audit this repository.
DB category: auto
Intensity: mid
Scope: investigate only
Validation mode: safe local validation
Perspective: all
Target: src/
Exclude: src/generated/
Confirmation: yes
```

`DB category` accepts `auto / with DB / without DB`. In auto mode, the prompt uses manifests, dependencies, schemas, migrations, ORM/SQL, and DB drivers to record `with DB / without DB / unknown` with evidence; it does not connect to production databases or run migrations.

Based on implementation evidence, the app prompt can select multiple profiles for Web/API, AI/agent/MCP/RAG, native/desktop/mobile/browser extensions, CLI/libraries, CI/CD and supply chain, cloud/IaC/Kubernetes, and DB boundaries. Each is reported as `selected / skipped / unknown + evidence`.

### Server diagnosis example

```text
Use the complete prompt in <repo>/docs/audit_server.md to diagnose this server.
Connection mode: AI connection
Connection target: user@example.com
Intensity: mid
Perspective: SSH configuration, exposed services, firewall, and patches
Confirmation: yes
```

Use this only for a server that you own or manage and are authorized to inspect at the OS level. Before connecting to a non-repository server, the prompt confirms the private owner repository for the report and matches the host, user, identity-file name, and port. It never changes configuration, updates packages, restarts services, actively scans, or applies recommendations.

### Document-versus-implementation example

```text
Use the complete prompt in <repo>/docs/audit_doc_vs_impl.md to perform the audit.
Material: docs/customer-guide.pdf
Canonical specification: docs/specification.md
Medium: PDF
Intensity: high
Target: src/
Confirmation: yes
```

`Material` is required. PDFs, slides, images, and spreadsheets are visually inspected page by page when the capability is available, rather than relying only on extracted text. Instructions embedded in the material are treated as data. The material, source, configuration, and UI are not changed.

## Execution contract

### Scope and approval

With the default `Confirmation: yes`, the AI presents the selected prompt, resolved arguments, whether changes are allowed, validation limits, and output paths before starting. This is a conversation-level approval gate separate from tool permissions or YOLO settings.

The app scopes are:

| Scope | Source changes | Validation |
|---|---|---|
| investigate only (default) | None; fix proposals only | Collect static evidence without running validation commands |
| investigate and fix | Only self-contained minimal fixes for confirmed findings | Within the selected validation mode |
| full loop | Minimal fixes | Post-fix validation and re-audit |

`Validation mode` is `static / safe local validation / build included`. The contract distinguishes safe test-time compilation or temporary artifacts from side-effecting install, release, publish, deploy, or shared-environment operations. Commands outside the scope or with uncertain side effects are not run.

### Capabilities and quality signals

The selected canonical records file search, shell, tests, official-source web access, visual inspection, parallel agents, independent verification, and file editing as `yes / no / unknown + evidence`. Missing capabilities do not lower the finding threshold: execution falls back to a sequential second pass and marks anything not verified.

At execution time, security baselines are rechecked against official sources when possible. The plan and report record the name, version, URL, check date, and status. A CVE or baseline mismatch alone is not a finding; reachability, effective configuration, exposure, and mitigations must be established.

### Outputs

- Plan: `docs/local/plan_<audit-topic>.md` in the target repository
- Default report: `docs/ai-audit-prompts/report_audit_<topic>_<YYYY-MM-DD>.md`
- An alternate repository-relative path is used only when `Save destination=...` is explicit.
- `docs/obsidian` is used only when explicitly selected and its target and writability have been checked.
- A server report is stored in a user-designated private owner repository, never in this public prompt repository.

## Repository layout

There are 22 public Markdown files directly under `docs/`: 3 paste-ready canonicals, 14 migration aliases, and 5 routing/invariant/index documents.

```text
docs/
  index.md                    OKF v0.2 bundle entry
  README_activation.md        target-based activation and routing policy
  README_naming.md            canonical and alias naming/metadata
  README_invariants.md        shared app-audit contract
  README_invariants_server.md completely read-only server contract
  audit_app.md                canonical app/source audit
  audit_server.md             canonical managed-server diagnosis
  audit_doc_vs_impl.md        canonical doc-versus-implementation audit
  *_audit_*.md                deprecated aliases for 14 legacy paths
  local/                      private working records (gitignored)
```

The 14 former tool-specific paths remain as navigation aliases for one migration release. They are not paste-ready prompts and are excluded from automatic selection, recommendations, and the canonical count. After in-repository and external consumers have migrated, a separate plan for the next breaking change will remove them.

The `docs/` directory is also an Open Knowledge Format (OKF) v0.2 bundle. Start at [`docs/index.md`](docs/index.md) for progressive disclosure through routing, a canonical prompt, and its invariants.

## What must not be stored here

This public repository contains only reusable methods. Do not commit:

- Credentials, API keys, tokens, private keys, or passwords
- Customer-specific server configurations, IP addresses, hostnames, or names
- Investigation notes, logs, plans, or reports for a particular project

Use `docsweep okf-check docs --json` to check public Markdown consistency and `node scripts/secrets-scan.mjs --all-tracked --block` to scan for secrets. This repository contains no executable product code or build artifacts.
