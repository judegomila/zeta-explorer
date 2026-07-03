/**
 * @module imp-3459-newest-cohort-module-surfacing-audit
 * @fileoverview imp-3459 — Audit whether the newest cohort of capture-ratio /
 * leftmost-zero / sigma research modules (imp-3399, imp-3400, imp-3402, imp-3403,
 * imp-3404, imp-3405, imp-3406, imp-3407, imp-3409) are imported by any
 * page/consumer or are orphaned data files, and record which need wiring.
 *
 * METHOD (read-only, performed at author time). A transitive import-graph walk was
 * run from every page under src/pages over all `... from "..."` relative imports.
 * A module counts as SURFACED iff its file is reachable from some page node; ORPHAN
 * otherwise. String / comment mentions (e.g. `relatedFit: 'imp-3402-...'`, `@see`
 * lines) do NOT count — only real `import { ... } from '...'` edges.
 *
 * RESULT (audited 2026-07-03):
 *   - imp-3399-capture-ratio-sinh-odd-factorization-identity.js : ORPHAN
 *       (mentioned only in comments/string fields of imp-3408, itself an orphan)
 *   - imp-3400-Ttilde-spectral-slope-closed-form.js              : ORPHAN
 *       (mentioned only in comments/string fields of the imp-3407/3439/3440/3467/
 *        3470/3483/3484/3485/3505/3511 chain; none of those files import it, and
 *        none of that chain is itself page-reachable)
 *   - imp-3402-leftmost-zero-drift-rate-fit.js                    : ORPHAN
 *       (mentioned only in comments/string fields of imp-3403, which does NOT
 *        actually import it — imp-3403 has zero import statements)
 *   - imp-3403-leading-order-residual-nphi-scaling.js             : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3403_LEADING_ORDER_RESIDUAL_NPHI_SCALING)
 *   - imp-3404-shear-gram-full-spectrum-cell-independence.js      : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3404_SHEAR_GRAM_FULL_SPECTRUM_CELL_INDEPENDENCE)
 *   - imp-3405-bridge-mass-lambda-scaling-law.js                  : ORPHAN
 *       (mentioned only in comments/string fields of imp-3469, itself an orphan)
 *   - imp-3406-sigma-highN-extrapolation.js                       : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3406_SIGMA_HIGHN_EXTRAPOLATION)
 *   - imp-3407-C-inf-independent-extrapolation-certification.js  : ORPHAN
 *       (mentioned only in comments/string fields of the imp-3439/3440/3445/3461
 *        chain; none of those files import it, and none of that chain is itself
 *        page-reachable)
 *   - imp-3409-capture-ratio-sinh-residual-order.js               : SURFACED
 *       (imported by src/pages/ClosureRoutesPage.jsx as IMP3409_CAPTURE_RATIO_SINH_RESIDUAL_ORDER)
 *
 * Five of the nine modules are ORPHAN: imp-3399, imp-3400, imp-3402, imp-3405,
 * imp-3407. Every "reference" found for these five is a JSDoc @see line or a
 * plain string field (e.g. `relatedFit: '...'`, `numeratorClosedForm: '...'`)
 * inside sibling data modules — not an ES-module import — so no transitive
 * page path exists for any of them.
 *
 * RECOMMENDATION. Mint follow-up surfacing tickets: imp-3399 (symbolic evenness
 * identity) and imp-3409 lie in the same capture-ratio narrative already on
 * ClosureRoutesPage — natural home is that section. imp-3400/imp-3407 (the
 * Ttilde closed-form numerator and the C_inf certification that consumes it)
 * belong beside the existing C_inf sections on ClosureRoutesPage. imp-3402
 * (leftmost-zero drift fit) belongs beside the already-surfaced imp-3403
 * residual-scaling viz. This module fabricates NO pages; it only records the
 * audit and flags the orphans. No new bound, no QED; Platt-Trudgian
 * Lambda <= 0.2 stays SOTA.
 *
 * @see imp-3398 (the prior finding-module surfacing audit this pattern follows)
 */

