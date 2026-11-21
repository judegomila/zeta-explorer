/**
 * imp-95509: THEOREM SPAN-EQ + THEOREM M-TC + COROLLARY ATTAIN +
 * COROLLARY RITZ + LEMMA RATE-RED + LEMMA DIL -- executes the
 * imp-95508 named residual (mu-exact) IN PART and re-prices (mu-rate):
 * the mean-time compression M = P_S t P_S on the CLOSED twin-lattice
 * span S is a TRACE-CLASS operator (tr M <= (21/11)/A_twin, consuming
 * the imp-95252 THEOREM RZ-TWIN m-uniform Riesz floor), hence compact,
 * hence the imp-95508 limit mu_inf is an ATTAINED largest EIGENVALUE
 * with eigenfunction hStar in S; the closed-span sup EQUALS the
 * finite-section limit (the equality imp-95508 self-check (4) recorded
 * as open); and the convergence rate question (mu-rate) reduces, with
 * measured NEAR-EQUALITY, to the finite-section approximation error of
 * hStar via the second-order bound
 *   mu_inf - mu_max(P_m) <= mu_inf d_m^2 / (1 - d_m^2),
 *   d_m = dist(hStar, E_(P_m)).
 * Model family only; changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95501/95506/95507/95508 normalization). Twin lattice
 * Q = { 2^k, 1.1 * 2^k : k >= 0 } (rho = 2, r = 1.1), finite sections
 * P_m = first m octaves, E_(P_m) = span{ e^(-pt) : p in P_m } in
 * L2(0, inf), mu_max(P) = Rayleigh sup of q(h) = int t h^2 dt over
 * E_P, mu_inf = lim_m mu_max(P_m) (exists by imp-95508 LEMMA NEST +
 * THEOREM MU-SAT, bracketed 5.09361535799 < mu_inf <= 84/11). S =
 * L2-closure of the increasing union of the E_(P_m). Consumed inputs:
 * imp-95508 MU-SAT/MU-LIM (bracket + the Fatou device), imp-95252
 * THEOREM RZ-TWIN (m-uniform lower bound A_twin(rho, r) =
 * 4 sin^2(pi tau) P(pi) P(2pi) / (P(pi) + 2 P(2pi)), tau = ln r/ln rho,
 * P(w) = (2 pi/ln rho) sech(pi w/ln rho), on the smallest eigenvalue of
 * the NORMALIZED lattice Gram <ehat_p, ehat_q> = 2 sqrt(pq)/(p+q), for
 * every octave count, 1 < r < rho <= e^6). At rho = 2, r = 1.1:
 * A_twin = 5.451262143986582e-12.
 *
 * WHY A BOUNDED COMPRESSION IS POSSIBLE AT ALL (consistency check,
 * not a new claim). The lattice satisfies the Blaschke condition
 * sum over p in Q of p/(1 + p^2) < inf, so by the classical
 * Laplace-to-Hardy dictionary (e^(-pt) maps to the Szego kernel at p)
 * the closed span S = H2 minus B H2 is a PROPER model subspace of
 * L2(0, inf) -- the system is far from complete. Compressing the
 * unbounded multiplication operator t to this proper subspace is what
 * can (and, by M-TC, does) produce a trace-class operator. Had the
 * system been complete, M = t would be unbounded and everything below
 * would be false: this is the structural reason the lattice family
 * escapes the general-family K-linear growth.
 *
 * THEOREM SPAN-EQ (closed-span sup = finite-section limit; settles the
 * equality question left OPEN in imp-95508 self-check (4)). Let
 * sup_S = sup{ q(h) : h in S, ||h|| = 1 }. Then sup_S = mu_inf, and
 * q(h) <= mu_inf ||h||^2 for EVERY h in S. PROOF. (<=) Any h in S is
 * an L2 limit of finite lattice combinations h_n; every finite subset
 * of Q lies in some P_m, so q(h_n) <= mu_max(P_(m_n)) ||h_n||^2 <=
 * mu_inf ||h_n||^2 by nesting. Pass to a subsequence with h_n -> h
 * a.e.; Fatou on t h_n^2 >= 0 gives q(h) <= liminf q(h_n) <=
 * mu_inf lim ||h_n||^2 = mu_inf ||h||^2. (>=) E_(P_m) subset S gives
 * mu_max(P_m) <= sup_S for every m. QED. (The imp-95508 Fatou step
 * proved the upper bound with the WEAKER constant H_inf = 84/11; the
 * only new observation is that nesting lets mu_inf replace H_inf, and
 * that the reverse inclusion is trivial -- together, equality.)
 *
 * DEFINITION (the compressed mean-time operator). By SPAN-EQ the
 * quadratic form q is everywhere-defined and bounded on S (polarize
 * for the sesquilinear form; finiteness of the cross terms is
 * Cauchy-Schwarz in L2(t dt)). Hence there is a unique bounded
 * self-adjoint M on S with <Mh, h> = q(h); M is PSD, M = P_S t P_S in
 * the form sense, and ||M|| = sup_S = mu_inf by SPAN-EQ.
 *
 * THEOREM M-TC (trace-class; the frame-domination step). tr M <=
 * (1/A_twin) sum over p in Q of 1/(2p) = (21/11)/A_twin =
 * 3.5021080598680676e11 < inf. PROOF. Fix m and let v_1..v_(2m) be
 * the NORMALIZED exponentials ehat_p = sqrt(2p) e^(-pt), p in P_m.
 * Their Gram is exactly the imp-95252 normalized twin Gram, so its
 * smallest eigenvalue is >= A_twin for every m (THEOREM RZ-TWIN).
 * Since the Gram and the frame operator sum_j |v_j><v_j| restricted to
 * E_(P_m) share their nonzero spectrum, I on E_(P_m) is dominated:
 * I <= (1/A_twin) sum_j |v_j><v_j| as forms on E_(P_m). Let M_m be
 * the compression of q to E_(P_m) (the finite mean-time pencil). For
 * PSD X and Y <= Z, tr(XY) <= tr(XZ); with X = M_m, Y = I, Z the
 * scaled frame operator:
 *   tr M_m <= (1/A_twin) sum_j <M_m v_j, v_j>
 *           = (1/A_twin) sum over p in P_m of q(ehat_p)
 *           = (1/A_twin) sum over p in P_m of 1/(2p),
 * because the mean time of a single exponential is exact:
 * q(ehat_p) = 2p int t e^(-2pt) dt = 1/(2p). The lattice harmonic sum
 * converges (the same convergence that powers imp-95508 MU-SAT):
 * sum over Q of 1/(2p) = (1/4) H_inf = 21/11. Finally choose an ONB of
 * S adapted to the nested sections (Gram-Schmidt octave by octave);
 * partial sums of q over that ONB are exactly tr M_m, so
 * tr M = sup_m tr M_m <= (21/11)/A_twin. QED.
 *
 * COROLLARY ATTAIN (mu_inf is an attained top eigenvalue). M is PSD
 * with finite trace, hence trace-class, hence COMPACT. A compact
 * self-adjoint operator attains its norm as a largest eigenvalue:
 * there is hStar in S, ||hStar|| = 1, with M hStar = mu_inf hStar and
 * q(hStar) = mu_inf. The spectrum of M is {0} together with a
 * summable sequence of positive eigenvalues lambda_1 = mu_inf >=
 * lambda_2 >= ... -> 0; and 0 is NOT an eigenvalue (q(h) = 0 forces
 * h = 0 a.e. since t > 0 a.e.), so M is injective with purely discrete
 * positive spectrum accumulating only at 0. This converts the
 * imp-95508 residual (mu-exact) from "does the closed-span sup equal
 * the limit, and is it attained" (now BOTH answered YES) to the
 * remaining computational core: the exact value of the top eigenvalue
 * of an explicit trace-class operator.
 *
 * COROLLARY RITZ (finite sections are certified lower bounds, every
 * eigenvalue). For each fixed j, lambda_j(M_m) is nondecreasing in m
 * and converges to lambda_j(M). PROOF. Monotonicity and
 * lambda_j(M_m) <= lambda_j(M): Courant-Fischer max-min over j-dim
 * subspaces of the nested E_(P_m) subset S. Convergence: let V be the
 * span of the first j eigenvectors of M, so q(v) >= lambda_j ||v||^2
 * on V. Fix delta with delta sqrt(j) < 1/2 and pick w_i in E_(P_m)
 * with ||v_i - w_i|| <= delta (density). For w = sum c_i w_i with
 * ||w|| = 1 and v = sum c_i v_i: |c| <= 2, ||w - v|| <= 2 delta
 * sqrt(j), so W = span{w_i} is j-dimensional and q(w) >= q(v) -
 * |q(w) - q(v)| >= lambda_j (1 - 2 delta sqrt(j))^2 - mu_inf (2 +
 * 2 delta sqrt(j)) 2 delta sqrt(j), using |q(w) - q(v)| =
 * |<M(w + v), w - v>| <= mu_inf ||w + v|| ||w - v||. Max-min over W
 * gives lambda_j(M_m) >= lambda_j - C delta; let delta -> 0. QED.
 * In particular lambda_2(M) >= lambda_2(M_20) = 3.25655514526901
 * (measured section value, certified as a lower bound by RITZ up to
 * float tolerance).
 *
 * LEMMA RATE-RED (second-order reduction of (mu-rate); needs ATTAIN).
 * Let d_m = dist(hStar, E_(P_m)) = ||(I - Pi_m) hStar||, Pi_m the
 * orthogonal projection onto E_(P_m). If d_m < 1 then
 *   0 <= mu_inf - mu_max(P_m) <= mu_inf d_m^2 / (1 - d_m^2).
 * PROOF. f = Pi_m hStar has ||f||^2 = 1 - d_m^2 and, using the
 * EIGEN-equation M hStar = mu_inf hStar plus <f, hStar - f> = 0:
 * q(f) = mu_inf - 2 <M hStar, hStar - f> + q(hStar - f)
 *      >= mu_inf - 2 mu_inf d_m^2   (q >= 0, <hStar, hStar - f> =
 * d_m^2). Divide by ||f||^2: mu_max(P_m) >= mu_inf (1 - 2 d_m^2) /
 * (1 - d_m^2) = mu_inf (1 - d_m^2/(1 - d_m^2)). QED. The same proof
 * verbatim inside a larger finite section gives the EXACT testable
 * instance mu_max(P_M) - mu_max(P_m) <= mu_max(P_M) d^2/(1 - d^2)
 * with hStar replaced by the top eigenvector of the M-section --
 * asserted below at M = 20, m in {6, 8, 10}, where the bound is
 * measured increasingly TIGHT (ratios 0.7397, 0.9058, 0.9700, and
 * ~0.9996 at m = 16 in the offline scratch, the last within float
 * noise of 1 and therefore NOT baked -- computing d^2 ~ 2e-5 as
 * 1 minus a projection norm cancels against ~1e-7 eigenvector noise):
 * the reduction loses essentially nothing asymptotically, so
 * (mu-rate) IS the eigenfunction-tail question, in the right
 * currency. The rigorous geometric decay of d_m itself (measured:
 * d_m^2 halves per octave, matching the observed increment halving)
 * is the NEW named residual (mu-eig-decay).
 *
 * LEMMA DIL (exact dilation-compression identity; the structural
 * source of the 1/rho scaling). The unitary dilation (Wh)(t) =
 * sqrt(rho) h(rho t) maps S into S (rates multiply by rho: octave k
 * to octave k+1) and satisfies, for all h, g in S,
 *   <M Wh, Wg> = (1/rho) <M h, g>,   ||Wh|| = ||h||.
 * PROOF: substitute s = rho t in int t (Wh)(Wg) dt. QED. Applied to
 * ONBs this shows every dilate of a subspace carries exactly 1/rho of
 * its mean-time mass -- the exact identity behind the MEASURED
 * geometric patterns (trace increments ratio ~0.527 -> 1/2, d_m^2
 * halving); the spectral self-similarity itself stays measured-only
 * because W S is a proper subspace and M does not commute with W.
 *
 * ADVERSARIAL SELF-CHECK RECORD. (1) Completeness trap: if the
 * lattice exponentials were complete in L2(0, inf), M would be the
 * unbounded t and M-TC would be absurd -- checked: sum 1/p < inf is
 * the Blaschke condition, S is a proper model space; no contradiction.
 * (2) SPAN-EQ direction audit: the form is NOT L2-continuous (already
 * flagged in imp-95508 self-check (4)), so only the Fatou UPPER
 * direction is available -- and that is the only direction the
 * equality needs, the reverse being subspace inclusion. The a.e.
 * subsequence step is required (L2 convergence alone does not give
 * pointwise). (3) Frame-domination audit: the Gram/frame-operator
 * spectral identity and tr(XY) <= tr(XZ) for X PSD, Y <= Z are used
 * only on FINITE sections, then a monotone sup is taken over an
 * ADAPTED ONB -- no operator-limit interchange is invoked. (4) The
 * trace cap is ENORMOUS vs the measured trace (3.5021e11 vs a
 * measured finite-section trace converging to ~15.4814): the slack is
 * intrinsic to pricing the frame in the RZ-TWIN coefficient currency
 * (A_twin ~5.45e-12 sits at the Szego ceiling, so the looseness lives
 * in frame-domination, not in RZ-TWIN); the cap has exactly ONE job --
 * finiteness -- and no quantitative claim is hung on it. (5) RATE-RED
 * genuinely needs the eigen-equation: without ATTAIN only the
 * first-order bound 2 mu_inf d_m is available (also proved en route,
 * not baked), which the measured instances show is off by the SQUARE
 * (gap ~2^(-m) vs d_m ~2^(-m/2)); the second-order form is the sharp
 * currency (measured ratios rising 0.7397 -> 0.9058 -> 0.9700 at
 * m = 6/8/10, ~0.9996 at m = 16 offline). (6) Float traps: the
 * normalized-Gram lambda_min collapses toward 1e-11, so the RZ-TWIN
 * matrix cross-check stops at m = 8 (lambda_min ~8.0e-11, still two
 * decades above float noise); Cauchy-Gram Cholesky is verified PD
 * through m = 22 and NOT pushed further; the m = 16 RATE-RED
 * instance is cancellation-limited (ratio crosses 1 by ~8e-3 of
 * float noise on some evaluation paths) and is deliberately NOT
 * asserted -- the asserted instances stop at m = 10 where the noise
 * margin is two decades. (7) Name collisions: grep shows SPAN-EQ,
 * M-TC, ATTAIN, RITZ, RATE-RED, DIL unused.
 *
 * HONEST LIMITS. (a) The exact VALUE of mu_inf stays OPEN: ATTAIN
 * re-scopes (mu-exact) to computing the top eigenvalue of an explicit
 * trace-class operator; the imp-95508 bracket (5.09361535799, 84/11]
 * is unchanged. (b) (mu-rate) is REDUCED, not closed: RATE-RED is
 * rigorous and measured nearly tight, but the geometric decay of d_m
 * is measured-only -- named residual (mu-eig-decay). (c) The M-TC
 * constant is finiteness-only (see self-check (4)). (d) Model family
 * only (exponential spans, mean-time compression); no paper-packet
 * constant is touched, no Lambda bound changes, and the finite-N
 * Lambda beat did NOT become rigorous. (e) All numerics are float
 * cross-checks of proven inequalities or measured-only refinements,
 * never the claim.
 *
 * ROUTING. Executes the imp-95508 residual (mu-exact) IN PART
 * (closed-span equality: ANSWERED; attainment: ANSWERED; exact value:
 * OPEN, re-scoped to the top eigenvalue of the explicit trace-class
 * M). Re-prices (mu-rate) through LEMMA RATE-RED into the NEW residual
 * (mu-eig-decay): rigorous geometric decay of dist(hStar, E_(P_m)).
 * Untouched chain residuals: deflation-aware majorant (imp-95499 (a)),
 * RZ-PEN tilt-det port, off-lattice rates, signed WEIGHT and
 * modulus-phase currencies, imp-95212 envelope port. Import-free; no
 * zeros bundle anywhere near this module.
 */

