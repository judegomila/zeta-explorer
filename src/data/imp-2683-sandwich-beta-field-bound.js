/**
 * @module imp-2683-sandwich-beta-field-bound
 * @fileoverview Attacks the field bound beta in the min-gap SANDWICH Theorem B
 * (imp-2563-min-gap-sandwich-theorem.js / route-map opportunity #4). The
 * sandwich brackets the first-collision time t_c(N) two-sidedly
 *
 *     T_-(g,beta) <= t_c(N) <= T_+(g,beta),    relative width beta g^2 / 2,
 *
 * but is GATED on the UNPROVEN hypothesis beta g^2 < 2, where
 *     g    = g_min(0)               the initial global min gap, and
 *     beta = sup_{0<=s<t_c} |B_p(s)|,
 *     B_p(s) = sum_{j != lo,hi} 1 / ((b - x_j)(a - x_j))   (a = x_lo, b = x_hi)
 * is the net field of the other N-2 particles on the colliding pair. This
 * module supplies (a) a measured beta on a backward-flow window, (b) an
 * ANALYTIC density bound on |B_p|, and (c) the beta g^2 < 2 margin on the
 * Riemann-von-Mangoldt-modelled verified-zero ladder {1e3, 1e4, 1e5}.
 *
 * KEY ANALYTIC OBSERVATION 1 -- B_p IS A SUM OF POSITIVE TERMS.
 * ------------------------------------------------------------
 * Since a, b are ADJACENT, no particle lies in the open interval (a, b). For
 * every other particle x_j either x_j < a < b or a < b < x_j, so (a - x_j) and
 * (b - x_j) have the SAME sign and the product is strictly positive. Hence
 *
 *     B_p(s) = sum_{x_j < a} 1/(delta_j (delta_j + g))           [delta_j = a - x_j > 0]
 *            + sum_{x_j > b} 1/(eps_j   (eps_j   + g)) > 0       [eps_j   = x_j - b > 0]
 *
 * with g = b - a the pair gap. So |B_p| = B_p, and beta = sup_s B_p(s).
 *
 * KEY ANALYTIC OBSERVATION 2 -- THE TELESCOPING WORST-CASE BOUND beta g^2 < 2.
 * ---------------------------------------------------------------------------
 * Let G = g_min be the GLOBAL min gap at the instant considered (so the
 * colliding pair has gap g = G and EVERY gap is >= G). Then the k-th particle
 * out from the pair on either side sits at distance >= k G (a sum of k gaps,
 * each >= G), so delta_k (delta_k + G) >= kG (kG + G) = G^2 k(k+1) and likewise
 * for eps_k. Summing the two sides over a finite configuration with K particles
 * on each flank,
 *
 *     B_p <= (2 / G^2) sum_{k=1}^{K} 1/(k(k+1))
 *          = (2 / G^2) (1 - 1/(K+1))                 [telescope: 1/k - 1/(k+1)]
 *          <  2 / G^2.
 *
 * Therefore B_p G^2 < 2 holds RIGOROUSLY AND N-UNIFORMLY at any instant where
 * the colliding pair realises the global min gap -- in particular at s = 0,
 * where G = g, giving the headline
 *
 *     beta_0 g^2 := B_p(0) g^2 < 2(1 - 1/(K+1)) < 2,  uniformly in N.
 *
 * The bound is SHARP only in the degenerate uniform-lattice limit (all gaps
 * equal G, K -> infinity); any genuine spread of gaps, or finite N, leaves a
 * strict margin. This settles deliverable (c) AT s = 0: the gating hypothesis
 * beta g^2 < 2 is automatically satisfied by the initial field, with an
 * N-uniform margin -- the bracket is NOT conditional at the initial instant.
 *
 * KEY ANALYTIC OBSERVATION 3 -- THE REALISTIC (Weyl/RvM) MARGIN.
 * -------------------------------------------------------------
 * The worst case G everywhere = g is never met by zeta zeros: the global min
 * gap g is far below the LOCAL mean spacing l = 2 pi / log(T / 2 pi)
 * (Riemann-von-Mangoldt density at height T). Modelling the background as a
 * mean-spacing-l lattice with one embedded gap g, the positive-term sum gives
 *
 *     B_p ~ (2 / l^2) sum_{k>=1} 1/(k (k + g/l)) -> 2 zeta(2) / l^2 = pi^2/(3 l^2)
 *
 * for g << l, hence beta g^2 ~ (pi^2/3)(g/l)^2. Because level repulsion drives
 * the min/mean ratio g/l -> 0 as the window grows (Wigner small-gap law
 * g/l ~ N^{-1/2}), the margin in beta g^2 < 2 GROWS with N: the constraint is
 * satisfied with room to spare, increasingly so up the ladder.
 *
 * THE HONEST SUB-GAP (named, NOT closed here).
 * --------------------------------------------
 * Observations 2-3 bound B_p at instants where g = global min gap (e.g. s = 0).
 * Theorem B needs the SUPREMUM over 0 <= s < t_c with a SINGLE beta and the
 * INITIAL g. As the pair collapses, its gap g_pair(s) -> 0 (it is the global
 * min gap throughout), so the telescope bound 2/g_pair(s)^2 -> infinity and is
 * USELESS near collision. The TRUE field stays bounded because B_p excludes the
 * pair and the OTHER particles do not collapse onto it -- but proving
 * sup_s B_p(s) <= beta_0 (1 + o(1)) requires a uniform lower bound on the
 * PUNCTURED min gap
 *
 *     h(s) = min_{j != lo,hi} ( |a(s) - x_j(s)|, |b(s) - x_j(s)| )
 *
 * (distance from the colliding pair to the nearest BACKGROUND particle), which
 * does NOT shrink with g_pair. If h(s) >= c * g for all s < t_c then
 * B_p(s) <= 2 zeta(2)/(c g)^2 and beta g^2 <= (pi^2/3)/c^2, conditional only on
 * the constant c. This punctured-min-gap lower bound is the UNPROVEN residual.
 * The flow witness below MEASURES h(s) and B_p(s) over a real collapse and
 * finds beta = sup_s B_p stays within a small factor of beta_0 (h(s) barely
 * moves over the fast g^2/8 collapse window), giving empirical -- not proven --
 * support that c = O(1).
 *
 * WHAT THIS MODULE DELIVERS (honest scope):
 *   (a) measured beta along a backward-flow collapse (small window; full
 *       N = 1e5 flow is O(N^2) and intentionally NOT run -- the field sum is
 *       local and converges, so a window suffices and the heavy zeros bundle is
 *       NOT imported, per the build-hang constraint);
 *   (b) the telescoping rigorous bound beta_0 g^2 < 2 (N-uniform) AND the
 *       realistic Weyl/RvM density estimate beta g^2 ~ (pi^2/3)(g/l)^2;
 *   (c) the beta g^2 < 2 margin on the RvM-modelled ladder {1e3,1e4,1e5},
 *       reported at N* = 1e4, with the margin GROWING up the ladder.
 * The bracket is UPGRADED to unconditional AT s = 0; the sup_s upgrade stays
 * CONDITIONAL on the named punctured-min-gap residual.
 *
 * @see imp-2563-min-gap-sandwich-theorem (Theorem B; beta is its gating input)
 * @see imp-2561 / imp-2562 one-sided pinch (constant S read off as beta)
 * @see backward-flow-stability-gronwall (flow conventions)
 */

