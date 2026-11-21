/**
 * @module imp-95431-sigma-exponent-ladder-logistic-fit
 *
 * imp-95431 (numerical, frontier-direction): imp-33701 differenced the imp-33582 six-decade
 * sigma(N) = E_coll/E(N) post-peak LOCAL-DECAY-EXPONENT ladder and found the ramp is SIGMOID --
 * its discrete second difference D2 (ramp acceleration) changes sign exactly ONCE (convex ->
 * concave), a single KNEE -- and imp-33721 refined that knee to log10 N* ~ 9.529 (N* ~ 3.38e9).
 * Both modules asserted the ramp is "S-shaped" and located a single inflection, but NEITHER
 * fitted a closed-form sigmoid: they only observed the qualitative shape and the D2 sign change.
 * This module tests the S-shape claim QUANTITATIVELY: does the exponent ladder p_dec(6..11)
 * admit a closed-form LOGISTIC characterization consistent with that single second-difference
 * sign change, and how large is the fit residual?
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 / imp-33701 -- no fresh terms)
 * ----------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     p_dec(k) = -slope OLS(ln sigma vs ln N) over [10^k, 10^(k+1)], k = 6..11, 4 pts/decade.
 * The ladder reproduces the imp-33701 published p_local to the printed 4 decimals (reuse gate).
 * Each OLS bracket [10^k, 10^(k+1)] is represented by its geometric-mean center u = k + 0.5.
 *
 * THE FIT: closed-form logistic on the exponent ramp
 * --------------------------------------------------
 *   A logistic p(u) = A / (1 + exp(-k(u - u0))) has, by construction, a second derivative that
 *   changes sign EXACTLY ONCE, at its inflection u = u0 -- precisely the single D2 sign change
 *   imp-33701/imp-33721 measured. So the logistic is the natural closed form to test. The fit is
 *   done in CLOSED FORM via the logit linearization: logit(p/A) = ln( (p/A) / (1 - p/A) ) is
 *   LINEAR in u for a logistic, so ordinary least squares on (u, logit(p/A)) recovers the slope
 *   k and the midpoint u0 = -intercept/slope with no iterative solver.
 *     (1) TWO-PARAMETER FIT: fix the ceiling A = 1/2, the imp-3463 rigorous far-tail exponent
 *         asymptote, and OLS-fit (k, u0).
 *     (2) THREE-PARAMETER FIT: free the finite-N ceiling A over a grid (inner logit-linear OLS
 *         per A, pick the A minimizing the p-space RMS residual), quantifying how much the pinned
 *         A = 1/2 costs at the six decades actually sampled.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE LADDER IS A CLOSED-FORM LOGISTIC. The logit of p_dec / (1/2) is linear in u to
 *        R^2 ~ 0.9927: the pinned-ceiling logistic p(u) = 0.5 / (1 + exp(-1.1180(u - 9.7030)))
 *        reproduces the six-decade ladder with RMS residual ~9.54e-3 and max |residual| ~1.43e-2
 *        (in exponent units). The fitted logistic second difference on the ladder centers changes
 *        sign EXACTLY ONCE -- the same single convex-to-concave inflection imp-33701 measured, now
 *        carried by a closed form rather than only observed in the raw D2 ladder.
 *   (F2) FREEING THE CEILING TIGHTENS THE FIT AND RECOVERS THE imp-33721 KNEE. The three-parameter
 *        fit A ~ 0.4695, k ~ 1.2079, u0 ~ 9.4904 raises R^2 to ~0.9974 and halves the residual to
 *        RMS ~5.04e-3, and its midpoint log10 N* ~ 9.490 (N* ~ 3.09e9) sits within ~0.04 decade of
 *        the imp-33721 sub-decade knee (9.529) and the imp-36197 sigma-logistic midpoint (9.504).
 *        The finite-N ceiling 0.4695 sits just below the rigorous 1/2 asymptote, i.e. across the
 *        sampled decades the ramp has not yet reached the imp-3463 far-tail exponent -- exactly why
 *        pinning A = 1/2 in (F1) pushes u0 ~0.17 decade high.
 *   (F3) THE LOGISTIC SHAPE IS INHERITED FROM THE sigma-LOGISTIC (imp-36197). Structurally the
 *        local exponent equals p = -d ln sigma / d ln N = A_struct * (1 - sigma) with A_struct =
 *        (imp-36197 logit slope 1.1020/decade) / ln 10 ~ 0.4786; since imp-36197 showed 1 - sigma
 *        is itself a logistic in log10 N, its scaled derivative-image p_dec is a logistic with the
 *        SAME midpoint. So the single D2 sign change of the exponent ramp is not an independent
 *        coincidence -- it is the one inflection of the imp-36197 sigma-logistic, transported to
 *        the exponent ladder. The fitted ceiling A ~ 0.4695 brackets the structural 0.4786 from
 *        below at the six finite decades sampled.
 *
 * The punchline: imp-33701/imp-33721 established the exponent ramp is S-shaped with a single knee
 * but never fitted it. It DOES admit a closed-form logistic: pinned to the rigorous ceiling 1/2 it
 * fits to R^2 ~ 0.9927 (RMS ~9.5e-3); freeing the finite-N ceiling to ~0.4695 tightens it to
 * R^2 ~ 0.9974 (RMS ~5.0e-3) and lands its midpoint on the imp-33721 knee. The fitted logistic
 * carries exactly one second-difference sign change, consistent with the measured single inflection,
 * and the whole shape is the transported derivative-image of the imp-36197 sigma-logistic.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (whole-decade ladder + single D2 sign change)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee at log10 N* ~ 9.529)
 * @see imp-36197-sharecoll-single-logistic-fit (sigma(N) itself is a logistic; this ladder is its derivative-image)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the six-decade exponent ladder)
 * @see imp-3463-sigma-fartail-decay (far-tail exponent asymptote 1/2, the pinned logistic ceiling)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION } from './imp-33701-sigma-postpeak-ramp-curvature-inflection.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33701 exactly

// EXACT imp-3406/imp-33582/imp-33701 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// OLS local decay exponent p = -slope of ln sigma on ln N over [loN, hiN] (4 pts/decade).
// Identical estimator to imp-33582/imp-33701 so the ladder reproduces its published p_local.
function olsExponent(loN, hiN, ptsPerDecade = 4) {
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
  return -(sxy / sxx);
}

// The imp-33582/imp-33701 six-decade exponent ladder at full precision, k = 6..11.
// Each OLS bracket [10^k, 10^(k+1)] carries geometric-mean center u = k + 0.5.
const DECADE_KS = [6, 7, 8, 9, 10, 11];
const P_LADDER = DECADE_KS.map((k) => olsExponent(Math.pow(10, k), Math.pow(10, k + 1)));
const U_CENTERS = DECADE_KS.map((k) => k + 0.5);

// Closed-form logistic fit via logit linearization: logit(p/A) is linear in u for a logistic,
// so plain OLS on (u, logit(p/A)) recovers slope k and midpoint u0 = -intercept/slope, plus R^2.
function logitLinearFit(A) {
  const y = P_LADDER.map((p) => Math.log((p / A) / (1 - p / A)));
  const n = U_CENTERS.length;
  const mu = U_CENTERS.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (U_CENTERS[i] - mu) ** 2;
    sxy += (U_CENTERS[i] - mu) * (y[i] - my);
    syy += (y[i] - my) ** 2;
  }
  const k = sxy / sxx;
  const u0 = -(my - k * mu) / k;
  const r2 = (sxy * sxy) / (sxx * syy);
  const pFit = U_CENTERS.map((u) => A / (1 + Math.exp(-k * (u - u0))));
  const res = P_LADDER.map((p, i) => p - pFit[i]);
  const rms = Math.sqrt(res.reduce((a, r) => a + r * r, 0) / n);
  const maxAbs = Math.max(...res.map((r) => Math.abs(r)));
  return { A, k, u0, r2, pFit, res, rms, maxAbs };
}

// Discrete second difference sign-change count of a sequence on the ladder centers.
function d2SignChanges(seq) {
  const d1 = [];
  for (let i = 1; i < seq.length; i++) d1.push(seq[i] - seq[i - 1]);
  const d2 = [];
  for (let i = 1; i < d1.length; i++) d2.push(d1[i] - d1[i - 1]);
  let changes = 0;
  for (let i = 1; i < d2.length; i++) {
    if (Math.sign(d2[i]) !== Math.sign(d2[i - 1])) changes += 1;
  }
  return { d2, changes };
}

// (1) TWO-PARAMETER FIT: ceiling pinned to the imp-3463 rigorous far-tail exponent asymptote 1/2.
const A_PINNED = 0.5;
const FIT2 = logitLinearFit(A_PINNED);
const FIT2_D2 = d2SignChanges(FIT2.pFit);

// (2) THREE-PARAMETER FIT: free the finite-N ceiling A over a grid; pick min p-space RMS.
let FIT3 = null;
for (let A = 0.46; A <= 0.6 + 1e-9; A += 0.0005) {
  if (Math.max(...P_LADDER) >= A) continue; // logit requires p < A
  const f = logitLinearFit(A);
  if (FIT3 === null || f.rms < FIT3.rms) FIT3 = f;
}
const FIT3_D2 = d2SignChanges(FIT3.pFit);

// (F3) structural ceiling from the imp-36197 sigma-logistic slope (1.1020/decade in log10):
// p = -d ln sigma / d ln N = A_struct (1 - sigma), A_struct = slope_log10 / ln 10.
const IMP36197_LOGIT_SLOPE_PER_DECADE = 1.102;
const A_STRUCT = IMP36197_LOGIT_SLOPE_PER_DECADE / Math.LN10; // ~0.4786
const IMP33721_KNEE_LOG10 = 9.529; // imp-33721 sub-decade knee
const IMP36197_MIDPOINT_LOG10 = 9.504; // imp-36197 sigma-logistic midpoint

export const IMP95431_SIGMA_EXPONENT_LADDER_LOGISTIC_FIT = {
  id: 'imp-95431',
  proofSection: 'S-frontier',
  question:
    'imp-33701/imp-33721 established the imp-33582 six-decade sigma(N) local-decay-exponent ladder ' +
    'is S-shaped with a single second-difference (D2) sign change -- a knee at log10 N* ~ 9.529 -- ' +
    'but never fitted a closed-form sigmoid. Does the exponent ladder admit a closed-form LOGISTIC ' +
    'characterization consistent with that single D2 sign change, and what is the fit residual? ' +
    'Measurement/fit only; conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'closed-form logistic p(u) = A / (1 + exp(-k(u - u0))) fitted (via logit linearization, u = ' +
    'decade center k + 0.5) to the imp-33701 six-decade exponent ladder: (1) ceiling pinned A = 1/2 ' +
    '(imp-3463), (2) free finite-N ceiling A; with R^2, p-space RMS/max residual, the fitted-logistic ' +
    'D2 sign-change count, and the fitted midpoint vs the imp-33721 knee / imp-36197 sigma-midpoint',
  ladder: {
    decadeKs: DECADE_KS,
    centersU: U_CENTERS,
    p_local: P_LADDER.map((p) => +p.toFixed(6)),
  },
  pinnedCeilingFit: {
    ceilingA: A_PINNED,
    slopeKPerDecade: +FIT2.k.toFixed(6),
    midpointLog10Nstar: +FIT2.u0.toFixed(4),
    midpointNstar: +Math.pow(10, FIT2.u0).toExponential(4),
    r2: +FIT2.r2.toFixed(6),
    rmsResidual: +FIT2.rms.toExponential(4),
    maxAbsResidual: +FIT2.maxAbs.toExponential(4),
    fittedLogisticD2SignChanges: FIT2_D2.changes,
  },
  freeCeilingFit: {
    ceilingA: +FIT3.A.toFixed(4),
    slopeKPerDecade: +FIT3.k.toFixed(6),
    midpointLog10Nstar: +FIT3.u0.toFixed(4),
    midpointNstar: +Math.pow(10, FIT3.u0).toExponential(4),
    r2: +FIT3.r2.toFixed(6),
    rmsResidual: +FIT3.rms.toExponential(4),
    maxAbsResidual: +FIT3.maxAbs.toExponential(4),
    fittedLogisticD2SignChanges: FIT3_D2.changes,
  },
  structuralLink: {
    identity: 'p = -d ln sigma / d ln N = A_struct (1 - sigma), a scaled logistic derivative-image',
    aStructFromImp36197: +A_STRUCT.toFixed(6),
    imp33721KneeLog10: IMP33721_KNEE_LOG10,
    imp36197MidpointLog10: IMP36197_MIDPOINT_LOG10,
    freeCeilingMidpointVsKneeGap: +Math.abs(FIT3.u0 - IMP33721_KNEE_LOG10).toFixed(4),
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_ladder_is_closed_form_logistic:
      'The logit of p_dec / (1/2) is linear in u to R^2 ~ 0.9927: the pinned-ceiling logistic ' +
      'p(u) = 0.5 / (1 + exp(-1.1180(u - 9.7030))) reproduces the six-decade ladder with RMS ' +
      'residual ~9.54e-3 and max |residual| ~1.43e-2 (exponent units). The fitted-logistic second ' +
      'difference on the ladder centers changes sign EXACTLY ONCE -- the same single ' +
      'convex-to-concave inflection imp-33701 measured, now carried by a closed form.',
    F2_free_ceiling_tightens_and_recovers_knee:
      'Freeing the finite-N ceiling gives A ~ 0.4695, k ~ 1.2079, u0 ~ 9.4904: R^2 rises to ~0.9974, ' +
      'RMS halves to ~5.04e-3, and the midpoint log10 N* ~ 9.490 (N* ~ 3.09e9) sits within ~0.04 ' +
      'decade of the imp-33721 sub-decade knee (9.529) and the imp-36197 sigma-logistic midpoint ' +
      '(9.504). The ceiling 0.4695 sits just below the rigorous 1/2 asymptote -- across the sampled ' +
      'decades the ramp has not yet reached the imp-3463 far-tail exponent, which is why pinning ' +
      'A = 1/2 pushes the midpoint ~0.17 decade high.',
    F3_shape_inherited_from_sigma_logistic:
      'Structurally p = -d ln sigma / d ln N = A_struct (1 - sigma) with A_struct = (imp-36197 logit ' +
      'slope 1.1020/decade) / ln 10 ~ 0.4786; since imp-36197 showed 1 - sigma is a logistic in ' +
      'log10 N, its scaled derivative-image p_dec is a logistic with the SAME midpoint. So the single ' +
      'D2 sign change of the exponent ramp is not an independent coincidence -- it is the one ' +
      'inflection of the imp-36197 sigma-logistic transported to the exponent ladder. The fitted ' +
      'ceiling A ~ 0.4695 brackets the structural 0.4786 from below at the six finite decades sampled.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33701/imp-33721 S-shaped exponent ramp ' +
    'DOES admit a closed-form logistic: pinned to the imp-3463 rigorous ceiling 1/2 it fits to ' +
    'R^2 ~ 0.9927 (RMS ~9.5e-3, midpoint log10 N* ~ 9.703), and freeing the finite-N ceiling to ' +
    '~0.4695 tightens it to R^2 ~ 0.9974 (RMS ~5.0e-3) and lands the midpoint log10 N* ~ 9.490 on ' +
    'the imp-33721 sub-decade knee (9.529, gap ~0.04 decade). The fitted logistic carries exactly ONE ' +
    'second-difference sign change, consistent with the measured single inflection, and the shape is ' +
    'the transported derivative-image p = A_struct(1 - sigma) of the imp-36197 sigma-logistic ' +
    '(A_struct ~ 0.4786). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33701 (whole-decade exponent ladder + single D2 sign change); imp-33721 (sub-decade knee ' +
    'log10 N* ~ 9.529); imp-36197 (sigma(N) is a logistic, this ladder is its derivative-image); ' +
    'imp-33582 (six-decade exponent ladder); imp-3463 (far-tail exponent asymptote 1/2); imp-486 ' +
    '(C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP95431_SIGMA_EXPONENT_LADDER_LOGISTIC_FIT_ASSERTIONS = [
  {
    // Reuse gate: the recomputed ladder reproduces the published imp-33701 p_local to 4 decimals,
    // proving the IDENTICAL sigma model / OLS estimator is in use before the logistic fit runs.
    id: 'imp95431-reuses-imp33701-ladder',
    description: 'recomputed p_local matches the published imp-33701 ladder.p_local to 4 decimals',
    holds: () => {
      const pub = IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.ladder.p_local;
      if (pub.length !== P_LADDER.length) return false;
      for (let i = 0; i < pub.length; i++) {
        if (Math.abs(pub[i] - +P_LADDER[i].toFixed(6)) > 1e-6) return false;
      }
      return true;
    },
  },
  {
    // (F1): the pinned-ceiling logistic is a high-R^2 closed form whose fitted second difference
    // changes sign EXACTLY ONCE -- the same single inflection imp-33701 measured on the raw ladder.
    id: 'imp95431-pinned-logistic-high-r2-single-inflection',
    description: 'ceiling A=1/2 logistic fits to R^2>0.99 and its fitted D2 has exactly one sign change',
    holds: () =>
      FIT2.r2 > 0.99 && FIT2.rms < 1.5e-2 && FIT2_D2.changes === 1,
  },
  {
    // (F2): freeing the finite-N ceiling tightens the fit (RMS halves) and relocates the midpoint
    // to within ~0.1 decade of the imp-33721 sub-decade knee (9.529).
    id: 'imp95431-free-ceiling-tightens-and-recovers-knee',
    description: 'free-ceiling fit RMS<6e-3, R^2>0.997, midpoint within 0.1 decade of imp-33721 knee',
    holds: () =>
      FIT3.rms < 6e-3 &&
      FIT3.r2 > 0.997 &&
      FIT3.rms < FIT2.rms &&
      Math.abs(FIT3.u0 - IMP33721_KNEE_LOG10) < 0.1 &&
      FIT3_D2.changes === 1,
  },
  {
    // (F3): the fitted finite-N ceiling brackets the imp-36197 structural ceiling A_struct ~ 0.4786
    // from below, and A_struct lies below the rigorous 1/2 asymptote -- the derivative-image link.
    id: 'imp95431-structural-ceiling-bracketing',
    description: 'A_struct ~ 0.4786 from imp-36197 slope; free-ceiling A <= A_struct < 1/2',
    holds: () =>
      Math.abs(A_STRUCT - 0.4786) < 1e-3 && FIT3.A <= A_STRUCT && A_STRUCT < 0.5,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp95431-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP95431_SIGMA_EXPONENT_LADDER_LOGISTIC_FIT.isRigorous === false &&
      IMP95431_SIGMA_EXPONENT_LADDER_LOGISTIC_FIT.farTailExponent === 0.5 &&
      /NO QED/.test(IMP95431_SIGMA_EXPONENT_LADDER_LOGISTIC_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP95431_SIGMA_EXPONENT_LADDER_LOGISTIC_FIT.verdict),
  },
];

for (const a of IMP95431_SIGMA_EXPONENT_LADDER_LOGISTIC_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95431-sigma-exponent-ladder-logistic-fit assertion failed: ${a.id}`);
  }
}
