/**
 * @module imp-3849-saddle-ratio-well-depth-inner-converged
 * @fileoverview imp-3849 -- EXTEND the imp-3731 compensated exact-saddle ratio
 *   R_n = |D_n|/|D_n^saddle| beyond n ~ 280 to LOCATE the depth of the sub-unity
 *   undershoot well and MEASURE whether R_n recovers toward 1 or stays below --
 *   applying the imp-3735 inner-A(tau)-quadrature-resolution lesson that imp-3731
 *   did NOT apply, which turns out to MOVE the whole picture.
 *
 *   WHAT imp-3731 LEFT OPEN, AND THE HIDDEN CONFOUND
 *   ------------------------------------------------
 *   imp-3731 resolved the imp-3713 residual with a Neumaier-COMPENSATED moment solve and
 *   reported: crossing n* = 225.5427323 "grid-stable to ~1e-9", a shallow sub-unity well
 *   with minimum r_min = -1.12857e-4 at n = 276, and recovery toward 1 out to n ~ 320. Its
 *   grid-convergence self-check varied ONLY the OUTER moment-panel count (NM: 3200 -&gt; 6400)
 *   while holding the INNER autocorrelation A(tau) = int Phi(s)Phi(s+tau) ds quadrature FIXED
 *   at [0,7] with 1200 Simpson panels (h_inner ~ 5.8e-3). But imp-3735 had ALREADY shown that
 *   at large n the INNER A(tau) resolution -- NOT the outer moment grid -- limits the
 *   moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1, because the tau^n moment weight pushes
 *   toward larger tau where A(tau) sharpens (imp-3735: inner=1200 is ~7% low at n=80). So the
 *   imp-3731 "~1e-9 grid stability" was measured along the axis the answer is INSENSITIVE to;
 *   the real sensitivity is the inner A(tau) quadrature, which imp-3731 never refined.
 *
 *   METHOD (self-computing; identical machinery, inner resolution CONVERGED)
 *   ----------------------------------------------------------------------
 *   The identical de Bruijn-Newman kernel + Neumaier-compensated Simpson + [0,T_A] moment
 *   machinery of imp-3731 is reused, with THREE changes:
 *     (i)   The INNER A(tau) quadrature is CONVERGED. Since Phi(u) underflows to exactly 0 for
 *           u &gt; ~1.37 (Phi ~ exp(-pi e^{4u})), A(tau) is supported on tau in [0, ~1.4], so the
 *           inner integral is taken on [0,2] (fully capturing the support) with 4800 panels
 *           (h_inner ~ 4.2e-4, ~14x finer than imp-3731) and cross-checked against 7200 panels.
 *     (ii)  The OUTER moment grid uses T_A = 2 (the moments are identical to T_A = 8 because
 *           A(tau) = 0 beyond ~1.4, so [0,2] and [0,8] give the SAME integral) at NM = 3200,
 *           concentrating the outer resolution 4x in the support region. A tau &gt; 1.45 =&gt; A = 0
 *           guard keeps tau^m finite (avoids Inf*0 = NaN once m exceeds ~340 at T_A = 8).
 *     (iii) Moments extended to M_628 so every rung n = 3..624 is formable and the well minimum
 *           and its recovery can be tracked well past n = 280.
 *   The imp-3731 coarse-inner configuration ([0,7], 1200 panels) is ALSO reproduced as an
 *   ARTIFACT probe, to show it recovers imp-3731 r_226 = -2.314e-6 and is under-resolved.
 *
 *   MEASURED (inner-converged; corrects and extends imp-3731)
 *   ---------------------------------------------------------
 *     (1) THE imp-3731 CROSSING / WELL SHAPE IS AN INNER-RESOLUTION ARTIFACT. At imp-3731 inner
 *         resolution (1200 panels on [0,7]) r_226 = -2.314e-6 (its near-zero crossing, reproduced
 *         here). CONVERGING the inner A(tau) quadrature drives r_226 to -8.738e-5 (grid-stable to
 *         ~8e-8 between 4800 and 7200 inner panels), a ~38x larger magnitude. So the imp-3731
 *         crossing n* = 225.54 was pushed UP by the coarse-inner error; the converged crossing is
 *         n* = 215.231 (r_215 = +2.030e-6, r_216 = -6.749e-6), ~10 rungs LOWER.
 *     (2) THE WELL IS ~5x DEEPER AND ~2x FURTHER OUT. The converged sub-unity undershoot bottoms
 *         at r_min = -5.845e-4 (R_n ~ 0.99942) at n = 500 -- NOT the imp-3731 r_min = -1.13e-4 at
 *         n = 276. The well is a broad shallow basin (r_490 = -5.843e-4, r_500 = -5.845e-4,
 *         r_510 = -5.843e-4), so the integer argmin ~ 500 is a broad plateau, not a sharp point.
 *     (3) R_n DOES RECOVER TOWARD 1 FROM BELOW past the well, but SLOWLY: r_500 = -5.845e-4,
 *         r_560 = -5.797e-4, r_600 = -5.728e-4, r_620 = -5.686e-4 -- monotone climb back toward 0.
 *         So the answer to the ticket question is: R_n stays below 1 across the whole extended
 *         range but recovers toward 1 from below after a deep, far-out well, consistent with
 *         eps_n -&gt; 0 (imp-3735 Laplace-variance tail) making the eps-weighted step vanish.
 *     (4) eps_n CHANGES SIGN AT n ~ 149. imp-3735 measured eps_n POSITIVE and shrinking out to
 *         n = 80 (Q_n approaching tau*^2 from above). Continuing the CONVERGED ladder shows eps_n
 *         crosses zero near n = 149 (eps_148 = +7.60e-6, eps_149 = -3.46e-6) and goes NEGATIVE
 *         (eps_200 = -3.43e-4, eps_300 = -5.05e-4): at large n Q_n dips BELOW its Laplace-saddle
 *         estimate tau*(n)^2. This eps sign-change (near, but below, the R_n crossing) is what
 *         sets the deeper converged well -- the undershoot is still the eps-weighted n-difference
 *         of imp-3731/imp-3735, but with the CONVERGED (sign-changing) eps_n, not the coarse-inner
 *         positive one.
 *
 *   RELATION TO imp-3735 (the eps_n Laplace-order tail)
 *   ---------------------------------------------------
 *   imp-3735 gave eps_n ~ 1/(n(1+4 tau*)) ~ 4/(n ln n) with an unbounded local exponent
 *   (super-polynomial), measured POSITIVE to n = 80. This module shows that the converged eps_n
 *   does not merely shrink -- it crosses zero (~n = 149) and turns negative, then its magnitude
 *   peaks and slowly decays. Since D_n = D_n^saddle + [C_(n+2)^saddle eps_(n+2) - C_n^saddle
 *   eps_n], as |eps_n| -&gt; 0 for n &gt;&gt; 500 the eps-weighted step vanishes and R_n -&gt; 1 from below:
 *   the well depth is bounded by the peak of |eps_n|, and the recovery tracks the eps_n tail. The
 *   converged cross-checks R_3 = 3.64422 (imp-3670/imp-3685), R_40 = 1.02440 (imp-3685 baked
 *   1.02438), eps_40 = 9.994e-3 (imp-3735 converged 9.995e-3) tie the ladder to the certified
 *   modules; the difference from imp-3731 is entirely the inner A(tau) resolution at large n.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT ONLY, at the RH-equivalent scale class. This pins the CONVERGED shape of a
 *   moment-ratio convergence diagnostic (the exact-saddle ratio R_n vs 1) and shows the imp-3731
 *   crossing/well were inner-quadrature-limited; it establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA. The reported values are
 *   grid-CONVERGENCE stable (inner 4800 vs 7200 panels agree to ~8e-8); the shared finite
 *   NPHI = 10 kernel truncation and Simpson order remain the residual floor -- so the eps_n
 *   sign-change and the well depth are stable located values of THIS truncated-kernel model, not
 *   certified error bounds. imp-3731 assertions are LEFT INTACT: this is a corrected re-reading at
 *   higher inner resolution, alongside it, not an edit of it.
 *
 *   @see imp-3731-saddle-ratio-crossing-extended-precision.js (the inner=1200 measurement corrected here)
 *   @see imp-3735-moment-ratio-correction-tail.js (the inner-resolution lesson and eps_n Laplace tail)
 *   @see imp-3713-saddle-ratio-approach-to-unity.js (the double-precision origin of the crossing)
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (the Q_n/tau*^2 -> 1 subleading correction)
 *
 *   Ticket: imp-3849 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
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

/**
 * Composite Simpson quadrature with Neumaier COMPENSATED accumulation (imp-3731). The
 * compensator recovers the low-order bits lost when a small term is added into a large
 * running sum -- essential here because the moment integrands tau^m A(tau) span many
 * magnitudes and D_n = C_(n+2) - C_n suffers difference-cancellation amplified ~n/2.
 */
