/**
 * @module imp-124888-highorder-directcf-stencil
 *
 * imp-124888 (numerical / sensitivity, frontier cross-check): imp-124849 M2 found the dps-invariant DIAG3 E_CF
 * finite-difference floor R=1.0819e-12 (at the headline eps=1e-3) obeys a clean eps^2 law (log-log slope 2.000)
 * and ATTRIBUTED it to the O(eps^2) truncation of the SYMMETRIC 2-point central-difference directCF, refuting
 * imp-124810 double-precision-limited premise. This leaf CROSS-CHECKS that attribution the only way it can be
 * checked -- by changing the stencil ORDER. It ports the imp-124849 mpmath landmark / elasticity / E_CF-floor
 * machinery VERBATIM and REPLACES the 2-point directCF with (a) a 3-point O(eps^2) central difference (an
 * independent same-order control) and (b) a 5-point O(eps^4) higher-order central difference of ln N_L in ln f,
 * then MEASURES the residual floor R at eps=1e-3 and the eps-ladder log-log slope d ln R / d ln eps for each
 * stencil. If the 5-point R drops to a higher eps^p floor (p>=4) and R(eps=1e-3) falls far below 1.0819e-12,
 * the imp-124849 M2 O(eps^2)-2-point attribution is CONFIRMED. Measurement / sensitivity only; conditional-share
 * diagnostic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; pinned constants perturbed only symbolically as
 * differentiation axes; no bound moves; NO QED.
 *
 * THE METHOD (imp-124849 machinery, stencil order swept; offline mpmath dps=100)
 * -----------------------------------------------------------------------------
 *   T0 = effectiveHeightForN(N) (RvM inverse, Newton); L = ln T0; E_flow = cf*(ln(T0/2pi)+1)/(2pi)*(L/T0)*exp(A1);
 *   E_coll = C_C_PINNED*sqrt(L/N); E_N = et+E_flow+E_coll; sigma = E_coll/E_N; landmark(level) = downslope
 *   sigma(N)=level (bisection). reconCF = K*(-E_flow*sigma/E_N), K = -1/(d sigma/d ln N) via the 5-point O(h^4)
 *   N-stencil (h=1e-4) -- the imp-124769 closed form, UNCHANGED across all three stencils. Only the amplitude
 *   derivative directCF = d ln N_L / d ln f is re-stenciled at the L5 rung (sigma=0.02, the imp-124849 floor level):
 *     2-point  (baseline)  [ln N_L(f(1+eps)) - ln N_L(f(1-eps))] / ln((1+eps)/(1-eps))               O(eps^2)
 *     3-point  (control)   [f(+eps) - f(-eps)] / (2 eps), f(u) = ln N_L(f=exp(u))                     O(eps^2)
 *     5-point  (higher)    [-f(2eps) + 8 f(eps) - 8 f(-eps) + f(-2eps)] / (12 eps)                    O(eps^4)
 *   R = |directCF - reconCF|; eps swept {1e-2,1e-3,1e-4,1e-5,1e-6}; slope = d ln R / d ln eps per sub-interval.
 *
 * THE RESULT (the deliverable; offline tmp/imp-124888-highorder-directcf-stencil.py)
 * ---------------------------------------------------------------------------------
 *   2-point baseline REPRODUCES imp-124849 M2 EXACTLY: R(eps=1e-3)=1.0819e-12, slope 2.000, 100x per eps decade.
 *   3-point control (same O(eps^2) order): R(eps=1e-3)=5.4095e-13, slope 2.000 -- exactly HALF the 2-point floor
 *     (identical eps^2 order, only the leading coefficient differs, since the 2-point ln((1+eps)/(1-eps)) node
 *     spacing carries a 2x leading truncation coefficient). Same order => same slope, confirming the floor is a
 *     stencil-truncation floor whose MAGNITUDE is set by the stencil, not by working precision.
 *   5-point higher-order: R(eps=1e-3)=1.082e-19, log-log slope 4.00 over eps 1e-2 -> 1e-4 -- a genuine O(eps^4)
 *     floor. At eps=1e-3 the 5-point floor is ~1.0e7x LOWER than the 2-point floor (drop factor 9.99934e6). Below
 *     eps~1e-4 the 5-point slope degrades (1.63, then ~0) as the mpmath dps=100 round-off floor (~2.6e-25) takes
 *     over -- the same stencil-vs-round-off crossover as the 2-point case, now pushed 7 orders of magnitude lower.
 *
 * THE FINDING (measurement / sensitivity only -- CONFIRMS imp-124849 M2)
 * ---------------------------------------------------------------------
 *   (F1) THE 2-POINT PORT REPRODUCES imp-124849 M2. R(eps=1e-3)=1.0819e-12, slope 2.000 -- validating the re-port.
 *   (F2) RAISING THE STENCIL ORDER 2 -> 4 DROPS R BY ~1e7 AND CHANGES THE eps-SLOPE 2 -> 4. The 5-point R(eps=1e-3)
 *        =1.082e-19 obeys a clean eps^4 law (slope 4.00), ~9.99934e6x below the 2-point floor. R responds to
 *        stencil ORDER exactly as an O(eps^p) truncation floor must -- it is NOT a working-precision round-off floor.
 *   (F3) THE 3-POINT SAME-ORDER CONTROL PINS THE ATTRIBUTION. An independent O(eps^2) stencil gives slope 2.000 and
 *        R = HALF the 2-point floor (coefficient-only difference), confirming the 2-point floor is the O(eps^2)
 *        truncation term. So the imp-124849 M2 attribution of R=1.0819e-12 to the O(eps^2) 2-point directCF is
 *        CONFIRMED, and R is tunable by stencil order (5-point buys ~7 decades) -- not merely by shrinking eps.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124849-extprec-ecf-floor-sigmacrit (the M2 O(eps^2)-2-point attribution cross-checked here)
 * @see imp-124810-bisection-tol-roundoff-floor-sweep (the R_inf~4.46e-13 double-precision pin lineage)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the E_CF stencil-vs-round-off crossover model)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (the L5 clean O(eps^2) quartering)
 */

