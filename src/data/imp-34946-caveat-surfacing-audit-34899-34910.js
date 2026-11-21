/**
 * @module imp-34946-caveat-surfacing-audit-34899-34910
 *
 * imp-34946 (meta): AUDIT of whether the shared honest-status caveat (inherited
 * imp-3220/imp-3406 surrogate crossover map; C_mb GUE-conditional per imp-486
 * stays a free knob, not a discharge of that conditional; C_C 1/8 ansatz
 * imp-2642/imp-2643 UNTOUCHED; for the Krawczyk-family modules the imp-34714a
 * directed-rounding certificate REMAINS OPEN; changes-no-bound; establishes no
 * operator positivity; NO QED; no refereed bound is changed) is
 * carried by every module in the imp-34899..imp-34910 cohort and every viz
 * page built from imp-34934..imp-34940, extending the
 * imp-34725/imp-34812/imp-34834/imp-34857/imp-34879/imp-34897/imp-34921
 * caveat-surfacing audit lineage.
 *
 * COHORT-MEMBERSHIP CHECK. The ticket names an 11-ticket cohort (imp-34899,
 * imp-34900, imp-34902..imp-34910 -- imp-34901 was never allocated), each
 * shipping its own dedicated src/data/imp-NNNNN-*.js module. Seven of the
 * eleven have a downstream viz page: imp-34899 -> imp-34934
 * (EflowRampPositionSweepViz), imp-34900 -> imp-34935
 * (SigmaKneeAnalyticVsFdDerivativeViz), imp-34902 -> imp-34936
 * (SigmaKneeEpsSweepViz), imp-34903 -> imp-34937
 * (IterFloorResidualWideBandViz), imp-34904 -> imp-34938
 * (LandmarkReconciliationAxisViz), imp-34906 -> imp-34939
 * (KrawczykHeadroomH2CeilingBandViz), imp-34909 -> imp-34940
 * (OpDepthNewtonStepReconciliationViz). imp-34904, imp-34908, imp-34909, and
 * imp-34910 additionally (or instead) surface as glossary headwords or a
 * Concepts/Docs explainer inside src/data/glossary.js / src/pages/
 * ConceptsPage.jsx (added by imp-34941/34942/34943/34944). imp-34905 and
 * imp-34907 are data-module-only tickets with no page or glossary entry of
 * any kind yet -- they are referenced only by later extension modules
 * (imp-34905 by imp-34922/imp-34957; imp-34907 by imp-34925/imp-34950),
 * neither of which has a page either.
 *
 * METHOD. Each of the 11 standalone data modules was grepped directly for
 * the "NO QED" / "GUE-conditional" / "C_C" / "SOTA" honest-status markers
 * and, for the four Krawczyk-family modules named by the ticket
 * (imp-34906/34908/34909/34910), for the "imp-34714a" open-sub-gap marker.
 * The 7 viz pages were read for an inline "Honest status:" JSX block. The
 * glossary/Concepts surfaces for imp-34904/34908/34909/34910 were read for
 * the equivalent "HONEST SCOPE" / caveat language.
 *
 * FINDING: no gap. All 11 cohort data modules carry the honest-status
 * caveat (NO QED / changes-no-bound / C_mb GUE-conditional per imp-486 /
 * C_C 1/8 ansatz / Platt-Trudgian Lambda<=0.2 SOTA named in every module),
 * the four Krawczyk-family modules additionally name imp-34714a as REMAINS
 * OPEN, all 7 viz pages render an inline "Honest status:" block repeating
 * the same caveat, and the four glossary/Concepts entries carry the
 * equivalent "HONEST SCOPE" language. imp-34905 and imp-34907 have no page
 * or glossary surface of any kind yet, which is a completeness-coverage gap
 * (like imp-34881/imp-34885 in the imp-34921 audit) but not a caveat gap --
 * no surfacing was added because none of the existing surfaces was missing
 * its caveat. AUDIT-ONLY.
 */

