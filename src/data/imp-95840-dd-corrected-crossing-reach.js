/**
 * imp-95840 -- DERIVE a corrected crossing-reach relation R*(delta) for the
 * fully-double-double deltas: the imp-95799 linear R*(delta) mildly UNDER-predicts
 * the sub-1% crossing on the ln1.35 / ln1.25 side (imp-95820 RESULT 4).
 *
 * GRADE: numerical measurement / curve-fit. Import-light: the DD-side reach
 * sweeps are the BAKED imp-95820 RESULT-4 (reach, relErr) cells; this module runs
 * NO double-double eigensolve at import. The self-executing assertions re-derive
 * (a) the DD crossing reaches by a log-log power-law interpolation of the baked
 * imp-95820 sweeps, (b) the linear-line offsets, (c) the corrected quadratic fit,
 * and (d) the DD-side correction term -- all from cheap arithmetic on baked
 * literals. No zeros bundle.
 *
 * WHAT imp-95820 LEFT OPEN. imp-95820 RESULT 4 measured the fully-DD crossings
 * with the PD-preserving shift-invert DD Toeplitz solver and found the sub-1%
 * crossing sits slightly BEYOND the imp-95799 linear R*_pred: at the extrapolated
 * R*_pred (259.87 for ln1.35, 276.67 for ln1.25) both DD deltas are still
 * ~-1.05% / ~-1.15% (i.e. |relErr| > 1%), so the linear line UNDER-predicts the
 * crossing reach on the DD side. imp-95820 flagged this as "a small extension of
 * imp-95799 RESULT 1, not a contradiction" but did not quantify or fit it.
 *
 * RESULT 1 -- THE DD CROSSING REACHES, BY POWER-LAW INTERPOLATION. The imp-95820
 * RESULT-4 finite-grid C-fit residual decays as a clean power law in the reach:
 * |relErr| = K * reach^p with p = -2.17 (consistent with the expected 1/reach^2
 * finite-section tail), fitting the three baked cells per delta to R^2 > 0.9999:
 *
 *     ln1.35: |relErr| = 1783.3 * reach^-2.1653  (R^2 0.99993) -> R*_meas = 266.18
 *     ln1.25: |relErr| = 2568.3 * reach^-2.1897  (R^2 0.99998) -> R*_meas = 295.43
 *
 *   where R*_meas solves |relErr| = 0.01 (the same sub-1% crossing definition
 *   imp-95786/imp-95799 used for the float64-clean R* = 223.0 / 236.2 / 244.7).
 *   These interpolated DD crossings carry ~+-2-reach uncertainty (3-cell fits).
 *
 * RESULT 2 -- THE imp-95799 LINEAR LINE UNDER-PREDICTS ON THE DD SIDE, AND THE
 * OFFSET GROWS AS delta SHRINKS. Evaluating the imp-95799 line
 * R*_lin(delta) = 325.393 - 218.342*delta at all five crossings, the residual
 * (measured - linear) is a fit residual on the float64 side (the three points the
 * line was fit through) but a systematic, growing POSITIVE offset on the DD side:
 *
 *     ln1.6  +0.23 | ln1.5  -0.66 | ln1.45 +0.43   (float64: fit residuals, |.|<0.7)
 *     ln1.35 +6.31 | ln1.25 +18.76                 (DD: positive, growing as delta drops)
 *
 *   So the linear R*(delta) mildly under-predicts the DD-side crossing reach, by an
 *   amount that GROWS from ~6 reach at ln1.35 to ~19 reach at ln1.25 -- i.e. the true
 *   R*(delta) has UPWARD curvature at small delta that the narrow float64 window
 *   (delta in [0.372, 0.470]) could not resolve (imp-95799 noted a 3-point quadratic
 *   there is degenerate).
 *
 * RESULT 3 -- A CORRECTED QUADRATIC R*(delta) CAPTURES IT. Adding the two DD
 * crossings widens the window to delta in [0.223, 0.470], where a curvature term IS
 * resolvable. A least-squares quadratic through all five crossings gives
 *
 *     R*(delta) = 412.881 - 637.512*delta + 497.084*delta^2   (R^2 0.999987)
 *
 *   with RMS residual 0.091 reach (max |resid| 0.15 at ln1.35), a ~5x tighter fit
 *   than forcing linearity on the DD side. The positive a2 = +497 is the upward
 *   curvature that produces the DD-side under-prediction of the linear line.
 *
 * RESULT 4 -- EQUIVALENT DD-SIDE CORRECTION TERM. Keeping the imp-95799 float64
 * line and adding a single DD-side correction delta_R(delta) = kappa*(d0 - delta)^2
 * (offset -> 0 near the float64 window edge d0, grows quadratically into the DD
 * corner) reproduces both DD offsets exactly with
 *
 *     d0 = 0.40636 (~ ln 1.501),  kappa = 558.85     (2 offsets, 2 params: exact)
 *
 *   i.e. R*_corrected(delta) = 325.393 - 218.342*delta + 558.85*(0.40636 - delta)^2
 *   for delta <= d0. The correction vanishes at the top of the float64 window and
 *   turns on only in the DD corner, consistent with RESULT 2's growing offset.
 *
 * HONEST SCOPE / RESIDUAL SUB-GAP. (a) The DD crossing reaches are INTERPOLATED
 * from imp-95820's three baked reach cells per delta via a power-law fit (very tight,
 * R^2 > 0.9999, but 3-cell, so ~+-2-reach); a denser reach sweep (esp. cells
 * bracketing the -1% level) would sharpen R*_meas and hence the a2 curvature and
 * kappa. (b) The RESULT-4 correction term is a 2-point (zero-dof) fit; the RESULT-3
 * quadratic (5 points, 2 dof) is the more robust deliverable but its curvature is
 * still driven mainly by the two DD points. (c) Measurement/curve-fit of an
 * established scaling law; no new cited input. Model seam family only; the imp-95212
 * envelope port, signed WEIGHT and modulus/phase legs stay OPEN. Changes NO bound of
 * the Lambda program; NO QED; no refereed bound is changed; Sun
 * arXiv:2609.04176 unrefereed.
 *
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the RESULT-4 DD reach sweeps fit here)
 * @see imp-95799-rstar-delta-drift-linear-fit (the linear R*(delta) line corrected here)
 * @see imp-95786-reach-universality-crossval (the float64-clean R* crossings and the sub-1% definition)
 * @see imp-95761-szego-coefficient-larger-grid-subpct (the reach-universality law N_max ~ 250/delta)
 */

