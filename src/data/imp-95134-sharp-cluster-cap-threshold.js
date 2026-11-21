/**
 * imp-95134 - THEOREM CC (sharp cluster correlation cap + rate threshold
 * 2/5): CLOSES imp-95132-subgap-cluster-threshold-sharpening. THEOREM TC
 * (imp-95133) narrowed the cluster rate threshold to 9/20 and named the
 * residual obstruction: the D-independent prefactor mu^2/(mu^2 - eta^2) of
 * the exponential tilt, with the open interval [2/5, 9/20] to the
 * one-packet-per-block THEOREM RT constant, suggesting a tau-dependent
 * tilt or a direct cluster Lemma RC analog. This module supplies BOTH in
 * one move - a GAP-CAPPED tilt whose profile is clamped to the interval
 * gap - and proves the cluster analog of Lemma RC EXACTLY, with the SHARP
 * constant:
 *
 * THEOREM CC. Let W be any MAJ witness of the sibling-chain class
 * (nonnegative amplitudes a_i, free positive rates mu_i, positions
 * u_i in [2^{b_i}, 2^{b_i + 1})) that is PARITY-PURE (all blocks of one
 * parity), with ANY number of packets per block. If every rate satisfies
 * mu_i >= 2/5, then E <= 0. Contrapositive: every E > 0 witness in the
 * full parity-pure class carries a rate mu_min < 2/5 = 0.4. The constant
 * equals the one-packet-per-block THEOREM RT constant: the cluster
 * threshold gap is CLOSED, multiplicity is free.
 *
 * The engine is a sharp cluster correlation cap:
 *
 * CLUSTER CAP (SHARP). For same-parity blocks b < bp with facing interval
 * edges U = 2^{b + 1}, V = 2^{bp}, gap D = V - U > 0, and all rates in
 * both clusters >= mu,
 *   rho(F_b, F_bp) <= (1 + mu D) exp(-mu D),
 * ATTAINED by two rate-mu packets at the facing edges. So this cap cannot
 * be improved at the pair level; it is the exact multi-packet extension of
 * the Lemma RC form exp(-a tau)(1 + a tau).
 *
 * LEMMA GC (gap-capped tilt cancellation - UNCONDITIONAL). Set
 * phi(x) = mu clamp(x - U, 0, D) and psi(x) = mu clamp(V - x, 0, D). Then
 * phi + psi = mu D IDENTICALLY (0 + mu D left of U, mu(x - U) + mu(V - x)
 * = mu D on the gap, mu D + 0 right of V), so
 *   <F, G> = exp(-mu D) integral of (F exp(phi)) (G exp(psi))
 *         <= exp(-mu D) norm(F exp(phi)) norm(G exp(psi)).
 * Both weights are BOUNDED (<= exp(mu D)), so both tilted functions are in
 * L2 with no eta < mu restriction - the cap on the tilt profile removes
 * the imp-95133 obstruction at its root: the tilt slope may equal mu.
 *
 * LEMMA HM (half-mass - UNCONDITIONAL). For two packets with centers
 * u_i <= u_j and rates alpha (at u_i), beta (at u_j), the mass right of
 * the rightmost center is at most half the total:
 *   R = exp(-alpha tau) / (alpha + beta) satisfies K(alpha, beta, tau)
 *   - 2R = W 2 alpha / ((beta - alpha)(alpha + beta)) >= 0,
 * where W = exp(-alpha tau) - exp(-beta tau) has sign(W) = sign(beta -
 * alpha) (equal rates by continuity: K - 2R = tau exp(-alpha tau) >= 0).
 * Equality exactly at tau = 0. Hence for any U at or right of both
 * centers, the integral of p_i p_j over [U, infinity) is <= (1/2) times
 * the full pair integral.
 *
 * LEMMA GT (gap-capped tilted norm - UNCONDITIONAL). For a block cluster
 * F with all centers <= U and all rates >= mu,
 *   norm(F exp(phi))^2 <= (1 + mu D) norm(F)^2.
 * PROOF. Termwise on the nonnegative Gram. For a packet pair with rate
 * sum s = alpha_i + alpha_j >= 2 mu and h = p_i p_j (so h(x) = h(U)
 * exp(-s (x - U)) for x >= U, both centers being <= U), the weighted
 * integral has the EXACT excess identity (y = s - 2 mu >= 0):
 *   integral of h exp(2 phi) - integral of h
 *     = h(U) (2 mu / (y s)) (1 - exp(-y D)),
 * because the three pieces give h(U) [(1 - exp(-yD))/y + exp(-yD)/s] in
 * place of the untilted right tail h(U)/s, and 1/y - 1/s = 2 mu/(y s).
 * Lemma HM gives h(U)/s <= (1/2) integral of h, and (1 - exp(-yD))/y <= D
 * for all y >= 0 (with the y = 0 limit D at s = 2 mu), so the excess is
 * <= mu D times the pair mass. Summing (all coefficients nonnegative)
 * proves the bound; EQUALITY at a single rate-mu packet at the edge U.
 * The mirrored bound for G (centers >= V, weight exp(psi)) follows by the
 * reflection x to -x. The packet count never appears. QED.
 *
 * Combining GC + GT gives the sharp cap. THRESHOLD: with the AM-GM row
 * reduction and the interval-gap ladder (carried from imp-95132: k-th
 * same-parity interval gap >= 2 4^{k - 1}, even parity binding, tight at
 * blocks 0/2), every row obeys Row_b <= S(mu) = sum over k of
 * (1 + mu D_k) exp(-mu D_k), D_k = 2 4^{k - 1} - the SAME majorant as
 * THEOREM RT (whose Lemma GS center-distance ladder has the same rung
 * values), now valid for the FULL class. S(2/5) = 0.980031490781631 < 1,
 * certified by the rational chain in the single alternating-series
 * constant U8 = sum for n = 0..8 of (-4/5)^n / n! = 0.4493293064126984
 * >= exp(-4/5) (truncation after the positive n = 8 term; term magnitudes
 * decreasing from n >= 1):
 *   S(2/5) <= (9/5) U8 + (21/5) U8^4 + (69/5) U8^16 + 2 U8^32
 *          = 0.980032629073102 < 1,
 * where the 2 U8^32 term dominates the whole k >= 4 tail because
 * (1 + z) exp(-z) <= exp(-z/2) for z >= 51.2 (52.2 << exp(25.6)) and the
 * half-exponents 25.6 4^{k - 4} are geometrically dominated by twice the
 * first, with exp(-25.6) = (exp(-4/5))^32 <= U8^32. So all rates >= 2/5
 * force every row < 1, hence E <= 0. QED.
 *
 * WHAT THIS CLOSES AND WHAT IT DOES NOT.
 * (1) imp-95132-subgap-cluster-threshold-sharpening is CLOSED: the full
 *     parity-pure cluster threshold equals the one-per-block constant 2/5;
 *     the interval [2/5, 9/20] collapses. THEOREM TC (9/20) and THEOREM MA
 *     (11/20) are superseded on the full class; THEOREM RT is subsumed at
 *     the constant level (same 2/5 on its one-per-block subclass).
 * (2) The pair-level cap is SHARP (attained in-class), so any further
 *     threshold improvement must come from the AGGREGATION side (the
 *     per-pair AM-GM row reduction plus the ladder) or from a witness
 *     construction - named leg below. Certified sharp-threshold sandwich
 *     tightens to [0.127, 0.4] (THEOREM PX witnesses E > 0 at rate 0.127);
 *     float majorant root bracket S(0.388) = 1.0015903680511011 > 1 >
 *     S(0.389) = 0.9997630987245442 (measured, NOT certified).
 * (3) imp-95131-subgap-rate-to-phi-pricing stays OPEN, further upgraded:
 *     the pricing chain may now use forced mu_min < 2/5 over the full
 *     parity-pure class (was < 9/20). Parent sub-gap
 *     imp-95130-subgap-phi-conditional-odd-mass stays OPEN.
 *
 * HONEST LIMITS. (a) Model-family constants, not the paper Section 4.5
 * packets. (b) 2/5 is the certified majorant constant, not the sharp class
 * threshold (sandwich [0.127, 0.4]). (c) Parity-pure only (mixed-parity
 * adjacent blocks have interval gap 0). (d) Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) The exact gap-capped tilted pair
 * integral was checked against Simpson quadrature of the piecewise-tilted
 * product (rel <= 1e-4 at module resolution; 6.7e-7 offline at 400000
 * panels). (2) The tilt-cancellation identity phi + psi = mu D was checked
 * pointwise on a grid spanning all three pieces (exact). (3) Lemma HM was
 * approached on a rate/separation grid including extreme rate ratios: zero
 * violations, and the closed-form sign identity for K - 2R reproduces the
 * difference to rel 1e-12. (4) Lemma GT was stress-tested with 4000 seeded
 * edge-biased clusters (rates 1x..80x the floor, zero amplitudes
 * included): zero violations, worst ratio 0.9776839001577393, and the
 * edge-packet equality case gives ratio 1 to 1e-12 - the bound is tight.
 * (5) The sharp cap was stress-tested with 20000 seeded free-rate same-parity
 * cluster pairs (edge-piled every third draw): zero violations, worst
 * ratio 0.9912983587463579, and the two-edge-packet attainment
 * configuration gives ratio 1 to 1e-12 - the cap is SHARP, confirming no
 * pair-level cap can be smaller. (6) The theorem battery probes THEOREM
 * CC directly: 6000 seeded parity-pure multi-packet witnesses (2-5 blocks,
 * up to 5 packets per block, mixed rates >= 2/5, amplitudes including
 * zeros, both parities): max E = -0.029603445449030492 strictly negative,
 * zero E > 0 draws. (7) Sibling consistency: S(2/5) reproduces the
 * THEOREM RT majorant literal 0.980031490781631 exactly; the new cap
 * dominates the superseded ones at the tight cell (mu = 9/20, D = 2:
 * 0.7724823535071382 < tilt 0.8302157672647272 < midpoint
 * 0.9017423797744) and at mu = 2/5 (0.8087921354109988 < tilt
 * 0.8612912466520931); THEOREM PX has E > 0 at rate 0.127 < 2/5 and
 * E(2/5) = -5.005448294115412 < 0. (8) Scope honesty: parity-pure only,
 * the majorant constant is not the sharp threshold, the parent sub-gap is
 * NOT closed, nothing promoted.
 *
 * Import-light (no heavy bundle, no imports). The numerics cross-check the
 * theorem; the theorem is the displayed lemma chain.
 */

