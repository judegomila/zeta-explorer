/**
 * imp-95008 continuation (ninth) - LEMMA V + THEOREM L: RATE RELAXATION
 * dissolves the fixed-p blindness of the far-floor witness. The eighth
 * continuation (imp-95008-far-coefficient-floor.js, Theorem K) proved the
 * far coefficient has a positive floor in the SPACING-UNIFORM two-currency
 * class, but recorded as an open residual: "the FIXED-p far floor (the
 * p = 97 bridge witness is blind: E(97, 10) < 0)". This module resolves
 * that residual POSITIVELY and sharpens the global floor by ~292x. The
 * blindness was an artifact of RATE-LOCKING: Theorem K pinned the packet
 * profile rate to the envelope-critical value lambda = s / r_min, the
 * smallest rate at which the exponential profile sits under its MAJ
 * envelope with amplitude constant 1. But MAJ(sigma, theta) (fifth
 * continuation) only requires |a_d(u)| <= A_d (1 + |u - u_d|/r_d)^(-s)
 * for SOME amplitudes A_d >= 0 - the envelope amplitude is free data. A
 * slower rate mu < lambda is therefore legal at the exact damping price
 * given by tangent-envelope calculus, and slower rates fatten the
 * gap-2 bridge correlations EXPONENTIALLY while the damping price enters
 * only through the mass currency M. The trade has a strongly positive
 * interior optimum.
 *
 * LEMMA V (exact rate-relaxation legality constant). Fix s > 0, r > 0.
 * For every rate mu > 0, the minimal envelope amplitude A for which
 *   alpha e^(-mu t) <= A (1 + t/r)^(-s)   for all t >= 0
 * is A = alpha / h(mu, r, s), with the closed-form tangent constant
 *   h(mu, r, s) = e^(s - mu r) (mu r / s)^s   if mu r < s,
 *   h(mu, r, s) = 1                            if mu r >= s.
 * Proof. Legality says A >= alpha sup_t e^(-mu t)(1 + t/r)^s, i.e.
 * A = alpha / inf_t e^(G(t)) with G(t) = mu t - s ln(1 + t/r). G is
 * convex with G'(t) = mu - (s/r)/(1 + t/r); for mu r < s the minimum is
 * interior at t* = s/mu - r > 0 with G(t*) = s - mu r - s ln(s/(mu r)),
 * giving the first branch; for mu r >= s, G' >= 0 on t >= 0 so the
 * infimum is G(0) = 0, giving h = 1. QED (of the lemma). The mu r >= s
 * branch at mu = lambda = s / r_min recovers exactly the unit-amplitude
 * legality of the sibling witnesses (their proved inequality
 * (1 + z) e^(-z) <= 1 is the special case of this calculus).
 *
 * THEOREM L (the fixed-p far floor at the paper reference prime is
 * POSITIVE for every theta > 0). Take the eighth-continuation 4-packet
 * bridge geometry at p = 97 (near-degenerate pairs d = (p +- 1)/(2p)
 * straddling the block-0/1 boundary at u ~ 2 and d ~ 1/4 straddling the
 * block-1/2 boundary at u ~ 4), profiles a_i(u) = alpha_i e^(-mu|u-u_i|)
 * with ANY common rate mu > 0 and amplitudes alpha_i >= 0, and envelope
 * data A_i = alpha_i / h(mu, r_i, s) from Lemma V (MAJ holds by
 * construction, with equality at the tangent point). All correlations
 * stay EXACT: <a_i, a_j> = (alpha_i alpha_j / mu) f(mu tau_ij),
 * f(z) = e^(-z)(1 + z). Then any bound
 *   || sum_b w_b ||^2 <= cNear A_curr + cFar T* M
 * valid over MAJ(sigma, theta) families at p = 97, with cNear <= 2 and
 * T* <= T(2), satisfies
 *   cFar >= F(mu, alpha) = E(mu, alpha) / ( T(2) M(mu, alpha) ),
 *   E = (1/mu) alpha^T C(mu) alpha   (the exact excess lhs - 2 A_curr),
 *   M = (alpha_1 sqrt(r_1)/h_1)^2
 *     + (alpha_2 sqrt(r_2)/h_2 + alpha_3 sqrt(r_3)/h_3)^2
 *     + (alpha_4 sqrt(r_4)/h_4)^2 ,
 * and the KEY point: the quadratic form alpha^T C(mu) alpha depends on
 * theta ONLY through nothing - C(mu) is theta-free at fixed mu (the
 * correlations are functions of mu tau alone). At mu = 1, unit alpha,
 *   alpha^T C(1) alpha = 1.5309200805205996 > 0 ,
 * so E > 0 and hence cFar >= E / (T(2) M) > 0 for EVERY theta > 0
 * (theta enters only the positive finite quantities T(2) and M). The
 * corner (cNear, cFar) = (2, 0) is INFEASIBLE at the paper reference
 * prime p = 97 itself, at every theta. The eighth-continuation
 * fixed-p residual is CLOSED, not merely narrowed. QED (assembly
 * identical to Theorem K: cFar T* M >= lhs - cNear A >= lhs - 2A = E,
 * then T* <= T(2)).
 *
 * COROLLARY L1 (optimized fixed-97 floors; baked explicit witnesses -
 * optimality is NOT claimed, each baked witness is simply exhibited).
 *   theta = 10: mu = 2.522167 (= 0.288 lambda),
 *     alpha = (0.636635, 0.621654, 0.309907, 0.334962):
 *     F = 3.34686909040411e-5 - which EXCEEDS the eighth-continuation
 *     spacing-uniform rate-locked floor 2.609404585369758e-5 by 1.283x.
 *     The prime the eighth continuation recorded as blind now carries a
 *     floor stronger than its whole spacing ladder did.
 *   theta = 2: mu = 1.086527,
 *     alpha = (0.512790, 0.284920, 0.506456, 0.631957):
 *     F = 0.15740060227808753 - 6.4x the eighth-continuation
 *     spacing-limit floor 0.024574312039374043; the theta = 2 far
 *     bracket closes to [0.15740, 8], gap 50.8 (was 325.5).
 *
 * COROLLARY L2 (the spacing-class floor sharpens ~292x). The same rate
 * relaxation applied on the spacing ladder: at p = 999983, theta = 10,
 * mu = 4.515, alpha = (0.255760, 0.254710, 0.659230, 0.659640):
 *   F = 0.007612460791911987 = 291.73 x the Theorem K floor,
 * so the theta = 10 far bracket closes from [2.6094e-5, 8] (gap 3.07e5)
 * to [0.0076125, 8] (gap 1050.9). Structural shift: the optimizer puts
 * the dominant amplitude on the SECOND pair (wider packets, cheaper
 * Lemma V damping) - the floor is no longer a vanishing-deficit
 * squeeze but a bulk bridge-correlation effect. Consistency anchor: in
 * the spacing limit the optimal-amplitude floor collapses to the
 * closed-form one-variable functional (optimal pair ratio t = 1 by
 * exact algebra: max of t/(2t^2 + 2t + 2) is 1/6 at t = 1)
 *   Phi(mu) = (2/3) f(2 mu) h(mu, 2^beta, s) h(mu, 2^(2 beta), s)
 *             / ( mu T(2) 2^(3 beta / 2) ),
 * with sup_mu Phi = 0.007600907028538138 at mu = 4.518033 (theta = 10)
 * and 0.13322777701258043 at mu = 1.176557 (theta = 2) - the finite-p
 * baked floors sit within 0.16% (theta 10) of the limit functional
 * (finite p can slightly EXCEED the limit through the slightly-short
 * bridge tau_13 < 2; the limit is an anchor, not an upper bound; the
 * rigorous floors are the finite-p witness evaluations).
 *
 * REMARK (why the eighth witness was blind - rate-locking diagnosis).
 * At the locked rate lambda = s/r_1 = 8.7606 (p = 97, theta = 10) the
 * unit-amplitude excess is E = -0.10621815365819198 (the sibling
 * literal, reproduced below to 1e-9), and no amplitude vector helps:
 * the exact criterion is lambdaMax(C(lambda)) < 0 (measured -0.0515).
 * Amplitude freedom alone cannot fix the witness; rate freedom does,
 * because the bridge correlations f(mu tau) with tau ~ 2 gain
 * e^(lambda - mu) x 2 while Lemma V damping costs only h^2 per unit of
 * mass currency - and M enters the floor linearly, not exponentially.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) legality is NOT assumed - Lemma V
 * is proved by convexity calculus and cross-checked below against a
 * direct numerical infimum on both branches (interior tangent and
 * h = 1), agreement ~1e-9; (2) the closed-form excess at the baked
 * (97, 10) witness matches full 4-packet quadrature to 8e-8 relative;
 * (3) no contradiction with the achieved Corollary P bound: on every
 * baked witness E <= (8/(2 sigma - 1)) T_even M holds with wide slack
 * (asserted); the floors stay far below the achieved cFar = 8, the
 * bracket remains open; (4) no contradiction with the seventh
 * continuation: the near constant stays EXACTLY 2 - rate-relaxed
 * witnesses cannot push the near floor above 2 because the parity
 * split S-prime(2) ATTAINS 2, and this module floors only cFar at
 * cNear <= 2; (5) the baked big-p witness is p-SPECIFIC: evaluated at
 * p = 997 its excess is negative (asserted) - each floor is claimed
 * only at its own p, and the spacing-class floor cites the p = 999983
 * evaluation (valid for the class since a spacing-uniform bound must
 * hold at every p); (6) theta-freeness of the quadratic form at fixed
 * mu is asserted by computing it through two independent code paths;
 * (7) amplitude signs: all baked witnesses are componentwise positive,
 * so the l1 block masses carry no absolute-value subtlety; (8) scope
 * caveat inherited from Theorems F and K: the floor quantifies over
 * the two-currency bound class with tail functionals T* <= T(2); a
 * bound in a genuinely different currency evades it.
 *
 * WHAT REMAINS OPEN (sibling residuals, updated): the packet-envelope
 * constants (c, beta, sigma, theta, A_d) for the PAPER packets; the
 * curvature ceiling D retained by the window; the paper phase curvature
 * normalization; residual (c), the l2-to-pointwise passage to |C_E,17|.
 * SUPERSEDED: the eighth-continuation residual "FIXED-p far floor OPEN
 * (p = 97 witness blind)" is closed by Theorem L. REFINED residual: the
 * far bracket is now [0.0076125, 8] at theta = 10 - close it further,
 * and find the OPTIMAL witness class (is the 4-packet bridge with free
 * common rate optimal among multi-packet, multi-rate, multi-boundary
 * witnesses, or does a chain witness raise the floor again?).
 *
 * The numerics below CROSS-CHECK the closed-form statements; they are
 * not the claim. Import-light (no heavy bundle). Changes no bound; does
 * NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
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

// arithmetic tail T_even = sum_{m >= 1} (1 + G(2m))^(-theta)
function tailArithDirect(J, Q, beta, theta, mMax) {
  let s = 0;
  for (let m = 1; m <= mMax; m++) {
    const g = gapRatioFloor(m * J, Q, beta);
    if (!Number.isFinite(g)) break;
    s += Math.pow(1 + g, -theta);
  }
  return s;
}

// exact normalized autocorrelation of the two-sided exponential
function fCorr(z) {
  return Math.exp(-z) * (1 + z);
}

// ── LEMMA V: exact tangent-envelope legality constant ────────────────────────
function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}

// ── the eighth-continuation bridge geometry (unchanged) ──────────────────────
function bridgeWitness(p) {
  const d1 = (p + 1) / (2 * p);
  const d2 = (p - 1) / (2 * p);
  const h3 = Math.ceil((3 * p) / 4) - 1;
  const d3 = 1 - h3 / p;
  const d4 = d3 - 1 / p;
  const d = [d1, d2, d3, d4];
  const u = d.map((x) => VV / x);
  const r = d.map((x) => CC * Math.pow(x, -BETA));
  return { d, u, r };
}

// ── THEOREM L evaluation: rate-relaxed floor at (p, theta, mu, alpha) ────────
function relaxedFloor(p, theta, mu, a) {
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
  const T2 = tailSDirect(2, Q, BETA, theta, 800);
  return { F: E / (T2 * M), E, M, T2, qform, h, witness: w };
}

// closed-form spacing-limit functional (Corollary L2 anchor)
function limitPhi(theta, mu) {
  const s = SIGMA + theta;
  const hA = hLegal(mu, Math.pow(2, BETA), s);
  const hB = hLegal(mu, Math.pow(2, 2 * BETA), s);
  const Q = isolationQ(CC, VV, BETA, DD);
  const T2 = tailSDirect(2, Q, BETA, theta, 800);
  return ((2 / 3) * fCorr(2 * mu) * hA * hB) / (mu * T2 * Math.pow(2, 1.5 * BETA));
}

// ── baked explicit witnesses (Corollaries L1 and L2) ─────────────────────────
const WITNESS_97_T10 = { mu: 2.522167, a: [0.636635, 0.621654, 0.309907, 0.334962] };
const WITNESS_97_T2 = { mu: 1.086527, a: [0.51279, 0.28492, 0.506456, 0.631957] };
const WITNESS_BIG_T10 = { mu: 4.515, a: [0.25576, 0.25471, 0.65923, 0.65964] };

const FLOOR_97_T10 = relaxedFloor(97, 10, WITNESS_97_T10.mu, WITNESS_97_T10.a);
const FLOOR_97_T2 = relaxedFloor(97, 2, WITNESS_97_T2.mu, WITNESS_97_T2.a);
const FLOOR_BIG_T10 = relaxedFloor(999983, 10, WITNESS_BIG_T10.mu, WITNESS_BIG_T10.a);
const UNIVERSAL_MU1 = relaxedFloor(97, 10, 1, [1, 1, 1, 1]);

const SIBLING_FLOOR_T10 = 2.609404585369758e-5; // Theorem K, rate-locked
const SIBLING_FLOOR_LIMIT_T2 = 0.024574312039374043; // Theorem K spacing limit
const SIBLING_RATE_LOCKED_E_97_T10 = -0.10621815365819198; // Theorem K blindness literal
const ACHIEVED_CFAR = 8 / (2 * SIGMA - 1);

// ── quadrature cross-check of the baked (97, 10) witness ─────────────────────
function bridgeQuadExcess(p, mu, a) {
  const w = bridgeWitness(p);
  const step = 1e-4;
  const pad = 45 / mu;
  const lo = w.u[0] - pad;
  const hi = w.u[3] + pad;
  const n = Math.ceil((hi - lo) / step);
  const ip = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let k = 0; k < n; k++) {
    const x = lo + k * step;
    const vals = w.u.map((ui, i) => a[i] * Math.exp(-mu * Math.abs(x - ui)));
    for (let i = 0; i < 4; i++) {
      for (let j = i; j < 4; j++) ip[i][j] += vals[i] * vals[j];
    }
  }
  for (let i = 0; i < 4; i++) {
    for (let j = i; j < 4; j++) ip[i][j] *= step;
  }
  const lhs =
    ip[0][0] +
    ip[1][1] +
    ip[2][2] +
    ip[3][3] +
    2 * (ip[0][1] + ip[0][2] + ip[0][3] + ip[1][2] + ip[1][3] + ip[2][3]);
  const A = ip[0][0] + (ip[1][1] + ip[2][2] + 2 * ip[1][2]) + ip[3][3];
  return lhs - 2 * A;
}

const QUAD_E_97_T10 = bridgeQuadExcess(97, WITNESS_97_T10.mu, WITNESS_97_T10.a);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_RATE_RELAXED_FIXED_P_FLOOR = {
  ticket: 'imp-95008 (continuation nine: rate relaxation dissolves the fixed-p blindness)',
  source:
    'Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; resolves the eighth-continuation residual "FIXED-p far floor OPEN (the p = 97 witness is blind)" POSITIVELY and sharpens the spacing-class far floor ~292x',
  lemmaV:
    'Exact rate-relaxation legality: alpha e^(-mu t) <= A (1 + t/r)^(-s) for all t >= 0 iff A >= alpha / h(mu, r, s), h = e^(s - mu r)(mu r/s)^s for mu r < s and h = 1 for mu r >= s, by convexity of G(t) = mu t - s ln(1 + t/r) (interior tangent at t* = s/mu - r). The MAJ envelope amplitude A_d is free data, so EVERY rate mu > 0 is admissible at the damping price 1/h in the mass currency.',
  theoremL:
    'The fixed-p far floor at the paper reference prime is POSITIVE for every theta > 0: the p = 97 bridge witness with rate mu = 1 and unit amplitudes has theta-FREE excess quadratic form alpha^T C(1) alpha = 1.5309200805205996 > 0 (correlations depend on mu tau only), so cFar >= E/(T(2) M) > 0 at every theta. The corner (cNear, cFar) = (2, 0) is infeasible at p = 97 itself. The eighth-continuation blindness E(97, 10) < 0 was a rate-locking artifact (mu pinned to lambda = s/r_min = 8.7606); amplitude freedom alone cannot fix it (lambdaMax(C(lambda)) < 0), rate freedom does.',
  corollaries:
    'L1 (fixed-97 baked witnesses): theta = 10: F = 3.34686909040411e-5 (mu = 2.522167) - EXCEEDS the whole rate-locked spacing-uniform Theorem K floor (1.283x); theta = 2: F = 0.15740060227808753 (mu = 1.086527), bracket gap 325.5 -> 50.8. L2 (spacing class): p = 999983, theta = 10: F = 0.007612460791911987 = 291.73x Theorem K, bracket [2.6094e-5, 8] -> [0.0076125, 8], gap 3.07e5 -> 1050.9; closed-form limit functional Phi(mu) = (2/3) f(2mu) h(mu, 2^beta, s) h(mu, 2^(2beta), s) / (mu T(2) 2^(3beta/2)), sup 0.007600907028538138 at mu = 4.518033.',
  reference: {
    parameters: { p: 97, v: VV, c: CC, beta: '1/3', D: DD, sigma: SIGMA },
    universalQform: UNIVERSAL_MU1.qform,
    fixed97Theta10: {
      witness: WITNESS_97_T10,
      floorF: FLOOR_97_T10.F,
      excessE: FLOOR_97_T10.E,
      massM: FLOOR_97_T10.M,
      vsSiblingSpacingFloor: FLOOR_97_T10.F / SIBLING_FLOOR_T10,
    },
    fixed97Theta2: {
      witness: WITNESS_97_T2,
      floorF: FLOOR_97_T2.F,
      bracketGap: ACHIEVED_CFAR / FLOOR_97_T2.F,
    },
    spacingClassTheta10: {
      witness: WITNESS_BIG_T10,
      p: 999983,
      floorF: FLOOR_BIG_T10.F,
      vsSiblingFloor: FLOOR_BIG_T10.F / SIBLING_FLOOR_T10,
      bracketGap: ACHIEVED_CFAR / FLOOR_BIG_T10.F,
      limitPhiT10: limitPhi(10, 4.518033),
      limitPhiT2: limitPhi(2, 1.176557),
    },
  },
  openResiduals: [
    'the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family',
    'the curvature ceiling D retained by the window',
    'the paper phase curvature normalization (sibling Theorem D residual)',
    'residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|',
    'REFINED: close the far bracket [0.0076125, 8/(2 sigma - 1)] at theta = 10 - and determine the optimal witness class (multi-packet, multi-rate, multi-boundary chains vs the 4-packet free-rate bridge)',
  ],
  isRigorous: true,
  rigorScope:
    'Lemma V is elementary convexity calculus; Theorem L and both corollaries are witness evaluations with every correlation exact (two-sided exponential autocorrelation) and legality exact (tangent envelope, equality attained), assembled exactly as Theorem K (cFar T* M >= lhs - 2 A_curr = E, T* <= T(2)). Optimality of the baked witnesses is NOT claimed - each is exhibited and evaluated. The floor quantifies over the two-currency bound class with tail functionals T* <= T(2) at cNear <= 2; bounds in other currencies are outside scope. The numerics cross-check the statements; they are not the claim.',
  promotesBound: false,
  verdict:
    'RIGOROUS step: the eighth-continuation residual "FIXED-p far floor OPEN (p = 97 witness blind)" is RESOLVED POSITIVELY, and the blindness diagnosed as a rate-locking artifact. NEW Lemma V (exact tangent-envelope legality constant h = e^(s - mu r)(mu r/s)^s) makes every profile rate admissible; NEW Theorem L exhibits a theta-free positive excess at p = 97 (quadratic form 1.5309 at mu = 1), so the corner (cNear, cFar) = (2, 0) is infeasible at the paper reference prime for EVERY theta > 0. Optimized baked witnesses: fixed-97 theta = 10 floor 3.34686909040411e-5 (exceeds the old spacing-uniform floor), theta = 2 floor 0.1574; spacing-class theta = 10 floor 0.007612460791911987 = 291.73x Theorem K, far bracket gap 3.07e5 -> 1050.9. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_RRF_ASSERTIONS = [
  {
    id: 'imp95008-rrf-witness-admissible',
    description:
      'the bridge geometry is grid- and block-admissible at p in {97, 999983}: integer h in [1, p-1], d1 in block 0, d2 and d3 in block 1, d4 in block 2, centers ordered',
    holds: () =>
      [97, 999983].every((p) => {
        const w = bridgeWitness(p);
        const hh = [
          (p - 1) / 2,
          (p + 1) / 2,
          Math.ceil((3 * p) / 4) - 1,
          Math.ceil((3 * p) / 4),
        ];
        const gridOk = hh.every((h) => Number.isInteger(h) && h >= 1 && h <= p - 1);
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
        return gridOk && blockOk && orderOk;
      }),
  },
  {
    id: 'imp95008-rrf-lemmaV-vs-direct-infimum',
    description:
      'Lemma V tangent constant matches the direct numerical infimum of e^(mu t)(1 + t/r)^(-s) on both branches: interior tangent (mu = 2.522167, all four p = 97 widths, s = 11) to 1e-7 relative, and the h = 1 branch (mu = 10 > s/r) exactly',
    holds: () => {
      const s = 11;
      const w = bridgeWitness(97);
      for (const r of w.r) {
        let mn = Infinity;
        for (let t = 0; t <= 60; t += 0.001) {
          const v = Math.exp(WITNESS_97_T10.mu * t) * Math.pow(1 + t / r, -s);
          if (v < mn) mn = v;
        }
        const ana = hLegal(WITNESS_97_T10.mu, r, s);
        if (Math.abs(mn - ana) / ana > 1e-7) return false;
      }
      let mn1 = Infinity;
      for (let t = 0; t <= 30; t += 0.001) {
        const v = Math.exp(10 * t) * Math.pow(1 + t / w.r[0], -s);
        if (v < mn1) mn1 = v;
      }
      return hLegal(10, w.r[0], s) === 1 && mn1 >= 1 - 1e-12;
    },
  },
  {
    id: 'imp95008-rrf-legality-chain-tripwire',
    description:
      'sampled legality of the baked (97, 10) witness: alpha_i e^(-mu t) <= (alpha_i / h_i)(1 + t/r_i)^(-s) on a dense t grid for all four packets',
    holds: () => {
      const s = 11;
      const { mu, a } = WITNESS_97_T10;
      const w = bridgeWitness(97);
      for (let i = 0; i < 4; i++) {
        const A = a[i] / hLegal(mu, w.r[i], s);
        for (let t = 0; t <= 40; t += 0.01) {
          if (a[i] * Math.exp(-mu * t) > A * Math.pow(1 + t / w.r[i], -s) + 1e-14) {
            return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: 'imp95008-rrf-excess-vs-quadrature',
    description:
      'the closed-form excess E at the baked (97, 10) witness matches direct 4-packet quadrature to < 1e-6 relative',
    holds: () =>
      Math.abs(QUAD_E_97_T10 - FLOOR_97_T10.E) / Math.abs(FLOOR_97_T10.E) < 1e-6,
  },
  {
    id: 'imp95008-rrf-baked-reference-values',
    description:
      'baked reference values reproduce (relative 1e-9): qform(mu=1, unit) = 1.5309200805205996, F(97,10) = 3.34686909040411e-5, E(97,10) = 0.004293997501724381, F(97,2) = 0.15740060227808753, F(999983,10) = 0.007612460791911987, Phi(10, 4.518033) = 0.007600907028538138, Phi(2, 1.176557) = 0.13322777701258043',
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(UNIVERSAL_MU1.qform, 1.5309200805205996) &&
        rel(FLOOR_97_T10.F, 3.34686909040411e-5) &&
        rel(FLOOR_97_T10.E, 0.004293997501724381) &&
        rel(FLOOR_97_T2.F, 0.15740060227808753) &&
        rel(FLOOR_BIG_T10.F, 0.007612460791911987) &&
        rel(limitPhi(10, 4.518033), 0.007600907028538138) &&
        rel(limitPhi(2, 1.176557), 0.13322777701258043)
      );
    },
  },
  {
    id: 'imp95008-rrf-theta-free-qform',
    description:
      'Theorem L theta-freeness code-path tripwire: the excess quadratic form at fixed mu = 1 computed through the theta = 2 path equals the theta = 10 path exactly, and is positive',
    holds: () => {
      const q2 = relaxedFloor(97, 2, 1, [1, 1, 1, 1]).qform;
      const q10 = relaxedFloor(97, 10, 1, [1, 1, 1, 1]).qform;
      return q2 === q10 && q10 > 1.53;
    },
  },
  {
    id: 'imp95008-rrf-all-theta-positive-floor',
    description:
      'the mu = 1 unit witness gives a strictly positive fixed-97 floor at every theta on the mesh {1, 2, 3, 4, 6, 8, 10, 12, 15, 20}',
    holds: () =>
      [1, 2, 3, 4, 6, 8, 10, 12, 15, 20].every(
        (th) => relaxedFloor(97, th, 1, [1, 1, 1, 1]).F > 0,
      ),
  },
  {
    id: 'imp95008-rrf-rate-locking-diagnosis',
    description:
      'the rate-locked unit excess at (97, 10, mu = lambda) reproduces the sibling blindness literal -0.10621815365819198 (relative 1e-9), while the rate-relaxed baked witness at the same (p, theta) has strictly positive excess',
    holds: () => {
      const s = 11;
      const w = bridgeWitness(97);
      const lam = s / Math.min(...w.r);
      const locked = relaxedFloor(97, 10, lam, [1, 1, 1, 1]).E;
      return (
        Math.abs(locked - SIBLING_RATE_LOCKED_E_97_T10) <=
          1e-9 * Math.abs(SIBLING_RATE_LOCKED_E_97_T10) && FLOOR_97_T10.E > 0
      );
    },
  },
  {
    id: 'imp95008-rrf-improvement-ratios',
    description:
      'measured sharpenings hold: F(999983,10)/siblingFloor in (291, 292.5); new theta = 10 bracket gap in (1050, 1052); fixed-97 theta = 2 gap in (50, 51); F(97,10) > siblingFloor (the formerly blind prime now beats the old global floor)',
    holds: () => {
      const ratio = FLOOR_BIG_T10.F / SIBLING_FLOOR_T10;
      const gap10 = ACHIEVED_CFAR / FLOOR_BIG_T10.F;
      const gap2 = ACHIEVED_CFAR / FLOOR_97_T2.F;
      return (
        ratio > 291 &&
        ratio < 292.5 &&
        gap10 > 1050 &&
        gap10 < 1052 &&
        gap2 > 50 &&
        gap2 < 51 &&
        FLOOR_97_T10.F > SIBLING_FLOOR_T10 &&
        FLOOR_97_T2.F > SIBLING_FLOOR_LIMIT_T2
      );
    },
  },
  {
    id: 'imp95008-rrf-p-specificity-honesty',
    description:
      'the baked big-p witness is p-specific: evaluated at p = 997 its excess is NEGATIVE (each floor is claimed only at its own p), and the p-ladder 9973 < 99991 < 999983 of its floor is increasing with the p = 999983 value within 1% of the closed-form limit functional',
    holds: () => {
      const { mu, a } = WITNESS_BIG_T10;
      const e997 = relaxedFloor(997, 10, mu, a).E;
      const f1 = relaxedFloor(9973, 10, mu, a).F;
      const f2 = relaxedFloor(99991, 10, mu, a).F;
      const f3 = FLOOR_BIG_T10.F;
      const phi = limitPhi(10, 4.518033);
      return e997 < 0 && f1 > 0 && f1 < f2 && f2 < f3 && Math.abs(f3 - phi) / phi < 0.01;
    },
  },
  {
    id: 'imp95008-rrf-achieved-bound-consistency',
    description:
      'no contradiction with the achieved Corollary P bound: E <= (8/(2 sigma - 1)) T_even M on all three baked witnesses',
    holds: () => {
      const Q = isolationQ(CC, VV, BETA, DD);
      const check = (fl, theta) =>
        fl.E <= ACHIEVED_CFAR * tailArithDirect(2, Q, BETA, theta, 400) * fl.M;
      return check(FLOOR_97_T10, 10) && check(FLOOR_97_T2, 2) && check(FLOOR_BIG_T10, 10);
    },
  },
  {
    id: 'imp95008-rrf-positive-amplitudes',
    description:
      'all baked witness amplitude vectors are componentwise positive (no absolute-value subtlety in the l1 block masses)',
    holds: () =>
      [WITNESS_97_T10, WITNESS_97_T2, WITNESS_BIG_T10].every(
        (W) => W.a.every((x) => x > 0) && W.mu > 0,
      ),
  },
  {
    id: 'imp95008-rrf-honesty-gate',
    description:
      'the verdict records the residual resolution, the rate-locking diagnosis, the still-open bracket, promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95008_RATE_RELAXED_FIXED_P_FLOOR.promotesBound === false &&
      IMP95008_RATE_RELAXED_FIXED_P_FLOOR.openResiduals.length === 5 &&
      /NO QED/.test(IMP95008_RATE_RELAXED_FIXED_P_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP95008_RATE_RELAXED_FIXED_P_FLOOR.verdict) &&
      /RESOLVED POSITIVELY/.test(IMP95008_RATE_RELAXED_FIXED_P_FLOOR.verdict) &&
      /rate-locking artifact/.test(IMP95008_RATE_RELAXED_FIXED_P_FLOOR.verdict) &&
      /close the far bracket/.test(IMP95008_RATE_RELAXED_FIXED_P_FLOOR.openResiduals[4]) &&
      /Optimality of the baked witnesses is NOT claimed/.test(
        IMP95008_RATE_RELAXED_FIXED_P_FLOOR.rigorScope,
      ),
  },
];

for (const a of IMP95008_RRF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-rate-relaxed-fixed-p-floor assertion failed: ${a.id}`);
  }
}

export default IMP95008_RATE_RELAXED_FIXED_P_FLOOR;
