/**
 * imp-95804 -- ASSESS whether a single closed-form biasPct(delta, rho) surface
 * -- a function of the reach L = delta (1 + rho) ALONE -- fits all 13 cells of
 * the imp-95785 union twin-pair biasPct grid across three deltas.
 *
 * GRADE: measurement / model-selection assessment only. Import-light (no heavy
 * bundle, no imports at all). Changes NO Lambda bound; NO QED; no refereed bound is changed.
 *
 * BACKGROUND. imp-95785 assembled the complete finite-80 biasPct column over the
 * 13-cell union of the imp-95707 (delta = ln1.5, float64) and imp-95762 (delta in
 * {ln1.2, ln1.3}, double-double) twin-pair block-Toeplitz grids, where
 * biasPct = 100 * (finite / F_inf - 1) is the finite-size over-estimate of the
 * infinite-lattice infimum. That grid is jointly monotone-decreasing in both
 * delta and rho. The reach L = delta (1 + rho) is the SAME combination that
 * governs the imp-95761 / imp-95786 Szego C-fit universality, which motivates the
 * hypothesis that biasPct too depends on (delta, rho) ONLY through L.
 *
 * THE HYPOTHESIS TESTED.
 *   H1 (reach-collapse):  biasPct = g(L),  L = delta (1 + rho),  for a single
 *                         univariate g -- the two nominal variables collapse to one.
 *   H2 (two-variable):    biasPct = g(delta, rho) with a genuine residual
 *                         delta-dependence beyond L.
 *
 * WHAT THE DATA SHOW.
 *
 *   (A) NECESSARY CONDITION HOLDS -- monotone in L. Ordering all 13 cells by L,
 *       biasPct is strictly monotone-decreasing:
 *         L       biasPct     (delta, rho)
 *         0.3646  51.6268     ln1.2, 1
 *         0.4558  25.2642     ln1.2, 1.5
 *         0.5470  15.1174     ln1.2, 2
 *         0.6559   9.4448     ln1.3, 1.5
 *         0.8109   5.6495     ln1.5, 1
 *         1.0137   3.3774     ln1.5, 1.5
 *         1.2164   2.2523     ln1.5, 2
 *         1.6219   1.2113     ln1.5, 3
 *         2.4328   0.5175     ln1.5, 5
 *         4.4601   0.1366     ln1.5, 10
 *         8.5148   0.0170     ln1.5, 20
 *        20.6787   0.0002     ln1.5, 50
 *        40.9520   0.0000     ln1.5, 100
 *       A single-valued g(L) is therefore not immediately contradicted: the cloud
 *       is a single descending curve, no L carries two disagreeing biasPct.
 *
 *   (B) A SINGLE UNIVARIATE-IN-L MODEL FITS TO ~3 pct RMS. Fitting the 12 nonzero
 *       cells with ln(biasPct) = cubic in ln(L) (a smooth univariate g) gives
 *       RMS log-residual 0.0296 (about 3 pct in bias) and worst per-cell relative
 *       residual 6.35 pct (at the far-tail ln1.5, rho=5 cell where biasPct is
 *       already sub-percent). So one function of L alone reproduces the whole
 *       three-delta grid to a few percent.
 *
 *   (C) BUT THE GRID CANNOT DISCRIMINATE H1 FROM H2 -- the three deltas are
 *       SEGREGATED in L, with NO overlap:
 *         ln1.2:  L in [0.3646, 0.5470]
 *         ln1.3:  L  =  0.6559            (single cell)
 *         ln1.5:  L in [0.8109, 40.9520]
 *       and max(ln1.2) < ln1.3 < min(ln1.5). Because no two distinct deltas ever
 *       produce the same (or even overlapping) reach L in this grid, there is NO
 *       cell where the collapse could FAIL: H1 predicts one g(L), and any monotone
 *       three-delta grid with segregated L-ranges lies on one monotone curve
 *       trivially. The good univariate fit in (B) is thus a NECESSARY consequence
 *       of monotone segregation, NOT positive evidence for reach-collapse over a
 *       genuine two-variable law.
 *
 * SUB-GAP NAMED (what would discriminate). To test H1 against H2 one needs
 * L-MATCHED CROSS-DELTA CELLS: pairs (delta_a, rho_a) and (delta_b, rho_b) with
 * delta_a != delta_b but delta_a (1 + rho_a) = delta_b (1 + rho_b). E.g. ln1.2 at
 * rho = 3.446 has L = 0.8109, matching ln1.5 at rho = 1; if biasPct agreed there,
 * that would be genuine collapse evidence. No such matched pair exists in the
 * imp-95785 grid, so reach-collapse for biasPct is CONSISTENT-BUT-UNDETERMINED by
 * the current 13 cells. (Contrast the Szego C-fit universality, which was tested
 * on overlapping L-ranges.)
 *
 * VERDICT. biasPct is monotone in the reach L and a single univariate g(L) fits
 * all 13 cells to ~3 pct RMS -- but because the three deltas occupy disjoint,
 * non-overlapping L-intervals, this grid cannot separate a true reach-collapse
 * biasPct = g(L) from a two-variable biasPct(delta, rho); the good fit is forced
 * by monotone L-segregation. Reach-collapse for biasPct is consistent but
 * UNDETERMINED; discriminating it requires L-matched cross-delta cells (named
 * sub-gap). Model seam family only; no new cited input. Changes NO bound of the
 * Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95785-twin-pair-block-bias-union-grid (the 13-cell union biasPct grid)
 * @see imp-95707-twin-pair-block-toeplitz-interior-limit (the delta=ln1.5 rho-sweep column)
 * @see imp-95762-twin-pair-block-floor-finite80-dd-eigensolver (the deep-cell DD biasPct)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

const DELTAS = {
  "ln1.2": 0.1823215567939546,
  "ln1.3": 0.2623642644674911,
  "ln1.5": 0.4054651081081644,
};

export const IMP95804_TWIN_PAIR_BIAS_REACH_COLLAPSE_TEST = {
  id: "imp-95804",
  title:
    "Assess whether a single closed-form biasPct(delta, rho) surface -- a " +
    "function of the reach L = delta (1 + rho) alone -- fits all 13 cells of the " +
    "imp-95785 union twin-pair biasPct grid across three deltas",
  question:
    "do the 13 biasPct values collapse onto a single univariate function of the " +
    "reach L = delta (1 + rho), and can this grid discriminate that reach-collapse " +
    "from a genuine two-variable biasPct(delta, rho)?",
  // The 13 union cells with the reach L = delta (1 + rho) computed for each.
  cells: [
    { delta: "ln1.2", rho: 1,   biasPct: 51.6268 },
    { delta: "ln1.2", rho: 1.5, biasPct: 25.2642 },
    { delta: "ln1.2", rho: 2,   biasPct: 15.1174 },
    { delta: "ln1.3", rho: 1.5, biasPct:  9.4448 },
    { delta: "ln1.5", rho: 1,   biasPct:  5.6495 },
    { delta: "ln1.5", rho: 1.5, biasPct:  3.3774 },
    { delta: "ln1.5", rho: 2,   biasPct:  2.2523 },
    { delta: "ln1.5", rho: 3,   biasPct:  1.2113 },
    { delta: "ln1.5", rho: 5,   biasPct:  0.5175 },
    { delta: "ln1.5", rho: 10,  biasPct:  0.1366 },
    { delta: "ln1.5", rho: 20,  biasPct:  0.0170 },
    { delta: "ln1.5", rho: 50,  biasPct:  0.0002 },
    { delta: "ln1.5", rho: 100, biasPct:  0.0    },
  ],
  reachFormula: "L = delta * (1 + rho)",
  // (A) necessary condition: monotone-decreasing in L when the cells are ordered by L.
  monotoneInReachL: true,
  // (B) single univariate-in-L model (ln bias = cubic in ln L) over the 12 nonzero cells.
  univariateFit: {
    form: "ln(biasPct) = cubic polynomial in ln(L)",
    nFitCells: 12, // the rho=100 cell has biasPct=0 and is dropped from the log fit
    rmsLogResidual: 0.0296, // ~3 pct in bias
    maxRelResidualPct: 6.35, // worst cell: ln1.5 rho=5 (sub-percent bias tail)
  },
  // (C) discriminability: the three deltas occupy disjoint, non-overlapping L-intervals.
  deltaReachRanges: {
    "ln1.2": [0.3646431135879092, 0.5469646703818638],
    "ln1.3": [0.6559106611687278, 0.6559106611687278],
    "ln1.5": [0.8109302162163288, 40.9519759189246],
  },
  deltasSegregatedInReach: true, // max(ln1.2) < ln1.3 < min(ln1.5)
  lMatchedCrossDeltaCellCount: 0, // no two distinct deltas share (or overlap) an L
  // Honest verdict.
  reachCollapseConsistent: true, // one g(L) fits; monotone, no L carries two biasPct
  reachCollapseDetermined: false, // segregated L-ranges => grid cannot separate H1 from H2
  subGap:
    "L-matched cross-delta cells (delta_a != delta_b with delta_a (1+rho_a) = " +
    "delta_b (1+rho_b)) are needed to discriminate reach-collapse from a " +
    "two-variable biasPct(delta, rho); none exist in the imp-95785 grid",
  boundChange: false,
  qed: false,
  verdict:
    "REACH-COLLAPSE CONSISTENT BUT UNDETERMINED. biasPct is monotone-decreasing " +
    "in the reach L = delta (1 + rho) across all 13 imp-95785 cells, and a single " +
    "univariate g(L) (ln bias = cubic in ln L) fits the 12 nonzero cells to RMS " +
    "log-residual 0.0296 (~3 pct in bias, worst cell 6.35 pct at the sub-percent " +
    "ln1.5 rho=5 tail). BUT the three deltas occupy disjoint non-overlapping " +
    "L-intervals (ln1.2 in [0.365, 0.547], ln1.3 = 0.656, ln1.5 in [0.811, 40.95], " +
    "with max(ln1.2) < ln1.3 < min(ln1.5)), so NO cell exists where the collapse " +
    "could fail: the good univariate fit is FORCED by monotone L-segregation and " +
    "is NOT positive evidence for reach-collapse over a genuine two-variable law. " +
    "Discriminating H1 (biasPct = g(L)) from H2 (biasPct = g(delta, rho)) requires " +
    "L-matched cross-delta cells, of which the grid has none (named sub-gap). " +
    "Model seam family only; no new cited input. Changes no bound of the Lambda " +
    "program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95804"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all).
// Recompute the reach L, the monotonicity, the L-segregation, and the
// univariate-in-L fit residual directly from the baked biasPct column.
// ---------------------------------------------------------------------------

const REF = IMP95804_TWIN_PAIR_BIAS_REACH_COLLAPSE_TEST;
const reachOf = (c) => DELTAS[c.delta] * (1 + c.rho);

// Least-squares polynomial fit of degree d (normal equations, Gaussian elim).
function polyfit(xs, ys, d) {
  const n = xs.length;
  const m = d + 1;
  const A = Array.from({ length: m }, () => new Array(m).fill(0));
  const b = new Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    const pw = [];
    let p = 1;
    for (let j = 0; j <= 2 * d; j++) {
      pw.push(p);
      p *= xs[i];
    }
    for (let r = 0; r < m; r++) {
      b[r] += pw[r] * ys[i];
      for (let cc = 0; cc < m; cc++) A[r][cc] += pw[r + cc];
    }
  }
  for (let col = 0; col < m; col++) {
    let piv = col;
    for (let r = col + 1; r < m; r++)
      if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r;
    [A[col], A[piv]] = [A[piv], A[col]];
    [b[col], b[piv]] = [b[piv], b[col]];
    for (let r = 0; r < m; r++) {
      if (r === col) continue;
      const f = A[r][col] / A[col][col];
      for (let cc = col; cc < m; cc++) A[r][cc] -= f * A[col][cc];
      b[r] -= f * b[col];
    }
  }
  return b.map((v, i) => v / A[i][i]);
}
function polyeval(co, x) {
  let p = 1;
  let s = 0;
  for (const c of co) {
    s += c * p;
    p *= x;
  }
  return s;
}

export const IMP95804_ASSERTIONS = [
  {
    id: "imp95804-thirteen-cells",
    description: "the grid under test has exactly the 13 imp-95785 union cells",
    holds: () => REF.cells.length === 13,
  },
  {
    id: "imp95804-monotone-in-reach-L",
    description:
      "ordering all 13 cells by reach L = delta (1+rho), biasPct is monotone " +
      "non-increasing (necessary condition for reach-collapse)",
    holds: () => {
      if (REF.monotoneInReachL !== true) return false;
      const ordered = [...REF.cells].sort((a, b) => reachOf(a) - reachOf(b));
      for (let i = 1; i < ordered.length; i++) {
        if (ordered[i].biasPct > ordered[i - 1].biasPct + 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: "imp95804-deltas-segregated-in-reach",
    description:
      "the three deltas occupy disjoint L-intervals: max(ln1.2) < ln1.3 < " +
      "min(ln1.5), so no L is shared across deltas",
    holds: () => {
      const rng = (dl) => {
        const Ls = REF.cells.filter((c) => c.delta === dl).map(reachOf);
        return [Math.min(...Ls), Math.max(...Ls)];
      };
      const r12 = rng("ln1.2");
      const r13 = rng("ln1.3");
      const r15 = rng("ln1.5");
      const ok =
        r12[1] < r13[0] && r13[1] < r15[0] && REF.deltasSegregatedInReach === true;
      // baked ranges agree with the recomputed ones
      const near = (a, b) => Math.abs(a - b) < 1e-9;
      return (
        ok &&
        near(REF.deltaReachRanges["ln1.2"][0], r12[0]) &&
        near(REF.deltaReachRanges["ln1.2"][1], r12[1]) &&
        near(REF.deltaReachRanges["ln1.5"][0], r15[0]) &&
        near(REF.deltaReachRanges["ln1.5"][1], r15[1])
      );
    },
  },
  {
    id: "imp95804-no-l-matched-cross-delta-cell",
    description:
      "no two cells of DIFFERENT delta share (or overlap to <1e-6) the same " +
      "reach L, so the collapse cannot be tested on a matched pair",
    holds: () => {
      let matched = 0;
      for (let i = 0; i < REF.cells.length; i++) {
        for (let j = i + 1; j < REF.cells.length; j++) {
          if (REF.cells[i].delta === REF.cells[j].delta) continue;
          if (Math.abs(reachOf(REF.cells[i]) - reachOf(REF.cells[j])) < 1e-6)
            matched++;
        }
      }
      return matched === REF.lMatchedCrossDeltaCellCount && matched === 0;
    },
  },
  {
    id: "imp95804-univariate-in-L-fit-residual",
    description:
      "a single univariate model ln(biasPct) = cubic in ln(L) fits the 12 " +
      "nonzero cells to the baked RMS log-residual and max relative residual",
    holds: () => {
      const fit = REF.cells.filter((c) => c.biasPct > 0);
      if (fit.length !== REF.univariateFit.nFitCells) return false;
      const xs = fit.map((c) => Math.log(reachOf(c)));
      const ys = fit.map((c) => Math.log(c.biasPct));
      const co = polyfit(xs, ys, 3);
      let sseLog = 0;
      let maxRel = 0;
      for (let i = 0; i < fit.length; i++) {
        const r = polyeval(co, xs[i]) - ys[i];
        sseLog += r * r;
        const pred = Math.exp(polyeval(co, xs[i]));
        maxRel = Math.max(maxRel, Math.abs(pred / fit[i].biasPct - 1));
      }
      const rms = Math.sqrt(sseLog / fit.length);
      return (
        Math.abs(rms - REF.univariateFit.rmsLogResidual) < 2e-3 &&
        Math.abs(maxRel * 100 - REF.univariateFit.maxRelResidualPct) < 0.1
      );
    },
  },
  {
    id: "imp95804-consistent-but-undetermined",
    description:
      "the verdict records reach-collapse as consistent (good univariate fit) " +
      "but undetermined (segregated L-ranges), with a named discriminating sub-gap",
    holds: () =>
      REF.reachCollapseConsistent === true &&
      REF.reachCollapseDetermined === false &&
      typeof REF.subGap === "string" &&
      REF.subGap.length > 0 &&
      /L-matched cross-delta cells/.test(REF.subGap),
  },
  {
    id: "imp95804-not-a-bound",
    description:
      "this is a measurement / model-selection assessment; it moves no Lambda " +
      "bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /REACH-COLLAPSE CONSISTENT BUT UNDETERMINED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95804-closes-self",
    description: "this module is the deliverable the imp-95804 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95804"),
  },
];

for (const a of IMP95804_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95804-twin-pair-bias-reach-collapse-test assertion failed: ${a.id}`,
    );
  }
}

export default IMP95804_TWIN_PAIR_BIAS_REACH_COLLAPSE_TEST;
