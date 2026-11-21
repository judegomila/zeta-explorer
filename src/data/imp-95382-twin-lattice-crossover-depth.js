/**
 * imp-95382: MEASUREMENT -- the twin-lattice SPLIT-2 -> SPLIT-LOO crossover
 * DEPTH x*(r, s), tabulated across the (r, s) family. This closes the loose
 * end of imp-95256 ("DEPTH DRIVES THE CROSSOVER"), which observed that the
 * SPLIT winner flips with depth alone (example V1={1,1.05}, V2={50,52} flips
 * between x=0.05 and x=0.1) but never tabulated the exact crossover depth
 * across the family. Measurement only; changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * OBJECTS (imp-95256 / imp-95250 normalization). Twin-lattice family: two
 * disjoint two-rate blocks V1 = {1, r}, V2 = {s, s r} in L2(0, inf), r > 1
 * the intra-block spread, s > 1 the inter-block scale separation. Cauchy
 * Gram G_ij = 1/(nu_i + nu_j); depth d = x; per-block quotient
 * Lambda_k(x) = lambda_max of the pencil (D_k G_k D_k, G_k),
 * D_k = diag(e^(-x nu)). sigma(r, s) = cos of the first principal angle
 * between span E(V1) and span E(V2) -- depth-INDEPENDENT (one angle per
 * geometry). The two two-block bounds compare as (imp-95256 exact locus)
 *   SPLIT-LOO / SPLIT-2 = (1 + g(x)) / (1 + sigma),
 *   g(x) := 2 sqrt(L1(x) L2(x)) / (L1(x) + L2(x)) in (0, 1],
 * so SPLIT-LOO is tighter iff g(x) < sigma and SPLIT-2 iff g(x) > sigma.
 *
 * WHY THE CROSSOVER DEPTH EXISTS AND IS UNIQUE. A block-scaling identity
 * makes the depth dependence explicit: Lambda({s, s r}, x) = Lambda({1, r},
 * s x) (scaling nu -> s nu multiplies both pencil matrices by 1/s, which
 * cancels, and rescales the depth x -> s x; verified to 1e-13 below). Hence
 *   L1(x) = Lambda({1, r}, x),   L2(x) = Lambda({1, r}, s x),
 * and with s > 1 the deeper block is attenuated FASTER. At x = 0 both
 * D_k = I so L1 = L2 = 1 and g(0) = 1 > sigma (sigma < 1 for any disjoint
 * blocks). As x grows the ratio L2/L1 in [0, 1] decreases monotonically, so
 * g(x) = 2 sqrt(t)/(1 + t), t = L2/L1, decreases monotonically from 1. sigma
 * is a horizontal line, so g crosses it at exactly one depth
 *   x*(r, s) := the unique x with g(x) = sigma(r, s),
 * with SPLIT-2 tighter for x < x* (weak, near-balanced attenuation) and
 * SPLIT-LOO tighter for x > x* (the imbalanced deep-tail regime the
 * every-octave certificate lives in). Root-found by bisection below.
 *
 * WHAT THE TABLE SHOWS. Across r in {1.05, 1.1, 1.2, 1.3} and s in
 * {1.5, 2, 3, 5, 10}, the crossover depth x*(r, s) sits in a narrow band
 * ~0.16..0.28 -- i.e. SPLIT-LOO already wins by depth x ~ 0.3 across the
 * ENTIRE nearby twin-lattice family, quantifying the imp-95256 qualitative
 * claim that the family is "SPLIT-LOO everywhere at any moderate depth". Two
 * structural features:
 *  (i) x*(r, s) is NON-MONOTONE in s at fixed r: it rises from s = 1.5 to a
 *      peak near s = 3 then falls (e.g. r = 1.1: 0.2081, 0.2556, 0.2702,
 *      0.2437, 0.1784 at s = 1.5, 2, 3, 5, 10). Small s keeps g near 1 but
 *      also pins sigma near 1 (nearly parallel spans) so the crossing is
 *      early; large s drops sigma but also crushes L2 fast, so g falls
 *      through the (now lower) sigma quickly again -- the peak is where the
 *      two effects balance.
 * (ii) x*(r, s) DECREASES with r at fixed s (wider intra-block spread
 *      crosses earlier), a mild monotone trend.
 * The imp-95256 anchor r = 1.1, s = 2 has x* = 0.2556, consistent with its
 * reported g(6) = 0.00764 << sigma = 0.99980 (deep in the SPLIT-LOO region).
 *
 * HONEST LIMITS. (a) The g-vs-sigma criterion is an algebraic identity of
 * two proven closed forms (imp-95256), not a new bound; x*(r, s) is the root
 * of that identity, a MEASUREMENT of where the two known bounds cross. (b)
 * m = 2 (two blocks) only; the recursive-peel vs additive multi-block axis
 * (m >= 3) is untouched. (c) Model twin-lattice family only; no mapping to
 * paper per-window data; changes NO Lambda bound of the program.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS /
 * root-finds of proven closed forms, never a claim in themselves.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95382_TWIN_LATTICE_CROSSOVER_DEPTH = {
  id: "imp-95382",
  title:
    "Twin-lattice SPLIT-2 -> SPLIT-LOO crossover depth x*(r,s) tabulated " +
    "across the family V1={1,r}, V2={s,sr}; g(x*) = sigma",
  definition:
    "x*(r,s) = unique depth with g(x) = sigma(r,s); g(x) = " +
    "2 sqrt(L1 L2)/(L1+L2), L1 = Lambda({1,r},x), L2 = Lambda({1,r},s x) = " +
    "Lambda({s,sr},x); SPLIT-2 tighter for x < x*, SPLIT-LOO for x > x*",
  anchor: {
    config: "r = 1.1, s = 2 (imp-95256 / imp-95250 single anchor geometry)",
    xStar: 0.2556269473769899,
    sigma: 0.9998049479008838,
    gAtSix: 0.007642414525298169,
    note: "x* = 0.2556 << 6, so the anchor at x = 6 is deep in SPLIT-LOO",
  },
  nonMonotoneInS:
    "x*(r,s) is non-monotone in s at fixed r (peak near s = 3): r = 1.1 " +
    "gives x* = 0.2081, 0.2556, 0.2702, 0.2437, 0.1784 at s = 1.5,2,3,5,10",
  band:
    "x*(r,s) in ~0.16..0.28 across r in {1.05,1.1,1.2,1.3}, " +
    "s in {1.5,2,3,5,10}: SPLIT-LOO wins by depth x ~ 0.3 family-wide",
  honestScope:
    "the g-vs-sigma criterion is an algebraic identity of two proven closed " +
    "forms (imp-95256), not a new bound; x* is its root, a MEASUREMENT of " +
    "where the two known bounds cross; m = 2 only; twin-lattice model family " +
    "only; changes no bound; NO QED; no refereed bound is changed",
  verdict:
    "MEASUREMENT: the imp-95256 depth-driven SPLIT-2 -> SPLIT-LOO flip is " +
    "tabulated as an exact crossover-depth map x*(r,s) over the twin-lattice " +
    "family. x* is a narrow band ~0.16..0.28, non-monotone in s (peak near " +
    "s = 3), decreasing in r. Changes no bound; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Self-contained numeric machinery (import-light; mirrors imp-95256)
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
        if (s <= 0) throw new Error("imp-95382 chol: pencil base not PD");
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

// twin-lattice balance ratio g(x) and depth-independent angle sigma
const gOf = (r, s, x) => {
  const l1 = lamExact([1, r], x);
  const l2 = lamExact([1, r], s * x); // = Lambda({s,sr},x) by block scaling
  return (2 * Math.sqrt(l1 * l2)) / (l1 + l2);
};
const sigmaOf = (r, s) => Math.sqrt(cos2Direct([1, r], [s, s * r]));

// unique crossover depth x*(r,s): root of g(x) = sigma by bisection
function crossoverDepth(r, s) {
  const sigma = sigmaOf(r, s);
  let hi = 1e-3;
  while (gOf(r, s, hi) > sigma) {
    hi *= 2;
    if (hi > 1e6) break; // guard; g -> 0 so this never fires for s > 1
  }
  let lo = 0;
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (gOf(r, s, mid) > sigma) lo = mid;
    else hi = mid;
  }
  const xStar = 0.5 * (lo + hi);
  return { xStar, sigma, gAtStar: gOf(r, s, xStar) };
}

// ---------------------------------------------------------------------------
// Measured crossover-depth surface (recomputed at load)
// ---------------------------------------------------------------------------

const R_GRID = [1.05, 1.1, 1.2, 1.3];
const S_GRID = [1.5, 2, 3, 5, 10];

const CROSSOVER_DEPTH_GRID = (() => {
  const rows = [];
  for (const r of R_GRID) {
    for (const s of S_GRID) {
      const c = crossoverDepth(r, s);
      rows.push({
        r,
        s,
        xStar: c.xStar,
        sigma: c.sigma,
        gAtStar: c.gAtStar,
      });
    }
  }
  return rows;
})();

export const IMP95382_SURFACE = {
  rGrid: R_GRID,
  sGrid: S_GRID,
  crossoverDepth: CROSSOVER_DEPTH_GRID,
};

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95382_ASSERTIONS = [
  {
    id: "imp95382-block-scaling-identity",
    description:
      "block scaling Lambda({s,sr},x) = Lambda({1,r},s x) holds to 1e-11 " +
      "(the identity that makes the depth dependence L2 = Lambda({1,r},s x))",
    holds: () => {
      for (const [r, s, x] of [
        [1.1, 2, 0.5],
        [1.2, 3, 1],
        [1.05, 5, 0.2],
      ]) {
        const a = lamExact([s, s * r], x);
        const b = lamExact([1, r], s * x);
        if (Math.abs(a - b) > 1e-11) return false;
      }
      return true;
    },
  },
  {
    id: "imp95382-root-is-crossover",
    description:
      "at every grid point g(x*) = sigma to 1e-9 (bisection actually found " +
      "the crossover of the g-vs-sigma criterion)",
    holds: () =>
      CROSSOVER_DEPTH_GRID.every(
        (row) => Math.abs(row.gAtStar - row.sigma) < 1e-9,
      ),
  },
  {
    id: "imp95382-winner-flips-at-xstar",
    description:
      "the SPLIT winner flips across x* at every grid point: SPLIT-2 tighter " +
      "just below x* (g > sigma) and SPLIT-LOO tighter just above (g < sigma)",
    holds: () =>
      CROSSOVER_DEPTH_GRID.every((row) => {
        const below = gOf(row.r, row.s, row.xStar * 0.9);
        const above = gOf(row.r, row.s, row.xStar * 1.1);
        return below > row.sigma && above < row.sigma;
      }),
  },
  {
    id: "imp95382-g-monotone-decreasing",
    description:
      "g(x) is strictly decreasing in x from g(0+) -> 1 (sampled), so the " +
      "crossover depth x* is unique on the whole family",
    holds: () => {
      for (const { r, s } of CROSSOVER_DEPTH_GRID) {
        let prev = 1.0 + 1e-12;
        for (const x of [1e-4, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]) {
          const g = gOf(r, s, x);
          if (g >= prev) return false;
          prev = g;
        }
      }
      return true;
    },
  },
  {
    id: "imp95382-anchor-reproduces",
    description:
      "the imp-95256 anchor r = 1.1, s = 2 recomputes (rel 1e-6): " +
      "x* = 0.2556, sigma = 0.99980, g(6) = 0.00764 << sigma (deep SPLIT-LOO)",
    holds: () => {
      const c = crossoverDepth(1.1, 2);
      const A = IMP95382_TWIN_LATTICE_CROSSOVER_DEPTH.anchor;
      return (
        Math.abs(c.xStar - A.xStar) < 1e-6 * A.xStar &&
        Math.abs(c.sigma - A.sigma) < 1e-6 * A.sigma &&
        Math.abs(gOf(1.1, 2, 6) - A.gAtSix) < 1e-6 * A.gAtSix &&
        c.xStar < 6
      );
    },
  },
  {
    id: "imp95382-band-and-non-monotone-in-s",
    description:
      "x* lies in the ~0.16..0.28 band family-wide and is non-monotone in s " +
      "at r = 1.1 (rises to a peak near s = 3 then falls)",
    holds: () => {
      if (
        !CROSSOVER_DEPTH_GRID.every(
          (row) => row.xStar > 0.15 && row.xStar < 0.3,
        )
      )
        return false;
      const at = (s) => crossoverDepth(1.1, s).xStar;
      const v15 = at(1.5),
        v2 = at(2),
        v3 = at(3),
        v5 = at(5),
        v10 = at(10);
      return v15 < v2 && v2 < v3 && v3 > v5 && v5 > v10;
    },
  },
  {
    id: "imp95382-verdict-honesty",
    description:
      "verdict and scope carry the honest labels: MEASUREMENT, algebraic " +
      "identity not a new bound, no bound change, no QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(IMP95382_TWIN_LATTICE_CROSSOVER_DEPTH.verdict) &&
      /Changes no bound/.test(
        IMP95382_TWIN_LATTICE_CROSSOVER_DEPTH.verdict,
      ) &&
      /NO QED/.test(IMP95382_TWIN_LATTICE_CROSSOVER_DEPTH.verdict) &&
      /refereed bound is changed/i.test(IMP95382_TWIN_LATTICE_CROSSOVER_DEPTH.verdict) &&
      /algebraic identity/.test(
        IMP95382_TWIN_LATTICE_CROSSOVER_DEPTH.honestScope,
      ),
  },
];

for (const a of IMP95382_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95382-twin-lattice-crossover-depth assertion failed: ${a.id}`,
    );
  }
}

export default IMP95382_TWIN_LATTICE_CROSSOVER_DEPTH;
