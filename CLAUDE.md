# AI 監査プロンプト集 — 開発ガイド

> このファイルはrepository固有のルールだけを扱う。言語、確認、質問形式、個人用path等のglobal AI rulesは各利用者のAI tool設定へ置く。この `CLAUDE.md` / `AGENTS.md` はprivate fileが無いfresh public cloneでも成立させる。

## プロジェクト概要

AIにapp/source code、管理下server、資料と実装の差異を監査させる、汎用paste-ready promptだけを収録するpublic repository。製品codeや実行環境は持たず、`docs/` の公開Markdownが成果物である。

保守対象の正典は3本だけ:

| 対象 | paste-ready正典 | 安全境界 |
|---|---|---|
| app / repository / source | `docs/audit_app.md` | 既定は調査のみ。明示scopeとapproval時だけ最小修正 |
| managed server / VPS / host | `docs/audit_server.md` | 完全read-only。対策適用は人間 |
| document vs implementation | `docs/audit_doc_vs_impl.md` | 資料・実装・UIを完全非変更。修正は提言だけ |

選択順は `target → DB/profile → capability`。DB区分はapp正典の引数であり、tool/provider/model名は正典選択軸ではない。旧tool別14ファイルは一時的なdeprecated aliasであり、監査本文を持たず、新規workでは選ばない。

## source of truth

promptを編集するときは、先に該当する正本とroutingを読む。

| 契約 | 正本 |
|---|---|
| app監査のscope、profile、evidence、検証、summary | `docs/README_invariants.md` |
| server診断の完全read-only契約 | `docs/README_invariants_server.md` |
| 対象選択、引数、capability routing | `docs/README_activation.md` |
| filename、metadata、alias | `docs/README_naming.md` |
| doc-vs-implの非変更契約 | `docs/audit_doc_vs_impl.md` 内で自己完結 |

共通契約を変えるときは、正本 → canonical prompt → activation/index/README/CHANGELOGの順に同期する。aliasへ監査品質規約を複製しない。

## 命名とmetadata

正典filenameは固定:

```text
audit_app.md
audit_server.md
audit_doc_vs_impl.md
```

正典は `type: "Audit Prompt"`、`status: "stable"`、`audit.tool: "any"`、`audit.target`、`audit.family`、`audit.canonical: true` を持つ。

旧path aliasは `type: "Deprecated Audit Alias"`、`status: "deprecated"`、後継相対path、appならDB引数、削除条件だけを持つ。`audit:` metadataやpaste-ready本文を持たせない。詳細は `docs/README_naming.md` を正本とする。

## ディレクトリ構成

```text
docs/
  index.md                     OKF v0.2 Bundle root
  README_activation.md         対象中心のrouting
  README_naming.md             filename/metadata規約
  README_invariants.md         app監査の正本
  README_invariants_server.md  server診断の正本
  audit_app.md                 app監査の正典
  audit_server.md              server診断の正典
  audit_doc_vs_impl.md         資料と実装の差異監査の正典
  *_audit_*.md                 旧14pathのdeprecated alias
  local/                       private作業記録（gitignore対象）
assets/                        README用の既存asset
scripts/                       secrets-scanとhook installer
.githooks/pre-commit           commit前secrets scan
.github/workflows/             push/PR secrets scan
README.md / README.en.md       日本語 / 英語の公開入口
CHANGELOG.md / LICENSE
```

`docs/` 直下の公開Markdownは22本（正典3、alias 14、routing/invariants/index 5）。`docs/local/` とignoredなprivate entryは公開数、OKF公開bundle、indexへ含めない。

## このrepositoryに置かないもの

汎用method以外をpublic treeへ置かない。

- credential、secret、API key、token、private key、password
- server構成、IP、hostname、顧客名等の案件固有情報
- 特定projectの調査memo、log、plan、report
- 個人固有のAI設定、private path、接続情報

作業memoは `docs/local/` に置き、公開成果物へprivate情報を転記しない。

## 作業運用

- このrepositoryを整備するとき、監査prompt本文を実際の監査として実行しない。利用者が対象repo/server/materialへの監査を明示した場合だけ実行する。
- public Markdownの追加、削除、分類変更では、`docs/index.md`、frontmatter、README日英、CHANGELOG、関連正本を同じ変更で同期する。
- 日本語READMEと英語READMEは、構成、正典数、引数、status語、移行期間を一致させる。
- `docs/index.md` はOKF reserved rootとしてfrontmatterに `okf_version` 以外を追加しない。
- `docs/` 配下のplan / bugfix / pending等は `docs/local/` に置く。
- prompt変更後は最低限、`git diff --check`、fresh public bundleへの `docsweep okf-check <bundle> --json`、`node scripts/secrets-scan.mjs --all-tracked --block` を確認する。未追跡の新規公開fileを含む作業中はtemporary Git indexで`--staged --block`も使う。
- alias削除はrepo内外consumerの移行確認をgateにし、このmodernizationとは別planで行う。
- 未実装の予定をREADME/CHANGELOGへ提供済みとして書かない。過去releaseの記録は改ざんしない。

## AI作業共通ルール

commit/push/tag/release/publish/deploy、secrets-scan責務、plan/bugfix/pendingの作成規則等は、各利用者のglobal AI設定に従う（作者環境の例: `~/.claude/CLAUDE.md` と `~/.claude/guides/`）。

## 参照

| 項目 | path |
|---|---|
| Bundle入口 | `docs/index.md` |
| 起動・routing | `docs/README_activation.md` |
| app正典 | `docs/audit_app.md` |
| server正典 | `docs/audit_server.md` |
| doc-vs-impl正典 | `docs/audit_doc_vs_impl.md` |
| Codex入口 | `AGENTS.md` |
