#!/usr/bin/env node
// kb-driven secrets-scan — unified scanner for layer 2 (husky) / layer 3 (CI) / layer 4 (release) / sweep
//
// 設計詳細: docs/local/secrets-scan-design/index.html
// 原則: ~/.claude/guides/reference_release-pipeline.md P10
//
// kb の表示名列 + family display + 構造 regex（パス・private IP）で公開対象ファイルをスキャン。
// 新しい watchlist テーブルは作らない（id 正典・名前派生の kb 設計を維持）。

import { readFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

// === Configuration ===
// KB_ROOT / FAMILY_ROOT are required env vars (no hardcoded default so this
// script can ship as portable OSS without exposing a personal directory).
// If unset, the kb/family watchlists are skipped and only structural regex
// runs. Setup (example, PowerShell):
//   $env:KB_ROOT     = 'C:/path/to/kb'
//   $env:FAMILY_ROOT = 'C:/path/to/family'
// bash/zsh:
//   export KB_ROOT=/path/to/kb
//   export FAMILY_ROOT=/path/to/family

const KB_ROOT = process.env.KB_ROOT || null;
const FAMILY_ROOT = process.env.FAMILY_ROOT || null;

// Paths exempted from scanning (substring match against the path returned by git).
// These files legitimately reference watchlist patterns by design.
const EXEMPT_PATHS = [
  'scripts/secrets-scan.mjs',
  'scripts/secrets-scan.',
  '.husky/pre-commit',
  '.github/workflows/secrets-scan',
  'docs/local/',
];

const MIN_NEEDLE_LEN = 2;
const MAX_FILE_SIZE = 1024 * 1024;

// === Public-email allowlist ===
// メールアドレスは構造 regex で全件検知し、「公開する前提のアドレス」だけをここで通す。
// 非公開アドレスそのものは絶対にここへ書かない（allowlist 方式なら書かずに防げる）。
const ALLOWED_EMAILS = [
  'ishizakahiroshi.dev@gmail.com', // 公開コミット名義・package manifest 用
];
const ALLOWED_EMAIL_DOMAINS = [
  'users.noreply.github.com',  // GitHub の noreply
  'anthropic.com',             // AI コミット footer（Co-Authored-By）
  'example.com',               // ドキュメントの例示用
  'example.net',               // ドキュメントの例示用（RFC 2606 予約）
  'example.org',               // ドキュメントの例示用（RFC 2606 予約）
  'example.invalid',           // テスト fixture 用（RFC 2606 予約・名前解決されない）
  // ここに各プロジェクトの公開窓口ドメインを追記する（例: 'manabi-map.app'）
];

// 一致した値そのものはレポートへ出さない。
// このレポートは CI のログと端末のスクロールバックに残り、どちらも保持される。
// 公開リポの Actions ログは誰でも読めるので、検知した秘密をそこへ書き出しては
// 走査器自身が漏洩経路になる。突き合わせに要る情報（長さ・先頭末尾 1 文字）だけ残し、
// 中身は file:line を開いて確認させる。
// Do not print the matched value. This report lands in CI logs and terminal scrollback,
// both retained and public for public repos; writing a detected secret there makes the
// scanner its own leak path.
function maskMatch(matched) {
  const s = String(matched);
  if (s.length <= 2) return `<${s.length} chars, masked>`;
  return `${s[0]}...${s[s.length - 1]} <${s.length} chars, masked>`;
}

function isAllowedEmail(matched) {
  const email = matched.toLowerCase();
  if (ALLOWED_EMAILS.includes(email)) return true;
  const domain = email.split('@')[1] || '';
  return ALLOWED_EMAIL_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
}

// === Public product-name allowlist (kb watchlist) ===
// kb 台帳名の括弧なし変形（expandNameVariants）が、世界的な公開 OSS 名や一般英単語と
// 衝突して誤検知だけを生む場合にここへ書く。括弧付きフル名（例: 'ServiceName(CompanyName)'）と
// servers.csv のホスト名は引き続き検知されるため、会社との紐付き漏洩は別途捕捉される。
const ALLOWED_PUBLIC_NAMES = [
  'Nextcloud', // 公開 OSS 製品名
  'Portal',    // 一般英単語（社内ポータル台帳名の bare variant）
];

const BINARY_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.ico',
  '.pdf', '.zip', '.tar', '.gz', '.bz2', '.xz', '.7z', '.rar',
  '.exe', '.dll', '.so', '.dylib', '.bin', '.o', '.obj',
  '.woff', '.woff2', '.ttf', '.otf', '.eot',
  '.mp3', '.mp4', '.wav', '.avi', '.mov', '.webm', '.m4a',
]);

