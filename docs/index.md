---
okf_version: "0.2"
---

# AI Audit Prompts Knowledge Bundle

この `docs/` は、tool非依存の監査promptとその運用契約を収録したOpen Knowledge Format v0.2 Bundleです。通常のMarkdownとして直接使えます。

推奨導線は、このindex → [起動・routing規約](README_activation.md) → 対象別の正典prompt → app/serverのinvariantsです。

## 起動と規約

- [共通監査prompt起動ルール](README_activation.md): `target → DB/profile → capability` で正典を選ぶ。
- [docs命名・metadata規則](README_naming.md): 正典、deprecated alias、metadata値域を定義する。
- [app監査の共通契約](README_invariants.md): scope、approval、profile、evidence、検証、summaryの正本。
- [server診断の共通契約](README_invariants_server.md): 完全read-only、接続先照合、診断、evidence、summaryの正本。
- doc-vs-implの非変更契約は、正典prompt内に自己完結している。

## 推奨する正典prompt

自動選択と新規利用の対象は次の3本だけです。実行tool/provider/modelではなく監査対象から選びます。

- [アプリ／source code監査](audit_app.md): DB区分とWeb/API、AI/agent、platform、CI/CD、supply chain、cloud/IaC等のprofileを実装証拠から選ぶ。
- [管理下server診断（完全read-only）](audit_server.md): 所有・管理下serverの実効状態を変更せず調べ、対策を提言する。
- [資料と実装の差異監査（完全非変更）](audit_doc_vs_impl.md): 必須指定された資料のclaimを、現行実装・設定・UI・正典と突合する。

## 移行用deprecated alias

次の14ファイルは旧pathから後継正典を案内するだけのaliasです。paste-ready promptではなく、自動選択・推奨一覧・正典数に含めません。

app（後継: `audit_app.md`、DB引数をalias metadataに保持）:

- [codex / DBあり](codex_audit_db_app.md)
- [codex / DBなし](codex_audit_db_less_app.md)
- [claude_ultracode / DBあり](claude_ultracode_audit_db_app.md)
- [claude_ultracode / DBなし](claude_ultracode_audit_db_less_app.md)
- [claude_fable / DBあり](claude_fable_audit_db_app.md)
- [claude_fable / DBなし](claude_fable_audit_db_less_app.md)
- [generic / DBあり](generic_audit_db_app.md)
- [generic / DBなし](generic_audit_db_less_app.md)

server（後継: `audit_server.md`）:

- [codex](codex_audit_server.md)
- [claude_ultracode](claude_ultracode_audit_server.md)
- [claude_fable](claude_fable_audit_server.md)
- [generic](generic_audit_server.md)

doc-vs-impl（後継: `audit_doc_vs_impl.md`）:

- [claude_ultracode](claude_ultracode_audit_doc_vs_impl.md)
- [generic](generic_audit_doc_vs_impl.md)

aliasは1回の移行releaseだけ残し、repo内外consumerの移行確認後に別planで削除します。
