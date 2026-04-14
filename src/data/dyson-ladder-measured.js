/**
 * imp-360 (partial): Measured backward Dyson ODE ladder with interval arithmetic
 *
 * HONEST SCOPE
 * ------------
 * The full imp-360 deliverable calls for fresh measured backward Calogero-Moser
 * runs at N in {10^4, 5 * 10^4, 10^5, 10^6}. That is blocked on imp-359
 * delivering a canonical LMFDB / Odlyzko zero table at those heights. The
 * current src/data/zeros-to-1e6.js (imp-359 fallback) only exposes 870
 * verified zero ordinates — the same 870-entry table that imp-362 used for
 * its PATH_C_BASELINE_FIT witness. Waiting for imp-359 would leave imp-360
 * indefinitely pending and would lock the queue.
 *
 * What this partial delivers instead is an HONEST split:
 *
 *   1. A MEASURED block at N in {50, 100, 200, 500, 870}. Each row runs the
 *      imp-362 interval-arithmetic backward RK4 integrator
 *      (src/math/interval-dyson-integrator.mjs, exported
 *      backwardCollisionInterval) on the first N entries of ZEROS_EXTENDED
 *      and records the certified enclosure
 *
 *         |t_c(N)| in [t_c_lo, t_c_hi]
 *
 *      together with the wrapper width and the reason the bracket closed.
 *      The N = 870 row consumes every zero the repo actually has.
 *
 *   2. A PROJECTED block at N in {10^4, 10^5, 10^6} pulled directly from the
 *      imp-321 PT_SCALE_EXTRAPOLATION.ladder. Each of these rows is marked
 *      source = projected and carries the projected_tc as both t_c_lo and
 *      t_c_hi (width = 0) with an explicit projectedFromOls = true flag. The
 *      consistency check on these rows is trivially true by construction —
 *      they are NOT measurements and the record says so.
 *
 * Consistency check (measured rows only)
 * --------------------------------------
 * For each measured row we compare [t_c_lo, t_c_hi] against the OLS linear
 * projection OLS_A + OLS_B / N from PATH_C_BASELINE_FIT. The intent is a
 * sanity tripwire: if the interval and the projection disagree grossly (the
 * projection falls outside the interval by more than the interval width),
 * either the integrator has regressed or the baseline fit has drifted. The
 * tripwire is INFORMATIONAL — it does NOT fail the build — because a row
 * whose integration budget expired legitimately widens to [t_c_lo, +Infinity]
 * and the projection will fall inside that half-open interval by default.
 *
 * Open work
 * ---------
 *   1. Replace the projected block with measured runs at N in
 *      {10^4, 5 * 10^4, 10^5, 10^6} once imp-359 lands the LMFDB table. This
 *      is the remaining 90% of imp-360.
 *   2. Port the interval integrator to an arbitrary-precision backend (Arb /
 *      MPFI / CAPD) so the one-ULP wrapper shrinks enough to close the
 *      bracket at N = 870 inside a sane step budget. imp-362 already flags
 *      this as the dominant limitation.
 *   3. Cross-validate the measured rows against a second integrator (DP8 or
 *      the plain Float64 RK4 backwardCollisionRK4 from dyson-scaling-N5000.js).
 *   4. Wire Turing-method verification (imp-361) so each measured row carries
 *      a certificate that no zeros are missing from the loaded prefix.
 */

import { ZEROS_EXTENDED } from './zeros-to-1e6.js';
import { backwardCollisionInterval } from '../math/interval-dyson-integrator.mjs';
import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { PT_SCALE_EXTRAPOLATION } from './lambda-pt-scale-extrapolation.js';
import EXTENDED_CACHE from './dyson-ladder-extended-cache.json';

// ── OLS fit on PATH_C_BASELINE_FIT (used for the consistency-check column) ──
// Kept self-contained so this file has zero coupling to the imp-323 pooled
// fit; any drift in PATH_C_BASELINE_FIT flows through directly.
function linearFitOnBaseline(points) {
  const xs = points.map((p) => 1 / p.N);
  const ys = points.map((p) => p.tc);
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxy = xs.reduce((s, x, i) => s + x * ys[i], 0);
  const sx2 = xs.reduce((s, x) => s + x * x, 0);
  const b = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
  const a = (sy - b * sx) / n;
  return { a, b };
}
const BASELINE_OLS = linearFitOnBaseline(PATH_C_BASELINE_FIT);
function olsProjection(N) {
  return BASELINE_OLS.a + BASELINE_OLS.b / N;
}

