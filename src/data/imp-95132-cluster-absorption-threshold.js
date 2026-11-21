/**
 * imp-95132 - THEOREM MA (multiblock cluster-absorption rate threshold):
 * resolution of imp-95131-subgap-multiblock-aggregation. THEOREM RT
 * (imp-95131) proved the uniform rate threshold 2/5 for parity-pure MAJ
 * witnesses with AT MOST ONE packet per block, and named the multi-packet
 * extension as an open leg ("the row bound loses to same-block multiplicity;
 * needs a cluster absorption argument"). This module supplies that cluster
 * absorption argument and proves the extension with the explicit certified
 * threshold 11/20:
 *
 * THEOREM MA. Let W be any MAJ witness of the sibling-chain class
 * (nonnegative amplitudes a_i, free positive rates mu_i, positions
 * u_i in [2^{b_i}, 2^{b_i + 1})) that is PARITY-PURE (all blocks of one
 * parity), with ANY number of packets per block. If every rate satisfies
 * mu_i >= 11/20, then E <= 0. Contrapositive: every E > 0 witness in the
 * full parity-pure class carries a rate mu_min < 11/20 = 0.55.
 *
 * The proof replaces the per-packet row bound (which fails under same-block
 * multiplicity) by a CLUSTER-LEVEL correlation cap in the exact L2 geometry:
 *
 * LEMMA L2 (exact function-space realization - UNCONDITIONAL). The sibling
 * Gram kernel is the L2 inner product of two-sided exponential profiles:
 * K(a, b, tau) = integral over the line of exp(-a|x - u|) exp(-b|x - v|) dx
 * with tau = |u - v| (elementary three-piece integral; the closed form
 * 2(b exp(-a tau) - a exp(-b tau)) divided by (b^2 - a^2) and the equal-rate
 * limit exp(-m tau)(1 + m tau) over m match exactly). Writing
 * F_b = sum of a_i exp(-mu_i |x - u_i|) over packets i in block b (the
 * BLOCK-CLUSTER function), the parity-pure excess is EXACTLY
 *   E = X_env - diag - sameBlock
 *     = norm(sum_b F_b)^2 - 2 sum_b norm(F_b)^2,
 * because diag + sameBlock = sum_b norm(F_b)^2 (the within-cluster Gram
 * mass) and X_env = sum over cluster pairs of 2<F_b, F_bp>. The sameBlock
 * channel is thus absorbed into the cluster norms with no inequality.
 *
 * LEMMA HH (half-line inner product - UNCONDITIONAL, exact algebra). For any
 * rates alpha, beta > 0 and separation tau >= 0, the integral of the two
 * profiles over the half-line left of the SMALLER center is at most K/2:
 * with alpha the left rate and beta the right rate, the left tail equals
 * exp(-beta tau) / (alpha + beta) and
 *   K - 2 (left tail) = (exp(-alpha tau) - exp(-beta tau)) 2 beta
 *                       / ((alpha + beta)(beta - alpha)) >= 0
 * because numerator and denominator change sign together at alpha = beta
 * (equal-rate limit: 2 beta tau exp(-beta tau) / (2 beta) >= 0). Mirrored
 * statement for the half-line right of the larger center. Tight as tau -> 0.
 *
 * LEMMA CT (cluster tail decay - UNCONDITIONAL). Let F be a cluster whose
 * packet centers all sit at distance >= g right of a split point c, with
 * minimum cluster rate mu_c. Then the tail mass left of c obeys
 *   integral_{x <= c} F^2 <= (1/2) exp(-2 mu_c g) norm(F)^2.
 * PROOF. Per packet pair (j, jp) with offsets delta_j = u_j - c >= g:
 * the exact left integral is exp(-mu_j delta_j - mu_jp delta_jp)
 * / (mu_j + mu_jp), which factors as exp(-(mu_j + mu_jp) min(delta))
 * times the HALF-LINE inner product of the pair at its smaller center;
 * Lemma HH bounds that by K_(j,jp) / 2, and (mu_j + mu_jp) min(delta)
 * >= 2 mu_c g. Summing with nonnegative coefficients a_j a_jp gives the
 * claim, since sum a_j a_jp K_(j,jp) = norm(F)^2. QED.
 *
 * LEMMA CA (cluster absorption cap - UNCONDITIONAL). For clusters F_b, F_bp
 * in same-parity blocks b < bp with block-interval gap
 * D = 2^{bp} - 2^{b + 1} > 0, splitting at the gap midpoint c and applying
 * Cauchy-Schwarz on each half plus Lemma CT (each cluster is at distance
 * >= D/2 from c on its own side):
 *   <F_b, F_bp> <= (1/sqrt(2)) (exp(-mu_b D/2) + exp(-mu_bp D/2))
 *                  norm(F_b) norm(F_bp)
 *               <= sqrt(2) exp(-mu_star D/2) norm(F_b) norm(F_bp),
 * with mu_b, mu_bp the cluster minimum rates and mu_star the witness
 * minimum. This is the multiplicity-free correlation cap: the number of
 * packets per cluster never appears.
 *
 * GAP LADDER (Lemma GS transferred to interval gaps - UNCONDITIONAL). The
 * k-th smallest same-parity block-interval gap from any block is
 * >= 2^{2k - 1} (even parity; >= 2^{2k} odd parity), tight at blocks 0 and 2
 * (gap 2 between [1, 2) and [4, 8)) - the same dyadic arithmetic as
 * imp-95131 Lemma GS, applied to interval gaps instead of packet distances,
 * re-verified exhaustively below for all blocks b <= 60, both parities.
 *
 * CLUSTER ROW REDUCTION AND THRESHOLD. With c_b = norm(F_b), AM-GM gives
 * E <= sum_b c_b^2 (Row_b - 1) where Row_b sums the cluster correlation
 * caps; by Lemma CA and the gap ladder,
 *   Row_b <= T(mu_star), T(mu) := sqrt(2) sum_{k >= 1} exp(-mu 4^{k - 1}),
 * T decreasing. At mu = 11/20: T = 0.9728427447175553 < 1, certified by a
 * purely rational chain avoiding both library exp and library sqrt: the
 * alternating series bound exp(-0.55) <= 0.576952635438368 =: eU (truncation
 * after the positive n = 6 term), powering exp(-2.2) <= eU^4 and
 * exp(-8.8) <= eU^16, the tail comparison sum_{k >= 3} <= 2 eU^16 (ratio
 * exp(-26.4) < 1e-11), and the square test
 *   2 (eU + eU^4 + 2 eU^16)^2 = 0.9468516239116663 < 1,
 * which is exactly T(11/20) < 1 without evaluating sqrt(2). So all rates
 * >= 11/20 give every cluster row < 1, hence E <= 0. QED.
 *
 * COROLLARY TB (two-block exclusion - UNCONDITIONAL, all rates, all
 * parities). Any witness supported on exactly TWO blocks - any multiplicity,
 * any rates, mixed parity allowed - has
 * E = 2<F_1, F_2> - norm(F_1)^2 - norm(F_2)^2
 * <= -(norm(F_1) - norm(F_2))^2 <= 0 by Cauchy-Schwarz alone. This is the
 * cluster generalization of the imp-95130 Lemma TP (two PACKETS): the
 * minimal support for E > 0 is three BLOCKS even with unbounded
 * multiplicity, and THEOREM PX shows three blocks is attained.
 *
 * WHAT THIS RESOLVES AND WHAT IT DOES NOT.
 * (1) imp-95131-subgap-multiblock-aggregation is CLOSED as a class bound:
 *     the parity-pure rate mechanism no longer needs the one-packet-per-
 *     block restriction. Every E > 0 parity-pure witness, arbitrary
 *     multiplicity, has mu_min < 11/20.
 * (2) The certified constant 11/20 is NOT sharp and does NOT match the
 *     one-per-block 2/5: the midpoint split pays a factor 2 in decay
 *     distance (exp(-mu D/2) vs the exact profile f(mu D)) minus the
 *     sqrt(2) recovered by Lemma HH. Sharp class threshold sandwich:
 *     [0.127, 0.54] (THEOREM PX witnesses E > 0 at rate 0.127 and is in
 *     this class; majorant root bracket T(0.53) = 1.0024570485706115 > 1
 *     > T(0.54) = 0.9874749880670212). NEW named leg:
 *     imp-95132-subgap-cluster-threshold-sharpening - close [2/5, 11/20]
 *     (a cluster analog of Lemma RC replacing the midpoint split, or a
 *     multi-packet witness with E > 0 at rate above 0.389 proving a genuine
 *     multiplicity cost).
 * (3) imp-95131-subgap-rate-to-phi-pricing stays OPEN but is UPGRADED: the
 *     pricing chain may now quantify over the FULL parity-pure class
 *     (forced mu_min < 11/20) instead of one-per-block witnesses. The
 *     parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN.
 * (4) Floors, ceilings, and bounds untouched.
 *
 * HONEST LIMITS. (a) Model-family constants (sigma = 1, theta = 10,
 * beta = 1/3, c = v = D = 1), not the paper Section 4.5 packets. (b) 11/20
 * is a certified sufficient constant, not sharp (sandwich 0.127 to 0.54).
 * (c) Parity-pure only: mixed-parity adjacent blocks have interval gap 0
 * and the ladder gives nothing (consistent with the carried chain, which
 * handles X_par by its own channel). (d) Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) Lemma HH was stress-tested on a 216000-cell
 * log grid (both rates 1e-3..1e3, separation 1e-4..1e4): zero violations,
 * worst ratio exactly 1 at the tau -> 0 boundary (the lemma is tight, the
 * constant 1/2 cannot be improved per-pair). (2) The Lemma CT per-pair tail
 * inequality was stress-tested on a 160000-cell grid over (two rates, two
 * offsets): zero violations, worst ratio 1 at the equal-offset boundary.
 * (3) Lemma CA was stress-tested with 20000 free-rate random cluster pairs
 * (max ratio 0.7632874191356109) plus a 90000-draw EDGE-PILED stress family
 * (packets piled at the facing block edges, the geometry that maximizes the
 * cap ratio; worst 0.8569038198287232) - no violations, and the measured
 * headroom is the honest slack of the midpoint split. (4) The theorem
 * battery probes THEOREM MA directly: 6000 seeded parity-pure multi-packet
 * witnesses (2-5 blocks, up to 5 packets per block, mixed rates >= 11/20,
 * amplitudes including zeros, both parities): max E = -0.02403148015405872
 * strictly negative, max measured cluster row 0.0916820041742966 well below
 * T(11/20). (5) A 20000-draw free-rate two-block battery probes Corollary
 * TB (mixed parities included): zero violations. (6) Consistency with the
 * siblings: THEOREM PX has E > 0 at rate 0.127 < 11/20 (as MA requires) and
 * E(11/20) = -4.2951492884408315 < 0; THEOREM RT (2/5, one-per-block) is
 * NOT superseded - on its subclass it is stronger, and MA does not imply
 * it. (7) The rational certification chain is reproduced and dominates the
 * true values; the square test avoids library sqrt. (8) Scope honesty:
 * parity-pure only, constant not sharp, parent sub-gap NOT closed, nothing
 * promoted.
 *
 * Import-light (no heavy bundle, no imports). The numerics cross-check the
 * theorem; the theorem is the displayed lemma chain.
 */

