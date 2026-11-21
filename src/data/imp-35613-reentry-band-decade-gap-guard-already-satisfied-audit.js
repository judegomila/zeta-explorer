/**
 * @module imp-35613-reentry-band-decade-gap-guard-already-satisfied-audit
 *
 * imp-35613 (accuracy, audit): the ticket asked to add a run-assertions.mjs
 * regression-guard pinning the imp-35559 R1t reentry-band FOUR per-endpoint decade
 * gaps -- the reentry edge (log10 N = 27.084691) and exit edge (log10 N = 37.167107)
 * measured against BOTH ceilings, the Platt-Trudgian complete-verification height
 * T_PT = 3e12 (log10 ~ 12.4771) and the in-repo Odlyzko 10^6-ordinate DATA ceiling
 * gamma_max = 600269.677012445 (log10 ~ 5.7783) -- plus the ~6.70-decade
 * data-ceiling-below-T_PT figure, confirming the band is unreachable from either
 * ceiling and asserting to exact/storage-precision arithmetic.
 *
 * FINDING. Reading scripts/run-assertions.mjs and src/data shows the requested
 * regression-guard is ALREADY PRESENT: the module
 * src/data/imp-35559-r1t-reentry-band-decade-gap-assertion.js (registered in the
 * run-assertions.mjs DATA sweep) INDEPENDENTLY recomputes ALL SIX imp-35559
 * per-endpoint decade gaps from Math.log10 of the same band edges and ceilings --
 * a superset of the four imp-35613 asks for. It pins reentry/exit above T_PT
 * (14.60756975 / 24.68998575), reentry/exit above the in-repo data ceiling
 * (21.30634459 / 31.38876059), the in-repo-below-T_PT figure (6.698774849) and the
 * reentry-above-10^22-spot-check gap (5.084691), each matching a 7-sig-fig reference
 * within 1e-6 relative (the storage-precision tolerance), and cross-checks that every
 * baked imp-35559 perEndpointDecadeGaps / ceilings.log10 field reproduces EXACTLY when
 * the source toPrecision(6) display rounding is re-applied to the independent recompute.
 * git log confirms this guard was added by the imp-35599 commit before imp-35613 reached
 * the api-pool queue.
 *
 * DISPOSITION. No new run-assertions module added in this ticket: the imp-35599 commit
 * ("pin the imp-35559 six per-endpoint reentry-band decade gaps in a run-assertions
 * module ...") already discharged this exact requirement, and adding a second guard over
 * the identical baked constants would be redundant duplication. This module records the
 * duplicate-ticket finding so the completed status is auditable. Changes no bound;
 * establishes no operator positivity; the imp-35243a certificate stays OPEN; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see src/data/imp-35559-r1t-reentry-band-decade-gap-assertion.js (the run-assertions guard already pinning the gaps)
 * @see src/data/imp-35559-r1t-reentry-band-decade-gap-quantification.js (source of every baked gap literal)
 * @see imp-35599 (git commit that already added the requested run-assertions guard)
 * @see imp-35622-peak-crossover-damping-headword-already-satisfied-audit.js (sibling duplicate-ticket audit, same closure pattern)
 */

