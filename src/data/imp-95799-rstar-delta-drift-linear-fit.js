/**
 * imp-95799 -- FIT the imp-95786-named R*-delta drift residual
 * (sub-gap imp-95786-Rstar-delta-drift-secondorder-fit): does the Szego
 * reach-crossing R*(delta) follow a clean low-order form, and does the fully
 * double-double side (delta = ln 1.35, ln 1.25) cross sub-1% at the
 * extrapolated R*?
 *
 * GRADE: numerical measurement / curve-fit + honest obstruction. Import-light:
 * the reported double-double C-fit numbers are BAKED from the offline driver
 * tmp/imp-95799-ddcross.mjs (which reuses the imp-95779 O(N^2) DD Levinson
 * inverse-iteration Toeplitz solver); the self-executing assertions re-derive
 * only the cheap linear R*(delta) least-squares fit and its extrapolation, and
 * check the baked DD control/pathology literals -- no DD eigensolve at import.
 *
 * WHAT imp-95786 LEFT OPEN. imp-95786 measured the sub-1% crossing reach
 * R* = 223.0 / 236.2 / 244.7 on the three float64-clean deltas ln 1.6 / 1.5 / 1.45
 * and flagged that R* DRIFTS ~10% with delta, so the imp-95761 law N_max ~ 250/delta
 * is only an upper envelope, not an exact law. Its HONEST SCOPE named the residual
 * sub-gap imp-95786-Rstar-delta-drift-secondorder-fit: (a) does R* follow a clean
 * R* = 250 - c*delta form? and (b) does the fully-DD side ln 1.35 / ln 1.25 cross
 * sub-1% at the extrapolated R*?
 *
 * RESULT 1 -- R*(delta) IS A CLEAN LINEAR (FIRST-ORDER) DRIFT, BUT THE INTERCEPT IS
 * ~325 NOT 250. A least-squares line through the three float64-clean crossings
 * (delta, R*) = (0.47000, 223.0), (0.40547, 236.2), (0.37156, 244.7) gives
 *
 *     R*(delta) = 325.393 - 218.342 * delta      R^2 = 0.99715
 *
 *   with residuals +0.23 / -0.66 / +0.44 (RMS 0.476, max 0.663, i.e. < 0.28% of R*).
 *   So the delta drift of the crossing reach is captured to sub-1-reach precision by a
 *   FIRST-ORDER linear-in-delta correction -- no curvature is resolvable over the
 *   narrow float64-clean window delta in [0.372, 0.470] (a 3-point quadratic has zero
 *   degrees of freedom and is degenerate, so "second order" is neither needed nor
 *   measurable here). The LITERAL guessed form R* = 250 - c*delta is REFUTED in its
 *   intercept: the fitted intercept is 325.4, not 250. The 250 of imp-95761 is the
 *   reach-ENVELOPE constant in N_max ~ 250/delta (a different object, the round
 *   upper bound on the crossing reach), not the intercept of R*(delta).
 *
 * RESULT 2 -- THE DD-SIDE CROSSING TEST IS BLOCKED BY EIGENSOLVER UNDER-CONVERGENCE,
 * NOT BY THE REACH LAW. Extrapolating the RESULT-1 line to the DD side predicts
 * R*_pred = 259.87 (ln 1.35, N_max* = 865) and 276.67 (ln 1.25, N_max* = 1239).
 * Measuring the finite-grid C-fit relErr = (B/A - C_pred)/C_pred there with the
 * imp-95779 O(N^2) DD Levinson inverse-iteration solver (identical 5-point grid
 * [Nmin, 1.7 Nmin, 2.6 Nmin, 3.6 Nmin, Nmax], Nmin = round(Nmax/4)) FAILS a control:
 *
 *   (a) CONTROL on float64-clean ln 1.45 (where float64 IS reliable, lambda_min ~ 2e-10
 *       sits far above the float64 floor): the DD C-fit gives relErr = -6.90% at
 *       reach 200 (float64 truth: -1.50%) and -1.30% at reach 260 (float64 truth:
 *       -0.88%). The DD readout is systematically MORE negative and does NOT reproduce
 *       the known float64 crossing.
 *
 *   (b) MECHANISM: the DD Levinson inverse iteration converges from ABOVE and is
 *       under-converged at large N because the bottom eigen-gap (lambda_2 - lambda_min)
 *       collapses as N grows. At N = 699 the 800-solve budget returns
 *       lambda_min = 1.9708067076e-10, biased HIGH by 4.25e-6 relative versus the
 *       converged 2000/5000-solve value 1.9707983301e-10. This tiny N-dependent
 *       high-bias corrupts the small B = dlam/dh slope coefficient of the C-fit.
 *
 *   (c) At the extrapolated crossing the failure is catastrophic: ln 1.35 at
 *       R*_pred = 260 needs N_max = 865, where lambda_min goes NON-MONOTONE
 *       (N = 778: 4.373312e-13 -> N = 865: 4.378747e-13, it RISES), collapsing the
 *       C-fit to C_fit = 3.27, relErr = -94.0%. This is the SAME pathology imp-95779
 *       already documented at ln 1.2 (reach 250: C_fit = -16.3%, lambda_min
 *       non-monotone at the top).
 *
 *   So the fully-DD side does NOT cross sub-1% at the extrapolated R* with the current
 *   fixed-budget O(N^2) Levinson inverse-iteration solver: the near-degenerate bottom
 *   eigenpair makes inverse iteration converge too slowly at the N_max ~ 865-1240 the
 *   extrapolation requires. The reach-universality itself PERSISTS qualitatively on the
 *   DD side (DD ln 1.35 tracks DD ln 1.45 at fixed reach: -7.12% vs -6.90% at reach 200),
 *   so this is a SOLVER-CONVERGENCE wall, not a failure of the law.
 *
 * HONEST SCOPE / RESIDUAL SUB-GAP. (a) Part 1 (the R*(delta) drift shape) is RESOLVED:
 * clean first-order linear, intercept ~325 (the guessed 250-intercept is refuted).
 * (b) Part 2 (the DD-side crossing at the extrapolated R*) stays OPEN, bottlenecked on
 * a converged bottom-eigenpair solver -- NEW named sub-gap
 * imp-95799-dd-crossing-needs-converged-eigensolver, refining imp-95779's grid-cost
 * sub-gap. (c) Model seam family only; the imp-95212 envelope port, signed WEIGHT and
 * modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-95786-reach-universality-crossval (the R* drift residual fit here)
 * @see imp-95779-on2-dd-toeplitz-lambda-min-ln12 (the O(N^2) DD solver + its ln1.2 under-convergence precedent)
 * @see imp-95761-szego-coefficient-larger-grid-subpct (the reach-universality law N_max ~ 250/delta)
 * @see imp-95704-rho1-szego-coefficient-delta-scaling (the dual-derived law C = pi^2/(2 delta^2))
 */

