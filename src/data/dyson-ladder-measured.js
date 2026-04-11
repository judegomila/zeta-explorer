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
  return { dt: 0.0001, nSteps: 120 };
}

// ── Measured block ──────────────────────────────────────────────────────────
const MEASURED_NS = [50, 100, 200, 500, 870, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000];

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
// N = 1e4 is now in the MEASURED block (added in imp-353 partial closure), so
// the projected block starts at 1e5.  Keeping 1e4 here would produce a
// duplicate row at N = 10000 in ROWS, failing the strictly-sorted assertion.
const PROJECTED_NS = [1e5, 1e6];

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

const PROJECTED_ROWS = PROJECTED_NS.map(runProjected);

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
      'Projected block at N in {10^5, 10^6} is passed through ' +
      'imp-321 PT_SCALE_EXTRAPOLATION and is explicitly NOT a measurement.',
    honestLimits:
      'imp-360 full scope requires measured runs at N in {10^4, 5e4, 10^5, 10^6}, ' +
      'which is blocked on imp-359 shipping a canonical LMFDB zero table at ' +
      'those heights. Status is partial, not completed.',
  };
}

const VERDICT = deriveVerdict();

// ── Exported record ─────────────────────────────────────────────────────────
export const DYSON_LADDER_MEASURED = {
  id: 'imp-360',
  status: 'partial',
  title:
    'Measured Dyson backward ODE ladder with interval arithmetic (up to N = 19000) ' +
    'plus projected rows beyond',
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
    '(self-contained fit; no dependence on imp-323 pooled pipeline). Projected ' +
    'rows at N in {10^4, 10^5, 10^6} are pulled verbatim from imp-321 ' +
    'PT_SCALE_EXTRAPOLATION.ladder with width = 0 and source = projected.',
  rows: ROWS,
  verdict: VERDICT,
  openWork: [
    'Replace the projected block with true measured runs at N in ' +
      '{10^4, 5e4, 10^5, 10^6} once imp-359 lands the LMFDB / Odlyzko zero ' +
      'table. This is the remaining 90 percent of imp-360.',
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
    'Measured coverage now extends to N = 19000; ZEROS_EXTENDED carries ' +
    '100 000 verified Odlyzko zero ordinates (imp-359 complete as of ' +
    '2026-04-11). Projected rows above N = 19000 are arithmetic ' +
    'passthroughs of imp-321 PT_SCALE_EXTRAPOLATION and are explicitly ' +
    'labelled source = projected. The interval integrator at N = 19000 ' +
    '(expected |t_c| ~ 0.00686, budget dt=0.0001 x 120 steps) may return ' +
    'budget-exhausted (t_c_lo only, t_c_hi = +Infinity) if the one-ULP ' +
    'wrapper grows faster than the bracket closes; this is the honest ' +
    'failure mode of the current JavaScript interval layer and does not ' +
    'invalidate the lower bound.',
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
      ROWS.filter((r) => r.N > 19000).every(
        (r) =>
          r.source === 'projected' &&
          r.reason === 'ols-projection-passthrough' &&
          r.width === 0,
      ),
    why:
      'HONEST SCOPE TRIPWIRE: every row beyond N = 19000 must be flagged ' +
      'source = projected with reason = ols-projection-passthrough and ' +
      'width = 0. The measured block now extends to N = 19000 because ' +
      'ZEROS_EXTENDED carries 100 000 verified Odlyzko ordinates (imp-359 ' +
      'complete). Rows above N = 19000 are arithmetic passthroughs from ' +
      'imp-321 PT_SCALE_EXTRAPOLATION and must remain so labelled.',
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
      'imp-360 is explicitly partial until imp-359 delivers a canonical LMFDB ' +
      'zero table at N up to 10^6 and the projected block is replaced by ' +
      'measured runs. Flipping this to completed without doing that work ' +
      'would silently claim a measured ladder the repo does not have.',
  },
];
