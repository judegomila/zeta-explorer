/**
 * imp-95008 continuation (sixth) - COLOR-CLASS SHARPENING of the near-band
 * constant: the NEW residual named by the fifth continuation
 * (imp-95008-tail-schur-almost-orthogonality.js) - "sharpening the near-band
 * constant 2J - 1 back to J under a tail hypothesis (a Cotlar-Stein style
 * argument would need operator, not vector, structure)" - is DISCHARGED at
 * the same model-family level, and its stated obstruction is REFUTED: no
 * operator structure and no genuine orthogonality are needed. The mod-J
 * color-class decomposition survives tails because the within-class cross
 * terms are not discarded (which would need orthogonality) but PAID, via the
 * already-recorded Lemmas T and G: within one color class all distinct block
 * gaps are multiples of J >= 2, so every within-class pair is a FAR pair in
 * the sense of Lemma G, with an even faster geometric tail (ratio
 * 2^(theta (1-beta) J) per class step instead of 2^(theta (1-beta))).
 *
 * SETTING (identical to the fifth continuation; Permuting the Zeta Twin
 * Ladder Section 4.5; page /permutation-architecture). One branch sign;
 * packets a_d indexed by the shifted alias denominators d = k - h/p
 * (1/p <= d <= D, globally (1/p)-separated), centered at u_d = v/d, width
 * r_d = c d^(-beta), 0 < beta < 1. Dyadic curvature block b holds
 * d in (2^(-(b+1)) D, 2^(-b) D]; w_b = sum of block-b packets. Hypothesis
 * MAJ(sigma, theta), sigma > 1/2, theta > 0:
 * |a_d(u)| <= A_d (1 + |u - u_d|/r_d)^(-(sigma+theta)); currencies
 * n_d = A_d sqrt(r_d), nTilde_b = sum_{d in b} n_d. Inherited unconditional
 * pieces: Lemma T (two-envelope correlation
 * <= (2/(2 sigma - 1)) sqrt(r_1 r_2) (1 + Delta/rMax)^(-theta)) and Lemma G
 * (cross-block pairs at gap j >= 2 have Delta/rMax > G(j) =
 * (2^(j-1) - 1) 2^(-j beta)/Q, Q = (c D^(1-beta)/v) 2^(-(1-beta)), with
 * geometric growth G(j+1) >= 2^(1-beta) G(j)).
 *
 * THEOREM S-PRIME (color-class tail aggregation - CONDITIONAL only on
 * MAJ(sigma, theta); NO support hypothesis; J >= 2 any split gap):
 *   || sum_b w_b ||^2 <= J [ sum_b ||w_b||^2
 *                            + (4/(2 sigma - 1)) T_J^arith sum_b nTilde_b^2 ],
 * where T_J^arith = sum_{m >= 1} (1 + G(mJ))^(-theta) obeys the closed form
 *   T_J^arith <= G(J)^(-theta) / (1 - 2^(-theta (1-beta) J)).
 *
 * Proof. STEP 1 (class split). Write sum_b w_b = sum_{c=0..J-1} W_c with
 * W_c = sum_{b = c mod J} w_b; Cauchy-Schwarz over the J classes gives
 * ||sum_c W_c||^2 <= J sum_c ||W_c||^2 (equality iff all W_c equal - the
 * constant J is sharp at this step). STEP 2 (within-class pairs are far
 * pairs). ||W_c||^2 = sum_{b in c} ||w_b||^2 + sum_{b != b2 in c}
 * <w_b, w_b2>; distinct blocks in one class differ by mJ with m >= 1, and
 * mJ >= J >= 2, so Lemma G applies to EVERY within-class pair:
 * Delta/rMax > G(mJ) packet-pairwise, and Lemma T gives
 * |<w_b, w_{b+mJ}>| <= (2/(2 sigma - 1)) (1 + G(mJ))^(-theta)
 * nTilde_b nTilde_{b+mJ}. STEP 3 (roll-up). Ordered within-class cross pairs
 * are twice the unordered ones; AM-GM nTilde_b nTilde_{b+mJ} <=
 * (nTilde_b^2 + nTilde_{b+mJ}^2)/2 makes each block index b absorb, over all
 * m >= 1 and both directions, at most 2 (2/(2 sigma - 1))
 * sum_{m>=1} (1 + G(mJ))^(-theta) = (4/(2 sigma - 1)) T_J^arith copies of
 * nTilde_b^2. Hence sum_c ||W_c||^2 <= sum_b ||w_b||^2 +
 * (4/(2 sigma - 1)) T_J^arith sum_b nTilde_b^2; multiply by J. STEP 4
 * (closed form). Iterating the Lemma G ratio bound over the (m-1) J single
 * steps from J to mJ: G(mJ) >= G(J) 2^((1-beta)(m-1) J), so
 * (1 + G(mJ))^(-theta) < G(mJ)^(-theta) <= G(J)^(-theta)
 * 2^(-theta (1-beta)(m-1) J), and the geometric series sums. QED (of the
 * aggregation step only; the packet-envelope constants for the PAPER packets
 * remain open exactly as in the siblings).
 *
 * WHAT THIS BUYS (vs Theorem S of the fifth continuation, which gives
 * (2J-1) sum ||w_b||^2 + (4/(2 sigma - 1)) T(J) sum nTilde_b^2 with
 * T(J) = sum_{j >= J} (1 + G(j))^(-theta)):
 *  - NEAR constant J instead of 2J - 1 (strict for every J >= 2); at the
 *    reference split J = j0 = 3 this is 3 vs 5.
 *  - SUPPORT-LIMIT CONSISTENCY IS NOW EXACT: as theta -> infinity both far
 *    terms vanish and S-prime recovers the Theorem N constant j0 EXACTLY,
 *    where Theorem S retained the spurious factor (2 j0 - 1)/j0 < 2. The
 *    fifth continuation claim that the color-class route "needs genuine
 *    orthogonality" is thereby refuted: it needs only summable within-class
 *    correlations, which Lemmas T + G already provide.
 *  - The tail constant itself improves twice: only gaps that are MULTIPLES
 *    of J appear (T_J^arith <= T(J) termwise as a subset), and the closed
 *    form has denominator 1 - 2^(-theta (1-beta) J) instead of
 *    1 - 2^(-theta (1-beta)).
 *
 * HONEST COST AND EXACT CROSSOVER: the far term carries the multiplicative
 * J from Step 1, so NEITHER bound dominates; the deliverable is
 * min(S, S-prime) with the exact algebraic crossover
 *   S-prime <= S  iff  (J - 1) sum_b ||w_b||^2
 *                      >= (4/(2 sigma - 1)) (J T_J^arith - T(J)) sum_b nTilde_b^2
 * (and S-prime dominates OUTRIGHT when J T_J^arith <= T(J)). S-prime wins in
 * the norm-dominated regime (few packets per block, or theta moderate-to-
 * large, where the block-norm term is the budget); S can win in the
 * mass-dominated regime (many packets per block at small theta, where
 * nTilde_b^2 is far above ||w_b||^2). Both regimes are realized and measured
 * below, and the crossover formula is checked against the measured winner.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) Step 2 needs EVERY within-class
 * distinct pair to have gap >= 2 - true since gaps are mJ with J >= 2 (this
 * is where J >= 2 is used; J = 1 is excluded, as Lemma G has no floor at gap
 * 1); (2) the Step 3 count was re-derived pair-by-pair: ordered = 2 x
 * unordered, each unordered {b, b+mJ} contributes after AM-GM half its
 * bound to each endpoint, and summing over m both directions gives the
 * coefficient (4/(2 sigma - 1)) T_J^arith exactly, not 2x more; (3) the
 * closed form needs G(J) > 0 only for finiteness of each term but G(J) > 1
 * for the closed-form geometric sum to be USEFUL - at J = j0 the Theorem N
 * threshold gives G(j0) > 1 automatically; for J with G(J) <= 1 the direct
 * sum T_J^arith still converges (G grows geometrically) and the theorem
 * stands with the direct sum; (4) attempted refutation of the sharpening
 * claim by the equal-blocks extremal case W_0 = ... = W_{J-1}: Step 1 is
 * attained there, and the within-class terms are then genuinely far pairs -
 * no hidden slack reversal; (5) the grid cross-checks below verify the
 * per-pair Lemma T + G bound on EVERY within-class pair of the built
 * families (the load-bearing new step), not just the final inequality;
 * (6) truncated Riemann sums underestimate the nonnegative envelope
 * integrals they stand in for, so numeric <= analytic-bound is the safe
 * direction, as in the siblings; (7) branch signs: per branch sign,
 * combining the two costs at most a factor 2, exactly as recorded by the
 * siblings - not reproved here; (8) NON-VACUITY: in the realizations below
 * support disjointness genuinely fails (positive far envelope-product mass),
 * so Theorem N is inapplicable while S-prime holds.
 *
 * WHAT REMAINS OPEN (unchanged residuals of the sibling chain): the
 * packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER
 * packets; the curvature ceiling D retained by the window; the paper phase
 * curvature normalization; residual (c), the passage from the l2 weld bound
 * to the pointwise scalar |C_E,17|. NEW honest residual: the multiplicative
 * J on the far term is structural to the class split (Step 1 multiplies the
 * WHOLE budget); an aggregation with near constant J and a J-free far term
 * would need the cross-class near terms (gaps not multiples of J, including
 * gap 1, where Lemma G gives no floor) to be controlled by something other
 * than Cauchy-Schwarz - not provided here.
 *
 * The numerics below CROSS-CHECK the closed-form statements; they are not
 * the claim. Import-light (no heavy bundle). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── closed-form pieces (same conventions as the sibling modules) ─────────────
function isolationConstant(c, v, beta, D) {
  const Q = ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
  let j = 2;
  while (!(Math.pow(2, j - 1) - 1 > Q * (1 + Math.pow(2, j * beta)))) j++;
  return { Q, j0: j };
}

function gapRatioFloor(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

// Theorem S tail (all gaps j >= J), direct partial sum
function tailSDirect(J, Q, beta, theta, jMax) {
  let s = 0;
  for (let j = J; j <= jMax; j++) s += Math.pow(1 + gapRatioFloor(j, Q, beta), -theta);
  return s;
}

// Theorem S tail, closed form (fifth continuation)
function tailSClosedForm(J, Q, beta, theta) {
  return (
    Math.pow(gapRatioFloor(J, Q, beta), -theta) /
    (1 - Math.pow(2, -theta * (1 - beta)))
  );
}

// NEW: arithmetic-progression tail (gaps mJ only), direct partial sum
function tailArithDirect(J, Q, beta, theta, mMax) {
  let s = 0;
  for (let m = 1; m <= mMax; m++) s += Math.pow(1 + gapRatioFloor(m * J, Q, beta), -theta);
  return s;
}

// NEW: arithmetic tail closed form of Theorem S-prime Step 4
function tailArithClosedForm(J, Q, beta, theta) {
  return (
    Math.pow(gapRatioFloor(J, Q, beta), -theta) /
    (1 - Math.pow(2, -theta * (1 - beta) * J))
  );
}

// exact algebraic crossover: S-prime rhs <= S rhs iff
// (J-1) A >= (4/(2 sigma - 1)) (J T_arith - T_S) M, A = sum ||w_b||^2,
// M = sum nTilde_b^2. Returns the threshold on A/M (or -Infinity if S-prime
// dominates outright).
function crossoverThreshold(J, Q, beta, sigma, theta) {
  const cT = 4 / (2 * sigma - 1);
  const diff = J * tailArithClosedForm(J, Q, beta, theta) - tailSClosedForm(J, Q, beta, theta);
  if (diff <= 0) return -Infinity;
  return (cT * diff) / (J - 1);
}

// ── the model packet family (one branch sign; same as the siblings) ─────────
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

// one packet per block: the norm-dominated regime (nTilde_b^2 = n_b^2)
function onePerBlock(packets) {
  const seen = new Map();
  for (const q of packets) if (!seen.has(q.b)) seen.set(q.b, q);
  return [...seen.values()];
}

// ── grid realization of the full S-prime chain ───────────────────────────────
// Envelope-shaped signed packets on a grid (supports = all of R, truncated):
// verifies (a) the exact class Cauchy-Schwarz, (b) the per-pair Lemma T + G
// bound on EVERY within-class cross pair, (c) the assembled S-prime bound,
// and computes both rhs values for the crossover comparison.
function sPrimeRealization(packets, v, c, beta, D, sigma, theta, J) {
  const { Q } = isolationConstant(c, v, beta, D);
  const B = Math.max(...packets.map((q) => q.b)) + 1;
  const s = sigma + theta;
  const rMax = Math.max(...packets.map((q) => q.r));
  const uMax = Math.max(...packets.map((q) => q.u)) + 30 * rMax;
  const uMin = -30 * rMax;
  const step = 0.02;
  const L = Math.ceil((uMax - uMin) / step) + 1;
  let seed = 246813579;
  const rnd = () => {
    seed = (Math.imul(1103515245, seed) + 12345) >>> 0;
    return seed / 4294967296 - 0.5;
  };
  const wB = Array.from({ length: B }, () => new Float64Array(L));
  const nTilde = new Array(B).fill(0);
  for (const q of packets) {
    const x = rnd();
    nTilde[q.b] += Math.abs(x) * Math.sqrt(q.r);
    const w = wB[q.b];
    for (let i = 0; i < L; i++) {
      const u = uMin + i * step;
      w[i] += x * Math.pow(1 + Math.abs(u - q.u) / q.r, -s);
    }
  }
  const ip = (a, bArr) => {
    let t = 0;
    for (let i = 0; i < a.length; i++) t += a[i] * bArr[i];
    return t * step;
  };
  const total = new Float64Array(L);
  for (const w of wB) for (let i = 0; i < L; i++) total[i] += w[i];
  const lhs = ip(total, total);
  const blockNormSq = wB.map((w) => ip(w, w));
  const A = blockNormSq.reduce((a, x) => a + x, 0);
  const M = nTilde.reduce((a, x) => a + x * x, 0);
  // (a) exact class Cauchy-Schwarz on the grid
  const classNormSq = new Array(J).fill(0);
  for (let cc = 0; cc < J; cc++) {
    const Wc = new Float64Array(L);
    for (let b = cc; b < B; b += J) for (let i = 0; i < L; i++) Wc[i] += wB[b][i];
    classNormSq[cc] = ip(Wc, Wc);
  }
  const sumClassNormSq = classNormSq.reduce((a, x) => a + x, 0);
  const classCauchySchwarzOk = lhs <= J * sumClassNormSq + 1e-9 * Math.abs(lhs);
  // (b) per-pair Lemma T + G bound on every within-class cross pair
  const cT = 2 / (2 * sigma - 1);
  let withinClassPairs = 0;
  let perPairViolations = 0;
  let withinCrossGrid = 0;
  let withinCrossBound = 0;
  for (let b = 0; b < B; b++) {
    for (let b2 = b + J; b2 < B; b2 += J) {
      const gap = b2 - b;
      const pairBound =
        cT * Math.pow(1 + gapRatioFloor(gap, Q, beta), -theta) * nTilde[b] * nTilde[b2];
      const pairGrid = Math.abs(ip(wB[b], wB[b2]));
      withinClassPairs++;
      withinCrossGrid += 2 * pairGrid;
      withinCrossBound += 2 * pairBound;
      if (!(pairGrid <= pairBound + 1e-12)) perPairViolations++;
    }
  }
  // (c) assembled bounds
  const tArith = tailArithClosedForm(J, Q, beta, theta);
  const tS = tailSClosedForm(J, Q, beta, theta);
  const rhsSPrime = J * (A + (4 / (2 * sigma - 1)) * tArith * M);
  const rhsS = (2 * J - 1) * A + (4 / (2 * sigma - 1)) * tS * M;
  // non-vacuity: a within-class far pair has positive envelope-product mass
  let farOverlapMass = 0;
  {
    const first = packets.find((q) => q.b === 0);
    const far = packets.find((q) => q.b >= J);
    if (first && far) {
      for (let i = 0; i < L; i++) {
        const u = uMin + i * step;
        farOverlapMass +=
          Math.pow(1 + Math.abs(u - first.u) / first.r, -s) *
          Math.pow(1 + Math.abs(u - far.u) / far.r, -s);
      }
      farOverlapMass *= step;
    }
  }
  return {
    B,
    J,
    packetCount: packets.length,
    lhs,
    A,
    M,
    sumClassNormSq,
    classCauchySchwarzOk,
    withinClassPairs,
    perPairViolations,
    withinCrossGrid,
    withinCrossBound,
    tArith,
    tS,
    rhsSPrime,
    rhsS,
    sPrimeHolds: lhs <= rhsSPrime,
    sHolds: lhs <= rhsS,
    crossoverAoverM: crossoverThreshold(J, isolationConstant(c, v, beta, D).Q, beta, sigma, theta),
    sPrimeWins: rhsSPrime <= rhsS,
    farOverlapMass,
  };
}

// ── reference numbers and realizations ───────────────────────────────────────
const REF = isolationConstant(1, 1, 1 / 3, 1); // Q = 2^(-2/3), j0 = 3
const REF_G_J0 = gapRatioFloor(REF.j0, REF.Q, 1 / 3); // (3/2) 2^(2/3)

const FULL_FAMILY = buildFamily(97, 1, 1, 1 / 3, 1); // 96 packets, 7 blocks
const SPARSE_FAMILY = onePerBlock(FULL_FAMILY); // 7 packets, one per block

// mass-dominated regime: full family at theta = 2 (many packets per block)
const R_MASS = sPrimeRealization(FULL_FAMILY, 1, 1, 1 / 3, 1, 1, 2, REF.j0);
// norm-dominated regime: one packet per block at theta = 4
const R_NORM = sPrimeRealization(SPARSE_FAMILY, 1, 1, 1 / 3, 1, 1, 4, REF.j0);
// support-limit consistency: one per block at theta = 10
const R_LIMIT = sPrimeRealization(SPARSE_FAMILY, 1, 1, 1 / 3, 1, 1, 10, REF.j0);

// iterated gap growth used by the closed form: G(mJ) >= G(J) 2^((1-beta)(m-1)J)
function iteratedGapGrowthHolds(Q, beta, J, mMax) {
  const base = gapRatioFloor(J, Q, beta);
  for (let m = 1; m <= mMax; m++) {
    const lhs = gapRatioFloor(m * J, Q, beta);
    const rhs = base * Math.pow(2, (1 - beta) * (m - 1) * J);
    if (!(lhs >= rhs * (1 - 1e-12))) return false;
  }
  return true;
}

const COUNTER_Q = isolationConstant(2, 0.5, 0.5, 4).Q; // large-Q sibling counter-family

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_COLORCLASS_NEAR_BAND_SHARPENING = {
  ticket: 'imp-95008 (continuation six: color-class sharpening of the near-band constant)',
  source:
    'Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; discharges the NEW residual of imp-95008-tail-schur-almost-orthogonality (near-band 2J-1 vs J) and refutes its stated Cotlar-Stein obstruction; consumes Lemmas T and G of that module unchanged',
  theoremSPrime:
    'CONDITIONAL only on MAJ(sigma, theta), J >= 2: ||sum_b w_b||^2 <= J [ sum_b ||w_b||^2 + (4/(2 sigma - 1)) T_J^arith sum_b nTilde_b^2 ], T_J^arith = sum_{m>=1} (1 + G(mJ))^(-theta) <= G(J)^(-theta)/(1 - 2^(-theta(1-beta)J)). Proof: mod-J class split (Cauchy-Schwarz, sharp constant J) + every within-class distinct pair has gap mJ >= 2 so Lemmas T and G pay it + AM-GM roll-up + iterated gap growth for the closed form.',
  sharpening:
    'Near-band constant J instead of 2J - 1 (3 vs 5 at the reference split J = j0 = 3); tail improves twice (multiples-of-J subset, and closed-form denominator exponent theta(1-beta)J instead of theta(1-beta)); support-limit consistency now EXACT (theta -> infinity recovers the Theorem N constant j0 with no factor-2 loss). The fifth continuation claim that this needs operator structure or genuine orthogonality is refuted: summable within-class correlations suffice.',
  honestCost:
    'The far term carries the multiplicative J from the class split, so neither bound dominates: the deliverable is min(S, S-prime) with the exact crossover (J-1) sum ||w_b||^2 >= (4/(2 sigma - 1))(J T_J^arith - T(J)) sum nTilde_b^2. S wins in the mass-dominated regime (many packets per block at small theta), S-prime in the norm-dominated regime; both regimes are realized and measured below.',
  reference: {
    parameters: { p: 97, v: 1, c: 1, beta: '1/3', D: 1, J: REF.j0 },
    Q: REF.Q,
    j0: REF.j0, // 3
    G_at_j0: REF_G_J0, // ~2.3811
    nearConstantSPrime: REF.j0, // 3
    nearConstantS: 2 * REF.j0 - 1, // 5
    tailArithClosedForm_theta2: tailArithClosedForm(REF.j0, REF.Q, 1 / 3, 2), // ~0.18814
    tailSClosedForm_theta2: tailSClosedForm(REF.j0, REF.Q, 1 / 3, 2), // ~0.29243
    crossoverAoverM_theta2: crossoverThreshold(REF.j0, REF.Q, 1 / 3, 1, 2), // ~0.54397
  },
  realizations: {
    massDominated_theta2: R_MASS,
    normDominated_theta4: R_NORM,
    supportLimit_theta10: R_LIMIT,
  },
  openResiduals: [
    'the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family',
    'the curvature ceiling D retained by the window',
    'the paper phase curvature normalization (sibling Theorem D residual)',
    'residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|',
    'NEW: the multiplicative J on the far term is structural to the class split; a near-constant-J bound with a J-free far term would need the cross-class near pairs (gaps not multiples of J, including gap 1 with no Lemma G floor) controlled by something other than Cauchy-Schwarz',
  ],
  isRigorous: true,
  rigorScope:
    'Theorem S-prime is conditional only on the tail-majorant hypothesis MAJ(sigma, theta) - the same hypothesis as the sibling Theorem S, strictly weaker than the Theorem N SUPPORT hypothesis. Lemmas T and G are consumed unchanged (unconditional). The numerics cross-check the statements pair-by-pair; they are not the claim.',
  promotesBound: false,
  verdict:
    'RIGOROUS sharpening step: the near-band constant of the tail-robust cross-block aggregation drops from 2J - 1 to J via a mod-J color-class split whose within-class cross terms are paid by the existing Lemmas T and G (all within-class gaps are multiples of J >= 2), with the improved closed-form tail T_J^arith <= G(J)^(-theta)/(1 - 2^(-theta(1-beta)J)); the support limit now recovers the Theorem N constant j0 exactly, refuting the sibling module named obstruction (no Cotlar-Stein operator structure needed). Honest cost kept explicit: the far term is multiplied by J, so the deliverable is min(S, S-prime) with an exact algebraic crossover, measured in both regimes. Paper-packet envelope constants, window ceiling, phase normalization, and the l2-to-pointwise step remain open. Changes no bound; NO QED; no refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_COLORCLASS_ASSERTIONS = [
  {
    id: 'imp95008-cc-reference-closed-forms',
    description:
      'reference numbers: j0 = 3, G(j0) = (3/2) 2^(2/3), and the arithmetic tail closed form matches its definition G(J)^(-theta)/(1 - 2^(-theta(1-beta)J)) at theta = 2',
    holds: () =>
      REF.j0 === 3 &&
      Math.abs(REF_G_J0 - 1.5 * Math.pow(2, 2 / 3)) < 1e-12 &&
      Math.abs(
        tailArithClosedForm(3, REF.Q, 1 / 3, 2) -
          Math.pow(REF_G_J0, -2) / (1 - Math.pow(2, -4)),
      ) < 1e-12,
  },
  {
    id: 'imp95008-cc-tail-subset-and-majorant',
    description:
      'the arithmetic tail is termwise a subset of the Theorem S tail (T_J^arith <= T(J) on direct partial sums) and is majorized by its closed form, at theta in {2, 4, 10} on the reference family',
    holds: () =>
      [2, 4, 10].every((theta) => {
        const dA = tailArithDirect(3, REF.Q, 1 / 3, theta, 400);
        const dS = tailSDirect(3, REF.Q, 1 / 3, theta, 1200);
        return dA <= dS && dA <= tailArithClosedForm(3, REF.Q, 1 / 3, theta);
      }),
  },
  {
    id: 'imp95008-cc-iterated-gap-growth',
    description:
      'the iterated gap growth G(mJ) >= G(J) 2^((1-beta)(m-1)J) used by the closed form holds for m <= 12 on the reference family (beta = 1/3, J = 3) and the large-Q counter-family (beta = 1/2, J in {2, 3})',
    holds: () =>
      iteratedGapGrowthHolds(REF.Q, 1 / 3, 3, 12) &&
      iteratedGapGrowthHolds(COUNTER_Q, 1 / 2, 2, 12) &&
      iteratedGapGrowthHolds(COUNTER_Q, 1 / 2, 3, 12),
  },
  {
    id: 'imp95008-cc-class-cauchy-schwarz-exact',
    description:
      'Step 1 is exact on the grid: ||sum_b w_b||^2 <= J sum_c ||W_c||^2 in all three realizations (finite-dimensional Cauchy-Schwarz, no analytic input)',
    holds: () =>
      R_MASS.classCauchySchwarzOk && R_NORM.classCauchySchwarzOk && R_LIMIT.classCauchySchwarzOk,
  },
  {
    id: 'imp95008-cc-per-pair-lemma-tg',
    description:
      'the load-bearing new step holds pair-by-pair: EVERY within-class cross pair (gap a multiple of J) satisfies |<w_b, w_b2>| <= (2/(2 sigma - 1))(1 + G(gap))^(-theta) nTilde_b nTilde_b2 on the grid, in all three realizations',
    holds: () =>
      R_MASS.withinClassPairs > 0 &&
      R_MASS.perPairViolations === 0 &&
      R_NORM.perPairViolations === 0 &&
      R_LIMIT.perPairViolations === 0,
  },
  {
    id: 'imp95008-cc-theorem-sprime-holds',
    description:
      'the assembled Theorem S-prime bound holds in all three realizations: ||sum||^2 <= J [ sum ||w_b||^2 + (4/(2 sigma - 1)) T_J^arith sum nTilde_b^2 ]',
    holds: () =>
      R_MASS.lhs > 0 &&
      R_MASS.sPrimeHolds &&
      R_NORM.sPrimeHolds &&
      R_LIMIT.sPrimeHolds,
  },
  {
    id: 'imp95008-cc-crossover-both-regimes',
    description:
      'both regimes are genuinely realized and the exact crossover formula predicts the measured winner: S-prime wins in the norm-dominated realization, S wins in the mass-dominated one, and in each case (A/M >= threshold) iff S-prime wins',
    holds: () =>
      R_NORM.sPrimeWins &&
      !R_MASS.sPrimeWins &&
      R_NORM.A / R_NORM.M >= R_NORM.crossoverAoverM &&
      R_MASS.A / R_MASS.M < R_MASS.crossoverAoverM,
  },
  {
    id: 'imp95008-cc-support-limit-exact',
    description:
      'support-limit consistency is exact: at theta = 10 the S-prime bound is within 5 percent of J sum ||w_b||^2 (near constant 3) while the S bound stays at the near constant 5 - the factor-2 loss of the fifth continuation is removed',
    holds: () =>
      R_LIMIT.rhsSPrime <= R_LIMIT.J * R_LIMIT.A * 1.05 &&
      R_LIMIT.rhsS >= (2 * R_LIMIT.J - 1) * R_LIMIT.A &&
      R_LIMIT.rhsSPrime < R_LIMIT.rhsS,
  },
  {
    id: 'imp95008-cc-non-vacuity',
    description:
      'the tail hypothesis is genuinely needed: within-class far pairs have strictly positive envelope-product mass (support disjointness fails, Theorem N inapplicable) in all three realizations',
    holds: () =>
      R_MASS.farOverlapMass > 0 && R_NORM.farOverlapMass > 0 && R_LIMIT.farOverlapMass > 0,
  },
  {
    id: 'imp95008-cc-honesty-gate',
    description:
      'the verdict keeps the multiplicative-J cost and the min(S, S-prime) framing, lists the five open residuals, promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95008_COLORCLASS_NEAR_BAND_SHARPENING.promotesBound === false &&
      IMP95008_COLORCLASS_NEAR_BAND_SHARPENING.openResiduals.length === 5 &&
      /min\(S, S-prime\)/.test(IMP95008_COLORCLASS_NEAR_BAND_SHARPENING.verdict) &&
      /NO QED/.test(IMP95008_COLORCLASS_NEAR_BAND_SHARPENING.verdict) &&
      /refereed bound is changed/i.test(IMP95008_COLORCLASS_NEAR_BAND_SHARPENING.verdict) &&
      /MAJ/.test(IMP95008_COLORCLASS_NEAR_BAND_SHARPENING.theoremSPrime),
  },
];

for (const a of IMP95008_COLORCLASS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-colorclass-near-band-sharpening assertion failed: ${a.id}`);
  }
}

export default IMP95008_COLORCLASS_NEAR_BAND_SHARPENING;