// Always skip these regardless of mode (huge text files that aren't authored)
const SKIP_FILENAMES = new Set([
  'pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'Cargo.lock',
  'go.sum', 'poetry.lock', 'Pipfile.lock',
]);

// === Minimal CSV parser (RFC 4180 subset with quoted fields) ===

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuote) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuote = false; }
      } else {
        field += c;
      }
    } else {
      if (c === '"') inQuote = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* ignore */ }
      else { field += c; }
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

// === Watchlist loading ===

// Some kb names include a parenthetical category/disambiguator
// (e.g. "ProductName(Purpose)" / "ServiceName(CompanyName)"). For matching purposes
// we want BOTH the full string AND the bare name before the paren,
// so a leak of just "ProductName" (without paren) is still caught.
function expandNameVariants(value) {
  const variants = new Set();
  if (value.length >= MIN_NEEDLE_LEN) variants.add(value);
  // Strip both half-width (...) and full-width （...） suffix
  const stripped = value.replace(/[(（].*$/, '').trim();
  if (stripped !== value && stripped.length >= MIN_NEEDLE_LEN) {
    variants.add(stripped);
  }
  return [...variants];
}

function loadKbWatchlist(kbRoot) {
  if (!kbRoot || !existsSync(kbRoot)) {
    return { available: false, items: [] };
  }
  const items = [];
  const specs = [
    { file: 'companies.csv',    col: 3, label: 'companies.short_name' },
    { file: 'people.csv',       col: 1, label: 'people.name' },
    { file: 'servers.csv',      col: 1, label: 'servers.host' },
    { file: 'applications.csv', col: 1, label: 'applications.name' },
  ];
  for (const { file, col, label } of specs) {
    const path = join(kbRoot, file);
    if (!existsSync(path)) continue;
    try {
      const rows = parseCSV(readFileSync(path, 'utf8'));
      for (let i = 1; i < rows.length; i++) {
        const value = (rows[i][col] || '').trim();
        for (const variant of expandNameVariants(value)) {
          if (ALLOWED_PUBLIC_NAMES.includes(variant)) continue;
          items.push({ needle: variant, source: `kb/${file}:${label}` });
        }
      }
    } catch (e) {
      console.error(`WARN: failed to parse ${path}: ${e.message}`);
    }
  }
  return { available: true, items };
}

// ひらがなのみ 2 文字以下の名は日本語の一般語（接続詞「かつ」等）と高頻度で衝突し
// 誤検知だけを生むため、単独 needle にしない（full_name = 姓+名 では引き続き検知する）。
function isNoiseGivenName(s) {
  return s.length <= 2 && /^[ぁ-んー]+$/.test(s);
}

function loadFamilyWatchlist(familyRoot) {
  if (!familyRoot) {
    return { available: false, items: [] };
  }
  const path = join(familyRoot, 'people.csv');
  if (!existsSync(path)) {
    return { available: false, items: [] };
  }
  const items = [];
  try {
    const rows = parseCSV(readFileSync(path, 'utf8'));
    for (let i = 1; i < rows.length; i++) {
      const familyName = (rows[i][1] || '').trim();
      const givenName  = (rows[i][2] || '').trim();
      if (familyName.length >= MIN_NEEDLE_LEN) {
        items.push({ needle: familyName, source: 'family/people.csv:family_name' });
      }
      if (givenName.length >= MIN_NEEDLE_LEN && !isNoiseGivenName(givenName)) {
        items.push({ needle: givenName,  source: 'family/people.csv:given_name' });
      }
      if (familyName && givenName) {
        items.push({ needle: familyName + givenName, source: 'family/people.csv:full_name' });
      }
    }
  } catch (e) {
    console.error(`WARN: failed to parse ${path}: ${e.message}`);
  }
  return { available: true, items };
}

// === Structural patterns (regex) ===

function getStructuralPatterns() {
  return [
    {
      // `Program Files` / `Windows` は共有システムパスで個人情報ではないため対象外。
      // `Users` / `dev` のみ personal-path として検知する。
      name: 'Windows absolute path',
      regex: /[A-Za-z]:[\\/](?:Users|dev)[\\/]/g,
      suggestion: '個人パスを削除またはプレースホルダ化 / Remove personal absolute path or use a placeholder',
    },
    {
      name: 'POSIX home path',
      regex: /\/(?:Users|home)\/[a-zA-Z0-9_.-]+\//g,
      suggestion: 'ホームパスを ~/ などにマスク / Mask home path with `~/`',
    },
    {
      // loopback (127.0.0.1) は共有定数で個人情報ではなく、技術文書での例示にも頻出するため対象外。
      // RFC1918 (10/8, 172.16/12, 192.168/16) のみを内部 LAN トポロジー漏洩として検知する。
      name: 'Private IPv4 (RFC1918)',
      regex: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})\b/g,
      // 置換先を名指しする: RFC5737 TEST-NET は層 3（CI の gitleaks で公開 IP を検知する構成）でも
      // 例示用として許容されるのが通例で、この置換なら層 2 / 層 3 の両方を一度で通る（2026-09-01 制定。
      // 「一般化」だけ案内すると CGNAT 等の公開レンジへ置換されて CI 層で二度目に止まる）。
      suggestion: 'RFC5737 TEST-NET (192.0.2.x / 198.51.100.x / 203.0.113.x) へ置換または削除 / Replace with RFC5737 TEST-NET documentation IPs or remove',
    },
    {
      // allowlist（ALLOWED_EMAILS / ALLOWED_EMAIL_DOMAINS）に無いメールアドレスは全件ブロック。
      // 個人アドレスを watchlist に書かずに検知するための allowlist 方式。
      name: 'Email address (not on public allowlist)',
      regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9][A-Za-z0-9.-]*\.[A-Za-z]{2,}\b/g,
      allow: isAllowedEmail,
      suggestion: '非公開メールを削除 / 公開前提のアドレスなら ALLOWED_EMAILS(_DOMAINS) へ追加',
    },
  ];
}

