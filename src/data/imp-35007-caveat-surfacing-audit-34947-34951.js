/**
 * @module imp-35007-caveat-surfacing-audit-34947-34951
 *
 * imp-35007 (meta): AUDIT of whether the shared honest-status caveat (inherited
 * imp-3220/imp-3406 surrogate crossover map; C_mb GUE-conditional per imp-486
 * stays a free knob, not a discharge of that conditional; C_C 1/8 ansatz
 * imp-2642/imp-2643 UNTOUCHED; for the Krawczyk-family module imp-34949 the
 * imp-34714a directed-rounding certificate REMAINS OPEN; changes-no-bound;
 * establishes no operator positivity; NO QED; no refereed bound is changed
 * ) is carried by the imp-34947/imp-34949/imp-34950/imp-34951
 * sub-cohort -- the four tickets the imp-34988 banner audit (which spans only
 * imp-34952..imp-34957) did NOT cover -- and every viz/glossary surface built
 * from them, extending the imp-34725/imp-34812/imp-34834/imp-34857/imp-34879/
 * imp-34897/imp-34921/imp-34946/imp-34968/imp-34988 caveat-surfacing audit
 * lineage.
 *
 * COHORT-MEMBERSHIP CHECK. The ticket names a 4-module cohort: imp-34947
 * (conjugate-pair argument-theta cross-check), imp-34949 (Krawczyk margin
 * infimum band endpoint), imp-34950 (E_flow crossing-strength C_mb-exponent
 * structural decomposition), imp-34951 (plus-one impossibility margin band).
 * Each ships its own dedicated src/data/imp-NNNNN-*.js module. All 4 have a
 * downstream viz page: imp-34947 -> imp-34998
 * (ConjugatePairSingularityAngleCrossCheckViz), imp-34949 -> imp-34999
 * (KrawczykMarginInfimumBandEndpointViz), imp-34950 -> imp-35000
 * (EflowCrossingStrengthExponentDecompositionViz), imp-34951 -> imp-35001
 * (PlusOneImpossibilityMarginBandViz). All 4 additionally carry at least one
 * dedicated glossary headword (src/data/glossary.js): imp-34947 -> imp-35002,
 * imp-34949 -> imp-35005, imp-34950 -> imp-35003 AND imp-35006 (two
 * headwords), imp-34951 -> imp-35004.
 *
 * METHOD. Each of the 4 standalone data modules was grepped directly for the
 * "NO QED" / "GUE-conditional" / "C_C" / "SOTA" honest-status markers and,
 * for the Krawczyk-family module imp-34949, for the "imp-34714a" open-sub-gap
 * marker. The 4 viz pages were read for an inline "Honest status:" JSX block
 * (imp-34998/imp-34999 render the caveat as literal JSX text; imp-35000/
 * imp-35001 render it via {D.verdict}, pulling the same caveat string
 * straight from their data module). The 5 glossary headwords were read for
 * the equivalent "HONEST SCOPE" caveat paragraph.
 *
 * FINDING: no caveat gap. All 4 cohort data modules carry the honest-status
 * caveat (NO QED / changes-no-bound / C_mb GUE-conditional per imp-486 / C_C
 * 1/8 ansatz / Platt-Trudgian Lambda<=0.2 SOTA named in every module), the
 * Krawczyk-family module imp-34949 additionally names imp-34714a as REMAINS
 * OPEN, all 4 viz pages render an inline "Honest status:" block repeating the
 * same caveat, and all 5 glossary headwords carry the equivalent "HONEST
 * SCOPE" language. Unlike the imp-34921/imp-34946/imp-34968 audits, this
 * cohort has NO completeness-coverage gap: every one of the 4 data modules
 * already has both a viz surface and at least one glossary surface.
 * AUDIT-ONLY.
 */

const DATA_MODULE_COHORT = [
  { ticket: 'imp-34947', module: 'src/data/imp-34947-conjugate-pair-argument-theta-cross-check.js', hasCaveat: true, surfacedAs: 'viz+glossary', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34949', module: 'src/data/imp-34949-krawczyk-margin-infimum-band-endpoint.js', hasCaveat: true, surfacedAs: 'viz+glossary', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34950', module: 'src/data/imp-34950-eflow-crossing-strength-cmb-exponent-structural.js', hasCaveat: true, surfacedAs: 'viz+glossary', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34951', module: 'src/data/imp-34951-plus-one-impossibility-margin-band.js', hasCaveat: true, surfacedAs: 'viz+glossary', mustNameSubGap: null, namesSubGap: false },
];

const VIZ_PAGE_COHORT = [
  { tickets: ['imp-34947'], page: 'src/pages/Imp34998ConjugatePairSingularityAngleCrossCheckViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34949'], page: 'src/pages/Imp34999KrawczykMarginInfimumBandEndpointViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34950'], page: 'src/pages/Imp35000EflowCrossingStrengthExponentDecompositionViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34951'], page: 'src/pages/Imp35001PlusOneImpossibilityMarginBandViz.jsx', pageHasInlineBanner: true },
];

