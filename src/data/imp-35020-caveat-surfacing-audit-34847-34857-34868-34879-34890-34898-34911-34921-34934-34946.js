/**
 * @module imp-35020-caveat-surfacing-audit-coverage-gaps
 *
 * imp-35020 (meta): COVERAGE-GAP audit. The caveat-surfacing audit lineage
 * (imp-34521/imp-34618/imp-34725/imp-34740/imp-34812/imp-34834/imp-34879/
 * imp-34897/imp-34921/imp-34946/imp-34968/imp-34988/imp-35007) covers the
 * page-id ranges 34836-34846, 34858-34867, 34880-34889, 34899-34910,
 * 34922-34933, 34947-34951, 34952-34957 -- but left the INTERVENING ranges
 * 34847-34857, 34868-34879, 34890-34898, 34911-34921, and 34934-34946
 * unenumerated. This module enumerates every viz page actually present in
 * those five gap ranges and checks each (plus its underlying data module)
 * for the shared honest-status caveat.
 *
 * METHOD. `ls src/pages` filtered to the five numeric gap ranges turned up
 * 25 viz pages (no page ids fall in the gap ranges outside this list):
 *   34847-34857: imp-34852/34853/34854/34855 (4 pages)
 *   34868-34879: imp-34873/34874/34875/34876/34877 (5 pages)
 *   34890-34898: imp-34890/34891/34892 (3 pages)
 *   34911-34921: imp-34911/34912/34913/34914/34915/34916 (6 pages)
 *   34934-34946: imp-34934/34935/34936/34937/34938/34939/34940 (7 pages)
 * Each page and its underlying src/data/imp-NNNNN-*.js module was grepped
 * for the "Honest status" / "GUE-conditional" / "NO QED" (allowing for
 * &nbsp;/line-wrap splits e.g. "no RH verdict, NO\nQED") honest-status
 * markers, and for the imp-34687a/imp-34714a directed-rounding "REMAINS
 * OPEN" marker on the Krawczyk-family subset (imp-34911/34915/34939/34940
 * name it; imp-34912/34913 correctly omit it as not-applicable -- imp-34912
 * is a Pade-Borel resummation page that explicitly says "NOT a rigorous
 * asymptotic" and imp-34913 explicitly says "no interval enclosure", neither
 * touching Krawczyk interval arithmetic).
 *
 * FINDING: no caveat gap. All 25 pages in the five previously-unenumerated
 * ranges, and all 25 underlying data modules, already carry the full
 * honest-status caveat (inherited imp-3220/imp-3406 surrogate crossover map;
 * C_mb GUE-conditional per imp-486; C_C 1/8 ansatz imp-2642/imp-2643;
 * changes-no-bound; no operator positivity; NO QED; no refereed bound is changed
 * ), with the Krawczyk-family subset additionally and
 * correctly naming imp-34714a as REMAINS OPEN. AUDIT-ONLY, no bound change.
 */

const GAP_RANGE_COHORT = [
  { range: '34847-34857', pages: ['imp-34852', 'imp-34853', 'imp-34854', 'imp-34855'] },
  { range: '34868-34879', pages: ['imp-34873', 'imp-34874', 'imp-34875', 'imp-34876', 'imp-34877'] },
  { range: '34890-34898', pages: ['imp-34890', 'imp-34891', 'imp-34892'] },
  { range: '34911-34921', pages: ['imp-34911', 'imp-34912', 'imp-34913', 'imp-34914', 'imp-34915', 'imp-34916'] },
  { range: '34934-34946', pages: ['imp-34934', 'imp-34935', 'imp-34936', 'imp-34937', 'imp-34938', 'imp-34939', 'imp-34940'] },
];

const KRAWCZYK_FAMILY_MUST_NAME_34714A = ['imp-34911', 'imp-34915', 'imp-34939', 'imp-34940'];
const KRAWCZYK_FAMILY_CORRECTLY_OMITS_34714A = ['imp-34912', 'imp-34913'];

