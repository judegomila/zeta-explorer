/**
 * @module imp-95976-ln125-ufit-interval-exists-correction-glossary-headword
 * @fileoverview imp-95976 -- import-light glossary/Concepts headword CORRECTING the
 *   imp-95885 FINDING-B record that the ln 1.25 per-delta u_fit thread "has NO
 *   per-delta u_fit interval" (field ln125HasNoUFitInterval: true, shift-budget/
 *   crossing-only thread). That record is STALE: a ln 1.25 per-delta u_fit interval
 *   was already derived by imp-95895 (A_opt scalar-floor observable, u_fit_rel =
 *   +0.0846%). The imp-95939 figure (u_fit_rel = -0.7363%) this ticket names is a
 *   SEPARATE, non-conflatable observable, per imp-95963's retabulation -- not a
 *   second measurement of the same interval.
 *
 *   WHY A GLOSSARY HEADWORD (not an edit to imp-95885)
 *   -----------------------------------------------
 *   imp-95885 assembled the three-delta u_fit comparison and, at the time, correctly
 *   recorded ln 1.25 as N/A because the imp-95838/imp-95859 thread had only produced
 *   a shift-budget scaling law and a converged DD lambda_min(N) grid, never a u_fit
 *   extrapolation. imp-95895 later filled that N/A cell with the A_opt scalar-floor
 *   extrapolation (the SAME observable class ln 1.2 and ln 1.3 report). imp-95939
 *   separately certified a reach-340 CROSSING-CONSTANT extrapolation (C_fit vs
 *   C_pred = pi^2/(2 delta^2)), a different measured quantity at a wildly different
 *   scale. imp-95963 retabulated all of this and found that the ticket premise behind
 *   imp-95976 -- "ln 1.25 had no interval until imp-95939 supplied one" -- is itself
 *   stale in two ways: (1) the cell was already filled by imp-95895 before imp-95939
 *   ran, and (2) the imp-95939 value must NOT be read as a second per-delta u_fit
 *   interval on the same axis, because it is a different observable. This headword
 *   bakes that fuller correction VERBATIM (no re-import of imp-95885/imp-95895/
 *   imp-95939/imp-95963, to stay import-light) as a standalone lookup entry, so a
 *   reader does not repeat the imp-95976 ticket's own stale premise.
 *
 *   THE CORRECTION
 *   -----------------------------------------------
 *   The imp-95885 claim "ln 1.25 ... NOT a u_fit extrapolation, so it has NO
 *   per-delta u_fit interval" (ln125HasNoUFitInterval: true) is SUPERSEDED --
 *   imp-95895 derived the ln 1.25 A_opt scalar-floor u_fit interval (A_opt =
 *   6.9643e-18, u_fit_rel = +0.0846%), the same observable class as ln 1.2 / ln 1.3,
 *   and it is THIS value that belongs in the imp-95885 comparison and orders FINDING
 *   A (ln 1.25 0.0846% < ln 1.3 0.23% < ln 1.2 0.247%). imp-95939 separately
 *   certified the reach-340 crossing constant (C_fit = 98.376562 vs C_pred =
 *   99.106256, u_fit_rel = -0.7363%) -- O(1e2) scale vs the A_opt O(1e-18) scale, a
 *   ratio of ~1.4e19. imp-95963 shows this crossing figure is NOT a second per-delta
 *   u_fit interval and must be EXCLUDED from the A-floor ordering axis: placed there
 *   it would falsely look like a conditioning counterexample (loosest value at ln
 *   1.25's intermediate conditioning), when it is really an observable-conflation
 *   artifact.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup flagging that (a) the imp-95885 "N/A" record is stale and
 *   (b) the imp-95939 figure some readers cite to fill it is the wrong observable for
 *   that purpose. It establishes nothing, fits no new curve, and changes no reported
 *   interval. Changes no bound of the Lambda program; NO QED. No refereed bound is changed.
 *
 * @see imp-95885-per-delta-ufit-comparison-table.js (source: FINDING-B record this corrects, ln125HasNoUFitInterval: true)
 * @see imp-95895-ln125-ufit-interval.js (the actual A_opt scalar-floor fill, u_fit_rel = +0.0846%, on the FINDING A axis)
 * @see imp-95939-ln125-reach340-crossing-certification.js (certifies the SEPARATE crossing-constant figure, u_fit_rel = -0.7363%)
 * @see imp-95963-ln125-crossing-vs-floor-ufit-retabulation.js (authoritative retabulation: the two are distinct observables, do not conflate)
 * @see imp-95838-ln125-shift-budget-scaling (the original shift-budget-only thread imp-95885 described)
 *
 * Ticket: imp-95976 (content, medium). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The ln 1.25 interval-now-exists correction headword, baked verbatim (no re-import).
const LN125_UFIT_INTERVAL_EXISTS_HEADWORD = Object.freeze({
  key: 'ln125-ufit-interval-now-exists',
  term:
    'CORRECTION: imp-95885 FINDING-B recorded ln 1.25 as having NO per-delta u_fit ' +
    'interval (shift-budget-only thread) -- imp-95895 already supplies one (do NOT ' +
    'substitute the imp-95939 crossing figure for it)',
  definition:
    'imp-95885 baked ln125HasNoUFitInterval: true, describing the imp-95838/' +
    'imp-95859 ln 1.25 thread as worked ONLY as a shift-budget/crossing study, never ' +
    'a u_fit extrapolation. That is stale: imp-95895 derived the ln 1.25 A_opt ' +
    'scalar-floor u_fit interval (A_opt = 6.9643e-18, u_fit_rel = +0.0846%), the ' +
    'same observable class ln 1.2 / ln 1.3 report, and it is this value the imp-95885 ' +
    'comparison and FINDING A ordering actually use.',
  crossingFigureCaveat:
    'imp-95939 separately certified a ln 1.25 reach-340 crossing-constant ' +
    'extrapolation (C_fit = 98.376562 vs C_pred = pi^2/(2 delta^2) = 99.106256, ' +
    'u_fit_rel = -0.7363%) -- O(1e2) scale vs the A_opt O(1e-18) scale, differing by ' +
    '~1.4e19. imp-95963 shows this is a DIFFERENT observable, not a second ' +
    'per-delta u_fit interval: placed on the A-floor ordering axis it would falsely ' +
    'read as a conditioning counterexample (loosest value at ln 1.25 intermediate ' +
    'conditioning), when it is an observable-conflation artifact and must be ' +
    'excluded from that axis.',
  consequence:
    'Citing imp-95885 FINDING-B verbatim ("ln 1.25 carries no u_fit interval") is ' +
    'stale -- imp-95895 fills that cell. But citing imp-95939 as the fill (as if it ' +
    'were the same interval measured a second time) is ALSO wrong per imp-95963: ' +
    'the two figures measure different quantities at different scales and must not ' +
    'be compared on one ordering axis.',
});

export const IMP95976_LN125_UFIT_INTERVAL_EXISTS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95976',
  proofSection: 'S-frontier',
  glosses: 'imp-95885',
  corrects: 'imp-95885',
  scopes: 'imp-95963',
  question:
    'imp-95885 FINDING-B recorded ln 1.25 as N/A (ln125HasNoUFitInterval: true) ' +
    'because its thread was shift-budget/crossing-only, never a u_fit extrapolation. ' +
    'Does a ln 1.25 per-delta u_fit interval exist now, and is the imp-95939 crossing ' +
    'figure the right value to cite for it, for a reader landing on the imp-95885 ' +
    'comparison table cold?',
  headword: LN125_UFIT_INTERVAL_EXISTS_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Flags that the imp-95885 ' +
    'ln125HasNoUFitInterval: true record is STALE: imp-95895 already derived the ' +
    'ln 1.25 A_opt scalar-floor u_fit interval (u_fit_rel = +0.0846%), the observable ' +
    'FINDING A orders. The imp-95939 figure (u_fit_rel = -0.7363%) is a SEPARATE ' +
    'crossing-constant observable at a ~1.4e19-different scale, and imp-95963 ' +
    'establishes it must NOT be conflated with the A-floor interval on one ordering ' +
    'axis. Establishes nothing; fits no new curve; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95885 (per-delta u_fit comparison table, FINDING-B, ln125HasNoUFitInterval ' +
    'field this corrects); imp-95895 (ln 1.25 A_opt scalar-floor u_fit interval, ' +
    '+0.0846%, the actual fill on the FINDING A axis); imp-95939 (ln 1.25 crossing-' +
    'constant certification, -0.7363%, a separate observable); imp-95963 ' +
    '(authoritative retabulation establishing the two are distinct, non-conflatable ' +
    'observables); imp-95838/imp-95859 (the original shift-budget-only thread).',
});

export default IMP95976_LN125_UFIT_INTERVAL_EXISTS_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95976_LN125_UFIT_INTERVAL_EXISTS_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95976-headword-has-required-fields',
    why: 'The headword must name the stale imp-95885 record, the imp-95895 actual fill, and the imp-95939/imp-95963 conflation caveat -- the entire point of the correction.',
    holds: () => {
      const h = IMP95976_LN125_UFIT_INTERVAL_EXISTS_GLOSSARY_HEADWORD.headword;
      return (
        /ln125HasNoUFitInterval: true/.test(h.definition) &&
        /\+0\.0846%/.test(h.definition) &&
        /-0\.7363%/.test(h.crossingFigureCaveat) &&
        /imp-95963/.test(h.crossingFigureCaveat) &&
        /conflation/.test(h.crossingFigureCaveat)
      );
    },
  },
  {
    id: 'imp95976-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, correct glosses/corrects/scopes pointers.',
    holds: () =>
      IMP95976_LN125_UFIT_INTERVAL_EXISTS_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95976_LN125_UFIT_INTERVAL_EXISTS_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95976_LN125_UFIT_INTERVAL_EXISTS_GLOSSARY_HEADWORD.verdict) &&
      IMP95976_LN125_UFIT_INTERVAL_EXISTS_GLOSSARY_HEADWORD.glosses === 'imp-95885' &&
      IMP95976_LN125_UFIT_INTERVAL_EXISTS_GLOSSARY_HEADWORD.corrects === 'imp-95885' &&
      IMP95976_LN125_UFIT_INTERVAL_EXISTS_GLOSSARY_HEADWORD.scopes === 'imp-95963',
  },
];

for (const assertion of IMP95976_LN125_UFIT_INTERVAL_EXISTS_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95976-ln125-ufit-interval-exists-correction-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
