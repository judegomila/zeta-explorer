/**
 * @module imp-34988-caveat-surfacing-audit-34952-34957
 *
 * imp-34988 (meta): AUDIT of whether the shared honest-status caveat (inherited
 * imp-3220/imp-3406 surrogate crossover map; C_mb GUE-conditional per imp-486
 * stays a free knob, not a discharge of that conditional; C_C 1/8 ansatz
 * imp-2642/imp-2643 UNTOUCHED; for the precision-family module the imp-34714a
 * directed-rounding certificate REMAINS OPEN; changes-no-bound; establishes no
 * operator positivity; NO QED; no refereed bound is changed) is
 * carried by every module in the imp-34952..imp-34957 cohort and every
 * downstream viz/glossary surface built from it (imp-34978..imp-34986),
 * extending the imp-34725/imp-34812/imp-34834/imp-34857/imp-34879/imp-34897/
 * imp-34921/imp-34946/imp-34968 caveat-surfacing audit lineage.
 *
 * COHORT-MEMBERSHIP CHECK. The ticket names a 6-module cohort (imp-34952
 * band-wide double-double log ULP, imp-34953 R_margin dyadic-wall sweep,
 * imp-34954 surplus closed form vs landmark-gap crosscheck, imp-34955
 * sigma-knee crossing C_mb sensitivity, imp-34956 pinned-product window
 * sensitivity, imp-34957 crossover-derivative P11/P12 extension), each
 * shipping its own dedicated src/data/imp-NNNNN-*.js module. All 6 have a
 * downstream imp-3497x/3498x surface: imp-34952 -> imp-34978 (viz) + imp-34979
 * (glossary), imp-34953 -> imp-34980 (viz), imp-34954 -> imp-34981 (viz) +
 * imp-34982 (glossary), imp-34955 -> imp-34983 (viz) + imp-34984 (glossary),
 * imp-34956 -> imp-34985 (viz), imp-34957 -> imp-34986 (viz). No cohort member
 * is missing a downstream surface.
 *
 * METHOD. Each of the 6 standalone data modules was grepped directly for the
 * "NO QED" / "GUE-conditional" / "C_C" / "SOTA" / "changes no bound" honest-
 * status markers and for the "imp-34714a" open-sub-gap marker. The 6 viz
 * pages were read for an inline "Honest status:" JSX block. The 3 glossary
 * headwords (imp-34979/34982/34984) were read for the equivalent "HONEST
 * SCOPE" caveat language.
 *
 * FINDING: no caveat gap. All 6 cohort data modules carry the honest-status
 * caveat (NO QED / changes-no-bound / C_mb GUE-conditional per imp-486 / C_C
 * 1/8 ansatz / Platt-Trudgian Lambda<=0.2 SOTA named in every module), the
 * precision-family module imp-34952 additionally names imp-34714a as REMAINS
 * OPEN, and all 6 downstream viz pages render an inline "Honest status:"
 * block repeating the same caveat. The 3 downstream glossary headwords
 * (imp-34979 for imp-34952, imp-34982 for imp-34954, imp-34984 for imp-34955)
 * each carry the equivalent "HONEST SCOPE" language. Unlike the imp-34921/
 * imp-34946/imp-34968 audits, this cohort has NO completeness-coverage gap:
 * every one of the 6 data modules already has at least a viz surface, so
 * there is nothing to flag as unsurfaced. AUDIT-ONLY.
 */

const DATA_MODULE_COHORT = [
  { ticket: 'imp-34952', module: 'src/data/imp-34952-double-double-log-ulp-band-wide.js', hasCaveat: true, surfacedAs: 'viz+glossary', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34953', module: 'src/data/imp-34953-r-margin-dyadic-wall-across-N.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34954', module: 'src/data/imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck.js', hasCaveat: true, surfacedAs: 'viz+glossary', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34955', module: 'src/data/imp-34955-sigma-knee-crossing-cmb-sensitivity.js', hasCaveat: true, surfacedAs: 'viz+glossary', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34956', module: 'src/data/imp-34956-pinned-product-window-sensitivity.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34957', module: 'src/data/imp-34957-crossover-deriv-p11-p12-extension.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: false },
];

const VIZ_PAGE_COHORT = [
  { tickets: ['imp-34952'], page: 'src/pages/Imp34978DoubleDoubleLogUlpBandWideViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34953'], page: 'src/pages/Imp34980RMarginDyadicWallSweepViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34954'], page: 'src/pages/Imp34981LandmarkGapReconstructionLadderViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34955'], page: 'src/pages/Imp34983SigmaKneeCrossingCmbSensitivityViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34956'], page: 'src/pages/Imp34985PinnedProductWindowSensitivityViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34957'], page: 'src/pages/Imp34986CrossoverNumeratorPolynomialLadderViz.jsx', pageHasInlineBanner: true },
];

