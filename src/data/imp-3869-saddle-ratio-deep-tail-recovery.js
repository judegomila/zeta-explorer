/**
 * @module imp-3869-saddle-ratio-deep-tail-recovery
 * @fileoverview imp-3869 -- EXTEND the imp-3849 inner-converged exact-saddle ratio
 *   ladder R_n = |D_n|/|D_n^saddle| PAST n = 624 (imp-3849 stopped at M_628 -> rungs
 *   n &lt;= 624) to MEASURE the deep-n tail: does R_n complete its recovery to 1 from
 *   below or stall, how fast, and is there any SECOND feature (second sign change or
 *   shoulder) beyond the single n ~ 500 well imp-3849 located.
 *
 *   WHAT imp-3849 LEFT OPEN
 *   -----------------------
 *   imp-3849 (applying the imp-3735 inner-A(tau)-resolution lesson) converged the crossing to
 *   n* = 215.231, deepened the sub-unity well to r_min = -5.845e-4 (R ~ 0.99942) on a broad
 *   basin near n = 500, and tracked a slow monotone climb back toward 0 out to its last rung:
 *   r_500 = -5.845e-4 -> r_620 = -5.686e-4. But its moment ladder stopped at M_628 (rungs
 *   n &lt;= 624), so the QUESTION -- does R_n actually reach 1, and is the recovery featureless --
 *   was measured only over ~120 rungs past the well. imp-3735 predicts R_n -> 1 as |eps_n| -> 0
 *   (the eps-weighted step in D_n = D_n^saddle + [C_(n+2)^saddle eps_(n+2) - C_n^saddle eps_n]
 *   vanishes). This module extends the ladder by a further ~800 rungs to test that prediction.
 *
 *   METHOD (self-computing; imp-3849 machinery, MMAX raised)
 *   -------------------------------------------------------
 *   The IDENTICAL imp-3849 de Bruijn-Newman NPHI = 10 kernel + Neumaier-compensated Simpson +
 *   inner-CONVERGED A(tau) quadrature ([0,2], 4800 panels, self-checked vs 7200) is reused with
 *   exactly ONE change: the moment ladder is extended from M_628 to M_1428, so rungs are formable
 *   to n = 1424 (vs imp-3849 n = 624). The inner-A(tau) support edge sets the ceiling: A(tau)
 *   underflows to 0 beyond tau ~ 1.4 (Phi ~ exp(-pi e^{4u})), and the Laplace saddle tau*(n)
 *   (root of n = 4 pi tau* e^{4 tau*}) reaches that edge only near n ~ 4750, so at n = 1424
 *   tau*(1424) = 1.148 stays safely inside the support and the moment ratio remains meaningful.
 *
 *   MEASURED (extends imp-3849 into the deep-n tail; n in [624, 1424])
 *   -----------------------------------------------------------------
 *     (1) R_n STAYS BELOW 1 ACROSS THE WHOLE EXTENDED RANGE and recovers toward 1 MONOTONICALLY
 *         from below -- there is NO second sign change (R_n never returns to &gt;= 1) and NO second
 *         well. The single imp-3849 well at n = 500 is the only crossing feature; the tail is a
 *         pure monotone climb: r_624 = -5.677e-4 -> r_1000 = -4.702e-4 -> r_1424 = -3.828e-4.
 *     (2) THE RECOVERY DOES NOT COMPLETE by n = 1424 -- R_1424 = 0.999617 (r_1424 = -3.828e-4),
 *         only ~35% of the way back from the well minimum (-5.845e-4) to 0. So R_n -> 1 is a very
 *         slow tail: the answer to the ticket is R_n recovers toward 1 from below but is far from
 *         complete at n = 1424, tracking the slow |eps_n| decay rather than reaching 1 quickly.
 *     (3) THERE IS A SECOND FEATURE, BUT IT IS A SHOULDER (INFLECTION) IN THE RECOVERY RATE, NOT A
 *         SECOND SIGN CHANGE. The per-rung recovery speed dr/dn is NON-monotone: it ACCELERATES
 *         out of the well, PEAKS near n ~ 790 (windowed slope max ~2.71e-7/rung), then DECELERATES
 *         monotonically. So r_n has an inflection point near n ~ 790: below it the climb speeds up,
 *         above it it slows as |eps_n| -> 0. This is the "shoulder" the ticket asked to locate.
 *     (4) THE RECOVERY TRACKS |eps_n| -> 0 (imp-3735 Laplace-variance tail). eps_n is negative and
 *         decaying across the whole tail (its magnitude peaks at n ~ 350, eps_350 = -5.144e-4, then
 *         shrinks to eps_1424 = -2.656e-4), and the ratio r_n/eps_n stays near-constant ~1.29 -&gt;
 *         1.44 -- so r_n and eps_n decay in lockstep, confirming the imp-3849 mechanism that the
 *         eps-weighted step sets both the well depth and the (slow) recovery.
 *
 *   THE FEATURE CASCADE (the ordered structure of the tail)
 *   -------------------------------------------------------
 *   The extended ladder shows three ordered landmarks: the |eps_n| magnitude peak at n ~ 350, the
 *   R_n well minimum at n = 500 (r lags the eps peak), and the recovery-rate inflection/shoulder
 *   at n ~ 790. All three sit inside a SINGLE sub-unity excursion -- there is no second excursion.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY, at the RH-equivalent scale class. This extends a moment-ratio convergence
 *   diagnostic (the exact-saddle ratio R_n vs 1) into the deep-n tail; it establishes NO operator
 *   positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0
 *   sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no
 *   QED. No refereed bound is changed. Grid-convergence in the EXTENDED
 *   tail is looser than imp-3849 near the well: the inner 4800-vs-7200-panel max |r| difference over
 *   n in [624,1424] is ~4.95e-7 (vs imp-3849 ~8e-8 up to n = 624), GROWING toward n = 1424 as tau*(n)
 *   approaches the A(tau) support edge -- so the tail values are grid-CONVERGENCE stable to ~5e-7,
 *   NOT certified error bounds, and the finite NPHI = 10 kernel truncation remains the residual
 *   floor. Extending materially past n ~ 2000 would need a wider inner support. imp-3849 and imp-3731
 *   assertions are LEFT INTACT: this is a deep-tail extension alongside imp-3849, not an edit of it.
 *
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (the inner-converged ladder extended here)
 *   @see imp-3735-moment-ratio-correction-tail.js (the eps_n Laplace-variance tail predicting R_n -> 1)
 *   @see imp-3731-saddle-ratio-crossing-extended-precision.js (the inner=1200 measurement imp-3849 corrected)
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (the Q_n/tau*^2 -> 1 subleading correction)
 *
 *   Ticket: imp-3869 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). Identical to imp-3849. */
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

