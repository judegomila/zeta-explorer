/**
 * imp-95858 -- TEST whether the imp-95840 corrected crossing-reach quadratic
 * R*(delta) holds OFF the five-point grid, and whether a further second-order
 * (cubic) term is warranted, WITHOUT a new double-double eigensolve.
 *
 * GRADE: numerical measurement / cross-validation. Import-light: no double-double
 * eigensolve at import, no zeros bundle. The self-executing assertions re-derive a
 * leave-one-out cross-validation of the imp-95840 quadratic and a cubic-significance
 * test from the five BAKED imp-95840 crossings (three float64-clean, two
 * power-law-interpolated DD) -- cheap arithmetic on baked literals only.
 *
 * WHAT imp-95840 LEFT OPEN (sub-gap imp-95840-dd-crossing-reach-needs-denser-sweep).
 * imp-95840 fit the corrected quadratic
 *     R*(delta) = 412.881 - 637.512*delta + 497.084*delta^2   (R^2 0.999987, RMS 0.091)
 * through only five crossings (three float64 fit points plus two DD crossings each
 * power-law-interpolated from three baked imp-95820 reach cells), and asked whether a
 * DENSER DD sweep would show the quadratic form holds off-grid or a further
 * second-order term is needed. A genuine denser DD eigensolve sweep at intermediate
 * deltas (ln1.3, ln1.4) is out of scope for an import-light module; instead this ticket
 * squeezes the existing five crossings with two off-grid diagnostics that need no new
 * eigensolve.
 *
 * RESULT 1 -- THE QUADRATIC IS PREDICTIVE OFF THE GRID (LEAVE-ONE-OUT CV). Refitting
 * the quadratic on four of the five crossings and predicting the held-out fifth gives
 * a leave-one-out (LOO) residual at each delta:
 *
 *     ln1.6  -0.57 | ln1.5  +0.13 | ln1.45 +0.11 | ln1.35 -0.26 | ln1.25 +0.74
 *
 *   LOO-CV RMS = 0.439 reach, max |resid| = 0.735 reach at the extreme ln1.25 DD
 *   corner (~0.25% of R* ~ 295). Holding out even the deepest DD point, the quadratic
 *   fit on the other four predicts it to <0.74 reach -- i.e. the corrected R*(delta)
 *   form genuinely holds off the five-point grid, it is not just interpolating its own
 *   fit points. (In-sample RMS was 0.090; the ~5x LOO inflation is the expected small-
 *   sample penalty, still sub-1-reach everywhere.)
 *
 * RESULT 2 -- A FURTHER SECOND-ORDER (CUBIC) TERM IS NOT COMPELLED. A least-squares
 * cubic through all five crossings is
 *
 *     R*(delta) = 421.40 - 716.86*delta + 732.98*delta^2 - 225.29*delta^3
 *
 *   Its cubic coefficient a3 = -225.29 is ~45% of the quadratic curvature a2 = +497
 *   (|a3/a2| = 0.453) and it drops the IN-SAMPLE RMS from 0.090 to 0.015 reach -- but
 *   with five points and four parameters (one degree of freedom) that near-interpolation
 *   is exactly what an unwarranted extra term does. The discriminator is the OFF-GRID
 *   LOO-CV RMS: cubic 0.339 vs quadratic 0.439 reach -- only a marginal improvement
 *   (max |resid| 0.66 vs 0.74), well inside the ~+-2-reach uncertainty the DD crossings
 *   already carry (they are 3-cell power-law interpolations). So the a3 term is NOT
 *   distinguishable from a 1-dof overfit on the present data: the quadratic remains the
 *   right-order corrected relation, and no further second-order term is warranted from
 *   the five crossings.
 *
 * HONEST SCOPE / RESIDUAL SUB-GAP. This is a cross-validation of the EXISTING five
 * crossings, NOT a new denser DD eigensolve sweep: it shows the imp-95840 quadratic is
 * off-grid predictive (LOO RMS 0.44 reach) and that a cubic term is not compelled, but
 * it cannot manufacture new crossings. Settling whether the small a3 = -225 cubic
 * signal is real requires a genuine double-double shift-invert crossing at an
 * intermediate delta (ln1.3 or ln1.4) -- new named sub-gap
 * imp-95858-intermediate-delta-dd-eigensolve-crossing. Measurement / cross-validation
 * of an established scaling law; model seam family only (the imp-95212 envelope port,
 * signed WEIGHT and modulus/phase legs stay OPEN); changes NO bound of the Lambda
 * program; NO QED; no refereed bound is changed; Sun arXiv:2609.04176
 * unrefereed.
 *
 * @see imp-95840-dd-corrected-crossing-reach (the quadratic R*(delta) cross-validated here)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the RESULT-4 DD reach sweeps behind the DD crossings)
 * @see imp-95799-rstar-delta-drift-linear-fit (the linear R*(delta) line the quadratic corrects)
 */

