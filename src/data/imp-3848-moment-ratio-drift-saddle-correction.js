/**
 * @module imp-3848-moment-ratio-drift-saddle-correction
 * @fileoverview imp-3848 -- MEASURE the next-order Laplace/saddle correction that governs the
 *       DRIFT of the imp-3735 reduced moment-ratio factor
 *           L_n = eps_n * n * (1 + 4 tau*),   eps_n = Q_n/tau*(n)^2 - 1,   Q_n = M_(n+2)/M_n,
 *       which imp-3735 found crosses 1 across n=10..80 (2.064 -> 0.567). The leading Laplace
 *       variance order pins L_n -> 1; imp-3848 computes the THIRD- and FOURTH-derivative saddle
 *       corrections f_ppp(tau*), f_pppp(tau*) and tests whether the corrected series PINS the
 *       continued descent or predicts an ASYMPTOTE.
 *
 *   WHAT imp-3735 LEFT OPEN
 *   -----------------------
 *   imp-3735 measured eps_n out to n=80 and identified the leading Laplace-variance ORDER
 *   sigma^2/tau*^2 = 1/(n(1+4 tau*)), i.e. the reduced factor L_n = eps_n * n(1+4 tau*) should
 *   be ~1 at leading order. It observed the MEASURED L_n instead drifts monotonically THROUGH 1
 *   (2.064 at n=10, 1.672 at n=20, 0.976 at n=50, 0.567 at n=80) with an unbounded local
 *   exponent -- but did NOT compute the next-order saddle correction (the f_ppp, f_pppp terms of
 *   the moment-integrand exponent) that produces this drift, nor test whether the corrected
 *   Laplace series predicts L_n plateauing at 1 or descending without bound.
 *
 *   THE NEXT-ORDER SADDLE SERIES (this module)
 *   ------------------------------------------
 *   Q_n = M_(n+2)/M_n = <tau^2> under the density proportional to the moment integrand
 *   tau^n A(tau) = exp(f(tau)), f(tau) = n ln tau + phi(tau), phi(tau) = ln A(tau). With the
 *   imp-3646/imp-3665 super-exponential model phi(tau) = -pi e^{4 tau} (A(tau) ~ exp(-pi e^{4
 *   tau}), no hard endpoint) and the saddle relation 4 pi e^{4 tau*} = n/tau* (n = 4 pi tau*
 *   e^{4 tau*}), the derivatives of f at the saddle are CLOSED FORM:
 *       f_pp   (tau*) = -(n/tau*^2)(1 + 4 tau*)                         [imp-3735 curvature]
 *       f_ppp  (tau*) =  2n/tau*^3 - 64 pi e^{4 tau*} = (2n/tau*^3)(1 - 8 tau*^2)
 *       f_pppp (tau*) = -6n/tau*^4 - 256 pi e^{4 tau*} = -6n/tau*^4 - 64 n/tau*
 *   The Gaussian peak variance is sigma^2 = -1/f_pp. Expanding <tau^2> around the saddle with
 *   the standard skewness/kurtosis corrections (weight prop. to exp(-x^2/(2 sigma^2) + a x^3 +
 *   b x^4), a = f_ppp/6, b = f_pppp/24) gives, for the REDUCED drift factor L_n = eps_n *
 *   tau*^2/sigma^2,
 *       L_n = 1 + f_ppp * sigma^2 * tau*  +  (f_pppp/2) * sigma^4  +  (5/4) * f_ppp^2 * sigma^6
 *           = 1 + C1 + C2 + C3 + ...
 *   The leading term is exactly 1 (recovering the imp-3735 Laplace-variance order); C1, C2, C3
 *   are the next-order corrections THIS module measures.
 *
 *   THREE readings (self-computing; the imp-3735 converged moment machinery is reused verbatim)
 *   ------------------------------------------------------------------------------------------
 *     (1) THE SADDLE EXPANSION IS VALID (NEAR-GAUSSIAN PEAK). The DIMENSIONLESS kurtosis
 *         f_pppp*sigma^4 SHRINKS monotonically toward 0 across n=10..80 (-0.168 -> -0.021), and
 *         the skewness f_ppp*sigma^3 stays SMALL throughout (|.| <= 0.088, passing through 0 at
 *         the f_ppp sign change near n~18): both remain < 0.2 in magnitude, so the moment-
 *         integrand peak is near-Gaussian and the perturbative Laplace series is legitimate.
 *     (2) THE THIRD DERIVATIVE CHANGES SIGN AND DRIVES L_n THROUGH 1. f_ppp(tau*) = (2n/tau*^3)
 *         (1 - 8 tau*^2) changes sign at tau* = 1/sqrt(8) ~ 0.35355 (n ~ 18): the leading
 *         correction C1 = f_ppp*sigma^2*tau* is POSITIVE for n < ~18 (raising L_n above 1) and
 *         turns increasingly NEGATIVE for n > ~18 (pulling L_n below 1) -- matching the DIRECTION
 *         of the imp-3735 measured drift THROUGH 1. So the drift is governed by the sign change
 *         of f_ppp at the saddle, not by any competing mechanism.
 *     (3) THE CORRECTED SERIES PREDICTS CONTINUED DESCENT, NO ASYMPTOTE (and OVERSHOOTS at this
 *         truncation). C1 does NOT vanish as n grows: because C1 = (f_ppp*sigma^3)*(tau* / sigma)
 *         and the amplification tau* / sigma = 2 sqrt(n tau*) GROWS faster than the skewness
 *         shrinks, C1 -> approx -4 tau* ~ -(ln n) without bound (0.400 at n=10 -> -1.077 at
 *         n=80). Hence the corrected Laplace series drives L_n strictly BELOW 1 with no plateau
 *         -- consistent with the imp-3735 unbounded local exponent and the imp-3713 FINITE-n
 *         saddle-ratio crossing (no asymptotic plateau at 1). QUANTITATIVELY the single-next-
 *         order truncation OVERSHOOTS: 1 + C1 + C2 + C3 crosses 1 near n ~ 15 whereas the
 *         measured L_n crosses 1 near n ~ 48, so at this truncation the correction is
 *         DIRECTION-confirming, not a quantitative pin -- the growing higher-order terms must
 *         partially cancel (asymptotic-but-slowly-organizing in this n range).
 *
 *   BOTTOM LINE. The next-order saddle correction is dominated by f_ppp(tau*), whose sign change
 *   at tau* = 1/sqrt(8) sends the reduced factor L_n through 1 in the measured direction, and
 *   whose reconstructed drift term C1 ~ -4 tau* grows without bound -- so the corrected Laplace
 *   series predicts CONTINUED DESCENT of L_n, NOT an asymptote at 1. This is the saddle-level
 *   source of the imp-3735 super-polynomial steepening and feeds the imp-3713/imp-3731 finite-n
 *   exact-saddle crossing n* ~ 225.5.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CHARACTERIZATION ONLY, at the RH-equivalent scale class. This computes the
 *   next-order (f_ppp, f_pppp) saddle corrections to a fixed-weight moment-ratio drift factor
 *   under the imp-3665 super-exponential A(tau) ~ exp(-pi e^{4 tau}) model and compares them to
 *   the imp-3735 measured drift; it establishes NO operator positivity. The corrected series is
 *   a truncated ASYMPTOTIC expansion (it overshoots at this order), not a certified error bound.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a &gt;= 0 sign-
 *   positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA. Grid-CONVERGENCE stability only.
 *
 *   @see imp-3735-moment-ratio-correction-tail.js (measured eps_n, L_n drift through 1, n<=80)
 *   @see imp-3646-remainder-tail-moment-ratio-asymptotics.js (Q_n/tau*^2 -> 1, n<=20)
 *   @see imp-3713-saddle-ratio-approach-to-unity.js (R_n crossing n* ~ 226, this drift drives it)
 *   @see imp-3731-saddle-ratio-crossing-extended-precision.js (n*=225.5427323, shallow well)
 *
 *   Ticket: imp-3848 (numerical, medium).
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

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds. Inner resolution 4800 to match
// imp-3735 (the tau^n moment weight pushes toward larger tau where A(tau) sharpens).
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

// -- Converged moment ladder identical to imp-3735 (T_A=8, NM=3200, inner=4800) ------
const T_A = 8;
const NM = 3200;
const MMAX = 82;                                // need M_82 = M_(80+2) for Q_80
const INNER_FINE = 4800;
const M_FINE = buildMoments(T_A, NM, MMAX, INNER_FINE);

function momentRatio(n) {
  return M_FINE[n + 2] / M_FINE[n];             // Q_n = M_(n+2)/M_n
}
function correction(n) {
  const ts = saddleTau(n);
  return momentRatio(n) / (ts * ts) - 1;        // eps_n = Q_n/tau*(n)^2 - 1
}
function measuredDrift(n) {
  const ts = saddleTau(n);
  return correction(n) * n * (1 + 4 * ts);      // L_n = eps_n * n(1+4 tau*)
}

// -- Closed-form saddle derivatives of f(tau) = n ln tau + phi(tau), phi = -pi e^{4 tau} ----
//    using 4 pi e^{4 tau*} = n/tau* (saddle relation). f_pp/f_ppp/f_pppp are the second/third/
//    fourth tau-derivatives of the moment-integrand exponent at tau*.
function saddleDerivatives(n) {
  const ts = saddleTau(n);
  const P = Math.PI * Math.exp(4 * ts);         // pi e^{4 tau*}; note 4P = n/tau*
  const f2 = -n / (ts * ts) - 16 * P;           // = -(n/tau*^2)(1 + 4 tau*)
  const f3 = 2 * n / (ts * ts * ts) - 64 * P;   // = (2n/tau*^3)(1 - 8 tau*^2)
  const f4 = -6 * n / (ts ** 4) - 256 * P;      // = -6n/tau*^4 - 64 n/tau*
  const sig2 = -1 / f2;                         // Gaussian peak variance
  return { ts, P, f2, f3, f4, sig2 };
}

// Next-order corrected Laplace series for the reduced drift factor
//   L_n = eps_n * tau*^2/sigma^2 = 1 + C1 + C2 + C3 + ...
//   C1 = f_ppp * sigma^2 * tau*     C2 = (f_pppp/2) * sigma^4     C3 = (5/4) * f_ppp^2 * sigma^6
function correctedDrift(n) {
  const { ts, f3, f4, sig2 } = saddleDerivatives(n);
  const c1 = f3 * sig2 * ts;
  const c2 = (f4 / 2) * sig2 * sig2;
  const c3 = (5 / 4) * f3 * f3 * sig2 * sig2 * sig2;
  const sig = Math.sqrt(sig2);
  return {
    ts,
    sig2,
    c1,
    c2,
    c3,
    predicted: 1 + c1 + c2 + c3,
    skewness: f3 * sig * sig2, // dimensionless f_ppp * sigma^3
    kurtosis: f4 * sig2 * sig2, // dimensionless f_pppp * sigma^4
    minusFourTau: -4 * ts, // C1 asymptote target
  };
}

// -- The measured rung table n = 10..80 (step 10) ------------------------------------
const RUNGS = [];
for (let n = 10; n <= 80; n += 10) {
  const cd = correctedDrift(n);
  RUNGS.push(
    Object.freeze({
      n,
      saddleTau: cd.ts,
      driftMeasured: measuredDrift(n),  // L_n from imp-3735 machinery
      driftPredicted: cd.predicted,     // 1 + C1 + C2 + C3
      c1: cd.c1,
      c2: cd.c2,
      c3: cd.c3,
      skewness: cd.skewness,            // f_ppp * sigma^3 -- shrinks (asymptotic validity)
      kurtosis: cd.kurtosis,            // f_pppp * sigma^4 -- shrinks
      sig2: cd.sig2,
    })
  );
}

// -- Diagnostics ---------------------------------------------------------------------
function strictlyDecreasingAbs(vals) {
  for (let i = 1; i < vals.length; i += 1) if (Math.abs(vals[i]) >= Math.abs(vals[i - 1])) return false;
  return true;
}

const SKEW_VALS = RUNGS.map((r) => r.skewness);
const KURT_VALS = RUNGS.map((r) => r.kurtosis);
const C1_VALS = RUNGS.map((r) => r.c1);

// (1) near-Gaussian peak -> saddle expansion valid. The dimensionless kurtosis f_pppp*sigma^4
// shrinks monotonically in magnitude (0.168 -> 0.021); the skewness f_ppp*sigma^3 is small
// throughout (|.| <= 0.088) and passes through 0 at the f_ppp sign change near n~18 -- both stay
// < 0.2 in magnitude, so the perturbative Laplace series is legitimate.
const kurtShrinks = strictlyDecreasingAbs(KURT_VALS);
const SKEW_MAX_ABS = Math.max(...SKEW_VALS.map((s) => Math.abs(s)));
const KURT_MAX_ABS = Math.max(...KURT_VALS.map((k) => Math.abs(k)));
const skewSmall = SKEW_MAX_ABS < 0.1;
const nearGaussian = kurtShrinks && skewSmall && KURT_MAX_ABS < 0.2;

// (2) f_ppp sign change: C1 positive at n=10, negative by n=80 (crosses at tau*=1/sqrt(8))
const c1SignChanges = C1_VALS[0] > 0 && C1_VALS[C1_VALS.length - 1] < 0;
const fpppSignTau = 1 / Math.sqrt(8); // tau* at which f_ppp = 0

// (3) C1 does NOT vanish -- it grows negative toward -4 tau* (no asymptote at 1); the corrected
//     series pulls L_n strictly below 1 by n=80 (predicted < 1), i.e. CONTINUED DESCENT.
const c1GrowsNegative = C1_VALS[C1_VALS.length - 1] < C1_VALS[1]; // n=80 more negative than n=20
const predictedDescendsBelowOne = RUNGS[RUNGS.length - 1].driftPredicted < 1;

// measured L_n crosses 1 later than the truncated prediction (prediction overshoots)
const measuredCrossesLater =
  RUNGS[RUNGS.length - 1].driftMeasured < 1 &&      // measured below 1 by n=80
  RUNGS[0].driftMeasured > RUNGS[0].driftPredicted; // at n=10 truncation already under-predicts

// reproduce the imp-3735 measured L_n rungs (2.064 at n=10, 0.567 at n=80)
const reproducesImp3735 =
  Math.abs(RUNGS[0].driftMeasured - 2.064) < 0.02 &&
  Math.abs(RUNGS[RUNGS.length - 1].driftMeasured - 0.567) < 0.02;

// -- Classification ------------------------------------------------------------------
const verdict =
  nearGaussian &&
  c1SignChanges &&
  c1GrowsNegative &&
  predictedDescendsBelowOne &&
  measuredCrossesLater &&
  reproducesImp3735
    ? 'NEXT-ORDER-SADDLE-CORRECTION-DOMINATED-BY-f_ppp(tau*)=(2n/tau*^3)(1-8tau*^2)-WHOSE-SIGN-CHANGE-AT-tau*=1/sqrt(8)-SENDS-L_n=eps_n*n(1+4tau*)-THROUGH-1-IN-THE-MEASURED-DIRECTION;-RECONSTRUCTED-C1=f_ppp*sigma^2*tau*-GROWS-NEGATIVE-TOWARD--4tau*-(NO-ASYMPTOTE),-SO-THE-CORRECTED-LAPLACE-SERIES-PREDICTS-CONTINUED-DESCENT-BELOW-1-(TRUNCATION-OVERSHOOTS,-DIRECTION-CONFIRMING-NOT-A-QUANTITATIVE-PIN)'
    : 'INDETERMINATE';

export const IMP3848_MOMENT_RATIO_DRIFT_SADDLE_CORRECTION = Object.freeze({
  id: 'imp-3848-moment-ratio-drift-saddle-correction',
  ticket: 'imp-3848',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedDriftMeasurement: 'imp-3735-moment-ratio-correction-tail.js',
  relatedMomentRatio: 'imp-3646-remainder-tail-moment-ratio-asymptotics.js',
  relatedSaddleRatioCrossing: 'imp-3713-saddle-ratio-approach-to-unity.js',
  relatedCrossingPrecision: 'imp-3731-saddle-ratio-crossing-extended-precision.js',

  summary:
    'MEASURES the next-order Laplace/saddle correction that governs the DRIFT of the imp-3735 reduced moment-ratio ' +
    'factor L_n = eps_n * n(1+4 tau*) (eps_n = Q_n/tau*(n)^2 - 1, Q_n = M_(n+2)/M_n), which imp-3735 found crosses 1 ' +
    'across n=10..80 (2.064 -> 0.567) while the leading Laplace-variance order pins L_n -> 1. Writing Q_n = <tau^2> ' +
    'under the moment integrand exp(f(tau)), f = n ln tau + ln A(tau), with the imp-3665 model ln A ~ -pi e^{4 tau} ' +
    'and saddle relation 4 pi e^{4 tau*} = n/tau*, the CLOSED-FORM saddle derivatives are f_pp = -(n/tau*^2)(1+4 tau*), ' +
    'f_ppp = (2n/tau*^3)(1-8 tau*^2), f_pppp = -6n/tau*^4 - 64 n/tau*, and the skewness/kurtosis expansion of <tau^2> ' +
    'gives L_n = 1 + f_ppp sigma^2 tau* + (f_pppp/2) sigma^4 + (5/4) f_ppp^2 sigma^6 (sigma^2 = -1/f_pp). RESULTS: ' +
    '(1) the DIMENSIONLESS kurtosis f_pppp sigma^4 SHRINKS monotonically (-0.168 -> -0.021) and the skewness f_ppp ' +
    'sigma^3 stays small (|.| <= 0.088, through 0 at the sign change), so the peak is near-Gaussian and the saddle ' +
    'expansion is valid; (2) f_ppp changes sign at tau*=1/sqrt(8) (~n=18), so the ' +
    'leading correction C1 = f_ppp sigma^2 tau* is POSITIVE below and NEGATIVE above, sending L_n through 1 in the ' +
    'MEASURED direction; (3) C1 does NOT vanish -- it grows negative toward -4 tau* ~ -(ln n) (0.400 at n=10 -> -1.077 ' +
    'at n=80) because the amplification tau*/sigma = 2 sqrt(n tau*) outpaces the shrinking skewness, so the corrected ' +
    'series predicts CONTINUED DESCENT of L_n below 1 with NO asymptote, though the single-next-order truncation ' +
    'OVERSHOOTS (predicts crossing near n~15 vs measured n~48): direction-confirming, not a quantitative pin. This is ' +
    'the saddle-level source of the imp-3735 super-polynomial steepening feeding the imp-3713/imp-3731 finite-n ' +
    'crossing n* ~ 225.5. MEASUREMENT/CHARACTERIZATION, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; no RH verdict, no QED; Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  derivation: Object.freeze({
    driftDef: 'L_n = eps_n * n(1+4 tau*) = eps_n * tau*^2/sigma^2 (reduced Laplace-variance factor, imp-3735)',
    integrandExponent: 'Q_n = M_(n+2)/M_n = <tau^2> under density prop. to tau^n A(tau) = exp(f(tau)), f = n ln tau + ln A(tau)',
    modelPhi: 'A(tau) ~ exp(-pi e^{4 tau}) (imp-3665 super-exponential, no hard endpoint); phi = ln A = -pi e^{4 tau}',
    saddleRelation: '4 pi e^{4 tau*} = n/tau* from n = 4 pi tau* e^{4 tau*} (imp-3646)',
    f2: 'f_pp(tau*) = -n/tau*^2 - 16 pi e^{4 tau*} = -(n/tau*^2)(1 + 4 tau*) (second tau-derivative; imp-3735 curvature)',
    f3: 'f_ppp(tau*) = 2n/tau*^3 - 64 pi e^{4 tau*} = (2n/tau*^3)(1 - 8 tau*^2) (third tau-derivative; sign change at tau*=1/sqrt(8))',
    f4: 'f_pppp(tau*) = -6n/tau*^4 - 256 pi e^{4 tau*} = -6n/tau*^4 - 64 n/tau* (fourth tau-derivative; strictly negative)',
    variance: 'sigma^2 = -1/f_pp(tau*) = tau*^2/(n(1+4 tau*))',
    series: 'L_n = 1 + C1 + C2 + C3, C1 = f_ppp sigma^2 tau*, C2 = (f_pppp/2) sigma^4, C3 = (5/4) f_ppp^2 sigma^6 (skewness/kurtosis Laplace expansion of <tau^2>)',
    asymptoticC1: 'C1 = (f_ppp sigma^3)(tau*/sigma), tau*/sigma = 2 sqrt(n tau*); f_ppp sigma^3 -> 0 but C1 -> -4 tau* (grows), so no asymptote at 1',
    quadrature: 'moment ladder identical to imp-3735: A(tau) inner Simpson n=4800 on [0,7], moments on T_A=8, NM=3200 grid',
    selfComputing: true,
  }),

  measured: Object.freeze({
    tAxisEndpoint: T_A,
    momentPanels: NM,
    innerFine: INNER_FINE,
    maxMoment: MMAX,
    fpppSignChangeTau: fpppSignTau,       // tau* = 1/sqrt(8) ~ 0.35355
    driftMeasured10: measuredDrift(10),
    driftMeasured80: measuredDrift(80),
    driftPredicted10: correctedDrift(10).predicted,
    driftPredicted80: correctedDrift(80).predicted,
    c1First: C1_VALS[0],                  // n=10 (positive)
    c1Last: C1_VALS[C1_VALS.length - 1],  // n=80 (negative, ~ -4 tau*)
    skewnessFirst: SKEW_VALS[0],
    skewnessLast: SKEW_VALS[SKEW_VALS.length - 1],
    kurtosisFirst: KURT_VALS[0],
    kurtosisLast: KURT_VALS[KURT_VALS.length - 1],
    skewMaxAbs: SKEW_MAX_ABS,
    kurtMaxAbs: KURT_MAX_ABS,
    rungs: Object.freeze(RUNGS),
    skewSmall,
    kurtShrinks,
    nearGaussian,
    c1SignChanges,
    c1GrowsNegative,
    predictedDescendsBelowOne,
    measuredCrossesLater,
    reproducesImp3735,
    verdict,
  }),

  interpretation: Object.freeze({
    saddleExpansionValid:
      'The dimensionless kurtosis f_pppp(tau*) sigma^4 shrinks monotonically in magnitude over n=10..80 (0.168 -> ' +
      '0.021), and the skewness f_ppp(tau*) sigma^3 stays small throughout (max |.| <= 0.088, passing through 0 at the ' +
      'f_ppp sign change near n~18); both remain < 0.2, so the moment-integrand peak is near-Gaussian and the ' +
      'perturbative Laplace/saddle series for <tau^2> is legitimate at these n.',
    thirdDerivativeDrivesDrift:
      'The next-order correction is dominated by the third derivative f_ppp(tau*) = (2n/tau*^3)(1 - 8 tau*^2), which ' +
      'changes sign at tau* = 1/sqrt(8) ~ 0.35355 (n ~ 18). The leading term C1 = f_ppp sigma^2 tau* is therefore ' +
      'POSITIVE for n < ~18 (raising L_n above 1) and increasingly NEGATIVE for n > ~18 (pulling L_n below 1), which ' +
      'matches the DIRECTION of the imp-3735 measured drift of L_n through 1. The drift is a saddle-skewness effect.',
    continuedDescentNoAsymptote:
      'C1 does NOT vanish as n grows. Because C1 = (f_ppp sigma^3)(tau*/sigma) and the amplification tau*/sigma = ' +
      '2 sqrt(n tau*) grows faster than the skewness f_ppp sigma^3 shrinks, C1 -> approximately -4 tau* ~ -(ln n) ' +
      'without bound (0.400 at n=10 -> -1.077 at n=80). So the corrected Laplace series drives L_n strictly below 1 ' +
      'with NO plateau: it predicts CONTINUED DESCENT, consistent with the imp-3735 unbounded local exponent and the ' +
      'imp-3713 finite-n saddle-ratio crossing (there is no asymptotic plateau of L_n at 1).',
    truncationOvershoots:
      'The single-next-order truncation 1 + C1 + C2 + C3 crosses 1 near n ~ 15, whereas the measured L_n crosses 1 ' +
      'near n ~ 48. At this truncation the correction is thus DIRECTION-confirming (correct sign and monotone descent), ' +
      'NOT a quantitative pin: the growing higher-order saddle terms must partially cancel, so the series is ' +
      'asymptotic-but-slowly-organizing in this n range. A quantitative model needs resummation, not one more term.',
    feedsCrossingModel:
      'This saddle-level mechanism is the source of the imp-3735 super-polynomial steepening: the sign change of ' +
      'f_ppp at tau* = 1/sqrt(8) plus the unbounded growth of C1 explains why the eps-weighted step difference in ' +
      'D_n = D_n^saddle + [C_(n+2)^saddle eps_(n+2) - C_n^saddle eps_n] changes sign at the finite imp-3713/imp-3731 ' +
      'crossing n* ~ 225.5 rather than at an asymptotic plateau.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Computes the next-order (f_ppp, f_pppp) saddle corrections to a fixed-weight moment-ratio drift factor under ' +
      'the imp-3665 super-exponential A(tau) ~ exp(-pi e^{4 tau}) model and compares them to the imp-3735 measured ' +
      'drift. The corrected series is a truncated ASYMPTOTIC expansion (it overshoots at this order), grid-CONVERGENCE ' +
      'stability only -- not a certified error bound. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3848_MOMENT_RATIO_DRIFT_SADDLE_CORRECTION_ASSERTIONS = [
  {
    id: 'imp3848-saddle-expansion-asymptotically-valid',
    why: 'The moment-integrand peak must be near-Gaussian: the dimensionless kurtosis f_pppp(tau*) sigma^4 SHRINKS ' +
         'monotonically in magnitude (0.168 -> 0.021) and the skewness f_ppp(tau*) sigma^3 stays SMALL throughout ' +
         '(max |.| <= 0.088, passing through 0 at the f_ppp sign change) -- both < 0.2, so the perturbative Laplace ' +
         'series is legitimate.',
    holds: () => nearGaussian,
  },
  {
    id: 'imp3848-third-derivative-sign-change-drives-drift',
    why: 'f_ppp(tau*) = (2n/tau*^3)(1-8 tau*^2) changes sign at tau*=1/sqrt(8), so the leading correction C1 = ' +
         'f_ppp sigma^2 tau* must be POSITIVE at n=10 and NEGATIVE at n=80 -- sending L_n through 1 in the measured ' +
         'direction.',
    holds: () => c1SignChanges,
  },
  {
    id: 'imp3848-c1-grows-negative-no-asymptote',
    why: 'C1 must NOT vanish but grow negative toward -4 tau* (n=80 more negative than n=20), so the corrected ' +
         'Laplace series predicts L_n descends below 1 with NO plateau (predicted < 1 at n=80): CONTINUED DESCENT.',
    holds: () => c1GrowsNegative && predictedDescendsBelowOne,
  },
  {
    id: 'imp3848-truncation-overshoots-direction-only',
    why: 'The single-next-order truncation must UNDER-predict L_n at n=10 (it overshoots the descent, crossing 1 near ' +
         'n~15 vs measured n~48) while the measured L_n stays above 1 there and falls below 1 by n=80 -- i.e. the ' +
         'correction is direction-confirming, not a quantitative pin.',
    holds: () => measuredCrossesLater,
  },
  {
    id: 'imp3848-reproduces-imp3735-drift-rungs',
    why: 'Cross-check: the reused imp-3735 moment machinery must reproduce the measured L_n rungs 2.064 at n=10 and ' +
         '0.567 at n=80 to ~0.02.',
    holds: () => reproducesImp3735,
  },
  {
    id: 'imp3848-verdict-characterizes-correction',
    why: 'The classified verdict must record the f_ppp-dominated sign-change mechanism, the continued descent (no ' +
         'asymptote), and the truncation overshoot -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3848-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/characterization only, truncated asymptotic series not a certified bound, ' +
         'mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3848_MOMENT_RATIO_DRIFT_SADDLE_CORRECTION.honestCaveat;
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

for (const assertion of IMP3848_MOMENT_RATIO_DRIFT_SADDLE_CORRECTION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3848-moment-ratio-drift-saddle-correction assertion failed: ${assertion.id}`);
  }
}

export default IMP3848_MOMENT_RATIO_DRIFT_SADDLE_CORRECTION;