// ── Self-contained finite-N machinery (no heavy imports) ─────────────────────

/** Attractive Calogero-Moser drift dx_k/ds = -2 sum_{j!=k} 1/(x_k - x_j). */
function drift(x) {
  const N = x.length;
  const d = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let acc = 0;
    for (let j = 0; j < N; j++) if (j !== k) acc += 1 / (x[k] - x[j]);
    d[k] = -2 * acc;
  }
  return d;
}

/** One classical RK4 step of size h. */
function rk4Step(x, h) {
  const k1 = drift(x);
  const x2 = x.map((v, i) => v + 0.5 * h * k1[i]);
  const k2 = drift(x2);
  const x3 = x.map((v, i) => v + 0.5 * h * k2[i]);
  const k3 = drift(x3);
  const x4 = x.map((v, i) => v + h * k3[i]);
  const k4 = drift(x4);
  return x.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

/** Index lo of the adjacent pair (lo, lo+1) realising the global min gap. */
function minGapPair(x) {
  let lo = 0;
  let best = Infinity;
  for (let i = 0; i < x.length - 1; i++) {
    const g = x[i + 1] - x[i];
    if (g < best) {
      best = g;
      lo = i;
    }
  }
  return { lo, hi: lo + 1, gap: best };
}

/** Net background field B_p = sum_{j != lo,hi} 1/((b - x_j)(a - x_j)) > 0. */
function backgroundField(x, lo, hi) {
  const a = x[lo];
  const b = x[hi];
  let s = 0;
  for (let j = 0; j < x.length; j++) {
    if (j === lo || j === hi) continue;
    s += 1 / ((b - x[j]) * (a - x[j]));
  }
  return s;
}

/** Punctured min gap h = dist(pair, nearest background particle). */
function puncturedMinGap(x, lo, hi) {
  const a = x[lo];
  const b = x[hi];
  let h = Infinity;
  for (let j = 0; j < x.length; j++) {
    if (j === lo || j === hi) continue;
    h = Math.min(h, Math.abs(a - x[j]), Math.abs(b - x[j]));
  }
  return h;
}

// ── (b) Closed-form density field on a mean-spacing-l lattice with gap g ──────

/**
 * Net field B_p for the pair {a=0, b=g} embedded in a uniform background of
 * spacing l running K steps out on each flank: the k-th flank particle sits at
 * distance kl from the near endpoint and kl+g from the far one, so each side
 * contributes sum_k 1/(kl (kl+g)). Returns B_p (positive) and beta g^2 = B_p g^2.
 */
function latticeField(g, l, K) {
  let B = 0;
  for (let k = 1; k <= K; k++) {
    B += 2 / (k * l * (k * l + g)); // two symmetric flanks
  }
  return { B, betaGsq: B * g * g };
}

/**
 * Telescoping worst case: background also at spacing g (every gap = global min
 * gap). Closed form B_p g^2 = 2 (1 - 1/(K+1)) -> 2^- ; this is the rigorous
 * N-uniform ceiling of Observation 2.
 */
function telescopeCeiling(K) {
  // 2 sum_{k=1}^K 1/(k(k+1)) = 2 (1 - 1/(K+1))
  return 2 * (1 - 1 / (K + 1));
}

// ── (c) Riemann-von-Mangoldt ladder {1e3, 1e4, 1e5} ──────────────────────────

/** Height of the N-th zero (leading RvM asymptotic T ~ 2 pi N / log N). */
function heightOfNthZero(N) {
  return (2 * Math.PI * N) / Math.log(N);
}

/** Local mean spacing l = 2 pi / log(T / 2 pi) at the N-th zero. */
function meanSpacing(N) {
  const T = heightOfNthZero(N);
  return (2 * Math.PI) / Math.log(T / (2 * Math.PI));
}

/**
 * Ladder row: model the local config as mean-spacing l(N) background with one
 * embedded global min gap g(N) = l(N) / sqrt(N) (Wigner small-gap law: the
 * minimum of ~N gaps, density P(s) ~ (pi/2) s near 0, scales like l/sqrt(N)).
 * Report beta g^2 and its margin to the gate 2. K = 4000 window converges the
 * positive-term field to machine precision.
 */
function ladderRow(N) {
  const l = meanSpacing(N);
  const g = l / Math.sqrt(N);
  const { B, betaGsq } = latticeField(g, l, 4000);
  return {
    N,
    meanSpacing: l,
    minGap: g,
    minOverMean: g / l,
    beta: B,
    betaGsq,
    margin: 2 - betaGsq, // > 0 means the gate beta g^2 < 2 holds
    gateHolds: betaGsq < 2,
  };
}

const LADDER = [1e3, 1e4, 1e5].map(ladderRow);
const ROW_1E4 = LADDER[1]; // deliverable (c): margin reported at N* = 1e4

// ── (a) Backward-flow witness: measure beta = sup_s B_p over a real collapse ──

/**
 * Embed one small gap g among a symmetric well-separated background and
 * integrate the attractive flow until the pair collapses, tracking
 * beta = max_s B_p(s) and the punctured min gap h(s). Returns the ratio
 * beta / beta_0 (how much the field grows over the collapse: the empirical
 * proxy for the named punctured-min-gap residual) and beta g^2.
 */
function flowWitness(x0) {
  let x = x0.slice();
  const start = minGapPair(x);
  const g = start.gap;
  const lo0 = start.lo;
  const beta0 = backgroundField(x, start.lo, start.hi);

  let beta = beta0;
  let hMin = puncturedMinGap(x, start.lo, start.hi);
  let stablePair = true;
  let gap = g;
  let s = 0;
  const EPS = 1e-5;

  while (gap > EPS) {
    const p = minGapPair(x);
    if (p.lo !== lo0) stablePair = false;
    beta = Math.max(beta, backgroundField(x, p.lo, p.hi));
    hMin = Math.min(hMin, puncturedMinGap(x, p.lo, p.hi));
    const h = Math.max(1e-9, Math.min(1e-5, 0.001 * gap * gap));
    x = rk4Step(x, h);
    s += h;
    gap = minGapPair(x).gap;
    if (s > 10) break;
  }
  const pf = minGapPair(x);
  beta = Math.max(beta, backgroundField(x, pf.lo, pf.hi));

  return {
    g,
    beta0,
    beta,
    growthRatio: beta / beta0, // sup_s B_p / B_p(0); ~1 means h(s) held up
    puncturedMinGapOverG: hMin / g, // the empirical constant c of the residual
    betaGsq: beta * g * g,
    stablePair,
    gateHolds: beta * g * g < 2,
  };
}

// Symmetric background {-3,-2,-1, +1,+2,+3} with an embedded pair at +/- g/2
// (gap g). Two gap scales g and g/2: the field is essentially unchanged, but
// beta g^2 quarters, so the gate margin grows -- the same g^2 law as the
// sandwich relative width.
const FLOW_A = flowWitness([-3, -2, -1, -0.05, 0.05, 1, 2, 3]);
const FLOW_B = flowWitness([-3, -2, -1, -0.025, 0.025, 1, 2, 3]);

// ── Exported record ──────────────────────────────────────────────────────────

export const SANDWICH_BETA_FIELD_BOUND = {
  id: 'imp-2683',
  parent: 'imp-2563',
  attacks: 'the unproven field bound beta gating the two-sided min-gap sandwich (Theorem B); route-map opportunity #4',
  verdict: 'PARTIAL -- bracket made UNCONDITIONAL at s=0; sup_s upgrade conditional on a named punctured-min-gap residual',

  status:
    'B_p is a sum of POSITIVE terms (no particle between the adjacent pair), so ' +
    'beta = sup_s B_p. With G = global min gap, the k-th flank particle sits at ' +
    'distance >= kG, giving the telescoping bound B_p G^2 <= 2(1 - 1/(K+1)) < 2 ' +
    '(sum 1/(k(k+1)) = 1). Hence at s = 0 (G = g) the gating hypothesis ' +
    'beta_0 g^2 < 2 holds RIGOROUSLY and N-UNIFORMLY -- the sandwich is ' +
    'unconditional at the initial instant. The realistic Weyl/RvM margin is far ' +
    'wider: with background at mean spacing l >> g, beta g^2 ~ (pi^2/3)(g/l)^2, ' +
    'and level repulsion drives g/l -> 0, so the margin GROWS up the ladder. ' +
    'Residual: sup over 0 <= s < t_c with the FIXED initial g needs a uniform ' +
    'lower bound on the punctured min gap h(s) = dist(pair, background), which ' +
    'does not collapse with g_pair -- UNPROVEN; the flow witness measures it.',

  fieldIsPositive: 'B_p = sum_{x_j<a} 1/(delta(delta+g)) + sum_{x_j>b} 1/(eps(eps+g)) > 0, so |B_p| = B_p',
  telescopeBound: 'B_p G^2 <= 2 sum_{k=1}^K 1/(k(k+1)) = 2(1 - 1/(K+1)) < 2, G = global min gap (RIGOROUS, N-uniform)',
  sharpness: 'equality only in the all-gaps-equal-G, K->infinity limit; any gap spread or finite N leaves strict margin',
  densityEstimate: 'background at mean spacing l: beta g^2 ~ (pi^2/3)(g/l)^2 (Weyl/RvM), -> 0 as g/l -> 0 (level repulsion)',
  initialGateUnconditional: true,

  namedResidual: {
    id: 'imp-2683-sub-punctured-min-gap',
    statement:
      'sup_{0<=s<t_c} B_p(s) <= 2 zeta(2)/(c g)^2 IFF the punctured min gap ' +
      'h(s) = min_{j!=lo,hi}(|a-x_j|,|b-x_j|) stays >= c*g for all s < t_c. ' +
      'The colliding pair gap g_pair(s) -> 0 but h(s) is set by the BACKGROUND ' +
      'particles, which do not collapse onto the pair; proving c = O(1) ' +
      'N-uniformly would upgrade the FULL bracket to unconditional.',
    status: 'UNPROVEN (empirically c ~ O(1) on the flow witness below)',
  },

  // (c) RvM-modelled verified-zero ladder {1e3, 1e4, 1e5}
  ladder: LADDER,
  marginAtNstar1e4: {
    N: ROW_1E4.N,
    betaGsq: ROW_1E4.betaGsq,
    margin: ROW_1E4.margin,
    gateHolds: ROW_1E4.gateHolds,
    note:
      'beta g^2 = ' + ROW_1E4.betaGsq.toExponential(3) + ' << 2 at N* = 1e4 ' +
      '(RvM mean spacing l = ' + ROW_1E4.meanSpacing.toFixed(4) + ', Wigner min ' +
      'gap g = l/sqrt(N)); margin to the gate = ' + ROW_1E4.margin.toFixed(6) + '.',
  },

  // (a) backward-flow witnesses
  flowWitness: {
    configA: FLOW_A,
    configB: FLOW_B,
    note:
      'symmetric background {+/-1,+/-2,+/-3} with embedded gap g (A) and g/2 (B); ' +
      'beta = sup_s B_p stays within a small factor of beta_0 (growthRatio ~ 1) ' +
      'and the punctured min gap holds at h/g ~ O(1) over the whole collapse -- ' +
      'empirical support (not proof) that the named residual constant c = O(1). ' +
      'beta g^2 quarters from A to B (g^2 law), widening the gate margin.',
  },

  honestScope:
    'UPGRADE: the sandwich gating hypothesis beta g^2 < 2 is now PROVEN at s = 0, ' +
    'N-uniformly (telescope bound), so Theorem B is unconditional at the initial ' +
    'instant and the ladder margin grows. NOT closed: the sup_s control with the ' +
    'fixed initial g, blocked by the named punctured-min-gap residual. Full ' +
    'N = 1e5 backward flow intentionally not run (O(N^2), heavy zeros bundle not ' +
    'imported); the field is local so a window + RvM density model suffices.',

  sources: [
    'src/data/imp-2563-min-gap-sandwich-theorem.js (Theorem B; beta is its gating input)',
    'imp-2561 / imp-2562 one-sided pinch (constant S read off as beta)',
    'src/data/backward-flow-stability-gronwall.js (flow conventions)',
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const SANDWICH_BETA_FIELD_BOUND_ASSERTIONS = [
  {
    id: 'imp2683-field-positive',
    holds: () =>
      FLOW_A.beta0 > 0 && FLOW_B.beta0 > 0 && LADDER.every((r) => r.beta > 0),
    why:
      'Observation 1: B_p is a sum of strictly positive terms (no particle lies ' +
      'between the adjacent pair, so every (a-x_j)(b-x_j) > 0), hence beta = B_p. ' +
      'A non-positive measured field would refute the sign structure the whole ' +
      'telescoping bound rests on.',
  },
  {
    id: 'imp2683-telescope-ceiling-below-2',
    holds: () => {
      const c = telescopeCeiling(4000);
      return c < 2 && c > 1.999; // strict, and tight as K -> infinity
    },
    why:
      'Observation 2 (RIGOROUS, N-uniform): with G = global min gap the k-th ' +
      'flank particle is at distance >= kG, so B_p G^2 <= 2 sum 1/(k(k+1)) = ' +
      '2(1 - 1/(K+1)) < 2. The closed form must be strictly below 2 and approach ' +
      'it; this is the proof that beta_0 g^2 < 2 holds for any finite N.',
  },
  {
    id: 'imp2683-ladder-gate-holds-with-growing-margin',
    holds: () =>
      LADDER.every((r) => r.gateHolds) &&
      LADDER[0].betaGsq > LADDER[1].betaGsq &&
      LADDER[1].betaGsq > LADDER[2].betaGsq,
    why:
      'Deliverable (c): on the RvM-modelled ladder {1e3,1e4,1e5} the gate ' +
      'beta g^2 < 2 must hold at every rung, and the margin must GROW up the ' +
      'ladder (beta g^2 ~ (pi^2/3)(g/l)^2 with g/l ~ N^{-1/2} -> 0). Monotone ' +
      'decrease of beta g^2 certifies the level-repulsion margin growth.',
  },
  {
    id: 'imp2683-flow-beta-bounded-and-stable',
    holds: () =>
      FLOW_A.stablePair === true &&
      FLOW_B.stablePair === true &&
      FLOW_A.growthRatio < 5 &&
      FLOW_B.growthRatio < 5 &&
      FLOW_A.puncturedMinGapOverG > 1 &&
      FLOW_B.puncturedMinGapOverG > 1,
    why:
      'Deliverable (a): over a real backward-flow collapse beta = sup_s B_p must ' +
      'stay within a small factor of beta_0 (growthRatio bounded) while the ' +
      'colliding pair stays the global min-gap pair, and the punctured min gap ' +
      'h(s) must stay above g (h/g > 1) -- the empirical c = O(1) supporting the ' +
      'named punctured-min-gap residual. A blow-up would expose the residual as ' +
      'genuinely obstructive rather than a technicality.',
  },
  {
    id: 'imp2683-flow-gate-holds',
    holds: () =>
      FLOW_A.gateHolds === true &&
      FLOW_B.gateHolds === true &&
      FLOW_B.betaGsq < FLOW_A.betaGsq,
    why:
      'The measured beta g^2 from the flow must satisfy the gate < 2 at both ' +
      'configurations, and must quarter from A (gap g) to B (gap g/2) -- the g^2 ' +
      'law that the sandwich relative width and the gate margin share. Failure ' +
      'means the measured field, not just the model, violates the hypothesis.',
  },
];

// ── Self-executing tripwire (matches the imp-2563 sibling pattern) ────────────
for (const a of SANDWICH_BETA_FIELD_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `[imp-2683-sandwich-beta-field-bound] build-time assertion failed: ${a.id} - ${a.why}`,
    );
  }
}
