/**
 * @module imp-ctheta-uniform-bound
 * @fileoverview imp-2858 — extract the Theta-trap CONTRACTION constant C_Theta
 * from THEOREM A of sg1c-theta-trap-theorems.js, give it an EXPLICIT uniform
 * upper bound, and certify that bound is N-uniform on the ladder [100, 1e4]
 * (symbolic source + numerical sweep). This is a genuine BOUNDED constant
 * discharge for the rigorous CM-flow machinery.
 *
 * WHICH C_Theta THIS IS (and which it is NOT)
 * -------------------------------------------
 * Two distinct constants in the program both wear the name "C_Theta"; they
 * must not be conflated:
 *
 *   (A) The CONTRACTION constant of THEOREM A (this module). It governs the
 *       g^2-normalized differential inequality that drives Theta DOWN once the
 *       minimal-pair level is inside the trap (Theta <= 1/4). It is a pure
 *       number, N-independent, and BOUNDED. That is what imp-2858 discharges.
 *
 *   (B) The W_1-Wasserstein Lipschitz modulus C_Theta of imp-2680
 *       (imp-2680-theta-lipschitz-uniformity.js): sup |Delta Theta_eff| / W_1
 *       at the microscopic collision scale. That object DIVERGES (~ linear in
 *       N) because it divides the level shift by the colliding gap, which
 *       shrinks like 1/sqrt(N). imp-2680 retired the imp-2662 endpoint route on
 *       that ground.
 *
 * These do NOT contradict. (A) lives INSIDE the g^2-normalized flow inequality
 * (the gap factor is absorbed into the dimensionless Theta); (B) measures the
 * transport sensitivity of the level AFTER reintroducing the gap scale. The
 * trap CONTRACTION being N-uniform and the W_1 SENSITIVITY being N-unbounded
 * are simultaneously true statements about different quantities -- exactly the
 * "bounded constant, distinct from the divergent C_Lip" the ticket names.
 *
 * THE CONTRACTION CONSTANT (symbolic source)
 * ------------------------------------------
 * Lemma 2 of sg1c is the EXACT level identity (every N, every adjacent pair):
 *     dTheta/ds = -4 Theta (2 - Theta) / g^2 + 6 g^2 sum_j T_j^2 + 2 g^4 sum_j T_j^3,
 * with T_j = 1 / ((x_k - x_j)(x_{k+1} - x_j)) > 0 and Theta = g^2 E / 2,
 * E = sum_j T_j. Split off the destabilising (positive) forcing:
 *     F_plus := 6 g^2 sum_j T_j^2 + 2 g^4 sum_j T_j^3.
 * The single termwise inequality
 *     mu_j := g^2 T_j <= 2 Theta      (because sum_j mu_j = g^2 E = 2 Theta, T_j > 0)
 * yields, with NO N anywhere,
 *     6 g^2 sum T_j^2 = (6/g^2) sum mu_j T_j <= (6/g^2)(2 Theta) E = 24 Theta^2 / g^2,
 *     2 g^4 sum T_j^3 = (2 g^2) sum mu_j T_j^2 <= (2/g^2)(2 Theta)^2 E = 16 Theta^3 / g^2.
 * Define the dimensionless CONTRACTION-FORCING constant
 *     C_Theta(config) := F_plus * g^2 / Theta^2.
 * Then EXACTLY (the central claim of this module)
 *     C_Theta(config) <= 24 + 16 Theta      for every N and every adjacent pair,
 * and inside the unconditional trap Theta <= 1/4 (Theorem A),
 *     C_Theta <= 24 + 16 * (1/4) = 28        (the explicit N-uniform bound).
 * The net flow then obeys
 *     dTheta/ds <= 4 Theta (4 Theta - 1)(Theta + 2) / g^2 < 0   for 0 < Theta < 1/4,
 * i.e. the bounded constant C_Theta = 28 is exactly what makes the destabilising
 * forcing lose to the -4 Theta(2 - Theta)/g^2 restoring term throughout the trap.
 *
 * VERDICT (honest, POSITIVE): C_Theta is N-UNIFORM and BOUNDED by 28.
 * -------------------------------------------------------------------
 * The bound 24 + 16 Theta <= 28 is symbolic and carries no N. The numerical
 * sweep below builds isolated-minimal-pair configurations (the real-zero
 * regime, Theta < 1/4) at N in {100, 300, 1000, 3000, 10000} and measures the
 * realised C_Theta(config): it is FLAT in N (~4.35, varying < 3% across two
 * decades of N, in fact mildly DECREASING) and sits far below the ceiling 28 --
 * the termwise bound is loose because a spread environment carries many small
 * T_j. Both facts confirm uniformity. Unlike the divergent W_1 modulus (B),
 * THIS contraction constant is a genuine bounded discharge: the Theta-trap
 * instrument (opportunity #2) is N-uniform away from the collision.
 *
 * @see sg1c-theta-trap-theorems.js (THEOREM A trap; Lemma 2 level identity)
 * @see imp-2680-theta-lipschitz-uniformity.js (the DIVERGENT W_1 modulus -- distinct)
 * @see imp-2627-theta-certification.js (per-N Theta(0) <= 1/4 certification)
 */

