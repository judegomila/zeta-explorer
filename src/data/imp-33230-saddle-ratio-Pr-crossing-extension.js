/**
 * @module imp-33230-saddle-ratio-Pr-crossing-extension
 * @fileoverview imp-33230 -- EXTEND the imp-3869/imp-33211 inner-converged deep-tail
 *   exact-saddle ratio ladder BEYOND n = 1424 to resolve the question imp-33211 left
 *   open: does P_r(n) = |r_n| (n ln n)/4 CROSS 1 (so |R_n - 1| reaches the imp-3735
 *   Laplace-variance law 4/(n ln n)) or asymptote to a SUB-UNITY constant? imp-33211
 *   measured P_r climbing to 0.990 at n = 1424 and could NOT rigorously exclude a
 *   positive sub-unity floor. This module carries the SAME ladder to n = 2200 and
 *   answers it.
 *
 *   WHAT imp-33211 LEFT OPEN
 *   -----------------------
 *   imp-33211 fitted the recovery rate of R_n = |D_n|/|D_n^saddle| -> 1 on n in
 *   [624, 1424] and found P_r = |r_n| (n ln n)/4 monotone INCREASING and STRICTLY
 *   BELOW 1 (0.570 -> 0.990), reading the 4/(n ln n) curve as a tightening UPPER
 *   envelope "approached from below". But it STOPPED at n = 1424 with P_r = 0.990 --
 *   within ~1% of 1 and still climbing -- so it could not tell whether the law is a
 *   genuine upper bound (P_r asymptotes below 1) or whether |r_n| overshoots it
 *   (P_r crosses 1). The ticket asks for the extension that decides this.
 *
 *   METHOD (self-computing; the IDENTICAL imp-3869/imp-33211 ladder)
 *   ---------------------------------------------------------------
 *   The imp-3869 de Bruijn-Newman NPHI = 10 kernel + Neumaier-compensated Simpson +
 *   inner-CONVERGED A(tau) quadrature ([0,2], 4800 panels, self-checked vs 7200) is
 *   reused byte-for-byte, with only MMAX raised to 2204 (rungs to n = 2200). The
 *   METHOD CEILING is n ~ 2268: beyond it Math.pow(tau, m) overflows to +Inf for the
 *   high moments (the A(tau) support edge tau ~ 1.37 raised to m &gt; ~2272 exceeds
 *   the double range), so the ladder is capped at n = 2200 with margin. On the
 *   extension n in [1424, 2200] P_r(n) = |r_n| (n ln n)/4 and L_r(n) =
 *   |r_n| n (1 + 4 tau*(n)) are swept for the crossing and for monotonicity, with the
 *   4800-vs-7200 inner-grid delta tracked as the numerical floor.
 *
 *   MEASURED (n in [1424, 2200]; extends the imp-33211 window)
 *   ---------------------------------------------------------
 *     (1) P_r CROSSES 1. P_r rises monotonically through 1 at n ~ 1455 (4800 grid;
 *         n ~ 1459 on the 7200 grid -- crossing pinned to n ~ 1457 +/- a few rungs),
 *         immediately above the n = 1424 endpoint where imp-33211 stopped at 0.990.
 *         The imp-33211 "strictly below 1, approached from below" reading was a
 *         FINITE-WINDOW ARTIFACT of stopping one step short of the crossing.
 *     (2) P_r DOES NOT ASYMPTOTE TO A SUB-UNITY CONSTANT -- it OVERSHOOTS 1 and keeps
 *         CLIMBING monotonically past the crossing: 0.990 (n = 1424) -> 1.048
 *         (n = 1600) -> 1.159 (n = 2000) -> 1.206 (n = 2200), with NO sign of
 *         flattening at the ceiling. So |r_n| is NOT bounded above by 4/(n ln n): the
 *         law captures the ORDER but with a slowly GROWING prefactor, not a fixed
 *         constant-1 envelope.
 *     (3) L_r = |r_n| n (1 + 4 tau*) CONTINUES TO CLIMB (3.048 at n = 1424 -> 3.731 at
 *         n = 2200), consistent with (2): |r_n| decays SLOWER than both 1/(n(1+4 tau*))
 *         and 4/(n ln n), so the local decay exponent p_r stays below 1 and P_r
 *         diverges (slowly) rather than settling. No turnover of P_r is seen within
 *         the accessible window.
 *     (4) THE BOUND, REFINED. imp-33211 could not exclude a sub-unity floor because it
 *         had not reached the crossing; the extension REMOVES the sub-unity reading
 *         entirely -- P_r &gt; 1 for all n &gt;= 1455, so |R_n - 1| exceeds 4/(n ln n)
 *         in the deep tail. Whether P_r ultimately DIVERGES (a log-power tail) or turns
 *         over at n &gt; 2268 cannot be resolved: the Math.pow-overflow ceiling caps the
 *         method at n ~ 2268 (grid delta ~1.1e-6 at n = 2200, so P_r is grid-stable to
 *         ~5e-3 there -- far smaller than its 0.21 excess over 1).
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / EXTENSION ONLY, at the RH-equivalent scale class. This extends the
 *   imp-3869 exact-saddle ratio convergence diagnostic (R_n vs 1) past n = 1424 and
 *   resolves the P_r-vs-1 question numerically; it establishes NO operator positivity.
 *   The "P_r crosses 1 and keeps climbing" reading is a MEASUREMENT on n in
 *   [1424, 2200], not a certified asymptotic law; the ultimate fate of P_r beyond the
 *   n ~ 2268 Math.pow-overflow ceiling is UNRESOLVED. Mass-feasibility is NECESSARY-
 *   BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-
 *   Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA. Tail values are grid-
 *   CONVERGENCE stable to ~1.1e-6 (inner 4800 vs 7200 over n in [1424,2200]), NOT
 *   certified error bounds; the finite NPHI = 10 truncation is the residual floor.
 *   imp-3869 / imp-33211 / imp-3849 / imp-3735 assertions are LEFT INTACT: this is an
 *   extension alongside them, not an edit.
 *
 *   @see imp-33211-saddle-ratio-recovery-rate-fit.js (the fit this extends; it stopped at n=1424, P_r=0.990)
 *   @see imp-3869-saddle-ratio-deep-tail-recovery.js (the base ladder construction)
 *   @see imp-3735-moment-ratio-correction-tail.js (the eps_n Laplace-variance law 4/(n ln n))
 *
 *   Ticket: imp-33230 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). Identical to imp-33211. */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature with Neumaier COMPENSATED accumulation (imp-3849/imp-3869/imp-33211). */