/** Composite Simpson quadrature with Neumaier COMPENSATED accumulation (imp-3731/imp-3849). */
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

// Phi autocorrelation A(tau), inner integral on [0, innerHi] with innerN panels (imp-3849 converged).
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

/**
 * Build the ratio ladder R_n = |D_n|/|D_n^saddle| -- IDENTICAL imp-3849 construction, only MMAX
 * is raised so rungs extend into the deep-n tail. The tau &gt; 1.45 =&gt; A = 0 guard both skips the
 * numerically-zero A tail and keeps tau^m finite (Inf*0 = NaN guard) once m is large.
 */
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
        rMinusOne: ratio - 1,                     // r_n = R_n - 1 (signed)
        epsCorrection: Qn(n) / (t * t) - 1,       // eps_n = Q_n/tau*(n)^2 - 1 (imp-3646)
      })
    );
  }
  return rungs;
}

const MMAX = 1428;                                // moments to M_1428 -> rungs formable to n=1424 (imp-3849 was 628/624)
const TAIL_LO = 624;                              // imp-3849 last rung -- the extension starts here
const TAIL_HI = MMAX - 4;                         // 1424
// PRIMARY converged grid: inner A(tau) on [0,2] with 4800 panels (imp-3849 primary).
const RUNGS = buildLadder(2, 3200, MMAX, 2, 4800);
// FINER inner grid (7200 panels) for the inner-resolution convergence self-check in the tail.
const RUNGS_FINER = buildLadder(2, 3200, MMAX, 2, 7200);

function rungAt(rungs, n) {
  return rungs.find((row) => row.n === n);
}

