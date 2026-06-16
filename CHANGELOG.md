# Changelog

このプロジェクトの主な変更点を記録します。
書式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に従い、[セマンティックバージョニング](https://semver.org/lang/ja/) を採用します。

## [Unreleased]

## [0.5.0] - 2026-06-16

監査レポートの冒頭に「総合 100 点満点 + 5 カテゴリスコア + サブ項目内訳 + 減点理由→クリア条件」をまとめた**総合評価ヘッダー**を必ず出すスコアリング規約を追加。レポートを開いた瞬間に「全体としてどうか」「どこが弱いか」「何をすれば点が上がるか」が一目で分かるようにする。

### Added

- **スコアリング規約**を全 9 プロンプト + 正本 2 ファイルに展開
  - 5 カテゴリ × 100 点満点で総合スコアを算出（コード監査: セキュリティ・脆弱性 30 / バグ・正確性 25 / 依存関係 15 / 保守性 15 / 検証カバレッジ 15、サーバー診断: 外部到達面 30 / パッチ・更新 20 / 権限・ユーザー 20 / サービス・データ保護 15 / 監視・侵害痕跡・MAC 15）
  - 数字（粒度）+ S/A/B/C/D バッジ（温度感）を併記。閾値は `S=90+ / A=75+ / B=60+ / C=40+ / D=40未満`
  - 各カテゴリにサブ項目を置き、OS バージョン・ミドルウェア版数・アプリ依存版数などを別の数字で見せる
  - 「減点理由 → クリア条件」列を必ず出し、何を直せば総合 +N 点になるかを同じ表で示す
  - 各 finding に「クリアで総合 +N 点」「該当カテゴリ・サブ項目」を付与し、finding 一覧を「重大度 × 上がる点数」降順で並べる
  - スコア算定式は `スコア = 満点 − Σ（確定 finding の減点）`、満点は「対象範囲に確定 finding が 0 件」と定義
  - 確信度 low の疑いは減点に含めず「判断待ち（未採点）」として件数だけ表示
- `docs/README_invariants.md`（コード監査の正本）と `docs/README_invariants_server.md`（サーバー診断の正本）にスコアリング節を追加
- 結果報告 md 冒頭の総合評価ヘッダー出力を完了条件（rubric）に組み込み、未出力なら完了としない

### Changed

- 全 9 プロンプト（`codex_audit_db_app.md` / `codex_audit_db_less_app.md` / `codex_audit_server.md` / `claude_ultracode_audit_db_app.md` / `claude_ultracode_audit_db_less_app.md` / `claude_ultracode_audit_server.md` / `claude_fable_audit_db_app.md` / `claude_fable_audit_db_less_app.md` / `claude_fable_audit_server.md`）の finding 出力形式に「スコア影響」「クリアで総合 +N 点」を追加
- 各プロンプトの最終報告フォーマット先頭に「総合評価ヘッダー」項目を追加し、スコアは人間レビュー後に変動しうる旨を最終報告に明記する運用に統一
- サーバー診断 3 ファイルでは「対策の適用は人間。スコアは現状を示す指標であり AI は適用しない」を改めて明記

## [0.4.0] - 2026-06-15

新たな監査系統として「サーバー診断」を追加。SSH でアクセスできる稼働中サーバーを完全 read-only で診断し、脆弱性・設定不備・侵害痕跡に対する対策を提言する（修正は適用しない）。コード監査とは安全境界が異なり、サーバー状態を一切変更しない・対策の適用は人間が行うことを最上位の不変条件とする。

### Added

- サーバー診断プロンプト 3 ファイルを追加（完全 read-only・対策は提言のみ）
  - `docs/codex_audit_server.md`（Codex / 詳細列挙型）
  - `docs/claude_ultracode_audit_server.md`（Claude ultracode / 並列ファンアウト型）
  - `docs/claude_fable_audit_server.md`（Claude Fable / 単一エージェント深い推論型）
- `docs/README_invariants_server.md`（サーバー診断専用の不変条件・正本）を追加
  - 完全 read-only（状態変更全面禁止）/ 禁止操作・許可される read-only コマンド / 接続方法（AI接続・サーバー上の選択、既定は AI接続）/ SSH ロックアウト回避・サーバー役割考慮 / 対策提言フォーマット / プロンプトインジェクション対策 / 人間レビュー・人間適用前提
- 診断観点（SSH 設定・OS/パッケージ脆弱性・公開ポート・ファイアウォール・ユーザー権限・SUID/権限・TLS・侵害痕跡・cron・secrets 露出・コンテナ・カーネルハードニング）を 3 ファイル共通で整備

### Changed

- `docs/README_activation.md` に「監査対象区分（コード / サーバー）」の判定と、サーバー診断のファイル自動選択・接続方法引数を追加
- `docs/README_naming.md` のスキームを `{ツール}_audit_{監査対象}` に一般化し、`server` 区分と現在のファイル表を追加
- `README.md` / `README.en.md` にサーバー診断の使い方・ディレクトリ構成・安全上の注意を追記
- コード監査の不変条件にブランチ操作の禁止を追加（`docs/README_invariants.md` を正本に、`*_audit_db_app.md` / `*_audit_db_less_app.md` の 6 ファイルへ展開）。エージェントはブランチの作成・切り替え・マージをせず、実行者が事前に用意した現在チェックアウト中のブランチ上でのみ修正する

## [0.3.0] - 2026-06-13

Anthropic「Designing loops with Fable 5」の知見を反映し、全監査プロンプトをループ設計（独立 verifier・rubric 化・メモリ運用）で刷新。あわせて Fable 版の識別子からバージョン番号を外し、将来のモデルでも使い続けられるよう汎用化。

### Changed

- ツール軸の識別子をバージョンレス化: `claude_fable5_*` → `claude_fable_*`（Fable 6/7 以降でもそのまま使える。モデル ID は本文に `例: claude-fable-5` として残す）
- Fable 版（`claude_fable_audit_db_app.md` / `claude_fable_audit_db_less_app.md`）をループ設計に刷新
  - 敵対的検証を同一コンテキストの self-critique から独立コンテキストの verifier サブエージェントへ委託（不可環境では新しい視点での自己検証にフォールバック）
  - 完了条件を番号付き rubric 化（全基準が充足と判定されるまで終了しない採点ループ）
  - plan md をメモリとして運用（fail→investigate→verify→distill→consult）
  - 過剰に規定的な手順を削ぎ落とし、ゴール・禁止事項・rubric を渡して進め方はモデルに委ねる
- ultracode 版・Codex 版（4ファイル）にも rubric 化完了条件・plan md メモリ運用を展開（de-prescribe は各ツールの設計を尊重して非適用）
- 全6プロンプト＋正本に grounded progress claims（進捗報告を実行結果と突き合わせ、裏付けのない項目は「未検証」と明記）を統一
- `docs/README_invariants.md`（正本）を 6 ファイル基準に更新し、verifier / rubric / メモリ運用 / grounded progress を不変条件として追加
- `docs/README_naming.md` / `docs/README_activation.md` / `README.md` / `README.en.md` を `claude_fable` 命名へ更新、`/goal` の帰属表現を修正

### Renamed

- `docs/claude_fable5_audit_db_app.md` → `docs/claude_fable_audit_db_app.md`
- `docs/claude_fable5_audit_db_less_app.md` → `docs/claude_fable_audit_db_less_app.md`

[0.3.0]: https://github.com/ishizakahiroshi/ai-audit-prompts/compare/v0.2.0...v0.3.0

## [0.2.0] - 2026-06-11

Claude Fable 5 対応版を追加。深い推論（拡張思考）を活かした単一エージェント監査プロンプト2ファイル、および note 記事・アセット一式。

### Added

- Claude Fable 5 対応の監査プロンプト（`docs/`）
  - `claude_fable5_audit_db_app.md` — Fable 5 版 / DB あり
  - `claude_fable5_audit_db_less_app.md` — Fable 5 版 / DB なし
- Fable 5 向けアセット（`assets/20260611/`）
  - `header_fable5.html` / `header_fable5.png` — 記事ヘッダー画像
  - `compare_ultracode_vs_fable5.html` / `compare_ultracode_vs_fable5.png` — ultracode vs Fable 5 比較図
  - `how_to_fable5.html` / `how_to_fable5.png` — 使い方フロー図
  - `note_article_fable5.md` — note 記事原稿

### Changed

- `docs/README_naming.md` — `claude_fable5` ツール軸を追加
- `docs/README_invariants.md` — 対象ファイルを 4 → 6 に更新、ツール軸の差分説明を拡充
- `assets/` — 日付別ディレクトリ構成に変更（v0.1.0 資材 → `assets/20260609/`）
- `README.md` / `README.en.md` — Fable 5 の使い方を追加、ディレクトリ構成を更新、画像パスを更新

[0.2.0]: https://github.com/ishizakahiroshi/ai-audit-prompts/compare/v0.1.0...v0.2.0

## [0.1.0] - 2026-06-09

初回リリース。AI エージェント（Claude Code / Codex CLI）に貼り付けて使う、汎用コード監査プロンプト集。

### Added

- 監査プロンプト集（`docs/`）
  - `claude_ultracode_audit_db_app.md` — Claude (ultracode) 版 / DB あり
  - `claude_ultracode_audit_db_less_app.md` — Claude (ultracode) 版 / DB なし
  - `codex_audit_db_app.md` — Codex CLI 版 / DB あり
  - `codex_audit_db_less_app.md` — Codex CLI 版 / DB なし
- 起動・自動選択ルール `docs/README_activation.md`（ツールと DB 区分に応じて最適なプロンプトを自動選択）
- 全プロンプト共通の不変条件の正本 `docs/README_invariants.md`（ビルド・コミット・本番 DB 操作・抜本改修の禁止、止まらず最後まで走り切る、判断待ちは記録してパス）
- 命名規則 `docs/README_naming.md`
- README（日本語 `README.md` / 英語 `README.en.md`）
- ヘッダー画像・使い方フロー図（`assets/`）
- MIT ライセンス

[0.1.0]: https://github.com/ishizakahiroshi/ai-audit-prompts/releases/tag/v0.1.0
