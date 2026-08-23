---
type: "Naming Convention"
title: "docs 命名・metadata規則"
description: "対象中心の正典prompt、deprecated alias、OKF選択metadataを定義する正本。"
tags: ["audit", "naming", "metadata"]
status: "stable"
---

# docs 命名・metadata規則

監査promptの選択軸は実行toolではなく監査対象とする。provider、製品、model、CLI/Web UI、並列機能の違いは、正典prompt開始時のcapability profileと任意の起動adapterで吸収する。

## 正典prompt

filenameは次の3本に固定する。

| target | filename | family | 固有分岐 |
|---|---|---|---|
| app / source code | `audit_app.md` | `code` | DB区分、security profile、scope、検証モード、capability |
| managed server | `audit_server.md` | `server` | 接続方法、role、観点、capability。常に完全read-only |
| document vs implementation | `audit_doc_vs_impl.md` | `doc_vs_impl` | 資料、正典、媒体、capability。常に非変更 |

正典はすべてpaste-readyで自己完結し、特定tool/modelの起動commandを必須にしない。

## OKF選択metadata

正典promptのfrontmatterは次を使う。

```yaml
type: "Audit Prompt"
status: "stable"
audit:
  tool: "any"
  target: "app | server | doc_vs_impl"
  family: "code | server | doc_vs_impl"
  canonical: true
```

値域:

| metadata | 許可値 | 規約 |
|---|---|---|
| `audit.tool` | `any` | 正典選択にtoolを使わないことを示す |
| `audit.target` | `app` / `server` / `doc_vs_impl` | filenameと一致させる |
| `audit.family` | `code` / `server` / `doc_vs_impl` | appだけ`code`、他はtargetと同値 |
| `audit.canonical` | `true` | 推奨一覧・機械routingの対象であることを示す |

`docs/index.md` はOKF v0.2 Bundle rootの予約形式であり、frontmatterは `okf_version` 以外のkeyを持たせない。

通常文書のtype:

| 文書 | `type` |
|---|---|
| 正典3 prompt | `Audit Prompt` |
| `README_invariants*.md` | `Audit Invariant` |
| `README_activation.md` | `Audit Routing Policy` |
| `README_naming.md` | `Naming Convention` |
| 旧path alias | `Deprecated Audit Alias` |

## deprecated alias

統合前の14 pathは、1回の移行リリースだけpath案内互換として残す。aliasはpaste-ready互換ではない。

対象:

- app 8本: `codex|claude_ultracode|claude_fable|generic` × `db_app|db_less_app`
- server 4本: 同4toolの `*_audit_server.md`
- doc-vs-impl 2本: `claude_ultracode_audit_doc_vs_impl.md` / `generic_audit_doc_vs_impl.md`

aliasのfrontmatterは正典promptとして自動選択されない形にする。

```yaml
type: "Deprecated Audit Alias"
status: "deprecated"
deprecation:
  successor: "audit_app.md"
  arguments:
    DB区分: "あり"
  removal: "次の破壊的変更release。repo内外consumer移行確認後に別planで削除"
```

- `audit.*` metadataを付けない。
- 監査本文、profile、rubric、tool固有起動instructionsを複製しない。
- successorの相対link、旧DB引数対応、削除gateだけを書く。
- 正典prompt数、推奨一覧、自動routing、OKF主要導線へ含めない。

alias削除前に、repo外skill等のactive consumerが新3本へ移行済みであることと、旧path検索結果が履歴参照だけであることを確認する。

## 任意adapter

起動adapterを追加する場合は、正典本文とは別にし、次だけを持たせる。

- runtimeでの起動方法
- capability取得方法
- 正典promptと引数の渡し方
- capability不足時に正典の直列方式へ戻る方法

監査観点、安全境界、evidence、summary、rubricをadapterへ複製しない。adapterの追加・変更は正典prompt数を増やさない。

## 成果物命名

- plan: `<target-repo>/docs/local/plan_<audit-topic>.md`
- report既定: `<target-repo>/docs/ai-audit-prompts/report_audit_<topic>_<YYYY-MM-DD>.md`
- server reportもowner private repoへ保存し、owner未確定のまま接続しない
- userが `保存先=<repo-relative path>` を明示した場合だけreport先を変更する

report frontmatterは `type: audit-report`、`status: draft|stable`、`docsweep_policy: never_archive` を使い、`docsweep_state` / `due` は使わない。

## 命名変更手順

新しい監査対象が必要になった場合だけ、この文書でtargetとfamilyの値域を先に追加する。新しいtool/provider/modelのために正典promptを増やさない。公開Markdownを増減・分類変更した場合は、`docs/index.md`、activation、README日英、CLAUDE、CHANGELOG、OKF検査を同じ変更で同期する。
