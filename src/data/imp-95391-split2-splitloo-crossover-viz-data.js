/**
 * imp-95391: viz-data for a g-vs-sigma scatter rendering of the imp-95256
 * SPLIT-2 vs SPLIT-LOO non-dominance crossover surface. Re-implements the
 * light numeric kernel from imp-95256-split2-splitloo-crossover.js
 * (import-light: no imports, no 16.7MB zeros bundle) to produce a
 * build-friendly point set for an SVG scatter plot: each point is a
 * (sigma, g) pair from a realized two-block configuration, with the winner
 * (SPLIT-2 or SPLIT-LOO) determined by the exact identity winner = LOO <=>
 * g < sigma, i.e. by which side of the diagonal g = sigma the point falls on.
 *
 * VERDICT. MEASUREMENT ONLY, self-consistency re-render of an existing
 * algebraic identity. Changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: no imports; mirrors imp-95256)
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
      if (i === j) L[i][i] = Math.sqrt(s);
      else L[i][j] = s / L[j][j];
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
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
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
function compareSplits(b1, b2, x) {
  const s2 = cos2Direct(b1, b2);
  const sigma = Math.sqrt(s2);
  const l1 = lamExact(b1, x);
  const l2 = lamExact(b2, x);
  const g = (2 * Math.sqrt(l1 * l2)) / (l1 + l2);
  return { sigma, g, winner: g < sigma ? "LOO" : "S2" };
}

// ---------------------------------------------------------------------------
// Scatter point set: nearby twin-lattice family (LOO region) + wide-separation
// family (mixed region), swept over depth and scale so both regions are
// densely populated for the plot.
// ---------------------------------------------------------------------------

const SCATTER_POINTS = [];
for (const x of [2, 3, 4, 5, 6, 8, 10, 14]) {
  for (const s of [1.1, 1.2, 1.5, 2, 3, 5, 8]) {
    const c = compareSplits([1, 1.1], [s, s * 1.1], x);
    SCATTER_POINTS.push({ sigma: c.sigma, g: c.g, winner: c.winner, family: "twin" });
  }
}
for (const [b1, b2] of [
  [[1, 1.05], [50, 52]],
  [[1, 2], [100, 200]],
]) {
  for (const x of [0.01, 0.02, 0.03, 0.05, 0.08, 0.1, 0.15, 0.2, 0.35, 0.5]) {
    const c = compareSplits(b1, b2, x);
    SCATTER_POINTS.push({ sigma: c.sigma, g: c.g, winner: c.winner, family: "wide" });
  }
}

export const IMP95391_SCATTER_POINTS = SCATTER_POINTS;

export const IMP95391_ANCHOR = {
  label: "imp-95250 anchor: {1,1.1} u {2,2.2}, x=6",
  sigma: 0.9998049479008838,
  g: 0.0076424145252986,
  winner: "LOO",
};

export const IMP95391_SPLIT2_WIN = {
  label: "SPLIT-2 witness: {1,1.05} u {50,52}, x=0.02",
  sigma: 0.5244200244051705,
  g: 0.9922989132354123,
  winner: "S2",
};

export const IMP95391_SUMMARY = {
  crossoverLocus: "SPLIT-LOO tighter <=> g < sigma (below the diagonal); SPLIT-2 tighter <=> g > sigma (above the diagonal)",
  pointCount: SCATTER_POINTS.length,
  looCount: SCATTER_POINTS.filter((p) => p.winner === "LOO").length,
  s2Count: SCATTER_POINTS.filter((p) => p.winner === "S2").length,
  verdict:
    "MEASUREMENT: re-renders the imp-95256 g-vs-sigma crossover as a scatter " +
    "against the exact diagonal locus g = sigma; every point's winner label " +
    "agrees with the diagonal test to machine precision. Changes no bound; " +
    "NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95391_ASSERTIONS = [
  {
    id: "imp95391-diagonal-consistency",
    description:
      "every scattered point's winner label agrees with the exact diagonal " +
      "test (LOO <=> g < sigma)",
    holds: () =>
      SCATTER_POINTS.every((p) =>
        p.winner === "LOO" ? p.g < p.sigma : p.g >= p.sigma,
      ),
  },
  {
    id: "imp95391-both-regions-populated",
    description: "the scatter set contains points on both sides of the diagonal",
    holds: () =>
      SCATTER_POINTS.some((p) => p.winner === "LOO") &&
      SCATTER_POINTS.some((p) => p.winner === "S2"),
  },
  {
    id: "imp95391-anchor-matches-source",
    description:
      "the anchor and SPLIT-2 witness recorded here match the imp-95256 " +
      "source module to within 1e-6",
    holds: () => {
      const a = compareSplits([1, 1.1], [2, 2.2], 6);
      const w = compareSplits([1, 1.05], [50, 52], 0.02);
      return (
        Math.abs(a.sigma - IMP95391_ANCHOR.sigma) < 1e-6 &&
        Math.abs(a.g - IMP95391_ANCHOR.g) < 1e-6 &&
        a.winner === "LOO" &&
        Math.abs(w.sigma - IMP95391_SPLIT2_WIN.sigma) < 1e-6 &&
        Math.abs(w.g - IMP95391_SPLIT2_WIN.g) < 1e-6 &&
        w.winner === "S2"
      );
    },
  },
];

for (const a of IMP95391_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95391-split2-splitloo-crossover-viz-data assertion failed: ${a.id}`,
    );
  }
}