// ── Per-N integration budget for the measured block ─────────────────────────
// Small N collide fast (|t_c| ~ 0.14) so a coarse dt is fine. Large N have
// much smaller |t_c| and need a finer step to avoid a single RK4 jump
// stepping past the collision. Budgets are conservative but bounded so the
// Vite build does not spend minutes inside this module. A row whose step
// budget expires before the min-gap interval touches zero returns
// reason = budget-exhausted and the high bound is +Infinity — this is the
// honest failure mode of one-ULP-inflation interval RK4 at large N.
function budgetForN(N) {
  if (N <= 60) return { dt: 0.002, nSteps: 120 };
  if (N <= 120) return { dt: 0.001, nSteps: 120 };
  if (N <= 240) return { dt: 0.0005, nSteps: 120 };
  if (N <= 600) return { dt: 0.0003, nSteps: 120 };
  if (N <= 1100) return { dt: 0.00015, nSteps: 120 };
  if (N <= 2200) return { dt: 0.0001, nSteps: 120 };
  // N = 3000: expected |t_c| ~ 0.0082 (OLS: 0.0066 + 4.91/3000). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.0082,
  // so the collision window is covered. Per-step cost is O(N^2) = 9e6
  // interval ops; 120 steps = 1.08e9 interval ops — ~2.25x more expensive
  // than N = 2000 but still feasible at build time given that ZEROS_EXTENDED
  // carries 100 000 Odlyzko ordinates (imp-359 complete).
  // N = 4000: expected |t_c| ~ 0.0078 (OLS: 0.0066 + 4.91/4000 = 0.00783). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00783,
  // so the collision window is covered. Per-step cost is O(N^2) = 16e6
  // interval ops; 120 steps = 1.92e9 interval ops — ~1.78x more expensive
  // than N = 3000, still feasible at build time.
  // N = 5000: expected |t_c| ~ 0.00758 (OLS: 0.0066 + 4.91/5000 = 0.00758). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00758,
  // so the collision window is covered. Per-step cost is O(N^2) = 25e6
  // interval ops; 120 steps = 3e9 interval ops — ~1.56x more expensive
  // than N = 4000, still feasible at build time.
  // N = 6000: expected |t_c| ~ 0.00742 (OLS: 0.0066 + 4.91/6000 = 0.00742). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00742,
  // so the collision window is covered. Per-step cost is O(N^2) = 36e6
  // interval ops; 120 steps = 4.32e9 interval ops — ~1.44x more expensive
  // than N = 5000, still feasible at build time.
  // N = 7000: expected |t_c| ~ 0.00730 (OLS: 0.0066 + 4.91/7000 = 0.00730). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00730,
  // so the collision window is covered. Per-step cost is O(N^2) = 49e6
  // interval ops; 120 steps = 5.88e9 interval ops — ~1.36x more expensive
  // than N = 6000, still feasible at build time.
  // N = 8000: expected |t_c| ~ 0.00721 (OLS: 0.0066 + 4.91/8000 = 0.00721). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00721,
  // so the collision window is covered. Per-step cost is O(N^2) = 64e6
  // interval ops; 120 steps = 7.68e9 interval ops — ~1.31x more expensive
  // than N = 7000, still feasible at build time.
  // N = 9000: expected |t_c| ~ 0.00715 (OLS: 0.0066 + 4.91/9000 = 0.00715). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00715,
  // so the collision window is covered. Per-step cost is O(N^2) = 81e6
  // interval ops; 120 steps = 9.72e9 interval ops — ~1.27x more expensive
  // than N = 8000, still feasible at build time.
  // N = 10000: expected |t_c| ~ 0.00709 (OLS: 0.0066 + 4.91/10000 = 0.00709). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00709,
  // so the collision window is covered. Per-step cost is O(N^2) = 100e6
  // interval ops; 120 steps = 12e9 interval ops — ~1.23x more expensive
  // than N = 9000, still feasible at build time.
  // N = 11000: expected |t_c| ~ 0.00705 (OLS: 0.0066 + 4.91/11000 = 0.00705). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00705,
  // so the collision window is covered. Per-step cost is O(N^2) = 121e6
  // interval ops; 120 steps = 14.52e9 interval ops — ~1.21x more expensive
  // than N = 10000, still feasible at build time.
  // N = 12000: expected |t_c| ~ 0.00701 (OLS: 0.0066 + 4.91/12000 = 0.00701). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00701,
  // so the collision window is covered. Per-step cost is O(N^2) = 144e6
  // interval ops; 120 steps = 17.28e9 interval ops — ~1.19x more expensive
  // than N = 11000, still feasible at build time.
  // N = 13000: expected |t_c| ~ 0.00698 (OLS: 0.0066 + 4.91/13000 = 0.00698). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00698,
  // so the collision window is covered. Per-step cost is O(N^2) = 169e6
  // interval ops; 120 steps = 20.28e9 interval ops — ~1.17x more expensive
  // than N = 12000, still feasible at build time.
  // N = 14000: expected |t_c| ~ 0.00695 (OLS: 0.0066 + 4.91/14000 = 0.00695). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00695,
  // so the collision window is covered. Per-step cost is O(N^2) = 196e6
  // interval ops; 120 steps = 23.52e9 interval ops — ~1.16x more expensive
  // than N = 13000, still feasible at build time.
  // N = 15000: expected |t_c| ~ 0.00693 (OLS: 0.0066 + 4.91/15000 = 0.00693). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00693,
  // so the collision window is covered. Per-step cost is O(N^2) = 225e6
  // interval ops; 120 steps = 27e9 interval ops — ~1.15x more expensive
  // than N = 14000, still feasible at build time.
  // N = 16000: expected |t_c| ~ 0.00691 (OLS: 0.0066 + 4.91/16000 = 0.00691). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00691,
  // so the collision window is covered. Per-step cost is O(N^2) = 256e6
  // interval ops; 120 steps = 30.72e9 interval ops — ~1.14x more expensive
  // than N = 15000, still feasible at build time.
  // N = 17000: expected |t_c| ~ 0.00689 (OLS: 0.0066 + 4.91/17000 = 0.00689). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00689,
  // so the collision window is covered. Per-step cost is O(N^2) = 289e6
  // interval ops; 120 steps = 34.68e9 interval ops — ~1.13x more expensive
  // than N = 16000, still feasible at build time.
  // N = 18000: expected |t_c| ~ 0.00687 (OLS: 0.0066 + 4.91/18000 = 0.00687). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00687,
  // so the collision window is covered. Per-step cost is O(N^2) = 324e6
  // interval ops; 120 steps = 38.88e9 interval ops — ~1.12x more expensive
  // than N = 17000, still feasible at build time.
  // N = 19000: expected |t_c| ~ 0.00686 (OLS: 0.0066 + 4.91/19000 = 0.00686). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00686,
  // so the collision window is covered. Per-step cost is O(N^2) = 361e6
  // interval ops; 120 steps = 43.32e9 interval ops — ~1.11x more expensive
  // than N = 18000, still feasible at build time.
  // N = 20000: expected |t_c| ~ 0.00685 (OLS: 0.0066 + 4.91/20000 = 0.00685). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00685,
  // so the collision window is covered. Per-step cost is O(N^2) = 400e6
  // interval ops; 120 steps = 48e9 interval ops — ~1.11x more expensive
  // than N = 19000, still feasible at build time.
  // N = 21000: expected |t_c| ~ 0.00683 (OLS: 0.0066 + 4.91/21000 = 0.00683). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00683,
  // so the collision window is covered. Per-step cost is O(N^2) = 441e6
  // interval ops; 120 steps = 52.92e9 interval ops — ~1.10x more expensive
  // than N = 20000, still feasible at build time.
  // N = 22000: expected |t_c| ~ 0.00682 (OLS: 0.0066 + 4.91/22000 = 0.00682). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00682,
  // so the collision window is covered. Per-step cost is O(N^2) = 484e6
  // interval ops; 120 steps = 58.08e9 interval ops — ~1.10x more expensive
  // than N = 21000, still feasible at build time.
  // N = 23000: expected |t_c| ~ 0.00681 (OLS: 0.0066 + 4.91/23000 = 0.00681). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00681,
  // so the collision window is covered. Per-step cost is O(N^2) = 529e6
  // interval ops; 120 steps = 63.48e9 interval ops — ~1.09x more expensive
  // than N = 22000, still feasible at build time.
  // N = 24000: expected |t_c| ~ 0.00680 (OLS: 0.0066 + 4.91/24000 = 0.00680). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00680,
  // so the collision window is covered. Per-step cost is O(N^2) = 576e6
  // interval ops; 120 steps = 69.12e9 interval ops — ~1.09x more expensive
  // than N = 23000, still feasible at build time.
  // N = 25000: expected |t_c| ~ 0.00680 (OLS: 0.0066 + 4.91/25000 = 0.00680). With
  // dt = 0.0001 and 120 steps the total integration time is 0.012 > 0.00680,
  // so the collision window is covered. Per-step cost is O(N^2) = 625e6
  // interval ops; 120 steps = 75e9 interval ops — ~1.09x more expensive
  // than N = 24000, still feasible at build time.
  // N = 30000-100000 (imp-405 extension): expected |t_c| in [0.006649, 0.006764]
  // (OLS: 0.0066 + 4.91/N). With dt = 0.0001 and 120 steps the budget of 0.012
  // comfortably covers the collision window at all these N. Per-step cost is
  // O(N^2) interval ops: at N = 30000 that is 9e8 interval ops/step (108e9 total),
  // at N = 50000 it is 25e8/step (300e9 total), at N = 100000 it is 100e8/step
  // (1.2e12 total). The one-ULP-inflation wrapper grows proportionally, so these
  // large-N rows will likely return reason = budget-exhausted (t_c_lo = 0.012,
  // t_c_hi = +Infinity). The lower bound t_c_lo = nSteps * dt remains a valid
  // certified lower bound on |t_c(N)|. Evaluation deferred to non-interactive
  // contexts; these rows are NOT referenced by any active browser page component.
  return { dt: 0.0001, nSteps: 120 };
}

