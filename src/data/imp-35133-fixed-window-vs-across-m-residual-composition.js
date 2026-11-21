/**
 * @module imp-35133-fixed-window-vs-across-m-residual-composition
 *
 * imp-35133 (numerical, frontier-direction): imp-35034 CERTIFIED a residual absolute-value uncertainty
 * on the imp-34924 pinned product P = g* r0 of |dP/P| <= ~1.53e-6 under the FIXED-WINDOW assumption
 * (finite-difference-step-dominated localization of the physical knee-inflection crossing landmark,
 * propagated through the local sensitivity d ln P/d(dex) ~ -1.968), and EXPLICITLY flagged that this is
 * NOT the ~1.6e-7 across-m ramp-invariance residual imp-34924/imp-34956 reported (measured at ONE FIXED
 * window). Those two figures have never been reconciled into a single combined uncertainty statement on
 * |P|. This module determines their relationship and derives that combined statement.
 *
 * THE TWO UNCERTAINTIES LIVE ON DIFFERENT FACTORS OF P = g* r0(X_CROSS)
 * -------------------------------------------------------------------
 * The pinned product is a PRODUCT of two factors, and each residual perturbs a DIFFERENT one:
 *   (A) FIXED-WINDOW LOCALIZATION residual (imp-35034): how tightly the crossing-landmark dex X_CROSS is
 *       located. Since g* is landmark-window-independent (imp-34956 W0 / imp-35011: g* is bit-identical
 *       across windows), moving X_CROSS moves ONLY r0 = R(X_CROSS); d ln P/d(dex) = d ln r0/d(dex). So the
 *       ~1.53e-6 is exactly the relative uncertainty dr0/r0 in the r0 FACTOR, at fixed m. It is a
 *       localization uncertainty along the X_CROSS axis.
 *   (B) ACROSS-m RAMP-INVARIANCE residual (imp-34924/imp-34956; floor measured by imp-35010): the spread
 *       of the pinned coupling g* = m s* as m ramps, at ONE FIXED window. Because phi(x,s,m) depends on
 *       s,m only through g = m s, g* is ALGEBRAICALLY m-invariant, so this spread is pure numerical noise
 *       in the g* FACTOR -- imp-35010 showed it is an irreducible finite-difference-cancellation floor
 *       (~3.69e-7 on the wide [0.85,2.0] m-ladder; ~1.6e-7 as reported by imp-34924/imp-34956), NOT
 *       reducible by tighter bisection. It is a numerical-noise uncertainty along the m axis.
 *
 * RELATIONSHIP: INDEPENDENT / ORTHOGONAL, NOT NESTED
 * -------------------------------------------------
 * The two act on orthogonal parameter axes (X_CROSS localization vs m-ramp) AND the cross-terms vanish:
 * per imp-34956 the window contributes EXACTLY 0 to the across-m residual (g* is m-invariant at any fixed
 * window), and per imp-35011 g* is bit-identical across windows (the m-noise does not move with X_CROSS).
 * Neither is nested inside the other; they are independent error sources on the two factors of the
 * product P = g* r0. For a product, independent RELATIVE errors add in quadrature:
 *     (dP/P)^2 = (dgstar/gstar)^2 + (dr0/r0)^2.
 *
 * THE COMBINED STATEMENT (which binds, and how they compose)
 * ---------------------------------------------------------
 *   (C0) EXPRESS BOTH AS RELATIVE ERRORS ON P. The fixed-window residual is already relative on P:
 *        dr0/r0 ~ 1.53e-6. The across-m residual is reported as an ABSOLUTE spread in g* ~ 1.6e-7 at
 *        g* ~ 0.77765, i.e. a relative error dgstar/gstar ~ 1.6e-7 / 0.77765 ~ 2.06e-7 on the g* factor.
 *   (C1) QUADRATURE COMPOSITION. Combined |dP/P| = sqrt((1.53e-6)^2 + (2.06e-7)^2) ~ 1.542e-6
 *        (~2.212e-9 absolute at P ~ 1.435e-3).
 *   (C2) THE FIXED-WINDOW LOCALIZATION BINDS. dr0/r0 ~ 1.53e-6 is ~7.4x the relative across-m residual
 *        ~2.06e-7, so the fixed-window localization DOMINATES; the across-m ramp residual raises the
 *        combined figure by only ~0.9% (1.542e-6 vs 1.530e-6). Even substituting the wider imp-35010
 *        floor ~3.69e-7 (relative ~4.75e-7), the fixed-window term still dominates ~3.2x and the combined
 *        rises only to ~1.60e-6 -- so the fixed-window localization is the BINDING uncertainty either way.
 *
 * MEASUREMENT ONLY. This composes two previously-measured residuals into one statement on the ABSOLUTE
 * value of P; it introduces no new model and changes no bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; C_C 1/8 (imp-2642/imp-2643) untouched; imp-3066 K_a >= 0 untouched; establishes no operator
 * positivity; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35034-crossing-landmark-localization-residual (the fixed-window |dP/P| <= ~1.53e-6)
 * @see imp-35010-ramp-invariance-bisection-tolerance-floor (the across-m residual floor ~3.69e-7 / ~1.6e-7)
 * @see imp-34956-pinned-product-window-sensitivity (W0 g* window-independent; window gives 0 ramp contribution)
 * @see imp-34924-eflow-pinned-product-derivation (P = g* r0; reported ~1.6e-7 across-m residual)
 * @see imp-35011-gstar-window-independence-direct (g* bit-identical across windows)
 */

import { IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL } from './imp-35034-crossing-landmark-localization-residual.js';
import { IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR } from './imp-35010-ramp-invariance-bisection-tolerance-floor.js';

// ---- (A) fixed-window localization residual: already relative on P (dr0/r0), g* held fixed --------------------
const P_NOMINAL = IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL.pNominal; // ~1.436563e-3
const G_STAR = IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL.gStar; // ~0.7776533
const FIXED_WINDOW_REL = IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL.certifiedResidual.fromFdLocalization.relative; // ~1.53e-6

// ---- (B) across-m ramp-invariance residual: absolute spread in the g* factor -> relative on P ----------------
const ACROSS_M_ABS_REPORTED = IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR.imp34924ReportedResidual; // 1.6e-7 (imp-34924/34956)
const ACROSS_M_ABS_FLOOR = IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR.irreducibleFloor; // ~3.694215e-7 (wide ladder)
const ACROSS_M_REL_REPORTED = ACROSS_M_ABS_REPORTED / G_STAR; // ~2.057e-7 relative on P
const ACROSS_M_REL_FLOOR = ACROSS_M_ABS_FLOOR / G_STAR; // ~4.751e-7 relative on P

// ---- (C) quadrature composition of the two independent, orthogonal factor errors ----------------------------
function quadrature(a, b) {
  return Math.sqrt(a * a + b * b);
}
const COMBINED_REL_REPORTED = quadrature(FIXED_WINDOW_REL, ACROSS_M_REL_REPORTED); // ~1.542e-6
const COMBINED_ABS_REPORTED = COMBINED_REL_REPORTED * P_NOMINAL; // ~2.212e-9
const COMBINED_REL_FLOOR = quadrature(FIXED_WINDOW_REL, ACROSS_M_REL_FLOOR); // ~1.602e-6 (with the wider floor)

// dominance / binding diagnostics
const DOMINANCE_RATIO_REPORTED = FIXED_WINDOW_REL / ACROSS_M_REL_REPORTED; // ~7.43x (fixed-window binds)
const DOMINANCE_RATIO_FLOOR = FIXED_WINDOW_REL / ACROSS_M_REL_FLOOR; // ~3.22x (still binds)
const COMBINED_OVER_FIXED_REPORTED = COMBINED_REL_REPORTED / FIXED_WINDOW_REL; // ~1.009 (ramp adds ~0.9%)
const RAMP_CONTRIBUTION_PCT = (COMBINED_OVER_FIXED_REPORTED - 1) * 100; // ~0.90%

