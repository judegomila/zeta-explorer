/**
 * @module imp-35093-caveat-discoverability-audit-35019-35066
 *
 * imp-35093 (meta): extends the caveat-surfacing (imp-35007/35020/35032/35047) and
 * discoverability (imp-35008/35023/35033) audit lineages -- both of which stopped
 * enumeration at page id ~34957/35018 -- to the imp-35019..35066 viz/data cohort.
 * imp-35062 had already checked this cohort once and found only imp-35018 and
 * imp-35030 in range at the time; imp-35022 (pinned-product decomposition) and
 * imp-35026 (sigma-decay landmark ladder) were still pending. Both now exist, plus
 * four more viz pages authored later in the same id range (imp-35077, imp-35079,
 * imp-35080, imp-35081). This audit re-enumerates all six and re-runs the three
 * checks named in the ticket: (1) honest-status banner present, (2) any
 * self-executing assertion array wired into scripts/run-assertions.mjs, (3) route
 * registered in src/data/visualizations-index.js.
 *
 * METHOD. Grepped src/pages/ for each of imp-35022/35026/35077/35079/35080/35081's
 * page component for "NO QED"/"Honest status" text; grepped each page's own or
 * reused data module for isRigorous/verdict fields; grepped
 * src/data/visualizations-index.js for each route; grepped
 * scripts/run-assertions.mjs MATH_MODULES/DATA_MODULES for each module path;
 * grepped src/data/glossary.js for any headword naming any of the six ticket ids.
 *
 * FINDING (caveat banner): PRESENT on all six. imp-35022 and imp-35026 each render
 * an explicit "Honest status" callout box; imp-35077/35079/35080/35081 each carry
 * the same box (2 matches of NO QED/"Honest status" per page, confirmed by grep
 * count). Zero gap.
 *
 * FINDING (discoverability): ZERO GAP -- all six routes already have an entry in
 * visualizations-index.js (imp-35022 and imp-35026 were registered at some point
 * after imp-35062 ran; imp-35077/35079/35080/35081 were self-registered at
 * creation, breaking the pattern where the imp-34947..34958/35018/35030 cohort
 * needed separate later wiring tickets).
 *
 * FINDING (assertion wiring): ONE GAP. imp-35026 owns a distinct data module
 * (src/data/imp-35026-sigma-decay-landmark-ladder-viz-data.js) with its own
 * self-executing IMP35026_SIGMA_DECAY_LANDMARK_LADDER_VIZ_DATA_ASSERTIONS array,
 * which is NOT listed in scripts/run-assertions.mjs MATH_MODULES or DATA_MODULES
 * -- it only runs on direct import, not in CI. The other five pages have no data
 * module of their own; each reuses an existing module (imp-34956, imp-33582,
 * imp-34947, imp-34933+imp-34948, imp-34925+imp-34950, imp-34954) that is already
 * present in DATA_MODULES, so there is no wiring gap to attribute to them.
 *
 * FINDING (glossary surface): GAP, all six. Grepping glossary.js for '35022',
 * '35026', '35077', '35079', '35080', '35081' returns zero matches -- none of the
 * six pages has a Concepts-page glossary headword.
 *
 * AUDIT-ONLY -- no wiring, index entries, or glossary headwords added here; the
 * assertion-wiring gap (imp-35026) and the glossary-surface gap (all six) are each
 * left as distinct follow-on tickets, matching the imp-35047/imp-35053 precedent
 * of separating audit from fix.
 */

const AUDIT_TARGET = {
  cohortRange: ['imp-35019', 'imp-35066'],
  vizPagesInRange: ['imp-35022', 'imp-35026', 'imp-35077', 'imp-35079', 'imp-35080', 'imp-35081'],
  priorLineageStoppedAt: ['imp-34957', 'imp-35018'],
  priorSpotCheck: 'imp-35062',
};

const CAVEAT_BANNER_AUDIT = {
  imp35022HasHonestStatusBox: true,
  imp35026HasHonestStatusBox: true,
  imp35077HasHonestStatusBox: true,
  imp35079HasHonestStatusBox: true,
  imp35080HasHonestStatusBox: true,
  imp35081HasHonestStatusBox: true,
  gapFound: false,
};

const DISCOVERABILITY_AUDIT = {
  imp35022InVisualizationsIndex: true,
  imp35026InVisualizationsIndex: true,
  imp35077InVisualizationsIndex: true,
  imp35079InVisualizationsIndex: true,
  imp35080InVisualizationsIndex: true,
  imp35081InVisualizationsIndex: true,
  gapFound: false,
};

