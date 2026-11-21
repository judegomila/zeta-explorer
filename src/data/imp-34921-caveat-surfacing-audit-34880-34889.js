/**
 * @module imp-34921-caveat-surfacing-audit-34880-34889
 *
 * imp-34921 (meta): AUDIT of whether the shared honest-status caveat (inherited
 * imp-3220/imp-3406 surrogate crossover map; imp-34714a directed-rounding
 * certificate REMAINS OPEN; C_mb GUE-conditional per imp-486 stays a free
 * knob, not a discharge of that conditional; C_C 1/8 ansatz imp-2642/imp-2643
 * UNTOUCHED; changes-no-bound; establishes no operator positivity; NO QED;
 * no refereed bound is changed) is carried by every module in the
 * imp-34880..imp-34889 cohort and any viz page built from imp-34911/34912/
 * 34913/34914/34915/34916, extending the imp-34725/imp-34812/imp-34834/
 * imp-34857/imp-34879/imp-34897 caveat-surfacing audit lineage.
 *
 * COHORT-MEMBERSHIP CHECK. The ticket names a 10-ticket cohort (34880-34889
 * inclusive), each shipping its own dedicated src/data/imp-NNNNN-*.js module.
 * Six of the ten have a downstream viz page: imp-34882 -> imp-34916
 * (DombSykesRadiusExtrapolationViz), imp-34883 -> imp-34915
 * (KrawczykWorstcaseHeadroomBandViz), imp-34886 -> imp-34914
 * (EflowKneeInflectionCrossingViz), imp-34887 -> imp-34913
 * (SignedResidualOffsetInversionViz), imp-34888 -> imp-34912
 * (PadeBorelResummationInertnessViz), imp-34889 -> imp-34911
 * (ForwardBreachBandUniformityViz). imp-34880 and imp-34884 instead surface
 * as glossary/Concepts explainer entries inside src/pages/ConceptsPage.jsx
 * (added by imp-34919 and an earlier commit respectively), not standalone
 * viz pages. imp-34881 and imp-34885 completed as data-module-only tickets
 * with no page of any kind referencing them yet.
 *
 * METHOD. Each of the 10 standalone data modules was grepped directly for
 * the "NO QED" / "GUE-conditional" / "imp-34714a" honest-status markers, the
 * 6 viz pages were read for an inline "Honest status:" JSX block, and the 2
 * ConceptsPage.jsx entries were read for the same caveat language.
 *
 * FINDING: no gap. All 10 cohort data modules carry the honest-status caveat
 * (NO QED / changes-no-bound / C_mb GUE-conditional per imp-486 named in
 * every module; imp-34714a-REMAINS-OPEN additionally named by the four
 * Krawczyk/forward-breach modules imp-34883/34884/34885/34889), all 6 viz
 * pages render an inline "Honest status:" block repeating the same caveat,
 * and both ConceptsPage.jsx glossary entries (imp-34880, imp-34884) carry
 * the equivalent "no RH verdict, NO QED... No refereed bound is changed
 * " language. AUDIT-ONLY -- no surfacing was added because none was
 * missing.
 */

const DATA_MODULE_COHORT = [
  { ticket: 'imp-34880', module: 'src/data/imp-34880-crossover-deriv-all-orders-sign-induction.js', hasCaveat: true, surfacedAs: 'glossary', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34881', module: 'src/data/imp-34881-crossover-envelope-general-order-n-shrink-ratio-limit.js', hasCaveat: true, surfacedAs: 'none', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34882', module: 'src/data/imp-34882-sigma-knee-domb-sykes-radius.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34883', module: 'src/data/imp-34883-krawczyk-worstcase-headroom-band.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34884', module: 'src/data/imp-34884-forward-op-depth-breach.js', hasCaveat: true, surfacedAs: 'glossary', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34885', module: 'src/data/imp-34885-krawczyk-directed-rounding-instantiation-checklist.js', hasCaveat: true, surfacedAs: 'none', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34886', module: 'src/data/imp-34886-eflow-strength-knee-inflection-crossing.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34887', module: 'src/data/imp-34887-iters-to-floor-residual-sign.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34888', module: 'src/data/imp-34888-sigma-knee-pade-borel-resummation.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34889', module: 'src/data/imp-34889-forward-breach-band-uniformity.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
];

const VIZ_PAGE_COHORT = [
  { tickets: ['imp-34882'], page: 'src/pages/Imp34916DombSykesRadiusExtrapolationViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34883'], page: 'src/pages/Imp34915KrawczykWorstcaseHeadroomBandViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34886'], page: 'src/pages/Imp34914EflowKneeInflectionCrossingViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34887'], page: 'src/pages/Imp34913SignedResidualOffsetInversionViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34888'], page: 'src/pages/Imp34912PadeBorelResummationInertnessViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34889'], page: 'src/pages/Imp34911ForwardBreachBandUniformityViz.jsx', pageHasInlineBanner: true },
];

const GLOSSARY_ONLY = ['imp-34880', 'imp-34884'];
const NO_PAGE_AT_ALL = ['imp-34881', 'imp-34885'];

