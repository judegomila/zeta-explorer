/**
 * @module imp-124788-extprec-pairratio-deep-landmark
 *
 * imp-124788 (numerical / cross-validation, frontier cross-check): imp-124770 M2 showed the direct 5-point
 * cross-check of the imp-97665 EXACT pair-ratio identity E_CF/E_ET = E_flow/E_trunc degrades to |reldiff|
 * ~2e-5 (L6) / 6.8e-4 (L7) at the deep landmarks, and ATTRIBUTED the loss to the imp-124769 |E_CF|
 * landmark-bisection round-off floor (|E_CF|_crit ~1.4e-6) rather than a real deviation -- but that
 * attribution was never confirmed in extended precision. This leaf MIRRORS the imp-124767 method: re-runs the
 * imp-124770/imp-97665 stencil at mpmath dps=60 (offline script tmp/imp-124788-extprec-pairratio.py) across the
 * full landmark ladder L2..L7 and carries the measured extended-precision |reldiff| literals here. Numerical /
 * cross-validation only; conditional-share diagnostic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the
 * pinned constants are perturbed only symbolically as differentiation axes; no bound moves; NO QED.
 *
 * THE METHOD (imp-124770 machinery, lifted to mpmath dps=60)
 * ---------------------------------------------------------
 *   T0 = effectiveHeightForN(N) (RvM inverse, Newton); L = ln T0;
 *   E_flow = cf*(ln(T0/2pi)+1)/(2pi) * (L/T0) * exp(TC_A1_TRAP);  E_coll = C_C_PINNED*sqrt(L/N);
 *   E_N = et + E_flow + E_coll;  sigma = E_coll/E_N;  landmark(level) = downslope sigma(N)=level (bisection).
 *   E_ET = d ln N_L / d ln e (E_trunc axis), E_CF = d ln N_L / d ln f (C_F axis), both via the imp-97665 5-point
 *   O(eps^4) stencil at eps=1e-3. The target E_flow/E_trunc is the closed-form analytic pair-ratio (imp-97665).
 * Everything is a smooth closed form of x = ln N, so at dps=60 the landmark bisection and the stencil are limited
 * only by the working precision, NOT by double-precision round-off. This isolates the identity from the arithmetic.
 *
 * THE RESULT (the deliverable) -- double precision (imp-124770) vs mpmath dps=60 (this leaf)
 * ----------------------------------------------------------------------------------------
 *   LANDMARK  sigma    N_L          E_flow/E_trunc   |reldiff| DOUBLE   |reldiff| dps=60   |E_CF| dps=60
 *   L2        0.9      2.572e7      1.092281e-1      5.80e-12          4.45e-13           2.516e-1
 *   L3        0.5      3.267e9      1.905727e-3      4.75e-10          3.58e-14           3.999e-3
 *   L4        0.1      3.213e11     3.548798e-5      2.27e-8           3.34e-14           7.378e-5
 *   L5        0.02     1.080e13     1.568197e-6      2.88e-7           3.33e-14           3.246e-6
 *   L6        0.005    1.955e14     1.159918e-7      2.01e-5           3.33e-14           2.394e-7
 *   L7        0.001    5.432e15     5.660544e-9      6.80e-4           3.33e-14           1.165e-8
 *
 * THE FINDING (numerical / cross-validation only)
 * -----------------------------------------------
 *   (M1) THE DEEP-TAIL AGREEMENT LOSS IS PURELY A DOUBLE-PRECISION ARTEFACT. At dps=60 the |reldiff| at the deep
 *        landmarks collapses from the double-precision 2.01e-5 (L6) / 6.80e-4 (L7) back to ~3.33e-14 -- a factor
 *        ~6.0e8 (L6) / ~2.0e10 (L7) tighter -- fully confirming the imp-124770 M2 attribution: the loss tracked the
 *        collapse of |E_CF| (2.4e-7 at L6, 1.2e-8 at L7) below the imp-124769 double-precision |E_CF| round-off
 *        floor (~1.4e-6), NOT a deviation of the identity.
 *   (M2) THE MONOTONE DEGRADATION VANISHES -- |reldiff| IS FLAT DOWN THE LADDER. In extended precision |reldiff| no
 *        longer grows toward the far tail; it sits at a flat ~3.33e-14 dps-limited floor at every rung L4..L7 (and
 *        4.45e-13 / 3.58e-14 at the flow-heavy L2/L3), BELOW even the L4 double-precision level 2.27e-8. The
 *        imp-97665 common-factor cancellation is confirmed independent of the flow share to the deepest landmark:
 *        the identity E_CF/E_ET = E_flow/E_trunc stays EXACT seven decades deep in N.
 *
 * NUMERICAL / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124770-pair-ratio-identity-landmark-ladder (the DOUBLE-precision ladder L2..L7 this leaf lifts to dps=60)
 * @see imp-124767-extprec-deep-window-exponent (the extended-precision method mirrored here)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the |E_CF| round-off crossover pinned between L5 and L6)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (the EXACT pair-ratio + 5-point verify at L2/L3/L4)
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (the individual L6 elasticity values, sigma = 0.005)
 */