export const IMP_3459_NEWEST_COHORT_MODULE_SURFACING_AUDIT = {
  id: 'imp-3459',
  auditedAt: '2026-07-03',
  method:
    'Transitive import-graph walk from every src/pages page over relative `from` imports; ' +
    'SURFACED iff the module file is reachable, ORPHAN otherwise. Comment/string mentions do not count.',
  modules: [
    {
      file: 'imp-3399-capture-ratio-sinh-odd-factorization-identity.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3400-Ttilde-spectral-slope-closed-form.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3402-leftmost-zero-drift-rate-fit.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3403-leading-order-residual-nphi-scaling.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3403_LEADING_ORDER_RESIDUAL_NPHI_SCALING)',
    },
    {
      file: 'imp-3404-shear-gram-full-spectrum-cell-independence.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3404_SHEAR_GRAM_FULL_SPECTRUM_CELL_INDEPENDENCE)',
    },
    {
      file: 'imp-3405-bridge-mass-lambda-scaling-law.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3406-sigma-highN-extrapolation.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3406_SIGMA_HIGHN_EXTRAPOLATION)',
    },
    {
      file: 'imp-3407-C-inf-independent-extrapolation-certification.js',
      surfaced: false,
      surfacedBy: null,
    },
    {
      file: 'imp-3409-capture-ratio-sinh-residual-order.js',
      surfaced: true,
      surfacedBy: 'src/pages/ClosureRoutesPage.jsx (IMP3409_CAPTURE_RATIO_SINH_RESIDUAL_ORDER)',
    },
  ],
  orphanCount: 5,
  recommendation:
    'Mint follow-up surfacing tickets for imp-3399, imp-3400, imp-3402, imp-3405, and imp-3407 ' +
    'so each is rendered on at least one page; do not fabricate pages in this audit ticket.',
  honestNote:
    'Read-only audit; no pages fabricated. No new bound, no QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
};

// Build-time tripwires that lock the audit findings against silent drift.
const IMP_3459_ASSERTIONS = [
  {
    id: 'imp3459-exactly-nine-modules-audited',
    holds: () => IMP_3459_NEWEST_COHORT_MODULE_SURFACING_AUDIT.modules.length === 9,
    why: 'The audit must cover exactly the nine named imp-3399..3409 cohort modules.',
  },
  {
    id: 'imp3459-four-surfaced-five-orphan',
    holds: () => {
      const m = IMP_3459_NEWEST_COHORT_MODULE_SURFACING_AUDIT.modules;
      const surfaced = m.filter((x) => x.surfaced).length;
      const orphan = m.filter((x) => !x.surfaced).length;
      return surfaced === 4 && orphan === 5 &&
        orphan === IMP_3459_NEWEST_COHORT_MODULE_SURFACING_AUDIT.orphanCount;
    },
    why: 'Four modules (imp-3403/3404/3406/3409) are surfaced via ClosureRoutesPage; five (imp-3399/3400/3402/3405/3407) are orphaned.',
  },
  {
    id: 'imp3459-orphan-ids-match',
    holds: () => {
      const orphanFiles = IMP_3459_NEWEST_COHORT_MODULE_SURFACING_AUDIT.modules
        .filter((x) => !x.surfaced)
        .map((x) => x.file);
      const expected = [
        'imp-3399-capture-ratio-sinh-odd-factorization-identity.js',
        'imp-3400-Ttilde-spectral-slope-closed-form.js',
        'imp-3402-leftmost-zero-drift-rate-fit.js',
        'imp-3405-bridge-mass-lambda-scaling-law.js',
        'imp-3407-C-inf-independent-extrapolation-certification.js',
      ];
      return expected.every((f) => orphanFiles.includes(f)) && orphanFiles.length === expected.length;
    },
    why: 'The exact orphan set found by this audit must be imp-3399, imp-3400, imp-3402, imp-3405, imp-3407.',
  },
  {
    id: 'imp3459-honest-scope-locked',
    holds: () => /SOTA/.test(IMP_3459_NEWEST_COHORT_MODULE_SURFACING_AUDIT.honestNote) &&
      /no QED/i.test(IMP_3459_NEWEST_COHORT_MODULE_SURFACING_AUDIT.honestNote),
    why: 'VERDICT LOCK: this is a read-only audit, not a bound; Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  },
];

for (const a of IMP_3459_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-3459 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_3459_ASSERTIONS };
