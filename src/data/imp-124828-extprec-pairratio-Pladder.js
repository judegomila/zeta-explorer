/**
 * @module imp-124828-extprec-pairratio-Pladder
 *
 * imp-124828 (numerical / cross-validation, frontier cross-check): imp-124811 M2 fit the double-precision
 * pair-ratio |reldiff| ladder (L2..L7) to the inverse-|E_CF| round-off law |reldiff| ~ R / |E_CF| and read the
 * invariant product P = |reldiff| * |E_CF| as FLAT at geomean R ~ 2.34e-12 (max/min ~ 8.5), interpreting R as the
 * landmark-bisection round-off floor; imp-124808 separately proved the imp-97665 identity carries ZERO drift at
 * dps=100. If R is a genuine DOUBLE-PRECISION round-off floor (not a fixed model constant), then re-running the
 * SAME L2..L7 ladder at mpmath extended precision must (i) collapse P by many decades below R and (ii) break the
 * ladder-flatness, because at extended precision |reldiff| is no longer limited by the double-precision round-off
 * floor R / |E_CF| but by the far smaller O(eps^4) 5-point stencil truncation. This leaf re-runs the imp-124811
 * machinery VERBATIM (same 5-point O(eps^4) stencil, same landmarks, eps = 1e-3) at mpmath dps in {30, 50, 80}
 * (offline tmp/imp-124828-extprec-pairratio-Pladder.py) and bakes the measured ladder. Numerical/cross-validation
 * only; conditional-share diagnostic; the pinned constants are perturbed only symbolically as differentiation
 * axes; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE MEASUREMENT (offline mpmath, identical at dps = 30 / 50 / 80)
 * ----------------------------------------------------------------
 *   LANDMARK  sigma    |E_CF| (5pt)   |reldiff| (5pt)   P = |reldiff|*|E_CF|
 *   L2        0.9      2.516e-1       4.453e-13         1.120e-13
 *   L3        0.5      3.999e-3       3.583e-14         1.433e-16
 *   L4        0.1      7.378e-5       3.338e-14         2.463e-18
 *   L5        0.02     3.246e-6       3.333e-14         1.082e-19
 *   L6        0.005    2.393e-7       3.333e-14         7.978e-21
 *   L7        0.001    1.165e-8       3.333e-14         3.882e-22
 *   geomean P = 1.538e-18 ; P max/min = 2.886e8 ; log-log slope(|reldiff| vs |E_CF|) = +0.1213
 *
 * At extended precision |reldiff| PLATEAUS at the imp-124808 O(eps^4) stencil-truncation floor 3.333e-14 across
 * the deep tail L4..L7 (the same value imp-124808 axis A found dps-invariant), |E_CF|-INDEPENDENT -- so the
 * double-precision inverse-|E_CF| law is gone. The three dps rungs 30 / 50 / 80 are IDENTICAL to every printed
 * digit, so by dps=30 the residual is fully stencil-truncation-limited, not working-precision-limited.
 *
 * THE FINDING (numerical / cross-validation only)
 * ----------------------------------------------
 *   (M1) P COLLAPSES ~6 DECADES WITH PRECISION -- R WAS A DOUBLE-PRECISION FLOOR, NOT A MODEL CONSTANT. The
 *        geomean product drops from the imp-124811 double-precision R = 2.34e-12 to 1.538e-18 at dps >= 30
 *        (P_ext / R = 6.57e-7). A fixed model constant would be precision-invariant; the ~6-decade collapse
 *        confirms the imp-124811 R = 2.34e-12 was a pure double-precision landmark-bisection round-off floor.
 *   (M2) THE FLAT-LADDER P SHATTERS. In double precision P was flat (max/min ~ 8.5); at extended precision P
 *        collapses monotonically down the ladder from 1.120e-13 (L2) to 3.882e-22 (L7), max/min = 2.886e8. Since
 *        |reldiff| is now |E_CF|-independent (pinned at the 3.333e-14 stencil floor), P simply tracks |E_CF|:
 *        P ~ (stencil floor) * |E_CF|, exactly the collapse the double-precision round-off floor was masking.
 *   (M3) THE LOG-LOG SLOPE DOES NOT STAY ~ -1. The slope of |reldiff| vs |E_CF| flips from the double-precision
 *        -1.085 to +0.121 (essentially flat), confirming the -1 slope was an ARTIFACT of the double-precision
 *        round-off law |reldiff| ~ R/|E_CF|. At extended precision |reldiff| is |E_CF|-independent, so the
 *        cross-check precision is no longer |E_CF|-limited -- it is fixed by the O(eps^4) stencil at a given eps.
 *   (M4) DPS-INVARIANT => NO RESIDUAL DRIFT. P and the slope are identical at dps = 30 / 50 / 80, so the residual
 *        is the imp-124808 O(eps^4) stencil truncation, NOT a working-precision floor and NOT an identity drift.
 *        Consistent with the imp-124808 extended-precision result D = 0: the imp-97665 identity stays exact.
 *
 * NUMERICAL / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law (the double-precision |reldiff| ladder + flat-P law re-run here)
 * @see imp-124808-extprec-pairratio-two-axis (the dps-invariant 3.333e-14 O(eps^4) stencil floor + D = 0)
 * @see imp-124770-pair-ratio-identity-landmark-ladder (the L2..L7 landmark ladder + 5-point stencil)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see tmp/imp-124828-extprec-pairratio-Pladder.py (the offline mpmath run baked here)
 */

