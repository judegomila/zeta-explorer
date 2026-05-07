/**
 * @module imp-962-plateau-structure-N10k-to-N1e6
 * @fileoverview imp-962 HONEST PARTIAL: plateau-structure scan + rescue-formula
 * budget for the proposed extension of the imp-933 per-plateau interval-RK4
 * sweep above N = 10⁴.
 *
 * imp-962 asked: extend the unconditional finite-K closure (imp-963 on
 * N ∈ [100, 10⁴]) up to the full N* = 10⁶ headline by running per-plateau
 * interval-RK4 certificates at every H_raw-update point in (10⁴, 10⁶]. The
 * imp-962 description estimated "30-50 new plateaus" and a 50-200 h compute
 * budget single-threaded.
 *
 * THIS PARTIAL delivers the cheap analytic prerequisite — the plateau
 * structure itself — by scanning ZEROS_EXTENDED for H_raw drops on
 * (10⁴, 10⁶]. RESULT: only 9 H_raw-update points exist (10 plateaus total),
 * far below the 30-50 estimate. This compresses the predicted compute budget
 * by ~3-5× and gives a concrete cert-collection schedule. The actual
 * interval-RK4 sweep at each plateau remains the load-bearing sub-gap and is
 * tracked as imp-962-sub-cert-collection.
 *
 * SCOPE
 * -----
 * - DOES: enumerate the H_raw-update points and plateau intervals on
 *   (10⁴, 10⁶], compute per-plateau smooth-scale ratios (the multiplicative
 *   slack from the 1/(√N · log N) factor on each plateau), and report the
 *   maximum K_paper_cert that the rescue formula tolerates at N_0 = 10⁴.
 * - DOES NOT: run the interval-RK4 sweep itself. That is the open sub-gap.
 *
 * @see imp-962
 * @see imp-933
 * @see imp-963
 * @see src/math/imp-857-uniform-K-bound.js  — analog scan on N ∈ [2, 10⁴]
 */

import { ZEROS_EXTENDED } from './zeros-to-1e6.js';

const N_MIN = 10000;
const N_MAX = 1000000;
const RESCUE_THRESHOLD = 0.12751; // imp-486 rho_min lower bound

// ── 1. Compute H_raw at N = 10⁴ from the imp-933 closeout state ───────────
// H_raw is the running min of consecutive zero gaps at indices 1..N-1.
// We re-scan from N=2 to N=10⁴ to anchor the running min, then continue the
// scan into (10⁴, 10⁶] and record drops.
function scanHRawUpdates(zeros, nMinExclusive, nMaxInclusive) {
  let H = Infinity;
  for (let N = 2; N <= nMinExclusive; N++) {
    const gap = zeros[N - 1] - zeros[N - 2];
    if (gap < H) H = gap;
  }
  const anchorH = H;
  const updates = [];
  for (let N = nMinExclusive + 1; N <= nMaxInclusive; N++) {
    const gap = zeros[N - 1] - zeros[N - 2];
    if (gap < H) {
      H = gap;
      updates.push({ N, newH_raw: +gap.toFixed(8) });
    }
  }
  return { anchorH_at_N_MIN: anchorH, finalH_at_N_MAX: H, updates };
}

const SCAN = scanHRawUpdates(ZEROS_EXTENDED, N_MIN, N_MAX);
const H_RAW_UPDATES = SCAN.updates;

// ── 2. Build plateau intervals on (10⁴, 10⁶] ───────────────────────────────
// Plateau 0 is the carry-over plateau: H_raw is held at its N=10⁴ value
// until the first update inside the range.
const PLATEAUS = (() => {
  const result = [];
  // Carry-over plateau
  result.push({
    plateauIndex: 0,
    startN: N_MIN,
    endN: H_RAW_UPDATES.length > 0 ? H_RAW_UPDATES[0].N - 1 : N_MAX,
    H_raw: +SCAN.anchorH_at_N_MIN.toFixed(8),
    type: 'carry-over-from-imp-933',
  });
  // Each H_raw drop opens a new plateau
  H_RAW_UPDATES.forEach((u, i) => {
    const endsAt =
      i + 1 < H_RAW_UPDATES.length ? H_RAW_UPDATES[i + 1].N - 1 : N_MAX;
    result.push({
      plateauIndex: i + 1,
      startN: u.N,
      endN: endsAt,
      H_raw: u.newH_raw,
      type: 'fresh-update',
    });
  });
  return result;
})();

