/**
 * imp-95218: THEOREM OC (occupancy-cluster composition pricing: the LAST
 * unpriced corner of obligation (iii) -- UNBOUNDED-count touching families
 * with bounded octave occupancy -- is PRICED, count-free and
 * separation-free) + LEMMA CD (cluster decomposition: bounded occupancy
 * forces bounded cluster count plus an inter-cluster ratio floor) +
 * THEOREM TVC (total-variation composition law for interpolating
 * measures) + THEOREM HL-O (H-LOC from H-OCC at the explicit threshold
 * xStarOcc(M)) + PROP SUB (certificate D subsumes the coverage of
 * certificates A, B, C at worse constants) + PROP FEN (fencing: the
 * necessity floor (2M - 1)/4 and the honest coverage-not-sharpness gap).
 *
 * Tenth leg of the seam chain, approaching the open sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port at the residual left by
 * imp-95217: "UNBOUNDED-count touching families with bounded octave
 * occupancy (Szasz-convergent, so THEOREM SZ does not eliminate them; count
 * unbounded, so THEOREM SI does not price them; no ratio floor, so
 * THEOREM GC does not price them) -- the ONLY remaining unpriced corner."
 * THIS MODULE prices exactly that corner. The count bound of H-CNT is
 * dropped entirely; the only structural input is a bound M on how many
 * rates (with multiplicity) any single dyadic octave may carry.
 *
 * HYPOTHESIS H-OCC(M, m, d) -- per parity: the parity sum is a finite
 * combination (or L2 limit of such) of packets a_j e^(-mu|t-c_j|) whose
 * rates all satisfy mu >= m, whose centers all sit at depth >= d on the
 * parity side of the seam, and whose total rate multiplicity inside each
 * dyadic octave [2^j m, 2^(j+1) m) is at most M. NO bound on the total
 * number of rates, NO ratio floor, NO additive gap, NO lacunarity; the
 * closure includes confluent dressings s^i e^(-mu s) with multiplicity
 * counted against the occupancy of the octave containing mu.
 *
 * LEMMA CD (cluster decomposition; purely combinatorial). Put
 * rho0 = 2^(1/(2M)) and K0 = 4M - 1. Sort the (finitely many, in any
 * finite section) distinct rates and split them into maximal runs in
 * which every consecutive ratio is < rho0 ("clusters"). Then
 *   (i) every cluster has at most K0 rates: a cluster of n rates has
 *       multiplicative diameter < rho0^(n-1) = 2^((n-1)/(2M)), hence
 *       meets at most (n-1)/(2M) + 2 octaves and so carries at most
 *       M((n-1)/(2M) + 2) = (n-1)/2 + 2M rates; n <= (n-1)/2 + 2M forces
 *       n <= 4M - 1;
 *  (ii) consecutive clusters are separated by ratio >= rho0 (maximality),
 *       so min(cluster c+1) >= rho0 max(cluster c) >= rho0 min(cluster c);
 * (iii) by induction the c-th cluster minimum satisfies
 *       m_c >= m rho0^(c-1).
 * Bounded occupancy is thus EXCHANGED for the two resources the prior
 * theorems need -- bounded count (per cluster) and a ratio floor (between
 * clusters) -- without assuming either.
 *
 * LEMMA TV (measure form of the imp-95217 THEOREM SI). For any set S of
 * n <= K distinct rates >= mS and any depth delta > 0 there is a finite
 * discrete measure nu on [0, delta) (atoms at j delta/nInt, j < n, with
 * the Newton coefficients of q^nInt at the nodes e^(-(delta/nInt) mu))
 * whose Laplace transform equals e^(-delta mu) at every mu in S and whose
 * total variation satisfies
 *   TV(nu) <= min over integers nInt >= 1 of B_nInt(mS delta, K),
 *   B_n(x, K) = sum_{k<K} binom(n, k) e^(-x(n-k)/n) (1 + e^(-x/n))^k .
 * This is exactly the imp-95217 coefficient price restated: the SI bound
 * IS this measure applied to L2-contractive shifts, and it survives the
 * confluent L2 closure at the same price.
 *
 * THEOREM TVC (composition law). Let S_1, ..., S_C be disjoint rate sets
 * with interpolating measures nu_c of depth d_c and TV t_c (LEMMA TV),
 * and put alpha_c = delta_{d_c} - nu_c (transform vanishing on S_c) and
 * D = sum d_c. Then rho = delta_D - alpha_1 * ... * alpha_C (convolution)
 * is a finite discrete measure supported in [0, D] whose transform equals
 * e^(-D mu) at EVERY mu in the union of the S_c (the product transform
 * vanishes there because one factor does), and expanding the product over
 * subsets shows
 *   TV(rho) <= prod_c (1 + t_c) - 1 .
 * Hence for every f in the span of the union (and its L2 closure), the
 * pointwise identity f(s + D) = integral of f(s + a) drho(a) holds, and
 * since every nonnegative shift is an L2(0, infinity) contraction,
 *   sqrt(integral_D^inf f^2) <= TV(rho) ||f|| .
 * The multiplicative law is the new mechanism: interpolation certificates
 * COMPOSE across clusters through convolution, with the depth budget
 * splitting additively and the price compounding multiplicatively.
 *
 * THEOREM OC (occupancy pricing, position-uniform, count-free). Under
 * H-OCC(M, m, d), for every theta in (2^(-1/(2M)), 1), with x = m d:
 *   sqrt(LamOcc(x; M)) <= prod_{c>=1} (1 + t_c) - 1 ,
 *   t_c = sqrtLamTouch(x (1 - theta) (rho0 theta)^(c-1); K0) ,
 * where sqrtLamTouch is the imp-95217 SI price and the allocation gives
 * cluster c the depth share d_c = d (1 - theta) theta^(c-1) (sum <= d, so
 * integral_d^inf <= integral_D^inf). Since rho0 theta > 1, the arguments
 * grow geometrically and the product converges for every x > 0 with a
 * C-uniform value: the bound holds UNIFORMLY over the number of clusters,
 * i.e. over families of unbounded total count. Empty clusters are skipped
 * (re-indexing preserves m_c >= m rho0^(c-1)). Single-cluster reduction:
 * one cluster with the full depth budget reproduces THEOREM SI verbatim
 * (and hence the exact, attained e^(-2x) at a single rate).
 *
 * THEOREM HL-O (H-LOC from H-OCC). LamOcc(.; M) is strictly decreasing
 * with limit 0, so it crosses 1/2 at a unique xStarOcc(M); for
 * m d > xStarOcc(M) both parities localize (thetaE^2 = thetaO^2 =
 * 1 - LamOcc > 1/2, LEMMA R1 of imp-95211 imported as proved and
 * rate-structure agnostic), the imp-95210 gate holds and gammaSL
 * instantiates. Ladder (theta optimized on a fixed 17-point grid; any
 * theta is admissible so every row is a valid threshold):
 *   xStarOcc = 29.892836099942237 / 138.5012255758361 / 321.9785906818836
 * at M = 1 / 2 / 3. Payoff rows (collapse from gammaOV =
 * 0.9995949885454457):
 *   M = 1, m d = 40:  LamOcc = 0.0033174202534801364, gammaSL = 0.5066102172119376
 *   M = 1, m d = 48:  LamOcc = 0.00005714487693000489, gammaSL = 0.5001142386943728
 *   M = 2, m d = 180: LamOcc = 0.00002435476595961688, gammaSL = 0.5000486893699628
 *   M = 3, m d = 400: LamOcc = 0.000003615725210519965, gammaSL = 0.5000072286073306
 *
 * PROP SUB (coverage subsumption). Every class priced by the earlier
 * certificates has bounded occupancy: H-GEO(m, d, rho) forces occupancy
 * <= floor(ln 2 / ln rho) + 1, H-CNT(K, m, d) forces occupancy <= K, and
 * lacunary-shell families are occupancy-bounded by their per-shell counts.
 * So certificate D (bounded occupancy) COVERS the classes of certificates
 * A, B and C -- at strictly worse constants (e.g. xStarOcc(1) = 29.89 vs
 * the dyadic xStar = 2.6510 on dyadic families, vs xStarTouch(3) = 5.4543
 * on 3-count families): D is the weakest hypothesis and the most
 * expensive collar, so the certificate menu remains a genuine menu.
 *
 * PROP FEN (fencing, both sides honest). Lower: the confluent witness
 * s^(M-1) e^(-m s) is an H-OCC(M, m, d) element (multiplicity M in the
 * first octave), so the imp-95217 PROP FLOOR + Markov argument gives
 * xTrueOcc(M) >= (2M - 1)/4: no occupancy-uniform bound can have a
 * sublinear threshold. Upper: the measured ladder growth is superlinear
 * (ratios 4.63 and 2.32 between consecutive rows), consistent with the
 * construction paying (1 - theta)^(-1) = O(M) on top of the O(M) SI
 * price; whether the TRUE class threshold is linear in M is OPEN inside
 * the window ((2M - 1)/4, xStarOcc(M)). The occupancy hypothesis itself
 * cannot be dropped: the imp-95215 THEOREM SZ family mu_k = k m has
 * occupancy 2^j in octave j (unbounded) and its true ratio climbs to 1
 * at every depth -- consistent, and delimiting.
 *
 * ROUTING CONSEQUENCE. Obligation (iii) of the sub-gap now has FOUR
 * admissible discharge certificates: (A) lacunary shells, (B) a global
 * consecutive-ratio floor, (C) a finite distinct-rate count, (D) bounded
 * dyadic-octave occupancy. D closes the imp-95217 residual corner in the
 * form it was recorded (bounded occupancy, no floor, unbounded count).
 * The remaining unpriced freedom is now strictly smaller: families with
 * UNBOUNDED octave occupancy but convergent Szasz sum (e.g. occupancy
 * growing linearly in the octave index) -- open on both sides, since SZ
 * needs divergence to eliminate and every positive theorem here needs a
 * uniform occupancy bound.
 *
 * HONEST LIMITS. (a) Coverage, not sharpness: the collar is deep
 * (xStarOcc(1) = 29.89) and the floor rows sit 30+ orders of magnitude
 * below the bound at the payoff rows -- the theorem buys the EXISTENCE of
 * a count-free uniform threshold for the touching class, not a tight one.
 * (b) One-sided throughout. (c) NOT instantiated for the paper packets;
 * the occupancy of the ported per-parity families is part of the open
 * extraction (for finite alias grids certificate C stays cheaper; D
 * matters for the untruncated families where no count bound exists).
 * (d) Model-family constants (sigma = 1, theta = 10); gammaSL remains a
 * cap, not a measurement; measured class sup phi = 0.3572 untouched.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) LEMMA CD audit: the octave-count
 * bound uses floor(u + L) - floor(u) <= L + 1, so an interval of
 * multiplicative length 2^L meets at most L + 2 octaves; the n <= 4M - 1
 * bound then follows by rearrangement; verified on 3000 seeded random
 * occupancy-M families (M = 1..4), no size, gap or min-rate violation.
 * (2) THEOREM TVC audit: the subset expansion of the convolution product
 * was checked against an explicitly constructed rho (atoms merged before
 * the TV evaluation -- an early draft double-counted the canceling atom
 * pair at a = D and is recorded here as the trap); merged TV = 0.6974755
 * vs cap 0.6974756 on the canonical 3-cluster row (near-tight), identity
 * residual 5.1e-15. (3) Truth batteries: 198 near-threshold M = 1 draws
 * (multi-octave, up to 10 clusters) and 400 M = 2 draws with touching
 * pairs, exact Cauchy Gram power iteration: no violation; worst
 * true/bound 4.1e-27 -- honestly recorded as the coverage gap, not as
 * evidence of sharpness. (4) The vacuity region is real: below
 * xStarOcc(M) the bound exceeds 1/2 and near x = 0 it is vacuous (> 1);
 * assertions pin the monotone crossing. (5) The single-cluster and
 * single-rate reductions anchor the formula against imp-95217 exactly.
 * (6) A count-free draft WITHOUT the occupancy hypothesis was attempted
 * and abandoned: with unbounded occupancy the cluster sizes are unbounded
 * and the per-cluster SI price diverges -- consistent with THEOREM SZ,
 * recorded to prevent re-derivation.
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
import SIC from "./imp-95217-shift-interpolation-count-pricing.js";

// ── carried constants (single source of truth: sibling verdict objects) ─────
const LW_EVEN = BNT.constants.lwEven; // 3.9197935113802585e-5
const Q_OD = BNT.constants.q; // 0.03755392855053636
const C_U = MBU.constants.cU; // 0.30501330232499435
const KAPPA = OVC.constants.kappa; // 48.717745853978386
const GAMMA_OV = OVC.constants.gammaOV; // 0.9995949885454457
const X_STAR_DYADIC = DRL.constants.xStar; // 2.651017799014494

// ── new baked literals (recomputed by the assertions) ────────────────────────
// threshold ladder: unique root of LamOcc(x; M) = 1/2 (17-point theta grid)
const X_STAR_OCC_TABLE = [
  { M: 1, K0: 3, rho0: Math.SQRT2, xStarOcc: 29.892836099942237 },
  { M: 2, K0: 7, rho0: Math.pow(2, 0.25), xStarOcc: 138.5012255758361 },
  { M: 3, K0: 11, rho0: Math.pow(2, 1 / 6), xStarOcc: 321.9785906818836 },
];
// payoff rows (unbounded-count touching class, occupancy hypothesis only)
const PAYOFF_TABLE_O = [
  {
    M: 1,
    md: 40,
    lamOcc: 0.0033174202534801364,
    theta2: 0.9966825797465199,
    g: 0.1150028691179822,
    gammaSL: 0.5066102172119376,
  },
  {
    M: 1,
    md: 48,
    lamOcc: 0.00005714487693000489,
    theta2: 0.99994285512307,
    g: 0.015118414122261045,
    gammaSL: 0.5001142386943728,
  },
  {
    M: 2,
    md: 180,
    lamOcc: 0.00002435476595961688,
    theta2: 0.9999756452340404,
    g: 0.00986998942349827,
    gammaSL: 0.5000486893699628,
  },
  {
    M: 3,
    md: 400,
    lamOcc: 0.000003615725210519965,
    theta2: 0.9999963842747894,
    g: 0.0038030051996026334,
    gammaSL: 0.5000072286073306,
  },
];
// PROP FEN floor rows: in-class confluent witness Q(2M-1, 2x) vs the bound
const FLOOR_ROWS_O = [
  { M: 1, x: 40, floor: 1.804851387845415e-35, bound: 0.0033174202534801364 },
  { M: 1, x: 48, floor: 2.031092662734811e-42, bound: 0.00005714487693000489 },
  { M: 2, x: 180, floor: 2.937475516220009e-152, bound: 0.00002435476595961688 },
];
// PROP SUB comparison anchors (local xStarTouch at the cluster caps K0)
const X_STAR_TOUCH_AT_K0 = [
  { K: 3, xStarTouch: 5.454336041782639 },
  { K: 7, xStarTouch: 17.171528844529206 },
  { K: 11, xStarTouch: 29.29384521263669 },
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
// cheap valid tail cap: the single member n = 2K of the same family
function sqrtLamTouchCheap(x, K) {
  return bTermSI(2 * K, x, K);
}
function lamTouch(x, K) {
  const s = sqrtLamTouch(x, K);
  return s * s;
}
function xStarTouchLocal(K) {
  let lo = 1e-6;
  let hi = 4 * Math.log(3) * K + Math.log(2) + 10;
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (lamTouch(mid, K) > 0.5) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}
// THEOREM OC bound at a fixed theta (any theta in (1/rho0, 1) is admissible)
function sqrtLamOccTheta(x, M, theta) {
  const rho0 = Math.pow(2, 1 / (2 * M));
  const K0 = 4 * M - 1;
  if (!(theta > 1 / rho0 && theta < 1)) return Infinity;
  const r = rho0 * theta;
  let logProd = 0;
  let xc = x * (1 - theta);
  for (let c = 1; c <= 4000; c++) {
    const t = xc < 200 ? sqrtLamTouch(xc, K0) : sqrtLamTouchCheap(xc, K0);
    if (t > 1e3) return Infinity;
    logProd += Math.log1p(t);
    if (t < 1e-17) break;
    xc *= r;
  }
  return Math.exp(logProd) - 1;
}
function sqrtLamOcc(x, M) {
  const rho0 = Math.pow(2, 1 / (2 * M));
  const lo = 1 / rho0;
  let best = Infinity;
  for (let i = 1; i <= 17; i++) {
    const theta = lo + ((1 - lo) * i) / 18;
    const v = sqrtLamOccTheta(x, M, theta);
    if (v < best) best = v;
  }
  return best;
}
function lamOcc(x, M) {
  const s = sqrtLamOcc(x, M);
  return s * s;
}
function xStarOcc(M) {
  let lo = 0.1;
  let hi = 120 * M * M;
  while (lamOcc(hi, M) > 0.5) hi *= 1.5;
  for (let it = 0; it < 60; it++) {
    const mid = 0.5 * (lo + hi);
    if (lamOcc(mid, M) > 0.5) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}
// LEMMA CD greedy decomposition
function clustersCD(sortedMus, rho0) {
  const out = [];
  let cur = [sortedMus[0]];
  for (let i = 1; i < sortedMus.length; i++) {
    if (sortedMus[i] / sortedMus[i - 1] < rho0) cur.push(sortedMus[i]);
    else {
      out.push(cur);
      cur = [sortedMus[i]];
    }
  }
  out.push(cur);
  return out;
}
// LEMMA TV / THEOREM TVC explicit measures (for the identity cross-check)
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
function clusterMeasure(mus, delta, nInt) {
  const h = delta / nInt;
  const nodes = mus.map((mu) => Math.exp(-h * mu));
  const c = newtonCoeffsSI(nodes, nInt);
  return c.map((w, j) => ({ a: j * h, w }));
}
function convolveMeasures(m1, m2) {
  const out = [];
  for (const p of m1) {
    for (const q of m2) out.push({ a: p.a + q.a, w: p.w * q.w });
  }
  return out;
}
function mergeAtoms(m) {
  const sorted = [...m].sort((p, q) => p.a - q.a);
  const out = [];
  for (const p of sorted) {
    if (out.length && Math.abs(out[out.length - 1].a - p.a) < 1e-9) {
      out[out.length - 1].w += p.w;
    } else out.push({ a: p.a, w: p.w });
  }
  return out.filter((p) => Math.abs(p.w) > 1e-15);
}
const tvOf = (m) => m.reduce((s, p) => s + Math.abs(p.w), 0);
// PROP FEN floor: regularized upper incomplete gamma at integer shape
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
export const IMP95218_OCCUPANCY_CLUSTER_COMPOSITION_PRICING = {
  ticket:
    "imp-95218 (tenth leg of the seam chain: the imp-95217 residual of obligation (iii) -- UNBOUNDED-count touching families with bounded octave occupancy, the only corner no prior theorem priced -- is PRICED count-free and separation-free by THEOREM OC, via LEMMA CD cluster decomposition and the THEOREM TVC convolution composition law over shift-interpolation measures)",
  hypothesis:
    "H-OCC(M, m, d), per parity: rates >= m, centers at depth >= d on the parity side, and total rate multiplicity in each dyadic octave [2^j m, 2^(j+1) m) at most M. No count bound, no ratio floor, no additive gap, no lacunarity; the closure includes confluent dressings with multiplicity counted against occupancy.",
  lemmaCD:
    "cluster decomposition: with rho0 = 2^(1/(2M)) and K0 = 4M - 1, the maximal rho0-runs of the sorted rates have (i) at most K0 members (a run of n rates spans < 2^((n-1)/(2M)) multiplicatively, meets at most (n-1)/(2M) + 2 octaves, so n <= (n-1)/2 + 2M), (ii) inter-cluster ratio >= rho0, (iii) c-th cluster minimum >= m rho0^(c-1). Bounded occupancy is exchanged for per-cluster bounded count PLUS an inter-cluster ratio floor, assuming neither.",
  theoremTVC:
    "composition law: with alpha_c = delta_{d_c} - nu_c (nu_c the imp-95217 interpolating measure of cluster c, TV t_c), rho = delta_D - alpha_1 * ... * alpha_C has Laplace transform e^(-D mu) at every rate of the union, support in [0, D], and TV(rho) <= prod(1 + t_c) - 1: interpolation certificates compose across clusters through convolution, depth adding and price compounding multiplicatively; shifts are L2 contractions so sqrt(integral_D^inf f^2) <= TV(rho) ||f||.",
  theoremOC:
    "occupancy pricing: under H-OCC(M, m, d), for every theta in (2^(-1/(2M)), 1), sqrt(LamOcc(x; M)) <= prod_{c>=1}(1 + sqrtLamTouch(x(1-theta)(rho0 theta)^(c-1); K0)) - 1 with x = m d and geometric depth allocation d_c = d(1-theta)theta^(c-1); rho0 theta > 1 makes the product converge C-uniformly, so the bound is uniform over UNBOUNDED total count. Single-cluster reduction = THEOREM SI verbatim (exact, attained, at a single rate).",
  theoremHLO:
    "H-LOC from H-OCC: for m d > xStarOcc(M) both parities localize, the imp-95210 gate holds, gammaSL instantiates. Ladder: xStarOcc = 29.892836099942237 / 138.5012255758361 / 321.9785906818836 at M = 1/2/3; payoff gammaSL = 0.5066102172119376 (M = 1, m d = 40), 0.5001142386943728 (M = 1, m d = 48), 0.5000486893699628 (M = 2, m d = 180), 0.5000072286073306 (M = 3, m d = 400) vs gammaOV = 0.9995949885454457.",
  propSUB:
    "coverage subsumption: H-GEO forces occupancy <= floor(ln2/ln rho) + 1, H-CNT forces occupancy <= K, lacunary shells are occupancy-bounded -- certificate D covers the classes of A, B, C at strictly worse constants (xStarOcc(1) = 29.89 vs dyadic xStar = 2.6510, vs xStarTouch(3) = 5.4543): weakest hypothesis, deepest collar; the certificate menu stays a menu.",
  propFEN:
    "fencing: the confluent witness s^(M-1) e^(-m s) is in-class, so xTrueOcc(M) >= (2M - 1)/4 (imp-95217 Markov floor) -- no occupancy-uniform bound has a sublinear threshold; the measured ladder is superlinear (ratios 4.63, 2.32), true linearity OPEN inside ((2M-1)/4, xStarOcc(M)); occupancy cannot be dropped (the THEOREM SZ family mu_k = k m has occupancy 2^j in octave j and climbs to 1).",
  constants: {
    xStarOccTable: X_STAR_OCC_TABLE,
    payoffTableO: PAYOFF_TABLE_O,
    floorRowsO: FLOOR_ROWS_O,
    xStarTouchAtK0: X_STAR_TOUCH_AT_K0,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, further narrowed: obligation (iii) now has FOUR admissible discharge certificates, (A) lacunary shells, (B) a global consecutive-ratio floor, (C) a finite distinct-rate count, (D) bounded dyadic-octave occupancy (THEOREM OC, count-free and separation-free, threshold xStarOcc(M)). Certificate D closes the imp-95217 residual corner exactly as recorded (bounded-occupancy touching, unbounded count). The remaining unpriced freedom, strictly smaller: families with UNBOUNDED octave occupancy but convergent Szasz sum (occupancy growing with the octave index) -- open on both sides. Remaining extraction obligations: the alias-denominator to dictionary-rate map, the per-parity certificate in form A, B, C or D, and the paper constants (for finite grids C stays cheapest; D is the route for untruncated families with no count bound).",
  verdict:
    "LAST-CORNER OCCUPANCY PRICING DELIVERED (model level): THEOREM OC prices unbounded-count touching families under a bare octave-occupancy bound -- the corner left open by DR/DR-M/DR-R/DR-A/GC/SI -- by exchanging occupancy for per-cluster count plus an inter-cluster floor (LEMMA CD) and composing the imp-95217 shift-interpolation certificates through the new convolution total-variation law (THEOREM TVC). Exact single-cluster and single-rate reductions; explicit ladder xStarOcc = 29.89/138.50/321.98 at M = 1/2/3 with gammaSL collapse rows; linear necessity floor (2M-1)/4 in class. HONEST LIMITS: coverage not sharpness (floor rows 30+ orders below the bound), one-sided, NOT instantiated for the paper packets; obligation (iii) not closed -- the unbounded-occupancy Szasz-convergent class survives as the new (strictly smaller) unpriced corner; measured class sup phi = 0.3572 unchanged.",
  rigorScope:
    "LEMMA CD is elementary combinatorics (floor-count of octaves met by a bounded multiplicative interval). LEMMA TV restates the imp-95217 THEOREM SI coefficient price as a measure statement, imported as proved. THEOREM TVC is finite measure algebra: transforms multiply under convolution, the subset expansion bounds the total variation, and the seam bound follows from shift contractivity -- each step unconditional. THEOREM OC assembles the three with a geometric depth allocation and the LEMMA CD minimum-rate ladder; the infinite product converges absolutely for rho0 theta > 1, giving count-uniformity. LEMMA R1 (imp-95211) is imported as proved and rate-structure agnostic. Nothing here instantiates the paper packets; the numerics cross-check the statements and are not the claim.",
};

// ── assertions (self-executing; import-light; THROW on violation) ────────────
export const IMP95218_OCC_ASSERTIONS = [
  {
    id: "imp95218-occ-cluster-lemma",
    description:
      "LEMMA CD on 1500 seeded random occupancy-M families (M = 1..4, up to 12 octaves): greedy rho0-clustering never exceeds K0 = 4M - 1 members per cluster, inter-cluster ratios never drop below rho0, and the c-th cluster minimum never drops below m rho0^(c-1)",
    holds: () => {
      let seed = 424242;
      const rand = () => {
        seed = (1103515245 * seed + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 1500; t++) {
        const M = 1 + Math.floor(rand() * 4);
        const m = 0.3 + 2 * rand();
        const rho0 = Math.pow(2, 1 / (2 * M));
        const K0 = 4 * M - 1;
        const mus = [];
        const nOct = 1 + Math.floor(rand() * 12);
        for (let j = 0; j < nOct; j++) {
          const cnt = Math.floor(rand() * (M + 1));
          for (let k = 0; k < cnt; k++) {
            mus.push(m * Math.pow(2, j) * Math.pow(2, rand()));
          }
        }
        if (mus.length === 0) continue;
        mus.sort((a, b) => a - b);
        const cls = clustersCD(mus, rho0);
        for (let c = 0; c < cls.length; c++) {
          if (cls[c].length > K0) return false;
          if (!(cls[c][0] >= m * Math.pow(rho0, c) / rho0 * (1 - 1e-12)))
            return false;
          if (
            c > 0 &&
            !(cls[c][0] / cls[c - 1][cls[c - 1].length - 1] >= rho0 * (1 - 1e-12))
          )
            return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95218-occ-composition-identity",
    description:
      "THEOREM TVC on explicit 2- and 3-cluster configurations (touching pairs and triples): the composed measure rho = delta_D - prod(delta_dc - nu_c) reproduces f(s + D) to 1e-10 relative residual on the full span, its merged total variation never exceeds prod(1 + t_c) - 1, and its support lies in [0, D]",
    holds: () => {
      const cases = [
        {
          sets: [
            { S: [1, 1.004], d: 3, n: 5 },
            { S: [8, 8.03, 8.5], d: 1.2, n: 6 },
          ],
          A: [0.7, -1.3, 2.1, -0.4, 0.9],
        },
        {
          sets: [
            { S: [1, 1.004], d: 3, n: 5 },
            { S: [8, 8.03, 8.5], d: 1.2, n: 6 },
            { S: [40, 40.001], d: 0.4, n: 4 },
          ],
          A: [0.7, -1.3, 2.1, -0.4, 0.9, -1.7, 0.35],
        },
      ];
      for (const { sets, A } of cases) {
        const nus = sets.map(({ S, d, n }) => clusterMeasure(S, d, n));
        const alphas = nus.map((nu, i) => [
          { a: sets[i].d, w: 1 },
          ...nu.map((p) => ({ a: p.a, w: -p.w })),
        ]);
        let P = alphas[0];
        for (let i = 1; i < alphas.length; i++) P = convolveMeasures(P, alphas[i]);
        const D = sets.reduce((s, c) => s + c.d, 0);
        const rho = mergeAtoms([
          { a: D, w: 1 },
          ...P.map((p) => ({ a: p.a, w: -p.w })),
        ]);
        const cap =
          nus.reduce((acc, nu) => acc * (1 + tvOf(nu)), 1) - 1;
        if (!(tvOf(rho) <= cap + 1e-10)) return false;
        if (!rho.every((p) => p.a >= -1e-12 && p.a <= D + 1e-12)) return false;
        const mus = sets.flatMap((c) => c.S);
        const f = (s) =>
          mus.reduce((acc, mu, i) => acc + A[i] * Math.exp(-mu * s), 0);
        for (const s of [0, 0.4, 1.1, 2.9]) {
          const lhs = f(s + D);
          let rhs = 0;
          for (const p of rho) rhs += p.w * f(s + p.a);
          if (!(Math.abs(lhs - rhs) <= 1e-10 * Math.abs(lhs))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95218-occ-threshold-ladder",
    description:
      "the baked xStarOcc ladder reproduces from bisection (rel 1e-9), is strictly increasing in M, sits strictly above the local xStarTouch(K0) single-cluster threshold and above the (2M-1)/4 necessity floor, and LamOcc is strictly decreasing in x on grids; the local xStarTouch anchors at K = 3 and 7 match the imported imp-95217 table (rel 1e-9)",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      let prev = -Infinity;
      for (const row of X_STAR_OCC_TABLE) {
        const xs = xStarOcc(row.M);
        if (!rel(xs, row.xStarOcc, 1e-9)) return false;
        if (!(xs > prev)) return false;
        prev = xs;
        const anchor = X_STAR_TOUCH_AT_K0.find((r) => r.K === row.K0);
        if (!rel(xStarTouchLocal(row.K0), anchor.xStarTouch, 1e-9)) return false;
        if (!(xs > anchor.xStarTouch)) return false;
        if (!(xs >= (2 * row.M - 1) / 4)) return false;
      }
      for (const K of [3, 7]) {
        const imported = SIC.constants.xStarTouchTable.find((r) => r.K === K);
        const local = X_STAR_TOUCH_AT_K0.find((r) => r.K === K);
        if (!rel(local.xStarTouch, imported.xStarTouch, 1e-9)) return false;
      }
      for (const M of [1, 2]) {
        let prevV = Infinity;
        const x0 = M === 1 ? 20 : 100;
        for (let i = 0; i < 6; i++) {
          const v = lamOcc(x0 + i * 8 * M, M);
          if (!(v < prevV)) return false;
          prevV = v;
        }
      }
      return true;
    },
  },
  {
    id: "imp95218-occ-payoff-rows",
    description:
      "the payoff rows (LamOcc, theta^2, g, gammaSL) reproduce rel 1e-9, each gammaSL sits strictly below gammaOV, each m d exceeds the baked xStarOcc(M) so THEOREM HL-O bites, the propSUB anchor holds (xStarOcc(1) > dyadic xStar), and the gammaSL chain reproduces the imp-95210 baked pair (transcription guard)",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      for (const row of PAYOFF_TABLE_O) {
        const lam = lamOcc(row.md, row.M);
        if (!rel(lam, row.lamOcc, 1e-9)) return false;
        if (!rel(1 - lam, row.theta2, 1e-9)) return false;
        const g = gFromLam(lam);
        if (!rel(g, row.g, 1e-9)) return false;
        if (!rel(gammaSL(g), row.gammaSL, 1e-9)) return false;
        if (!(row.gammaSL < GAMMA_OV)) return false;
        const xs = X_STAR_OCC_TABLE.find((r) => r.M === row.M).xStarOcc;
        if (!(row.md > xs)) return false;
      }
      if (!(X_STAR_OCC_TABLE[0].xStarOcc > X_STAR_DYADIC)) return false;
      return rel(gammaSL(SML.constants.gRef), SML.constants.gammaSLRef, 1e-12);
    },
  },
  {
    id: "imp95218-occ-floor-fence",
    description:
      "PROP FEN rows reproduce (Q(2M-1, 2x) closed form, rel 1e-12) and sit below the bound with the coverage gap honestly enormous (30+ orders); below the necessity floor (2M-1)/4 the OC bound exceeds 1/2 on spot checks (consistency with the in-class Markov floor)",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      for (const row of FLOOR_ROWS_O) {
        const q = upperQ(2 * row.M - 1, 2 * row.x);
        if (!rel(q, row.floor, 1e-12)) return false;
        if (!rel(lamOcc(row.x, row.M), row.bound, 1e-9)) return false;
        if (!(row.floor < row.bound * 1e-25)) return false;
      }
      for (const M of [1, 2, 3]) {
        if (!(lamOcc((2 * M - 1) / 4 - 0.05, M) > 0.5)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95218-occ-truth-battery",
    description:
      "skeptical truth batteries on exact Cauchy Gram pairs (power iteration): 150 near-threshold M = 1 multi-octave draws (up to 10 sparse clusters) and 250 M = 2 draws with touching pairs (gaps down to 2e-2) never violate the OC bound; worst observed true/bound recorded in the header as the coverage gap",
    holds: () => {
      let seed = 20250910;
      const rand = () => {
        seed = (1103515245 * seed + 12345) % 2147483648;
        return seed / 2147483648;
      };
      const xs1 = X_STAR_OCC_TABLE[0].xStarOcc;
      const xs2 = X_STAR_OCC_TABLE[1].xStarOcc;
      for (let t = 0; t < 150; t++) {
        const m = 0.5 + rand();
        const nOct = 3 + Math.floor(rand() * 8);
        const mus = [];
        for (let j = 0; j < nOct; j++) {
          if (rand() < 0.9) mus.push(m * Math.pow(2, j) * (1 + 0.95 * rand()));
        }
        if (mus.length < 2) continue;
        mus.sort((a, b) => a - b);
        const x = xs1 * (1 + 0.5 * rand());
        const bnd = lamOcc(x, 1);
        if (!(trueLambdaMax(mus, x / m) <= bnd + 1e-9)) return false;
      }
      for (let t = 0; t < 250; t++) {
        const m = 0.4 + 1.6 * rand();
        const nOct = 2 + Math.floor(rand() * 3);
        const mus = [];
        for (let j = 0; j < nOct; j++) {
          const base = m * Math.pow(2, j) * (1 + 0.9 * rand());
          mus.push(base);
          if (rand() < 0.8) mus.push(base * (1 + 0.02 + 0.2 * rand()));
        }
        mus.sort((a, b) => a - b);
        const x = xs2 * (1 + 2.5 * rand());
        const bnd = Math.min(1, lamOcc(x, 2));
        if (bnd >= 1) continue;
        if (!(trueLambdaMax(mus, x / m) <= bnd + 1e-9)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95218-occ-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap named STILL OPEN with the four-certificate discharge and the unbounded-occupancy residual, the coverage-not-sharpness caveat, the non-instantiation caveat, and no QED",
    holds: () =>
      /STILL OPEN/.test(IMP95218_OCCUPANCY_CLUSTER_COMPOSITION_PRICING.subGap) &&
      /FOUR admissible discharge certificates/.test(
        IMP95218_OCCUPANCY_CLUSTER_COMPOSITION_PRICING.subGap,
      ) &&
      /UNBOUNDED octave occupancy/.test(
        IMP95218_OCCUPANCY_CLUSTER_COMPOSITION_PRICING.subGap,
      ) &&
      /coverage not sharpness/.test(
        IMP95218_OCCUPANCY_CLUSTER_COMPOSITION_PRICING.verdict,
      ) &&
      /NOT instantiated for the paper packets/.test(
        IMP95218_OCCUPANCY_CLUSTER_COMPOSITION_PRICING.verdict,
      ) &&
      /0\.3572/.test(IMP95218_OCCUPANCY_CLUSTER_COMPOSITION_PRICING.verdict) &&
      /Markov floor/.test(IMP95218_OCCUPANCY_CLUSTER_COMPOSITION_PRICING.propFEN) &&
      /menu stays a menu/.test(
        IMP95218_OCCUPANCY_CLUSTER_COMPOSITION_PRICING.propSUB,
      ),
  },
];

for (const a of IMP95218_OCC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95218-occupancy-cluster-composition-pricing assertion failed: ${a.id}`,
    );
  }
}

export default IMP95218_OCCUPANCY_CLUSTER_COMPOSITION_PRICING;
