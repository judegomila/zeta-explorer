/**
 * @module imp-35047-caveat-discoverability-audit-35009-35018
 *
 * imp-35047 (meta): caveat-surfacing + discoverability + glossary-surface audit of the
 * imp-35009 (four-landmark cluster tabulation) / imp-35018 (its viz-data companion + page)
 * cohort -- the most recent viz cohort at the time this audit was authored, not yet checked
 * by the caveat-surfacing (imp-35007/35020/35032) or discoverability (imp-35008/35023)
 * audit lineages, both of which stop at page id 34957.
 *
 * METHOD. (1) Read src/data/imp-35018-four-landmark-cluster-log-n-viz-data.js and
 * src/pages/Imp35018FourLandmarkClusterLogNViz.jsx in full for the shared honest-status
 * banner (isRigorous: false, C_mb GUE-conditional per imp-486, changes-no-bound, NO QED,
 * no refereed bound is changed). (2) Grepped src/App.jsx for the route registration.
 * (3) Grepped src/data/visualizations-index.js for a matching entry. (4) Grepped
 * scripts/audit-nav-links.mjs for the route in its EXEMPT_FROM_INDEX drift-backlog set
 * (imp-2675). (5) Grepped src/ for any inbound <Link> to the route outside App.jsx's own
 * <Route>. (6) Grepped src/data/glossary.js for a headword naming imp-35009 or imp-35018.
 * (7) Grepped scripts/run-assertions.mjs MATH_MODULES for the data module, per the
 * orphaned-assertion-wiring lineage (imp-34896/34920/34945/34967/35032).
 *
 * FINDING (caveat banner): PRESENT on both artifacts. The data module exports
 * isRigorous: false and a citation string naming all four source tickets; its module
 * docstring states "NO QED" and "No refereed bound is changed". The viz page renders an
 * explicit "Honest status" callout box repeating isRigorous-equivalent language (no
 * recomputation, C_mb GUE-conditional per imp-486, changes no bound, establishes no
 * operator positivity, no RH verdict, NO QED, no refereed bound is changed). Zero gap.
 *
 * FINDING (discoverability): ORPHANED, matching every prior cohort audited by imp-35008/
 * imp-35023. The route /viz-imp35018-four-landmark-cluster-log-n is registered in
 * App.jsx and listed in the scripts/audit-nav-links.mjs EXEMPT_FROM_INDEX backlog set, but
 * has NO entry in src/data/visualizations-index.js and NO inbound <Link> from any other
 * page -- reachable only by direct URL.
 *
 * FINDING (glossary surface): ABSENT. Neither imp-35009 nor imp-35018 has a
 * src/data/glossary.js headword -- zero Concepts-page search path, worse than the
 * imp-34952..34957 cohort's partial 3-of-6 coverage.
 *
 * BONUS FINDING (assertion wiring, beyond this ticket's explicit scope but surfaced by
 * the same read): the data module's 5-assertion self-executing array is NOT listed in
 * scripts/run-assertions.mjs MATH_MODULES, so it only runs on direct import, not in CI --
 * an orphaned-assertion gap of the same shape the imp-34896/34920/34945/34967/35032
 * lineage has been closing elsewhere. This is the exact subject of the separately queued
 * imp-35053 wiring ticket.
 *
 * AUDIT-ONLY -- no index entries, routes, glossary headwords, or MATH_MODULES entries
 * added here; each fix is a distinct already-queued ticket (imp-35053 wiring, imp-35061-
 * style index registration, imp-35052/imp-35060-style glossary headword).
 */

const AUDIT_TARGET = {
  cohort: ['imp-35009', 'imp-35018'],
  dataModule: 'src/data/imp-35018-four-landmark-cluster-log-n-viz-data.js',
  vizPage: 'src/pages/Imp35018FourLandmarkClusterLogNViz.jsx',
  route: '/viz-imp35018-four-landmark-cluster-log-n',
};

const CAVEAT_BANNER_AUDIT = {
  dataModuleHasIsRigorousFalse: true,
  dataModuleHasCitation: true,
  vizPageHasHonestStatusBox: true,
  bothNameGueConditionalImp486: true,
  bothStateNoQed: true,
  bothStatePlattTrudgianSota: true,
  gapFound: false,
};

