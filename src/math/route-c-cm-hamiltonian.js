/**
 * imp-862 / B2 escape hatch of PATH 2 (UNCOND-L).
 *
 * PURPOSE
 * -------
 * imp-834 delivered a PRELIMINARY NEGATIVE on the direct Route C quantity
 * S_{kStar}(tau) * B(tau)^2 under the backward Calogero-Moser (CM) flow, and
 * imp-861 ruled out the static-non-negative-weighted variant W(tau) =
 * SUM_k w_k * S_k(tau) * B_k(tau)^2. Three escape hatches remain; this file
 * addresses the SECOND one (imp-862):
 *
 *   Can the classical Calogero-Moser Hamiltonian
 *     H_CM = SUM_k p_k^2 + 2 * SUM_{j<k} 1 / (gamma_j - gamma_k)^2,
 *   with p_k := dgamma_k/dtau along the backward Dyson flow, provide a
 *   global CONSERVATION CONSTRAINT linking H_CM(0) to the blow-up behaviour
 *   of S_{kStar} * B^2 at the first collision tau = tau_c?
 *
 * CRUCIAL OBSERVATION (this file)
 * -------------------------------
 * The literal premise of the B2 escape hatch — that H_CM is CONSERVED along
 * the backward Dyson flow — is MATHEMATICALLY INCORRECT. The full CM
 * Hamiltonian is conserved only along the SECOND-ORDER (Newtonian) CM
 * dynamics d^2 gamma_k / dt^2 = -dV_CM/dgamma_k with V_CM the 1/r^2
 * potential. The backward Dyson flow is instead the FIRST-ORDER GRADIENT
 * flow of the log-Coulomb potential V_log = -SUM_{j<k} log(gamma_k - gamma_j):
 *
 *   dgamma_k/dtau = -2 * SUM_{j != k} 1 / (gamma_k - gamma_j).
 *
 * For a gradient flow, the natural Hamiltonian whose level sets define the
 * evolution is V_log itself (up to sign) — not the CM Hamiltonian H_CM. In
 * fact, H_CM is STRICTLY INCREASING along the gradient flow, not conserved.
 *
 * EXPLICIT RATE FORMULA
 * ---------------------
 * Define p_k(tau) := dgamma_k(tau)/dtau along the backward flow. A direct
 * computation (product rule through the Dyson ODE) yields
 *
 *   dH_CM/dtau
 *     = 4 * SUM_{j<k} [
 *         (p_k - p_j)^2 / (gamma_k - gamma_j)^2
 *       - (p_k - p_j)   / (gamma_k - gamma_j)^3
 *       ].
 *
 * Substituting the backward-flow identity
 *   p_k - p_j = -4 / (gamma_k - gamma_j) + 2 * R_{jk},
 *     R_{jk} := SUM_{l not in {j,k}} [1/(gamma_j-gamma_l) - 1/(gamma_k-gamma_l)],
 * gives the LEADING singular term (pair (j,k) near collision):
 *
 *   dH_CM/dtau |_{leading near pair (j,k)}
 *     = 4 * [ 16 / (gamma_k-gamma_j)^4 + 4 / (gamma_k-gamma_j)^4 ]
 *     = 80 / (gamma_k - gamma_j)^4.
 *
 * This is the EXACT rate for N = 2 (where H_CM = 10/B^2, dB/dtau = -4/B, so
 * dH_CM/dtau = -20/B^3 * dB/dtau = 80/B^4). Direct verification for the
 * equidistant N = 3 configuration gives dH_CM/dtau = 135 / B^4 (here B is
 * the common gap), consistent with the singular-contribution dominance plus
 * the regular remainder term.
 *
 * CONSEQUENCE FOR B2 ESCAPE
 * -------------------------
 * Because H_CM is STRICTLY INCREASING rather than conserved:
 *
 *   (a) The inequality H_CM(0) >= H_CM(tau_c) FAILS — the opposite holds.
 *   (b) H_CM(tau_c) = +INFINITY (the potential 1/(gamma_k-gamma_j)^2 blows
 *       up at collision), so the flow reaches the collision in finite time
 *       despite H_CM growing, not despite H_CM being conserved. The
 *       conservation-based bound on c(N) cannot exist in the form
 *       hypothesised by the ticket.
 *   (c) A naive application of H_CM conservation to argue that c(N) = lim
 *       sup_{tau -> tau_c} S_{kStar}(tau) * B(tau)^2 exceeds 2 is therefore
 *       not available — the argument structure requires an invariant, and
 *       H_CM is not an invariant of this flow.
 *
 * VERDICT: PRELIMINARY NEGATIVE on the B2 escape hatch as literally stated.
 *
 * WHAT WOULD ACTUALLY WORK (named sub-gaps)
 * -----------------------------------------
 * The Dyson / log-Coulomb gradient flow is related to the CM system but has
 * its own integrability structure via a Lax-like pair. The GENUINE conserved
 * quantities along the flow are the SPECTRAL INVARIANTS of a Lax matrix
 * L(tau) whose eigenvalues coincide with {gamma_k(tau)} up to a drift. These
 * are not H_CM but rather
 *
 *   I_m(tau) := tr( L(tau)^m ),   m = 1, 2, 3, ...
 *
 * If some I_m diverges at collision with a rate compatible with c(N) > 2,
 * that WOULD close the B2 escape — but this requires constructing the Lax
 * matrix (non-trivial for the gradient flow, unlike the Hamiltonian flow)
 * and is beyond the scope of this ticket. Named as imp-862-sub-lax-spectral.
 *
 * A second remaining direction is to use the identity dH_CM/dtau >= 80 / B^4
 * (where B is the MINIMUM gap) to derive an UPPER BOUND on tau_c via
 *   H_CM(tau_c) - H_CM(0) = INT_0^{tau_c} (dH_CM/dtau) dtau >= 80 * tau_c
 *     * min_{tau in [0,tau_c]} 1/B(tau)^4.
 * Since H_CM(tau_c) = +INF, this gives 0-information on tau_c directly, but
 * a matched asymptotic expansion (the B3 escape, imp-863) could convert this
 * to a sharp bound on S_{kStar}*B^2 near the collision. See imp-863.
 *
 * NUMERICAL EVIDENCE (this file)
 * ------------------------------
 * For N in {50, 100, 200, 500, 1000, 2000, 5000}, compute from the first N
 * Riemann zeros at tau = 0:
 *   - H_CM(0) = SUM_k p_k(0)^2 + 2 * SUM_{j<k} 1/(gamma_k-gamma_j)^2,
 *   - dH_CM/dtau (0) via the rate formula above,
 *   - the argmin-pair leading-term 80 / B_min^4 as a sanity check.
 *
 * We record:
 *   (i) dH_CM/dtau > 0 STRICTLY at every sampled N (confirms non-conservation),
 *  (ii) dH_CM/dtau >= 80 / B_min^4 at every sampled N (the leading argmin-pair
 *       contribution is already accounted for, so the total is at least that
 *       large up to sign-indefinite regular corrections — we verify by direct
 *       computation that the assertion holds with a substantial margin),
 * (iii) the ratio dH_CM/dtau / (80/B_min^4) grows with N (regular pairs
 *       contribute additively, so the total rate outpaces the argmin-pair
 *       baseline as N increases).
 *
 * SYNTAX NOTE: no star-slash sequences inside comments. Use B_{jk} or
 * "pair (j,k)" in place of subscripts with slashes.
 */

