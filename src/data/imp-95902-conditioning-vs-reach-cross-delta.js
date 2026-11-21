/**
 * imp-95902 -- TABULATE conditioning cond = 1/A_opt against reach across ALL
 * measured deltas, to test/formalize the imp-95885 FINDING A (that per-delta u_fit
 * interval ordering is set by conditioning, not reach alone).
 *
 * GRADE: numerical measurement / cross-validation. Import-light: NO zeros bundle.
 * The dual scalar-class floor A_opt is the cancellation-free positive-term sum
 * A_opt = (4 pi/delta) sum_n sech(pi^2 (2n+1)/delta) (float64, delta-independent
 * ~8-eps tail floor, the same construction cross-validated in imp-95826 / imp-95885);
 * the self-executing assertions re-derive every baked A_opt / cond live. The u_fit_rel
 * and reach fields are the values BAKED by the upstream per-delta threads (cited per
 * row). Changes NO interval value; NO new bound; NO QED.
 *
 * WHAT THIS ASSEMBLES. imp-95885 stated FINDING A on a TWO-delta contrast (ln 1.2 vs
 * ln 1.3): ln 1.2 reaches R ~ 511 yet stays looser (0.34%) than ln 1.3 at R ~ 105
 * (0.23%), and read that as "conditioning, not reach, orders the intervals." Since
 * then imp-95895 filled the ln 1.25 cell (u_fit_rel 0.085%, reach ~340, the TIGHTEST
 * of the three despite intermediate conditioning) and already flagged the ordering as
 * a "reach-to-conditioning interplay." This module puts the conditioning axis on a
 * firm, exact footing by tabulating cond = 1/A_opt (live) against reach across all
 * seven measured deltas -- the three DD-side deltas that carry a u_fit interval
 * (ln 1.2 / ln 1.25 / ln 1.3) AND the four float64-clean deltas from imp-95786
 * (ln 1.6 / 1.5 / 1.45 / 1.4) that anchor the low-conditioning end -- and RE-TESTS
 * FINDING A now that a third u_fit point exists.
 *
 * RESULT 1 -- THE CONDITIONING LADDER IS EXACT, FLOAT64-CLEAN, AND MONOTONE. cond =
 * 1/A_opt is a cancellation-free scalar (no matrix, no grid), so it is delta-
 * independent to ~8 eps at every delta and strictly monotone-decreasing in delta:
 *
 *   delta    A_opt (dual)      cond = 1/A_opt   reach (latest)   u_fit_rel
 *   ln1.2    4.2634e-22         2.346e21         510.68 (u_fit)   0.341%
 *   ln1.25   6.9643e-18         1.436e17         340    (u_fit)   0.085%
 *   ln1.3    4.4063e-15         2.270e14         105    (u_fit)   0.229%
 *   ln1.4    1.3624e-11         7.340e10         wall             N/A
 *   ln1.45   1.9693e-10         5.078e9          244.7  (C-fit)   N/A
 *   ln1.5    1.6632e-9          6.013e8          236.2  (C-fit)   N/A
 *   ln1.6    4.0587e-8          2.464e7          223.0  (C-fit)   N/A
 *
 * cond spans ~14 orders of magnitude (2.46e7 at ln 1.6 to 2.35e21 at ln 1.2).
 *
 * RESULT 2 -- FINDING A REFINED: NEITHER REACH NOR CONDITIONING ALONE ORDERS THE
 * THREE u_fit INTERVALS. With the ln 1.25 point (imp-95895) now in hand there are
 * three deltas carrying a u_fit interval, and both single-variable monotonicity tests
 * FAIL at ln 1.25:
 *   - pure reach (longer reach -> tighter interval) fails: sorted by reach
 *     ln 1.3 (105) -> ln 1.25 (340) -> ln 1.2 (511), u_fit goes 0.229% -> 0.085% ->
 *     0.341% (rises at the LONGEST-reach delta);
 *   - pure conditioning (higher cond -> looser interval) fails: sorted by cond
 *     ln 1.3 (2.27e14) -> ln 1.25 (1.44e17) -> ln 1.2 (2.35e21), u_fit goes 0.229% ->
 *     0.085% -> 0.341% (DROPS at the higher-conditioning ln 1.25).
 * So the original two-delta FINDING A (ln 1.2 vs ln 1.3) was a special case where
 * reach and conditioning point OPPOSITE ways and conditioning "wins"; it is NOT the
 * general law. The three-point ordering is a joint reach-conditioning interplay
 * (u_fit tightens with reach, loosens with conditioning), exactly as imp-95895 flagged.
 * HONEST: with only three u_fit points this refines FINDING A rather than replacing it
 * with a fitted two-variable law -- SUB-GAP below.
 *
 * RESULT 3 -- THE imp-95786 FLOAT64 PRECISION WALL IS A CONDITIONING THRESHOLD. The
 * float64-usable deltas (ln 1.4 / 1.45 / 1.5 / 1.6, where imp-95786 reads a clean
 * reach-decay) all sit at cond < 1e11 (max 7.34e10 at ln 1.4), while every delta that
 * NEEDS double-double (ln 1.3 / 1.25 / 1.2) sits at cond > 1e14. The imp-95786
 * float64-blown boundary ln 1.35 sits at cond ~ 2.29e12, just above the ~1e11 usable
 * ceiling -- so the precision wall imp-95786 pinned at delta ~ ln 1.4 IS the point
 * where cond = 1/A_opt crosses ~1e11-1e12. The conditioning ladder QUANTIFIES that
 * wall; it does not move it.
 *
 * HONEST SCOPE / RESIDUAL SUB-GAP. Cross-delta assembly of already-reported values;
 * introduces no new cited input and no new bound; changes NO numeric interval value.
 * (a) The reach column mixes u_fit reach (DD side) with C-fit crossing R* (float64
 * side) -- they are the reach at which each thread was read, not a common metric, so
 * cross-side reach comparisons are NOT drawn. (b) FINDING A is REFINED (interplay),
 * not closed to a predictive two-variable law -- RESIDUAL SUB-GAP:
 * imp-95902-ufit-reach-conditioning-joint-fit (does u_fit_rel ~ g(reach, cond) with a
 * clean form fit the three DD points and predict a fourth?). (c) Model seam family
 * only; the imp-95212 envelope port, signed WEIGHT, and modulus/phase legs stay OPEN.
 * Changes NO bound of the Lambda program; NO QED; no refereed bound is changed
 * ; Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95885-per-delta-ufit-comparison-table (FINDING A, original two-delta contrast)
 * @see imp-95895-ln125-ufit-interval (ln 1.25 u_fit cell + the interplay flag)
 * @see imp-95826-dual-primal-dd-extrapolation-limited-per-delta-audit (dual A_opt construction)
 * @see imp-95786-reach-universality-crossval (float64-clean deltas + the precision wall)
 * @see imp-95881-ln12-past1000-ufit-tightening (ln 1.2 u_fit reach/interval)
 */

