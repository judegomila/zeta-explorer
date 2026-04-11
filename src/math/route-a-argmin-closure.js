/**
 * imp-456 (partial): Route A (M) monotonicity conjecture -- assembly record
 *
 * Route A of the Lambda-attack plan proceeds via the backward Calogero-Moser
 * collision time tau_c(N) of the first N Riemann zeros.  The route aims to
 * prove the monotonicity hypothesis
 *
 *   (M)  tau_c(N+1)  <=  tau_c(N)   for all N >= 2,
 *
 * from which  a := lim_{N -> infinity} tau_c(N) = inf_N tau_c(N)  exists and
 * equals |t_c(N_max)| at the largest N in the baseline, giving an upper bound
 *   Lambda <= a <= |t_c(N_max)| approx 0.0086.
 *
 * This file is the ASSEMBLY RECORD for the Route A partial closure: it
 * collects the results of all contributing sub-tickets (imp-322 through
 * imp-455), provides extended numerical witnesses over the full ZETA_ZEROS
 * range N in {2, ..., 870}, and names the one remaining open sub-gap that
 * prevents an unconditional proof of (M).
 *
 * Chain of completed closures
 * ---------------------------
 *   imp-322  dyson-monotonicity-proof.js
 *            PROVED: Under the backward Calogero-Moser flow, the minimum gap
 *            B_N(t) is non-increasing in t. Boundary identity:
 *            dg_{k*}/dt = 4/g_{k*} - 2*g_{k*}*S_{k*} with S_{k*} > 0.
 *
 *   imp-336  lambda-intercept-monotonicity.js
 *            SHIPPED: Analytic sketch of (M) from imp-322 + sign-reinforcement
 *            at the argmin site k*_N, with two named gaps G1 (interiority) and
 *            G2 (argmin jumps). Empirical witness: PATH_C_BASELINE_FIT 5
 *            anchors and imp-321 ladder all satisfy (M) at sampled N values.
 *
 *   imp-368  lambda-argmin-interiority.js
 *            PARTIAL: G1 argmin interiority.
 *            (L-triv) UNCONDITIONAL: k*_N in {1, ..., N-1} for all N >= 2.
 *            (L-cond) CONDITIONAL on G1-sub-extremal: alpha*N <= k*_N <=
 *                     (1-alpha)*N. Equivalent to imp-343 G4a_bulk_confinement.
 *
 *   imp-369  lambda-argmin-jumps.js
 *            CLOSED: G2 at tau = 0 via Cauchy interlacing.
 *            B_{N+1}(0) <= B_N(0) UNCONDITIONALLY for every N >= 2.
 *            Numerical witness: all N in {2, ..., 220} on ZETA_ZEROS.
 *
 *   imp-450  g1-g2-closure.js
 *            ASSEMBLY: G1 + G2 joint closure record.  Degenerate boundary
 *            pathology removed unconditionally; tau = 0 argmin-jump handled;
 *            OPEN_GAPS in lambda-roadmap.js flipped to closed severity.
 *            tau > 0 propagation and uniform G1 margin remain conditional.
 *
 *   imp-455  g1-sub-extremal-closure.js (src/math)
 *            PARTIAL-CONDITIONAL: Bourgade extremal-gap GUE port.
 *            Under (H1) GUE pair-correlation + (H2) density-gradient control:
 *            the unfolded argmin J*_N is bulk-confined by BABL 2013.
 *            Remaining sub-gap: G1-sub-extremal-raw-vs-unfolded (raw argmin
 *            k*_N vs unfolded argmin J*_N, density-gradient re-weighting).
 *
 * Remaining open content
 * ----------------------
 * ONE sub-gap prevents an unconditional proof of (M):
 *
 *   G1-sub-extremal-raw-vs-unfolded (from imp-455)
 *   Statement: prove that argmin{g_k} = argmin{h_k / rho_k} is bulk-confined
 *              (in [alpha*N, (1-alpha)*N] with prob -> 1) given that
 *              argmin{h_k} is bulk-confined by BABL.  Requires a second-moment
 *              or Selberg CLT bound showing the density-gradient re-weighting
 *              shifts the argmin by at most o(alpha*N).
 *   Status: open under (H1) + (H2); unconditional closure is open research.
 *
 * Even with G1-sub-extremal-raw-vs-unfolded closed, Route A proves (M) only
 * under (H1) GUE pair-correlation (Montgomery 1973), which is itself an open
 * conjecture.  An unconditional Route A proof of (M) would therefore require
 * also proving Montgomery pair-correlation, which is well beyond the current
 * scope.  The honest status is: Route A establishes (M) CONDITIONALLY on
 * (H1) pair-correlation, modulo the density-gradient sub-gap.
 *
 * What this file delivers (imp-456 partial scope)
 * -----------------------------------------------
 *   1. ROUTE_A_CLOSURE: single assembly record with the full chain summary,
 *      conditions, named sub-gap, and recommended next action.
 *   2. Extended numerical witness: min-gap monotonicity B_{N+1}(0) <= B_N(0)
 *      swept over all consecutive N in {2, ..., 870} (full ZETA_ZEROS range),
 *      extending imp-369 from N <= 220 to N <= 870.
 *   3. Build-time assertions: citation chain, witness completeness, honest-
 *      status tripwires.
 *
 * What this file does NOT claim
 * ----------------------------
 *   - (M) is NOT proved unconditionally.
 *   - The imp-336 ANALYTIC_SKETCH G1/G2 tripwires are NOT flipped here.
 *     The coordinated flip requires closing G1-sub-extremal-raw-vs-unfolded
 *     AND updating lambda-intercept-analytic.js, bridge-lambda-rh.js, and
 *     lambda-zero-attack.js in the same commit.
 */

