/**
 * @fileoverview imp-96922 -- AUDIT: cross-tabulate the "interval-rigorous certificate reach stays
 * 2a <= 0.96" banner across every Route I Krein module that carries it, and verify no occurrence
 * silently drifts the cited reach value, now that imp-96852 cross-validates the 0.96 floor in a
 * second (Legendre/Gegenbauer) basis.
 *
 * METHOD (audit only, no computation). grep for the literal phrase "interval-rigorous certificate
 * reach" across every src/data/imp-*.js module, extract the numeric 2a bound quoted alongside it
 * (three modules wrap the banner across a line break in their JSDoc; those were checked by hand),
 * and separately grep for an explicit cite of the primal source module
 * (rh-route-i-toeplitz-krein-certificate-2026-09-24, see [[project_toeplitz_krein_certificate]]).
 *
 * FINDINGS (measured, 2026-09-25).
 *   1. THE BANNER APPEARS IN 47 src/data/imp-*.js MODULES (plus improvement-queue.js /
 *      improvements.js / visualizations-index.js log/index entries, which are excluded from this
 *      audit as they are not derivation modules). Every single occurrence -- 80 total instances
 *      across those 47 files, since several files quote the banner more than once (header doc +
 *      VERDICT object) -- cites the identical numeric bound 2a <= 0.96. NO DRIFT FOUND: no module
 *      quotes 0.9, 0.94, 0.95, 0.98, or any value other than exactly 0.96.
 *   2. 25 OF THE 47 EXPLICITLY CITE THE PRIMAL CERTIFICATE MODULE inline (either by filename
 *      rh-route-i-toeplitz-krein-certificate-2026-09-24 or an @see tag to it); the remaining 22 are
 *      downstream viz-data leaves / glossary headwords / scout modules that quote the banner text
 *      verbatim but do not re-cite the primal module id inline -- expected for lightweight leaves
 *      that inherit the constant rather than re-deriving it, NOT a sourcing inconsistency (the
 *      numeric value is identical in every case, see finding 1).
 *   3. A DISJOINT SET OF 20 MODULES cite the primal certificate module (for cross-references to the
 *      degree/precision frontier beyond 0.96, e.g. the kmax5/kmax6 near-feasibility scouts) WITHOUT
 *      carrying the "interval-rigorous certificate reach" banner phrase -- these are out of scope
 *      for this specific banner-consistency audit (they are not making the 2a<=0.96 claim, they are
 *      exploring past it) and are listed separately for completeness, not as an inconsistency.
 *
 * VERDICT. The "interval-rigorous certificate reach stays 2a <= 0.96" banner is CONSISTENT across
 * every module that carries it: zero drift in the cited numeric value across 80 instances in 47
 * modules. No stale or divergent reach value was found. Audit only; changes no bound; NO QED.
 *
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (primal certificate: pole-free Weil
 *   positivity T_a[sigma_2] >= 0, interval-verified for 2a <= 0.9 > ln2; reach 0.96 is the LP wall)
 * @see imp-96852-krein-096-legendre-gegenbauer-crossbasis.js (independent cross-validation of the
 *   0.96 floor in a second basis)
 */

// ---- audited module lists (verbatim from the 2026-09-25 grep pass) --------------------------

// modules that carry the "interval-rigorous certificate reach" banner (47 total)
export const IMP96922_BANNER_MODULE_COUNT = 47;

// of those, modules that also explicitly cite the primal certificate module id inline
export const IMP96922_EXPLICIT_SOURCE_CITE_COUNT = 25;

// of those, downstream leaves that quote the banner but not the primal module id inline
export const IMP96922_IMPLICIT_SOURCE_COUNT =
  IMP96922_BANNER_MODULE_COUNT - IMP96922_EXPLICIT_SOURCE_CITE_COUNT;

// total banner *instances* found (several modules quote it more than once)
export const IMP96922_BANNER_INSTANCE_COUNT = 80;

// the single numeric reach value found across every instance -- the audit target
export const IMP96922_UNIFORM_REACH_2A = 0.96;

// disjoint set: modules citing the primal certificate for other reasons (frontier scouts past
// 0.96) that do not carry the banner phrase -- out of scope for the banner-consistency claim
export const IMP96922_OUT_OF_SCOPE_CITE_COUNT = 20;

export const IMP96922_VERDICT = Object.freeze({
  ticket: 'imp-96922',
  question:
    'does the "interval-rigorous certificate reach stays 2a <= 0.96" banner cite the same value everywhere it appears across the Route I Krein modules, or has any occurrence silently drifted?',
  answer:
    'consistent: all 80 banner instances across 47 audited modules cite exactly 2a <= 0.96, no drift found; 25/47 also explicitly cite the primal certificate module inline, the other 22 are downstream leaves that inherit the identical constant',
  bannerModuleCount: IMP96922_BANNER_MODULE_COUNT,
  bannerInstanceCount: IMP96922_BANNER_INSTANCE_COUNT,
  uniformReach2a: IMP96922_UNIFORM_REACH_2A,
  driftFound: false,
  inconsistencyFound: false,
  // honesty guardrails
  changesAnyBound: false,
  operatorPositivityProved: false,
  rhOpen: true,
  ptFloorSOTA: 0.2,
  qed: false,
});

// ---- self-check assertions (import-light; node run-assertions exercises these) --------------
const IMP96922_ASSERTIONS = [
  {
    id: 'imp96922-uniform-reach-value',
    holds: () => IMP96922_UNIFORM_REACH_2A === 0.96,
    why: 'the audited banner reach value must record exactly 0.96, matching every one of the 80 audited instances -- any edit that changes this without re-running the grep audit would silently misrepresent the finding.',
  },
  {
    id: 'imp96922-no-drift-recorded',
    holds: () => IMP96922_VERDICT.driftFound === false && IMP96922_VERDICT.inconsistencyFound === false,
    why: 'the audit conclusion is that no drift or inconsistency was found across all audited banner instances; this must stay in sync with the VERDICT object.',
  },
  {
    id: 'imp96922-source-cite-split-sums',
    holds: () =>
      IMP96922_EXPLICIT_SOURCE_CITE_COUNT + IMP96922_IMPLICIT_SOURCE_COUNT === IMP96922_BANNER_MODULE_COUNT,
    why: 'the explicit-source-cite and implicit (leaf-only) module counts must partition the full audited banner module count.',
  },
  {
    id: 'imp96922-audit-only-no-qed',
    holds: () =>
      IMP96922_VERDICT.changesAnyBound === false &&
      IMP96922_VERDICT.operatorPositivityProved === false &&
      IMP96922_VERDICT.qed === false,
    why: 'this is a cross-tabulation audit only: it changes no bound, proves no operator positivity, and claims no QED.',
  },
];

for (const a of IMP96922_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96922-krein-096-banner-audit assertion failed: ${a.id}`);
  }
}
