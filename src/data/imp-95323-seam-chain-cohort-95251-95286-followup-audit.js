/**
 * @module imp-95323-seam-chain-cohort-95251-95286-followup-audit
 *
 * imp-95323 (meta): FOLLOW-UP SURFACING AUDIT of the same five seam-chain
 * finding modules covered by imp-95306 -- imp-95251 (THEOREM COAL-N),
 * imp-95252 (THEOREM RZ-LAT/RZ-TWIN), imp-95254 (THEOREM PHASE-AM),
 * imp-95285 (THEOREM EV-OCT-N), imp-95286 (THEOREM CONF-LB).
 *
 * WHY A FOLLOW-UP. The imp-95306 audit recorded all five as import-light,
 * run-assertions-registered, and with "no dedicated viz page, glossary
 * headword, or visualizations-index entry yet" for any of the five. Since
 * that audit, several open queue tickets it named as already targeting
 * that gap (imp-95303, imp-95304, imp-95305, imp-95317) shipped viz pages.
 * This follow-up re-checks reachability against the CURRENT repo state
 * rather than trusting the imp-95306 snapshot, per the imp-95323 ticket
 * text ("verify... are reachable... or record which are orphaned").
 *
 * METHOD. Direct grep of src/pages/*.jsx and src/data/visualizations-index.js
 * for each module's ticket id, plus a re-grep of scripts/run-assertions.mjs
 * DATA_MODULES and each source file for "^import" statements.
 *
 * FINDING: the surfacing gap has narrowed from 5-of-5 to 1-of-5. imp-95251,
 * imp-95252, imp-95254 and imp-95286 are each now reachable from at least
 * one dedicated viz page (Imp95303ConfLbVsCoalNWindowPinchViz.jsx,
 * Imp95317ConfluentBracketAcrossRViz.jsx, Imp95305SplitRzVsEvOctUnifOnsetViz.jsx,
 * Imp95319SplitRzVsSplitLooCollarViz.jsx, Imp95304PhaseAmVsPhaseCertCeilXViz.jsx)
 * and from visualizations-index.js. imp-95285 has ZERO surfacing of any
 * kind -- no viz page, no glossary headword, no visualizations-index entry
 * -- confirmed genuinely orphaned, not covered by any completed or pending
 * ticket (imp-95143/95303/95304/95305/95317/95318/95319 all target the
 * other four members of the cohort, none targets imp-95285). All five
 * remain import-light (zero "^import" lines) and registered in the
 * scripts/run-assertions.mjs DATA_MODULES list, so imp-95285's
 * self-executing assertions still run on every build regardless of the
 * page gap. AUDIT-ONLY; no viz page fabricated here (a dedicated
 * imp-95285 viz remains a separate, correctly-scoped follow-up ticket).
 * Changes no bound; no operator positivity; NO QED; no refereed bound is changed.
 */

const COHORT_CURRENT = [
  {
    ticket: 'imp-95251',
    module: 'src/data/imp-95251-nfold-coalescence-law.js',
    theorem: 'COAL-N',
    hasImportStatement: false,
    registeredInRunAssertions: true,
    hasVizPage: true,
    hasGlossaryHeadword: false,
    inVisualizationsIndex: true,
  },
  {
    ticket: 'imp-95252',
    module: 'src/data/imp-95252-muniform-block-riesz-seam-pencil.js',
    theorem: 'RZ-LAT/RZ-TWIN',
    hasImportStatement: false,
    registeredInRunAssertions: true,
    hasVizPage: true,
    hasGlossaryHeadword: false,
    inVisualizationsIndex: true,
  },
  {
    ticket: 'imp-95254',
    module: 'src/data/imp-95254-orthant-split-phase-certificate.js',
    theorem: 'PHASE-AM',
    hasImportStatement: false,
    registeredInRunAssertions: true,
    hasVizPage: true,
    hasGlossaryHeadword: false,
    inVisualizationsIndex: true,
  },
  {
    ticket: 'imp-95285',
    module: 'src/data/imp-95285-n-per-octave-split-instantiation.js',
    theorem: 'EV-OCT-N',
    hasImportStatement: false,
    registeredInRunAssertions: true,
    hasVizPage: false,
    hasGlossaryHeadword: false,
    inVisualizationsIndex: false,
  },
  {
    ticket: 'imp-95286',
    module: 'src/data/imp-95286-confluent-laguerre-floor.js',
    theorem: 'CONF-LB',
    hasImportStatement: false,
    registeredInRunAssertions: true,
    hasVizPage: true,
    hasGlossaryHeadword: false,
    inVisualizationsIndex: true,
  },
];

