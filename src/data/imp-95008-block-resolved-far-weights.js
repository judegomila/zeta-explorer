/**
 * imp-95008 continuation (eleventh) - THEOREM Y: BLOCK-RESOLVED far weights.
 * The tenth continuation (imp-95008-consistent-corner-gap-floor.js) proved
 * the per-pair gap-ratio floor is EXACTLY the corner value
 *   V(b, j) = 2^{b(1-beta)} 2^beta G(j)
 * for a pair with NEAR block b and gap j >= 2 (Lemma X, sharp), and then
 * declared the per-pair geometry lever terminal, pointing the remaining far
 * bracket at the AGGREGATION step. This module executes exactly that step:
 * the achieved parity roll-up (Corollary P / S-prime(2)) consumed Lemma X
 * only through its b = 0 uniform infimum Gx(j) = V(0, j), charging EVERY
 * block the worst-case j = 2 toll in BOTH ladder directions - the factor
 * 2 T_even per block. Re-running the same roll-up with the b-RESOLVED floors
 * V(b, j) shows that bookkeeping is off by essentially a factor 2: block 0
 * has no incoming (col) pairs at all, block 2 pays the one dominant V(0, 2)
 * toll plus a negligible row, and every deeper block is asymptotically FREE
 * (its weight decays geometrically in b). The achieved far coefficient drops
 * from 8/(2 sigma - 1) to 4/(2 sigma - 1) in the same bracket class, so the
 * far bracket gap EXACTLY halves: 309.09 -> 154.55 at theta = 10.
 *
 * SETTING (identical to the sibling chain; Permuting the Zeta Twin Ladder
 * Section 4.5; page /permutation-architecture). Model family, one branch
 * sign: packets a_d with centers u_d = v/d, widths r_d = c d^(-beta),
 * dyadic blocks b, MAJ(sigma, theta) envelopes, currencies
 * nTilde_b = sum_{d in b} n_d (block l1 envelope mass), M = sum_b nTilde_b^2.
 * Lemma T (fifth continuation): |<a_d, a_d2>| <= (2/(2 sigma - 1))
 * n_d n_{d2} (1 + Delta/rMax)^(-theta). Lemma X (tenth continuation): a pair
 * with near block b and gap j >= 2 has Delta/rMax > V(b, j), STRICT, and
 * V(b, j) is increasing in both b and j.
 *
 * THEOREM Y (weighted parity roll-up - CONDITIONAL only on MAJ(sigma,theta),
 * same hypotheses as Corollary P, strictly stronger conclusion). Define, for
 * a block b in its parity class (r = b mod 2):
 *   Trow(b) = sum_{j >= 2 even} (1 + V(b, j))^(-theta) ,
 *   Tcol(b) = sum_{j even, 2 <= j <= b - r} (1 + V(b - j, j))^(-theta) ,
 *   omega_b = Trow(b) + Tcol(b) .
 * Then
 *   || sum_b w_b ||^2 <= 2 sum_b ||w_b||^2
 *                        + (4/(2 sigma - 1)) sum_b omega_b nTilde_b^2 .
 * Proof. Parity AM-GM ||W||^2 <= 2||W_E||^2 + 2||W_O||^2 (unchanged - this
 * is what pins the near constant at the exact value 2, seventh
 * continuation). Within one parity class, expand and bound each unordered
 * cross pair (b, b + j), j even >= 2, by Lemma T with the PAIR-SHARP floor
 * of Lemma X: 2|<w_b, w_{b+j}>| <= (2/(2 sigma - 1)) 2 nTilde_b
 * nTilde_{b+j} (1 + V(b, j))^(-theta), then AM-GM
 * 2 nTilde_b nTilde_{b+j} <= nTilde_b^2 + nTilde_{b+j}^2 routes the factor
 * (1 + V(b, j))^(-theta) once to the near block (its row sum) and once to
 * the far block (its col sum, where the same factor reads
 * (1 + V((b+j) - j, j))^(-theta)). Collecting per block gives the class
 * bound ||W_P||^2 <= sum_{b in P} ||w_b||^2 + (2/(2 sigma - 1))
 * sum_{b in P} omega_b nTilde_b^2; the outer factor 2 finishes. QED (of the
 * aggregation step; strictness is inherited from the open d-endpoint of
 * Lemma X). Corollary P is the special case omega_b -> 2 Tx_even obtained
 * by relaxing every V(b, j) to its b = 0 infimum V(0, j) = Gx(j); since
 * Trow(b) <= Trow(0) = Tx_even and Tcol(b) <= Tx_even termwise
 * (V(b - j, j) >= V(0, j)), Theorem Y is NEVER worse, blockwise.
 *
 * LEMMA Z (deep blocks are asymptotically free). For j >= 2,
 *   V(b - j, j) >= (2^beta / (4 Q)) 2^{b(1-beta)} ,
 * uniformly in j. Proof: 2^{j-1} - 1 >= 2^{j-2} for j >= 2, and
 * 2^{(b-j)(1-beta)} 2^{j-2} 2^{-j beta} = 2^{b(1-beta)} 2^{-2} exactly (the
 * j-exponents cancel: -j(1-beta) + j - j beta = 0). Hence
 *   Tcol(b) <= floor(b/2) (1 + (2^beta/(4Q)) 2^{b(1-beta)})^(-theta) ,
 * and with Trow(b) <= (1 + 2^{b(1-beta)} Gx(2))^(-theta) x (geometric tail)
 * both weight components decay geometrically in b: omega_b -> 0. The old
 * uniform bookkeeping charged every block 2 Tx_even forever; the true
 * ladder charges only the first few blocks.
 *
 * LEMMA M (class membership of the sup weight, beta <= 2 - log2(3)). The
 * m-th row term of Trow(2) sits under the m-th ODD tail term:
 * V(2, 2m) >= Gx(2m + 1) iff (2^{1-beta} - 1) 2^{2m} >= 2^{2-beta} - 1,
 * which is increasing in m and at m = 1 reads 2^{2-beta} >= 3, true for
 * beta <= 2 - log2(3) = 0.41504. Hence Trow(2) <= sum_{j odd >= 3}
 * (1 + Gx(j))^(-theta) and
 *   omega_2 = Tx_even + Trow(2) - (Tx_even - (1+Gx(2))^(-theta) tail overlap)
 *           <= (1 + Gx(2))^(-theta) + Trow(2) + sum_{even j >= 4} ...
 *           <= Tx(2) ,
 * i.e. omega_2 <= Tx(2): the sharpened achieved bound stays INSIDE the
 * two-currency bracket class T* <= Tx(2) used by the floor Theorems K/L and
 * the tenth-continuation bracket. (Checked numerically at both theta below;
 * the termwise inequality is asserted for m = 1..10 at the reference.)
 *
 * COROLLARY Y1 (reference evaluation, sigma = 1, beta = 1/3, c = v = D = 1).
 * omega_0 = Trow(0) = Tx_even EXACTLY (reproduces the tenth-continuation
 * baked literals 2.8779127054008455e-4 at theta = 10 and 0.22344833754411825
 * at theta = 2). The sup over ALL blocks and both parity classes is at
 * b = 2:
 *   theta = 10: omega_2 = 2.884062395107217e-4
 *               = (1+Gx(2))^(-10) + Trow(2) = 2.877844515988882e-4
 *                 + 6.217879118335217e-7 ;
 *   theta = 2:  omega_2 = 0.25835827010368023 .
 * The achieved far budget drops from (8/(2 sigma - 1)) Tx_even M to
 * (4/(2 sigma - 1)) omega_2 M: factor 1.995735397599716 at theta = 10 and
 * 1.7297556409125012 at theta = 2. The weight profile collapses
 * geometrically past b = 2 (theta = 10: 2.88e-4, 6.29e-7, 2.89e-10, ... -
 * Lemma Z), and the sup sits at b = 2 also at the off-reference counter
 * case (c, v, beta, D) = (2, 0.5, 0.5, 4).
 *
 * COROLLARY Y2 (the far bracket EXACTLY halves). The new achieved point in
 * the bracket class {cNear <= 2, T* <= Tx(2)} is (cNear, cFar) =
 * (2, 4/(2 sigma - 1)) with T* = omega_2 <= Tx(2) (Lemma M). The witness
 * floors of the ninth continuation are untouched, so at sigma = 1:
 *   theta = 10 (spacing class): [0.025882322161015905, 8] gap
 *     309.0912766726026 -> [0.025882322161015905, 4] gap 154.5456383363013 ;
 *   theta = 2 (fixed 97): [0.20942830545943472, 8] gap 38.19922995819475
 *     -> [0.20942830545943472, 4] gap 19.099614979097375 .
 *
 * COROLLARY Y3 (the Theorem F near-floor evaluation tightens again). With
 * the halved far budget 4 omega_2 in place of 8 Tx(2), the seventh-
 * continuation near-floor evaluation at (p, theta, sigma) = (97, 10, 1)
 * moves 1.9160683251753918 -> 1.9282517125255316: the near pinch [floor, 2]
 * narrows by another 1.17x while the exact near constant 2 (attained by
 * this very parity split) is untouched.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) omega_0 = Tx_even is an exact identity
 * (V(0, j) = Gx(j)), asserted against the tenth-continuation baked
 * literals through an independent code path; (2) the blockwise
 * never-worse claim omega_b <= 2 Tx_even was stress-tested termwise (row:
 * V(b, j) >= V(0, j); col: V(b - j, j) >= V(0, j)) and verified on b <= 60,
 * both parities, both theta, reference and counter-case - zero violations;
 * (3) the sup location b = 2 is NOT assumed: it is scanned over b <= 60 in
 * both parity classes at theta in {2, 10} and at the counter-case, and the
 * b = 2 dominance over b = 0 is structural (Tcol(2) carries the one
 * dominant V(0, 2) toll; Trow(2) is positive), while b >= 4 decays by
 * Lemma Z; (4) consistency with every baked ninth-continuation witness:
 * the weighted budget (4/(2 sigma - 1)) sum omega_b nTilde_b^2 majorizes
 * the exact witness excess E on all three witnesses (wide slack, asserted)
 * - the halved achieved bound contradicts no exhibited floor; (5) the near
 * constant 2 is untouched: the outer parity AM-GM is bit-identical to
 * S-prime(2), whose attainment (seventh continuation) pins cNear = 2; this
 * module only re-prices the far term; (6) class membership omega_2 <=
 * Tx(2) is proved termwise at the reference (Lemma M, binding case
 * 2^{2-beta} >= 3) and asserted numerically at both theta - without it the
 * halved coefficient would sit in a DIFFERENT currency and the bracket
 * comparison would be illegitimate; (7) direction of every inequality
 * rechecked: Lemma X gives Delta/rMax STRICTLY ABOVE V(b, j), so
 * (1 + Delta/rMax)^(-theta) < (1 + V(b, j))^(-theta) - the correlation
 * upper bound needs exactly this sign; (8) scope: same-branch-sign model
 * family as all siblings (two-branch combination costs the recorded factor
 * <= 2, not reproved); the weighted Theorem Y is parameter-free, the sup
 * evaluations are per-parameter corollaries.
 *
 * WHAT REMAINS OPEN (sibling residuals, updated): the packet-envelope
 * constants (c, beta, sigma, theta, A_d) for the PAPER packets; the
 * curvature ceiling D retained by the window; the paper phase curvature
 * normalization; residual (c), the l2-to-pointwise passage to |C_E,17|.
 * REFINED residual: the far bracket in the sharpened currency is now
 * [0.025882322161015905, 4] at theta = 10 (gap 154.55). Of the two
 * aggregation levers named by the tenth continuation, the Schur roll-up
 * side is now consumed down to its parity core: the remaining achieved-side
 * slack lives ONLY in (i) the outer parity AM-GM (the discarded alternating
 * sum ||W_minus||^2, which CANNOT be uniformly recovered - its vanishing
 * configurations are exactly the near-constant-2 attainment) and (ii) the
 * Lemma T constant itself; further closure most plausibly comes from the
 * witness side (multi-boundary chain witnesses; note a superset of witness
 * amplitudes can only raise the exhibited floor).
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

function gSharp(j, Q, beta) {
  return Math.pow(2, beta) * gOld(j, Q, beta);
}

// Lemma X per-pair corner floor, near block b, gap j
function cornerV(b, j, Q, beta) {
  return Math.pow(2, b * (1 - beta)) * gSharp(j, Q, beta);
}

const QREF = isolationQ(CC, VV, BETA, DD);

function phi(x, theta) {
  return Math.pow(1 + x, -theta);
}

// ── the block weights of Theorem Y ───────────────────────────────────────────
function tRow(b, theta, Q, beta, jMax) {
  let s = 0;
  for (let j = 2; j <= jMax; j += 2) {
    const t = phi(cornerV(b, j, Q, beta), theta);
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  return s;
}

function tCol(b, theta, Q, beta) {
  const r = b % 2;
  let s = 0;
  for (let j = 2; j <= b - r; j += 2) {
    s += phi(cornerV(b - j, j, Q, beta), theta);
  }
  return s;
}

function omegaWeight(b, theta, Q, beta) {
  return tRow(b, theta, Q, beta, 400) + tCol(b, theta, Q, beta);
}

// Lemma Z majorant for the col component
function omegaMajorantZ(b, theta, Q, beta) {
  return (
    tRow(b, theta, Q, beta, 400) +
    Math.floor(b / 2) *
      phi((Math.pow(2, beta) / (4 * Q)) * Math.pow(2, b * (1 - beta)), theta)
  );
}

// ── sharpened tails of the tenth continuation (independent code path) ────────
function tailArithSharp(theta, Q, beta, mMax) {
  let s = 0;
  for (let m = 1; m <= mMax; m++) {
    const g = gSharp(2 * m, Q, beta);
    if (!Number.isFinite(g)) break;
    const t = phi(g, theta);
    if (t === 0) break;
    s += t;
  }
  return s;
}

function tailAllSharp(theta, Q, beta, jMax) {
  let s = 0;
  for (let j = 2; j <= jMax; j++) {
    const g = gSharp(j, Q, beta);
    if (!Number.isFinite(g)) break;
    const t = phi(g, theta);
    if (t === 0) break;
    s += t;
  }
  return s;
}

// ── sup scan over blocks and parity classes ──────────────────────────────────
function supOmega(theta, Q, beta, bMax) {
  let sup = -Infinity;
  let supB = -1;
  for (let b = 0; b <= bMax; b++) {
    const w = omegaWeight(b, theta, Q, beta);
    if (w > sup) {
      sup = w;
      supB = b;
    }
  }
  return { sup, supB };
}

const SUP_T10 = supOmega(10, QREF, BETA, 60);
const SUP_T2 = supOmega(2, QREF, BETA, 60);
const Q_COUNTER = isolationQ(2, 0.5, 0.5, 4);
const SUP_COUNTER = supOmega(2, Q_COUNTER, 0.5, 120);

const OMEGA0_T10 = omegaWeight(0, 10, QREF, BETA);
const OMEGA0_T2 = omegaWeight(0, 2, QREF, BETA);
const OMEGA2_T10 = omegaWeight(2, 10, QREF, BETA);
const OMEGA2_T2 = omegaWeight(2, 2, QREF, BETA);
const TXEVEN_T10 = tailArithSharp(10, QREF, BETA, 400);
const TXEVEN_T2 = tailArithSharp(2, QREF, BETA, 400);
const TX2_T10 = tailAllSharp(10, QREF, BETA, 400);
const TX2_T2 = tailAllSharp(2, QREF, BETA, 400);

// ── ninth-continuation witness replicas (weighted-budget consistency) ────────
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

// exact witness excess E and the Theorem Y weighted far budget
function witnessWeightedBudget(p, theta, mu, a) {
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
  const budget =
    (4 / (2 * SIGMA - 1)) *
    (omegaWeight(0, theta, QREF, BETA) * n0 * n0 +
      omegaWeight(1, theta, QREF, BETA) * n1 * n1 +
      omegaWeight(2, theta, QREF, BETA) * n2 * n2);
  return { E, budget };
}

const WB_97_T10 = witnessWeightedBudget(97, 10, 2.522167, [
  0.636635, 0.621654, 0.309907, 0.334962,
]);
const WB_97_T2 = witnessWeightedBudget(97, 2, 1.086527, [
  0.51279, 0.28492, 0.506456, 0.631957,
]);
const WB_BIG_T10 = witnessWeightedBudget(999983, 10, 4.515, [
  0.25576, 0.25471, 0.65923, 0.65964,
]);

// ── seventh-continuation Theorem F near-floor, with a free far budget ─────────
function nearFloorEvalBudget(p, theta, farBudget) {
  const s = SIGMA + theta;
  const d1 = (p + 1) / (2 * p);
  const d2 = (p - 1) / (2 * p);
  const r1 = CC * Math.pow(d1, -BETA);
  const r2 = CC * Math.pow(d2, -BETA);
  const tau = (VV * (1 / d2 - 1 / d1)) / r1;
  const L = (s * s * (2 * s - 1)) / (2 * (2 * s + 1));
  return 2 - L * tau * tau - (farBudget * (2 * s - 1) * (r1 + r2)) / (4 * r1);
}

const NEARFLOOR_OLD = nearFloorEvalBudget(97, 10, 8 * TX2_T10);
const NEARFLOOR_NEW = nearFloorEvalBudget(97, 10, 4 * OMEGA2_T10);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_BLOCK_RESOLVED_FAR_WEIGHTS = {
  ticket: 'imp-95008 (continuation eleven: block-resolved far weights)',
  source:
    'Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; executes the aggregation-step lever named by the tenth continuation: the parity roll-up re-run with the b-resolved Lemma X corner floors V(b, j) instead of their b = 0 uniform infimum',
  theoremY:
    'Under MAJ(sigma, theta): ||sum_b w_b||^2 <= 2 sum_b ||w_b||^2 + (4/(2 sigma - 1)) sum_b omega_b nTilde_b^2, with omega_b = Trow(b) + Tcol(b), Trow(b) = sum_{j even >= 2} (1 + V(b, j))^(-theta), Tcol(b) = sum over class-internal j <= b of (1 + V(b - j, j))^(-theta). Proof: the parity AM-GM (unchanged, pins near constant 2) plus per-pair Lemma T with the pair-sharp Lemma X floor V(b, j), AM-GM routing each pair toll once to its near-block row and once to its far-block col. Corollary P is the relaxation omega_b -> 2 Tx_even; Theorem Y is blockwise never worse.',
  lemmaZ:
    'V(b - j, j) >= (2^beta/(4Q)) 2^{b(1-beta)} uniformly in j >= 2 (the j-exponents cancel exactly), so Tcol(b) <= floor(b/2) (1 + (2^beta/(4Q)) 2^{b(1-beta)})^(-theta) and omega_b -> 0 geometrically: deep blocks are asymptotically free, versus the uniform 2 Tx_even charge of Corollary P.',
  lemmaM:
    'For beta <= 2 - log2(3) = 0.41504: V(2, 2m) >= Gx(2m + 1) for every m >= 1 (binding case m = 1 is 2^{2-beta} >= 3), hence Trow(2) sits termwise under the odd tail and omega_2 <= Tx(2) - the sharpened achieved point stays inside the bracket class T* <= Tx(2).',
  reference: {
    parameters: { v: VV, c: CC, beta: '1/3', D: DD, sigma: SIGMA },
    omega0Theta10: OMEGA0_T10,
    omega0Theta2: OMEGA0_T2,
    omega2Theta10: OMEGA2_T10,
    omega2Theta2: OMEGA2_T2,
    txEvenTheta10: TXEVEN_T10,
    txEvenTheta2: TXEVEN_T2,
    tx2Theta10: TX2_T10,
    tx2Theta2: TX2_T2,
    supLocation: { theta10: SUP_T10, theta2: SUP_T2, counterCase: SUP_COUNTER },
    farBudgetFactorTheta10: (8 * TXEVEN_T10) / (4 * OMEGA2_T10),
    farBudgetFactorTheta2: (8 * TXEVEN_T2) / (4 * OMEGA2_T2),
    bracketGapTheta10New: 4 / 0.025882322161015905,
    bracketGapTheta2Fixed97New: 4 / 0.20942830545943472,
    nearFloorOld: NEARFLOOR_OLD,
    nearFloorNew: NEARFLOOR_NEW,
  },
  openResiduals: [
    'the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family',
    'the curvature ceiling D retained by the window',
    'the paper phase curvature normalization (sibling Theorem D residual)',
    'residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|',
    'REFINED: the far bracket in the sharpened currency is [0.025882322161015905, 4] at theta = 10 (gap 154.55); the Schur roll-up side of the aggregation lever is consumed to its parity core - remaining achieved-side slack sits only in the outer parity AM-GM (the alternating sum ||W_minus||^2, not uniformly recoverable: its vanishing configurations are the near-constant-2 attainment) and the Lemma T constant; the witness side (multi-boundary chains) is the open floor lever',
  ],
  isRigorous: true,
  rigorScope:
    'Theorem Y is the sibling parity roll-up with the per-pair floor of Lemma X kept b-resolved instead of relaxed to its b = 0 infimum - every inequality in the chain is one already proved by the fifth and tenth continuations, applied pairwise-sharp; Lemma Z and Lemma M are elementary exponent algebra. The sup evaluations and the counter-case scan are per-parameter corollaries. The numerics cross-check the statements; they are not the claim.',
  promotesBound: false,
  verdict:
    'RIGOROUS aggregation step (the exact lever the tenth continuation pointed at): the achieved parity roll-up consumed the SHARP b-resolved pair floor V(b, j) = 2^{b(1-beta)} Gx(j) only through its b = 0 infimum, charging every block the worst-case toll 2 Tx_even in both ladder directions. NEW Theorem Y re-prices the far term with closed-form block weights omega_b: block 0 has no incoming pairs (omega_0 = Tx_even exactly), block 2 carries the single dominant V(0,2) toll (omega_2 = sup_b omega_b), and deep blocks are asymptotically FREE (Lemma Z, geometric decay). The achieved far coefficient drops 8/(2 sigma - 1) -> 4/(2 sigma - 1) inside the same bracket class (Lemma M: omega_2 <= Tx(2)), so the far bracket gap EXACTLY halves: [0.025882, 8] -> [0.025882, 4], gap 309.09 -> 154.55 at theta = 10 (19.0996 at the fixed-97 theta = 2 bracket); the Theorem F near-floor evaluation tightens 1.91607 -> 1.92825. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_BRFW_ASSERTIONS = [
  {
    id: 'imp95008-brfw-omega0-identity',
    description:
      'omega_0 = Trow(0) = Tx_even exactly, reproducing the tenth-continuation baked literals through an independent code path: 2.8779127054008455e-4 (theta = 10) and 0.22344833754411825 (theta = 2)',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(OMEGA0_T10, 0.00028779127054008455) &&
        rel(OMEGA0_T2, 0.22344833754411825) &&
        rel(OMEGA0_T10, TXEVEN_T10) &&
        rel(OMEGA0_T2, TXEVEN_T2) &&
        tCol(0, 10, QREF, BETA) === 0 &&
        tCol(1, 10, QREF, BETA) === 0
      );
    },
  },
  {
    id: 'imp95008-brfw-blockwise-never-worse',
    description:
      'omega_b <= 2 Tx_even for every block b <= 60 (both parities), at theta in {2, 10} at the reference and at the counter-case (2, 0.5, 0.5, 4): Theorem Y never loses to Corollary P',
    holds: () => {
      for (let b = 0; b <= 60; b++) {
        if (!(omegaWeight(b, 10, QREF, BETA) <= 2 * TXEVEN_T10 * (1 + 1e-12))) return false;
        if (!(omegaWeight(b, 2, QREF, BETA) <= 2 * TXEVEN_T2 * (1 + 1e-12))) return false;
      }
      const txEvenCounter = tailArithSharp(2, Q_COUNTER, 0.5, 600);
      for (let b = 0; b <= 120; b++) {
        if (!(omegaWeight(b, 2, Q_COUNTER, 0.5) <= 2 * txEvenCounter * (1 + 1e-12))) {
          return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp95008-brfw-sup-at-block-two',
    description:
      'the sup of omega_b over b <= 60 (both parity classes) sits at b = 2, at theta = 10 and theta = 2 at the reference AND at the off-reference counter-case; baked sup values 2.884062395107217e-4 and 0.25835827010368023',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        SUP_T10.supB === 2 &&
        SUP_T2.supB === 2 &&
        SUP_COUNTER.supB === 2 &&
        rel(SUP_T10.sup, 0.0002884062395107217) &&
        rel(SUP_T2.sup, 0.25835827010368023) &&
        rel(OMEGA2_T10, SUP_T10.sup) &&
        rel(OMEGA2_T2, SUP_T2.sup)
      );
    },
  },
  {
    id: 'imp95008-brfw-omega2-decomposition',
    description:
      'omega_2 = (1 + Gx(2))^(-theta) + Trow(2) with the baked split at theta = 10: 2.877844515988882e-4 + 6.217879118335217e-7',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      const first = phi(gSharp(2, QREF, BETA), 10);
      const row2 = tRow(2, 10, QREF, BETA, 400);
      return (
        rel(first, 0.0002877844515988882) &&
        rel(row2, 6.217879118335217e-7) &&
        rel(first + row2, OMEGA2_T10)
      );
    },
  },
  {
    id: 'imp95008-brfw-class-membership',
    description:
      'Lemma M: omega_2 <= Tx(2) at both theta (2.884062395107217e-4 <= 2.8874500929283736e-4 and 0.25835827010368023 <= 0.29686951411262313), the termwise inequality V(2, 2m) >= Gx(2m + 1) holds for m = 1..10, and the binding case is exactly 2^{2 - beta} >= 3 at beta = 1/3',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      if (!(OMEGA2_T10 <= TX2_T10 && OMEGA2_T2 <= TX2_T2)) return false;
      if (!rel(TX2_T10, 0.00028874500929283736)) return false;
      if (!rel(TX2_T2, 0.29686951411262313)) return false;
      for (let m = 1; m <= 10; m++) {
        if (!(cornerV(2, 2 * m, QREF, BETA) >= gSharp(2 * m + 1, QREF, BETA))) return false;
      }
      return Math.pow(2, 2 - BETA) >= 3 && 2 - Math.log2(3) > BETA;
    },
  },
  {
    id: 'imp95008-brfw-lemma-z-decay',
    description:
      'Lemma Z: the closed-form majorant Trow(b) + floor(b/2)(1 + (2^beta/(4Q)) 2^{b(1-beta)})^(-theta) dominates omega_b for b in 2..30 at both theta, and the weight profile decays monotonically past b = 2 with omega_10 < 1e-17 at theta = 10',
    holds: () => {
      for (let b = 2; b <= 30; b++) {
        if (!(omegaWeight(b, 10, QREF, BETA) <= omegaMajorantZ(b, 10, QREF, BETA) * (1 + 1e-12))) {
          return false;
        }
        if (!(omegaWeight(b, 2, QREF, BETA) <= omegaMajorantZ(b, 2, QREF, BETA) * (1 + 1e-12))) {
          return false;
        }
      }
      for (let b = 2; b <= 20; b += 2) {
        if (!(omegaWeight(b + 2, 10, QREF, BETA) < omegaWeight(b, 10, QREF, BETA))) return false;
        if (!(omegaWeight(b + 2, 2, QREF, BETA) < omegaWeight(b, 2, QREF, BETA))) return false;
      }
      return omegaWeight(10, 10, QREF, BETA) < 1e-17;
    },
  },
  {
    id: 'imp95008-brfw-far-budget-halving',
    description:
      'the achieved far budget improves from 8 Tx_even to 4 omega_2 by the baked factors 1.995735397599716 (theta = 10) and 1.7297556409125012 (theta = 2)',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel((8 * TXEVEN_T10) / (4 * OMEGA2_T10), 1.995735397599716) &&
        rel((8 * TXEVEN_T2) / (4 * OMEGA2_T2), 1.7297556409125012)
      );
    },
  },
  {
    id: 'imp95008-brfw-bracket-exact-halving',
    description:
      'the far bracket gaps are exactly half the tenth-continuation baked gaps: 154.5456383363013 = 309.0912766726026 / 2 (theta = 10, floor 0.025882322161015905) and 19.099614979097375 = 38.19922995819475 / 2 (fixed-97 theta = 2, floor 0.20942830545943472)',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(4 / 0.025882322161015905, 154.5456383363013) &&
        rel(4 / 0.20942830545943472, 19.099614979097375) &&
        rel(309.0912766726026 / 2, 154.5456383363013) &&
        rel(38.19922995819475 / 2, 19.099614979097375)
      );
    },
  },
  {
    id: 'imp95008-brfw-witness-consistency',
    description:
      'the Theorem Y weighted far budget majorizes the exact excess E on all three ninth-continuation baked witnesses (baked E literals reproduced to 1e-9 relative): no exhibited floor contradicts the halved achieved bound',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(WB_97_T10.E, 0.004293997501724381) &&
        rel(WB_97_T2.E, 0.33233346278869524) &&
        rel(WB_BIG_T10.E, 0.00017924863904817689) &&
        WB_97_T10.E <= WB_97_T10.budget &&
        WB_97_T2.E <= WB_97_T2.budget &&
        WB_BIG_T10.E <= WB_BIG_T10.budget
      );
    },
  },
  {
    id: 'imp95008-brfw-near-floor-tightening',
    description:
      'the Theorem F near-floor evaluation with the halved far budget reproduces the tenth-continuation value 1.9160683251753918 at budget 8 Tx(2) and moves to 1.9282517125255316 at budget 4 omega_2 - strictly between the old value and the exact near constant 2',
    holds: () =>
      Math.abs(NEARFLOOR_OLD - 1.9160683251753918) <= 1e-9 &&
      Math.abs(NEARFLOOR_NEW - 1.9282517125255316) <= 1e-9 &&
      NEARFLOOR_NEW > NEARFLOOR_OLD &&
      NEARFLOOR_NEW < 2,
  },
  {
    id: 'imp95008-brfw-honesty-gate',
    description:
      'the verdict records the halved coefficient, the class membership, the untouched near constant 2, the still-open bracket and residuals, promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95008_BLOCK_RESOLVED_FAR_WEIGHTS.promotesBound === false &&
      IMP95008_BLOCK_RESOLVED_FAR_WEIGHTS.openResiduals.length === 5 &&
      /NO QED/.test(IMP95008_BLOCK_RESOLVED_FAR_WEIGHTS.verdict) &&
      /refereed bound is changed/i.test(IMP95008_BLOCK_RESOLVED_FAR_WEIGHTS.verdict) &&
      /EXACTLY halves/.test(IMP95008_BLOCK_RESOLVED_FAR_WEIGHTS.verdict) &&
      /asymptotically FREE/.test(IMP95008_BLOCK_RESOLVED_FAR_WEIGHTS.verdict) &&
      /154.55/.test(IMP95008_BLOCK_RESOLVED_FAR_WEIGHTS.openResiduals[4]) &&
      /cross-check the statements; they are not the claim/.test(
        IMP95008_BLOCK_RESOLVED_FAR_WEIGHTS.rigorScope,
      ),
  },
];

for (const a of IMP95008_BRFW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-block-resolved-far-weights assertion failed: ${a.id}`);
  }
}

export default IMP95008_BLOCK_RESOLVED_FAR_WEIGHTS;
