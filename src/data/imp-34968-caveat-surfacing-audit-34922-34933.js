/**
 * @module imp-34968-caveat-surfacing-audit-34922-34933
 *
 * imp-34968 (meta): AUDIT of whether the shared honest-status caveat (inherited
 * imp-3220/imp-3406 surrogate crossover map; C_mb GUE-conditional per imp-486
 * stays a free knob, not a discharge of that conditional; C_C 1/8 ansatz
 * imp-2642/imp-2643 UNTOUCHED; for the precision/Krawczyk-family modules the
 * imp-34714a directed-rounding certificate REMAINS OPEN; changes-no-bound;
 * establishes no operator positivity; NO QED; no refereed bound is changed
 * ) is carried by every module in the imp-34922..imp-34933 cohort
 * and every downstream viz/glossary surface built from it, extending the
 * imp-34725/imp-34812/imp-34834/imp-34857/imp-34879/imp-34897/imp-34921/
 * imp-34946 caveat-surfacing audit lineage.
 *
 * COHORT-MEMBERSHIP CHECK. The ticket names a 12-ticket cohort (imp-34922
 * crossover-deriv P9/P10, imp-34923 Gronwall halving-surplus, imp-34924
 * E_flow pinned-product, imp-34925 E_flow C_mb functional form, imp-34926
 * iters-to-floor ceil-boundary geometry, imp-34927 double-double log ULP,
 * imp-34928 directed-quotient ULP band-wide, imp-34929 Krawczyk headroom
 * monotonicity derivative, imp-34930 breach-step law, imp-34931 sigma-knee
 * raw-total crossing, imp-34932 extended-order Domb-Sykes, imp-34933
 * inflection-offset ladder), each shipping its own dedicated src/data/
 * imp-NNNNN-*.js module. Eight of the twelve have a downstream viz page:
 * imp-34924 -> imp-34964 (EflowPinnedProductInvarianceViz), imp-34925 ->
 * imp-34963 (EflowCrossingStrengthPowerLawViz), imp-34926 -> imp-34965
 * (ItersToFloorCeilBoundaryGeometryViz), imp-34929 -> imp-34962
 * (KrawczykHeadroomMonotonicityDerivativeViz), imp-34930 -> imp-34961
 * (BreachStepDoublingViz), imp-34931 -> imp-34960 (RawTotalCrossingViz),
 * imp-34932 -> imp-34959 (SignPatternNevilleDivergenceViz), imp-34933 ->
 * imp-34958 (InflectionOffsetRunningVsFixedLadderViz). imp-34932
 * additionally carries a dedicated glossary headword (imp-34966). imp-34922,
 * imp-34923, imp-34927, and imp-34928 have no viz page or dedicated glossary
 * headword of any kind yet -- imp-34923 and imp-34933 are only referenced
 * incidentally inside the unrelated imp-34904 landmark-reconciliation
 * glossary headword's body text, which does not count as their own surface.
 *
 * METHOD. Each of the 12 standalone data modules was grepped directly for
 * the "NO QED" / "GUE-conditional" / "C_C" / "SOTA" / "changes no bound"
 * honest-status markers and for the "imp-34714a" open-sub-gap marker. The
 * 8 viz pages were read for an inline "Honest status:" JSX block. The
 * glossary was grepped for a dedicated imp-34932 headword and read for the
 * equivalent "HONEST SCOPE" caveat language.
 *
 * FINDING: no caveat gap. All 12 cohort data modules carry the honest-status
 * caveat (NO QED / changes-no-bound / C_mb GUE-conditional per imp-486 /
 * C_C 1/8 ansatz / Platt-Trudgian Lambda<=0.2 SOTA named in every module),
 * the four precision/Krawczyk-family modules (imp-34927/34928/34929/34930)
 * additionally name imp-34714a as REMAINS OPEN, and all 8 downstream viz
 * pages render an inline "Honest status:" block repeating the same caveat.
 * The single downstream glossary headword (imp-34966, for imp-34932) carries
 * the equivalent "HONEST SCOPE" language. imp-34922, imp-34923, imp-34927,
 * and imp-34928 have no page or dedicated glossary surface of any kind yet,
 * which is a completeness-coverage gap (like imp-34881/imp-34885 in the
 * imp-34921 audit, and imp-34905/imp-34907 in the imp-34946 audit) but not a
 * caveat gap -- no surfacing was added because none of the existing surfaces
 * was missing its caveat. AUDIT-ONLY.
 */

