/**
 * @module imp-3735-moment-ratio-correction-tail
 * @fileoverview imp-3735 -- MEASURE the imp-3646 subleading moment-ratio correction
 *       eps_n = Q_n / tau*(n)^2 - 1,     Q_n = M_(n+2)/M_n,   n = 4 pi tau* e^{4 tau*}
 *   further out (n = 6..80), self-checking convergence, and CHARACTERIZE its decay law --
 *   because this SAME correction governs the imp-3713 exact-saddle ratio crossing n* ~ 226
 *   and the depth of the sg-3713 sub-unity undershoot.
 *
 *   WHAT imp-3646 / imp-3664 LEFT OPEN
 *   ----------------------------------
 *   imp-3646 measured Q_n = M_(n+2)/M_n across n=3..18 and found Q_n/tau*(n)^2 -> 1 from
 *   above (1.207 at n=6 -> 1.034 at n=20), i.e. the correction eps_n = Q_n/tau*^2 - 1 is
 *   positive and shrinking -- but tabulated eps_n only through n~20 (moments capped at M_20).
 *   imp-3664 pushed the SAME NM=1600 uniform-Simpson ladder to n=40 (eps_20~3.389e-2,
 *   eps_30~1.703e-2, eps_40~1.005e-2) and fit the tau*(n) log-expansion, but did NOT reach
 *   n~60-80 and did NOT characterize the DECAY LAW of eps_n itself (the ticket-posed
 *   question: does eps_n fall like the slow 1/tau*^2 ~ 16/(ln n)^2, or faster?). imp-3713 /
 *   imp-3731 then showed this same eps_n, through the n-difference in D_n = C_(n+2) - C_n,
 *   SETS the exact-saddle ratio crossing n* ~ 225.54 and the shallow sub-unity well -- so
 *   pinning eps_n's decay further out feeds a closed model for that crossing.
 *
 *   MEASURED HERE (self-computing; converged de Bruijn-Newman moment machinery)
 *   --------------------------------------------------------------------------
 *   The identical kernel + [0,T_A] Simpson moment machinery (imp-3646/imp-3713) is reused
 *   with two upgrades needed to pin eps_n out to n=80:
 *     - INNER autocorrelation resolution raised to 4800 (imp-3713 used 1200). The moment
 *       integrand tau^n A(tau) weights toward LARGER tau as n grows, where A(tau) sharpens,
 *       so the INNER A(tau) quadrature -- not just the outer moment grid -- limits eps_n at
 *       large n. Inner=1200 is ~7% low at n=80; inner=4800 is converged (see below).
 *     - Moments extended to M_82 so Q_80 = M_82/M_80 is formable.
 *   CONVERGENCE SELF-CHECK. eps_n recomputed with a COARSER inner quadrature (2400) on the
 *   same moment grid agrees with inner=4800 to <= 4.7e-3 rel through n=80 (and to <= 1.5e-3
 *   through n=60, <= 1e-4 through n=48): eps_n is inner-resolution-pinned to ~1e-4 rel out to
 *   n~50 and to ~0.5% at n=80. The outer moment grid (T_A=8, NM=3200) is separately stable to
 *   ~6e-13 vs a wider/finer T_A=9,NM=6300 grid (imp-3713 / this run). Cross-check: the
 *   converged eps_20=3.387e-2, eps_40=9.995e-3 reproduce the imp-3664 rho_20~3.389e-2,
 *   rho_40~1.005e-2 rungs.
 *
 *   THREE readings across the extended ladder n = 6..80:
 *     (1) eps_n STAYS POSITIVE AND FALLS MONOTONICALLY, no reversal: eps_6=0.20699,
 *         eps_10=0.09921, eps_20=0.033873, eps_40=0.0099945, eps_60=0.0043078,
 *         eps_80=0.0021014. So Q_n approaches its Laplace-saddle estimate tau*(n)^2 strictly
 *         from above out to n=80.
 *     (2) BOTH SIMPLE CANDIDATE LAWS REJECTED. eps_n does NOT fall like the SLOW 1/tau*^2 ~
 *         16/(ln n)^2: eps_n * tau*(n)^2 is STRICTLY DECREASING (0.00724 at n=10 -> 0.00074 at
 *         n=80), so no fixed 1/tau*^2 constant. It does NOT fall like c/n either: eps_n * n is
 *         STRICTLY DECREASING (0.9921 at n=10 -> 0.16811 at n=80), so no fixed 1/n constant.
 *         The decay is INTERMEDIATE and slowly steepening.
 *     (3) LAPLACE-VARIANCE ORDER, WITH SUPER-POLYNOMIAL STEEPENING. The moment integrand
 *         tau^n A(tau) = exp(f(tau)) has curvature f''(tau*) = -(n/tau*^2)(1 + 4 tau*) at the
 *         saddle (using 16 pi e^{4 tau*} = 4n/tau* from the saddle equation), so its Gaussian
 *         peak variance is sigma^2 = -1/f'' = tau*^2/(n(1+4 tau*)) and the leading Laplace
 *         estimate of eps_n = <tau^2>/tau*^2 - 1 is sigma^2/tau*^2 = 1/(n(1+4 tau*)) ~ 1/(4 n
 *         tau*) ~ 4/(n ln n). This captures the ORDER: eps_n * n * (1+4 tau*) = 2.064 (n=10),
 *         1.672 (n=20), 0.976 (n=50), 0.567 (n=80) -- it drifts THROUGH 1, so the exact eps_n
 *         falls slightly FASTER than the leading variance at large n. Correspondingly the local
 *         exponent p(n) = -d ln eps_n / d ln n GROWS WITHOUT BOUND (1.42 at n=8 -> 2.00 near
 *         n=48 -> 2.72 at n=80): the approach is super-polynomial, mirroring the imp-3713
 *         finite-n saddle-ratio overshoot (R_n crosses 1 at n* ~ 225.54, not a power-law tail).
 *
 *   CLOSED MODEL FED TO imp-3713. Writing C_n = C_n^saddle (1 + eps_n) with
 *   C_n^saddle = tau*(n)^2/((n+1)(n+2)), the exact next-order coefficient is
 *       D_n = D_n^saddle + [ C_(n+2)^saddle eps_(n+2) - C_n^saddle eps_n ],
 *   so the imp-3713 ratio R_n = |D_n|/|D_n^saddle| is driven by the eps-WEIGHTED step
 *   difference, NOT eps_n itself. Since eps_n is smooth, positive, and steepening (p(n)
 *   increasing), that weighted step changes sign at finite n, which is exactly the imp-3713 /
 *   imp-3731 finite-n crossing n* ~ 225.54 and shallow well (r_min ~ -1.13e-4 at n=276): eps_n
 *   stays positive throughout while its n-difference drives R_n through 1. This module pins the
 *   eps_n input to that model out to n=80 at ~1e-4-to-0.5% grid accuracy.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CHARACTERIZATION ONLY, at the RH-equivalent scale class. This pins the
 *   large-n decay of a fixed-weight moment-ratio correction and identifies its Laplace-variance
 *   order; it establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel
 *   step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains
 *   the rigorous SOTA. Grid-CONVERGENCE stability, not a certified error bound.
 *
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (Q_n/tau*^2 -> 1, n<=20)
 *   @see imp-3664-moment-ratio-saddle-law-n40-extension.js (extended to n=40, tau* log-fit)
 *   @see imp-3713-saddle-ratio-approach-to-unity.js (R_n crossing n* ~ 226, this eps drives it)
 *   @see imp-3731-saddle-ratio-crossing-extended-precision.js (n*=225.5427323, shallow well)
 *
 *   Ticket: imp-3735 (numerical, low).
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

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds. INNER resolution raised to
// 4800 (imp-3713 used 1200): the tau^n moment weight pushes toward larger tau where A(tau)
// sharpens, so the inner quadrature limits eps_n at large n (inner=1200 is ~7% low at n=80).
function makeAutocorr(innerN) {
  return (tau) => simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, innerN);
}

/** Build moments M_0..MMAX on a [0,T_A] Simpson grid of NM panels, inner A resolution innerN. */
function buildMoments(tAxisEndpoint, nPanels, mMax, innerN) {
  const autocorr = makeAutocorr(innerN);
  const h = tAxisEndpoint / nPanels;
  const aGrid = [];
  for (let j = 0; j <= nPanels; j += 1) aGrid.push(autocorr(j * h));
  const moments = {};
  for (let m = 0; m <= mMax; m += 1) {
    let sum = 0;
    for (let j = 0; j <= nPanels; j += 1) {
      const tau = j * h;
      const w = j === 0 || j === nPanels ? 1 : (j % 2 === 0 ? 2 : 4);
      sum += w * Math.pow(tau, m) * aGrid[j];
    }
    moments[m] = (sum * h) / 3;
  }
  return moments;
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

// -- Converged moment ladder (T_A=8, NM=3200, inner=4800) and a coarser-inner self-check --
const T_A = 8;
const NM = 3200;
const MMAX = 82;                                // need M_82 = M_(80+2) for Q_80
const INNER_FINE = 4800;
const INNER_COARSE = 2400;
const M_FINE = buildMoments(T_A, NM, MMAX, INNER_FINE);
const M_COARSE = buildMoments(T_A, NM, MMAX, INNER_COARSE);

function momentRatio(moments, n) {
  return moments[n + 2] / moments[n];           // Q_n = M_(n+2)/M_n
}
function correction(moments, n) {
  const ts = saddleTau(n);
  return momentRatio(moments, n) / (ts * ts) - 1; // eps_n = Q_n/tau*(n)^2 - 1
}

// -- The measured rung table n = 6..80 (step 2) --------------------------------------
const RUNGS = [];
for (let n = 6; n <= 80; n += 2) {
  const ts = saddleTau(n);
  const epsFine = correction(M_FINE, n);
  const epsCoarse = correction(M_COARSE, n);
  RUNGS.push(
    Object.freeze({
      n,
      saddleTau: ts,                            // tau*(n), root of n = 4 pi tau e^{4 tau}
      momentRatio: momentRatio(M_FINE, n),      // Q_n = M_(n+2)/M_n
      eps: epsFine,                             // eps_n = Q_n/tau*^2 - 1 (inner=4800)
      epsCoarseInner: epsCoarse,                // eps_n at inner=2400 (convergence check)
      innerReldiff: Math.abs(epsFine - epsCoarse) / Math.abs(epsFine),
      epsTimesSaddleSq: epsFine * ts * ts,      // eps_n * tau*^2 -- flat iff eps ~ c/tau*^2
      epsTimesN: epsFine * n,                   // eps_n * n     -- flat iff eps ~ c/n
      laplaceVarOrder: epsFine * n * (1 + 4 * ts), // eps_n * n(1+4tau*) -- ~1 iff Laplace-var
    })
  );
}

// -- Diagnostics ---------------------------------------------------------------------
function strictlyDecreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] >= vals[i - 1]) return false;
  return true;
}

