/**
 * imp-95213 - RIGOROUS step -- THEOREM DR-R (geometric-chain refined
 * multiplicity pricing) + THEOREM KU (K-uniform threshold) + COROLLARY
 * CP-NS (the linear-in-K coalescence price of COROLLARY CP is NOT sharp):
 * FIFTH leg of the seam chain. imp-95212 recorded as honest limit (c) an
 * explicitly open question: "xStarM grows linearly in K -- large in-shell
 * multiplicity demands proportionally deep collars under this route;
 * sharpness of the linear-in-K growth is open". THIS MODULE SETTLES THAT
 * QUESTION: the linear growth is an artifact of the DR-M capping, not of
 * multiplicity. Under the SAME hypothesis H-DYA-M(m, d, K, rho), the
 * route threshold is BOUNDED IN K at every fixed rho > 1.
 *
 * SETTING (identical to imp-95172/95208/95209/95210/95211/95212; model
 * family sigma = 1, theta = 10, s = 11; M = 1). Packets are two-sided
 * exponentials a e^(-mu|t-c|) in L2(R); seam at t = 0; collar depth d;
 * x = m d. Carried constants come from the sibling verdict objects.
 *
 * THE ONE OBSERVATION. THEOREM DR-M used hypothesis (ii) of H-DYA-M
 * (in-shell pairwise ratios >= rho) only at exponent 1: every in-shell
 * Cauchy factor was capped by (rho+1)/(rho-1) and every cross-shell
 * factor by c_j = (2^j+1)/(2^j-1). But (ii) forces the ORDERED in-shell
 * rates nu_0 < nu_1 < ... < nu_{k-1} into a geometric chain:
 * consecutive ratios >= rho multiply, so nu_{i2}/nu_{i1} >= rho^(i2-i1).
 * With c(q) = (q+1)/(q-1) strictly decreasing, every pairwise factor
 * sharpens from c(rho) to c(rho^(distance)), every cross-shell factor
 * from c(2^j) to c(2^j rho^i), and every damping term from
 * e^(-2^(b-1) x) to e^(-2^(b-1) rho^i x). All three refined products
 * CONVERGE as K -> infinity, because sum_l ln c(rho^l) < infinity for
 * every rho > 1 (ln c(q) <= 2/(q-1) and rho^l grows geometrically).
 *
 * REFINED CONSTANTS. c(q) = (q+1)/(q-1);
 *   S_i(K, rho) = prod_{l=1}^{i} c(rho^l) * prod_{l=1}^{K-1-i} c(rho^l)
 *     (in-shell position product; S_i <= A_in = c(rho)^(K-1) termwise,
 *      and S_i <= A*(rho)^2 with A*(rho) = prod_{l>=1} c(rho^l) < inf);
 *   D_j(K, rho) = prod_{i=0}^{K-1} c(2^j rho^i)  (<= c_j^K, and
 *      convergent at K = infinity: ln D_j <= 4 rho/((rho-1) 2^j));
 *   R_m(K, rho) = prod_{j=1}^{m} D_j;  Cstar_K(rho) = prod_{j>=1} D_j
 *     (Cstar_K <= C_inf^K; Cstar_inf(rho) < infinity).
 * EXACT IDENTITY: A*(2) = C_inf = 8.255987935778247 -- the in-shell
 * geometric-chain constant at ratio 2 IS the dyadic cross-shell constant
 * (the two products coincide factor by factor).
 *
 * THEOREM DR-R (refined multiplicity-priced shift damping, n-uniform).
 * Under H-DYA-M(m, d, K, rho), with x = m d,
 *   integral_d^inf f^2 <= LamRefN(n, x; K, rho) integral_0^inf f^2 ,
 *   sqrt(LamRefN) = sum_{b=1}^n R_{b-1} R_{n-b}
 *                     sum_{i=0}^{K-1} S_i e^(-2^(b-1) rho^i x) ,
 * and n-uniformly sqrt(LamRefBar(x; K, rho)) =
 *   Cstar_K sum_{b>=1} R_{b-1} sum_{i=0}^{K-1} S_i e^(-2^(b-1) rho^i x).
 * PROOF. Exactly the imp-95211/95212 route (LEMMA R1 collapse per
 * distinct rate + LEMMA BI Cauchy biorthogonal bounds + triangle
 * inequality); only the beta_r estimate and the damping exponent change.
 * Fix the rate at in-shell position i of shell S_b. (In-shell) the
 * partner at position i2 has ratio >= rho^|i2-i| by the consecutive-ratio
 * chain, so the product of in-shell factors is <= S_i(K, rho).
 * (Cross-shell) for shell distance j, induction on H-DYA-M(iii) gives
 * min S_{b+j} >= 2^j max S_b >= 2^j mu_r, and the ordered partner chain
 * inside S_{b+j} gives the partner at position i2 ratio >= 2^j rho^(i2),
 * so the shell contributes <= D_j; below-shells are symmetric (partner at
 * position i2 from the TOP of S_{b-j} is <= rho^(-i2) 2^(-j) mu_r), so
 * the total cross-shell product is <= R_{b-1} R_{n-b}. (Damping)
 * mu >= rho^i min S_b >= 2^(b-1) rho^i m, so e^(-mu d) <=
 * e^(-2^(b-1) rho^i x). Summing positions and shells gives sqrt(LamRefN);
 * R_{n-b} <= Cstar_K gives the n-uniform form. QED. TERMWISE
 * sqrt(LamRefBar) <= sqrt(LamBarM) (S_i <= A_in, D_j <= c_j^K, refined
 * damping <= flat damping), STRICT for K >= 2, and the K = 1 case
 * reduces to imp-95211 THEOREM DR EXACTLY (S_0 = 1, D_j = c_j).
 *
 * THEOREM KU (K-uniform threshold). LamRefBar(x; K, rho) is increasing
 * in K and converges as K -> infinity for every x > 0 (S_i <= A*(rho)^2,
 * D_j and Cstar convergent, and the position-damping sum
 * sum_{i>=0} e^(-2^(b-1) rho^i x) converges for rho > 1). The limit
 * series is continuous, strictly decreasing in x, +inf at 0+, 0 at +inf,
 * so it crosses 1/2 at a unique xStarInf(rho), and for EVERY K >= 1
 *   xStarRef(K, rho) <= xStarInf(rho) < infinity .
 * Hence H-LOC (and the THEOREM SL collapse gammaOV -> gammaSL) holds
 * under H-DYA-M(m, d, K, rho) whenever m d > xStarInf(rho), UNIFORMLY IN
 * K. Proof: termwise monotonicity in K plus the same monotone-root
 * argument as THEOREM HL-M. QED.
 *
 * COROLLARY CP-NS (COROLLARY CP is not sharp). The DR-M threshold
 * xStarM(K, rho) and its CP cap grow linearly in K (e.g. at rho = 1.5:
 * xStarM = 6.88 / 11.00 / 15.00 / 38.24 at K = 2/3/4/10), while
 * xStarRef(K, 1.5) <= xStarInf(1.5) = 10.89000440771252 for ALL K. From
 * K = 3 on, the K-uniform refined threshold undercuts BOTH the DR-M
 * threshold and its CP cap. So the linear-in-K coalescence price of
 * COROLLARY CP is an artifact of the (A_in, C_inf^K) capping; the TRUE
 * price of in-shell multiplicity under this route is bounded in K, and
 * the only genuine divergence is coalescence rho -> 1+ (A*(rho) -> inf;
 * the LEMMA NG boundary is intact and untouched). QED (by exhibition of
 * the refined bound plus the threshold comparison below).
 *
 * INSTANTIATED CONSTANTS (exact evaluations; assertions reproduce them):
 *   A*(1.5) = 78.9241705724922; A*(2) = C_inf (identity);
 *   Cstar_inf(1.5) = 470.19547013421004; Cstar_inf(2) = 61.86651213770985;
 *   refined thresholds (vs imp-95212 xStarM):
 *     xStarRef(2, 1.5) = 5.514443274039953   (xStarM 6.8802447087280605)
 *     xStarRef(2, 2)   = 4.6255892238020575  (xStarM 6.375420548672336)
 *     xStarRef(3, 2)   = 5.610446348420641   (xStarM 9.976480881386347)
 *   K-uniform thresholds: xStarInf(1.5) = 10.89000440771252,
 *     xStarInf(2) = 6.597722130935779 (crude closed cap via A*^2:
 *     xStarU(1.5) = 15.23719380714591, xStarU(2) = 8.694978598076094);
 *   xStarRef(K, 1.5) saturates: 10.683 / 10.886 / 10.890 at K = 10/20/40.
 * PAYOFF TABLE at (K, rho) = (2, 1.5) (vs the imp-95212 rows):
 *   m d =  8: LamRefBar = 0.003051244971567392  (DR-M 0.0525996616...),
 *             g = 0.11030747709363815, gammaSL = 0.506081468712321
 *             (DR-M gammaSL 0.5996186917649009)
 *   m d = 10: LamRefBar = 0.000054436035353634766,
 *             g = 0.014755754412660811, gammaSL = 0.5001088237268941
 *   m d = 12: LamRefBar = 9.881502336189368e-7,
 *             g = 0.0019881139375579585, gammaSL = 0.5000019755286718
 *
 * ROUTING CONSEQUENCE FOR THE OPEN SUB-GAP (honest, conditional). The
 * refinement relocates the ENTIRE multi-body premium onto the in-shell
 * separation rho; the count K is free. The paper Section 4.5 alias grid
 * has denominators d = k - h/p that are (1/p)-separated ARITHMETIC
 * progressions inside each unit block (imp-95071), so IF the envelope
 * extraction maps alias denominators to dictionary rates with that
 * arithmetic spacing, consecutive ratios approach 1 as p grows and the
 * binding obstruction for imp-95212-subgap-fresnel-airy-envelope-port is
 * rho -> 1 COALESCENCE (the LEMMA NG boundary), NOT multiplicity K. The
 * extraction leg must therefore deliver either a geometric-subchain
 * regrouping (dyadic-block thinning of the arithmetic grid into shells
 * with rho bounded away from 1) or a biorthogonal bound priced by
 * ARITHMETIC separation. This narrows the sub-gap; it does not close it.
 *
 * HONEST LIMITS. (a) The Fresnel-Airy envelope port and the paper
 * constant extraction (m, d, shell ratio, K, rho) remain OPEN (successor
 * sub-gap unchanged: imp-95212-subgap-fresnel-airy-envelope-port). (b)
 * The refined bound still inherits the triangle-inequality lossiness
 * (one-sided; the true class sup may clear 1/2 below xStarRef). (c)
 * K-uniformity is a property of THIS route; whether the TRUE threshold
 * is K-uniform is not addressed (only the upper bound is). (d) rho > 1
 * stays load-bearing: A*(rho) diverges as rho -> 1+ (A*(1.01) > 1e100),
 * so LEMMA NG is quantified, not bypassed. (e) Model-family constants
 * throughout; gammaSL remains a cap, not proved attained; the measured
 * class sup phi = 0.3572 (imp-95113) is untouched.
 *
 * SUB-GAP (surviving, explicitly named, NOT closed):
 *   imp-95212-subgap-fresnel-airy-envelope-port -- unchanged, with the
 *   routing consequence above: the extraction leg must now deliver the
 *   in-shell separation structure (geometric regrouping or arithmetic-
 *   separation pricing), since separation, not multiplicity, is the
 *   binding quantity.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) K = 1 reduction stress-tested: LamRefBar
 * at K = 1 must reproduce the imp-95211 payoff rows and xStar EXACTLY
 * (asserted rel 1e-12). (2) THEOREM DR-R approached by a 3000-draw
 * Rayleigh battery over random H-DYA-M configurations (1..3 shells, up
 * to K = 2..4 rates per shell at in-shell ratios >= rho in {1.5, 1.2},
 * shell jumps >= 2, random depths, signed coefficients) against the
 * REFINED finite-n bound -- a strictly stronger test than the imp-95212
 * battery since the bound is strictly smaller (a 20000-draw offline run:
 * no violation, worst ratio to the bound 0.2333). (3) Termwise dominance
 * checked on a (K, rho, x) grid: refined <= DR-M everywhere, strict at
 * K >= 2, and refined(K) <= refined(K+1) <= K-infinity series <= crude
 * A*^2 cap. (4) The A*(2) = C_inf identity checked to rel 1e-12. (5)
 * COROLLARY CP-NS checked: xStarM(K, 1.5) exceeds xStarInf(1.5) for all
 * sampled K >= 3 while xStarRef(K, 1.5) never does; xStarRef(80, 1.5)
 * matches xStarInf(1.5) to 1e-6 (saturation, not truncation). (6) NG
 * boundary: A*(1.01) > 1e100 and xStarInf increases as rho decreases
 * (6.60 / 10.89 at rho = 2 / 1.5). (7) The gammaSL chain is cross-checked
 * against the imp-95210 baked pair (transcription guard).
 *
 * The numerics below CROSS-CHECK the theorem statements; they are not
 * the claim. Import-light (no heavy bundle; imports only the sibling
 * verdict modules for carried constants). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

import BNT from "./imp-95172-ballast-necessity-tradeoff.js";
import MBU from "./imp-95208-mb-uniform-ballast-cap.js";
import OVC from "./imp-95209-overlap-currency-cap.js";
import SML from "./imp-95210-seam-mass-localization-cap.js";
import DRL from "./imp-95211-dyadic-rate-localization.js";
import MPD from "./imp-95212-multiplicity-priced-shift-damping.js";

// ── carried constants (single source of truth: sibling verdict objects) ─────
const LW_EVEN = BNT.constants.lwEven; // 3.9197935113802585e-5
const Q_OD = BNT.constants.q; // 0.03755392855053636
const C_U = MBU.constants.cU; // 0.30501330232499435
const KAPPA = OVC.constants.kappa; // 48.717745853978386
const GAMMA_OV = OVC.constants.gammaOV; // 0.9995949885454457
const C_INF = DRL.constants.cInf; // 8.255987935778247
const X_STAR = DRL.constants.xStar; // 2.651017799014494

// ── new baked literals (recomputed by the assertions) ────────────────────────
const A_STAR_15 = 78.9241705724922; // A*(1.5) = prod_{l>=1} c(1.5^l)
const C_STAR_INF_15 = 470.19547013421004; // Cstar_inf(1.5)
const C_STAR_INF_2 = 61.86651213770985; // Cstar_inf(2)
const X_STAR_REF_TABLE = [
  { K: 2, rho: 1.5, xStarRef: 5.514443274039953, xStarM: 6.8802447087280605 },
  { K: 2, rho: 2, xStarRef: 4.6255892238020575, xStarM: 6.375420548672336 },
  { K: 3, rho: 2, xStarRef: 5.610446348420641, xStarM: 9.976480881386347 },
];
const X_STAR_INF_15 = 10.89000440771252; // K-uniform threshold, rho = 1.5
const X_STAR_INF_2 = 6.597722130935779; // K-uniform threshold, rho = 2
const X_STAR_U_15 = 15.23719380714591; // crude A*^2 closed cap, rho = 1.5
const X_STAR_U_2 = 8.694978598076094; // crude A*^2 closed cap, rho = 2
const PAYOFF_TABLE_R = [
  {
    md: 8,
    lamRefBar: 0.003051244971567392,
    theta2: 0.9969487550284326,
    g: 0.11030747709363815,
    gammaSL: 0.506081468712321,
  },
  {
    md: 10,
    lamRefBar: 0.000054436035353634766,
    theta2: 0.9999455639646464,
    g: 0.014755754412660811,
    gammaSL: 0.5001088237268941,
  },
  {
    md: 12,
    lamRefBar: 9.881502336189368e-7,
    theta2: 0.9999990118497664,
    g: 0.0019881139375579585,
    gammaSL: 0.5000019755286718,
  },
];

// ── refined-constant machinery ───────────────────────────────────────────────
const cFac = (q) => (q + 1) / (q - 1);
const KMAX = 60;
const P_PARTIAL = [1];
for (let k = 1; k <= KMAX; k++) {
  P_PARTIAL.push((P_PARTIAL[k - 1] * (Math.pow(2, k) + 1)) / (Math.pow(2, k) - 1));
}
// A*(rho) and the in-shell chain partial products prod_{l=1}^{m} c(rho^l)
function chainPartials(rho) {
  const cp = [1];
  let q = rho;
  for (let l = 1; l <= 4000; l++) {
    const f = cFac(q);
    cp.push(cp[l - 1] * f);
    if (f - 1 < 1e-17) break;
    q *= rho;
    if (q > 1e18) break;
  }
  return cp;
}
function aStar(rho) {
  const cp = chainPartials(rho);
  return cp[cp.length - 1];
}
function sInShell(cp, i, K) {
  const end = cp.length - 1;
  return cp[Math.min(i, end)] * cp[Math.min(K - 1 - i, end)];
}
// D_j(K, rho) = prod_{i=0}^{K-1} c(2^j rho^i); K = Infinity allowed
function dJ(j, K, rho) {
  let p = 1;
  let q = Math.pow(2, j);
  for (let i = 0; i < K; i++) {
    const f = cFac(q);
    p *= f;
    if (f - 1 < 1e-17) break;
    q *= rho;
    if (q > 1e18) break;
  }
  return p;
}
function cStarK(K, rho) {
  let p = 1;
  for (let j = 1; j <= 60; j++) {
    const d = dJ(j, K, rho);
    p *= d;
    if (d - 1 < 1e-16) break;
  }
  return p;
}
// THEOREM DR-R finite-n and n-uniform forms
function sqrtLamRefN(n, x, K, rho) {
  const cp = chainPartials(rho);
  const D = [1];
  for (let j = 1; j <= n; j++) D.push(dJ(j, K, rho));
  const R = [1];
  for (let j = 1; j <= n; j++) R.push(R[j - 1] * D[j]);
  let s = 0;
  for (let b = 1; b <= n; b++) {
    let inner = 0;
    for (let i = 0; i < K; i++) {
      const e = Math.pow(2, b - 1) * Math.pow(rho, i) * x;
      if (e > 745) break;
      inner += sInShell(cp, i, K) * Math.exp(-e);
    }
    s += R[b - 1] * R[n - b] * inner;
  }
  return s;
}
function sqrtLamRefBar(x, K, rho) {
  const cp = chainPartials(rho);
  const CS = cStarK(K, rho);
  let s = 0;
  let Rb = 1;
  for (let b = 1; b <= KMAX; b++) {
    let inner = 0;
    for (let i = 0; i < K; i++) {
      const e = Math.pow(2, b - 1) * Math.pow(rho, i) * x;
      if (e > 745) break;
      inner += sInShell(cp, i, K) * Math.exp(-e);
    }
    s += Rb * inner;
    if (Math.pow(2, b) * x > 745) break;
    Rb *= dJ(b, K, rho);
  }
  return CS * s;
}
function lamRefBar(x, K, rho) {
  const s = sqrtLamRefBar(x, K, rho);
  return s * s;
}
// crude K-uniform closed cap (THEOREM KU remark): A*^2 in place of S_i
function sqrtLamU(x, rho) {
  const A2 = aStar(rho) * aStar(rho);
  const CS = cStarK(Infinity, rho);
  let s = 0;
  let Rb = 1;
  for (let b = 1; b <= KMAX; b++) {
    let inner = 0;
    let e = Math.pow(2, b - 1) * x;
    for (let i = 0; i < 100000; i++) {
      if (e > 745) break;
      const t = Math.exp(-e);
      inner += t;
      if (t < 1e-20 * (inner + 1)) break;
      e *= rho;
    }
    s += Rb * A2 * inner;
    if (Math.pow(2, b) * x > 745) break;
    Rb *= dJ(b, Infinity, rho);
  }
  return CS * s;
}
// imp-95212 DR-M reference (for the dominance and CP-NS comparisons)
function sqrtLamBarM(x, K, rho) {
  let s = 0;
  for (let b = 1; b <= KMAX; b++) {
    const e = Math.pow(2, b - 1) * x;
    if (e > 745) break;
    s += Math.pow(P_PARTIAL[b - 1], K) * Math.exp(-e);
  }
  return Math.pow((rho + 1) / (rho - 1), K - 1) * K * Math.pow(C_INF, K) * s;
}
function bisectRoot(f) {
  let lo = 0.01;
  let hi = 200;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > Math.SQRT1_2) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const xStarRef = (K, rho) => bisectRoot((x) => sqrtLamRefBar(x, K, rho));
const xStarM = (K, rho) => bisectRoot((x) => sqrtLamBarM(x, K, rho));
const xStarInf = (rho) => bisectRoot((x) => sqrtLamRefBar(x, 400, rho));
const xStarU = (rho) => bisectRoot((x) => sqrtLamU(x, rho));
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
function gammaSL(g) {
  const th = (KAPPA * KAPPA + 1 - 2 * Q_OD) / (g * KAPPA);
  const T = 4 + th * th;
  const om = 2 / (T * (1 + Math.sqrt(1 - 4 / T)));
  return hStarSL(om, g) / (2 * LW_EVEN);
}
// small dense quadratic forms for the Rayleigh battery
function cauchyGram(mus) {
  return mus.map((a) => mus.map((b) => 1 / (a + b)));
}
function shiftedGram(mus, d) {
  return mus.map((a) => mus.map((b) => Math.exp(-(a + b) * d) / (a + b)));
}
function quadForm(A, x) {
  let s = 0;
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < x.length; j++) s += x[i] * A[i][j] * x[j];
  }
  return s;
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95213_GEOMETRIC_CHAIN_PRICING = {
  ticket:
    "imp-95213 (fifth leg of the seam chain, settling the imp-95212 honest-limit question -- sharpness of the linear-in-K threshold growth -- in the negative: hypothesis (ii) of H-DYA-M forces the ordered in-shell rates into a geometric chain, ratio >= rho^distance, and pricing that chain instead of the flat rho makes every constant of THEOREM DR-M convergent as K -> infinity)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes LEMMA R1 / LEMMA BI / THEOREM DR (imp-95211), THEOREM DR-M / HL-M / COROLLARY CP (imp-95212), THEOREM SL / COROLLARY GC-SL (imp-95210), THEOREM OV (imp-95209), THEOREM BU (imp-95208); carried constants imported from the six sibling verdict objects.",
  theoremDRR:
    "Refined multiplicity-priced shift damping, n-uniform: under the UNCHANGED hypothesis H-DYA-M(m, d, K, rho), sqrt(LamRefN) = sum_{b=1}^n R_{b-1} R_{n-b} sum_{i=0}^{K-1} S_i e^(-2^(b-1) rho^i x) with S_i = prod_{l<=i} c(rho^l) prod_{l<=K-1-i} c(rho^l), D_j = prod_{i<K} c(2^j rho^i), R_m = prod_{j<=m} D_j; n-uniformly sqrt(LamRefBar) = Cstar_K sum_b R_{b-1} sum_i S_i e^(-2^(b-1) rho^i x). Termwise <= THEOREM DR-M (strict at K >= 2), exact reduction to THEOREM DR at K = 1. The only new input is using the geometric in-shell chain nu_{i2}/nu_{i1} >= rho^(i2-i1) that hypothesis (ii) already forces.",
  theoremKU:
    "K-uniform threshold: LamRefBar is increasing in K with a convergent K -> infinity limit for every x > 0, so xStarRef(K, rho) <= xStarInf(rho) < infinity for ALL K; H-LOC and the gammaOV -> gammaSL collapse hold under H-DYA-M whenever m d > xStarInf(rho), uniformly in the in-shell multiplicity. xStarInf(1.5) = 10.89000440771252, xStarInf(2) = 6.597722130935779.",
  corollaryCPNS:
    "COROLLARY CP is NOT sharp: the DR-M threshold xStarM(K, rho) and its CP cap grow linearly in K, but the refined threshold is bounded by xStarInf(rho); from K = 3 the K-uniform refined threshold undercuts both at rho = 1.5 and rho = 2. The linear-in-K coalescence price was an artifact of capping every in-shell factor at c(rho) and every cross-shell factor at c(2^j); the true premium of this route is bounded in K, and the only genuine divergence is coalescence rho -> 1+ (A*(rho) -> infinity; LEMMA NG boundary intact).",
  identityAStar2:
    "A*(2) = prod_{l>=1} c(2^l) = C_inf exactly: the in-shell geometric-chain constant at ratio 2 coincides with the dyadic cross-shell constant of imp-95211.",
  routingConsequence:
    "The refinement relocates the entire multi-body premium onto in-shell separation rho; the count K is free. The paper Section 4.5 alias grid is (1/p)-separated ARITHMETIC inside each unit block (imp-95071), so if the extraction maps alias denominators to dictionary rates with that spacing, consecutive ratios approach 1 and the binding obstruction for the Fresnel-Airy port is rho -> 1 coalescence (LEMMA NG boundary), not multiplicity. The extraction leg must deliver geometric-subchain regrouping (dyadic-block thinning) or an arithmetic-separation biorthogonal bound. Conditional on the extraction; narrows the sub-gap, does not close it.",
  constants: {
    aStar15: A_STAR_15,
    cStarInf15: C_STAR_INF_15,
    cStarInf2: C_STAR_INF_2,
    xStarRefTable: X_STAR_REF_TABLE,
    xStarInf15: X_STAR_INF_15,
    xStarInf2: X_STAR_INF_2,
    xStarU15: X_STAR_U_15,
    xStarU2: X_STAR_U_2,
    payoffTableR: PAYOFF_TABLE_R,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, carried unchanged: extract the dictionary constants (m, d, shell ratio, K, rho) for the paper Section 4.5 packets and port the two-sided-exponential envelope machinery to the Fresnel-Airy envelope class. NEW ROUTING INPUT from this module: separation rho, not multiplicity K, is the binding quantity -- the extraction must deliver the in-shell separation structure (geometric regrouping of the arithmetic (1/p)-grid, or an arithmetic-separation pricing lemma). Also recorded, open: whether the TRUE class threshold is K-uniform (only the upper bound is), and the one-sided triangle-inequality lossiness.",
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "LINEAR-IN-K SHARPNESS SETTLED (negative): the imp-95212 honest-limit question is answered -- THEOREM DR-R prices the geometric in-shell chain that hypothesis (ii) forces, THEOREM KU gives xStarRef(K, rho) <= xStarInf(rho) < infinity for all K (10.89 at rho = 1.5, 6.60 at rho = 2), and COROLLARY CP-NS shows the linear-in-K price of COROLLARY CP was a capping artifact. HONEST LIMIT: the Fresnel-Airy envelope port and paper extraction remain open (sub-gap carried); the refined bound is still one-sided; the paper alias grid is arithmetic, so the NG coalescence boundary rho -> 1, now the ONLY divergence, is exactly where the paper packets live unless the extraction regroups the grid geometrically; measured class sup phi = 0.3572 unchanged",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM DR-R and THEOREM KU are unconditional closed-form statements about multi-rate lacunary exponential sums on the half-line, proved by the imp-95211 LEMMA BI route with the beta_r factors priced along the geometric chain that H-DYA-M(ii) forces (consecutive in-shell ratios >= rho multiply to rho^distance; c(q) = (q+1)/(q-1) decreasing; all refined products converge since sum_l ln c(rho^l) <= 2 rho/(rho-1) type tails). COROLLARY CP-NS is the exhibited comparison of the two thresholds. The conditional H-LOC consequence is exactly as THEOREM HL-M with the smaller constant. H-DYA-M itself is NOT instantiated for the paper packets and every conditional statement names it. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step: the imp-95212 open question -- is the linear-in-K collar premium sharp? -- is settled in the NEGATIVE under the unchanged hypothesis H-DYA-M. THEOREM DR-R: pricing the geometric in-shell chain (ratio >= rho^distance, forced by hypothesis (ii)) refines every Cauchy factor, giving sqrt(LamRefBar) = Cstar_K sum_b R_{b-1} sum_i S_i e^(-2^(b-1) rho^i x), termwise below THEOREM DR-M, exactly THEOREM DR at K = 1. THEOREM KU: the refined series converges as K -> infinity, so the threshold is K-UNIFORM: xStarRef(K, rho) <= xStarInf(rho) = 10.89000440771252 / 6.597722130935779 at rho = 1.5 / 2, for ALL K -- versus DR-M thresholds 6.88 / 11.00 / 15.00 / 38.24 at K = 2/3/4/10 (rho = 1.5). Refined finite-K thresholds drop at every K >= 2: 6.880 -> 5.514 at (2, 1.5), 9.976 -> 5.610 at (3, 2). COROLLARY CP-NS: the linear-in-K coalescence price of COROLLARY CP was a capping artifact; the only genuine divergence is rho -> 1+ (A*(1.01) > 1e100; LEMMA NG boundary intact). Payoff at (2, 1.5): gammaSL = 0.506081468712321 / 0.5001088237268941 / 0.5000019755286718 at m d = 8/10/12 (imp-95212 rows 0.5996/0.5019/0.5000). ROUTING: the premium now sits entirely on separation rho -- for the arithmetic (1/p) paper alias grid the binding obstruction is coalescence, not count, so the extraction leg must regroup geometrically or price arithmetic separation. HONEST: the Fresnel-Airy envelope port and paper extraction remain OPEN (sub-gap imp-95212-subgap-fresnel-airy-envelope-port carried unchanged); the bound is one-sided; K-uniformity is proved for this route only, not for the true class threshold; H-DYA-M is not instantiated for the paper packets; model-family constants; gammaSL is a cap, not proved attained; measured class sup phi = 0.3572 untouched. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95213_GCP_ASSERTIONS = [
  {
    id: "imp95213-gcp-k1-reduction-and-identity",
    description:
      "the K = 1 base case reproduces imp-95211 exactly (rel 1e-12): LamRefBar(md; 1, rho) matches every sibling payoff row for arbitrary rho, the bisected xStarRef(1, 2) matches xStar, A*(2) = C_inf exactly (the identity), the dyadic partial products reproduce cInf, and the gammaSL chain reproduces the imp-95210 baked pair",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      if (!rel(P_PARTIAL[KMAX], C_INF)) return false;
      for (const row of DRL.constants.payoffTable) {
        if (!rel(lamRefBar(row.md, 1, 3), row.lamBar)) return false;
        if (!rel(lamRefBar(row.md, 1, 1.0001), row.lamBar)) return false;
      }
      if (!rel(xStarRef(1, 2), X_STAR)) return false;
      if (!rel(aStar(2), C_INF)) return false;
      return rel(gammaSL(SML.constants.gRef), SML.constants.gammaSLRef);
    },
  },
  {
    id: "imp95213-gcp-baked-literals",
    description:
      "baked literals reproduce from the defining formulas (rel 1e-12): A*(1.5), the two Cstar_inf values, the three refined thresholds by bisection (each strictly below the matching imp-95212 xStarM literal), the two K-uniform thresholds xStarInf and their crude caps xStarU (with xStarInf <= xStarU), and the (2, 1.5) refined payoff rows (LamRefBar, theta^2, g, gammaSL, each gammaSL strictly below the imp-95212 row and below gammaOV)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      if (!rel(aStar(1.5), A_STAR_15)) return false;
      if (!rel(cStarK(Infinity, 1.5), C_STAR_INF_15)) return false;
      if (!rel(cStarK(Infinity, 2), C_STAR_INF_2)) return false;
      for (const row of X_STAR_REF_TABLE) {
        if (!rel(xStarRef(row.K, row.rho), row.xStarRef)) return false;
        const sib = MPD.constants.xStarMTable.find(
          (r) => r.K === row.K && r.rho === row.rho,
        );
        if (!sib || !rel(sib.xStarM, row.xStarM)) return false;
        if (!(row.xStarRef < row.xStarM)) return false;
      }
      if (!rel(xStarInf(1.5), X_STAR_INF_15)) return false;
      if (!rel(xStarInf(2), X_STAR_INF_2)) return false;
      if (!rel(xStarU(1.5), X_STAR_U_15)) return false;
      if (!rel(xStarU(2), X_STAR_U_2)) return false;
      if (!(X_STAR_INF_15 <= X_STAR_U_15 && X_STAR_INF_2 <= X_STAR_U_2)) return false;
      for (let r = 0; r < PAYOFF_TABLE_R.length; r++) {
        const row = PAYOFF_TABLE_R[r];
        const lam = lamRefBar(row.md, 2, 1.5);
        if (!rel(lam, row.lamRefBar)) return false;
        if (!rel(1 - lam, row.theta2)) return false;
        if (!rel(gFromLam(lam), row.g)) return false;
        if (!rel(gammaSL(row.g), row.gammaSL)) return false;
        const sib = MPD.constants.payoffTableM[r];
        if (!(sib.md === row.md && row.gammaSL < sib.gammaSL)) return false;
        if (!(row.gammaSL < GAMMA_OV)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95213-gcp-termwise-dominance-and-saturation",
    description:
      "THEOREM DR-R dominance structure on a (K, rho, x) grid: refined n-uniform bound <= DR-M everywhere and strictly at K >= 2; refined is increasing in K and capped by the K = 400 series and by the crude A*^2 cap; finite-n refined <= n-uniform refined for n <= 8; xStarRef(80, 1.5) matches xStarInf(1.5) to 1e-6 (saturation, not truncation)",
    holds: () => {
      for (const K of [2, 3, 4]) {
        for (const rho of [1.2, 1.5, 2]) {
          for (const x of [1, 3, 6, 9, 12]) {
            const r = sqrtLamRefBar(x, K, rho);
            const m = sqrtLamBarM(x, K, rho);
            if (!(r <= m)) return false;
            if (!(r < 0.999 * m)) return false;
            if (!(sqrtLamRefBar(x, K + 1, rho) >= r)) return false;
            if (!(sqrtLamRefBar(x, 400, rho) >= r)) return false;
            if (!(sqrtLamU(x, rho) >= sqrtLamRefBar(x, 400, rho) * (1 - 1e-12)))
              return false;
            for (const n of [1, 2, 4, 8]) {
              if (!(sqrtLamRefN(n, x, K, rho) <= r * (1 + 1e-12))) return false;
            }
          }
        }
      }
      return Math.abs(xStarRef(80, 1.5) - X_STAR_INF_15) <= 1e-6;
    },
  },
  {
    id: "imp95213-gcp-rayleigh-battery",
    description:
      "THEOREM DR-R: 3000 random Rayleigh quotients (a^T DGD a)/(a^T G a) over random H-DYA-M configurations (1..3 shells, up to K in {2, 3, 4} rates per shell at in-shell ratios >= rho in {1.5, 1.2}, shell jumps >= 2x the shell max, random depths and signed coefficients) never exceed the REFINED finite-n bound -- a strictly stronger test than the imp-95212 battery since the bound is strictly smaller (20000-draw offline run: no violation, worst ratio 0.2333)",
    holds: () => {
      let seed = 424243;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 3000; t++) {
        const K = 2 + (t % 3);
        const RHO = t % 2 === 0 ? 1.5 : 1.2;
        const n = 1 + Math.floor(rand() * 3);
        const mus = [];
        let base = Math.pow(10, -1 + 2 * rand());
        for (let b = 0; b < n; b++) {
          const kb = 1 + Math.floor(rand() * K);
          let mu = base;
          for (let i = 0; i < kb; i++) {
            mus.push(mu);
            if (i < kb - 1) mu *= RHO * (1 + 0.5 * rand());
          }
          base = mu * (2 + rand());
        }
        const m0 = mus[0];
        const d = (0.2 + 8 * rand()) / m0;
        const A = mus.map(() => 2 * rand() - 1);
        const num = quadForm(shiftedGram(mus, d), A);
        const den = quadForm(cauchyGram(mus), A);
        if (!(den > 0)) return false;
        const sb = sqrtLamRefN(n, m0 * d, K, RHO);
        if (!(num / den <= sb * sb * (1 + 1e-9))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95213-gcp-cp-not-sharp-and-ng-boundary",
    description:
      "COROLLARY CP-NS and the NG boundary: xStarM(K, 1.5) recomputed by bisection exceeds xStarInf(1.5) for every sampled K >= 3 (while xStarRef(K, 1.5) never does, all K), the DR-M threshold keeps growing (super-threshold at K = 10 nearly 4x the K-uniform cap), A*(1.01) > 1e100 (coalescence divergence), and xStarInf decreases in rho (10.89 at 1.5 vs 6.60 at 2)",
    holds: () => {
      for (const K of [3, 4, 6, 10, 20, 40]) {
        if (!(xStarM(K, 1.5) > X_STAR_INF_15)) return false;
        if (!(xStarRef(K, 1.5) <= X_STAR_INF_15 + 1e-9)) return false;
      }
      if (!(xStarM(10, 1.5) > 3.5 * X_STAR_INF_15)) return false;
      if (!(aStar(1.01) > 1e100)) return false;
      return X_STAR_INF_15 > X_STAR_INF_2;
    },
  },
  {
    id: "imp95213-gcp-honesty-gate",
    description:
      "the verdict answers the imp-95212 open question in the negative without closing the sub-gap: names the carried sub-gap imp-95212-subgap-fresnel-airy-envelope-port as open, the one-sided bound, the rho -> 1 routing consequence for the arithmetic paper grid, the untouched ledger; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95213_GEOMETRIC_CHAIN_PRICING.promotesBound === false &&
      IMP95213_GEOMETRIC_CHAIN_PRICING.openResiduals.length === 5 &&
      /NO QED/.test(IMP95213_GEOMETRIC_CHAIN_PRICING.verdict) &&
      /refereed bound is changed/i.test(IMP95213_GEOMETRIC_CHAIN_PRICING.verdict) &&
      /Floors and ceilings untouched/.test(IMP95213_GEOMETRIC_CHAIN_PRICING.verdict) &&
      /remain OPEN/.test(IMP95213_GEOMETRIC_CHAIN_PRICING.verdict) &&
      /STILL OPEN/.test(IMP95213_GEOMETRIC_CHAIN_PRICING.subGap) &&
      /fresnel-airy-envelope-port/.test(IMP95213_GEOMETRIC_CHAIN_PRICING.subGap) &&
      /LINEAR-IN-K SHARPNESS SETTLED/.test(
        IMP95213_GEOMETRIC_CHAIN_PRICING.openResiduals[4],
      ) &&
      /HONEST LIMIT/.test(IMP95213_GEOMETRIC_CHAIN_PRICING.openResiduals[4]) &&
      /0\.3572/.test(IMP95213_GEOMETRIC_CHAIN_PRICING.verdict) &&
      /NOT instantiated for the paper packets/.test(
        IMP95213_GEOMETRIC_CHAIN_PRICING.rigorScope,
      ) &&
      /coalescence/.test(IMP95213_GEOMETRIC_CHAIN_PRICING.routingConsequence),
  },
];

for (const a of IMP95213_GCP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95213-geometric-chain-multiplicity-pricing assertion failed: ${a.id}`);
  }
}

export default IMP95213_GEOMETRIC_CHAIN_PRICING;
