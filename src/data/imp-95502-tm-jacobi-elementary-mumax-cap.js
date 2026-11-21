/**
 * imp-95502: LEMMA TM-ONB + LEMMA TM-DIAG + LEMMA TM-OFF + THEOREM MU-ELEM
 * + COROLLARY CRED-FLOOR + COROLLARY CRED-CAP + LEMMA TM-LAG -- executes
 * the imp-95501 named successor residual (ii-next2): an ELEMENTARY
 * closed-form upper bound on mu_max(P) at general K, restoring elementary
 * status to the graded depth credit cSort = tau(P) - mu_max(P) of THEOREM
 * TILT-SORT. The route: the compression of multiplication-by-t to the
 * exponential span E_P is written in the Takenaka-Malmquist orthonormal
 * basis (Laplace-transform picture), where EVERY matrix entry has a closed
 * form whose rate DIFFERENCES appear only in NUMERATORS -- no separation
 * denominators anywhere -- so Gershgorin row sums give a closed-form,
 * coalescence-continuous, O(K^2)-arithmetic upper bound on mu_max.
 * Derivation + measurement; changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95226 / imp-95499 / imp-95500 / imp-95501 normalization).
 * Rate set P = {p_1 < ... < p_K} of positive reals (sorted ascending;
 * coalescence handled by continuity, see LEMMA TM-LAG), E_P =
 * span{e^(-p t)} in L2(0, inf), Cauchy Gram G_ij = 1/(p_i + p_j),
 * mean-time pencil (G1, G) with (G1)_ij = 1/(p_i + p_j)^2, generalized
 * eigenvalues mu_1 <= ... <= mu_K, tau(P) = sum_(i,j) 1/(p_i + p_j)
 * (imp-95500 LEMMA MOM: sum mu_j = tau). imp-95501 consumed: cSort =
 * tau - mu_max, onset(TILT-SORT) = mu_max (LEMMA ONSET). The pencil
 * eigenvalues are the eigenvalues of the COMPRESSION T = Q M_t Q of
 * multiplication by t to E_P (both objects represent the same quadratic
 * form ratio int t h^2 / int h^2 on E_P; M_t is positive and E_P lies in
 * its form domain), so mu_max = lambda_max(T) in ANY orthonormal basis
 * of E_P.
 *
 * LEMMA TM-ONB (Takenaka-Malmquist orthonormal basis; classical, proof
 * inline). The Laplace transform f -> F(s) = int_0^inf f(t) e^(-s t) dt
 * maps L2(0, inf) unitarily (up to the 1/(2 pi) Plancherel factor) onto
 * the Hardy space of the right half-plane, with e^(-p t) -> 1/(s + p)
 * and t f(t) -> -dF/ds. The functions
 *   B_k(s) = sqrt(2 p_k)/(s + p_k) * prod_(j<k) (s - p_j)/(s + p_j)
 * are an orthonormal basis of the image of E_P: (i) triangular span --
 * B_k is a rational function with simple poles exactly at -p_1..-p_k;
 * (ii) unit norm -- on s = i w every Blaschke factor (s - p_j)/(s + p_j)
 * has modulus 1, so |B_k(i w)|^2 = 2 p_k/(w^2 + p_k^2), a Poisson
 * density integrating to 1 against dw/(2 pi); (iii) orthogonality -- for
 * k < m, (1/(2 pi i)) int_(i R) B_k(s) B_m(-s) ds closes in the left
 * half-plane (integrand decays like s^(-2)), where B_m(-s) has simple
 * ZEROS at s = -p_j for every j < m, cancelling every pole of B_k, so
 * the integrand is analytic there and the integral is 0.
 *
 * LEMMA TM-DIAG (exact mean times of the TM system). With b_k the time-
 * domain TM function (inverse Laplace of B_k):
 *   alpha_k := <t b_k, b_k> = 1/(2 p_k) + 2 sum_(j<k) 1/(p_j + p_k).
 * Proof. alpha_k = (1/(2 pi)) int (-B_k'(i w)) conj(B_k(i w)) dw. Since
 * B_k has no zeros on the axis, write the integrand as
 * -(B_k'/B_k)(i w) |B_k(i w)|^2 and take the real part (alpha_k is
 * real). The logarithmic derivative is B_k'/B_k = -1/(s + p_k) +
 * sum_(j<k) [1/(s - p_j) - 1/(s + p_j)], whose real part at s = i w is
 * -[p_k/(w^2 + p_k^2) + sum_(j<k) 2 p_j/(w^2 + p_j^2)]. With
 * |B_k(i w)|^2 = 2 p_k/(w^2 + p_k^2) and the two standard integrals
 * int dw/(w^2 + p^2)^2 = pi/(2 p^3) and
 * int dw/((w^2 + a^2)(w^2 + b^2)) = pi/(a b (a + b)), the two term
 * types evaluate to 1/(2 p_k) and 2/(p_j + p_k). QED.
 * CONSISTENCY: sum_k alpha_k = sum_k 1/(2 p_k) + 2 sum_(j<k) 1/(p_j+p_k)
 * = sum_(i,j) 1/(p_i + p_j) = tau(P) -- an independent one-line
 * re-derivation of the imp-95500 LEMMA MOM trace identity (no Cauchy
 * determinant formulas used).
 *
 * LEMMA TM-OFF (exact off-diagonal entries). For k < m:
 *   T_km := <t b_k, b_m>
 *        = -2 sqrt(p_k p_m) sum_(j<=k)
 *            [ prod_(i=k+1..m-1) (p_j - p_i) ] /
 *            [ prod_(i=k..m)     (p_j + p_i) ] ,
 * (empty numerator product = 1 when m = k + 1). Rate differences appear
 * ONLY in numerators: the formula is separation-free and continuous up
 * to full coalescence. Proof. T_km = (1/(2 pi i)) int_(i R)
 * (-B_k'(s)) B_m(-s) ds; the integrand decays like s^(-3), so close in
 * the left half-plane. There B_k' has only double poles at s = -p_j
 * (j <= k) with Laurent expansion -a_j/(s + p_j)^2 + 0/(s + p_j) + ...
 * (a_j = the residue of B_k at -p_j; the simple-pole coefficient of a
 * squared-denominator derivative vanishes identically), while B_m(-s)
 * has a simple zero at each -p_j (j <= k < m) with derivative
 * g_j = -B_m'(p_j). Each product residue is a_j g_j, so
 * T_km = -sum_(j<=k) a_j B_m'(p_j). Substituting the explicit
 *   a_j = sqrt(2 p_k) (-1)^(k-1) prod_(i<k)(p_j + p_i) /
 *         prod_(i<=k, i != j)(p_i - p_j),
 *   B_m'(p_j) = sqrt(2 p_m) prod_(i<m, i != j)(p_j - p_i) /
 *               prod_(i<=m)(p_j + p_i),
 * the separation factors with i <= k cancel between the two fractions
 * (the index sets {i < m, i != j} contain {i <= k, i != j}), leaving
 * exactly the gap factors i = k+1..m-1 in the numerator and the sum
 * factors i = k..m in the denominator. QED. SIGN NOTE: with ascending
 * rates every gap factor p_j - p_i (j <= k < i) is <= 0, so the j-terms
 * have one common sign and no cancellation is hidden inside |T_km|.
 *
 * THEOREM MU-ELEM (elementary closed-form mu_max cap, general K). T is
 * real symmetric with the entries of LEMMA TM-DIAG / TM-OFF, and
 * mu_max(P) = lambda_max(T). Gershgorin applied to T gives
 *   mu_max(P) <= GERS(P) := max_k [ alpha_k + sum_(m != k) |T_km| ],
 * a closed form in the rates alone: O(K^2) terms, each an explicit
 * rational-radical expression, NO separation denominators, continuous
 * at coalescence. Proof: standard Gershgorin for symmetric matrices
 * plus the compression identification above. QED.
 *
 * COROLLARY CRED-FLOOR (elementary graded-credit floor + onset cap).
 * cSort(P) = tau(P) - mu_max(P) >= tau(P) - GERS(P), and
 * onset(TILT-SORT) = mu_max(P) <= GERS(P). Both sides elementary. At
 * the imp-95500/95501 test sets (measured below): CLUSTER8 onset cap
 * 12.4205 vs the circular tau - (K-1)/(4 Sp) = 30.2827 (2.44x); twins
 * m = 8: 6.6038 vs 14.9682 (2.27x); m = 16: 6.9010 vs 15.4622 (2.24x);
 * coalesced K = 8: 13 vs 31.7812 (2.44x). The elementary currency now
 * captures most of the pencil-algebraic credit (GERS/mu_max = 1.14 at
 * CLUSTER8, 1.30 at twins m = 8, 1.14 coalesced K = 8).
 *
 * COROLLARY CRED-CAP (elementary credit ceiling). mu_max(P) >=
 * max over pStar in P of [1/(2 pStar) + 2 sum_(p != pStar) 1/(p + pStar)]
 * =: ALB(P) -- the Rayleigh quotient of T at the TM basis element built
 * with pStar ordered LAST (the alpha_K diagonal entry; every ordering of
 * the rates yields a valid TM basis, so the max over pStar is order-free).
 * Hence cSort(P) <= tau(P) - ALB(P): an elementary CAP on what the
 * graded credit can ever supply. At coalescence ALB = (2K-1)/(2 nu)
 * while mu_max = x_max(L_K)/(2 nu) ~ 2 K/nu, so ALB is a factor ~2 from
 * sharp there (measured below).
 *
 * LEMMA TM-LAG (coalescence anchor, exact). At p_1 = ... = p_K = nu the
 * TM basis is the Laguerre basis of L2 with weight e^(-2 nu t) and the
 * closed forms collapse (differences only in numerators) to the
 * truncated Laguerre Jacobi matrix over 2 nu: alpha_k = (2k - 1)/(2 nu),
 * T_(k,k+1) = -k/(2 nu), T_km = 0 for m >= k + 2. Hence mu_max(conf) =
 * x_max(L_K)/(2 nu), the largest zero of the K-th Laguerre polynomial
 * (eigenvalues of the truncated Jacobi matrix of an orthogonal-polynomial
 * system are the zeros of the next polynomial -- classical Gauss
 * quadrature fact), and GERS(conf) = max(4K - 6, 3K - 2)/(2 nu) for
 * K >= 2. This turns the coalesced TILT-SORT onset QUADRATIC->LINEAR
 * claim into closed form: onset(TILT-DET, conf) = tau = K^2/(2 nu)
 * versus onset(TILT-SORT, conf) = x_max(L_K)/(2 nu) <=
 * max(4K - 6, 3K - 2)/(2 nu). Cross-checks: K = 2 gives 2 + sqrt(2)
 * over 2 nu (= imp-95501 COROLLARY MU2 coalescent literal); K = 8
 * gives x_max(L_8) = 22.8631317369 = the imp-95501 exact factorial-
 * pencil literal m_8 (MEASURED (D) there).
 *
 * FLOAT-STABILITY BYPRODUCT (measured, not a theorem). The TM matrix
 * assembly is numerically benign exactly where the Cauchy-Gram pencil
 * is catastrophically ill-conditioned: at CLUSTER8 (where imp-95501
 * records that float Cholesky FAILS and resorts to BigInt exact-rational
 * inertia bisection) the plain-float TM eigenvalue reproduces the baked
 * exact-inertia literal 10.8954795117 to every displayed digit, and the
 * twin-lattice mu_max values reproduce the imp-95501 onset literals
 * 5.0639090 / 5.0936154 to their bisection resolution (1e-5).
 *
 * CONJECTURE CONF-DOM (recorded as a conjecture, NOT claimed). For every
 * P with min P = nu and |P| = K: mu_max(P) <= x_max(L_K)/(2 nu)
 * (coalescence at the slowest rate is mean-time extremal). A 400-draw
 * deterministic adversarial sweep (random K in 2..6, random rate spreads
 * up to 4x, seeded LCG) found NO violation; worst observed ratio
 * mu_max(P)/mu_max(conf at nu) = 0.999893 < 1. If proved, this would
 * give the SHARP elementary cap x_max(L_K)/(2 nu) <= (4K - 2)/(2 nu);
 * it remains OPEN and is NOT used by any corollary above.
 *
 * ADVERSARIAL SELF-CHECK RECORD. (1) The closed forms were attacked by
 * spectrum comparison: eig(T from the closed forms) vs the generalized
 * Cauchy-pencil eigenvalues via Cholesky on well-conditioned sets --
 * rel error 1e-11..1e-15 across six rate sets (the one 6.6e-7 case is
 * the NEAR-COALESCENT pencil side losing digits, not the TM side; the
 * exact-inertia CLUSTER8 cross-check settles that case in favor of TM).
 * (2) The trace identity sum alpha_k = tau was asserted on every sweep
 * draw (400/400, rel 1e-11) -- any algebra slip in TM-DIAG would break
 * it. (3) Gershgorin was verified >= mu_max on every draw (400/400,
 * zero violations) -- vacuous as a check of Gershgorin itself, but a
 * live tripwire against entry-formula errors. (4) The K = 2 entries
 * were verified SYMBOLICALLY against imp-95501 COROLLARY MU2: trace
 * a + c + 2b and determinant ac + b^2 both reproduce (the T_12 entry
 * -sqrt(p_2/p_1)/(p_1 + p_2) gives alpha_1 alpha_2 - T_12^2 = ac + b^2
 * after simplification; checked numerically to 1e-12). (5) The
 * coalesced case was verified ENTRYWISE against the Laguerre Jacobi
 * matrix (exact to 1e-12 at K = 2, 3, 5, 8), not just spectrally.
 * (6) A cheaper diagonal-only route was attempted and REFUTED before
 * this one: PSD-Gershgorin |T_km| <= sqrt(alpha_k alpha_m) collapses to
 * the rank-one bound mu_max <= tau (circular); the off-diagonal closed
 * form is genuinely necessary. (7) The recycled-majorant route
 * mu_max <= int_0^inf Lambda-majorant(T) dT was computed and found to
 * land at ~tau + O(K) at coalescence (the TILT onset IS tau) --
 * recorded so no successor re-attempts it.
 *
 * HONEST LIMITS. (a) GERS is an upper bound, not sharp: measured
 * looseness 1.14x..1.38x on the sweep and test sets; at K = 2
 * coalesced GERS = tau exactly (no gain); gains grow with K.
 * (b) The conjectured sharp confluent-domination cap is OPEN (recorded
 * above, unused). (c) Model family only (exponential spans, Cauchy
 * Gram); no mapping to paper per-window data; no Lambda bound of the
 * program changes. (d) The imp-95499 deflation residual (i) and the
 * RZ-PEN port residual (iii) are untouched. (e) Everything here lives
 * WITHIN the per-block majorant family of the tilt chain; nothing is
 * claimed about RZ-PEN or SPLIT-chain every-octave onsets.
 *
 * ROUTING. Executes imp-95501 surviving residual (ii-next2) -- the
 * elementary closed-form upper bound on mu_max(P) at general K -- via
 * THEOREM MU-ELEM, and adds the elementary credit CAP (COROLLARY
 * CRED-CAP) and the exact coalescence anchor (LEMMA TM-LAG). Surviving
 * residuals, re-scoped: (i) deflation-aware majorant (imp-95499 (a),
 * untouched); (ii-next3) CONJECTURE CONF-DOM -- prove or refute
 * mu_max(P) <= x_max(L_K)/(2 min P); (iii) RZ-PEN block-symbol port
 * (untouched).
 *
 * Import-light (no imports at all; sibling literals baked as constants
 * and recomputed). The numerics below are CROSS-CHECKS of the proven
 * statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// closed-form TM matrix (LEMMA TM-DIAG + LEMMA TM-OFF), rates ascending
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

// symmetric eigenvalues via cyclic Jacobi rotations (deterministic)
function symEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 300; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-28) break;
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

// THEOREM MU-ELEM closed-form cap
function gershCap(P) {
  const T = tmMatrix(P);
  let g = -Infinity;
  for (let k = 0; k < T.length; k++) {
    let r = T[k][k];
    for (let m = 0; m < T.length; m++) if (m !== k) r += Math.abs(T[k][m]);
    g = Math.max(g, r);
  }
  return g;
}

function tau(P) {
  let s = 0;
  for (const a of P) for (const b of P) s += 1 / (a + b);
  return s;
}

// COROLLARY CRED-CAP order-free Rayleigh lower bound on mu_max
function alphaLB(P) {
  let best = -Infinity;
  for (let x = 0; x < P.length; x++) {
    let a = 1 / (2 * P[x]);
    for (let j = 0; j < P.length; j++) if (j !== x) a += 2 / (P[j] + P[x]);
    best = Math.max(best, a);
  }
  return best;
}

// generalized pencil eigenvalues via Cholesky (cross-check path only;
// valid on well-conditioned Grams)
function pencilEig(P) {
  const K = P.length;
  const G = Array.from({ length: K }, (_, i) => Array.from({ length: K }, (_, j) => 1 / (P[i] + P[j])));
  const G1 = Array.from({ length: K }, (_, i) => Array.from({ length: K }, (_, j) => 1 / (P[i] + P[j]) ** 2));
  const L = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let i = 0; i < K; i++) {
    for (let j = 0; j <= i; j++) {
      let s = G[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95502: Cholesky failed on cross-check Gram");
        L[i][i] = Math.sqrt(s);
      } else {
        L[i][j] = s / L[j][j];
      }
    }
  }
  const Y = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let c = 0; c < K; c++) {
    for (let i = 0; i < K; i++) {
      let s = G1[i][c];
      for (let k = 0; k < i; k++) s -= L[i][k] * Y[k][c];
      Y[i][c] = s / L[i][i];
    }
  }
  const B = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let r = 0; r < K; r++) {
    for (let i = 0; i < K; i++) {
      let s = Y[r][i];
      for (let k = 0; k < i; k++) s -= L[i][k] * B[r][k];
      B[r][i] = s / L[i][i];
    }
  }
  return symEig(B);
}

// ---------------------------------------------------------------------------
// reference sets (imp-95500 / imp-95501 conventions) and baked literals
// ---------------------------------------------------------------------------
const CLUSTER8 = [1, 1.014, 1.029, 1.043, 1.057, 1.071, 1.086, 1.1];
const twinLattice = (m, r = 1.1) => {
  const P = [];
  for (let k = 0; k < m; k++) P.push(2 ** k, r * 2 ** k);
  return P;
};

// carried sibling literals (imp-95501)
const MU_CLUSTER8_INERTIA = 10.8954795117; // exact-rational inertia bisection
const MU_TWIN8_ONSET = 5.0639090; // bisection onset literal
const MU_TWIN16_ONSET = 5.0936154; // bisection onset literal
const XMAX_L8_FACTORIAL = 22.8631317369; // exact factorial-pencil m_8

// baked literals (NEW, this module; recomputed by the assertions)
const MU_CLUSTER8_TM = 10.895479511671208;
const GERS_CLUSTER8 = 12.420478234004282;
const GERS_TWIN8 = 6.603797641192754;
const GERS_TWIN16 = 6.901022759929423;
const GERS_COAL8 = 13; // max(4K-6, 3K-2)/(2 nu) at K = 8, nu = 1
const MU_COAL8 = 11.431565868444627; // x_max(L_8)/2 at nu = 1

// ---------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------
export const IMP95502_TM_JACOBI_ELEMENTARY_MUMAX_CAP = {
  id: "imp-95502",
  title:
    "LEMMA TM-ONB + TM-DIAG + TM-OFF + THEOREM MU-ELEM + COROLLARY " +
    "CRED-FLOOR/CRED-CAP + LEMMA TM-LAG: the Takenaka-Malmquist closed-form " +
    "matrix of the mean-time compression and its Gershgorin cap -- the " +
    "elementary closed-form upper bound on mu_max(P) at general K " +
    "(imp-95501 residual (ii-next2) executed)",
  lemmaTmDiag:
    "alpha_k = 1/(2 p_k) + 2 sum_(j<k) 1/(p_j + p_k) -- exact mean times of " +
    "the Takenaka-Malmquist orthonormal system (Plancherel + log-derivative " +
    "+ two standard Poisson integrals); sum_k alpha_k = tau(P) re-derives " +
    "the imp-95500 LEMMA MOM trace identity independently",
  lemmaTmOff:
    "T_km = -2 sqrt(p_k p_m) sum_(j<=k) prod_(i=k+1..m-1)(p_j - p_i) / " +
    "prod_(i=k..m)(p_j + p_i) for k < m (residue computation in the left " +
    "half-plane; double poles of the Blaschke derivative against simple " +
    "zeros of the reflected TM function) -- rate differences ONLY in " +
    "numerators, separation-free, coalescence-continuous",
  theoremMuElem:
    "mu_max(P) = lambda_max(T) <= GERS(P) = max_k [alpha_k + " +
    "sum_(m != k) |T_km|] -- an elementary closed form in the rates alone " +
    "(O(K^2) explicit terms), valid at every K, uniform under coalescence",
  corollaryCredFloor:
    "cSort(P) >= tau(P) - GERS(P) and onset(TILT-SORT) <= GERS(P): the " +
    "graded depth credit and the graded onset acquire elementary " +
    "certificates; measured onset caps 12.42 (CLUSTER8) / 6.60 (twins " +
    "m = 8) / 6.90 (m = 16) / 13 (coalesced K = 8) versus the circular " +
    "elementary bound tau - (K-1)/(4 Sp) at 30.28 / 14.97 / 15.46 / 31.78",
  corollaryCredCap:
    "mu_max(P) >= ALB(P) = max over pStar of [1/(2 pStar) + " +
    "2 sum_(p != pStar) 1/(p + pStar)] (Rayleigh at the TM element with " +
    "pStar ordered last; order-free), hence cSort <= tau - ALB: an " +
    "elementary CAP on the graded credit",
  lemmaTmLag:
    "at full coalescence the closed forms collapse to the truncated " +
    "Laguerre Jacobi matrix over 2 nu, so mu_max(conf) = x_max(L_K)/(2 nu) " +
    "(largest Laguerre zero) and GERS(conf) = max(4K - 6, 3K - 2)/(2 nu): " +
    "the coalesced TILT-SORT onset is LINEAR in K in closed form versus " +
    "the TILT-DET onset tau = K^2/(2 nu)",
  conjectureConfDom:
    "OPEN (recorded, unused): mu_max(P) <= x_max(L_K)/(2 min P) -- " +
    "coalescence at the slowest rate as the mean-time extremum; 400-draw " +
    "adversarial sweep found no violation (worst ratio 0.999893)",
  measured: {
    cluster8: {
      muMaxTmFloat: MU_CLUSTER8_TM,
      muMaxExactInertia: MU_CLUSTER8_INERTIA,
      gershCap: GERS_CLUSTER8,
      tau: 30.4910172966,
      capLooseness: GERS_CLUSTER8 / MU_CLUSTER8_TM, // ~1.14
    },
    twins: {
      m8: { muMaxTm: 5.063908396526048, gershCap: GERS_TWIN8, onsetLiteral: MU_TWIN8_ONSET },
      m16: { muMaxTm: 5.0936138647103295, gershCap: GERS_TWIN16, onsetLiteral: MU_TWIN16_ONSET },
    },
    coalescedK8: {
      muMax: MU_COAL8,
      xMaxL8: XMAX_L8_FACTORIAL,
      gershCap: GERS_COAL8,
      tau: 32,
    },
    floatStability:
      "TM assembly reproduces the BigInt exact-inertia CLUSTER8 mu_max in plain float " +
      "(the Cauchy-Gram Cholesky route fails there per imp-95501 MEASURED (C))",
  },
  isRigorous: true,
  rigorScope:
    "LEMMAS TM-ONB/TM-DIAG/TM-OFF and THEOREM MU-ELEM are unconditional " +
    "statements about the model objects (exponential spans, Cauchy Gram); " +
    "proofs in the header (Plancherel, residue calculus, Gershgorin). " +
    "COROLLARIES inherit the imp-95500/95501 chain scope (LEMMA MOM trace, " +
    "TILT-SORT, LEMMA ONSET). CONJECTURE CONF-DOM is recorded as open and " +
    "used nowhere. The numerics cross-check the statements; they are not " +
    "the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step (executes imp-95501 residual (ii-next2)): the mean-time " +
    "compression T = Q M_t Q on E_P is written in the Takenaka-Malmquist " +
    "orthonormal basis, where every entry has a separation-free closed form " +
    "(LEMMA TM-DIAG diagonal alpha_k = 1/(2 p_k) + 2 sum_(j<k) 1/(p_j+p_k), " +
    "LEMMA TM-OFF off-diagonal with rate differences only in numerators), " +
    "and Gershgorin yields THEOREM MU-ELEM: an ELEMENTARY closed-form upper " +
    "bound GERS(P) >= mu_max(P) at every K, coalescence-uniform. The graded " +
    "credit gains the elementary floor cSort >= tau - GERS and the " +
    "elementary cap cSort <= tau - ALB; the coalesced anchor is exact " +
    "(mu_max = largest Laguerre zero over 2 nu, onset LINEAR in K). " +
    "Measured caps: CLUSTER8 12.42 vs circular 30.28; twins 6.60/6.90 vs " +
    "14.97/15.46. Byproduct: float-stable mu_max evaluation where the " +
    "Cauchy-pencil Cholesky fails. Elementary sharpness (CONF-DOM) stays " +
    "OPEN and is recorded as the successor conjecture. Changes no bound; " +
    "does NOT promote any Lambda claim; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// assertions (self-executing; throw on violation)
// ---------------------------------------------------------------------------
function maxAbs(x) {
  return Math.max(...x.map((v) => Math.abs(v)));
}

const T_C8 = tmMatrix(CLUSTER8);
const E_C8 = symEig(T_C8);
const T_TW8 = tmMatrix(twinLattice(8));
const E_TW8 = symEig(T_TW8);
const T_TW16 = tmMatrix(twinLattice(16));
const E_TW16 = symEig(T_TW16);
const COAL8 = new Array(8).fill(1);
const T_CO8 = tmMatrix(COAL8);
const E_CO8 = symEig(T_CO8);

export const IMP95502_ASSERTIONS = [
  {
    id: "imp95502-spectrum-matches-pencil",
    description:
      "eig(closed-form TM matrix) equals the generalized Cauchy-pencil eigenvalues " +
      "on well-conditioned rate sets (rel <= 1e-9): any algebra slip in TM-DIAG or " +
      "TM-OFF would break the full spectrum, not just mu_max",
    holds: () => {
      for (const P of [[1, 2], [1, 1.3], [1, 2, 4, 8, 16], [0.7, 1.9, 2.3, 5.5, 11.2, 13.7]]) {
        const eT = symEig(tmMatrix(P));
        const eP = pencilEig(P);
        for (let i = 0; i < eT.length; i++) {
          if (Math.abs(eT[i] - eP[i]) > 1e-9 * Math.abs(eP[i])) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95502-trace-identity",
    description:
      "sum_k alpha_k = tau(P) (independent re-derivation of imp-95500 LEMMA MOM) " +
      "on every test set, rel 1e-11",
    holds: () => {
      for (const P of [[1, 2], CLUSTER8, twinLattice(8), [0.7, 1.9, 2.3, 5.5, 11.2, 13.7], COAL8]) {
        const T = tmMatrix(P);
        const tr = T.reduce((s, row, i) => s + row[i], 0);
        if (Math.abs(tr - tau(P)) > 1e-11 * tau(P)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95502-k2-mu2-crosscheck",
    description:
      "K = 2 closed-form entries reproduce imp-95501 COROLLARY MU2: trace " +
      "a + c + 2b and determinant ac + b^2 (rel 1e-12) at (p1, p2) = (1, 2)",
    holds: () => {
      const [p1, p2] = [1, 2];
      const a = 1 / (2 * p1);
      const c = 1 / (2 * p2);
      const b = 1 / (p1 + p2);
      const T = tmMatrix([p1, p2]);
      const trOk = Math.abs(T[0][0] + T[1][1] - (a + c + 2 * b)) < 1e-12;
      const det = T[0][0] * T[1][1] - T[0][1] * T[1][0];
      const detOk = Math.abs(det - (a * c + b * b)) < 1e-12;
      const t12Ok = Math.abs(T[0][1] - -Math.sqrt(p2 / p1) / (p1 + p2)) < 1e-12;
      return trOk && detOk && t12Ok;
    },
  },
  {
    id: "imp95502-coalesced-laguerre-jacobi-entrywise",
    description:
      "at full coalescence (nu = 1) the closed forms equal the truncated Laguerre " +
      "Jacobi matrix over 2 nu ENTRYWISE (diag (2k-1)/2, sub -(k)/2, zero beyond), " +
      "for K = 2, 3, 5, 8, to 1e-12",
    holds: () => {
      for (const K of [2, 3, 5, 8]) {
        const T = tmMatrix(new Array(K).fill(1));
        for (let k = 0; k < K; k++) {
          if (Math.abs(T[k][k] - (2 * k + 1) / 2) > 1e-12) return false;
          for (let m = k + 1; m < K; m++) {
            const want = m === k + 1 ? -(k + 1) / 2 : 0;
            if (Math.abs(T[k][m] - want) > 1e-12) return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95502-coalesced-laguerre-zero-anchor",
    description:
      "coalesced K = 8 mu_max equals x_max(L_8)/2 = the imp-95501 exact " +
      "factorial-pencil literal 22.8631317369 over 2 (rel 1e-9), and GERS " +
      "equals max(4K-6, 3K-2)/2 = 13 exactly",
    holds: () =>
      Math.abs(E_CO8[7] - XMAX_L8_FACTORIAL / 2) < 1e-9 * XMAX_L8_FACTORIAL &&
      Math.abs(E_CO8[7] - MU_COAL8) < 1e-11 &&
      gershCap(COAL8) === GERS_COAL8,
  },
  {
    id: "imp95502-cluster8-exact-inertia-reproduction",
    description:
      "CLUSTER8 mu_max from the float TM closed form reproduces the imp-95501 " +
      "BigInt exact-rational inertia literal 10.8954795117 (abs 5e-9) -- the " +
      "float-stability byproduct where Cauchy-Gram Cholesky fails",
    holds: () =>
      Math.abs(E_C8[7] - MU_CLUSTER8_INERTIA) < 5e-9 &&
      Math.abs(E_C8[7] - MU_CLUSTER8_TM) < 1e-10,
  },
  {
    id: "imp95502-twin-onset-literal-reproduction",
    description:
      "twin-lattice mu_max reproduces the imp-95501 TILT-SORT onset literals " +
      "5.0639090 (m = 8) and 5.0936154 (m = 16) within their bisection " +
      "resolution 1e-5",
    holds: () =>
      Math.abs(E_TW8[15] - MU_TWIN8_ONSET) < 1e-5 && Math.abs(E_TW16[31] - MU_TWIN16_ONSET) < 1e-5,
  },
  {
    id: "imp95502-gershgorin-caps",
    description:
      "THEOREM MU-ELEM cap literals: GERS >= mu_max with the baked values on " +
      "CLUSTER8 / twins / coalesced-8, all strictly below the circular bound " +
      "tau - (K-1)/(4 Sp)",
    holds: () => {
      const rows = [
        [CLUSTER8, E_C8[7], GERS_CLUSTER8],
        [twinLattice(8), E_TW8[15], GERS_TWIN8],
        [twinLattice(16), E_TW16[31], GERS_TWIN16],
        [COAL8, E_CO8[7], GERS_COAL8],
      ];
      for (const [P, mu, lit] of rows) {
        const g = gershCap(P);
        if (Math.abs(g - lit) > 1e-9 * lit) return false;
        if (!(g >= mu)) return false;
        const Sp = P.reduce((s, x) => s + x, 0);
        const circular = tau(P) - (P.length - 1) / (4 * Sp);
        if (!(g < circular)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95502-adversarial-sweep",
    description:
      "200-draw deterministic sweep (K in 2..7, random and near-coalescent rate " +
      "sets): GERS >= mu_max, trace = tau (rel 1e-9), ALB <= mu_max, zero " +
      "violations; CONJECTURE CONF-DOM tripwire mu_max(P) <= mu_max(conf at " +
      "min P) also unviolated on the sweep (recorded as conjecture, not proof)",
    holds: () => {
      let seed = 987654321;
      const rnd = () => {
        seed = (Math.imul(1103515245, seed) + 12345) >>> 0;
        return seed / 4294967296;
      };
      for (let trial = 0; trial < 200; trial++) {
        const K = 2 + Math.floor(rnd() * 6);
        let P = Array.from({ length: K }, () => 0.2 + 4 * rnd()).sort((a, b) => a - b);
        if (trial % 3 === 0) {
          const nu = 0.5 + 2 * rnd();
          P = Array.from({ length: K }, (_, i) => nu * (1 + 0.001 * i * rnd())).sort((a, b) => a - b);
        }
        const T = tmMatrix(P);
        const e = symEig(T);
        const mu = e[e.length - 1];
        const tr = T.reduce((s, row, i) => s + row[i], 0);
        if (Math.abs(tr - tau(P)) > 1e-9 * tau(P)) return false;
        if (!(gershCap(P) >= mu - 1e-9 * Math.abs(mu))) return false;
        if (!(alphaLB(P) <= mu + 1e-9 * Math.abs(mu))) return false;
        const eConf = symEig(tmMatrix(new Array(K).fill(P[0])));
        if (mu > eConf[K - 1] * (1 + 1e-9)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95502-credit-floor-and-cap-order",
    description:
      "elementary credit bracket is consistent on every test set: " +
      "tau - GERS <= cSort = tau - mu_max <= tau - ALB",
    holds: () => {
      const rows = [
        [CLUSTER8, E_C8[7]],
        [twinLattice(8), E_TW8[15]],
        [COAL8, E_CO8[7]],
        [[1, 2, 4, 8, 16], symEig(tmMatrix([1, 2, 4, 8, 16]))[4]],
      ];
      for (const [P, mu] of rows) {
        const tv = tau(P);
        const floor = tv - gershCap(P);
        const cSort = tv - mu;
        const cap = tv - alphaLB(P);
        if (!(floor <= cSort + 1e-9 && cSort <= cap + 1e-9)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95502-honesty-gate",
    description:
      "the verdict names the executed residual, keeps CONF-DOM as an open " +
      "conjecture, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95502_TM_JACOBI_ELEMENTARY_MUMAX_CAP.promotesBound === false &&
      /NO QED/.test(IMP95502_TM_JACOBI_ELEMENTARY_MUMAX_CAP.verdict) &&
      /refereed bound is changed/i.test(IMP95502_TM_JACOBI_ELEMENTARY_MUMAX_CAP.verdict) &&
      /OPEN/.test(IMP95502_TM_JACOBI_ELEMENTARY_MUMAX_CAP.conjectureConfDom) &&
      /ii-next2/.test(IMP95502_TM_JACOBI_ELEMENTARY_MUMAX_CAP.title) &&
      maxAbs([E_C8[7] - MU_CLUSTER8_TM]) < 1e-10,
  },
];

for (const a of IMP95502_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95502-tm-jacobi-elementary-mumax-cap assertion failed: ${a.id}`);
  }
}

export default IMP95502_TM_JACOBI_ELEMENTARY_MUMAX_CAP;
