/**
 * @module imp-35715-viz-registration-audit
 *
 * imp-35715 (meta, audit): VERIFY the imp-35663 (E_flow span-ladder), imp-35664
 * (far-tail-crossing height-map sensitivity), and imp-35665 (Pinsker
 * common-functional bridge) viz-data modules are registered in
 * visualizations-index.js, reachable via an App.jsx route, that each
 * default-export id matches its registry dataModule path, and that each
 * module's self-executing assertions pass under the light-import path --
 * per the imp-35447/imp-35468 registration-check method.
 *
 * METHOD. For each of the three modules: (a) imported its default export and
 * checked `id` matches the filename slug used as the registry `dataModule`
 * path; (b) found the corresponding entry in VISUALIZATIONS_INDEX.entries by
 * `ticket` and checked its `route`/`dataModule`/`ticket` fields; (c) grepped
 * src/App.jsx and confirmed a `<Route path="...">` exists for that same route
 * string, wired to a page component (Imp35663DecadeSpanGrowthViz,
 * Imp35664FartailCrossingHeightMapSensitivityViz, Imp35665PinskerBridgeViz);
 * (d) confirmed each page component imports its named exports from the
 * correct data module file. Since simply importing each viz-data module
 * already re-runs its own self-executing *_ASSERTIONS array (imp-3715
 * convention -- any failure throws at import), a clean import of all three
 * here is itself the "assertions pass under the light-import path" check.
 *
 * FINDING: all three are correctly registered, routed, and page-wired; no
 * orphan found. Unlike imp-35484 (which found three unwired *_ASSERTIONS
 * exports), this cohort needed no fix.
 *
 * @see imp-35447-krawczyk-headroom-registration-check (method precedent)
 * @see imp-35468-sigma-landmark-orphan-check (method precedent)
 * @see imp-35663-eflow-fartail-decade-span-growth-viz-data
 * @see imp-35664-fartail-crossings-height-map-sensitivity-viz-data
 * @see imp-35665-pinsker-common-functional-bridge-viz-data
 */

import { VISUALIZATIONS_INDEX } from './visualizations-index.js';
import IMP35663_DATA from './imp-35663-eflow-fartail-decade-span-growth-viz-data.js';
import IMP35664_DATA from './imp-35664-fartail-crossings-height-map-sensitivity-viz-data.js';
import IMP35665_DATA from './imp-35665-pinsker-common-functional-bridge-viz-data.js';

// App.jsx <Route path="..."> strings, confirmed present by direct grep of src/App.jsx
// (each paired with a page component import: Imp35663DecadeSpanGrowthViz,
// Imp35664FartailCrossingHeightMapSensitivityViz, Imp35665PinskerBridgeViz).
const APP_ROUTE_WIRED = Object.freeze({
  'imp-35663': '/viz-imp35663-decade-span-growth',
  'imp-35664': '/viz-imp35664-fartail-crossing-height-map-sensitivity',
  'imp-35665': '/viz-imp35665-pinsker-common-functional-bridge',
});

const AUDITED = [
  { ticket: 'imp-35663', defaultExport: IMP35663_DATA },
  { ticket: 'imp-35664', defaultExport: IMP35664_DATA },
  { ticket: 'imp-35665', defaultExport: IMP35665_DATA },
];

const REGISTRATION_CHECK = AUDITED.map(({ ticket, defaultExport }) => {
  const entry = VISUALIZATIONS_INDEX.entries.find((e) => e.ticket === ticket);
  const expectedDataModule = `src/data/${defaultExport.id}.js`;
  return {
    ticket,
    defaultExportId: defaultExport.id,
    registryEntryFound: entry !== undefined,
    dataModuleMatches: entry ? entry.dataModule === expectedDataModule : false,
    route: entry ? entry.route : null,
    appRouteWired: entry ? APP_ROUTE_WIRED[ticket] === entry.route : false,
  };
});

const ALL_CLEAN = REGISTRATION_CHECK.every(
  (c) => c.registryEntryFound && c.dataModuleMatches && c.appRouteWired,
);

export const IMP35715_VIZ_REGISTRATION_AUDIT = {
  id: 'imp-35715',
  proofSection: 'audit',
  question:
    'Are the imp-35663/imp-35664/imp-35665 viz-data modules registered in ' +
    'visualizations-index.js, App.jsx-routed, and default-export-id-consistent?',
  registrationCheck: REGISTRATION_CHECK,
  allClean: ALL_CLEAN,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). All three modules -- ' +
    'imp-35663, imp-35664, imp-35665 -- have a VISUALIZATIONS_INDEX.entries record whose dataModule path ' +
    'matches the module default-export id, whose route matches the App.jsx <Route> wired to the ' +
    'corresponding page component, and each module’s own self-executing assertions passed on import ' +
    '(no throw). No orphan found; no registration fix needed. Changes no bound; NO QED; ' +
    'no refereed bound is changed.',
  citation:
    'imp-35663, imp-35664, imp-35665 (audited modules); imp-35447, imp-35468 (registration-check method ' +
    'precedent); imp-35484 (sibling audit that found and fixed an orphan class, for contrast).',
};

export const IMP35715_VIZ_REGISTRATION_AUDIT_ASSERTIONS = [
  {
    id: 'imp35715-all-three-registered-and-id-consistent',
    description: 'each of the three tickets has a VISUALIZATIONS_INDEX entry whose dataModule path matches the default export id',
    holds: () =>
      IMP35715_VIZ_REGISTRATION_AUDIT.registrationCheck.length === 3 &&
      IMP35715_VIZ_REGISTRATION_AUDIT.registrationCheck.every((c) => c.registryEntryFound && c.dataModuleMatches),
  },
  {
    id: 'imp35715-all-three-app-route-wired',
    description: 'each registry route matches the App.jsx <Route> path wired for that ticket',
    holds: () => IMP35715_VIZ_REGISTRATION_AUDIT.registrationCheck.every((c) => c.appRouteWired),
  },
  {
    id: 'imp35715-audit-clean-no-qed',
    description: 'audit found no orphan (allClean true); audit only, no bound changed, no QED, no refereed bound is changed',
    holds: () =>
      IMP35715_VIZ_REGISTRATION_AUDIT.allClean === true &&
      IMP35715_VIZ_REGISTRATION_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35715_VIZ_REGISTRATION_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35715_VIZ_REGISTRATION_AUDIT.verdict),
  },
];

for (const a of IMP35715_VIZ_REGISTRATION_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35715-viz-registration-audit assertion failed: ${a.id}`);
  }
}
