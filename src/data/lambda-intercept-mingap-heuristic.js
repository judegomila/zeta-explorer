/**
 * imp-339: Montgomery-Dyson min-gap heuristic bound on |t_c(N)| vs observed decay
 *
 * imp-328 candidate (iii). Under Montgomery's pair correlation conjecture
 *
 *     R_2(u) = 1 − (sin π u / π u)²,   u = (γ_{k+1} − γ_k) · ρ(γ) / 2π,
 *
 * the minimum spacing among the first N unfolded GUE-like eigenvalues has the
 * heuristic order
 *
 *     B_min(N) = min_k (γ_{k+1} − γ_k) · unfolding  ~  α · (N log N)^{-1}
 *
 * (Vinson / Ben Arous-Bourgade scale for the GUE min-gap, up to constants,
 * modulo unfolding conventions). Integrating the local repulsion ODE
 * dg/dτ = 4/g at the minimum-gap site gives g²(τ) = g²(0) − 8τ, so the
 * isolated-pair backward collision time is
 *
 *     τ_c(N) = B_min(N)² / 8  ~  α² / (8 · (N log N)²).
 *
 * The ticket quoted a stronger 1/(N log N)^4 form in its prose. That comes
 * from chaining TWO repulsion cascades (adjacent gaps collapsing in sequence)
 * rather than a single local pair. To be honest about which prediction this
 * file tests, BOTH exponents are computed and compared against the recorded
 * PATH_C_BASELINE_FIT: the unit-exponent form p = 2 (isolated pair) and the
 * ticket-quoted cascade form p = 4. A single-free-parameter prefactor α² is
 * fit to the baseline by log-space least squares for each p, and the residual
 * log-slope vs the heuristic log-slope is the decisive diagnostic.
 *
 * What the heuristic predicts asymptotically
 * ------------------------------------------
 * For either p ∈ {2, 4}, |t_c(N)| → 0 as N → ∞, so if the heuristic matched
 * the empirical decay of PATH_C_BASELINE_FIT, that would be strong evidence
 * for a := lim sup |t_c(N)| = 0 — closing B2(a) via an entirely analytic
 * route. The ticket rationale is exactly that: "Weakest of the three
 * candidates (heuristic) but cheapest to check against data. A decay match
 * alone is strong evidence."
 *
 * What this file delivers
 * -----------------------
 *   1. Log-space best-fit prefactor log α² for each p ∈ {2, 4} against
 *      PATH_C_BASELINE_FIT.
 *   2. Per-point residuals log(observed / heuristic), and the implied
 *      empirical slope in the log t_c vs log(N log N) frame, computed by
 *      consecutive pairs and by a global OLS slope.
 *   3. A decisiveness test: the heuristic "matches" if the empirical global
 *      OLS slope of log t_c vs log(N log N) is within ±0.5 of the heuristic
 *      target (−p). On PATH_C_BASELINE_FIT the empirical slope is ≈ −0.69,
 *      which is consistent with neither p = 2 (target −2) nor p = 4 (target
 *      −4). The heuristic therefore DOES NOT match the baseline data.
 *   4. Cross-projection at N = 10^8 comparing the heuristic extrapolation
 *      against the imp-323 OLS projection at the same N. The disagreement
 *      is many orders of magnitude, which is the honest statement of the
 *      mismatch.
 *   5. A verdict block that explicitly does NOT claim a = 0 and instead
 *      reports the mismatch as evidence AGAINST candidate (iii) as a
 *      closer-of-B2(a), preserving the imp-328 three-candidate hierarchy:
 *      (ii) Burgers shock remains the strongest analytic candidate, and
 *      (i) density-aware S_k* squeeze remains the cheapest ODE-level route.
 *   6. Build-time assertions that (a) the fit is reproducible, (b) the
 *      empirical-vs-heuristic slope mismatch is ≥ 1 exponent unit (guarding
 *      against a future rewrite that silently upgrades the verdict without
 *      corresponding data changes), and (c) the imp-328 / imp-323 citation
 *      ids still resolve.
 *
 * What this file does NOT claim
 * -----------------------------
 * - No upper bound on a. The heuristic fails the decisiveness test on the
 *   current baseline, so it produces neither a conditional nor an
 *   unconditional bound. Status: "heuristic rejected on baseline".
 * - No refutation of a = 0 in principle. A faster empirical decay at
 *   N > 2458 could still rescue the heuristic; the rejection is relative to
 *   PATH_C_BASELINE_FIT only.
 */

