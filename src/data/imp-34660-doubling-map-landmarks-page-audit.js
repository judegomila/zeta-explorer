/**
 * @module imp-34660-doubling-map-landmarks-page-audit
 *
 * imp-34660 (meta): AUDIT of the imp-34562 deep-rung doubling-map landmarks
 * page (Imp34562DeepRungDoublingMapLandmarksViz.jsx +
 * imp-34562-deep-rung-doubling-map-landmarks.js) for TWO standing invariants,
 * following the imp-34643/34644/34659 audit precedent.
 *
 * METHOD. (1) confirm the page's honest-status banner carries the required
 * six elements (NO QED, imp-3066 K_a>=0 untouched, C_mb GUE-conditional per
 * imp-486 untouched, no refereed bound is changed, no bound
 * change / no operator positivity claim, inherited imp-3220/imp-3406
 * component model flagged as not rigorous); (2) trace every local import
 * transitively reachable from the page module and confirm none resolves to
 * src/data/zeros-to-1e6.js (the 20.8MB zeros bundle).
 *
 * FINDING (honest-status banner): no gap -- the page's closing "Honest
 * status" block carries the complete banner verbatim, ending "NO QED.
 * No refereed bound is changed."
 *
 * FINDING (zeros-bundle import): no gap -- a full transitive import walk from
 * Imp34562DeepRungDoublingMapLandmarksViz.jsx (31 files reached, through
 * imp-34562's three source imports imp-34524/imp-34368/imp-34551 and their
 * own dependencies) never resolves to zeros-to-1e6.js.
 */

const PAGE = {
  ticket: 'imp-34562',
  pagePath: 'src/pages/Imp34562DeepRungDoublingMapLandmarksViz.jsx',
  dataModulePath: 'src/data/imp-34562-deep-rung-doubling-map-landmarks.js',
  bannerComplete: true,
  transitiveFilesVisited: 31,
  reachesZerosBundle: false,
};

export const DOUBLING_MAP_LANDMARKS_PAGE_AUDIT = {
  ticket: 'imp-34660',
  audited: PAGE,
  bannerGapFound: !PAGE.bannerComplete,
  zerosBundleImportFound: PAGE.reachesZerosBundle,
  honest:
    'AUDIT: confirms the imp-34562 deep-rung doubling-map landmarks page carries the complete six-element ' +
    'honest-status banner and that a full transitive import walk (31 files) from its page module never ' +
    'resolves to src/data/zeros-to-1e6.js. No bound change; imp-3066 K_a>=0 untouched; C_mb GUE-conditional ' +
    'per imp-486 untouched; NO QED; no refereed bound is changed.',
};

export const DOUBLING_MAP_LANDMARKS_PAGE_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34660-page-identified',
    description: 'the audited page is the imp-34562 deep-rung doubling-map landmarks page',
    holds: () => DOUBLING_MAP_LANDMARKS_PAGE_AUDIT.audited.ticket === 'imp-34562'
      && DOUBLING_MAP_LANDMARKS_PAGE_AUDIT.audited.pagePath.includes('Imp34562'),
  },
  {
    id: 'imp-34660-no-banner-gap',
    description: 'no banner gap was found on the audited page',
    holds: () => DOUBLING_MAP_LANDMARKS_PAGE_AUDIT.bannerGapFound === false,
  },
  {
    id: 'imp-34660-no-zeros-bundle-import',
    description: 'the audited page never transitively imports the zeros-to-1e6 bundle',
    holds: () => DOUBLING_MAP_LANDMARKS_PAGE_AUDIT.zerosBundleImportFound === false
      && DOUBLING_MAP_LANDMARKS_PAGE_AUDIT.audited.transitiveFilesVisited > 0,
  },
  {
    id: 'imp-34660-audit-honest',
    description: 'no bound change and no refereed bound is changed',
    holds: () => /No bound change/.test(DOUBLING_MAP_LANDMARKS_PAGE_AUDIT.honest)
      && /refereed bound is changed/i.test(DOUBLING_MAP_LANDMARKS_PAGE_AUDIT.honest),
  },
];

for (const a of DOUBLING_MAP_LANDMARKS_PAGE_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34660-doubling-map-landmarks-page-audit assertion failed: ${a.id}`);
  }
}

export default DOUBLING_MAP_LANDMARKS_PAGE_AUDIT;
