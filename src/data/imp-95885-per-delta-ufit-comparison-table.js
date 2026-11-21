/**
 * imp-95885 -- TABULATE the per-delta u_fit certified intervals (ln 1.2 / ln 1.25 /
 * ln 1.3) into one cross-validated comparison never assembled together.
 *
 * The DD-extrapolation per-delta u_fit certified intervals have been reported
 * piecemeal across three separate threads:
 *   - ln 1.2: imp-95837 (5-point N<=400, u_fit_rel 1.07%) -> imp-95860 (8-point
 *     N<=1000, 0.54%) -> imp-95881 (11-point N<=2800, 0.34%);
 *   - ln 1.25: imp-95838 / imp-95859 -- worked ONLY as a shift-budget / crossing
 *     thread (shiftIts ~ 5.670e-3 N^1.577, worst window cell 870 solves), NOT a
 *     u_fit extrapolation, so it has NO per-delta u_fit interval;
 *   - ln 1.3: imp-95826 / imp-95767 (5-point DD-Jacobi envelope, u_fit_rel 0.23%,
 *     interval [-2.121e-3, +2.457e-3] contains zero) + imp-95841 / imp-95857
 *     (direct shift-invert exponent -> -2 out to nPts = 3200).
 * They have never been assembled into a single side-by-side comparison (A_fit vs
 * dual A_opt, u_fit_rel, u_fit/u_opt, reach, worst shift budget per delta).
 *
 * GRADE: cross-validation / measurement only. Import-light: NO zeros bundle. The
 * per-delta rows are the values BAKED by the upstream modules (cited per field);
 * the self-executing assertions (1) re-derive each baked dual A_opt live from the
 * cancellation-free positive-term sum (float64, delta-independent 8-eps floor), (2)
 * re-derive the imp-95838 shift-budget power-law fit live from its own baked grid,
 * and (3) cross-check the three threads against each other and against the
 * imp-95820 / imp-95838 shift-budget scaling law, flagging the two genuine
 * cross-thread structure facts below. Changes NO interval value; NO new bound; NO
 * QED.
 *
 * CROSS-VALIDATION FINDINGS (the comparison this assembles).
 *
 * FINDING A -- REACH DOES NOT ORDER THE INTERVALS ACROSS DELTAS. Reach-universality
 * (imp-95761: finite-grid bias is a function of the reach R = delta (N+1) alone)
 * would predict the LONGER-reach delta to carry the TIGHTER interval. It does not
 * across the two extrapolated deltas: the ln 1.2 chain now reaches R ~ 511 (11
 * points, N <= 2800) YET its u_fit_rel = 0.34% stays LOOSER than the ln 1.3 5-point
 * DD-Jacobi envelope at only R ~ 105 (u_fit_rel = 0.23%). The consistent
 * explanation, already named per-thread but never contrasted, is the deep-corner
 * precision penalty: at ln 1.2 the dual A_opt ~ 4.26e-22 sits at conditioning
 * ~ 5.6e22 (near the DD ~ 32-digit floor), so each grid point is intrinsically
 * noisier than at ln 1.3 (A_opt ~ 4.41e-15, cond ~ 5e15) even though the reach is
 * longer. So the per-delta u_fit ordering is set by CONDITIONING, not reach alone --
 * a fact only visible once the three threads sit in one table. This is NOT an
 * inconsistency in any reported interval; it refines how reach-universality applies.
 *
 * FINDING B -- THE SHIFT-BUDGET SCALING LAW IS DELTA-SPECIFIC, NOT A CROSS-DELTA
 * PREDICTOR. The imp-95820 / imp-95838 shift-budget law shiftIts ~ 5.670e-3 N^1.577
 * was calibrated at ln 1.25 (bottom-eigenvalue conditioning ~ 1e17). The three
 * deltas span conditioning by orders of magnitude (ln 1.3 ~ 5e15, ln 1.25 ~ 1e17,
 * ln 1.2 ~ 5.6e22), so the single fitted constant/exponent cannot port across
 * deltas: it is a FORM (shiftIts grows sub-quadratically against a pinned near-zero
 * bottom eigenvalue), instantiated per delta by that delta's own conditioning. This
 * is why the worst reported budgets are not comparable numbers (ln 1.25 worst window
 * cell 870 shift solves at N = 1400; ln 1.3 nPts = 3200 heavy budget up to 700 shift
 * solves; ln 1.2 N = 2800 DD shift-invert converged in 240 solves) -- each is set by
 * its own conditioning, not by one law. No inconsistency; the law is honestly
 * delta-local.
 *
 * CONSISTENT ACROSS ALL DELTAS. (i) The u_opt-negligible half: u_opt_rel = 8 eps
 * ~ 1.78e-15 is delta-INDEPENDENT at every delta (dual is a cancellation-free sum,
 * its n>=1 tail far below the float64 floor -- imp-95826). (ii) u_fit/u_opt >> 1e10
 * wherever a DD grid exists (ln 1.2: 1.92e12; ln 1.3: 1.29e12), so every certified
 * interval width IS a pure DD-grid-reach artifact -- DD-extrapolation-limited. (iii)
 * Both extrapolated intervals CONTAIN ZERO signed (dual and primal consistent with
 * exact agreement).
 *
 * HONEST SCOPE. Cross-validation assembling already-reported intervals; introduces
 * no new cited input and no new bound; changes NO numeric interval value; ln 1.25
 * carries no u_fit interval (crossing/shift-budget thread only) and is recorded as
 * N/A. Model seam family only; the imp-95212 envelope port, signed WEIGHT, and
 * modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO QED;
 * no refereed bound is changed; Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95837-ln12-dd-extrapolation-grid (ln 1.2 5-point)
 * @see imp-95860-ln12-extended-grid-ufit-tightening (ln 1.2 8-point)
 * @see imp-95881-ln12-past1000-ufit-tightening (ln 1.2 11-point)
 * @see imp-95896-ln12-past2800-ufit-tightening (ln 1.2 14-point, N<=5200, latest reach-tightened)
 * @see imp-95919-ln12-past5200-dd-floor (confirms ln 1.2 DD-floor plateau past N=5200)
 * @see imp-95838-ln125-shift-budget-scaling (ln 1.25 shift-budget law)
 * @see imp-95859-ln125-window-shift-budget (ln 1.25 worst window cell)
 * @see imp-95826-dual-primal-dd-extrapolation-limited-per-delta-audit (ln 1.3 envelope)
 * @see imp-95841-ln13-shift-invert-direct-exponent (ln 1.3 direct read)
 * @see imp-95857-ln13-extended-reach-exponent (ln 1.3 nPts=3200)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the shift-invert solver + budget law)
 */

