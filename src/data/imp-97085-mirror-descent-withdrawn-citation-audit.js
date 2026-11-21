/**
 * @module imp-97085-mirror-descent-withdrawn-citation-audit
 * @fileoverview imp-97085 -- consumer audit for the WITHDRAWN mirror-descent
 *   Lambda ~ 0.1035 / 0.0809 reading (imp-97061 section (c) / rh-bridge-mirror-descent-2026-09-25
 *   section C1: the "mirror mean held pointwise" baseline was inconsistent against the correct
 *   Palm (conditioned-on-a-zero) neutral-lattice baseline, and was withdrawn -- H_desc-mirror
 *   demands a local SURPLUS of ~1.73x the neutral mirror count, not "no shortage").
 *
 *   SWEEP METHOD
 *   -----------------------------------------------
 *   Grepped src/data, src/pages, and src/components for every literal citation of the withdrawn
 *   values (0.1035, 0.0809) and the withdrawn "no shortage" framing.
 *
 *   FINDING: no surviving uncorrected citation.
 *   -----------------------------------------------
 *   - rh-bridge-mirror-descent-2026-09-25.js (the source module) already states the withdrawal
 *     explicitly at the point of citation: "The earlier Lambda 0.1035 / 0.0809 ... is an
 *     inconsistent reading (withdrawn)", alongside the corrected Palm-profile model
 *     (Lambda ~ 0.132 seam / 0.118 one-slot / 0.099).
 *   - imp-97061-mirror-pair-lemma-flow-descent-glossary-headword.js (the downstream glossary
 *     headword) also carries the withdrawal inline, both in its `mechanism` field and its
 *     module-level fileoverview: "the Lambda ~ 0.1035/0.0809 it produced, were withdrawn as an
 *     inconsistent baseline."
 *   - Every other numeric match for 0.1035 / 0.0809 in src/data (e.g. the imp-34268 residual
 *     table, the viz-window1-landscape pilot array, the imp-96333/imp-96270 mixed-ladder
 *     tabulations, zeros-to-1e6.js) is an unrelated coincidental decimal value from a different
 *     measurement, not a mirror-descent citation.
 *   - Every match for the literal phrase "no shortage" outside the two files above is a
 *     descriptive/historical reference inside src/data/improvement-queue.js ticket text (the
 *     imp-97059 and imp-97085 ticket descriptions themselves, both of which already state the
 *     reading was withdrawn), not a live restatement of the withdrawn framing as current.
 *   - lane-arithmetic-input-audit-2026-09-22.js (the H_desc hypothesis origin the mirror-descent
 *     theorem's hypothesis is implied by) cites neither the withdrawn values nor "no shortage" --
 *     it is unaffected and needs no correction (a Palm-baseline re-derivation of its own f_req
 *     framing is separately tracked, unresolved, by imp-97059).
 *
 *   No file needed patching. This module records the closed audit so a future scout does not
 *   re-open the same sweep.
 *
 * @see rh-bridge-mirror-descent-2026-09-25.js (source of the withdrawal, section C1)
 * @see imp-97061-mirror-pair-lemma-flow-descent-glossary-headword.js (downstream glossary
 *   headword, already carries the withdrawal inline)
 *
 * Ticket: imp-97085 (meta, medium, sonnet-4-6). Documentation/bookkeeping only; no bound moves;
 * NO QED; no refereed bound is changed.
 */

export const IMP97085_MIRROR_DESCENT_WITHDRAWN_CITATION_AUDIT = Object.freeze({
  id: 'imp-97085',
  proofSection: 'S-frontier',
  audits: 'the withdrawn mirror-descent Lambda ~ 0.1035 / 0.0809 reading (rh-bridge-mirror-descent-2026-09-25 section C1)',
  question:
    'Does any glossary entry, viz page, or data module still cite the withdrawn ' +
    'mirror-mean-pointwise Lambda ~ 0.1035/0.0809 reading, or the "no shortage" framing it ' +
    'was derived from, without the honest-status withdrawal note?',
  sweepScope: ['src/data', 'src/pages', 'src/components'],
  survivingUncorrectedCitations: [],
  alreadyCorrectFiles: [
    'rh-bridge-mirror-descent-2026-09-25.js',
    'imp-97061-mirror-pair-lemma-flow-descent-glossary-headword.js',
  ],
  unrelatedCoincidentalMatches: [
    'imp-34268-fixed-band-peak-reaccel-convexity-stitch-viz-data.js',
    'viz-window1-landscape-data.js',
    'imp-96333-mixed-ladder-235-spectral-gap-margin-tabulation.js',
    'imp-96270-mixed-ladder-spectral-gap-margin-tabulation.js',
    'zeros-to-1e6.js',
  ],
  anyBoundMoved: false,
  verdict:
    'AUDIT CLOSED, NO CORRECTION NEEDED. Swept src/data, src/pages, and src/components for the ' +
    'withdrawn mirror-mean-pointwise Lambda ~ 0.1035/0.0809 value and the "no shortage" framing. ' +
    'The only two files carrying the value (rh-bridge-mirror-descent-2026-09-25.js, the source, ' +
    'and imp-97061-mirror-pair-lemma-flow-descent-glossary-headword.js, the downstream glossary ' +
    'headword) already state the withdrawal inline at the point of citation. All other numeric ' +
    'hits are unrelated coincidental decimals from other measurements. No file needed patching. ' +
    'Documentation/bookkeeping only; establishes nothing new; no bound moved; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'rh-bridge-mirror-descent-2026-09-25 (source of the withdrawal, section C1); ' +
    'imp-97061-mirror-pair-lemma-flow-descent-glossary-headword (downstream glossary headword, ' +
    'already correct).',
});

export default IMP97085_MIRROR_DESCENT_WITHDRAWN_CITATION_AUDIT;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97085_MIRROR_DESCENT_WITHDRAWN_CITATION_AUDIT_ASSERTIONS = [
  {
    id: 'imp97085-audit-found-no-survivors',
    why: 'The whole point of the audit is that it found nothing needing a fix -- record that ' +
      'explicitly so the closed state is machine-checkable.',
    holds: () =>
      Array.isArray(IMP97085_MIRROR_DESCENT_WITHDRAWN_CITATION_AUDIT.survivingUncorrectedCitations) &&
      IMP97085_MIRROR_DESCENT_WITHDRAWN_CITATION_AUDIT.survivingUncorrectedCitations.length === 0,
  },
  {
    id: 'imp97085-honesty-gate-no-qed',
    why: 'Documentation/bookkeeping only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97085_MIRROR_DESCENT_WITHDRAWN_CITATION_AUDIT.anyBoundMoved === false &&
      /NO QED/.test(IMP97085_MIRROR_DESCENT_WITHDRAWN_CITATION_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP97085_MIRROR_DESCENT_WITHDRAWN_CITATION_AUDIT.verdict),
  },
];

for (const assertion of IMP97085_MIRROR_DESCENT_WITHDRAWN_CITATION_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97085-mirror-descent-withdrawn-citation-audit assertion failed: ${assertion.id}`,
    );
  }
}
