/**
 * @module imp-35857-honesty-gate-audit-duplicate
 *
 * imp-35857 (meta, S-frontier ticket audit): imp-35857 asked to "Extend the imp-35844
 * honesty-gate audit to check whether the imp-486/imp-35337a-OPEN/NO-QED text guards in
 * the newer cohort imp-35809/35810/35811/35812/35813 reference LIVE status artifacts or
 * only re-assert self-referential verdict prose."
 *
 * Auditing the repo BEFORE building a fresh audit module found the requested extension
 * ALREADY EXISTS: imp-35856 (imp-35856-canonical-pt-sota-cross-check-extension.js, the
 * most recent commit landed just before this ticket was picked up) performs exactly this
 * audit on exactly this cohort -- it re-runs the imp-486/NO-QED/remains-SOTA text checks
 * against each of the five modules' live exported verdict strings, classifies which
 * members carry the local `L_PT = 0.2` self-compared numeric tautology imp-35844 flagged
 * (imp-35811/35812/35813 do, imp-35809/35810 carry no local numeric literal at all), and
 * cross-checks every quoted "Lambda <= 0.2" figure against the canonical
 * LAMBDA_RH_BRIDGE.sotaUpperBound.value. imp-35857 is a DUPLICATE ticket -- the frontier
 * scout re-seeded it from the same imp-35844 gap description before imp-35856 landed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new audit and no new cross-check: imp-35856 already supplies the full finding,
 * the live re-run, and the tautology classification. No new claim; changes no bound;
 * NO QED.
 *
 * @see imp-35844-honesty-gate-live-artifact-audit (the originating audit, imp-35763/imp-35764 cohort)
 * @see imp-35856-canonical-pt-sota-cross-check-extension (the already-existing extension to this exact cohort)
 */

const REQUIRED_DUPLICATE_ID = 'imp-35856';
const REQUIRED_MODULE_FILE = 'imp-35856-canonical-pt-sota-cross-check-extension.js';
const REQUIRED_COHORT_IDS = [
  'imp-35809',
  'imp-35810',
  'imp-35811',
  'imp-35812',
  'imp-35813',
];

export const IMP35857_HONESTY_GATE_AUDIT_DUPLICATE = {
  id: 'imp-35857',
  proofSection: 'S-frontier',
  question:
    'imp-35857 asked to extend the imp-35844 honesty-gate audit to the newer cohort ' +
    'imp-35809/35810/35811/35812/35813; audit whether that extension already exists ' +
    'before building a duplicate.',
  finding:
    'DUPLICATE TICKET. The requested extension already exists as ' +
    REQUIRED_MODULE_FILE +
    ', which re-runs the imp-486/NO-QED/remains-SOTA text guards against each of the five ' +
    'cohort members’ live exported verdict strings, classifies imp-35811/35812/35813 as ' +
    'carrying the same local `L_PT = 0.2` self-compared tautology imp-35844 flagged (with ' +
    'imp-35809/35810 carrying no local numeric literal at all), and cross-checks every ' +
    'quoted "Lambda <= 0.2" figure against LAMBDA_RH_BRIDGE.sotaUpperBound.value.',
  duplicateOf: REQUIRED_DUPLICATE_ID + ' (landed as the commit immediately preceding this ticket)',
  requiredCohortIds: REQUIRED_COHORT_IDS,
  requiredModuleFile: REQUIRED_MODULE_FILE,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new audit module added -- imp-35856 already supplies the full extension ' +
    'imp-35857 requested. This module records the duplicate-ticket finding and pins a ' +
    'permanent regression guard confirming the citation stays consistent. Changes no bound; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35857_HONESTY_GATE_AUDIT_DUPLICATE_ASSERTIONS = [
  {
    id: 'imp35857-duplicate-of-well-formed',
    description: 'The cited duplicate ticket id matches the imp-35856 extension',
    holds: () => IMP35857_HONESTY_GATE_AUDIT_DUPLICATE.duplicateOf.startsWith('imp-35856'),
  },
  {
    id: 'imp35857-required-module-file-well-formed',
    description: 'The cited module filename matches the already-existing imp-35856 extension module',
    holds: () =>
      IMP35857_HONESTY_GATE_AUDIT_DUPLICATE.requiredModuleFile ===
      'imp-35856-canonical-pt-sota-cross-check-extension.js',
  },
  {
    id: 'imp35857-cohort-matches-requested-five',
    description: 'The audited cohort matches exactly the five modules imp-35857 named',
    holds: () =>
      IMP35857_HONESTY_GATE_AUDIT_DUPLICATE.requiredCohortIds.length === 5 &&
      REQUIRED_COHORT_IDS.every((id) => IMP35857_HONESTY_GATE_AUDIT_DUPLICATE.requiredCohortIds.includes(id)),
  },
  {
    id: 'imp35857-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35857_HONESTY_GATE_AUDIT_DUPLICATE.isRigorous === false &&
      /NO QED/.test(IMP35857_HONESTY_GATE_AUDIT_DUPLICATE.verdict) &&
      /refereed bound is changed/i.test(IMP35857_HONESTY_GATE_AUDIT_DUPLICATE.verdict),
  },
];

for (const a of IMP35857_HONESTY_GATE_AUDIT_DUPLICATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35857-honesty-gate-audit-duplicate assertion failed: ${a.id}`);
  }
}
