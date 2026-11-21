// imp-96399: viz-data leaf for the Route M reachable-N ceiling reprice.
// All figures are baked literals copied from imp-96352 (IMP96352_REACH,
// IMP96352_BUILD_ONLY_ESTIMATE) and imp-96230 (IMP96230_N1E4_BUDGET), not a
// live import, per the project convention of keeping viz pages free of any
// dependency chain into the heavy data modules.

export const IMP96399_BUILD_ONLY_ASSUMED_N = Object.freeze({
  budgetSeconds: 399,
  assumedN: 10000, // IMP96230_N1E4_BUDGET.N -- Gram build + eigvalsh + Cholesky only
  label: 'imp-96230 BUILD-only budget',
});

export const IMP96399_CORRECTED_REACH = Object.freeze([
  Object.freeze({ budgetSeconds: 399, budgetLabel: '399 s (imp-96230 budget)', reachN: 5355 }),
  Object.freeze({ budgetSeconds: 1800, budgetLabel: '1800 s (30 min)', reachN: 9916 }),
  Object.freeze({ budgetSeconds: 3600, budgetLabel: '3600 s (1 hour)', reachN: 13010 }),
  Object.freeze({ budgetSeconds: 14400, budgetLabel: '14400 s (4 hours)', reachN: 21950 }),
]);

export const IMP96399_OVERSTATEMENT = Object.freeze({
  atBudgetSeconds: 399,
  buildOnlyN: 10000,
  correctedN: 5355,
  overstatementFactor: 10000 / 5355, // ~1.868x
  underCountFactorWall: 1838.5 / 399, // ~4.61x -- true wall for N=1e4 vs the 399 s BUILD-only estimate
});

export const IMP96399_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every reach figure is copied verbatim from imp-96352 (corrected cost model) and imp-96230 (BUILD-only budget); no new cost measurement is made here. Changes no bound, establishes no operator positivity.';
