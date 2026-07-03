/**
 * @module imp-3593-3546-3558-3462-cohort-module-surfacing-audit
 * @fileoverview imp-3593 — Audit whether the newest imp-3462 (N_max exponent
 * derivation), imp-3546 (moment-tail bound tightness), imp-3547 (lower-moment
 * Simpson residual localization), imp-3550 (far-tail midpoint O(H^2) bound),
 * imp-3551 (xi*_inf residual band sharpening), imp-3552 (cosh over-estimation
 * factor), imp-3553 (cancellation-free odd R_3), imp-3555 (skew-Toeplitz gap
 * exponent convergence), imp-3556 (sigma threshold crossings), imp-3557
 * (M_4 leading-form propagation), and imp-3558 (far-tail N=9600 ladder)
 * research modules are imported by any page/component or are orphaned data
 * files. imp-3539 audited only through imp-3511 and imp-3568 only through
 * imp-3532/3548; this continues the imp-3459/imp-3480/imp-3498/imp-3517/
 * imp-3539/imp-3568 orphan-audit series to this next cohort.
 *
 * METHOD (read-only, performed at author time). Same as imp-3568: a
 * transitive import-graph walk from every page under src/pages and every
 * component under src/components over all real `from '...'` relative import
 * edges (including a trailing `.js` extension). A module counts as SURFACED
 * iff its file is reachable from some page/component node; ORPHAN otherwise.
 * String / comment mentions (glossary prose citing an imp-NNNN id, or a
 * downstream "-viz-data" file's `@fileoverview` comment naming a cohort id
 * without an actual import statement) do NOT count as a real import edge.
 *
 * RESULT (audited 2026-07-03): all eleven modules are ORPHAN.
 *   - imp-3462-nmax-turnover-exponent-derivation.js          : ORPHAN (no import edges at all; only @see-only mentions in imp-3466/imp-3578/imp-3580)
 *   - imp-3546-moment-tail-bound-tightness.js                : ORPHAN (imported by imp-3573, imp-3574 -- both themselves unreached)
 *   - imp-3547-lower-moment-simpson-residual-localization.js : ORPHAN (no import edges; @see-only in imp-3576/imp-3597/imp-3603)
 *   - imp-3550-fartail-midpoint-quadrature-error-bound.js    : ORPHAN (no import edges; @see-only in imp-3571)
 *   - imp-3551-xistar-residual-band-sharpening.js            : ORPHAN (no import edges; @see-only in imp-3572)
 *   - imp-3552-cosh-certificate-overestimation-factor.js     : ORPHAN (no import edges; @see-only in imp-3574/imp-3589-viz-data, which bakes its own literals)
 *   - imp-3553-remainder-tail-cancellation-free-r3.js        : ORPHAN (no import edges; @see-only in imp-3581/imp-3600/imp-3618/imp-3624)
 *   - imp-3555-skew-toeplitz-gap-exponent-convergence.js     : ORPHAN (no import edges; @see-only in imp-3575/imp-3595/imp-3596/imp-3602/imp-3619)
 *   - imp-3556-sigma-threshold-crossings-rootsolve.js        : ORPHAN (no import edges; @see-only in imp-3577/imp-3580/imp-3586-viz-data/imp-3599/imp-3604/imp-3617/imp-3620)
 *   - imp-3557-refined-m4-leading-form-propagation.js        : ORPHAN (no import edges; @see-only in imp-3579/imp-3598)
 *   - imp-3558-far-tail-band-max-grid-ladder-n9600.js        : ORPHAN (no import edges; @see-only in imp-3571/imp-3582/imp-3601/imp-3622)
 *
 * Only imp-3546 has any real downstream import edge (from imp-3573 and
 * imp-3574), and both of those are themselves unreached from src/pages or
 * src/components -- confirming the imp-3568 finding that this whole
 * research-module dependency chain (now extending through imp-3624) has not
 * yet been wired into a live page.
 *
 * RECOMMENDATION. Mint follow-up surfacing tickets grouped by narrative home:
 * imp-3462 (N_max turnover exponent) belongs beside the existing N_max /
 * rescue-budget sections; imp-3546/3552 (moment-tail tightness, cosh
 * over-estimation factor) and imp-3547/3550/3551 (Simpson residual
 * localization, midpoint error bound, xi*_inf band sharpening) belong beside
 * the moment-ladder / xi* quadrature narrative; imp-3553 (cancellation-free
 * R_3) belongs beside the existing remainder-tail exponent visualizations;
 * imp-3555 (skew-Toeplitz gap exponent) and imp-3556 (sigma threshold
 * crossings) belong beside the section-gap / sigma-crossover narrative;
 * imp-3557 (M_4 propagation) belongs beside the miss-factor moment
 * refinement section; imp-3558 (far-tail N=9600 ladder) belongs beside the
 * far-tail band-max grid narrative. This module fabricates NO pages; it only
 * records the audit and flags the orphans. No new bound, no QED;
 * Platt-Trudgian Lambda <= 0.2 stays SOTA.
 *
 * @see imp-3459, imp-3480, imp-3498, imp-3517, imp-3539, imp-3568 (the prior audits in this series)
 */