// ── Symbolic constants (Theorem A bound chain) ─────────────────────────────

// Trap boundary (Theorem A, sharp): the level is unconditionally trapped here.
const THETA_TRAP_CEILING = 0.25;

// Explicit N-uniform upper bound on the contraction-forcing constant on [0, 1/4]:
// C_Theta <= 24 + 16 Theta, maximised at the trap boundary Theta = 1/4.
const C_THETA_AFFINE = (theta) => 24 + 16 * theta;
const C_THETA_EXPLICIT_BOUND = C_THETA_AFFINE(THETA_TRAP_CEILING); // = 28

// Ladder of zero-counts to probe for N-uniformity.
const N_LADDER = [100, 300, 1000, 3000, 10000];

// ── Isolated-minimal-pair configuration (the real-zero regime) ─────────────
// A spacing-1 lattice with the central pair pulled to gap 0.3 (isolated short
// gap, Theta well under 1/4). As N grows the convergent environment tail adds
// a vanishing increment, so Theta and C_Theta both saturate -- the numerical
// face of N-uniformity.
function buildConfig(N) {
  const half = Math.floor((N - 2) / 2);
  const xs = [];
  for (let i = half; i >= 1; i--) xs.push(-(0.15 + i));     // left lattice flank
  xs.push(-0.15, 0.15);                                     // central minimal pair, gap 0.3
  for (let i = 1; i <= N - 2 - half; i++) xs.push(0.15 + i); // right lattice flank
  return xs;
}

// Probe one ladder rung: locate the central minimal pair, evaluate the exact
// Lemma 2 ingredients over ALL environment particles, and read off C_Theta.
function probeRung(N) {
  const x = buildConfig(N);
  let k = -1;
  for (let i = 0; i < x.length - 1; i++) {
    if (Math.abs(x[i] + 0.15) < 1e-12 && Math.abs(x[i + 1] - 0.15) < 1e-12) k = i;
  }
  const g = x[k + 1] - x[k];
  let E = 0, s2 = 0, s3 = 0, maxMu = 0;
  for (let j = 0; j < x.length; j++) {
    if (j === k || j === k + 1) continue;
    const T = 1 / ((x[k] - x[j]) * (x[k + 1] - x[j]));
    E += T; s2 += T * T; s3 += T * T * T;
    if (g * g * T > maxMu) maxMu = g * g * T; // mu_j = g^2 T_j
  }
  const theta = (g * g * E) / 2;
  const fPlus = 6 * g * g * s2 + 2 * g ** 4 * s3;
  const cTheta = (fPlus * g * g) / (theta * theta);
  return {
    N: x.length,
    g,
    theta,
    cTheta,                              // realised F_plus * g^2 / Theta^2
    cThetaCeil: C_THETA_AFFINE(theta),   // symbolic affine bound 24 + 16 Theta
    termwiseRatio: maxMu / (2 * theta),  // max_j mu_j / (2 Theta) -- the source inequality, must be <= 1
    netRate: -4 * theta * (2 - theta) / (g * g) + fPlus, // dTheta/ds, must be < 0 in the trap
  };
}

const PROBE = N_LADDER.map(probeRung);
const C_THETA_VALUES = PROBE.map((p) => p.cTheta);
const C_THETA_MAX = Math.max(...C_THETA_VALUES);
const C_THETA_MIN = Math.min(...C_THETA_VALUES);
// N-uniformity witness: spread of the realised constant across two decades of N.
const C_THETA_REL_SPREAD = (C_THETA_MAX - C_THETA_MIN) / C_THETA_MIN;

