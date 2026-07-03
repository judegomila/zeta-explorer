/**
 * @module imp-33211-saddle-ratio-recovery-rate-fit
 * @fileoverview imp-33211 -- FIT the asymptotic recovery RATE of the imp-3869
 *   inner-converged deep-tail exact-saddle ratio R_n -> 1 FROM BELOW. imp-3869
 *   extended the imp-3849 ladder R_n = |D_n|/|D_n^saddle| to n = 1424 and found a
 *   slow monotone climb (r_624 = -5.677e-4 -> r_1424 = -3.828e-4) but never fitted
 *   the decay LAW of |r_n| = |R_n - 1|. This module measures that rate on the SAME
 *   extended ladder and tests the imp-3735 prediction that it tracks the Laplace-
 *   variance tail |eps_n| ~ 1/(n(1+4 tau*)) ~ 4/(n ln n), then bounds whether R_n
 *   reaches 1 or asymptotes to a sub-unity floor.
 *
 *   WHAT imp-3869 LEFT OPEN
 *   -----------------------
 *   imp-3869 answered the QUALITATIVE questions (R_n stays below 1, recovers
 *   monotonically, no second sign change, recovery-rate shoulder near n ~ 790, and
 *   r_n/eps_n stays near-constant ~1.29 -> 1.44) but stopped short of FITTING the
 *   decay rate of |r_n| or comparing it quantitatively to the imp-3735 closed-form
 *   Laplace-variance law 4/(n ln n). The ticket asks for that fit and for the
 *   reaches-1-or-floors bound.
 *
 *   METHOD (self-computing; the IDENTICAL imp-3869 ladder)
 *   -----------------------------------------------------
 *   The imp-3869 de Bruijn-Newman NPHI = 10 kernel + Neumaier-compensated Simpson +
 *   inner-CONVERGED A(tau) quadrature ([0,2], 4800 panels, self-checked vs 7200) is
 *   reused byte-for-byte, MMAX = 1428 (rungs to n = 1424). On the tail n in
 *   [624, 1424] three fit combinations are formed at every rung:
 *     L_r(n)   = |r_n| * n * (1 + 4 tau*(n))              -- flat iff |r_n| ~ c/(n(1+4tau*))
 *     P_r(n)   = |r_n| / (4 / (n ln n))                   -- flat iff |r_n| ~ 4/(n ln n)
 *     p_r(n)   = -d ln|r_n| / d ln n  (windowed, W = 60)  -- the local decay exponent
 *   and the same three for |eps_n|, plus the ratio r_n/eps_n.
 *
 *   MEASURED (n in [624, 1424]; fits the imp-3869 tail)
 *   ---------------------------------------------------
 *     (1) |r_n| DECAYS MONOTONICALLY but SLOWER than the 4/(n ln n) Laplace-variance
 *         law over the whole window. L_r(n) = |r_n| n (1+4 tau*) is monotone
 *         INCREASING (1.744 at n = 624 -> 3.048 at n = 1424), i.e. |r_n| does NOT
 *         fall as fast as 1/(n(1+4 tau*)); the local decay exponent p_r stays BELOW 1
 *         (0.348 at n = 720 -> 0.609 at n = 1300) and CLIMBS toward the ~1 that the
 *         law predicts asymptotically. So 4/(n ln n) is a tightening UPPER envelope
 *         on |r_n|, not yet a fixed-constant fit in this range.
 *     (2) THE 4/(n ln n) CURVE IS APPROACHED FROM BELOW. P_r(n) = |r_n| (n ln n)/4 is
 *         monotone INCREASING and stays STRICTLY BELOW 1 across the whole tail
 *         (0.570 at n = 624 -> 0.990 at n = 1424, max 0.990): |r_n| < 4/(n ln n)
 *         everywhere, and the ratio climbs to within ~1% of the law by n = 1424.
 *     (3) |r_n| AND |eps_n| DECAY IN LOCKSTEP. r_n/eps_n stays in [1.292, 1.441] and
 *         drifts monotonically upward, and the eps combination L_eps(n) = |eps_n| n
 *         (1+4 tau*) is ALSO monotone increasing (1.351 -> 2.115). This REFINES the
 *         imp-3735 finding (which at n <= 80 saw eps_n n (1+4 tau*) drift BELOW 1):
 *         in the deep tail the combination climbs back ABOVE 1, so BOTH |r_n| and
 *         |eps_n| decay slightly slower than the leading 4/(n ln n) there, in lockstep.
 *     (4) THE BOUND: R_n -> 1 FROM BELOW, NO FLOOR DETECTED. |r_n| is strictly
 *         decreasing with a POSITIVE local exponent p_r that CLIMBS monotonically
 *         toward the law exponent (~1), and P_r climbs toward ~0.99 -- there is NO
 *         evidence of a positive sub-unity floor. The measured tail is consistent
 *         with R_n reaching 1 asymptotically from below, tracking 4/(n ln n) ORDER,
 *         though the recovery is far from complete at n = 1424 (R_1424 = 0.999617).
 *         A positive floor cannot be rigorously EXCLUDED by finite-n measurement.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / FIT ONLY, at the RH-equivalent scale class. This fits the decay
 *   rate of a moment-ratio convergence diagnostic (the exact-saddle ratio R_n vs 1)
 *   on the imp-3869 deep-n tail; it establishes NO operator positivity. The
 *   reaches-1-from-below reading is an EXTRAPOLATION from a monotone-decreasing,
 *   order-4/(n ln n) tail, NOT a certified limit -- a sub-unity floor is not
 *   rigorously excluded. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The
 *   operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the rigorous SOTA. Tail values are grid-CONVERGENCE stable to ~5e-7
 *   (inner 4800 vs 7200 over n in [624,1424], max ~4.95e-7 near the support edge),
 *   NOT certified error bounds; the finite NPHI = 10 truncation is the residual
 *   floor. imp-3869 / imp-3849 / imp-3735 assertions are LEFT INTACT: this is a
 *   fit alongside imp-3869, not an edit of it.
 *
 *   @see imp-3869-saddle-ratio-deep-tail-recovery.js (the extended ladder fitted here)
 *   @see imp-3735-moment-ratio-correction-tail.js (the eps_n Laplace-variance law 4/(n ln n))
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (the inner-converged base ladder)
 *
 *   Ticket: imp-33211 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). Identical to imp-3869. */
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