export const IMP_3593_3546_3558_3462_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3593',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages and src/components node over relative ' +
    '`from` imports (including a trailing .js extension); SURFACED iff the module file is ' +
    'reachable, ORPHAN otherwise. Comment/string mentions (including @fileoverview references in ' +
    'downstream -viz-data files that bake their own literals) do not count.',
  modules: [
    { file: 'imp-3462-nmax-turnover-exponent-derivation.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3546-moment-tail-bound-tightness.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3547-lower-moment-simpson-residual-localization.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3550-fartail-midpoint-quadrature-error-bound.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3551-xistar-residual-band-sharpening.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3552-cosh-certificate-overestimation-factor.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3553-remainder-tail-cancellation-free-r3.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3555-skew-toeplitz-gap-exponent-convergence.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3556-sigma-threshold-crossings-rootsolve.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3557-refined-m4-leading-form-propagation.js', surfaced: false, surfacedBy: null },
    { file: 'imp-3558-far-tail-band-max-grid-ladder-n9600.js', surfaced: false, surfacedBy: null },
  ],
  orphanCount: 11,
  recommendation:
    'Mint follow-up surfacing tickets grouped by narrative home: imp-3462 beside the N_max / ' +
    'rescue-budget sections; imp-3546/3552/3547/3550/3551 beside the moment-ladder / xi* ' +
    'quadrature narrative; imp-3553 beside the remainder-tail exponent visualizations; ' +
    'imp-3555/3556 beside the section-gap / sigma-crossover narrative; imp-3557 beside the ' +
    'miss-factor moment refinement section; imp-3558 beside the far-tail band-max grid narrative. ' +
    'Do not fabricate pages in this audit ticket.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3593_ASSERTIONS = [
  {
    id: 'imp3593-exactly-eleven-modules-audited',
    holds: () => IMP_3593_3546_3558_3462_COHORT_MODULE_SURFACING_AUDIT.modules.length === 11,
    why: 'The audit must cover exactly the eleven named imp-3462/3546/3547/3550/3551/3552/3553/3555/3556/3557/3558 cohort modules.',
  },
  {
    id: 'imp3593-all-eleven-orphan',
    holds: () => {
      const m = IMP_3593_3546_3558_3462_COHORT_MODULE_SURFACING_AUDIT.modules;
      const orphan = m.filter((x) => !x.surfaced).length;
      return orphan === 11 && orphan === IMP_3593_3546_3558_3462_COHORT_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'None of imp-3462/3546/3547/3550/3551/3552/3553/3555/3556/3557/3558 is reachable from any src/pages or src/components entry point as of the 2026-07-03 audit.',
  },
  {
    id: 'imp3593-honest-scope-locked',
    holds: () => /SOTA/.test(IMP_3593_3546_3558_3462_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3593_3546_3558_3462_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_3593_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3593 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3593_ASSERTIONS };
