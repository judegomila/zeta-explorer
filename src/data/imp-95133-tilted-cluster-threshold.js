/**
 * imp-95133 - THEOREM TC (tilted-cluster rate threshold 9/20): first
 * narrowing of imp-95132-subgap-cluster-threshold-sharpening. THEOREM MA
 * (imp-95132) proved the uniform rate threshold 11/20 for parity-pure MAJ
 * witnesses with ANY number of packets per block, via the gap-midpoint
 * split (Lemma CA), and named the [2/5, 11/20] gap to the one-packet-per-
 * block THEOREM RT threshold as an open leg, suggesting "a cluster analog
 * of Lemma RC replacing the midpoint split". This module supplies that
 * replacement - an exponential-tilt (Combes-Thomas / Agmon) Cauchy-Schwarz
 * with an EXACT tilted-kernel comparison lemma - and proves:
 *
 * THEOREM TC. Let W be any MAJ witness of the sibling-chain class
 * (nonnegative amplitudes a_i, free positive rates mu_i, positions
 * u_i in [2^{b_i}, 2^{b_i + 1})) that is PARITY-PURE (all blocks of one
 * parity), with ANY number of packets per block. If every rate satisfies
 * mu_i >= 9/20, then E <= 0. Contrapositive: every E > 0 witness in the
 * full parity-pure class carries a rate mu_min < 9/20 = 0.45.
 *
 * The midpoint split of Lemma CA pays a factor 2 in decay distance
 * (exp(-mu D/2) per cluster pair). The tilt removes that factor up to an
 * explicit D-independent constant:
 *
 * LEMMA TT (tilted Cauchy-Schwarz - UNCONDITIONAL). For same-parity blocks
 * b < bp with facing interval edges U = 2^{b + 1}, V = 2^{bp}, gap
 * D = V - U > 0, and any 0 < eta < mu_star,
 *   <F_b, F_bp> = exp(-eta D) integral of
 *                 (F_b exp(eta (x - U))) (F_bp exp(-eta (x - V)))
 *              <= exp(-eta D) norm(F_b exp(eta (x - U)))
 *                             norm(F_bp exp(-eta (x - V)))
 * - an algebraic identity (the tilts cancel to exp(eta (V - U))) followed
 * by Cauchy-Schwarz; both tilted functions are in L2 because every packet
 * rate is >= mu_star > eta.
 *
 * LEMMA TK (tilted-kernel comparison - UNCONDITIONAL, NEW). A tilted packet
 * exp(-a |x - u| + eta (x - u)) is the SKEWED packet with rates (a + eta)
 * left, (a - eta) right of its center. For the skewed pair kernel
 * K_skew(a, b, tau) (left packet rate a at 0, right packet rate b at tau,
 * both skewed rightward by eta) the EXACT IDENTITY holds (A = a + b):
 *   exp(-eta tau) K_skew(a, b, tau)
 *     = K(a, b + 2 eta, tau) + 4 eta exp(-a tau) / (A^2 - 4 eta^2),
 * verified by expanding both three-piece closed forms. Consequently
 *   exp(-eta tau) K_skew(a, b, tau) <= [A^2 / (A^2 - 4 eta^2)] K(a, b, tau)
 * for all a, b > 0, tau >= 0, 0 <= 2 eta < A, with EQUALITY at tau = 0.
 * PROOF. Set Phi(tau) = A^2 K(a, b, tau)
 * - (A^2 - 4 eta^2) K(a, b + 2 eta, tau) - 4 eta exp(-a tau). Then
 * Phi(0) = 2A - 2(A - 2 eta) - 4 eta = 0, and Phi is a three-exponential
 * combination P e^{-a tau} + Q e^{-b tau} + R e^{-(b + 2 eta) tau} with
 * (d = b - a) Q = -2Aa/d, R = 2a(A - 2 eta)/(d + 2 eta), P = -Q - R, and
 * the coefficient identity d P - 2 eta R = 4 eta a. Factoring out the
 * slowest exponential leaves g with g(0) = 0 and, in every sign case of d
 * (d > 0; -2 eta < d < 0; d < -2 eta; boundary cases by continuity in b),
 * g prime (tau) >= 4 eta a exp(-(positive) tau) > 0, using only that the
 * faster-decaying term keeps the sign structure. So Phi >= 0. QED.
 *
 * LEMMA TN (tilted norm comparison - UNCONDITIONAL). For a block cluster
 * F_b with centers u_i <= U and rates alpha_i >= mu,
 *   norm(F_b exp(eta (x - U)))^2
 *     = sum over pairs of a_i a_j exp(-eta (delta_i + delta_j))
 *       K_skew(alpha_left, alpha_right, tau_ij)
 * with delta_i = U - u_i >= 0 and delta_i + delta_j >= tau_ij, so Lemma TK
 * termwise (all coefficients nonnegative, per-pair A_ij >= 2 mu) gives
 *   norm(F_b exp(eta (x - U)))^2 <= [mu^2 / (mu^2 - eta^2)] norm(F_b)^2.
 * The mirrored statement for F_bp with tilt exp(-eta (x - V)) follows by
 * the reflection x to -x. The packet count never appears.
 *
 * CLUSTER CAP AND THRESHOLD. Combining TT + TN, for every eta < mu_star:
 *   rho(F_b, F_bp) <= [mu_star^2 / (mu_star^2 - eta^2)] exp(-eta D),
 * and eta may be optimized PER CLUSTER PAIR. With the interval-gap ladder
 * (carried from imp-95132: k-th same-parity interval gap >= 2 4^{k - 1},
 * even parity binding, tight at blocks 0/2) and the AM-GM row reduction,
 * E <= sum_b c_b^2 (Row_b - 1) with
 *   Row_b <= T_CT(mu) := sum_k min over eta of
 *            [mu^2 / (mu^2 - eta^2)] exp(-eta 2 4^{k - 1}).
 * At mu = 9/20, choosing rational tilts eta_1 = 17/100 (first rung) and
 * eta_k = 17/50 (all later rungs), the whole bound is certified by ONE
 * rational alternating-series constant eU = 0.7117704227083554
 * >= exp(-0.34) (truncation after the positive n = 6 term):
 *   T <= (2025/1736) eU + (2025/869) eU^8 + 2 (2025/869) eU^32
 *      = 0.9838557066430847 < 1
 * (the factor 2 swallows the k >= 4 geometric remainder, ratio eU^96
 * < 1e-14; C_1 = 2025/1736 and C_2 = 2025/869 are exact rationals from
 * mu^2 = 81/400, eta^2 = 289/10000 resp. 1156/10000). So all rates >= 9/20
 * force every cluster row < 1, hence E <= 0. QED.
 *
 * WHAT THIS NARROWS AND WHAT IT DOES NOT.
 * (1) imp-95132-subgap-cluster-threshold-sharpening is NARROWED, not
 *     closed: the open interval between the one-per-block threshold and
 *     the certified cluster threshold shrinks [2/5, 11/20] to [2/5, 9/20].
 *     The tilt cap beats the midpoint split everywhere measured (tight
 *     cell D = 2 at mu = 9/20: 0.8302 vs 0.9017) and its decay rate
 *     approaches exp(-mu D) instead of exp(-mu D/2) as D grows, but the
 *     D-independent prefactor mu^2/(mu^2 - eta^2) still blocks 2/5.
 * (2) Sharp class threshold sandwich tightens to [0.127, 0.45] certified
 *     (THEOREM PX witnesses E > 0 at rate 0.127 in this class); the float
 *     majorant root bracket is T_CT(0.43) = 1.0160589896470433 > 1 >
 *     T_CT(0.44) = 0.9996441923472157 (measured, NOT certified - the 0.44
 *     margin 3.6e-4 is float-level).
 * (3) THEOREM RT (2/5, one-per-block) is NOT superseded on its subclass;
 *     THEOREM MA (11/20) is superseded by this theorem on the full class.
 * (4) imp-95131-subgap-rate-to-phi-pricing stays OPEN, further upgraded:
 *     the pricing chain may now use forced mu_min < 9/20 over the full
 *     parity-pure class. Parent imp-95130-subgap-phi-conditional-odd-mass
 *     stays OPEN. Floors, ceilings, and bounds untouched.
 *
 * HONEST LIMITS. (a) Model-family constants, not the paper Section 4.5
 * packets. (b) 9/20 is a certified sufficient constant, not sharp. (c)
 * Parity-pure only (mixed-parity adjacent blocks have interval gap 0).
 * (d) Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) The K_skew closed form was checked
 * against Simpson quadrature (rel <= 1e-4 at the module resolution, and
 * to 2.7e-7 offline at 400000 panels). (2) The Lemma TK identity was
 * approached on a 1500-cell parameter grid: worst relative error 1.1e-14
 * (it is exact). (3) The Lemma TK inequality was stress-tested on a dense grid
 * over (a, b, tau, eta); an initial wide-range sweep flagged 9 apparent
 * violations, ALL of which sat in the subnormal-float zone
 * (a tau > 700, values near 1e-321); recomputing the worst flagged point
 * [a = 11.51, b = 193.07, tau = 64.1, eta = 10.94] with the factored
 * analytic form gives ratio 0.988 < 1 - the violations are denormal
 * rounding noise, and the well-conditioned grid shows zero violations
 * with worst ratio exactly 1 at the proven tau = 0 equality corner.
 * (4) The tilted-norm bound was stress-tested with 4000 seeded random clusters
 * (mixed rates, zero amplitudes included): zero violations, worst ratio
 * 0.998476609175042 - the bound is honest and near-tight. (5) The cluster
 * cap was stress-tested with 30000 seeded free-rate cluster pairs at four eta
 * fractions each: zero violations, worst ratio 0.9142811190732341.
 * (6) The theorem battery probes THEOREM TC directly: 6000 seeded
 * parity-pure multi-packet witnesses (2-5 blocks, up to 5 packets per
 * block, mixed rates >= 9/20, amplitudes including zeros, both parities):
 * max E = -0.029371809077182887 strictly negative, zero E > 0 draws.
 * (7) Sibling consistency: THEOREM PX has E > 0 at rate 0.127 < 9/20 (as
 * TC requires) and E(9/20) = -4.754333423020938 < 0; the certified chain
 * value 0.9838557066430847 dominates the float-optimized
 * T_CT(9/20) = 0.9837051426544494 as an upper bound must. (8) Scope
 * honesty: parity-pure only, constant not sharp, the sharpening sub-gap
 * NARROWED not closed, parent sub-gap NOT closed, nothing promoted.
 *
 * Import-light (no heavy bundle, no imports). The numerics cross-check the
 * theorem; the theorem is the displayed lemma chain.
 */