// exact sibling Gram kernel (identical to imp-95130/95131)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// cluster Gram mass and cross-cluster inner product (Lemma L2 objects)
function clusterNorm2(c) {
  let s = 0;
  for (let i = 0; i < c.us.length; i++) {
    for (let j = 0; j < c.us.length; j++) {
      s += c.as[i] * c.as[j] * kernelK(c.mus[i], c.mus[j], Math.abs(c.us[i] - c.us[j]));
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

// T(mu) = sqrt(2) sum_{k >= 1} exp(-mu 4^{k - 1}) - the cluster row majorant
function tMaj(mu, terms) {
  let s = 0;
  for (let k = 1; k <= terms; k++) s += Math.exp(-mu * Math.pow(4, k - 1));
  return Math.SQRT2 * s;
}

// rational certification chain for T(11/20) < 1 (square test, no sqrt)
function rationalChain() {
  let e055U = 0;
  let t = 1;
  for (let n = 0; n <= 6; n++) {
    if (n > 0) t = (t * -0.55) / n;
    e055U += n === 0 ? 1 : t;
  }
  const sUp = e055U + Math.pow(e055U, 4) + 2 * Math.pow(e055U, 16);
  return { e055U, sUp, twoSup2: 2 * sUp * sUp };
}

// sorted same-parity block-interval gaps for a row at block b
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
let seedState = 12345;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}
function makeCluster(b, mMax, rateLo, rateHi) {
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

// battery A: THEOREM MA direct approach (seed 12345, rates >= 11/20)
function runTheoremBattery() {
  seedState = 12345;
  let maxE = -Infinity;
  let maxRow = 0;
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
    const clusters = bs.map((b) => makeCluster(b, 5, 0.55, 55));
    const norms = clusters.map(clusterNorm2);
    let E = -norms.reduce((x, y) => x + y, 0);
    const rows = new Array(clusters.length).fill(0);
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const v = clusterIP(clusters[i], clusters[j]);
        E += 2 * v;
        if (norms[i] > 0 && norms[j] > 0) {
          const rho = v / Math.sqrt(norms[i] * norms[j]);
          rows[i] += rho;
          rows[j] += rho;
        }
      }
    }
    const mr = rows.length ? Math.max(...rows) : 0;
    if (E > maxE) maxE = E;
    if (mr > maxRow) maxRow = mr;
    if (E > 0) eViol++;
  }
  return { maxE, maxRow, eViol };
}

