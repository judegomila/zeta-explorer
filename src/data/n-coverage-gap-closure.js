/**
 * @module n-coverage-gap-closure
 * @fileoverview Formal closure of skp5-001 — N-coverage gap [871, 9999] in the
 *   many-body correction bound for the RH-attack proof chain.
 *
 * Exports:
 *   - {@link N_COVERAGE_GAP_CLOSURE} — structured record documenting the
 *     local-density argument that closes the gap for N in [871, 9999], with
 *     cross-references to upstream objects in many-body-correction-closure.js.
 *
 * Proof chain step: S10-verify / skp5-001 closure.
 *   imp-471 (rho_min analytic bound) -> imp-476 (local-density mid-range argument) ->
 *   imp-505 (this file: N_COVERAGE_GAP_CLOSURE record + runtime assertions).
 *
 * Key assertions checked at module load (throws Error if false at import time):
 *   1. gap_3 < min(gap_0, gap_1, gap_2) — j-(N) >= 3 for all N >= 5
 *   2. rho(gamma_4) > C_mb * f(871)     — local density suffices for N in [871, 9999]
 *   3. MID_RANGE_COVERAGE.gapClosed     — upstream confirms mid-range closure
 *   4. MANY_BODY_CORRECTION_CLOSURE midRangeCoverage.gapClosed — full record consistent
 *
 * Tickets: created by imp-505; gap identified by skp5-001 (fifth adversarial review,
 *   imp-474); mid-range argument implemented in imp-476; JSDoc header added by imp-774.
 *
 * imp-505: Formal closure of skp5-001 — N-coverage gap [871, 9999] in many-body bound
 * Date: 2026-04-12
 *
 * FINDING (skp5-001, fifth adversarial review):
 *   The many-body correction bound |delta_mb(N)| < 1 was only certified for:
 *     (a) N >= N_0 = 10000 — analytic bound via rho_min (imp-471)
 *     (b) N in {2,...,870}  — empirical sweep via m-raw-from-umon-bridge.js
 *   The range N in [871, 9999] had NO coverage. At N=871, using the global
 *   rho_min gives C_mb*f(871)/rho_min ~ 1.80 > 1, so the naive bound fails.
 *
 * CLOSURE ARGUMENT (imp-476, embedded in many-body-correction-closure.js):
 *   The key insight is to use the LOCAL density at the 4th Riemann zero
 *   (0-indexed: ZETA_ZEROS[3]) rather than the global rho_min. The argument is:
 *
 *   Step 1: H_N = min{F(gamma_{k+1}) - F(gamma_k) : 0 <= k <= N-2} is
 *           NON-INCREASING in N (it takes the minimum over a strictly larger set).
 *
 *   Step 2: Direct computation from the first 5 Riemann zeros shows
 *           gap_3 < min(gap_0, gap_1, gap_2), so H_5 = gap_3 < H_k for k <= 4.
 *
 *   Step 3: For all N >= 5: H_N <= H_5 = gap_3. Hence j*(N) >= 3 (0-indexed)
 *           for all N >= 5 — the minimum gap is never achieved at k in {0,1,2}.
 *
 *   Step 4: rho is strictly increasing in T, so rho_{j*(N)} >= rho(ZETA_ZEROS[3])
 *           for all N >= 5.
 *
 *   Step 5: f(N) = C_mb * N^{-1/2} * log(N) is strictly decreasing for N >= 8.
 *           Its maximum over [871, 9999] is attained at N=871.
 *
 *   Step 6: rho(ZETA_ZEROS[3]) > C_mb * f(871)  (verified numerically below).
 *           Therefore, for all N in [871, 9999]:
 *             |delta_mb(N)| <= C_mb*f(N) / rho_{j*(N)}
 *                           <= C_mb*f(871) / rho(ZETA_ZEROS[3])
 *                           < 1.  QED.
 *
 * COMBINED COVERAGE (all N >= 2):
 *   Range 1: N in {2,...,870}  — UNCONDITIONAL (direct empirical sweep)
 *   Range 2: N in [871,9999]   — CONDITIONAL on GUE universality (local-density argument)
 *   Range 3: N >= 10000        — CONDITIONAL on GUE universality (global rho_min argument)
 *
 * CONDITIONALITY: Ranges 2 and 3 use C_mb <= 1 which is proven for GUE matrices
 *   (Erdos-Schlein-Yau 2011) but requires the GUE universality conjecture for
 *   Riemann zeros (Montgomery 1973, Rudnick-Sarnak 1996).
 *
 * SYNTAX NOTE: avoid star-slash sequences inside JSDoc block comments.
 */

