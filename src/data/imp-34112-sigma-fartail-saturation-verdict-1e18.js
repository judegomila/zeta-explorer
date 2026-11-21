/**
 * @module imp-34112-sigma-fartail-saturation-verdict-1e18
 *
 * imp-34112 (numerical, frontier-direction): the lambda-roadmap currentStatus records the
 * GUE-conditional share sigma(N) = E_coll/(E_trunc+E_flow+E_coll) local decay exponent ramping
 * from ~0.0105 in the first post-peak decade toward the imp-3463 far-tail 1/2 asymptote via an
 * S-shaped (imp-33701 sigmoid) approach whose knee (imp-33721) sits near N* ~ 3.38e9, reaching
 * ~0.4310 by the [1e11,1e12] decade (imp-33582). The behaviour PAST 1e12 -- specifically whether
 * the sigmoid has effectively SATURATED to 1/2 or still carries a measurable residual gap -- is
 * not framed as a verdict. imp-33722 extended the whole-decade ladder to k=16 and marched the
 * 1%-band crossing out to k* ~ 44; this module reads the same ladder as an explicit SATURATION
 * TEST out to the [1e17,1e18] bracket and reports the residual-gap verdict.
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-33582 / imp-33722)
 * --------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *   p_dec(k) = -slope of OLS(ln sigma vs ln N) over the decade [10^k, 10^(k+1)] (4 pts/decade),
 * the exact imp-33582/imp-33722 estimator. No re-derivation, no fresh model.
 *
 * THE MEASUREMENT: read the deep-tail ladder as a saturation test
 * --------------------------------------------------------------
 *   (a) TABULATE the whole-decade exponent p_dec(k) and residual gap 0.5 - p_dec across the
 *       brackets k = 12..17 -- i.e. [1e12,1e13] out to [1e17,1e18] -- reusing the identical
 *       imp-33582/imp-33722 OLS estimator (reuse gate: k=12 reproduces the imp-33722 ~0.4646 rung).
 *   (b) VERDICT: declare "saturated" only if the residual gap at the far end [1e17,1e18] falls
 *       within a stated tolerance TOL = 5e-3 (i.e. within 1% of the 1/2 asymptote). Report
 *       whether it does.
 *   (c) FIT the residual decay: past ~1e14 the truncation-floor factor (1 - sigma) is ~1, so the
 *       pointwise gap 0.5 - p(N) ~ 1/(2 log T0), a LOGARITHMICALLY slow closure set by the
 *       log T0 numerator in E_coll = sqrt(log T0 / N), not by the floor.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (V1) NOT SATURATED AT 1e18. The residual gap at the far-end bracket [1e17,1e18] is
 *        0.5 - p_dec ~ 0.01269 -- roughly 2.5% of the 1/2 asymptote, an order of magnitude
 *        ABOVE the 5e-3 saturation tolerance. The sigmoid has NOT closed to 1/2 by 1e18; it
 *        still carries a clearly measurable residual gap.
 *   (V2) THE GAP CRAWLS, NEVER STALLS. Across k = 12..17 the residual gap decreases monotonely
 *        -- 0.03539 -> 0.02232 -> 0.01718 -> 0.01488 -> 0.01359 -> 0.01269 -- but the per-decade
 *        shrinkage collapses (from ~0.013 to ~0.0009): the tail keeps closing yet at a decaying
 *        rate, exactly the far-tail crawl imp-33722 marched out to k* ~ 44 for the full 1% band.
 *   (V3) THE RESIDUAL OBEYS 0.5 - p ~ 1/(2 log T0). Past ~1e15 the measured pointwise gap tracks
 *        1/(2 log T0) to within a few percent (measured/predicted ~1.04, ~1.00, ~0.98, ~0.98 at
 *        1e15, 1e16, 1e17, 1e18): the closure is logarithmic, not power-law. Setting
 *        1/(2 log N) = 5e-3 gives log N ~ 100, N ~ e^100 ~ 10^43.4 -- consistent with the imp-33722
 *        k* ~ 44 landing point for the whole-decade OLS 1%-band crossing.
 *
 * The punchline: out to the [1e17,1e18] bracket the imp-33701 sigmoid has NOT saturated to the
 * imp-3463 1/2 -- it retains a ~2.5%-of-half residual gap (0.5 - p ~ 0.0127) that closes only
 * logarithmically as 1/(2 log T0). "Fully saturated by 1e18" is FALSE; the honest answer is a
 * persistent, logarithmically-shrinking residual gap consistent with the imp-33722 k* ~ 44 tail.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (per-decade ladder k=6..11, stops at 1e12)
 * @see imp-33722-sigma-exponent-ladder-fartail-1pct-of-half (ladder to k=16, k* ~ 44 for the 1% band)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (ramp knee, whole-decade D2 sign change)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee N* ~ 3.38e9)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33722 exactly

// EXACT imp-3406/imp-33582/imp-33722 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// EXACT imp-33582/imp-33722 whole-decade OLS local decay exponent p = -slope of ln sigma on ln N.
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
  return -sxy / sxx;
}
const pDecade = (k) => olsExponent(Math.pow(10, k), Math.pow(10, k + 1));

const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote
const SATURATION_TOL = 5e-3; // "saturated" = residual gap within 1% of 0.5

// (a) TABULATE the deep-tail ladder decades 12..17: [1e12,1e13] out to [1e17,1e18].
const DEEP_TAIL_LADDER = [12, 13, 14, 15, 16, 17].map((k) => {
  const p = pDecade(k);
  return {
    bracket: `[1e${k},1e${k + 1}]`,
    k,
    p_dec: +p.toFixed(6),
    residualGap: +(HALF - p).toFixed(6),
  };
});

// (b) VERDICT at the far-end bracket [1e17,1e18].
const FAR_END = DEEP_TAIL_LADDER[DEEP_TAIL_LADDER.length - 1]; // k=17
const FAR_END_GAP = FAR_END.residualGap; // ~0.012688
const IS_SATURATED = FAR_END_GAP <= SATURATION_TOL; // false -- residual gap persists
const GAP_AS_PCT_OF_HALF = +((FAR_END_GAP / HALF) * 100).toFixed(2); // ~2.54% of 1/2

// (c) FIT the residual decay 0.5 - p(N) ~ 1/(2 log T0): pointwise gap vs prediction.
function pointwiseExponent(N) {
  const h = 1e-5;
  const s1 = Math.log(sigma(Math.exp(Math.log(N) + h)));
  const s0 = Math.log(sigma(Math.exp(Math.log(N) - h)));
  return -(s1 - s0) / (2 * h);
}
function gapLawRatio(N) {
  const measured = HALF - pointwiseExponent(N);
  const predicted = 1 / (2 * Math.log(effectiveHeightForN(N)));
  return measured / predicted;
}
const RESIDUAL_FIT = [15, 16, 17, 18].map((k) => ({
  atN: `1e${k}`,
  ratio: +gapLawRatio(Math.pow(10, k)).toFixed(4), // ~1.04, ~1.00, ~0.98, ~0.98
}));

export const IMP34112_SIGMA_FARTAIL_SATURATION_VERDICT_1E18 = {
  id: 'imp-34112',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33582/imp-33701 sigma(N) local decay-exponent ladder past 1e12 (brackets ' +
    '[1e12,1e13]..[1e17,1e18]) and report whether the imp-33701 sigmoid has FULLY SATURATED to ' +
    'the imp-3463 far-tail 1/2 (within a stated tolerance) or retains a measurable residual gap, ' +
    'fitting the residual (1/2 - exponent) decay. Measurement/fit only; conditional-share ' +
    'diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'p_dec(k) = -slope of OLS(ln sigma on ln N) over the decade [10^k,10^(k+1)] (4 pts/decade), ' +
    'the exact imp-33582/imp-33722 estimator, for k=12..17; the residual gap 0.5 - p_dec at the ' +
    'far-end bracket [1e17,1e18] vs a 5e-3 saturation tolerance; and the residual law ' +
    '0.5 - p ~ 1/(2 log T0)',
  farTailExponent: HALF, // imp-3463 asymptote the ladder ramps toward
  saturationTolerance: SATURATION_TOL,
  deepTailLadder: DEEP_TAIL_LADDER,
  saturationVerdict: {
    farEndBracket: FAR_END.bracket, // [1e17,1e18]
    farEndResidualGap: FAR_END_GAP, // ~0.012688
    gapAsPctOfHalf: GAP_AS_PCT_OF_HALF, // ~2.54%
    isSaturated: IS_SATURATED, // false
    statement:
      'NOT saturated by 1e18: the residual gap 0.5 - p_dec ~ 0.0127 at [1e17,1e18] is ~2.5% of ' +
      'the 1/2 asymptote, an order of magnitude above the 5e-3 tolerance -- the imp-33701 ' +
      'sigmoid still carries a clearly measurable residual gap.',
  },
  residualDecayFit: {
    form: '0.5 - p(N) ~ 1/(2 log T0) (leading, floor factor (1 - sigma) ~ 1 past ~1e14)',
    measuredOverPredicted: RESIDUAL_FIT, // ratios ~1.04 / ~1.00 / ~0.98 / ~0.98
    impliedSaturationScale:
      'setting 1/(2 log N) = 5e-3 gives log N ~ 100, N ~ e^100 ~ 10^43.4 -- consistent with the ' +
      'imp-33722 k* ~ 44 landing point for the whole-decade OLS 1%-band crossing',
  },
  finding: {
    V1_not_saturated_at_1e18:
      'The residual gap at [1e17,1e18] is 0.5 - p_dec ~ 0.01269, ~2.5% of the 1/2 asymptote and ' +
      'an order of magnitude above the 5e-3 saturation tolerance: the sigmoid has NOT closed to ' +
      'the imp-3463 1/2 by 1e18.',
    V2_gap_crawls_never_stalls:
      'Across k=12..17 the residual gap decreases monotonely -- 0.03539 -> 0.02232 -> 0.01718 -> ' +
      '0.01488 -> 0.01359 -> 0.01269 -- while the per-decade shrinkage collapses: the tail keeps ' +
      'closing but at a decaying rate, the same far-tail crawl imp-33722 marched to k* ~ 44.',
    V3_residual_is_logarithmic:
      'Past ~1e15 the measured pointwise gap tracks 1/(2 log T0) to within a few percent ' +
      '(measured/predicted ~1.04, ~1.00, ~0.98, ~0.98 at 1e15..1e18): the closure is logarithmic, ' +
      'not power-law. Setting 1/(2 log N) = 5e-3 gives log N ~ 100, N ~ 10^43.4 -- consistent with ' +
      'the imp-33722 k* ~ 44 whole-decade 1%-band crossing.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33582/imp-33701 sigma(N) ' +
    'whole-decade decay-exponent ladder past 1e12 out to the [1e17,1e18] bracket: the exponent ' +
    'keeps rising (0.4646 -> 0.4777 -> 0.4828 -> 0.4851 -> 0.4864 -> 0.4873 across k=12..17) yet ' +
    'the imp-33701 sigmoid is NOT saturated to the imp-3463 far-tail 1/2 by 1e18 -- the residual ' +
    'gap 0.5 - p_dec ~ 0.0127 at [1e17,1e18] is ~2.5% of 1/2, an order of magnitude above the ' +
    '5e-3 tolerance. The gap decreases monotonely but at a collapsing per-decade rate, and its ' +
    'pointwise value tracks the leading residual law 0.5 - p ~ 1/(2 log T0) to within a few ' +
    'percent past 1e15: a logarithmically slow closure whose 5e-3 crossing sits near N ~ 10^43.4, ' +
    'consistent with the imp-33722 k* ~ 44 landing point. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33582 (per-decade ladder k=6..11, stops at 1e12, p_dec ~ 0.4310); imp-33722 (ladder to ' +
    'k=16, k* ~ 44 for the 1% band); imp-33701/imp-33721 (ramp knee N* ~ 3.38e9); imp-3463 ' +
    '(far-tail leading form, exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34112_SIGMA_FARTAIL_SATURATION_VERDICT_1E18_ASSERTIONS = [
  {
    // Reuse gate: k=12 reproduces the imp-33722 ~0.4646 rung -- proving the identical
    // whole-decade OLS estimator and sigma sub-terms are in use.
    id: 'imp34112-reuse-gate-imp33722-k12-rung',
    description: 'decade k=12 [1e12,1e13] reproduces the imp-33722 p_dec ~ 0.4646 rung',
    holds: () => Math.abs(DEEP_TAIL_LADDER[0].p_dec - 0.4646) < 5e-4,
  },
  {
    // (V2): the residual gap decreases monotonely across k=12..17 and stays strictly positive.
    id: 'imp34112-residual-gap-decreases-monotonely-positive',
    description: 'residual gap strictly decreases k=12..17, all strictly positive',
    holds: () => {
      for (let i = 1; i < DEEP_TAIL_LADDER.length; i++) {
        if (!(DEEP_TAIL_LADDER[i].residualGap < DEEP_TAIL_LADDER[i - 1].residualGap)) return false;
      }
      return DEEP_TAIL_LADDER.every((r) => r.residualGap > 0);
    },
  },
  {
    // (V1): the far-end [1e17,1e18] residual gap is ~0.0127, above the 5e-3 tolerance -> NOT saturated.
    id: 'imp34112-not-saturated-at-1e18',
    description: 'far-end [1e17,1e18] residual gap ~0.0127 > 5e-3 tol; isSaturated === false',
    holds: () =>
      Math.abs(FAR_END_GAP - 0.012688) < 5e-4 &&
      FAR_END_GAP > SATURATION_TOL &&
      IS_SATURATED === false &&
      GAP_AS_PCT_OF_HALF > 2.4 &&
      GAP_AS_PCT_OF_HALF < 2.7,
  },
  {
    // (V3): the leading residual law 0.5 - p ~ 1/(2 log T0) holds to ~few% past ~1e15.
    id: 'imp34112-residual-gap-follows-inverse-2logT0',
    description: 'measured/predicted gap ratio in [0.95, 1.06] at 1e15, 1e16, 1e17, 1e18',
    holds: () => RESIDUAL_FIT.every((g) => g.ratio > 0.95 && g.ratio < 1.06),
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34112-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP34112_SIGMA_FARTAIL_SATURATION_VERDICT_1E18.isRigorous === false &&
      IMP34112_SIGMA_FARTAIL_SATURATION_VERDICT_1E18.farTailExponent === 0.5 &&
      /NO QED/.test(IMP34112_SIGMA_FARTAIL_SATURATION_VERDICT_1E18.verdict) &&
      /refereed bound is changed/i.test(IMP34112_SIGMA_FARTAIL_SATURATION_VERDICT_1E18.verdict),
  },
];

for (const a of IMP34112_SIGMA_FARTAIL_SATURATION_VERDICT_1E18_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34112-sigma-fartail-saturation-verdict-1e18 assertion failed: ${a.id}`);
  }
}