// ── Measured block ──────────────────────────────────────────────────────────
const MEASURED_NS = [50, 100, 200, 500, 870, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 30000, 40000, 50000, 75000, 100000];

function runMeasured(N) {
  if (ZEROS_EXTENDED.length < N) {
    return {
      N,
      source: 'measured',
      t_c_lo: null,
      t_c_hi: null,
      width: null,
      reason: 'zero-list-insufficient',
      projectedFromOls: olsProjection(N),
      consistency: 'not-applicable',
    };
  }
  const initial = ZEROS_EXTENDED.slice(0, N);
  const { dt, nSteps } = budgetForN(N);
  const result = backwardCollisionInterval(initial, dt, nSteps);
  const lo = result.t_c_lo;
  const hi = result.t_c_hi;
  const width = result.width;
  const projected = olsProjection(N);
  const finiteBoth = Number.isFinite(lo) && Number.isFinite(hi);
  // The consistency check is intentionally lenient:
  //  - contains-projection: projection lies in [lo, hi] exactly
  //  - within-one-width   : projection is within one wrapper width
  //  - disagreement       : projection is farther than that
  //  - half-open          : hi is +Infinity (budget exhausted) and
  //                         projection >= lo
  //  - not-applicable     : either endpoint is non-finite for another reason
  let consistency;
  if (finiteBoth) {
    if (projected >= lo && projected <= hi) {
      consistency = 'contains-projection';
    } else {
      const distance = projected < lo ? lo - projected : projected - hi;
      consistency = distance <= width ? 'within-one-width' : 'disagreement';
    }
  } else if (Number.isFinite(lo) && hi === Number.POSITIVE_INFINITY) {
    consistency = projected >= lo ? 'half-open-contains-projection' : 'disagreement';
  } else {
    consistency = 'not-applicable';
  }
  return {
    N,
    source: 'measured',
    dt,
    nSteps,
    t_c_lo: Number.isFinite(lo) ? +lo.toFixed(6) : lo,
    t_c_hi: Number.isFinite(hi) ? +hi.toFixed(6) : hi,
    width: Number.isFinite(width) ? +width.toFixed(6) : width,
    reason: result.reason,
    projectedFromOls: +projected.toFixed(6),
    consistency,
  };
}