// === File listing per mode ===

// -z で NUL 区切りにする。付けないと git は日本語名・空白/引用符入りの名前を
// "\343\201..." のように八進エスケープして引用符で囲んで返し、readFileSync が開けず取りこぼす。
function gitList(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
    .split('\0').filter(Boolean);
}

function getFilesByMode(mode) {
  try {
    switch (mode) {
      case 'staged':
        return gitList(['diff', '--cached', '--name-only', '-z', '--diff-filter=ACM']);
      case 'files-from-diff':
        return gitList(['diff', '--name-only', '-z', '--diff-filter=ACM', 'HEAD']);
      case 'all-tracked':
        return gitList(['ls-files', '-z']);
      case 'packaged':
        console.error('ERROR: --packaged mode not yet implemented (TODO: read npm pack output for layer 4)');
        process.exit(2);
      default:
        console.error(`ERROR: unknown mode: ${mode}`);
        process.exit(2);
    }
  } catch (e) {
    if (String(e.message || '').includes('not a git repository')) {
      console.error('ERROR: not a git repository');
      process.exit(2);
    }
    throw e;
  }
}

// === Inline exempt directive ===
// Lines containing `secrets-scan: allow` are exempted.
//   `secrets-scan: allow`            -> allow all hits on this line
//   `secrets-scan: allow Nextcloud`  -> allow only matches whose needle
//                                       contains (case-insensitive) "Nextcloud"
// Multiple directives per line are OR'd.
function isAllowedByDirective(line, matchedNeedle) {
  const re = /secrets-scan:\s*allow(?:\s+([^\s\->]+))?/gi;
  let m;
  while ((m = re.exec(line)) !== null) {
    if (!m[1]) return true; // bare "allow" = whole-line exempt
    const target = m[1].toLowerCase();
    const needle = matchedNeedle.toLowerCase();
    if (needle.includes(target) || target.includes(needle)) return true;
  }
  return false;
}

// === Exemption / binary checks ===

function isExempt(path) {
  // normalize separator for substring matching
  const p = path.replace(/\\/g, '/');
  return EXEMPT_PATHS.some(ex => p.includes(ex));
}

function isBinary(path) {
  const lower = path.toLowerCase();
  for (const ext of BINARY_EXTS) {
    if (lower.endsWith(ext)) return true;
  }
  return false;
}

function isSkipFilename(path) {
  const base = path.replace(/\\/g, '/').split('/').pop();
  return SKIP_FILENAMES.has(base);
}

// === Scanning ===

// === Short-needle boundary rule ===
// 2 文字以下の watchlist 名は、そのままの部分文字列一致だと乱数めいた文字列に
// 無数に当たる（実例: YouTube の動画 ID `5vudjnGWFKc` の中の `WF` が kb のアプリ名に
// 一致して push がブロックされた・2026-08-30）。短い needle は「前後が英数字でない」
// ときだけ一致させる。実際の言及（`WF の設定` / `（WF）` / 行頭・行末）は引き続き当たり、
// 検知の網は落ちない。3 文字以上は従来どおり素の部分文字列一致。
const SHORT_NEEDLE_MAX = 2;
const ALNUM = /[A-Za-z0-9]/;

