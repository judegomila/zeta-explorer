/**
 * imp-95821 -- BUILD the L-matched cross-delta twin-pair grid that imp-95804
 * named as the missing discriminator, and TEST whether the finite-N biasPct
 * agrees across distinct deltas at a shared reach L = delta (1 + rho).
 *
 * GRADE: measurement / model-selection assessment only. Import-light (no heavy
 * bundle, no imports at all): the biasPct values were produced offline by the
 * imp-95762 double-double twin-pair block-Toeplitz eigensolver
 * (tmp/imp-95821-scratch.mjs) and are baked here as reference constants; the
 * self-executing assertions recompute only the reach relations, the L-match,
 * and the cross-delta spreads -- NOT the eigensolver. Changes NO Lambda bound;
 * NO QED; no refereed bound is changed.
 *
 * BACKGROUND. imp-95804 assessed whether the 13-cell imp-95785 union biasPct
 * grid collapses onto a single univariate function of the reach L = delta(1+rho)
 * (hypothesis H1) versus a genuine two-variable law biasPct(delta, rho) (H2). It
 * found the grid CANNOT discriminate: the three deltas occupy disjoint,
 * NON-overlapping L-intervals (ln1.2 in [0.365, 0.547], ln1.3 = 0.656, ln1.5 in
 * [0.811, 40.95]; max ln1.2 < ln1.3 < min ln1.5), so no cell exists where the
 * collapse could fail and the good univariate fit is FORCED by monotone
 * L-segregation. imp-95804 named the missing discriminator: L-MATCHED
 * CROSS-DELTA CELLS -- pairs (delta_a, rho_a), (delta_b, rho_b) with
 * delta_a != delta_b but delta_a (1 + rho_a) = delta_b (1 + rho_b).
 *
 * WHAT THIS TICKET BUILDS. Three target reaches L in {2, 2.5, 3} * ln1.5 (i.e.
 * L = 0.8109, 1.0137, 1.2164, anchored at ln1.5 with rho = 1, 1.5, 2), each
 * solved for the matching rho at the OTHER two deltas via rho = L/delta - 1.
 * That yields 9 cells in 3 L-matched cross-delta triples -- exactly the
 * lMatchedCrossDeltaCellCount = 0 gap imp-95804 reported. Each triple shares one
 * reach L to < 1e-10. The finite-N biasPct = 100 (lminDD(N)/F_inf - 1) is
 * measured at nPairs = 40, 60, 80 (N = 80, 120, 160 points) for every cell.
 *
 * WHAT THE DATA SHOW.
 *
 *   (A) THE GRID IS GENUINELY OVERLAPPING IN L. Each of the three triples places
 *       three DISTINCT deltas at ONE shared reach L (to < 1e-10), so the
 *       collapse can now FAIL if biasPct carries delta beyond L. This is the
 *       cell type imp-95804 had zero of.
 *
 *   (B) AT MATCHED L, biasPct AGREES ACROSS DELTAS TO WITHIN THE FINITE-N
 *       OSCILLATION ENVELOPE. At nPairs = 40 the cross-delta spread (max/min - 1)
 *       is 5.09 pct at L = 0.8109, 0.20 pct at L = 1.0137, and 2.92 pct at
 *       L = 1.2164 -- a few percent, the same order as the finite-N noise (C).
 *       The best-controlled triple L = 1.0137 agrees to <= 0.58 pct at EVERY N
 *       tested (0.20 / 0.22 / 0.58 pct at nPairs 40 / 60 / 80). No systematic
 *       monotone split with delta appears: the three deltas move together.
 *
 *   (C) BUT THE FINITE-N biasPct OSCILLATES STRONGLY WITH N for these large-rho
 *       matched cells (window-edge phase). E.g. the L = 0.8109 ln1.5 cell reads
 *       biasPct = 5.924, 2.486, 4.707 at nPairs 40, 60, 80 -- non-monotone, a
 *       swing of ~2x. The eigenvalue itself is converged there (inverse-iteration
 *       stable to ~1e-4 between 40 and 80 iters), so the swing is a REAL
 *       finite-size boundary-phase effect, not a solver artifact. The cross-delta
 *       spread inherits this: at L = 0.8109 it reads 5.09 / 49.79 / 6.91 pct as
 *       N steps 40 / 60 / 80, dominated by the per-cell N-oscillation rather than
 *       a stable limiting delta-law.
 *
 * VERDICT. The L-matched cross-delta grid imp-95804 lacked is now built (9 cells,
 * 3 shared-L triples), so reach-collapse is DIRECTLY TESTED rather than
 * undetermined-by-segregation. Outcome: H1-CONSISTENT -- at each shared reach L
 * the distinct-delta biasPct values agree to within the finite-N oscillation
 * envelope (best triple L = 1.0137 to <= 0.58 pct at every N), with no
 * systematic two-variable delta-split. This is positive evidence for
 * reach-collapse that the segregated imp-95804 grid could not provide, but it is
 * NOT conclusive: the finite-N biasPct oscillates with N (up to ~2x for the
 * large-rho cells), so the residual few-percent cross-delta spread cannot be
 * cleanly attributed to a genuine H2 delta-dependence versus finite-N phase
 * noise. NAMED SUB-GAP: definitive H1/H2 discrimination requires the N -> inf
 * phase-averaged (Cesaro-extrapolated) biasPct at each matched cell, below the
 * finite-N oscillation floor that N <= 80 cannot pin. Model seam family only; no
 * new cited input. Changes NO bound of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95804-twin-pair-bias-reach-collapse-test (the segregated 13-cell grid; named this sub-gap)
 * @see imp-95788-twin-pair-deep-corner-finite-n-bias-convergence (the finite-N DD bias ladder)
 * @see imp-95762-twin-pair-block-floor-finite80-dd-eigensolver (the DD eigensolver used offline)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below).
// ---------------------------------------------------------------------------

const DELTAS = {
  "ln1.2": Math.log(1.2), // 0.1823215567939546
  "ln1.3": Math.log(1.3), // 0.2623642644674911
  "ln1.5": Math.log(1.5), // 0.4054651081081644
};

// The three shared reaches (baked as each triple's targetReach below) are
// anchored at ln1.5 with rho = 1, 1.5, 2: L = ln1.5 * {2, 2.5, 3}.

export const IMP95821_TWIN_PAIR_OVERLAPPING_L_REACH_COLLAPSE_TEST = {
  id: "imp-95821",
  title:
    "Build the L-matched cross-delta twin-pair grid imp-95804 named as missing " +
    "and test whether finite-N biasPct agrees across distinct deltas at a shared " +
    "reach L = delta (1 + rho)",
  question:
    "at a reach L shared by two distinct deltas, do the finite-N biasPct values " +
    "agree (H1 reach-collapse) or split (H2 two-variable), and can the current " +
    "finite-N precision discriminate them?",
  reachFormula: "L = delta * (1 + rho); matched cell rho = L/delta - 1",
  nPairsMeasured: [40, 60, 80], // N points = 80, 120, 160
  finiteNConvention: "biasPct = 100 * (lminDD(N) / F_inf - 1), imp-95785 finite-80 style",
  // The 3 L-matched triples. biasPct40/60/80 measured offline by the imp-95762 DD
  // twin-pair block-Toeplitz eigensolver (tmp/imp-95821-scratch.mjs).
  triples: [
    {
      targetReach: 0.8109302162163288,
      cells: [
        { delta: "ln1.2", rho: 3.4478021715, biasPct40: 5.63742, biasPct60: 3.70402, biasPct80: 5.03234 },
        { delta: "ln1.3", rho: 2.0908562104, biasPct40: 5.64082, biasPct60: 3.72316, biasPct80: 5.02998 },
        { delta: "ln1.5", rho: 1.0, biasPct40: 5.92441, biasPct60: 2.48556, biasPct80: 4.70711 },
      ],
    },
    {
      targetReach: 1.013662770270411,
      cells: [
        { delta: "ln1.2", rho: 4.5597527144, biasPct40: 3.39023, biasPct60: 5.77764, biasPct80: 3.24828 },
        { delta: "ln1.3", rho: 2.8635702630, biasPct40: 3.39177, biasPct60: 5.77938, biasPct80: 3.24843 },
        { delta: "ln1.5", rho: 1.5, biasPct40: 3.39718, biasPct60: 5.76671, biasPct80: 3.22963 },
      ],
    },
    {
      targetReach: 1.2163953243244932,
      cells: [
        { delta: "ln1.2", rho: 5.6717032572, biasPct40: 2.61358, biasPct60: 3.71369, biasPct80: 3.26188 },
        { delta: "ln1.3", rho: 3.6362843156, biasPct40: 2.59221, biasPct60: 3.74012, biasPct80: 3.25933 },
        { delta: "ln1.5", rho: 2.0, biasPct40: 2.53950, biasPct60: 3.81396, biasPct80: 3.25336 },
      ],
    },
  ],
  // (A) the grid now HAS L-matched cross-delta cells (imp-95804 had zero).
  lMatchedCrossDeltaCellCount: 9, // 3 triples * 3 distinct deltas
  lMatchedTripleCount: 3,
  // (B) cross-delta spread (max/min - 1, pct) at each shared L, per nPairs.
  crossDeltaSpreadPct: {
    "L0.8109": { nP40: 5.091, nP60: 49.792, nP80: 6.909 },
    "L1.0137": { nP40: 0.205, nP60: 0.22, nP80: 0.582 },
    "L1.2164": { nP40: 2.917, nP60: 2.7, nP80: 0.262 },
  },
  bestControlledTriple: "L1.0137", // agrees to <= 0.58 pct at every N tested
  // (C) finite-N biasPct is non-monotone in N (window-edge phase), so the spread
  // is contaminated by per-cell N-oscillation, not a stable limiting delta-law.
  finiteNOscillatory: true,
  eigenvalueConverged: true, // inverse iteration stable to ~1e-4 between 40 and 80 iters
  // Honest verdict flags.
  reachCollapseTested: true, // the discriminating grid now exists
  reachCollapseConsistent: true, // matched-delta biasPct agree within the finite-N envelope
  reachCollapseDetermined: false, // finite-N oscillation bars a conclusive H1/H2 split
  subGap:
    "definitive H1/H2 discrimination requires the N -> inf phase-averaged " +
    "(Cesaro-extrapolated) biasPct at each L-matched cell, below the finite-N " +
    "oscillation floor that N <= 80 cannot pin",
  boundChange: false,
  qed: false,
  verdict:
    "H1-CONSISTENT (REACH-COLLAPSE DIRECTLY TESTED). The L-matched cross-delta " +
    "grid imp-95804 lacked is built: 9 cells in 3 shared-reach triples (L = " +
    "0.8109, 1.0137, 1.2164), each triple placing three distinct deltas at one " +
    "reach L to < 1e-10. At each shared L the distinct-delta biasPct agree to " +
    "within the finite-N oscillation envelope -- best triple L = 1.0137 to <= " +
    "0.58 pct at every N (nPairs 40/60/80), with no systematic two-variable " +
    "delta-split. This is positive reach-collapse evidence the segregated " +
    "imp-95804 grid could not give. It is NOT conclusive: the finite-N biasPct " +
    "oscillates strongly with N for the large-rho matched cells (e.g. the L = " +
    "0.8109 ln1.5 cell reads 5.92 / 2.49 / 4.71 pct at nPairs 40/60/80, the " +
    "eigenvalue itself converged), so the residual few-percent cross-delta spread " +
    "cannot be cleanly split into genuine H2 delta-dependence versus finite-N " +
    "phase noise. Named sub-gap: the N -> inf phase-averaged biasPct at each " +
    "matched cell. Model seam family only; no new cited input. Changes no bound " +
    "of the Lambda program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95821"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports, no eigensolver).
// Recompute the reach relations, the L-match, and the cross-delta spreads
// directly from the baked biasPct column and the analytic rho = L/delta - 1.
// ---------------------------------------------------------------------------

const REF = IMP95821_TWIN_PAIR_OVERLAPPING_L_REACH_COLLAPSE_TEST;
const reachOf = (delta, rho) => DELTAS[delta] * (1 + rho);
const spreadPct = (vals) => 100 * (Math.max(...vals) / Math.min(...vals) - 1);

export const IMP95821_ASSERTIONS = [
  {
    id: "imp95821-nine-l-matched-cells",
    description:
      "the grid has exactly 9 L-matched cross-delta cells in 3 triples -- the " +
      "cell type imp-95804 reported zero of",
    holds: () => {
      const nCells = REF.triples.reduce((a, t) => a + t.cells.length, 0);
      return (
        REF.triples.length === REF.lMatchedTripleCount &&
        REF.lMatchedTripleCount === 3 &&
        nCells === REF.lMatchedCrossDeltaCellCount &&
        nCells === 9 &&
        REF.triples.every((t) => t.cells.length === 3)
      );
    },
  },
  {
    id: "imp95821-triples-share-one-reach",
    description:
      "within each triple all three distinct-delta cells share ONE reach L " +
      "(to < 1e-10), and rho = L/delta - 1 reproduces the baked rho",
    holds: () =>
      REF.triples.every((t) => {
        const deltas = new Set(t.cells.map((c) => c.delta));
        if (deltas.size !== 3) return false;
        return t.cells.every((c) => {
          const L = reachOf(c.delta, c.rho);
          const rhoFromL = t.targetReach / DELTAS[c.delta] - 1;
          return (
            Math.abs(L - t.targetReach) < 1e-10 &&
            Math.abs(rhoFromL - c.rho) < 5e-9
          );
        });
      }),
  },
  {
    id: "imp95821-overlapping-not-segregated",
    description:
      "unlike the imp-95804 grid, distinct deltas now OVERLAP in reach L (the " +
      "same L is carried by ln1.2, ln1.3 and ln1.5 in every triple)",
    holds: () =>
      REF.triples.every((t) => {
        const Ls = t.cells.map((c) => reachOf(c.delta, c.rho));
        return Math.max(...Ls) - Math.min(...Ls) < 1e-10;
      }),
  },
  {
    id: "imp95821-cross-delta-spread-nP40",
    description:
      "the baked nP40 cross-delta spreads (5.09 / 0.20 / 2.92 pct) reproduce " +
      "from the baked biasPct40 columns",
    holds: () => {
      const keys = ["L0.8109", "L1.0137", "L1.2164"];
      return REF.triples.every((t, i) => {
        const s = spreadPct(t.cells.map((c) => c.biasPct40));
        return Math.abs(s - REF.crossDeltaSpreadPct[keys[i]].nP40) < 5e-3;
      });
    },
  },
  {
    id: "imp95821-best-triple-agrees-every-N",
    description:
      "the L = 1.0137 triple agrees to <= 0.6 pct at every N (40/60/80): the " +
      "strongest H1-consistent evidence, robust to the finite-N oscillation",
    holds: () => {
      const t = REF.triples.find((x) => Math.abs(x.targetReach - 1.013662770270411) < 1e-9);
      if (!t) return false;
      const s40 = spreadPct(t.cells.map((c) => c.biasPct40));
      const s60 = spreadPct(t.cells.map((c) => c.biasPct60));
      const s80 = spreadPct(t.cells.map((c) => c.biasPct80));
      return (
        s40 < 0.6 && s60 < 0.6 && s80 < 0.6 && REF.bestControlledTriple === "L1.0137"
      );
    },
  },
  {
    id: "imp95821-finite-N-oscillatory",
    description:
      "the finite-N biasPct is non-monotone in N for the large-rho cells (real " +
      "window-edge phase, eigenvalue converged): the L = 0.8109 ln1.5 cell " +
      "reads 5.92 -> 2.49 -> 4.71 across nPairs 40/60/80",
    holds: () => {
      const t = REF.triples[0];
      const c = t.cells.find((x) => x.delta === "ln1.5");
      const nonMonotone =
        (c.biasPct60 < c.biasPct40 && c.biasPct80 > c.biasPct60) ||
        (c.biasPct60 > c.biasPct40 && c.biasPct80 < c.biasPct60);
      return (
        REF.finiteNOscillatory === true &&
        REF.eigenvalueConverged === true &&
        nonMonotone
      );
    },
  },
  {
    id: "imp95821-tested-consistent-undetermined",
    description:
      "the verdict records reach-collapse as directly tested and H1-consistent " +
      "but not conclusively determined, with a named finite-N sub-gap",
    holds: () =>
      REF.reachCollapseTested === true &&
      REF.reachCollapseConsistent === true &&
      REF.reachCollapseDetermined === false &&
      typeof REF.subGap === "string" &&
      /phase-averaged/.test(REF.subGap),
  },
  {
    id: "imp95821-not-a-bound",
    description:
      "this is a measurement / model-selection assessment; it moves no Lambda " +
      "bound and proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      /H1-CONSISTENT/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95821-closes-self",
    description: "this module is the deliverable the imp-95821 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95821"),
  },
];

for (const a of IMP95821_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95821-twin-pair-overlapping-L-reach-collapse-test assertion failed: ${a.id}`,
    );
  }
}

export default IMP95821_TWIN_PAIR_OVERLAPPING_L_REACH_COLLAPSE_TEST;
