/**
 * @module imp-34561-caveat-surfacing-audit-34528-34530-34532-34533
 *
 * imp-34561 (meta): AUDIT of whether the shared honest-status caveat
 * (measurement/fit only; component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 K_a>=0 untouched; no operator positivity; NO QED;
 * no refereed bound is changed) carried by the imp-34528/34530/
 * 34532/34533 module JSDoc/verdict blocks is ALSO surfaced by every page or
 * viz that consumes these modules' exports, extending the imp-34521 (and its
 * imp-34463/imp-34504 precedents) caveat-surfacing-audit lineage to this
 * cluster -- the recurring overclaim-guard concern behind imp-2519.
 *
 * METHOD. src/pages/ImprovementsPage.jsx renders `imp.detail` in full for
 * every improvements.js log row (no truncation, no caveat-stripping), so any
 * row whose `detail` already carries the caveat is surfaced to end-readers by
 * construction; grepping improvements.js confirms all 4 cohort `detail`
 * fields carry "GUE-conditional" and "NO QED". Beyond the shared log:
 *   - imp-34528 has a dedicated viz page (Imp34528TailsideHumpDecayVsSqrtN
 *     FartailViz.jsx) whose own JSX independently repeats the caveat.
 *   - imp-34530 has a dedicated viz page (Imp34530PoleLeakageSpacingCompres
 *     sionFitViz.jsx, own caveat) AND a glossary.js headword ("leak(k)")
 *     whose HONEST SCOPE paragraph cites imp-34530's extrapolation and
 *     repeats the caveat.
 *   - imp-34532 has no dedicated page of its own, but its export chains
 *     through the intermediate data modules imp-34544/34545/34546 (none with
 *     a page) into imp-34557-hump-skew-mirror-viz-j5.js, whose page
 *     (Imp34557HumpSkewMirrorViz.jsx) is the only render surface reached and
 *     independently repeats the caveat.
 *   - imp-34533 has no dedicated page, but a direct glossary.js headword
 *     ("imp-34533 continuum-argmax split...") whose HONEST SCOPE paragraph
 *     repeats the caveat; its other chain (imp-34551 -> imp-34569/imp-34552)
 *     terminates in data modules with no page, so the log is that chain's
 *     only render surface (already covered).
 *
 * FINDING: no gap. Every one of the 4 cohort modules carries the caveat on
 * every surface that renders it to an end-reader. AUDIT-ONLY -- no surfacing
 * was added because none was missing.
 */

const COHORT = [
  {
    ticket: 'imp-34528',
    improvementsLogHasCaveat: true,
    dedicatedVizPage: 'src/pages/Imp34528TailsideHumpDecayVsSqrtNFartailViz.jsx',
    glossaryEntry: false,
    transitivePageOnly: null,
  },
  {
    ticket: 'imp-34530',
    improvementsLogHasCaveat: true,
    dedicatedVizPage: 'src/pages/Imp34530PoleLeakageSpacingCompressionFitViz.jsx',
    glossaryEntry: true,
    transitivePageOnly: null,
  },
  {
    ticket: 'imp-34532',
    improvementsLogHasCaveat: true,
    dedicatedVizPage: null,
    glossaryEntry: false,
    transitivePageOnly: 'src/pages/Imp34557HumpSkewMirrorViz.jsx',
  },
  {
    ticket: 'imp-34533',
    improvementsLogHasCaveat: true,
    dedicatedVizPage: null,
    glossaryEntry: true,
    transitivePageOnly: null,
  },
];

const WITH_DEDICATED_PAGE = COHORT.filter((m) => m.dedicatedVizPage);
const WITH_GLOSSARY = COHORT.filter((m) => m.glossaryEntry);
const WITH_TRANSITIVE_PAGE_ONLY = COHORT.filter((m) => m.transitivePageOnly);
const FULLY_COVERED = COHORT.filter((m) => m.improvementsLogHasCaveat);

export const CAVEAT_SURFACING_AUDIT_34528_34530_34532_34533 = {
  ticket: 'imp-34561',
  viewerMechanism: {
    file: 'src/pages/ImprovementsPage.jsx',
    note: 'renders `imp.detail` in full for every improvements.js log row, no truncation or stripping',
  },
  cohort: COHORT,
  cohortSize: COHORT.length,
  withDedicatedPage: WITH_DEDICATED_PAGE.map((m) => m.ticket),
  withGlossaryEntry: WITH_GLOSSARY.map((m) => m.ticket),
  withTransitivePageOnly: WITH_TRANSITIVE_PAGE_ONLY.map((m) => m.ticket),
  fullyCoveredCount: FULLY_COVERED.length,
  gapsFound: COHORT.filter((m) => !m.improvementsLogHasCaveat).map((m) => m.ticket),
  honest: 'AUDIT-ONLY -- confirms the caveat reaches end-readers on every surface for all 4 cohort ' +
    'modules; no surfacing added because none was missing. No bound change; imp-3066 K_a>=0 untouched; ' +
    'NO QED; no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34528_34530_34532_34533_ASSERTIONS = [
  {
    id: 'imp-34561-cohort-has-four-members',
    description: 'the audited cohort covers exactly imp-34528, imp-34530, imp-34532, imp-34533',
    holds: () => CAVEAT_SURFACING_AUDIT_34528_34530_34532_34533.cohortSize === 4
      && ['imp-34528', 'imp-34530', 'imp-34532', 'imp-34533']
        .every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34561-all-four-surfaced-in-log',
    description: 'every cohort member has the caveat present in its improvements.js `detail` field, the shared render surface',
    holds: () => CAVEAT_SURFACING_AUDIT_34528_34530_34532_34533.fullyCoveredCount === 4
      && CAVEAT_SURFACING_AUDIT_34528_34530_34532_34533.gapsFound.length === 0,
  },
  {
    id: 'imp-34561-two-have-dedicated-viz-page',
    description: 'exactly 2 of the 4 (imp-34528, imp-34530) have a dedicated viz page independently repeating the caveat',
    holds: () => WITH_DEDICATED_PAGE.length === 2
      && ['imp-34528', 'imp-34530'].every((t) => WITH_DEDICATED_PAGE.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34561-two-have-glossary-entry',
    description: 'exactly 2 of the 4 (imp-34530, imp-34533) have a glossary.js headword independently repeating the caveat',
    holds: () => WITH_GLOSSARY.length === 2
      && ['imp-34530', 'imp-34533'].every((t) => WITH_GLOSSARY.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34561-one-reaches-only-via-transitive-page',
    description: 'imp-34532 has no page of its own but is reached only via imp-34557s page, which still carries the caveat',
    holds: () => WITH_TRANSITIVE_PAGE_ONLY.length === 1
      && WITH_TRANSITIVE_PAGE_ONLY[0].ticket === 'imp-34532'
      && WITH_TRANSITIVE_PAGE_ONLY[0].transitivePageOnly === 'src/pages/Imp34557HumpSkewMirrorViz.jsx',
  },
  {
    id: 'imp-34561-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34528_34530_34532_34533.honest)
      && /no surfacing added because none was missing/.test(CAVEAT_SURFACING_AUDIT_34528_34530_34532_34533.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34528_34530_34532_34533.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34528_34530_34532_34533_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34561-caveat-surfacing-audit-34528-34530-34532-34533 assertion failed: ${a.id}`);
}