// exact sibling Gram kernel (identical to imp-95130/95131/95132/95133)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// exact gap-capped tilted pair integral: int p_i p_j exp(2 phi),
// phi = mu clamp(x - U, 0, D), both centers <= U (Lemma GT excess identity)
function tiltedPairExact(ai, aj, al, ar, ui, uj, mu, U, D) {
  const I = ai * aj * kernelK(al, ar, Math.abs(ui - uj));
  const s = al + ar;
  const hU = ai * aj * Math.exp(-al * (U - ui) - ar * (U - uj));
  const y = s - 2 * mu;
  const f = y < 1e-12 * s ? D : (1 - Math.exp(-y * D)) / y;
  return I + (hU * 2 * mu * f) / s;
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

// the sharp cluster cap and the row majorant S(mu)
function capCC(mu, D) {
  return (1 + mu * D) * Math.exp(-mu * D);
}
function rowMajorant(mu) {
  let s = 0;
  for (let k = 1; k <= 12; k++) s += capCC(mu, 2 * Math.pow(4, k - 1));
  return s;
}

// rational certification chain for S(2/5) < 1
function rationalChain() {
  let u8 = 0;
  let term = 1;
  for (let n = 0; n <= 8; n++) {
    if (n > 0) term = (term * -0.8) / n;
    u8 += n === 0 ? 1 : term;
  }
  const rung1 = (9 / 5) * u8;
  const rung2 = (21 / 5) * Math.pow(u8, 4);
  const rung3 = (69 / 5) * Math.pow(u8, 16);
  const tail = 2 * Math.pow(u8, 32);
  return { u8, rung1, rung2, rung3, tail, total: rung1 + rung2 + rung3 + tail };
}

// sorted same-parity block-interval gaps (identical to imp-95132/95133)
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
let seedState = 13579;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}
function mkClusterIn(lo, hi, mMax, rateLo, rateHi, edge, edgeAt) {
  const m = 1 + Math.floor(rnd() * mMax);
  const us = [];
  const as = [];
  const mus = [];
  for (let i = 0; i < m; i++) {
    const frac = edge ? rnd() * rnd() * rnd() : rnd();
    us.push(edgeAt === "hi" ? hi - frac * (hi - lo) : lo + frac * (hi - lo));
    as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
    mus.push(rateLo * Math.pow(rateHi / rateLo, rnd() * rnd()));
  }
  return { us, as, mus };
}

