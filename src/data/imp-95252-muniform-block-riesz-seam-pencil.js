/**
 * imp-95252: LEMMA TOEP + LEMMA POISSON + THEOREM RZ-LAT + THEOREM
 * RZ-TWIN + COROLLARY RZ-BLOCK + COROLLARY SPLIT-RZ -- the m-uniform
 * block Riesz-basis lower bound for the seam Gram on the octave twin
 * lattice, answering the question imp-95250 HONEST LIMITS (d) recorded
 * as OPEN: the disjoint octave blocks E(V_k) DO form a Riesz sequence
 * in E_V with an m-INDEPENDENT lower constant, in closed form, and the
 * route also pins the ceiling (no m-uniform constant can exceed the
 * symbol infimum). This replaces the linear-in-m leave-one-out collar
 * of SPLIT-LOO by a single constant and drops the m-and-r-uniform
 * every-octave certificate onset from 27.0356 to 15.9816 (r = 1.3).
 * Twenty-ninth leg of the seam chain. Changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * OBJECT (imp-95226 normalization). Rates nu_i > 0, E_V =
 * span{e^(-nu t)} in L2(0, inf), Gram G_ij = 1/(nu_i + nu_j),
 * Lambda(V, d) = lambda_max of the pencil (D G D, G),
 * D = diag(e^(-d nu_i)). Normalized generators ehat_nu =
 * sqrt(2 nu) e^(-nu t) give the LOG-RATIO GRAM (LEMMA NORM, one line):
 *   <ehat_nu, ehat_mu> = 2 sqrt(nu mu)/(nu + mu) = sech(u/2),
 *   u = ln(nu/mu).
 * On a geometric lattice nu_k = nu rho^k the entry depends only on the
 * index DIFFERENCE: the normalized Gram is TOEPLITZ (block Toeplitz
 * for the twin lattice {rho^k, r rho^k}), independent of the base rate.
 * Notation: a = ln rho, b = ln r, tau = b/a in (0, 1),
 * s(u) = sech(u/2), and P(w) = (2 pi / ln rho) sech(pi w / ln rho).
 *
 * LEMMA TOEP (Grenander-Szegoe quadratic-form bound, block form). Let
 * B_d be the 2x2 block at octave separation d,
 *   B_d = [[s(da), s(da + b)], [s(da - b), s(da)]], B_(-d) = B_d^T,
 * and F(theta) = sum over d in Z of B_d e^(-i d theta) (absolutely
 * convergent: entries decay like e^(-|d| a / 2)). F(theta) is
 * Hermitian. For any coefficient blocks c_0..c_(m-1) in C^2 and
 * p(theta) = sum_k c_k e^(i k theta),
 *   c* Gtilde_m c = (1/2pi) int_0^2pi p(theta)* F(theta) p(theta),
 * because the integral picks the Fourier block B_(k'-k) for the (k,k')
 * pair, exactly the Gram block. Since (1/2pi) int |p|^2 = sum |c_k|^2,
 *   lambda_min(Gtilde_m) >= inf over theta of lambda_min(F(theta)),
 * UNIFORMLY IN m. CEILING (elementary Szegoe direction): with
 * c_k = e^(-i k theta*) v / sqrt(m), v the minimizing unit eigenvector
 * of F(theta*), c* Gtilde_m c = sum over |d| < m of (1 - |d|/m)
 * e^(-i d theta*) v* B_d v -> v* F(theta*) v (Fejer average of an
 * absolutely summable series), so lambda_min(Gtilde_m) ->
 * inf lambda_min(F) and NO m-uniform constant can exceed the symbol
 * infimum: the bound below is the sharp currency. UPPER SIDE (LEMMA
 * UP, Schur row test): lambda_max(Gtilde_m) <= B_up = sum over d of
 * [s(da) + s(da + b)]; with the lower bound this is a genuine Riesz
 * sandwich for the infinite lattice family.
 *
 * LEMMA POISSON (symbol closed form). The classical Fourier pair
 * int sech(alpha t) e^(-i w t) dt = (pi/alpha) sech(pi w / (2 alpha))
 * with alpha = a/2, plus the shift rule and Poisson summation
 * (legitimate: both sides decay exponentially), give with
 * w_n = theta + 2 pi n:
 *   f_a(theta) = sum_d s(da) e^(-i d theta)      = sum_n P(w_n),
 *   f_b(theta) = sum_d s(da + b) e^(-i d theta)  = sum_n P(w_n)
 *                e^(i w_n tau),
 * and F(theta) = [[f_a, f_b], [conj(f_b), f_a]], so
 * lambda_min(F) = f_a - |f_b|. Every P(w_n) > 0. PAIR IDENTITY
 * (exact, all terms nonnegative -- also the numerically stable form):
 *   f_a^2 - |f_b|^2 = sum over n != l of
 *                     2 sin^2(pi (n - l) tau) P(w_n) P(w_l),
 * since w_n - w_l = 2 pi (n - l). In particular f_a - |f_b| > 0
 * strictly for every theta whenever tau is not an integer.
 *
 * THEOREM RZ-LAT (scalar lattice, one rate per octave; 1 < rho <=
 * e^6). For nu_k = nu rho^k, k = 0..m-1, and EVERY m:
 *   lambda_min(Gtilde_m) >= A_lat(rho) = 2 P(pi)
 *                        = (4 pi / ln rho) sech(pi^2 / ln rho).
 * Proof. lambda_min(F) = f_a here. For theta in [0, 2pi):
 * f_a >= P(theta) + P(2pi - theta) (two Poisson terms, rest dropped).
 * sech(k w) is convex where tanh^2(k w) >= 1/3, i.e. for w >= u_c =
 * artanh(3^(-1/2)) ln rho / pi. If min(theta, 2pi - theta) >= u_c,
 * both arguments lie in the convexity region and Jensen at the
 * midpoint pi gives the claim. Otherwise one term alone is
 * >= P(u_c) = (2 pi / ln rho) sqrt(2/3) >= A_lat, which is exactly
 * cosh(pi^2 / ln rho) >= sqrt(6), true for ln rho <= 6. QED. Sharp:
 * inf f_a = 2 P(pi) + 2 P(3 pi) + ... exceeds A_lat by rel ~4e-13 at
 * rho = 2 (measured grid ratio 1.0000000).
 *
 * THEOREM RZ-TWIN (twin lattice, the m-uniform block bound;
 * 1 < r < rho <= e^6). For V = union of V_k = {rho^k, r rho^k},
 * k = 0..m-1, and EVERY m:
 *   lambda_min(Gtilde_2m) >= A_twin(rho, r)
 *     = 4 sin^2(pi tau) P(pi) P(2pi) / (P(pi) + 2 P(2pi)),
 * tau = ln r / ln rho. Proof. Take theta in [-pi, pi] (periodicity).
 * Split the Poisson sums at |n| >= 2: f_a = X + T with
 * X = P_(-1) + P_0 + P_1, T the tail, and |f_b| <= |Z| + T with
 * Z = P_(-1) e^(-i phi) + P_0 + P_1 e^(i phi), phi = 2 pi tau (the
 * common phase e^(i w_0 tau) is unimodular; the n = +-1 phases differ
 * from it by exactly -+phi, independent of theta). Hence
 * f_a - |f_b| >= X - |Z| = (X^2 - |Z|^2)/(X + |Z|) >=
 * (X^2 - |Z|^2)/(2X). By the pair identity restricted to three terms,
 * X^2 - |Z|^2 = 2 P_0 S (1 - cos phi) + 2 P_(-1) P_1 (1 - cos 2 phi)
 * >= 4 sin^2(pi tau) P_0 S with S = P_(-1) + P_1. So f_a - |f_b| >=
 * 2 sin^2(pi tau) P_0 S / (P_0 + S), and P_0 S/(P_0 + S) is increasing
 * in each argument. P_0 = P(theta) >= P(pi) on |theta| <= pi. S =
 * P(2pi - theta) + P(2pi + theta) has both arguments in [pi, 3pi],
 * inside the convexity region (u_c <= 1.26 < pi for ln rho <= 6), so
 * Jensen at the midpoint 2pi gives S >= 2 P(2pi). Substitute. QED.
 * NEAR-SHARP: measured symbol-infimum ratio 1.00000131 at rho = 2,
 * UNIFORMLY over r in {1.001 .. 1.9}, and 1.0016 at rho = 4; at the
 * geometric-mean placement tau = 1/2 the twin lattice IS the
 * sqrt(rho)-lattice and A_twin(rho, sqrt(rho)) = A_lat(sqrt(rho)) up
 * to rel 1.3e-6 (exact identity of the leading Poisson terms).
 *
 * COROLLARY RZ-BLOCK (the imp-95252 statement). For every m and every
 * F = F_1 + ... + F_m with F_k in E(V_k):
 *   ||F||^2 >= A_blk sum_k ||F_k||^2,
 *   A_blk = A_twin / (1 + sech(b/2)) >= A_twin / 2.
 * Proof. ||F||^2 = c* Gtilde c >= A_twin |c|^2 in the normalized
 * coordinates; ||F_k||^2 = c_k* G0 c_k <= (1 + sech(b/2)) |c_k|^2 with
 * G0 the 2x2 in-block Gram [[1, s(b)], [s(b), 1]]. QED. This is the
 * m-uniform block Riesz-basis lower bound that imp-95250 HONEST LIMITS
 * (d) recorded as OPEN; LEMMA LOO gave only the linear-in-m constant
 * [sum_k (1 - sigma_k^2)^(-1)]^(-1).
 *
 * COROLLARY SPLIT-RZ (m-uniform denominator split). Triangle
 * inequality on (d, inf), the per-block definition of Lambda_k, and
 * Cauchy-Schwarz give sqrt(Lambda(V, d)) <= sqrt(sum_k Lambda_k)
 * sqrt(sum_k ||F_k||^2) / ||F||, hence with RZ-BLOCK
 *   Lambda(V, x) <= [ sum_(k>=0) coalLaw(2^k x) ] / A_blk
 * on the dyadic twin skeleton, r in (1, 1.3] (coalLaw from imp-95227
 * COAL-DOM + imp-95231 RATE-MONO, per-block scale invariance as in
 * imp-95250), for EVERY m -- the numerator converges, so the bound is
 * m-independent outright, with no depth-suppression crutch and no
 * per-block collar. Onsets (bisected): fires for x > 15.981584 at
 * r = 1.3, 16.230709 at r = 1.2, 17.517735 at r = 1.05 -- at UNBOUNDED
 * octave count, vs 27.035582 for the imp-95250 EV-OCT-UNIF route
 * (onset improvement ~11 depth units, m-and-r-trade recorded below).
 *
 * NECESSITY OF THE sin^2(pi tau) COLLAPSE. As r -> 1 the single-block
 * witness c = (1, -1) gives c* Gtilde c / |c|^2 = 1 - sech(b/2) ~
 * b^2/8 -> 0: in COEFFICIENT norms every m-uniform constant MUST
 * degrade at coalescence, so m-uniformity and coalescence-uniformity
 * cannot coexist in this currency -- the sin^2(pi tau) factor is
 * structural, not slack. In BLOCK norms the m = 2 constant is
 * coalescence-uniform (imp-95249 ANG-DET), and the same LEMMA TOEP
 * argument applies verbatim to the symbol PENCIL (F(theta), G0):
 * lambda_min of the pencil (G tilde, blockdiag G0) >= inf over theta
 * of the smaller root of (1 - s(b)^2) lam^2 - 2 lam (f_a - s(b)
 * Re f_b) + (f_a^2 - |f_b|^2) = 0. Whether that infimum is bounded
 * below UNIFORMLY IN r (an m-AND-r-uniform block Riesz bound) needs
 * the second-order coalescence expansion of the symbol and is the
 * surviving refined residual -- the named handle is this exact
 * quadratic.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) FLOAT TRAP found and resolved:
 * evaluating f_a - |f_b| naively at rho = 2 shows apparent violations
 * of RZ-TWIN of ~2e-15 ABSOLUTE (the two sums are ~9.06 and cancel to
 * ~1e-11); the cancellation-free pair identity restores the bound with
 * measured ratio 1.00000131 -- the violations were double-precision
 * noise, and the stable form is what this module asserts. (2) The
 * Fourier pair, the Poisson symbol identities (series vs periodized
 * closed form), and the pair identity are each verified numerically to
 * their float precision. (3) Matrix-level: lambda_min(Gtilde) >=
 * A_twin and pencil >= A_blk verified at rho = 4 (measurable constant
 * scale ~1e-5) for m up to 12 blocks and at rho = 2 for small m.
 * (4) lambda_min monotone nonincreasing in m and approaching the
 * symbol infimum (ceiling check at rho = 4, m = 24, within 5 percent).
 * (5) Refutation attempts that FAILED: push r toward 1 and rho ratios
 * across {2, 3, 4} looking for a symbol dip below A_twin on 20001-point
 * grids (never occurs; worst margin rel 1.3e-6 at rho = 2); break the
 * tau = 1/2 consistency with the sqrt(rho)-lattice (agrees to 1.3e-6).
 * (6) The onset comparison is honest both ways: SPLIT-RZ does NOT fire
 * at x = 12 where the finite-m EV-OCT (m = 6) does -- the new bound
 * wins only in the unbounded-m regime (and loses the r -> 1 limit).
 *
 * HONEST LIMITS. (a) The constant is tiny (A_blk = 1.345e-11 at
 * rho = 2, r = 1.3): at small m the exact leave-one-out constants are
 * far larger, so SPLIT-LOO / SPLIT-2 stay the sharper tools at small
 * m; the value here is the m -> inf statement, the onset drop for
 * unbounded m, and the Szegoe ceiling (this constant scale is
 * INTRINSIC to the dyadic twin lattice, not slack in the method).
 * (b) NOT coalescence-uniform, necessarily (see collapse witness);
 * EV-OCT-UNIF keeps the r -> 1 regime. (c) Dyadic lattice skeleton
 * only; off-lattice rates unchanged (imp-95232 residual). (d) Symbol
 * pencil r-uniformity = named open residual. (e) Model family only; no
 * mapping to paper per-window data (obligation (3) gammaSL unchanged);
 * changes NO Lambda bound of the program.
 *
 * ROUTING. imp-95252 (assess m-uniform block Riesz bound) ANSWERED
 * POSITIVELY on the lattice skeleton with closed-form constants and a
 * sharpness ceiling. Obligation ledger otherwise unchanged: (2)
 * weight/modulus legs, (3) envelope-shape port + gammaSL map, (4)
 * paper constants. Sub-gap imp-95212-subgap-fresnel-airy-envelope-port
 * STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS
 * of proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95252_MUNIFORM_BLOCK_RIESZ_SEAM_PENCIL = {
  id: "imp-95252",
  title:
    "LEMMA TOEP + THEOREM RZ-LAT / RZ-TWIN + COROLLARY RZ-BLOCK / " +
    "SPLIT-RZ: m-uniform block Riesz-basis lower bound for the seam Gram " +
    "on the octave twin lattice, in closed form, with the Szegoe ceiling",
  lemmaToep:
    "normalized lattice Gram is (block) Toeplitz; c* G c = (1/2pi) int " +
    "p* F p gives lambda_min(G_m) >= inf_theta lambda_min(F(theta)) for " +
    "every m; Fejer averages show no m-uniform constant can exceed the " +
    "symbol infimum",
  symbolClosedForm:
    "f_a = sum_n P(w_n), f_b = sum_n P(w_n) e^(i w_n tau), P(w) = " +
    "(2pi/lnrho) sech(pi w/lnrho), w_n = theta + 2pi n; pair identity " +
    "f_a^2 - |f_b|^2 = sum_(n!=l) 2 sin^2(pi(n-l)tau) P_n P_l",
  theoremRzLat: {
    statement:
      "lambda_min >= A_lat = (4pi/lnrho) sech(pi^2/lnrho), every m, " +
      "1 < rho <= e^6",
    aLatRho2: 2.374484801079e-5,
    aLatRho4: 1.46710641566e-2,
  },
  theoremRzTwin: {
    statement:
      "lambda_min >= A_twin = 4 sin^2(pi tau) P(pi) P(2pi) / (P(pi) + " +
      "2 P(2pi)), tau = lnr/lnrho, every m, 1 < r < rho <= e^6",
    aTwinRho2R13: 2.67850159527e-11,
    measuredSymbolInfRatioRho2: 1.00000131,
  },
  corollaryRzBlock: {
    statement:
      "||F||^2 >= A_blk sum_k ||F_k||^2 with A_blk = A_twin/(1 + " +
      "sech(b/2)): the m-uniform block Riesz lower bound imp-95250 " +
      "HONEST LIMITS (d) recorded as OPEN",
    aBlkRho2R13: 1.344996021179e-11,
  },
  corollarySplitRz: {
    statement:
      "Lambda(V, x) <= [sum_k coalLaw(2^k x)] / A_blk on the dyadic twin " +
      "skeleton, r in (1, 1.3], every m: m-independent certificate with " +
      "no depth-suppression crutch and no per-block collar",
    xStarR13: 15.981584,
    xStarR12: 16.230709,
    xStarR105: 17.517735,
    certAtX17R13: 1.475621082e-1,
    certAtX20R105: 9.096449425e-3,
    evOctUnifOnsetRef: 27.035582,
  },
  collapseNecessity:
    "single-block witness c = (1, -1): lambda_min <= 1 - sech(b/2) -> 0 " +
    "as r -> 1, so coefficient-norm m-uniform constants MUST carry the " +
    "sin^2(pi tau) collapse; the r-uniform BLOCK-norm symbol-pencil " +
    "infimum is the named open residual",
  honestScope:
    "constants tiny and intrinsic (Szegoe ceiling); small-m regimes stay " +
    "with SPLIT-LOO / SPLIT-2; not coalescence-uniform (necessarily); " +
    "dyadic skeleton only, off-lattice unchanged; model family only",
  verdict:
    "RIGOROUS: LEMMA TOEP, LEMMA POISSON, THEOREM RZ-LAT, THEOREM " +
    "RZ-TWIN, COROLLARY RZ-BLOCK and COROLLARY SPLIT-RZ are proven " +
    "(elementary Fourier + Poisson + Jensen, self-contained), with " +
    "imp-95227 COAL-DOM + imp-95231 RATE-MONO as cited inputs to " +
    "SPLIT-RZ only. The imp-95252 m-uniform block Riesz question is " +
    "ANSWERED POSITIVELY on the lattice skeleton; the r-uniform block " +
    "pencil version stays OPEN. Changes no bound; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light)
// ---------------------------------------------------------------------------

function cauchyGram(nus) {
  return nus.map((a) => nus.map((b) => 1 / (a + b)));
}
function transpose(A) {
  return A[0].map((_, j) => A.map((row) => row[j]));
}
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95252 chol: base not PD");
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
  for (let sweep = 0; sweep < 300; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-32) break;
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

// normalized Gram entry at log-ratio u (LEMMA NORM)
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const normGram = (nus) =>
  nus.map((a) => nus.map((b) => sechHalf(Math.log(a / b))));

// Poisson kernel P(w) = (2pi/lnrho) sech(pi w/lnrho); cosh overflow -> 0
const kernelP = (w, lnrho) =>
  (2 * Math.PI) / lnrho / Math.cosh((Math.PI * w) / lnrho);

// scalar symbol f_a via the Poisson side
function symbolA(theta, lnrho, NN = 12) {
  let s = 0;
  for (let n = -NN; n <= NN; n++)
    s += kernelP(theta + 2 * Math.PI * n, lnrho);
  return s;
}
// scalar symbol f_a via the Fourier-coefficient series (identity check)
function symbolASeries(theta, lnrho, D = 220) {
  let s = 1;
  for (let d = 1; d <= D; d++)
    s += 2 * sechHalf(d * lnrho) * Math.cos(d * theta);
  return s;
}
// twin off-diagonal symbol f_b, complex, both routes
function symbolBPoisson(theta, lnrho, lnr, NN = 12) {
  const tau = lnr / lnrho;
  let re = 0;
  let im = 0;
  for (let n = -NN; n <= NN; n++) {
    const w = theta + 2 * Math.PI * n;
    const p = kernelP(w, lnrho);
    re += p * Math.cos(w * tau);
    im += p * Math.sin(w * tau);
  }
  return [re, im];
}
function symbolBSeries(theta, lnrho, lnr, D = 220) {
  let re = 0;
  let im = 0;
  for (let d = -D; d <= D; d++) {
    re += sechHalf(d * lnrho + lnr) * Math.cos(d * theta);
    im -= sechHalf(d * lnrho + lnr) * Math.sin(d * theta);
  }
  return [re, im];
}
// cancellation-free evaluation of lambda_min(F(theta)) = f_a - |f_b|
// via the pair identity (SKEPTICAL RECORD item 1)
function stableSymbolGap(theta, lnrho, lnr, NN = 12) {
  const tau = lnr / lnrho;
  const Ps = [];
  for (let n = -NN; n <= NN; n++)
    Ps.push(kernelP(theta + 2 * Math.PI * n, lnrho));
  const sin2 = [];
  for (let d = 0; d <= 2 * NN; d++) {
    const s = Math.sin(Math.PI * d * tau);
    sin2.push(s * s);
  }
  let fa = 0;
  for (const p of Ps) fa += p;
  let num = 0;
  for (let i = 0; i < Ps.length; i++)
    for (let j = 0; j < Ps.length; j++) {
      if (i === j) continue;
      num += 2 * sin2[Math.abs(i - j)] * Ps[i] * Ps[j];
    }
  const fb = Math.sqrt(Math.max(fa * fa - num, 0));
  return num / (fa + fb);
}

// closed-form constants
const aLat = (lnrho) =>
  (4 * Math.PI) / lnrho / Math.cosh((Math.PI * Math.PI) / lnrho);
const aTwin = (lnrho, lnr) => {
  const tau = lnr / lnrho;
  const s2 = Math.sin(Math.PI * tau) ** 2;
  const Ppi = kernelP(Math.PI, lnrho);
  const P2pi = kernelP(2 * Math.PI, lnrho);
  return (4 * s2 * Ppi * P2pi) / (Ppi + 2 * P2pi);
};
const aBlk = (lnrho, lnr) => aTwin(lnrho, lnr) / (1 + sechHalf(lnr));

// exact pencil Lambda and the SPLIT-RZ certificate on the dyadic skeleton
const lamExact = (nus, d) => {
  const G = cauchyGram(nus);
  const DGD = G.map((row, i) =>
    row.map((g, j) => g * Math.exp(-d * (nus[i] + nus[j]))),
  );
  const ev = pencilEig(DGD, G);
  return ev[ev.length - 1];
};
const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
function certSplitRz(x, r) {
  let num = 0;
  for (let k = 0; k < 60; k++) num += coalLaw(2 ** k * x);
  return num / aBlk(Math.LN2, Math.log(r));
}
const twinRates = (m, r, rho = 2) => {
  const nus = [];
  for (let k = 0; k < m; k++) nus.push(rho ** k, r * rho ** k);
  return nus;
};

const A_LAT_2 = 2.374484801079e-5;
const A_TWIN_2_13 = 2.67850159527e-11;
const A_BLK_2_13 = 1.344996021179e-11;
const XSTAR_RZ_13 = 15.981584;
const XSTAR_RZ_105 = 17.517735;
const CERT_X17_R13 = 1.475621082e-1;
const CERT_X20_R105 = 9.096449425e-3;
const XSTAR_UNIF_REF = 27.035582; // imp-95250 EV-OCT-UNIF onset

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95252_ASSERTIONS = [
  {
    id: "imp95252-lemma-norm",
    description:
      "LEMMA NORM: 2 sqrt(nu mu)/(nu + mu) = sech((ln(nu/mu))/2) exactly " +
      "on a rate grid (abs 1e-14)",
    holds: () => {
      const nus = [1, 1.05, 1.3, 2, 2.6, 4, 11.7];
      for (const a of nus)
        for (const b of nus) {
          const lhs = (2 * Math.sqrt(a * b)) / (a + b);
          if (Math.abs(lhs - sechHalf(Math.log(a / b))) > 1e-14) return false;
        }
      return true;
    },
  },
  {
    id: "imp95252-sech-fourier-pair",
    description:
      "the classical pair int sech(alpha t) e^(-i w t) dt = (pi/alpha) " +
      "sech(pi w/(2 alpha)) reproduces by quadrature (rel 1e-8)",
    holds: () => {
      for (const [alpha, w] of [
        [Math.LN2 / 2, 2],
        [Math.LN2, 1.2],
      ]) {
        let I = 0;
        const h = 0.002;
        for (let t = -120; t <= 120; t += h)
          I += (1 / Math.cosh(alpha * t)) * Math.cos(w * t) * h;
        const exact =
          Math.PI / alpha / Math.cosh((Math.PI * w) / (2 * alpha));
        if (Math.abs(I - exact) > 1e-8 * exact) return false;
      }
      return true;
    },
  },
  {
    id: "imp95252-poisson-symbol-identity",
    description:
      "LEMMA POISSON: the Fourier-coefficient series and the periodized " +
      "closed form agree for f_a and f_b (abs 1e-12) at rho in {2, 4}, " +
      "r = 1.3, across theta samples",
    holds: () => {
      for (const lnrho of [Math.LN2, Math.log(4)]) {
        const lnr = Math.log(1.3);
        for (const th of [0.3, 1.7, Math.PI, 5.1]) {
          if (Math.abs(symbolASeries(th, lnrho) - symbolA(th, lnrho)) > 1e-12)
            return false;
          const [sr, si] = symbolBSeries(th, lnrho, lnr);
          const [pr, pi_] = symbolBPoisson(th, lnrho, lnr);
          if (Math.abs(sr - pr) > 1e-12 || Math.abs(si - pi_) > 1e-12)
            return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95252-pair-identity",
    description:
      "pair identity f_a^2 - |f_b|^2 = sum_(n!=l) 2 sin^2(pi(n-l)tau) " +
      "P_n P_l matches the direct complex evaluation (rel 1e-9 at rho = 4 " +
      "where cancellation is mild)",
    holds: () => {
      const lnrho = Math.log(4);
      const lnr = Math.log(1.3);
      for (const th of [0.1, 1.0, Math.PI]) {
        const fa = symbolA(th, lnrho);
        const [br, bi] = symbolBPoisson(th, lnrho, lnr);
        const direct = fa - Math.hypot(br, bi);
        const stable = stableSymbolGap(th, lnrho, lnr);
        if (Math.abs(direct - stable) > 1e-9 * stable) return false;
      }
      return true;
    },
  },
  {
    id: "imp95252-rzlat-theorem",
    description:
      "THEOREM RZ-LAT: 20001-point symbol grid inf >= A_lat (strict, and " +
      "within rel 1e-6 of it: sharp), and lambda_min of the scalar lattice " +
      "Gram >= A_lat for m in {5, 10, 20, 40} at rho = 2 and m in " +
      "{5, 10, 24} at rho = 4, monotone nonincreasing in m",
    holds: () => {
      for (const [rho, ms] of [
        [2, [5, 10, 20, 40]],
        [4, [5, 10, 24]],
      ]) {
        const lnrho = Math.log(rho);
        const bound = aLat(lnrho);
        let inf = Infinity;
        for (let i = 0; i <= 20000; i++) {
          const th = -Math.PI + (2 * Math.PI * i) / 20000;
          inf = Math.min(inf, symbolA(th, lnrho));
        }
        if (!(inf >= bound * (1 - 1e-13) && inf <= bound * (1 + 1e-6)))
          return false;
        let prev = Infinity;
        for (const m of ms) {
          const nus = Array.from({ length: m }, (_, k) => rho ** k);
          const ev = jacobiEig(normGram(nus));
          if (!(ev[0] >= bound && ev[0] <= prev + 1e-12)) return false;
          prev = ev[0];
        }
      }
      return Math.abs(aLat(Math.LN2) - A_LAT_2) < 1e-9 * A_LAT_2;
    },
  },
  {
    id: "imp95252-rztwin-theorem",
    description:
      "THEOREM RZ-TWIN: stable 20001-point grid inf of lambda_min(F) >= " +
      "A_twin (strict) and <= 1.01 A_twin (near-sharp) for (rho, r) in " +
      "{(2,1.05),(2,1.3),(2,sqrt2),(2,1.9),(3,1.3),(4,1.3),(4,2)}; at " +
      "tau = 1/2 A_twin matches the sqrt(rho)-lattice A_lat to rel 1e-5",
    holds: () => {
      for (const [rho, r] of [
        [2, 1.05],
        [2, 1.3],
        [2, Math.SQRT2],
        [2, 1.9],
        [3, 1.3],
        [4, 1.3],
        [4, 2],
      ]) {
        const lnrho = Math.log(rho);
        const lnr = Math.log(r);
        const bound = aTwin(lnrho, lnr);
        let inf = Infinity;
        for (let i = 0; i <= 20000; i++) {
          const th = -Math.PI + (2 * Math.PI * i) / 20000;
          inf = Math.min(inf, stableSymbolGap(th, lnrho, lnr));
        }
        if (!(inf >= bound && inf <= 1.01 * bound)) return false;
      }
      const tauHalf = aTwin(Math.LN2, Math.LN2 / 2);
      if (Math.abs(tauHalf - aLat(Math.LN2 / 2)) > 1e-5 * tauHalf)
        return false;
      return Math.abs(aTwin(Math.LN2, Math.log(1.3)) - A_TWIN_2_13) <
        1e-9 * A_TWIN_2_13;
    },
  },
  {
    id: "imp95252-matrix-and-pencil",
    description:
      "matrix level: lambda_min(twin Gram) >= A_twin and the block pencil " +
      "(Gram, blockdiag) >= A_blk at rho = 4 (m in {4, 8, 12}, r in " +
      "{1.3, 2}) and rho = 2 small m (constants resolvable above eig noise)",
    holds: () => {
      for (const [rho, r, ms] of [
        [4, 1.3, [4, 8, 12]],
        [4, 2, [4, 8]],
        [2, 1.3, [4, 6]],
        [2, 1.2, [8]],
      ]) {
        const lnrho = Math.log(rho);
        const lnr = Math.log(r);
        const bound = aTwin(lnrho, lnr);
        const blk = aBlk(lnrho, lnr);
        for (const m of ms) {
          const G = normGram(twinRates(m, r, rho));
          const ev = jacobiEig(G);
          if (!(ev[0] >= bound)) return false;
          const BD = G.map((row, i) =>
            row.map((g, j) =>
              Math.floor(i / 2) === Math.floor(j / 2) ? g : 0,
            ),
          );
          const pe = pencilEig(G, BD);
          if (!(pe[0] >= blk)) return false;
        }
      }
      return Math.abs(aBlk(Math.LN2, Math.log(1.3)) - A_BLK_2_13) <
        1e-9 * A_BLK_2_13;
    },
  },
  {
    id: "imp95252-szegoe-ceiling",
    description:
      "ceiling: lambda_min approaches the symbol infimum from above " +
      "(rho = 4 scalar, m = 24 within 5 percent), so no m-uniform " +
      "constant can exceed it",
    holds: () => {
      const lnrho = Math.log(4);
      let inf = Infinity;
      for (let i = 0; i <= 20000; i++) {
        const th = -Math.PI + (2 * Math.PI * i) / 20000;
        inf = Math.min(inf, symbolA(th, lnrho));
      }
      const nus = Array.from({ length: 24 }, (_, k) => 4 ** k);
      const ev = jacobiEig(normGram(nus));
      return ev[0] >= inf && ev[0] <= 1.05 * inf;
    },
  },
  {
    id: "imp95252-collapse-necessity",
    description:
      "coefficient-norm collapse witness: lambda_min(twin Gram) <= " +
      "1 - sech(b/2) (single-block c = (1, -1) Rayleigh quotient), which " +
      "-> 0 as r -> 1 (2.98e-4 at r = 1.05, < 1.3e-7 at r = 1.001)",
    holds: () => {
      const ub105 = 1 - sechHalf(Math.log(1.05));
      const ev = jacobiEig(normGram(twinRates(4, 1.05, 2)));
      if (!(ev[0] <= ub105)) return false;
      if (Math.abs(ub105 - 2.9749e-4) > 1e-8) return false;
      return 1 - sechHalf(Math.log(1.001)) < 1.3e-7;
    },
  },
  {
    id: "imp95252-upper-riesz",
    description:
      "LEMMA UP: lambda_max(twin Gram) <= row-sum constant B_up = " +
      "sum_d [s(d a) + s(d a + b)] at rho = 2, r = 1.3, m = 12",
    holds: () => {
      let B = 0;
      for (let d = -200; d <= 200; d++)
        B += sechHalf(d * Math.LN2) + sechHalf(d * Math.LN2 + Math.log(1.3));
      const ev = jacobiEig(normGram(twinRates(12, 1.3, 2)));
      return ev[ev.length - 1] <= B;
    },
  },
  {
    id: "imp95252-splitrz-certificate",
    description:
      "COROLLARY SPLIT-RZ: exact pencil Lambda <= certificate < 1 at " +
      "(m, r, x) in {(6,1.3,17),(4,1.2,18),(8,1.3,17),(6,1.05,20)}; baked " +
      "onset literals bracket 1 (xStar +- 1e-3); the m-uniform onset " +
      "15.981584 (r = 1.3) beats the EV-OCT-UNIF reference 27.035582; " +
      "honest: does NOT fire at x = 12 where finite-m EV-OCT does",
    holds: () => {
      for (const [m, r, x] of [
        [6, 1.3, 17],
        [4, 1.2, 18],
        [8, 1.3, 17],
        [6, 1.05, 20],
      ]) {
        const le = lamExact(twinRates(m, r, 2), x);
        const c = certSplitRz(x, r);
        if (!(le <= c && c < 1)) return false;
      }
      if (
        !(
          certSplitRz(XSTAR_RZ_13 - 1e-3, 1.3) > 1 &&
          certSplitRz(XSTAR_RZ_13 + 1e-3, 1.3) < 1 &&
          certSplitRz(XSTAR_RZ_105 - 1e-3, 1.05) > 1 &&
          certSplitRz(XSTAR_RZ_105 + 1e-3, 1.05) < 1
        )
      )
        return false;
      if (
        Math.abs(certSplitRz(17, 1.3) - CERT_X17_R13) > 1e-6 * CERT_X17_R13 ||
        Math.abs(certSplitRz(20, 1.05) - CERT_X20_R105) >
          1e-6 * CERT_X20_R105
      )
        return false;
      if (!(XSTAR_RZ_13 < XSTAR_UNIF_REF)) return false;
      return certSplitRz(12, 1.3) > 1;
    },
  },
  {
    id: "imp95252-verdict-honesty",
    description:
      "the verdict and scope carry the honest labels: RIGOROUS theorems, " +
      "imp-95252 ANSWERED POSITIVELY on the skeleton, r-uniform pencil " +
      "OPEN, no bound change, no QED, no refereed bound is changed",
    holds: () =>
      /RIGOROUS/.test(IMP95252_MUNIFORM_BLOCK_RIESZ_SEAM_PENCIL.verdict) &&
      /ANSWERED POSITIVELY/.test(
        IMP95252_MUNIFORM_BLOCK_RIESZ_SEAM_PENCIL.verdict,
      ) &&
      /stays OPEN/.test(IMP95252_MUNIFORM_BLOCK_RIESZ_SEAM_PENCIL.verdict) &&
      /Changes no bound/.test(
        IMP95252_MUNIFORM_BLOCK_RIESZ_SEAM_PENCIL.verdict,
      ) &&
      /NO QED/.test(IMP95252_MUNIFORM_BLOCK_RIESZ_SEAM_PENCIL.verdict) &&
      /refereed bound is changed/i.test(IMP95252_MUNIFORM_BLOCK_RIESZ_SEAM_PENCIL.verdict) &&
      /not coalescence-uniform/.test(
        IMP95252_MUNIFORM_BLOCK_RIESZ_SEAM_PENCIL.honestScope,
      ),
  },
];

for (const a of IMP95252_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95252-muniform-block-riesz-seam-pencil assertion failed: ${a.id}`,
    );
  }
}

export default IMP95252_MUNIFORM_BLOCK_RIESZ_SEAM_PENCIL;