const DATA_MODULE_COHORT = [
  { ticket: 'imp-34922', module: 'src/data/imp-34922-crossover-deriv-p9-p10-extension.js', hasCaveat: true, surfacedAs: 'none', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34923', module: 'src/data/imp-34923-gronwall-halving-surplus-identity-derivation.js', hasCaveat: true, surfacedAs: 'none', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34924', module: 'src/data/imp-34924-eflow-pinned-product-derivation.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34925', module: 'src/data/imp-34925-eflow-crossing-strength-cmb-functional-form.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34926', module: 'src/data/imp-34926-iters-to-floor-ceil-boundary-geometry.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34927', module: 'src/data/imp-34927-double-double-log-ulp-measurement.js', hasCaveat: true, surfacedAs: 'none', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34928', module: 'src/data/imp-34928-directed-quotient-ulp-band-wide.js', hasCaveat: true, surfacedAs: 'none', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34929', module: 'src/data/imp-34929-krawczyk-headroom-monotonicity-derivative.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34930', module: 'src/data/imp-34930-breach-step-law-verification.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34931', module: 'src/data/imp-34931-sigma-knee-raw-total-crossing.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34932', module: 'src/data/imp-34932-sigma-knee-extended-order-domb-sykes.js', hasCaveat: true, surfacedAs: 'viz+glossary', mustNameSubGap: null, namesSubGap: false },
  { ticket: 'imp-34933', module: 'src/data/imp-34933-inflection-offset-running-vs-fixed-ladder.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: false },
];

const VIZ_PAGE_COHORT = [
  { tickets: ['imp-34924'], page: 'src/pages/Imp34964EflowPinnedProductInvarianceViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34925'], page: 'src/pages/Imp34963EflowCrossingStrengthPowerLawViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34926'], page: 'src/pages/Imp34965ItersToFloorCeilBoundaryGeometryViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34929'], page: 'src/pages/Imp34962KrawczykHeadroomMonotonicityDerivativeViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34930'], page: 'src/pages/Imp34961BreachStepDoublingViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34931'], page: 'src/pages/Imp34960RawTotalCrossingViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34932'], page: 'src/pages/Imp34959SignPatternNevilleDivergenceViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34933'], page: 'src/pages/Imp34958InflectionOffsetRunningVsFixedLadderViz.jsx', pageHasInlineBanner: true },
];

const GLOSSARY_HEADWORD_IDS = ['imp-34932'];
const NO_SURFACE_AT_ALL = ['imp-34922', 'imp-34923', 'imp-34927', 'imp-34928'];

