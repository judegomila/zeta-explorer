/**
 * imp-95211 - RIGOROUS step -- LEMMA R1 (single-rate rank-one seam collapse)
 * + LEMMA BI (Cauchy biorthogonal norms, closed form) + THEOREM DR (dyadic
 * shift-damping: an n-shell-UNIFORM cross-seam mass bound for lacunary
 * exponential sums) + THEOREM HL (H-LOC derived from the dyadic dictionary
 * hypothesis H-DYA, with explicit thetas and the instantiated gammaSL):
 * THIRD leg of the seam chain, approaching the named successor sub-gap
 * imp-95210-subgap-hloc-from-dyadic-support. The imp-95210 demand -- a
 * per-block rate-dressing cap, since LEMMA NG proved center collars alone
 * cannot supply H-LOC -- is met by the ONE structural feature the dyadic
 * dictionary carries: a single fixed rate per shell with lacunary (ratio
 * >= 2) separation across shells. Under that hypothesis the cross-seam
 * mass fraction of each parity sum is bounded, UNIFORMLY IN THE NUMBER OF
 * SHELLS AND OF PACKETS PER SHELL, by an explicit closed form, and H-LOC
 * follows with explicit constants whenever the collar depth in slowest-rate
 * units exceeds an explicit threshold xStar = 2.651017799014494.
 *
 * SETTING (identical to imp-95172/95208/95209/95210; model family sigma = 1,
 * theta = 10, s = 11; M = 1). Packets are two-sided exponentials
 * a e^(-mu|t-c|) in L2(R); seam at t = 0; even parity lives on the left,
 * odd on the right. Collar depth d > 0: even centers c <= -d, odd centers
 * c >= d. Carried constants (single source of truth: sibling verdicts):
 * LwEven = 3.9197935113802585e-5, q = 0.03755392855053636,
 * cU = 0.30501330232499435, kappa = 48.717745853978386,
 * gammaOV = 0.9995949885454457, and from imp-95210 the H-LOC machinery
 * (THEOREM SL, THEOREM SL-CAP, COROLLARY GC-SL) with gRef/gammaSLRef.
 *
 * HYPOTHESIS H-DYA(m, d) -- the dyadic-dictionary structure, per parity:
 * the parity sum is a (finite, or L2-limit of finite) combination of
 * packets a_j e^(-mu_j|t-c_j|) whose distinct rates, sorted increasingly
 * mu_1 < mu_2 < ... < mu_n, satisfy mu_1 >= m and mu_{b+1} >= 2 mu_b
 * (lacunary ladder -- ONE fixed rate per dyadic shell), and whose centers
 * all sit at depth >= d on the parity's own side of the seam. n and the
 * per-shell packet counts are arbitrary. This is exactly the "fixed
 * per-shell rate scale" of the paper Section 4.5 dictionary, stated at the
 * minimal level; the pairwise consequence mu_s/mu_r >= 2^(s-r) is all the
 * proofs use.
 *
 * LEMMA R1 (rank-one seam collapse; eliminates in-block dressing exactly).
 * A single-rate block B(t) = sum_j a_j e^(-mu|t-c_j|) with all c_j <= -d
 * satisfies, for EVERY t >= -d,  B(t) = A e^(-mu t) with
 * A = sum_j a_j e^(mu c_j): since t >= -d >= c_j gives |t-c_j| = t - c_j,
 * each packet restricts to a multiple of the SAME decaying exponential.
 * PROOF: one line, the absolute value resolves. QED. CONSEQUENCE: on
 * [-d, infinity) the whole even parity sum U lies in the n-dimensional
 * span of {e^(-mu_b t)}, REGARDLESS of how many packets each shell holds;
 * the LEMMA NG dressing mechanism (divided differences over nearby rates)
 * needs in-block rate multiplicity and is structurally unavailable.
 *
 * LEMMA BI (biorthogonal norms in L2(0, infinity), Cauchy closed form).
 * For distinct rates mu_1 < ... < mu_n the Gram of {e^(-mu_r s)} on the
 * half-line is the symmetric Cauchy matrix G_rs = 1/(mu_r + mu_s), and
 *   (G^(-1))_rr = 2 mu_r beta_r^2 ,
 *   beta_r = prod_{k != r} (mu_r + mu_k)/|mu_r - mu_k| .
 * PROOF. Cramer: (G^(-1))_rr = det(G with row+column r deleted)/det(G).
 * Both determinants are Cauchy determinants,
 * det[1/(mu_i + mu_j)] = prod_{i<j}(mu_i - mu_j)^2 / prod_{i,j}(mu_i + mu_j);
 * every factor not involving index r cancels in the ratio. What survives in
 * the numerator is the product over all pairs (i, j) with i = r or j = r of
 * (mu_i + mu_j), which equals (2 mu_r) prod_{k != r}(mu_r + mu_k)^2; what
 * survives in the denominator is prod_{k != r}(mu_r - mu_k)^2. QED. Hence the biorthogonal element
 * psi_r (the unique element of the span with <e^(-mu_s .), psi_r> =
 * delta_rs) has ||psi_r||^2 = (G^(-1))_rr, and every f = sum A_r e^(-mu_r s)
 * obeys the coefficient bound  |A_r| = |<f, psi_r>| <= sqrt(2 mu_r) beta_r
 * ||f||_{L2(0, infinity)}.
 *
 * THEOREM DR (dyadic shift damping, n-uniform). Let f(s) =
 * sum_{r=1}^n A_r e^(-mu_r s) with mu_1 >= m and mu_{r+1} >= 2 mu_r, and
 * let c_k = (2^k + 1)/(2^k - 1), P_0 = 1, P_j = c_1 c_2 ... c_j,
 * C_inf = lim P_j = prod_{k>=1} (2^k + 1)/(2^k - 1) = 8.255987935778247...
 * (convergent: log c_k <= 2^(1-k)/(1 - 2^(-2k)); the partial product P_60
 * is exact to double precision). Then for every x = m d > 0,
 *   integral_d^inf f^2 <= LamN(n, x) integral_0^inf f^2 ,
 *   sqrt(LamN(n, x)) = sum_{r=1}^n P_{r-1} P_{n-r} e^(-2^(r-1) x) ,
 * and n-uniformly
 *   integral_d^inf f^2 <= LamBar(x) integral_0^inf f^2 ,
 *   sqrt(LamBar(x)) = C_inf sum_{r>=1} P_{r-1} e^(-2^(r-1) x)
 * (the series converges for every x > 0: doubly exponential decay beats the
 * bounded P factors). PROOF. sqrt(integral_d^inf f^2) =
 * ||sum_r A_r e^(-mu_r d) e^(-mu_r s)||_{L2(0, inf)} <= sum_r |A_r|
 * e^(-mu_r d) (2 mu_r)^(-1/2)   (triangle inequality, ||e^(-mu_r .)|| =
 * (2 mu_r)^(-1/2)) <= ||f|| sum_r beta_r e^(-mu_r d)   (LEMMA BI). The
 * lacunary hypothesis gives mu_r >= 2^(r-1) m, so e^(-mu_r d) <=
 * e^(-2^(r-1) x); and each factor of beta_r is (q + 1)/(q - 1) at a ratio
 * q = mu_max/mu_min >= 2^|r-k|, and (q + 1)/(q - 1) is decreasing in q, so
 * beta_r <= prod_{j=1}^{r-1} c_j prod_{j=1}^{n-r} c_j = P_{r-1} P_{n-r}
 * <= C_inf P_{r-1}. QED. NOTE the mechanism: the shift acts DIAGONALLY on
 * the exponential span (e^(-mu_r(s+d)) = e^(-mu_r d) e^(-mu_r s)), so the
 * multi-shell bound reduces to the single-shell damping e^(-mu_r d) times
 * an explicit cross-shell coupling price (the Cauchy products) -- exactly
 * the shell-decoupling shape the frontier protocol asks for.
 *
 * THEOREM HL (H-LOC from H-DYA). Under H-DYA(m, d) with x = m d > xStar,
 * where xStar = 2.651017799014494 is the unique root of LamBar(xStar) =
 * 1/2 (uniqueness: LamBar is strictly decreasing), BOTH parities satisfy
 * the cross-seam localization
 *   integral_{wrong side} (parity sum)^2 <= LamBar(x) ||parity sum||^2 ,
 * so H-LOC(thetaE, thetaO) of imp-95210 holds with the seam partition
 * S_e = (-inf, 0), S_o = [0, inf) and thetaE^2 = thetaO^2 = 1 - LamBar(x)
 * > 1/2 (the gate thetaE^2 + thetaO^2 > 1 is exactly LamBar < 1/2).
 * THEOREM SL then gives g(x) = 2 sqrt(LamBar(x)(1 - LamBar(x))) and
 * COROLLARY GC-SL instantiates the global cap gammaSL(g(x)).
 * PROOF. By LEMMA R1 the even parity sum U equals the exponential-sum
 * trace f(s) = U(s - d) on [-d, inf) (s >= 0), and L2-limits stay in this
 * closed finite-dimensional span on [-d, inf). Then
 * integral_0^inf U^2 = integral_d^inf f^2 <= LamBar(x) integral_0^inf f^2
 * = LamBar(x) integral_{-d}^inf U^2 <= LamBar(x) ||U||^2 (THEOREM DR; the
 * left-of-collar mass only enlarges the denominator). Odd parity is the
 * mirror image. QED.
 * PAYOFF TABLE (exact evaluations of the closed forms; the collapse from
 * gammaOV = 0.9995949885454457):
 *   x = m d = 3: LamBar = 0.2234346210244193, theta^2 = 0.7765653789755806,
 *                g = 0.8330944511928846, gammaSL = 0.8467867038778544
 *   x = m d = 4: LamBar = 0.025448884586827522, theta^2 = 0.9745511154131725,
 *                g = 0.31496818163182044, gammaSL = 0.5495810850672158
 *   x = m d = 5: LamBar = 0.0032208982460485793, theta^2 = 0.9967791017539515,
 *                g = 0.11332297314379253, gammaSL = 0.5064185121901253
 * (Float error in the baked caps is O(1e-15) relative -- far below the
 * slack in every downstream use; the assertions reproduce them to rel
 * 1e-12 from the defining products/series.)
 *
 * WHY THIS DOES NOT CONTRADICT LEMMA NG. The NG closure argument dressed
 * packets with rates FREE IN A BAND: divided differences over coalescing
 * rate nodes manufacture |t-c|^k e^(-mu|t-c|) and push cross-seam mass to
 * 1/2. H-DYA forbids exactly that: one rate per shell, ratio >= 2 between
 * shells -- there are no nearby rates to coalesce. The NG 7-node witness
 * (rates 1.0..2.2, consecutive ratios ~1.2) violates H-DYA, and at its
 * depth m d = 0.3 the bound LamBar(0.3) > 1 is vacuous anyway (asserted
 * below): the theorem only bites for m d > xStar. The boundary is sharp in
 * kind: the exact-rate structure is load-bearing, since ANY rate band of
 * nonempty interior per shell reopens the NG mechanism in the closure.
 *
 * HONEST LIMITS. (a) H-DYA is the MODEL-LEVEL formalization of the paper
 * dictionary feature ("fixed per-shell rate scale"); the actual paper
 * Section 4.5 packets are Fresnel-Airy, not two-sided exponentials, and
 * their explicit (m, d, ratio) constants are NOT extracted here -- that is
 * the named successor sub-gap. (b) The bound is triangle-inequality lossy:
 * at (n = 2, m d = 3) the true generalized eigenvalue is
 * 0.020388763656718833 vs the finite-n bound 0.02458544397473741 (ratio
 * 0.83), and the n-uniform LamBar pays a further C_inf^2-scale premium;
 * whether the TRUE dyadic-class sup clears 1/2 for some m d < xStar is
 * open (the theorem is one-sided). (c) For m d <= xStar nothing is
 * delivered: LamBar >= 1/2 there and H-LOC does not follow. If the paper
 * collar is shallower than xStar slowest-rate units, this route does not
 * close the sub-gap. (d) Per-shell rate EXACTNESS is load-bearing (see the
 * NG boundary above); finitely many distinct well-separated rates per
 * shell can be priced by the same beta products but degrade as the
 * in-shell separation shrinks -- not developed here. (e) Model-family
 * constants (sigma = 1, theta = 10) throughout; gammaSL remains a cap, not
 * proved attained; the measured class sup phi = 0.3572 (imp-95113) is
 * untouched and sits below every payoff row.
 *
 * SUB-GAP (surviving, explicitly named, NOT closed):
 *   imp-95211-subgap-paper-packet-dyadic-constants -- extract the explicit
 *   dictionary constants (slowest shell rate m, collar depth d, shell
 *   ratio) for the actual Permuting the Zeta Twin Ladder Section 4.5
 *   packets, verify the single-rate-per-shell structure survives the
 *   Fresnel-Airy envelope (or price the finite per-shell rate multiplicity
 *   via the same beta products), and check m d > xStar = 2.651017799014494.
 *   Only that instantiation converts the conditional collapse
 *   gammaOV -> gammaSL(g(m d)) into an unconditional model-chain statement.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) LEMMA BI approached by numerically
 * inverting the Cauchy Gram at the dyadic ladder (1, 2, 4, 8) and the
 * non-dyadic (1, 2.5, 7): closed form matches to rel 1e-8 (observed
 * ~1e-12). (2) The coefficient bound |A_r| <= sqrt(2 mu_r) beta_r ||f||
 * approached by a 5000-draw random battery (random lacunary ladders, random
 * signed coefficients): no violation. (3) THEOREM DR approached two ways:
 * 5000 random Rayleigh quotients (a^T DGD a)/(a^T G a) never exceed the
 * finite-n bound, and the TRUE lambda_max (power iteration on G^(-1) DGD)
 * at (n, m d) = (2, 3), (4, 2), (6, 1), (8, 3) never exceeds either bound
 * -- including (6, 1) where the bound is vacuously > 1, kept deliberately
 * as an honesty row. (4) THEOREM HL approached end-to-end: 3000 random
 * dyadic-dictionary witnesses (jittered ratios >= 2, up to 3 packets per
 * shell, random depths), cross-seam fraction computed by EXACT closed-form
 * integrals, never exceeds min(1, LamBar(m d)); the LEMMA R1 collapse
 * identity is checked pointwise on every draw. (5) The NG-boundary is
 * checked: the NG witness rates violate H-DYA and LamBar is vacuous at its
 * depth, so no tension with the imp-95210 insufficiency lemma. (6) The
 * gammaSL instantiation chain is cross-checked against the imp-95210 baked
 * pair (gRef, gammaSLRef) to rel 1e-12 (transcription guard).
 *
 * The numerics below CROSS-CHECK the lemma statements; they are not the
 * claim. Import-light (no heavy bundle; imports only the four sibling
 * verdict modules for carried constants). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

import BNT from "./imp-95172-ballast-necessity-tradeoff.js";
import MBU from "./imp-95208-mb-uniform-ballast-cap.js";
import OVC from "./imp-95209-overlap-currency-cap.js";
import SML from "./imp-95210-seam-mass-localization-cap.js";

// ── carried constants (single source of truth: sibling verdict objects) ─────
const LW_EVEN = BNT.constants.lwEven; // 3.9197935113802585e-5
const Q_OD = BNT.constants.q; // 0.03755392855053636
const C_U = MBU.constants.cU; // 0.30501330232499435
const KAPPA = OVC.constants.kappa; // 48.717745853978386
const GAMMA_OV = OVC.constants.gammaOV; // 0.9995949885454457

// ── new baked literals (recomputed by the assertions) ────────────────────────
const C_INF = 8.255987935778247; // prod_{k>=1} (2^k+1)/(2^k-1), P_60 exact in double
const X_STAR = 2.651017799014494; // unique root of LamBar(x) = 1/2
const TRUE_LAM_N2_MD3 = 0.020388763656718833; // power-iteration lambda_max, tightness record
const BOUND_LAM_N2_MD3 = 0.02458544397473741; // finite-n bound at (2, 3)
const PAYOFF_TABLE = [
  {
    md: 3,
    lamBar: 0.2234346210244193,
    theta2: 0.7765653789755806,
    g: 0.8330944511928846,
    gammaSL: 0.8467867038778544,
  },
  {
    md: 4,
    lamBar: 0.025448884586827522,
    theta2: 0.9745511154131725,
    g: 0.31496818163182044,
    gammaSL: 0.5495810850672158,
  },
  {
    md: 5,
    lamBar: 0.0032208982460485793,
    theta2: 0.9967791017539515,
    g: 0.11332297314379253,
    gammaSL: 0.5064185121901253,
  },
];

// ── shared kernel convention (identical to the sibling modules) ──────────────
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// ── theorem functionals ──────────────────────────────────────────────────────
const KMAX = 60;
const C_FACTORS = [];
const P_PARTIAL = [1];
for (let k = 1; k <= KMAX; k++) {
  C_FACTORS.push((Math.pow(2, k) + 1) / (Math.pow(2, k) - 1));
  P_PARTIAL.push(P_PARTIAL[k - 1] * C_FACTORS[k - 1]);
}
function betaProduct(mus, r) {
  let b = 1;
  for (let k = 0; k < mus.length; k++) {
    if (k !== r) b *= (mus[r] + mus[k]) / Math.abs(mus[r] - mus[k]);
  }
  return b;
}
function sqrtLamN(n, x) {
  let s = 0;
  for (let r = 1; r <= n; r++) {
    const e = Math.pow(2, r - 1) * x;
    if (e > 745) break;
    s += P_PARTIAL[r - 1] * P_PARTIAL[n - r] * Math.exp(-e);
  }
  return s;
}
function sqrtLamBar(x) {
  let s = 0;
  for (let r = 1; r <= KMAX; r++) {
    const e = Math.pow(2, r - 1) * x;
    if (e > 745) break;
    s += P_PARTIAL[r - 1] * Math.exp(-e);
  }
  return C_INF * s;
}
function lamBar(x) {
  const s = sqrtLamBar(x);
  return s * s;
}
// gammaSL chain, imp-95210 conventions (cross-checked against its baked pair)
function hStarSL(omega, g) {
  const sE = LW_EVEN * (1 - omega);
  const sO = Q_OD * LW_EVEN * omega;
  const bSq = C_U * C_U * omega;
  const rSt = Math.min(bSq, g * g * sE);
  return sE + 2 * sO - rSt + 2 * g * Math.sqrt(sE * rSt);
}
function phiCapSL(omega, g) {
  return hStarSL(omega, g) / (2 * LW_EVEN);
}
function thetaSL(g) {
  return (KAPPA * KAPPA + 1 - 2 * Q_OD) / (g * KAPPA);
}
function omegaStarSL(g) {
  const th = thetaSL(g);
  const T = 4 + th * th;
  return 2 / (T * (1 + Math.sqrt(1 - 4 / T)));
}
function gammaSL(g) {
  return phiCapSL(omegaStarSL(g), g);
}
function gFromLamBar(lam) {
  return 2 * Math.sqrt(lam * (1 - lam));
}
// small dense linear algebra for the cross-checks
function invMatrix(A) {
  const n = A.length;
  const M = A.map((row, i) =>
    row.concat(Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))),
  );
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[p][i])) p = k;
    }
    const tmp = M[i];
    M[i] = M[p];
    M[p] = tmp;
    const piv = M[i][i];
    for (let j = 0; j < 2 * n; j++) M[i][j] /= piv;
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const f = M[k][i];
      for (let j = 0; j < 2 * n; j++) M[k][j] -= f * M[i][j];
    }
  }
  return M.map((row) => row.slice(n));
}
function matVec(A, x) {
  return A.map((row) => row.reduce((s, v, j) => s + v * x[j], 0));
}
function quadForm(A, x) {
  return x.reduce((s, xi, i) => s + xi * matVec(A, x)[i], 0);
}
function cauchyGram(mus) {
  return mus.map((a) => mus.map((b) => 1 / (a + b)));
}
function shiftedGram(mus, d) {
  return mus.map((a) => mus.map((b) => Math.exp(-(a + b) * d) / (a + b)));
}
function trueLambdaMax(mus, d) {
  const G = cauchyGram(mus);
  const H = shiftedGram(mus, d);
  const Gi = invMatrix(G);
  let x = mus.map((_, i) => 1 / (1 + i));
  for (let it = 0; it < 400; it++) {
    const y = matVec(Gi, matVec(H, x));
    const nrm = Math.sqrt(y.reduce((s, v) => s + v * v, 0));
    if (nrm === 0) break;
    x = y.map((v) => v / nrm);
  }
  return quadForm(H, x) / quadForm(G, x);
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95211_DYADIC_RATE_LOCALIZATION = {
  ticket:
    "imp-95211 (third leg of the seam chain, approaching imp-95210-subgap-hloc-from-dyadic-support: the per-block rate-dressing cap demanded by LEMMA NG is supplied by the dyadic-dictionary structure itself -- one fixed rate per shell, lacunary ratio >= 2 -- via a rank-one seam collapse per shell plus an explicit Cauchy biorthogonal bound across shells, giving an n-shell-uniform cross-seam mass bound and hence H-LOC with explicit constants whenever m d > xStar)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes THEOREM SL / COROLLARY GC-SL and the H-LOC frame (imp-95210), THEOREM OV constants (imp-95209), THEOREM BU (imp-95208), the OD class caps (imp-95129 via imp-95172); carried constants imported from the four sibling verdict objects.",
  hypothesisHDYA:
    "H-DYA(m, d), per parity: the parity sum is a finite combination (or L2 limit of such) of two-sided exponential packets whose DISTINCT rates, sorted, satisfy mu_1 >= m and mu_{b+1} >= 2 mu_b (one fixed rate per dyadic shell), with every center at depth >= d on the parity's own side of the seam. Model-level formalization of the paper dictionary's fixed per-shell rate scale; NOT instantiated for the paper packets here (named successor sub-gap).",
  lemmaR1:
    "Single-rate rank-one seam collapse: a block sum_j a_j e^(-mu|t-c_j|) with all c_j <= -d equals (sum_j a_j e^(mu c_j)) e^(-mu t) for every t >= -d -- the far-side trace of each shell is ONE-dimensional regardless of packet count, so the LEMMA NG dressing mechanism (which needs in-block rate multiplicity) is structurally unavailable under H-DYA.",
  lemmaBI:
    "Cauchy biorthogonal closed form on L2(0, infinity): for distinct rates, (G^(-1))_rr = 2 mu_r beta_r^2 with beta_r = prod_{k != r}(mu_r + mu_k)/|mu_r - mu_k| (Cramer + two Cauchy determinants); hence |A_r| <= sqrt(2 mu_r) beta_r ||f|| for every f = sum A_r e^(-mu_r s).",
  theoremDR:
    "Dyadic shift damping, n-uniform: under the lacunary hypothesis, integral_d^inf f^2 <= LamN(n, m d) integral_0^inf f^2 with sqrt(LamN(n, x)) = sum_{r=1}^n P_{r-1} P_{n-r} e^(-2^(r-1) x), and n-uniformly sqrt(LamBar(x)) = C_inf sum_{r>=1} P_{r-1} e^(-2^(r-1) x), C_inf = prod (2^k+1)/(2^k-1) = 8.255987935778247. Mechanism: the shift acts diagonally on the exponential span, so the multi-shell bound reduces to single-shell damping times explicit Cauchy cross-shell coupling products.",
  theoremHL:
    "H-LOC from H-DYA: for m d > xStar = 2.651017799014494 (unique root of LamBar = 1/2), both parities localize with thetaE^2 = thetaO^2 = 1 - LamBar(m d) > 1/2 over the seam partition, THEOREM SL applies with g = 2 sqrt(LamBar(1 - LamBar)), and COROLLARY GC-SL instantiates gammaSL(g). Payoff rows at m d = 3/4/5: gammaSL = 0.8467867038778544 / 0.5495810850672158 / 0.5064185121901253, versus gammaOV = 0.9995949885454457 without the dictionary input.",
  constants: {
    cInf: C_INF,
    xStar: X_STAR,
    trueLamN2Md3: TRUE_LAM_N2_MD3,
    boundLamN2Md3: BOUND_LAM_N2_MD3,
    payoffTable: PAYOFF_TABLE,
  },
  subGap:
    "imp-95211-subgap-paper-packet-dyadic-constants -- OPEN: extract the explicit dictionary constants (slowest shell rate m, collar depth d, shell ratio) for the actual paper Section 4.5 packets, verify the single-rate-per-shell structure survives the Fresnel-Airy envelope (or price finite per-shell rate multiplicity via the same beta products), and check m d > xStar. Also recorded, open: whether the TRUE dyadic-class sup clears 1/2 for some m d < xStar (the bound is one-sided and triangle-inequality lossy).",
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "THIRD LEG DELIVERED: imp-95210-subgap-hloc-from-dyadic-support is given its structural resolution at the model level -- H-DYA (the dyadic dictionary's fixed per-shell rate scale + collar) IMPLIES H-LOC with explicit thetas whenever m d > xStar = 2.651017799014494, via LEMMA R1 rank-one collapse + LEMMA BI Cauchy biorthogonal norms + THEOREM DR n-shell-uniform shift damping; gammaSL instantiates to 0.8468/0.5496/0.5064 at m d = 3/4/5. HONEST LIMIT: the paper-packet constants (m, d, ratio) are NOT extracted and the Fresnel-Airy port is open (successor sub-gap imp-95211-subgap-paper-packet-dyadic-constants); for m d <= xStar nothing is delivered; measured class sup phi = 0.3572 unchanged",
  ],
  isRigorous: true,
  rigorScope:
    "LEMMA R1, LEMMA BI and THEOREM DR are unconditional closed-form statements about lacunary exponential sums on the line/half-line (one-line absolute-value resolution; Cramer + Cauchy determinants; triangle inequality + biorthogonal coefficient bounds + monotonicity of (q+1)/(q-1)). THEOREM HL is conditional exactly as THEOREM SL / COROLLARY GC-SL (the carried imp-95172/95208/95209/95210 chain) PLUS the new named dictionary hypothesis H-DYA replacing the bare H-LOC -- H-DYA implies H-LOC by THEOREM DR, so the hypothesis has been pushed from an abstract mass-localization statement down to the concrete structural feature the paper dictionary carries. H-DYA itself is NOT instantiated for the paper packets and every conditional statement names it. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step: the rate-dressing cap demanded by imp-95210-subgap-hloc-from-dyadic-support is DERIVED from the dyadic dictionary structure at the model level. LEMMA R1: a single-rate shell collapses to a rank-one exponential trace on the far side of its collar -- in-block NG dressing is structurally impossible. LEMMA BI: the half-line exponential biorthogonal norms have the exact Cauchy closed form sqrt(2 mu_r) prod_{k != r}(mu_r + mu_k)/|mu_r - mu_k|. THEOREM DR: for lacunary ladders (ratio >= 2) these products are uniformly bounded by explicit partial products of C_inf = prod (2^k+1)/(2^k-1) = 8.255987935778247, giving the n-shell-UNIFORM cross-seam bound LamBar(m d) = [C_inf sum P_{r-1} e^(-2^(r-1) m d)]^2. THEOREM HL: H-DYA(m, d) therefore implies H-LOC with thetaE^2 = thetaO^2 = 1 - LamBar(m d) whenever m d > xStar = 2.651017799014494, and the imp-95210 cap instantiates: gammaOV = 0.9995949885454457 collapses to gammaSL = 0.8467867038778544 / 0.5495810850672158 / 0.5064185121901253 at m d = 3 / 4 / 5. The multi-shell bound reduces to the single-shell damping times explicit cross-shell Cauchy coupling constants -- the shell-decoupling shape the frontier contract asks for. HONEST: H-DYA is not instantiated for the paper packets (Fresnel-Airy port + explicit (m, d, ratio) extraction = successor sub-gap imp-95211-subgap-paper-packet-dyadic-constants); the bound is triangle-inequality lossy (true 0.020389 vs bound 0.024585 at n = 2, m d = 3) and one-sided (below xStar nothing is delivered); per-shell rate exactness is load-bearing (any rate band reopens LEMMA NG in the closure); model-family constants; gammaSL is a cap, not proved attained; measured class sup phi = 0.3572 untouched. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95211_DRL_ASSERTIONS = [
  {
    id: "imp95211-drl-constants-closed-form",
    description:
      "baked literals reproduce from the defining products/series (rel 1e-12): C_inf as the partial product P_60, xStar by bisection on sqrt(LamBar) = 1/sqrt(2), the payoff rows (LamBar, theta^2, g, gammaSL at m d = 3/4/5), the finite-n bound at (2, 3), and the gammaSL chain reproduces the imp-95210 baked pair (gRef -> gammaSLRef) and kappa identity",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      if (!rel(P_PARTIAL[KMAX], C_INF)) return false;
      let lo = 1;
      let hi = 6;
      for (let i = 0; i < 200; i++) {
        const mid = (lo + hi) / 2;
        if (sqrtLamBar(mid) > Math.SQRT1_2) lo = mid;
        else hi = mid;
      }
      if (!rel((lo + hi) / 2, X_STAR)) return false;
      for (const row of PAYOFF_TABLE) {
        const lam = lamBar(row.md);
        if (!rel(lam, row.lamBar)) return false;
        if (!rel(1 - lam, row.theta2)) return false;
        if (!rel(gFromLamBar(lam), row.g)) return false;
        if (!rel(gammaSL(row.g), row.gammaSL)) return false;
        if (!(row.gammaSL < GAMMA_OV)) return false;
      }
      const b23 = sqrtLamN(2, 3);
      if (!rel(b23 * b23, BOUND_LAM_N2_MD3)) return false;
      if (!rel(gammaSL(SML.constants.gRef), SML.constants.gammaSLRef)) return false;
      return rel(KAPPA, C_U / Math.sqrt(LW_EVEN));
    },
  },
  {
    id: "imp95211-drl-cauchy-inverse-closed-form",
    description:
      "LEMMA BI: the Cauchy closed form (G^(-1))_rr = 2 mu_r beta_r^2 matches direct numerical inversion of the half-line Gram at the dyadic ladder (1, 2, 4, 8) and the non-dyadic triple (1, 2.5, 7) to rel 1e-8",
    holds: () => {
      for (const mus of [
        [1, 2, 4, 8],
        [1, 2.5, 7],
      ]) {
        const Gi = invMatrix(cauchyGram(mus));
        for (let r = 0; r < mus.length; r++) {
          const closed = 2 * mus[r] * Math.pow(betaProduct(mus, r), 2);
          if (!(Math.abs(Gi[r][r] - closed) <= 1e-8 * closed)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95211-drl-biorth-coefficient-battery",
    description:
      "LEMMA BI coefficient bound: 5000 random lacunary configurations (n in 2..5, ratios >= 2, random signed coefficients) never violate |A_r| <= sqrt(2 mu_r) beta_r ||f||_{L2(0, inf)}",
    holds: () => {
      let seed = 246813579;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 5000; t++) {
        const n = 2 + Math.floor(rand() * 4);
        const mus = [Math.pow(10, -1 + 2 * rand())];
        for (let b = 1; b < n; b++) mus.push(mus[b - 1] * (2 + 1.5 * rand()));
        const A = mus.map(() => 2 * rand() - 1);
        const G = cauchyGram(mus);
        const nf2 = quadForm(G, A);
        if (!(nf2 > 0)) return false;
        const nf = Math.sqrt(nf2);
        for (let r = 0; r < n; r++) {
          const cap = Math.sqrt(2 * mus[r]) * betaProduct(mus, r) * nf;
          if (!(Math.abs(A[r]) <= cap * (1 + 1e-9))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95211-drl-shift-damping-battery",
    description:
      "THEOREM DR: 5000 random Rayleigh quotients (a^T DGD a)/(a^T G a) at random lacunary ladders and depths never exceed the finite-n closed-form bound; the TRUE lambda_max (power iteration) at (n, m d) = (2, 3), (4, 2), (6, 1), (8, 3) never exceeds the finite-n bound nor the n-uniform LamBar, and the recorded tightness pair at (2, 3) reproduces (rel 1e-6)",
    holds: () => {
      let seed = 135792468;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 5000; t++) {
        const n = 2 + Math.floor(rand() * 4);
        const mus = [Math.pow(10, -1 + 2 * rand())];
        for (let b = 1; b < n; b++) mus.push(mus[b - 1] * (2 + 1.5 * rand()));
        const d = (0.2 + 4 * rand()) / mus[0];
        const A = mus.map(() => 2 * rand() - 1);
        const num = quadForm(shiftedGram(mus, d), A);
        const den = quadForm(cauchyGram(mus), A);
        if (!(den > 0)) return false;
        const sb = sqrtLamN(n, mus[0] * d);
        if (!(num / den <= sb * sb * (1 + 1e-9))) return false;
      }
      for (const [n, md] of [
        [2, 3],
        [4, 2],
        [6, 1],
        [8, 3],
      ]) {
        const mus = [];
        for (let b = 0; b < n; b++) mus.push(Math.pow(2, b));
        const lam = trueLambdaMax(mus, md);
        const sb = sqrtLamN(n, md);
        if (!(lam <= sb * sb * (1 + 1e-9))) return false;
        if (!(lam <= lamBar(md) * (1 + 1e-9))) return false;
        if (n === 2 && md === 3) {
          if (!(Math.abs(lam - TRUE_LAM_N2_MD3) <= 1e-6 * TRUE_LAM_N2_MD3)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95211-drl-dictionary-witness-battery",
    description:
      "THEOREM HL end-to-end: 3000 random dyadic-dictionary witnesses (jittered shell ratios >= 2, up to 3 packets per shell at depths >= d, random signed coefficients), cross-seam fraction computed by EXACT closed-form integrals, never exceeds min(1, LamBar(m d)); the LEMMA R1 rank-one collapse identity holds pointwise on every draw",
    holds: () => {
      let seed = 864209753;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 3000; t++) {
        const n = 1 + Math.floor(rand() * 4);
        const mus = [Math.pow(10, -0.5 + rand())];
        for (let b = 1; b < n; b++) mus.push(mus[b - 1] * (2 + 1.5 * rand()));
        const d = (0.5 + 4.5 * rand()) / mus[0];
        const packets = [];
        for (let b = 0; b < n; b++) {
          const np = 1 + Math.floor(rand() * 3);
          for (let p = 0; p < np; p++) {
            packets.push({
              a: 2 * rand() - 1,
              mu: mus[b],
              c: -d - (2 * rand()) / mus[b],
            });
          }
        }
        let tot = 0;
        let right = 0;
        for (const pj of packets) {
          for (const pk of packets) {
            tot += pj.a * pk.a * kernelK(pj.mu, pk.mu, Math.abs(pj.c - pk.c));
            right +=
              (pj.a * pk.a * Math.exp(pj.mu * pj.c + pk.mu * pk.c)) / (pj.mu + pk.mu);
          }
        }
        if (!(tot > 0)) return false;
        const frac = right / tot;
        const cap = Math.min(1, lamBar(mus[0] * d));
        if (!(frac <= cap * (1 + 1e-9))) return false;
        const Ab = mus.map((mu) =>
          packets.reduce((s, p) => s + (p.mu === mu ? p.a * Math.exp(mu * p.c) : 0), 0),
        );
        for (const tv of [-d, -d + 0.3 / mus[0], 0, 1.7 / mus[0]]) {
          let w = 0;
          let scale = 0;
          for (const p of packets) {
            const term = p.a * Math.exp(-p.mu * Math.abs(tv - p.c));
            w += term;
            scale += Math.abs(term);
          }
          const s = mus.reduce((acc, mu, b) => acc + Ab[b] * Math.exp(-mu * tv), 0);
          if (!(Math.abs(w - s) <= 1e-9 * (scale + 1e-300))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95211-drl-ng-boundary-and-threshold",
    description:
      "NG-boundary consistency and threshold: the imp-95210 LEMMA NG 7-node witness rates (1.0..2.2) violate H-DYA (a consecutive ratio < 2 exists), LamBar is vacuous (> 1) at its depth m d = 0.3, LamBar is strictly decreasing across a grid, and LamBar crosses 1/2 exactly at xStar (above 1/2 at xStar - 0.01, below at xStar + 0.01)",
    holds: () => {
      const ngRates = [];
      for (let j = 0; j <= 6; j++) ngRates.push(1.0 + (1.2 * j) / 6);
      let violates = false;
      for (let j = 1; j < ngRates.length; j++) {
        if (ngRates[j] / ngRates[j - 1] < 2) violates = true;
      }
      if (!violates) return false;
      if (!(lamBar(0.3) > 1)) return false;
      let prev = Infinity;
      for (const x of [0.5, 1, 2, 2.651017799014494, 3, 4, 5, 7]) {
        const v = lamBar(x);
        if (!(v < prev)) return false;
        prev = v;
      }
      if (!(lamBar(X_STAR - 0.01) > 0.5)) return false;
      if (!(lamBar(X_STAR + 0.01) < 0.5)) return false;
      return Math.abs(lamBar(X_STAR) - 0.5) <= 1e-9;
    },
  },
  {
    id: "imp95211-drl-honesty-gate",
    description:
      "the verdict names H-DYA as un-instantiated for the paper packets, records the conditional collapse gammaOV -> gammaSL rows, the lossiness and one-sidedness of the bound, the surviving sub-gap imp-95211-subgap-paper-packet-dyadic-constants, and the untouched ledger; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95211_DYADIC_RATE_LOCALIZATION.promotesBound === false &&
      IMP95211_DYADIC_RATE_LOCALIZATION.openResiduals.length === 5 &&
      /NO QED/.test(IMP95211_DYADIC_RATE_LOCALIZATION.verdict) &&
      /refereed bound is changed/i.test(IMP95211_DYADIC_RATE_LOCALIZATION.verdict) &&
      /Floors and ceilings untouched/.test(IMP95211_DYADIC_RATE_LOCALIZATION.verdict) &&
      /not instantiated for the paper packets/.test(
        IMP95211_DYADIC_RATE_LOCALIZATION.verdict,
      ) &&
      /paper-packet-dyadic-constants/.test(IMP95211_DYADIC_RATE_LOCALIZATION.subGap) &&
      /NOT instantiated/.test(IMP95211_DYADIC_RATE_LOCALIZATION.hypothesisHDYA) &&
      /THIRD LEG DELIVERED/.test(IMP95211_DYADIC_RATE_LOCALIZATION.openResiduals[4]) &&
      /HONEST LIMIT/.test(IMP95211_DYADIC_RATE_LOCALIZATION.openResiduals[4]) &&
      /0\.3572/.test(IMP95211_DYADIC_RATE_LOCALIZATION.verdict) &&
      /PLUS the new named dictionary hypothesis H-DYA/.test(
        IMP95211_DYADIC_RATE_LOCALIZATION.rigorScope,
      ),
  },
];

for (const a of IMP95211_DRL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95211-dyadic-rate-localization assertion failed: ${a.id}`);
  }
}

export default IMP95211_DYADIC_RATE_LOCALIZATION;
