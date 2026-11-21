/**
 * @module imp-97404-sigma-fartail-exponent-ladder-past-1e12
 *
 * imp-97404 (numerical, frontier-direction): imp-33582 measured the sigma(N) = E_coll/E(N)
 * conditional-share LOCAL decay exponent RAMPING decade by decade past the interior peak --
 * ~0.0105 [1e6,1e7] -> ~0.4310 [1e11,1e12] -- toward the imp-3463 far-tail 1/2, but its
 * per-decade ladder TRUNCATED at the 1e12 endpoint (imp-96151 flagged this exact 1e12 grid
 * cutoff). This module EXTENDS that per-decade exponent ladder past 1e12 -- windows
 * [1e11,1e12] .. [1e14,1e15] -- on the SAME full three-term share model, to confirm the
 * exponent keeps climbing MONOTONELY toward 1/2 and to sharpen the sigmoid-approach picture.
 *
 * THE QUANTITY (identical inherited sub-terms to imp-3406 / imp-33582 / imp-33274)
 * -------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * No re-derivation, no fresh model: the exact inherited imp-3406/imp-33582 sub-terms. Only the
 * measurement grid moves outward.
 *
 * THE MEASUREMENT: per-decade local exponent ladder extended to [1e14,1e15]
 * ------------------------------------------------------------------------
 *   p_dec = -slope of OLS(ln sigma vs ln N) over each decade window [10^k, 10^(k+1)] for
 *   k = 11..14 (4 points/decade, identical estimator to imp-33582), plus the pointwise local
 *   exponent p(N) = -d ln sigma / d ln N at N = 1e12 .. 1e15 (and reference tail probes at
 *   1e18/1e20) to show the residual 1/2 - p continuing to close.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE PER-DECADE EXPONENT KEEPS CLIMBING MONOTONELY PAST 1e12. Extending the imp-33582
 *        ladder outward: ~0.4310 [1e11,1e12] -> ~0.4646 [1e12,1e13] -> ~0.4777 [1e13,1e14] ->
 *        ~0.4828 [1e14,1e15], strictly increasing and strictly below the imp-3463 far-tail 1/2.
 *        The [1e12,1e13] rung 0.4646 matches the imp-96151 two-term closed-form value 0.4646 at
 *        1e12 to 4 dp -- an independent consistency check that the full and closed-form models
 *        agree on the far tail.
 *   (F2) THE DECADE FIT CLEANS UP AS THE POWER LAW EMERGES. The OLS R^2 over the decade windows
 *        climbs toward 1: ~0.999701 [1e11,1e12] -> ~0.999959 -> ~0.999994 -> ~0.999999
 *        [1e14,1e15]. So sigma is settling onto a clean sqrt(1/N) power law -- the ramp is not
 *        an artifact of a curved window.
 *   (F3) THE POINTWISE EXPONENT APPROACHES 1/2 AND THE RESIDUAL SHRINKS. p(N) climbs
 *        ~0.4526 (1e12) -> ~0.4731 -> ~0.4810 -> ~0.4842 (1e15), and continues to ~0.4877
 *        (1e18) / ~0.4889 (1e20): the residual 1/2 - p(N) closes monotonically decade by decade
 *        (never reaching 1/2 at any finite N, as the constant E_trunc floor keeps a sub-leading
 *        log correction alive). The approach to the asymptote is confirmed monotone, not a
 *        plateau below 1/2.
 *
 * The punchline: imp-33582 left the per-decade ladder at 0.4310 [1e11,1e12]; extending three
 * more decades to [1e14,1e15] confirms it climbs monotonely to ~0.4828 with the decade R^2
 * driven to ~1, and the pointwise exponent reaches ~0.4842 by 1e15 and ~0.4889 by 1e20 --
 * a monotone approach to the imp-3463 1/2 from below, matching the imp-96151 closed-form ladder
 * at the shared 1e12 rung. The far-tail 1/2 asymptote is a genuine limit, not a finite ceiling.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (near-peak ladder, truncated at 1e12)
 * @see imp-33274-sigma-postpeak-later-window-decay-exponent (FAR-tail sliding window, p_eff -> 1/2)
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (two-term CF ladder, 0.4646 at 1e12)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582 exactly

// EXACT imp-3406/imp-33582 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// OLS local decay exponent p = -slope of ln sigma on ln N over [loN, hiN] (4 pts/decade).
// Identical estimator to imp-33582.olsExponent -- only the grid endpoint moves.
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
  const slope = sxy / sxx;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = my - slope * mx + slope * xs[i];
    ssRes += (ys[i] - pred) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  return { p: -slope, R2: 1 - ssRes / ssTot, nPoints: n };
}

const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote

// (F1)/(F2) Extended per-decade ladder past 1e12: k = 11..14, [10^k, 10^(k+1)].
const EXTENDED_LADDER = [11, 12, 13, 14].map((k) => {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const f = olsExponent(lo, hi);
  return {
    decade: `1e${k}->1e${k + 1}`,
    p_local: +f.p.toFixed(4),
    R2: +f.R2.toFixed(6),
    sigmaLo: +sigma(lo).toExponential(4),
    sigmaHi: +sigma(hi).toExponential(4),
  };
});

// (F3) Pointwise local exponent p(N) = -d ln sigma / d ln N via a centered log-difference.
function pointwiseExponent(N) {
  const h = 1e-4;
  return -(Math.log(sigma(N * Math.exp(h))) - Math.log(sigma(N * Math.exp(-h)))) / (2 * h);
}
const POINTWISE = [12, 13, 14, 15, 18, 20].map((k) => {
  const N = Math.pow(10, k);
  const p = pointwiseExponent(N);
  return {
    N: `1e${k}`,
    p: +p.toFixed(5),
    residualToHalf: +(HALF - p).toExponential(3),
    sigma: +sigma(N).toExponential(4),
  };
});

export const IMP97404_SIGMA_FARTAIL_EXPONENT_LADDER_PAST_1E12 = {
  id: 'imp-97404',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33582 sigma(N) = E_coll/E(N) per-decade local decay-exponent ladder past ' +
    'its 1e12 endpoint (windows [1e11,1e12] .. [1e14,1e15]) on the SAME full three-term share ' +
    'model to confirm the exponent keeps climbing monotonely toward the imp-3463 far-tail 1/2 ' +
    'and to sharpen the sigmoid-approach picture. Measurement/fit only; conditional-share ' +
    'diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'p_local = -slope of OLS(ln sigma on ln N) over each decade [10^k,10^(k+1)] for k=11..14 ' +
    '(4 points/decade, identical estimator to imp-33582), plus the pointwise local exponent ' +
    'p(N) = -d ln sigma / d ln N at N = 1e12..1e15 (with 1e18/1e20 tail probes)',
  farTailExponent: HALF, // imp-3463 asymptote the ladder ramps toward
  imp33582LastRung: { decade: '1e11->1e12', p_local: 0.431 }, // where imp-33582 stopped
  imp96151CrossCheck: 0.4646, // imp-96151 two-term closed-form per-decade exponent at 1e12
  extendedLadder: EXTENDED_LADDER,
  pointwise: POINTWISE,
  finding: {
    F1_per_decade_keeps_climbing:
      'Extending the imp-33582 ladder past 1e12: ~0.4310 [1e11,1e12] -> ~0.4646 [1e12,1e13] -> ' +
      '~0.4777 [1e13,1e14] -> ~0.4828 [1e14,1e15], strictly increasing and strictly below the ' +
      'imp-3463 far-tail 1/2. The 1e12 rung 0.4646 matches the imp-96151 two-term closed-form ' +
      'value 0.4646 to 4 dp -- full and closed-form models agree on the far tail.',
    F2_decade_fit_cleans_up:
      'The OLS R^2 over the decade windows climbs toward 1: ~0.999701 [1e11,1e12] -> ~0.999959 ' +
      '-> ~0.999994 -> ~0.999999 [1e14,1e15], so sigma settles onto a clean sqrt(1/N) power law ' +
      'and the ramp is not a curved-window artifact.',
    F3_pointwise_approaches_half:
      'The pointwise exponent p(N) climbs ~0.4526 (1e12) -> ~0.4731 -> ~0.4810 -> ~0.4842 (1e15) ' +
      'and continues to ~0.4877 (1e18) / ~0.4889 (1e20): the residual 1/2 - p(N) closes ' +
      'monotonically decade by decade, never reaching 1/2 at any finite N (the constant E_trunc ' +
      'floor keeps a sub-leading log correction alive). The approach is a genuine monotone ' +
      'limit, not a plateau below 1/2.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33582 per-decade ' +
    'exponent ladder three decades past its 1e12 endpoint on the identical full three-term ' +
    'sigma(N) model: the per-decade local exponent keeps climbing monotonely -- ~0.4310 ' +
    '[1e11,1e12] -> ~0.4828 [1e14,1e15] -- with the decade OLS R^2 driven to ~0.999999, and the ' +
    'pointwise exponent reaches ~0.4842 by 1e15 and ~0.4889 by 1e20, the residual 1/2 - p ' +
    'closing monotonically at every finite N. The 1e12 rung 0.4646 matches the imp-96151 ' +
    'two-term closed-form ladder to 4 dp. So the approach to the imp-3463 far-tail 1/2 is a ' +
    'genuine monotone limit, not a finite ceiling. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33582 (near-peak ladder truncated at 1e12); imp-33274 (FAR-tail sliding-window ' +
    'p_eff -> 1/2); imp-96151 (two-term closed-form far-tail ladder, 0.4646 at 1e12); imp-3463 ' +
    '(far-tail leading form, exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97404_SIGMA_FARTAIL_EXPONENT_LADDER_PAST_1E12_ASSERTIONS = [
  {
    // (F1): the extended per-decade exponent climbs strictly monotonely past 1e12, starts at the
    // imp-33582 continuation (~0.4646 at [1e12,1e13]) and stays strictly below the imp-3463 1/2.
    id: 'imp97404-extended-ladder-climbs-monotonely-below-half',
    description: 'per-decade p_local strictly increases over [1e11,1e12]..[1e14,1e15], all in (0.43, 0.5)',
    holds: () => {
      for (let i = 1; i < EXTENDED_LADDER.length; i++) {
        if (!(EXTENDED_LADDER[i].p_local > EXTENDED_LADDER[i - 1].p_local)) return false;
      }
      return EXTENDED_LADDER.every((r) => r.p_local > 0.43 && r.p_local < HALF);
    },
  },
  {
    // (F1) cross-check: the [1e12,1e13] rung matches the imp-96151 two-term closed-form 0.4646.
    id: 'imp97404-matches-imp96151-closed-form-at-1e12',
    description: 'the [1e12,1e13] per-decade exponent equals the imp-96151 closed-form 0.4646 to 4 dp',
    holds: () => {
      const rung = EXTENDED_LADDER.find((r) => r.decade === '1e12->1e13');
      return !!rung && Math.abs(rung.p_local - 0.4646) < 5e-4;
    },
  },
  {
    // (F2): the decade OLS R^2 climbs toward 1 as the clean power law emerges (last rung ~1).
    id: 'imp97404-decade-fit-cleans-up-toward-one',
    description: 'per-decade R^2 strictly increases and the [1e14,1e15] fit exceeds 0.99999',
    holds: () => {
      for (let i = 1; i < EXTENDED_LADDER.length; i++) {
        if (!(EXTENDED_LADDER[i].R2 > EXTENDED_LADDER[i - 1].R2)) return false;
      }
      return EXTENDED_LADDER[EXTENDED_LADDER.length - 1].R2 > 0.99999;
    },
  },
  {
    // (F3): the pointwise exponent climbs monotonely toward 1/2 and the residual shrinks, but
    // never reaches 1/2 at any finite N (residual strictly positive everywhere).
    id: 'imp97404-pointwise-approaches-half-monotonely',
    description: 'p(N) strictly increases 1e12..1e20, all residuals to 1/2 strictly positive and shrinking',
    holds: () => {
      for (let i = 1; i < POINTWISE.length; i++) {
        if (!(POINTWISE[i].p > POINTWISE[i - 1].p)) return false;
        if (!(POINTWISE[i].residualToHalf < POINTWISE[i - 1].residualToHalf)) return false;
      }
      return POINTWISE.every((r) => r.residualToHalf > 0 && r.p < HALF);
    },
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp97404-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP97404_SIGMA_FARTAIL_EXPONENT_LADDER_PAST_1E12.isRigorous === false &&
      IMP97404_SIGMA_FARTAIL_EXPONENT_LADDER_PAST_1E12.farTailExponent === 0.5 &&
      /NO QED/.test(IMP97404_SIGMA_FARTAIL_EXPONENT_LADDER_PAST_1E12.verdict) &&
      /refereed bound is changed/i.test(IMP97404_SIGMA_FARTAIL_EXPONENT_LADDER_PAST_1E12.verdict),
  },
];

for (const a of IMP97404_SIGMA_FARTAIL_EXPONENT_LADDER_PAST_1E12_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97404-sigma-fartail-exponent-ladder-past-1e12 assertion failed: ${a.id}`);
  }
}
