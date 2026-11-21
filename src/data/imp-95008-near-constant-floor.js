/**
 * imp-95008 continuation (seventh) - the near-band sharpening line TERMINATES
 * at 2: split-gap optimization plus a matching LOWER bound. The sixth
 * continuation (imp-95008-colorclass-near-band-sharpening.js) left the NEW
 * residual "the multiplicative J on the far term is structural to the class
 * split; a near-constant-J bound with a J-free far term would need the
 * cross-class near pairs (gap 1, no Lemma G floor) controlled by something
 * other than Cauchy-Schwarz". This module resolves that line in BOTH
 * directions and pins the near constant exactly:
 *
 * PART 1 (Corollary P - upper side; no new hypothesis). Theorem S-prime of
 * the sixth continuation holds for EVERY split gap J >= 2, and the sibling
 * chain never optimized J: at J = 2 it reads
 *   || sum_b w_b ||^2 <= 2 sum_b ||w_b||^2
 *                        + (8/(2 sigma - 1)) T_even sum_b nTilde_b^2 ,
 * T_even = T_2^arith = sum_{m >= 1} (1 + G(2m))^(-theta). Near constant 2 -
 * STRICTLY BELOW the support-limit Theorem N constant j0 = 3 that the sixth
 * continuation reported as the exact limit. No contradiction: the sixth
 * statement is a FIXED-J = j0 consistency check, while MAJ(sigma, theta) as
 * theta -> infinity is strictly stronger than the SUPPORT hypothesis at
 * sub-j0 gaps - Lemma G gives G(j) > 0 for every j >= 2, so the envelope
 * tail (1 + G(2))^(-theta) forces gap-2 DEcorrelation where support
 * disjointness (which only begins at j0) permits full gap-2 correlation.
 * Structurally, J = 2 is the mod-2 class split, equivalently the PARITY
 * identity ||W||^2 <= ||W||^2 + ||W_minus||^2 = 2 sum over pairs with even
 * index difference of <w_b, w_b2> (W_minus = alternating-sign block sum):
 * mod 2 is the unique modulus that annihilates ALL floorless gap-1 pairs
 * while every surviving pair keeps a Lemma G floor. (Corollary P is exactly
 * S-prime at J = 2 - the parity identity and the 2-class Cauchy-Schwarz are
 * the same inequality - so Part 1 is an optimization observation on the
 * proved sibling theorem, recorded because the chain had tied J to j0.)
 *
 * PART 2 (THEOREM F - near-constant FLOOR; the new rigorous step). Fix the
 * model family conventions of the fifth/sixth continuations (packets on the
 * (1/p)-separated alias grid d = k - h/p, widths r_d = c d^(-beta), dyadic
 * curvature blocks in (0, D], hypothesis MAJ(sigma, theta), s = sigma +
 * theta, currencies A_curr = sum_b ||w_b||^2 and M = sum_b nTilde_b^2). Let
 * cFar >= 0 and let T* be any tail functional with T* <= T(2) =
 * sum_{j >= 2} (1 + G(j))^(-theta) (this covers every member T(J), T_J^arith
 * of the sibling family, since each is a sub-sum of T(2)). If the bound
 *   || sum_b w_b ||^2 <= cNear A_curr + cFar T* M
 * holds for ALL packet families satisfying MAJ(sigma, theta) on the grid,
 * then
 *   cNear >= 2 - L(s) tau_p^2 - cFar T(2) (2s - 1)(r_1 + r_2)/(4 r_1),
 * where L(s) = s^2 (2s - 1) / (2 (2s + 1)), d_1 = (p+1)/(2p),
 * d_2 = (p-1)/(2p) (the two admissible denominators straddling the block-0/
 * block-1 boundary D/2 at the minimal grid spacing 1/p, taking D = 1),
 * r_i = c d_i^(-beta), and tau_p = v (1/d_2 - 1/d_1) / r_1.
 *
 * Proof. WITNESS FAMILY: two packets. Grid admissibility: d_1 = 1 - (p-1)/(2p)
 * (k = 1, h = (p-1)/2) and d_2 = 1 - (p+1)/(2p) (k = 1, h = (p+1)/2); for odd
 * p both h are integers in [1, p-1]; d_1 in (1/2, 1] = block 0 and d_2 in
 * (1/4, 1/2] = block 1, so the pair realizes block gap 1. Both packets take
 * the COMMON-SHAPE profile a_i(u) = A0 phi((u - u_i)/r_1),
 * phi(x) = (1 + |x|)^(-s), with the SMALLER width r_1 = min(r_1, r_2)
 * (d_1 > d_2 gives r_1 < r_2 since beta > 0): a_1 equals its own MAJ envelope,
 * and |a_2(u)| = A0 (1 + |u - u_2|/r_1)^(-s) <= A0 (1 + |u - u_2|/r_2)^(-s)
 * because narrower decays faster - MAJ holds with envelope constants
 * A_1 = A_2 = A0. CLOSED-FORM CURRENCIES: ||phi||_2^2 = 2/(2s - 1), so
 * A_curr = 2 A0^2 r_1 ||phi||^2 and M = A0^2 (r_1 + r_2), giving
 * M / A_curr = (2s - 1)(r_1 + r_2)/(4 r_1). CORRELATION VIA THE W^{1,2}
 * SHIFT BOUND: phi is absolutely continuous with a.e. derivative
 * phi_prime = -s sign(x) (1 + |x|)^(-s-1) in L^2, ||phi_prime||_2^2 =
 * 2 s^2/(2s + 1) (the corner at 0 is harmless); by Minkowski integral
 * inequality || phi(. + tau) - phi ||_2 <= |tau| ||phi_prime||_2, and since
 * translation preserves the norm, <phi, phi_tau> = ||phi||^2 -
 * ||phi - phi_tau||^2 / 2 >= ||phi||^2 - tau^2 ||phi_prime||^2 / 2. Hence the
 * normalized correlation rho of a_1, a_2 obeys 1 - rho <= L(s) tau_p^2 with
 * L(s) = ||phi_prime||^2 / (2 ||phi||^2) = s^2 (2s - 1)/(2(2s + 1)).
 * ASSEMBLY: || a_1 + a_2 ||^2 = (1 + rho) A_curr >= (2 - L tau_p^2) A_curr;
 * validity of the bound on the witness family forces
 * cNear >= (1 + rho) - cFar T* M / A_curr >= 2 - L tau_p^2 -
 * cFar T(2) (2s - 1)(r_1 + r_2)/(4 r_1). QED (of the floor; all quantities
 * closed-form).
 *
 * CONSEQUENCE - THE LINE TERMINATES: at the reference family (p = 97,
 * v = c = D = 1, beta = 1/3, sigma = 1) and theta = 10, with the achieved
 * far coefficient cFar = 8/(2 sigma - 1) = 8, the floor evaluates to
 * 1.857656739767721; with cFar = 4/(2 sigma - 1) it is 1.899031642426087.
 * So the near constant of ANY two-currency aggregation bound is pinned to
 * [1.8577, 2] at the reference, and Corollary P attains 2. In the joint
 * limit spacing -> 0 THEN theta -> infinity the floor converges to 2
 * exactly (through prime spacings: floor(9973, 20) > 1.9998,
 * floor(99991, 30) > 1.999999, floor(999983, 40) > 1.99999999): the
 * near constant 2 is asymptotically SHARP, and the sixth-continuation
 * residual "control the gap-1 pairs by something other than Cauchy-Schwarz
 * to beat the class-split constant" is resolved NEGATIVELY below 2 - no
 * such control exists in this bound class - and POSITIVELY at 2 via J = 2.
 *
 * PART 3 (minimizer landscape, measured). With J free, the deliverable
 * min over { S(J), S-prime(J) : J >= 2 } replaces the sixth continuation
 * fixed-J min(S, S-prime): on the sibling norm-dominated realization
 * (one packet per block, theta = 10) the minimizer is S-prime(2) - the
 * terminal near constant - while on the mass-dominated realization (full
 * 96-packet family, theta = 2) it is S-prime(9) over J in [2, 16]: when
 * A_curr << M the J multiplier is cheap and the faster per-class tail decay
 * 2^(-theta (1-beta) J) wins, so BOTH ends of the landscape are S-prime,
 * at opposite J extremes.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) witness admissibility was checked
 * exactly (grid membership with integer h, block membership, r_1 the
 * minimum width so the common-shape packet sits under the wider envelope);
 * (2) the shift bound direction: it LOWER-bounds the correlation, which is
 * the direction the floor needs; numerically 1 - rho = 0.0466 vs
 * L tau^2 = 0.0596 at the reference - the bound holds with ~28 percent
 * slack, so the floor is slightly loose, honest direction; (3) attempted
 * refutation of the floor by taking theta large at FIXED p: real -
 * L tau_p^2 grows like s^2 tau_p^2, so the floor is NOT monotone in theta
 * (asserted below); the joint limit takes p -> infinity FIRST - the
 * sharpness claim is stated in exactly that order; (4) attempted refutation
 * via a rival far currency: the floor quantifies over T* <= T(2), which
 * covers the whole sibling tail family; a bound in a genuinely different
 * currency (e.g. the Theorem N support-count K_b m_b, unavailable under
 * MAJ) would evade the floor only by leaving the bound class - recorded as
 * scope, not hidden; (5) consistency: the witness family lhs must ALSO obey
 * the Corollary P upper bound - checked numerically ((1 + rho) A_curr =
 * 0.4672 <= 0.4980 = S-prime(2) rhs), so floor < 2 <= no contradiction;
 * (6) the parity identity ||W||^2 + ||W_minus||^2 = 2 sum over even index
 * differences is an exact algebraic identity, verified to machine precision
 * on both grid realizations - Corollary P discards ||W_minus||^2 >= 0 and
 * this is its ONLY loss; (7) truncated Riemann sums of nonnegative
 * integrands underestimate, so numeric <= analytic stays the safe direction
 * exactly as in the siblings; (8) branch signs: combining the two costs at
 * most a factor 2, exactly as recorded by the siblings - not reproved here.
 *
 * WHAT REMAINS OPEN (sibling residuals unchanged): the packet-envelope
 * constants (c, beta, sigma, theta, A_d) for the PAPER packets; the
 * curvature ceiling D retained by the window; the paper phase curvature
 * normalization; residual (c), the passage from the l2 weld bound to the
 * pointwise scalar |C_E,17|. NEW honest residual (replaces the discharged
 * near-constant residual): FAR-COEFFICIENT reduction at the pinned near
 * constant 2 - Corollary P discards ||W_minus||^2 >= 0, and recovering part
 * of it would need a LOWER bound on the alternating block sum, which no
 * sibling lemma provides; the floor theorem constrains cNear only, so
 * cFar = 8/(2 sigma - 1) at cNear = 2 is not known to be optimal.
 *
 * The numerics below CROSS-CHECK the closed-form statements; they are not
 * the claim. Import-light (no heavy bundle). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── closed-form pieces (same conventions as the sibling modules) ─────────────
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

function gapRatioFloor(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

// Theorem S tail T(J) = sum_{j >= J} (1 + G(j))^(-theta), direct partial sum.
// G(j) grows geometrically, so once 2^(j-1) overflows to Infinity the ratio
// is Infinity/Infinity = NaN while the true term is ~0: stop there (sibling
// pow-overflow trap - the dropped tail is below double precision anyway).
function tailSDirect(J, Q, beta, theta, jMax) {
  let s = 0;
  for (let j = J; j <= jMax; j++) {
    const g = gapRatioFloor(j, Q, beta);
    if (!Number.isFinite(g)) break;
    s += Math.pow(1 + g, -theta);
  }
  return s;
}

// arithmetic tail T_J^arith = sum_{m >= 1} (1 + G(mJ))^(-theta), direct
function tailArithDirect(J, Q, beta, theta, mMax) {
  let s = 0;
  for (let m = 1; m <= mMax; m++) {
    const g = gapRatioFloor(m * J, Q, beta);
    if (!Number.isFinite(g)) break;
    s += Math.pow(1 + g, -theta);
  }
  return s;
}

// phi(x) = (1 + |x|)^(-s): closed-form L2 norms of phi and its derivative
function phiNormSq(s) {
  return 2 / (2 * s - 1);
}
function phiPrimeNormSq(s) {
  return (2 * s * s) / (2 * s + 1);
}
// the floor curvature constant L(s) = ||phi_prime||^2 / (2 ||phi||^2)
function floorL(s) {
  return (s * s * (2 * s - 1)) / (2 * (2 * s + 1));
}

// ── THEOREM F floor, fully closed-form ───────────────────────────────────────
// witness pair d_1 = (p+1)/(2p) in block 0, d_2 = (p-1)/(2p) in block 1
function witnessPair(p) {
  const d1 = (p + 1) / (2 * p);
  const d2 = (p - 1) / (2 * p);
  const r1 = CC * Math.pow(d1, -BETA);
  const r2 = CC * Math.pow(d2, -BETA);
  const tau = (VV * (1 / d2 - 1 / d1)) / r1;
  return { d1, d2, r1, r2, tau, h1: (p - 1) / 2, h2: (p + 1) / 2 };
}

function nearConstantFloor(p, theta, cFar) {
  const s = SIGMA + theta;
  const { r1, r2, tau } = witnessPair(p);
  const Q = isolationQ(CC, VV, BETA, DD);
  const T2 = tailSDirect(2, Q, BETA, theta, 800);
  const massRatio = ((2 * s - 1) * (r1 + r2)) / (4 * r1);
  return 2 - floorL(s) * tau * tau - cFar * T2 * massRatio;
}

// ── numeric cross-check: the W^{1,2} shift bound on phi ─────────────────────
function shiftBoundNumeric(s, tau) {
  const step = 0.001;
  const lim = 60;
  let diffSq = 0;
  for (let x = -lim; x <= lim; x += step) {
    const d =
      Math.pow(1 + Math.abs(x + tau), -s) - Math.pow(1 + Math.abs(x), -s);
    diffSq += d * d;
  }
  diffSq *= step;
  return { numeric: diffSq, bound: tau * tau * phiPrimeNormSq(s) };
}

// ── numeric cross-check: the witness two-packet family at the reference ─────
function witnessRealization(p, theta) {
  const s = SIGMA + theta;
  const { d1, d2, r1, r2, tau } = witnessPair(p);
  const u1 = VV / d1;
  const u2 = VV / d2;
  const step = 0.002;
  const lo = u1 - 40 * r1;
  const hi = u2 + 40 * r1;
  const L = Math.ceil((hi - lo) / step) + 1;
  let n11 = 0;
  let n22 = 0;
  let n12 = 0;
  for (let i = 0; i < L; i++) {
    const u = lo + i * step;
    const f1 = Math.pow(1 + Math.abs(u - u1) / r1, -s);
    const f2 = Math.pow(1 + Math.abs(u - u2) / r1, -s);
    n11 += f1 * f1;
    n22 += f2 * f2;
    n12 += f1 * f2;
  }
  const rho = n12 / Math.sqrt(n11 * n22);
  const Q = isolationQ(CC, VV, BETA, DD);
  const aCurr = 2 * r1 * phiNormSq(s); // A0 = 1
  const M = r1 + r2;
  const lhs = aCurr * (1 + rho);
  const rhsSPrime2 =
    2 * (aCurr + (4 / (2 * SIGMA - 1)) * tailArithDirect(2, Q, BETA, theta, 400) * M);
  return {
    rho,
    tau,
    Ltau2: floorL(s) * tau * tau,
    oneMinusRho: 1 - rho,
    shiftBoundOk: 1 - rho <= floorL(s) * tau * tau,
    lhs,
    floorSide: aCurr * (2 - floorL(s) * tau * tau),
    rhsSPrime2,
    upperConsistent: lhs <= rhsSPrime2,
  };
}

// ── the sibling model family, parity identity, and the J landscape ──────────
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

function onePerBlock(packets) {
  const seen = new Map();
  for (const q of packets) if (!seen.has(q.b)) seen.set(q.b, q);
  return [...seen.values()];
}

function realizeFamily(packets, theta) {
  const s = SIGMA + theta;
  const B = Math.max(...packets.map((q) => q.b)) + 1;
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
  const alternating = new Float64Array(L);
  for (let b = 0; b < B; b++) {
    for (let i = 0; i < L; i++) {
      total[i] += wB[b][i];
      alternating[i] += (b % 2 === 0 ? 1 : -1) * wB[b][i];
    }
  }
  let evenPairSum = 0;
  for (let b = 0; b < B; b++) {
    for (let b2 = 0; b2 < B; b2++) {
      if ((b - b2) % 2 === 0) evenPairSum += ip(wB[b], wB[b2]);
    }
  }
  const A = wB.reduce((a, w) => a + ip(w, w), 0);
  const M = nTilde.reduce((a, x) => a + x * x, 0);
  const lhs = ip(total, total);
  return {
    B,
    A,
    M,
    lhs,
    parityLhs: lhs + ip(alternating, alternating),
    parityRhs: 2 * evenPairSum,
  };
}

// rhs of S(J) and S-prime(J) in the (A, M) currencies
function landscapeMin(A, M, theta, jMax) {
  const Q = isolationQ(CC, VV, BETA, DD);
  const cT4 = 4 / (2 * SIGMA - 1);
  let best = null;
  for (let J = 2; J <= jMax; J++) {
    const rhsS = (2 * J - 1) * A + cT4 * tailSDirect(J, Q, BETA, theta, 800) * M;
    const rhsSp = J * (A + cT4 * tailArithDirect(J, Q, BETA, theta, 400) * M);
    if (!best || rhsS < best.rhs) best = { name: `S(${J})`, rhs: rhsS };
    if (rhsSp < best.rhs) best = { name: `S-prime(${J})`, rhs: rhsSp };
  }
  return best;
}

// ── reference evaluations ────────────────────────────────────────────────────
const REF_FLOOR_CFAR8 = nearConstantFloor(97, 10, 8); // 1.857656739767721
const REF_FLOOR_CFAR4 = nearConstantFloor(97, 10, 4); // 1.899031642426087
const W_REF = witnessRealization(97, 10);
const FULL_FAMILY = buildFamily(97, VV, CC, BETA, DD);
const SPARSE_FAMILY = onePerBlock(FULL_FAMILY);
const R_NORM = realizeFamily(SPARSE_FAMILY, 10);
const R_MASS = realizeFamily(FULL_FAMILY, 2);
const MIN_NORM = landscapeMin(R_NORM.A, R_NORM.M, 10, 16);
const MIN_MASS = landscapeMin(R_MASS.A, R_MASS.M, 2, 16);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_NEAR_CONSTANT_FLOOR = {
  ticket: 'imp-95008 (continuation seven: the near constant terminates at 2)',
  source:
    'Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; resolves the NEW residual of imp-95008-colorclass-near-band-sharpening (beat the class-split near constant) in both directions: J = 2 attains 2 (Corollary P = sibling Theorem S-prime at J = 2, never optimized over J by the chain), and Theorem F pins any two-currency bound at >= 2 - explicit epsilon(p, theta)',
  corollaryP:
    'Theorem S-prime at J = 2: ||sum_b w_b||^2 <= 2 sum ||w_b||^2 + (8/(2 sigma - 1)) T_even sum nTilde_b^2, T_even = sum_{m>=1}(1 + G(2m))^(-theta). Equivalently the parity identity ||W||^2 <= ||W||^2 + ||W_minus||^2 = 2 sum_{even index difference} <w_b, w_b2>: mod 2 uniquely annihilates the floorless gap-1 pairs while every surviving pair keeps a Lemma G floor. Near constant 2 < j0 = 3; MAJ theta -> infinity is strictly stronger than SUPPORT at sub-j0 gaps, so beating the Theorem N constant is consistent.',
  theoremF:
    'FLOOR: any bound ||sum w_b||^2 <= cNear sum ||w_b||^2 + cFar T* sum nTilde_b^2 valid over all MAJ(sigma, theta) families on the (1/p)-separated grid, with T* <= T(2), has cNear >= 2 - L(s) tau_p^2 - cFar T(2)(2s-1)(r1+r2)/(4 r1), s = sigma + theta, L(s) = s^2(2s-1)/(2(2s+1)). Witness: the admissible pair d1 = (p+1)/(2p) in block 0, d2 = (p-1)/(2p) in block 1 at minimal spacing 1/p, common-shape sub-envelope profiles of the smaller width r1, correlation lower-bounded by the W12 shift inequality ||phi_tau - phi|| <= |tau| ||phi_prime||.',
  termination:
    'At the reference (p = 97, theta = 10): floor 1.857656739767721 with the achieved cFar = 8, 1.899031642426087 with cFar = 4; near constant pinned to [1.8577, 2] and attained at 2. Joint limit spacing -> 0 then theta -> infinity: floor -> 2 exactly, so 2 is asymptotically sharp and the near-band sharpening line TERMINATES.',
  landscape:
    'min over { S(J), S-prime(J) : J in [2, 16] }: norm-dominated realization (one packet per block, theta = 10) minimizer S-prime(2); mass-dominated realization (full family, theta = 2) minimizer S-prime(9) - both ends are S-prime at opposite J extremes, replacing the sixth continuation fixed-J min(S, S-prime).',
  reference: {
    parameters: { p: 97, v: VV, c: CC, beta: '1/3', D: DD, sigma: SIGMA, theta: 10 },
    floorCFar8: REF_FLOOR_CFAR8,
    floorCFar4: REF_FLOOR_CFAR4,
    witness: {
      d1: '49/97',
      d2: '48/97',
      tau: W_REF.tau,
      rhoMeasured: W_REF.rho,
      oneMinusRho: W_REF.oneMinusRho,
      LtauSq: W_REF.Ltau2,
    },
    minimizers: { normDominated: MIN_NORM.name, massDominated: MIN_MASS.name },
  },
  openResiduals: [
    'the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family',
    'the curvature ceiling D retained by the window',
    'the paper phase curvature normalization (sibling Theorem D residual)',
    'residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|',
    'NEW: far-coefficient reduction at the pinned near constant 2 - Corollary P discards ||W_minus||^2 >= 0 and recovering part of it needs a lower bound on the alternating block sum; Theorem F constrains cNear only, so cFar = 8/(2 sigma - 1) at cNear = 2 is not known optimal; a bound in a genuinely different currency would also evade the floor',
  ],
  isRigorous: true,
  rigorScope:
    'Corollary P is the sibling Theorem S-prime specialized to J = 2 (conditional only on MAJ(sigma, theta)). Theorem F is unconditional given the model-family conventions: the witness family is exhibited explicitly and every constant is closed-form; the floor quantifies over the two-currency bound class with tail functionals T* <= T(2), which contains every sibling bound - bounds in other currencies are outside its scope, as recorded. The numerics cross-check the statements; they are not the claim.',
  promotesBound: false,
  verdict:
    'RIGOROUS terminal step for the near-band constant: split-gap optimization of the sibling Theorem S-prime attains near constant 2 at J = 2 (parity split - mod 2 uniquely annihilates the floorless gap-1 pairs), strictly below the Theorem N support-limit constant j0 = 3, and the NEW Theorem F matching floor (explicit two-packet witness at the minimal grid spacing, W12 shift bound, all constants closed-form) shows no two-currency aggregation bound can go below 2 - epsilon(p, theta), with epsilon -> 0 in the joint limit: the near constant is EXACTLY 2 and the sixth-continuation residual is resolved in both directions. The deliverable becomes min over J of { S(J), S-prime(J) }, measured minimizers S-prime(2) (norm-dominated) and S-prime(9) (mass-dominated). Remaining open: paper-packet envelope constants, window ceiling, phase normalization, the l2-to-pointwise step, and far-coefficient reduction at near constant 2. Changes no bound; NO QED; no refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_NCF_ASSERTIONS = [
  {
    id: 'imp95008-ncf-reference-floor-values',
    description:
      'the closed-form floor at the reference (p = 97, theta = 10) reproduces 1.857656739767721 at cFar = 8 and 1.899031642426087 at cFar = 4, both strictly inside (1.85, 2)',
    holds: () =>
      Math.abs(REF_FLOOR_CFAR8 - 1.857656739767721) < 1e-12 &&
      Math.abs(REF_FLOOR_CFAR4 - 1.899031642426087) < 1e-12 &&
      REF_FLOOR_CFAR8 > 1.85 &&
      REF_FLOOR_CFAR4 < 2,
  },
  {
    id: 'imp95008-ncf-w12-shift-bound',
    description:
      'the W12 shift bound ||phi_tau - phi||^2 <= tau^2 ||phi_prime||^2 holds numerically for s in {3, 11} and tau in {0.033, 0.2, 1.0} (fine-grid quadrature, truncation underestimates the lhs - safe direction)',
    holds: () =>
      [3, 11].every((s) =>
        [0.033, 0.2, 1.0].every((tau) => {
          const { numeric, bound } = shiftBoundNumeric(s, tau);
          return numeric <= bound;
        }),
      ),
  },
  {
    id: 'imp95008-ncf-witness-admissible',
    description:
      'the witness pair is admissible: d1 = (p+1)/(2p) and d2 = (p-1)/(2p) sit on the alias grid with integer h in [1, p-1] (k = 1), straddle D/2 into blocks 0 and 1, are exactly (1/p)-separated, and r1 is the smaller width',
    holds: () => {
      const w = witnessPair(97);
      return (
        Number.isInteger(w.h1) &&
        Number.isInteger(w.h2) &&
        w.h1 >= 1 &&
        w.h2 <= 96 &&
        Math.abs(1 - w.h1 / 97 - w.d1) < 1e-15 &&
        Math.abs(1 - w.h2 / 97 - w.d2) < 1e-15 &&
        w.d1 > 0.5 &&
        w.d1 <= 1 &&
        w.d2 > 0.25 &&
        w.d2 <= 0.5 &&
        Math.abs(w.d1 - w.d2 - 1 / 97) < 1e-15 &&
        w.r1 < w.r2
      );
    },
  },
  {
    id: 'imp95008-ncf-witness-correlation',
    description:
      'the measured witness correlation obeys the analytic lower bound: 1 - rho = 0.0466... <= L tau^2 = 0.0596... at the reference, with rho > 0.95 (the gap-1 pair is genuinely near-degenerate)',
    holds: () =>
      W_REF.shiftBoundOk && W_REF.rho > 0.95 && W_REF.oneMinusRho > 0.04 && W_REF.Ltau2 < 0.06,
  },
  {
    id: 'imp95008-ncf-floor-vs-upper-consistency',
    description:
      'no contradiction between the floor and the achieved bound on the SAME witness family: lhs = (1 + rho) A_curr >= (2 - L tau^2) A_curr (floor side) and lhs <= S-prime(2) rhs (upper side)',
    holds: () => W_REF.lhs >= W_REF.floorSide - 1e-12 && W_REF.upperConsistent,
  },
  {
    id: 'imp95008-ncf-floor-p-ladder',
    description:
      'the floor is increasing along the prime spacing ladder 97 -> 997 -> 9973 at theta = 10, cFar = 8 (smaller spacing tightens the witness)',
    holds: () => {
      const f97 = nearConstantFloor(97, 10, 8);
      const f997 = nearConstantFloor(997, 10, 8);
      const f9973 = nearConstantFloor(9973, 10, 8);
      return f97 < f997 && f997 < f9973 && f9973 < 2;
    },
  },
  {
    id: 'imp95008-ncf-joint-limit-sharpness',
    description:
      'joint limit (spacing -> 0 then theta -> infinity): the floor passes 1.9998 at (p, theta) = (9973, 20), 1.999999 at (99991, 30), 1.99999999 at (999983, 40), always < 2 - the near constant 2 is asymptotically sharp',
    holds: () =>
      nearConstantFloor(9973, 20, 8) > 1.9998 &&
      nearConstantFloor(99991, 30, 8) > 1.999999 &&
      nearConstantFloor(999983, 40, 8) > 1.99999999 &&
      nearConstantFloor(999983, 40, 8) < 2,
  },
  {
    id: 'imp95008-ncf-floor-not-monotone-in-theta',
    description:
      'honesty tripwire: at FIXED p = 97 the floor degrades for large theta (L tau^2 grows like s^2) and for small theta (fat tail): floor(97, 20) < floor(97, 10) and floor(97, 6) < 1.13 - the joint limit must take p -> infinity first',
    holds: () =>
      nearConstantFloor(97, 20, 8) < nearConstantFloor(97, 10, 8) &&
      nearConstantFloor(97, 6, 8) < 1.13,
  },
  {
    id: 'imp95008-ncf-parity-identity-exact',
    description:
      'the parity identity ||W||^2 + ||W_minus||^2 = 2 sum_{even index difference} <w_b, w_b2> holds to machine precision on both grid realizations (it is algebra, not analysis)',
    holds: () =>
      Math.abs(R_NORM.parityLhs - R_NORM.parityRhs) < 1e-9 * Math.abs(R_NORM.parityLhs) &&
      Math.abs(R_MASS.parityLhs - R_MASS.parityRhs) < 1e-9 * Math.abs(R_MASS.parityLhs),
  },
  {
    id: 'imp95008-ncf-landscape-minimizers',
    description:
      'measured minimizers of min over { S(J), S-prime(J) : J in [2, 16] }: S-prime(2) on the norm-dominated realization (theta = 10, one packet per block), S-prime(9) on the mass-dominated realization (theta = 2, full family); both realized bounds hold (lhs <= min rhs)',
    holds: () =>
      MIN_NORM.name === 'S-prime(2)' &&
      MIN_MASS.name === 'S-prime(9)' &&
      R_NORM.lhs <= MIN_NORM.rhs &&
      R_MASS.lhs <= MIN_MASS.rhs,
  },
  {
    id: 'imp95008-ncf-honesty-gate',
    description:
      'the verdict keeps the floor bracket and the min-over-J framing, records the far-coefficient residual and the currency-scope limitation, promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95008_NEAR_CONSTANT_FLOOR.promotesBound === false &&
      IMP95008_NEAR_CONSTANT_FLOOR.openResiduals.length === 5 &&
      /min over J/.test(IMP95008_NEAR_CONSTANT_FLOOR.verdict) &&
      /NO QED/.test(IMP95008_NEAR_CONSTANT_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP95008_NEAR_CONSTANT_FLOOR.verdict) &&
      /different currency/.test(IMP95008_NEAR_CONSTANT_FLOOR.openResiduals[4]) &&
      /MAJ/.test(IMP95008_NEAR_CONSTANT_FLOOR.corollaryP),
  },
];

for (const a of IMP95008_NCF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-near-constant-floor assertion failed: ${a.id}`);
  }
}

export default IMP95008_NEAR_CONSTANT_FLOOR;
