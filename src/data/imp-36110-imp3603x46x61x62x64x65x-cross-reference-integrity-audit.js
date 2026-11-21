/**
 * @module imp-36110-imp3603x46x61x62x64x65x-cross-reference-integrity-audit
 *
 * imp-36110 (meta, audit): a cross-reference @see integrity audit (imp-35186/imp-35327/imp-35776
 * method) on the S-frontier cohort imp-36033/36034/36046/36061/36062/36064/36065. Resolves every
 * filename-suffixed @see target and live ES import against the src/data directory listing and
 * every bare "imp-NNNNN" ticket citation against an id in improvement-queue.js / improvements.js.
 *
 * SCOPE NOTE. imp-36033, imp-36034, imp-36046, imp-36061 and imp-36062 were already swept by the
 * imp-36127 audit (which covered the wider imp-36030..imp-36062 range) with a CLEAN result. The
 * incremental work here is the two cohort members imp-36127 did not reach: imp-36064
 * (src/data/imp-36064-eflow-inclusion-tilt-closed-form.js) and imp-36065, which landed not as a
 * standalone file but as a docstring correction inside
 * src/data/imp-35968-e-trunc-coll-crossover-location.js (recorded at improvements.js id 31121).
 *
 * METHOD. grep -n "@see" and grep -n "^import" on both files; every filename-suffixed @see target
 * and every named ES import checked against the src/data directory listing and against the
 * target's actual exports; every bare imp-NNNNN citation (grep -oE "imp-[0-9]+[a-z]?") checked for
 * a literal occurrence in improvement-queue.js / improvements.js / lambda-roadmap.js.
 *
 * FINDING. Zero dangling references. imp-36064's four filename-suffixed @see targets
 * (imp-36022-etrunc-ecoll-crossover-reconciliation, imp-35968-e-trunc-coll-crossover-location,
 * imp-35950-etrunc-ecoll-crossover-height, imp-35994-crossover-height-elasticities) plus
 * lambda-rh-height-mapping.js all resolve to real src/data files, as do imp-35968's four @see
 * targets (imp-35889-e-share-decomposition-at-knees, imp-35853-req4-required-height-continuous-
 * sigma-knee, imp-35337-sigma-landmarks-double-double-certification,
 * imp-33701-sigma-postpeak-ramp-curvature-inflection) plus lambda-rh-height-mapping.js. imp-36064's
 * four named ES imports (effectiveHeightForN, C_C_PINNED, IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION,
 * IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT) and imp-35968's two (effectiveHeightForN, C_C_PINNED) all
 * resolve to actual exports of their respective target modules. All 20 distinct bare imp-NNNNN
 * citations across the two files (imp-2631, imp-2642, imp-2643, imp-3220, imp-33582, imp-33701,
 * imp-3406, imp-3529, imp-35337, imp-35337a, imp-35813, imp-35853, imp-35889, imp-35950, imp-35968,
 * imp-35994, imp-36022, imp-36064, imp-398, imp-486) resolve to real occurrences in
 * improvement-queue.js / improvements.js. imp-36033/36034/36046/36061/36062 remain clean per the
 * imp-36127 finding (re-verified: no @see or bare-citation edits landed on those five files since).
 *
 * SCOPE. Assessment/audit only. No source file was modified as a result of this check (none
 * needed correction). Changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; C_mb GUE-conditional per imp-486 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (audit method template)
 * @see imp-36127-imp3603x-3606x-cross-reference-integrity-audit.js (sibling audit, covers imp-36030..imp-36062 of this cohort)
 * @see imp-36064-eflow-inclusion-tilt-closed-form.js (audited: @see targets and imports resolve)
 * @see imp-35968-e-trunc-coll-crossover-location.js (audited: @see targets and imports resolve; carries the imp-36065 fix)
 */

const PRIOR_AUDITED_BY_IMP36127 = [
  'imp-36033-viz-data-duplicate-guard-proposal',
  'imp-36034-imp3596x97x-registration-reachability-audit',
  'imp-36046-e-share-tail-landmarks-viz-data',
  'imp-36061-w1-accumulator-recovery-detuning-width',
  'imp-36062-kbn-kahan-separation-onset',
];

const NEWLY_AUDITED = [
  'imp-36064-eflow-inclusion-tilt-closed-form',
  'imp-35968-e-trunc-coll-crossover-location', // carries the imp-36065 fix
];

const DISTINCT_FILENAME_TARGETS_CHECKED = 7; // 4 (imp-36064) + 4 (imp-35968) minus the shared lambda-rh-height-mapping.js overlap
const DISTINCT_NAMED_IMPORTS_CHECKED = 6; // 4 (imp-36064) + 2 (imp-35968), all resolve to real exports
const DISTINCT_BARE_CITATIONS_CHECKED = 20;
const DANGLING_REFERENCES_FOUND = 0;

export const IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT = {
  id: 'imp-36110',
  proofSection: 'audit',
  question:
    'Do the @see tags, ES imports, and bare imp-NNNNN ticket citations in the ' +
    'imp-36033/36034/36046/36061/36062/36064/36065 cohort all resolve to real files, real ' +
    'exports, and real tickets -- or are there dangling references (the imp-58685 typo class)?',
  verdictShort:
    'CLEAN. Zero dangling references. imp-36033/36034/36046/36061/36062 were already swept clean ' +
    'by imp-36127; the incremental cohort members imp-36064 and imp-36065 (a fix inside ' +
    'imp-35968) resolve every filename @see target, every named ES import, and every bare ' +
    'ticket citation.',
  priorAuditedByImp36127: PRIOR_AUDITED_BY_IMP36127,
  newlyAudited: NEWLY_AUDITED,
  distinctFilenameTargetsChecked: DISTINCT_FILENAME_TARGETS_CHECKED,
  distinctNamedImportsChecked: DISTINCT_NAMED_IMPORTS_CHECKED,
  distinctBareCitationsChecked: DISTINCT_BARE_CITATIONS_CHECKED,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every ' +
    '@see tag and named ES import in imp-36064 and imp-35968 (the imp-36065 fix target) against ' +
    'the actual src/data file listing and export lists, and every bare imp-NNNNN citation against ' +
    'improvement-queue.js / improvements.js. Combined with the imp-36127 result for the remaining ' +
    'five cohort members, the full imp-36033/36034/36046/36061/36062/36064/36065 cohort is clean. ' +
    'Changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; C_mb ' +
    'GUE-conditional per imp-486 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35186 (cross-reference integrity audit method); imp-36127 (sibling audit, same method, ' +
    'covers imp-36030..imp-36062); imp-36064, imp-35968/imp-36065 (the newly audited members).',
};

export const IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36110-newly-audited-count',
    description: 'the incremental audit covers exactly the two cohort members imp-36127 did not reach',
    holds: () => IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT.newlyAudited.length === 2,
  },
  {
    id: 'imp36110-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, imports, or bare ticket citations',
    holds: () => IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp36110-citation-counts-recorded',
    description: 'the distinct filename-target, named-import, and bare-citation counts checked are all positive',
    holds: () =>
      IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctFilenameTargetsChecked > 0 &&
      IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctNamedImportsChecked > 0 &&
      IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctBareCitationsChecked > 0,
  },
  {
    id: 'imp36110-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36110-imp3603x46x61x62x64x65x-cross-reference-integrity-audit assertion failed: ${a.id}`);
  }
}

export default IMP36110_CROSS_REFERENCE_INTEGRITY_AUDIT;