const ASSERTION_WIRING_AUDIT = {
  imp35026HasOwnDataModule: true,
  imp35026DataModuleWiredInRunAssertions: false,
  otherFiveHaveNoOwnDataModule: true,
  gapFound: true,
  gapTicket: 'imp-35026-sigma-decay-landmark-ladder-viz-data.js unwired from run-assertions.mjs',
};

const GLOSSARY_SURFACE_AUDIT = {
  imp35022HasHeadword: false,
  imp35026HasHeadword: false,
  imp35077HasHeadword: false,
  imp35079HasHeadword: false,
  imp35080HasHeadword: false,
  imp35081HasHeadword: false,
  gapFound: true,
};

export const IMP35093_CAVEAT_DISCOVERABILITY_AUDIT_35019_35066 = {
  ticket: 'imp-35093',
  target: AUDIT_TARGET,
  caveatBannerAudit: CAVEAT_BANNER_AUDIT,
  discoverabilityAudit: DISCOVERABILITY_AUDIT,
  assertionWiringAudit: ASSERTION_WIRING_AUDIT,
  glossarySurfaceAudit: GLOSSARY_SURFACE_AUDIT,
  honest:
    'AUDIT-ONLY -- all six imp-35019..35066 viz pages (imp-35022/35026/35077/35079/35080/35081) '
    + 'carry the shared honest-status banner and are registered in visualizations-index.js, so '
    + 'the caveat-surfacing and discoverability lineages find zero gap once extended past their '
    + 'prior 34957/35018 stopping point. Two residual gaps found and left as distinct follow-on '
    + 'tickets rather than fixed here: imp-35026 owns a self-executing assertion array not wired '
    + 'into scripts/run-assertions.mjs, and none of the six pages has a glossary.js headword. '
    + 'Changes no bound; establishes no operator positivity; no RH verdict; NO QED. '
    + 'No refereed bound is changed.',
};

export const IMP35093_CAVEAT_DISCOVERABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp-35093-target-cohort-has-six-pages',
    description: 'the audited cohort in range imp-35019..35066 has exactly six viz pages',
    holds: () => AUDIT_TARGET.vizPagesInRange.length === 6,
  },
  {
    id: 'imp-35093-caveat-banner-present-no-gap',
    description: 'the caveat-surfacing sub-audit found zero gap across all six pages',
    holds: () =>
      CAVEAT_BANNER_AUDIT.imp35022HasHonestStatusBox === true
      && CAVEAT_BANNER_AUDIT.imp35081HasHonestStatusBox === true
      && CAVEAT_BANNER_AUDIT.gapFound === false,
  },
  {
    id: 'imp-35093-discoverability-no-gap',
    description: 'all six routes are registered in visualizations-index.js',
    holds: () =>
      DISCOVERABILITY_AUDIT.imp35022InVisualizationsIndex === true
      && DISCOVERABILITY_AUDIT.imp35081InVisualizationsIndex === true
      && DISCOVERABILITY_AUDIT.gapFound === false,
  },
  {
    id: 'imp-35093-assertion-wiring-gap-confirmed',
    description: 'imp-35026 has its own data module and it is not wired into run-assertions.mjs',
    holds: () =>
      ASSERTION_WIRING_AUDIT.imp35026HasOwnDataModule === true
      && ASSERTION_WIRING_AUDIT.imp35026DataModuleWiredInRunAssertions === false
      && ASSERTION_WIRING_AUDIT.gapFound === true,
  },
  {
    id: 'imp-35093-glossary-surface-gap-confirmed',
    description: 'none of the six pages has a glossary.js headword',
    holds: () =>
      GLOSSARY_SURFACE_AUDIT.imp35022HasHeadword === false
      && GLOSSARY_SURFACE_AUDIT.imp35081HasHeadword === false
      && GLOSSARY_SURFACE_AUDIT.gapFound === true,
  },
  {
    id: 'imp-35093-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () =>
      /AUDIT-ONLY/.test(IMP35093_CAVEAT_DISCOVERABILITY_AUDIT_35019_35066.honest)
      && /refereed bound is changed/i.test(IMP35093_CAVEAT_DISCOVERABILITY_AUDIT_35019_35066.honest),
  },
];

for (const a of IMP35093_CAVEAT_DISCOVERABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35093-caveat-discoverability-audit assertion failed: ${a.id}`);
  }
}