// ── 3. Per-plateau smooth-scale-factor ratio ───────────────────────────────
// On each plateau the K_paper_cert variation from the 1/(√N · log N) factor
// is bounded above by f(startN) / f(endN), where f(N) = 1/(√N · log N).
// f is monotonically decreasing in N for N ≥ 3, so this ratio is ≥ 1.
// On the L1 plateaus in [50, 10⁴] this ratio stayed below 1.7 — anything
// dramatically larger here would invalidate the plateau-Lipschitz argument
// and force a denser cert grid.
function smoothScaleRatio(startN, endN) {
  const f = (N) => 1 / (Math.sqrt(N) * Math.log(N));
  return f(startN) / f(endN);
}

const PLATEAUS_WITH_RATIO = PLATEAUS.map((p) => ({
  ...p,
  smoothRatio: +smoothScaleRatio(p.startN, p.endN).toFixed(4),
  width: p.endN - p.startN + 1,
}));

const MAX_SMOOTH_RATIO = Math.max(
  ...PLATEAUS_WITH_RATIO.map((p) => p.smoothRatio),
);

// ── 4. Rescue-formula budget at N_0 = 10⁴ ──────────────────────────────────
// The imp-486 rescue formula: K · log(N_0) / √N_0 < 0.12751.
// Solving for the max K admissible at N_0 = 10⁴:
//    K_max_admissible = 0.12751 · √N_0 / log(N_0)
function rescueBudgetK(N0) {
  return (RESCUE_THRESHOLD * Math.sqrt(N0)) / Math.log(N0);
}

const K_BUDGET_AT_N0_10K = rescueBudgetK(N_MIN);
const K_BUDGET_AT_N0_1E5 = rescueBudgetK(100000);
const K_BUDGET_AT_N0_1E6 = rescueBudgetK(N_MAX);

// Empirical extrapolation (informational only — NOT a certificate):
// The imp-933 sweep gave K_paper_cert_floor ranging from 4e-4 (at N=10000) up
// to 0.2014 (the headline maximum at N=100). On (10⁴, 10⁶] we expect the same
// 1/(√N · log N) suppression to dominate, so the K values should be smaller
// than 4e-4 unless the F_mb factor regresses unexpectedly. The K budget at
// N_0 = 10⁴ is K ≤ 1.3845, leaving an extrapolation margin of ~3500× over
// the imp-933 N=10000 value. Even at N_0 = 10⁶ the budget is K ≤ 9.224, so
// the rescue formula has enormous slack here — the binding constraint is
// the existence of the certificates, not their magnitude.

// ── Exported record ────────────────────────────────────────────────────────

export const IMP_962_PLATEAU_STRUCTURE_N10K_TO_N1E6 = Object.freeze({
  id: 'imp-962-plateau-structure-N10k-to-N1e6',
  ticket: 'imp-962',
  status: 'partial-plateau-structure-only',
  closes: [],
  partialOf: 'imp-962',
  scope:
    'Cheap analytic prerequisite for imp-962: enumerate the H_raw-update ' +
    'plateau structure on N ∈ (10⁴, 10⁶] from ZEROS_EXTENDED. The actual ' +
    'interval-RK4 cert sweep at each plateau remains pending as ' +
    'imp-962-sub-cert-collection.',

  headline:
    'On N ∈ (10⁴, 10⁶], H_raw drops only 9 times (10 plateaus including ' +
    'the carry-over). This is far below the imp-962 description estimate ' +
    'of "30-50 new plateaus", compressing the predicted cert-sweep budget ' +
    'from 50-200 h to roughly 10-40 h single-threaded (still parallelizable).',

  range: { N_MIN, N_MAX },
  anchorH_at_N_MIN: +SCAN.anchorH_at_N_MIN.toFixed(8),
  finalH_at_N_MAX: +SCAN.finalH_at_N_MAX.toFixed(8),
  hRawUpdates: H_RAW_UPDATES,
  plateaus: PLATEAUS_WITH_RATIO,
  plateauCount: PLATEAUS_WITH_RATIO.length,
  hRawUpdateCount: H_RAW_UPDATES.length,
  maxSmoothScaleRatio: +MAX_SMOOTH_RATIO.toFixed(4),

  rescueBudget: {
    N_0: N_MIN,
    K_max_admissible_at_N_0_10k: +K_BUDGET_AT_N0_10K.toFixed(4),
    K_max_admissible_at_N_0_1e5: +K_BUDGET_AT_N0_1E5.toFixed(4),
    K_max_admissible_at_N_0_1e6: +K_BUDGET_AT_N0_1E6.toFixed(4),
    threshold: RESCUE_THRESHOLD,
    note:
      'Maximum K_paper_cert that still admits the imp-486 rescue formula ' +
      'at the listed N_0. The imp-933 sweep delivered K = 0.2014 above ' +
      'N=100; the budget at N_0 = 10⁴ is K ≤ 1.3845, so a future cert ' +
      'sweep on (10⁴, 10⁶] has ~7× slack over the imp-933 headline.',
  },

  remainingSubGap: {
    id: 'imp-962-sub-cert-collection',
    statement:
      'Run interval-RK4 certificates at the 10 plateaus enumerated here: ' +
      'one cert at each plateau-START (analog of imp-903) and one at the ' +
      'plateau-INTERIOR (analog of imp-933). Aggregate max into a finite-K ' +
      'extension table and update finite-k-c-mb-unconditional.js to cover ' +
      'N ∈ [100, 10⁶]. Compute-bound at the plateau interiors near N = 10⁶ ' +
      '(per-step cost is O(N²)).',
    estimatedRuntimeHours:
      '10-40 h single-threaded (10 plateaus × 1-4 h each, with the ' +
      'cost dominated by the plateaus near N = 10⁶). Parallelizable across ' +
      'plateaus — schedulable as a remote routine analogous to the ' +
      'imp-933 sweep harness.',
    schedulableAs: 'remote-routine analogous to trig_01PuFDCKbFE5EK4fssuEiMRc',
  },

  consequencesIfClosed: [
    'imp-440 finite-height beat: Λ ≤ 0.121 unconditional on N ∈ [100, 10⁶] ' +
      '(currently unconditional on [100, 10⁴], conditional on (10⁴, 10⁶]).',
    'imp-835: imp-440 completion sub-gap closed at the full N* = 10⁶ level.',
    'imp-962 closes; SOTA_LAMBDA_CLAIM secondary headline can flip to ' +
      '"FULLY UNCONDITIONAL on N ∈ [100, 10⁶]".',
  ],

  provenance: {
    zerosSource: 'src/data/zeros-to-1e6.js (Odlyzko zeros1..zeros10)',
    scanScript: 'inline scan in this module (deterministic from ZEROS_EXTENDED)',
    relatedScans: [
      'src/math/imp-857-uniform-K-bound.js — analog scan on [2, 10⁴]',
    ],
  },
});

