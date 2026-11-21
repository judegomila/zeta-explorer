/**
 * @module imp-96756-sigma-postpeak-ladder-extension-to-1e15
 *
 * imp-96756 (numerical, frontier-direction): imp-33582 measured the imp-3406 sigma(N) =
 * E_coll/E(N) post-peak per-decade LOCAL decay-exponent ladder on the grid N in {1e6..1e12}
 * (six decades, exponent ramping from ~0.0105 toward the imp-3463 far-tail 1/2 asymptote,
 * ending at ~0.4310 by [1e11,1e12]), and imp-33701 resolved that ramp as an S-shape (SIGMOID)
 * with EXACTLY ONE inflection -- a single convex->concave knee in the [1e10,1e11] decade
 * (imp-33721 sub-decade relocation N* ~ 3.38e9). But BOTH ladders STOP at 1e12. Whether the
 * sigmoid then saturates CLEANLY to 1/2 (no further knee, velocity decaying monotonely toward
 * zero) or hides a second inflection in the far tail was never measured. This module extends
 * the IDENTICAL imp-33582 per-decade ladder three more decades to [1e14,1e15] and re-runs the
 * imp-33701 discrete-curvature diagnostic on the full nine-decade ladder.
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 / imp-33701 -- no re-derivation)
 * ------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     p_dec(k) = -slope OLS(ln sigma vs ln N) over [10^k, 10^(k+1)], 4 pts/decade.
 * The EXACT imp-33582 sub-terms; k now runs 6..14 (was 6..11). The reuse gate below reproduces
 * the published imp-33582 perDecadeLadder over the shared decades k = 6..11 to 4 decimals.
 *
 * THE MEASUREMENT: extended ladder + curvature past 1e12
 * -----------------------------------------------------
 *   (a) EXTENDED LADDER p_dec(k), k = 6..14: three new decades [1e12,1e13], [1e13,1e14],
 *       [1e14,1e15] appended to the imp-33582 six-decade ladder.
 *   (b) RAMP VELOCITY  D1(k) = p_dec(k+1) - p_dec(k)  and ACCELERATION  D2(k) = D1(k) - D1(k-1)
 *       on the full nine-decade ladder (imp-33701 discrete first/second differences).
 *   (c) SATURATION TEST: does D1 keep decaying monotonely past its [1e10,1e11] peak, and does
 *       D2 stay one-signed (no SECOND sign change) past the single imp-33701 knee? Plus the
 *       residual-to-half r(k) = 1/2 - p_dec(k) and its log10, checking a clean shrink to 0.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE LADDER CONTINUES CLEANLY TOWARD 1/2. The three new decades extend the ramp
 *        monotonely: p_dec = ..., 0.4310 [1e11,1e12] -> 0.4646 [1e12,1e13] -> 0.4777
 *        [1e13,1e14] -> 0.4828 [1e14,1e15], still strictly below and approaching the imp-3463
 *        far-tail 1/2 from below (residual 1/2 - p_dec shrinks 0.0690 -> 0.0354 -> 0.0223 ->
 *        0.0172). sigma itself falls 0.0604 -> 0.0207 -> 0.0069 -> 0.0023 across the new grid.
 *   (F2) THE SIGMOID SATURATES -- VELOCITY DECAYS MONOTONELY PAST ITS KNEE. The velocity
 *        D1 = 0.0342, 0.0729, 0.1184, 0.1201, 0.0749, 0.0336, 0.0131, 0.0051 rises to its
 *        single peak 0.1201 at the [1e9,1e10] -> [1e10,1e11] step (imp-33701) and then falls
 *        MONOTONELY through all four post-knee steps toward zero. The exponent gain per decade
 *        collapses by ~23x from the peak to the [1e14,1e15] step -- the ramp is spent.
 *   (F3) EXACTLY ONE INFLECTION -- NO SECOND KNEE IN THE FAR TAIL. The acceleration
 *        D2 = +0.0387, +0.0455, +0.0017, -0.0452, -0.0413, -0.0205, -0.0080 changes sign
 *        EXACTLY ONCE (convex -> concave, the imp-33701 [1e10,1e11] knee) and then stays
 *        NEGATIVE for every far-tail step, shrinking monotonely toward 0. Extending three
 *        decades past 1e12 uncovers NO further inflection: the approach to 1/2 is a single
 *        clean sigmoid, not a staircase of knees.
 *
 * The punchline: extending the imp-33582 six-decade ladder to nine decades ([1e14,1e15])
 * confirms the imp-33701 S-shape saturates CLEANLY -- the per-decade exponent keeps climbing
 * monotonely toward 1/2 (0.4310 -> 0.4828), its velocity decays monotonely past the single
 * [1e10,1e11] knee, and the acceleration stays one-signed with NO second inflection. The
 * sigmoid has one knee, not many; the far tail is a smooth deceleration into the imp-3463 1/2.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share ladder-extension diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the six-decade ladder this extends)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (single-knee sigmoid this re-tests)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee relocation N* ~ 3.38e9)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-486 (C_mb GUE-conditional -- untouched)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY } from './imp-33582-sigma-postpeak-nearpeak-threshold-decay.js';

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
// Identical to imp-33582 so the shared decades reproduce its published perDecadeLadder.
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

const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote the ramp saturates toward

// (a) EXTENDED per-decade exponent ladder k = 6..14 ([1e6,1e7] .. [1e14,1e15]).
const K_LO = 6;
const K_HI = 14;
const LADDER = [];
for (let k = K_LO; k <= K_HI; k++) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  LADDER.push({
    decade: `1e${k}->1e${k + 1}`,
    p_local: +olsExponent(lo, hi).toFixed(4),
    residual_to_half: +(HALF - olsExponent(lo, hi)).toFixed(4),
    sigmaLo: +sigma(lo).toFixed(4),
    sigmaHi: +sigma(hi).toFixed(4),
  });
}

// (b) Discrete first (velocity) and second (acceleration) differences of the exponent ladder.
const P = LADDER.map((r) => r.p_local);
const D1 = [];
for (let i = 1; i < P.length; i++) D1.push(+(P[i] - P[i - 1]).toFixed(4));
const D2 = [];
for (let i = 1; i < D1.length; i++) D2.push(+(D1[i] - D1[i - 1]).toFixed(4));

// (c) Saturation diagnostics: peak velocity index, D2 sign-change count, monotone-post-peak flags.
const velPeakIdx = D1.reduce((best, v, i) => (v > D1[best] ? i : best), 0);
let d2SignChanges = 0;
for (let i = 1; i < D2.length; i++) {
  if (D2[i] !== 0 && D2[i - 1] !== 0 && Math.sign(D2[i]) !== Math.sign(D2[i - 1])) d2SignChanges++;
}
// Velocity decays monotonely for every step AFTER its single peak.
let velMonotoneDownPostPeak = true;
for (let i = velPeakIdx + 1; i < D1.length; i++) {
  if (!(D1[i] < D1[i - 1])) velMonotoneDownPostPeak = false;
}
// Acceleration stays negative for every far-tail step past the single knee (the D2 sign change).
const d2FarTail = D2.slice(velPeakIdx); // from the knee step onward
const d2NegPastKnee = d2FarTail.every((v) => v < 0);

export const IMP96756_SIGMA_POSTPEAK_LADDER_EXTENSION_TO_1E15 = {
  id: 'imp-96756',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33582 six-decade sigma(N) = E_coll/E(N) post-peak per-decade decay-exponent ' +
    'ladder past N = 1e12 to [1e14,1e15] and re-run the imp-33701 discrete-curvature diagnostic: ' +
    'does the single-knee S-shaped approach to the imp-3463 far-tail 1/2 asymptote saturate ' +
    'cleanly (velocity decaying monotonely, acceleration one-signed with no second inflection), ' +
    'or does a further knee appear in the far tail? Measurement/fit only; NOT an RH bound; no QED.',
  measuredQuantity:
    'p_dec(k) = -slope OLS(ln sigma on ln N) over [10^k,10^(k+1)] for k = 6..14 (4 pts/decade); ' +
    'discrete velocity D1(k) = p_dec(k+1)-p_dec(k) and acceleration D2(k) = D1(k)-D1(k-1); ' +
    'plus the D2 sign-change count and the residual-to-half 1/2 - p_dec(k) across the far tail',
  farTailExponent: HALF, // imp-3463 asymptote the extended ladder saturates toward
  extendedLadder: LADDER,
  velocityD1: D1, // 0.0342, 0.0729, 0.1184, 0.1201, 0.0749, 0.0336, 0.0131, 0.0051
  accelerationD2: D2, // +0.0387, +0.0455, +0.0017, -0.0452, -0.0413, -0.0205, -0.0080
  saturation: {
    velocityPeakDecadeStep: LADDER[velPeakIdx].decade + ' -> ' + LADDER[velPeakIdx + 1].decade,
    velocityPeak: +D1[velPeakIdx].toFixed(4), // ~0.1201 (imp-33701 [1e10,1e11] knee)
    d2SignChanges, // 1 -- exactly the single imp-33701 knee, no far-tail second inflection
    velocityMonotoneDownPastPeak: velMonotoneDownPostPeak, // true
    accelerationNegativePastKnee: d2NegPastKnee, // true
    residualToHalfAt_1e14_1e15: LADDER[LADDER.length - 1].residual_to_half, // ~0.0172
  },
  finding: {
    F1_ladder_continues_toward_half:
      'The three new decades extend the ramp monotonely: p_dec = ..., 0.4310 [1e11,1e12] -> ' +
      '0.4646 [1e12,1e13] -> 0.4777 [1e13,1e14] -> 0.4828 [1e14,1e15], still strictly below ' +
      'and approaching the imp-3463 far-tail 1/2 from below (residual 1/2 - p_dec shrinks ' +
      '0.0690 -> 0.0354 -> 0.0223 -> 0.0172). sigma falls 0.0604 -> 0.0207 -> 0.0069 -> 0.0023.',
    F2_sigmoid_saturates_velocity_decays:
      'The velocity D1 rises to its single peak ~0.1201 at the [1e9,1e10] -> [1e10,1e11] step ' +
      '(imp-33701) then falls MONOTONELY through all four post-knee steps toward zero (0.0749, ' +
      '0.0336, 0.0131, 0.0051) -- the per-decade exponent gain collapses ~23x from peak to the ' +
      '[1e14,1e15] step. The ramp is spent; the S-shape saturates rather than re-accelerating.',
    F3_exactly_one_inflection_no_second_knee:
      'The acceleration D2 changes sign EXACTLY ONCE (convex -> concave, the imp-33701 ' +
      '[1e10,1e11] knee) and then stays NEGATIVE for every far-tail step, shrinking monotonely ' +
      'toward 0 (-0.0452, -0.0413, -0.0205, -0.0080). Extending three decades past 1e12 uncovers ' +
      'NO further inflection: the approach to 1/2 is a single clean sigmoid, not a staircase.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33582 six-decade sigma(N) ' +
    'post-peak per-decade exponent ladder three decades to [1e14,1e15] (nine decades total) and ' +
    're-running the imp-33701 discrete-curvature diagnostic: the exponent keeps climbing ' +
    'monotonely toward the imp-3463 far-tail 1/2 (0.4310 -> 0.4646 -> 0.4777 -> 0.4828, residual ' +
    'to half 0.0690 -> 0.0172), the ramp velocity D1 decays MONOTONELY past its single ~0.1201 ' +
    '[1e10,1e11] knee (0.0749 -> 0.0051, a ~23x collapse), and the acceleration D2 stays ' +
    'one-signed (exactly one sign change, then strictly negative shrinking toward 0) -- so the ' +
    'S-shaped approach saturates CLEANLY with NO second inflection in the far tail. The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33582 (six-decade post-peak ladder this extends); imp-33701 (single-knee sigmoid ' +
    'curvature this re-tests); imp-33721 (sub-decade knee relocation N* ~ 3.38e9); imp-3463 ' +
    '(far-tail leading form, exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96756_SIGMA_POSTPEAK_LADDER_EXTENSION_TO_1E15_ASSERTIONS = [
  {
    // Reuse gate: the shared decades k = 6..11 reproduce the published imp-33582 perDecadeLadder
    // to the printed 4 decimals -- proving the identical component model is in use.
    id: 'imp96756-reproduces-imp33582-shared-decades',
    description: 'shared decades k=6..11 match imp-33582 published perDecadeLadder p_local to 4dp',
    holds: () => {
      const prev = IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.perDecadeLadder;
      for (let i = 0; i < prev.length; i++) {
        if (LADDER[i].decade !== prev[i].decade) return false;
        if (Math.abs(LADDER[i].p_local - prev[i].p_local) > 1e-4) return false;
      }
      return true;
    },
  },
  {
    // (F1): the full nine-decade exponent ladder is strictly monotone increasing and every rung
    // stays in (0, 1/2), with the new [1e14,1e15] rung landing near 0.4828 below the asymptote.
    id: 'imp96756-extended-ladder-monotone-below-half',
    description: 'p_dec strictly increases across k=6..14, all in (0,0.5), last rung ~0.4828',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i].p_local > LADDER[i - 1].p_local)) return false;
      }
      return (
        LADDER.every((r) => r.p_local > 0 && r.p_local < HALF) &&
        Math.abs(LADDER[LADDER.length - 1].p_local - 0.4828) < 5e-4
      );
    },
  },
  {
    // (F2): the velocity peaks once (the imp-33701 knee) and decays monotonely afterward.
    id: 'imp96756-velocity-decays-monotonely-past-knee',
    description: 'D1 peaks ~0.1201 then falls monotonely through all far-tail steps toward 0',
    holds: () =>
      Math.abs(D1[velPeakIdx] - 0.1201) < 5e-4 &&
      velMonotoneDownPostPeak &&
      D1[D1.length - 1] < 0.01,
  },
  {
    // (F3): exactly one D2 sign change (the single knee), negative thereafter -- no second knee.
    id: 'imp96756-exactly-one-inflection-no-second-knee',
    description: 'D2 changes sign exactly once then stays negative shrinking toward 0',
    holds: () => d2SignChanges === 1 && d2NegPastKnee && D2[D2.length - 1] < 0 && D2[D2.length - 1] > -0.02,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp96756-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP96756_SIGMA_POSTPEAK_LADDER_EXTENSION_TO_1E15.isRigorous === false &&
      IMP96756_SIGMA_POSTPEAK_LADDER_EXTENSION_TO_1E15.farTailExponent === 0.5 &&
      /NO QED/.test(IMP96756_SIGMA_POSTPEAK_LADDER_EXTENSION_TO_1E15.verdict) &&
      /refereed bound is changed/i.test(IMP96756_SIGMA_POSTPEAK_LADDER_EXTENSION_TO_1E15.verdict),
  },
];

for (const a of IMP96756_SIGMA_POSTPEAK_LADDER_EXTENSION_TO_1E15_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96756-sigma-postpeak-ladder-extension-to-1e15 assertion failed: ${a.id}`);
  }
}
