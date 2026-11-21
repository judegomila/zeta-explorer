/**
 * imp-95131-ythaw-o4-tail-requirement — y-thaw 0.17759432 package: MEASURE the
 * O4 analytic-tail obligation at y = 0.1808 (N > 3840000).
 *
 * GRADE: MEASUREMENT ONLY. This module quantifies WHAT the O4 tail leg must
 * establish and the margin it has to work with; it does NOT derive or certify
 * an analytic tail bound. O4 stays OPEN. Changes no bound; NO QED.
 * No refereed bound is changed.
 *
 * WHAT O4 IS (ledger row 10 of formalization/y-thaw-01775943/
 * SHARP_WEIGHT_NATIVE_BINDING.md, section 6): the stage-2 sweep
 * (imp-95208-ythaw STAGE2) certifies the normalized sharp floor T_N > 0 row
 * by row only on the FINITE lane N = 690988..3840000. Everything past the
 * right edge N > 3840000 is the analytic tail: it needs an N-UNIFORM analytic
 * lower bound (an explicit decreasing majorant on the disk-radius gap g_N and
 * on the summand tail S_N, giving T_N >= 1 - g-bar(N) - s-bar(N)), not a
 * per-row sweep. The sealed tail legs exist only at y >= 0.187272; O4 is to
 * re-close them at the thawed floor y = 0.1808.
 *
 * WHAT THIS MEASURES (from the STAGE2 terminal p23 family, the 14 shards that
 * carry the lane up to the right edge):
 *  - the tail-entry sharp floor at the boundary N = 3840000 is 0.325311061495
 *    (STAGE2 last shard [3750000, 3840000], argmin at its left edge 3750000);
 *  - the sharp floor is MONOTONE INCREASING and CONCAVE (increments strictly
 *    decreasing, 0.018883 -> 0.006787 per 1.6e5 step) across the whole
 *    terminal family, consistent with the normalized head 1 - g_N rising
 *    toward 1 as g_N, S_N decrease in N;
 *  - the required tail estimate is T_N >= E_max_prime = 2.43878668361931290e-7
 *    (the imp-95212 O3 certified error budget) for every N > 3840000, so that
 *    |f_t| clears the analytic error terms; the measured tail-entry floor
 *    exceeds that threshold by a factor 1.33e6;
 *  - the tail is NOT the binding region: its entry floor 0.325311 is 5.19x the
 *    stage-2 global interior minimum 0.062718178029 (at N = 690996), which is
 *    what actually pins the package margin.
 *
 * HONEST GAP: the empirical trajectory says the tail floor keeps rising, but
 * an analytic proof needs explicit majorants g-bar(N) >= g_N and s-bar(N) >=
 * S_N valid for ALL N > 3840000 at y = 0.1808. Those are the sealed tail legs
 * anchored at y >= 0.187272; porting them (as the O3 budget ported, with a
 * small structural single-factor y-growth) is EXPECTED but is NOT done or
 * certified here. Until the majorants are re-derived at y = 0.1808, O4 stays
 * OPEN and 0.17759432 is a package value, not a bound.
 */

// ── terminal p23 family shard minima (Nstart, minL12) from imp-95208 STAGE2 ──
// The 14 shards that carry the lane from where the floor becomes monotone up to
// the right edge N = 3840000 (the last shard [3750000, 3840000]).
export const O4_TAIL_TRAJECTORY = [
  [1670000, 0.180066864934],
  [1830000, 0.198949514617],
  [1990000, 0.215657735504],
  [2150000, 0.230584936149],
  [2310000, 0.244031024125],
  [2470000, 0.256229193728],
  [2630000, 0.267364009416],
  [2790000, 0.277583755035],
  [2950000, 0.287009093409],
  [3110000, 0.2957394234],
  [3270000, 0.303857480187],
  [3430000, 0.311432733338],
  [3590000, 0.318524051581],
  [3750000, 0.325311061495], // shard runs to the tail boundary N = 3840000
];

export const O4_TAIL_REQUIREMENT = {
  obligation: 'O4',
  verdict: 'OPEN — analytic tail majorants at y = 0.1808 not derived; requirement measured',
  grade: 'measurement only (no analytic tail bound produced)',
  tailBoundaryN: 3840000, // right edge of the STAGE2 finite lane
  tailEntryFloor: 0.325311061495, // certified sharp floor at the boundary (STAGE2 last shard)
  tailEntryArgminN: 3750000,
  monotoneIncreasing: true, // floor rises across the whole terminal family
  concave: true, // increments strictly decreasing => concave increasing
  firstIncrement: 0.018883, // 1670000 -> 1830000, per 1.6e5 step
  lastIncrement: 0.006787, // 3590000 -> 3750000, per 1.6e5 step
  // required tail estimate: |f_t| must clear the error budget for all N > 3840000
  requiredThreshold: 2.43878668361931290e-7, // = imp-95212 O3 E_max_prime
  requiredThresholdSource: 'imp-95212-ythaw-o5-o3 O3_ERROR_BUDGET.EmaxNew',
  tailEntryMargin: 0.325310817616, // tailEntryFloor - requiredThreshold, MEASURED (not certified for N>boundary)
  tailEntryRatio: 1.3339e6, // tailEntryFloor / requiredThreshold
  // the tail is not the binding region
  globalInteriorMin: 0.062718178029, // STAGE2 globalMin at N = 690996
  tailEntryOverInteriorMin: 5.1869, // tailEntryFloor / globalInteriorMin
  // what is still needed to CLOSE O4 (not done here)
  missingForClosure:
    'an N-uniform analytic lower bound T_N >= 1 - g-bar(N) - s-bar(N) for all N > 3840000 ' +
    'at y = 0.1808, with explicit decreasing majorants g-bar(N) >= g_N and s-bar(N) >= S_N; ' +
    'the sealed tail legs supply these only at y >= 0.187272',
  portingExpectation:
    'EXPECTED to port like the O3 budget (small structural single-factor y-growth, ' +
    'row-level chain is pointwise in y per STAGE1) — NOT certified here',
  changesBound: false,
  qed: false,
};