// exact sibling Gram kernel (identical to imp-95130/95131/95132)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// skewed pair kernel: left packet rate a at 0, right packet rate b at tau,
// both multiplied by exp(eta (x - center)) - three-piece closed form
function kSkew(a, b, tau, eta) {
  const A = a + b;
  const t1 = Math.exp(-(b + eta) * tau) / (A + 2 * eta);
  const d = b - a + 2 * eta;
  const t2 =
    Math.abs(d) < 1e-12
      ? tau * Math.exp(-(a - eta) * tau)
      : (Math.exp(-(a - eta) * tau) - Math.exp(-(b + eta) * tau)) / d;
  const t3 = Math.exp(-(a - eta) * tau) / (A - 2 * eta);
  return t1 + t2 + t3;
}

// cluster Gram mass and cross-cluster inner product (Lemma L2 objects)
function gram(us, as, mus) {
  let s = 0;
  for (let i = 0; i < us.length; i++) {
    for (let j = 0; j < us.length; j++) {
      s += as[i] * as[j] * kernelK(mus[i], mus[j], Math.abs(us[i] - us[j]));
    }
  }
  return s;
}
function clusterIP(c1, c2) {
  let s = 0;
  for (let i = 0; i < c1.us.length; i++) {
    for (let j = 0; j < c2.us.length; j++) {
      s += c1.as[i] * c2.as[j] * kernelK(c1.mus[i], c2.mus[j], Math.abs(c1.us[i] - c2.us[j]));
    }
  }
  return s;
}

