/**
 * @module imp-96417-viz-registration-audit
 *
 * imp-96417 (meta, audit): VERIFY the two most recently shipped viz-data
 * leaves -- imp-96299 (margin-floor LOO/LTO refit spread) and imp-96302
 * (Route L detector-vs-Christoffel reach power laws) -- are correctly
 * registered in visualizations-index.js, reachable via an App.jsx route,
 * and that their pedagogicalStep values are unique within the full index.
 * Per the imp-35447/imp-35468/imp-35715 registration-check method.
 *
 * METHOD. For each of the two tickets: (a) found the corresponding entry in
 * VISUALIZATIONS_INDEX.entries by `ticket` and read its `route`/`dataModule`/
 * `pedagogicalStep` fields; (b) grepped src/App.jsx and confirmed a
 * `<Route path="...">` exists for that same route string, wired to a page
 * component (Imp96299MarginFloorLooViz, Imp96302RouteLReachPowerLawViz);
 * (c) confirmed each page component imports its named exports from the
 * dataModule path recorded in the registry entry; (d) checked the
 * pedagogicalStep on each entry does not collide with any other entry in
 * the index. Importing both viz-data modules here (light, named-export
 * style -- neither ships a default export or a self-executing *_ASSERTIONS
 * array, per the imp-96294 convention) is itself a clean-import check: a
 * broken module would throw at import time.
 *
 * FINDING: both are correctly registered, routed, page-wired, and hold
 * unique pedagogicalStep values (241, 242); no orphan and no collision
 * found. (Unrelated: the wider index already carries pedagogicalStep
 * duplicates at several older steps -- e.g. 142, 144, 178 -- but those
 * predate imp-96299/imp-96302 and are out of scope for this audit.)
 *
 * @see imp-35715-viz-registration-audit (method precedent)
 * @see imp-96299-margin-floor-loo-viz-data
 * @see imp-96302-route-l-reach-power-law-viz-data
 */

import { VISUALIZATIONS_INDEX } from './visualizations-index.js';
import { IMP96299_ANCHORS } from './imp-96299-margin-floor-loo-viz-data.js';
import { IMP96302_HONEST_BANNER } from './imp-96302-route-l-reach-power-law-viz-data.js';

// App.jsx <Route path="..."> strings, confirmed present by direct grep of src/App.jsx
// (each paired with a page component import: Imp96299MarginFloorLooViz,
// Imp96302RouteLReachPowerLawViz).
const APP_ROUTE_WIRED = Object.freeze({
  'imp-96299': '/viz-imp96299-margin-floor-loo',
  'imp-96302': '/viz-imp96302-route-l-reach-power-law',
});

const EXPECTED_DATA_MODULE = Object.freeze({
  'imp-96299': 'src/data/imp-96299-margin-floor-loo-viz-data.js',
  'imp-96302': 'src/data/imp-96302-route-l-reach-power-law-viz-data.js',
});

const AUDITED_TICKETS = ['imp-96299', 'imp-96302'];

const REGISTRATION_CHECK = AUDITED_TICKETS.map((ticket) => {
  const entry = VISUALIZATIONS_INDEX.entries.find((e) => e.ticket === ticket);
  const collisions = entry
    ? VISUALIZATIONS_INDEX.entries.filter(
        (e) => e !== entry && e.pedagogicalStep === entry.pedagogicalStep,
      ).length
    : 0;
  return {
    ticket,
    registryEntryFound: entry !== undefined,
    dataModuleMatches: entry ? entry.dataModule === EXPECTED_DATA_MODULE[ticket] : false,
    route: entry ? entry.route : null,
    appRouteWired: entry ? APP_ROUTE_WIRED[ticket] === entry.route : false,
    pedagogicalStep: entry ? entry.pedagogicalStep : null,
    pedagogicalStepUnique: entry ? collisions === 0 : false,
  };
});

const ALL_CLEAN = REGISTRATION_CHECK.every(
  (c) =>
    c.registryEntryFound
    && c.dataModuleMatches
    && c.appRouteWired
    && c.pedagogicalStepUnique,
);

// Confirms the light-import path is clean for both modules (no throw above);
// referencing one export from each keeps the imports from being tree-shaken.
const LIGHT_IMPORT_OK = IMP96299_ANCHORS !== undefined && typeof IMP96302_HONEST_BANNER === 'string';

export const IMP96417_VIZ_REGISTRATION_AUDIT = {
  id: 'imp-96417',
  proofSection: 'audit',
  question:
    'Are the imp-96299 and imp-96302 viz-data modules registered in '
    + 'visualizations-index.js, App.jsx-routed, and pedagogicalStep-collision-free?',
  registrationCheck: REGISTRATION_CHECK,
  lightImportOk: LIGHT_IMPORT_OK,
  allClean: ALL_CLEAN && LIGHT_IMPORT_OK,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Both imp-96299 and '
    + 'imp-96302 have a VISUALIZATIONS_INDEX.entries record whose dataModule path matches the shipped '
    + 'file, whose route matches the App.jsx <Route> wired to the corresponding page component, and '
    + 'whose pedagogicalStep (241, 242) collides with no other entry. No orphan found; no registration '
    + 'fix needed. Changes no bound; NO QED; no refereed bound is changed.',
  citation:
    'imp-96299, imp-96302 (audited modules); imp-35447, imp-35468, imp-35715 (registration-check '
    + 'method precedent).',
};

export const IMP96417_VIZ_REGISTRATION_AUDIT_ASSERTIONS = [
  {
    id: 'imp96417-both-registered-and-data-module-consistent',
    description: 'each of the two tickets has a VISUALIZATIONS_INDEX entry whose dataModule path matches the shipped file',
    holds: () =>
      IMP96417_VIZ_REGISTRATION_AUDIT.registrationCheck.length === 2
      && IMP96417_VIZ_REGISTRATION_AUDIT.registrationCheck.every((c) => c.registryEntryFound && c.dataModuleMatches),
  },
  {
    id: 'imp96417-both-app-route-wired-and-step-unique',
    description: 'each registry route matches the App.jsx <Route> path wired for that ticket, and each pedagogicalStep is collision-free',
    holds: () =>
      IMP96417_VIZ_REGISTRATION_AUDIT.registrationCheck.every((c) => c.appRouteWired && c.pedagogicalStepUnique),
  },
  {
    id: 'imp96417-audit-clean-no-qed',
    description: 'audit found no orphan or collision (allClean true); audit only, no bound changed, no QED, no refereed bound is changed',
    holds: () =>
      IMP96417_VIZ_REGISTRATION_AUDIT.allClean === true
      && IMP96417_VIZ_REGISTRATION_AUDIT.isRigorous === false
      && /NO QED/.test(IMP96417_VIZ_REGISTRATION_AUDIT.verdict)
      && /refereed bound is changed/i.test(IMP96417_VIZ_REGISTRATION_AUDIT.verdict),
  },
];

for (const a of IMP96417_VIZ_REGISTRATION_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96417-viz-registration-audit assertion failed: ${a.id}`);
  }
}
