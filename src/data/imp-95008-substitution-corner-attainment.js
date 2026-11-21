/**
 * imp-95008 continuation (twentieth) - THEOREM CA (corner attainment) +
 * LEMMA EQ: the nineteenth continuation left exactly two named achieved-side
 * slacks: (a) the outer parity AM-GM factor 2 (terminal by the seventh
 * continuation Theorem F floor - not re-attacked here) and (b) "tightness of
 * the substitution point" - the suspicion that no admissible pair actually
 * sits at the substituted corner (V(b, j), rhoCap(j)), so the exact envelope
 * envE(b, j) = I(V(b, j), rhoCap(j)) might still overprice every real pair.
 * The imp-95016 referee bundle further noted that this label silently bundled
 * three distinct slacks: (b1) the per-pair corner substitution itself,
 * (b2) the intra-class block-mass AM-GM routing n_1 n_2 to masses, and
 * (b3) the sup_b routing of Omega. This module CLOSES (b1) in closed form,
 * in the NEGATIVE direction for the ceiling: the corner is attained.
 *
 * SETTING (identical to the sibling chain; reference conventions v = c =
 * D = 1, beta = 1/3, sigma = 1, theta = 10, s = sigma + theta = 11).
 * Packets a_d, centers u_d = v/d, widths r_d = c d^(-beta), dyadic blocks
 * b: d in (2^(-(b+1)), 2^(-b)]. A cell (b, j), j >= 2, is the set of
 * cross-block pairs d_1 in block b (near, larger d, SMALLER width),
 * d_2 in block b + j (far, smaller d, larger width). Pair parameters:
 *   T(d_1, d_2) = Delta/rMax = (v/c) d_2^beta (1/d_2 - 1/d_1) ,
 *   rho(d_1, d_2) = rMin/rMax = (d_2/d_1)^beta .
 * Lemma X (tenth): T > V(b, j) strictly. Lemma RHO (eighteenth):
 * rho < rhoCap(j) = 2^(-(j-1) beta) strictly. Theorem Y-EXACT (nineteenth)
 * substitutes the corner: per-pair toll n_1 n_2 envE(b, j),
 * envE(b, j) = I(V(b, j), rhoCap(j)), legal by Lemmas CC and RM.
 *
 * LEMMA EQ (envelope equality - the substituted quantity is a real
 * correlation, not just a bound). For envelope packets e_i(u) =
 * A_i (1 + |u - u_i|/r_i)^(-s) (MAJ with equality), the substitution
 * u = u_2 + rMax t gives EXACTLY
 *   integral e_1 e_2 = n_1 n_2 I(T, rho) ,  n_i = A_i sqrt(r_i),
 * using the symmetry of the I integrand under u -> T - u. So per-pair
 * sharpness of the roll-up toll is equivalent to attainment of the corner
 * by admissible pair PARAMETERS. (Cross-checked below by direct u-space
 * quadrature at three pairs, rel <= 1.5e-6.)
 *
 * THEOREM CA (corner attainment). Fix a cell (b, j), j >= 2.
 * (i) CORNER IDENTITY. T is strictly increasing in d_1 (dT/dd_1 =
 * (v/c) d_2^beta / d_1^2 > 0) and strictly decreasing in d_2 (dT/dd_2 =
 * (v/c) [(beta - 1) d_2^(beta-2) - beta d_2^(beta-1)/d_1] < 0 for
 * beta in (0, 1)). Hence the infimum of T over the cell sits at the corner
 * d_2 = 2^(-(b+j)) (attained - closed endpoint), d_1 -> 2^(-(b+1)) from
 * above (open endpoint), with value
 *   (v/c) 2^(-(b+j) beta) 2^(b+1) (2^(j-1) - 1)  =  V(b, j)
 * IDENTICALLY: expanding V(b, j) = 2^(b(1-beta)) gSharp(j) with
 * gSharp(j) = 2^beta (2^(j-1) - 1)/(Q 2^(j beta)) and Q =
 * (c/v) 2^(beta-1) at D = 1 gives the same exponent b(1-beta) + 1 - j beta
 * and the same factor (2^(j-1) - 1). So the Lemma X floor is the EXACT cell
 * infimum of the separation, approached but not attained (consistent with
 * the strictness of Lemma X).
 * (ii) SIMULTANEITY. Along the SAME corner sequence d_1 = 2^(-(b+1))(1+eps),
 * d_2 = 2^(-(b+j)), eps -> 0+, the width ratio rho = (d_2/d_1)^beta
 * increases to (2^(-(b+j)) 2^(b+1))^beta = 2^(-(j-1) beta) = rhoCap(j):
 * the separation floor and the width-ratio cap bind at the same parameter
 * corner - there is NO coupling between the two constraints that keeps
 * admissible pairs away from the substituted point.
 * (iii) SHARPNESS. For every pair in the cell, I(T, rho) <= envE(b, j) by
 * Lemma CC (T > V(b, j)) then Lemma RM (rho < rhoCap(j), legal since
 * V(b, j) >= V(0, 2) > Ystar(s)). Along the corner sequence, (T, rho) ->
 * (V(b, j), rhoCap(j)) and I is continuous there (dominated convergence;
 * rhoCap(j) > 0), so I -> envE(b, j) from below. Hence
 *   sup over admissible cell pairs of I(T, rho)  =  envE(b, j) ,
 * a supremum approached at linear rate in eps, not attained. QED.
 *
 * COROLLARY R1 (continuous family - residual (b1) closed NEGATIVELY).
 * In the continuous model family the per-pair substitution slack is ZERO:
 * the exact envelope toll n_1 n_2 envE(b, j) is the least possible per-pair
 * price - Lemma EQ exhibits admissible envelope-packet pairs whose TRUE
 * correlation comes within any prescribed factor of it. No ceiling
 * improvement is available at the per-pair step; equivalently, in the
 * imp-95019 decision rule the continuous-family actual-pair sup equals the
 * substituted corner (ratio 1 >= 0.95), so the 1.4044 non-parity headline
 * residual is WITNESS/AGGREGATION-side: it lives only in (b2) block-mass
 * AM-GM routing, (b3) sup_b routing, joint multi-cell non-attainment (one
 * configuration cannot sit at every cell corner at once), and the floor
 * witness class. This analytically resolves the question imp-95019 was
 * scheduled to scan, for the continuous family.
 *
 * COROLLARY R2 (fixed p = 97 - a quantified grid lever, NOT applied).
 * On the p = 97 alias grid d = 1 - h/p (k = 1, h in [1, 96]; the grid is
 * half-spacing offset so no block boundary 2^(-m) with odd numerator lands
 * on it), the corner of the dominant cell (0, 2) is unreachable: the
 * closest admissible pair is d_1 = 49/97 (h = 48, the least grid point
 * above 1/2) and d_2 = 24/97 (h = 73, the greatest grid point <= 1/4),
 * where by the same monotonicities the grid sup of I is attained:
 *   T_97 = 1.2945463076629353 (vs V(0,2) = 1.2599210498948732),
 *   rho_97 = 0.7882640503946059 (vs rhoCap(2) = 0.7937005259840998),
 *   I_97 = 3.237150144941225e-5 = 0.8258474234948617 x envE(0, 2).
 * At cell (2, 2): grid corner d_1 = 13/97 (h = 84), d_2 = 6/97 (h = 91),
 * I ratio 0.47384446409436176. So at FIXED p = 97 the per-pair envelope
 * retains a real, now-quantified slack (factor 1.2109 at the dominant cell,
 * growing with depth as the grid coarsens relative to the blocks) - a
 * fixed-97-lane-ONLY ceiling lever (substitute the grid-attained infima
 * V_97(b, j) in place of V(b, j)). In the imp-95019 dichotomy the measured
 * 0.8258 falls strictly BETWEEN the branches (>= 0.95 witness-side,
 * <= 0.70 direct ceiling drop): a partial grid drop is available on the
 * fixed-97 lane only. NOT applied here: all tracked brackets (headline
 * [0.096745062937484763, 0.2717408057586117], fixed-97 floor
 * 0.0012054673720820889) are UNTOUCHED - this module changes no bound.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) the corner identity was stress-tested
 * algebraically (exponent bookkeeping re-done from Q and gSharp) and
 * numerically (rel <= 5e-15 over b <= 60, j <= 60); (2) the claimed
 * monotonicities of T were checked on grids in both variables on four
 * cells including odd j and deep b - the inf is at the claimed corner, and
 * sampled interior pairs never dip below it; (3) the corner-sequence
 * convergence was checked at eps = 1e-1 .. 1e-4 on two cells: the gap to
 * envE decreases monotonically, scales linearly in eps (ratio ~0.10 per
 * decade), and stays strictly positive - sup approached, never attained,
 * exactly as Lemma X strictness requires; (4) Lemma EQ was stress-tested by
 * direct u-space quadrature of integral e_1 e_2 at three pairs including a
 * deep-block pair (rel <= 1.5e-6); (5) 300 deterministic pseudo-random
 * interior pairs per cell never exceed envE and never exceed the
 * eps = 1e-4 corner-sequence value - the corner dominates the interior;
 * (6) the fixed-97 argmax was found by EXHAUSTIVE enumeration of the
 * admissible grid pairs (48 x 12 and 12 x 3), not assumed from the
 * monotonicity argument, and lands exactly on the predicted grid corner;
 * (7) attempted refutation of R1 via the grid: the fifth/sixth model
 * conventions put packets ON the (1/p) alias grid, so one may object that
 * the continuous sup is unattainable in the gridded family - CORRECT, and
 * that is exactly Corollary R2: the theorem is stated for the continuous
 * family (the class in which Lemma X, Lemma RHO and the nineteenth ceiling
 * are derived and in which the p -> infinity paper limit lives), and the
 * fixed-p residual slack is quantified rather than hidden; (8) the
 * float-conditioning caveat of the nineteenth (~1e-8 relative on iExact)
 * is inherited and negligible against the measured 0.8258 and 0.4738
 * ratios; every iExact evaluation here has T >= 1.26, outside the recorded
 * small-T trap.
 *
 * WHAT REMAINS OPEN (refined ledger after this step): (a) the outer parity
 * AM-GM factor 2 - terminal per the seventh continuation floor, untouched;
 * (b1) per-pair substitution tightness - CLOSED by this module (zero slack,
 * continuous family; quantified 0.8258 grid slack on the fixed-97 lane
 * only); (b2) intra-class block-mass AM-GM routing and (b3) sup_b routing -
 * OPEN, now the only ceiling-side levers in the continuous family, jointly
 * bounded by the witness gap; joint multi-cell non-attainment is the
 * structural reason ceiling and floor need not meet; witness side
 * (multi-packet re-optimization, different grid geometries) unchanged.
 * Sibling residuals unchanged: paper-packet envelope constants, curvature
 * ceiling D, phase normalization, and the l2-to-pointwise passage to
 * |C_E,17|.
 *
 * The numerics below CROSS-CHECK the closed-form statements; they are not
 * the claim. Import-light (no heavy bundle). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── shared conventions (independent copy, identical to the sibling chain) ─────
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;
const THETA = 10;
const SS = SIGMA + THETA;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

const QREF = isolationQ(CC, VV, BETA, DD);

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

function gSharp(j) {
  return Math.pow(2, BETA) * gOld(j, QREF, BETA);
}

function cornerV(b, j) {
  return Math.pow(2, b * (1 - BETA)) * gSharp(j);
}

function rhoCap(j) {
  return Math.pow(2, -(j - 1) * BETA);
}

// ── Lemma PF closed form (independent copy of the nineteenth evaluation) ──────
function binom(n, k) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

function outerFolded(rho, bb, s) {
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(bb - rho, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(rho - bb, -(2 * s - k));
    sum += (ck * Math.pow(rho, s + 1 - k) + dk * Math.pow(rho, s) * Math.pow(bb, 1 - k)) / (k - 1);
  }
  const c1s = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(bb - rho, -(2 * s - 1)) * Math.pow(rho, s);
  return sum + (c1s === 0 ? 0 : c1s * Math.log(bb / rho));
}

function farFolded(rho, T, s) {
  const a = rho + T;
  const rs = Math.pow(rho, s);
  if (rs === 0) return 0;
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(1 - a, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(a - 1, -(2 * s - k));
    sum += (rs * (ck * Math.pow(a, 1 - k) + dk)) / (k - 1);
  }
  const c1 = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(1 - a, -(2 * s - 1));
  return sum + (c1 === 0 ? 0 : rs * c1 * Math.log(1 / a));
}

function middleFolded(rho, T, s) {
  const c = 1 + T;
  const rs = Math.pow(rho, s);
  let sum = 0;
  for (let k = 1; k <= s; k++) {
    const pk = binom(2 * s - k - 1, s - k) * Math.pow(rho + c, -(2 * s - k));
    if (pk === 0) continue;
    const Ja =
      k === 1
        ? rs === 0
          ? 0
          : rs * Math.log((T + rho) / rho)
        : (Math.pow(rho, s + 1 - k) - rs * Math.pow(T + rho, 1 - k)) / (k - 1);
    const Jc = k === 1 ? rs * Math.log(c) : (rs * (1 - Math.pow(c, 1 - k))) / (k - 1);
    sum += pk * (Ja + Jc);
  }
  return sum;
}

function iExact(T, rho, s) {
  return Math.pow(rho, -0.5) * (outerFolded(rho, 1 + T, s) + middleFolded(rho, T, s) + farFolded(rho, T, s));
}

// ── cell geometry (v = c = 1 reference) ───────────────────────────────────────
function pairT(d1, d2) {
  return Math.pow(d2, BETA) * (1 / d2 - 1 / d1);
}

function pairRho(d1, d2) {
  return Math.pow(d2 / d1, BETA);
}

function cornerClosedForm(b, j) {
  return Math.pow(2, -(b + j) * BETA) * Math.pow(2, b + 1) * (Math.pow(2, j - 1) - 1);
}

// direct u-space quadrature of the envelope-pair correlation (Lemma EQ check)
function envPairQuad(d1, d2, N, pad) {
  const u1 = 1 / d1;
  const u2 = 1 / d2;
  const r1 = Math.pow(d1, -BETA);
  const r2 = Math.pow(d2, -BETA);
  const A1 = 1 / Math.sqrt(r1);
  const A2 = 1 / Math.sqrt(r2);
  const rMax = Math.max(r1, r2);
  const lo = Math.min(u1, u2) - pad * rMax;
  const hi = Math.max(u1, u2) + pad * rMax;
  const h = (hi - lo) / N;
  let acc = 0;
  for (let i = 0; i < N; i++) {
    const u = lo + (i + 0.5) * h;
    acc += A1 * Math.pow(1 + Math.abs(u - u1) / r1, -SS) * A2 * Math.pow(1 + Math.abs(u - u2) / r2, -SS);
  }
  return acc * h;
}

// deterministic LCG for reproducible interior sampling
function makeLcg(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0;
    return (state + 0.5) / 4294967296;
  };
}

// p = 97 alias grid points d = 1 - h/97 inside (lo, hi]
const P97 = 97;
function gridPoints(lo, hi) {
  const out = [];
  for (let h = 1; h <= P97 - 1; h++) {
    const d = 1 - h / P97;
    if (d > lo && d <= hi) out.push([h, d]);
  }
  return out;
}

function gridCellSup(b, j) {
  const near = gridPoints(Math.pow(2, -(b + 1)), Math.pow(2, -b));
  const far = gridPoints(Math.pow(2, -(b + j + 1)), Math.pow(2, -(b + j)));
  let best = -1;
  let bh1 = 0;
  let bh2 = 0;
  for (const [h1, d1] of near) {
    for (const [h2, d2] of far) {
      const val = iExact(pairT(d1, d2), pairRho(d1, d2), SS);
      if (val > best) {
        best = val;
        bh1 = h1;
        bh2 = h2;
      }
    }
  }
  return { best, h1: bh1, h2: bh2, nearCount: near.length, farCount: far.length };
}

// ── baked literals ────────────────────────────────────────────────────────────
const ENV02 = 3.9197920255561178e-5; // nineteenth-continuation corner literal
const ENV22 = 3.398047003867178e-8;
const V02 = 1.2599210498948732; // 2^(1/3)
const T97_02 = 1.2945463076629353;
const RHO97_02 = 0.7882640503946059;
const I97_02 = 3.237150144941225e-5;
const RATIO97_02 = 0.8258474234948617;
const T97_22 = 3.442719797410821;
const RHO97_22 = 0.7728038897744274;
const I97_22 = 1.6101457615148946e-8;
const RATIO97_22 = 0.47384446409436176;
const HEAD_FLOOR = 0.096745062937484763; // carried, untouched
const CFAR_19 = 0.2717408057586117; // carried, untouched
const F97_FLOOR = 0.0012054673720820889; // carried, untouched

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95008_SUBSTITUTION_CORNER_ATTAINMENT = {
  ticket:
    "imp-95008 (continuation twenty: Theorem CA corner attainment - the per-pair substitution point (V(b,j), rhoCap(j)) is the exact closure point of admissible pairs, so the nineteenth residual (b1) per-pair substitution tightness is CLOSED with zero slack in the continuous family; the fixed-97 grid slack is quantified instead of suspected)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; executes the per-pair half of the nineteenth residual (b) and analytically resolves the imp-95019 audit question.",
  lemmaEQ:
    "For envelope packets (MAJ with equality), integral e_1 e_2 = n_1 n_2 I(T, rho) EXACTLY (substitution u = u_2 + rMax t plus the u -> T - u symmetry of the I integrand): the substituted envelope is a real correlation of admissible packets, not just an upper bound.",
  theoremCA:
    "(i) T(d_1, d_2) = (v/c) d_2^beta (1/d_2 - 1/d_1) is strictly increasing in d_1 and strictly decreasing in d_2 on the cell, so inf T sits at (d_1 -> 2^(-(b+1))+, d_2 = 2^(-(b+j))) with value (v/c) 2^(-(b+j)beta) 2^(b+1) (2^(j-1)-1) = V(b,j) IDENTICALLY - the Lemma X floor is the exact cell infimum; (ii) along the same corner sequence rho increases to rhoCap(j) - both constraints bind simultaneously; (iii) with Lemmas CC and RM for the upper direction and continuity of I at the corner for the lower, sup over admissible cell pairs of I(T, rho) = envE(b, j), approached at linear rate in eps, not attained.",
  corollaryR1:
    "Continuous family: per-pair substitution slack is ZERO - the exact envelope toll n_1 n_2 envE(b,j) is the least possible per-pair price, so residual (b1) is closed NEGATIVELY for the ceiling and the 1.4044 non-parity headline residual is witness/aggregation-side ((b2) block-mass AM-GM routing, (b3) sup_b routing, joint multi-cell non-attainment, floor witness class). In the imp-95019 decision rule the continuous-family ratio is 1 (>= 0.95 branch: redirect to witness lift).",
  corollaryR2:
    "Fixed p = 97 alias grid (k = 1, h in [1,96]): the dominant-cell (0,2) grid corner is d_1 = 49/97, d_2 = 24/97 with T_97 = 1.2945463076629353, rho_97 = 0.7882640503946059, I_97 = 3.237150144941225e-5 = 0.8258474234948617 x envE(0,2) (exhaustively enumerated, argmax at the predicted corner); cell (2,2) ratio 0.47384446409436176. The measured 0.8258 falls strictly between the imp-95019 branches (0.70, 0.95): a partial grid-corner ceiling drop exists on the fixed-97 lane ONLY, quantified here but NOT applied - all tracked brackets untouched.",
  reference: {
    parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA, theta: THETA, p: P97 },
    cornerLiterals: { V02, env02: ENV02, env22: ENV22 },
    grid97DominantCell: { h1: 48, d1: "49/97", h2: 73, d2: "24/97", T: T97_02, rho: RHO97_02, I: I97_02, ratio: RATIO97_02 },
    grid97Cell22: { h1: 84, d1: "13/97", h2: 91, d2: "6/97", T: T97_22, rho: RHO97_22, I: I97_22, ratio: RATIO97_22 },
    carriedBracketsUntouched: { headline: { lo: HEAD_FLOOR, hi: CFAR_19 }, fixed97Floor: F97_FLOOR },
    note: "classification/routing step: floors and ceilings UNTOUCHED; the fixed-97 grid lever is quantified, not applied",
  },
  openResiduals: [
    "(a) outer parity AM-GM factor 2 - terminal per the seventh-continuation Theorem F floor, untouched here",
    "(b2) intra-class block-mass AM-GM routing and (b3) sup_b routing - now the only ceiling-side levers in the continuous family; joint multi-cell non-attainment is the structural ceiling-floor separation",
    "fixed-97 lane: the quantified grid-corner lever (0.8258 at the dominant cell, 0.4738 at (2,2)) is available but unapplied - applying it needs grid-attained infima V_97(b,j) for EVERY cell plus empty-block bookkeeping",
    "witness side unchanged: multi-packet re-optimization, different grid geometries",
    "sibling residuals unchanged: paper-packet envelope constants, curvature ceiling D, phase normalization, l2-to-pointwise passage to |C_E,17|",
  ],
  isRigorous: true,
  rigorScope:
    "Theorem CA(i) is two one-variable monotonicity derivatives plus an exponent identity verified algebraically (both sides equal (v/c) 2^(b(1-beta)+1-j beta) (2^(j-1)-1)); CA(ii) is the same endpoint evaluation for rho; CA(iii) consumes the nineteenth Lemmas CC and RM for the upper direction (legal: V(b,j) >= V(0,2) > Ystar(s)) and dominated-convergence continuity of I for the lower; Lemma EQ is a change of variables. Corollary R2 is an exhaustive finite enumeration over the p = 97 grid, exact by inspection up to the inherited ~1e-8 iExact float rounding (negligible against the 0.8258 and 0.4738 ratios; every evaluation has T >= 1.26, outside the recorded small-T conditioning trap). The theorem closes only the PER-PAIR substitution slack (b1); the aggregation slacks (b2), (b3) and the parity factor 2 are untouched and named. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step (classification/no-go, no bracket move): NEW Theorem CA proves the Lemma X separation floor V(b,j) is the EXACT infimum of the pair separation over each cell and that it is approached at the SAME parameter corner where the Lemma RHO width-ratio cap binds, so sup over admissible pairs of the exact pair correlation equals envE(b,j) - the substituted corner is attained in closure and the nineteenth residual (b1) per-pair substitution tightness is CLOSED with zero slack in the continuous family (no ceiling improvement exists at the per-pair step; the 1.4044 non-parity headline residual is witness/aggregation-side). NEW Corollary R2 quantifies the fixed-97 grid slack the continuous statement hides: exhaustive enumeration puts the p = 97 dominant-cell sup at 0.8258474234948617 x envE(0,2) (grid corner 49/97, 24/97), strictly between the imp-95019 branches, so a partial grid-corner ceiling drop exists on the fixed-97 lane only - quantified, NOT applied. All tracked brackets untouched (headline [0.096745062937484763, 0.2717408057586117], fixed-97 floor 0.0012054673720820889). Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_SCA_ASSERTIONS = [
  {
    id: "imp95008-sca-corner-identity",
    description:
      "Theorem CA(i) exponent identity: (v/c) 2^(-(b+j)beta) 2^(b+1) (2^(j-1)-1) equals cornerV(b,j) = 2^(b(1-beta)) gSharp(j) to rel 1e-12 for every b <= 60, j <= 60 (measured 5e-15), and V(0,2) = 2^(1/3) to rel 1e-14",
    holds: () => {
      for (let b = 0; b <= 60; b++) {
        for (let j = 2; j <= 60; j++) {
          const cf = cornerClosedForm(b, j);
          if (!(Math.abs(cf - cornerV(b, j)) <= 1e-12 * cornerV(b, j))) return false;
        }
      }
      return Math.abs(cornerV(0, 2) - Math.pow(2, 1 / 3)) <= 1e-14 * Math.pow(2, 1 / 3);
    },
  },
  {
    id: "imp95008-sca-cell-monotonicity",
    description:
      "T is strictly increasing in d_1 and strictly decreasing in d_2 on sampled grids over four cells including odd j and deep b ((0,2),(1,3),(2,2),(5,4)); T at the corner (d_1 = lo(1+1e-9), d_2 = hi) matches V(b,j) to rel 1e-8; 200 interior samples per cell never dip below V(b,j)",
    holds: () => {
      for (const [b, j] of [[0, 2], [1, 3], [2, 2], [5, 4]]) {
        const lo1 = Math.pow(2, -(b + 1));
        const hi1 = Math.pow(2, -b);
        const lo2 = Math.pow(2, -(b + j + 1));
        const hi2 = Math.pow(2, -(b + j));
        let prev = -Infinity;
        for (let i = 1; i <= 100; i++) {
          const d1 = lo1 + (i / 100) * (hi1 - lo1);
          const t = pairT(d1, hi2);
          if (!(t > prev)) return false;
          prev = t;
        }
        prev = Infinity;
        for (let i = 1; i <= 100; i++) {
          const d2 = lo2 + (i / 100) * (hi2 - lo2);
          const t = pairT(lo1 * (1 + 1e-4), d2);
          if (!(t < prev)) return false;
          prev = t;
        }
        const tCorner = pairT(lo1 * (1 + 1e-9), hi2);
        if (!(Math.abs(tCorner - cornerV(b, j)) <= 1e-8 * cornerV(b, j))) return false;
        const rand = makeLcg(20260902 + b * 100 + j);
        for (let k = 0; k < 200; k++) {
          const d1 = lo1 + rand() * (hi1 - lo1);
          const d2 = lo2 + rand() * (hi2 - lo2);
          if (!(pairT(d1, d2) >= cornerV(b, j) * (1 - 1e-12))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95008-sca-rho-simultaneity",
    description:
      "Theorem CA(ii): along the corner sequence d_1 = lo(1+eps), d_2 = hi, rho increases to rhoCap(j) (eps in {1e-2, 1e-4, 1e-6}, final rel gap <= 1e-5) and stays strictly below it for every sampled interior d_1 - the two constraints bind at the same corner",
    holds: () => {
      for (const [b, j] of [[0, 2], [2, 2], [1, 3]]) {
        const lo1 = Math.pow(2, -(b + 1));
        const hi2 = Math.pow(2, -(b + j));
        let prev = 0;
        for (const eps of [1e-2, 1e-4, 1e-6]) {
          const r = pairRho(lo1 * (1 + eps), hi2);
          if (!(r > prev && r < rhoCap(j))) return false;
          prev = r;
        }
        if (!(Math.abs(prev - rhoCap(j)) <= 1e-5 * rhoCap(j))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-sca-envelope-equality",
    description:
      "Lemma EQ: direct u-space quadrature of integral e_1 e_2 for unit-currency envelope packets matches the closed form iExact(T, rho) to rel 1e-5 at three pairs including a deep-block pair (measured <= 1.5e-6)",
    holds: () => {
      for (const [d1, d2] of [[0.55, 0.24], [0.51, 0.25], [0.14, 0.06]]) {
        const q = envPairQuad(d1, d2, 400000, 80);
        const e = iExact(pairT(d1, d2), pairRho(d1, d2), SS);
        if (!(Math.abs(q - e) <= 1e-5 * Math.abs(e))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-sca-nineteenth-reproduction",
    description:
      "independent code path reproduces the nineteenth corner literal envE(0,2) = 3.9197920255561178e-5 (rel 1e-12) before any ratio is quoted against it",
    holds: () => {
      const e = iExact(cornerV(0, 2), rhoCap(2), SS);
      return Math.abs(e - ENV02) <= 1e-12 * ENV02 && Math.abs(iExact(cornerV(2, 2), rhoCap(2), SS) - ENV22) <= 1e-12 * ENV22;
    },
  },
  {
    id: "imp95008-sca-corner-sequence",
    description:
      "Theorem CA(iii): along the corner sequence the gap envE - I decreases monotonically (eps = 1e-1 .. 1e-4), stays strictly positive (sup approached, never attained), reaches rel <= 1.2e-3 at eps = 1e-4, and scales linearly (per-decade ratio in [0.05, 0.15], measured ~0.10) on both cells (0,2) and (2,2)",
    holds: () => {
      for (const [b, j] of [[0, 2], [2, 2]]) {
        const lo1 = Math.pow(2, -(b + 1));
        const hi2 = Math.pow(2, -(b + j));
        const env = iExact(cornerV(b, j), rhoCap(j), SS);
        const gaps = [];
        for (const eps of [1e-1, 1e-2, 1e-3, 1e-4]) {
          const d1 = lo1 * (1 + eps);
          const val = iExact(pairT(d1, hi2), pairRho(d1, hi2), SS);
          if (!(val < env)) return false;
          gaps.push((env - val) / env);
        }
        for (let i = 1; i < gaps.length; i++) {
          if (!(gaps[i] < gaps[i - 1])) return false;
        }
        if (!(gaps[3] <= 1.2e-3)) return false;
        const decade = gaps[3] / gaps[2];
        if (!(decade >= 0.05 && decade <= 0.15)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-sca-interior-dominance",
    description:
      "300 deterministic pseudo-random interior pairs per cell never exceed envE(b,j) (Lemmas CC + RM upper direction) and never exceed the eps = 1e-4 corner-sequence value - the corner dominates the interior",
    holds: () => {
      for (const [b, j] of [[0, 2], [2, 2]]) {
        const lo1 = Math.pow(2, -(b + 1));
        const hi1 = Math.pow(2, -b);
        const lo2 = Math.pow(2, -(b + j + 1));
        const hi2 = Math.pow(2, -(b + j));
        const env = iExact(cornerV(b, j), rhoCap(j), SS);
        const corner = iExact(pairT(lo1 * (1 + 1e-4), hi2), pairRho(lo1 * (1 + 1e-4), hi2), SS);
        const rand = makeLcg(31356 + b * 10 + j);
        for (let k = 0; k < 300; k++) {
          const d1 = lo1 + rand() * (hi1 - lo1);
          const d2 = lo2 + rand() * (hi2 - lo2);
          const val = iExact(pairT(d1, d2), pairRho(d1, d2), SS);
          if (!(val <= env * (1 + 1e-12))) return false;
          if (!(val <= corner * (1 + 1e-12))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95008-sca-fixed97-grid",
    description:
      "Corollary R2 by exhaustive enumeration: p = 97 cell (0,2) has 48 x 12 admissible grid pairs with argmax at (h1, h2) = (48, 73) i.e. (49/97, 24/97), reproducing T = 1.2945463076629353, rho = 0.7882640503946059, I = 3.237150144941225e-5, ratio 0.8258474234948617 (rel 1e-12), strictly between the imp-95019 branches 0.70 and 0.95; cell (2,2) argmax (84, 91), ratio 0.47384446409436176",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      const g02 = gridCellSup(0, 2);
      if (!(g02.nearCount === 48 && g02.farCount === 12 && g02.h1 === 48 && g02.h2 === 73)) return false;
      const d1 = 49 / 97;
      const d2 = 24 / 97;
      if (!rel(pairT(d1, d2), T97_02) || !rel(pairRho(d1, d2), RHO97_02)) return false;
      if (!rel(g02.best, I97_02) || !rel(g02.best / iExact(cornerV(0, 2), rhoCap(2), SS), RATIO97_02)) return false;
      if (!(RATIO97_02 > 0.7 && RATIO97_02 < 0.95)) return false;
      const g22 = gridCellSup(2, 2);
      if (!(g22.h1 === 84 && g22.h2 === 91)) return false;
      if (!rel(pairT(13 / 97, 6 / 97), T97_22) || !rel(pairRho(13 / 97, 6 / 97), RHO97_22)) return false;
      if (!rel(g22.best, I97_22)) return false;
      return rel(g22.best / iExact(cornerV(2, 2), rhoCap(2), SS), RATIO97_22);
    },
  },
  {
    id: "imp95008-sca-honesty-gate",
    description:
      "the verdict states the step as classification/no-go with NO bracket move (carried headline and fixed-97 literals untouched), closes only the per-pair slack (b1), names the surviving aggregation slacks and the unapplied fixed-97 lever, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.promotesBound === false &&
      IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.openResiduals.length === 5 &&
      /NO QED/.test(IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.verdict) &&
      /no bracket move/.test(IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.verdict) &&
      /witness\/aggregation-side/.test(IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.verdict) &&
      /NOT applied/.test(IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.verdict) &&
      /brackets untouched/.test(IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.verdict) &&
      /terminal per the seventh/.test(IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.openResiduals[0]) &&
      HEAD_FLOOR < CFAR_19 &&
      F97_FLOOR < CFAR_19,
  },
];

for (const a of IMP95008_SCA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-substitution-corner-attainment assertion failed: ${a.id}`);
  }
}

export default IMP95008_SUBSTITUTION_CORNER_ATTAINMENT;