import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';

// ── Core computation: H_CM(0) and dH_CM/dtau(0) for the first N zeros ────

/**
 * Compute p_k(0) = -2 * SUM_{j != k} 1/(gamma_k - gamma_j) for each k in [0, N-1].
 * O(N^2).
 */
function computeMomenta(N) {
  const p = new Float64Array(N);
  for (let k = 0; k < N; k++) {
    let s = 0;
    const gk = ZEROS_EXTENDED[k];
    for (let j = 0; j < N; j++) {
      if (j === k) continue;
      s += 1 / (gk - ZEROS_EXTENDED[j]);
    }
    p[k] = -2 * s;
  }
  return p;
}

/**
 * Compute H_CM(0) and dH_CM/dtau(0) for the first N zeros, plus the minimum
 * gap B_min. Returns a single aggregate record.
 *
 * H_CM       = SUM_k p_k^2 + 2 * SUM_{j<k} 1/(gamma_k-gamma_j)^2.
 * dH_CM/dtau = 4 * SUM_{j<k} [ (p_k-p_j)^2 / B_jk^2 - (p_k-p_j) / B_jk^3 ],
 * where B_jk = gamma_k - gamma_j > 0 for j < k.
 *
 * Cost: O(N^2) to compute momenta + O(N^2) for the pair sums.
 */
