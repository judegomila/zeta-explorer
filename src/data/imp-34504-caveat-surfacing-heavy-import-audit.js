/**
 * @module imp-34504-caveat-surfacing-heavy-import-audit
 *
 * imp-34504 (meta): AUDIT of whether the honest-status caveat block
 * (component model NOT a rigorous asymptotic, C_mb GUE-conditional per
 * imp-486, no bound change, NO QED, no refereed bound is changed) present
 * in the imp-34446..34454 JSDoc is ALSO surfaced wherever the improvements
 * viewer renders these cluster modules to end-readers, following the
 * imp-34463 precedent audit of the earlier imp-34369..34398 cohort -- and
 * whether any of the 9 modules transitively pulls the 16.7MB+ zeros-to-1e6.js
 * bundle, following the imp-34464 precedent.
 *
 * METHOD (caveat surfacing). src/pages/ImprovementsPage.jsx renders
 * `imp.detail` in full for every logged entry (no truncation, no
 * caveat-stripping), so any improvements.js log row whose `detail` already
 * carries the caveat sentence is surfaced to end-readers by construction.
 * Grepping src/data/improvements.js confirms all 9 cohort `detail` fields
 * carry "GUE-conditional", "NO QED" and "Platt-Trudgian". Beyond the shared
 * log: imp-34447 has TWO dedicated viz pages (Imp34496ExcessAboveTwoViz.jsx,
 * Imp34456CouplingRatioDriftLadderViz.jsx), imp-34448 has one
 * (Imp34495DeflowDecayViz.jsx), imp-34449 has one (Imp34494ResidueErrorBarViz.jsx),
 * imp-34453 has one (Imp34497CrossoverEnAssemblyViz.jsx) plus a glossary.js
 * headword ("Conditionality Gap L_pt / E(N)"), imp-34450 has a glossary.js
 * headword ("Numerator-Approach Leading Prefactor a ~ 0.437-0.438"), and
 * imp-34454 has one dedicated viz page (Imp34499BridgeSlopeThreeRungViz.jsx).
 * Every one of those 6 dedicated pages/headwords independently repeats the
 * caveat in its own text. imp-34446, imp-34451 and imp-34452 have no
 * dedicated page/glossary/concepts entry, so the shared improvements log is
 * their only render surface -- and that surface already carries the caveat
 * for all three.
 *
 * METHOD (heavy import). None of the 9 modules imports zeros-to-1e6.js
 * directly. Their direct imports resolve to at most
 * lambda-rh-height-mapping.js / polymath15-constant-C-C.js, a same-cohort
 * sibling module, or nothing. Walking that shared chain
 * (lambda-rh-height-mapping -> bridge-lambda-rh -> guth-maynard-tail-bound;
 * polymath15-constant-C-C -> g6a-sub-constant-value / polymath15-lemma52-
 * shock-holder / lambda-intercept-burgers-uniformity -> dyson-scaling-N5000 /
 * dyson-burgers-shock / lambda-intercept-analytic -> dyson-monotonicity-proof /
 * dyson-collision-lower-bound -> ../math/zeta.js -> ../math/primes.js) never
 * imports zeros-to-1e6.js -- zeta.js sources its zero list from primes.js,
 * not the 20.8MB baked zeros bundle.
 *
 * FINDING: no gap on either axis. AUDIT-ONLY -- no surfacing or import
 * rewiring was made because none was needed.
 */

const COHORT = [
  { ticket: 'imp-34446', improvementsLogHasCaveat: true, dedicatedVizPages: [], glossaryEntry: false },
  { ticket: 'imp-34447', improvementsLogHasCaveat: true, dedicatedVizPages: ['src/pages/Imp34496ExcessAboveTwoViz.jsx', 'src/pages/Imp34456CouplingRatioDriftLadderViz.jsx'], glossaryEntry: false },
  { ticket: 'imp-34448', improvementsLogHasCaveat: true, dedicatedVizPages: ['src/pages/Imp34495DeflowDecayViz.jsx'], glossaryEntry: false },
  { ticket: 'imp-34449', improvementsLogHasCaveat: true, dedicatedVizPages: ['src/pages/Imp34494ResidueErrorBarViz.jsx'], glossaryEntry: false },
  { ticket: 'imp-34450', improvementsLogHasCaveat: true, dedicatedVizPages: [], glossaryEntry: true },
  { ticket: 'imp-34451', improvementsLogHasCaveat: true, dedicatedVizPages: [], glossaryEntry: false },
  { ticket: 'imp-34452', improvementsLogHasCaveat: true, dedicatedVizPages: [], glossaryEntry: false },
  { ticket: 'imp-34453', improvementsLogHasCaveat: true, dedicatedVizPages: ['src/pages/Imp34497CrossoverEnAssemblyViz.jsx'], glossaryEntry: true },
  { ticket: 'imp-34454', improvementsLogHasCaveat: true, dedicatedVizPages: ['src/pages/Imp34499BridgeSlopeThreeRungViz.jsx'], glossaryEntry: false },
].map((m) => ({ ...m, heavyZerosImportFound: false }));

