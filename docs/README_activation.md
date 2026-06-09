# 共通監査プロンプト起動ルール

このディレクトリの監査プロンプトは重い作業用であり、通常の質問、軽い調査、コード説明、単発修正では自動起動しない。

各プロジェクトの `AGENTS.md` / `CLAUDE.md` には、重い監査プロンプトを通常時に読ませる指示を書かない。

このファイルは、ユーザーが明示的にこの監査プロンプト集（このリポジトリの `docs/`）を参照して監査実行を依頼した時だけ読む。

## 各プロジェクトに書く指示

```md
## 共通監査プロンプト

通常作業では監査プロンプト集リポジトリ（clone 済みの ai-audit-prompts 等）を読まない。
ユーザーが明示的にその監査プロンプト集を参照して監査実行を依頼した場合だけ、その `docs/README_activation.md` を読んで適切な監査プロンプトを選ぶ。
```

## 起動条件

このファイルは通常ターンでは読ませない。

ユーザーがこの監査プロンプト集を明示して監査実行を依頼した場合だけ、ここから先を読む。

## 起動しない例

以下の場合は、監査プロンプトを読まない。

- `セキュリティ的にどう?`
- `このコード見て`
- `バグ直して`
- `軽く確認して`
- `この関数を説明して`
- `依存関係を見て`
- `監査プロンプトってどこだっけ?`
- `この監査リポジトリに何がある?`（一覧確認だけなら起動しない）

これらは通常の依頼として扱い、必要な範囲だけ調査する。

## 自動選択ルール

起動条件を満たしたら、ツールとDB区分からファイルを自動選択する。

| 条件 | 使用ファイル |
|---|---|
| Codex CLI / Codex / `/goal` 用、DBあり | `codex_audit_db_app.md` |
| Codex CLI / Codex / `/goal` 用、DBなし | `codex_audit_db_less_app.md` |
| Claude / ultracode 用、DBあり | `claude_ultracode_audit_db_app.md` |
| Claude / ultracode 用、DBなし | `claude_ultracode_audit_db_less_app.md` |

## DB区分の判定

ユーザーが DBあり / DBなしを明示した場合は、それを最優先する。

明示がない場合は、監査プロンプト選択前にリポジトリを軽く確認し、以下のいずれかが見つかれば DBあり版を選ぶ。

- `migration` / `migrations` ディレクトリ
- `schema` / `models` / `repositories` / `dao` / `prisma` などの DB 関連ディレクトリ
- SQL ファイル
- ORM 設定や schema ファイル
  - Prisma: `schema.prisma`
  - Rails: `db/schema.rb`
  - Django: `models.py`
  - SQLAlchemy / Alembic
  - TypeORM / Sequelize / Knex
- DB driver / ORM 依存関係
  - Node.js: `pg`, `mysql2`, `sqlite3`, `better-sqlite3`, `mongoose`, `prisma`, `typeorm`, `sequelize`, `knex`
  - Go: `gorm`, `database/sql`, `sqlx`, `pgx`, `go-sql-driver/mysql`, `lib/pq`
  - Python: `psycopg`, `mysqlclient`, `sqlalchemy`, `django`, `alembic`
  - Rust: `diesel`, `sqlx`
  - PHP: `doctrine`, `eloquent`, `pdo`
- DB 接続設定
  - `DATABASE_URL`
  - `DB_HOST`
  - `DB_NAME`
  - `POSTGRES_*`
  - `MYSQL_*`
  - `SQLITE_*`
- コード内の DB 接続、query、transaction、migration 実行処理

以下だけなら DBなし版を選ぶ。

- JSON / YAML / TOML / CSV / Markdown などのローカルファイル保存
- `localStorage` / `sessionStorage` / `IndexedDB` / Cookie 中心
- 外部APIだけを使う
- in-memory state だけ
- 設定ファイルのみ
- DB driver / ORM / migration / SQL が見つからない

判定できない場合は止まらず、DBあり版を安全側のデフォルトとして使う。ただし、監査プロンプト内の禁止事項に従い、本番DB接続、DB変更、migration 実適用は行わない。

## ツール区分の判定

- Codex が作業する場合は `codex_*.md`
- Claude Code / ultracode が作業する場合は `claude_ultracode_*.md`
- ユーザーが明示したツール名があればそれを優先する

## 起動時の動作

起動条件を満たしたら、以下の順に進める。

1. この `README_activation.md` を読む
2. `README_naming.md` を読む
3. 自動選択ルールで該当する監査プロンプト md を読む
4. 監査プロンプト本文に従って実行する

## 運用方針

- 通常作業では監査プロンプトを勝手に展開しない
- ファイル名をユーザーに毎回指定させない
- ユーザーはこの監査プロンプト集（リポジトリ）を指定すればよい
- 判断に迷う場合も、重い監査を勝手に始めず、通常作業として扱う
