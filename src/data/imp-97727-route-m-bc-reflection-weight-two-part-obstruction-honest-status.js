/**
 * @module imp-97727-route-m-bc-reflection-weight-two-part-obstruction-honest-status
 *
 * imp-97727 (content, sonnet-4-6, sonnet): standalone honest-status note recording the imp-97701
 * two-part obstruction to pinning the Bettin-Conrey reflection weight W_refl.
 *
 * BACKGROUND. imp-97681 factored the period coefficient kappaK_period = rho_refl * W_refl with the
 * gamma half rho_refl = N(3)/N(1) = 1/(2 pi^2) pinned, and divided the imp-97663 no-cancellation cap
 * |kappaK_period| <~ 3.87e-3 through rho_refl to |W_refl| <~ 0.24/pi = 0.07639437268410976, leaving
 * W_refl as the last uncomputed scalar in the imp-97617 kernel-gamma-factor chain. imp-97701 then tried
 * both available routes to pin it.
 *
 * FINDING -- BOTH ROUTES FAIL, FOR TWO DISTINCT REASONS. The ANALYTIC route needs the EXACT
 * Bettin-Conrey functional-equation reflection index -- the 2pi-power / argument-shift Pochhammer
 * convention at order z^2 -- which imp-97617 RESULT C left uncomputed; that datum is still uncomputed
 * here. The NUMERICAL route is structurally blind to W_refl: the only measured aggregate is
 * kappa_smooth, but the imp-97597 decomposition kappa_smooth = (pi/2)[kappaK_period*zeta(2) -
 * kappaK_pole*gamma_1*(arith)] is a TWO-coefficient difference, and a single sign-swinging scalar
 * cannot isolate either summand -- the same under-determination that forced imp-97663 to adopt the
 * no-cancellation reading in the first place. The naive Gauss-Kuzmin numerical route stays proven
 * non-convergent (imp-97578 STEP 3), so it is NOT a fallback either.
 *
 * FINDING -- THE imp-97681 CAP TEST IS NON-DISCRIMINATING. Under the no-cancellation reading the
 * admissible band is the SYMMETRIC interval W_refl in [-0.24/pi, +0.24/pi] =
 * [-0.07639437268410976, +0.07639437268410976], which CONTAINS 0. So the cap neither establishes
 * W_refl != 0 nor pins |W_refl| to any positive value -- every candidate, including the degenerate
 * W_refl = 0, passes the consistency test identically. It is a one-sided upper bound, not a
 * measurement. The required suppression bar is exactly 1/(0.24/pi) = pi/0.24 = 13.089969389957473
 * (the imp-97681 residual shortfall factor): a generic O(1) Pochhammer weight would need to be
 * suppressed ~13x, or else the kappaK_pole*gamma_1 pole term partially cancels and relaxes the cap --
 * a dichotomy only the same uncomputed exact reflection index can decide.
 *
 * NO FIX APPLIED. This is a scoping/honest-status note, not a code defect -- it cross-indexes the
 * imp-97701 IMP97701_VERDICT / IMP97701_SUBGAP finding as a standalone indexable module (glossary/audit
 * sweeps that grep for honest-status modules by filename, per imp-36209's finding that inline-only
 * corrections are not reliably discoverable). Read-only record; changes no bound; establishes no
 * operator positivity; no RH verdict; NO QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 * @see imp-97701-route-m-bc-reflection-weight-pinning-obstruction.js (the two-part obstruction this note records)
 * @see imp-97681-route-m-bc-reflection-gamma-normalisation.js (the |W_refl| <~ 0.24/pi cap and rho_refl)
 * @see imp-97617-route-m-bettin-conrey-kernel-gamma-factor-reconstruction.js (RESULT C: the uncomputed reflection index)
 * @see imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint.js (the no-cancellation cap on kappaK_period)
 */

import {
  IMP97701_W_REFL_CAP,
  IMP97701_W_REFL_BAND,
  IMP97701_BAND_CONTAINS_ZERO,
  IMP97701_SUPPRESSION_BAR,
} from './imp-97701-route-m-bc-reflection-weight-pinning-obstruction.js';

