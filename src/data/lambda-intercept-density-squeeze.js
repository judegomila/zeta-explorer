/**
 * imp-337: density-aware S_k* squeeze — imp-328 candidate (i)
 *
 * Starting point
 * --------------
 * imp-322 (DYSON_MONOTONICITY_THEOREM) established the boundary identity for
 * the minimum-gap trajectory at the argmin site k* along the BACKWARD
 * Calogero-Moser flow:
 *
 *     dg_{k*}/dτ = 4/B − 2 B · S_{k*},        B := g_{k*},
 *     S_{k*} = Σ_{j ≠ k*, j ≠ k*+1} 1 / (γ_j − γ_{k*})²_symmetrised.
 *
 * imp-325 (DYSON_COLLISION_LOWER_BOUND_THEOREM) shipped the unconditional
 * S_{k*} ≥ 0 case: dropping the sum gives dg/dτ ≤ 4/B and integrates to the
 * isolated-pair collision lower bound τ_c ≥ B(0)²/8. That is the weakest
 * instance of the squeeze — c = 0 in the parametrisation S_{k*} ≥ c(N)/B².
 *
 * imp-328 candidate (i) asks the complementary question: what is the
 * strongest UNCONDITIONAL S_{k*} lower bound of the form
 *
 *     S_{k*}(τ)  ≥  c(N) / B(τ)²
 *
 * available at finite N, and what does c(N) > 0 do to the collision-time
 * estimate? The ticket proposes c(N) = 2 + δ(N) where δ(N) absorbs a finite-N
 * Weyl-density correction to the nearest-neighbour doubling from the two
 * sides of k*. The goal is to trade the monotonicity conjecture of imp-328
 * for a density-level structural statement that closes the intercept a
 * unconditionally.
 *
 * The closed-form τ_c under the squeeze
 * --------------------------------------
 * Assuming the pointwise-in-τ lower bound S_{k*}(τ) ≥ c(N)/B(τ)² along the
 * backward trajectory, the boundary identity becomes
 *
 *     dg/dτ  ≤  4/B − 2 c(N) / B  =  (4 − 2 c(N)) / B.
 *
 * Multiplying by B and integrating from τ = 0 back to the collision time
 * τ_c < 0 where B(τ_c) = 0 gives
 *
 *     (1/2) · B(τ_c)²  −  (1/2) · B(0)²  ≤  (4 − 2 c(N)) · τ_c,
 *     − (1/2) · B(0)²  ≤  (4 − 2 c(N)) · τ_c.
 *
 * Three regimes:
 *   (a) c(N) < 2  →  4 − 2 c(N) > 0 and τ_c < 0, so
 *                    |τ_c|  ≤  B(0)² / (2 · (4 − 2 c(N))) = B(0)² / (8 − 4 c(N)).
 *                    c = 0 recovers imp-325's B(0)²/8. Any c ∈ (0, 2) gives a
 *                    STRICTLY LARGER upper-bound denominator floor on |τ_c|,
 *                    which is the WRONG direction for intercept control —
 *                    the squeeze in this regime is a lower bound on collision
 *                    time, not an upper bound on the intercept a.
 *   (b) c(N) = 2  →  dg/dτ ≤ 0, the gap is weakly monotone decreasing
 *                    backward. No finite upper bound on |τ_c| follows; in
 *                    fact this is the critical case where the backward
 *                    flow at the argmin stalls.
 *   (c) c(N) > 2  →  4 − 2 c(N) < 0 and the integrated inequality flips sign:
 *                    |τ_c|  ≤  B(0)² / (4 c(N) − 8).
 *                    THIS is the regime the ticket asks for: the density
 *                    correction δ(N) > 0 must push c(N) strictly above 2 to
 *                    deliver a non-vacuous upper bound on |τ_c| and hence a
 *                    CANDIDATE upper bound on the intercept
 *
 *                         a  ≤  lim sup_N B_N(0)² / (4 c(N) − 8),
 *
 *                    contingent on c(N) → 2⁺ no faster than B_N(0)² → 0.
 *
 * The two-sided Weyl density estimate for c(N)
 * --------------------------------------------
 * At height γ_{k*} ≈ γ_{N/2}, the Riemann-von Mangoldt local density is
 * ρ(γ) = (1/(2π)) · log(γ/(2π)), and the N-th non-trivial zero sits at
 *
 *     γ_N  ≈  2π N / log(N / (2π e)).
 *
 * Immediate two-sided neighbours contribute 2 · (1/B²) to S_{k*}, which is
 * exactly the c = 2 critical case. Every further-out neighbour contributes
 * a positive correction, and the leading-order sum over the ~ρ(γ_N)·B-many
 * zeros within a constant multiple of B gives, in the smoothed limit,
 *
 *     S_{k*}  ≈  (2 / B²) · (1 + δ(N)),       δ(N) = Θ(1 / log N),
 *
 * where the 1/log N comes from the logarithmic local density of zeros on
 * the critical line. Hence the candidate structural form
 *
 *     c(N)  =  2 · (1 + δ(N)),     δ(N) ≈ κ / log(γ_N / (2π)),
 *
 * with κ a GUE-shape constant of order unity. This file stores the
 * numerical witnesses of c(N) and the resulting squeeze-regime upper bound
 * on |τ_c| for the points of PATH_C_BASELINE_FIT, BUT is explicit that the
 * pointwise-in-τ lower bound S_{k*}(τ) ≥ c(N)/B(τ)² along the WHOLE backward
 * trajectory is NOT proved here. It remains the open gap the ticket flags
 * as "density-aware lower bound on S_k*".
 *
 * Honest verdict
 * --------------
 * This file is a STRUCTURAL LANDING SITE for imp-328 candidate (i), not a
 * theorem. It ships:
 *   - the closed-form τ_c-under-the-squeeze in all three regimes,
 *   - a Weyl-density candidate form c(N) = 2 · (1 + κ/log(γ_N/(2π))),
 *   - numerical values of c(N), the squeeze-regime upper bound B_N(0)² /
 *     (4 c(N) − 8), and the implied candidate intercept upper bound on
 *     PATH_C_BASELINE_FIT,
 *   - an EXPLICIT open-gap marker for the pointwise S_{k*} ≥ c(N)/B² claim
 *     (call it gap G3_density), wired into a tripwire assertion so any
 *     future "closed" flip forces co-update of lambda-intercept-analytic.js,
 *     bridge-lambda-rh.js, and lambda-zero-attack.js in the same commit.
 *
 * It does NOT upgrade the imp-328 conditional bound a ≤ 0.0086 to an
 * unconditional theorem. The candidate intercept upper bound reported here
 * is CONDITIONAL on G3_density.
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { LAMBDA_INTERCEPT_CONFIDENCE } from './lambda-intercept-confidence.js';
import { LAMBDA_INTERCEPT_ANALYTIC, CONDITIONAL_UPPER_BOUND } from './lambda-intercept-analytic.js';

// ── Weyl-law approximants ───────────────────────────────────────────────────

// N-th non-trivial Riemann zero height via Riemann-von Mangoldt inversion
// γ_N ≈ 2π N / W(N / e) where W is Lambert W; the closed form below is the
// standard leading-order approximation good to ~1% for N ≥ 50.
function gammaN(N) {
  const u = N / Math.E;
  // 3 Newton iterations on u = t · e^t starting from t = log(u).
  let t = Math.log(u);
  for (let i = 0; i < 3; i++) {
    const et = Math.exp(t);
    t = t - (t * et - u) / (et * (1 + t));
  }
  return (2 * Math.PI * N) / t;
}

// Local density ρ(γ) = (1/2π) log(γ/2π).
function weylDensity(gamma) {
  return Math.log(gamma / (2 * Math.PI)) / (2 * Math.PI);
}

// Candidate c(N) = 2 · (1 + κ / log(γ_N / 2π)) with κ = 1 as the
// order-unity GUE-shape constant. Setting κ > 0 is what PUTS us in
// regime (c), i.e. c(N) > 2 strictly.
const KAPPA = 1.0;

function cOfN(N) {
  const g = gammaN(N);
  const L = Math.log(g / (2 * Math.PI));
  if (!(L > 0)) return null;
  return 2 * (1 + KAPPA / L);
}

// ── Squeeze-regime upper bound on |τ_c|(N) ──────────────────────────────────
// In regime (c), |τ_c| ≤ B(0)² / (4 c(N) − 8). We do not know B(0) a priori;
// the cleanest calibration is to identify B(0) with the minimum initial gap
// at height γ_N, which scales as 1 / ρ(γ_N) = 2π / log(γ_N/2π). Using that
// surrogate is honest: it is the Weyl-smoothed mean gap, and any tighter
// min-gap scaling (Vinson / Ben Arous-Bourgade) would only SHRINK B(0)² and
// therefore tighten the squeeze bound — the surrogate is a CONSERVATIVE
// over-estimate of |τ_c|.
function squeezeUpperBound(N) {
  const c = cOfN(N);
  if (c === null || !(c > 2)) return null;
  const g = gammaN(N);
  const rho = weylDensity(g);
  if (!(rho > 0)) return null;
  const B0 = 1 / rho;
  const denom = 4 * c - 8;
  return (B0 * B0) / denom;
}

// ── Apply to PATH_C_BASELINE_FIT ────────────────────────────────────────────

const SQUEEZE_ROWS = [...PATH_C_BASELINE_FIT]
  .sort((a, b) => a.N - b.N)
  .map((pt) => {
    const g = gammaN(pt.N);
    const c = cOfN(pt.N);
    const ub = squeezeUpperBound(pt.N);
    return {
      N: pt.N,
      gammaN: g,
      logGammaOver2pi: Math.log(g / (2 * Math.PI)),
      cOfN: c,
      cExceedsCritical: c !== null && c > 2,
      observed_tc: pt.tc,
      squeezeUpperBound_tc: ub,
      squeezeBoundLooserThanObserved:
        ub !== null && ub >= pt.tc,
    };
  });

// Candidate intercept upper bound under G3_density: take lim sup of the
// per-N squeeze bounds on the BASELINE, which means taking the max of the
// listed rows (the squeeze bound grows with B(0)², which grows with N under
// the Weyl surrogate — a reminder that the surrogate is conservative).
const BASELINE_SQUEEZE_INTERCEPT_UB = SQUEEZE_ROWS.reduce((max, row) => {
  if (row.squeezeUpperBound_tc === null) return max;
  return row.squeezeUpperBound_tc > max ? row.squeezeUpperBound_tc : max;
}, 0);

// ── The record ──────────────────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_DENSITY_SQUEEZE = {
  id: 'imp-337',
  blocker: 'B2(b)-analytic-intercept-upper-bound (imp-328 candidate (i), density-aware S_k* squeeze)',
  status:
    'structural landing site — candidate intercept upper bound CONDITIONAL on G3_density ' +
    '(pointwise-in-τ lower bound S_{k*}(τ) ≥ c(N)/B(τ)² along the backward trajectory)',
  consumes: [
    'imp-322 DYSON_MONOTONICITY_THEOREM boundary identity dg_{k*}/dτ = 4/B − 2 B · S_{k*}',
    'imp-325 DYSON_COLLISION_LOWER_BOUND_THEOREM τ_c ≥ B(0)²/8 (the c = 0 instance)',
    'imp-328 LAMBDA_INTERCEPT_ANALYTIC candidate (i) framing and CONDITIONAL_UPPER_BOUND baseline',
    'imp-323 LAMBDA_INTERCEPT_CONFIDENCE.fit — OLS (a, b) for cross-check',
    'PATH_C_BASELINE_FIT (src/math/dyson-scaling-N5000.js) — 5-point (N, |t_c|)',
  ],
  closedFormTauC: {
    regimes: [
      {
        label: '(a) c(N) < 2',
        formula: '|τ_c| ≤ B(0)² / (8 − 4 c(N))',
        interpretation:
          'Subcritical: the inequality is a LOWER bound on collision time ' +
          '(imp-325 at c = 0). Not useful for intercept control.',
      },
      {
        label: '(b) c(N) = 2',
        formula: 'dg/dτ ≤ 0, no finite bound',
        interpretation:
          'Critical: the backward flow at the argmin stalls. Degenerate.',
      },
      {
        label: '(c) c(N) > 2',
        formula: '|τ_c| ≤ B(0)² / (4 c(N) − 8)',
        interpretation:
          'Supercritical: this IS the regime the ticket asks for. A non-vacuous ' +
          'upper bound on |τ_c| follows, and a ≤ lim sup_N B_N(0)² / (4 c(N) − 8).',
      },
    ],
  },
  densityForm: {
    kappa: KAPPA,
    cOfNFormula: 'c(N) = 2 · (1 + κ / log(γ_N / 2π)), κ ≈ 1',
    gammaNFormula: 'γ_N ≈ 2π N / W(N/e), Riemann-von Mangoldt inversion',
    rhoFormula: 'ρ(γ) = (1/2π) · log(γ/2π)',
    b0Surrogate:
      'B(0) ← 1 / ρ(γ_N) = 2π / log(γ_N/2π). Conservative over-estimate of the ' +
      'initial min-gap — any tighter Vinson / Ben Arous-Bourgade scale ' +
      'SHRINKS the squeeze upper bound.',
  },
  baselineRows: SQUEEZE_ROWS,
  candidateInterceptUpperBound: {
    conditionalOn: 'G3_density: pointwise S_{k*}(τ) ≥ c(N)/B(τ)² on the backward trajectory',
    value: BASELINE_SQUEEZE_INTERCEPT_UB,
    vsImp328Conditional: CONDITIONAL_UPPER_BOUND.upperBound,
    vsImp323OLS: LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a,
    tightensImp328:
      BASELINE_SQUEEZE_INTERCEPT_UB > 0 &&
      CONDITIONAL_UPPER_BOUND.upperBound !== null &&
      BASELINE_SQUEEZE_INTERCEPT_UB < CONDITIONAL_UPPER_BOUND.upperBound,
    interpretation:
      'The candidate intercept upper bound is itself CONDITIONAL on G3_density. ' +
      'Whether it is numerically tighter than the imp-328 monotonicity-conditional ' +
      'bound depends on the choice of κ and the B(0) surrogate; the baseline rows ' +
      'show the per-N squeeze bound so the comparison is transparent. The tripwire ' +
      'below prevents silent promotion of this bound to unconditional status.',
  },
  openGaps: {
    G3_density: {
      statement:
        'Prove the pointwise-in-τ lower bound S_{k*(τ)}(τ) ≥ c(N)/B(τ)² along the ' +
        'backward Calogero-Moser trajectory for c(N) = 2 · (1 + κ/log(γ_N/2π)).',
      why:
        'Without this, the closed-form squeeze in regime (c) is a purely heuristic ' +
        'template; the argmin site k*(τ) can wander and the two-sided Weyl density ' +
        'estimate on the STATIC configuration does not transfer to a uniform-in-τ ' +
        'inequality without additional structure.',
      status: 'open',
    },
    G4_argmin_drift: {
      statement:
        'Control the drift of the argmin site k*(τ) along the backward trajectory ' +
        'so that c(N) = 2 · (1 + κ/log(γ_{k*(τ)}/2π)) is uniform in τ.',
      why:
        'Without argmin-site control, the density correction δ(N) is defined at ' +
        'τ = 0 only; propagating it along the flow is the second half of closing G3.',
      status: 'open',
    },
  },
  openWork: [
    'Close G3_density: either via a two-sided interlacing argument on S_{k*} at finite N ' +
      'using the Dyson repulsion sign, or via a Cauchy-Schwarz / Hardy-type inequality ' +
      'on the symmetrised kernel Σ 1/(γ_j − γ_{k*})².',
    'Close G4_argmin_drift: track k*(τ) via the sub-Markov chain induced by the ' +
      'argmin-update identity and bound its wandering length.',
    'Either closure promotes candidateInterceptUpperBound.value from CONDITIONAL to ' +
      'UNCONDITIONAL and forces the co-update of lambda-intercept-analytic.js ' +
      '(replace the imp-328 conditional with the imp-337 unconditional), ' +
      'bridge-lambda-rh.js.remainingSteps, and lambda-zero-attack.js.openWork.',
  ],
  consumesAnalyticId: LAMBDA_INTERCEPT_ANALYTIC.id,
  consumesBaselineUpperBound: CONDITIONAL_UPPER_BOUND.upperBound,
};

// ── Build-time assertions ───────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_DENSITY_SQUEEZE_ASSERTIONS = [
  {
    id: 'imp337-c-of-N-strictly-supercritical',
    holds: () =>
      SQUEEZE_ROWS.length > 0 &&
      SQUEEZE_ROWS.every((row) => row.cOfN !== null && row.cOfN > 2),
    why:
      'For the density correction to deliver the regime (c) upper bound at every ' +
      'baseline N, c(N) must be strictly > 2. A regression to c(N) ≤ 2 means the ' +
      'Weyl density correction has been miscalibrated or κ has been zeroed out.',
  },
  {
    id: 'imp337-closed-form-finite-positive',
    holds: () =>
      SQUEEZE_ROWS.every(
        (row) =>
          row.squeezeUpperBound_tc !== null &&
          Number.isFinite(row.squeezeUpperBound_tc) &&
          row.squeezeUpperBound_tc > 0,
      ),
    why:
      'Every per-N squeeze upper bound must be a finite positive number. A non-finite ' +
      'or non-positive value means the denominator 4 c(N) − 8 crossed zero or the ' +
      'B(0) surrogate blew up — either is a silent bug.',
  },
  {
    id: 'imp337-G3-density-still-open',
    holds: () =>
      LAMBDA_INTERCEPT_DENSITY_SQUEEZE.openGaps.G3_density.status === 'open' &&
      LAMBDA_INTERCEPT_DENSITY_SQUEEZE.openGaps.G4_argmin_drift.status === 'open' &&
      LAMBDA_INTERCEPT_DENSITY_SQUEEZE.candidateInterceptUpperBound.conditionalOn.includes(
        'G3_density',
      ),
    why:
      'TRIPWIRE: G3_density and G4_argmin_drift must remain marked "open" until the ' +
      'pointwise-in-τ S_{k*} lower bound and the argmin-drift control are actually ' +
      'proved. If a future commit flips either to "closed", lambda-intercept-analytic.js ' +
      '(candidate (i) obstruction), bridge-lambda-rh.js.remainingSteps, and ' +
      'lambda-zero-attack.js.openWork MUST be updated in the same commit so the ' +
      'project-wide story for B2(b) stays coherent.',
  },
  {
    id: 'imp337-consumes-imp328-and-imp323',
    holds: () =>
      LAMBDA_INTERCEPT_ANALYTIC.id === 'imp-328' &&
      CONDITIONAL_UPPER_BOUND.upperBound !== null &&
      typeof LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a === 'number',
    why:
      'imp-337 cites imp-328 by id and consumes the imp-328 baseline conditional upper ' +
      'bound plus the imp-323 OLS central value for cross-comparison. If any of those ' +
      'drifts out from under this file the citation chain breaks.',
  },
];