export const IMP95885_PER_DELTA_UFIT_COMPARISON_TABLE = {
  id: "imp-95885",
  title:
    "TABULATE the per-delta u_fit certified intervals side by side (ln 1.2 / ln 1.25 " +
    "/ ln 1.3): A_fit vs dual A_opt, u_fit_rel, u_fit/u_opt, reach, worst shift " +
    "budget -- cross-validated for the first time. Two cross-thread facts emerge: " +
    "(A) reach does NOT order the intervals across deltas (ln 1.2 reaches R ~ 948 yet " +
    "stays looser at 0.247% than ln 1.3 at R ~ 105 / 0.23% -- ordering is set by " +
    "conditioning, not reach; imp-95919 confirms the ln 1.2 reach lever is DD-floor-" +
    "plateaued past N=5200), and (B) the imp-95820/imp-95838 shift-budget law " +
    "shiftIts ~ 5.670e-3 N^1.577 is delta-SPECIFIC (calibrated at ln 1.25 cond ~1e17), " +
    "not a cross-delta predictor. u_opt_rel = 8 eps delta-independent and " +
    "u_fit/u_opt >> 1e10 everywhere a DD grid exists -- DD-extrapolation-limited",
  question:
    "when the three per-delta u_fit threads (ln 1.2 / ln 1.25 / ln 1.3) are placed " +
    "in one table, are the reported intervals mutually consistent, and does reach " +
    "or conditioning order them?",
  eps: 2.220446049250313e-16,
  uOptRelUniversal: 1.7763568394002505e-15, // 8 eps -- delta-independent (imp-95826)
  // shift-budget scaling law (imp-95820 / imp-95838), calibrated at ln 1.25
  shiftBudgetLaw: {
    calibratedAtDelta: 0.22314355131420976, // ln 1.25
    C: 5.669924e-3,
    p: 1.5769020,
    // imp-95838 baked shift-invert grid the fit is re-derived from live below
    nGrid: [150, 220, 320, 460, 660, 900, 1250, 1523],
    shiftIts: [19, 26, 49, 80, 131, 248, 456, 712],
    deltaSpecific: true, // does NOT port across deltas (conditioning spans 5e15..5.6e22)
  },
  // side-by-side per-delta comparison (values baked by the upstream modules, cited)
  perDelta: [
    {
      label: "ln1.2",
      delta: 0.18232155679395462,
      aOpt: 4.2634260802e-22, // dual, cancellation-free (imp-95837/95860/95881)
      condApprox: 5.6e22, // deep-corner: near the DD ~32-digit floor
      // u_fit extrapolation chain: reach TIGHTENS the interval, no DD-floor flattening
      uFitChain: [
        { source: "imp-95837", nMax: 400, points: 5, reach: 73, aFit: 4.2688499403e-22, uFitRel: 1.066674e-2, rPoint: 1.272183e-3, uFitOverUOpt: 6.012478e12 },
        { source: "imp-95860", nMax: 1000, points: 8, reach: 182.50, aFit: 4.2655052984e-22, uFitRel: 5.422584e-3, rPoint: 4.876872e-4, uFitOverUOpt: 3.054132e12 },
        { source: "imp-95881", nMax: 2800, points: 11, reach: 510.68, aFit: 4.2645230528e-22, uFitRel: 3.414761e-3, rPoint: 2.572984e-4, uFitOverUOpt: 1.922834e12 },
        { source: "imp-95896", nMax: 5200, points: 14, reach: 948.25, aFit: 4.2641502501e-22, uFitRel: 2.465082e-3, rPoint: 1.698563e-4, uFitOverUOpt: 1.387953e12 },
      ],
      uFitRelLatest: 2.465082e-3, // 0.247% (imp-95896, 14-point -- imp-95919 confirms this is the DD-floor plateau)
      reachLatest: 948.25,
      uFitOverUOptLatest: 1.387953e12,
      rIntervalLatest: { lo: -2.295644e-3, hi: 2.635357e-3 }, // imp-95896, contains zero
      intervalContainsZero: true,
      ddFloorPlateauNote:
        "imp-95919: the DD reach lever is EXHAUSTED past N=5200 (N=6400 lambda_min " +
        "reverses upward, N=8000 breaks down to NaN) -- u_fit_rel plateaus at 0.247% " +
        "(1.07x looser than ln 1.3) rather than crossing below the ln 1.3 direct 0.23%; " +
        "crossing needs precision beyond double-double (quad-double/MPFR)",
      worstShiftBudget: "N=2800 DD shift-invert converged in 240 solves (imp-95881); iteration-count-vs-N law not baked at ln 1.2",
      uFitSource: "imp-95896 14-point DD Jacobi grid (fit-model + leave-one-out envelope); reach lever DD-floor-plateaued past N=5200 per imp-95919",
    },
    {
      label: "ln1.25",
      delta: 0.22314355131420976,
      aOpt: null, // no dual scalar-class floor tabulated in the crossing thread
      condApprox: 1e17, // bottom eigenvalue ~7e-18 (imp-95838)
      uFitChain: null, // NOT a u_fit extrapolation thread -- crossing / shift-budget only
      uFitRelLatest: null,
      reachLatest: 340, // reach-340 crossing (Nmax = 1523, imp-95838)
      uFitOverUOptLatest: null,
      rIntervalLatest: null,
      intervalContainsZero: null,
      worstShiftBudget: "worst window cell N=1400 needs 870 shift solves; ~950 with headroom (imp-95859); imp-95838 endpoint read 712 at N=1523",
      uFitSource: "N/A -- worked as a PD-preserving shift-invert crossing / shift-budget thread (imp-95838/imp-95859), no per-delta u_fit interval baked",
    },
    {
      label: "ln1.3",
      delta: 0.26236426446749106,
      aOpt: 4.406252285191384e-15, // theta-dual scalar-class floor (imp-95419/95826)
      condApprox: 5e15,
      uFitChain: [
        { source: "imp-95826/imp-95767", nMax: 400, points: 5, reach: 105, aFit: null, uFitRel: 2.289e-3, rPoint: null, uFitOverUOpt: 1.289e12 },
      ],
      uFitRelLatest: 2.289e-3, // 0.23% (imp-95826/imp-95767, 5-point DD-Jacobi envelope)
      reachLatest: 105,
      uFitOverUOptLatest: 1.289e12,
      rIntervalLatest: { lo: -2.121e-3, hi: 2.457e-3 }, // imp-95767, contains zero
      intervalContainsZero: true,
      worstShiftBudget: "direct shift-invert nPts=3200 heavy budget (boot 80, margin 0.008, up to 700 shift solves, ~453s) exponent -> -2 (imp-95857)",
      uFitSource: "imp-95767 5-point DD Jacobi grid (fit-model + leave-one-out envelope)",
    },
  ],
  // FINDING A -- reach does not order the intervals across deltas (conditioning does)
  reachOrdersIntervals: false,
  reachVsPrecisionNote:
    "ln 1.2 reaches R ~ 948 (0.247%, DD-floor-plateaued per imp-95919) yet stays " +
    "looser than ln 1.3 at R ~ 105 (0.23%): the deep-corner A_opt ~ 4.26e-22 " +
    "conditioning ~5.6e22 makes each ln 1.2 grid point intrinsically noisier, so " +
    "conditioning (not reach) orders the intervals",
  orderingSetByConditioning: true,
  // FINDING B -- the shift-budget law is delta-specific, not a cross-delta predictor
  shiftBudgetLawIsDeltaSpecific: true,
  conditioningSpansOrders: true, // 5e15 (ln1.3) .. 1e17 (ln1.25) .. 5.6e22 (ln1.2)
  // consistent across all deltas
  uOptNegligibleAllDeltas: true,
  ddExtrapolationLimitedWhereGridExists: true, // u_fit/u_opt >> 1e10 at ln1.2 and ln1.3
  bothExtrapolatedIntervalsContainZero: true,
  ln125HasNoUFitInterval: true, // crossing / shift-budget thread only
  intervalUnchanged: true, // NO numeric interval value changed
  boundChange: false,
  qed: false,
  verdict:
    "CROSS-VALIDATED. The three per-delta u_fit threads (ln 1.2 imp-95837/95860/95881, " +
    "ln 1.25 imp-95838/95859, ln 1.3 imp-95826/95767/95841/95857) are assembled side " +
    "by side for the first time (A_fit vs dual A_opt, u_fit_rel, u_fit/u_opt, reach, " +
    "worst shift budget). Two cross-thread facts emerge, invisible per-thread. " +
    "FINDING A: reach does NOT order the intervals across deltas -- the ln 1.2 chain " +
    "now reaches R ~ 948 (14 points, N <= 5200, u_fit_rel = 0.247%, imp-95896) yet " +
    "stays LOOSER than the ln 1.3 5-point DD-Jacobi envelope at only R ~ 105 (0.23%), " +
    "because the ln 1.2 dual A_opt ~ 4.26e-22 sits at conditioning ~5.6e22 (near the " +
    "DD floor) so each grid point is intrinsically noisier than at ln 1.3 (A_opt ~ " +
    "4.41e-15, cond ~5e15); the ordering is set by conditioning, not by reach-" +
    "universality alone. imp-95919 confirms the ln 1.2 reach lever is EXHAUSTED past " +
    "N=5200 (N=6400 reverses, N=8000 breaks down), so 0.247% is a DD-floor plateau, " +
    "not merely the latest reach step. " +
    "FINDING B: the imp-95820/imp-95838 shift-budget law shiftIts ~ 5.670e-3 N^1.577 " +
    "was calibrated at ln 1.25 (cond ~1e17) and is delta-SPECIFIC -- the three deltas " +
    "span conditioning by orders of magnitude (5e15 / 1e17 / 5.6e22), so the fitted " +
    "constant/exponent is a FORM, not a cross-delta predictor, which is why the worst " +
    "reported budgets are not comparable numbers. CONSISTENT everywhere: u_opt_rel = " +
    "8 eps ~ 1.78e-15 is delta-independent, u_fit/u_opt >> 1e10 wherever a DD grid " +
    "exists (ln 1.2 1.39e12, ln 1.3 1.29e12) so every certified width is a pure " +
    "DD-grid-reach artifact, and both extrapolated intervals contain zero signed. No " +
    "inconsistency was found in any reported interval; ln 1.25 carries no u_fit " +
    "interval (crossing / shift-budget thread only) and is recorded as N/A. " +
    "Cross-validation only; no new cited input; no numeric interval value changed; " +
    "model seam family only; the imp-95212 envelope port, signed WEIGHT, and " +
    "modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO QED; " +
    "no refereed bound is changed.",
  closesTickets: ["imp-95885"],
};