// ---- the five baked imp-95840 crossings: (delta, R*, side) ----
const CROSSINGS = [
  { name: "ln1.6", delta: 0.47000362924573563, rStar: 223.0, side: "float64" },
  { name: "ln1.5", delta: 0.4054651081095651, rStar: 236.2, side: "float64" },
  { name: "ln1.45", delta: 0.3715635564324801, rStar: 244.7, side: "float64" },
  { name: "ln1.35", delta: 0.30010459245033516, rStar: 266.18, side: "DD" },
  { name: "ln1.25", delta: 0.22314355131420976, rStar: 295.43, side: "DD" },
];

export const IMP95858_DD_CROSSING_REACH_LOO_CV = {
  id: "imp-95858",
  title:
    "TEST the imp-95840 corrected crossing-reach quadratic R*(delta) off the five-point grid without a " +
    "new DD eigensolve: leave-one-out cross-validation gives LOO-CV RMS 0.439 reach (max |resid| 0.735 " +
    "at the extreme ln1.25 DD corner, ~0.25% of R*), so the quadratic is off-grid predictive; and a " +
    "cubic fit (a3 = -225.29, ~45% of the a2 = +497 curvature) drops in-sample RMS to 0.015 but only " +
    "marginally improves LOO-CV RMS (0.339 vs 0.439), so a further second-order term is NOT compelled",
  question:
    "does the imp-95840 corrected R*(delta) quadratic hold off the five-point grid (leave-one-out), and " +
    "is a further second-order (cubic) term warranted -- using only the five baked crossings, no new DD " +
    "eigensolve?",
  crossings: CROSSINGS,
  // ---- RESULT 1: leave-one-out CV of the quadratic ----
  looCv: {
    residuals: [
      { name: "ln1.6", side: "float64", resid: -0.57 },
      { name: "ln1.5", side: "float64", resid: 0.128 },
      { name: "ln1.45", side: "float64", resid: 0.114 },
      { name: "ln1.35", side: "DD", resid: -0.259 },
      { name: "ln1.25", side: "DD", resid: 0.735 },
    ],
    rms: 0.4386,
    maxAbs: 0.7354,
    maxAbsAt: "ln1.25",
    inSampleRms: 0.09,
    predictiveOffGrid: true,
  },
  // ---- RESULT 2: cubic-significance test ----
  cubicTest: {
    form: "R*(delta) = a0 + a1*delta + a2*delta^2 + a3*delta^3",
    a0: 421.4,
    a1: -716.86,
    a2: 732.98,
    a3: -225.29,
    quadA2: 496.96,
    a3OverA2Abs: 0.4533,
    inSampleRms: 0.0149,
    looRms: 0.3392, // cubic LOO-CV RMS
    quadLooRms: 0.4386, // quadratic LOO-CV RMS (same as looCv.rms)
    furtherTermWarranted: false, // marginal LOO gain within the ~+-2-reach DD uncertainty
  },
  // ---- findings ----
  boundChange: false,
  qed: false,
  subGap: "imp-95858-intermediate-delta-dd-eigensolve-crossing",
  verdict:
    "The imp-95840 corrected crossing-reach quadratic R*(delta) = 412.881 - 637.512*delta + " +
    "497.084*delta^2 was fit through only five crossings (three float64-clean, two DD power-law " +
    "interpolated), leaving the sub-gap imp-95840-dd-crossing-reach-needs-denser-sweep. Without a new " +
    "double-double eigensolve, two off-grid diagnostics squeeze the existing five crossings. (1) A " +
    "leave-one-out cross-validation -- refit the quadratic on four crossings, predict the held-out fifth " +
    "-- gives LOO-CV RMS 0.439 reach with max |resid| 0.735 at the extreme ln1.25 DD corner (~0.25% of " +
    "R* ~ 295): holding out even the deepest DD point, the fit on the other four still predicts it to " +
    "<0.74 reach, so the quadratic form genuinely holds OFF the five-point grid, it is not merely " +
    "interpolating its own fit points (the ~5x inflation over the 0.090 in-sample RMS is the expected " +
    "small-sample penalty, still sub-1-reach everywhere). (2) A cubic through all five crossings has a3 = " +
    "-225.29 (~45% of the a2 = +497 curvature) and drops in-sample RMS to 0.015, but with five points " +
    "and four parameters that near-interpolation is exactly what an unwarranted term does; the off-grid " +
    "discriminator, LOO-CV RMS, improves only marginally (cubic 0.339 vs quadratic 0.439), well inside " +
    "the ~+-2-reach uncertainty the DD crossings already carry, so a further second-order term is NOT " +
    "compelled and the quadratic remains the right-order corrected relation. Residual: this is a " +
    "cross-validation of the existing five crossings, not a new denser DD sweep -- settling whether the " +
    "small a3 signal is real needs a genuine DD shift-invert crossing at an intermediate delta (ln1.3 or " +
    "ln1.4), new named sub-gap imp-95858-intermediate-delta-dd-eigensolve-crossing. Measurement / " +
    "cross-validation of an established scaling law; model seam family only (imp-95212 envelope port, " +
    "signed WEIGHT and modulus/phase legs stay OPEN); changes no bound; NO QED; no refereed bound is changed" +
    "; Sun arXiv:2609.04176 unrefereed.",
  closesTickets: ["imp-95858"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: re-derive the LOO-CV of the quadratic
// and the cubic-significance test from the five baked crossings. No DD eigensolve.)
// ---------------------------------------------------------------------------

// least-squares polynomial fit of degree d via normal equations + Gaussian elimination
function polyFit(xs, ys, d) {
  const n = xs.length, m = d + 1;
  const A = Array.from({ length: m }, () => new Array(m).fill(0));
  const bvec = new Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    const pows = [];
    let p = 1;
    for (let k = 0; k < 2 * d + 1; k++) { pows.push(p); p *= xs[i]; }
    for (let r = 0; r < m; r++) {
      bvec[r] += pows[r] * ys[i];
      for (let c = 0; c < m; c++) A[r][c] += pows[r + c];
    }
  }
  const M = A.map((row, i) => [...row, bvec[i]]);
  for (let col = 0; col < m; col++) {
    let piv = col;
    for (let r = col + 1; r < m; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    const tmp = M[col]; M[col] = M[piv]; M[piv] = tmp;
    const pv = M[col][col];
    for (let c = col; c <= m; c++) M[col][c] /= pv;
    for (let r = 0; r < m; r++) {
      if (r === col) continue;
      const f = M[r][col];
      for (let c = col; c <= m; c++) M[r][c] -= f * M[col][c];
    }
  }
  return M.map((row) => row[m]);
}

function evalPoly(co, x) { let s = 0, p = 1; for (const c of co) { s += c * p; p *= x; } return s; }

function looRms(xs, ys, d) {
  let ssr = 0, maxAbs = 0;
  for (let k = 0; k < xs.length; k++) {
    const xtr = xs.filter((_, i) => i !== k);
    const ytr = ys.filter((_, i) => i !== k);
    const co = polyFit(xtr, ytr, d);
    const resid = ys[k] - evalPoly(co, xs[k]);
    ssr += resid * resid;
    maxAbs = Math.max(maxAbs, Math.abs(resid));
  }
  return { rms: Math.sqrt(ssr / xs.length), maxAbs };
}

const REF = IMP95858_DD_CROSSING_REACH_LOO_CV;
const XS = REF.crossings.map((c) => c.delta);
const YS = REF.crossings.map((c) => c.rStar);

export const IMP95858_ASSERTIONS = [
  {
    id: "imp95858-quadratic-reproduces-imp95840",
    description:
      "the least-squares quadratic through the five baked crossings reproduces the imp-95840 coefficients " +
      "(a0 ~ 412.9, a1 ~ -637.5, a2 ~ +497.0) and in-sample RMS ~ 0.09 reach",
    holds: () => {
      const q = polyFit(XS, YS, 2);
      let ssr = 0;
      for (let i = 0; i < XS.length; i++) ssr += (YS[i] - evalPoly(q, XS[i])) ** 2;
      const rms = Math.sqrt(ssr / XS.length);
      return (
        Math.abs(q[0] - 412.881) < 0.5 &&
        Math.abs(q[1] + 637.512) < 0.5 &&
        Math.abs(q[2] - 497.084) < 0.5 &&
        q[2] > 0 && Math.abs(rms - 0.09) < 0.02
      );
    },
  },
  {
    id: "imp95858-quadratic-predictive-off-grid-loo",
    description:
      "leave-one-out CV of the quadratic gives RMS ~ 0.44 reach and max |resid| ~ 0.74 at the extreme " +
      "ln1.25 DD corner: the corrected R*(delta) form holds off the five-point grid (sub-1-reach everywhere)",
    holds: () => {
      const l = looRms(XS, YS, 2);
      const off = (c) => {
        const idx = REF.crossings.indexOf(c);
        const xtr = XS.filter((_, i) => i !== idx);
        const ytr = YS.filter((_, i) => i !== idx);
        return YS[idx] - evalPoly(polyFit(xtr, ytr, 2), XS[idx]);
      };
      // the worst LOO residual is at the extreme ln1.25 DD corner
      const worst = REF.crossings.reduce((w, c) => (Math.abs(off(c)) > Math.abs(off(w)) ? c : w));
      return (
        Math.abs(l.rms - 0.4386) < 0.02 &&
        Math.abs(l.maxAbs - 0.7354) < 0.02 &&
        l.maxAbs < 1.0 && worst.name === "ln1.25" &&
        REF.looCv.predictiveOffGrid === true
      );
    },
  },
  {
    id: "imp95858-cubic-term-not-compelled",
    description:
      "the cubic a3 ~ -225 is ~45% of the a2 = +497 curvature and cuts in-sample RMS to ~0.015 (5 pts, 4 " +
      "params, near-interpolation), but LOO-CV RMS improves only marginally (0.339 vs 0.439): no further " +
      "second-order term is warranted",
    holds: () => {
      const cub = polyFit(XS, YS, 3);
      let ssr = 0;
      for (let i = 0; i < XS.length; i++) ssr += (YS[i] - evalPoly(cub, XS[i])) ** 2;
      const inRms = Math.sqrt(ssr / XS.length);
      const q = polyFit(XS, YS, 2);
      const lCub = looRms(XS, YS, 3);
      const lQuad = looRms(XS, YS, 2);
      return (
        Math.abs(cub[3] + 225.29) < 1.0 &&
        Math.abs(Math.abs(cub[3] / q[2]) - 0.4533) < 0.01 &&
        inRms < 0.03 &&
        Math.abs(lCub.rms - 0.3392) < 0.02 &&
        lQuad.rms > lCub.rms && // cubic is only marginally better off-grid
        lQuad.rms - lCub.rms < 0.15 && // and the gain is small (within DD ~+-2-reach uncertainty)
        REF.cubicTest.furtherTermWarranted === false
      );
    },
  },
  {
    id: "imp95858-not-a-bound",
    description: "numerical cross-validation module; it moves no Lambda bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.subGap === "imp-95858-intermediate-delta-dd-eigensolve-crossing" &&
      REF.closesTickets.includes("imp-95858"),
  },
];

for (const a of IMP95858_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95858-dd-crossing-reach-loo-cross-validation assertion failed: ${a.id}`);
  }
}

export default IMP95858_DD_CROSSING_REACH_LOO_CV;