import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';
import { LAMBDA_INTERCEPT_CONFIDENCE } from './lambda-intercept-confidence.js';
import { LAMBDA_INTERCEPT_ANALYTIC } from './lambda-intercept-analytic.js';

// ── Heuristic core ──────────────────────────────────────────────────────────

// Log-space best-fit constant c = log α² minimizing
//   Σ (log tc_obs − (c − p · log(N log N)))²
// i.e. the usual one-parameter log-space OLS with slope fixed to −p and only
// the intercept free. Closed form: c = mean(log tc + p · log(N log N)).
function fitHeuristicPrefactor(points, p) {
  const xs = points.map((pt) => Math.log(pt.N * Math.log(pt.N))); // log(N log N)
  const ys = points.map((pt) => Math.log(pt.tc));                 // log tc
  const n = xs.length;
  const c = ys.reduce((s, y, i) => s + y + p * xs[i], 0) / n;     // intercept
  const predicted = xs.map((x) => c - p * x);
  const residuals = ys.map((y, i) => y - predicted[i]);           // log residuals
  const ssRes = residuals.reduce((s, r) => s + r * r, 0);
  const yMean = ys.reduce((s, y) => s + y, 0) / n;
  const ssTot = ys.reduce((s, y) => s + (y - yMean) ** 2, 0);
  return {
    p,
    logPrefactor: c,
    alphaSquared: Math.exp(c),
    predictedLogTc: predicted,
    logResiduals: residuals,
    ssRes,
    pseudoR2: ssTot > 0 ? 1 - ssRes / ssTot : null,
  };
}

// Free-slope OLS of log tc vs log(N log N) — this is the decisive test:
// the heuristic target slope is −p; the empirical free slope tells us
// what the baseline ACTUALLY prefers.
function freeSlopeFit(points) {
  const xs = points.map((pt) => Math.log(pt.N * Math.log(pt.N)));
  const ys = points.map((pt) => Math.log(pt.tc));
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxy = xs.reduce((s, x, i) => s + x * ys[i], 0);
  const sx2 = xs.reduce((s, x) => s + x * x, 0);
  const denom = n * sx2 - sx * sx;
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  const yMean = sy / n;
  const predicted = xs.map((x) => intercept + slope * x);
  const ssRes = ys.reduce((s, y, i) => s + (y - predicted[i]) ** 2, 0);
  const ssTot = ys.reduce((s, y) => s + (y - yMean) ** 2, 0);
  return {
    slope,
    intercept,
    R2: ssTot > 0 ? 1 - ssRes / ssTot : null,
    logN_logN: xs,
    logTc: ys,
  };
}

// Consecutive-pair local slopes in log tc vs log(N log N) — useful because
// a single global slope can hide a regime change. The min-gap heuristic
// demands ALL local slopes cluster near −p.
function consecutivePairSlopes(points) {
  const sorted = [...points].sort((a, b) => a.N - b.N);
  const pairs = [];
  for (let i = 1; i < sorted.length; i++) {
    const x0 = Math.log(sorted[i - 1].N * Math.log(sorted[i - 1].N));
    const x1 = Math.log(sorted[i].N * Math.log(sorted[i].N));
    const y0 = Math.log(sorted[i - 1].tc);
    const y1 = Math.log(sorted[i].tc);
    pairs.push({
      fromN: sorted[i - 1].N,
      toN: sorted[i].N,
      localSlope: (y1 - y0) / (x1 - x0),
    });
  }
  return pairs;
}

// ── Apply to PATH_C_BASELINE_FIT ────────────────────────────────────────────

const HEURISTIC_P2 = fitHeuristicPrefactor(PATH_C_BASELINE_FIT, 2);
const HEURISTIC_P4 = fitHeuristicPrefactor(PATH_C_BASELINE_FIT, 4);
const FREE_SLOPE = freeSlopeFit(PATH_C_BASELINE_FIT);
const LOCAL_SLOPES = consecutivePairSlopes(PATH_C_BASELINE_FIT);

// ── Decisiveness: does empirical slope land in [−p ± 0.5] for either p? ─────

const SLOPE_TOLERANCE = 0.5;
const MATCH_P2 = Math.abs(FREE_SLOPE.slope - -2) <= SLOPE_TOLERANCE;
const MATCH_P4 = Math.abs(FREE_SLOPE.slope - -4) <= SLOPE_TOLERANCE;
const HEURISTIC_MATCHES = MATCH_P2 || MATCH_P4;

// ── Cross-projection at N = 1e8 against imp-323 OLS ─────────────────────────