import { ZETA_ZEROS }              from './zeta.js';
import { DYSON_MONOTONICITY_THEOREM } from '../data/dyson-monotonicity-proof.js';
import { LAMBDA_INTERCEPT_MONOTONICITY } from '../data/lambda-intercept-monotonicity.js';
import { LAMBDA_ARGMIN_INTERIORITY }     from '../data/lambda-argmin-interiority.js';
import { LAMBDA_ARGMIN_JUMPS }           from '../data/lambda-argmin-jumps.js';
import { G1_G2_CLOSURE_ASSEMBLY }        from '../data/g1-g2-closure.js';
import { G1_SUB_EXTREMAL_CLOSURE }       from './g1-sub-extremal-closure.js';

// ── Extended numerical witness: B_{N+1}(0) <= B_N(0) for all N in ZETA_ZEROS

const N_FULL = ZETA_ZEROS.length; // 870

/**
 * Compute min-gap and its index for the first N Riemann zeros.
 * Returns { N, B, kStar } where kStar is 1-indexed.
 */
function minGapFirstN(N) {
  let B = Infinity;
  let kStar = 1;
  for (let k = 0; k < N - 1; k++) {
    const g = ZETA_ZEROS[k + 1] - ZETA_ZEROS[k];
    if (g < B) {
      B = g;
      kStar = k + 1;
    }
  }
  return { N, B, kStar };
}

// Sweep all consecutive N from 2 to N_FULL
const FULL_SWEEP = [];
for (let N = 2; N <= N_FULL; N++) {
  FULL_SWEEP.push(minGapFirstN(N));
}

let fullSweepViolation = null;
let fullArgminJumps = 0;
for (let i = 1; i < FULL_SWEEP.length; i++) {
  const prev = FULL_SWEEP[i - 1];
  const curr = FULL_SWEEP[i];
  if (curr.B > prev.B + 1e-15 && fullSweepViolation === null) {
    fullSweepViolation = {
      N_from: prev.N,
      N_to:   curr.N,
      B_from: prev.B,
      B_to:   curr.B,
    };
  }
  if (curr.kStar !== prev.kStar) fullArgminJumps += 1;
}

const FULL_SWEEP_PASSES = fullSweepViolation === null;