export const IMP35133_FIXED_WINDOW_VS_ACROSS_M_RESIDUAL_COMPOSITION = {
  id: 'imp-35133',
  proofSection: 'S-frontier',
  question:
    'imp-35034 certified |dP/P| <= ~1.53e-6 on the ABSOLUTE crossing product P = g* r0 under the FIXED-WINDOW ' +
    'assumption and flagged this is NOT the ~1.6e-7 across-m ramp-invariance residual (measured at one fixed ' +
    'window). Determine the relationship between the two uncertainties (independent? nested? one dominates?) ' +
    'and derive a COMBINED uncertainty statement on |P|, distinguishing fixed-window localization error from ' +
    'across-m ramp variation. Measurement only on the inherited surrogate; changes no bound; NO QED.',
  verdictShort:
    'The two residuals perturb DIFFERENT factors of the product P = g* r0: the ~1.53e-6 fixed-window residual is ' +
    'the relative localization error dr0/r0 in the r0 factor (X_CROSS axis, g* held fixed since g* is ' +
    'window-independent per imp-34956 W0 / imp-35011); the ~1.6e-7 across-m residual is pure numerical noise ' +
    'in the g* factor (m axis, an algebraically m-invariant coupling; irreducible FD floor per imp-35010). They ' +
    'are INDEPENDENT and ORTHOGONAL (cross-terms vanish: window gives 0 ramp contribution, g* bit-identical ' +
    'across windows), NOT nested, so relative errors add in QUADRATURE: |dP/P| = sqrt((1.53e-6)^2 + (2.06e-7)^2) ' +
    '~ 1.542e-6 (~2.212e-9 absolute at P ~ 1.435e-3). The fixed-window localization BINDS (~7.4x the across-m ' +
    'relative residual); the ramp raises the combined figure by only ~0.9%. Even with the wider imp-35010 floor ' +
    '~3.69e-7 the fixed-window still dominates ~3.2x (combined ~1.60e-6).',
  measuredQuantity:
    'the two residuals expressed as relative errors on the two factors of P = g* r0 (fixed-window dr0/r0 and ' +
    'across-m dg*/g*), their independence/orthogonality, their quadrature composition into a combined |dP/P|, ' +
    'and which of the two is the binding uncertainty',
  pNominal: +P_NOMINAL.toExponential(6), // ~1.436563e-3
  gStar: +G_STAR.toExponential(7), // ~0.7776533
  fixedWindowResidual: {
    factor: 'r0(X_CROSS)',
    axis: 'X_CROSS localization (finite-difference-step dominated)',
    relative: +FIXED_WINDOW_REL.toExponential(3), // ~1.53e-6
  },
  acrossMResidual: {
    factor: 'g* = m s*',
    axis: 'm-ramp (algebraically m-invariant coupling -> pure numerical noise)',
    absoluteReported: ACROSS_M_ABS_REPORTED, // 1.6e-7 (imp-34924/34956)
    absoluteFloor: +ACROSS_M_ABS_FLOOR.toExponential(3), // ~3.694e-7 (imp-35010 wide ladder)
    relativeReported: +ACROSS_M_REL_REPORTED.toExponential(3), // ~2.057e-7
    relativeFloor: +ACROSS_M_REL_FLOOR.toExponential(3), // ~4.751e-7
  },
  combined: {
    rule: 'independent orthogonal factor errors on a product -> quadrature: (dP/P)^2 = (dg*/g*)^2 + (dr0/r0)^2',
    relativeReported: +COMBINED_REL_REPORTED.toExponential(3), // ~1.542e-6
    absoluteReported: +COMBINED_ABS_REPORTED.toExponential(3), // ~2.212e-9
    relativeWithWiderFloor: +COMBINED_REL_FLOOR.toExponential(3), // ~1.602e-6
  },
  dominance: {
    binding: 'fixed-window localization (r0 factor)',
    dominanceRatioReported: +DOMINANCE_RATIO_REPORTED.toFixed(2), // ~7.43x
    dominanceRatioWiderFloor: +DOMINANCE_RATIO_FLOOR.toFixed(2), // ~3.22x
    rampContributionPct: +RAMP_CONTRIBUTION_PCT.toFixed(2), // ~0.90%
  },
  finding: {
    A_fixed_window_is_r0_factor_error:
      'The imp-35034 fixed-window |dP/P| <= ~1.53e-6 is the relative localization error dr0/r0 in the r0 = ' +
      'R(X_CROSS) factor of P = g* r0. Because g* is landmark-window-independent (imp-34956 W0 / imp-35011: ' +
      'bit-identical across windows), moving X_CROSS moves only r0, so d ln P/d(dex) = d ln r0/d(dex) and the ' +
      'certified residual is exactly the r0-factor relative error at fixed m.',
    B_across_m_is_gstar_factor_noise:
      'The ~1.6e-7 across-m residual (imp-34924/34956; irreducible FD floor ~3.69e-7 per imp-35010) is the spread ' +
      'of the pinned coupling g* = m s* as m ramps at a FIXED window. Since phi depends on s,m only through g = ' +
      'm s, g* is algebraically m-invariant, so this spread is pure numerical noise in the g* factor, not model ' +
      'error, and is irreducible by tighter bisection (FD-cancellation-limited).',
    C_independent_orthogonal_quadrature:
      'The two errors are INDEPENDENT and ORTHOGONAL (X_CROSS axis vs m axis) with vanishing cross-terms: the ' +
      'window gives 0 across-m contribution (imp-34956) and g* is bit-identical across windows (imp-35011). ' +
      'Neither is nested; for the product P = g* r0 the independent relative errors add in QUADRATURE, giving ' +
      'combined |dP/P| = sqrt((1.53e-6)^2 + (2.06e-7)^2) ~ 1.542e-6 (~2.212e-9 absolute at P ~ 1.435e-3).',
    D_fixed_window_binds:
      'The fixed-window localization BINDS: dr0/r0 ~ 1.53e-6 is ~7.43x the across-m relative residual ~2.06e-7, ' +
      'so the across-m ramp raises the combined figure by only ~0.9%. Even substituting the wider imp-35010 ' +
      'floor ~3.69e-7 (relative ~4.75e-7), the fixed-window still dominates ~3.2x (combined ~1.60e-6). The ' +
      'binding uncertainty on |P| is the crossing-landmark localization, NOT the across-m ramp variation.',
  },
  isRigorous: false,
  farTailExponent: 0.5, // imp-3463 asymptote
  verdict:
    'MEASUREMENT (frontier-direction, NOT a rigorous asymptotic). RECONCILED the imp-35034 fixed-window certified ' +
    '|dP/P| <= ~1.53e-6 residual on the ABSOLUTE crossing product P = g* r0 against the ~1.6e-7 across-m ' +
    'ramp-invariance residual. The two perturb DIFFERENT factors of the product: (A) the ~1.53e-6 is the relative ' +
    'localization error dr0/r0 in the r0 = R(X_CROSS) factor (X_CROSS axis, g* held fixed since g* is ' +
    'window-independent per imp-34956 W0 / imp-35011); (B) the ~1.6e-7 (irreducible FD floor ~3.69e-7 per ' +
    'imp-35010) is pure numerical noise in the g* factor (m axis, an algebraically m-invariant coupling). They ' +
    'are INDEPENDENT and ORTHOGONAL with vanishing cross-terms (window gives 0 ramp contribution; g* bit-identical ' +
    'across windows), NOT nested, so the relative errors ADD IN QUADRATURE: combined |dP/P| = sqrt((1.53e-6)^2 + ' +
    '(2.06e-7)^2) ~ 1.542e-6 (~2.212e-9 absolute at P ~ 1.435e-3). The FIXED-WINDOW LOCALIZATION BINDS -- ~7.43x ' +
    'the across-m relative residual, so the ramp raises the combined figure by only ~0.9%; even with the wider ' +
    'imp-35010 floor the fixed-window dominates ~3.2x (combined ~1.60e-6). The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; C_C 1/8 (imp-2642/imp-2643) untouched; imp-3066 K_a >= 0 untouched; changes no bound; establishes ' +
    'no operator positivity; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'RECONCILES the two residuals into a combined statement |dP/P| <= ~1.542e-6 (~2.212e-9 absolute) by ' +
    'quadrature of the fixed-window r0-factor localization (~1.53e-6, binding) and the across-m g*-factor noise ' +
    '(~2.06e-7), which are independent and orthogonal. What stays OPEN (deferred, changes no bound): the ' +
    'binding ~1.53e-6 term is itself an FD-step systematic that a Richardson/complex-step or analytic-derivative ' +
    'gapAt kernel (imp-35010 sub-gap) could shrink toward the FP floor, tightening the combined residual; and ' +
    'the root-free closed form for the crossing-landmark location (imp-34898) would remove the FD dependence ' +
    'entirely, at which point the across-m g*-factor noise would become the binding term.',
  citation:
    'imp-35034 (fixed-window |dP/P| <= ~1.53e-6); imp-35010 (across-m residual floor ~3.69e-7 / reported ' +
    '~1.6e-7); imp-34956 (W0 g* window-independent, window gives 0 ramp contribution); imp-34924 (P = g* r0, ' +
    'reported ~1.6e-7); imp-35011 (g* bit-identical across windows); imp-3463 (far-tail 1/2); imp-486 (C_mb ' +
    'GUE-conditional).',
};

