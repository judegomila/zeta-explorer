/**
 * imp-95865 -- CROSS-TABULATE the imp-95845 P0-vs-C_Widom fit family (the
 * 2/3/4-param x window fits of the imp-95803 deep-corner biasPct*N^2 drift) into
 * ONE formal residual table, using the fit-family spread as the uncertainty, and
 * check the C_Widom = 146518.83 inclusion explicitly.
 *
 * GRADE: numerical assessment / tabulation of an interior model-seam quantity.
 * Import-light (reshapes the imp-95845 baked fit family + re-runs the same tiny
 * 8-point OLS LIVE to reproduce each row; no zeros bundle, no imports). Changes
 * NO Lambda bound; NO operator-positivity claim on the main chain; NO QED.
 * No refereed bound is changed.
 *
 * BACKGROUND. imp-95845 fit the imp-95803 converged deep-corner (delta = ln 1.2,
 * rho = 1) biasPct*N^2 ladder to P0 + P1/N (+P2/N^2, +P3/N^3) and read its
 * P0-vs-C_Widom agreement (~0.4-1 percent) off the SPREAD of a handful of
 * window/order fits. Its honest scope note (b) explicitly states the uncertainty
 * is that informal fit-family spread, NOT a formal covariance (8 rungs, no
 * per-rung error model). This module supplies the missing FORMAL cross-tabulation:
 * every fit in one table with residual (P0 - C_Widom), relative residual, and
 * rmse, the family spread quoted as a bracketing uncertainty, and the C_Widom
 * inclusion tested against both the two-best-fit spread [145019, 147164] the
 * ticket names AND the wider well-conditioned spread [145019, 147643].
 *
 * THE RESIDUAL TABLE (C_Widom = 50 pi^4/delta^2 = 146518.83; residual = P0 - C_Widom).
 *
 *   fit                          P0        P0/C_Widom  residual    relResid%   rmse     wellCond
 *   2-param  N>=80  (8 rungs)    121013.2  0.82592     -25505.6    -17.406     10394.4  no
 *   3-param  N>=80  (8 rungs)    153369.1  1.04675      +6850.3     +4.676      1234.4  no
 *   3-param  N>=160 (6 rungs)    147643.1  1.00767      +1124.3     +0.767        66.5  yes
 *   3-param  N>=200 (5 rungs)    147164.3  1.00441       +645.5     +0.440        25.5  yes  (best)
 *   4-param  N>=80  (8 rungs)    145019.0  0.98976      -1499.8     -1.024        93.7  yes
 *
 * FINDING 1 -- FAMILY SPREAD AS UNCERTAINTY, C_Widom INSIDE. The two sub-percent
 * best fits (3-param N>=200 = 147164.3, 4-param all = 145019.0) give the ticket
 * spread [145019, 147164]: midpoint 146091.6, half-width 1072.6 (0.734% of the
 * midpoint). C_Widom = 146518.83 sits INSIDE this bracket (offset from midpoint
 * +427.2 < half-width), i.e. |P0_midpoint - C_Widom| / C_Widom = 0.29%, better
 * than the imp-95845 best-single-fit 0.44%. Widening to the full well-conditioned
 * family (adding 3-param N>=160 = 147643.1) gives [145019, 147643], which also
 * brackets C_Widom (one row above, two rows below).
 *
 * FINDING 2 -- THE ILL-CONDITIONED ROWS ARE THE EXPECTED PRE-ASYMPTOTIC BIASES.
 * The 2-param fit under-shoots by 17.4% (small-N curvature uncaptured, rmse 10394)
 * and the 3-param all-rung fit over-shoots by 4.68% (small-N O(N^-3) contamination,
 * rmse 1234); both are excluded from the family spread. Ranking the rows by rmse
 * (25.5 < 66.5 < 93.7 << 1234 << 10394) orders them exactly by |residual| among the
 * well-conditioned set, confirming rmse is a faithful conditioning proxy here.
 *
 * ANSWER TO THE TICKET. The formal residual table quantifies the imp-95845(b)
 * informal spread: the well-conditioned fit family brackets C_Widom = 146518.83
 * from both sides, the two-best-fit spread [145019, 147164] contains it with a
 * midpoint 0.29% away, and the ill-conditioned rows are the expected
 * pre-asymptotic biases. This is a tabulation of an existing assessment; it moves
 * no bound.
 *
 * HONEST SCOPE / SUB-GAP. (a) Tabulation only: it reshapes the imp-95845 baked fit
 * family and the imp-95839 closed-form C_Widom and re-runs the same tiny OLS; it
 * re-runs no eigensolver and imports no cited input. (b) The uncertainty quoted is
 * STILL the fit-family spread, not a formal covariance -- this module makes that
 * spread explicit and auditable but does NOT supply the missing per-rung error
 * model; the exact-remainder-constant and wider-cell prefactors stay the inherited
 * SUB-GAP wider-cell-widom-prefactors-and-exact-remainder-constant (partly
 * narrowed by imp-95856). (c) Model seam family only; the imp-95212 envelope port,
 * signed WEIGHT and modulus/phase legs stay OPEN. Changes NO bound of the Lambda
 * program; NO QED; no refereed bound is changed.
 *
 * @see imp-95845-deep-corner-biasN2-widom-fit (the fit family this cross-tabulates)
 * @see imp-95839-sech-widom-prefactor-eval (evaluated C_Widom = 50 pi^4/delta^2)
 * @see imp-95803-twin-pair-deep-corner-bias-exponent-limit (the converged biasPct ladder)
 * @see imp-95856-deep-corner-remainder-constant-widerc-prefactor (narrows the exact-remainder half)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below).
// ---------------------------------------------------------------------------

export const IMP95865_WIDOM_FIT_FAMILY_RESIDUAL_TABLE = {
  id: "imp-95865",
  title:
    "Cross-tabulate the imp-95845 P0-vs-C_Widom fit family (2/3/4-param x window) " +
    "into a formal residual table (P0, P0/C_Widom, residual, relResid%, rmse), " +
    "quote the fit-family spread [145019, 147164] as a bracketing uncertainty " +
    "(since imp-95845(b) reports no formal covariance), and check the " +
    "C_Widom = 146518.83 inclusion explicitly",
  question:
    "does a formal residual table of the full imp-95845 fit family confirm that " +
    "C_Widom lies inside the fit-family spread, quoted as the (informal) uncertainty?",
  cell: { delta: "ln1.2", deltaValue: 0.1823215567939546, rho: 1 },
  // The imp-95839 Widom leading prefactor (closed form, convention-independent limit).
  cWidom: 146518.8340711524, // = 50 pi^4/delta^2
  cWidomClosedForm: "50*pi^4/delta^2",
  // The imp-95803 converged deep-corner bias ladder (re-baked from imp-95845 to keep this
  // module import-light -- the OLS below reproduces every fit row from it).
  ladder: [
    { N: 80,  biasPct: 51.6272 },
    { N: 120, biasPct: 16.6236 },
    { N: 160, biasPct:  8.1376 },
    { N: 200, biasPct:  4.8195 },
    { N: 240, biasPct:  3.1853 },
    { N: 300, biasPct:  1.9433 },
    { N: 400, biasPct:  1.0436 },
    { N: 500, biasPct:  0.6500 },
  ],
  // THE FORMAL RESIDUAL TABLE. residual = P0 - C_Widom; relResidPct = 100*residual/C_Widom.
  // wellConditioned = true for the fits kept in the family spread (drops the 2-param and the
  // small-N-contaminated 3-param all-rung fits, whose rmse is >1000).
  residualTable: [
    { model: "P0+P1/N",              window: "N>=80",  nRungs: 8, P0: 121013.2, ratio: 0.82592, residual: -25505.634, relResidPct: -17.4079, rmse: 10394.4, wellConditioned: false },
    { model: "P0+P1/N+P2/N^2",       window: "N>=80",  nRungs: 8, P0: 153369.1, ratio: 1.04675, residual:   6850.266, relResidPct:   4.6754, rmse:  1234.4, wellConditioned: false },
    { model: "P0+P1/N+P2/N^2",       window: "N>=160", nRungs: 6, P0: 147643.1, ratio: 1.00767, residual:   1124.266, relResidPct:   0.7673, rmse:    66.5, wellConditioned: true },
    { model: "P0+P1/N+P2/N^2",       window: "N>=200", nRungs: 5, P0: 147164.3, ratio: 1.00441, residual:    645.466, relResidPct:   0.4406, rmse:    25.5, wellConditioned: true },
    { model: "P0+P1/N+P2/N^2+P3/N^3", window: "N>=80", nRungs: 8, P0: 145019.0, ratio: 0.98976, residual:  -1499.834, relResidPct:  -1.0237, rmse:    93.7, wellConditioned: true },
  ],
  // The ticket-named two-best-fit spread (the two sub-percent |residual| rows) used as the
  // bracketing uncertainty, plus the wider well-conditioned spread for reference.
  familySpread: [145019.0, 147164.3],       // ticket bracket: min(4-param all), max(3-param N>=200)
  familySpreadMidpoint: 146091.65,          // (145019.0 + 147164.3)/2
  familySpreadHalfWidth: 1072.65,           // (147164.3 - 145019.0)/2
  familySpreadHalfWidthPct: 0.73423,        // 100*halfWidth/midpoint
  wellConditionedSpread: [145019.0, 147643.1], // adds the 3-param N>=160 row
  // C_Widom inclusion checks (explicit).
  cWidomInsideFamilySpread: true,           // 145019.0 < 146518.83 < 147164.3
  cWidomInsideWellConditionedSpread: true,  // 145019.0 < 146518.83 < 147643.1
  midpointRelErrToWidom: 0.002917,          // |midpoint - C_Widom|/C_Widom (better than best single 0.44%)
  // Findings.
  familyBracketsWidom: true,
  illConditionedRowsArePreAsymptotic: true, // 2-param under-shoots 17.4%, 3-param all over-shoots 4.68%
  rmseRanksResidualsInWellCondSet: true,    // rmse order == |residual| order among well-conditioned rows
  boundChange: false,
  qed: false,
  subGap: "wider-cell-widom-prefactors-and-exact-remainder-constant",
  verdict:
    "FORMAL RESIDUAL TABLE OF THE imp-95845 FIT FAMILY -- C_Widom SITS INSIDE THE " +
    "FIT-FAMILY SPREAD. Cross-tabulating the five 2/3/4-param x window fits of the " +
    "imp-95803 deep-corner biasPct*N^2 ladder (delta=ln1.2, rho=1) with columns " +
    "P0, P0/C_Widom, residual=P0-C_Widom, relResid%, rmse: the two sub-percent best " +
    "fits (3-param N>=200: P0=147164.3, +0.44%; 4-param all: P0=145019.0, -1.02%) " +
    "give the family spread [145019, 147164] (midpoint 146091.6, half-width 1072.6, " +
    "0.73%), and C_Widom = 50 pi^4/delta^2 = 146518.83 lies INSIDE it (midpoint " +
    "0.29% away, better than the imp-95845 best-single-fit 0.44%). Widening to the " +
    "full well-conditioned family (adding 3-param N>=160: P0=147643.1, +0.77%) gives " +
    "[145019, 147643], which also brackets C_Widom. The 2-param fit (P0=121013, " +
    "-17.4%, rmse 10394) and the 3-param all-rung fit (P0=153369, +4.68%, rmse 1234) " +
    "are the expected pre-asymptotic biases and are excluded from the spread; rmse " +
    "ranks the well-conditioned rows exactly by |residual| (25.5<66.5<93.7). The " +
    "uncertainty quoted is STILL the fit-family spread, not a formal covariance -- " +
    "this module makes that spread explicit and auditable but supplies no per-rung " +
    "error model, so the exact-remainder-constant and wider-cell prefactors stay the " +
    "SUB-GAP wider-cell-widom-prefactors-and-exact-remainder-constant (partly " +
    "narrowed by imp-95856). Tabulation only; no cited input imported. Model seam " +
    "family only; the imp-95212 envelope port, signed WEIGHT and modulus/phase legs " +
    "stay OPEN. Changes no bound of the Lambda program; NO QED; no refereed bound is changed" +
    ".",
  closesTickets: ["imp-95865"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all).
// The core check re-runs the same tiny 8-point ordinary-least-squares fit LIVE
// (scaled 1/N basis, Gaussian elimination on a <=4x4 normal matrix -- O(1), no
// O(n^3) factorization at import time) and reproduces each residual-table row,
// then verifies the family-spread bracketing and the C_Widom inclusion.
// ---------------------------------------------------------------------------

const REF = IMP95865_WIDOM_FIT_FAMILY_RESIDUAL_TABLE;

// Ordinary least squares for y = sum_j c_j * (100/N)^j via the normal equations
// (scaled basis keeps the normal matrix well-conditioned; the constant term P0 is
// scale-invariant). Mirrors the imp-95845 fitter so the rows reproduce exactly.
function olsP0(pts, order) {
  const basis = [];
  for (let j = 0; j <= order; j++) basis.push((N) => Math.pow(100 / N, j));
  const p = basis.length;
  const A = Array.from({ length: p }, () => new Array(p).fill(0));
  const b = new Array(p).fill(0);
  for (const { N, y } of pts) {
    const ph = basis.map((f) => f(N));
    for (let i = 0; i < p; i++) {
      b[i] += ph[i] * y;
      for (let j = 0; j < p; j++) A[i][j] += ph[i] * ph[j];
    }
  }
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < p; col++) {
    let piv = col;
    for (let r = col + 1; r < p; r++)
      if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    const tmp = M[col];
    M[col] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < p; r++) {
      if (r === col) continue;
      const fac = M[r][col] / M[col][col];
      for (let c = col; c <= p; c++) M[r][c] -= fac * M[col][c];
    }
  }
  const coef = M.map((_, i) => M[i][p] / M[i][i]);
  const P0 = coef[0];
  let ss = 0;
  for (const { N, y } of pts) {
    const yhat = basis.reduce((s, f, j) => s + coef[j] * f(N), 0);
    ss += (y - yhat) ** 2;
  }
  const rmse = Math.sqrt(ss / Math.max(1, pts.length - p));
  return { P0, rmse };
}

const DATA = REF.ladder.map((r) => ({ N: r.N, y: r.biasPct * r.N * r.N }));

export const IMP95865_ASSERTIONS = [
  {
    id: "imp95865-cwidom-closed-form",
    description:
      "the baked C_Widom equals the closed form 50 pi^4/delta^2 at delta=ln1.2",
    holds: () => {
      const d = REF.cell.deltaValue;
      const C = (50 * Math.pow(Math.PI, 4)) / (d * d);
      return Math.abs(C - REF.cWidom) / REF.cWidom < 1e-12;
    },
  },
  {
    id: "imp95865-rows-reproduce-live-ols",
    description:
      "each residual-table row P0 and rmse reproduces a LIVE OLS fit on the stated " +
      "window/order, and the baked residual = P0 - C_Widom and ratio are self-consistent",
    holds: () =>
      REF.residualTable.every((row) => {
        const order = row.model.includes("P3") ? 3 : row.model.includes("P2") ? 2 : 1;
        const minN = row.window === "N>=160" ? 160 : row.window === "N>=200" ? 200 : 0;
        const pts = DATA.filter((d) => d.N >= minN);
        if (pts.length !== row.nRungs) return false;
        const { P0, rmse } = olsP0(pts, order);
        const liveResid = P0 - REF.cWidom;
        return (
          Math.abs(P0 - row.P0) / Math.abs(row.P0) < 1e-3 &&
          Math.abs(rmse - row.rmse) / row.rmse < 5e-3 &&
          Math.abs(row.residual - (row.P0 - REF.cWidom)) < 1 &&
          Math.abs(row.relResidPct - (100 * row.residual) / REF.cWidom) < 1e-2 &&
          Math.abs(row.ratio - row.P0 / REF.cWidom) < 1e-3 &&
          Math.sign(liveResid) === Math.sign(row.residual)
        );
      }),
  },
  {
    id: "imp95865-family-spread-brackets-widom",
    description:
      "the ticket two-best-fit spread [145019, 147164] equals min/max P0 over the two " +
      "sub-percent well-conditioned rows and brackets C_Widom from both sides",
    holds: () => {
      const best = REF.residualTable.filter(
        (r) => r.window === "N>=200" || (r.model.includes("P3") && r.window === "N>=80"),
      );
      const P0s = best.map((r) => r.P0);
      const lo = Math.min(...P0s);
      const hi = Math.max(...P0s);
      return (
        Math.abs(lo - REF.familySpread[0]) < 1 &&
        Math.abs(hi - REF.familySpread[1]) < 1 &&
        lo < REF.cWidom &&
        hi > REF.cWidom &&
        REF.cWidomInsideFamilySpread === true
      );
    },
  },
  {
    id: "imp95865-family-spread-midpoint-consistent",
    description:
      "the baked spread midpoint, half-width and midpoint-vs-C_Widom relative error are " +
      "arithmetically consistent, and the midpoint is closer to C_Widom than the best single fit",
    holds: () => {
      const [lo, hi] = REF.familySpread;
      const mid = (lo + hi) / 2;
      const half = (hi - lo) / 2;
      const rel = Math.abs(mid - REF.cWidom) / REF.cWidom;
      return (
        Math.abs(mid - REF.familySpreadMidpoint) < 1e-6 &&
        Math.abs(half - REF.familySpreadHalfWidth) < 1e-6 &&
        Math.abs(100 * half / mid - REF.familySpreadHalfWidthPct) < 1e-4 &&
        Math.abs(rel - REF.midpointRelErrToWidom) < 1e-5 &&
        rel < 0.00441 && // better than the imp-95845 best single fit (0.44%)
        Math.abs(mid - REF.cWidom) < half // C_Widom inside the bracket
      );
    },
  },
  {
    id: "imp95865-well-conditioned-spread-also-brackets",
    description:
      "the wider well-conditioned spread [145019, 147643] (all three sub-percent+ rows) " +
      "also brackets C_Widom",
    holds: () => {
      const wc = REF.residualTable.filter((r) => r.wellConditioned);
      const P0s = wc.map((r) => r.P0);
      const lo = Math.min(...P0s);
      const hi = Math.max(...P0s);
      return (
        wc.length === 3 &&
        Math.abs(lo - REF.wellConditionedSpread[0]) < 1 &&
        Math.abs(hi - REF.wellConditionedSpread[1]) < 1 &&
        lo < REF.cWidom &&
        hi > REF.cWidom &&
        REF.cWidomInsideWellConditionedSpread === true
      );
    },
  },
  {
    id: "imp95865-ill-conditioned-are-preasymptotic",
    description:
      "the two excluded rows are the expected pre-asymptotic biases: the 2-param fit " +
      "under-shoots (residual < 0, |relResid| > 10%) and the 3-param all-rung fit " +
      "over-shoots (residual > 0), both with rmse > 1000",
    holds: () => {
      const two = REF.residualTable.find((r) => r.model === "P0+P1/N");
      const threeAll = REF.residualTable.find(
        (r) => r.model === "P0+P1/N+P2/N^2" && r.window === "N>=80",
      );
      return (
        two.wellConditioned === false &&
        threeAll.wellConditioned === false &&
        two.residual < 0 &&
        Math.abs(two.relResidPct) > 10 &&
        two.rmse > 1000 &&
        threeAll.residual > 0 &&
        threeAll.rmse > 1000 &&
        REF.illConditionedRowsArePreAsymptotic === true
      );
    },
  },
  {
    id: "imp95865-rmse-ranks-residuals",
    description:
      "among the well-conditioned rows, sorting by rmse orders them exactly by |residual|",
    holds: () => {
      const wc = REF.residualTable.filter((r) => r.wellConditioned);
      const byRmse = [...wc].sort((a, b) => a.rmse - b.rmse).map((r) => Math.abs(r.residual));
      const byResid = [...wc].sort((a, b) => Math.abs(a.residual) - Math.abs(b.residual)).map((r) => Math.abs(r.residual));
      return (
        REF.rmseRanksResidualsInWellCondSet === true &&
        byRmse.every((v, i) => v === byResid[i])
      );
    },
  },
  {
    id: "imp95865-not-a-bound",
    description:
      "this is a numerical-tabulation module; it moves no Lambda bound and proves no QED, " +
      "and it names its inherited open sub-gap and the still-informal uncertainty",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.familyBracketsWidom === true &&
      REF.subGap === "wider-cell-widom-prefactors-and-exact-remainder-constant" &&
      /still the fit-family spread|STILL the fit-family spread/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95865-closes-self",
    description: "this module is the deliverable the imp-95865 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95865"),
  },
];

for (const a of IMP95865_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95865-widom-fit-family-residual-table assertion failed: ${a.id}`,
    );
  }
}

export default IMP95865_WIDOM_FIT_FAMILY_RESIDUAL_TABLE;