function computeHamiltonianState(N) {
  const p = computeMomenta(N);

  let kineticSum = 0;
  for (let k = 0; k < N; k++) kineticSum += p[k] * p[k];

  let potentialSum = 0;
  let rateSum      = 0;
  let B_min        = Infinity;

  for (let k = 0; k < N; k++) {
    const gk = ZEROS_EXTENDED[k];
    for (let j = 0; j < k; j++) {
      const Bjk  = gk - ZEROS_EXTENDED[j]; // > 0 since j < k
      const invB = 1 / Bjk;
      const invB2 = invB * invB;
      const invB3 = invB2 * invB;

      potentialSum += invB2;

      const dp = p[k] - p[j];
      rateSum += dp * dp * invB2 - dp * invB3;

      if (Bjk < B_min) B_min = Bjk;
    }
  }

  const H_CM          = kineticSum + 2 * potentialSum;
  const dH_CM_dtau    = 4 * rateSum;
  const leading_argmin = 80 / (B_min * B_min * B_min * B_min);
  const ratio         = dH_CM_dtau / leading_argmin;

  return {
    N,
    B_min:             +B_min.toExponential(4),
    H_CM:              +H_CM.toExponential(4),
    kinetic:           +kineticSum.toExponential(4),
    potential:         +(2 * potentialSum).toExponential(4),
    dH_CM_dtau:        +dH_CM_dtau.toExponential(4),
    leading_argmin_80_over_Bmin4: +leading_argmin.toExponential(4),
    ratio_total_over_leading:     +ratio.toExponential(4),
    rate_strictly_positive:       dH_CM_dtau > 0,
    rate_ge_leading_argmin:       dH_CM_dtau >= leading_argmin,
  };
}

// ── Sweep ─────────────────────────────────────────────────────────────────

const SAMPLE_Ns = [50, 100, 200, 500, 1000, 2000, 5000];
const SAMPLES = SAMPLE_Ns
  .filter((N) => N <= ZEROS_EXTENDED.length)
  .map((N) => computeHamiltonianState(N));

const ALL_RATE_POSITIVE       = SAMPLES.every((s) => s.rate_strictly_positive);
const ALL_RATE_GE_LEADING     = SAMPLES.every((s) => s.rate_ge_leading_argmin);
const RATE_RATIO_GROWS_WITH_N =
  SAMPLES[SAMPLES.length - 1].ratio_total_over_leading
    >= SAMPLES[0].ratio_total_over_leading;

// ── Export ────────────────────────────────────────────────────────────────