// battery B: Lemma CA cap approach (seed 777, free rates 1e-3..1e2)
function runCapBattery() {
  seedState = 777;
  let maxRatio = 0;
  let viol = 0;
  for (let t = 0; t < 20000; t++) {
    const parity = t % 2;
    const bs = [];
    while (bs.length < 2) {
      const b = parity + 2 * Math.floor(rnd() * 8);
      if (!bs.includes(b)) bs.push(b);
    }
    bs.sort((x, y) => x - y);
    const c1 = makeCluster(bs[0], 4, 1e-3, 1e2);
    const c2 = makeCluster(bs[1], 4, 1e-3, 1e2);
    const n1 = clusterNorm2(c1);
    const n2 = clusterNorm2(c2);
    if (n1 <= 0 || n2 <= 0) continue;
    const D = Math.pow(2, bs[1]) - Math.pow(2, bs[0] + 1);
    const mu1 = Math.min(...c1.mus);
    const mu2 = Math.min(...c2.mus);
    const cap = ((Math.exp((-mu1 * D) / 2) + Math.exp((-mu2 * D) / 2)) / Math.SQRT2) * Math.sqrt(n1 * n2);
    const r = clusterIP(c1, c2) / cap;
    if (r > maxRatio) maxRatio = r;
    if (r > 1 + 1e-9) viol++;
  }
  return { maxRatio, viol };
}