function simpsonCompensated(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = 0;
  let c = 0;                                    // running compensation
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

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds. The INNER integral is taken
// on [0, innerHi] with innerN panels -- CONVERGING this inner resolution is the correction
// this module makes to imp-3731 (imp-3735 inner-resolution lesson).
function makeAutocorr(innerHi, innerN) {
  return (tau) => simpsonCompensated((s) => phiKernel(s) * phiKernel(s + tau), 0, innerHi, innerN);
}

// -- The imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} -----------
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
 * Build the ratio ladder R_n = |D_n|/|D_n^saddle| on a (T_A, NM) outer moment grid with an
 * (innerHi, innerN) inner A(tau) quadrature, Neumaier-compensated throughout. The tau &gt; 1.45
 * =&gt; A = 0 guard both skips the (numerically zero) tail of A and keeps tau^m finite.
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

  // Closed next-order coefficient D_n (imp-3581) and moment ratio Q_n (imp-3646).
  const Cn = (n) => MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n]);
  const Dn = (n) => Cn(n + 2) - Cn(n);            // D_n = C_(n+2) - C_n
  const Qn = (n) => MOMENTS[n + 2] / MOMENTS[n];
  // EXACT-saddle coefficients: C_n^saddle = tau*(n)^2/((n+1)(n+2)).
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

