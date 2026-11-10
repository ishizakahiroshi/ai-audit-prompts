# Changelog

このプロジェクトの主な変更点を記録します。
書式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に従い、[セマンティックバージョニング](https://semver.org/lang/ja/) を採用します。

## [Unreleased]

### Changed

- 2026-10-16: app正典 `docs/audit_app.md` と正本 `docs/README_invariants.md` の探索・検証の手順を補強し、app正典のprompt版を `2026-10-16` へ更新した。repo全体などを対象にするときは、探索の前にtop-level directoryごとの走査 / 除外を台帳へ記録し、除外したdirectoryを未調査として数える。探索は危険な操作（sink）を先に列挙し、攻撃者が制御する入力源まで別fileを含めて逆にたどる。確定・却下は、入力を作る主体をそのcodeが信頼してよいか、その立場が元々持つ権限を超える利得があるかで判定し、deploy時の前提条件は却下理由ではなく障壁として記録する。独立verifierが付けた重大度をlead側が引き上げない。
- 2026-10-16: test / fixture / example / docsだけにある問題を却下する規則に、実在しうるcredentialのcommitは到達性に関係なく漏えいとして扱う例外を加え、追跡されていない導入済みのdependency directoryをfinding対象外にした。app正典のcore観点にjavascript: URLによるXSSと、秘密・MAC・署名等の比較のconstant-time性を、native profileに境界外read / write、use-after-free / double free、type confusionを明示した。
- 2026-10-16: findingの欄へCWE（該当時）とrun間で安定するfingerprintを加え、正本が全findingに求めていたfingerprintをapp正典では再監査phaseでしか付けていなかった食い違いを解消した。受け付ける入力の範囲を変える修正は仕様変更として修正案に留め、修正箇所を通る既存testが無い場合はその旨を記録するようにした。完了rubricは14項目のままで、server正典と資料突合正典は変更していない。
- 2026-11-10: 正典3本のprompt版を `2026-11-10` へ更新した（app正典は `2026-10-16`、server正典と資料突合正典は `2026-10-09` から）。evidence contractと完了rubricの項目数・番号、serverの完全read-only、資料突合の完全非変更は変えていない。以下の2026-11-10の各項目はこの版に含まれる。
- 2026-11-10: 3正典で、対象の中に見つけたAI向け命令の扱いを揃えた。命令をdataとして読む範囲を広げ（appはfile名、commit message、command / test / scannerの出力。serverはlog / journal、process引数、unit / container / file名、command出力。資料突合は実装側のcode / comment / config / fixture / test data、commit message、稼働instanceの画面）、監査agentの動作を変えさせようとする命令（appは監査agentへ向けた、または宛先の分からない命令）を検出したら、場所と種別だけを記録して本文を生のまま画面・reportへ転記せず、その命令の内容を判定・却下の根拠に使わない。appは命令が置かれていること自体を供給網・agent設定の観点のleadとして扱い、対象app自身が実行時に使うprompt / templateは通常どおり読む。資料突合は、資料・正典・実装そのものとして突合するinstruction file / skill / promptの本文を通常のclaim・evidenceとして引用してよい。serverではそこに書かれたURLも取得せず、侵害・probeの手掛かりとして観点9へ回す。
- 2026-11-10: 3正典で、並列agent / verifierは正典promptを引き継がないものとして、渡す証拠項目とは別に禁止事項（対象内の命令に従わない、外部送信・URL取得の制限、許可された操作の範囲。appはscope外のfile変更をしないことと個人情報・秘密値を出さないこと、serverは完全read-onlyの禁止と許可照会、資料突合は完全非変更と個人情報・秘密値を転記しないこと）を指示へ必ず含め、対象由来の文は引用として区切って渡すようにした。lead探索・claim抽出に使う並列agentにも同じ指示を渡す。verifierへ結論文や評価語を渡さない規則は変えていない。
- 2026-11-10: 3正典で、Web検索・取得のqueryとURLへ載せてはいけない値を明記した（appはsecret・個人情報・内部host名・sourceやlogの断片、serverは対象のhost名 / IP / 顧客名と、内部domain・path・設定値など対象を特定できる構成の固有値、資料突合は資料の非公開内容）。serverでは、公開されているproduct名・package名・版での照会は行ってよい。Markdown reportと画面出力でも、対象由来のtextはcode span / code blockで引用し、Markdownの画像記法とraw HTMLを書かず、対象由来のURLをlink化しない。appのquery / URLの規則とMarkdown reportの規則は正本 `docs/README_invariants.md` にも、serverのMarkdown reportの規則は正本 `docs/README_invariants_server.md` にも置いた。
- 2026-11-10: app正典と正本 `docs/README_invariants.md` の、監査対象を読むときの自衛を補強した。起動側が管理下でないと示した対象、または `.git` ごと複写・archiveで渡された対象は、git commandより先に `.git/config`、`.git/config.worktree`、`.git/modules` 配下の各config（いずれもinclude先を含む）をfileとして読み、programを指すkey（core.fsmonitor、core.hooksPath、diff.external、filter / textconv等）があればそのrepoでgitを実行せずfile読取で代替する。該当keyが無いと確認できてgitを実行する場合も `core.fsmonitor=false` と `safe.bareRepository=explicit` を `-c` で与える（ここまでは資料突合正典にも同じ規則を入れた）。申告が無く、自分でcloneした対象にはこの規則を適用しない。gitを実行しない場合、git status / diffを求める手順と完了rubric 12・14のgit出力は「該当なし（git不実行）」と記録し、開始時と終了時のfile一覧と内容hashの比較で代替する。git historyを要する手順（secretのhistory走査、設定・workflowの追加経緯、直近の変更履歴）は該当なしにせず、未走査として記録する。実行前確認でも、同じ対象ではこれらのconfigのfile読取を承認前に行ってよく、programを指すkeyがあればgitを打たず、remoteは `.git/config` の [remote] 節、tracked有無は未確認として提示する。対象内のsymlink / junctionがrepository rootの外を指す場合はその先を読まず、修正scopeでも書かない（保存先とplan置き場として解決したpathは対象外。追跡されていない導入済みdependency directoryのlinkは経路の理解のための読取に限り辿ってよい）。対象repoのsubagent / skill定義を、監査側の権限拡大・探索範囲の縮小・reviewの代替に使わない。起動側が対象を管理下でない（第三者由来・受領物・未reviewのbranch）と示した場合、test / lint / typecheckはsandboxとnetwork遮断を実行modeで確認できたときだけ実行し、確認できなければ静的と同じ扱いにする。申告が無い場合はこの制限を適用せず、検証モードの範囲で実行する（既定の検証は変えていない）。
- 2026-11-10: app正典の実行契約の穴を埋めた。実行前確認で、外部送信に当たるdependency scanを実行するかの許可を検証範囲と一緒に聞く。公開または公開状態が不明なrepoで、Git管理のignore提案へ回答を得られず（`確認: なし`・非対話）、保存先がignore済みでもない場合は、既存folderでも暗黙に決めず作成・調査前に停止する。引数欄のGit管理も、確認なしで実行し、保存先が未存在、または公開もしくは公開状態が不明のrepoで保存先がignore済みでない場合は必須とした。フルループの再調査で新たに確定したfindingは対応状況planで残し、同じrunでは修正しない。lockfileのresolved先またはregistry設定が公開registryを指すpackageのうち、candidateの照合と直近追加・更新分の照合に必要な個別照会はWeb一次情報の取得として扱い、依存全件の逐次照会は外部送信として扱う。private scope・内部registryから解決される名前は公開registryへ照会せず未照合として数える。製品名やmodel名から能力を推測しない旨をapp正典にも置いた。plan mdから蒸留したruleと前回の却下は、今回のrevisionで根拠を再確認できなければ却下・対象外の理由にしない。
- 2026-11-10: app正典のfindingと報告の規則を変えた。保存先に同じtopicの過去reportがある、または利用者が示した場合は、scopeを問わずreport冒頭へ前回比（fingerprint照合による新規 / 継続 / 解消 / 再出現の件数）を出し、前回の判定は引き継がず今回の証拠で付け直す。フルループの再調査では、過去reportの有無にかかわらず、同じrunの再走査前のfindingとfingerprintで照合する。fingerprintは「正規化path + function / symbol + sinkの種別（呼出先API名・設定key等）」とし、観点 / profile、行番号、CWEを含めない。CWEは根本原因で具体的なBase / Variantを選び、IDと名称を一次情報で確認していなければ未確認と書く。監査側が書いた再現test / scriptは、実行経路と同じ入口から既存防御を含む実codeを通したものだけを再現とし、内部関数の直接呼出し・対象codeの写し・mock越し等は部分再現として確信度highの根拠にしない。第三者projectへの報告は、人間が報告先のsupport中の版（原則最新release）で再現を確認し、報告先のadvisory / issue / changelogで既報・修正済みでないことを照合したfindingに限り、報告文は人間が自分の言葉で簡潔に書き、同じprojectへ多数を一度に送らない。
- 2026-11-10: app正典のAI / agent / MCPの観点へ次を加えた。LLMによるguardrail・injection detector・自動承認の分類器、system promptの禁止指示、command・SQL文字列のdenylistは回避され得る緩和策として記録し、それ単独ではcandidateの却下根拠にしない。command allowlist / 承認判定が使った解釈と実際にshellへ渡る文字列が同一か。shell / code実行toolからagent runtime自身のcredentialへ届かないか。承認後から実行までの間に操作を差し替えられないか。MCPのelicitation（form mode / URL mode）と、第三者APIへstatic client IDで接続するMCP proxy serverのclient単位の同意。skill / pluginをinstall・自動updateする側の実装では、解決後のcommitとpinの一致検証と、updateで自動実行経路が増えたときの再承認。repo内agent設定の観点へsubagent / custom agent定義を加えた。
- 2026-11-10: app正典の供給網・CI/CDの観点へ次を加えた。CI platformやactionが既定で止める経路は、実行時にofficial sourceで確認できた保護だけを既存防御に数え、保護を外す設定をcandidateにする。scripts欄が空でも暗黙のnative buildが走る経路（binding.gyp等）と、package managerがinstall時にproject rootから読み込んで実行し得るfile。publish経路は、自動化だけでinstall可能な版が出る経路と人の2FA承認を挟む経路を分けて記録する。推奨editor拡張が連鎖installする別拡張（extensionPack / extensionDependencies）も同じ項目で照合する。
- 2026-11-10: app正典のcore観点とWeb/API profileへ次を加えた。JWTの検証（受理algorithmの固定、header由来のkid / jku / x5u / jwk、iss / aud / exp、用途の異なるtokenの取り違え）、federated loginのaccount照合（issuerとsubjectの組。可変claimだけで既存accountへ自動結合しない）、SAML / XML署名の検証（signature wrapping、検証と抽出のparser差）、passkey登録後に残るphishableなfallbackでの認証強度の評価、server側componentからclientへserializeされる値、cache ruleとoriginのpath解釈の食い違い（web cache deception）、client-side path traversal、server側のarchive展開（entry名のpath traversal、symlink / hardlinkの展開先）。
- 2026-11-10: server正典と正本 `docs/README_invariants_server.md` の接続前の契約を補強した。`ssh -G` が示すproxyjump / proxycommandの経由hostも、host / user / port / host key指紋を提示して承認文に含め、提示・承認していない経由hostへは接続しない。経由hostにはcommand lineの `-o` が渡らないため、`ssh -G <経由host>` の出力で stricthostkeychecking yes、updatehostkeys no、batchmode yes、forwardagent no、identitiesonly yes を確認できた場合だけ経由し、確認できなければ接続せず未調査として終了する。proxycommandがssh以外のprogramを起動する場合はcommand全文を承認文に含める。`確認: なし` で経由hostがある場合は、経由hostをplanへ提示し、そのhost keyをlocalのknown_hosts既存entryで照合できる場合だけ接続する。接続optionへ `-o PermitLocalCommand=no` を加えた。commandごとに新規接続になるため、関連する照会を1接続にまとめ、並列agentを含む接続頻度を抑え、接続拒否・timeoutで連続再試行しない。owner repoは `git remote -v` の宛先を、URLのuserinfo部をmaskして併記し（owner repo側の `git remote -v` は承認前に使える照会へ加えた）、privateの申告が無い、またはpublic mirrorがあるなら不明＝公開扱いとして、Git管理をignoreに限る。trackが指定されていれば接続前に止まり、privateの申告かignoreへの変更を求める（publicと分かるrepoは従来どおり保存先にしない）。
- 2026-11-10: server正典の許可照会の形を、秘密値と副作用が出ない側へ直した。`systemctl status` は引数付きのprocess treeと直近journal行を出すため、状態は `systemctl show -p` / `is-active` / `is-enabled` で取り、statusを使う場合は `--lines=0` とpsと同じmaskを適用する。`systemctl cat` と `systemctl show -p ExecStart` 等も、Environment=の値を落とし、Exec系の引数にpsと同じmaskを適用する抽出を通す。apt / yumのrepo定義とproxy設定はURLのuserinfo・password・Proxy値をmaskして読み、apt auth.conf（auth.conf.d を含む）は .netrc と同じくcatせず、存在・owner・permission・key名・秘密patternの一致件数だけを取る。docker / podman psは `--no-trunc` を付けずCommand列を出さない。`rpm -Va` は `--noscripts` を付ける（packageのverify用scriptletを実行させない）。`getent` は passwd / group に限り、hosts / ahosts等の名前解決databaseは対象server上で使わない。metadata endpointへの照会は `curl -q --noproxy '*'` でproxy環境変数とcurlrcを無視してlink-localへ直接送る。`journalctl --verify` は、検証鍵を渡さないPASSを改ざん無しの根拠にせず、検証鍵をownerへ求めない。
- 2026-11-10: server正典の診断観点へ次を加えた。listenを伴わない公開経路（outbound tunnel client、mesh VPNの公開機能、常駐の `ssh -R`、remote管理agent）、管理panel / 管理UIと独自update経路を持つ管理panel・agentの版照合、live patchの実効状態（`/sys/kernel/livepatch`。`uname -r` の版だけでaffected / fixedを断定しない）、polkitのlocal ruleと `allow_any=yes` の特権action、永続化の棚卸し箇所（systemd generator、`/etc/update-motd.d`、package managerのhook / plugin）、`/proc/sys/kernel/tainted` の読取（out-of-tree・未署名・強制loadのbit。live patchは別のbitで、live patchの実効状態と照合する）、host内観測の「痕跡なし」を非侵害の根拠にしないこと、containerの低層runtimeとdeviceを渡すhook / toolkitを別componentとして版照合すること、kernel欠陥の緩和策がmodule無効化の場合の実効照合（設定fileの存在だけでmitigation済みにしない）。
- 2026-11-10: server正典のfinding記載項目へ「exploitability / exposure（観測不能な別管理面はunknown）」を、最終報告の明記事項へ「重大度はprovisionalで最終のrisk判断は所有者が行うこと」を加えた。保存先に同じtopicの過去reportがある、または利用者が示した場合は、report冒頭へ前回比（照合keyは 観点 + 対象service / config path + 設定key）を出し、今回の観測なしに解消としない。今回のscope外または未観測の前回findingは「未観測」として別に数え、継続にも解消にも入れない。
- 2026-11-10: 資料突合正典 `docs/audit_doc_vs_impl.md` へ次を加えた。file資料の形式変換・画像化・展開・描画はactive contentを解釈しない手段を優先し、office suiteやbrowserで開く場合はmacro / scriptを必ず無効にし、外部link更新 / remote resource取得は無効にするかnetwork遮断下で行う（macro / scriptを無効にできない手段では開かない）。`git fetch` / `git pull` を禁止操作に明記し、基準refのobjectが手元のcloneに無い場合も取得しない。nested / embedded bare repositoryをcwdにしてgit commandを実行しない。partial clone（promisor remote）では `git --no-lazy-fetch` を付けて読み、読めないobjectは未調査にする（git 2.45未満はこのoptionを持たずerrorになるので、その場合も未調査にする。環境変数 `GIT_NO_LAZY_FETCH=1` は2.45未満では無視されるため、`git --version` で2.45以上を確認できた場合だけ使う）。repository rootの外を指すsymlink / junctionの先を読まない（保存先・plan置き場と、利用者が資料・正典として明示したpathは対象外）。repository内のagent / IDE設定の列挙へsubagent定義を加え、探索範囲の縮小・reviewの代替を指示する内容にも従わない。公開または公開状態が不明なrepoで、Git管理のignore提案へ回答を得られず（`確認: なし`・非対話）、保存先（plan置き場のdocs/local/を含む）がignore済みでもない場合は、既存folderでも暗黙に決めず作成・調査前に停止する。引数欄のGit管理の必須条件と実行前確認の停止条件も同じ条件に揃えた。稼働instanceの画面は、画面・応答から読めるbuild / version識別子を記録し、revisionを実装基準refへ対応付けられなければ補助evidenceとして、code evidenceと食い違うときは確定せず判断待ちにする。資料内のinstall command・package名・image名・配布元URLを、manifest / lockfile / release設定の実名と突合する。URL資料は認証token・署名・share keyを含むquery / fragmentを除いて記録し、取得した全URLをplanへ残す。稼働率・SLA・backup・保持期間・監視等の運用実績claimは、repo内の設定・IaCと一致しても「設定上の一致」である旨をverdictへ添え、実績値そのもののclaimは実行実績を観測できなければunverifiableにする。前回reportがある場合は、今回のverdictを確定した後に前回の確定差異を今回のclaimへ対応付け、継続 / 解消 / 対応claimなしを差異一覧へ併記する。
- 2026-11-10: 3正典のHTML契約と共通契約 `docs/README_html-report.md` へ、headに雛形と同じCSP meta（default-src 'none'、base-uri 'none'、form-action 'none'、script / styleは当該fileのinlineだけ）とreferrerのno-referrerを置き、外さない・緩めないことを明記した。共通契約の確認項目へCSP metaとreferrer metaの存在を加えた。正典本文だけを貼り付けて雛形を読めない場合でも、同じmetaを持つHTMLになる。`templates/audit-report.html` と `examples/audit-report.example.html` は変更していない。
- 2026-11-10: `docs/README_activation.md` の「起動側の前提」へ、対象の `.git/config` がprogramを指す場合の起動側の自衛（harnessが起動時に打つgitはpromptから止められないため、`.git` を除いた読取専用copyで開く。`.git` を残す場合は、起動前に `.git/config`、`.git/config.worktree`、`.git/modules` 配下の各configにprogramを指すkeyが無いことを起動側が確かめる。GIT_CONFIG_COUNT系の環境変数で `core.fsmonitor=false` と `safe.bareRepository=explicit` を与えても、core.hooksPath、diff.external、filter / textconvは止まらない）と、管理下でない対象は依頼文に「対象は管理下でない」と1行書いて正典promptへ示したうえで、`検証モード: 静的` を指定するかsandboxとnetwork遮断の中で動かすことを加えた。信頼しない設定の列挙へsubagent定義を加え、成果物routingへserverのowner repoの公開状態の扱い（公開扱いでtrackが指定されていれば接続前に止まる）と、Git管理のignore提案へ回答を得られない場合の停止を加えた。app引数表のGit管理の必須条件と、`確認: なし` でも開始しない条件を正典に合わせた。README日英には、継続して使う場合にrelease tagかcommit SHAで固定し、更新時はCHANGELOGと正典3本のdiffを読んでから切り替える案内を加え、第三者projectへの報告条件・repo内agent設定の列挙・Git管理の停止の記述を正典に合わせた。

### Fixed

- 2026-11-10: 3正典の「HTML出力は省略時あり、明示なしなら生成しない。」が「明示が無いなら生成しない」とも読めたため、「HTML出力は省略時あり。「なし」を指定した場合は生成しない（書込み不可等で未生成になる場合は後述）。」へ直した。既定（省略時あり）は変えていない。
- 2026-11-10: app / server両正典と正本2本で、重大度lowの定義「別layerの防御で実害が抑えられる」が「重大度はimpactだけで付ける」と食い違っていたため、「low: 軽微。別layerの防御は重大度を下げる理由にせず、exploitability / exposureへ記録して優先順で扱う。」へ直した。app正典の外部originのscriptの項も同じ理由で、重大度は当該scriptの到達範囲（DOM / cookie / form）で付け、CSPの実効はexploitability / exposureへ記録する形へ直した。
- 2026-11-10: 正本 `docs/README_invariants_server.md` の「baseline適合だけでfindingを確定せず」が意味を逆にしていたため、server正典と同じ「baseline非適合だけでfindingを確定せず」へ直した。
- 2026-11-10: server正典と正本の確信度の定義がapp監査の語（再現・動的確認）のままだったため、server診断の証拠に合わせた（high: 実効値を返す照会または決定的なread-only観測で確認。medium: 実効値は照会で確認したが、一部の別layerを観測できていない。low: config / fileの直読・間接証拠・版文字列・推定のみで、実効値が未照合のものは確定にせず判断待ちに留める）。
- 2026-11-10: server正典がlogin記録をutmp形式の wtmp / lastlog だけ前提にしていたため、wtmpdb / lastlog2 を使うdistroでは実装を先に識別し、旧fileやlast commandの不在を単独でlog gap / tamperにしないようにした。
- 2026-11-10: app正典で、scope「調査まで」の差分確認が開始時に未commit差分のあるrepoでは満たせなかったため、「開始時の既存差分から増えたtracked差分が無いこと」を示す形へ直した。実行前確認の公開状態の括弧は、`git remote -v` から読めるのはhosting先だけで、visibilityとpublic mirror / forkの有無は起動側の申告値であることが分かる書き方にした。
- 2026-11-10: app正典と正本の語の食い違いを直した。完了rubric 5の「frontmatter」を、形式を受け手に合わせてよいとするreport契約に合わせて「metadata」へ（項目数は14のまま）。正本のrubric前文へ充足状態の3値（充足 / 未充足 / 該当なし）を明記。正本の数値評価の文を、正典と同じ「固定カテゴリ配点、findingごとの `+N点`、点数順sortを使わない」へ。修正フェーズ契約（paste-ready本文の外）で判断待ちの行に使っていた「検証待ち」を、修正適用後の確認待ちと紛れないよう `pending` へ。
- 2026-11-10: `CLAUDE.md` のdirectory構成で `.githooks/pre-commit` を「commit前secrets scan」と説明していたが、hookはdoxguard prereleaseをopt-inした環境でだけ検査するため、説明を実際の動作に合わせた。hookとinstallerは変更していない。

### Security

- 2026-11-10: app正典のpinned security baselineを2026-11-10に再確認し、一覧の確認日を更新した。NIST IR 8547はfinal（2026-10-27）とそのURLへ。Cargoの `min-publish-age` 系設定は1.99以前はnightly限定で、1.100でstableになる予定（2026-11-10時点のstableは1.99.1、1.100はbeta）。Python 3.10はEOL（2026-10-01）、3.11は2027-10予定、Node.js 26のEOL（2029-04-30）を追加。OWASP TCASVSはv5.0.2（2026-10-07）。W3C Trusted TypesのWorking Draftは2026-10-07付。Device Bound Session Credentialsの文書状態はW3C Working Draft。draft-ietf-tls-mlkemは2026-11-10時点でRFC Ed Queue・未公開、OAuth 2.1は同日時点でdraftのまま。package managerのinstall-time policyは、npm 12の承認先（package.jsonの `allowScripts`。未承認は既定でwarning + skip）、pnpmの既定cooldownがnon-strictであることと `trustLockfile`、pip 26.0以降の `--uploaded-prior-to` を一覧へ反映した。frozen-lockfileでのinstallにpackage manager側cooldownが効かないとする評価は、lockfile entryを再検証する版・設定を確認できた場合を除く形へ直した。版を持たないOWASP Cheat Sheetの行はURLの到達だけを確認した。
- 2026-11-10: server正典のpinのうち次の行を2026-11-10に再確認して更新した。OpenSSHは10.6のsecurity fixと10.6p2（2026-11-05。2026-11-10時点の最新）を追加。OpenSSLは支援中を3.5 LTS・4.0・4.1（2026-10-23 release、2027-11-23まで）とし、3.4・3.6を含むほかの系は終了済み。NIST IR 8547はfinal（2026-10-27。app正典と同じ版とURL）。Secure Bootの2011証明書3つはいずれも失効済み。Ubuntu 26.04 LTSのESMは2036-05まで。あわせてCA/Browser Forum SC-081v3、CISA KEV、BOD 26-04 / SSVC、NIST SP 800-63-4、Agentic Top 10 2026、Careful Adoption、RFC 10024の行も同日に照合した。今回開き直していない行が残るため、server正典のpin一覧の見出しの確認日は2026-09-29のまま据え置き、再確認した行（上の12行）を見出しに併記した。
- 2026-11-10: `.github/workflows/secrets-scan.yml` のactionをtag指定からfull commit SHA指定へ変え、`.github/workflows/gitleaks.yml` のgitleaks actionをtag objectのSHAからcommitのSHAへ直した（checkout v4.4.0、setup-node v4.4.0、gitleaks-action v2.3.9。SHAは2026-11-10にGitHub APIで取得）。

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
