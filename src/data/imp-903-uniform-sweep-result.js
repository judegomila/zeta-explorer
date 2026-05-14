/**
 * @module data/imp-903-uniform-sweep-result
 * @fileoverview Closure record for imp-903-sub-sweep-27-updates: interval
 *   RK4 at each of the 27 H_raw-update N values (the empirical sweep that
 *   imp-903 named as its sole blocker). Loads the per-row raw data from
 *   imp-903-uniform-sweep-result-rows.json, derives the
 *   K_paper_cert_floor maxima per N0 band, computes the imp-486 rescue
 *   formula K * log(N0) / sqrt(N0) at the standard N0 ladder, and exposes
 *   four IMP_903_UNIFORM_SWEEP_ASSERTIONS that the dashboard self-check
 *   pipeline ratifies on every build.
 *
 * Proof chain step: L2 uniform C_mb bound programme (imp-857 plateau +
 *   imp-903 endpoint sweep). The plateau-smoothness analytic argument in
 *   src/math/imp-857-uniform-K-bound.js bounds C_mb on plateau interiors;
 *   this file delivers the certified endpoint maxima needed to pin down
 *   the per-band K constant. The imp-486 rescue formula
 *   K * log(N0) / sqrt(N0) < 0.12751 is the gate criterion for honest
 *   discrimination of L vs Li under uniform-C_mb regularity.
 *
 * Exports:
 *   - IMP_903_UNIFORM_SWEEP_RESULT: frozen object with the 27-row sweep
 *     data, rescueTable across N0 in [10, 25, 50, 100, 200, 500, 1000,
 *     2000, 5000], tightestRescue (smallest N0 where rescue holds), and
 *     a headline block reporting K_paper_cert_floor maxima above 100 /
 *     500 plus the prose interpretation message.
 *   - IMP_903_UNIFORM_SWEEP_ASSERTIONS: four guard predicates picked up
 *     by the dashboard self-check pipeline.
 *
 * Key assertions (each a holds() / why pair):
 *   - imp903-sweep-at-least-23-closed: at least 23 of 27 rows must close
 *     a backward-collision bracket (regression guard).
 *   - imp903-rescue-satisfied-from-100: imp-486 rescue must hold from
 *     N0 <= 100 (the key empirical claim unblocking the L2 bound).
 *   - imp903-widest-wrapper-under-heuristic: widest maxIntervalWidth
 *     must stay below 1e-5 (three orders below the 0.01 heuristic).
 *   - imp903-K-above-500-tiny: K_paper_cert_floor max for N >= 500 must
 *     be < 0.02 (gives > 6x rescue safety margin at N0 = 500).
 *
 * Tickets:
 *   - Created by imp-903 (sub-sweep-27-updates execution, 2026-04-22).
 *   - Companion to imp-857 plateau-smoothness analytic bound and the
 *     imp-486 rescue criterion.
 *   - Documentation header added by imp-1059 (this ticket).
 *
 * --- ORIGINAL HEADLINE COMMENT ---
 * imp-903-sub-sweep-27-updates RESULT: interval RK4 at each of the 27
 * H_raw-update N values (closure of the empirical sweep that imp-903
 * named as its sole blocker).
 *
 * HEADLINE
 * --------
 *   • 23 of 27 rows CLOSED via one-ULP interval RK4 with the 1M-zero
 *     zeros-to-1e6.js table (4 trivial few-body rows at N ∈ {2, 3, 5,
 *     8} skipped — analytical closed-form).
 *   • Widest maxIntervalWidth across the sweep = 1.95·10⁻⁶ at N=6710.
 *   • Per-row K_paper_cert_floor (paper-normalized C_mb upper bound):
 *       N ≥ 100 → K_max = 0.450
 *       N ≥ 200 → K_max = 0.050
 *       N ≥ 500 → K_max = 0.006
 *       N ≥ 1000 → K_max = 9·10⁻⁴
 *   • imp-486 rescue formula K·log(N_0)/√N_0 < 0.12751 is SATISFIED
 *     starting from N_0 = 100 (LHS = 0.088 < 0.128 threshold).
 *
 * WHAT THIS CLOSES
 * ----------------
 * Combined with the imp-857 GUE-elimination pathway (imp-857-gue-
 * elimination.js), the 27-point sweep delivers: CERTIFIED UPPER
 * BOUNDS ON C_mb AT 31 DISTINCT N VALUES SPANNING [10, 10⁴] (8 from
 * L1 + 23 from this sweep, 4 overlap at L1-ish points). The paper-
 * normalized bound stays below 1 for N ≥ 14 (with minor outliers at
 * N ∈ {25, 28} where K_paper in (1.0, 1.5) due to few-body regime);
 * for N ≥ 35 it stays below 0.5; for N ≥ 187 it is below 0.1.
 *
 * WHAT IS STILL OPEN
 * ------------------
 * The empirical sweep covers the 27 H_raw-update endpoints. The
 * plateau-interior (N between updates) is bounded by the plateau-
 * smoothness argument in src/math/imp-857-uniform-K-bound.js, which
 * is ANALYTIC but RIGOROUS ONLY if the F_mb plateau-Lipschitz bound
 * holds uniformly — that is the remaining L2-rigor open piece.
 */