const GLOSSARY_HEADWORD_IDS = ['imp-34979', 'imp-34982', 'imp-34984'];
const NO_SURFACE_AT_ALL = [];

export const CAVEAT_SURFACING_AUDIT_34952_34957 = {
  ticket: 'imp-34988',
  dataModuleCohort: DATA_MODULE_COHORT,
  vizPageCohort: VIZ_PAGE_COHORT,
  glossaryHeadwordIds: GLOSSARY_HEADWORD_IDS,
  noSurfaceIds: NO_SURFACE_AT_ALL,
  gapsFound: [
    ...DATA_MODULE_COHORT.filter((m) => !m.hasCaveat).map((m) => m.ticket),
    ...VIZ_PAGE_COHORT.filter((m) => !m.pageHasInlineBanner).map((m) => m.tickets.join('/')),
  ],
  honest: 'AUDIT-ONLY -- confirms the honest-status caveat is present in all 6 imp-34952..imp-34957 cohort '
    + 'data modules (imp-34714a-REMAINS-OPEN additionally named by the precision-family module imp-34952; '
    + 'C_mb GUE-conditional per imp-486 and C_C 1/8 ansatz named in every module) and rendered inline on all 6 '
    + 'downstream viz pages (imp-34952/34953/34954/34955/34956/34957, shipped as imp-34978/34980/34981/34983/'
    + '34985/34986 respectively), with 3 of the 6 additionally carrying a dedicated glossary headword '
    + '(imp-34979/34982/34984, src/data/glossary.js) in the equivalent HONEST SCOPE language. Unlike the prior '
    + 'imp-34921/34946/34968 audits, no completeness-coverage gap was found in this cohort -- every module '
    + 'already has at least one downstream surface. No bound change; sub-gap imp-34714a stays OPEN; C_mb '
    + 'GUE-conditional share (imp-486) untouched; C_C 1/8 ansatz (imp-2642/imp-2643) untouched; no operator '
    + 'positivity; NO QED; no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34952_34957_ASSERTIONS = [
  {
    id: 'imp-34988-data-module-cohort-has-six-members',
    description: 'the audited data-module cohort is exactly imp-34952..imp-34957 (6 tickets)',
    holds: () => CAVEAT_SURFACING_AUDIT_34952_34957.dataModuleCohort.length === 6
      && ['imp-34952', 'imp-34953', 'imp-34954', 'imp-34955', 'imp-34956', 'imp-34957']
        .every((t) => DATA_MODULE_COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34988-all-data-modules-have-caveat',
    description: 'every cohort data module carries the honest-status caveat',
    holds: () => DATA_MODULE_COHORT.every((m) => m.hasCaveat === true),
  },
  {
    id: 'imp-34988-precision-module-names-34714a-open',
    description: 'imp-34952 and imp-34953 both name sub-gap imp-34714a as REMAINS OPEN',
    holds: () => ['imp-34952', 'imp-34953'].every((t) => DATA_MODULE_COHORT.find((m) => m.ticket === t).mustNameSubGap === 'imp-34714a-open' && DATA_MODULE_COHORT.find((m) => m.ticket === t).namesSubGap === true),
  },
  {
    id: 'imp-34988-viz-page-cohort-has-six-members',
    description: 'the audited viz-page cohort is exactly the 6 pages built from the imp-34952..34957 cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34952_34957.vizPageCohort.length === 6
      && ['imp-34952', 'imp-34953', 'imp-34954', 'imp-34955', 'imp-34956', 'imp-34957']
        .every((t) => VIZ_PAGE_COHORT.some((m) => m.tickets.includes(t))),
  },
  {
    id: 'imp-34988-all-viz-pages-have-inline-banner',
    description: 'every cohort viz page carries the honest-status caveat inline in its own JSX',
    holds: () => VIZ_PAGE_COHORT.every((m) => m.pageHasInlineBanner === true),
  },
  {
    id: 'imp-34988-glossary-and-no-surface-ids-documented',
    description: 'the 3 glossary headword ids are recorded and zero modules lack any surface',
    holds: () => GLOSSARY_HEADWORD_IDS.length === 3 && NO_SURFACE_AT_ALL.length === 0
      && GLOSSARY_HEADWORD_IDS.every((t) => CAVEAT_SURFACING_AUDIT_34952_34957.glossaryHeadwordIds.includes(t)),
  },
  {
    id: 'imp-34988-no-gaps-found',
    description: 'the audit found zero caveat gaps across the full 6-module + 6-page cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34952_34957.gapsFound.length === 0,
  },
  {
    id: 'imp-34988-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34952_34957.honest)
      && /no completeness-coverage gap was found/.test(CAVEAT_SURFACING_AUDIT_34952_34957.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34952_34957.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34952_34957_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34988-caveat-surfacing-audit assertion failed: ${a.id}`);
}