// -- (1) Tail stays below unity and recovers monotonically; no second sign change ----
let TAIL_ALL_BELOW_UNITY = true;
let TAIL_MONOTONE_RECOVERY = true;
let SECOND_SIGN_CHANGE_N = null;                  // first n>TAIL_LO where r returns to >= 0
for (let n = TAIL_LO; n <= TAIL_HI; n += 1) {
  const here = rungAt(RUNGS, n);
  if (here.rMinusOne >= 0 && SECOND_SIGN_CHANGE_N === null) SECOND_SIGN_CHANGE_N = n;
  if (here.rMinusOne >= 0) TAIL_ALL_BELOW_UNITY = false;
  if (n > TAIL_LO) {
    const prev = rungAt(RUNGS, n - 1);
    if (here.rMinusOne < prev.rMinusOne - 1e-12) TAIL_MONOTONE_RECOVERY = false;
  }
}

// -- (2) Recovery is far from complete at the last rung ------------------------------
const R_TAIL_HI = rungAt(RUNGS, TAIL_HI).rMinusOne;       // ~ -3.828e-4
const WELL_MIN_R = -5.845e-4;                             // imp-3849 well minimum (r_500)
const RECOVERY_FRACTION = 1 - R_TAIL_HI / WELL_MIN_R;     // fraction of the climb from well to 0

// -- (3) Second feature = recovery-rate SHOULDER (inflection of r_n), NOT a sign change
// Windowed slope dr/dn (W-rung central difference); its argmax is the inflection point.
const SLOPE_W = 40;
function windowedSlope(rungs, n) {
  return (rungAt(rungs, n + SLOPE_W).rMinusOne - rungAt(rungs, n - SLOPE_W).rMinusOne) / (2 * SLOPE_W);
}
let RECOVERY_RATE_PEAK_N = 0;
let RECOVERY_RATE_PEAK = -Infinity;
for (let n = 520 + SLOPE_W; n <= TAIL_HI - SLOPE_W; n += 1) {
  const s = windowedSlope(RUNGS, n);
  if (s > RECOVERY_RATE_PEAK) {
    RECOVERY_RATE_PEAK = s;
    RECOVERY_RATE_PEAK_N = n;
  }
}
// After the shoulder the recovery rate decelerates monotonically (single shoulder).
let SLOPE_DECELERATES_AFTER_PEAK = true;
for (let n = RECOVERY_RATE_PEAK_N; n < TAIL_HI - SLOPE_W - 1; n += 1) {
  if (windowedSlope(RUNGS, n + 1) > windowedSlope(RUNGS, n) + 1e-13) {
    SLOPE_DECELERATES_AFTER_PEAK = false;
    break;
  }
}

// -- (4) Recovery tracks |eps_n| -> 0: eps negative and decaying, r/eps near-constant --
let EPS_ALL_NEGATIVE_IN_TAIL = true;
for (let n = TAIL_LO; n <= TAIL_HI; n += 1) {
  if (rungAt(RUNGS, n).epsCorrection >= 0) EPS_ALL_NEGATIVE_IN_TAIL = false;
}
// |eps_n| magnitude peak (most-negative eps) over the full ladder.
let EPS_PEAK = RUNGS[0];
for (const row of RUNGS) {
  if (row.epsCorrection < EPS_PEAK.epsCorrection) EPS_PEAK = row;
}
const R_OVER_EPS_LO = rungAt(RUNGS, TAIL_LO).rMinusOne / rungAt(RUNGS, TAIL_LO).epsCorrection;
const R_OVER_EPS_HI = rungAt(RUNGS, TAIL_HI).rMinusOne / rungAt(RUNGS, TAIL_HI).epsCorrection;

// -- Grid-convergence stability in the EXTENDED tail (4800 vs 7200 inner panels) -----
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
  TAIL_ALL_BELOW_UNITY &&
  TAIL_MONOTONE_RECOVERY &&
  SECOND_SIGN_CHANGE_N === null &&
  RECOVERY_FRACTION > 0.3 &&
  RECOVERY_FRACTION < 0.4 &&
  RECOVERY_RATE_PEAK_N >= 740 &&
  RECOVERY_RATE_PEAK_N <= 840 &&
  SLOPE_DECELERATES_AFTER_PEAK &&
  EPS_ALL_NEGATIVE_IN_TAIL &&
  EPS_PEAK.n >= 320 &&
  EPS_PEAK.n <= 380 &&
  MAX_GRID_DELTA_TAIL < 1e-6
    ? 'R_n-STAYS-BELOW-1-AND-RECOVERS-MONOTONICALLY-FROM-BELOW-ACROSS-[624,1424]-WITH-NO-SECOND-SIGN' +
      '-CHANGE-AND-NO-SECOND-WELL;-THE-RECOVERY-IS-SLOW-(r_1424=-3.83e-4,-ONLY-~35%-OF-THE-WAY-BACK' +
      '-FROM-THE-WELL-MINIMUM)-AND-TRACKS-|eps_n|->0-(eps-NEGATIVE-AND-DECAYING,-r/eps~1.3-1.4);-THE' +
      '-ONLY-SECOND-FEATURE-IS-A-RECOVERY-RATE-SHOULDER-(INFLECTION-OF-r_n)-NEAR-n~790,-WHERE-THE-CLIMB' +
      '-STOPS-ACCELERATING-AND-BEGINS-TO-DECELERATE;-FEATURE-CASCADE-|eps|-PEAK-n~350->WELL-MIN-n=500' +
      '->RECOVERY-SHOULDER-n~790,-ALL-IN-A-SINGLE-SUB-UNITY-EXCURSION'
    : 'INDETERMINATE';