// Spot-check table: N at decade boundaries within ZETA_ZEROS range
const SPOT_CHECKS = [2, 10, 50, 100, 200, 300, 500, 700, N_FULL].map((N) => {
  const w = minGapFirstN(N);
  return {
    N:           w.N,
    B_N:         +w.B.toFixed(8),
    kStar_N:     w.kStar,
    kStar_frac:  +(w.kStar / w.N).toFixed(4),
    near_top:    w.kStar / w.N > 0.75,
  };
});

// ── Route A status record ────────────────────────────────────────────────────

const ROUTE_A_CHAIN = [
  {
    impId:      'imp-322',
    file:       'src/data/dyson-monotonicity-proof.js',
    delivers:   'PROVED: B_N(t) non-increasing under backward Calogero-Moser flow',
    status:     'closed',
  },
  {
    impId:      'imp-336',
    file:       'src/data/lambda-intercept-monotonicity.js',
    delivers:   'Analytic sketch of (M) + empirical witness at baseline anchors',
    status:     'conditional-sketch (G1, G2 open)',
  },
  {
    impId:      'imp-368',
    file:       'src/data/lambda-argmin-interiority.js',
    delivers:   'G1 partial: trivial bound (unconditional) + conditional uniform margin',
    status:     'partial',
  },
  {
    impId:      'imp-369',
    file:       'src/data/lambda-argmin-jumps.js',
    delivers:   'G2 closed at tau = 0: B_{N+1}(0) <= B_N(0) unconditionally',
    status:     'closed-at-tau-0',
  },
  {
    impId:      'imp-450',
    file:       'src/data/g1-g2-closure.js',
    delivers:   'G1 + G2 joint assembly; OPEN_GAPS in roadmap flipped',
    status:     'partial-assembly',
  },
  {
    impId:      'imp-455',
    file:       'src/math/g1-sub-extremal-closure.js',
    delivers:   'BABL GUE port + density-gradient obstruction; conditional partial G1',
    status:     'partial-conditional',
  },
];

const REMAINING_SUB_GAP = {
  id:       G1_SUB_EXTREMAL_CLOSURE.remainingSubGap.id,
  statement: G1_SUB_EXTREMAL_CLOSURE.remainingSubGap.statement,
  approach:  G1_SUB_EXTREMAL_CLOSURE.remainingSubGap.suggestedApproach,
  status:    G1_SUB_EXTREMAL_CLOSURE.remainingSubGap.status,
  closedBy:  null,
};