/** Composite Simpson quadrature with Neumaier COMPENSATED accumulation (imp-3849/imp-3869). */
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

/** Build the ratio ladder R_n = |D_n|/|D_n^saddle| -- IDENTICAL imp-3869 construction. */
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
  const Qn = (n) => MOMENTS[n + 2] / MOMENTS[n];
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
    const t = saddleTau(n);
    rungs.push(
      Object.freeze({
        n,
        ratio,                                    // R_n = |D_n|/|D_n^saddle|
        rMinusOne: ratio - 1,                     // r_n = R_n - 1 (signed, negative in the tail)
        epsCorrection: Qn(n) / (t * t) - 1,       // eps_n = Q_n/tau*(n)^2 - 1 (imp-3646)
      })
    );
  }
  return rungs;
}

const MMAX = 1428;                                // moments to M_1428 -> rungs formable to n=1424 (imp-3869)
const TAIL_LO = 624;                              // imp-3849 last rung -- the fit window starts here
const TAIL_HI = MMAX - 4;                         // 1424
// PRIMARY converged grid: inner A(tau) on [0,2] with 4800 panels (imp-3869 primary).
const RUNGS = buildLadder(2, 3200, MMAX, 2, 4800);
// FINER inner grid (7200 panels) for the inner-resolution convergence self-check in the tail.
const RUNGS_FINER = buildLadder(2, 3200, MMAX, 2, 7200);

function rungAt(rungs, n) {
  return rungs.find((row) => row.n === n);
}

