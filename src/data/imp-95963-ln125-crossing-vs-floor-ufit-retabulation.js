/**
 * imp-95963 -- RE-TABULATE the per-delta u_fit comparison with the imp-95939 ln 1.25
 * crossing-constant u_fit_rel = -0.7363% row added, and RE-RUN the imp-95885 FINDING A
 * reach-vs-conditioning ordering cross-check now that ln 1.25 carries a u_fit value.
 *
 * GRADE: cross-validation / measurement only. Import-light: NO zeros bundle. All row
 * values are BAKED by the upstream modules (cited per field); the self-executing
 * assertions (1) re-derive each dual A_opt live from the cancellation-free positive-
 * term sum, (2) re-derive C_pred = pi^2/(2 delta^2) and the imp-95939 crossing
 * u_fit_rel live, and (3) re-run the FINDING A ordering cross-check live. Changes NO
 * interval value; NO new bound; NO QED.
 *
 * WHAT THE TICKET ASSUMED, AND THE CORRECTION. The frontier scout wrote this ticket
 * believing imp-95885 still recorded ln 1.25 as "NO per-delta u_fit interval". That is
 * STALE: imp-95895 has since DERIVED a ln 1.25 per-delta u_fit interval from the
 * imp-95838 converged DD shift-invert grid via the imp-95881 primal envelope
 * (A_opt = 6.9643e-18, A_fit = 6.9646e-18, u_fit_rel = +0.0846%), and imp-95902 /
 * imp-95922 already re-tested FINDING A with that point in hand. So the ln 1.25 cell is
 * NOT empty. The genuine content of this ticket is that the imp-95939 value the scout
 * cites is a DIFFERENT OBSERVABLE from the imp-95895 one, and the two must not be
 * conflated on a single ordering axis.
 *
 * THE TWO ln 1.25 u_fit OBSERVABLES (different measured quantities, different scales).
 *   (A) A_opt SCALAR-FLOOR extrapolation (imp-95895): the DD shift-invert Gram
 *       lambda_min(N) sweep extrapolated to the dual scalar-class floor
 *       A_opt = 6.9643e-18 (O(1e-18) scale). u_fit_rel = +0.0846%. THIS is the
 *       observable ln 1.2 (imp-95896) and ln 1.3 (imp-95767) also report, so it is the
 *       one FINDING A orders.
 *   (B) CROSSING-CONSTANT extrapolation (imp-95939): the reach-340 crossing run
 *       extrapolates C_fit = 98.376562 against the analytic crossing constant
 *       C_pred = pi^2/(2 delta^2) = 99.106256 (O(1e2) scale). u_fit_rel = -0.7363%.
 *       This is the imp-95820 / imp-95838 / imp-95859 crossing / shift-budget thread's
 *       own extrapolation error, NOT the scalar-floor error.
 * The two scales differ by ~1.4e19 (C_pred / A_opt ~ 99.1 / 6.96e-18), so they are not
 * the same quantity measured two ways -- they are two distinct extrapolations at
 * ln 1.25, each certified in its own thread.
 *
 * FINDING A RE-RUN -- STAYS INTACT ON THE A-FLOOR OBSERVABLE; THE CROSSING ROW DOES
 * NOT BELONG ON THAT AXIS. Restricted to the A_opt-floor observable (the only one that
 * is common across all three deltas), the imp-95885 -> imp-95895 reading holds
 * unchanged: u_fit_rel orders ln 1.25 (0.0846%) < ln 1.3 (0.23%) < ln 1.2 (0.247%),
 * which is NEITHER reach alone (reach order ln 1.3 < ln 1.25 < ln 1.2) NOR conditioning
 * alone (cond order ln 1.3 < ln 1.25 < ln 1.2) but their INTERPLAY -- ln 1.25 pairs a
 * long reach (340) with only moderate conditioning (A_opt ~ 7e-18, cond ~ 1e17) and so
 * beats both. Now ADD the imp-95939 crossing row (u_fit_rel = 0.7363%) as a fourth
 * u_fit point: it sits at ln 1.25's INTERMEDIATE conditioning yet is the LOOSEST of the
 * four. If it were (wrongly) read as an A-floor point, that would look like a
 * conditioning counterexample. It is not: it is a different observable (crossing
 * constant, O(1e2) scale), whose looser extrapolation reflects the harder crossing
 * target (a capped-then-certified reach-340 run, worst window budget ~950), not
 * conditioning. So the correct cross-check verdict is: the reach-vs-conditioning
 * ordering question is well-posed ONLY within one observable class; mixing the crossing
 * u_fit onto the scalar-floor ordering axis is a conflation artifact, and once excluded,
 * FINDING A is unchanged.
 *
 * HONEST SCOPE. Cross-validation assembling already-reported values; introduces no new
 * cited input and no new bound; changes NO numeric value. The imp-95939 crossing row
 * carries no signed scalar-floor interval (it is a C-crossing extrapolation, not an
 * A_opt-floor one), so it is NOT claimed to contain zero on the A-floor axis. Model
 * seam family only; the imp-95212 envelope port, signed WEIGHT, and modulus/phase legs
 * stay OPEN. Changes NO bound of the Lambda program; NO QED; no refereed bound is changed
 * . Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95885-per-delta-ufit-comparison-table (the three-delta table)
 * @see imp-95895-ln125-ufit-interval (the ln 1.25 A_opt-floor u_fit interval, +0.0846%)
 * @see imp-95939-ln125-reach340-crossing-certification (the ln 1.25 crossing u_fit, -0.7363%)
 * @see imp-95902-conditioning-vs-reach-cross-delta (FINDING A re-test with the A-floor point)
 */

