# AI コード監査プロンプト集 — 開発ガイド

> このファイルはリポジトリ固有のルールだけを扱う。言語・確認・質問フォーマット・スクリーンショット規約などの **個人/グローバルな AI ルールは公開リポジトリに置かない**。各利用者が使う AI ツールのグローバル設定側に置くこと。この `CLAUDE.md` / `AGENTS.md` は、private ファイルが一切無い public クローンでも成立する内容を保つ。

## プロジェクト概要

AI エージェント（Claude Code / Codex CLI 等）に「セキュリティ・脆弱性・バグ・保守性の監査と、現行機能を壊さない範囲の修正」をやらせるための、**貼り付け用プロンプト（メソッド）だけ**を集めたリポジトリ。コード・ビルド・実行環境は持たない。`docs/` 配下の Markdown が成果物そのもの。

監査は 3 系統:

- **コード監査** — リポジトリのセキュリティ・脆弱性・バグ・保守性を監査し、レポートと修正案を出力する。既定ではソースを書き換えず、スコープ指定時のみ現行機能を壊さない範囲で修正まで行う。
- **サーバー診断** — SSH でアクセスできる稼働中サーバーを **完全 read-only** で診断し、対策を提言する（適用は人間）。
- **資料突合** — 外部作成の資料（説明会資料・マニュアル・仕様書・顧客向け文書）の記載と現行実装の差異を **完全 read-only** で洗い出す（修正は適用しない・不変条件はプロンプト内に自己完結）。

## 不変条件（正本 = source of truth）

プロンプトの中身を編集・追加するときは、まず正本を読み、そこからブレないこと。

| 系統 | 正本ファイル |
|---|---|
| コード監査の不変条件 | `docs/README_invariants.md` |
| サーバー診断の不変条件 | `docs/README_invariants_server.md` |
| どのプロンプトを使うかの自動選択ルール | `docs/README_activation.md` |
| ファイル命名スキーム | `docs/README_naming.md` |

各プロンプト（`*_audit_*.md`）は上記正本の具体化であり、不変条件を個別ファイルに書き散らさない。共通ルールを変えるときは **正本を直し、各プロンプトを追随させる**（逆をやらない）。

## ファイル命名（`docs/README_naming.md` が正本）

```
{ツール}_audit_{監査対象}.md
```

- すべて小文字・snake_case（`-` ではなく `_`）。軸順は `ツール` → `audit` → `監査対象` で固定。
- ツール: `codex` / `claude_ultracode`（多エージェント並列）/ `claude_fable`（単一エージェント深い推論 + verifier 委託）。
- 監査対象: `db_app` / `db_less_app`（コード監査の DB 区分）/ `server`（サーバー診断・DB 区分なし）/ `doc_vs_impl`（資料突合・DB 区分なし）。
- 新ツール・新対象を足すときも同スキームに従う（例: `gemini_audit_db_app.md`）。

## ディレクトリ構成

```
docs/
  index.md                    ← OKF v0.2 Knowledge Bundle root and progressive-disclosure entry
  README_activation.md         ← 起動・自動選択ルール（利用者が最初に読む）
  README_naming.md             ← 命名スキーム
  README_invariants.md         ← コード監査の不変条件（正本）
  README_invariants_server.md  ← サーバー診断の不変条件（正本）
  {ツール}_audit_{対象}.md      ← 各貼り付け用プロンプト
  local/                       ← 非公開メモ（plan_* 等・gitignore 対象）
assets/                        ← README 用画像（既存追跡分のみ。新規は gitignore）
scripts/                       ← secrets-scan（secrets-scan.mjs）と pre-commit hook 導入（install-hooks.sh / .ps1）
.githooks/pre-commit           ← コミット時に secrets-scan を実行する hook（install-hooks で有効化）
.github/workflows/secrets-scan.yml ← push/PR 時の secrets-scan CI
README.md / README.en.md       ← 日本語 / 英語の入口
CHANGELOG.md / LICENSE
```

## このリポジトリに置かないもの（最重要）

汎用テンプレート専用。次は **絶対にコミットしない**（`.gitignore` で予防済みだが運用でも徹底）:

- 認証情報・secrets・API キー・トークン・秘密鍵・パスワード
- サーバー構成・IP・ホスト名・顧客名などの社内/案件固有情報
- 特定プロジェクトの調査メモ・ログ・plan / 結果報告 md（非公開メモは `docs/local/` へ。これは gitignore 済み）

「監査の進め方（メソッド）」だけを置く、が本リポジトリの線引き。

## 作業運用ルール（このリポジトリ固有）

- **監査プロンプトの中身を実際に実行しない。** ここはプロンプトを編集・整備するリポジトリであって、監査を走らせる場ではない。ユーザーが明示的に「このプロンプトでこのリポを監査して」と指示した場合のみ実行する。
- プロンプトを変更したら、**README.md / README.en.md / CHANGELOG.md / 関連正本との整合** を必ず確認する（ファイルを増減したらディレクトリ構成の記述も更新）。日本語版を変えたら英語版も追随させる。
- `docs/` の公開 Markdown を増減・分類変更した場合は、Bundle root の `docs/index.md`、frontmatter metadata、README 日英、CHANGELOG、関連正本の整合も確認する。`index.md` は OKF 予約形式の root 文書として `okf_version` 以外の frontmatter key を持たせない。
- `docs/` 配下に新規 `.md`（`plan_*` / `bugfix_*` / `pending_*` など作業メモ）を作る場合は **`docs/local/` に置く**（公開ツリーを汚さない）。

## AI 作業共通ルール

ビルド・コミット禁止、secrets-scan 責務、plan/bugfix/pending md の作成ルール（命名・書式含む）等の AI 作業共通ルールは、各利用者のグローバル AI 設定に従う（作者環境の例: `~/.claude/CLAUDE.md` および `~/.claude/guides/`）。

## 参照リンク

| 項目 | パス |
|---|---|
| 起動・自動選択ルール | `docs/README_activation.md` |
| コード監査の不変条件（正本） | `docs/README_invariants.md` |
| サーバー診断の不変条件（正本） | `docs/README_invariants_server.md` |
| 命名スキーム | `docs/README_naming.md` |
| Codex 用入口 | `AGENTS.md` |