const DISCOVERABILITY_AUDIT = {
  registeredInAppJsx: true,
  inVisualizationsIndexRegistry: false,
  inExemptFromIndexBacklog: true,
  hasInboundLinkFromOtherPage: false,
  reachableOnlyByDirectUrl: true,
  gapFound: true,
};

const GLOSSARY_SURFACE_AUDIT = {
  imp35009HasHeadword: false,
  imp35018HasHeadword: false,
  gapFound: true,
};

const ASSERTION_WIRING_BONUS_AUDIT = {
  hasSelfExecutingAssertionArray: true,
  listedInRunAssertionsMathModules: false,
  gapFound: true,
  trackedByTicket: 'imp-35053',
};

export const IMP35047_CAVEAT_DISCOVERABILITY_AUDIT_35009_35018 = {
  ticket: 'imp-35047',
  target: AUDIT_TARGET,
  caveatBannerAudit: CAVEAT_BANNER_AUDIT,
  discoverabilityAudit: DISCOVERABILITY_AUDIT,
  glossarySurfaceAudit: GLOSSARY_SURFACE_AUDIT,
  assertionWiringBonusAudit: ASSERTION_WIRING_BONUS_AUDIT,
  honest:
    'AUDIT-ONLY -- the imp-35018 data module and viz page carry the shared honest-status '
    + 'banner in full (isRigorous: false, C_mb GUE-conditional per imp-486, changes no bound, '
    + 'NO QED, no refereed bound is changed); zero gap there. But the page is orphaned from '
    + 'the /visualizations master index (present only in the EXEMPT_FROM_INDEX drift backlog, '
    + 'no inbound Link), matching every prior cohort audited by imp-35008/imp-35023, and '
    + 'neither imp-35009 nor imp-35018 has any Concepts-page glossary headword. A bonus read '
    + 'also found the data module’s assertion array unwired from scripts/run-assertions.mjs '
    + 'MATH_MODULES (tracked separately by imp-35053). No routes, index entries, headwords, or '
    + 'MATH_MODULES entries added here -- each fix is a distinct already-queued ticket. Changes '
    + 'no bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed'
    + '.',
};

export const IMP35047_CAVEAT_DISCOVERABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp-35047-target-is-35009-35018',
    description: 'the audited cohort is exactly imp-35009 and imp-35018',
    holds: () =>
      AUDIT_TARGET.cohort.length === 2 &&
      AUDIT_TARGET.cohort.includes('imp-35009') &&
      AUDIT_TARGET.cohort.includes('imp-35018'),
  },
  {
    id: 'imp-35047-caveat-banner-present-no-gap',
    description: 'the caveat-surfacing sub-audit found zero gap on the honest-status banner',
    holds: () =>
      CAVEAT_BANNER_AUDIT.dataModuleHasIsRigorousFalse === true &&
      CAVEAT_BANNER_AUDIT.vizPageHasHonestStatusBox === true &&
      CAVEAT_BANNER_AUDIT.gapFound === false,
  },
  {
    id: 'imp-35047-discoverability-gap-confirmed',
    description: 'the page is registered but orphaned from the master index with no inbound Link',
    holds: () =>
      DISCOVERABILITY_AUDIT.registeredInAppJsx === true &&
      DISCOVERABILITY_AUDIT.inVisualizationsIndexRegistry === false &&
      DISCOVERABILITY_AUDIT.hasInboundLinkFromOtherPage === false &&
      DISCOVERABILITY_AUDIT.gapFound === true,
  },
  {
    id: 'imp-35047-glossary-surface-gap-confirmed',
    description: 'neither imp-35009 nor imp-35018 has a glossary headword',
    holds: () =>
      GLOSSARY_SURFACE_AUDIT.imp35009HasHeadword === false &&
      GLOSSARY_SURFACE_AUDIT.imp35018HasHeadword === false &&
      GLOSSARY_SURFACE_AUDIT.gapFound === true,
  },
  {
    id: 'imp-35047-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () =>
      /AUDIT-ONLY/.test(IMP35047_CAVEAT_DISCOVERABILITY_AUDIT_35009_35018.honest) &&
      /refereed bound is changed/i.test(IMP35047_CAVEAT_DISCOVERABILITY_AUDIT_35009_35018.honest),
  },
];

for (const a of IMP35047_CAVEAT_DISCOVERABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35047-caveat-discoverability-audit assertion failed: ${a.id}`);
  }
}
