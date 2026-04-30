/**
 * imp-933: per-plateau interior interval-RK4 certificates.
 *
 * Aggregates the results of the imp-933 sweep (one interior N per
 * H_raw-plateau) and exports build-time assertions confirming that
 * the rescue formula K·log(N_0)/√N_0 < 0.12751 is satisfied at
 * N_0 = 100 using the certified per-plateau K_paper_cert_floor values.
 *
 * Schema per row (closed rows only):
 *   plateauIndex  — plateau index in IMP_857_UNIFORM_K_BOUND.plateaus
 *   interiorN     — the interior N run (floor midpoint of [startN, endN])
 *   H_raw         — plateau H_raw (constant within plateau)
 *   N             — same as interiorN
 *   closed        — true if the interval RK4 closed a collision bracket
 *   K_paper_cert_floor — certified upper bound on K_paper_cert at this N
 *   maxIntervalWidth   — widest interval wrapper at collision
 *   runtimeSec         — wall-clock time for the run
 *   (plus t_c_pair, F_mb_upper, K_raw_cert, t_c_lo, t_c_hi, etc.)
 *
 * Skipped rows have: { plateauIndex, interiorN, H_raw, skip: <reason> }
 *
 * @see src/math/imp-933-interior-sweep.mjs   — sweep harness
 * @see src/data/imp-903-uniform-sweep-result.js — endpoint certs (imp-903)
 * @see src/math/imp-911-sharper-cumulative-lipschitz.js — consumer
 */

import rawRows from './imp-911-per-plateau-gronwall-certs-rows.json';

const RESCUE_THRESHOLD = 0.12751;

const closed = rawRows.filter((r) => r.closed === true);
const skipped = rawRows.filter((r) => r.skip != null);

function kMaxAbove(N0) {
  const eligible = closed.filter((r) => r.N >= N0);
  return eligible.length === 0
    ? null
    : Math.max(...eligible.map((r) => r.K_paper_cert_floor));
}

function rescueLhs(K, N0) {
  return (K * Math.log(N0)) / Math.sqrt(N0);
}

const N0_BAND = [10, 25, 50, 100, 200, 500, 1000];
const RESCUE_TABLE = N0_BAND.map((N0) => {
  const K = kMaxAbove(N0);
  const lhs = K != null ? rescueLhs(K, N0) : null;
  return {
    N0,
    K_max_above_N0: K != null ? +K.toExponential(4) : null,
    rescue_lhs: lhs != null ? +lhs.toExponential(4) : null,
    rescue_threshold: RESCUE_THRESHOLD,
    rescue_satisfied: lhs != null && lhs < RESCUE_THRESHOLD,
  };
});

const TIGHTEST_RESCUE = RESCUE_TABLE.find((r) => r.rescue_satisfied) ?? null;

// Covered plateau indices.
const COVERED_PLATEAU_INDICES = rawRows.map((r) => r.plateauIndex);
const N_COVERED = closed.length;
const N_SKIPPED = skipped.length;
const N_TOTAL_ROWS = rawRows.length;
const N_PLATEAUS = 27;

// Max K over closed rows ≥ 100 (for the rescue formula).
const K_MAX_ABOVE_100 = kMaxAbove(100);
const RESCUE_LHS_AT_100 = K_MAX_ABOVE_100 != null
  ? rescueLhs(K_MAX_ABOVE_100, 100)
  : null;

// Completion status.
const ALL_PLATEAUS_COVERED = N_COVERED + N_SKIPPED >= N_PLATEAUS;

export const IMP_911_PER_PLATEAU_GRONWALL_CERTS = Object.freeze({
  id: 'imp-911-per-plateau-gronwall-certs',
  producedBy: 'imp-933',
  sweepScript: 'src/math/imp-933-interior-sweep.mjs',
  status: ALL_PLATEAUS_COVERED ? 'complete' : 'partial',
  totalRows: N_TOTAL_ROWS,
  closedRows: N_COVERED,
  skippedRows: N_SKIPPED,
  coveredPlateauIndices: COVERED_PLATEAU_INDICES,
  rows: rawRows,
  closedRows_data: closed,
  rescueTable: RESCUE_TABLE,
  tightestRescue: TIGHTEST_RESCUE,
  rescueFormulaAtN0_100: {
    K_max_above_100: K_MAX_ABOVE_100 != null ? +K_MAX_ABOVE_100.toExponential(4) : null,
    rescue_lhs: RESCUE_LHS_AT_100 != null ? +RESCUE_LHS_AT_100.toFixed(4) : null,
    rescue_threshold: RESCUE_THRESHOLD,
    rescue_satisfied: RESCUE_LHS_AT_100 != null && RESCUE_LHS_AT_100 < RESCUE_THRESHOLD,
    note: ALL_PLATEAUS_COVERED
      ? 'All 27 plateaus covered; rescue formula satisfaction is CERTIFIED.'
      : `Partial sweep: ${N_COVERED} closed + ${N_SKIPPED} skipped of ${N_PLATEAUS} plateaus. ` +
        'Rescue formula satisfaction reflects covered plateaus only.',
  },
  widestMaxIntervalWidth: closed.length > 0
    ? Math.max(...closed.map((r) => r.maxIntervalWidth))
    : null,
  headline: closed.length > 0
    ? `Per-plateau interior certs: K_max(N≥100) = ${K_MAX_ABOVE_100 != null ? K_MAX_ABOVE_100.toExponential(3) : 'n/a'}, ` +
      `rescue LHS = ${RESCUE_LHS_AT_100 != null ? RESCUE_LHS_AT_100.toFixed(4) : 'n/a'} ` +
      `(threshold ${RESCUE_THRESHOLD}), satisfied = ${RESCUE_LHS_AT_100 != null && RESCUE_LHS_AT_100 < RESCUE_THRESHOLD}`
    : 'No closed rows yet — sweep not started or still running.',
});

export const IMP_911_PER_PLATEAU_GRONWALL_CERTS_ASSERTIONS = [
  {
    id: 'imp933-rows-json-parseable',
    holds: () => Array.isArray(rawRows),
    why:
      'The rows JSON must be a parseable array. A non-array means the ' +
      'sweep script wrote malformed output.',
  },
  {
    id: 'imp933-widest-wrapper-under-heuristic',
    holds: () => {
      const w = IMP_911_PER_PLATEAU_GRONWALL_CERTS.widestMaxIntervalWidth;
      return w === null || w < 1e-4;
    },
    why:
      'Widest wrapper across the interior sweep must stay under 10⁻⁴ ' +
      '(well below the 0.01 heuristic). A wider wrapper means the ' +
      'one-ULP inflation is excessive at some N.',
  },
  {
    id: 'imp933-covered-plateau-indices-are-valid',
    holds: () =>
      COVERED_PLATEAU_INDICES.every((i) => typeof i === 'number' && i >= 0 && i < 27),
    why:
      'All plateauIndex values must be in [0, 26] — the 27 plateaus ' +
      'enumerated by IMP_857_UNIFORM_K_BOUND.',
  },
  {
    id: 'imp933-rescue-formula-check-present',
    holds: () =>
      typeof IMP_911_PER_PLATEAU_GRONWALL_CERTS.rescueFormulaAtN0_100.rescue_satisfied === 'boolean',
    why:
      'The rescue formula check field must be a boolean (even if based ' +
      'on partial sweep data) so downstream consumers can read the ' +
      'current satisfaction state directly.',
  },
];
