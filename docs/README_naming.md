# docs 命名規則

このディレクトリには、各種コード監査を AI エージェントに依頼するための「貼り付け用プロンプト（goal）」を md 形式で置く。用途は共通（セキュリティ・脆弱性・バグ・保守性の監査と現行機能を壊さない範囲での修正）なので、ファイル名を以下のスキームで統一する。

## スキーム

```
{ツール}_audit_{監査対象}.md
```

- 軸の順序は固定: `ツール名` → `audit` → `監査対象`
- すべて小文字・アンダースコア区切り（kebab-case ではなく snake_case）
- `{監査対象}` は「コード監査（DB区分）」「サーバー診断（server）」「資料突合（doc_vs_impl）」の 3 系統。コード監査では DB区分（`db_app` / `db_less_app`）が、サーバー診断では `server` が、資料突合では `doc_vs_impl` が入る。

### {ツール}

| 値 | 対象 |
|---|---|
| `codex` | Codex CLI に作業ゴールとして貼る用 |
| `claude_ultracode` | Claude Code の ultracode（多エージェント並列ワークフロー）で実行する用 |
| `claude_fable` | Claude Code で Fable 系モデル（例: `/model claude-fable-5`。以降のバージョンも対象）を使って実行する用。調査・修正は単一エージェントの深い推論、敵対的検証・rubric 採点は独立コンテキストの verifier サブエージェントへ委託する |

新しいツールを足す場合もこの位置にツール識別子を置く（例: `gemini_audit_db_app.md`）。

### {監査対象}

| 値 | 対象 |
|---|---|
| `db_less_app` | コード監査。DB を使わないアプリ。永続化はファイル/設定/JSON/YAML/TOML/ブラウザ保存領域/Cookie/キャッシュ/メモリ/外部API |
| `db_app` | コード監査。DB を使うアプリ。DBアクセス層（SQL/ORM/トランザクション）も監査対象 |
| `server` | サーバー診断。SSH でアクセスできる稼働中サーバーを完全 read-only で診断し、対策を提言する（修正は適用しない）。DB区分の軸は持たない |
| `doc_vs_impl` | 資料突合監査。外部作成の資料（説明会資料・マニュアル・仕様書・顧客向け文書）の記載と現行実装の差異を完全 read-only で洗い出す（修正は適用しない）。DB区分の軸は持たない。資料パスを引数で受ける |

## 現在のファイル

コード監査:

| ツール | DBなし | DBあり |
|---|---|---|
| Codex | `codex_audit_db_less_app.md` | `codex_audit_db_app.md` |
| Claude (ultracode) | `claude_ultracode_audit_db_less_app.md` | `claude_ultracode_audit_db_app.md` |
| Claude (Fable) | `claude_fable_audit_db_less_app.md` | `claude_fable_audit_db_app.md` |

サーバー診断（完全 read-only）:

| ツール | ファイル |
|---|---|
| Codex | `codex_audit_server.md` |
| Claude (ultracode) | `claude_ultracode_audit_server.md` |
| Claude (Fable) | `claude_fable_audit_server.md` |

資料突合（完全 read-only）:

| ツール | ファイル |
|---|---|
| Claude (ultracode) | `claude_ultracode_audit_doc_vs_impl.md` |

> codex / claude_fable 版の資料突合プロンプトは未作成（必要になった時点でこのスキームで追加する）。

## ファイル内部の書式

各ファイルは以下の構成に揃える。

1. H1 タイトル（`# {ツール} ... 監査` のように、ツールと DB区分が分かる見出し）
2. 概要 1〜2 段落（何の用途か / 主要な禁止事項 / `ultracode` キーワードの注記など）
3. ` ```text ` フェンスブロックに、そのまま貼り付け可能な goal プロンプト全文

フェンスブロック内の冒頭は引数ブロック → 引数の定義 → 本文の順に固定する（詳細は `README_invariants.md` の「引数ブロック」節を参照）。

## 命名時の注意

- 用途が同じプロンプトは、中身の主眼（security 寄り / bug 寄り 等）が違っても**ファイル名には反映しない**。区別軸はあくまで「ツール」と「DB区分」のみ。
- 区別したい新しい軸が出てきた場合は、このファイルに軸を追記してから命名する（場当たりで suffix を増やさない）。
- 新規ファイルを足したら、このファイルの「現在のファイル」表も更新する。
