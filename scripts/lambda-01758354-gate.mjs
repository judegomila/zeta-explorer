#!/usr/bin/env node
/**
 * lambda-01758354-gate.mjs — fail-closed assembly gate for the project's Λ ≤ 0.1758354
 * computer-assisted candidate (t0 = 1583/10000, y0² = 87677/2500000).
 *
 * Status of the candidate: computer-assisted, unreviewed, unpublished. Platt–Trudgian
 * Λ ≤ 0.2 is the accepted benchmark. This script checks that the certified numbers
 * produced by the verifiers compose; it does not re-run any verifier and proves nothing
 * beyond the stated inequalities between those numbers. NO QED.
 *
 * Inputs (each pinned by SHA-256; a missing file or checksum mismatch exits 2):
 *   - src/data/dag3-audit01758-2026-09-28.js  (baked parameters and certified literals;
 *     the checksummed bytes are the bytes imported, via a data: URL)
 *   - tmp/lambda01758/tail01758354_prec{256,512}.log  (parameter-locked Arb tail verifier,
 *     SUMMARY line with Arb-verified rational bounds) + its source / mollifier header
 *   - tmp/ydini_full_256b.log (2026-08-02 run; identical bytes to the package log) and
 *     tmp/ydini_full_256_rerun_2026-09-22.log  (y-transfer excision budget B)
 *   - tmp/sweep_15830/{A1,A2,D}_*.log  (finite-lane Arb sweep, 5,309,013 rows; scanned)
 *   - tmp/dag3-audit01758-epscap.log  (python-flint ε_cap, window freeze)
 *   - tmp/dag3-audit01758-tail-runs.log  (C Arb e_C0 hull-ball enclosures at N = 690988, 1300001)
 *   - tmp/moll_0.15830.txt  (P17-287 mollifier; compared entry-by-entry with the tail header arrays)
 *   - tmp/lambda01758/replay_{A1,A2,D}.log  (fresh -DTRIANGLE_WEIGHT replays of the three binding rows with
 *     the command line, source/binary/mollifier sha256 and exit status recorded; rows compared with the lane)
 *
 * 2026-09-28 referee hardening (items F1-F13 of the gate referee report): every log must have the exact
 * expected structure (one SUMMARY/RESULT line, last line exit=0, no FAIL text, lane headers exactly the
 * expected lines and nothing after TIMING); the tail SUMMARY rationals are checked against the printed Arb
 * balls; baked literals are compared exactly; the replay logs pin y^2, mollifier type and file; the window
 * freeze is checked in the needed form x_690988 < X; an audit-module import failure exits 2.
 * Directed rounding inside the verifiers (e.g. lower_point vs upper_point) is NOT detectable here; it is
 * protected only by review of the pinned sources.
 * Optional --rerun-tail: rebuild the pinned tail source with cc/FLINT into a temp directory, re-run it at
 * 256 and 512 bits and require output byte-identical to the pinned logs (banner through RESULT line).
 *
 * Arithmetic: exact BigInt rationals. Decimal prints are converted exactly; Arb balls
 * [m +/- r] are rounded outward (upper = m + r, lower = m − r); rounded-to-nearest decimal
 * prints of upper bounds get one unit in the last printed place added.
 *
 * Exit codes: 0 all checks pass (one-line PASS summary); 1 an inequality/consistency check
 * failed; 2 an input is missing or its checksum differs.
 * Usage: node scripts/lambda-01758354-gate.mjs [--verbose] [--rerun-tail]
 */