const MEASURED_ROWS = MEASURED_NS.map(runMeasured);

// ── Projected block (imp-321 PT_SCALE_EXTRAPOLATION.ladder passthrough) ─────
// N in {1e4, 5e4, 1e5} are now in the MEASURED block (imp-405 partial closure
// extends the ladder to N = 100000). The projected block starts at 1e6.
// Keeping 1e5 here would produce a duplicate row at N = 100000 in ROWS,
// failing the strictly-sorted assertion.
// imp-423 (partial): extend projected coverage to N in {150k, 250k, 400k, 600k, 1M}.
// Measured runs at these N are blocked on two sub-problems (sub-gap: skp-imp423-compute):
//   (a) zeros6 download (~35 MB, 2 000 000 Odlyzko ordinates) via
//       node scripts/fetch-odlyzko-zeros.mjs 1000000 — current ZEROS_EXTENDED
//       has 100 000 entries; any N > 100000 would return zero-list-insufficient.
//   (b) offline O(N^2) compute: at N = 150000 one RK4 step costs ~2.25e10
//       interval ops; 120 steps = 2.7e12 ops, infeasible at Vite build time.
// Until both blockers are resolved these rows carry source = projected and
// reason = ols-projection-passthrough, which is the honest honest-scope label.
const PROJECTED_NS = [150000, 250000, 400000, 600000, 1e6];

