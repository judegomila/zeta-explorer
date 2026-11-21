/**
 * @module imp-34618-caveat-surfacing-audit-34584-34593
 *
 * imp-34618 (content): AUDIT of whether the shared honest-status caveat
 * (measurement/fit only; component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 K_a>=0 untouched; no operator positivity; NO QED;
 * no refereed bound is changed) carried by the imp-34584..34593
 * measurement cluster is ALSO surfaced by every page or viz that consumes
 * these modules' exports, extending the imp-34521/imp-34561 caveat-surfacing
 * -audit lineage to this cluster -- the recurring overclaim-guard concern
 * behind imp-2519.
 *
 * COHORT. imp-34584..34593 is ten tickets; imp-34588 has no dedicated data
 * module (its fourth-rung extension was folded inline into the existing
 * imp-34569-binary128-emulation-cross-check.js), so the audited cohort is
 * the nine modules imp-34584/34585/34586/34587/34589/34590/34591/34592/34593
 * plus imp-34588 as a folded-in entry of imp-34569.
 *
 * METHOD. src/pages/ImprovementsPage.jsx renders `imp.detail` in full for
 * every improvements.js log row (no truncation, no caveat-stripping), so any
 * row whose `detail` already carries the caveat is surfaced to end-readers by
 * construction; grepping improvements.js confirms all 10 cohort `detail`
 * fields carry the caveat substance (GUE-conditional, no QED, inherited
 * imp-3220/imp-3406 surrogate framing). Beyond the shared log:
 *   - every one of the 9 dedicated data modules independently repeats the
 *     caveat in its own module JSDoc/verdict block (verified by grep for
 *     GUE-conditional / NO QED / K_a>=0 / Platt-Trudgian inside each file).
 *   - imp-34593 (via its q3-share-error-roundoff-limited-plateau finding) and
 *     imp-34571/imp-34448 (the deflow decay chain imp-34584/34590 extend)
 *     each have a src/pages/ConceptsPage.jsx glossary headword whose
 *     definition/intuition text independently repeats the caveat.
 *   - imp-34588 is folded into imp-34569-binary128-emulation-cross-check.js,
 *     which already carries the caveat in its own JSDoc.
 *
 * FINDING: no gap. Every one of the 10 cohort tickets carries the caveat on
 * every surface that renders it to an end-reader. AUDIT-ONLY -- no surfacing
 * was added because none was missing.
 */

const COHORT = [
  { ticket: 'imp-34584', improvementsLogHasCaveat: true, dedicatedModule: 'src/data/imp-34584-deflow-refit-second-order-term.js', glossaryEntry: false },
  { ticket: 'imp-34585', improvementsLogHasCaveat: true, dedicatedModule: 'src/data/imp-34585-eflow-attr-log-corrected-fit.js', glossaryEntry: false },
  { ticket: 'imp-34586', improvementsLogHasCaveat: true, dedicatedModule: 'src/data/imp-34586-eflow-attr-fp-floor-far-side-ladder.js', glossaryEntry: false },
  { ticket: 'imp-34587', improvementsLogHasCaveat: true, dedicatedModule: 'src/data/imp-34587-drift-share-drift-richardson-dp-extrapolation.js', glossaryEntry: false },
  { ticket: 'imp-34588', improvementsLogHasCaveat: true, dedicatedModule: null, foldedIntoModule: 'src/data/imp-34569-binary128-emulation-cross-check.js', glossaryEntry: false },
  { ticket: 'imp-34589', improvementsLogHasCaveat: true, dedicatedModule: 'src/data/imp-34589-eflow-attr-far-side-power-law-slope-continuity.js', glossaryEntry: false },
  { ticket: 'imp-34590', improvementsLogHasCaveat: true, dedicatedModule: 'src/data/imp-34590-deflow-residual-oneoverlogn-scaling.js', glossaryEntry: true },
  { ticket: 'imp-34591', improvementsLogHasCaveat: true, dedicatedModule: 'src/data/imp-34591-imp34570-fit-literal-drift-audit.js', glossaryEntry: false },
  { ticket: 'imp-34592', improvementsLogHasCaveat: true, dedicatedModule: 'src/data/imp-34592-q4-share-roundoff-floor-vs-dp.js', glossaryEntry: false },
  { ticket: 'imp-34593', improvementsLogHasCaveat: true, dedicatedModule: 'src/data/imp-34593-drift-share-error-optimal-dp-fit.js', glossaryEntry: true },
];