export const IMP_CTHETA_UNIFORM_BOUND = {
  ticket: 'imp-2858',
  proofSection: 'S7',
  title:
    'Explicit N-uniform bound on the Theta-trap contraction constant C_Theta ' +
    '(Theorem A), distinct from the divergent W_1 modulus of imp-2680',
  kind: 'BOUNDED constant discharge (symbolic bound + numerical N-uniformity sweep).',
  symbolicSource:
    'Lemma 2 (sg1c) + termwise mu_j = g^2 T_j <= 2 Theta give C_Theta := F_plus * g^2 / Theta^2 ' +
    '<= 24 + 16 Theta, hence <= 28 on the unconditional trap Theta <= 1/4; no N appears.',
  cThetaDefinition: 'C_Theta(config) = (6 g^2 sum T^2 + 2 g^4 sum T^3) * g^2 / Theta^2',
  cThetaAffineBound: '24 + 16 Theta',
  cThetaExplicitBound: C_THETA_EXPLICIT_BOUND, // 28
  thetaTrapCeiling: THETA_TRAP_CEILING,
  nLadder: N_LADDER,
  probe: PROBE,
  cThetaValues: C_THETA_VALUES,
  cThetaMax: C_THETA_MAX,
  cThetaRelSpread: C_THETA_REL_SPREAD,
  distinctFrom: {
    module: 'imp-2680-theta-lipschitz-uniformity.js',
    object: 'W_1-Wasserstein Lipschitz modulus sup |Delta Theta_eff| / W_1 at the collision scale',
    behaviour: 'DIVERGENT (~ linear in N) -- divides the level shift by the shrinking colliding gap',
    reconciliation:
      'No contradiction: (A) the contraction constant lives inside the g^2-normalised flow ' +
      'inequality (gap absorbed into the dimensionless Theta) and is bounded; (B) the W_1 modulus ' +
      'reintroduces the gap scale and so is unbounded. Different quantities.',
  },
  verdict:
    'POSITIVE. The Theta-trap CONTRACTION constant is C_Theta <= 24 + 16 Theta <= 28, an EXPLICIT ' +
    'N-uniform bound from a single termwise inequality valid for every N and every adjacent pair. ' +
    'Numerically the realised constant is FLAT in N (~4.35, relative spread < 3% across N in ' +
    '[100, 1e4], mildly decreasing) and far below the ceiling 28. The Theta-trap instrument is ' +
    'N-uniform; this is a genuine bounded discharge, NOT the divergent W_1 modulus of imp-2680.',
  honestScope:
    'This certifies ONLY the contraction constant of Theorem A (the level-driving inequality inside ' +
    'the Theta <= 1/4 trap). It does NOT close the divergent W_1-Lipschitz modulus (imp-2680), nor ' +
    'does it claim the trap hypothesis Theta(0) <= 1/4 holds for all configs (that is the separate ' +
    'reachability residual of sg1c R1-T4). No refereed bound is changed.',
};

// ── Build-time assertions (recompute the load-bearing algebra) ─────────────

export const IMP_CTHETA_ASSERTIONS = [
  {
    id: 'ctheta-explicit-bound-is-28',
    description: 'The explicit uniform bound is the trap-boundary value 24 + 16*(1/4) = 28',
    holds: () => Math.abs(C_THETA_EXPLICIT_BOUND - 28) < 1e-12,
  },
  {
    id: 'ctheta-termwise-source-holds',
    description: 'The symbolic source mu_j = g^2 T_j <= 2 Theta holds on every ladder rung (max ratio <= 1)',
    holds: () => PROBE.every((p) => p.termwiseRatio <= 1 + 1e-12),
  },
  {
    id: 'ctheta-realised-under-affine-bound',
    description: 'On every rung the realised C_Theta sits under the symbolic affine bound 24 + 16 Theta',
    holds: () => PROBE.every((p) => p.cTheta <= p.cThetaCeil + 1e-9),
  },
  {
    id: 'ctheta-realised-under-explicit-28',
    description: 'On every rung the realised C_Theta sits under the explicit trap bound 28',
    holds: () => PROBE.every((p) => p.cTheta <= C_THETA_EXPLICIT_BOUND),
  },
  {
    id: 'ctheta-probe-stays-in-trap',
    description: 'Every probed isolated-minimal-pair config has Theta < 1/4 (the trap regime where the 28 bound applies)',
    holds: () => PROBE.every((p) => p.theta > 0 && p.theta < THETA_TRAP_CEILING),
  },
  {
    id: 'ctheta-N-uniform-flat',
    description: 'The realised C_Theta is N-uniform: relative spread across N in [100, 1e4] is under 5% (measured ~3%)',
    holds: () => C_THETA_REL_SPREAD < 0.05,
  },
  {
    id: 'ctheta-net-contraction-negative-in-trap',
    description: 'The net level rate dTheta/ds is strictly negative on every probed (trapped) rung -- the bounded forcing loses to the restoring term',
    holds: () => PROBE.every((p) => p.netRate < 0),
  },
  {
    id: 'ctheta-affine-bound-matches-factored-net',
    description: 'The bound chain is exact: -4 Theta(2-Theta) + 24 Theta^2 + 16 Theta^3 factors as 4 Theta(4 Theta-1)(Theta+2), negative for 0 < Theta < 1/4',
    holds: () => {
      for (const theta of [0.05, 0.12, 0.2, 0.24]) {
        const chain = -4 * theta * (2 - theta) + 24 * theta * theta + 16 * theta ** 3;
        const factored = 4 * theta * (4 * theta - 1) * (theta + 2);
        if (Math.abs(chain - factored) > 1e-12 || factored >= 0) return false;
      }
      return true;
    },
  },
  {
    id: 'ctheta-distinct-from-w1-modulus',
    description: 'The record explicitly distinguishes this bounded contraction constant from the divergent imp-2680 W_1 modulus -- no false reconciliation claim',
    holds: () =>
      IMP_CTHETA_UNIFORM_BOUND.distinctFrom.module === 'imp-2680-theta-lipschitz-uniformity.js' &&
      IMP_CTHETA_UNIFORM_BOUND.distinctFrom.behaviour.includes('DIVERGENT') &&
      IMP_CTHETA_UNIFORM_BOUND.verdict.startsWith('POSITIVE'),
  },
];

for (const a of IMP_CTHETA_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-ctheta-uniform-bound assertion failed: ${a.id}`);
}