const MMAX = 628;                                 // moments to M_628 -> rungs formable to n=624
// PRIMARY converged grid: inner A(tau) on [0,2] with 4800 panels (h_inner ~ 4.2e-4).
const RUNGS = buildLadder(2, 3200, MMAX, 2, 4800);
// FINER inner grid (7200 panels) for the inner-resolution convergence self-check.
const RUNGS_FINER = buildLadder(2, 3200, MMAX, 2, 7200);
// ARTIFACT probe: imp-3731 inner configuration ([0,7], 1200 panels) reproduces its r_226.
const RUNGS_ARTIFACT = buildLadder(8, 3200, 232, 7, 1200);

function rungAt(rungs, n) {
  return rungs.find((row) => row.n === n);
}

// -- The unity crossing R_n = 1: first n with R_n < 1, and the linear-interp n* -----
function unityCrossingInterp(rungs) {
  let crossN = null;
  for (const row of rungs) {
    if (crossN === null && row.rMinusOne < 0) {
      crossN = row.n;
      break;
    }
  }
  if (crossN === null) return { crossN: null, interp: null };
  const rPrev = rungAt(rungs, crossN - 1).rMinusOne;   // > 0
  const rHere = rungAt(rungs, crossN).rMinusOne;       // < 0
  return { crossN, interp: (crossN - 1) + rPrev / (rPrev - rHere) };
}
const UNITY = unityCrossingInterp(RUNGS);

