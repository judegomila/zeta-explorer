/**
 * @module imp-35116-krawczyk-headroom-delta-robustness
 *
 * imp-35116 (numerical, frontier): imp-34996 derived the N -> infinity contraction-validity headroom floor
 * S_inf = 1/(2 delta) = 2500 at the FIXED imp-34774/34776/34799 relative bracket half-width delta = 2e-4.
 * Since delta is a CHOSEN bracket half-width (not a physical constant), the 2500 floor is only as robust as
 * that choice. This module sweeps delta across a plausible range, confirms the closed form S_inf = 1/(2 delta)
 * reproduces the numerically-extrapolated far-tail floor S(1e300; delta) at EACH delta, and identifies the
 * delta at which the floor would fall to the 100x safety factor -- quantifying how much delta-headroom the
 * safety factor retains.
 *
 * THE FLOOR IS EXACTLY RECIPROCAL IN delta (S_inf . delta = 1/2 IS A delta-INVARIANT)
 * ---------------------------------------------------------------------------------
 * At N -> infinity the contraction factor a(N) -> 0 for ANY delta (T0 and u grow without bound and delta only
 * rescales N by 1-delta, a bounded factor), so G = 1 - a -> 1 and FP_LO = 1 - a(N(1-delta)) -> 1 regardless of
 * delta, and the headroom collapses to S_inf = G/((1+G) delta FP_LO) = 1/(2 delta). The product S_inf . delta
 * is therefore the delta-INDEPENDENT invariant 1/2: halving delta doubles the floor, and vice versa. A far-tail
 * probe at N = 1e300 reproduces 1/(2 delta) to machine precision at every delta on the sweep, confirming the
 * closed form is not an artifact of the specific delta = 2e-4.
 *
 * THE 100x SAFETY FACTOR IS REACHED ONLY AT delta = 1/200 = 5e-3 (25x THE ACTUAL delta)
 * ------------------------------------------------------------------------------------
 * S_inf = 100 <=> delta = 1/(2 . 100) = 5e-3. Since S_inf = 1/(2 delta) DECREASES in delta, the floor drops to
 * the 100x safety factor only when delta is WIDENED from the actual 2e-4 up to 5e-3 -- a factor of
 * 5e-3/2e-4 = 25x. So the bracket half-width would have to be chosen 25x WIDER than its actual value before the
 * asymptotic headroom exhausts the safety factor. This 25x delta-margin is the exact reciprocal image of the
 * 25x headroom-margin imp-34996 reported in S-space (S_inf/100 = 2500/100 = 25), as it must be under the
 * reciprocal law: the two 25x factors are the SAME margin viewed in delta-space vs S-space. The floor stays at
 * or above 100x for every delta <= 5e-3, i.e. across the entire tightening direction the bracket would ever be
 * driven (imp-34774/34776/34799 only ever SHRINK delta below 2e-4, never widen it), so the safety factor is
 * robust to any admissible re-choice of the bracket half-width.
 *
 * MEASUREMENT / EXTRAPOLATION ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; the derivation
 * rests on the SAME gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not the layer
 * itself. F(m) = 0 remains a double-precision artifact and the machine certificate imp-34714a REMAINS OPEN.
 * C_C = 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
 * K_a >= 0 untouched; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (the S_inf = 1/(2 delta) = 2500 floor at delta = 2e-4)
 * @see imp-35110-krawczyk-headroom-small-n-edge (the small-N edge of the same headroom; sub-100x is out-of-band)
 * @see imp-34929-krawczyk-headroom-monotonicity-derivative (closed-form dS/dN < 0; strictly decreasing S)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse; slope dN/dT0 = u/2pi)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34883/34906/34929/34949/34996)
const DELTA_ACTUAL = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width (imp-34996)
const SAFETY_FACTOR = 100; // the imp-34799/34817 contraction-validity safety factor
const FAR_TAIL_N = 1e300; // the imp-34996 far-tail probe where a(N) -> 0 (floor is pinned here)

// Local contraction factor a(N) = 2 pi K/(T0 u), identical to imp-34929/34949/34996.
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// star_over_H2(N; delta) = G/((1+G) delta FP_LO), the contraction-validity headroom (imp-34929), now with the
// bracket half-width delta made an EXPLICIT parameter so its robustness can be swept.
function headroomAt(N, delta) {
  const G = 1 - aOf(N);
  const FP_LO = 1 - aOf(N * (1 - delta));
  return G / ((1 + G) * delta * FP_LO);
}

// The exact N -> infinity closed-form floor as a function of delta: a -> 0 so G, FP_LO -> 1 and S -> 1/(2 delta).
const sInfClosedForm = (delta) => 1 / (2 * delta);

// delta at which the closed-form floor equals the 100x safety factor: 1/(2 delta) = 100 => delta = 1/200.
const DELTA_AT_SAFETY = 1 / (2 * SAFETY_FACTOR); // = 5e-3
const DELTA_MARGIN = DELTA_AT_SAFETY / DELTA_ACTUAL; // = 25 (how much WIDER delta must be to reach 100x)

// Sweep delta across a plausible log-spaced range spanning ~3 decades around the actual 2e-4, plus the two
// landmark points {actual 2e-4, safety-crossing 5e-3}. For each delta confirm the far-tail floor S(1e300; delta)
// reproduces the closed form 1/(2 delta) to machine precision (the reciprocal law is delta-robust).
const SWEEP_DELTAS = [1e-5, 2e-5, 5e-5, 1e-4, DELTA_ACTUAL, 5e-4, 1e-3, 2e-3, DELTA_AT_SAFETY, 1e-2];
const sweep = SWEEP_DELTAS.map((delta) => {
  const closed = sInfClosedForm(delta);
  const farTail = headroomAt(FAR_TAIL_N, delta);
  return {
    delta,
    s_inf_closed_form: +closed.toPrecision(10),
    s_far_tail_numeric: +farTail.toPrecision(10),
    s_inf_times_delta: +(closed * delta).toPrecision(10), // invariant 0.5
    rel_error_closed_vs_numeric: Math.abs(farTail - closed) / closed,
  };
});

// Verify the closed form matches the numeric far-tail floor at EVERY swept delta, and that S_inf . delta pins
// the 0.5 invariant, and that the floor is strictly decreasing in delta.
const MAX_REL_ERROR = Math.max(...sweep.map((r) => r.rel_error_closed_vs_numeric));
const MAX_INVARIANT_DEV = Math.max(...sweep.map((r) => Math.abs(r.s_inf_times_delta - 0.5)));
let FLOOR_STRICTLY_DECREASING_IN_DELTA = true;
for (let i = 1; i < sweep.length; i++) {
  if (!(sweep[i].s_far_tail_numeric < sweep[i - 1].s_far_tail_numeric)) FLOOR_STRICTLY_DECREASING_IN_DELTA = false;
}

// Landmark readouts at the actual delta and the safety-crossing delta.
const S_INF_AT_ACTUAL = sInfClosedForm(DELTA_ACTUAL); // = 2500
const S_INF_AT_SAFETY_DELTA = sInfClosedForm(DELTA_AT_SAFETY); // = 100
const S_SPACE_MARGIN = S_INF_AT_ACTUAL / SAFETY_FACTOR; // = 25 (same 25x, reciprocal image of DELTA_MARGIN)

export const IMP35116_KRAWCZYK_HEADROOM_DELTA_ROBUSTNESS = {
  id: 'imp-35116',
  proofSection: 'S-frontier',
  question:
    'imp-34996 derived the N -> infinity headroom floor S_inf = 1/(2 delta) = 2500 at the FIXED bracket ' +
    'half-width delta = 2e-4. Since delta is a chosen quantity, how robust is the 2500 floor to that choice? ' +
    'Sweep delta, confirm the closed form S_inf = 1/(2 delta) reproduces the numerically-extrapolated far-tail ' +
    'floor at each delta, and identify the delta at which the floor would fall to the 100x safety factor. ' +
    'Measurement on the surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  derivation: {
    reciprocalLawIsDeltaRobust:
      'At N -> infinity, a(N) -> 0 for ANY delta (delta rescales N only by the bounded factor 1-delta), so ' +
      'G, FP_LO -> 1 and S_inf = G/((1+G) delta FP_LO) = 1/(2 delta) regardless of delta. The product ' +
      'S_inf . delta = 1/2 is a delta-INVARIANT: halving delta doubles the floor.',
    numericConfirmsClosedForm:
      'A far-tail probe at N = 1e300 reproduces the closed form 1/(2 delta) to machine precision at every ' +
      'delta on the log-spaced sweep across ~3 decades around 2e-4, so the 2500 floor is not an artifact of ' +
      'the specific delta = 2e-4.',
    safetyCrossingDelta:
      'S_inf = 100 <=> delta = 1/(2 . 100) = 5e-3. Since S_inf decreases in delta, the floor reaches the 100x ' +
      'safety factor only when delta is WIDENED from 2e-4 to 5e-3 -- a factor of 25x. The bracket is only ever ' +
      'tightened (delta shrunk) below 2e-4, so the floor only RISES in the operative direction.',
    marginIsReciprocalImage:
      'The 25x delta-margin (5e-3/2e-4) is the reciprocal image of the 25x S-space margin imp-34996 reported ' +
      '(2500/100): under S_inf = 1/(2 delta) the two are the SAME margin viewed in delta-space vs S-space.',
  },
  constants: {
    delta_actual: DELTA_ACTUAL, // 2e-4
    safety_factor: SAFETY_FACTOR, // 100
    far_tail_N: FAR_TAIL_N, // 1e300
    sweep_delta_count: SWEEP_DELTAS.length, // 10
    delta_at_safety_crossing: DELTA_AT_SAFETY, // 5e-3 = 1/200
  },
  measurement: {
    s_inf_at_actual_delta: +S_INF_AT_ACTUAL.toFixed(4), // 2500.0000 = 1/(2 . 2e-4)
    s_inf_at_safety_crossing_delta: +S_INF_AT_SAFETY_DELTA.toFixed(4), // 100.0000 = 1/(2 . 5e-3)
    delta_margin_to_safety_factor: +DELTA_MARGIN.toFixed(4), // 25.0000 (delta must widen 25x to reach 100x)
    s_space_margin_to_safety_factor: +S_SPACE_MARGIN.toFixed(4), // 25.0000 (reciprocal image, same margin)
    max_rel_error_closed_vs_numeric: +MAX_REL_ERROR.toExponential(3), // ~1e-16 (closed form pins the far tail)
    max_deviation_of_s_inf_times_delta_from_half: +MAX_INVARIANT_DEV.toExponential(3), // ~0 (invariant holds)
    floor_strictly_decreasing_in_delta: FLOOR_STRICTLY_DECREASING_IN_DELTA, // true (reciprocal law)
    sweep,
  },
  finding:
    'The imp-34996 asymptotic headroom floor S_inf = 1/(2 delta) is EXACTLY reciprocal in the bracket ' +
    'half-width delta, and this reciprocal law is delta-robust: a far-tail probe at N = 1e300 reproduces ' +
    '1/(2 delta) to machine precision (max relative error ~1e-16) at every delta on a 10-point log-spaced sweep ' +
    'across ~3 decades around 2e-4, and the invariant S_inf . delta = 1/2 holds to ~0 deviation. The floor is ' +
    'strictly decreasing in delta, so it falls to the 100x safety factor ONLY at delta = 1/200 = 5e-3, i.e. ' +
    'the bracket half-width would have to be chosen 25x WIDER than its actual 2e-4 before the asymptotic ' +
    'headroom exhausts the safety factor. This 25x delta-margin is the reciprocal image of the 25x S-space ' +
    'margin imp-34996 reported (2500/100). Because the imp-34774/34776/34799 bracket is only ever TIGHTENED ' +
    '(delta shrunk below 2e-4), the floor only RISES in the operative direction, so the safety factor is robust ' +
    'to any admissible re-choice of delta. EVIDENCE the surrogate safety factor is delta-robust; NOT a machine ' +
    'certificate.',
  subGap:
    'imp-34714a REMAINS OPEN. Confirming the S_inf = 1/(2 delta) floor is delta-robust and quantifying the 25x ' +
    'delta-margin to the 100x safety factor does NOT prove a directed-rounding [g](m)/[F-prime] evaluation ' +
    'yields valid enclosures at any delta: S rests on the gamma(n)/k eps surrogate models of the imp-34687a ' +
    'directed-rounding layer, not that layer, and F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM FLOOR delta-ROBUSTNESS (frontier, NOT an RH bound). imp-34996 derived the N -> infinity ' +
    'headroom floor S_inf = 1/(2 delta) = 2500 at the FIXED bracket half-width delta = 2e-4 but never tested ' +
    'the floor for delta-robustness. This module sweeps delta across ~3 decades and confirms the closed form ' +
    'S_inf = 1/(2 delta) reproduces the numerically-extrapolated far-tail floor S(1e300; delta) to machine ' +
    'precision at every delta (max rel error ~1e-16), with the invariant S_inf . delta = 1/2 holding exactly. ' +
    'The floor is strictly decreasing in delta and reaches the 100x safety factor only at delta = 1/200 = 5e-3 ' +
    '-- 25x WIDER than the actual 2e-4 -- so the bracket half-width would have to be widened 25x before the ' +
    'asymptotic headroom exhausts the safety factor (the reciprocal image of the 25x S-space margin). Since the ' +
    'bracket is only ever tightened below 2e-4, the floor only rises in the operative direction: the safety ' +
    'factor is robust to any admissible re-choice of delta. EVIDENCE, NOT a machine certificate. SUB-GAP ' +
    'imp-34714a REMAINS OPEN: S rests on the gamma(n)/k eps surrogate models, not the imp-34687a ' +
    'directed-rounding layer, and F(m) = 0 remains a double-precision artifact. Measurement only on the ' +
    'inherited imp-3220/imp-3406 surrogate crossover map; reproduces the imp-34996 2500 floor at delta = 2e-4; ' +
    'the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34996 (S_inf = 1/(2 delta) = 2500 floor at delta = 2e-4); imp-35110 (small-N edge of the same ' +
    'headroom); imp-34929 (closed-form dS/dN < 0, strictly decreasing S); imp-34799 ((H2)-margin ceiling ' +
    'n_op^max = delta FP_LO/eps); imp-34774/34776 (relative bracket half-width delta); imp-33723 (Banach map ' +
    'g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM ' +
    'inverse). Reciprocal of a linear form: standard.',
};

export const IMP35116_KRAWCZYK_HEADROOM_DELTA_ROBUSTNESS_ASSERTIONS = [
  {
    // The closed form 1/(2 delta) reproduces the numeric far-tail floor at every swept delta to machine precision.
    id: 'imp35116-closed-form-reproduces-far-tail-at-every-delta',
    description: 'S_inf = 1/(2 delta) matches the numeric far-tail floor S(1e300; delta) at every swept delta',
    holds: () => MAX_REL_ERROR < 1e-9,
  },
  {
    // S_inf . delta = 1/2 is a delta-invariant (the reciprocal law), and the floor decreases strictly in delta.
    id: 'imp35116-s-inf-times-delta-is-one-half-invariant',
    description: 'the product S_inf . delta pins the 0.5 invariant and the floor is strictly decreasing in delta',
    holds: () => MAX_INVARIANT_DEV < 1e-9 && FLOOR_STRICTLY_DECREASING_IN_DELTA === true,
  },
  {
    // The floor reaches 100x exactly at delta = 5e-3, which is 25x the actual delta = 2e-4.
    id: 'imp35116-safety-crossing-delta-is-twenty-five-x-actual',
    description: 'the floor reaches the 100x safety factor at delta = 5e-3 = 25x the actual delta = 2e-4',
    holds: () =>
      Math.abs(DELTA_AT_SAFETY - 5e-3) < 1e-12 &&
      Math.abs(sInfClosedForm(DELTA_AT_SAFETY) - 100) < 1e-9 &&
      Math.abs(DELTA_MARGIN - 25) < 1e-9,
  },
  {
    // The delta-space margin equals the S-space margin imp-34996 reported (25x), the reciprocal image.
    id: 'imp35116-delta-margin-is-reciprocal-image-of-s-margin',
    description: 'the 25x delta-margin equals the 25x S-space margin imp-34996 reported (reciprocal image)',
    holds: () =>
      Math.abs(DELTA_MARGIN - S_SPACE_MARGIN) < 1e-9 &&
      Math.abs(S_INF_AT_ACTUAL - 2500) < 1e-9,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35116-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35116_KRAWCZYK_HEADROOM_DELTA_ROBUSTNESS.isRigorous === false &&
      /imp-34714a/.test(IMP35116_KRAWCZYK_HEADROOM_DELTA_ROBUSTNESS.subGap) &&
      /REMAINS OPEN/.test(IMP35116_KRAWCZYK_HEADROOM_DELTA_ROBUSTNESS.subGap) &&
      /NO QED/.test(IMP35116_KRAWCZYK_HEADROOM_DELTA_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP35116_KRAWCZYK_HEADROOM_DELTA_ROBUSTNESS.verdict),
  },
];

for (const a of IMP35116_KRAWCZYK_HEADROOM_DELTA_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35116-krawczyk-headroom-delta-robustness assertion failed: ${a.id}`);
  }
}
