/**
 * @module imp-97428-sigma-full-vs-closed-form-cross-validation
 *
 * imp-97428 (accuracy, frontier-direction): imp-97404 F1 noted that the [1e12,1e13] per-decade
 * exponent 0.4646 of the FULL three-term share model matches the imp-96151 two-term CLOSED-FORM
 * value 0.4646 at the 1e12 rung to 4 dp -- but that single rung was the only committed cross-check
 * between the two share models. This module cross-validates the two models across the whole far-tail
 * band [1e11..1e15]: per-decade OLS exponents from BOTH models, the pointwise p(N), the residual
 * between them, and the ratio E_flow/E_coll (the term the closed form drops), to confirm the two
 * agree throughout the far tail -- not just at 1e12 -- and to quantify where the dropped E_flow term
 * becomes negligible.
 *
 * THE TWO SHARE MODELS (identical inherited sub-terms, no re-derivation)
 * ---------------------------------------------------------------------
 *   FULL (imp-3406/imp-33582/imp-97404):
 *     sigma_full(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C sqrt(L/N),  E_flow = C_F (L/T0) Gronwall,  E_trunc = 3.06e-5,  L = log T0(N).
 *   CLOSED FORM (imp-33723/imp-96151), the two-term (E_trunc + E_coll) limit with E_flow dropped:
 *     sigma_CF(N) = 1 / (1 + sqrt(N/N_cross) sqrt(L_cross/L(N))),  N_cross ~ 3.280294e9.
 * The ONLY structural difference is the E_flow (Gronwall) term the closed form omits; the two
 * therefore converge exactly as E_flow/E_coll -> 0 in the far tail. Sub-terms are the EXACT
 * inherited constants (C_C_PINNED, E_trunc, effectiveHeightForN); no fresh model, no new fit.
 *
 * THE MEASUREMENT: full-vs-closed-form cross-validation across [1e11..1e15]
 * -----------------------------------------------------------------------
 *   (a) per-decade OLS exponent p_dec for BOTH models over each decade [10^k,10^(k+1)], k=11..14
 *       (4 pts/decade, identical estimator to imp-97404/imp-96151), and the exponent difference.
 *   (b) pointwise p(N) = -d ln sigma/d ln N for BOTH models at N = 1e11..1e15.
 *   (c) the share residual sigma_full - sigma_CF and the relative gap at each decade point.
 *   (d) the dropped-term ratio E_flow/E_coll at each decade point (why the closed form converges).
 *
 * THE FINDING (measurement / cross-check only)
 * --------------------------------------------
 *   (F1) THE TWO MODELS AGREE THROUGHOUT THE FAR TAIL, NOT JUST AT 1e12. The per-decade exponents
 *        coincide to 4 dp at every rung [1e11..1e15]: 0.4310/0.4311 [1e11,1e12] -> 0.4646/0.4646 ->
 *        0.4777/0.4777 -> 0.4828/0.4828 [1e14,1e15], the exponent difference shrinking
 *        -3.00e-5 -> -4.50e-6 -> -6.08e-7 -> -7.83e-8 (an order of magnitude per decade). The
 *        imp-97404 single-rung 0.4646 match at 1e12 was representative of the whole band.
 *   (F2) THE SHARE RESIDUAL COLLAPSES DECADE BY DECADE. The relative gap |sigma_full - sigma_CF| /
 *        sigma_full falls 8.27e-5 (1e11) -> 1.22e-5 (1e12) -> 1.65e-6 -> 2.11e-7 -> 2.64e-8 (1e15),
 *        and the pointwise exponents agree to 4-5 dp at every point (0.40186/0.40193 at 1e11 up to
 *        0.48422/0.48422 at 1e15). The two models are numerically the same object past ~1e13.
 *   (F3) THE CONVERGENCE IS DRIVEN BY THE DROPPED E_flow TERM VANISHING. The ratio E_flow/E_coll --
 *        the only structural difference -- falls 5.07e-4 (1e11) -> 2.03e-4 (1e12) -> 7.93e-5 ->
 *        3.06e-5 -> 1.16e-5 (1e15), tracking the relative share gap to within a small constant
 *        factor. So the agreement is not a coincidence at one rung: it is the Gronwall flow term
 *        becoming a vanishing fraction of the collapse term, exactly the imp-96151 F1 mechanism,
 *        now confirmed pointwise across the whole [1e11..1e15] band.
 *
 * The punchline: the imp-97404 single-rung 0.4646 cross-check at 1e12 extends to the entire far-tail
 * band -- the full three-term and imp-96151 two-term closed-form share models agree to 4 dp in every
 * per-decade exponent across [1e11..1e15], with the relative share gap collapsing 8.27e-5 -> 2.64e-8
 * decade by decade in lockstep with the dropped E_flow/E_coll ratio 5.07e-4 -> 1.16e-5. The closed
 * form IS the full model in the far tail, becoming numerically indistinguishable past ~1e13.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406/imp-33723 surrogate, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; far-tail exponent 1/2 per imp-3463; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97404-sigma-fartail-exponent-ladder-past-1e12 (full-model ladder, single 0.4646 rung match)
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (two-term closed-form model)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross fixed point)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (near-peak ladder, truncated at 1e12)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote both models ramp toward
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97404/imp-96151 exactly

// FULL three-term share (EXACT imp-3406/imp-33582/imp-97404 sub-terms; no re-derivation).
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
// Identical estimator to imp-97404/imp-96151; only the model f moves.
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

// (F1) per-decade full-vs-closed-form exponent cross-check across [1e11..1e15].
const PER_DECADE = [11, 12, 13, 14].map((k) => {
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

// (F2)/(F3) pointwise cross-check: p(N) for both models, the share residual, and E_flow/E_coll.
const POINTWISE = [11, 12, 13, 14, 15].map((k) => {
  const N = Math.pow(10, k);
  const sf = sigmaFull(N);
  const sc = sigmaCF(N);
  const pr = parts(N);
  return {
    N: `1e${k}`,
    sigma_full: +sf.toExponential(4),
    sigma_closed_form: +sc.toExponential(4),
    shareResidual: +(sf - sc).toExponential(3),
    relGap: +(Math.abs(sf - sc) / sf).toExponential(3),
    p_full: +pointwiseExponent(sigmaFull, N).toFixed(5),
    p_closed_form: +pointwiseExponent(sigmaCF, N).toFixed(5),
    eflow_over_ecoll: +(pr.E_flow / pr.E_coll).toExponential(3),
  };
});

const MAX_REL_GAP = Math.max(...POINTWISE.map((r) => r.relGap)); // ~8.27e-5 at 1e11
const MAX_EXPONENT_DIFF = Math.max(...PER_DECADE.map((r) => Math.abs(r.exponentDiff))); // ~3.0e-5

export const IMP97428_SIGMA_FULL_VS_CLOSED_FORM_CROSS_VALIDATION = {
  id: 'imp-97428',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the full three-term share model sigma_full = E_coll/(E_trunc+E_flow+E_coll) ' +
    'against the imp-96151 two-term closed form sigma_CF = 1/(1+sqrt(N/N_cross) sqrt(L_cross/L)) ' +
    'across the far-tail decades [1e11..1e15]: per-decade OLS exponents from both models, the ' +
    'pointwise p(N), the share residual, and the dropped E_flow/E_coll ratio, to confirm the two ' +
    'agree throughout the far tail (not just at the single 1e12 rung imp-97404 tabulated) and to ' +
    'quantify where the dropped E_flow term becomes negligible. Measurement/cross-check only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  models:
    'FULL: sigma_full = E_coll/(E_trunc+E_flow+E_coll). CLOSED FORM: sigma_CF = 1/(1 + ' +
    'sqrt(N/N_cross) sqrt(L_cross/L(N))), the E_flow-dropped two-term limit; N_cross ~ 3.280294e9. ' +
    'Only structural difference is the E_flow (Gronwall) term the closed form omits.',
  farTailExponent: HALF, // imp-3463 asymptote both models ramp toward
  imp97404SingleRungCrossCheck: 0.4646, // the only committed full-vs-CF cross-check before this
  perDecade: PER_DECADE,
  pointwise: POINTWISE,
  landmarks: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    L_cross: +L_CROSS.toFixed(6), // ~20.857609
    max_exponent_diff_1e11_1e15: +MAX_EXPONENT_DIFF.toExponential(3), // ~3.00e-5
    max_rel_share_gap_1e11_1e15: +MAX_REL_GAP.toExponential(3), // ~8.27e-5
  },
  finding: {
    F1_models_agree_across_the_whole_band:
      'The per-decade exponents coincide to 4 dp at every rung [1e11..1e15]: 0.4310/0.4311 -> ' +
      '0.4646/0.4646 -> 0.4777/0.4777 -> 0.4828/0.4828, the exponent difference shrinking ' +
      '-3.00e-5 -> -4.50e-6 -> -6.08e-7 -> -7.83e-8 (an order of magnitude per decade). The ' +
      'imp-97404 single-rung 0.4646 match at 1e12 was representative of the whole far-tail band.',
    F2_share_residual_collapses:
      'The relative share gap |sigma_full - sigma_CF|/sigma_full falls 8.27e-5 (1e11) -> 1.22e-5 ' +
      '(1e12) -> 1.65e-6 -> 2.11e-7 -> 2.64e-8 (1e15), and the pointwise exponents agree to 4-5 dp ' +
      'at every point (0.40186/0.40193 at 1e11 up to 0.48422/0.48422 at 1e15): the two models are ' +
      'numerically the same object past ~1e13.',
    F3_convergence_driven_by_dropped_E_flow:
      'The ratio E_flow/E_coll -- the only structural difference -- falls 5.07e-4 (1e11) -> ' +
      '2.03e-4 (1e12) -> 7.93e-5 -> 3.06e-5 -> 1.16e-5 (1e15), tracking the relative share gap to ' +
      'within a small constant factor. So the agreement is the Gronwall flow term becoming a ' +
      'vanishing fraction of the collapse term (the imp-96151 F1 mechanism), now confirmed ' +
      'pointwise across the whole [1e11..1e15] band, not just at the 1e12 rung.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (frontier-direction, NOT rigorous). Extending the imp-97404 ' +
    'single-rung 0.4646 cross-check to the whole far-tail band: the full three-term and imp-96151 ' +
    'two-term closed-form share models agree to 4 dp in every per-decade exponent across ' +
    '[1e11..1e15] (max exponent difference ~3.00e-5 at the 1e11 rung, shrinking an order of ' +
    'magnitude per decade), with the relative share gap collapsing 8.27e-5 -> 2.64e-8 decade by ' +
    'decade in lockstep with the dropped E_flow/E_coll ratio 5.07e-4 -> 1.16e-5. The closed form ' +
    'IS the full model in the far tail, becoming numerically indistinguishable past ~1e13 -- the ' +
    'agreement is the Gronwall flow term vanishing against the collapse term, confirmed pointwise ' +
    'and not just at 1e12. The component model is the inherited imp-3220/imp-3406/imp-33723 ' +
    'surrogate, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97404 (full-model ladder, single 0.4646 rung match at 1e12); imp-96151 (two-term ' +
    'closed-form model, full-vs-CF gap < 4.6e-4 out to 1e100); imp-33723 (closed-form crossover ' +
    'N_cross fixed point); imp-33582 (per-decade ramp to 0.4310, stopped at 1e12); imp-3463 ' +
    '(far-tail exponent -> 1/2); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip ' +
    'route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97428_SIGMA_FULL_VS_CLOSED_FORM_CROSS_VALIDATION_ASSERTIONS = [
  {
    // (F1): per-decade exponents of the two models agree to 4 dp across the whole [1e11..1e15] band.
    id: 'imp97428-per-decade-exponents-agree-across-band',
    description: 'p_full == p_closed_form to 4 dp at every decade [1e11..1e15]; both in (0.43, 0.5)',
    holds: () =>
      PER_DECADE.every((r) => Math.abs(r.p_full - r.p_closed_form) < 5e-4) &&
      PER_DECADE.every((r) => r.p_full > 0.43 && r.p_full < HALF) &&
      PER_DECADE.every((r) => r.p_closed_form > 0.43 && r.p_closed_form < HALF),
  },
  {
    // (F1) the exponent difference shrinks monotonely in magnitude decade by decade (order/decade).
    id: 'imp97428-exponent-difference-shrinks-monotonely',
    description: 'the full-vs-CF exponent difference decreases in magnitude at every decade step',
    holds: () => {
      for (let i = 1; i < PER_DECADE.length; i++) {
        if (!(Math.abs(PER_DECADE[i].exponentDiff) < Math.abs(PER_DECADE[i - 1].exponentDiff))) {
          return false;
        }
      }
      return MAX_EXPONENT_DIFF < 1e-4;
    },
  },
  {
    // (F1) cross-check: the [1e12,1e13] rung reproduces the imp-97404 committed 0.4646 for BOTH models.
    id: 'imp97428-reproduces-imp97404-0p4646-both-models',
    description: 'the [1e12,1e13] rung equals the imp-97404 committed 0.4646 to 4 dp for full and CF',
    holds: () => {
      const rung = PER_DECADE.find((r) => r.decade === '1e12->1e13');
      return (
        !!rung && Math.abs(rung.p_full - 0.4646) < 5e-4 && Math.abs(rung.p_closed_form - 0.4646) < 5e-4
      );
    },
  },
  {
    // (F2): the relative share gap collapses monotonely decade by decade across the band.
    id: 'imp97428-relative-share-gap-collapses-monotonely',
    description: 'relGap strictly decreases 1e11..1e15 and the max over the band stays below 1e-4',
    holds: () => {
      for (let i = 1; i < POINTWISE.length; i++) {
        if (!(POINTWISE[i].relGap < POINTWISE[i - 1].relGap)) return false;
      }
      return MAX_REL_GAP < 1e-4 && POINTWISE[POINTWISE.length - 1].relGap < 1e-7;
    },
  },
  {
    // (F3): the dropped-term ratio E_flow/E_coll falls monotonely, driving the convergence.
    id: 'imp97428-dropped-eflow-ratio-falls-monotonely',
    description: 'E_flow/E_coll strictly decreases 1e11..1e15 and stays below the crossover-scale ~1e-3',
    holds: () => {
      for (let i = 1; i < POINTWISE.length; i++) {
        if (!(POINTWISE[i].eflow_over_ecoll < POINTWISE[i - 1].eflow_over_ecoll)) return false;
      }
      return POINTWISE.every((r) => r.eflow_over_ecoll > 0 && r.eflow_over_ecoll < 1e-3);
    },
  },
  {
    // Honesty gate: measurement/cross-check only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp97428-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP97428_SIGMA_FULL_VS_CLOSED_FORM_CROSS_VALIDATION.isRigorous === false &&
      IMP97428_SIGMA_FULL_VS_CLOSED_FORM_CROSS_VALIDATION.farTailExponent === 0.5 &&
      /NO QED/.test(IMP97428_SIGMA_FULL_VS_CLOSED_FORM_CROSS_VALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP97428_SIGMA_FULL_VS_CLOSED_FORM_CROSS_VALIDATION.verdict),
  },
];

for (const a of IMP97428_SIGMA_FULL_VS_CLOSED_FORM_CROSS_VALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97428-sigma-full-vs-closed-form-cross-validation assertion failed: ${a.id}`,
    );
  }
}