import {
  MID_RANGE_COVERAGE,
  MANY_BODY_CORRECTION_CLOSURE,
  C_MB,
  N_0_MANY_BODY,
} from '../math/many-body-correction-closure.js';

// ── Closure record ────────────────────────────────────────────────────────────

export const N_COVERAGE_GAP_CLOSURE = {
  ticket:  'imp-505',
  finding: 'skp5-001',
  review:  'fifth adversarial review (imp-474)',
  title:   'Close N-coverage gap [871, 9999] in many-body bound',

  gap: {
    description: 'Many-body correction bound not certified for N in {871,...,9999}',
    whyNaiveBoundFails:
      'At N=871 with global rho_min: C_mb*f(871)/rho_min ~ 1.80 > 1 ' +
      '(rho_min ~ 0.12751 is the analytic lower bound from imp-469; ' +
      'the correction coefficient C_mb*log(871)/sqrt(871) ~ 0.229 is too large).',
  },

  closure: {
    method: 'local-density argument (replace rho_min with rho(ZETA_ZEROS[3]))',
    key:
      'j*(N) >= 3 for all N >= 5 implies rho_{j*(N)} >= rho(ZETA_ZEROS[3]) >> rho_min. ' +
      'The local density at the 4th zero suffices to bound the correction below 1.',
    implementedIn: 'many-body-correction-closure.js, MID_RANGE_COVERAGE (id: imp-476)',
    gapClosed: MID_RANGE_COVERAGE.gapClosed,
    domain: MID_RANGE_COVERAGE.domain,
    argument: MID_RANGE_COVERAGE.argument,
    keyConstants: MID_RANGE_COVERAGE.keyConstants,
  },

  fullCoverage: {
    range1: { domain: 'N in {2,...,870}',    method: 'empirical sweep', conditional: false  },
    range2: { domain: 'N in [871, 9999]',    method: 'local-density argument (imp-476)', conditional: true  },
    range3: { domain: 'N >= ' + N_0_MANY_BODY, method: 'rho_min analytic bound (imp-471)', conditional: true  },
    conditionality: 'Ranges 2 and 3: C_mb <= 1 requires GUE universality for Riemann zeros',
  },

  crossRef: {
    fullClosureRecord: 'MANY_BODY_CORRECTION_CLOSURE in src/math/many-body-correction-closure.js',
    midRangeRecord:    'MID_RANGE_COVERAGE in src/math/many-body-correction-closure.js',
    GUEConditionality: 'C_MB_VERIFICATION in src/math/many-body-correction-closure.js',
  },

  status: MID_RANGE_COVERAGE.gapClosed ? 'CLOSED' : 'OPEN',
};

// ── Standalone assertions ─────────────────────────────────────────────────────

const _kc = MID_RANGE_COVERAGE.keyConstants;

if (!_kc.gap3LtEarly) {
  throw new Error(
    '[imp-505] skp5-001 closure failed: gap_3 (' + _kc.gap3 + ') is not < ' +
    'min-early-gaps (' + _kc.minEarlyGaps + '). j*(N)>=3 argument invalid.',
  );
}

if (!_kc.boundHolds) {
  throw new Error(
    '[imp-505] skp5-001 closure failed: rho(gamma_4) (' + _kc.rhoGamma4 + ') ' +
    'does not exceed C_mb*f(871) (' + _kc.fAt871 + '). Mid-range bound fails.',
  );
}

if (!MID_RANGE_COVERAGE.gapClosed) {
  throw new Error(
    '[imp-505] skp5-001 still OPEN: MID_RANGE_COVERAGE.gapClosed is false. ' +
    'Check many-body-correction-closure.js for upstream failure.',
  );
}

if (!MANY_BODY_CORRECTION_CLOSURE.midRangeCoverage.gapClosed) {
  throw new Error(
    '[imp-505] MANY_BODY_CORRECTION_CLOSURE midRangeCoverage.gapClosed is false. ' +
    'Full closure record inconsistent with mid-range argument.',
  );
}