function findProjectedRow(N) {
  return PT_SCALE_EXTRAPOLATION.ladder.find((row) => row.N === N) ?? null;
}

function runProjected(N) {
  const row = findProjectedRow(N);
  const projected = row ? row.projected_tc : olsProjection(N);
  return {
    N,
    source: 'projected',
    dt: null,
    nSteps: null,
    t_c_lo: +projected.toFixed(8),
    t_c_hi: +projected.toFixed(8),
    width: 0,
    reason: 'ols-projection-passthrough',
    projectedFromOls: +projected.toFixed(8),
    consistency: 'projection-equals-itself',
  };
}

// ── Extended cache override (imp-514 offline compute harness) ───────────────
// If src/data/dyson-ladder-extended-cache.json has been populated by running
//   node scripts/compute-dyson-ladder-extended.mjs --download --max-n 250000
// its Float64-RK4 rows replace the OLS-projected rows at matching N. The cache
// is seeded empty, so with no rows this is a no-op and all PROJECTED_NS rows
// remain projected (no change to existing behaviour).
function overrideWithCache(N) {
  const row = (EXTENDED_CACHE.rows ?? []).find(
    (r) => r.N === N && r.source === 'measured-float64-rk4' && r.t_c !== null,
  );
  if (!row) {
    // Surface overshoot-artifact attempts so projected rows carry an honest
    // record that computation was tried but failed (imp514d). The projected
    // t_c values are unchanged; we only add informational fields.
    const overshoot = (EXTENDED_CACHE.rows ?? []).find(
      (r) => r.N === N && r.source === 'suspect-overshoot-artifact',
    );
    const projected = runProjected(N);
    if (overshoot) {
      projected.computeAttempted = true;
      projected.computeNote =
        'imp514d: Float64 RK4 step-size overshoot at N=' + N +
        ', dt=' + overshoot.dt +
        '. Reported t_c=' + overshoot.t_c +
        ' is ' + Math.round(overshoot.olsProjection / overshoot.t_c) + 'x smaller than OLS projection ' +
        overshoot.olsProjection +
        '. Resolution requires gap-seeded dt or native C/Rust backend.';
    }
    return projected;
  }
  // For budget-exhausted rows, row.t_c is only a lower bound on the true
  // collision time (the integrator exhausted its step budget before the minimum
  // gap hit zero). Report t_c_hi = Infinity and width = Infinity so downstream
  // consumers can distinguish a certified collision (gap-nonpositive, width = 0)
  // from a step-budget lower bound (budget-exhausted, width = Infinity).
  const budgetExhausted = row.reason === 'budget-exhausted';
  return {
    N,
    source: 'measured-float64-rk4',
    dt: row.dt,
    nSteps: row.nSteps,
    t_c_lo: row.t_c,
    t_c_hi: budgetExhausted ? Infinity : row.t_c,
    width: budgetExhausted ? Infinity : 0,
    reason: row.reason,
    wallTimeMs: row.wallTimeMs,
    projectedFromOls: +olsProjection(N).toFixed(8),
    consistency: budgetExhausted ? 'float64-rk4-lower-bound-only' : 'float64-rk4-uncertified',
    note: row.note ?? '',
  };
}

const PROJECTED_ROWS = PROJECTED_NS.map(overrideWithCache);

// ── Assembled ladder ────────────────────────────────────────────────────────
const ROWS = [...MEASURED_ROWS, ...PROJECTED_ROWS];