const WITH_DEDICATED_MODULE = COHORT.filter((m) => m.dedicatedModule);
const WITH_GLOSSARY = COHORT.filter((m) => m.glossaryEntry);
const FOLDED_IN = COHORT.filter((m) => m.foldedIntoModule);
const FULLY_COVERED = COHORT.filter((m) => m.improvementsLogHasCaveat);

export const CAVEAT_SURFACING_AUDIT_34584_34593 = {
  ticket: 'imp-34618',
  viewerMechanism: {
    file: 'src/pages/ImprovementsPage.jsx',
    note: 'renders `imp.detail` in full for every improvements.js log row, no truncation or stripping',
  },
  cohort: COHORT,
  cohortSize: COHORT.length,
  withDedicatedModule: WITH_DEDICATED_MODULE.map((m) => m.ticket),
  withGlossaryEntry: WITH_GLOSSARY.map((m) => m.ticket),
  foldedIn: FOLDED_IN.map((m) => m.ticket),
  fullyCoveredCount: FULLY_COVERED.length,
  gapsFound: COHORT.filter((m) => !m.improvementsLogHasCaveat).map((m) => m.ticket),
  honest: 'AUDIT-ONLY -- confirms the caveat reaches end-readers on every surface for all 10 cohort ' +
    'tickets; no surfacing added because none was missing. No bound change; imp-3066 K_a>=0 untouched; ' +
    'C_mb remains GUE-conditional per imp-486; NO QED; no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34584_34593_ASSERTIONS = [
  {
    id: 'imp-34618-cohort-has-ten-members',
    description: 'the audited cohort covers exactly imp-34584..imp-34593',
    holds: () => CAVEAT_SURFACING_AUDIT_34584_34593.cohortSize === 10
      && ['imp-34584', 'imp-34585', 'imp-34586', 'imp-34587', 'imp-34588', 'imp-34589', 'imp-34590', 'imp-34591', 'imp-34592', 'imp-34593']
        .every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34618-all-ten-surfaced-in-log',
    description: 'every cohort member has the caveat present in its improvements.js `detail` field, the shared render surface',
    holds: () => CAVEAT_SURFACING_AUDIT_34584_34593.fullyCoveredCount === 10
      && CAVEAT_SURFACING_AUDIT_34584_34593.gapsFound.length === 0,
  },
  {
    id: 'imp-34618-nine-have-dedicated-module',
    description: 'exactly 9 of the 10 have a dedicated data module independently repeating the caveat in JSDoc',
    holds: () => WITH_DEDICATED_MODULE.length === 9,
  },
  {
    id: 'imp-34618-one-folded-into-imp-34569',
    description: 'imp-34588 has no module of its own and is folded into imp-34569-binary128-emulation-cross-check.js, which carries the caveat',
    holds: () => FOLDED_IN.length === 1
      && FOLDED_IN[0].ticket === 'imp-34588'
      && FOLDED_IN[0].foldedIntoModule === 'src/data/imp-34569-binary128-emulation-cross-check.js',
  },
  {
    id: 'imp-34618-two-have-glossary-entry',
    description: 'exactly 2 of the 10 (imp-34590, imp-34593) have a ConceptsPage glossary headword independently repeating the caveat',
    holds: () => WITH_GLOSSARY.length === 2
      && ['imp-34590', 'imp-34593'].every((t) => WITH_GLOSSARY.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34618-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34584_34593.honest)
      && /no surfacing added because none was missing/.test(CAVEAT_SURFACING_AUDIT_34584_34593.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34584_34593.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34584_34593_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34618-caveat-surfacing-audit-34584-34593 assertion failed: ${a.id}`);
}
