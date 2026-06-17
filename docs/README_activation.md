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

## 監査対象区分の判定（コード / サーバー）

起動条件を満たしたら、まず「何を監査するか」を判定する。

- **コード監査**（既定）: リポジトリ/ソースコードを対象に、セキュリティ・脆弱性・バグ・保守性を監査し、現行機能を壊さない範囲で修正する。`*_audit_db_app.md` / `*_audit_db_less_app.md` を使う。
- **サーバー診断**: SSH でアクセスできる稼働中サーバーを対象に、脆弱性・設定不備・侵害痕跡を**完全 read-only** で診断し、対策を提言する（修正は適用しない）。`*_audit_server.md` を使う。

ユーザーの依頼に以下のような表現があればサーバー診断と判定する（明示があればそれを最優先）。

- 「サーバーの脆弱性を診断/チェック」「SSH した（できる）サーバーを監査」「VPS/ホストのセキュリティを見て」「サーバーのハードニング/設定不備を見て」「どう対策すべきか」（サーバー文脈）

リポジトリ/コードの監査を指す表現（「このコードを監査」「リポジトリを監査」等）はコード監査と判定する。判定できない場合はコード監査を既定とする。

サーバー診断と判定した場合、DB区分の判定は行わない（DB軸はコード監査専用）。続く「ツール区分の判定」でファイルを選ぶ。

### 対象外・誤適用に注意

依頼を区分に当てはめる前に、そもそも本プロンプト集の対象かを確認する。

- **URL だけ渡された外部サイトは監査できない。** 本プロンプト集はコード（リポジトリ/ソース）か、自分の管理下サーバーへの SSH のどちらかを前提とする。外部サイトへ能動的にリクエストを送って調べる診断（DAST/能動スキャン）は所有者の許可が要る別物で、本集の対象外。URL しか無い場合はコードか SSH を求める。
- **共用サーバー（レンタルサーバー）はサーバー診断（`*_audit_server.md`）の対象にしない。** 一般ユーザー権限しか持てず（sudo 不可）・自分の領域に閉じ込められ、システム領域や他テナントを覗くこと自体が規約違反になり得るため。判定基準は「**root でログインするか**」ではなく「**OS 全体への管理権限（sudo）があり、かつその機器を自分が調べてよい（所有・運用している）か**」。VPS（さくらVPS / ConoHa / EC2 等）は `ubuntu` 等の非 root ユーザーでログインしても sudo が効き自分の管理下なので**サーバー診断の対象**。共用レンタルサーバーはこれを満たさないので対象外。
- **共用サーバー上の WordPress 等の CMS サイトはコード監査として扱う。** サーバー診断ではなく、自分の領域内のコード（自作テーマ・自作プラグイン・`wp-config.php`・`functions.php` 等のカスタム部分）を SSH/FTP で取得し、`*_audit_db_app.md` で監査する（WordPress は PHP+MySQL なので DBあり）。CMS 本体や公式プラグインまで全走査せず、カスタム部分に絞るのが実用的。

## 自動選択ルール

### コード監査の場合（ツール × DB区分）

| 条件 | 使用ファイル |
|---|---|
| Codex CLI / Codex 用、DBあり | `codex_audit_db_app.md` |
| Codex CLI / Codex 用、DBなし | `codex_audit_db_less_app.md` |
| Claude / ultracode 用、DBあり | `claude_ultracode_audit_db_app.md` |
| Claude / ultracode 用、DBなし | `claude_ultracode_audit_db_less_app.md` |
| Claude Fable 用、DBあり | `claude_fable_audit_db_app.md` |
| Claude Fable 用、DBなし | `claude_fable_audit_db_less_app.md` |

### サーバー診断の場合（ツールのみ。DB軸なし）

| 条件 | 使用ファイル |
|---|---|
| Codex CLI / Codex 用 | `codex_audit_server.md` |
| Claude / ultracode 用 | `claude_ultracode_audit_server.md` |
| Claude Fable 用 | `claude_fable_audit_server.md` |

サーバー診断のファイルは完全 read-only（サーバー状態を一切変更しない・対策は提言のみで適用は人間）が不変条件。正本は [README_invariants_server.md](README_invariants_server.md)。

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
- Claude Fable 系モデルが作業する場合（`/model claude-fable-5` 等の指定・モデルが Fable 系）は `claude_fable_*.md`
- ユーザーが明示したツール名があればそれを優先する

## 引数の扱い（Fable / ultracode / Codex 共通）

起動コマンドに以下の引数が含まれている場合は、その値を優先する。省略された引数はデフォルト値または自動判定を適用する。

| 引数 | 値の例 | 省略時 |
|---|---|---|
| DB区分 | あり / なし | 自動判定（「DB区分の判定」ルールに従う） |
| 強度 | ロー / ミッド / ハイ | ハイ |
| スコープ | 調査まで / 調査・修正まで / フルループ | フルループ |
| 観点 | バグ / セキュリティ・脆弱性 / 依存関係 / 全部 | 全部 |
| 対象 | パスを指定 | リポジトリ全体 |
| 除外 | パスを指定 | 除外なし |

DB区分が明示されている場合は自動判定をスキップし、その値でファイルを選択する。
強度・スコープ・観点・対象・除外が明示されている場合は、選択したプロンプトの `＿＿＿` をその値に置き換えて実行する。

### サーバー診断の引数（`*_audit_server.md` の場合）

サーバー診断はスコープ引数を持たず（常に完全 read-only 診断で固定）、代わりに接続方法を持つ。

| 引数 | 値の例 | 省略時 |
|---|---|---|
| 接続方法 | AI接続 / サーバー上 | AI接続 |
| 接続先 | `user@host[:port]` | AI接続時は必須。未指定で推測不能なら接続できない旨を報告して終了 |
| 強度 | ロー / ミッド / ハイ | ハイ |
| 観点 | ホスト・OS / SSH設定 / OS・パッケージ脆弱性 / ネットワーク・公開サービス / ファイアウォール / ユーザー・権限 / ファイル権限・SUID / サービス・TLS / ログ・侵害痕跡 / cron・timer / secrets露出 / コンテナ / カーネル・ハードニング / MAC（SELinux/AppArmor） / 時刻同期 / データ保護 / 全部 | 全部 |
| 対象 | 特定サービス・パス | サーバー全体 |
| 除外 | パスを指定 | 除外なし |

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