export const IMP_95131_YTHAW_O4 = {
  id: 'imp-95131-ythaw-o4-tail-requirement',
  title:
    'y-thaw package O4 (analytic tail N > 3840000 at y = 0.1808): requirement + margin MEASURED — tail-entry floor 0.325311 (monotone rising, 1.33e6x the O3 budget), analytic majorants NOT derived, O4 stays OPEN',
  trajectory: O4_TAIL_TRAJECTORY,
  requirement: O4_TAIL_REQUIREMENT,
  note: 'formalization/y-thaw-01775943/SHARP_WEIGHT_NATIVE_BINDING.md section 6, ledger row 10',
};

// ── assertions (import-light; doubles over the baked shard minima) ──────────
export const IMP_95131_ASSERTIONS = [
  {
    id: 'imp-95131-o4-tail-monotone-concave',
    holds: () => {
      const t = O4_TAIL_TRAJECTORY;
      if (t.length !== 14) return false;
      let prevInc = Infinity;
      for (let i = 1; i < t.length; i++) {
        const inc = t[i][1] - t[i - 1][1];
        if (inc <= 0) return false; // strictly increasing floor
        if (inc >= prevInc) return false; // strictly decreasing increments (concave)
        prevInc = inc;
      }
      return (
        t[t.length - 1][1] === O4_TAIL_REQUIREMENT.tailEntryFloor &&
        t[t.length - 1][0] === O4_TAIL_REQUIREMENT.tailEntryArgminN
      );
    },
    why: 'The terminal p23 family sharp floor is strictly increasing and strictly concave (increments 0.018883 -> 0.006787 per 1.6e5 step) up to the tail boundary N = 3840000 — the normalized head 1 - g_N rising toward 1 as the disk-radius gap and summand tail decrease, so the tail region grows away from the constraint rather than toward it.',
  },
  {
    id: 'imp-95131-o4-tail-entry-margin-vs-budget',
    holds: () => {
      const { tailEntryFloor, requiredThreshold, tailEntryMargin, tailEntryRatio } =
        O4_TAIL_REQUIREMENT;
      return (
        requiredThreshold > 2.4387e-7 &&
        requiredThreshold < 2.4388e-7 &&
        Math.abs(tailEntryFloor - requiredThreshold - tailEntryMargin) < 1e-9 &&
        Math.abs(tailEntryFloor / requiredThreshold - tailEntryRatio) < 1e2 &&
        tailEntryRatio > 1.3e6 &&
        tailEntryMargin > 0.325
      );
    },
    why: 'The required tail estimate is |f_t| >= E_max_prime = 2.43878668361931290e-7 (the imp-95212 O3 certified budget) for all N > 3840000; the MEASURED tail-entry sharp floor 0.325311061495 clears it by margin 0.325310817616 (ratio 1.33e6) — the analytic tail has six orders of headroom to the budget at its entry point.',
  },
  {
    id: 'imp-95131-o4-tail-not-binding',
    holds: () => {
      const { tailEntryFloor, globalInteriorMin, tailEntryOverInteriorMin } =
        O4_TAIL_REQUIREMENT;
      return (
        Math.abs(tailEntryFloor / globalInteriorMin - tailEntryOverInteriorMin) < 1e-3 &&
        tailEntryOverInteriorMin > 5 &&
        tailEntryFloor > globalInteriorMin
      );
    },
    why: 'The tail-entry floor 0.325311 is 5.19x the stage-2 global interior minimum 0.062718178029 (at N = 690996): the tail is NOT the binding region of the package, so O4 is a positivity/uniformity re-closure, not a margin risk — the interior minimum is what actually pins the candidate.',
  },
  {
    id: 'imp-95131-o4-open-not-closed',
    holds: () =>
      O4_TAIL_REQUIREMENT.verdict.startsWith('OPEN') &&
      O4_TAIL_REQUIREMENT.grade.startsWith('measurement') &&
      O4_TAIL_REQUIREMENT.changesBound === false &&
      O4_TAIL_REQUIREMENT.qed === false &&
      typeof O4_TAIL_REQUIREMENT.missingForClosure === 'string' &&
      O4_TAIL_REQUIREMENT.missingForClosure.includes('N-uniform') &&
      O4_TAIL_REQUIREMENT.tailBoundaryN === 3840000,
    why: 'Scope discipline: this module MEASURES the O4 requirement (tail-entry floor, monotone-concave trajectory, budget margin) but derives NO analytic tail bound — the N-uniform majorants g-bar(N), s-bar(N) at y = 0.1808 are still missing, so O4 stays OPEN, the package value 0.17759432 is not a bound, and there is no QED.',
  },
];

for (const a of IMP_95131_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95131-ythaw-o4-tail-requirement assertion failed: ${a.id}`);
  }
}

export default IMP_95131_YTHAW_O4;