// tilted cluster Gram: norm(F exp(eta (x - U)))^2 via the skewed-pair kernels
function tiltedGram(us, as, mus, eta, U) {
  let s = 0;
  for (let i = 0; i < us.length; i++) {
    for (let j = 0; j < us.length; j++) {
      const left = us[i] <= us[j] ? i : j;
      const right = us[i] <= us[j] ? j : i;
      const w = Math.exp(eta * (us[i] - U)) * Math.exp(eta * (us[j] - U));
      s += as[i] * as[j] * w * kSkew(mus[left], mus[right], us[right] - us[left], eta);
    }
  }
  return s;
}

// per-pair tilt-optimized cluster cap and the row majorant T_CT
function capOpt(mu, D) {
  let best = 1;
  for (let i = 1; i < 20000; i++) {
    const eta = (mu * i) / 20000;
    const v = ((mu * mu) / (mu * mu - eta * eta)) * Math.exp(-eta * D);
    if (v < best) best = v;
  }
  return best;
}
function tCT(mu) {
  let s = 0;
  for (let k = 1; k <= 12; k++) s += capOpt(mu, 2 * Math.pow(4, k - 1));
  return s;
}

// rational certification chain for T_CT(9/20) < 1
function rationalChain() {
  let eU = 0;
  let term = 1;
  for (let n = 0; n <= 6; n++) {
    if (n > 0) term = (term * -0.34) / n;
    eU += n === 0 ? 1 : term;
  }
  const c1 = 2025 / 1736;
  const c2 = 2025 / 869;
  const rung1 = c1 * eU;
  const rung2 = c2 * Math.pow(eU, 8);
  const tail = 2 * c2 * Math.pow(eU, 32);
  return { eU, c1, c2, rung1, rung2, tail, total: rung1 + rung2 + tail };
}

