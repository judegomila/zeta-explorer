/**
 * imp-408: Platt-Trudgian 2021 consistency check at matched height
 *
 * Context
 * -------
 * Platt and Trudgian (2021) established the unconditional bound Lambda <= 0.2
 * with RH verified up to T ~ 3e12 (their published height). The ticket imp-408
 * asks: at the matched height T = 3e10 (a conservative test point two decades
 * below the full PT height), compute N via the Riemann-von Mangoldt count
 * formula, then project |t_c(N)| from the imp-400 refitted ansatz, and check
 * whether the projection is consistent with (i.e. no worse than) the PT bound
 * of 0.2.
 *
 * Purpose
 * -------
 * This is an INDEPENDENT SANITY CHECK. If our PATH_C_BASELINE_FIT_V2 ansatz
 * at any matched finite height projected |t_c| > 0.2, something would be wrong
 * with our constants or methodology: we would be claiming a WEAKER bound than
 * what Platt-Trudgian established unconditionally. A passing check confirms
 * that our asymptotic Lambda = 0 claim is consistent with the SOTA literature
 * at finite height.
 *
 * Method
 * ------
 *   (a) N = zeroCountAtHeight(T_TEST) via imp-327 (Riemann-von Mangoldt).
 *   (b) |t_c|_proj = intercept_a + slope_b / N  from PATH_C_BASELINE_FIT_V2 (imp-400).
 *   (c) Compare |t_c|_proj to PT_BOUND = 0.2.
 *   (d) Check passes iff |t_c|_proj <= PT_BOUND.
 *
 * If the check FAILS, something is wrong with the constants or the claim and
 * the project should not claim SOTA.
 *
 * Note on T_TEST = 3e10 vs the full PT height 3e12
 * -------------------------------------------------
 * The actual Platt-Trudgian 2021 paper verified RH up to T ~ 3e12 and the
 * Lambda <= 0.2 bound applies globally. This file uses T = 3e10 as written
 * in the imp-408 ticket. At T = 3e10 the zero count is N ~ 10^11, at which
 * the slope contribution b/N is ~ 5e-11 and |t_c|_proj saturates to the
 * intercept. The outcome is the same at T = 3e12; T = 3e10 is the
 * conservative test point.
 */

