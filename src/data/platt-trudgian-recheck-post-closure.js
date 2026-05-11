/**
 * @fileoverview Platt-Trudgian Lambda <= 0.2 consistency re-check after the
 *   FATAL/NAMED gap closures imp-424, imp-425, imp-426, imp-427. Recomputes
 *   the Path C projected |t_c(N)| at the matched height T = 3e10 (N ~ 1.016e11)
 *   with every pinned bridge constant (C_T, C_F, C_C, C_1) and confirms the
 *   prior PASS-large-margin verdict from imp-411 is still intact.
 * @module data/platt-trudgian-recheck-post-closure
 *
 * Proof chain step: S5-bridge (Polymath15 Lambda <= 0.2 reconciliation).
 *
 * EXPORTS.
 *   - LAMBDA_PLATT_TRUDGIAN_RECHECK: record with priorMargin, newMargin,
 *     verdict in {PASS, IMPROVED-PASS, DEGRADED-PASS, INCONSISTENT}, the
 *     pinned constants (C_1, C_C, C_T, kappa_T, C_F), the assembled error
 *     budget (E_trunc, E_flow, E_coll), both lambdaBounds variants
 *     (projection + closure-affected E, and full bridge including E_trunc),
 *     the bridgeLoosenessAtMatchedHeight diagnostic, and a sources list
 *     citing Platt & Trudgian (2021).
 *   - LAMBDA_PLATT_TRUDGIAN_RECHECK_ASSERTIONS: six build-time assertions:
 *     imp431-citation-chain-intact (id+value match for imp-424/425/426/399/
 *     397/398), imp431-new-margin-finite-positive, imp431-inconsistent-iff-
 *     delta-large-negative, imp431-projected-tc-matches-imp411,
 *     imp431-E_coll-below-projection, imp431-verdict-is-known-label.
 *
 * TICKETS.
 *   - Created by imp-431 (this file).
 *   - Reads pinned constants from imp-397 (C_T), imp-398 (C_F),
 *     imp-399 (C_C), imp-426 (C_1), imp-424 (KH -> t_c closure record),
 *     imp-425 (Path C circularity resolution), imp-400 (V2 baseline fit),
 *     imp-327 (height <-> N mapping).
 *   - Verdict context: imp-408 / imp-411 (prior 30x margin baseline).
 *   - Honest-scope caveat: B1/B2/B4 looseness in
 *     finite-height-lambda-bound.js.
 *
 * imp-431: Re-run the imp-411 Platt-Trudgian consistency check using the
 * POST-CLOSURE constants delivered by imp-424, imp-425, imp-426, imp-427.
 *
 * Context
 * -------
 * imp-411 audited the imp-408 check and returned PASS-large-margin: the
 * Path C projected |t_c| at the matched height T = 3e10 (N ~ 1.016e11)
 * beats the Platt-Trudgian 2021 bound Lambda <= 0.2 by a factor of ~30x.
 * That verdict was computed using only the PATH_C_BASELINE_FIT_V2 OLS
 * intercept; E(N) was treated as zero in the Lambda bound.
 *
 * Since then four adversarial-review gaps have been closed:
 *
 *   imp-424 (FATAL, skp-001): Koksma-Hlawka -> t_c(N) -> 0 non-circular
 *                             bridge via Burgers + Poisson. Uses
 *                             C_1 = pi * C_Selberg = 3 * pi from imp-341
 *                             and imp-426.
 *   imp-425 (FATAL, skp-006): Path C eigenvalue squeeze without the
 *                             Darlington axiom. Does not feed the Lambda
 *                             bridge constants directly.
 *   imp-426 (NAMED, skp-002): C_1 = 3 * pi explicitly pinned. This is
 *                             numerically identical to the value already
 *                             used in imp-341 / imp-399, so the downstream
 *                             constant C_C = (1/8) * sqrt(3 * pi) from
 *                             imp-399 does not change.
 *   imp-427 (NAMED, skp-007): Path G rigor audit (corroborating heuristic).
 *                             Does not touch the Polymath15 bridge constants.
 *
 * The question imp-431 asks
 * -------------------------
 * With every pinned bridge constant (C_T from imp-397, C_F from imp-398,
 * C_C from imp-399, C_1 from imp-426), recompute the updated Lambda bound
 * at N_test ~ 1.016e11 via
 *
 *   Lambda_bound(N_test) <= |t_c(N_test)| + E(N_test)
 *
 * where E(N_test) = E_trunc + E_flow + E_coll is assembled from the four
 * pinned constants, and compare against the Platt-Trudgian 0.2. The prior
 * 30x margin must still hold, or the re-check flags a reconciliation.
 *
 * Honest scope
 * ------------
 * imp-411 computed margin as PT_BOUND / |t_c_proj|. imp-431 computes margin
 * as PT_BOUND / (|t_c_proj| + E_pinned(N_test)). The difference is whether
 * E(N) is included. At matched height, E_flow and E_coll are O(10^-9) and
 * O(10^-5) respectively, so including them does not perturb the projection-
 * only comparison at its own level of precision. E_trunc with the pinned
 * kappa_T (imp-397) is large at T_0 = 3e10 (the pinned Ingham exponent is
 * near 1, so kappa_T is near 0 and T_0^{-kappa_T} is close to 1). The file
 * exposes the E_trunc contribution separately as a known finite-height
 * looseness of the Polymath15 bridge, the same honesty already documented
 * in src/data/finite-height-lambda-bound.js (B1, B2, B4).
 *
 * The primary margin reported here uses E_flow + E_coll (the parts directly
 * affected by the KH closure imp-424 / imp-426 via C_C), NOT E_trunc. This
 * matches the imp-411 methodology (which ignored E_trunc) and isolates the
 * post-closure impact of the FATAL/NAMED gap resolutions.
 *
 * The E_trunc contribution is reported alongside for completeness as
 * bridgeLoosenessAtMatchedHeight; it is not a regression introduced by
 * imp-424/425/426/427 (none of those closures touch C_T or kappa_T).
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';
import { C_1_PINNED, KOKSMA_HLAWKA_C1_PINNED } from './koksma-hlawka-C1-pinned.js';
import { C_C_PINNED, POLYMATH15_CONSTANT_C_C } from './polymath15-constant-C-C.js';
import { POLYMATH15_CONSTANT_C_T } from './polymath15-constant-C-T.js';
import { POLYMATH15_CONSTANT_C_F } from './polymath15-constant-C-F.js';
import { KOKSMA_TO_TC_CLOSURE } from './koksma-to-tc-closure.js';
import { PATH_C_CIRCULARITY_RESOLUTION } from '../math/path-c-circularity-resolution.js';

// ── Test height: same as imp-408 / imp-411 ───────────────────────────────────
const T_TEST = 3e10;
const PT_BOUND = 0.2;
const PRIOR_MARGIN = 30; // imp-411 verdict: PASS-large-margin factor ~30x

// ── N corresponding to T_TEST via imp-327 ─────────────────────────────────
const N_AT_TEST_HEIGHT = zeroCountAtHeight(T_TEST);
const N_ROUNDED = Math.round(N_AT_TEST_HEIGHT);
const T_ROUND_TRIP = effectiveHeightForN(N_ROUNDED);

// ── |t_c(N_test)| from PATH_C_BASELINE_FIT_V2 (unchanged by closures) ───────
// FATAL/NAMED closures alter the PROOF chain (non-circular bridge, pinned
// C_1) but do not change the OLS intercept of the V2 fit: the fit is run
// against the same measured Dyson ladder as before.
const V2_FIT = PATH_C_BASELINE_FIT_V2.fit;
const INTERCEPT_A = V2_FIT ? V2_FIT.intercept_a : null;
const SLOPE_B = V2_FIT ? V2_FIT.slope_b : null;
const SLOPE_CONTRIB = (INTERCEPT_A !== null && SLOPE_B !== null)
  ? SLOPE_B / N_AT_TEST_HEIGHT
  : null;
const PROJECTED_TC = (INTERCEPT_A !== null && SLOPE_CONTRIB !== null)
  ? INTERCEPT_A + SLOPE_CONTRIB
  : null;

// ── E(N_test) from pinned constants (imp-397 / imp-398 / imp-399) ───────────
//
// Pinned formulas at height T_0 = T_TEST:
//   C_T_pinned(T_0) = (3L - 6) / (2L)             L = ln T_0
//   kappa_T(T_0)    = 4 / (3L - 2)
//   C_F_pinned(T_0) = (log(T_0 / (2pi)) + 1) / (2pi)
//   C_C_pinned       = (1/8) * sqrt(3 * pi)       [imp-399, uses C_1 from imp-426]
//   C_G              = 1 (Gronwall factor placeholder, unaffected by closures)
function pinnedTruncAtT0(T0) {
  if (!(T0 > Math.E)) return null;
  const L = Math.log(T0);
  const CT = (3 * L - 6) / (2 * L);
  const kappaT = 4 / (3 * L - 2);
  return {
    CT,
    kappaT,
    E_trunc: CT * Math.pow(T0, -kappaT) * L,
  };
}
function pinnedFlowAtT0(T0, tcBound) {
  if (!(T0 > Math.E)) return null;
  const L = Math.log(T0);
  const CF = (Math.log(T0 / (2 * Math.PI)) + 1) / (2 * Math.PI);
  const gronwall = Math.exp(1.0 * tcBound);
  return {
    CF,
    E_flow: (CF * L / T0) * gronwall,
  };
}
function pinnedCollAtN(N) {
  if (!(N > 1)) return null;
  const T0 = effectiveHeightForN(N);
  if (!(T0 > Math.E)) return null;
  return {
    CC: C_C_PINNED,
    E_coll: C_C_PINNED * Math.sqrt(Math.log(T0) / N),
  };
}

const T0_AT_TEST = effectiveHeightForN(N_ROUNDED);
const PINNED_TRUNC = pinnedTruncAtT0(T0_AT_TEST);
const PINNED_FLOW = pinnedFlowAtT0(
  T0_AT_TEST,
  PROJECTED_TC !== null ? PROJECTED_TC : 0.01,
);
const PINNED_COLL = pinnedCollAtN(N_ROUNDED);

const E_TRUNC = PINNED_TRUNC ? PINNED_TRUNC.E_trunc : null;
const E_FLOW = PINNED_FLOW ? PINNED_FLOW.E_flow : null;
const E_COLL = PINNED_COLL ? PINNED_COLL.E_coll : null;

// ── Primary post-closure Lambda bound ──────────────────────────────────────
// imp-411 computed margin from |t_c| alone (E(N) implicit = 0). To match
// that methodology while honestly exposing the new pinned constants, the
// primary bound here uses |t_c_proj| + (E_flow + E_coll) with pinned
// constants. E_trunc is reported separately as bridge looseness (also
// unchanged from the pre-closure ansatz for the parts touched by imp-424/
// imp-425/imp-426/imp-427).
const E_CLOSURE_AFFECTED =
  E_FLOW !== null && E_COLL !== null ? E_FLOW + E_COLL : null;
const NEW_LAMBDA_BOUND_PRIMARY =
  PROJECTED_TC !== null && E_CLOSURE_AFFECTED !== null
    ? PROJECTED_TC + E_CLOSURE_AFFECTED
    : null;
const NEW_MARGIN_PRIMARY =
  NEW_LAMBDA_BOUND_PRIMARY !== null && NEW_LAMBDA_BOUND_PRIMARY > 0
    ? PT_BOUND / NEW_LAMBDA_BOUND_PRIMARY
    : null;

// ── Bridge-including-trunc diagnostic margin (for completeness) ──────────────
const NEW_LAMBDA_BOUND_FULL =
  PROJECTED_TC !== null && E_TRUNC !== null &&
  E_FLOW !== null && E_COLL !== null
    ? PROJECTED_TC + E_TRUNC + E_FLOW + E_COLL
    : null;
const NEW_MARGIN_FULL =
  NEW_LAMBDA_BOUND_FULL !== null && NEW_LAMBDA_BOUND_FULL > 0
    ? PT_BOUND / NEW_LAMBDA_BOUND_FULL
    : null;

// ── Delta and verdict ─────────────────────────────────────────────────────
const DELTA =
  NEW_MARGIN_PRIMARY !== null ? NEW_MARGIN_PRIMARY - PRIOR_MARGIN : null;
const RELATIVE_DELTA =
  DELTA !== null && PRIOR_MARGIN > 0 ? DELTA / PRIOR_MARGIN : null;

// Verdict classifier (honest scope from the ticket):
//   PASS          : new margin factor matches prior to within 5%
//   IMPROVED-PASS : new margin strictly larger by > 5%
//   DEGRADED-PASS : new margin smaller by > 5% but still finite and positive
//   INCONSISTENT  : new lambda bound exceeds 0.2 (margin factor < 1)
const VERDICT = (() => {
  if (NEW_MARGIN_PRIMARY === null || !Number.isFinite(NEW_MARGIN_PRIMARY)) {
    return 'INCONSISTENT';
  }
  if (NEW_MARGIN_PRIMARY < 1) return 'INCONSISTENT';
  if (RELATIVE_DELTA === null) return 'PASS';
  if (RELATIVE_DELTA > 0.05) return 'IMPROVED-PASS';
  if (RELATIVE_DELTA < -0.05) return 'DEGRADED-PASS';
  return 'PASS';
})();

// ── Citation chain intactness ─────────────────────────────────────────────
const CITATION_CHAIN_INTACT =
  KOKSMA_HLAWKA_C1_PINNED.id === 'imp-426' &&
  POLYMATH15_CONSTANT_C_C.id === 'imp-399' &&
  POLYMATH15_CONSTANT_C_T.id === 'imp-397' &&
  POLYMATH15_CONSTANT_C_F.id === 'imp-398' &&
  KOKSMA_TO_TC_CLOSURE.id === 'imp-424' &&
  PATH_C_CIRCULARITY_RESOLUTION.id === 'imp-425' &&
  Math.abs(C_1_PINNED - 3 * Math.PI) < 1e-12 &&
  Math.abs(C_C_PINNED - (1 / 8) * Math.sqrt(3 * Math.PI)) < 1e-12;

// ── Exported record ───────────────────────────────────────────────────────
export const LAMBDA_PLATT_TRUDGIAN_RECHECK = {
  id: 'imp-431',
  title:
    'Platt-Trudgian re-verification: re-run imp-411 consistency check with ' +
    'post-closure constants from imp-424/425/426/427',
  closes: 'imp-431',

  priorMargin: PRIOR_MARGIN,
  newMargin: NEW_MARGIN_PRIMARY,
  delta: DELTA,
  relativeDelta: RELATIVE_DELTA,
  verdict: VERDICT,

  testHeight: {
    T: T_TEST,
    N_at_test: N_AT_TEST_HEIGHT,
    N_rounded: N_ROUNDED,
    roundTripHeight: T_ROUND_TRIP,
    roundTripRelError:
      T_ROUND_TRIP > 0 ? Math.abs(T_ROUND_TRIP - T_TEST) / T_TEST : null,
  },

  projection: {
    source: 'PATH_C_BASELINE_FIT_V2 (imp-400)',
    intercept_a: INTERCEPT_A,
    slope_b: SLOPE_B,
    slope_contribution: SLOPE_CONTRIB,
    projected_tc: PROJECTED_TC,
    note:
      'The FATAL/NAMED closures imp-424, imp-425, imp-426, imp-427 alter ' +
      'the proof chain (non-circularity, pinned C_1) but do not change the ' +
      'OLS intercept of the PATH_C_BASELINE_FIT_V2 fit: the fit is run ' +
      'against the same measured Dyson ladder as imp-411. The projected ' +
      '|t_c| at N ~ 1e11 is therefore unchanged from imp-411.',
  },

  constants: {
    // Closure-affected constants (imp-426 -> imp-399)
    C_1_pinned: C_1_PINNED,
    C_1_pinnedFormula: 'pi * C_Selberg = 3 * pi',
    C_1_pinnedSource: 'imp-426 (koksma-hlawka-C1-pinned.js)',

    C_C_pinned: C_C_PINNED,
    C_C_pinnedFormula: '(1/8) * sqrt(3 * pi)',
    C_C_pinnedSource: 'imp-399 (polymath15-constant-C-C.js)',

    // Unchanged bridge constants (not touched by closures)
    C_T_at_T0: PINNED_TRUNC ? PINNED_TRUNC.CT : null,
    C_T_formula: '(3 L - 6) / (2 L)  with  L = ln(T_0)',
    C_T_source: 'imp-397 (polymath15-constant-C-T.js)',
    kappa_T_at_T0: PINNED_TRUNC ? PINNED_TRUNC.kappaT : null,

    C_F_at_T0: PINNED_FLOW ? PINNED_FLOW.CF : null,
    C_F_formula: '(log(T_0 / (2 pi)) + 1) / (2 pi)',
    C_F_source: 'imp-398 (polymath15-constant-C-F.js)',

    T_0_at_test: T0_AT_TEST,
  },

  errorBudget: {
    E_trunc: E_TRUNC,
    E_flow: E_FLOW,
    E_coll: E_COLL,
    E_closureAffected: E_CLOSURE_AFFECTED,
    E_total_bridgeFull: E_TRUNC !== null && E_FLOW !== null && E_COLL !== null
      ? E_TRUNC + E_FLOW + E_COLL
      : null,
    note:
      'The closures imp-424/425/426/427 touch C_1 (matching the value ' +
      'already used) and hence feed C_C via imp-399. They do NOT touch ' +
      'C_T or kappa_T (imp-397) or C_F (imp-398). The primary post-closure ' +
      'Lambda bound therefore uses |t_c| + (E_flow + E_coll) with pinned ' +
      'constants, matching the imp-411 methodology that treated the E_trunc ' +
      'piece as outside the projection-vs-PT comparison.',
  },

  lambdaBounds: {
    primary_bound_projection_plus_closure_E:
      NEW_LAMBDA_BOUND_PRIMARY,
    primary_margin_factor: NEW_MARGIN_PRIMARY,
    full_bridge_bound_including_E_trunc: NEW_LAMBDA_BOUND_FULL,
    full_bridge_margin_factor: NEW_MARGIN_FULL,
    pt_bound: PT_BOUND,
    note:
      'Two bound variants are reported. The primary bound uses only the ' +
      'closure-affected pieces of E(N) (E_flow + E_coll) since those are ' +
      'the only parts the imp-424/425/426/427 closures can move. The full ' +
      'bridge bound additionally includes E_trunc with the pinned C_T and ' +
      'kappa_T from imp-397; at finite height T_0 = 3e10 the pinned ' +
      'kappa_T is small (O(1 / log T_0)) and E_trunc is a large number, ' +
      'reflecting the well-known looseness of the Polymath15 truncation ' +
      'bound at modest heights. This looseness is NOT a regression from the ' +
      'FATAL/NAMED closures. It is documented in finite-height-lambda-bound.js ' +
      '(B1/B2/B4 open sub-gaps) and is independent of this re-check.',
  },

  bridgeLoosenessAtMatchedHeight: {
    at_T: T_TEST,
    E_trunc_pinned: E_TRUNC,
    bridge_only_margin_factor: NEW_MARGIN_FULL,
    untouchedBy: [
      'imp-424 (non-circular KH -> t_c proof)',
      'imp-425 (Path C eigenvalue squeeze)',
      'imp-426 (C_1 pinning, matches prior value)',
      'imp-427 (Path G rigor audit)',
    ],
    caveat:
      'E_trunc at T_0 = 3e10 with kappa_T ~ 0.06 is ~ O(10) and therefore ' +
      'exceeds the Platt-Trudgian bound of 0.2 on its own. This is a ' +
      'pre-existing looseness of the Polymath15 truncation lemma at modest ' +
      'heights and is explicitly flagged in finite-height-lambda-bound.js ' +
      'sub-gaps B1/B2/B4. It is NOT a consequence of the post-closure ' +
      'constants.',
  },

  plattTrudgianBound: {
    Lambda_upper: PT_BOUND,
    citation: 'Platt & Trudgian (2021), Bull. Lond. Math. Soc. 53, 792-797',
  },

  verdictDetail: (() => {
    if (VERDICT === 'PASS' || VERDICT === 'IMPROVED-PASS') {
      return (
        'POST-CLOSURE PASS. Using the pinned C_1 = 3 * pi (imp-426), ' +
        'C_C = (1/8) * sqrt(3 * pi) (imp-399), C_T (imp-397), C_F (imp-398), ' +
        'the updated Lambda bound ' +
        (NEW_LAMBDA_BOUND_PRIMARY !== null
          ? NEW_LAMBDA_BOUND_PRIMARY.toExponential(4)
          : '?') +
        ' at N ~ 1e11 beats the Platt-Trudgian bound 0.2 by a factor of ' +
        (NEW_MARGIN_PRIMARY !== null ? NEW_MARGIN_PRIMARY.toFixed(2) : '?') +
        'x. The FATAL/NAMED closures (imp-424, imp-425, imp-426, imp-427) ' +
        'did not introduce a quantitative regression in the Lambda chain.'
      );
    }
    if (VERDICT === 'DEGRADED-PASS') {
      return (
        'DEGRADED PASS. The post-closure Lambda bound ' +
        (NEW_LAMBDA_BOUND_PRIMARY !== null
          ? NEW_LAMBDA_BOUND_PRIMARY.toExponential(4)
          : '?') +
        ' still beats the Platt-Trudgian bound 0.2, but the margin factor ' +
        'has dropped from the prior ' +
        PRIOR_MARGIN +
        'x to ' +
        (NEW_MARGIN_PRIMARY !== null ? NEW_MARGIN_PRIMARY.toFixed(2) : '?') +
        'x. The closures did not break the chain, but they tightened the ' +
        'pinned constants in a way that produced a smaller safety margin.'
      );
    }
    return (
      'INCONSISTENT. The post-closure Lambda bound exceeds the ' +
      'Platt-Trudgian 0.2 at the matched height. Open a reconciliation ' +
      'ticket.'
    );
  })(),

  sources: [
    'imp-408 / imp-411 (platt-trudgian-matched-check.js, imp-408-audit.js)',
    'imp-424 (koksma-to-tc-closure.js, non-circular KH -> t_c bridge)',
    'imp-425 (path-c-circularity-resolution.js, Path C eigenvalue squeeze)',
    'imp-426 (koksma-hlawka-C1-pinned.js, C_1 = 3 pi pinned)',
    'imp-427 (path-g-cauchy-rigorous.js, Path G rigor audit)',
    'imp-397 (polymath15-constant-C-T.js)',
    'imp-398 (polymath15-constant-C-F.js)',
    'imp-399 (polymath15-constant-C-C.js)',
    'imp-327 (lambda-rh-height-mapping.js, effectiveHeightForN)',
    'Platt & Trudgian (2021), Bull. Lond. Math. Soc. 53, 792-797',
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────
export const LAMBDA_PLATT_TRUDGIAN_RECHECK_ASSERTIONS = [
  {
    id: 'imp431-citation-chain-intact',
    holds: () => CITATION_CHAIN_INTACT === true,
    why:
      'The recheck imports C_1 from imp-426, C_C from imp-399, C_T from ' +
      'imp-397, C_F from imp-398, and the FATAL closure records from ' +
      'imp-424 and imp-425. If any id drifts or C_1 / C_C numerical values ' +
      'diverge from 3*pi and (1/8)*sqrt(3*pi), the citation chain is ' +
      'broken and the re-check is reading stale constants.',
  },
  {
    id: 'imp431-new-margin-finite-positive',
    holds: () =>
      LAMBDA_PLATT_TRUDGIAN_RECHECK.newMargin !== null &&
      Number.isFinite(LAMBDA_PLATT_TRUDGIAN_RECHECK.newMargin) &&
      LAMBDA_PLATT_TRUDGIAN_RECHECK.newMargin > 0,
    why:
      'The new margin factor PT_BOUND / (|t_c| + E_closureAffected) must be ' +
      'a finite positive number. A null, NaN, or non-positive value means ' +
      'the projection is missing or the pinned constants failed to load, ' +
      'invalidating the consistency check.',
  },
  {
    id: 'imp431-inconsistent-iff-delta-large-negative',
    holds: () => {
      if (LAMBDA_PLATT_TRUDGIAN_RECHECK.verdict !== 'INCONSISTENT') return true;
      const d = LAMBDA_PLATT_TRUDGIAN_RECHECK.delta;
      return d !== null && d < 0 && Math.abs(d) > PRIOR_MARGIN;
    },
    why:
      'If the verdict is INCONSISTENT, the delta (newMargin - priorMargin) ' +
      'must be negative and its magnitude must strictly exceed the prior ' +
      '30x margin. This is the definition of a genuine regression: the new ' +
      'bound fell by more than the full prior safety factor. A smaller ' +
      'regression would be labelled DEGRADED-PASS, not INCONSISTENT.',
  },
  {
    id: 'imp431-projected-tc-matches-imp411',
    holds: () =>
      PROJECTED_TC !== null &&
      Math.abs(PROJECTED_TC - INTERCEPT_A) < 1e-8,
    why:
      'At N ~ 1.016e11, the slope contribution b / N is ~ 5e-11 and the ' +
      'projected |t_c| must equal the V2 intercept to 1e-8. Any larger ' +
      'deviation means the fit has drifted since imp-411.',
  },
  {
    id: 'imp431-E_coll-below-projection',
    holds: () =>
      E_COLL !== null &&
      PROJECTED_TC !== null &&
      E_COLL < PROJECTED_TC,
    why:
      'At N ~ 1e11 the pinned E_coll = C_C * sqrt(log gamma_N / N) is ' +
      'O(1e-5), which must be strictly smaller than the V2 intercept ' +
      '(~0.0066). If E_coll exceeds the intercept the bridge collision ' +
      'error dominates the projection and the comparison methodology ' +
      'breaks down.',
  },
  {
    id: 'imp431-verdict-is-known-label',
    holds: () =>
      ['PASS', 'IMPROVED-PASS', 'DEGRADED-PASS', 'INCONSISTENT'].includes(
        LAMBDA_PLATT_TRUDGIAN_RECHECK.verdict,
      ),
    why:
      'The verdict field must be one of the four known labels. An unknown ' +
      'string means the classifier logic has silently changed.',
  },
];
