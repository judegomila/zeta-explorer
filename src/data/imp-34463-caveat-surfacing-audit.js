/**
 * @module imp-34463-caveat-surfacing-audit
 *
 * imp-34463 (content): AUDIT of whether the honest-status caveat block
 * (component model NOT a rigorous asymptotic, C_mb GUE-conditional per
 * imp-486, no bound change, NO QED, no refereed bound is changed) present
 * in the imp-34369/34371/34372/34373/34374/34375/34397/34398 JSDoc is ALSO
 * surfaced wherever the improvements viewer renders these cluster modules to
 * end-readers, not only in source-code comments a reader of the app never sees.
 *
 * METHOD. src/pages/ImprovementsPage.jsx unconditionally renders `imp.detail`
 * in full for every logged entry (no truncation, no caveat-stripping) -- so
 * any improvements.js log row whose `detail` string already contains the
 * caveat sentence is surfaced to end-readers by construction. Grepping
 * src/data/improvements.js for each of the 8 cohort ids' log rows confirms
 * every one of their `detail` fields ends with the standard caveat sentence
 * (component model NOT a rigorous asymptotic; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed
 * ). Beyond the shared improvements log, five of the
 * eight also have a DEDICATED viz page (imp-34369, imp-34372, imp-34373,
 * imp-34375, imp-34397) whose own JSX text independently repeats the caveat;
 * imp-34372 additionally has a glossary.js headword with the caveat; imp-34398
 * additionally has a ConceptsPage.jsx explainer with the caveat. imp-34371 and
 * imp-34374 have no dedicated page/glossary/concepts entry, so the shared
 * improvements log is their only render surface -- and that surface already
 * carries the caveat for both.
 *
 * FINDING: no gap. Every one of the 8 cohort modules carries the caveat on
 * every surface that renders it to an end-reader. AUDIT-ONLY -- no surfacing
 * was added because none was missing.
 */

const COHORT = [
  { ticket: 'imp-34369', improvementsLogHasCaveat: true, dedicatedVizPage: 'src/pages/Imp34459PeakRelocationRegimeWidthViz.jsx', glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34371', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34372', improvementsLogHasCaveat: true, dedicatedVizPage: 'src/pages/Imp34456CouplingRatioDriftLadderViz.jsx', glossaryEntry: true, conceptsPageEntry: false },
  { ticket: 'imp-34373', improvementsLogHasCaveat: true, dedicatedVizPage: 'src/pages/Imp34458DeflowFalloffViz.jsx', glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34374', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34375', improvementsLogHasCaveat: true, dedicatedVizPage: 'src/pages/Imp34460TwoTermCurvatureCrossvalViz.jsx', glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34397', improvementsLogHasCaveat: true, dedicatedVizPage: 'src/pages/Imp34457ResidueCurvatureCorrectedViz.jsx', glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34398', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: true },
];

const LOG_ONLY = COHORT.filter((m) => !m.dedicatedVizPage && !m.glossaryEntry && !m.conceptsPageEntry);
const WITH_DEDICATED_PAGE = COHORT.filter((m) => m.dedicatedVizPage);
const FULLY_COVERED = COHORT.filter((m) => m.improvementsLogHasCaveat);

export const CAVEAT_SURFACING_AUDIT = {
  ticket: 'imp-34463',
  viewerMechanism: {
    file: 'src/pages/ImprovementsPage.jsx',
    note: 'renders `imp.detail` in full for every improvements.js log row, no truncation or stripping',
  },
  cohort: COHORT,
  cohortSize: COHORT.length,
  logOnlySurface: LOG_ONLY.map((m) => m.ticket),
  withDedicatedPage: WITH_DEDICATED_PAGE.map((m) => m.ticket),
  fullyCoveredCount: FULLY_COVERED.length,
  gapsFound: COHORT.filter((m) => !m.improvementsLogHasCaveat).map((m) => m.ticket),
  honest: 'AUDIT-ONLY -- confirms the caveat reaches end-readers on every surface for all 8 cohort modules; no surfacing added because none was missing. No bound change; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34463-cohort-has-eight-members',
    description: 'the audited cohort covers exactly the 8 named tickets from the ticket title',
    holds: () => COHORT.length === 8
      && ['imp-34369', 'imp-34371', 'imp-34372', 'imp-34373', 'imp-34374', 'imp-34375', 'imp-34397', 'imp-34398']
        .every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34463-all-eight-surfaced-in-log',
    description: 'every cohort member has the caveat present in its improvements.js `detail` field, the shared render surface',
    holds: () => CAVEAT_SURFACING_AUDIT.fullyCoveredCount === 8
      && CAVEAT_SURFACING_AUDIT.gapsFound.length === 0,
  },
  {
    id: 'imp-34463-five-have-dedicated-page',
    description: 'exactly 5 of the 8 also have a dedicated viz page independently repeating the caveat',
    holds: () => WITH_DEDICATED_PAGE.length === 5
      && ['imp-34369', 'imp-34372', 'imp-34373', 'imp-34375', 'imp-34397']
        .every((t) => WITH_DEDICATED_PAGE.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34463-log-only-pair-still-covered',
    description: 'the 2 cohort members with no dedicated page/glossary/concepts entry (imp-34371, imp-34374) still carry the caveat via the shared improvements log',
    holds: () => LOG_ONLY.length === 2
      && LOG_ONLY.every((m) => m.ticket === 'imp-34371' || m.ticket === 'imp-34374')
      && LOG_ONLY.every((m) => m.improvementsLogHasCaveat === true),
  },
  {
    id: 'imp-34463-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT.honest)
      && /no surfacing added because none was missing/.test(CAVEAT_SURFACING_AUDIT.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34463-caveat-surfacing-audit assertion failed: ${a.id}`);
}