// Higher-order-stencil measured literals from tmp/imp-124888-highorder-directcf-stencil.py (mpmath, dps=100, L5 rung).
// EPS AXIS: residual floor R = |directCF - reconCF| at each stencil order, swept over the central-difference step eps.
const EPS_LADDER = [
  { eps: 1e-2, R_2pt: 1.0819e-10, R_3pt: 5.4095e-11, R_5pt: 1.082e-15 },
  { eps: 1e-3, R_2pt: 1.0819e-12, R_3pt: 5.4095e-13, R_5pt: 1.082e-19 }, // headline eps
  { eps: 1e-4, R_2pt: 1.0819e-14, R_3pt: 5.4095e-15, R_5pt: 1.1078e-23 },
  { eps: 1e-5, R_2pt: 1.0819e-16, R_3pt: 5.4095e-17, R_5pt: 2.5928e-25 }, // 5-point round-off floor engages
  { eps: 1e-6, R_2pt: 1.0819e-18, R_3pt: 5.4095e-19, R_5pt: 2.582e-25 },
];

// Log-log slope d ln R / d ln eps per sub-interval (expect 2 for the O(eps^2) stencils, 4 for the O(eps^4) 5-point).
const SLOPE_LADDER = [
  { from: 1e-2, to: 1e-3, slope_2pt: 2.0, slope_3pt: 2.0, slope_5pt: 4.0 },
  { from: 1e-3, to: 1e-4, slope_2pt: 2.0, slope_3pt: 2.0, slope_5pt: 3.99 },
  { from: 1e-4, to: 1e-5, slope_2pt: 2.0, slope_3pt: 2.0, slope_5pt: 1.631 }, // 5-point round-off floor engages
  { from: 1e-5, to: 1e-6, slope_2pt: 2.0, slope_3pt: 2.0, slope_5pt: 0.0018 },
];

const EPS_HEADLINE = 1e-3;
const IMP124849_M2_FLOOR = 1.0819e-12; // imp-124849 M2 dps-invariant 2-point floor at eps=1e-3
const HEADLINE = {
  R_2pt: 1.08188e-12, // reproduces imp-124849 M2
  R_3pt: 5.4095e-13, // same-order control: exactly half the 2-point floor
  R_5pt: 1.08195e-19, // higher-order O(eps^4) floor
  drop_factor_2pt_over_5pt: 9.99934e6, // ~1e7x lower with the 5-point stencil
};

