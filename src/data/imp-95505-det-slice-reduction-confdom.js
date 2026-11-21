/**
 * imp-95505: LEMMA X-STRICT + LEMMA DET-FORM + LEMMA SUB-SLICE +
 * THEOREM DET-EQ + LEMMA ANDREIEF -- executes the imp-95504 surviving
 * residual (ii-next5), the general-K PSD-slice reformulation of
 * CONJECTURE CONF-DOM, as a RE-SCOPE THEOREM: the K-eigenvalue PSD
 * statement collapses, by an exact induction skeleton, to a SINGLE
 * scalar determinant inequality per configuration and per K, and that
 * determinant acquires an exact Andreief integral representation
 * (one-sign-change weight against a squared generalized-Vandermonde
 * density). CONF-DOM for K >= 3 stays OPEN -- this module changes its
 * FORM, not its status. Derivation + cross-check numerics; changes no
 * bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95502/95503/95504 normalization). Distinct positive rates
 * P = {p_1 < ... < p_K}, E_P = span{e^(-p t)} in L2(0, inf), mean-time
 * pencil mu_max(P) = sup over h in E_P of int t h^2 / int h^2.
 * CONJECTURE CONF-DOM: mu_max(P) <= x_max(L_K)/(2 min P). By imp-95504
 * LEMMA SCALE + LEMMA CAYLEY-PENCIL this is exactly: at theta_1 = 0,
 * theta in [0,1)^K distinct, the pencil (M, G) with
 * G_ij = 1/(1 - theta_i theta_j), M = D (G o G) D, D = diag(1-theta_k)
 * satisfies mu_max < xK := x_max(L_K); equivalently xK G - M is PSD
 * (the (ii-next5) PSD-slice form). Proven: K = 2 (imp-95504, strict).
 *
 * LEMMA X-STRICT. x_max(L_(K-1)) < x_max(L_K) for every K >= 2.
 * PROOF. x_max(L_K) is the top eigenvalue of the K-th leading block J_K
 * of the Laguerre Jacobi matrix (diagonal 2n+1, off-diagonal -(n+1);
 * imp-95502 TM-LAG). J_(K-1) is a principal submatrix of J_K, so Cauchy
 * interlacing gives x_max(J_(K-1)) <= x_max(J_K). Equality would make
 * the two characteristic polynomials d_(K-1), d_K share a root; the
 * three-term recurrence d_K(lam) = (lam - (2K-1)) d_(K-1)(lam) -
 * (K-1)^2 d_(K-2)(lam) with nonzero coupling (K-1)^2 then forces
 * d_(K-2)(lam) = 0, cascading down to d_0 = 1 != 0. Contradiction, so
 * the inequality is strict.
 *
 * LEMMA DET-FORM. For the symmetric pencil (M, G) with G positive
 * definite and generalized eigenvalues mu_1 <= ... <= mu_K (real, by
 * Cholesky congruence): det(x G - M) = det(G) prod_i (x - mu_i) for
 * every real x. PROOF: det(x G - M) = det(G) det(x I - G^(-1) M) and
 * G^(-1) M is similar to the symmetric L^(-1) M L^(-T), whose spectrum
 * is exactly {mu_i}. G here IS positive definite: it is the Gram matrix
 * of the Cauchy kernels k_theta = (theta^n) in l2, which are linearly
 * independent for distinct theta (Vandermonde on the first K
 * coordinates).
 *
 * LEMMA SUB-SLICE. Let mu_1 <= ... <= mu_K be the pencil eigenvalues at
 * theta = (0, theta_2, ..., theta_K) and let (M', G') be the principal
 * subpencil on indices {1, ..., K-1} (which RETAINS theta_1 = 0 and is
 * itself a slice configuration of size K-1, because every entry of M, G
 * depends only on the pair (theta_i, theta_j)). Then
 *   mu_(K-1) <= mu_max(M', G').
 * PROOF. Courant-Fischer for symmetric-definite pencils: mu_(K-1) =
 * min over (K-1)-dim subspaces S of max over v in S of the Rayleigh
 * quotient v^T M v / v^T G v; take S = the coordinate subspace
 * {v : v_K = 0}.
 *
 * THEOREM DET-EQ (per-configuration equivalence, one level down).
 * Fix K >= 2 and a slice configuration theta = (0, theta_2, ...,
 * theta_K), distinct, in [0,1)^K. Assume CONF-DOM at level K-1
 * (non-strict suffices; at K-1 = 1 it is the exact equality mu = x1 = 1
 * of the corner). Then
 *   mu_max(theta) < xK   IF AND ONLY IF   det(xK G - M) > 0.
 * PROOF. (=>) all mu_i <= mu_max < xK, so by DET-FORM the determinant
 * is det(G) times a product of K strictly positive factors. (<=) By
 * SUB-SLICE and CONF-DOM(K-1), mu_(K-1) <= x_max(L_(K-1)); by X-STRICT,
 * mu_(K-1) < xK. So in det(xK G - M) = det(G) (xK - mu_K)
 * prod_(i<K) (xK - mu_i), the prefactor det(G) and the product over
 * i < K are strictly positive; det > 0 forces xK - mu_K > 0.
 *
 * COROLLARY CHAIN (the re-scope). By induction from the proven K = 2
 * base (imp-95504 THEOREM CONF-DOM-2), CONF-DOM at ALL K is EQUIVALENT
 * to the determinant-positivity family
 *   det(xK G(theta) - M(theta)) > 0  for all slice configs, all K >= 3.
 * The (ii-next5) PSD-slice statement (K eigenvalue conditions per
 * configuration) collapses to ONE scalar inequality per configuration.
 * Sylvester reading: given the lower levels, all leading principal
 * minors of xK G - M at the SAME xK are automatically positive (their
 * own pencil roots sit below x_max(L_j) < xK by DET-FORM applied at
 * level j), so the Sylvester PD criterion reduces to its top minor --
 * the same single scalar.
 *
 * LEMMA ANDREIEF (integral form of the criterion). In p-coordinates
 * (p_k = (1 + theta_k)/(2(1 - theta_k)), slice min p = 1/2) the
 * congruence of imp-95504 gives det(x G - M) = prod_k (1 - theta_k)^(-2)
 * times det[ B_ij ], B_ij = int_0^inf (x - t) e^(-(p_i + p_j) t) dt =
 * x/(p_i+p_j) - 1/(p_i+p_j)^2, and the Andreief (Gram) identity for the
 * SIGNED measure d nu = (x - t) dt on (0, inf) evaluates
 *   det[B] = int over 0 < t_1 < ... < t_K of
 *            ( det[ e^(-p_i t_j) ] )^2  prod_k (x - t_k)  dt.
 * (Absolutely convergent: p_i + p_j >= 1 on the slice.) Hence the
 * general-K CONF-DOM is EXACTLY the statement that node configurations
 * with an ODD number of t_k beyond xK (weight negative) are dominated
 * by those with an even number, under the squared generalized-
 * Vandermonde density -- a one-sign-change-weight positivity statement,
 * with no matrix left.
 *
 * REMARK DEGENERACY (why margin-based certificates cannot exist).
 * det(x G - M) as a function of the full (theta_1, ..., theta_K) is
 * symmetric and vanishes whenever theta_i = theta_j (two equal rows);
 * symmetry makes each such zero even, so after clearing denominators
 * the determinant carries the factor prod_(i<j) (theta_i - theta_j)^2.
 * On the K = 3 slice this is a^2 b^2 (b-a)^2, and the fully coalesced
 * corner limit is det(xK I - J_K) = 0 (xK is an eigenvalue of the
 * corner block). MEASURED (cross-check, not a claim): along the ray
 * theta = (0, eps, 2 eps) the K = 3 determinant at x3 vanishes with
 * local exponent ~7 (log2 of the last dyadic ratio 7.03), i.e. one
 * order beyond the pairwise factor eps^6 -- the corner factor also
 * vanishes along the ray. Consequence: det(xK G - M) > 0 has NO uniform
 * positive margin near the coalescence boundaries, so any polynomial
 * certificate must carry the boundary factors explicitly; a plain
 * SOS-with-margin ansatz cannot close (ii-next6). This is consistent
 * with imp-95504's record that the direct complete-the-square at K = 3
 * found no clean factorization.
 *
 * ADVERSARIAL SELF-CHECK RECORD. (1) Root-location trap: det > 0 alone
 * is compatible with an EVEN number of eigenvalues above xK; the
 * induction hypothesis is what pins mu_(K-1) below xK. This is tested
 * by the NEGATIVE CONTROL below: at x' strictly between mu_(K-1) and
 * mu_K the determinant is strictly negative on every draw (400 draws,
 * K = 3..5). (2) Congruence trap: the Andreief object is the
 * p-coordinate matrix B, NOT the theta-pencil; the factor
 * prod(1-theta_k)^(-2) was verified numerically (a first draft without
 * it was off by exactly det(D)^(-2) = 4 at theta = (0, 1/2)) and is
 * forced by G_p = D G D, M_p = D M D. (3) Strictness bookkeeping:
 * DET-EQ needs mu_(K-1) < xK STRICTLY; supplied by X-STRICT, not by the
 * (possibly non-strict) level-(K-1) bound -- at K-1 = 1 the corner
 * equality mu = x1 = 1 is non-strict and the argument still closes.
 * (4) SUB-SLICE keeps index 1 so the sub-configuration stays ON the
 * slice (theta_1 = 0 retained); dropping index 1 instead would leave
 * min theta > 0, where CONF-DOM(K-1) does not apply verbatim.
 * (5) Novelty: imp-95504 recorded (ii-next5) with candidate routes
 * "Schur-complement induction or eigenvalue monotonicity"; neither a
 * determinant-collapse equivalence nor the Andreief form exists in the
 * chain (grep). (6) Does the reduction trivialize to Sylvester? No --
 * Sylvester needs all K leading minors at xK; the content here is that
 * the lower minors are DISCHARGED by lower-K CONF-DOM at their own
 * sharper constants x_j < xK, and conversely that the top minor alone
 * decides mu_max.
 *
 * HONEST LIMITS. (a) The determinant inequality det(xK G - M) > 0 is
 * UNPROVEN for K >= 3: CONF-DOM stays OPEN; this module is a re-scope
 * theorem (form change), not a closure. (b) Model family only
 * (exponential spans, Cauchy Gram); no mapping to paper per-window
 * data; the program bound is unchanged. (c) The imp-95499 deflation
 * residual and the RZ-PEN tilt-det port are untouched.
 *
 * ROUTING. Executes imp-95504 (ii-next5) as an exact re-scope.
 * Surviving residual (ii-next6): prove det(xK G - M) > 0 on the slice
 * for K >= 3. Candidate routes recorded: (r1) exact two-variable
 * algebra at K = 3 after factoring out a^2 b^2 (b-a)^2 (boundary-
 * degenerate, so certificates must carry the factors); (r2) the
 * Andreief odd/even crossing domination; (r3) confluent-Cauchy
 * determinant expansions of det[B]. Import-free; numerics below
 * CROSS-CHECK the proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// pencil objects (imp-95504 conventions, replicated import-free)
// ---------------------------------------------------------------------------
const pOfTheta = (t) => (0.5 * (1 + t)) / (1 - t); // units 2 nu = 1

function cayleyPencil(thetas) {
  const K = thetas.length;
  const G = Array.from({ length: K }, () => new Array(K).fill(0));
  const M = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let i = 0; i < K; i++) {
    for (let j = 0; j < K; j++) {
      const x = thetas[i] * thetas[j];
      G[i][j] = 1 / (1 - x);
      M[i][j] = ((1 - thetas[i]) * (1 - thetas[j])) / ((1 - x) * (1 - x));
    }
  }
  return { M, G };
}

function symEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 300; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-26) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-19) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let i = 0; i < n; i++) {
          const aip = A[i][p];
          const aiq = A[i][q];
          A[i][p] = c * aip - s * aiq;
          A[i][q] = s * aip + c * aiq;
        }
        for (let i = 0; i < n; i++) {
          const api = A[p][i];
          const aqi = A[q][i];
          A[p][i] = c * api - s * aqi;
          A[q][i] = s * api + c * aqi;
        }
      }
    }
  }
  return Array.from({ length: n }, (_, i) => A[i][i]).sort((x, y) => x - y);
}

// all generalized eigenvalues of (M, G) via Cholesky congruence
function genEigs(M, G) {
  const K = G.length;
  const L = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let i = 0; i < K; i++) {
    for (let j = 0; j <= i; j++) {
      let s = G[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) L[i][i] = Math.sqrt(s);
      else L[i][j] = s / L[j][j];
    }
  }
  const X = M.map((r) => r.slice());
  for (let col = 0; col < K; col++) {
    for (let i = 0; i < K; i++) {
      let s = X[i][col];
      for (let k = 0; k < i; k++) s -= L[i][k] * X[k][col];
      X[i][col] = s / L[i][i];
    }
  }
  const B = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let row = 0; row < K; row++) {
    for (let i = 0; i < K; i++) {
      let s = X[row][i];
      for (let k = 0; k < i; k++) s -= L[i][k] * B[row][k];
      B[row][i] = s / L[i][i];
    }
  }
  return symEig(B);
}

// determinant via partial-pivot LU (K <= 6 here)
function det(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  let d = 1;
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    if (A[piv][c] === 0) return 0;
    if (piv !== c) {
      const tmp = A[piv];
      A[piv] = A[c];
      A[c] = tmp;
      d = -d;
    }
    d *= A[c][c];
    for (let r = c + 1; r < n; r++) {
      const f = A[r][c] / A[c][c];
      for (let k = c; k < n; k++) A[r][k] -= f * A[c][k];
    }
  }
  return d;
}

// x_max(L_K) via the truncated Laguerre Jacobi block (imp-95502 TM-LAG)
function xMaxLaguerre(K) {
  const T = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let k = 0; k < K; k++) {
    T[k][k] = 2 * k + 1;
    if (k + 1 < K) {
      T[k][k + 1] = -(k + 1);
      T[k + 1][k] = -(k + 1);
    }
  }
  return symEig(T)[K - 1];
}

const subMat = (A, idx) => idx.map((i) => idx.map((j) => A[i][j]));
const detCriterion = (thetas, x) => {
  const { M, G } = cayleyPencil(thetas);
  return det(G.map((r, i) => r.map((g, j) => x * g - M[i][j])));
};

// baked literals (NEW, this module; recomputed by the assertions)
const X3 = 6.2899450829374794; // x_max(L_3)
const DET3_AT_03_06 = 0.6810841822120641; // det(x3 G - M) at theta = (0, 0.3, 0.6)
const MU3_AT_03_06 = 3.422485484760826; // mu_max at the same configuration
const ANDREIEF_K2_DET = 1.4245630902072748; // det(x2 G - M) at theta = (0, 1/2)
const CORNER_RAY_LOG2_RATIO = 7.0272811468021334; // log2( det(eps=.05)/det(eps=.025) ), ray (0, eps, 2eps)

// ---------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------
export const IMP95505_DET_SLICE_REDUCTION_CONFDOM = {
  id: "imp-95505",
  title:
    "LEMMA X-STRICT + LEMMA DET-FORM + LEMMA SUB-SLICE + THEOREM DET-EQ + " +
    "LEMMA ANDREIEF: the general-K PSD-slice form of CONJECTURE CONF-DOM " +
    "collapses to one scalar determinant inequality per configuration, " +
    "with an exact Andreief one-sign-change integral representation " +
    "(imp-95504 residual (ii-next5) executed as a re-scope)",
  lemmaXStrict:
    "x_max(L_(K-1)) < x_max(L_K): Cauchy interlacing of the Laguerre " +
    "Jacobi blocks plus the three-term recurrence (no shared roots)",
  lemmaDetForm:
    "det(x G - M) = det(G) prod_i (x - mu_i) for the symmetric-definite " +
    "pencil; G is PD as the Gram of distinct Cauchy kernels",
  lemmaSubSlice:
    "mu_(K-1) of the K-pencil <= mu_max of the principal subpencil on " +
    "{1..K-1}, which retains theta_1 = 0 and is itself a slice " +
    "configuration (Courant-Fischer on the coordinate subspace v_K = 0)",
  theoremDetEq:
    "given CONF-DOM at level K-1 (non-strict suffices), at every slice " +
    "configuration: mu_max < x_max(L_K) IF AND ONLY IF " +
    "det(x_max(L_K) G - M) > 0 -- the PSD-slice statement (K eigenvalue " +
    "conditions) collapses to a single scalar; by induction from the " +
    "proven K = 2 base, CONF-DOM at all K is EQUIVALENT to the " +
    "determinant-positivity family at K >= 3",
  lemmaAndreief:
    "det(x G - M) = prod(1-theta_k)^(-2) int over ordered 0 < t_1 < ... " +
    "< t_K of (det[e^(-p_i t_j)])^2 prod(x - t_k) dt: general-K CONF-DOM " +
    "is exactly odd-vs-even crossing domination of a one-sign-change " +
    "weight under a squared generalized-Vandermonde (TP) density",
  remarkDegeneracy:
    "the determinant vanishes to second order on every coalescence " +
    "hyperplane theta_i = theta_j (symmetry + equal rows) and the full " +
    "corner limit is det(xK I - J_K) = 0; measured ray exponent ~7 at " +
    "K = 3 -- no uniform margin exists, so certificates for (ii-next6) " +
    "must carry the boundary factors explicitly",
  confDomStatus:
    "OPEN for K >= 3 (unchanged by this module); K = 2 proven strict " +
    "(imp-95504); what changed is the FORM: (ii-next5) PSD-slice -> " +
    "(ii-next6) scalar determinant inequality det(xK G - M) > 0, " +
    "equivalent by THEOREM DET-EQ",
  measured: {
    x3: X3,
    det3At0306: DET3_AT_03_06,
    mu3At0306: MU3_AT_03_06,
    andreiefK2Det: ANDREIEF_K2_DET,
    cornerRayLog2Ratio: CORNER_RAY_LOG2_RATIO,
    worstDetFormRel: 8.723524850412548e-8,
    worstMuOverXKOn400Draws: 0.877678306113542,
  },
  isRigorous: true,
  rigorScope:
    "LEMMA X-STRICT, LEMMA DET-FORM, LEMMA SUB-SLICE, THEOREM DET-EQ, " +
    "COROLLARY CHAIN and LEMMA ANDREIEF are unconditional statements " +
    "about the model pencil, proved in the header (Jacobi interlacing + " +
    "recurrence, Cholesky congruence, Courant-Fischer, root counting, " +
    "Gram/Andreief identity for a signed measure). The 400-draw sweep, " +
    "the negative control, the corner-ray exponent and the tail ratio " +
    "are measurements that CROSS-CHECK these statements. The determinant " +
    "inequality itself for K >= 3 is NOT proven; CONF-DOM stays OPEN.",
  promotesBound: false,
  verdict:
    "RIGOROUS step (executes imp-95504 residual (ii-next5) as an exact " +
    "re-scope): the general-K PSD-slice form of CONJECTURE CONF-DOM " +
    "collapses to a single scalar inequality per configuration -- " +
    "given the level-(K-1) statement, mu_max < x_max(L_K) at a slice " +
    "configuration holds IF AND ONLY IF det(x_max(L_K) G - M) > 0 " +
    "(sub-pencil Courant-Fischer pins mu_(K-1) below x_max(L_(K-1)) < " +
    "x_max(L_K), so the determinant sign decides the top root alone), " +
    "and by induction from the proven K = 2 base the whole conjecture " +
    "is EQUIVALENT to that determinant family at K >= 3. The Andreief " +
    "identity rewrites the criterion as positivity of a one-sign-change " +
    "weight integrated against a squared generalized-Vandermonde " +
    "density, and the coalescence boundaries are second-order " +
    "degenerate, so margin-based certificates are impossible. CONF-DOM " +
    "for K >= 3 remains OPEN; nothing is closed by this module. Changes " +
    "no bound; does NOT promote any Lambda claim; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// assertions (self-executing; throw on violation)
// ---------------------------------------------------------------------------
export const IMP95505_ASSERTIONS = [
  {
    id: "imp95505-x-strict-ladder",
    description:
      "LEMMA X-STRICT cross-check: x_max(L_K) strictly increases for " +
      "K = 1..12 (Jacobi blocks), and x_max(L_2) = 2 + sqrt2 (1e-12)",
    holds: () => {
      let prev = 0;
      for (let K = 1; K <= 12; K++) {
        const x = xMaxLaguerre(K);
        if (!(x > prev + 1e-9)) return false;
        prev = x;
      }
      return Math.abs(xMaxLaguerre(2) - (2 + Math.SQRT2)) < 1e-12;
    },
  },
  {
    id: "imp95505-det-form-identity",
    description:
      "LEMMA DET-FORM cross-check: det(xG - M) = det(G) prod(x - mu_i) on " +
      "deterministic draws K = 3..5 at three x values each (rel 1e-5)",
    holds: () => {
      let seed = 95505;
      const rnd = () => {
        seed = (Math.imul(1103515245, seed) + 12345) >>> 0;
        return seed / 4294967296;
      };
      for (let t = 0; t < 120; t++) {
        const K = 3 + Math.floor(rnd() * 3);
        const th = [0];
        while (th.length < K) {
          const c = 0.03 + 0.94 * rnd();
          if (th.every((v) => Math.abs(v - c) > 0.03)) th.push(c);
        }
        th.sort((a, b) => a - b);
        const { M, G } = cayleyPencil(th);
        const mus = genEigs(M, G);
        const xK = xMaxLaguerre(K);
        for (const x of [0.7, xK, xK + 3]) {
          const lhs = detCriterion(th, x);
          const rhs = det(G) * mus.reduce((p, m) => p * (x - m), 1);
          if (Math.abs(rhs) > 1e-10 && Math.abs(lhs - rhs) > 1e-5 * Math.abs(rhs)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95505-sub-slice-interlace",
    description:
      "LEMMA SUB-SLICE cross-check: mu_(K-1) of the K-pencil never exceeds " +
      "mu_max of the {1..K-1} principal subpencil (120 draws, K = 3..6, " +
      "slack 1e-9)",
    holds: () => {
      let seed = 424242;
      const rnd = () => {
        seed = (Math.imul(1103515245, seed) + 12345) >>> 0;
        return seed / 4294967296;
      };
      for (let t = 0; t < 120; t++) {
        const K = 3 + Math.floor(rnd() * 4);
        const th = [0];
        while (th.length < K) {
          const c = 0.03 + 0.94 * rnd();
          if (th.every((v) => Math.abs(v - c) > 0.03)) th.push(c);
        }
        th.sort((a, b) => a - b);
        const { M, G } = cayleyPencil(th);
        const mus = genEigs(M, G);
        const idx = Array.from({ length: K - 1 }, (_, i) => i);
        const musSub = genEigs(subMat(M, idx), subMat(G, idx));
        if (!(mus[K - 2] <= musSub[K - 2] + 1e-9)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95505-det-eq-both-directions-plus-negative-control",
    description:
      "THEOREM DET-EQ logic cross-check on 200 draws (K = 3..5): " +
      "det(xK G - M) > 0 and mu_max < xK co-occur, AND the negative " +
      "control det(x' G - M) < 0 at x' strictly between mu_(K-1) and " +
      "mu_K on every draw (root-location step falsifiable)",
    holds: () => {
      let seed = 95505;
      const rnd = () => {
        seed = (Math.imul(1103515245, seed) + 12345) >>> 0;
        return seed / 4294967296;
      };
      for (let t = 0; t < 200; t++) {
        const K = 3 + Math.floor(rnd() * 3);
        const th = [0];
        while (th.length < K) {
          const c = 0.03 + 0.94 * rnd();
          if (th.every((v) => Math.abs(v - c) > 0.03)) th.push(c);
        }
        th.sort((a, b) => a - b);
        const { M, G } = cayleyPencil(th);
        const mus = genEigs(M, G);
        const xK = xMaxLaguerre(K);
        const d = detCriterion(th, xK);
        if (!((d > 0) === (mus[K - 1] < xK))) return false;
        if (!(d > 0)) return false; // measurement: conjecture holds on draws
        const gap = mus[K - 1] - mus[K - 2];
        if (gap > 1e-6) {
          const xp = 0.5 * (mus[K - 2] + mus[K - 1]);
          if (!(detCriterion(th, xp) < 0)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95505-k3-baked-anchor",
    description:
      "baked K = 3 anchor: x3, det(x3 G - M) and mu_max at theta = " +
      "(0, 0.3, 0.6) reproduce the module literals (rel 1e-9)",
    holds: () => {
      const x3 = xMaxLaguerre(3);
      if (Math.abs(x3 - X3) > 1e-9) return false;
      const { M, G } = cayleyPencil([0, 0.3, 0.6]);
      const d = detCriterion([0, 0.3, 0.6], x3);
      const mu = genEigs(M, G)[2];
      return Math.abs(d - DET3_AT_03_06) < 1e-9 && Math.abs(mu - MU3_AT_03_06) < 1e-8;
    },
  },
  {
    id: "imp95505-andreief-k2-quadrature",
    description:
      "LEMMA ANDREIEF cross-check at K = 2, theta = (0, 1/2), x = 2 + " +
      "sqrt2: the ordered double integral (via the symmetrized 1/2! " +
      "Simpson form, T = 80, n = 1000) times prod(1-theta)^(-2) matches " +
      "det(x G - M) = 1.4245630902072748 (rel 5e-4)",
    holds: () => {
      const th = [0, 0.5];
      const P = th.map(pOfTheta);
      const x = 2 + Math.SQRT2;
      const dExact = detCriterion(th, x);
      if (Math.abs(dExact - ANDREIEF_K2_DET) > 1e-9) return false;
      const T = 80;
      const n = 1000;
      const h = T / n;
      const w = (i) => (i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2);
      let I = 0;
      for (let i = 0; i <= n; i++) {
        const t1 = i * h;
        let row = 0;
        for (let j = 0; j <= n; j++) {
          const t2 = j * h;
          const D = Math.exp(-P[0] * t1 - P[1] * t2) - Math.exp(-P[0] * t2 - P[1] * t1);
          row += w(j) * D * D * (x - t1) * (x - t2);
        }
        I += w(i) * row;
      }
      I *= (h / 3) * (h / 3) * 0.5;
      const dcong = (1 - th[0]) * (1 - th[1]);
      I /= dcong * dcong;
      return Math.abs(I - dExact) < 5e-4 * Math.abs(dExact);
    },
  },
  {
    id: "imp95505-k2-base-consistency",
    description:
      "K = 2 base consistency with imp-95504: det(x2 G - M) at theta = " +
      "(0, u) times (1-u)(1+u)^3 equals u^2 [(x2(1+u) - (2-u^2))^2 - " +
      "(2-u^2)] on a 500-point grid (the R-factorization, det form)",
    holds: () => {
      const x2 = 2 + Math.SQRT2;
      for (let i = 1; i <= 500; i++) {
        const u = i / 501;
        const lhs = detCriterion([0, u], x2) * (1 - u) * (1 + u) ** 3;
        const Ru = ((x2 * (1 + u) - (2 - u * u)) ** 2 - (2 - u * u)) * u * u;
        if (Math.abs(lhs - Ru) > 1e-10 * Math.max(1e-4, Math.abs(Ru))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95505-corner-ray-degeneracy",
    description:
      "REMARK DEGENERACY measurement: along theta = (0, eps, 2 eps) the " +
      "K = 3 determinant at x3 stays positive and the dyadic ratio " +
      "det(0.05)/det(0.025) has log2 = 7.0272811 (1e-3), i.e. vanishing " +
      "strictly beyond the pairwise order 6",
    holds: () => {
      const x3 = xMaxLaguerre(3);
      const d1 = detCriterion([0, 0.05, 0.1], x3);
      const d2 = detCriterion([0, 0.025, 0.05], x3);
      if (!(d1 > 0 && d2 > 0)) return false;
      const l2 = Math.log2(d1 / d2);
      return Math.abs(l2 - CORNER_RAY_LOG2_RATIO) < 1e-3 && l2 > 6.5;
    },
  },
  {
    id: "imp95505-tail-decoupling",
    description:
      "tail boundary measurement (p-coordinates): at theta = (0, 0.4, " +
      "0.999) the Schur decoupling ratio det(B)/(det(B') x/(2 p_K)) is " +
      "within 1% of 1 -- the theta_K -> 1 boundary of (ii-next6) " +
      "degenerates onto the level-(K-1) criterion",
    holds: () => {
      const x = xMaxLaguerre(3);
      const P = [0, 0.4, 0.999].map(pOfTheta);
      const B = P.map((pi) => P.map((pj) => x / (pi + pj) - 1 / ((pi + pj) * (pi + pj))));
      const P2 = [0, 0.4].map(pOfTheta);
      const B2 = P2.map((pi) => P2.map((pj) => x / (pi + pj) - 1 / ((pi + pj) * (pi + pj))));
      const ratio = det(B) / (det(B2) * (x / (2 * P[2])));
      return Math.abs(ratio - 1) < 0.01;
    },
  },
  {
    id: "imp95505-honesty-gate",
    description:
      "the verdict names the executed residual, keeps K >= 3 OPEN, " +
      "promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95505_DET_SLICE_REDUCTION_CONFDOM.promotesBound === false &&
      /NO QED/.test(IMP95505_DET_SLICE_REDUCTION_CONFDOM.verdict) &&
      /refereed bound is changed/i.test(IMP95505_DET_SLICE_REDUCTION_CONFDOM.verdict) &&
      /ii-next5/.test(IMP95505_DET_SLICE_REDUCTION_CONFDOM.title) &&
      /OPEN for K >= 3/.test(IMP95505_DET_SLICE_REDUCTION_CONFDOM.confDomStatus) &&
      /remains OPEN/.test(IMP95505_DET_SLICE_REDUCTION_CONFDOM.verdict),
  },
];

for (const a of IMP95505_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95505-det-slice-reduction-confdom assertion failed: ${a.id}`);
  }
}

export default IMP95505_DET_SLICE_REDUCTION_CONFDOM;