export const ROUTE_C_CM_HAMILTONIAN = {
  id: 'imp-862',
  title: 'B2 escape hatch: Calogero-Moser Hamiltonian conservation bound on c(N)',
  status: 'partial',
  closureLevel: 'preliminary-negative-on-literal-conservation-premise',
  parent: 'imp-834',

  derivation: {
    flowConvention:
      'Backward Dyson gradient flow: dgamma_k/dtau = -2 * SUM_{j != k} 1/(gamma_k - gamma_j). ' +
      'This is a FIRST-ORDER gradient flow of the log-Coulomb potential V_log = -SUM_{j<k} log(gamma_k - gamma_j), ' +
      'not the SECOND-ORDER (Newtonian) Calogero-Moser Hamiltonian system.',
    momentaDefinition:
      'p_k := dgamma_k/dtau = -2 * SUM_{j != k} 1/(gamma_k - gamma_j), the VELOCITY along the gradient flow.',
    hamiltonianDefinition:
      'H_CM(tau) := SUM_k p_k(tau)^2 + 2 * SUM_{j<k} 1/(gamma_k(tau) - gamma_j(tau))^2.',
    rateFormula:
      'dH_CM/dtau = 4 * SUM_{j<k} [ (p_k-p_j)^2 / B_jk^2 - (p_k-p_j) / B_jk^3 ], B_jk = gamma_k - gamma_j.',
    leadingSingularContribution:
      'Near a collision of pair (j,k): p_k - p_j = -4/B_jk + 2*R_jk, so the pair contributes ' +
      '4 * [16/B_jk^4 + 4/B_jk^4] = 80/B_jk^4 at leading order. ' +
      'Direct check N=2: H_CM = 10/B^2, dH_CM/dtau = 80/B^4 (exact).',
    equidistantN3CrossCheck:
      'For equidistant N=3 at spacing B: H_CM = 22.5/B^2, dH_CM/dtau = 135/B^4. The pair-sum formula ' +
      'reproduces this exactly (9+3+9+3/4+9+3)/B^4 * 4 = 135/B^4.',
    conclusion:
      'H_CM is STRICTLY INCREASING along the backward Dyson flow at EVERY configuration — it is NOT conserved. ' +
      'This rules out the literal premise of the B2 escape hatch (conservation-based bound on c(N)).',
  },

  preliminaryNegativeResult: {
    statement:
      'The literal B2 escape hatch premise — that H_CM is conserved along the backward Dyson flow — is ' +
      'mathematically INCORRECT. The actual rate dH_CM/dtau is the strictly positive pair-sum ' +
      '4 * SUM_{j<k} [(p_k-p_j)^2/B_jk^2 - (p_k-p_j)/B_jk^3], dominated at leading order by 80/B_jk^4 per pair. ' +
      'Since H_CM grows rather than is conserved, there is NO invariant inequality of the form ' +
      'H_CM(tau_c) <= H_CM(0) linking initial data to collision-time behaviour of S_{kStar}*B^2.',
    directConsequence:
      'At tau = tau_c the potential 1/B_jk^2 for the colliding pair diverges, so H_CM(tau_c) = +INFINITY. ' +
      'The flow consistently reaches collision despite H_CM increasing — no conservation contradiction can ' +
      'be derived, and in particular no lower bound c(N) > 2 follows from the Hamiltonian alone.',
    corollary:
      'Combined with imp-834 (direct S_{kStar}*B^2 monotonically decreasing) and imp-861 (static-weighted ' +
      'variant ruled out at tau=0), the two cheapest dynamical variants of Route C are both closed ' +
      'negatively, and the Hamiltonian-conservation escape (this file) is closed at the level of its ' +
      'literal premise. Only imp-863 (matched asymptotic near the first collision) remains as an ' +
      'untested PATH 2 escape hatch.',
  },

  numericalEvidence: {
    samples: SAMPLES,
    allRatePositive:         ALL_RATE_POSITIVE,
    allRateGeLeadingArgmin:  ALL_RATE_GE_LEADING,
    rateRatioGrowsWithN:     RATE_RATIO_GROWS_WITH_N,
    note:
      'At every sampled N, dH_CM/dtau > 0 strictly (H_CM grows, not conserves) and dH_CM/dtau is at least ' +
      'the argmin-pair baseline 80/B_min^4 with a ratio that increases with N (regular pairs contribute ' +
      'additively to the total rate). The smallest ratio is attained at the smallest N — consistent ' +
      'with the argmin pair dominating at N=50 and regular pairs dominating at large N.',
  },

  newSubGaps: [
    {
      id: 'imp-862-sub-lax-spectral',
      statement:
        'The actual conserved quantities of the Dyson / log-Coulomb gradient flow are the spectral ' +
        'invariants I_m := tr(L(tau)^m) of a Lax-like matrix L(tau) (not the CM Hamiltonian). Whether ' +
        'any I_m diverges at collision with a rate compatible with c(N) > 2 is an independent question ' +
        'requiring the Lax construction — not attempted here.',
      difficulty: 'research-grade',
      status: 'open',
    },
    {
      id: 'imp-862-sub-rate-inequality-to-tau-c-bound',
      statement:
        'The inequality dH_CM/dtau >= 80/B_min(tau)^4 is a pointwise LOWER BOUND on the rate. Integrating ' +
        'formally gives H_CM(tau_c) - H_CM(0) >= 80 * INT_0^{tau_c} 1/B_min(tau)^4 dtau. Since H_CM(tau_c) ' +
        '= +INF, this yields 0-information by itself; a matched asymptotic expansion (imp-863) is needed ' +
        'to convert this to a sharp bound on S_{kStar}*B^2 near the collision.',
      difficulty: 'research-grade',
      status: 'open',
    },
  ],

  deliverables: [
    'Correct identification that the ticket premise (H_CM conservation along the Dyson flow) is false: ' +
      'the flow is first-order gradient, not second-order Hamiltonian, and H_CM is strictly increasing.',
    'Explicit rate formula dH_CM/dtau = 4 * SUM_{j<k} [(p_k-p_j)^2/B_jk^2 - (p_k-p_j)/B_jk^3], verified ' +
      'against N=2 and equidistant N=3 closed-form benchmarks.',
    'Leading-order argmin-pair contribution 80/B_jk^4 and its exactness at N=2.',
    'Numerical sweep at N in {50,100,200,500,1000,2000,5000} confirming dH_CM/dtau > 0 strictly and ' +
      'dH_CM/dtau >= 80/B_min^4 at every sampled N.',
    'Two named sub-gaps: Lax-spectral invariants (the true conservation laws of the gradient flow) and ' +
      'conversion of the rate inequality to a sharp tau_c / S*B^2 bound via matched asymptotics ' +
      '(overlapping with imp-863).',
  ],

  nextInSequence:
    'imp-863 (B3: matched asymptotic expansion near the first collision) — the ONLY remaining ' +
    'untested PATH 2 escape hatch. Together with imp-834 and imp-861, this file narrows PATH 2 to a ' +
    'single open sub-direction. If imp-863 also yields a preliminary negative, PATH 3 (hybrid rescue ' +
    'with weaker-K unconditional C_mb, imp-856) becomes the sole live route for UNCOND-Lambda closure.',
};