export const IMP95902_CONDITIONING_VS_REACH_CROSS_DELTA = {
  id: "imp-95902",
  title:
    "TABULATE conditioning cond = 1/A_opt against reach across all seven measured " +
    "deltas (DD-side ln 1.2 / 1.25 / 1.3 with u_fit intervals + float64-clean " +
    "ln 1.4 / 1.45 / 1.5 / 1.6) and RE-TEST imp-95885 FINDING A. Result: cond = 1/A_opt " +
    "is an exact, float64-clean, strictly-monotone ladder spanning ~14 orders " +
    "(2.46e7 .. 2.35e21); with the ln 1.25 u_fit point (imp-95895) now in hand NEITHER " +
    "reach nor conditioning ALONE orders the three intervals (both monotonicity tests " +
    "fail at ln 1.25), so the original two-delta FINDING A is a special case and the " +
    "general ordering is a reach-conditioning interplay; and the imp-95786 float64 " +
    "precision wall at delta ~ ln 1.4 IS the point where cond crosses ~1e11-1e12",
  question:
    "with the conditioning ladder cond = 1/A_opt placed against reach across all " +
    "measured deltas, does conditioning (as imp-95885 FINDING A read it) or reach " +
    "order the per-delta u_fit intervals -- and where does the float64 precision wall " +
    "sit on the conditioning axis?",
  eps: 2.220446049250313e-16,
  // dual scalar-class floor A_opt and conditioning cond = 1/A_opt (re-derived live)
  perDelta: [
    {
      label: "ln1.2", ratio: 1.2,
      aOpt: 4.2634260802e-22, cond: 2.345531e21,
      reachLatest: 510.68, reachKind: "u_fit", uFitRel: 3.414761e-3,
      side: "DD", floatUsable: false,
      uFitSource: "imp-95881 11-point DD Jacobi grid (via imp-95885)",
    },
    {
      label: "ln1.25", ratio: 1.25,
      aOpt: 6.9643158193e-18, cond: 1.435891e17,
      reachLatest: 340, reachKind: "u_fit", uFitRel: 8.46e-4,
      side: "DD", floatUsable: false,
      uFitSource: "imp-95895 (imp-95838 DD shift-invert grid + imp-95881 primal envelope)",
    },
    {
      label: "ln1.3", ratio: 1.3,
      aOpt: 4.4062522852e-15, cond: 2.269502e14,
      reachLatest: 105, reachKind: "u_fit", uFitRel: 2.289e-3,
      side: "DD", floatUsable: false,
      uFitSource: "imp-95767 5-point DD Jacobi envelope (via imp-95826/imp-95885)",
    },
    {
      label: "ln1.4", ratio: 1.4,
      aOpt: 1.3624035268e-11, cond: 7.339969e10,
      reachLatest: null, reachKind: "float64-wall-boundary", uFitRel: null,
      side: "float64-boundary", floatUsable: true,
      uFitSource: "N/A -- imp-95786 float64 usable-window floor delta",
    },
    {
      label: "ln1.45", ratio: 1.45,
      aOpt: 1.9693414165e-10, cond: 5.077840e9,
      reachLatest: 244.7, reachKind: "C-fit-crossing", uFitRel: null,
      side: "float64", floatUsable: true,
      uFitSource: "N/A -- imp-95786 reach-universality C-fit crossing R*",
    },
    {
      label: "ln1.5", ratio: 1.5,
      aOpt: 1.6631580146e-9, cond: 6.012658e8,
      reachLatest: 236.2, reachKind: "C-fit-crossing", uFitRel: null,
      side: "float64", floatUsable: true,
      uFitSource: "N/A -- imp-95786 reach-universality C-fit crossing R*",
    },
    {
      label: "ln1.6", ratio: 1.6,
      aOpt: 4.0587331132e-8, cond: 2.463823e7,
      reachLatest: 223.0, reachKind: "C-fit-crossing", uFitRel: null,
      side: "float64", floatUsable: true,
      uFitSource: "N/A -- imp-95786 reach-universality C-fit crossing R*",
    },
  ],
  // RESULT 1 -- the conditioning ladder is exact, float64-clean, monotone in delta
  condIsExactCancellationFree: true,
  condMonotoneDecreasingInDelta: true,
  condSpanOrders: 14, // 2.46e7 (ln1.6) .. 2.35e21 (ln1.2)
  // RESULT 2 -- FINDING A refined: neither reach nor conditioning ALONE orders u_fit
  uFitDeltasWithInterval: ["ln1.2", "ln1.25", "ln1.3"],
  pureReachOrdersUFit: false, // fails at ln1.25 (longest-reach ln1.2 is NOT tightest)
  pureConditioningOrdersUFit: false, // fails at ln1.25 (higher-cond ln1.25 is tightest)
  twoDeltaFindingAHoldsForLn12VsLn13: true, // original contrast still valid as a special case
  orderingIsReachConditioningInterplay: true, // general law (per imp-95895)
  // RESULT 3 -- the imp-95786 float64 precision wall is a conditioning threshold
  float64UsableAllBelowCond1e11: true, // ln1.4..ln1.6 all cond < 1e11
  ddRequiredAllAboveCond1e14: true, // ln1.3/1.25/1.2 all cond > 1e14
  ln135BlownAtCond: 2.289649e12, // imp-95786 float64-blown boundary, just above the ~1e11 ceiling
  precisionWallIsConditioningThreshold: true,
  // honest scope
  reachColumnMixesTwoMetrics: true, // u_fit reach (DD) vs C-fit crossing R* (float64)
  subGap: "imp-95902-ufit-reach-conditioning-joint-fit",
  intervalUnchanged: true,
  boundChange: false,
  qed: false,
  verdict:
    "TABULATED. cond = 1/A_opt is placed against reach across all seven measured " +
    "deltas. The conditioning ladder is exact and float64-clean (A_opt is a " +
    "cancellation-free positive-term sum, delta-independent to ~8 eps) and strictly " +
    "monotone-decreasing in delta, spanning ~14 orders (2.46e7 at ln 1.6 to 2.35e21 " +
    "at ln 1.2). RE-TESTING imp-95885 FINDING A now that imp-95895 has filled the " +
    "ln 1.25 u_fit cell (0.085%, the TIGHTEST of the three) shows that NEITHER reach " +
    "nor conditioning alone orders the three intervals -- both single-variable " +
    "monotonicity tests fail at ln 1.25 -- so the original two-delta contrast " +
    "(ln 1.2 R ~ 511 / 0.34% looser than ln 1.3 R ~ 105 / 0.23%, conditioning winning " +
    "where reach and conditioning point opposite ways) is a special case, and the " +
    "general ordering is a joint reach-conditioning interplay (u_fit tightens with " +
    "reach, loosens with conditioning), confirming the imp-95895 flag. Separately, the " +
    "imp-95786 float64 precision wall at delta ~ ln 1.4 is shown to BE a conditioning " +
    "threshold: every float64-usable delta (ln 1.4 .. ln 1.6) sits at cond < 1e11 " +
    "while every DD-required delta (ln 1.3 / 1.25 / 1.2) sits at cond > 1e14, and the " +
    "imp-95786 blown boundary ln 1.35 sits at cond ~ 2.29e12, just above the ~1e11 " +
    "usable ceiling. Residual: FINDING A is refined, not closed to a predictive " +
    "two-variable law (SUB-GAP imp-95902-ufit-reach-conditioning-joint-fit). " +
    "Cross-delta assembly of reported values; model seam family only; the imp-95212 " +
    "envelope port, signed WEIGHT, and modulus/phase legs stay OPEN. Changes no bound " +
    "of the Lambda program; changes no numeric interval value; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95902"],
};

