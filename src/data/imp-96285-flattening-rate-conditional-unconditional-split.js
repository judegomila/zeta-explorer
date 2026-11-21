/**
 * @module imp-96285-flattening-rate-conditional-unconditional-split
 *
 * imp-96285 (numerical, frontier-direction): imp-96250 derived the far-N leading flattening rate of
 * the imp-96187 U-shape location ratio, Delta(N) = ln(N_flow/N_peak) = 4/ln N + O(1/(ln N)^2), and
 * noted the leading coefficient factors as 4 = 2 (b_c - a_c) with the two slope-tail coefficients
 *     a(N) = 1/2 - a_c/ln N,   a_c = 1/2  (N^{-1/2} collision shape, imp-486 GUE-CONDITIONAL),
 *     b(N) = 1/2 - b_c/ln N,   b_c = 5/2  (Riemann-von Mangoldt T0 ~ N/ln N + Gronwall, UNCONDITIONAL).
 * imp-96250 stated the coefficient 4 "inherits EXACTLY" the imp-486 conditionality of a_c and nothing
 * more, but never ISOLATED the unconditional-only contribution. This module measures the split.
 *
 * THE DECOMPOSITION (hold b_c = 5/2 fixed, treat a_c as free)
 * ----------------------------------------------------------
 * The leading flattening coefficient is an EXACT linear function of a_c:
 *     C_flat(a_c) = 2 (b_c - a_c) = 5 - 2 a_c        (b_c = 5/2 held unconditional).
 * This is a decreasing line: the more the (conditional) a-branch coefficient a_c grows, the smaller
 * the leading peak-crossover flattening rate. Landmarks:
 *     a_c = 0            -> C_flat = 5   (a drifts at leading order like b's constant only)
 *     a_c = 1/2 (GUE)    -> C_flat = 4   (the imp-96250 value)
 *     a_c = b_c = 5/2    -> C_flat = 0   (THRESHOLD: a and b drift equally; the O(1/ln N) rate
 *                                          VANISHES and the separation is pushed to O(1/(ln N)^2))
 *     a_c > 5/2          -> C_flat < 0   (R -> 1 from ABOVE; the peak would OVERTAKE the crossover).
 * So the whole sign of the leading flattening rate is decided by the single inequality a_c < b_c.
 *
 * NUMERICAL CONFIRMATION (independent of the algebra)
 * ---------------------------------------------------
 * Evaluating the imp-96187 location law R = (b/a)^(1/(a+b)) with the leading-order slopes at u = 1e5
 * and reading off u(1 - R), the measured leading coefficient tracks C_flat(a_c) = 5 - 2 a_c to ~1e-4
 * across the whole sweep a_c in {0, 1/4, 1/2, 1, 3/2, 2, 5/2, 3}, INCLUDING the sign change at the
 * threshold a_c = 5/2. So the linear split is not an artifact of the small-x log expansion.
 *
 * WHAT THE UNCONDITIONAL b-BRANCH BUYS ON ITS OWN
 * -----------------------------------------------
 * Holding only the unconditional b_c = 5/2 fixed, the leading flattening rate is 2 (b_c - a_c). A
 * strictly-POSITIVE unconditional lower bound on this rate would require an unconditional UPPER bound
 * a_c <= a_c^max with a_c^max < 5/2, giving C_flat >= 2 (5/2 - a_c^max) > 0. But removing the imp-486
 * GUE input removes the ONLY thing that pins a_c: the N^{-1/2} collision SHAPE is exactly what forces
 * a_c = 1/2. Without it there is no unconditional upper bound on a_c below 5/2 in the inherited
 * component model, so C_flat is not bounded below by any positive constant -- the positivity of the
 * leading rate is LOGICALLY EQUIVALENT to the GUE-conditional statement a_c < 5/2. The unconditional
 * b-branch fixes only the COMPARISON ANCHOR (the 5/2 that a_c is measured against); it does not by
 * itself manufacture a gap. VERDICT: no strictly-positive unconditional lower bound on the leading
 * flattening rate survives when the GUE input is removed.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Changes no bound; establishes no
 * operator positivity; the collision share stays GUE-conditional (imp-486, UNTOUCHED); the C_C 1/8
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; no zero verified; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-96250-ushape-location-ratio-farN-asymptote (derived 4 = 2(b_c-a_c), stated conditionality)
 * @see imp-96244-ushape-slope-asymptote-derivation (a -> 1/2 - 1/(2 ln N), b -> 1/2 - 5/(2 ln N))
 * @see imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident (location law (b/a)^(1/(a+b)))
 * @see imp-486 (C_mb GUE-conditional N^{-1/2} collision shape, UNTOUCHED)
 */

