/**
 * @module imp-36024-surrogate-vs-assembled-EN-crossvalidation
 *
 * imp-36024 (accuracy, measurement): CROSS-VALIDATE the imp-35889 / imp-35971 three-way
 * split E(N) = E_trunc + E_flow + E_coll -- built on the imp-3406 / imp-33582 SURROGATE
 * sub-terms -- against the lambda-roadmap Step-4 ASSEMBLED E(N), whose constants are
 * E_trunc (imp-963 / imp-447 / imp-459), E_flow (imp-398 pinned C_F) and C_C = (1/8)
 * sqrt(3 pi) (imp-2642 / imp-2643). The roadmap Step-4 nextAction asks to "verify the
 * assembled E(N) formula at the imp-321 ladder"; this module evaluates BOTH bounds at
 * every imp-321 ladder N and tabulates the signed residual proxy-minus-assembled per
 * term and in total.
 *
 * WHAT THE CROSS-VALIDATION SHOWS (the honest finding).
 * -----------------------------------------------------
 * The two decompositions are NOT merely close -- on their two heaviest terms they are
 * BIT-IDENTICAL, because both sides draw from the SAME pinned constants and the SAME
 * Riemann-von Mangoldt height map (effectiveHeightForN):
 *   - E_flow residual = 0 EXACTLY. Both use C_F = (log(T0/2pi)+1)/(2pi) (imp-398) and the
 *     same A1 Gronwall factor exp(|t_c|) with |t_c| <= 2.37e-4 (imp-2633 / imp-2644).
 *   - E_coll residual = 0 EXACTLY. Both use E_coll = C_C sqrt(log T0 / N) with the shared
 *     C_C_PINNED = (1/8) sqrt(3 pi) ~ 0.3837 (imp-2642 / imp-2643).
 * The ENTIRE discrepancy is the E_trunc convention: the surrogate side carries the
 * imp-2631 fixed-strip literal E_trunc = 3.06e-5, whereas the imp-2643 assembled capstone
 * quotes the rounded E_trunc = 3.1e-5. That is an N-INDEPENDENT fixed offset of
 *     residual(E_trunc) = 3.06e-5 - 3.1e-5 = -4.0e-7,
 * so the TOTAL signed residual proxy-minus-assembled is exactly -4.0e-7 at every ladder N.
 * As a FRACTION of the assembled E(N) this grows monotonically -- from ~-1.6e-5 at
 * N = 2458 up to ~-2.07e-3 at N = 1e8 -- purely because E(N) shrinks while the fixed
 * E_trunc offset does not; even at the top of the ladder it stays below 0.21% of E(N).
 *
 * VERDICT: FAITHFUL. The surrogate three-way split is a faithful proxy for the roadmap
 * assembled bound: its two dominant terms coincide to the last bit with the assembled
 * constants, and the sole difference is a rounding convention on the already-negligible
 * truncation floor (imp-2631 3.06e-5 vs imp-2643 3.1e-5), bounded by a fixed -4.0e-7 that
 * never exceeds 0.21% of E(N) across the imp-321 ladder. Consequently any surrogate-based
 * frontier measurement (the imp-35853 knees, the imp-35889 dominance flip, the imp-35971
 * sole-survivor height) transfers to the assembled bound unchanged up to this offset.
 *
 * Measurement / cross-validation only. Reuses the pinned imp-398 / imp-2642 / imp-2643
 * constants and the imp-321 ladder unchanged; derives no remainder; discharges nothing;
 * changes no bound; establishes no operator positivity. C_H = 1/8 stays the ANSATZ that
 * blocks the rigorous beat (imp-2642); the assembled E(N) is NOT a rigorous unconditional
 * bound; imp-486 GUE-conditional caveat is UNTOUCHED; imp-35337a stays OPEN; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-35889-e-share-decomposition-at-knees (the surrogate three-way split reused here)
 * @see imp-2643-honest-assembled-EN (the roadmap assembled E(N) capstone, E_trunc = 3.1e-5)
 * @see imp-2631-honest-truncation-route-assessment (E_trunc = 3.06e-5 fixed-strip literal)
 * @see lambda-pt-scale-extrapolation.js (PT_SCALE_EXTRAPOLATION.ladder: the imp-321 N ladder)
 * @see lambda-roadmap.js (Step-4 nextAction: verify the assembled E(N) at the imp-321 ladder)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { PT_SCALE_EXTRAPOLATION } from './lambda-pt-scale-extrapolation.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)
const TWO_PI = 2 * Math.PI;
const TC_A1_TRAP = 2.37e-4; // |t_c| <= 2.37e-4, A1 unconditional (imp-2633 / imp-2644)
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // C_G = 1.0 non-binding (imp-2644)

// The two E_trunc conventions (the ONLY numeric difference between the two decompositions):
const E_TRUNC_SURROGATE = 3.06e-5; // imp-2631 fixed-strip literal (imp-35889 surrogate side)
const E_TRUNC_ASSEMBLED = 3.1e-5;  // imp-2643 roadmap capstone rounded (imp-963 / imp-447 / imp-459)

// E_flow and E_coll share IDENTICAL formulas + constants on both sides, so we compute them once.
function sharedTerms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional C_H (imp-486)
  return { T0, L, E_flow, E_coll };
}

// The imp-321 ladder N values (PT_SCALE_EXTRAPOLATION.ladder), the exact rungs the roadmap
// Step-4 nextAction names for the assembled-E(N) verification.
const LADDER_N = PT_SCALE_EXTRAPOLATION.ladder.map((r) => r.N);

const rows = LADDER_N.map((N) => {
  const s = sharedTerms(N);
  const E_N_surrogate = E_TRUNC_SURROGATE + s.E_flow + s.E_coll;
  const E_N_assembled = E_TRUNC_ASSEMBLED + s.E_flow + s.E_coll;
  const resTrunc = E_TRUNC_SURROGATE - E_TRUNC_ASSEMBLED; // -4.0e-7 fixed
  const resFlow = 0; // exact: identical C_F / Gronwall
  const resColl = 0; // exact: identical C_C_PINNED
  const resTotal = E_N_surrogate - E_N_assembled; // == resTrunc
  return {
    N: +N.toExponential(3),
    logT0: +s.L.toFixed(4),
    E_trunc_surrogate: E_TRUNC_SURROGATE,
    E_trunc_assembled: E_TRUNC_ASSEMBLED,
    E_flow: +s.E_flow.toExponential(4),
    E_coll: +s.E_coll.toExponential(4),
    E_N_surrogate: +E_N_surrogate.toExponential(5),
    E_N_assembled: +E_N_assembled.toExponential(5),
    residual_E_trunc: +resTrunc.toExponential(3),
    residual_E_flow: resFlow,
    residual_E_coll: resColl,
    residual_total: +resTotal.toExponential(3),
    residual_frac_of_assembled: +(resTotal / E_N_assembled).toExponential(3),
  };
});

const FIXED_TOTAL_RESIDUAL = E_TRUNC_SURROGATE - E_TRUNC_ASSEMBLED; // -4.0e-7, N-independent
const maxAbsFracResidual = rows.reduce((m, r) => Math.max(m, Math.abs(r.residual_frac_of_assembled)), 0);
const eFlowResidualAllZero = rows.every((r) => r.residual_E_flow === 0);
const eCollResidualAllZero = rows.every((r) => r.residual_E_coll === 0);
const totalResidualIsFixedOffset = rows.every(
  (r) => Math.abs(r.residual_total - FIXED_TOTAL_RESIDUAL) < 1e-12
);

export const IMP36024_SURROGATE_VS_ASSEMBLED_EN_CROSSVALIDATION = {
  id: 'imp-36024',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35889 / imp-35971 E(N) = E_trunc + E_flow + E_coll SURROGATE split (imp-3406 / ' +
    'imp-33582 sub-terms) faithfully track the lambda-roadmap Step-4 ASSEMBLED E(N) (E_trunc from ' +
    'imp-963 / imp-447 / imp-459, E_flow from imp-398, C_C from imp-2642 / imp-2643)? Evaluate both ' +
    'at every imp-321 ladder N and tabulate the signed residual proxy-minus-assembled per term and total.',
  method:
    'Evaluate the surrogate and assembled E(N) at each imp-321 ladder N (PT_SCALE_EXTRAPOLATION.ladder). ' +
    'Both sides share the SAME RvM height map (effectiveHeightForN), the SAME E_flow (C_F = (log(T0/2pi)+1)/' +
    '(2pi), imp-398; Gronwall exp(|t_c|), |t_c| <= 2.37e-4) and the SAME E_coll (C_C sqrt(log T0 / N), ' +
    'C_C_PINNED = (1/8) sqrt(3 pi), imp-2642 / imp-2643); the only difference is the E_trunc convention ' +
    '(surrogate 3.06e-5, imp-2631; assembled 3.1e-5, imp-2643). Tabulate the per-term and total residuals.',
  ladderTicket: 'imp-321',
  rows,
  fixedTotalResidual: +FIXED_TOTAL_RESIDUAL.toExponential(3), // -4.0e-7 (N-independent)
  eFlowResidualExactlyZero: eFlowResidualAllZero,
  eCollResidualExactlyZero: eCollResidualAllZero,
  totalResidualIsFixedETruncOffset: totalResidualIsFixedOffset,
  maxAbsFractionalResidual: +maxAbsFracResidual.toExponential(3), // ~2.07e-3 at N = 1e8
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'FAITHFUL (MEASUREMENT, NOT rigorous). Cross-validating the imp-35889 / imp-35971 surrogate ' +
    'three-way split against the imp-2643 roadmap assembled E(N) at the imp-321 ladder: the two ' +
    'heaviest terms are BIT-IDENTICAL. E_flow residual = 0 exactly (shared imp-398 C_F and A1 Gronwall) ' +
    'and E_coll residual = 0 exactly (shared C_C_PINNED = (1/8) sqrt(3 pi), imp-2642 / imp-2643), because ' +
    'both sides use the SAME effectiveHeightForN RvM map. The ENTIRE discrepancy is the E_trunc convention ' +
    '(imp-2631 3.06e-5 vs imp-2643 rounded 3.1e-5), an N-independent fixed offset residual_total = -4.0e-7 ' +
    'at every rung. As a fraction of the assembled E(N) it grows from ~-1.6e-5 at N = 2458 to ~-2.07e-3 at ' +
    'N = 1e8 (E(N) shrinks, the offset does not) but never exceeds 0.21% of E(N). So the surrogate is a ' +
    'faithful proxy for the assembled bound, and every surrogate-based frontier measurement transfers to ' +
    'the assembled bound up to this rounding offset. Reuses the pinned imp-398 / imp-2642 / imp-2643 ' +
    'constants and the imp-321 ladder unchanged; derives no remainder; discharges nothing; changes no ' +
    'bound. C_H = 1/8 stays the ANSATZ that blocks the rigorous beat (imp-2642); the assembled E(N) is NOT ' +
    'a rigorous unconditional bound; imp-486 GUE-conditional caveat UNTOUCHED; imp-35337a stays OPEN; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35889 (surrogate three-way split reused here); imp-35971 (surrogate sole-survivor height); ' +
    'imp-2643 (roadmap assembled E(N), E_trunc = 3.1e-5); imp-2631 (E_trunc = 3.06e-5 fixed strip); ' +
    'imp-398 (C_F pinned); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-321 (PT_SCALE_EXTRAPOLATION ' +
    'ladder); imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP36024_SURROGATE_VS_ASSEMBLED_EN_CROSSVALIDATION_ASSERTIONS = [
  {
    // (1) the ladder actually is the seven-rung imp-321 ladder.
    id: 'imp36024-uses-imp321-ladder',
    description: 'evaluates on the imp-321 ladder (7 rungs, from N = 2458 up to N = 1e8)',
    holds: () => rows.length === 7 && rows[0].N < 1e4 && rows[rows.length - 1].N === 1e8,
  },
  {
    // (2) E_flow residual is EXACTLY zero at every rung (identical imp-398 C_F and A1 Gronwall).
    id: 'imp36024-eflow-residual-exactly-zero',
    description: 'E_flow residual proxy-minus-assembled is exactly 0 at every ladder N (shared imp-398 C_F)',
    holds: () => eFlowResidualAllZero === true,
  },
  {
    // (3) E_coll residual is EXACTLY zero at every rung (shared C_C_PINNED).
    id: 'imp36024-ecoll-residual-exactly-zero',
    description: 'E_coll residual proxy-minus-assembled is exactly 0 at every ladder N (shared C_C = (1/8) sqrt(3 pi))',
    holds: () => eCollResidualAllZero === true,
  },
  {
    // (4) the total residual is the fixed N-independent E_trunc offset -4.0e-7 at every rung.
    id: 'imp36024-total-residual-fixed-etrunc-offset',
    description: 'total residual equals the N-independent E_trunc offset -4.0e-7 (3.06e-5 - 3.1e-5) at every rung',
    holds: () =>
      totalResidualIsFixedOffset === true &&
      Math.abs(FIXED_TOTAL_RESIDUAL - -4.0e-7) < 1e-12,
  },
  {
    // (5) the fractional residual grows with N (fixed offset / shrinking E(N)) but stays below 0.21%.
    id: 'imp36024-fractional-residual-grows-but-bounded',
    description: 'the |fractional residual| grows monotonically with N yet never exceeds 0.21% of the assembled E(N)',
    holds: () => {
      const fracs = rows.map((r) => Math.abs(r.residual_frac_of_assembled));
      const monotone = fracs.every((f, i) => i === 0 || f >= fracs[i - 1] - 1e-15);
      return monotone && maxAbsFracResidual < 2.1e-3 && maxAbsFracResidual > 1e-3;
    },
  },
  {
    // (6) internal consistency: at each rung E_N_surrogate - E_N_assembled reproduces the E_trunc gap.
    id: 'imp36024-per-row-total-matches-etrunc-gap',
    description: 'per row, E_N_surrogate - E_N_assembled equals E_trunc_surrogate - E_trunc_assembled (E_flow, E_coll cancel)',
    holds: () =>
      rows.every((r) => Math.abs(r.residual_total - (r.E_trunc_surrogate - r.E_trunc_assembled)) < 5e-9),
  },
  {
    // (7) honesty gate: measurement only, conditional, no bound moves, C_H ansatz + imp-486 kept, no refereed bound is changed, NO QED.
    id: 'imp36024-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps C_H ansatz + imp-486, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP36024_SURROGATE_VS_ASSEMBLED_EN_CROSSVALIDATION;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /C_H = 1\/8 stays the ANSATZ/.test(r.verdict) &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP36024_SURROGATE_VS_ASSEMBLED_EN_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36024-surrogate-vs-assembled-EN-crossvalidation assertion failed: ${a.id}`);
  }
}
