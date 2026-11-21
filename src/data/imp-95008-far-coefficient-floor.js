/**
 * imp-95008 continuation (eighth) - THEOREM K: the FAR coefficient has a
 * floor at the pinned near constant 2. The seventh continuation
 * (imp-95008-near-constant-floor.js) terminated the near-band line at the
 * exact constant 2 and left the NEW residual: "far-coefficient reduction at
 * the pinned near constant 2 - Theorem F constrains cNear only, so
 * cFar = 8/(2 sigma - 1) at cNear = 2 is not known to be optimal". This
 * module answers the ZERO question in that residual: can the far currency
 * be dropped entirely (cFar = 0) at cNear = 2? NO - in the spacing-uniform
 * bound class (the same class in which the seventh continuation sharpness
 * "near constant EXACTLY 2" lives, since its Theorem F floor reaches 2 only
 * through p -> infinity), the far coefficient has an explicit positive
 * floor. The corner (cNear, cFar) = (2, 0) is INFEASIBLE.
 *
 * THEOREM K (far-coefficient floor via a 4-packet bridge witness). Fix the
 * model family conventions of the fifth/sixth/seventh continuations
 * (packets on the (1/p)-separated alias grid d = k - h/p in (0, D], centers
 * u = v/d, envelope widths r_d = c d^(-beta), dyadic curvature blocks
 * b: d in (2^(-b-1) D, 2^(-b) D], hypothesis MAJ(sigma, theta) with
 * s = sigma + theta, currencies A_curr = sum_b ||w_b||^2 and
 * M = sum_b nTilde_b^2, nTilde_b = sum of A_d sqrt(r_d) over the packets of
 * block b). Let cNear <= 2, cFar >= 0, and let T* be any tail functional
 * with T* <= T(2) = sum_{j >= 2} (1 + G(j))^(-theta). If the bound
 *   || sum_b w_b ||^2 <= cNear A_curr + cFar T* M
 * holds for ALL packet families satisfying MAJ(sigma, theta) on the
 * (1/p)-grid (odd p), then
 *   cFar >= F(p, theta) := E(p, theta) / ( T(2) M(p) ),
 * where E and M are the fully closed-form witness quantities below. F is
 * positive for all sufficiently large p (measured threshold at theta = 10:
 * between p = 103001 and p = 104001), and in the spacing limit
 *   E(p, theta) -> E_inf = (4 / lambda_inf) e^(-2 lambda_inf) (1 + 2 lambda_inf),
 *   lambda_inf = s 2^(-beta),   M -> M_inf = 2^beta + (2^(beta/2) + 2^beta)^2 + 2^(2 beta),
 * so any bound with cNear <= 2 that is UNIFORM in the grid spacing has
 *   cFar >= sup_p F(p, theta) >= F(999983, 10) = 2.609404585369758e-5
 * at the reference (sigma = 1, beta = 1/3, c = v = D = 1, theta = 10).
 *
 * WITNESS (all constants closed-form). Four packets, one bridge cell:
 *   q1: d_1 = (p+1)/(2p)  (k = 1, h = (p-1)/2)  in block 0, u_1 = 2p/(p+1);
 *   q2: d_2 = (p-1)/(2p)  (k = 1, h = (p+1)/2)  in block 1, u_2 = 2p/(p-1);
 *   q3: d_3 = 1 - h_3/p, h_3 = ceil(3p/4) - 1   in block 1, d_3 in (1/4, 1/4 + 1/p);
 *   q4: d_4 = d_3 - 1/p                          in block 2, d_4 in (1/4 - 1/p, 1/4].
 * q1/q2 is the Theorem F near-degenerate pair straddling the block-0/1
 * boundary at the minimal grid spacing (u ~ 2); q3/q4 is its mirror at the
 * block-1/2 boundary (u ~ 4); the two pairs BRIDGE the block gap 2. Blocks:
 * w_0 = a_1, w_1 = a_2 + a_3, w_2 = a_4. All four packets take the COMMON
 * exponential profile a_i(u) = A0 exp(-lambda |u - u_i|) with
 * lambda = s / r_1 and r_1 = min width (d_1 is the largest denominator, so
 * r_1 = c d_1^(-beta) is the smallest width). MAJ legality is EXACT, not
 * asymptotic: (1 + z) e^(-z) <= 1 for z >= 0 (equality at 0, derivative
 * -z e^(-z) <= 0) gives e^(-z) <= (1 + z)^(-1), hence
 * e^(-s t / r_1) <= (1 + t/r_1)^(-s) <= (1 + t/r_i)^(-s) for every
 * r_i >= r_1: each packet sits under its own envelope with constant A0.
 *
 * EXACT CORRELATIONS. For g(x) = e^(-lambda |x|) the autocorrelation is
 * closed-form by the three-region split (x < 0, 0 < x < tau, x > tau):
 *   integral of e^(-lambda |x|) e^(-lambda |x - tau|) dx
 *     = e^(-lambda tau) ( tau + 1/lambda ),   tau >= 0,
 * and ||g||^2 = 1/lambda, so the normalized correlation is EXACTLY
 *   rho(tau) = f(lambda tau),   f(z) = e^(-z) (1 + z),
 * strictly decreasing (f prime = -z e^(-z)). No inequality enters E at all:
 * with tau_ij = |u_i - u_j| (the centers are ordered u_1 < u_2 < u_3 < u_4),
 *   lhs  = || a_1 + a_2 + a_3 + a_4 ||^2
 *        = (1/lambda) [ 4 + 2 (rho_12 + rho_13 + rho_14 + rho_23 + rho_24 + rho_34) ],
 *   A_curr = ||w_0||^2 + ||w_1||^2 + ||w_2||^2 = (1/lambda) [ 4 + 2 rho_23 ],
 *   M    = r_1 + ( sqrt(r_2) + sqrt(r_3) )^2 + r_4,
 *   E := lhs - 2 A_curr
 *      = (2/lambda) [ (rho_12 - 1) + (rho_34 - 1)
 *                     + rho_13 + rho_14 + rho_24 - rho_23 ].
 * The within-block-1 cross term rho_23 is the structural parasite: it
 * enters A_curr once (hence 2 A_curr twice) but lhs only once, net -rho_23.
 * The witness survives it because the OTHER three bridges rho_13, rho_14,
 * rho_24 all converge to the SAME limit value f(2 lambda_inf) as rho_23
 * (all four separations -> 2), so the bridge net tends to
 * +2 f(2 lambda_inf) > 0 while the near-pair deficits vanish:
 * 1 - rho_12 <= (lambda tau_12)^2 / 2 = O(1/p^2) (from
 * e^(-x)(1+x) >= 1 - x^2/2 on x >= 0, by integrating
 * d/dx [e^(-x)(1+x)] = -x e^(-x) >= -x), and likewise for rho_34. Hence
 * E -> (4/lambda_inf) f(2 lambda_inf) > 0.
 *
 * ASSEMBLY. Validity of the bound on the witness gives
 * cFar T* M >= lhs - cNear A_curr >= lhs - 2 A_curr = E (using cNear <= 2,
 * A_curr > 0), and T* <= T(2) with cFar >= 0 gives cFar T(2) M >= E, i.e.
 * cFar >= E / (T(2) M) whenever E > 0. QED (of the floor; E, M, T(2) all
 * closed-form; the p -> infinity limit statement uses only the two
 * elementary inequalities recorded above).
 *
 * CONSEQUENCE - THE CORNER IS CLOSED, THE BRACKET IS OPEN. At the reference
 * family (sigma = 1, beta = 1/3, c = v = D = 1):
 *   theta = 10: cFar >= F(999983, 10) = 2.609404585369758e-5
 *               (limit F_inf = 2.6381049648580098e-5);
 *               achieved cFar = 8/(2 sigma - 1) = 8: gap 3.066e5;
 *   theta = 2:  cFar >= F_inf(2) = 0.024574312039374043;
 *               achieved 8: gap 325.5 - the floor is much stronger at
 *               small theta (weaker decorrelation makes the bridge fatter
 *               faster than the tail T(2) grows).
 * So the far currency is STRUCTURALLY NECESSARY at the terminal near
 * constant 2, and the seventh-continuation residual sharpens from
 * "cFar = 8/(2 sigma - 1) not known optimal" to the two-sided bracket
 *   cFar in [ F, 8/(2 sigma - 1) ]   (spacing-uniform class, per theta).
 * General-cNear trade-off line (same witness, same algebra): any valid
 * bound satisfies cFar >= ( E + (2 - cNear) A_curr ) / ( T(2) M ) at every
 * p - a line in the (cNear, cFar) plane complementing the Theorem F line.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) coefficient audit of the parasite
 * rho_23 (enters with net -1) was done twice and is asserted against direct
 * quadrature of the full 4-packet Gram matrix at p = 997 and p = 97
 * (closed-form E matches quadrature E to ~1e-6 relative); (2) fixed-p
 * honesty: E(97, 10) = -0.1062 < 0 - the witness is BLIND at the paper
 * reference prime; the floor lives in the spacing-uniform class, and the
 * fixed-p = 97 far floor remains OPEN (recorded as residual, not hidden);
 * (3) cancellation audit: at p = 999983 the bridge net is ~9.6e-7 while
 * the near-pair deficits are ~1e-8 and double-precision absolute error
 * near 1 is ~1e-16 - nine orders of headroom, plus the independent
 * quadrature cross-check; (4) attempted refutation via the tail
 * functional: the floor divides by the LARGEST tail T(2) >= T*, so it is
 * conservative for every sibling member (T(J), T_J^arith are sub-sums);
 * (5) attempted refutation via Corollary P itself: the achieved bound on
 * the SAME witness requires E <= 8 T_even M - holds with ~3e5 slack, floor
 * and ceiling consistent; (6) scope caveat inherited from Theorem F: a
 * bound in a genuinely different currency (e.g. support counts) evades
 * both the floor and the ceiling by leaving the two-currency class;
 * (7) profile legality is a proved inequality ((1+z)e^(-z) <= 1), not a
 * numerical observation - the sampled check below is a tripwire only;
 * (8) amplitude signs: the witness uses positive unit amplitudes, a
 * special case of the quantified family class, so no sign convention can
 * invalidate it.
 *
 * WHAT REMAINS OPEN (sibling residuals unchanged): the packet-envelope
 * constants (c, beta, sigma, theta, A_d) for the PAPER packets; the
 * curvature ceiling D retained by the window; the paper phase curvature
 * normalization; residual (c), the l2-to-pointwise passage to |C_E,17|.
 * REFINED residual (replaces "cFar not known optimal"): CLOSE THE FAR
 * BRACKET [F, 8/(2 sigma - 1)] - either a sharper witness (multi-boundary
 * bridge chains, correlated amplitudes across more than two boundaries)
 * raising the floor, or a sharper aggregation (recovering part of the
 * discarded ||W_minus||^2) lowering the achieved coefficient; and the
 * FIXED-p far floor (the p = 97 witness is blind: E(97, 10) < 0).
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

function gapRatioFloor(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

// T(2) = sum_{j >= 2} (1 + G(j))^(-theta); sibling pow-overflow guard kept
function tailSDirect(J, Q, beta, theta, jMax) {
  let s = 0;
  for (let j = J; j <= jMax; j++) {
    const g = gapRatioFloor(j, Q, beta);
    if (!Number.isFinite(g)) break;
    s += Math.pow(1 + g, -theta);
  }
  return s;
}

// arithmetic tail T_J^arith = sum_{m >= 1} (1 + G(mJ))^(-theta)
function tailArithDirect(J, Q, beta, theta, mMax) {
  let s = 0;
  for (let m = 1; m <= mMax; m++) {
    const g = gapRatioFloor(m * J, Q, beta);
    if (!Number.isFinite(g)) break;
    s += Math.pow(1 + g, -theta);
  }
  return s;
}

// exact normalized autocorrelation of the two-sided exponential at shift
// tau: rho = f(lambda tau), f(z) = e^(-z)(1 + z)
function fCorr(z) {
  return Math.exp(-z) * (1 + z);
}

// ── THEOREM K witness: two boundary pairs bridging block gap 2 ───────────────
function bridgeWitness(p) {
  const d1 = (p + 1) / (2 * p);
  const d2 = (p - 1) / (2 * p);
  const h3 = Math.ceil((3 * p) / 4) - 1;
  const d3 = 1 - h3 / p;
  const d4 = d3 - 1 / p;
  const d = [d1, d2, d3, d4];
  const u = d.map((x) => VV / x);
  const r = d.map((x) => CC * Math.pow(x, -BETA));
  return { d, u, r, h1: (p - 1) / 2, h2: (p + 1) / 2, h3, h4: h3 + 1 };
}

// exact closed-form excess E = lhs - 2 A_curr, plus the currencies
function bridgeExcess(p, theta) {
  const s = SIGMA + theta;
  const w = bridgeWitness(p);
  const rMin = Math.min(...w.r); // = r[0]: d1 is the largest denominator
  const lam = s / rMin;
  const t = (i, j) => Math.abs(w.u[j] - w.u[i]);
  const rho = {
    r12: fCorr(lam * t(0, 1)),
    r34: fCorr(lam * t(2, 3)),
    r13: fCorr(lam * t(0, 2)),
    r14: fCorr(lam * t(0, 3)),
    r23: fCorr(lam * t(1, 2)),
    r24: fCorr(lam * t(1, 3)),
  };
  const E =
    (2 / lam) * (rho.r12 + rho.r34 - 2 + rho.r13 + rho.r14 + rho.r24 - rho.r23);
  const A = (4 + 2 * rho.r23) / lam;
  const M =
    w.r[0] + Math.pow(Math.sqrt(w.r[1]) + Math.sqrt(w.r[2]), 2) + w.r[3];
  return { E, A, M, lam, rho, rMin, witness: w };
}

// the floor F(p, theta) = E / (T(2) M), and the general-cNear trade-off line
function farFloor(p, theta) {
  const Q = isolationQ(CC, VV, BETA, DD);
  const T2 = tailSDirect(2, Q, BETA, theta, 800);
  const { E, A, M } = bridgeExcess(p, theta);
  return { F: E / (T2 * M), E, A, M, T2 };
}

function farFloorLine(p, theta, cNear) {
  const { E, A, M, T2 } = farFloor(p, theta);
  return (E + (2 - cNear) * A) / (T2 * M);
}

// closed-form spacing limit: E_inf = (4/lambda_inf) f(2 lambda_inf),
// lambda_inf = s 2^(-beta), M_inf = 2^beta + (2^(beta/2) + 2^beta)^2 + 2^(2 beta)
function farFloorLimit(theta) {
  const s = SIGMA + theta;
  const lamInf = s * Math.pow(2, -BETA);
  const EInf = (4 / lamInf) * fCorr(2 * lamInf);
  const MInf =
    Math.pow(2, BETA) +
    Math.pow(Math.pow(2, BETA / 2) + Math.pow(2, BETA), 2) +
    Math.pow(2, 2 * BETA);
  const Q = isolationQ(CC, VV, BETA, DD);
  const T2 = tailSDirect(2, Q, BETA, theta, 800);
  return { FInf: EInf / (T2 * MInf), EInf, MInf, T2, lamInf };
}

// ── numeric cross-check: full 4-packet Gram matrix by direct quadrature ─────
function bridgeQuadCheck(p, theta) {
  const s = SIGMA + theta;
  const w = bridgeWitness(p);
  const rMin = Math.min(...w.r);
  const lam = s / rMin;
  const step = 1e-4;
  const lo = w.u[0] - 300 / lam;
  const hi = w.u[3] + 300 / lam;
  const n = Math.ceil((hi - lo) / step);
  const ip = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let k = 0; k < n; k++) {
    const x = lo + k * step;
    const vals = w.u.map((ui) => Math.exp(-lam * Math.abs(x - ui)));
    for (let i = 0; i < 4; i++) {
      for (let j = i; j < 4; j++) ip[i][j] += vals[i] * vals[j];
    }
  }
  for (let i = 0; i < 4; i++) {
    for (let j = i; j < 4; j++) ip[i][j] *= step;
  }
  const t = (i, j) => Math.abs(w.u[j] - w.u[i]);
  let maxRelGram = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = i; j < 4; j++) {
      const exact = i === j ? 1 / lam : (1 / lam) * fCorr(lam * t(i, j));
      const rel = Math.abs(ip[i][j] - exact) / exact;
      if (rel > maxRelGram) maxRelGram = rel;
    }
  }
  const lhs =
    ip[0][0] +
    ip[1][1] +
    ip[2][2] +
    ip[3][3] +
    2 * (ip[0][1] + ip[0][2] + ip[0][3] + ip[1][2] + ip[1][3] + ip[2][3]);
  const A = ip[0][0] + (ip[1][1] + ip[2][2] + 2 * ip[1][2]) + ip[3][3];
  const EQuad = lhs - 2 * A;
  const { E } = bridgeExcess(p, theta);
  return { maxRelGram, EQuad, E, relE: Math.abs(EQuad - E) / Math.abs(E) };
}

// ── reference evaluations ────────────────────────────────────────────────────
const REF_FLOOR = farFloor(999983, 10); // F = 2.609404585369758e-5
const REF_LIMIT_T10 = farFloorLimit(10); // FInf = 2.6381049648580098e-5
const REF_LIMIT_T2 = farFloorLimit(2); // FInf = 0.024574312039374043
const E_97 = bridgeExcess(97, 10).E; // -0.10621815365819198 (blind at fixed p)
const E_99991 = bridgeExcess(99991, 10).E;
const E_103001 = bridgeExcess(103001, 10).E;
const E_149993 = bridgeExcess(149993, 10).E;
const E_199999 = bridgeExcess(199999, 10).E;
const QUAD_997 = bridgeQuadCheck(997, 10);
const QUAD_97 = bridgeQuadCheck(97, 10);
const ACHIEVED_CFAR = 8 / (2 * SIGMA - 1);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_FAR_COEFFICIENT_FLOOR = {
  ticket: 'imp-95008 (continuation eight: the far coefficient has a floor)',
  source:
    'Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; resolves the ZERO question in the seventh-continuation residual "far-coefficient reduction at pinned near constant 2": the far currency cannot be dropped - (cNear, cFar) = (2, 0) is infeasible in the spacing-uniform two-currency class',
  theoremK:
    'FAR FLOOR: any bound ||sum w_b||^2 <= cNear A + cFar T* M valid over all MAJ(sigma, theta) families on the (1/p)-grid, with cNear <= 2 and T* <= T(2), has cFar >= F(p, theta) = E(p, theta)/(T(2) M(p)). Witness: TWO boundary-straddling near-degenerate pairs (the Theorem F pair d = (p+-1)/(2p) at u ~ 2, its mirror at d ~ 1/4, u ~ 4) bridging block gap 2, all four packets on the common exponential sub-envelope profile exp(-s|u - u_i|/r_1); every correlation is EXACT, rho(tau) = e^(-lambda tau)(1 + lambda tau), so E is closed-form with no inequality. Spacing limit: E -> (4/lambda_inf) e^(-2 lambda_inf)(1 + 2 lambda_inf) > 0, lambda_inf = s 2^(-beta).',
  corner:
    'The corner (cNear, cFar) = (2, 0) is INFEASIBLE in the spacing-uniform class: at the terminal near constant 2 (pinned by the seventh continuation) the far currency is structurally necessary. General trade-off line at every p: cFar >= (E + (2 - cNear) A)/(T(2) M).',
  bracket:
    'Reference (sigma = 1, beta = 1/3, c = v = D = 1): theta = 10: cFar in [2.609404585369758e-5, 8], gap 3.066e5; theta = 2: cFar in [0.024574312039374043, 8], gap 325.5 - the floor strengthens sharply at small theta. Floor threshold at theta = 10: E turns positive between p = 103001 and p = 104001; E(97, 10) < 0, so the fixed-p = 97 far floor remains OPEN (witness blind at the paper reference prime).',
  reference: {
    parameters: { p: 999983, v: VV, c: CC, beta: '1/3', D: DD, sigma: SIGMA, theta: 10 },
    floorF: REF_FLOOR.F,
    excessE: REF_FLOOR.E,
    tailT2: REF_FLOOR.T2,
    massM: REF_FLOOR.M,
    limitT10: { FInf: REF_LIMIT_T10.FInf, EInf: REF_LIMIT_T10.EInf, MInf: REF_LIMIT_T10.MInf },
    limitT2: { FInf: REF_LIMIT_T2.FInf },
    achievedCFar: ACHIEVED_CFAR,
    bracketGapT10: ACHIEVED_CFAR / REF_FLOOR.F,
    bracketGapT2: ACHIEVED_CFAR / REF_LIMIT_T2.FInf,
  },
  openResiduals: [
    'the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family',
    'the curvature ceiling D retained by the window',
    'the paper phase curvature normalization (sibling Theorem D residual)',
    'residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|',
    'REFINED: close the far bracket [F, 8/(2 sigma - 1)] - a sharper witness (multi-boundary bridge chains, correlated amplitudes) to raise the floor, or a sharper aggregation (recover part of the discarded ||W_minus||^2) to lower the achieved coefficient; and the FIXED-p far floor (the p = 97 bridge witness is blind, E(97, 10) < 0)',
  ],
  isRigorous: true,
  rigorScope:
    'Theorem K is unconditional given the model-family conventions: the 4-packet witness is exhibited explicitly, MAJ legality is the proved inequality (1 + z)e^(-z) <= 1, every correlation is the exact closed-form exponential autocorrelation, and the floor quantifies over the two-currency bound class with tail functionals T* <= T(2) (which contains every sibling bound) at cNear <= 2. The positive floor statement lives in the spacing-uniform class (constants uniform in p) - exactly the class in which the seventh-continuation sharpness "near constant EXACTLY 2" lives; at fixed p = 97 the witness is blind and the fixed-p far floor is recorded OPEN. Bounds in other currencies are outside scope, as recorded. The numerics cross-check the statements; they are not the claim.',
  promotesBound: false,
  verdict:
    'RIGOROUS step: the seventh-continuation residual "cFar = 8/(2 sigma - 1) at cNear = 2 is not known optimal" gets its first two-sided constraint. NEW Theorem K (4-packet bridge witness: two boundary-straddling near-degenerate pairs joined across block gap 2, exact exponential correlations, no inequality in E) shows the far coefficient of any spacing-uniform two-currency bound with cNear <= 2 satisfies cFar >= F > 0: the corner (2, 0) is infeasible and the far currency is structurally necessary at the terminal near constant. Reference floors: 2.609404585369758e-5 at theta = 10 (achieved 8, gap 3.066e5), 0.024574312039374043 at theta = 2 (gap 325.5). The far bracket [F, 8/(2 sigma - 1)] is the refined residual, together with the fixed-p floor (p = 97 witness blind). Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_FCF_ASSERTIONS = [
  {
    id: 'imp95008-fcf-witness-admissible',
    description:
      'the 4-packet bridge witness is grid- and block-admissible at p in {97, 997, 999983}: integer h in [1, p-1] for all four packets, d1 in block 0, d2 and d3 in block 1, d4 in block 2, centers ordered u1 < u2 < u3 < u4, and r1 is the minimal width',
    holds: () =>
      [97, 997, 999983].every((p) => {
        const w = bridgeWitness(p);
        const gridOk = [w.h1, w.h2, w.h3, w.h4].every(
          (h) => Number.isInteger(h) && h >= 1 && h <= p - 1,
        );
        const dOk =
          Math.abs(1 - w.h1 / p - w.d[0]) < 1e-14 &&
          Math.abs(1 - w.h2 / p - w.d[1]) < 1e-14 &&
          Math.abs(1 - w.h3 / p - w.d[2]) < 1e-14 &&
          Math.abs(1 - w.h4 / p - w.d[3]) < 1e-14;
        const blockOk =
          w.d[0] > 0.5 &&
          w.d[0] <= 1 &&
          w.d[1] > 0.25 &&
          w.d[1] <= 0.5 &&
          w.d[2] > 0.25 &&
          w.d[2] <= 0.5 &&
          w.d[3] > 0.125 &&
          w.d[3] <= 0.25;
        const orderOk = w.u[0] < w.u[1] && w.u[1] < w.u[2] && w.u[2] < w.u[3];
        const widthOk = w.r[0] === Math.min(...w.r);
        return gridOk && dOk && blockOk && orderOk && widthOk;
      }),
  },
  {
    id: 'imp95008-fcf-sub-envelope-legality',
    description:
      'MAJ legality tripwire: (1 + z)e^(-z) <= 1 on a dense sampled grid, and the full chain e^(-lambda t) <= (1 + t/r_i)^(-s) holds for every witness packet width at p = 997, theta = 10 (the analytic proof is elementary; this guards the code path)',
    holds: () => {
      for (let z = 0; z <= 60; z += 0.01) {
        if ((1 + z) * Math.exp(-z) > 1 + 1e-14) return false;
      }
      const s = SIGMA + 10;
      const { lam, witness } = bridgeExcess(997, 10);
      for (let t = 0; t <= 20; t += 0.05) {
        for (const ri of witness.r) {
          if (Math.exp(-lam * t) > Math.pow(1 + t / ri, -s) + 1e-14) return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp95008-fcf-exact-gram-vs-quadrature',
    description:
      'the exact closed-form Gram matrix (rho = e^(-z)(1+z)) matches direct quadrature of the 4-packet family: max relative entry error < 1e-5 at p = 997 and p = 97 (theta = 10)',
    holds: () => QUAD_997.maxRelGram < 1e-5 && QUAD_97.maxRelGram < 1e-5,
  },
  {
    id: 'imp95008-fcf-excess-vs-quadrature',
    description:
      'the closed-form excess E = lhs - 2A matches the quadrature excess to < 1e-4 relative at p = 997 and p = 97 - this audits the parasite rho_23 coefficient (net -1) against the full Gram assembly',
    holds: () => QUAD_997.relE < 1e-4 && QUAD_97.relE < 1e-4,
  },
  {
    id: 'imp95008-fcf-reference-floor-values',
    description:
      'baked reference values reproduce: F(999983, 10) = 2.609404585369758e-5, E(999983, 10) = 2.1833846590706516e-7, FInf(10) = 2.6381049648580098e-5, EInf(10) = 2.2073990466554883e-7, FInf(2) = 0.024574312039374043, MInf = 8.523071328472337 (relative 1e-9)',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(REF_FLOOR.F, 2.609404585369758e-5) &&
        rel(REF_FLOOR.E, 2.1833846590706516e-7) &&
        rel(REF_LIMIT_T10.FInf, 2.6381049648580098e-5) &&
        rel(REF_LIMIT_T10.EInf, 2.2073990466554883e-7) &&
        rel(REF_LIMIT_T2.FInf, 0.024574312039374043) &&
        rel(REF_LIMIT_T10.MInf, 8.523071328472337)
      );
    },
  },
  {
    id: 'imp95008-fcf-sign-structure',
    description:
      'honesty sign structure at theta = 10: E < 0 at p = 97, 99991, 103001 (witness blind at the paper reference prime; threshold above 103001) and E > 0 at p = 149993, 199999, 999983',
    holds: () =>
      E_97 < 0 &&
      E_99991 < 0 &&
      E_103001 < 0 &&
      E_149993 > 0 &&
      E_199999 > 0 &&
      REF_FLOOR.E > 0,
  },
  {
    id: 'imp95008-fcf-monotone-approach-to-limit',
    description:
      'the excess increases along the spacing ladder toward the closed-form limit and never crosses it: E(149993) < E(199999) < E(999983) < EInf at theta = 10',
    holds: () =>
      E_149993 < E_199999 &&
      E_199999 < REF_FLOOR.E &&
      REF_FLOOR.E < REF_LIMIT_T10.EInf,
  },
  {
    id: 'imp95008-fcf-bridge-beats-deficit',
    description:
      'decomposition audit at p = 999983, theta = 10: the near-pair deficits |rho12 + rho34 - 2| < 2e-8 while the bridge net rho13 + rho14 + rho24 - rho23 > 9e-7 - the excess is bridge-driven, not a cancellation artifact',
    holds: () => {
      const { rho } = bridgeExcess(999983, 10);
      const deficit = Math.abs(rho.r12 + rho.r34 - 2);
      const bridgeNet = rho.r13 + rho.r14 + rho.r24 - rho.r23;
      return deficit < 2e-8 && bridgeNet > 9e-7;
    },
  },
  {
    id: 'imp95008-fcf-bracket-gaps',
    description:
      'the far bracket [F, 8/(2 sigma - 1)] has measured gap in (3.0e5, 3.1e5) at theta = 10 and below 326 at theta = 2 (against the spacing-limit floor) - the floor strengthens at small theta',
    holds: () => {
      const gap10 = ACHIEVED_CFAR / REF_FLOOR.F;
      const gap2 = ACHIEVED_CFAR / REF_LIMIT_T2.FInf;
      return gap10 > 3.0e5 && gap10 < 3.1e5 && gap2 > 300 && gap2 < 326;
    },
  },
  {
    id: 'imp95008-fcf-corollary-p-consistency',
    description:
      'no contradiction with the achieved Corollary P bound on the SAME witness: E(999983, 10) <= (8/(2 sigma - 1)) T_even M (holds with ~3e5 slack)',
    holds: () => {
      const Q = isolationQ(CC, VV, BETA, DD);
      const tEven = tailArithDirect(2, Q, BETA, 10, 400);
      return REF_FLOOR.E <= ACHIEVED_CFAR * tEven * REF_FLOOR.M;
    },
  },
  {
    id: 'imp95008-fcf-tradeoff-line',
    description:
      'the general-cNear trade-off line is coherent: at p = 999983, theta = 10 the implied floor at cNear = 1.9 exceeds the cNear = 2 floor by exactly 0.1 A/(T(2) M) and is strictly larger',
    holds: () => {
      const at2 = farFloorLine(999983, 10, 2);
      const at19 = farFloorLine(999983, 10, 1.9);
      const { A, T2, M } = farFloor(999983, 10);
      return (
        Math.abs(at2 - REF_FLOOR.F) < 1e-15 &&
        at19 > at2 &&
        Math.abs(at19 - at2 - (0.1 * A) / (T2 * M)) < 1e-12
      );
    },
  },
  {
    id: 'imp95008-fcf-honesty-gate',
    description:
      'the verdict records the corner infeasibility, the open far bracket, the fixed-p blindness, promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95008_FAR_COEFFICIENT_FLOOR.promotesBound === false &&
      IMP95008_FAR_COEFFICIENT_FLOOR.openResiduals.length === 5 &&
      /NO QED/.test(IMP95008_FAR_COEFFICIENT_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP95008_FAR_COEFFICIENT_FLOOR.verdict) &&
      /infeasible/.test(IMP95008_FAR_COEFFICIENT_FLOOR.verdict) &&
      /witness blind/.test(IMP95008_FAR_COEFFICIENT_FLOOR.verdict) &&
      /FIXED-p far floor/.test(IMP95008_FAR_COEFFICIENT_FLOOR.openResiduals[4]) &&
      /spacing-uniform/.test(IMP95008_FAR_COEFFICIENT_FLOOR.rigorScope),
  },
];

for (const a of IMP95008_FCF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-far-coefficient-floor assertion failed: ${a.id}`);
  }
}

export default IMP95008_FAR_COEFFICIENT_FLOOR;
