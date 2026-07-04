/**
 * @module imp-33701-sigma-postpeak-ramp-curvature-inflection
 *
 * imp-33701 (numerical, frontier-direction): imp-33582 measured the imp-3406 sigma(N) =
 * E_coll/E(N) post-peak decay on the finer grid N in {1e6..1e12} and reported that the
 * per-decade LOCAL decay exponent RAMPS monotonely across six decades from ~0.0105
 * (first post-peak decade) toward the imp-3463 far-tail 1/2 asymptote, ending at ~0.4310
 * by [1e11,1e12]. It stated the exponent "climbs monotonely" and that the decay
 * "accelerates smoothly" -- but it never measured the CURVATURE of that ramp: whether the
 * exponent gains happen at a fixed pace (a straight ramp), speed up without bound (a convex
 * approach), or rise-then-saturate through an INFLECTION (an S-shape). This module fills that
 * gap: it takes the identical imp-33582 six-decade exponent ladder, forms the discrete first
 * difference (ramp velocity, decade to decade) and second difference (ramp acceleration), and
 * locates any sign change of the second difference plus the steepest decade of the ramp.
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 -- no re-derivation, no fresh terms)
 * ------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     p_dec(k) = -slope OLS(ln sigma vs ln N) over [10^k, 10^(k+1)], k = 6..11, 4 pts/decade.
 * These are the EXACT imp-33582 sub-terms; the ladder p_dec(6..11) reproduces its published
 * perDecadeLadder to the printed 4 decimals (reuse gate below).
 *
 * THE MEASUREMENT: discrete curvature of the exponent ramp
 * -------------------------------------------------------
 *   (a) RAMP VELOCITY  D1(k) = p_dec(k+1) - p_dec(k)  (k = 6..10): how many exponent units
 *       the local decay gains per decade step.
 *   (b) RAMP ACCELERATION  D2(k) = D1(k) - D1(k-1)  (k = 7..10): the discrete second
 *       difference of the exponent ladder -- its sign is the concavity of the ramp.
 *   (c) INFLECTION: the decade at which D2 changes sign (convex -> concave). STEEPEST decade:
 *       argmax_k D1(k), the single decade step where the exponent climbs fastest.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE LADDER IS MONOTONE BUT THE RAMP IS S-SHAPED, NOT STRAIGHT. The exponent ladder
 *        p_dec = 0.0105, 0.0447, 0.1176, 0.2360, 0.3561, 0.4310 climbs monotonely (imp-33582),
 *        but the velocity D1 = 0.0343, 0.0729, 0.1184, 0.1201, 0.0749 RISES then FALLS: the
 *        ramp accelerates through the first four decades and decelerates in the last. So the
 *        approach to 1/2 is a SIGMOID (S-shape), not a fixed-rate or ever-steepening ramp.
 *   (F2) EXACTLY ONE INFLECTION, IN THE [1e10,1e11] DECADE. The acceleration D2 = +0.0386,
 *        +0.0455, +0.0017, -0.0452 is positive for three steps then turns negative once: a
 *        single sign change (convex -> concave) landing in the [1e10,1e11] decade. There is a
 *        KNEE, not a smooth monotone acceleration -- the D2 near-zero at the [1e9,1e10] step
 *        (~+0.0017) marks the near-flat top of the velocity curve.
 *   (F3) STEEPEST AT THE [1e9,1e10] -> [1e10,1e11] STEP. The ramp gains the most per decade
 *        (D1 ~ 0.1201, exponent 0.2360 -> 0.3561) at the transition INTO the [1e10,1e11]
 *        decade, narrowly above the preceding step (~0.1184, only ~0.0017 less -- the near-zero
 *        second difference), so the steepness is a two-decade [1e9,1e11] plateau peaking at
 *        [1e10,1e11], not a sharp spike. Past this the gain drops to ~0.0749 as sigma saturates.
 *
 * The punchline: the imp-33582 prose "climbs monotonely / accelerates smoothly" is now
 * resolved into curvature -- the per-decade exponent ramp is MONOTONE in value but SIGMOID in
 * shape, with exactly one inflection (a knee) in the [1e10,1e11] decade and its steepest single
 * decade-to-decade gain (~0.12) at the [1e9,1e10] -> [1e10,1e11] step. The ramp does not
 * accelerate without bound: it speeds up, passes a knee, and decelerates as sigma saturates
 * toward the imp-3463 far-tail 1/2.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the six-decade ladder whose curvature this measures)
 * @see imp-33274-sigma-postpeak-later-window-decay-exponent (FAR-tail sliding window, p_eff -> 1/2)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582 exactly

// EXACT imp-3406/imp-33582 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// OLS local decay exponent p = -slope of ln sigma on ln N over [loN, hiN] (4 pts/decade).
// Identical to imp-33582 so the ladder reproduces its published perDecadeLadder.
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

// (a) The imp-33582 six-decade exponent ladder at full precision, k = 6..11.
const DECADE_KS = [6, 7, 8, 9, 10, 11];
const P_LADDER = DECADE_KS.map((k) => olsExponent(Math.pow(10, k), Math.pow(10, k + 1)));

// (b) RAMP VELOCITY: discrete first difference D1(k) = p(k+1) - p(k), k = 6..10.
const D1 = [];
for (let i = 1; i < P_LADDER.length; i++) {
  D1.push({ stepFromK: DECADE_KS[i - 1], d1: P_LADDER[i] - P_LADDER[i - 1] });
}

// (b) RAMP ACCELERATION: discrete second difference D2(k) = D1(k) - D1(k-1), k = 7..10.
const D2 = [];
for (let i = 1; i < D1.length; i++) {
  D2.push({ centeredAtK: DECADE_KS[i], d2: D1[i].d1 - D1[i - 1].d1 });
}

// (c) INFLECTION: single sign change of D2 (convex -> concave). STEEPEST: argmax D1.
function firstSignChangeK(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (Math.sign(arr[i].d2) !== Math.sign(arr[i - 1].d2)) return arr[i].centeredAtK;
  }
  return null;
}
const INFLECTION_K = firstSignChangeK(D2); // 10 -> inflection lands in the [1e10,1e11] decade
let STEEPEST_IDX = 0;
for (let i = 1; i < D1.length; i++) {
  if (D1[i].d1 > D1[STEEPEST_IDX].d1) STEEPEST_IDX = i;
}
const STEEPEST_STEP_K = D1[STEEPEST_IDX].stepFromK; // 9 -> [1e9,1e10] -> [1e10,1e11] is steepest
const NUM_SIGN_CHANGES = D2.reduce(
  (acc, cur, i) => (i > 0 && Math.sign(cur.d2) !== Math.sign(D2[i - 1].d2) ? acc + 1 : acc),
  0,
);

export const IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION = {
  id: 'imp-33701',
  proofSection: 'S-frontier',
  question:
    'The imp-33582 per-decade local decay exponent ramps monotonely from ~0.0105 [1e6,1e7] ' +
    'toward the imp-3463 far-tail 1/2 (~0.4310 by [1e11,1e12]). Measure the CURVATURE of that ' +
    'ramp -- the discrete first difference (ramp velocity) and second difference (ramp ' +
    'acceleration) of the exponent ladder -- and assess whether the ramp is straight, convex, ' +
    'or S-shaped with an inflection, plus at which decade it is steepest. Measurement/fit only; ' +
    'conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'D1(k) = p_dec(k+1) - p_dec(k) (ramp velocity, k=6..10) and D2(k) = D1(k) - D1(k-1) ' +
    '(ramp acceleration, k=7..10) of the imp-33582 six-decade local-exponent ladder; the ' +
    'decade of the single D2 sign change (inflection) and argmax D1 (steepest decade)',
  ladder: {
    decadeKs: DECADE_KS,
    p_local: P_LADDER.map((p) => +p.toFixed(6)),
  },
  rampVelocity: D1.map((r) => ({ step: `1e${r.stepFromK}->1e${r.stepFromK + 1} to next`, d1: +r.d1.toFixed(6) })),
  rampAcceleration: D2.map((r) => ({ decade: `1e${r.centeredAtK}->1e${r.centeredAtK + 1}`, d2: +r.d2.toFixed(6) })),
  numSignChanges: NUM_SIGN_CHANGES,
  inflectionDecade: `1e${INFLECTION_K}->1e${INFLECTION_K + 1}`,
  steepestStepDecade: `1e${STEEPEST_STEP_K}->1e${STEEPEST_STEP_K + 1} into 1e${STEEPEST_STEP_K + 1}->1e${STEEPEST_STEP_K + 2}`,
  steepestD1: +D1[STEEPEST_IDX].d1.toFixed(6),
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_ladder_monotone_ramp_sigmoid:
      'The exponent ladder p_dec = 0.0105, 0.0447, 0.1176, 0.2360, 0.3561, 0.4310 climbs ' +
      'monotonely (imp-33582), but the ramp VELOCITY D1 = 0.0343, 0.0729, 0.1184, 0.1201, ' +
      '0.0749 rises then falls: the ramp accelerates through the first four decades and ' +
      'decelerates in the last. The approach to 1/2 is a SIGMOID (S-shape), not a straight or ' +
      'ever-steepening ramp.',
    F2_single_inflection_at_1e10:
      'The ramp ACCELERATION D2 = +0.0386, +0.0455, +0.0017, -0.0452 is positive for three ' +
      'steps then turns negative exactly ONCE (convex -> concave), a single inflection landing ' +
      'in the [1e10,1e11] decade. There is a KNEE, not a smooth monotone acceleration; the ' +
      'near-zero D2 (~+0.0017) at the [1e9,1e10] step marks the flat top of the velocity curve.',
    F3_steepest_at_1e9_to_1e10_step:
      'The exponent gains the most per decade (D1 ~ 0.1201, 0.2360 -> 0.3561) at the transition ' +
      'INTO the [1e10,1e11] decade, only ~0.0017 above the preceding step (~0.1184 -- the ' +
      'near-zero second difference), so the steepness is a two-decade [1e9,1e11] plateau ' +
      'peaking at [1e10,1e11], not a sharp spike. Past this the gain drops to ~0.0749 as sigma ' +
      'saturates toward the imp-3463 1/2.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Differencing the imp-33582 six-decade ' +
    'local-exponent ladder resolves the "climbs monotonely / accelerates smoothly" prose into ' +
    'curvature: the ramp is MONOTONE in value but SIGMOID in shape. The ramp velocity D1 rises ' +
    '(0.0343 -> 0.0729 -> 0.1184 -> 0.1201) then falls (0.0749), and the ramp acceleration D2 ' +
    'changes sign exactly ONCE (+ -> -), placing a single inflection (a KNEE) in the [1e10,1e11] ' +
    'decade. The ramp is steepest at the [1e9,1e10] -> [1e10,1e11] step (D1 ~ 0.1201), only ' +
    '~0.0017 above the preceding step, so the steepness is a two-decade [1e9,1e11] plateau not a ' +
    'spike; past the knee the exponent gain decelerates as sigma saturates toward the imp-3463 ' +
    'far-tail 1/2. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33582 (six-decade local-exponent ladder whose curvature this measures); imp-33274 ' +
    '(FAR-tail sliding-window p_eff -> 1/2); imp-3406 (interior MAX N ~ 9.22e5); imp-3463 ' +
    '(far-tail leading form, exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION_ASSERTIONS = [
  {
    // Reuse gate: the recomputed ladder reproduces the published imp-33582 perDecadeLadder to
    // its printed 4 decimals -- proving the IDENTICAL sigma model / OLS window is in use.
    id: 'imp33701-reuses-imp33582-ladder',
    description: 'recomputed p_local matches the published imp-33582 perDecadeLadder to 4 decimals',
    holds: () => {
      const pub = IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.perDecadeLadder;
      if (pub.length !== P_LADDER.length) return false;
      for (let i = 0; i < pub.length; i++) {
        if (Math.abs(pub[i].p_local - +P_LADDER[i].toFixed(4)) > 1e-9) return false;
      }
      return true;
    },
  },
  {
    // (F1): the ladder is monotone increasing but the velocity is NOT -- it rises then falls,
    // so the ramp is an S-shape rather than straight or ever-steepening.
    id: 'imp33701-ladder-monotone-velocity-rise-then-fall',
    description: 'p_local strictly increases; ramp velocity D1 rises to an interior max then falls',
    holds: () => {
      for (let i = 1; i < P_LADDER.length; i++) {
        if (!(P_LADDER[i] > P_LADDER[i - 1])) return false;
      }
      const v = D1.map((r) => r.d1);
      // interior maximum: strictly rising up to STEEPEST_IDX, strictly falling after it.
      if (STEEPEST_IDX === 0 || STEEPEST_IDX === v.length - 1) return false;
      for (let i = 1; i <= STEEPEST_IDX; i++) if (!(v[i] > v[i - 1])) return false;
      for (let i = STEEPEST_IDX + 1; i < v.length; i++) if (!(v[i] < v[i - 1])) return false;
      return true;
    },
  },
  {
    // (F2): the ramp acceleration D2 changes sign EXACTLY once (+ -> -), a single inflection,
    // and it lands in the [1e10,1e11] decade.
    id: 'imp33701-single-inflection-at-1e10',
    description: 'D2 has exactly one sign change (+ -> -), the inflection lands at [1e10,1e11]',
    holds: () => {
      const first = D2[0].d2;
      const last = D2[D2.length - 1].d2;
      return (
        NUM_SIGN_CHANGES === 1 && first > 0 && last < 0 && INFLECTION_K === 10
      );
    },
  },
  {
    // (F3): the steepest single decade-to-decade gain is the [1e9,1e10] -> [1e10,1e11] step,
    // ~0.12, and it exceeds the preceding step by only a hair (the near-zero D2 there).
    id: 'imp33701-steepest-at-1e9-to-1e10-step',
    description: 'argmax D1 is the k=9 step (~0.12), only marginally above its predecessor',
    holds: () =>
      STEEPEST_STEP_K === 9 &&
      Math.abs(D1[STEEPEST_IDX].d1 - 0.1201) < 5e-3 &&
      D1[STEEPEST_IDX].d1 - D1[STEEPEST_IDX - 1].d1 > 0 &&
      D1[STEEPEST_IDX].d1 - D1[STEEPEST_IDX - 1].d1 < 5e-3,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, PT SOTA.
    id: 'imp33701-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, PT stays SOTA',
    holds: () =>
      IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.isRigorous === false &&
      IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.farTailExponent === 0.5 &&
      /NO QED/.test(IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.verdict) &&
      /remains SOTA/.test(IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.verdict),
  },
];

for (const a of IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33701-sigma-postpeak-ramp-curvature-inflection assertion failed: ${a.id}`);
  }
}