function matchesNeedle(line, needle) {
  if (needle.length > SHORT_NEEDLE_MAX) return line.includes(needle);
  let from = 0;
  for (;;) {
    const i = line.indexOf(needle, from);
    if (i < 0) return false;
    const before = i > 0 ? line[i - 1] : '';
    const after = line[i + needle.length] || '';
    if (!ALNUM.test(before) && !ALNUM.test(after)) return true;
    from = i + 1;
  }
}

function scanFile(path, needleMap, structuralPatterns) {
  if (!existsSync(path)) return [];
  let stat;
  try { stat = statSync(path); } catch { return []; }
  if (!stat.isFile()) return [];
  if (stat.size > MAX_FILE_SIZE) {
    // 無音でスキップすると「scanned N件」に数だけ入り、走査済みに見えて
    // しまう。1MB超のファイルへ秘密を置けばゲートを素通りできてしまうため、
    // 少なくとも気づけるようにstderrへ出す（ブロック挙動は変えない）。
    console.error(`WARN: skipped ${path} (${stat.size} bytes > ${MAX_FILE_SIZE}) — too large to scan for secrets`);
    return [];
  }

  let content;
  try { content = readFileSync(path, 'utf8'); } catch { return []; }

  const hits = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // watchlist needles (substring match)
    for (const [needle, source] of needleMap) {
      if (matchesNeedle(line, needle) && !isAllowedByDirective(line, needle)) {
        hits.push({
          file: path,
          lineNumber: i + 1,
          matched: needle,
          source,
          kind: 'watchlist',
          suggestion: '一般化（kb 由来名称を抽象化）/ Generalize (mask kb-derived name)',
        });
      }
    }

    // structural patterns
    for (const { name, regex, suggestion, allow } of structuralPatterns) {
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(line)) !== null) {
        if (!(allow && allow(m[0])) && !isAllowedByDirective(line, m[0])) {
          hits.push({
            file: path,
            lineNumber: i + 1,
            matched: m[0],
            source: `structural: ${name}`,
            kind: 'structural',
            suggestion,
          });
        }
        if (m.index === regex.lastIndex) regex.lastIndex++;
      }
    }
  }
  return hits;
}

// === Output ===

function formatHitsText(hits, mode) {
  const lines = [];
  lines.push('');
  lines.push('================================================================');
  lines.push(`BLOCKED: secrets-scan detected ${hits.length} match(es) in scanned files.`);
  lines.push(`ブロック: スキャン対象に ${hits.length} 件の混入を検知`);
  lines.push('================================================================');
  lines.push('');
  lines.push('Matched values are masked on purpose: this report is written to CI logs and');
  lines.push('terminal scrollback, both of which are retained. Open the cited file:line yourself.');
  lines.push('一致した値は意図的に伏せている。本レポートは CI ログと端末のスクロールバックに残るため。');
  lines.push('中身は引用された file:line を自分で開いて確認すること。');
  lines.push('');
  for (const h of hits) {
    lines.push(`  ${h.file}:${h.lineNumber}`);
    lines.push(`    matched : ${maskMatch(h.matched)}`);
    lines.push(`    source  : ${h.source}`);
    lines.push(`    suggest : ${h.suggestion}`);
    lines.push('');
  }
  if (mode === 'staged' || mode === 'files-from-diff') {
    lines.push('To bypass (NOT recommended): git commit --no-verify');
    lines.push('  Note: CI (layer 3) and release gate (layer 4) will run the same check.');
    lines.push('  注意: bypass しても CI（層 3）と release ゲート（層 4）で再 fail します。');
    lines.push('');
  }
  return lines.join('\n');
}

// === Argument parsing ===

function parseArgs(argv) {
  const args = { mode: null, block: false, dryRun: false, format: 'text', help: false };
  for (const a of argv) {
    if (a === '--staged') args.mode = 'staged';
    else if (a === '--files-from-diff') args.mode = 'files-from-diff';
    else if (a === '--all-tracked') args.mode = 'all-tracked';
    else if (a === '--packaged') args.mode = 'packaged';
    else if (a === '--block') args.block = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--format=json') args.format = 'json';
    else if (a === '--format=text') args.format = 'text';
    else if (a === '-h' || a === '--help') args.help = true;
  }
  return args;
}

