/**
 * imp-95008 continuation (fifth) - the almost-orthogonality SCHUR VARIANT
 * with explicit tail decay: the compact-SUPPORT hypothesis of the recorded
 * cross-block isolation theorem (Theorem N of
 * imp-95008-block-isolation-constant.js) is REMOVED and replaced by a
 * polynomial-tail majorant, at the price of one explicit, closed-form tail
 * constant. This discharges the named residual (5) of that module (the
 * skeptical self-check record there states: if packets are merely
 * MAJORIZED by bumps with tails, disjointness fails and Theorem N needs an
 * almost-orthogonality Schur variant with explicit tail decay - NOT
 * provided) AT THE MODEL-FAMILY LEVEL. The remaining residuals of the
 * sibling chain are unchanged and restated below.
 *
 * SETTING (Permuting the Zeta Twin Ladder Section 4.5; page
 * /permutation-architecture; siblings imp-95008-weld-alias-l2-collapse.js,
 * imp-95008-alias-separation-curvature-floor.js,
 * imp-95008-block-isolation-constant.js). Same model family, one branch
 * sign: packets a_d in L2(R) indexed by the shifted alias denominators
 * d = k - h/p (Lemma A(ii): globally (1/p)-separated, 1/p <= d <= D),
 * centered at u_d = v/d with width scale r_d = c d^(-beta), 0 < beta < 1,
 * v, c > 0. Dyadic curvature block b holds d in (2^(-(b+1)) D, 2^(-b) D],
 * b = 0..B-1, B = ceil(log2(p D)); w_b = sum of block-b packets.
 *
 * HYPOTHESIS MAJ(sigma, theta) - replaces SUPPORT. There are sigma > 1/2,
 * theta > 0 and amplitudes A_d >= 0 with
 *   |a_d(u)| <= A_d (1 + |u - u_d| / r_d)^(-(sigma + theta))   for all u.
 * Currency: n_d = A_d sqrt(r_d) (envelope norm scale),
 * nTilde_b = sum_{d in b} n_d (block envelope l1 mass),
 * mTilde_b = sum_{d in b} n_d^2 (block envelope l2 mass).
 *
 * LEMMA T (two-envelope correlation - UNCONDITIONAL, closed form). For
 * centers u_1, u_2 with Delta = |u_1 - u_2|, widths r_1, r_2 > 0,
 * rMax = max(r_1, r_2), and e_i(u) = (1 + |u - u_i| / r_i)^(-(sigma+theta)):
 *   integral e_1 e_2 du <= (2 / (2 sigma - 1)) sqrt(r_1 r_2)
 *                          (1 + Delta / rMax)^(-theta).
 * Proof. Write x_i = |u - u_i| / r_i. By the triangle inequality
 * x_1 + x_2 >= (|u - u_1| + |u - u_2|) / rMax >= Delta / rMax, so
 * (1 + x_1)(1 + x_2) >= 1 + x_1 + x_2 >= 1 + Delta / rMax. Split exponents:
 *   e_1 e_2 = [(1+x_1)(1+x_2)]^(-theta) [(1+x_1)(1+x_2)]^(-sigma)
 *          <= (1 + Delta / rMax)^(-theta) (1+x_1)^(-sigma) (1+x_2)^(-sigma),
 * and Cauchy-Schwarz with the exact integral
 * integral (1 + |u - u_i| / r_i)^(-2 sigma) du = 2 r_i / (2 sigma - 1)
 * (needs sigma > 1/2) gives the bound. QED (of the lemma only).
 *
 * LEMMA G (annulus gap ratio - UNCONDITIONAL geometry, same Q as Theorem N).
 * Let Q = (c D^(1-beta) / v) 2^(-(1-beta)) and, for j >= 2,
 *   G(j) = (2^(j-1) - 1) 2^(-j beta) / Q .
 * For d in block b and d2 in block b + j (j >= 2, same branch sign):
 *   Delta / rMax > G(j),
 * where Delta = |u_d - u_{d2}| and rMax = max(r_d, r_{d2}). Proof: centers
 * lie in disjoint dyadic annuli, u_d < v 2^(b+1)/D and u_{d2} >= v 2^(b+j)/D,
 * so Delta > (v/D) 2^(b+1) (2^(j-1) - 1); widths obey
 * rMax < c 2^((b+j+1) beta) D^(-beta) (the far block has the wider packets);
 * the quotient is minimized at b = 0 (the factor 2^((b+1)(1-beta)) is
 * increasing in b), where it equals G(j). Two exact compatibility facts with
 * Theorem N: (i) G is increasing with ratio G(j+1)/G(j) >= 2^(1-beta) > 1
 * (since 2^j - 1 >= 2(2^(j-1) - 1)); (ii) the Theorem N disjointness
 * threshold 2^(j-1) - 1 > Q (1 + 2^(j beta)) is EXACTLY the statement
 * G(j) > 1 + 2^(-j beta), so G(j0) > 1 automatically.
 *
 * THEOREM S (tail-robust cross-block aggregation - CONDITIONAL only on
 * MAJ(sigma, theta); NO support hypothesis). Fix any split gap J >= 2. Then
 *   || sum_b w_b ||^2  <=  (2J - 1) sum_b ||w_b||^2
 *                        + (4 / (2 sigma - 1)) T(J) sum_b nTilde_b^2 ,
 * with the tail sum T(J) = sum_{j >= J} (1 + G(j))^(-theta) bounded in
 * CLOSED FORM by the geometric ratio of Lemma G(i):
 *   T(J) <= G(J)^(-theta) / (1 - 2^(-theta (1 - beta))) .
 * Proof. ||sum w_b||^2 <= sum_{b,b2} |<w_b, w_{b2}>|. NEAR band
 * |b - b2| <= J - 1: |<w_b, w_{b2}>| <= ||w_b|| ||w_{b2}|| (Cauchy-Schwarz)
 * and AM-GM turn the at-most-(2J-1)-wide band into (2J-1) sum ||w_b||^2.
 * FAR band |b - b2| = j >= J: expand into packet pairs; for each pair,
 * |<a_d, a_{d2}>| <= A_d A_{d2} integral e_d e_{d2}, Lemma T plus Lemma G
 * give <= (2/(2 sigma - 1)) n_d n_{d2} (1 + G(j))^(-theta); summing the
 * block masses and AM-GM (nTilde_b nTilde_{b+j} <= (nTilde_b^2 +
 * nTilde_{b+j}^2)/2) gives the far term. For the closed form:
 * (1 + G(j))^(-theta) < G(j)^(-theta) <= G(J)^(-theta)
 * 2^(-theta (1-beta) (j-J)), and the geometric series sums. QED (of the
 * aggregation step only).
 *
 * LEMMA W (within-block tail-Schur row sum - the tail analogue of K_b).
 * Under MAJ(sigma, theta), for each block b,
 *   ||w_b||^2 <= (2 / (2 sigma - 1)) RTilde_b mTilde_b ,
 *   RTilde_b = max_{d in b} sum_{d2 in b} (1 + Delta_{d d2} / rMax_{d d2})^(-theta),
 * by expanding, applying Lemma T pairwise, and AM-GM into the symmetric row
 * sum. RTilde_b >= 1 (diagonal) and is finite (blocks are finite); it
 * replaces the pointwise overlap multiplicity K_b of the recorded collapse,
 * whose meaning requires supports.
 *
 * COROLLARY S1 (reference numbers, cross-checked below). At the reference
 * family p = 97, v = c = 1, beta = 1/3, D = 1 (Q = 2^(-2/3), j0 = 3, B = 7)
 * with (sigma, theta) = (1, 2) (envelope exponent 3): G(3) = (3/2) 2^(2/3)
 * ~ 2.3811 > 1, closed-form tail T(3) <= 0.29243 (direct partial sum
 * ~ 0.1437), so at J = j0 = 3
 *   || sum_b w_b ||^2 <= 5 sum_b ||w_b||^2 + 1.1698 sum_b nTilde_b^2 .
 * p-FREENESS is inherited: Q, j0, G, T do not involve the telescope prime p
 * (p enters only the within-block data RTilde_b mTilde_b, exactly as it
 * entered only K_b in Theorem N).
 *
 * WHAT THIS BUYS AND WHAT IT COSTS (honest accounting):
 *  - BUYS: Theorem N (and hence the min(j0, B) isolation constant route)
 *    needed packets to be EXACTLY supported in |u - u_d| <= c d^(-beta);
 *    genuine Fresnel-Airy packets are not compactly supported - they decay.
 *    Theorem S needs only the decay envelope, so the aggregation chain of
 *    the sibling module now survives the passage from model supports to
 *    tail majorants, with every constant explicit.
 *  - COSTS: (i) the near-band constant is 2J - 1, versus Theorem N getting
 *    J = j0 exactly under supports (the mod-j0 color-class Pythagoras needs
 *    genuine orthogonality; with tails the crude banded Schur row is used) -
 *    a factor < 2 loss; (ii) the far term is in the l1 block-mass currency
 *    nTilde_b^2 <= (block cardinality) x mTilde_b, not in K_b m_b - it is
 *    crushed by the (1 + G)^(-theta) factor for concentrated packets
 *    (theta large) but is NOT claimed small in general; (iii) as
 *    theta -> infinity the far term -> 0 and Theorem S recovers Theorem N
 *    up to the factor-2 near-band loss - the support limit is consistent.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) attempted refutation of Lemma T at
 * Delta = 0, r_1 = r_2 = r: exact value 2r/(2 sigma + 2 theta - 1) vs bound
 * 2r/(2 sigma - 1) - holds strictly, no equality case hides a gap; (2) the
 * exponent split needs both factors of [(1+x_1)(1+x_2)] >= 1, true
 * pointwise; (3) Lemma G uses the OPEN block endpoints one-sidedly (center
 * sup, width sup) so the inequality is strict; the b = 0 worst case was
 * re-verified (exponent increasing in b); (4) the far band needs j >= 2 for
 * G(j) > 0, guaranteed by J >= 2 and j0 >= 2 by construction; (5) the
 * closed-form tail uses G(j) >= G(J) 2^((1-beta)(j-J)) iterated from the
 * ratio bound - no monotonicity beyond Lemma G(i) is assumed; (6) grid
 * cross-checks below are Riemann sums of nonnegative integrands on a
 * truncated window, which UNDERestimate the true integrals they stand in
 * for, so asserting numeric <= analytic-bound is the safe direction;
 * (7) branch signs: the statement is per branch sign, combining the two
 * costs at most a factor 2, exactly as recorded by the siblings - not
 * reproved here; (8) NON-VACUITY of the improvement is asserted: in the
 * tailed realization below, far-block envelope products are strictly
 * positive (support disjointness genuinely FAILS, Theorem N is genuinely
 * inapplicable) while the Theorem S bound holds.
 *
 * WHAT REMAINS OPEN (unchanged residuals of the sibling chain): the
 * packet-envelope constants (c, beta, and now sigma, theta, A_d) for the
 * PAPER packets rather than the model family; the curvature ceiling D
 * retained by the window; the paper phase curvature normalization (sibling
 * Theorem D residual); residual (c), the passage from the l2 weld bound to
 * the pointwise scalar |C_E,17|. NEW honest residual: sharpening the
 * near-band constant 2J - 1 back to J under a tail hypothesis (a
 * Cotlar-Stein style argument would need operator, not vector, structure).
 *
 * The numerics below CROSS-CHECK the closed-form statements (a direct
 * quadrature sweep of Lemma T, an exhaustive pairwise sweep of Lemma G on
 * the built alias families, the geometric tail bound, and a discretized
 * tailed realization of the full Theorem S chain); they are not the claim.
 * Import-light (no heavy bundle). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── closed-form pieces ───────────────────────────────────────────────────────
function isolationConstant(c, v, beta, D) {
  const Q = ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
  let j = 2;
  while (!(Math.pow(2, j - 1) - 1 > Q * (1 + Math.pow(2, j * beta)))) j++;
  return { Q, j0: j };
}

function gapRatioFloor(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

function tailClosedForm(J, Q, beta, theta) {
  return (
    Math.pow(gapRatioFloor(J, Q, beta), -theta) /
    (1 - Math.pow(2, -theta * (1 - beta)))
  );
}

function tailDirect(J, Q, beta, theta, jMax) {
  let s = 0;
  for (let j = J; j <= jMax; j++) s += Math.pow(1 + gapRatioFloor(j, Q, beta), -theta);
  return s;
}

// ── the model packet family (one branch sign; same as the sibling module) ───
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

// ── Lemma T quadrature sweep ─────────────────────────────────────────────────
function lemmaTCheck(r1, r2, delta, sigma, theta) {
  const s = sigma + theta;
  const rMax = Math.max(r1, r2);
  const rMin = Math.min(r1, r2);
  const span = 80 * rMax + delta;
  const step = rMin / 200;
  let I = 0;
  for (let u = -span; u <= span; u += step) {
    I +=
      Math.pow(1 + Math.abs(u) / r1, -s) *
      Math.pow(1 + Math.abs(u - delta) / r2, -s);
  }
  I *= step;
  const bound =
    (2 / (2 * sigma - 1)) * Math.sqrt(r1 * r2) * Math.pow(1 + delta / rMax, -theta);
  return { I, bound, ok: I <= bound };
}

const LEMMA_T_SWEEP = [];
for (const sigma of [0.6, 1, 2]) {
  for (const theta of [0.5, 2]) {
    for (const [r1, r2, delta] of [
      [1, 1, 0],
      [1, 1, 5],
      [0.25, 4, 10],
      [4, 0.25, 40],
      [1, 0.05, 3],
    ]) {
      LEMMA_T_SWEEP.push({ sigma, theta, r1, r2, delta, ...lemmaTCheck(r1, r2, delta, sigma, theta) });
    }
  }
}

// ── Lemma G exhaustive pairwise sweep on the built families ─────────────────
function gapRatioSweep(p, v, c, beta, D) {
  const packets = buildFamily(p, v, c, beta, D);
  const { Q, j0 } = isolationConstant(c, v, beta, D);
  const B = Math.max(...packets.map((q) => q.b)) + 1;
  let checkedPairs = 0;
  let violations = 0;
  let minSlack = Infinity;
  for (let i = 0; i < packets.length; i++) {
    for (let j = i + 1; j < packets.length; j++) {
      const a = packets[i];
      const q = packets[j];
      const gap = Math.abs(a.b - q.b);
      if (gap < 2) continue;
      const ratio = Math.abs(a.u - q.u) / Math.max(a.r, q.r);
      const floor = gapRatioFloor(gap, Q, beta);
      const slack = ratio / floor;
      checkedPairs++;
      if (slack < minSlack) minSlack = slack;
      if (!(ratio > floor * (1 - 1e-9))) violations++;
    }
  }
  return { Q, j0, B, checkedPairs, violations, minSlack };
}

const GAP_REFERENCE = gapRatioSweep(97, 1, 1, 1 / 3, 1);
const GAP_P997 = gapRatioSweep(997, 1, 1, 1 / 3, 1);
const GAP_COUNTER = gapRatioSweep(13, 0.5, 2, 0.5, 4);

// G monotone ratio check: G(j+1) >= 2^(1-beta) G(j)
function gRatioHolds(Q, beta, jMax) {
  for (let j = 2; j < jMax; j++) {
    const ratio = gapRatioFloor(j + 1, Q, beta) / gapRatioFloor(j, Q, beta);
    if (!(ratio >= Math.pow(2, 1 - beta) - 1e-12)) return false;
  }
  return true;
}

// ── discretized TAILED realization of the Theorem S chain ───────────────────
// Envelope-shaped signed packets: a_d(u) = x_d (1 + |u - u_d|/r_d)^(-(sigma+theta))
// with deterministic pseudo-random x_d. Supports are ALL of R (truncated to the
// grid window): Theorem N support disjointness FAILS everywhere; Theorem S must
// still hold. All norms live in the same grid inner-product space; the analytic
// far/tail constants majorize the corresponding grid sums (truncated Riemann
// sums of nonnegative integrands).
function theoremSRealization(p, v, c, beta, D, sigma, theta) {
  const packets = buildFamily(p, v, c, beta, D);
  const { Q, j0 } = isolationConstant(c, v, beta, D);
  const B = Math.max(...packets.map((q) => q.b)) + 1;
  const s = sigma + theta;
  const rMax = Math.max(...packets.map((q) => q.r));
  const uMax = Math.max(...packets.map((q) => q.u)) + 30 * rMax;
  const uMin = -30 * rMax;
  const step = 0.02;
  const L = Math.ceil((uMax - uMin) / step) + 1;
  let seed = 987654321;
  const rnd = () => {
    seed = (Math.imul(1103515245, seed) + 12345) >>> 0;
    return seed / 4294967296 - 0.5;
  };
  const wB = Array.from({ length: B }, () => new Float64Array(L));
  const nTilde = new Array(B).fill(0);
  const mTilde = new Array(B).fill(0);
  for (const q of packets) {
    const x = rnd();
    q.A = Math.abs(x);
    nTilde[q.b] += q.A * Math.sqrt(q.r);
    mTilde[q.b] += q.A * q.A * q.r;
    const w = wB[q.b];
    for (let i = 0; i < L; i++) {
      const u = uMin + i * step;
      w[i] += x * Math.pow(1 + Math.abs(u - q.u) / q.r, -s);
    }
  }
  const total = new Float64Array(L);
  for (const w of wB) for (let i = 0; i < L; i++) total[i] += w[i];
  const sq = (arr) => {
    let t = 0;
    for (const x of arr) t += x * x;
    return t * step;
  };
  const lhs = sq(total);
  const blockNormSq = wB.map(sq);
  const sumBlockNormSq = blockNormSq.reduce((a, x) => a + x, 0);
  const sumNTildeSq = nTilde.reduce((a, x) => a + x * x, 0);
  const T = tailClosedForm(j0, Q, beta, theta);
  const rhs =
    (2 * j0 - 1) * sumBlockNormSq + (4 / (2 * sigma - 1)) * T * sumNTildeSq;
  // Lemma W per block: ||w_b||^2 <= (2/(2 sigma - 1)) RTilde_b mTilde_b
  let lemmaWViolations = 0;
  const rTilde = new Array(B).fill(0);
  for (let b = 0; b < B; b++) {
    const inB = packets.filter((q) => q.b === b);
    let rowMax = 0;
    for (const q of inB) {
      let row = 0;
      for (const q2 of inB) {
        row += Math.pow(
          1 + Math.abs(q.u - q2.u) / Math.max(q.r, q2.r),
          -theta,
        );
      }
      if (row > rowMax) rowMax = row;
    }
    rTilde[b] = rowMax;
    if (!(blockNormSq[b] <= (2 / (2 * sigma - 1)) * rowMax * mTilde[b] + 1e-12)) {
      lemmaWViolations++;
    }
  }
  // non-vacuity: an extreme far pair (block 0 vs block B-1, gap >= j0) has
  // strictly positive envelope-product mass on the grid - supports overlap.
  const first = packets.find((q) => q.b === 0);
  const last = packets.find((q) => q.b === B - 1);
  let farOverlapMass = 0;
  for (let i = 0; i < L; i++) {
    const u = uMin + i * step;
    farOverlapMass +=
      Math.pow(1 + Math.abs(u - first.u) / first.r, -s) *
      Math.pow(1 + Math.abs(u - last.u) / last.r, -s);
  }
  farOverlapMass *= step;
  return {
    Q,
    j0,
    B,
    packetCount: packets.length,
    lhs,
    sumBlockNormSq,
    sumNTildeSq,
    tailClosedForm: T,
    rhs,
    rTilde,
    lemmaWViolations,
    farGap: last.b - first.b,
    farOverlapMass,
  };
}

const REALIZATION = theoremSRealization(97, 1, 1, 1 / 3, 1, 1, 2);

// reference closed-form numbers for Corollary S1
const REF = isolationConstant(1, 1, 1 / 3, 1);
const REF_G_J0 = gapRatioFloor(REF.j0, REF.Q, 1 / 3);
const REF_T_CLOSED = tailClosedForm(REF.j0, REF.Q, 1 / 3, 2);
const REF_T_DIRECT = tailDirect(REF.j0, REF.Q, 1 / 3, 2, 400);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_TAIL_SCHUR_ALMOST_ORTHOGONALITY = {
  ticket: 'imp-95008 (continuation five: tail-robust almost-orthogonality Schur variant)',
  source:
    'Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; discharges named residual (5) of imp-95008-block-isolation-constant (SUPPORT vs majorization) at the model-family level; siblings imp-95008-weld-alias-l2-collapse, imp-95008-alias-separation-curvature-floor',
  lemmaT:
    'UNCONDITIONAL closed form: for envelopes (1 + |u - u_i|/r_i)^(-(sigma+theta)) with sigma > 1/2, theta > 0, the correlation integral is at most (2/(2 sigma - 1)) sqrt(r_1 r_2) (1 + Delta/rMax)^(-theta), by the pointwise product bound (1+x_1)(1+x_2) >= 1 + Delta/rMax, an exponent split, and Cauchy-Schwarz.',
  lemmaG:
    'UNCONDITIONAL geometry: cross-block pairs at gap j >= 2 satisfy Delta/rMax > G(j) = (2^(j-1) - 1) 2^(-j beta)/Q with the SAME Q as Theorem N; G has geometric growth ratio >= 2^(1-beta); the Theorem N threshold at j0 is exactly G(j0) > 1 + 2^(-j0 beta) > 1.',
  theoremS:
    'CONDITIONAL only on the tail majorant MAJ(sigma, theta) - NO support hypothesis: for any split gap J >= 2, ||sum_b w_b||^2 <= (2J - 1) sum_b ||w_b||^2 + (4/(2 sigma - 1)) T(J) sum_b nTilde_b^2, with T(J) <= G(J)^(-theta)/(1 - 2^(-theta(1-beta))) in closed form. Lemma W supplies the within-block tail analogue ||w_b||^2 <= (2/(2 sigma - 1)) RTilde_b mTilde_b of the K_b collapse. All constants are p-free except the within-block data, exactly as in Theorem N.',
  corollaryS1: {
    parameters: { p: 97, v: 1, c: 1, beta: '1/3', D: 1, sigma: 1, theta: 2 },
    Q: REF.Q,
    j0: REF.j0, // 3
    G_at_j0: REF_G_J0, // ~2.3811 > 1
    tailClosedForm: REF_T_CLOSED, // ~0.29243
    tailDirect: REF_T_DIRECT, // ~0.1437 (closed form is a genuine majorant)
    nearConstant: 2 * REF.j0 - 1, // 5, vs j0 = 3 under exact supports (factor < 2 loss)
    farCoefficient: (4 / (2 * 1 - 1)) * REF_T_CLOSED, // ~1.1697
  },
  realization: REALIZATION,
  honestCosts: [
    'near-band constant is 2J - 1, vs Theorem N achieving J = j0 under exact supports: a factor < 2 loss (the color-class Pythagoras needs genuine orthogonality)',
    'the far term is in the l1 block-mass currency nTilde_b^2 (at most block-cardinality times mTilde_b), not in K_b m_b; it is small only when theta is moderate-to-large',
    'theta -> infinity recovers the support regime up to the factor-2 near-band loss (consistency limit, not an identity)',
  ],
  openResiduals: [
    'the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family',
    'the curvature ceiling D retained by the window',
    'the paper phase curvature normalization (sibling Theorem D residual)',
    'residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|',
    'NEW: sharpening the near-band constant 2J - 1 back to J under a tail hypothesis',
  ],
  isRigorous: true,
  rigorScope:
    'Lemmas T and G are unconditional and closed-form; Theorem S and Lemma W are conditional only on the tail-majorant hypothesis MAJ(sigma, theta), which is strictly weaker than the SUPPORT hypothesis Theorem N required. The numerics cross-check the statements; they are not the claim.',
  promotesBound: false,
  verdict:
    'RIGOROUS aggregation step: the compact-SUPPORT hypothesis of the recorded cross-block isolation theorem is removed - polynomial-tail majorized packets obey ||sum_b w_b||^2 <= (2J-1) sum_b ||w_b||^2 + (4/(2 sigma - 1)) T(J) sum_b nTilde_b^2 with the closed-form, p-free tail constant T(J) <= G(J)^(-theta)/(1 - 2^(-theta(1-beta))), G(J) the same annulus gap ratio that defines j0. This discharges the named almost-orthogonality residual of the sibling module at the model-family level, at the explicit cost of a factor < 2 in the near band and an l1-mass far term. The paper-packet envelope constants, window ceiling, phase normalization, and the l2-to-pointwise step remain open. Changes no bound; NO QED; no refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_TAIL_SCHUR_ASSERTIONS = [
  {
    id: 'imp95008-ts-lemma-t-quadrature',
    description:
      'Lemma T closed form majorizes the direct quadrature of the envelope correlation integral across 30 (sigma, theta, r1, r2, Delta) combinations, including the equal-center and extreme-width cases',
    holds: () => LEMMA_T_SWEEP.length === 30 && LEMMA_T_SWEEP.every((t) => t.ok),
  },
  {
    id: 'imp95008-ts-lemma-g-exhaustive',
    description:
      'exhaustive pairwise sweep on three alias families (reference p=97, p=997, and the large-Q counter-case): every cross-block pair at gap >= 2 has Delta/rMax above the closed-form floor G(gap)',
    holds: () =>
      GAP_REFERENCE.violations === 0 &&
      GAP_P997.violations === 0 &&
      GAP_COUNTER.violations === 0 &&
      GAP_REFERENCE.checkedPairs > 1000 &&
      GAP_REFERENCE.minSlack >= 1,
  },
  {
    id: 'imp95008-ts-g-geometric-ratio',
    description:
      'the gap-ratio floor G obeys the geometric growth G(j+1) >= 2^(1-beta) G(j) used by the closed-form tail sum, for beta in {1/3, 1/2} on the swept families',
    holds: () =>
      gRatioHolds(GAP_REFERENCE.Q, 1 / 3, 60) && gRatioHolds(GAP_COUNTER.Q, 1 / 2, 60),
  },
  {
    id: 'imp95008-ts-g-exceeds-one-at-j0',
    description:
      'compatibility with Theorem N: G(j0) > 1 on all three swept families (the disjointness threshold is exactly G(j0) > 1 + 2^(-j0 beta))',
    holds: () =>
      gapRatioFloor(GAP_REFERENCE.j0, GAP_REFERENCE.Q, 1 / 3) > 1 &&
      gapRatioFloor(GAP_P997.j0, GAP_P997.Q, 1 / 3) > 1 &&
      gapRatioFloor(GAP_COUNTER.j0, GAP_COUNTER.Q, 1 / 2) > 1,
  },
  {
    id: 'imp95008-ts-tail-closed-form-majorizes-direct',
    description:
      'the closed-form geometric tail bound majorizes the direct partial sum of (1 + G(j))^(-theta) at J = j0, and the reference numbers match Corollary S1',
    holds: () =>
      REF_T_DIRECT <= REF_T_CLOSED &&
      Math.abs(REF_G_J0 - 1.5 * Math.pow(2, 2 / 3)) < 1e-12 &&
      Math.abs(REF_T_CLOSED - Math.pow(REF_G_J0, -2) / (1 - Math.pow(2, -4 / 3))) < 1e-12 &&
      REF.j0 === 3,
  },
  {
    id: 'imp95008-ts-theorem-s-realization',
    description:
      'discretized tailed realization (96 packets, envelope exponent 3, supports = all of R): the Theorem S bound holds, ||sum||^2 <= 5 sum ||w_b||^2 + 4 T sum nTilde_b^2',
    holds: () =>
      REALIZATION.packetCount === 96 &&
      REALIZATION.B === 7 &&
      REALIZATION.j0 === 3 &&
      REALIZATION.lhs > 0 &&
      REALIZATION.lhs <= REALIZATION.rhs,
  },
  {
    id: 'imp95008-ts-lemma-w-blockwise',
    description:
      'Lemma W holds blockwise on the realization: ||w_b||^2 <= (2/(2 sigma - 1)) RTilde_b mTilde_b for every block, with RTilde_b >= 1',
    holds: () =>
      REALIZATION.lemmaWViolations === 0 && REALIZATION.rTilde.every((r) => r >= 1),
  },
  {
    id: 'imp95008-ts-non-vacuity',
    description:
      'the improvement is not vacuous: a far pair at block gap >= j0 has strictly positive envelope-product mass (support disjointness FAILS, so Theorem N is inapplicable to tailed packets while Theorem S still holds)',
    holds: () =>
      REALIZATION.farGap >= REALIZATION.j0 && REALIZATION.farOverlapMass > 0,
  },
  {
    id: 'imp95008-ts-honesty-gate',
    description:
      'the verdict names the tail hypothesis, records the factor-2 near-band cost and the l1-currency cost, keeps the open residuals, promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95008_TAIL_SCHUR_ALMOST_ORTHOGONALITY.promotesBound === false &&
      IMP95008_TAIL_SCHUR_ALMOST_ORTHOGONALITY.openResiduals.length === 5 &&
      IMP95008_TAIL_SCHUR_ALMOST_ORTHOGONALITY.honestCosts.length === 3 &&
      /NO QED/.test(IMP95008_TAIL_SCHUR_ALMOST_ORTHOGONALITY.verdict) &&
      /refereed bound is changed/i.test(IMP95008_TAIL_SCHUR_ALMOST_ORTHOGONALITY.verdict) &&
      /factor < 2/.test(IMP95008_TAIL_SCHUR_ALMOST_ORTHOGONALITY.verdict) &&
      /MAJ/.test(IMP95008_TAIL_SCHUR_ALMOST_ORTHOGONALITY.theoremS),
  },
];

for (const a of IMP95008_TAIL_SCHUR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-tail-schur-almost-orthogonality assertion failed: ${a.id}`);
  }
}

export default IMP95008_TAIL_SCHUR_ALMOST_ORTHOGONALITY;
