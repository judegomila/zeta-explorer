/**
 * imp-95217: THEOREM SI (shift-interpolation count pricing: the NG corner
 * priced on the COUNT axis, with NO separation hypothesis of any kind) +
 * THEOREM HL-C (H-LOC from H-CNT with the explicit threshold
 * xStarTouch(K)) + PROP FLOOR (confluent-witness lower bound on the TRUE
 * class sup, in incomplete-gamma closed form) + PROP NEC (count-dependence
 * of ANY uniform bound is NECESSARY, by the imp-95215 THEOREM SZ) +
 * PROP LIN (two-sided sandwich: the touching-count threshold is LINEAR in
 * the count, (2K - 1)/4 <= xTrue(K) <= xStarTouch(K) <= 4 ln(3) K + ln 2).
 *
 * Ninth leg of the seam chain, approaching the open sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port at the residual left by
 * imp-95216: "bounded-occupancy touching families WITHOUT a ratio floor
 * (the LEMMA NG coalescence corner), open on both sides". Every prior
 * positive theorem (DR, DR-M, DR-R, DR-A, GC) needs a SEPARATION
 * certificate -- lacunary shells, an in-shell ratio floor, an additive
 * gap, or a global consecutive-ratio floor -- because the Cauchy
 * biorthogonal route pays c(q) = (q + 1)/(q - 1) per rate pair and
 * diverges as ratios approach 1 (LEMMA NG). THIS MODULE replaces the
 * biorthogonal route by an INTERPOLATION route that never forms a rate
 * pair: the only structural input is a bound K on the NUMBER of distinct
 * rates. Touching, near-coalescent, and EXACTLY confluent configurations
 * are all covered at one uniform threshold.
 *
 * HYPOTHESIS H-CNT(K, m, d) -- per parity: the parity sum is a (finite,
 * or L2-limit of finite) combination of packets a_j e^(-mu|t-c_j|) whose
 * distinct rates number AT MOST K and all satisfy mu >= m, and whose
 * centers all sit at depth >= d on the parity's own side of the seam.
 * NO separation of any kind is assumed: the rates may be arbitrarily
 * close, and the L2 closure includes confluent elements
 * s^j e^(-mu s) (j <= K - 1) exactly as manufactured by the LEMMA NG
 * dressing mechanism.
 *
 * THEOREM SI (shift-interpolation pricing, position-uniform). Let
 * f(s) = sum_{r=1}^{Kp} A_r e^(-mu_r s), Kp <= K, with distinct rates
 * mu_r >= m, and let x = m d > 0. For ANY integer n >= 1 put h = d/n,
 * b = e^(-x/n), and let P(q) = sum_j c_j q^j be the Newton interpolation
 * polynomial of degree <= Kp - 1 of phi(q) = q^n at the nodes
 * q_r = e^(-h mu_r) (all in (0, b]). Then the SHIFT-INTERPOLATION
 * IDENTITY holds pointwise for every s >= 0:
 *   f(s + d) = sum_{j=0}^{Kp-1} c_j f(s + j h) ,
 * because at each rate, sum_j c_j q_r^j = P(q_r) = q_r^n = e^(-d mu_r).
 * Since every nonnegative shift is an L2(0, infinity) contraction
 * (integral_0^inf f(s + a)^2 ds = integral_a^inf f^2 <= ||f||^2), the
 * triangle inequality gives
 *   sqrt(integral_d^inf f^2) <= (sum_j |c_j|) ||f|| ,
 * and the Newton coefficients are priced by the divided-difference mean
 * value theorem (|[q_1..q_{k+1}] phi| <= max |phi^(k)| / k! over the node
 * hull, phi^(k) increasing on (0, b] for k <= n) together with the exact
 * coefficient-l1 evaluation of the Newton basis (l1 of the product of
 * (q - q_j) equals the product of (1 + q_j) <= (1 + b)^k):
 *   sum_j |c_j| <= B_n(x, K) = sum_{k=0}^{K-1} binom(n, k) b^(n-k) (1+b)^k .
 * Hence, n-uniformly over positions and over Kp <= K,
 *   integral_d^inf f^2 <= LamTouch(x; K) integral_0^inf f^2 ,
 *   sqrt(LamTouch(x; K)) = min over integers n >= 1 of B_n(x, K) .
 * CLOSURE: the bound survives L2 limits, in particular full coalescence
 * (each confluent element is the L2 limit of divided differences of
 * distinct-rate sums with the same count and the same rate floor, by
 * dominated convergence on the Hermite-Genocchi simplex representation),
 * so H-CNT closures -- including s^j e^(-mu s) dressing -- are priced at
 * the SAME threshold. The LEMMA NG mechanism is not excluded here; it is
 * PRICED, for the first time, at bounded count.
 * EXACT REDUCTION at K = 1: B_n = b^n = e^(-x) for every n, so
 * LamTouch(x; 1) = e^(-2x), which the single-rate truth ATTAINS at
 * mu = m -- the bound is sharp at K = 1 and xStarTouch(1) = ln(2)/2.
 *
 * THEOREM HL-C (H-LOC from H-CNT). LamTouch(.; K) is strictly decreasing
 * with limit 0 (each B_n is strictly decreasing in x; the pointwise min
 * over a family of strictly decreasing functions is strictly decreasing),
 * so it crosses 1/2 at a unique xStarTouch(K); under H-CNT(K, m, d) with
 * x = m d > xStarTouch(K), both parities localize with thetaE^2 =
 * thetaO^2 = 1 - LamTouch > 1/2 (LEMMA R1 of imp-95211 collapses each
 * same-rate block on the far side, and is rate-structure agnostic), the
 * imp-95210 gate holds, THEOREM SL gives g = 2 sqrt(LamTouch
 * (1 - LamTouch)) and COROLLARY GC-SL instantiates gammaSL(g).
 * Threshold ladder: xStarTouch = 0.3466/2.7285/5.4543/8.3208/11.2147/
 * 14.1745/17.1715/20.1763 at K = 1..8, 47.7265 at K = 17, 97.3871 at
 * K = 33. Payoff (collapse from gammaOV = 0.9995949885454457):
 *   K = 2, m d = 4:  LamTouch = 0.07936216322307854, gammaSL = 0.6460527303360543
 *   K = 2, m d = 6:  LamTouch = 0.0031383802616614773, gammaSL = 0.5062545913595178
 *   K = 3, m d = 6:  LamTouch = 0.2537465612798684,  gammaSL = 0.8784503198142335
 *   K = 3, m d = 8:  LamTouch = 0.01577893843878122, gammaSL = 0.5310470161795909
 *
 * PROP FLOOR (the truth is not far below; closed form). The confluent
 * witness s^(K-1) e^(-m s) lies in the H-CNT(K, m, d) closure and has
 * wrong-side ratio EXACTLY Q(2K - 1, 2x) = e^(-2x) sum_{i=0}^{2K-2}
 * (2x)^i / i! (regularized upper incomplete gamma, integer shape), so
 *   sup over the class of the TRUE ratio >= Q(2K - 1, 2x) .
 * Honesty slack at the payoff rows: bound/floor = 5.77/6.01 at K = 2,
 * m d = 4/6 and 33.4/39.4 at K = 3, m d = 6/8 -- one-sided but within
 * 1.6 orders of magnitude, with BOTH sides in closed form.
 *
 * PROP NEC (count-dependence is necessary). By the imp-95215 THEOREM SZ,
 * the family mu_k = k m (k = 1, 2, ...) has divergent Szasz sum, so its
 * finite sections -- which are H-CNT(M, m, d) configurations -- have true
 * cross-seam ratio climbing to 1 at EVERY depth as the count M grows: no
 * count-free uniform bound exists for the touching class, and the
 * divergence of xStarTouch(K) in K is a property of the TRUTH, not of
 * this route.
 *
 * PROP LIN (the count price is linear, two-sidedly). Upper: taking
 * n = 2K and bounding the binomial sum by (2 + b)^n <= 3^(2K) and every
 * damping factor by b^(n-K+1) <= e^(-x(K+1)/(2K)) <= e^(-x/2) gives
 * B_2K <= e^(-x/2) 9^K, so LamTouch(x; K) <= 1/2 once x >= 4 ln(3) K +
 * ln 2: xStarTouch(K) <= 4 ln(3) K + ln 2. Lower: by the integer-shape
 * identity Q(a, y) = P(Poisson(y) <= a - 1) (repeated integration by
 * parts) and the Markov inequality P(Poisson(y) >= a) <= y/a,
 * Q(2K - 1, 2x) >= 1 - 2x/(2K - 1) > 1/2 for x < (2K - 1)/4, so the TRUE
 * class threshold -- hence any valid uniform bound threshold -- is at
 * least (2K - 1)/4. Sandwich: (2K - 1)/4 <= xTrue(K) <= xStarTouch(K)
 * <= 4 ln(3) K + ln 2. The count axis now mirrors the ratio axis: the
 * imp-95216 PROP NG-DIV proved any ratio-floor threshold diverges as
 * rho -> 1+, and PROP NEC + PROP LIN prove any count threshold grows
 * LINEARLY in K -- the NG corner is fenced on both of its axes, and
 * bounded count is proved SUFFICIENT while a ratio floor is not needed.
 *
 * CROSS-AXIS COMPARISON (no implication either way). THEOREM GC prices
 * any distinct-rate configuration through its minimal consecutive ratio
 * rho at threshold xStarGeo(rho), divergent as rho -> 1; THEOREM SI
 * prices through the count at xStarTouch(K), separation-free. At K = 2
 * and ratio 1.1: xStarTouch(2) = 2.7285 vs xStarGeo(1.1) = 25.2359 --
 * count-pricing is sharper by 9.2x where ratios are near 1, and it alone
 * covers ratio exactly 1 (confluence). On genuinely separated families
 * the old routes stay sharper (dyadic xStar = 2.6510 < xStarTouch(2),
 * and LamBar(6) = 4.2e-4 < LamTouch(6; 2) = 3.1e-3): SI buys COVERAGE
 * of the coalescence corner, not sharpness on separated turf.
 *
 * HONEST LIMITS. (a) One-sided: whether the TRUE class sup meets 1/2
 * strictly below xStarTouch(K) is open inside the sandwich window
 * ((2K-1)/4, xStarTouch(K)); the confluent K = 2 row at m d = 6 has true
 * 0.0008970129179652026 vs bound 0.0031383802616614773 (3.5x slack).
 * (b) The count must be FINITE and known: unbounded-count touching
 * families with bounded octave occupancy (convergent Szasz sum, so
 * THEOREM SZ does not eliminate them; count unbounded, so THEOREM SI does not
 * price them; no ratio floor, so THEOREM GC does not price them) remain
 * the open residual of obligation (iii) -- now the ONLY unpriced corner.
 * (c) NOT instantiated for the paper packets; the distinct-rate count of
 * the ported per-parity families is precisely part of the open
 * extraction (a finite alias grid HAS a finite count, so certificate (C)
 * may be the cheapest to extract -- it needs no separation bookkeeping
 * at all, at the price of a deeper collar, e.g. m d > 97.39 at K = 33).
 * (d) Model-family constants (sigma = 1, theta = 10) throughout; gammaSL
 * remains a cap, not a measurement; measured class sup phi = 0.3572
 * untouched.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) Proof audit: the identity is a
 * finite algebraic statement checked per rate; the contraction step is
 * integral positivity; the divided-difference bound needs phi in C^k and
 * monotone phi^(k) on (0, b] -- both hold for phi(q) = q^n, k <= n, and
 * for k > n the divided differences VANISH (binom(n, k) = 0 convention
 * keeps the formula exact). (2) The identity verified to 8.5e-15
 * residual on touching triples and to 2.5e-15 on mixed configurations;
 * the computed coefficient l1 always sits below B_n. (3) 3000-draw
 * random battery (K = 2..4, touching-biased gaps from 5e-2, random m and
 * depth, exact Cauchy Gram pairs, power iteration): no violation, worst
 * true/bound 0.228 where non-vacuous. (4) Extreme-coalescence K = 2
 * sweep with the cancellation-free closed form (gaps 1e-2 down to 1e-8):
 * no violation, and the pair value converges to the exact confluent 2x2
 * value (rel 5.2e-8 at gap 1e-8) -- the truth is continuous through
 * coalescence and the bound is uniform across it. (5) Exact K = 1
 * reduction and the ln(2)/2 threshold reproduce to rel 1e-9. (6) An
 * earlier draft attempted a count-free bound via summing all Laguerre
 * orders; it FAILS (the k-sum diverges like e^((2e-1)x)) -- consistent
 * with PROP NEC, and recorded to prevent re-derivation. (7) The gammaSL
 * chain is cross-checked against the imp-95210 baked pair.
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
import GCT from "./imp-95216-global-chain-touching-pricing.js";

// ── carried constants (single source of truth: sibling verdict objects) ─────
const LW_EVEN = BNT.constants.lwEven; // 3.9197935113802585e-5
const Q_OD = BNT.constants.q; // 0.03755392855053636
const C_U = MBU.constants.cU; // 0.30501330232499435
const KAPPA = OVC.constants.kappa; // 48.717745853978386
const GAMMA_OV = OVC.constants.gammaOV; // 0.9995949885454457
const X_STAR = DRL.constants.xStar; // 2.651017799014494

// ── new baked literals (recomputed by the assertions) ────────────────────────
// threshold ladder: unique root of LamTouch(x; K) = 1/2
const X_STAR_TOUCH_TABLE = [
  { K: 1, xStarTouch: 0.34657359027996937 },
  { K: 2, xStarTouch: 2.728476438928551 },
  { K: 3, xStarTouch: 5.454336041782639 },
  { K: 4, xStarTouch: 8.320819027104399 },
  { K: 5, xStarTouch: 11.21470185725854 },
  { K: 6, xStarTouch: 14.174510478790278 },
  { K: 7, xStarTouch: 17.171528844529206 },
  { K: 8, xStarTouch: 20.17632879294336 },
  { K: 17, xStarTouch: 47.72648029889483 },
  { K: 33, xStarTouch: 97.38710401174285 },
];
// payoff rows (touching class, no separation hypothesis)
const PAYOFF_TABLE_T = [
  {
    K: 2,
    md: 4,
    lamTouch: 0.07936216322307854,
    theta2: 0.9206378367769215,
    g: 0.5406063642675029,
    gammaSL: 0.6460527303360543,
  },
  {
    K: 2,
    md: 6,
    lamTouch: 0.0031383802616614773,
    theta2: 0.9968616197383385,
    g: 0.11186654246904551,
    gammaSL: 0.5062545913595178,
  },
  {
    K: 3,
    md: 6,
    lamTouch: 0.2537465612798684,
    theta2: 0.7462534387201316,
    g: 0.8703085519940853,
    gammaSL: 0.8784503198142335,
  },
  {
    K: 3,
    md: 8,
    lamTouch: 0.01577893843878122,
    theta2: 0.9842210615612188,
    g: 0.249238548708071,
    gammaSL: 0.5310470161795909,
  },
];
// PROP FLOOR rows: confluent witness Q(2K-1, 2x) vs the bound
const FLOOR_ROWS = [
  { K: 2, x: 4, floor: 0.013753967744002987, bound: 0.07936216322307854 },
  { K: 2, x: 6, floor: 0.0005222580500328978, bound: 0.0031383802616614773 },
  { K: 3, x: 6, floor: 0.007600390681066996, bound: 0.2537465612798684 },
  { K: 3, x: 8, floor: 0.00040043766337603034, bound: 0.01577893843878122 },
];
// canonical coalescence honesty row (K = 2, m = 1, d = 6): exact confluent 2x2
const CONF_TRUE_2_6 = 0.0008970129179652026;
const BOUND_LAM_2_6 = 0.0031383802616614773;

// ── theorem functionals ──────────────────────────────────────────────────────
// B_n(x, K) = sum_{k<K} binom(n,k) b^(n-k) (1+b)^k, b = e^(-x/n)
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
function lamTouch(x, K) {
  const s = sqrtLamTouch(x, K);
  return s * s;
}
function xStarTouch(K) {
  let lo = 1e-6;
  let hi = 4 * Math.log(3) * K + Math.log(2) + 10;
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (lamTouch(mid, K) > 0.5) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}
// PROP FLOOR: regularized upper incomplete gamma at integer shape
function upperQ(a, y) {
  let s = 0;
  let t = 1;
  for (let i = 0; i < a; i++) {
    s += t;
    t = (t * y) / (i + 1);
  }
  return Math.exp(-y) * s;
}
// Newton interpolation of phi(q) = q^n at the nodes: monomial coefficients
function newtonCoeffsSI(nodes, n) {
  const Kp = nodes.length;
  const dd = nodes.map((q) => Math.pow(q, n));
  const D = [dd[0]];
  for (let k = 1; k < Kp; k++) {
    for (let i = 0; i < Kp - k; i++) {
      dd[i] = (dd[i + 1] - dd[i]) / (nodes[i + k] - nodes[i]);
    }
    D.push(dd[0]);
  }
  let c = [D[0]];
  let omega = [1];
  for (let k = 1; k < Kp; k++) {
    const next = new Array(omega.length + 1).fill(0);
    for (let i = 0; i < omega.length; i++) {
      next[i + 1] += omega[i];
      next[i] -= nodes[k - 1] * omega[i];
    }
    omega = next;
    while (c.length < omega.length) c.push(0);
    for (let i = 0; i < omega.length; i++) c[i] += D[k] * omega[i];
  }
  return c;
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
// generalized eigenvalue of a 2x2 symmetric-definite pencil (H, G)
function gen2x2(G, H) {
  const detG = G[0][0] * G[1][1] - G[0][1] * G[0][1];
  const detH = H[0][0] * H[1][1] - H[0][1] * H[0][1];
  const c = H[0][0] * G[1][1] + H[1][1] * G[0][0] - 2 * H[0][1] * G[0][1];
  return (c + Math.sqrt(Math.max(0, c * c - 4 * detG * detH))) / (2 * detG);
}
// exact confluent K = 2 pencil on span{e^(-ms), s e^(-ms)}
function confluent2(m, d) {
  const G = [
    [1 / (2 * m), 1 / (4 * m * m)],
    [1 / (4 * m * m), 1 / (4 * m * m * m)],
  ];
  const e = Math.exp(-2 * m * d);
  const H = [
    [e / (2 * m), e * (d / (2 * m) + 1 / (4 * m * m))],
    [
      e * (d / (2 * m) + 1 / (4 * m * m)),
      e * ((d * d) / (2 * m) + d / (2 * m * m) + 1 / (4 * m * m * m)),
    ],
  ];
  return gen2x2(G, H);
}
// cancellation-free coalescing-pair closed form (rates a, b; depth d)
function pair2(a, b, d) {
  const detG = ((a - b) * (a - b)) / (4 * a * b * (a + b) * (a + b));
  const detH = Math.exp(-2 * (a + b) * d) * detG;
  const c =
    Math.pow(Math.exp(-a * d) - Math.exp(-b * d), 2) / (4 * a * b) +
    (2 * Math.exp(-(a + b) * d) * (a - b) * (a - b)) /
      (4 * a * b * (a + b) * (a + b));
  return (c + Math.sqrt(Math.max(0, c * c - 4 * detG * detH))) / (2 * detG);
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95217_SHIFT_INTERPOLATION_COUNT_PRICING = {
  ticket:
    "imp-95217 (ninth leg of the seam chain: the imp-95216 residual of obligation (iii) -- touching families WITHOUT a ratio floor, the LEMMA NG coalescence corner -- is PRICED on the count axis by THEOREM SI, with NO separation hypothesis: bounded distinct-rate count is proved SUFFICIENT, and by PROP NEC + PROP LIN the linear count price is matched by a linear necessity floor)",
  hypothesis:
    "H-CNT(K, m, d), per parity: the parity sum is a finite combination (or L2 limit of such) of two-sided exponential packets with AT MOST K distinct rates, all >= m, and every center at depth >= d on the parity side of the seam. No lacunarity, no ratio floor, no additive gap; the closure includes exactly confluent elements s^j e^(-mu s), j <= K - 1.",
  theoremSI:
    "shift-interpolation identity f(s + d) = sum_{j<K} c_j f(s + j d/n) with c_j the Newton coefficients of the interpolation of q^n at the nodes e^(-(d/n) mu_r); shifts are L2 contractions, so sqrt(LamTouch(x; K)) = min_{n>=1} sum_{k<K} binom(n,k) e^(-x(n-k)/n) (1 + e^(-x/n))^k bounds the cross-seam ratio position-uniformly, through coalescence; exact at K = 1 (LamTouch = e^(-2x), attained).",
  theoremHLC:
    "H-LOC from H-CNT: for m d > xStarTouch(K) (unique root of LamTouch = 1/2) both parities localize, the imp-95210 gate holds, and gammaSL instantiates. Ladder: xStarTouch = 0.3466/2.7285/5.4543/8.3208/11.2147/14.1745/17.1715/20.1763 at K = 1..8, 47.7265/97.3871 at K = 17/33; payoff gammaSL = 0.6460527303360543 (K = 2, m d = 4), 0.5062545913595178 (K = 2, m d = 6), 0.5310470161795909 (K = 3, m d = 8) vs gammaOV = 0.9995949885454457.",
  propFLOOR:
    "the confluent witness s^(K-1) e^(-m s) has wrong-side ratio exactly Q(2K - 1, 2x) (regularized upper incomplete gamma), a closed-form LOWER bound on the true class sup: honesty slack bound/floor = 5.77/6.01/33.4/39.4 at the four payoff rows.",
  propNEC:
    "count-dependence is necessary: the divergent-Szasz family mu_k = k m (imp-95215 THEOREM SZ) has finite sections inside H-CNT(M, m, d) whose true ratio climbs to 1 at every depth as M grows -- no count-free uniform bound exists for the touching class.",
  propLIN:
    "two-sided linear sandwich: (2K - 1)/4 <= xTrue(K) <= xStarTouch(K) <= 4 ln(3) K + ln 2. Upper: B_2K <= e^(-x/2) 9^K. Lower: Q(a, y) = P(Poisson(y) <= a - 1) plus the Markov inequality. The NG corner is now fenced on both axes: ratio-floor thresholds diverge as rho -> 1+ (imp-95216 PROP NG-DIV) and count thresholds grow linearly (here), with bounded count proved sufficient.",
  crossAxis:
    "no implication either way vs THEOREM GC: xStarTouch(2) = 2.7285 < xStarGeo(1.1) = 25.2359 (count-pricing 9.2x sharper where ratios are near 1, and it alone covers exact confluence), while on separated turf the old routes stay sharper (dyadic xStar = 2.6510 < xStarTouch(2), LamBar(6) < LamTouch(6; 2)): SI buys coverage of the coalescence corner, not sharpness on separated families.",
  constants: {
    xStarTouchTable: X_STAR_TOUCH_TABLE,
    payoffTableT: PAYOFF_TABLE_T,
    floorRows: FLOOR_ROWS,
    confTrue26: CONF_TRUE_2_6,
    boundLam26: BOUND_LAM_2_6,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, further narrowed: obligation (iii) now has THREE admissible discharge certificates, (A) lacunary shells (DR family), (B) a global consecutive-ratio floor (THEOREM GC), or (C) a bounded distinct-rate COUNT with no separation at all (THEOREM SI, threshold xStarTouch(K) linear in K). A finite alias grid has a finite count, so certificate (C) may be the cheapest to extract -- no separation bookkeeping, at the price of a deeper collar (m d > 97.39 at K = 33). Residual unpriced freedom, now the ONLY corner: UNBOUNDED-count touching families with bounded octave occupancy (Szasz-convergent, so THEOREM SZ does not eliminate them; no floor, no shells, count unbounded, so no positive theorem prices them) -- open on both sides. Remaining extraction obligations: the alias-denominator to dictionary-rate map, the per-parity certificate in form A, B or C, and the paper constants (m, d, and shell data, ratio floor, or count).",
  verdict:
    "COALESCENCE-CORNER COUNT PRICING DELIVERED (model level): THEOREM SI prices touching families with NO separation hypothesis -- the first positive theorem covering the LEMMA NG mechanism itself (confluent dressing included) -- by replacing the Cauchy biorthogonal route with a shift-interpolation identity; exact at K = 1; threshold ladder linear in the count with a matching linear necessity floor (PROP NEC via THEOREM SZ + PROP LIN Markov bound), and a closed-form truth floor Q(2K - 1, 2x) on every row. HONEST LIMITS: one-sided (3.5x slack at the canonical confluent row, 5.8-39x at the payoff rows); count must be finite and known; NOT instantiated for the paper packets; obligation (iii) not closed -- the unbounded-count bounded-occupancy touching class survives as the only unpriced corner; measured class sup phi = 0.3572 unchanged.",
  rigorScope:
    "THEOREM SI and THEOREM HL-C are unconditional model-level theorems: the identity is finite algebra verified per rate, the contraction is integral positivity, the coefficient price is the divided-difference mean value theorem plus the exact Newton-basis l1 evaluation, and the closure step is dominated convergence on the Hermite-Genocchi simplex representation. PROP FLOOR is an exact one-element computation; PROP LIN is elementary (binomial capping; integration by parts + Markov); PROP NEC imports the imp-95215 THEOREM SZ as proved. LEMMA R1 is imported as proved and rate-structure agnostic. Nothing here instantiates the paper packets; the numerics cross-check the statements and are not the claim.",
};

// ── assertions (self-executing; import-light; THROW on violation) ────────────
export const IMP95217_SIC_ASSERTIONS = [
  {
    id: "imp95217-sic-exact-k1",
    description:
      "exact K = 1 reduction: B_n(x, 1) = e^(-x) for every n so LamTouch(x; 1) = e^(-2x) (rel 1e-12 on a grid), xStarTouch(1) = ln(2)/2 (rel 1e-9), and the single-rate truth attains the bound at mu = m",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      for (const x of [0.5, 1, 2, 4, 7]) {
        if (!rel(sqrtLamTouch(x, 1), Math.exp(-x), 1e-12)) return false;
        for (const n of [1, 3, 10]) {
          if (!rel(bTermSI(n, x, 1), Math.exp(-x), 1e-12)) return false;
        }
      }
      if (!rel(xStarTouch(1), Math.log(2) / 2, 1e-9)) return false;
      return rel(trueLambdaMax([1.3], 2.1), Math.exp(-2 * 1.3 * 2.1), 1e-9);
    },
  },
  {
    id: "imp95217-sic-identity",
    description:
      "the shift-interpolation identity holds to 1e-10 relative residual on a touching triple and a mixed configuration (Newton coefficients of q^n at the nodes e^(-h mu_r)), and the computed coefficient l1 never exceeds the B_n price",
    holds: () => {
      const configs = [
        { mus: [1, 1.01, 1.05], d: 6, n: 6 },
        { mus: [1, 1.3, 4.7, 11.2], d: 5, n: 5 },
        { mus: [0.7, 0.7007, 2.4], d: 8, n: 8 },
      ];
      for (const { mus, d, n } of configs) {
        const h = d / n;
        const nodes = mus.map((mu) => Math.exp(-h * mu));
        const c = newtonCoeffsSI(nodes, n);
        for (const s of [0, 0.3, 1.1, 2.7]) {
          let lhs = 0;
          for (let j = 0; j < c.length; j++) {
            for (const mu of mus) lhs += c[j] * Math.exp(-mu * (s + j * h));
          }
          let rhs = 0;
          for (const mu of mus) rhs += Math.exp(-mu * (s + d));
          if (!(Math.abs(lhs - rhs) <= 1e-10 * Math.abs(rhs))) return false;
        }
        const tv = c.reduce((a, v) => a + Math.abs(v), 0);
        const price = bTermSI(n, Math.min(...mus) * d, mus.length);
        if (!(tv <= price * (1 + 1e-12))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95217-sic-threshold-ladder",
    description:
      "the baked xStarTouch ladder reproduces from bisection (rel 1e-9), is strictly increasing in K, and every row satisfies the PROP LIN sandwich (2K-1)/4 <= xStarTouch(K) <= 4 ln(3) K + ln 2; LamTouch is strictly decreasing in x and nondecreasing in K on grids",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      let prev = -Infinity;
      for (const row of X_STAR_TOUCH_TABLE) {
        const xs = xStarTouch(row.K);
        if (!rel(xs, row.xStarTouch, 1e-9)) return false;
        if (!(xs > prev)) return false;
        prev = xs;
        if (!(xs >= (2 * row.K - 1) / 4)) return false;
        if (!(xs <= 4 * Math.log(3) * row.K + Math.log(2))) return false;
      }
      for (const K of [2, 3, 5]) {
        let prevV = Infinity;
        for (let x = 0.5; x <= 14; x += 0.5) {
          const v = lamTouch(x, K);
          if (!(v < prevV)) return false;
          prevV = v;
        }
      }
      for (const x of [3, 6, 9]) {
        let prevK = 0;
        for (const K of [1, 2, 3, 4, 6]) {
          const v = lamTouch(x, K);
          if (!(v >= prevK)) return false;
          prevK = v;
        }
      }
      return true;
    },
  },
  {
    id: "imp95217-sic-payoff-rows",
    description:
      "the payoff rows (LamTouch, theta^2, g, gammaSL) reproduce rel 1e-9, each gammaSL sits strictly below gammaOV, each m d exceeds the baked xStarTouch(K) so THEOREM HL-C bites, and the gammaSL chain reproduces the imp-95210 baked pair (transcription guard)",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      for (const row of PAYOFF_TABLE_T) {
        const lam = lamTouch(row.md, row.K);
        if (!rel(lam, row.lamTouch, 1e-9)) return false;
        if (!rel(1 - lam, row.theta2, 1e-9)) return false;
        const g = gFromLam(lam);
        if (!rel(g, row.g, 1e-9)) return false;
        if (!rel(gammaSL(g), row.gammaSL, 1e-9)) return false;
        if (!(row.gammaSL < GAMMA_OV)) return false;
        const xs = X_STAR_TOUCH_TABLE.find((r) => r.K === row.K).xStarTouch;
        if (!(row.md > xs)) return false;
      }
      return rel(gammaSL(SML.constants.gRef), SML.constants.gammaSLRef, 1e-12);
    },
  },
  {
    id: "imp95217-sic-floor-fence",
    description:
      "PROP FLOOR rows reproduce (Q(2K-1, 2x) closed form, rel 1e-12) and sit below the bound on every row; the Markov necessity floor Q(2K-1, 2x) >= 1 - 2x/(2K-1) holds on a grid; below x = (2K-1)/4 the bound is consistently above 1/2 (nothing valid could be smaller there)",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      for (const row of FLOOR_ROWS) {
        const q = upperQ(2 * row.K - 1, 2 * row.x);
        if (!rel(q, row.floor, 1e-12)) return false;
        if (!rel(lamTouch(row.x, row.K), row.bound, 1e-9)) return false;
        if (!(row.floor < row.bound)) return false;
      }
      for (const K of [3, 5, 8]) {
        for (const x of [0.3, 0.8, (2 * K - 1) / 4 - 0.05]) {
          if (!(upperQ(2 * K - 1, 2 * x) >= 1 - (2 * x) / (2 * K - 1) - 1e-12))
            return false;
        }
        if (!(lamTouch((2 * K - 1) / 4 - 0.1, K) > 0.5)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95217-sic-coalescence-battery",
    description:
      "skeptical cross-checks through coalescence: the cancellation-free K = 2 pair value converges to the exact confluent 2x2 value (rel 1e-6 at gap 1e-8) and never exceeds the bound down to gap 1e-6; the canonical honesty row reproduces; 800 seeded random touching-biased configs (K = 2..4, exact Cauchy Gram, power iteration) never violate the bound",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      const conf = confluent2(1, 6);
      if (!rel(conf, CONF_TRUE_2_6, 1e-9)) return false;
      if (!rel(lamTouch(6, 2), BOUND_LAM_2_6, 1e-9)) return false;
      if (!rel(pair2(1, 1 + 1e-8, 6), conf, 1e-6)) return false;
      for (const gap of [1e-2, 1e-3, 1e-4, 1e-5, 1e-6]) {
        for (const x of [3, 4, 6, 8]) {
          const bnd = Math.min(1, lamTouch(x, 2));
          if (!(pair2(1, 1 + gap, x) <= bnd + 1e-9)) return false;
        }
      }
      if (!(conf < BOUND_LAM_2_6)) return false;
      let seed = 987654321;
      const rand = () => {
        seed = (1103515245 * seed + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 800; t++) {
        const K = 2 + Math.floor(rand() * 3);
        const m = 0.3 + 2 * rand();
        const mus = [m * (1 + 0.5 * rand())];
        for (let k = 1; k < K; k++) {
          const gap = 0.05 + rand() * (rand() < 0.5 ? 0.3 : 3);
          mus.push(mus[k - 1] * (1 + gap));
        }
        const d = (0.5 + 9 * rand()) / m;
        const bnd = Math.min(1, lamTouch(m * d, K));
        if (!(trueLambdaMax(mus, d) <= bnd + 1e-9)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95217-sic-cross-axis",
    description:
      "cross-axis rows: xStarTouch(2) < xStarGeo(1.1) (count-pricing sharper where ratios are near 1) while xStarTouch(2) > the dyadic xStar and LamBar(6) < LamTouch(6; 2) (old routes sharper on separated turf) -- coverage, not dominance, honestly recorded",
    holds: () => {
      const xs2 = X_STAR_TOUCH_TABLE.find((r) => r.K === 2).xStarTouch;
      const geo11 = GCT.constants.xStarGeoTable.find((r) => r.rho === 1.1).xStarGeo;
      if (!(xs2 < geo11)) return false;
      if (!(xs2 > X_STAR)) return false;
      const drl6 = DRL.constants.payoffTable.find((r) => r.md === 6);
      if (drl6 && !(drl6.lamBar < lamTouch(6, 2))) return false;
      return true;
    },
  },
  {
    id: "imp95217-sic-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap named STILL OPEN with the three-certificate discharge and the unbounded-count residual, the one-sided caveat, the non-instantiation caveat, the linear sandwich, and no QED",
    holds: () =>
      /STILL OPEN/.test(IMP95217_SHIFT_INTERPOLATION_COUNT_PRICING.subGap) &&
      /UNBOUNDED-count/.test(IMP95217_SHIFT_INTERPOLATION_COUNT_PRICING.subGap) &&
      /NOT instantiated for the paper packets/.test(
        IMP95217_SHIFT_INTERPOLATION_COUNT_PRICING.verdict,
      ) &&
      /one-sided/.test(IMP95217_SHIFT_INTERPOLATION_COUNT_PRICING.verdict) &&
      /0\.3572/.test(IMP95217_SHIFT_INTERPOLATION_COUNT_PRICING.verdict) &&
      /Markov/.test(IMP95217_SHIFT_INTERPOLATION_COUNT_PRICING.propLIN) &&
      /coverage/.test(IMP95217_SHIFT_INTERPOLATION_COUNT_PRICING.crossAxis) &&
      CONF_TRUE_2_6 < BOUND_LAM_2_6,
  },
];

for (const a of IMP95217_SIC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95217-shift-interpolation-count-pricing assertion failed: ${a.id}`,
    );
  }
}

export default IMP95217_SHIFT_INTERPOLATION_COUNT_PRICING;