// -- The sub-unity undershoot: deepest (most negative) r_n --------------------------
let UNDERSHOOT_MIN = RUNGS[0];
for (const row of RUNGS) {
  if (row.rMinusOne < UNDERSHOOT_MIN.rMinusOne) UNDERSHOOT_MIN = row;
}

// -- Recovery: r_n climbs back toward 0 past the well minimum -----------------------
const RECOVERS_PAST_MIN =
  rungAt(RUNGS, 560).rMinusOne > rungAt(RUNGS, 500).rMinusOne &&
  rungAt(RUNGS, 600).rMinusOne > rungAt(RUNGS, 560).rMinusOne &&
  rungAt(RUNGS, 620).rMinusOne > rungAt(RUNGS, 600).rMinusOne &&
  rungAt(RUNGS, 620).rMinusOne < 0;

// -- eps_n sign-change: positive at small n (imp-3735), negative at large n ----------
let EPS_SIGN_CHANGE_N = null;
for (let n = 4; n <= MMAX - 4; n += 1) {
  const prev = rungAt(RUNGS, n - 1);
  const here = rungAt(RUNGS, n);
  if (EPS_SIGN_CHANGE_N === null && prev.epsCorrection > 0 && here.epsCorrection < 0) {
    EPS_SIGN_CHANGE_N = n;
    break;
  }
}

// -- Inner-resolution convergence self-check: PRIMARY (4800) vs FINER (7200) panels --
let MAX_GRID_DELTA = 0;
for (let n = 100; n <= MMAX - 4; n += 1) {
  const d = Math.abs(rungAt(RUNGS, n).rMinusOne - rungAt(RUNGS_FINER, n).rMinusOne);
  if (d > MAX_GRID_DELTA) MAX_GRID_DELTA = d;
}

// -- The imp-3731 inner=1200 artifact value at n=226 --------------------------------
const ARTIFACT_R226 = rungAt(RUNGS_ARTIFACT, 226).rMinusOne;   // ~ -2.314e-6 (reproduces imp-3731)
const CONVERGED_R226 = rungAt(RUNGS, 226).rMinusOne;           // ~ -8.738e-5 (converged)

// -- Classification ------------------------------------------------------------------
const verdict =
  UNITY.crossN === 216 &&
  UNITY.interp > 215 &&
  UNITY.interp < 216 &&
  UNDERSHOOT_MIN.n >= 480 &&
  UNDERSHOOT_MIN.n <= 520 &&
  UNDERSHOOT_MIN.rMinusOne < -5.5e-4 &&
  RECOVERS_PAST_MIN &&
  EPS_SIGN_CHANGE_N === 149 &&
  MAX_GRID_DELTA < 5e-7 &&
  Math.abs(ARTIFACT_R226 + 2.314e-6) < 1e-7
    ? 'imp-3731-CROSSING/WELL-WERE-INNER-A(tau)-QUADRATURE-ARTIFACTS-OF-inner=1200:-CONVERGING-THE-INNER' +
      '-RESOLUTION-(imp-3735-LESSON)-MOVES-r_226-FROM-2.314e-6-TO--8.738e-5,-DROPS-THE-CROSSING-TO' +
      '-n*=215.231-(FROM-225.54),-DEEPENS-THE-WELL-TO-r_min=-5.845e-4-AT-n=500-(FROM--1.13e-4-AT-276),' +
      '-AND-R_n-RECOVERS-TOWARD-1-FROM-BELOW-PAST-THE-WELL-(r_500=-5.845e-4->r_620=-5.686e-4);-eps_n' +
      '-CHANGES-SIGN-AT-n=149-(POSITIVE-BELOW-per-imp-3735,-NEGATIVE-ABOVE),-DRIVING-THE-DEEPER-WELL'
    : 'INDETERMINATE';

