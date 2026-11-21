/**
 * @module imp-35614-bs3-dt4-3x3-guard-already-satisfied-audit
 *
 * imp-35614 (accuracy, audit): the ticket asked to add a run-assertions.mjs
 * regression-guard pinning the imp-35573 N=2000 BS3 dt/4 endpoint-positivity cell
 * (endpointPositive=false, g_curr=-4.254687e-6, step 4014, pair-1495,
 * t_c=1.1923274308e-3) AND the completed imp-35506 full 3x3 (DP45/RK4/BS3 x
 * dt, dt/2, dt/4) family-x-grid matrix invariant that EXACTLY ONE endpoint-positive
 * cell (DP45 dt/2) remains, asserting the baked BS3 dt/4 sign/gap/step/pair literals
 * to storage-precision tolerance.
 *
 * FINDING. Reading scripts/run-assertions.mjs and src/data shows the requested
 * regression-guard is ALREADY PRESENT: the module
 * src/data/imp-35602-bs3-dt4-3x3-endpoint-positivity-assertions.js (registered in
 * the run-assertions.mjs DATA sweep) imports the three lightweight reference modules
 * (imp-35452 DP45/RK4 signs at dt, dt/2, dt/4; imp-35477 BS3 at dt, dt/2; imp-35573
 * BS3 at dt/4 -- none pulls the 16.7MB zeros bundle), assembles the full 3x3
 * endpoint-positive boolean map, and asserts (a) the imp-35573 BS3 dt/4 literals
 * reproduce (endpointPositive=false, step 4014, cross_index 1495,
 * g_curr=-4.254687e-6 to ~1e-6 tol, t_c=1.1923274308e-3), (b) the completed 3x3 has
 * exactly ONE endpoint-positive cell, DP45 dt/2, and (c) the eight other cells are
 * all endpoint-negative. This is exactly the imp-35614 requirement.
 *
 * DISPOSITION. No new run-assertions module added in this ticket: the imp-35602
 * commit already discharged this exact requirement, and adding a second guard over
 * the identical baked constants and the same 3x3 count invariant would be redundant
 * duplication. This module records the duplicate-ticket finding so the completed
 * status is auditable. Changes no bound; adopts no new slack denominator (imp-35412
 * keeps the endpoint DP45 dt/2 worst-case); does not advance the R2 ladder; does not
 * extend the C_mb certificate; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/4" and "g_curr".
 *
 * @see src/data/imp-35602-bs3-dt4-3x3-endpoint-positivity-assertions.js (the run-assertions guard already pinning the cell + 3x3 invariant)
 * @see src/data/imp-35573-n2000-bs3-dt4-endpoint-positivity-reference.js (source of the BS3 dt/4 literals)
 * @see imp-35602 (git commit that already added the requested run-assertions guard)
 * @see imp-35613-reentry-band-decade-gap-guard-already-satisfied-audit.js (sibling duplicate-ticket audit, same closure pattern)
 */

