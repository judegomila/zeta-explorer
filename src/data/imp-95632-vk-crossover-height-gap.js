// imp-95632: quantify the height gap between the imp-95519 barrier window top
// (T = 1.9e16, log t ~ 37.48) and the Ford Vinogradov-Korobov zero-free-region
// crossover (log t ~ 1.0242e4), to make concrete that VK offers zero
// unconditional saving anywhere in the window.
//
// imp-95605-zero-free-region-verify / imp-95619-vk-crossover-reconcile establish
// that the Ford VK width 1 / (57.54 (log t)^{2/3} (loglog t)^{1/3}) overtakes the
// classical Mossinghoff-Trudgian-Yang width 1 / (5.558691 log t) only at the
// canonical crossover log t = 10242.2363 = 1.02422e4, while the imp-95519 window
// tops out at T = 1.9e16 (log t = logThi = 37.4832). Neither module states the
// (enormous) separation between them. This module computes it explicitly, in both
// the natural-log height variable log t and in decades of T (orders of magnitude).
//
// Because exp(10242) overflows IEEE-754 double, every "factor" quantity is carried
// in log space: the multiplicative height gap exp(crossoverLogT) / T_HI is
// reported as its base-10 logarithm (decades) plus a normalized mantissa x 10^exp.
//
// Measurement only; the operative region stays classical throughout the window
// with the inert per-zero factor ~0.845; changes no bound; NO QED; no refereed bound is changed
//  (imp-3463 lineage).

const ln = Math.log;
const LN10 = Math.LN10; // 2.302585092994046

// Window top (imp-95519 upper window height) and its natural log.
const T_HI = 1.9e16;
const WINDOW_TOP_LOG_T = ln(T_HI); // 37.48317...

// imp-95678 reconciliation: the T_HI = 1.9e16 used here (and in imp-95605 /
// imp-95619) is a round number; the TRUE window top follows from the imp-95519
// RS-index map T = x_N / 2, x_N = 4 pi N^2 - T0/16 at N_HI = 54799999. That gives
// T_TRUE = 1.886866e16 (log t = 37.476279), i.e. T_HI overstates the top by
// ~0.696%. imp-95519 itself already rounds this the OTHER way (its header says
// 1.89e16), so the two modules agree to the digit; only the 1.9e16 round-up
// differs. Propagated through the gap: delta(log t) = +0.006937, so GAP_LOG_T
// runs 10204.7530 -> 10204.7600 and GAP_DECADES_T 4431.8680 -> 4431.8710. Neither
// moves GAP_LOG_T (10204.75) nor GAP_DECADES_T (4431.87) at any of their stated
// significant digits; the crossover-height verdict is unchanged. Reconciliation
// only; changes no bound; NO QED.
const N_HI = 54799999;
const T0 = 24727519 / 200000000; // 0.123637595 (imp-95519 xOfN offset t0/16)
const T_TRUE = (4 * Math.PI * N_HI * N_HI - T0 / 16) / 2; // 1.886866e16
const WINDOW_TOP_OVERSTATE_PCT = (T_HI - T_TRUE) / T_TRUE * 100; // ~0.696%
const WINDOW_TOP_LOG_T_TRUE = ln(T_TRUE); // 37.476279