export const IMP3849_SADDLE_RATIO_WELL_DEPTH_INNER_CONVERGED = Object.freeze({
  id: 'imp-3849-saddle-ratio-well-depth-inner-converged',
  ticket: 'imp-3849',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsAndCorrects: 'imp-3731-saddle-ratio-crossing-extended-precision.js',
  appliesLessonFrom: 'imp-3735-moment-ratio-correction-tail.js',
  relatedCrossingOrigin: 'imp-3713-saddle-ratio-approach-to-unity.js',
  relatedCorrection: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',

  summary:
    'EXTENDS the imp-3731 compensated exact-saddle ratio R_n = |D_n|/|D_n^saddle| beyond n ~ 280 and, ' +
    'crucially, applies the imp-3735 INNER-A(tau)-quadrature-resolution lesson that imp-3731 omitted -- ' +
    'imp-3731 refined only the OUTER moment panels (NM 3200 -> 6400) while holding the inner A(tau) ' +
    'quadrature at the coarse imp-3713 value ([0,7], 1200 panels, h_inner ~ 5.8e-3). Since A(tau) is ' +
    'supported on tau in [0,~1.4] (Phi underflows beyond u ~ 1.37), the inner integral is converged here ' +
    'on [0,2] with 4800 panels (self-checked against 7200; agree to ~8e-8) and moments extended to M_628. ' +
    'FOUR findings: (1) the imp-3731 crossing/well were inner-resolution ARTIFACTS -- at inner=1200 ' +
    'r_226 = -2.314e-6 (imp-3731 near-zero crossing, reproduced), but CONVERGED r_226 = -8.738e-5 (~38x ' +
    'larger), so the converged crossing is n* = 215.231 (r_215 = +2.030e-6, r_216 = -6.749e-6), ~10 rungs ' +
    'BELOW the imp-3731 225.54; (2) the well is ~5x DEEPER and ~2x further out: r_min = -5.845e-4 ' +
    '(R ~ 0.99942) on a broad plateau at n ~ 500, not r_min = -1.13e-4 at n = 276; (3) R_n DOES recover ' +
    'toward 1 from below past the well, slowly (r_500 = -5.845e-4, r_560 = -5.797e-4, r_600 = -5.728e-4, ' +
    'r_620 = -5.686e-4); (4) eps_n = Q_n/tau*(n)^2 - 1 changes SIGN at n ~ 149 (eps_148 = +7.60e-6, ' +
    'eps_149 = -3.46e-6), going negative at large n (eps_300 = -5.05e-4) -- reconciling imp-3735 (eps > 0 ' +
    'to n = 80) and setting the deeper converged well via the eps-weighted step. Cross-checks R_3 = 3.64422, ' +
    'R_40 = 1.02440, eps_40 = 9.994e-3 tie the ladder to imp-3670/imp-3685/imp-3735. MEASUREMENT, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no QED. imp-3731 ' +
    'assertions are LEFT INTACT -- this is a higher-inner-resolution re-reading alongside it.',

  method: Object.freeze({
    ratioMeasured: 'R_n = |D_n| / |D_n^saddle|, r_n = R_n - 1 (signed, positive above 1)',
    innerConvergence: 'inner A(tau) integral on [0,2] (A(tau) supported on [0,~1.4]) with 4800 panels, self-checked vs 7200',
    imp3731InnerWasCoarse: 'imp-3731 held inner at [0,7]/1200 (h_inner ~ 5.8e-3) and refined only the outer NM',
    compensatedSummation: 'Neumaier-compensated accumulation for the A(tau) quadrature AND every moment M_m',
    overflowGuard: 'tau > 1.45 => A = 0 both skips the numerically-zero A tail and keeps tau^m finite (Inf*0=NaN guard)',
    nextOrderCoeffClosed: 'D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - M_(n+2)/((n+1)(n+2)M_n)',
    exactSaddleRate: 'D_n^saddle = C_(n+2)^saddle - C_n^saddle, C_n^saddle = tau*(n)^2/((n+1)(n+2))',
    correction: 'eps_n = Q_n/tau*(n)^2 - 1 (imp-3646), Q_n = M_(n+2)/M_n',
    rungRange: [3, MMAX - 4],
    momentsExtendedTo: MMAX,
    selfComputing: true,
  }),

  measured: Object.freeze({
    ratioFirst: rungAt(RUNGS, 3).ratio,                    // ~3.64422 (imp-3670/imp-3685 cross-check)
    ratioN40: rungAt(RUNGS, 40).ratio,                     // ~1.02440 (imp-3685 baked 1.02438)
    eps40: rungAt(RUNGS, 40).epsCorrection,                // ~9.994e-3 (imp-3735 converged 9.995e-3)
    artifactR226: ARTIFACT_R226,                           // ~ -2.314e-6 (imp-3731 inner=1200 reproduced)
    convergedR226: CONVERGED_R226,                         // ~ -8.738e-5 (inner-converged)
    unityCrossN: UNITY.crossN,                             // 216 -- first n with R_n < 1 (converged)
    unityCrossInterp: UNITY.interp,                        // ~215.231 (vs imp-3731 225.54)
    rAtCrossPrev: rungAt(RUNGS, 215).rMinusOne,            // r_215 ~ +2.030e-6
    rAtCross: rungAt(RUNGS, 216).rMinusOne,                // r_216 ~ -6.749e-6
    undershootMinN: UNDERSHOOT_MIN.n,                       // ~500 -- deepest sub-unity rung
    undershootMinR: UNDERSHOOT_MIN.rMinusOne,              // r_min ~ -5.845e-4 (R ~ 0.99942)
    rAt500: rungAt(RUNGS, 500).rMinusOne,                  // -5.845e-4
    rAt560: rungAt(RUNGS, 560).rMinusOne,                  // -5.797e-4 (recovering)
    rAt600: rungAt(RUNGS, 600).rMinusOne,                  // -5.728e-4 (recovering)
    rAt620: rungAt(RUNGS, 620).rMinusOne,                  // -5.686e-4 (recovering)
    recoversPastMin: RECOVERS_PAST_MIN,
    epsSignChangeN: EPS_SIGN_CHANGE_N,                     // ~149
    epsAt100: rungAt(RUNGS, 100).epsCorrection,            // +1.03e-3 (positive, imp-3735 regime)
    epsAt200: rungAt(RUNGS, 200).epsCorrection,            // -3.43e-4 (negative)
    epsAt300: rungAt(RUNGS, 300).epsCorrection,            // -5.05e-4 (negative)
    maxGridDelta: MAX_GRID_DELTA,                           // ~8.4e-8 (inner 4800 vs 7200)
    verdict,
  }),

  interpretation: Object.freeze({
    innerResolutionArtifact:
      'The imp-3731 crossing n* = 225.54 and its well (r_min = -1.13e-4 at n = 276) were artifacts of the ' +
      'coarse inner A(tau) quadrature ([0,7], 1200 panels) that imp-3731 inherited from imp-3713 and never ' +
      'refined -- its grid-convergence self-check varied the OUTER moment panels, the axis the answer is ' +
      'insensitive to, exactly the imp-3735 inner-resolution lesson. At inner = 1200 r_226 = -2.314e-6 ' +
      '(reproduced here); converging the inner quadrature drives r_226 to -8.738e-5, a ~38x larger magnitude.',
    convergedCrossingAndWell:
      'At converged inner resolution the unity crossing is n* = 215.231 (r_215 = +2.030e-6, r_216 = -6.749e-6), ' +
      '~10 rungs below imp-3731, and the sub-unity well is ~5x deeper and ~2x further out: r_min = -5.845e-4 ' +
      '(R ~ 0.99942) on a broad plateau near n = 500, not r_min = -1.13e-4 at n = 276.',
    recoversFromBelow:
      'The ticket question -- does R_n recover toward 1 or stay below -- is answered: R_n stays BELOW 1 across ' +
      'the whole extended range but RECOVERS toward 1 from below past the well (r_500 = -5.845e-4, ' +
      'r_560 = -5.797e-4, r_600 = -5.728e-4, r_620 = -5.686e-4), consistent with the eps_n tail vanishing.',
    epsSignChangeDrivesWell:
      'eps_n = Q_n/tau*(n)^2 - 1 stays positive to n ~ 148 (matching imp-3735 to n = 80) then changes SIGN ' +
      'at n ~ 149 and goes negative (eps_300 = -5.05e-4): at large n Q_n dips below its Laplace-saddle ' +
      'estimate. The undershoot is still the eps-weighted n-difference in D_n = D_n^saddle + [C_(n+2)^saddle ' +
      'eps_(n+2) - C_n^saddle eps_n], but with the CONVERGED sign-changing eps_n, whose |eps_n| peak sets the ' +
      'deeper well and whose decay drives the recovery R_n -> 1 from below for n >> 500.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    correctsSiblingHeadline: true,
    leavesImp3731AssertionsIntact: true,
    derivationScope:
      'Pins the CONVERGED shape of the exact-saddle ratio R_n vs 1 (crossing, well depth, recovery, eps sign) ' +
      'at higher inner A(tau) quadrature resolution than imp-3731, showing the imp-3731 crossing/well were ' +
      'inner-quadrature-limited. NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    gridStabilityNotCertifiedBound:
      'Values are grid-CONVERGENCE stable (inner 4800 vs 7200 panels agree to ~8e-8); the shared finite ' +
      'NPHI = 10 kernel truncation and Simpson order remain the residual floor, so the eps_n sign-change and ' +
      'the well depth are stable located values of this truncated-kernel model, not certified error bounds.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3849_SADDLE_RATIO_WELL_DEPTH_INNER_CONVERGED_ASSERTIONS = [
  {
    id: 'imp3849-imp3731-crossing-was-inner-resolution-artifact',
    why: 'THE CENTRAL RESULT: at imp-3731 inner resolution ([0,7], 1200 panels) r_226 = -2.314e-6 (its ' +
         'near-zero crossing, reproduced), but converging the inner A(tau) quadrature drives r_226 to ' +
         '~ -8.738e-5 -- a ~38x larger magnitude, so the imp-3731 crossing/well were inner-quadrature artifacts.',
    holds: () =>
      Math.abs(ARTIFACT_R226 + 2.314e-6) < 1e-7 &&
      CONVERGED_R226 < -8e-5 &&
      CONVERGED_R226 > -9e-5 &&
      Math.abs(CONVERGED_R226 - ARTIFACT_R226) > 5e-5,
  },
  {
    id: 'imp3849-converged-crossing-below-imp3731',
    why: 'The converged unity crossing is n* ~ 215.23 (first-negative at n = 216, r_215 > 0 > r_216), ~10 ' +
         'rungs BELOW the imp-3731 inner=1200 value of 225.54.',
    holds: () =>
      UNITY.crossN === 216 &&
      UNITY.interp > 215 &&
      UNITY.interp < 216 &&
      rungAt(RUNGS, 215).rMinusOne > 0 &&
      rungAt(RUNGS, 216).rMinusOne < 0,
  },
  {
    id: 'imp3849-well-deeper-and-further-out',
    why: 'The converged sub-unity well is ~5x DEEPER and ~2x further out: minimum r_min ~ -5.845e-4 ' +
         '(R ~ 0.99942) on a broad plateau near n = 500, vs the imp-3731 r_min = -1.13e-4 at n = 276.',
    holds: () =>
      UNDERSHOOT_MIN.n >= 480 &&
      UNDERSHOOT_MIN.n <= 520 &&
      UNDERSHOOT_MIN.rMinusOne < -5.5e-4 &&
      UNDERSHOOT_MIN.rMinusOne > -6.5e-4,
  },
  {
    id: 'imp3849-recovers-toward-unity-from-below',
    why: 'Past the well R_n recovers toward 1 from below, monotone: r_500 < r_560 < r_600 < r_620 < 0.',
    holds: () =>
      rungAt(RUNGS, 500).rMinusOne < rungAt(RUNGS, 560).rMinusOne &&
      rungAt(RUNGS, 560).rMinusOne < rungAt(RUNGS, 600).rMinusOne &&
      rungAt(RUNGS, 600).rMinusOne < rungAt(RUNGS, 620).rMinusOne &&
      rungAt(RUNGS, 620).rMinusOne < 0,
  },
  {
    id: 'imp3849-eps-changes-sign-at-n149',
    why: 'eps_n = Q_n/tau*(n)^2 - 1 stays positive to n ~ 148 (matching imp-3735 to n = 80) then changes ' +
         'sign at n = 149 (eps_148 > 0 > eps_149) and is negative at large n (eps_300 < 0).',
    holds: () =>
      EPS_SIGN_CHANGE_N === 149 &&
      rungAt(RUNGS, 100).epsCorrection > 0 &&
      rungAt(RUNGS, 200).epsCorrection < 0 &&
      rungAt(RUNGS, 300).epsCorrection < 0,
  },
  {
    id: 'imp3849-inner-resolution-converged',
    why: 'THE CONVERGENCE SELF-CHECK: the PRIMARY (4800 inner panels) and FINER (7200) grids agree to ' +
         '< 5e-7 across all rungs n >= 100 (max ~8.4e-8), so the reported values are inner-resolution-pinned.',
    holds: () => MAX_GRID_DELTA < 5e-7,
  },
  {
    id: 'imp3849-cross-check-imp3670-n3-ratio',
    why: 'Cross-check vs the certified ladder: R_3 must reproduce the imp-3670/imp-3685 baked 3.64422 ' +
         '(small-n R is inner-resolution-insensitive).',
    holds: () => Math.abs(rungAt(RUNGS, 3).ratio - 3.64422) < 1e-4,
  },
  {
    id: 'imp3849-cross-check-imp3685-n40-ratio',
    why: 'Cross-check vs the certified ladder: R_40 must reproduce the imp-3685 baked saddleDnRatioLast ' +
         '1.02438 to ~1e-4 (converged R_40 = 1.02440).',
    holds: () => Math.abs(rungAt(RUNGS, 40).ratio - 1.02440) < 1e-4,
  },
  {
    id: 'imp3849-cross-check-imp3735-eps40',
    why: 'Cross-check vs imp-3735: the converged eps_40 must reproduce the imp-3735 converged 9.995e-3 ' +
         '(and imp-3664 rho_40 ~ 1.005e-2) to ~1%.',
    holds: () => Math.abs(rungAt(RUNGS, 40).epsCorrection - 9.995e-3) / 9.995e-3 < 0.01,
  },
  {
    id: 'imp3849-verdict-not-indeterminate',
    why: 'The classified verdict must record the inner-resolution artifact, the lowered crossing, the ' +
         'deeper well, the recovery, and the eps sign-change -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3849-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement only, grid-stability not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA, and ' +
         'imp-3731 assertions left intact.',
    holds: () => {
      const c = IMP3849_SADDLE_RATIO_WELL_DEPTH_INNER_CONVERGED.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        c.leavesImp3731AssertionsIntact === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3849_SADDLE_RATIO_WELL_DEPTH_INNER_CONVERGED_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3849-saddle-ratio-well-depth-inner-converged assertion failed: ${assertion.id}`);
  }
}

export default IMP3849_SADDLE_RATIO_WELL_DEPTH_INNER_CONVERGED;
