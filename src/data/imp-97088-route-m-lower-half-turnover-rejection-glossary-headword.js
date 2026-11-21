/**
 * @module imp-97088-route-m-lower-half-turnover-rejection-glossary-headword
 * @fileoverview imp-97088 -- import-light glossary/Concepts headword for the imp-97054 DIRECTION
 *   ANALYSIS: for the Route M concave-quad ||G||_F ceiling turnover, it is the LOWER half of a
 *   two-sided Int(N) = Theta(log N) law that does the rejecting -- NOT the upper half, contrary to
 *   the intuition (repeated by imp-97016/imp-97033) that "the proven one-sided [upper] interior norm
 *   asymptotic" is the rung-free route to reject the turnover.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97033 named imp-96750's one-sided UPPER bound Int(N) <= s* log N as the rung-free route to
 *   reject the concave-quad turnover. imp-97054's direction analysis shows that framing picks the
 *   WRONG half: a concave (c2<0) turnover satisfies the upper bound trivially (the fitted norm
 *   decreases past its peak, so Int_model stays under any upper ceiling) -- it is only a LOWER bound
 *   Int(N) >= s_lo log N that a turnover violates, because a lower bound forces ||G||_F to keep
 *   growing without bound. This headword bakes that direction verdict verbatim (no re-import of
 *   imp-97054) so a reader does not carry over the "upper bound suffices" intuition when the object
 *   in question is a TURNOVER (concave) rather than unbounded (convex) growth.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Given a two-sided law s_lo x - O(1) <= Q(b) <= s* x + O(1) (x = log N after the imp-96708 H2
 *   transfer), which half kills a nonzero quadratic curvature term c2 in the fitted
 *   ||G||_F(x) ~ c0 + c1 x + c2 x^2 depends on the SIGN of c2:
 *     - c2 > 0 (convex, super-log growth): Int_model ~ c2^2 x^4 eventually EXCEEDS any fixed upper
 *       ceiling s* x, so the UPPER half is what forces c2 = 0.
 *     - c2 < 0 (concave TURNOVER, the Route M measured case, c2 = -0.01623): past the turnover peak
 *       (x_peak ~ 22.1) the fitted norm DECREASES, so Int_model decreases too and never threatens the
 *       upper bound -- the upper half is silent. What it DOES violate is a positive LOWER bound
 *       Int >= s_lo x, which forces ||G||_F -> infinity and forbids the norm turning over at all.
 *   So for THIS turnover, the operative ingredient is the LOWER companion of the imp-96750 uniform
 *   lemma, not the upper one imp-96750 itself reduced -- the reverse of what "the proven one-sided
 *   asymptotic suffices" suggests. And rejection is cheap in the constant: any s_lo > 0 forbids the
 *   turnover, so the exact slope value is irrelevant -- only the SIGN matters.
 *
 *   STATUS: a direction-of-inequality clarification over already-committed findings (imp-97054), not
 *   a new proof. Neither half of the two-sided law is established (imp-96750's upper half is only
 *   reduced; imp-97054's lower half is unestablished; imp-97071 further reduces the lower half to a
 *   first-moment bound with kappa ~ 0.696 MEASURED, not proved). No bound moved; NO QED.
 *   No refereed bound is changed; RH open.
 *
 * @see imp-97054-route-m-two-sided-norm-rejection-assessment.js (source: the direction analysis this glosses)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (the lower companion's further reduction to a first-moment bound)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (the upper companion this headword warns is the WRONG half for a turnover)
 *
 * Ticket: imp-97088 (content, medium, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The lower-half-rejects-turnover direction headword, baked verbatim (no re-import).
const ROUTE_M_LOWER_HALF_TURNOVER_REJECTION_HEADWORD = Object.freeze({
  key: 'route-m-lower-half-of-two-sided-law-rejects-concave-turnover-not-upper-half',
  term:
    'imp-97054 direction analysis: for a CONCAVE-quad ||G||_F turnover (c2 < 0), it is the LOWER ' +
    'half of a two-sided Int(N) = Theta(log N) law that rejects it -- the UPPER half (the one ' +
    'imp-96750 targets and imp-97016/imp-97033 call sufficient) is silent on a turnover',
  definition:
    'A two-sided law s_lo x - O(1) <= Q(b) <= s* x + O(1) (x = log N) constrains a fitted quadratic ' +
    'curvature term c2 in ||G||_F(x) ~ c0 + c1 x + c2 x^2 in a SIGN-dependent way. If c2 > 0 (convex, ' +
    'super-log growth), Int_model ~ c2^2 x^4 eventually exceeds any fixed upper ceiling, so the ' +
    'UPPER half forces c2 = 0. If c2 < 0 (concave TURNOVER, the Route M measured case), the fitted ' +
    'norm decreases past its peak, so Int_model decreases too and never threatens the upper bound -- ' +
    'the upper half is silent. What a turnover DOES violate is a positive LOWER bound Int >= s_lo x, ' +
    'which forces the norm to keep growing without bound. So rejecting a turnover needs the LOWER ' +
    'companion, not the upper one -- the reverse of the intuition that "the proven one-sided ' +
    '[upper] asymptotic" is the rung-free route.',
  mechanism:
    'The direction flips on the SIGN of the fitted curvature because squaring the norm to reach the ' +
    'second moment preserves whichever bound the sign threatens: convex growth blows up the norm past ' +
    'any linear-in-x ceiling (upper half binds), while a turnover shrinks the norm toward a bound it ' +
    'was never near violating (upper half is vacuous) but drifts away from an ever-rising floor ' +
    '(lower half binds). Rejection is cheap in the constant either way -- only the SIGN of the ' +
    'binding-side slope matters, not its exact value -- but the two-sided law still needs BOTH halves ' +
    'established, and only the sign-matching half does the rejecting for a given curvature sign.',
  verificationStatus:
    'Direction-of-inequality clarification assembled from an already-committed, previously-verified ' +
    'module (imp-97054), including its numeric witness (fitted Int_model already decreasing while ' +
    'positive just past the turnover peak x ~ 22.1). No new numerical computation. Neither half of ' +
    'the two-sided law is established (upper: imp-96750 reduction only; lower: imp-97054 ' +
    'unestablished, imp-97071 reduces it further to a measured-not-proved first-moment kappa ~ ' +
    '0.696). Establishes no positivity theorem; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97088_ROUTE_M_LOWER_HALF_TURNOVER_REJECTION_HEADWORD = Object.freeze({
  id: 'imp-97088',
  proofSection: 'Route-M',
  glosses: 'imp-97054',
  question:
    'imp-97016/imp-97033 treat "the proven one-sided [upper] interior norm asymptotic (imp-96750)" ' +
    'as the rung-free route to reject the Route M concave-quad ||G||_F ceiling turnover. Does the ' +
    'upper half actually reject a TURNOVER, or does the direction of the required inequality flip?',
  headword: ROUTE_M_LOWER_HALF_TURNOVER_REJECTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97054 finding: a CONCAVE ' +
    'turnover (c2 < 0, the measured Route M case) is rejected ONLY by the LOWER half of a two-sided ' +
    'Int(N) = Theta(log N) law -- the UPPER half imp-96750 targets is silent on it, since the fitted ' +
    'norm decreases past its peak and never threatens the upper ceiling. Readers should not treat ' +
    '"the one-sided upper asymptotic suffices" as correct once the object in question is a turnover ' +
    'rather than unbounded growth. Neither half is established (upper: reduced only; lower: ' +
    'unestablished, later reduced to a measured-not-proved first-moment bound by imp-97071); no bound ' +
    'moved; NO QED. No refereed bound is changed.',
  citation:
    'imp-97054 (the direction analysis this glosses); imp-97033/imp-97016 (the "proven one-sided ' +
    'upper asymptotic suffices" framing this headword corrects); imp-97071 (the lower companion\'s ' +
    'further reduction to a first-moment bound).',
});

export default IMP97088_ROUTE_M_LOWER_HALF_TURNOVER_REJECTION_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97088_ROUTE_M_LOWER_HALF_TURNOVER_REJECTION_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97088-headword-names-lower-half-and-sign-dependence',
    why: 'The headword must name the LOWER half as operative for a concave turnover, the UPPER half ' +
      'as the (silent) target of the corrected intuition, and the sign-dependence mechanism -- the ' +
      'entire point of the glossary entry.',
    holds: () => {
      const h = IMP97088_ROUTE_M_LOWER_HALF_TURNOVER_REJECTION_HEADWORD.headword;
      return (
        /LOWER/.test(h.term) &&
        /UPPER/.test(h.term) &&
        /c2 > 0/.test(h.definition) &&
        /c2 < 0/.test(h.definition) &&
        /turnover/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97088-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97054.',
    holds: () =>
      IMP97088_ROUTE_M_LOWER_HALF_TURNOVER_REJECTION_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97088_ROUTE_M_LOWER_HALF_TURNOVER_REJECTION_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97088_ROUTE_M_LOWER_HALF_TURNOVER_REJECTION_HEADWORD.verdict) &&
      IMP97088_ROUTE_M_LOWER_HALF_TURNOVER_REJECTION_HEADWORD.glosses === 'imp-97054',
  },
];

for (const assertion of IMP97088_ROUTE_M_LOWER_HALF_TURNOVER_REJECTION_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97088-route-m-lower-half-turnover-rejection-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