// -- Fit combinations at a rung ------------------------------------------------------
function absR(n) {
  return Math.abs(rungAt(RUNGS, n).rMinusOne);
}
function absEps(n) {
  return Math.abs(rungAt(RUNGS, n).epsCorrection);
}
// L_r = |r_n| n (1 + 4 tau*) -- flat iff |r_n| ~ c/(n(1+4 tau*)); the Laplace-variance combination.
function laplaceCombR(n) {
  return absR(n) * n * (1 + 4 * saddleTau(n));
}
function laplaceCombEps(n) {
  return absEps(n) * n * (1 + 4 * saddleTau(n));
}
// P_r = |r_n| / (4/(n ln n)) -- flat iff |r_n| ~ 4/(n ln n); the closed-form-law ratio.
function lawRatioR(n) {
  return absR(n) / (4 / (n * Math.log(n)));
}
// Local decay exponent p_r(n) = -d ln|r_n| / d ln n (windowed, half-width W).
const EXP_W = 60;
function localExpR(n) {
  return -(Math.log(absR(n + EXP_W)) - Math.log(absR(n - EXP_W))) /
    (Math.log(n + EXP_W) - Math.log(n - EXP_W));
}

// -- Monotonicity + envelope sweeps across the whole tail ----------------------------
let R_ABS_STRICTLY_DECREASING = true;             // |r_n| falls => R_n recovers toward 1
let LR_MONOTONE_INCREASING = true;                // |r_n| decays SLOWER than 1/(n(1+4tau*))
let LEPS_MONOTONE_INCREASING = true;              // |eps_n| likewise (refines imp-3735 n<=80)
let PR_MONOTONE_INCREASING = true;                // |r_n| approaches 4/(n ln n) from below
let PR_STAYS_BELOW_ONE = true;                    // |r_n| < 4/(n ln n) everywhere
let PR_MAX = -Infinity;
let R_OVER_EPS_MIN = Infinity;
let R_OVER_EPS_MAX = -Infinity;
let prevAbs = Infinity;
let prevLR = -Infinity;
let prevLEps = -Infinity;
let prevPR = -Infinity;
for (let n = TAIL_LO; n <= TAIL_HI; n += 1) {
  const a = absR(n);
  const lr = laplaceCombR(n);
  const le = laplaceCombEps(n);
  const pr = lawRatioR(n);
  const re = rungAt(RUNGS, n).rMinusOne / rungAt(RUNGS, n).epsCorrection;
  if (a > prevAbs + 1e-15) R_ABS_STRICTLY_DECREASING = false;
  if (lr < prevLR - 1e-12) LR_MONOTONE_INCREASING = false;
  if (le < prevLEps - 1e-12) LEPS_MONOTONE_INCREASING = false;
  if (pr < prevPR - 1e-12) PR_MONOTONE_INCREASING = false;
  if (pr >= 1) PR_STAYS_BELOW_ONE = false;
  if (pr > PR_MAX) PR_MAX = pr;
  if (re < R_OVER_EPS_MIN) R_OVER_EPS_MIN = re;
  if (re > R_OVER_EPS_MAX) R_OVER_EPS_MAX = re;
  prevAbs = a;
  prevLR = lr;
  prevLEps = le;
  prevPR = pr;
}

// -- The reaches-1-from-below reading: positive, climbing local exponent, no floor ---
const P_EXP_LO = localExpR(720);                  // ~0.348
const P_EXP_HI = localExpR(1300);                 // ~0.609
const LOCAL_EXP_POSITIVE_AND_CLIMBING = P_EXP_LO > 0 && P_EXP_HI > P_EXP_LO;

// -- Grid-convergence stability across the tail (inner 4800 vs 7200) ------------------
let MAX_GRID_DELTA_TAIL = 0;
let MAX_GRID_DELTA_TAIL_N = 0;
for (let n = TAIL_LO; n <= TAIL_HI; n += 1) {
  const d = Math.abs(rungAt(RUNGS, n).rMinusOne - rungAt(RUNGS_FINER, n).rMinusOne);
  if (d > MAX_GRID_DELTA_TAIL) {
    MAX_GRID_DELTA_TAIL = d;
    MAX_GRID_DELTA_TAIL_N = n;
  }
}

