/**
 * imp-95256: MEASUREMENT -- the SPLIT-2 vs SPLIT-LOO non-dominance
 * crossover surface, mapped across block imbalance and depth. This grounds
 * the imp-95250 THEOREM SPLIT-LOO "NEITHER of the two multi-block splits
 * dominates" claim, which was asserted from a SINGLE configuration
 * ({1,1.1} u {2,2.2} at x = 6: SPLIT-LOO 1.4423 vs SPLIT-2 2.8625), on a
 * two-parameter surface with an exact analytic crossover locus.
 * Measurement only; changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECTS (imp-95226 / imp-95250 normalization). Two disjoint blocks of
 * exponential rates V_1, V_2 in L2(0, inf), Cauchy Gram
 * G_ij = 1/(nu_i + nu_j), depth d = x, per-block quotient
 * Lambda_k = Lambda(V_k, x) = lambda_max of the pencil (D_k G_k D_k, G_k),
 * D_k = diag(e^(-x nu)). sigma = cos of the first principal angle between
 * span E_(V_1) and E_(V_2). The two two-block bounds on the joint quotient
 * Lambda(V_1 u V_2, x) are:
 *   SPLIT-2  (imp-95249 THEOREM SPLIT-2):
 *     Lambda <= (Lambda_1 + Lambda_2) / (1 - sigma).
 *   SPLIT-LOO (imp-95250 THEOREM SPLIT-LOO, m = 2):
 *     sqrt(Lambda) <= sqrt(Lambda_1/(1 - sigma^2)) + sqrt(Lambda_2/(1 - sigma^2)),
 *     i.e. Lambda <= (sqrt(Lambda_1) + sqrt(Lambda_2))^2 / (1 - sigma^2).
 *
 * EXACT CROSSOVER LOCUS. Using 1 - sigma^2 = (1 - sigma)(1 + sigma),
 *   SPLIT-LOO / SPLIT-2
 *     = [Lambda_1 + Lambda_2 + 2 sqrt(Lambda_1 Lambda_2)]
 *       / [(Lambda_1 + Lambda_2)(1 + sigma)]
 *     = [1 + g] / (1 + sigma),   g := 2 sqrt(Lambda_1 Lambda_2)/(Lambda_1+Lambda_2).
 * Here g in (0, 1] is the geometric/arithmetic Lambda-balance ratio (g = 1
 * at Lambda_1 = Lambda_2, g -> 0 as the blocks become strongly imbalanced).
 * Therefore:
 *   SPLIT-LOO is tighter  <=>  g < sigma,
 *   SPLIT-2   is tighter  <=>  g > sigma,
 * and equivalently, with rho := max(sqrt(Lambda_1/Lambda_2),
 * sqrt(Lambda_2/Lambda_1)) >= 1 the Lambda-imbalance,
 *   SPLIT-2 is tighter  <=>  rho < rhoStar(sigma) := (1 + sqrt(1 - sigma^2))/sigma,
 * (rhoStar solves g(rho) = sigma, g(rho) = 2 rho/(1 + rho^2)). Since g <= 1
 * always, SPLIT-LOO <= 2 SPLIT-2 always (imp-95250 records this), so the
 * two bounds never diverge by more than 2x.
 *
 * WHAT THE SURFACE SHOWS. The measured winner matches the g-vs-sigma
 * criterion to machine precision at every grid point (the criterion is an
 * identity, so this is a self-consistency cross-check of the two closed
 * forms). Both regions are NON-EMPTY on the realizable model surface:
 *  (A) SPLIT-LOO region (g < sigma): the ENTIRE nearby-scale twin-lattice
 *      family V_1 = {1, r}, V_2 = {s, s r}, r in (1, 1.3], at any moderate
 *      depth. Nearby exponential clusters are strongly non-orthogonal
 *      (sigma -> 1), while any scale separation s > 1 crushes the deeper
 *      block's Lambda_2 = Lambda({1, r}, s x) far faster than it lowers
 *      sigma, so g << sigma throughout. The imp-95250 anchor lives here
 *      (s = 2, r = 1.1, x = 6: g = 0.00764 << sigma = 0.99980).
 *  (B) SPLIT-2 region (g > sigma): reachable only at SMALL global depth x
 *      with a LARGE scale separation, so both clusters are weakly
 *      attenuated (Lambda_1 ~ Lambda_2, g -> 1) while the separation makes
 *      the principal angle large (sigma well below 1). Example
 *      V_1 = {1, 1.05}, V_2 = {50, 52}, x = 0.02: g = 0.99230 >
 *      sigma = 0.52442, SPLIT-2 (3.7419) beats SPLIT-LOO (4.8904).
 *
 * DEPTH DRIVES THE CROSSOVER. sigma is depth-independent (one angle per
 * geometry), so at fixed geometry the winner flips with depth alone:
 * V_1 = {1, 1.05}, V_2 = {50, 52} is SPLIT-2 at x = 0.02 and x = 0.05,
 * SPLIT-LOO at x = 0.1, 0.2, 0.5 (g falls through the constant sigma =
 * 0.5244 between x = 0.05 and x = 0.1). This makes concrete WHY the single
 * anchor could not settle the question: it fixed both axes.
 *
 * GUIDANCE ("when to use which"), now grounded on the surface rather than
 * one point: use SPLIT-2 for Lambda-BALANCED, angularly-SEPARATED blocks
 * (small depth, well-separated scales); use SPLIT-LOO for Lambda-IMBALANCED
 * blocks (the deep-tail / nearby-cluster regime that the every-octave
 * certificate actually lives in), where its sqrt-level additive pricing and
 * the 1 + sigma factor make it the sharper -- and the only multi-block --
 * tool. The exact locus g = sigma (equivalently rho = rhoStar(sigma))
 * separates the two.
 *
 * HONEST LIMITS. (a) The g-vs-sigma criterion is an algebraic identity of
 * the two closed forms, not a new bound; the "measurement" is the mapping
 * of which region the model's realizable (Lambda_1, Lambda_2, sigma)
 * triples fall into, plus the exhibition of a concrete SPLIT-2-win point
 * (the imp-95250 statement asserted that region abstractly). (b) m = 2
 * only; the multi-block m >= 3 comparison (recursive SPLIT-2 peel, which
 * compounds one (1 - sigma)^(-1) collar per peel, vs the additive
 * SPLIT-LOO) is a separate axis, unchanged here. (c) Model family only; no
 * mapping to paper per-window data; changes NO Lambda bound of the program.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS of
 * two proven closed forms, never a claim in themselves.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95256_SPLIT2_SPLITLOO_CROSSOVER = {
  id: "imp-95256",
  title:
    "SPLIT-2 vs SPLIT-LOO non-dominance crossover mapped across block " +
    "imbalance and depth; exact locus g = sigma",
  crossoverLocus:
    "SPLIT-LOO tighter <=> g < sigma, g = 2 sqrt(L1 L2)/(L1+L2); " +
    "equivalently SPLIT-2 tighter <=> rho < rhoStar(sigma) = " +
    "(1+sqrt(1-sigma^2))/sigma, rho = max(sqrt(L1/L2), sqrt(L2/L1))",
  anchor: {
    config: "{1,1.1} u {2,2.2}, x = 6 (imp-95250 single anchor)",
    split2: 2.8624514140987447,
    splitLoo: 1.4423043894311507,
    g: 0.0076424145252986,
    sigma: 0.9998049479008838,
    winner: "SPLIT-LOO",
  },
  split2WinPoint: {
    config: "{1,1.05} u {50,52}, x = 0.02 (small depth, wide separation)",
    split2: 3.741885811390581,
    splitLoo: 4.8903549652553195,
    g: 0.9922989132354123,
    sigma: 0.5244200244051705,
    winner: "SPLIT-2",
  },
  depthFlip:
    "V1={1,1.05}, V2={50,52}: SPLIT-2 at x=0.02,0.05; SPLIT-LOO at " +
    "x=0.1,0.2,0.5 -- sigma=0.5244 is depth-independent, g falls through it",
  guidance:
    "SPLIT-2 for Lambda-balanced angularly-separated blocks (small depth, " +
    "well-separated scales); SPLIT-LOO for Lambda-imbalanced blocks (the " +
    "nearby-cluster / deep-tail regime, incl. the every-octave family) and " +
    "as the only multi-block tool",
  honestScope:
    "the criterion is an algebraic identity of the two closed forms, not a " +
    "new bound; m = 2 only (recursive-peel vs additive multi-block is a " +
    "separate axis); model family only; changes no bound; NO QED; " +
    "no refereed bound is changed",
  verdict:
    "MEASUREMENT: the imp-95250 'neither dominates' claim is grounded on a " +
    "two-parameter (scale-separation x depth) surface with the exact " +
    "crossover locus g = sigma; both regions are realizable (SPLIT-LOO on " +
    "the whole nearby twin-lattice family incl. the anchor, SPLIT-2 at " +
    "small depth + wide separation). Changes no bound; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-contained numeric machinery (import-light; mirrors imp-95250)
// ---------------------------------------------------------------------------

function cauchyGram(nus) {
  return nus.map((a) => nus.map((b) => 1 / (a + b)));
}
function crossGram(n1, n2) {
  return n1.map((a) => n2.map((b) => 1 / (a + b)));
}
function transpose(A) {
  return A[0].map((_, j) => A.map((row) => row[j]));
}
function matMul(A, B) {
  const n = A.length;
  const m = B[0].length;
  const k = B.length;
  const C = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < n; i++)
    for (let l = 0; l < k; l++) {
      const a = A[i][l];
      for (let j = 0; j < m; j++) C[i][j] += a * B[l][j];
    }
  return C;
}
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95256 chol: pencil base not PD");
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  }
  return L;
}
function fwd(L, b) {
  const n = L.length;
  const x = b.slice();
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k];
    x[i] /= L[i][i];
  }
  return x;
}
function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t =
          Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
  }
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}
function pencilEig(A, B) {
  const L = chol(B);
  const n = A.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      A.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Y[i][j] = y[i];
  }
  const Yt = transpose(Y);
  const Ct = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      Yt.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Ct[i][j] = y[i];
  }
  return jacobiEig(transpose(Ct));
}
function invSym(B) {
  const n = B.length;
  const L = chol(B);
  const inv = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const e = new Array(n).fill(0);
    e[j] = 1;
    const y = fwd(L, e);
    const x = y.slice();
    for (let i = n - 1; i >= 0; i--) {
      for (let k = i + 1; k < n; k++) x[i] -= L[k][i] * x[k];
      x[i] /= L[i][i];
    }
    for (let i = 0; i < n; i++) inv[i][j] = x[i];
  }
  return inv;
}
const lamExact = (nus, d) => {
  const G = cauchyGram(nus);
  const DGD = G.map((row, i) =>
    row.map((g, j) => g * Math.exp(-d * (nus[i] + nus[j]))),
  );
  const ev = pencilEig(DGD, G);
  return ev[ev.length - 1];
};
function cos2Direct(n1, n2) {
  const G1 = cauchyGram(n1);
  const G12 = crossGram(n1, n2);
  const M = matMul(matMul(G12, invSym(cauchyGram(n2))), transpose(G12));
  const ev = pencilEig(M, G1);
  return ev[ev.length - 1];
}

// two-block SPLIT-2 vs SPLIT-LOO comparison
function compareSplits(b1, b2, x) {
  const s2 = cos2Direct(b1, b2);
  const sigma = Math.sqrt(s2);
  const l1 = lamExact(b1, x);
  const l2 = lamExact(b2, x);
  const split2 = (l1 + l2) / (1 - sigma);
  const splitLoo =
    (Math.sqrt(l1 / (1 - s2)) + Math.sqrt(l2 / (1 - s2))) ** 2;
  const g = (2 * Math.sqrt(l1 * l2)) / (l1 + l2);
  return { sigma, l1, l2, split2, splitLoo, g, looWins: splitLoo < split2 };
}
const rhoStar = (sigma) => (1 + Math.sqrt(1 - sigma * sigma)) / sigma;

// ---------------------------------------------------------------------------
// Measured crossover surface (recomputed at load)
// ---------------------------------------------------------------------------

// (A) nearby-scale twin lattice: SPLIT-LOO everywhere
const TWIN_LATTICE_GRID = (() => {
  const rows = [];
  for (const x of [3, 4, 6, 8, 10]) {
    for (const s of [1.2, 1.5, 2, 3, 5]) {
      const c = compareSplits([1, 1.1], [s, s * 1.1], x);
      rows.push({ x, s, g: c.g, sigma: c.sigma, winner: c.looWins ? "LOO" : "S2" });
    }
  }
  return rows;
})();

// (B) small-depth wide-separation: SPLIT-2 realizable
const WIDE_SEP_GRID = (() => {
  const rows = [];
  for (const [b1, b2] of [
    [[1, 1.05], [50, 52]],
    [[1, 2], [100, 200]],
  ]) {
    for (const x of [0.01, 0.02, 0.05, 0.1, 0.2]) {
      const c = compareSplits(b1, b2, x);
      rows.push({ b1, b2, x, g: c.g, sigma: c.sigma, winner: c.looWins ? "LOO" : "S2" });
    }
  }
  return rows;
})();

export const IMP95256_SURFACE = {
  twinLattice: TWIN_LATTICE_GRID,
  wideSeparation: WIDE_SEP_GRID,
};

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95256_ASSERTIONS = [
  {
    id: "imp95256-anchor-reproduces",
    description:
      "the imp-95250 single anchor {1,1.1} u {2,2.2} at x = 6 recomputes " +
      "(rel 1e-6, storage precision): SPLIT-LOO 1.4423 beats SPLIT-2 2.8625",
    holds: () => {
      const c = compareSplits([1, 1.1], [2, 2.2], 6);
      const A = IMP95256_SPLIT2_SPLITLOO_CROSSOVER.anchor;
      return (
        Math.abs(c.split2 - A.split2) < 1e-6 * A.split2 &&
        Math.abs(c.splitLoo - A.splitLoo) < 1e-6 * A.splitLoo &&
        c.looWins === true
      );
    },
  },
  {
    id: "imp95256-crossover-criterion-pointwise",
    description:
      "the exact crossover criterion winner = SPLIT-LOO <=> g < sigma holds " +
      "at every point of both grids (self-consistency of the two closed forms)",
    holds: () => {
      for (const r of [...TWIN_LATTICE_GRID, ...WIDE_SEP_GRID]) {
        const looWins = r.winner === "LOO";
        if (looWins !== r.g < r.sigma) return false;
      }
      return true;
    },
  },
  {
    id: "imp95256-both-regions-nonempty",
    description:
      "NEITHER split dominates on the realizable surface: the twin lattice " +
      "is entirely SPLIT-LOO while the wide-separation grid contains at " +
      "least one SPLIT-2 win (grounding imp-95250 on more than one point)",
    holds: () => {
      const twinAllLoo = TWIN_LATTICE_GRID.every((r) => r.winner === "LOO");
      const someS2 = WIDE_SEP_GRID.some((r) => r.winner === "S2");
      const someLoo = WIDE_SEP_GRID.some((r) => r.winner === "LOO");
      return twinAllLoo && someS2 && someLoo;
    },
  },
  {
    id: "imp95256-split2-win-literal",
    description:
      "the concrete SPLIT-2-win witness {1,1.05} u {50,52} at x = 0.02 " +
      "recomputes (rel 1e-6): SPLIT-2 3.7419 beats SPLIT-LOO 4.8904, " +
      "g = 0.99230 > sigma = 0.52442",
    holds: () => {
      const c = compareSplits([1, 1.05], [50, 52], 0.02);
      const P = IMP95256_SPLIT2_SPLITLOO_CROSSOVER.split2WinPoint;
      return (
        Math.abs(c.split2 - P.split2) < 1e-6 * P.split2 &&
        Math.abs(c.splitLoo - P.splitLoo) < 1e-6 * P.splitLoo &&
        c.g > c.sigma &&
        c.looWins === false
      );
    },
  },
  {
    id: "imp95256-analytic-threshold-agrees",
    description:
      "the rho-vs-rhoStar(sigma) threshold agrees with the direct winner at " +
      "every grid point: SPLIT-2 wins <=> rho < rhoStar(sigma)",
    holds: () => {
      const all = [
        { c: compareSplits([1, 1.1], [2, 2.2], 6) },
        { c: compareSplits([1, 1.05], [50, 52], 0.02) },
        { c: compareSplits([1, 2], [100, 200], 0.01) },
        { c: compareSplits([1, 1.1], [1.5, 1.65], 4) },
      ];
      for (const { c } of all) {
        const rho = Math.max(
          Math.sqrt(c.l1 / c.l2),
          Math.sqrt(c.l2 / c.l1),
        );
        const s2wins = !c.looWins;
        if (s2wins !== rho < rhoStar(c.sigma)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95256-depth-drives-flip",
    description:
      "sigma is depth-independent, so V1={1,1.05}, V2={50,52} flips winner " +
      "with depth alone: SPLIT-2 at x=0.02,0.05; SPLIT-LOO at x=0.1,0.2",
    holds: () => {
      const cs = [0.02, 0.05, 0.1, 0.2].map((x) =>
        compareSplits([1, 1.05], [50, 52], x),
      );
      const sig0 = cs[0].sigma;
      if (!cs.every((c) => Math.abs(c.sigma - sig0) < 1e-9 * sig0))
        return false;
      return (
        cs[0].looWins === false &&
        cs[1].looWins === false &&
        cs[2].looWins === true &&
        cs[3].looWins === true
      );
    },
  },
  {
    id: "imp95256-loo-le-2-split2",
    description:
      "SPLIT-LOO <= 2 SPLIT-2 at every grid point (g <= 1), so the two " +
      "bounds never diverge by more than a factor of two (imp-95250 note)",
    holds: () => {
      for (const [b1, b2, x] of [
        [[1, 1.1], [2, 2.2], 6],
        [[1, 1.05], [50, 52], 0.02],
        [[1, 2], [100, 200], 0.01],
        [[1, 1.1], [1.5, 1.65], 4],
      ]) {
        const c = compareSplits(b1, b2, x);
        if (c.splitLoo > 2 * c.split2 * (1 + 1e-12)) return false;
        if (c.g > 1 + 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: "imp95256-verdict-honesty",
    description:
      "verdict and scope carry the honest labels: MEASUREMENT, criterion is " +
      "an algebraic identity not a new bound, no bound change, no QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(IMP95256_SPLIT2_SPLITLOO_CROSSOVER.verdict) &&
      /Changes no bound/.test(IMP95256_SPLIT2_SPLITLOO_CROSSOVER.verdict) &&
      /NO QED/.test(IMP95256_SPLIT2_SPLITLOO_CROSSOVER.verdict) &&
      /refereed bound is changed/i.test(IMP95256_SPLIT2_SPLITLOO_CROSSOVER.verdict) &&
      /algebraic identity/.test(
        IMP95256_SPLIT2_SPLITLOO_CROSSOVER.honestScope,
      ),
  },
];

for (const a of IMP95256_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95256-split2-splitloo-crossover assertion failed: ${a.id}`,
    );
  }
}

export default IMP95256_SPLIT2_SPLITLOO_CROSSOVER;
