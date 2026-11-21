/**
 * @module imp-95055-sigma-ramp-knee-endpoint-extension
 *
 * imp-95055 (numerical, frontier-direction): imp-33701 differenced the imp-33582 six-decade
 * sigma(N) = E_coll/E(N) post-peak local-exponent ladder (k = 6..11, i.e. N in {1e6..1e12}) and
 * found the ramp is a SIGMOID: velocity D1 rises then falls, acceleration D2 changes sign EXACTLY
 * ONCE (convex -> concave), a single KNEE landing in the [1e10,1e11] decade. imp-33726 separately
 * showed that reading is robust to the OLS WINDOW DENSITY (m in {4,8,16} pts/decade). But there is
 * a third, UNTESTED failure mode -- the one that sank the earlier "widest at 10^6" peak (imp-3220),
 * which imp-3406 exposed as a flat-cap SAMPLING ARTIFACT of the ladder ENDPOINT. In imp-33701 the
 * D2 array covers only k = 7..10, so its single sign change lands at k = 10 -- the VERY LAST D2
 * entry, sitting exactly at the truncation boundary of the imp-33582 ladder (which stops at 1e12).
 * A negative second difference detected only at the last available grid point is precisely the
 * imp-3406 endpoint-artifact signature. This module tests it directly by EXTENDING the identical
 * exponent ladder six decades past the 1e12 truncation, to k = 17 (1e18), and asking whether the
 * lone D2 sign change survives, relocates, or multiplies once the knee is no longer pinned at the
 * grid endpoint.
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 / imp-33701 / imp-33726 -- no re-derivation)
 * -------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent),
 *     p_dec(k) = -slope OLS(ln sigma vs ln N) over [10^k, 10^(k+1)], 4 pts/decade (imp-33701 window).
 * The k = 6..11 sub-ladder reproduces the imp-33701 published ladder exactly (reuse gate below);
 * k = 12..17 are the six NEW decades past the imp-33582 truncation endpoint.
 *
 * THE MEASUREMENT: does the knee survive removal of the grid-endpoint truncation?
 * ------------------------------------------------------------------------------
 *   Build p_dec(6..17), the velocity D1 (k = 6..16) and the acceleration D2 (k = 7..16), count the
 *   D2 sign changes and locate the single convex -> concave crossing. In imp-33701 the crossing sat
 *   at the terminal D2 index (k = 10 of 7..10); here there are SIX D2 entries beyond k = 10, so a
 *   genuine knee must (i) keep exactly one sign change, (ii) keep it at k = 10, and (iii) leave
 *   every post-knee D2 negative (a monotone deceleration to 0 from below), whereas a truncation
 *   artifact would relocate the crossing or spawn a second one once the endpoint is unpinned.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE KNEE IS NOT A GRID-ENDPOINT ARTIFACT. Extending the ladder from 1e12 to 1e18 keeps the
 *        acceleration D2 with EXACTLY ONE sign change, still in the SAME [1e10,1e11] decade. The
 *        earlier terminal position of the crossing (last D2 entry in imp-33701) was an artifact of
 *        where the imp-33582 ladder happened to stop, NOT of where the curvature actually turns.
 *   (F2) THE POST-KNEE DECELERATION PERSISTS, MONOTONE TO 0 FROM BELOW. With the endpoint unpinned,
 *        the six D2 entries past the knee stay NEGATIVE and shrink monotonely toward zero:
 *        D2(k=10..16) = -0.045162, -0.041369, -0.020494, -0.007931, -0.002831, -0.001015, -0.000392.
 *        The concave arm never re-crosses zero -- there is one knee, then a smooth saturation, not a
 *        second inflection lurking just past the old truncation.
 *   (F3) THE STEEPEST STEP AND THE FAR-TAIL TARGET ARE UNCHANGED BY THE EXTENSION. The steepest
 *        single decade gain remains the k = 9 [1e9,1e10] -> [1e10,1e11] step (D1 ~ 0.1201), and the
 *        extended ladder continues to climb toward the imp-3463 far-tail 1/2 from below
 *        (p_dec: ... 0.4310 [1e11,1e12] -> 0.4646 -> 0.4777 -> 0.4828 -> 0.4851 -> 0.4864 -> 0.4873),
 *        confirming the ramp is the near tail of a single sigmoid whose plateau is 1/2, not a shape
 *        that the 1e12 cutoff created.
 *
 * The punchline: the imp-33701 single-inflection knee at [1e10,1e11] passes the imp-3406
 * endpoint-artifact test that sank the earlier "widest at 10^6" peak. Extending the identical
 * exponent ladder six decades past the imp-33582 truncation (1e12 -> 1e18) leaves exactly one D2
 * sign change, in the same decade, with all six new post-knee second differences negative and
 * decaying to 0 from below. The knee is a genuine feature of the (inherited) model, not a boundary
 * effect of where the ladder was cut off. (Window-DENSITY robustness was settled by imp-33726;
 * SUB-decade resolution relocates the fine inflection to N* ~ 3.38e9 per imp-33721 -- both are
 * orthogonal to the ladder-ENDPOINT question settled here.)
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature-robustness diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (the 4-pts/decade knee whose endpoint this stress-tests)
 * @see imp-33726-sigma-ramp-inflection-window-density-robustness (window-DENSITY robustness, orthogonal axis)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-DECADE resolution: fine inflection N* ~ 3.38e9)
 * @see imp-3406-sigma-highN-extrapolation (the endpoint SAMPLING ARTIFACT that sank the "widest at 10^6" peak)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION } from './imp-33701-sigma-postpeak-ramp-curvature-inflection.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33701/imp-33726 exactly

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
// Identical to imp-33701 so the k=6..11 sub-ladder reproduces its published ladder.
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

// The imp-33582 six-decade ladder stops at k=11 (1e12). Extend six decades to k=17 (1e18) so the
// D2 sign change is no longer pinned at the terminal grid point.
const KS_BASE = [6, 7, 8, 9, 10, 11]; // imp-33701/imp-33582 decades (endpoint = 1e12)
const KS_EXT = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]; // extended to 1e18
const P_EXT = KS_EXT.map((k) => olsExponent(Math.pow(10, k), Math.pow(10, k + 1)));

// Velocity D1(k) = p(k+1) - p(k), k = 6..16; acceleration D2(k) = D1(k) - D1(k-1), k = 7..16.
const D1_EXT = [];
for (let i = 1; i < P_EXT.length; i++) D1_EXT.push({ stepK: KS_EXT[i - 1], d1: P_EXT[i] - P_EXT[i - 1] });
const D2_EXT = [];
for (let i = 1; i < D1_EXT.length; i++) D2_EXT.push({ atK: KS_EXT[i], d2: D1_EXT[i].d1 - D1_EXT[i - 1].d1 });

// Single sign change of D2 (convex -> concave) and its decade; steepest velocity step.
let NUM_SIGN_CHANGES = 0;
let INFLECTION_K = null;
for (let i = 1; i < D2_EXT.length; i++) {
  if (Math.sign(D2_EXT[i].d2) !== Math.sign(D2_EXT[i - 1].d2)) {
    NUM_SIGN_CHANGES += 1;
    if (INFLECTION_K === null) INFLECTION_K = D2_EXT[i].atK;
  }
}
let STEEPEST_IDX = 0;
for (let i = 1; i < D1_EXT.length; i++) if (D1_EXT[i].d1 > D1_EXT[STEEPEST_IDX].d1) STEEPEST_IDX = i;
const STEEPEST_STEP_K = D1_EXT[STEEPEST_IDX].stepK;

// Post-knee D2 entries (atK >= INFLECTION_K): how many, and are they all negative?
const POST_KNEE_D2 = D2_EXT.filter((r) => r.atK >= INFLECTION_K);
const POST_KNEE_COUNT = POST_KNEE_D2.length; // beyond the knee itself, the "unpinned" evidence
const POST_KNEE_ALL_NEGATIVE = POST_KNEE_D2.every((r) => r.d2 < 0);
// Number of D2 entries strictly AFTER the knee decade -- these did not exist in imp-33701 (endpoint).
const D2_ENTRIES_AFTER_KNEE = D2_EXT.filter((r) => r.atK > INFLECTION_K).length;

export const IMP95055_SIGMA_RAMP_KNEE_ENDPOINT_EXTENSION = {
  id: 'imp-95055',
  proofSection: 'S-frontier',
  question:
    'imp-33701 found the sigma(N) exponent ramp has a single convex -> concave KNEE in [1e10,1e11], ' +
    'but its D2 array covered only k=7..10, so the sign change sat at the LAST entry -- the ' +
    'imp-33582 ladder truncation at 1e12. That terminal position is the imp-3406 endpoint-artifact ' +
    'signature (the one that sank the "widest at 10^6" peak, imp-3220). Extend the identical ' +
    'exponent ladder six decades past 1e12 (to 1e18) and MEASURE whether the lone D2 sign change ' +
    'survives, relocates, or multiplies once the knee is no longer pinned at the grid endpoint. ' +
    'Measurement/fit only; conditional-share curvature-robustness diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the imp-33701 whole-decade exponent ladder p_dec(6..11) EXTENDED to p_dec(6..17) (N in ' +
    '{1e6..1e18}), its velocity D1(6..16) and acceleration D2(7..16); the number of D2 sign changes, ' +
    'the inflection decade, and how many post-knee D2 entries (absent in the 1e12-truncated ladder) ' +
    'stay negative',
  baseEndpointK: KS_BASE[KS_BASE.length - 1], // 11 -- imp-33582/imp-33701 truncation (1e12)
  extendedEndpointK: KS_EXT[KS_EXT.length - 1], // 17 -- new endpoint (1e18)
  ladderExtended: {
    decadeKs: KS_EXT,
    p_local: P_EXT.map((p) => +p.toFixed(6)),
  },
  rampVelocity: D1_EXT.map((r) => ({ step: `1e${r.stepK}->1e${r.stepK + 1}`, d1: +r.d1.toFixed(6) })),
  rampAcceleration: D2_EXT.map((r) => ({ decade: `1e${r.atK}->1e${r.atK + 1}`, d2: +r.d2.toFixed(6) })),
  numSignChanges: NUM_SIGN_CHANGES,
  inflectionDecade: `1e${INFLECTION_K}->1e${INFLECTION_K + 1}`,
  inflectionK: INFLECTION_K,
  steepestStepDecade: `1e${STEEPEST_STEP_K}->1e${STEEPEST_STEP_K + 1}`,
  steepestD1: +D1_EXT[STEEPEST_IDX].d1.toFixed(6),
  postKneeD2Count: POST_KNEE_COUNT,
  postKneeAllNegative: POST_KNEE_ALL_NEGATIVE,
  d2EntriesAfterKnee: D2_ENTRIES_AFTER_KNEE, // > 0 means the knee is no longer at the grid endpoint
  farTailExponent: 0.5, // imp-3463 asymptote the extended ladder keeps climbing toward
  finding: {
    F1_knee_not_endpoint_artifact:
      'Extending the ladder from 1e12 to 1e18 keeps the acceleration D2 with EXACTLY ONE sign ' +
      'change, still in the SAME [1e10,1e11] decade. The terminal position of the crossing in ' +
      'imp-33701 (last D2 entry) was an artifact of where the imp-33582 ladder stopped, NOT of ' +
      'where the curvature turns -- the knee passes the imp-3406 endpoint-artifact test.',
    F2_post_knee_deceleration_monotone_to_zero:
      'With the endpoint unpinned, the six D2 entries past the knee stay NEGATIVE and shrink ' +
      'monotonely toward zero: D2(k=10..16) = -0.045162, -0.041369, -0.020494, -0.007931, ' +
      '-0.002831, -0.001015, -0.000392. The concave arm never re-crosses zero -- one knee, then a ' +
      'smooth saturation, not a second inflection hiding just past the old truncation.',
    F3_steepest_and_fartail_unchanged:
      'The steepest single decade gain remains the k=9 [1e9,1e10] -> [1e10,1e11] step (D1 ~ 0.1201), ' +
      'and the extended ladder keeps climbing toward the imp-3463 far-tail 1/2 from below ' +
      '(0.4310 -> 0.4646 -> 0.4777 -> 0.4828 -> 0.4851 -> 0.4864 -> 0.4873), confirming the ramp is ' +
      'the near tail of a single sigmoid with plateau 1/2, not a shape the 1e12 cutoff created.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33701/imp-33582 exponent ' +
    'ladder six decades past its 1e12 truncation (to 1e18) confirms the single-inflection KNEE at ' +
    '[1e10,1e11] is NOT a grid-endpoint sampling artifact of the kind imp-3406 exposed in the ' +
    'earlier "widest at 10^6" peak: the acceleration D2 keeps EXACTLY ONE convex -> concave sign ' +
    'change, in the SAME [1e10,1e11] decade, with all six new post-knee second differences ' +
    '(-0.045 -> -0.0004) negative and decaying monotonely to 0 from below -- no relocation, no ' +
    'second inflection. The steepest step stays the k=9 [1e9,1e10] -> [1e10,1e11] transition and ' +
    'the ladder keeps climbing toward the imp-3463 far-tail 1/2 from below. In imp-33701 the sign ' +
    'change sat at the LAST D2 entry (the ladder endpoint); here there are six D2 entries beyond it, ' +
    'all negative, so the knee is a feature of the curvature, not of where the ladder was cut off. ' +
    '(Window-DENSITY robustness was settled by imp-33726; sub-decade resolution relocates the fine ' +
    'inflection to N* ~ 3.38e9 per imp-33721 -- both orthogonal to this ladder-ENDPOINT question.) ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33701 (4-pts/decade knee this endpoint-tests); imp-33726 (window-density robustness, ' +
    'orthogonal axis); imp-33721 (sub-decade inflection N* ~ 3.38e9); imp-33582 (six-decade ladder, ' +
    'endpoint 1e12); imp-3406 (endpoint SAMPLING ARTIFACT that sank the "widest at 10^6" peak); ' +
    'imp-3463 (far-tail leading form, exponent -> 1/2 from below); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP95055_SIGMA_RAMP_KNEE_ENDPOINT_EXTENSION_ASSERTIONS = [
  {
    // Reuse gate: the k=6..11 sub-ladder reproduces the published imp-33701 ladder to its printed
    // decimals -- proving the IDENTICAL sigma model / OLS window is in use before extending it.
    id: 'imp95055-reuses-imp33701-ladder-on-base-decades',
    description: 'the k=6..11 sub-ladder matches the published imp-33701 ladder to 5 decimals',
    holds: () => {
      const pub = IMP33701_SIGMA_POSTPEAK_RAMP_CURVATURE_INFLECTION.ladder.p_local;
      if (pub.length !== KS_BASE.length) return false;
      for (let i = 0; i < pub.length; i++) {
        if (Math.abs(pub[i] - +P_EXT[i].toFixed(6)) > 1e-5) return false;
      }
      return true;
    },
  },
  {
    // (F1): extending past the 1e12 endpoint leaves EXACTLY ONE D2 sign change, still at k=10.
    id: 'imp95055-single-inflection-survives-endpoint-extension',
    description: 'extended D2 (7..16) has exactly one sign change, in the [1e10,1e11] decade',
    holds: () => NUM_SIGN_CHANGES === 1 && INFLECTION_K === 10,
  },
  {
    // (F1/F2): the knee is no longer at the grid endpoint -- there are post-knee D2 entries that did
    // not exist in the 1e12-truncated imp-33701 ladder, and every one of them is negative.
    id: 'imp95055-knee-unpinned-post-knee-d2-all-negative',
    description: 'at least 5 D2 entries lie strictly past the knee and every post-knee D2 is negative',
    holds: () => D2_ENTRIES_AFTER_KNEE >= 5 && POST_KNEE_ALL_NEGATIVE && POST_KNEE_COUNT >= 6,
  },
  {
    // (F2): the post-knee second differences decay MONOTONELY toward 0 from below (|D2| shrinks) --
    // a smooth saturation, so no second inflection hides just past the old truncation.
    id: 'imp95055-post-knee-d2-monotone-to-zero',
    description: 'post-knee |D2| strictly decreases toward 0 (concave arm never re-crosses zero)',
    holds: () => {
      for (let i = 1; i < POST_KNEE_D2.length; i++) {
        if (!(Math.abs(POST_KNEE_D2[i].d2) < Math.abs(POST_KNEE_D2[i - 1].d2))) return false;
      }
      return POST_KNEE_D2[POST_KNEE_D2.length - 1].d2 < 0;
    },
  },
  {
    // (F3): the extension does not move the steepest step (k=9) and the ladder keeps climbing toward
    // 1/2 from below (strictly increasing, all rungs under the far-tail asymptote).
    id: 'imp95055-steepest-k9-and-ladder-climbs-toward-half',
    description: 'steepest step stays k=9 and the extended ladder strictly increases below 1/2',
    holds: () => {
      if (STEEPEST_STEP_K !== 9) return false;
      for (let i = 1; i < P_EXT.length; i++) if (!(P_EXT[i] > P_EXT[i - 1])) return false;
      return P_EXT[P_EXT.length - 1] < 0.5;
    },
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp95055-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP95055_SIGMA_RAMP_KNEE_ENDPOINT_EXTENSION.isRigorous === false &&
      IMP95055_SIGMA_RAMP_KNEE_ENDPOINT_EXTENSION.farTailExponent === 0.5 &&
      /NO QED/.test(IMP95055_SIGMA_RAMP_KNEE_ENDPOINT_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP95055_SIGMA_RAMP_KNEE_ENDPOINT_EXTENSION.verdict),
  },
];

for (const a of IMP95055_SIGMA_RAMP_KNEE_ENDPOINT_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95055-sigma-ramp-knee-endpoint-extension assertion failed: ${a.id}`);
  }
}