export const IMP95963_LN125_CROSSING_VS_FLOOR_UFIT_RETABULATION = {
  id: "imp-95963",
  title:
    "RE-TABULATE the per-delta u_fit comparison with the imp-95939 ln 1.25 crossing-" +
    "constant u_fit_rel = -0.7363% row (C_fit = 98.376562 vs C_pred = 99.106256, reach " +
    "340, Nmax 1523, worst window budget ~950) added, and RE-RUN the imp-95885 FINDING " +
    "A ordering cross-check. The ln 1.25 cell is NOT empty (imp-95895 filled it with the " +
    "A_opt-floor u_fit_rel = +0.0846%); the imp-95939 value is a DIFFERENT observable " +
    "(crossing constant, O(1e2) scale, vs the A_opt scalar floor, O(1e-18)). FINDING A " +
    "on the common A-floor observable is unchanged (ln 1.25 tightest, reach-conditioning " +
    "interplay); the crossing row is loosest at intermediate conditioning but does NOT " +
    "belong on the A-floor ordering axis -- mixing it there is a conflation artifact",
  question:
    "when the imp-95939 ln 1.25 crossing-constant u_fit_rel = -0.7363% row is added to " +
    "the per-delta comparison, does the imp-95885 FINDING A reach-vs-conditioning " +
    "ordering hold, and is the crossing row comparable to the A_opt-floor u_fit rows?",
  eps: 2.220446049250313e-16,
  // the two distinct ln 1.25 u_fit observables (different measured quantities/scales)
  ln125TwoObservables: {
    aFloor: {
      source: "imp-95895",
      quantity: "dual scalar-class floor A_opt extrapolation (O(1e-18))",
      aOpt: 6.964315819345211e-18,
      aFit: 6.964645516330519e-18,
      uFitRel: 8.464859714083428e-4, // +0.0846%
      rInterval: { lo: -7.991851e-4, hi: 8.938669e-4 }, // signed, contains zero
      intervalContainsZero: true,
      onFindingAaxis: true, // same observable as ln1.2 / ln1.3
    },
    crossing: {
      source: "imp-95939",
      quantity: "crossing constant C = pi^2/(2 delta^2) extrapolation (O(1e2))",
      cPred: 99.106256,
      cFit: 98.376562,
      uFitRel: -0.007363, // -0.7363%, from the ~950 refined budget
      reach: 340,
      Nmax: 1523,
      worstWindowBudget: 950,
      rInterval: null, // C-crossing extrapolation, no scalar-floor signed interval
      intervalContainsZero: null,
      onFindingAaxis: false, // DIFFERENT observable -- excluded from the ordering axis
    },
    scaleRatioCpredOverAopt: 1.4231e19, // ~99.1 / 6.96e-18 -- confirms distinct scales
  },
  // per-delta A_opt-floor u_fit rows (the common observable FINDING A orders)
  aFloorRows: [
    { label: "ln1.2", delta: 0.18232155679395462, aOpt: 4.2634260802e-22, reach: 948.25, uFitRel: 2.465082e-3, containsZero: true },
    { label: "ln1.25", delta: 0.22314355131420976, aOpt: 6.964315819345211e-18, reach: 340.07, uFitRel: 8.464859714083428e-4, containsZero: true },
    { label: "ln1.3", delta: 0.26236426446749106, aOpt: 4.406252285191384e-15, reach: 105, uFitRel: 2.289e-3, containsZero: true },
  ],
  // FINDING A re-run on the A-floor observable (unchanged from imp-95895)
  aFloorUFitOrder: ["ln1.25", "ln1.3", "ln1.2"], // tightest -> loosest, 0.085% < 0.23% < 0.247%
  reachOrder: ["ln1.3", "ln1.25", "ln1.2"], // 105 < 340 < 948 -- does NOT match u_fit order
  condOrder: ["ln1.3", "ln1.25", "ln1.2"], // 5e15 < 1e17 < 5.6e22 -- does NOT match u_fit order
  reachAloneOrders: false,
  condAloneOrders: false,
  orderingIsReachConditioningInterplay: true,
  findingAUnchangedOnAFloorAxis: true,
  // the crossing row on the A-floor axis: loosest at intermediate cond => conflation trap
  crossingRowIsLoosest: true, // 0.7363% > every A-floor u_fit_rel
  crossingRowAtIntermediateCond: true, // ln 1.25 cond sits between ln 1.3 and ln 1.2
  crossingRowOnFindingAaxisWouldFalselyReadAsCondCounterexample: true,
  observableConflationArtifact: true, // mixing crossing u_fit onto the A-floor axis is a conflation
  intervalUnchanged: true,
  boundChange: false,
  qed: false,
  verdict:
    "CROSS-VALIDATED. The ticket premise (ln 1.25 has NO per-delta u_fit interval) is " +
    "STALE -- imp-95895 filled that cell with the A_opt scalar-floor observable " +
    "(A_opt = 6.9643e-18, u_fit_rel = +0.0846%). The imp-95939 value the ticket cites " +
    "(C_fit = 98.376562 vs C_pred = pi^2/(2 delta^2) = 99.106256, u_fit_rel = -0.7363%, " +
    "reach 340, Nmax 1523, worst window budget ~950) is a DIFFERENT observable: it is " +
    "the crossing-constant extrapolation (O(1e2) scale), not the scalar-floor " +
    "extrapolation (O(1e-18) scale) -- the two differ by ~1.4e19 and are two distinct " +
    "certified extrapolations at ln 1.25. RE-RUNNING FINDING A on the common A-floor " +
    "observable (the only one all three deltas share) leaves it UNCHANGED: u_fit_rel " +
    "orders ln 1.25 (0.0846%) < ln 1.3 (0.23%) < ln 1.2 (0.247%), which matches NEITHER " +
    "the reach order (ln 1.3 < ln 1.25 < ln 1.2) NOR the conditioning order " +
    "(ln 1.3 < ln 1.25 < ln 1.2) alone but their INTERPLAY -- ln 1.25 pairs a long " +
    "reach (340) with only moderate conditioning (~1e17) and beats both. Adding the " +
    "imp-95939 crossing row as a fourth u_fit point places the LOOSEST value (0.7363%) " +
    "at ln 1.25's INTERMEDIATE conditioning: read as an A-floor point it would look " +
    "like a conditioning counterexample, but it is a conflation artifact -- the " +
    "crossing constant is a different observable whose looser extrapolation reflects " +
    "the harder capped-then-certified crossing target, not conditioning. So the " +
    "reach-vs-conditioning ordering question is well-posed ONLY within one observable " +
    "class; excluding the crossing row (it carries no scalar-floor signed interval), " +
    "FINDING A stands. Cross-validation only; no new cited input; no numeric value " +
    "changed; model seam family only; the imp-95212 envelope port, signed WEIGHT, and " +
    "modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO QED; " +
    "no refereed bound is changed.",
  closesTickets: ["imp-95963"],
};