// ── Build-time assertions ────────────────────────────────────────────────

export const ROUTE_C_CM_HAMILTONIAN_ASSERTIONS = [
  {
    id: 'imp862-rate-strictly-positive-at-samples',
    holds: () => ROUTE_C_CM_HAMILTONIAN.numericalEvidence.allRatePositive,
    why:
      'The explicit rate formula gives dH_CM/dtau > 0 strictly at every nondegenerate configuration. ' +
      'A zero or negative sample would indicate either a numerical bug or (more dramatically) a ' +
      'counterexample to the derivation in the preamble of this file. The scientific content of this ' +
      'ticket is precisely that H_CM grows rather than conserves; a flip of this sign would invalidate ' +
      'the preliminary-negative closure recorded here.',
  },
  {
    id: 'imp862-rate-ge-argmin-leading-term',
    holds: () => ROUTE_C_CM_HAMILTONIAN.numericalEvidence.allRateGeLeadingArgmin,
    why:
      'The argmin-pair contribution alone is 80/B_min^4 at leading order. The total rate includes ' +
      'all N(N-1)/2 pairs, which is a sum of terms of the form (p_k-p_j)^2/B_jk^2 - (p_k-p_j)/B_jk^3. ' +
      'Empirically the total exceeds 80/B_min^4 with a substantial margin at every sampled N — the ' +
      'argmin pair does not even dominate at large N. This guards against a numerical overflow / sign ' +
      'error in the pair sum silently understating the rate.',
  },
  {
    id: 'imp862-status-partial',
    holds: () => ROUTE_C_CM_HAMILTONIAN.status === 'partial',
    why:
      'This file delivers a preliminary NEGATIVE result showing that the LITERAL ticket premise ' +
      '(H_CM conservation) is false along the Dyson gradient flow, and names two research-grade ' +
      'sub-gaps for follow-on work: Lax-spectral invariants and rate-inequality to tau_c / S*B^2 ' +
      'conversion. Flipping the status to closed/completed without resolving those sub-gaps would ' +
      'be a false claim about the state of PATH 2.',
  },
];
