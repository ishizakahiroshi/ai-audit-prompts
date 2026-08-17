---
okf_version: "0.2"
---

# AI Audit Prompts Knowledge Bundle

この `docs/` は、監査プロンプトとその正本を収録した Open Knowledge Format v0.2 Bundle です。
通常の Markdown として直接利用でき、まずこの index、次に起動ルール、対象 prompt、関連する正本の順に段階的に読めます。

## 起動と metadata

- [共通監査プロンプト起動ルール](README_activation.md): 監査対象と実行ツールから、適切な監査プロンプトを段階的に選ぶための起動・自動選択ルール。
- [docs 命名規則](README_naming.md): 監査プロンプトのファイル名と tool・target・family metadata の値域を定義する正本。

## 正本

- [監査プロンプト 共通不変条件（正本）](README_invariants.md): コード監査プロンプト全体で共有する安全境界・進行・報告形式の不変条件を定義する正本。
- [サーバー診断プロンプト 共通不変条件（正本）](README_invariants_server.md): サーバー診断プロンプト全体で共有する完全 read-only の安全境界・診断・報告形式の不変条件を定義する正本。

## コード監査

コード監査 prompt は [共通監査プロンプト起動ルール](README_activation.md) の選択表から選び、共通不変条件は [監査プロンプト 共通不変条件（正本）](README_invariants.md) を参照する。

- [Claude Fable: DBを使うアプリ向けセキュリティ・脆弱性・バグ監査](claude_fable_audit_db_app.md): Claude Fable の深い推論で DB を使うアプリのセキュリティ・脆弱性・バグ・保守性を監査する貼り付け用プロンプト。
- [Claude Fable: DBを使わないアプリ向けセキュリティ・脆弱性・バグ監査](claude_fable_audit_db_less_app.md): Claude Fable の深い推論で DB を使わないアプリのセキュリティ・脆弱性・バグ・保守性を監査する貼り付け用プロンプト。
- [Claude ultracode Goal: DBを使うアプリ向け 詳細バグ潰し・セキュリティ・脆弱性監査](claude_ultracode_audit_db_app.md): Claude ultracode の多エージェント並列で DB を使うアプリのバグ・セキュリティ・脆弱性・保守性を監査する貼り付け用プロンプト。
- [Claude ultracode Goal: DBを使わないアプリ向け 詳細バグ潰し・セキュリティ・脆弱性監査](claude_ultracode_audit_db_less_app.md): Claude ultracode の多エージェント並列で DB を使わないアプリのバグ・セキュリティ・脆弱性・保守性を監査する貼り付け用プロンプト。
- [Codex Goal: DBを使うアプリ向けセキュリティ・脆弱性・バグ修正](codex_audit_db_app.md): Codex CLI で DB を使うアプリのセキュリティ・脆弱性・バグ・保守性を監査し、必要に応じて修正する貼り付け用プロンプト。
- [Codex Goal: DBを使わないアプリ向けセキュリティ・脆弱性・バグ修正](codex_audit_db_less_app.md): Codex CLI で DB を使わないアプリのセキュリティ・脆弱性・バグ・保守性を監査し、必要に応じて修正する貼り付け用プロンプト。

## サーバー診断

サーバー診断 prompt は [共通監査プロンプト起動ルール](README_activation.md) の選択表から選び、安全境界は [サーバー診断プロンプト 共通不変条件（正本）](README_invariants_server.md) を参照する。

- [Claude Fable: 稼働サーバーの脆弱性診断・ハードニング提言（完全 read-only）](claude_fable_audit_server.md): Claude Fable の深い推論で稼働中サーバーを完全 read-only 診断し、ハードニング提言を行う貼り付け用プロンプト。
- [Claude ultracode Goal: 稼働サーバーの脆弱性診断・ハードニング提言（完全 read-only）](claude_ultracode_audit_server.md): Claude ultracode の多エージェント並列で稼働中サーバーを完全 read-only 診断し、ハードニング提言を行う貼り付け用プロンプト。
- [Codex Goal: 稼働サーバーの脆弱性診断・ハードニング提言（完全 read-only）](codex_audit_server.md): Codex CLI で稼働中サーバーを完全 read-only 診断し、ハードニング提言を行う貼り付け用プロンプト。

## 資料突合

資料突合 prompt は [共通監査プロンプト起動ルール](README_activation.md) から選び、不変条件を prompt 本文内に自己完結させる。

- [Claude ultracode Goal: 資料 vs 実装 差異監査（read-only）](claude_ultracode_audit_doc_vs_impl.md): Claude ultracode の多エージェント並列で外部資料と現行実装の差異を完全 read-only で監査する貼り付け用プロンプト。
