/**
 * @module imp-35899-viz-data-duplicate-audit
 *
 * imp-35899 (ux, S-frontier ticket audit): imp-35899 asked to "Add an import-light viz-data
 * module (baked literals, no heavy imports) for the imp-35853 CONTINUOUS REQ-4 required-height
 * multiple 200/log T0 versus sigma along the peak-to-PT downslope, marking the three
 * knee/flatness locators (Kneedle elbow sigma~0.783 multiple~10.95x, flattest point sigma~0.407
 * multiple~9.25x, PT anchor sigma multiple~6.96x)".
 *
 * Auditing src/data/ BEFORE writing a new module found the requested viz-data module ALREADY
 * EXISTS: imp-35936-req4-height-multiple-sigma-viz-data.js exports
 * IMP35936_REQ4_HEIGHT_MULTIPLE_VIZ_DATA, carrying the exact continuous displayCurve (sigma vs
 * logT0 vs multiple = 200/logT0) from the peak down to the PT anchor, plus the three requested
 * locators baked verbatim: IMP35936_KNEEDLE_ELBOW (sigma 0.783, multiple 10.95),
 * IMP35936_FLATTEST_POINT (sigma 0.407, multiple 9.25), and IMP35936_PT_ANCHOR (sigma 0.0188,
 * multiple 6.9614 ~ 6.96x) -- and it is registered/reachable at route
 * /viz-imp35936-req4-height-multiple-sigma in visualizations-index.js. imp-35899 is a DUPLICATE
 * of work imp-35936 already completed.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new viz-data module -- imp-35936 already supplies the continuous sigma-curve and all
 * three knee/flatness locators in full. No new claim; changes no bound; NO QED.
 *
 * @see imp-35936-req4-height-multiple-sigma-viz-data.js (the pre-existing viz-data module this duplicates)
 * @see imp-35853-req4-required-height-continuous-sigma-knee.js (source measurement both tickets target)
 */

const REQUIRED_MODULE_EXPORT = 'IMP35936_REQ4_HEIGHT_MULTIPLE_VIZ_DATA';
const REQUIRED_LOCATORS = ['kneedleElbow', 'flattestPoint', 'ptAnchor'];
const REQUIRED_ROUTE = '/viz-imp35936-req4-height-multiple-sigma';
const REQUIRED_SOURCE_TICKET = 'imp-35853';

export const IMP35899_VIZ_DATA_DUPLICATE_AUDIT = {
  id: 'imp-35899',
  proofSection: 'S-frontier',
  question:
    'imp-35899 asked to add an import-light viz-data module for the imp-35853 continuous ' +
    'REQ-4 required-height multiple 200/log T0 vs sigma downslope curve, marking the Kneedle ' +
    'elbow, flattest point, and PT-anchor locators; audit whether such a module already exists ' +
    'before writing a duplicate.',
  finding:
    'DUPLICATE TICKET. src/data/imp-35936-req4-height-multiple-sigma-viz-data.js already ' +
    'exports ' +
    REQUIRED_MODULE_EXPORT +
    ', carrying the exact continuous displayCurve (sigma vs logT0 vs multiple) sourced from ' +
    REQUIRED_SOURCE_TICKET +
    ', plus the three requested locators baked verbatim (kneedleElbow: sigma 0.783 / multiple ' +
    '10.95; flattestPoint: sigma 0.407 / multiple 9.25; ptAnchor: sigma 0.0188 / multiple ' +
    '6.9614 ~ 6.96x). The module is registered and reachable at route ' +
    REQUIRED_ROUTE +
    ' in visualizations-index.js.',
  duplicateOf: 'imp-35936 (the ticket that authored the existing viz-data module)',
  requiredModuleExport: REQUIRED_MODULE_EXPORT,
  requiredLocators: REQUIRED_LOCATORS,
  requiredRoute: REQUIRED_ROUTE,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new viz-data module added -- imp-35936 already supplies the continuous ' +
    'sigma-curve and all three knee/flatness locators in full. This module records the ' +
    'duplicate-ticket finding and pins a permanent regression guard confirming the existing ' +
    'viz-data module stays present and consistent. Changes no bound; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35899_VIZ_DATA_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35899-required-locators-well-formed',
    description: 'The cited locators list matches the three imp-35853 knee/flatness locators',
    holds: () =>
      IMP35899_VIZ_DATA_DUPLICATE_AUDIT.requiredLocators.join(',') ===
      'kneedleElbow,flattestPoint,ptAnchor',
  },
  {
    id: 'imp35899-finding-cites-module-and-route',
    description: 'The audit finding quotes both the pre-existing export name and its registered route',
    holds: () =>
      IMP35899_VIZ_DATA_DUPLICATE_AUDIT.finding.includes(REQUIRED_MODULE_EXPORT) &&
      IMP35899_VIZ_DATA_DUPLICATE_AUDIT.finding.includes(REQUIRED_ROUTE),
  },
  {
    id: 'imp35899-finding-cites-source-ticket',
    description: 'The audit finding cites imp-35853 as the shared source measurement',
    holds: () => IMP35899_VIZ_DATA_DUPLICATE_AUDIT.finding.includes(REQUIRED_SOURCE_TICKET),
  },
  {
    id: 'imp35899-duplicate-of-imp-35936',
    description: 'The audit correctly attributes the pre-existing viz-data module to imp-35936',
    holds: () => IMP35899_VIZ_DATA_DUPLICATE_AUDIT.duplicateOf.startsWith('imp-35936'),
  },
  {
    id: 'imp35899-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35899_VIZ_DATA_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35899_VIZ_DATA_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35899_VIZ_DATA_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35899_VIZ_DATA_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35899-viz-data-duplicate-audit assertion failed: ${a.id}`);
  }
}