// ---- imp-95820 RESULT-4 baked DD-side reach sweeps: (reach, relErr) ----
const DD_SWEEP_LN135 = [
  { reach: 200, relErr: -0.01861 },
  { reach: 260, relErr: -0.01047 },
  { reach: 320, relErr: -0.00673 },
];
const DD_SWEEP_LN125 = [
  { reach: 220, relErr: -0.01909 },
  { reach: 277, relErr: -0.01149 },
  { reach: 340, relErr: -0.00736 },
];

export const IMP95840_DD_CORRECTED_CROSSING_REACH = {
  id: "imp-95840",
  title:
    "DERIVE a corrected crossing-reach R*(delta) for the fully-DD deltas: the imp-95799 linear " +
    "R*(delta) = 325.393 - 218.342*delta UNDER-predicts the sub-1% crossing on the ln1.35 / ln1.25 " +
    "side by a growing offset (+6.31 at ln1.35, +18.76 at ln1.25). The DD crossings (R*_meas = 266.18 " +
    "/ 295.43, power-law interpolated from the imp-95820 RESULT-4 sweeps, R^2 > 0.9999) widen the " +
    "window enough to resolve a curvature term: a quadratic R*(delta) = 412.881 - 637.512*delta + " +
    "497.084*delta^2 (R^2 0.999987, RMS 0.091) captures the DD-side under-prediction, equivalently a " +
    "correction 558.85*(0.40636 - delta)^2 turned on below the float64 window edge",
  question:
    "assembling the ln1.45 / ln1.35 / ln1.25 measured crossing reaches, how large is the DD-side " +
    "offset from the imp-95799 linear R*(delta), and what corrected relation (or DD-side correction " +
    "term) captures it?",
  // ---- RESULT 1: DD crossing reaches, power-law interpolation of the imp-95820 sweeps ----
  ddSweepLn135: DD_SWEEP_LN135,
  ddSweepLn125: DD_SWEEP_LN125,
  ddPowerFit: [
    { delta: "ln1.35", p: -2.1653, K: 1783.25, r2: 0.99993, rStarMeas: 266.18 },
    { delta: "ln1.25", p: -2.1897, K: 2568.32, r2: 0.99998, rStarMeas: 295.43 },
  ],
  powerExponentNote:
    "|relErr| ~ reach^-2.17 at both DD deltas, consistent with the 1/reach^2 finite-section C-fit tail",
  // ---- the five assembled crossings (3 float64 baked, 2 DD interpolated) ----
  crossings: [
    { name: "ln1.6", delta: 0.47000362924573563, rStar: 223.0, side: "float64" },
    { name: "ln1.5", delta: 0.4054651081095651, rStar: 236.2, side: "float64" },
    { name: "ln1.45", delta: 0.3715635564324801, rStar: 244.7, side: "float64" },
    { name: "ln1.35", delta: 0.30010459245033516, rStar: 266.18, side: "DD" },
    { name: "ln1.25", delta: 0.22314355131420976, rStar: 295.43, side: "DD" },
  ],
  // ---- RESULT 2: offsets from the imp-95799 linear line ----
  linearLine: { a: 325.39326, b: -218.3422 }, // R*_lin = a + b*delta
  offsets: [
    { name: "ln1.6", offset: 0.23, side: "float64" },
    { name: "ln1.5", offset: -0.66, side: "float64" },
    { name: "ln1.45", offset: 0.43, side: "float64" },
    { name: "ln1.35", offset: 6.31, side: "DD" },
    { name: "ln1.25", offset: 18.76, side: "DD" },
  ],
  linearUnderPredictsOnDDSide: true,
  ddOffsetGrowsAsDeltaShrinks: true,
  // ---- RESULT 3: corrected quadratic through all five crossings ----
  quadraticFit: {
    form: "R*(delta) = a0 + a1*delta + a2*delta^2",
    a0: 412.8814,
    a1: -637.5117,
    a2: 497.0845, // positive: upward curvature -> DD-side under-prediction of the linear line
    r2: 0.999987,
    rmsResid: 0.091,
    maxAbsResid: 0.152,
  },
  // ---- RESULT 4: equivalent DD-side correction term on the imp-95799 float64 line ----
  correctionTerm: {
    form: "R*_corrected(delta) = 325.393 - 218.342*delta + kappa*(d0 - delta)^2  (delta <= d0)",
    d0: 0.40636, // ~ ln 1.501: correction vanishes at the float64 window edge
    kappa: 558.85, // 2 offsets, 2 params -> exact; grows into the DD corner
    exactOnTwoDDPoints: true,
  },
  // ---- findings ----
  boundChange: false,
  qed: false,
  subGap: "imp-95840-dd-crossing-reach-needs-denser-sweep",
  verdict:
    "The imp-95799 linear crossing-reach line R*(delta) = 325.393 - 218.342*delta mildly UNDER-predicts " +
    "the fully-DD sub-1% crossing (imp-95820 RESULT 4). Interpolating the imp-95820 RESULT-4 reach " +
    "sweeps by a power law |relErr| = K*reach^p (p ~ -2.17, R^2 > 0.9999, the 1/reach^2 finite-section " +
    "tail) puts the sub-1% crossings at R*_meas = 266.18 (ln1.35) and 295.43 (ln1.25), versus the " +
    "linear R*_pred 259.87 / 276.67 -- a positive offset of +6.31 / +18.76 reach that GROWS as delta " +
    "shrinks, while the three float64-clean crossings sit on the line to |resid| < 0.7 (they are the " +
    "fit points). Widening the delta window to [0.223, 0.470] with the two DD crossings resolves a " +
    "curvature term the narrow float64 window could not: a least-squares quadratic R*(delta) = 412.881 " +
    "- 637.512*delta + 497.084*delta^2 (R^2 0.999987, RMS residual 0.091 reach) captures the DD-side " +
    "under-prediction (~5x tighter than forcing linearity on the DD side), the positive a2 = +497 being " +
    "the upward curvature that produces it. Equivalently, keeping the imp-95799 float64 line and adding " +
    "a DD-side correction delta_R = 558.85*(0.40636 - delta)^2 (vanishing near the float64 window edge " +
    "d0 ~ ln1.501, growing into the DD corner) reproduces both DD offsets exactly. Residual: the DD " +
    "crossing reaches are power-law-interpolated from three baked reach cells each (~+-2-reach) and the " +
    "correction term is a 2-point zero-dof fit, so a denser DD reach sweep (cells bracketing the -1% " +
    "level) would sharpen a2 / kappa -- new named sub-gap imp-95840-dd-crossing-reach-needs-denser-sweep. " +
    "Measurement / curve-fit of an established scaling law; model seam family only (imp-95212 envelope " +
    "port, signed WEIGHT and modulus/phase legs stay OPEN); changes no bound; NO QED; no refereed bound is changed" +
    "; Sun arXiv:2609.04176 unrefereed.",
  closesTickets: ["imp-95840"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: re-derive the DD power-law crossings,
// the linear-line offsets, the corrected quadratic, and the correction term from
// the baked (reach, relErr) sweeps + baked crossings. No DD eigensolve at import.)
// ---------------------------------------------------------------------------

// log-log power fit |relErr| = K*reach^p, crossing reach where |relErr| = target
function powerCrossing(rows, target) {
  const xs = rows.map((r) => Math.log(r.reach));
  const ys = rows.map((r) => Math.log(Math.abs(r.relErr)));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b) / n;
  const my = ys.reduce((a, b) => a + b) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  const p = sxy / sxx;
  const lnK = my - p * mx;
  let ssr = 0, sst = 0;
  for (let i = 0; i < n; i++) { const pr = lnK + p * xs[i]; ssr += (ys[i] - pr) ** 2; sst += (ys[i] - my) ** 2; }
  return { p, K: Math.exp(lnK), r2: 1 - ssr / sst, reachStar: Math.exp((Math.log(target) - lnK) / p) };
}

// least-squares quadratic y = a0 + a1 x + a2 x^2 via normal equations (Cramer)
function quadFit(xs, ys) {
  const X = xs.map((x) => [1, x, x * x]);
  const XtX = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], Xty = [0, 0, 0];
  for (let i = 0; i < xs.length; i++)
    for (let r = 0; r < 3; r++) { Xty[r] += X[i][r] * ys[i]; for (let c = 0; c < 3; c++) XtX[r][c] += X[i][r] * X[i][c]; }
  const det = (m) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D0 = det(XtX);
  const rep = (col) => { const m = XtX.map((r) => r.slice()); for (let i = 0; i < 3; i++) m[i][col] = Xty[i]; return det(m) / D0; };
  const co = [rep(0), rep(1), rep(2)];
  let ssr = 0, sst = 0; const my = ys.reduce((s, v) => s + v) / ys.length;
  let maxAbs = 0;
  for (let i = 0; i < xs.length; i++) {
    const pr = co[0] + co[1] * xs[i] + co[2] * xs[i] ** 2;
    ssr += (ys[i] - pr) ** 2; sst += (ys[i] - my) ** 2; maxAbs = Math.max(maxAbs, Math.abs(ys[i] - pr));
  }
  return { co, r2: 1 - ssr / sst, rms: Math.sqrt(ssr / xs.length), maxAbs };
}