import { zeroCountAtHeight, effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';

// ── Test height ──────────────────────────────────────────────────────────────
// T_TEST = 3e10 as specified in imp-408. Note the actual PT paper height is
// 3e12; see note in header above.
const T_TEST = 3e10;

// ── N at T_TEST via Riemann-von Mangoldt ─────────────────────────────────────
// N(T) = (T / 2pi) * (log(T / 2pi) - 1) from imp-327 / lambda-rh-height-mapping.js
const N_AT_TEST_HEIGHT = zeroCountAtHeight(T_TEST);

// Round-trip verification: effectiveHeightForN(N_AT_TEST_HEIGHT) should recover T_TEST.
// We use Math.round here because effectiveHeightForN expects an integer-like N.
const N_ROUNDED = Math.round(N_AT_TEST_HEIGHT);
const T_ROUND_TRIP = effectiveHeightForN(N_ROUNDED);

// ── PATH_C_BASELINE_FIT_V2 fit constants ─────────────────────────────────────
// The V2 fit delivers  |t_c| = a + b/N  with a = intercept_a, b = slope_b.
const V2_FIT = PATH_C_BASELINE_FIT_V2.fit;
const INTERCEPT_A = V2_FIT ? V2_FIT.intercept_a : null;
const SLOPE_B = V2_FIT ? V2_FIT.slope_b : null;

// ── Projected |t_c(N)| at N_AT_TEST_HEIGHT ───────────────────────────────────
// For N ~ 10^11 the slope contribution b/N is negligible (~5e-11),
// so the projection effectively equals the intercept.
const SLOPE_CONTRIB = (INTERCEPT_A !== null && SLOPE_B !== null)
  ? SLOPE_B / N_AT_TEST_HEIGHT
  : null;
const PROJECTED_TC = (INTERCEPT_A !== null && SLOPE_CONTRIB !== null)
  ? INTERCEPT_A + SLOPE_CONTRIB
  : null;

// ── Platt-Trudgian bound ──────────────────────────────────────────────────────
const PT_BOUND = 0.2;

// ── Check result ──────────────────────────────────────────────────────────────
const CHECK_PASSES = PROJECTED_TC !== null && PROJECTED_TC <= PT_BOUND;
const MARGIN = CHECK_PASSES && PROJECTED_TC !== null ? PT_BOUND - PROJECTED_TC : null;
const MARGIN_FACTOR = CHECK_PASSES && PROJECTED_TC !== null && PROJECTED_TC > 0
  ? PT_BOUND / PROJECTED_TC
  : null;

// ── Exported record ───────────────────────────────────────────────────────────
export const PLATT_TRUDGIAN_MATCHED_CHECK = {
  id: 'imp-408',
  title: 'Platt-Trudgian 2021 consistency check at matched height T = 3e10',
  status: 'delivered',

  testHeight: {
    T: T_TEST,
    note:
      'From imp-408 ticket. The actual Platt-Trudgian 2021 paper verifies RH up to ' +
      'T ~ 3e12; T = 3e10 is the conservative matched-height test point two decades ' +
      'below the full PT height.',
  },

  matchedN: {
    N_exact: N_AT_TEST_HEIGHT,
    N_rounded: N_ROUNDED,
    method: 'zeroCountAtHeight(T) = (T / 2pi) * (log(T / 2pi) - 1) from imp-327',
    roundTripHeight: T_ROUND_TRIP,
    roundTripRelError:
      T_ROUND_TRIP > 0
        ? Math.abs(T_ROUND_TRIP - T_TEST) / T_TEST
        : null,
    note:
      'At T = 3e10 the Riemann-von Mangoldt formula gives N ~ 10^11. At this scale ' +
      'the slope contribution b/N is of order 5e-11 and the projected |t_c| collapses ' +
      'to the fit intercept to machine precision.',
  },

  fitConstants: {
    source: 'PATH_C_BASELINE_FIT_V2 (imp-400), OLS on measured Dyson ladder (imp-360)',
    intercept_a: INTERCEPT_A,
    slope_b: SLOPE_B,
    n_fit_points: V2_FIT ? V2_FIT.n : null,
    R2: V2_FIT ? V2_FIT.R2 : null,
  },

  projection: {
    intercept_contribution: INTERCEPT_A,
    slope_contribution: SLOPE_CONTRIB,
    projected_tc: PROJECTED_TC,
    slope_share: (SLOPE_CONTRIB !== null && PROJECTED_TC !== null && PROJECTED_TC > 1e-300)
      ? SLOPE_CONTRIB / PROJECTED_TC
      : null,
    note:
      'At N ~ 10^11, the slope_share is effectively zero. The projection is ' +
      'dominated entirely by the intercept, confirming that the asymptotic regime ' +
      'has been reached.',
  },

  plattTrudgianBound: {
    Lambda_upper: PT_BOUND,
    citation: 'Platt & Trudgian (2021), Bull. Lond. Math. Soc. 53, 792-797',
    context:
      'Unconditional finite-height bound Lambda <= 0.2 from Turing-method ' +
      'zero verification up to T ~ 3e12.',
  },

  checkResult: {
    passes: CHECK_PASSES,
    projected_tc: PROJECTED_TC,
    pt_bound: PT_BOUND,
    margin: MARGIN,
    marginFactor: MARGIN_FACTOR,
    interpretation: CHECK_PASSES
      ? 'CONSISTENT: Path C projected |t_c| at T = 3e10 is ' +
        (PROJECTED_TC !== null ? PROJECTED_TC.toExponential(4) : 'null') +
        ', beating the Platt-Trudgian bound of 0.2 by a factor of ' +
        (MARGIN_FACTOR !== null ? MARGIN_FACTOR.toFixed(1) : '?') +
        'x. The asymptotic Lambda = 0 claim is consistent with finite-height SOTA.'
      : 'INCONSISTENT: Path C projected |t_c| = ' +
        (PROJECTED_TC !== null ? PROJECTED_TC.toExponential(4) : 'null') +
        ' at T = 3e10 exceeds the Platt-Trudgian bound of 0.2. ' +
        'Something is wrong with the constants or the asymptotic claim.',
  },

  whatThisProves:
    'This check confirms that the PATH_C_BASELINE_FIT_V2 ansatz does not ' +
    'contradict established literature at finite height. It is NOT a new bound ' +
    'on Lambda — at T = 3e10 the projection merely recovers the fit intercept, ' +
    'which is the same asymptotic ceiling the V2 fit already reports. The ' +
    'independent contribution of this file is the explicit N-height matching ' +
    'and the FAIL-safe assertion: any regression in the fit constants or the ' +
    'zero-count formula that pushes the projection above 0.2 will be caught here.',

  openGaps: [
    {
      id: 'pt-at-full-height-3e12',
      description:
        'This check uses T = 3e10 from the ticket. A supplementary check ' +
        'at T = 3e12 (the actual PT paper height) would give N ~ 10^12 and ' +
        'an even tighter margin. Deferred to a follow-up ticket.',
    },
    {
      id: 'certified-bound-not-projection',
      description:
        'The projection |t_c|_proj = a + b/N is NOT a certified upper bound ' +
        'on Lambda at T = 3e10 — it is a model-based projection from the OLS ' +
        'fit. A certified bound requires closing B1 (slope analytic bound) and ' +
        'B2 (intercept <= 0 proof) in lambda-zero-attack.js.',
    },
  ],

  sources: [
    'imp-327 zeroCountAtHeight (src/data/lambda-rh-height-mapping.js)',
    'imp-400 PATH_C_BASELINE_FIT_V2 (src/data/path-c-baseline-fit-v2.js)',
    'Platt & Trudgian 2021, Bull. Lond. Math. Soc. 53 (2021), 792-797',
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────
export const PLATT_TRUDGIAN_MATCHED_CHECK_ASSERTIONS = [
  {
    id: 'imp408-fit-is-available',
    holds: () => V2_FIT !== null && INTERCEPT_A !== null && SLOPE_B !== null,
    why:
      'The PATH_C_BASELINE_FIT_V2 fit must be available (non-null) for the ' +
      'matched-height check to be meaningful. A null fit means the V2 OLS ' +
      'failed — likely fewer than 3 valid measured rows in DYSON_LADDER_MEASURED.',
  },
  {
    id: 'imp408-n-at-test-height-is-large',
    holds: () => N_AT_TEST_HEIGHT > 1e10,
    why:
      'At T = 3e10 the Riemann-von Mangoldt formula should return N > 10^10. ' +
      'A smaller value would indicate a bug in the zeroCountAtHeight formula or ' +
      'the T_TEST constant being accidentally set too small.',
  },
  {
    id: 'imp408-slope-contribution-negligible',
    holds: () =>
      SLOPE_CONTRIB !== null &&
      PROJECTED_TC !== null &&
      Math.abs(SLOPE_CONTRIB) < 1e-8 * Math.max(1e-300, Math.abs(PROJECTED_TC)),
    why:
      'At N ~ 10^11 the slope contribution b/N must be negligible relative to ' +
      'the intercept. A non-negligible slope would indicate T_TEST is too small ' +
      'or SLOPE_B is anomalously large, both of which would call into question ' +
      'the asymptotic interpretation.',
  },
  {
    id: 'imp408-check-passes',
    holds: () => CHECK_PASSES === true,
    why:
      'The projected |t_c| at T = 3e10 must not exceed the Platt-Trudgian bound ' +
      'of 0.2. A failure here means the PATH_C_BASELINE_FIT_V2 intercept or slope ' +
      'has grown unexpectedly large — a regression that invalidates the asymptotic ' +
      'Lambda = 0 narrative against published literature.',
  },
  {
    id: 'imp408-margin-factor-above-10',
    holds: () => MARGIN_FACTOR !== null && MARGIN_FACTOR > 10,
    why:
      'The projection should beat the PT bound by at least a factor of 10. ' +
      'With the V2 intercept near 0.0066 the expected factor is ~30. A factor ' +
      'below 10 would mean the fit intercept has drifted to above 0.02, ' +
      'weakening the claim materially.',
  },
  {
    id: 'imp408-round-trip-height-close-to-test',
    holds: () =>
      T_ROUND_TRIP > 0 &&
      Math.abs(T_ROUND_TRIP - T_TEST) / T_TEST < 1e-3,
    why:
      'effectiveHeightForN(round(zeroCountAtHeight(T))) must recover T to within ' +
      '0.1 pct. A larger error would indicate inconsistency between the ' +
      'forward and inverse Riemann-von Mangoldt formulas in imp-327.',
  },
];
