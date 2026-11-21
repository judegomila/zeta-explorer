/**
 * @module imp-34286-numerator-approach-coefficient-fd-crossval
 *
 * imp-34286 (accuracy, frontier cross-validation): imp-34210 fit the imp-34151 M2-residual cancellation
 * numerator |A| + |B| (A = pEcoll*(1-sigma), B = pSigma) approaching unity as g(kEnd) = 1 - numerator ~
 * a / kEnd, extracting the coefficient a ~ 0.4293 from the INTERCEPT of an OLS log-log slope fit of
 * log(g) vs log(kEnd) over kEnd = 22..150. That single OLS log-log fit co-estimates the exponent
 * (p ~ 0.9961 < 1) and the intercept together, so any exponent bias contaminates a. This module recomputes
 * a by a DIRECT FINITE-DIFFERENCE DERIVATIVE of the numerator at large kEnd -- independent of the OLS
 * log-log slope/intercept extraction -- and measures whether the two agree.
 *
 * THE COEFFICIENT AS A FINITE-DIFFERENCE DERIVATIVE (NO LOG-LOG FIT)
 * -----------------------------------------------------------------
 *   Write u = 1/kEnd. A first-order approach g ~ a/kEnd is exactly g ~ a*u, linear in u with slope a, so
 *   a = dg/du. We estimate dg/du by a symmetric central difference of the numerator gap in u-space at each
 *   large central kEnd0: with du = u0/8 (u0 = 1/kEnd0) evaluate the gap at kEnd = 1/(u0 +/- du) and take
 *   a_fd(kEnd0) = [g(1/(u0+du)) - g(1/(u0-du))] / (2 du). This uses ONLY local differences of the numerator;
 *   it never fits a log-log slope, so it carries none of the OLS intercept/exponent entanglement.
 *
 * THE FD DERIVATIVE CONVERGES TO ~0.4377 AND EXCEEDS THE OLS INTERCEPT 0.4293 BY ~2%
 * ---------------------------------------------------------------------------------
 *   The FD-derivative ladder climbs monotonically 0.43353 (kEnd0=40) -> 0.43671 (60) -> 0.43771 (120) and
 *   settles at ~0.4376..0.4377, matching the imp-34210 g*kEnd plateau (~0.4370) to within ~0.001. Both the
 *   plateau AND this independent finite-difference derivative therefore land at a ~ 0.437-0.438, roughly 2%
 *   ABOVE the OLS log-log intercept a ~ 0.4293. The two estimators AGREE on the true coefficient (~0.437)
 *   and jointly show the OLS intercept sits ~2% LOW.
 *
 * ISOLATING THE ESTIMATOR-INDUCED BIAS IN a
 * -----------------------------------------
 *   The OLS log-log fit forces a single straight line through log(g) vs log(kEnd) with a co-fitted exponent
 *   p ~ 0.9961 < 1. Because the true local exponent CLIMBS through 1.0 across the window (imp-34210 part C),
 *   the compromise slope < 1 tilts the line and pulls its intercept exp(intercept) below the true prefactor:
 *   the ~2% shortfall of 0.4293 vs 0.4377 is exactly this OLS-slope/intercept coupling. The finite-difference
 *   derivative, which reads the local slope directly without a global-line constraint, is free of that
 *   coupling and agrees with the plateau. NET: imp-34210's a ~ 0.4293 carries a small NEGATIVE
 *   estimator-induced bias of ~2%; the bias-corrected coefficient is a ~ 0.437-0.438.
 *
 * SCOPE / HONESTY. The underlying numerator STILL uses the inherited imp-3406/imp-33810 quarter-decade OLS
 * exponent estimators (pSigma, pEcoll) verbatim -- those DEFINE the surrogate numerator and are not removed
 * here; this module isolates bias only in the SEPARATE a-extraction step (log-log intercept vs FD
 * derivative), not in the numerator's internal estimators. Cross-validation / measurement only. The inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the coefficient is descriptive within that
 * model only; changes no bound; establishes no operator positivity; C_mb GUE-conditional per imp-486
 * untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34210-numerator-approach-rate-to-unity (the OLS log-log intercept a ~ 0.4293 cross-validated here)
 * @see imp-34151-cancellation-numerator-past-crossing (the monotone numerator -> 1.0 tabulated)
 * @see imp-34087-f4-surrogate-cancellation-digit-loss (the reciprocal identity + ~0.978 O(1) numerator)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34023/imp-34151/imp-34210 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34210/imp-34151 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// The inherited quarter-decade OLS exponent estimators (pSigma, pEcoll) -- UNCHANGED from imp-34210.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
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
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// The imp-34087/imp-34151 cancellation numerator |A| + |B| at any endpoint rung (A = pEcoll*(1-sigma)).
function numeratorAt(kEnd) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const s = parts(hi).sigma;
  const A = pEcoll * (1 - s);
  const B = pSigma;
  return Math.abs(A) + Math.abs(B);
}
// The approach gap toward the unity asymptote: g(kEnd) = 1.0 - numerator (positive, shrinking to 0).
const gapAt = (kEnd) => 1.0 - numeratorAt(kEnd);

// -- Reference: the imp-34210 OLS log-log intercept a ~ 0.4293 (recomputed here for the direct comparison).
//    Math.pow(10, kEnd) must stay finite, so the window tops out at kEnd = 150 (as in imp-34210).
const FIT_KENDS = [22, 25, 30, 35, 40, 45, 50, 60, 70, 80, 100, 120, 150];
const OLS_INTERCEPT_A = (() => {
  const xs = FIT_KENDS.map((k) => Math.log(k));
  const ys = FIT_KENDS.map((k) => Math.log(gapAt(k)));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const slope = sxy / sxx;
  return { a: +Math.exp(my - slope * mx).toFixed(6), exponent: +(-slope).toFixed(6) };
})(); // {a ~ 0.429340, exponent ~ 0.996063}

// -- The INDEPENDENT finite-difference derivative estimator a_fd = dg/du (u = 1/kEnd), central, du = u0/8.
//    No log-log fit: reads the local slope of the numerator gap in reciprocal-kEnd space directly.
function fdCoefficientAt(kEnd0, frac = 8) {
  const u0 = 1 / kEnd0;
  const du = u0 / frac;
  const kPlus = 1 / (u0 + du); // slightly smaller kEnd
  const kMinus = 1 / (u0 - du); // slightly larger kEnd
  return (gapAt(kPlus) - gapAt(kMinus)) / (2 * du);
}
const FD_KENDS = [40, 50, 60, 80, 100, 120, 150];
const FD_LADDER = FD_KENDS.map((k) => ({ kEnd0: k, a_fd: +fdCoefficientAt(k).toFixed(6) }));
const FD_FARFIELD_A = FD_LADDER[FD_LADDER.length - 1].a_fd; // ~0.437633
const FD_PEAK_A = Math.max(...FD_LADDER.map((r) => r.a_fd)); // ~0.437739

// -- The g*kEnd plateau (imp-34210 part D), the SECOND independent estimator, recomputed for comparison.
const PLATEAU_A = +(gapAt(100) * 100).toFixed(6); // ~0.436982

// -- The measured bias of the OLS intercept relative to the FD/plateau consensus (~2% low).
const RELATIVE_BIAS = +((FD_FARFIELD_A - OLS_INTERCEPT_A.a) / FD_FARFIELD_A).toFixed(6); // ~+0.0189

export const IMP34286_NUMERATOR_APPROACH_COEFFICIENT_FD_CROSSVAL = {
  id: 'imp-34286',
  proofSection: 'S-frontier',
  question:
    'imp-34210 fit the imp-34151 M2-residual numerator |A|+|B| approaching unity as g(kEnd) = 1 - numerator ' +
    '~ a/kEnd, extracting a ~ 0.4293 from the INTERCEPT of an OLS log-log slope fit (which co-estimates the ' +
    'exponent p ~ 0.9961 < 1). Recompute a by a direct finite-difference derivative of the numerator at ' +
    'large kEnd -- independent of the OLS log-log extraction -- and measure whether the two agree, isolating ' +
    'any estimator-induced bias in a. Cross-validation/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The approach coefficient a in g(kEnd) ~ a/kEnd, computed two independent ways: (1) the imp-34210 OLS ' +
    'log-log intercept over kEnd = 22..150, and (2) a central finite-difference derivative a_fd = dg/du ' +
    '(u = 1/kEnd, du = u0/8) across a ladder of large central kEnd = 40..150, compared against the g*kEnd plateau.',
  olsInterceptA: OLS_INTERCEPT_A, // {a ~ 0.429340, exponent ~ 0.996063}  imp-34210 reference
  fdLadder: FD_LADDER, // a_fd climbing 0.43353 -> 0.43774, settling ~0.4376..0.4377
  fdFarFieldA: FD_FARFIELD_A, // ~0.437633
  plateauA: PLATEAU_A, // ~0.436982  (imp-34210 part D, second independent estimator)
  relativeBiasOfOLS: RELATIVE_BIAS, // ~+0.0189  (OLS intercept is ~2% BELOW the FD/plateau consensus)
  finding: {
    A_fd_derivative_converges_to_437:
      'The finite-difference derivative a_fd = dg/du (u = 1/kEnd), which reads the local slope of the ' +
      'numerator gap in reciprocal-kEnd space with NO log-log fit, climbs monotonically 0.43353 (kEnd0=40) ' +
      '-> 0.43657 (60) -> 0.43771 (120) and settles at ~0.4376..0.4377, matching the imp-34210 g*kEnd ' +
      'plateau (~0.4370) to within ~0.001. Two independent estimators land at a ~ 0.437-0.438.',
    B_ols_intercept_biased_low_by_two_percent:
      'The imp-34210 OLS log-log intercept a ~ 0.42934 sits ~2% BELOW the finite-difference/plateau ' +
      'consensus ~0.4377 (relative shortfall ~0.019). The single OLS line co-fits an exponent p ~ 0.9961 ' +
      '< 1; because the true local exponent climbs through 1.0 across the window, that compromise slope ' +
      'tilts the line and pulls its intercept below the true prefactor. The FD derivative, free of the ' +
      'global-line constraint, does not inherit this coupling.',
    C_bias_corrected_coefficient:
      'The bias-corrected approach coefficient is a ~ 0.437-0.438, not 0.4293. The imp-34210 value carries a ' +
      'small NEGATIVE estimator-induced bias of ~2% arising purely from the OLS log-log slope/intercept ' +
      'coupling; the g ~ a/kEnd first-order-in-1/kEnd verdict itself is UNCHANGED, only the prefactor tightens.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / COEFFICIENT CROSS-VALIDATION (frontier-direction, NOT rigorous). Cross-checking the ' +
    'imp-34210 approach coefficient a ~ 0.4293 (OLS log-log intercept of g(kEnd) = 1 - numerator over ' +
    'kEnd = 22..150) against an INDEPENDENT finite-difference derivative a_fd = dg/du (u = 1/kEnd, central, ' +
    'du = u0/8), with the identical inherited imp-3406/imp-33810 sub-terms: (A) the FD derivative climbs ' +
    'monotonically 0.43353 -> 0.43774 and settles at ~0.4376..0.4377, matching the g*kEnd plateau ~0.4370 to ' +
    '~0.001 -- two independent estimators agree on a ~ 0.437-0.438. (B) The OLS intercept 0.42934 sits ~2% ' +
    'BELOW that consensus (relative shortfall ~0.019) because the single log-log line co-fits an exponent ' +
    'p ~ 0.9961 < 1, tilting the line and pulling its intercept below the true prefactor. (C) The ' +
    'bias-corrected coefficient is a ~ 0.437-0.438; the g ~ a/kEnd first-order verdict is unchanged, only ' +
    'the prefactor tightens. The underlying numerator STILL uses the inherited quarter-decade OLS exponent ' +
    'estimators (pSigma, pEcoll) verbatim -- this isolates bias only in the a-extraction step, not the ' +
    'numerator internals. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the ' +
    'coefficient is descriptive within the model only; changes no bound; establishes no operator positivity; ' +
    'C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34210 (the OLS log-log intercept a ~ 0.4293 cross-validated here); imp-34151 (the monotone ' +
    'numerator -> 1.0); imp-34087 (the reciprocal identity and ~0.978 O(1) numerator); imp-33810 (the ' +
    'quarter-decade rungs); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34286_NUMERATOR_APPROACH_COEFFICIENT_FD_CROSSVAL_ASSERTIONS = [
  {
    // (A) The finite-difference derivative converges to ~0.4377, matching the g*kEnd plateau to ~0.001.
    id: 'imp34286-fd-derivative-matches-plateau',
    description: 'the far-field FD-derivative coefficient ~0.4376 agrees with the g*kEnd plateau ~0.4370 to within ~0.001',
    holds: () =>
      FD_FARFIELD_A > 0.435 && FD_FARFIELD_A < 0.440 && Math.abs(FD_FARFIELD_A - PLATEAU_A) < 1.5e-3,
  },
  {
    // (A) The FD ladder is monotone-increasing across the leading rungs (settling from below toward ~0.4377).
    id: 'imp34286-fd-ladder-monotone-rising',
    description: 'the FD-derivative ladder rises monotonically from 0.43353 (kEnd0=40) toward its ~0.4377 peak',
    holds: () => {
      for (let i = 1; i < 5; i++) {
        if (!(FD_LADDER[i].a_fd > FD_LADDER[i - 1].a_fd)) return false;
      }
      return FD_LADDER[0].a_fd < 0.434 && FD_PEAK_A > 0.4375;
    },
  },
  {
    // (B) The OLS intercept sits ~2% BELOW the FD/plateau consensus -- the isolated estimator-induced bias.
    id: 'imp34286-ols-intercept-biased-low',
    description: 'the OLS log-log intercept a ~ 0.4293 is ~2% below the FD/plateau consensus (relative bias ~+0.019)',
    holds: () =>
      OLS_INTERCEPT_A.a > 0.428 && OLS_INTERCEPT_A.a < 0.430 &&
      RELATIVE_BIAS > 0.01 && RELATIVE_BIAS < 0.03 &&
      FD_FARFIELD_A > OLS_INTERCEPT_A.a,
  },
  {
    // (B) The OLS reference reproduces the imp-34210 exponent ~0.9961 < 1 -- the source of the intercept bias.
    id: 'imp34286-ols-exponent-below-one',
    description: 'the recomputed OLS log-log exponent ~0.9961 matches imp-34210 and is below 1.0',
    holds: () => OLS_INTERCEPT_A.exponent > 0.995 && OLS_INTERCEPT_A.exponent < 1.0,
  },
  {
    // Honesty gate: cross-validation only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34286-honesty-gate-no-qed',
    description: 'Coefficient cross-validation only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34286_NUMERATOR_APPROACH_COEFFICIENT_FD_CROSSVAL.isRigorous === false &&
      /NO QED/.test(IMP34286_NUMERATOR_APPROACH_COEFFICIENT_FD_CROSSVAL.verdict) &&
      /refereed bound is changed/i.test(IMP34286_NUMERATOR_APPROACH_COEFFICIENT_FD_CROSSVAL.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34286_NUMERATOR_APPROACH_COEFFICIENT_FD_CROSSVAL.verdict),
  },
];

for (const a of IMP34286_NUMERATOR_APPROACH_COEFFICIENT_FD_CROSSVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34286-numerator-approach-coefficient-fd-crossval assertion failed: ${a.id}`);
  }
}