const REF = IMP95840_DD_CORRECTED_CROSSING_REACH;

export const IMP95840_ASSERTIONS = [
  {
    id: "imp95840-dd-power-crossings-reproduce-baked",
    description:
      "power-law fits of the baked imp-95820 RESULT-4 sweeps reproduce the baked DD crossing reaches " +
      "(266.18 / 295.43), exponents ~-2.17, and R^2 > 0.9999",
    holds: () => {
      const c135 = powerCrossing(REF.ddSweepLn135, 0.01);
      const c125 = powerCrossing(REF.ddSweepLn125, 0.01);
      return (
        Math.abs(c135.reachStar - 266.18) < 0.5 &&
        Math.abs(c125.reachStar - 295.43) < 0.5 &&
        c135.r2 > 0.9999 && c125.r2 > 0.9999 &&
        Math.abs(c135.p + 2.17) < 0.05 && Math.abs(c125.p + 2.17) < 0.05
      );
    },
  },
  {
    id: "imp95840-linear-underpredicts-dd-growing-offset",
    description:
      "the imp-95799 linear line offsets are |.| < 0.7 on the float64 side (fit points) but positive and " +
      "growing on the DD side (+6.31 ln1.35, +18.76 ln1.25): the line under-predicts the DD crossing",
    holds: () => {
      const { a, b } = REF.linearLine;
      const off = (c) => c.rStar - (a + b * c.delta);
      const byName = Object.fromEntries(REF.crossings.map((c) => [c.name, off(c)]));
      const f = REF.crossings.filter((c) => c.side === "float64").every((c) => Math.abs(off(c)) < 0.7);
      return (
        f &&
        Math.abs(byName["ln1.35"] - 6.31) < 0.1 &&
        Math.abs(byName["ln1.25"] - 18.76) < 0.1 &&
        byName["ln1.25"] > byName["ln1.35"] &&
        REF.linearUnderPredictsOnDDSide === true &&
        REF.ddOffsetGrowsAsDeltaShrinks === true
      );
    },
  },
  {
    id: "imp95840-corrected-quadratic-reproduces-baked",
    description:
      "the least-squares quadratic through all five crossings reproduces the baked coefficients " +
      "(a0 412.881, a1 -637.512, a2 +497.084), R^2 0.999987 and RMS residual < 0.15 reach",
    holds: () => {
      const xs = REF.crossings.map((c) => c.delta);
      const ys = REF.crossings.map((c) => c.rStar);
      const q = quadFit(xs, ys);
      return (
        Math.abs(q.co[0] - REF.quadraticFit.a0) < 0.5 &&
        Math.abs(q.co[1] - REF.quadraticFit.a1) < 0.5 &&
        Math.abs(q.co[2] - REF.quadraticFit.a2) < 0.5 &&
        q.co[2] > 0 && q.r2 > 0.9999 && q.rms < 0.15
      );
    },
  },
  {
    id: "imp95840-quadratic-beats-linear-on-dd-side",
    description:
      "the corrected quadratic RMS residual over all five crossings is far smaller than forcing the " +
      "imp-95799 linear line (whose DD residuals are +6.31 / +18.76): curvature is the right correction",
    holds: () => {
      const xs = REF.crossings.map((c) => c.delta);
      const ys = REF.crossings.map((c) => c.rStar);
      const q = quadFit(xs, ys);
      const { a, b } = REF.linearLine;
      let linSsr = 0;
      for (const c of REF.crossings) linSsr += (c.rStar - (a + b * c.delta)) ** 2;
      const linRms = Math.sqrt(linSsr / REF.crossings.length);
      return q.rms < 0.2 && linRms > 3 && q.rms < linRms / 10;
    },
  },
  {
    id: "imp95840-correction-term-reproduces-dd-offsets",
    description:
      "the DD-side correction kappa*(d0 - delta)^2 with the baked d0 = 0.40636, kappa = 558.85 " +
      "reproduces both DD offsets (+6.31 / +18.76) to < 0.2 reach",
    holds: () => {
      const { d0, kappa } = REF.correctionTerm;
      const D135 = 0.30010459245033516, D125 = 0.22314355131420976;
      return (
        Math.abs(kappa * (d0 - D135) ** 2 - 6.31) < 0.2 &&
        Math.abs(kappa * (d0 - D125) ** 2 - 18.76) < 0.2 &&
        d0 > 0.3715635564324801 && d0 < 0.47000362924573563 // ~ln1.501: at the ln1.5 float64 window edge
      );
    },
  },
  {
    id: "imp95840-not-a-bound",
    description: "numerical curve-fit module; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.subGap === "imp-95840-dd-crossing-reach-needs-denser-sweep" &&
      REF.closesTickets.includes("imp-95840"),
  },
];

for (const a of IMP95840_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95840-dd-corrected-crossing-reach assertion failed: ${a.id}`);
  }
}

export default IMP95840_DD_CORRECTED_CROSSING_REACH;
