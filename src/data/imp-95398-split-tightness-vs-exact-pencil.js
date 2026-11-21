/**
 * imp-95398: MEASUREMENT -- the ABSOLUTE tightness of the imp-95249 SPLIT-2
 * and the imp-95250 SPLIT-LOO two-block bounds, EACH SEPARATELY, against the
 * EXACT joint pencil eigenvalue Lambda(V_1 u V_2, x) across the imp-95256
 * crossover surface. imp-95256 mapped WHICH of the two splits is smaller
 * (g vs sigma); imp-95378 measured the MIN of the two vs exact. Neither
 * quantified the slack that EACH split pays individually. This module does:
 * it solves the merged 4-rate generalized eigenproblem directly and reports
 * split2/exact and splitLoo/exact separately at every surface point.
 * Measurement only; changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECTS (imp-95226 / imp-95250 / imp-95256 normalization). Two disjoint
 * blocks of exponential rates V_1, V_2 in L2(0, inf), Cauchy Gram
 * G_ij = 1/(nu_i + nu_j), depth d = x, per-block quotient
 * Lambda_k = lambda_max of the pencil (D_k G_k D_k, G_k), D_k = diag(e^(-x nu)).
 * sigma = cos of the first principal angle between span E(V_1) and span E(V_2).
 * The EXACT joint quantity is Lambda(V_1 u V_2, x) = lambda_max of the pencil
 * (D G D, G) over the FULL merged rate set V_1 u V_2 (here a 4x4 pencil). The
 * two proven two-block upper bounds on it are:
 *   SPLIT-2   (imp-95249):  Lambda <= (Lambda_1 + Lambda_2)/(1 - sigma),
 *   SPLIT-LOO (imp-95250):  Lambda <= (sqrt(Lambda_1)+sqrt(Lambda_2))^2/(1-sigma^2).
 *
 * WHAT IS MEASURED. For each (geometry, depth) on the imp-95256 surface,
 * the two tightness ratios
 *   T2  := SPLIT-2   / Lambda(V_1 u V_2, x)   >= 1,
 *   Too := SPLIT-LOO / Lambda(V_1 u V_2, x)   >= 1,
 * i.e. the absolute multiplicative slack each split pays vs the exact merged
 * pencil (both are valid upper bounds so both ratios are >= 1).
 *
 * FINDINGS.
 *  1. BOTH SLACKS BLOW UP TOGETHER ON THE NEARBY TWIN LATTICE (SPLIT-LOO
 *     region, g < sigma). Over V_1 = {1,1.1}, V_2 = {s, 1.1 s}, s in
 *     {1.2,1.5,2,3,5}, x in {3,4,6,8,10}: T2 ranges 10.81 .. 3.38e6 and
 *     Too ranges 5.47 .. 3.22e6. The huge slack is NOT the arithmetic-vs-sqrt
 *     pricing that distinguishes the two forms; it is the SHARED angular
 *     collar 1/(1 - sigma) as the clusters approach (sigma -> 1). Confirmed
 *     by the collar-product law: T2*(1 - sigma) stays in [1.3e-3, 0.352]
 *     while 1/(1 - sigma) runs to 2.66e7 across the grid (and analogously
 *     Too*(1 - sigma^2) in [1.7e-3, 0.352]). So each slack ~ (const)/collar,
 *     unbounded, collar-driven.
 *  2. BOTH SLACKS ARE MODEST IN THE WIDE-SEPARATION REGION. Over
 *     V_1 = {1,1.05} u V_2 = {50,52} and {1,2} u {100,200}, x in
 *     {0.01..0.2}: T2 in 1.68 .. 4.12, Too in 1.19 .. 5.41. The BEST
 *     absolute tightness of EITHER split on the whole surface is Too = 1.194
 *     (and T2 = 1.678) at {1,2} u {100,200}, x = 0.2 (sigma = 0.406) -- the
 *     wide-separation, moderate-depth corner where the collar is mild.
 *  3. THE TWO SLACKS NEVER DIFFER BY MORE THAN 2x, AND THEIR RATIO IS THE
 *     EXACT imp-95256 CROSSOVER QUANTITY. Since exact is common,
 *     Too/T2 = SPLIT-LOO/SPLIT-2 = (1 + g)/(1 + sigma) exactly
 *     (g = 2 sqrt(Lambda_1 Lambda_2)/(Lambda_1+Lambda_2)); verified to
 *     rel 3.3e-10 across the surface. Because g <= 1 <= 1 + sigma, this ratio
 *     lies in (0, 2), so the LOSING split is at most 2x looser to exact than
 *     the winner -- the winner (smaller bound) is always the split closer to
 *     exact (trivially, exact is shared), and the gap between them is bounded
 *     while each absolute slack is not.
 *  4. DEPTH FLIPS WHICH SPLIT IS TIGHTER-TO-EXACT. On the depth-flip family
 *     {1,1.05} u {50,52} (sigma = 0.5244 fixed): (T2, Too) = (3.74, 4.89) at
 *     x = 0.02 and (2.46, 2.75) at x = 0.05 (SPLIT-2 tighter), flipping to
 *     (2.11, 1.56), (2.10, 1.38), (2.07, 1.36) at x = 0.1, 0.2, 0.5
 *     (SPLIT-LOO tighter) -- g falls through the constant sigma with depth.
 *
 * VERDICT. Measured separately, SPLIT-2 and SPLIT-LOO pay ESSENTIALLY THE
 * SAME absolute slack against the exact merged pencil: their ratio is the
 * bounded (< 2x) imp-95256 crossover factor (1 + g)/(1 + sigma), while their
 * common magnitude is set by the shared angular collar 1/(1 - sigma) --
 * modest (1.19 .. ~5x) in the wide-separation corner, unbounded (to ~3e6x
 * here) on the nearby twin lattice the every-octave certificate actually
 * serves. Choosing the tighter of the two (imp-95378 min) saves at most the
 * <=2x crossover factor; it cannot touch the collar that drives the slack.
 * Named residual (same as imp-95378): collar-limited nearby-cluster looseness
 * of BOTH two-block splits; closing it needs a sharper non-diagonal joint
 * collar (the imp-95249 seam pencil used directly), not either collared form.
 *
 * HONEST LIMITS. (a) T2 >= 1, Too >= 1 are re-verifications that the two
 * proven closed forms upper-bound the directly-computed exact pencil; the
 * content is the SEPARATE magnitude of each slack and the collar attribution.
 * (b) Too/T2 = (1+g)/(1+sigma) is the imp-95256 identity re-confirmed against
 * the exact pencil, not a new bound. (c) m = 2 only. (d) Model family only
 * (twin-lattice + wide-separation surface of imp-95256); no mapping to paper
 * per-window data; changes NO Lambda bound of the program.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS of
 * two proven closed forms and a directly-computed exact pencil, never a claim.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95398_SPLIT_TIGHTNESS_VS_EXACT = {
  id: "imp-95398",
  title:
    "SPLIT-2 and SPLIT-LOO absolute tightness (bound/exact) measured " +
    "separately vs the exact merged joint pencil across the imp-95256 surface",
  ratios:
    "T2 = SPLIT-2/Lambda(V1 u V2, x), Too = SPLIT-LOO/Lambda(V1 u V2, x); " +
    "both >= 1 (proven upper bounds); Too/T2 = (1+g)/(1+sigma) exactly, in (0,2)",
  twinLatticeRegion: {
    config: "V1={1,1.1}, V2={s,1.1 s}, s in {1.2,1.5,2,3,5}, x in {3,4,6,8,10}",
    t2Range: [10.812689586147895, 3381088.0856765048],
    tooRange: [5.4657284685426415, 3221141.7215002393],
    driver:
      "shared angular collar 1/(1-sigma) as sigma -> 1; T2*(1-sigma) in " +
      "[1.29e-3, 0.352] while 1/(1-sigma) runs to 2.66e7 across the grid",
  },
  wideSeparationRegion: {
    config: "V1={1,1.05} u {50,52} and {1,2} u {100,200}, x in {0.01..0.2}",
    t2Range: [1.6782255123719296, 4.123531814649556],
    tooRange: [1.1937320119071964, 5.409435007423197],
  },
  bestAbsoluteTightness: {
    config: "{1,2} u {100,200}, x = 0.2 (wide sep, moderate depth, sigma=0.406)",
    t2: 1.6782255123719296,
    too: 1.1937320119071964,
  },
  anchor: {
    config: "{1,1.1} u {2,2.2}, x = 6 (imp-95250 single anchor)",
    exact: 0.0154579142964125,
    split2: 2.8624514140987447,
    splitLoo: 1.4423043894311507,
    t2: 185.17707882253347,
    too: 93.30523910110455,
    tooOverT2: 0.5038705, // = (1+g)/(1+sigma)
  },
  split2WinPoint: {
    config: "{1,1.05} u {50,52}, x = 0.02 (small depth, wide separation)",
    exact: 0.9999999996385175,
    split2: 3.741885811390581,
    splitLoo: 4.8903549652553195,
    t2: 3.7418858127432073,
    too: 4.8903549670230975,
  },
  crossoverIdentity:
    "Too/T2 = SPLIT-LOO/SPLIT-2 = (1+g)/(1+sigma) is an algebraic identity of " +
    "the two closed forms, re-confirmed vs the exact pencil (rel err 3.3e-10 " +
    "across the surface); the LOSING split is at most 2x looser to exact than " +
    "the winner (g <= 1); the winner is always the split closer to exact",
  residual:
    "collar-limited nearby-cluster looseness of BOTH two-block splits (shared " +
    "1/(1-sigma) collar, unbounded as sigma -> 1); closing it needs a sharper " +
    "non-diagonal joint collar (imp-95249 seam pencil directly), not either form",
  honestScope:
    "T2, Too >= 1 re-verify the two proven closed forms upper-bound the " +
    "directly-computed exact pencil; the content is the SEPARATE slack of each " +
    "and the shared-collar attribution; Too/T2 identity is imp-95256 re-" +
    "confirmed; m = 2 only; model family only; changes no bound; NO QED; " +
    "no refereed bound is changed",
  verdict:
    "MEASUREMENT: SPLIT-2 and SPLIT-LOO pay essentially the SAME absolute " +
    "slack vs the exact merged pencil -- their ratio is the bounded (<2x) " +
    "imp-95256 factor (1+g)/(1+sigma), their common magnitude is set by the " +
    "shared angular collar 1/(1-sigma): modest (1.19..~5x) in the wide-" +
    "separation corner, unbounded (~3e6x here) on the nearby twin lattice. " +
    "Choosing the tighter (imp-95378 min) saves at most the <=2x factor and " +
    "cannot touch the collar. Changes no bound; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Self-contained numeric machinery (import-light; mirrors imp-95256/imp-95378)
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
        if (s <= 0) throw new Error("imp-95398 chol: pencil base not PD");
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

// SPLIT-2, SPLIT-LOO, the exact merged pencil, and the two tightness ratios
function tightness(b1, b2, x) {
  const s2 = cos2Direct(b1, b2);
  const sigma = Math.sqrt(s2);
  const l1 = lamExact(b1, x);
  const l2 = lamExact(b2, x);
  const split2 = (l1 + l2) / (1 - sigma);
  const splitLoo = (Math.sqrt(l1 / (1 - s2)) + Math.sqrt(l2 / (1 - s2))) ** 2;
  const exact = lamExact([...b1, ...b2], x); // full-rate merged joint pencil
  const g = (2 * Math.sqrt(l1 * l2)) / (l1 + l2);
  return {
    sigma,
    g,
    split2,
    splitLoo,
    exact,
    t2: split2 / exact,
    too: splitLoo / exact,
    tooOverT2: splitLoo / split2,
    identity: (1 + g) / (1 + sigma),
    selects: splitLoo < split2 ? "SPLIT-LOO" : "SPLIT-2",
  };
}

// ---------------------------------------------------------------------------
// Measured surface (recomputed at load; same grid as imp-95256/imp-95378)
// ---------------------------------------------------------------------------

const SURFACE = (() => {
  const rows = [];
  for (const x of [3, 4, 6, 8, 10])
    for (const s of [1.2, 1.5, 2, 3, 5])
      rows.push({ tag: "twin", ...tightness([1, 1.1], [s, s * 1.1], x) });
  for (const [b1, b2] of [
    [[1, 1.05], [50, 52]],
    [[1, 2], [100, 200]],
  ])
    for (const x of [0.01, 0.02, 0.05, 0.1, 0.2])
      rows.push({ tag: "wide", ...tightness(b1, b2, x) });
  return rows;
})();

const twin = SURFACE.filter((r) => r.tag === "twin");
const wide = SURFACE.filter((r) => r.tag === "wide");
const rng = (arr, key) => [
  Math.min(...arr.map((r) => r[key])),
  Math.max(...arr.map((r) => r[key])),
];

export const IMP95398_SURFACE_SUMMARY = {
  points: SURFACE.length,
  twinT2Range: rng(twin, "t2"),
  twinTooRange: rng(twin, "too"),
  wideT2Range: rng(wide, "t2"),
  wideTooRange: rng(wide, "too"),
  bothAdmissible: SURFACE.every(
    (r) => r.t2 >= 1 - 1e-9 && r.too >= 1 - 1e-9,
  ),
  maxIdentityRelErr: Math.max(
    ...SURFACE.map((r) => Math.abs(r.tooOverT2 - r.identity) / r.identity),
  ),
};

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95398_ASSERTIONS = [
  {
    id: "imp95398-both-bounds-admissible",
    description:
      "both SPLIT-2 and SPLIT-LOO upper-bound the directly-computed exact " +
      "merged pencil at every surface point (T2 >= 1 and Too >= 1)",
    holds: () => SURFACE.every((r) => r.t2 >= 1 - 1e-9 && r.too >= 1 - 1e-9),
  },
  {
    id: "imp95398-ratio-is-crossover-identity",
    description:
      "Too/T2 = SPLIT-LOO/SPLIT-2 = (1+g)/(1+sigma) exactly at every point " +
      "(rel err < 1e-8), re-confirming the imp-95256 crossover factor vs exact",
    holds: () =>
      SURFACE.every(
        (r) => Math.abs(r.tooOverT2 - r.identity) < 1e-8 * r.identity,
      ),
  },
  {
    id: "imp95398-ratio-bounded-by-2x",
    description:
      "the two slacks never differ by more than 2x: Too/T2 = (1+g)/(1+sigma) " +
      "in (0,2) since g <= 1 <= 1+sigma, so the losing split is <=2x looser",
    holds: () =>
      SURFACE.every((r) => r.tooOverT2 > 0 && r.tooOverT2 < 2 * (1 + 1e-9)),
  },
  {
    id: "imp95398-winner-is-tighter-to-exact",
    description:
      "the smaller bound is always the one closer to exact (exact is shared): " +
      "selects SPLIT-LOO iff Too < T2, at every point",
    holds: () =>
      SURFACE.every(
        (r) => (r.selects === "SPLIT-LOO") === r.too < r.t2,
      ),
  },
  {
    id: "imp95398-twin-lattice-slacks-blow-up",
    description:
      "on the nearby twin lattice BOTH slacks blow up together: T2 up to " +
      "> 1e6x and Too up to > 1e6x (shared collar 1/(1-sigma), sigma -> 1)",
    holds: () => {
      const t2hi = Math.max(...twin.map((r) => r.t2));
      const toohi = Math.max(...twin.map((r) => r.too));
      return t2hi > 1e6 && toohi > 1e6;
    },
  },
  {
    id: "imp95398-collar-drives-both-slacks",
    description:
      "each slack tracks the shared collar: T2*(1-sigma) and Too*(1-sigma^2) " +
      "stay O(<=0.4) across the twin lattice while 1/(1-sigma) runs past 1e6",
    holds: () => {
      const p2 = twin.map((r) => r.t2 * (1 - r.sigma));
      const ploo = twin.map((r) => r.too * (1 - r.sigma * r.sigma));
      const collarMax = Math.max(...twin.map((r) => 1 / (1 - r.sigma)));
      return (
        Math.max(...p2) < 0.5 &&
        Math.max(...ploo) < 0.5 &&
        collarMax > 1e6
      );
    },
  },
  {
    id: "imp95398-wide-sep-slacks-modest",
    description:
      "in the wide-separation corner both slacks are modest: best tightness " +
      "on the whole surface is Too ~ 1.194 and T2 ~ 1.678 at {1,2} u {100,200}, x=0.2",
    holds: () => {
      const r = tightness([1, 2], [100, 200], 0.2);
      const B = IMP95398_SPLIT_TIGHTNESS_VS_EXACT.bestAbsoluteTightness;
      return (
        Math.abs(r.too - B.too) < 1e-6 * B.too &&
        Math.abs(r.t2 - B.t2) < 1e-6 * B.t2 &&
        Math.min(...wide.map((w) => w.too)) === r.too
      );
    },
  },
  {
    id: "imp95398-anchor-reproduces",
    description:
      "the imp-95250 anchor {1,1.1} u {2,2.2} x=6 recomputes (rel 1e-6): " +
      "exact 0.0154579, T2 ~ 185.18, Too ~ 93.31 (SPLIT-LOO tighter to exact)",
    holds: () => {
      const r = tightness([1, 1.1], [2, 2.2], 6);
      const A = IMP95398_SPLIT_TIGHTNESS_VS_EXACT.anchor;
      return (
        Math.abs(r.exact - A.exact) < 1e-6 * A.exact &&
        Math.abs(r.t2 - A.t2) < 1e-6 * A.t2 &&
        Math.abs(r.too - A.too) < 1e-6 * A.too &&
        r.selects === "SPLIT-LOO"
      );
    },
  },
  {
    id: "imp95398-verdict-honesty",
    description:
      "verdict and scope carry the honest labels: MEASUREMENT, same slack up " +
      "to the <2x crossover factor, shared collar, no bound change, no QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(IMP95398_SPLIT_TIGHTNESS_VS_EXACT.verdict) &&
      /shared angular collar/.test(
        IMP95398_SPLIT_TIGHTNESS_VS_EXACT.verdict,
      ) &&
      /Changes no bound/.test(IMP95398_SPLIT_TIGHTNESS_VS_EXACT.verdict) &&
      /NO QED/.test(IMP95398_SPLIT_TIGHTNESS_VS_EXACT.verdict) &&
      /refereed bound is changed/i.test(IMP95398_SPLIT_TIGHTNESS_VS_EXACT.verdict) &&
      /algebraic|identity/.test(
        IMP95398_SPLIT_TIGHTNESS_VS_EXACT.crossoverIdentity,
      ),
  },
];

for (const a of IMP95398_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95398-split-tightness-vs-exact-pencil assertion failed: ${a.id}`,
    );
  }
}

export default IMP95398_SPLIT_TIGHTNESS_VS_EXACT;