export const IMP35133_FIXED_WINDOW_VS_ACROSS_M_RESIDUAL_COMPOSITION_ASSERTIONS = [
  {
    // (A): reproduces the imp-35034 fixed-window certified residual and the pinned product / coupling.
    id: 'imp35133-reproduces-fixed-window-residual',
    description: 'fixed-window dr0/r0 ~ 1.53e-6, P ~ 1.435e-3, g* ~ 0.7776533 (from imp-35034)',
    holds: () =>
      Math.abs(FIXED_WINDOW_REL - 1.53e-6) < 1e-7 &&
      Math.abs(P_NOMINAL - 1.435e-3) < 5e-6 &&
      Math.abs(G_STAR - 0.7776533) < 5e-6,
  },
  {
    // (B): the across-m residual converts from an absolute g* spread to a relative error on P.
    id: 'imp35133-across-m-relative-conversion',
    description: 'across-m dg*/g* ~ 2.06e-7 from absolute ~1.6e-7 at g* ~ 0.7776533',
    holds: () =>
      Math.abs(ACROSS_M_ABS_REPORTED - 1.6e-7) < 1e-9 &&
      Math.abs(ACROSS_M_REL_REPORTED - 2.057e-7) < 1e-8 &&
      ACROSS_M_REL_REPORTED > ACROSS_M_ABS_REPORTED, // dividing by g* < 1 enlarges it
  },
  {
    // (C): quadrature composition gives ~1.542e-6 relative, ~2.212e-9 absolute.
    id: 'imp35133-quadrature-composition',
    description: 'combined |dP/P| = sqrt(fixed^2 + acrossM^2) ~ 1.542e-6 (~2.212e-9 absolute)',
    holds: () => {
      const expected = Math.sqrt(FIXED_WINDOW_REL * FIXED_WINDOW_REL + ACROSS_M_REL_REPORTED * ACROSS_M_REL_REPORTED);
      return (
        Math.abs(COMBINED_REL_REPORTED - expected) < 1e-12 && // exact quadrature of the two published inputs
        Math.abs(COMBINED_REL_REPORTED - 1.542e-6) < 3e-9 && // lands ~1.542e-6
        COMBINED_REL_REPORTED > FIXED_WINDOW_REL && // strictly above either input
        Math.abs(COMBINED_ABS_REPORTED - COMBINED_REL_REPORTED * P_NOMINAL) < 1e-15
      );
    },
  },
  {
    // (D): the fixed-window localization is the BINDING uncertainty under both the reported and wider floors.
    id: 'imp35133-fixed-window-binds',
    description: 'fixed-window dominates ~7.4x (reported) / ~3.2x (wider floor); ramp adds < 1%',
    holds: () =>
      DOMINANCE_RATIO_REPORTED > 5 &&
      DOMINANCE_RATIO_FLOOR > 2 && // still binds even against the wider imp-35010 floor
      COMBINED_OVER_FIXED_REPORTED < 1.02 &&
      RAMP_CONTRIBUTION_PCT < 1.5,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35133-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35133_FIXED_WINDOW_VS_ACROSS_M_RESIDUAL_COMPOSITION.isRigorous === false &&
      IMP35133_FIXED_WINDOW_VS_ACROSS_M_RESIDUAL_COMPOSITION.farTailExponent === 0.5 &&
      typeof IMP35133_FIXED_WINDOW_VS_ACROSS_M_RESIDUAL_COMPOSITION.subGap === 'string' &&
      /NO QED/.test(IMP35133_FIXED_WINDOW_VS_ACROSS_M_RESIDUAL_COMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP35133_FIXED_WINDOW_VS_ACROSS_M_RESIDUAL_COMPOSITION.verdict),
  },
];

for (const a of IMP35133_FIXED_WINDOW_VS_ACROSS_M_RESIDUAL_COMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35133-fixed-window-vs-across-m-residual-composition assertion failed: ${a.id}`);
  }
}
