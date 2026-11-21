/**
 * imp-95785 -- ASSEMBLE the COMPLETE finite-size biasPct column across the UNION
 * of the imp-95707 and imp-95762 twin-pair block-Toeplitz grids into one table,
 * verify monotonicity in BOTH delta and rho, and check whether the two sources
 * disagree on any shared cell.
 *
 * GRADE: measurement / tabulation only. Imports no heavy bundle; no imports at
 * all. Changes NO Lambda bound; NO QED; no refereed bound is changed.
 *
 * WHAT THE TWO SOURCES COVER. Both grids tabulate the SAME quantity -- the
 * finite-80 twin-pair block floor over-estimating its infinite-lattice infimum,
 * biasPct = 100 * (finite / F_inf - 1) -- but at DISJOINT delta rows:
 *   - imp-95707 swept delta = ln 1.5 across rho in {1, 1.5, 2, 3, 5, 10, 20, 50,
 *     100}, with the finite-80 numerator taken from the float64 imp-95693 table
 *     (F). Bias decays 5.65pct -> ~0 as rho grows.
 *   - imp-95762 pinned delta in {ln 1.2, ln 1.3} at four deep cells with the
 *     finite-80 numerator taken from the double-double primal eigensolver
 *     (lminDD, the only route that reaches the ~1e-17..1e-22 lambda_min there):
 *     ln1.3 rho=1.5 -> 9.44pct, ln1.2 rho=2 -> 15.12pct, ln1.2 rho=1.5 ->
 *     25.26pct, ln1.2 rho=1 -> 51.63pct.
 * The union is a 13-cell (delta, rho) grid spanning three deltas.
 *
 * ONE DUAL UNDERLIES BOTH GRIDS. The cancellation-free theta = 0 infimum
 *   F_inf = (2 pi / L) * 2 * sum_{k>=1} sech(2 pi^2 k / L) * 2 sin^2(pi k delta / L),
 *   L = delta (1 + rho),
 * (the imp-95762 form, which avoids the ~15-digit d(0) - |off(0)| cancellation
 * that annihilates the small-delta cells) reproduces the baked F_inf of BOTH
 * imp-95707 and imp-95762 to < 1e-6 relative at every one of the 13 cells. So the
 * two grids are two windows on a single interior object, not two independent
 * measurements.
 *
 * RESULT -- the assembled biasPct column (source: 62 = imp-95762 DD-primal,
 * 07 = imp-95707 float64):
 *
 *   delta   rho    F_inf            finite (num)     biasPct   source
 *   ln1.2   1      4.263426e-22     6.464516e-22     51.627    62
 *   ln1.2   1.5    1.553066e-17     1.945436e-17     25.264    62
 *   ln1.2   2      1.463108e-14     1.684292e-14     15.117    62
 *   ln1.3   1.5    5.902353e-12     6.459819e-12      9.445    62
 *   ln1.5   1      1.663158e-9      1.757117e-9       5.650    07
 *   ln1.5   1.5    1.565693e-7      1.618574e-7       3.377    07
 *   ln1.5   2      2.777716e-6      2.840277e-6       2.252    07
 *   ln1.5   3      8.027022e-5      8.124257e-5       1.211    07
 *   ln1.5   5      1.547786e-3      1.555796e-3       0.518    07
 *   ln1.5   10     1.118502e-2      1.120030e-2       0.137    07
 *   ln1.5   20     1.902159e-2      1.902483e-2       0.017    07
 *   ln1.5   50     2.020144e-2      2.020144e-2       0.000    07
 *   ln1.5   100    2.020410e-2      2.020410e-2       0.000    07
 *
 * WHAT THIS SETTLES.
 *   (1) MONOTONE IN RHO (at each fixed delta): the bias decays as rho grows, at
 *       ln1.2 (51.63 -> 25.26 -> 15.12), at ln1.3 (single cell), and at ln1.5
 *       (5.65 -> ... -> 0). The imp-95762 deep-corner cells CONTINUE the
 *       imp-95707 rho-monotone trend rather than overturning it.
 *   (2) MONOTONE IN DELTA (at each fixed rho): where two or three deltas share a
 *       rho the bias also decays as delta grows -- rho=1 (ln1.2 51.63 > ln1.5
 *       5.65), rho=1.5 (ln1.2 25.26 > ln1.3 9.44 > ln1.5 3.38), rho=2 (ln1.2
 *       15.12 > ln1.5 2.25). The finite-size over-estimate is therefore jointly
 *       monotone: largest in the deep corner (small delta, small rho), vanishing
 *       toward the far corner (large delta, large rho).
 *   (3) NO CROSS-SOURCE DISAGREEMENT ON A SHARED CELL -- because the two grids
 *       share NO (delta, rho) cell (imp-95707 is delta = ln1.5 only; imp-95762 is
 *       delta in {ln1.2, ln1.3} only), so cell-for-cell disagreement cannot arise.
 *       Consistency is instead witnessed two ways: the single cancellation-free
 *       dual reproduces both sources' F_inf to < 1e-6, and the delta-monotone
 *       stitching across the source boundary (ln1.2/ln1.3 from 62, ln1.5 from 07)
 *       is smooth and strictly ordered at the shared rho = {1, 1.5, 2}.
 *
 * HONEST SCOPE. (a) Tabulation / consistency-check only: it re-assembles the
 * biasPct columns already established by imp-95707 and imp-95762 into one grid,
 * introducing no new cited input and no new bound. (b) The two sources are
 * delta-disjoint, so "no disagreement" is the absence of a shared cell plus
 * dual-reproduction and monotone stitching, NOT a repeated measurement of one
 * cell by two methods. (c) Model seam family only; the imp-95212 envelope port,
 * signed WEIGHT, and modulus/phase legs stay OPEN. Changes NO bound of the Lambda
 * program; NO QED; no refereed bound is changed.
 *
 * @see imp-95707-twin-pair-block-toeplitz-interior-limit (the delta = ln1.5 rho-sweep bias column)
 * @see imp-95762-twin-pair-block-floor-finite80-dd-eigensolver (the delta in {ln1.2, ln1.3} deep-cell biasPct)
 * @see imp-95744-twin-pair-block-floor-belowprec-dd-resolve (the dual F_inf the DD cells cross-check)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95785_TWIN_PAIR_BLOCK_BIAS_UNION_GRID = {
  id: "imp-95785",
  title:
    "Assemble the complete finite-size biasPct column across the union of the " +
    "imp-95707 (delta=ln1.5 rho-sweep) and imp-95762 (delta in {ln1.2, ln1.3} " +
    "deep cells) twin-pair block-Toeplitz grids into one 13-cell table; verify " +
    "the bias is jointly monotone-decreasing in BOTH delta and rho, and that the " +
    "two delta-disjoint sources share no cell and agree via one cancellation-free " +
    "dual reproducing every F_inf to < 1e-6",
  question:
    "does the assembled biasPct column across the imp-95707 + imp-95762 grids " +
    "stay monotone in both delta and rho, and do the two sources disagree on any " +
    "shared cell?",
  // Delta labels used by the two source grids.
  deltas: [
    { label: "ln1.2", delta: 0.1823215567939546, source: "imp-95762" },
    { label: "ln1.3", delta: 0.2623642644674911, source: "imp-95762" },
    { label: "ln1.5", delta: 0.4054651081081644, source: "imp-95707" },
  ],
  // The assembled union of the biasPct columns. finite = the finite-80 numerator
  // (imp-95762 DD-primal lminDD, or imp-95707 float64 Ffinite); Finf = the
  // cancellation-free infinite-lattice infimum; biasPct = 100*(finite/Finf - 1).
  // source: "imp-95762" (DD-primal deep cells) | "imp-95707" (float64 rho-sweep).
  unionTable: [
    { delta: "ln1.2", rho: 1,   Finf: 4.263426088e-22, finite: 6.464515655e-22, biasPct: 51.6268, source: "imp-95762" },
    { delta: "ln1.2", rho: 1.5, Finf: 1.553066302e-17, finite: 1.945435841e-17, biasPct: 25.2642, source: "imp-95762" },
    { delta: "ln1.2", rho: 2,   Finf: 1.463108195e-14, finite: 1.684291595e-14, biasPct: 15.1174, source: "imp-95762" },
    { delta: "ln1.3", rho: 1.5, Finf: 5.902352774e-12, finite: 6.459819408e-12, biasPct:  9.4448, source: "imp-95762" },
    { delta: "ln1.5", rho: 1,   Finf: 1.663157612e-9,  finite: 1.757117e-9,     biasPct:  5.6495, source: "imp-95707" },
    { delta: "ln1.5", rho: 1.5, Finf: 1.565693415e-7,  finite: 1.618574e-7,     biasPct:  3.3774, source: "imp-95707" },
    { delta: "ln1.5", rho: 2,   Finf: 2.777716015e-6,  finite: 2.840277e-6,     biasPct:  2.2523, source: "imp-95707" },
    { delta: "ln1.5", rho: 3,   Finf: 8.027021949e-5,  finite: 8.124257e-5,     biasPct:  1.2113, source: "imp-95707" },
    { delta: "ln1.5", rho: 5,   Finf: 1.547785709e-3,  finite: 1.555796e-3,     biasPct:  0.5175, source: "imp-95707" },
    { delta: "ln1.5", rho: 10,  Finf: 1.118502386e-2,  finite: 1.120030e-2,     biasPct:  0.1366, source: "imp-95707" },
    { delta: "ln1.5", rho: 20,  Finf: 1.902159294e-2,  finite: 1.902483e-2,     biasPct:  0.0170, source: "imp-95707" },
    { delta: "ln1.5", rho: 50,  Finf: 2.020143572e-2,  finite: 2.020144e-2,     biasPct:  0.0002, source: "imp-95707" },
    { delta: "ln1.5", rho: 100, Finf: 2.020410278e-2,  finite: 2.020410e-2,     biasPct:  0.0,    source: "imp-95707" },
  ],
  nCells: 13,
  oneDualReproducesBothGrids: true, // the imp-95762 cancellation-free F_inf form reproduces every baked Finf < 1e-6
  monotoneInRho: true, // at each fixed delta the bias decays as rho grows
  monotoneInDelta: true, // at each fixed shared rho the bias decays as delta grows
  sourcesAreDeltaDisjoint: true, // imp-95707 is ln1.5 only; imp-95762 is {ln1.2, ln1.3} only
  sharedCellCount: 0, // no (delta, rho) is measured by both sources
  crossSourceDisagreement: false, // no shared cell can disagree; dual + monotone stitching are consistent
  sharedRhosAcrossDeltas: [1, 1.5, 2], // the rho values where the delta-monotone stitch is checkable
  maxBiasPct: 51.6268, // deep corner: smallest delta (ln1.2), smallest rho (1)
  minBiasPct: 0.0, // far corner: largest rho (100) at ln1.5
  boundChange: false,
  qed: false,
  verdict:
    "UNION biasPct COLUMN ASSEMBLED; JOINTLY MONOTONE, NO CROSS-SOURCE " +
    "DISAGREEMENT. The imp-95707 (delta = ln1.5, rho-sweep, float64 numerator) and " +
    "imp-95762 (delta in {ln1.2, ln1.3}, DD-primal numerator) grids tabulate the " +
    "same finite-size bias biasPct = 100*(finite/F_inf - 1) at DISJOINT delta " +
    "rows; stitched into one 13-cell table the bias is monotone-decreasing in BOTH " +
    "rho (at ln1.2: 51.63 -> 25.26 -> 15.12; at ln1.5: 5.65 -> ... -> 0) and delta " +
    "(at rho=1.5: ln1.2 25.26 > ln1.3 9.44 > ln1.5 3.38; likewise rho=1 and rho=2), " +
    "so the over-estimate is largest in the deep corner (small delta, small rho) " +
    "and vanishes toward the far corner. The two sources share NO (delta, rho) " +
    "cell, so cell-for-cell disagreement cannot arise; consistency is instead " +
    "witnessed by a single cancellation-free theta = 0 dual reproducing every baked " +
    "F_inf (both grids) to < 1e-6 relative, and by the smooth strictly-ordered " +
    "delta stitch across the source boundary at the shared rho = {1, 1.5, 2}. " +
    "Tabulation / consistency-check of an established interior mechanism; no new " +
    "cited input. Model seam family only; imp-95212 envelope port, signed WEIGHT, " +
    "modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO QED; " +
    "no refereed bound is changed.",
  closesTickets: ["imp-95785"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all).
// One cancellation-free theta = 0 dual (the imp-95762 form) re-derives F_inf for
// EVERY cell of BOTH source grids; the baked biasPct and the two monotonicity
// directions are then checked directly.
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// imp-95762 cancellation-free infinite-lattice infimum at theta = 0:
//   F_inf = (2 pi / L) * 2 * sum_{k>=1} sech(2 pi^2 k / L) * 2 sin^2(pi k delta / L)
// (avoids the ~15-digit d(0) - |off(0)| cancellation at small delta).
function FinfCancellationFree(delta, D, K = 200) {
  const L = delta + D;
  let s = 0;
  for (let k = 1; k <= K; k++) {
    const sc = sech((2 * Math.PI * Math.PI * k) / L);
    if (sc === 0) break;
    const sn = Math.sin((Math.PI * k * delta) / L);
    s += sc * 2 * sn * sn;
  }
  return ((2 * Math.PI) / L) * 2 * s;
}

const REF = IMP95785_TWIN_PAIR_BLOCK_BIAS_UNION_GRID;
const deltaOf = (label) => REF.deltas.find((d) => d.label === label).delta;

export const IMP95785_ASSERTIONS = [
  {
    id: "imp95785-one-dual-reproduces-both-grids",
    description:
      "a single cancellation-free theta = 0 dual reproduces the baked F_inf of " +
      "EVERY cell of both the imp-95707 and imp-95762 grids to < 1e-6 relative",
    holds: () =>
      REF.oneDualReproducesBothGrids === true &&
      REF.unionTable.every((c) => {
        const F = FinfCancellationFree(deltaOf(c.delta), c.rho * deltaOf(c.delta));
        return Math.abs(F - c.Finf) / c.Finf < 1e-6;
      }),
  },
  {
    id: "imp95785-baked-biasPct-matches-ratio",
    description:
      "each baked biasPct equals 100*(finite/Finf - 1) to 5e-3 absolute in percent",
    holds: () =>
      REF.unionTable.every((c) => {
        const bias = 100 * (c.finite / c.Finf - 1);
        return Math.abs(bias - c.biasPct) < 5e-3;
      }),
  },
  {
    id: "imp95785-thirteen-cells-two-sources",
    description:
      "the union has exactly 13 cells, four from imp-95762 (ln1.2/ln1.3) and " +
      "nine from imp-95707 (ln1.5)",
    holds: () => {
      const n62 = REF.unionTable.filter((c) => c.source === "imp-95762").length;
      const n07 = REF.unionTable.filter((c) => c.source === "imp-95707").length;
      return (
        REF.unionTable.length === REF.nCells &&
        REF.nCells === 13 &&
        n62 === 4 &&
        n07 === 9
      );
    },
  },
  {
    id: "imp95785-monotone-in-rho",
    description:
      "at each fixed delta the bias decays as rho grows (strictly monotone " +
      "decreasing where more than one rho is present)",
    holds: () => {
      if (REF.monotoneInRho !== true) return false;
      for (const dl of ["ln1.2", "ln1.3", "ln1.5"]) {
        const rows = REF.unionTable
          .filter((c) => c.delta === dl)
          .sort((a, b) => a.rho - b.rho);
        for (let i = 1; i < rows.length; i++) {
          if (rows[i].biasPct > rows[i - 1].biasPct + 1e-9) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95785-monotone-in-delta",
    description:
      "at each fixed shared rho (1, 1.5, 2) the bias decays as delta grows: " +
      "ln1.2 > ln1.3 > ln1.5 wherever present",
    holds: () => {
      if (REF.monotoneInDelta !== true) return false;
      for (const rho of REF.sharedRhosAcrossDeltas) {
        const rows = REF.unionTable
          .filter((c) => c.rho === rho)
          .sort((a, b) => deltaOf(a.delta) - deltaOf(b.delta));
        if (rows.length < 2) return false; // must actually stitch >= 2 deltas
        for (let i = 1; i < rows.length; i++) {
          if (rows[i].biasPct > rows[i - 1].biasPct + 1e-9) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95785-sources-delta-disjoint-no-shared-cell",
    description:
      "the two sources share no (delta, rho) cell, so cell-for-cell disagreement " +
      "cannot arise (imp-95707 is ln1.5 only; imp-95762 is {ln1.2, ln1.3} only)",
    holds: () => {
      const key = (c) => c.delta + "|" + c.rho;
      const s62 = new Set(
        REF.unionTable.filter((c) => c.source === "imp-95762").map(key),
      );
      const s07 = new Set(
        REF.unionTable.filter((c) => c.source === "imp-95707").map(key),
      );
      const shared = [...s62].filter((k) => s07.has(k));
      return (
        REF.sourcesAreDeltaDisjoint === true &&
        REF.crossSourceDisagreement === false &&
        shared.length === REF.sharedCellCount &&
        REF.sharedCellCount === 0
      );
    },
  },
  {
    id: "imp95785-corner-extrema",
    description:
      "the largest bias is the deep corner (ln1.2, rho=1 -> 51.63pct) and the " +
      "smallest is the far corner (ln1.5, rho=100 -> ~0)",
    holds: () => {
      const biases = REF.unionTable.map((c) => c.biasPct);
      const deep = REF.unionTable.find((c) => c.delta === "ln1.2" && c.rho === 1);
      const far = REF.unionTable.find((c) => c.delta === "ln1.5" && c.rho === 100);
      return (
        Math.abs(Math.max(...biases) - REF.maxBiasPct) < 1e-3 &&
        Math.abs(Math.min(...biases) - REF.minBiasPct) < 1e-3 &&
        deep.biasPct === REF.maxBiasPct &&
        far.biasPct === REF.minBiasPct
      );
    },
  },
  {
    id: "imp95785-not-a-bound",
    description:
      "this is a tabulation / consistency-check module; it moves no Lambda bound " +
      "and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /UNION biasPct COLUMN ASSEMBLED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95785-closes-self",
    description: "this module is the deliverable the imp-95785 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95785"),
  },
];

for (const a of IMP95785_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95785-twin-pair-block-bias-union-grid assertion failed: ${a.id}`,
    );
  }
}

export default IMP95785_TWIN_PAIR_BLOCK_BIAS_UNION_GRID;
