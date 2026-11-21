/**
 * @module imp-95932-reach-conditioning-interplay-glossary-headword
 * @fileoverview imp-95932 -- import-light glossary/Concepts headword for the imp-95895
 *   FINDING: filling the imp-95885 ln 1.25 N/A cell shows the three-delta u_fit_rel
 *   ordering is set by the REACH-TO-CONDITIONING INTERPLAY -- neither reach alone nor
 *   conditioning alone orders the per-delta u_fit intervals.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95895 derived the ln 1.25 per-delta u_fit certified interval and, in doing so,
 *   refined imp-95885 FINDING A. A reader landing on imp-95895 cold has no quick-lookup
 *   definition of what "the reach-to-conditioning interplay" names or why it is the
 *   right reading instead of "reach orders it" or "conditioning orders it". This
 *   headword bakes that fact VERBATIM (no re-import of imp-95895, to stay import-light)
 *   as a standalone lookup entry.
 *
 *   THE INTERPLAY
 *   -----------------------------------------------
 *   Three deltas, three (reach, conditioning, u_fit_rel) triples: ln 1.2 (reach 510.68,
 *   cond ~5.6e22, u_fit_rel 0.3415%), ln 1.25 (reach 340.07, cond ~1e17, u_fit_rel
 *   0.0846%), ln 1.3 (reach 105, cond ~5e15, u_fit_rel 0.2289%). Sorting by reach alone
 *   gives ln 1.2 > ln 1.25 > ln 1.3, which does NOT match the u_fit_rel ordering
 *   (ln 1.25 tightest, not ln 1.2). Sorting by conditioning alone gives ln 1.2 > ln 1.25
 *   > ln 1.3 too, which also does NOT match (ln 1.25 sits at INTERMEDIATE conditioning
 *   yet is the TIGHTEST of the three, not the middle one). Only the joint reading
 *   explains it: ln 1.25 pairs a long reach (340, an eight-point grid) with only
 *   moderate conditioning (~1e17), beating ln 1.3 (short reach 105) despite worse
 *   conditioning and beating ln 1.2 (much worse conditioning ~5.6e22) despite shorter
 *   reach.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95895 interplay finding for quick
 *   reference. It establishes nothing, fits no new curve, moves no bound. NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-95895-ln125-ufit-interval (source: derives the interplay finding this glosses)
 * @see imp-95885-per-delta-ufit-comparison-table (the three-delta table FINDING A this refines)
 *
 * Ticket: imp-95932 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The reach-to-conditioning interplay headword, baked verbatim (no re-import).
const REACH_CONDITIONING_INTERPLAY_HEADWORD = Object.freeze({
  key: 'reach-conditioning-interplay',
  term:
    'imp-95895 finding: neither reach nor conditioning alone orders the per-delta ' +
    'u_fit intervals -- ln 1.25 is tightest at INTERMEDIATE conditioning',
  definition:
    'Across the three certified deltas, sorting by reach alone (ln 1.2 reach 510.68 > ' +
    'ln 1.25 reach 340.07 > ln 1.3 reach 105) does not match the u_fit_rel ordering ' +
    '(ln 1.25 0.0846% < ln 1.3 0.2289% < ln 1.2 0.3415%), and sorting by conditioning ' +
    'alone (ln 1.2 cond ~5.6e22 > ln 1.25 cond ~1e17 > ln 1.3 cond ~5e15) does not match ' +
    'it either -- ln 1.25 sits at INTERMEDIATE conditioning yet is the TIGHTEST interval, ' +
    'not the middle one.',
  interplayMechanism:
    'ln 1.25 pairs a long reach (340.07, an eight-point converged grid) with only ' +
    'moderate conditioning (~1e17): it beats ln 1.3 (short reach 105) despite worse ' +
    'conditioning, and beats ln 1.2 (much worse conditioning ~5.6e22) despite shorter ' +
    'reach. The u_fit_rel ordering is therefore a joint function of both quantities, ' +
    'not a monotone function of either one alone.',
  consequence:
    'Refines imp-95885 FINDING A ("reach does not order the intervals; conditioning ' +
    'does") to the more precise reading: it is the reach-to-conditioning INTERPLAY that ' +
    'orders them, once the ln 1.25 cell (previously N/A) is filled in.',
});

export const IMP95932_REACH_CONDITIONING_INTERPLAY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95932',
  proofSection: 'S-frontier',
  glosses: 'imp-95895',
  scopes: 'imp-95885',
  question:
    'imp-95895 filled the imp-95885 ln 1.25 N/A cell and found ln 1.25 is the tightest ' +
    'of the three per-delta u_fit intervals despite sitting at intermediate ' +
    'conditioning. What names this ordering pattern, for a reader landing on imp-95895 ' +
    'cold?',
  headword: REACH_CONDITIONING_INTERPLAY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95895 ' +
    'finding: the three-delta u_fit_rel ordering (ln 1.25 0.0846% < ln 1.3 0.2289% < ' +
    'ln 1.2 0.3415%) is explained by neither reach alone nor conditioning alone, but by ' +
    'their INTERPLAY -- ln 1.25 pairs long reach (340) with only moderate conditioning ' +
    '(~1e17). Establishes nothing; fits no new curve; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95895 (derives the ln 1.25 interval and the interplay finding); imp-95885 ' +
    '(three-delta comparison table and FINDING A this refines).',
});

export default IMP95932_REACH_CONDITIONING_INTERPLAY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95932_REACH_CONDITIONING_INTERPLAY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95932-headword-has-required-fields',
    why: 'The headword must name the three u_fit_rel figures, the intermediate-conditioning fact, and the interplay mechanism -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95932_REACH_CONDITIONING_INTERPLAY_GLOSSARY_HEADWORD.headword;
      return (
        /0\.0846%/.test(h.definition) &&
        /INTERMEDIATE conditioning/.test(h.definition) &&
        /reach \(340\.07/.test(h.interplayMechanism) &&
        /joint function/.test(h.interplayMechanism)
      );
    },
  },
  {
    id: 'imp95932-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, correct glosses/scopes pointers.',
    holds: () =>
      IMP95932_REACH_CONDITIONING_INTERPLAY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95932_REACH_CONDITIONING_INTERPLAY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95932_REACH_CONDITIONING_INTERPLAY_GLOSSARY_HEADWORD.verdict) &&
      IMP95932_REACH_CONDITIONING_INTERPLAY_GLOSSARY_HEADWORD.glosses === 'imp-95895' &&
      IMP95932_REACH_CONDITIONING_INTERPLAY_GLOSSARY_HEADWORD.scopes === 'imp-95885',
  },
];

for (const assertion of IMP95932_REACH_CONDITIONING_INTERPLAY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95932-reach-conditioning-interplay-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