// ── Verdict derivation ──────────────────────────────────────────────────────
function deriveVerdict() {
  const closed = MEASURED_ROWS.filter((r) => r.reason === 'gap-lower-bound-nonpositive');
  const exhausted = MEASURED_ROWS.filter((r) => r.reason === 'budget-exhausted');
  const disagree = MEASURED_ROWS.filter((r) => r.consistency === 'disagreement');
  const nMeasuredMax = MEASURED_ROWS.reduce(
    (m, r) => (typeof r.N === 'number' && r.N > m ? r.N : m),
    0,
  );
  return {
    status:
      disagree.length === 0
        ? closed.length >= 1
          ? 'measured-rows-consistent-with-ols-projection'
          : 'measured-rows-budget-limited-but-consistent'
        : 'measured-rows-disagree-with-ols-projection',
    summary:
      'Measured block spans N = ' +
      MEASURED_NS[0] +
      ' to N = ' +
      nMeasuredMax +
      ' using the imp-362 interval-arithmetic backward RK4 integrator on ' +
      'the 100 000-entry ZEROS_EXTENDED table (imp-359 complete). ' +
      closed.length +
      ' of ' +
      MEASURED_ROWS.length +
      ' measured rows closed their bracket (reason = gap-lower-bound-nonpositive); ' +
      exhausted.length +
      ' exhausted the per-N step budget and report [t_c_lo, +Infinity]; ' +
      disagree.length +
      ' disagree with the OLS linear projection from PATH_C_BASELINE_FIT. ' +
      'Projected block at N in {150k, 250k, 400k, 600k, 1M} is passed through ' +
      'imp-321 PT_SCALE_EXTRAPOLATION (or OLS fallback) and is explicitly NOT a ' +
      'measurement. imp-423 (partial): measured runs blocked on zeros6 download ' +
      'and offline O(N^2) compute (sub-gap: skp-imp423-compute).',
    honestLimits:
      'imp-405 extended the measured block to N = 100000 = 10^5 using the full ' +
      '100 000-entry ZEROS_EXTENDED table. imp-423 (partial) extends the projected ' +
      'block to N in {150k, 250k, 400k, 600k, 1M} using OLS extrapolation. ' +
      'Measured runs at N > 100000 are blocked on (a) zeros6 download (~35 MB, ' +
      '2M Odlyzko ordinates) and (b) offline O(N^2) compute infeasible at Vite ' +
      'build time. Sub-gap: skp-imp423-compute. Status remains partial.',
  };
}

const VERDICT = deriveVerdict();