import { readFileSync, existsSync, openSync, readSync, closeSync, mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VERBOSE = process.argv.includes('--verbose');
const RERUN_TAIL = process.argv.includes('--rerun-tail');
for (const a of process.argv.slice(2)) if (!['--verbose', '--rerun-tail'].includes(a)) { console.error(`FAIL: unknown argument ${a}`); process.exit(2); }

// ------------------------------------------------------------------ pinned inputs
const INPUTS = {
  audit: ['src/data/dag3-audit01758-2026-09-28.js', 'ae3ef09efb5c3f70bba6630aa1aeb87720c653a896feb5abf89b7b46665fc5bd'],
  tail256: ['tmp/lambda01758/tail01758354_prec256.log', '09b994b2796fd9080aa13cd472b540402c215d1dde8b1c4510d2c33e74b31486'],
  tail512: ['tmp/lambda01758/tail01758354_prec512.log', '5e354c69add05f8a6199fd11622c6dd5552de2479fa2efcf69700464ff8900a5'],
  tailSrc: ['tmp/lambda01758/verify_tail_genmoll_01758354.c', 'f3d142e62779184696fdeda4f0d9bb66259562ba66b84bf594ae8793bb3540f7'],
  tailHdr: ['tmp/lambda01758/moll_p17_287.h', '1b811e80d9303c7bb7a8e4fd3a8b0e49c7b3a688ac4cf8f233e38f284f5fed5c'],
  ydiniA: ['tmp/ydini_full_256b.log', '9991211449e68f38b7b97d809a70a37a5cb112f20311398394d23d3c4f9d8303'],
  ydiniB: ['tmp/ydini_full_256_rerun_2026-09-22.log', 'be0bb9a91f17355ea3d7068926f7898abb50cf7121fe3f361ba110599dae86bb'],
  laneA1: ['tmp/sweep_15830/A1_p17_690988_1000000.log', 'f7640c6dc197bb07298ff981df3eed43eaca79f39ef19fc8495690a825625204'],
  laneA2: ['tmp/sweep_15830/A2_p17_1000001_1300000.log', '22f7123e57868c633c2a71eae0ac4864aaa554b8f964ea16481e01cc26dd9076'],
  laneD: ['tmp/sweep_15830/D_p3_1300001_6000000.log', '6bdd7546f1ce3e8ec2e6dd9b745934c7a77cf4759388f8a3f7dd8b5a63a121ca'],
  epscap: ['tmp/dag3-audit01758-epscap.log', 'ea69c30f92f85395b6d0943f25d3fa27c868d98895fedff7b6f47fd274db1f06'],
  tailRuns: ['tmp/dag3-audit01758-tail-runs.log', '4d8ac5d835485ecd1f508a3f49041c1c3066fef81a91667e497a04a68a0db378'],
  moll: ['tmp/moll_0.15830.txt', 'a05f16ef483c9bc4c04871582a93a10c8c232622ad5558e32378d1401eec8a5c'],
  replayA1: ['tmp/lambda01758/replay_A1.log', '828d87fe412d5ea5d85d8b46af623c9a5085082e12957a67b0deef122efba805'],
  replayA2: ['tmp/lambda01758/replay_A2.log', '6fccca7d26c59e8ba038e4f0f51526ee990b48b89fa40459a4e57650fe378d1f'],
  replayD: ['tmp/lambda01758/replay_D.log', '58137708bdce0fc13cd1b25c9d14c59c8974bcca16a46a3cd9d0779ef5cd6b15'],
};
/** Package producer source the replays were built from (lemma_sweep_genmoll.c, sealed correspondence + mtype 7). */
const PRODUCER_SHA = '561d59bfd66130fdc0f6897af013e94ef751e185789d22c566478c6815e44677';
const LANE_KEYS = ['laneA1', 'laneA2', 'laneD'];

// ------------------------------------------------------------------ exact rationals
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const Q = (n, d = 1n) => {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) throw new Error('zero denominator');
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d) || 1n; return [n / g, d / g];
};
const add = (x, y) => Q(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
const sub = (x, y) => Q(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
const mul = (x, y) => Q(x[0] * y[0], x[1] * y[1]);
const cmp = (x, y) => { const l = x[0] * y[1], r = y[0] * x[1]; return l < r ? -1 : l > r ? 1 : 0; };
const lt = (x, y) => cmp(x, y) < 0, le = (x, y) => cmp(x, y) <= 0, eq = (x, y) => cmp(x, y) === 0;
const max = (...xs) => xs.reduce((a, b) => (cmp(a, b) >= 0 ? a : b));
const fmt = (x, digits = 7) => (Number(x[0] * 10n ** 30n / x[1]) / 1e30).toExponential(digits - 1);
const pow10 = (k) => (k >= 0 ? Q(10n ** BigInt(k)) : Q(1n, 10n ** BigInt(-k)));

/** Exact rational value of a decimal string such as "-2.66796644998734677756e-7". */
function dec(s) {
  const m = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(String(s).trim());
  if (!m || (m[2] === '' && (m[3] ?? '') === '')) throw new Error(`not a decimal: ${s}`);
  const frac = m[3] ?? '';
  let v = mul(Q(BigInt((m[2] || '0') + frac)), pow10(-frac.length));
  if (m[4]) v = mul(v, pow10(Number(m[4])));
  return m[1] === '-' ? Q(-v[0], v[1]) : v;
}
/** One unit in the last printed place of a decimal string (for round-to-nearest prints). */
function ulpOf(s) {
  const m = /^[+-]?\d*(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(String(s).trim());
  return pow10(Number(m[2] ?? 0) - (m[1] ?? '').length);
}
/** Arb ball "[m +/- r]" -> {lo, hi}, outward. */
function ball(s) {
  const m = /\[\s*([-+0-9.eE]+)\s*\+\/-\s*([0-9.eE+-]+)\s*\]/.exec(s);
  if (!m) throw new Error(`not an Arb ball: ${s}`);
  const c = dec(m[1]), r = dec(m[2]);
  return { lo: sub(c, r), hi: add(c, r) };
}
/** "a/b" -> exact rational. */
const frac = (s) => { const m = /^(-?\d+)\/(\d+)$/.exec(String(s).trim()); if (!m) throw new Error(`not a fraction: ${s}`); return Q(m[1], m[2]); };

// ------------------------------------------------------------------ input loading
const inputFailures = [];
const text = {};
const sha = {};
const lane = {};

function sha256File(abs) {
  return createHash('sha256').update(readFileSync(abs)).digest('hex');
}

/** Stream a lane log once: hash it and scan rows (contiguity, UNCERT, minimum L12). */
function scanLane(abs) {
  const h = createHash('sha256');
  const fd = openSync(abs, 'r');
  const buf = Buffer.allocUnsafe(1 << 22);
  let rest = '';
  const out = { header: [], rows: 0, first: null, last: null, gaps: 0, uncert: 0, nonpos: 0, malformed: 0, minL12: null, minN: null,
    timing: null, timingCount: 0, stray: [], afterTiming: 0, head3: [] };
  let expect = null;
  const line = (ln) => {
    if (out.timingCount > 0 && ln.trim() !== '') { out.afterTiming++; if (!ln.startsWith('TIMING')) return; }
    if (ln.startsWith('N ')) {
      if (out.head3.length < 3) out.head3.push(ln);
      const p = ln.trim().split(/\s+/);
      const n = Number(p[1]);
      if (!Number.isSafeInteger(n)) { out.malformed++; return; }
      if (expect !== null && n !== expect) out.gaps++;
      if (out.first === null) out.first = n;
      out.last = n; expect = n + 1; out.rows++;
      if (p[2] !== 'L12') { if (p[2] === 'UNCERT') out.uncert++; else out.malformed++; return; }
      if (!/^\d+\.\d+$/.test(p[3] ?? '')) { out.malformed++; return; }
      const v = dec(p[3]);
      if (v[0] <= 0n) out.nonpos++;
      if (out.minL12 === null || lt(v, out.minL12)) { out.minL12 = v; out.minN = n; }
    } else if (ln.startsWith('TIMING')) {
      out.timing = ln.trim().split(/\s+/); out.timingCount++;
    } else if (ln.trim() !== '') {
      if (out.rows === 0) out.header.push(ln); else out.stray.push(ln);
    }
  };
  try {
    for (;;) {
      const k = readSync(fd, buf, 0, buf.length, null);
      if (k === 0) break;
      const chunk = buf.subarray(0, k);
      h.update(chunk);
      const s = rest + chunk.toString('latin1');
      const parts = s.split('\n');
      rest = parts.pop();
      for (const ln of parts) line(ln);
    }
    if (rest !== '') line(rest);
  } finally { closeSync(fd); }
  out.sha = h.digest('hex');
  return out;
}

for (const [key, [rel, want]] of Object.entries(INPUTS)) {
  const abs = resolve(REPO, rel);
  if (!existsSync(abs)) { inputFailures.push(`missing input ${rel}`); continue; }
  if (LANE_KEYS.includes(key)) {
    lane[key] = scanLane(abs); sha[key] = lane[key].sha;
  } else {
    sha[key] = sha256File(abs);
    text[key] = readFileSync(abs, 'utf8');
  }
  if (sha[key] !== want) inputFailures.push(`checksum mismatch ${rel}: have ${sha[key]}, pinned ${want}`);
}
if (inputFailures.length) {
  for (const f of inputFailures) console.error(`FAIL input: ${f}`);
  console.error(`FAIL lambda-01758354-gate: ${inputFailures.length} input problem(s); nothing checked. NO QED.`);
  process.exit(2);
}

// The audit module is import-free; import exactly the checksummed bytes. Import failure = input problem (exit 2).
let A;
try {
  const auditMod = await import(`data:text/javascript;base64,${Buffer.from(text.audit, 'utf8').toString('base64')}`);
  A = auditMod.DAG3_AUDIT01758;
  if (!A || typeof A !== 'object') throw new Error('DAG3_AUDIT01758 export missing');
} catch (e) {
  console.error(`FAIL input: audit module import failed: ${e.message}`);
  console.error('FAIL lambda-01758354-gate: audit module did not load; nothing checked. NO QED.');
  process.exit(2);
}

// ------------------------------------------------------------------ checks
const results = [];
function check(id, fn) {
  let ok = false, note = '';
  try { const r = fn(); ok = r === true || (r && r.ok === true); note = (r && r.note) || ''; } catch (e) { ok = false; note = `threw: ${e.message}`; }
  results.push({ id, ok, note });
}
const grab = (src, re, label) => { const m = re.exec(src); if (!m) throw new Error(`pattern not found: ${label}`); return m; };
const block = (src, startMarker) => {
  const i = src.indexOf(startMarker); if (i < 0) throw new Error(`block not found: ${startMarker}`);
  const j = src.indexOf('\n=== ', i + startMarker.length); return src.slice(i, j < 0 ? undefined : j);
};

// Parameters from the audit module (exact).
const P = A.parameters;
const T0 = frac(P.t0), Y02 = frac(P.y0sq), TARGET = frac(P.target);
const X = Q(BigInt(P.X)), T_PT = Q(BigInt(P.T_PT));
const ONE = Q(1n), TWO = Q(2n);
const ONE_M_2T0 = sub(ONE, mul(TWO, T0));
const N = A.numbers;

check('audit-parameters-literal', () => eq(T0, Q(1583n, 10000n)) && eq(Y02, Q(87677n, 2500000n)) && eq(TARGET, Q(879177n, 5000000n))
  && P.X === '6000000185827' && P.T_PT === '3000175332800' && P.mollifierSha256 === INPUTS.moll[1]);

check('exact-target-identity t0+y0^2/2 = 879177/5000000', () => eq(add(T0, mul(Y02, Q(1n, 2n))), Q(879177n, 5000000n))
  && eq(Q(879177n, 5000000n), dec('0.1758354')) && lt(Q(0n), T0) && le(T0, Q(1n, 2n)) && lt(Q(0n), Y02) && lt(Y02, ONE_M_2T0));

check('barrier-containment t0<=129/800, 0.1809^2<y0^2, y0^2+2t0<1', () => {
  const box = /\[X, X\+1\] × \[0\.1809, 1\] × t ∈ \[0, 129\/800\]/.test(P.barrierBox);
  return box && le(T0, Q(129n, 800n)) && lt(mul(dec('0.1809'), dec('0.1809')), Y02) && lt(add(Y02, mul(TWO, T0)), ONE)
    && le(ONE_M_2T0, ONE);
});

check('height-margin T_PT - X/2 = 350479773/2 > 0', () => {
  const s = sub(T_PT, mul(X, Q(1n, 2n)));
  return eq(s, Q(350479773n, 2n)) && lt(Q(0n), s) && P.heightSurplus === '350479773/2';
});

check('window-freeze x_690988 < X (needed form) and x_* < x_690989; epscap log has no [FAIL]', () => {
  const e = text.epscap;
  const ok1 = /\[PASS\] x_690988\(t0\) < x_\* = X \+ sqrt\(1-y0\^2\)/.test(e) && /\[PASS\] x_\* < x_690989\(t0\)/.test(e);
  const margins = e.match(/margins: x_\* - x_690988 = /g) || [];
  const m = grab(e, /margins: x_\* - x_690988 = (\[[^\]]+\])\s+x_690989 - x_\* = (\[[^\]]+\])/, 'window margins');
  const b1 = ball(m[1]), b2 = ball(m[2]);
  // x_* = X + sqrt(1 - y0^2) < X + 1 since y0^2 > 0; so x_690988 < x_* - b1.lo < X + 1 - b1.lo <= X when b1.lo >= 1.
  // The needed condition is x_690988 <= min_y (X + sqrt(1 - y^2)) = X + sqrt(2 t0), implied by x_690988 < X.
  const neededForm = lt(Q(0n), Y02) && le(ONE, b1.lo);
  const noFail = !/\[FAIL\]/.test(e) && (e.match(/^RESULT: /gm) || []).length === 1;
  return { ok: ok1 && margins.length === 1 && neededForm && lt(Q(0n), b2.lo) && noFail,
    note: `x_690988 < X - ${fmt(sub(b1.lo, ONE), 10)}; x_690989 - x_* >= ${fmt(b2.lo, 10)}` };
});

const LANE_HDR = {
  laneA1: ['TBOX 15830/100000 15830/100000', 'WEIGHT TRIANGLE', 'MOLL general nd=287 D=1000'],
  laneA2: ['TBOX 15830/100000 15830/100000', 'WEIGHT TRIANGLE', 'MOLL general nd=287 D=1000'],
  laneD: ['TBOX 15830/100000 15830/100000', 'WEIGHT TRIANGLE'],
};
check('lane-log structure: header exactly the expected lines (TBOX = t0 singleton), no stray text, TIMING last', () => {
  const ok = LANE_KEYS.every((k) => {
    const L = lane[k], want = LANE_HDR[k];
    return L.header.length === want.length && L.header.every((h, i) => h === want[i]) && L.stray.length === 0
      && L.timingCount === 1 && L.afterTiming === 0;
  });
  const m = /^TBOX (\d+)\/(\d+) (\d+)\/(\d+)$/.exec(LANE_HDR.laneA1[0]);
  return ok && eq(Q(m[1], m[2]), T0) && eq(Q(m[3], m[4]), T0);
});

// Binding-row replays (referee F7): the lane logs do not record y^2, precision, K, hw or the mollifier; the
// replay logs do (command line + sha256s), and their rows must equal the lane rows bit-for-bit.
const REPLAY = {
  replayA1: { lane: 'laneA1', cmd: 'MOLL_FILE=tmp/moll_0.15830.txt ./gensweep_tri_replay 690988 690990 15830 15830 100000 350708 10000000 7 256 14 0.005 t' },
  replayA2: { lane: 'laneA2', cmd: 'MOLL_FILE=tmp/moll_0.15830.txt ./gensweep_tri_replay 1000001 1000003 15830 15830 100000 350708 10000000 7 256 14 0.005 t' },
  replayD: { lane: 'laneD', cmd: './gensweep_tri_replay 1300001 1300003 15830 15830 100000 350708 10000000 3 256 14 0.005 t (MOLL_FILE unset)' },
};
check('binding-row replays: recorded command (t0, y^2 = 350708/10^7 = y0^2, mtype 7/7/3, 256 bit), producer + mollifier sha, rows = lane rows', () => {
  const ok = Object.entries(REPLAY).every(([k, r]) => {
    const lines = text[k].split('\n').filter((x) => x !== '');
    const h = /^# src sha256 ([0-9a-f]{64}); binary sha256 ([0-9a-f]{64}); moll sha256 ([0-9a-f]{64})$/.exec(lines[0] ?? '');
    if (!h || h[1] !== PRODUCER_SHA || h[3] !== INPUTS.moll[1]) return false;
    if (lines[1] !== `# cmd: ${r.cmd}`) return false;
    const want = [...LANE_HDR[r.lane], ...lane[r.lane].head3];
    const body = lines.slice(2, 2 + want.length);
    const timing = lines[2 + want.length] ?? '';
    return body.length === want.length && body.every((x, i) => x === want[i]) && /^TIMING [0-9.]+ 3$/.test(timing)
      && lines.length === 4 + want.length && lines[lines.length - 1] === 'exit=0';
  });
  const args = /(\d+) (\d+) (\d+) (\d+) (\d+) (\d+) (\d+) (\d) 256 14 0\.005 t/.exec(REPLAY.replayA1.cmd);
  return ok && eq(Q(args[3], args[5]), T0) && eq(Q(args[4], args[5]), T0) && eq(Q(args[6], args[7]), Y02);
});

check('y-range coverage (tail hull, tail y-box, ydini ybox)', () => {
  const top = Q(8266802n, 10n ** 7n), bot = Q(1872719n, 10n ** 7n), yhi = Q(23409n, 125000n);
  const tailOk = le(ONE_M_2T0, mul(top, top)) && lt(mul(bot, bot), Y02) && lt(Y02, mul(yhi, yhi)) && le(mul(yhi, yhi), ONE_M_2T0)
    && P.yHullTop === '8266802/10^7' && P.yHullBottom === '1872719/10^7';
  // ydini: Arb gate 1 (ybox contains [y0, sqrt(1-2t0)]) must have passed in both runs; the printed
  // %.15f endpoints must be consistent with it (necessary condition, half-unit rounding allowed).
  const half = Q(5n, 10n ** 16n);
  const yd = ['ydiniA', 'ydiniB'].every((k) => {
    const m = grab(text[k], /gates 1-5 seed: PASS \(t=(\d+\/\d+), N_lo=(\d+), ybox=\[([0-9.]+),([0-9.]+)\]\)/, `${k} gate line`);
    const lo = sub(dec(m[3]), half), hi = add(dec(m[4]), half);
    return eq(frac(m[1]), T0) && m[2] === String(P.lane.nLo) && le(mul(lo, lo), Y02) && le(ONE_M_2T0, mul(hi, hi))
      && /all y in \[y0, sqrt\(1-2t\)\]/.test(text[k]);
  });
  return tailOk && yd;
});

// Tail (parameter-locked verifier).
const tailSummary = {};
const tailBalls = {};
const TAIL_BALLS = { D: 'D upper point', flow: 'flow lower point', err: 'error upper point', eC0: 'eC0 upper point', eAB: 'eAB upper point' };
const count = (src, re) => (src.match(re) || []).length;
for (const k of ['tail256', 'tail512']) {
  const t = text[k];
  const m = /^SUMMARY tail01758354 (.*)$/m.exec(t);
  if (m) tailSummary[k] = Object.fromEntries(m[1].trim().split(/\s+/).map((kv) => kv.split('=')));
  tailBalls[k] = {};
  for (const [key, label] of Object.entries(TAIL_BALLS)) {
    const re = new RegExp(`^${label} = (\\[[^\\]]+\\])$`, 'gm');
    const all = [...t.matchAll(re)];
    if (all.length === 1) tailBalls[k][key] = ball(all[0][1]);
  }
}
check('tail logs produced by the pinned source/header (build line)', () => ['tail256', 'tail512'].every((k) => {
  const b = /^# built \S+ cc -O2 verify_tail_genmoll_01758354\.c; src sha256 ([0-9a-f]{64}); header sha256 ([0-9a-f]{64}); binary sha256 ([0-9a-f]{64})$/.exec(text[k].split('\n')[0]);
  return b && b[1] === INPUTS.tailSrc[1] && b[2] === INPUTS.tailHdr[1] && text.tailHdr.includes(INPUTS.moll[1]);
}));
check('tail header arrays equal tmp/moll_0.15830.txt entry-by-entry (287 rows, lambda_1 = 1)', () => {
  const rows = text.moll.split('\n').filter((x) => x !== '' && !x.startsWith('#')).map((x) => {
    const m = /^(\d+) (-?\d+) (\d+)$/.exec(x); if (!m) throw new Error(`bad mollifier row: ${x}`); return m.slice(1);
  });
  const arr = (name) => {
    const m = new RegExp(`static const (?:ulong|slong) ${name}\\[MOLL_NLAM\\] = \\{([-0-9,]+)\\};`).exec(text.tailHdr);
    if (!m) throw new Error(`header array ${name} missing`); return m[1].split(',');
  };
  const d = arr('moll_d'), n = arr('moll_num'), q = arr('moll_den');
  const nl = /#define MOLL_NLAM (\d+)\n/.exec(text.tailHdr);
  const abs = rows.reduce((a, r) => a + (BigInt(r[1]) < 0n ? -BigInt(r[1]) : BigInt(r[1])), 0n);
  const absHdr = /#define MOLL_ABS_SUM_SCALED (\d+)UL/.exec(text.tailHdr);
  return rows.length === 287 && nl && Number(nl[1]) === 287 && [d, n, q].every((a) => a.length === 287)
    && rows.every((r, i) => r[0] === d[i] && r[1] === n[i] && r[2] === q[i] && r[2] === '1000000')
    && rows[0][0] === '1' && rows[0][1] === rows[0][2] && rows[286][0] === '1000'
    && rows.every((r, i) => i === 0 || BigInt(r[0]) > BigInt(rows[i - 1][0]))
    && absHdr && BigInt(absHdr[1]) === abs && abs === 78592832n;
});
check('tail log structure: one banner/SUMMARY/TOTAL/RESULT, 38 [PASS] lines, no FAIL text, last line exit=0', () => ['tail256', 'tail512'].every((k, i) => {
  const t = text[k]; const s = tailSummary[k]; if (!s) return false;
  const lines = t.split('\n').filter((x) => x.trim() !== '');
  return count(t, /^SUMMARY /gm) === 1 && count(t, /^RESULT: /gm) === 1 && count(t, /^RESULT: ALL ARB TAIL CHECKS PASS$/gm) === 1
    && count(t, /^TOTAL CHECKS: 38; FAILURES: 0$/gm) === 1 && count(t, /^\[PASS\] /gm) === 38 && !/FAIL(?!URES: 0)/.test(t.replace(/failures=0/g, ''))
    && count(t, /^Lambda<=0\.1758354 candidate tail verifier /gm) === 1 && count(t, /^# built /gm) === 1
    && lines[lines.length - 1] === 'exit=0' && count(t, /^exit=/gm) === 1
    && s.result === 'PASS' && s.failures === '0' && s.checks === '38' && s.prec === ['256', '512'][i];
}));
check('tail SUMMARY parameters: N1 = N* = lane top, nlam 287, t0, y0^2, target, y-box contains y0, ytop^2 >= 1-2t0', () => ['tail256', 'tail512'].every((k) => {
  const s = tailSummary[k];
  const ylo = frac(s.ylo), yhi = frac(s.yhi), ytop = frac(s.ytop);
  return s.N1 === String(P.lane.nHi) && s.nlam === '287' && s.M === '153814' && eq(frac(s.t0), T0) && eq(frac(s.y02), Y02)
    && eq(frac(s.target), TARGET) && eq(ytop, frac(P.yHullTop.replace('10^7', '10000000'))) && eq(ylo, frac(P.yHullBottom.replace('10^7', '10000000')))
    && lt(mul(ylo, ylo), Y02) && lt(Y02, mul(yhi, yhi)) && le(mul(yhi, yhi), ONE_M_2T0) && le(ONE_M_2T0, mul(ytop, ytop));
}));
check('tail SUMMARY rationals bound the printed Arb balls (D_ub >= D.hi, flow_lb <= flow.lo, err/eC0/eAB_ub >= hi)', () => ['tail256', 'tail512'].every((k) => {
  const s = tailSummary[k], b = tailBalls[k];
  if (Object.keys(TAIL_BALLS).some((x) => !b[x])) return false;
  return le(b.D.hi, frac(s.D_ub)) && le(frac(s.flow_lb), b.flow.lo) && le(b.err.hi, frac(s.err_ub))
    && le(b.eC0.hi, frac(s.eC0_ub)) && le(b.eAB.hi, frac(s.eAB_ub)) && le(add(frac(s.eC0_ub), frac(s.eAB_ub)), add(frac(s.err_ub), Q(2n, 10n ** 18n)));
}));
check('tail contraction D < 1 (both precisions; baked D = SUMMARY D_ub exactly)', () => {
  const ok = ['tail256', 'tail512'].every((k) => lt(frac(tailSummary[k].D_ub), ONE) && lt(tailBalls[k].D.hi, ONE));
  const D = max(frac(tailSummary.tail256.D_ub), frac(tailSummary.tail512.D_ub));
  return { ok: ok && eq(dec(String(N.tail.D6e6)), D), note: `D <= ${fmt(D, 12)}` };
});
check('tail normalized margin flow > error > 0 (both precisions; baked flow/error = SUMMARY bounds exactly)', () => ['tail256', 'tail512'].every((k) => {
  const s = tailSummary[k]; const f = frac(s.flow_lb), e = frac(s.err_ub);
  return lt(e, f) && lt(Q(0n), e) && lt(tailBalls[k].err.hi, tailBalls[k].flow.lo)
    && eq(dec(String(N.tail.error)), e) && eq(dec(String(N.tail.flow)), f);
}));

if (RERUN_TAIL) check('tail rerun (--rerun-tail): pinned source rebuilt, output byte-identical to the pinned logs (banner..RESULT)', () => {
  const dir = mkdtempSync(resolve(tmpdir(), 'tail01758354-'));
  try {
    copyFileSync(resolve(REPO, INPUTS.tailSrc[0]), resolve(dir, 'v.c'));
    copyFileSync(resolve(REPO, INPUTS.tailHdr[0]), resolve(dir, 'moll_p17_287.h'));
    if (sha256File(resolve(dir, 'v.c')) !== INPUTS.tailSrc[1] || sha256File(resolve(dir, 'moll_p17_287.h')) !== INPUTS.tailHdr[1]) return false;
    const inc = process.env.FLINT_INC || '/opt/homebrew/include', lib = process.env.FLINT_LIB || '/opt/homebrew/lib';
    execFileSync('cc', ['-O2', '-Wall', '-Wextra', `-I${inc}`, '-o', resolve(dir, 'tail'), resolve(dir, 'v.c'), `-L${lib}`, `-Wl,-rpath,${lib}`, '-lflint', '-lgmp', '-lmpfr', '-lm'], { stdio: 'pipe' });
    const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('TAIL_') && k !== 'MOLL_FILE'));
    return ['256', '512'].every((prec) => {
      const out = execFileSync(resolve(dir, 'tail'), [prec], { encoding: 'utf8', env, stdio: ['ignore', 'pipe', 'pipe'] }).split('\n');
      const pinned = text[`tail${prec}`].split('\n');
      const endOut = out.indexOf('RESULT: ALL ARB TAIL CHECKS PASS'), endPin = pinned.indexOf('RESULT: ALL ARB TAIL CHECKS PASS');
      return endOut > 0 && endPin > 1 && out.slice(0, endOut + 1).join('\n') === pinned.slice(1, endPin + 1).join('\n');
    });
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

// Finite lane.
check('finite-lane: legs tile 690988..6000000 contiguously, 0 UNCERT, 0 non-positive, counts', () => {
  const legs = P.lane.legs; // [name, lo, hi, moll]
  const keys = { A1: 'laneA1', A2: 'laneA2', D: 'laneD' };
  let total = 0;
  for (let i = 0; i < legs.length; i++) {
    const [name, lo, hi] = legs[i]; const L = lane[keys[name]];
    if (!L) return false;
    if (i === 0 ? lo !== P.lane.nLo : lo !== legs[i - 1][2] + 1) return false;
    if (L.first !== lo || L.last !== hi || L.rows !== hi - lo + 1 || L.gaps || L.uncert || L.nonpos || L.malformed) return false;
    if (!L.timing || Number(L.timing[2]) !== hi - lo + 1) return false;
    total += L.rows;
  }
  return { ok: legs[legs.length - 1][2] === P.lane.nHi && total === N.windows && total === 5309013, note: `${total} windows, 0 UNCERT` };
});
check('finite-lane minima equal baked L12_min (exact) and audit-log sha prefixes', () => {
  const m = { A1: lane.laneA1, A2: lane.laneA2, D: lane.laneD };
  const okMin = Object.entries(m).every(([k, L]) => eq(L.minL12, dec(String(N.L12min[k]))));
  const okN = m.A1.minN === 690988 && m.A2.minN === 1000001 && m.D.minN === 1300001;
  const okPrefix = [['A1', 'laneA1'], ['A2', 'laneA2'], ['D', 'laneD']].every(([n, k]) =>
    new RegExp(`${n}: header=.* sha256=${sha[k].slice(0, 16)}\\b`).test(text.epscap));
  return okMin && okN && okPrefix;
});

// y-transfer budget.
const Bruns = {};
let worstRatio = '';
check('ydini PASS in both runs (one RESULT line, no FAIL, EXIT=0 where recorded); ranges = lane legs; mollifiers P17-287 / Euler{2,3}', () => ['ydiniA', 'ydiniB'].every((k) => {
  const t = text[k];
  const b = grab(t, /certified excision budget B <= ([0-9.]+e[-+]\d+)/, `${k} B`);
  const r = grab(t, /RESULT: YDINI PASS B=([0-9.]+e[-+]\d+) < 1\.7e-3/, `${k} result`);
  Bruns[k] = b[1];
  worstRatio = grab(t, /worst certified branch-\(ii\) ratio = ([0-9.]+)/, `${k} ratio`)[1];
  const exits = t.match(/^EXIT=.*$/gm) || [];
  const lines = t.split('\n').filter((x) => x.trim() !== '');
  const tailOk = exits.length === 0 ? /^Certified: for all N in /.test(lines[lines.length - 1])
    : exits.length === 1 && lines[lines.length - 1] === 'EXIT=0';
  return b[1] === r[1] && count(t, /certified excision budget B <= /g) === 1 && count(t, /^RESULT: /gm) === 1 && !/FAIL/.test(t) && tailOk
    && /Certified: for all N in \[690988,1300000\] u \[1300001,6000000\]/.test(t)
    && /verify_ydini_genmoll: prec=256 bits\s+t=1583\/10000/.test(t)
    && /ndiv=287\s+lambda_2=-1019196\/1000000\s+lambda_1000=-168492\/1000000/.test(t)
    && count(t, /^LEG D: Euler\{2,3\}, N=\[1300001,6000000\], /gm) === 1 && count(t, /^LEG D: /gm) === 2 && count(t, /^LEG D: PASS /gm) === 1
    && P.lane.legs[1][2] === 1300000 && P.lane.legs[2][1] === 1300001 && P.lane.legs[2][3] === 'Euler {2,3}';
}) && { ok: true, note: `worst certified branch-(ii) ratio ${worstRatio} (arb_div diagnostic; decisive test is strict arb_lt); ydini_full_256b.log records no EXIT line` });
let B_MAX = null;
check('B_max = max(B runs) + 1e-12 cushion = baked B.used; larger B from the run that read the pinned tmp/moll_0.15830.txt', () => {
  const a = dec(Bruns.ydiniA), b = dec(Bruns.ydiniB);
  // (C6) evidence: the 2026-09-22 run logs the path of the SHA-pinned mollifier input and has the larger B.
  if (!/^mollifier: tmp\/moll_0\.15830\.txt  ndiv=287 /m.test(text.ydiniB) || !le(a, b)) return false;
  B_MAX = max(dec(String(N.B.used)), add(max(a, b), Q(1n, 10n ** 12n)));
  return eq(a, dec(String(N.B.run20260802))) && eq(b, dec(String(N.B.run20260922))) && eq(B_MAX, dec(String(N.B.used)));
});

// ε_cap: take the maximum of every available upper bound (any one valid bound suffices).
let EPS_A = null, EPS_D = null;
check('eps_cap enclosures (C Arb hull ball, python-flint subdivided, baked) and rounding-up', () => {
  const tr = text.tailRuns;
  const blkA = block(tr, '=== ERROR-ONLY moll=moll_0.15830.txt N1=690988 prec=256');
  const blkD = block(tr, '=== ERROR-ONLY moll=moll_0.15830.txt N1=1300001 prec=256');
  const gateOk = [blkA, blkD].every((b) => /\[PASS\] eC0 quotient N-monotonicity gate/.test(b)
    && /\[PASS\] domain: X_N\(t\) > 200/.test(b) && /\[PASS\] domain: log\(N\^2-t\/16\) > 2/.test(b));
  const eC0ballA = ball(grab(blkA, /eC0 upper point = (\[[^\]]+\])/, 'eC0 A').at(1)).hi;
  const eC0ballD = ball(grab(blkD, /eC0 upper point = (\[[^\]]+\])/, 'eC0 D').at(1)).hi;
  const e = text.epscap;
  const pyA = grab(e, /eps_cap \(whole lane, N >= 690988\)\s+<= ([0-9.]+e[-+]\d+)/, 'py eps A')[1];
  const pyD = grab(e, /eps_cap \(leg D,\s+N >= 1300001\) <= ([0-9.]+e[-+]\d+)/, 'py eps D')[1];
  const pyAB = grab(e, /e_A\+e_B uniform upper \(N in \[690988, 6e6\]\) : ([0-9.]+e[-+]\d+)/, 'py eAB')[1];
  const eAB = max(dec(String(N.eAB)), add(dec(pyAB), ulpOf(pyAB)));
  const bakedA = dec(String(N.epsCapLane)), bakedD = dec(String(N.epsCapLegD));
  EPS_A = max(bakedA, add(eC0ballA, eAB), add(dec(pyA), ulpOf(pyA)), add(dec(String(N.eC0HullBall)), eAB));
  EPS_D = max(bakedD, add(eC0ballD, eAB), add(dec(pyD), ulpOf(pyD)));
  const okA = eq(EPS_A, bakedA) && le(eC0ballA, dec(String(N.eC0HullBall)));
  const okD = eq(EPS_D, bakedD) && le(add(dec(pyD), ulpOf(pyD)), bakedD) && le(EPS_D, EPS_A);
  const okPy = /\[PASS\] premise L_N = log\(N\^2 - t\/16\) > 2 at N_lo/.test(e) && /\[PASS\] premise X_N > 12 at N_lo/.test(e)
    && /\[PASS\] Delta N-monotonicity premise/.test(e) && /RESULT: ALL CHECKS PASS/.test(e) && !/\[FAIL\]/.test(e);
  return { ok: gateOk && okA && okD && okPy && lt(EPS_A, dec('1.1e-6')),
    note: `eps_lane <= ${fmt(EPS_A, 7)}, eps_legD <= ${fmt(EPS_D, 8)} (baked legD ${N.epsCapLegD} >= C hull ball + e_AB)` };
});

// Tightened gate.
let GATE = null;
check('tightened gate L12_min - B_max - eps_cap > 0 (every leg; >= baked 1.622504e-3)', () => {
  const lA1 = sub(sub(lane.laneA1.minL12, B_MAX), EPS_A);
  const lA2 = sub(sub(lane.laneA2.minL12, B_MAX), EPS_A);
  const lD = sub(sub(lane.laneD.minL12, B_MAX), EPS_D);
  GATE = [lA1, lA2, lD].reduce((a, b) => (cmp(a, b) <= 0 ? a : b));
  return { ok: lt(Q(0n), GATE) && le(dec(String(N.gate.legA)), lA1) && le(dec(String(N.gate.legD)), lD) && lt(B_MAX, dec('1.7e-3')),
    note: `legA1 ${fmt(lA1, 10)}, legA2 ${fmt(lA2, 10)}, legD ${fmt(lD, 10)}` };
});

check('honest scope in the audit module', () => /NO QED/.test(A.verdict) && /PT Lambda <= 0\.2 stands/.test(A.verdict)
  && /unreviewed, unpublished/.test(A.status) && A.tiers.heuristic.length === 0);

// ------------------------------------------------------------------ report
const failed = results.filter((r) => !r.ok);
if (VERBOSE || failed.length) for (const r of results) console.log(`[${r.ok ? 'PASS' : 'FAIL'}] ${r.id}${r.note ? ` — ${r.note}` : ''}`);
if (failed.length) {
  console.error(`FAIL lambda-01758354-gate: ${failed.length}/${results.length} checks failed (${failed.map((r) => r.id).join('; ')}). NO QED.`);
  process.exit(1);
}
console.log(`PASS lambda-01758354-gate: ${results.length}/${results.length} checks, ${Object.keys(INPUTS).length} pinned inputs; `
  + `t0+y0^2/2=879177/5000000; tail D<=${fmt(frac(tailSummary.tail512.D_ub), 12)}<1, flow>=${fmt(frac(tailSummary.tail512.flow_lb), 10)}>err<=${fmt(frac(tailSummary.tail512.err_ub), 10)}; `
  + `lane ${N.windows} windows 0 UNCERT; L12_min-B_max-eps_cap>=${fmt(GATE, 10)}>0 (eps_cap<=${fmt(EPS_A, 7)}); `
  + 'computer-assisted candidate, unreviewed, unpublished; PT Lambda<=0.2 is the accepted benchmark; NO QED');