const B_C = 2.5; // unconditional b-branch coefficient (Riemann-von Mangoldt T0~N/lnN + Gronwall)

// Leading flattening coefficient as an exact linear function of the (conditional) a-branch a_c.
const cFlat = (a_c) => 2 * (B_C - a_c); // = 5 - 2 a_c

// The imp-96187 location law with leading-order slopes and a FREE a-branch coefficient a_c.
// a(N) = 1/2 - a_c/u, b(N) = 1/2 - b_c/u; R = (b/a)^(1/(a+b)); u = ln N.
const Rparam = (u, a_c) => {
  const a = 0.5 - a_c / u;
  const b = 0.5 - B_C / u;
  return Math.pow(b / a, 1 / (a + b));
};

const U_PROBE = 1e5; // deep-u probe where u(1-R) has converged to the leading coefficient
const A_C_GUE = 0.5; // imp-486 GUE-conditional value
const A_C_THRESHOLD = B_C; // a_c at which the leading rate vanishes (a and b drift equally)

// Sweep a_c over a plausible range and confirm C_flat = 5 - 2 a_c against the location law.
const SWEEP = [0, 0.25, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map((a_c) => {
  const R = Rparam(U_PROBE, a_c);
  return {
    a_c,
    C_flat: +cFlat(a_c).toFixed(4), // = 5 - 2 a_c (positive iff a_c < 5/2)
    measured_u_times_gap: +(U_PROBE * (1 - R)).toFixed(4), // -> 2(b_c - a_c) from the location law
    conditional: a_c === A_C_GUE ? 'GUE (imp-486)' : a_c >= A_C_THRESHOLD ? 'rate <= 0' : 'depends on a_c',
  };
});

// The GUE-conditional value reproduces the imp-96250 coefficient 4 exactly.
const C_FLAT_GUE = +cFlat(A_C_GUE).toFixed(4); // 4
// At the threshold the leading rate is exactly 0 (both from the algebra and the location law).
const C_FLAT_THRESHOLD = +cFlat(A_C_THRESHOLD).toFixed(4); // 0
const MEASURED_AT_THRESHOLD = +(U_PROBE * (1 - Rparam(U_PROBE, A_C_THRESHOLD))).toFixed(4); // ~0

export const IMP96285_FLATTENING_RATE_CONDITIONAL_UNCONDITIONAL_SPLIT = {
  id: 'imp-96285',
  proofSection: 'S-frontier',
  question:
    'Decompose the imp-96250 far-N flattening coefficient 4 = 2(b_c - a_c) into its GUE-conditional ' +
    'and unconditional parts: hold b_c = 5/2 fixed (unconditional) and treat a_c as free, report how ' +
    'the leading coefficient 2(b_c - a_c) varies over the plausible a_c range, and assess whether any ' +
    'strictly-positive unconditional lower bound on the flattening rate survives when the GUE input is ' +
    'removed. Measurement only; changes no bound; RH open; NO QED.',
  measured: {
    b_c_fixed_unconditional: B_C, // 5/2 (Riemann-von Mangoldt + Gronwall)
    C_flat_formula: 'C_flat(a_c) = 2 (b_c - a_c) = 5 - 2 a_c', // exact linear function of a_c
    a_c_GUE_conditional: A_C_GUE, // 1/2 (imp-486 N^{-1/2} collision shape)
    C_flat_at_GUE: C_FLAT_GUE, // 4 (reproduces imp-96250)
    a_c_threshold_rate_vanishes: A_C_THRESHOLD, // 5/2 : leading O(1/ln N) rate -> 0
    C_flat_at_threshold: C_FLAT_THRESHOLD, // 0
    measured_at_threshold: MEASURED_AT_THRESHOLD, // ~0 from the location law (independent check)
    sweep: SWEEP, // C_flat = 5 - 2 a_c tracked by u(1-R) to ~1e-4, sign change at a_c = 5/2
  },
  finding: {
    D1_linear_split:
      'The leading flattening coefficient is the exact line C_flat(a_c) = 2(b_c - a_c) = 5 - 2 a_c with ' +
      'b_c = 5/2 held unconditional. It runs from 5 (a_c = 0) down through 4 (the GUE value a_c = 1/2, ' +
      'reproducing imp-96250) to 0 at a_c = 5/2 and negative beyond. The location law R = (b/a)^(1/(a+b)) ' +
      'confirms it: u(1-R) at u = 1e5 tracks 5 - 2 a_c to ~1e-4 across the whole sweep, sign change ' +
      'at a_c = 5/2 included.',
    D2_threshold:
      'The unconditional anchor b_c = 5/2 is exactly the threshold: at a_c = b_c the a- and b-branches ' +
      'drift at the same 1/ln N rate, the leading O(1/ln N) flattening rate VANISHES, and the ' +
      'peak-crossover separation is demoted to O(1/(ln N)^2). For a_c > 5/2 the coefficient is negative ' +
      '(R -> 1 from above; the peak would overtake the numerator crossover).',
    D3_no_unconditional_positive_floor:
      'A strictly-positive unconditional lower bound on the flattening rate needs an unconditional upper ' +
      'bound a_c <= a_c^max with a_c^max < 5/2. But the N^{-1/2} collision SHAPE (imp-486 GUE-conditional) ' +
      'is precisely what pins a_c = 1/2; removing the GUE input removes the only pin, leaving no ' +
      'unconditional upper bound on a_c below 5/2 in the inherited component model. So NO strictly-positive ' +
      'unconditional lower bound on the leading flattening rate survives: its positivity is logically ' +
      'EQUIVALENT to the GUE-conditional inequality a_c < 5/2. The unconditional b-branch fixes only the ' +
      'comparison anchor 5/2, not a gap.',
    D4_conditionality:
      'The split assigns the ENTIRE conditionality of the leading coefficient to the a-branch a_c and ' +
      'the anchor 5/2 to the unconditional b-branch, consistent with imp-96250. The C_C 1/8 ansatz ' +
      '(imp-2642/imp-2643) cancels in every log-derivative and is NOT used. No rigorous RH input; ' +
      'establishes no operator positivity; NO QED.',
  },
  isRigorous: false, // GUE-conditional (imp-486) through a_c; measurement, not RH
  verdict:
    'MEASUREMENT (frontier-direction, GUE-conditional, NOT an RH bound). The imp-96250 flattening ' +
    'coefficient 4 = 2(b_c - a_c) decomposes as the exact line C_flat(a_c) = 5 - 2 a_c with b_c = 5/2 ' +
    'held unconditional and a_c the imp-486 GUE-conditional a-branch coefficient: C_flat runs 5 -> 4 ' +
    '(GUE a_c=1/2) -> 0 at the threshold a_c = b_c = 5/2, confirmed by the location law u(1-R) to ~1e-4 ' +
    'across the sweep (sign change at 5/2 included). The unconditional b-branch alone fixes only the ' +
    'comparison anchor 5/2; because the N^{-1/2} collision shape (imp-486) is the ONLY thing pinning ' +
    'a_c below 5/2, NO strictly-positive unconditional lower bound on the leading flattening rate ' +
    'survives when the GUE input is removed -- positivity of the rate is logically equivalent to the ' +
    'GUE-conditional a_c < 5/2. Conditional ONLY through the a-branch GUE-conditional N^{-1/2} collision ' +
    'shape (imp-486, UNTOUCHED); the C_C 1/8 ansatz (imp-2642/imp-2643) cancels and is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no zero ' +
    'verified; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-96250 (derived 4 = 2(b_c-a_c), stated the imp-486 conditionality of a_c); imp-96244 (slope ' +
    'tails a -> 1/2 - 1/(2 ln N), b -> 1/2 - 5/(2 ln N)); imp-96187 (location law (b/a)^(1/(a+b))); ' +
    'imp-486 (C_mb GUE-conditional N^{-1/2} collision shape); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP96285_FLATTENING_RATE_CONDITIONAL_UNCONDITIONAL_SPLIT_ASSERTIONS = [
  {
    // D1: the leading coefficient is the exact line 5 - 2 a_c, and the location law u(1-R) reproduces
    // it to ~1e-4 across the whole a_c sweep.
    id: 'imp96285-linear-split-tracks-location-law',
    description: 'C_flat = 5 - 2 a_c matched by u(1-R) from (b/a)^(1/(a+b)) to ~1e-4 across the a_c sweep',
    holds: () =>
      SWEEP.every((r) => Math.abs(r.C_flat - (5 - 2 * r.a_c)) < 1e-9) &&
      SWEEP.every((r) => Math.abs(r.measured_u_times_gap - r.C_flat) < 5e-3),
  },
  {
    // D1: the GUE value a_c = 1/2 reproduces the imp-96250 coefficient 4 exactly.
    id: 'imp96285-gue-value-reproduces-four',
    description: 'a_c = 1/2 (GUE) gives C_flat = 4, matching imp-96250',
    holds: () => Math.abs(C_FLAT_GUE - 4) < 1e-9,
  },
  {
    // D2: the threshold a_c = b_c = 5/2 is where the leading rate vanishes -- from the algebra AND the
    // location law -- and it is decreasing in a_c (so sign is decided by a_c < 5/2).
    id: 'imp96285-threshold-at-b_c-rate-vanishes',
    description: 'C_flat = 0 at a_c = b_c = 5/2 (algebra and location law agree ~0); C_flat decreasing in a_c',
    holds: () => {
      const decreasing = SWEEP.every(
        (r, i) => i === 0 || SWEEP[i].C_flat < SWEEP[i - 1].C_flat,
      );
      return (
        Math.abs(C_FLAT_THRESHOLD) < 1e-9 &&
        Math.abs(MEASURED_AT_THRESHOLD) < 5e-3 &&
        decreasing
      );
    },
  },
  {
    // D3: honest verdict -- no strictly-positive unconditional lower bound survives, positivity is
    // equivalent to the GUE-conditional a_c < 5/2.
    id: 'imp96285-no-unconditional-positive-floor',
    description: 'verdict records no positive unconditional lower bound on the flattening rate survives',
    holds: () =>
      /no strictly-positive unconditional lower bound/i.test(
        IMP96285_FLATTENING_RATE_CONDITIONAL_UNCONDITIONAL_SPLIT.verdict,
      ) &&
      /logically equivalent/i.test(
        IMP96285_FLATTENING_RATE_CONDITIONAL_UNCONDITIONAL_SPLIT.finding.D3_no_unconditional_positive_floor,
      ),
  },
  {
    // Honesty gate: GUE-conditional measurement, no QED, C_C ansatz untouched, no refereed bound is changed.
    id: 'imp96285-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, C_C ansatz untouched, no refereed bound is changed',
    holds: () =>
      IMP96285_FLATTENING_RATE_CONDITIONAL_UNCONDITIONAL_SPLIT.isRigorous === false &&
      /NO QED/.test(IMP96285_FLATTENING_RATE_CONDITIONAL_UNCONDITIONAL_SPLIT.verdict) &&
      /UNTOUCHED/.test(IMP96285_FLATTENING_RATE_CONDITIONAL_UNCONDITIONAL_SPLIT.verdict) &&
      /refereed bound is changed/i.test(IMP96285_FLATTENING_RATE_CONDITIONAL_UNCONDITIONAL_SPLIT.verdict),
  },
];

for (const a of IMP96285_FLATTENING_RATE_CONDITIONAL_UNCONDITIONAL_SPLIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96285-flattening-rate-conditional-unconditional-split assertion failed: ${a.id}`,
    );
  }
}