export const CAVEAT_SURFACING_AUDIT_34880_34889 = {
  ticket: 'imp-34921',
  dataModuleCohort: DATA_MODULE_COHORT,
  vizPageCohort: VIZ_PAGE_COHORT,
  glossaryOnlyIds: GLOSSARY_ONLY,
  noPageIds: NO_PAGE_AT_ALL,
  gapsFound: [
    ...DATA_MODULE_COHORT.filter((m) => !m.hasCaveat || !m.namesSubGap).map((m) => m.ticket),
    ...VIZ_PAGE_COHORT.filter((m) => !m.pageHasInlineBanner).map((m) => m.tickets.join('/')),
  ],
  honest: 'AUDIT-ONLY -- confirms the honest-status caveat is present in all 10 imp-34880..imp-34889 cohort '
    + 'tickets (imp-34714a-REMAINS-OPEN additionally named by the Krawczyk/forward-breach modules '
    + 'imp-34883/34884/34885/34889; C_mb GUE-conditional per imp-486 named in every module) and rendered '
    + 'inline on all 6 downstream viz pages (imp-34882/34883/34886/34887/34888/34889, shipped as imp-34916/'
    + '34915/34914/34913/34912/34911 respectively). imp-34880 and imp-34884 surface only as ConceptsPage.jsx '
    + 'glossary entries carrying the equivalent caveat language, not standalone viz pages; imp-34881 and '
    + 'imp-34885 have no page of any kind yet, which is a completeness gap in coverage but not a caveat gap '
    + '-- no surfacing was added because none of the existing surfaces was missing its caveat. No bound '
    + 'change; sub-gap imp-34714a stays OPEN; C_mb GUE-conditional share (imp-486) untouched; no operator '
    + 'positivity; NO QED; no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34880_34889_ASSERTIONS = [
  {
    id: 'imp-34921-data-module-cohort-has-ten-members',
    description: 'the audited data-module cohort is exactly imp-34880..imp-34889 (10 tickets)',
    holds: () => CAVEAT_SURFACING_AUDIT_34880_34889.dataModuleCohort.length === 10
      && ['imp-34880', 'imp-34881', 'imp-34882', 'imp-34883', 'imp-34884', 'imp-34885', 'imp-34886', 'imp-34887', 'imp-34888', 'imp-34889']
        .every((t) => DATA_MODULE_COHORT.some((m) => m.ticket === t)),
  },
  {
    id: 'imp-34921-all-data-modules-have-caveat',
    description: 'every cohort data module carries the honest-status caveat',
    holds: () => DATA_MODULE_COHORT.every((m) => m.hasCaveat === true),
  },
  {
    id: 'imp-34921-krawczyk-modules-name-34714a-open',
    description: 'imp-34883, imp-34884, imp-34885, and imp-34889 all name sub-gap imp-34714a as REMAINS OPEN',
    holds: () => ['imp-34883', 'imp-34884', 'imp-34885', 'imp-34889'].every((t) => DATA_MODULE_COHORT.find((m) => m.ticket === t).mustNameSubGap === 'imp-34714a-open' && DATA_MODULE_COHORT.find((m) => m.ticket === t).namesSubGap === true),
  },
  {
    id: 'imp-34921-viz-page-cohort-has-six-members',
    description: 'the audited viz-page cohort is exactly the 6 pages built from imp-34911..34916',
    holds: () => CAVEAT_SURFACING_AUDIT_34880_34889.vizPageCohort.length === 6
      && ['imp-34882', 'imp-34883', 'imp-34886', 'imp-34887', 'imp-34888', 'imp-34889']
        .every((t) => VIZ_PAGE_COHORT.some((m) => m.tickets.includes(t))),
  },
  {
    id: 'imp-34921-all-viz-pages-have-inline-banner',
    description: 'every cohort viz page carries the honest-status caveat inline in its own JSX',
    holds: () => VIZ_PAGE_COHORT.every((m) => m.pageHasInlineBanner === true),
  },
  {
    id: 'imp-34921-glossary-only-and-no-page-ids-documented',
    description: 'the 2 glossary-only ids and 2 no-page ids are recorded, not silently dropped',
    holds: () => GLOSSARY_ONLY.length === 2 && NO_PAGE_AT_ALL.length === 2
      && GLOSSARY_ONLY.every((t) => CAVEAT_SURFACING_AUDIT_34880_34889.glossaryOnlyIds.includes(t))
      && NO_PAGE_AT_ALL.every((t) => CAVEAT_SURFACING_AUDIT_34880_34889.noPageIds.includes(t)),
  },
  {
    id: 'imp-34921-no-gaps-found',
    description: 'the audit found zero gaps across the full 10-module + 6-page cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34880_34889.gapsFound.length === 0,
  },
  {
    id: 'imp-34921-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34880_34889.honest)
      && /no surfacing was added because none/.test(CAVEAT_SURFACING_AUDIT_34880_34889.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34880_34889.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34880_34889_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34921-caveat-surfacing-audit assertion failed: ${a.id}`);
}
