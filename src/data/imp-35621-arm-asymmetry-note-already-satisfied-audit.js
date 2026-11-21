/**
 * @module imp-35621-arm-asymmetry-note-already-satisfied-audit
 *
 * imp-35621 (ux, audit): the ticket asked to add a short honest-status line to
 * Imp35561PeakHeightMapSensitivityViz.jsx stating the interior sigma-peak is NOT a clean
 * symmetric extremum -- a negative cubic-skew c3 = -2.623677e-4 makes the rising arm wider
 * (A_skew ~ 11.0) and that asymmetry itself inherits the same height-map robustness
 * (imp-35557) -- so the page no longer reads as symmetric-to-one-sig-fig in both directions.
 * This is exactly the imp-35569 FINDING-2 gap.
 *
 * FINDING. Reading src/pages/Imp35561PeakHeightMapSensitivityViz.jsx shows the requested
 * note is ALREADY PRESENT: a "Not a symmetric extremum (imp-35451 / imp-35557)" callout box
 * (added by imp-35603, git log confirms) states the negative cubic coefficient c3 ~ -2.62e-4
 * makes the rising arm wider than the falling arm, and that imp-35557 shows this skew
 * INHERITS the same height-map robustness as sigma_max itself (RvM x {1.02, 0.98} pair, c3
 * stays negative to within ~0.9 percent per arm, A_skew stays near 11.0). Every fact imp-35621
 * asks for -- c3 sign/magnitude, A_skew ~11.0, robustness inheritance from imp-35557 -- is
 * already on the page in prose form.
 *
 * DISPOSITION. No page edit made in this ticket: the imp-35603 commit (title "add
 * imp-35451/imp-35557 arm-asymmetry cross-reference note to Imp35561PeakHeightMapSensitivityViz")
 * already discharged this exact requirement before imp-35621 reached the sonnet queue. This
 * module records the duplicate-ticket finding so the completed status is auditable. Changes
 * no bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see src/pages/Imp35561PeakHeightMapSensitivityViz.jsx (the page carrying the note)
 * @see imp-35569-sigma-peak-page-honest-status-audit.js (identified the FINDING-2 gap)
 * @see imp-35603 (git commit that already added the requested note)
 * @see imp-35606-imp35561-page-registration-reachability-audit.js (confirms imp-35603 fixed the content gap)
 */

export const IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT = {
  id: 'imp-35621',
  proofSection: 'audit',
  auditedPage: {
    file: 'src/pages/Imp35561PeakHeightMapSensitivityViz.jsx',
    route: '/viz-imp35561-peak-height-map-sensitivity',
  },
  requestedFacts: {
    c3: -2.623677e-4,
    armSkew: 11.0,
    robustnessSourceTicket: 'imp-35557',
    armSpreadPercent: 0.9,
  },
  question:
    'Does Imp35561PeakHeightMapSensitivityViz.jsx already carry the imp-35451/imp-35557 ' +
    'arm-asymmetry note the imp-35569 FINDING-2 gap called for, or does this ticket still ' +
    'need to add it?',
  finding:
    'ALREADY SATISFIED. The page carries a "Not a symmetric extremum (imp-35451 / imp-35557)" ' +
    'callout (added by the imp-35603 commit) stating c3 ~ -2.62e-4 (rising arm wider), ' +
    'A_skew ~ 11.0, and that imp-35557 shows the skew inherits the same height-map robustness ' +
    'as sigma_max (~0.9 percent per arm under the RvM x {1.02, 0.98} pair). Every fact imp-35621 ' +
    'requests is already present in prose on the page.',
  priorFixingCommitTitle:
    'imp-35603 (ux, sonnet-4-6, sonnet): add imp-35451/imp-35557 arm-asymmetry cross-reference ' +
    'note to Imp35561PeakHeightMapSensitivityViz',
  duplicateOf: 'imp-35603',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). imp-35621 duplicates ' +
    'work already completed by imp-35603; no further page edit needed. Changes no bound; ' +
    'establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35569 (named the FINDING-2 content gap); imp-35603 (git commit that already closed the ' +
    'gap); imp-35606 (registration audit corroborating the imp-35603 fix); imp-35451/imp-35557 ' +
    '(the cubic-skew arm-asymmetry findings the note cites).',
};

export const IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT_ASSERTIONS = [
  {
    id: 'imp35621-audited-page-identified',
    description: 'the audited page and route are named explicitly',
    holds: () =>
      IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT.auditedPage.file ===
        'src/pages/Imp35561PeakHeightMapSensitivityViz.jsx' &&
      IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT.auditedPage.route ===
        '/viz-imp35561-peak-height-map-sensitivity',
  },
  {
    id: 'imp35621-requested-facts-recorded',
    description: 'the c3, A_skew, and robustness-source literals imp-35621 asked for are recorded',
    holds: () =>
      IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT.requestedFacts.c3 === -2.623677e-4 &&
      IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT.requestedFacts.armSkew === 11.0 &&
      IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT.requestedFacts.robustnessSourceTicket ===
        'imp-35557',
  },
  {
    id: 'imp35621-duplicate-of-imp35603-recorded',
    description: 'the ticket that already discharged this requirement is recorded',
    holds: () => IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT.duplicateOf === 'imp-35603',
  },
  {
    id: 'imp35621-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT.verdict),
  },
];

for (const a of IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35621-arm-asymmetry-note-already-satisfied-audit assertion failed: ${a.id}`);
  }
}

export default IMP35621_ARM_ASYMMETRY_NOTE_ALREADY_SATISFIED_AUDIT;
