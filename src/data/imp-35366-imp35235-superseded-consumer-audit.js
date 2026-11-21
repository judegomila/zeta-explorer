/**
 * @module imp-35366-imp35235-superseded-consumer-audit
 *
 * imp-35366 (meta, audit): enumerates every consumer of the imp-35235 N=2000
 * "DP45 dt/2 gate-skip" t_c literals across src/pages and src/data, and flags
 * which ones still describe that superseded status rather than the imp-35324
 * finer-grid resolution (all four references clear t_c_hi, worst-case slack
 * +6.16e-8) and the imp-35278 within-step step-over diagnosis.
 *
 * METHOD. Grepped src/pages and src/data for "imp-35235" and for the specific
 * gate-skip literal (0.0013238241280 / "1.3238e-3") to find every file whose
 * prose describes the imp-35235 N=2000 outcome, then read each hit to judge
 * whether it reports the ORIGINAL gate-skip finding as a closed historical
 * event (fine) or as the CURRENT status of R2 at N=2000 (stale, since imp-35324
 * superseded it).
 *
 * FINDINGS.
 *  - src/data/imp-35235-r2-n2000-flow-reference.js: the original record of the
 *    gate-skip. Correctly historical; no fix needed.
 *  - src/data/imp-35278-r2-n2000-gatefree-flow-reference.js and
 *    src/data/imp-35324-r2-n2000-finer-grid-reference.js: both already cite
 *    imp-35235 via @see and describe the supersession explicitly. No fix needed.
 *  - src/pages/Imp35288R2FlowLadderSlackViz.jsx: already re-pointed to the
 *    imp-35324/imp-35278 status (imp-35360 in progress at audit time). No
 *    further action from this ticket.
 *  - src/data/visualizations-index.js (the /viz-imp35288-r2-flow-ladder-slack
 *    entry's `oneLine` field): STALE. Still describes N=2000 as "the DP45
 *    dt/2 gate-skip point where the worst-case envelope fails" with no mention
 *    of imp-35324/imp-35278. NEEDS RE-POINTING.
 *  - src/data/glossary.js (the "imp-35104 R2 true-flow-bound ladder honest
 *    status" headword, `definition` and `relatedTerms` fields): STALE. Still
 *    asserts "the honest worst-case envelope does not clear the bracket" at
 *    N=2000 and cites only imp-35235/imp-35235-sub-n2000-gate-skip, with no
 *    mention that imp-35324 cleared the envelope. NEEDS RE-POINTING.
 *
 * SCOPE. Enumeration/flagging only, per the imp-35366 ticket text -- the fix
 * to the two flagged consumers is left as follow-up work, mirroring the
 * imp-35327 audit precedent of reporting findings without editing the flagged
 * files in the same pass. No source file's substantive claims were changed by
 * this ticket. Changes no bound; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35235-r2-n2000-flow-reference (the superseded original finding)
 * @see imp-35324-r2-n2000-finer-grid-reference (the resolution)
 * @see imp-35278-r2-n2000-gatefree-flow-reference (the within-step diagnosis)
 * @see imp-35360 (the in-progress page re-point this audit found already underway)
 */