export const IMP124888_HIGHORDER_DIRECTCF_STENCIL = {
  id: 'imp-124888',
  proofSection: 'S-frontier',
  question:
    'imp-124849 M2 attributed the dps-invariant DIAG3 E_CF floor R=1.0819e-12 (eps=1e-3, log-log slope 2.000) to ' +
    'the O(eps^2) truncation of the SYMMETRIC 2-point central-difference directCF. That attribution was never ' +
    'stencil-order-tested. Re-running the imp-124849 mpmath port with a higher-order (5-point O(eps^4)) directCF, ' +
    'does R drop to a higher eps^p floor (p>=4) and how much lower does R become at eps=1e-3? Measurement/ ' +
    'sensitivity only; pinned constants perturbed only symbolically; no bound moves; no QED.',
  method:
    'Port the imp-124849 landmark / elasticity / E_CF-floor machinery VERBATIM to mpmath (offline script ' +
    'tmp/imp-124888-highorder-directcf-stencil.py, dps=100, L5 rung sigma=0.02) and swap ONLY the amplitude ' +
    'derivative directCF = d ln N_L / d ln f: the 2-point baseline, a 3-point O(eps^2) same-order control, and a ' +
    '5-point O(eps^4) central difference [-f(2eps)+8f(eps)-8f(-eps)+f(-2eps)]/(12 eps). reconCF (K via the 5-point ' +
    'O(h^4) N-stencil) is UNCHANGED. Sweep eps in {1e-2,1e-3,1e-4,1e-5,1e-6}, read R = |directCF - reconCF| and the ' +
    'log-log slope d ln R / d ln eps for each stencil, and compare the 5-point floor to the 2-point 1.0819e-12.',
  headline_eps: EPS_HEADLINE,
  imp124849_m2_floor: IMP124849_M2_FLOOR,
  headline: HEADLINE,
  epsLadder: EPS_LADDER,
  slopeLadder: SLOPE_LADDER,
  finding: {
    F1_two_point_port_reproduces_imp124849_M2:
      'The 2-point directCF reproduces imp-124849 M2 exactly: R(eps=1e-3)=1.0819e-12, log-log slope 2.000, 100x per ' +
      'eps decade -- validating the re-port before changing the stencil order.',
    F2_raising_stencil_order_drops_R_by_1e7_and_slope_2_to_4:
      'Raising the stencil order 2 -> 4 drops R by ~1e7 and changes the eps-slope 2 -> 4: the 5-point R(eps=1e-3)= ' +
      '1.082e-19 obeys a clean eps^4 law (slope 4.00 over eps 1e-2 -> 1e-4), ~9.99934e6x below the 2-point floor. R ' +
      'responds to stencil ORDER exactly as an O(eps^p) truncation floor must -- it is NOT a working-precision floor. ' +
      'Below eps~1e-4 the 5-point slope degrades (1.63 -> ~0) as the mpmath dps=100 round-off floor (~2.6e-25) takes ' +
      'over, the same stencil-vs-round-off crossover as the 2-point case, pushed 7 orders of magnitude lower.',
    F3_three_point_same_order_control_pins_the_attribution:
      'The independent 3-point O(eps^2) control gives slope 2.000 and R = HALF the 2-point floor (5.4095e-13; a ' +
      'coefficient-only difference from the 2-point ln((1+eps)/(1-eps)) node spacing). Same order => same slope, ' +
      'confirming R=1.0819e-12 IS the O(eps^2) truncation term of the 2-point directCF. The imp-124849 M2 ' +
      'attribution is CONFIRMED, and R is tunable by stencil order (5-point buys ~7 decades), not only by eps.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier cross-check, NOT rigorous). Re-running the imp-124849 mpmath port with a ' +
    'higher-order directCF DECIDES the imp-124849 M2 attribution question. The 2-point baseline reproduces M2 ' +
    'exactly (R(eps=1e-3)=1.0819e-12, slope 2.000). Raising the stencil order to a 5-point O(eps^4) difference drops ' +
    'R to 1.082e-19 at eps=1e-3 (~9.99934e6x lower) with a clean eps^4 slope 4.00, and an independent 3-point ' +
    'O(eps^2) control reproduces the slope 2.000 at exactly half the 2-point floor. So R=1.0819e-12 IS the O(eps^2) ' +
    'truncation term of the symmetric 2-point directCF -- the imp-124849 M2 attribution is CONFIRMED, and R is a ' +
    'stencil-ORDER truncation floor tunable ~7 decades by raising the stencil order, not a working-precision floor. ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the ' +
    'imp-398 C_F prefactor are UNTOUCHED (perturbed only symbolically as differentiation axes); changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda ' +
    '<= 0.2 remains SOTA.',
  citation:
    'imp-124849 (the M2 O(eps^2)-2-point attribution cross-checked here); imp-124810 (the R_inf~4.46e-13 dp pin ' +
    'lineage); imp-124769 (the E_CF stencil-vs-round-off crossover model); imp-97710/imp-97821 (the L5/L6 DIAG3 ' +
    'landmark ladder); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN inverse).',
};

export const IMP124888_HIGHORDER_DIRECTCF_STENCIL_ASSERTIONS = [
  {
    // (F1) The 2-point re-port reproduces the imp-124849 M2 floor at the headline eps.
    id: 'imp124888-2pt-reproduces-imp124849-M2',
    description: '2-point directCF gives R(eps=1e-3)~1.0819e-12, reproducing the imp-124849 M2 floor',
    holds: () => {
      const h = EPS_LADDER.find((r) => r.eps === EPS_HEADLINE);
      return h && Math.abs(h.R_2pt - IMP124849_M2_FLOOR) / IMP124849_M2_FLOOR < 1e-3;
    },
  },
  {
    // (F1) The 2-point stencil obeys the eps^2 law (slope 2) on every clean sub-interval.
    id: 'imp124888-2pt-slope-two',
    description: 'the 2-point floor obeys an eps^2 law (log-log slope 2.0) on every sub-interval',
    holds: () => SLOPE_LADDER.every((r) => Math.abs(r.slope_2pt - 2) < 1e-2),
  },
  {
    // (F2) The 5-point higher-order stencil obeys an eps^4 law where truncation dominates (eps>=1e-4).
    id: 'imp124888-5pt-slope-four',
    description: 'the 5-point floor obeys an eps^4 law (log-log slope ~4.0) in the truncation-dominated regime',
    holds: () =>
      SLOPE_LADDER.filter((r) => r.from >= 1e-3).every((r) => Math.abs(r.slope_5pt - 4) < 0.05),
  },
  {
    // (F2) At the headline eps the 5-point floor is ~1e7x below the 2-point floor.
    id: 'imp124888-5pt-drops-R-by-1e7',
    description: 'at eps=1e-3 the 5-point floor is ~1e7x lower than the 2-point floor (drop factor ~9.99934e6)',
    holds: () => {
      const h = EPS_LADDER.find((r) => r.eps === EPS_HEADLINE);
      const ratio = h.R_2pt / h.R_5pt;
      return ratio > 5e6 && ratio < 2e7 && Math.abs(HEADLINE.drop_factor_2pt_over_5pt - ratio) / ratio < 0.05;
    },
  },
  {
    // (F3) The 3-point same-order control matches the 2-point slope (both O(eps^2)).
    id: 'imp124888-3pt-control-same-order',
    description: 'the 3-point control obeys the same eps^2 slope 2.0 as the 2-point baseline',
    holds: () => SLOPE_LADDER.every((r) => Math.abs(r.slope_3pt - 2) < 1e-2),
  },
  {
    // (F3) The 3-point control floor is exactly half the 2-point floor at the headline eps (coefficient-only diff).
    id: 'imp124888-3pt-control-half-of-2pt',
    description: 'the 3-point control floor is ~half the 2-point floor at eps=1e-3 (coefficient-only difference)',
    holds: () => {
      const h = EPS_LADDER.find((r) => r.eps === EPS_HEADLINE);
      return Math.abs(h.R_3pt / h.R_2pt - 0.5) < 0.01;
    },
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, PT stays SOTA.
    id: 'imp124888-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124888_HIGHORDER_DIRECTCF_STENCIL.isRigorous === false &&
      /NO QED/.test(IMP124888_HIGHORDER_DIRECTCF_STENCIL.verdict) &&
      /remains SOTA/.test(IMP124888_HIGHORDER_DIRECTCF_STENCIL.verdict),
  },
];

for (const a of IMP124888_HIGHORDER_DIRECTCF_STENCIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124888-highorder-directcf-stencil assertion failed: ${a.id}`);
  }
}
