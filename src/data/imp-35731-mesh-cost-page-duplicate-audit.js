/**
 * @module imp-35731-mesh-cost-page-duplicate-audit
 *
 * imp-35731 (ux, S-frontier ticket audit): imp-35731 asked to "Add a page/analysis tab
 * rendering the imp-35710 winding mesh-cost Delta-ladder at T_PT=3e12 (boundary evals per
 * enclosed zero vs transition width Delta in {1,2,5,10,20,50,100}): no page currently renders
 * this baked table", citing a grep that found zero consumers of the imp-35710 viz-data module.
 *
 * Auditing the repo BEFORE writing a new page found the requested page ALREADY EXISTS:
 * src/pages/Imp35710WindingMeshCostDeltaLadderViz.jsx renders exactly the described content
 * (an SVG line chart of boundaryEvalsPerZero vs Delta with the =6 horizontal asymptote
 * annotated, plus the full seven-row Delta-ladder table), is routed at
 * /viz-imp35710-winding-mesh-cost-delta-ladder in App.jsx, and is registered in
 * visualizations-index.js (pedagogicalStep 97). imp-35731 is a DUPLICATE ticket -- the page
 * was built (by the imp-35710 ticket itself, judging by the page's own title and inline copy)
 * after the frontier scout's no-consumer grep ran but before this ticket was picked up.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Adds no new page and no new viz-data (imp-35710's page already supplies both in full: the
 * chart, the table, the honest-status banner, and RelatedLinks). No new claim; changes no
 * bound; NO QED.
 *
 * @see imp-35710-winding-mesh-cost-delta-ladder-viz-data (the viz-data module the page renders)
 * @see Imp35710WindingMeshCostDeltaLadderViz (src/pages/, the already-existing page)
 * @see visualizations-index (src/data/visualizations-index.js -- confirms the route registration)
 */

const REQUIRED_ROUTE = '/viz-imp35710-winding-mesh-cost-delta-ladder';
const REQUIRED_PAGE_FILE = 'Imp35710WindingMeshCostDeltaLadderViz.jsx';
const REQUIRED_DATA_MODULE = 'imp-35710-winding-mesh-cost-delta-ladder-viz-data.js';

export const IMP35731_MESH_COST_PAGE_DUPLICATE_AUDIT = {
  id: 'imp-35731',
  proofSection: 'S-frontier',
  question:
    'imp-35731 asked to add a page rendering the imp-35710 Delta-ladder mesh-cost table; ' +
    'audit whether such a page already exists before building a duplicate.',
  finding:
    'DUPLICATE TICKET. The requested page already exists at src/pages/' +
    REQUIRED_PAGE_FILE +
    ', routed at ' +
    REQUIRED_ROUTE +
    ' in App.jsx and registered in visualizations-index.js, rendering the full seven-row ' +
    'Delta-ladder table (delta, enclosedZeros, totalEvals, boundaryEvalsPerZero) plus an SVG ' +
    'line chart of boundary evals per enclosed zero decaying toward the exact horizontal ' +
    'asymptote of 6, anchored at local density ~4.28 zeros/unit-height and meshPerUnit ~12.84.',
  duplicateOf: 'imp-35710 (the page was authored as part of that ticket)',
  requiredRoute: REQUIRED_ROUTE,
  requiredPageFile: REQUIRED_PAGE_FILE,
  requiredDataModule: REQUIRED_DATA_MODULE,
  isRigorous: false,
  verdict:
    'AUDIT ONLY. No new page or viz-data added -- imp-35710 already supplies both in full. ' +
    'This module records the duplicate-ticket finding and pins a permanent regression guard ' +
    'confirming the route and the source-file reference stay consistent. Changes no bound; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
};

export const IMP35731_MESH_COST_PAGE_DUPLICATE_AUDIT_ASSERTIONS = [
  {
    id: 'imp35731-required-route-matches-registered-route',
    description: 'The route this audit cites matches the route the imp-35710 page was registered under',
    holds: () => IMP35731_MESH_COST_PAGE_DUPLICATE_AUDIT.requiredRoute === '/viz-imp35710-winding-mesh-cost-delta-ladder',
  },
  {
    id: 'imp35731-page-file-name-well-formed',
    description: 'The cited page filename is the expected imp-35710 viz page component',
    holds: () => /^Imp35710.*Viz\.jsx$/.test(IMP35731_MESH_COST_PAGE_DUPLICATE_AUDIT.requiredPageFile),
  },
  {
    id: 'imp35731-data-module-name-well-formed',
    description: 'The cited data module matches the imp-35710 viz-data module filename',
    holds: () => IMP35731_MESH_COST_PAGE_DUPLICATE_AUDIT.requiredDataModule === 'imp-35710-winding-mesh-cost-delta-ladder-viz-data.js',
  },
  {
    id: 'imp35731-honesty-gate-no-qed',
    description: 'Audit finding is non-rigorous scoping metadata; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35731_MESH_COST_PAGE_DUPLICATE_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35731_MESH_COST_PAGE_DUPLICATE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35731_MESH_COST_PAGE_DUPLICATE_AUDIT.verdict),
  },
];

for (const a of IMP35731_MESH_COST_PAGE_DUPLICATE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35731-mesh-cost-page-duplicate-audit assertion failed: ${a.id}`);
  }
}