// -- Classification ------------------------------------------------------------------
const verdict =
  R_ABS_STRICTLY_DECREASING &&
  LR_MONOTONE_INCREASING &&
  LEPS_MONOTONE_INCREASING &&
  PR_MONOTONE_INCREASING &&
  PR_STAYS_BELOW_ONE &&
  PR_MAX > 0.98 &&
  PR_MAX < 1 &&
  LOCAL_EXP_POSITIVE_AND_CLIMBING &&
  R_OVER_EPS_MIN > 1.28 &&
  R_OVER_EPS_MAX < 1.45 &&
  MAX_GRID_DELTA_TAIL < 1e-6
    ? '|R_n-1|-DECAYS-MONOTONICALLY-ON-[624,1424]-TRACKING-THE-imp-3735-LAPLACE-VARIANCE-ORDER-4/(n ln n)' +
      '-BUT-SLOWER-THAN-IT:-L_r=|r_n|n(1+4tau*)-CLIMBS-1.74->3.05-AND-THE-LOCAL-EXPONENT-p_r-STAYS-BELOW-1' +
      '-(0.35->0.61)-CLIMBING-TOWARD-1;-THE-4/(n ln n)-CURVE-IS-A-TIGHTENING-UPPER-ENVELOPE-APPROACHED-FROM' +
      '-BELOW-(P_r=|r_n|(n ln n)/4:-0.570->0.990,-STAYS<1);-|r_n|-AND-|eps_n|-DECAY-IN-LOCKSTEP-(r/eps~1.29' +
      '->1.44,-L_eps-ALSO-CLIMBS-1.35->2.12,-REFINING-imp-3735-n<=80);-BOUND:-NO-SUB-UNITY-FLOOR-DETECTED,' +
      '-R_n->1-FROM-BELOW-BY-EXTRAPOLATION-(NOT-CERTIFIED),-RECOVERY-FAR-FROM-COMPLETE-AT-n=1424-(R=0.999617)'
    : 'INDETERMINATE';

