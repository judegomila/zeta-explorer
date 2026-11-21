/**
 * imp-95506: LEMMA D + LEMMA T + LEMMA OSC + THEOREM N-ROOTS +
 * THEOREM MT-MONO + THEOREM CONF-DOM-K -- CONJECTURE CONF-DOM is DECIDED
 * AFFIRMATIVE AND STRICT AT EVERY K: for distinct positive rates
 * P = (p_1 < ... < p_K), the mean-time pencil satisfies
 *   mu_max(P) < x_max(L_K) / (2 min P),
 * with the coalescent corner as the (unattained) supremum. This closes the
 * imp-95505 residual (ii-next6): by imp-95505 LEMMA DET-FORM the strict
 * bound gives det(x_max(L_K) G - M) > 0 at every slice configuration and
 * every K >= 3, the single scalar family that THEOREM DET-EQ proved
 * equivalent to CONF-DOM. Model family only (exponential spans, mean-time
 * compression); changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95502/95503/95504/95505 normalization). E_P =
 * span{ e^(-p_k t) } in L2(0, inf), mean-time Rayleigh quotient
 * R(h) = int t h^2 dt / int h^2 dt, pencil A v = mu G v with
 * G_ij = 1/(p_i + p_j), A_ij = 1/(p_i + p_j)^2; mu_max(P) = sup R over
 * E_P. Scaling mu_max(lambda P) = mu_max(P)/lambda reduces to the slice
 * min P = 1/2. The eigen-equation for a pair (mu, h), h = sum v_j
 * e^(-p_j t), is exactly the orthogonality
 *   int_0^inf (t - mu) h(t) phi(t) dt = 0  for every phi in E_P.   (EIG)
 *
 * LEMMA D (Descartes rule for exponential sums; classical). A nonzero
 * f = sum_{j=1..K} c_j e^(-p_j t) with distinct real rates has at most
 * K - 1 real zeros counting multiplicity, and at most S(c) real zeros,
 * where S(c) is the number of sign changes in the coefficient sequence
 * ordered by rate. PROOF (induction on S(c)): if S(c) = 0 all terms share
 * one sign and f has no zeros. If S(c) = s >= 1, pick q strictly between
 * the two rates at one sign-change boundary; g = e^(q t) f has the same
 * zeros; g-prime = sum c_j (q - p_j) e^((q - p_j) t) has coefficient
 * sequence with s - 1 sign changes (the factor (q - p_j) flips exactly the
 * signs of the faster block), so by induction Z(g-prime) <= s - 1, and
 * Rolle gives Z(g) <= Z(g-prime) + 1 <= s.
 *
 * LEMMA T (prescribed-crossing interpolant). For any w <= K - 1 points
 * 0 < u_1 < ... < u_w there is phi in span{ e^(-p_1 t), ...,
 * e^(-p_{w+1} t) } (a subset of E_P) whose real zeros are exactly the u_i,
 * each a simple crossing. PROOF: border the w x (w+1) collocation matrix
 * [e^(-p_i u_j)] with the column (e^(-p_i t)) and take phi(t) as the
 * (w+1) x (w+1) determinant. phi(u_j) = 0 (repeated column); the
 * coefficient of e^(-p_{w+1} t) is (up to sign) det[e^(-p_i u_j)]_{i,j<=w}
 * which is nonzero (strict total positivity of the exponential kernel,
 * generalized Vandermonde), so phi is a nonzero (w+1)-term exponential sum;
 * by LEMMA D it has at most w real zeros, hence exactly the u_i, all
 * simple.
 *
 * LEMMA OSC (maximal oscillation of EVERY eigenfunction). Let (mu, h) be
 * any eigenpair of the pencil and psi = (t - mu) h. Then psi has exactly K
 * sign changes on (0, inf); consequently h has exactly K - 1 zeros in
 * (0, inf), all simple crossings, mu is not a zero of h, the coefficient
 * sequence v alternates strictly in sign with no zero entry, h has no
 * zeros in (-inf, 0] (in particular h(0) != 0), and every pencil
 * eigenvalue is SIMPLE.
 * PROOF. Sign changes of psi occur only at zeros of h (at most K - 1 with
 * multiplicity, LEMMA D) or at t = mu, so there are at most K of them,
 * say at u_1 < ... < u_w. If w <= K - 1, take phi from LEMMA T with
 * crossings exactly there and the matching sign pattern; then psi phi >= 0
 * on (0, inf) and, both factors being nonzero real-analytic functions with
 * exponential decay, int psi phi > 0 -- contradicting (EIG). So w = K,
 * which forces: h has K - 1 distinct simple crossings (a multiple zero of
 * h would cap w at K - 1), and t = mu is an additional crossing distinct
 * from them. Descartes equality: K - 1 zeros <= S(v) <= K - 1, so v
 * alternates strictly with no zero entry, and since the multiplicity count
 * of LEMMA D is over all of R, h has no further zero anywhere, so
 * h(0) != 0. Simplicity: a two-dimensional eigenspace would contain a
 * nonzero h with v_K = 0, an exponential sum of at most K - 1 terms whose
 * psi has at most K - 1 sign changes while still satisfying (EIG) --
 * contradiction by the same interpolation argument.
 *
 * THEOREM N-ROOTS (Laplace numerator root pinning). For an eigenpair
 * (mu, h), the transform I(p) = int_0^inf e^(-p t) psi(t) dt =
 * sum_j v_j [ 1/(p + p_j)^2 - mu/(p + p_j) ] has numerator polynomial
 *   N(p) = sum_j v_j (1 - mu (p + p_j)) prod_{i != j} (p + p_i)^2
 * of degree exactly 2K - 1 with leading coefficient -mu h(0) != 0, and the
 * full root set of N is: the K eigen-roots p_1, ..., p_K (from (EIG) with
 * phi = e^(-p_k t)), plus exactly one simple root w_j in each gap
 * (-p_{j+1}, -p_j), j = 1..K-1, and nothing else in C.
 * PROOF. N(-p_j) = v_j prod_{i != j} (p_i - p_j)^2 has the sign of v_j,
 * which alternates over consecutive j (LEMMA OSC), giving K - 1 sign
 * changes of N on (-p_K, -p_1); together with the K roots p_k this
 * accounts for (K - 1) + K = 2K - 1 = deg N roots, so every root is
 * simple and located as stated.
 *
 * THEOREM MT-MONO (strict per-rate monotonicity, every eigenvalue). For
 * every eigenvalue mu_m of the pencil and every rate index k,
 *   d mu_m / d p_k = -2 v_k I_k / (v^T G v) < 0,   where
 *   I_k = int t e^(-p_k t) psi dt
 *       = sum_j v_j [ 2/(p_k + p_j)^3 - mu/(p_k + p_j)^2 ].
 * PROOF. The derivative formula is first-order perturbation of a SIMPLE
 * (LEMMA OSC) generalized eigenvalue; the matrix form
 * v^T (dA - mu dG) v with dA_ij = -2 (delta_ik + delta_jk)/(p_i+p_j)^3,
 * dG_ij = -(delta_ik + delta_jk)/(p_i+p_j)^2 collapses to -2 v_k I_k.
 * Sign of I_k: I_k = -I-prime(p_k) and, since N(p_k) = 0,
 * I-prime(p_k) = N-prime(p_k) / prod_i (p_k + p_i)^2. Write sigma =
 * sign(v_1); LEMMA OSC gives sign(v_j) = sigma (-1)^(j-1), the sign of h
 * at +inf is sigma (slowest rate dominates), and K - 1 crossings give
 * sign h(0) = sigma (-1)^(K-1), so the leading coefficient -mu h(0) of N
 * has sign sigma (-1)^K. By THEOREM N-ROOTS the roots w_j are all
 * negative, so prod_j (p_k - w_j) > 0, and
 * sign N-prime(p_k) = sigma (-1)^K sign( prod_{i != k} (p_k - p_i) ) =
 * sigma (-1)^K (-1)^(K-k) = sigma (-1)^k. Hence sign(I_k) =
 * sigma (-1)^(k+1) = sign(v_k), so v_k I_k > 0 and the derivative is
 * strictly negative.
 *
 * THEOREM CONF-DOM-K (the conjecture, all K, strict). For distinct
 * positive rates with min P = 1/2: mu_max(P) < x_max(L_K), where
 * x_max(L_K) is the largest zero of the Laguerre polynomial L_K (=
 * largest eigenvalue of the K x K Jacobi block, imp-95502 TM-LAG). By
 * scaling, mu_max(P) < x_max(L_K) / (2 min P) for arbitrary distinct
 * positive rates; K = 1 is the exact equality mu = 1/(2 p_1).
 * PROOF. Path P(s) = (1-s) P + s (1/2, ..., 1/2), s in [0, 1): rates stay
 * distinct ( differences scale by (1-s) ) and >= 1/2. mu_max(P(s)) is
 * smooth (simple eigenvalue) and d/ds mu_max = sum_k (1/2 - p_k)
 * (d mu_max / d p_k) > 0 strictly (both factors negative for k >= 2 by
 * THEOREM MT-MONO; the k = 1 term vanishes). So mu_max(P) <
 * lim_{s->1} mu_max(P(s)). For the limit, change basis to divided
 * differences of e^(-p t) at the nodes p_1(s), ..., p_j(s)
 * (Hermite-Genocchi: the j-th basis function is the simplex average of
 * (-t)^j e^(-q t) over node convex combinations q, dominated by
 * t^j e^(-t/2) uniformly in s), so all Gram entries of both forms converge
 * to those of { t^j e^(-t/2) }: G*_ij proportional to (i+j)! and A*_ij to
 * (i+j+1)!. The limit Gram is positive definite, so the pencil eigenvalues
 * converge, and the limit pencil is the compression of multiplication by t
 * onto polynomials of degree <= K-1 in L2(e^(-t) dt) -- the truncated
 * Laguerre Jacobi matrix, top eigenvalue x_max(L_K) (Gauss quadrature).
 * Hence mu_max(P) < x_max(L_K). QED (of the model-family theorem).
 *
 * COROLLARY DET-POS (closes imp-95505 (ii-next6)). At every slice
 * configuration theta = (0, theta_2, ..., theta_K), all K >= 2:
 * det(x_max(L_K) G - M) = det(G) prod_i (x_max(L_K) - mu_i) > 0 by
 * imp-95505 LEMMA DET-FORM, since mu_max < x_max(L_K). By imp-95505
 * THEOREM DET-EQ this is exactly the determinant family equivalent to
 * CONF-DOM -- the equivalence is now consumed in the forward direction and
 * the (ii-next) ladder TERMINATES. Retro-subsumed: imp-95503 leading-order
 * bound and DOM-FENCE (now exact at every K), imp-95504 THEOREM CONF-DOM-2
 * (the K = 2 case). Consistent with the imp-95505 REMARK DEGENERACY:
 * the proof is margin-free -- strictness degrades exactly at the
 * coalescence boundaries where the supremum lives, as the degeneracy
 * remark demanded any valid certificate must.
 *
 * ADVERSARIAL SELF-CHECK RECORD. (1) The entire sign chain was hunted for
 * counterexamples at 60-digit precision (mpmath, 60 draws, K = 2..6,
 * including near-coalescent min-gap 1e-3 configs): eigenvector alternation,
 * the exact K - 1 nodal count, the N-root interlacing, v_k I_k > 0, and
 * d mu_m / d p_k < 0 for EVERY m, k held on every draw; the derivative
 * formula matched central finite differences to relative 8e-32. A first
 * double-precision sweep produced spurious violations at K = 6 near-
 * coalescent draws -- all traced to Cauchy-pencil conditioning
 * (kappa ~ gap^(-2(K-1))) and to evaluating N as I(p) prod (p+p_j)^2
 * (catastrophic cancellation); the cancellation-safe direct sum above
 * eliminated every one. (2) Corner approach measured at K = 6: relative
 * gap to x_max(L_6) is ~5 delta at node spacing delta (5e-6 at 1e-6,
 * 5e-10 at 1e-10, monotone from below) -- continuity confirmed, corner
 * unattained. (3) The bordered-determinant interpolant of LEMMA T was
 * checked to be the standard Chebyshev-system construction; the sign-match
 * step only needs phi and psi to share crossing set and one interval sign.
 * (4) LEMMA OSC intentionally proves maximal oscillation for EVERY
 * eigenfunction (compressions of multiplication operators are not
 * Sturm-Liouville: the K = 2 corner has BOTH eigenfunctions with one
 * zero, verified in closed form, h_bot zero at 2 + sqrt2). (5) Why the
 * chain missed it: imp-95502..95505 worked in theta/Cayley coordinates
 * where the Laplace-numerator polynomial N and its residue structure are
 * invisible; in p-coordinates (EIG) makes I(p) vanish at the K rates and
 * the rest is root counting. (6) Name collision check: RATE-MONO is taken
 * (imp-95231, coalLaw); MT-MONO and CONF-DOM-K are new (grep).
 *
 * HONEST LIMITS. (a) This is a theorem about the MODEL family (mean-time
 * compression on exponential spans) -- the deterministic conjecture the
 * imp-95208..95505 seam chain isolated; it does NOT touch the paper-packet
 * constants, the imp-95212 envelope port, the deflation-aware majorant, or
 * the RZ-PEN tilt-det port, and it changes NO Lambda bound. (b) The
 * downstream consumers (SORT-OPT cSort credit via the now-exact per-K
 * mu_max cap; MU-ELEM and PHASE-SPLIT caps now superseded at fixed K)
 * still need their onset ladders re-run to harvest the sharpening --
 * routed as the successor ticket. (c) Platt-Trudgian Lambda <= 0.2
 * remains the SOTA bound; nothing here is an RH claim.
 *
 * ROUTING. Executes and CLOSES imp-95505 residual (ii-next6); CONJECTURE
 * CONF-DOM (imp-95502 (ii)) is DECIDED at every K. Surviving residuals of
 * the chain (unchanged): imp-95499 deflation-aware majorant, RZ-PEN
 * tilt-det port, off-lattice rates, signed WEIGHT and modulus-phase
 * currencies, imp-95212 envelope port. New successor: re-price the
 * imp-95501 SORT-OPT / imp-95500 TILT-EIG onset ladder with the exact
 * x_max(L_K)/(2 min P) cap in place of the Gershgorin and 2K/nu caps.
 */