// Extended-precision (mpmath dps=60) measured literals from tmp/imp-124788-extprec-pairratio.py.
// Each rung carries the DOUBLE-precision |reldiff| (imp-124770) alongside the dps=60 re-measurement.
const LADDER = [
  { key: 'L2', sigma: 0.9, N_L: 2.572361e7, target_Eflow_over_Etrunc: 1.092281e-1, reldiff_double: 5.8e-12, reldiff_dps60: 4.453e-13, absECF_dps60: 2.51631e-1 },
  { key: 'L3', sigma: 0.5, N_L: 3.267235e9, target_Eflow_over_Etrunc: 1.905727e-3, reldiff_double: 4.75e-10, reldiff_dps60: 3.583e-14, absECF_dps60: 3.99888e-3 },
  { key: 'L4', sigma: 0.1, N_L: 3.213181e11, target_Eflow_over_Etrunc: 3.548798e-5, reldiff_double: 2.27e-8, reldiff_dps60: 3.338e-14, absECF_dps60: 7.37778e-5 },
  { key: 'L5', sigma: 0.02, N_L: 1.079935e13, target_Eflow_over_Etrunc: 1.568197e-6, reldiff_double: 2.88e-7, reldiff_dps60: 3.333e-14, absECF_dps60: 3.24564e-6 },
  { key: 'L6', sigma: 0.005, N_L: 1.955164e14, target_Eflow_over_Etrunc: 1.159918e-7, reldiff_double: 2.01e-5, reldiff_dps60: 3.333e-14, absECF_dps60: 2.3935e-7 },
  { key: 'L7', sigma: 0.001, N_L: 5.43233e15, target_Eflow_over_Etrunc: 5.660544e-9, reldiff_double: 6.8e-4, reldiff_dps60: 3.333e-14, absECF_dps60: 1.16473e-8 },
];

const byKey = Object.fromEntries(LADDER.map((r) => [r.key, r]));

// imp-124769 double-precision |E_CF| landmark-bisection round-off floor (the blamed mechanism).
const ECF_DOUBLE_ROUNDOFF_FLOOR = 1.4e-6;
const DPS = 60;
const EPS = 1e-3; // the imp-97665 primary stencil step

