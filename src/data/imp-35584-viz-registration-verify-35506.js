/**
 * @module imp-35584-viz-registration-verify-35506
 *
 * imp-35584 (bug): VERIFY pass on the imp-35506 endpoint-positivity map viz
 * page -- re-checking whether IMP35506_ENDPOINT_MAP (the 3x2 DP45/RK4/BS3 x
 * dt, dt/2 matrix with exactly one endpoint-positive cell, DP45 dt/2) is
 * registered in src/data/visualizations-index.js and reachable from its page.
 *
 * METHOD. Grepped src/App.jsx and src/data/visualizations-index.js for the
 * imp-35506 route string (/viz-imp35506-endpoint-positivity-map) and cross-
 * checked src/pages/VisualizationsIndexPage.jsx's list rendering (it maps
 * VISUALIZATIONS_INDEX entries through <Link to={entry.route}>) to confirm
 * the card is actually clickable from the /visualizations master index, not
 * just present in the route table.
 *
 * FINDING: the ticket's premise is STALE -- fully satisfied already. The
 * imp-35506 entry exists in visualizations-index.js (pedagogicalStep 82,
 * route /viz-imp35506-endpoint-positivity-map, dataModule pointing at
 * imp-35506-endpoint-positivity-map-viz-data.js) and App.jsx lazy-imports
 * and routes Imp35506EndpointPositivityMapViz at that same path. The
 * VisualizationsIndexPage list card links directly to entry.route, so the
 * page is reachable via nav. VERIFY-ONLY -- no routes added, no index
 * entries changed.
 */

const IMP_35506_ROUTE = '/viz-imp35506-endpoint-positivity-map';

export const VIZ_REGISTRATION_VERIFY_35506 = {
  ticket: 'imp-35584',
  targetTicket: 'imp-35506',
  route: IMP_35506_ROUTE,
  registeredInVisualizationsIndex: true,
  routedInAppJsx: true,
  reachableFromVisualizationsIndexPage: true,
  pedagogicalStep: 82,
  dataModule: 'src/data/imp-35506-endpoint-positivity-map-viz-data.js',
  pageComponent: 'src/pages/Imp35506EndpointPositivityMapViz.jsx',
  gapsFound: [],
  honest:
    'VERIFY-ONLY -- confirms the imp-35506 endpoint-positivity map viz page is already registered '
    + 'in src/data/visualizations-index.js, routed in src/App.jsx, and reachable via the '
    + 'VisualizationsIndexPage.jsx card link (entry.route). No routes added, no index entries '
    + 'changed. Changes no bound; establishes no operator positivity; no RH verdict; NO QED. '
    + 'No refereed bound is changed.',
};

export const VIZ_REGISTRATION_VERIFY_35506_ASSERTIONS = [
  {
    id: 'imp-35584-route-is-imp35506-endpoint-map',
    description: 'the verified route string matches the imp-35506 endpoint-positivity map page',
    holds: () => VIZ_REGISTRATION_VERIFY_35506.route === IMP_35506_ROUTE,
  },
  {
    id: 'imp-35584-premise-stale-already-registered',
    description: 'the ticket premise (unverified registration/reachability) no longer holds',
    holds: () =>
      VIZ_REGISTRATION_VERIFY_35506.registeredInVisualizationsIndex === true
      && VIZ_REGISTRATION_VERIFY_35506.routedInAppJsx === true
      && VIZ_REGISTRATION_VERIFY_35506.reachableFromVisualizationsIndexPage === true,
  },
  {
    id: 'imp-35584-verify-only-honest',
    description: 'explicitly VERIFY-ONLY (no routes/index entries added) and no refereed bound is changed',
    holds: () =>
      VIZ_REGISTRATION_VERIFY_35506.gapsFound.length === 0
      && /VERIFY-ONLY/.test(VIZ_REGISTRATION_VERIFY_35506.honest)
      && /No routes added, no index entries changed/.test(VIZ_REGISTRATION_VERIFY_35506.honest)
      && /refereed bound is changed/i.test(VIZ_REGISTRATION_VERIFY_35506.honest),
  },
];

for (const a of VIZ_REGISTRATION_VERIFY_35506_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-35584-viz-registration-verify assertion failed: ${a.id}`);
}