const CONSUMERS_CHECKED = [
  {
    file: 'src/data/imp-35235-r2-n2000-flow-reference.js',
    kind: 'original-finding-record',
    stale: false,
    reason: 'Historical record of the gate-skip itself; correctly framed as the original finding, not current status.',
  },
  {
    file: 'src/data/imp-35278-r2-n2000-gatefree-flow-reference.js',
    kind: 'supersession-record',
    stale: false,
    reason: 'Already cites imp-35235 via @see and documents the within-step step-over diagnosis explicitly.',
  },
  {
    file: 'src/data/imp-35324-r2-n2000-finer-grid-reference.js',
    kind: 'supersession-record',
    stale: false,
    reason: 'Already cites imp-35235 via @see and documents the finer-grid resolution explicitly.',
  },
  {
    file: 'src/pages/Imp35288R2FlowLadderSlackViz.jsx',
    kind: 'viz-page',
    stale: false,
    reason: 'Re-pointed to the imp-35324/imp-35278 status (imp-35360 in progress at audit time); no action needed from this ticket.',
  },
  {
    file: 'src/data/visualizations-index.js',
    kind: 'catalog-entry-oneLine',
    stale: true,
    reason:
      'The /viz-imp35288-r2-flow-ladder-slack oneLine still reads "the DP45 dt/2 gate-skip point where ' +
      'the worst-case envelope fails but the 3-of-4 clean references still clear the map bracket", with ' +
      'no mention of the imp-35324 resolution. NEEDS RE-POINTING.',
  },
  {
    file: 'src/data/glossary.js',
    kind: 'glossary-headword',
    stale: true,
    reason:
      'The "imp-35104 R2 true-flow-bound ladder honest status" headword definition still asserts the ' +
      'honest worst-case envelope does not clear the bracket at N=2000, and its relatedTerms cite only ' +
      'imp-35235, with no mention of imp-35324 clearing the envelope. NEEDS RE-POINTING.',
  },
];

const STALE_CONSUMERS = CONSUMERS_CHECKED.filter((c) => c.stale).map((c) => c.file);

export const IMP35366_SUPERSEDED_CONSUMER_AUDIT = {
  id: 'imp-35366',
  proofSection: 'audit',
  question:
    'Which consumers of the imp-35235 N=2000 gate-skip t_c literals across src/pages and src/data still ' +
    'need re-pointing to the newer imp-35324 finer-grid / imp-35278 signed-crossing references?',
  consumersChecked: CONSUMERS_CHECKED,
  consumersCheckedCount: CONSUMERS_CHECKED.length, // 6
  staleConsumers: STALE_CONSUMERS,
  staleConsumerCount: STALE_CONSUMERS.length, // 2
  verdictShort:
    'Two consumers still describe the superseded imp-35235 gate-skip as current status and need ' +
    're-pointing: src/data/visualizations-index.js (the imp-35288 viz catalog entry oneLine) and ' +
    'src/data/glossary.js (the imp-35104 R2 honest-status headword). Four other consumers already ' +
    'correctly reflect the imp-35324/imp-35278 supersession.',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not a measurement of a mathematical quantity). Enumeration/flagging only, per the ' +
    'imp-35366 ticket text; the flagged files were not edited in this pass. Changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation: 'imp-35235 (superseded finding), imp-35324/imp-35278 (supersession), imp-35327 (audit method precedent).',
};

export const IMP35366_SUPERSEDED_CONSUMER_AUDIT_ASSERTIONS = [
  {
    id: 'imp35366-six-consumers-checked',
    description: 'the audit enumerated exactly the six known imp-35235 N=2000 literal consumers',
    holds: () => IMP35366_SUPERSEDED_CONSUMER_AUDIT.consumersCheckedCount === 6,
  },
  {
    id: 'imp35366-two-stale-flagged',
    description: 'exactly two consumers are flagged as needing re-pointing',
    holds: () =>
      IMP35366_SUPERSEDED_CONSUMER_AUDIT.staleConsumerCount === 2 &&
      IMP35366_SUPERSEDED_CONSUMER_AUDIT.staleConsumers.includes('src/data/visualizations-index.js') &&
      IMP35366_SUPERSEDED_CONSUMER_AUDIT.staleConsumers.includes('src/data/glossary.js'),
  },
  {
    id: 'imp35366-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35366_SUPERSEDED_CONSUMER_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35366_SUPERSEDED_CONSUMER_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35366_SUPERSEDED_CONSUMER_AUDIT.verdict),
  },
];

for (const a of IMP35366_SUPERSEDED_CONSUMER_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35366-imp35235-superseded-consumer-audit assertion failed: ${a.id}`);
  }
}