const N_PROJECTION = 1e8;
const logNLogN_projection = Math.log(N_PROJECTION * Math.log(N_PROJECTION));
const tcP2AtProjection = Math.exp(HEURISTIC_P2.logPrefactor - 2 * logNLogN_projection);
const tcP4AtProjection = Math.exp(HEURISTIC_P4.logPrefactor - 4 * logNLogN_projection);
const tcOLSAtProjection =
  LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a +
  LAMBDA_INTERCEPT_CONFIDENCE.fit.slope_b / N_PROJECTION;

function log10Ratio(a, b) {
  if (!(a > 0) || !(b > 0)) return null;
  return Math.log10(a / b);
}

// ── The record ──────────────────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_MINGAP_HEURISTIC = {
  id: 'imp-339',
  blocker: 'B2(a)-statistical-intercept (imp-328 candidate (iii), min-gap heuristic)',
  status: 'heuristic rejected on PATH_C_BASELINE_FIT — empirical slope incompatible',
  consumes: [
    'PATH_C_BASELINE_FIT (src/math/dyson-scaling-N5000.js) — 5-point (N, |t_c|)',
    'imp-323 LAMBDA_INTERCEPT_CONFIDENCE.fit — OLS (a, b) for cross-projection',
    'imp-328 LAMBDA_INTERCEPT_ANALYTIC candidate (iii) prose — ticket framing',
  ],
  heuristic: {
    model:
      'τ_c(N) = α² / (8 · (N log N)^p), derived from B_min(N) ~ α / (N log N) ' +
      '(Montgomery / Ben Arous-Bourgade GUE scale) and the local repulsion ' +
      'ODE dg/dτ = 4/g with p = 2 for an isolated pair and p = 4 for the ' +
      'ticket-quoted cascade variant.',
    fits: [
      {
        p: 2,
        logPrefactor: HEURISTIC_P2.logPrefactor,
        alphaSquared: HEURISTIC_P2.alphaSquared,
        pseudoR2_logSpace: HEURISTIC_P2.pseudoR2,
        logResiduals: HEURISTIC_P2.logResiduals,
      },
      {
        p: 4,
        logPrefactor: HEURISTIC_P4.logPrefactor,
        alphaSquared: HEURISTIC_P4.alphaSquared,
        pseudoR2_logSpace: HEURISTIC_P4.pseudoR2,
        logResiduals: HEURISTIC_P4.logResiduals,
      },
    ],
  },
  empirical: {
    freeSlopeOfLogTcVsLogNLogN: FREE_SLOPE.slope,
    freeSlopeR2: FREE_SLOPE.R2,
    consecutivePairLocalSlopes: LOCAL_SLOPES,
    interpretation:
      'The heuristic demands slope = −p in the log tc vs log(N log N) frame. ' +
      'The free-slope OLS on PATH_C_BASELINE_FIT gives ≈ −0.69 with shrinking ' +
      'local slopes at larger N (−0.80 → −0.83 → −0.69 → −0.34 across the ' +
      'four consecutive-N pairs), which is the flattening signature of a ' +
      't_c = a + b/N shape with finite a > 0, not the power-law plunge the ' +
      'heuristic predicts.',
  },
  decisivenessTest: {
    slopeTolerance: SLOPE_TOLERANCE,
    targets: { p2: -2, p4: -4 },
    empiricalSlope: FREE_SLOPE.slope,
    matchP2: MATCH_P2,
    matchP4: MATCH_P4,
    heuristicMatches: HEURISTIC_MATCHES,
    verdict:
      HEURISTIC_MATCHES
        ? 'HEURISTIC MATCHES: empirical slope lies within ±' +
          SLOPE_TOLERANCE +
          ' of the heuristic target for some p. Promote candidate (iii) to ' +
          'primary analytic route and update lambda-intercept-analytic.js ' +
          'candidate block, bridge-lambda-rh.js remainingSteps, and the ' +
          'openWork list in lambda-zero-attack.js in the same commit.'
        : 'HEURISTIC REJECTED: empirical slope ' +
          FREE_SLOPE.slope.toFixed(3) +
          ' is outside [−2 ± ' +
          SLOPE_TOLERANCE +
          '] and [−4 ± ' +
          SLOPE_TOLERANCE +
          '] on PATH_C_BASELINE_FIT. Candidate (iii) does NOT close B2(a) ' +
          'at the current baseline. imp-328 hierarchy stands: candidate (ii) ' +
          'Burgers shock remains the strongest analytic route, (i) density-' +
          'aware S_k* squeeze remains the cheapest ODE-level route.',
  },
  crossProjectionAt1e8: {
    N: N_PROJECTION,
    heuristic_p2: tcP2AtProjection,
    heuristic_p4: tcP4AtProjection,
    ols_imp323: tcOLSAtProjection,
    log10Ratio_ols_over_p2: log10Ratio(tcOLSAtProjection, tcP2AtProjection),
    log10Ratio_ols_over_p4: log10Ratio(tcOLSAtProjection, tcP4AtProjection),
    interpretation:
      'At N = 10^8 the heuristic and the imp-323 OLS projection disagree by ' +
      'many orders of magnitude. That disagreement IS the rejection, read at ' +
      'the PT-scale target rather than at the baseline N_max. It does not ' +
      'prove the OLS projection is correct — only that the heuristic and the ' +
      'OLS fit cannot both be right, and the baseline data prefer the OLS ' +
      'shape by a wide margin.',
  },
  openWork: [
    'imp-321 follow-up: measured sampled-zero Dyson collision times at N ≥ 10^5 ' +
      'would let this file re-run with a longer empirical lever arm. A late ' +
      'steepening of the log-log slope toward −2 or −4 would rescue the heuristic.',
    'Rigorous derivation of the min-gap scaling prefactor α from GUE (Ben Arous-' +
      'Bourgade 2013 gives the exact constant for circular GUE) would collapse ' +
      'the single-parameter fit and let the heuristic be tested without a free α.',
  ],
  consumesAnalyticId: LAMBDA_INTERCEPT_ANALYTIC.id,
  consumesConfidenceFit: {
    intercept_a: LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a,
    slope_b: LAMBDA_INTERCEPT_CONFIDENCE.fit.slope_b,
  },
};

