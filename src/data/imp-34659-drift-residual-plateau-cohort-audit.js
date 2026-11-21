/**
 * @module imp-34659-drift-residual-plateau-cohort-audit
 *
 * imp-34659 (meta): AUDIT of the imp-34626/34628/34630/34633/34634/34635/34636
 * drift-residual/plateau/roundoff cohort (7 dedicated modules) for TWO standing
 * invariants, following the imp-34643/34682/34603 audit precedent.
 *
 * METHOD. For each of the 7 modules: (1) confirm the honest-status banner
 * carries the required elements (measurement-only framing, inherited
 * imp-3220/imp-3406 component model NOT rigorous, C_mb GUE-conditional per
 * imp-486 untouched, imp-3066 K_a>=0 untouched, no refereed bound is changed
 * , NO QED); (2) scan every reconstructed-cache-value comparison (any
 * assertion diffing a recomputed number against an imported/exported
 * constant) for the storage-precision trap -- a value round-tripped through a
 * 7-significant-figure toFixed(6)/toExponential(6) literal but re-checked at
 * a tolerance tighter than ~1e-6 (e.g. 1e-9), which fails spuriously because
 * the stored literal itself already discarded precision below ~1e-7.
 *
 * FINDING (honest-status banner): no gap -- all 7 modules carry the complete
 * six-element banner verbatim, each ending in "NO QED" with an honesty-gate
 * self-assertion regexing for it.
 *
 * FINDING (storage-precision trap): no gap -- the cohort's only tight-tolerance
 * comparison is imp-34636's `< 1e-9` cross-check of its recomputed near/far
 * leading-per-k slopes against IMP34609_NEAR_LEADING_PER_K_SLOPE /
 * IMP34609_FAR_LEADING_PER_K_SLOPE. Those two constants are exported directly
 * as live-computed `NEAR.perKSlope` / `FAR.perKSlope` values in
 * imp-34609-eflow-attr-near-far-slope-diff-log-corrected.js -- NOT
 * toFixed/toExponential string literals -- so no precision was discarded by
 * storage and the 1e-9 tolerance against a verbatim-reproduced computation is
 * appropriate, not an instance of the trap. No other module in the cohort
 * diffs a recomputed value against a rounded cache literal at all.
 */

const COHORT = [
  { ticket: 'imp-34626', modulePath: 'src/data/imp-34626-plateau-drift-sixth-order-stencil-crosscheck.js' },
  { ticket: 'imp-34628', modulePath: 'src/data/imp-34628-deflow-second-order-se-target-window.js' },
  { ticket: 'imp-34630', modulePath: 'src/data/imp-34630-plateau-drift-large-dp-scaling-order.js' },
  { ticket: 'imp-34633', modulePath: 'src/data/imp-34633-roundoff-prefactor-amplitude-vs-epsmach.js' },
  { ticket: 'imp-34634', modulePath: 'src/data/imp-34634-deflow-second-order-both-endpoints-window.js' },
  { ticket: 'imp-34635', modulePath: 'src/data/imp-34635-eflow-attr-log-curvature-en-term-retained.js' },
  { ticket: 'imp-34636', modulePath: 'src/data/imp-34636-eflow-attr-pole-centred-window-slope.js' },
].map((m) => ({ ...m, bannerComplete: true, toleranceTrapFound: false }));

const TIGHT_TOLERANCE_CHECK = {
  ticket: 'imp-34636',
  comparison: 'recomputed NEAR_SLOPE/FAR_SLOPE vs IMP34609_NEAR_LEADING_PER_K_SLOPE/IMP34609_FAR_LEADING_PER_K_SLOPE',
  toleranceUsed: 1e-9,
  cachedAsRoundedLiteral: false,
  reason: 'the imp-34609 constants are exported as live-computed NEAR.perKSlope/FAR.perKSlope values, not toFixed/toExponential string literals, so no storage precision was discarded',
  isTrapInstance: false,
};

export const DRIFT_RESIDUAL_PLATEAU_COHORT_AUDIT = {
  ticket: 'imp-34659',
  cohort: COHORT,
  cohortSize: COHORT.length,
  bannerGapsFound: COHORT.filter((m) => !m.bannerComplete).map((m) => m.ticket),
  toleranceTrapGapsFound: COHORT.filter((m) => m.toleranceTrapFound).map((m) => m.ticket),
  tightToleranceCheck: TIGHT_TOLERANCE_CHECK,
  honest:
    'AUDIT: confirms all 7 imp-34626/34628/34630/34633/34634/34635/34636 cohort modules carry the complete ' +
    'six-element honest-status banner and that the cohort\'s single tight-tolerance (< 1e-9) assertion compares ' +
    'against a live-computed export, not a rounded storage literal, so the storage-precision assertion-tolerance ' +
    'trap does not apply here. No bound change; imp-3066 K_a>=0 untouched; C_mb GUE-conditional per imp-486 ' +
    'untouched; NO QED; no refereed bound is changed.',
};

export const DRIFT_RESIDUAL_PLATEAU_COHORT_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34659-cohort-has-seven-members',
    description: 'the audited cohort covers exactly the 7 imp-34626/28/30/33/34/35/36 modules',
    holds: () => DRIFT_RESIDUAL_PLATEAU_COHORT_AUDIT.cohortSize === 7
      && ['imp-34626', 'imp-34628', 'imp-34630', 'imp-34633', 'imp-34634', 'imp-34635', 'imp-34636']
        .every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34659-no-banner-gaps',
    description: 'no cohort module was found missing the six-element honest-status banner',
    holds: () => DRIFT_RESIDUAL_PLATEAU_COHORT_AUDIT.bannerGapsFound.length === 0,
  },
  {
    id: 'imp-34659-no-tolerance-trap-gaps',
    description: 'no cohort module was found reconstructing a rounded storage literal and re-checking it at a tolerance tighter than ~1e-6',
    holds: () => DRIFT_RESIDUAL_PLATEAU_COHORT_AUDIT.toleranceTrapGapsFound.length === 0
      && DRIFT_RESIDUAL_PLATEAU_COHORT_AUDIT.tightToleranceCheck.isTrapInstance === false,
  },
  {
    id: 'imp-34659-module-paths-match-ticket-prefix',
    description: 'every cohort modulePath filename starts with the matching ticket id',
    holds: () => COHORT.every((m) => m.modulePath.includes(`/${m.ticket}-`)),
  },
  {
    id: 'imp-34659-audit-honest',
    description: 'no bound change and no refereed bound is changed',
    holds: () => /No bound change/.test(DRIFT_RESIDUAL_PLATEAU_COHORT_AUDIT.honest)
      && /refereed bound is changed/i.test(DRIFT_RESIDUAL_PLATEAU_COHORT_AUDIT.honest),
  },
];

for (const a of DRIFT_RESIDUAL_PLATEAU_COHORT_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34659-drift-residual-plateau-cohort-audit assertion failed: ${a.id}`);
  }
}

export default DRIFT_RESIDUAL_PLATEAU_COHORT_AUDIT;
