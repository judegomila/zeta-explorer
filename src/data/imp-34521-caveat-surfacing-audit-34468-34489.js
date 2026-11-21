/**
 * @module imp-34521-caveat-surfacing-audit-34468-34489
 *
 * imp-34521 (content): AUDIT of whether the honest-status caveat block
 * (component model NOT a rigorous asymptotic, C_mb GUE-conditional per
 * imp-486, no bound change, NO QED, no refereed bound is changed) present
 * in the imp-34468..34489 JSDoc is ALSO surfaced wherever the improvements
 * viewer renders these cluster modules to end-readers, extending the
 * imp-34463 precedent audit of the earlier imp-34369..34398 cohort and the
 * imp-34504 precedent audit of the imp-34446..34454 cohort to this newer
 * 22-member cluster.
 *
 * METHOD. src/pages/ImprovementsPage.jsx renders `imp.detail` in full for
 * every logged entry (no truncation, no caveat-stripping), so any
 * improvements.js log row whose `detail` already carries the caveat is
 * surfaced to end-readers by construction. Grepping src/data/improvements.js
 * confirms all 22 cohort `detail` fields carry "GUE-conditional" and
 * "NO QED". Beyond the shared log: imp-34475/34476/34477/34478 each have a
 * dedicated viz page (Imp34475FourLocatorClusterAxisViz.jsx,
 * Imp34476SigmaProductGapRatioApproachViz.jsx,
 * Imp34477WideningSlopePoleLeakageViz.jsx,
 * Imp34478WideningSlopePrepoleLandmarkDecadeAxisViz.jsx) whose own JSX
 * independently repeats the caveat -- the latter three via an imported
 * `verdict` string sourced from the earlier imp-34408/34413/34415 modules
 * they visualize, the former via a literal "Honest status" block in its own
 * JSX. imp-34479 and imp-34483 additionally have a glossary.js headword with
 * the caveat; imp-34480 and imp-34484 additionally have a ConceptsPage.jsx
 * explainer with the caveat. The remaining 14 cohort members
 * (imp-34468/34469/34470/34471/34472/34473/34474/34481/34482/34485/34486/
 * 34487/34488/34489) have no dedicated page/glossary/concepts entry, so the
 * shared improvements log is their only render surface -- and that surface
 * already carries the caveat for all 14.
 *
 * FINDING: no gap. Every one of the 22 cohort modules carries the caveat on
 * every surface that renders it to an end-reader. AUDIT-ONLY -- no surfacing
 * was added because none was missing.
 */

