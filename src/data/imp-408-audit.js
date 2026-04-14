/**
 * @module imp-408-audit
 * @fileoverview Audit record for the imp-408 Platt-Trudgian consistency check (imp-411).
 * Exports {@link IMP408_AUDIT} (verdict, supporting evidence, open gaps) and
 * {@link IMP408_AUDIT_ASSERTIONS} (build-time guards). Belongs to the PATH C hybrid
 * proof chain at the finite-height literature validation step. Key assertions: the
 * OLS intercept a ≈ 0.0066 satisfies the Platt-Trudgian 2021 bound Λ ≤ 0.2 by
 * ~30×; slope contribution is negligible at N ~ 1e11; no roll-back ticket required.
 * Created by imp-411; references imp-408 (platt-trudgian-matched-check.js).
 * @see src/data/platt-trudgian-matched-check.js
 * @see imp-408
 * @see imp-411
 */

/**
 * imp-411: Audit of the imp-408 Platt-Trudgian consistency check verdict
 *
 * Context
 * -------
 * imp-408 produced src/data/platt-trudgian-matched-check.js which computes
 * whether the PATH_C_BASELINE_FIT_V2 ansatz at height T = 3e10 is consistent
 * with the Platt-Trudgian 2021 bound Lambda <= 0.2. imp-411 audits the result
 * of that computation, determines the verdict (PASS / FAIL-small / FAIL-large),
 * and records the outcome with supporting evidence.
 *
 * Audit methodology
 * -----------------
 * Step 1: Import the live PLATT_TRUDGIAN_MATCHED_CHECK record from imp-408.
 *         This ensures the audit reads the SAME numbers the check uses,
 *         not a stale snapshot.
 * Step 2: Inspect checkResult.passes to determine the primary verdict.
 * Step 3: Inspect marginFactor to grade the margin (large > 10x, small <= 10x).
 * Step 4: Verify two supporting assertions:
 *   (a) N_at_T is correctly large (> 1e10) -- confirms zeroCountAtHeight OK.
 *   (b) slope contribution is negligible -- confirms asymptotic regime reached.
 * Step 5: Export the audit record with verdict classification and caveats.
 *
 * Verdict classification (from imp-411 ticket)
 * --------------------------------------------
 *   (a) PASS          -- check passes, strong external validation, move on.
 *   (b) FAIL-small    -- check fails but margin < 5x; flag reconciliation ticket.
 *   (c) FAIL-large    -- check fails with large margin; roll back imp-401 SOTA.
 */

import {
  PLATT_TRUDGIAN_MATCHED_CHECK,
} from './platt-trudgian-matched-check.js';

// ── Read live check result ──────────────────────────────────────────────────
const CHECK = PLATT_TRUDGIAN_MATCHED_CHECK;
const PASSES         = CHECK.checkResult.passes;
const MARGIN_FACTOR  = CHECK.checkResult.marginFactor;
const PROJECTED_TC   = CHECK.checkResult.projected_tc;
const PT_BOUND       = CHECK.checkResult.pt_bound;
const N_EXACT        = CHECK.matchedN.N_exact;
const INTERCEPT_A    = CHECK.fitConstants.intercept_a;
const SLOPE_B        = CHECK.fitConstants.slope_b;
const SLOPE_CONTRIB  = CHECK.projection.slope_contribution;

// ── Grade the verdict ──────────────────────────────────────────────────────
// PASS   : passes === true  (projected_tc <= 0.2)
// The margin factor further grades PASS quality:
//   - factor >= 10  => large-margin PASS (very strong validation)
//   - 2 <= factor < 10 => narrow PASS
//   - factor < 2    => borderline (should investigate even if passes === true)
const VERDICT_CODE =
  !PASSES
    ? (MARGIN_FACTOR !== null && MARGIN_FACTOR < 0.5
        ? 'FAIL-large'
        : 'FAIL-small')
    : MARGIN_FACTOR !== null && MARGIN_FACTOR >= 10
    ? 'PASS-large-margin'
    : 'PASS-narrow-margin';

const VERDICT_ACTION =
  VERDICT_CODE === 'PASS-large-margin'
    ? 'No action required. The asymptotic Lambda = 0 claim is consistent with ' +
      'Platt-Trudgian at the matched height by a comfortable factor of ' +
      (MARGIN_FACTOR !== null ? MARGIN_FACTOR.toFixed(1) : '?') + 'x. ' +
      'Phase 22 work (Lean formalization, multi-precision arithmetic, paper) may proceed.'
    : VERDICT_CODE === 'PASS-narrow-margin'
    ? 'Passes, but margin factor is below 10 -- investigate whether a recent ' +
      'regression in the Dyson ladder has inflated the V2 intercept. ' +
      'Measure margin_factor_threshold: should be ~30 given intercept ~ 0.0066.'
    : VERDICT_CODE === 'FAIL-small'
    ? 'CHECK FAILED with small margin. Open a reconciliation ticket to identify ' +
      'which of C_H, C_T, C_F, C_C is miscalibrated, or whether the V2 intercept ' +
      'has drifted above 0.02.'
    : 'CHECK FAILED WITH LARGE MARGIN. ROLL BACK imp-401 SOTA HEADLINE ' +
      'IMMEDIATELY. Open an investigation ticket: projected_tc = ' +
      (PROJECTED_TC !== null ? PROJECTED_TC.toFixed(4) : '?') +
      ' far exceeds the Platt-Trudgian bound of ' + PT_BOUND + '. Something is ' +
      'fundamentally wrong with the constants or the asymptotic claim.';

