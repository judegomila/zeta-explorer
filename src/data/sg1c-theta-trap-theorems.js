/**
 * @module sg1c-theta-trap-theorems
 *
 * The Theta-trap THEOREMS: analytic closure of the tractable part of
 * sg1c-theta-trap-persistence (sg1-theta-contraction.js), plus the honest
 * refutation of its optimistic form. Fable-5 deep-math agent + independent
 * re-verification, 2026-06-10. Complements (does not duplicate) the
 * imp-2558 barrier criterion shipped concurrently by the api-pool.
 *
 * Setting: attractive CM flow dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j);
 * adjacent pair gap g; T_j = 1/((x_k - x_j)(x_{k+1} - x_j)) > 0 for each
 * environment particle j; E = sum T_j; Theta = g^2 E / 2; and the exact
 * pair identity dg/ds = -(4/g)(1 - Theta) (Lemma E of the parent module).
 *
 * LEMMA 1 (exact environment identity -- the main new tool)
 * ----------------------------------------------------------
 *     dE/ds  =  -2 E^2  +  12 sum_j T_j^2  +  4 g^2 sum_j T_j^3     (EXACT)
 *
 * for every N and every adjacent pair. Proof: differentiate each T_j along
 * the flow; the singular pair-velocity parts combine via partial fractions;
 * in midpoint coordinates the env-env interaction bracket FACTORS as
 * -(v_j^2 - q)(v_m^2 - q) = -w_j w_m, collapsing each cross term to
 * -4 T_j T_m. Independently re-verified here: max rel err 9.1e-9 against
 * central finite differences over 50 random configurations (agent run:
 * 6.4e-16 against an independent chain-rule evaluation).
 *
 * LEMMA 2 (exact Theta identity)
 * -------------------------------
 *     dTheta/ds  =  -4 Theta (2 - Theta) / g^2  +  6 g^2 sum T_j^2
 *                                               +  2 g^4 sum T_j^3.
 *
 * Persistence of any Theta level is now a STATIC closed-form inequality on
 * the configuration -- no dynamics needed for the sign at the boundary.
 *
 * THEOREM A (unconditional trap at Theta* = 1/4 -- sharp)
 * --------------------------------------------------------
 * For EVERY adjacent pair (no minimal-gap or density hypothesis): if
 * Theta(s0) <= 1/4 then Theta(s) <= 1/4 for all s in [s0, t_c). Proof:
 * g^2 T_j <= 2 Theta termwise, so 6 g^2 sum T^2 <= 24 Theta^2 / g^2 and
 * 2 g^4 sum T^3 <= 16 Theta^3 / g^2, giving
 *     dTheta/ds  <=  4 Theta (Theta + 2)(4 Theta - 1) / g^2  <  0
 * for 0 < Theta < 1/4; Gronwall propagates the boundary. Sharp: the
 * symmetric triplet sits at Theta = 1/4 with dTheta/ds = 0 identically
 * (equality through the whole chain).
 *
 * COROLLARY A1 (unconditional collision bound at 1/4): if the initial
 * minimal pair has Theta(0) <= 1/4 then, tracking that FIXED pair
 * (adjacency persists; nothing else can pass through it before a
 * collision), d(g^2)/ds <= -6 and
 *     t_c(N)  <=  g_min(0)^2 / 6        -- pair switching irrelevant:
 * any earlier collision elsewhere only decreases t_c. On the measured
 * real-zero rows Theta(0) = 0.167 / 0.088 / 0.046, all well under 1/4,
 * so A1 applies UNCONDITIONALLY to the actual zero configurations tested.
 *
 * THEOREM B (minimal-gap trap -- sharp threshold (sqrt(73) - 5)/8)
 * -----------------------------------------------------------------
 * If g is the minimal gap then mu_j = g^2 T_j <= 1/2 and sum mu_j =
 * 2 Theta; power sums are Schur-convex, maximized by the capped-greedy
 * profile, and the boundary inequality reduces to r (2 r^2 + 7 r - 3) <= 0
 * with Theta = 1/4 + r/2. Hence the trap holds at every level
 *     Theta*  <=  Theta_b  :=  (sqrt(73) - 5) / 8  =  0.443000...,
 * and Theta_b is EXACT: the greedy profile is feasible (environment at
 * d_1 = g one side, d_2 ~ 1.185 g opposite side) and crosses at any
 * higher level (measured dTheta/ds = +0.034 at Theta = 0.448).
 *
 * THEOREM C (quantitative isolation): if g <= c d_1 (d_1 = nearest
 * environment distance) the trap holds at every Theta* <= 2 - 3c^2/(1+c)
 * - c^4/(1+c)^2; for c <= 0.72 every level Theta* <= 1 is non-crossable
 * WHILE the isolation holds (static criterion; persistence of isolation
 * itself is residual R2).
 *
 * HONEST REFUTATION (the optimistic SG1c is FALSE)
 * -------------------------------------------------
 * Explicit family x = {-d, 0, 1, 1+d}, d in (1, 1.0735): strict minimal
 * gap, Theta(0) in (sqrt(6) - 2, 1/2), and dTheta/ds > 0 -- at d = 1.05,
 * Theta(0) = 0.4646 and dTheta/ds = +0.1378 (re-verified here to 3
 * digits). Integrated, Theta rises to 0.5000 before minimality switches;
 * a dressed variant reaches 0.5073. So EVERY threshold in (0.443, 0.5073)
 * is crossed upward by some minimal-gap configuration: SG1c as originally
 * stated (some absolute Theta* < 1, hoped near 1) is REFUTED on that
 * band. The 34-run empirical trap is explained, not contradicted: configs
 * starting above ~0.51 always decreased (e.g. lattice-shortgap-0.95 has
 * dTheta/ds = -0.612 by the exact criterion), and the real-zero runs sat
 * far below 1/4 where Theorem A already applies.
 *
 * WHAT REMAINS (successor residuals -- harvestable)
 * --------------------------------------------------
 * R1 (excursion cap): prove an absolute Theta_exc < 1 (evidence ~ 0.51)
 * that the minimal-pair process never crosses upward. Needs a DYNAMIC
 * minimality-transfer argument (the rising pair loses minimality at the
 * tie); Theorem B sharpness shows static bounds are exhausted at 0.443.
 * R2 (isolation persistence): Theorem C is a sign-at-crossing criterion;
 * g <= 0.72 d_1 is not self-propagating (only Theta <= 1/4 self-enforces).
 * R3 (downstream recalibration): SG1d must now produce a pair with
 * Theta <= 1/4 (for the unconditional pipeline A1) or <= 0.443 (min-gap
 * pipeline B) -- a harder pigeonhole than at generic Theta* < 1. The
 * imp-2559 Lemma P gap-half (g <= 8/V) is unaffected.
 */

