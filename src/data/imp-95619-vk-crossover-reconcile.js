// imp-95619: reconcile the two quoted figures for the Ford Vinogradov-Korobov
// vs classical Mossinghoff-Trudgian-Yang zero-free-region crossover height.
//
// imp-95605-zero-free-region-verify recomputes the log t at which the Ford VK
// width 1 / (57.54 (log t)^{2/3} (loglog t)^{1/3}) overtakes the classical MTY
// width 1 / (5.558691 log t), landing at crossoverLogT ~ 1.0242e4. The
// imp-95519-localized-barrier-sum-prime-zero-nogo sec 3(b) PROSE (and its own
// line-350 comment) instead glosses the crossover as "log t > ~1.03e4
// (t > e^{10000})". This module recomputes the crossover to high precision by a
// second, closed-form route and decides which figure is exact.
//
// Finding: the two figures are NOT a convention difference. Both modules use the
// IDENTICAL formula and the IDENTICAL constants (57.54, 5.558691), and both
// bisect the same g(L); imp-95519 itself computes VK_CROSSOVER_LOGT = 10242.24
// internally, then rounds it imprecisely to "1.03e4" in prose. The exact value
// is log t = 10242.2363, i.e. 1.02422e4. Rounded to 3 significant figures this
// is 1.02e4, NOT 1.03e4, so "1.03e4" overstates the crossover by ~0.56 percent.
// The round-number companion statement "t > e^{10000}" stays directionally
// correct (10242.24 > 10000). Downstream consumers should cite 1.0242e4.
//
// Accuracy audit only; the operative unconditional region stays the classical
// MTY one across the whole imp-95519 window (log t in [28.73, 37.48]); changes
// no bound; NO QED; no refereed bound is changed (imp-3463 lineage).

const ln = Math.log;

// Closed-form reduction of 1/(57.54 L^{2/3} (ln L)^{1/3}) = 1/(5.558691 L):
//   5.558691 L = 57.54 L^{2/3} (ln L)^{1/3}
//   5.558691 L^{1/3} = 57.54 (ln L)^{1/3}
//   (5.558691)^3 L = (57.54)^3 ln L
//   L / ln L = (57.54 / 5.558691)^3 =: RATIO.
// Solve L / ln L = RATIO by Newton on h(L) = L / ln L - RATIO.
const RATIO = Math.pow(57.54 / 5.558691, 3); // 1109.1543...

function crossoverLogTClosedForm() {
  // h(L) = L / ln L - RATIO;  h'(L) = (ln L - 1) / (ln L)^2.
  let L = 1.0e4; // seed near the known root
  for (let i = 0; i < 100; i++) {
    const lnL = ln(L);
    const h = L / lnL - RATIO;
    const hp = (lnL - 1) / (lnL * lnL);
    const step = h / hp;
    L -= step;
    if (Math.abs(step) < 1e-9) break;
  }
  return L;
}

// Independent bisection route (same as imp-95605 / imp-95519), for cross-check.
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

const CROSSOVER_LOG_T = crossoverLogTBisection(); // 10242.236273478593
const CROSSOVER_LOG_T_NEWTON = crossoverLogTClosedForm(); // agrees to < 1e-6

// The two quoted figures under audit.
const IMP_95605_FIGURE = 1.0242e4; // imp-95605 module figure
const IMP_95519_PROSE_FIGURE = 1.03e4; // imp-95519 sec 3(b) prose / line-350 gloss

export const IMP_95619_VK_CROSSOVER_RECONCILE = {
  id: 'imp-95619-vk-crossover-reconcile',
  reconciles: ['imp-95605-zero-free-region-verify', 'imp-95519-localized-barrier-sum-prime-zero-nogo'],
  section: 'sec 3(b)',
  formula: 'crossover: 1 / (57.54 (log t)^{2/3} (loglog t)^{1/3}) = 1 / (5.558691 log t)',
  ratioLoverLnL: RATIO, // (57.54/5.558691)^3 = 1109.1543
  crossoverLogT: CROSSOVER_LOG_T, // 10242.2363 = 1.02422e4 (canonical value)
  crossoverLogTNewtonCrosscheck: CROSSOVER_LOG_T_NEWTON,
  crossoverLogT3SigFigs: Number(CROSSOVER_LOG_T.toPrecision(3)), // 1.02e4 (NOT 1.03e4)
  quoted: {
    imp95605: IMP_95605_FIGURE,
    imp95519Prose: IMP_95519_PROSE_FIGURE,
  },
  relErrToExact: {
    imp95605: Math.abs(IMP_95605_FIGURE / CROSSOVER_LOG_T - 1), // 2.3e-5 (accurate)
    imp95519Prose: Math.abs(IMP_95519_PROSE_FIGURE / CROSSOVER_LOG_T - 1), // 5.6e-3 (overstated)
  },
  verdict: 'ROUNDING_GLOSS_not_convention_difference',
  detail:
    'High-precision recomputation by both a closed-form Newton route on L / ln L = '
    + '(57.54 / 5.558691)^3 and the imp-95605 / imp-95519 bisection gives the crossover at '
    + 'log t = 10242.2363 = 1.02422e4. imp-95605 quotes 1.0242e4 (relative error 2.3e-5, '
    + 'accurate); the imp-95519 sec 3(b) prose and its line-350 comment quote 1.03e4 (relative '
    + 'error 5.6e-3, overstated). Both modules use the identical formula and constants and both '
    + 'internally compute 10242.24, so this is an imprecise prose rounding, NOT a genuine '
    + 'convention difference: 10242.24 rounds to 1.02e4 at three significant figures, not 1.03e4. '
    + 'The round-number companion t > e^{10000} stays directionally correct (10242.24 > 10000). '
    + 'Canonical figure for downstream citation: log t = 1.0242e4. Accuracy audit only; the '
    + 'operative unconditional region stays classical over the whole window; changes no bound; '
    + 'NO QED; no refereed bound is changed.',
  // self-check: the exact value is 1.0242e4, matches imp-95605, and rounds to 1.02e4 not 1.03e4
  holds: () =>
    Math.abs(CROSSOVER_LOG_T - 10242.2363) < 1e-2 &&
    Math.abs(CROSSOVER_LOG_T_NEWTON - CROSSOVER_LOG_T) < 1e-6 &&
    Math.abs(IMP_95605_FIGURE / CROSSOVER_LOG_T - 1) < 1e-4 &&
    Math.abs(IMP_95519_PROSE_FIGURE / CROSSOVER_LOG_T - 1) > 5e-3 &&
    Number(CROSSOVER_LOG_T.toPrecision(3)) === 1.02e4,
};

export const IMP_95619_VK_CROSSOVER_RECONCILE_ASSERTIONS = [
  {
    name: 'crossover reconciliation self-check holds',
    holds: () => IMP_95619_VK_CROSSOVER_RECONCILE.holds(),
  },
];

for (const a of IMP_95619_VK_CROSSOVER_RECONCILE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95619-vk-crossover-reconcile assertion failed: ${a.name}`);
  }
}

export default IMP_95619_VK_CROSSOVER_RECONCILE;
