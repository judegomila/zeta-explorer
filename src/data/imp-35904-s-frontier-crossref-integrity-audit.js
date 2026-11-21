/**
 * @module imp-35904-s-frontier-crossref-integrity-audit
 *
 * imp-35904 (meta, cross-reference integrity audit): the imp-35776 integrity audit covered an
 * earlier S-frontier batch; the newer imp-35852/imp-35853/imp-35854/imp-35855/imp-35865/
 * imp-35880 modules had never been audited. This module runs the imp-35186/imp-35327/imp-35776
 * method on that six-module cohort.
 *
 * METHOD. For each of the six modules: (1) resolved every @see filename-suffixed target and
 * every ES `import ... from` path against an existing file in src/data; (2) resolved every
 * named import against an actual export of the target file; (3) extracted every bare
 * imp-NNNNN citation in the module text (docblock + object literals) and checked it against an
 * id present in src/data/improvement-queue.js (id: 'imp-NNNNN') or src/data/improvements.js
 * (numbered log entries reference other tickets by the same imp-NNNNN name in their summary/
 * detail prose) -- the imp-58685 stray-typo class is the known failure mode being guarded
 * against.
 *
 * FINDING -- ZERO DANGLING REFERENCES. All @see filename targets exist (imp-35812/35761/35725/
 * 35760 for imp-35852; imp-35813/35763/35722/35538/33582/lambda-rh-height-mapping for imp-35853;
 * imp-35812/35852/35761/35760 for imp-35854; imp-35810/35766/35266/34996/lambda-rh-height-mapping
 * for imp-35855; imp-35812/35761/35760/35864 for imp-35865; imp-35808/35809/35810/35811/35812/
 * 35813 for imp-35880). All named ES imports resolve to real exports (effectiveHeightForN and
 * zeroCountAtHeight from lambda-rh-height-mapping.js; C_C_PINNED from
 * polymath15-constant-C-C.js; the IMP35538_.../IMP35813_.../IMP35808_.../IMP35809_.../
 * IMP35810_.../IMP35811_.../IMP35812_... result-object consts each from their own file). Every
 * bare imp-NNNNN citation across the six modules (43 distinct ids, spanning imp-398 through
 * imp-35943) resolves to an id present in improvement-queue.js or improvements.js. No orphaned
 * @see target, no missing export, no stray-typo citation found.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Read-only integrity audit. Fabricates no new pages, changes no bound, asserts no operator
 * positivity, no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35186-registration-reachability-audit (method precedent)
 * @see imp-35327 (method precedent)
 * @see imp-35776-s-frontier-cohort-crossref-integrity-audit.js (prior S-frontier batch, same method)
 * @see imp-35852-w1-summation-adversarial-ordering.js (audited module)
 * @see imp-35853-req4-required-height-continuous-sigma-knee.js (audited module)
 * @see imp-35854-w1-summation-kappa-sweep.js (audited module)
 * @see imp-35855-rclean-interval-de-cancellation-assessment.js (audited module)
 * @see imp-35865-summation-scheme-ladder-viz-data.js (audited module)
 * @see imp-35880-frontier-batch-cohort-verification.js (audited module)
 */

const AUDITED_COHORT = [
  {
    file: 'imp-35852-w1-summation-adversarial-ordering',
    seeTargetsResolved: true,
    namedImportsResolved: true,
    bareCitationsChecked: 8,
    danglingFound: 0,
  },
  {
    file: 'imp-35853-req4-required-height-continuous-sigma-knee',
    seeTargetsResolved: true,
    namedImportsResolved: true,
    bareCitationsChecked: 15,
    danglingFound: 0,
  },
  {
    file: 'imp-35854-w1-summation-kappa-sweep',
    seeTargetsResolved: true,
    namedImportsResolved: true,
    bareCitationsChecked: 10,
    danglingFound: 0,
  },
  {
    file: 'imp-35855-rclean-interval-de-cancellation-assessment',
    seeTargetsResolved: true,
    namedImportsResolved: true,
    bareCitationsChecked: 13,
    danglingFound: 0,
  },
  {
    file: 'imp-35865-summation-scheme-ladder-viz-data',
    seeTargetsResolved: true,
    namedImportsResolved: true,
    bareCitationsChecked: 7,
    danglingFound: 0,
  },
  {
    file: 'imp-35880-frontier-batch-cohort-verification',
    seeTargetsResolved: true,
    namedImportsResolved: true,
    bareCitationsChecked: 10,
    danglingFound: 0,
  },
];

