/**
 * @module imp-3498-newest-six-module-surfacing-audit
 * @fileoverview imp-3498 — Audit whether the six most recently committed
 * research modules imp-3464 (sinh-drift product closed form), imp-3465
 * (n_max height-dependent floor), imp-3466 (n_max next-order correction),
 * imp-3467 (Ttilde closed-form C_inf assembly), imp-3469 (degree-2
 * bridge-mass scaling), and imp-3470 (Ttilde spectral-peak xi* obstruction)
 * are imported/surfaced by any page or component, or are ORPHANED like the
 * artifacts flagged by imp-3417/imp-3438/imp-3459/imp-3480.
 *
 * METHOD (read-only, performed at author time). Grepped every relative
 * `import { ... } from '...'` edge under src/pages and src/components for
 * each of the six named module filenames. A module counts as SURFACED iff a
 * real import edge is found; ORPHAN otherwise. String / comment mentions
 * (e.g. `relatedFit: 'imp-3467-...'`, `@see` lines) do NOT count.
 *
 * RESULT (audited 2026-07-03):
 *   - imp-3464-sinh-drift-product-closed-form.js       : ORPHAN
 *       (no import edge found anywhere under src/pages or src/components;
 *       referenced only from run-assertions.mjs self-checks)
 *   - imp-3465-nmax-height-dependent-floor.js           : ORPHAN
 *       (no import edge found anywhere under src/pages or src/components)
 *   - imp-3466-nmax-nextorder-correction.js             : ORPHAN
 *       (no import edge found anywhere under src/pages or src/components)
 *   - imp-3467-Ttilde-closed-form-C-inf-assembly.js     : ORPHAN
 *       (no import edge found anywhere under src/pages or src/components;
 *       already flagged for a viz by the still-pending imp-3500 ticket)
 *   - imp-3469-degree2-bridge-mass-scaling.js           : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as
 *       IMP3469_DEGREE2_BRIDGE_MASS_SCALING and AUTOCORR_WEIGHT_PROFILE)
 *   - imp-3470-Ttilde-spectral-peak-xistar-obstruction.js : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as
 *       IMP3470_TTILDE_SPECTRAL_PEAK_XISTAR_OBSTRUCTION)
 *
 * Four of the six modules are ORPHAN: imp-3464, imp-3465, imp-3466, imp-3467.
 * Both surfaced modules (imp-3469, imp-3470) land on the same page,
 * ClosureRoutesPage.jsx.
 *
 * RECOMMENDATION. imp-3467 (the closed-form ||Ttilde||=a*sup|d/dxi Phihat|^2|
 * assembly reproducing C_inf~0.1751) already has a dedicated pending viz
 * ticket (imp-3500); no new ticket needed there. imp-3464 (sinh-drift
 * product closed form) and imp-3465/imp-3466 (n_max height-dependent floor
 * and its next-order correction) have no pending surfacing ticket and
 * belong beside the existing imp-3406 N_max / high-N extrapolation section
 * on ClosureRoutesPage.jsx, which already hosts the parent N_max
 * discussion. This module fabricates NO pages; it only records the audit
 * and flags the orphans. No new bound, no QED; no refereed bound is changed.
 *
 * @see imp-3459 (the imp-3399..3409 cohort surfacing audit)
 * @see imp-3480 (the imp-3441..3446 wave surfacing audit)
 */

export const IMP_3498_NEWEST_SIX_MODULE_SURFACING_AUDIT = {
  id: 'imp-3498',
  auditedAt: '2026-07-03',
  method:
    'Grep for relative `from` import edges under src/pages and src/components for each named ' +
    'module filename; SURFACED iff a real import edge is found, ORPHAN otherwise. ' +
    'Comment/string mentions do not count.',
  modules: [
    {
      file: 'imp-3464-sinh-drift-product-closed-form.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3465-nmax-height-dependent-floor.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3466-nmax-nextorder-correction.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3467-Ttilde-closed-form-C-inf-assembly.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3469-degree2-bridge-mass-scaling.js',
      surfaced: true,
      surfacedBy:
        'src/pages/ClosureRoutesPage.jsx (IMP3469_DEGREE2_BRIDGE_MASS_SCALING, AUTOCORR_WEIGHT_PROFILE)',
    },
    {
      file: 'imp-3470-Ttilde-spectral-peak-xistar-obstruction.js',
      surfaced: true,
      surfacedBy:
        'src/pages/ClosureRoutesPage.jsx (IMP3470_TTILDE_SPECTRAL_PEAK_XISTAR_OBSTRUCTION)',
    },
  ],
  orphanCount: 4,
  recommendation:
    'imp-3467 already has a pending dedicated viz ticket (imp-3500); no new ticket needed. ' +
    'imp-3464 and imp-3465/imp-3466 have no pending surfacing ticket and belong beside the ' +
    'existing imp-3406 N_max section on ClosureRoutesPage.jsx; do not fabricate pages in this ' +
    'audit ticket.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. No refereed bound is changed.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3498_ASSERTIONS = [
  {
    id: 'imp3498-exactly-six-modules-audited',
    holds: () => IMP_3498_NEWEST_SIX_MODULE_SURFACING_AUDIT.modules.length === 6,
    why: 'The audit must cover exactly the six named imp-3464..3470 (excluding imp-3468) modules.',
  },
  {
    id: 'imp3498-two-surfaced-four-orphan',
    holds: () => {
      const m = IMP_3498_NEWEST_SIX_MODULE_SURFACING_AUDIT.modules;
      const surfaced = m.filter((x) => x.surfaced).length;
      const orphan = m.filter((x) => !x.surfaced).length;
      return surfaced === 2 && orphan === 4 &&
        orphan === IMP_3498_NEWEST_SIX_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'Two modules (imp-3469/3470) are surfaced via ClosureRoutesPage; four (imp-3464/3465/3466/3467) are orphaned.',
  },
  {
    id: 'imp3498-orphan-ids-match',
    holds: () => {
      const orphanFiles = IMP_3498_NEWEST_SIX_MODULE_SURFACING_AUDIT.modules
        .filter((x) => !x.surfaced)
        .map((x) => x.file);
      const expected = [
        'imp-3464-sinh-drift-product-closed-form.js',
        'imp-3465-nmax-height-dependent-floor.js',
        'imp-3466-nmax-nextorder-correction.js',
        'imp-3467-Ttilde-closed-form-C-inf-assembly.js',
      ];
      return expected.every((f) => orphanFiles.includes(f)) && orphanFiles.length === expected.length;
    },
    why: 'The exact orphan set found by this audit must be imp-3464, imp-3465, imp-3466, imp-3467.',
  },
  {
    id: 'imp3498-honest-scope-locked',
    holds: () => /refereed bound is changed/i.test(IMP_3498_NEWEST_SIX_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3498_NEWEST_SIX_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; no refereed bound is changed.',
  },
];

for (const a of IMP_3498_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3498 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3498_ASSERTIONS };