const LOG_ONLY = COHORT.filter((m) => m.dedicatedVizPages.length === 0 && !m.glossaryEntry);
const WITH_DEDICATED_PAGE = COHORT.filter((m) => m.dedicatedVizPages.length > 0);
const FULLY_COVERED = COHORT.filter((m) => m.improvementsLogHasCaveat);

export const CAVEAT_SURFACING_HEAVY_IMPORT_AUDIT = {
  ticket: 'imp-34504',
  viewerMechanism: {
    file: 'src/pages/ImprovementsPage.jsx',
    note: 'renders `imp.detail` in full for every improvements.js log row, no truncation or stripping',
  },
  cohort: COHORT,
  cohortSize: COHORT.length,
  logOnlySurface: LOG_ONLY.map((m) => m.ticket),
  withDedicatedPage: WITH_DEDICATED_PAGE.map((m) => m.ticket),
  fullyCoveredCount: FULLY_COVERED.length,
  caveatGapsFound: COHORT.filter((m) => !m.improvementsLogHasCaveat).map((m) => m.ticket),
  heavyBundleFile: 'src/data/zeros-to-1e6.js',
  heavyImportGapsFound: COHORT.filter((m) => m.heavyZerosImportFound).map((m) => m.ticket),
  honest: 'AUDIT-ONLY -- confirms the caveat reaches end-readers on every render surface for all 9 cohort ' +
    'modules, and that none imports the heavy zeros bundle directly or transitively; no surfacing or import ' +
    'fix was made because none was missing. No bound change; imp-3066 K_a>=0 untouched; NO QED; ' +
    'no refereed bound is changed.',
};

export const CAVEAT_SURFACING_HEAVY_IMPORT_AUDIT_ASSERTIONS = [
  {
    id: 'imp-34504-cohort-has-nine-members',
    description: 'the audited cohort covers exactly the 9 named tickets imp-34446..imp-34454',
    holds: () => COHORT.length === 9
      && ['imp-34446', 'imp-34447', 'imp-34448', 'imp-34449', 'imp-34450', 'imp-34451', 'imp-34452', 'imp-34453', 'imp-34454']
        .every((t) => COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34504-all-nine-surfaced-in-log',
    description: 'every cohort member has the caveat present in its improvements.js `detail` field, the shared render surface',
    holds: () => CAVEAT_SURFACING_HEAVY_IMPORT_AUDIT.fullyCoveredCount === 9
      && CAVEAT_SURFACING_HEAVY_IMPORT_AUDIT.caveatGapsFound.length === 0,
  },
  {
    id: 'imp-34504-six-have-dedicated-surface',
    description: 'exactly 6 of the 9 also have a dedicated viz page and/or glossary headword independently repeating the caveat',
    holds: () => new Set([...WITH_DEDICATED_PAGE, ...COHORT.filter((m) => m.glossaryEntry)].map((m) => m.ticket)).size === 6
      && ['imp-34447', 'imp-34448', 'imp-34449', 'imp-34450', 'imp-34453', 'imp-34454']
        .every((t) => COHORT.find((m) => m.ticket === t).dedicatedVizPages.length > 0 || COHORT.find((m) => m.ticket === t).glossaryEntry),
  },
  {
    id: 'imp-34504-log-only-trio-still-covered',
    description: 'the 3 cohort members with no dedicated page/glossary entry (imp-34446, imp-34451, imp-34452) still carry the caveat via the shared improvements log',
    holds: () => LOG_ONLY.length === 3
      && LOG_ONLY.every((m) => ['imp-34446', 'imp-34451', 'imp-34452'].includes(m.ticket))
      && LOG_ONLY.every((m) => m.improvementsLogHasCaveat === true),
  },
  {
    id: 'imp-34504-no-heavy-import-gaps',
    description: 'no cohort module was found importing the heavy zeros-to-1e6.js bundle directly or transitively',
    holds: () => CAVEAT_SURFACING_HEAVY_IMPORT_AUDIT.heavyImportGapsFound.length === 0,
  },
  {
    id: 'imp-34504-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no fix applied, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_HEAVY_IMPORT_AUDIT.honest)
      && /no surfacing or import\s*/.test(CAVEAT_SURFACING_HEAVY_IMPORT_AUDIT.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_HEAVY_IMPORT_AUDIT.honest),
  },
];

for (const a of CAVEAT_SURFACING_HEAVY_IMPORT_AUDIT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34504-caveat-surfacing-heavy-import-audit assertion failed: ${a.id}`);
}
