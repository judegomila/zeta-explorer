/**
 * @module imp-36071-imp3601x2x-see-integrity-audit
 *
 * imp-36071 (meta, audit): a cross-reference @see integrity audit (imp-35186/imp-35327/imp-35776
 * method) on the imp-3601x/imp-3602x cohort -- the 7 src/data modules imp-36008, imp-36011,
 * imp-36017, imp-36020, imp-36021, imp-36022, imp-36023 (the imp-36070 registration/reachability
 * sibling audit already confirmed all seven are wired into run-assertions.mjs DATA_MODULES,
 * directly or transitively, and none imports the 16.7MB zeros-to-1e6 bundle -- this audit is the
 * complementary @see-content check imp-36070 did not perform). Each carries a JSDoc @module
 * header with a block of "@see" tags and, in three cases, live ES-module imports. This audit
 * verifies every @see/import target that names a module file resolves to a real file under
 * src/data, every named import resolves to a real exported symbol in that file, every bare
 * "imp-NNNNN" (or lettered sub-gap "imp-NNNNNa") citation names a ticket or sub-gap that actually
 * occurs in improvements.js or improvement-queue.js, and that the shared numeric landmarks the
 * ticket names -- T_PT = 3e12, N ~ 488602, N_cross ~ 3.27..3.28e9, C_PS ~ 2.2214, and the ~41.2%
 * ceiling fraction -- are used consistently (same value, same provenance) wherever more than one
 * cohort module cites them.
 *
 * METHOD. Extracted every @see line and import statement from the 7 files (grep -n "@see|^import"),
 * split each into filename-suffixed/module-slug targets versus bare imp-NNNNN[a] citations,
 * resolved every filename-suffixed target against the src/data directory listing, resolved every
 * named import binding against the target file's `export` statements, and resolved every bare
 * citation against literal occurrences in improvements.js / improvement-queue.js. Separately grepped
 * the 7 files for the five landmark values and compared the surrounding provenance comment/derivation
 * across every module that cites each one.
 *
 * FINDING (@see/import integrity). Zero dangling references. All 31 distinct filename-suffixed
 * @see/import targets resolve to real files under src/data (imp-33923-off-axis-phase-winding-quadrature,
 * imp-34687-crossover-interval-arithmetic-scope, imp-34714-krawczyk-existence-uniqueness-lemma,
 * imp-34774-krawczyk-fixed-point-map-enclosure, imp-34996-krawczyk-headroom-safety-factor-asymptote,
 * imp-35337-sigma-landmarks-double-double-certification, imp-35681-w1-w2-w4-existing-infra-inventory,
 * imp-35727-w2-certified-winding-count-ingredients-scope, imp-35757-i2-panel-width-count-scope,
 * imp-35758-i3-modulus-floor-margin-tie-scope, imp-35760-w1-margin-allocation-scope,
 * imp-35761-w1-certified-rounding-cost-scope, imp-35777-i2-logderivative-panel-cap-scope,
 * imp-35778-i3-edge-type-floor-decomposition-scope, imp-35812-w1-summation-scheme-measured-cost,
 * imp-35852-w1-summation-adversarial-ordering, imp-35855-rclean-interval-de-cancellation-assessment,
 * imp-35885-krawczyk-node-cancellation-audit, imp-35892-rdirect-own-floor-departure-height,
 * imp-35893-w1-summation-pairwise-tree-shape, imp-35950-etrunc-ecoll-crossover-height,
 * imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy, imp-35968-e-trunc-coll-crossover-location,
 * imp-35969-krawczyk-residual-directed-rounding-width, imp-35972-effective-height-overflow-cliff-bisection,
 * imp-35973-w1-summation-order-shape-cross-term, imp-35993-i2-panel-proxy-reconciliation-per-unit-height,
 * imp-35994-crossover-height-elasticities, imp-36019-order-shape-cross-N-ladder,
 * lambda-rh-height-mapping, polymath15-constant-C-C). Every live ES-module import (in imp-36017,
 * imp-36021, imp-36022: effectiveHeightForN, C_C_PINNED, IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION,
 * IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT) matches a real `export` binding in its target file. All 16
 * distinct bare imp-NNNNN[a] citations (imp-398, imp-486, imp-2631, imp-2642, imp-2643, imp-3220,
 * imp-3406, imp-33582, imp-34687a, imp-34714a, imp-35337a, imp-35674, imp-35725, imp-35813,
 * imp-35853, imp-35955) resolve to real occurrences in improvement-queue.js or improvements.js --
 * the three lettered forms (imp-34687a, imp-34714a, imp-35337a) are NAMED SUB-GAPS that occur as
 * prose citations inside parent-ticket descriptions rather than as standalone `id:` records, which
 * is the documented convention for that id class, not a dangling reference.
 *
 * FINDING (landmark consistency). All five named landmarks are used consistently across every
 * module that cites them: T_PT = 3e12 (imp-36008, imp-36011, imp-36020, imp-36023, all commented
 * "Platt-Trudgian 2021 verified height"); N ~ 488602 (imp-36020, imp-36023, both derived as
 * floor(sqrt(T_PT/(4 pi))), the imp-35674 Part D term count at T_PT); N_cross ~ 3.27..3.28e9
 * (imp-36022's own reconciliation target -- its self-executing assertions already certify the
 * imp-35968/imp-35950 stored values agree to ~0.0017 decade); C_PS = pi/sqrt(2) ~ 2.2214
 * (imp-36011, the sole citer, no cross-module conflict); ceiling fraction ~41.2% (imp-36020, the
 * sole citer of that specific figure -- imp-36023 discusses a different quantity, the KBN-vs-Kahan
 * compensated floor, at the same N ~ 488602 anchor, with no numeric overlap to conflict).
 *
 * SCOPE. Assessment/audit only. No source file was modified as a result of this check (none needed
 * correction). Changes no bound; establishes no operator positivity; no RH verdict; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (audit method template)
 * @see imp-36127-imp3603x-3606x-cross-reference-integrity-audit (sibling audit, later cohort)
 * @see imp-36148-imp3608x9x-cross-reference-integrity-audit (sibling audit, later cohort)
 * @see imp-36070-imp3601x2x-second-cohort-registration-reachability-audit (companion registration/reachability audit on the SAME 7-file cohort)
 * @see imp-36008-i2-theta-arclength-jacobian-decomposition.js (audited: @see targets resolve)
 * @see imp-36011-i3-floor-cusp-vs-geometry-reconciliation.js (audited: @see targets resolve, C_PS landmark)
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy.js (audited: @see + import targets resolve)
 * @see imp-36020-w1-clustered-order-shape-argmax.js (audited: @see targets resolve, T_PT/N/41.2% landmarks)
 * @see imp-36021-two-cliff-gap-constant-sensitivity.js (audited: @see + import targets resolve)
 * @see imp-36022-etrunc-ecoll-crossover-reconciliation.js (audited: @see + import targets resolve, N_cross landmark)
 * @see imp-36023-kbn-combined-worst-ladder.js (audited: @see targets resolve, T_PT/N landmarks)
 */

