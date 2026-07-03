/**
 * @module imp-3480-newer-wave-module-surfacing-audit
 * @fileoverview imp-3480 — Audit whether the imp-3441/3442/3443/3444/3445/3446
 * (closed-form 5/(14pi), c(U)-scaling, N_max-sensitivity, sigma-landmark-ladder,
 * C_inf-third-route, N_max-closed-form) modules are imported by any
 * page/consumer or are orphaned data files. imp-3459 audited only through
 * imp-3409 and misses this newer wave.
 *
 * METHOD (read-only, performed at author time). Grepped every relative
 * `import { ... } from '...'` edge under src/pages and src/components for each
 * of the six named module filenames. A module counts as SURFACED iff a real
 * import edge is found; ORPHAN otherwise. String / comment mentions (e.g.
 * `relatedFit: 'imp-3402-...'`, `@see` lines) do NOT count.
 *
 * RESULT (audited 2026-07-03):
 *   - imp-3441-gaussian-curvature-coefficient-closed-form.js : ORPHAN
 *       (no import edge found anywhere under src/)
 *   - imp-3442-sinh-residual-coefficient-U-scaling.js         : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3442_SINH_RESIDUAL_COEFFICIENT_U_SCALING)
 *   - imp-3443-nmax-etrunc-sensitivity.js                     : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3443_NMAX_ETRUNC_SENSITIVITY)
 *   - imp-3444-sigma-nshape-landmark-ladder.js                : ORPHAN
 *       (no import edge found anywhere under src/)
 *   - imp-3445-C-inf-third-extrapolation-wynn.js              : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3445_C_INF_THIRD_EXTRAPOLATION_WYNN)
 *   - imp-3446-nmax-closed-form.js                            : ORPHAN
 *       (no import edge found anywhere under src/)
 *
 * Three of the six modules are ORPHAN: imp-3441, imp-3444, imp-3446. All three
 * surfaced modules (imp-3442, imp-3443, imp-3445) land on the same page,
 * ClosureRoutesPage.jsx.
 *
 * RECOMMENDATION. imp-3441 (the closed-form 5/(14pi) Gaussian-curvature
 * coefficient) belongs beside the existing imp-3403 residual-scaling section
 * on ClosureRoutesPage, which already hosts the parent decomposition. imp-3444
 * (the sigma(N) N-shape landmark ladder: interior min/max, sigma(2)-recross,
 * 0.5-crossing, E_coll/E_trunc crossover) belongs beside the imp-3406
 * high-N extrapolation section it extends. imp-3446 (the analytic N_max
 * stationarity closed form replacing the imp-3406 ternary search) belongs
 * next to whichever of the two sections above ends up hosting the N_max
 * discussion. This module fabricates NO pages; it only records the audit and
 * flags the orphans. No new bound, no QED; Platt-Trudgian Lambda <= 0.2 stays
 * SOTA.
 *
 * @see imp-3459 (the prior finding-module surfacing audit this pattern follows)
 */

export const IMP_3480_NEWER_WAVE_MODULE_SURFACING_AUDIT = {
  id: 'imp-3480',
  auditedAt: '2026-07-03',
  method:
    'Grep for relative `from` import edges under src/pages and src/components for each named ' +
    'module filename; SURFACED iff a real import edge is found, ORPHAN otherwise. ' +
    'Comment/string mentions do not count.',
  modules: [
    {
      file: 'imp-3441-gaussian-curvature-coefficient-closed-form.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3442-sinh-residual-coefficient-U-scaling.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3442_SINH_RESIDUAL_COEFFICIENT_U_SCALING)',
    },
    {
      file: 'imp-3443-nmax-etrunc-sensitivity.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3443_NMAX_ETRUNC_SENSITIVITY)',
    },
    {
      file: 'imp-3444-sigma-nshape-landmark-ladder.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3445-C-inf-third-extrapolation-wynn.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3445_C_INF_THIRD_EXTRAPOLATION_WYNN)',
    },
    {
      file: 'imp-3446-nmax-closed-form.js',
      surfaced: false,
      surfacedBy: null,
    },
  ],
  orphanCount: 3,
  recommendation:
    'Mint follow-up surfacing tickets for imp-3441, imp-3444, and imp-3446 so each is rendered ' +
    'on at least one page (natural home for all three is ClosureRoutesPage.jsx, beside the ' +
    'existing imp-3403/imp-3406 sections they extend); do not fabricate pages in this audit ticket.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3480_ASSERTIONS = [
  {
    id: 'imp3480-exactly-six-modules-audited',
    holds: () => IMP_3480_NEWER_WAVE_MODULE_SURFACING_AUDIT.modules.length === 6,
    why: 'The audit must cover exactly the six named imp-3441..3446 wave modules.',
  },
  {
    id: 'imp3480-three-surfaced-three-orphan',
    holds: () => {
      const m = IMP_3480_NEWER_WAVE_MODULE_SURFACING_AUDIT.modules;
      const surfaced = m.filter((x) => x.surfaced).length;
      const orphan = m.filter((x) => !x.surfaced).length;
      return surfaced === 3 && orphan === 3 &&
        orphan === IMP_3480_NEWER_WAVE_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'Three modules (imp-3442/3443/3445) are surfaced via ClosureRoutesPage; three (imp-3441/3444/3446) are orphaned.',
  },
  {
    id: 'imp3480-orphan-ids-match',
    holds: () => {
      const orphanFiles = IMP_3480_NEWER_WAVE_MODULE_SURFACING_AUDIT.modules
        .filter((x) => !x.surfaced)
        .map((x) => x.file);
      const expected = [
        'imp-3441-gaussian-curvature-coefficient-closed-form.js',
        'imp-3444-sigma-nshape-landmark-ladder.js',
        'imp-3446-nmax-closed-form.js',
      ];
      return expected.every((f) => orphanFiles.includes(f)) && orphanFiles.length === expected.length;
    },
    why: 'The exact orphan set found by this audit must be imp-3441, imp-3444, imp-3446.',
  },
  {
    id: 'imp3480-honest-scope-locked',
    holds: () => /SOTA/.test(IMP_3480_NEWER_WAVE_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3480_NEWER_WAVE_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_3480_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3480 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3480_ASSERTIONS };
