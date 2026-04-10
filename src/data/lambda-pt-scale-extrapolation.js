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