function showHelp() {
  process.stdout.write(`secrets-scan — kb-driven content gate for public-facing files

Usage: node scripts/secrets-scan.mjs <mode> [options]

Modes (exactly one required):
  --staged              scan files staged for commit (layer 2 / pre-commit hook)
  --files-from-diff     scan files changed since HEAD (layer 3 / CI on PR)
  --all-tracked         scan all git-tracked files (sweep / audit)
  --packaged            scan packaged tarball (layer 4 / release gate) [TODO]

Options:
  --block               exit 1 on any hit (use for enforcement)
  --dry-run             report hits but exit 0 (use for sweep / audit)
  --format=text|json    output format (default: text)
  -h, --help            show this help

Environment (required for full coverage; unset = structural regex only):
  KB_ROOT       path to kb root containing companies.csv / people.csv / servers.csv / applications.csv
  FAMILY_ROOT   path to family CSV root containing people.csv
  Example (PowerShell): $env:KB_ROOT = 'C:/path/to/kb'
  Example (bash/zsh)  : export KB_ROOT=/path/to/kb

Exit codes:
  0  no hits, or hits found but --dry-run / no --block
  1  hits found with --block
  2  configuration / usage error

Watchlist sources:
  kb/companies.csv (short_name) / people.csv (name) /
  servers.csv (host) / applications.csv (name)
  family/people.csv (family_name, given_name, family+given)
  + structural regex (Windows absolute paths, POSIX home paths, RFC1918 IPs)
`);
}

// === Main ===

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) { showHelp(); process.exit(0); }
  if (!args.mode) { showHelp(); process.exit(2); }

  const kb = loadKbWatchlist(KB_ROOT);
  const family = loadFamilyWatchlist(FAMILY_ROOT);

  const warnings = [];
  if (!kb.available) {
    if (!KB_ROOT) {
      warnings.push(`WARN: KB_ROOT env var not set — kb-derived watchlist skipped, structural regex only`);
      warnings.push(`WARN: KB_ROOT env var が未設定 — kb 由来 watchlist をスキップ・構造 regex のみで継続`);
    } else {
      warnings.push(`WARN: KB_ROOT path not found: ${KB_ROOT} — kb-derived watchlist skipped`);
      warnings.push(`WARN: KB_ROOT パスが見つかりません: ${KB_ROOT} — kb 由来 watchlist をスキップ`);
    }
  }
  if (!family.available) {
    if (!FAMILY_ROOT) {
      warnings.push(`WARN: FAMILY_ROOT env var not set — family watchlist skipped`);
      warnings.push(`WARN: FAMILY_ROOT env var が未設定 — family watchlist をスキップ`);
    } else {
      warnings.push(`WARN: FAMILY_ROOT path not found: ${FAMILY_ROOT} — family watchlist skipped`);
      warnings.push(`WARN: FAMILY_ROOT パスが見つかりません: ${FAMILY_ROOT} — family watchlist をスキップ`);
    }
  }

  // De-duplicate needles (a name can appear in multiple kb tables)
  const needleMap = new Map();
  for (const item of [...kb.items, ...family.items]) {
    if (!needleMap.has(item.needle)) needleMap.set(item.needle, item.source);
  }

  const structuralPatterns = getStructuralPatterns();

  const allFiles = getFilesByMode(args.mode);
  const filesToScan = allFiles.filter(f => !isExempt(f) && !isBinary(f) && !isSkipFilename(f));

  const allHits = [];
  for (const file of filesToScan) {
    const hits = scanFile(file, needleMap, structuralPatterns);
    allHits.push(...hits);
  }

  for (const w of warnings) console.error(w);

  if (args.format === 'json') {
    process.stdout.write(JSON.stringify({
      mode: args.mode,
      scanned: filesToScan.length,
      total_files: allFiles.length,
      exempt_or_skipped: allFiles.length - filesToScan.length,
      kb_needles: kb.items.length,
      family_needles: family.items.length,
      structural_patterns: structuralPatterns.length,
      hits: allHits,
      warnings,
    }, null, 2) + '\n');
  } else {
    if (allHits.length === 0) {
      process.stdout.write(`OK: secrets-scan passed (scanned ${filesToScan.length} files; ${needleMap.size} needles + ${structuralPatterns.length} structural patterns)\n`);
      process.stdout.write(`OK: secrets-scan に問題なし\n`);
    } else {
      process.stderr.write(formatHitsText(allHits, args.mode));
    }
  }

  if (allHits.length > 0 && args.block && !args.dryRun) {
    process.exit(1);
  }
  process.exit(0);
}

main();