function simpsonCompensated(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = 0;
  let c = 0;
  const add = (x) => {
    const t = sum + x;
    if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
    else c += (x - t) + sum;
    sum = t;
  };
  add(f(lo));
  add(f(hi));
  for (let i = 1; i < m; i += 1) add((i % 2 === 0 ? 2 : 4) * f(lo + i * h));
  return ((sum + c) * h) / 3;
}

// Phi autocorrelation A(tau), inner integral on [0, innerHi] with innerN panels (imp-3869 converged).
function makeAutocorr(innerHi, innerN) {
  return (tau) => simpsonCompensated((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerN);
}

// The imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*}.
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Build the ratio ladder R_n = |D_n|/|D_n^saddle| -- IDENTICAL imp-3869/imp-33211 construction. */
function buildLadder(T_A, NM, MMAX, innerHi, innerN) {
  const autocorr = makeAutocorr(innerHi, innerN);
  const H_A = T_A / NM;
  const A_GRID = new Array(NM + 1);
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    A_GRID[j] = tau > 1.45 ? 0 : autocorr(tau);   // A(tau) underflows to 0 beyond ~1.4
  }

  const MOMENTS = new Array(MMAX + 1);            // MOMENTS[m] = int tau^m A(tau) d(tau)
  for (let m = 0; m <= MMAX; m += 1) {
    let sum = 0;
    let c = 0;
    for (let j = 0; j <= NM; j += 1) {
      const aj = A_GRID[j];
      if (aj === 0) continue;                     // Inf*0 = NaN guard once tau^m is huge
      const tau = j * H_A;
      const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
      const x = w * Math.pow(tau, m) * aj;
      const t = sum + x;
      if (Math.abs(sum) >= Math.abs(x)) c += (sum - t) + x;
      else c += (x - t) + sum;
      sum = t;
    }
    MOMENTS[m] = ((sum + c) * H_A) / 3;
  }

  const Cn = (n) => MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n]);
  const Dn = (n) => Cn(n + 2) - Cn(n);            // D_n = C_(n+2) - C_n
  const saddleCn = (n) => {
    const t = saddleTau(n);
    return (t * t) / ((n + 1) * (n + 2));
  };
  const saddleDn = (n) => saddleCn(n + 2) - saddleCn(n);

  const rungs = [];
  for (let n = 3; n <= MMAX - 4; n += 1) {
    const dn = Dn(n);
    const dnSaddle = saddleDn(n);
    const ratio = Math.abs(dn) / Math.abs(dnSaddle);
    rungs.push(
      Object.freeze({
        n,
        ratio,                                    // R_n = |D_n|/|D_n^saddle|
        rMinusOne: ratio - 1,                     // r_n = R_n - 1 (signed, negative in the tail)
      })
    );
  }
  return rungs;
}