export const IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT = {
  id: 'imp-35614',
  proofSection: 'audit',
  auditedFile: 'src/data/imp-35602-bs3-dt4-3x3-endpoint-positivity-assertions.js',
  auditedRegistration: 'scripts/run-assertions.mjs',
  requestedFacts: {
    bs3_dt4_endpointPositive: false,
    bs3_dt4_g_curr: -4.254687e-6,
    bs3_dt4_step: 4014,
    bs3_dt4_cross_index: 1495,
    bs3_dt4_t_c: 1.1923274308e-3,
    cells_total: 9,
    endpoint_positive_cells: 1,
    lone_positive_family: 'DP45',
    lone_positive_grid: 'dt/2',
  },
  question:
    'Does a run-assertions.mjs regression-guard already pin the imp-35573 BS3 dt/4 ' +
    'endpoint-positivity cell literals (sign/gap/step/pair/t_c) and the completed 3x3 ' +
    'matrix invariant that exactly ONE endpoint-positive cell (DP45 dt/2) remains, or ' +
    'does imp-35614 still need to add one?',
  finding:
    'ALREADY SATISFIED. src/data/imp-35602-bs3-dt4-3x3-endpoint-positivity-assertions.js ' +
    '(registered in the run-assertions.mjs DATA sweep) imports imp-35452 / imp-35477 / ' +
    'imp-35573, assembles the full 3x3 (DP45/RK4/BS3 x dt, dt/2, dt/4) endpoint-positive ' +
    'boolean map, and asserts the imp-35573 BS3 dt/4 literals reproduce ' +
    '(endpointPositive=false, step 4014, cross_index 1495, g_curr=-4.254687e-6 to ~1e-6 ' +
    'storage-precision tol, t_c=1.1923274308e-3) AND that exactly ONE cell -- DP45 dt/2 ' +
    '-- is endpoint-positive while the other eight are endpoint-negative. Every literal ' +
    'and the structural count invariant imp-35614 asks to guard is already asserted.',
  priorFixingCommitTitle:
    'imp-35602 (accuracy, opus-4-8, api-pool): run-assertions module pinning the ' +
    'imp-35573 BS3 dt/4 endpoint-positivity cell + the completed 3x3 (DP45/RK4/BS3 x ' +
    'dt,dt/2,dt/4) exactly-one-positive-cell (DP45 dt/2) invariant, assembled from ' +
    'imp-35452/imp-35477/imp-35573 references',
  duplicateOf: 'imp-35602',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a new measurement). imp-35614 duplicates the ' +
    'run-assertions guard already added by imp-35602; no further module needed. ' +
    'Changes no bound; adopts no new slack denominator (imp-35412 keeps the endpoint ' +
    'DP45 dt/2 worst-case); C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35573 (the baked BS3 dt/4 endpoint-positivity cell); imp-35506 (the 3x2 ' +
    'endpoint-positivity matrix this cell completed to 3x3); imp-35452 (DP45/RK4 signs ' +
    'at dt, dt/2, dt/4); imp-35477 (BS3 signs at dt, dt/2); imp-35412 (endpoint DP45 ' +
    'dt/2 worst-case kept); imp-35602 (git commit that already added the run-assertions ' +
    'guard); imp-486 (C_mb GUE-conditional caveat, UNTOUCHED).',
};

export const IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT_ASSERTIONS = [
  {
    id: 'imp35614-audited-guard-identified',
    description: 'the audited run-assertions guard module and its registration file are named explicitly',
    holds: () =>
      IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT.auditedFile ===
        'src/data/imp-35602-bs3-dt4-3x3-endpoint-positivity-assertions.js' &&
      IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT.auditedRegistration ===
        'scripts/run-assertions.mjs',
  },
  {
    id: 'imp35614-requested-literals-recorded',
    description: 'the BS3 dt/4 cell literals and the 3x3 one-positive-cell invariant imp-35614 asked to guard are recorded',
    holds: () => {
      const f = IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT.requestedFacts;
      return (
        f.bs3_dt4_endpointPositive === false &&
        f.bs3_dt4_step === 4014 &&
        f.bs3_dt4_cross_index === 1495 &&
        f.bs3_dt4_g_curr < 0 &&
        Math.abs(f.bs3_dt4_g_curr - -4.254687e-6) < 1e-6 &&
        Math.abs(f.bs3_dt4_t_c - 1.1923274308e-3) < 1e-9 &&
        f.cells_total === 9 &&
        f.endpoint_positive_cells === 1 &&
        f.lone_positive_family === 'DP45' &&
        f.lone_positive_grid === 'dt/2'
      );
    },
  },
  {
    id: 'imp35614-duplicate-of-imp35602-recorded',
    description: 'the ticket that already discharged this requirement is recorded',
    holds: () =>
      IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT.duplicateOf === 'imp-35602',
  },
  {
    id: 'imp35614-honesty-gate-no-qed',
    description:
      'Audit only: no bound changed, no new slack denominator, C_mb GUE-conditional per imp-486, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT.isRigorous === false &&
      /imp-486 UNTOUCHED/.test(IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT.verdict) &&
      /NO QED/.test(IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT.verdict),
  },
];

for (const a of IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35614-bs3-dt4-3x3-guard-already-satisfied-audit assertion failed: ${a.id}`
    );
  }
}

export default IMP35614_BS3_DT4_3x3_GUARD_ALREADY_SATISFIED_AUDIT;
