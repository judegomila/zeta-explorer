/**
 * Analytic a-priori upper bound on the Path C intercept a (imp-328, B2(b))
 *
 * imp-323 exhausted the statistical angle B2(a): a 5-point OLS fit on
 * PATH_C_BASELINE_FIT gave â ≈ 0.0029 with a one-sided 95% upper CL that
 * is strictly above zero, and imp-329 / imp-331 / imp-332 showed that
 * degree-of-freedom shrinkage, WLS re-weighting, and a projected PT-scale
 * ladder all stay in the same statistical regime. The ticket flags
 * B2(b) — an analytic a-priori upper bound on
 *
 *     a := lim sup_{N → ∞} |t_c(N)|
 *
 * derived from the Dyson / Calogero-Moser evolution equation itself —
 * as the SOLE remaining path to a theorem-grade Λ ≤ 0 at the heights the
 * repo controls. This file is the landing site for that attack.
 *
 * Honest scope (interim deliverable)
 * ----------------------------------
 * A fully unconditional upper bound on a from first principles is a
 * research-grade problem: it is equivalent to proving, at the Path C
 * thin strip and at finite height, that the backward Calogero-Moser
 * collision time cannot be bounded away from zero as N → ∞. imp-319
 * lambda-zero-attack.js names this as BLOCKER B2 and flags it open.
 *
 * What this file delivers in the same interim pattern used by
 * imp-329 / imp-331 / imp-332 is:
 *
 *   1. A precise statement of the problem and what inputs are in hand.
 *   2. Three attack candidates (the ones the ticket enumerated), each
 *      with the key identity or obstruction so a follow-up ticket can
 *      pick up the thread without re-deriving the starting point.
 *   3. ONE concrete CONDITIONAL upper bound — a ≤ |t_c(N_max)| under
 *      the hypothesis that |t_c(N)| is monotone non-increasing in N —
 *      plus the explicit statement that this monotonicity is itself
 *      the open B2(b) conjecture. The conditional bound is still
 *      useful because (a) it reduces B2(b) to a single clean monotonicity
 *      statement instead of an unbounded family of tail-density claims,
 *      and (b) it gives the build a number to assert against.
 *   4. A build-time assertion that the derived conditional upper bound
 *      agrees with the OLS â from imp-323 — i.e. the conditional bound
 *      is LOOSER than the statistical central value, as it must be if
 *      the monotonicity conjecture is true.
 *   5. Numerical witnesses on the recorded PATH_C_BASELINE_FIT that
 *      the observed sequence is in fact monotone decreasing, so the
 *      conditional bound is non-vacuous on the data we actually run on.
 *
 * What this file does NOT claim
 * -----------------------------
 * - No unconditional proof of a ≤ 0. The conditional bound gives
 *   a ≤ 0.0086, not a ≤ 0. Closing B2(b) means replacing the
 *   conditional hypothesis with a proved monotonicity of |t_c(N)|, or
 *   alternately with a direct stationary-density or pair-correlation
 *   argument (candidates (ii) / (iii) below) that produces an
 *   unconditional inf-bound.
 * - No contradiction with the OLS â ≈ 0.0029. The conditional bound
 *   at 0.0086 is upper and the OLS central is 0.0029; agreement means
 *   conditional UB ≥ statistical central, not equality.
 *
 * The three attack candidates from the ticket
 * -------------------------------------------
 *
 * (i) imp-322 monotonicity + imp-325 repulsion squeeze
 *     The boundary identity dg_{k*}/dt = 4/B − 2 B · S_k* with S_k* ≤ 2/B²
 *     (imp-322) gives dg_{k*}/dt ≥ 0 forward — i.e. min-gap monotone in
 *     forward time — and the Grönwall consequence τ_c(N) ≥ B(0,N)²/8
 *     (imp-325). To close B2(b) one needs a matching LOWER bound on
 *     S_k* that would invert the direction: an estimate of the form
 *     S_k*(t) ≥ c(N)/B(t)² with c(N) → 2 fast enough as N → ∞ would
 *     collapse the boundary identity to dg_{k*}/dt ≤ 0 strictly, and
 *     integrating would give an UPPER bound on τ_c whose limit is 0.
 *     The obstruction: the only S_k* lower bound presently in reach is
 *     pointwise (c = 0) because nothing prevents the configuration
 *     near k* from being locally thin on one side.
 *
 * (ii) Stieltjes transform of the empirical γ-distribution
 *     Define m_N(z) = (1/N) Σ_k 1/(z − γ_k). Under the CM flow m_N
 *     satisfies the complex Burgers equation ∂_t m_N + 2 m_N ∂_z m_N = 0
 *     (Dyson 1962). As N → ∞ with γ_k ~ Riemann-von Mangoldt density
 *     ρ(γ) = log(γ/2π)/(2π), m_N converges (in appropriate Cauchy sense)
 *     to a deterministic m(z,t) solving the same Burgers equation with
 *     initial condition ρ. The collision time for the limit flow is a
 *     shock time of Burgers, which has a closed-form expression in the
 *     initial density. If the Riemann zeros thermalise to the bulk
 *     sine-kernel density at the Path C strip, the Burgers shock time
 *     gives the exact limit of |t_c(N)|, and one can read off a.
 *     Obstruction: the convergence m_N → m is known at the level of
 *     pair correlations (Montgomery 1973, conjecturally) but not in
 *     the strong sense needed to pass collision times through the
 *     limit.
 *
 * (iii) Montgomery-Dyson pair correlation on the min-gap statistic
 *     The Montgomery-Dyson pair correlation R_2(u) = 1 − (sin πu / πu)²
 *     controls the expected number of pairs at spacing ≤ u per unit
 *     height. The minimum gap statistic on N zeros has expected value
 *     O(1 / (N log N)) under GUE, which inserted into the repulsion
 *     ODE gives |t_c(N)| = O(1 / (N log N)²) → 0. That is the
 *     heuristic explanation for why the Path C fit has â close to
 *     zero. Obstruction: the unconditional min-gap statistic is not
 *     known; only the pair correlation is. Turning pair correlation
 *     into a controlled min-gap distribution needs a truncation /
 *     repulsion argument that is open.
 *
 * The conditional upper bound (this file)
 * ---------------------------------------
 *
 *     CONJECTURE (monotonicity of the collision time in N).
 *     For the Calogero-Moser flow on the first N Riemann zeros,
 *     |t_c(N+1)| ≤ |t_c(N)| for all N ≥ 2.
 *
 * Heuristic: adding an extra zero γ_{N+1} contributes a positive
 * term to S_k*(t) for every k adjacent to the new particle and
 * zero contribution elsewhere, so S_k*(t) (weakly) increases
 * pointwise, and by the boundary identity dg_{k*}/dτ (backward time)
 * is pushed more negative, bringing the collision forward. The
 * same heuristic underpins the numerical observation
 * b = 4.91 > 0 in the |t_c(N)| ≈ a + b/N fit.
 *
 *     CONDITIONAL THEOREM (this file).
 *     Under the monotonicity conjecture, a := lim_{N→∞} |t_c(N)|
 *     exists and equals inf_N |t_c(N)|, so
 *
 *         a ≤ |t_c(N_max)|
 *
 *     for any N_max in the baseline. On the recorded PATH_C_BASELINE_FIT
 *     this gives a ≤ 0.0086.
 *
 * The conditional bound is LOOSER than the OLS â = 0.0029 from imp-323,
 * as it must be if the monotonicity conjecture is true. The assertions
 * below enforce this ordering; if a future edit of either file breaks
 * it, one of the numbers is wrong.
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { DYSON_MONOTONICITY_THEOREM } from './dyson-monotonicity-proof.js';
import { DYSON_COLLISION_LOWER_BOUND_THEOREM } from './dyson-collision-lower-bound.js';
import { LAMBDA_INTERCEPT_CONFIDENCE } from './lambda-intercept-confidence.js';

// ── Derive the conditional upper bound from the baseline ────────────────────

function deriveConditionalUpperBound(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return { nMax: null, tcAtNMax: null, upperBound: null, monotoneObserved: false };
  }
  // Sort ascending by N so the monotonicity check reads left-to-right.
  const sorted = [...points].sort((a, b) => a.N - b.N);
  let monotoneObserved = true;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].tc > sorted[i - 1].tc) {
      monotoneObserved = false;
      break;
    }
  }
  const last = sorted[sorted.length - 1];
  return {
    nMax: last.N,
    tcAtNMax: last.tc,
    upperBound: last.tc, // a ≤ |t_c(N_max)| under the monotonicity hypothesis
    monotoneObserved,
    baselineRows: sorted.map((p) => ({ N: p.N, tc: p.tc })),
  };
}

export const CONDITIONAL_UPPER_BOUND = deriveConditionalUpperBound(PATH_C_BASELINE_FIT);

// ── The theorem record, for other modules to quote ──────────────────────────

export const LAMBDA_INTERCEPT_ANALYTIC = {
  id: 'imp-328',
  blocker: 'B2(b)-analytic-intercept-upper-bound (lambda-zero-attack.js)',
  problem:
    'Give an analytic a-priori upper bound on a := lim sup_{N→∞} |t_c(N)| ' +
    'derived from the Calogero-Moser evolution, so that Λ ≤ -a ≤ 0 can be ' +
    'established without relying on the imp-323 statistical fit.',
  status: 'interim (conditional upper bound only)',
  consumes: [
    DYSON_MONOTONICITY_THEOREM.id + ' — boundary identity dg_{k*}/dt = 4/B − 2 B S_k*',
    DYSON_COLLISION_LOWER_BOUND_THEOREM.id + ' — lower bound τ_c ≥ B(0)²/8',
    'imp-323 LAMBDA_INTERCEPT_CONFIDENCE.fit — OLS central â for cross-check',
  ],
  candidates: [
    {
      label: '(i) imp-322 + imp-325 squeeze',
      idea:
        'Use the boundary identity dg_{k*}/dt = 4/B − 2 B S_k* and a matching ' +
        'LOWER bound on S_k* of the form S_k* ≥ c(N)/B² with c(N) → 2 to ' +
        'get dg_{k*}/dt ≤ 0 strictly, then integrate for an upper bound on τ_c.',
      obstruction:
        'The only unconditional S_k* lower bound presently in reach is c = 0: ' +
        'nothing prevents the min-gap neighborhood from being locally thin on ' +
        'one side of k*. A density-aware lower bound on S_k* is the open piece.',
    },
    {
      label: '(ii) Stieltjes / complex Burgers',
      idea:
        'The empirical Stieltjes transform m_N satisfies ∂_t m_N + 2 m_N ∂_z m_N = 0 ' +
        '(Dyson 1962). The N → ∞ limit of the collision time is the Burgers shock ' +
        'time of the Riemann-von Mangoldt density ρ(γ) = log(γ/2π)/(2π).',
      obstruction:
        'SUPERSEDED: imp-338 shipped the continuum shock time τ_shock(ρ_∞) = 0, ' +
        'and imp-341 closed the G5_burgers uniformity gap via a deterministic ' +
        'Koksma-Hlawka discrepancy bound using ONLY the Selberg |S(T)| = ' +
        'O(log T / log log T) estimate — no pair correlation input is required. ' +
        'The limit claim a := lim sup_N |t_c(N)| = 0 now holds UNCONDITIONALLY ' +
        'along the N-particle Dyson flow. Translating to a per-N bound still ' +
        'needs either imp-336 monotonicity or an upgraded ψ_N rate — see ' +
        'imp-344 lambda-intercept-unconditional.js for the assembly + the new ' +
        'G6_polymath15_bridge open gap between the N-particle claim and Λ.',
    },
    {
      label: '(iii) Montgomery-Dyson min-gap heuristic',
      idea:
        'Under Montgomery-Dyson pair correlation R_2(u) = 1 − (sin πu / πu)², the GUE ' +
        'minimum gap on N points is O(1/(N log N)). Inserting into the repulsion ODE ' +
        'gives |t_c(N)| = O(1/(N log N)²) → 0.',
      obstruction:
        'The min-gap statistic itself is not controlled by pair correlation alone; ' +
        'turning R_2 into a min-gap distribution needs a truncation / repulsion ' +
        'argument that is open even for GUE.',
    },
  ],
  conditionalTheorem: {
    hypothesis:
      'Monotonicity conjecture: |t_c(N+1)| ≤ |t_c(N)| for the Calogero-Moser ' +
      'flow on the first N Riemann zeros, for all N ≥ 2.',
    conclusion:
      'Under the hypothesis, a = lim_{N→∞} |t_c(N)| exists and equals inf_N |t_c(N)|, ' +
      'so a ≤ |t_c(N_max)| for any N_max in the baseline.',
    appliedToBaseline: CONDITIONAL_UPPER_BOUND,
  },
  crossCheckOLS: {
    olsCentral: LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a,
    conditionalUpperBound: CONDITIONAL_UPPER_BOUND.upperBound,
    conditionalIsLooserThanOLS:
      CONDITIONAL_UPPER_BOUND.upperBound !== null &&
      CONDITIONAL_UPPER_BOUND.upperBound >= LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a,
    interpretation:
      'The conditional upper bound must be ≥ the OLS central value if the ' +
      'monotonicity conjecture is true (inf ≥ any OLS projection that lies below). ' +
      'A future edit that flips this ordering means one of the two numbers is wrong.',
  },
  openWork: [
    'Prove or refute the monotonicity conjecture |t_c(N+1)| ≤ |t_c(N)|.',
    'Land candidate (i): a pointwise-in-t lower bound on S_k* of strength c(N)/B² with c(N) → 2.',
    'Land candidate (ii) or (iii) as an alternate unconditional route.',
    'Extend the baseline to log-spaced N (imp-321 follow-up) and re-evaluate the conditional bound there.',
  ],
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_ANALYTIC_ASSERTIONS = [
  {
    id: 'imp328-conditional-upper-bound-defined',
    holds: () =>
      CONDITIONAL_UPPER_BOUND.upperBound !== null &&
      Number.isFinite(CONDITIONAL_UPPER_BOUND.upperBound) &&
      CONDITIONAL_UPPER_BOUND.upperBound > 0,
    why:
      'The conditional upper bound must be a finite positive number for it to ' +
      'function as a bound on a. Catches an empty or corrupted baseline.',
  },
  {
    id: 'imp328-baseline-monotone-observed',
    holds: () => CONDITIONAL_UPPER_BOUND.monotoneObserved === true,
    why:
      'The conditional upper bound rests on |t_c(N)| being monotone non-increasing ' +
      'in N. On the recorded PATH_C_BASELINE_FIT this must be numerically observed ' +
      '(it is: 0.1435 > 0.0723 > 0.0352 > 0.0163 > 0.0086). A future edit that ' +
      'inserts a non-monotone point silently invalidates the conditional bound; ' +
      'this assertion catches that.',
  },
  {
    id: 'imp328-conditional-upper-bound-looser-than-ols',
    holds: () =>
      LAMBDA_INTERCEPT_ANALYTIC.crossCheckOLS.conditionalIsLooserThanOLS === true,
    why:
      'Under the monotonicity conjecture, inf_N |t_c(N)| ≤ |t_c(N_max)|, and the ' +
      'OLS central â is a particular projection of the inf. So the conditional upper ' +
      'bound must be ≥ the OLS central â. If it is NOT, either the monotonicity ' +
      'conjecture fails on the recorded baseline, or one of the two numbers has ' +
      'drifted out of sync with the other.',
  },
  {
    id: 'imp328-consumes-imp322-and-imp325',
    holds: () =>
      DYSON_MONOTONICITY_THEOREM.id === 'imp-322' &&
      DYSON_COLLISION_LOWER_BOUND_THEOREM.id === 'imp-325',
    why:
      'The attack candidates cite imp-322 (boundary identity) and imp-325 (collision ' +
      'time lower bound) by id. If those ids change without updating this file, the ' +
      'citation chain breaks silently; this assertion is the tripwire.',
  },
];