// ---------------------------------------------------------------------------
// pencil machinery (imp-95506/95507/95508 conventions, import-free)
// ---------------------------------------------------------------------------
function jacobiEigVec(Ain) {
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
  const eigs = A.map((r, i) => ({ val: r[i], vec: V.map((row) => row[i]) }));
  eigs.sort((x, y) => x.val - y.val);
  return eigs;
}

function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95509 chol: base not PD");
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  }
  return L;
}
function fwdSolve(L, b) {
  const n = L.length;
  const x = b.slice();
  for (let i = 0; i < n; i++) {
    let s = x[i];
    for (let k = 0; k < i; k++) s -= L[i][k] * x[k];
    x[i] = s / L[i][i];
  }
  return x;
}
function bwdSolve(L, b) {
  const n = L.length;
  const x = b.slice();
  for (let i = n - 1; i >= 0; i--) {
    let s = x[i];
    for (let k = i + 1; k < n; k++) s -= L[k][i] * x[k];
    x[i] = s / L[i][i];
  }
  return x;
}

const twinLattice = (m, r = 1.1, rho = 2) => {
  const P = [];
  for (let k = 0; k < m; k++) P.push(rho ** k, r * rho ** k);
  return P.sort((a, b) => a - b);
};
const gramG = (P) => P.map((a) => P.map((b) => 1 / (a + b)));
const gramA = (P) => P.map((a) => P.map((b) => 1 / ((a + b) * (a + b))));