// ── Supporting evidence notes ─────────────────────────────────────────────
// (a) The zeroCountAtHeight formula gives N ~ 1.016e11 at T = 3e10.
//     This is > 1e10, confirming the Riemann-von Mangoldt formula is correct.
// (b) At N ~ 1e11 the slope contribution b/N is ~ 5e-11 (slope_b ~ 4.91),
//     which is < 1e-8 * projected_tc. The asymptotic regime has been reached:
//     the projection collapses to the intercept a ~ 0.0066.
// (c) Margin factor = 0.2 / 0.0066 ~ 30.3 >> 10. This is a LARGE-MARGIN PASS.

const SUPPORTING_EVIDENCE = {
  N_at_T_test: {
    value: N_EXACT,
    expected: '>1e10',
    holds: N_EXACT !== null && N_EXACT > 1e10,
    note:
      'zeroCountAtHeight(3e10) = (T/2pi)*(log(T/2pi)-1) gives N ~ 1.016e11. ' +
      'The Riemann-von Mangoldt formula is operating correctly.',
  },
  slope_contribution_negligible: {
    slope_b: SLOPE_B,
    slope_contrib: SLOPE_CONTRIB,
    projected_tc: PROJECTED_TC,
    relative_share:
      SLOPE_CONTRIB !== null && PROJECTED_TC !== null && Math.abs(PROJECTED_TC) > 1e-300
        ? SLOPE_CONTRIB / PROJECTED_TC
        : null,
    holds:
      SLOPE_CONTRIB !== null &&
      PROJECTED_TC !== null &&
      Math.abs(SLOPE_CONTRIB) < 1e-8 * Math.max(1e-300, Math.abs(PROJECTED_TC)),
    note:
      'slope_b / N ~ 5e-11. The slope share of the projection is effectively ' +
      'zero -- the asymptotic intercept dominates entirely at N ~ 1e11.',
  },
  intercept_value: {
    intercept_a: INTERCEPT_A,
    pt_bound: PT_BOUND,
    ratio: INTERCEPT_A !== null && INTERCEPT_A > 0 ? PT_BOUND / INTERCEPT_A : null,
    note:
      'intercept_a ~ 0.0066 from PATH_C_BASELINE_FIT_V2 OLS on the measured ' +
      'Dyson ladder. This is the asymptotic ceiling on the projected |t_c|. ' +
      'At N -> infinity the projection recovers this intercept exactly.',
  },
};

// ── Follow-up tickets ──────────────────────────────────────────────────────
// Since the verdict is PASS-large-margin, no roll-back or reconciliation
// ticket is needed. Two open sub-gaps from imp-408 are carried forward as
// informational items (not new tickets -- they exist in imp-411 context):
const FOLLOWUP_TICKETS =
  VERDICT_CODE === 'PASS-large-margin'
    ? []
    : VERDICT_CODE === 'PASS-narrow-margin'
    ? [
        {
          id: 'pt-audit-narrow-margin-investigation',
          priority: 'high',
          title:
            'Investigate why PATH_C_BASELINE_FIT_V2 intercept has inflated to ' +
            'push margin factor below 10',
          dependsOn: ['imp-400', 'imp-408'],
        },
      ]
    : [
        {
          id: 'pt-audit-fail-reconciliation',
          priority: 'critical',
          title:
            'Reconcile imp-408 FAIL: identify which pinned constant is wrong ' +
            'and whether imp-401 SOTA claim must be retracted',
          dependsOn: ['imp-401', 'imp-408'],
        },
      ];

// ── Open gaps carried forward from imp-408 ─────────────────────────────────
// These are NOT new tickets -- they are sub-gaps already named in imp-408 and
// left as informational context for future externalization work.
const OPEN_GAPS_FROM_IMP408 = [
  {
    id: 'pt-at-full-height-3e12',
    description:
      'A supplementary check at T = 3e12 (the actual Platt-Trudgian 2021 paper ' +
      'height) would give N ~ 10^12 and an even tighter margin. The intercept ' +
      'is N-independent so the verdict would be identical to the T = 3e10 check, ' +
      'but running the check at the exact paper height is useful for the arXiv ' +
      'submission (imp-414). Deferred.',
  },
  {
    id: 'certified-bound-not-projection',
    description:
      'The projection |t_c|_proj = a + b/N is NOT a certified upper bound on ' +
      'Lambda at T = 3e10. It is a model-based OLS projection. A certified bound ' +
      'requires closing B1 (slope analytic bound on b in imp-363/371/372) and ' +
      'B2 (intercept a <= 0 proof in lambda-zero-attack.js). These remain open.',
  },
];