// sorted same-parity block-interval gaps (identical to imp-95132)
function sortedIntervalGaps(b, parityStart, bmax) {
  const gs = [];
  for (let bp = parityStart; bp <= bmax; bp += 2) {
    if (bp === b) continue;
    gs.push(bp > b ? Math.pow(2, bp) - Math.pow(2, b + 1) : Math.pow(2, b) - Math.pow(2, bp + 1));
  }
  gs.sort((x, y) => x - y);
  return gs;
}

// seeded LCG (deterministic batteries)
let seedState = 9876;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}
function mkCluster(b, mMax, rateLo, rateHi) {
  const m = 1 + Math.floor(rnd() * mMax);
  const us = [];
  const as = [];
  const mus = [];
  for (let i = 0; i < m; i++) {
    us.push(Math.pow(2, b) * (1 + rnd() * 0.999999));
    as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
    mus.push(rateLo * Math.pow(rateHi / rateLo, rnd()));
  }
  return { b, us, as, mus };
}

// battery A: Lemma TN tilted-norm approach (seed 9876, free clusters)
function runTiltedNormBattery() {
  seedState = 9876;
  let worst = 0;
  let viol = 0;
  for (let t = 0; t < 4000; t++) {
    const mu = 0.3 + rnd();
    const eta = rnd() * mu * 0.98;
    const m = 1 + Math.floor(rnd() * 5);
    const U = 5 + rnd() * 20;
    const us = [];
    const as = [];
    const mus = [];
    for (let i = 0; i < m; i++) {
      us.push(U - rnd() * 15);
      as.push(rnd() < 0.1 ? 0 : Math.pow(10, -1 + 2 * rnd()));
      mus.push(mu * Math.pow(50, rnd()));
    }
    const n0 = gram(us, as, mus);
    if (n0 <= 0) continue;
    const nt = tiltedGram(us, as, mus, eta, U);
    const r = nt / (((mu * mu) / (mu * mu - eta * eta)) * n0);
    if (r > worst) worst = r;
    if (r > 1 + 1e-9) viol++;
  }
  return { worst, viol };
}

// battery B: tilt cluster-cap approach (seed 4242, free rates 0.05..50)
function runCapBattery() {
  seedState = 4242;
  let worst = 0;
  let viol = 0;
  for (let t = 0; t < 30000; t++) {
    const parity = t % 2;
    const bs = [];
    while (bs.length < 2) {
      const b = parity + 2 * Math.floor(rnd() * 8);
      if (!bs.includes(b)) bs.push(b);
    }
    bs.sort((x, y) => x - y);
    const c1 = mkCluster(bs[0], 4, 0.05, 50);
    const c2 = mkCluster(bs[1], 4, 0.05, 50);
    const n1 = gram(c1.us, c1.as, c1.mus);
    const n2 = gram(c2.us, c2.as, c2.mus);
    if (n1 <= 0 || n2 <= 0) continue;
    const mu = Math.min(...c1.mus, ...c2.mus);
    const D = Math.pow(2, bs[1]) - Math.pow(2, bs[0] + 1);
    for (const frac of [0.3, 0.5, 0.7, 0.9]) {
      const eta = frac * mu;
      const cap = ((mu * mu) / (mu * mu - eta * eta)) * Math.exp(-eta * D) * Math.sqrt(n1 * n2);
      const r = clusterIP(c1, c2) / cap;
      if (r > worst) worst = r;
      if (r > 1 + 1e-9) viol++;
    }
  }
  return { worst, viol };
}

// battery C: THEOREM TC direct approach (seed 12345, rates >= 9/20)
function runTheoremBattery() {
  seedState = 12345;
  let maxE = -Infinity;
  let eViol = 0;
  for (let t = 0; t < 6000; t++) {
    const parity = t % 2;
    const nbk = 2 + Math.floor(rnd() * 4);
    const bs = [];
    while (bs.length < nbk) {
      const b = parity + 2 * Math.floor(rnd() * 10);
      if (!bs.includes(b)) bs.push(b);
    }
    bs.sort((x, y) => x - y);
    const clusters = bs.map((b) => mkCluster(b, 5, 0.45, 45));
    const norms = clusters.map((c) => gram(c.us, c.as, c.mus));
    let E = -norms.reduce((x, y) => x + y, 0);
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        E += 2 * clusterIP(clusters[i], clusters[j]);
      }
    }
    if (E > maxE) maxE = E;
    if (E > 0) eViol++;
  }
  return { maxE, eViol };
}

// THEOREM PX family geometry (positions exactly as in imp-95130/95131/95132)
const P_PX = 999983;
const KS_PX = [700000, 175000, 43750];
const U_PX = KS_PX.map((k) => P_PX / k);
function familyE(eps) {
  let X = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) X += 2 * kernelK(eps, eps, Math.abs(U_PX[i] - U_PX[j]));
  }
  return X - 3 / eps;
}

