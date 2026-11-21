// imp-95706: survey of published post-Ford Vinogradov-Korobov zero-free-region
// constants, and a re-run of the imp-95694 / imp-95632 VK-vs-classical
// zero-free-width crossover at the best published constant pair.
//
// imp-95694 tested the crossover for robustness in the ratio A/B only, using the
// Ford 2002 canonical VK constant A = 57.54 as the SOLE VK band member plus a
// deliberately generous, admittedly-unpublished stress floor 30. This module
// closes that provenance gap: it records the best published post-Ford VK constant
// located in the literature and re-runs crossoverLogT(A, B) at that honest pair.
//
// STRUCTURAL REDUCTION (inherited from imp-95694). The crossover L (= log t) is
// where the Ford VK width 1 / (A L^{2/3} (ln L)^{1/3}) equals the classical width
// 1 / (B L), i.e. (A/B)^3 ln L = L, i.e. L / ln L = (A/B)^3. The crossover depends
// on the two constants ONLY through the ratio A/B (cubed). The threshold ratio that
// would place the crossover exactly at the imp-95519 window top log t = 37.4832 is
// (A/B)_top = ( logThi / ln logThi )^{1/3} = 2.1788, versus the canonical Ford/MTY
// ratio 10.351. A ~4.75x reduction in A (to ~12.1 at fixed MTY B) is required.
//
// SURVEY (report only).
//   VK side. Ford (2002) A = 57.54 is the long-standing canonical constant. The best
//   published POST-Ford Vinogradov-Korobov zero-free-region constant located is
//   Bellotti (2024, arXiv:2306.13574, "Explicit bounds for the Riemann zeta function
//   and a new zero-free region"), A ~= 55.241 -- a ~1.042x improvement over Ford. No
//   published VK constant approaches the ~4.75x needed; every published value sits
//   well ABOVE the imp-95694 stress floor 30.
//   Classical side. The widest published classical (log t) zero-free region remains
//   Mossinghoff-Trudgian-Yang R = 5.558691 (smallest R = widest region); the older
//   Mossinghoff-Trudgian 2015 value 5.573412 is a slightly NARROWER (weaker) region,
//   not a larger honest width. No published classical update yields a larger effective
//   B, so the classical lever does not move the ratio favorably.
//
// RE-RUN. crossoverLogT(55.241, 5.558691) = 8928.20 (vs Ford 10242.24), still ~238x
// the window top and ~3861 decades of T above it. Even an aggressive published bound
// A = 53 (below any VK constant this author is aware of in print) gives 7763.99,
// ~207x the window top. The whole published survey is BRACKETED by the imp-95694
// already-tested envelope: at fixed MTY B the stress floor A = 30 -> 1101.01 and Ford
// 57.54 -> 10242.24 (the imp-95694 most-favorable A=30,B=10 corner drops even lower to
// ~131.8), so the best published constant does NOT move the crossover toward the
// window top.
//
// Because exp(crossover) overflows IEEE-754 double, all height factors are carried in
// log space. Measurement / literature survey only; the operative region stays
// classical throughout the imp-95519 window; changes no bound; NO QED; no refereed bound is changed
//  (imp-3463 lineage).

const ln = Math.log;
const LN10 = Math.LN10;

// imp-95519 window top (imp-95632 windowTop.logT).
const T_HI = 1.9e16;
const WINDOW_TOP_LOG_T = ln(T_HI); // 37.4832