export const IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT = {
  id: 'imp-35613',
  proofSection: 'audit',
  auditedFile: 'src/data/imp-35559-r1t-reentry-band-decade-gap-assertion.js',
  auditedRegistration: 'scripts/run-assertions.mjs',
  requestedFacts: {
    reentry_log10_N: 27.084691,
    exit_log10_N: 37.167107,
    log10_T_PT: 12.47712125,
    log10_inRepoMax: 5.778346405,
    reentryAboveT_PT: 14.60756975,
    exitAboveT_PT: 24.68998575,
    reentryAboveInRepo: 21.30634459,
    exitAboveInRepo: 31.38876059,
    inRepoBelowT_PT: 6.698774849,
  },
  question:
    'Does a run-assertions.mjs regression-guard already pin the imp-35559 four ' +
    'per-endpoint reentry-band decade gaps against both ceilings and the ~6.70-decade ' +
    'data-ceiling-below-T_PT figure, or does imp-35613 still need to add one?',
  finding:
    'ALREADY SATISFIED. src/data/imp-35559-r1t-reentry-band-decade-gap-assertion.js ' +
    '(registered in the run-assertions.mjs DATA sweep) independently recomputes ALL SIX ' +
    'imp-35559 per-endpoint decade gaps from log10 of the band edges (27.084691 / ' +
    '37.167107) and ceilings (T_PT = 3e12; in-repo gamma_max = 600269.677012445) -- a ' +
    'superset of the four imp-35613 requests -- pinning reentry/exit above T_PT ' +
    '(14.6076 / 24.6900), reentry/exit above the in-repo data ceiling (21.3063 / ' +
    '31.3888), the in-repo-below-T_PT figure (6.6988) and the reentry-above-10^22 ' +
    'spot-check gap (5.0847) to 7-sig-fig references within 1e-6 relative, with an exact ' +
    'toPrecision(6) reproduction cross-check on every baked field. Every gap imp-35613 ' +
    'asks to guard is already asserted.',
  priorFixingCommitTitle:
    'imp-35599 (accuracy, opus-4-8, api-pool): pin the imp-35559 six per-endpoint ' +
    'reentry-band decade gaps in a run-assertions module recomputed from log10 of the ' +
    'band edges and ceilings',
  duplicateOf: 'imp-35599',
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a new measurement). imp-35613 duplicates the ' +
    'run-assertions guard already added by imp-35599; no further module needed. ' +
    'Changes no bound; establishes no operator positivity; the imp-35243a certificate ' +
    'stays OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35559 (the tabulated per-endpoint reentry-band decade gaps); imp-35537 (R1t ' +
    'closure scope, route (ii) infeasible); imp-35243 (D2, imp-35243a certificate, stays ' +
    'OPEN); imp-35599 (git commit that already added the run-assertions guard); ' +
    'src/data/zeros-to-1e6.js (Odlyzko 10^6 ordinates, gamma_max 600269.677012445); ' +
    'imp-486 (C_mb GUE-conditional caveat, UNTOUCHED).',
};

export const IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT_ASSERTIONS = [
  {
    id: 'imp35613-audited-guard-identified',
    description: 'the audited run-assertions guard module and its registration file are named explicitly',
    holds: () =>
      IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT.auditedFile ===
        'src/data/imp-35559-r1t-reentry-band-decade-gap-assertion.js' &&
      IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT.auditedRegistration ===
        'scripts/run-assertions.mjs',
  },
  {
    id: 'imp35613-requested-gaps-recorded',
    description: 'the four per-endpoint gap literals and the ~6.70 in-repo-below-T_PT figure imp-35613 asked to guard are recorded',
    holds: () => {
      const f = IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT.requestedFacts;
      return (
        f.reentry_log10_N === 27.084691 &&
        f.exit_log10_N === 37.167107 &&
        Math.abs(f.reentryAboveT_PT - (f.reentry_log10_N - f.log10_T_PT)) < 1e-6 &&
        Math.abs(f.exitAboveInRepo - (f.exit_log10_N - f.log10_inRepoMax)) < 1e-6 &&
        Math.abs(f.inRepoBelowT_PT - (f.log10_T_PT - f.log10_inRepoMax)) < 1e-6
      );
    },
  },
  {
    id: 'imp35613-duplicate-of-imp35599-recorded',
    description: 'the ticket that already discharged this requirement is recorded',
    holds: () =>
      IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT.duplicateOf ===
      'imp-35599',
  },
  {
    id: 'imp35613-honesty-gate-no-qed',
    description:
      'Audit only: no bound changed, no operator positivity, imp-35243a OPEN, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT.isRigorous === false &&
      /imp-35243a certificate\s+stays OPEN/.test(
        IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT.verdict
      ) &&
      /NO QED/.test(IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT.verdict) &&
      /refereed bound is changed/i.test(
        IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT.verdict
      ),
  },
];

for (const a of IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35613-reentry-band-decade-gap-guard-already-satisfied-audit assertion failed: ${a.id}`
    );
  }
}

export default IMP35613_REENTRY_BAND_DECADE_GAP_GUARD_ALREADY_SATISFIED_AUDIT;