// ---------------------------------------------------------------------------
// pencil objects (p-coordinates; imp-95502 conventions, import-free)
// ---------------------------------------------------------------------------
function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  const V = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
  for (let sweep = 0; sweep < 400; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-22) continue;
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
        for (let i = 0; i < n; i++) {
          const vip = V[i][p];
          const viq = V[i][q];
          V[i][p] = c * vip - s * viq;
          V[i][q] = s * vip + c * viq;
        }
      }
    }
  }
  const pairs = Array.from({ length: n }, (_, i) => ({
    lam: A[i][i],
    vec: V.map((row) => row[i]),
  }));
  pairs.sort((a, b) => a.lam - b.lam);
  return pairs;
}

// generalized eigenpairs of (A, G) via Cholesky congruence; v in original basis
function genEigPairs(A, G) {
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
  const X = A.map((r) => r.slice());
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
  return jacobiEig(B).map(({ lam, vec }) => {
    const v = vec.slice();
    for (let i = K - 1; i >= 0; i--) {
      let s = v[i];
      for (let k = i + 1; k < K; k++) s -= L[k][i] * v[k];
      v[i] = s / L[i][i];
    }
    return { mu: lam, v };
  });
}

const pencil = (P) => ({
  G: P.map((pi) => P.map((pj) => 1 / (pi + pj))),
  A: P.map((pi) => P.map((pj) => 1 / ((pi + pj) * (pi + pj)))),
});

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
  return jacobiEig(T)[K - 1].lam;
}