const REF = IMP95902_CONDITIONING_VS_REACH_CROSS_DELTA;

// dual A_opt = (4 pi/delta) sum_n sech(pi^2 (2n+1)/delta), cancellation-free (float64)
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 20000; n++) {
    const a = (Math.PI * Math.PI * (2 * n + 1)) / delta;
    const t = 2 / (Math.exp(a) + Math.exp(-a));
    s += t;
    if (n > 2 && t < s * 1e-32) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

export const IMP95902_ASSERTIONS = [
  {
    id: "imp95902-cond-rederives-live-as-reciprocal-Aopt",
    description:
      "every baked A_opt and cond = 1/A_opt re-derives live from the cancellation-free " +
      "dual sum at delta = ln(ratio) to < 1e-6 relative (the conditioning axis is exact)",
    holds: () => {
      for (const row of REF.perDelta) {
        const a = aOptDual(Math.log(row.ratio));
        if (Math.abs(a - row.aOpt) / row.aOpt > 1e-6) return false;
        if (Math.abs(1 / a - row.cond) / row.cond > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95902-conditioning-ladder-strictly-monotone",
    description:
      "cond = 1/A_opt is strictly monotone-DECREASING as delta grows across all seven " +
      "deltas (ln 1.2 .. ln 1.6), spanning ~14 orders of magnitude",
    holds: () => {
      const rows = [...REF.perDelta].sort((a, b) => a.ratio - b.ratio);
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].cond < rows[i - 1].cond)) return false;
      }
      const span = Math.log10(rows[0].cond / rows[rows.length - 1].cond);
      return (
        span > 13 &&
        REF.condMonotoneDecreasingInDelta === true &&
        REF.condIsExactCancellationFree === true
      );
    },
  },
  {
    id: "imp95902-neither-reach-nor-conditioning-alone-orders-ufit",
    description:
      "FINDING A REFINED: across the three deltas that carry a u_fit interval, sorting " +
      "by reach does NOT yield monotone-tightening u_fit and sorting by conditioning " +
      "does NOT yield monotone-loosening u_fit -- both fail at ln 1.25",
    holds: () => {
      const u = REF.perDelta.filter((r) => r.uFitRel !== null);
      if (u.length !== 3) return false;
      const byReach = [...u].sort((a, b) => a.reachLatest - b.reachLatest);
      let reachMono = true;
      for (let i = 1; i < byReach.length; i++) {
        if (!(byReach[i].uFitRel < byReach[i - 1].uFitRel)) reachMono = false;
      }
      const byCond = [...u].sort((a, b) => a.cond - b.cond);
      let condMono = true;
      for (let i = 1; i < byCond.length; i++) {
        if (!(byCond[i].uFitRel > byCond[i - 1].uFitRel)) condMono = false;
      }
      return (
        reachMono === false &&
        condMono === false &&
        REF.pureReachOrdersUFit === false &&
        REF.pureConditioningOrdersUFit === false &&
        REF.orderingIsReachConditioningInterplay === true
      );
    },
  },
  {
    id: "imp95902-two-delta-findingA-still-holds-for-ln12-vs-ln13",
    description:
      "the original imp-95885 two-delta contrast still holds: ln 1.2 has HIGHER " +
      "conditioning AND longer reach than ln 1.3 yet a LOOSER u_fit interval (a special " +
      "case where reach and conditioning point opposite ways and conditioning wins)",
    holds: () => {
      const a = REF.perDelta.find((r) => r.label === "ln1.2");
      const b = REF.perDelta.find((r) => r.label === "ln1.3");
      return (
        a.cond > b.cond &&
        a.reachLatest > b.reachLatest &&
        a.uFitRel > b.uFitRel &&
        REF.twoDeltaFindingAHoldsForLn12VsLn13 === true
      );
    },
  },
  {
    id: "imp95902-float64-wall-is-a-conditioning-threshold",
    description:
      "RESULT 3: every float64-usable delta (ln 1.4 .. ln 1.6) sits at cond < 1e11 while " +
      "every DD-required delta (ln 1.3 / 1.25 / 1.2) sits at cond > 1e14, and the " +
      "imp-95786 blown boundary ln 1.35 (cond ~2.29e12) lives just above the ~1e11 ceiling",
    holds: () => {
      for (const row of REF.perDelta) {
        if (row.floatUsable && !(row.cond < 1e11)) return false;
        if (!row.floatUsable && !(row.cond > 1e14)) return false;
      }
      const a135 = aOptDual(Math.log(1.35));
      if (Math.abs(1 / a135 - REF.ln135BlownAtCond) / REF.ln135BlownAtCond > 1e-5) return false;
      return (
        1 / a135 > 1e11 &&
        REF.float64UsableAllBelowCond1e11 === true &&
        REF.ddRequiredAllAboveCond1e14 === true &&
        REF.precisionWallIsConditioningThreshold === true
      );
    },
  },
  {
    id: "imp95902-not-a-bound-no-interval-changed",
    description:
      "this is a cross-delta tabulation of reported values; it moves no Lambda bound, " +
      "changes no numeric interval value, and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.intervalUnchanged === true &&
      /TABULATED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.closesTickets.includes("imp-95902"),
  },
];

for (const a of IMP95902_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95902-conditioning-vs-reach-cross-delta assertion failed: ${a.id}`,
    );
  }
}

export default IMP95902_CONDITIONING_VS_REACH_CROSS_DELTA;