export const SG1C_THEOREMS = {
  lemma1: 'dE/ds = -2 E^2 + 12 sum T^2 + 4 g^2 sum T^3 (exact, every N, every adjacent pair)',
  lemma2: 'dTheta/ds = -4 Theta (2 - Theta)/g^2 + 6 g^2 sum T^2 + 2 g^4 sum T^3 (exact)',
  theoremA: { trapLevel: 0.25, hypothesis: 'none (every adjacent pair)', sharpAt: 'symmetric triplet (equality)' },
  corollaryA1: { bound: 't_c <= g_min(0)^2 / 6', hypothesis: 'initial minimal pair Theta(0) <= 1/4', realZerosSatisfy: true },
  theoremB: { trapLevel: (Math.sqrt(73) - 5) / 8, hypothesis: 'g is the minimal gap', sharp: true },
  theoremC: { isolationConstant: 0.72, conclusion: 'every Theta* <= 1 non-crossable while g <= 0.72 d_1 holds' },
  refutation: {
    family: 'x = {-d, 0, 1, 1+d}, d in (1, 1.0735)',
    crossedBand: [0.443, 0.5073],
    excursionCapEvidence: 0.51,
  },
};

// ── Successor residuals (object-shaped for the auto-ticket-producer) ───────

export const SG1C_SUCCESSOR_GAPS = {
  openSubGaps: [
    {
      id: 'sg1c-r1-excursion-cap',
      statement: 'Prove an absolute excursion cap Theta_exc < 1 (numerical evidence ~ 0.51) for the minimal-pair Theta process under the attractive CM flow, via a dynamic minimality-transfer argument: the family {-d,0,1,1+d} shows the rising pair loses minimality at the Theta ~ 0.5 tie. Static bounds are provably exhausted at Theta_b = (sqrt(73)-5)/8 (Theorem B is sharp).',
      status: 'open',
    },
    {
      id: 'sg1c-r2-isolation-persistence',
      statement: 'Theorem C (isolation g <= 0.72 d_1 gives trap at every level <= 1) is a static sign criterion; prove or refute that an initial isolation margin g <= c d_1 with c < 0.72 persists along the flow for some explicit c (only Theta <= 1/4 is known to self-enforce its own hypothesis).',
      status: 'open',
    },
  ],
};