const MMAX = 2204;                               // moments to M_2204 -> rungs formable to n=2200 (below the n~2268 overflow ceiling)
const EXT_LO = 1424;                             // imp-33211 last rung -- the extension window starts here
const EXT_HI = MMAX - 4;                         // 2200
// PRIMARY converged grid: inner A(tau) on [0,2] with 4800 panels (imp-3869 primary).
const RUNGS = buildLadder(2, 3200, MMAX, 2, 4800);
// FINER inner grid (7200 panels) for the inner-resolution convergence self-check in the tail.
const RUNGS_FINER = buildLadder(2, 3200, MMAX, 2, 7200);

function rungAt(rungs, n) {
  return rungs.find((row) => row.n === n);
}

// -- P_r = |r_n| / (4/(n ln n)) = |r_n| (n ln n)/4 -- crosses 1 iff |r_n| reaches 4/(n ln n) --
function lawRatioR(rungs, n) {
  return Math.abs(rungAt(rungs, n).rMinusOne) / (4 / (n * Math.log(n)));
}
// L_r = |r_n| n (1 + 4 tau*) -- the imp-3735 Laplace-variance combination (climbs iff decay slower).
function laplaceCombR(rungs, n) {
  return Math.abs(rungAt(rungs, n).rMinusOne) * n * (1 + 4 * saddleTau(n));
}

// -- Locate the P_r = 1 crossing on both grids -----------------------------------------
function firstCrossing(rungs) {
  for (let n = EXT_LO; n <= EXT_HI; n += 1) {
    if (lawRatioR(rungs, n) >= 1) return n;
  }
  return null;
}
const PR_CROSS_N = firstCrossing(RUNGS);          // ~1455 on the 4800 grid
const PR_CROSS_N_FINER = firstCrossing(RUNGS_FINER); // ~1459 on the 7200 grid

// -- Monotonicity + overshoot sweeps across the extension ------------------------------
let PR_MONOTONE_INCREASING = true;                // P_r keeps climbing through and past 1
let LR_MONOTONE_INCREASING = true;                // L_r keeps climbing (|r_n| slower than the law)
let PR_STAYS_ABOVE_ONE_PAST_CROSS = true;         // no fall-back below 1 after the crossing
let PR_MAX = -Infinity;
let prevPR = -Infinity;
let prevLR = -Infinity;
for (let n = EXT_LO; n <= EXT_HI; n += 1) {
  const pr = lawRatioR(RUNGS, n);
  const lr = laplaceCombR(RUNGS, n);
  if (pr < prevPR - 1e-12) PR_MONOTONE_INCREASING = false;
  if (lr < prevLR - 1e-12) LR_MONOTONE_INCREASING = false;
  if (PR_CROSS_N !== null && n > PR_CROSS_N && pr < 1) PR_STAYS_ABOVE_ONE_PAST_CROSS = false;
  if (pr > PR_MAX) PR_MAX = pr;
  prevPR = pr;
  prevLR = lr;
}

