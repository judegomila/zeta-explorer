/**
 * imp-336: prove/refute the imp-328 monotonicity conjecture
 *
 *     HYPOTHESIS (M):  |t_c(N+1)| ≤ |t_c(N)|  for all N ≥ 2,
 *
 * where t_c(N) is the backward Calogero-Moser collision time of the first N
 * Riemann zeros under the Dyson flow. imp-328 shipped a CONDITIONAL theorem:
 * under (M), the statistical intercept
 *
 *     a := lim_{N→∞} |t_c(N)|  =  inf_{N} |t_c(N)|
 *
 * exists and equals the infimum, from which a ≤ |t_c(N_max)| ≈ 0.0086 on
 * PATH_C_BASELINE_FIT. The conditional is load-bearing for the imp-328 /
 * imp-340 chain. imp-336 asks us to upgrade it: prove (M), or refute it.
 *
 * This file delivers the imp-336 ticket scope as two independent angles
 * plus a combined verdict and build-time assertions, with NO new library
 * dependencies and NO structural changes to upstream files.
 *
 * Angle (a) — empirical witness
 * -----------------------------
 * Directly verify (M) on two series:
 *
 *   (A1) PATH_C_BASELINE_FIT (imp-299/imp-323 baseline): the 5 sampled
 *        rows (N, |t_c|) with N ∈ {50, 100, 200, 500, 2458}. This is a
 *        sampled witness: (M) is a per-N statement but the baseline only
 *        pins 5 N-values, so at best we witness (M) at those 5 anchors.
 *        Any non-strict-decrease among these 5 immediately falsifies (M).
 *
 *   (A2) PT_SCALE_EXTRAPOLATION.ladder (imp-321): the log-spaced ladder up
 *        to N = 10^8. These rows are currently the arithmetic round-trip
 *        projected_tc = OLS_A + OLS_B/N of the imp-323 fit, so they are
 *        strictly decreasing in N by construction. This is a TAUTOLOGICAL
 *        monotonicity witness — it confirms consistency of the framework
 *        but adds no new empirical information. When imp-321 follow-up
 *        replaces projected_tc with measured sampled-zero Dyson collision
 *        times, this file re-evaluates automatically and the ladder check
 *        becomes non-trivial.
 *
 * Failure to find a non-monotone pair at ANY recorded (N_i, N_{i+1}) is
 * evidence FOR (M) at those anchors. It is not a proof, because adjacent
 * integer steps |t_c(N) → t_c(N+1)| are not sampled. The file states this
 * honestly in the verdict.
 *
 * Angle (b) — analytic sketch using imp-322 + Dyson repulsion
 * -----------------------------------------------------------
 * imp-322 (dyson-monotonicity-proof.js) proved that under the forward
 * Calogero-Moser flow dγ_k/dt = 2 Σ_{j≠k} 1/(γ_k − γ_j), the minimum gap
 * B(t) = min_k (γ_{k+1}(t) − γ_k(t)) is non-decreasing in t. Equivalently,
 * under backward flow B(t) is non-increasing, and the first backward time
 * at which B vanishes is the collision time t_c.
 *
 * Let γ^{(N)}(t) denote the backward flow on the first N zeros and
 * γ^{(N+1)}(t) the backward flow on the first N+1 zeros, both seeded at
 * t = 0 from the Riemann zeros. Write B_N(t) = min-gap of γ^{(N)}(t) and
 * k*_N(t) its argmin site. The ticket's analytic angle (b) reads:
 *
 *   Claim.  dB_N/dτ ≤ dB_{N+1}/dτ at τ = 0, and more generally B_{N+1}(τ)
 *           ≤ B_N(τ) on a common interval of backward times that contains
 *           [0, τ_c(N)], from which τ_c(N+1) ≤ τ_c(N) by imp-322 vanishing.
 *
 *   Sketch. Add the (N+1)-th particle at γ_{N+1}(0). The Dyson drift at
 *   the argmin site k*_N of the N-particle system picks up an extra
 *   2 / (γ_{k*+1} − γ_{N+1}) term (if N+1 is the higher-index neighbour of
 *   the argmin pair) or − 2/(γ_{N+1} − γ_{k*}) (if it is the lower-index
 *   neighbour). Either way the extra term is bounded in absolute value by
 *   2 / Δ_{k*, N+1} where Δ is the distance from the argmin site to the
 *   newly added particle. Because k*_N is interior to the first N zeros
 *   and γ_{N+1} is strictly above γ_N, the extra contribution REINFORCES
 *   the imp-322 sign at k*_N. Under backward flow this means the (N+1)-
 *   particle min-gap decays at least as fast as the N-particle one at the
 *   shared argmin site, and by the imp-322 equality case (only tight in
 *   the equally-spaced configuration) the inequality is strict whenever
 *   the incoming zero is not itself at distance exactly B_N(0) from
 *   γ_N(0). Iterating backward and using the imp-322 fact that B is non-
 *   increasing gives B_{N+1}(τ) ≤ B_N(τ) on [0, τ_c(N)], hence
 *   τ_c(N+1) ≤ τ_c(N).
 *
 * This sketch has two GAPS that prevent it from being a rigorous proof
 * inside this file:
 *
 *   (G1) "Reinforces sign at k*_N" uses the fact that k*_N is interior
 *        and that the incoming particle is on one side. For the first
 *        few N this is true by inspection of ZETA_ZEROS; in general it
 *        needs a Weyl-density statement that k*_N stays interior with
 *        margin → 0. Handled empirically at N ≤ 5000 by imp-299 via
 *        barrier-extrapolation.js, but not proved analytically here.
 *
 *   (G2) The argmin sites k*_N and k*_{N+1} can differ, and in the
 *        differing case the argmin pair at step N+1 may belong to a
 *        locally different region where the N-particle drift sign does
 *        not transfer. A rigorous closure needs a pair-majorization
 *        argument (Schur-like) that handles argmin jumps. Not attempted
 *        here — flagged as open work.
 *
 * Because of (G1)(G2) this file does NOT claim to have proved (M). It
 * ships the analytic sketch as a structured record so future work has a
 * concrete target, and flags the two gaps so they cannot be silently
 * handwaved away in a later rewrite.
 *
 * What this file delivers
 * -----------------------
 *   1. Angle (a) monotonicity check on PATH_C_BASELINE_FIT and on
 *      PT_SCALE_EXTRAPOLATION.ladder, with a structured record of any
 *      violating pair (there are none at the current baselines).
 *   2. Angle (b) analytic sketch as an ANALYTIC_SKETCH record with two
 *      named gaps (G1)(G2) and the status "non-rigorous sketch".
 *   3. A combined verdict that spells out which part of imp-328's
 *      conditional is upgraded: angle (a) witnesses (M) at the 5 baseline
 *      anchors and at all imp-321 ladder rows, so the imp-328 conditional
 *      upper bound a ≤ 0.0086 is empirically unfalsified at the sampled
 *      N-values. It is NOT upgraded to unconditional, because (M) is a
 *      per-N statement and the analytic sketch has open gaps.
 *   4. Build-time assertions that (i) no non-monotone pair exists in the
 *      baseline or the ladder, (ii) the imp-328 conditional bound is
 *      still the infimum at the baseline N_max, (iii) the citation chain
 *      to imp-322 / imp-328 / imp-321 resolves.
 *
 * What this file does NOT claim
 * -----------------------------
 * - (M) is NOT proved. The verdict reads "empirically unfalsified at all
 *   sampled N, analytic sketch incomplete due to (G1)(G2)".
 * - The imp-328 conditional is NOT upgraded to unconditional. If a future
 *   contribution closes (G1) and (G2), this file's assertion block
 *   REQUIRES that lambda-intercept-analytic.js, bridge-lambda-rh.js, and
 *   lambda-zero-attack.js all be updated in the same commit to promote
 *   the conditional to a theorem.
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { PT_SCALE_EXTRAPOLATION } from './lambda-pt-scale-extrapolation.js';
import {
  LAMBDA_INTERCEPT_ANALYTIC,
  CONDITIONAL_UPPER_BOUND,
} from './lambda-intercept-analytic.js';
import { DYSON_MONOTONICITY_THEOREM } from './dyson-monotonicity-proof.js';

// ── Angle (a): empirical monotonicity witness ──────────────────────────────

function findNonMonotonePair(points) {
  const sorted = [...points].sort((a, b) => a.N - b.N);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].tc > sorted[i - 1].tc) {
      return {
        fromN: sorted[i - 1].N,
        toN: sorted[i].N,
        fromTc: sorted[i - 1].tc,
        toTc: sorted[i].tc,
      };
    }
  }
  return null;
}

function monotonicityCheck(points, label) {
  const sorted = [...points].sort((a, b) => a.N - b.N);
  const offender = findNonMonotonePair(sorted);
  const decreases = [];
  for (let i = 1; i < sorted.length; i++) {
    decreases.push({
      fromN: sorted[i - 1].N,
      toN: sorted[i].N,
      drop: sorted[i - 1].tc - sorted[i].tc,
      ratio: sorted[i].tc / sorted[i - 1].tc,
    });
  }
  return {
    label,
    nPoints: sorted.length,
    nMin: sorted[0]?.N ?? null,
    nMax: sorted[sorted.length - 1]?.N ?? null,
    monotoneObserved: offender === null,
    violatingPair: offender,
    consecutiveDrops: decreases,
  };
}

const BASELINE_POINTS = PATH_C_BASELINE_FIT.map((p) => ({ N: p.N, tc: p.tc }));
const LADDER_POINTS = PT_SCALE_EXTRAPOLATION.ladder.map((row) => ({
  N: row.N,
  tc: row.projected_tc,
}));

const BASELINE_CHECK = monotonicityCheck(BASELINE_POINTS, 'PATH_C_BASELINE_FIT');
const LADDER_CHECK = monotonicityCheck(LADDER_POINTS, 'PT_SCALE_EXTRAPOLATION.ladder');

// ── Angle (b): analytic sketch record ──────────────────────────────────────

const ANALYTIC_SKETCH = {
  claim:
    'Under the backward Calogero-Moser flow, τ_c(N+1) ≤ τ_c(N) for all N ≥ 2, ' +
    'where τ_c(N) is the first backward time at which B_N(τ) vanishes.',
  uses: [
    'imp-322 (DYSON_MONOTONICITY_THEOREM): B_N(t) is non-increasing under backward flow.',
    'Dyson drift dγ_k/dt = 2 Σ_{j≠k} 1/(γ_k − γ_j) — adding the (N+1)-th particle ' +
      'adds a single extra 2/(γ_{k*} − γ_{N+1}) term at the argmin site of the ' +
      'N-particle system.',
    'Weyl density of the Riemann zeros: γ_{N+1} − γ_N → 2π / log(γ_N / 2π), so ' +
      'the incoming particle is strictly above γ_N(0).',
  ],
  sketch:
    'Let k*_N = argmin of B_N(0). At k*_N the backward flow drift picks up an ' +
    'extra ±2/(γ_{N+1} − γ_{k*+1}) or ±2/(γ_{N+1} − γ_{k*}) term when the ' +
    '(N+1)-th particle is added, and by the imp-322 sign analysis this extra ' +
    'term reinforces the imp-322 backward-decay sign at k*_N for k* interior ' +
    'to the first N zeros. Iterating backward and using imp-322 monotonicity, ' +
    'B_{N+1}(τ) ≤ B_N(τ) on [0, τ_c(N)], so τ_c(N+1) ≤ τ_c(N).',
  gaps: [
    {
      id: 'G1',
      summary:
        'k*_N interior with uniform margin. The sign-reinforcement step ' +
        'assumes k*_N is not at the top of the truncation, i.e. that the ' +
        'argmin pair is interior. Empirically verified at N ≤ 5000 by ' +
        'imp-299 via barrier-extrapolation.js, but no analytic proof of ' +
        '"k*_N stays interior with N → ∞" is provided here.',
      status: 'open — empirical witness only',
    },
    {
      id: 'G2',
      summary:
        'Argmin jumps between N and N+1. If k*_N ≠ k*_{N+1}, the N-particle ' +
        'drift sign at k*_N does not directly transfer to the (N+1)-particle ' +
        'argmin site. A rigorous closure needs a pair-majorization (Schur- ' +
        'like) comparison handling the jump. Not attempted.',
      status: 'open — no attempt',
    },
  ],
  status: 'non-rigorous sketch — (G1) and (G2) prevent closure',
};

// ── Combined verdict ───────────────────────────────────────────────────────

const EMPIRICALLY_MONOTONE_ON_BASELINE = BASELINE_CHECK.monotoneObserved;
const EMPIRICALLY_MONOTONE_ON_LADDER = LADDER_CHECK.monotoneObserved;
const ANALYTIC_CLOSED = ANALYTIC_SKETCH.gaps.every((g) => g.status.startsWith('closed'));
const CONJECTURE_PROVED = EMPIRICALLY_MONOTONE_ON_BASELINE && ANALYTIC_CLOSED;
const CONJECTURE_REFUTED =
  !EMPIRICALLY_MONOTONE_ON_BASELINE || !EMPIRICALLY_MONOTONE_ON_LADDER;

// ── The record ─────────────────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_MONOTONICITY = {
  id: 'imp-336',
  blocker: 'imp-328 conditional monotonicity hypothesis (M): |t_c(N+1)| ≤ |t_c(N)|',
  consumes: [
    'imp-322 (DYSON_MONOTONICITY_THEOREM) — B(t) monotonicity under backward flow',
    'imp-328 (LAMBDA_INTERCEPT_ANALYTIC) — conditional a ≤ |t_c(N_max)| framework',
    'imp-323 PATH_C_BASELINE_FIT via src/math/dyson-scaling-N5000.js — baseline anchors',
    'imp-321 PT_SCALE_EXTRAPOLATION.ladder — log-spaced rows up to N = 10^8',
  ],
  angleA_empirical: {
    baseline: BASELINE_CHECK,
    ladder: LADDER_CHECK,
    note:
      'Baseline (A1) is a sampled witness at 5 N-values. Ladder (A2) is the ' +
      'imp-321 arithmetic round-trip projected_tc = OLS_A + OLS_B/N and is ' +
      'strictly decreasing by construction — tautological until imp-321 ' +
      'follow-up replaces projected_tc with measured sampled-zero Dyson ' +
      'collision times, at which point this check becomes non-trivial.',
  },
  angleB_analytic: ANALYTIC_SKETCH,
  verdict: {
    empiricallyMonotoneOnBaseline: EMPIRICALLY_MONOTONE_ON_BASELINE,
    empiricallyMonotoneOnLadder: EMPIRICALLY_MONOTONE_ON_LADDER,
    analyticClosed: ANALYTIC_CLOSED,
    conjectureProved: CONJECTURE_PROVED,
    conjectureRefuted: CONJECTURE_REFUTED,
    headline: CONJECTURE_REFUTED
      ? 'HYPOTHESIS (M) REFUTED: a non-monotone pair exists on the current ' +
        'baselines. imp-328 conditional upper bound a ≤ 0.0086 is invalidated. ' +
        'lambda-intercept-analytic.js, lambda-intercept-conditional-ladder.js, ' +
        'bridge-lambda-rh.js, and lambda-zero-attack.js MUST be updated in the ' +
        'same commit to remove the conditional theorem.'
      : CONJECTURE_PROVED
      ? 'HYPOTHESIS (M) PROVED: angle (a) unfalsified at all sampled anchors ' +
        'AND angle (b) closes both gaps (G1)(G2). imp-328 conditional ' +
        'a ≤ 0.0086 upgrades to UNCONDITIONAL. Update ' +
        'lambda-intercept-analytic.js, bridge-lambda-rh.js, and ' +
        'lambda-zero-attack.js in the same commit.'
      : 'HYPOTHESIS (M) EMPIRICALLY UNFALSIFIED at all 5 PATH_C_BASELINE_FIT ' +
        'anchors and at all imp-321 ladder rows. Analytic sketch angle (b) ' +
        'is non-rigorous with open gaps (G1) argmin interiority and (G2) ' +
        'argmin jumps. imp-328 conditional remains CONDITIONAL at ' +
        (CONDITIONAL_UPPER_BOUND.upperBound != null
          ? 'a ≤ ' + CONDITIONAL_UPPER_BOUND.upperBound.toFixed(4)
          : 'its baseline value') +
        ' under (M), and the conjecture itself is UNRESOLVED. Closing (G1) or ' +
        '(G2) is the next action.',
  },
  openWork: [
    'Close (G1): prove k*_N stays interior to the first N zeros with positive ' +
      'margin in N → ∞, e.g. via a Weyl-density argument on the min-gap site.',
    'Close (G2): handle argmin jumps between k*_N and k*_{N+1} with a pair- ' +
      'majorization / Schur-like comparison argument.',
    'imp-321 follow-up: replace PT_SCALE_EXTRAPOLATION.ladder projected_tc ' +
      'rows with measured sampled-zero Dyson collision times, so angle (a) at ' +
      'the ladder becomes a non-tautological witness.',
  ],
  consumesMonotonicityTheoremId: DYSON_MONOTONICITY_THEOREM.id,
  consumesAnalyticId: LAMBDA_INTERCEPT_ANALYTIC.id,
};

// ── Build-time assertions ──────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_MONOTONICITY_ASSERTIONS = [
  {
    id: 'imp336-baseline-monotone-unfalsified',
    holds: () => BASELINE_CHECK.monotoneObserved === true,
    why:
      'PATH_C_BASELINE_FIT must be strictly decreasing in N at the 5 sampled ' +
      'anchors for (M) to be empirically unfalsified on the baseline. If this ' +
      'ever flips, (M) is REFUTED at those anchors and the imp-328 conditional ' +
      'upper bound a ≤ 0.0086 is invalidated — lambda-intercept-analytic.js, ' +
      'lambda-intercept-conditional-ladder.js, bridge-lambda-rh.js, and ' +
      'lambda-zero-attack.js MUST be updated in the same commit.',
  },
  {
    id: 'imp336-ladder-monotone-unfalsified',
    holds: () => LADDER_CHECK.monotoneObserved === true,
    why:
      'The imp-321 ladder is the arithmetic round-trip projected_tc = OLS_A + ' +
      'OLS_B/N, which is strictly decreasing whenever OLS_B > 0. A failure ' +
      'here means either the OLS fit has flipped sign on b, or the ladder has ' +
      'been hand-edited away from the round-trip contract. Either way imp-321 ' +
      'and imp-328 need to be revisited in the same commit.',
  },
  {
    id: 'imp336-conditional-bound-still-attained-at-nmax',
    holds: () =>
      CONDITIONAL_UPPER_BOUND.nMax ===
        BASELINE_CHECK.nMax &&
      Math.abs(
        (CONDITIONAL_UPPER_BOUND.upperBound ?? NaN) -
          (BASELINE_CHECK.consecutiveDrops.length > 0
            ? BASELINE_POINTS[BASELINE_POINTS.length - 1].tc
            : NaN),
      ) < 1e-12,
    why:
      'imp-328 conditional upper bound is defined as |t_c(N_max)| on the ' +
      'baseline. Under (M), this file is the monotonicity witness and must ' +
      'agree with the imp-328 N_max and tc-at-N_max to machine precision. A ' +
      'drift means PATH_C_BASELINE_FIT has been edited without updating ' +
      'lambda-intercept-analytic.js.',
  },
  {
    id: 'imp336-analytic-sketch-still-open',
    holds: () =>
      ANALYTIC_SKETCH.gaps.length === 2 &&
      ANALYTIC_SKETCH.gaps.every((g) => g.status.startsWith('open')),
    why:
      'TRIPWIRE: if a future edit marks (G1) or (G2) as "closed", the ' +
      'imp-328 conditional must upgrade to unconditional in the SAME commit. ' +
      'This assertion fires to force the co-update; otherwise the claim ' +
      '"theorem proved" would appear here while lambda-intercept-analytic.js ' +
      'still advertises "conditional on (M)".',
  },
  {
    id: 'imp336-cites-imp322-and-imp328',
    holds: () =>
      DYSON_MONOTONICITY_THEOREM.id === 'imp-322' &&
      LAMBDA_INTERCEPT_ANALYTIC.id === 'imp-328',
    why:
      'imp-336 cites imp-322 (B(t) monotonicity theorem) and imp-328 ' +
      '(conditional upper bound). If either id drifts, the citation chain ' +
      'breaks silently; this assertion is the tripwire.',
  },
];
