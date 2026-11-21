/**
 * imp-95504: LEMMA SCALE + LEMMA CAYLEY-PENCIL + THEOREM CONF-DOM-2 --
 * executes the imp-95503 surviving residual (ii-next4) AT K = 2:
 * CONJECTURE CONF-DOM (mu_max(P) <= x_max(L_K)/(2 min P), the mean-time
 * pencil dominated by the confluent Laguerre corner) is DECIDED
 * AFFIRMATIVE and STRICT at K = 2, by exactly the Laguerre-ONB
 * Vandermonde-span route imp-95503 recorded as the candidate. The
 * general-K conjecture is reformulated as a finite PSD statement
 * (xStar G - D (G o G) D >= 0 on the theta_1 = 0 slice) and stays OPEN
 * for K >= 3. Derivation + cross-check numerics; changes no bound;
 * NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95501/95502/95503 normalization). Distinct positive rates
 * P = {p_1 < ... < p_K}, E_P = span{e^(-p t)} in L2(0, inf), mean-time
 * pencil (G_p o G_p, G_p) with Cauchy Gram (G_p)_ij = 1/(p_i + p_j);
 * mu_max(P) = top generalized eigenvalue = sup over h in E_P of
 * int t h^2 dt / int h^2 dt (the Hadamard square IS the mean-time
 * matrix because int t e^(-(p_i+p_j) t) dt = 1/(p_i + p_j)^2).
 * CONJECTURE CONF-DOM (recorded OPEN by imp-95502, fenced by imp-95503):
 * mu_max(P) <= x_max(L_K)/(2 min P), x_max(L_K) = largest zero of the
 * Laguerre polynomial L_K, attained only in the coalescent limit.
 *
 * LEMMA SCALE. mu_max({lambda p_k}) = mu_max({p_k})/lambda for every
 * lambda > 0 (substitute t -> t/lambda in numerator and denominator).
 * Hence CONF-DOM is equivalent to its normalized slice min P = 1/2
 * (units 2 nu = 1), where it reads mu_max(P) <= x_max(L_K).
 *
 * LEMMA CAYLEY-PENCIL (exact theta-coordinates; the imp-95503 recorded
 * route, executed). Put theta_k = (2 p_k - 1)/(2 p_k + 1) in [0, 1),
 * theta_1 = 0 at the normalized minimum. Then EXACTLY
 *   1/(p_i + p_j) = (1 - theta_i)(1 - theta_j)/(1 - theta_i theta_j),
 * so with D = diag(1 - theta_k) and G_ij = 1/(1 - theta_i theta_j):
 * G_p = D G D and G_p o G_p = D^2 (G o G) D^2 entrywise; congruence by
 * D^(-1) (which preserves generalized eigenvalues of a symmetric pencil)
 * turns the mean-time pencil into
 *   (M, G),   M = D (G o G) D,   M_ij = (1 - theta_i)(1 - theta_j)
 *                                        / (1 - theta_i theta_j)^2.
 * Structure notes, both exact:
 * (a) Laguerre interpretation. In the Laguerre-function ONB of
 *     L2(0, inf) at 2 nu = 1, the coefficient vector of e^(-p t) is
 *     proportional to the Cauchy kernel k_theta = (theta^n): the Laplace
 *     transform of L_n is (s - 1)^n / s^(n+1) at s = p + 1/2, giving the
 *     ratio theta^n. Multiplication by t is the Laguerre Jacobi operator
 *     J (diagonal 2n + 1, off-diagonal -(n+1)), and geometric series
 *     give the closed forms <k_i, k_j> = G_ij and <k_i, J k_j> = M_ij
 *     (the (2n+1) and (n+1) sums are (1+x)/(1-x)^2 and 1/(1-x)^2 at
 *     x = theta_i theta_j). The confluent corner theta -> 0 is the
 *     coordinate span {e_0..e_(K-1)}, whose compression of J is the K-th
 *     leading block with top eigenvalue x_max(L_K) -- this is WHY the
 *     Laguerre zero is the conjectured extremal value.
 * (b) Stein form. (1 - theta_i theta_j)(G o G)_ij = G_ij exactly, i.e.
 *     G o G is the solution of the Stein equation X - Dth X Dth = G with
 *     Dth = diag(theta_k). Consequence: CONF-DOM at every K is EXACTLY
 *     the finite matrix statement
 *       xStar(K) G - D (G o G) D >= 0 (PSD) on the slice theta_1 = 0,
 *     theta in [0,1)^K distinct, xStar(K) = x_max(L_K) -- no
 *     infinite-dimensional object left.
 *
 * THEOREM CONF-DOM-2 (K = 2, exact, strict). For all 0 < p_1 < p_2:
 *   mu_max({p_1, p_2}) < (2 + sqrt2)/(2 p_1) = x_max(L_2)/(2 p_1),
 * and the constant is sharp (attained only as p_2 -> p_1).
 * PROOF. By LEMMA SCALE take p_1 = 1/2; by LEMMA CAYLEY-PENCIL the
 * pencil is (M, G) with theta = (0, u), u in (0, 1):
 *   G = [[1, 1], [1, 1/(1-u^2)]],  M = [[1, 1-u], [1-u, 1/(1+u)^2]].
 * det(M - mu G) = a mu^2 + b mu + c with
 *   a = u^2/(1-u^2) > 0,
 *   b = 2(1-u) - 1/(1+u)^2 - 1/(1-u^2),
 *   c = 1/(1+u)^2 - (1-u)^2.
 * Multiply q(xStar) by the positive factor (1-u)(1+u)^3; expanding (all
 * steps polynomial algebra, cross-checked below) gives EXACTLY
 *   (1-u)(1+u)^3 q(xStar) = u^2 R(u),
 *   R(u) = [xStar(1+u) - (2 - u^2)]^2 - (2 - u^2),
 * where the complete-the-square step uses (2-u^2)^2 - (2-u^2) =
 * (2-u^2)(1-u^2) + ... precisely: bracket = xStar^2 (1+u)^2
 * - 2 xStar (1+u)(2-u^2) + (1-u^2)(2-u^2) and (2-u^2)^2 - (2-u^2)
 * = (2-u^2)(1-u^2). Set g(u) = xStar(1+u) - 2 + u^2 - sqrt(2-u^2).
 * Then g(0) = xStar - 2 - sqrt2 = 0 and
 *   dg/du = xStar + 2u + u/sqrt(2-u^2) > 0,
 * so g(u) > 0 on (0, 1); since also xStar(1+u) - (2-u^2) >= xStar - 2
 * = sqrt2 > 0, squaring is legitimate and R(u) > 0 on (0, 1). Hence
 * q(xStar) > 0. The pencil is symmetric-definite (G is PD for u in
 * (0,1)), so both generalized eigenvalues are real; the Rayleigh
 * quotient at coefficient vector (1, 0) is M_11/G_11 = 1, so
 * mu_min <= 1 < xStar. An upward quadratic with q(xStar) > 0 places
 * xStar outside [mu_min, mu_max]; with mu_min < xStar this forces
 * mu_max < xStar. Sharpness: R(0) = 0 is xStar^2 - 4 xStar + 2 = 0,
 * i.e. 2 L_2(xStar) = 0 -- the characteristic equation of the confluent
 * corner block [[1,-1],[-1,3]]; mu_max(u) -> xStar as u -> 0 (the
 * confluent span {e_0, e_1}). QED (theorem-level statement on the MODEL
 * pencil; no Lambda claim).
 *
 * COROLLARY CAP-2 (unconditional K = 2 mean-time cap). onset(TILT-SORT)
 * = mu_max <= (2 + sqrt2)/(2 min P) at K = 2 unconditionally -- an
 * exact elementary cap where imp-95502 GERS was only per-configuration
 * and imp-95503 HARM gave 4/min P (this is sharper: 2 + sqrt2 < 4).
 *
 * ADVERSARIAL SELF-CHECK RECORD. (1) The Cayley pencil was attacked
 * against the INDEPENDENT imp-95502 Takenaka-Malmquist matrix route on
 * 60 random draws at K = 2..5 (mixed theta_1 = 0 and free): worst
 * relative mismatch of mu_max 1.9e-9 (Jacobi eigensolver tolerance).
 * (2) Squaring trap: positivity of xStar(1+u) - (2-u^2) is proven
 * (>= sqrt2), not assumed, before interpreting R > 0 as the
 * square-vs-root inequality. (3) Root-location trap: q(xStar) > 0 alone
 * allows BOTH roots above xStar; eliminated by the exact Rayleigh
 * witness mu_min <= M_11/G_11 = 1. (4) Float trap: both sides of the
 * R-identity vanish like u^3 at the corner, so the numeric cross-check
 * uses a mixed tolerance; the identity itself is hand-expanded
 * polynomial algebra (and spot-checked at exact-fraction points).
 * (5) Novelty check: imp-95502 recorded CONF-DOM open at EVERY K,
 * imp-95503 HONEST LIMITS (a) reconfirmed; imp-95287 MONO-N concerns
 * the interpolant Lambda, not the mean-time pencil -- K = 2 was open.
 * (6) K = 3 was attempted by the same complete-the-square on the cubic
 * characteristic polynomial; no clean factorization was found in this
 * run -- NOT claimed. A 300-draw K = 3 spot-check stays below
 * x_max(L_3) with closest ratio 0.9610 (measurement, not proof).
 *
 * HONEST LIMITS. (a) CONF-DOM for K >= 3 remains OPEN; what this module
 * adds for general K is the exact finite reformulation (Stein form (b)):
 * xStar(K) G - D (G o G) D PSD on the theta_1 = 0 slice, with the
 * recorded candidate route = Schur-complement induction on the
 * theta_1 = 0 coordinate (THEOREM CONF-DOM-2 is its base case) or
 * eigenvalue monotonicity in each theta_k. (b) Model family only
 * (exponential spans, Cauchy Gram); no mapping to paper per-window
 * data; the program bound is unchanged. (c) The imp-95499 deflation
 * residual (i) and the RZ-PEN port residual (iii) are untouched.
 *
 * ROUTING. Executes imp-95503 (ii-next4) at K = 2 (decided AFFIRMATIVE,
 * STRICT). Surviving re-scope (ii-next5): general-K CONF-DOM via the
 * PSD-slice reformulation above. Import-free; numerics below CROSS-CHECK
 * the proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// TM closed-form matrix + eigensolver (imp-95502/95503 conventions,
// replicated import-free) -- the INDEPENDENT route used to attack
// LEMMA CAYLEY-PENCIL
// ---------------------------------------------------------------------------
function tmMatrix(Pin) {
  const P = [...Pin].sort((a, b) => a - b);
  const K = P.length;
  const T = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let k = 0; k < K; k++) {
    let a = 1 / (2 * P[k]);
    for (let j = 0; j < k; j++) a += 2 / (P[j] + P[k]);
    T[k][k] = a;
    for (let m = k + 1; m < K; m++) {
      let s = 0;
      for (let j = 0; j <= k; j++) {
        let num = 1;
        for (let i = k + 1; i < m; i++) num *= P[j] - P[i];
        let den = 1;
        for (let i = k; i <= m; i++) den *= P[j] + P[i];
        s += num / den;
      }
      const v = -2 * Math.sqrt(P[k] * P[m]) * s;
      T[k][m] = v;
      T[m][k] = v;
    }
  }
  return T;
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

// ---------------------------------------------------------------------------
// LEMMA CAYLEY-PENCIL objects
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

// generalized top eigenvalue of (M, G) via Cholesky congruence
function genTopEig(M, G) {
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
  return symEig(B)[K - 1];
}

// THEOREM CONF-DOM-2 characteristic-polynomial coefficients at theta = (0, u)
function k2coeffs(u) {
  const A = 1 / ((1 + u) * (1 + u));
  const B = 1 / (1 - u * u);
  return { a: B - 1, b: 2 * (1 - u) - A - B, c: A - (1 - u) * (1 - u) };
}
const k2muMax = (u) => {
  const { a, b, c } = k2coeffs(u);
  return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
};

// x_max(L_K) via the truncated Laguerre Jacobi matrix (imp-95502 TM-LAG)
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

const X_STAR_2 = 2 + Math.SQRT2; // x_max(L_2) exactly

// baked literals (NEW, this module; recomputed by the assertions)
const K3_SPOTCHECK_CLOSEST_RATIO = 0.9609575151602003; // 300 draws, measurement only
const K2_GRID_FIRST_MU = 3.4125078223303538; // mu_max at u = 1/2001

// ---------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------
export const IMP95504_CAYLEY_PENCIL_CONFDOM_K2 = {
  id: "imp-95504",
  title:
    "LEMMA SCALE + LEMMA CAYLEY-PENCIL + THEOREM CONF-DOM-2: the exact " +
    "theta-coordinate mean-time pencil (D(GoG)D, G) and the K = 2 closure " +
    "of CONJECTURE CONF-DOM -- mu_max < (2+sqrt2)/(2 min P), strict, sharp " +
    "only in the coalescent limit (imp-95503 residual (ii-next4) executed " +
    "at K = 2)",
  lemmaScale:
    "mu_max({lambda p_k}) = mu_max({p_k})/lambda: CONF-DOM is equivalent " +
    "to its normalized slice min P = 1/2 (units 2 nu = 1)",
  lemmaCayleyPencil:
    "theta_k = (2 p_k - 1)/(2 p_k + 1): exactly 1/(p_i+p_j) = " +
    "(1-theta_i)(1-theta_j)/(1-theta_i theta_j), and the mean-time pencil " +
    "is congruent to (M, G) with G_ij = 1/(1-theta_i theta_j), M = " +
    "D (G o G) D, D = diag(1-theta_k); G o G solves the Stein equation " +
    "X - Dth X Dth = G; in the Laguerre ONB the span is the Cauchy-kernel " +
    "(Vandermonde) span (theta_k^n) and the corner theta -> 0 is the " +
    "coordinate block whose top eigenvalue is x_max(L_K) -- the imp-95503 " +
    "recorded route, executed",
  theoremConfDom2:
    "K = 2: for all 0 < p_1 < p_2, mu_max < (2 + sqrt2)/(2 p_1) = " +
    "x_max(L_2)/(2 p_1), STRICT, attained only as p_2 -> p_1. Proof: " +
    "(1-u)(1+u)^3 det(M - xStar G) = u^2 R(u) with R(u) = " +
    "[xStar(1+u) - (2-u^2)]^2 - (2-u^2) > 0 on (0,1) (monotone g), plus " +
    "the Rayleigh witness mu_min <= 1 to place both roots below xStar",
  corollaryCap2:
    "unconditional K = 2 mean-time cap: onset(TILT-SORT) = mu_max <= " +
    "(2+sqrt2)/(2 min P), sharper than the imp-95503 family cap 4/min P",
  generalKReformulation:
    "CONF-DOM at every K is EXACTLY: xStar(K) G - D (G o G) D is PSD on " +
    "the slice theta_1 = 0, theta in [0,1)^K distinct -- a finite matrix " +
    "statement; candidate route (ii-next5): Schur-complement induction " +
    "on the theta_1 = 0 coordinate (CONF-DOM-2 is the base case) or " +
    "eigenvalue monotonicity in each theta_k",
  confDomStatus:
    "DECIDED AFFIRMATIVE and STRICT at K = 2 (this module); K = 1 " +
    "trivial (mu = 1/(2p)); K >= 3 OPEN (re-scoped (ii-next5), " +
    "PSD-slice reformulation recorded; K = 3 spot-check 300 draws " +
    "closest ratio 0.9610 -- measurement, not proof)",
  measured: {
    xStar2: X_STAR_2,
    k2GridFirstMu: K2_GRID_FIRST_MU,
    k3SpotcheckClosestRatio: K3_SPOTCHECK_CLOSEST_RATIO,
    pencilVsTmWorstRel: 1.9019344806301247e-9,
  },
  isRigorous: true,
  rigorScope:
    "LEMMA SCALE, LEMMA CAYLEY-PENCIL and THEOREM CONF-DOM-2 are " +
    "unconditional statements about the model objects (exponential " +
    "spans, Cauchy Gram, mean-time pencil); proofs in the header " +
    "(substitution, entrywise Cayley identity + diagonal congruence, " +
    "geometric-series Laguerre closed forms, polynomial complete-the-" +
    "square + monotone-g positivity + Rayleigh root location). The K = 3 " +
    "spot-check and the monotone-decrease samples are measurements, not " +
    "claims. CONF-DOM for K >= 3 remains OPEN. The numerics cross-check " +
    "the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step (executes imp-95503 residual (ii-next4) at K = 2): " +
    "the recorded Laguerre-ONB Vandermonde route lands -- the Cayley map " +
    "theta = (2p-1)/(2p+1) turns the mean-time pencil into the exact " +
    "finite pencil (D(GoG)D, G) with G_ij = 1/(1-theta_i theta_j) " +
    "(Stein form of the Hadamard square), and at K = 2 the " +
    "characteristic polynomial at xStar = 2 + sqrt2 factors as " +
    "u^2 [(xStar(1+u) - (2-u^2))^2 - (2-u^2)] over a positive " +
    "prefactor, which is strictly positive on (0,1) by a monotone " +
    "derivative; with the Rayleigh witness mu_min <= 1 both pencil " +
    "roots lie strictly below xStar. CONJECTURE CONF-DOM is therefore " +
    "TRUE and STRICT at K = 2: mu_max({p_1, p_2}) < (2+sqrt2)/(2 p_1), " +
    "sharp only in the coalescent limit; general K is reformulated as a " +
    "finite PSD-slice statement and stays OPEN. Changes no bound; does " +
    "NOT promote any Lambda claim; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// assertions (self-executing; throw on violation)
// ---------------------------------------------------------------------------
export const IMP95504_ASSERTIONS = [
  {
    id: "imp95504-cayley-identity-exact",
    description:
      "LEMMA CAYLEY-PENCIL entrywise identities at exact-fraction points: " +
      "1/(p_i+p_j) = (1-t_i)(1-t_j)/(1-t_i t_j), the Stein identity " +
      "(1-t_i t_j)(GoG)_ij = G_ij, and M = D(GoG)D (1e-14)",
    holds: () => {
      const th = [0, 0.25, 0.5, 0.8];
      const P = th.map(pOfTheta);
      const { M, G } = cayleyPencil(th);
      for (let i = 0; i < th.length; i++) {
        for (let j = 0; j < th.length; j++) {
          const lhs = 1 / (P[i] + P[j]);
          const rhs = ((1 - th[i]) * (1 - th[j])) / (1 - th[i] * th[j]);
          if (Math.abs(lhs - rhs) > 1e-14) return false;
          const gog = G[i][j] * G[i][j];
          if (Math.abs((1 - th[i] * th[j]) * gog - G[i][j]) > 1e-14) return false;
          if (Math.abs((1 - th[i]) * (1 - th[j]) * gog - M[i][j]) > 1e-14) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95504-pencil-vs-tm-independent-route",
    description:
      "the Cayley pencil reproduces mu_max from the INDEPENDENT imp-95502 " +
      "Takenaka-Malmquist matrix route on 60 deterministic draws, K = 2..5 " +
      "(rel 1e-7)",
    holds: () => {
      let seed = 20260914;
      const rnd = () => {
        seed = (Math.imul(1103515245, seed) + 12345) >>> 0;
        return seed / 4294967296;
      };
      for (let trial = 0; trial < 60; trial++) {
        const K = 2 + Math.floor(rnd() * 4);
        const th = [trial % 2 === 0 ? 0 : 0.02 + 0.2 * rnd()];
        while (th.length < K) {
          const c = 0.03 + 0.93 * rnd();
          if (th.every((t) => Math.abs(t - c) > 0.02)) th.push(c);
        }
        th.sort((a, b) => a - b);
        const { M, G } = cayleyPencil(th);
        const muPencil = genTopEig(M, G);
        const muDirect = symEig(tmMatrix(th.map(pOfTheta)))[K - 1];
        if (Math.abs(muPencil - muDirect) > 1e-7 * muDirect) return false;
      }
      return true;
    },
  },
  {
    id: "imp95504-k2-charpoly-abc",
    description:
      "det(M - mu G) at theta = (0, u) equals a mu^2 + b mu + c with the " +
      "stated closed-form coefficients (1e-12, 12 sample points)",
    holds: () => {
      for (const u of [0.1, 0.35, 0.6, 0.9]) {
        const { M, G } = cayleyPencil([0, u]);
        const { a, b, c } = k2coeffs(u);
        for (const mu of [0.3, 1.7, 3.0]) {
          const det =
            (M[0][0] - mu * G[0][0]) * (M[1][1] - mu * G[1][1]) -
            (M[0][1] - mu * G[0][1]) * (M[1][0] - mu * G[1][0]);
          if (Math.abs(det - (a * mu * mu + b * mu + c)) > 1e-12) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95504-R-factorization",
    description:
      "(1-u)(1+u)^3 q(xStar) = u^2 R(u) with R(u) = [xStar(1+u) - " +
      "(2-u^2)]^2 - (2-u^2), on a 999-point grid; mixed tolerance because " +
      "both sides vanish like u^3 at the corner (the identity is exact " +
      "polynomial algebra)",
    holds: () => {
      for (let i = 1; i <= 999; i++) {
        const u = i / 1000;
        const { a, b, c } = k2coeffs(u);
        const lhs = (a * X_STAR_2 * X_STAR_2 + b * X_STAR_2 + c) * (1 - u) * (1 + u) ** 3;
        const Ru = ((X_STAR_2 * (1 + u) - (2 - u * u)) ** 2 - (2 - u * u)) * u * u;
        if (Math.abs(lhs - Ru) > 1e-10 * Math.max(1e-4, Math.abs(Ru))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95504-g-monotone-positive",
    description:
      "g(u) = xStar(1+u) - 2 + u^2 - sqrt(2-u^2): g(0) = 0 (i.e. xStar - 2 " +
      "= sqrt2 exactly), dg/du >= xStar > 0 on the grid, g > 0 for u > 0, " +
      "and the pre-square factor xStar(1+u) - (2-u^2) >= sqrt2",
    holds: () => {
      const g = (u) => X_STAR_2 * (1 + u) - 2 + u * u - Math.sqrt(2 - u * u);
      if (Math.abs(g(0)) > 1e-14) return false;
      for (let i = 1; i <= 1000; i++) {
        const u = (i / 1000) * 0.999999;
        const gp = X_STAR_2 + 2 * u + u / Math.sqrt(2 - u * u);
        if (!(gp >= X_STAR_2)) return false;
        if (!(g(u) > 0)) return false;
        if (!(X_STAR_2 * (1 + u) - (2 - u * u) >= Math.SQRT2 - 1e-14)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95504-k2-strict-sweep-and-corner",
    description:
      "THEOREM CONF-DOM-2 cross-check: mu_max(u) < xStar on a 2000-point " +
      "grid (first grid value matches the baked 3.4125078223303538 to " +
      "1e-9), decreasing along the sampled grid, and mu_max(1e-5) is " +
      "within 5e-4 of xStar (sharpness at the coalescent corner); " +
      "Rayleigh witness M_11/G_11 = 1 < xStar",
    holds: () => {
      let prev = Infinity;
      for (let i = 1; i <= 2000; i++) {
        const u = i / 2001;
        const mu = k2muMax(u);
        if (i === 1 && Math.abs(mu - K2_GRID_FIRST_MU) > 1e-9) return false;
        if (!(mu < X_STAR_2)) return false;
        if (!(mu <= prev + 1e-12)) return false;
        prev = mu;
      }
      const { M, G } = cayleyPencil([0, 0.5]);
      if (Math.abs(M[0][0] / G[0][0] - 1) > 1e-15) return false;
      return Math.abs(k2muMax(1e-5) - X_STAR_2) < 5e-4;
    },
  },
  {
    id: "imp95504-k2-pspace-scaled-sweep",
    description:
      "LEMMA SCALE instantiation: 200 deterministic draws of (nu, p_2) with " +
      "random scale nu in [0.1, 3.1], direct tmMatrix mu_max < " +
      "(2+sqrt2)/(2 nu), zero violations",
    holds: () => {
      let seed = 777;
      const rnd = () => {
        seed = (Math.imul(1103515245, seed) + 12345) >>> 0;
        return seed / 4294967296;
      };
      for (let t = 0; t < 200; t++) {
        const nu = 0.1 + 3 * rnd();
        const p2 = nu * (1 + 1e-4 + 30 * rnd());
        const mu = symEig(tmMatrix([nu, p2]))[1];
        if (!(mu < X_STAR_2 / (2 * nu))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95504-laguerre-anchor",
    description:
      "corner anchors: x_max(L_2) from the Jacobi block equals 2 + sqrt2 " +
      "(1e-12), and xStar solves xStar^2 - 4 xStar + 2 = 0 (the R(0) = 0 " +
      "sharpness identity, i.e. 2 L_2(xStar) = 0)",
    holds: () =>
      Math.abs(xMaxLaguerre(2) - X_STAR_2) < 1e-12 &&
      Math.abs(X_STAR_2 * X_STAR_2 - 4 * X_STAR_2 + 2) < 1e-12,
  },
  {
    id: "imp95504-k3-spotcheck-measurement-only",
    description:
      "K = 3 fence spot-check (MEASUREMENT, not proof): 300 deterministic " +
      "draws with theta_1 = 0 stay below x_max(L_3), closest ratio matches " +
      "the baked 0.9609575151602003 (1e-9)",
    holds: () => {
      const x3 = xMaxLaguerre(3);
      let seed = 31337;
      const rnd = () => {
        seed = (Math.imul(1103515245, seed) + 12345) >>> 0;
        return seed / 4294967296;
      };
      let closest = 0;
      for (let t = 0; t < 300; t++) {
        const a1 = 0.001 + 0.4 * rnd();
        const a2 = a1 + 0.001 + 0.5 * rnd();
        const th = [0, Math.min(a1, 0.995), Math.min(a2, 0.998)];
        const { M, G } = cayleyPencil(th);
        const mu = genTopEig(M, G);
        if (!(mu < x3)) return false;
        closest = Math.max(closest, mu / x3);
      }
      return Math.abs(closest - K3_SPOTCHECK_CLOSEST_RATIO) < 1e-9;
    },
  },
  {
    id: "imp95504-honesty-gate",
    description:
      "the verdict names the executed residual, keeps K >= 3 OPEN, promotes " +
      "no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95504_CAYLEY_PENCIL_CONFDOM_K2.promotesBound === false &&
      /NO QED/.test(IMP95504_CAYLEY_PENCIL_CONFDOM_K2.verdict) &&
      /refereed bound is changed/i.test(IMP95504_CAYLEY_PENCIL_CONFDOM_K2.verdict) &&
      /ii-next4/.test(IMP95504_CAYLEY_PENCIL_CONFDOM_K2.title) &&
      /K >= 3 OPEN/.test(IMP95504_CAYLEY_PENCIL_CONFDOM_K2.confDomStatus) &&
      /stays OPEN/.test(IMP95504_CAYLEY_PENCIL_CONFDOM_K2.verdict),
  },
];

for (const a of IMP95504_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95504-cayley-pencil-confdom-k2 assertion failed: ${a.id}`);
  }
}

export default IMP95504_CAYLEY_PENCIL_CONFDOM_K2;