export const IMP95799_RSTAR_DELTA_DRIFT_LINEAR_FIT = {
  id: "imp-95799",
  title:
    "FIT the imp-95786 R*-delta drift: the Szego reach-crossing R*(delta) is a CLEAN " +
    "FIRST-ORDER linear drift R* = 325.393 - 218.342*delta (R^2 = 0.99715) -- the guessed " +
    "250-intercept form is REFUTED (325, not 250). The fully-DD side (ln 1.35 / ln 1.25) does " +
    "NOT cross sub-1% at the extrapolated R*: the imp-95779 DD Levinson inverse-iteration " +
    "solver is under-converged at the required N_max ~ 865-1240 (non-monotone lambda_min, " +
    "C-fit collapses to -94% at ln 1.35 R*=260), the same wall imp-95779 hit at ln 1.2",
  question:
    "does R*(delta) follow a clean R* = 250 - c*delta second-order form, and does the " +
    "fully-DD side (delta = ln 1.35, ln 1.25) cross sub-1% at the extrapolated R*?",
  // ---- RESULT 1: linear R*(delta) fit on the three float64-clean crossings ----
  crossingsFloat64Clean: [
    { delta: "ln1.6", deltaVal: 0.47000362924573563, rStar: 223.0 },
    { delta: "ln1.5", deltaVal: 0.4054651081095651, rStar: 236.2 },
    { delta: "ln1.45", deltaVal: 0.3715635564324801, rStar: 244.7 },
  ],
  linearFit: {
    form: "R*(delta) = a + b*delta  (c = -b)",
    a: 325.39326, // intercept
    b: -218.34220, // slope
    c: 218.34220, // R* = 325.393 - 218.342*delta
    r2: 0.997153,
    rmsResid: 0.476402,
    maxAbsResid: 0.663, // < 0.28% of R*
    intercept250Refuted: true, // fitted intercept is ~325, not the guessed 250
    interceptNote:
      "the 250 of imp-95761 is the reach-envelope constant in N_max ~ 250/delta, " +
      "NOT the intercept of R*(delta); the crossing-reach intercept is 325.4",
    orderNeeded: "first (linear); no curvature resolvable over delta in [0.372, 0.470] (3-point quadratic degenerate)",
  },
  // ---- RESULT 1b: extrapolation of the linear fit to the DD side ----
  ddExtrapolation: [
    { delta: "ln1.35", deltaVal: 0.30010459245033516, rStarPred: 259.87, nMaxStarPred: 865 },
    { delta: "ln1.25", deltaVal: 0.22314355131420976, rStarPred: 276.67, nMaxStarPred: 1239 },
  ],
  // ---- RESULT 2: DD-side crossing test (baked from tmp/imp-95799-ddcross.mjs) ----
  // control on float64-clean ln1.45: DD C-fit vs the reliable float64 truth (imp-95786)
  ddControlLn145: [
    { reach: 200, nMax: 537, ddRelErr: -0.06904, float64RelErr: -0.01503 },
    { reach: 260, nMax: 699, ddRelErr: -0.01296, float64RelErr: -0.00878 },
  ],
  // DD side at / near the extrapolated R* -- reach law persists but crossing is blown by under-convergence
  ddSideLn135: [
    { reach: 200, nMax: 665, ddRelErr: -0.07120 }, // tracks DD ln1.45 reach200 (-6.90%): reach-universality persists
    { reach: 260, nMax: 865, ddRelErr: -0.94029, lambdaMinNonMonotoneAtTop: true }, // R*_pred: C-fit collapses
  ],
  // under-convergence mechanism: lambda_min converges from ABOVE (biased high at the 800-solve budget)
  underConvergenceProof: {
    delta: "ln1.45",
    N: 699,
    lambdaMin_800iter: 1.9708067076e-10,
    lambdaMin_2000iter: 1.9707983304e-10,
    lambdaMin_5000iter: 1.9707983301e-10, // 2000 already converged; 800 biased high by 4.25e-6 rel
    relBiasOf800Budget: 4.25e-6,
    convergesFromAbove: true,
  },
  ln135TopNonMonotone: { nLo: 778, lambdaLo: 4.373311625e-13, nHi: 865, lambdaHi: 4.378747129e-13 }, // RISES -> under-converged
  // findings
  rStarDriftIsLinear: true,
  intercept250Refuted: true,
  ddCrossingConfirmedAtExtrapolatedRstar: false, // BLOCKED by solver under-convergence
  ddCrossingBlockedBySolver: true,
  reachUniversalityPersistsOnDDSide: true, // DD ln1.35 tracks DD ln1.45 at fixed reach
  boundChange: false,
  qed: false,
  subGap: "imp-95799-dd-crossing-needs-converged-eigensolver",
  verdict:
    "PART 1 RESOLVED: the imp-95786 crossing-reach drift R*(delta) is a CLEAN FIRST-ORDER " +
    "linear function R* = 325.393 - 218.342*delta (R^2 = 0.99715, residuals +0.23/-0.66/+0.44, " +
    "RMS 0.476, all < 0.28% of R*). The guessed R* = 250 - c*delta form is REFUTED in its " +
    "intercept: the fitted intercept is 325.4, not 250 (the 250 is the imp-95761 reach-envelope " +
    "constant N_max ~ 250/delta, a different object). No curvature is resolvable over the narrow " +
    "float64-clean window delta in [0.372, 0.470], so a first-order correction suffices and a " +
    "second-order term is neither needed nor measurable. PART 2 BLOCKED: extrapolating the line " +
    "predicts R*_pred = 259.87 (ln 1.35) and 276.67 (ln 1.25), but the fully-DD C-fit at those " +
    "reaches cannot confirm the crossing -- a control on float64-clean ln 1.45 (where float64 is " +
    "reliable) shows the DD readout is systematically too negative (-6.90% vs -1.50% at reach 200, " +
    "-1.30% vs -0.88% at reach 260), and at ln 1.35 R*_pred = 260 (N_max = 865) lambda_min goes " +
    "non-monotone (4.373312e-13 -> 4.378747e-13) and the C-fit collapses to -94.0%. The cause is " +
    "the imp-95779 O(N^2) Levinson inverse-iteration solver under-converging at large N (bottom " +
    "eigen-gap collapse: at N = 699 the 800-solve lambda_min 1.9708067e-10 is biased high by " +
    "4.25e-6 vs the converged 1.9707983e-10), the same wall imp-95779 hit at ln 1.2 (reach 250: " +
    "-16.3%). The reach-universality itself PERSISTS on the DD side (DD ln 1.35 tracks DD ln 1.45 " +
    "at fixed reach), so the DD-side crossing is a SOLVER-CONVERGENCE bottleneck, not a failure " +
    "of the law -- new named sub-gap imp-95799-dd-crossing-needs-converged-eigensolver. Model " +
    "seam family only; the imp-95212 envelope port, signed WEIGHT and modulus/phase legs stay " +
    "OPEN. Changes no bound of the Lambda program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95799"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: re-derive the cheap linear R*(delta)
// fit + extrapolation from the baked crossings; check the baked DD literals. No
// DD eigensolve runs at import.)
// ---------------------------------------------------------------------------

function linFit(xs, ys) {
  const n = xs.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sx += xs[i]; sy += ys[i]; sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
  const b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - b * sx) / n;
  let ssr = 0, sst = 0; const yb = sy / n;
  for (let i = 0; i < n; i++) { const p = a + b * xs[i]; ssr += (ys[i] - p) ** 2; sst += (ys[i] - yb) ** 2; }
  return { a, b, r2: 1 - ssr / sst, rms: Math.sqrt(ssr / n) };
}