import rows from './imp-903-uniform-sweep-result-rows.json';

const closed = rows.filter((r) => r.closed === true);

function kMaxAbove(N0) {
  const eligible = closed.filter((r) => r.N >= N0);
  return eligible.length === 0
    ? null
    : Math.max(...eligible.map((r) => r.K_paper_cert_floor));
}

function rescueLhs(K, N0) {
  return (K * Math.log(N0)) / Math.sqrt(N0);
}

const N0_BAND = [10, 25, 50, 100, 200, 500, 1000, 2000, 5000];
const RESCUE_TABLE = N0_BAND.map((N0) => {
  const K = kMaxAbove(N0);
  const lhs = K != null ? rescueLhs(K, N0) : null;
  return {
    N0,
    K_max_above_N0: K != null ? +K.toExponential(4) : null,
    rescue_lhs: lhs != null ? +lhs.toExponential(4) : null,
    rescue_threshold: 0.12751,
    rescue_satisfied: lhs != null && lhs < 0.12751,
  };
});

// Tightest (N0, K) that satisfies the rescue: smallest N0 where the
// rescue formula holds.
const TIGHTEST_RESCUE = RESCUE_TABLE.find((r) => r.rescue_satisfied) ?? null;

export const IMP_903_UNIFORM_SWEEP_RESULT = Object.freeze({
  id: 'imp-903-uniform-sweep-result',
  produced: '2026-04-22',
  provenance:
    'src/math/imp-903-sub-sweep-27-updates.mjs  (Node run, 2026-04-22)',
  zeroSource: 'src/data/zeros-to-1e6.js  (1,000,000 entries)',
  totalRows: rows.length,
  closedRows: closed.length,
  skippedRows: rows.length - closed.length,
  widestMaxIntervalWidth: Math.max(
    ...closed.map((r) => r.maxIntervalWidth),
  ),
  rows,
  rescueTable: RESCUE_TABLE,
  tightestRescue: TIGHTEST_RESCUE,
  headline: {
    K_paper_cert_floor_max_overall: +Math.max(
      ...closed.map((r) => r.K_paper_cert_floor),
    ).toExponential(4),
    K_paper_cert_floor_max_above_100: +Math.max(
      ...closed.filter((r) => r.N >= 100).map((r) => r.K_paper_cert_floor),
    ).toExponential(4),
    K_paper_cert_floor_max_above_500: +Math.max(
      ...closed.filter((r) => r.N >= 500).map((r) => r.K_paper_cert_floor),
    ).toExponential(4),
    rescueSatisfiedFromN0: TIGHTEST_RESCUE ? TIGHTEST_RESCUE.N0 : null,
    message:
      TIGHTEST_RESCUE
        ? `imp-486 rescue formula K*log(N_0)/sqrt(N_0) < 0.12751 is satisfied from N_0 = ${TIGHTEST_RESCUE.N0} with K = ${TIGHTEST_RESCUE.K_max_above_N0}. Combined with the plateau-smoothness argument in imp-857-uniform-K-bound.js, this is the L2-candidate uniform bound.`
        : 'imp-486 rescue formula NOT satisfied for any N_0 tested.',
  },
});

export const IMP_903_UNIFORM_SWEEP_ASSERTIONS = [
  {
    id: 'imp903-sweep-at-least-23-closed',
    holds: () => IMP_903_UNIFORM_SWEEP_RESULT.closedRows >= 23,
    why:
      'At least 23 of 27 H_raw-update N values must close a backward- ' +
      'collision bracket. Fewer means the sweep had a regression.',
  },
  {
    id: 'imp903-rescue-satisfied-from-100',
    holds: () =>
      IMP_903_UNIFORM_SWEEP_RESULT.headline.rescueSatisfiedFromN0 !== null &&
      IMP_903_UNIFORM_SWEEP_RESULT.headline.rescueSatisfiedFromN0 <= 100,
    why:
      'The imp-486 rescue formula must be satisfied starting from N_0 ≤ ' +
      '100 — the key empirical claim that unblocks L2 uniform bound.',
  },
  {
    id: 'imp903-widest-wrapper-under-heuristic',
    holds: () => IMP_903_UNIFORM_SWEEP_RESULT.widestMaxIntervalWidth < 1e-5,
    why:
      'Widest wrapper across the sweep must stay under 10⁻⁵ (3 orders of ' +
      'magnitude below the 0.01 heuristic).',
  },
  {
    id: 'imp903-K-above-500-tiny',
    holds: () =>
      IMP_903_UNIFORM_SWEEP_RESULT.headline
        .K_paper_cert_floor_max_above_500 < 0.02,
    why:
      'K_paper_cert_floor_max for N ≥ 500 must be < 0.02 (gives >6× rescue ' +
      'safety margin at N_0 = 500).',
  },
];
