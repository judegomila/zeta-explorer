/**
 * @module imp-35622-peak-crossover-damping-headword-already-satisfied-audit
 *
 * imp-35622 (content, audit): the ticket asked to add a glossary/Concepts headword
 * documenting the imp-35574 peak-location-vs-crossover log-damping asymmetry -- the
 * E_coll = E_trunc crossover is log-damped ~18x (~18% raw height-map gap -> ~1% shift)
 * because it solves N proportional to log T0, while the interior sigma-peak LOCATION is
 * instead mildly AMPLIFIED (~0.55 damping factor, ~24% raw gap -> ~43.99% shift) because it
 * solves the stationarity condition dg_sigma/dN = 0 with no log-proportional insulation.
 *
 * FINDING. Reading src/data/glossary.js shows the requested headword is ALREADY PRESENT:
 * the entry titled "imp-35574 peak-location amplification vs crossover log-damping
 * contrast" states every fact this ticket asks for -- the ~18x crossover log-damping
 * (imp-35458), the ~0.553 peak-location AMPLIFICATION factor, the +43.99% location shift
 * (9.218633e5 -> 1.327368e6) against a 24.33% raw-height gap, the ~32.55x
 * crossover-vs-peak damping-ratio contrast, and the WHY (log-proportional crossover
 * balance vs uninsulated stationarity condition at the peak). git log confirms this
 * headword was added by the imp-35592 commit before this ticket reached the sonnet queue.
 *
 * DISPOSITION. No glossary edit made in this ticket: the imp-35592 commit ("glossary/
 * Concepts headword for imp-35574 peak-location amplification vs crossover log-damping
 * contrast") already discharged this exact requirement. This module records the
 * duplicate-ticket finding so the completed status is auditable. Changes no bound;
 * establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see src/data/glossary.js (carries the "imp-35574 peak-location amplification vs crossover log-damping contrast" headword)
 * @see imp-35574-peak-location-height-map-damping.js (the measurement module the headword documents)
 * @see imp-35592 (git commit that already added the requested headword)
 * @see imp-35621-arm-asymmetry-note-already-satisfied-audit.js (sibling duplicate-ticket audit, same closure pattern)
 */

export const IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT = {
  id: 'imp-35622',
  proofSection: 'audit',
  auditedFile: 'src/data/glossary.js',
  auditedTerm: 'imp-35574 peak-location amplification vs crossover log-damping contrast',
  requestedFacts: {
    crossoverDampingFactor: 18,
    peakDampingFactor: 0.553,
    peakLocationShiftPercent: 43.99,
    peakRawHeightGapPercent: 24.33,
    dampingRatioContrast: 32.55,
  },
  question:
    'Does src/data/glossary.js already carry a headword documenting the imp-35574 ' +
    'peak-location-vs-crossover log-damping asymmetry, or does this ticket still need to ' +
    'add one?',
  finding:
    'ALREADY SATISFIED. The glossary carries a "imp-35574 peak-location amplification vs ' +
    'crossover log-damping contrast" entry stating the ~18x crossover log-damping, the ' +
    '~0.553 peak-location AMPLIFICATION factor, the +43.99% location shift ' +
    '(9.218633e5 -> 1.327368e6) against a 24.33% raw-height gap, the ~32.55x ' +
    'crossover-vs-peak damping-ratio contrast, and the mechanism WHY (log-proportional ' +
    'crossover balance N ~ log T0 vs the uninsulated stationarity condition ' +
    'dg_sigma/dN = 0 at the peak). Every fact imp-35622 requests is already present.',
  priorFixingCommitTitle:
    'imp-35592 (content, sonnet-4-6, sonnet): glossary/Concepts headword for imp-35574 ' +
    'peak-location amplification vs crossover log-damping contrast',
  duplicateOf: 'imp-35592',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). imp-35622 ' +
    'duplicates work already completed by imp-35592; no further glossary edit needed. ' +
    'The audited ~0.553 peak-location amplification factor rests on the inherited ' +
    'imp-3220/imp-3406 double-surrogate sigma(N); surrogate-vs-true fidelity (imp-35337a) ' +
    'stays OPEN. Changes no bound; establishes no operator positivity; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35574 (the peak-location-vs-crossover damping measurement); imp-35458 (the ~18x ' +
    'crossover log-damping baseline); imp-35592 (git commit that already added the ' +
    'requested headword); imp-35337a (surrogate-vs-true fidelity sub-gap, UNTOUCHED, ' +
    'inherited by the audited ~0.553 factor); imp-486 (C_mb GUE-conditional caveat, UNTOUCHED).',
};

export const IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT_ASSERTIONS = [
  {
    id: 'imp35622-audited-term-identified',
    description: 'the audited glossary file and term are named explicitly',
    holds: () =>
      IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT.auditedFile ===
        'src/data/glossary.js' &&
      IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT.auditedTerm ===
        'imp-35574 peak-location amplification vs crossover log-damping contrast',
  },
  {
    id: 'imp35622-requested-facts-recorded',
    description: 'the damping-factor and shift literals imp-35622 asked for are recorded',
    holds: () =>
      IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT.requestedFacts
        .crossoverDampingFactor === 18 &&
      IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT.requestedFacts
        .peakLocationShiftPercent === 43.99 &&
      IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT.requestedFacts
        .dampingRatioContrast === 32.55,
  },
  {
    id: 'imp35622-duplicate-of-imp35592-recorded',
    description: 'the ticket that already discharged this requirement is recorded',
    holds: () =>
      IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT.duplicateOf ===
      'imp-35592',
  },
  {
    id: 'imp35622-honesty-gate-no-qed',
    description:
      'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT.verdict) &&
      /refereed bound is changed/i.test(
        IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT.verdict
      ),
  },
  {
    id: 'imp35622-surrogate-fidelity-caveat-present',
    description:
      'the audited ~0.553 peak-amplification factor carries the imp-35337a surrogate-vs-true ' +
      'fidelity OPEN caveat in both the verdict and citation',
    holds: () =>
      /imp-35337a/.test(IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT.verdict) &&
      /imp-35337a/.test(IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT.citation),
  },
];

for (const a of IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35622-peak-crossover-damping-headword-already-satisfied-audit assertion failed: ${a.id}`
    );
  }
}

export default IMP35622_PEAK_CROSSOVER_DAMPING_HEADWORD_ALREADY_SATISFIED_AUDIT;
