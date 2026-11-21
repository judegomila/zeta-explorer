// imp-95694: sensitivity of the imp-95632 VK-vs-classical zero-free-width
// crossover (log t = 10242.24) to the provenance of the two zero-free-region
// constants -- the Ford Vinogradov-Korobov constant 57.54 and the
// Mossinghoff-Trudgian-Yang classical constant 5.558691.
//
// imp-95632 reported the crossover for the single pair (57.54, 5.558691). This
// module tests whether that zero-VK-saving verdict is an artifact of those exact
// values, or is robust to the honest literature bands on both constants.
//
// STRUCTURAL REDUCTION. The crossover L (= log t) is where the Ford VK width
// 1 / (A L^{2/3} (ln L)^{1/3}) equals the classical width 1 / (B L), i.e.
//     A L^{2/3} (ln L)^{1/3} = B L
//   =>  (A/B)^3 ln L = L
//   =>  L / ln L = (A/B)^3.
// So the crossover depends on the two constants ONLY through the single ratio
// A/B (cubed). Provenance sensitivity therefore collapses to one variable: how
// far can A/B move under honest constant bands, and does any admissible A/B drop
// the crossover to the imp-95519 window top log t = 37.4832?
//
// The threshold ratio that would place the crossover exactly at the window top is
//     (A/B)_top = ( logThi / ln logThi )^{1/3} = 2.1788,
// versus the canonical A/B = 57.54 / 5.558691 = 10.351. The canonical ratio must
// fall by a factor ~4.75 to reach the window top.
//
// HONEST BANDS + STRESS ENVELOPE. Classical band: the MTY R = 5.558691 update and
// the Mossinghoff-Trudgian 2015 value 5.573412 (they barely differ). VK band:
// Ford 2002 canonical 57.54. To make the test bulletproof we ALSO drive each
// constant to a deliberately generous stress bound BEYOND anything published --
// VK floor 30 (a ~1.9x improvement over Ford, better than any published VK
// constant) and classical ceiling 10 (~1.8x worse than MTY) -- and confirm the
// crossover still sits far above the window top even at that most-favorable
// corner.
//
// Because exp(crossover) overflows IEEE-754 double, all height factors are carried
// in log space (log t and decades of T).
//
// Measurement only; the operative region stays classical throughout the window
// with the inert per-zero factor ~0.845; changes no bound; NO QED; no refereed bound is changed
//  (imp-3463 lineage).

const ln = Math.log;
const LN10 = Math.LN10;

// imp-95519 window top (imp-95632 windowTop.logT).
const T_HI = 1.9e16;
const WINDOW_TOP_LOG_T = ln(T_HI); // 37.4832

// Crossover L = log t solving L / ln L = (A/B)^3 (Ford VK width = classical width),
// reproducing the imp-95632 canonical crossover 10242.2363 for (57.54, 5.558691).
// L / ln L is increasing for L > e, so a monotone bisection is exact.
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

// Constant bands.
const VK = { fordCanonical: 57.54, stressFloor: 30 }; // stressFloor: below any published VK constant
const CLASSICAL = { MTY_2024: 5.558691, MT_2015: 5.573412, stressCeil: 10 }; // stressCeil: above any published classical constant

// Canonical crossover (must match imp-95632).
const CANONICAL_CROSSOVER = crossoverLogT(VK.fordCanonical, CLASSICAL.MTY_2024); // 10242.2363
const CANONICAL_RATIO = VK.fordCanonical / CLASSICAL.MTY_2024; // 10.351

// Full grid over the bands; record the SMALLEST crossover (most favorable to VK).
const grid = [];
let minCrossover = Infinity;
let minCorner = null;
for (const [vkName, A] of Object.entries(VK)) {
  for (const [clName, B] of Object.entries(CLASSICAL)) {
    const L = crossoverLogT(A, B);
    const gapLogT = L - WINDOW_TOP_LOG_T;
    const cell = {
      vk: vkName,
      A,
      classical: clName,
      B,
      ratio: A / B,
      crossoverLogT: L,
      gapLogT,
      gapDecadesT: gapLogT / LN10,
      ratioToWindowTop: L / WINDOW_TOP_LOG_T, // how many times higher (in log t) than the window top
    };
    grid.push(cell);
    if (L < minCrossover) {
      minCrossover = L;
      minCorner = cell;
    }
  }
}

// VK constant that WOULD be needed to reach the window top, given each classical B,
// and the improvement factor over Ford 57.54 that this represents.
const requiredVK = Object.fromEntries(
  Object.entries(CLASSICAL).map(([clName, B]) => {
    const A_req = RATIO_TO_WINDOW_TOP * B;
    return [clName, { B, A_required: A_req, improvementOverFord: VK.fordCanonical / A_req }];
  })
);