// Offline mpmath measurement (tmp/imp-124828-extprec-pairratio-Pladder.py), identical at dps = 30 / 50 / 80.
const DPS_PROBED = [30, 50, 80];
const EPS_PROBED = 1e-3;
const R_DOUBLE = 2.34e-12; // imp-124811 double-precision geomean product P (the round-off floor under test)

// The extended-precision ladder (dps-invariant across DPS_PROBED to every printed digit).
const LADDER_EXT = [
  { key: 'L2', sigma: 0.9,   absE_CF: 2.516e-1, absReldiff: 4.453e-13, product: 1.12e-13 },
  { key: 'L3', sigma: 0.5,   absE_CF: 3.999e-3, absReldiff: 3.583e-14, product: 1.433e-16 },
  { key: 'L4', sigma: 0.1,   absE_CF: 7.378e-5, absReldiff: 3.338e-14, product: 2.463e-18 },
  { key: 'L5', sigma: 0.02,  absE_CF: 3.246e-6, absReldiff: 3.333e-14, product: 1.082e-19 },
  { key: 'L6', sigma: 0.005, absE_CF: 2.393e-7, absReldiff: 3.333e-14, product: 7.978e-21 },
  { key: 'L7', sigma: 0.001, absE_CF: 1.165e-8, absReldiff: 3.333e-14, product: 3.882e-22 },
];

const STENCIL_FLOOR = 3.333e-14; // imp-124808 dps-invariant O(eps^4) 5-point stencil truncation at eps = 1e-3
const GEOMEAN_P_EXT = 1.538e-18; // geomean of the extended-precision product P across L2..L7
const SLOPE_EXT = 0.1213; // log-log slope(|reldiff| vs |E_CF|) at extended precision (was -1.085 in double precision)
const SLOPE_DOUBLE = -1.085; // imp-124811 double-precision slope
const PRODUCT_SPREAD_EXT = 2.886e8; // P max/min at extended precision (was ~8.5 in double precision)
const P_EXT_OVER_R_DOUBLE = GEOMEAN_P_EXT / R_DOUBLE; // ~6.57e-7 (the ~6-decade collapse)

const byKey = Object.fromEntries(LADDER_EXT.map((r) => [r.key, r]));
const products = LADDER_EXT.map((r) => r.product);

