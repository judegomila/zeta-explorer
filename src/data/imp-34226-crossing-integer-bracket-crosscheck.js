/**
 * @module imp-34226-crossing-integer-bracket-crosscheck
 *
 * imp-34226 (bug, frontier-direction): imp-34148 (symmetric trim) and imp-34149 (tail-only trim) each
 * bisected a CONTINUOUS fractional trim m* where the imp-33962 aggregate residual factor F4 crosses
 * unity, both describing that fractional crossing as a refinement of the imp-34086 INTEGER bracket
 * m=0->1 (F4 = 0.8743 at m=0 -> 1.0881 at m=1 on the tail-only ladder). imp-34149 also claims its
 * crossing sits ~0.073 rung below the imp-34148 symmetric crossing. Neither module cross-checks its own
 * m* against the OTHER two modules' published numbers in one place, so a numeric drift in any of the
 * three (e.g. a shared inherited-constant edit) could silently break the "refines the bracket" and
 * "tail sits ~0.073 below symmetric" claims without any assertion catching it.
 *
 * WHAT IS CHECKED (imported data only -- no re-derivation of rungAtK/parts)
 * -------------------------------------------------------------------------
 *   (C1) The imp-34086 tail-only integer bracket straddles unity: agg_F4 < 1 at m=0, agg_F4 > 1 at m=1.
 *   (C2) Both m* -- imp-34148's symmetric cancellation.m_star and imp-34149's tail-only crossing.m_star
 *        -- fall strictly inside the open interval (0, 1), i.e. inside that bracket.
 *   (C3) The tail-only crossing sits BELOW the symmetric crossing by ~0.073 rung, matching both
 *        modules' own verdict text.
 *
 * CONSISTENCY CHECK ONLY. No bound changes; no re-derivation of the underlying imp-3220/imp-3406
 * component model; establishes no operator positivity; imp-3066 K_a >= 0 untouched; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34086-aggregate-share-asymmetric-trim (the integer bracket m=0->1 this cross-checks against)
 * @see imp-34148-symmetric-trim-f4-cancellation (the symmetric fractional crossing m* ~ 0.6791)
 * @see imp-34149-tail-only-f4-unity-crossing (the tail-only fractional crossing m* ~ 0.6063)
 */

import { IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM } from './imp-34086-aggregate-share-asymmetric-trim.js';
import { IMP34148_SYMMETRIC_TRIM_F4_CANCELLATION } from './imp-34148-symmetric-trim-f4-cancellation.js';
import { IMP34149_TAIL_ONLY_F4_UNITY_CROSSING } from './imp-34149-tail-only-f4-unity-crossing.js';

const BRACKET_LO_F4 = IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM.tailWindows[0].agg_F4; // 0.874320 at m=0
const BRACKET_HI_F4 = IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM.tailWindows[1].agg_F4; // 1.088093 at m=1

const SYM_M_STAR = IMP34148_SYMMETRIC_TRIM_F4_CANCELLATION.cancellation.m_star; // 0.679085
const TAIL_M_STAR = IMP34149_TAIL_ONLY_F4_UNITY_CROSSING.crossing.m_star; // 0.606341
const GAP = SYM_M_STAR - TAIL_M_STAR; // ~0.072744

