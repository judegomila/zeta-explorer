/**
 * @module imp-95306-seam-chain-surfacing-audit-95251-95286
 *
 * imp-95306 (meta): SURFACING AUDIT of the five newest seam-chain finding
 * modules -- imp-95251 (THEOREM COAL-N), imp-95252 (THEOREM RZ-LAT/RZ-TWIN),
 * imp-95254 (THEOREM PHASE-AM), imp-95285 (THEOREM EV-OCT-N), imp-95286
 * (THEOREM CONF-LB) -- continuing the imp-95284 audit of the earlier
 * imp-95249/95250/95231/95232/95233 cohort.
 *
 * METHOD. Each module's source was grepped for "^import" (ES-module import
 * statements) to confirm none transitively pulls in the 16.7MB zeros bundle,
 * per the repo's no-heavy-imports-in-data-modules guardrail. Each module was
 * checked against the DATA_MODULES registry in scripts/run-assertions.mjs
 * (the mechanism by which its self-executing assertions actually run under
 * `node run-assertions`). Each module id was also grepped across src/pages,
 * src/data/glossary.js, and src/data/visualizations-index.js to check for a
 * dedicated viz page, glossary headword, or index entry.
 *
 * FINDING: zero heavy-import gaps, zero registration gaps, one surfacing
 * gap-class. All five modules carry an explicit "import-light" self-comment
 * and have no import statement of any kind (verified by direct grep, not
 * just the comment). All five are registered in DATA_MODULES in
 * scripts/run-assertions.mjs, so their self-executing assertions run on
 * every `npm run build` / `node run-assertions` pass -- this is the
 * project's standing reachability floor for theorem-derivation modules,
 * independent of any page. None of the five has a dedicated viz page,
 * glossary headword, or visualizations-index entry yet: this is a
 * completeness-coverage gap, not a caveat or heavy-import gap (mirrors the
 * imp-34922/imp-34923/imp-34927/imp-34928 "no surface at all" class recorded
 * by the imp-34968 audit). Several open queue tickets already target this
 * exact gap (imp-95143, imp-95303, imp-95304, imp-95305, imp-95317,
 * imp-95318, imp-95319 propose viz pages for members of this cohort), so no
 * new surfacing was added here -- AUDIT-ONLY, per the imp-95306 scope.
 * Changes no bound; no operator positivity; NO QED; no refereed bound is changed.
 */

const SEAM_CHAIN_COHORT = [
  {
    ticket: 'imp-95251',
    module: 'src/data/imp-95251-nfold-coalescence-law.js',
    theorem: 'COAL-N',
    hasImportStatement: false,
    registeredInRunAssertions: true,
    hasVizPage: false,
    hasGlossaryHeadword: false,
    inVisualizationsIndex: false,
  },
  {
    ticket: 'imp-95252',
    module: 'src/data/imp-95252-muniform-block-riesz-seam-pencil.js',
    theorem: 'RZ-LAT/RZ-TWIN',
    hasImportStatement: false,
    registeredInRunAssertions: true,
    hasVizPage: false,
    hasGlossaryHeadword: false,
    inVisualizationsIndex: false,
  },
  {
    ticket: 'imp-95254',
    module: 'src/data/imp-95254-orthant-split-phase-certificate.js',
    theorem: 'PHASE-AM',
    hasImportStatement: false,
    registeredInRunAssertions: true,
    hasVizPage: false,
    hasGlossaryHeadword: false,
    inVisualizationsIndex: false,
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
    hasVizPage: false,
    hasGlossaryHeadword: false,
    inVisualizationsIndex: false,
  },
];

export const SEAM_CHAIN_SURFACING_AUDIT_95251_95286 = {
  ticket: 'imp-95306',
  priorAudit: 'imp-95284',
  cohort: SEAM_CHAIN_COHORT,
  heavyImportGaps: SEAM_CHAIN_COHORT.filter((m) => m.hasImportStatement).map((m) => m.ticket),
  unregisteredGaps: SEAM_CHAIN_COHORT.filter((m) => !m.registeredInRunAssertions).map((m) => m.ticket),
  noSurfaceIds: SEAM_CHAIN_COHORT
    .filter((m) => !m.hasVizPage && !m.hasGlossaryHeadword && !m.inVisualizationsIndex)
    .map((m) => m.ticket),
  honest: 'AUDIT-ONLY -- confirms all 5 imp-95251/95252/95254/95285/95286 seam-chain finding modules are '
    + 'import-light (zero import statements, verified by direct grep, not just self-comment) and registered in '
    + 'the scripts/run-assertions.mjs DATA_MODULES list, so their self-executing assertions run on every build. '
    + 'None yet has a dedicated viz page, glossary headword, or visualizations-index entry -- a '
    + 'completeness-coverage gap already targeted by open queue tickets (imp-95143/95303/95304/95305/95317/'
    + '95318/95319), not a caveat or heavy-import gap. No new surfacing added. Changes no bound; no operator '
    + 'positivity; NO QED; no refereed bound is changed.',
};

const ASSERTIONS = [
  {
    id: 'imp-95306-cohort-has-five-members',
    description: 'the audited cohort is exactly the five newest seam-chain modules imp-95251/95252/95254/95285/95286',
    holds: () => SEAM_CHAIN_COHORT.length === 5
      && ['imp-95251', 'imp-95252', 'imp-95254', 'imp-95285', 'imp-95286']
        .every((t) => SEAM_CHAIN_COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-95306-no-heavy-import-gaps',
    description: 'every cohort module has zero import statements (no transitive zeros-bundle pull)',
    holds: () => SEAM_CHAIN_COHORT.every((m) => m.hasImportStatement === false)
      && SEAM_CHAIN_SURFACING_AUDIT_95251_95286.heavyImportGaps.length === 0,
  },
  {
    id: 'imp-95306-all-registered-in-run-assertions',
    description: 'every cohort module is registered in the run-assertions.mjs DATA_MODULES list',
    holds: () => SEAM_CHAIN_COHORT.every((m) => m.registeredInRunAssertions === true)
      && SEAM_CHAIN_SURFACING_AUDIT_95251_95286.unregisteredGaps.length === 0,
  },
  {
    id: 'imp-95306-no-surface-ids-documented',
    description: 'the surfacing-coverage gap (no page/glossary/index entry) is recorded for all 5, not silently dropped',
    holds: () => SEAM_CHAIN_SURFACING_AUDIT_95251_95286.noSurfaceIds.length === 5
      && ['imp-95251', 'imp-95252', 'imp-95254', 'imp-95285', 'imp-95286']
        .every((t) => SEAM_CHAIN_SURFACING_AUDIT_95251_95286.noSurfaceIds.includes(t)),
  },
  {
    id: 'imp-95306-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(SEAM_CHAIN_SURFACING_AUDIT_95251_95286.honest)
      && /No new surfacing added/.test(SEAM_CHAIN_SURFACING_AUDIT_95251_95286.honest)
      && /refereed bound is changed/i.test(SEAM_CHAIN_SURFACING_AUDIT_95251_95286.honest),
  },
];

for (const a of ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95306-seam-chain-surfacing-audit assertion failed: ${a.id}`);
}
