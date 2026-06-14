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
 *
 * LEMMA R1-T (minimality-transfer certificate -- PARTIAL closure of R1)
 * --------------------------------------------------------------------
 * The dynamic transfer mechanism is now rigorous on the symmetric family
 * that DEFINES the excursion band. Write a symmetric 4-config as
 * {-(g/2 + e), -g/2, g/2, g/2 + e}: central pair gap g (minimal while
 * e > g), outer gaps e. The minimality TIE is e = g, where the config is
 * a uniform lattice at spacing g. Because Theta = g^2 E / 2 is invariant
 * under uniform scaling, the central pair sits at Theta = 1/2 EXACTLY at
 * the tie, for every scale. At that lattice the two outer pairs each carry
 * Theta = 1/3 < 1/2, and the exact pair identity dg/ds = -(4/g)(1 - Theta)
 * gives outer dg/ds = -8/(3g) STRICTLY below central dg/ds = -2/g: the
 * outer gaps shrink faster, so just past the tie an outer pair becomes the
 * unique minimum and SEIZES minimality, resetting the tracked minimal-pair
 * Theta from 1/2 down to 1/3. Hence the minimal-pair excursion on the whole
 * symmetric refutation family is capped at exactly 1/2 < 1 -- the rising
 * central pair can never carry Theta above 1/2 while remaining minimal, and
 * loses minimality precisely at 1/2. This is the dynamic argument R1 asked
 * for, realised on the band-defining family; the residual is to extend the
 * transfer dominance to ASYMMETRIC minimal-gap configs (the dressed variant
 * breaks the symmetry to push the tie marginally to ~0.5073), i.e. to show
 * the seizing pair always carries strictly lower Theta than the tie value.
 *
 * LEMMA R1-T2 (asymmetric/dressed extension + static-route obstruction, imp-2608)
 * ------------------------------------------------------------------------------
 * Two findings carry R1-T off the symmetric 4-config. (i) THE MECHANISM IS
 * ROBUST: across a 1.3e5-config adversarial sweep of asymmetric and dressed
 * minimal-gap ties (4-14 particles, unequal outer counts, far dressers at gap
 * > 1) the tracked central minimal pair ALWAYS sheds minimality to a competitor
 * carrying strictly lower Theta -- seizing margin Theta_c - Theta_seize >=
 * +2.0e-3 > 0, zero violations. Since dg/ds = -(4/g)(1 - Theta) is strictly
 * decreasing in Theta at fixed g, "competitor seizes" is EXACTLY "competitor has
 * the lower Theta", so the qualitative transfer (the rising pair loses
 * minimality at every tie) holds far beyond the symmetric family. (ii) THE
 * STATIC PEAK IS NOT CAPPED BELOW 1: on the uniform lattice with K unit
 * neighbours per side the central tie value is EXACTLY
 *     Theta_K = K/(K+1)   (telescoping E = 2 sum_{m=1}^K 1/(m(m+1)) = 2K/(K+1)),
 * so Theta_K rises monotonically to 1 as K -> infinity (K = 1 recovers the R1-T
 * value 1/2; K = 6 already gives 6/7 = 0.857), and the seizing margin shrinks to
 * 0+ along the same family. Hence NO static tie comparison can deliver an
 * absolute cap Theta_exc < 1 -- the candidate route named in the ticket (bound
 * the tie value statically) is provably obstructed. CONSEQUENCE: a cap < 1 must
 * be DYNAMICAL -- it has to show the attractive CM flow, started from generic
 * (real-zero-like) data, never drives the minimal-gap locus onto a long
 * near-uniform lattice. R1 is hereby refined to that dynamical reachability
 * residual; the static half is closed as an obstruction, not as a cap.
 *
 * LEMMA R1-T3 (asymmetric 4-tie: exact closed-form seizing margin, imp-2628)
 * --------------------------------------------------------------------------
 * R1-T2 carried the seizing MECHANISM to asymmetric ties only numerically
 * (1.3e5-config sweep, margin >= 2e-3). Here the band-defining asymmetric
 * minimal-gap 4-tie is closed in EXACT CLOSED FORM. Scale to central gap 1 and
 * write the one-sided asymmetric tie {-1, 0, 1, 1+b}: central pair (0,1) gap 1;
 * the left outer pair (-1,0) is the gap-1 competitor TIED for minimal; the
 * right gap b >= 1 is the asymmetry parameter (b = 1 is the symmetric uniform
 * lattice). Direct evaluation of Theta = g^2 E / 2 gives
 *     Theta_central(b) = 1/4 + 1 / (2 b (b+1)),
 *     Theta_seize(b)   = 1/4 + 1 / (2 (b+1)(b+2)),
 * so the seizing margin is the EXACT rational
 *     Theta_central - Theta_seize = 1 / ( b (b+1) (b+2) )  >  0   for all b >= 1.
 * Three consequences, all honest: (i) the tied competitor carries STRICTLY
 * lower Theta across the entire asymmetric family, the asymmetry penalty now
 * quantified in closed form -- the margin falls monotonically from 1/6 at b=1
 * (recovering R1-T) toward 0+ as b -> infinity; (ii) the central tie value
 * Theta_central(b) is MAXIMISED at b=1 (the symmetric point) where it equals
 * 1/2, and asymmetry only LOWERS it, so the excursion peak on the asymmetric
 * 4-tie family is still exactly 1/2; (iii) the margin -> 0+ limit is benign
 * here -- as b -> infinity the far neighbour recedes and Theta_central -> 1/4,
 * i.e. the tie falls INTO the unconditional Theorem-A trap, not above it. So
 * the static seizing argument is fully closed for the 4-particle asymmetric
 * tie. RESIDUAL (unchanged): the multi-body near-uniform lattice R1-T2 found
 * (Theta_K = K/(K+1) -> 1) packs many neighbours so the margin -> 0+ WHILE the
 * tie value rises -- that is the dynamical reachability residual, not a static
 * 4-tie gap.
 *
 * LEMMA R2-T (isolation self-improvement -- PARTIAL closure of R2)
 * ----------------------------------------------------------------
 * Track the pair gap g against the nearest environment distance d_1 and the
 * isolation ratio rho = g / d_1. For the single-dominant-neighbour reduction
 * (one environment particle at distance d_1, the pair on the other side) the
 * ratio obeys the EXACT identity
 *     d(rho)/ds = (g - d_1)/d_1^2 * [ 2/(g + d_1) + 4 (g + d_1)/(d_1 g) ].
 * The bracket is strictly positive, so sign(d rho/ds) = sign(g - d_1): the
 * isolation margin is STRICTLY self-improving (rho decreasing) for every
 * rho < 1, with threshold exactly 1. Hence Theorem C's hypothesis
 * g <= 0.72 d_1 is SELF-PROPAGATING against the nearest neighbour -- it does
 * not merely hold at the crossing instant, it tightens. (Derivation: the
 * three velocities give numerator (g-d_1)[2/(g+d_1)+4(g+d_1)/(d_1 g)] after
 * the env-env partial-fraction cancellation; re-verified to 1e-15 here.)
 * Multi-body: an adversarial scan (3e6 random configs, up to 7 particles,
 * both sides) finds the infimum of rho among margin-worsening (d rho/ds > 0)
 * configs is 0.943 -- attained only near a uniform lattice -- so c = 0.72
 * sits 0.22 below the empirical self-improvement threshold. This UPGRADES
 * Theorem C from a static sign-at-crossing criterion to a dynamically
 * self-enforcing one for every c <= 0.72.
 * R2 (residual): a CLOSED-FORM multi-body constant -- prove the lattice-like
 * 0.943 (or any explicit c in [0.72, 1)) rigorously; only the single-
 * neighbour c = 1 and the unconditional Theta <= 1/4 trap are fully closed.
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
  lemmaR2T: 'd(g/d_1)/ds = (g-d_1)/d_1^2 * [2/(g+d_1) + 4(g+d_1)/(d_1 g)] (exact, single nearest neighbour): margin self-improves for rho<1; multi-body inf threshold ~0.943 > 0.72, so g <= 0.72 d_1 is self-propagating',
  lemmaR1T2: 'uniform-lattice central tie Theta_K = K/(K+1) (E = 2K/(K+1), telescoping) rises to 1 as K->inf, so the static excursion peak is NOT capped < 1; the seizing mechanism (the competitor with strictly lower Theta seizes, margin > 0) nonetheless extends to asymmetric/dressed ties -- R1 refined to a dynamical reachability residual',
  lemmaR1T3: 'asymmetric minimal-gap 4-tie {-1,0,1,1+b} (b>=1): EXACT seizing margin Theta_central - Theta_seize = 1/(b(b+1)(b+2)) > 0, recovering 1/6 at the symmetric b=1; Theta_central(b) = 1/4 + 1/(2b(b+1)) is maximised at b=1 (=1/2) so asymmetry only lowers the tie and the 4-tie excursion peak stays exactly 1/2 (and Theta_central -> 1/4 into the Theorem-A trap as b->inf); closes the static asymmetric 4-tie case in closed form, leaving the multi-body near-uniform lattice as the dynamical residual',
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
      progress: 'PARTIAL (Lemma R1-T, imp-2595; extended R1-T2, imp-2608). R1-T caps the symmetric 4-config at exactly 1/2 (outer pairs at Theta = 1/3 shrink faster and seize). R1-T2 (imp-2608) carries the seizing MECHANISM to asymmetric/dressed ties -- a 1.3e5-config sweep finds the competitor that seizes always carries strictly lower Theta (margin > 0, zero violations) -- but PROVES the static peak is uncapped: the uniform lattice with K unit neighbours per side gives central tie Theta_K = K/(K+1) -> 1 (K=1 is the 1/2 case, K=6 already 6/7). So the static tie-comparison route named here is obstructed; the residual is now DYNAMICAL: show the attractive CM flow from generic (real-zero-like) data never reaches a long near-uniform minimal-gap lattice. R1-T3 (imp-2628) closes the asymmetric 4-particle tie {-1,0,1,1+b} IN EXACT CLOSED FORM: the tied competitor seizing margin is 1/(b(b+1)(b+2)) > 0 for all b >= 1 (=1/6 at the symmetric b=1), Theta_central = 1/4 + 1/(2b(b+1)) is maximised at b=1 (=1/2) so asymmetry only lowers the peak, and Theta_central -> 1/4 (the Theorem-A trap) as the far neighbour recedes -- the margin -> 0+ limit is benign on this family. Only the multi-body near-uniform lattice (margin -> 0+ while the tie value rises) remains, the same dynamical residual.',
    },
    {
      id: 'sg1c-r2-isolation-persistence',
      statement: 'Theorem C (isolation g <= 0.72 d_1 gives trap at every level <= 1) is a static sign criterion; prove or refute that an initial isolation margin g <= c d_1 with c < 0.72 persists along the flow for some explicit c (only Theta <= 1/4 is known to self-enforce its own hypothesis).',
      status: 'open',
      progress: 'PARTIAL (Lemma R2-T, imp-2596): the isolation ratio rho = g/d_1 against the nearest environment particle obeys the EXACT single-neighbour identity d(rho)/ds = (g-d_1)/d_1^2 * [2/(g+d_1) + 4(g+d_1)/(d_1 g)]; the bracket is strictly positive, so sign(d rho/ds) = sign(g - d_1) and the margin STRICTLY self-improves for every rho < 1 (threshold exactly 1). So g <= 0.72 d_1 is self-propagating against the nearest neighbour -- it tightens, not merely holds. An adversarial 3e6-config multi-body scan (up to 7 particles, both sides) puts the worsening-onset infimum at rho ~ 0.943 (only near a uniform lattice), 0.22 above c = 0.72. RESIDUAL: a closed-form multi-body constant proving the ~0.943 (or any explicit c in [0.72, 1)) rigorously; only single-neighbour c = 1 and the unconditional Theta <= 1/4 trap are fully closed.',
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
// Lemma R2-T: instantaneous rate of the isolation ratio rho = g / d_1, where
// d_1 is the distance from the tracked pair to its nearest environment particle.
function dRhoIso(x, i) {
  const F = force(x);
  const a = x[i], b = x[i + 1], g = b - a;
  let d1 = Infinity, jp = -1, side = 0;
  for (let j = 0; j < x.length; j++) {
    if (j === i || j === i + 1) continue;
    const dl = a - x[j], dr = x[j] - b;
    if (dl > 0 && dl < d1) { d1 = dl; jp = j; side = -1; }
    if (dr > 0 && dr < d1) { d1 = dr; jp = j; side = 1; }
  }
  const gdot = F[i + 1] - F[i];
  const d1dot = side === -1 ? F[i] - F[jp] : F[jp] - F[i + 1];
  return { rho: g / d1, drho: (gdot * d1 - g * d1dot) / (d1 * d1), g, d1 };
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
    id: 'sg1c-r1-minimality-transfer-certificate',
    description: 'Lemma R1-T: at the symmetric-family minimality tie (uniform lattice, any scale) the central rising pair sits at Theta = 1/2 with dTheta/ds > 0, while each outer pair carries Theta = 1/3 with a strictly more-negative dg/ds, seizing minimality and capping the excursion at 1/2',
    holds: () => {
      const lat = [-3, -1, 1, 3]; // uniform tie lattice (Theta is scale-invariant)
      const central = dThetaDs(lat, 1); // central rising pair (-1, 1)
      const outer = dThetaDs(lat, 0); // outer pair (-3, -1) that seizes minimality
      const dgDs = (i, th) => (-4 / (lat[i + 1] - lat[i])) * (1 - th);
      return (
        Math.abs(central.theta - 0.5) < 1e-12 &&
        central.pred > 0 &&
        Math.abs(outer.theta - 1 / 3) < 1e-12 &&
        dgDs(0, outer.theta) < dgDs(1, central.theta) - 1e-12
      );
    },
  },
  {
    id: 'sg1c-r1-asymmetric-extension-and-static-obstruction',
    description: 'Lemma R1-T2 (imp-2608): the uniform-lattice central tie obeys Theta_K = K/(K+1) (static peak uncapped, -> 1, so the static-comparison route is obstructed), while the seizing competitor keeps strictly lower Theta (margin > 0) on the K=6 lattice and on a representative asymmetric dressed tie',
    holds: () => {
      const uniform = (K) => {
        const pts = [-0.5, 0.5];
        for (let t = 1; t <= K; t++) { pts.push(-0.5 - t); pts.push(0.5 + t); }
        pts.sort((a, b) => a - b);
        let ci = -1;
        for (let k = 0; k < pts.length - 1; k++) if (Math.abs(pts[k] + 0.5) < 1e-12 && Math.abs(pts[k + 1] - 0.5) < 1e-12) ci = k;
        return { central: dThetaDs(pts, ci).theta, outer: dThetaDs(pts, ci + 1).theta };
      };
      // closed form Theta_K = K/(K+1), monotone toward 1 -> the static peak is NOT bounded below 1
      const closedForm = [1, 2, 3, 6].every((K) => Math.abs(uniform(K).central - K / (K + 1)) < 1e-10);
      const u6 = uniform(6);
      const uncapped = Math.abs(u6.central - 6 / 7) < 1e-12 && uniform(200).central > 0.99; // Theta_K -> 1
      // seizing mechanism robust: the adjacent competitor carries strictly lower Theta (margin > 0)
      const latticeSeizes = u6.outer < u6.central - 1e-9;
      // representative ASYMMETRIC dressed minimal-gap tie (central pair (-0.5, 0.5), gap 1)
      const asym = [-6, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 4];
      const aC = dThetaDs(asym, 4).theta, aL = dThetaDs(asym, 3).theta, aR = dThetaDs(asym, 5).theta;
      const asymSeizes = aC < 1 && Math.min(aL, aR) < aC - 1e-9;
      return closedForm && uncapped && latticeSeizes && asymSeizes;
    },
  },
  {
    id: 'sg1c-r1-asymmetric-4tie-closed-form-margin',
    description: 'Lemma R1-T3 (imp-2628): on the asymmetric minimal-gap 4-tie {-1,0,1,1+b} the tied left-outer competitor carries strictly lower Theta than the central pair, with EXACT closed forms Theta_central = 1/4 + 1/(2b(b+1)), Theta_seize = 1/4 + 1/(2(b+1)(b+2)) and margin 1/(b(b+1)(b+2)) > 0 (recovering 1/6 at the symmetric b=1); Theta_central is maximised at b=1 (=1/2), so asymmetry only lowers the excursion peak',
    holds: () => {
      const closedMarginAt1 = 1 / (1 * 2 * 3);
      return (
        Math.abs(closedMarginAt1 - 1 / 6) < 1e-15 &&
        [1, 1.05, 1.5, 2, 3, 10].every((b) => {
          const x = [-1, 0, 1, 1 + b];
          const tc = dThetaDs(x, 1).theta; // central pair (0,1)
          const ts = dThetaDs(x, 0).theta; // tied left-outer competitor (-1,0)
          const cC = 0.25 + 1 / (2 * b * (b + 1));
          const cS = 0.25 + 1 / (2 * (b + 1) * (b + 2));
          const cMargin = 1 / (b * (b + 1) * (b + 2));
          return (
            Math.abs(tc - cC) < 1e-12 &&
            Math.abs(ts - cS) < 1e-12 &&
            Math.abs(tc - ts - cMargin) < 1e-12 &&
            tc - ts > 0 &&
            tc <= 0.5 + 1e-12
          );
        })
      );
    },
  },
  {
    id: 'sg1c-r2-isolation-self-improves',
    description: 'Lemma R2-T: exact single-neighbour identity d(g/d_1)/ds = (g-d_1)/d_1^2 * [2/(g+d_1) + 4(g+d_1)/(d_1 g)] (sign = sign(g-d_1), zero at rho=1); and a multi-body config at the Theorem C ratio g = 0.72 d_1 has the isolation margin strictly improving',
    holds: () => {
      // exact 3-body identity at a generic (g, d_1) with g < d_1 (margin improving)
      const g = 0.6, d = 0.85;
      const r3 = dRhoIso([-d, 0, g], 1);
      const closed = ((g - d) / (d * d)) * (2 / (g + d) + 4 * (g + d) / (d * g));
      // sign law on the boundary g = d_1 -> drho = 0 exactly
      const onBoundary = dRhoIso([-0.5, 0, 0.5], 1);
      // multi-body, env both sides, at the Theorem C isolation ratio rho = 0.72
      const multi = dRhoIso([-1, 0, 0.72, 1.9, 2.8], 1);
      return (
        Math.abs(r3.drho - closed) < 1e-9 &&
        r3.drho < 0 &&
        Math.abs(onBoundary.drho) < 1e-12 &&
        Math.abs(multi.rho - 0.72) < 1e-12 &&
        multi.drho < 0
      );
    },
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