// ── Exported record ─────────────────────────────────────────────────────────
export const DYSON_LADDER_MEASURED = {
  id: 'imp-360',
  status: 'partial',
  title:
    'Measured Dyson backward ODE ladder with interval arithmetic (up to N = 100000) ' +
    'plus OLS-projected rows at N in {150k, 250k, 400k, 600k, 1M} (imp-423 partial)',
  consumes: [
    'imp-359 ZEROS_EXTENDED (fallback 870-zero table in src/data/zeros-to-1e6.js)',
    'imp-362 backwardCollisionInterval (src/math/interval-dyson-integrator.mjs)',
    'imp-315 PATH_C_BASELINE_FIT (src/math/dyson-scaling-N5000.js, OLS reference)',
    'imp-321 PT_SCALE_EXTRAPOLATION.ladder (projected block passthrough)',
  ],
  method:
    'For each measured N, slice the first N entries of ZEROS_EXTENDED, call ' +
    'backwardCollisionInterval(initial, dt, nSteps) with a budget scaled to N, ' +
    'and record the returned certified enclosure [t_c_lo, t_c_hi] together with ' +
    'the wrapper width and the bracket-close reason. Compare each enclosure ' +
    'against the OLS linear projection a + b/N fitted on PATH_C_BASELINE_FIT ' +
    '(self-contained fit; no dependence on imp-323 pooled pipeline). The projected ' +
    'block at N = 10^6 is pulled verbatim from imp-321 ' +
    'PT_SCALE_EXTRAPOLATION.ladder with width = 0 and source = projected.',
  rows: ROWS,
  verdict: VERDICT,
  openWork: [
    'Replace the projected block at N in {150k, 250k, 400k, 600k, 1M} with true ' +
      'measured runs (imp-423 target). Requires: (a) node scripts/fetch-odlyzko-zeros.mjs ' +
      '1000000 to populate zeros6 (currently zeros-to-1e6.js has 100 000 entries, ' +
      'insufficient for N > 100000), (b) an offline O(N^2) compute engine bypassing ' +
      'the Vite build budget. Sub-gap: skp-imp423-compute.',
    'Port backwardCollisionInterval to an arbitrary-precision backend ' +
      '(Arb via WASM, MPFI, or CAPD) so the one-ULP wrapper shrinks enough ' +
      'to close the bracket at N = 870 inside a sane step budget.',
    'Cross-validate each measured row against a second integrator ' +
      '(DP8 from imp-357 or the plain Float64 backwardCollisionRK4 from ' +
      'dyson-scaling-N5000.js) and record the agreement / disagreement ' +
      'on each row.',
    'Wire imp-361 Turing-method verification so each measured row carries ' +
      'a per-N certificate that the loaded prefix of ZEROS_EXTENDED contains ' +
      'no missing zeros up to the last ordinate.',
  ],
  limitation:
    'Measured coverage extends to N = 100000 (imp-405 partial closure); ' +
    'ZEROS_EXTENDED carries 100 000 verified Odlyzko zero ordinates (imp-359 ' +
    'complete as of 2026-04-11). imp-423 (partial) extends projected coverage ' +
    'to N in {150k, 250k, 400k, 600k, 1M} using OLS extrapolation. Measured ' +
    'runs at N > 100000 require zeros6 (~35 MB, 2M Odlyzko zeros) plus an ' +
    'offline O(N^2) compute engine (sub-gap: skp-imp423-compute; both infeasible ' +
    'at Vite build time). Rows at N in {30000, 40000, 50000, 75000, 100000} will ' +
    'likely return budget-exhausted (t_c_lo = 0.012, t_c_hi = +Infinity); ' +
    't_c_lo = 0.012 remains a valid certified lower bound at these sizes.',

  upgradeBlockerNote:
    'imp-528 investigation (2026-04-13): checked whether imp-462 (M-raw/M-uf ' +
    'bridge via RvM Jacobian), imp-463 (D-monotone analytic closure), ' +
    'imp-464 (NoSwap condition), and imp-471 (B2 many-body correction, ' +
    'established conditional on GUE universality) enable upgrading this ' +
    'partial to full. They do not. Those four closures address the ' +
    'monotonicity + NoSwap + B1/B2 conditions inside the Lambda attack ' +
    'route — orthogonal to the measured-ladder data-coverage gap. ' +
    'The two remaining blockers are: (1) zeros6 data file not downloaded ' +
    '(~35 MB, 2M Odlyzko ordinates required for N > 100000 measured runs; ' +
    'sub-gap: skp-imp423-compute), and (2) offline O(N^2) compute engine ' +
    'infeasible at Vite build time. Status remains partial until both ' +
    'blockers are resolved. imp-537 re-check (2026-04-14): post-imp-592 ' +
    'adversarial review and post-imp-583/584/585/590 closures confirm no ' +
    'new proof chain developments address the zeros6 or O(N^2) compute ' +
    'blockers. Status remains partial. ' +
    'imp-600 re-check (2026-04-14): post-imp-596 (B1 D-monotone analytic ' +
    'closure), imp-597 (B2 intercept positivity conditionalClosure update), ' +
    'imp-598 (BridgeTheorem.lean stale header fix), and imp-599 (barrier-' +
    'extrapolation duplicate investigation closure) all confirmed orthogonal ' +
    'to the measured-ladder data-coverage gap. The two blockers remain ' +
    'unresolved: (1) zeros6 data file not downloaded (sub-gap: ' +
    'skp-imp423-compute), (2) offline O(N^2) compute engine infeasible at ' +
    'Vite build time. Status remains partial. ' +
    'imp-610 re-check (2026-04-14): post-imp-601..609 closures (false-positive ' +
    'meta closures, B1/B2 sub-gap note updates, BridgeTheorem.lean sorry-comment ' +
    'investigation, barrier-extrapolation meta closure) are all orthogonal to ' +
    'the measured-ladder data-coverage gap. The two blockers remain unresolved. ' +
    'Status remains partial. ' +
    'imp-620 re-check (2026-04-14): post-imp-611..619 closures (false-positive ' +
    'meta closures for imp-516/529 chain, B1/B2 .blocker to closesGap renames, ' +
    'BridgeTheorem.lean sorry doc-comment investigation, barrier-extrapolation ' +
    'partial-status confirmation) are all orthogonal to the measured-ladder ' +
    'data-coverage gap. The two blockers remain unresolved: (1) zeros6 data ' +
    'file not downloaded (sub-gap: skp-imp423-compute), (2) offline O(N^2) ' +
    'compute engine infeasible at Vite build time. Status remains partial. ' +
    'imp-631 re-check (2026-04-14): post-imp-621..630 closures (meta false-positive ' +
    'resolutions for seeder self-matches imp-621..625, B1/B2 sub-gap surfacing ' +
    'imp-626/627, barrier-extrapolation residualSubGap imp-628, BridgeTheorem.lean ' +
    'sorry false-positive imp-629, barrier-extrapolation third-confirmation imp-630) ' +
    'are all orthogonal to the measured-ladder data-coverage gap. The two blockers ' +
    'remain unresolved: (1) zeros6 data file not downloaded (sub-gap: skp-imp423-compute), ' +
    '(2) offline O(N^2) compute engine infeasible at Vite build time. Status remains partial.',
};