const REF = IMP95799_RSTAR_DELTA_DRIFT_LINEAR_FIT;
const XS = REF.crossingsFloat64Clean.map((c) => c.deltaVal);
const YS = REF.crossingsFloat64Clean.map((c) => c.rStar);
const FIT = linFit(XS, YS);

export const IMP95799_ASSERTIONS = [
  {
    id: "imp95799-linear-fit-reproduces-baked-constants",
    description:
      "re-deriving the least-squares line R* = a + b*delta on the three float64-clean crossings " +
      "reproduces the baked a = 325.393, b = -218.342 and R^2 = 0.99715",
    holds: () =>
      Math.abs(FIT.a - REF.linearFit.a) < 5e-3 &&
      Math.abs(FIT.b - REF.linearFit.b) < 5e-3 &&
      Math.abs(FIT.r2 - REF.linearFit.r2) < 1e-4,
  },
  {
    id: "imp95799-fit-is-tight-first-order",
    description:
      "the linear fit is tight (R^2 > 0.99, RMS residual < 1 reach unit): a first-order linear-in-delta " +
      "drift captures R*(delta) to sub-1-reach precision, so no second-order term is resolvable",
    holds: () => FIT.r2 > 0.99 && FIT.rms < 1 && REF.rStarDriftIsLinear === true,
  },
  {
    id: "imp95799-intercept-250-refuted",
    description:
      "the fitted intercept is ~325, far from the guessed 250 (the 250 is the imp-95761 reach-envelope " +
      "constant, not the R*(delta) intercept): the literal R* = 250 - c*delta form is refuted",
    holds: () => FIT.a > 300 && Math.abs(FIT.a - 250) > 50 && REF.intercept250Refuted === true,
  },
  {
    id: "imp95799-dd-extrapolation-matches-line",
    description:
      "the baked DD-side R*_pred values equal the linear fit evaluated at ln 1.35 / ln 1.25 " +
      "(259.87 / 276.67) and the N_max* = round(R*_pred/delta - 1)",
    holds: () =>
      REF.ddExtrapolation.every((e) => {
        const pred = FIT.a + FIT.b * e.deltaVal;
        return Math.abs(pred - e.rStarPred) < 0.1 && Math.round(pred / e.deltaVal - 1) === e.nMaxStarPred;
      }),
  },
  {
    id: "imp95799-dd-control-fails-on-ln145",
    description:
      "the DD C-fit does NOT reproduce the reliable float64 ln 1.45 bias at either control reach " +
      "(DD systematically more negative), so the DD readout is not trustworthy at these reaches",
    holds: () =>
      REF.ddControlLn145.every((r) => r.ddRelErr < r.float64RelErr) &&
      Math.abs(REF.ddControlLn145[0].ddRelErr - REF.ddControlLn145[0].float64RelErr) > 0.03,
  },
  {
    id: "imp95799-dd-crossing-blown-at-extrapolated-rstar",
    description:
      "at the extrapolated R*_pred = 260 for ln 1.35 (N_max = 865) the DD C-fit collapses (relErr ~ -94%) " +
      "with lambda_min non-monotone at the top: the crossing cannot be confirmed there",
    holds: () => {
      const r = REF.ddSideLn135.find((x) => x.reach === 260);
      return r.ddRelErr < -0.5 && r.lambdaMinNonMonotoneAtTop === true &&
        REF.ln135TopNonMonotone.lambdaHi > REF.ln135TopNonMonotone.lambdaLo &&
        REF.ddCrossingConfirmedAtExtrapolatedRstar === false;
    },
  },
  {
    id: "imp95799-under-convergence-from-above",
    description:
      "the DD Levinson lambda_min at N = 699 descends with the inverse-iteration budget (800 -> 2000 -> 5000): " +
      "it converges from above, so the 800-solve budget used in the C-fit is biased high",
    holds: () => {
      const u = REF.underConvergenceProof;
      return u.lambdaMin_800iter > u.lambdaMin_2000iter &&
        u.lambdaMin_2000iter >= u.lambdaMin_5000iter &&
        u.convergesFromAbove === true && REF.ddCrossingBlockedBySolver === true;
    },
  },
  {
    id: "imp95799-reach-universality-persists-on-dd-side",
    description:
      "at fixed reach 200 the DD ln 1.35 and DD ln 1.45 C-fit biases agree closely (-7.12% vs -6.90%): " +
      "the reach-universality persists on the DD side, so the crossing failure is a solver wall not a law failure",
    holds: () => {
      const a35 = REF.ddSideLn135.find((x) => x.reach === 200).ddRelErr;
      const a45 = REF.ddControlLn145.find((x) => x.reach === 200).ddRelErr;
      return Math.abs(a35 - a45) < 0.01 && REF.reachUniversalityPersistsOnDDSide === true;
    },
  },
  {
    id: "imp95799-not-a-bound",
    description: "numerical fit + obstruction module; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.subGap === "imp-95799-dd-crossing-needs-converged-eigensolver" &&
      REF.closesTickets.includes("imp-95799"),
  },
];

for (const a of IMP95799_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95799-rstar-delta-drift-linear-fit assertion failed: ${a.id}`);
  }
}

export default IMP95799_RSTAR_DELTA_DRIFT_LINEAR_FIT;