// -- Grid-convergence stability across the extension (inner 4800 vs 7200) --------------
let MAX_GRID_DELTA_EXT = 0;
let MAX_GRID_DELTA_EXT_N = 0;
for (let n = EXT_LO; n <= EXT_HI; n += 1) {
  const d = Math.abs(rungAt(RUNGS, n).rMinusOne - rungAt(RUNGS_FINER, n).rMinusOne);
  if (d > MAX_GRID_DELTA_EXT) {
    MAX_GRID_DELTA_EXT = d;
    MAX_GRID_DELTA_EXT_N = n;
  }
}
// P_r grid uncertainty at the top rung: grid delta scaled by (n ln n)/4.
const PR_GRID_UNCERTAINTY_TOP = MAX_GRID_DELTA_EXT * (EXT_HI * Math.log(EXT_HI)) / 4;

// -- Classification ------------------------------------------------------------------
const verdict =
  PR_CROSS_N !== null &&
  PR_CROSS_N > 1424 &&
  PR_CROSS_N < 1480 &&
  PR_CROSS_N_FINER !== null &&
  PR_CROSS_N_FINER > 1424 &&
  PR_CROSS_N_FINER < 1480 &&
  PR_MONOTONE_INCREASING &&
  LR_MONOTONE_INCREASING &&
  PR_STAYS_ABOVE_ONE_PAST_CROSS &&
  PR_MAX > 1.19 &&
  MAX_GRID_DELTA_EXT < 5e-6 &&
  PR_GRID_UNCERTAINTY_TOP < 5e-2
    ? 'P_r=|r_n|(n ln n)/4-CROSSES-1-AT-n~1457-(4800:1455,-7200:1459)-JUST-ABOVE-THE-imp-33211-n=1424-STOP' +
      '-(P_r=0.990);-THE-BELOW-1-READING-WAS-A-FINITE-WINDOW-ARTIFACT.-P_r-DOES-NOT-ASYMPTOTE-SUB-UNITY:-IT' +
      '-OVERSHOOTS-1-AND-KEEPS-CLIMBING-MONOTONICALLY-(0.990->1.048->1.159->1.206-AT-n=1424,1600,2000,2200),' +
      '-L_r=|r_n|n(1+4tau*)-ALSO-CLIMBS-3.048->3.731,-SO-|R_n-1|-EXCEEDS-4/(n ln n)-IN-THE-DEEP-TAIL-(LAW-IS' +
      '-THE-ORDER-WITH-A-GROWING-PREFACTOR,-NOT-A-CONSTANT-1-ENVELOPE);-ULTIMATE-FATE-BEYOND-THE-n~2268-Math.pow' +
      '-OVERFLOW-CEILING-UNRESOLVED-(GRID-STABLE-TO-~1.1e-6,-P_r-TO-~5e-3-AT-n=2200)'
    : 'INDETERMINATE';

