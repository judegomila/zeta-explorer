// imp-95605: independent verification of the imp-95519 sec 3(b) unconditional
// zero-free-region accounting.
//
// imp-95519-localized-barrier-sum-prime-zero-nogo asserts that across the window
// heights T in [3.0e12, 1.9e16] the OPERATIVE (wider = stronger) unconditional
// zero-free region is the classical Mossinghoff-Trudgian-Yang one,
//     1 - beta >= 1 / (5.558691 log t),
// giving 1 - beta = 6.26e-3 (bottom) / 4.80e-3 (top), while the Ford
// Vinogradov-Korobov region 1 / (57.54 (log t)^{2/3} (loglog t)^{1/3}) is WEAKER
// throughout, overtaking the classical one only for log t > ~1.03e4 (t > e^{10000}).
// The per-zero factor u^{-(1-beta)} is then 0.845 / 0.843 -- no unconditional
// saving. This module recomputes all of those quantities from scratch (a fully
// independent second implementation) and records the match.
//
// Numerical verification only; changes no bound; NO QED; no refereed bound is changed
//  (imp-3463 lineage).

const ln = Math.log;

// Window endpoints. Bottom = the zeta verified height x0 = X + 1 ~ 3.0e12
// (Platt-Trudgian), top ~ 1.9e16 (imp-95519 upper window height).
const T_LO = 3.0e12;
const T_HI = 1.9e16;

// Classical Mossinghoff-Trudgian-Yang width and Ford Vinogradov-Korobov width.
const classicalWidth = (t) => 1 / (5.558691 * ln(t));
const vkWidth = (t) =>
  1 / (57.54 * Math.pow(ln(t), 2 / 3) * Math.pow(ln(ln(t)), 1 / 3));

// Per-zero factor u^{-(1-beta)} = exp(-(1-beta) log u). Using u = t (the packet
// width is strictly below the height, so u = t is a conservative UPPER bound on u
// and hence a LOWER bound on the per-zero factor -- the most-saving case). The
// imp-95519 module uses the actual stationary packet width u = stationaryV(N)
// (log u ~ 0.936 / 0.949 of log t), which lands the factor at 0.845 / 0.843; the
// u = t floor 0.8354 shows the saving stays inert even in the most favorable case.
const perZeroFactorFloor = (t) => Math.exp(-classicalWidth(t) * ln(t));

// Crossover log t at which the VK width overtakes the classical width, from
//   1 / (57.54 L^{2/3} (ln L)^{1/3}) = 1 / (5.558691 L).
function vkCrossoverLogT() {
  const g = (L) =>
    1 / (57.54 * Math.pow(L, 2 / 3) * Math.pow(ln(L), 1 / 3)) -
    1 / (5.558691 * L);
  let lo = 100;
  let hi = 1e6;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (g(mid) < 0) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

const logTlo = ln(T_LO); // 28.7296
const logThi = ln(T_HI); // 37.4832
const clLo = classicalWidth(T_LO); // 6.262e-3
const clHi = classicalWidth(T_HI); // 4.799e-3
const vkLo = vkWidth(T_LO); // 1.237e-3
const vkHi = vkWidth(T_HI); // 1.010e-3
const crossoverLogT = vkCrossoverLogT(); // ~1.0242e4

export const IMP_95605_ZERO_FREE_VERIFY = {
  id: 'imp-95605-zero-free-region-verify',
  verifies: 'imp-95519-localized-barrier-sum-prime-zero-nogo',
  section: 'sec 3(b)',
  windowHeights: { T_LO, T_HI, logTlo, logThi },
  classical: { lo: clLo, hi: clHi },
  vk: { lo: vkLo, hi: vkHi },
  // classical / VK width ratio: how much wider (= stronger) the classical region is.
  classicalOverVkRatio: { lo: clLo / vkLo, hi: clHi / vkHi }, // 5.06x / 4.75x
  vkWiderThanClassicalAtWindow: vkLo > clLo || vkHi > clHi, // false: classical wins throughout
  perZeroFactorFloor: { lo: perZeroFactorFloor(T_LO), hi: perZeroFactorFloor(T_HI) }, // 0.8354 both
  crossoverLogT, // ~1.0242e4 = t ~ e^{10000}
  crossoverOverWindowTop: crossoverLogT / logThi, // ~273x above the window top
  verdict:
    'CONFIRMED. Independent recomputation reproduces every imp-95519 sec 3(b) figure: '
    + 'log t in [28.73, 37.48]; classical 1-beta = 6.262e-3 (bottom) / 4.799e-3 (top) '
    + '(matches 6.26e-3 / 4.80e-3); the Ford VK width is smaller (weaker) at BOTH ends '
    + '(classical is 5.06x / 4.75x wider), overtaking the classical width only at '
    + 'log t ~ 1.0242e4 (t ~ e^{10000}), ~273x above the window top; the per-zero factor '
    + 'floor (u = t, most-saving case) is 0.8354, consistent with the module 0.845 / 0.843 '
    + 'for the actual stationary packet width u < t. The "no unconditional saving" '
    + 'conclusion holds. Numerical verification only; changes no bound; NO QED; '
    + 'no refereed bound is changed.',
  // self-check: recomputed values match the imp-95519 quoted figures within tolerance
  holds: () =>
    Math.abs(clLo / 6.262e-3 - 1) < 2e-3 &&
    Math.abs(clHi / 4.800e-3 - 1) < 2e-3 &&
    vkLo < clLo &&
    vkHi < clHi &&
    Math.abs(clLo / vkLo - 5.06) < 0.05 &&
    Math.abs(clHi / vkHi - 4.75) < 0.05 &&
    Math.abs(perZeroFactorFloor(T_LO) - 0.8354) < 1e-3 &&
    crossoverLogT > 1.0e4 &&
    crossoverLogT < 1.1e4 &&
    Math.abs(crossoverLogT / logThi - 273.2) < 2,
};

export default IMP_95605_ZERO_FREE_VERIFY;