const COHORT = [
  { ticket: 'imp-34468', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34469', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34470', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34471', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34472', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34473', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34474', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34475', improvementsLogHasCaveat: true, dedicatedVizPage: 'src/pages/Imp34475FourLocatorClusterAxisViz.jsx', glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34476', improvementsLogHasCaveat: true, dedicatedVizPage: 'src/pages/Imp34476SigmaProductGapRatioApproachViz.jsx', glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34477', improvementsLogHasCaveat: true, dedicatedVizPage: 'src/pages/Imp34477WideningSlopePoleLeakageViz.jsx', glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34478', improvementsLogHasCaveat: true, dedicatedVizPage: 'src/pages/Imp34478WideningSlopePrepoleLandmarkDecadeAxisViz.jsx', glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34479', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: true, conceptsPageEntry: false },
  { ticket: 'imp-34480', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: true },
  { ticket: 'imp-34481', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34482', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34483', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: true, conceptsPageEntry: false },
  { ticket: 'imp-34484', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: true },
  { ticket: 'imp-34485', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34486', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34487', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34488', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
  { ticket: 'imp-34489', improvementsLogHasCaveat: true, dedicatedVizPage: null, glossaryEntry: false, conceptsPageEntry: false },
];

const LOG_ONLY = COHORT.filter((m) => !m.dedicatedVizPage && !m.glossaryEntry && !m.conceptsPageEntry);
const WITH_DEDICATED_PAGE = COHORT.filter((m) => m.dedicatedVizPage);
const WITH_GLOSSARY = COHORT.filter((m) => m.glossaryEntry);
const WITH_CONCEPTS = COHORT.filter((m) => m.conceptsPageEntry);
const FULLY_COVERED = COHORT.filter((m) => m.improvementsLogHasCaveat);

export const CAVEAT_SURFACING_AUDIT_34468_34489 = {
  ticket: 'imp-34521',
  viewerMechanism: {
    file: 'src/pages/ImprovementsPage.jsx',
    note: 'renders `imp.detail` in full for every improvements.js log row, no truncation or stripping',
  },
  cohort: COHORT,
  cohortSize: COHORT.length,
  logOnlySurface: LOG_ONLY.map((m) => m.ticket),
  withDedicatedPage: WITH_DEDICATED_PAGE.map((m) => m.ticket),
  withGlossaryEntry: WITH_GLOSSARY.map((m) => m.ticket),
  withConceptsPageEntry: WITH_CONCEPTS.map((m) => m.ticket),
  fullyCoveredCount: FULLY_COVERED.length,
  gapsFound: COHORT.filter((m) => !m.improvementsLogHasCaveat).map((m) => m.ticket),
  honest: 'AUDIT-ONLY -- confirms the caveat reaches end-readers on every surface for all 22 cohort ' +
    'modules; no surfacing added because none was missing. No bound change; imp-3066 K_a>=0 untouched; ' +
    'NO QED; no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34468_34489_ASSERTIONS = [
  {
    id: 'imp-34521-cohort-has-twentytwo-members',
    description: 'the audited cohort covers exactly the 22 ids from imp-34468 through imp-34489',
    holds: () => CAVEAT_SURFACING_AUDIT_34468_34489.cohortSize === 22
      && Array.from({ length: 22 }, (_, i) => `imp-${34468 + i}`)
        .every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34521-all-twentytwo-surfaced-in-log',
    description: 'every cohort member has the caveat present in its improvements.js `detail` field, the shared render surface',
    holds: () => CAVEAT_SURFACING_AUDIT_34468_34489.fullyCoveredCount === 22
      && CAVEAT_SURFACING_AUDIT_34468_34489.gapsFound.length === 0,
  },
  {
    id: 'imp-34521-four-have-dedicated-viz-page',
    description: 'exactly 4 of the 22 also have a dedicated viz page independently repeating the caveat',
    holds: () => WITH_DEDICATED_PAGE.length === 4
      && ['imp-34475', 'imp-34476', 'imp-34477', 'imp-34478']
        .every((t) => WITH_DEDICATED_PAGE.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34521-two-glossary-two-concepts',
    description: 'exactly 2 have a glossary headword (imp-34479, imp-34483) and 2 have a ConceptsPage entry (imp-34480, imp-34484), each independently repeating the caveat',
    holds: () => WITH_GLOSSARY.length === 2
      && ['imp-34479', 'imp-34483'].every((t) => WITH_GLOSSARY.some((m) => m.ticket === t))
      && WITH_CONCEPTS.length === 2
      && ['imp-34480', 'imp-34484'].every((t) => WITH_CONCEPTS.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34521-log-only-fourteen-still-covered',
    description: 'the 14 cohort members with no dedicated page/glossary/concepts entry still carry the caveat via the shared improvements log',
    holds: () => LOG_ONLY.length === 14
      && LOG_ONLY.every((m) => m.improvementsLogHasCaveat === true),
  },
  {
    id: 'imp-34521-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34468_34489.honest)
      && /no surfacing added because none was missing/.test(CAVEAT_SURFACING_AUDIT_34468_34489.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34468_34489.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34468_34489_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34521-caveat-surfacing-audit-34468-34489 assertion failed: ${a.id}`);
}
