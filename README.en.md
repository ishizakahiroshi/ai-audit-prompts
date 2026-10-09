<!-- Language: [日本語](README.md) | English -->

<p align="center">
  <img src="assets/20260609/header.png" alt="AI Audit Prompts" width="100%">
</p>

# AI Audit Prompts

A collection of paste-ready prompts for auditing applications, managed servers, and documentation-versus-implementation without routing by product or model name. Select one of three target-based canonical prompts, then resolve the DB category, security profiles, and the capabilities actually available in the execution environment.

<p align="center">
  <a href="https://youtu.be/doIv1ItRb_w"><img src="portfolio/promo-cover-v1.0.0.jpg" alt="Intro video (23 s): AI Audit Prompts v1.0.0" width="560"></a><br>
  ▶ <a href="https://youtu.be/doIv1ItRb_w">Intro video (23 s, YouTube; on-screen text in Japanese)</a>
</p>

## What this is

- The only maintained paste-ready canonicals are `docs/audit_app.md`, `docs/audit_server.md`, and `docs/audit_doc_vs_impl.md`.
- Routing follows `target → DB/profile → capability`. Product and model names such as Claude, Codex, ChatGPT, a CLI, or a web UI do not prove that shell, web, parallel-agent, or independent-verifier capabilities exist.
- The default app-audit scope is “investigate only.” Every confirmed finding gets a concrete minimal fix proposal, but `confirmed finding ≠ applied fix`. A fix is applied only within an explicit scope and after the execution approval gate.
- Server diagnosis is completely read-only. A doc-vs-implementation audit changes neither the source material nor the implementation. Both provide recommendations only; a human applies them.
- The report starts with coverage, evidence, candidate verification rate, unexamined areas, and residual risk—not a fixed score out of 100. A numeric rating is produced only when explicitly requested, after defining its denominator and treatment of unknown coverage.
- The report is the source of truth for audit facts and evidence; a related execution document (plan, bugfix, pending, or an issue tracker item) is the execution source of truth for follow-up work. The post-audit triage and fix-phase contracts shared by all three families are the last two sections of `docs/audit_app.md`. Finding verdict (`確定 / 却下 / 判断待ち / 重複`), response state (`plan / fix / pending / 見送り`), and verification state are tracked separately.
- Compliance with laws and standards (EU CRA, EU AI Act, PCI DSS, ISO/IEC 42001, Japan's AI Guidelines for Business, and so on) is not judged. Only when you explicitly request it, or the target or material explicitly claims compliance, does the audit record the name, version or effective date, application status (for laws, the amending act and application stage), URL, and check date under “regulatory context (unverified)” in the report; verifying a compliance claim against the implementation is handled only by the doc-versus-implementation canonical. Without such a mention, the section is omitted entirely, and possibly applicable regulations are never guessed or listed. As an exception, when the audit confirms decisive evidence of compromise, active exploitation, or personal-data / credential exposure, it surfaces the evidence immediately and places one line at the top of pending decisions—without naming regulations or judging applicability—stating that the owner must promptly decide on time-bound notification or reporting duties and first response.
- This collection comes with no warranty. AI audits can produce false positives and misses. Human review is required before production use, including for confirmed findings and automatically applied fixes. Report to third-party projects only confirmed findings that a human has reproduced, following the target's vulnerability disclosure channel and its conditions.

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

`DB category` accepts `auto / with DB / without DB`. In auto mode, the prompt uses manifests, dependencies, schemas, migrations, ORM/SQL, and DB drivers to record `with DB / without DB / unknown` with evidence; it does not connect to production databases or run migrations. `Exclude` removes paths from findings, changes, and validation; reading them to follow an execution path is allowed by default (append `（読取り禁止）` (“no read”) to the value to forbid reading as well).

Based on implementation evidence, the app prompt can select multiple profiles for Web/API, AI/agent/MCP/RAG, native/desktop/mobile/browser extensions, CLI/libraries, CI/CD and supply chain, cloud/IaC/Kubernetes, and DB boundaries. Each is reported as `selected / skipped / unknown + evidence`. Regardless of whether the AI profile is selected, every app audit also checks the AI coding-agent / IDE configuration committed to the repository — instruction files, hooks, MCP server definitions, permission / auto-approve settings, editor tasks, recommended editor extensions, and skill definitions — for automatic execution paths, evaluates those settings, workflows, and bundled scripts as possible indicators of compromise (IoC), and checks for tracked or history-resident secrets and AI session artifacts. If the target repository is not under your control, launch without loading its agent / IDE configuration, and record in the inventory whether that configuration was loaded (see “起動側の前提” (launcher-side prerequisites) in `docs/README_activation.md`).

### Server diagnosis example

```text
Use the complete prompt in <repo>/docs/audit_server.md to diagnose this server.
Connection mode: AI connection
Connection target: user@example.com
Intensity: mid
Perspective: 2 SSH/remote identity, 3 package/CVE, 4 network/public service, 5 firewall
Confirmation: yes
```

Use this only for a Linux or Unix server that you own or manage and are authorized to inspect at the OS level. Windows Server is out of scope for this version. Before connecting to a non-repository server, the prompt confirms the private owner repository for the report and matches the host, user, identity-file name, port, and host key fingerprint. It never changes configuration, updates packages, restarts services, actively scans, or applies recommendations. Exposed AI runtimes, vector databases, MCP servers, agent gateways, and the privileges of resident agent processes are part of the perspectives. The effective web server and reverse proxy configuration, and files served from the document root (such as .git, .env, and dumps, listed without opening them), are also part of the perspectives. A single TLS handshake against the host's own listeners on loopback or on an address assigned to one of its interfaces and a single token-less GET to the link-local metadata endpoint count as read-only observation rather than active requests to external systems; authentication attempts, payload submission, and repeated connections remain prohibited.

### Document-versus-implementation example

```text
Use the complete prompt in <repo>/docs/audit_doc_vs_impl.md to perform the audit.
Material: docs/customer-guide.pdf
Canonical specification: docs/specification.md
Implementation baseline: HEAD
Medium: PDF
Intensity: high
Target: src/
Confirmation: yes
```

`Material` is required. PDFs, slides, images, and spreadsheets are visually inspected page by page when the capability is available, rather than relying only on extracted text. Instructions embedded in the material are treated as data. The material, source, configuration, and UI are not changed. When `Canonical specification` is omitted, the prompt identifies current canonical candidates from project instructions, spec-driven artifacts (spec / plan / tasks, requirements / design, and similar), machine-readable contracts such as OpenAPI, and ADRs, including hidden (dot-prefixed) directories; in-flight change proposals and derived files such as llms.txt are never treated as canonical.

## Execution contract

### Scope and approval

With the default `Confirmation: yes`, the AI presents the selected prompt, resolved arguments, whether changes are allowed, validation limits, output paths, and how the actual execution mode differs from the recommended execution environment before starting. This is a conversation-level approval gate separate from tool permissions or YOLO settings. Because prohibitions written in a prompt are not technically enforced, the launcher should make the target read-only, limit writable paths, restrict network egress to an allowlist, and avoid mounting credential directories (see “起動側の前提” (launcher-side prerequisites) in `docs/README_activation.md`).

The app scopes are:

| Scope | Source changes | Validation |
|---|---|---|
| investigate only (default) | None; fix proposals only | Source unchanged; runs validation commands within the selected validation mode |
| investigate and fix | Only self-contained minimal fixes for confirmed findings | Within the selected validation mode |
| full loop | Minimal fixes | Post-fix validation and re-audit |

`Validation mode` is `static / safe local validation / build included`. The contract distinguishes safe test-time compilation or temporary artifacts from side-effecting install, release, publish, deploy, or shared-environment operations. Commands outside the scope or with uncertain side effects are not run.

### Capabilities and quality signals

The selected canonical records file search, shell, tests, official-source web access, parallel agents, independent verification, and file editing (plus visual inspection of documents / UI in the doc-versus-implementation canonical) as `yes / no / unknown + evidence`; it also records the execution mode actually in effect (restricted modes such as read-only, and whether a sandbox or network isolation applied). Missing capabilities do not lower the finding threshold: execution falls back to a sequential second pass and marks anything not verified.

At execution time, security baselines are rechecked only against official sources (fetching only from official domains and never opening URLs found in the target repository) when possible. The plan and report record the name, version, URL, check date, and status. A CVE or baseline mismatch alone is not a finding; reachability, effective configuration, exposure, and mitigations must be established. External scores such as CVSS (version, vector, scorer), EPSS (score, percentile, model version, retrieval date), CISA KEV, and SSVC are recorded as inputs with provenance; none of them alone decides severity, confirmation, or rejection.

### Outputs

HTML is produced by default (`HTML出力: あり`; set `なし` for Markdown only). `点数評価: 要求時 / あり / なし` defaults to on explicit request; `あり` is itself a scoring request and `なし` overrides one. HTML output and scoring are independent. The Markdown report remains the source of truth; HTML displays the same snapshot, calculated ratings, unknown areas, and response choices. Choices are local drafts, not approval or execution. See the [shared contract](docs/README_html-report.md), [template](templates/audit-report.html), and [fully synthetic demo](examples/audit-report.example.html). No build, external dependency, or personal skill is required.

- Plan: `docs/local/plan_audit_<topic>.md` in the target repository
- Default report: `docs/ai-audit-prompts/report_audit_<topic>_<YYYY-MM-DD>.md`
- Default HTML: the same destination and basename with `.html`, generated at final or partial closeout. If either file already exists, use the same sequence suffix for both. If HTML cannot be generated or saved, record the reason and retain Markdown; never use an unauthorized fallback.
- `<topic>` is `<target>_<slug>`; see “成果物命名” (artifact naming) in `docs/README_naming.md`.
- An alternate repository-relative path is used only when `Save destination=...` is explicit.
- If the target repository is public or its visibility is unknown, the prompt proposes `ignore` for the report's Git handling; `track` is used only with explicit approval after the exposure of unfixed findings has been presented.
- If the destination is a symlink, junction, or mount, verify the real path and writability; never fall back to another path without approval.
- A server report is stored in a user-designated private owner repository, never in this public prompt repository.

## Repository layout

There are 23 public Markdown files directly under `docs/`: 3 paste-ready canonicals, 14 migration aliases, 5 routing/invariant/index documents, and 1 HTML report contract.

```text
docs/
  index.md                    OKF v0.2 bundle entry
  README_activation.md        target-based activation and routing policy
  README_naming.md            canonical and alias naming/metadata
  README_invariants.md        shared app-audit contract
  README_invariants_server.md completely read-only server contract
  README_html-report.md       shared HTML output, rating, and template contract
  audit_app.md                canonical app/source audit
  audit_server.md             canonical managed-server diagnosis
  audit_doc_vs_impl.md        canonical doc-versus-implementation audit
  *_audit_*.md                deprecated aliases for 14 legacy paths
  local/                      private working records (gitignored)
templates/audit-report.html   self-contained shared template
examples/audit-report.example.html fully synthetic demo
```

The 14 former tool-specific paths remain as navigation aliases for one migration release. They are not paste-ready prompts and are excluded from automatic selection, recommendations, and the canonical count. After in-repository and external consumers have migrated, a separate plan for the next breaking change will remove them.

The `docs/` directory is also an Open Knowledge Format (OKF) v0.2 bundle. Start at [`docs/index.md`](docs/index.md) for progressive disclosure through routing, a canonical prompt, and its invariants.

## What must not be stored here

This public repository contains only reusable methods. Do not commit:

- Credentials, API keys, tokens, private keys, or passwords
- Customer-specific server configurations, IP addresses, hostnames, or names
- Investigation notes, logs, plans, or reports for a particular project

Use `docsweep okf-check docs --json` to check public Markdown consistency and `node scripts/secrets-scan.mjs --all-tracked --block` to scan for secrets. This repository contains no product application, generation CLI, or build artifacts. The HTML template includes inline JavaScript for response drafts.
