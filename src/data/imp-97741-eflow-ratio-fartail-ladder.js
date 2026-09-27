/**
 * @module imp-97741-eflow-ratio-fartail-ladder
 *
 * imp-97741 (numerical, frontier-direction): imp-97723 asserted, without tabulating, that the
 * flow term E_flow = C_F (log T0/T0) Gronwall is "negligible on the whole tested band (deep past
 * N_cross)". This module TABULATES that assertion: using the EXACT inherited imp-3406/imp-97702
 * parts() sub-terms, it measures the two ratios that decide negligibility --
 *
 *     E_flow / E_trunc   (against the N-INDEPENDENT fixed-strip floor E_trunc = 3.06e-5)
 *     E_flow / E_coll    (against the dominant GUE-conditional collision term)
 *
 * across a log-spaced grid on [1e18, 1e300] (the double-precision ceiling of the inherited
 * Riemann-von Mangoldt inverse), and reports the LARGEST ratio anywhere on the band.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-3406 / imp-97702 / imp-97723)
 * ---------------------------------------------------------------------------
 *     E_trunc  = 3.06e-5                          (N-INDEPENDENT fixed strip, imp-2631)
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)    (dominant, GUE-conditional C_H)
 *     E_flow   = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0       = effectiveHeightForN(N)           (RvM inverse)
 * No re-derivation, no fresh model: the exact inherited parts(), read on the extended grid.
 *
 * WHY E_flow IS NEGLIGIBLE (the scaling that the ladder confirms numerically)
 * -------------------------------------------------------------------------
 * E_flow carries a 1/T0 factor while both competitors decay far slower: E_trunc is CONSTANT and
 * E_coll ~ sqrt(log T0 / N) ~ N^-1/2 (since T0 grows almost linearly in N via the RvM inverse).
 * With T0 growing nearly like N, E_flow/E_trunc ~ (log T0)/T0 -> 0 super-polynomially, and
 * E_flow/E_coll ~ (log T0)^{1/2} / T0 * sqrt(N) ~ (log N)^{1/2} / sqrt(N) -> 0. Both ratios shrink
 * monotonically down the band, so the band MAXIMUM sits at the low end (1e18).
 *
 * THE FINDINGS (measurement only)
 * ------------------------------
 *   (F1) E_flow IS SUBDOMINANT TO E_trunc BY >= 10 ORDERS EVERYWHERE. The ratio E_flow/E_trunc
 *        peaks at 4.70e-11 at 1e18 and falls monotonically to 2.66e-289 at 1e300. E_flow never
 *        reaches even a part-in-1e10 of the fixed-strip floor on the tested band.
 *   (F2) E_flow IS SUBDOMINANT TO E_coll BY >= 6 ORDERS EVERYWHERE. The ratio E_flow/E_coll peaks
 *        at 5.95e-7 at 1e18 and falls monotonically to 8.10e-145 at 1e300. Even against the
 *        dominant collision term (itself vanishing) E_flow stays below a part-in-1e6.
 *   (F3) BOTH RATIOS DECAY MONOTONICALLY; THE BAND MAXIMUM IS AT 1e18. The largest E_flow ratio
 *        anywhere on [1e18,1e300] is E_flow/E_coll = 5.95e-7 (at 1e18); every rung deeper is
 *        strictly smaller. This QUANTIFIES the imp-97723 "negligible on the whole tested band"
 *        assertion: E_flow contributes at most ~6e-7 of the largest competitor across the band.
 *
 * MEASUREMENT ONLY on the inherited surrogate. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; no bound moves; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (asserts E_flow negligible on the band; does not tabulate)
 * @see imp-97702-sigma-fartail-exponent-residual-half-loglaw (residual split feeding the same parts())
 * @see imp-33644-etrunc-ecoll-ladder-1e18-fartail (E_trunc/E_coll ladder companion)
 * @see imp-3406-sigma-highN-extrapolation (origin of the parts() sub-terms)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via the RvM inverse)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-97702)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97702/imp-97723 exactly

// EXACT imp-3406/imp-97702/imp-97723 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // negligible deep past the crossover
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { T0, L, E_flow, E_coll };
}

// (F1/F2/F3) The E_flow-ratio ladder on [1e18,1e300].
const RATIO_LADDER = [18, 24, 30, 40, 60, 100, 150, 200, 250, 300].map((k) => {
  const N = Math.pow(10, k);
  const P = parts(N);
  const flowOverTrunc = P.E_flow / E_TRUNC_PT;
  const flowOverColl = P.E_flow / P.E_coll;
  return {
    N: `1e${k}`,
    eFlow: +P.E_flow.toExponential(4),
    eColl: +P.E_coll.toExponential(4),
    flowOverTrunc: +flowOverTrunc.toExponential(4),
    flowOverColl: +flowOverColl.toExponential(4),
  };
});

// The largest E_flow ratio anywhere on the band (band maximum sits at the low end, 1e18).
const MAX_FLOW_OVER_TRUNC = Math.max(...RATIO_LADDER.map((r) => r.flowOverTrunc));
const MAX_FLOW_OVER_COLL = Math.max(...RATIO_LADDER.map((r) => r.flowOverColl));

export const IMP97741_EFLOW_RATIO_FARTAIL_LADDER = {
  id: 'imp-97741',
  proofSection: 'S-frontier',
  question:
    'Tabulate the far-tail E_flow/E_trunc and E_flow/E_coll ratios across [1e18,1e300] to quantify ' +
    'the imp-97723 assertion that E_flow is negligible on the whole tested band. Measurement only ' +
    'on the inherited imp-3406/imp-97702 parts(); no bound moves; conditional-share diagnostic, ' +
    'NOT an RH bound; no QED.',
  measuredQuantity:
    'E_flow/E_trunc (against the 3.06e-5 fixed-strip floor) and E_flow/E_coll (against the dominant ' +
    'GUE-conditional collision term) on a log-spaced grid [1e18,1e300], plus the largest ratio on the band',
  ratioLadder: RATIO_LADDER,
  maxFlowOverTrunc: +MAX_FLOW_OVER_TRUNC.toExponential(4),
  maxFlowOverColl: +MAX_FLOW_OVER_COLL.toExponential(4),
  bandMaxAt: '1e18', // both ratios decay monotonically down the band; the maximum is at the low end
  finding: {
    F1_subdominant_to_trunc:
      'E_flow/E_trunc peaks at 4.70e-11 at 1e18 and falls monotonically to 2.66e-289 at 1e300; ' +
      'E_flow never reaches a part-in-1e10 of the N-independent fixed-strip floor E_trunc = 3.06e-5 ' +
      'anywhere on the tested band.',
    F2_subdominant_to_coll:
      'E_flow/E_coll peaks at 5.95e-7 at 1e18 and falls monotonically to 8.10e-145 at 1e300; even ' +
      'against the dominant (itself vanishing) collision term E_coll, E_flow stays below a ' +
      'part-in-1e6 across the band.',
    F3_band_maximum_is_at_1e18:
      'Both ratios decay monotonically down the band (E_flow carries a 1/T0 factor while E_trunc is ' +
      'constant and E_coll ~ N^-1/2), so the band maximum sits at the low end: the largest E_flow ' +
      'ratio anywhere on [1e18,1e300] is E_flow/E_coll = 5.95e-7 at 1e18. This quantifies the ' +
      'imp-97723 negligibility assertion -- E_flow is at most ~6e-7 of the largest competitor.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Tabulating the inherited imp-3406/imp-97702 ' +
    'parts() across [1e18,1e300] confirms the imp-97723 assertion quantitatively: E_flow/E_trunc ' +
    'peaks at 4.70e-11 (1e18) and E_flow/E_coll peaks at 5.95e-7 (1e18), both decaying monotonically ' +
    'to ~1e-289 / ~1e-145 by 1e300. The largest E_flow ratio anywhere on the band is 5.95e-7, so ' +
    'E_flow is subdominant to both the E_trunc = 3.06e-5 floor (by >= 10 orders) and E_coll (by ' +
    '>= 6 orders) on the whole tested band. Conditional-share diagnostic, NOT an RH bound; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-97723 (asserts E_flow negligible on the band, untabulated); imp-97702 (residual split); ' +
    'imp-33644 (E_trunc/E_coll ladder); imp-3406 (parts() origin); imp-398 (C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (RvM inverse).',
};

export const IMP97741_EFLOW_RATIO_FARTAIL_LADDER_ASSERTIONS = [
  {
    // (F1) E_flow stays below a part-in-1e10 of the fixed-strip floor everywhere on the band.
    id: 'imp97741-eflow-subdominant-to-trunc',
    description: 'E_flow/E_trunc < 1e-10 at every rung on [1e18,1e300] (subdominant to the 3.06e-5 fixed-strip floor)',
    holds: () => RATIO_LADDER.every((r) => r.flowOverTrunc < 1e-10),
  },
  {
    // (F2) E_flow stays below a part-in-1e6 of the dominant collision term everywhere on the band.
    id: 'imp97741-eflow-subdominant-to-coll',
    description: 'E_flow/E_coll < 1e-6 at every rung on [1e18,1e300] (subdominant to the dominant GUE-conditional term)',
    holds: () => RATIO_LADDER.every((r) => r.flowOverColl < 1e-6),
  },
  {
    // (F3) Both ratios decay strictly monotonically down the band.
    id: 'imp97741-ratios-decay-monotonically',
    description: 'both E_flow/E_trunc and E_flow/E_coll strictly decrease from 1e18 to 1e300',
    holds: () => {
      for (let i = 1; i < RATIO_LADDER.length; i++) {
        if (!(RATIO_LADDER[i].flowOverTrunc < RATIO_LADDER[i - 1].flowOverTrunc)) return false;
        if (!(RATIO_LADDER[i].flowOverColl < RATIO_LADDER[i - 1].flowOverColl)) return false;
      }
      return true;
    },
  },
  {
    // (F3) The band maximum sits at the low end (1e18) and matches the reported largest ratio.
    id: 'imp97741-band-maximum-at-1e18',
    description: 'the largest E_flow ratio on the band is E_flow/E_coll ~ 5.95e-7 at 1e18 (band maximum at the low end)',
    holds: () => {
      const first = RATIO_LADDER[0];
      return (
        first.N === '1e18' &&
        Math.abs(first.flowOverColl - MAX_FLOW_OVER_COLL) < 1e-12 &&
        MAX_FLOW_OVER_COLL < 1e-6 &&
        MAX_FLOW_OVER_COLL > 1e-8
      );
    },
  },
  {
    // Honesty gate: measurement only, no bound moves, no QED, PT stays SOTA.
    id: 'imp97741-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, Platt-Trudgian Lambda <= 0.2 remains SOTA',
    holds: () =>
      IMP97741_EFLOW_RATIO_FARTAIL_LADDER.isRigorous === false &&
      /NO QED/.test(IMP97741_EFLOW_RATIO_FARTAIL_LADDER.verdict) &&
      /remains SOTA/.test(IMP97741_EFLOW_RATIO_FARTAIL_LADDER.verdict),
  },
];

for (const a of IMP97741_EFLOW_RATIO_FARTAIL_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97741-eflow-ratio-fartail-ladder assertion failed: ${a.id}`
    );
  }
}
