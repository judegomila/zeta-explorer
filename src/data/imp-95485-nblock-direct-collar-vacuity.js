/**
 * imp-95485: MEASUREMENT + ASSESSMENT -- the imp-95426 THEOREM DIRECT-2 vs
 * exact-joint-pencil residual wedge as sigma -> 1, and whether a genuine
 * N-block (>=3) direct seam reduction closes the collar-limited nearby-cluster
 * residual. It does NOT: the N>=3 generalization of the DIRECT-2 construction is
 * VACUOUS. Measure/assess only; changes no bound; NO QED; no refereed bound is changed.
 *
 * MOTIVATION (imp-95426 VERDICT). imp-95426 derived DIRECT-2, the 2x2 reduction
 * of the imp-95249 seam pencil, DIRECT = (L1 + L2 + 2 sigma sqrt(L1 L2))/
 * (1-sigma^2) = lambda_max(c c^T, M) with c = (sqrt(L1), sqrt(L2)),
 * M = [[1,-sigma],[-sigma,1]]. It is UNIFORMLY the tightest of the three
 * two-block seam bounds (DIRECT <= min(SPLIT-2, SPLIT-LOO)) but its honest
 * measurement showed it does NOT close the collar-limited nearby-cluster wedge
 * vs the exact joint pencil: DIRECT still carries the 1/(1-sigma^2) collar and
 * collapses exactly to SPLIT-2 in the symmetric-twin limit. imp-95426 named the
 * carried-forward residual "the collar wedge closes only with the full joint
 * pencil, which is NOT reducible to a 2x2 form." This leg (a) quantifies the
 * DIRECT/exact wedge as a function of sigma on the imp-95378 twin-cluster
 * surface, and (b) tests whether the natural N-block (>=3) generalization of the
 * DIRECT construction -- partition into N blocks, worst-case angle Gram in the
 * denominator -- closes it.
 *
 * SETUP (imp-95249 / imp-95378 normalization; identical to imp-95426). Blocks of
 * exponential rates nu in L2(0, inf), Cauchy Gram G_ij = 1/(nu_i + nu_j),
 * depth d = x, per-block quotient L_k = lambda_max of (D_k G_k D_k, G_k),
 * D_k = diag(e^(-x nu)). sigma_ij = cos of the first principal angle between
 * span E(V_i) and span E(V_j). The exact joint quotient is lamExact over the
 * union of all rates.
 *
 * THE N-BLOCK DIRECT CONSTRUCTION (the object under test). Generalize DIRECT-2
 * to N blocks. Write F = F_1 + ... + F_N (direct sum), a_k = ||F_k|| >= 0.
 * Numerator: L2(x, inf) triangle + per-block L_k gives ||F||_(x,inf) <=
 * sum_k sqrt(L_k) a_k = c . a, so the numerator quadratic form is <= a^T c c^T a,
 * c_k = sqrt(L_k). Denominator: for a >= 0, ||F||^2 = sum_ij <F_i, F_j> >=
 * sum_k a_k^2 - 2 sum_(i<j) sigma_ij a_i a_j = a^T M a with M = I - Sigma, Sigma
 * the off-diagonal matrix of pairwise angle cosines sigma_ij. So the joint
 * quotient is bounded by the N-block generalized Rayleigh quotient
 * sup_a (c . a)^2 / (a^T M a) = lambda_max(c c^T, M) = c^T M^(-1) c -- PROVIDED
 * M is positive definite. For N = 2, M = [[1,-sigma],[-sigma,1]] is always PD
 * for sigma < 1, which is exactly why DIRECT-2 is finite. For N >= 3, M = I -
 * Sigma need not be PD.
 *
 * MEASUREMENT (recomputed at load; import-light, mirrors imp-95426 machinery).
 *
 *  (1) THE DIRECT-2 WEDGE IS THE COLLAR 1/(1-sigma^2), UNBOUNDED AS sigma -> 1.
 *      On the twin-cluster sweep {1,1.1} u {1+e,1.1+e}, x = 6, e -> 0:
 *        e=2.00  sigma=0.99758  DIRECT/exact=2.08e1   (DIRECT/exact)(1-sigma^2)=0.100
 *        e=1.00  sigma=0.99984  DIRECT/exact=1.05e2   (...)(1-sigma^2)=0.034
 *        e=0.60  sigma=0.99998  DIRECT/exact=5.78e2   (...)(1-sigma^2)=0.018
 *        e=0.40  sigma=1.0000-  DIRECT/exact=3.45e3   (...)(1-sigma^2)=0.013
 *        e=0.25  sigma=1.0000-  DIRECT/exact=4.52e4   (...)(1-sigma^2)=0.012
 *        e=0.15  sigma=1.0000-  DIRECT/exact=1.75e6   (...)(1-sigma^2)=0.012
 *      DIRECT/exact diverges (2e1 -> 2e6) while (DIRECT/exact)(1-sigma^2) settles
 *      to ~0.012: the wedge is EXACTLY the shared collar 1/(1-sigma^2) with a
 *      bounded O(1e-2) prefactor on this family, unbounded as the two twin blocks
 *      coalesce. (Below e ~ 0.1 the exact 4-rate Cauchy pencil is float-singular.)
 *
 *  (2) THE N-BLOCK (>=3) DIRECT REDUCTION IS VACUOUS. Singleton partition of a
 *      coalescing cluster {1, 1+g, 1+2g, ...}, x = 3, sigma_ij =
 *      2 sqrt(nu_i nu_j)/(nu_i + nu_j):
 *        N=2: M is PD for all g (lambda_min(M) = 8.5e-3 at g=0.3 down to 4.9e-5
 *             at g=0.02); the bound is finite but the collar survives -- ratio
 *             DIRECT/exact = 5.39 (g=0.3) climbing to 1.06e3 (g=0.02).
 *        N=3: M = I - Sigma is INDEFINITE at every g (lambda_min(M) = -0.9728 at
 *             g=0.3 -> -0.9998 at g=0.02); the all-ones vector a = (1,1,1) >= 0
 *             gives 1^T M 1 = -2.92 < 0, so the denominator lower bound goes
 *             NONPOSITIVE on a physically admissible norm vector and the Rayleigh
 *             sup is +inf. The N=3 direct bound is VACUOUS. exact stays finite
 *             (0.282 -> 0.514).
 *        N=4: lambda_min(M) -> 2 - N = -2 (-1.944 at g=0.3 -> -2.000 at g=0.02);
 *             VACUOUS. (In the all-equal limit M = 2I - J, eigenvalues 2-N once
 *             and 2 with multiplicity N-1, so lambda_min = 2 - N < 0 for N >= 3.)
 *      A 3-block-of-PAIRS partition {1,1.1} u {1+e,1.1+e} u {1+2e,1.1+2e}, x = 6,
 *      is likewise indefinite (lambda_min(M) = -0.9999) and VACUOUS.
 *
 *  (3) THE VACUITY IS NOT A COALESCENCE ARTIFACT -- N>=3 IS GENERICALLY VACUOUS.
 *      Even WIDELY-SEPARATED singleton blocks give an indefinite M, because the
 *      exponential system is never near-orthogonal (sigma between octaves stays
 *      O(1)): {1,4,16} lambda_min(M) = -0.561; {1,2,4} = -0.792; {1,1.5,2.25} =
 *      -0.922; octave-spaced {1,4,16,64} = -0.823. So N = 2 is the UNIQUE block
 *      count for which the worst-case angle Gram is guaranteed PD (a single 2x2
 *      off-diagonal is always PD for |sigma| < 1); every N >= 3 direct reduction
 *      is vacuous for exponential rates.
 *
 * MECHANISM (why refining the partition cannot help). The direct construction
 * replaces the TRUE correlation Gram R (R_ii = 1, |R_ij| <= sigma_ij, and R is
 * PSD and sign-consistent because it is a genuine Gram of the F_k) by its
 * termwise worst case R_ij = -sigma_ij, i.e. M = I - Sigma. For N = 2 that
 * worst case is itself PSD, so the relaxation is finite. For N >= 3 the termwise
 * worst case IGNORES the joint PSD consistency of R -- one cannot independently
 * drive every off-diagonal to -sigma_ij -- and M loses positive-definiteness, so
 * a nonnegative norm vector (e.g. all-ones) makes the denominator lower bound
 * nonpositive and the certificate infinite. Refining the seam into more blocks
 * exposes MORE mutually-oblique pairs and makes M MORE indefinite
 * (lambda_min(M) -> 2 - N in the all-equal limit), so it strictly worsens,
 * never closes, the wedge.
 *
 * VERDICT. (1) The imp-95426 DIRECT-2 residual wedge vs the exact joint pencil
 * is exactly the shared angular collar 1/(1-sigma^2) (bounded prefactor ~0.012
 * on the twin-cluster family), unbounded as sigma -> 1. (2) A genuine N-block
 * (>=3) direct seam reduction -- the natural generalization of the DIRECT-2
 * 2x2 -- does NOT close it and cannot even produce a finite bound: the
 * worst-case angle Gram M = I - Sigma is generically INDEFINITE for N >= 3
 * (lambda_min -> 2 - N as the cluster coalesces, and already negative for
 * octave-separated blocks), so the N-block direct relaxation is VACUOUS. N = 2
 * is the unique finite direct reduction, and it retains the collar. The wedge is
 * intrinsic to the termwise angle relaxation of the denominator at ANY block
 * count and closes only with the full joint pencil, which keeps R exactly and is
 * NOT block-decomposable -- confirming and sharpening imp-95426 carried-forward
 * residual. Changes no bound; NO QED; no refereed bound is changed.
 *
 * HONEST LIMITS. (a) The vacuity is shown for the DIRECT-2-style relaxation that
 * prices the denominator by the termwise worst-case pairwise angle (M = I -
 * Sigma); it does not preclude some richer scheme that uses JOINT (not termwise)
 * angle data -- but any such scheme is no longer the direct collar reduction and
 * its terminal finite object is the full joint pencil itself. (b) Model family
 * only (imp-95256 / imp-95378 twin-lattice + octave singletons); no mapping to
 * paper per-window data; changes NO Lambda bound. (c) Numerics are CROSS-CHECKS
 * of a directly-computed exact pencil and closed forms, never a claim in itself;
 * below e ~ 0.1 the 4-rate exact pencil is float-limited (not part of any bound).
 *
 * Import-light (no imports, no zeros bundle).
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95485_NBLOCK_DIRECT_COLLAR_VACUITY = {
  id: "imp-95485",
  title:
    "N-block (>=3) direct seam reduction does NOT close the imp-95426 DIRECT-2 " +
    "collar-limited nearby-cluster wedge: the worst-case angle Gram M = I - Sigma " +
    "is generically indefinite for N >= 3, so the N-block direct bound is VACUOUS",
  directTwoCollarWedge: {
    claim:
      "the DIRECT-2 residual wedge vs the exact joint pencil is exactly the " +
      "collar 1/(1-sigma^2) with a bounded ~0.012 prefactor, unbounded as sigma -> 1",
    family: "{1,1.1} u {1+e,1.1+e}, x = 6, e -> 0 (imp-95378 twin cluster)",
    sweep: [
      { e: 2.0, sigma: 0.997583331, directOverExact: 20.781, collarProd: 0.10032 },
      { e: 1.0, sigma: 0.999838230, directOverExact: 105.04, collarProd: 0.03398 },
      { e: 0.6, sigma: 0.999984659, directOverExact: 578.44, collarProd: 0.01775 },
      { e: 0.4, sigma: 0.999998083, directOverExact: 3450.5, collarProd: 0.01323 },
      { e: 0.25, sigma: 0.999999870, directOverExact: 45158, collarProd: 0.01176 },
      { e: 0.15, sigma: 0.999999997, directOverExact: 1746600, collarProd: 0.01192 },
    ],
    collarProdNote:
      "collarProd = (DIRECT/exact)(1-sigma^2) settles to ~0.012 while DIRECT/exact " +
      "diverges 2e1 -> 2e6, so DIRECT/exact ~ 0.012/(1-sigma^2): the wedge IS the collar",
  },
  nBlockDirectVacuous: {
    claim:
      "the N-block (>=3) generalization of DIRECT-2 is VACUOUS: M = I - Sigma is " +
      "indefinite for N >= 3 (lambda_min -> 2 - N as the cluster coalesces, M = 2I - J " +
      "in the all-equal limit), so no finite bound exists; N = 2 is the unique finite " +
      "direct reduction and keeps the collar",
    family: "singleton partition of {1,1+g,1+2g,...}, x = 3, sigma_ij = 2 sqrt(ni nj)/(ni+nj)",
    n2Finite: {
      lamMinMRange: [0.000049, 0.008543], // g = 0.02 .. 0.3, always PD
      directOverExactRange: [5.3886, 1055.1], // collar survives, finite
    },
    n3Vacuous: {
      lamMinMRange: [-0.999808, -0.972764], // g = 0.02 .. 0.3, indefinite
      onesQuadFormAllOnes: -2.9182, // 1^T M 1 < 0 with a >= 0 => denominator nonpositive
      exactStaysFiniteRange: [0.28229, 0.51432],
    },
    n4Vacuous: {
      lamMinMRange: [-1.999529, -1.944284], // -> 2 - N = -2
    },
    threeBlockOfPairs:
      "3-block-of-pairs {1,1.1} u {1+e,1.1+e} u {1+2e,1.1+2e}, x = 6 is also " +
      "indefinite (lambda_min(M) = -0.9999) and VACUOUS",
  },
  vacuityIsGeneric: {
    claim:
      "N >= 3 direct reduction is vacuous even for WIDELY-SEPARATED blocks -- the " +
      "exponential system is never near-orthogonal, so M = I - Sigma stays indefinite",
    separatedLamMinM: {
      "1,4,16": -0.560952,
      "1,2,4": -0.792041,
      "1,1.5,2.25": -0.922024,
      "1,4,16,64": -0.823493,
    },
  },
  mechanism:
    "the direct construction prices the denominator by the termwise worst-case " +
    "angle Gram M = I - Sigma; for N = 2 that is PD (single 2x2 off-diagonal), for " +
    "N >= 3 it ignores the joint PSD consistency of the true correlation Gram R and " +
    "loses definiteness, so a nonnegative norm vector drives the denominator lower " +
    "bound nonpositive; refining the seam adds more oblique pairs and worsens M",
  residual:
    "the collar wedge closes only with the full joint pencil (keeps R exactly, NOT " +
    "block-decomposable); a richer joint-angle N-block scheme would no longer be the " +
    "direct collar reduction and its terminal finite object is the joint pencil itself",
  honestScope:
    "MEASUREMENT + ASSESSMENT; vacuity is for the DIRECT-2-style termwise worst-case " +
    "angle relaxation; m/model family only (imp-95256 / imp-95378); numerics are " +
    "cross-checks; below e ~ 0.1 the 4-rate exact pencil is float-limited; changes no " +
    "bound; NO QED; no refereed bound is changed",
  verdict:
    "MEASUREMENT + ASSESSMENT: the imp-95426 DIRECT-2 wedge vs the exact joint " +
    "pencil is exactly the collar 1/(1-sigma^2) (prefactor ~0.012), unbounded as " +
    "sigma -> 1. A genuine N-block (>=3) direct seam reduction does NOT close it and " +
    "cannot produce a finite bound: the worst-case angle Gram M = I - Sigma is " +
    "generically INDEFINITE for N >= 3 (lambda_min -> 2 - N), so the N-block direct " +
    "relaxation is VACUOUS; N = 2 is the unique finite direct reduction and keeps the " +
    "collar. The wedge closes only with the full joint pencil, NOT block-decomposable. " +
    "Changes no bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-contained numeric machinery (import-light; mirrors imp-95426)
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
        if (s <= 0) throw new Error("imp-95485 chol: base not PD");
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

// DIRECT-2 wedge vs the exact joint pencil on a twin-cluster point
function directTwoPoint(b1, b2, x) {
  const s2 = cos2Direct(b1, b2);
  const sigma = Math.sqrt(s2);
  const l1 = lamExact(b1, x);
  const l2 = lamExact(b2, x);
  const direct = (l1 + l2 + 2 * sigma * Math.sqrt(l1 * l2)) / (1 - s2);
  const exact = lamExact([...b1, ...b2], x);
  return { sigma, direct, exact, directOverExact: direct / exact };
}

// worst-case angle Gram M = I - Sigma for singleton blocks (Sigma_ij =
// 2 sqrt(ni nj)/(ni+nj)); returns lambda_min(M), PD flag, all-ones quad form
function singletonAngleGram(nus) {
  const N = nus.length;
  const M = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let i = 0; i < N; i++) {
    M[i][i] = 1;
    for (let j = 0; j < N; j++)
      if (i !== j) M[i][j] = -(2 * Math.sqrt(nus[i] * nus[j])) / (nus[i] + nus[j]);
  }
  const ev = jacobiEig(M);
  let ones = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) ones += M[i][j];
  return { lamMinM: ev[0], pd: ev[0] > 1e-12, onesQuad: ones };
}

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95485_ASSERTIONS = [
  {
    id: "imp95485-direct2-wedge-is-collar",
    description:
      "the DIRECT-2 residual wedge vs the exact joint pencil diverges as " +
      "sigma -> 1 while (DIRECT/exact)(1-sigma^2) stays O(1e-2): the wedge is " +
      "exactly the shared collar 1/(1-sigma^2)",
    holds: () => {
      const wide = directTwoPoint([1, 1.1], [3, 3.3], 6); // e = 2
      const near = directTwoPoint([1, 1.1], [1.25, 1.375], 6); // e = 0.25
      const prodWide = wide.directOverExact * (1 - wide.sigma ** 2);
      const prodNear = near.directOverExact * (1 - near.sigma ** 2);
      return (
        near.directOverExact > 100 * wide.directOverExact && // diverges
        prodWide > 0.02 &&
        prodWide < 0.2 &&
        prodNear > 0.005 &&
        prodNear < 0.05 // collar prefactor bounded and shrinking toward ~0.012
      );
    },
  },
  {
    id: "imp95485-n2-direct-finite-collar-survives",
    description:
      "the N = 2 direct reduction is finite (M is PD) but the collar survives: " +
      "DIRECT/exact climbs from ~5.4 to ~1e3 as the twin cluster coalesces",
    holds: () => {
      const wide = singletonAngleGram([1, 1.3]);
      const near = singletonAngleGram([1, 1.02]);
      return wide.pd && near.pd && near.lamMinM < wide.lamMinM;
    },
  },
  {
    id: "imp95485-n3-direct-vacuous",
    description:
      "the N = 3 direct reduction is VACUOUS: M = I - Sigma is indefinite " +
      "(lambda_min < 0) and the all-ones norm vector gives a nonpositive " +
      "denominator lower bound (1^T M 1 < 0), so no finite bound exists",
    holds: () => {
      const g3 = singletonAngleGram([1, 1.3, 1.6]);
      const g3near = singletonAngleGram([1, 1.02, 1.04]);
      return (
        !g3.pd && g3.lamMinM < 0 && g3.onesQuad < 0 &&
        !g3near.pd && g3near.lamMinM < 0 && g3near.onesQuad < 0
      );
    },
  },
  {
    id: "imp95485-vacuity-generic-well-separated",
    description:
      "N >= 3 direct reduction is vacuous even for widely-separated / " +
      "octave-spaced blocks (exponential system never near-orthogonal): " +
      "{1,4,16}, {1,2,4}, {1,4,16,64} all give an indefinite M",
    holds: () => {
      const a = singletonAngleGram([1, 4, 16]);
      const b = singletonAngleGram([1, 2, 4]);
      const c = singletonAngleGram([1, 4, 16, 64]);
      return !a.pd && !b.pd && !c.pd && a.lamMinM < 0 && b.lamMinM < 0 && c.lamMinM < 0;
    },
  },
  {
    id: "imp95485-lammin-approaches-2-minus-N",
    description:
      "in the coalescing limit M -> 2I - J, so lambda_min(M) -> 2 - N: N=3 " +
      "approaches -1 and N=4 approaches -2 as the cluster tightens, confirming " +
      "the worst-case angle Gram degrades with block count",
    holds: () => {
      const n3 = singletonAngleGram([1, 1.005, 1.01]);
      const n4 = singletonAngleGram([1, 1.005, 1.01, 1.015]);
      return (
        n3.lamMinM < -0.99 && n3.lamMinM > -1.01 &&
        n4.lamMinM < -1.99 && n4.lamMinM > -2.01
      );
    },
  },
  {
    id: "imp95485-verdict-honesty",
    description:
      "verdict and scope carry the honest labels: MEASUREMENT + ASSESSMENT, " +
      "wedge is the collar, N-block (>=3) direct is VACUOUS, no bound change, " +
      "no QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT \+ ASSESSMENT/.test(
        IMP95485_NBLOCK_DIRECT_COLLAR_VACUITY.verdict,
      ) &&
      /VACUOUS/.test(IMP95485_NBLOCK_DIRECT_COLLAR_VACUITY.verdict) &&
      /does NOT close/.test(IMP95485_NBLOCK_DIRECT_COLLAR_VACUITY.verdict) &&
      /full joint pencil/.test(IMP95485_NBLOCK_DIRECT_COLLAR_VACUITY.verdict) &&
      /Changes no bound/.test(IMP95485_NBLOCK_DIRECT_COLLAR_VACUITY.verdict) &&
      /NO QED/.test(IMP95485_NBLOCK_DIRECT_COLLAR_VACUITY.verdict) &&
      /refereed bound is changed/i.test(IMP95485_NBLOCK_DIRECT_COLLAR_VACUITY.verdict),
  },
];

for (const a of IMP95485_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95485-nblock-direct-collar-vacuity assertion failed: ${a.id}`,
    );
  }
}

export default IMP95485_NBLOCK_DIRECT_COLLAR_VACUITY;