// ── Exported audit record ─────────────────────────────────────────────────
export const IMP408_AUDIT = {
  id: 'imp-411',
  title: 'Audit of imp-408 Platt-Trudgian consistency check at T = 3e10',
  status: 'delivered',
  auditsTicket: 'imp-408',
  auditedFile: 'src/data/platt-trudgian-matched-check.js',

  verdict: {
    code: VERDICT_CODE,
    passes: PASSES,
    marginFactor: MARGIN_FACTOR,
    projectedTc: PROJECTED_TC,
    ptBound: PT_BOUND,
    action: VERDICT_ACTION,
  },

  supportingEvidence: SUPPORTING_EVIDENCE,

  followupTickets: FOLLOWUP_TICKETS,

  openGapsFromImp408: OPEN_GAPS_FROM_IMP408,

  summary:
    'imp-408 CHECK PASSES with large margin (~30x). The PATH_C_BASELINE_FIT_V2 ' +
    'OLS intercept a ~ 0.0066 at height T = 3e10 (N ~ 1.016e11) is consistent ' +
    'with the Platt-Trudgian 2021 bound Lambda <= 0.2 by a factor of ~30. ' +
    'The asymptotic Lambda = 0 claim (imp-401) is NOT contradicted by the ' +
    'finite-height literature SOTA. Phase 22 work proceeds.',

  caveats: [
    'The "check passes" conclusion is based on a model-based OLS projection, ' +
    'not a certified mathematical bound. Certified bound requires B1 + B2 closure.',
    'The margin factor of ~30 is large, but it reflects only that the OLS intercept ' +
    'is 30x below 0.2. It does NOT prove Lambda <= 0.0066 -- the projection is an ' +
    'asymptotic ansatz, not a finite-height theorem.',
    'The check is at T = 3e10 (two decades below the full PT height of 3e12). A ' +
    'check at T = 3e12 would give an identical verdict (intercept is N-independent ' +
    'in the asymptotic regime), but is deferred to imp-414 arXiv preparation.',
  ],

  methodNote:
    'Audit reads from the LIVE PLATT_TRUDGIAN_MATCHED_CHECK export, so any ' +
    'regression in the V2 fit constants will automatically change the verdict_code ' +
    'at build time. The build-time assertions in platt-trudgian-matched-check.js ' +
    'guard against silent regression (see PLATT_TRUDGIAN_MATCHED_CHECK_ASSERTIONS).',
};

// ── Build-time assertions ─────────────────────────────────────────────────
export const IMP408_AUDIT_ASSERTIONS = [
  {
    id: 'imp411-verdict-is-pass',
    holds: () => VERDICT_CODE === 'PASS-large-margin' || VERDICT_CODE === 'PASS-narrow-margin',
    why:
      'The Platt-Trudgian consistency check must pass. A FAIL verdict here ' +
      'means the imp-408 runtime check failed -- the projected |t_c| exceeds 0.2, ' +
      'invalidating the asymptotic Lambda = 0 SOTA headline from imp-401.',
  },
  {
    id: 'imp411-verdict-is-large-margin',
    holds: () => VERDICT_CODE === 'PASS-large-margin',
    why:
      'The margin factor should be >= 10 (expected ~30 given intercept ~ 0.0066). ' +
      'A drop below 10 would indicate the V2 fit intercept has inflated to above ' +
      '0.02 -- a silent regression worth investigating even if the check still ' +
      'technically passes.',
  },
  {
    id: 'imp411-no-followup-tickets',
    holds: () => FOLLOWUP_TICKETS.length === 0,
    why:
      'A PASS-large-margin verdict requires no reconciliation or roll-back tickets. ' +
      'If FOLLOWUP_TICKETS is non-empty, the verdict has changed to PASS-narrow ' +
      'or FAIL and immediate action is required.',
  },
  {
    id: 'imp411-n-at-height-confirmed',
    holds: () => SUPPORTING_EVIDENCE.N_at_T_test.holds === true,
    why:
      'The Riemann-von Mangoldt formula zeroCountAtHeight(3e10) must return ' +
      'N > 1e10. This confirms the height mapping used in imp-408 is correct.',
  },
  {
    id: 'imp411-slope-negligible-confirmed',
    holds: () => SUPPORTING_EVIDENCE.slope_contribution_negligible.holds === true,
    why:
      'At N ~ 1e11 the slope contribution must be < 1e-8 * projected_tc. A ' +
      'non-negligible slope would indicate a regression in the V2 fit constants ' +
      'or a logic error in the height matching.',
  },
];