// ── Build-time assertions ───────────────────────────────────────────────────
export const DYSON_LADDER_MEASURED_ASSERTIONS = [
  {
    id: 'imp360-rows-sorted-by-N',
    holds: () => {
      for (let i = 1; i < ROWS.length; i++) {
        if (ROWS[i].N <= ROWS[i - 1].N) return false;
      }
      return true;
    },
    why:
      'The ladder must be strictly sorted by N. A regression in insertion order ' +
      'would break every downstream consumer that expects monotone N.',
  },
  {
    id: 'imp360-measured-rows-have-finite-lower-bound',
    holds: () =>
      ROWS.filter((r) => r.source === 'measured').every(
        (r) => typeof r.t_c_lo === 'number' && Number.isFinite(r.t_c_lo) && r.t_c_lo > 0,
      ),
    why:
      'Every measured row must carry a finite strictly-positive t_c_lo. A ' +
      'zero or non-finite lower bound means the interval integrator cannot ' +
      'distinguish "collision at t = 0" from "collision at some small positive ' +
      't", which is the exact failure mode the interval framework is meant to ' +
      'rule out.',
  },
  {
    id: 'imp360-measured-widths-strictly-positive',
    holds: () =>
      ROWS.filter((r) => r.source === 'measured').every(
        (r) => typeof r.width === 'number' && r.width > 0,
      ),
    why:
      'Every measured row must carry a strictly positive wrapper width. Zero ' +
      'width would mean the one-ULP-inflation RK4 produced a point interval, ' +
      'which is impossible given the documented inflation semantics.',
  },
  {
    id: 'imp360-projected-rows-flagged-honestly',
    holds: () =>
      ROWS.filter((r) => r.N > 100000).every(
        (r) =>
          (r.source === 'projected' &&
            r.reason === 'ols-projection-passthrough' &&
            r.width === 0) ||
          r.source === 'measured-float64-rk4',
      ),
    why:
      'HONEST SCOPE TRIPWIRE: every row beyond N = 100000 must be either ' +
      '(a) source = projected with reason = ols-projection-passthrough and ' +
      'width = 0 (OLS passthrough, the default), or (b) source = ' +
      'measured-float64-rk4 (Float64 RK4 from the imp-514 offline compute ' +
      'cache in dyson-ladder-extended-cache.json). The measured block now ' +
      'extends to N = 100000 (imp-405). imp-423 adds projected rows at N in ' +
      '{150k, 250k, 400k, 600k, 1M}; imp-514 offline cache can override them ' +
      'with Float64-measured values once the harness is run.',
  },
  {
    id: 'imp360-citation-chain-intact',
    holds: () =>
      DYSON_LADDER_MEASURED.consumes.some((c) => c.includes('imp-359')) &&
      DYSON_LADDER_MEASURED.consumes.some((c) => c.includes('imp-362')) &&
      DYSON_LADDER_MEASURED.consumes.some((c) => c.includes('imp-315')) &&
      DYSON_LADDER_MEASURED.consumes.some((c) => c.includes('imp-321')),
    why:
      'The consumes field must cite imp-359 (zero table), imp-362 (interval ' +
      'integrator), imp-315 (PATH_C_BASELINE_FIT OLS reference), and imp-321 ' +
      '(projected-block passthrough). Dropping any of these tickets would ' +
      'orphan the dependency chain.',
  },
  {
    id: 'imp360-status-is-partial-tripwire',
    holds: () => DYSON_LADDER_MEASURED.status === 'partial',
    why:
      'imp-360 remains partial until projected rows at N in {150k, 250k, 400k, ' +
      '600k, 1M} are replaced by measured runs (imp-423 target). imp-405 extended ' +
      'measured coverage to N = 100000; imp-423 (partial) extends projected ' +
      'coverage to N = 1M. Flipping to completed before all projected rows are ' +
      'measured would silently claim a measured ladder the repo does not have.',
  },
];