// ── Build-time assertions ───────────────────────────────────────────────────

export const LAMBDA_INTERCEPT_MINGAP_HEURISTIC_ASSERTIONS = [
  {
    id: 'imp339-fit-reproducible',
    holds: () =>
      Number.isFinite(HEURISTIC_P2.logPrefactor) &&
      Number.isFinite(HEURISTIC_P4.logPrefactor) &&
      HEURISTIC_P2.alphaSquared > 0 &&
      HEURISTIC_P4.alphaSquared > 0,
    why:
      'Both one-parameter heuristic fits must produce finite positive α². A ' +
      'NaN or non-positive fit means the baseline was corrupted or a log was ' +
      'taken of a non-positive tc.',
  },
  {
    id: 'imp339-empirical-slope-rejects-heuristic',
    holds: () =>
      FREE_SLOPE.slope > -1.5 &&
      LAMBDA_INTERCEPT_MINGAP_HEURISTIC.decisivenessTest.heuristicMatches === false,
    why:
      'TRIPWIRE: the free-slope OLS on PATH_C_BASELINE_FIT gives ≈ −0.69, ' +
      'which is strictly inside (−1.5, 0) and therefore ≥ 0.5 away from both ' +
      '−2 and −4. If this ever flips, the baseline data have changed enough ' +
      'to rescue the min-gap heuristic, in which case lambda-intercept-' +
      'analytic.js candidate block, bridge-lambda-rh.js remainingSteps, and ' +
      'the openWork list in lambda-zero-attack.js MUST be updated in the ' +
      'same commit to promote candidate (iii).',
  },
  {
    id: 'imp339-cross-projection-order-of-magnitude-mismatch',
    holds: () => {
      const r2 = LAMBDA_INTERCEPT_MINGAP_HEURISTIC.crossProjectionAt1e8.log10Ratio_ols_over_p2;
      const r4 = LAMBDA_INTERCEPT_MINGAP_HEURISTIC.crossProjectionAt1e8.log10Ratio_ols_over_p4;
      return r2 !== null && r4 !== null && Math.abs(r2) > 1 && Math.abs(r4) > 1;
    },
    why:
      'At N = 10^8 the heuristic extrapolation and the imp-323 OLS projection ' +
      'must disagree by at least one order of magnitude for each p. This is ' +
      'the second, independent tripwire: a silent collapse of the mismatch ' +
      'would mean either the OLS fit has drifted or the heuristic prefactor ' +
      'has absorbed the disagreement, both of which demand investigation.',
  },
  {
    id: 'imp339-consumes-imp328-and-imp323',
    holds: () =>
      LAMBDA_INTERCEPT_ANALYTIC.id === 'imp-328' &&
      typeof LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a === 'number' &&
      typeof LAMBDA_INTERCEPT_CONFIDENCE.fit.slope_b === 'number',
    why:
      'imp-339 cites imp-328 by id and consumes the imp-323 OLS fit constants. ' +
      'If either drifts out from under this file the citation chain breaks; ' +
      'this assertion is the tripwire.',
  },
];
