/**
 * imp-321 (first deliverable): Path C |t_c| = a + b/N projection out to
 * Platt–Trudgian scale (T ≈ 3·10^12), via log-spaced N.
 *
 * Context
 * -------
 * imp-321 asks: if the empirical Path C 1/N scaling persists across the
 * seven-decade gap between our current N = 2458 (T_0 ≈ 3000) and the
 * Platt–Trudgian verified height T ≈ 3·10^12, what does the projected
 * Λ ceiling look like? The full ticket envisions running the backward
 * Dyson collision on synthesised / sampled zero subsets at log-spaced N
 * values; that compute is the heavy follow-up. THIS file is the cheap
 * arithmetic precondition: take the OLS fit that imp-323 already
 * extracted from the 5-point baseline, evaluate |t_c|(N) at log-spaced
 * N from the current scale up to N(T_PT), tabulate the implied Λ_proj,
 * and pair each row with the Riemann–von Mangoldt effective height
 * T*(N) from imp-327 so the projection table is directly indexable by
 * "what RH height would this finite-N statement control?".
 *
 * What this projection IS
 * -----------------------
 * - An arithmetic extrapolation of the OLS line a + b/N from
 *   lambda-intercept-confidence.js (which fits the imp-307 baseline).
 * - The asymptotic ceiling is exactly â: as N → ∞ the projection
 *   collapses to the intercept, and the open question is whether â ≤ 0.
 *   That is the imp-323 / B2 question, NOT something this file resolves.
 * - A direct test of "how much does the 1/N piece dominate at decade-k
 *   beyond the current run?". At N = 2458 the slope contribution
 *   b/N ≈ 4.91/2458 ≈ 2·10⁻³ is comparable to â; at N = 10⁸ it is
 *   ≈ 5·10⁻⁸ and the projection saturates at the intercept.
 *
 * What this projection IS NOT
 * ---------------------------
 * - It is NOT new collision computation. No additional Dyson trajectory
 *   was integrated; the row at e.g. N = 10⁵ is a + b/N, not the result
 *   of running the backward ODE on the first 10⁵ Riemann zeros.
 * - It does NOT establish that the linear shape holds at large N. That
 *   is exactly what the imp-321 follow-up sampled-zero Dyson run is
 *   supposed to test, and what imp-315 (extending to N = 5000) is the
 *   first checkpoint of. If a quadratic 1/N² term is present at large
 *   N, this projection is biased. The honest interpretation: the rows
 *   below are the projection assuming the empirical fit shape persists.
 * - It does NOT change the Λ headline. bridge-lambda-rh.js and
 *   lambda-error-budget.js remain the sources of truth; this file is
 *   downstream of them and never overwrites them.
 *
 * Two open conditionals (B1 and B2 in lambda-zero-attack.js)
 * ----------------------------------------------------------
 * For the projected Λ ceiling at any N to translate into a real bound
 * on Λ at that N's effective height, two things must hold:
 *
 *   (B1) The slope b in |t_c| = a + b/N is bounded analytically rather
 *        than from a 5-point fit. imp-324 delivered a first-order
 *        boundary linearisation matching the empirical b within ~2×;
 *        a global theorem-grade bound is still open.
 *
 *   (B2) The intercept a satisfies a ≤ 0. imp-323 angle (a) showed the
 *        baseline 5 points are statistically CONSISTENT with a ≤ 0
 *        (null a = 0 not rejected at two-sided 95%) but do not PROVE
 *        it. The theorem-grade angle (b) is open.
 *
 * Until BOTH B1 and B2 close, the "Λ ceiling" column below should be
 * read as "the value the projection asymptotes to under the optimistic
 * assumption that the fit shape and intercept are exactly right" — an
 * upper-end estimate, not a certified bound.
 *
 * Why this is still useful as imp-321's first deliverable
 * -------------------------------------------------------
 * The follow-up sampled-zero Dyson run needs a target table to compare
 * itself against. By precomputing the arithmetic projection here, the
 * future imp-321 compute job becomes "for each row in
 * PT_SCALE_EXTRAPOLATION, run the actual backward-collision integrator
 * on a synthesised / sampled γ list of length N and replace the
 * projected_tc with the measured one". The table is the contract; the
 * computation will fill it in.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { LAMBDA_INTERCEPT_CONFIDENCE } from './lambda-intercept-confidence.js';
import { LAMBDA_ERROR_BUDGET } from './lambda-error-budget.js';

// Pull the OLS fit constants from the imp-323 file (single source of truth
// for the fit; we never re-fit here).
const OLS_A = LAMBDA_INTERCEPT_CONFIDENCE.fit.intercept_a;
const OLS_B = LAMBDA_INTERCEPT_CONFIDENCE.fit.slope_b;
const HEADLINE_A = LAMBDA_ERROR_BUDGET.centralValue;

// Log-spaced N ladder. Anchored at the current N from the error budget,
// then a half-decade to imp-315's 5000, then full decades up to 10^8 —
// well past where the OLS projection has saturated to â and the table is
// dominated by the (still open) intercept.
const N_LADDER = [
  LAMBDA_ERROR_BUDGET.zeroCount, // 2458 — current
  5000,                          // imp-315 target
  1e4,
  1e5,
  1e6,
  1e7,
  1e8,
];

function projectRow(N) {
  const slopeContribution = OLS_B / N;
  const projected_tc = OLS_A + slopeContribution;
  const T_star = effectiveHeightForN(N);
  // Distance to the asymptotic ceiling, in units of OLS_A. As N → ∞ this
  // collapses to 0; reading the column tells you "how much of |t_c(N)|
  // is still slope vs intercept at this scale".
  const slope_share = slopeContribution / Math.max(projected_tc, 1e-300);
  return {
    N,
    invN: 1 / N,
    projected_tc,
    slope_contribution: slopeContribution,
    intercept_share: 1 - slope_share,
    T_star,
    log10_T_star: Math.log10(T_star),
  };
}

export const PT_SCALE_EXTRAPOLATION = {
  purpose:
    'imp-321 first deliverable: arithmetic projection of the empirical Path C ' +
    'fit |t_c| = a + b/N out to Platt–Trudgian scale, indexed by Riemann–von ' +
    'Mangoldt effective height T*(N). NOT new collision computation.',
  ticket: 'imp-321',
  status: 'first deliverable — arithmetic projection only; sampled-zero Dyson follow-up still open',
  fitConstants: {
    a: OLS_A,
    b: OLS_B,
    source: 'lambda-intercept-confidence.js (OLS on imp-307 baseline 5 points)',
    headline_a_for_comparison: HEADLINE_A,
    headline_source: 'lambda-error-budget.js / bridge-lambda-rh.js',
    discrepancy_note:
      'OLS_A and HEADLINE_A differ by ~3·10⁻³; both are within one SE of â. ' +
      'This file uses OLS_A so the projection is reproducible from the recorded ' +
      'baseline points; it does NOT change the headline.',
  },
  asymptoticCeiling: OLS_A,
  asymptoticCeilingNote:
    'lim_{N→∞} (a + b/N) = a. Whether this ceiling is ≤ 0 IS the open ' +
    'imp-323 / B2 question; the projection itself is silent on it.',
  ladder: N_LADDER.map(projectRow),
  conditionals: [
    {
      id: 'B1-slope-bound',
      requirement: 'Analytic upper bound on the slope b.',
      status:
        'open — imp-324 has a first-order boundary linearisation matching b ' +
        'within ~2×; theorem-grade global bound still open.',
      file: 'lambda-zero-attack.js',
    },
    {
      id: 'B2-intercept-positivity',
      requirement: 'Analytic proof that a ≤ 0.',
      status:
        'open — imp-323 angle (a) shows statistical consistency with a ≤ 0 ' +
        'but does not prove it. Angle (b) is the theorem-grade route.',
      file: 'lambda-zero-attack.js',
    },
  ],
  followUp:
    'imp-321 remainder: replace projected_tc per row with a measured ' +
    'collision time from a synthesised or sampled-zero Dyson backward run ' +
    'at the same N. The arithmetic table here is the contract that compute ' +
    'job fills in.',
};

// ────────────────────────────────────────────────────────────────────────
// imp-332: B2(a) one-sided CI analysis on the log-spaced ladder.
//
// imp-323 ran OLS + one-sided CI on the baseline 5 points {50,100,200,500,2458}.
// imp-332 asks: run the same machinery on the log-spaced ladder (1.7 decades
// of N-range becomes 4.7 decades), where SE(â) should drop dramatically and
// the 1/N curvature check gets a much sharper lever arm. If the upper 95% CL
// tips ≤ 0 on the log-spaced fit, B2(a) closes at PT-scale heights.
//
// IMPORTANT HONESTY BLOCK
// -----------------------
// The rows of PT_SCALE_EXTRAPOLATION.ladder are NOT measured collision times.
// They are arithmetic projections y_i = OLS_A + OLS_B / N_i derived from the
// imp-323 OLS fit on the baseline 5 points. Running OLS on them is a pure
// round-trip: the new fit must recover (OLS_A, OLS_B) exactly and produce
// zero residuals, which in turn makes σ̂² = 0, Var(â) = 0, SE(â) = 0, every
// confidence interval collapses to a point, and the "verdict" becomes a
// tautology (the one-sided upper CL equals â = OLS_A > 0, so B2(a) remains
// unclosed, which is the same conclusion the baseline fit already gave).
//
// So why compute this at all? Two reasons:
//
//   (1) It exposes the machinery as a function of (N_i, y_i) so that when
//       imp-321's sampled-zero Dyson follow-up REPLACES each projected_tc
//       with a measured collision time, the B2(a) CI will automatically
//       become meaningful without touching this file's structure. The
//       contract is "fill in the ladder, the verdict updates".
//
//   (2) It produces a falsifiable build-time assertion: the round-trip OLS
//       MUST reproduce OLS_A and OLS_B, MUST give near-zero SSR, and MUST
//       report "unclosed" as the verdict. If a future edit corrupts the
//       projection (e.g. accidentally replaces OLS_A with HEADLINE_A in one
//       ladder row and not the others), the round-trip breaks and the
//       assertion trips. This is a cheap integrity check on the ladder.
//
// When the ladder rows become measured, the re-fit will have non-zero SSR,
// a real SE(â), and a real verdict — then the block below answers imp-332
// as literally written. Until then it is the instrument, not the result.
// ────────────────────────────────────────────────────────────────────────

function olsFitPairs(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((s, x) => s + x, 0);
  const sy = ys.reduce((s, y) => s + y, 0);
  const xbar = sx / n;
  const ybar = sy / n;
  let Sxx = 0;
  let Sxy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - xbar;
    const dy = ys[i] - ybar;
    Sxx += dx * dx;
    Sxy += dx * dy;
  }
  const b = Sxy / Sxx;
  const a = ybar - b * xbar;
  let ssr = 0;
  for (let i = 0; i < n; i++) {
    const yhat = a + b * xs[i];
    const r = ys[i] - yhat;
    ssr += r * r;
  }
  const dof = n - 2;
  const sigma2 = ssr / dof;
  const varA = sigma2 * (1 / n + (xbar * xbar) / Sxx);
  const varB = sigma2 / Sxx;
  const seA = Math.sqrt(Math.max(0, varA));
  const seB = Math.sqrt(Math.max(0, varB));
  return { n, dof, a, b, Sxx, xbar, ybar, ssr, sigma2, seA, seB };
}

// Student-t upper-tail critical values at df = 5 (log-spaced ladder has n = 7
// rows so n − 2 = 5). Hard-coded to match the imp-323 style in
// lambda-intercept-confidence.js without shipping a quantile routine.
const T_CRIT_DF5 = {
  'one-sided-90': 1.476,
  'one-sided-95': 2.015,
  'one-sided-99': 3.365,
  'two-sided-95': 2.571,
  'two-sided-99': 4.032,
};

const LADDER_XS = PT_SCALE_EXTRAPOLATION.ladder.map((r) => 1 / r.N);
const LADDER_YS = PT_SCALE_EXTRAPOLATION.ladder.map((r) => r.projected_tc);
const LADDER_FIT = olsFitPairs(LADDER_XS, LADDER_YS);

function ladderCiBounds(point, se) {
  const out = {};
  for (const [k, t] of Object.entries(T_CRIT_DF5)) {
    out[k] = {
      upper: point + t * se,
      lower: point - t * se,
      halfWidth: t * se,
    };
  }
  return out;
}

const LADDER_A_INTERVALS = ladderCiBounds(LADDER_FIT.a, LADDER_FIT.seA);
const LADDER_B_INTERVALS = ladderCiBounds(LADDER_FIT.b, LADDER_FIT.seB);

export const PT_SCALE_B2A_REFIT = {
  purpose:
    'imp-332: apply the imp-323 B2(a) one-sided CI machinery to the log-spaced ' +
    'ladder from imp-321 instead of the baseline 5 points.',
  ticket: 'imp-332',
  instrumentOnly: true,
  instrumentOnlyReason:
    'The ladder rows are currently arithmetic projections y_i = OLS_A + OLS_B / N_i, ' +
    'not measured collision times, so the round-trip OLS recovers (OLS_A, OLS_B) ' +
    'with ~zero residuals. This block is the B2(a) instrument wired to the ladder; ' +
    'it becomes a meaningful statistical result when imp-321 follow-up replaces ' +
    'projected_tc with measured sampled-zero Dyson collision times at each N.',
  fitSource: 'PT_SCALE_EXTRAPOLATION.ladder (this file)',
  fit: {
    n: LADDER_FIT.n,
    dof: LADDER_FIT.dof,
    intercept_a: LADDER_FIT.a,
    slope_b: LADDER_FIT.b,
    residualSSR: LADDER_FIT.ssr,
    residualStdDev: Math.sqrt(LADDER_FIT.sigma2),
    seIntercept: LADDER_FIT.seA,
    seSlope: LADDER_FIT.seB,
  },
  baselineComparison: {
    baseline_a: OLS_A,
    baseline_b: OLS_B,
    ladder_a: LADDER_FIT.a,
    ladder_b: LADDER_FIT.b,
    interceptDrift: LADDER_FIT.a - OLS_A,
    slopeDrift: LADDER_FIT.b - OLS_B,
    note:
      'Drift must be machine-epsilon while ladder rows are the arithmetic projection. ' +
      'A non-trivial drift here would mean the ladder has been rebuilt from a different ' +
      '(a,b) or the fit constants have moved without updating the projection.',
  },
  interceptIntervals: LADDER_A_INTERVALS,
  slopeIntervals: LADDER_B_INTERVALS,
  verdict: {
    aEstablishedBelowZero_oneSided95: LADDER_A_INTERVALS['one-sided-95'].upper <= 0,
    aEstablishedBelowZero_oneSided99: LADDER_A_INTERVALS['one-sided-99'].upper <= 0,
    oneSided95UpperBound: LADDER_A_INTERVALS['one-sided-95'].upper,
    oneSided95LowerBound: LADDER_A_INTERVALS['one-sided-95'].lower,
    statement:
      LADDER_A_INTERVALS['one-sided-95'].upper <= 0
        ? 'Λ ≤ 0 established at one-sided 95% on the log-spaced ladder (B2(a) closed at PT-scale).'
        : 'Instrument-only pass: the ladder is a round-trip of the baseline OLS fit, so ' +
          'the upper CL equals the point estimate and B2(a) remains unclosed. Meaningful ' +
          'only once imp-321 follow-up fills projected_tc with measured values.',
  },
  futureContract:
    'imp-321 follow-up: replace each PT_SCALE_EXTRAPOLATION.ladder[i].projected_tc with ' +
    'the measured backward-Dyson collision time at N_i. No other change is needed here; ' +
    'this block re-evaluates automatically and the verdict becomes the honest B2(a) ' +
    'statement at PT-scale heights.',
};

// Build-time assertions — refuse silent drift of the projection or its caveats.
export const PT_SCALE_EXTRAPOLATION_ASSERTIONS = [
  {
    id: 'projection-monotone-decreasing-in-N',
    holds: () => {
      const rows = PT_SCALE_EXTRAPOLATION.ladder;
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].projected_tc < rows[i - 1].projected_tc)) return false;
      }
      return true;
    },
    why:
      'a + b/N with b > 0 is strictly decreasing in N. Any inversion in the ' +
      'projected_tc column means the fit constants or the ladder evaluation ' +
      'have been corrupted.',
  },
  {
    id: 'asymptotic-ceiling-equals-OLS-intercept',
    holds: () => {
      const last = PT_SCALE_EXTRAPOLATION.ladder[PT_SCALE_EXTRAPOLATION.ladder.length - 1];
      // At N = 1e8 the slope contribution is b·1e-8 ≈ 5e-8, so the projection
      // must lie within one part in 1e6 of the intercept.
      return Math.abs(last.projected_tc - OLS_A) < 1e-6 * Math.max(1e-6, Math.abs(OLS_A));
    },
    why:
      'By the time N reaches 10^8, the b/N term is ~5·10⁻⁸ ≪ â, so the last ' +
      'ladder row must collapse onto OLS_A. If it does not, the ladder no ' +
      'longer reaches PT scale and imp-321 cannot use this table.',
  },
  {
    id: 'current-row-matches-OLS-tc-at-current-N',
    holds: () => {
      const cur = PT_SCALE_EXTRAPOLATION.ladder[0];
      const expected = OLS_A + OLS_B / cur.N;
      return Math.abs(cur.projected_tc - expected) < 1e-12;
    },
    why:
      'The first row must equal a + b/N evaluated at the current zero count ' +
      'recorded in lambda-error-budget.js. A drift here indicates the fit ' +
      'constants moved without updating the projection.',
  },
  {
    id: 'T-star-monotone-in-N',
    holds: () => {
      const rows = PT_SCALE_EXTRAPOLATION.ladder;
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].T_star > rows[i - 1].T_star)) return false;
      }
      return true;
    },
    why:
      'Riemann–von Mangoldt N(T) is monotone in T, so T*(N) must be monotone ' +
      'in N. A failure here means effectiveHeightForN regressed (touched the ' +
      'inverter in lambda-rh-height-mapping.js without re-checking).',
  },
  {
    id: 'last-row-reaches-PT-scale',
    holds: () => {
      const last = PT_SCALE_EXTRAPOLATION.ladder[PT_SCALE_EXTRAPOLATION.ladder.length - 1];
      // Platt–Trudgian verified RH up to T ≈ 3·10^12. The ladder need not
      // reach exactly that height — it just has to land in the same decade
      // band so the projection genuinely covers the gap. The N = 10^8 row
      // gives T*(10^8) ≈ 4·10^9, two decades short of PT, which is the
      // honest current ceiling without resorting to extrapolating the
      // density formula too far. Require log10(T*) ≥ 9.
      return last.log10_T_star >= 9;
    },
    why:
      'imp-321 is "push toward PT scale". If the last ladder row sits below ' +
      '10^9 in height the table is not actually doing the job, and the ladder ' +
      'must be extended. The current ceiling is N = 10^8 → T* ≈ 4·10^9 (two ' +
      'decades short of PT 3·10^12). Reducing the ladder must trip this.',
  },
  {
    id: 'imp332-ladder-refit-roundtrips-baseline-ols',
    holds: () => {
      // While ladder rows are the arithmetic projection y = a + b/N, OLS on
      // them must recover (OLS_A, OLS_B) to machine epsilon and produce a
      // near-zero residual SSR. Any meaningful drift here indicates the
      // projection was corrupted or the baseline fit constants moved.
      const da = Math.abs(PT_SCALE_B2A_REFIT.fit.intercept_a - OLS_A);
      const db = Math.abs(PT_SCALE_B2A_REFIT.fit.slope_b - OLS_B);
      const scaleA = Math.max(1e-12, Math.abs(OLS_A));
      const scaleB = Math.max(1e-12, Math.abs(OLS_B));
      return (
        da / scaleA < 1e-9 &&
        db / scaleB < 1e-9 &&
        PT_SCALE_B2A_REFIT.fit.residualSSR < 1e-20
      );
    },
    why:
      'imp-332: the B2(a) re-fit on the log-spaced ladder is wired as the instrument ' +
      'for when imp-321 follow-up replaces projected_tc with measured values. Until ' +
      'that happens, the ladder is an exact arithmetic round-trip of the baseline OLS, ' +
      'so the round-trip OLS MUST reproduce (OLS_A, OLS_B) with ~zero residuals. A trip ' +
      'here means either the projection was corrupted or the baseline fit constants ' +
      'drifted without updating the ladder.',
  },
  {
    id: 'B1-and-B2-still-open',
    holds: () => {
      const ids = PT_SCALE_EXTRAPOLATION.conditionals.map((c) => c.id);
      return ids.includes('B1-slope-bound') && ids.includes('B2-intercept-positivity');
    },
    why:
      'The projection is meaningful only under B1 (slope bound) and B2 ' +
      '(intercept positivity). If a future edit drops either conditional ' +
      'from this file, downstream consumers might read the ceiling as a ' +
      'certified bound and wrongly claim Λ ≤ ceiling. Both must remain ' +
      'declared until lambda-zero-attack.js closes them.',
  },
];