// battery A: Lemma GT tilted-norm approach (seed 13579, edge-biased clusters)
function runTiltedNormBattery() {
  seedState = 13579;
  let worst = 0;
  let viol = 0;
  for (let t = 0; t < 4000; t++) {
    const mu = 0.1 + rnd();
    const D = 0.2 + rnd() * 30;
    const U = 3 + rnd() * 10;
    const m = 1 + Math.floor(rnd() * 6);
    const us = [];
    const as = [];
    const mus = [];
    for (let i = 0; i < m; i++) {
      us.push(U - rnd() * rnd() * 12);
      as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
      mus.push(mu * Math.pow(80, rnd() * rnd()));
    }
    const n0 = gram(us, as, mus);
    if (n0 <= 0) continue;
    let nt = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        nt += tiltedPairExact(as[i], as[j], mus[i], mus[j], us[i], us[j], mu, U, D);
      }
    }
    const r = nt / ((1 + mu * D) * n0);
    if (r > worst) worst = r;
    if (r > 1 + 1e-9) viol++;
  }
  return { worst, viol };
}

// battery B: sharp cluster-cap approach (seed 24601, free rates, edge-piled)
function runCapBattery() {
  seedState = 24601;
  let worst = 0;
  let viol = 0;
  for (let t = 0; t < 20000; t++) {
    const parity = t % 2;
    const edge = t % 3 === 0;
    const bs = [];
    while (bs.length < 2) {
      const b = parity + 2 * Math.floor(rnd() * 7);
      if (!bs.includes(b)) bs.push(b);
    }
    bs.sort((x, y) => x - y);
    const U = Math.pow(2, bs[0] + 1);
    const V = Math.pow(2, bs[1]);
    const D = V - U;
    const c1 = mkClusterIn(Math.pow(2, bs[0]), U, 5, 0.05, 50, edge, "hi");
    const c2 = mkClusterIn(V, Math.pow(2, bs[1] + 1), 5, 0.05, 50, edge, "lo");
    const n1 = gram(c1.us, c1.as, c1.mus);
    const n2 = gram(c2.us, c2.as, c2.mus);
    if (n1 <= 0 || n2 <= 0) continue;
    const mu = Math.min(...c1.mus, ...c2.mus);
    const cap = capCC(mu, D) * Math.sqrt(n1 * n2);
    const r = clusterIP(c1, c2) / cap;
    if (r > worst) worst = r;
    if (r > 1 + 1e-9) viol++;
  }
  return { worst, viol };
}

