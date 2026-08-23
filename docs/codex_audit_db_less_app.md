---
type: "Deprecated Audit Alias"
title: "Deprecated alias: codex_audit_db_less_app.md"
description: "統合前の旧pathから対象中心の正典promptへ案内する一時alias。"
tags: ["audit", "deprecated", "alias"]
status: "deprecated"
deprecation:
  successor: "audit_app.md"
  arguments:
    DB区分: "なし"
  removal: "次の破壊的変更release。repo内外consumer移行確認後に別planで削除"
---

# [Deprecated] codex_audit_db_less_app.md

この旧pathは移行案内だけを残したdeprecated aliasであり、単体ではpaste-ready監査promptではありません。

後継の [audit_app.md](audit_app.md) 全文を使い、DB区分は「なし」を指定してください。

新規の自動選択ではこのfileを使わないでください。削除はrepo内外consumerの移行確認後、別planで行います。
