/**
 * @fileoverview dag3-audit01758-2026-09-28 — composition / interface audit of the project's Λ ≤ 0.1758354
 * computer-assisted candidate (t0 = 1583/10000, y0² = 87677/2500000; t0 + y0²/2 = 879177/5000000). Two adversarial
 * referee passes; neither refuted a load-bearing claim; their corrections are applied here (A1/A2 binding-row replays
 * done; 'bit-identical' wording on page/DAG is accurate for partials; e_A+e_B carries the N^{|κ|} factor; ε_cap
 * provenance stated; tail-verifier banner/domain-check macros; page mislabels listed).
 *
 * PROVED (exact rationals, recomputed below with BigInt):
 *  - t0 + y0²/2 = 1583/10000 + 87677/5000000 = 879177/5000000 = 0.1758354; y0² < 1 − 2t0 = 3417/5000.
 *  - Barrier interface (Polymath15 Thm 1.2 hypothesis iii) holds by CONTAINMENT, no t-monotonicity needed:
 *    t0 ≤ 129/800, 0.1809² < y0², y0² + 2t0 < 1, so the region at t0 lies inside the sealed box
 *    [X, X+1] × [0.1809, 1] × [0, 129/800]. The "monotone in t" justification on the page/DAG is unnecessary.
 *  - Height interface (i): X = 6000000185827, T_PT = 3000175332800 (Platt–Trudgian), T_PT − X/2 = 350479773/2 > 0.
 *  - Lane inputs equal (t0, y0²) exactly; the y-hull top (8266802/10^7)² ≥ 1 − 2t0 = 3417/5000.
 * CERTIFIED (Arb / ball arithmetic, computer-assisted):
 *  - ε_cap (Polymath Thm 1.3 additive error) uniform over the finite lane: e_C0 ≤ 2.66796645e-7 (C tail_gen hull
 *    ball; python-flint y-subdivided 2.66796028e-7; referee mpmath.iv 2.6679643e-7 / 2.6679586e-7), e_A+e_B ≤ 2.652e-11
 *    (referee re-derivation with the N^{|κ|} factor: 2.6518e-11) ⇒ ε_cap ≤ 2.668232e-7 (lane), ≤ 9.2129e-8 (leg D).
 *    Replaces the 1.1e-6 placeholder inherited from the 0.1787854 row.
 *  - Tail gate: parameter-locked verifier tmp/lambda01758/verify_tail_genmoll_01758354.c (t0, y-box, y-top, N1 = 6e6,
 *    P17-287 compiled in, no env overrides, parameters defined once), 38/38 PASS at 256 and 512 bit; Arb-verified
 *    SUMMARY bounds D ≤ 880148631881/10^12 < 1, flow ≥ 72339895395/10^12 > err ≤ 6161460033/10^18.
 *    (D = 1.129382 at 3.84e6 fails; 0.975515 at 5e6.)
 *  - Finite lane logs 690988..6000000: 5,309,013 contiguous rows, 0 UNCERT; minima A1 1.872347259e-3 (N = 690988),
 *    A2 0.101297954835, D 0.010066384413. Fresh -DTRIANGLE_WEIGHT build reproduces the binding rows bit-identically on
 *    all three shards (A1 690988..690990, A2 1000001..1000003, D 1300001..1300003; A1 482 s, A2 673 s CPU).
 *  - y-transfer excision budget: two full 256-bit ydini runs, B ≤ 2.495709389e-4 and ≤ 2.495763535e-4; the larger is used.
 *  - Window freeze at t0 (Arb 320 bit) margins 5,377,393.9855 / 11,989,041.1770 (sealed row shifted by 4π·Δt/16).
 *  - Tightened gate L12_min − B_max − ε_cap = 1.622504e-3 > 0 (leg D: 9.816715e-3); ≈ 6000 × ε_cap. Recomputed from the
 *    logs by the fail-closed assembly gate scripts/lambda-01758354-gate.mjs (exact BigInt rationals, 16 SHA-256-pinned
 *    inputs, hardened after a mutation-testing referee pass F1–F13).
 *  - Package ~/dbn-lambda-01758354-candidate SHA256SUMS 30/30 OK; mollifier sha256 a05f16ef…8a5c.
 * CONDITIONAL: Polymath15 Thms 1.2/1.3 + Prop 6.6 as cited; Platt–Trudgian height; inherited barrier analytic residuals
 *  (B_t ≠ 0 on R; t → 0 limit of Lemma 8.4 / Thm 1.3); human sign-off on y-transfer Theorems B/C and Lemmas B1–B4;
 *  sign-off on the general-weight native binding note formalization/paper/native-binding-general-weights.md (written
 *  2026-09-28, 41/41 script checks, referee-corrected: (H1) real weights is not needed; (C6) restated on hash evidence).
 * MEASURED: the two full ydini B values differ by 5.415e-9 (2.2e-5 rel.) with identical structural counts — per-thread
 *  accumulation order under ball rounding, not a race; both are upper bounds. Worst printed branch-(ii) ratio
 *  1.00000000745 is an arb_div diagnostic (decisive test is strict arb_lt).
 * HEURISTIC: none load-bearing (the "binary ↔ source" link is now pinned by binding-row replays on all shards).
 *
 * Verdict: composition closes; no parameter mismatch or math gap found; grade stays computer-assisted candidate,
 * unreviewed, unpublished. PT Lambda <= 0.2 stands. NO QED.
 * Scripts: tmp/dag3-audit01758-epscap.py (+.log), tmp/dag3-audit01758-tail-runs.sh (+.log),
 * tmp/dag3-audit01758-gensweep_tri, tmp/dag3-audit01758-legD-row.log, tmp/dag3-audit01758-ref1-A1row.log,
 * tmp/dag3-audit01758-ref1-A2row.log, tmp/dag3-audit01758-ref0-epscap.py, tmp/dag3-audit01758-ref1-epscheck.py.
 * Import-free. ASSERTIONS recompute the exact identities, containment, window counts, ε_cap sum, the tightened gate,
 * the window-freeze shift and the tail-log SUMMARY bounds (BigInt, against the printed Arb balls) from baked literals.
 * NOTE: scripts/lambda-01758354-gate.mjs pins this file's SHA-256; any edit here requires re-pinning the gate.
 */