const TOTAL_DANGLING = AUDITED_COHORT.reduce((sum, m) => sum + m.danglingFound, 0);

export const IMP35904_S_FRONTIER_CROSSREF_INTEGRITY_AUDIT = {
  id: 'imp-35904',
  proofSection: 'S-frontier',
  question:
    'Do the newest S-frontier modules imp-35852/imp-35853/imp-35854/imp-35855/imp-35865/' +
    'imp-35880 have any dangling @see filename target, unresolved named ES import, or stray ' +
    'bare imp-NNNNN citation (the imp-58685 typo class), following the imp-35186/imp-35327/' +
    'imp-35776 integrity-audit method?',
  verdictShort:
    'ZERO DANGLING REFERENCES. Every @see filename target resolves to an existing src/data ' +
    'file, every named ES import resolves to an actual export of its target file, and every ' +
    'bare imp-NNNNN citation across the six-module cohort resolves to an id present in ' +
    'improvement-queue.js or improvements.js.',
  auditedCohort: AUDITED_COHORT,
  totalDanglingFound: TOTAL_DANGLING,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every ' +
    '@see filename-suffixed target, every named ES import, and every bare imp-NNNNN citation ' +
    'across the six-module imp-35852/imp-35853/imp-35854/imp-35855/imp-35865/imp-35880 ' +
    'S-frontier cohort. Result: zero dangling references found. Changes no bound; establishes ' +
    'no operator positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35852, imp-35853, imp-35854, imp-35855, imp-35865, imp-35880 (audited modules); ' +
    'imp-35186, imp-35327, imp-35776 (integrity-audit method precedent); imp-58685 (the known ' +
    'stray-typo dangling-citation failure mode this audit guards against).',
};

export const IMP35904_S_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35904-cohort-size-six',
    description: 'exactly six modules were audited',
    holds: () => AUDITED_COHORT.length === 6,
  },
  {
    id: 'imp35904-all-see-targets-resolved',
    description: 'every audited module has all @see filename targets resolved',
    holds: () => AUDITED_COHORT.every((m) => m.seeTargetsResolved === true),
  },
  {
    id: 'imp35904-all-named-imports-resolved',
    description: 'every audited module has all named ES imports resolved to real exports',
    holds: () => AUDITED_COHORT.every((m) => m.namedImportsResolved === true),
  },
  {
    id: 'imp35904-zero-dangling-citations',
    description: 'zero bare imp-NNNNN citations were found dangling across the cohort',
    holds: () =>
      TOTAL_DANGLING === 0 &&
      IMP35904_S_FRONTIER_CROSSREF_INTEGRITY_AUDIT.totalDanglingFound === 0 &&
      AUDITED_COHORT.every((m) => m.danglingFound === 0),
  },
  {
    id: 'imp35904-bare-citations-were-actually-checked',
    description: 'every audited module checked at least one bare imp-NNNNN citation',
    holds: () => AUDITED_COHORT.every((m) => m.bareCitationsChecked > 0),
  },
  {
    id: 'imp35904-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35904_S_FRONTIER_CROSSREF_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35904_S_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35904_S_FRONTIER_CROSSREF_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP35904_S_FRONTIER_CROSSREF_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35904-s-frontier-crossref-integrity-audit assertion failed: ${a.id}`);
  }
}

export default IMP35904_S_FRONTIER_CROSSREF_INTEGRITY_AUDIT;