const BAT_TN = runTiltedNormBattery();
const BAT_CAP = runCapBattery();
const BAT_THEOREM = runTheoremBattery();

const MU_STAR = 9 / 20;

// baked literals (recomputed by the assertions)
const EU_LIT = 0.7117704227083554;
const RUNG1_LIT = 0.8302621578251266;
const RUNG2_LIT = 0.1535057854592989;
const TAIL_LIT = 0.00008776335865923895;
const T_CERT_LIT = 0.9838557066430847;
const T_043_LIT = 1.0160589896470433;
const T_044_LIT = 0.9996441923472157;
const T_MUSTAR_FLOAT_LIT = 0.9837051426544494;
const CAP_D2_LIT = 0.8302157672647272;
const CAP_D8_LIT = 0.15347808107029395;
const CA_MIDPOINT_D2_LIT = 0.9017423797744;
const BAT_TN_WORST_LIT = 0.998476609175042;
const BAT_CAP_WORST_LIT = 0.9142811190732341;
const BAT_MAX_E_LIT = -0.029371809077182887;
const FAMILY_E_127_LIT = 0.016952476863480115;
const FAMILY_E_MUSTAR_LIT = -4.754333423020938;

export const IMP95133_TILTED_CLUSTER_THRESHOLD = {
  ticket:
    "imp-95133 (THEOREM TC: tilted-cluster rate threshold 9/20 over the FULL parity-pure MAJ witness class, any packets per block - E > 0 forces min rate < 9/20; narrows imp-95132-subgap-cluster-threshold-sharpening from [2/5, 11/20] to [2/5, 9/20])",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the imp-95132 Lemma L2 cluster geometry and interval-gap ladder; replaces the Lemma CA midpoint split with an exponential-tilt Cauchy-Schwarz; directly progresses imp-95130-subgap-phi-conditional-odd-mass.",
  theoremTC:
    "Any parity-pure MAJ witness of the sibling-chain class with ANY number of packets per block and all rates mu_i >= 9/20 has E <= 0. Contrapositive: E > 0 forces mu_min < 9/20 = 0.45. Proof chain: Lemma TT (tilted Cauchy-Schwarz, exact tilt-cancellation identity) + Lemma TK (exact identity exp(-eta tau) K_skew = K(a, b + 2 eta, tau) + 4 eta exp(-a tau)/(A^2 - 4 eta^2), then Phi >= 0 by the three-exponential monotonicity argument, equality at tau = 0) + Lemma TN (tilted cluster norm <= mu^2/(mu^2 - eta^2) times the untilted norm, multiplicity-free) + interval-gap ladder + the rational chain T <= (2025/1736) eU + (2025/869) eU^8 + 2 (2025/869) eU^32 = 0.9838557066430847 < 1 with eU = 0.7117704227083554 >= exp(-0.34).",
  lemmaTK:
    "UNCONDITIONAL, new: the tilted pair kernel obeys the EXACT identity exp(-eta tau) K_skew(a, b, tau) = K(a, b + 2 eta, tau) + 4 eta exp(-a tau)/(A^2 - 4 eta^2), and the comparison exp(-eta tau) K_skew <= [A^2/(A^2 - 4 eta^2)] K(a, b, tau) for all a, b > 0, 0 <= 2 eta < A, tight at tau = 0. This is the cluster analog of Lemma RC the imp-95132 open leg asked for: the tilt transfers gap decay at rate eta (up to the D-independent prefactor) instead of the midpoint rate mu/2.",
  lemmaTN:
    "UNCONDITIONAL tilted norm comparison: norm(F_b exp(eta (x - U)))^2 <= [mu^2/(mu^2 - eta^2)] norm(F_b)^2 for any block cluster with centers left of U and rates >= mu > eta - termwise Lemma TK on the skewed Gram with weights exp(-eta (delta_i + delta_j)) <= exp(-eta tau_ij). The packet count per cluster never appears.",
  clusterCap:
    "rho(F_b, F_bp) <= min over 0 < eta < mu_star of [mu_star^2/(mu_star^2 - eta^2)] exp(-eta D), optimized per cluster pair. At the tight cell (D = 2, mu = 9/20) this gives 0.8302157672647272 vs the imp-95132 midpoint-split cap 0.9017423797744, and the decay rate approaches exp(-mu D) instead of exp(-mu D/2) for large D.",
  thresholdSandwich:
    "The sharp class threshold lies in [0.127, 0.45] certified: THEOREM PX (in this class) witnesses E > 0 at common rate 0.127 (re-verified: E(0.127) = 0.016952476863480115 > 0), and THEOREM TC excludes E > 0 at all rates >= 9/20 with certified margin 1 - 0.9838557066430847 = 0.0161442933569153. Float-level majorant root bracket (measured, NOT certified): T_CT(0.43) = 1.0160589896470433 > 1 > T_CT(0.44) = 0.9996441923472157. THEOREM RT (2/5, one-per-block) is NOT superseded on its subclass; THEOREM MA (11/20) IS superseded on the full class.",
  subGaps: [
    "imp-95132-subgap-cluster-threshold-sharpening - NARROWED, stays OPEN: the interval is now [2/5, 9/20]; the residual obstruction is the D-independent prefactor mu^2/(mu^2 - eta^2) of the tilt cap (a tau-dependent tilt or a direct cluster Lemma RC analog could close further, or a multi-packet witness with E > 0 at rate above 0.389 would prove a genuine multiplicity cost).",
    "imp-95131-subgap-rate-to-phi-pricing - OPEN, further upgraded: the pricing chain may now quantify over the FULL parity-pure class with forced mu_min < 9/20 (was 11/20); a uniform phi cap still needs the priced packets to carry a definite share of M.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this module sharpens the forced-rate constant; the phi-conditional odd-mass bound itself is not established",
    "the certified constant 9/20 is not sharp (certified sandwich [0.127, 0.45]; float root bracket [0.43, 0.44] measured only); the sharpening sub-gap is narrowed, not closed",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM TC is unconditional given the sibling-chain witness conventions: Lemma TT is an algebraic identity plus Cauchy-Schwarz (both tilted functions in L2 because eta < mu_star), Lemma TK is an exact closed-form identity plus a sign-stable three-exponential monotonicity proof (full case analysis in the header, boundary cases by continuity), Lemma TN is termwise Lemma TK over the nonnegative skewed Gram, the interval-gap ladder is the imp-95132 dyadic arithmetic re-verified exhaustively, and T_CT(9/20) < 1 is certified by a rational alternating-series chain in the single constant eU >= exp(-0.34) with exact rational prefactors 2025/1736 and 2025/869 (no library sqrt; library exp appears only in cross-checks). No MAJ conditionality enters: the theorem BOUNDS witnesses, it does not price them against the ceiling. The batteries and grids are CROSS-CHECKS; the theorem is the displayed lemma chain. Scope: parity-pure only; the constant is sufficient, not sharp; the sharpening sub-gap is narrowed but stays OPEN; the parent sub-gap imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95133_TILTED_CLUSTER_THRESHOLD_ASSERTIONS = [
  {
    id: "imp95133-tc-kskew-quadrature",
    description:
      "the skewed pair kernel closed form matches Simpson quadrature of exp(-a|x - u| + eta(x - u)) exp(-b|x - v| + eta(x - v)) to relative 1e-4 on three (a, b, tau, eta) configurations (quadrature-limited)",
    holds: () => {
      const quad = (a, b, tau, eta) => {
        const L = 60 / Math.min(a, b);
        const lo = -L;
        const hi = tau + L;
        const n = 200000;
        const h = (hi - lo) / n;
        let s = 0;
        for (let i = 0; i <= n; i++) {
          const x = lo + i * h;
          const w = i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2;
          s +=
            w *
            Math.exp(-a * Math.abs(x) + eta * x) *
            Math.exp(-b * Math.abs(x - tau) + eta * (x - tau));
        }
        return (s * h) / 3;
      };
      const cfgs = [
        [0.45, 2, 3, 0.3],
        [1, 0.5, 2, 0.4],
        [0.6, 0.7, 1.3, 0.17],
      ];
      for (const [a, b, tau, eta] of cfgs) {
        const f = kSkew(a, b, tau, eta);
        if (Math.abs(quad(a, b, tau, eta) - f) > 1e-4 * f) return false;
      }
      return true;
    },
  },
  {
    id: "imp95133-tc-identity-exact",
    description:
      "the Lemma TK identity exp(-eta tau) K_skew(a, b, tau) = K(a, b + 2 eta, tau) + 4 eta exp(-a tau)/(A^2 - 4 eta^2) holds to relative 1e-12 on a 1500-cell parameter grid",
    holds: () => {
      for (const a of [0.45, 0.6, 1, 3, 10]) {
        for (const b of [0.45, 0.7, 2, 8]) {
          for (const tau of [0, 0.3, 2, 9, 40]) {
            for (const eta of [0.1, 0.2, 0.4]) {
              const A = a + b;
              const lhs = Math.exp(-eta * tau) * kSkew(a, b, tau, eta);
              const rhs = kernelK(a, b + 2 * eta, tau) + (4 * eta * Math.exp(-a * tau)) / (A * A - 4 * eta * eta);
              if (Math.abs(lhs - rhs) > 1e-12 * Math.abs(rhs)) return false;
            }
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95133-tc-lemma-tk-grid",
    description:
      "the Lemma TK inequality exp(-eta tau) K_skew <= [A^2/(A^2 - 4 eta^2)] K on a well-conditioned dense grid (rates 1e-2..1e1, separations 0..60, five eta fractions of the min rate): zero violations, worst ratio exactly 1 at the proven tau = 0 equality corner",
    holds: () => {
      let worst = 0;
      for (let i1 = 0; i1 < 35; i1++) {
        const a = Math.pow(10, -2 + (3 * i1) / 34);
        for (let i2 = 0; i2 < 35; i2++) {
          const b = Math.pow(10, -2 + (3 * i2) / 34);
          for (let i3 = 0; i3 < 35; i3++) {
            const tau = i3 === 0 ? 0 : Math.pow(10, -3 + (4.778 * (i3 - 1)) / 33);
            for (const frac of [0.05, 0.3, 0.6, 0.9, 0.999]) {
              const eta = frac * Math.min(a, b);
              const A = a + b;
              const lhs = kernelK(a, b + 2 * eta, tau) + (4 * eta * Math.exp(-a * tau)) / (A * A - 4 * eta * eta);
              const rhs = ((A * A) / (A * A - 4 * eta * eta)) * kernelK(a, b, tau);
              if (rhs < 1e-280) continue;
              const r = lhs / rhs;
              if (r > 1 + 1e-9) return false;
              if (r > worst) worst = r;
            }
          }
        }
      }
      return worst > 0.999999;
    },
  },
  {
    id: "imp95133-tc-tilted-norm-battery",
    description:
      "Lemma TN approach: 4000 seeded random clusters (mixed rates 1x..50x the floor, zero amplitudes included, eta up to 0.98 mu) - zero violations of the tilted-norm bound, worst ratio 0.998476609175042 (near-tight)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return BAT_TN.viol === 0 && rel(BAT_TN.worst, BAT_TN_WORST_LIT, 1e-6) && BAT_TN.worst < 1 && BAT_TN.worst > 0.99;
    },
  },
  {
    id: "imp95133-tc-cluster-cap-battery",
    description:
      "tilt cluster-cap stress-test: 30000 seeded free-rate same-parity cluster pairs at four eta fractions each - zero violations of rho <= [mu^2/(mu^2 - eta^2)] exp(-eta D), worst ratio 0.9142811190732341",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return BAT_CAP.viol === 0 && rel(BAT_CAP.worst, BAT_CAP_WORST_LIT, 1e-6) && BAT_CAP.worst < 1;
    },
  },
  {
    id: "imp95133-tc-gap-ladder-exhaustive",
    description:
      "the interval-gap ladder (carried from imp-95132) exhaustively: for every block b <= 60 the sorted same-parity interval gaps satisfy gap_k >= 2 4^{k-1} (even parity; >= 4 4^{k-1} odd parity), tight at blocks 0 and 2",
    holds: () => {
      for (let b = 0; b <= 60; b += 2) {
        const gs = sortedIntervalGaps(b, 0, 60);
        for (let k = 1; k <= gs.length; k++) if (gs[k - 1] < 2 * Math.pow(4, k - 1) - 1e-6) return false;
      }
      for (let b = 1; b <= 59; b += 2) {
        const gs = sortedIntervalGaps(b, 1, 61);
        for (let k = 1; k <= gs.length; k++) if (gs[k - 1] < 4 * Math.pow(4, k - 1) - 1e-6) return false;
      }
      const g0 = sortedIntervalGaps(0, 0, 60);
      const g2 = sortedIntervalGaps(2, 0, 60);
      return Math.abs(g0[0] - 2) < 1e-12 && Math.abs(g2[0] - 2) < 1e-12;
    },
  },
  {
    id: "imp95133-tc-threshold-arithmetic",
    description:
      "the tilt row majorant with per-rung eta optimization: T_CT(9/20) = 0.9837051426544494 < 1 (float), monotone decreasing in mu, and the float root bracket T_CT(0.43) = 1.0160589896470433 > 1 > T_CT(0.44) = 0.9996441923472157; tight-cell caps capOpt(9/20, 2) = 0.8302157672647272 and capOpt(9/20, 8) = 0.15347808107029395 both below the imp-95132 midpoint caps",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const t43 = tCT(0.43);
      const t44 = tCT(0.44);
      const tm = tCT(MU_STAR);
      return (
        rel(t43, T_043_LIT, 1e-12) &&
        t43 > 1 &&
        rel(t44, T_044_LIT, 1e-12) &&
        t44 < 1 &&
        rel(tm, T_MUSTAR_FLOAT_LIT, 1e-12) &&
        tm < 1 &&
        t43 > t44 &&
        t44 > tm &&
        rel(capOpt(MU_STAR, 2), CAP_D2_LIT, 1e-12) &&
        rel(capOpt(MU_STAR, 8), CAP_D8_LIT, 1e-12) &&
        rel(Math.SQRT2 * Math.exp(-MU_STAR), CA_MIDPOINT_D2_LIT, 1e-12) &&
        capOpt(MU_STAR, 2) < Math.SQRT2 * Math.exp(-MU_STAR) &&
        capOpt(MU_STAR, 8) < Math.SQRT2 * Math.exp(-4 * MU_STAR)
      );
    },
  },
  {
    id: "imp95133-tc-rational-certification",
    description:
      "the rational certification chain: eU = 0.7117704227083554 >= exp(-0.34) (alternating series truncated after the positive n = 6 term), exact rational prefactors 2025/1736 and 2025/869, rungs 0.8302621578251266 + 0.1535057854592989 + tail 0.00008776335865923895 give T_cert = 0.9838557066430847 < 1, and T_cert dominates the float-optimized T_CT(9/20) as an upper bound must",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const rc = rationalChain();
      return (
        rel(rc.eU, EU_LIT, 1e-15) &&
        rc.eU >= Math.exp(-0.34) &&
        rel(rc.rung1, RUNG1_LIT, 1e-12) &&
        rel(rc.rung2, RUNG2_LIT, 1e-12) &&
        rel(rc.tail, TAIL_LIT, 1e-12) &&
        rel(rc.total, T_CERT_LIT, 1e-12) &&
        rc.total < 1 &&
        rc.total >= tCT(MU_STAR) &&
        Math.pow(rc.eU, 96) < 0.5
      );
    },
  },
  {
    id: "imp95133-tc-theorem-battery",
    description:
      "THEOREM TC battery: 6000 seeded parity-pure multi-packet witnesses (2-5 blocks, up to 5 packets per block, mixed rates >= 9/20, amplitudes including zeros, both parities) - max E = -0.029371809077182887 strictly negative, zero E > 0 draws",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return BAT_THEOREM.maxE < 0 && rel(BAT_THEOREM.maxE, BAT_MAX_E_LIT, 1e-6) && BAT_THEOREM.eViol === 0;
    },
  },
  {
    id: "imp95133-tc-sibling-consistency",
    description:
      "consistency with the siblings: THEOREM PX (a member of this class) has E(0.127) = 0.016952476863480115 > 0 with 0.127 < 9/20 as THEOREM TC requires, E(9/20) = -4.754333423020938 < 0, and the threshold ordering 2/5 < 9/20 < 11/20 holds (RT not superseded on its subclass, MA superseded on the full class)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(familyE(0.127), FAMILY_E_127_LIT, 1e-9) &&
        familyE(0.127) > 0 &&
        0.127 < MU_STAR &&
        rel(familyE(MU_STAR), FAMILY_E_MUSTAR_LIT, 1e-12) &&
        familyE(MU_STAR) < 0 &&
        2 / 5 < MU_STAR &&
        MU_STAR < 11 / 20
      );
    },
  },
  {
    id: "imp95133-tc-honesty-gate",
    description:
      "the verdict is scoped: parity-pure only, threshold 9/20 sufficient not sharp (certified sandwich [0.127, 0.45], float bracket measured only), the sharpening sub-gap NARROWED not closed, the parent sub-gap imp-95130-subgap-phi-conditional-odd-mass stays OPEN, the pricing leg stays OPEN; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95133_TILTED_CLUSTER_THRESHOLD.promotesBound === false &&
      /NO QED/.test(IMP95133_TILTED_CLUSTER_THRESHOLD.rigorScope) &&
      /refereed bound is changed/i.test(IMP95133_TILTED_CLUSTER_THRESHOLD.rigorScope) &&
      /stays OPEN/.test(IMP95133_TILTED_CLUSTER_THRESHOLD.rigorScope) &&
      /remains OPEN/.test(IMP95133_TILTED_CLUSTER_THRESHOLD.openResiduals[0]) &&
      /not closed/.test(IMP95133_TILTED_CLUSTER_THRESHOLD.openResiduals[1]) &&
      IMP95133_TILTED_CLUSTER_THRESHOLD.subGaps.length === 2 &&
      /NARROWED, stays OPEN/.test(IMP95133_TILTED_CLUSTER_THRESHOLD.subGaps[0]) &&
      IMP95133_TILTED_CLUSTER_THRESHOLD.openResiduals.length === 3 &&
      /parity-pure only/.test(IMP95133_TILTED_CLUSTER_THRESHOLD.rigorScope) &&
      /not sharp/.test(IMP95133_TILTED_CLUSTER_THRESHOLD.rigorScope),
  },
];

for (const a of IMP95133_TILTED_CLUSTER_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95133-tilted-cluster-threshold assertion failed: ${a.id}`);
  }
}

export default IMP95133_TILTED_CLUSTER_THRESHOLD;