export const IMP_95694_VK_CROSSOVER_CONSTANT_SENSITIVITY = {
  id: 'imp-95694-vk-crossover-constant-sensitivity',
  measures: 'imp-95632-vk-crossover-height-gap',
  buildsOn: ['imp-95605-zero-free-region-verify', 'imp-95519-localized-barrier-sum-prime-zero-nogo'],
  section: 'sec 3(b)',
  // The crossover depends on the two constants only through A/B (cubed).
  structuralRelation: 'crossover L (= log t) solves L / ln L = (A/B)^3; sensitivity collapses to the single ratio A/B',
  windowTopLogT: WINDOW_TOP_LOG_T, // 37.4832
  ratioToPlaceCrossoverAtWindowTop: RATIO_TO_WINDOW_TOP, // 2.1788
  canonical: { A: VK.fordCanonical, B: CLASSICAL.MTY_2024, ratio: CANONICAL_RATIO, crossoverLogT: CANONICAL_CROSSOVER }, // 10242.2363
  bands: { VK, CLASSICAL },
  grid,
  // Most favorable corner: aggressive VK floor 30 with inflated classical ceiling 10.
  mostFavorableCorner: minCorner, // A/B = 3.0, crossover log t ~ 131.79, still ~3.5x the window top
  requiredVK, // to hit the window top, VK constant must fall to ~12.1 (MTY) -- a ~4.75x improvement over Ford
  robust: minCrossover > 3 * WINDOW_TOP_LOG_T, // even the most-favorable-corner crossover stays >3x the window top in log t
  verdict:
    'The crossover depends on the two zero-free-region constants ONLY through the '
    + 'ratio A/B (via L / ln L = (A/B)^3), so provenance sensitivity is one-dimensional. '
    + 'The canonical A/B = 10.351 must fall to 2.1788 (a ~4.75x reduction) to bring the '
    + 'crossover down to the imp-95519 window top log t = 37.48. Across the honest bands '
    + '(Ford VK 57.54; MTY 5.558691 / MT 5.573412 classical), and even at a deliberately '
    + 'generous BEYOND-literature stress corner (VK floor 30, classical ceiling 10, '
    + 'A/B = 3.0), the crossover stays at log t ~ 131.8 -- ~3.5x above the window top and '
    + '~41 decades of T away. To reach the window top the VK constant would have to fall '
    + 'to ~12.1 (with MTY classical), a ~4.75x improvement over Ford that no admissible '
    + 'constant achieves. The imp-95632 zero-VK-saving verdict is ROBUST to constant '
    + 'provenance, not an artifact of the 57.54 / 5.558691 pair. Measurement only; '
    + 'changes no bound; NO QED; no refereed bound is changed.',
  // self-check (log-space; the raw exp(crossover) factors are not representable):
  holds: () =>
    Math.abs(CANONICAL_CROSSOVER - 10242.2363) < 1e-2 &&
    Math.abs(WINDOW_TOP_LOG_T - 37.4832) < 1e-3 &&
    Math.abs(RATIO_TO_WINDOW_TOP - 2.1788) < 1e-3 &&
    Math.abs(CANONICAL_RATIO - 10.351) < 1e-2 &&
    // most-favorable stress corner still far above the window top:
    minCorner.vk === 'stressFloor' &&
    minCorner.classical === 'stressCeil' &&
    Math.abs(minCrossover - 131.79) < 0.5 &&
    minCorner.ratioToWindowTop > 3 &&
    // required VK to reach the window top, and its improvement factor over Ford:
    Math.abs(requiredVK.MTY_2024.A_required - 12.111) < 1e-2 &&
    Math.abs(requiredVK.MTY_2024.improvementOverFord - 4.75) < 0.05 &&
    requiredVK.stressCeil.improvementOverFord > 2.6 &&
    // robustness flag:
    IMP_95694_VK_CROSSOVER_CONSTANT_SENSITIVITY.robust === true,
};

export const IMP_95694_VK_CROSSOVER_CONSTANT_SENSITIVITY_ASSERTIONS = [
  {
    name: 'VK crossover constant-sensitivity self-check holds',
    holds: () => IMP_95694_VK_CROSSOVER_CONSTANT_SENSITIVITY.holds(),
  },
];

for (const a of IMP_95694_VK_CROSSOVER_CONSTANT_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95694-vk-crossover-constant-sensitivity assertion failed: ${a.name}`);
  }
}

export default IMP_95694_VK_CROSSOVER_CONSTANT_SENSITIVITY;