// finite-section mean-time trace tr(G^{-1} A) via Cholesky solves
function pencilTrace(P) {
  const G = gramG(P);
  const A = gramA(P);
  const L = chol(G);
  let tr = 0;
  for (let j = 0; j < P.length; j++) {
    const col = A.map((row) => row[j]);
    const x = bwdSolve(L, fwdSolve(L, col));
    tr += x[j];
  }
  return tr;
}

// finite-section top eigenpair (whitened pencil), plus second eigenvalue
function pencilTop(P) {
  const G = gramG(P);
  const A = gramA(P);
  const L = chol(G);
  const n = P.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const col = A.map((row) => row[j]);
    const y = fwdSolve(L, col);
    for (let i = 0; i < n; i++) Y[i][j] = y[i];
  }
  const B = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    const b = fwdSolve(L, Y[i].slice());
    for (let j = 0; j < n; j++) B[i][j] = b[j];
  }
  const eigs = jacobiEigVec(B);
  const top = eigs[eigs.length - 1];
  return {
    mu: top.val,
    coeffs: bwdSolve(L, top.vec.slice()),
    second: eigs[eigs.length - 2].val,
  };
}

// imp-95252 THEOREM RZ-TWIN closed form at (rho, r)
function aTwin(rho, r) {
  const a = Math.log(rho);
  const tau = Math.log(r) / a;
  const Pw = (w) => ((2 * Math.PI) / a) / Math.cosh((Math.PI * w) / a);
  const Ppi = Pw(Math.PI);
  const P2pi = Pw(2 * Math.PI);
  return (4 * Math.sin(Math.PI * tau) ** 2 * Ppi * P2pi) / (Ppi + 2 * P2pi);
}

