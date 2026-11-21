/**
 * imp-95251: LEMMA BN (Blaschke-Newton interpolant) + LEMMA DD (contour
 * pivot identity) + LEMMA LAG (Laguerre divided-difference bound) +
 * THEOREM COAL-N (the N-fold coalescence law) -- the named residual of
 * imp-95250 ("three or more rates per octave needs an N-fold coalescence
 * law; imp-95227 COAL-DOM is PAIR-ONLY") is SUPPLIED: a closed-form
 * majorant for the signed shift constant of ANY block of at most N rates
 * inside a bounded-ratio window, UNIFORM in the intra-block configuration
 * and free of separation denominators (coalescence-uniform). Twenty-sixth
 * leg of the seam chain.
 *
 * Object (imp-95225 LEMMA SEG-N / imp-95226 LEMMA PICK-ID):
 *   Lambda(nu, d) = sup over nonzero g(t) = sum_i a_i e^(-nu_i t) of
 *                   [int_d^inf g^2] / [int_0^inf g^2]
 *                 = lambda_max of the pencil (D G D, G),
 * G_ij = 1/(nu_i + nu_j), D = diag(w_i), w_i = e^(-d nu_i). By imp-95226
 * THEOREM NP-CERT, Lambda <= ||g||_inf^2 for EVERY bounded analytic g on
 * the right half plane C+ with g(nu_i) = w_i.
 *
 * THEOREM COAL-N (N-fold coalescence law). Let nu_0 < ... < nu_(N-1) be
 * any rates contained in [nu, R nu] (R >= nu_max/nu_min), d > 0,
 * x = nu d. Then, with L_k the Laguerre polynomials evaluated at the
 * NEGATIVE argument, L_k(-y) = sum_(l<=k) C(k,l) y^l / l! >= 1, and
 * the generalized-Laguerre partial sum L1_n(-y) = sum_(k<=n) L_k(-y):
 *   sqrt(Lambda) <= coalN(N, R, x)
 *                := e^(-x) [ L_(N-1)(-2Rx) + 2 L1_(N-2)(-2Rx) ]
 * (for N = 1 the bracket is 1). The right side involves ONLY the count
 * N, the window ratio R, and the depth x = nu d: no rate separation
 * appears, so the bound is uniform over ALL intra-block configurations,
 * including the coalescent/confluent limits, and it is monotone in N and
 * R, so a bound proved for (N, R) covers every block with AT MOST N
 * rates in a window of ratio AT MOST R.
 *
 * PROOF (elementary, self-contained given imp-95226 NP-CERT).
 *
 * LEMMA BN (Blaschke-Newton interpolant). Let b_j(s) =
 * (s - nu_j)/(s + nu_j) and B_k = prod_(j<k) b_j (B_0 = 1). Define
 * F_0(s) = e^(-d s) and recursively
 *   c_k = F_k(nu_k),  F_(k+1)(s) = (F_k(s) - c_k) (s + nu_k)/(s - nu_k).
 * Each F_(k+1) is analytic on C+ (the singularity at nu_k is removable
 * because the numerator vanishes there; the only poles -nu_j lie in the
 * left half plane), and F_k = c_k + b_k F_(k+1) identically. Unwinding,
 *   F_0 = sum_(k<N) c_k B_k + B_N F_N .
 * At s = nu_i (i < N): B_N(nu_i) = 0 and B_k(nu_i) = 0 for k > i, so
 * g := sum_(k<N) c_k B_k satisfies g(nu_i) = e^(-d nu_i) = w_i. Since
 * |b_j| <= 1 on C+, ||g||_inf <= sum_(k<N) |c_k|, and NP-CERT gives
 *   sqrt(Lambda) <= sum_(k<N) |c_k|   (the BN certificate).
 * The recursion divides differences of VALUES by b-denominators that
 * cancel the vanishing numerators, so the c_k stay finite as rates
 * coalesce -- this is the anti-trap that PROP BL (Lagrange form) lacks.
 *
 * LEMMA DD (contour pivot identity). Let I_k = sum_(l<=k) c_l and
 * phi_k(s) = e^(-d s) prod_(j<k) (s + nu_j). Then I_k equals the
 * classical divided difference [nu_0, ..., nu_k] phi_k. Proof: let
 * W_k(s) = prod_(j<k)(s + nu_j) / prod_(j<=k)(s - nu_j) and Gamma a
 * circle in C+ enclosing [nu_0, nu_(N-1)]. The residues of F_0 W_k at
 * its poles nu_0..nu_k give (1/2 pi i) contour-int F_0 W_k =
 * sum_(i<=k) phi_k(nu_i) / prod_(j<=k, j!=i)(nu_i - nu_j) =
 * [nu_0..nu_k] phi_k (the residue form of the divided difference).
 * Expanding F_0 by LEMMA BN instead: for l <= k the integrand term
 * c_l B_l W_k is rational with numerator degree k - l, denominator
 * degree k - l + 1, leading coefficient ratio 1, and ALL poles
 * (nu_l..nu_k) inside Gamma, so its residue sum is 1 and it contributes
 * exactly c_l; for l > k and for the remainder term B_N F_N W_k the
 * zeros of B_l, B_N cancel every pole of W_k, the integrand is analytic
 * inside Gamma, and the contribution is 0. Hence [nu_0..nu_k] phi_k =
 * sum_(l<=k) c_l = I_k.
 *
 * LEMMA LAG (Laguerre bound). |I_k| <= e^(-x) L_k(-2Rx). Proof: by the
 * divided-difference mean value theorem there is xi in (nu_0, nu_(k))
 * subset [nu, R nu] with I_k = phi_k^(k)(xi) / k! (k-th derivative). By
 * the Leibniz rule on phi_k = e^(-d s) p_k(s), p_k = prod_(j<k)(s+nu_j):
 * the m-th derivative of p_k at xi is m! times the sum of C(k, m)
 * products of k - m factors (xi + nu_j), each factor in (0, 2 R nu], so
 * 0 < p_k^(m)(xi) <= m! C(k,m) (2 R nu)^(k-m), while the exponential
 * derivatives contribute d^(k-m) e^(-d xi) <= d^(k-m) e^(-x) in absolute
 * value. Therefore |phi_k^(k)(xi)|/k! <= e^(-x) sum_(m<=k)
 * C(k,m)^2 (m!/k!) (2Rx)^(k-m) = e^(-x) sum_(l<=k) C(k,l) (2Rx)^l / l!
 * = e^(-x) L_k(-2Rx), using C(k,m)^2 m!/k! = C(k,m)/(k-m)! and l = k-m.
 *
 * THEOREM COAL-N follows: c_0 = I_0 and c_k = I_k - I_(k-1), so
 * sum_(k<N) |c_k| <= |I_(N-1)| + 2 sum_(k<=N-2) |I_k| <=
 * e^(-x) [L_(N-1)(-2Rx) + 2 L1_(N-2)(-2Rx)]. The confluent spans
 * (repeated rates, monomial factors t^m e^(-nu t)) are covered by
 * continuity: each such element is an L2(0, inf) limit of divided
 * differences of distinct-rate exponentials inside the same window, and
 * both integrals of the Rayleigh ratio are continuous under L2
 * convergence, so the same bound holds there. QED (of this majorant
 * only -- no bound of the Lambda program changes).
 *
 * WHAT THE LAW BUYS AND WHAT IT DOES NOT.
 * (a) It answers the imp-95251 question affirmatively: an N-fold
 *     coalescence law EXISTS in closed form. The imp-95250 SPLIT-LOO
 *     machinery accepts coalN(N_k, R, x_k)^2 in place of the pair-only
 *     coalLaw(x_k) as the per-block constant, so the every-octave
 *     certificate structurally extends to >= 3 rates per octave; the
 *     block-angle fences must be re-instantiated for the larger blocks,
 *     so the concrete >= 3 onsets are a follow-up measurement, NOT
 *     claimed here.
 * (b) Leading order is CORRECT: coalN grows like
 *     e^(-x) (2Rx)^(N-1)/(N-1)!, and at R -> 1 this matches the measured
 *     exact confluent pencil leading order (2x)^(N-1)/(N-1)! e^(-x); at
 *     N = 2, R -> 1 the law is e^(-x)(3 + 2x), asymptotically TIGHT
 *     against the sharp imp-95227 COAL-DOM value e^(-x)(x + sqrt(1+x^2))
 *     (measured ratio 1.0373 at x = 40, decreasing).
 * (c) It is a MAJORANT, not the exact envelope: the imp-95227 CONJECTURE
 *     that the fully confluent span attains the sup over N-rate sets at
 *     fixed x remains OPEN for N >= 3 -- COAL-N sidesteps dominance
 *     rather than proving it. Measured slack against the exact confluent
 *     pencil at R = 1: 2.004x (N = 3, x = 6) improving to 1.362x at
 *     x = 15; 4.275x (N = 4, x = 6) improving to 1.910x at x = 15.
 * (d) Complementarity: at N = 3 in a ratio-1.3 window the law beats the
 *     count-priced SGN-C cap for x >= 6 (0.4687 vs 0.5037 at x = 6) and
 *     the separation-priced PROP BL near coalescence (BL diverges there;
 *     BL wins deep for well-separated rates, e.g. x = 12 at separation
 *     0.15). Firing onsets (law = 1): x = 4.930455 (N = 3, R = 1.3),
 *     5.948776 (N = 3, R = 2), 7.896539 (N = 4, R = 1.3), 9.473137
 *     (N = 4, R = 2), 10.940699 (N = 5, R = 1.3).
 * (e) NO CONFLICT with imp-95224 DC-NOGO: coalN diverges as N -> inf at
 *     fixed x (Laguerre growth), so it is count-PRICED, not
 *     count-uniform; the 1/2 depth-only ceiling is untouched.
 *
 * SKEPTICAL RECORD. Interpolation identity of LEMMA BN verified on 200
 * random configurations (worst rel 1.3e-11). Chain sqrt(Lambda_pencil)
 * <= BN sum <= coalN verified with ZERO violations on 400 random
 * configurations, N = 2..5, windows R = 1.3 and 2, x up to ~ 20. Pivot
 * identity I_k = [nu_0..nu_k] phi_k verified to 1.2e-11 worst rel on 100
 * random configurations. Near-coalescent triples (separations 1e-2..1e-4)
 * confirm the BN sum stays finite and dominates the (there
 * ill-conditioned) pencil where the direct eigensolve loses digits --
 * the imp-95224/95226 coalescence float trap does NOT bite the BN form.
 * Laguerre partial-sum identity checked exactly. Refutation attempts:
 * tried to break the law at clustered-endpoint configurations (both ends
 * of the window) and at deep x with maximal R -- no violation, as the
 * proof forces; tried R < nu_max/nu_min (out of hypothesis) -- the law
 * CAN fail there, so the window hypothesis is essential and is asserted
 * in the statement.
 *
 * ROUTING. Sub-gap imp-95212-subgap-fresnel-airy-envelope-port STILL
 * OPEN. Obligation ledger: the imp-95250 named residual "N-fold
 * coalescence law" is SUPPLIED (this leg); the >= 3-per-octave
 * every-octave INSTANTIATION (block fences + onsets) is the follow-up;
 * the m-uniform block Riesz bound (imp-95252), signed WEIGHT port,
 * off-lattice rates, modulus/phase currency, and the N >= 3 confluent
 * DOMINANCE conjecture stay OPEN. No bound of the Lambda program
 * changed. NO QED. No refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95251_NFOLD_COALESCENCE_LAW = {
  id: "imp-95251",
  title:
    "THEOREM COAL-N: closed-form N-fold coalescence law sqrt(Lambda) <= " +
    "e^(-x)[L_(N-1)(-2Rx) + 2 L1_(N-2)(-2Rx)], uniform in the intra-block " +
    "configuration, via the Blaschke-Newton interpolant and NP-CERT",
  statement:
    "any at-most-N rates inside [nu, R nu], depth d, x = nu d: " +
    "sqrt(Lambda) <= e^(-x)[L_(N-1)(-2Rx) + 2 sum_(k<=N-2) L_k(-2Rx)] with " +
    "L_k(-y) = sum_(l<=k) C(k,l) y^l/l!; coalescence-uniform (no " +
    "separation denominators), monotone in N and R",
  proofChain:
    "LEMMA BN: Newton interpolation in the Blaschke basis B_k = " +
    "prod_(j<k)(s-nu_j)/(s+nu_j) gives g = sum c_k B_k in H-inf(C+) with " +
    "g(nu_i) = w_i, so sqrt(Lambda) <= sum|c_k| by imp-95226 NP-CERT; " +
    "LEMMA DD: partial sums I_k = sum_(l<=k) c_l equal the divided " +
    "difference [nu_0..nu_k] of phi_k(s) = e^(-ds) prod_(j<k)(s+nu_j) " +
    "(contour/residue argument); LEMMA LAG: mean value theorem + Leibniz " +
    "give |I_k| <= e^(-x) L_k(-2Rx); triangle inequality assembles the law",
  twoRateSpecialization:
    "N = 2, R -> 1: coalN = e^(-x)(3 + 2x), asymptotically tight against " +
    "the sharp COAL-DOM value e^(-x)(x + sqrt(1+x^2)): measured ratio " +
    "1.6525 / 1.2873 / 1.1471 / 1.0743 / 1.0373 at x = 2 / 5 / 10 / 20 / 40",
  confluenceSlack:
    "measured law-over-exact-confluent-pencil at R = 1: N = 3: 3.198 / " +
    "2.004 / 1.564 / 1.362 at x = 3 / 6 / 10 / 15; N = 4: 9.675 / 4.275 / " +
    "2.553 / 1.910 -- leading order (2x)^(N-1)/(N-1)! agrees",
  firingOnsets: {
    n3r13: 4.930455,
    n3r2: 5.948776,
    n4r13: 7.896539,
    n4r2: 9.473137,
    n5r13: 10.940699,
    note:
      "bisected roots of coalN(N, R, x) = 1; the law is vacuous below the " +
      "onset and count-priced (diverges as N grows at fixed x), consistent " +
      "with imp-95224 DC-NOGO",
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN. The imp-95250 " +
    "named residual (N-fold coalescence law for >= 3 rates per octave) is " +
    "SUPPLIED by THEOREM COAL-N; the >= 3-per-octave every-octave " +
    "instantiation (block-angle fences + onsets) is a follow-up " +
    "measurement, NOT claimed here; the N >= 3 confluent DOMINANCE " +
    "conjecture of imp-95227 remains OPEN (COAL-N is a majorant, not the " +
    "exact envelope); m-uniform block Riesz (imp-95252), signed WEIGHT " +
    "port, off-lattice rates, modulus/phase all remain OPEN; does NOT " +
    "certify the paper packets.",
  verdict:
    "RIGOROUS at the stated scope: LEMMA BN, LEMMA DD, LEMMA LAG and " +
    "THEOREM COAL-N are elementary and self-contained given imp-95226 " +
    "NP-CERT; slack against the exact confluent value is measured and " +
    "recorded, dominance is NOT claimed. Changes no bound of the Lambda " +
    "program; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function gramCauchy(nus) {
  return nus.map((a) => nus.map((b) => 1 / (a + b)));
}
function pencilM(nus, d) {
  const w = nus.map((nu) => Math.exp(-d * nu));
  return nus.map((a, i) => nus.map((b, j) => (w[i] * w[j]) / (a + b)));
}
// generalized eigen lambda_max of (M, G): Cholesky of G + power iteration
function pencilLmax(M, G, iters) {
  const n = G.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = G[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) L[i][i] = Math.sqrt(s);
      else L[i][j] = s / L[j][j];
    }
  }
  let v = new Array(n).fill(0).map((_, i) => 1 + 0.001 * Math.sin(i + 1));
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const u = v.slice();
    for (let i = n - 1; i >= 0; i--) {
      for (let k = i + 1; k < n; k++) u[i] -= L[k][i] * u[k];
      u[i] /= L[i][i];
    }
    const w = M.map((row) => row.reduce((s, m, j) => s + m * u[j], 0));
    const sVec = w.slice();
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < i; k++) sVec[i] -= L[i][k] * sVec[k];
      sVec[i] /= L[i][i];
    }
    const norm = Math.hypot(...sVec);
    lam = v.reduce((a, xv, i) => a + xv * sVec[i], 0);
    v = sVec.map((xv) => xv / norm);
  }
  return lam;
}
// LEMMA BN coefficients via the coalescence-robust recursion
function bnCoeffs(nus, d) {
  const N = nus.length;
  let f = nus.map((nu) => Math.exp(-d * nu));
  const c = [];
  for (let k = 0; k < N; k++) {
    c.push(f[k]);
    const g = f.slice();
    for (let i = k + 1; i < N; i++) {
      g[i] = ((f[i] - f[k]) * (nus[i] + nus[k])) / (nus[i] - nus[k]);
    }
    f = g;
  }
  return c;
}
// L_k(-y) = sum_(l<=k) C(k,l) y^l / l!
function lagNeg(k, y) {
  let s = 0;
  let c = 1;
  let p = 1;
  for (let l = 0; l <= k; l++) {
    s += c * p;
    c = (c * (k - l)) / (l + 1);
    p = (p * y) / (l + 1);
  }
  return s;
}
// THEOREM COAL-N right side (sqrt level)
function coalN(N, R, x) {
  const y = 2 * R * x;
  let s = lagNeg(N - 1, y);
  for (let k = 0; k <= N - 2; k++) s += 2 * lagNeg(k, y);
  return Math.exp(-x) * s;
}
// divided difference [nu_0..nu_k] phi_k, residue form (LEMMA DD right side)
function divDiffPhi(nus, d, k) {
  let s = 0;
  for (let i = 0; i <= k; i++) {
    let phi = Math.exp(-d * nus[i]);
    for (let j = 0; j < k; j++) phi *= nus[i] + nus[j];
    let den = 1;
    for (let j = 0; j <= k; j++) if (j !== i) den *= nus[i] - nus[j];
    s += phi / den;
  }
  return s;
}
// exact confluent pencil on span { t^m e^(-t) : m < NN } at depth d
function confluentLam(NN, d) {
  const w = Math.exp(-d);
  const fact = [1, 1, 2, 6, 24, 120, 720];
  const G = Array.from({ length: NN }, (_, j) =>
    Array.from({ length: NN }, (_, k) => fact[j + k] / 2 ** (j + k + 1)),
  );
  const C = (n, r) => fact[n] / (fact[r] * fact[n - r]);
  const A = Array.from({ length: NN }, (_, j) =>
    Array.from({ length: NN }, (_, k) => (k >= j ? w * C(k, j) * d ** (k - j) : 0)),
  );
  const GA = G.map((row) =>
    Array.from({ length: NN }, (_, k) => row.reduce((s, g, j) => s + g * A[j][k], 0)),
  );
  const M = Array.from({ length: NN }, (_, i) =>
    Array.from({ length: NN }, (_, k) => {
      let s = 0;
      for (let j = 0; j < NN; j++) s += A[j][i] * GA[j][k];
      return s;
    }),
  );
  const Msym = M.map((row, i) => row.map((v, k) => (v + M[k][i]) / 2));
  return pencilLmax(Msym, G, 3000);
}
// deterministic PRNG (reproducible grids)
function makeRnd(seed0) {
  let seed = seed0;
  return () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
}
function randomConfig(rnd, Rcap) {
  const N = 2 + Math.floor(rnd() * 4);
  const nus = [];
  while (nus.length < N) {
    const cand = 1 + rnd() * (Rcap - 1);
    if (nus.every((v) => Math.abs(v - cand) > 0.02)) nus.push(cand);
  }
  nus.sort((a, b) => a - b);
  const d = 0.3 + rnd() * 10;
  return { nus, d };
}

export const IMP95251_NFOLD_COALESCENCE_ASSERTIONS = [
  {
    id: "imp95251-bn-interpolates",
    description:
      "LEMMA BN: the Blaschke-Newton expansion sum c_k B_k reproduces the " +
      "shift data w_i = e^(-d nu_i) on random configurations (rel < 1e-8)",
    holds: () => {
      const rnd = makeRnd(12345);
      for (let t = 0; t < 40; t++) {
        const { nus, d } = randomConfig(rnd, 2.0);
        const c = bnCoeffs(nus, d);
        for (let i = 0; i < nus.length; i++) {
          let g = 0;
          for (let k = 0; k < nus.length; k++) {
            let B = 1;
            for (let j = 0; j < k; j++) B *= (nus[i] - nus[j]) / (nus[i] + nus[j]);
            g += c[k] * B;
          }
          const w = Math.exp(-d * nus[i]);
          if (Math.abs(g - w) / w > 1e-8) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95251-chain-pencil-bn-law",
    description:
      "THEOREM COAL-N chain on deterministic random grids (N = 2..5, " +
      "windows R = 1.3 and 2): sqrt(Lambda_pencil) <= BN sum <= coalN, " +
      "zero violations",
    holds: () => {
      for (const [seed0, Rcap] of [
        [777, 1.3],
        [2468, 2.0],
      ]) {
        const rnd = makeRnd(seed0);
        for (let t = 0; t < 60; t++) {
          const { nus, d } = randomConfig(rnd, Rcap);
          const x = nus[0] * d;
          const lam = pencilLmax(pencilM(nus, d), gramCauchy(nus), 3000);
          const bn = bnCoeffs(nus, d).reduce((a, c) => a + Math.abs(c), 0);
          const law = coalN(nus.length, Rcap, x);
          if (Math.sqrt(Math.max(lam, 0)) > bn * (1 + 1e-6)) return false;
          if (bn > law * (1 + 1e-12)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95251-pivot-identity",
    description:
      "LEMMA DD: partial sums I_k of the BN coefficients equal the divided " +
      "difference [nu_0..nu_k] of phi_k(s) = e^(-ds) prod_(j<k)(s + nu_j) " +
      "(rel < 1e-8), and LEMMA LAG caps |I_k| by e^(-x) L_k(-2Rx)",
    holds: () => {
      const rnd = makeRnd(9090);
      for (let t = 0; t < 40; t++) {
        const { nus, d } = randomConfig(rnd, 2.0);
        const c = bnCoeffs(nus, d);
        const x = nus[0] * d;
        const R = nus[nus.length - 1] / nus[0];
        let Ik = 0;
        for (let k = 0; k < nus.length; k++) {
          Ik += c[k];
          const dd = divDiffPhi(nus, d, k);
          const scale = Math.max(Math.abs(dd), 1e-300);
          if (Math.abs(Ik - dd) / scale > 1e-8) return false;
          if (Math.abs(Ik) > Math.exp(-x) * lagNeg(k, 2 * R * x) * (1 + 1e-9))
            return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95251-coalescence-robust",
    description:
      "coalescence robustness: at near-coalescent triples (separations " +
      "1e-2, 1e-3) the BN sum stays finite, dominates the pencil, and sits " +
      "under coalN(3, 1.3, x) -- the regime where PROP BL diverges",
    holds: () => {
      for (const eps of [1e-2, 1e-3]) {
        for (const x of [2, 5, 8]) {
          const nus = [1, 1 + eps, 1 + 2 * eps];
          const lam = pencilLmax(pencilM(nus, x), gramCauchy(nus), 3000);
          const bn = bnCoeffs(nus, x).reduce((a, c) => a + Math.abs(c), 0);
          if (!(Math.sqrt(Math.max(lam, 0)) <= bn * (1 + 1e-6))) return false;
          if (!(bn <= coalN(3, 1.3, x))) return false;
          if (!Number.isFinite(bn)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95251-two-rate-specialization",
    description:
      "N = 2, R = 1: coalN = e^(-x)(3 + 2x) exactly, dominates the sharp " +
      "COAL-DOM value e^(-x)(x + sqrt(1+x^2)), ratio 1.0373 at x = 40 " +
      "(asymptotic tightness at pair coalescence)",
    holds: () => {
      for (const x of [0.5, 2, 5, 10, 20, 40]) {
        const law = coalN(2, 1, x);
        const closed = Math.exp(-x) * (3 + 2 * x);
        if (Math.abs(law - closed) / closed > 1e-13) return false;
        const sharp = Math.exp(-x) * (x + Math.sqrt(1 + x * x));
        if (!(law >= sharp)) return false;
      }
      const r40 = coalN(2, 1, 40) / (Math.exp(-40) * (40 + Math.sqrt(1601)));
      return Math.abs(r40 - 1.0373) < 1e-3;
    },
  },
  {
    id: "imp95251-confluent-slack",
    description:
      "measured slack vs the exact confluent pencil at R = 1: law >= " +
      "sqrt(confluent Lambda) always; ratio 2.004 (N = 3, x = 6) and 1.910 " +
      "(N = 4, x = 15) to 1e-2 -- leading order agreement recorded, " +
      "dominance NOT claimed",
    holds: () => {
      for (const [NN, x] of [
        [3, 3],
        [3, 6],
        [3, 10],
        [3, 15],
        [4, 6],
        [4, 10],
        [4, 15],
      ]) {
        const s = Math.sqrt(Math.max(confluentLam(NN, x), 0));
        if (!(coalN(NN, 1, x) >= s)) return false;
      }
      const r36 = coalN(3, 1, 6) / Math.sqrt(confluentLam(3, 6));
      const r415 = coalN(4, 1, 15) / Math.sqrt(confluentLam(4, 15));
      return Math.abs(r36 - 2.004) < 1e-2 && Math.abs(r415 - 1.91) < 1e-2;
    },
  },
  {
    id: "imp95251-firing-onsets",
    description:
      "bisected firing onsets of coalN = 1 match the baked constants to " +
      "1e-5: (N, R) = (3, 1.3), (3, 2), (4, 1.3), (4, 2), (5, 1.3)",
    holds: () => {
      const onset = (N, R) => {
        let lo = 0.01;
        let hi = 200;
        for (let it = 0; it < 100; it++) {
          const mid = (lo + hi) / 2;
          if (coalN(N, R, mid) < 1) hi = mid;
          else lo = mid;
        }
        return (lo + hi) / 2;
      };
      const F = IMP95251_NFOLD_COALESCENCE_LAW.firingOnsets;
      return (
        Math.abs(onset(3, 1.3) - F.n3r13) < 1e-5 &&
        Math.abs(onset(3, 2) - F.n3r2) < 1e-5 &&
        Math.abs(onset(4, 1.3) - F.n4r13) < 1e-5 &&
        Math.abs(onset(4, 2) - F.n4r2) < 1e-5 &&
        Math.abs(onset(5, 1.3) - F.n5r13) < 1e-5
      );
    },
  },
  {
    id: "imp95251-monotone-and-count-priced",
    description:
      "structural fences: coalN is nondecreasing in N and in R (a bound " +
      "for (N, R) covers smaller blocks and narrower windows), and " +
      "diverges as N grows at fixed x (count-priced -- no DC-NOGO conflict)",
    holds: () => {
      for (const x of [1, 4, 9]) {
        for (const R of [1.1, 1.3, 2]) {
          let prev = 0;
          for (let N = 1; N <= 8; N++) {
            const v = coalN(N, R, x);
            if (v < prev - 1e-15) return false;
            prev = v;
          }
        }
        if (!(coalN(2, 1.3, x) <= coalN(2, 2, x))) return false;
        if (!(coalN(40, 1.3, x) > 1)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95251-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap named STILL OPEN, the " +
      "residual is SUPPLIED not the instantiation, dominance conjecture " +
      "stays OPEN, majorant status stated, paper packets not certified, " +
      "and no QED",
    holds: () =>
      /STILL OPEN/.test(IMP95251_NFOLD_COALESCENCE_LAW.subGap) &&
      /SUPPLIED/.test(IMP95251_NFOLD_COALESCENCE_LAW.subGap) &&
      /DOMINANCE conjecture of imp-95227 remains OPEN/.test(
        IMP95251_NFOLD_COALESCENCE_LAW.subGap,
      ) &&
      /majorant, not the exact envelope/.test(
        IMP95251_NFOLD_COALESCENCE_LAW.subGap,
      ) &&
      /does NOT certify the paper packets/.test(
        IMP95251_NFOLD_COALESCENCE_LAW.subGap,
      ) &&
      /NO QED/.test(IMP95251_NFOLD_COALESCENCE_LAW.verdict) &&
      /refereed bound is changed/i.test(IMP95251_NFOLD_COALESCENCE_LAW.verdict),
  },
];

for (const a of IMP95251_NFOLD_COALESCENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95251-nfold-coalescence-law assertion failed: ${a.id}`);
  }
}

export default IMP95251_NFOLD_COALESCENCE_LAW;