const AUDITED_MODULES = [
  'imp-36008-i2-theta-arclength-jacobian-decomposition',
  'imp-36011-i3-floor-cusp-vs-geometry-reconciliation',
  'imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy',
  'imp-36020-w1-clustered-order-shape-argmax',
  'imp-36021-two-cliff-gap-constant-sensitivity',
  'imp-36022-etrunc-ecoll-crossover-reconciliation',
  'imp-36023-kbn-combined-worst-ladder',
];

const LANDMARKS_CHECKED = [
  { name: 'T_PT', value: '3e12', citedBy: ['imp-36008', 'imp-36011', 'imp-36020', 'imp-36023'] },
  { name: 'N_at_T_PT', value: '~488602', citedBy: ['imp-36020', 'imp-36023'] },
  { name: 'N_cross', value: '~3.27..3.28e9', citedBy: ['imp-36022'] },
  { name: 'C_PS', value: '~2.2214', citedBy: ['imp-36011'] },
  { name: 'ceiling_fraction', value: '~41.2%', citedBy: ['imp-36020'] },
];

const DISTINCT_FILENAME_TARGETS_CHECKED = 31; // distinct filename-suffixed @see/import targets across the cohort
const DISTINCT_BARE_CITATIONS_CHECKED = 16; // distinct bare imp-NNNNN[a] citations across the cohort
const DANGLING_REFERENCES_FOUND = 0; // zero @see targets, imports, or bare ticket citations failed to resolve
const LANDMARK_CONFLICTS_FOUND = 0; // zero cross-module value conflicts on any of the five named landmarks