// battery C: Corollary TB approach (seed 31337, free rates, mixed parities)
function runTwoBlockBattery() {
  seedState = 31337;
  let maxE = -Infinity;
  let viol = 0;
  for (let t = 0; t < 20000; t++) {
    const bs = [];
    while (bs.length < 2) {
      const b = Math.floor(rnd() * 20);
      if (!bs.includes(b)) bs.push(b);
    }
    const mk = (b) => {
      const m = 1 + Math.floor(rnd() * 5);
      const us = [];
      const as = [];
      const mus = [];
      for (let i = 0; i < m; i++) {
        us.push(Math.pow(2, b) * (1 + rnd() * 0.999999));
        as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
        mus.push(Math.pow(10, -3 + 4 * rnd()));
      }
      return { us, as, mus };
    };
    const c1 = mk(bs[0]);
    const c2 = mk(bs[1]);
    const E = 2 * clusterIP(c1, c2) - clusterNorm2(c1) - clusterNorm2(c2);
    if (E > maxE) maxE = E;
    if (E > 1e-12) viol++;
  }
  return { maxE, viol };
}

// battery D: edge-piled stress on the Lemma CA cap (seed 4242, blocks 0 and 2)
function runEdgeStress() {
  seedState = 4242;
  let worst = 0;
  for (const mu of [0.05, 0.1, 0.2, 0.4, 0.55, 0.8, 1.5, 3, 6, 12]) {
    for (let m = 1; m <= 6; m++) {
      for (let trial = 0; trial < 1500; trial++) {
        const edge = rnd() < 0.7;
        const mk = (b, lo2) => {
          const us = [];
          const as = [];
          const mus = [];
          for (let i = 0; i < m; i++) {
            const frac = edge ? (lo2 ? 0.999 - rnd() * 0.01 : rnd() * 0.01) : rnd() * 0.999999;
            us.push(Math.pow(2, b) * (1 + frac));
            as.push(0.01 + rnd());
            mus.push(mu * (1 + rnd() * 0.2));
          }
          return { us, as, mus };
        };
        const c1 = mk(0, true);
        const c2 = mk(2, false);
        const mu1 = Math.min(...c1.mus);
        const mu2 = Math.min(...c2.mus);
        const cap = ((Math.exp(-mu1) + Math.exp(-mu2)) / Math.SQRT2) * Math.sqrt(clusterNorm2(c1) * clusterNorm2(c2));
        const r = clusterIP(c1, c2) / cap;
        if (r > worst) worst = r;
      }
    }
  }
  return { worst };
}