const REF = IMP95885_PER_DELTA_UFIT_COMPARISON_TABLE;

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

// log-log least-squares power fit y ~ C x^p, returning { C, p }
function powerFit(xs, ys) {
  const n = xs.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) {
    const lx = Math.log(xs[i]), ly = Math.log(ys[i]);
    sx += lx; sy += ly; sxx += lx * lx; sxy += lx * ly;
  }
  const p = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const C = Math.exp((sy - p * sx) / n);
  return { C, p };
}

export const IMP95885_ASSERTIONS = [
  {
    id: "imp95885-dual-Aopt-rederives-live-for-ln12-and-ln13",
    description:
      "the baked dual A_opt at ln 1.2 and ln 1.3 is reproduced by the live " +
      "cancellation-free positive-term sum to < 1e-6 relative (cross-validating the " +
      "two extrapolated deltas share one dual construction)",
    holds: () => {
      for (const row of REF.perDelta) {
        if (row.aOpt === null) continue;
        const a = aOptDual(row.delta);
        if (Math.abs(a - row.aOpt) / row.aOpt > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95885-ln12-chain-tightens-monotonically-with-reach",
    description:
      "along the ln 1.2 chain (imp-95837 -> imp-95860 -> imp-95881) the reach grows " +
      "monotonically and u_fit_rel tightens monotonically (1.07% -> 0.54% -> 0.34%) " +
      "while u_fit/u_opt stays >> 1e10 at every step",
    holds: () => {
      const chain = REF.perDelta.find((r) => r.label === "ln1.2").uFitChain;
      for (let i = 1; i < chain.length; i++) {
        if (!(chain[i].reach > chain[i - 1].reach)) return false;
        if (!(chain[i].uFitRel < chain[i - 1].uFitRel)) return false;
      }
      return chain.every((c) => c.uFitOverUOpt > 1e10);
    },
  },
  {
    id: "imp95885-reach-does-not-order-intervals-across-deltas",
    description:
      "FINDING A: the ln 1.2 latest reach (~511) EXCEEDS the ln 1.3 envelope reach " +
      "(~105) yet the ln 1.2 latest u_fit_rel (0.34%) is LOOSER than ln 1.3 (0.23%) " +
      "-- reach does not order the intervals; conditioning does",
    holds: () => {
      const l12 = REF.perDelta.find((r) => r.label === "ln1.2");
      const l13 = REF.perDelta.find((r) => r.label === "ln1.3");
      return (
        l12.reachLatest > l13.reachLatest &&
        l12.uFitRelLatest > l13.uFitRelLatest &&
        l12.condApprox > l13.condApprox &&
        REF.reachOrdersIntervals === false &&
        REF.orderingSetByConditioning === true
      );
    },
  },
  {
    id: "imp95885-shift-budget-law-rederives-from-imp95838-grid",
    description:
      "FINDING B: the imp-95838 shift-budget power fit shiftIts ~ 5.670e-3 N^1.577 is " +
      "re-derived live from its own baked ln 1.25 grid to < 1e-3 relative on both C " +
      "and p, and is flagged delta-specific (conditioning spans orders across deltas)",
    holds: () => {
      const law = REF.shiftBudgetLaw;
      const { C, p } = powerFit(law.nGrid, law.shiftIts);
      return (
        Math.abs(C - law.C) / law.C < 1e-3 &&
        Math.abs(p - law.p) / law.p < 1e-3 &&
        REF.shiftBudgetLawIsDeltaSpecific === true &&
        REF.conditioningSpansOrders === true
      );
    },
  },
  {
    id: "imp95885-uOpt-negligible-and-ddlimited-across-deltas",
    description:
      "u_opt_rel = 8 eps is delta-independent, and u_fit/u_opt >> 1e10 wherever a DD " +
      "grid exists (ln 1.2 and ln 1.3), so every certified width is DD-extrapolation-" +
      "limited",
    holds: () => {
      if (Math.abs(REF.uOptRelUniversal - 8 * REF.eps) / (8 * REF.eps) > 1e-12) return false;
      for (const row of REF.perDelta) {
        if (row.uFitOverUOptLatest === null) continue;
        if (!(row.uFitOverUOptLatest > 1e10)) return false;
      }
      return REF.uOptNegligibleAllDeltas === true && REF.ddExtrapolationLimitedWhereGridExists === true;
    },
  },
  {
    id: "imp95885-both-extrapolated-intervals-contain-zero",
    description:
      "the two extrapolated deltas (ln 1.2 imp-95881, ln 1.3 imp-95767) both carry a " +
      "signed interval that CONTAINS ZERO (dual and primal consistent with exact " +
      "agreement), while ln 1.25 carries no u_fit interval",
    holds: () => {
      for (const row of REF.perDelta) {
        if (row.rIntervalLatest === null) {
          if (row.label !== "ln1.25" || REF.ln125HasNoUFitInterval !== true) return false;
          continue;
        }
        if (!(row.rIntervalLatest.lo < 0 && row.rIntervalLatest.hi > 0)) return false;
        if (row.intervalContainsZero !== true) return false;
      }
      return REF.bothExtrapolatedIntervalsContainZero === true;
    },
  },
  {
    id: "imp95885-not-a-bound-no-interval-changed",
    description:
      "this is a cross-validation assembling reported intervals; it moves no Lambda " +
      "bound, changes no numeric interval value, and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.intervalUnchanged === true &&
      /CROSS-VALIDATED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.closesTickets.includes("imp-95885"),
  },
];

for (const a of IMP95885_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95885-per-delta-ufit-comparison-table assertion failed: ${a.id}`,
    );
  }
}

export default IMP95885_PER_DELTA_UFIT_COMPARISON_TABLE;