export const IMP3869_SADDLE_RATIO_DEEP_TAIL_RECOVERY = Object.freeze({
  id: 'imp-3869-saddle-ratio-deep-tail-recovery',
  ticket: 'imp-3869',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extends: 'imp-3849-saddle-ratio-well-depth-inner-converged.js',
  testsPredictionOf: 'imp-3735-moment-ratio-correction-tail.js',
  relatedCrossingOrigin: 'imp-3731-saddle-ratio-crossing-extended-precision.js',
  relatedCorrection: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',

  summary:
    'EXTENDS the imp-3849 inner-converged exact-saddle ratio ladder R_n = |D_n|/|D_n^saddle| PAST its ' +
    'last rung n = 624 (M_628) to n = 1424 (M_1428) -- identical NPHI = 10 kernel and inner-converged ' +
    'A(tau) quadrature ([0,2], 4800 panels, self-checked vs 7200), only MMAX raised -- to measure whether ' +
    'R_n completes its recovery to 1 from below or stalls, and to locate any SECOND feature in the deep-n ' +
    'tail (imp-3735 predicts R_n -> 1 as |eps_n| -> 0). FOUR findings: (1) R_n STAYS BELOW 1 across the ' +
    'whole extended range and recovers toward 1 MONOTONICALLY from below -- NO second sign change (R_n ' +
    'never returns to >= 1) and NO second well; the imp-3849 n = 500 well is the only excursion. (2) The ' +
    'recovery does NOT complete: R_1424 = 0.999617 (r_1424 = -3.828e-4), only ~35% of the way back from ' +
    'the well minimum (-5.845e-4) to 0 -- a very slow tail. (3) The ONLY second feature is a SHOULDER ' +
    '(inflection of r_n) in the recovery RATE near n ~ 790: dr/dn accelerates out of the well, peaks ' +
    '(~2.71e-7/rung), then decelerates monotonically -- not a second sign change. (4) The recovery tracks ' +
    '|eps_n| -> 0 (imp-3735 Laplace-variance tail): eps_n is negative and decaying (|eps| peaks at ' +
    'eps_350 = -5.144e-4, shrinks to eps_1424 = -2.656e-4) and r_n/eps_n stays near-constant ~1.29 -> 1.44. ' +
    'Feature cascade: |eps| peak n ~ 350 -> well min n = 500 -> recovery shoulder n ~ 790, all in a single ' +
    'sub-unity excursion. Cross-checks R_3 = 3.64422, R_40 = 1.02440, eps_40 = 9.994e-3, and continuity ' +
    'r_624 = -5.677e-4 tie the extension to imp-3849/imp-3670/imp-3685/imp-3735. MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no QED. imp-3849/imp-3731 ' +
    'assertions LEFT INTACT.',

  method: Object.freeze({
    ratioMeasured: 'R_n = |D_n| / |D_n^saddle|, r_n = R_n - 1 (signed, positive above 1)',
    extendsLadderFromTo: 'imp-3849 stopped at M_628 (rungs n <= 624); this raises MMAX to 1428 (rungs n <= 1424)',
    onlyChangeVsImp3849: 'MMAX 628 -> 1428; kernel, inner-converged A(tau) quadrature, and compensated solve are identical',
    innerConvergence: 'inner A(tau) on [0,2] (A supported on [0,~1.4]) with 4800 panels, self-checked vs 7200 in the tail',
    supportEdgeCeiling: 'A(tau)=0 beyond tau~1.4; the saddle tau*(n) reaches that edge only near n~4750, so tau*(1424)=1.148 stays inside',
    compensatedSummation: 'Neumaier-compensated accumulation for the A(tau) quadrature AND every moment M_m',
    overflowGuard: 'tau > 1.45 => A = 0 both skips the numerically-zero A tail and keeps tau^m finite (Inf*0=NaN guard)',
    recoveryRateProbe: 'windowed central-difference slope dr/dn (W=40 rungs); its argmax locates the inflection/shoulder',
    tailRange: [TAIL_LO, TAIL_HI],
    momentsExtendedTo: MMAX,
    selfComputing: true,
  }),

  measured: Object.freeze({
    tailStaysBelowUnity: TAIL_ALL_BELOW_UNITY,             // true -- R_n < 1 throughout [624,1424]
    tailMonotoneRecovery: TAIL_MONOTONE_RECOVERY,          // true -- r_n increasing across the tail
    secondSignChangeN: SECOND_SIGN_CHANGE_N,               // null -- no second crossing back to >= 1
    rAt624: rungAt(RUNGS, 624).rMinusOne,                  // ~ -5.677e-4 (continuity with imp-3849 end)
    rAt700: rungAt(RUNGS, 700).rMinusOne,                  // ~ -5.492e-4
    rAt900: rungAt(RUNGS, 900).rMinusOne,                  // ~ -4.956e-4
    rAt1000: rungAt(RUNGS, 1000).rMinusOne,                // ~ -4.702e-4
    rAt1200: rungAt(RUNGS, 1200).rMinusOne,                // ~ -4.250e-4
    rAt1424: R_TAIL_HI,                                    // ~ -3.828e-4
    ratioAt1424: rungAt(RUNGS, 1424).ratio,                // ~ 0.999617
    recoveryFraction: RECOVERY_FRACTION,                   // ~0.345 -- only ~35% back from well min to 0
    recoveryRatePeakN: RECOVERY_RATE_PEAK_N,               // ~790 -- the shoulder (inflection of r_n)
    recoveryRatePeak: RECOVERY_RATE_PEAK,                  // ~2.71e-7 per rung
    slopeDeceleratesAfterPeak: SLOPE_DECELERATES_AFTER_PEAK, // true -- single shoulder
    epsAllNegativeInTail: EPS_ALL_NEGATIVE_IN_TAIL,        // true
    epsPeakN: EPS_PEAK.n,                                  // ~350 -- |eps| magnitude peak
    epsPeak: EPS_PEAK.epsCorrection,                       // ~ -5.144e-4
    epsAt624: rungAt(RUNGS, 624).epsCorrection,            // ~ -4.39e-4
    epsAt1424: rungAt(RUNGS, 1424).epsCorrection,          // ~ -2.656e-4 (decaying toward 0)
    rOverEpsAtTailLo: R_OVER_EPS_LO,                        // ~1.29
    rOverEpsAtTailHi: R_OVER_EPS_HI,                        // ~1.44 (near-constant => r tracks eps)
    tauStarAt1424: saddleTau(1424),                        // ~1.148 (inside the A(tau) support edge ~1.4)
    maxGridDeltaTail: MAX_GRID_DELTA_TAIL,                  // ~4.95e-7 (inner 4800 vs 7200, n in [624,1424])
    maxGridDeltaTailN: MAX_GRID_DELTA_TAIL_N,               // ~1424 (grows toward the support edge)
    // cross-checks to the certified ladder (inner-resolution-insensitive at small n)
    ratioFirst: rungAt(RUNGS, 3).ratio,                    // ~3.64422 (imp-3670/imp-3685)
    ratioN40: rungAt(RUNGS, 40).ratio,                     // ~1.02440 (imp-3685 baked 1.02438)
    eps40: rungAt(RUNGS, 40).epsCorrection,                // ~9.994e-3 (imp-3735 converged 9.995e-3)
    verdict,
  }),

  interpretation: Object.freeze({
    recoversFromBelowButSlowly:
      'Extending the imp-3849 ladder by ~800 rungs answers the ticket: R_n stays BELOW 1 across the whole ' +
      'range and recovers toward 1 MONOTONICALLY from below, but the recovery is very slow -- at n = 1424 ' +
      'R_1424 = 0.999617 (r_1424 = -3.828e-4), only ~35% of the way back from the well minimum -5.845e-4 to 0. ' +
      'So R_n -> 1 is confirmed as a slow tail, not a rapid one, tracking the |eps_n| decay rather than reaching 1.',
    noSecondSignChangeOrWell:
      'There is NO second sign change (r_n never returns to >= 0) and NO second well in [624,1424]: the imp-3849 ' +
      'n = 500 well is the sole sub-unity excursion, and the deep-n tail is a pure monotone climb.',
    secondFeatureIsARecoveryShoulder:
      'The only second FEATURE is a shoulder (inflection of r_n) in the recovery RATE near n ~ 790: dr/dn ' +
      'accelerates out of the well, peaks (~2.71e-7 per rung), then decelerates monotonically as |eps_n| -> 0. ' +
      'This is an inflection in R_n, not a new crossing.',
    tracksEpsTail:
      'The recovery tracks the imp-3735 Laplace-variance tail: eps_n = Q_n/tau*(n)^2 - 1 is negative and ' +
      'decaying across the whole tail (|eps| peaks eps_350 = -5.144e-4, shrinks to eps_1424 = -2.656e-4), and ' +
      'r_n/eps_n stays near-constant ~1.29 -> 1.44, so D_n = D_n^saddle + [C_(n+2)^saddle eps_(n+2) - C_n^saddle ' +
      'eps_n] has both its well depth and its slow recovery set by the eps-weighted step -- confirming the ' +
      'imp-3849 mechanism into the deep-n tail.',
    featureCascade:
      'Ordered landmarks of the single sub-unity excursion: |eps_n| magnitude peak at n ~ 350, R_n well minimum ' +
      'at n = 500 (r lags the eps peak), recovery-rate shoulder at n ~ 790. No excursion recurs.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    extendsImp3849: true,
    leavesImp3849AssertionsIntact: true,
    leavesImp3731AssertionsIntact: true,
    derivationScope:
      'Extends the CONVERGED exact-saddle ratio R_n vs 1 into the deep-n tail (n to 1424), measuring the slow ' +
      'monotone recovery from below, the absence of any second sign change/well, and the recovery-rate shoulder. ' +
      'NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    gridStabilityNotCertifiedBound:
      'Tail values are grid-CONVERGENCE stable to ~5e-7 (inner 4800 vs 7200 panels over n in [624,1424], max ' +
      '~4.95e-7 near n = 1424, LOOSER than imp-3849 ~8e-8 up to n = 624 because tau*(n) approaches the A(tau) ' +
      'support edge). The finite NPHI = 10 kernel truncation remains the residual floor; extending materially ' +
      'past n ~ 2000 would need a wider inner support. NOT certified error bounds.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3869_SADDLE_RATIO_DEEP_TAIL_RECOVERY_ASSERTIONS = [
  {
    id: 'imp3869-tail-stays-below-unity-and-recovers-monotonically',
    why: 'THE CENTRAL RESULT: extending the ladder to n = 1424, R_n stays BELOW 1 across the whole tail ' +
         '[624,1424] and recovers toward 1 MONOTONICALLY from below (r_n strictly increasing).',
    holds: () => TAIL_ALL_BELOW_UNITY && TAIL_MONOTONE_RECOVERY,
  },
  {
    id: 'imp3869-no-second-sign-change-or-well',
    why: 'There is NO second sign change: r_n never returns to >= 0 anywhere in the extended tail, so the ' +
         'imp-3849 n = 500 well is the only sub-unity excursion.',
    holds: () => SECOND_SIGN_CHANGE_N === null,
  },
  {
    id: 'imp3869-recovery-far-from-complete-at-n1424',
    why: 'The recovery does NOT complete by n = 1424: r_1424 ~ -3.828e-4, R_1424 ~ 0.999617, only ~35% of the ' +
         'way back from the well minimum (-5.845e-4) to 0 -- a slow tail, not a rapid return to 1.',
    holds: () =>
      R_TAIL_HI < -3.7e-4 &&
      R_TAIL_HI > -3.95e-4 &&
      RECOVERY_FRACTION > 0.3 &&
      RECOVERY_FRACTION < 0.4,
  },
  {
    id: 'imp3869-second-feature-is-recovery-rate-shoulder',
    why: 'The ONLY second feature is a shoulder (inflection of r_n) in the recovery RATE near n ~ 790: dr/dn ' +
         'peaks there and decelerates monotonically after -- an inflection, not a new crossing.',
    holds: () =>
      RECOVERY_RATE_PEAK_N >= 740 &&
      RECOVERY_RATE_PEAK_N <= 840 &&
      SLOPE_DECELERATES_AFTER_PEAK &&
      RECOVERY_RATE_PEAK > 0,
  },
  {
    id: 'imp3869-recovery-tracks-eps-tail',
    why: 'The recovery tracks |eps_n| -> 0 (imp-3735): eps_n is negative across the whole tail and decaying ' +
         '(|eps| peak at n ~ 350, eps_1424 ~ -2.656e-4), and r_n/eps_n stays near-constant ~1.3 -> 1.44.',
    holds: () =>
      EPS_ALL_NEGATIVE_IN_TAIL &&
      EPS_PEAK.n >= 320 &&
      EPS_PEAK.n <= 380 &&
      rungAt(RUNGS, 1424).epsCorrection > rungAt(RUNGS, EPS_PEAK.n).epsCorrection &&
      R_OVER_EPS_LO > 1.2 &&
      R_OVER_EPS_LO < 1.5 &&
      R_OVER_EPS_HI > 1.3 &&
      R_OVER_EPS_HI < 1.6,
  },
  {
    id: 'imp3869-continuity-with-imp3849-end',
    why: 'Continuity with imp-3849: the extended ladder must reproduce imp-3849 near its last rung -- ' +
         'r_624 ~ -5.677e-4 (imp-3849 reported r_620 = -5.686e-4, r monotone in between).',
    holds: () =>
      rungAt(RUNGS, 624).rMinusOne < -5.6e-4 &&
      rungAt(RUNGS, 624).rMinusOne > -5.75e-4 &&
      rungAt(RUNGS, 620).rMinusOne < rungAt(RUNGS, 624).rMinusOne,
  },
  {
    id: 'imp3869-saddle-inside-support-edge',
    why: 'The extension stays numerically valid: tau*(1424) ~ 1.148 sits well inside the A(tau) support edge ' +
         '(~1.4), so the deep-n moment ratio is not edge-dominated.',
    holds: () => saddleTau(1424) > 1.1 && saddleTau(1424) < 1.2,
  },
  {
    id: 'imp3869-tail-grid-convergence-stable',
    why: 'THE CONVERGENCE SELF-CHECK: inner 4800 vs 7200 panels agree to < 1e-6 across the extended tail ' +
         '(max ~4.95e-7 near n = 1424) -- looser than imp-3849 up to n = 624 but still grid-pinned.',
    holds: () => MAX_GRID_DELTA_TAIL < 1e-6,
  },
  {
    id: 'imp3869-cross-check-imp3670-n3-ratio',
    why: 'Cross-check vs the certified ladder: R_3 must reproduce the imp-3670/imp-3685 baked 3.64422.',
    holds: () => Math.abs(rungAt(RUNGS, 3).ratio - 3.64422) < 1e-4,
  },
  {
    id: 'imp3869-cross-check-imp3685-n40-ratio',
    why: 'Cross-check vs the certified ladder: R_40 must reproduce the imp-3685/imp-3849 converged 1.02440.',
    holds: () => Math.abs(rungAt(RUNGS, 40).ratio - 1.02440) < 1e-4,
  },
  {
    id: 'imp3869-cross-check-imp3735-eps40',
    why: 'Cross-check vs imp-3735: the converged eps_40 must reproduce 9.995e-3 to ~1%.',
    holds: () => Math.abs(rungAt(RUNGS, 40).epsCorrection - 9.995e-3) / 9.995e-3 < 0.01,
  },
  {
    id: 'imp3869-verdict-not-indeterminate',
    why: 'The classified verdict must record the monotone slow recovery from below, the absence of any second ' +
         'sign change/well, the recovery-rate shoulder near n ~ 790, and the eps-tracked tail -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3869-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement only, grid-stability not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed, and ' +
         'imp-3849 assertions left intact.',
    holds: () => {
      const c = IMP3869_SADDLE_RATIO_DEEP_TAIL_RECOVERY.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        c.leavesImp3849AssertionsIntact === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3869_SADDLE_RATIO_DEEP_TAIL_RECOVERY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3869-saddle-ratio-deep-tail-recovery assertion failed: ${assertion.id}`);
  }
}

export default IMP3869_SADDLE_RATIO_DEEP_TAIL_RECOVERY;