export const IMP_962_PLATEAU_STRUCTURE_ASSERTIONS = [
  {
    id: 'imp962-h-raw-update-count-le-50',
    holds: () => H_RAW_UPDATES.length <= 50,
    why:
      'imp-962 description estimated 30-50 new plateaus. The actual ' +
      'count must not exceed that estimate; if it does, the partial ' +
      'closure underestimates the cert budget and needs a re-scan.',
  },
  {
    id: 'imp962-h-raw-strictly-decreasing',
    holds: () => {
      for (let i = 1; i < H_RAW_UPDATES.length; i++) {
        if (H_RAW_UPDATES[i].newH_raw >= H_RAW_UPDATES[i - 1].newH_raw) {
          return false;
        }
      }
      return true;
    },
    why:
      'H_raw is a running min over consecutive zero gaps, so by ' +
      'construction the recorded update values must form a strictly ' +
      'decreasing sequence. A violation would indicate a scan bug.',
  },
  {
    id: 'imp962-anchor-matches-imp933-final-H_raw',
    holds: () => {
      // imp-933 sweep observed H_raw = 0.037698 at N=10000 (per the
      // imp-857-uniform-K-bound.js comment block). Allow a small tolerance.
      const expected = 0.037698;
      return Math.abs(SCAN.anchorH_at_N_MIN - expected) < 1e-4;
    },
    why:
      'The H_raw value at N=10⁴ should match the imp-933 sweep boundary ' +
      'value 0.037698. A mismatch would indicate the ZEROS_EXTENDED ' +
      'array drifted or the scan anchored incorrectly.',
  },
  {
    id: 'imp962-rescue-budget-at-N0-10k-positive',
    holds: () => K_BUDGET_AT_N0_10K > 0.5,
    why:
      'The rescue-formula K budget at N_0 = 10⁴ must comfortably exceed ' +
      'the imp-933 headline K = 0.2014. A sub-0.5 budget would leave ' +
      'no extrapolation slack for the future cert sweep on (10⁴, 10⁶].',
  },
  {
    id: 'imp962-plateaus-cover-full-range',
    holds: () => {
      const first = PLATEAUS_WITH_RATIO[0];
      const last = PLATEAUS_WITH_RATIO[PLATEAUS_WITH_RATIO.length - 1];
      return first.startN === N_MIN && last.endN === N_MAX;
    },
    why:
      'Plateau intervals must tile [10⁴, 10⁶] exactly (first.startN = ' +
      '10⁴, last.endN = 10⁶). A gap or overlap would indicate a ' +
      'plateau-construction bug.',
  },
];