// exact rational helpers (BigInt numerator/denominator)
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const R = (n, d = 1n) => { const g = gcd(n, d) || 1n; const s = d < 0n ? -1n : 1n; return [s * n / g, s * d / g]; };
const add = (x, y) => R(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
const sub = (x, y) => R(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
const mul = (x, y) => R(x[0] * y[0], x[1] * y[1]);
const lt = (x, y) => x[0] * y[1] < y[0] * x[1];
const le = (x, y) => x[0] * y[1] <= y[0] * x[1];
const eq = (x, y) => x[0] === y[0] && x[1] === y[1];

const T0 = R(1583n, 10000n);
const Y02 = R(87677n, 2500000n); // y0² (so y0²/2 = 87677/5000000)
const TARGET = R(879177n, 5000000n);
const X_HEIGHT = 6000000185827n;
const T_PT = 3000175332800n;

export const DAG3_AUDIT01758 = Object.freeze({
  id: 'dag3-audit01758-2026-09-28',
  date: '2026-09-28',
  title: 'Composition / interface audit of the Λ ≤ 0.1758354 computer-assisted candidate',
  status:
    'AUDIT COMPLETE, two referee passes (minor corrections applied); packaging items closed the same day: parameter-locked '
    + 'tail verifier 38/38 PASS at 256/512 bit, fail-closed assembly gate PASS (hardened after a mutation-testing referee), '
    + 'binding-row replays with recorded command lines, four page phrases fixed, general-weight native binding written and '
    + 'referee-corrected. Tightened gate L12_min − B_max − ε_cap = 1.622504e-3 > 0 with ε_cap ≤ 2.668232e-7. No parameter '
    + 'mismatch or math gap found. Not yet internal-rigorous grade: human sign-off (y-transfer Thms B/C, inherited barrier '
    + 'residuals, native-binding note), the run_all.sh GATE 4 mollifier-path fix, and external referee review remain. '
    + 'Computer-assisted candidate, unreviewed, unpublished. NO QED.',
  verdict:
    'The composition closes: every interface’s parameters match, ε_cap ≤ 2.668232e-7, tail D = 0.8801 < 1 reproduced in Arb, '
    + 'and the tightened gate is positive with margin ≈ 6000 × ε_cap. The grade stays computer-assisted candidate, unrefereed. '
    + 'PT Lambda <= 0.2 stands. NO QED.',
  parameters: {
    t0: '1583/10000', y0sq: '87677/2500000', y0sqHalf: '87677/5000000', target: '879177/5000000', laneY2: '350708/10^7 = 87677/2500000 = y0²',
    X: X_HEIGHT.toString(), T_PT: T_PT.toString(), heightSurplus: '350479773/2',
    yHullTop: '8266802/10^7', yHullBottom: '1872719/10^7', barrierBox: '[X, X+1] × [0.1809, 1] × t ∈ [0, 129/800]',
    mollifierSha256: 'a05f16ef483c9bc4c04871582a93a10c8c232622ad5558e32378d1401eec8a5c',
    lane: { nLo: 690988, nHi: 6000000, legs: [['A1', 690988, 1000000, 'P17-287'], ['A2', 1000001, 1300000, 'P17-287'], ['D', 1300001, 6000000, 'Euler {2,3}']] },
  },
  numbers: {
    eC0HullBall: 2.66796645e-7,
    eC0Subdivided: 2.66796028e-7,
    eC0RefereeIv: [2.6679643e-7, 2.6679586e-7],
    eAB: 2.652e-11,
    eABReferee: 2.6518e-11,
    epsCapLane: 2.668232e-7,
    epsCapLegD: 9.21291e-8, /* ≥ C Arb hull-ball e_C0(1300001) + e_AB = 9.2129017e-8 (was 9.2129e-8, 1.7e-14 below it) */
    epsCapPlaceholderOld: 1.1e-6,
    eMax01787854Row: 2.335e-7,
    L12min: { A1: 1.872347259e-3, A2: 0.101297954835, D: 0.010066384413 },
    bindingRowReplay: { A1: [0.001872347259, 0.001872501332, 0.001873126692], A2: [0.101297954835, 0.101298294110, 0.101298366714], D: [0.010066384413, 0.010066666138, 0.010066784254], cpuSeconds: { A1: 482, A2: 673 } },
    B: { run20260802: 2.495709389e-4, run20260922: 2.495763535e-4, used: 2.495763545e-4 /* larger + 1e-12 print cushion */ },
    gate: { legA: 1.622504e-3, legD: 9.816715e-3, withOldPlaceholder: 1.621771e-3 },
    /* D6e6 / flow / error are the Arb-verified SUMMARY rationals of the parameter-locked tail verifier (upper, lower,
       upper); the earlier literals 0.880148631879 / 0.0723399 were rounded in the unsafe direction (referee F11). */
    tail: { D6e6: 0.880148631881, D384e6: 1.129382, D5e6: 0.975515, flow: 0.072339895395, error: 6.161460033e-9 },
    tailLog: {
      verifier: 'tmp/lambda01758/verify_tail_genmoll_01758354.c', build: 'tmp/lambda01758/run_tail.sh',
      logs: ['tmp/lambda01758/tail01758354_prec256.log', 'tmp/lambda01758/tail01758354_prec512.log'],
      checks: 38, failures: 0, precisions: [256, 512], N1: 6000000, M: 153814, nlam: 287,
      summary: { D_ub: '880148631881/1000000000000', flow_lb: '72339895395/1000000000000', err_ub: '6161460033/1000000000000000000',
        eC0_ub: '6161247899/1000000000000000000', eAB_ub: '212136/1000000000000000000' },
      balls: { D: ['0.880148631879013798749234593045', '4.86e-31'], flow: ['0.0723398953960200649058519364770', '4.46e-32'],
        err: ['6.16146003178863346239627919623e-9', '3.29e-40'], eC0: ['6.16124789729055599707407964161e-9', '3.35e-39'],
        eAB: ['2.12134498077465322199554623670e-13', '4.49e-44'] },
      enclosuresIdenticalAcrossPrecisionsAndOldBinary: true,
    },
    replays: { logs: ['tmp/lambda01758/replay_A1.log', 'tmp/lambda01758/replay_A2.log', 'tmp/lambda01758/replay_D.log'],
      script: 'tmp/lambda01758/replay_binding_rows.sh', producerSha256: '561d59bfd66130fdc0f6897af013e94ef751e185789d22c566478c6815e44677',
      mtypes: { A1: 7, A2: 7, D: 3 }, cmdY2: '350708/10000000', timingSeconds: { A1: 428.865, A2: 616.456, D: 16.172 }, bitIdenticalToLane: true },
    windowFreeze: { t0: [5377393.9855, 11989041.1770], sealedRow: [5377393.9878, 11989041.1746], deltaT: 0.16125 - 0.1583 },
    windows: 5309013,
    packageSha256Ok: [30, 30],
  },
  interfaces: [
    { gate: 'Height (i)', certifiedBy: 'Platt–Trudgian 2021 + classical T = 0 argument', match: 'yes (X, y0 unchanged)', gap: 'none beyond citing the precise PT height' },
    { gate: 'Barrier (iii)', certifiedBy: 'sealed 883-prism Arb certificate on [X,X+1]×[0.1809,1]×[0,129/800]', match: 'yes, by containment (exact)', gap: 'inherited human sign-off (B_t ≠ 0 on R; t → 0 limit); replace "monotone in t" with containment' },
    { gate: 'Sweep (gate 1)', certifiedBy: 'lemma_sweep_genmoll.c TRIANGLE build, Arb 256-bit, 5,309,013 rows', match: 'yes; binding rows replayed bit-identically on A1/A2/D (replay logs record command line + producer/mollifier sha)', gap: 'no independent full-lane replay; full-lane logs do not echo y² / mollifier hash; native-binding note written, sign-off open' },
    { gate: 'y-transfer (gate 4)', certifiedBy: 'verify_ydini_genmoll full 256-bit PASS (two runs)', match: 'yes', gap: 'human sign-off on Thms B/C; larger B carried; run_all.sh GATE 4 passes no mollifier path (fix: ydini 256 "$MOLL")' },
    { gate: 'Effective approximation', certifiedBy: 'this audit: ε_cap ≤ 2.668232e-7', match: 'yes', gap: 'write-up must replace ~1e-6; relies on the inherited 10.50 error-constant weld' },
    { gate: 'Tail (gate 2)', certifiedBy: 'tail_gen re-run at 256/512 bit', match: 'yes (overlap at N = 6e6)', gap: 'closed: parameter-locked verifier 38/38 at 256/512 bit; directed rounding protected only by source review; corridors are regression checks' },
    { gate: 'Polymath assembly', certifiedBy: 'exact identity checked here', match: 'yes', gap: 'fail-closed gate scripts/lambda-01758354-gate.mjs PASS; runs only on this machine (inputs under untracked tmp/); no Lean statement of the Thm 1.2 instantiation' },
  ],
  refereeCorrections: [
    'A1 binding row N = 690988..690990 replayed bit-identically (482 s CPU, not ~40 min); A2 first rows also replayed (673 s).',
    'Page/DAG "partials reproduced bit-identically" is accurate as written; the omission is that the full 2026-09-22 B differs from 2026-08-02 by 5.4e-9.',
    'e_A+e_B must carry |γ| N^{|κ|} (the script used n^{κ̂}); the factor is ≤ 1 + 2e-13, bound unchanged (2.6518e-11).',
    'ε_cap headline uses the C hull-ball e_C0 (looser); the script gate subtracted the subdivided value 2.6682254577e-7; both give 1.622504e-3.',
    'Page wording to fix: "Euler–Maclaurin" (tail uses endpoint-cap / integral comparison, TAIL_LEMMA Lemma 3.1); "monotone in t" (containment); '
      + '"verified strip height to N*" (N* is the finite/tail cutoff; X unchanged); "reduction is Lean-checked" (only the y-transfer reduction and Lemma B3 are in Lean).',
    'Gate referee (mutation testing, F1–F13): tail logs now require exactly one SUMMARY/RESULT line, last line exit=0 and no FAIL text (F1); '
      + 'SUMMARY rationals are checked against the printed Arb balls and baked literals compared exactly (F2, F11); verifier parameters are '
      + 'macros used once each by computation, exact checks, banner and SUMMARY (F3); header arrays compared with the mollifier file (F5); '
      + 'lane headers exact, nothing after TIMING (F6); replay logs with command lines pinned (F7); ydini one RESULT, no FAIL, EXIT=0, '
      + 'LEG D Euler{2,3} (F8); epscap [FAIL] scan (F9); optional --rerun-tail rebuild (F10); window freeze checked as x_690988 < X (F12); '
      + 'import failure exits 2 (F13). F4 (flipped rounding direction inside a verifier) is not detectable by the gate; source review only.',
    'Native-binding referee: "(H1) cannot be dropped" was wrong — complex weights give conj(A_{N,n}) with the same modulus, so only (H3) '
      + 'is necessary; the (C6) run_all.sh argument was wrong (GATE 4 passes no path) and is restated on hash evidence; leg D coverage by '
      + 'the sealed note stated via diff (MAXD, mtype range, mtype 7 branch only); the producer-vs-independent comparison added (note §5D).',
    'ε_cap leg D literal raised 9.2129e-8 → 9.21291e-8 (was 1.7e-14 below the C Arb hull-ball bound); gate legD literal 9.816715e-3.',
  ],
  remainingItems: [
    { id: 'tail-verifier-rebuild', status: 'done', evidence: 'tmp/lambda01758/verify_tail_genmoll_01758354.c + run_tail.sh; 38/38 PASS at 256 and 512 bit, exit 0, ~0.4 s, ≤55 MB; enclosures bit-identical to the old binary; F3 mutations (ytop, ylo, t0, target) FAIL' },
    { id: 'assembly-gate', status: 'done', evidence: 'scripts/lambda-01758354-gate.mjs PASS (all checks, 16 pinned inputs, ~3 s); negative tests exit 1/2; referee items F1–F3, F5–F13 applied' },
    { id: 'binding-row-replays-with-command-lines', status: 'done', evidence: 'tmp/lambda01758/replay_{A1,A2,D}.log: fresh -DTRIANGLE_WEIGHT build of producer 561d59bf…, command line, mollifier sha a05f16ef…, rows equal the lane logs bit-for-bit (gate-checked)' },
    { id: 'page-wording', status: 'done', evidence: 'src/pages/LambdaCandidate01758354Page.jsx + animations-index four-gate-lambda entry: endpoint-cap bound; containment; N* is the finite/tail cutoff (X unchanged); only the y-transfer reduction and Lemma B3 are Lean-checked' },
    { id: 'native-binding-general-weights', status: 'done', evidence: 'formalization/paper/native-binding-general-weights.md + verify_native_binding_general_weights.py 41/41 PASS; referee corrections applied; producer-vs-independent comparison in native-binding-refcheck/' },
    { id: 'page-status-and-sibling-wording', status: 'open', evidence: 'page Status paragraph still says the composition audit is outstanding; "reduction Lean-checked" remains in lambda-roadmap, rh-landscape-dag, lambda-historical-timeline, imp-95201 campaign, tlb-arb-lege, state-of-program-truths, research-threads; four-gate-lambda.mp4 has the old wording' },
    { id: 'run-all-ydini-path', status: 'open', evidence: 'package run_all.sh GATE 4 runs ydini with no mollifier path; fix "$BIN/ydini" 256 "$MOLL" requires re-sealing SHA256SUMS' },
    { id: 'gate-portability', status: 'open', evidence: 'gate inputs live under untracked tmp/ (*.log gitignored); gate runs only on this machine until the inputs are packaged' },
    { id: 'human-sign-off', status: 'open', evidence: 'y-transfer Theorems B/C and Lemmas B1–B4; inherited barrier residuals (B_t ≠ 0 on R; t → 0 limit); native-binding note' },
    { id: 'external-review', status: 'open', evidence: 'no external referee has reviewed the candidate; unpublished' },
  ],
  gateScript: {
    path: 'scripts/lambda-01758354-gate.mjs',
    command: 'node scripts/lambda-01758354-gate.mjs --verbose --rerun-tail',
    pinnedInputs: 16,
    checks: '22/22 (23/23 with --rerun-tail)',
    result: 'PASS',
    gateLowerBound: 1.622504081e-3,
    legD: 9.816715929e-3,
    epsCapLaneUpper: 2.668232e-7,
    BmaxUpper: 2.495763545e-4,
    wallSeconds: 3,
  },
  tiers: {
    proved: ['exact identity t0 + y0²/2 = 879177/5000000', 'barrier containment', 'height surplus 350479773/2 > 0', 'window-freeze monotonicity argument is parameter-free'],
    certified: ['ε_cap ≤ 2.668232e-7', 'tail D ≤ 880148631881/10^12 (parameter-locked verifier, 256/512 bit)', 'lane minima + bit-identical binding-row replays', 'B ≤ 2.495763535e-4', 'gate 1.622504e-3 > 0 (fail-closed gate script)', 'window-freeze margins'],
    conditional: ['Polymath15 Thms 1.2/1.3, Prop 6.6', 'Platt–Trudgian height', 'inherited barrier analytic residuals', 'y-transfer Thms B/C sign-off', 'native-binding note sign-off'],
    measured: ['B run-to-run difference 5.415e-9 (summation order)', 'near-zero-slack boxes (ratio diagnostics 1.00000000745 / 0.9999999539)'],
    heuristic: [],
  },
  nextStep:
    'Human sign-off on y-transfer Theorems B/C, the inherited barrier residuals and the native-binding note; apply the run_all.sh GATE 4 '
    + 'mollifier-path fix and re-seal the package; package the gate inputs so the gate runs off this machine; fix the page Status paragraph '
    + 'and sibling "reduction Lean-checked" phrasing; then external referee review.',
  scripts: [
    'tmp/dag3-audit01758-epscap.py', 'tmp/dag3-audit01758-tail-runs.sh', 'tmp/dag3-audit01758-gensweep_tri',
    'tmp/dag3-audit01758-legD-row.log', 'tmp/dag3-audit01758-ref1-A1row.log', 'tmp/dag3-audit01758-ref1-A2row.log',
    'tmp/dag3-audit01758-ref0-epscap.py', 'tmp/dag3-audit01758-ref1-epscheck.py',
    'tmp/lambda01758/run_tail.sh', 'tmp/lambda01758/replay_binding_rows.sh', 'scripts/lambda-01758354-gate.mjs',
    'formalization/paper/verify_native_binding_general_weights.py',
  ],
});

const M = DAG3_AUDIT01758;

export const DAG3_AUDIT01758_ASSERTIONS = Object.freeze([
  {
    id: 'audit01758-exact-target-identity',
    holds: () => eq(add(T0, R(Y02[0], 2n * Y02[1])), TARGET) && Math.abs(879177 / 5000000 - 0.1758354) < 1e-15
      && lt(add(Y02, mul(R(2n), T0)), R(1n)) && lt(R(0n), T0) && le(T0, R(1n, 2n)),
    why: 't0 + y0²/2 = 1583/10000 + 87677/5000000 = 879177/5000000 exactly (y0² = 87677/2500000); y0² + 2t0 < 1.',
  },
  {
    id: 'audit01758-lane-y2-equals-y0sq',
    holds: () => eq(R(350708n, 10000000n), Y02) && eq(R(15830n, 100000n), T0),
    why: 'Sweep invocation y2 = 350708/10^7 and t = 15830/100000 equal (y0², t0) exactly.',
  },
  {
    id: 'audit01758-barrier-containment',
    holds: () => le(T0, R(129n, 800n)) && lt(mul(R(1809n, 10000n), R(1809n, 10000n)), Y02) && lt(add(Y02, mul(R(2n), T0)), R(1n)),
    why: 'Region needed at t0 lies inside the sealed box [X,X+1]×[0.1809,1]×[0,129/800] by containment; no t-monotonicity used.',
  },
  {
    id: 'audit01758-yhull-covers',
    holds: () => {
      const top = R(8266802n, 10000000n), bot = R(1872719n, 10000000n);
      return le(sub(R(1n), mul(R(2n), T0)), mul(top, top)) && le(mul(bot, bot), Y02);
    },
    why: 'y-hull [1872719, 8266802]/10^7 contains [y0, √(1−2t0)] (checked on squares, exact).',
  },
  {
    id: 'audit01758-height-surplus',
    holds: () => eq(sub(R(T_PT), R(X_HEIGHT, 2n)), R(350479773n, 2n)),
    why: 'T_PT − X/2 = 350479773/2 > 0 with X = 6000000185827 and T_PT = 3000175332800.',
  },
  {
    id: 'audit01758-window-count-contiguous',
    holds: () => {
      const L = M.parameters.lane; const legs = L.legs;
      const contiguous = legs.every((l, i) => i === 0 ? l[1] === L.nLo : l[1] === legs[i - 1][2] + 1) && legs[legs.length - 1][2] === L.nHi;
      return contiguous && L.nHi - L.nLo + 1 === M.numbers.windows && legs[0][2] - legs[0][1] + 1 === 309013;
    },
    why: 'Legs A1/A2/D tile 690988..6000000 contiguously: 5,309,013 windows (A1 309,013).',
  },
  {
    id: 'audit01758-epscap-sum-rounded-up',
    holds: () => {
      const n = M.numbers;
      return n.eC0HullBall + n.eAB <= n.epsCapLane && n.epsCapLane - (n.eC0HullBall + n.eAB) < 1e-12
        && n.eC0Subdivided <= n.eC0HullBall && n.eC0RefereeIv.every((v) => v <= n.eC0HullBall)
        && n.eABReferee <= n.eAB && n.epsCapLegD < n.epsCapLane && n.epsCapLane < n.epsCapPlaceholderOld;
    },
    why: 'ε_cap = e_C0 (largest of three enclosures) + e_A+e_B, rounded up to 2.668232e-7; below the old 1.1e-6 placeholder.',
  },
  {
    id: 'audit01758-tightened-gate-positive',
    holds: () => {
      const n = M.numbers;
      const legA = n.L12min.A1 - n.B.used - n.epsCapLane;
      const legD = n.L12min.D - n.B.used - n.epsCapLegD;
      const old = n.L12min.A1 - n.B.used - 1e-6;
      return Math.abs(legA - n.gate.legA) < 1e-9 && Math.abs(legD - n.gate.legD) < 1e-7 && Math.abs(old - n.gate.withOldPlaceholder) < 1e-9
        && legA > 0 && legD > 0 && n.B.used >= Math.max(n.B.run20260802, n.B.run20260922)
        && legA / n.epsCapLane > 6000 && legA / n.epsCapLane < 6200;
    },
    why: 'L12_min − B_max − ε_cap = 1.622504e-3 > 0 (leg D 9.8167e-3), ≈ 6080 × ε_cap; uses the larger full-run B.',
  },
  {
    id: 'audit01758-binding-rows-replayed',
    holds: () => {
      const r = M.numbers.bindingRowReplay, m = M.numbers.L12min;
      return r.A1[0] === m.A1 && r.A2[0] === m.A2 && r.D[0] === m.D && r.cpuSeconds.A1 < 600;
    },
    why: 'Fresh TRIANGLE build reproduces the minimum row of each shard bit-identically (referee correction: A1 replay done, 482 s).',
  },
  {
    id: 'audit01758-tail-contraction',
    holds: () => {
      const t = M.numbers.tail;
      return t.D6e6 < 1 && t.D384e6 > 1 && t.D5e6 < 1 && t.D6e6 < t.D5e6 && t.flow > t.error && t.flow - t.error > 0.07;
    },
    why: 'Tail: D(3.84e6) = 1.129 fails, D(5e6) = 0.976, D(6e6) = 0.880 < 1; flow 0.0723 ≫ error 6.2e-9.',
  },
  {
    id: 'audit01758-tail-log-summary-bounds',
    holds: () => {
      const t = M.numbers.tailLog, s = t.summary;
      const fr = (x) => { const [a, b] = x.split('/'); return R(BigInt(a), BigInt(b)); };
      const dc = (x) => { // exact decimal -> rational
        const m = /^(\d+)(?:\.(\d*))?(?:e([+-]?\d+))?$/.exec(x); const f = m[2] || ''; const e = Number(m[3] || 0) - f.length;
        const n = BigInt(m[1] + f); return e >= 0 ? R(n * 10n ** BigInt(e)) : R(n, 10n ** BigInt(-e));
      };
      const hi = (b) => add(dc(b[0]), dc(b[1])), lo = (b) => sub(dc(b[0]), dc(b[1]));
      const D = fr(s.D_ub), F = fr(s.flow_lb), E = fr(s.err_ub);
      return lt(D, R(1n)) && le(hi(t.balls.D), D) && le(F, lo(t.balls.flow)) && le(hi(t.balls.err), E)
        && le(hi(t.balls.eC0), fr(s.eC0_ub)) && le(hi(t.balls.eAB), fr(s.eAB_ub)) && lt(E, F)
        && lt(hi(t.balls.err), lo(t.balls.flow)) && lt(R(0n), E)
        && M.numbers.tail.D6e6 === Number(D[0]) / Number(D[1]) && M.numbers.tail.flow === Number(F[0]) / Number(F[1])
        && M.numbers.tail.error === 6161460033 / 1e18 && t.checks === 38 && t.failures === 0 && t.N1 === M.parameters.lane.nHi
        && t.nlam === 287 && t.precisions.join() === '256,512';
    },
    why: 'Tail SUMMARY rationals bound the printed Arb balls: D ≤ 880148631881/10^12 < 1, flow ≥ 72339895395/10^12 > err ≤ 6161460033/10^18; '
      + 'baked D6e6/flow/error equal those rationals (upper/lower/upper), N1 = lane top, 38 checks, 0 failures at 256 and 512 bit.',
  },
  {
    id: 'audit01758-epscap-legD-covers-c-hull-ball',
    holds: () => {
      const n = M.numbers; const cBall = 9.2129017e-8; const pyFlint = 9.2128898605e-8;
      return n.epsCapLegD >= cBall && n.epsCapLegD >= pyFlint && n.epsCapLegD - cBall < 1e-13
        && Math.abs((n.L12min.D - n.B.used - n.epsCapLegD) - n.gate.legD) < 1e-9 && n.gate.legD <= n.L12min.D - n.B.used - n.epsCapLegD;
    },
    why: 'ε_cap(leg D) = 9.21291e-8 ≥ C Arb hull-ball e_C0(1300001) + e_AB = 9.2129017e-8 (referee F11); gate legD 9.816715e-3 is a lower bound.',
  },
  {
    id: 'audit01758-remaining-items-recorded',
    holds: () => {
      const it = M.remainingItems; const ids = new Set(it.map((x) => x.id));
      const open = it.filter((x) => x.status === 'open').map((x) => x.id);
      return it.every((x) => (x.status === 'done' || x.status === 'open') && x.evidence.length > 20) && ids.size === it.length
        && ['tail-verifier-rebuild', 'assembly-gate', 'binding-row-replays-with-command-lines', 'page-wording', 'native-binding-general-weights']
          .every((k) => it.find((x) => x.id === k)?.status === 'done')
        && open.includes('external-review') && open.includes('human-sign-off')
        && M.gateScript.result === 'PASS' && M.gateScript.gateLowerBound > 0 && M.gateScript.gateLowerBound >= M.numbers.gate.legA;
    },
    why: 'Packaging items (tail verifier, assembly gate, replays, page wording, native-binding note) are done; human sign-off and external review stay open.',
  },
  {
    id: 'audit01758-window-freeze-shift',
    holds: () => {
      const w = M.numbers.windowFreeze; const shift = 4 * Math.PI * w.deltaT / 16;
      return Math.abs((w.sealedRow[0] - w.t0[0]) - shift) < 2e-4 && Math.abs((w.t0[1] - w.sealedRow[1]) - shift) < 2e-4 && w.t0.every((x) => x > 0);
    },
    why: 'Window-freeze margins at t0 equal the sealed-row margins shifted by 4π·Δt/16 ≈ 0.00232 (Δt = 0.00295).',
  },
  {
    id: 'audit01758-honest-scope',
    holds: () => /PT Lambda <= 0\.2 stands/.test(M.verdict) && /NO QED/.test(M.verdict) && /NO QED/.test(M.status)
      && /unreviewed/.test(M.status) && /Not yet internal-rigorous/.test(M.status) && M.tiers.heuristic.length === 0,
    why: 'Grade stays computer-assisted candidate; no publication or acceptance implied.',
  },
]);

export default DAG3_AUDIT01758;
