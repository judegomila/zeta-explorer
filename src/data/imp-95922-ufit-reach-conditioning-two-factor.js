/**
 * imp-95922 -- BUILD and TEST a two-factor (reach x conditioning) log-linear predictor
 * for the per-delta u_fit_rel, formalizing the imp-95895 / imp-95902 reach-to-
 * conditioning INTERPLAY reading, and measure whether it orders the u_fit intervals
 * better than either single factor.
 *
 * GRADE: numerical measurement / cross-validation. Import-light: NO zeros bundle. The
 * three per-delta u_fit points and their reach are the values BAKED by the upstream
 * threads (imp-95881 ln 1.2, imp-95895 ln 1.25, imp-95767/imp-95826 ln 1.3, assembled
 * in imp-95902); the conditioning axis cond = 1/A_opt is re-derived LIVE from the same
 * cancellation-free dual scalar-class floor A_opt = (4 pi/delta) sum_n sech(pi^2(2n+1)/
 * delta) used in imp-95902. The self-executing assertions re-solve the two-factor fit
 * live and re-run the single-factor comparison. Changes NO interval value; NO new bound;
 * NO QED.
 *
 * WHAT THIS TESTS. imp-95902 REFINED imp-95885 FINDING A to a "reach-conditioning
 * interplay" (u_fit tightens with reach, loosens with conditioning) but stopped at the
 * qualitative reading, naming the residual sub-gap imp-95902-ufit-reach-conditioning-
 * joint-fit ("does u_fit_rel ~ g(reach, cond) with a clean form fit the DD points?").
 * This module gives that interplay a concrete FORM -- the log-linear two-factor model
 *
 *     ln(u_fit_rel) = c0 + a * ln(cond) + b * ln(reach)
 *
 * -- and asks two questions that a single factor cannot answer: (1) fit to the three
 * DD u_fit points, do the exponents carry the SIGNS the interplay reading predicts
 * (a > 0, loosens with conditioning; b < 0, tightens with reach)? (2) does the joint
 * model reproduce the pairwise u_fit ORDERING that neither single factor does?
 *
 * THE THREE DD u_fit POINTS (the only deltas that carry a u_fit interval):
 *
 *   delta    reach (u_fit)   cond = 1/A_opt   u_fit_rel
 *   ln1.2    510.68          2.346e21         0.3415%
 *   ln1.25   340.07          1.436e17         0.0846%
 *   ln1.3    105.00          2.270e14         0.2289%
 *
 * RESULT 1 -- THE INTERPLAY SIGNS ARE CORRECT AND METRIC-INDEPENDENT. Solving the
 * three-equation system exactly gives (exact cond = 1/A_opt)
 *     c0 = -3.8892,   a = +0.23281 (cond),   b = -2.1242 (reach).
 * Both signs match the interplay reading: a > 0 means u_fit LOOSENS with conditioning,
 * b < 0 means u_fit TIGHTENS with reach. Re-solving under the alternative conditioning
 * metric (imp-95895 threeDeltaCond, the 1/lambda_min proxy 5.6e22 / 1e17 / 5e15) gives
 * c0 = -5.6018, a = +0.14255, b = -1.2098 -- the exponent MAGNITUDES shift but the
 * SIGNS (a > 0, b < 0) do not, so the interplay DIRECTION is robust to the choice of
 * conditioning metric. This is the concrete content the qualitative reading lacked: a
 * monotone-in-both model with the interplay signs reproduces the three intervals.
 *
 * RESULT 2 -- THE JOINT MODEL ORDERS THE INTERVALS; NEITHER SINGLE FACTOR DOES. Scoring
 * each predictor by pairwise ordering agreement with the measured u_fit_rel (3 pairs):
 *     cond-only  (least-squares ln-ln)  2/3 pairs correct
 *     reach-only (least-squares ln-ln)  2/3 pairs correct
 *     two-factor (exact)                3/3 pairs correct
 * Each single factor mis-ranks the pair that straddles ln 1.25 (the tightest despite
 * intermediate conditioning), exactly the pair imp-95902 flagged; only the joint model
 * gets all three pairs right.
 *
 * HONEST SCOPE / RESIDUAL SUB-GAP. This is an assembly + fit of already-reported values;
 * it introduces no new cited input and no new bound; it changes NO numeric interval.
 * (a) There are only THREE deltas that carry a measured u_fit_rel -- the ticket titles a
 * fourth delta (ln 1.5), but ln 1.5 is float64-clean and its reach is a C-fit CROSSING
 * R* (imp-95786), NOT a u_fit interval, so ln 1.5 (like every ln 1.4..1.6 float64 delta)
 * carries NO measured u_fit_rel and cannot enter the u_fit fit. The two-factor model is
 * therefore fit to three points with three parameters -- an EXACT (zero-residual) solve,
 * so the 3/3 ordering in RESULT 2 is a degrees-of-freedom fact, NOT out-of-sample
 * validation; the genuine, non-trivial content is the SIGN test (RESULT 1), which is
 * over-determined in direction and passes under both conditioning metrics. (b) The true
 * out-of-sample test -- predict a fourth measured u_fit_rel -- stays OPEN: RESIDUAL
 * SUB-GAP imp-95922-fourth-ufit-point-for-out-of-sample (needs a u_fit interval extracted
 * at a fourth delta, e.g. a DD u_fit extraction at ln 1.5 where today only a C-fit
 * crossing exists). (c) Model seam family only; the imp-95212 envelope port, signed
 * WEIGHT, and modulus/phase legs stay OPEN. Changes NO bound of the Lambda program; NO
 * QED; no refereed bound is changed; Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95902-conditioning-vs-reach-cross-delta (the interplay reading + this sub-gap)
 * @see imp-95895-ln125-ufit-interval (the ln 1.25 u_fit cell + the interplay flag)
 * @see imp-95885-per-delta-ufit-comparison-table (FINDING A, original two-delta contrast)
 * @see imp-95786-reach-universality-crossval (float64-clean deltas carry C-fit R*, not u_fit)
 */