// battery C: THEOREM CC direct approach (seed 11111, rates >= 2/5)
function runTheoremBattery() {
  seedState = 11111;
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
    const clusters = bs.map((b) =>
      mkClusterIn(Math.pow(2, b), Math.pow(2, b + 1), 5, 0.4, 40, t % 3 === 0, rnd() < 0.5 ? "hi" : "lo"),
    );
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

// THEOREM PX family geometry (positions exactly as in imp-95130..95133)
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

const BAT_GT = runTiltedNormBattery();
const BAT_CAP = runCapBattery();
const BAT_THEOREM = runTheoremBattery();

const MU_STAR = 2 / 5;

// baked literals (recomputed by the assertions)
const U8_LIT = 0.4493293064126984;
const RUNG1_LIT = 0.8087927515428571;
const RUNG2_LIT = 0.17120177838913153;
const RUNG3_LIT = 0.000038099125869216805;
const TAIL_LIT = 1.5244101995362583e-11;
const S_CERT_LIT = 0.980032629073102;
const S_MUSTAR_LIT = 0.980031490781631; // equals the THEOREM RT majorant literal
const S_0388_LIT = 1.0015903680511011;
const S_0389_LIT = 0.9997630987245442;
const S_045_LIT = 0.8981800605763708;
const CAP_04_2_LIT = 0.8087921354109988;
const CAP_045_2_LIT = 0.7724823535071382;
const TC_TILT_045_2_LIT = 0.8302157672647272;
const TC_TILT_04_2_LIT = 0.8612912466520931;
const MA_MIDPOINT_D2_LIT = 0.9017423797744;
const TC_CERT_LIT = 0.9838557066430847;
const BAT_GT_WORST_LIT = 0.9776839001577393;
const BAT_CAP_WORST_LIT = 0.9912983587463579;
const BAT_MAX_E_LIT = -0.029603445449030492;
const FAMILY_E_127_LIT = 0.016952476863480115;
const FAMILY_E_MUSTAR_LIT = -5.005448294115412;

export const IMP95134_SHARP_CLUSTER_CAP_THRESHOLD = {
  ticket:
    "imp-95134 (THEOREM CC: sharp cluster correlation cap (1 + mu D) exp(-mu D) and rate threshold 2/5 over the FULL parity-pure MAJ witness class, any packets per block - E > 0 forces min rate < 2/5; CLOSES imp-95132-subgap-cluster-threshold-sharpening, collapsing [2/5, 9/20])",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the imp-95132 Lemma L2 cluster geometry and interval-gap ladder; replaces the imp-95133 unbounded tilt with a gap-capped tilt (slope mu, profile clamped to the gap), removing the D-independent prefactor obstruction; directly progresses imp-95130-subgap-phi-conditional-odd-mass.",
  theoremCC:
    "Any parity-pure MAJ witness of the sibling-chain class with ANY number of packets per block and all rates mu_i >= 2/5 has E <= 0. Contrapositive: E > 0 forces mu_min < 2/5 = 0.4, the same constant as the one-packet-per-block THEOREM RT - multiplicity is free. Proof chain: Lemma GC (gap-capped tilt cancellation phi + psi = mu D identically, bounded weights, no eta < mu restriction) + Lemma HM (half-mass, exact sign identity, equality at tau = 0) + Lemma GT (norm(F exp(phi))^2 <= (1 + mu D) norm(F)^2 via the exact excess identity h(U) (2 mu/(y s))(1 - exp(-y D)), equality at an edge packet of rate mu) + interval-gap ladder + the rational chain (9/5) U8 + (21/5) U8^4 + (69/5) U8^16 + 2 U8^32 = 0.980032629073102 < 1 with U8 = 0.4493293064126984 >= exp(-4/5).",
  sharpClusterCap:
    "rho(F_b, F_bp) <= (1 + mu D) exp(-mu D) for same-parity clusters with interval gap D and all rates >= mu, ATTAINED by two rate-mu packets at the facing edges - the cap is SHARP, so no pair-level correlation cap can be smaller. This is the exact cluster analog of Lemma RC that the imp-95132 open leg requested: the tilt transfers the FULL gap decay exp(-mu D) with only the linear prefactor (1 + mu D), replacing mu^2/(mu^2 - eta^2) exp(-eta D) (imp-95133) and sqrt(2) exp(-mu D/2) (imp-95132).",
  lemmaGT:
    "UNCONDITIONAL, new: with the gap-capped tilt phi = mu clamp(x - U, 0, D), norm(F exp(phi))^2 <= (1 + mu D) norm(F)^2 for any cluster with centers <= U and rates >= mu. The excess over the untilted Gram is EXACT per pair: h(U) (2 mu/(y s))(1 - exp(-y D)) with y = s - 2 mu >= 0; Lemma HM bounds h(U)/s by half the pair mass and (1 - exp(-y D))/y <= D closes it. The packet count never appears; the bound is tight (ratio 1) at an edge packet of rate mu.",
  thresholdSandwich:
    "The sharp class threshold lies in [0.127, 0.4] certified: THEOREM PX (in this class) witnesses E > 0 at common rate 0.127 (re-verified: E(0.127) = 0.016952476863480115 > 0), and THEOREM CC excludes E > 0 at all rates >= 2/5 with certified margin 1 - 0.980032629073102 = 0.019967370926898. Float-level majorant root bracket (measured, NOT certified): S(0.388) = 1.0015903680511011 > 1 > S(0.389) = 0.9997630987245442 - identical to the THEOREM RT bracket, as it must be (same majorant). Because the pair cap is sharp, any further narrowing must come from the aggregation side (per-pair AM-GM + ladder) or a new witness family.",
  supersession:
    "THEOREM TC (9/20, imp-95133) and THEOREM MA (11/20, imp-95132) are superseded on the full parity-pure class; THEOREM RT (2/5, imp-95131) is subsumed at the constant level - its one-packet-per-block restriction is removed at the SAME constant. The imp-95133 residual obstruction (the D-independent tilt prefactor mu^2/(mu^2 - eta^2)) is REMOVED, not narrowed: capping the tilt profile at the gap keeps the weight bounded, so the tilt slope may equal mu itself.",
  subGaps: [
    "imp-95132-subgap-cluster-threshold-sharpening - CLOSED: the full-class cluster threshold equals the one-per-block constant 2/5; the interval [2/5, 9/20] collapses to a point. No cluster-vs-single multiplicity cost exists at the majorant level.",
    "imp-95134-subgap-aggregation-threshold-sharpness - NEW, OPEN: close the residual sandwich [0.127, 0.4]. The pair cap being SHARP localizes all remaining slack in (i) the per-pair AM-GM row reduction, (ii) the sorted-gap ladder (only the first rung is tight for any single block pair), or (iii) the witness side (a parity-pure family with E > 0 at common rate above 0.127). The float majorant root 0.389 bounds what (i)+(ii) alone can certify.",
    "imp-95131-subgap-rate-to-phi-pricing - OPEN, further upgraded: the pricing chain may now quantify over the FULL parity-pure class with forced mu_min < 2/5 (was 9/20); a uniform phi cap still needs the priced packets to carry a definite share of M.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this module closes the cluster-threshold sharpening leg; the phi-conditional odd-mass bound itself is not established",
    "the certified constant 2/5 is the majorant threshold, not the sharp class threshold (certified sandwich [0.127, 0.4]; float root bracket [0.388, 0.389] measured only); the residual slack is aggregation-side or witness-side, not pair-side",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM CC is unconditional given the sibling-chain witness conventions: Lemma GC is a pointwise algebraic identity (phi + psi = mu D on all three pieces) plus Cauchy-Schwarz with BOUNDED weights (no integrability side condition), Lemma HM is an exact closed-form sign identity with equality at tau = 0, Lemma GT is an exact excess identity per Gram pair followed by two elementary bounds (half-mass and 1 - exp(-z) <= z), the interval-gap ladder is the imp-95132 dyadic arithmetic re-verified exhaustively, and S(2/5) < 1 is certified by a rational alternating-series chain in the single constant U8 >= exp(-4/5) with the k >= 4 tail dominated via (1 + z) exp(-z) <= exp(-z/2) for z >= 51.2 (no library exp or sqrt in the certificate). No MAJ conditionality enters: the theorem BOUNDS witnesses, it does not price them against the ceiling. The batteries and grids are CROSS-CHECKS; the theorem is the displayed lemma chain. Scope: parity-pure only; the constant is the majorant threshold, not sharp; the sharpening sub-gap is CLOSED but the new aggregation-sharpness leg and the parent sub-gap imp-95130-subgap-phi-conditional-odd-mass stay OPEN; floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95134_SHARP_CLUSTER_CAP_THRESHOLD_ASSERTIONS = [
  {
    id: "imp95134-cc-tilt-cancellation",
    description:
      "Lemma GC identity: phi(x) + psi(x) = mu D pointwise on a grid spanning all three pieces (left of U, the gap, right of V), for several (mu, U, D)",
    holds: () => {
      for (const [mu, U, D] of [
        [0.4, 2, 2],
        [0.45, 8, 8],
        [1.3, 4, 28],
      ]) {
        const V = U + D;
        for (let i = 0; i <= 200; i++) {
          const x = U - 10 + (i / 200) * (D + 20);
          const phi = mu * Math.min(Math.max(x - U, 0), D);
          const psi = mu * Math.min(Math.max(V - x, 0), D);
          if (Math.abs(phi + psi - mu * D) > 1e-12 * mu * D) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95134-cc-tilted-pair-quadrature",
    description:
      "the exact gap-capped tilted pair integral (Lemma GT excess identity) matches Simpson quadrature of p_i p_j exp(2 mu clamp(x - U, 0, D)) to relative 1e-4 on three configurations (quadrature-limited)",
    holds: () => {
      const quad = (al, ar, ui, uj, mu, U, D) => {
        const lo = Math.min(ui, uj) - 60 / Math.min(al, ar);
        const hi = U + D + 60 / Math.min(al, ar);
        const n = 200000;
        const h = (hi - lo) / n;
        let s = 0;
        for (let i = 0; i <= n; i++) {
          const x = lo + i * h;
          const w = i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2;
          const phi = mu * Math.min(Math.max(x - U, 0), D);
          s += w * Math.exp(-al * Math.abs(x - ui) - ar * Math.abs(x - uj) + 2 * phi);
        }
        return (s * h) / 3;
      };
      const cfgs = [
        [0.45, 2, 1.2, 1.9, 0.4, 2, 2],
        [0.4, 0.4, 1.99, 1.0, 0.4, 2, 2],
        [1.3, 0.55, 0.5, 1.5, 0.5, 2, 8],
      ];
      for (const [al, ar, ui, uj, mu, U, D] of cfgs) {
        const e = tiltedPairExact(1, 1, al, ar, ui, uj, mu, U, D);
        if (Math.abs(quad(al, ar, ui, uj, mu, U, D) - e) > 1e-4 * e) return false;
      }
      return true;
    },
  },
  {
    id: "imp95134-cc-half-mass",
    description:
      "Lemma HM: 2 exp(-alpha tau)/(alpha + beta) <= K(alpha, beta, tau) on a grid with extreme rate ratios (zero violations), the closed-form sign identity W 2 alpha/((beta - alpha)(alpha + beta)) reproduces K - 2R to relative 1e-12, and equality holds at tau = 0",
    holds: () => {
      for (const a of [0.05, 0.4, 1, 7, 40]) {
        for (const b of [0.05, 0.45, 2, 30]) {
          for (const tau of [0, 0.01, 0.5, 3, 20]) {
            const R = Math.exp(-a * tau) / (a + b);
            const K = kernelK(a, b, tau);
            if (2 * R > K * (1 + 1e-12)) return false;
            if (Math.abs(b - a) > 1e-6) {
              const W = Math.exp(-a * tau) - Math.exp(-b * tau);
              const idExact = (W * 2 * a) / ((b - a) * (a + b));
              if (Math.abs(K - 2 * R - idExact) > 1e-12 * Math.max(K, 1e-300)) return false;
            }
          }
        }
      }
      return Math.abs(2 / (0.4 + 7) - kernelK(0.4, 7, 0)) < 1e-14;
    },
  },
  {
    id: "imp95134-cc-tilted-norm-battery",
    description:
      "Lemma GT approach: 4000 seeded edge-biased clusters (rates 1x..80x the floor, zero amplitudes included, tilt slope = the floor mu) - zero violations of norm(F exp(phi))^2 <= (1 + mu D) norm(F)^2, worst ratio 0.9776839001577393, and the edge-packet equality case gives ratio 1",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const mu = 0.4;
      const D = 2;
      const U = 2;
      const edgeRatio =
        tiltedPairExact(1, 1, mu, mu, U, U, mu, U, D) / ((1 + mu * D) * kernelK(mu, mu, 0));
      return (
        BAT_GT.viol === 0 &&
        rel(BAT_GT.worst, BAT_GT_WORST_LIT, 1e-6) &&
        BAT_GT.worst < 1 &&
        Math.abs(edgeRatio - 1) < 1e-12
      );
    },
  },
  {
    id: "imp95134-cc-sharp-cap-battery",
    description:
      "sharp cluster-cap stress-test: 20000 seeded free-rate same-parity cluster pairs (edge-piled every third draw) - zero violations of rho <= (1 + mu D) exp(-mu D), worst ratio 0.9912983587463579, and the two-edge-packet configuration ATTAINS the cap (ratio 1): the cap is sharp",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const mu = 0.4;
      const D = 2;
      const attain = kernelK(mu, mu, D) / kernelK(mu, mu, 0) / capCC(mu, D);
      return (
        BAT_CAP.viol === 0 &&
        rel(BAT_CAP.worst, BAT_CAP_WORST_LIT, 1e-6) &&
        BAT_CAP.worst < 1 &&
        Math.abs(attain - 1) < 1e-12
      );
    },
  },
  {
    id: "imp95134-cc-gap-ladder-exhaustive",
    description:
      "the interval-gap ladder (carried from imp-95132/95133) exhaustively: for every block b <= 60 the sorted same-parity interval gaps satisfy gap_k >= 2 4^{k-1} (even parity; >= 4 4^{k-1} odd parity), tight at blocks 0 and 2",
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
    id: "imp95134-cc-row-majorant-arithmetic",
    description:
      "the row majorant with the sharp cap: S(2/5) = 0.980031490781631 < 1 (float; EQUALS the THEOREM RT majorant literal), float root bracket S(0.388) = 1.0015903680511011 > 1 > S(0.389) = 0.9997630987245442, S(0.45) = 0.8981800605763708 below the imp-95133 certified 0.9838557066430847, and the sharp cap dominates the superseded caps at the tight cells: capCC(0.45, 2) = 0.7724823535071382 < 0.8302157672647272 (TC tilt) < 0.9017423797744 (MA midpoint); capCC(0.4, 2) = 0.8087921354109988 < 0.8612912466520931 (TC tilt at 2/5)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const s04 = rowMajorant(MU_STAR);
      const s388 = rowMajorant(0.388);
      const s389 = rowMajorant(0.389);
      const s45 = rowMajorant(0.45);
      return (
        rel(s04, S_MUSTAR_LIT, 1e-12) &&
        s04 < 1 &&
        rel(s388, S_0388_LIT, 1e-12) &&
        s388 > 1 &&
        rel(s389, S_0389_LIT, 1e-12) &&
        s389 < 1 &&
        s388 > s389 &&
        s389 > s04 &&
        rel(s45, S_045_LIT, 1e-12) &&
        s45 < TC_CERT_LIT &&
        rel(capCC(0.45, 2), CAP_045_2_LIT, 1e-12) &&
        capCC(0.45, 2) < TC_TILT_045_2_LIT &&
        TC_TILT_045_2_LIT < MA_MIDPOINT_D2_LIT &&
        rel(capCC(MU_STAR, 2), CAP_04_2_LIT, 1e-12) &&
        capCC(MU_STAR, 2) < TC_TILT_04_2_LIT
      );
    },
  },
  {
    id: "imp95134-cc-rational-certification",
    description:
      "the rational certification chain: U8 = 0.4493293064126984 >= exp(-4/5) (alternating series truncated after the positive n = 8 term, term magnitudes decreasing), rungs (9/5) U8 = 0.8087927515428571, (21/5) U8^4 = 0.17120177838913153, (69/5) U8^16 = 0.000038099125869216805, tail 2 U8^32 = 1.5244101995362583e-11 which dominates the actual k >= 4 rung sum, total 0.980032629073102 < 1 and >= the float S(2/5); tail justification (1 + 51.2) exp(-25.6) < 1 checks 52.2 << exp(25.6)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const rc = rationalChain();
      let actualTail = 0;
      for (let k = 4; k <= 12; k++) actualTail += capCC(MU_STAR, 2 * Math.pow(4, k - 1));
      return (
        rel(rc.u8, U8_LIT, 1e-15) &&
        rc.u8 >= Math.exp(-0.8) &&
        rel(rc.rung1, RUNG1_LIT, 1e-12) &&
        rel(rc.rung2, RUNG2_LIT, 1e-12) &&
        rel(rc.rung3, RUNG3_LIT, 1e-12) &&
        rel(rc.tail, TAIL_LIT, 1e-12) &&
        rel(rc.total, S_CERT_LIT, 1e-12) &&
        rc.total < 1 &&
        rc.total >= rowMajorant(MU_STAR) &&
        rc.tail >= actualTail &&
        52.2 * Math.exp(-25.6) < 1 &&
        Math.pow(rc.u8, 96) < 1e-30
      );
    },
  },
  {
    id: "imp95134-cc-theorem-battery",
    description:
      "THEOREM CC battery: 6000 seeded parity-pure multi-packet witnesses (2-5 blocks, up to 5 packets per block, mixed rates >= 2/5, amplitudes including zeros, edge-piled every third draw, both parities) - max E = -0.029603445449030492 strictly negative, zero E > 0 draws",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_THEOREM.maxE < 0 && rel(BAT_THEOREM.maxE, BAT_MAX_E_LIT, 1e-6) && BAT_THEOREM.eViol === 0
      );
    },
  },
  {
    id: "imp95134-cc-sibling-consistency",
    description:
      "consistency with the siblings: THEOREM PX (a member of this class) has E(0.127) = 0.016952476863480115 > 0 with 0.127 < 2/5 as THEOREM CC requires, E(2/5) = -5.005448294115412 < 0, and the supersession ordering holds: 2/5 (CC, full class) = 2/5 (RT, one-per-block) < 9/20 (TC) < 11/20 (MA)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(familyE(0.127), FAMILY_E_127_LIT, 1e-9) &&
        familyE(0.127) > 0 &&
        0.127 < MU_STAR &&
        rel(familyE(MU_STAR), FAMILY_E_MUSTAR_LIT, 1e-12) &&
        familyE(MU_STAR) < 0 &&
        MU_STAR === 2 / 5 &&
        MU_STAR < 9 / 20 &&
        9 / 20 < 11 / 20
      );
    },
  },
  {
    id: "imp95134-cc-honesty-gate",
    description:
      "the verdict is scoped: parity-pure only, 2/5 is the majorant threshold not the sharp one (certified sandwich [0.127, 0.4], float bracket measured only), the sharpening sub-gap is CLOSED but the NEW aggregation-sharpness leg and the parent sub-gap imp-95130-subgap-phi-conditional-odd-mass stay OPEN; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.promotesBound === false &&
      /NO QED/.test(IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.rigorScope) &&
      /refereed bound is changed/i.test(IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.rigorScope) &&
      /stay OPEN/.test(IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.rigorScope) &&
      /remains OPEN/.test(IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.openResiduals[0]) &&
      /not the sharp class threshold/.test(IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.openResiduals[1]) &&
      IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.subGaps.length === 3 &&
      /CLOSED/.test(IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.subGaps[0]) &&
      /NEW, OPEN/.test(IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.subGaps[1]) &&
      IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.openResiduals.length === 3 &&
      /parity-pure only/.test(IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.rigorScope) &&
      /not sharp/.test(IMP95134_SHARP_CLUSTER_CAP_THRESHOLD.rigorScope),
  },
];

for (const a of IMP95134_SHARP_CLUSTER_CAP_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95134-sharp-cluster-cap-threshold assertion failed: ${a.id}`);
  }
}

export default IMP95134_SHARP_CLUSTER_CAP_THRESHOLD;