// Canonical VK-vs-classical crossover, recomputed here by the same bisection used
// in imp-95605 / imp-95519 / imp-95619 (all agree at 10242.2363).
function crossoverLogTBisection() {
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

const CROSSOVER_LOG_T = crossoverLogTBisection(); // 10242.2363

// Additive gap in the natural-log height variable log t.
const GAP_LOG_T = CROSSOVER_LOG_T - WINDOW_TOP_LOG_T; // 10204.75

// Multiplicative height gap in decades of T:
//   log10( exp(crossoverLogT) / T_HI ) = (crossoverLogT - logThi) / ln 10.
const GAP_DECADES_T = GAP_LOG_T / LN10; // 4431.87

// The factor exp(crossoverLogT) / T_HI itself overflows a double, so normalize to
// mantissa x 10^exponent from GAP_DECADES_T = exponent + frac.
const GAP_EXPONENT = Math.floor(GAP_DECADES_T); // 4431
const GAP_MANTISSA = Math.pow(10, GAP_DECADES_T - GAP_EXPONENT); // ~7.4

// Also express the crossover height T_cross = exp(crossoverLogT) in decades for
// context (again overflow-safe): log10 T_cross = crossoverLogT / ln 10.
const CROSSOVER_LOG10_T = CROSSOVER_LOG_T / LN10; // 4448.15
const WINDOW_TOP_LOG10_T = WINDOW_TOP_LOG_T / LN10; // 16.28

export const IMP_95632_VK_CROSSOVER_HEIGHT_GAP = {
  id: 'imp-95632-vk-crossover-height-gap',
  measures: 'imp-95519-localized-barrier-sum-prime-zero-nogo',
  buildsOn: ['imp-95605-zero-free-region-verify', 'imp-95619-vk-crossover-reconcile'],
  section: 'sec 3(b)',
  windowTop: { T_HI, logT: WINDOW_TOP_LOG_T, log10T: WINDOW_TOP_LOG10_T }, // 37.48 / 16.28
  crossover: { logT: CROSSOVER_LOG_T, log10T: CROSSOVER_LOG10_T }, // 10242.24 / 4448.15
  // Additive gap in log t and multiplicative gap in decades of T.
  gapLogT: GAP_LOG_T, // 10204.75 in the natural-log height variable
  gapDecadesT: GAP_DECADES_T, // 4431.87 orders of magnitude in T
  // imp-95678: true window top from the imp-95519 RS-index map vs the 1.9e16 round-up.
  windowTopReconciliation: {
    T_true: T_TRUE, // 1.886866e16 = (4 pi N_HI^2 - T0/16)/2 at N_HI = 54799999
    logT_true: WINDOW_TOP_LOG_T_TRUE, // 37.476279
    overstatePct: WINDOW_TOP_OVERSTATE_PCT, // ~0.696% (1.9e16 above the true 1.886866e16)
    gapLogT_true: CROSSOVER_LOG_T - WINDOW_TOP_LOG_T_TRUE, // 10204.7600 vs 10204.7530
    gapDecadesT_true: (CROSSOVER_LOG_T - WINDOW_TOP_LOG_T_TRUE) / LN10, // 4431.8710 vs 4431.8680
    movesGapLogT: false, // 10204.75 unchanged at stated precision
    movesGapDecadesT: false, // 4431.87 unchanged at stated precision
    note:
      'T_HI = 1.9e16 rounds the true window top 1.886866e16 up by ~0.696%; imp-95519 '
      + 'header rounds the same value to 1.89e16, so the modules agree to the digit. The '
      + '0.696% shift moves log t by +0.006937 (GAP_LOG_T 10204.7530 -> 10204.7600, '
      + 'GAP_DECADES_T 4431.8680 -> 4431.8710), which changes neither reported gap at any '
      + 'stated significant digit. Reconciliation only; NO QED.',
  },
  // The height-ratio factor exp(crossoverLogT)/T_HI = mantissa x 10^exponent
  // (carried in log space; the raw factor overflows a double).
  gapFactor: { mantissa: GAP_MANTISSA, exponent: GAP_EXPONENT }, // ~7.4e4431
  crossoverAboveWindowTopRatioLogT: CROSSOVER_LOG_T / WINDOW_TOP_LOG_T, // ~273x in log t
  verdict:
    'The Ford VK crossover sits ~4432 orders of magnitude in T (a factor '
    + '~7.4 x 10^4431) above the imp-95519 window top T = 1.9e16. In the natural-log '
    + 'height variable the gap is log t = 10204.75 (crossover 10242.24 vs window top '
    + '37.48, i.e. the crossover is ~273x higher in log t). VK therefore overtakes the '
    + 'classical MTY zero-free region only at a height utterly beyond any point of the '
    + 'window, so it offers ZERO unconditional saving anywhere the barrier operates -- '
    + 'the region stays classical with the inert per-zero factor ~0.845. Measurement '
    + 'only; changes no bound; NO QED; no refereed bound is changed.',
  // self-check (log-space; the raw exp(10242) factor is not representable):
  //   gap in log t ~ 10204.75, gap in decades ~ 4431.87, normalized factor ~7.4e4431.
  holds: () =>
    Math.abs(CROSSOVER_LOG_T - 10242.2363) < 1e-2 &&
    Math.abs(WINDOW_TOP_LOG_T - 37.4832) < 1e-3 &&
    Math.abs(GAP_LOG_T - 10204.75) < 1e-1 &&
    Math.abs(GAP_DECADES_T - 4431.87) < 1e-1 &&
    GAP_EXPONENT === 4431 &&
    Math.abs(GAP_MANTISSA - 7.43) < 0.1 &&
    Math.abs(CROSSOVER_LOG_T / WINDOW_TOP_LOG_T - 273.2) < 1,
};

export const IMP_95632_VK_CROSSOVER_HEIGHT_GAP_ASSERTIONS = [
  {
    name: 'height-gap self-check holds',
    holds: () => IMP_95632_VK_CROSSOVER_HEIGHT_GAP.holds(),
  },
];

for (const a of IMP_95632_VK_CROSSOVER_HEIGHT_GAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95632-vk-crossover-height-gap assertion failed: ${a.name}`);
  }
}

export default IMP_95632_VK_CROSSOVER_HEIGHT_GAP;