export const IMP95922_UFIT_REACH_CONDITIONING_TWO_FACTOR = {
  id: "imp-95922",
  title:
    "BUILD and TEST a two-factor log-linear predictor ln(u_fit_rel) = c0 + a ln(cond) + " +
    "b ln(reach) for the per-delta u_fit_rel, formalizing the imp-95895/imp-95902 " +
    "reach-to-conditioning INTERPLAY. Result: fit to the three DD u_fit points (ln 1.2 / " +
    "1.25 / 1.3) the exponents carry the interplay SIGNS a > 0 (loosens with conditioning) " +
    "and b < 0 (tightens with reach), and those signs are METRIC-INDEPENDENT (hold under " +
    "both cond = 1/A_opt and the 1/lambda_min proxy); the joint model orders all 3 pairs " +
    "correctly (3/3) while each single factor gets only 2/3. HONEST: three points / three " +
    "parameters is an exact fit, so the ordering is a degrees-of-freedom fact and the " +
    "genuine content is the over-determined SIGN test; ln 1.5 carries no u_fit_rel so the " +
    "out-of-sample fourth-point test stays OPEN",
  question:
    "does a two-factor (reach, conditioning) log-linear model formalize the imp-95902 " +
    "interplay reading -- do its exponents carry the predicted signs and does it order " +
    "the u_fit intervals better than either single factor?",
  eps: 2.220446049250313e-16,
  // the three deltas that carry a measured u_fit interval (ln 1.5 has none: it is a
  // float64-clean C-fit crossing, not a u_fit extraction -- see HONEST SCOPE)
  perDelta: [
    { label: "ln1.2",  ratio: 1.2,  aOpt: 4.2634260802e-22, reach: 510.68, uFitRel: 3.414761e-3,
      uFitSource: "imp-95881 11-point DD grid (via imp-95902)" },
    { label: "ln1.25", ratio: 1.25, aOpt: 6.9643158193e-18, reach: 340.07, uFitRel: 8.464859714083428e-4,
      uFitSource: "imp-95895 (imp-95838 DD shift-invert grid + imp-95881 envelope)" },
    { label: "ln1.3",  ratio: 1.3,  aOpt: 4.4062522852e-15, reach: 105,    uFitRel: 2.289e-3,
      uFitSource: "imp-95767 5-point DD Jacobi envelope (via imp-95826/imp-95902)" },
  ],
  // RESULT 1 -- two-factor exact fit (cond = 1/A_opt) and the interplay signs
  twoFactorForm: "ln(u_fit_rel) = c0 + a*ln(cond) + b*ln(reach)",
  fitExact: { c0: -3.889151845611804, aCond: 0.2328053351494313, bReach: -2.1242217397215697 },
  interplaySignCondPositive: true, // a > 0: u_fit LOOSENS with conditioning
  interplaySignReachNegative: true, // b < 0: u_fit TIGHTENS with reach
  // sign robustness under the imp-95895 1/lambda_min conditioning proxy (5.6e22/1e17/5e15)
  altCondProxy: { ln12: 5.6e22, ln125: 1e17, ln13: 5e15 },
  fitAltProxy: { c0: -5.601803634402524, aCond: 0.14254514934199158, bReach: -1.2098489859943444 },
  signsMetricIndependent: true, // a > 0 and b < 0 under BOTH conditioning metrics
  // RESULT 2 -- pairwise ordering agreement with the measured u_fit_rel (3 pairs)
  pairOrder: { condOnly: "2/3", reachOnly: "2/3", twoFactor: "3/3" },
  twoFactorOrdersAllPairs: true,
  neitherSingleFactorOrdersAllPairs: true,
  // HONEST SCOPE
  nUFitPoints: 3, // only ln 1.2 / 1.25 / 1.3 carry a measured u_fit_rel
  ln15CarriesNoUFit: true, // float64-clean C-fit crossing R*, not a u_fit extraction
  fitIsExactZeroResidual: true, // 3 points / 3 params: ordering is a DOF fact, not validation
  signTestIsTheGenuineContent: true, // over-determined in direction; passes under both metrics
  outOfSampleTestOpen: true,
  subGap: "imp-95922-fourth-ufit-point-for-out-of-sample",
  intervalUnchanged: true,
  boundChange: false,
  qed: false,
  verdict:
    "BUILT and TESTED. The two-factor log-linear predictor ln(u_fit_rel) = c0 + " +
    "a*ln(cond) + b*ln(reach) formalizes the imp-95902 reach-to-conditioning interplay. " +
    "Fit to the three DD u_fit points (ln 1.2 / 1.25 / 1.3, cond = 1/A_opt) it gives " +
    "c0 = -3.8892, a = +0.2328, b = -2.1242 -- the exponents carry the interplay SIGNS " +
    "a > 0 (u_fit LOOSENS with conditioning) and b < 0 (u_fit TIGHTENS with reach) -- and " +
    "re-solving under the alternative 1/lambda_min conditioning proxy (5.6e22 / 1e17 / " +
    "5e15) shifts the exponent magnitudes (a = +0.1425, b = -1.2098) but NOT the signs, " +
    "so the interplay DIRECTION is metric-independent. Scored by pairwise ordering " +
    "agreement with the measured u_fit_rel, the joint model gets 3/3 pairs right while " +
    "each single factor gets only 2/3 (each mis-ranks the pair straddling the ln 1.25 " +
    "tightest-despite-intermediate-conditioning cell). HONEST: there are only three " +
    "deltas that carry a measured u_fit interval -- ln 1.5 is float64-clean and its reach " +
    "is a C-fit CROSSING, not a u_fit extraction, so it (like every ln 1.4..1.6 delta) " +
    "carries no u_fit_rel and cannot enter the fit; three points with three parameters is " +
    "an EXACT zero-residual solve, so the 3/3 ordering is a degrees-of-freedom fact and " +
    "the genuine, over-determined content is the SIGN test, which passes under both " +
    "conditioning metrics. The true out-of-sample test (predict a fourth measured " +
    "u_fit_rel) stays OPEN -- RESIDUAL SUB-GAP imp-95922-fourth-ufit-point-for-out-of-" +
    "sample (needs a u_fit interval at a fourth delta, e.g. a DD u_fit extraction at " +
    "ln 1.5). Model seam family only; the imp-95212 envelope port, signed WEIGHT, and " +
    "modulus/phase legs stay OPEN. Changes no bound of the Lambda program; changes no " +
    "numeric interval value; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95922"],
};

