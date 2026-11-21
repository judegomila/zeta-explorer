/**
 * imp-95212 - RIGOROUS step -- THEOREM DR-M (multiplicity-priced dyadic
 * shift damping) + COROLLARY CP (closed-form coalescence price on the
 * H-LOC threshold) + THEOREM HL-M (H-LOC from the multi-rate-shell
 * dictionary hypothesis H-DYA-M): FOURTH leg of the seam chain. The
 * imp-95211 verdict recorded, as the explicitly named alternative branch
 * of its successor sub-gap imp-95211-subgap-paper-packet-dyadic-constants,
 * that finite per-shell rate multiplicity "can be priced by the same beta
 * products but degrade as the in-shell separation shrinks -- not developed
 * here". THIS MODULE DEVELOPS EXACTLY THAT BRANCH, in closed form: the
 * single-rate-per-shell hypothesis H-DYA is relaxed to AT MOST K distinct
 * rates per shell with in-shell pairwise ratio >= rho > 1, and the entire
 * imp-95211 pipeline (Cauchy biorthogonal bounds -> n-shell-uniform
 * cross-seam mass bound -> H-LOC -> gammaSL collapse) survives with every
 * constant explicit. The multiplicity price is ONE new factor and the
 * threshold moves by an explicit logarithm.
 *
 * SETTING (identical to imp-95172/95208/95209/95210/95211; model family
 * sigma = 1, theta = 10, s = 11; M = 1). Packets are two-sided
 * exponentials a e^(-mu|t-c|) in L2(R); seam at t = 0; even parity on the
 * left, odd on the right; collar depth d > 0. Carried constants come from
 * the sibling verdict objects (single source of truth): LwEven, q, cU,
 * kappa, gammaOV, and from imp-95211 the dictionary machinery (C_inf,
 * xStar, the K = 1 payoff table).
 *
 * HYPOTHESIS H-DYA-M(m, d, K, rho) -- multi-rate dyadic shells, per
 * parity: the parity sum is a finite combination (or L2 limit of such) of
 * packets a_j e^(-mu_j|t-c_j|) whose DISTINCT rates partition into ordered
 * shells S_1 < S_2 < ... < S_n (every rate of S_{b+1} exceeds every rate
 * of S_b) with (i) |S_b| <= K, (ii) in-shell pairwise ratios >= rho > 1,
 * (iii) min S_{b+1} >= 2 max S_b, (iv) min S_1 >= m, and whose centers all
 * sit at depth >= d on the parity's own side of the seam. K = 1 recovers
 * H-DYA of imp-95211 EXACTLY (condition (ii) is then empty). n and the
 * per-rate packet counts are arbitrary.
 *
 * STRUCTURAL FACTS REUSED VERBATIM (imp-95211). LEMMA R1 applies per
 * DISTINCT RATE: all packets sharing one rate mu with centers c_j <= -d
 * collapse, for every t >= -d, to (sum_j a_j e^(mu c_j)) e^(-mu t); so on
 * [-d, infinity) the parity sum lies in the span of the at-most-nK
 * distinct-rate exponentials. LEMMA BI applies to that distinct-rate list
 * unchanged: |A_r| <= sqrt(2 mu_r) beta_r ||f||_{L2(0,inf)} with
 * beta_r = prod_{k != r} (mu_r + mu_k)/|mu_r - mu_k|.
 *
 * THEOREM DR-M (multiplicity-priced shift damping, n-uniform). Let
 * A_in(K, rho) = ((rho + 1)/(rho - 1))^(K-1), and let c_j, P_j, C_inf be
 * the imp-95211 dyadic constants (c_j = (2^j + 1)/(2^j - 1), P_0 = 1,
 * P_j = c_1...c_j, C_inf = prod c_j = 8.255987935778247). Under
 * H-DYA-M(m, d, K, rho), with x = m d,
 *   integral_d^inf f^2 <= LamNM(n, x; K, rho) integral_0^inf f^2 ,
 *   sqrt(LamNM) = A_in K sum_{b=1}^n (P_{b-1} P_{n-b})^K e^(-2^(b-1) x) ,
 * and n-uniformly
 *   integral_d^inf f^2 <= LamBarM(x; K, rho) integral_0^inf f^2 ,
 *   sqrt(LamBarM) = A_in K C_inf^K sum_{b>=1} P_{b-1}^K e^(-2^(b-1) x)
 * (convergent for every x > 0: P_{b-1}^K <= C_inf^K is bounded and the
 * decay is doubly exponential). PROOF. Exactly the imp-95211 triangle
 * inequality + LEMMA BI route; only the beta_r estimate changes. Fix a
 * rate mu_r in shell S_b and split the beta_r factors: (in-shell) at most
 * K - 1 other rates, each with ratio q >= rho, and (q + 1)/(q - 1) is
 * decreasing in q, so each factor is <= (rho + 1)/(rho - 1), total
 * <= A_in(K, rho); (cross-shell) for a rate in S_{b + j} or S_{b - j},
 * induction on (iii) gives min S_{b+j} >= 2^j max S_b, hence ratio
 * >= 2^j and factor <= c_j, with at most K rates per shell, total
 * <= (P_{b-1} P_{n-b})^K. So beta_r <= A_in (P_{b-1} P_{n-b})^K. Damping:
 * (iii)-(iv) give mu_r >= min S_b >= 2^(b-1) m, so e^(-mu_r d) <=
 * e^(-2^(b-1) x). Summing the at most K rates of each shell yields
 * sqrt(LamNM); P_{n-b} <= C_inf yields the n-uniform form. QED. The
 * mechanism is unchanged: the shift acts diagonally, so the multi-shell,
 * multi-rate bound reduces to single-shell damping times explicit Cauchy
 * coupling constants -- multiplicity enters ONLY through the single
 * in-shell factor A_in and the K-th powers of the same partial products.
 *
 * THEOREM HL-M (H-LOC from H-DYA-M). LamBarM(.; K, rho) is strictly
 * decreasing with limits +inf at 0+ and 0 at +inf, so it crosses 1/2 at a
 * unique xStarM(K, rho). For m d > xStarM(K, rho), both parities localize
 * with thetaE^2 = thetaO^2 = 1 - LamBarM(m d) > 1/2, THEOREM SL applies
 * with g = 2 sqrt(LamBarM (1 - LamBarM)), and COROLLARY GC-SL instantiates
 * gammaSL(g). Proof identical to imp-95211 THEOREM HL with LamBar replaced
 * by LamBarM. QED.
 *
 * COROLLARY CP (coalescence price, closed form). For all K >= 1, rho > 1,
 *   xStarM(K, rho) <= xStar + ln K + (2K - 2) ln C_inf
 *                     + (K - 1) ln((rho + 1)/(rho - 1)) ,
 * with xStar = 2.651017799014494 the K = 1 threshold. PROOF. From
 * P_{b-1}^K <= C_inf^(K-1) P_{b-1}, sqrt(LamBarM)(x) <= A_in K
 * C_inf^(2K-2) sqrt(LamBar)(x); and every term of either series has
 * exponent 2^(b-1) >= 1, so sqrt(LamBarM)(x + delta) <= e^(-delta)
 * sqrt(LamBarM)(x) for delta >= 0. Take delta = ln(A_in K C_inf^(2K-2))
 * >= 0: then sqrt(LamBarM)(xStar + delta) <= e^(-delta) A_in K
 * C_inf^(2K-2) sqrt(LamBar)(xStar) = 1/sqrt(2), and monotonicity places
 * xStarM at or below xStar + delta. QED. CONSEQUENCE: the collar-depth
 * premium for in-shell multiplicity is LINEAR in K and LOGARITHMIC in the
 * coalescence 1/(rho - 1). As rho -> 1+ the price diverges -- exactly the
 * LEMMA NG boundary (imp-95210): a rate BAND (rho = 1, K = infinity) is
 * never covered, and this corollary quantifies the approach rate. The NG
 * 7-node witness rates (1.0..2.2, consecutive ratios < 1.5 and < 2)
 * violate H-DYA-M(., ., 2, 1.5) for EVERY ordered-shell partition: any
 * multi-rate shell breaks (ii), all-singleton shells break (iii).
 *
 * INSTANTIATED CONSTANTS (exact evaluations of the closed forms; the
 * assertions reproduce them to rel 1e-12):
 *   A_in(2, 1.5) = 5 exactly; thresholds
 *   xStarM(2, 1.5) = 6.8802447087280605  (CP cap  9.175480386950477)
 *   xStarM(2, 2)   = 6.375420548672336   (CP cap  8.664654763184487)
 *   xStarM(3, 2)   = 9.976480881386347   (CP cap 14.3906096549027)
 * PAYOFF TABLE at (K, rho) = (2, 1.5), collapse from gammaOV = 0.99959:
 *   m d =  8: LamBarM = 0.052599661638497656, g = 0.44646584296679726,
 *             gammaSL = 0.5996186917649009
 *   m d = 10: LamBarM = 0.0009583880567883045, g = 0.061886009699152845,
 *             gammaSL = 0.5019141900742449
 *   m d = 12: LamBarM = 0.00001754109347166377, g = 0.008376344257897616,
 *             gammaSL = 0.5000350679049952
 * TIGHTNESS RECORD (honesty row): at the canonical 2-shell config
 * (rates 1, 1.5, 3, 4.5; K = 2, rho = 1.5, m d = 8) the TRUE generalized
 * eigenvalue is 0.000025957586369211354 vs the finite-n bound
 * 0.000912146589601913 -- the bound is ~35x lossy here (ratio 0.0285); the
 * multiplicity premium is paid in full even when the true operator barely
 * feels it.
 *
 * HONEST LIMITS. (a) The paper Section 4.5 packet constants (m, d, shell
 * ratio, in-shell multiplicity K, in-shell separation rho) are STILL NOT
 * extracted, and the packets are Fresnel-Airy, not two-sided exponentials:
 * the envelope port remains open. This module closes the
 * multiplicity-pricing BRANCH of imp-95211-subgap-paper-packet-dyadic-
 * constants and NARROWS the successor to the extraction + envelope legs
 * (imp-95212-subgap-fresnel-airy-envelope-port). (b) The bound inherits
 * the triangle-inequality lossiness and adds the A_in K C_inf^K premium
 * (see the tightness record); whether the TRUE multi-rate-class sup
 * clears 1/2 below xStarM is open (one-sided bound). (c) For
 * m d <= xStarM(K, rho) nothing is delivered, and xStarM grows linearly
 * in K -- large in-shell multiplicity demands proportionally deep collars
 * under this route; sharpness of the linear-in-K growth is open.
 * (d) rho > 1 is load-bearing: at rho = 1 the price diverges and LEMMA NG
 * applies in the closure -- COROLLARY CP is the quantitative form of that
 * boundary, not a way around it. (e) Model-family constants (sigma = 1,
 * theta = 10) throughout; gammaSL remains a cap, not proved attained; the
 * measured class sup phi = 0.3572 (imp-95113) is untouched and sits below
 * every payoff row.
 *
 * SUB-GAP (surviving, explicitly named, NOT closed):
 *   imp-95212-subgap-fresnel-airy-envelope-port -- extract the explicit
 *   dictionary constants (m, d, shell ratio, K, rho) for the actual
 *   Permuting the Zeta Twin Ladder Section 4.5 packets and port the
 *   two-sided-exponential envelope model to the Fresnel-Airy envelope
 *   (or re-derive THEOREM DR-M for that envelope class); then check
 *   m d > xStarM(K, rho). Only that instantiation converts the
 *   conditional collapse gammaOV -> gammaSL into an unconditional
 *   model-chain statement.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) The K = 1 reduction stress-tested: LamBarM
 * and xStarM at K = 1 must reproduce the imp-95211 LamBar payoff rows and
 * xStar EXACTLY (asserted to rel 1e-12) -- any deviation would mean the
 * generalization changed the base case. (2) THEOREM DR-M approached by a
 * 4000-draw Rayleigh battery over random H-DYA-M configurations (1..3
 * shells, up to K rates per shell at in-shell ratios >= rho, shell jumps
 * >= 2, random depths and signed coefficients): no violation (a 20000-draw
 * offline run of the same battery: no violation, worst ratio to the bound
 * 0.171). (3) THEOREM HL-M approached end-to-end by a 2500-draw witness
 * battery (multiple packets per rate, exact closed-form integrals): the
 * cross-seam fraction never exceeds min(1, LamBarM), and the per-rate
 * LEMMA R1 collapse identity holds pointwise on every draw. (4) COROLLARY
 * CP approached on a (K, rho) grid: the bisected xStarM never exceeds the
 * closed-form cap, and at K = 1 the cap is EXACT (delta = 0). (5) The NG
 * boundary checked: A_in(2, 1 + 1e-6) > 1e6 (the price diverges), the NG
 * witness rates violate H-DYA-M(., ., 2, 1.5) under every ordered-shell
 * partition, and LamBarM(3; 2, 1.5) > 1 (vacuous where K = 1 delivered
 * 0.2234 -- the premium is real, kept as an honesty row). (6) The gammaSL
 * instantiation chain is cross-checked against the imp-95210 baked pair
 * (gRef -> gammaSLRef) to rel 1e-12 (transcription guard).
 *
 * The numerics below CROSS-CHECK the theorem statements; they are not the
 * claim. Import-light (no heavy bundle; imports only the five sibling
 * verdict modules for carried constants). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

import BNT from "./imp-95172-ballast-necessity-tradeoff.js";
import MBU from "./imp-95208-mb-uniform-ballast-cap.js";
import OVC from "./imp-95209-overlap-currency-cap.js";
import SML from "./imp-95210-seam-mass-localization-cap.js";
import DRL from "./imp-95211-dyadic-rate-localization.js";

// ── carried constants (single source of truth: sibling verdict objects) ─────
const LW_EVEN = BNT.constants.lwEven; // 3.9197935113802585e-5
const Q_OD = BNT.constants.q; // 0.03755392855053636
const C_U = MBU.constants.cU; // 0.30501330232499435
const KAPPA = OVC.constants.kappa; // 48.717745853978386
const GAMMA_OV = OVC.constants.gammaOV; // 0.9995949885454457
const C_INF = DRL.constants.cInf; // 8.255987935778247
const X_STAR = DRL.constants.xStar; // 2.651017799014494

// ── new baked literals (recomputed by the assertions) ────────────────────────
const A_IN_2_R15 = 5; // ((1.5+1)/(1.5-1))^1, exact
const X_STAR_M_TABLE = [
  { K: 2, rho: 1.5, xStarM: 6.8802447087280605, cpCap: 9.175480386950477 },
  { K: 2, rho: 2, xStarM: 6.375420548672336, cpCap: 8.664654763184487 },
  { K: 3, rho: 2, xStarM: 9.976480881386347, cpCap: 14.3906096549027 },
];
const TRUE_LAM_MD8 = 0.000025957586369211354; // rates (1,1.5,3,4.5), d = 8
const BOUND_LAM_MD8 = 0.000912146589601913; // LamNM(2, 8; 2, 1.5)
const PAYOFF_TABLE_M = [
  {
    md: 8,
    lamBarM: 0.052599661638497656,
    theta2: 0.9474003383615024,
    g: 0.44646584296679726,
    gammaSL: 0.5996186917649009,
  },
  {
    md: 10,
    lamBarM: 0.0009583880567883045,
    theta2: 0.9990416119432117,
    g: 0.061886009699152845,
    gammaSL: 0.5019141900742449,
  },
  {
    md: 12,
    lamBarM: 0.00001754109347166377,
    theta2: 0.9999824589065284,
    g: 0.008376344257897616,
    gammaSL: 0.5000350679049952,
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
const P_PARTIAL = [1];
for (let k = 1; k <= KMAX; k++) {
  P_PARTIAL.push((P_PARTIAL[k - 1] * (Math.pow(2, k) + 1)) / (Math.pow(2, k) - 1));
}
function aIn(K, rho) {
  return Math.pow((rho + 1) / (rho - 1), K - 1);
}
function sqrtLamNM(n, x, K, rho) {
  let s = 0;
  for (let b = 1; b <= n; b++) {
    const e = Math.pow(2, b - 1) * x;
    if (e > 745) break;
    s += Math.pow(P_PARTIAL[b - 1] * P_PARTIAL[n - b], K) * Math.exp(-e);
  }
  return aIn(K, rho) * K * s;
}
function sqrtLamBarM(x, K, rho) {
  let s = 0;
  for (let b = 1; b <= KMAX; b++) {
    const e = Math.pow(2, b - 1) * x;
    if (e > 745) break;
    s += Math.pow(P_PARTIAL[b - 1], K) * Math.exp(-e);
  }
  return aIn(K, rho) * K * Math.pow(C_INF, K) * s;
}
function lamBarM(x, K, rho) {
  const s = sqrtLamBarM(x, K, rho);
  return s * s;
}
function xStarM(K, rho) {
  let lo = 0.01;
  let hi = 60;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (sqrtLamBarM(mid, K, rho) > Math.SQRT1_2) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
function cpCap(K, rho) {
  return (
    X_STAR +
    Math.log(K) +
    (2 * K - 2) * Math.log(C_INF) +
    (K - 1) * Math.log((rho + 1) / (rho - 1))
  );
}
function gFromLam(lam) {
  return 2 * Math.sqrt(lam * (1 - lam));
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
  const y = matVec(A, x);
  return x.reduce((s, xi, i) => s + xi * y[i], 0);
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
  for (let it = 0; it < 600; it++) {
    const y = matVec(Gi, matVec(H, x));
    const nrm = Math.sqrt(y.reduce((s, v) => s + v * v, 0));
    if (nrm === 0) break;
    x = y.map((v) => v / nrm);
  }
  return quadForm(H, x) / quadForm(G, x);
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95212_MULTIPLICITY_PRICED_DAMPING = {
  ticket:
    "imp-95212 (fourth leg of the seam chain, developing the explicitly recorded multiplicity-pricing branch of imp-95211-subgap-paper-packet-dyadic-constants: the single-rate-per-shell hypothesis H-DYA relaxes to at most K distinct rates per shell at in-shell pairwise ratio >= rho > 1, and the whole Cauchy-biorthogonal pipeline survives with the multiplicity priced by the single explicit factor A_in = ((rho+1)/(rho-1))^(K-1) and K-th powers of the same dyadic partial products)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes LEMMA R1 / LEMMA BI / THEOREM DR machinery and the C_inf, xStar constants (imp-95211), THEOREM SL / COROLLARY GC-SL and the H-LOC frame (imp-95210), THEOREM OV constants (imp-95209), THEOREM BU (imp-95208), the OD class caps (imp-95129 via imp-95172); carried constants imported from the five sibling verdict objects.",
  hypothesisHDYAM:
    "H-DYA-M(m, d, K, rho), per parity: the distinct rates partition into ordered shells S_1 < ... < S_n with |S_b| <= K, in-shell pairwise ratios >= rho > 1, min S_{b+1} >= 2 max S_b, min S_1 >= m, and every center at depth >= d on the parity's own side of the seam. K = 1 recovers H-DYA exactly. Model-level formalization; NOT instantiated for the paper packets (named successor sub-gap).",
  theoremDRM:
    "Multiplicity-priced shift damping, n-uniform: under H-DYA-M, integral_d^inf f^2 <= LamNM(n, m d; K, rho) integral_0^inf f^2 with sqrt(LamNM) = A_in K sum_{b=1}^n (P_{b-1} P_{n-b})^K e^(-2^(b-1) x), and n-uniformly sqrt(LamBarM(x; K, rho)) = A_in K C_inf^K sum_{b>=1} P_{b-1}^K e^(-2^(b-1) x), A_in = ((rho+1)/(rho-1))^(K-1). Mechanism unchanged from THEOREM DR: the shift acts diagonally, so the multi-rate multi-shell bound reduces to single-shell damping times explicit Cauchy coupling constants; in-shell multiplicity enters only through A_in and the K-th powers.",
  corollaryCP:
    "Coalescence price, closed form: xStarM(K, rho) <= xStar + ln K + (2K-2) ln C_inf + (K-1) ln((rho+1)/(rho-1)) -- the collar-depth premium is linear in K and logarithmic in 1/(rho-1), exact at K = 1 (delta = 0), divergent as rho -> 1+ (the quantitative form of the LEMMA NG boundary: rate bands are never covered).",
  theoremHLM:
    "H-LOC from H-DYA-M: for m d > xStarM(K, rho) (unique root of LamBarM = 1/2), both parities localize with thetaE^2 = thetaO^2 = 1 - LamBarM(m d) > 1/2, THEOREM SL applies with g = 2 sqrt(LamBarM(1 - LamBarM)), and COROLLARY GC-SL instantiates gammaSL(g). Payoff rows at (K, rho) = (2, 1.5), m d = 8/10/12: gammaSL = 0.5996186917649009 / 0.5019141900742449 / 0.5000350679049952, versus gammaOV = 0.9995949885454457 without the dictionary input.",
  constants: {
    aIn2R15: A_IN_2_R15,
    xStarMTable: X_STAR_M_TABLE,
    trueLamMd8: TRUE_LAM_MD8,
    boundLamMd8: BOUND_LAM_MD8,
    payoffTableM: PAYOFF_TABLE_M,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- OPEN: extract the explicit dictionary constants (slowest shell rate m, collar depth d, shell ratio, in-shell multiplicity K, in-shell separation rho) for the actual paper Section 4.5 packets and port the two-sided-exponential envelope model to the Fresnel-Airy envelope (or re-derive THEOREM DR-M for that envelope class); then check m d > xStarM(K, rho). The multiplicity-pricing branch of imp-95211-subgap-paper-packet-dyadic-constants is delivered by this module; the extraction and envelope legs remain. Also recorded, open: whether the TRUE multi-rate-class sup clears 1/2 below xStarM (one-sided bound), and whether the linear-in-K threshold growth is sharp.",
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "MULTIPLICITY BRANCH DELIVERED: the imp-95211 alternative branch (price finite per-shell rate multiplicity via the same beta products) is developed in closed form -- H-DYA-M with at most K rates per shell at in-shell ratio >= rho > 1 gives sqrt(LamBarM) = A_in K C_inf^K sum P_{b-1}^K e^(-2^(b-1) x), H-LOC follows for m d > xStarM(K, rho), and COROLLARY CP prices the coalescence: threshold premium <= ln K + (2K-2) ln C_inf + (K-1) ln((rho+1)/(rho-1)), exact at K = 1, log-divergent as rho -> 1 (the LEMMA NG boundary quantified). HONEST LIMIT: the paper-packet constants are STILL NOT extracted and the Fresnel-Airy envelope port is open (successor sub-gap imp-95212-subgap-fresnel-airy-envelope-port); the bound adds an A_in K C_inf^K premium on top of the triangle-inequality lossiness (true 2.60e-5 vs bound 9.12e-4 at the canonical m d = 8 config); below xStarM nothing is delivered; measured class sup phi = 0.3572 unchanged",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM DR-M and COROLLARY CP are unconditional closed-form statements about multi-rate lacunary exponential sums on the half-line (the imp-95211 LEMMA BI coefficient bounds plus the split of the Cauchy beta factors into an in-shell part, capped by monotonicity of (q+1)/(q-1) at q >= rho, and a cross-shell part, capped by the same dyadic partial products; the CP shift argument uses only exponent >= 1 termwise). THEOREM HL-M is conditional exactly as THEOREM SL / COROLLARY GC-SL (the carried imp-95172/95208/95209/95210 chain) PLUS the new named dictionary hypothesis H-DYA-M replacing H-DYA -- strictly weaker structural input than imp-95211 (K = 1 is a special case), priced by strictly larger constants. H-DYA-M itself is NOT instantiated for the paper packets and every conditional statement names it. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step: the multiplicity-pricing branch recorded open by imp-95211 is developed in closed form. THEOREM DR-M: under H-DYA-M (at most K distinct rates per shell, in-shell pairwise ratio >= rho > 1, lacunary shells), the n-shell-uniform cross-seam bound survives as sqrt(LamBarM(x; K, rho)) = A_in K C_inf^K sum P_{b-1}^K e^(-2^(b-1) x) with the single new factor A_in = ((rho+1)/(rho-1))^(K-1) -- multi-rate shells reduce to the same single-shell damping times explicit Cauchy coupling constants. THEOREM HL-M: H-LOC follows for m d > xStarM(K, rho), instantiating gammaSL = 0.5996186917649009 / 0.5019141900742449 / 0.5000350679049952 at (K, rho) = (2, 1.5), m d = 8/10/12 (thresholds xStarM = 6.8802447087280605 / 6.375420548672336 / 9.976480881386347 at (2,1.5)/(2,2)/(3,2)). COROLLARY CP: xStarM <= xStar + ln K + (2K-2) ln C_inf + (K-1) ln((rho+1)/(rho-1)) -- the coalescence price is logarithmic in 1/(rho-1) and linear in K, exact at K = 1, divergent as rho -> 1: the LEMMA NG no-go is now a quantitative boundary, not just a refutation. HONEST: H-DYA-M is not instantiated for the paper packets (constants NOT extracted; Fresnel-Airy envelope port open = successor sub-gap imp-95212-subgap-fresnel-airy-envelope-port); the bound pays the A_in K C_inf^K premium on top of triangle-inequality lossiness (true 2.60e-5 vs bound 9.12e-4 at the canonical config, ratio 0.0285) and is one-sided; the linear-in-K growth may not be sharp; model-family constants; gammaSL is a cap, not proved attained; measured class sup phi = 0.3572 untouched. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95212_MPD_ASSERTIONS = [
  {
    id: "imp95212-mpd-k1-reduction-exact",
    description:
      "the K = 1 base case reproduces imp-95211 exactly (rel 1e-12): LamBarM(md; 1, rho) matches every sibling payoff row for arbitrary rho, the bisected xStarM(1, rho) matches xStar, the local partial products reproduce cInf, and the gammaSL chain reproduces the imp-95210 baked pair and the kappa identity",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      if (!rel(P_PARTIAL[KMAX], C_INF)) return false;
      for (const row of DRL.constants.payoffTable) {
        if (!rel(lamBarM(row.md, 1, 3), row.lamBar)) return false;
        if (!rel(lamBarM(row.md, 1, 1.0001), row.lamBar)) return false;
        if (!rel(gammaSL(row.g), row.gammaSL)) return false;
      }
      if (!rel(xStarM(1, 2), X_STAR)) return false;
      if (!rel(gammaSL(SML.constants.gRef), SML.constants.gammaSLRef)) return false;
      return rel(KAPPA, C_U / Math.sqrt(LW_EVEN));
    },
  },
  {
    id: "imp95212-mpd-constants-closed-form",
    description:
      "baked literals reproduce from the defining formulas (rel 1e-12): A_in(2, 1.5) = 5 exactly, the three xStarM thresholds by bisection, the three CP caps from the closed form, the (2, 1.5) payoff rows (LamBarM, theta^2, g, gammaSL, each gammaSL < gammaOV), the finite-n bound literal at the canonical config, and the true-lambda tightness record by power iteration (rel 1e-6, strictly below the bound)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= (t || 1e-12) * Math.abs(lit);
      if (aIn(2, 1.5) !== A_IN_2_R15) return false;
      for (const row of X_STAR_M_TABLE) {
        if (!rel(xStarM(row.K, row.rho), row.xStarM)) return false;
        if (!rel(cpCap(row.K, row.rho), row.cpCap)) return false;
        if (!(row.xStarM <= row.cpCap)) return false;
      }
      for (const row of PAYOFF_TABLE_M) {
        const lam = lamBarM(row.md, 2, 1.5);
        if (!rel(lam, row.lamBarM)) return false;
        if (!rel(1 - lam, row.theta2)) return false;
        if (!rel(gFromLam(lam), row.g)) return false;
        if (!rel(gammaSL(row.g), row.gammaSL)) return false;
        if (!(row.gammaSL < GAMMA_OV)) return false;
      }
      const b = sqrtLamNM(2, 8, 2, 1.5);
      if (!rel(b * b, BOUND_LAM_MD8)) return false;
      const tl = trueLambdaMax([1, 1.5, 3, 4.5], 8);
      if (!rel(tl, TRUE_LAM_MD8, 1e-6)) return false;
      return tl < BOUND_LAM_MD8;
    },
  },
  {
    id: "imp95212-mpd-corollary-cp-grid",
    description:
      "COROLLARY CP on a (K, rho) grid: the bisected xStarM(K, rho) never exceeds the closed-form cap xStar + ln K + (2K-2) ln C_inf + (K-1) ln((rho+1)/(rho-1)); at K = 1 the cap equals xStar and the threshold matches it to 1e-9; xStarM is decreasing in rho at fixed K and increasing in K at fixed rho",
    holds: () => {
      for (const K of [1, 2, 3, 4]) {
        for (const rho of [1.2, 1.5, 2, 4]) {
          const xm = xStarM(K, rho);
          if (!(xm <= cpCap(K, rho) + 1e-9)) return false;
          if (K === 1) {
            if (!(Math.abs(cpCap(1, rho) - X_STAR) <= 1e-12)) return false;
            if (!(Math.abs(xm - X_STAR) <= 1e-9)) return false;
          }
        }
      }
      let prev = Infinity;
      for (const rho of [1.2, 1.5, 2, 4]) {
        const xm = xStarM(2, rho);
        if (!(xm < prev)) return false;
        prev = xm;
      }
      prev = -Infinity;
      for (const K of [1, 2, 3, 4]) {
        const xm = xStarM(K, 2);
        if (!(xm > prev)) return false;
        prev = xm;
      }
      return true;
    },
  },
  {
    id: "imp95212-mpd-rayleigh-battery",
    description:
      "THEOREM DR-M: 4000 random Rayleigh quotients (a^T DGD a)/(a^T G a) over random H-DYA-M configurations (1..3 shells, up to K rates per shell at in-shell ratios >= rho, shell jumps >= 2x the shell max, random depths and signed coefficients; alternating (K, rho) = (2, 1.5) and (3, 1.5)) never exceed the finite-n closed-form bound; every drawn configuration is verified to satisfy H-DYA-M before use",
    holds: () => {
      let seed = 97531;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 4000; t++) {
        const K = t % 2 === 0 ? 2 : 3;
        const RHO = 1.5;
        const n = 1 + Math.floor(rand() * 3);
        const mus = [];
        const shellIdx = [];
        let base = Math.pow(10, -1 + 2 * rand());
        for (let b = 0; b < n; b++) {
          const kb = 1 + Math.floor(rand() * K);
          let mu = base;
          for (let i = 0; i < kb; i++) {
            mus.push(mu);
            shellIdx.push(b);
            if (i < kb - 1) mu *= RHO * (1 + 0.3 * rand());
          }
          base = mu * (2 + rand());
        }
        for (let i = 1; i < mus.length; i++) {
          if (shellIdx[i] === shellIdx[i - 1]) {
            if (!(mus[i] / mus[i - 1] >= RHO)) return false;
          } else if (!(mus[i] / mus[i - 1] >= 2)) return false;
        }
        const m0 = mus[0];
        const d = (0.3 + 6 * rand()) / m0;
        const A = mus.map(() => 2 * rand() - 1);
        const num = quadForm(shiftedGram(mus, d), A);
        const den = quadForm(cauchyGram(mus), A);
        if (!(den > 0)) return false;
        const sb = sqrtLamNM(n, m0 * d, K, RHO);
        if (!(num / den <= sb * sb * (1 + 1e-9))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95212-mpd-witness-battery",
    description:
      "THEOREM HL-M end-to-end: 2500 random H-DYA-M dictionary witnesses at (K, rho) = (2, 1.5) (up to 3 shells, up to 2 rates per shell, up to 2 packets per rate at depths >= d, random signed coefficients), cross-seam fraction computed by EXACT closed-form integrals, never exceeds min(1, LamBarM(m d; 2, 1.5)); the per-rate LEMMA R1 collapse identity holds pointwise on every draw",
    holds: () => {
      let seed = 8642097;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 2500; t++) {
        const n = 1 + Math.floor(rand() * 3);
        const mus = [];
        let base = Math.pow(10, -0.5 + rand());
        for (let b = 0; b < n; b++) {
          const kb = 1 + Math.floor(rand() * 2);
          let mu = base;
          for (let i = 0; i < kb; i++) {
            mus.push(mu);
            if (i < kb - 1) mu *= 1.5 * (1 + 0.3 * rand());
          }
          base = mu * (2 + rand());
        }
        const m0 = mus[0];
        const d = (0.5 + 13.5 * rand()) / m0;
        const packets = [];
        for (const mu of mus) {
          const np = 1 + Math.floor(rand() * 2);
          for (let p = 0; p < np; p++) {
            packets.push({
              a: 2 * rand() - 1,
              mu,
              c: -d - (2 * rand()) / mu,
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
        const cap = Math.min(1, lamBarM(m0 * d, 2, 1.5));
        if (!(right / tot <= cap * (1 + 1e-9))) return false;
        const Ab = mus.map((mu) =>
          packets.reduce((s, p) => s + (p.mu === mu ? p.a * Math.exp(mu * p.c) : 0), 0),
        );
        for (const tv of [-d, -d + 0.3 / m0, 0, 1.7 / m0]) {
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
    id: "imp95212-mpd-ng-boundary-and-threshold",
    description:
      "NG-boundary and threshold structure: A_in(2, 1 + 1e-6) > 1e6 (the coalescence price diverges as rho -> 1) and cpCap diverges accordingly; the NG 7-node witness rates violate H-DYA-M(., ., 2, 1.5) under every ordered-shell partition (all consecutive ratios < 1.5 eliminate multi-rate shells, all < 2 eliminate singleton chains); LamBarM(.; 2, 1.5) is strictly decreasing, crosses 1/2 exactly at the baked threshold (above at -0.01, below at +0.01), and is vacuous (> 1) at m d = 3 where the K = 1 theorem delivered 0.2234",
    holds: () => {
      if (!(aIn(2, 1 + 1e-6) > 1e6)) return false;
      if (!(cpCap(2, 1 + 1e-6) > cpCap(2, 2) + 10)) return false;
      const ngRates = [];
      for (let j = 0; j <= 6; j++) ngRates.push(1.0 + (1.2 * j) / 6);
      for (let j = 1; j < ngRates.length; j++) {
        const r = ngRates[j] / ngRates[j - 1];
        if (!(r < 1.5 && r < 2)) return false;
      }
      let prev = Infinity;
      for (const x of [1, 3, 5, 6.8802447087280605, 8, 10, 14]) {
        const v = lamBarM(x, 2, 1.5);
        if (!(v < prev)) return false;
        prev = v;
      }
      const xm = X_STAR_M_TABLE[0].xStarM;
      if (!(lamBarM(xm - 0.01, 2, 1.5) > 0.5)) return false;
      if (!(lamBarM(xm + 0.01, 2, 1.5) < 0.5)) return false;
      if (!(Math.abs(lamBarM(xm, 2, 1.5) - 0.5) <= 1e-9)) return false;
      return lamBarM(3, 2, 1.5) > 1;
    },
  },
  {
    id: "imp95212-mpd-honesty-gate",
    description:
      "the verdict names H-DYA-M as un-instantiated for the paper packets, records the delivered multiplicity branch, the A_in K C_inf^K premium and tightness record, the narrowed successor sub-gap imp-95212-subgap-fresnel-airy-envelope-port, and the untouched ledger; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95212_MULTIPLICITY_PRICED_DAMPING.promotesBound === false &&
      IMP95212_MULTIPLICITY_PRICED_DAMPING.openResiduals.length === 5 &&
      /NO QED/.test(IMP95212_MULTIPLICITY_PRICED_DAMPING.verdict) &&
      /refereed bound is changed/i.test(IMP95212_MULTIPLICITY_PRICED_DAMPING.verdict) &&
      /Floors and ceilings untouched/.test(
        IMP95212_MULTIPLICITY_PRICED_DAMPING.verdict,
      ) &&
      /not instantiated for the paper packets/.test(
        IMP95212_MULTIPLICITY_PRICED_DAMPING.verdict,
      ) &&
      /fresnel-airy-envelope-port/.test(IMP95212_MULTIPLICITY_PRICED_DAMPING.subGap) &&
      /NOT instantiated/.test(IMP95212_MULTIPLICITY_PRICED_DAMPING.hypothesisHDYAM) &&
      /MULTIPLICITY BRANCH DELIVERED/.test(
        IMP95212_MULTIPLICITY_PRICED_DAMPING.openResiduals[4],
      ) &&
      /HONEST LIMIT/.test(IMP95212_MULTIPLICITY_PRICED_DAMPING.openResiduals[4]) &&
      /0\.3572/.test(IMP95212_MULTIPLICITY_PRICED_DAMPING.verdict) &&
      /PLUS the new named dictionary hypothesis H-DYA-M/.test(
        IMP95212_MULTIPLICITY_PRICED_DAMPING.rigorScope,
      ),
  },
];

for (const a of IMP95212_MPD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95212-multiplicity-priced-shift-damping assertion failed: ${a.id}`);
  }
}

export default IMP95212_MULTIPLICITY_PRICED_DAMPING;
