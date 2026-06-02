/**
 * @module imp-2340-bootstrap-ci
 * @fileoverview imp-2340: Bootstrap 95% confidence intervals on the three
 *   headline empirical saturation margins: Volterra 5000x, K_PLATEAU 45.83x,
 *   and the E_coll conditional-bound margin.
 *
 *   CONTEXT
 *   -------
 *   Three headline "X-times below threshold" margins are quoted throughout
 *   the project as bare point estimates computed from deterministic grid data.
 *   This ticket adds non-parametric bootstrap CIs so each margin can be stated
 *   as "margin > Y at 95% confidence" rather than "margin = X (point)".
 *
 *   WHAT IS BEING BOOTSTRAPPED
 *   --------------------------
 *   The deterministic grid values are treated as a finite sample of
 *   observations. Bootstrap resampling with replacement quantifies the
 *   sensitivity of the MINIMUM margin to which cells/rows happen to be
 *   represented in the sample -- a practical proxy for "how robust is this
 *   floor to partial coverage?".
 *
 *   Bootstrap statistic: sample minimum of the margin factor across the grid.
 *
 *   SOURCES
 *   -------
 *   1. Volterra (imp-2338): 30 Krawczyk-certified (U,a) grid cells.
 *      Margin factor per cell = 1 / hs_cert (how many times below 1 the
 *      certified Hilbert-Schmidt norm is).
 *
 *   2. K_PLATEAU (imp-1082/1087/1088): 9 conservative-carryforward rows
 *      in the K_PLATEAU_LADDER at N in {2e4..1e6}.
 *      Margin factor per row = rescue_threshold / rescue_lhs
 *      = 0.12751 / (K * log(N) / sqrt(N)).
 *
 *   3. E_coll conditional-bound (imp-440): 14-point N sweep of the
 *      conditional Lambda bound L_cond = |t_c| + E_flow + E_coll.
 *      Margin factor per row = PT_BOUND / L_cond = 0.2 / L_cond.
 *
 *   METHOD
 *   ------
 *   Non-parametric bootstrap, B=10000 replicates, seeded LCG RNG
 *   (seed=0xDEADBEEF) for reproducibility. The 2.5th and 97.5th percentiles
 *   of the bootstrap distribution of sample minima give the 95% CI.
 *
 *   Ticket: imp-2340 (numerical, medium, sonnet-4-6).
 */

import { IMP2338_VOLTERRA_KRAWCZYK } from './imp-2338-volterra-krawczyk.js';
import { FINITE_K_C_MB_UNCONDITIONAL } from './finite-k-c-mb-unconditional.js';
import { FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN } from './finite-height-beats-platt-trudgian.js';