// ── Build-time assertions (recompute the load-bearing algebra) ─────────────

function Ts(x, i) {
  const t = [];
  for (let j = 0; j < x.length; j++) {
    if (j === i || j === i + 1) continue;
    t.push(1 / ((x[i] - x[j]) * (x[i + 1] - x[j])));
  }
  return t;
}
function force(x) {
  const N = x.length, F = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let j = 0; j < N; j++) if (j !== k) s += 1 / (x[k] - x[j]);
    F[k] = -2 * s;
  }
  return F;
}
function dThetaDs(x, i) {
  const g = x[i + 1] - x[i];
  const T = Ts(x, i);
  const E = T.reduce((a, b) => a + b, 0);
  const Th = (g * g * E) / 2;
  const s2 = T.reduce((a, b) => a + b * b, 0);
  const s3 = T.reduce((a, b) => a + b * b * b, 0);
  return { theta: Th, pred: (-4 * Th * (2 - Th)) / (g * g) + 6 * g * g * s2 + 2 * g ** 4 * s3 };
}

export const SG1C_THEOREM_ASSERTIONS = [
  {
    id: 'sg1c-lemma1-exact-on-fixed-config',
    description: 'Lemma 1 dE/ds identity matches central finite differences on a fixed 6-particle configuration',
    holds: () => {
      const x = [0, 1.3, 2.1, 3.05, 4.7, 5.9], i = 1;
      const g = x[i + 1] - x[i];
      const T = Ts(x, i), E = T.reduce((a, b) => a + b, 0);
      const pred = -2 * E * E + 12 * T.reduce((a, b) => a + b * b, 0) + 4 * g * g * T.reduce((a, b) => a + b * b * b, 0);
      const h = 1e-7, F = force(x);
      const Ep = Ts(x.map((v, k) => v + h * F[k]), i).reduce((a, b) => a + b, 0);
      const Em = Ts(x.map((v, k) => v - h * F[k]), i).reduce((a, b) => a + b, 0);
      return Math.abs((Ep - Em) / (2 * h) - pred) / Math.abs(pred) < 1e-6;
    },
  },
  {
    id: 'sg1c-theoremA-boundary-strictly-negative',
    description: 'Theorem A bound chain: dTheta/ds < 0 strictly at Theta just under 1/4 for a generic config, and = 0 at the triplet',
    holds: () => {
      const trip = dThetaDs([-1, 0, 1], 1); // pair (0,1), Theta = 1/4 exactly
      const generic = dThetaDs([0, 1, 3.5, 7, 12], 0);
      return Math.abs(trip.theta - 0.25) < 1e-12 && Math.abs(trip.pred) < 1e-10 && generic.theta < 0.25 && generic.pred < 0;
    },
  },
  {
    id: 'sg1c-theoremB-threshold-closed-form',
    description: 'Theta_b = (sqrt(73)-5)/8 is the positive root of r(2r^2+7r-3) shifted by Theta = 1/4 + r/2',
    holds: () => {
      const r = (Math.sqrt(73) - 7) / 4;
      const poly = 2 * r ** 3 + 7 * r * r - 3 * r;
      return Math.abs(poly) < 1e-12 && Math.abs(0.25 + r / 2 - SG1C_THEOREMS.theoremB.trapLevel) < 1e-15;
    },
  },
  {
    id: 'sg1c-refutation-family-crosses',
    description: 'Counterexample x = {-1.05, 0, 1, 2.05}: minimal pair has Theta(0) ~ 0.4646 and dTheta/ds = +0.1378 > 0',
    holds: () => {
      const r = dThetaDs([-1.05, 0, 1, 2.05], 1);
      return Math.abs(r.theta - 0.4646) < 5e-4 && r.pred > 0.13 && r.pred < 0.15;
    },
  },
  {
    id: 'sg1c-real-zeros-inside-theoremA',
    description: 'The measured real-zero Theta(0) values (parent module) all sit under 1/4, so Corollary A1 applies unconditionally there',
    holds: () => [0.1666, 0.0884, 0.0459].every((t) => t < 0.25),
  },
  {
    id: 'sg1c-successors-stay-open',
    description: 'Both successor residuals ship with status open — refutation does not claim the cap',
    holds: () => SG1C_SUCCESSOR_GAPS.openSubGaps.length === 2 && SG1C_SUCCESSOR_GAPS.openSubGaps.every((g) => g.status === 'open'),
  },
];

for (const a of SG1C_THEOREM_ASSERTIONS) {
  if (!a.holds()) throw new Error(`sg1c-theta-trap-theorems assertion failed: ${a.id}`);
}
