/**
 * @module imp-95905-conditioning-not-reach-ufit-ordering-glossary-headword
 * @fileoverview imp-95905 -- import-light glossary/Concepts headword for the imp-95885
 *   FINDING A verdict: reach does NOT order the per-delta u_fit certified intervals
 *   across the ln 1.2 / ln 1.25 / ln 1.3 threads; the deep-corner precision floor
 *   (conditioning) does the ordering the reach-universality heuristic misses.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95885 assembled the three per-delta u_fit threads side by side for the first
 *   time and, in FINDING A, flagged a case where reach-universality (imp-95761:
 *   finite-grid bias is a function of the reach R = delta*(N+1) alone) makes the WRONG
 *   prediction. A reader who only knows reach-universality would expect the
 *   longer-reach ln 1.2 chain to carry the tighter interval; it does not. This
 *   headword bakes that distinction VERBATIM (no re-import of the imp-95885 module,
 *   to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The ln 1.2 thread reaches R ~ 948 (14 points, N <= 5200) yet its certified
 *   interval stays LOOSER (u_fit_rel = 0.247%) than the ln 1.3 5-point DD-Jacobi
 *   envelope at only R ~ 105 (u_fit_rel = 0.23%) -- the opposite of what
 *   reach-universality alone predicts. The reason: the ln 1.2 dual A_opt ~ 4.26e-22
 *   sits at conditioning ~5.6e22 (near the double-double ~32-digit precision floor),
 *   so each ln 1.2 grid point is intrinsically noisier than an ln 1.3 grid point
 *   (A_opt ~ 4.41e-15, conditioning ~5e15) even though the reach is longer. So
 *   conditioning, not reach alone, sets the u_fit ordering between these two deltas.
 *
 *   IMPORTANT CAVEAT -- SUPERSEDED BY imp-95895
 *   -----------------------------------------------
 *   "Conditioning orders the intervals" is FINDING A's secondary explanation for the
 *   two deltas it had data for (ln 1.2 and ln 1.3); it is not the final word. Once
 *   imp-95895 filled the ln 1.25 N/A cell, the completed three-delta ordering became
 *   ln 1.25 (0.085%) < ln 1.3 (0.23%) < ln 1.2 (0.34%/0.247%) -- and ln 1.25 sits at
 *   INTERMEDIATE conditioning (~1e17) yet is the TIGHTEST of the three, which
 *   conditioning-alone cannot explain either. imp-95895 refines the reading to a
 *   reach-to-conditioning INTERPLAY (ln 1.25 pairs a long reach with only moderate
 *   conditioning). Readers should treat "reach alone does not order the intervals"
 *   (the negative half of FINDING A) as the durable claim, and "conditioning alone
 *   orders them" (the positive half) as superseded by the imp-95895 interplay
 *   reading -- see imp-95932 for that refinement's own headword.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95885 FINDING A distinction (and its
 *   imp-95895 refinement) for quick reference. It establishes nothing, fits no new
 *   curve, and changes no reported interval. Changes no bound of the Lambda program;
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-95885-per-delta-ufit-comparison-table.js (source: FINDING A this glosses)
 * @see imp-95895-ln125-ufit-interval.js (refines FINDING A: reach-to-conditioning interplay)
 * @see imp-95761 (reach-universality heuristic FINDING A shows an exception to)
 * @see imp-95919 (confirms the ln 1.2 reach lever is exhausted past N=5200 -- 0.247% is a DD-floor plateau)
 *
 * Ticket: imp-95905 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The conditioning-not-reach ordering headword, baked verbatim (no re-import).
const CONDITIONING_NOT_REACH_ORDERING_HEADWORD = Object.freeze({
  key: 'ufit-ordering-conditioning-not-reach',
  term: 'imp-95885 FINDING A: reach does not order the per-delta u_fit intervals -- conditioning does (for the two-delta case), refined to a reach-to-conditioning interplay by imp-95895',
  definition:
    'The ln 1.2 per-delta u_fit thread reaches R ~ 948 (14 points, N <= 5200) yet ' +
    'stays LOOSER (u_fit_rel = 0.247%) than the ln 1.3 5-point DD-Jacobi envelope at ' +
    'only R ~ 105 (u_fit_rel = 0.23%), contradicting the reach-universality (imp-95761) ' +
    'prediction that longer reach gives a tighter interval.',
  orderingMechanism:
    'The ln 1.2 dual A_opt ~ 4.26e-22 sits at conditioning ~5.6e22 (near the ' +
    'double-double ~32-digit precision floor), so each ln 1.2 grid point is ' +
    'intrinsically noisier than an ln 1.3 grid point (A_opt ~ 4.41e-15, conditioning ' +
    '~5e15) despite the longer reach -- conditioning, not reach alone, sets the ' +
    'ordering between these two deltas.',
  consequence:
    'Citing reach-universality alone to predict which per-delta u_fit interval is ' +
    'tighter is unsafe: ln 1.2 (longest reach) is the LOOSEST of the three deltas, ' +
    'not the tightest. Conditioning-alone is also not the final word -- imp-95895 ' +
    'shows ln 1.25 is tightest despite intermediate conditioning, refining the ' +
    'explanation to a reach-to-conditioning interplay. No inconsistency is flagged; ' +
    'no reported interval value changes.',
});

export const IMP95905_CONDITIONING_NOT_REACH_ORDERING_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95905',
  proofSection: 'S-frontier',
  glosses: 'imp-95885',
  scopes: 'imp-95761',
  question:
    'imp-95885 FINDING A found that the ln 1.2 per-delta u_fit interval (longest reach, ' +
    'R ~ 948) stays looser than the ln 1.3 interval (shortest reach, R ~ 105), the ' +
    'opposite of the reach-universality prediction. What orders the intervals instead, ' +
    'for a reader landing on the three-delta comparison table cold?',
  headword: CONDITIONING_NOT_REACH_ORDERING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95885 ' +
    'FINDING A distinction: reach-universality alone wrongly predicts ln 1.2 ' +
    '(R ~ 948) tighter than ln 1.3 (R ~ 105); the actual ordering at those two ' +
    'deltas tracks conditioning (ln 1.2 A_opt ~4.26e-22 at conditioning ~5.6e22 vs ' +
    'ln 1.3 A_opt ~4.41e-15 at conditioning ~5e15). Flags that this conditioning-' +
    'alone reading is itself superseded by the imp-95895 reach-to-conditioning ' +
    'interplay once the ln 1.25 cell (tightest, at intermediate conditioning) is ' +
    'included. Establishes nothing; fits no new curve; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95885 (per-delta u_fit comparison table, FINDING A); imp-95895 (ln 1.25 ' +
    'interval derivation, refines FINDING A to a reach-to-conditioning interplay); ' +
    'imp-95761 (reach-universality heuristic); imp-95919 (ln 1.2 reach lever ' +
    'exhaustion, confirming 0.247% is a DD-floor plateau).',
});

export default IMP95905_CONDITIONING_NOT_REACH_ORDERING_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95905_CONDITIONING_NOT_REACH_ORDERING_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95905-headword-has-required-fields',
    why: 'The headword must name the conflicting reach values, the conditioning mechanism, and the misapplication consequence -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95905_CONDITIONING_NOT_REACH_ORDERING_GLOSSARY_HEADWORD.headword;
      return (
        /R ~ 948/.test(h.definition) &&
        /R ~ 105/.test(h.definition) &&
        /5\.6e22/.test(h.orderingMechanism) &&
        /5e15/.test(h.orderingMechanism) &&
        /interplay/.test(h.consequence)
      );
    },
  },
  {
    id: 'imp95905-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, correct glosses/scopes pointers.',
    holds: () =>
      IMP95905_CONDITIONING_NOT_REACH_ORDERING_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95905_CONDITIONING_NOT_REACH_ORDERING_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95905_CONDITIONING_NOT_REACH_ORDERING_GLOSSARY_HEADWORD.verdict) &&
      IMP95905_CONDITIONING_NOT_REACH_ORDERING_GLOSSARY_HEADWORD.glosses === 'imp-95885' &&
      IMP95905_CONDITIONING_NOT_REACH_ORDERING_GLOSSARY_HEADWORD.scopes === 'imp-95761',
  },
];

for (const assertion of IMP95905_CONDITIONING_NOT_REACH_ORDERING_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95905-conditioning-not-reach-ufit-ordering-glossary-headword assertion failed: ${assertion.id}`);
  }
}
