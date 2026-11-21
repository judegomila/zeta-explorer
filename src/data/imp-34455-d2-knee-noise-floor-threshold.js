/**
 * @module imp-34455-d2-knee-noise-floor-threshold
 *
 * imp-34455 (accuracy, frontier-direction): imp-34371 tabulated the loss-of-knee DETECTABILITY
 * frontier for the sigma(N) single-sigmoid D2 knee and found it is exactly span = 4 * W -- a pure
 * discrete-second-difference COUNTING floor (at the threshold the window holds exactly numBrackets = 4,
 * numD2 = 2, the bare minimum for one sign change). imp-34371 F2 ASSERTED that this frontier "carries
 * no information about the curvature itself" and is "NOT noise-limited" -- but it never QUANTIFIED the
 * evaluation-noise floor to prove the two threshold D2 values actually sit above finite-precision noise.
 * This module sharpens imp-34371 on a finer window-gap grid and reports the smallest gap at which the
 * second-difference knee stays distinguishable from evaluation noise.
 *
 * VOCABULARY MAP (the imp-34455 ticket borrowed eflow_over_resid residue language)
 * --------------------------------------------------------------------------------
 * The ticket phrases the ask as "smallest window gap k*-kEnd at which the D2 knee stays above resid_exp
 * evaluation noise." Anchored on its explicit reference imp-34371, we realize:
 *   - "window gap"          := the imp-34371 domain bracket width W (decades) about the knee center.
 *   - "resid_exp evaluation noise" := the finite-precision (double) evaluation noise of the OLS local
 *      decay-exponent p(W), propagated to the second difference D2 via first-order rounding analysis.
 * Everything else is the EXACT imp-34371/imp-34291/imp-33721 sigma model, OLS estimator, and span = 4W
 * counting-floor threshold -- no re-derivation, no fresh model.
 *
 * THE NOISE MODEL (analytic first-order FP propagation, self-contained)
 * --------------------------------------------------------------------
 * The OLS local exponent p over a bracket is a LINEAR functional of the sampled log-shares
 * y_i = ln sigma(N_i):  p = - sum_i w_i y_i  with  w_i = (x_i - xbar) / Sxx,  x_i = ln N_i,
 * Sxx = sum_i (x_i - xbar)^2. Each y_i carries a double-precision rounding error ~ EPS * |y_i|
 * (EPS = 2.22e-16, |y_i| ~ yscale ~ 0.70 near the knee). Propagated independently:
 *   sigma_p = EPS * yscale * sqrt(sum_i w_i^2) = EPS * yscale / sqrt(Sxx).
 * The second difference D2 = p3 - 2 p2 + p1 amplifies independent exponent noise by sqrt(1+4+1):
 *   noiseFloorD2 = sqrt(6) * sigma_p.
 * This is a defensible FP-propagation floor, NOT an empirically sampled noise band.
 *
 * THE FINDING (measurement / detectability diagnostic only)
 * ---------------------------------------------------------
 *   (F1) AT THE imp-34371 COUNTING-FLOOR THRESHOLD THE KNEE IS 10-13 ORDERS OF MAGNITUDE ABOVE NOISE.
 *        Across the entire imp-34371 tested width band W in {0.1 .. 0.5} (each at its span = 4W
 *        threshold, numBrackets = 4, numD2 = 2), the smaller of the two threshold |D2| values exceeds
 *        the FP evaluation-noise floor by SNR in [2.68e10 (W=0.1) .. 1.90e13 (W=0.5)]. imp-34371 F2
 *        ("pure resolution floor, NOT noise-limited") is now QUANTITATIVELY CONFIRMED, not just asserted.
 *   (F2) ON A FINER GRID THE SNR FALLS AS A CLEAN POWER LAW SNR ~ W^4. A log-log fit over the fine tail
 *        W in {0.02 .. 0.001} gives slope 4.038 (signal ~ W^3, noise ~ W^-1). Detectability is DIRECTLY
 *        measured down to a window gap W = 0.001 decade, where SNR = 238 (still far above 1). The
 *        SNR = 1 crossover is FIT-EXTRAPOLATED to W* ~ 2.57e-4 decades.
 *   (F3) THE imp-34371 FRONTIER IS COUNTING-LIMITED, NOT NOISE-LIMITED. The smallest window gap at which
 *        the knee stays distinguishable from evaluation noise (W* ~ 2.6e-4) lies ~390x FINER than
 *        imp-34371 finest tested width (0.1). So across the whole imp-34371 detectability table the
 *        binding constraint is the discrete-D2 COUNTING floor (numBrackets >= 4), never the evaluation-
 *        noise floor -- exactly the regime imp-34371 F2 claimed, now bounded with a number.
 *
 * HONEST SUB-GAP
 * --------------
 *   (a) The noise floor is an ANALYTIC first-order FP-propagation estimate, NOT an empirically sampled
 *       noise measurement; a Monte-Carlo perturbation study could tighten the constant.
 *   (b) The SNR = 1 crossover W* ~ 2.6e-4 is FIT-EXTRAPOLATED from the W^4 law; detectability is
 *       DIRECTLY confirmed only down to W = 0.001 (SNR = 238). At W ~ W* the OLS exponents themselves
 *       become FP-noise-dominated (ln sigma varies by only ~1e-4 across a bracket), so the signal/noise
 *       separation is not directly observable there -- hence the extrapolation caveat.
 *
 * MEASUREMENT / DETECTABILITY DIAGNOSTIC ONLY. Conditional-share curvature diagnostic, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34371-d2-knee-detectability-threshold (loss-of-knee frontier span = 4W; F2 "not noise-limited")
 * @see imp-34291-sigma-inflection-uniqueness-robustness (39-config uniqueness sweep; under-count F2/F3)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee LOCATION log10 N* ~ 9.529)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (six-decade exponent ladder; reuse gate)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-34371
const EPS = Number.EPSILON; // 2.220446e-16 double-precision unit roundoff

// EXACT imp-3406/imp-33582/imp-34371 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// OLS local decay exponent p = -slope of ln sigma on ln N over [10^loD, 10^hiD], returning Sxx too
// (Sxx drives the FP-noise floor). Identical estimator to imp-34371.
function olsExponentLog10(loD, hiD, ptsPerDecade) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return { p: -(sxy / sxx), sxx };
}

// Points-per-decade policy: keep ~12 OLS points inside each sub-bracket regardless of width (imp-34371).
function ppdForWidth(W) {
  return Math.max(40, Math.ceil(12 / W));
}

// Knee center (imp-33721 sub-decade inflection log10 N* ~ 9.529) and the typical |ln sigma| scale there.
const KNEE_CENTER_LOG10 = 9.529;
const Y_SCALE = Math.abs(Math.log(sigma(Math.pow(10, KNEE_CENTER_LOG10))));

// At the imp-34371 span = 4W threshold: build the 4 sub-brackets, form the 2 second differences, take
// the SMALLER |D2| (the near-zero-crossing member -- the hardest to resolve above noise), and compare
// it to the propagated FP-noise floor noiseFloorD2 = sqrt(6) * EPS * yscale / sqrt(Sxx).
function measureThreshold(W) {
  const ppd = ppdForWidth(W);
  const span = 4 * W;
  const lo = KNEE_CENTER_LOG10 - span / 2;
  const hi = KNEE_CENTER_LOG10 + span / 2;
  const edges = [];
  for (let d = lo; d <= hi + 1e-9; d += W) edges.push(+d.toFixed(12));
  const brackets = [];
  let sxxTyp = 0;
  for (let i = 0; i < edges.length - 1; i++) {
    const r = olsExponentLog10(edges[i], edges[i + 1], ppd);
    brackets.push(r.p);
    sxxTyp = r.sxx;
  }
  const D1 = [];
  for (let i = 1; i < brackets.length; i++) D1.push(brackets[i] - brackets[i - 1]);
  const D2 = [];
  for (let i = 1; i < D1.length; i++) D2.push(D1[i] - D1[i - 1]);
  const sigmaP = (EPS * Y_SCALE) / Math.sqrt(sxxTyp); // FP noise in one OLS exponent
  const noiseFloorD2 = Math.sqrt(6) * sigmaP;
  const minAbsD2 = Math.min(...D2.map(Math.abs));
  return {
    widthDecades: W,
    numBrackets: brackets.length,
    numD2: D2.length,
    minAbsD2,
    noiseFloorD2,
    snr: minAbsD2 / noiseFloorD2,
  };
}

// (T1) imp-34371 tested-width band: SNR at each width's span = 4W counting-floor threshold.
const BAND_WIDTHS = [0.1, 0.125, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5];
const BAND_TABLE = BAND_WIDTHS.map(measureThreshold);

// (T2) finer-grid sweep: push the window gap below imp-34371 finest width to trace the SNR falloff.
const FINE_WIDTHS = [0.05, 0.02, 0.01, 0.005, 0.002, 0.001];
const FINE_TABLE = FINE_WIDTHS.map(measureThreshold);

// (T3) log-log power-law fit of SNR vs W over the fine tail (W <= 0.02), and the SNR = 1 crossover.
const FIT_TAIL = FINE_TABLE.filter((r) => r.widthDecades <= 0.02).map((r) => [
  Math.log10(r.widthDecades),
  Math.log10(r.snr),
]);
function loglogFit(pts) {
  const n = pts.length;
  const mx = pts.reduce((a, p) => a + p[0], 0) / n;
  const my = pts.reduce((a, p) => a + p[1], 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (const p of pts) {
    sxx += (p[0] - mx) ** 2;
    sxy += (p[0] - mx) * (p[1] - my);
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  return { slope, intercept };
}
const FIT = loglogFit(FIT_TAIL);
const CROSSOVER_WSTAR = Math.pow(10, -FIT.intercept / FIT.slope); // W at which SNR = 1
const FINEST_DIRECT = FINE_TABLE[FINE_TABLE.length - 1]; // W = 0.001, still SNR >> 1

// Derived summaries.
const BAND_ALL_FOUR_BRACKETS = BAND_TABLE.every((r) => r.numBrackets === 4 && r.numD2 === 2);
const BAND_ALL_SNR_ABOVE_1E10 = BAND_TABLE.every((r) => r.snr > 1e10);
const FINE_MONOTONE_DECREASING = FINE_TABLE.every(
  (r, i) => i === 0 || r.snr < FINE_TABLE[i - 1].snr,
);
const SLOPE_NEAR_FOUR = Math.abs(FIT.slope - 4) < 0.1;
const CROSSOVER_FAR_BELOW_FINEST_TESTED = CROSSOVER_WSTAR < 0.1 / 100; // >100x finer than imp-34371 min width

export const IMP34455_D2_KNEE_NOISE_FLOOR_THRESHOLD = {
  id: 'imp-34455',
  proofSection: 'S-frontier',
  question:
    'imp-34371 tabulated the sigma(N) D2-knee loss-of-detectability frontier as span = 4W (a pure ' +
    'discrete-second-difference COUNTING floor) and ASSERTED it is not noise-limited -- but never ' +
    'quantified the evaluation-noise floor. On a finer window-gap grid, how far above the finite- ' +
    'precision evaluation-noise floor does the second-difference knee sit at the counting-floor ' +
    'threshold, and what is the smallest window gap at which it stays distinguishable from noise? ' +
    'Detectability diagnostic only; conditional-share curvature, NOT an RH bound; no QED.',
  measuredQuantity:
    'the signal-to-noise ratio SNR = |D2|_min / noiseFloorD2 of the two span = 4W threshold second ' +
    'differences vs the analytic FP-propagation noise floor noiseFloorD2 = sqrt(6) * EPS * yscale / ' +
    'sqrt(Sxx), across the imp-34371 width band {0.1..0.5} and a finer sweep {0.05..0.001}, with the ' +
    'log-log SNR-vs-W power law and its SNR = 1 crossover',
  kneeCenterLog10: KNEE_CENTER_LOG10,
  yScale: Y_SCALE,
  epsMachine: EPS,
  noiseModel: 'noiseFloorD2 = sqrt(6) * EPS * yscale / sqrt(Sxx)  (first-order FP propagation of the OLS local-exponent, D2 amplifier sqrt(1+4+1))',
  bandWidths: BAND_WIDTHS,
  fineWidths: FINE_WIDTHS,
  bandTable: BAND_TABLE,
  fineTable: FINE_TABLE,
  fitSlope: FIT.slope,
  fitIntercept: FIT.intercept,
  crossoverWstar: CROSSOVER_WSTAR,
  finestDirectWidth: FINEST_DIRECT.widthDecades,
  finestDirectSNR: FINEST_DIRECT.snr,
  bandAllFourBrackets: BAND_ALL_FOUR_BRACKETS,
  bandAllSnrAbove1e10: BAND_ALL_SNR_ABOVE_1E10,
  fineMonotoneDecreasing: FINE_MONOTONE_DECREASING,
  slopeNearFour: SLOPE_NEAR_FOUR,
  crossoverFarBelowFinestTested: CROSSOVER_FAR_BELOW_FINEST_TESTED,
  finding: {
    F1_threshold_knee_10_to_13_orders_above_noise:
      'At the imp-34371 span = 4W counting-floor threshold (numBrackets = 4, numD2 = 2) the smaller of ' +
      'the two |D2| values exceeds the FP evaluation-noise floor by SNR in [2.68e10 (W=0.1) .. 1.90e13 ' +
      '(W=0.5)] across the entire imp-34371 tested width band. imp-34371 F2 ("pure resolution floor, ' +
      'NOT noise-limited") is now quantitatively confirmed, not merely asserted.',
    F2_snr_falls_as_W_fourth_power:
      'On a finer grid the SNR falls as a clean power law SNR ~ W^4 (log-log fit slope 4.038 over the ' +
      'tail W in {0.02..0.001}; signal ~ W^3, noise ~ W^-1). Detectability is DIRECTLY measured down ' +
      'to a window gap W = 0.001 decade, where SNR = 238 (far above 1); the SNR = 1 crossover is ' +
      'FIT-EXTRAPOLATED to W* ~ 2.57e-4 decades.',
    F3_frontier_is_counting_limited_not_noise_limited:
      'The smallest window gap at which the knee stays distinguishable from evaluation noise ' +
      '(W* ~ 2.6e-4) lies ~390x FINER than imp-34371 finest tested width (0.1). Across the whole ' +
      'imp-34371 detectability table the binding constraint is the discrete-D2 COUNTING floor ' +
      '(numBrackets >= 4), never the evaluation-noise floor -- exactly the regime imp-34371 F2 ' +
      'claimed, now bounded with a number.',
  },
  subGap:
    'The noise floor is an ANALYTIC first-order FP-propagation estimate, NOT an empirically sampled ' +
    'band; and the SNR = 1 crossover W* ~ 2.6e-4 is FIT-EXTRAPOLATED (detectability directly confirmed ' +
    'only to W = 0.001, SNR = 238) -- at W ~ W* the OLS exponents themselves become FP-noise-dominated, ' +
    'so the separation is not directly observable there.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Sharpening the imp-34371 span = 4W loss-of-knee ' +
    'frontier on a finer window-gap grid: at the counting-floor threshold the sigma(N) D2 knee sits ' +
    'SNR in [2.68e10 .. 1.90e13] above the analytic FP evaluation-noise floor across the imp-34371 ' +
    'width band {0.1..0.5}; on a finer grid the SNR falls as a clean SNR ~ W^4 power law (fit slope ' +
    '4.04), directly resolved to W = 0.001 (SNR = 238) and fit-extrapolated to an SNR = 1 crossover ' +
    'W* ~ 2.6e-4 decades -- ~390x finer than imp-34371 finest tested width. So the imp-34371 frontier ' +
    'is COUNTING-limited (numBrackets >= 4), never noise-limited, quantitatively confirming imp-34371 ' +
    'F2. Honest sub-gap: the noise floor is an analytic FP-propagation estimate, not a sampled band, ' +
    'and W* is fit-extrapolated below the directly resolvable grid. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34371 (loss-of-knee frontier span = 4W; F2 "not noise-limited"); imp-34291 (39-config ' +
    'uniqueness sweep); imp-33721 (sub-decade knee location log10 N* ~ 9.529); imp-33582 (six-decade ' +
    'exponent ladder); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34455_D2_KNEE_NOISE_FLOOR_THRESHOLD_ASSERTIONS = [
  {
    // Reuse gate: at every imp-34371 band width the span = 4W threshold holds exactly 4 sub-brackets /
    // 2 second differences -- proving the IDENTICAL imp-34371 counting-floor threshold is in use.
    id: 'imp34455-reuses-imp34371-four-bracket-threshold',
    description: 'at every band width the span = 4W threshold holds numBrackets == 4 and numD2 == 2',
    holds: () => BAND_ALL_FOUR_BRACKETS && BAND_TABLE.length === BAND_WIDTHS.length,
  },
  {
    // (F1): across the imp-34371 tested width band the threshold knee sits > 1e10 above the noise floor.
    id: 'imp34455-band-knee-above-1e10-snr',
    description: 'every imp-34371 band-width threshold D2 exceeds the FP noise floor by SNR > 1e10',
    holds: () => BAND_ALL_SNR_ABOVE_1E10,
  },
  {
    // (F1 endpoints): reproduce the tabulated band SNR endpoints (W=0.1 -> 2.68e10, W=0.5 -> 1.90e13)
    // to ~0.2% -- the recomputed live sweep matches the baked reference literals.
    id: 'imp34455-band-snr-endpoints-reproduced',
    description: 'live band SNR at W=0.1 ~ 2.683e10 and W=0.5 ~ 1.897e13 reproduced to ~0.2%',
    holds: () =>
      Math.abs(BAND_TABLE[0].snr / 2.6829e10 - 1) < 2e-3 &&
      Math.abs(BAND_TABLE[BAND_TABLE.length - 1].snr / 1.8965e13 - 1) < 2e-3,
  },
  {
    // (F2): the SNR falloff is monotone and the log-log power law has slope ~ 4 (SNR ~ W^4).
    id: 'imp34455-snr-power-law-slope-near-four',
    description: 'fine-grid SNR is monotone decreasing and the log-log slope is 4.0 +/- 0.1 (SNR ~ W^4)',
    holds: () => FINE_MONOTONE_DECREASING && SLOPE_NEAR_FOUR,
  },
  {
    // (F2 direct floor): detectability is DIRECTLY measured to W = 0.001 with SNR still far above 1.
    id: 'imp34455-directly-resolved-to-w-0p001',
    description: 'at the finest directly measured width W = 0.001 the knee still resolves at SNR ~ 238 (>> 1)',
    holds: () =>
      Math.abs(FINEST_DIRECT.widthDecades - 0.001) < 1e-12 &&
      FINEST_DIRECT.snr > 100 &&
      Math.abs(FINEST_DIRECT.snr / 238.26 - 1) < 2e-3,
  },
  {
    // (F3): the SNR = 1 crossover is fit-extrapolated to ~2.6e-4, > 100x finer than imp-34371 min width
    // -- the frontier is counting-limited, not noise-limited.
    id: 'imp34455-crossover-far-below-finest-tested',
    description: 'the SNR=1 crossover W* ~ 2.6e-4 lies > 100x finer than imp-34371 min width 0.1 (counting-limited)',
    holds: () =>
      CROSSOVER_FAR_BELOW_FINEST_TESTED && Math.abs(CROSSOVER_WSTAR / 2.565e-4 - 1) < 5e-2,
  },
  {
    // Honesty gate: detectability diagnostic only, sub-gap named, no QED, no refereed bound is changed.
    id: 'imp34455-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, sub-gap named, no QED, no refereed bound is changed',
    holds: () =>
      IMP34455_D2_KNEE_NOISE_FLOOR_THRESHOLD.isRigorous === false &&
      /FIT-EXTRAPOLATED/.test(IMP34455_D2_KNEE_NOISE_FLOOR_THRESHOLD.subGap) &&
      /NO QED/.test(IMP34455_D2_KNEE_NOISE_FLOOR_THRESHOLD.verdict) &&
      /refereed bound is changed/i.test(IMP34455_D2_KNEE_NOISE_FLOOR_THRESHOLD.verdict),
  },
];

for (const a of IMP34455_D2_KNEE_NOISE_FLOOR_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34455-d2-knee-noise-floor-threshold assertion failed: ${a.id}`);
  }
}