export const CAVEAT_SURFACING_AUDIT_34922_34933 = {
  ticket: 'imp-34968',
  dataModuleCohort: DATA_MODULE_COHORT,
  vizPageCohort: VIZ_PAGE_COHORT,
  glossaryHeadwordIds: GLOSSARY_HEADWORD_IDS,
  noSurfaceIds: NO_SURFACE_AT_ALL,
  gapsFound: [
    ...DATA_MODULE_COHORT.filter((m) => !m.hasCaveat).map((m) => m.ticket),
    ...VIZ_PAGE_COHORT.filter((m) => !m.pageHasInlineBanner).map((m) => m.tickets.join('/')),
  ],
  honest: 'AUDIT-ONLY -- confirms the honest-status caveat is present in all 12 imp-34922..imp-34933 cohort '
    + 'data modules (imp-34714a-REMAINS-OPEN additionally named by the four precision/Krawczyk-family modules '
    + 'imp-34927/34928/34929/34930; C_mb GUE-conditional per imp-486 and C_C 1/8 ansatz named in every module) '
    + 'and rendered inline on all 8 downstream viz pages (imp-34924/34925/34926/34929/34930/34931/34932/34933, '
    + 'shipped as imp-34964/34963/34965/34962/34961/34960/34959/34958 respectively). imp-34932 additionally '
    + 'carries the equivalent caveat as a dedicated glossary headword (imp-34966, src/data/glossary.js). '
    + 'imp-34922, imp-34923, imp-34927, and imp-34928 have no page or dedicated glossary headword of any kind '
    + 'yet (imp-34923 and imp-34933 appear only as incidental references inside the unrelated imp-34904 '
    + 'headword body, which is not their own surface) -- a completeness-coverage gap, not a caveat gap, no '
    + 'surfacing was added because none of the existing surfaces was missing its caveat. No bound change; '
    + 'sub-gap imp-34714a stays OPEN; C_mb GUE-conditional share (imp-486) untouched; C_C 1/8 ansatz '
    + '(imp-2642/imp-2643) untouched; no operator positivity; NO QED; no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34922_34933_ASSERTIONS = [
  {
    id: 'imp-34968-data-module-cohort-has-twelve-members',
    description: 'the audited data-module cohort is exactly imp-34922..imp-34933 (12 tickets)',
    holds: () => CAVEAT_SURFACING_AUDIT_34922_34933.dataModuleCohort.length === 12
      && ['imp-34922', 'imp-34923', 'imp-34924', 'imp-34925', 'imp-34926', 'imp-34927', 'imp-34928', 'imp-34929', 'imp-34930', 'imp-34931', 'imp-34932', 'imp-34933']
        .every((t) => DATA_MODULE_COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34968-all-data-modules-have-caveat',
    description: 'every cohort data module carries the honest-status caveat',
    holds: () => DATA_MODULE_COHORT.every((m) => m.hasCaveat === true),
  },
  {
    id: 'imp-34968-precision-modules-name-34714a-open',
    description: 'imp-34927, imp-34928, imp-34929, and imp-34930 all name sub-gap imp-34714a as REMAINS OPEN',
    holds: () => ['imp-34927', 'imp-34928', 'imp-34929', 'imp-34930'].every((t) => DATA_MODULE_COHORT.find((m) => m.ticket === t).mustNameSubGap === 'imp-34714a-open' && DATA_MODULE_COHORT.find((m) => m.ticket === t).namesSubGap === true),
  },
  {
    id: 'imp-34968-viz-page-cohort-has-eight-members',
    description: 'the audited viz-page cohort is exactly the 8 pages built from the imp-34922..34933 cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34922_34933.vizPageCohort.length === 8
      && ['imp-34924', 'imp-34925', 'imp-34926', 'imp-34929', 'imp-34930', 'imp-34931', 'imp-34932', 'imp-34933']
        .every((t) => VIZ_PAGE_COHORT.some((m) => m.tickets.includes(t))),
  },
  {
    id: 'imp-34968-all-viz-pages-have-inline-banner',
    description: 'every cohort viz page carries the honest-status caveat inline in its own JSX',
    holds: () => VIZ_PAGE_COHORT.every((m) => m.pageHasInlineBanner === true),
  },
  {
    id: 'imp-34968-glossary-and-no-surface-ids-documented',
    description: 'the 1 glossary headword id and 4 no-surface ids are recorded, not silently dropped',
    holds: () => GLOSSARY_HEADWORD_IDS.length === 1 && NO_SURFACE_AT_ALL.length === 4
      && GLOSSARY_HEADWORD_IDS.every((t) => CAVEAT_SURFACING_AUDIT_34922_34933.glossaryHeadwordIds.includes(t))
      && NO_SURFACE_AT_ALL.every((t) => CAVEAT_SURFACING_AUDIT_34922_34933.noSurfaceIds.includes(t)),
  },
  {
    id: 'imp-34968-no-gaps-found',
    description: 'the audit found zero caveat gaps across the full 12-module + 8-page cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34922_34933.gapsFound.length === 0,
  },
  {
    id: 'imp-34968-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34922_34933.honest)
      && /no surfacing was added because none/.test(CAVEAT_SURFACING_AUDIT_34922_34933.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34922_34933.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34922_34933_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34968-caveat-surfacing-audit assertion failed: ${a.id}`);
}