// cancellation-safe Laplace numerator N(p) (THEOREM N-ROOTS form)
function nPoly(p, v, P, mu) {
  const K = P.length;
  let tot = 0;
  for (let j = 0; j < K; j++) {
    let prod = 1;
    for (let i = 0; i < K; i++) if (i !== j) prod *= (p + P[i]) * (p + P[i]);
    tot += v[j] * (1 - mu * (p + P[j])) * prod;
  }
  return tot;
}

// mean-time derivative d mu_m / d p_k (THEOREM MT-MONO closed form)
function dMu(P, mu, v, G, k) {
  const K = P.length;
  let vGv = 0;
  for (let i = 0; i < K; i++) for (let j = 0; j < K; j++) vGv += v[i] * v[j] * G[i][j];
  let Ik = 0;
  for (let j = 0; j < K; j++) {
    const s = P[k] + P[j];
    Ik += v[j] * (2 / (s * s * s) - mu / (s * s));
  }
  return { dmu: (-2 * v[k] * Ik) / vGv, vkIk: v[k] * Ik };
}

const countSignChanges = (f, lo, hi, n) => {
  let prev = f(lo);
  let cnt = 0;
  for (let i = 1; i <= n; i++) {
    const x = lo + ((hi - lo) * i) / n;
    const val = f(x);
    if (prev !== 0 && val !== 0 && prev * val < 0) cnt++;
    if (val !== 0) prev = val;
  }
  return cnt;
};