// ── Seeded LCG RNG (Knuth MMIX multiplier, additive constant from Numerical Recipes)
function makeLCG(seed) {
  let s = seed >>> 0;
  return function () {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Non-parametric bootstrap CI for the minimum of an array.
// Returns { ci_lo, ci_hi, sample_min, sample_max, sample_mean, n, B }
function bootstrapMinCI(values, B, rng) {
  const n = values.length;
  if (n === 0) return null;
  const mins = [];
  for (let b = 0; b < B; b++) {
    let min = Infinity;
    for (let i = 0; i < n; i++) {
      const v = values[Math.floor(rng() * n)];
      if (v < min) min = v;
    }
    mins.push(min);
  }
  mins.sort((a, b) => a - b);
  const lo_idx = Math.floor(0.025 * B);
  const hi_idx = Math.min(Math.ceil(0.975 * B) - 1, B - 1);
  const sample_sum = values.reduce((s, v) => s + v, 0);
  return {
    ci_lo:       mins[lo_idx],
    ci_hi:       mins[hi_idx],
    sample_min:  Math.min(...values),
    sample_max:  Math.max(...values),
    sample_mean: sample_sum / n,
    n,
    B,
  };
}

const B = 10000;
const rng = makeLCG(0xdeadbeef);

// ── 1. Volterra: margin = 1 / hs_cert for each of the 30 certified grid cells
const volterra_margins = IMP2338_VOLTERRA_KRAWCZYK.certifiedGrid.map(
  (r) => 1 / r.hs_cert,
);
const volterra_raw = bootstrapMinCI(volterra_margins, B, rng);

// ── 2. K_PLATEAU: rescue_margin_factor for each of the 9 ladder rows
const kplateau_margins = FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder
  .map((r) => r.rescue_margin_factor)
  .filter((v) => v != null && Number.isFinite(v));
const kplateau_raw = bootstrapMinCI(kplateau_margins, B, rng);

// ── 3. E_coll conditional-bound: PT_BOUND / L_cond across the 14-point N sweep
const ecoll_margins = FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.ladder
  .filter(
    (r) =>
      r.available &&
      r.conditionalBound &&
      r.conditionalBound.marginFactor !== null,
  )
  .map((r) => r.conditionalBound.marginFactor);
const ecoll_raw = bootstrapMinCI(ecoll_margins, B, rng);

// ── Exported record ──────────────────────────────────────────────────────────
export const IMP2340_BOOTSTRAP_CI = Object.freeze({
  id:          'imp-2340-bootstrap-ci',
  ticket:      'imp-2340',
  generatedAt: '2026-06-02T20:30:00Z',
  method:
    'non-parametric bootstrap, B=10000, seeded LCG seed=0xDEADBEEF, ' +
    '95% CI on minimum margin factor across each grid/ladder/sweep',

  volterra: Object.freeze({
    description:
      'Minimum of (1/hs_cert) across the 30 Krawczyk-certified Volterra grid ' +
      'cells from imp-2338. The certified HS norm is an upper bound on the ' +
      'spectral norm, so 1/hs_cert is a lower bound on how far below 1 the ' +
      'operator norm is.',
    ci_lo:       volterra_raw ? volterra_raw.ci_lo : null,
    ci_hi:       volterra_raw ? volterra_raw.ci_hi : null,
    sample_min:  volterra_raw ? volterra_raw.sample_min : null,
    sample_max:  volterra_raw ? volterra_raw.sample_max : null,
    sample_mean: volterra_raw ? volterra_raw.sample_mean : null,
    n:           volterra_raw ? volterra_raw.n : 0,
    B,
    headline:
      volterra_raw
        ? 'Volterra minimum margin > ' +
          Math.floor(volterra_raw.ci_lo) +
          'x at 95% confidence (point min: ' +
          Math.round(volterra_raw.sample_min) + 'x)'
        : 'unavailable',
  }),

  kPlateau: Object.freeze({
    description:
      'Minimum rescue_margin_factor across the 9 K_PLATEAU_LADDER rows ' +
      '(imp-1082 batch-1 + imp-1087 batch-2 + imp-1088 batch-3 CAPSTONE). ' +
      'rescue_margin_factor = 0.12751 / (K * log(N) / sqrt(N)) at each N.',
    ci_lo:       kplateau_raw ? kplateau_raw.ci_lo : null,
    ci_hi:       kplateau_raw ? kplateau_raw.ci_hi : null,
    sample_min:  kplateau_raw ? kplateau_raw.sample_min : null,
    sample_max:  kplateau_raw ? kplateau_raw.sample_max : null,
    sample_mean: kplateau_raw ? kplateau_raw.sample_mean : null,
    n:           kplateau_raw ? kplateau_raw.n : 0,
    B,
    headline:
      kplateau_raw
        ? 'K_PLATEAU minimum rescue margin > ' +
          kplateau_raw.ci_lo.toFixed(2) +
          'x at 95% confidence (capstone N=1e6 point: 45.83x)'
        : 'unavailable',
  }),

  ecollConditional: Object.freeze({
    description:
      'Minimum of PT_BOUND / L_cond (= 0.2 / L_cond) across the 14-point N ' +
      'sweep in FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.ladder. L_cond = |t_c| + ' +
      'E_flow + E_coll is the conditional bound excluding E_trunc.',
    ci_lo:       ecoll_raw ? ecoll_raw.ci_lo : null,
    ci_hi:       ecoll_raw ? ecoll_raw.ci_hi : null,
    sample_min:  ecoll_raw ? ecoll_raw.sample_min : null,
    sample_max:  ecoll_raw ? ecoll_raw.sample_max : null,
    sample_mean: ecoll_raw ? ecoll_raw.sample_mean : null,
    n:           ecoll_raw ? ecoll_raw.n : 0,
    B,
    headline:
      ecoll_raw
        ? 'E_coll conditional margin > ' +
          ecoll_raw.ci_lo.toFixed(2) +
          'x at 95% confidence (point min: ' +
          (ecoll_raw.sample_min !== null ? ecoll_raw.sample_min.toFixed(2) : '?') +
          'x)'
        : 'unavailable',
  }),
});

export default IMP2340_BOOTSTRAP_CI;

// ── Build-time assertions ────────────────────────────────────────────────────
export const IMP2340_BOOTSTRAP_CI_ASSERTIONS = [
  {
    id: 'imp2340-volterra-ci-lo-above-1000',
    holds: () =>
      IMP2340_BOOTSTRAP_CI.volterra.ci_lo !== null &&
      IMP2340_BOOTSTRAP_CI.volterra.ci_lo > 1000,
    why:
      'Bootstrap 95% CI lower bound on minimum Volterra margin must exceed ' +
      '1000x. The certified grid norms are ~1.9e-4 at worst so the true ' +
      'minimum margin is ~5263x; the bootstrap CI lower bound should be >> 1000.',
  },
  {
    id: 'imp2340-volterra-sample-uses-30-cells',
    holds: () => IMP2340_BOOTSTRAP_CI.volterra.n === 30,
    why: 'Bootstrap must use all 30 certified Volterra grid cells, not a subset.',
  },
  {
    id: 'imp2340-kplateau-ci-lo-above-5',
    holds: () =>
      IMP2340_BOOTSTRAP_CI.kPlateau.ci_lo !== null &&
      IMP2340_BOOTSTRAP_CI.kPlateau.ci_lo > 5,
    why:
      'Bootstrap 95% CI lower bound on minimum K_PLATEAU rescue margin must ' +
      'exceed 5x. The true minimum across 9 rows is ~9x at N=2e4; the CI ' +
      'lower bound may dip but must remain above 5x.',
  },
  {
    id: 'imp2340-kplateau-sample-uses-9-rows',
    holds: () => IMP2340_BOOTSTRAP_CI.kPlateau.n === 9,
    why: 'Bootstrap must use all 9 K_PLATEAU_LADDER rows (batches 1+2+3).',
  },
  {
    id: 'imp2340-ecoll-ci-lo-above-10',
    holds: () =>
      IMP2340_BOOTSTRAP_CI.ecollConditional.ci_lo !== null &&
      IMP2340_BOOTSTRAP_CI.ecollConditional.ci_lo > 10,
    why:
      'Bootstrap 95% CI lower bound on the E_coll conditional margin must ' +
      'exceed 10x. With L_cond ~0.008 the point margin is ~25x; the CI ' +
      'lower bound should comfortably exceed 10x.',
  },
  {
    id: 'imp2340-ecoll-sample-has-n-ge-10',
    holds: () => IMP2340_BOOTSTRAP_CI.ecollConditional.n >= 10,
    why:
      'The E_coll conditional sweep must provide at least 10 valid rows for ' +
      'a meaningful bootstrap. TARGET_NS has 14 entries; fewer than 10 would ' +
      'indicate the V2 fit is unavailable or rows are being filtered incorrectly.',
  },
  {
    id: 'imp2340-all-ci-lo-less-than-sample-min',
    holds: () => {
      const v = IMP2340_BOOTSTRAP_CI.volterra;
      const k = IMP2340_BOOTSTRAP_CI.kPlateau;
      const e = IMP2340_BOOTSTRAP_CI.ecollConditional;
      return (
        v.ci_lo <= v.sample_min &&
        k.ci_lo <= k.sample_min &&
        e.ci_lo <= e.sample_min
      );
    },
    why:
      'The CI lower bound (2.5th percentile of bootstrap minima) must be at ' +
      'or below the observed sample minimum. The bootstrap CI for a minimum ' +
      'cannot be wider on the lower side than the actual minimum.',
  },
];
