# Agent Entry Point (ai-audit-prompts)

This repository's operational guidance is maintained in `CLAUDE.md`.

- Project overview & rules: `./CLAUDE.md`
- Activation / auto-selection rules (read first when using the prompts): `./docs/README_activation.md`
- Invariants — source of truth:
  - Code audit: `./docs/README_invariants.md`
  - Server diagnosis: `./docs/README_invariants_server.md`
  - Doc-vs-implementation audit: self-contained in the prompt (no separate invariants file)
- Naming scheme: `./docs/README_naming.md`
- Local/private additions (if present, not committed): `./docs/local/`

This repo holds only generic, paste-ready audit *prompts* — no code, no build. Never commit secrets, credentials, or project/customer-specific information (see the "置かないもの" section in `CLAUDE.md`).

Personal/global AI rules are intentionally kept outside this repository. Use each AI tool's supported global instruction location for user-specific rules; this file must remain valid for a fresh public clone with no private files.

If any guidance conflicts, follow `CLAUDE.md`.