export const ROUTE_A_CLOSURE = {
  id:    'imp-456',
  title: 'Route A (M) monotonicity conjecture -- partial closure assembly',

  closureLevel: 'partial-conditional',
  conditionedOn: [
    '(H1) GUE pair-correlation: Montgomery 1973 + Katz-Sarnak universality',
    '(H2) Density-gradient control: RvM log-ratio C_alpha -> 1 as N -> infinity',
  ],

  chain: ROUTE_A_CHAIN,
  remainingSubGap: REMAINING_SUB_GAP,

  extendedWitness: {
    description:
      'Full ZETA_ZEROS sweep: B_{N+1}(0) <= B_N(0) checked for every consecutive ' +
      'N pair from N = 2 to N = ' + N_FULL + '. Extends imp-369 witness (N <= 220) ' +
      'to the full ZETA_ZEROS range N <= ' + N_FULL + '.',
    nMinSwept:               2,
    nMaxSwept:               N_FULL,
    totalConsecutivePairs:   FULL_SWEEP.length - 1,
    allPairsSatisfyMonotonicity: FULL_SWEEP_PASSES,
    violatingPair:           fullSweepViolation,
    argminJumpCount:         fullArgminJumps,
    spotChecks:              SPOT_CHECKS,
  },

  verdict:
    'Route A (M) monotonicity conjecture is PARTIALLY CLOSED. The tau = 0 ' +
    'interlacing (unconditional, imp-369) and BABL conditional bulk-confinement ' +
    '(imp-455, under H1 + H2) jointly establish B_{N+1}(0) <= B_N(0) and ' +
    'conditional argmin interiority. The tau > 0 propagation via the imp-336 ' +
    'drift-sign sketch is valid at tau = 0 by interlacing and is conditional on ' +
    '(H1) + (H2) for tau > 0 (via G1 uniform margin). One named sub-gap, ' +
    REMAINING_SUB_GAP.id + ', remains: the density-gradient re-weighting shift ' +
    'between raw and unfolded argmin under H1. Closing this sub-gap (e.g. by ' +
    'Selberg CLT second-moment estimate) would complete the conditional Route A ' +
    'proof of (M) under H1 + H2.',

  routeAMonotonicityConjectureStatus:
    'unproved-unconditionally -- conditional on H1 + H2 modulo ' +
    REMAINING_SUB_GAP.id,

  noteOnImp336Tripwires:
    'The imp-336 ANALYTIC_SKETCH G1/G2 tripwires are intentionally NOT flipped ' +
    'in this commit. The coordinated flip requires closing ' +
    REMAINING_SUB_GAP.id + ' and simultaneously updating lambda-intercept-' +
    'analytic.js, bridge-lambda-rh.js, and lambda-zero-attack.js.',

  consumesIds: [
    DYSON_MONOTONICITY_THEOREM.id,
    LAMBDA_INTERCEPT_MONOTONICITY.id,
    LAMBDA_ARGMIN_INTERIORITY.id,
    LAMBDA_ARGMIN_JUMPS.id,
    G1_G2_CLOSURE_ASSEMBLY.id,
    G1_SUB_EXTREMAL_CLOSURE.id,
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const ROUTE_A_CLOSURE_ASSERTIONS = [
  {
    id: 'imp456-citation-chain-resolves',
    holds: () =>
      DYSON_MONOTONICITY_THEOREM.id    === 'imp-322' &&
      LAMBDA_INTERCEPT_MONOTONICITY.id  === 'imp-336' &&
      LAMBDA_ARGMIN_INTERIORITY.id      === 'imp-368' &&
      LAMBDA_ARGMIN_JUMPS.id            === 'imp-369' &&
      G1_G2_CLOSURE_ASSEMBLY.id         === 'imp-450' &&
      G1_SUB_EXTREMAL_CLOSURE.id        === 'imp-455',
    why:
      'imp-456 cites six prior tickets. Any id drift strands the citation chain.',
  },
  {
    id: 'imp456-extended-witness-passes',
    holds: () => FULL_SWEEP_PASSES === true,
    why:
      'B_{N+1}(0) <= B_N(0) must hold at every consecutive N pair across the ' +
      'full ZETA_ZEROS range. A failure refutes (M) at a sampled N-pair and ' +
      'would invalidate the imp-336 sketch.',
  },
  {
    id: 'imp456-remaining-sub-gap-still-open',
    holds: () =>
      REMAINING_SUB_GAP.status.startsWith('open') &&
      REMAINING_SUB_GAP.closedBy === null,
    why:
      'SCOPE TRIPWIRE: imp-456 is a partial closure only. If the remaining sub-gap ' +
      'is marked closed here, this assertion fires to ensure the coordinated flip ' +
      'of imp-336 ANALYTIC_SKETCH tripwires and the three downstream file updates ' +
      'are done in the same commit.',
  },
  {
    id: 'imp456-closure-level-partial',
    holds: () => ROUTE_A_CLOSURE.closureLevel === 'partial-conditional',
    why:
      'SCOPE TRIPWIRE: this file delivers partial-conditional status. Upgrading ' +
      'closureLevel prematurely without the coordinated imp-336 flip is an error.',
  },
  {
    id: 'imp456-g1-sub-extremal-id-matches',
    holds: () =>
      ROUTE_A_CLOSURE.remainingSubGap.id === 'G1-sub-extremal-raw-vs-unfolded',
    why:
      'The remaining sub-gap must be G1-sub-extremal-raw-vs-unfolded from imp-455. ' +
      'If the id changes, the downstream density-gradient sub-gap tracking breaks.',
  },
];
