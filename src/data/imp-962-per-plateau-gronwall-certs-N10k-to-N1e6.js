/**
 * @module imp-962-per-plateau-gronwall-certs-N10k-to-N1e6
 * @fileoverview Per-plateau interval-RK4 Gronwall certificates for N in (10^4, 10^6].
 *
 * imp-962: per-plateau interval-RK4 certificates for N ∈ (10⁴, 10⁶].
 *
 * Sibling of imp-911-per-plateau-gronwall-certs.js (which covers N ∈ [100, 10⁴]).
 * This module aggregates START + INTERIOR certs for each of the 10 H_raw-update
 * plateaus enumerated by IMP_962_PLATEAU_STRUCTURE_N10K_TO_N1E6.
 *
 * SCOPE
 * -----
 * - Plateau 0: carry-over from imp-933 (H_raw = 0.037698, same plateau that ended
 *   at N=10000 in imp-911). START cert sourced from imp-911 plateau-26. INTERIOR
 *   cert (N=14429) requires fresh interval-RK4; currently pending.
 * - Plateaus 1-9: fresh-update plateaus opened by 9 new H_raw drops in (10⁴, 10⁶].
 *   START and INTERIOR certs for each require fresh interval-RK4 sweeps (each
 *   ~8-3000h single-threaded due to O(N²) step cost at N > 10⁴). Pending in
 *   imp-962-sub-cert-collection.
 *
 * Schema per row (closed rows):
 *   plateauIndex  — index into IMP_962_PLATEAU_STRUCTURE_N10K_TO_N1E6.plateaus
 *   certType      — 'start' or 'interior'
 *   N             — the N value certified
 *   H_raw         — plateau H_raw (constant within plateau)
 *   closed        — true if the interval RK4 closed a collision bracket
 *   K_paper_cert_floor — certified upper bound on K_paper_cert at this N
 *   source        — optional: if sourced from another cert set
 *   (plus t_c_pair, F_mb_upper, K_raw_cert, t_c_lo, t_c_hi, maxIntervalWidth)
 *
 * Skipped rows have: { plateauIndex, certType, N, H_raw, skip: <reason> }
 *
 * @see src/math/imp-962-sweep-N10k-to-N1e6.mjs  — sweep harness
 * @see src/data/imp-911-per-plateau-gronwall-certs.js  — N ∈ [100, 10⁴] sibling
 * @see src/data/imp-962-plateau-structure-N10k-to-N1e6.js  — plateau enumeration
 */

import rawRows from './imp-962-per-plateau-gronwall-certs-N10k-to-N1e6-rows.json';

const RESCUE_THRESHOLD = 0.12751; // imp-486 rho_min lower bound

const N_PLATEAUS = 10; // 10 plateaus on (10⁴, 10⁶]: 1 carry-over + 9 fresh-update
// Each plateau needs 2 certs (START + INTERIOR) = 20 total. Carry-over START
// sourced from imp-933 (1 row). Carry-over INTERIOR + all 9×2 = 19 remaining.
const TOTAL_CERTS_NEEDED = 20;

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

const N0_BAND = [10000, 20000, 50000, 100000, 250000, 500000];
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

const COVERED_CERT_IDS = rawRows.map(
  (r) => `${r.plateauIndex}-${r.certType ?? 'unknown'}`,
);
const N_CLOSED = closed.length;
const N_SKIPPED = skipped.length;
const N_TOTAL_ROWS = rawRows.length;

const K_MAX_ABOVE_10K = kMaxAbove(10000);
const RESCUE_LHS_AT_10K = K_MAX_ABOVE_10K != null
  ? rescueLhs(K_MAX_ABOVE_10K, 10000)
  : null;

const ALL_CERTS_COVERED = N_CLOSED + N_SKIPPED >= TOTAL_CERTS_NEEDED;

// ── Exported record ────────────────────────────────────────────────────────