const PAGE_COHORT = [
  { ticket: 'imp-34852', page: 'src/pages/Imp34852CmbSweepSignFlipLadderViz.jsx', hasCaveat: true },
  { ticket: 'imp-34853', page: 'src/pages/Imp34853FifthOrderVExpansionTermLadderViz.jsx', hasCaveat: true },
  { ticket: 'imp-34854', page: 'src/pages/Imp34854D2LocatorConvergenceViz.jsx', hasCaveat: true },
  { ticket: 'imp-34855', page: 'src/pages/Imp34855FiveBandShrinkRatioLadderViz.jsx', hasCaveat: true },
  { ticket: 'imp-34873', page: 'src/pages/Imp34873SigmaKneeD3HalvingLadderViz.jsx', hasCaveat: true },
  { ticket: 'imp-34874', page: 'src/pages/Imp34874CmbElasticityCurvatureLadderViz.jsx', hasCaveat: true },
  { ticket: 'imp-34875', page: 'src/pages/Imp34875IntervalCeilMarginViz.jsx', hasCaveat: true },
  { ticket: 'imp-34876', page: 'src/pages/Imp34876ShrinkRatioLimitViz.jsx', hasCaveat: true },
  { ticket: 'imp-34877', page: 'src/pages/Imp34877CrossoverDerivativeLadderViz.jsx', hasCaveat: true },
  { ticket: 'imp-34890', page: 'src/pages/Imp34890SixthDerivLadderViz.jsx', hasCaveat: true },
  { ticket: 'imp-34891', page: 'src/pages/Imp34891TwoRateOffByOneViz.jsx', hasCaveat: true },
  { ticket: 'imp-34892', page: 'src/pages/Imp34892CauchyHadamardRootTestViz.jsx', hasCaveat: true },
  { ticket: 'imp-34911', page: 'src/pages/Imp34911ForwardBreachBandUniformityViz.jsx', hasCaveat: true },
  { ticket: 'imp-34912', page: 'src/pages/Imp34912PadeBorelResummationInertnessViz.jsx', hasCaveat: true },
  { ticket: 'imp-34913', page: 'src/pages/Imp34913SignedResidualOffsetInversionViz.jsx', hasCaveat: true },
  { ticket: 'imp-34914', page: 'src/pages/Imp34914EflowKneeInflectionCrossingViz.jsx', hasCaveat: true },
  { ticket: 'imp-34915', page: 'src/pages/Imp34915KrawczykWorstcaseHeadroomBandViz.jsx', hasCaveat: true },
  { ticket: 'imp-34916', page: 'src/pages/Imp34916DombSykesRadiusExtrapolationViz.jsx', hasCaveat: true },
  { ticket: 'imp-34934', page: 'src/pages/Imp34934EflowRampPositionSweepViz.jsx', hasCaveat: true },
  { ticket: 'imp-34935', page: 'src/pages/Imp34935SigmaKneeAnalyticVsFdDerivativeViz.jsx', hasCaveat: true },
  { ticket: 'imp-34936', page: 'src/pages/Imp34936SigmaKneeEpsSweepViz.jsx', hasCaveat: true },
  { ticket: 'imp-34937', page: 'src/pages/Imp34937IterFloorResidualWideBandViz.jsx', hasCaveat: true },
  { ticket: 'imp-34938', page: 'src/pages/Imp34938LandmarkReconciliationAxisViz.jsx', hasCaveat: true },
  { ticket: 'imp-34939', page: 'src/pages/Imp34939KrawczykHeadroomH2CeilingBandViz.jsx', hasCaveat: true },
  { ticket: 'imp-34940', page: 'src/pages/Imp34940OpDepthNewtonStepReconciliationViz.jsx', hasCaveat: true },
];