// Crossover L = log t solving L / ln L = (A/B)^3; monotone bisection (identical to
// the imp-95694 / imp-95632 solver, reproducing the Ford canonical 10242.2363).
function crossoverLogT(A, B) {
  const R = Math.pow(A / B, 3);
  let lo = Math.E + 1e-9;
  let hi = 1e12;
  for (let i = 0; i < 300; i++) {
    const mid = 0.5 * (lo + hi);
    if (mid / ln(mid) < R) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// Ratio A/B that would place the crossover exactly at the window top.
const RATIO_TO_WINDOW_TOP = Math.pow(WINDOW_TOP_LOG_T / ln(WINDOW_TOP_LOG_T), 1 / 3); // 2.1788

// Best published classical constant (widest region = smallest R).
const B_MTY = 5.558691;

// Surveyed VK constants (report only). improvementOverFord = 57.54 / A.
const FORD = 57.54;
const survey = [
  { vk: 'ford_2002', A: FORD, provenance: 'Ford 2002 canonical VK constant', published: true },
  {
    vk: 'bellotti_2024',
    A: 55.241,
    provenance: 'Bellotti 2024 (arXiv:2306.13574), best located post-Ford published VK constant',
    published: true,
  },
  {
    vk: 'aggressive_published_bound',
    A: 53,
    provenance: 'stress value below any VK constant known to be in print (still >> stress floor 30)',
    published: false,
  },
].map((row) => {
  const L = crossoverLogT(row.A, B_MTY);
  return {
    ...row,
    B: B_MTY,
    ratio: row.A / B_MTY,
    crossoverLogT: L,
    ratioToWindowTop: L / WINDOW_TOP_LOG_T,
    gapDecadesT: (L - WINDOW_TOP_LOG_T) / LN10,
    improvementOverFord: FORD / row.A,
  };
});

const fordRow = survey.find((r) => r.vk === 'ford_2002');
const bestPublishedRow = survey.find((r) => r.vk === 'bellotti_2024');
const stressFloorCrossover = crossoverLogT(30, B_MTY); // imp-95694 stress floor A = 30 at fixed MTY B -> 1101.01

export const IMP_95706_VK_CROSSOVER_BEST_PUBLISHED_CONSTANT = {
  id: 'imp-95706-vk-crossover-best-published-constant',
  measures: 'imp-95694-vk-crossover-constant-sensitivity',
  buildsOn: ['imp-95632-vk-crossover-height-gap', 'imp-95519-localized-barrier-sum-prime-zero-nogo'],
  section: 'sec 3(b)',
  structuralRelation: 'crossover L (= log t) solves L / ln L = (A/B)^3; the survey moves only A',
  windowTopLogT: WINDOW_TOP_LOG_T, // 37.4832
  ratioToPlaceCrossoverAtWindowTop: RATIO_TO_WINDOW_TOP, // 2.1788
  bestClassicalB: B_MTY, // MTY 5.558691, widest published classical region; no larger honest B
  survey,
  fordCrossoverLogT: fordRow.crossoverLogT, // 10242.2363
  bestPublished: bestPublishedRow, // Bellotti 2024 ~55.241 -> crossover 8928.20, ~238x window top
  // imp-95694 already-tested envelope brackets every published VK constant.
  imp95694StressFloorCrossover: stressFloorCrossover, // ~1101.01 (A = 30 at fixed MTY B); the A=30,B=10 corner is even lower (~131.8)
  bracketedByImp95694Envelope:
    bestPublishedRow.A > 30 &&
    bestPublishedRow.crossoverLogT < fordRow.crossoverLogT &&
    bestPublishedRow.crossoverLogT > stressFloorCrossover,
  robust: bestPublishedRow.ratioToWindowTop > 3,
  verdict:
    'The best published post-Ford Vinogradov-Korobov zero-free-region constant located '
    + 'is Bellotti 2024 (arXiv:2306.13574), A ~= 55.241 -- a ~1.042x improvement over Ford '
    + '57.54. The widest published classical region stays MTY R = 5.558691 (no larger honest '
    + 'B). Re-running the imp-95632 crossover at this best published pair gives log t = 8928.20 '
    + '(vs Ford 10242.24), still ~238x the imp-95519 window top log t = 37.48 and ~3861 decades '
    + 'of T above it; an aggressive below-print bound A = 53 gives 7763.99 (~207x). Every '
    + 'published VK constant exceeds the imp-95694 stress floor 30, so the whole published '
    + 'survey is BRACKETED by the imp-95694 already-tested envelope (stress floor A = 30 -> '
    + '1101.01 at MTY B, Ford 57.54 -> 10242.24). An honest published constant does NOT move the crossover toward the '
    + 'window top; reaching it still needs the unmatched ~4.75x reduction (A -> ~12.1). The '
    + 'conclusion is insensitive to the exact digit of the newest constant because any published '
    + 'A >= 30 keeps the crossover >> the window top. The imp-95632 zero-VK-saving verdict '
    + 'STANDS under the best published constants. Survey / measurement only; changes no bound; '
    + 'NO QED; no refereed bound is changed.',
  holds: () =>
    Math.abs(fordRow.crossoverLogT - 10242.2363) < 1e-2 &&
    Math.abs(WINDOW_TOP_LOG_T - 37.4832) < 1e-3 &&
    Math.abs(RATIO_TO_WINDOW_TOP - 2.1788) < 1e-3 &&
    // best published (Bellotti) crossover and its provenance direction:
    Math.abs(bestPublishedRow.crossoverLogT - 8928.20) < 0.1 &&
    Math.abs(bestPublishedRow.improvementOverFord - 1.0416) < 1e-3 &&
    bestPublishedRow.crossoverLogT < fordRow.crossoverLogT &&
    bestPublishedRow.ratioToWindowTop > 200 &&
    // aggressive below-print bound still far above the window top:
    Math.abs(survey[2].crossoverLogT - 7763.9864) < 0.1 &&
    survey[2].ratioToWindowTop > 200 &&
    // bracketing by the imp-95694 stress envelope:
    Math.abs(stressFloorCrossover - 1101.01) < 0.5 &&
    IMP_95706_VK_CROSSOVER_BEST_PUBLISHED_CONSTANT.bracketedByImp95694Envelope === true &&
    IMP_95706_VK_CROSSOVER_BEST_PUBLISHED_CONSTANT.robust === true,
};

export const IMP_95706_VK_CROSSOVER_BEST_PUBLISHED_CONSTANT_ASSERTIONS = [
  {
    name: 'VK crossover best-published-constant survey self-check holds',
    holds: () => IMP_95706_VK_CROSSOVER_BEST_PUBLISHED_CONSTANT.holds(),
  },
];

for (const a of IMP_95706_VK_CROSSOVER_BEST_PUBLISHED_CONSTANT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95706-vk-crossover-best-published-constant assertion failed: ${a.name}`);
  }
}

export default IMP_95706_VK_CROSSOVER_BEST_PUBLISHED_CONSTANT;
