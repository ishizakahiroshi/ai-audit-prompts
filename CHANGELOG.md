# Changelog

このプロジェクトの主な変更点を記録します。
書式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に従い、[セマンティックバージョニング](https://semver.org/lang/ja/) を採用します。

## [Unreleased]

## [1.1.0] - 2026-10-09

### Added

- 2026-10-09: 正典3本へ `HTML出力: あり / なし`（省略時あり）と `点数評価: 要求時 / あり / なし`（省略時要求時）を追加し、prompt版を `2026-10-09` へ更新した。Markdownを事実・評価の正本として保持し、HTMLへ同じsnapshotと算出済み点数を表示する。採点なし・未評価・暫定・算定不能、保存不可・同名回避を共通契約で定め、serverの完全read-onlyと資料突合の非変更を維持した。
- 共通契約 `docs/README_html-report.md`、オフラインで読める `templates/audit-report.html`、全て合成の `examples/audit-report.example.html` を追加した。候補判定の円グラフ、重大度／impact別内訳、評価バー、判断カード・図・証拠を表示し、個別選択を保つ推奨一括、run／ファイル別の下書き保存、コピー・Markdown保存・印刷・回答消去を備える。選択は承認・修正・送信を実行しない。新しいアプリ・生成CLI・build・必須の個人用skillは追加していない。

- 既存のv1.0.0紹介動画（23秒）への日英READMEリンクと、作品紹介のカバー画像・動画情報を掲載した。動画はv1.0.0の紹介として保持する。

### Changed

- pre-commitにdoxguard prereleaseのopt-in検査を追加した。ローカル設定で有効な場合だけ実行し、候補binaryまたはconfigが無い場合はcommitを止める。既存secrets-scanも継続する。

### Fixed

- secrets-scanのGitファイル一覧をNUL区切りで取得し、日本語・空白・引用符を含むファイル名も検査できるようにした。

[Unreleased]: https://github.com/ishizakahiroshi/ai-audit-prompts/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/ishizakahiroshi/ai-audit-prompts/compare/v1.0.0...v1.1.0

## [1.0.0] - 2026-09-30

### Added

- 実行製品・modelに依存しない対象別正典 `docs/audit_app.md`、`docs/audit_server.md`、`docs/audit_doc_vs_impl.md` を追加。保守対象のpaste-ready promptを3本へ統合した
- app正典にDB区分 `自動 / あり / なし` と、Web/API、AI/agent/MCP/RAG、platform、CI/CD・供給網、cloud/IaC等を実装証拠から複数選択するsecurity profileを追加
- app正典のcoreへ、repo内のAI coding agent / IDE設定（instruction file、hook、MCP server定義、permission / auto-approve設定、folder open時に走るeditor task、skill定義、editor拡張の推奨）をAI profileの選択に関係なく監査するsurfaceを追加した。自動実行経路、権限緩和、隠しUnicode / HTMLコメント命令、agent設定によるAPI endpoint / proxy / telemetry先の上書き、project scopeのMCP serverを無確認で一括有効化するflag、repoが持ち込むgit hook等のconfig駆動command、version未固定のnpx / uvx起動、inline script、出所を検証できないremote endpoint、tracked / history上のsecretやAI session artifactの混入を判定し、これらの設定・workflow・loader fileを侵害痕跡（IoC）のcandidateとしても評価する。secret検索はgit history全体（全branch / tag / stash / reflog / unreachable object）を対象にし、過去commitで削除済みの秘密も漏えい済み・rotation要として扱う。推奨extensionはpublisher・配布marketplace・所有者移転を照合する配布経路として扱う。CI/CD profileには、issue / PR本文を入力にAI agent / CLIを実行するjobのauto-approve / permission bypass flag、tool allowlistの実効性、write権限、OIDC / cloud credential fileの残置を別candidateとして追加した
- app正典のCI/CD / supply chain profileへ、package managerのinstall-time policy（dependency lifecycle scriptのblock / allowlist（npm系に限らずPython sdist / .pth、Rust build.rs / proc-macro、Ruby native extension等のinstall / build / import時の自動実行経路を含む）、git / tarball依存の許可、minimum release age等の新版cooldownとdependency update botのcooldown・auto-merge条件による実効cooldown）、fork由来PRが書き込めるcache keyとrelease / publish jobの復元境界、publish jobでのOIDC token / credentialと任意code実行stepの同居、runnerからの外向き通信（egress）制御とpublish jobでの無制限egress、secretの流出先（sink）としてのCI log・artifact・cache、scanner / test gateの抑止設定（ignore file、inline抑止、閾値、continue-on-error）の棚卸し、Dockerfile / compose等のcontainer image定義、trusted publishing（OIDC）か長期tokenかの区別、immutable releaseとconsumer側のsignature / attestation検証、SBOMの最小要素相当field（hash、license、生成tool、生成context）とVEX / CSAF抑止のjustification突合、AI生成由来package名（slopsquatting）のregistry初回公開日・publisher照合、lockfileで直近版が上がった既存dependencyのpublish日時・publisher・公開経路（trust downgrade）・version jump照合、registry設定とlockfile resolved host / integrity hashの照合、agent skill / plugin / marketplace由来物を供給網入口として扱う検査を追加した
- `静的 / 安全なローカル検証 / build含む` の検証モードを追加し、安全なtest内compileとinstall/release/publish/deploy等の副作用を区別した
- lead / candidate / finding、7項目のevidence contract、候補検証率、独立検証、未調査領域、coverage、residual riskを3正典へ統一した
- security baselineの名称、版、URL、確認日、確認状態と、AI executionのprovider、exact model、display、reasoning、source等をplan/reportへ追記する契約を追加した
- `docs/` をOpen Knowledge Format (OKF) v0.2 Knowledge Bundleとして整備し、`docs/index.md` からrouting、正典、invariantsへ段階的に辿れるようにした。`docs/` 直下の公開Markdownは正典3本、移行用alias 14本、運用文書5本の計22本
- server正典へ、状態を変えない照会だけで次を追加した: 公開TLS証明書の有効期間schedule（CA/B Forum SC-081v3、2026-03-15以降は最大200日）と自動更新の点検、Secure Boot証明書の失効更新世代の適用状況（mokutil --db / --kek で2023 CAのSubject / Not Afterだけを照合し、shim署名世代はsbverify --listのissuer CNで読む。2011証明書の期限切れ自体はfindingにせず、db / KEK更新はfirmware / hypervisor / cloud platformの別管理面として扱う）、OpenSSH 10系のhybrid PQ KEXとOpenSSL 3.5系のTLS group、systemd-analyze securityとunit sandboxing、kernel lockdown実効値、自動update機構の有効状態・失敗履歴、hostへ露出したAI runtime / vector DB / MCP server / agent gatewayと常駐agent processの実行権限、self-hosted runner登録痕跡、backupのoffline / immutable / restore痕跡。診断対象host自身（loopbackまたはinterfaceに載る自host保有address）とlink-local metadata endpointへの単発・無認証の照会（TLS handshake、token無しGET）だけを外部への能動requestと区別した。kubectlとDNS照会はこの例外に含めない。kubectl getはkubeconfigのserver欄でAPI serverが自host上にあると確認できる場合だけ使い、送信domainのSPF / DKIM / DMARCは対象serverから照会しない
- doc-vs-impl正典へ、正典未指定時の現行正典候補の探索（spec駆動成果物、ADR、CHANGELOG / release notes、agent instruction file。進行中のchange / proposalとllms.txt等の自動生成派生文書は非正典）、機械可読contract（OpenAPI等）のroute追加、資料の生成元（人間 / AI・bot PR / 自動生成）とreview痕跡の記録、現行画面として掲載された画像の実screenshot / mock / AI生成分類、incompleteness（記載不足）とincorrectness（矛盾）の区別、既存test/fixtureをevidenceに使う反証を追加した
- 3正典へregulatory context（未検証）の扱いを追加した。法令・規格は、利用者の明示要求または対象・資料の適合主張があるときだけ名称・版/施行日・適用状態・URL・確認日を記録し、それ以外では該当性・適合可否・severityを判定せず、資料にない一般checklistとして持ち込まない。国内product向けにJVN / JPCERT/CCを一次advisory sourceへ追記した
- 監査運用へ、監査対象revision（commit SHA / working tree差分の有無。app正典とdoc-vs-impl正典）と実行mode / sandboxの記録、却下側にもevidenceを要求する対称なevidence contract、verifierへの引き渡し内容の最小化（結論文・評価語を渡さない）、threat model / SECURITY.mdによるscope内外の区別、失敗した検証と放棄candidateの件数付き列挙、再監査時のfinding単位の新規 / 継続 / 解消 / 再出現表示を追加した
- `audit_app.md` へ「監査後のtriage契約（監査を受け取った側）」を追加した。採用基準3点（実運用で到達するか、日常利用・公開物へ影響するか、設計の後退を生まないか）、提案を対象実装から導き直すこと、見送り台帳との突合、別scope項目とcritical / high相当の判断待ちのpending起票、採否の正本を1つのmdに固定することを定めた。server正典とdoc-vs-impl正典からも同節を参照する。同節と修正フェーズ節の例は、作者project固有の実績・finding ID・測定値を除いた一般的な例にした
- `audit_app.md` へ「修正フェーズの契約（監査を受け取った側）」を追加した。修正へ進むと決めたら最初のcode変更より前に実行mdを作ることを例外なしで必須とし、実行mdの表に持たせる列（タスクID / finding ID / 重大度 / 実施時期 / 担当 / 状態）、着手前に確定findingとcritical / high相当の判断待ちの全件の掲載を機械確認すること、進捗をreportへ書かず実行mdへ集約すること、完了・見送りが確定したときにreportの当該finding行の対応状況 / 検証状態とタスクIDだけを更新すること（監査plan mdへは戻さない）を定めた。実行mdの形式・metadata・保存先は受け手の運用に任せ、plan / bugfix / issue trackerのいずれでもよい。server正典とdoc-vs-impl正典からも同節を参照する
- 未修正の脆弱性の再現手順が公開treeへ出ないよう、report公開の規則を追加した。app正典と `README_invariants.md` では実行前確認で対象repoの公開状態（判定できなければ公開扱い。承認前の照会は `git remote -v` と保存先folderの有無・tracked有無に限り、hosting serviceへは照会しない）を示し、public、public mirrorへ同期される、または公開状態が不明な場合はGit管理をtrackへ倒さずignoreを提案する。trackは公開される内容を提示して明示承認を得た場合だけとし、その場合も未修正のcritical / highは実行経路・入力例・PoCを伏せた要約にして詳細をprivate repo等へ分離する。report冒頭には「取扱い: 非公開 / 公開可」を記録し、doc-vs-impl正典にも同じ記録とignore提案を加えた。第三者projectへ報告する条件には、報告先の受付policyを先に読むこと、人間が対象revisionで再現した確定findingだけを送ること、PoCは非公開経路で渡し公開はpatch後または報告先のCVD期限後とすることを加えた
- `README_activation.md` に「起動側の前提」節を追加し、推奨実行環境（対象の読取専用化、書込先をplan / report・一時directory・Git管理 = ignore時の `.git/info/exclude`・修正scopeの対象working treeへ限定、network egressのallowlist、credential directoryの非mount（server診断では鍵本体をssh-agent経由で渡し、接続に指定した鍵の公開鍵だけは読取専用で渡す）、sandbox等の有効化）と、管理下でない対象repoのagent / IDE設定を読み込まない起動を定めた。3正典の実行前確認へ、実際の実行modeと推奨環境との差分を提示項目として加えた。あわせて3正典へ、侵害痕跡・active exploitation・個人data / credential漏えいの決定的証拠を確定した場合の即時escalationを追加した。報告終端を待たずに画面へ出し、期限付きの通知・報告義務の該当判断と初動をownerが直ちに行う旨を判断待ちの先頭へ1行置く。規制名は挙げず該当性も判定せず、監査側は封じ込めや変更を行わない
- 3正典のpaste-ready本文の先頭に `prompt版: 2026-09-29` を置き、使用promptとprompt版を実行前確認で提示し、report冒頭のmetadataにも記録するようにした。本文を変更するときはこの日付とCHANGELOGのentryを同じ変更で更新する（`README_naming.md`）。server reportには診断対象revision（観測時間帯、uptime、kernel version、package index / DBの最終更新時刻）を加えた
- app正典のcore観点とWeb/API profileへ次を追加した: 第三者integrationへtokenを発行するprovider側OAuth（scope、consent、refresh tokenのrotation、integration単位のrevocation、audit log）と第三者から預かったtoken / API keyのcredential store扱い、NIST SP 800-63B-4のpassword verifier要件、session cookie / refresh tokenの盗難後再利用耐性、WebAuthnのUV flag検査・conditional create・attestation policy・signal API、OAuth device authorization grant（RFC 8628）、ORM filter object / operator注入・blind SSTI・parser differential、security header / CORS / cookieで読むべき値、外部配信assetのSRIと第三者script / CDN供給網、client IPの導出経路とlimiter store、file uploadの受信・保存・配信・処理、email / SMS送信経路（header注入、SMS pumping、OTP / reset token）、proxy〜origin間のrequest desyncとHTTP/2 stream reset DoS、localhost / LAN向けHTTP serverのbind addressとHost header（DNS rebinding）、i18n / 翻訳resourceの信頼境界、BaaS直結構成のview / function / storage / realtimeの認可、対象自身のvulnerability handling / lifecycle（受付窓口、CVD、advisory公開、update配布、support期間）
- app正典のAI profileへ次を追加した: model出力の描画・配信・能動fetchというsink（OWASP GenAI LLM Top 10 2026のLLM10 Improper Output Handling相当）、画像 / 音声 / screenshot等のmultimodal入力を経由するprompt injection、MCP specification 2026-07-28のSecurity Best Practicesの新項目とMRTRのrequestState検証、MCP tool annotations / x-mcp-header / MCP Apps UI extension、承認者へ見せる表示内容の完全性（OWASP Agentic ASI09）、memory / long-term stateの書込経路・分離・TTL・検証、training / fine-tuning / embedding datasetとadapterのprovenanceとfeedback loop、hosted model APIをlifecycleを持つdependencyとして扱いproviderへの送信をsinkとして読むこと、browser / computer-use agent固有の観点（認証済みsession操作、閲覧content由来の命令）、A2A Protocolのagent間通信の認可。System Prompt Leakageの項目をLLM Top 10 2026のHidden Context Exposureへ対応付け直した
- app正典の依存関係観点とbaselineへ、manifest / lock外のvendored library（同梱minified JS等）の版同定とadvisory照合、runtime / framework majorのEOL判定と一次source（Node.js / Python / PHP）、package managerのinstall-time policy既定の一覧（npm 12、pnpm 11以降、Yarn Berry 4.14.0以降、Bun、uv、Cargo）を追加した。upstreamが保守終了を宣言したcomponentの判定例として、Kubernetes ingress-nginx controllerのretirementをapp / server両正典へ加えた
- app正典の既知guardを「既知false-confirm / false-reject guard」へ広げた。確定側には、非本番codeと対象revisionで既修正の類型（非本番codeだけにある問題は却下とし、残す価値があればresidual riskとして記録する）、有効なprovenance / attestationは無害性の証拠ではないこと、scan stepの成功は防御ではないことを加え、却下側には既存防御のfile / lineだけで却下せず別入口・別interfaceでの迂回を検討する条件を加えた（server正典の却下根拠にも同旨を追加）。app / server正典へ重大度4段階・確信度3段階の境界定義を、doc-vs-impl正典の確定差異へ利用者impactと確信度を加え、3正典へplan / reportの記述言語と状態語の表記固定を加えた。app正典ではreport契約の語彙（対応状況、検証状態、1系列、document-only、budget）を本文で定義した
- server正典へ診断観点18 web server / reverse proxyを追加した（設定のread-only dump、default vhost・alias・proxy header信頼・security header、document root配下の配信対象の列挙、webrootの書込可否とruntime設定）。diagnostic profileへmail（MTA / MDA / submission）を、観点8へopen relay・submission認証の点検を加えた。送信domainのSPF / DKIM / DMARC等は対象serverから照会せず、監査者側で別途確認するか未調査として記録する
- server正典の観点へ次を追加した: 全userのauthorized_keysと侵害後の永続化箇所の棚卸し、distro package管理外のruntime / toolchainと第三者repo由来packageのupstream EOL照合、hold / versionlock / 適用履歴と放置期間の照会、sudo・su・pkexec等の特権境界binaryの版とdistro / upstream advisoryの照合、sudo実装（sudo-rs / 原sudo）の識別とsudo-rsが対応しない機能に依存したsudoersの扱い、OpenSSHのfinite-field DH残存とPerSourcePenalties、distro維持のlibsslをdistro lifecycleで判定すること、container published portとhost firewall（ufw / firewalld）の突合、非loopbackのDNS resolverのrecursion・接続元制限（open resolver）とDNSSEC validation、systemd unitのEnvironment= / EnvironmentFile=やcommandline引数に置かれた平文secret（key名だけを記録し、systemd credentials / secret managerへの移行を提言）、cloud-init user-data / vendor-dataの秘密pattern件数、DCVのchallenge応答の自動化、最低限記録するkernel attack surface系sysctl、time sourceの認証状態（NTS）
- doc-vs-impl正典へ次を追加した: 実装側の比較基準refを選ぶ引数「実装基準」（HEAD / release tag / deploy済みrevision。省略時HEAD）と基準refの読取・HEADとの差の記録、repo外file資料のembedded metadata（PDF Info / XMP、OOXML docProps）の読取とhidden slide・speaker notes・comment・tracked changes等の非提示要素の点検、動画 / 音声資料（transcriptとframeの別source扱い、timestamp location、未確認時間範囲の列挙）、実装から生成された資料・contractの生成revision記録と生成由来の一致を独立evidenceにしないこと、適用scopeと実装routeのlocale / region / timezoneとi18n / l10n resource（言語版間の差はinternal inconsistency候補）、UI claimの確認条件（環境・role・locale・theme・viewport・feature flag・data状態）の記録とcommit済みvisual regression baselineを時点付きevidenceとして使う条件

### Changed

- appの既定scope「調査まで」でも、sourceを変更せずに検証モードの範囲の検証command（既存test / lint / typecheck / dependency scanと、一時directoryへだけ出力する再現script）を実行するよう既定挙動を変更した。検証commandを一切実行しないのは検証モード「静的」と実行capabilityが無い場合だけとし、commandをread-only command / 静的scanner / 検証commandの3分類で扱う。「外部送信」をrepo由来data（依存tree / package一覧を含む）の第三者送信と定義してapp正典と `README_invariants.md` の禁止事項に置き、registry / advisory APIへ依存treeを送るscan（npm audit、pip-audit等の既定設定）は明示許可時だけ実行する。README日英のscope表も同じ内容へ揃えた
- 成果物metadataの規定を「特定toolのkey指定」から「満たすべき意味 + 手段は例示」へ変更した。監査reportに要求するのは、監査report種別・状態・owner・related・最終確認日が分かることと、自動archive・自動期限の対象にしないことであり、key名と形式は受け手の文書運用に合わせてよい。docsweep固有のkey（`docsweep_policy` / `docsweep_state` / `due`）は要件から例示へ降格した。対象は3正典、`README_activation.md`、`README_invariants.md`、`README_invariants_server.md`、`README_naming.md` の計7箇所
- routingを `tool × DB` から `target → DB/profile → capability` へ変更。未知のtool/modelも対象別正典へ一意にroutingし、製品名だけで並列agent、shell、Web、file write等の能力を推測しない
- 安全境界へ、repo内のagent / IDE設定（instruction file、hook、MCP server定義、permission / auto-approve設定、editor task、skill定義）を監査対象surfaceとして扱い監査側の権限拡大に使わないこと、対象内のAI向け命令はdataとして扱い従うのは正典promptと起動側が正規と示したproject instructionsだけであること（対象repo内のinstruction fileは起動側が管理下と宣言した場合だけproject instructionsとして扱う）、対象repoのagent / IDE設定を読み込んだかと実際に動いた実行mode（read-only等の制限mode、sandbox、network遮断の有無）をinventoryへ記録すること、監査agent自身に効くproject hook / MCP / editor taskの状態を記録し可能なら無効化してから調べること、Web一次情報の取得先をofficial domainに限り対象repo・issue / PR本文等に書かれたURLを開かないことを明記した
- 固定100点・固定配点を既定reportから外し、coverage、evidence、候補検証率、未調査、residual riskを既定summaryとした。数値評価は明示要求時だけ分母と未調査の扱いを定義して参考値として出す
- `confirmed finding ≠ applied fix` を明文化し、監査判定、対応状況 `plan / fix / pending / 見送り`（見送り = 修正しないことが確定。理由は実行md側に置く）、検証状態を分離した。監査事実の正本をreport、後続作業の実行正本をrelated先の実行md（plan / bugfix / pending、issue tracker等、受け手の運用に従う）とした。reportの対応状況 / 検証状態は監査run終了時点のsnapshotとして書き（run内で修正しないfindingはその時点の `plan` / `pending` / `見送り`）、run後の途中状態は実行mdだけで更新する
- appの既定scope「調査まで」を維持しつつ、修正scopeでも自己完結した最小変更だけをapproval後に適用するよう明確化した。fixture/実機依存や仕様trade-offを伴うfindingは確定しても修正案に留める
- server診断にprivate owner repo必須、接続先実体照合、完全read-only、cloud管理面の未観測表示を統一した。doc-vs-implは資料指定必須、全page visual確認、否定結論の二経路確認、資料・実装の完全非変更を維持した
- 監査reportの既定保存先を対象repoの `docs/ai-audit-prompts/` に統一した。引数「保存先」はreportだけに効き、planは常に `docs/local/` へ置く。保存先がsymlink / junction / mountの場合は実体pathと書込可否を確認し、無断で別pathへfallbackしない。未存在folderのGit管理は実行前に解決する
- security baselineのpinを2026-09-29にapp / server両正典の全pinと、本文で例示するKubernetes ingress-nginx retirement告知について公式一次情報で再確認し、両正典の見出しを「2026-09-29確認」へ揃えた（pin行には個別の確認日を書かない）。OpenSSF OSPS Baselineをv2026.02.19からv2026.08.28へ更新し、OAuth 2.1とNIST SSDF 1.2のdraft注記を2026-09-29時点へ更新、CISA KEVにJSON feed URLと転記項目（catalogVersion / dateReleased、該当entryのdateAdded / dueDate / knownRansomwareCampaignUse / forensicTriage）を併記した。OWASP ASVS / API Security Top 10のURLをsite移行後の `/projects/<slug>` へ差し替え、OWASP Top 10はhttps://top10.owasp.org/2025/ へ更新した。app側にMCP specification（revision 2026-07-28）とSecurity Best Practices、CISA 2026 Minimum Elements for SBOM、OWASP AI Testing Guide v1.0、OWASP HTTP Security Response Headers / Content Security Policy Cheat Sheet、NIST SP 800-218A、RFC 9700 / RFC 10017、WebAuthn Level 3（W3C Recommendation 2026-08-25）、A2A Protocol Specification v1.0、OWASP Non-Human Identities Top 10 2025、NIST AI 100-2 E2025、W3C Trusted Types（Working Draft）、OpenSSF Model Signing specification v1.0（stableと表記しない）、CA/B Forum SC-081v3、runtime lifecycleの一次sourceを追加し、OWASP GenAI LLM Top 10 2026へ版表記とhub pageの2025表示に関する注記を加えた。draftはdraftのまま残す
- app / server両正典のpinへCISA BOD 26-04（2026-06-10発行、BOD 19-02 / 22-01を置換。米連邦機関向けで民間には参考入力）、RFC 10024（TLS 1.3のhybrid PQ/T key agreement、Proposed Standard）、NIST IR 8547（initial public draft）、CISA / ASD's ACSC他のCareful Adoption of Agentic AI Servicesを揃えた。server側にはCA/B Forum SC-081v3、Microsoft Secure Boot証明書更新、OpenSSH / OpenSSL release情報、NIST IR 8374r1、CIS Benchmarks、SSVC、OWASP Top 10 for Agentic Applications 2026に加え、distro lifecycle（Debian / Ubuntu / Amazon Linux / RHEL等のofficial pageと支援終了日。Debian 12のLTS移行日はdebian.orgのreleases表とNewsを採る）、Chrome Root Program Policy v1.8とLet's EncryptのclientAuth EKU終了、GmailとOutlook.comの送信者要件を置いた。OpenSSL pinを3.0支援終了後の状態（3.0 / 1.1.1 / 1.0.2は終了、3.4 / 3.6の終了日、現行LTS 3.5、4.0）へ、OpenSSH pinを9.8〜10.5の変化と最新10.5へ、SC-081v3 pinをvalidation data reuseの短縮scheduleへ、SSVC pinを使ったdecision modelの記録とBOD 26-04 Response Modelへ、Secure Boot pinを失効日と後継CAへ更新した。OWASP NHI Top 10とGmail送信者ガイドラインは転送先のURL（`/projects/` 形式、support.google.com/mail）で載せ、CISA SSVC解説pageのURLを転送先へ差し替えた
- 脆弱性情報の扱いを更新した。app正典・正本では一次・二次を取得経路ではなくrecordの発行者で決め、一次（vendor / project advisory・release notes、maintainer発行またはreviewed済みGHSA、ecosystem公式のvulnerability DB、CVE recordのCNA / CISA ADP container、distro security tracker、JVNのvendor statementとJPCERT/CC注意喚起。OSV.dev等を経由して得たrecordも発行者がこれらなら一次）と二次（NVD、unreviewed GHSA、NVD等からの変換record、JVN iPedia、EUVD、scanner自身の判定）に分け、識別子の別名集合（CVE / GHSA / ecosystem native ID / distro ID / JVN等）で重複を1件に統合する。両正典で、CVSS（版・vector・算出者）、EPSS（score・percentile・model版・取得日）、CISA KEV（catalogVersion・dateAdded・knownRansomwareCampaignUse・forensicTriage等）、SSVC系の決定点（どの決定木の値かを名指しする）を出典付き入力として記録し、単独で重大度・確定・却下の根拠にしない。reachabilityは粒度、判定手段、状態（reachable / no path found / unknown）で記録する
- KEVのdueDateは2026-06-10以降BOD 26-04の期限表でCISAが米連邦機関向けに算出する値で所有者の期限ではないこと、server診断でforensicTriage=Yesの該当serviceが公開面にある場合は観点9で侵害痕跡の確認状態を明記することを定めた。active exploitationの出典へENISA EU KEV Catalogueとvendor advisoryのexploitation記述を加え、KEV非掲載・NVD未enrichment・upstream advisory不在・scannerの「該当なし」を安全根拠にしない。NVDのenrichment優先化（2026-04-15以降）を処理状態として扱い、dependency scanのtool・版・advisory data source・照合方式・DB更新日を記録し、NVD-CPE照合だけに依存するtoolの「検出なし」はnative sourceで再照合するまでunknownとする。Web一次情報が無い場合、advisory・KEV・EPSS・registry由来の判定は「未確認（Web不可）」とし、modelの記憶にあるCVE ID・版はleadに留める
- app正典のcore観点とprofileを2026-09-01時点のトレンドへ更新した: OAuth（全clientへのPKCE強制、redirect_uri exact match、implicit / ROPC不使用、sender-constrained token（DPoP / mTLS）、browser appのtoken保管とBFF）、WebAuthn / passkeyのRP ID / origin / challenge検証・backup flag・related origins最小化、暗号inventory / crypto agilityとhybrid PQC key shareの除外有無、client bundleへ焼かれる公開向け変数の分類、CSPのnonce / hash + strict-dynamic評価とTrusted Types、CSRFのFetch Metadata / Origin検証、frameworkが自動公開するserver function / RPC endpointの認可、MCP client / serverのspec準拠、model / checkpoint等のartifact供給網、LLM telemetryのsink化、agent間通信のAgent Card検証、cloudのworkload identity / OIDC trust policy subject、client直結DB / BaaSのrow level security列挙、Rust 2024 unsafe extern内safe fnの照合、testの品質（assertの有無、skip / only、本体を呼ばないmock、placeholder）、agentが自分の設定 / hook / 権限を書き換える経路とcommand allowlistの引数全体評価、local agent gateway / control UIのlocalhost bind依存、Kubernetesのimage digest pin / 署名検証policyの実効性、新しいpackage / version / actionを推奨する際のregistry一次情報の確認、修正後に確定時の再現test・scanner queryを同条件で再実行する検証
- 引数「除外」を、finding対象・変更・検証から除く意味へ変更した。実行経路を完結させるためのread-only参照は許し、経路が除外pathを経由するfindingにはその旨を記録して、除外を到達不能・却下の根拠にしない。読取りも禁じたい場合は除外値に「（読取り禁止）」を添える。引数「Git管理」のignore / trackを定義し、ignoreはowner repositoryの `.git/info/exclude` への保存先path追記（`.gitignore` への反映は人間が行う）、trackは何もせずuntrackedのまま残すこととした
- 実行前確認で無回答・非対話実行・曖昧な承認となった場合は自己承認せず、確認文と未実行であることだけを出して終了する規則をapp / doc-vs-impl正典と `README_invariants.md` へ加えた。server正典・正本へは、承認後は報告完了まで進み判断待ちを記録して次へ進む規則と、別host / 別key・追加権限・scope拡大を無断で行わない例外を加え、3 familyで揃えた
- 独立検証を「あり（別context・別model familyまたは別provider）/ 一部（別context・同model family）/ なし（同context self-critiqueまたは二巡目）」の3段階で表記し、report冒頭にlead / verifierのexact model IDを記録するようにした。verifierは渡された証拠の確認だけで終えず、自力で経路・防御を読む。完了rubricは項目ごとの充足状態と根拠の所在（report内の節名 / 台帳行ID / command出力）を表にして照合し、最終報告にrubric照合結果を含める
- `README_invariants.md` をapp正典に揃えた。完了rubricを同じ14項目・同じ順序にし、report冒頭の項目（監査実行状態、検証モードと実行隔離、使用prompt / prompt版、取扱い、残leadの件数）と観点引数の値域（profile名を含む）を一致させ、対象全体へ到達できない場合は監査実行状態を失敗・結果状態を算定不能、一部のpathに到達できない場合は部分完了と暫定とした。判断待ちfindingには欠落項目・必要capability・行き先を記録し、非決定性は探索run数・sampling設定の記録と、決定論的scannerの出力を列挙の基礎にする形で扱う。正典と正本で同じ概念に別語を使っていた箇所（critical route、unverifiable、適用後確認等）を統一した
- 成果物命名のplan / report placeholderを `<topic>` = `<target>_<slug>` に統一し（例: `app_src-api`、`server_<接続先の別名>`、`doc_vs_impl_<資料file名のslug>`）、既存fileは上書きせず `_2`、`_3` の連番を付けて前回reportをrelatedへ載せるようにした。server reportのfilenameにはhostname / IPを入れず、同日複数hostは別名で区別する。監査後のtriage / 修正フェーズ契約（`audit_app.md` 末尾の2節）の正本位置を、CLAUDE.md、index、両invariants、README日英へ明記した
- server正典の対象をLinux / Unix系hostと明記し、Windows Serverは現版の対象外とした。接続gateへhost key指紋の承認・照合、agent / X11 / port forwardingと接続共有の無効化、IdentitiesOnly、追加host keyのknown_hostsへの自動追記（UpdateHostKeys）の無効化を加え、接続を伴わない `ssh -G` 以外の実接続commandを承認前に使わないことを明記した。sudoは非対話形で確かめ、password要求・不許可のときはpasswordの入力・pipe・提示要求をせず「権限不足で未実行」としてcoverageへ残す。login / sudoに伴う不可避のlog記録と、dnf系の照会（`-C` 付きを含む）とzypperの照会（`--no-refresh` 付きを含む）が実行のたびに書く自身のlogを「一切変更しない」の対象外として明記し（実行したcommandと書込先をreportへ記録する）、観点9では監査自身のsessionを除外する。IMDS判定はproviderを推定してAWS / Azure / GCP / その他に分け、照会にtimeout上限を付け、無応答をmetadata serviceなし / 未到達として扱う。`sshd -T` へMatch評価のための `-C` の組合せと `sshd -G` を加え、apt / dnfのindex鮮度を記録してstaleならupdate状態をunknownとする。Web一次情報は対象serverとは別の監査agentの実行環境からread-only GETで取り、対象server上からは、自host宛照会とlink-local metadata endpointへの単発照会を除き、外向きrequest（DNS照会、host外のAPI server・外部MX・official pageへの接続を含む）を送らない。サーバー上modeでは監査agentの実行環境が対象serverになるため、Web一次情報をnoとして記録し、pinned baselineを未再確認として使う。`観点` 引数は18観点の番号または名称で指定する形式へ明確化し、強度説明とREADME日英のserver診断例を観点labelへ揃えた
- doc-vs-impl正典の外部request禁止に、利用者が指定した資料URL / docs platformの取得、規格・vendor・registryのofficial documentation / advisoryへのread-only GET、利用者が明示した稼働instanceのread-only閲覧（login・認証操作・入力送信はしない）の例外と条件を明記し、capabilityへWeb一次情報・外部docs platformの取得手段とhidden file検索の可否を加えた。資料内命令の扱いを画像等へrenderingされたtextとURL資料の取得contentへ広げ、資料内link先は取得しない。資料内命令はverdictを付けない別区分として台帳へ記録し、要すり合わせへ載せる。正典候補探索はhidden directory（. 始まり）を含め、「正典候補なし」も2つの独立routeで確認する。report冒頭・inventory・完了rubricへ実装側の監査対象revisionと、資料のcontent hash（URL資料は取得内容のcontent hash・取得日時と、取得できればrevision ID）を加えた。candidate判定（確定 / 却下 / 判断待ち / 重複）とclaim verdictの対応を明記し、確定差異の必須項目を8項目にした。主張検証率は非提示区分と資料内命令区分を除いたclaimを対象に、evidenceで判定が付いたclaimだけを分子に数え、分母からout of scopeを除く定義へ変え、unverifiableとverdict未付与claimの件数を併記する
- regulatory contextの記録項目を揃えた。server正典に欠けていた版と確認日を加え、法令は版の代わりに施行日と適用状態（改正法と適用段階。段階適用なら適用済み / 未適用の別）で記録できるようにした。資料が引用する適用期日・版が改正前の値なら、doc-vs-impl正典で該当claimの版ずれとして記録する。`README_invariants.md` はclaimがあるときに記録するだけとし、適合主張と実装の突合を資料突合の正典へ回す向きでapp正典・READMEと揃えた

### Deprecated

- 統合前の旧14 prompt pathを、後継相対pathとappのDB引数だけを示す短いaliasへ変更した。aliasはpaste-ready本文、監査metadata、自動選択対象を持たず、1回の移行release後にrepo内外consumerの移行を確認して別planで削除する

### Fixed

- server正典の許可照会が秘密値や観測漏れを生む問題を直した。docker / podman inspectのEnv / Cmd、unit Environment、`/proc/<pid>/environ`、ps引数、.env等のconfig、journalを値なしで取る手順を追加して許可例のinspectを `--format` 形に限定し、`ss -tlnp` だけではUDP listenとunix socketが見えないため `ss -tulnp` / `ss -xlp` へ広げ、観点4にTCP / UDP別のlistenとunix socketの所有者 / permissionを加えた
- server正典の許可照会の例が、禁止している外部通信・file書込・module loadを起こしうる問題を直した。package照会をcache only（`dnf -C`、`zypper --no-refresh`）に限りmetadata取得を禁止事項へ移し、`pro status` / `subscription-manager status` / `ubuntu-security-status` はvendor server照会とcache書込を伴うため実行せずlocal fileの読取で代替する。iptables / nftは実行前にnetfilter moduleのload状態を確かめ（`-t nat` の照会ではiptable_nat / ip6table_natも）、ssも同じ理由（sock_diag経由のmodule自動load）でload状態を確かめて未loadなら `/proc/net` の読取で代替する。`nginx -T` / apachectlは、test modeでもlog / pid / 一時・cache pathの作成とworker userへのchown、停止中のlisten socketのbind、Debian系apache2ctlのrun / lock directory作成、設定読込時のhost名解決が起き得るため、条件を満たす場合だけ使い、満たせなければconf直読で代替し、設定dumpは秘密を含み得るdirectiveの値をmaskする抽出を通して読む。podmanは非rootの監査userで実行せず、rootful storageが既存の場合だけroot権限で照会する。DNS照会になり得る `hostname -f` を接続先実体照合から外し、`chronyc` は逆引きしない `-n` 付きにした。integrity照会・file走査・journal検証にはread I/Oを抑える条件（nice / ionice、-xdev、network mount除外、時間予算）を付け、file書込が起きうる `aide --check` / `--compare` を実行対象から外した
- server正典の接続gateで、統合時に落ちた非対話接続（BatchMode=yes）の指定を戻し、接続先引数をOpenSSHのdestination構文（`[user@]host` / Host alias / `ssh://[user@]host[:port]`）へ直した。承認前に作ってよいものをowner repo内のplan / report骨格に限り、サーバー上modeではowner repoのworking tree配下のplan / reportだけを完全read-onlyの書込例外とし、その例外を最上位契約・完了rubric 9・最終報告の除外条件にも明記することで、plan提示・実行phaseの順序やfile作成禁止、rubric 9の充足判定との矛盾を解消した
- 3正典統合時にapp正典の本文から落ちていた、0.6.0で名指しした観点（GraphQLのintrospection / depth / batching、inbound webhook署名・replay、総当り・account enumeration、HSTS、OAuth state）を再収録した。OWASP Top 10:2025のA08表記を公式名「Software or Data Integrity Failures」へ直し、A01〜A10に番号を付けた
- app正典・正本の一次advisoryにJPCERT/CC注意喚起、二次にEUVDが無くserver正典と食い違っていた点を揃えた。app正典がBOD 26-04をpinなしで名指しし、SSVC・CISA ADP・BOD 26-04の決定点を1つの括弧に混在させていた記述を、pinの追加と決定木ごとの記載に直した。run内remediation（phase 5）に修正前の全件確認が無く、修正フェーズ契約の「例外を設けない」と矛盾していた点を直した
- server正本と正典の同期漏れを解消した: 一次資料のCISA ADP container、確定条件の「file直読で実効値を断定しない」「roleで意図された公開portを公開そのものでfinding化しない」、観点16の復元可能性の判断待ち、一次 / 二次advisoryが食い違うときの扱い、report冒頭の監査実行状態、systemctlの許可照会（`list-*`）、7項目#7とrubric 8の語（適用後確認）、接続を伴わない `ssh -G`。server正本の接続gateが、どこにも定義されていない「承認後は止まらず進む」規則を例外として参照していた状態も解消した
- READMEがvisual inspectionを全正典の記録項目と説明していた記述を、資料突合の正典だけに限る記述へ直した。doc-vs-impl正典で全page visual inspectionに要る一時派生物（page画像、形式変換、screenshot等）の作成が許可外だった点を直し、置き場・plan / reportへの非埋め込み・終了時削除の条件を定めた

[1.0.0]: https://github.com/ishizakahiroshi/ai-audit-prompts/compare/v0.8.0...v1.0.0

## [0.8.0] - 2026-08-08

### Added

- 資料突合監査（`doc_vs_impl`）を第 3 系統として追加: `docs/claude_ultracode_audit_doc_vs_impl.md`。外部作成の資料（説明会資料・マニュアル・仕様書・顧客向け文書）の記載と現行実装の差異を完全 read-only で洗い出す（主張のページ番号付き抽出 → テーマ分割並列検証 → 否定結論の二経路裏取り → 差異全件の敵対的検証 → 重要度別報告）。PDF はテキスト抽出とページ画像目視の両輪で読解する。codex / claude_fable 版は未作成
- `docs/README_naming.md` に監査対象の第 3 系統 `doc_vs_impl` を追記、`docs/README_activation.md` に区分判定・自動選択ルール・引数（資料 / 対象 / 正典 / 強度 / 確認）を追記。README.md / README.en.md のディレクトリ構成・系統説明も追随

### Changed

- コード監査の結果報告 md を対応状況のハブとして整理。総合評価の直後に対応状況サマリ、優先順の対応一覧、対応 C の詳細を置き、`plan` / `fix` / `pending` の対応状況と検証状態を分離して追跡する形式を6本のコード監査 prompt と `docs/README_invariants.md` に反映
- finding ID に `[fix]` 等を付けず、監査判定・対応状況・検証状態・対応 C を表の列で管理。大きな C だけ子 plan へ分割し、audit 用 plan md は調査ログ、結果報告 md は対応状況の正本とする

[0.8.0]: https://github.com/ishizakahiroshi/ai-audit-prompts/compare/v0.7.0...v0.8.0

## [0.7.0] - 2026-07-12

### Added

- 全 9 プロンプト + 正本 2 ファイル（`docs/README_invariants.md` / `docs/README_invariants_server.md`）に「**結果報告 md の逐次ドラフト運用**」を不変条件として追加。途中でセッションが切れた場合に「plan md だけ残って結果報告 md は空」となる事故を防ぐための fail-safe。
  - 結果報告 md は最終フェーズで一気に書かず、**初期準備フェーズで plan md と同じディレクトリに空テンプレ（総合評価ヘッダー骨格 + セクション見出し）として先に作成**する
  - finding が確定するたび・各フェーズ終端（コード監査: 調査・敵対的検証・修正・検証・再調査 / サーバー診断: 診断・敵対的検証・提言）で結果報告 md にもスコア・finding 一覧・対処手順を反映する
  - plan md と結果報告 md で同じ内容を 2 箇所に書く重複は許容（途中停止に備えた冗長化が目的）
  - 最終フェーズで追記するのは rubric 採点結果と最終報告の総括のみ。本文は途中までで埋まっている状態にする
  - 各プロンプトの完了条件 rubric にも「結果報告 md が初期準備フェーズで空テンプレとして作成され、進捗に応じて逐次更新されている（最終フェーズでまとめて書かれていない）」を追加
- **実行前確認ゲート**を追加（`docs/README_invariants.md` を正本に、コード監査 6 プロンプト + `docs/README_activation.md` へ展開）。監査プロンプト読み込み後、調査・plan md 作成を含む一切の作業前に「使用プロンプト / 解決済み引数 / ソースを書き換えるかどうか」を要約提示してユーザーの承認を待つ。「止まらず走り切る」制約は承認後に適用
  - 新引数「確認: あり / なし（省略時はあり）」で制御。「確認: なし」指定時のみ省略して直ちに開始（非対話実行・CI 用）
  - ツール実行許可（permission）とは別レイヤーの会話ベースの合意形成のため、bypass permissions / YOLO モードでも機能する
  - 各プロンプトの完了条件 rubric にも「実行前確認で承認を得てから開始している」を追加

### Changed

- **コード監査の既定スコープを「フルループ」から「調査まで」に変更**（`docs/README_invariants.md` を正本に、コード監査 6 プロンプト + `docs/README_activation.md` へ展開）。「監査」の既定動作はソースを書き換えず、レポートと finding ごとの修正案の出力までとなる
  - 既定スコープ「調査まで」では、各確定 finding に適用可能な修正案（diff 形式または before/after コード）の提示を必須化
  - 修正まで行うのは、スコープ「調査・修正まで」「フルループ」を明示指定した場合のみ（従来どおりの動作は「スコープ: フルループ」指定で得られる）
  - README.md / README.en.md / CLAUDE.md の説明・引数例も追随（引数例のスコープを「フルループ」に変更し、修正をオプトインする書き方を提示）

[0.7.0]: https://github.com/ishizakahiroshi/ai-audit-prompts/compare/v0.6.0...v0.7.0

## [0.6.0] - 2026-06-17

### Added

- 現代スタックで欠けていた**セキュリティ観点**をコード監査 6 プロンプトへ名指し追加（スコア配点は変更せず、既存サブ項目内の列挙を拡充）
  - API 認可: オブジェクトレベル認可（IDOR / BOLA）・mass assignment（over-posting）
  - 認証トークン: JWT / OAuth / OIDC の不備（alg=none・署名検証欠如・弱い署名鍵・PKCE/state 欠如・redirect_uri 緩和・トークン失効/保管）
  - インジェクション拡張: SSTI・安全でないデシリアライズ（pickle / unserialize / YAML unsafe load）・XXE
  - JS/TS 特有: プロトタイプ汚染・ReDoS
  - 周辺: セキュリティヘッダ / CSP / HSTS・レート制限 / アカウント列挙 / 総当り耐性・GraphQL（introspection / 深さ・複雑度 / batching）・Webhook 署名・リプレイ検証・クラウドメタデータ SSRF（169.254.169.254 / IMDSv2）
  - アプリ側 LLM/AI 利用: プロンプトインジェクション・LLM 出力を信頼しての二次被害・LLM/外部 AI の API キー・tool/function calling 濫用
  - サプライチェーン能動的ベクタ（依存関係観点）: postinstall / ライフサイクルスクリプト・dependency confusion / typosquatting・lockfile 整合 / 依存ピン未固定
- サーバー診断 3 プロンプト + 正本（`docs/README_invariants_server.md`）へ、クラウドメタデータ（169.254.169.254 / IMDSv2 強制状況、観点 4）と secrets 管理基盤（Vault / SSM / sops 等の利用有無、観点 11）の点検を追加
- `docs/README_activation.md` に「対象外・誤適用に注意」節を追加（URL だけの外部サイトは対象外で能動スキャン=DAST は別物・許可必須、共用サーバーはサーバー診断の対象外、共用サーバー上の WordPress 等 CMS はコード監査 `*_audit_db_app.md` で扱う旨を明記）
- コード監査 6 プロンプト + 正本（`docs/README_invariants.md`）に「**finding ごとの対処ガイド**」を不変条件として追加。確定 finding ごとに〈問題の内容〉〈推奨する対処手段（修正方針・具体手順。AI 未適用分も設定差分/コマンド例まで）〉〈適用時の注意・適用後の確認〉を示し、結果報告に優先順の「**対処手順（実務）**」をまとめる。これらは適用判断・本番反映を人間が行う**推奨（アドバイス）**である旨を明記する運用に統一（完了条件 rubric にも 1 項目追加）。サーバー診断側に既存の「finding の出力形式（対策提言を含む）」とコード監査側の表現を揃えた

### Changed

- サーバー診断 3 ファイル + 正本（`docs/README_invariants_server.md` 観点 16「データ保護」）のバックアップ点検を、機構の**存在推定**から「**DB のバックアップが実際に取れているか**を read-only の範囲で推定」まで拡張
  - DB ダンプ系ジョブの痕跡（`mysqldump` / `pg_dump` / `pg_basebackup`・WAL アーカイブ・レプリカ・managed DB の自動スナップショット）の有無を確認
  - 最新の成立性を `systemctl list-timers` の last-run・バックアップ用ユニットの `journalctl` 直近成否・ダンプ出力先の最終更新時刻/サイズ/世代数（`find` / `ls` / `stat` 参照のみ、中身は開かず値も出さない）で推定
  - managed DB（RDS / Cloud SQL 等）の自動スナップショットはサーバー内から制御プレーンが見えないため判断待ちに回す
  - 復元可能性・オフサイト性・復元テスト成否は read-only では検証不可のため従来どおり情報提言（確信度 medium）として扱う

[0.6.0]: https://github.com/ishizakahiroshi/ai-audit-prompts/compare/v0.5.0...v0.6.0

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

[0.5.0]: https://github.com/ishizakahiroshi/ai-audit-prompts/compare/v0.4.0...v0.5.0

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

[0.4.0]: https://github.com/ishizakahiroshi/ai-audit-prompts/compare/v0.3.0...v0.4.0

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
