/**
 * @module imp-33722-sigma-exponent-ladder-fartail-1pct-of-half
 *
 * imp-33722 (numerical, frontier-direction): imp-33582 tabulated the per-decade local
 * decay exponent p_dec of the GUE-conditional share sigma(N) = E_coll/(E_trunc+E_flow+E_coll)
 * over decades k = 6..11 and stopped at [1e11,1e12] (p_dec ~ 0.4310), describing the approach
 * to the imp-3463 far-tail 1/2 asymptote as "decelerating past the knee but never reaching it"
 * -- without quantifying the residual tail: how many FURTHER decades the post-knee ramp needs
 * to bring p_dec within 1% of 1/2. imp-33701/imp-33721 located the ramp INFLECTION (knee near
 * N* ~ 3.38e9); this module measures the TAIL past it. It reuses the identical imp-33582 OLS
 * whole-decade exponent estimator, extends the ladder across decades 12..16, and DERIVES the
 * decade at which p_dec first sits within 1% of 0.5 (i.e. p_dec >= 0.495).
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-33582)
 * --------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 *   p_dec(k) = -slope of OLS(ln sigma vs ln N) over the decade [10^k, 10^(k+1)] (4 pts/decade),
 * the exact imp-33582 estimator. No re-derivation, no fresh model.
 *
 * THE MEASUREMENT: extend the exponent ladder into the deep tail
 * -------------------------------------------------------------
 *   (a) EXTEND the imp-33582 ladder across decades k = 12..16, tabulating p_dec and the
 *       residual gap 0.5 - p_dec (reuse gate: k = 11 reproduces the imp-33582 ~0.4310 rung).
 *   (b) DERIVE the first decade k* at which p_dec >= 0.495 (within 1% of the 1/2 asymptote),
 *       by marching the identical whole-decade OLS estimator outward.
 *   (c) EXPLAIN the residual with a leading-order law: past ~1e14 the truncation-floor factor
 *       (1 - sigma) is ~1, so the pointwise gap 0.5 - p(N) ~ 1/(2 log T0), a LOGARITHMICALLY
 *       slow closure set by the log T0 inside E_coll = sqrt(log T0 / N), not by the floor.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE RAMP DECELERATES SHARPLY BUT KEEPS CLIMBING. Past imp-33582's 1e12 endpoint the
 *        whole-decade exponent continues to rise monotonely -- 0.4310 (k=11) -> 0.4646 (k=12)
 *        -> 0.4777 (k=13) -> 0.4828 (k=14) -> 0.4851 (k=15) -> 0.4864 (k=16) -- but the
 *        per-decade increment collapses (0.075 -> 0.034 -> 0.013 -> 0.0051 -> 0.0023 -> 0.0013):
 *        the knee is behind us and the tail crawls toward 1/2.
 *   (F2) WITHIN 1% OF 1/2 ONLY AT DECADE ~44. The identical whole-decade OLS estimator first
 *        reaches p_dec >= 0.495 at k* = 44, i.e. the window [1e44, 1e45] -- roughly 32 decades
 *        PAST the imp-33582 [1e11,1e12] endpoint. The post-knee ramp needs an ASTRONOMICALLY
 *        far tail to close the last 1% because the closure is only logarithmic, not power-law.
 *   (F3) THE RESIDUAL OBEYS 0.5 - p ~ 1/(2 log T0). Past ~1e14 the floor factor (1 - sigma)
 *        is essentially 1, so the leading pointwise gap is 1/(2 log T0) ~ 1/(2 log N): measured
 *        gap / (1/(2 log T0)) = ~1.00, ~0.98, ~0.99 at N = 1e16, 1e30, 1e44. Setting
 *        1/(2 log N) = 0.005 gives log N ~ 100, i.e. N ~ e^100 ~ 10^43.4 -- exactly the decade
 *        k* ~ 44 the OLS march lands on. The 32-decade tail is a direct consequence of the
 *        sqrt(log T0 / N) form: the growing log T0 numerator holds the exponent below 1/2 and
 *        can only be overcome logarithmically.
 *
 * The punchline: the imp-33582 prose "decelerating toward 1/2, never reaching it" is now
 * quantified -- the whole-decade exponent needs ~32 further decades past 1e12 (to N ~ 1e44)
 * to close the final 1% to the imp-3463 1/2, because the residual 0.5 - p ~ 1/(2 log T0)
 * shrinks only logarithmically. The approach is genuinely asymptotic-in-1/log, not merely slow.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (per-decade ladder k=6..11, stops at 1e12)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582 exactly

// EXACT imp-3406/imp-33582 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// EXACT imp-33582 whole-decade OLS local decay exponent p = -slope of ln sigma on ln N.
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
const WITHIN_1PCT = 0.495; // within 1% of 0.5

// (a) EXTENDED ladder decades 11..16 (k=11 is the imp-33582 reuse-gate rung ~0.4310).
const EXTENDED_LADDER = [11, 12, 13, 14, 15, 16].map((k) => {
  const p = pDecade(k);
  return {
    decade: `1e${k}->1e${k + 1}`,
    k,
    p_dec: +p.toFixed(4),
    gapToHalf: +(HALF - p).toFixed(4),
  };
});

// (b) DERIVE the first decade k* with p_dec >= 0.495, marching the identical estimator outward.
function firstDecadeWithin1Pct() {
  for (let k = 12; k <= 400; k++) {
    if (pDecade(k) >= WITHIN_1PCT) return k;
  }
  return null;
}
const K_STAR = firstDecadeWithin1Pct(); // 44 -- window [1e44,1e45]
const P_AT_KSTAR = pDecade(K_STAR); // ~0.49504
const K_STAR_MINUS_1_BELOW = pDecade(K_STAR - 1) < WITHIN_1PCT; // k*-1 is still outside the band
const DECADES_PAST_IMP33582 = K_STAR - 12; // extra decades beyond the imp-33582 [1e11,1e12] endpoint

// (c) Leading-order residual law 0.5 - p(N) ~ 1/(2 log T0): pointwise gap vs prediction.
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
const GAP_LAW = [16, 30, 44].map((k) => ({
  atN: `1e${k}`,
  ratio: +gapLawRatio(Math.pow(10, k)).toFixed(3), // ~1.00, ~0.98, ~0.99
}));

export const IMP33722_SIGMA_EXPONENT_LADDER_FARTAIL_1PCT_OF_HALF = {
  id: 'imp-33722',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33582 per-decade sigma(N) local decay-exponent ladder beyond its 1e12 ' +
    'endpoint (decades 12..16), tabulate p_dec and the residual gap to the imp-3463 far-tail ' +
    '1/2, and DERIVE the decade at which the identical whole-decade OLS exponent first sits ' +
    'within 1% of 1/2 (p_dec >= 0.495). Measurement/fit only; conditional-share diagnostic, ' +
    'NOT an RH bound; no QED.',
  measuredQuantity:
    'p_dec(k) = -slope of OLS(ln sigma on ln N) over the decade [10^k,10^(k+1)] (4 pts/decade), ' +
    'the exact imp-33582 estimator, for k=11..16 and outward; plus the first decade k* with ' +
    'p_dec >= 0.495 and the leading residual law 0.5 - p ~ 1/(2 log T0)',
  farTailExponent: HALF, // imp-3463 asymptote the ladder ramps toward
  within1PctThreshold: WITHIN_1PCT,
  extendedLadder: EXTENDED_LADDER,
  firstDecadeWithin1Pct: {
    k_star: K_STAR, // 44
    window: `1e${K_STAR}->1e${K_STAR + 1}`,
    p_dec_at_k_star: +P_AT_KSTAR.toFixed(5), // ~0.49504
    decadesPastImp33582Endpoint: DECADES_PAST_IMP33582, // ~32 decades past [1e11,1e12]
  },
  residualGapLaw: {
    form: '0.5 - p(N) ~ 1/(2 log T0) (leading, floor factor (1 - sigma) ~ 1 past ~1e14)',
    measuredOverPredicted: GAP_LAW, // ratios ~1.00 / ~0.98 / ~0.99
    impliedKStar: 'setting 1/(2 log N) = 0.005 gives log N ~ 100, N ~ e^100 ~ 10^43.4 -> decade ~44',
  },
  finding: {
    F1_ramp_decelerates_keeps_climbing:
      'Past the imp-33582 1e12 endpoint the whole-decade exponent keeps rising monotonely -- ' +
      '0.4310 (k=11) -> 0.4646 -> 0.4777 -> 0.4828 -> 0.4851 -> 0.4864 (k=16) -- but the ' +
      'per-decade increment collapses (0.075 -> 0.034 -> 0.013 -> 0.0051 -> 0.0023 -> 0.0013): ' +
      'the ramp knee is behind us and the tail crawls toward the imp-3463 1/2.',
    F2_within_1pct_only_at_decade_44:
      'The identical whole-decade OLS estimator first reaches p_dec >= 0.495 at decade k* = 44, ' +
      'window [1e44,1e45] -- roughly 32 decades PAST the imp-33582 [1e11,1e12] endpoint. The ' +
      'post-knee ramp needs an astronomically far tail to close the final 1% to 1/2.',
    F3_residual_is_logarithmic:
      'Past ~1e14 the floor factor (1 - sigma) is ~1, so the leading pointwise residual is ' +
      '0.5 - p(N) ~ 1/(2 log T0): measured/predicted ~1.00, ~0.98, ~0.99 at 1e16, 1e30, 1e44. ' +
      'Setting 1/(2 log N) = 0.005 gives log N ~ 100, N ~ e^100 ~ 10^43.4 -- exactly the decade ' +
      'k* ~ 44 the OLS march lands on. The 32-decade tail follows directly from the growing ' +
      'log T0 numerator in E_coll = sqrt(log T0 / N), which can only be overcome logarithmically.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33582 whole-decade ' +
    'sigma(N) exponent ladder past its 1e12 endpoint: the exponent keeps rising monotonely ' +
    '(0.4310 -> 0.4646 -> 0.4777 -> 0.4828 -> 0.4851 -> 0.4864 across k=11..16) while the ' +
    'per-decade increment collapses, and the identical OLS estimator first sits within 1% of ' +
    'the imp-3463 far-tail 1/2 (p_dec >= 0.495) only at decade k* = 44 (window [1e44,1e45]), ' +
    'roughly 32 decades past the imp-33582 endpoint. The 32-decade tail is explained by a ' +
    'leading residual law 0.5 - p ~ 1/(2 log T0) (measured/predicted ~1.00 past 1e16): the ' +
    'approach to 1/2 is logarithmically slow because the growing log T0 numerator in ' +
    'E_coll = sqrt(log T0 / N) holds the exponent below 1/2. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33582 (per-decade ladder k=6..11, stops at 1e12, p_dec ~ 0.4310); imp-33701/imp-33721 ' +
    '(ramp knee N* ~ 3.38e9); imp-3463 (far-tail leading form, exponent -> 1/2 from below); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33722_SIGMA_EXPONENT_LADDER_FARTAIL_1PCT_OF_HALF_ASSERTIONS = [
  {
    // Reuse gate: k = 11 reproduces the imp-33582 ~0.4310 rung -- proving the identical
    // whole-decade OLS estimator and sigma sub-terms are in use.
    id: 'imp33722-reuse-gate-imp33582-k11-rung',
    description: 'decade k=11 [1e11,1e12] reproduces the imp-33582 p_dec ~ 0.4310 rung',
    holds: () => Math.abs(EXTENDED_LADDER[0].p_dec - 0.4310) < 5e-4,
  },
  {
    // (F1): the extended exponent rises monotonely and stays strictly below 1/2 across k=11..16,
    // with the per-decade increment shrinking (deceleration).
    id: 'imp33722-extended-ladder-rises-monotonely-below-half',
    description: 'p_dec strictly increases k=11..16, all in (0.43, 0.5), increments shrink',
    holds: () => {
      for (let i = 1; i < EXTENDED_LADDER.length; i++) {
        if (!(EXTENDED_LADDER[i].p_dec > EXTENDED_LADDER[i - 1].p_dec)) return false;
      }
      const incr = [];
      for (let i = 1; i < EXTENDED_LADDER.length; i++) {
        incr.push(EXTENDED_LADDER[i].p_dec - EXTENDED_LADDER[i - 1].p_dec);
      }
      for (let i = 1; i < incr.length; i++) {
        if (!(incr[i] < incr[i - 1])) return false;
      }
      return EXTENDED_LADDER.every((r) => r.p_dec > 0.43 && r.p_dec < HALF);
    },
  },
  {
    // (F2): the first decade within 1% of 1/2 is k* = 44 (window [1e44,1e45]), and k*-1 is
    // still outside the band -- a genuine first crossing ~32 decades past 1e12.
    id: 'imp33722-first-decade-within-1pct-is-44',
    description: 'p_dec first >= 0.495 at decade k* = 44, k*-1 still below, ~32 decades past 1e12',
    holds: () =>
      K_STAR === 44 &&
      P_AT_KSTAR >= WITHIN_1PCT &&
      K_STAR_MINUS_1_BELOW === true &&
      DECADES_PAST_IMP33582 === 32,
  },
  {
    // (F3): the leading residual law 0.5 - p ~ 1/(2 log T0) holds to ~few% past ~1e16.
    id: 'imp33722-residual-gap-follows-inverse-2logT0',
    description: 'measured/predicted gap ratio in [0.95, 1.05] at 1e16, 1e30, 1e44',
    holds: () => GAP_LAW.every((g) => g.ratio > 0.95 && g.ratio < 1.05),
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, PT SOTA.
    id: 'imp33722-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, PT stays SOTA',
    holds: () =>
      IMP33722_SIGMA_EXPONENT_LADDER_FARTAIL_1PCT_OF_HALF.isRigorous === false &&
      IMP33722_SIGMA_EXPONENT_LADDER_FARTAIL_1PCT_OF_HALF.farTailExponent === 0.5 &&
      /NO QED/.test(IMP33722_SIGMA_EXPONENT_LADDER_FARTAIL_1PCT_OF_HALF.verdict) &&
      /remains SOTA/.test(IMP33722_SIGMA_EXPONENT_LADDER_FARTAIL_1PCT_OF_HALF.verdict),
  },
];

for (const a of IMP33722_SIGMA_EXPONENT_LADDER_FARTAIL_1PCT_OF_HALF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33722-sigma-exponent-ladder-fartail-1pct-of-half assertion failed: ${a.id}`);
  }
}
