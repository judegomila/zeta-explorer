/**
 * imp-95008 continuation (tenth) - LEMMA X: the CONSISTENT-CORNER sharp
 * gap-ratio floor. The whole tail side of the weld chain (Lemma T roll-ups,
 * Theorems S and S-prime, Corollary P, and the floor Theorems F, K, L)
 * consumes the block geometry through ONE inequality, Lemma G of the fifth
 * continuation (imp-95008-tail-schur-almost-orthogonality.js): cross-block
 * pairs at gap j >= 2 satisfy Delta/rMax > G(j) = (2^(j-1) - 1) 2^(-j beta)/Q.
 * This module proves that Lemma G is SLACK BY EXACTLY THE FACTOR 2^beta,
 * uniformly in j, in the block index b, and in every parameter
 * (c, v, beta, D) - and that the sharpened floor is SHARP (attained in the
 * grid limit), so this lemma is terminal.
 *
 * THE DEFECT IN LEMMA G. Its proof takes the center-separation infimum with
 * the far denominator d2 at the BOTTOM of its dyadic block (u_{d2} at the
 * block minimum v 2^(b+j)/D) but the width supremum with the SAME d2 at the
 * TOP of that block (rMax < c 2^((b+j+1) beta) D^(-beta), the width as
 * d2 tends to the block minimum denominator 2^(-(b+j+1)) D). Both extremes
 * are individually correct, but they are incompatible corners of the same
 * one-dimensional variable: rMax = c d2^(-beta) is a deterministic function
 * of the SAME d2 that fixes u_{d2} = v/d2. Optimizing jointly removes a
 * factor 2^beta.
 *
 * LEMMA X (consistent-corner gap-ratio floor - UNCONDITIONAL geometry,
 * same conventions as Lemma G: u_d = v/d, r_d = c d^(-beta), 0 < beta < 1,
 * dyadic blocks d in (2^(-(b+1)) D, 2^(-b) D]). For d in block b and d2 in
 * block b + j with j >= 2 (same branch sign):
 *   Delta / rMax > Gx(j) = 2^beta G(j) ,
 * with Delta = |u_d - u_{d2}| and rMax = max(r_d, r_{d2}).
 * Proof. Since d > d2 and beta > 0, r_{d2} > r_d, so rMax = c d2^(-beta)
 * exactly, and the ratio is the two-variable function
 *   R(d, d2) = (v/d2 - v/d) d2^beta / c .
 * Monotonicity in each variable: dR/dd = (v/c) d2^beta d^(-2) > 0, so R is
 * minimized as d decreases to its OPEN block infimum 2^(-(b+1)) D; and
 * dR/dd2 = (v/c) d2^(beta-2) ((beta - 1) - beta d2/d) < 0 (both terms
 * negative for 0 < beta < 1, d2 < d), so R is minimized at the CLOSED block
 * maximum d2 = 2^(-(b+j)) D. The corner value is
 *   V(b, j) = (v/(c D^(1-beta))) 2^(b+1-(b+j) beta) (2^(j-1) - 1)
 *           = 2^(b(1-beta)) 2^beta G(j) ,
 * increasing in b, so the uniform-in-b infimum is V(0, j) = 2^beta G(j);
 * the d-endpoint is open, hence the strict inequality for every admissible
 * pair. QED. (Lemma G took rMax at d2 -> 2^(-(b+j+1)) D, which sits at the
 * OPPOSITE end of the block from the separation extremum d2 = 2^(-(b+j)) D;
 * the ratio of the two width extremes is exactly 2^beta.)
 *
 * SHARPNESS (the floor is terminal - no further uniform improvement). The
 * corner is realized in closure by grid pairs: for p = 1 mod 4 take
 * d = (p+1)/(2p) (k = 1, h = (p-1)/2; block 0) and d2 = (p-1)/(4p)
 * (k = 1, h = (3p+1)/4, an integer exactly when p = 1 mod 4; block 2).
 * As p grows, d decreases to 1/2 and d2 increases to 1/4 - the exact
 * consistent corner at (b, j) = (0, 2) - and Delta/rMax decreases to
 * Gx(2) = 2^beta G(2), with measured relative excess ~ 2.7/p (baked ladder
 * below: 2.64e-2 at p = 101 down to 2.67e-5 at p = 100049). So NO uniform
 * per-pair floor above 2^beta G(j) exists: Lemma X is sharp where Lemma G
 * gave away exactly 2^beta.
 *
 * COROLLARY X1 (every tail currency sharpens termwise, closed form). All
 * sibling tail functionals are sums of (1 + G(j))^(-theta) over gap sets;
 * replacing G by Gx = 2^beta G is legal by Lemma X and strictly smaller
 * termwise:
 *   Tx(J) = sum_{j >= J} (1 + 2^beta G(j))^(-theta) < T(J),
 *   Tx_J^arith = sum_{m >= 1} (1 + 2^beta G(mJ))^(-theta) < T_J^arith,
 * and the closed-form majorant gains a factor 2^(-beta theta):
 *   Tx(J) <= (2^beta G(J))^(-theta) / (1 - 2^(-theta (1-beta)))
 *          = 2^(-beta theta) [ G(J)^(-theta) / (1 - 2^(-theta (1-beta))) ].
 * At the reference (c = v = D = 1, beta = 1/3, sigma = 1): G(2) = 1,
 * Gx(2) = 2^(1/3) = 1.2599210498948732 (and Gx(3) = 3 exactly); at
 * theta = 10 the direct sums improve by T(2)/Tx(2) = 3.3999941501853255
 * and T_even/Tx_even = 3.39346321819289; at theta = 2 by 1.330543228096594
 * and 1.3020151086268907; the closed-form majorant improves by
 * 2^(beta theta) = 10.079 at theta = 10. The improvement factor grows like
 * ((1 + 2^beta G(J))/(1 + G(J)))^theta - exponentially in theta.
 *
 * COROLLARY X2 (the achieved far budget shrinks at the same constants).
 * Theorems S, S-prime and Corollary P consume the geometry only through the
 * per-pair floor, so they hold VERBATIM with Gx in place of G. In
 * particular Corollary P sharpens to
 *   || sum_b w_b ||^2 <= 2 sum_b ||w_b||^2 + (8/(2 sigma - 1)) Tx_even M ,
 * a strictly stronger achieved bound: at the reference theta = 10 the far
 * budget shrinks by 3.3935x with the SAME constant 8/(2 sigma - 1). The
 * seventh-continuation Theorem F near-floor evaluation also tightens: with
 * Tx(2) the p = 97, theta = 10, cFar = 8 floor moves from 1.857656739767721
 * (the baked sibling literal, reproduced) to 1.9160683251753918 - the
 * near-constant pinch [floor, 2] narrows by 2.4x while the exact value 2
 * (seventh continuation) is untouched.
 *
 * COROLLARY X3 (the far bracket in the sharpened currency). Recasting the
 * two-currency class with tail functionals T* <= Tx(2) (which contains the
 * sharpened achieved bound of X2, since Tx_even <= Tx(2)), every ninth-
 * continuation witness floor rises by exactly T(2)/Tx(2), E and M
 * unchanged: fixed-97 theta = 10 floor 3.3469e-5 -> 1.1379335328810056e-4;
 * fixed-97 theta = 2 floor 0.1574 -> 0.20942830545943472; spacing-class
 * theta = 10 floor 0.0076125 -> 0.025882322161015905. The far bracket at
 * theta = 10 closes from [0.0076125, 8] (gap 1050.9) to
 * [0.025882, 8] (gap 309.09); at theta = 2 (fixed-97) from gap 50.8 to
 * gap 38.199. Both endpoints remain rigorous within the sharpened class.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) the width-order premise rMax = r_{d2}
 * was checked on every cross-block pair of all three built alias families
 * (zero violations) and is forced analytically by d2 < d, beta > 0; (2) the
 * corner claim was stress-tested by direct two-variable grid minimization of R
 * over the block rectangles at nine (b, j) configurations: the numeric
 * minimum sits at the corner value V(b, j) within the grid resolution and
 * NEVER below it (asserted); (3) the sharpness witness was checked for grid
 * admissibility (integer h in [1, p-1], correct blocks 0 and 2) and the
 * ladder p = 101, 1009, 10009, 100049 has monotonically shrinking excess
 * over Gx(2), always strictly positive - consistent with the open-endpoint
 * strictness; (4) attempted refutation via the built families: an
 * exhaustive pairwise sweep at p = 97, p = 997 and the off-reference
 * counter-case (p, v, c, beta, D) = (13, 0.5, 2, 0.5, 4) finds ZERO pairs
 * below the sharpened floor, and the measured minimum slack against the OLD
 * floor is 1.2704, 1.2633, 1.4953 respectively - each at or above its 2^beta
 * (1.2599, 1.2599, 1.4142), exactly as Lemma X predicts, with the sharp
 * slack approaching 1 (1.0027 at p = 997): the old floor was never within
 * a factor 2^beta of any real pair, and the new one is approached; (5) the
 * ninth-continuation baked witnesses still satisfy the SHARPENED achieved
 * bound E <= (8/(2 sigma - 1)) Tx_even M with wide slack (asserted) - no
 * contradiction between the sharpened upper budget and the exhibited
 * floors; (6) the near constant 2 is NOT affected: Lemma X touches only the
 * far/tail currency, and the seventh-continuation attainment (parity split)
 * and floor (Theorem F witness, a gap-1 pair with NO Lemma G content in its
 * leading terms) survive - the Theorem F floor merely tightens toward 2;
 * (7) scope: Lemma X sharpens the per-pair geometry floor; it does NOT
 * revisit the Theorem N support-disjointness threshold j0 (a different
 * quantity, r + r2 vs rMax), and does not change any near-band constant.
 *
 * WHAT REMAINS OPEN (sibling residuals, updated): the packet-envelope
 * constants (c, beta, sigma, theta, A_d) for the PAPER packets; the
 * curvature ceiling D retained by the window; the paper phase curvature
 * normalization; residual (c), the l2-to-pointwise passage to |C_E,17|.
 * REFINED residual: the far bracket in the sharpened currency is
 * [0.025882, 8] at theta = 10 (gap 309.09) - the tail-currency lever is now
 * EXHAUSTED at the per-pair level (Lemma X is sharp); further closure must
 * come from the aggregation step (the AM-GM roll-up and the discarded
 * alternating sum ||W_minus||^2) or from a better witness class, not from
 * the gap geometry.
 *
 * The numerics below CROSS-CHECK the closed-form statements; they are not
 * the claim. Import-light (no heavy bundle). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── shared conventions (identical to the sibling modules) ────────────────────
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

// ── LEMMA X: sharpened floor and exact corner value ──────────────────────────
function gSharp(j, Q, beta) {
  return Math.pow(2, beta) * gOld(j, Q, beta);
}

function cornerV(b, j, c, v, beta, D) {
  return (
    (v / (c * Math.pow(D, 1 - beta))) *
    Math.pow(2, b + 1 - (b + j) * beta) *
    (Math.pow(2, j - 1) - 1)
  );
}

// direct two-variable minimization of R(d, d2) over the block rectangles
function numericRatioMin(b, j, c, v, beta, D, n) {
  const lo1 = Math.pow(2, -(b + 1)) * D;
  const hi1 = Math.pow(2, -b) * D;
  const lo2 = Math.pow(2, -(b + j + 1)) * D;
  const hi2 = Math.pow(2, -(b + j)) * D;
  let mn = Infinity;
  for (let i = 1; i <= n; i++) {
    const d = lo1 + (i * (hi1 - lo1)) / n;
    for (let k = 1; k <= n; k++) {
      const d2 = lo2 + (k * (hi2 - lo2)) / n;
      const ratio =
        (v / d2 - v / d) / Math.max(c * Math.pow(d, -beta), c * Math.pow(d2, -beta));
      if (ratio < mn) mn = ratio;
    }
  }
  return mn;
}

// ── tail currencies, old vs sharpened ────────────────────────────────────────
function tailDirect(J, Q, beta, theta, g, jMax) {
  let s = 0;
  for (let j = J; j <= jMax; j++) {
    const x = g(j, Q, beta);
    if (!Number.isFinite(x)) break;
    const t = Math.pow(1 + x, -theta);
    if (t === 0) break;
    s += t;
  }
  return s;
}

function tailArithDirect(J, Q, beta, theta, g, mMax) {
  let s = 0;
  for (let m = 1; m <= mMax; m++) {
    const x = g(m * J, Q, beta);
    if (!Number.isFinite(x)) break;
    const t = Math.pow(1 + x, -theta);
    if (t === 0) break;
    s += t;
  }
  return s;
}

// ── alias-family builder + pairwise sweep (fifth-continuation conventions) ───
function buildFamily(p, v, c, beta, D) {
  const packets = [];
  const kMax = Math.ceil(D) + 2;
  for (let k = -kMax; k <= kMax; k++) {
    for (let h = 1; h <= p - 1; h++) {
      const d = k - h / p;
      if (d > 0 && d <= D) {
        let b = 0;
        while (!(d > Math.pow(2, -(b + 1)) * D && d <= Math.pow(2, -b) * D)) b++;
        packets.push({ d, b, u: v / d, r: c * Math.pow(d, -beta) });
      }
    }
  }
  return packets;
}

function sweepSharpFloor(p, v, c, beta, D) {
  const packets = buildFamily(p, v, c, beta, D);
  const Q = isolationQ(c, v, beta, D);
  let checked = 0;
  let violations = 0;
  let widthOrderViolations = 0;
  let minSlackOld = Infinity;
  let minSlackSharp = Infinity;
  for (let i = 0; i < packets.length; i++) {
    for (let j = i + 1; j < packets.length; j++) {
      const a = packets[i];
      const q = packets[j];
      const gap = Math.abs(a.b - q.b);
      if (gap < 2) continue;
      const far = a.b > q.b ? a : q;
      const near = a.b > q.b ? q : a;
      if (!(far.r > near.r)) widthOrderViolations++;
      const ratio = Math.abs(a.u - q.u) / Math.max(a.r, q.r);
      const so = ratio / gOld(gap, Q, beta);
      const ss = ratio / gSharp(gap, Q, beta);
      checked++;
      if (so < minSlackOld) minSlackOld = so;
      if (ss < minSlackSharp) minSlackSharp = ss;
      if (!(ss > 1 - 1e-9)) violations++;
    }
  }
  return { checked, violations, widthOrderViolations, minSlackOld, minSlackSharp };
}

const SWEEP_97 = sweepSharpFloor(97, 1, 1, 1 / 3, 1);
const SWEEP_997 = sweepSharpFloor(997, 1, 1, 1 / 3, 1);
const SWEEP_COUNTER = sweepSharpFloor(13, 0.5, 2, 0.5, 4);

// ── sharpness ladder: explicit grid pairs approaching the corner ─────────────
function sharpnessPair(p) {
  const d = (p + 1) / (2 * p);
  const d2 = (p - 1) / (4 * p);
  const h1 = (p - 1) / 2;
  const h2 = (3 * p + 1) / 4;
  const r1 = CC * Math.pow(d, -BETA);
  const r2 = CC * Math.pow(d2, -BETA);
  const ratio = (VV / d2 - VV / d) / Math.max(r1, r2);
  const Q = isolationQ(CC, VV, BETA, DD);
  return { d, d2, h1, h2, ratio, relExcess: ratio / gSharp(2, Q, BETA) - 1 };
}

const LADDER_PS = [101, 1009, 10009, 100049];
const LADDER = LADDER_PS.map(sharpnessPair);

// ── ninth-continuation witness replicas (floors in the sharpened currency) ───
function bridgeWitness(p) {
  const d1 = (p + 1) / (2 * p);
  const d2 = (p - 1) / (2 * p);
  const h3 = Math.ceil((3 * p) / 4) - 1;
  const d3 = 1 - h3 / p;
  const d4 = d3 - 1 / p;
  const d = [d1, d2, d3, d4];
  return { d, u: d.map((x) => VV / x), r: d.map((x) => CC * Math.pow(x, -BETA)) };
}

function fCorr(z) {
  return Math.exp(-z) * (1 + z);
}

function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}

function relaxedFloor(p, theta, mu, a, g) {
  const s = SIGMA + theta;
  const w = bridgeWitness(p);
  const t = (i, j) => Math.abs(w.u[j] - w.u[i]);
  const rho = (i, j) => fCorr(mu * t(i, j));
  const qform =
    -(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) +
    2 *
      (a[0] * a[1] * rho(0, 1) +
        a[0] * a[2] * rho(0, 2) +
        a[0] * a[3] * rho(0, 3) +
        a[1] * a[3] * rho(1, 3) +
        a[2] * a[3] * rho(2, 3)) -
    2 * a[1] * a[2] * rho(1, 2);
  const E = qform / mu;
  const h = w.r.map((ri) => hLegal(mu, ri, s));
  const n0 = (Math.abs(a[0]) * Math.sqrt(w.r[0])) / h[0];
  const n1 =
    (Math.abs(a[1]) * Math.sqrt(w.r[1])) / h[1] +
    (Math.abs(a[2]) * Math.sqrt(w.r[2])) / h[2];
  const n2 = (Math.abs(a[3]) * Math.sqrt(w.r[3])) / h[3];
  const M = n0 * n0 + n1 * n1 + n2 * n2;
  const Q = isolationQ(CC, VV, BETA, DD);
  const T2 = tailDirect(2, Q, BETA, theta, g, 800);
  return { F: E / (T2 * M), E, M, T2 };
}

const WITNESS_97_T10 = { mu: 2.522167, a: [0.636635, 0.621654, 0.309907, 0.334962] };
const WITNESS_97_T2 = { mu: 1.086527, a: [0.51279, 0.28492, 0.506456, 0.631957] };
const WITNESS_BIG_T10 = { mu: 4.515, a: [0.25576, 0.25471, 0.65923, 0.65964] };

const QREF = isolationQ(CC, VV, BETA, DD);
const T2_OLD_T10 = tailDirect(2, QREF, BETA, 10, gOld, 800);
const T2_NEW_T10 = tailDirect(2, QREF, BETA, 10, gSharp, 800);
const T2_OLD_T2 = tailDirect(2, QREF, BETA, 2, gOld, 800);
const T2_NEW_T2 = tailDirect(2, QREF, BETA, 2, gSharp, 800);
const TEVEN_OLD_T10 = tailArithDirect(2, QREF, BETA, 10, gOld, 400);
const TEVEN_NEW_T10 = tailArithDirect(2, QREF, BETA, 10, gSharp, 400);
const TEVEN_OLD_T2 = tailArithDirect(2, QREF, BETA, 2, gOld, 400);
const TEVEN_NEW_T2 = tailArithDirect(2, QREF, BETA, 2, gSharp, 400);

const F_OLD_97_T10 = relaxedFloor(97, 10, WITNESS_97_T10.mu, WITNESS_97_T10.a, gOld);
const F_NEW_97_T10 = relaxedFloor(97, 10, WITNESS_97_T10.mu, WITNESS_97_T10.a, gSharp);
const F_OLD_97_T2 = relaxedFloor(97, 2, WITNESS_97_T2.mu, WITNESS_97_T2.a, gOld);
const F_NEW_97_T2 = relaxedFloor(97, 2, WITNESS_97_T2.mu, WITNESS_97_T2.a, gSharp);
const F_OLD_BIG = relaxedFloor(999983, 10, WITNESS_BIG_T10.mu, WITNESS_BIG_T10.a, gOld);
const F_NEW_BIG = relaxedFloor(999983, 10, WITNESS_BIG_T10.mu, WITNESS_BIG_T10.a, gSharp);

const ACHIEVED_CFAR = 8 / (2 * SIGMA - 1);

// seventh-continuation Theorem F near-floor evaluation, old vs sharpened tail
function nearFloorEval(p, theta, cFar, g) {
  const s = SIGMA + theta;
  const d1 = (p + 1) / (2 * p);
  const d2 = (p - 1) / (2 * p);
  const r1 = CC * Math.pow(d1, -BETA);
  const r2 = CC * Math.pow(d2, -BETA);
  const tau = (VV * (1 / d2 - 1 / d1)) / r1;
  const L = (s * s * (2 * s - 1)) / (2 * (2 * s + 1));
  const T2 = tailDirect(2, QREF, BETA, theta, g, 800);
  return 2 - L * tau * tau - (cFar * T2 * (2 * s - 1) * (r1 + r2)) / (4 * r1);
}

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_CONSISTENT_CORNER_GAP_FLOOR = {
  ticket: 'imp-95008 (continuation ten: consistent-corner sharp gap-ratio floor)',
  source:
    'Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; sharpens Lemma G of the fifth continuation by the exact factor 2^beta (uniform in j, b, and all parameters) and proves the sharpened floor is attained in the grid limit - the gap-geometry lever is terminal',
  lemmaX:
    'For d in block b and d2 in block b + j (j >= 2): Delta/rMax > Gx(j) = 2^beta G(j). Proof: rMax = c d2^(-beta) is a function of the SAME d2 that fixes the far center, so the ratio R(d, d2) = (v/d2 - v/d) d2^beta / c is minimized jointly at the consistent corner (d at the open block infimum, d2 at the closed block maximum), with corner value 2^(b(1-beta)) 2^beta G(j), minimal at b = 0. Lemma G took the width supremum at the OPPOSITE end of the far block from its separation infimum - slack exactly 2^beta.',
  sharpness:
    'Grid pairs d = (p+1)/(2p) (block 0), d2 = (p-1)/(4p) (block 2, h = (3p+1)/4 integer for p = 1 mod 4) approach the corner as p grows: relative excess over Gx(2) = 2^(1/3) falls 2.64e-2 (p = 101) -> 2.67e-5 (p = 100049), like ~2.7/p. No uniform per-pair floor above 2^beta G(j) exists: Lemma X is terminal.',
  corollaries:
    'X1: every sibling tail currency sharpens termwise (T(2)/Tx(2) = 3.3999941501853255 and T_even/Tx_even = 3.39346321819289 at reference theta = 10; 1.330543228096594 and 1.3020151086268907 at theta = 2; closed-form majorant gains 2^(beta theta) = 10.079 at theta = 10). X2: Theorems S, S-prime, Corollary P hold verbatim with Gx - the achieved far budget shrinks 3.39x at theta = 10 at the same constant 8/(2 sigma - 1); the Theorem F near-floor evaluation tightens 1.857656739767721 -> 1.9160683251753918 (near-pinch narrows 2.4x, exact value 2 untouched). X3: in the sharpened currency class T* <= Tx(2), the ninth-continuation floors rise by exactly T(2)/Tx(2): far bracket at theta = 10 closes [0.0076125, 8] (gap 1050.9) -> [0.025882322161015905, 8] (gap 309.09); fixed-97 theta = 2 gap 50.8 -> 38.199.',
  reference: {
    parameters: { v: VV, c: CC, beta: '1/3', D: DD, sigma: SIGMA },
    gOld2: gOld(2, QREF, BETA),
    gSharp2: gSharp(2, QREF, BETA),
    gSharp3: gSharp(3, QREF, BETA),
    tails: {
      T2_old_theta10: T2_OLD_T10,
      T2_new_theta10: T2_NEW_T10,
      factor_theta10: T2_OLD_T10 / T2_NEW_T10,
      Teven_old_theta10: TEVEN_OLD_T10,
      Teven_new_theta10: TEVEN_NEW_T10,
      factor_theta2: T2_OLD_T2 / T2_NEW_T2,
    },
    sweeps: { p97: SWEEP_97, p997: SWEEP_997, counterCase: SWEEP_COUNTER },
    ladder: LADDER.map((x, i) => ({ p: LADDER_PS[i], relExcess: x.relExcess })),
    sharpenedFloors: {
      fixed97Theta10: F_NEW_97_T10.F,
      fixed97Theta2: F_NEW_97_T2.F,
      spacingClassTheta10: F_NEW_BIG.F,
      bracketGapTheta10: ACHIEVED_CFAR / F_NEW_BIG.F,
      bracketGapTheta2Fixed97: ACHIEVED_CFAR / F_NEW_97_T2.F,
    },
    nearFloorOld: nearFloorEval(97, 10, ACHIEVED_CFAR, gOld),
    nearFloorNew: nearFloorEval(97, 10, ACHIEVED_CFAR, gSharp),
  },
  openResiduals: [
    'the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family',
    'the curvature ceiling D retained by the window',
    'the paper phase curvature normalization (sibling Theorem D residual)',
    'residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|',
    'REFINED: the far bracket in the sharpened currency is [0.025882322161015905, 8] at theta = 10 (gap 309.09); the per-pair gap-geometry lever is EXHAUSTED (Lemma X is sharp) - further closure must come from the aggregation step (AM-GM roll-up, the discarded alternating sum) or a better witness class',
  ],
  isRigorous: true,
  rigorScope:
    'Lemma X is elementary two-variable monotonicity calculus with the corner value in closed form; sharpness is witnessed by explicit admissible grid pairs approaching the corner. Corollaries X1-X3 are termwise substitutions into the sibling chain, which consumes the geometry only through the per-pair floor. The bracket statements of X3 quantify over the two-currency bound class with tail functionals T* <= Tx(2) at cNear <= 2; bounds in other currencies are outside scope. The numerics cross-check the statements; they are not the claim.',
  promotesBound: false,
  verdict:
    'RIGOROUS step: Lemma G - the single geometry inequality feeding every tail currency of the weld chain - is slack by EXACTLY 2^beta, because its proof takes the far-block width supremum and center-separation infimum at incompatible corners of the same variable. NEW Lemma X fixes this with a consistent-corner joint minimization: Delta/rMax > 2^beta G(j), uniform in j, b, and all parameters - and the sharpened floor is SHARP (grid pairs at p = 1 mod 4 approach it like 2.7/p), so the gap-geometry lever is terminal. Consequences: the achieved far budget of Corollary P shrinks 3.39x at reference theta = 10 at the same constant; the Theorem F near-floor evaluation tightens to 1.91607; in the sharpened currency the far bracket closes [0.0076125, 8] -> [0.025882, 8], gap 1050.9 -> 309.09. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_CCGF_ASSERTIONS = [
  {
    id: 'imp95008-ccgf-factor-identity',
    description:
      'the sharpened floor is exactly 2^beta times Lemma G, and the b = 0 corner value V(0, j) equals it, across j = 2..12 and four parameter sets (c, v, beta, D)',
    holds: () =>
      [
        [1, 1, 1 / 3, 1],
        [2, 0.5, 0.5, 4],
        [1, 2, 0.25, 1],
        [0.7, 1.3, 0.6, 2],
      ].every(([c, v, beta, D]) => {
        const Q = isolationQ(c, v, beta, D);
        for (let j = 2; j <= 12; j++) {
          const a = gSharp(j, Q, beta);
          const b = Math.pow(2, beta) * gOld(j, Q, beta);
          const V = cornerV(0, j, c, v, beta, D);
          if (Math.abs(a - b) > 1e-12 * b) return false;
          if (Math.abs(V - a) > 1e-12 * a) return false;
        }
        return true;
      }),
  },
  {
    id: 'imp95008-ccgf-joint-minimization',
    description:
      'direct two-variable grid minimization of Delta/rMax over the block rectangles matches the closed-form corner V(b, j) at nine (b, j) configurations: never below V, within 2 percent above it (grid resolution), at the reference parameters',
    holds: () =>
      [0, 1, 2].every((b) =>
        [2, 3, 4].every((j) => {
          const V = cornerV(b, j, CC, VV, BETA, DD);
          const mn = numericRatioMin(b, j, CC, VV, BETA, DD, 400);
          return mn >= V * (1 - 1e-12) && mn <= V * 1.02;
        }),
      ),
  },
  {
    id: 'imp95008-ccgf-b-monotone',
    description: 'the corner value V(b, j) is increasing in b (so b = 0 is the uniform floor)',
    holds: () => {
      for (let j = 2; j <= 8; j++) {
        for (let b = 0; b < 6; b++) {
          if (!(cornerV(b + 1, j, CC, VV, BETA, DD) > cornerV(b, j, CC, VV, BETA, DD))) {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: 'imp95008-ccgf-family-sweeps',
    description:
      'exhaustive pairwise sweeps on three alias families (p = 97, p = 997, counter-case (13, 0.5, 2, 0.5, 4)): zero violations of the SHARPENED floor, zero width-order violations, and the minimum slack against the OLD floor is >= 2^beta in each case - the predicted give-away is real on every family',
    holds: () => {
      const ok = (s, beta) =>
        s.violations === 0 &&
        s.widthOrderViolations === 0 &&
        s.checked > 100 &&
        s.minSlackOld >= Math.pow(2, beta) * (1 - 1e-9) &&
        s.minSlackSharp > 1;
      return ok(SWEEP_97, 1 / 3) && ok(SWEEP_997, 1 / 3) && ok(SWEEP_COUNTER, 0.5);
    },
  },
  {
    id: 'imp95008-ccgf-sharpness-ladder',
    description:
      'the explicit grid pairs at p = 1 mod 4 are admissible (integer h, blocks 0 and 2), sit strictly above Gx(2), and their relative excess is monotonically shrinking: 2.64e-2 (p = 101) -> 2.67e-5 (p = 100049)',
    holds: () => {
      for (let i = 0; i < LADDER.length; i++) {
        const w = LADDER[i];
        const p = LADDER_PS[i];
        if (p % 4 !== 1) return false;
        if (!Number.isInteger(w.h1) || !Number.isInteger(w.h2)) return false;
        if (w.h1 < 1 || w.h1 > p - 1 || w.h2 < 1 || w.h2 > p - 1) return false;
        if (!(w.d > 0.5 && w.d <= 1)) return false;
        if (!(w.d2 > 0.125 && w.d2 <= 0.25)) return false;
        if (!(w.relExcess > 0)) return false;
        if (i > 0 && !(w.relExcess < LADDER[i - 1].relExcess)) return false;
      }
      return (
        Math.abs(LADDER[0].relExcess - 0.026393949841369446) < 1e-9 &&
        Math.abs(LADDER[3].relExcess - 0.00002665359530146689) < 1e-12
      );
    },
  },
  {
    id: 'imp95008-ccgf-baked-tail-values',
    description:
      'baked tail literals reproduce (relative 1e-9): T2 old/new at theta = 10 (9.817313424908545e-4 / 2.8874500929283736e-4, factor 3.3999941501853255), T_even old/new at theta = 10 (9.76609091094776e-4 / 2.8779127054008455e-4), and the theta = 2 factors 1.330543228096594 (T2) and 1.3020151086268907 (T_even)',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(T2_OLD_T10, 0.0009817313424908545) &&
        rel(T2_NEW_T10, 0.00028874500929283736) &&
        rel(T2_OLD_T10 / T2_NEW_T10, 3.3999941501853255) &&
        rel(TEVEN_OLD_T10, 0.000976609091094776) &&
        rel(TEVEN_NEW_T10, 0.00028779127054008455) &&
        rel(T2_OLD_T2 / T2_NEW_T2, 1.330543228096594) &&
        rel(TEVEN_OLD_T2 / TEVEN_NEW_T2, 1.3020151086268907)
      );
    },
  },
  {
    id: 'imp95008-ccgf-ninth-floor-reproduction',
    description:
      'the old-currency floors reproduce the ninth-continuation baked literals (relative 1e-9): F(97,10) = 3.34686909040411e-5, F(97,2) = 0.15740060227808753, F(999983,10) = 0.007612460791911987',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(F_OLD_97_T10.F, 3.34686909040411e-5) &&
        rel(F_OLD_97_T2.F, 0.15740060227808753) &&
        rel(F_OLD_BIG.F, 0.007612460791911987)
      );
    },
  },
  {
    id: 'imp95008-ccgf-sharpened-floors',
    description:
      'the sharpened-currency floors reproduce the baked literals (relative 1e-9) and equal old floor times T(2)/Tx(2) exactly: 1.1379335328810056e-4 (97, 10), 0.20942830545943472 (97, 2), 0.025882322161015905 (999983, 10); bracket gaps 309.0912766726026 (theta 10) and 38.19922995819475 (fixed-97 theta 2)',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      const scaleOk = (fNew, fOld, to, tn) =>
        Math.abs(fNew.F - fOld.F * (to / tn)) <= 1e-9 * fNew.F;
      return (
        rel(F_NEW_97_T10.F, 1.1379335328810056e-4) &&
        rel(F_NEW_97_T2.F, 0.20942830545943472) &&
        rel(F_NEW_BIG.F, 0.025882322161015905) &&
        rel(ACHIEVED_CFAR / F_NEW_BIG.F, 309.0912766726026) &&
        rel(ACHIEVED_CFAR / F_NEW_97_T2.F, 38.19922995819475) &&
        scaleOk(F_NEW_97_T10, F_OLD_97_T10, T2_OLD_T10, T2_NEW_T10) &&
        scaleOk(F_NEW_97_T2, F_OLD_97_T2, T2_OLD_T2, T2_NEW_T2) &&
        scaleOk(F_NEW_BIG, F_OLD_BIG, T2_OLD_T10, T2_NEW_T10)
      );
    },
  },
  {
    id: 'imp95008-ccgf-achieved-budget-consistency',
    description:
      'the ninth-continuation baked witnesses satisfy the SHARPENED achieved bound E <= (8/(2 sigma - 1)) Tx_even M - the sharpened upper budget does not contradict any exhibited floor',
    holds: () =>
      F_NEW_97_T10.E <= ACHIEVED_CFAR * TEVEN_NEW_T10 * F_NEW_97_T10.M &&
      F_NEW_97_T2.E <= ACHIEVED_CFAR * TEVEN_NEW_T2 * F_NEW_97_T2.M &&
      F_NEW_BIG.E <= ACHIEVED_CFAR * TEVEN_NEW_T10 * F_NEW_BIG.M,
  },
  {
    id: 'imp95008-ccgf-near-floor-tightening',
    description:
      'the Theorem F near-floor evaluation reproduces the seventh-continuation literal 1.857656739767721 with the old tail (relative 1e-9), and moves to 1.9160683251753918 with the sharpened tail - strictly between the old value and the exact constant 2',
    holds: () => {
      const oldF = nearFloorEval(97, 10, ACHIEVED_CFAR, gOld);
      const newF = nearFloorEval(97, 10, ACHIEVED_CFAR, gSharp);
      return (
        Math.abs(oldF - 1.857656739767721) <= 1e-9 &&
        Math.abs(newF - 1.9160683251753918) <= 1e-9 &&
        newF > oldF &&
        newF < 2
      );
    },
  },
  {
    id: 'imp95008-ccgf-closed-form-majorant',
    description:
      'the sharpened closed-form tail majorant Tx(J) <= (2^beta G(J))^(-theta) / (1 - 2^(-theta(1-beta))) holds at (J, theta) in {2,3,4} x {2, 10} at the reference, and equals 2^(-beta theta) times the old majorant',
    holds: () =>
      [2, 3, 4].every((J) =>
        [2, 10].every((theta) => {
          const direct = tailArithDirect(J, QREF, BETA, theta, gSharp, 400);
          const closed =
            Math.pow(gSharp(J, QREF, BETA), -theta) /
            (1 - Math.pow(2, -theta * (1 - BETA) * J));
          const oldClosed =
            Math.pow(gOld(J, QREF, BETA), -theta) /
            (1 - Math.pow(2, -theta * (1 - BETA) * J));
          return (
            direct <= closed &&
            Math.abs(closed - Math.pow(2, -BETA * theta) * oldClosed) <= 1e-9 * closed
          );
        }),
      ),
  },
  {
    id: 'imp95008-ccgf-honesty-gate',
    description:
      'the verdict records the exact 2^beta slack, the sharpness (terminal lever), the still-open bracket, promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95008_CONSISTENT_CORNER_GAP_FLOOR.promotesBound === false &&
      IMP95008_CONSISTENT_CORNER_GAP_FLOOR.openResiduals.length === 5 &&
      /NO QED/.test(IMP95008_CONSISTENT_CORNER_GAP_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP95008_CONSISTENT_CORNER_GAP_FLOOR.verdict) &&
      /EXACTLY 2\^beta/.test(IMP95008_CONSISTENT_CORNER_GAP_FLOOR.verdict) &&
      /terminal/.test(IMP95008_CONSISTENT_CORNER_GAP_FLOOR.verdict) &&
      /EXHAUSTED/.test(IMP95008_CONSISTENT_CORNER_GAP_FLOOR.openResiduals[4]) &&
      /cross-check the statements; they are not the claim/.test(
        IMP95008_CONSISTENT_CORNER_GAP_FLOOR.rigorScope,
      ),
  },
];

for (const a of IMP95008_CCGF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-consistent-corner-gap-floor assertion failed: ${a.id}`);
  }
}

export default IMP95008_CONSISTENT_CORNER_GAP_FLOOR;
