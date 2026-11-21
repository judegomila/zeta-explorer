/**
 * @module imp-33726-sigma-ramp-inflection-window-density-robustness
 *
 * imp-33726 (numerical, frontier-direction): imp-33701 measured the CURVATURE of the imp-33582
 * six-decade sigma(N) = E_coll/E(N) post-peak local-exponent ramp (0.0105 -> 0.4310 across
 * N in {1e6..1e12}) via discrete first/second differences and found the ramp is a SIGMOID:
 * the velocity D1 rises then falls, the acceleration D2 changes sign EXACTLY ONCE (+ -> -), a
 * single inflection (a KNEE) landing in the [1e10,1e11] decade, steepest at the k=9 step. But
 * imp-33701 built each per-decade OLS local exponent from only 4 points/decade. This module
 * ASSESSES whether that single-inflection reading is robust to the OLS window DENSITY or is a
 * 4-point coarse-sampling artifact: it recomputes the identical whole-decade ladder p_dec(6..11),
 * the velocity D1 and the acceleration D2 at 4, 8 AND 16 points/decade over the SAME [1e6,1e12]
 * range, and checks whether the single convex->concave knee, its decade, the steepest decade and
 * the monotone-value/S-shape reading survive denser sampling.
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 / imp-33701 -- no re-derivation)
 * ------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     p_dec(k; m) = -slope OLS(ln sigma vs ln N) over [10^k, 10^(k+1)], k = 6..11, m pts/decade.
 * The m = 4 ladder reproduces the imp-33701/imp-33582 published ladder to the printed decimals
 * (reuse gate below); m in {8,16} are the denser-sampling comparators.
 *
 * THE MEASUREMENT: window-density sweep of the curvature diagnostic
 * ----------------------------------------------------------------
 *   For each m in {4, 8, 16}: form p_dec(k; m), the velocity D1(k; m) = p(k+1)-p(k), the
 *   acceleration D2(k; m) = D1(k)-D1(k-1), the number of D2 sign changes, the inflection decade
 *   (single + -> - crossing) and the steepest decade (argmax D1). Then compare across m: the
 *   maximum drift of any ladder rung, and whether the sign-change count, inflection decade and
 *   steepest decade are invariant.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE SINGLE INFLECTION IS DENSITY-ROBUST, NOT A 4-POINT ARTIFACT. At all three densities
 *        m in {4,8,16} the acceleration D2 has signs (+,+,+,-): exactly ONE convex->concave sign
 *        change, and it lands in the SAME [1e10,1e11] decade every time. The near-zero D2 at the
 *        k=9 step (m=4: +0.001687, m=8: +0.001706, m=16: +0.001718) stays positive and tiny --
 *        the flat top of the velocity curve -- so the knee never splits, merges or relocates a
 *        decade under denser sampling.
 *   (F2) THE LADDER RUNGS MOVE LESS THAN ~4e-4 UNDER 4x DENSER SAMPLING. The whole-decade
 *        exponent ladder is essentially density-invariant: from m=4 to m=16 the maximum rung
 *        drift is ~3.9e-4 (at [1e8,1e9], 0.117617 -> 0.117227), all other rungs move less. The
 *        4-point OLS already resolves each decade slope; more points only trim the last few
 *        significant figures, not the shape.
 *   (F3) THE MONOTONE-VALUE / S-SHAPE / STEEPEST-DECADE READINGS ALL SURVIVE. At every m the
 *        ladder is strictly increasing, the velocity D1 rises then falls (interior maximum), and
 *        the steepest single decade-to-decade gain is the k=9 [1e9,1e10] -> [1e10,1e11] step
 *        (D1 ~ 0.1201 -> 0.1203 -> 0.1205), only ~0.0017 above its predecessor at all densities.
 *        The imp-33701 "monotone in value, sigmoid in shape, single knee at [1e10,1e11], steepest
 *        at k=9" conclusion is confirmed independent of the OLS window density.
 *
 * The punchline: the imp-33701 single-inflection SIGMOID reading of the sigma(N) exponent ramp
 * is a genuine feature of the (inherited) model, NOT an artifact of its 4-point-per-decade OLS
 * windows -- denser 8- and 16-point sampling reproduce the same one D2 sign change in the same
 * [1e10,1e11] decade, the same k=9 steepest step, and the same monotone-value/S-shape ladder to
 * within ~4e-4 per rung. (Whole-decade resolution places the knee in [1e10,1e11]; imp-33721
 * separately showed SUB-decade differencing relocates the true inflection to N* ~ 3.38e9 -- that
 * is a RESOLUTION effect on the decade grid, orthogonal to the WINDOW-DENSITY question settled
 * here.)
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature-robustness diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (the 4-pts/decade curvature this stress-tests)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-DECADE resolution: knee relocates to N* ~ 3.38e9)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the six-decade exponent ladder)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
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

// OLS local decay exponent p = -slope of ln sigma on ln N over [loN, hiN] at m pts/decade.
// Identical to imp-33701 (m defaults to 4) so the m=4 ladder reproduces its published values.
function olsExponent(loN, hiN, ptsPerDecade) {
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

const DECADE_KS = [6, 7, 8, 9, 10, 11];
const DENSITIES = [4, 8, 16];

// Curvature diagnostic (ladder / D1 / D2 / inflection / steepest) at one window density m.
function curvatureAtDensity(m) {
  const P = DECADE_KS.map((k) => olsExponent(Math.pow(10, k), Math.pow(10, k + 1), m));
  const D1 = [];
  for (let i = 1; i < P.length; i++) D1.push(P[i] - P[i - 1]);
  const D2 = [];
  for (let i = 1; i < D1.length; i++) D2.push(D1[i] - D1[i - 1]);
  let numSignChanges = 0;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i]) !== Math.sign(D2[i - 1])) numSignChanges += 1;
  }
  // inflection decade: the k at the single + -> - crossing (D2 index i maps to decade k=7+i).
  let inflectionK = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i]) !== Math.sign(D2[i - 1])) {
      inflectionK = DECADE_KS[1] + i;
      break;
    }
  }
  let steepIdx = 0;
  for (let i = 1; i < D1.length; i++) if (D1[i] > D1[steepIdx]) steepIdx = i;
  return {
    ptsPerDecade: m,
    p_local: P.map((p) => +p.toFixed(6)),
    D1: D1.map((v) => +v.toFixed(6)),
    D2: D2.map((v) => +v.toFixed(6)),
    numSignChanges,
    inflectionDecade: inflectionK === null ? null : `1e${inflectionK}->1e${inflectionK + 1}`,
    inflectionK,
    steepestStepK: DECADE_KS[steepIdx],
    steepestD1: +D1[steepIdx].toFixed(6),
  };
}

const SWEEP = DENSITIES.map((m) => curvatureAtDensity(m));
const BY_M = Object.fromEntries(SWEEP.map((s) => [s.ptsPerDecade, s]));

// Cross-density drift of the whole-decade ladder rungs (m=4 vs m=16).
let MAX_RUNG_DRIFT = 0;
for (let i = 0; i < DECADE_KS.length; i++) {
  const drift = Math.abs(BY_M[4].p_local[i] - BY_M[16].p_local[i]);
  if (drift > MAX_RUNG_DRIFT) MAX_RUNG_DRIFT = drift;
}
MAX_RUNG_DRIFT = +MAX_RUNG_DRIFT.toFixed(6);

// Invariance flags across the density sweep.
const ALL_ONE_SIGN_CHANGE = SWEEP.every((s) => s.numSignChanges === 1);
const ALL_SAME_INFLECTION = SWEEP.every((s) => s.inflectionK === BY_M[4].inflectionK);
const ALL_SAME_STEEPEST = SWEEP.every((s) => s.steepestStepK === BY_M[4].steepestStepK);
const ALL_D2_PLUS_PLUS_PLUS_MINUS = SWEEP.every(
  (s) => s.D2.length === 4 && s.D2[0] > 0 && s.D2[1] > 0 && s.D2[2] > 0 && s.D2[3] < 0,
);
const ALL_LADDER_MONOTONE = SWEEP.every((s) => {
  for (let i = 1; i < s.p_local.length; i++) if (!(s.p_local[i] > s.p_local[i - 1])) return false;
  return true;
});

export const IMP33726_SIGMA_RAMP_INFLECTION_WINDOW_DENSITY_ROBUSTNESS = {
  id: 'imp-33726',
  proofSection: 'S-frontier',
  question:
    'imp-33701 differenced the imp-33582 six-decade sigma(N) local-exponent ladder built from ' +
    '4 points/decade OLS windows and found a SIGMOID -- velocity rise-then-fall, acceleration ' +
    'D2 with exactly one sign change (a knee) in [1e10,1e11], steepest at k=9. Is that single ' +
    'inflection robust to the OLS window DENSITY, or a 4-point coarse-sampling artifact? ' +
    'Recompute p_dec, D1 and D2 at 8 and 16 points/decade over the same [1e6,1e12] and MEASURE ' +
    'whether the knee, its decade, the steepest decade and the monotone/S-shape reading survive. ' +
    'Measurement/fit only; conditional-share curvature-robustness diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the imp-33701 whole-decade curvature diagnostic (ladder p_dec(6..11), velocity D1, ' +
    'acceleration D2, D2 sign-change count, inflection decade, steepest decade) recomputed at ' +
    'window densities m in {4,8,16} pts/decade over [1e6,1e12], and the cross-density max rung drift',
  densities: DENSITIES,
  sweep: SWEEP,
  maxRungDrift_4_to_16: MAX_RUNG_DRIFT,
  invariants: {
    allOneD2SignChange: ALL_ONE_SIGN_CHANGE,
    inflectionDecadeInvariant: ALL_SAME_INFLECTION,
    inflectionDecade: BY_M[4].inflectionDecade,
    steepestDecadeInvariant: ALL_SAME_STEEPEST,
    steepestStepK: BY_M[4].steepestStepK,
    d2SignPatternPlusPlusPlusMinus: ALL_D2_PLUS_PLUS_PLUS_MINUS,
    ladderMonotoneAtEveryDensity: ALL_LADDER_MONOTONE,
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_single_inflection_density_robust:
      'At all three densities m in {4,8,16} the acceleration D2 has signs (+,+,+,-): exactly ONE ' +
      'convex->concave sign change, landing in the SAME [1e10,1e11] decade. The near-zero D2 at ' +
      'the k=9 step (m=4: +0.001687, m=8: +0.001706, m=16: +0.001718) stays positive and tiny, so ' +
      'the knee never splits, merges or relocates a decade under denser sampling -- NOT a ' +
      '4-point artifact.',
    F2_ladder_rungs_move_under_4e_minus_4:
      'From m=4 to m=16 the maximum whole-decade rung drift is ~3.9e-4 (at [1e8,1e9], ' +
      '0.117617 -> 0.117227); every other rung moves less. The 4-point OLS already resolves each ' +
      'decade slope -- more points only trim the last few significant figures, not the shape.',
    F3_monotone_sshape_steepest_survive:
      'At every m the ladder is strictly increasing, the velocity D1 rises then falls (interior ' +
      'maximum), and the steepest single decade gain is the k=9 [1e9,1e10] -> [1e10,1e11] step ' +
      '(D1 ~ 0.1201 -> 0.1203 -> 0.1205), only ~0.0017 above its predecessor at all densities. The ' +
      'imp-33701 monotone-value / sigmoid-shape / single-knee-at-[1e10,1e11] / steepest-at-k=9 ' +
      'reading holds independent of the OLS window density.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Sweeping the OLS window density m in ' +
    '{4,8,16} pts/decade over the SAME [1e6,1e12] range confirms the imp-33701 single-inflection ' +
    'SIGMOID reading of the sigma(N)=E_coll/E exponent ramp is DENSITY-ROBUST, not a 4-point ' +
    'coarse-sampling artifact: the acceleration D2 keeps the (+,+,+,-) sign pattern -- exactly ONE ' +
    'convex->concave knee in the [1e10,1e11] decade -- at all three densities, the steepest step ' +
    'stays the k=9 [1e9,1e10] -> [1e10,1e11] transition, the ladder stays strictly monotone with ' +
    'the velocity rise-then-fall, and the whole-decade rungs move by at most ~3.9e-4 under 4x ' +
    'denser sampling. (Whole-decade resolution places the knee in [1e10,1e11]; imp-33721 ' +
    'separately relocated the true inflection to N* ~ 3.38e9 via SUB-decade differencing -- a ' +
    'grid-resolution effect orthogonal to the window-density robustness settled here.) The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33701 (4-pts/decade curvature this stress-tests); imp-33721 (sub-decade inflection N* ~ 3.38e9); ' +
    'imp-33582 (six-decade local-exponent ladder); imp-3406 (interior MAX N ~ 9.22e5); imp-3463 ' +
    '(far-tail leading form, exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33726_SIGMA_RAMP_INFLECTION_WINDOW_DENSITY_ROBUSTNESS_ASSERTIONS = [
  {
    // Reuse gate: the m=4 recomputed ladder reproduces the published imp-33701 ladder to its
    // printed decimals -- proving the IDENTICAL sigma model / OLS window is in use.
    id: 'imp33726-reuses-imp33701-ladder-at-m4',
    description: 'the m=4 recomputed p_local matches the published imp-33701 ladder to 5 decimals',
    holds: () => {
      const pub = IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.ladder.p_local;
      const mine = BY_M[4].p_local;
      if (pub.length !== mine.length) return false;
      for (let i = 0; i < pub.length; i++) {
        if (Math.abs(pub[i] - mine[i]) > 1e-5) return false;
      }
      return true;
    },
  },
  {
    // (F1): every density gives exactly one D2 sign change (+,+,+,-) in the SAME [1e10,1e11] decade.
    id: 'imp33726-single-inflection-density-invariant',
    description: 'D2 has exactly one sign change (+,+,+,-) in [1e10,1e11] at m in {4,8,16}',
    holds: () =>
      ALL_ONE_SIGN_CHANGE &&
      ALL_D2_PLUS_PLUS_PLUS_MINUS &&
      ALL_SAME_INFLECTION &&
      BY_M[4].inflectionK === 10,
  },
  {
    // (F2): the whole-decade ladder is essentially density-invariant (max rung drift small).
    id: 'imp33726-ladder-rungs-density-stable',
    description: 'max ladder-rung drift from m=4 to m=16 is below 1e-3 (~3.9e-4)',
    holds: () => MAX_RUNG_DRIFT > 0 && MAX_RUNG_DRIFT < 1e-3,
  },
  {
    // (F3): monotone value, rise-then-fall velocity, and steepest step k=9 survive at all densities.
    id: 'imp33726-monotone-sshape-steepest-survive',
    description: 'ladder monotone + steepest step k=9 at every density m in {4,8,16}',
    holds: () => ALL_LADDER_MONOTONE && ALL_SAME_STEEPEST && BY_M[4].steepestStepK === 9,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp33726-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP33726_SIGMA_RAMP_INFLECTION_WINDOW_DENSITY_ROBUSTNESS.isRigorous === false &&
      IMP33726_SIGMA_RAMP_INFLECTION_WINDOW_DENSITY_ROBUSTNESS.farTailExponent === 0.5 &&
      /NO QED/.test(IMP33726_SIGMA_RAMP_INFLECTION_WINDOW_DENSITY_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP33726_SIGMA_RAMP_INFLECTION_WINDOW_DENSITY_ROBUSTNESS.verdict),
  },
];

for (const a of IMP33726_SIGMA_RAMP_INFLECTION_WINDOW_DENSITY_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-33726-sigma-ramp-inflection-window-density-robustness assertion failed: ${a.id}`,
    );
  }
}