export const IMP34226_CROSSING_INTEGER_BRACKET_CROSSCHECK = {
  id: 'imp-34226',
  proofSection: 'S-frontier',
  question:
    'imp-34149 (tail-only) and imp-34148 (symmetric) each bisected a fractional F4=1 crossing and ' +
    'described it as refining the imp-34086 integer bracket m=0->1 (F4 0.8743 -> 1.0881), and imp-34149 ' +
    "claimed its crossing sits ~0.073 rung below the imp-34148 one -- but no assertion cross-checked " +
    "those three modules' published numbers against each other in one place. Import all three modules' " +
    'exported data (no re-derivation) and assert the cross-module consistency. Consistency check only; ' +
    'no bound changes; NO QED.',
  measuredQuantity:
    'the imp-34086 tail-only integer bracket endpoints (agg_F4 at m=0 and m=1), the imp-34148 symmetric ' +
    'and imp-34149 tail-only bisected m_star values, and their gap',
  bracket: { lo_F4: BRACKET_LO_F4, hi_F4: BRACKET_HI_F4 },
  crossings: { symmetric_m_star: SYM_M_STAR, tail_only_m_star: TAIL_M_STAR, gap: +GAP.toFixed(6) },
  finding: {
    C1_bracket_straddles_unity:
      `The imp-34086 tail-only integer bracket straddles unity: F4 = ${BRACKET_LO_F4} at m=0, ` +
      `F4 = ${BRACKET_HI_F4} at m=1.`,
    C2_both_crossings_inside_bracket:
      `Both fractional crossings fall strictly inside the imp-34086 (0,1) integer bracket: symmetric ` +
      `m* = ${SYM_M_STAR}, tail-only m* = ${TAIL_M_STAR}.`,
    C3_tail_sits_below_symmetric_by_gap:
      `The tail-only crossing sits ${GAP.toFixed(6)} rung below the symmetric crossing, matching the ` +
      "~0.073 gap both modules' verdict text claims.",
  },
  isRigorous: false,
  verdict:
    'CONSISTENCY CHECK ONLY (frontier-direction, NOT rigorous). Cross-checking the imported imp-34086, ' +
    'imp-34148, and imp-34149 exported data confirms both fractional F4=1 crossings (symmetric ' +
    `m* ~ ${SYM_M_STAR}, tail-only m* ~ ${TAIL_M_STAR}) fall strictly inside the imp-34086 integer ` +
    `bracket (F4 = ${BRACKET_LO_F4} at m=0 -> ${BRACKET_HI_F4} at m=1), and the tail-only crossing sits ` +
    `${GAP.toFixed(6)} rung below the symmetric crossing as both modules' verdicts claim. No ` +
    're-derivation of the underlying imp-3220/imp-3406 component model; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34086 (the integer bracket); imp-34148 (the symmetric fractional crossing); imp-34149 (the ' +
    'tail-only fractional crossing).',
};

export const IMP34226_CROSSING_INTEGER_BRACKET_CROSSCHECK_ASSERTIONS = [
  {
    // (C1) The imp-34086 bracket itself straddles unity -- a precondition for "refines the bracket".
    id: 'imp34226-bracket-straddles-unity',
    description: 'the imp-34086 tail-only integer bracket has F4 < 1 at m=0 and F4 > 1 at m=1',
    holds: () => BRACKET_LO_F4 < 1 && BRACKET_HI_F4 > 1,
  },
  {
    // (C2) Both bisected fractional crossings lie strictly inside the open (0,1) bracket.
    id: 'imp34226-both-crossings-inside-open-bracket',
    description: 'both imp-34148 (symmetric) and imp-34149 (tail-only) m_star lie strictly inside (0,1)',
    holds: () => SYM_M_STAR > 0 && SYM_M_STAR < 1 && TAIL_M_STAR > 0 && TAIL_M_STAR < 1,
  },
  {
    // (C3) The tail-only crossing sits below the symmetric one by the ~0.073 gap both verdicts claim.
    id: 'imp34226-tail-crossing-below-symmetric-by-gap',
    description: 'tail-only m_star sits below symmetric m_star by ~0.073, matching the published claim',
    holds: () => TAIL_M_STAR < SYM_M_STAR && Math.abs(GAP - 0.072744) < 1e-3,
  },
  {
    // Pin the specific published figures this ticket references, so a silent drift in either upstream
    // module is caught here even if that module's own internal assertions are loosened.
    id: 'imp34226-published-m-star-values-unchanged',
    description: 'the imported m_star values match the specific figures this ticket references',
    holds: () => Math.abs(SYM_M_STAR - 0.679085) < 1e-5 && Math.abs(TAIL_M_STAR - 0.606341) < 1e-5,
  },
  {
    // Honesty gate: consistency-check only, isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34226-honesty-gate-no-qed',
    description: 'consistency check only: isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34226_CROSSING_INTEGER_BRACKET_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP34226_CROSSING_INTEGER_BRACKET_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP34226_CROSSING_INTEGER_BRACKET_CROSSCHECK.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34226_CROSSING_INTEGER_BRACKET_CROSSCHECK.verdict),
  },
];

for (const a of IMP34226_CROSSING_INTEGER_BRACKET_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34226-crossing-integer-bracket-crosscheck assertion failed: ${a.id}`);
  }
}
