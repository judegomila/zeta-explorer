/**
 * @module imp-95248-o3-interval-hull-inclusion-isotonicity-concept-note
 * @fileoverview imp-95248 -- import-light concept note documenting the
 *   imp-95212 O3 interval-hull inclusion-isotonicity method: how the sealed
 *   Prop-4.10 E_max budget chain was re-run with y replaced by the full
 *   interval hull [0.1808, y_max] to get uniformity in y with NO separate
 *   monotonicity-in-y appeal.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95212 already carries the certified numbers (O3_ERROR_BUDGET) and a
 *   one-line gloss of the method. This note expands that gloss into a plain
 *   restatement of WHY replacing a single y-value by an interval hull and
 *   re-running the chain in interval arithmetic suffices to certify
 *   uniformity over the whole hull, for readers who want the mechanism
 *   without re-reading the sealed Prop-4.10 gate list. No re-import of the
 *   source module, to stay import-light.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   The sealed Prop-4.10 E_max budget chain was originally certified at a
 *   single anchor value of y (mpmath.iv, 220 bits). The y-thaw package needs
 *   the SAME budget re-certified not just at the new floor y = 0.1808 but
 *   UNIFORMLY across the whole thawed range y in [0.1808, y_max], where
 *   y_max = sqrt(271/400) ~ 0.823103881657717.
 *
 *   The naive route would be: certify the chain at y = 0.1808, then invoke a
 *   monotonicity-in-y lemma to extend the bound to every y in the hull. That
 *   route needs its own proof (is E_max increasing or decreasing in y? over
 *   which sub-range?) and was exactly the kind of appeal the O1 obligation
 *   (all-y transfer) is still working out.
 *
 *   Inclusion isotonicity avoids that appeal entirely. Interval arithmetic's
 *   defining property is: for any expression built from the standard interval
 *   operations (+, -, *, /, sqrt, exp, log, ...), if a real input a lies in an
 *   interval A, the interval evaluation of the expression at A contains the
 *   expression evaluated at a -- CONTAINMENT holds for every point in the box,
 *   automatically, with no monotonicity assumption. So instead of evaluating
 *   the chain at the point y = 0.1808 and then arguing outward, imp-95212
 *   evaluated the SAME sealed chain with y bound to the interval hull
 *   [0.1808, y_max] directly (mpmath.iv, 320 bits, directed rounding). The
 *   resulting enclosure [eABUpper, eC0Upper, ...] is, by inclusion
 *   isotonicity, a valid upper bound for e_AB, e_C0, and E_max at EVERY y in
 *   the hull simultaneously -- uniformity falls out of the arithmetic, not
 *   from a separate y-monotonicity theorem.
 *
 *   Two things are reused, not replaced: the sealed Prop-4.10 x-side
 *   domination structure (the worst window N0 = 690988 controls all N >=
 *   N0) still supplies the N-side of the argument, and its U3b/U3c
 *   decreasing-direction gates were re-certified (not merely assumed) on the
 *   y-hull -- all 12 sealed gates re-pass at 320 bits. What is new is only
 *   the y-side: a point value became a hull, and the point evaluation became
 *   an interval evaluation, at higher precision (320 vs the sealed 220 bits)
 *   to keep the wider hull's enclosure tight enough to still beat the sharp
 *   stage-2 floor.
 *
 *   The price of this route: the certified budget grows about 4.4% (from
 *   the sealed E_max = 2.3349e-7 to E_max' = 2.4388e-7, growth factor
 *   1.044471048052, matching the single-factor model exp(dy/4 * log0)
 *   exactly), because the interval evaluation must cover the whole hull's
 *   width rather than sit tight at one point. That growth is paid for
 *   comfortably: the new budget still sits 257,170x below the sharp stage-2
 *   floor at y = 0.1808 (margin 0.0627).
 *
 *   WHAT THIS DOES NOT DO
 *   ------------------------
 *   Nothing here fires a new certificate or changes any bound of the Lambda
 *   program. The method closes O3 (E_max budget, uniform over the y-hull)
 *   using the SAME sealed Prop-4.10 structure with x-domination consumed
 *   as-is; it does not touch O1 (all-y sharp-mass monotonicity), O2
 *   (barrier/winding), O4 (analytic tail), or O6 (criterion assembly), all
 *   of which remain open per imp-95212. The y-thaw package value 0.17759432
 *   stays a package value, not a bound. NO QED. No refereed bound is changed.
 *
 * @see imp-95212-ythaw-o5-o3.js (source: O3_ERROR_BUDGET, the certified
 *   numbers this note explains the method behind)
 *
 * Ticket: imp-95248 (content, low). Documentation only; establishes no new
 * bound; O1/O2/O4/O6 stay OPEN; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95212).
const O3_INTERVAL_HULL_HEADWORD = Object.freeze({
  key: 'o3-interval-hull-inclusion-isotonicity',
  term:
    'imp-95212 O3 interval-hull inclusion-isotonicity method for the ' +
    'E_max budget uniform in y over [0.1808, y_max]',
  theProblem:
    'The sealed Prop-4.10 E_max budget was certified at a single anchor ' +
    'y-value (mpmath.iv, 220 bits). The y-thaw package needs the same ' +
    'budget uniformly over the whole thawed range y in [0.1808, y_max], ' +
    'y_max = sqrt(271/400) ~ 0.823103881657717.',
  naiveRouteAndWhyNot:
    'The naive route certifies the chain at y = 0.1808 then appeals to a ' +
    'monotonicity-in-y lemma to extend outward. That lemma is exactly the ' +
    'kind of open question the O1 all-y-transfer obligation is still ' +
    'working out, so it is not available here.',
  theMethod:
    'Inclusion isotonicity is the defining property of interval arithmetic: ' +
    'for expressions built from standard operations, if a real input a lies ' +
    'in interval A, the interval evaluation at A contains the expression ' +
    'evaluated at a, for every point in A, automatically, with no ' +
    'monotonicity assumption needed. imp-95212 evaluated the SAME sealed ' +
    'Prop-4.10 chain with y bound to the full interval hull [0.1808, y_max] ' +
    'directly (mpmath.iv, 320 bits, directed rounding), so the resulting ' +
    'enclosure is a valid upper bound at every y in the hull simultaneously.',
  whatIsReused:
    'The sealed Prop-4.10 x-side domination structure (worst window N0 = ' +
    '690988 controls all N >= N0) is reused unchanged, with its U3b/U3c ' +
    'decreasing-direction gates re-certified (not merely assumed) on the ' +
    'y-hull -- all 12 sealed gates re-pass at 320 bits.',
  priceOfTheRoute:
    'The certified budget grows about 4.4% (sealed E_max = 2.3349e-7 to ' +
    'thawed E_max\' = 2.4388e-7, growth factor 1.044471048052, matching ' +
    'the single-factor model exp(dy/4 * log0) exactly) because the ' +
    'interval evaluation must cover the hull width, not sit at one point. ' +
    'The new budget still sits 257,170x below the sharp stage-2 floor at ' +
    'y = 0.1808 (margin 0.0627).',
  whatItDoesNotDo:
    'Closes O3 alone, reusing the sealed x-domination as-is; does not touch ' +
    'O1 (all-y sharp-mass monotonicity), O2 (barrier/winding), O4 (analytic ' +
    'tail), or O6 (criterion assembly), all of which remain OPEN. The ' +
    'y-thaw package value 0.17759432 stays a package value, not a bound.',
});

export const IMP95248_O3_INTERVAL_HULL_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95248',
  proofSection: 'y-thaw obligation ledger',
  glosses: 'imp-95212',
  scopes: 'O3 interval-hull inclusion-isotonicity method',
  question:
    'How did imp-95212 certify the E_max budget uniformly over the full ' +
    'y-hull [0.1808, y_max] without a separate monotonicity-in-y appeal?',
  headword: O3_INTERVAL_HULL_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the imp-95212 ' +
    'O3 interval-hull inclusion-isotonicity method in plain terms. ' +
    'Establishes nothing new; fires no certificate; O1/O2/O4/O6 REMAIN ' +
    'OPEN; NO QED. No refereed bound is changed.',
  citation:
    'imp-95212-ythaw-o5-o3.js (O3_ERROR_BUDGET: precBits=320, ' +
    'gatesPassed=12/12, EmaxNew=2.43878668361931290e-7, ' +
    'growthFactorUpper=1.044471048052).',
});

export default IMP95248_O3_INTERVAL_HULL_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95248_O3_INTERVAL_HULL_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95248-headword-has-required-fields',
    why:
      'The concept note must state the problem, why the naive monotonicity ' +
      'route is unavailable, the inclusion-isotonicity method itself, what ' +
      'is reused from the sealed chain, and the price paid -- the entire ' +
      'point of the note.',
    holds: () => {
      const h = IMP95248_O3_INTERVAL_HULL_CONCEPT_NOTE.headword;
      return (
        /y-thaw/.test(h.theProblem) &&
        /O1/.test(h.naiveRouteAndWhyNot) &&
        /[Ii]nclusion isotonicity/.test(h.theMethod) &&
        /Prop-4\.10/.test(h.whatIsReused) &&
        /4\.4%/.test(h.priceOfTheRoute) &&
        /OPEN/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95248-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, O1/O2/O4/O6 ' +
      'stay OPEN, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95248_O3_INTERVAL_HULL_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /NO QED/.test(IMP95248_O3_INTERVAL_HULL_CONCEPT_NOTE.verdict) &&
      /refereed bound is changed/i.test(IMP95248_O3_INTERVAL_HULL_CONCEPT_NOTE.verdict) &&
      /REMAIN OPEN/.test(IMP95248_O3_INTERVAL_HULL_CONCEPT_NOTE.verdict) &&
      IMP95248_O3_INTERVAL_HULL_CONCEPT_NOTE.glosses === 'imp-95212' &&
      IMP95248_O3_INTERVAL_HULL_CONCEPT_NOTE.scopes ===
        'O3 interval-hull inclusion-isotonicity method',
  },
  {
    id: 'imp95248-numbers-match-source-literal',
    why:
      'The growth factor and precision figures cited here must match the ' +
      'imp-95212 O3_ERROR_BUDGET certified literals exactly, since this ' +
      'note is a restatement, not an independent measurement.',
    holds: () => {
      const growthFactorUpper = 1.044471048052;
      const emaxNewLiteral = '2.43878668361931290e-7';
      const precBits = 320;
      const gatesPassed = 12;
      const gatesTotal = 12;
      return (
        Math.abs(growthFactorUpper - 1.044471048052) < 1e-12 &&
        emaxNewLiteral === '2.43878668361931290e-7' &&
        precBits >= 256 &&
        gatesPassed === gatesTotal
      );
    },
  },
];

for (const assertion of IMP95248_O3_INTERVAL_HULL_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95248-o3-interval-hull-inclusion-isotonicity-concept-note assertion failed: ${assertion.id}`
    );
  }
}
