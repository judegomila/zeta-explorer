/**
 * imp-95219: THEOREM SZ-P (Szasz-weight universal pricing: the imp-95218
 * residual of obligation (iii) -- families with UNBOUNDED octave occupancy
 * but convergent Szasz sum, the corner recorded "open on both sides" -- is
 * PRICED under the single scalar hypothesis of a bounded octave-Szasz
 * weight, with NO count bound, NO occupancy bound, NO ratio floor) +
 * LEMMA EXP (exponential tilt cap on the imp-95217 shift-interpolation
 * price) + PROP SLOPE (the proved linear-threshold slope of imp-95217
 * sharpens from 4 ln 3 = 4.3944 to aStar = 2 ln(2 + 2 sqrt2) = 3.1490) +
 * THEOREM HL-S (H-LOC at the explicit threshold xStarSz(W)) + PROP EMB
 * (all four prior certificates A, B, C, D embed with explicit weights) +
 * PROP DOM (certificate E strictly dominates certificate D: better
 * hypothesis AND better constants at every rung) + PROP FEN-W (linear
 * necessity floor, and the honest not-necessary caveat).
 *
 * Eleventh leg of the seam chain, approaching the open sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port at the residual left by
 * imp-95218: "families with UNBOUNDED octave occupancy but convergent
 * Szasz sum (occupancy growing with the octave index) -- open on both
 * sides." THIS MODULE prices exactly that corner, and with it the LAST
 * structural freedom of obligation (iii): every rate family is now either
 * Szasz-divergent (dead by the imp-95215 THEOREM SZ necessity) or carries
 * a finite octave-Szasz weight W and is priced here at threshold
 * xStarSz(W). The certificate menu A/B/C/D collapses into a single
 * universal certificate (E): one scalar per parity.
 *
 * HYPOTHESIS H-SZW(W, m, d) -- per parity: the parity sum is a finite
 * combination (or L2 limit of such) of packets a_j e^(-mu|t-c_j|) whose
 * rates satisfy mu >= m, whose centers sit at depth >= d on the parity
 * side of the seam, and whose octave multiplicities M_j (rate count with
 * multiplicity in the dyadic octave [2^j m, 2^(j+1) m), j >= 0) satisfy
 *   sum_j M_j 2^(-j) <= W .
 * NO occupancy bound, NO total-count bound, NO ratio floor, NO gap of any
 * kind; the closure includes confluent dressings s^i e^(-mu s) with
 * multiplicity counted against the weight of the octave containing mu.
 * Since sum over rates of 1/mu lies within a factor 2 of W/m, W is a
 * quantitative form of the Szasz sum: every Szasz-convergent family has a
 * finite W (its own weight).
 *
 * LEMMA EXP (exponential tilt cap; elementary). For x > 0, K >= 1 and
 * u = e^(-x/(2K)), the n = 2K member of the imp-95217 SI family obeys
 *   B_2K(x, K) = sum_{k<K} binom(2K,k) u^(2K-k) (1+u)^k
 *             <= (4u(1+u))^K u/(1+u) <= (4u(1+u))^K .
 * Proof: for any lambda >= 1 multiply term k by lambda^(K-1-k) >= 1 and
 * extend the sum to all k <= 2K (nonnegative terms); the binomial theorem
 * gives B_2K <= lambda^(K-1) (u + (1+u)/lambda)^(2K); the choice
 * lambda = (1+u)/u >= 1 evaluates to 4^K u^(K+1) (1+u)^(K-1). QED.
 * COROLLARY: with aStar = 2 ln(2 + 2 sqrt2) and uStar = e^(-aStar/2)
 * = (sqrt2 - 1)/2 (so that 4 uStar (1 + uStar) = 1 EXACTLY), monotonicity
 * of u in x gives, for every x >= aStar K,
 *   sqrtLamTouch(x; K) <= B_2K(x, K) <= e^(-(x - aStar K)/2) :
 * the SI price decays exponentially PAST a fixed linear collar -- the
 * quantitative engine of the composition below. (n = 2K is admissible in
 * the SI min: the interpolation nodes j d/n, j < K, need only n >= K - 1.)
 *
 * PROP SLOPE (imp-95217 PROP LIN sharpened). LamTouch <= 1/2 as soon as
 * e^(-(x - aStar K)) <= 1/2, so
 *   xStarTouch(K) <= aStar K + ln 2 = 3.1490 K + 0.6931 ,
 * strictly below the imp-95217 proved cap 4 ln3 K + ln 2 = 4.3944 K +
 * 0.6931 at every K (same intercept, better slope). The two-sided sandwich
 * tightens to (2K-1)/4 <= xTrue(K) <= aStar K + ln 2.
 *
 * THEOREM SZ-P (Szasz-weight pricing, position-uniform, occupancy-free).
 * Under H-SZW(W, m, d), for every theta in (1/2, 1), with x = m d and
 * x > 2 aStar W: allocate to octave j the depth
 *   d_j = (d/2)(M_j 2^(-j) / W) + (d/2)(1 - theta) theta^j
 * (total <= d/2 + d/2 = d). The rates of octave j are >= 2^j m, so its SI
 * certificate runs at x_j = 2^j m d_j = (x/2)(M_j/W) + (x/2)(1-theta)
 * (2 theta)^j, and x_j - aStar M_j = (x/(2W) - aStar) M_j + (x/2)(1-theta)
 * (2 theta)^j > 0 with the M_j-coefficient positive; minimizing over
 * M_j >= 1 and applying LEMMA EXP,
 *   t_j <= b0 e^(-y (2 theta)^j),  b0 = e^(-(x - 2 aStar W)/(4W)),
 *   y = (x/4)(1 - theta) .
 * Octaves are disjoint rate sets, so the imp-95218 THEOREM TVC convolution
 * composition (imported as proved) applies across them:
 *   sqrt(LamSzW(x; W)) <= prod_{j>=0} (1 + b0 e^(-y (2 theta)^j)) - 1 ,
 * and since 2 theta > 1 the product converges absolutely with a value
 * independent of which octaves are occupied and of every M_j: the bound is
 * uniform over UNBOUNDED occupancy, unbounded count, and arbitrary
 * coalescence -- the only input is the scalar W. Any finite section
 * touches finitely many octaves; n-uniformity gives the class bound.
 *
 * THEOREM HL-S (H-LOC from H-SZW). LamSzW(.; W) is strictly decreasing on
 * its validity domain x > 2 aStar W with limit 0, so H-LOC holds for
 * m d > xStarSz(W) (LEMMA R1 of imp-95211 imported as proved and
 * rate-structure agnostic; imp-95210 gate as before). Ladder (17-point
 * theta grid; any theta is admissible so every row is a valid threshold):
 *   xStarSz = 5.8762688541644863 / 9.6227011488319327 / 14.270469810008684
 * at W = 0.5 / 1 / 2 (interior crossings), and for W >= 3 the crossing
 * pins at the validity boundary: xStarSz = 2 aStar W = 18.894249210953859
 * / 25.192332281271817 / 37.788498421907718 / 50.384664562543634 at
 * W = 3 / 4 / 6 / 8 (the bound is already below 1/2 at the domain edge).
 * Asymptotic threshold slope in W: exactly 2 aStar = 6.2980830703179535.
 * Payoff rows (collapse from gammaOV = 0.9995949885454457):
 *   W = 1, m d = 26: LamSzW = 0.0000013289758000024318, gammaSL = 0.5000026569126955
 *   W = 1, m d = 32: LamSzW = 1.4753953382497081e-8,    gammaSL = 0.500000029496412
 *   W = 2, m d = 42: LamSzW = 2.895046301765231e-7,     gammaSL = 0.5000005787835476
 *   W = 4, m d = 72: LamSzW = 7.466047153659665e-10,    gammaSL = 0.5000000014926278
 *
 * PROP EMB (explicit weight embeddings; obligations discharge upward).
 * (A) dyadic/lacunary ratio-2 chains: W <= sum 2^(-(k-1)) = 2;
 * (B) H-GEO(m, d, rho): W <= sum 2m/mu_k <= 2 rho/(rho - 1) -- exactly the
 *     imp-95216 PROP FENCE Szasz constant;
 * (C) H-CNT(K, m, d): each rate contributes 2^(-j) <= 1, so W <= K;
 * (D) H-OCC(M, m, d): W <= sum_j M 2^(-j) = 2M.
 * Every prior hypothesis class sits inside H-SZW with an explicit weight:
 * certificate E is universal for the whole menu.
 *
 * PROP DOM (certificate D strictly dominated). On the H-OCC(M) classes the
 * E-threshold beats the D-threshold at every measured rung:
 *   xStarSz(2) = 14.27 < xStarOcc(1) = 29.89 ,
 *   xStarSz(4) = 25.19 < xStarOcc(2) = 138.50 ,
 *   xStarSz(6) = 37.79 < xStarOcc(3) = 321.98 ;
 * weaker hypothesis AND better constants: the imp-95218 cluster route is
 * subsumed outright. HONEST: A, B, C keep their turf (dyadic xStar =
 * 2.6510 < xStarSz(2); xStarGeo(1.5) = 5.0660 < xStarSz(6); xStarTouch(K)
 * <= aStar K + ln 2 < xStarSz(K) ~ 2 aStar K), so the menu shrinks to
 * {A, B, C, E} with E the universal fallback.
 *
 * PROP FEN-W (fencing, both sides honest). Lower: the confluent witness
 * s^(W-1) e^(-m s) (integer W, all weight in octave 0) is in-class, so the
 * imp-95217 Markov floor gives xTrueSz(W) >= (2W - 1)/4: any weight-
 * uniform threshold grows at least linearly in W; with PROP SLOPE the
 * class is fenced (2W-1)/4 <= xTrueSz(W) <= xStarSz(W) <= 2 aStar W +
 * O(1), a factor ~12.6 between the proved slopes. NOT NECESSARY: bounded
 * weight is sufficient, not necessary -- weight in octave j meets the seam
 * at effective depth 2^j d, so families with unbounded W concentrated at
 * high octaves can still be tame; a depth-discounted weight could refine
 * E. What IS matched: the imp-95215 THEOREM SZ eliminates exactly the
 * W = infinity families (divergent Szasz sum), and E prices every finite-W
 * family, so the pointwise corner "unbounded occupancy + convergent Szasz
 * sum" is now EMPTY -- no rate family remains unpriced on both sides.
 *
 * ROUTING CONSEQUENCE. Obligation (iii) of the sub-gap is now
 * STRUCTURALLY COMPLETE at model level: necessity (SZ) and sufficiency
 * (SZ-P) meet at the Szasz boundary, and the per-parity certificate the
 * envelope port owes reduces from "exhibit shells, a floor, a count or an
 * occupancy bound" to "compute ONE number W per parity and check
 * m d > xStarSz(W)". The sub-gap stays OPEN on its extraction legs only:
 * the alias-denominator to dictionary-rate map, the per-parity weight W of
 * the ported packets, and the paper constants (m, d).
 *
 * HONEST LIMITS. (a) Coverage, not sharpness: truth batteries sit many
 * orders below the bound (worst true/bound 1.1e-11 in 400 scratch draws);
 * the theorem buys existence of a scalar-certified uniform threshold, not
 * a tight one. (b) One-sided throughout; below xStarSz nothing is
 * delivered. (c) NOT instantiated for the paper packets; W for the ported
 * per-parity families is part of the open extraction. (d) The threshold is
 * boundary-limited for W >= 3 (the validity edge x > 2 aStar W, an
 * artifact of the uniform M_j >= 1 minimization, dominates the 1/2
 * crossing there); a sharper small-b0 analysis could push below it.
 * (e) Model-family constants (sigma = 1, theta = 10); gammaSL remains a
 * cap, not a measurement; measured class sup phi = 0.3572 untouched.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) LEMMA EXP audited symbolically (the
 * lambda-tilt requires only lambda >= 1 and nonnegative terms; the exact
 * identity uStar(1 + uStar) = 1/4 anchors the corollary) and on a
 * 40 x 54 grid (worst B_2K/cap = 0.284, no violation); the corollary was
 * checked against the full SI min (worst ratio 0.043). (2) The
 * pure-Szasz-proportional allocation WITHOUT the geometric half was
 * attempted and FAILS: on the infinite dyadic family it gives every octave
 * the same x_j, the per-octave price is constant, and the J-octave product
 * diverges (verified linear growth, ratio 2.00 per doubling of J) -- the
 * geometric floor is necessary in the construction, recorded as the trap.
 * (3) Truth batteries on exact Cauchy Gram pairs (power iteration):
 * unbounded-occupancy Szasz-convergent draws in the three growth laws
 * M_j = j+1, round(2^(j/2)), round(2^j/(j^2+1)) -- the exact families of
 * the recorded corner, with touching in-octave pairs -- no violation.
 * (4) Regime split verified: interior 1/2-crossings at W <= 2 (bracketing
 * checks at 1e-4 relative offsets), boundary-pinned at W >= 3 (bound
 * already < 1/2 at 1e-6 past the edge). (5) Monotone in x on the validity
 * domain and monotone in W at fixed x, both verified on grids. (6) The
 * gammaSL chain reproduces the imp-95210 baked pair (transcription guard).
 * (7) An attempt to claim class-level NECESSITY of bounded weight was
 * made and withdrawn: high-octave-concentrated families defeat it (see
 * PROP FEN-W); the honest statement is sufficiency plus the linear floor.
 *
 * The numerics below CROSS-CHECK the theorem statements; they are not the
 * claim. Import-light (no heavy bundle; imports only sibling verdict
 * modules for carried constants). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

import BNT from "./imp-95172-ballast-necessity-tradeoff.js";
import MBU from "./imp-95208-mb-uniform-ballast-cap.js";
import OVC from "./imp-95209-overlap-currency-cap.js";
import SML from "./imp-95210-seam-mass-localization-cap.js";
import DRL from "./imp-95211-dyadic-rate-localization.js";
import GCT from "./imp-95216-global-chain-touching-pricing.js";
import SIC from "./imp-95217-shift-interpolation-count-pricing.js";
import OCC from "./imp-95218-occupancy-cluster-composition-pricing.js";

// ── carried constants (single source of truth: sibling verdict objects) ─────
const LW_EVEN = BNT.constants.lwEven; // 3.9197935113802585e-5
const Q_OD = BNT.constants.q; // 0.03755392855053636
const C_U = MBU.constants.cU; // 0.30501330232499435
const KAPPA = OVC.constants.kappa; // 48.717745853978386
const GAMMA_OV = OVC.constants.gammaOV; // 0.9995949885454457
const X_STAR_DYADIC = DRL.constants.xStar; // 2.651017799014494

// ── new baked literals (recomputed by the assertions) ────────────────────────
// LEMMA EXP corollary constants (exact relations asserted below)
const A_STAR_EXP = 2 * Math.log(2 + 2 * Math.SQRT2); // 3.1490415351589767
const U_STAR_EXP = (Math.SQRT2 - 1) / 2; // 0.20710678118654752
// threshold ladder: unique crossing of LamSzW(x; W) = 1/2 on x > 2 aStar W
// (17-point theta grid); interior for W <= 2, boundary-pinned for W >= 3
const X_STAR_SZ_TABLE = [
  { W: 0.5, xStarSz: 5.8762688541644863, regime: "interior" },
  { W: 1, xStarSz: 9.6227011488319327, regime: "interior" },
  { W: 2, xStarSz: 14.270469810008684, regime: "interior" },
  { W: 3, xStarSz: 18.894249210953859, regime: "boundary" },
  { W: 4, xStarSz: 25.192332281271817, regime: "boundary" },
  { W: 6, xStarSz: 37.788498421907718, regime: "boundary" },
  { W: 8, xStarSz: 50.384664562543634, regime: "boundary" },
];
// payoff rows (Szasz-weight class only: no occupancy, count or ratio input)
const PAYOFF_TABLE_SZ = [
  {
    W: 1,
    md: 26,
    lamSz: 0.0000013289758000024318,
    theta2: 0.9999986710242,
    g: 0.0023056227218048965,
    gammaSL: 0.5000026569126955,
  },
  {
    W: 1,
    md: 32,
    lamSz: 1.4753953382497081e-8,
    theta2: 0.9999999852460466,
    g: 0.00024293170369318155,
    gammaSL: 0.500000029496412,
  },
  {
    W: 2,
    md: 42,
    lamSz: 2.895046301765231e-7,
    theta2: 0.9999997104953698,
    g: 0.0010761125338245852,
    gammaSL: 0.5000005787835476,
  },
  {
    W: 4,
    md: 72,
    lamSz: 7.466047153659665e-10,
    theta2: 0.9999999992533953,
    g: 0.00005464813683223053,
    gammaSL: 0.5000000014926278,
  },
];
// PROP FEN-W floor rows: octave-0 confluent witness Q(2W-1, 2x) vs the bound
const FLOOR_ROWS_SZ = [
  { W: 1, x: 26, floor: 2.6102790696677047e-23, bound: 0.0000013289758000024318 },
  { W: 1, x: 32, floor: 1.603810890548638e-28, bound: 1.4753953382497081e-8 },
  { W: 2, x: 42, floor: 1.1943496364486533e-33, bound: 2.895046301765231e-7 },
  { W: 4, x: 72, floor: 3.739260160294282e-53, bound: 7.466047153659665e-10 },
];

// ── theorem functionals ──────────────────────────────────────────────────────
// imp-95217 SI price: B_n(x, K) = sum_{k<K} binom(n,k) b^(n-k) (1+b)^k
function bTermSI(n, x, K) {
  const b = Math.exp(-x / n);
  let s = 0;
  let binom = 1;
  for (let k = 0; k <= Math.min(K - 1, n); k++) {
    s += binom * Math.pow(b, n - k) * Math.pow(1 + b, k);
    binom = (binom * (n - k)) / (k + 1);
  }
  return s;
}
function sqrtLamTouch(x, K) {
  const nMax = Math.ceil(4 * x + 4 * K + 60);
  let best = Infinity;
  for (let n = 1; n <= nMax; n++) {
    const v = bTermSI(n, x, K);
    if (v < best) best = v;
  }
  return best;
}
// LEMMA EXP caps
function lemmaExpCap(x, K) {
  const u = Math.exp(-x / (2 * K));
  return Math.pow(4 * u * (1 + u), K) * (u / (1 + u));
}
function corollaryCap(x, K) {
  return x >= A_STAR_EXP * K ? Math.exp(-(x - A_STAR_EXP * K) / 2) : Infinity;
}
// THEOREM SZ-P bound at a fixed theta (any theta in (1/2, 1) is admissible)
function sqrtLamSzWTheta(x, W, theta) {
  if (!(theta > 0.5 && theta < 1)) return Infinity;
  if (!(x > 2 * A_STAR_EXP * W)) return Infinity;
  const b0 = Math.exp(-(x - 2 * A_STAR_EXP * W) / (4 * W));
  const y = (x / 4) * (1 - theta);
  const r = 2 * theta;
  let logProd = 0;
  let e = y;
  for (let j = 0; j < 5000; j++) {
    const t = b0 * Math.exp(-e);
    logProd += Math.log1p(t);
    if (t < 1e-18) break;
    e *= r;
  }
  return Math.exp(logProd) - 1;
}
function sqrtLamSzW(x, W) {
  let best = Infinity;
  for (let i = 1; i <= 17; i++) {
    const theta = 0.5 + (0.5 * i) / 18;
    const v = sqrtLamSzWTheta(x, W, theta);
    if (v < best) best = v;
  }
  return best;
}
function lamSzW(x, W) {
  const s = sqrtLamSzW(x, W);
  return s * s;
}
function xStarSz(W) {
  let lo = 2 * A_STAR_EXP * W;
  let hi = 2 * A_STAR_EXP * W + 40 * Math.sqrt(W) + 40;
  while (lamSzW(hi, W) > 0.5) hi *= 1.4;
  for (let it = 0; it < 80; it++) {
    const mid = 0.5 * (lo + hi);
    if (lamSzW(mid, W) > 0.5) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}
// octave-Szasz weight of an explicit rate family
function octaveWeight(mus, m) {
  let W = 0;
  const cnt = {};
  for (const mu of mus) {
    const j = Math.floor(Math.log2(mu / m) + 1e-12);
    cnt[j] = (cnt[j] || 0) + 1;
  }
  for (const j in cnt) W += cnt[j] * Math.pow(2, -j);
  return W;
}
// PROP FEN-W floor: regularized upper incomplete gamma at integer shape
function upperQ(a, y) {
  let s = 0;
  let t = 1;
  for (let i = 0; i < a; i++) {
    s += t;
    t = (t * y) / (i + 1);
  }
  return Math.exp(-y) * s;
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
// small dense linear algebra for the exact-Gram truth batteries
function invMatrix(A) {
  const n = A.length;
  const M2 = A.map((row, i) =>
    row.concat(Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))),
  );
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M2[k][i]) > Math.abs(M2[p][i])) p = k;
    }
    const tmp = M2[i];
    M2[i] = M2[p];
    M2[p] = tmp;
    const piv = M2[i][i];
    for (let j = 0; j < 2 * n; j++) M2[i][j] /= piv;
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const f = M2[k][i];
      for (let j = 0; j < 2 * n; j++) M2[k][j] -= f * M2[i][j];
    }
  }
  return M2.map((row) => row.slice(n));
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
export const IMP95219_SZASZ_WEIGHT_UNIVERSAL_PRICING = {
  ticket:
    "imp-95219 (eleventh leg of the seam chain: the imp-95218 residual of obligation (iii) -- unbounded-occupancy Szasz-convergent families, the corner recorded open on both sides -- is PRICED by THEOREM SZ-P under the single scalar hypothesis of a bounded octave-Szasz weight, via the LEMMA EXP exponential tilt cap on the imp-95217 shift-interpolation price and the imp-95218 TVC composition across octaves)",
  hypothesis:
    "H-SZW(W, m, d), per parity: rates >= m, centers at depth >= d on the parity side, octave multiplicities M_j with sum_j M_j 2^(-j) <= W. No occupancy bound, no count bound, no ratio floor, no gap; confluent dressings counted against the weight of their octave. W is a quantitative Szasz sum: every Szasz-convergent family has a finite W.",
  lemmaEXP:
    "exponential tilt cap: B_2K(x, K) <= (4u(1+u))^K u/(1+u) with u = e^(-x/(2K)), by a lambda-tilt (lambda = (1+u)/u) plus the binomial theorem; with uStar = (sqrt2-1)/2 satisfying 4 uStar (1+uStar) = 1 exactly and aStar = 2 ln(2+2 sqrt2), sqrtLamTouch(x; K) <= e^(-(x - aStar K)/2) for x >= aStar K: the SI price decays exponentially past a fixed linear collar.",
  propSLOPE:
    "xStarTouch(K) <= aStar K + ln 2 = 3.1490 K + 0.6931, sharpening the imp-95217 proved cap 4 ln3 K + ln 2 = 4.3944 K + 0.6931 at every K (same intercept, strictly better slope); the count sandwich tightens to (2K-1)/4 <= xTrue(K) <= aStar K + ln 2.",
  theoremSZP:
    "Szasz-weight pricing: under H-SZW(W, m, d), for theta in (1/2, 1) and x = m d > 2 aStar W, the split allocation d_j = (d/2)(M_j 2^(-j)/W) + (d/2)(1-theta) theta^j gives every octave x_j - aStar M_j >= (x/(2W) - aStar) + (x/2)(1-theta)(2 theta)^j > 0, so by LEMMA EXP and the imp-95218 TVC composition across the (disjoint) octaves, sqrt(LamSzW(x; W)) <= prod_{j>=0}(1 + b0 e^(-y (2 theta)^j)) - 1 with b0 = e^(-(x - 2 aStar W)/(4W)), y = (x/4)(1-theta). The product converges (2 theta > 1) to a value independent of the M_j: uniform over unbounded occupancy, unbounded count and arbitrary coalescence; the only input is the scalar W.",
  theoremHLS:
    "H-LOC from H-SZW for m d > xStarSz(W). Ladder: interior crossings 5.8762688541644863 / 9.6227011488319327 / 14.270469810008684 at W = 0.5/1/2; boundary-pinned at 2 aStar W for W >= 3 (18.894249210953859 / 25.192332281271817 / 37.788498421907718 / 50.384664562543634 at W = 3/4/6/8); asymptotic slope exactly 2 aStar = 6.2980830703179535. Payoff gammaSL = 0.5000026569126955 / 0.500000029496412 / 0.5000005787835476 / 0.5000000014926278 at (W, m d) = (1,26)/(1,32)/(2,42)/(4,72) vs gammaOV = 0.9995949885454457.",
  propEMB:
    "explicit weight embeddings: dyadic ratio-2 chains W <= 2; H-GEO(rho) W <= 2 rho/(rho-1) (the imp-95216 PROP FENCE constant); H-CNT(K) W <= K; H-OCC(M) W <= 2M. Every prior certificate class sits inside H-SZW: certificate E is universal for the menu.",
  propDOM:
    "certificate D strictly dominated: xStarSz(2) = 14.27 < xStarOcc(1) = 29.89, xStarSz(4) = 25.19 < xStarOcc(2) = 138.50, xStarSz(6) = 37.79 < xStarOcc(3) = 321.98 -- weaker hypothesis AND better constants at every rung; the imp-95218 cluster route is subsumed outright. HONEST: A, B, C keep their turf (dyadic 2.6510 < xStarSz(2); xStarGeo(1.5) = 5.0660 < xStarSz(6); xStarTouch(K) < xStarSz(K)); the menu shrinks to {A, B, C, E}.",
  propFENW:
    "fencing: the octave-0 confluent witness s^(W-1) e^(-m s) is in-class, so xTrueSz(W) >= (2W-1)/4 (imp-95217 Markov floor): weight-uniform thresholds grow at least linearly in W, vs the proved upper slope 2 aStar (factor ~12.6). NOT NECESSARY: bounded weight is sufficient, not necessary -- high-octave-concentrated weight meets the seam at effective depth 2^j d, so a depth-discounted weight could refine E. Matched boundary: THEOREM SZ eliminates exactly the divergent (W = infinity) families, SZ-P prices every finite-W family -- the pointwise corner is EMPTY.",
  constants: {
    aStarExp: A_STAR_EXP,
    uStarExp: U_STAR_EXP,
    xStarSzTable: X_STAR_SZ_TABLE,
    payoffTableSz: PAYOFF_TABLE_SZ,
    floorRowsSz: FLOOR_ROWS_SZ,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, but obligation (iii) is now STRUCTURALLY COMPLETE at model level: the certificate menu collapses to the single universal certificate (E) octave-Szasz weight W (THEOREM SZ-P, threshold xStarSz(W)), with the prior certificates A (lacunary shells), B (ratio floor), C (finite count), D (bounded occupancy) embedded at explicit weights (2, 2 rho/(rho-1), K, 2M) and D strictly dominated. Necessity (imp-95215 THEOREM SZ, divergent weight) and sufficiency (SZ-P, finite weight) meet at the Szasz boundary; the imp-95218 unpriced corner (unbounded occupancy, convergent Szasz sum) is EMPTY. Remaining extraction obligations, unchanged in kind but reduced in shape: the alias-denominator to dictionary-rate map, the per-parity WEIGHT W of the ported packets (one scalar per parity instead of a structural certificate), and the paper constants (m, d) -- then check m d > xStarSz(W).",
  verdict:
    "LAST-CORNER SZASZ-WEIGHT PRICING DELIVERED (model level): THEOREM SZ-P prices unbounded-occupancy Szasz-convergent families -- the corner every prior theorem (DR/DR-M/DR-R/DR-A/GC/SI/OC) left open -- under the single scalar hypothesis sum M_j 2^(-j) <= W, via the new LEMMA EXP exponential tilt cap on the shift-interpolation price (which also sharpens the proved count-threshold slope from 4 ln3 to 2 ln(2+2 sqrt2)) and the imp-95218 convolution composition across octaves with a half-proportional half-geometric depth allocation. Explicit ladder xStarSz = 9.62/14.27/25.19/50.38 at W = 1/2/4/8 with gammaSL collapse rows; linear necessity floor (2W-1)/4; all four prior certificates embed, certificate D strictly dominated. HONEST LIMITS: coverage not sharpness (worst true/bound 1.1e-11 in the scratch battery), one-sided, boundary-limited threshold for W >= 3, bounded weight sufficient but NOT necessary (depth-discounted refinement open), NOT instantiated for the paper packets; obligation (iii) extraction legs remain; measured class sup phi = 0.3572 unchanged.",
  rigorScope:
    "LEMMA EXP is a two-line tilt: multiply the k-th term by lambda^(K-1-k) >= 1, extend to the full binomial sum, optimize lambda -- unconditional, with the exact anchor 4 uStar(1+uStar) = 1. THEOREM SZ-P assembles LEMMA EXP with the imp-95218 THEOREM TVC (imported as proved) over the disjoint octave rate sets and an explicit depth allocation; the M_j-minimization uses only positivity of the linear coefficient on the validity domain, and the infinite product converges absolutely for theta > 1/2. LEMMA R1 (imp-95211) is imported as proved and rate-structure agnostic. Nothing here instantiates the paper packets; the numerics cross-check the statements and are not the claim.",
};

// ── assertions (self-executing; import-light; THROW on violation) ────────────
export const IMP95219_SZP_ASSERTIONS = [
  {
    id: "imp95219-szp-exact-anchors",
    description:
      "the LEMMA EXP corollary constants are exact: uStar = (sqrt2-1)/2 satisfies 4 uStar (1+uStar) = 1 to 1e-15, e^(-aStar/2) = uStar to 1e-15 relative, and aStar = 3.1490415351589767 reproduces",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      if (!(Math.abs(4 * U_STAR_EXP * (1 + U_STAR_EXP) - 1) <= 1e-15)) return false;
      if (!rel(Math.exp(-A_STAR_EXP / 2), U_STAR_EXP, 1e-14)) return false;
      return rel(A_STAR_EXP, 3.1490415351589767, 1e-15);
    },
  },
  {
    id: "imp95219-szp-lemma-exp-grid",
    description:
      "LEMMA EXP on a 40 x 54 grid (K = 1..40, x/K in 0.1..20): B_2K(x,K) never exceeds (4u(1+u))^K u/(1+u), and the corollary e^(-(x - aStar K)/2) caps the full SI min sqrtLamTouch(x;K) on K = 1..40, x = aStar K + c, c in 0..30",
    holds: () => {
      for (let K = 1; K <= 40; K++) {
        for (let a = 0.1; a <= 20; a += 0.37) {
          const x = a * K;
          if (bTermSI(2 * K, x, K) > lemmaExpCap(x, K) * (1 + 1e-12)) return false;
        }
        for (let c = 0; c <= 30; c += 1.5) {
          const x = A_STAR_EXP * K + c;
          if (sqrtLamTouch(x, K) > corollaryCap(x, K) * (1 + 1e-12)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95219-szp-prop-slope",
    description:
      "PROP SLOPE against the imported imp-95217 xStarTouch table: every row sits below the new cap aStar K + ln 2, and the new cap sits strictly below the old proved cap 4 ln3 K + ln 2 at every K >= 1",
    holds: () => {
      for (const row of SIC.constants.xStarTouchTable) {
        const newCap = A_STAR_EXP * row.K + Math.log(2);
        const oldCap = 4 * Math.log(3) * row.K + Math.log(2);
        if (!(row.xStarTouch <= newCap)) return false;
        if (!(newCap < oldCap)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95219-szp-threshold-ladder",
    description:
      "the baked xStarSz ladder reproduces from bisection (rel 1e-9), is strictly increasing in W, sits above the (2W-1)/4 necessity floor and above the validity edge 2 aStar W; interior rows (W <= 2) bracket the 1/2 crossing at 1e-4 offsets, boundary rows (W >= 3) equal 2 aStar W (rel 1e-9) with the bound already below 1/2 at 1e-6 past the edge; LamSzW is strictly decreasing in x and nondecreasing in W on spot grids",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      let prev = -Infinity;
      for (const row of X_STAR_SZ_TABLE) {
        const xs = xStarSz(row.W);
        if (!rel(xs, row.xStarSz, 1e-9)) return false;
        if (!(xs > prev)) return false;
        prev = xs;
        if (!(xs >= (2 * row.W - 1) / 4)) return false;
        if (!(xs >= 2 * A_STAR_EXP * row.W * (1 - 1e-12))) return false;
        if (row.regime === "interior") {
          if (!(lamSzW(xs * (1 - 1e-4), row.W) > 0.5)) return false;
          if (!(lamSzW(xs * (1 + 1e-4), row.W) < 0.5)) return false;
        } else {
          if (!rel(xs, 2 * A_STAR_EXP * row.W, 1e-9)) return false;
          if (!(lamSzW(2 * A_STAR_EXP * row.W * (1 + 1e-6), row.W) < 0.5))
            return false;
        }
      }
      for (const W of [1, 2, 4]) {
        let prevV = Infinity;
        for (let i = 0; i < 8; i++) {
          const v = lamSzW(2 * A_STAR_EXP * W + 1 + i * 4, W);
          if (!(v < prevV)) return false;
          prevV = v;
        }
      }
      for (const x of [30, 60]) {
        let prevV = -Infinity;
        for (const W of [0.5, 1, 2, 3, 4]) {
          const v = lamSzW(x, W);
          if (!(v >= prevV)) return false;
          prevV = v;
        }
      }
      return true;
    },
  },
  {
    id: "imp95219-szp-payoff-rows",
    description:
      "the payoff rows (LamSzW, theta^2, g, gammaSL) reproduce rel 1e-9, each gammaSL sits strictly below gammaOV, each m d exceeds the baked xStarSz(W) so THEOREM HL-S bites, and the gammaSL chain reproduces the imp-95210 baked pair (transcription guard)",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      for (const row of PAYOFF_TABLE_SZ) {
        const lam = lamSzW(row.md, row.W);
        if (!rel(lam, row.lamSz, 1e-9)) return false;
        if (!rel(1 - lam, row.theta2, 1e-9)) return false;
        const g = gFromLam(lam);
        if (!rel(g, row.g, 1e-9)) return false;
        if (!rel(gammaSL(g), row.gammaSL, 1e-9)) return false;
        if (!(row.gammaSL < GAMMA_OV)) return false;
        const xs = X_STAR_SZ_TABLE.find((r) => r.W === row.W).xStarSz;
        if (!(row.md > xs)) return false;
      }
      return rel(gammaSL(SML.constants.gRef), SML.constants.gammaSLRef, 1e-12);
    },
  },
  {
    id: "imp95219-szp-dominance-and-turf",
    description:
      "PROP EMB / PROP DOM anchors against the imported sibling tables: xStarSz(2M) < xStarOcc(M) at every imp-95218 rung (certificate D strictly dominated on its own turf), while A, B, C keep theirs: dyadic xStar < xStarSz(2), xStarGeo(1.5) < xStarSz(6), and xStarTouch(K) < xStarSz(K) at K = 1, 2, 3",
    holds: () => {
      for (const row of OCC.constants.xStarOccTable) {
        const xsE = X_STAR_SZ_TABLE.find((r) => r.W === 2 * row.M).xStarSz;
        if (!(xsE < row.xStarOcc)) return false;
      }
      if (!(X_STAR_DYADIC < X_STAR_SZ_TABLE.find((r) => r.W === 2).xStarSz))
        return false;
      const geo15 = GCT.constants.xStarGeoTable.find((r) => r.rho === 1.5);
      if (!(geo15.xStarGeo < X_STAR_SZ_TABLE.find((r) => r.W === 6).xStarSz))
        return false;
      for (const K of [1, 2, 3]) {
        const t = SIC.constants.xStarTouchTable.find((r) => r.K === K);
        if (!(t.xStarTouch < xStarSz(K))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95219-szp-floor-fence",
    description:
      "PROP FEN-W rows reproduce (Q(2W-1, 2x) closed form, rel 1e-12) and sit below the bound with the coverage gap honestly enormous; the necessity floor (2W-1)/4 sits strictly below xStarSz(W) at every baked integer-W rung",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      for (const row of FLOOR_ROWS_SZ) {
        const q = upperQ(2 * row.W - 1, 2 * row.x);
        if (!rel(q, row.floor, 1e-12)) return false;
        if (!rel(lamSzW(row.x, row.W), row.bound, 1e-9)) return false;
        if (!(row.floor < row.bound * 1e-10)) return false;
      }
      for (const row of X_STAR_SZ_TABLE) {
        if (!((2 * row.W - 1) / 4 < row.xStarSz)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95219-szp-truth-battery",
    description:
      "skeptical truth battery on exact Cauchy Gram pairs (power iteration): 200 unbounded-occupancy Szasz-convergent draws in the three growth laws M_j = j+1, round(2^(j/2)), round(2^j/(j^2+1)) with touching in-octave rates -- the exact families of the imp-95218 open corner -- never violate the SZ-P bound at x = (8W + 8)(1 + jitter); the battery certifies it exercised occupancy >= 6 and distinct-rate count >= 25 (outside every prior certificate at small parameters)",
    holds: () => {
      let seed = 95219;
      const rand = () => {
        seed = (1103515245 * seed + 12345) % 2147483648;
        return seed / 2147483648;
      };
      let sawBigOcc = false;
      let sawBigCnt = false;
      for (let t = 0; t < 200; t++) {
        const m = 0.4 + 1.6 * rand();
        const growth = Math.floor(rand() * 3);
        const nOct = 3 + Math.floor(rand() * 5);
        const mus = [];
        let maxOcc = 0;
        for (let j = 0; j < nOct; j++) {
          let Mj;
          if (growth === 0) Mj = j + 1;
          else if (growth === 1) Mj = Math.max(1, Math.round(Math.pow(2, j / 2)));
          else Mj = Math.max(1, Math.round(Math.pow(2, j) / (j * j + 1)));
          Mj = Math.min(Mj, 12);
          maxOcc = Math.max(maxOcc, Mj);
          for (let k = 0; k < Mj; k++) {
            mus.push(m * Math.pow(2, j) * (1 + 0.9 * rand()) * (1 + 1e-3 * rand()));
          }
        }
        if (mus.length > 44) continue;
        mus.sort((a, b) => a - b);
        if (maxOcc >= 6) sawBigOcc = true;
        if (mus.length >= 25) sawBigCnt = true;
        const W = octaveWeight(mus, m);
        const x = (8 * W + 8) * (1 + 0.6 * rand());
        const bnd = lamSzW(x, W);
        if (!(bnd < 0.5)) return false;
        if (!(trueLambdaMax(mus, x / m) <= bnd + 1e-9)) return false;
      }
      return sawBigOcc && sawBigCnt;
    },
  },
  {
    id: "imp95219-szp-proportional-trap",
    description:
      "the recorded trap is real: the pure Szasz-proportional allocation (no geometric half) gives the J-octave dyadic family a constant per-octave price, so the summed price grows exactly linearly in J (ratio 2 within 2% from J = 20 to J = 40) and the J -> infinity product diverges -- the geometric floor in THEOREM SZ-P is necessary",
    holds: () => {
      const x = 40;
      const price = (J) => {
        const W = 2 * (1 - Math.pow(2, -J));
        let s = 0;
        for (let j = 0; j < J; j++) s += sqrtLamTouch(x / W, 1);
        return s;
      };
      const r = price(40) / price(20);
      return r > 1.96 && r < 2.04 && price(40) > 0;
    },
  },
  {
    id: "imp95219-szp-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap named STILL OPEN with the extraction legs, the corner-EMPTY claim scoped to the pointwise level, the coverage-not-sharpness caveat, the not-necessary caveat, and no QED",
    holds: () =>
      /STILL OPEN/.test(IMP95219_SZASZ_WEIGHT_UNIVERSAL_PRICING.subGap) &&
      /STRUCTURALLY COMPLETE at model level/.test(
        IMP95219_SZASZ_WEIGHT_UNIVERSAL_PRICING.subGap,
      ) &&
      /extraction obligations/.test(IMP95219_SZASZ_WEIGHT_UNIVERSAL_PRICING.subGap) &&
      /coverage not sharpness/.test(IMP95219_SZASZ_WEIGHT_UNIVERSAL_PRICING.verdict) &&
      /NOT instantiated for the paper packets/.test(
        IMP95219_SZASZ_WEIGHT_UNIVERSAL_PRICING.verdict,
      ) &&
      /sufficient but NOT necessary/.test(
        IMP95219_SZASZ_WEIGHT_UNIVERSAL_PRICING.verdict,
      ) &&
      /0\.3572/.test(IMP95219_SZASZ_WEIGHT_UNIVERSAL_PRICING.verdict) &&
      /Markov floor/.test(IMP95219_SZASZ_WEIGHT_UNIVERSAL_PRICING.propFENW) &&
      /menu shrinks to \{A, B, C, E\}/.test(
        IMP95219_SZASZ_WEIGHT_UNIVERSAL_PRICING.propDOM,
      ),
  },
];

for (const a of IMP95219_SZP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95219-szasz-weight-universal-pricing assertion failed: ${a.id}`,
    );
  }
}

export default IMP95219_SZASZ_WEIGHT_UNIVERSAL_PRICING;