export const IMP33211_SADDLE_RATIO_RECOVERY_RATE_FIT = Object.freeze({
  id: 'imp-33211-saddle-ratio-recovery-rate-fit',
  ticket: 'imp-33211',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  fits: 'imp-3869-saddle-ratio-deep-tail-recovery.js',
  testsPredictionOf: 'imp-3735-moment-ratio-correction-tail.js',
  relatedBaseLadder: 'imp-3849-saddle-ratio-well-depth-inner-converged.js',

  summary:
    'FITS the asymptotic recovery RATE of the imp-3869 inner-converged deep-tail exact-saddle ratio ' +
    'R_n = |D_n|/|D_n^saddle| -> 1 FROM BELOW on n in [624,1424] (the SAME NPHI = 10 kernel and inner-converged ' +
    'A(tau) quadrature, [0,2], 4800 panels self-checked vs 7200) and tests the imp-3735 prediction that |r_n| = ' +
    '|R_n - 1| tracks the Laplace-variance tail |eps_n| ~ 1/(n(1+4 tau*)) ~ 4/(n ln n). FOUR findings: (1) |r_n| ' +
    'decays MONOTONICALLY but SLOWER than 4/(n ln n): L_r = |r_n| n (1+4 tau*) climbs 1.744 -> 3.048 and the local ' +
    'exponent p_r stays BELOW 1 (0.348 at n = 720 -> 0.609 at n = 1300), climbing toward the ~1 the law predicts. ' +
    '(2) The 4/(n ln n) curve is approached FROM BELOW: P_r = |r_n| (n ln n)/4 is monotone increasing and stays ' +
    'STRICTLY BELOW 1 (0.570 -> 0.990, max 0.990). (3) |r_n| and |eps_n| decay in LOCKSTEP: r_n/eps_n in [1.292,1.441] ' +
    'and L_eps = |eps_n| n (1+4 tau*) ALSO climbs (1.351 -> 2.115), refining imp-3735 (which at n <= 80 saw that ' +
    'combination drift below 1). (4) BOUND: no sub-unity floor is detected -- |r_n| strictly decreasing with a ' +
    'positive, climbing local exponent and P_r -> ~0.99 -- so the tail is consistent with R_n -> 1 FROM BELOW by ' +
    'extrapolation (recovery far from complete at n = 1424, R_1424 = 0.999617); a positive floor is not rigorously ' +
    'excluded by finite-n measurement. MEASUREMENT/FIT, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; no QED. imp-3869/imp-3849/imp-3735 assertions LEFT INTACT.',

  method: Object.freeze({
    ratioFitted: 'r_n = R_n - 1 (signed, negative in the tail); |r_n| = |R_n - 1|',
    fitsLadderOf: 'imp-3869 extended ladder n <= 1424; identical kernel, inner-converged A(tau) quadrature, compensated solve',
    laplaceCombination: 'L_r(n) = |r_n| n (1 + 4 tau*(n)) -- flat iff |r_n| ~ c/(n(1+4 tau*)) (the imp-3735 Laplace-variance combination)',
    closedFormLawRatio: 'P_r(n) = |r_n| / (4/(n ln n)) -- flat iff |r_n| ~ 4/(n ln n)',
    localExponentProbe: 'p_r(n) = -d ln|r_n| / d ln n via a windowed log-slope (W = 60 rungs)',
    tailRange: [TAIL_LO, TAIL_HI],
    momentsExtendedTo: MMAX,
    selfComputing: true,
  }),

  measured: Object.freeze({
    rAbsStrictlyDecreasing: R_ABS_STRICTLY_DECREASING,     // true -- R_n recovers toward 1
    lrMonotoneIncreasing: LR_MONOTONE_INCREASING,          // true -- |r_n| slower than 1/(n(1+4tau*))
    lepsMonotoneIncreasing: LEPS_MONOTONE_INCREASING,      // true -- |eps_n| likewise
    prMonotoneIncreasing: PR_MONOTONE_INCREASING,          // true -- approaches 4/(n ln n) from below
    prStaysBelowOne: PR_STAYS_BELOW_ONE,                   // true -- |r_n| < 4/(n ln n) everywhere
    prMax: PR_MAX,                                         // ~0.990 (at n = 1424)
    localExpAt720: P_EXP_LO,                               // ~0.348
    localExpAt1300: P_EXP_HI,                              // ~0.609
    localExpPositiveAndClimbing: LOCAL_EXP_POSITIVE_AND_CLIMBING, // true -- no floor
    // fit-combination endpoints
    lrAt624: laplaceCombR(624),                            // ~1.744
    lrAt1424: laplaceCombR(1424),                          // ~3.048
    lepsAt624: laplaceCombEps(624),                        // ~1.351
    lepsAt1424: laplaceCombEps(1424),                      // ~2.115
    prAt624: lawRatioR(624),                               // ~0.570
    prAt1424: lawRatioR(1424),                             // ~0.990
    rOverEpsMin: R_OVER_EPS_MIN,                           // ~1.292
    rOverEpsMax: R_OVER_EPS_MAX,                           // ~1.441
    // continuity cross-checks with imp-3869
    rAt624: rungAt(RUNGS, 624).rMinusOne,                  // ~ -5.677e-4
    rAt1424: rungAt(RUNGS, 1424).rMinusOne,                // ~ -3.828e-4
    ratioAt1424: rungAt(RUNGS, 1424).ratio,                // ~0.999617
    maxGridDeltaTail: MAX_GRID_DELTA_TAIL,                 // ~4.95e-7
    maxGridDeltaTailN: MAX_GRID_DELTA_TAIL_N,              // ~1424
    verdict,
  }),

  interpretation: Object.freeze({
    decaysSlowerThanTheLaw:
      'The fit answers the ticket: |r_n| = |R_n - 1| decays MONOTONICALLY on [624,1424] but SLOWER than the ' +
      'imp-3735 Laplace-variance law 4/(n ln n). L_r = |r_n| n (1+4 tau*) is monotone increasing (1.744 -> 3.048) ' +
      'and the local decay exponent p_r stays below 1 (0.348 -> 0.609), climbing toward the ~1 the law predicts ' +
      'asymptotically. So 4/(n ln n) captures the ORDER but not a fixed constant over this window.',
    approachedFromBelow:
      'The closed-form ratio P_r = |r_n| (n ln n)/4 is monotone increasing and stays STRICTLY BELOW 1 across the ' +
      'whole tail (0.570 at n = 624 -> 0.990 at n = 1424): |r_n| < 4/(n ln n) everywhere, with the 4/(n ln n) curve ' +
      'a tightening upper envelope approached from below to within ~1% by n = 1424.',
    lockstepWithEps:
      'r_n and eps_n decay in lockstep: r_n/eps_n stays in [1.292,1.441] and L_eps = |eps_n| n (1+4 tau*) ALSO ' +
      'climbs (1.351 -> 2.115). This REFINES imp-3735, which at n <= 80 saw eps_n n (1+4 tau*) drift BELOW 1; in the ' +
      'deep tail the combination climbs back above 1, so both |r_n| and |eps_n| fall slightly slower than the ' +
      'leading 4/(n ln n) there -- confirming the eps-weighted-step mechanism sets the recovery rate.',
    reachesOneFromBelowBound:
      'The reaches-1-or-floors bound: |r_n| is strictly decreasing with a POSITIVE local exponent that CLIMBS ' +
      'monotonically toward the law exponent (~1), and P_r climbs toward ~0.99 -- NO positive sub-unity floor is ' +
      'detected. The measured tail is consistent with R_n reaching 1 asymptotically FROM BELOW, though the recovery ' +
      'is far from complete at n = 1424 (R_1424 = 0.999617). This is an extrapolation, not a certified limit: a ' +
      'positive floor cannot be rigorously excluded by finite-n measurement.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    isExtrapolationNotLimit: true,
    fitsImp3869: true,
    leavesImp3869AssertionsIntact: true,
    leavesImp3735AssertionsIntact: true,
    derivationScope:
      'Fits the decay rate of the exact-saddle ratio recovery |R_n - 1| on the imp-3869 deep-n tail (n to 1424), ' +
      'measuring that it tracks the 4/(n ln n) Laplace-variance order from below and shows no sub-unity floor. ' +
      'NO operator positivity.',
    reachesOneIsExtrapolation:
      'The R_n -> 1-from-below reading is an EXTRAPOLATION from a monotone-decreasing, order-4/(n ln n) tail with a ' +
      'positive climbing local exponent -- NOT a certified limit. A positive sub-unity floor is not rigorously excluded.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    gridStabilityNotCertifiedBound:
      'Tail values are grid-CONVERGENCE stable to ~5e-7 (inner 4800 vs 7200 panels over n in [624,1424], max ~4.95e-7 ' +
      'near the A(tau) support edge). The finite NPHI = 10 kernel truncation remains the residual floor. NOT certified ' +
      'error bounds.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP33211_SADDLE_RATIO_RECOVERY_RATE_FIT_ASSERTIONS = [
  {
    id: 'imp33211-r-abs-strictly-decreasing-recovers-from-below',
    why: 'The recovery premise: |r_n| = |R_n - 1| is strictly decreasing across the tail [624,1424], so R_n ' +
         'recovers toward 1 from below (r_624 ~ -5.677e-4 -> r_1424 ~ -3.828e-4).',
    holds: () =>
      R_ABS_STRICTLY_DECREASING &&
      rungAt(RUNGS, 624).rMinusOne < 0 &&
      rungAt(RUNGS, 1424).rMinusOne < 0,
  },
  {
    id: 'imp33211-decays-slower-than-laplace-variance-law',
    why: 'THE RATE FIT: L_r = |r_n| n (1+4 tau*) is monotone INCREASING (1.744 at n = 624 -> 3.048 at n = 1424), so ' +
         '|r_n| decays SLOWER than the Laplace-variance law 1/(n(1+4 tau*)) ~ 4/(n ln n) over this window.',
    holds: () =>
      LR_MONOTONE_INCREASING &&
      laplaceCombR(624) > 1.7 &&
      laplaceCombR(624) < 1.8 &&
      laplaceCombR(1424) > 3.0 &&
      laplaceCombR(1424) < 3.1,
  },
  {
    id: 'imp33211-law-approached-from-below-p_r-under-one',
    why: 'P_r = |r_n| (n ln n)/4 is monotone increasing and stays STRICTLY BELOW 1 across the whole tail (0.570 -> ' +
         '0.990, max ~0.990): |r_n| < 4/(n ln n) everywhere, approaching the law from below to within ~1% by n = 1424.',
    holds: () =>
      PR_MONOTONE_INCREASING &&
      PR_STAYS_BELOW_ONE &&
      PR_MAX > 0.98 &&
      PR_MAX < 1 &&
      lawRatioR(624) > 0.55 &&
      lawRatioR(624) < 0.59,
  },
  {
    id: 'imp33211-local-exponent-positive-and-climbing-no-floor',
    why: 'The reaches-1-or-floors bound: the local decay exponent p_r = -d ln|r_n|/d ln n is POSITIVE and CLIMBS ' +
         '(0.348 at n = 720 -> 0.609 at n = 1300), so |r_n| -> 0 with no sub-unity floor detected -- R_n -> 1 from below.',
    holds: () =>
      LOCAL_EXP_POSITIVE_AND_CLIMBING &&
      P_EXP_LO > 0.3 &&
      P_EXP_LO < 0.4 &&
      P_EXP_HI > 0.55 &&
      P_EXP_HI < 0.65,
  },
  {
    id: 'imp33211-r-and-eps-in-lockstep-eps-also-sub-law',
    why: '|r_n| and |eps_n| decay in lockstep: r_n/eps_n stays in [1.292,1.441] and L_eps = |eps_n| n (1+4 tau*) is ' +
         'ALSO monotone increasing (1.351 -> 2.115), refining the imp-3735 n<=80 finding that that combination drifted ' +
         'below 1.',
    holds: () =>
      LEPS_MONOTONE_INCREASING &&
      R_OVER_EPS_MIN > 1.28 &&
      R_OVER_EPS_MIN < 1.3 &&
      R_OVER_EPS_MAX > 1.43 &&
      R_OVER_EPS_MAX < 1.45 &&
      laplaceCombEps(1424) > laplaceCombEps(624),
  },
  {
    id: 'imp33211-continuity-with-imp3869',
    why: 'Continuity with imp-3869: the fitted ladder reproduces r_624 ~ -5.677e-4, r_1424 ~ -3.828e-4 and ' +
         'R_1424 ~ 0.999617 (imp-3869 reported the same endpoints).',
    holds: () =>
      Math.abs(rungAt(RUNGS, 624).rMinusOne - (-5.677e-4)) < 5e-7 &&
      Math.abs(rungAt(RUNGS, 1424).rMinusOne - (-3.828e-4)) < 5e-7 &&
      Math.abs(rungAt(RUNGS, 1424).ratio - 0.999617) < 5e-6,
  },
  {
    id: 'imp33211-tail-grid-convergence-stable',
    why: 'THE CONVERGENCE SELF-CHECK: inner 4800 vs 7200 panels agree to < 1e-6 across the tail (max ~4.95e-7 near ' +
         'n = 1424) -- the fit rests on grid-pinned values.',
    holds: () => MAX_GRID_DELTA_TAIL < 1e-6,
  },
  {
    id: 'imp33211-verdict-not-indeterminate',
    why: 'The classified verdict must record the slower-than-4/(n ln n) monotone decay, the below-1 approach, the ' +
         'eps lockstep, and the no-floor reaches-1-from-below bound -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33211-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/fit only, reaches-1 is an extrapolation not a certified limit, grid-stability ' +
         'not a certified bound, mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) untouched, ' +
         'PT 0.2 stays SOTA, and imp-3869 assertions left intact.',
    holds: () => {
      const c = IMP33211_SADDLE_RATIO_RECOVERY_RATE_FIT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.isExtrapolationNotLimit === true &&
        c.didNotAttemptPositivity === true &&
        c.leavesImp3869AssertionsIntact === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33211_SADDLE_RATIO_RECOVERY_RATE_FIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33211-saddle-ratio-recovery-rate-fit assertion failed: ${assertion.id}`);
  }
}

export default IMP33211_SADDLE_RATIO_RECOVERY_RATE_FIT;