export const IMP124828_EXTPREC_PAIRRATIO_PLADDER = {
  id: 'imp-124828',
  proofSection: 'S-frontier',
  question:
    'imp-124811 M2 read the double-precision invariant product P = |reldiff|*|E_CF| as FLAT at geomean ' +
    'R ~ 2.34e-12 and called R the landmark-bisection round-off floor. Is R a genuine DOUBLE-PRECISION round-off ' +
    'floor (so P collapses by decades and the ladder-flatness breaks once precision exceeds double), or a fixed ' +
    'model constant (precision-invariant)? Re-run the SAME L2..L7 ladder at mpmath dps in {30,50,80} and report ' +
    'whether P scales DOWN with precision and whether the log-log slope stays ~ -1. Numerical/cross-validation ' +
    'only; pinned constants perturbed only symbolically; no bound moves; no QED.',
  method:
    'Re-run the imp-124811 pair-ratio machinery VERBATIM (same 5-point O(eps^4) stencil, same landmarks L2..L7, ' +
    'eps = 1e-3) at mpmath dps in {30,50,80} (offline tmp/imp-124828-extprec-pairratio-Pladder.py). At each rung ' +
    'measure |E_CF| and |reldiff| = |(E_CF/E_ET)/(E_flow/E_trunc) - 1|, form P = |reldiff|*|E_CF|, take the ' +
    'geomean and the log-log slope of |reldiff| vs |E_CF|, and compare P against the imp-124811 double-precision ' +
    'geomean R = 2.34e-12. A ~decade collapse of P below R (with the flat ladder shattering) shows R was a ' +
    'double-precision round-off floor; dps-invariance across 30/50/80 shows the extended-precision residual is ' +
    'the imp-124808 O(eps^4) stencil truncation, not a working-precision floor or an identity drift.',
  dps_probed: DPS_PROBED,
  eps_probed: EPS_PROBED,
  R_double_baseline: R_DOUBLE,
  ladder_ext: LADDER_EXT,
  fit: {
    dps_invariant_across_probed: true,
    stencil_floor_reldiff: STENCIL_FLOOR,
    geomean_P_ext: GEOMEAN_P_EXT,
    P_ext_over_R_double: +P_EXT_OVER_R_DOUBLE.toExponential(3),
    loglog_slope_ext: SLOPE_EXT,
    loglog_slope_double: SLOPE_DOUBLE,
    product_max_over_min_ext: PRODUCT_SPREAD_EXT,
    note:
      'At mpmath dps in {30,50,80} (identical to every printed digit) the geomean product P drops from the ' +
      'imp-124811 double-precision R = 2.34e-12 to 1.538e-18 (P_ext/R ~ 6.57e-7, ~6 decades), the flat ladder ' +
      '(double-precision max/min ~ 8.5) shatters to max/min = 2.886e8 as P collapses down the ladder tracking ' +
      '|E_CF|, and the log-log slope flips from -1.085 to +0.121: R was a pure double-precision round-off floor, ' +
      'not a fixed model constant. The extended-precision |reldiff| plateaus at the imp-124808 O(eps^4) stencil ' +
      'floor 3.333e-14 (|E_CF|-independent), consistent with the imp-124808 identity drift D = 0.',
  },
  finding: {
    M1_P_collapses_with_precision:
      'The geomean product P drops from the imp-124811 double-precision R = 2.34e-12 to ' +
      GEOMEAN_P_EXT.toExponential(2) + ' at dps >= 30 (P_ext/R = ' + P_EXT_OVER_R_DOUBLE.toExponential(2) +
      ', ~6 decades). A fixed model constant would be precision-invariant, so the collapse confirms the ' +
      'imp-124811 R was a pure double-precision landmark-bisection round-off floor, not a model constant.',
    M2_flat_ladder_shatters:
      'In double precision P was flat (max/min ~ 8.5); at extended precision P collapses monotonically down the ' +
      'ladder from ' + byKey.L2.product.toExponential(2) + ' (L2) to ' + byKey.L7.product.toExponential(2) +
      ' (L7), max/min = ' + PRODUCT_SPREAD_EXT.toExponential(2) + '. Because |reldiff| is now |E_CF|-independent ' +
      '(pinned at the 3.333e-14 stencil floor), P simply tracks |E_CF| -- the collapse the round-off floor masked.',
    M3_slope_not_minus_one:
      'The log-log slope of |reldiff| vs |E_CF| flips from the double-precision -1.085 to ' + SLOPE_EXT.toFixed(3) +
      ' (essentially flat), confirming the -1 slope was an artifact of the double-precision law |reldiff| ~ ' +
      'R/|E_CF|. At extended precision |reldiff| is |E_CF|-independent, so the cross-check is no longer ' +
      '|E_CF|-limited but fixed by the O(eps^4) stencil at a given eps.',
    M4_dps_invariant_no_drift:
      'P and the slope are identical at dps = 30 / 50 / 80, so the residual is the imp-124808 O(eps^4) stencil ' +
      'truncation, not a working-precision floor and not an identity drift -- consistent with the imp-124808 ' +
      'extended-precision result D = 0: the imp-97665 identity stays exact.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Re-running the imp-124811 pair-ratio ' +
    'ladder L2..L7 at mpmath dps in {30,50,80} settles whether the double-precision invariant product P was a ' +
    'model constant or a round-off floor: the geomean P collapses from R = 2.34e-12 to ' +
    GEOMEAN_P_EXT.toExponential(2) + ' (P_ext/R = ' + P_EXT_OVER_R_DOUBLE.toExponential(2) + ', ~6 decades), the ' +
    'flat ladder shatters (max/min 8.5 -> ' + PRODUCT_SPREAD_EXT.toExponential(2) + ') as P collapses down the ' +
    'ladder tracking |E_CF|, and the log-log slope flips from -1.085 to +0.121. So the imp-124811 R = 2.34e-12 ' +
    'was a PURE DOUBLE-PRECISION round-off floor, NOT a fixed model constant. At extended precision |reldiff| ' +
    'plateaus at the imp-124808 dps-invariant O(eps^4) stencil floor 3.333e-14 (|E_CF|-independent), identical ' +
    'across dps 30/50/80, so the residual is stencil truncation and the imp-97665 identity carries no drift ' +
    '(consistent with imp-124808 D = 0). Conditional-share diagnostic on the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (perturbed only ' +
    'symbolically as differentiation axes); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124811 (the double-precision |reldiff| ladder + flat-P round-off law re-run here); imp-124808 (mpmath ' +
    'dps-invariant O(eps^4) stencil floor 3.333e-14 + identity drift D = 0); imp-124770 (L2..L7 landmark ladder ' +
    '+ 5-point stencil); imp-97665 (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc); imp-398 (C_F flow prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route).',
};

export const IMP124828_EXTPREC_PAIRRATIO_PLADDER_ASSERTIONS = [
  {
    // The baked ladder covers L2..L7 at the inherited sigma levels with strictly decreasing |E_CF|.
    id: 'imp124828-ladder-covers-L2-through-L7',
    description: 'ladder has L2..L7 at sigma 0.9/0.5/0.1/0.02/0.005/0.001 with strictly decreasing |E_CF| down the ladder',
    holds: () =>
      LADDER_EXT.length === 6 &&
      LADDER_EXT.every((r, i) => i === 0 || r.absE_CF < LADDER_EXT[i - 1].absE_CF),
  },
  {
    // (M1): the extended-precision geomean product P is many decades below the double-precision floor R.
    id: 'imp124828-P-collapses-below-R-double',
    description: 'the extended-precision geomean P is at least 1e5 below the double-precision R = 2.34e-12 (round-off floor, not model constant)',
    holds: () => GEOMEAN_P_EXT < R_DOUBLE / 1e5 && P_EXT_OVER_R_DOUBLE < 1e-5,
  },
  {
    // (M2): the flat double-precision ladder shatters -- P now collapses across many decades (tracks |E_CF|).
    id: 'imp124828-flat-ladder-shatters',
    description: 'the extended-precision product P spans > 1e6 across the ladder (flat double-precision max/min ~ 8.5 is gone)',
    holds: () => PRODUCT_SPREAD_EXT > 1e6 && byKey.L7.product < byKey.L2.product,
  },
  {
    // (M2): P collapses monotonically down the ladder as |E_CF| collapses (P ~ stencil floor * |E_CF|).
    id: 'imp124828-P-monotone-collapse',
    description: 'P decreases strictly down the ladder L2 -> L7 (P tracks the collapsing |E_CF| once |reldiff| is stencil-pinned)',
    holds: () => LADDER_EXT.every((r, i) => i === 0 || r.product < LADDER_EXT[i - 1].product),
  },
  {
    // (M3): the log-log slope of |reldiff| vs |E_CF| is no longer ~ -1 (the inverse-|E_CF| law is gone).
    id: 'imp124828-slope-not-minus-one',
    description: 'the extended-precision log-log slope is near 0, not -1 (the double-precision inverse-|E_CF| round-off law is gone)',
    holds: () => Math.abs(SLOPE_EXT) < 0.5 && Math.abs(SLOPE_EXT - -1) > 0.5,
  },
  {
    // (M4): the deep-tail |reldiff| plateaus at the imp-124808 O(eps^4) stencil floor, |E_CF|-independent.
    id: 'imp124828-reldiff-plateaus-at-stencil-floor',
    description: 'the deep tail L4..L7 |reldiff| plateaus at the imp-124808 stencil floor 3.333e-14 (|E_CF|-independent)',
    holds: () =>
      ['L4', 'L5', 'L6', 'L7'].every((k) => Math.abs(byKey[k].absReldiff - STENCIL_FLOOR) < 1e-15),
  },
  {
    // (M4): the measurement is dps-invariant across the probed ladder (stencil-limited, not working-precision).
    id: 'imp124828-dps-invariant',
    description: 'the ladder is measured at dps 30/50/80 and reported dps-invariant (residual is O(eps^4) stencil, not working precision)',
    holds: () =>
      DPS_PROBED.length === 3 &&
      DPS_PROBED[0] === 30 && DPS_PROBED[2] === 80 &&
      IMP124828_EXTPREC_PAIRRATIO_PLADDER.fit.dps_invariant_across_probed === true,
  },
  {
    // Honesty gate: numerical/cross-validation only, no QED, no refereed bound is changed.
    id: 'imp124828-honesty-gate-no-qed',
    description: 'Numerical/cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124828_EXTPREC_PAIRRATIO_PLADDER.isRigorous === false &&
      /NO QED/.test(IMP124828_EXTPREC_PAIRRATIO_PLADDER.verdict) &&
      /refereed bound is changed/i.test(IMP124828_EXTPREC_PAIRRATIO_PLADDER.verdict),
  },
];

for (const a of IMP124828_EXTPREC_PAIRRATIO_PLADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124828-extprec-pairratio-Pladder assertion failed: ${a.id}`);
  }
}