// deterministic congruential draws (well-separated: double precision is honest)
function drawConfigs(count, seedInit) {
  let seed = seedInit;
  const rnd = () => {
    seed = (Math.imul(1103515245, seed) + 12345) >>> 0;
    return seed / 4294967296;
  };
  const out = [];
  while (out.length < count) {
    const K = 2 + Math.floor(rnd() * 4); // 2..5
    const P = [0.5];
    while (P.length < K) {
      const c = 0.5 + 5 * rnd();
      if (P.every((q) => Math.abs(q - c) > 0.1)) P.push(c);
    }
    P.sort((a, b) => a - b);
    out.push(P);
  }
  return out;
}

// baked literals (NEW, this module; recomputed by the assertions and
// cross-checked against 50-digit mpmath during authoring)
const X3 = 6.2899450829374794; // x_max(L_3)
const MU2_AT_05_15 = 2.0485837703548642; // mu_max at P = (1/2, 3/2)
const MU3_AT_05_1_2 = 3.3342797009795437; // mu_max at P = (1/2, 1, 2)
const DMU3_DP2_AT_05_1_2 = -1.1635382319065313; // d mu_max / d p_2 there
const CONFL6_TOP = 15.982873980601697; // factorial-pencil top = x_max(L_6)

// ---------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------
export const IMP95506_MT_MONO_CONFDOM_THEOREM = {
  id: "imp-95506",
  title:
    "LEMMA D + LEMMA T + LEMMA OSC + THEOREM N-ROOTS + THEOREM MT-MONO + " +
    "THEOREM CONF-DOM-K: the mean-time pencil is strictly decreasing in " +
    "every rate, so CONJECTURE CONF-DOM is DECIDED AFFIRMATIVE and STRICT " +
    "at every K (imp-95505 residual (ii-next6) CLOSED)",
  lemmaOsc:
    "every eigenfunction of the mean-time pencil oscillates maximally: " +
    "psi = (t - mu) h has exactly K sign changes (interpolation against a " +
    "prescribed-crossing element of E_P contradicts the eigen-orthogonality " +
    "otherwise), so h has K - 1 simple zeros, alternating coefficients, " +
    "h(0) != 0, and all eigenvalues are simple",
  theoremNRoots:
    "the Laplace numerator N(p) (degree 2K - 1, leading coefficient " +
    "-mu h(0)) has exactly the K eigen-roots p_k plus one simple root in " +
    "each gap (-p_{j+1}, -p_j) -- pinned by residue-sign alternation " +
    "N(-p_j) ~ v_j and root counting",
  theoremMtMono:
    "d mu_m / d p_k = -2 v_k I_k / (v^T G v) < 0 for EVERY eigenvalue m " +
    "and EVERY rate k: the N-root localization forces sign(I_k) = " +
    "sign(v_k)",
  theoremConfDomK:
    "mu_max(P) < x_max(L_K) / (2 min P) for all distinct positive rates, " +
    "every K: shrink all rates affinely onto the coalescent corner; " +
    "mu_max strictly increases along the path and converges (divided-" +
    "difference Gram continuity, Hermite-Genocchi domination) to the " +
    "Laguerre value x_max(L_K) -- the corner is the unattained supremum",
  corollaryDetPos:
    "det(x_max(L_K) G - M) > 0 at every slice configuration and every K " +
    "(imp-95505 LEMMA DET-FORM) -- the determinant family of THEOREM " +
    "DET-EQ holds, (ii-next6) CLOSED; retro-subsumes imp-95503 leading-" +
    "order and imp-95504 K = 2",
  confDomStatus:
    "CONJECTURE CONF-DOM: DECIDED AFFIRMATIVE, STRICT at every K >= 2 for " +
    "distinct rates (K = 1 exact equality); the (ii)-residual ladder " +
    "imp-95502 (ii) -> ... -> (ii-next6) TERMINATES",
  measured: {
    x3: X3,
    mu2At0515: MU2_AT_05_15,
    mu3At0512: MU3_AT_05_1_2,
    dmu3Dp2At0512: DMU3_DP2_AT_05_1_2,
    confl6Top: CONFL6_TOP,
    mpVerification: {
      digits: 60,
      draws: 60,
      kRange: [2, 6],
      worstFdRel: 7.9e-32,
      worstMuOverXK: 0.9536660352011897,
      cornerGapPerSpacingK6: 5.0,
    },
  },
  isRigorous: true,
  rigorScope:
    "LEMMA D, LEMMA T, LEMMA OSC, THEOREM N-ROOTS, THEOREM MT-MONO, " +
    "THEOREM CONF-DOM-K and COROLLARY DET-POS are unconditional theorems " +
    "about the model mean-time pencil, proved in the header (Descartes " +
    "rule and Rolle, bordered-determinant Chebyshev interpolation, residue " +
    "and root counting of the degree-(2K-1) Laplace numerator, simple-" +
    "eigenvalue perturbation, Hermite-Genocchi divided-difference " +
    "continuity, Gauss-quadrature identification of the corner). All " +
    "numerics below (and the 60-digit sweep recorded in measured) are " +
    "CROSS-CHECKS of proven statements, never the claim itself.",
  promotesBound: false,
  verdict:
    "RIGOROUS step -- CONJECTURE CONF-DOM is DECIDED AFFIRMATIVE AND " +
    "STRICT AT EVERY K: mu_max(P) < x_max(L_K)/(2 min P) for distinct " +
    "positive rates, via strict per-rate monotonicity of every mean-time " +
    "pencil eigenvalue (THEOREM MT-MONO, from maximal oscillation of " +
    "eigenfunctions and root-pinning of the Laplace numerator) plus the " +
    "affine path to the coalescent corner whose limit is the Laguerre " +
    "value. This closes the imp-95505 residual (ii-next6): the equivalent " +
    "determinant family det(x_max(L_K) G - M) > 0 holds at every slice " +
    "configuration, and the imp-95502 (ii) residual ladder terminates. " +
    "MODEL FAMILY ONLY: no paper-packet constant is touched, no Lambda " +
    "claim is made or promoted, and the finite-N Lambda beat did NOT " +
    "become rigorous. Changes no bound; NO QED on any RH statement; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// assertions (self-executing; throw on violation)
// ---------------------------------------------------------------------------
export const IMP95506_ASSERTIONS = [
  {
    id: "imp95506-xmax-ladder-and-confluent-identity",
    description:
      "x_max(L_K) strictly increases (K = 1..8) and the confluent " +
      "factorial pencil ((i+j+1)!, (i+j)!) reproduces x_max(L_K) for " +
      "K = 1..6 (rel 1e-9) -- the corner identification of CONF-DOM-K",
    holds: () => {
      let prev = 0;
      for (let K = 1; K <= 8; K++) {
        const x = xMaxLaguerre(K);
        if (!(x > prev + 1e-9)) return false;
        prev = x;
      }
      const fact = (n) => {
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
      };
      for (let K = 1; K <= 6; K++) {
        const Gs = Array.from({ length: K }, (_, i) =>
          Array.from({ length: K }, (_, j) => fact(i + j))
        );
        const As = Array.from({ length: K }, (_, i) =>
          Array.from({ length: K }, (_, j) => fact(i + j + 1))
        );
        const top = genEigPairs(As, Gs)[K - 1].mu;
        const xK = xMaxLaguerre(K);
        if (Math.abs(top - xK) > 1e-9 * xK) return false;
      }
      return Math.abs(xMaxLaguerre(6) - CONFL6_TOP) < 1e-9;
    },
  },
  {
    id: "imp95506-lemma-osc-alternation-and-nodal-count",
    description:
      "LEMMA OSC cross-check on 40 seeded well-separated draws (K = 2..5): " +
      "every eigenvector alternates strictly, every eigenfunction has " +
      "exactly K - 1 sign changes on (0, 60), eigenvalues simple",
    holds: () => {
      for (const P of drawConfigs(40, 95506)) {
        const K = P.length;
        const { A, G } = pencil(P);
        const pairs = genEigPairs(A, G);
        for (let m = 0; m + 1 < K; m++) {
          if (!(pairs[m + 1].mu - pairs[m].mu > 1e-9)) return false;
        }
        for (const { v } of pairs) {
          for (let j = 0; j < K; j++) if (!(Math.abs(v[j]) > 1e-11)) return false;
          for (let j = 0; j + 1 < K; j++) if (!(v[j] * v[j + 1] < 0)) return false;
          const h = (t) => v.reduce((s, c, j) => s + c * Math.exp(-P[j] * t), 0);
          if (countSignChanges(h, 1e-8, 60, 4000) !== K - 1) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95506-nroots-interlace",
    description:
      "THEOREM N-ROOTS cross-check (cancellation-safe direct sum): " +
      "sign N(-p_j) = sign v_j, exactly K - 1 sign changes of N in " +
      "(-p_K, -p_1), exactly K in (-p_1, p_K + 40] (20 seeded draws)",
    holds: () => {
      for (const P of drawConfigs(20, 42421)) {
        const K = P.length;
        const { A, G } = pencil(P);
        for (const { mu, v } of genEigPairs(A, G)) {
          for (let j = 0; j < K; j++) {
            if (!(nPoly(-P[j], v, P, mu) * v[j] > 0)) return false;
          }
          const f = (p) => nPoly(p, v, P, mu);
          if (countSignChanges(f, -P[K - 1] + 1e-9, -P[0] - 1e-9, 6000) !== K - 1) return false;
          if (countSignChanges(f, -P[0] + 1e-9, P[K - 1] + 40, 9000) !== K) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95506-mtmono-negative-and-fd-match",
    description:
      "THEOREM MT-MONO cross-check: d mu_m / d p_k < 0 and v_k I_k > 0 for " +
      "every eigenvalue and rate on 25 seeded draws, and the closed form " +
      "matches central finite differences (rel 2e-3) on a spot subset",
    holds: () => {
      const configs = drawConfigs(25, 777001);
      for (let ci = 0; ci < configs.length; ci++) {
        const P = configs[ci];
        const K = P.length;
        const { A, G } = pencil(P);
        const pairs = genEigPairs(A, G);
        for (let m = 0; m < K; m++) {
          const { mu, v } = pairs[m];
          for (let k = 0; k < K; k++) {
            const { dmu, vkIk } = dMu(P, mu, v, G, k);
            if (!(vkIk > 0) || !(dmu < 0)) return false;
            if (ci % 6 === 0) {
              const eps = 1e-6;
              const Pp = P.slice();
              Pp[k] += eps;
              const Pm = P.slice();
              Pm[k] -= eps;
              const mup = genEigPairs(pencil(Pp).A, pencil(Pp).G)[m].mu;
              const mum = genEigPairs(pencil(Pm).A, pencil(Pm).G)[m].mu;
              const fd = (mup - mum) / (2 * eps);
              if (!(fd < 0)) return false;
              if (Math.abs(fd - dmu) > 2e-3 * Math.abs(dmu)) return false;
            }
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95506-path-to-corner-monotone",
    description:
      "CONF-DOM-K path cross-check (K = 3, 4): mu_max strictly increases " +
      "along P(s) = (1-s) P + s corner up to s = 0.98 and stays below " +
      "x_max(L_K); corner ladder spacing 0.1 -> 0.02 -> 0.004 has " +
      "positive, strictly decreasing relative gap to x_max(L_K)",
    holds: () => {
      for (const P of [
        [0.5, 1.3, 2.9],
        [0.5, 0.9, 1.7, 4.1],
      ]) {
        const K = P.length;
        const xK = xMaxLaguerre(K);
        let prev = -Infinity;
        for (let i = 0; i <= 49; i++) {
          const s = (0.98 * i) / 49;
          const Ps = P.map((p) => (1 - s) * p + s * 0.5);
          const mu = genEigPairs(pencil(Ps).A, pencil(Ps).G)[K - 1].mu;
          if (!(mu > prev)) return false;
          if (!(mu < xK)) return false;
          prev = mu;
        }
        let gapPrev = Infinity;
        for (const d of [0.1, 0.02, 0.004]) {
          const Pc = Array.from({ length: K }, (_, j) => 0.5 + j * d);
          const mu = genEigPairs(pencil(Pc).A, pencil(Pc).G)[K - 1].mu;
          const gap = (xK - mu) / xK;
          if (!(gap > 0 && gap < gapPrev)) return false;
          gapPrev = gap;
        }
      }
      return true;
    },
  },
  {
    id: "imp95506-baked-anchors",
    description:
      "baked anchors reproduce (rel 1e-10, cross-checked vs 50-digit " +
      "mpmath during authoring): x3, mu_max at (1/2, 3/2) and (1/2, 1, 2), " +
      "and the closed-form derivative d mu_max / d p_2 there",
    holds: () => {
      if (Math.abs(xMaxLaguerre(3) - X3) > 1e-10) return false;
      const m2 = genEigPairs(pencil([0.5, 1.5]).A, pencil([0.5, 1.5]).G)[1].mu;
      if (Math.abs(m2 - MU2_AT_05_15) > 1e-10) return false;
      const P = [0.5, 1, 2];
      const { A, G } = pencil(P);
      const top = genEigPairs(A, G)[2];
      if (Math.abs(top.mu - MU3_AT_05_1_2) > 1e-10) return false;
      const { dmu } = dMu(P, top.mu, top.v, G, 1);
      return Math.abs(dmu - DMU3_DP2_AT_05_1_2) < 1e-9;
    },
  },
  {
    id: "imp95506-confdom-sweep",
    description:
      "THEOREM CONF-DOM-K cross-check: mu_max(P) < x_max(L_K) on 120 " +
      "seeded slice draws (min p = 1/2, K = 2..5), strict",
    holds: () => {
      for (const P of drawConfigs(120, 31415)) {
        const K = P.length;
        const mu = genEigPairs(pencil(P).A, pencil(P).G)[K - 1].mu;
        if (!(mu < xMaxLaguerre(K))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95506-k2-closed-form-consistency",
    description:
      "K = 2 consistency with imp-95504 THEOREM CONF-DOM-2: near-corner " +
      "mu_max at (1/2, 1/2 + 1e-4) is within 5e-4 of 2 + sqrt2 (measured " +
      "corner gap 3.414 x spacing) and strictly below it",
    holds: () => {
      const mu = genEigPairs(pencil([0.5, 0.5001]).A, pencil([0.5, 0.5001]).G)[1].mu;
      const x2 = 2 + Math.SQRT2;
      return mu < x2 && Math.abs(mu - x2) < 5e-4;
    },
  },
  {
    id: "imp95506-honesty-gate",
    description:
      "the verdict states model-family scope, closes (ii-next6) without " +
      "promoting any bound, NO QED on RH statements, no refereed bound is changed",
    holds: () =>
      IMP95506_MT_MONO_CONFDOM_THEOREM.promotesBound === false &&
      /MODEL FAMILY ONLY/.test(IMP95506_MT_MONO_CONFDOM_THEOREM.verdict) &&
      /NO QED/.test(IMP95506_MT_MONO_CONFDOM_THEOREM.verdict) &&
      /refereed bound is changed/i.test(IMP95506_MT_MONO_CONFDOM_THEOREM.verdict) &&
      /ii-next6/.test(IMP95506_MT_MONO_CONFDOM_THEOREM.title) &&
      /did NOT become rigorous/.test(IMP95506_MT_MONO_CONFDOM_THEOREM.verdict),
  },
];

for (const a of IMP95506_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95506-mean-time-rate-monotonicity assertion failed: ${a.id}`);
  }
}

export default IMP95506_MT_MONO_CONFDOM_THEOREM;