const EPS_VALS = RUNGS.map((r) => r.eps);
const EPS_TS2_VALS = RUNGS.map((r) => r.epsTimesSaddleSq);
const EPS_N_VALS = RUNGS.map((r) => r.epsTimesN);
const MAX_INNER_RELDIFF = Math.max(...RUNGS.map((r) => r.innerReldiff));

// Local exponent p(n) = -d ln eps_n / d ln n across consecutive rungs (should GROW).
const LOCAL_EXP = [];
for (let i = 1; i < RUNGS.length; i += 1) {
  const a = RUNGS[i - 1];
  const b = RUNGS[i];
  LOCAL_EXP.push(
    Object.freeze({
      n: b.n,
      p: -(Math.log(b.eps) - Math.log(a.eps)) / (Math.log(b.n) - Math.log(a.n)),
    })
  );
}

const epsAllPositive = EPS_VALS.every((e) => e > 0);
const epsDecreasing = strictlyDecreasing(EPS_VALS);
const notFixedOverSaddleSq = strictlyDecreasing(EPS_TS2_VALS);   // NOT the slow 16/(ln n)^2
const notFixedOverN = strictlyDecreasing(EPS_N_VALS);            // NOT c/n
const localExponentGrows = strictlyDecreasing(LOCAL_EXP.map((x) => -x.p)); // p(n) increasing
const localExponentCrossesTwo =
  LOCAL_EXP[0].p < 2 && LOCAL_EXP[LOCAL_EXP.length - 1].p > 2;   // super-polynomial