const REF = IMP95922_UFIT_REACH_CONDITIONING_TWO_FACTOR;

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

// exact 3x3 solve for the two-factor model ln(u) = c0 + a*ln(cond) + b*ln(reach)
function solveTwoFactor(rows) {
  const M = rows.map((r) => [1, Math.log(r.cond), Math.log(r.reach), Math.log(r.u)]);
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let i = c + 1; i < 3; i++) if (Math.abs(M[i][c]) > Math.abs(M[piv][c])) piv = i;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let i = 0; i < 3; i++) {
      if (i === c) continue;
      const f = M[i][c] / M[c][c];
      for (let j = c; j <= 3; j++) M[i][j] -= f * M[c][j];
    }
  }
  return { c0: M[0][3] / M[0][0], aCond: M[1][3] / M[1][1], bReach: M[2][3] / M[2][2] };
}

// simple ln-ln least-squares single-factor fit
function lsq(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((s, v) => s + v, 0), sy = ys.reduce((s, v) => s + v, 0);
  const sxx = xs.reduce((s, v) => s + v * v, 0);
  const sxy = xs.reduce((s, v, i) => s + v * ys[i], 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const inter = (sy - slope * sx) / n;
  return { slope, inter };
}

// pairwise ordering agreement (out of 3 pairs) between a predictor and the measured u
function pairAgreement(rows, predFn) {
  let ok = 0, tot = 0;
  for (let i = 0; i < rows.length; i++)
    for (let j = i + 1; j < rows.length; j++) {
      tot++;
      if (Math.sign(predFn(rows[i]) - predFn(rows[j])) === Math.sign(rows[i].u - rows[j].u)) ok++;
    }
  return ok + "/" + tot;
}

function liveRows(condPicker) {
  return REF.perDelta.map((r) => ({ label: r.label, u: r.uFitRel, reach: r.reach, cond: condPicker(r) }));
}

export const IMP95922_ASSERTIONS = [
  {
    id: "imp95922-only-three-ufit-deltas-ln15-excluded",
    description:
      "exactly three deltas carry a measured u_fit_rel (ln 1.2 / 1.25 / 1.3); ln 1.5 is " +
      "float64-clean (C-fit crossing, not a u_fit extraction) and carries none, so the " +
      "fit is over three points",
    holds: () =>
      REF.perDelta.length === 3 &&
      REF.nUFitPoints === 3 &&
      REF.perDelta.every((r) => typeof r.uFitRel === "number") &&
      !REF.perDelta.some((r) => r.label === "ln1.5") &&
      REF.ln15CarriesNoUFit === true,
  },
  {
    id: "imp95922-cond-rederives-live-as-reciprocal-Aopt",
    description:
      "the conditioning axis cond = 1/A_opt re-derives live from the cancellation-free " +
      "dual sum at each delta to < 1e-6 relative against the baked A_opt",
    holds: () => {
      for (const r of REF.perDelta) {
        const a = aOptDual(Math.log(r.ratio));
        if (Math.abs(a - r.aOpt) / r.aOpt > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95922-two-factor-fit-rederives-and-signs-are-interplay",
    description:
      "solving the two-factor model live over the three points (cond = 1/A_opt) recovers " +
      "the baked c0/a/b to < 1e-6 relative, reproduces every u_fit_rel to < 1e-9, and the " +
      "exponents carry the interplay signs a > 0 (loosen with cond) and b < 0 (tighten " +
      "with reach)",
    holds: () => {
      const rows = liveRows((r) => 1 / aOptDual(Math.log(r.ratio)));
      const fit = solveTwoFactor(rows);
      if (Math.abs(fit.c0 - REF.fitExact.c0) / Math.abs(REF.fitExact.c0) > 1e-6) return false;
      if (Math.abs(fit.aCond - REF.fitExact.aCond) / Math.abs(REF.fitExact.aCond) > 1e-6) return false;
      if (Math.abs(fit.bReach - REF.fitExact.bReach) / Math.abs(REF.fitExact.bReach) > 1e-6) return false;
      for (const r of rows) {
        const pred = Math.exp(fit.c0 + fit.aCond * Math.log(r.cond) + fit.bReach * Math.log(r.reach));
        if (Math.abs(pred - r.u) / r.u > 1e-9) return false;
      }
      return (
        fit.aCond > 0 && fit.bReach < 0 &&
        REF.interplaySignCondPositive === true &&
        REF.interplaySignReachNegative === true
      );
    },
  },
  {
    id: "imp95922-signs-are-metric-independent",
    description:
      "re-solving under the imp-95895 1/lambda_min conditioning proxy (5.6e22/1e17/5e15) " +
      "recovers the baked alt-metric c0/a/b and keeps the SAME signs (a > 0, b < 0), so " +
      "the interplay direction is metric-independent",
    holds: () => {
      const proxy = { ln12: REF.altCondProxy.ln12, ln125: REF.altCondProxy.ln125, ln13: REF.altCondProxy.ln13 };
      const key = { "ln1.2": "ln12", "ln1.25": "ln125", "ln1.3": "ln13" };
      const rows = REF.perDelta.map((r) => ({ label: r.label, u: r.uFitRel, reach: r.reach, cond: proxy[key[r.label]] }));
      const fit = solveTwoFactor(rows);
      if (Math.abs(fit.c0 - REF.fitAltProxy.c0) / Math.abs(REF.fitAltProxy.c0) > 1e-6) return false;
      if (Math.abs(fit.aCond - REF.fitAltProxy.aCond) / Math.abs(REF.fitAltProxy.aCond) > 1e-6) return false;
      if (Math.abs(fit.bReach - REF.fitAltProxy.bReach) / Math.abs(REF.fitAltProxy.bReach) > 1e-6) return false;
      return fit.aCond > 0 && fit.bReach < 0 && REF.signsMetricIndependent === true;
    },
  },
  {
    id: "imp95922-two-factor-orders-all-pairs-single-factors-do-not",
    description:
      "RESULT 2: the joint model agrees with the measured u_fit_rel on all 3 pairs (3/3) " +
      "while each single-factor ln-ln least-squares predictor agrees on only 2/3",
    holds: () => {
      const rows = liveRows((r) => 1 / aOptDual(Math.log(r.ratio)));
      const y = rows.map((r) => Math.log(r.u));
      const condFit = lsq(rows.map((r) => Math.log(r.cond)), y);
      const reachFit = lsq(rows.map((r) => Math.log(r.reach)), y);
      const fit = solveTwoFactor(rows);
      const condOnly = pairAgreement(rows, (r) => condFit.inter + condFit.slope * Math.log(r.cond));
      const reachOnly = pairAgreement(rows, (r) => reachFit.inter + reachFit.slope * Math.log(r.reach));
      const two = pairAgreement(rows, (r) => fit.c0 + fit.aCond * Math.log(r.cond) + fit.bReach * Math.log(r.reach));
      return (
        condOnly === REF.pairOrder.condOnly &&
        reachOnly === REF.pairOrder.reachOnly &&
        two === REF.pairOrder.twoFactor &&
        two === "3/3" &&
        condOnly !== "3/3" &&
        reachOnly !== "3/3" &&
        REF.twoFactorOrdersAllPairs === true &&
        REF.neitherSingleFactorOrdersAllPairs === true
      );
    },
  },
  {
    id: "imp95922-honest-exact-fit-out-of-sample-open",
    description:
      "HONEST: three points / three parameters is an exact zero-residual solve, so the " +
      "3/3 ordering is a degrees-of-freedom fact and the genuine content is the SIGN test; " +
      "the out-of-sample fourth-point test stays OPEN as a named sub-gap",
    holds: () =>
      REF.fitIsExactZeroResidual === true &&
      REF.signTestIsTheGenuineContent === true &&
      REF.outOfSampleTestOpen === true &&
      REF.subGap === "imp-95922-fourth-ufit-point-for-out-of-sample" &&
      REF.nUFitPoints === 3,
  },
  {
    id: "imp95922-not-a-bound-no-interval-changed",
    description:
      "this is a fit of reported values; it moves no Lambda bound, changes no numeric " +
      "interval value, and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.intervalUnchanged === true &&
      /BUILT and TESTED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.closesTickets.includes("imp-95922"),
  },
];

for (const a of IMP95922_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95922-ufit-reach-conditioning-two-factor assertion failed: ${a.id}`,
    );
  }
}

export default IMP95922_UFIT_REACH_CONDITIONING_TWO_FACTOR;
