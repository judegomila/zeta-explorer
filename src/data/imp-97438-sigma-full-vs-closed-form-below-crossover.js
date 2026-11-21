/**
 * @module imp-97438-sigma-full-vs-closed-form-below-crossover
 *
 * imp-97438 (numerical, frontier-direction): imp-97428 cross-validated the FULL three-term share
 * model sigma_full = E_coll/(E_trunc+E_flow+E_coll) against the imp-96151 two-term CLOSED FORM
 * sigma_CF = 1/(1 + sqrt(N/N_cross) sqrt(L_cross/L)) across the far-tail band [1e11..1e15] and found
 * they AGREE to 4 dp because E_flow/E_coll -> 0 there (5.07e-4 at 1e11 -> 1.16e-5 at 1e15). But that
 * band lies ENTIRELY ABOVE the crossover: the region where the dropped Gronwall E_flow term still
 * matters is BELOW ~1e11, spanning N_cross ~ 3.280294e9 (imp-33723/imp-96151). This module measures
 * the COMPLEMENT of the imp-97428 agreement band -- the same four diagnostics across [1e8..1e11]
 * spanning N_cross -- to quantify WHERE and HOW MUCH the two models DIVERGE.
 *
 * THE TWO SHARE MODELS (identical inherited sub-terms as imp-97428; no re-derivation)
 * ----------------------------------------------------------------------------------
 *   FULL (imp-3406/imp-33582/imp-97404):
 *     sigma_full(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C sqrt(L/N),  E_flow = C_F (L/T0) Gronwall,  E_trunc = 3.06e-5,  L = log T0(N).
 *   CLOSED FORM (imp-33723/imp-96151), the two-term (E_trunc + E_coll) limit with E_flow dropped:
 *     sigma_CF(N) = 1 / (1 + sqrt(N/N_cross) sqrt(L_cross/L(N))),  N_cross ~ 3.280294e9.
 * The ONLY structural difference is the E_flow (Gronwall) term the closed form omits. imp-97428
 * showed this vanishes in the far tail; here, below 1e11, it does NOT -- so the two DIVERGE, and the
 * size of the divergence is exactly E_flow/E_coll (the fraction the closed form ignores).
 *
 * THE MEASUREMENT: full-vs-closed-form DIVERGENCE across [1e8..1e11] (the complement band)
 * --------------------------------------------------------------------------------------
 *   (a) per-decade OLS exponent p_dec for BOTH models over each decade [10^k,10^(k+1)], k=8..10
 *       (4 pts/decade, identical estimator to imp-97404/imp-96151/imp-97428), and the exponent diff.
 *   (b) pointwise p(N) = -d ln sigma/d ln N for BOTH models at N = 1e8, 1e9, N_cross, 1e10, 1e11.
 *   (c) the share residual sigma_full - sigma_CF and the relative gap at each point.
 *   (d) the dropped-term ratio E_flow/E_coll (how much the closed form throws away here).
 *
 * THE FINDING (measurement / cross-check only)
 * --------------------------------------------
 *   (F1) THE MODELS DIVERGE BELOW 1e11 -- THE MIRROR IMAGE OF imp-97428. The relative share gap
 *        |sigma_full - sigma_CF|/sigma_full GROWS as N drops through the crossover: 8.27e-5 (1e11) ->
 *        4.60e-4 (1e10) -> 1.89e-3 (1e9) -> 5.73e-3 (1e8), a factor of ~69x across the band and ~217x
 *        the 2.64e-8 imp-97428 measured at its 1e15 far-tail rung. The closed form OVER-estimates the
 *        share throughout (residual negative, sigma_CF > sigma_full) because dropping E_flow shrinks
 *        the denominator.
 *   (F2) THE DIVERGENCE IS EXACTLY THE DROPPED E_flow TERM, NOW NON-NEGLIGIBLE. E_flow/E_coll -- the
 *        only structural difference -- rises 5.07e-4 (1e11) -> 1.24e-3 (1e10) -> 2.96e-3 (1e9) ->
 *        6.82e-3 (1e8), tracking the relative share gap to within a small constant factor, exactly as
 *        it does (shrinking) above 1e11. The Gronwall flow term is a ~0.7% fraction of the collapse
 *        term at 1e8, no longer the vanishing fraction imp-97428 saw in the far tail.
 *   (F3) AT THE CROSSOVER THE TWO MODELS SEPARATE BY ~0.1%. By construction sigma_CF(N_cross) = 0.5
 *        EXACTLY (sqrt(N/N_cross) = 1, sqrt(L_cross/L) = 1), while the full model gives 0.49953 -- a
 *        relative gap of 9.50e-4 with E_flow/E_coll = 1.90e-3 at N_cross. So the 50/50 collapse-vs-
 *        rest crossover the closed form pins at N_cross ~ 3.28e9 sits at a slightly LOWER N in the
 *        full model (the retained E_flow pushes sigma_full below 1/2 there). The per-decade exponents
 *        also separate most at the bottom: diff -1.66e-3 [1e8,1e9] -> -6.16e-4 -> -1.62e-4 [1e10,1e11],
 *        the opposite trend to the imp-97428 -3.00e-5 -> -7.83e-8 far-tail shrinkage.
 *
 * The punchline: below 1e11, spanning N_cross ~ 3.28e9, the full three-term and imp-96151 two-term
 * closed-form share models DIVERGE -- the complement of the imp-97428 far-tail agreement band. The
 * relative share gap grows 8.27e-5 (1e11) -> 5.73e-3 (1e8) in lockstep with the retained E_flow/E_coll
 * ratio 5.07e-4 -> 6.82e-3, and at the crossover the closed form's exact sigma_CF = 1/2 sits ~0.1%
 * above the full model's 0.49953. The 1e11 rung reproduces the imp-97428 boundary value 8.27e-5 to the
 * digit, so the two bands join continuously: agreement above, divergence below, both governed by the
 * same dropped E_flow term.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406/imp-33723 surrogate, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; far-tail exponent 1/2 per imp-3463; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97428-sigma-full-vs-closed-form-cross-validation (the [1e11..1e15] agreement band -- this
 *      module measures its complement below 1e11)
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (two-term closed-form model)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross fixed point)
 * @see imp-97404-sigma-fartail-exponent-ladder-past-1e12 (full-model far-tail ladder)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote both models ramp toward; also the CF crossover value
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97404/imp-96151/imp-97428 exactly

// FULL three-term share (EXACT imp-3406/imp-33582/imp-97404/imp-97428 sub-terms; no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // the term the closed form drops
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigmaFull = (N) => parts(N).sigma;

// CLOSED-FORM two-term share (imp-33723/imp-96151): the E_flow-dropped limit.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS = crossoverFixedPoint(1e9, 60); // ~3.280294e9
const L_CROSS = Math.log(effectiveHeightForN(N_CROSS)); // ~20.8576
function sigmaCF(N) {
  const L = Math.log(effectiveHeightForN(N));
  return 1 / (1 + Math.sqrt(N / N_CROSS) * Math.sqrt(L_CROSS / L));
}

// Per-decade OLS decay exponent p = -slope of ln sigma on ln N over [loN,hiN] (4 pts/decade).
// Identical estimator to imp-97404/imp-96151/imp-97428; only the model f moves.
function olsExponent(f, loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(f(N)));
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
// Pointwise local exponent p(N) = -d ln sigma / d ln N via a centered log-difference.
function pointwiseExponent(f, N) {
  const h = 1e-4;
  return -(Math.log(f(N * Math.exp(h))) - Math.log(f(N * Math.exp(-h)))) / (2 * h);
}

// (F1)/(F3) per-decade full-vs-closed-form exponent divergence across [1e8..1e11].
const PER_DECADE = [8, 9, 10].map((k) => {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pFull = olsExponent(sigmaFull, lo, hi);
  const pCF = olsExponent(sigmaCF, lo, hi);
  return {
    decade: `1e${k}->1e${k + 1}`,
    p_full: +pFull.toFixed(4),
    p_closed_form: +pCF.toFixed(4),
    exponentDiff: +(pFull - pCF).toExponential(3),
  };
});

// (F1)/(F2)/(F3) pointwise cross-check across [1e8..1e11], INCLUDING the N_cross landmark.
const POINTWISE_NS = [
  { N: 1e8, label: '1e8' },
  { N: 1e9, label: '1e9' },
  { N: N_CROSS, label: 'N_cross' },
  { N: 1e10, label: '1e10' },
  { N: 1e11, label: '1e11' },
];
const POINTWISE = POINTWISE_NS.map(({ N, label }) => {
  const sf = sigmaFull(N);
  const sc = sigmaCF(N);
  const pr = parts(N);
  return {
    N: label,
    sigma_full: +sf.toExponential(4),
    sigma_closed_form: +sc.toExponential(4),
    shareResidual: +(sf - sc).toExponential(3),
    relGap: +(Math.abs(sf - sc) / sf).toExponential(3),
    p_full: +pointwiseExponent(sigmaFull, N).toFixed(5),
    p_closed_form: +pointwiseExponent(sigmaCF, N).toFixed(5),
    eflow_over_ecoll: +(pr.E_flow / pr.E_coll).toExponential(3),
  };
});

const MAX_REL_GAP = Math.max(...POINTWISE.map((r) => r.relGap)); // ~5.73e-3 at 1e8
const MAX_EXPONENT_DIFF = Math.max(...PER_DECADE.map((r) => Math.abs(r.exponentDiff))); // ~1.66e-3
const REL_GAP_1E11 = POINTWISE.find((r) => r.N === '1e11').relGap; // ~8.27e-5, joins the imp-97428 band
const SIGMA_CF_AT_CROSS = POINTWISE.find((r) => r.N === 'N_cross').sigma_closed_form; // 0.5 exactly

export const IMP97438_SIGMA_FULL_VS_CLOSED_FORM_BELOW_CROSSOVER = {
  id: 'imp-97438',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the full three-term share model sigma_full = E_coll/(E_trunc+E_flow+E_coll) ' +
    'against the imp-96151 two-term closed form sigma_CF = 1/(1+sqrt(N/N_cross) sqrt(L_cross/L)) ' +
    'BELOW 1e11, spanning N_cross ~ 3.28e9 -- the complement of the imp-97428 [1e11..1e15] agreement ' +
    'band, where the dropped E_flow term is NOT negligible and the two models must DIVERGE. Measure ' +
    'per-decade OLS exponents from both models, pointwise p(N), the share residual, and the ' +
    'E_flow/E_coll ratio across [1e8..1e11]; quantify WHERE and HOW MUCH they diverge. ' +
    'Measurement/cross-check only; conditional-share diagnostic, NOT an RH bound; no QED.',
  models:
    'FULL: sigma_full = E_coll/(E_trunc+E_flow+E_coll). CLOSED FORM: sigma_CF = 1/(1 + ' +
    'sqrt(N/N_cross) sqrt(L_cross/L(N))), the E_flow-dropped two-term limit; N_cross ~ 3.280294e9. ' +
    'Only structural difference is the E_flow (Gronwall) term the closed form omits -- vanishing ' +
    'above 1e11 (imp-97428), non-negligible below it (this module).',
  band: '[1e8..1e11]', // the complement of the imp-97428 agreement band [1e11..1e15]
  farTailExponent: HALF, // imp-3463 asymptote both models ramp toward
  perDecade: PER_DECADE,
  pointwise: POINTWISE,
  landmarks: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    L_cross: +L_CROSS.toFixed(6), // ~20.857609
    sigma_CF_at_N_cross: SIGMA_CF_AT_CROSS, // 0.5 EXACTLY by construction
    max_exponent_diff_1e8_1e11: +MAX_EXPONENT_DIFF.toExponential(3), // ~1.66e-3
    max_rel_share_gap_1e8_1e11: +MAX_REL_GAP.toExponential(3), // ~5.73e-3 at 1e8
    rel_share_gap_at_1e11: REL_GAP_1E11, // ~8.27e-5, matches the imp-97428 1e11 boundary value
  },
  finding: {
    F1_models_diverge_below_the_crossover:
      'The mirror image of imp-97428: the relative share gap |sigma_full - sigma_CF|/sigma_full ' +
      'GROWS as N drops through the crossover -- 8.27e-5 (1e11) -> 4.60e-4 (1e10) -> 1.89e-3 (1e9) ' +
      '-> 5.73e-3 (1e8), a factor of ~69x across the band and ~217x the 2.64e-8 imp-97428 measured ' +
      'at its 1e15 far-tail rung. The closed form OVER-estimates the share throughout (residual ' +
      'negative, sigma_CF > sigma_full) because dropping E_flow shrinks the denominator.',
    F2_divergence_is_the_retained_E_flow:
      'The divergence is exactly the dropped term, now non-negligible: E_flow/E_coll rises 5.07e-4 ' +
      '(1e11) -> 1.24e-3 (1e10) -> 2.96e-3 (1e9) -> 6.82e-3 (1e8), tracking the relative share gap ' +
      'to within a small constant factor. The Gronwall flow term is a ~0.7% fraction of the ' +
      'collapse term at 1e8, no longer the vanishing fraction imp-97428 saw in the far tail.',
    F3_crossover_separation_and_exponent_split:
      'By construction sigma_CF(N_cross) = 0.5 EXACTLY, while the full model gives 0.49953 -- a ' +
      'relative gap 9.50e-4 with E_flow/E_coll = 1.90e-3 at N_cross, so the 50/50 crossover the ' +
      'closed form pins at N_cross ~ 3.28e9 sits at a slightly LOWER N in the full model. The ' +
      'per-decade exponents separate most at the bottom: diff -1.66e-3 [1e8,1e9] -> -6.16e-4 -> ' +
      '-1.62e-4 [1e10,1e11], the opposite trend to the imp-97428 -3.00e-5 -> -7.83e-8 far-tail ' +
      'shrinkage. Agreement above 1e11, divergence below, joined continuously (the 1e11 rung gap ' +
      '8.27e-5 reproduces the imp-97428 boundary value to the digit).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (frontier-direction, NOT rigorous). Measuring the complement of the ' +
    'imp-97428 far-tail agreement band: below 1e11, spanning N_cross ~ 3.28e9, the full three-term ' +
    'and imp-96151 two-term closed-form share models DIVERGE. The relative share gap grows 8.27e-5 ' +
    '(1e11) -> 5.73e-3 (1e8) in lockstep with the retained E_flow/E_coll ratio 5.07e-4 -> 6.82e-3, ' +
    'the closed form over-estimating the share throughout (sigma_CF > sigma_full); at the crossover ' +
    'the closed form pins sigma_CF = 1/2 EXACTLY while the full model gives 0.49953 (~0.1% below). ' +
    'The 1e11 rung gap 8.27e-5 reproduces the imp-97428 boundary value to the digit, so the two ' +
    'bands join continuously -- agreement above, divergence below, both governed by the same dropped ' +
    'E_flow term. The component model is the inherited imp-3220/imp-3406/imp-33723 surrogate, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97428 (the [1e11..1e15] agreement band this module complements); imp-96151 (two-term ' +
    'closed-form model); imp-33723 (closed-form crossover N_cross fixed point); imp-97404 ' +
    '(full-model far-tail ladder); imp-3463 (far-tail exponent -> 1/2); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP97438_SIGMA_FULL_VS_CLOSED_FORM_BELOW_CROSSOVER_ASSERTIONS = [
  {
    // (F1): the relative share gap GROWS as N decreases through the crossover (divergence, not agreement).
    id: 'imp97438-relative-share-gap-grows-below-crossover',
    description: 'relGap strictly increases as N decreases 1e11 -> 1e8; the max over the band exceeds 1e-3',
    holds: () => {
      // POINTWISE is ordered 1e8, 1e9, N_cross, 1e10, 1e11 (increasing N); relGap must decrease along it.
      for (let i = 1; i < POINTWISE.length; i++) {
        if (!(POINTWISE[i].relGap < POINTWISE[i - 1].relGap)) return false;
      }
      return MAX_REL_GAP > 1e-3 && POINTWISE[0].relGap > 5e-3;
    },
  },
  {
    // (F2): the retained E_flow/E_coll ratio GROWS as N decreases and is non-negligible (> ~1e-3) below 1e11.
    id: 'imp97438-dropped-eflow-ratio-grows-below-crossover',
    description: 'E_flow/E_coll strictly increases as N decreases 1e11 -> 1e8 and exceeds ~5e-3 at 1e8',
    holds: () => {
      for (let i = 1; i < POINTWISE.length; i++) {
        if (!(POINTWISE[i].eflow_over_ecoll < POINTWISE[i - 1].eflow_over_ecoll)) return false;
      }
      return POINTWISE[0].eflow_over_ecoll > 5e-3 && POINTWISE[0].N === '1e8';
    },
  },
  {
    // (F3): at the crossover the closed form gives sigma_CF = 1/2 EXACTLY, the full model sits below it.
    id: 'imp97438-closed-form-is-half-at-crossover-full-below',
    description: 'sigma_CF(N_cross) == 0.5 to 4 dp while sigma_full(N_cross) < 0.5 (retained E_flow pushes it down)',
    holds: () => {
      const row = POINTWISE.find((r) => r.N === 'N_cross');
      return (
        !!row &&
        Math.abs(row.sigma_closed_form - HALF) < 5e-5 &&
        row.sigma_full < HALF &&
        row.relGap > 5e-4
      );
    },
  },
  {
    // (F3): per-decade exponent divergence GROWS toward the bottom (opposite of the imp-97428 far-tail shrinkage).
    id: 'imp97438-per-decade-exponent-divergence-grows-toward-bottom',
    description: 'the full-vs-CF exponent difference magnitude increases as the decade drops 1e10->1e8; max > 1e-4',
    holds: () => {
      // PER_DECADE ordered [1e8,1e9], [1e9,1e10], [1e10,1e11] (increasing N); |diff| must decrease along it.
      for (let i = 1; i < PER_DECADE.length; i++) {
        if (!(Math.abs(PER_DECADE[i].exponentDiff) < Math.abs(PER_DECADE[i - 1].exponentDiff))) {
          return false;
        }
      }
      return MAX_EXPONENT_DIFF > 1e-4;
    },
  },
  {
    // Continuity cross-check: the 1e11 rung reproduces the imp-97428 boundary rel-gap value to the digit.
    id: 'imp97438-1e11-rung-joins-imp97428-band',
    description: 'relGap at 1e11 matches the imp-97428 boundary value 8.27e-5 to 2 sig figs (bands join continuously)',
    holds: () => Math.abs(REL_GAP_1E11 - 8.27e-5) < 5e-7,
  },
  {
    // Honesty gate: measurement/cross-check only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp97438-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP97438_SIGMA_FULL_VS_CLOSED_FORM_BELOW_CROSSOVER.isRigorous === false &&
      IMP97438_SIGMA_FULL_VS_CLOSED_FORM_BELOW_CROSSOVER.farTailExponent === 0.5 &&
      /NO QED/.test(IMP97438_SIGMA_FULL_VS_CLOSED_FORM_BELOW_CROSSOVER.verdict) &&
      /refereed bound is changed/i.test(IMP97438_SIGMA_FULL_VS_CLOSED_FORM_BELOW_CROSSOVER.verdict),
  },
];

for (const a of IMP97438_SIGMA_FULL_VS_CLOSED_FORM_BELOW_CROSSOVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97438-sigma-full-vs-closed-form-below-crossover assertion failed: ${a.id}`,
    );
  }
}
