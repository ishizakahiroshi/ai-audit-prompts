---
type: "Audit Routing Policy"
title: "共通監査prompt起動ルール"
description: "監査対象をapp・server・doc-vs-implへ分類し、tool非依存の正典3本から選ぶrouting policy。"
tags: ["audit", "routing", "selection", "capability-based"]
status: "stable"
---

# 共通監査prompt起動ルール

このbundleの監査promptは重い監査用である。通常の質問、軽い調査、code説明、単発修正では自動起動しない。

各projectのinstructionsには、通常作業でこのrepoを常時読ませる指示を置かない。利用者がこの監査prompt集を明示して監査実行を依頼した場合だけ、この文書から対象正典を選ぶ。

## 起動しない例

- 「セキュリティ的にどう?」「このcode見て」「軽く確認して」
- 「このfunctionを説明して」「依存関係を見て」「このbugを直して」
- 「監査promptはどこ?」「このrepoに何がある?」

これらは通常依頼として必要範囲だけ扱う。

## 1. 監査対象を選ぶ

実行tool、provider、model、CLI/Web UIではなく、何を監査するかで正典を選ぶ。

| 対象 | 正典 | 判定 |
|---|---|---|
| app / repository / source code | [`audit_app.md`](audit_app.md) | code、設定、test、workflow、package、アプリ構成を監査する。判定不能時の既定 |
| managed server / VPS / host | [`audit_server.md`](audit_server.md) | 利用者が所有・運用し、OS全体を調査する権限を持つ稼働serverを完全read-only診断する |
| document vs implementation | [`audit_doc_vs_impl.md`](audit_doc_vs_impl.md) | 指定資料の主張と現行実装を完全非変更で突合する。資料指定必須 |

### server判定

「server/VPS/hostの脆弱性」「SSHできる管理下server」「hardening」「firewall/sshd/OS設定」等の依頼はserverとする。

- root loginの有無ではなく、sudo等でOS全体を調査する正当な管理権限と所有/運用責任があるかで判定する。
- 共用hostingはserver診断対象外。自分の領域のWordPress/custom code等はapp監査として扱う。
- URLだけの外部siteは対象外。第三者siteへのactive scan/DASTはこのbundleでは行わない。
- server診断はreport ownerとなるprivate repo、接続先、接続承認が揃うまで実接続しない。

### doc-vs-impl判定

「この資料と実装の差異」「説明会資料/マニュアル/仕様書と現行仕様を突合」「画面資料が実装どおりか」等はdoc-vs-implとする。資料path/URLが無ければ1回だけ確認し、推測で選ばない。DB区分は判定しない。

### app判定

repository/source codeを対象にsecurity、vulnerability、bug、dependency、maintainabilityを調べる依頼はappとする。app正典はDB区分とsecurity profileを内部で解決する。

## 2. tool/modelではなくcapabilityを記録する

正典を選んだ後、prompt内で実際に利用できる能力を `yes / no / unknown` と根拠付きで記録する。少なくともfile検索、shell/read-only command、test系、Web一次情報、並列agent、独立verifier、file編集、plan/report作成を確認する。

- 並列/独立verifierがあれば探索と検証を分離できる。
- 並列だけならlead探索へ限定し、統合担当が再読する。
- 並列がなければ直列二巡で反証する。
- 能力が不明/不足でも正典を変えず、未検証を明示する。

製品名やmodel名からsubagent、shell、Web、file write等の能力を推測しない。新しいprovider/modelのために正典promptを追加しない。

## 3. appのDB区分とprofile

DB区分はfile選択ではなく `audit_app.md` の引数として渡す。

| user指定/状況 | `DB区分` |
|---|---|
| 明示的にDBあり | `あり` |
| 明示的にDBなし | `なし` |
| 未指定 | `自動` |

自動時はpromptがmanifest、dependency/lock、schema、migration、ORM/SQL、DB driver、接続設定を軽く確認し、`あり / なし / unknown` と根拠をreportへ残す。判定不能でも本番接続やmigrationを試さない。

appはWeb/API、AI/agent/MCP/RAG、native、desktop、mobile、browser extension、CLI、library/package、CI/CD/supply chain、cloud/IaC/Kubernetes、DBあり/なしを複数profileとして `selected / skipped / unknown + evidence` で選ぶ。全profileを無条件実行しない。

## 引数

### app

| 引数 | 値 | 省略時 |
|---|---|---|
| DB区分 | 自動 / あり / なし | 自動 |
| 強度 | ロー / ミッド / ハイ | ハイ |
| スコープ | 調査まで / 調査・修正まで / フルループ | 調査まで |
| 検証モード | 静的 / 安全なローカル検証 / build含む | 安全なローカル検証 |
| 観点 | バグ / セキュリティ・脆弱性 / 依存関係 / 全部 / profile名 | 全部 |
| 対象 | repo相対path | repo全体 |
| 除外 | repo相対path | なし |
| 保存先 | repo相対path | docs/ai-audit-prompts |
| Git管理 | ignore / track | 未存在folder作成前に確認 |
| 確認 | あり / なし | あり |

### server

`接続方法`、`接続先`、`強度`、`観点`、`対象`、`除外`、`保存先`、`Git管理`、`確認` を使う。変更scopeはなく、常に完全read-only。

### doc-vs-impl

`資料`（必須）、`正典`、`媒体`、`強度`、`対象`、`除外`、`保存先`、`Git管理`、`確認` を使う。資料/source/UIは常に非変更。

明示された値を優先し、選んだ正典の空欄へ渡す。確認「あり」ではprompt記載の実行前gateを行う。確認「なし」でも未存在保存先のGit管理やfallbackが未解決なら開始しない。

## 成果物routing

- plan: target/owner repoの `docs/local/plan_<audit-topic>.md`
- report既定: `docs/ai-audit-prompts/report_audit_<topic>_<YYYY-MM-DD>.md`
- server reportもpublic prompt repoではなくowner private repoへ保存する
- `保存先=` があればreportだけ指定repo相対pathへ変更する
- `docs/obsidian` は明示指定時だけ使い、entry target/writableを確認する

reportは `type: audit-report`、`status: draft|stable`、`docsweep_policy: never_archive` を使う。監査事実/evidenceの正本はreport、未対応作業の実行正本はrelated先plan/bugfix/pendingとする。

## deprecated alias

統合前のtool × DB/target 14 pathは移行案内として1回のreleaseだけ残すが、自動選択・推奨一覧・正典prompt数へ含めない。aliasはpaste-ready promptではなく、必ず後継3本の全文を使う。

alias削除はrepo内外consumer移行後の別planで行う。新規workで旧pathを選ばない。

## 任意の起動adapter

runtime固有の起動commandやcapability取得補助は、必要ならrepo外adapterで扱う。adapterは正典pathと引数を渡すだけとし、安全境界、監査観点、evidence、summary、rubricを複製しない。adapterが無くても正典3本は単独で完走できる。

## OKF progressive disclosure

OKF Bundleとしては [`index.md`](index.md) → このrouting → 選んだ正典prompt → app/serverのinvariants、の順に読む。通常Markdownとして正典を直接使っても実行契約は変わらない。