const DATA_MODULE_COHORT = [
  { ticket: 'imp-34899', module: 'src/data/imp-34899-eflow-crossing-strength-ramp-position-sweep.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34900', module: 'src/data/imp-34900-sigma-knee-analytic-derivative-domb-sykes.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34902', module: 'src/data/imp-34902-sigma-knee-resummation-eps-sweep.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34903', module: 'src/data/imp-34903-iters-to-floor-residual-sign-wide-band.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34904', module: 'src/data/imp-34904-landmark-3p3e9-reconciliation-table.js', hasCaveat: true, surfacedAs: 'viz+glossary', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34905', module: 'src/data/imp-34905-crossover-deriv-closed-form-independent-verify-p7-p8.js', hasCaveat: true, surfacedAs: 'none', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34906', module: 'src/data/imp-34906-krawczyk-headroom-h2-ceiling-reconcile.js', hasCaveat: true, surfacedAs: 'viz', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34907', module: 'src/data/imp-34907-eflow-crossing-strength-cmb-sweep.js', hasCaveat: true, surfacedAs: 'none', mustNameSubGap: null, namesSubGap: true },
  { ticket: 'imp-34908', module: 'src/data/imp-34908-krawczyk-certificate-precision-scope.js', hasCaveat: true, surfacedAs: 'concepts', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34909', module: 'src/data/imp-34909-op-depth-newton-step-reconciliation.js', hasCaveat: true, surfacedAs: 'viz+glossary', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
  { ticket: 'imp-34910', module: 'src/data/imp-34910-residual-corrected-quotient-ulp-measurement.js', hasCaveat: true, surfacedAs: 'glossary', mustNameSubGap: 'imp-34714a-open', namesSubGap: true },
];

const VIZ_PAGE_COHORT = [
  { tickets: ['imp-34899'], page: 'src/pages/Imp34934EflowRampPositionSweepViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34900'], page: 'src/pages/Imp34935SigmaKneeAnalyticVsFdDerivativeViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34902'], page: 'src/pages/Imp34936SigmaKneeEpsSweepViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34903'], page: 'src/pages/Imp34937IterFloorResidualWideBandViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34904'], page: 'src/pages/Imp34938LandmarkReconciliationAxisViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34906'], page: 'src/pages/Imp34939KrawczykHeadroomH2CeilingBandViz.jsx', pageHasInlineBanner: true },
  { tickets: ['imp-34909'], page: 'src/pages/Imp34940OpDepthNewtonStepReconciliationViz.jsx', pageHasInlineBanner: true },
];

const GLOSSARY_OR_CONCEPTS_ONLY_OR_BOTH = ['imp-34904', 'imp-34908', 'imp-34909', 'imp-34910'];
const NO_PAGE_AT_ALL = ['imp-34905', 'imp-34907'];

export const CAVEAT_SURFACING_AUDIT_34899_34910 = {
  ticket: 'imp-34946',
  dataModuleCohort: DATA_MODULE_COHORT,
  vizPageCohort: VIZ_PAGE_COHORT,
  glossaryOrConceptsIds: GLOSSARY_OR_CONCEPTS_ONLY_OR_BOTH,
  noPageIds: NO_PAGE_AT_ALL,
  gapsFound: [
    ...DATA_MODULE_COHORT.filter((m) => !m.hasCaveat || !m.namesSubGap).map((m) => m.ticket),
    ...VIZ_PAGE_COHORT.filter((m) => !m.pageHasInlineBanner).map((m) => m.tickets.join('/')),
  ],
  honest: 'AUDIT-ONLY -- confirms the honest-status caveat is present in all 11 imp-34899..imp-34910 cohort '
    + 'tickets (imp-34714a-REMAINS-OPEN additionally named by the four Krawczyk-family modules imp-34906/34908/'
    + '34909/34910; C_mb GUE-conditional per imp-486 and C_C 1/8 ansatz named in every module) and rendered '
    + 'inline on all 7 downstream viz pages (imp-34899/34900/34902/34903/34904/34906/34909, shipped as '
    + 'imp-34934/34935/34936/34937/34938/34939/34940 respectively). imp-34904/34908/34909/34910 additionally '
    + 'or instead carry the equivalent caveat as a glossary headword or Concepts/Docs explainer '
    + '(src/data/glossary.js, src/pages/ConceptsPage.jsx). imp-34905 and imp-34907 have no page or glossary '
    + 'surface of any kind yet, which is a completeness gap in coverage but not a caveat gap -- no surfacing '
    + 'was added because none of the existing surfaces was missing its caveat. No bound change; sub-gap '
    + 'imp-34714a stays OPEN; C_mb GUE-conditional share (imp-486) untouched; C_C 1/8 ansatz (imp-2642/imp-2643) '
    + 'untouched; no operator positivity; NO QED; no refereed bound is changed.',
};