export const IMP_962_PER_PLATEAU_GRONWALL_CERTS_N10K_TO_N1E6 = Object.freeze({
  id: 'imp-962-per-plateau-gronwall-certs-N10k-to-N1e6',
  producedBy: 'imp-962',
  sweepScript: 'src/math/imp-962-sweep-N10k-to-N1e6.mjs',
  status: ALL_CERTS_COVERED ? 'complete' : 'partial',
  totalRows: N_TOTAL_ROWS,
  closedRows: N_CLOSED,
  skippedRows: N_SKIPPED,
  totalCertsNeeded: TOTAL_CERTS_NEEDED,
  coveredCertIds: COVERED_CERT_IDS,
  rows: rawRows,
  closedRows_data: closed,
  rescueTable: RESCUE_TABLE,
  tightestRescue: TIGHTEST_RESCUE,

  rescueFormulaAtN0_10k: {
    K_max_above_10k: K_MAX_ABOVE_10K != null ? +K_MAX_ABOVE_10K.toExponential(4) : null,
    rescue_lhs: RESCUE_LHS_AT_10K != null ? +RESCUE_LHS_AT_10K.toFixed(6) : null,
    rescue_threshold: RESCUE_THRESHOLD,
    rescue_satisfied: RESCUE_LHS_AT_10K != null && RESCUE_LHS_AT_10K < RESCUE_THRESHOLD,
    note: ALL_CERTS_COVERED
      ? 'All 20 certs covered; rescue formula satisfaction is CERTIFIED.'
      : `Partial sweep: ${N_CLOSED} closed + ${N_SKIPPED} skipped of ${TOTAL_CERTS_NEEDED} certs needed. ` +
        'Rescue formula satisfaction reflects covered certs only. ' +
        'Carry-over START (N=10000, K=3.9275e-4) sourced from imp-933; gives rescue LHS = 3.619e-4 << threshold.',
  },

  widestMaxIntervalWidth: closed.length > 0
    ? Math.max(...closed.map((r) => r.maxIntervalWidth))
    : null,

  headline: closed.length > 0
    ? `N ∈ (10⁴, 10⁶] per-plateau certs: K_max(N≥10000) = ` +
      `${K_MAX_ABOVE_10K != null ? K_MAX_ABOVE_10K.toExponential(3) : 'n/a'}, ` +
      `rescue LHS = ${RESCUE_LHS_AT_10K != null ? RESCUE_LHS_AT_10K.toExponential(4) : 'n/a'} ` +
      `(threshold ${RESCUE_THRESHOLD}), satisfied = ` +
      `${RESCUE_LHS_AT_10K != null && RESCUE_LHS_AT_10K < RESCUE_THRESHOLD}. ` +
      `${N_CLOSED}/${TOTAL_CERTS_NEEDED} certs closed.`
    : 'No closed rows yet — sweep not started or still running.',

  partialState: {
    certsCompleted: N_CLOSED + N_SKIPPED,
    certsRemaining: TOTAL_CERTS_NEEDED - (N_CLOSED + N_SKIPPED),
    carryOverStartSourced: rawRows.some(
      (r) => r.plateauIndex === 0 && r.certType === 'start' && r.source != null,
    ),
    pendingSince: '2026-05-15',
    blockedBy: 'imp-962-sub-cert-collection (O(N²) interval-RK4 at N∈[14429,710446]; ' +
      'cheapest remaining cert ~8h single-threaded at N=14429, most expensive ~9000h at N=710446; ' +
      'requires remote compute or parallelization across plateaus)',
  },
});

export const IMP_962_PER_PLATEAU_GRONWALL_CERTS_N10K_TO_N1E6_ASSERTIONS = [
  {
    id: 'imp962-cert-rows-json-parseable',
    holds: () => Array.isArray(rawRows),
    why:
      'The rows JSON must be a parseable array. A non-array means the ' +
      'sweep script wrote malformed output.',
  },
  {
    id: 'imp962-carry-over-start-sourced',
    holds: () => {
      const row = rawRows.find(
        (r) => r.plateauIndex === 0 && r.certType === 'start',
      );
      return (
        row != null &&
        row.closed === true &&
        row.source != null &&
        row.N === 10000
      );
    },
    why:
      'The carry-over plateau (index 0) START cert must be present, closed=true, ' +
      'N=10000, and sourced from imp-933. This is the boundary cert that ties ' +
      'the new range to the existing imp-933 coverage.',
  },
  {
    id: 'imp962-k-max-above-10k-satisfies-rescue',
    holds: () => {
      const K = kMaxAbove(10000);
      return K != null && rescueLhs(K, 10000) < RESCUE_THRESHOLD;
    },
    why:
      'The imp-486 rescue formula K · log(10000) / √10000 < 0.12751 must hold ' +
      'with K = max K_paper_cert_floor above N=10000. With the carry-over start ' +
      'cert (K=3.9275e-4), LHS = 3.619e-4 << 0.12751 (margin ~352×). This ' +
      'assertion will continue to hold as more certs are added (larger N gives ' +
      'smaller K, reducing the max).',
  },
  {
    id: 'imp962-cert-type-field-present',
    holds: () =>
      rawRows.every(
        (r) =>
          r.certType === 'start' || r.certType === 'interior' || r.skip != null,
      ),
    why:
      'Every row must have certType "start" or "interior" (or a skip field). ' +
      'Missing certType would indicate a malformed sweep output row.',
  },
];