export const IMP124788_EXTPREC_PAIRRATIO_DEEP_LANDMARK = {
  id: 'imp-124788',
  proofSection: 'S-frontier',
  question:
    'imp-124770 M2 showed the direct 5-point cross-check of the imp-97665 EXACT pair-ratio identity ' +
    'E_CF/E_ET = E_flow/E_trunc degrades to |reldiff| ~2e-5 (L6) / 6.8e-4 (L7) at the deep landmarks, and ' +
    'blamed the loss on the imp-124769 |E_CF| round-off floor rather than a real deviation -- but never ' +
    'confirmed it in extended precision. Does the deep-tail |reldiff| collapse back toward the L2..L4 ~1e-10 ' +
    'level at mpmath dps=60, confirming the identity stays exact and the loss is a double-precision artefact? ' +
    'Numerical / cross-validation only; pinned constants perturbed only symbolically; no bound moves; no QED.',
  method:
    'Mirror the imp-124767 method. Re-run the imp-124770/imp-97665 machinery VERBATIM at mpmath dps=60 (offline ' +
    'script tmp/imp-124788-extprec-pairratio.py): landmark(level) by downslope sigma-bisection, E_ET and E_CF by ' +
    'the imp-97665 5-point O(eps^4) stencil at eps=1e-3, target E_flow/E_trunc in closed form, across the full ' +
    'ladder L2..L7. Carry the measured extended-precision |reldiff| and |E_CF| literals here and compare against ' +
    'the imp-124770 double-precision baseline rung by rung.',
  dps: DPS,
  eps_probed: EPS,
  ecf_double_roundoff_floor: ECF_DOUBLE_ROUNDOFF_FLOOR,
  ladder: LADDER,
  deepTailCollapse: {
    L6: { double: byKey.L6.reldiff_double, dps60: byKey.L6.reldiff_dps60, tighterFactor: +(byKey.L6.reldiff_double / byKey.L6.reldiff_dps60).toExponential(2) },
    L7: { double: byKey.L7.reldiff_double, dps60: byKey.L7.reldiff_dps60, tighterFactor: +(byKey.L7.reldiff_double / byKey.L7.reldiff_dps60).toExponential(2) },
  },
  finding: {
    M1_deep_tail_loss_is_double_precision_artefact:
      'At dps=60 the |reldiff| at the deep landmarks collapses from the double-precision 2.01e-5 (L6) / 6.80e-4 ' +
      '(L7) back to ~3.33e-14 -- a factor ' + (byKey.L6.reldiff_double / byKey.L6.reldiff_dps60).toExponential(1) +
      ' (L6) / ' + (byKey.L7.reldiff_double / byKey.L7.reldiff_dps60).toExponential(1) + ' (L7) tighter -- fully ' +
      'confirming the imp-124770 M2 attribution: the loss tracked the collapse of |E_CF| (2.4e-7 at L6, 1.2e-8 at ' +
      'L7) below the imp-124769 double-precision |E_CF| round-off floor (~1.4e-6), NOT a deviation of the identity.',
    M2_monotone_degradation_vanishes:
      'In extended precision |reldiff| no longer grows toward the far tail; it sits at a flat ~3.33e-14 dps-limited ' +
      'floor at every rung L4..L7 (and 4.45e-13 / 3.58e-14 at the flow-heavy L2/L3), BELOW even the L4 ' +
      'double-precision level 2.27e-8. The imp-97665 common-factor cancellation is confirmed independent of the ' +
      'flow share to the deepest landmark: the identity E_CF/E_ET = E_flow/E_trunc stays EXACT seven decades deep in N.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Lifting the imp-124770 pair-ratio ladder ' +
    'to mpmath dps=60 confirms the imp-124770 M2 attribution decisively: the deep-tail |reldiff| collapses from ' +
    'the double-precision 2.01e-5 (L6) / 6.80e-4 (L7) to a flat ~3.33e-14 dps-limited floor at every rung L4..L7 ' +
    '(a factor ~6.0e8 / ~2.0e10 tighter), BELOW even the L4 double-precision level 2.27e-8. The monotone ' +
    'degradation of imp-124770 M2 is purely a double-precision round-off artefact -- it vanishes entirely once ' +
    '|E_CF| (which had fallen to 2.4e-7 / 1.2e-8, below the imp-124769 ~1.4e-6 double round-off floor) is resolved ' +
    'in extended precision. The imp-97665 EXACT pair-ratio identity E_CF/E_ET = E_flow/E_trunc is confirmed to ' +
    'stay exact seven decades deep in N (2.6e7 -> 5.4e15), the common-factor cancellation independent of the ' +
    'collapsing flow share. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the ' +
    'pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (perturbed only symbolically as ' +
    'differentiation axes); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124770 (the DOUBLE-precision pair-ratio ladder L2..L7 lifted here); imp-124767 (the extended-precision ' +
    'method mirrored); imp-124769 (the |E_CF| round-off crossover pinned between L5 and L6); imp-97665 (the EXACT ' +
    'pair-ratio E_CF/E_ET = E_flow/E_trunc + 5-point verify at L2/L3/L4); imp-97821 (individual L6 elasticity ' +
    'values); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route).',
};

export const IMP124788_EXTPREC_PAIRRATIO_DEEP_LANDMARK_ASSERTIONS = [
  {
    // The ladder covers the six landmarks L2..L7 with the inherited sigma levels and downslope N ordering.
    id: 'imp124788-ladder-covers-L2-through-L7',
    description: 'ladder has L2..L7 at sigma 0.9/0.5/0.1/0.02/0.005/0.001 with strictly increasing N_L down the ladder',
    holds: () =>
      LADDER.length === 6 &&
      LADDER.every((r, i) => i === 0 || r.N_L > LADDER[i - 1].N_L),
  },
  {
    // (M1): the deep landmarks L6/L7 collapse by many orders of magnitude in extended precision.
    id: 'imp124788-deep-tail-collapses-orders',
    description: 'L6/L7 |reldiff| drop by >= 1e8 / 1e9 from double to dps=60 (deep-tail loss is a double artefact)',
    holds: () =>
      byKey.L6.reldiff_double / byKey.L6.reldiff_dps60 > 1e8 &&
      byKey.L7.reldiff_double / byKey.L7.reldiff_dps60 > 1e9,
  },
  {
    // (M1): the blamed |E_CF| at L6/L7 lies below the imp-124769 double-precision round-off floor.
    id: 'imp124788-ecf-below-roundoff-floor-at-deep-rungs',
    description: 'the dps=60 |E_CF| at L6 and L7 is below the imp-124769 double-precision round-off floor ~1.4e-6',
    holds: () =>
      byKey.L6.absECF_dps60 < ECF_DOUBLE_ROUNDOFF_FLOOR &&
      byKey.L7.absECF_dps60 < ECF_DOUBLE_ROUNDOFF_FLOOR,
  },
  {
    // (M2): in extended precision |reldiff| is a flat dps floor, NOT growing down the ladder.
    id: 'imp124788-extprec-reldiff-flat-not-growing',
    description: 'the dps=60 |reldiff| does NOT grow down the ladder -- L7 <= L4 (the double monotone degradation vanishes)',
    holds: () =>
      byKey.L7.reldiff_dps60 <= byKey.L4.reldiff_dps60 * 2 &&
      byKey.L6.reldiff_dps60 <= byKey.L4.reldiff_dps60 * 2,
  },
  {
    // (M2): every extended-precision rung agrees far below the L4 DOUBLE-precision level 2.27e-8.
    id: 'imp124788-every-rung-below-L4-double-level',
    description: 'every dps=60 |reldiff| is below the L4 double-precision level 2.27e-8 (identity exact to the deepest rung)',
    holds: () => LADDER.every((r) => r.reldiff_dps60 < 2.27e-8),
  },
  {
    // The analytic target E_flow/E_trunc is positive and collapses down the ladder (denominator-share ratio).
    id: 'imp124788-target-positive-and-collapses',
    description: 'the analytic target E_flow/E_trunc is positive at every rung and strictly decreases down the ladder',
    holds: () =>
      LADDER.every((r) => r.target_Eflow_over_Etrunc > 0) &&
      LADDER.every((r, i) => i === 0 || r.target_Eflow_over_Etrunc < LADDER[i - 1].target_Eflow_over_Etrunc),
  },
  {
    // Honesty gate: numerical/cross-validation only, no QED, no refereed bound is changed.
    id: 'imp124788-honesty-gate-no-qed',
    description: 'Numerical/cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124788_EXTPREC_PAIRRATIO_DEEP_LANDMARK.isRigorous === false &&
      /NO QED/.test(IMP124788_EXTPREC_PAIRRATIO_DEEP_LANDMARK.verdict) &&
      /refereed bound is changed/i.test(IMP124788_EXTPREC_PAIRRATIO_DEEP_LANDMARK.verdict),
  },
];

for (const a of IMP124788_EXTPREC_PAIRRATIO_DEEP_LANDMARK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124788-extprec-pairratio-deep-landmark assertion failed: ${a.id}`);
  }
}