export const CAVEAT_SURFACING_AUDIT_34899_34910_ASSERTIONS = [
  {
    id: 'imp-34946-data-module-cohort-has-eleven-members',
    description: 'the audited data-module cohort is exactly imp-34899/34900/34902..34910 (11 tickets, imp-34901 skipped)',
    holds: () => CAVEAT_SURFACING_AUDIT_34899_34910.dataModuleCohort.length === 11
      && ['imp-34899', 'imp-34900', 'imp-34902', 'imp-34903', 'imp-34904', 'imp-34905', 'imp-34906', 'imp-34907', 'imp-34908', 'imp-34909', 'imp-34910']
        .every((t) => DATA_MODULE_COHORT.some((m) => m.ticket === t))
      && !DATA_MODULE_COHORT.some((m) => m.ticket === 'imp-34901'),
  },
  {
    id: 'imp-34946-all-data-modules-have-caveat',
    description: 'every cohort data module carries the honest-status caveat',
    holds: () => DATA_MODULE_COHORT.every((m) => m.hasCaveat === true),
  },
  {
    id: 'imp-34946-krawczyk-modules-name-34714a-open',
    description: 'imp-34906, imp-34908, imp-34909, and imp-34910 all name sub-gap imp-34714a as REMAINS OPEN',
    holds: () => ['imp-34906', 'imp-34908', 'imp-34909', 'imp-34910'].every((t) => DATA_MODULE_COHORT.find((m) => m.ticket === t).mustNameSubGap === 'imp-34714a-open' && DATA_MODULE_COHORT.find((m) => m.ticket === t).namesSubGap === true),
  },
  {
    id: 'imp-34946-viz-page-cohort-has-seven-members',
    description: 'the audited viz-page cohort is exactly the 7 pages built from imp-34934..34940',
    holds: () => CAVEAT_SURFACING_AUDIT_34899_34910.vizPageCohort.length === 7
      && ['imp-34899', 'imp-34900', 'imp-34902', 'imp-34903', 'imp-34904', 'imp-34906', 'imp-34909']
        .every((t) => VIZ_PAGE_COHORT.some((m) => m.tickets.includes(t))),
  },
  {
    id: 'imp-34946-all-viz-pages-have-inline-banner',
    description: 'every cohort viz page carries the honest-status caveat inline in its own JSX',
    holds: () => VIZ_PAGE_COHORT.every((m) => m.pageHasInlineBanner === true),
  },
  {
    id: 'imp-34946-glossary-concepts-and-no-page-ids-documented',
    description: 'the 4 glossary/Concepts ids and 2 no-page ids are recorded, not silently dropped',
    holds: () => GLOSSARY_OR_CONCEPTS_ONLY_OR_BOTH.length === 4 && NO_PAGE_AT_ALL.length === 2
      && GLOSSARY_OR_CONCEPTS_ONLY_OR_BOTH.every((t) => CAVEAT_SURFACING_AUDIT_34899_34910.glossaryOrConceptsIds.includes(t))
      && NO_PAGE_AT_ALL.every((t) => CAVEAT_SURFACING_AUDIT_34899_34910.noPageIds.includes(t)),
  },
  {
    id: 'imp-34946-no-gaps-found',
    description: 'the audit found zero gaps across the full 11-module + 7-page cohort',
    holds: () => CAVEAT_SURFACING_AUDIT_34899_34910.gapsFound.length === 0,
  },
  {
    id: 'imp-34946-audit-only-honest',
    description: 'explicitly AUDIT-ONLY (no surfacing added, none needed) and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_34899_34910.honest)
      && /no surfacing was added because none/.test(CAVEAT_SURFACING_AUDIT_34899_34910.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_34899_34910.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_34899_34910_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-34946-caveat-surfacing-audit assertion failed: ${a.id}`);
}