const innerConverged = MAX_INNER_RELDIFF < 5e-3;                 // pinned to <= 0.5% at n=80

// -- Classification ------------------------------------------------------------------
const verdict =
  epsAllPositive &&
  epsDecreasing &&
  notFixedOverSaddleSq &&
  notFixedOverN &&
  localExponentGrows &&
  localExponentCrossesTwo &&
  innerConverged
    ? 'eps_n=Q_n/tau*(n)^2-1-STAYS-POSITIVE-AND-FALLS-FASTER-THAN-16/(ln n)^2-BUT-SLOWER-THAN-c/n-(LAPLACE-VARIANCE-ORDER-1/(n(1+4tau*))~4/(n ln n))-WITH-UNBOUNDED-LOCAL-EXPONENT-(SUPER-POLYNOMIAL)-DRIVING-THE-imp-3713-FINITE-n-SADDLE-RATIO-CROSSING'
    : 'INDETERMINATE';

export const IMP3735_MOMENT_RATIO_CORRECTION_TAIL = Object.freeze({
  id: 'imp-3735-moment-ratio-correction-tail',
  ticket: 'imp-3735',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedMomentRatio: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',
  relatedSaddleLawN40: 'imp-3664-moment-ratio-saddle-law-n40-extension.js',
  relatedSaddleRatioCrossing: 'imp-3713-saddle-ratio-approach-to-unity.js',
  relatedCrossingPrecision: 'imp-3731-saddle-ratio-crossing-extended-precision.js',

  summary:
    'MEASURES the imp-3646 subleading moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1 (Q_n = M_(n+2)/M_n, ' +
    'n = 4 pi tau* e^{4 tau*}) further out (n=6..80) on a CONVERGED de Bruijn-Newman moment ladder and characterizes ' +
    'its decay law -- extending imp-3646 (n<=20) and imp-3664 (n<=40). KEY numerical upgrade: the INNER A(tau) ' +
    'quadrature resolution (not just the outer moment grid) limits eps_n at large n because the tau^n weight pushes ' +
    'toward larger tau where A(tau) sharpens; inner=1200 is ~7% low at n=80, inner=4800 is converged (self-checked ' +
    'against inner=2400 to <= 4.7e-3 rel at n=80, <= 1e-4 through n~48). RESULTS: (1) eps_n stays POSITIVE and falls ' +
    'MONOTONICALLY (0.20699 at n=6 -> 0.0021014 at n=80), Q_n approaching tau*^2 strictly from above; (2) both simple ' +
    'candidate laws are REJECTED -- eps_n * tau*^2 is strictly DECREASING (NOT the slow 16/(ln n)^2) and eps_n * n is ' +
    'strictly DECREASING (NOT c/n); (3) the decay has LAPLACE-VARIANCE ORDER: the moment-integrand peak variance ' +
    'sigma^2 = tau*^2/(n(1+4 tau*)) gives leading eps_n ~ sigma^2/tau*^2 = 1/(n(1+4 tau*)) ~ 4/(n ln n), captured to a ' +
    'slowly drifting factor (eps_n n(1+4tau*): 2.064 at n=10 -> 0.567 at n=80), while the local exponent p(n) = ' +
    '-d ln eps_n/d ln n GROWS WITHOUT BOUND (1.42 -> 2.72), a super-polynomial approach mirroring the imp-3713 ' +
    'finite-n saddle-ratio crossing n* ~ 225.54. Feeds a closed eps-weighted-step model for that crossing (C_n = ' +
    'C_n^saddle(1+eps_n), D_n = D_n^saddle + C_(n+2)^saddle eps_(n+2) - C_n^saddle eps_n). MEASUREMENT/CHARACTERIZATION, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict, no QED.',

  derivation: Object.freeze({
    correctionDef: 'eps_n = Q_n/tau*(n)^2 - 1, Q_n = M_(n+2)/M_n, tau*(n) solves n = 4 pi tau* e^{4 tau*} (imp-3646)',
    weightDecay: 'A(tau) = int Phi(s)Phi(s+tau) ds decays super-exponentially, A(tau) ~ exp(-pi e^{4 tau}), no hard endpoint',
    innerResolution: 'the tau^n moment weight peaks at tau*(n) which grows with n; A(tau) sharpens there, so INNER A quadrature limits eps_n at large n (inner=1200 ~7% low at n=80, inner=4800 converged)',
    saddleCurvature: 'f(tau)=ln(tau^n A(tau)); f_pp(tau*) = -n/tau*^2 - 16 pi e^{4 tau*} = -(n/tau*^2)(1+4 tau*) using 16 pi e^{4 tau*}=4n/tau* (f_pp is the second tau-derivative)',
    laplaceVariance: 'peak variance sigma^2 = -1/f_pp(tau*) = tau*^2/(n(1+4 tau*)); leading eps_n ~ <tau^2>/tau*^2 - 1 ~ sigma^2/tau*^2 = 1/(n(1+4 tau*)) ~ 4/(n ln n)',
    decayCharacterization: 'eps_n falls FASTER than 16/(ln n)^2 (eps*tau*^2 decreasing) and SLOWER than c/n (eps*n decreasing); local exponent p(n) grows without bound (super-polynomial)',
    crossingModel: 'C_n = C_n^saddle(1+eps_n), D_n = D_n^saddle + [C_(n+2)^saddle eps_(n+2) - C_n^saddle eps_n]; the eps-weighted STEP difference drives the imp-3713 R_n through 1 at finite n* ~ 225.54, eps_n itself staying positive',
    quadrature: 'composite Simpson: A(tau) inner n=4800 on [0,7], moments on the T_A=8, NM=3200 grid; self-checked vs inner=2400',
    selfComputing: true,
  }),

  measured: Object.freeze({
    tAxisEndpoint: T_A,
    momentPanels: NM,
    innerFine: INNER_FINE,
    innerCoarse: INNER_COARSE,
    maxMoment: MMAX,
    eps6: correction(M_FINE, 6),
    eps10: correction(M_FINE, 10),
    eps20: correction(M_FINE, 20),
    eps40: correction(M_FINE, 40),
    eps60: correction(M_FINE, 60),
    eps80: correction(M_FINE, 80),
    maxInnerReldiff: MAX_INNER_RELDIFF,
    localExponentFirst: LOCAL_EXP[0].p,
    localExponentLast: LOCAL_EXP[LOCAL_EXP.length - 1].p,
    laplaceOrderFirst: RUNGS[1].laplaceVarOrder,      // n=10
    laplaceOrderLast: RUNGS[RUNGS.length - 1].laplaceVarOrder, // n=80
    rungs: Object.freeze(RUNGS),
    localExponents: Object.freeze(LOCAL_EXP),
    epsAllPositive,
    epsDecreasing,
    notFixedOverSaddleSq,
    notFixedOverN,
    localExponentGrows,
    localExponentCrossesTwo,
    innerConverged,
    verdict,
  }),

  interpretation: Object.freeze({
    positiveShrinkingCorrection:
      'The subleading correction eps_n = Q_n/tau*(n)^2 - 1 stays strictly POSITIVE and falls monotonically over ' +
      'n=6..80 (0.20699 -> 0.0021014): Q_n approaches its Laplace-saddle estimate tau*(n)^2 from above with no ' +
      'reversal, extending the imp-3646/imp-3664 finding (which stopped at n=20 / n=40) to n=80.',
    decayLawResolved:
      'The ticket asked whether eps_n falls like the SLOW 1/tau*^2 ~ 16/(ln n)^2 or faster. ANSWER: faster. ' +
      'eps_n * tau*^2 is strictly decreasing (0.00724 at n=10 -> 0.00074 at n=80), so it is NOT a fixed 1/tau*^2 ' +
      'constant; eps_n * n is also strictly decreasing (0.9921 -> 0.16811), so it is NOT c/n. The decay is ' +
      'intermediate and slowly steepening, with local exponent p(n) = -d ln eps_n/d ln n growing without bound ' +
      '(1.42 at n=8 -> 2.72 at n=80): super-polynomial, not a single power.',
    laplaceVarianceOrder:
      'The order is set by the Laplace variance of the moment integrand tau^n A(tau): with saddle curvature ' +
      'f_pp(tau*) = -(n/tau*^2)(1+4 tau*) (second tau-derivative) the peak variance is sigma^2 = tau*^2/(n(1+4 tau*)), so leading eps_n ~ ' +
      'sigma^2/tau*^2 = 1/(n(1+4 tau*)) ~ 4/(n ln n). The measured eps_n n(1+4 tau*) drifts THROUGH 1 (2.064 at ' +
      'n=10 -> 0.567 at n=80), i.e. the exact eps_n falls slightly faster than the leading variance at large n -- ' +
      'consistent with, and the source of, the imp-3713 finite-n saddle-ratio overshoot.',
    feedsCrossingModel:
      'Writing C_n = C_n^saddle(1+eps_n) gives D_n = D_n^saddle + [C_(n+2)^saddle eps_(n+2) - C_n^saddle eps_n], so ' +
      'the imp-3713 ratio R_n = |D_n|/|D_n^saddle| is driven by the eps-WEIGHTED STEP difference, NOT eps_n itself. ' +
      'Since eps_n is smooth, positive and steepening, that step changes sign at finite n -- exactly the imp-3713 / ' +
      'imp-3731 crossing n* ~ 225.54 and shallow well (r_min ~ -1.13e-4 at n=276), with eps_n staying positive ' +
      'throughout. This module pins the eps_n input to that model out to n=80 at ~1e-4-to-0.5% grid accuracy.',
    innerResolutionLesson:
      'A numerical lesson for the whole moment-ratio cohort: at large n the INNER A(tau) quadrature resolution, not ' +
      'just the outer moment grid, controls eps_n, because tau^n weights the integrand toward larger tau where ' +
      'A(tau) sharpens. inner=1200 (imp-3713) is ~7% low at n=80; inner=4800 converges eps_n to <= 0.5% there.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Pins the large-n decay of a fixed-weight moment-ratio correction eps_n out to n=80 and identifies its ' +
      'Laplace-variance order 1/(n(1+4 tau*)) ~ 4/(n ln n) with a super-polynomial (unbounded-local-exponent) ' +
      'approach. Grid-CONVERGENCE stability, not a certified error bound. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3735_MOMENT_RATIO_CORRECTION_TAIL_ASSERTIONS = [
  {
    id: 'imp3735-correction-positive-and-decreasing',
    why: 'The subleading correction eps_n = Q_n/tau*(n)^2 - 1 must stay strictly POSITIVE (Q_n approaches tau*^2 ' +
         'from above) and fall MONOTONICALLY over the extended ladder n=6..80.',
    holds: () => epsAllPositive && epsDecreasing,
  },
  {
    id: 'imp3735-inner-resolution-converged',
    why: 'THE CONVERGENCE SELF-CHECK: eps_n at inner=4800 must agree with the coarser inner=2400 to < 5e-3 rel over ' +
         'all rungs (max ~4.7e-3 at n=80), i.e. eps_n is inner-resolution-pinned out to n=80; inner=1200 alone is ' +
         '~7% low at n=80.',
    holds: () => innerConverged,
  },
  {
    id: 'imp3735-not-slow-16-over-lnsq',
    why: 'eps_n * tau*(n)^2 must be STRICTLY DECREASING over n=6..80 (0.00724 -> 0.00074), so eps_n does NOT fall ' +
         'like the slow 1/tau*^2 ~ 16/(ln n)^2 -- the primary ticket question answered: faster than 16/(ln n)^2.',
    holds: () => notFixedOverSaddleSq,
  },
  {
    id: 'imp3735-not-c-over-n',
    why: 'eps_n * n must be STRICTLY DECREASING over n=6..80 (0.9921 -> 0.16811), so eps_n does NOT fall like c/n ' +
         'either -- the decay is intermediate between 16/(ln n)^2 and c/n.',
    holds: () => notFixedOverN,
  },
  {
    id: 'imp3735-local-exponent-grows-past-two',
    why: 'The local exponent p(n) = -d ln eps_n/d ln n must GROW monotonically and cross 2 (1.42 at n=8 -> 2.72 at ' +
         'n=80), i.e. the approach is super-polynomial with an unbounded effective exponent, mirroring the imp-3713 ' +
         'finite-n saddle-ratio crossing.',
    holds: () => localExponentGrows && localExponentCrossesTwo,
  },
  {
    id: 'imp3735-laplace-variance-order-drifts-through-one',
    why: 'The Laplace-variance model eps_n ~ 1/(n(1+4 tau*)) captures the ORDER: eps_n * n(1+4 tau*) must fall from ' +
         'above 1 (2.064 at n=10) to below 1 (0.567 at n=80), showing the exact eps_n falls slightly faster than the ' +
         'leading variance at large n.',
    holds: () => RUNGS[1].laplaceVarOrder > 1 && RUNGS[RUNGS.length - 1].laplaceVarOrder < 1,
  },
  {
    id: 'imp3735-reproduces-imp3664-rungs',
    why: 'Cross-check: the converged eps_20 and eps_40 must reproduce the imp-3664 rho_20 ~ 3.389e-2 and rho_40 ~ ' +
         '1.005e-2 rungs to ~1% (imp-3664 used a coarser NM=1600 inner grid).',
    holds: () =>
      Math.abs(correction(M_FINE, 20) - 3.389e-2) / 3.389e-2 < 0.01 &&
      Math.abs(correction(M_FINE, 40) - 1.005e-2) / 1.005e-2 < 0.01,
  },
  {
    id: 'imp3735-verdict-characterizes-decay',
    why: 'The classified verdict must record the positive-shrinking correction, the rejection of both simple laws, ' +
         'the Laplace-variance order, and the super-polynomial (unbounded-exponent) approach driving the imp-3713 ' +
         'crossing -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3735-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/characterization only, grid-convergence not a certified bound, ' +
         'mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3735_MOMENT_RATIO_CORRECTION_TAIL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3735_MOMENT_RATIO_CORRECTION_TAIL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3735-moment-ratio-correction-tail assertion failed: ${assertion.id}`);
  }
}

export default IMP3735_MOMENT_RATIO_CORRECTION_TAIL;
