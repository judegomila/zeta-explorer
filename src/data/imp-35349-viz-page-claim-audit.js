/**
 * @module imp-35349-viz-page-claim-audit
 * @fileoverview imp-35349 -- read-only cross-reference audit of the imp-35322 roll-up's
 * hasRoutedVizPage=true claims. imp-35322 asserted three modules each have an existing routed
 * viz page: imp-35240 (via imp-35272), imp-35244 (via imp-35273), and imp-35216 (via "2 page
 * references"). Each cited route was resolved against src/data/visualizations-index.js and
 * checked for a page entry importing the correct data module.
 *
 * METHOD (read-only, performed at author time). Grepped src/data/visualizations-index.js for
 * "imp-35272", "imp-35273", and "35216", and read the surrounding route/dataModule/ticket fields
 * for each hit.
 *
 * RESULT (audited 2026-07-09).
 * - imp-35240: CONFIRMED. Route /viz-imp35272-prefactor-ladder (ticket imp-35272) has
 *   dataModule 'src/data/imp-35240-rho-prefactor-finer-grid-remeasurement.js' -- the correct module.
 * - imp-35244: CONFIRMED. Route /viz-imp35273-rho-remainder-structure (ticket imp-35273) has
 *   dataModule 'src/data/imp-35244-rho-eps52-coefficient-measurement.js' -- the correct module.
 * - imp-35216: DANGLING. The roll-up claims "2 page references" but visualizations-index.js
 *   contains exactly ONE hit for "35216" total: a textual mention inside the oneLine copy of
 *   /viz-imp35346-expansion-slot-ladder (ticket imp-35346), whose dataModule is
 *   'src/data/imp-35322-rho-eps-expansion-cohort-provenance-rollup.js' -- the imp-35322 roll-up
 *   itself, NOT imp-35216's own dedicated module (imp-35216-rho-prefactor-closed-form-assessment.js).
 *   No route in visualizations-index.js has a dataModule referencing imp-35216's own file at all,
 *   so imp-35216 has zero dedicated routed viz pages and only one incidental textual mention
 *   (not two), making the imp-35322 hasRoutedVizPage=true claim for imp-35216 dangling.
 *
 * @see imp-35322-rho-eps-expansion-cohort-provenance-rollup (the audited roll-up)
 * @see imp-35240-rho-prefactor-finer-grid-remeasurement (confirmed routed via imp-35272)
 * @see imp-35244-rho-eps52-coefficient-measurement (confirmed routed via imp-35273)
 */

export const IMP_35349_VIZ_PAGE_CLAIM_AUDIT = {
  id: 'imp-35349',
  auditedAt: '2026-07-09',
  auditedRollup: 'imp-35322',
  findings: [
    {
      claimedId: 'imp-35240',
      claimedRoute: 'imp-35272',
      verdict: 'confirmed',
      resolvedRoute: '/viz-imp35272-prefactor-ladder',
      resolvedDataModule: 'src/data/imp-35240-rho-prefactor-finer-grid-remeasurement.js',
    },
    {
      claimedId: 'imp-35244',
      claimedRoute: 'imp-35273',
      verdict: 'confirmed',
      resolvedRoute: '/viz-imp35273-rho-remainder-structure',
      resolvedDataModule: 'src/data/imp-35244-rho-eps52-coefficient-measurement.js',
    },
    {
      claimedId: 'imp-35216',
      claimedRoute: '2 page references',
      verdict: 'dangling',
      resolvedRoute: '/viz-imp35346-expansion-slot-ladder (incidental textual mention only)',
      resolvedDataModule: 'src/data/imp-35322-rho-eps-expansion-cohort-provenance-rollup.js',
      note:
        'Only ONE total hit for "35216" exists in visualizations-index.js, not two, and that ' +
        'one hit is a mention inside a DIFFERENT ticket\'s page (imp-35346), not a page whose ' +
        'dataModule imports imp-35216-rho-prefactor-closed-form-assessment.js. imp-35216 has ' +
        'zero dedicated routed viz pages.',
    },
  ],
  confirmedCount: 2,
  danglingCount: 1,
  recommendation:
    'Correct imp-35322 to record hasRoutedVizPage=false for imp-35216 (or hasRoutedVizPage: ' +
    '"incidental-mention-only") until a dedicated route imports its own module.',
  honestNote:
    'Read-only cross-reference audit; no new pages created, no bound changed. imp-3066 K_a >= 0 ' +
    'untouched. No refereed bound is changed. No QED.',
};

const IMP_35349_ASSERTIONS = [
  {
    id: 'imp35349-three-claims-audited',
    holds: () => IMP_35349_VIZ_PAGE_CLAIM_AUDIT.findings.length === 3,
    why: 'The ticket names exactly three hasRoutedVizPage=true claims (imp-35216, imp-35240, imp-35244).',
  },
  {
    id: 'imp35349-two-confirmed-one-dangling',
    holds: () => {
      const f = IMP_35349_VIZ_PAGE_CLAIM_AUDIT.findings;
      const confirmed = f.filter((x) => x.verdict === 'confirmed').length;
      const dangling = f.filter((x) => x.verdict === 'dangling').length;
      return (
        confirmed === 2 &&
        confirmed === IMP_35349_VIZ_PAGE_CLAIM_AUDIT.confirmedCount &&
        dangling === 1 &&
        dangling === IMP_35349_VIZ_PAGE_CLAIM_AUDIT.danglingCount
      );
    },
    why: 'imp-35240/imp-35272 and imp-35244/imp-35273 resolve cleanly; imp-35216 does not.',
  },
  {
    id: 'imp35349-dangling-claim-is-imp35216',
    holds: () => {
      const dangling = IMP_35349_VIZ_PAGE_CLAIM_AUDIT.findings.find((x) => x.verdict === 'dangling');
      return dangling !== undefined && dangling.claimedId === 'imp-35216';
    },
    why: 'The specific dangling claim identified by this audit is the imp-35216 "2 page references" claim.',
  },
  {
    id: 'imp35349-honest-banner',
    holds: () => {
      const n = IMP_35349_VIZ_PAGE_CLAIM_AUDIT.honestNote;
      return /no QED/i.test(n) && /imp-3066/.test(n) && /refereed bound is changed/i.test(n);
    },
    why: 'This audit module must carry the standard no-QED / imp-3066-untouched / no-refereed-bound-change honesty banner.',
  },
];

for (const a of IMP_35349_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-35349 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_35349_ASSERTIONS };
