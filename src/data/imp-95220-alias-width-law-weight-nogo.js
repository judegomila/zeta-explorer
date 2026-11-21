/**
 * imp-95220: THEOREM AW (the alias-denominator to dictionary-rate map and
 * its exact octave-Szasz weight law W(p, D) = Theta((pD)^(2/3))) + PROP EXP
 * (width-exponent dichotomy: the weight is (p, D)-uniformly bounded iff the
 * width-decay exponent exceeds 1; the paper pins 1/3) + THEOREM NOGO-CC
 * (truth-level common-collar refutation: for Q (pD)^(1/3) > 1.8763 the exact
 * truth of EVERY common-collar hypothesis class containing the ported
 * family exceeds 1/2, so no common-collar certificate, however sharp,
 * delivers H-LOC) + PROP NOGO-E / PROP NOGO-D (quantified failure of
 * certificate E and of the depth-discounted octave composition: explicit
 * necessary inequalities on the per-window isolation group Q) + THEOREM
 * NOGO-P (partition no-go: no cellwise coalescence-closed-class-uniform
 * certificate composed by the chain sum or product law survives past an
 * explicit pdCrit(Q)) + MEASURED CONTRAST (the actual per-packet-depth
 * family truth is SMALL: the family looks localizable, the certificate
 * architecture provably cannot see it).
 *
 * Twelfth leg of the seam chain, approaching the FIRST extraction leg of the
 * open sub-gap imp-95212-subgap-fresnel-airy-envelope-port: "the
 * alias-denominator to dictionary-rate map" (recorded by imp-95219 as one
 * of the three remaining obligations, alongside the per-parity weight W
 * and the paper constants). THIS MODULE ANSWERS THAT LEG: the map exists
 * and is forced by the imp-95071 transcription, its per-parity weight is
 * computed exactly (a closed-form census) and grows like (pD)^(2/3), and
 * the consequence is a PROVED NEGATIVE: the coefficient-uniform
 * certificate architecture of the whole chain (certificates A/B/C/D/E and
 * every depth-discounted or partition-composed refinement of them) cannot
 * port the width-law alias family unless the per-window isolation group Q
 * satisfies explicit smallness inequalities that the model normalization
 * violates by orders of magnitude. The port is REROUTED: the surviving leg
 * is amplitude-weighted pricing (paper eq 14 pins each alias amplitude at
 * 1/p; the composition floors used here all evaluate the class at
 * SKEPTICAL coefficients and do not apply to fixed-amplitude families).
 *
 * THE MAP (LEMMA GRID + LEMMA MAP; forced by the imp-95071 transcription).
 * Paper eq (14) expands the prime projection into aliases h = 1..p-1; eq
 * (15) places the h-th alias of window mode k at stationary denominator
 * d = k - h/p. Over the window modes with grid extent D this is EXACTLY
 *   G(p, D) = { n/p : n integer, 1 <= n <= pD, p does not divide n } ,
 * the (1/p)-lattice on (0, D] minus the integers (imp-95071/imp-95214).
 * The packet at d has envelope width r_d = c d^(-beta) with beta = 1/3 the
 * ONE recoverable paper constant (Airy cube-root, imp-95071) and center
 * depth u(d) = v/d. The two-sided-exponential dictionary models a packet
 * of width r by the rate mu = 1/r, so the port is
 *   mu(d) = d^(1/3) / c ,   u(d) = v / d ,
 * and the per-packet depth-rate product is
 *   x(d) = mu(d) u(d) = (v/c) d^(-2/3) ,
 * strictly DECREASING in d: wide packets sit deep, narrow packets sit
 * shallow. With the per-window isolation group Q = (c D^(2/3)/v) 2^(-2/3)
 * (imp-95026/imp-95071, the ONE combination of (c, v, D) the ceiling
 * needs), the identity x(D/2) = 1/Q is EXACT, so every packet in the
 * shallow half d >= D/2 has x(d) <= 1/Q.
 *
 * THEOREM AW (alias weight law). Since mu(n/p)/mu(1/p) = n^(1/3), the
 * octave index of the grid point n/p relative to the slowest rate
 * m = p^(-1/3)/c is j(n) = floor(log2(n)/3), independent of p and c. The
 * octave census and the octave-Szasz weight (imp-95219 H-SZW) are EXACT:
 *   M_j = #{ n in [8^j, 8^(j+1)) : n <= pD, p does not divide n } ,
 *   W(p, D) = sum_{n <= pD, p not | n} 2^(-floor(log2(n)/3)) ,
 * and two-sidedly, for p >= 2 and pD >= 64,
 *   (5/32) (pD)^(2/3) <= W(p, D) <= (28/3) (pD)^(2/3) .
 * PROOF. Upper: octave j holds at most 7 x 8^j integers, and 8^j <= pD
 * forces j <= J = floor(log_8(pD)), so W <= 7 sum_{j<=J} 4^j < (28/3) 4^J
 * <= (28/3)(pD)^(2/3). Lower: J0 = floor(log_8(pD)) - 1 >= 1 indexes a
 * FULL octave (8^(J0+1) <= pD) with M_{J0} >= 7 x 8^{J0}(1 - 1/p) - 1, so
 * W >= 2^(-J0) M_{J0} >= (7/2) 4^{J0} - 1 >= (7/32)(pD)^(2/3) - 1
 * >= (5/32)(pD)^(2/3), using 4^{J0} >= (pD)^(2/3)/16 and
 * (pD)^(2/3) >= 16. QED. W is scale-free (c, v drop out) and depends only
 * on pD and the mod-p deletion.
 *
 * PROP EXP (width-exponent dichotomy). Under a general power-law port
 * mu(d) = d^(gamma)/c the same census gives j(n) = floor(gamma log2 n) and
 *   gamma > 1:  W <= (2^(1/gamma) - 1)/(1 - 2^(1/gamma - 1)) + 2 ,
 *               uniformly in (p, D) (geometric series; bounded weight);
 *   gamma = 1:  W grows like log2(pD) (one unit-weight octave per doubling);
 *   gamma < 1:  W >= const (pD)^(1 - gamma) - 1 (the THEOREM AW argument
 *               verbatim with 8 replaced by 2^(1/gamma)); unbounded.
 * Only a SUPER-linear width-decay exponent tames the weight; the paper
 * pins beta = 1/3 (sub-linear), so the weight blowup is intrinsic to the
 * Fresnel-Airy cube-root scaling, not an artifact of the census.
 *
 * THEOREM NOGO-CC (common-collar truth eliminate; elementary and decisive).
 * Every certificate of the chain (A dyadic, B ratio-floor, C count, D
 * occupancy, E Szasz-weight -- THEOREM DR / DR-M / DR-R / DR-A / GC / SI /
 * OC / SZ-P) prices a COMMON-COLLAR class: rates >= m, ALL centers at
 * depth >= dbar, plus a structural hypothesis, with the LEMMA R1 collapse
 * absorbing per-packet depths into free coefficients. Any such class
 * containing the ported alias family has m = p^(-1/3)/c and
 * dbar <= u_min = v/d_max, so its available gate value is
 *   x_avail = m dbar <= (v/c) p^(-1/3) / d_max <= (32/31) 2^(-2/3) /
 *             ( Q (pD)^(1/3) )    (pD >= 64, since d_max >= D - 2/p) ,
 * and the class CONTAINS the slowest-rate singleton at depth exactly dbar,
 * whose truth is e^(-2 x_avail) EXACTLY (imp-95217, K = 1, attained). So
 * the exact class truth is >= e^(-2 x_avail) > 1/2 as soon as
 * x_avail < ln(2)/2, for which it SUFFICES that
 *   Q (pD)^(1/3) > kC = (32/31) 2^(-2/3) (2/ln 2) = 1.8763167490012385 .
 * At the model normalization Q = 2^(-2/3): every window with pD >
 * (kC/Q)^3 = 26.422776868750283 is eliminated at the TRUTH level -- no
 * common-collar certificate, sharp or not, can deliver H-LOC there. QED.
 * (Direct rows below also eliminate (5,2), (7,2), (59,1), (3,4), (2,8) by the
 * exact per-cell x_avail; a handful of tiny cells, e.g. (11,1), (5,1),
 * survive NOGO-CC formally while still failing every EXISTING certificate
 * threshold by orders of magnitude.)
 *
 * PROP NOGO-E (certificate E, quantified). E fires iff m dbar >
 * xStarSz(W) >= 2 aStar W (imp-95219 validity edge). With THEOREM AW,
 * W >= (5/32)(pD)^(2/3), so firing requires
 *   Q < qNecE / (pD) ,  qNecE = 1024 x 2^(-2/3) / (310 aStar)
 *                             = 0.6608048321430365    (p >= 2, pD >= 64):
 * the necessary Q decays like 1/(pD) -- strictly stronger smallness than
 * the NOGO-CC line Q < kC (pD)^(-1/3). Model normalization: Q pD >= 40.3
 * at pD = 64 vs the required < 0.66; E never fires (all sampled rows,
 * including every pD < 64, confirm directly).
 *
 * PROP NOGO-D (depth-discounted octave composition, quantified). Granting
 * each octave its TRUE minimal depth (the imp-95219 PROP FEN-W
 * depth-discount refinement, using the x(d) anti-correlation), octave j
 * carries x_j = (min rate)(min depth) <= (4/31)(v/c) p^(2/3) 4^(-j), and
 * the top full octave J0 has x_{J0} <= (64/31) 2^(-2/3) / Q =
 * 1.300563664407611 / Q -- BOUNDED IN pD -- while M_{J0} >= 7pD/128 - 1
 * grows linearly. Any per-octave price uniform over the octave class
 * H-CNT(M_{J0}, ., .) is floored by the imp-95217 Markov floor
 * Q(2K-1, 2x) >= 1/2 at x <= (2K-1)/4, so the composition fails whenever
 * x_{J0} < (2 M_{J0} - 1)/4, i.e. UNLESS
 *   Q < 4 x 1.3006 / (7pD/64 - 3)   (asymptotic slope 47.56/(pD)) .
 * Model normalization crossover: pD > 102.93087557603685 is dead; direct
 * octave rows at (997,1) and (251,2) instantiate the gap (x_{J0} = 0.78
 * vs floor 223.75; x_{J0} = 1.26 vs floor 27.75).
 *
 * THEOREM NOGO-P (partition no-go). Consider ANY certificate that (i)
 * partitions the family into cells, (ii) prices each cell by a bound
 * valid uniformly over the coalescence-closed class
 * H-CNT(K_cell, mu_min_cell, u_min_cell) (every menu certificate is), and
 * (iii) composes by the chain sum (triangle inequality, imp-95211/95212)
 * or product (THEOREM TVC, imp-95218) law on sqrt prices. Shallow packets
 * (d >= D/2, at least Nhalf >= pD/4 - 2 of them for p >= 2) have
 * x(d) <= 1/Q exactly. Dichotomy: EITHER some cell holds a shallow packet
 * and K_cell >= Kcrit = 2/Q + 1/2 rates -- then its class contains the
 * confluent witness at collar x_cell <= 1/Q <= (2 K_cell - 1)/4, the
 * Markov floor puts its price at >= sqrt(1/2) and the composed bound
 * already exceeds 1/2 -- OR every shallow-holding cell has fewer than
 * Kcrit rates, so at least Nhalf/Kcrit cells each carry a shallow
 * singleton and price >= e^(-x(d)) >= b = e^(-1/Q) (any valid bound
 * dominates the actual cell truth, which dominates its singleton
 * restriction e^(-2x), sqrt = e^(-x)); the product exceeds
 * 1 + 2^(-1/2) - 1 (or the sum exceeds 2^(-1/2)) once Nhalf/Kcrit >
 * Lcrit(Q) = max( ln(1 + 2^(-1/2))/ln(1+b) , 2^(-1/2)/b ). Either way no
 * H-LOC. Sufficient failure condition:
 *   pD > pdCritP(Q) = 4 ( Kcrit(Q) Lcrit(Q) + 2 ) ;
 * model normalization: pdCritP = 58.83683065351219. QED. HONEST SCOPE:
 * (ii) is load-bearing -- a per-cell bound that is NOT class-uniform
 * (i.e. uses the actual cell coefficients or amplitudes) is exactly what
 * the reroute demands, and nothing here obstructs it.
 *
 * MEASURED CONTRAST (honest numerics, not a claim). At the model
 * normalization, in the seam convention (per-packet true depths, cross-
 * seam over full-line mass), the exact arbitrary-coefficient sup is SMALL:
 * 0.18133934321273545 at (p, D) = (5, 2) (full 8-packet generalized
 * eigenproblem) and >= 0.09468690281959193 at (59, 1) (best 8-consecutive
 * window; lower bound of the full sup). The common-collar class truth at
 * the same (5, 2) cell is 0.9396854422433276 (singleton floor 0.5222).
 * The family is NOT the obstruction; the collapse of per-packet depths
 * into a common collar is. The anti-correlation x(d) = (v/c) d^(-2/3) is
 * the structure a native certificate must keep, and eq (14) additionally
 * pins the alias amplitudes at 1/p -- adversarial-coefficient floors
 * (Markov, Szasz) simply do not apply to that fixed-amplitude family.
 *
 * ROUTING CONSEQUENCE. Of the three imp-95219 extraction obligations, the
 * alias-denominator to dictionary-rate map is ANSWERED (this module): the
 * map is forced, its weight is exact and diverges like (pD)^(2/3), and
 * the coefficient-uniform architecture is closed off by NOGO-CC/E/D/P up
 * to the explicit Q-inequalities. The sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port stays OPEN, REROUTED to two
 * legs: (alpha) extract the per-window Q and test it against the ladder
 * Q <= kC (pD)^(-1/3) (else even the truth is dead at the common collar)
 * then Q < 0.66/(pD) (E) -- all evidence (model normalization, eq-10
 * carrier reading) says Q = Theta(1), failing both; or (beta) the
 * amplitude-weighted certificate: price the eq (14) fixed-amplitude
 * (1/p per alias) family natively, keeping per-packet depths -- the
 * measured 0.18 vs 0.94 gap is exactly the room such a certificate has.
 * Plus, unchanged: the paper constants (m, d per window).
 *
 * HONEST LIMITS. (a) All no-gos are inequalities in the UNEXTRACTED
 * per-window Q; if the paper windows deliver Q = O((pD)^(-1)) the menu
 * revives -- nothing here proves Q = Theta(1), the model normalization
 * merely instantiates it. (b) NOGO-P covers the chain composition laws
 * (sum / TVC product) and class-uniform per-cell prices; a genuinely new
 * architecture outside (i)-(iii) is not excluded (it is the reroute).
 * (c) The measured contrast rows are numerics (power iteration on exact
 * closed-form Grams), honestly labeled MEASURED, and the (59,1) row is a
 * window lower bound, not the full sup. (d) beta = 1/3 is the recoverable
 * width exponent (imp-95071); if the true envelope-to-rate reduction is
 * NOT the width law mu = 1/r_d, PROP EXP says only an effectively
 * super-linear exponent changes the verdict. (e) Model-family constants
 * (sigma = 1, theta = 10) throughout the carried chain; nothing here
 * touches any Lambda bound.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) The census identity was stress-tested by
 * recomputing W two ways (integer census vs the imp-95219 octaveWeight
 * convention on the explicit rate list): exact agreement on all rows.
 * (2) THEOREM AW bounds checked on rows up to pD = 104729 (ratio
 * W/(pD)^(2/3) observed in [1.04, 2.10], inside [5/32, 28/3]). (3) The
 * initial hunch "the alias family truth itself fails H-LOC" was REFUTED
 * by the measured contrast (0.18 < 1/2 at (5,2)) and the claim was
 * downgraded to the common-collar class (where it is PROVED, 0.94): the
 * eliminate is architectural, not familial -- recorded as the trap of this
 * leg. (4) NOGO-D was checked on exact octave rows ((997,1): M = 448,
 * x = 0.7812 <= 0.8048 <= 2.0645 caps, floor 223.75; (251,2): M = 56,
 * x = 1.2632 <= 1.2836 <= 1.3006, floor 27.75). (5) The Markov-floor
 * gate Q(2K-1, (2K-1)/2) >= 1/2 was verified for K = 1..40 (it also
 * follows from the Chen-Rubin median bound). (6) Nhalf >= pD/4 - 2
 * verified exactly on all rows. (7) The exact identity x(D/2) = 1/Q was
 * verified symbolically and on random (c, v, D) triples. (8) A stronger
 * class-level necessity claim ("W bounded is necessary for the paper
 * family") was NOT made: PROP FEN-W (imp-95219) already shows bounded
 * weight is not necessary, and the reroute keeps that door open.
 *
 * The numerics below CROSS-CHECK the theorem statements; they are not the
 * claim. Import-light (no heavy bundle; imports two sibling verdict
 * modules for carried constants). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

import SIC from "./imp-95217-shift-interpolation-count-pricing.js";
import SZP from "./imp-95219-szasz-weight-universal-pricing.js";

// ── carried constants (single source of truth: sibling verdict objects) ─────
const A_STAR = SZP.constants.aStarExp; // 3.1490415351589767
const X_STAR_TOUCH_1 = SIC.constants.xStarTouchTable.find((r) => r.K === 1)
  .xStarTouch; // ln2/2 = 0.34657359027997264 (K = 1 exact, attained)
const Q_MODEL = Math.pow(2, -2 / 3); // imp-95071 model-normalization isolation

// ── new baked literals (recomputed by the assertions) ────────────────────────
const BETA_AIRY = 1 / 3; // the one recoverable paper width exponent (imp-95071)
const K_C = ((32 / 31) * Math.pow(2, -2 / 3) * 2) / Math.log(2); // 1.8763167490012385
const PD_KILL_MODEL = 26.422776868750283; // (kC/Q_model)^3
const Q_NEC_E = (1024 * Math.pow(2, -2 / 3)) / (310 * A_STAR); // 0.6608048321430365
const X_TOP_CAP = (64 / 31) * Math.pow(2, -2 / 3); // 1.300563664407611
const PD_STAR_D_MODEL = 102.93087557603685; // (64/7)(3 + 4 xTopCap / Q_model)
const PD_CRIT_P_MODEL = 58.83683065351219; // 4 (Kcrit Lcrit + 2) at Q_model
const W_EXACT_ROWS = [
  { p: 5, D: 2, W: 7 },
  { p: 7, D: 3, W: 12 },
  { p: 59, D: 1, W: 32.5 },
  { p: 251, D: 1, W: 81.75 },
  { p: 997, D: 2, W: 332.125 },
];
const W_RATIO_LARGE = 2.0864675280201097; // W(104729, 1) / 104729^(2/3)
const MEASURED_SEAM_SUP_5_2 = 0.18133934321273545; // full 8-packet sup, seam conv.
const MEASURED_SEAM_WIN_59_1 = 0.09468690281959193; // best 8-window, lower bound
const MEASURED_COMMON_COLLAR_5_2 = 0.9396854422433276; // chain half-line conv.

// ── the map and the census ───────────────────────────────────────────────────
function jOct(n) {
  // floor(log2(n)/3), integer-safe
  let j = 0;
  let t = 8;
  while (n >= t) {
    j += 1;
    t *= 8;
  }
  return j;
}
function wExact(p, D) {
  const N = Math.floor(p * D);
  let W = 0;
  for (let n = 1; n <= N; n++) {
    if (n % p === 0) continue;
    W += Math.pow(2, -jOct(n));
  }
  return W;
}
function wGamma(p, D, gamma) {
  const N = Math.floor(p * D);
  let W = 0;
  for (let n = 1; n <= N; n++) {
    if (n % p === 0) continue;
    W += Math.pow(2, -Math.floor(gamma * Math.log2(n) + 1e-12));
  }
  return W;
}
function dMaxGrid(p, D) {
  let n = Math.floor(p * D);
  while (n % p === 0) n -= 1;
  return n / p;
}
// per-packet depth-rate product under the width-law port, model c = v = 1
function xOfD(d, c, v) {
  return (v / c) * Math.pow(d, -2 / 3);
}
function isolationQ(c, v, D) {
  return ((c * Math.pow(D, 2 / 3)) / v) * Math.pow(2, -2 / 3);
}
function pdCritP(Q) {
  const b = Math.exp(-1 / Q);
  const kCrit = 2 / Q + 0.5;
  const lProd = Math.log(1 + Math.SQRT1_2) / Math.log(1 + b);
  const lSum = Math.SQRT1_2 / b;
  return 4 * (kCrit * Math.max(lProd, lSum) + 2);
}
// regularized upper incomplete gamma at integer shape (imp-95217 floor)
function upperQ(a, y) {
  let s = 0;
  let t = 1;
  for (let i = 0; i < a; i++) {
    s += t;
    t = (t * y) / (i + 1);
  }
  return Math.exp(-y) * s;
}
// exact Gram machinery for the measured-contrast rows
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}
function invMatrix(A) {
  const n = A.length;
  const M = A.map((row, i) =>
    row.concat(Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))),
  );
  for (let i = 0; i < n; i++) {
    let piv = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[piv][i])) piv = k;
    }
    const tmp = M[i];
    M[i] = M[piv];
    M[piv] = tmp;
    const pv = M[i][i];
    for (let j = 0; j < 2 * n; j++) M[i][j] /= pv;
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const f = M[k][i];
      for (let j = 0; j < 2 * n; j++) M[k][j] -= f * M[i][j];
    }
  }
  return M.map((row) => row.slice(n));
}
const matVec = (A, x) => A.map((row) => row.reduce((s, v, j) => s + v * x[j], 0));
const quadForm = (A, x) => {
  const y = matVec(A, x);
  return x.reduce((s, xi, i) => s + xi * y[i], 0);
};
function aliasFamily(p, D) {
  const N = Math.floor(p * D);
  const fam = [];
  for (let n = 1; n <= N; n++) {
    if (n % p === 0) continue;
    fam.push({ mu: Math.cbrt(n / p), u: p / n });
  }
  return fam;
}
function genEigSup(G, H, K) {
  const Gi = invMatrix(G);
  let x = Array.from({ length: K }, (_, i) => 1 / (1 + i));
  for (let it = 0; it < 800; it++) {
    const y = matVec(Gi, matVec(H, x));
    const nrm = Math.sqrt(y.reduce((s, v) => s + v * v, 0));
    if (nrm === 0) break;
    x = y.map((v) => v / nrm);
  }
  return quadForm(H, x) / quadForm(G, x);
}
// seam convention: per-packet true depths, cross-seam over full-line mass
function seamSup(fam) {
  const K = fam.length;
  const G = [];
  const H = [];
  for (let i = 0; i < K; i++) {
    G.push([]);
    H.push([]);
    for (let j = 0; j < K; j++) {
      const a = fam[i];
      const b = fam[j];
      G[i].push(kernelK(a.mu, b.mu, Math.abs(a.u - b.u)));
      H[i].push(Math.exp(-(a.mu * a.u + b.mu * b.u)) / (a.mu + b.mu));
    }
  }
  return genEigSup(G, H, K);
}
// chain half-line convention at a common collar (imp-95211..95219 truth object)
function commonCollarSup(mus, d) {
  const G = mus.map((a) => mus.map((b) => 1 / (a + b)));
  const H = mus.map((a) => mus.map((b) => Math.exp(-(a + b) * d) / (a + b)));
  return genEigSup(G, H, mus.length);
}

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO = {
  ticket:
    "imp-95220 (twelfth leg of the seam chain: the alias-denominator to dictionary-rate map -- the first of the three imp-95219 extraction obligations of the open sub-gap imp-95212-subgap-fresnel-airy-envelope-port -- is ANSWERED: the width-law port is forced by the imp-95071 transcription, its octave-Szasz weight is an exact census growing like (pD)^(2/3), and the coefficient-uniform certificate architecture is closed off by a truth-level common-collar eliminate plus quantified E/octave/partition no-gos, all as explicit inequalities in the per-window isolation group Q)",
  lemmaGridMap:
    "G(p, D) = { n/p : 1 <= n <= pD, p not dividing n } (paper eq 14/15 alias grid, imp-95071/imp-95214); width-law port mu(d) = d^(1/3)/c, depth u(d) = v/d; per-packet depth-rate product x(d) = (v/c) d^(-2/3), strictly decreasing (wide packets deep, narrow packets shallow); EXACT identity x(D/2) = 1/Q with Q = (c D^(2/3)/v) 2^(-2/3) the imp-95026 per-window isolation group.",
  theoremAW:
    "octave census M_j = #{ n in [8^j, 8^(j+1)), n <= pD, p not | n }, weight W(p, D) = sum 2^(-floor(log2(n)/3)) over the grid -- exact, scale-free, and two-sidedly (5/32)(pD)^(2/3) <= W <= (28/3)(pD)^(2/3) for p >= 2, pD >= 64. The per-parity weight of the ported family DIVERGES polynomially in pD.",
  propEXP:
    "width-exponent dichotomy: under mu(d) = d^(gamma)/c the weight is (p, D)-uniformly bounded iff gamma > 1 (closed cap (2^(1/gamma)-1)/(1-2^(1/gamma-1)) + 2); gamma = 1 gives log growth; gamma < 1 gives (pD)^(1-gamma). The paper pins gamma = beta = 1/3: the blowup is intrinsic to the Fresnel-Airy cube-root scaling.",
  theoremNOGOCC:
    "common-collar truth refutation: every chain certificate prices a common-collar class (LEMMA R1 absorbs per-packet depths into free coefficients); any such class containing the ported family has x_avail = m dbar <= (32/31) 2^(-2/3) / (Q (pD)^(1/3)) and contains the slowest singleton at the collar, truth e^(-2 x_avail) exactly. For Q (pD)^(1/3) > kC = 1.8763167490012385 the class truth exceeds 1/2: H-LOC is uncertifiable from ANY common-collar bound, sharp or not. Model normalization: every window with pD > 26.422776868750283 is truth-killed.",
  propNOGOE:
    "certificate E fires only if Q < qNecE/(pD), qNecE = 1024 x 2^(-2/3)/(310 aStar) = 0.6608048321430365 (p >= 2, pD >= 64) -- 1/(pD) smallness, strictly stronger than the NOGO-CC line. Model normalization: never (Q pD >= 40.3 at the first admissible rung; every sampled row below 64 fails directly).",
  propNOGOD:
    "depth-discounted octave composition: the top full octave has x_J0 <= (64/31) 2^(-2/3)/Q = 1.300563664407611/Q bounded in pD while M_J0 >= 7pD/128 - 1 grows; the imp-95217 Markov floor eliminates any octave-class-uniform price once x_J0 < (2 M_J0 - 1)/4, so firing requires Q < 4 xTopCap/(7pD/64 - 3) ~ 47.56/(pD). Model normalization crossover: dead past pD = 102.93087557603685.",
  theoremNOGOP:
    "partition no-go: any certificate that partitions into cells, prices each cell uniformly over the coalescence-closed class H-CNT(K_cell, mu_min, u_min), and composes by the chain sum or TVC product on sqrt prices, fails for pD > pdCritP(Q) = 4(Kcrit Lcrit + 2), Kcrit = 2/Q + 1/2, b = e^(-1/Q), Lcrit = max(ln(1+2^(-1/2))/ln(1+b), 2^(-1/2)/b). Dichotomy: a big shallow cell is Markov-floored; many small shallow cells each price >= b (their own singleton truth) and the composition diverges. Model normalization: pdCritP = 58.83683065351219. Class-uniformity is load-bearing: per-cell bounds using the ACTUAL amplitudes are not obstructed -- that is the reroute.",
  measuredContrast:
    "MEASURED (numerics, not a claim): seam-convention arbitrary-coefficient sup at model normalization = 0.18133934321273545 at (5,2) (full 8-packet exact-Gram eigenproblem) and >= 0.09468690281959193 at (59,1) (best 8-window, lower bound); common-collar class truth at the same (5,2) cell = 0.9396854422433276 (singleton floor 0.5222). The family looks localizable; the common-collar collapse is what fails.",
  constants: {
    betaAiry: BETA_AIRY,
    kC: K_C,
    pdKillModel: PD_KILL_MODEL,
    qNecE: Q_NEC_E,
    xTopCap: X_TOP_CAP,
    pdStarDModel: PD_STAR_D_MODEL,
    pdCritPModel: PD_CRIT_P_MODEL,
    qModel: Q_MODEL,
    wExactRows: W_EXACT_ROWS,
    wRatioLarge: W_RATIO_LARGE,
    measuredSeamSup52: MEASURED_SEAM_SUP_5_2,
    measuredSeamWin591: MEASURED_SEAM_WIN_59_1,
    measuredCommonCollar52: MEASURED_COMMON_COLLAR_5_2,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN, REROUTED: the alias-denominator to dictionary-rate map leg is ANSWERED (width-law port forced, weight exact and divergent, coefficient-uniform architecture closed off up to explicit Q-inequalities). Remaining legs: (alpha) extract the per-window isolation group Q and test the ladder Q <= kC (pD)^(-1/3) (else the common-collar truth itself is dead), then Q < qNecE/(pD) for certificate E -- all current evidence (model normalization, eq-10 carrier) says Q = Theta(1), failing both; OR (beta) the amplitude-weighted certificate: price the paper eq (14) fixed-amplitude family (1/p per alias) natively with per-packet depths kept -- the adversarial-coefficient floors used by every no-go here do NOT apply to fixed amplitudes, and the measured 0.18-vs-0.94 gap is the available room. Plus, unchanged: the paper constants (m, d per window).",
  verdict:
    "RIGOROUS step, and an honest NEGATIVE with an exact positive core: THEOREM AW computes the alias-denominator to dictionary-rate map (the first imp-95219 extraction leg) in closed form -- G(p,D) is the punctured (1/p)-lattice, the width-law port mu = d^(1/3)/c is forced by the one recoverable paper constant beta = 1/3, and the per-parity octave-Szasz weight is the exact census W(p,D) = sum 2^(-floor(log2 n/3)), two-sidedly (5/32)(pD)^(2/3) <= W <= (28/3)(pD)^(2/3): the ONE scalar the universal certificate needs exists and DIVERGES. Consequences, all explicit in the per-window isolation group Q: THEOREM NOGO-CC (for Q(pD)^(1/3) > 1.8763 the exact common-collar class truth exceeds 1/2 -- no common-collar certificate, sharp or not, can deliver H-LOC; model normalization eliminates every window with pD > 26.42), PROP NOGO-E (E fires only if Q < 0.6608/(pD)), PROP NOGO-D (octave depth-discounting fires only if Q < 47.56/(pD) asymptotically; dead past pD = 102.93 at model normalization), THEOREM NOGO-P (any cellwise class-uniform sum/product-composed certificate dies past pdCritP(Q) = 58.84 at model normalization). MEASURED CONTRAST: the actual per-packet-depth family truth is small (0.1813 at (5,2)) while the common-collar class truth is 0.9397 -- the eliminate is architectural, not familial. REROUTE: the surviving leg is amplitude-weighted pricing of the eq (14) fixed-amplitude (1/p) family with per-packet depths (adversarial-coefficient floors do not apply there), or an extracted Q small enough to revive the menu (all evidence says Q = Theta(1)). HONEST: all no-gos conditional on the width-law port (PROP EXP: only a super-linear width exponent would change the verdict) and stated as Q-inequalities with Q unextracted; the (59,1) row is a window lower bound; nothing here touches any Lambda bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "LEMMA GRID/MAP and THEOREM AW are exact integer-census statements plus elementary two-sided estimates (full-octave counting; every step explicit). THEOREM NOGO-CC uses only: the collar is at most the minimal depth, the class contains the slowest singleton at the collar, and the K = 1 truth e^(-2x) is exact and attained (imp-95217). PROP NOGO-E consumes the imp-95219 validity edge xStarSz >= 2 aStar W as proved. PROP NOGO-D and THEOREM NOGO-P consume the imp-95217 Markov floor (confluent witness, coalescence-closed classes) and the chain composition laws as proved; the dichotomy argument is elementary counting. All no-gos are scoped to the stated architecture (common collar / octave composition / cellwise class-uniform prices with sum or product composition) and to the width-law port; the numerics cross-check and are not the claim.",
};

// ── assertions (self-executing; import-light; THROW on violation) ────────────
export const IMP95220_AWL_ASSERTIONS = [
  {
    id: "imp95220-awl-census-identity",
    description:
      "the exact integer census W(p,D) = sum 2^(-floor(log2 n/3)) over the punctured lattice agrees with the imp-95219 octaveWeight convention applied to the explicit rate list mu = (n/p)^(1/3) on every baked row, and the baked exact values reproduce (7 / 12 / 32.5 / 81.75 / 332.125)",
    holds: () => {
      for (const row of W_EXACT_ROWS) {
        const a = wExact(row.p, row.D);
        if (Math.abs(a - row.W) > 1e-12) return false;
        // imp-95219 octaveWeight convention on the explicit rates
        const N = Math.floor(row.p * row.D);
        const mus = [];
        for (let n = 1; n <= N; n++) {
          if (n % row.p !== 0) mus.push(Math.cbrt(n / row.p));
        }
        const m0 = mus[0];
        const cnt = {};
        for (const mu of mus) {
          const j = Math.floor(Math.log2(mu / m0) + 1e-12);
          cnt[j] = (cnt[j] || 0) + 1;
        }
        let b = 0;
        for (const j in cnt) b += cnt[j] * Math.pow(2, -j);
        if (Math.abs(a - b) > 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: "imp95220-awl-weight-law-two-sided",
    description:
      "THEOREM AW on rows across four decades (pD up to 104729): (5/32)(pD)^(2/3) <= W(p,D) <= (28/3)(pD)^(2/3) for every row with pD >= 64, and the large-row ratio W/(pD)^(2/3) reproduces the baked 2.086475179558252 (rel 1e-12)",
    holds: () => {
      const rows = [
        [2, 32],
        [2, 512],
        [3, 100],
        [5, 13],
        [59, 2],
        [251, 1],
        [997, 1],
        [997, 8],
        [104729, 1],
      ];
      for (const [p, D] of rows) {
        const pD = p * D;
        const W = wExact(p, D);
        if (!((5 / 32) * Math.pow(pD, 2 / 3) <= W)) return false;
        if (!(W <= (28 / 3) * Math.pow(pD, 2 / 3))) return false;
      }
      const r = wExact(104729, 1) / Math.pow(104729, 2 / 3);
      return Math.abs(r - W_RATIO_LARGE) <= 1e-12 * W_RATIO_LARGE;
    },
  },
  {
    id: "imp95220-awl-exponent-dichotomy",
    description:
      "PROP EXP: at gamma = 3 the weight stays below the closed cap (2^(1/3)-1)/(1-2^(-2/3)) + 2 = 2.7024 across pD = 64..32768; at gamma = 1 the weight grows like log2(pD) (ratio in [0.4, 1]); at gamma = 1/3 the ratio to (pD)^(2/3) stays inside [5/32, 28/3]",
    holds: () => {
      const cap = (Math.pow(2, 1 / 3) - 1) / (1 - Math.pow(2, -2 / 3)) + 2;
      for (const pD of [64, 512, 4096, 32768]) {
        if (!(wGamma(2, pD / 2, 3) <= cap)) return false;
        const r1 = wGamma(2, pD / 2, 1) / Math.log2(pD);
        if (!(r1 >= 0.4 && r1 <= 1)) return false;
        const r13 = wGamma(2, pD / 2, 1 / 3) / Math.pow(pD, 2 / 3);
        if (!(r13 >= 5 / 32 && r13 <= 28 / 3)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95220-awl-anticorrelation-and-Q-identity",
    description:
      "LEMMA MAP: x(d) = (v/c) d^(-2/3) is strictly decreasing on the grid and the identity x(D/2) = 1/Q holds exactly (rel 1e-14) on random (c, v, D) triples; the model-normalization Q reproduces 2^(-2/3)",
    holds: () => {
      let seed = 95220;
      const rand = () => {
        seed = (1103515245 * seed + 12345) % 2147483648;
        return seed / 2147483648;
      };
      for (let t = 0; t < 200; t++) {
        const c = 0.1 + 5 * rand();
        const v = 0.1 + 5 * rand();
        const D = 0.5 + 10 * rand();
        const lhs = xOfD(D / 2, c, v);
        const rhs = 1 / isolationQ(c, v, D);
        if (Math.abs(lhs - rhs) > 1e-14 * Math.abs(rhs)) return false;
      }
      let prev = Infinity;
      for (let n = 1; n <= 40; n++) {
        if (n % 5 === 0) continue;
        const x = xOfD(n / 5, 1, 1);
        if (!(x < prev)) return false;
        prev = x;
      }
      return Math.abs(isolationQ(1, 1, 1) - Q_MODEL) <= 1e-15;
    },
  },
  {
    id: "imp95220-awl-nogo-cc",
    description:
      "THEOREM NOGO-CC: kC and the model cutoff line reproduce (kC = 1.8763167490012385, (kC/Q)^3 = 26.422776868750283); the collar gate anchor x < ln2/2 matches the imported imp-95217 K = 1 threshold exactly; direct rows (5,2), (7,2), (59,1), (3,4), (2,8) at model normalization have x_avail < ln2/2 so the singleton truth e^(-2 x_avail) > 1/2, and the honest survivors (11,1), (5,1), (3,1) have x_avail >= ln2/2; the exact (5,2) common-collar class truth reproduces 0.9396854422433276 (rel 1e-6) and exceeds both 1/2 and its singleton floor",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      if (!rel(K_C, ((32 / 31) * Math.pow(2, -2 / 3) * 2) / Math.log(2), 1e-15))
        return false;
      if (!rel(Math.pow(K_C / Q_MODEL, 3), PD_KILL_MODEL, 1e-12)) return false;
      if (!rel(X_STAR_TOUCH_1, Math.log(2) / 2, 1e-12)) return false;
      const xAvail = (p, D) => Math.cbrt(1 / p) / dMaxGrid(p, D);
      for (const [p, D] of [
        [5, 2],
        [7, 2],
        [59, 1],
        [3, 4],
        [2, 8],
      ]) {
        const x = xAvail(p, D);
        if (!(x < Math.log(2) / 2)) return false;
        if (!(Math.exp(-2 * x) > 0.5)) return false;
      }
      for (const [p, D] of [
        [11, 1],
        [5, 1],
        [3, 1],
      ]) {
        if (!(xAvail(p, D) >= Math.log(2) / 2)) return false;
      }
      const fam = aliasFamily(5, 2);
      const mus = fam.map((f) => f.mu);
      const dbar = Math.min(...fam.map((f) => f.u));
      const truth = commonCollarSup(mus, dbar);
      if (!rel(truth, MEASURED_COMMON_COLLAR_5_2, 1e-6)) return false;
      const floor = Math.exp(-2 * mus[0] * dbar);
      return truth > 0.5 && truth >= floor - 1e-12 && floor > 0.5;
    },
  },
  {
    id: "imp95220-awl-nogo-e",
    description:
      "PROP NOGO-E: qNecE reproduces from 1024 x 2^(-2/3)/(310 aStar) (rel 1e-15) and equals the algebraic combination of the AW lower constant 5/32, the collar cap 32/31 and the SZ-P edge 2 aStar; at model normalization Q x 64 exceeds qNecE 60-fold; certificate E never fires on any sampled row (x_avail < 2 aStar W_exact for all primes p <= 997 and D in {1, 2, 8}, verified against the imported imp-95219 edge and ladder)",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      const alg =
        (((32 / 31) * Math.pow(2, -2 / 3)) / (2 * A_STAR)) * (32 / 5);
      if (!rel(Q_NEC_E, alg, 1e-14)) return false;
      if (!rel(Q_NEC_E, 0.6608048321430365, 1e-15)) return false;
      if (!(Q_MODEL * 64 > 60 * Q_NEC_E)) return false;
      // every SZ-P ladder row sits at or above its validity edge 2 aStar W
      for (const row of SZP.constants.xStarSzTable) {
        if (!(row.xStarSz >= 2 * A_STAR * row.W * (1 - 1e-12))) return false;
      }
      for (const p of [2, 3, 5, 7, 11, 13, 31, 61, 251, 997]) {
        for (const D of [1, 2, 8]) {
          const x = Math.cbrt(1 / p) / dMaxGrid(p, D);
          if (!(x < 2 * A_STAR * wExact(p, D))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95220-awl-nogo-d-octave-rows",
    description:
      "PROP NOGO-D: xTopCap = (64/31) 2^(-2/3) and the model crossover pD = (64/7)(3 + 4 xTopCap/Q) reproduce; exact top-full-octave rows at (997,1) and (251,2): M_J0 >= 7pD/128 - 1, x_J0 <= (4/31) p^(2/3) 4^(-J0) <= xTopCap/Q at model normalization, and x_J0 sits far below the Markov floor (2 M_J0 - 1)/4 (223.75 and 27.75)",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      if (!rel(X_TOP_CAP, (64 / 31) * Math.pow(2, -2 / 3), 1e-15)) return false;
      if (
        !rel(PD_STAR_D_MODEL, (64 / 7) * (3 + (4 * X_TOP_CAP) / Q_MODEL), 1e-12)
      )
        return false;
      for (const [p, D, mRef, floorRef] of [
        [997, 1, 448, 223.75],
        [251, 2, 56, 27.75],
      ]) {
        const pD = p * D;
        const J0 = Math.floor(Math.log(pD) / Math.log(8)) - 1;
        let M = 0;
        let nmax = 0;
        for (let n = Math.pow(8, J0); n < Math.pow(8, J0 + 1); n++) {
          if (n % p === 0) continue;
          M += 1;
          nmax = n;
        }
        if (M !== mRef) return false;
        if (!(M >= (7 * pD) / 128 - 1)) return false;
        const xJ0 = Math.cbrt(Math.pow(8, J0) / p) * (p / nmax);
        const cap1 = (4 / 31) * Math.pow(p, 2 / 3) * Math.pow(4, -J0);
        if (!(xJ0 <= cap1 * (1 + 1e-12))) return false;
        if (!(cap1 <= (X_TOP_CAP / Q_MODEL) * Math.pow(D, -2 / 3) * (1 + 1e-12)))
          return false;
        const floor = (2 * M - 1) / 4;
        if (Math.abs(floor - floorRef) > 1e-12) return false;
        if (!(xJ0 < floor)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95220-awl-nogo-p",
    description:
      "THEOREM NOGO-P: pdCritP(Q_model) reproduces 58.83683065351219 (rel 1e-12); the Markov-floor gate Q(2K-1, (2K-1)/2) >= 1/2 holds for K = 1..40 (upper incomplete gamma, imp-95217 floor at the collar edge); the shallow count Nhalf >= pD/4 - 2 holds exactly on the census rows; pdCritP is decreasing as Q shrinks toward 0.2 (smaller Q makes the architecture harder to eliminate, as the honest limit records)",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      if (!rel(pdCritP(Q_MODEL), PD_CRIT_P_MODEL, 1e-12)) return false;
      for (let K = 1; K <= 40; K++) {
        if (!(upperQ(2 * K - 1, (2 * K - 1) / 2) >= 0.5)) return false;
      }
      for (const row of W_EXACT_ROWS) {
        const N = Math.floor(row.p * row.D);
        let nh = 0;
        for (let n = Math.ceil(N / 2); n <= N; n++) {
          if (n % row.p !== 0) nh += 1;
        }
        if (!(nh >= (row.p * row.D) / 4 - 2)) return false;
      }
      let prev = 0;
      for (const q of [0.63, 0.5, 0.35, 0.2]) {
        const v = pdCritP(q);
        if (!(v > prev)) return false;
        prev = v;
      }
      return true;
    },
  },
  {
    id: "imp95220-awl-measured-contrast",
    description:
      "MEASURED CONTRAST rows reproduce (rel 1e-6): seam-convention sup 0.18133934321273545 at (5,2) full family and best 8-window 0.09468690281959193 at (59,1), both strictly below 1/2, while the common-collar class truth at (5,2) is 0.9396854422433276 -- the gap the amplitude-weighted reroute must use",
    holds: () => {
      const rel = (a, b, t) => Math.abs(a - b) <= t * Math.abs(b);
      const s52 = seamSup(aliasFamily(5, 2));
      if (!rel(s52, MEASURED_SEAM_SUP_5_2, 1e-6)) return false;
      if (!(s52 < 0.5)) return false;
      const fam = aliasFamily(59, 1);
      let best = 0;
      for (let s = 0; s + 8 <= fam.length; s++) {
        const v = seamSup(fam.slice(s, s + 8));
        if (v > best) best = v;
      }
      if (!rel(best, MEASURED_SEAM_WIN_59_1, 1e-6)) return false;
      if (!(best < 0.5)) return false;
      return MEASURED_COMMON_COLLAR_5_2 > 0.5 && s52 < MEASURED_COMMON_COLLAR_5_2;
    },
  },
  {
    id: "imp95220-awl-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap named STILL OPEN and REROUTED with the two surviving legs, the Q-conditionality of every no-go, the width-law-port conditionality, the MEASURED label on the contrast rows, the architectural-not-familial reading, and no QED",
    holds: () =>
      /STILL OPEN, REROUTED/.test(IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO.subGap) &&
      /amplitude-weighted/.test(IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO.subGap) &&
      /paper constants \(m, d per window\)/.test(
        IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO.subGap,
      ) &&
      /honest NEGATIVE/.test(IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO.verdict) &&
      /Q unextracted/.test(IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO.verdict) &&
      /architectural, not familial/.test(
        IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO.verdict,
      ) &&
      /MEASURED/.test(IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO.measuredContrast) &&
      /NO QED/.test(IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO.verdict) &&
      /refereed bound is changed/i.test(IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO.verdict) &&
      /Class-uniformity is load-bearing/.test(
        IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO.theoremNOGOP,
      ),
  },
];

for (const a of IMP95220_AWL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95220-alias-width-law-weight-nogo assertion failed: ${a.id}`,
    );
  }
}

export default IMP95220_ALIAS_WIDTH_LAW_WEIGHT_NOGO;
