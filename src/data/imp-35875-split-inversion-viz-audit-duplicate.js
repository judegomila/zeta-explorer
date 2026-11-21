/**
 * @module imp-35875-split-inversion-viz-audit-duplicate
 *
 * imp-35875 (ux, S-frontier ticket audit): imp-35875 asked to "Seed an import-light
 * viz-data module + routed page for the imp-35809 Krawczyk D3 curvature/shift split
 * INVERSION along the height axis (band ~98% curvature -> PT anchor ~98.5% shift, 50/50
 * crossover at a=4delta~8e-4, N~1.88e11), if none already exists."
 *
 * Auditing the repo BEFORE building a fresh viz module found the requested artifact
 * ALREADY EXISTS in full: imp-35863 (imp-35863-krawczyk-split-inversion-viz-data.js)
 * bakes exactly this height ladder (band-top, 50/50 crossover at a~4.delta, PT anchor),
 * imp-35863's routed page (src/pages/Imp35863KrawczykSplitInversionViz.jsx) plots
 * shiftFraction/curvatureFraction vs log10(N), and both are wired into src/App.jsx
 * (route /viz-imp35863-krawczyk-split-inversion) and src/data/visualizations-index.js.
 * imp-35875 is a DUPLICATE ticket -- the frontier scout re-seeded the imp-35809 viz gap
 * after imp-35863 had already closed it.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new viz-data module and no new page: imp-35863 already supplies the full
 * height-ladder data, the 50/50 crossover landmark, and the routed line-chart page.
 * No new claim; changes no bound; NO QED.
 *
 * @see imp-35863-krawczyk-split-inversion-viz-data (the already-existing viz-data module + routed page)
 * @see imp-35809-krawczyk-surplus-split-band-and-height-profile (source measurement)
 */

const REQUIRED_DUPLICATE_ID = 'imp-35863';
const REQUIRED_DATA_MODULE_FILE = 'imp-35863-krawczyk-split-inversion-viz-data.js';
const REQUIRED_PAGE_FILE = 'Imp35863KrawczykSplitInversionViz.jsx';
const REQUIRED_ROUTE = '/viz-imp35863-krawczyk-split-inversion';

export const IMP35875_SPLIT_INVERSION_VIZ_AUDIT_DUPLICATE = {
  id: 'imp-35875',
  proofSection: 'S-frontier',
  question:
    'imp-35875 asked to seed an import-light viz-data module + routed page for the ' +
    'imp-35809 Krawczyk D3 curvature/shift split inversion along the height axis, IF ' +
    'none already exists; audit whether that artifact already exists before building a duplicate.',
  finding:
    'DUPLICATE TICKET. The requested viz-data module and routed page already exist as ' +
    REQUIRED_DATA_MODULE_FILE +
    ' and ' +
    REQUIRED_PAGE_FILE +
    ', both wired into src/App.jsx and src/data/visualizations-index.js at route ' +
    REQUIRED_ROUTE +
    '. The module bakes the same band-top (~1.9%/98.1%), 50/50 crossover (a~4.delta, ' +
    'N~1.88e11), and PT-anchor (~98.5%/1.5%) landmarks imp-35875 requested.',
  duplicateOf: REQUIRED_DUPLICATE_ID + ' (viz-data module + routed page, landed before this ticket was picked up)',
  requiredDataModuleFile: REQUIRED_DATA_MODULE_FILE,
  requiredPageFile: REQUIRED_PAGE_FILE,
  requiredRoute: REQUIRED_ROUTE,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new viz-data module or page added -- imp-35863 already supplies the ' +
    'full artifact imp-35875 requested. This module records the duplicate-ticket finding ' +
    'and pins a permanent regression guard confirming the citation stays consistent. ' +
    'Changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35875_SPLIT_INVERSION_VIZ_AUDIT_DUPLICATE_ASSERTIONS = [
  {
    id: 'imp35875-duplicate-of-well-formed',
    description: 'The cited duplicate ticket id matches the imp-35863 viz-data + page module',
    holds: () => IMP35875_SPLIT_INVERSION_VIZ_AUDIT_DUPLICATE.duplicateOf.startsWith('imp-35863'),
  },
  {
    id: 'imp35875-required-data-module-file-well-formed',
    description: 'The cited data-module filename matches the already-existing imp-35863 viz-data module',
    holds: () =>
      IMP35875_SPLIT_INVERSION_VIZ_AUDIT_DUPLICATE.requiredDataModuleFile ===
      'imp-35863-krawczyk-split-inversion-viz-data.js',
  },
  {
    id: 'imp35875-required-page-file-well-formed',
    description: 'The cited page filename matches the already-existing imp-35863 routed page',
    holds: () =>
      IMP35875_SPLIT_INVERSION_VIZ_AUDIT_DUPLICATE.requiredPageFile === 'Imp35863KrawczykSplitInversionViz.jsx',
  },
  {
    id: 'imp35875-required-route-well-formed',
    description: 'The cited route matches the already-registered imp-35863 route',
    holds: () =>
      IMP35875_SPLIT_INVERSION_VIZ_AUDIT_DUPLICATE.requiredRoute === '/viz-imp35863-krawczyk-split-inversion',
  },
  {
    id: 'imp35875-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35875_SPLIT_INVERSION_VIZ_AUDIT_DUPLICATE.isRigorous === false &&
      /NO QED/.test(IMP35875_SPLIT_INVERSION_VIZ_AUDIT_DUPLICATE.verdict) &&
      /refereed bound is changed/i.test(IMP35875_SPLIT_INVERSION_VIZ_AUDIT_DUPLICATE.verdict),
  },
];

for (const a of IMP35875_SPLIT_INVERSION_VIZ_AUDIT_DUPLICATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35875-split-inversion-viz-audit-duplicate assertion failed: ${a.id}`);
  }
}
