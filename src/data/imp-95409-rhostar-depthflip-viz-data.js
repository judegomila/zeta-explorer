/**
 * imp-95409: viz-data for the imp-95256 rhoStar(sigma) locus and the
 * depth-driven SPLIT-2 <-> SPLIT-LOO flip. Companion to imp-95391 (which
 * rendered the g-vs-sigma form of the same crossover identity); this module
 * renders the equivalent rho-vs-rhoStar(sigma) form and the concrete
 * depth-flip example named in imp-95256:
 *   V1 = {1, 1.05}, V2 = {50, 52}: SPLIT-2 wins at x = 0.02, 0.05;
 *   SPLIT-LOO wins at x = 0.1, 0.2, 0.5, since sigma is depth-independent
 *   but rho = max(sqrt(L1/L2), sqrt(L2/L1)) falls through the fixed
 *   threshold rhoStar(sigma) as depth grows.
 *
 * Import-light (no imports, no zeros bundle); mirrors the exact kernel of
 * imp-95256-split2-splitloo-crossover.js (compareSplits / rhoStar) rather
 * than importing it, per the imp-95349/95350/95351 pattern. Presentation +
 * re-derivation cross-check only; changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Self-contained numeric machinery (mirrors imp-95256)
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
        if (s <= 0) throw new Error("imp-95409 chol: pencil base not PD");
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
function compareSplits(b1, b2, x) {
  const s2 = cos2Direct(b1, b2);
  const sigma = Math.sqrt(s2);
  const l1 = lamExact(b1, x);
  const l2 = lamExact(b2, x);
  const split2 = (l1 + l2) / (1 - sigma);
  const splitLoo =
    (Math.sqrt(l1 / (1 - s2)) + Math.sqrt(l2 / (1 - s2))) ** 2;
  const rho = Math.max(Math.sqrt(l1 / l2), Math.sqrt(l2 / l1));
  return { sigma, l1, l2, split2, splitLoo, rho, looWins: splitLoo < split2 };
}
const rhoStar = (sigma) => (1 + Math.sqrt(1 - sigma * sigma)) / sigma;

// ---------------------------------------------------------------------------
// rhoStar(sigma) curve (sigma-only, geometry-independent)
// ---------------------------------------------------------------------------

export const IMP95409_RHOSTAR_CURVE = (() => {
  const rows = [];
  for (let i = 1; i <= 99; i++) {
    const sigma = i / 100;
    rows.push({ sigma, rhoStar: rhoStar(sigma) });
  }
  return rows;
})();

// ---------------------------------------------------------------------------
// Depth-flip series: V1={1,1.05}, V2={50,52}, sigma fixed, rho falls with x
// ---------------------------------------------------------------------------

const DEPTH_GRID = [0.01, 0.02, 0.03, 0.05, 0.07, 0.1, 0.15, 0.2, 0.3, 0.5];

export const IMP95409_DEPTH_FLIP_SERIES = DEPTH_GRID.map((x) => {
  const c = compareSplits([1, 1.05], [50, 52], x);
  return {
    x,
    sigma: c.sigma,
    rho: c.rho,
    rhoStar: rhoStar(c.sigma),
    winner: c.looWins ? "LOO" : "S2",
  };
});

export const IMP95409_SIGMA_FIXED = IMP95409_DEPTH_FLIP_SERIES[0].sigma;

export const IMP95409_SUMMARY = {
  rhoStarFormula: "rhoStar(sigma) = (1 + sqrt(1 - sigma^2)) / sigma",
  criterion:
    "SPLIT-2 tighter <=> rho < rhoStar(sigma), rho = max(sqrt(L1/L2), sqrt(L2/L1))",
  depthFlipConfig: "V1={1,1.05}, V2={50,52}",
  sigmaFixed: IMP95409_SIGMA_FIXED,
  flipInterval: "between x=0.05 and x=0.1",
  verdict:
    "MEASUREMENT: re-renders the imp-95256 crossover identity in its " +
    "rho-vs-rhoStar(sigma) form and traces the concrete depth-flip example " +
    "where sigma stays fixed but rho falls through the threshold as depth " +
    "grows. Algebraically identical to the g-vs-sigma form (imp-95391); no " +
    "new bound; changes no bound; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

const ASSERTIONS = [
  {
    id: "imp95409-rhostar-curve-monotone-decreasing",
    holds: () => {
      for (let i = 1; i < IMP95409_RHOSTAR_CURVE.length; i++) {
        if (
          IMP95409_RHOSTAR_CURVE[i].rhoStar >=
          IMP95409_RHOSTAR_CURVE[i - 1].rhoStar
        )
          return false;
      }
      return true;
    },
  },
  {
    id: "imp95409-sigma-depth-independent",
    holds: () =>
      IMP95409_DEPTH_FLIP_SERIES.every(
        (r) => Math.abs(r.sigma - IMP95409_SIGMA_FIXED) < 1e-9 * IMP95409_SIGMA_FIXED,
      ),
  },
  {
    id: "imp95409-depth-flip-matches-imp95256",
    holds: () => {
      const byX = Object.fromEntries(
        IMP95409_DEPTH_FLIP_SERIES.map((r) => [r.x, r.winner]),
      );
      return (
        byX[0.02] === "S2" &&
        byX[0.05] === "S2" &&
        byX[0.1] === "LOO" &&
        byX[0.2] === "LOO" &&
        byX[0.5] === "LOO"
      );
    },
  },
  {
    id: "imp95409-rho-vs-rhostar-agrees-with-winner",
    holds: () =>
      IMP95409_DEPTH_FLIP_SERIES.every(
        (r) => (r.winner === "S2") === r.rho < r.rhoStar,
      ),
  },
  {
    id: "imp95409-verdict-honesty",
    holds: () =>
      /MEASUREMENT/.test(IMP95409_SUMMARY.verdict) &&
      /changes no bound/.test(IMP95409_SUMMARY.verdict) &&
      /NO QED/.test(IMP95409_SUMMARY.verdict) &&
      /refereed bound is changed/i.test(IMP95409_SUMMARY.verdict),
  },
];

for (const a of ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95409-rhostar-depthflip-viz-data assertion failed: ${a.id}`);
  }
}