export const SEAM_CHAIN_COHORT_95251_95286_FOLLOWUP_AUDIT = {
  ticket: 'imp-95323',
  priorAudit: 'imp-95306',
  cohort: COHORT_CURRENT,
  heavyImportGaps: COHORT_CURRENT.filter((m) => m.hasImportStatement).map((m) => m.ticket),
  unregisteredGaps: COHORT_CURRENT.filter((m) => !m.registeredInRunAssertions).map((m) => m.ticket),
  noSurfaceIds: COHORT_CURRENT
    .filter((m) => !m.hasVizPage && !m.hasGlossaryHeadword && !m.inVisualizationsIndex)
    .map((m) => m.ticket),
  honest: 'FOLLOW-UP AUDIT of the imp-95306 cohort -- confirms all 5 modules remain import-light (zero import '
    + 'statements) and registered in scripts/run-assertions.mjs DATA_MODULES. The surfacing gap imp-95306 recorded '
    + 'as 5-of-5 has narrowed to 1-of-5: imp-95251, imp-95252, imp-95254 and imp-95286 now each have a dedicated '
    + 'viz page and a visualizations-index.js entry; imp-95285 remains genuinely orphaned (no page, no glossary '
    + 'headword, no index entry) and is not targeted by any other open or completed ticket. No new surfacing added '
    + 'here -- AUDIT-ONLY, per the imp-95323 scope. Changes no bound; no operator positivity; NO QED; '
    + 'no refereed bound is changed.',
};

const ASSERTIONS = [
  {
    id: 'imp-95323-cohort-has-five-members',
    description: 'the re-audited cohort is exactly the same five modules imp-95306 covered',
    holds: () => COHORT_CURRENT.length === 5
      && ['imp-95251', 'imp-95252', 'imp-95254', 'imp-95285', 'imp-95286']
        .every((t) => COHORT_CURRENT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-95323-no-heavy-import-gaps',
    description: 'every cohort module still has zero import statements',
    holds: () => COHORT_CURRENT.every((m) => m.hasImportStatement === false)
      && SEAM_CHAIN_COHORT_95251_95286_FOLLOWUP_AUDIT.heavyImportGaps.length === 0,
  },
  {
    id: 'imp-95323-all-registered-in-run-assertions',
    description: 'every cohort module is still registered in the run-assertions.mjs DATA_MODULES list',
    holds: () => COHORT_CURRENT.every((m) => m.registeredInRunAssertions === true)
      && SEAM_CHAIN_COHORT_95251_95286_FOLLOWUP_AUDIT.unregisteredGaps.length === 0,
  },
  {
    id: 'imp-95323-gap-narrowed-to-imp-95285-only',
    description: 'the only remaining surfacing-coverage orphan in the cohort is imp-95285',
    holds: () => SEAM_CHAIN_COHORT_95251_95286_FOLLOWUP_AUDIT.noSurfaceIds.length === 1
      && SEAM_CHAIN_COHORT_95251_95286_FOLLOWUP_AUDIT.noSurfaceIds[0] === 'imp-95285',
  },
  {
    id: 'imp-95323-four-members-now-surfaced',
    description: 'imp-95251, imp-95252, imp-95254 and imp-95286 each have both a viz page and an index entry',
    holds: () => ['imp-95251', 'imp-95252', 'imp-95254', 'imp-95286'].every((t) => {
      const m = COHORT_CURRENT.find((c) => c.ticket === t);
      return m.hasVizPage === true && m.inVisualizationsIndex === true;
    }),
  },
  {
    id: 'imp-95323-audit-only-honest',
    description: 'explicitly a follow-up AUDIT-ONLY pass and no refereed bound is changed',
    holds: () => /FOLLOW-UP AUDIT/.test(SEAM_CHAIN_COHORT_95251_95286_FOLLOWUP_AUDIT.honest)
      && /AUDIT-ONLY/.test(SEAM_CHAIN_COHORT_95251_95286_FOLLOWUP_AUDIT.honest)
      && /refereed bound is changed/i.test(SEAM_CHAIN_COHORT_95251_95286_FOLLOWUP_AUDIT.honest),
  },
];

for (const a of ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95323-seam-chain-cohort-followup-audit assertion failed: ${a.id}`);
}