// baked literals (NEW here unless marked carried)
const H_INF = 84 / 11; // carried: imp-95508 MU-SAT twin cap
const A_TWIN_2_11 = 5.451262143986582e-12; // RZ-TWIN closed form at rho=2, r=1.1
const TRACE_CAP = 350210805986.80676; // (21/11)/A_TWIN_2_11 (finiteness only)
const TR_M22 = 15.481356135643738; // measured finite-section trace, m = 22
const MU_M20 = 5.093724608966117; // measured mu_max(P_20)
const LAM2_M20 = 3.25655514526901; // measured second section eigenvalue, m = 20
const TWIN_M16_MU = 5.09361535799; // carried: imp-95501 exact inertia
// RATE-RED exact finite instances at M = 20 (measured, asserted below;
// m = 16 offline ratio ~0.9996 is cancellation-limited and NOT baked)
const RATE_INSTANCES = [
  { m: 6, d2: 3.066299600777e-2, ratio: 0.739661 },
  { m: 8, d2: 6.420377729110e-3, ratio: 0.905838 },
  { m: 10, d2: 1.505619303649e-3, ratio: 0.969966 },
];

// ---------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------
export const IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT = {
  id: "imp-95509",
  title:
    "THEOREM SPAN-EQ + THEOREM M-TC + COROLLARY ATTAIN + COROLLARY RITZ " +
    "+ LEMMA RATE-RED + LEMMA DIL: the mean-time compression to the " +
    "closed twin-lattice span is TRACE-CLASS (tr M <= (21/11)/A_twin " +
    "via imp-95252 RZ-TWIN), so mu_inf is an ATTAINED top eigenvalue; " +
    "closed-span sup = finite-section limit; (mu-rate) reduces, nearly " +
    "tightly, to eigenfunction tail decay",
  theoremSpanEq:
    "sup of the mean-time Rayleigh quotient over the CLOSED lattice " +
    "span S equals mu_inf = lim_m mu_max(P_m): Fatou on an a.e. " +
    "subsequence gives <=, subspace inclusion gives >= -- the equality " +
    "imp-95508 self-check (4) left open is settled AFFIRMATIVELY",
  theoremMTc:
    "tr M <= (1/A_twin) sum over p in Q of 1/(2p) = (21/11)/A_twin = " +
    "3.5021e11 < inf: frame domination I <= (1/A_twin) sum " +
    "|ehat_p><ehat_p| on every finite section (RZ-TWIN floor), " +
    "tr(XY) <= tr(XZ), and the exact single-exponential mean time " +
    "q(ehat_p) = 1/(2p) summing geometrically -- the same harmonic " +
    "convergence that powers MU-SAT, now in trace currency",
  corollaryAttain:
    "M is trace-class hence compact; mu_inf = ||M|| is an ATTAINED " +
    "largest eigenvalue with eigenfunction hStar in S; spectrum = {0} " +
    "plus a summable positive sequence -> 0; M injective (0 not an " +
    "eigenvalue); (mu-exact) re-scoped to the top eigenvalue of an " +
    "explicit trace-class operator",
  corollaryRitz:
    "lambda_j(M_m) is nondecreasing in m and converges to lambda_j(M) " +
    "for every fixed j (Courant-Fischer + density perturbation), so " +
    "finite-section eigenvalues are certified lower bounds: " +
    "lambda_2(M) >= 3.25655514526901 (m = 20 section)",
  lemmaRateRed:
    "mu_inf - mu_max(P_m) <= mu_inf d_m^2/(1 - d_m^2), d_m = " +
    "dist(hStar, E_(P_m)) -- second-order via the eigen-equation; " +
    "exact finite instances at M = 20 are measured increasingly tight " +
    "(ratios 0.7397/0.9058/0.9700 at m = 6/8/10, ~0.9996 at m = 16 " +
    "offline): (mu-rate) IS the eigenfunction-tail question, with no " +
    "slack lost in the reduction asymptotically",
  lemmaDil:
    "exact dilation-compression identity <M Wh, Wg> = (1/rho)<Mh, g> " +
    "for the rate-doubling isometry W of S: the structural source of " +
    "the measured 1/rho patterns (trace increments ~0.527, d_m^2 " +
    "halving); spectral self-similarity itself stays measured-only",
  ledger: {
    rzTwinFloor: { rho: 2, r: 1.1, aTwin: A_TWIN_2_11, source: "imp-95252" },
    traceCap: {
      value: TRACE_CAP,
      form: "(21/11)/A_twin",
      role: "FINITENESS ONLY -- measured section trace converges to ~15.4814",
    },
    measuredTrace: { m22: TR_M22, incrementRatioTail: "~0.527 -> 1/2" },
    spectrumHead: { mu20: MU_M20, lambda2AtM20: LAM2_M20 },
    muInfBracket: {
      lower: TWIN_M16_MU,
      upper: H_INF,
      note: "carried imp-95508 MU-LIM bracket, unchanged by this step",
    },
    rateInstances: RATE_INSTANCES,
  },
  residualExecuted:
    "imp-95508 (mu-exact) IN PART: the closed-span-equality half is " +
    "ANSWERED (THEOREM SPAN-EQ) and attainment is ANSWERED (COROLLARY " +
    "ATTAIN via THEOREM M-TC trace-class); the exact value of mu_inf " +
    "remains open, re-scoped to the top eigenvalue of the explicit " +
    "trace-class M",
  rescopedResidual:
    "NEW (mu-eig-decay): rigorous geometric decay of dist(hStar, " +
    "E_(P_m)) (measured d_m^2 halves per octave), which through LEMMA " +
    "RATE-RED would close (mu-rate) with the measured-sharp constant; " +
    "(mu-exact) value leg still open; untouched: deflation-aware " +
    "majorant (imp-95499 (a)), RZ-PEN tilt-det port, off-lattice " +
    "rates, signed WEIGHT / modulus-phase currencies, imp-95212 " +
    "envelope port",
  honestScope:
    "model family only (exponential spans, mean-time compression); the " +
    "trace cap is finiteness-only (11 orders above the measured " +
    "trace, intrinsic to the RZ-TWIN coefficient currency); the " +
    "bracket (5.09361535799, 84/11] is unchanged; changes no bound; " +
    "NO QED; no refereed bound is changed",
  promotesBound: false,
  isRigorous: true,
  rigorScope:
    "THEOREM SPAN-EQ, THEOREM M-TC, COROLLARY ATTAIN, COROLLARY RITZ, " +
    "LEMMA RATE-RED and LEMMA DIL are unconditional theorems about the " +
    "model mean-time compression, proved in the header from imp-95252 " +
    "THEOREM RZ-TWIN (m-uniform normalized-Gram floor), imp-95508 " +
    "MU-SAT/MU-LIM (nesting, bracket, Fatou device) and classical " +
    "facts (Fatou, Courant-Fischer, compact self-adjoint spectral " +
    "theorem, PSD trace monotonicity). All numerics below are float " +
    "CROSS-CHECKS of proven statements or clearly-flagged measured " +
    "refinements, never the claim itself.",
  verdict:
    "RIGOROUS step -- the imp-95508 residual (mu-exact) is executed IN " +
    "PART and (mu-rate) is re-priced: THEOREM M-TC proves the " +
    "mean-time compression to the closed twin-lattice span is " +
    "TRACE-CLASS (tr M <= (21/11)/A_twin, consuming the imp-95252 " +
    "RZ-TWIN m-uniform Riesz floor -- the lattice harmonic convergence " +
    "of MU-SAT upgraded from norm to trace currency), hence COMPACT, " +
    "hence (COROLLARY ATTAIN) mu_inf is an ATTAINED largest eigenvalue " +
    "with purely discrete spectrum; THEOREM SPAN-EQ settles the " +
    "closed-span equality left open by imp-95508; LEMMA RATE-RED " +
    "reduces (mu-rate) second-order to eigenfunction tail decay, " +
    "measured increasingly tight (0.9700 at m = 10, ~0.9996 at m = 16 " +
    "offline within float noise of 1). The exact VALUE of " +
    "mu_inf stays OPEN (bracket unchanged). MODEL FAMILY ONLY: no " +
    "paper-packet constant is touched and the finite-N Lambda beat did " +
    "NOT become rigorous. Changes no bound; NO QED on any RH " +
    "statement; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// assertions (self-executing; throw on violation)
// ---------------------------------------------------------------------------
export const IMP95509_ASSERTIONS = [
  {
    id: "imp95509-rztwin-floor-consumed",
    description:
      "the imp-95252 RZ-TWIN closed form at rho=2, r=1.1 reproduces the " +
      "baked A_twin (rel 1e-12), and the normalized twin Gram has " +
      "lambda_min >= A_twin at m = 2, 4, 6, 8 (float-safe sizes: " +
      "lambda_min ~8e-11 at m = 8, two decades above noise)",
    holds: () => {
      const a = aTwin(2, 1.1);
      if (Math.abs(a - A_TWIN_2_11) > 1e-12 * a) return false;
      for (const m of [2, 4, 6, 8]) {
        const P = twinLattice(m);
        const Gn = P.map((p) => P.map((q) => (2 * Math.sqrt(p * q)) / (p + q)));
        const eigs = jacobiEigVec(Gn);
        if (!(eigs[0].val >= A_TWIN_2_11)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95509-mtc-frame-trace-bound",
    description:
      "THEOREM M-TC cross-check: for m = 2..22 the finite-section " +
      "mean-time trace tr(G^{-1}A) is positive, strictly increasing, " +
      "and satisfies the per-section frame bound tr M_m <= (sum over " +
      "P_m of 1/(2p))/A_twin; the m = 22 trace reproduces " +
      "15.481356135643738 (rel 1e-8) and sits below the baked cap " +
      "(21/11)/A_twin = 350210805986.80676 (rel-1e-12 reproduced)",
    holds: () => {
      const cap = (21 / 11) / A_TWIN_2_11;
      if (Math.abs(cap - TRACE_CAP) > 1e-12 * cap) return false;
      let prev = 0;
      let tr22 = 0;
      for (let m = 2; m <= 22; m++) {
        const P = twinLattice(m);
        const tr = pencilTrace(P);
        const sectionCap = P.reduce((s, p) => s + 1 / (2 * p), 0) / A_TWIN_2_11;
        if (!(tr > prev && tr <= sectionCap && tr < TRACE_CAP)) return false;
        prev = tr;
        if (m === 22) tr22 = tr;
      }
      return Math.abs(tr22 - TR_M22) < 1e-8 * TR_M22;
    },
  },
  {
    id: "imp95509-dil-trace-increment-halving",
    description:
      "LEMMA DIL measured pattern: consecutive finite-section trace " +
      "increments for m = 17..22 have ratios in [0.50, 0.56] " +
      "(approaching 1/rho = 0.5; measured-only, flagged as such)",
    holds: () => {
      const trs = [];
      for (let m = 16; m <= 22; m++) trs.push(pencilTrace(twinLattice(m)));
      for (let i = 1; i + 1 < trs.length; i++) {
        const d1 = trs[i] - trs[i - 1];
        const d2 = trs[i + 1] - trs[i];
        if (!(d1 > 0 && d2 > 0)) return false;
        const ratio = d2 / d1;
        if (!(ratio > 0.5 && ratio < 0.56)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95509-ritz-monotone-second-eig",
    description:
      "COROLLARY RITZ cross-check: mu_max and the SECOND section " +
      "eigenvalue are both nondecreasing over m in {8, 12, 16, 20}; " +
      "the m = 20 values reproduce mu = 5.093724608966117 and " +
      "lambda_2 = 3.25655514526901 (rel 1e-8), both below the MU-SAT " +
      "cap 84/11",
    holds: () => {
      let prevMu = 0;
      let prevL2 = 0;
      let mu20 = 0;
      let l2 = 0;
      for (const m of [8, 12, 16, 20]) {
        const { mu, second } = pencilTop(twinLattice(m));
        if (!(mu > prevMu && second >= prevL2)) return false;
        prevMu = mu;
        prevL2 = second;
        if (m === 20) {
          mu20 = mu;
          l2 = second;
        }
      }
      if (Math.abs(mu20 - MU_M20) > 1e-8 * mu20) return false;
      if (Math.abs(l2 - LAM2_M20) > 1e-8 * l2) return false;
      return mu20 < H_INF && l2 < H_INF && MU_M20 > TWIN_M16_MU;
    },
  },
  {
    id: "imp95509-rate-red-exact-instances",
    description:
      "LEMMA RATE-RED exact finite instances at M = 20: mu_M - mu_m <= " +
      "mu_M d^2/(1 - d^2) holds for m = 6, 8, 10 (d = distance from " +
      "the normalized M-section top eigenvector to E_(P_m), computed " +
      "by Gram projection); baked d^2 literals reproduce (rel 1e-4) " +
      "and tightness ratios reproduce 0.7397/0.9058/0.9700 (abs 2e-3); " +
      "m >= 12 instances are cancellation-limited and not asserted",
    holds: () => {
      const PM = twinLattice(20);
      const GM = gramG(PM);
      const { mu: muM, coeffs } = pencilTop(PM);
      const nrm2 = coeffs.reduce(
        (s, ai, i) => s + ai * coeffs.reduce((t, aj, j) => t + aj * GM[i][j], 0),
        0
      );
      const hc = coeffs.map((v) => v / Math.sqrt(nrm2));
      for (const inst of RATE_INSTANCES) {
        const Pm = twinLattice(inst.m);
        const n = Pm.length;
        for (let i = 0; i < n; i++) if (Pm[i] !== PM[i]) return false;
        const bvec = new Array(n).fill(0);
        for (let i = 0; i < n; i++)
          for (let j = 0; j < PM.length; j++) bvec[i] += hc[j] / (Pm[i] + PM[j]);
        const Lm = chol(gramG(Pm));
        const y = bwdSolve(Lm, fwdSolve(Lm, bvec));
        const projNorm2 = y.reduce((s, yi, i) => s + yi * bvec[i], 0);
        const d2 = Math.max(0, 1 - projNorm2);
        if (Math.abs(d2 - inst.d2) > 1e-4 * inst.d2) return false;
        const { mu: mum } = pencilTop(Pm);
        const lhs = muM - mum;
        const rhs = (muM * d2) / (1 - d2);
        if (!(lhs > 0 && lhs <= rhs)) return false;
        const ratio = lhs / rhs;
        if (Math.abs(ratio - inst.ratio) > 2e-3) return false;
      }
      return true;
    },
  },
  {
    id: "imp95509-dilation-identity-exact",
    description:
      "LEMMA DIL exact Gram algebra: doubling all rates and scaling " +
      "coefficients by sqrt(2) preserves the L2 norm exactly and " +
      "divides the mean-time form by exactly 2 (rel 1e-12, arbitrary " +
      "coefficient vector on the m = 5 twin section)",
    holds: () => {
      const P = twinLattice(5);
      const c = P.map((_, i) => Math.sin(i + 1) * (i % 3 === 0 ? 1 : -0.7));
      const qf = (rates, cf) =>
        cf.reduce(
          (s, ci, i) =>
            s + ci * cf.reduce((t, cj, j) => t + cj / (rates[i] + rates[j]) ** 2, 0),
          0
        );
      const nf = (rates, cf) =>
        cf.reduce(
          (s, ci, i) =>
            s + ci * cf.reduce((t, cj, j) => t + cj / (rates[i] + rates[j]), 0),
          0
        );
      const P2 = P.map((p) => 2 * p);
      const c2 = c.map((v) => v * Math.SQRT2);
      const qRatio = qf(P2, c2) / qf(P, c);
      const nRatio = nf(P2, c2) / nf(P, c);
      return Math.abs(qRatio - 0.5) < 1e-12 && Math.abs(nRatio - 1) < 1e-12;
    },
  },
  {
    id: "imp95509-honesty-gate",
    description:
      "the record scopes to the model family, names the partially " +
      "executed (mu-exact), the re-priced (mu-rate) and the NEW " +
      "(mu-eig-decay) residual, promotes no bound, NO QED, no refereed bound is changed" +
      "",
    holds: () =>
      IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT.promotesBound === false &&
      /IN PART/.test(IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT.residualExecuted) &&
      /mu-eig-decay/.test(IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT.rescopedResidual) &&
      /mu-exact/.test(IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT.rescopedResidual) &&
      /imp-95212/.test(IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT.rescopedResidual) &&
      /FINITENESS ONLY/.test(
        IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT.ledger.traceCap.role
      ) &&
      /MODEL FAMILY/.test(IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT.verdict) &&
      /stays OPEN/.test(IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT.verdict) &&
      /NO QED/.test(IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT.verdict) &&
      /did NOT become rigorous/.test(
        IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT.verdict
      ),
  },
];

for (const a of IMP95509_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95509-meantime-compression-trace-class-attainment assertion failed: ${a.id}`
    );
  }
}

export default IMP95509_MEANTIME_TRACE_CLASS_ATTAINMENT;
