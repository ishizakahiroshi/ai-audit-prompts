# Changelog

このプロジェクトの主な変更点を記録します。
書式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に従い、[セマンティックバージョニング](https://semver.org/lang/ja/) を採用します。

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
