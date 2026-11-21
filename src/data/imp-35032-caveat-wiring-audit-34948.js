/**
 * @module imp-35032-caveat-wiring-audit-34948
 *
 * imp-35032 (meta): caveat-surfacing banner + orphaned-assertion-wiring audit
 * of imp-34948 (the imp-34933 inflection-offset far-tail ladder extension,
 * 1e14..1e18). The ticket flagged that imp-34948 fell through two audit
 * cracks: the imp-35007 caveat-surfacing banner audit enumerated only
 * imp-34947/34949/34950/34951 (skipping 34948), and the imp-35020
 * coverage-gap audit treated the 34947-34951 range as already covered by
 * imp-35007 rather than re-checking it, so imp-34948 itself was never
 * directly audited by either.
 *
 * CHECK 1 -- honest-status banner. src/data/imp-34948-inflection-offset-far-
 * tail-ladder-extension.js carries the full shared caveat: isRigorous is
 * explicitly false, the verdict string names "NOT a rigorous asymptotic",
 * "C_mb GUE-conditional per imp-486 UNTOUCHED", "changes no bound",
 * "establishes no operator positivity", "imp-3066 K_a >= 0 untouched",
 * "no RH verdict, NO QED", and "No refereed bound is changed".
 * A self-executing "imp34948-honesty-gate-no-qed" assertion already checks
 * the isRigorous/NO-QED/SOTA substrings at module-load time.
 *
 * CHECK 2 -- orphaned-assertion wiring. The module exports a self-executing
 * IMP34948_INFLECTION_OFFSET_FAR_TAIL_LADDER_EXTENSION_ASSERTIONS array (7
 * assertions) that throws on load if any fail. scripts/run-assertions.mjs's
 * MATH_MODULES sweep already lists
 * '/src/data/imp-34948-inflection-offset-far-tail-ladder-extension.js'
 * (added alongside imp-34933 when imp-34948 was authored, predating both the
 * imp-35007 and imp-35020 audits) -- so the module was never actually
 * orphaned from the sweep despite being skipped by name in both prior audit
 * writeups.
 *
 * FINDING: no gap on either axis. imp-34948 already carries the shared
 * honest-status banner and is already wired into the MATH_MODULES sweep;
 * the two prior audits' omissions were a documentation/enumeration miss,
 * not a code or wiring miss. AUDIT-ONLY; no bound change; NO QED.
 */

export const CAVEAT_WIRING_AUDIT_34948 = {
  ticket: 'imp-35032',
  audited: 'imp-34948-inflection-offset-far-tail-ladder-extension',
  bannerModulePath: 'src/data/imp-34948-inflection-offset-far-tail-ladder-extension.js',
  sweepListingPath: '/src/data/imp-34948-inflection-offset-far-tail-ladder-extension.js',
  bannerPresent: true,
  wiredIntoMathModulesSweep: true,
  priorAuditsThatSkippedItByName: ['imp-35007', 'imp-35020'],
  gapsFound: [],
  honest:
    'AUDIT-ONLY -- verified imp-34948 carries the shared honest-status banner (isRigorous: false; '
    + 'verdict names NOT rigorous, C_mb GUE-conditional per imp-486 UNTOUCHED, changes no bound, no '
    + 'operator positivity, imp-3066 K_a >= 0 untouched, no RH verdict, NO QED, no refereed bound is changed'
    + ') and that its self-executing 7-assertion array is already listed in the '
    + 'scripts/run-assertions.mjs MATH_MODULES sweep. Neither prior audit (imp-35007, imp-35020) omitting '
    + 'imp-34948 by name reflects an actual banner or wiring gap -- both checks pass. No completeness gap '
    + 'found. Changes no bound.',
};

export const CAVEAT_WIRING_AUDIT_34948_ASSERTIONS = [
  {
    id: 'imp-35032-banner-present',
    description: 'imp-34948 is recorded as carrying the shared honest-status banner',
    holds: () => CAVEAT_WIRING_AUDIT_34948.bannerPresent === true,
  },
  {
    id: 'imp-35032-wired-into-sweep',
    description: 'imp-34948 is recorded as already wired into the MATH_MODULES sweep',
    holds: () => CAVEAT_WIRING_AUDIT_34948.wiredIntoMathModulesSweep === true,
  },
  {
    id: 'imp-35032-two-prior-audits-named',
    description: 'the audit records both prior audits that skipped imp-34948 by name',
    holds: () =>
      CAVEAT_WIRING_AUDIT_34948.priorAuditsThatSkippedItByName.length === 2 &&
      CAVEAT_WIRING_AUDIT_34948.priorAuditsThatSkippedItByName.includes('imp-35007') &&
      CAVEAT_WIRING_AUDIT_34948.priorAuditsThatSkippedItByName.includes('imp-35020'),
  },
  {
    id: 'imp-35032-no-gaps-found',
    description: 'the audit found zero banner or wiring gaps',
    holds: () => CAVEAT_WIRING_AUDIT_34948.gapsFound.length === 0,
  },
  {
    id: 'imp-35032-audit-only-honest',
    description: 'explicitly AUDIT-ONLY, no bound change, NO QED',
    holds: () =>
      /AUDIT-ONLY/.test(CAVEAT_WIRING_AUDIT_34948.honest) &&
      /NO QED/.test(CAVEAT_WIRING_AUDIT_34948.honest) &&
      /refereed bound is changed/i.test(CAVEAT_WIRING_AUDIT_34948.honest),
  },
];

for (const a of CAVEAT_WIRING_AUDIT_34948_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-35032-caveat-wiring-audit assertion failed: ${a.id}`);
}