// THEOREM PX family geometry (positions exactly as in imp-95130/95131)
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

const BAT_THEOREM = runTheoremBattery();
const BAT_CAP = runCapBattery();
const BAT_TWOBLOCK = runTwoBlockBattery();
const BAT_EDGE = runEdgeStress();

const MU_STAR = 11 / 20;

// baked literals (recomputed by the assertions)
const T_MUSTAR_LIT = 0.9728427447175553;
const T_MARGIN_LIT = 0.027157255282444726;
const T_053_LIT = 1.0024570485706115;
const T_054_LIT = 0.9874749880670212;
const E055_UPPER_LIT = 0.576952635438368;
const SUP_LIT = 0.6880594537943892;
const TWO_SUP2_LIT = 0.9468516239116663;
const BAT_MAX_E_LIT = -0.02403148015405872;
const BAT_MAX_ROW_LIT = 0.0916820041742966;
const BAT_CAP_MAX_RATIO_LIT = 0.7632874191356109;
const BAT_TB_MAX_E_LIT = -0.004776538341928517;
const BAT_EDGE_WORST_LIT = 0.8569038198287232;
const FAMILY_E_127_LIT = 0.016952476863480115;
const FAMILY_E_MUSTAR_LIT = -4.2951492884408315;

export const IMP95132_CLUSTER_ABSORPTION_THRESHOLD = {
  ticket:
    "imp-95132 (THEOREM MA: cluster-absorption rate threshold 11/20 over the FULL parity-pure MAJ witness class, any packets per block - E > 0 forces min rate < 11/20; resolves imp-95131-subgap-multiblock-aggregation)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the Theorem R Gram assembly / Lemma ES channel split and the imp-95131 THEOREM RT chain; directly progresses imp-95130-subgap-phi-conditional-odd-mass.",
  theoremMA:
    "Any parity-pure MAJ witness of the sibling-chain class with ANY number of packets per block and all rates mu_i >= 11/20 has E <= 0. Contrapositive: E > 0 forces mu_min < 11/20 = 0.55. Proof chain: Lemma L2 (E = norm(sum F_b)^2 - 2 sum norm(F_b)^2 exactly, sameBlock absorbed into cluster norms) + Lemma HH (half-line inner product <= K/2, exact algebra) + Lemma CT (cluster tail (1/2) exp(-2 mu g) decay) + Lemma CA (cluster cap sqrt(2) exp(-mu_star D/2), multiplicity-free) + interval-gap ladder (k-th gap >= 2^{2k-1}) + T(11/20) = 0.9728427447175553 < 1 via the rational square test 2 (eU + eU^4 + 2 eU^16)^2 = 0.9468516239116663 < 1.",
  lemmaHH:
    "UNCONDITIONAL, new: the half-line integral of two exponential profiles beyond either center is at most half the full inner product - K - 2 tail = 2 beta (exp(-alpha tau) - exp(-beta tau)) / ((alpha + beta)(beta - alpha)) >= 0, numerator and denominator changing sign together. Tight at tau = 0; recovers the sqrt(2) in Lemma CA (a plain split gives constant 2).",
  lemmaCA:
    "UNCONDITIONAL cluster absorption: <F_b, F_bp> <= (1/sqrt(2))(exp(-mu_b D/2) + exp(-mu_bp D/2)) norm(F_b) norm(F_bp) for same-parity block clusters with interval gap D, by midpoint split + Cauchy-Schwarz + Lemma CT. The packet count per cluster never appears - this is what the imp-95131 open leg asked for.",
  corollaryTB:
    "UNCONDITIONAL two-block exclusion, all rates, mixed parity allowed: E <= -(norm(F_1) - norm(F_2))^2 <= 0 on any two-block witness by Cauchy-Schwarz alone - the cluster generalization of Lemma TP (two packets); minimal support for E > 0 stays three BLOCKS at unbounded multiplicity, attained by THEOREM PX.",
  thresholdSandwich:
    "The sharp class threshold lies in [0.127, 0.54]: THEOREM PX (in this class) witnesses E > 0 at common rate 0.127 (re-verified: E(0.127) = 0.016952476863480115 > 0), and the majorant root is bracketed by T(0.53) = 1.0024570485706115 > 1 > T(0.54) = 0.9874749880670212. The certified constant 11/20 carries margin 1 - T = 0.027157255282444726. THEOREM RT (2/5, one-per-block) is NOT superseded: on its subclass it is stronger.",
  subGaps: [
    "imp-95132-subgap-cluster-threshold-sharpening - OPEN: close the [2/5, 11/20] gap between the one-per-block and cluster thresholds (a cluster analog of Lemma RC replacing the midpoint split, or a multi-packet witness with E > 0 at rate above 0.389 proving a genuine multiplicity cost).",
    "imp-95131-subgap-rate-to-phi-pricing - OPEN, upgraded: the pricing chain may now quantify over the FULL parity-pure class (forced mu_min < 11/20) instead of one-per-block witnesses; a uniform phi cap still needs the priced packets to carry a definite share of M.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this module removes the one-packet-per-block restriction from the rate mechanism; the phi-conditional odd-mass bound itself is not established",
    "the certified constant 11/20 is not sharp (sandwich [0.127, 0.54]); sharpening is named imp-95132-subgap-cluster-threshold-sharpening, not closed",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM MA is unconditional given the sibling-chain witness conventions: Lemma L2 is an exact three-piece integral identity (quadrature cross-checked), Lemma HH and Lemma CT are exact elementary algebra (proofs in full above), Lemma CA is Cauchy-Schwarz plus the tail bounds, the interval-gap ladder is the imp-95131 Lemma GS dyadic arithmetic on interval gaps, and T(11/20) < 1 is certified by a rational alternating-series chain with a square test that avoids both library exp and library sqrt. No MAJ conditionality enters: the theorem BOUNDS witnesses, it does not price them against the ceiling. The batteries and grids are CROSS-CHECKS; the theorem is the displayed lemma chain. Scope: parity-pure only; the constant is sufficient, not sharp; the parent sub-gap imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95132_CLUSTER_ABSORPTION_THRESHOLD_ASSERTIONS = [
  {
    id: "imp95132-ma-lemma-l2-quadrature",
    description:
      "Lemma L2: the sibling kernel equals the L2 inner product of two-sided exponential profiles - Simpson quadrature over five (rate, rate, separation) configurations matches kernelK to relative 1e-4 (quadrature-limited)",
    holds: () => {
      const quadIP = (a, b, tau, L, n) => {
        const lo = -L;
        const hi = tau + L;
        const h = (hi - lo) / n;
        let s = 0;
        for (let i = 0; i <= n; i++) {
          const x = lo + i * h;
          const w = i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2;
          s += w * Math.exp(-a * Math.abs(x)) * Math.exp(-b * Math.abs(x - tau));
        }
        return (s * h) / 3;
      };
      const cfgs = [
        [1, 1, 0.5],
        [0.4, 2, 3],
        [0.8, 0.9, 1.7],
        [2, 5, 0.2],
        [0.5, 0.5, 4],
      ];
      for (const [a, b, tau] of cfgs) {
        const q = quadIP(a, b, tau, 40 / Math.min(a, b), 20000);
        if (Math.abs(q - kernelK(a, b, tau)) > 1e-4 * kernelK(a, b, tau)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95132-ma-lemma-hh-grid",
    description:
      "Lemma HH holds on a 216000-cell log grid (both rates 1e-3..1e3, separation 1e-4..1e4): the half-line integral exp(-beta tau)/(alpha + beta) never exceeds K/2, and the ratio approaches 1 (tightness) as tau -> 0",
    holds: () => {
      let worst = 0;
      for (let i1 = 0; i1 < 60; i1++) {
        const al = Math.pow(10, -3 + (6 * i1) / 59);
        for (let i2 = 0; i2 < 60; i2++) {
          const be = Math.pow(10, -3 + (6 * i2) / 59);
          for (let i3 = 0; i3 < 60; i3++) {
            const tau = Math.pow(10, -4 + (8 * i3) / 59);
            const r = Math.exp(-be * tau) / (al + be) / (0.5 * kernelK(al, be, tau));
            if (r > 1 + 1e-9) return false;
            if (r > worst) worst = r;
          }
        }
      }
      return worst > 0.999;
    },
  },
  {
    id: "imp95132-ma-lemma-ct-pair-grid",
    description:
      "the Lemma CT per-pair tail inequality on a 160000-cell grid over (two rates, two offsets): exp(-mu_j d_j - mu_jp d_jp)/(mu_j + mu_jp) <= (1/2) exp(-2 min-rate min-offset) K(mu_j, mu_jp, |d_j - d_jp|), tight at equal offsets",
    holds: () => {
      for (let i1 = 0; i1 < 20; i1++) {
        const mj = Math.pow(10, -3 + (6 * i1) / 19);
        for (let i2 = 0; i2 < 20; i2++) {
          const mj2 = Math.pow(10, -3 + (6 * i2) / 19);
          for (let i3 = 0; i3 < 20; i3++) {
            const dj = Math.pow(10, -3 + (6 * i3) / 19);
            for (let i4 = 0; i4 < 20; i4++) {
              const dj2 = Math.pow(10, -3 + (6 * i4) / 19);
              const tail = Math.exp(-mj * dj - mj2 * dj2) / (mj + mj2);
              const cap =
                0.5 * Math.exp(-2 * Math.min(mj, mj2) * Math.min(dj, dj2)) * kernelK(mj, mj2, Math.abs(dj - dj2));
              if (tail > cap * (1 + 1e-9)) return false;
            }
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95132-ma-gap-ladder-exhaustive",
    description:
      "the interval-gap ladder exhaustively: for every block b <= 60 the sorted same-parity block-interval gaps satisfy gap_k >= 2^{2k-1} (even parity) and gap_k >= 2^{2k} (odd parity), tight at blocks 0 and 2 (gap exactly 2)",
    holds: () => {
      for (let b = 0; b <= 60; b += 2) {
        const gs = sortedIntervalGaps(b, 0, 60);
        for (let k = 1; k <= gs.length; k++) if (gs[k - 1] < Math.pow(2, 2 * k - 1) - 1e-6) return false;
      }
      for (let b = 1; b <= 59; b += 2) {
        const gs = sortedIntervalGaps(b, 1, 61);
        for (let k = 1; k <= gs.length; k++) if (gs[k - 1] < Math.pow(2, 2 * k) - 1e-6) return false;
      }
      const g0 = sortedIntervalGaps(0, 0, 60);
      const g2 = sortedIntervalGaps(2, 0, 60);
      return Math.abs(g0[0] - 2) < 1e-12 && Math.abs(g2[0] - 2) < 1e-12;
    },
  },
  {
    id: "imp95132-ma-threshold-arithmetic",
    description:
      "the cluster row majorant at the certified threshold: T(11/20) = 0.9728427447175553 < 1 with margin 0.027157255282444726, truncation-stable (40 vs 80 terms), and the root bracket T(0.53) = 1.0024570485706115 > 1 > T(0.54) = 0.9874749880670212",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const t40 = tMaj(MU_STAR, 40);
      return (
        rel(t40, T_MUSTAR_LIT, 1e-12) &&
        t40 < 1 &&
        rel(1 - t40, T_MARGIN_LIT, 1e-9) &&
        Math.abs(tMaj(MU_STAR, 80) - t40) < 1e-15 &&
        rel(tMaj(0.53, 40), T_053_LIT, 1e-12) &&
        tMaj(0.53, 40) > 1 &&
        rel(tMaj(0.54, 40), T_054_LIT, 1e-12) &&
        tMaj(0.54, 40) < 1
      );
    },
  },
  {
    id: "imp95132-ma-rational-certification",
    description:
      "the rational certification chain: exp(-0.55) <= 0.576952635438368 (alternating series, dominates Math.exp), the chained majorant sUp = eU + eU^4 + 2 eU^16 dominates the true exp sum, and the square test 2 sUp^2 = 0.9468516239116663 < 1 certifies T(11/20) < 1 without library exp or sqrt",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const rc = rationalChain();
      const trueSum = Math.exp(-0.55) + Math.exp(-2.2) + Math.exp(-8.8) + Math.exp(-35.2);
      return (
        rel(rc.e055U, E055_UPPER_LIT, 1e-15) &&
        rc.e055U >= Math.exp(-0.55) &&
        rel(rc.sUp, SUP_LIT, 1e-12) &&
        rc.sUp >= trueSum &&
        rel(rc.twoSup2, TWO_SUP2_LIT, 1e-12) &&
        rc.twoSup2 < 1
      );
    },
  },
  {
    id: "imp95132-ma-theorem-battery",
    description:
      "THEOREM MA battery: 6000 seeded parity-pure multi-packet witnesses (2-5 blocks, up to 5 packets per block, mixed rates >= 11/20, amplitudes including zeros, both parities) - max E = -0.02403148015405872 strictly negative, zero E > 0 draws, max measured cluster row 0.0916820041742966 below T(11/20)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_THEOREM.maxE < 0 &&
        rel(BAT_THEOREM.maxE, BAT_MAX_E_LIT, 1e-6) &&
        BAT_THEOREM.eViol === 0 &&
        rel(BAT_THEOREM.maxRow, BAT_MAX_ROW_LIT, 1e-6) &&
        BAT_THEOREM.maxRow <= tMaj(MU_STAR, 40)
      );
    },
  },
  {
    id: "imp95132-ma-cap-batteries",
    description:
      "Lemma CA cap approach: 20000 free-rate random cluster pairs (max ratio 0.7632874191356109) and a 90000-draw edge-piled stress family (worst 0.8569038198287232) - zero violations of the sqrt(2)-split cluster cap in either battery",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_CAP.viol === 0 &&
        rel(BAT_CAP.maxRatio, BAT_CAP_MAX_RATIO_LIT, 1e-6) &&
        BAT_CAP.maxRatio < 1 &&
        rel(BAT_EDGE.worst, BAT_EDGE_WORST_LIT, 1e-6) &&
        BAT_EDGE.worst < 1
      );
    },
  },
  {
    id: "imp95132-ma-two-block-battery",
    description:
      "Corollary TB battery: 20000 free-rate two-block witnesses (any multiplicity, mixed parities included) - max E = -0.004776538341928517, zero violations of E <= 0",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return BAT_TWOBLOCK.viol === 0 && rel(BAT_TWOBLOCK.maxE, BAT_TB_MAX_E_LIT, 1e-6) && BAT_TWOBLOCK.maxE < 0;
    },
  },
  {
    id: "imp95132-ma-sibling-consistency",
    description:
      "consistency with the siblings: THEOREM PX (a member of this class) has E(0.127) = 0.016952476863480115 > 0 with 0.127 < 11/20 as THEOREM MA requires, E(11/20) = -4.2951492884408315 < 0, and the one-per-block THEOREM RT threshold 2/5 sits strictly below 11/20 (MA does not supersede RT on its subclass)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(familyE(0.127), FAMILY_E_127_LIT, 1e-9) &&
        familyE(0.127) > 0 &&
        0.127 < MU_STAR &&
        rel(familyE(MU_STAR), FAMILY_E_MUSTAR_LIT, 1e-12) &&
        familyE(MU_STAR) < 0 &&
        2 / 5 < MU_STAR
      );
    },
  },
  {
    id: "imp95132-ma-honesty-gate",
    description:
      "the verdict is scoped: parity-pure only, threshold 11/20 sufficient not sharp (sandwich [0.127, 0.54]), the parent sub-gap imp-95130-subgap-phi-conditional-odd-mass stays OPEN, the pricing leg stays OPEN (upgraded), one NEW sharpening leg is named; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95132_CLUSTER_ABSORPTION_THRESHOLD.promotesBound === false &&
      /NO QED/.test(IMP95132_CLUSTER_ABSORPTION_THRESHOLD.rigorScope) &&
      /refereed bound is changed/i.test(IMP95132_CLUSTER_ABSORPTION_THRESHOLD.rigorScope) &&
      /stays OPEN/.test(IMP95132_CLUSTER_ABSORPTION_THRESHOLD.rigorScope) &&
      /remains OPEN/.test(IMP95132_CLUSTER_ABSORPTION_THRESHOLD.openResiduals[0]) &&
      /not closed/.test(IMP95132_CLUSTER_ABSORPTION_THRESHOLD.openResiduals[1]) &&
      IMP95132_CLUSTER_ABSORPTION_THRESHOLD.subGaps.length === 2 &&
      IMP95132_CLUSTER_ABSORPTION_THRESHOLD.openResiduals.length === 3 &&
      /parity-pure only/.test(IMP95132_CLUSTER_ABSORPTION_THRESHOLD.rigorScope) &&
      /not sharp/.test(IMP95132_CLUSTER_ABSORPTION_THRESHOLD.rigorScope),
  },
];

for (const a of IMP95132_CLUSTER_ABSORPTION_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95132-cluster-absorption-threshold assertion failed: ${a.id}`);
  }
}

export default IMP95132_CLUSTER_ABSORPTION_THRESHOLD;
