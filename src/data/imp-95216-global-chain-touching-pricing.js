/**
 * imp-95216: THEOREM GC (global geometric-chain pricing: touching shells
 * with a ratio floor) + THEOREM HL-G (H-LOC from H-GEO with the explicit
 * threshold xStarGeo(rho)) + PROP MON (threshold monotone in the floor;
 * sharper than dyadic for floors above 2) + PROP FENCE (the priced class
 * sits strictly inside the LEMMA CV admissible remaining freedom and
 * carries an m-free Szasz certificate) + PROP NG-DIV (the threshold
 * diverges as rho tends to 1, with an explicit lower bound -- the LEMMA NG
 * coalescence boundary seen from the positive side).
 *
 * Eighth leg of the seam chain, approaching the open sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port at its obligation (iii)
 * fence. imp-95215 (THEOREM SZ) fenced obligation (iii) two-sidedly:
 * NECESSARY, a Szasz-summability certificate; ADMISSIBLE remaining
 * freedom, "ascending shells with bounded occupancy, even touching"
 * (LEMMA CV -- no DR-family theorem closes them, because every DR
 * hypothesis requires LACUNARY shells: min of the next shell at least
 * twice the max of the previous). THIS MODULE prices part of that
 * freedom: a single global geometric chain with consecutive-ratio floor
 * rho > 1 needs NO shell structure at all. For rho < 2 such a chain
 * admits no lacunary-shell partition whatsoever (every consecutive ratio
 * is below 2, so no cut can open a factor-2 gap), hence lies OUTSIDE
 * H-DYA, H-DYA-M(K, rho), the DR-R refinement and H-DYA-A for every
 * parameter choice -- it is an ascending TOUCHING family in the exact
 * sense of the imp-95215 honest non-kill, with octave occupancy at most
 * floor(ln 2/ln rho) + 1.
 *
 * HYPOTHESIS H-GEO(m, d, rho) -- per parity: the parity sum is a (finite,
 * or L2-limit of finite) combination of packets a_j e^(-mu_j|t-c_j|)
 * whose distinct rates, sorted increasingly mu_1 < ... < mu_n, satisfy
 * mu_1 >= m and mu_{k+1} >= rho mu_k for a fixed rho > 1, and whose
 * centers all sit at depth >= d on the parity's own side of the seam.
 * n and the per-rate packet counts are arbitrary. No shells, no
 * lacunarity: the only structural input is the global ratio floor.
 * Chaining gives the two consequences the proof uses: mu_r >= rho^(r-1) m
 * and mu_s/mu_r >= rho^(s-r) for s > r.
 *
 * THEOREM GC (geometric-chain shift damping, n-uniform). Let f(s) =
 * sum_{r=1}^n A_r e^(-mu_r s) with mu_1 >= m, mu_{r+1} >= rho mu_r.
 * Define c(q) = (q + 1)/(q - 1), Q_0 = 1, Q_j(rho) = prod_{l=1}^{j}
 * c(rho^l), C_geo(rho) = lim_j Q_j (convergent for every rho > 1:
 * ln c(rho^l) <= 2/(rho^l - 1), a summable geometric-type tail). Then
 * for every x = m d > 0,
 *   integral_d^inf f^2 <= LamGeoN(n, x) integral_0^inf f^2 ,
 *   sqrt(LamGeoN(n, x)) = sum_{r=1}^n Q_{r-1} Q_{n-r} e^(-rho^(r-1) x) ,
 * and n-uniformly
 *   integral_d^inf f^2 <= LamGeoBar(x; rho) integral_0^inf f^2 ,
 *   sqrt(LamGeoBar(x; rho)) = C_geo(rho) sum_{r>=1} Q_{r-1} e^(-rho^(r-1) x)
 * (the series converges for every x > 0: the Q factors are bounded by
 * C_geo and the exponents rho^(r-1) x grow geometrically).
 * PROOF: the imp-95211 THEOREM DR proof verbatim with 2 replaced by rho
 * at its only two uses of the rate hypothesis. sqrt(integral_d^inf f^2)
 * <= sum_r |A_r| e^(-mu_r d) (2 mu_r)^(-1/2) <= ||f|| sum_r beta_r
 * e^(-mu_r d) by LEMMA BI of imp-95211 (the Cauchy biorthogonal bound,
 * which is rate-structure agnostic). Use (i): mu_r >= rho^(r-1) m gives
 * e^(-mu_r d) <= e^(-rho^(r-1) x). Use (ii): each factor of beta_r is
 * c(q) at a ratio q = mu_max/mu_min >= rho^|r-k|, and c is decreasing,
 * so beta_r <= Q_{r-1} Q_{n-r} <= C_geo Q_{r-1}. QED. LEMMA R1 of
 * imp-95211 (rank-one collapse of same-rate packets beyond the collar)
 * is likewise rate-structure agnostic, so the parity sum on the wrong
 * side lies in the exponential span and the theorem applies to it.
 * EXACT REDUCTION: at rho = 2, c(2^l) are the dyadic factors, Q_j = P_j,
 * C_geo(2) = C_inf = 8.255987935778247, LamGeoBar(x; 2) = LamBar(x),
 * and the threshold below equals xStar = 2.651017799014494 -- THEOREM DR
 * is the rho = 2 special case.
 *
 * THEOREM HL-G (H-LOC from H-GEO). LamGeoBar(.; rho) is strictly
 * decreasing with limit 0, so it crosses 1/2 at a unique xStarGeo(rho);
 * under H-GEO(m, d, rho) with x = m d > xStarGeo(rho), both parities
 * localize with thetaE^2 = thetaO^2 = 1 - LamGeoBar(x; rho) > 1/2, the
 * imp-95210 gate holds, THEOREM SL gives g = 2 sqrt(LamGeoBar (1 -
 * LamGeoBar)) and COROLLARY GC-SL instantiates gammaSL(g). Proof as in
 * imp-95211 THEOREM HL with LamBar replaced by LamGeoBar.
 *
 * PROP MON (monotone in the floor). Every factor c(rho^l) and every
 * damping term e^(-rho^(r-1) x) (r >= 2) is strictly decreasing in rho,
 * so LamGeoBar(x; rho) is strictly decreasing in rho and xStarGeo is
 * strictly decreasing: a stronger separation floor buys a shallower
 * collar. In particular xStarGeo(3) = 1.4738 and xStarGeo(4) = 1.0863
 * sit BELOW the dyadic 2.6510: if the extracted dictionary ratio exceeds
 * 2, THEOREM GC strictly sharpens THEOREM DR on its own turf.
 *
 * PROP FENCE (position inside the imp-95215 fence). (a) The exact chain
 * mu_k = m rho^(k-1) with rho < 2 has every consecutive ratio equal to
 * rho < 2, so NO partition into consecutive runs produces a factor-2
 * inter-run gap: the family satisfies no H-DYA-type lacunary hypothesis,
 * yet satisfies H-GEO -- THEOREM GC is the first positive theorem
 * strictly inside the touching class. (b) Octave occupancy is bounded:
 * at most floor(ln 2/ln rho) + 1 rates in any [y, 2y). (c) m-free Szasz
 * certificate: S = sum_k mu_k/(1 + mu_k^2) <= sum_k min(mu_k, 1/mu_k)
 * <= 2 rho/(rho - 1), because the rates below 1 are dominated by a
 * geometric sequence descending from at most 1 (sum <= rho/(rho - 1))
 * and the reciprocals of the rates above 1 by one descending from at
 * most 1 likewise. So every H-GEO family meets the THEOREM SZ necessary
 * condition with an explicit constant -- necessity and sufficiency-with-
 * floor are consistent, and both constants degrade as rho tends to 1.
 *
 * PROP NG-DIV (the coalescence boundary from the positive side). For
 * every l >= 1 with rho^l <= 2, c(rho^l) >= c(2) = 3, and there are
 * floor(ln 2/ln rho) such l, so C_geo(rho) >= 3^floor(ln 2/ln rho).
 * Since sqrt(LamGeoBar(x)) >= C_geo e^(-x) (the r = 1 term alone),
 * LamGeoBar(x) > 1/2 whenever x < ln C_geo + ln sqrt(2), hence
 *   xStarGeo(rho) >= ln C_geo(rho) + ln sqrt(2)
 *                >= floor(ln 2/ln rho) ln 3 + ln sqrt(2) -> infinity
 * as rho -> 1+. The LEMMA NG coalescence no-go is thereby matched
 * quantitatively: the ratio floor is the exact price of admission, and
 * the un-floored bounded-occupancy touching class (cross-pair ratios
 * approaching 1) remains OPEN on both sides.
 *
 * PAYOFF TABLE (exact evaluations; collapse from gammaOV =
 * 0.9995949885454457), rho = 1.5 (a genuinely touching chain, octave
 * occupancy 2, no DR theorem applies):
 *   x = m d = 6:  LamGeoBar = 0.060389720030239555, gammaSL = 0.6134305588351918
 *   x = m d = 8:  LamGeoBar = 0.0008361566686768065, gammaSL = 0.5016702617900488
 *   x = m d = 10: LamGeoBar = 0.000013719918473672188, gammaSL = 0.5000274287711858
 * Threshold ladder: xStarGeo = 25.2359/12.5368/8.3597/5.0660/2.6510/
 * 1.4738/1.0863 at rho = 1.1/1.2/1.3/1.5/2/3/4.
 *
 * RELATION TO THEOREM KU (imp-95213): xStarGeo(1.5) = 5.0660 <
 * xStarInf(1.5) = 10.89000440771252 is a CROSS-CLASS comparison, not a
 * refinement -- KU prices lacunary shells each carrying an unboundedly
 * occupied in-shell rho-chain, while GC prices ONE global chain whose
 * r-th rate has floor rho^(r-1) m; the GC family is thinner, its bound
 * correspondingly smaller. Neither theorem implies the other.
 *
 * HONEST LIMITS. (a) One-sided: whether the TRUE touching-class sup
 * clears 1/2 for some m d < xStarGeo(rho) is open; the canonical
 * honesty row (exact 1.5-chain, n = 4, m d = 6) has true ratio
 * 0.002681200376349462 against the bound 0.060389720030239555, a 22.5x
 * slack. (b) Exact-rate structure is load-bearing: rate bands of
 * nonempty interior per position reopen the LEMMA NG mechanism in the
 * closure, exactly as recorded for H-DYA. (c) The threshold is
 * expensive near the boundary: at rho = 1.2 the collar must satisfy
 * m d > 12.54 versus the dyadic 2.65 -- a weak floor buys little.
 * (d) NOT instantiated for the paper packets; whether the ported
 * per-parity families carry a global ratio floor (rather than only
 * in-shell separation with near-touching seam pairs) is precisely part
 * of the open extraction. (e) Obligation (iii) is NOT closed: the
 * bounded-occupancy touching class WITHOUT a ratio floor stays open
 * (its Szasz sum converges, THEOREM SZ does not eliminate it; no GC-type
 * bound prices it -- the NG corner). (f) Model-family constants
 * (sigma = 1, theta = 10) throughout; gammaSL remains a cap, not a
 * measurement; measured class sup phi = 0.3572 untouched.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) Proof audit: the DR proof uses the
 * rate hypothesis at exactly two points (damping floor, pairwise-ratio
 * floor); both are re-derived from the chain hypothesis by induction;
 * LEMMA BI and LEMMA R1 are checked to be rate-structure agnostic (no
 * other step touches the rates). (2) Exact reduction stress-tested: C_geo(2)
 * reproduces C_inf to rel 0 and the bisected xStarGeo(2) reproduces
 * xStar to rel 3.4e-16. (3) 3000-draw random battery (chains with
 * ratios >= rho but NOT exact, random m, n <= 6, random depths spanning
 * vacuous and biting regions): true Rayleigh ratio (exact Cauchy Gram
 * pair, power iteration) never exceeds min(1, LamGeoBar); where the
 * bound is non-vacuous the worst true/bound is 0.549 -- no violation,
 * comfortable one-sided margin; the near-1 ratios all sit in the
 * clipped vacuous region. (4) Vacuity at the NG witness: at its depth
 * m d = 0.3 and ratio 1.2, LamGeoBar(0.3; 1.2) = 3.3e18, vacuous --
 * no contradiction with the coalescence no-go. (5) Monotonicity of
 * LamGeoBar in x and in rho verified on grids; the divergence lower
 * bound ln C_geo + ln sqrt(2) < xStarGeo verified on every ladder row.
 * (6) The gammaSL chain is cross-checked against the imp-95210 baked
 * pair and the imp-95211 payoff rows (transcription guard).
 *
 * The numerics below CROSS-CHECK the theorem statements; they are not
 * the claim. Import-light (no heavy bundle; imports only sibling verdict
 * modules for carried constants). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
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
// threshold ladder: unique root of LamGeoBar(x; rho) = 1/2, with C_geo(rho)
const X_STAR_GEO_TABLE = [
  { rho: 1.1, cGeo: 15241620259.878601, xStarGeo: 25.23592699973279 },
  { rho: 1.2, cGeo: 90829.06711162877, xStarGeo: 12.536831697554227 },
  { rho: 1.3, cGeo: 1754.5423821154754, xStarGeo: 8.35968094556532 },
  { rho: 1.5, cGeo: 78.9241705724922, xStarGeo: 5.065971281856134 },
  { rho: 2, cGeo: 8.255987935778247, xStarGeo: 2.651017799014495 },
  { rho: 3, cGeo: 2.7938960177610492, xStarGeo: 1.4738089210162268 },
  { rho: 4, cGeo: 1.9692603536682693, xStarGeo: 1.0863128363435575 },
];
// payoff rows at rho = 1.5 (touching chain, outside every DR hypothesis)
const PAYOFF_TABLE_G = [
  {
    md: 6,
    lamGeoBar: 0.060389720030239555,
    theta2: 0.9396102799697604,
    g: 0.476414952514754,
    gammaSL: 0.6134305588351918,
  },
  {
    md: 8,
    lamGeoBar: 0.0008361566686768065,
    theta2: 0.9991638433313232,
    g: 0.05780856374975023,
    gammaSL: 0.5016702617900488,
  },
  {
    md: 10,
    lamGeoBar: 0.000013719918473672188,
    theta2: 0.9999862800815263,
    g: 0.007408030841595967,
    gammaSL: 0.5000274287711858,
  },
];
// canonical honesty row: exact 1.5-chain, n = 4, m = 1, d = 6
const TRUE_LAM_CANON = 0.002681200376349462;
const BOUND_LAM_CANON = 0.060389720030239555;
// sampled Szasz sums on exact chains crossing mu = 1 (m = 0.05), vs 2rho/(rho-1)
const SZASZ_ROWS = [
  { rho: 1.2, s: 8.365698666695264, cert: 12.000000000000002 },
  { rho: 1.5, s: 3.7741130033763834, cert: 6 },
  { rho: 2, s: 2.2161953255789704, cert: 4 },
];

// ── theorem functionals ──────────────────────────────────────────────────────
const cFac = (q) => (q + 1) / (q - 1);
// chain partial products Q_j(rho) = prod_{l=1}^{j} c(rho^l); last entry ~ C_geo
function chainPartials(rho) {
  const Q = [1];
  let q = rho;
  for (let l = 1; l <= 8000; l++) {
    const f = cFac(q);
    Q.push(Q[l - 1] * f);
    if (f - 1 < 1e-17) break;
    q *= rho;
    if (q > 1e18) break;
  }
  return Q;
}
function cGeo(rho) {
  const Q = chainPartials(rho);
  return Q[Q.length - 1];
}
function sqrtLamGeoBar(x, rho) {
  const Q = chainPartials(rho);
  const C = Q[Q.length - 1];
  let s = 0;
  let e = x; // rho^(r-1) x
  for (let r = 1; r <= 4000; r++) {
    if (e > 745) break;
    s += Q[Math.min(r - 1, Q.length - 1)] * Math.exp(-e);
    e *= rho;
  }
  return C * s;
}
function lamGeoBar(x, rho) {
  const s = sqrtLamGeoBar(x, rho);
  return s * s;
}
function sqrtLamGeoN(n, x, rho) {
  const Q = chainPartials(rho);
  const top = Q.length - 1;
  let s = 0;
  let e = x;
  for (let r = 1; r <= n; r++) {
    if (e > 745) break;
    s += Q[Math.min(r - 1, top)] * Q[Math.min(n - r, top)] * Math.exp(-e);
    e *= rho;
  }
  return s;
}
function xStarGeo(rho) {
  let lo = 1e-6;
  let hi = 200;
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (lamGeoBar(mid, rho) > 0.5) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
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
function gFromLam(lam) {
  return 2 * Math.sqrt(lam * (1 - lam));
}
// small dense linear algebra for the exact-Gram cross-checks
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
const matVec = (A, x) => A.map((row) => row.reduce((s, v, j) => s + v * x[j], 0));
const quadForm = (A, x) => x.reduce((s, xi, i) => s + xi * matVec(A, x)[i], 0);
function trueLambdaMax(mus, d) {
  const G = mus.map((a) => mus.map((b) => 1 / (a + b)));
  const H = mus.map((a) => mus.map((b) => Math.exp(-(a + b) * d) / (a + b)));
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
export const IMP95216_GLOBAL_CHAIN_TOUCHING_PRICING = {
  ticket:
    "imp-95216 (eighth leg of the seam chain: the LEMMA CV admissible remaining freedom of obligation (iii) -- ascending touching families -- is PRICED under a global consecutive-ratio floor rho > 1, with no shell structure, via THEOREM GC; the ratio floor is shown to be the exact price of admission by the PROP NG-DIV divergence matching LEMMA NG)",
  hypothesis:
    "H-GEO(m, d, rho), per parity: the parity sum is a finite combination (or L2 limit of such) of two-sided exponential packets whose distinct sorted rates satisfy mu_1 >= m and mu_{k+1} >= rho mu_k for a fixed rho > 1, with every center at depth >= d on the parity's own side of the seam. No shells, no lacunarity; for rho < 2 the exact chain admits NO lacunary-shell partition and is outside every prior DR-family hypothesis.",
  theoremGC:
    "n-uniform cross-seam bound sqrt(LamGeoBar(x; rho)) = C_geo(rho) sum_{r>=1} Q_{r-1}(rho) e^(-rho^(r-1) x) with Q_j = prod_{l=1}^{j} (rho^l + 1)/(rho^l - 1) and C_geo = lim Q_j; proof is the imp-95211 THEOREM DR proof verbatim with 2 replaced by rho at its only two uses of the rate hypothesis; exact reduction at rho = 2 to LamBar and xStar.",
  theoremHLG:
    "H-LOC from H-GEO: for m d > xStarGeo(rho) (unique root of LamGeoBar = 1/2) both parities localize, the imp-95210 gate holds, and gammaSL instantiates. Ladder: xStarGeo = 25.2359/12.5368/8.3597/5.0660/2.6510/1.4738/1.0863 at rho = 1.1/1.2/1.3/1.5/2/3/4; payoff at rho = 1.5, m d = 6/8/10: gammaSL = 0.6134305588351918/0.5016702617900488/0.5000274287711858 vs gammaOV = 0.9995949885454457.",
  propMON:
    "LamGeoBar strictly decreasing in rho (every Cauchy factor and every damping term is), so xStarGeo strictly decreasing: xStarGeo(3) = 1.4738 and xStarGeo(4) = 1.0863 sit below the dyadic xStar = 2.6510 -- for extracted ratios above 2, THEOREM GC strictly sharpens THEOREM DR.",
  propFENCE:
    "The priced class sits strictly inside the imp-95215 fence: exact rho-chains with rho < 2 are ascending TOUCHING families (no lacunary partition exists), octave occupancy <= floor(ln 2/ln rho) + 1, and every H-GEO family carries the m-free Szasz certificate S <= 2 rho/(rho - 1) (split at mu = 1, two geometric dominations) -- the THEOREM SZ necessary condition is met with an explicit constant.",
  propNGDIV:
    "C_geo(rho) >= 3^floor(ln 2/ln rho) and xStarGeo(rho) >= ln C_geo(rho) + ln sqrt(2), so the threshold diverges as rho -> 1+: the LEMMA NG coalescence no-go is matched quantitatively from the positive side; the un-floored bounded-occupancy touching class remains open on both sides.",
  constants: {
    xStarGeoTable: X_STAR_GEO_TABLE,
    payoffTableG: PAYOFF_TABLE_G,
    trueLamCanon: TRUE_LAM_CANON,
    boundLamCanon: BOUND_LAM_CANON,
    szaszRows: SZASZ_ROWS,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, further narrowed: obligation (iii) now has TWO admissible discharge certificates, (A) lacunary shells (the DR / DR-M / DR-R / DR-A family, thresholds per imp-95211..95214) or (B) a global consecutive-ratio floor rho > 1 with NO shell structure (THEOREM GC, threshold xStarGeo(rho)); both imply the THEOREM SZ Szasz-summability necessity with explicit constants. Residual unpriced freedom: bounded-occupancy touching families WITHOUT a ratio floor (cross-pair ratios approaching 1 -- the LEMMA NG coalescence corner), open on both sides. Remaining extraction obligations unchanged: the alias-denominator to dictionary-rate map, the per-parity certificate for the ported family (now in either form A or B), and the paper constants (m, d, and the shell data or the ratio floor).",
  verdict:
    "TOUCHING-CLASS PRICING DELIVERED (model level): THEOREM GC prices ascending touching families under a global ratio floor rho > 1 -- the first positive theorem strictly inside the LEMMA CV admissible remaining freedom -- with exact dyadic reduction at rho = 2, a strictly monotone threshold ladder, an m-free Szasz certificate S <= 2 rho/(rho - 1), and a proved threshold divergence as rho -> 1+ matching LEMMA NG. HONEST LIMITS: one-sided bound (22.5x slack at the canonical honesty row); exact-rate structure load-bearing (bands reopen NG); expensive near the boundary (xStarGeo(1.2) = 12.54); NOT instantiated for the paper packets; obligation (iii) not closed -- the un-floored touching class survives; measured class sup phi = 0.3572 unchanged.",
  rigorScope:
    "THEOREM GC and THEOREM HL-G are unconditional model-level theorems: the proof is the imp-95211 proof with the two rate-hypothesis substitutions re-derived from the chain hypothesis by induction; LEMMA BI and LEMMA R1 are rate-structure agnostic and imported as proved. PROP MON, PROP FENCE and PROP NG-DIV are elementary and self-contained (monotonicity of (q+1)/(q-1), geometric dominations, the r = 1 term bound). The xStarInf comparison is cross-class and carries no implication either way. Nothing here instantiates the paper packets; the numerics cross-check the statements and are not the claim.",
};

// ── assertions (self-executing; import-light; THROW on violation) ────────────
export const IMP95216_GCT_ASSERTIONS = [
  {
    id: "imp95216-gct-dyadic-reduction",
    description:
      "exact reduction at rho = 2 (rel 1e-12): C_geo(2) reproduces the imported C_inf, the bisected xStarGeo(2) reproduces the imported xStar, LamGeoBar(md; 2) matches every imp-95211 payoff row, and the gammaSL chain reproduces the imp-95210 baked pair",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const relB = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      if (!rel(cGeo(2), C_INF)) return false;
      if (!relB(xStarGeo(2), X_STAR, 1e-9)) return false;
      for (const row of DRL.constants.payoffTable) {
        if (!rel(lamGeoBar(row.md, 2), row.lamBar)) return false;
        if (!rel(gammaSL(gFromLam(lamGeoBar(row.md, 2))), row.gammaSL)) return false;
      }
      return rel(gammaSL(SML.constants.gRef), SML.constants.gammaSLRef);
    },
  },
  {
    id: "imp95216-gct-threshold-ladder",
    description:
      "the baked (rho, C_geo, xStarGeo) ladder reproduces from the defining products and bisection (rel 1e-9), is strictly decreasing in rho in both columns, and every row satisfies the PROP NG-DIV lower bounds C_geo >= 3^floor(ln2/ln rho) and xStarGeo >= ln C_geo + ln sqrt(2)",
    holds: () => {
      const relB = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      let prevC = Infinity;
      let prevX = Infinity;
      for (const row of X_STAR_GEO_TABLE) {
        const C = cGeo(row.rho);
        const xs = xStarGeo(row.rho);
        if (!relB(C, row.cGeo, 1e-9)) return false;
        if (!relB(xs, row.xStarGeo, 1e-9)) return false;
        if (!(C < prevC && xs < prevX)) return false;
        prevC = C;
        prevX = xs;
        const L = Math.floor(Math.log(2) / Math.log(row.rho));
        if (!(C >= Math.pow(3, L))) return false;
        if (!(xs >= Math.log(C) + 0.5 * Math.log(2))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95216-gct-payoff-rows",
    description:
      "the rho = 1.5 payoff rows (LamGeoBar, theta^2, g, gammaSL at m d = 6/8/10) reproduce rel 1e-9, each gammaSL sits strictly below gammaOV, and m d = 6/8/10 all exceed the baked xStarGeo(1.5) so THEOREM HL-G bites",
    holds: () => {
      const relB = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const xs = X_STAR_GEO_TABLE.find((r) => r.rho === 1.5).xStarGeo;
      for (const row of PAYOFF_TABLE_G) {
        const lam = lamGeoBar(row.md, 1.5);
        if (!relB(lam, row.lamGeoBar, 1e-9)) return false;
        if (!relB(1 - lam, row.theta2, 1e-9)) return false;
        const g = gFromLam(lam);
        if (!relB(g, row.g, 1e-9)) return false;
        if (!relB(gammaSL(g), row.gammaSL, 1e-9)) return false;
        if (!(row.gammaSL < GAMMA_OV)) return false;
        if (!(row.md > xs)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95216-gct-true-vs-bound-battery",
    description:
      "skeptical cross-check on exact Cauchy Gram pairs (closed-form integrals, power iteration): 800 seeded random chains with consecutive ratios >= rho (not exact chains), random m and depth -- the true wrong-side Rayleigh ratio never exceeds min(1, LamGeoBar(m d; rho)); the canonical honesty row (exact 1.5-chain, n = 4, m d = 6) reproduces true 0.002681 vs bound 0.060390",
    holds: () => {
      const relB = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const mus4 = [1, 1.5, 2.25, 3.375];
      const tru = trueLambdaMax(mus4, 6);
      if (!relB(tru, TRUE_LAM_CANON, 1e-6)) return false;
      if (!relB(lamGeoBar(6, 1.5), BOUND_LAM_CANON, 1e-9)) return false;
      if (!(tru < BOUND_LAM_CANON)) return false;
      let seed = 123456789;
      const rand = () => {
        seed = (1103515245 * seed + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 800; t++) {
        const rho = 1.15 + 1.5 * rand();
        const n = 2 + Math.floor(rand() * 5);
        const m = 0.3 + 2 * rand();
        const mus = [m * (1 + rand())];
        for (let k = 1; k < n; k++) mus.push(mus[k - 1] * (rho + rand() * 1.2));
        const d = (0.5 + 8 * rand()) / m;
        const bnd = Math.min(1, lamGeoBar(m * d, rho));
        if (trueLambdaMax(mus, d) > bnd + 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: "imp95216-gct-fence-and-szasz",
    description:
      "PROP FENCE cross-checks: the exact rho < 2 chains have every consecutive ratio below 2 (no lacunary partition -- outside every DR hypothesis) and octave occupancy <= floor(ln2/ln rho) + 1; the sampled Szasz sums (m = 0.05 chains crossing mu = 1) reproduce rel 1e-9 and sit below the m-free certificate 2 rho/(rho - 1)",
    holds: () => {
      const relB = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      for (const rho of [1.1, 1.2, 1.3, 1.5]) {
        const mus = [];
        let mu = 0.7;
        for (let k = 0; k < 40; k++) {
          mus.push(mu);
          mu *= rho;
        }
        for (let k = 1; k < mus.length; k++) {
          if (!(mus[k] / mus[k - 1] < 2)) return false;
        }
        const occCap = Math.floor(Math.log(2) / Math.log(rho)) + 1;
        for (let j = -2; j < 20; j++) {
          const lo = 0.7 * Math.pow(2, j);
          const cnt = mus.filter((v) => v >= lo && v < 2 * lo).length;
          if (!(cnt <= occCap)) return false;
        }
      }
      for (const row of SZASZ_ROWS) {
        let s = 0;
        let mu = 0.05;
        for (let k = 0; k < 500 && mu < 1e12; k++) {
          s += mu / (1 + mu * mu);
          mu *= row.rho;
        }
        if (!relB(s, row.s, 1e-9)) return false;
        if (!(s <= (2 * row.rho) / (row.rho - 1))) return false;
        if (!relB((2 * row.rho) / (row.rho - 1), row.cert, 1e-12)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95216-gct-ng-vacuity-and-monotone",
    description:
      "consistency with LEMMA NG: at the NG witness depth (m d = 0.3, ratio 1.2) the bound is vacuous (LamGeoBar > 1); LamGeoBar is strictly decreasing in x (grid, four rho values) and strictly decreasing in rho (grid, three depths); the n-truncated LamGeoN never exceeds LamGeoBar; the cross-class note holds numerically (xStarGeo(1.5) < xStarInf(1.5))",
    holds: () => {
      if (!(lamGeoBar(0.3, 1.2) > 1)) return false;
      for (const rho of [1.2, 1.5, 2, 3]) {
        let prev = Infinity;
        for (let x = 0.5; x <= 12; x += 0.25) {
          const v = lamGeoBar(x, rho);
          if (!(v < prev)) return false;
          prev = v;
        }
      }
      for (const x of [3, 5, 8]) {
        let prev = Infinity;
        for (const rho of [1.2, 1.3, 1.5, 2, 3, 4]) {
          const v = lamGeoBar(x, rho);
          if (!(v < prev)) return false;
          prev = v;
        }
      }
      for (const n of [2, 4, 8]) {
        for (const x of [3, 6]) {
          const a = sqrtLamGeoN(n, x, 1.5);
          if (!(a <= sqrtLamGeoBar(x, 1.5) + 1e-15)) return false;
        }
      }
      const xs15 = X_STAR_GEO_TABLE.find((r) => r.rho === 1.5).xStarGeo;
      return xs15 < X_STAR_INF_15;
    },
  },
  {
    id: "imp95216-gct-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap named STILL OPEN with the two-certificate discharge and the un-floored residual, the one-sided caveat and 22.5x honesty slack, the non-instantiation caveat, the NG divergence, and no QED",
    holds: () =>
      /STILL OPEN/.test(IMP95216_GLOBAL_CHAIN_TOUCHING_PRICING.subGap) &&
      /WITHOUT a ratio floor/.test(IMP95216_GLOBAL_CHAIN_TOUCHING_PRICING.subGap) &&
      /NOT instantiated for the paper packets/.test(
        IMP95216_GLOBAL_CHAIN_TOUCHING_PRICING.verdict,
      ) &&
      /one-sided/.test(IMP95216_GLOBAL_CHAIN_TOUCHING_PRICING.verdict) &&
      /0\.3572/.test(IMP95216_GLOBAL_CHAIN_TOUCHING_PRICING.verdict) &&
      /rho -> 1\+/.test(IMP95216_GLOBAL_CHAIN_TOUCHING_PRICING.propNGDIV) &&
      /cross-class/.test(IMP95216_GLOBAL_CHAIN_TOUCHING_PRICING.rigorScope) &&
      TRUE_LAM_CANON < BOUND_LAM_CANON,
  },
];

for (const a of IMP95216_GCT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95216-global-chain-touching-pricing assertion failed: ${a.id}`);
  }
}

export default IMP95216_GLOBAL_CHAIN_TOUCHING_PRICING;