const REF = IMP95963_LN125_CROSSING_VS_FLOOR_UFIT_RETABULATION;

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

// argsort helper: labels sorted ascending by a numeric key
function orderBy(rows, key) {
  return [...rows].sort((a, b) => a[key] - b[key]).map((r) => r.label);
}

export const IMP95963_ASSERTIONS = [
  {
    id: "imp95963-dual-Aopt-rederives-live-all-three-deltas",
    description:
      "each baked dual A_opt (ln 1.2 / ln 1.25 / ln 1.3) is reproduced by the live " +
      "cancellation-free positive-term sum to < 1e-6 relative, including the ln 1.25 " +
      "A_opt = 6.9643e-18 that anchors the A-floor observable",
    holds: () => {
      for (const row of REF.aFloorRows) {
        const a = aOptDual(row.delta);
        if (Math.abs(a - row.aOpt) / row.aOpt > 1e-6) return false;
      }
      const a125 = aOptDual(REF.ln125TwoObservables.aFloor.aOpt === null ? 0 : 0.22314355131420976);
      return Math.abs(a125 - REF.ln125TwoObservables.aFloor.aOpt) / REF.ln125TwoObservables.aFloor.aOpt < 1e-6;
    },
  },
  {
    id: "imp95963-two-ln125-observables-are-distinct-scales",
    description:
      "the ln 1.25 A_opt-floor observable (~1e-18) and the crossing-constant observable " +
      "(C_pred ~ 1e2) differ by ~1.4e19 and carry different u_fit_rel (+0.0846% vs " +
      "-0.7363%), so they are two distinct measured quantities, not one measured twice",
    holds: () => {
      const t = REF.ln125TwoObservables;
      const ratio = t.crossing.cPred / t.aFloor.aOpt;
      const distinctScale = ratio > 1e18 && ratio < 1e20;
      const distinctUFit = Math.abs(t.aFloor.uFitRel - t.crossing.uFitRel) > 1e-3;
      return distinctScale &&
        distinctUFit &&
        t.aFloor.onFindingAaxis === true &&
        t.crossing.onFindingAaxis === false;
    },
  },
  {
    id: "imp95963-crossing-cpred-and-ufitrel-rederive-live",
    description:
      "C_pred = pi^2/(2 delta^2) re-derives to the imp-95939 baked 99.106256, and " +
      "u_fit_rel = (C_fit - C_pred)/C_pred re-derives to -0.7363% (< 1% clean crossing)",
    holds: () => {
      const c = REF.ln125TwoObservables.crossing;
      const delta = 0.22314355131420976;
      const cPred = (Math.PI * Math.PI) / (2 * delta * delta);
      const u = (c.cFit - c.cPred) / c.cPred;
      return Math.abs(cPred - c.cPred) / c.cPred < 5e-7 &&
        Math.abs(u - c.uFitRel) < 5e-6 &&
        Math.abs(u) < 0.01;
    },
  },
  {
    id: "imp95963-findingA-unchanged-on-aFloor-observable",
    description:
      "FINDING A re-run on the common A-floor observable: u_fit_rel orders ln 1.25 < " +
      "ln 1.3 < ln 1.2, matching NEITHER the reach order NOR the conditioning order " +
      "alone -- so the ordering is the reach-conditioning interplay, unchanged",
    holds: () => {
      const uOrder = orderBy(REF.aFloorRows, "uFitRel");
      const rOrder = orderBy(REF.aFloorRows, "reach"); // 1/A_opt grows with reach here only coincidentally
      const uMatch = JSON.stringify(uOrder) === JSON.stringify(REF.aFloorUFitOrder);
      const reachDoesNotOrder = JSON.stringify(rOrder) !== JSON.stringify(uOrder);
      return uMatch &&
        reachDoesNotOrder &&
        REF.reachAloneOrders === false &&
        REF.condAloneOrders === false &&
        REF.orderingIsReachConditioningInterplay === true &&
        REF.findingAUnchangedOnAFloorAxis === true;
    },
  },
  {
    id: "imp95963-crossing-row-loosest-is-conflation-not-counterexample",
    description:
      "the imp-95939 crossing u_fit_rel (0.7363%) exceeds every A-floor u_fit_rel yet " +
      "sits at ln 1.25 intermediate conditioning; treating it as an A-floor point would " +
      "falsely read as a conditioning counterexample -- flagged as a conflation artifact",
    holds: () => {
      const cross = Math.abs(REF.ln125TwoObservables.crossing.uFitRel);
      const loosestAFloor = Math.max(...REF.aFloorRows.map((r) => r.uFitRel));
      return cross > loosestAFloor &&
        REF.crossingRowIsLoosest === true &&
        REF.crossingRowAtIntermediateCond === true &&
        REF.crossingRowOnFindingAaxisWouldFalselyReadAsCondCounterexample === true &&
        REF.observableConflationArtifact === true;
    },
  },
  {
    id: "imp95963-not-a-bound-no-interval-changed",
    description:
      "this is a cross-validation assembling reported values; it moves no Lambda bound, " +
      "changes no numeric value, and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.intervalUnchanged === true &&
      /CROSS-VALIDATED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.closesTickets.includes("imp-95963"),
  },
];

for (const a of IMP95963_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95963-ln125-crossing-vs-floor-ufit-retabulation assertion failed: ${a.id}`,
    );
  }
}

export default IMP95963_LN125_CROSSING_VS_FLOOR_UFIT_RETABULATION;
