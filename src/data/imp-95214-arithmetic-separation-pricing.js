/**
 * imp-95214 - RIGOROUS step -- LEMMA AG (arithmetic-gap row product) +
 * THEOREM DR-A (arithmetic-separation multiplicity pricing) + LEMMA OC
 * (occupancy cap) + LEMMA PR (prime-block instantiation) + COROLLARY CP-A
 * / THEOREM LIN (linear-in-occupancy threshold law): SIXTH leg of the
 * seam chain, delivering ONE of the two admissible continuations that the
 * imp-95213 routing consequence named for the open sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port -- "a biorthogonal bound
 * priced by ARITHMETIC separation". The paper Section 4.5 alias grid is
 * (1/p)-separated ARITHMETIC inside each unit block (imp-95071), so its
 * in-shell rates never satisfy a pairwise ratio bounded away from 1; the
 * imp-95212/95213 route then prices them only through rho -> 1+, where
 * A_in and A*(rho) diverge. THIS MODULE prices the ADDITIVE separation
 * the arithmetic grid actually supplies, and quantifies the result: the
 * coalescence price along the arithmetic family is LINEAR in the
 * per-shell occupancy count, with an absolute per-rate base -- not a
 * per-rate divergence.
 *
 * SETTING (identical to imp-95172/95208/95209/95210/95211/95212/95213;
 * model family sigma = 1, theta = 10, s = 11; M = 1). Packets are
 * two-sided exponentials a e^(-mu|t-c|) in L2(R); seam at t = 0; collar
 * depth d; x = m d. Carried constants come from the sibling verdicts.
 *
 * HYPOTHESIS H-DYA-A(m, d, K, eps) -- arithmetic dyadic shells, per
 * parity: the distinct rates partition into ordered shells S_1 < ... <
 * S_n with (i) |S_b| <= K; (ii-A) writing the in-shell rates of S_b in
 * increasing order nu_0 < nu_1 < ... < nu_{k-1}, ADDITIVE separation
 *   nu_{i2} - nu_{i1} >= (i2 - i1) eps nu_0   for all i1 < i2,
 * and in-shell width nu_{k-1} <= 2 nu_0; (iii) lacunary shells
 * min S_{b+1} >= 2 max S_b; min S_1 >= m; every center at depth >= d on
 * the parity's own side of the seam. K = 1 recovers H-DYA exactly.
 * (ii-A) is what an arithmetic progression of spacing delta supplies
 * with eps = delta / nu_0; it also IMPLIES H-DYA-M(ii) at the induced
 * ratio rho = 1 + eps/2 (nu_{i2}/nu_{i1} >= 1 + eps nu_0 / nu_{i1} >=
 * 1 + eps/2 since nu_{i1} <= 2 nu_0), so the DR-M and DR-R machinery
 * stays available; the point of this module is to price (ii-A) NATIVELY.
 *
 * LEMMA OC (occupancy cap). Under (ii-A), (k - 1) eps nu_0 <=
 * nu_{k-1} - nu_0 <= nu_0, so every shell holds at most k <= 1 + 1/eps
 * distinct rates: multiplicity and separation are LINKED on an
 * arithmetic grid. H-DYA-A(., ., K, eps) with (K-1) eps > 1 is vacuous
 * at multiplicity K; throughout, (K-1) eps <= 1 is assumed.
 *
 * LEMMA AG (arithmetic-gap row product). Under (ii-A), the rate at
 * in-shell position i has in-shell Cauchy product
 *   prod_{i2 != i} (nu_i + nu_{i2}) / |nu_i - nu_{i2}|
 *     <= (4/eps)^(k-1) / ( i! (k-1-i)! )  <=  A_ar(K, eps),
 *   A_ar(K, eps) = (4/eps)^(K-1) / ( floor((K-1)/2)! ceil((K-1)/2)! ).
 * PROOF. Numerators: nu_i + nu_{i2} <= 2 nu_{k-1} <= 4 nu_0.
 * Denominators: |nu_i - nu_{i2}| >= |i - i2| eps nu_0 by (ii-A). So the
 * product over the k-1 partners is <= (4/eps)^(k-1) divided by the
 * product of the index distances, which is i! (k-1-i)!; that is minimal
 * at the middle row. Monotonicity in k (each extra factor 4/eps divided
 * by a distance <= K-1 exceeds 1 when (K-1) eps <= 1) gives the uniform
 * cap A_ar. QED. Versus the flat-rho cap at the induced ratio,
 * A_in(K, 1 + eps/2) = (1 + 4/eps)^(K-1), so
 *   A_in(K, 1 + eps/2) / A_ar(K, eps)
 *     >= floor((K-1)/2)! ceil((K-1)/2)!  :
 * the arithmetic pricing gains at least the MIDDLE FACTORIAL, at every
 * K (factor 2 from K = 4, factor 2.6e29 at K = 33).
 *
 * THEOREM DR-A (arithmetic-separation multiplicity pricing, n-uniform).
 * Under H-DYA-A(m, d, K, eps) with (K-1) eps <= 1 and x = m d,
 *   integral_d^inf f^2 <= LamBarA(x; K, eps) integral_0^inf f^2 ,
 *   sqrt(LamAN) = A_ar K sum_{b=1}^n (P_{b-1} P_{n-b})^K e^(-2^(b-1) x),
 *   sqrt(LamBarA) = A_ar K C_inf^K sum_{b>=1} P_{b-1}^K e^(-2^(b-1) x).
 * PROOF. The imp-95212 THEOREM DR-M route VERBATIM (LEMMA R1 collapse
 * per distinct rate + LEMMA BI Cauchy biorthogonal bounds + triangle
 * inequality; cross-shell factors capped by the dyadic partial products
 * P via (iii); damping mu >= 2^(b-1) m); the ONLY change is that the
 * in-shell part of each beta_r product is capped by LEMMA AG instead of
 * c(rho)^(K-1). K = 1 reduces exactly to imp-95211 THEOREM DR
 * (A_ar(1, eps) = 1). Pointwise sqrt(LamBarA) < sqrt(LamBarM(.; K,
 * 1 + eps/2)) for K >= 2 (same route, strictly smaller constant). QED.
 * H-LOC and the THEOREM SL collapse gammaOV -> gammaSL follow whenever
 * m d > xStarA(K, eps), exactly as THEOREM HL-M.
 *
 * COROLLARY CP-A (closed-form cap). xStarA(K, eps) <= xStar + ln K +
 * (2K - 2) ln C_inf + ln A_ar(K, eps) -- the imp-95212 COROLLARY CP
 * shift argument verbatim (it uses only that the constant is
 * multiplicative and the damping exponents are >= 1 termwise; only
 * A_in changes to A_ar). QED.
 *
 * THEOREM LIN (linear-in-occupancy threshold law; the NG boundary does
 * not engage along the arithmetic family). By Stirling (n! >= (n/e)^n
 * and the middle binomial <= 2^n), A_ar(K, eps) <= (8e/((K-1) eps))^(K-1),
 * so at FULL OCCUPANCY K_f(eps) = 1 + floor(1/eps) (where (K_f - 1) eps
 * >= 1 - eps) the per-rate in-shell amplification is bounded by the
 * ABSOLUTE constant 8e/(1 - eps) <= 16e (eps <= 1/2) -- independent of
 * how close the spacing eps is to coalescence. With COROLLARY CP-A,
 *   xStarA(K_f(eps), eps) <= xStar + ln K_f
 *       + (K_f - 1) (2 ln C_inf + ln(16 e))
 * with slope 2 ln C_inf + ln(16e) = 7.994466217181721 per rate: the
 * threshold along the full-occupancy arithmetic family grows LINEARLY
 * in the occupancy count. The flat-rho route at the induced ratio pays
 * (K_f - 1) ln(1 + 4/eps) ~ (1/eps) ln(1/eps) instead -- superlinear by
 * the log. So the imp-95213 routing worry -- "the paper alias grid
 * binds at the NG rho -> 1 coalescence boundary" -- is QUANTIFIED AWAY
 * at the model level: along the arithmetic family the fixed-K
 * divergence A_in -> inf and the fixed-rho divergence A*(rho) -> inf
 * (K -> inf) never engage, because occupancy caps K at 1 + 1/eps and
 * the native additive pricing is linear there. The only remaining
 * growth is the occupancy count itself. QED.
 *
 * LEMMA PR (prime-block instantiation). The alias-grid-shaped rates
 * nu = 1/p for the primes p in a dyadic block (P, 2P), P >= 3, satisfy
 * (ii-A) with eps = 2/p_max and width < 2: |1/p - 1/q| = (q - p)/(p q),
 * distinct odd primes at index distance t have q - p >= 2t, and
 * p q < p_max^2, so |1/p - 1/q| >= 2t/p_max^2 = t (2/p_max) nu_min;
 * width 1/p_min < 2/p_max iff p_max < 2 p_min (dyadic block). QED.
 * Instantiated on the 23 primes in (128, 256): eps = 2/251 =
 * 0.00796812749003984 (measured sharp in-shell separation 0.0087154),
 * occupancy (K-1) eps = 0.1753, exact worst-row Cauchy product
 * 1.1134400560787463e26 (row 10) vs LEMMA AG cap 1.633692597202449e44.
 * So H-DYA-A(ii-A) is supplied BY the arithmetic grid natively; what
 * the extraction leg still owes is the rate map itself (the
 * Fresnel-Airy envelope port), the INTER-shell lacunarity (iii) for the
 * occupied shells, and the paper constants (m, d, per-shell occupancy).
 *
 * INSTANTIATED CONSTANTS (exact evaluations; assertions reproduce them):
 * gain table A_in(K, 1 + eps/2)/A_ar(K, eps): 1.125 / 5.098 / 736.77 /
 * 2.083e9 / 5.616e26 at (K, eps) = (2, 1/2)/(5, 1/4)/(9, 1/8)/
 * (17, 1/16)/(33, 1/32). Full-occupancy thresholds (eps = 1/(K-1)):
 *   K =  5: xStarA = 22.214765822591623 (DR-M induced 23.843558627020833,
 *           DR-R induced 17.25684789371975)
 *   K =  9: xStarA = 42.912026456556845 (DR-M 49.514307386586765,
 *           DR-R 33.464573262750136)
 *   K = 17: xStarA = 84.39866916960693  (DR-M 105.85594195967286,
 *           DR-R 66.20290190749122)
 *   K = 33: xStarA = 167.42530805155485 (DR-M 229.01805675786198,
 *           DR-R 132.00549050444988)
 * PAYOFF at (K, eps) = (5, 1/4): gammaSL = 0.5277352061327152 /
 * 0.5005151171197879 / 0.5000094370907929 at m d = 24 / 26 / 28
 * (vs gammaOV = 0.99959).
 *
 * SKEPTICAL SELF-CHECK RECORD (including the honest negative). (1)
 * K = 1 reduction stress-tested: LamBarA at K = 1 reproduces the imp-95211
 * payoff rows and xStar exactly (rel 1e-12), for arbitrary eps. (2)
 * LEMMA AG approached per row: exact Cauchy products on uniform
 * arithmetic grids at (K, eps) up to (17, 1/16) and on the actual
 * (128, 256) prime block never exceed the row bound. (3) THEOREM DR-A
 * approached by a 3000-draw Rayleigh battery over random H-DYA-A
 * configurations (1..3 shells, up to 7 rates per shell at additive
 * spacings >= eps with random slack, lacunary jumps, random depths,
 * signed coefficients) against the finite-n bound; a 20000-draw offline
 * run: no violation, worst ratio to the bound 0.0014626056020685411.
 * (4) HONEST NEGATIVE, recorded: since (ii-A) implies H-DYA-M at the
 * induced rho = 1 + eps/2, the imp-95213 THEOREM DR-R geometric-chain
 * bound ALSO applies, and on the full-occupancy family it is
 * numerically SHARPER than DR-A (thresholds 17.26/33.46/66.20/132.01 vs
 * 22.21/42.91/84.40/167.43 at K = 5/9/17/33; both linear, DR-R slope
 * ~4.0 vs DR-A ~5.2 per rate) -- Bernoulli (rho^l >= 1 + l eps/2)
 * already recovers factorial-type tempering inside DR-R. The certified
 * family threshold is therefore the MIN of the two; what DR-A adds that
 * DR-R does not is the CLOSED-FORM constant (finite factorial formula,
 * no infinite products), the closed-form CP-A cap, and the PROVED
 * linear-in-occupancy law (THEOREM LIN; DR-R linearity on this family
 * is observed, not proved here). (5) The DR-R transcription used for
 * the comparison is guarded against the imp-95213 baked
 * xStarInf(1.5) = 10.89000440771252 (rel 1e-9). (6) The full-occupancy
 * absolute-base cap A_ar <= (8e/(1-eps))^(K-1) and the CP-A cap are
 * checked on the family up to K = 65 and K = 17 respectively. (7)
 * gammaSL chain cross-checked against the imp-95210 baked pair.
 *
 * HONEST LIMITS. (a) The Fresnel-Airy envelope port and the paper
 * constant extraction remain OPEN (successor sub-gap unchanged:
 * imp-95212-subgap-fresnel-airy-envelope-port); H-DYA-A is instantiated
 * for prime-block SHAPED rate sets (LEMMA PR), not for the paper
 * packets. (b) Inter-shell lacunarity (iii) is NOT supplied by the
 * arithmetic grid (adjacent dyadic blocks of a single progression touch
 * at ratio ~ 1); delivering (iii) for the occupied shells is an
 * explicit extraction obligation. (c) The bound inherits the
 * triangle-inequality lossiness (one-sided; prime-block sharpness gap
 * e^41.8 between the exact worst row and the AG cap). (d) DR-R at the
 * induced ratio is sharper where both apply (the honest negative
 * above); DR-A is the closed-form/linearity leg, not the sharpest
 * curve. (e) Model-family constants throughout; gammaSL remains a cap,
 * not proved attained; the measured class sup phi = 0.3572 (imp-95113)
 * is untouched.
 *
 * SUB-GAP (surviving, explicitly named, NOT closed):
 *   imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, further
 *   narrowed: of the two admissible continuations named by imp-95213,
 *   the arithmetic-separation pricing leg now EXISTS at model level
 *   (THEOREM DR-A + LEMMA PR). Remaining: the alias-denominator ->
 *   dictionary-rate map (Fresnel-Airy envelope port), inter-shell
 *   lacunarity (iii) for the occupied shells, and the paper constants
 *   (m, d, per-shell occupancy).
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
import GCP from "./imp-95213-geometric-chain-multiplicity-pricing.js";

// ── carried constants (single source of truth: sibling verdict objects) ─────
const LW_EVEN = BNT.constants.lwEven; // 3.9197935113802585e-5
const Q_OD = BNT.constants.q; // 0.03755392855053636
const C_U = MBU.constants.cU; // 0.30501330232499435
const KAPPA = OVC.constants.kappa; // 48.717745853978386
const GAMMA_OV = OVC.constants.gammaOV; // 0.9995949885454457
const C_INF = DRL.constants.cInf; // 8.255987935778247
const X_STAR = DRL.constants.xStar; // 2.651017799014494
const X_STAR_INF_15 = GCP.constants.xStarInf15; // 10.89000440771252

// ── new baked literals (recomputed by the assertions) ────────────────────────
const LIN_SLOPE = 7.994466217181721; // 2 ln C_inf + ln(16 e), per-rate cap slope
const A_AR_TABLE = [
  { K: 2, eps: 0.5, aAr: 8, aInInduced: 9, gain: 1.125 },
  { K: 3, eps: 0.25, aAr: 256, aInInduced: 289, gain: 1.12890625 },
  { K: 5, eps: 0.25, aAr: 16384, aInInduced: 83521, gain: 5.09771728515625 },
  {
    K: 9,
    eps: 0.125,
    aAr: 1908874353.7777777,
    aInInduced: 1406408618241,
    gain: 736.7738036071532,
  },
  {
    K: 17,
    eps: 0.0625,
    aAr: 48734726918201230000,
    aInInduced: 1.0153451678210142e29,
    gain: 2083412039.0686085,
  },
  {
    K: 33,
    eps: 0.03125,
    aAr: 6.158569419650969e40,
    aInInduced: 3.458364221657729e67,
    gain: 5.615531767203378e26,
  },
];
const X_STAR_A_TABLE = [
  {
    K: 5,
    eps: 0.25,
    xStarA: 22.214765822591623,
    xStarMInduced: 23.843558627020833,
    xStarRefInduced: 17.25684789371975,
  },
  {
    K: 9,
    eps: 0.125,
    xStarA: 42.912026456556845,
    xStarMInduced: 49.514307386586765,
    xStarRefInduced: 33.464573262750136,
  },
  {
    K: 17,
    eps: 0.0625,
    xStarA: 84.39866916960693,
    xStarMInduced: 105.85594195967286,
    xStarRefInduced: 66.20290190749122,
  },
  {
    K: 33,
    eps: 0.03125,
    xStarA: 167.42530805155485,
    xStarMInduced: 229.01805675786198,
    xStarRefInduced: 132.00549050444988,
  },
];
const PAYOFF_TABLE_A = [
  {
    md: 24,
    lamBarA: 0.014071333638334267,
    theta2: 0.9859286663616658,
    g: 0.23557021210647963,
    gammaSL: 0.5277352061327152,
  },
  {
    md: 26,
    lamBarA: 0.00025772546151403667,
    theta2: 0.999742274538486,
    g: 0.032103522492120645,
    gammaSL: 0.5005151171197879,
  },
  {
    md: 28,
    lamBarA: 0.000004720406475388846,
    theta2: 0.9999952795935246,
    g: 0.004345289032113539,
    gammaSL: 0.5000094370907929,
  },
];
// LEMMA PR instantiation: the 23 primes in the dyadic block (128, 256)
const PRIME_BLOCK = {
  primes: [
    131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199,
    211, 223, 227, 229, 233, 239, 241, 251,
  ],
  K: 23,
  epsPr: 0.00796812749003984, // 2/251
  epsHatMeasured: 0.008715429087310453,
  occupancy: 0.1752988047808765,
  exactWorstRow: 1.1134400560787463e26,
  worstRowIndex: 10,
  agCap: 1.633692597202449e44,
};

// ── theorem functionals ──────────────────────────────────────────────────────
const KMAX = 60;
const P_PARTIAL = [1];
for (let k = 1; k <= KMAX; k++) {
  P_PARTIAL.push((P_PARTIAL[k - 1] * (Math.pow(2, k) + 1)) / (Math.pow(2, k) - 1));
}
function fact(n) {
  let a = 1;
  for (let i = 2; i <= n; i++) a *= i;
  return a;
}
// LEMMA AG constant
function aAr(K, eps) {
  const n = K - 1;
  return Math.pow(4 / eps, n) / (fact(Math.floor(n / 2)) * fact(Math.ceil(n / 2)));
}
function aIn(K, rho) {
  return Math.pow((rho + 1) / (rho - 1), K - 1);
}
// THEOREM DR-A finite-n and n-uniform forms (the DR-M route with A_in -> A_ar)
function sqrtLamAN(n, x, K, eps) {
  let s = 0;
  for (let b = 1; b <= n; b++) {
    const e = Math.pow(2, b - 1) * x;
    if (e > 745) break;
    s += Math.pow(P_PARTIAL[b - 1] * P_PARTIAL[n - b], K) * Math.exp(-e);
  }
  return aAr(K, eps) * K * s;
}
function sqrtLamBarA(x, K, eps) {
  let s = 0;
  for (let b = 1; b <= KMAX; b++) {
    const e = Math.pow(2, b - 1) * x;
    if (e > 745) break;
    s += Math.pow(P_PARTIAL[b - 1], K) * Math.exp(-e);
  }
  return aAr(K, eps) * K * Math.pow(C_INF, K) * s;
}
function lamBarA(x, K, eps) {
  const s = sqrtLamBarA(x, K, eps);
  return s * s;
}
// imp-95212 DR-M reference at the induced ratio (for the honest comparison)
function sqrtLamBarM(x, K, rho) {
  let s = 0;
  for (let b = 1; b <= KMAX; b++) {
    const e = Math.pow(2, b - 1) * x;
    if (e > 745) break;
    s += Math.pow(P_PARTIAL[b - 1], K) * Math.exp(-e);
  }
  return aIn(K, rho) * K * Math.pow(C_INF, K) * s;
}
// imp-95213 DR-R reference at the induced ratio (for the honest comparison)
const cFac = (q) => (q + 1) / (q - 1);
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
function sInShell(cp, i, K) {
  const end = cp.length - 1;
  return cp[Math.min(i, end)] * cp[Math.min(K - 1 - i, end)];
}
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
function bisectRoot(f) {
  let lo = 0.01;
  let hi = 400;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > Math.SQRT1_2) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const xStarA = (K, eps) => bisectRoot((x) => sqrtLamBarA(x, K, eps));
const xStarM = (K, rho) => bisectRoot((x) => sqrtLamBarM(x, K, rho));
const xStarRef = (K, rho) => bisectRoot((x) => sqrtLamRefBar(x, K, rho));
function cpACap(K, eps) {
  return X_STAR + Math.log(K) + (2 * K - 2) * Math.log(C_INF) + Math.log(aAr(K, eps));
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
function gammaSL(g) {
  const th = (KAPPA * KAPPA + 1 - 2 * Q_OD) / (g * KAPPA);
  const T = 4 + th * th;
  const om = 2 / (T * (1 + Math.sqrt(1 - 4 / T)));
  return hStarSL(om, g) / (2 * LW_EVEN);
}
// exact in-shell Cauchy row products (LEMMA AG cross-checks)
function exactRowProducts(nus) {
  const K = nus.length;
  const rows = [];
  for (let r = 0; r < K; r++) {
    let p = 1;
    for (let k = 0; k < K; k++) {
      if (k !== r) p *= (nus[r] + nus[k]) / Math.abs(nus[r] - nus[k]);
    }
    rows.push(p);
  }
  return rows;
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
export const IMP95214_ARITHMETIC_SEPARATION_PRICING = {
  ticket:
    "imp-95214 (sixth leg of the seam chain, delivering the arithmetic-separation pricing continuation named by the imp-95213 routing consequence for the open sub-gap imp-95212-subgap-fresnel-airy-envelope-port: a biorthogonal bound priced by the ADDITIVE separation an arithmetic (1/p) alias grid actually supplies, instead of the pairwise-ratio hypothesis that degenerates to rho -> 1 on such grids)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes LEMMA R1 / LEMMA BI / THEOREM DR (imp-95211), THEOREM DR-M / HL-M / COROLLARY CP (imp-95212), THEOREM DR-R / KU / COROLLARY CP-NS (imp-95213), THEOREM SL (imp-95210), THEOREM OV (imp-95209), THEOREM BU (imp-95208); carried constants imported from the sibling verdict objects; alias-grid arithmetic structure per imp-95071.",
  hypothesis:
    "H-DYA-A(m, d, K, eps), per parity: ordered shells S_1 < ... < S_n with |S_b| <= K; in-shell ADDITIVE chain nu_{i2} - nu_{i1} >= (i2 - i1) eps nu_0 with width nu_{k-1} <= 2 nu_0; lacunary shells min S_{b+1} >= 2 max S_b; min S_1 >= m; centers at depth >= d. K = 1 recovers H-DYA exactly; (ii-A) implies H-DYA-M at the induced ratio rho = 1 + eps/2. Occupancy cap LEMMA OC: (K-1) eps <= 1 is forced. Model-level formalization; NOT instantiated for the paper packets (named successor sub-gap).",
  lemmaAG:
    "Arithmetic-gap row product: under (ii-A) the in-shell Cauchy product of the rate at position i is <= (4/eps)^(k-1)/(i! (k-1-i)!) <= A_ar(K, eps) = (4/eps)^(K-1)/(floor((K-1)/2)! ceil((K-1)/2)!). Versus the flat-rho cap at the induced ratio, A_in(K, 1+eps/2)/A_ar(K, eps) >= floor((K-1)/2)! ceil((K-1)/2)! -- the arithmetic pricing gains at least the middle factorial.",
  theoremDRA:
    "Arithmetic-separation multiplicity pricing, n-uniform: under H-DYA-A(m, d, K, eps), sqrt(LamBarA) = A_ar K C_inf^K sum P_{b-1}^K e^(-2^(b-1) x) -- the THEOREM DR-M route verbatim with the in-shell beta cap replaced by LEMMA AG. K = 1 reduces exactly to THEOREM DR; pointwise strictly below DR-M at the induced ratio for K >= 2. H-LOC and the gammaOV -> gammaSL collapse follow for m d > xStarA(K, eps).",
  theoremLIN:
    "Linear-in-occupancy threshold law: A_ar(K, eps) <= (8e/((K-1) eps))^(K-1), so at full occupancy K_f = 1 + floor(1/eps) the per-rate in-shell amplification is bounded by the ABSOLUTE constant 8e/(1-eps) <= 16e, and with COROLLARY CP-A the threshold obeys xStarA(K_f, eps) <= xStar + ln K_f + (K_f - 1)(2 ln C_inf + ln 16e), slope 7.994466217181721 per rate. Along the arithmetic family the NG rho -> 1 divergences (A_in at fixed K, A* at K -> inf) never engage: occupancy caps K, and the additive price is linear there. The only remaining growth is the occupancy count itself.",
  lemmaPR:
    "Prime-block instantiation: rates 1/p for the primes in a dyadic block (P, 2P), P >= 3, satisfy (ii-A) with eps = 2/p_max (distinct odd primes at index distance t differ by >= 2t; p q < p_max^2) and width < 2. Instantiated on the 23 primes in (128, 256): the alias-grid-shaped rate set satisfies H-DYA-A(ii-A) natively -- the in-shell structure demanded by the extraction leg is supplied by the grid itself.",
  honestNegative:
    "Recorded skeptical negative: since (ii-A) implies H-DYA-M at rho = 1 + eps/2, THEOREM DR-R also applies, and on the full-occupancy family it is numerically SHARPER than DR-A (thresholds 17.26/33.46/66.20/132.01 vs 22.21/42.91/84.40/167.43 at K = 5/9/17/33; both linear in K). The certified family threshold is the min of the two. What DR-A adds is the closed-form finite constant, the closed-form CP-A cap, and the PROVED linear-in-occupancy law; DR-R linearity on this family is observed, not proved here.",
  constants: {
    linSlope: LIN_SLOPE,
    aArTable: A_AR_TABLE,
    xStarATable: X_STAR_A_TABLE,
    payoffTableA: PAYOFF_TABLE_A,
    primeBlock: PRIME_BLOCK,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, further narrowed: of the two admissible continuations named by imp-95213 (geometric regrouping / arithmetic-separation pricing), the arithmetic-separation pricing leg now EXISTS at model level (THEOREM DR-A + LEMMA PR: prime-block rate sets satisfy H-DYA-A natively with eps = 2/p_max). Remaining extraction obligations: the alias-denominator to dictionary-rate map (the Fresnel-Airy envelope port itself), INTER-shell lacunarity (iii) for the occupied shells (adjacent dyadic blocks of a single arithmetic progression touch at ratio ~ 1, so (iii) is NOT supplied by the grid), and the paper constants (m, d, per-shell occupancy).",
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c) of the sibling chain: the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "ARITHMETIC-SEPARATION PRICING DELIVERED (model level): LEMMA AG prices the additive separation the alias grid supplies (middle-factorial gain over the flat-rho cap), THEOREM DR-A carries it through the DR route, LEMMA PR instantiates (ii-A) on prime-block rate sets with eps = 2/p_max, and THEOREM LIN proves the full-occupancy threshold is LINEAR in occupancy (slope <= 2 ln C_inf + ln 16e = 7.9945/rate) -- the NG rho -> 1 boundary does not engage along the arithmetic family. HONEST LIMIT: DR-R at the induced ratio stays numerically sharper where both apply (min certified); inter-shell lacunarity (iii) and the Fresnel-Airy envelope port remain open extraction obligations; the bound is one-sided (prime-block worst row e^60.0 vs cap e^101.8); measured class sup phi = 0.3572 unchanged",
  ],
  isRigorous: true,
  rigorScope:
    "LEMMA AG, LEMMA OC, THEOREM DR-A, COROLLARY CP-A, THEOREM LIN and LEMMA PR are unconditional closed-form statements about multi-rate lacunary exponential sums on the half-line (LEMMA AG is elementary: numerators capped by the shell width, denominators by the additive chain; THEOREM DR-A is the imp-95212 route with one constant replaced; CP-A is the CP shift argument verbatim; LIN is Stirling plus CP-A; PR is a two-line computation with prime gaps >= 2). The conditional H-LOC consequence is exactly as THEOREM HL-M with the new constant. H-DYA-A itself is NOT instantiated for the paper packets -- LEMMA PR instantiates only the in-shell clause (ii-A) on prime-block SHAPED rate sets -- and every conditional statement names it. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step: the arithmetic-separation pricing leg named by the imp-95213 routing consequence is delivered at model level. LEMMA AG: on an additively separated shell (the structure an arithmetic (1/p) alias grid actually supplies, hypothesis H-DYA-A(ii-A)), the in-shell Cauchy row product is <= (4/eps)^(K-1)/(i!(K-1-i)!), beating the flat-rho cap at the induced ratio rho = 1 + eps/2 by at least the middle factorial (gain 5.10 / 736.8 / 2.08e9 / 5.62e26 at K = 5/9/17/33). THEOREM DR-A: the DR-M route verbatim with A_in -> A_ar gives sqrt(LamBarA) = A_ar K C_inf^K sum P_{b-1}^K e^(-2^(b-1) x); H-LOC for m d > xStarA(K, eps); K = 1 reduces exactly to THEOREM DR. LEMMA OC: occupancy and separation are linked, (K-1) eps <= 1. THEOREM LIN: at full occupancy the per-rate amplification is bounded by the ABSOLUTE constant 8e/(1-eps), so the threshold is LINEAR in occupancy (xStarA <= xStar + ln K_f + (K_f-1) 7.9945) -- the NG rho -> 1 coalescence divergence never engages along the arithmetic family; the only remaining growth is the occupancy count. LEMMA PR: prime-block rate sets 1/p satisfy (ii-A) natively with eps = 2/p_max (instantiated on the 23 primes in (128, 256): exact worst row 1.11e26 vs cap 1.63e44). HONEST NEGATIVE, recorded: DR-R at the induced ratio also applies and is numerically sharper on the full-occupancy family (132.01 vs 167.43 at K = 33; both linear); the certified threshold is the min -- DR-A contributes the closed form and the proved linearity, not the sharpest curve. HONEST: the Fresnel-Airy envelope port and paper extraction remain OPEN (sub-gap imp-95212-subgap-fresnel-airy-envelope-port carried, further narrowed); inter-shell lacunarity (iii) is an explicit remaining extraction obligation (NOT supplied by the grid); the bound is one-sided; model-family constants; gammaSL is a cap, not proved attained; measured class sup phi = 0.3572 untouched. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95214_ASP_ASSERTIONS = [
  {
    id: "imp95214-asp-k1-reduction-and-guards",
    description:
      "the K = 1 base case reproduces imp-95211 exactly (rel 1e-12): LamBarA(md; 1, eps) matches every sibling payoff row for arbitrary eps, the bisected xStarA(1, eps) matches xStar, the dyadic partial products reproduce cInf, the local DR-R transcription reproduces the imp-95213 baked xStarInf(1.5) (rel 1e-9), and the gammaSL chain reproduces the imp-95210 baked pair",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      if (!rel(P_PARTIAL[KMAX], C_INF)) return false;
      for (const row of DRL.constants.payoffTable) {
        if (!rel(lamBarA(row.md, 1, 0.5), row.lamBar)) return false;
        if (!rel(lamBarA(row.md, 1, 0.01), row.lamBar)) return false;
      }
      if (!rel(xStarA(1, 0.25), X_STAR)) return false;
      const guard = bisectRoot((x) => sqrtLamRefBar(x, 400, 1.5));
      if (!(Math.abs(guard - X_STAR_INF_15) <= 1e-9 * X_STAR_INF_15)) return false;
      return rel(gammaSL(SML.constants.gRef), SML.constants.gammaSLRef);
    },
  },
  {
    id: "imp95214-asp-lemma-ag-exact-rows",
    description:
      "LEMMA AG approached per row: on uniform arithmetic grids nu_i = 1 + i eps at (K, eps) up to (17, 1/16), every exact in-shell Cauchy row product is <= (4/eps)^(K-1)/(i!(K-1-i)!), and on the actual (128, 256) prime block the measured separation constant is >= 2/p_max = eps, hypothesis (ii-A) and the width clause hold, and the exact worst row (baked, rel 1e-12) is below the baked A_ar cap",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      for (const [K, eps] of [
        [3, 0.25],
        [5, 0.25],
        [9, 0.125],
        [17, 0.0625],
      ]) {
        const nus = [];
        for (let i = 0; i < K; i++) nus.push(1 + i * eps);
        const rows = exactRowProducts(nus);
        for (let r = 0; r < K; r++) {
          const rowBound = Math.pow(4 / eps, K - 1) / (fact(r) * fact(K - 1 - r));
          if (!(rows[r] <= rowBound)) return false;
        }
      }
      const nus = PRIME_BLOCK.primes.map((p) => 1 / p).sort((a, b) => a - b);
      const K = nus.length;
      if (K !== PRIME_BLOCK.K) return false;
      const nuMin = nus[0];
      if (!(nus[K - 1] <= 2 * nuMin)) return false;
      if (!rel(2 / 251, PRIME_BLOCK.epsPr)) return false;
      let epsHat = Infinity;
      for (let i = 0; i < K; i++) {
        for (let j = i + 1; j < K; j++) {
          const r = (nus[j] - nus[i]) / ((j - i) * nuMin);
          if (r < epsHat) epsHat = r;
        }
      }
      if (!rel(epsHat, PRIME_BLOCK.epsHatMeasured)) return false;
      if (!(epsHat >= PRIME_BLOCK.epsPr)) return false;
      if (!rel((K - 1) * PRIME_BLOCK.epsPr, PRIME_BLOCK.occupancy)) return false;
      const rows = exactRowProducts(nus);
      let worst = 0;
      let worstRow = -1;
      for (let r = 0; r < K; r++) {
        if (rows[r] > worst) {
          worst = rows[r];
          worstRow = r;
        }
      }
      if (worstRow !== PRIME_BLOCK.worstRowIndex) return false;
      if (!rel(worst, PRIME_BLOCK.exactWorstRow)) return false;
      if (!rel(aAr(K, PRIME_BLOCK.epsPr), PRIME_BLOCK.agCap)) return false;
      return worst <= PRIME_BLOCK.agCap;
    },
  },
  {
    id: "imp95214-asp-baked-literals-and-comparison",
    description:
      "baked literals reproduce from the defining formulas (rel 1e-12): the A_ar gain table (with gain >= the middle factorial at every row), the full-occupancy threshold table by bisection with the recorded ordering xStarRef(induced) < xStarA < xStarM(induced) on every row and a crossing guard at the largest row, and the (5, 1/4) payoff rows (LamBarA, theta^2, g, gammaSL, each gammaSL below gammaOV)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      if (!rel(2 * Math.log(C_INF) + Math.log(16 * Math.E), LIN_SLOPE)) return false;
      for (const row of A_AR_TABLE) {
        if (!rel(aAr(row.K, row.eps), row.aAr)) return false;
        if (!rel(aIn(row.K, 1 + row.eps / 2), row.aInInduced)) return false;
        if (!rel(row.aInInduced / row.aAr, row.gain)) return false;
        const n = row.K - 1;
        const midFact = fact(Math.floor(n / 2)) * fact(Math.ceil(n / 2));
        if (!(row.gain >= midFact)) return false;
      }
      for (const row of X_STAR_A_TABLE) {
        if (!(Math.abs((row.K - 1) * row.eps - 1) < 1e-12)) return false;
        if (!rel(xStarA(row.K, row.eps), row.xStarA)) return false;
        if (!rel(xStarM(row.K, 1 + row.eps / 2), row.xStarMInduced)) return false;
        if (!rel(xStarRef(row.K, 1 + row.eps / 2), row.xStarRefInduced)) return false;
        if (!(row.xStarRefInduced < row.xStarA && row.xStarA < row.xStarMInduced))
          return false;
      }
      const last = X_STAR_A_TABLE[X_STAR_A_TABLE.length - 1];
      if (!(sqrtLamBarA(last.xStarA - 0.01, last.K, last.eps) > Math.SQRT1_2))
        return false;
      if (!(sqrtLamBarA(last.xStarA + 0.01, last.K, last.eps) < Math.SQRT1_2))
        return false;
      for (const row of PAYOFF_TABLE_A) {
        const lam = lamBarA(row.md, 5, 0.25);
        if (!rel(lam, row.lamBarA)) return false;
        if (!rel(1 - lam, row.theta2)) return false;
        if (!rel(gFromLam(lam), row.g)) return false;
        if (!rel(gammaSL(row.g), row.gammaSL)) return false;
        if (!(row.gammaSL < GAMMA_OV)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95214-asp-lin-and-cpa-caps",
    description:
      "THEOREM LIN and COROLLARY CP-A: A_ar(K, 1/(K-1)) <= (8e/(1-eps))^(K-1) along the full-occupancy family up to K = 65 (absolute per-rate base), the bisected xStarA never exceeds the CP-A cap xStar + ln K + (2K-2) ln C_inf + ln A_ar on a (K, eps) grid, the full-occupancy threshold is below the linear cap xStar + ln K_f + (K_f - 1) linSlope, and DR-A is pointwise strictly below DR-M at the induced ratio for K >= 2",
    holds: () => {
      for (const K of [5, 9, 17, 33, 65]) {
        const eps = 1 / (K - 1);
        if (!(aAr(K, eps) <= Math.pow((8 * Math.E) / (1 - eps), K - 1))) return false;
      }
      for (const [K, eps] of [
        [1, 0.5],
        [2, 0.5],
        [3, 0.25],
        [5, 0.25],
        [9, 0.125],
        [17, 0.0625],
      ]) {
        if (!(xStarA(K, eps) <= cpACap(K, eps) + 1e-9)) return false;
      }
      for (const row of X_STAR_A_TABLE) {
        const linCap = X_STAR + Math.log(row.K) + (row.K - 1) * LIN_SLOPE;
        if (!(row.xStarA <= linCap)) return false;
      }
      for (const [K, eps] of [
        [2, 0.5],
        [3, 0.25],
        [5, 0.25],
        [9, 0.125],
      ]) {
        for (const x of [1, 3, 6, 9, 12, 20]) {
          if (!(sqrtLamBarA(x, K, eps) < sqrtLamBarM(x, K, 1 + eps / 2))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95214-asp-rayleigh-battery",
    description:
      "THEOREM DR-A: 3000 random Rayleigh quotients (a^T DGD a)/(a^T G a) over random H-DYA-A configurations (1..3 shells, up to 7 rates per shell at additive spacings >= eps nu_0 with random slack, in-shell width <= 2, lacunary shell jumps, random depths, signed coefficients) never exceed the finite-n bound (20000-draw offline run: no violation, worst ratio 0.0014626056020685411)",
    holds: () => {
      let seed = 424244;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 3000; t++) {
        const cfg = t % 2 === 0 ? { K: 2 + (t % 3), eps: 0.25 } : { K: 3 + 2 * (t % 3), eps: 0.125 };
        const { K, eps } = cfg;
        const n = 1 + Math.floor(rand() * 3);
        const mus = [];
        let base = Math.pow(10, -1 + 2 * rand());
        for (let b = 0; b < n; b++) {
          const kb = 1 + Math.floor(rand() * K);
          let mu = base;
          for (let i = 0; i < kb; i++) {
            mus.push(mu);
            if (i < kb - 1) mu += eps * base * (1 + rand() / 3);
          }
          base = mu * (2 + rand());
        }
        const m0 = mus[0];
        const d = (0.2 + 8 * rand()) / m0;
        const A = mus.map(() => 2 * rand() - 1);
        const num = quadForm(shiftedGram(mus, d), A);
        const den = quadForm(cauchyGram(mus), A);
        if (!(den > 0)) return false;
        const sb = sqrtLamAN(n, m0 * d, K, eps);
        if (!(num / den <= sb * sb * (1 + 1e-9))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95214-asp-honesty-gate",
    description:
      "the verdict delivers the arithmetic-separation leg without closing the sub-gap: names the carried sub-gap imp-95212-subgap-fresnel-airy-envelope-port as open, the recorded DR-R honest negative, the inter-shell lacunarity obligation, the one-sided bound; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95214_ARITHMETIC_SEPARATION_PRICING.promotesBound === false &&
      IMP95214_ARITHMETIC_SEPARATION_PRICING.openResiduals.length === 5 &&
      /NO QED/.test(IMP95214_ARITHMETIC_SEPARATION_PRICING.verdict) &&
      /refereed bound is changed/i.test(IMP95214_ARITHMETIC_SEPARATION_PRICING.verdict) &&
      /Floors and ceilings untouched/.test(
        IMP95214_ARITHMETIC_SEPARATION_PRICING.verdict,
      ) &&
      /remain OPEN/.test(IMP95214_ARITHMETIC_SEPARATION_PRICING.verdict) &&
      /HONEST NEGATIVE/.test(IMP95214_ARITHMETIC_SEPARATION_PRICING.verdict) &&
      /STILL OPEN/.test(IMP95214_ARITHMETIC_SEPARATION_PRICING.subGap) &&
      /fresnel-airy-envelope-port/.test(
        IMP95214_ARITHMETIC_SEPARATION_PRICING.subGap,
      ) &&
      /lacunarity/.test(IMP95214_ARITHMETIC_SEPARATION_PRICING.subGap) &&
      /ARITHMETIC-SEPARATION PRICING DELIVERED/.test(
        IMP95214_ARITHMETIC_SEPARATION_PRICING.openResiduals[4],
      ) &&
      /HONEST LIMIT/.test(IMP95214_ARITHMETIC_SEPARATION_PRICING.openResiduals[4]) &&
      /0\.3572/.test(IMP95214_ARITHMETIC_SEPARATION_PRICING.verdict) &&
      /NOT instantiated for the paper packets/.test(
        IMP95214_ARITHMETIC_SEPARATION_PRICING.rigorScope,
      ) &&
      /SHARPER/.test(IMP95214_ARITHMETIC_SEPARATION_PRICING.honestNegative),
  },
];

for (const a of IMP95214_ASP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95214-arithmetic-separation-pricing assertion failed: ${a.id}`);
  }
}

export default IMP95214_ARITHMETIC_SEPARATION_PRICING;