export const IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS = {
  id: 'imp-97727',
  proofSection: 'Route-M',
  question:
    'Does either the analytic or numerical route pin the imp-97617 RESULT C reflection weight ' +
    'W_refl, and does the imp-97681 cap test discriminate among candidate values?',
  verdictShort:
    'NEITHER ROUTE PINS W_refl, AND THE CAP TEST IS NON-DISCRIMINATING. Analytically the exact BC ' +
    'functional-equation reflection index is uncomputed; numerically kappa_smooth is a two-coefficient ' +
    'difference that cannot isolate W_refl. The admissible band ' +
    `[-${IMP97701_W_REFL_CAP}, +${IMP97701_W_REFL_CAP}] straddles 0, so even W_refl != 0 is unestablished.`,
  analyticRouteBlockedByUncomputedReflectionIndex: true,
  numericalRouteNonConvergent: true, // structurally blind: two-coefficient difference from one aggregate
  gaussKuzminFallbackNonConvergent: true, // imp-97578 STEP 3
  wReflCap: IMP97701_W_REFL_CAP, // 0.24/pi = 0.07639437268410976
  wReflBand: IMP97701_W_REFL_BAND, // [-0.0764, +0.0764]
  bandContainsZero: IMP97701_BAND_CONTAINS_ZERO,
  capTestDiscriminates: false,
  suppressionBar: IMP97701_SUPPRESSION_BAR, // pi/0.24 = 13.089969389957473
  wReflPinned: false,
  fixApplied: false,
  isRigorous: false,
  verdict:
    'AUDIT / HONEST-STATUS FINDING (no fix applied, no new measurement -- restates and cross-indexes ' +
    'the imp-97701 two-part obstruction as a standalone module). The analytic route to pin W_refl is ' +
    'blocked by the uncomputed exact Bettin-Conrey functional-equation reflection index (imp-97617 ' +
    'sub-gap, unchanged); the numerical route is non-convergent / structurally blind because the ' +
    'imp-97597 kappa_smooth decomposition is a two-coefficient difference read from a single ' +
    'sign-swinging aggregate. The imp-97681 cap test is non-discriminating: the symmetric admissible ' +
    `band [-${IMP97701_W_REFL_CAP}, +${IMP97701_W_REFL_CAP}] contains 0, so every candidate -- including ` +
    `W_refl = 0 -- passes identically. Changes no bound; establishes no operator positivity; no RH ` +
    'verdict; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-97701-route-m-bc-reflection-weight-pinning-obstruction.js (IMP97701_VERDICT / IMP97701_SUBGAP, ' +
    'the source finding this note records); imp-97681-route-m-bc-reflection-gamma-normalisation.js ' +
    '(the |W_refl| <~ 0.24/pi cap and rho_refl = 1/(2pi^2)).',
};

export const IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp97727-both-routes-recorded-as-blocked',
    description: 'both the analytic and numerical routes are recorded as failing to pin W_refl',
    holds: () =>
      IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.analyticRouteBlockedByUncomputedReflectionIndex === true &&
      IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.numericalRouteNonConvergent === true &&
      IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.gaussKuzminFallbackNonConvergent === true &&
      IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.wReflPinned === false,
  },
  {
    id: 'imp97727-cap-is-non-discriminating',
    description: 'the admissible band straddles 0 and the cap test is recorded as non-discriminating',
    holds: () =>
      IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.bandContainsZero === true &&
      IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.capTestDiscriminates === false &&
      Math.abs(IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.wReflCap - 0.24 / Math.PI) < 1e-15,
  },
  {
    id: 'imp97727-suppression-bar-matches-imp97701',
    description: 'the recorded suppression bar equals pi/0.24 (imp-97701 RESULT 3 / imp-97681 shortfall factor)',
    holds: () =>
      Math.abs(IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.suppressionBar - Math.PI / 0.24) < 1e-9 &&
      IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.suppressionBar > 13 &&
      IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.suppressionBar < 14,
  },
  {
    id: 'imp97727-no-fix-honesty-gate',
    description: 'honest-status finding only: no fix applied, no RH verdict, no QED, PT stays SOTA',
    holds: () =>
      IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.fixApplied === false &&
      IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.isRigorous === false &&
      /NO QED/.test(IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.verdict) &&
      /remains the rigorous SOTA/.test(IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS.verdict),
  },
];

for (const a of IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97727-route-m-bc-reflection-weight-two-part-obstruction-honest-status assertion failed: ${a.id}`,
    );
  }
}

export default IMP97727_BC_REFLECTION_WEIGHT_OBSTRUCTION_HONEST_STATUS;