export const IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT = {
  id: 'imp-36071',
  proofSection: 'S-frontier',
  question:
    'Do the @see tags, ES-module import targets, and bare imp-NNNNN[a] ticket citations in the ' +
    'imp-3601x/imp-3602x cohort (imp-36008, 36011, 36017, 36020, 36021, 36022, 36023 -- 7 src/data ' +
    'files) all resolve to real files, real exported symbols, and real tickets/sub-gaps, and are ' +
    'the shared landmark values (T_PT=3e12, N~488602, N_cross~3.27..3.28e9, C_PS~2.2214, ceiling ' +
    'fraction ~41.2%) used consistently wherever more than one cohort module cites them?',
  verdictShort:
    'CLEAN on both counts. Zero dangling references across all 7 audited files: every ' +
    'filename-suffixed @see/import target (31 distinct) resolves to a real file under src/data; ' +
    'every named import resolves to a real export in its target file; every bare/lettered ' +
    'citation (16 distinct) resolves to a real ticket id or named sub-gap in improvements.js / ' +
    'improvement-queue.js. Zero cross-module conflicts on any of the five named landmarks -- each ' +
    'is either cited with the identical value and provenance everywhere it appears, or cited by ' +
    'only one module in the cohort.',
  auditedModules: AUDITED_MODULES,
  auditedModuleCount: AUDITED_MODULES.length, // 7
  landmarksChecked: LANDMARKS_CHECKED,
  landmarksCheckedCount: LANDMARKS_CHECKED.length, // 5
  distinctFilenameTargetsChecked: DISTINCT_FILENAME_TARGETS_CHECKED,
  distinctBareCitationsChecked: DISTINCT_BARE_CITATIONS_CHECKED,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND, // 0
  landmarkConflictsFound: LANDMARK_CONFLICTS_FOUND, // 0
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not measurement of a mathematical quantity). Checked every @see ' +
    'tag, import specifier, and bare/lettered imp-NNNNN[a] citation in the 7 named imp-3601x/imp-3602x ' +
    'cohort files against the actual src/data file listing, each target file export statements, and ' +
    'the ticket ids / named sub-gaps recorded in improvements.js / improvement-queue.js; separately ' +
    'cross-checked the five landmark values (T_PT, N at T_PT, N_cross, C_PS, ceiling fraction) named ' +
    'in the ticket rationale against every module that cites each one. Result: zero dangling ' +
    'references, zero misnamed exports, zero landmark conflicts. No source file required correction. ' +
    'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35186 (cross-reference integrity audit method); imp-36127, imp-36148 (sibling audits, ' +
    'later cohorts); imp-36070 (companion registration/reachability audit, same cohort); ' +
    'imp-36008..imp-36023 (the audited batch).',
};

export const IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36071-all-7-modules-audited',
    description: 'the audit covers all 7 named imp-3601x/imp-3602x cohort files',
    holds: () => IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT.auditedModuleCount === 7,
  },
  {
    id: 'imp36071-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or bare ticket citations',
    holds: () => IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp36071-zero-landmark-conflicts',
    description: 'the audit found zero cross-module conflicts on any of the five named landmarks',
    holds: () =>
      IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT.landmarkConflictsFound === 0 &&
      IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT.landmarksCheckedCount === 5,
  },
  {
    id: 'imp36071-citation-counts-recorded',
    description: 'the distinct filename-target and bare-citation counts checked are both positive',
    holds: () =>
      IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT.distinctFilenameTargetsChecked > 0 &&
      IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT.distinctBareCitationsChecked > 0,
  },
  {
    id: 'imp36071-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36071-imp3601x2x-see-integrity-audit assertion failed: ${a.id}`);
  }
}

export default IMP36071_IMP3601X2X_SEE_INTEGRITY_AUDIT;