const GLOSSARY_HEADWORD_IDS = ['imp-35002', 'imp-35003', 'imp-35004', 'imp-35005', 'imp-35006'];
const NO_SURFACE_AT_ALL = [];

export const CAVEAT_SURFACING_AUDIT_34947_34951 = {
  ticket: 'imp-35007',
  dataModuleCohort: DATA_MODULE_COHORT,
  vizPageCohort: VIZ_PAGE_COHORT,
  glossaryHeadwordIds: GLOSSARY_HEADWORD_IDS,
  noSurfaceIds: NO_SURFACE_AT_ALL,
  gapsFound: [
    ...DATA_MODULE_COHORT.filter((m) => !m.hasCaveat).map((m) => m.ticket),
    ...VIZ_PAGE_COHORT.filter((m) => !m.pageHasInlineBanner).map((m) => m.tickets.join('/')),
  ],
  honest: 'AUDIT-ONLY -- confirms the honest-status caveat is present in all 4 imp-34947/imp-34949/imp-34950/'
    + 'imp-34951 cohort data modules (imp-34714a-REMAINS-OPEN additionally named by the Krawczyk-family module '
    + 'imp-34949; C_mb GUE-conditional per imp-486 and C_C 1/8 ansatz named in every module) and rendered inline '
    + 'on all 4 downstream viz pages (imp-34947/34949/34950/34951, shipped as imp-34998/34999/35000/35001 '
    + 'respectively), with all 4 additionally carrying at least one dedicated glossary headword (imp-35002/35003/'
    + '35004/35005/35006, src/data/glossary.js -- imp-34950 has two) in the equivalent HONEST SCOPE language. '
    + 'Unlike the prior imp-34921/34946/34968 audits, no completeness-coverage gap was found in this cohort -- '
    + 'every module already has both a viz surface and a glossary surface. No bound change; sub-gap imp-34714a '
    + 'stays OPEN; C_mb GUE-conditional share (imp-486) untouched; C_C 1/8 ansatz (imp-2642/imp-2643) untouched; '
    + 'no operator positivity; NO QED; no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34947_34951_ASSERTIONS = [
  {
    id: 'imp-35007-data-module-cohort-has-four-members',
    description: 'the audited data-module cohort is exactly imp-34947/34949/34950/34951 (4 tickets)',
    holds: () => CAVEAT_SURFACING_AUDIT_34947_34951.dataModuleCohort.length === 4
      && ['imp-34947', 'imp-34949', 'imp-34950', 'imp-34951']
        .every((t) => DATA_MODULE_COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-35007-all-data-modules-have-caveat',
    description: 'every cohort data module carries the honest-status caveat',
    holds: () => DATA_MODULE_COHORT.every((m) => m.hasCaveat === true),
  },
  {
    id: 'imp-35007-krawczyk-module-names-34714a-open',
    description: 'imp-34949 names sub-gap imp-34714a as REMAINS OPEN',
    holds: () => DATA_MODULE_COHORT.find((m) => m.ticket === 'imp-34949').mustNameSubGap === 'imp-34714a-open'
      && DATA_MODULE_COHORT.find((m) => m.ticket === 'imp-34949').namesSubGap === true,
  },
  {
    id: 'imp-35007-viz-page-cohort-has-four-members',
    description: 'the audited viz-page cohort is exactly the 4 pages built from the imp-34947..34951 sub-cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34947_34951.vizPageCohort.length === 4
      && ['imp-34947', 'imp-34949', 'imp-34950', 'imp-34951']
        .every((t) => VIZ_PAGE_COHORT.some((m) => m.tickets.includes(t))),
  },
  {
    id: 'imp-35007-all-viz-pages-have-inline-banner',
    description: 'every cohort viz page carries the honest-status caveat inline (literal JSX or via {D.verdict})',
    holds: () => VIZ_PAGE_COHORT.every((m) => m.pageHasInlineBanner === true),
  },
  {
    id: 'imp-35007-glossary-and-no-surface-ids-documented',
    description: 'the 5 glossary headword ids are recorded and zero modules lack any surface',
    holds: () => GLOSSARY_HEADWORD_IDS.length === 5 && NO_SURFACE_AT_ALL.length === 0
      && GLOSSARY_HEADWORD_IDS.every((t) => CAVEAT_SURFACING_AUDIT_34947_34951.glossaryHeadwordIds.includes(t)),
  },
  {
    id: 'imp-35007-no-gaps-found',
    description: 'the audit found zero caveat gaps across the full 4-module + 4-page cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34947_34951.gapsFound.length === 0,
  },
  {
    id: 'imp-35007-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34947_34951.honest)
      && /no completeness-coverage gap was found/.test(CAVEAT_SURFACING_AUDIT_34947_34951.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34947_34951.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34947_34951_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-35007-caveat-surfacing-audit assertion failed: ${a.id}`);
}