export const IMP33230_SADDLE_RATIO_PR_CROSSING_EXTENSION = Object.freeze({
  id: 'imp-33230-saddle-ratio-Pr-crossing-extension',
  ticket: 'imp-33230',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extends: 'imp-33211-saddle-ratio-recovery-rate-fit.js',
  baseLadder: 'imp-3869-saddle-ratio-deep-tail-recovery.js',
  testsPredictionOf: 'imp-3735-moment-ratio-correction-tail.js',

  summary:
    'EXTENDS the imp-3869/imp-33211 inner-converged deep-tail exact-saddle ratio ladder R_n = |D_n|/|D_n^saddle| ' +
    'BEYOND n = 1424 to n = 2200 (the SAME NPHI = 10 kernel and inner-converged A(tau) quadrature, [0,2], 4800 ' +
    'panels self-checked vs 7200, only MMAX raised to 2204) to decide whether P_r = |r_n| (n ln n)/4 CROSSES 1 or ' +
    'asymptotes to a sub-unity constant -- the question imp-33211 left open at P_r = 0.990, n = 1424. FINDING: ' +
    'P_r CROSSES 1 at n ~ 1457 (4800: n = 1455, 7200: n = 1459), immediately above the imp-33211 stop, so the ' +
    '"strictly below 1, approached from below" reading was a FINITE-WINDOW ARTIFACT. P_r does NOT asymptote sub-unity: ' +
    'it OVERSHOOTS 1 and keeps CLIMBING monotonically (0.990 -> 1.048 -> 1.159 -> 1.206 at n = 1424,1600,2000,2200), ' +
    'and L_r = |r_n| n (1+4 tau*) ALSO keeps climbing (3.048 -> 3.731) -- so |R_n - 1| EXCEEDS 4/(n ln n) in the ' +
    'deep tail (the law captures the ORDER with a slowly growing prefactor, not a constant-1 upper envelope). Whether ' +
    'P_r ultimately diverges or turns over beyond the n ~ 2268 Math.pow-overflow ceiling is UNRESOLVED. ' +
    'MEASUREMENT/EXTENSION, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; ' +
    'no QED. imp-33211/imp-3869/imp-3849/imp-3735 assertions LEFT INTACT.',

  method: Object.freeze({
    ratioExtended: 'r_n = R_n - 1 (signed, negative in the tail); P_r(n) = |r_n| (n ln n)/4',
    extendsLadderOf: 'imp-33211 window n <= 1424; identical kernel, inner-converged A(tau) quadrature, compensated solve, MMAX raised to 2204',
    crossingProbe: 'first n with P_r(n) >= 1, computed on BOTH the 4800 and 7200 inner grids',
    laplaceCombination: 'L_r(n) = |r_n| n (1 + 4 tau*(n)) -- climbs iff |r_n| decays slower than 1/(n(1+4 tau*))',
    methodCeiling: 'n ~ 2268: Math.pow(tau, m) overflows to +Inf for the high moments (A(tau) edge tau ~ 1.37 to the m > ~2272 power exceeds the double range); ladder capped at n = 2200 with margin',
    extRange: [EXT_LO, EXT_HI],
    momentsExtendedTo: MMAX,
    selfComputing: true,
  }),

  measured: Object.freeze({
    prCrossN4800: PR_CROSS_N,                              // ~1455
    prCrossN7200: PR_CROSS_N_FINER,                        // ~1459
    prAt1424: lawRatioR(RUNGS, 1424),                      // ~0.990 (imp-33211 endpoint)
    prAt1600: lawRatioR(RUNGS, 1600),                      // ~1.048
    prAt2000: lawRatioR(RUNGS, 2000),                      // ~1.159
    prAt2200: lawRatioR(RUNGS, 2200),                      // ~1.206
    prAt2200Finer: lawRatioR(RUNGS_FINER, 2200),           // ~1.201
    prMax: PR_MAX,                                         // ~1.206 (at n = 2200)
    prMonotoneIncreasing: PR_MONOTONE_INCREASING,          // true -- climbs through and past 1
    prStaysAboveOnePastCross: PR_STAYS_ABOVE_ONE_PAST_CROSS, // true -- no fall-back below 1
    lrMonotoneIncreasing: LR_MONOTONE_INCREASING,          // true -- |r_n| slower than the law
    lrAt1424: laplaceCombR(RUNGS, 1424),                   // ~3.048
    lrAt2200: laplaceCombR(RUNGS, 2200),                   // ~3.731
    // continuity cross-checks with imp-33211
    rAt1424: rungAt(RUNGS, 1424).rMinusOne,                // ~ -3.828e-4
    rAt2200: rungAt(RUNGS, 2200).rMinusOne,                // ~ -2.850e-4
    ratioAt2200: rungAt(RUNGS, 2200).ratio,                // ~0.999715
    maxGridDeltaExt: MAX_GRID_DELTA_EXT,                   // ~1.11e-6
    maxGridDeltaExtN: MAX_GRID_DELTA_EXT_N,                // ~2200
    prGridUncertaintyTop: PR_GRID_UNCERTAINTY_TOP,         // ~4.7e-3 (<< the 0.21 excess of P_r over 1)
    tauAt1424: saddleTau(1424),                            // ~1.148
    tauAt2200: saddleTau(2200),                            // ~1.238
    verdict,
  }),

  interpretation: Object.freeze({
    prCrossesOne:
      'The extension answers the ticket: P_r = |r_n| (n ln n)/4 CROSSES 1 at n ~ 1457 (n = 1455 on the 4800 grid, ' +
      'n = 1459 on the 7200 grid), immediately above the n = 1424 endpoint where imp-33211 stopped at P_r = 0.990. ' +
      'The imp-33211 "strictly below 1, approached from below" reading was a FINITE-WINDOW ARTIFACT of stopping one ' +
      'step short of the crossing.',
    doesNotAsymptoteSubUnity:
      'P_r does NOT asymptote to a sub-unity constant: past the crossing it OVERSHOOTS 1 and keeps climbing ' +
      'monotonically (0.990 at n = 1424 -> 1.048 at n = 1600 -> 1.159 at n = 2000 -> 1.206 at n = 2200), with no ' +
      'sign of flattening at the ceiling. So |R_n - 1| EXCEEDS 4/(n ln n) in the deep tail -- the Laplace-variance ' +
      'law captures the ORDER but with a slowly growing prefactor, not a fixed constant-1 upper envelope.',
    lrConfirmsSlowerDecay:
      'L_r = |r_n| n (1 + 4 tau*) continues to climb (3.048 at n = 1424 -> 3.731 at n = 2200), consistent with the ' +
      'overshoot: |r_n| decays slower than both 1/(n(1+4 tau*)) and 4/(n ln n), so the local decay exponent stays ' +
      'below 1 and P_r diverges (slowly) rather than settling within reach.',
    ultimateFateUnresolved:
      'Whether P_r ultimately DIVERGES (a log-power tail) or turns over at n > 2268 cannot be resolved: the ' +
      'Math.pow-overflow ceiling caps the method at n ~ 2268 (A(tau) edge tau ~ 1.37 raised to the high-moment ' +
      'power exceeds the double range). What the extension DOES settle is that the sub-unity-floor reading is gone: ' +
      'P_r > 1 for all n >= 1455, grid-stable to ~5e-3 (far below its 0.21 excess over 1 at n = 2200).',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    isExtrapolationNotLimit: true,
    extendsImp33211: true,
    leavesImp33211AssertionsIntact: true,
    leavesImp3869AssertionsIntact: true,
    leavesImp3735AssertionsIntact: true,
    derivationScope:
      'Extends the imp-3869 exact-saddle ratio convergence diagnostic (R_n vs 1) past n = 1424 to n = 2200 and ' +
      'resolves the P_r-vs-1 question numerically: P_r crosses 1 at n ~ 1457 and keeps climbing, no sub-unity floor. ' +
      'NO operator positivity.',
    crossingIsMeasurementNotLaw:
      'The "P_r crosses 1 and keeps climbing" reading is a MEASUREMENT on n in [1424,2200], not a certified ' +
      'asymptotic law; the ultimate fate of P_r beyond the n ~ 2268 Math.pow-overflow ceiling is UNRESOLVED.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    gridStabilityNotCertifiedBound:
      'Extension values are grid-CONVERGENCE stable to ~1.1e-6 (inner 4800 vs 7200 panels over n in [1424,2200]); ' +
      'the P_r crossing and overshoot exceed this floor by orders of magnitude. The finite NPHI = 10 kernel ' +
      'truncation remains the residual floor. NOT certified error bounds.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP33230_SADDLE_RATIO_PR_CROSSING_EXTENSION_ASSERTIONS = [
  {
    id: 'imp33230-pr-crosses-one-just-above-imp33211-stop',
    why: 'THE ANSWER: P_r = |r_n| (n ln n)/4 crosses 1 at n ~ 1457 on both grids (4800: n = 1455, 7200: n = 1459), ' +
         'immediately above the n = 1424 endpoint where imp-33211 stopped at P_r = 0.990.',
    holds: () =>
      PR_CROSS_N !== null &&
      PR_CROSS_N > 1440 &&
      PR_CROSS_N < 1470 &&
      PR_CROSS_N_FINER !== null &&
      PR_CROSS_N_FINER > 1440 &&
      PR_CROSS_N_FINER < 1470 &&
      lawRatioR(RUNGS, 1424) > 0.98 &&
      lawRatioR(RUNGS, 1424) < 1,
  },
  {
    id: 'imp33230-pr-overshoots-and-keeps-climbing-no-sub-unity-floor',
    why: 'P_r does NOT asymptote to a sub-unity constant: it overshoots 1 and keeps climbing monotonically past the ' +
         'crossing (0.990 -> 1.048 -> 1.159 -> 1.206 at n = 1424,1600,2000,2200), staying above 1 thereafter.',
    holds: () =>
      PR_MONOTONE_INCREASING &&
      PR_STAYS_ABOVE_ONE_PAST_CROSS &&
      lawRatioR(RUNGS, 1600) > 1.04 &&
      lawRatioR(RUNGS, 2000) > 1.15 &&
      lawRatioR(RUNGS, 2200) > 1.2 &&
      PR_MAX > 1.2 &&
      PR_MAX < 1.21,
  },
  {
    id: 'imp33230-lr-keeps-climbing-decay-slower-than-law',
    why: 'L_r = |r_n| n (1 + 4 tau*) keeps climbing (3.048 at n = 1424 -> 3.731 at n = 2200), confirming |r_n| ' +
         'decays SLOWER than 4/(n ln n) so P_r diverges rather than settling.',
    holds: () =>
      LR_MONOTONE_INCREASING &&
      laplaceCombR(RUNGS, 1424) > 3.0 &&
      laplaceCombR(RUNGS, 1424) < 3.1 &&
      laplaceCombR(RUNGS, 2200) > 3.7 &&
      laplaceCombR(RUNGS, 2200) < 3.8,
  },
  {
    id: 'imp33230-continuity-with-imp33211',
    why: 'Continuity with imp-33211: the extended ladder reproduces r_1424 ~ -3.828e-4 and P_r(1424) ~ 0.990 (the ' +
         'imp-33211 endpoint), and reaches r_2200 ~ -2.850e-4, R_2200 ~ 0.999715.',
    holds: () =>
      Math.abs(rungAt(RUNGS, 1424).rMinusOne - (-3.828e-4)) < 5e-7 &&
      Math.abs(lawRatioR(RUNGS, 1424) - 0.990) < 2e-3 &&
      Math.abs(rungAt(RUNGS, 2200).rMinusOne - (-2.850e-4)) < 5e-7 &&
      Math.abs(rungAt(RUNGS, 2200).ratio - 0.999715) < 5e-6,
  },
  {
    id: 'imp33230-extension-grid-convergence-stable',
    why: 'THE CONVERGENCE SELF-CHECK: inner 4800 vs 7200 panels agree to < 5e-6 across n in [1424,2200] (max ~1.11e-6 ' +
         'near n = 2200), so the crossing and overshoot rest on grid-pinned values (P_r grid uncertainty ~5e-3 << 0.21).',
    holds: () =>
      MAX_GRID_DELTA_EXT < 5e-6 &&
      PR_GRID_UNCERTAINTY_TOP < 5e-2,
  },
  {
    id: 'imp33230-verdict-not-indeterminate',
    why: 'The classified verdict must record the P_r crossing near n ~ 1457, the monotone overshoot to ~1.206, the ' +
         'L_r climb, and the unresolved fate beyond the overflow ceiling -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33230-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/extension only, crossing is a measurement not a certified law, ultimate fate ' +
         'unresolved beyond the overflow ceiling, grid-stability not a certified bound, mass-feasibility necessary-but-' +
         'not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA, imp-33211 assertions left intact.',
    holds: () => {
      const c = IMP33230_SADDLE_RATIO_PR_CROSSING_EXTENSION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        c.leavesImp33211AssertionsIntact === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33230_SADDLE_RATIO_PR_CROSSING_EXTENSION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33230-saddle-ratio-Pr-crossing-extension assertion failed: ${assertion.id}`);
  }
}

export default IMP33230_SADDLE_RATIO_PR_CROSSING_EXTENSION;