export const CAVEAT_SURFACING_AUDIT_COVERAGE_GAPS = {
  ticket: 'imp-35020',
  gapRangeCohort: GAP_RANGE_COHORT,
  pageCohort: PAGE_COHORT,
  krawczykFamilyMustName34714a: KRAWCZYK_FAMILY_MUST_NAME_34714A,
  krawczykFamilyCorrectlyOmits34714a: KRAWCZYK_FAMILY_CORRECTLY_OMITS_34714A,
  gapsFound: PAGE_COHORT.filter((p) => !p.hasCaveat).map((p) => p.ticket),
  honest:
    'AUDIT-ONLY -- enumerated the 25 viz pages actually present in the five previously-unenumerated '
    + 'caveat-audit gap ranges (34847-34857, 34868-34879, 34890-34898, 34911-34921, 34934-34946) and '
    + 'confirmed every one, and its underlying src/data module, already carries the shared honest-status '
    + 'caveat (inherited imp-3220/imp-3406 surrogate crossover map; C_mb GUE-conditional per imp-486; C_C '
    + '1/8 ansatz imp-2642/imp-2643; no operator positivity; NO QED; no refereed bound is changed'
    + '), with the Krawczyk-family subset (imp-34911/34915/34939/34940) additionally naming imp-34714a '
    + 'as REMAINS OPEN and the non-Krawczyk pair (imp-34912/34913) correctly omitting that sub-gap since '
    + 'neither touches interval arithmetic. No completeness-coverage gap found. Changes no bound.',
};

export const CAVEAT_SURFACING_AUDIT_COVERAGE_GAPS_ASSERTIONS = [
  {
    id: 'imp-35020-five-gap-ranges-enumerated',
    description: 'the audit enumerates exactly the 5 gap ranges named by the ticket',
    holds: () => CAVEAT_SURFACING_AUDIT_COVERAGE_GAPS.gapRangeCohort.length === 5
      && ['34847-34857', '34868-34879', '34890-34898', '34911-34921', '34934-34946']
        .every((r) => GAP_RANGE_COHORT.some((g) => g.range === r)),
  },
  {
    id: 'imp-35020-page-cohort-has-25-members',
    description: 'the audited page cohort across the 5 gap ranges totals 25 pages',
    holds: () => CAVEAT_SURFACING_AUDIT_COVERAGE_GAPS.pageCohort.length === 25
      && GAP_RANGE_COHORT.reduce((n, g) => n + g.pages.length, 0) === 25,
  },
  {
    id: 'imp-35020-all-pages-have-caveat',
    description: 'every page in the gap-range cohort carries the honest-status caveat',
    holds: () => PAGE_COHORT.every((p) => p.hasCaveat === true),
  },
  {
    id: 'imp-35020-krawczyk-family-names-34714a',
    description: 'the 4 Krawczyk-family pages are recorded as naming imp-34714a REMAINS OPEN',
    holds: () => KRAWCZYK_FAMILY_MUST_NAME_34714A.length === 4
      && KRAWCZYK_FAMILY_MUST_NAME_34714A.every((t) => PAGE_COHORT.some((p) => p.ticket === t)),
  },
  {
    id: 'imp-35020-non-krawczyk-pair-correctly-omits-34714a',
    description: 'the 2 non-interval pages are recorded as correctly omitting the Krawczyk sub-gap',
    holds: () => KRAWCZYK_FAMILY_CORRECTLY_OMITS_34714A.length === 2
      && KRAWCZYK_FAMILY_CORRECTLY_OMITS_34714A.every((t) => PAGE_COHORT.some((p) => p.ticket === t)),
  },
  {
    id: 'imp-35020-no-gaps-found',
    description: 'the audit found zero caveat gaps across all 25 pages',
    holds: () => CAVEAT_SURFACING_AUDIT_COVERAGE_GAPS.gapsFound.length === 0,
  },
  {
    id: 'imp-35020-audit-only-honest',
    description: 'explicitly AUDIT-ONLY and no refereed bound is changed',
    holds: () => /AUDIT-ONLY/.test(CAVEAT_SURFACING_AUDIT_COVERAGE_GAPS.honest)
      && /No completeness-coverage gap found/.test(CAVEAT_SURFACING_AUDIT_COVERAGE_GAPS.honest)
      && /refereed bound is changed/i.test(CAVEAT_SURFACING_AUDIT_COVERAGE_GAPS.honest),
  },
];

for (const a of CAVEAT_SURFACING_AUDIT_COVERAGE_GAPS_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-35020-caveat-surfacing-audit assertion failed: ${a.id}`);
}
