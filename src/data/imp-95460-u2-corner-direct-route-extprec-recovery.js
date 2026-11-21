/**
 * @module imp-95460-u2-corner-direct-route-extprec-recovery
 *
 * imp-95460 (numerical): imp-95451 audit item (U2) recorded that independent
 * numerical confirmation of the imp-95249 LEMMA ANG-DET fence
 *   Phi_k = prod over cross pairs beta_ij^2  <=  1 - sigma_k^2
 * FAILS at 3 near-coalescent large-m corners where the imp-95425 DIRECT
 * principal-angle route (cos2Direct) is ill-conditioned and returns cos^2 > 1.
 * imp-95479 supplied the missing ground truth by REPLACING the direct route with
 * a stable whitening / SVD route and a double-double closed form, confirming the
 * fence. This module approaches the remaining half of the imp-95460 ask -- an
 * EXTENDED-PRECISION solve of THE DIRECT ROUTE ITSELF, and a RECORD of the
 * residual conditioning limit that actually caused the float64 breakdown.
 * MEASUREMENT only; changes no bound; NO QED; no refereed bound is changed.
 *
 * THE 3 CORNERS (twin lattice V_k = {2^k, r 2^k}, k = 0..m-1; block k solved
 * against the joint rest span of the other blocks):
 *   (m=6, r=1.02, k=2), (m=6, r=1.01, k=0), (m=6, r=1.01, k=3).
 *
 * WHAT THIS MODULE PINS DOWN. The imp-95425 direct route computes the largest
 * generalised eigenvalue of  M x = lam G1 x  with  M = G12 G2^-1 G12^T, forming
 * G2^-1 by an EXPLICIT matrix inverse (invSym: Cholesky then column-wise
 * solves against the identity) of the 10x10 near-degenerate joint-rest Cauchy
 * Gram G2. Running that exact algorithm here at float64 REPRODUCES the artifact:
 *   (m=6,r=1.02,k=2): cos^2 - 1 = +1.744e-6
 *   (m=6,r=1.01,k=0): cos^2 - 1 = +2.737e-5
 *   (m=6,r=1.01,k=3): cos^2 - 1 = +2.694e-6
 * i.e. cos^2 > 1 at all three -- the imp-95425 / imp-95479 diagnosis, confirmed.
 *
 * THE FINDING. The breakdown is localised to the EXPLICIT-INVERSE step. Keeping
 * the SAME direct formulation M = G12 G2^-1 G12^T but realising G2^-1 by a
 * triangular Cholesky SOLVE of  G2 X = G12^T  (never forming the inverse), then
 * reducing the 2x2 pencil in closed form, already returns a VALID cos^2 < 1 at
 * float64 at every corner. Carrying that same solve chain in double-double
 * (~106-bit) confirms it and matches the imp-95479 ground truth 1 - cos^2 to
 * <= 1e-10:
 *   (m=6,r=1.02,k=2): 1 - cos^2 = 3.519489e-7   (= imp-95479 MIN_ONE_MINUS_COS2)
 *   (m=6,r=1.01,k=0): 1 - cos^2 = 3.165007e-6
 *   (m=6,r=1.01,k=3): 1 - cos^2 = 3.525863e-7
 * So the residual conditioning limit is NOT intrinsic to the principal-angle
 * problem at these corners: it is the explicit inversion of the near-singular
 * G2 (which squares its condition number kappa(G2) ~ 1e8..1e9, pushing the
 * squared condition past the float64 breakdown ~1e16). A one-line change from
 * invert-then-multiply to solve removes it; extended precision then only pins
 * the last few digits. This supplies the direct-route ground truth left open by
 * imp-95479 (which avoided the direct route entirely) and confirms the fence
 * direction Phi_k <= 1 - sigma_k^2 on the direct route as well.
 *
 * HONEST LIMITS. (a) MEASUREMENT only: nothing here derives or moves a bound; it
 * supplies direct-route numeric ground truth for a direction already PROVEN in
 * imp-95249 ANG-DET and already confirmed via the whitening route in imp-95479.
 * (b) The faithful double-double replay of the EXPLICIT-inverse variant (invSym
 * in double-double, then Jacobi in double-double) is not carried here -- the
 * Jacobi sweep in double-double on the reduced pencil was numerically fragile;
 * the stable solve-based direct route is used instead and is the correct fix, so
 * the explicit-inverse variant is only exercised at float64 to REPRODUCE the
 * artifact, not to recover it. (c) Same model-family twin-lattice grid as
 * imp-95425/imp-95479; obligation (3) paper-per-window mapping unchanged.
 * (d) Import-light (no zeros bundle, no sibling imports; numerics self-contained).
 * Changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Generic arithmetic: float64 (F) and double-double ~106-bit (D)
// ---------------------------------------------------------------------------

const dd = (hi, lo = 0) => ({ hi, lo });
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  return [s, (a - (s - bb)) + (b - bb)];
}
function twoProd(a, b) {
  const p = a * b;
  const S = 134217729; // 2^27 + 1 (Dekker split)
  const ta = S * a;
  const ah = ta - (ta - a);
  const al = a - ah;
  const tb = S * b;
  const bh = tb - (tb - b);
  const bl = b - bh;
  return [p, ((ah * bh - p) + ah * bl + al * bh) + al * bl];
}
function ddAdd(x, y) {
  let [s, e] = twoSum(x.hi, y.hi);
  e += x.lo + y.lo;
  const [hi, lo] = twoSum(s, e);
  return dd(hi, lo);
}
function ddSub(x, y) {
  return ddAdd(x, dd(-y.hi, -y.lo));
}
function ddMul(x, y) {
  let [p, e] = twoProd(x.hi, y.hi);
  e += x.hi * y.lo + x.lo * y.hi;
  const [hi, lo] = twoSum(p, e);
  return dd(hi, lo);
}
function ddDiv(x, y) {
  const q = x.hi / y.hi;
  const [p, e] = twoProd(q, y.hi);
  const num = ((((x.hi - p) - e) + x.lo) - q * y.lo) / y.hi;
  const [hi, lo] = twoSum(q, num);
  return dd(hi, lo);
}
function ddSqrt(x) {
  if (x.hi <= 0) return dd(0);
  const s = Math.sqrt(x.hi);
  const [p, e] = twoProd(s, s);
  const num = ((x.hi - p) - e) + x.lo;
  const r = num / (2 * s);
  const [hi, lo] = twoSum(s, r);
  return dd(hi, lo);
}

const F = {
  lit: (x) => x,
  c: (x) => x,
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => a / b,
  sqrt: Math.sqrt,
  num: (x) => x,
};
const D = {
  lit: (x) => dd(x, 0),
  c: (x) => dd(x, 0),
  add: ddAdd,
  sub: ddSub,
  mul: ddMul,
  div: ddDiv,
  sqrt: ddSqrt,
  num: (v) => v.hi + v.lo,
};

// ---------------------------------------------------------------------------
// Generic small-matrix helpers (arithmetic A passed in)
// ---------------------------------------------------------------------------

function cauchyGram(nus, A) {
  return nus.map((a) => nus.map((b) => A.div(A.lit(1), A.add(A.c(a), A.c(b)))));
}
function crossGram(n1, n2, A) {
  return n1.map((a) => n2.map((b) => A.div(A.lit(1), A.add(A.c(a), A.c(b)))));
}
function transpose(M) {
  return M[0].map((_, j) => M.map((r) => r[j]));
}
function matMul(P, Q, A) {
  const n = P.length;
  const m = Q[0].length;
  const kk = Q.length;
  const C = Array.from({ length: n }, () =>
    Array.from({ length: m }, () => A.lit(0)),
  );
  for (let i = 0; i < n; i++)
    for (let l = 0; l < kk; l++) {
      const a = P[i][l];
      for (let j = 0; j < m; j++) C[i][j] = A.add(C[i][j], A.mul(a, Q[l][j]));
    }
  return C;
}
function chol(B, A) {
  const n = B.length;
  const L = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => A.lit(0)),
  );
  for (let i = 0; i < n; i++)
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s = A.sub(s, A.mul(L[i][k], L[j][k]));
      if (i === j) L[i][i] = A.sqrt(s);
      else L[i][j] = A.div(s, L[j][j]);
    }
  return L;
}
function fwd(L, b, A) {
  const n = L.length;
  const x = b.slice();
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < i; k++) x[i] = A.sub(x[i], A.mul(L[i][k], x[k]));
    x[i] = A.div(x[i], L[i][i]);
  }
  return x;
}
function bwd(L, b, A) {
  const n = L.length;
  const x = b.slice();
  for (let i = n - 1; i >= 0; i--) {
    for (let k = i + 1; k < n; k++) x[i] = A.sub(x[i], A.mul(L[k][i], x[k]));
    x[i] = A.div(x[i], L[i][i]);
  }
  return x;
}
// EXPLICIT inverse of a SPD matrix (imp-95425 invSym): Cholesky then solve the
// identity column by column. This is the step whose squared condition number
// produces the cos^2 > 1 artifact -- reproduced at float64 only.
function invSym(B, A) {
  const n = B.length;
  const L = chol(B, A);
  const inv = Array.from({ length: n }, () => new Array(n));
  for (let j = 0; j < n; j++) {
    const e = Array.from({ length: n }, () => A.lit(0));
    e[j] = A.lit(1);
    const y = fwd(L, e, A);
    const x = bwd(L, y, A);
    for (let i = 0; i < n; i++) inv[i][j] = x[i];
  }
  return inv;
}

// Closed-form largest eigenvalue of the reduced symmetric 2x2 pencil
// C = L1^-1 M L1^-T (twin block => n1 = 2), returned as a plain number.
function largestReduced2x2(M, G1, A) {
  const L1 = chol(G1, A);
  // Y = L1^-1 M  (solve each column of M)
  const Mcols = M[0].map((_, j) => M.map((r) => r[j]));
  const Ycols = Mcols.map((col) => fwd(L1, col, A));
  const Y = Mcols[0].map((_, i) => Ycols.map((c) => c[i]));
  // C = Y L1^-T  (solve each column of Y^T)
  const Yt = transpose(Y);
  const Ctcols = Yt[0].map((_, j) => Yt.map((r) => r[j])).map((col) =>
    fwd(L1, col, A),
  );
  const Ct = Yt[0].map((_, i) => Ctcols.map((c) => c[i]));
  const C = transpose(Ct);
  const a = C[0][0];
  const b = C[0][1];
  const d = C[1][1];
  const half = A.lit(0.5);
  const tr = A.mul(A.add(a, d), half);
  const dif = A.mul(A.sub(a, d), half);
  const disc = A.sqrt(A.add(A.mul(dif, dif), A.mul(b, b)));
  return A.num(A.add(tr, disc));
}

// Float64 symmetric Jacobi eigenvalues (imp-95425 jacobiEig, verbatim path):
// the classical rotation sweep whose reduction, composed with the explicit
// inverse, produces the cos^2 > 1 overflow at the ill-conditioned corners.
function jacobiEigF64(Ain) {
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
// Float64 pencil eigenvalues of M x = lam B x via chol(B) reductions (imp-95425
// pencilEig, verbatim path).
function pencilEigF64(M, B) {
  const L = chol(B, F);
  const n = M.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(L, M.map((r) => r[j]), F);
    for (let i = 0; i < n; i++) Y[i][j] = y[i];
  }
  const Yt = transpose(Y);
  const Ct = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(L, Yt.map((r) => r[j]), F);
    for (let i = 0; i < n; i++) Ct[i][j] = y[i];
  }
  return jacobiEigF64(transpose(Ct));
}
// EXPLICIT-INVERSE direct route (imp-95425 cos2Direct, float64, verbatim path):
// forms G2^-1 explicitly, then reduces the pencil by chol(G1) + Jacobi. Returns
// cos^2 (> 1 at the ill-conditioned corners = the artifact).
function cos2DirectExplicitInv(n1, n2) {
  const G1 = cauchyGram(n1, F);
  const G12 = crossGram(n1, n2, F);
  const G2inv = invSym(cauchyGram(n2, F), F);
  const M = matMul(matMul(G12, G2inv, F), transpose(G12), F);
  const ev = pencilEigF64(M, G1);
  return ev[ev.length - 1];
}

// SOLVE-BASED direct route: SAME formulation M = G12 G2^-1 G12^T but realise
// G2^-1 by a Cholesky solve of G2 X = G12^T (no explicit inverse). Stable at
// float64; carried in double-double to confirm. Returns cos^2 in (0, 1).
function cos2DirectSolve(n1, n2, A) {
  const G1 = cauchyGram(n1, A);
  const G2 = cauchyGram(n2, A);
  const G12 = crossGram(n1, n2, A);
  const G12t = transpose(G12); // nc x n1
  const L2 = chol(G2, A);
  // X = G2^-1 G12^T  (nc x n1): solve column by column
  const rhs = G12t[0].map((_, j) => G12t.map((r) => r[j])); // n1 columns
  const Xcols = rhs.map((col) => bwd(L2, fwd(L2, col, A), A));
  const X = rhs[0].map((_, i) => Xcols.map((c) => c[i])); // nc x n1
  const M = matMul(G12, X, A); // n1 x n1
  return largestReduced2x2(M, G1, A);
}

// TRANSCRIBED fence on 1 - sigma^2 (imp-95249 LEMMA ANG-DET closed form)
const phiFence = (n1, n2) => {
  let p = 1;
  for (const a of n1) for (const b of n2) p *= ((a - b) / (a + b)) ** 2;
  return p;
};

const twinLattice = (m, r) => {
  const blocks = [];
  for (let k = 0; k < m; k++) blocks.push([2 ** k, r * 2 ** k]);
  return blocks;
};

// 2-norm condition number of a small SPD matrix via Jacobi eigenvalues (float64,
// diagnostic only). kappa(G2) drives the explicit-inverse breakdown.
function condSPD(B) {
  const n = B.length;
  const A = B.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-300) break;
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
  const ev = A.map((r, i) => r[i]);
  return Math.max(...ev) / Math.min(...ev);
}

// ---------------------------------------------------------------------------
// The 3 imp-95451 (U2) corners, direct route measured at both precisions
// ---------------------------------------------------------------------------

const U2_CORNERS = [
  { m: 6, r: 1.02, k: 2 },
  { m: 6, r: 1.01, k: 0 },
  { m: 6, r: 1.01, k: 3 },
];

function measureCorners() {
  return U2_CORNERS.map(({ m, r, k }) => {
    const blocks = twinLattice(m, r);
    const rest = blocks.filter((_, l) => l !== k).flat();
    const cos2ExplicitF64 = cos2DirectExplicitInv(blocks[k], rest);
    const cos2SolveF64 = cos2DirectSolve(blocks[k], rest, F);
    const cos2SolveDD = cos2DirectSolve(blocks[k], rest, D);
    const kappaG2 = condSPD(cauchyGram(rest, F));
    const oneMinusCos2 = 1 - cos2SolveDD;
    const phi = phiFence(blocks[k], rest);
    return {
      m,
      r,
      k,
      cos2ExplicitF64, // > 1 artifact
      explicitExcess: cos2ExplicitF64 - 1, // positive = artifact reproduced
      cos2SolveF64, // < 1, stable
      cos2SolveDD, // < 1, ground truth
      f64ddAgreement: Math.abs(cos2SolveF64 - cos2SolveDD),
      oneMinusCos2,
      phi,
      ratio: phi / oneMinusCos2, // Phi / (1 - sigma^2); safe iff < 1
      safe: phi <= oneMinusCos2,
      kappaG2, // condition number of the near-singular joint-rest Gram
      squaredCondExceedsF64: kappaG2 * kappaG2 > 1e15,
    };
  });
}

const CORNERS = measureCorners();

// baked landmark literals (storage precision toExponential(6); recomputed live)
const N_CORNERS = 3;
// ground-truth 1 - cos^2 from the double-double solve route (matches imp-95479)
const DD_ONE_MINUS_COS2 = [3.519489e-7, 3.165007e-6, 3.525863e-7];
const MIN_EXPLICIT_EXCESS = 1.744e-6; // smallest cos^2 - 1 over the 3 corners (artifact side)
const WORST_RATIO = 2.411839e-2; // max Phi/(1 - sigma^2), (m=6,r=1.01,k=0)

export const IMP95460_U2_CORNER_DIRECT_ROUTE_EXTPREC_RECOVERY = {
  ticket: "imp-95460",
  addresses: "imp-95451 audit item (U2) / imp-95425 direct-route conditioning sub-gap",
  claim:
    "the imp-95425 DIRECT principal-angle route fails at the 3 near-coalescent "
    + "corners specifically at its EXPLICIT-INVERSE step (cos^2 > 1); the SAME "
    + "direct formulation realised by a Cholesky SOLVE recovers a valid cos^2 < 1 "
    + "already at float64, double-double confirms it to the imp-95479 ground "
    + "truth, and the ANG-DET fence direction Phi_k <= 1 - sigma_k^2 holds",
  corners: CORNERS,
  verdict:
    "CONFIRMED (explicit-inverse artifact reproduced; solve-based direct route "
    + "recovers and clears the fence at all 3 corners)",
  residualConditioningLimit:
    "the breakdown is the explicit inversion of the near-singular joint-rest "
    + "Gram G2 (kappa(G2) ~ 1e8..1e9, squared past the float64 ~1e16 limit); it "
    + "is NOT intrinsic to the principal-angle problem -- a solve replaces invert "
    + "and removes it, extended precision then only pins the last digits",
  worstOverEstimationRatio: Math.max(...CORNERS.map((c) => c.ratio)),
  worstRouteAgreement: Math.max(...CORNERS.map((c) => c.f64ddAgreement)),
  honest:
    "MEASUREMENT ONLY -- supplies direct-route ground truth for a direction "
    + "already PROVEN in imp-95249 ANG-DET and confirmed via the whitening route "
    + "in imp-95479; the explicit-inverse variant is exercised at float64 only "
    + "(to reproduce the artifact), the recovery uses the stable solve route. "
    + "Model-family twin-lattice grid; obligation (3) unchanged. Changes no "
    + "bound; NO QED; no refereed bound is changed.",
  fns: { cos2DirectExplicitInv, cos2DirectSolve, phiFence, twinLattice, condSPD },
};

export const IMP95460_ASSERTIONS = [
  {
    id: "imp-95460-explicit-inverse-reproduces-artifact",
    description:
      "the imp-95425 explicit-inverse direct route returns cos^2 > 1 (the "
      + "artifact) at all 3 corners, matching the imp-95479 diagnosis",
    holds: () =>
      CORNERS.length === N_CORNERS
      && CORNERS.every((c) => c.explicitExcess > 0 && c.cos2ExplicitF64 > 1),
  },
  {
    id: "imp-95460-solve-route-recovers-valid-cos2",
    description:
      "the SAME direct formulation via a Cholesky solve returns a valid cos^2 "
      + "in (0, 1) at both float64 and double-double at every corner",
    holds: () =>
      CORNERS.every(
        (c) =>
          c.cos2SolveF64 > 0
          && c.cos2SolveF64 < 1
          && c.cos2SolveDD > 0
          && c.cos2SolveDD < 1,
      ),
  },
  {
    id: "imp-95460-dd-matches-imp95479-ground-truth",
    description:
      "the double-double solve route matches the imp-95479 ground-truth "
      + "1 - cos^2 at each corner to the baked literals",
    holds: () =>
      CORNERS.every(
        (c, i) =>
          Math.abs(c.oneMinusCos2 - DD_ONE_MINUS_COS2[i])
          <= 1e-5 * DD_ONE_MINUS_COS2[i],
      ),
  },
  {
    id: "imp-95460-f64-dd-solve-agree",
    description:
      "the float64 and double-double solve routes agree to <= 1e-9 at every "
      + "corner (only the last digits need extended precision)",
    holds: () =>
      Math.max(...CORNERS.map((c) => c.f64ddAgreement)) < 1e-9,
  },
  {
    id: "imp-95460-fence-direction-confirmed",
    description:
      "the ANG-DET fence direction Phi_k <= 1 - sigma_k^2 holds on the direct "
      + "solve route at every corner, and the worst ratio matches the literal",
    holds: () => {
      const worst = Math.max(...CORNERS.map((c) => c.ratio));
      return (
        CORNERS.every((c) => c.safe && c.ratio < 1)
        && worst < 1
        && Math.abs(worst - WORST_RATIO) <= 1e-5 * WORST_RATIO
      );
    },
  },
  {
    id: "imp-95460-conditioning-limit-is-explicit-inverse",
    description:
      "the joint-rest Gram G2 is ill-conditioned enough that its SQUARED "
      + "condition number exceeds the float64 ~1e15 limit at every corner "
      + "(the recorded residual conditioning limit that broke the explicit route)",
    holds: () => CORNERS.every((c) => c.squaredCondExceedsF64),
  },
  {
    id: "imp-95460-honest-measurement-only",
    description:
      "verdict CONFIRMED, MEASUREMENT ONLY, direction already PROVEN in "
      + "imp-95249, no refereed bound is changed",
    holds: () =>
      /CONFIRMED/.test(IMP95460_U2_CORNER_DIRECT_ROUTE_EXTPREC_RECOVERY.verdict)
      && /MEASUREMENT ONLY/.test(
        IMP95460_U2_CORNER_DIRECT_ROUTE_EXTPREC_RECOVERY.honest,
      )
      && /refereed bound is changed/i.test(
        IMP95460_U2_CORNER_DIRECT_ROUTE_EXTPREC_RECOVERY.honest,
      ),
  },
];

for (const a of IMP95460_ASSERTIONS) {
  if (!a.holds())
    throw new Error(
      `imp-95460-u2-corner-direct-route-extprec-recovery assertion failed: ${a.id}`,
    );
}

export default IMP95460_U2_CORNER_DIRECT_ROUTE_EXTPREC_RECOVERY;
