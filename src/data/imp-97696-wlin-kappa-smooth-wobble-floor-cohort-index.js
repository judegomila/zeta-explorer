/**
 * @module imp-97696-wlin-kappa-smooth-wobble-floor-cohort-index
 * @fileoverview imp-97696 -- META cross-reference index note grouping the Route M w_lin / kappa_smooth
 *   arithmetic-wobble-floor cohort (imp-97597, imp-97611, imp-97645, imp-97660, imp-97663, imp-97664)
 *   as a single family: every one of the six tickets probes the same obstruction -- a sign-swinging
 *   O(x^2) arithmetic wobble in the Bettin-Conrey cotangent-sum transform (the imp-97597 RESULT 3
 *   mixed-kernel "epsilon*z^2" sub-gap) -- from a different angle, and none of them eliminates it or
 *   pins the analytic constant it caps. Index/meta only; establishes nothing new; changes no bound;
 *   NO QED.
 *
 *   THE COHORT (by role). All six probe the same obstruction: the O(x^2) arithmetic wobble that caps
 *   both the w_lin linear-coefficient fit and the analytic cusp coefficient kappa_smooth.
 *     imp-97597 -- DERIVATION: carries the (s,z)-double expansion of the Bettin-Conrey psi_s integral
 *       representation forward; reproduces w_lin from the leading Laurent block (consistency check),
 *       then decomposes kappa_smooth = (pi/2)[kappaK_period*zeta(2) - kappaK_pole*gamma_1*(...)] and
 *       localises the remaining unknown to a single uncomputed mixed-kernel scalar kappaK ("epsilon
 *       times z^2" coefficient) -- this is the RESULT 3 sub-gap the rest of the cohort inherits.
 *     imp-97611 -- HONEST-STATUS: restates the imp-97578 verdict as a standalone note -- kappa_smooth
 *       IS the psi cusp O(x^2) Taylor coefficient (sound reduction), but neither the elementary
 *       V-reciprocity cocycle nor naive Gauss-Kuzmin extraction closes it, so it stays
 *       measured-not-pinned at |kappa_smooth| <~ 1e-2.
 *     imp-97645 -- CROSS-CHECK: re-runs the Vasyunin double-sum limit at larger b (1e6, 2e6); shows
 *       the w_lin linear-coefficient fit error is NON-MONOTONE in b and plateaus at ~6e-3 -- the raw
 *       residual w(x)-w_lin(x) is already b-converged, so the ~6e-3 gap is the genuine O(x^2) wobble
 *       sampled at fixed small-x nodes, not a finite-b truncation artifact.
 *     imp-97660 -- MEASUREMENT: tests the two remedies imp-97645 named (a smooth x^2 wobble-model
 *       subtraction, and a finer/smaller-x node grid); NEITHER gives a controlled sub-6e-3 isolation --
 *       the smooth subtraction makes the fit WORSE (the wobble is sign-swinging and non-smooth, so a
 *       polynomial term is misspecified and bleeds error into the linear coefficient), and the grid
 *       refinement only re-samples different wobble phases non-monotonically.
 *     imp-97663 -- DERIVATION + CONSTRAINT: feeds the measured band |kappa_smooth| <~ 1e-2 back into
 *       the imp-97597 decomposition to turn the still-uncomputed Bettin-Conrey reflection normalisation
 *       into a quantitative order-of-magnitude constraint (the bare period scale pi^3/12 is ~258x the
 *       measured cap, forcing a large suppression/cancellation between kappaK_period and kappaK_pole);
 *       no value pinned, the reflection index stays uncomputed.
 *     imp-97664 -- CROSS-CHECK: reconciles the imp-97645 non-monotone b-ladder spike at b=1e6; shows
 *       it is NOT a phase-average window-width artifact (the linErr is roughly half-independent and
 *       stays ~2x the b=2e6 baseline across all tested widths) -- it is a genuine arithmetic
 *       b-fluctuation at the small-x fit nodes (b=1e6=2^6*5^6 samples a larger wobble deviation there
 *       than b=2e6=2^7*5^6).
 *
 *   WHY GROUP THESE (not re-derive). Read individually, the six tickets look like a derivation
 *   attempt (imp-97597), a restated verdict (imp-97611), two numerical cross-checks that each rule
 *   out one candidate explanation for a fit gap (imp-97645 rules out finite-b, imp-97664 rules out
 *   windowing), a failed-remedies measurement (imp-97660), and a constraint-only derivation
 *   (imp-97663). Read together, they are one story: the O(x^2) coefficient of the Route M
 *   Bettin-Conrey transform -- both its numerical shadow (the w_lin linear-coefficient fit residual)
 *   and its analytic value (kappa_smooth) -- is governed by a single genuine, sign-swinging,
 *   non-smooth arithmetic wobble that survives every truncation, windowing, and smooth-subtraction
 *   remedy tried against it, and whose closed form reduces to one uncomputed mixed-kernel scalar. This
 *   index bakes that reading so a future scout does not mistake the ~6e-3 fit plateau for a
 *   finite-b/windowing bug (imp-97645/imp-97664 already closed those), does not re-attempt a smooth
 *   polynomial wobble-model subtraction expecting it to work (imp-97660 already showed it makes
 *   things worse), and treats kappa_smooth as measured-not-pinned (imp-97611/imp-97663) rather than
 *   re-deriving imp-97597's decomposition from scratch.
 *
 *   MEASURED/DERIVED (all measurements, constraints, or ruled-out remedies; NOT a closed form).
 *   - the w_lin linear-coefficient fit error plateaus at ~6e-3 across b in {4e5, 1e6, 2e6}, already
 *     b-converged, confirming the residual is the genuine O(x^2) wobble not a truncation artifact
 *     (imp-97645).
 *   - neither a smooth x^2 wobble-model subtraction nor a finer/smaller-x grid gives a controlled
 *     sub-6e-3 isolation; the smooth subtraction actively worsens the fit (imp-97660).
 *   - the b=1e6 non-monotone spike is a genuine arithmetic b-fluctuation, not a phase-average
 *     window-width artifact (imp-97664).
 *   - kappa_smooth is bounded |kappa_smooth| <~ 1e-2 (sign-swinging), with the reduction to the psi
 *     cusp O(x^2) coefficient sound but the closed form unreachable from the elementary cocycle alone
 *     (imp-97611).
 *   - the measured band forces a large suppression/cancellation between the two Bettin-Conrey
 *     reflection normalisations (bare period scale ~258x, bare pole scale ~11.4x the measured cap)
 *     (imp-97663).
 *   - the remaining unknown in the kappa_smooth decomposition is exactly one uncomputed mixed-kernel
 *     scalar kappaK, the coefficient of "epsilon*z^2" in the Mellin-Barnes kernel at (s=1,z=0)
 *     (imp-97597).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - no closed form for kappa_smooth or for the mixed-kernel scalar kappaK exists; both stay
 *     measured-not-pinned.
 *   - no remedy (larger b, smooth subtraction, grid refinement, window-width change) isolates the
 *     w_lin linear coefficient to better than the ~6e-3 wobble floor.
 *   - the Bettin-Conrey reflection normalisation (kappaK_period, kappaK_pole) is constrained in
 *     order of magnitude only (imp-97663), not pinned to a value.
 *
 *   STATUS: a grouping/index note over six already-completed tickets, not a new derivation. No bound
 *   changes: kappa_smooth stays measured-not-pinned, no operator positivity or Lambda bound moves;
 *   RH open; NO QED. Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion.js (double expansion; localises the mixed-kernel scalar kappaK)
 * @see imp-97611-kappa-smooth-no-closed-form-honest-status.js (honest-status restatement of the imp-97578 verdict)
 * @see imp-97645-wlin-largeb-linear-coeff-crossval.js (larger-b cross-check; rules out finite-b truncation)
 * @see imp-97660-wobble-model-subtraction-linear-coeff.js (tests smooth subtraction + grid refinement; both fail)
 * @see imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint.js (feeds measured band back into an order-of-magnitude constraint)
 * @see imp-97664-wlin-b1e6-halfwidth-artifact-test.js (rules out phase-average window-width artifact)
 *
 * Ticket: imp-97696 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

const WLIN_KAPPA_SMOOTH_WOBBLE_FLOOR_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97597',
    role: 'derivation -- (s,z)-double expansion of the Bettin-Conrey psi_s integral representation',
    result:
      'reproduces w_lin from the leading Laurent block (consistency check); decomposes kappa_smooth ' +
      'into two competing scales and localises the remaining unknown to a single uncomputed ' +
      'mixed-kernel scalar kappaK (coefficient of "epsilon*z^2").',
  }),
  Object.freeze({
    id: 'imp-97611',
    role: 'honest-status note restating the imp-97578 verdict',
    result:
      'kappa_smooth IS the psi cusp O(x^2) Taylor coefficient (sound reduction), but neither the ' +
      'elementary V-reciprocity cocycle nor naive Gauss-Kuzmin extraction closes it -- stays ' +
      'measured-not-pinned at |kappa_smooth| <~ 1e-2.',
  }),
  Object.freeze({
    id: 'imp-97645',
    role: 'numerical cross-check at larger Vasyunin b (1e6, 2e6)',
    result:
      'linear-coefficient fit error is non-monotone in b and plateaus at ~6e-3; the raw residual is ' +
      'already b-converged, so the gap is the genuine O(x^2) wobble, not finite-b truncation.',
  }),
  Object.freeze({
    id: 'imp-97660',
    role: 'tests smooth wobble-model subtraction and finer small-x grid remedies',
    result:
      'neither remedy gives a controlled sub-6e-3 isolation; the smooth x^2 subtraction actively ' +
      'worsens the fit because the wobble is sign-swinging and non-smooth.',
  }),
  Object.freeze({
    id: 'imp-97663',
    role: 'feeds the measured band back into the imp-97597 decomposition',
    result:
      'turns the uncomputed Bettin-Conrey reflection normalisation into a quantitative ' +
      'order-of-magnitude constraint (bare period scale ~258x, bare pole scale ~11.4x the measured ' +
      'cap); no value pinned.',
  }),
  Object.freeze({
    id: 'imp-97664',
    role: 'reconciles the imp-97645 non-monotone b=1e6 spike',
    result:
      'rules out a phase-average window-width artifact; the spike is a genuine arithmetic ' +
      'b-fluctuation at the small-x fit nodes.',
  }),
]);

export const IMP97696_WLIN_KAPPA_SMOOTH_WOBBLE_FLOOR_COHORT_INDEX = Object.freeze({
  id: 'imp-97696',
  proofSection: 'S-frontier',
  cohort: WLIN_KAPPA_SMOOTH_WOBBLE_FLOOR_COHORT,
  measuredSignal:
    'every angle tried across these six tickets on the Route M O(x^2) arithmetic wobble -- ' +
    'derivation (imp-97597), honest restatement (imp-97611), larger-b cross-check (imp-97645), ' +
    'failed-remedy measurement (imp-97660), order-of-magnitude constraint (imp-97663), ' +
    'window-width cross-check (imp-97664) -- lands on the same conclusion: the wobble is genuine, ' +
    'non-eliminable by any tried remedy, and the analytic constant it caps stays unpinned.',
  namedResiduals: [
    'IMP97597_KAPPA_SMOOTH_MIXED_KERNEL_SCALAR_UNCOMPUTED',
    'IMP97611_KAPPA_SMOOTH_MEASURED_NOT_PINNED',
    'IMP97645_LINEAR_COEFF_WOBBLE_NOT_BTRUNCATION',
    'IMP97660_WOBBLE_NOT_SMOOTH_SUBTRACTABLE_OR_GRID_ISOLABLE',
    'IMP97663_REFLECTION_NORMALISATION_ORDER_OF_MAGNITUDE_ONLY',
    'IMP97664_B_FLUCTUATION_GENUINE_NOT_WINDOW_ARTIFACT',
  ],
  kappaSmoothMeasuredUpper: 1e-2,
  kappaSmoothPinned: false,
  linearCoeffWobbleFloor: 6e-3,
  question:
    'The Route M w_lin / kappa_smooth arithmetic-wobble-floor cohort (imp-97597/97611/97645/97660/ ' +
    '97663/97664) reads as six separate tickets spanning derivation, honest-status restatement, two ' +
    'numerical cross-checks, a failed-remedy test, and a constraint derivation. Grouped, does any of ' +
    'them close the wobble or pin the analytic constant it caps, or does the cohort as a whole show ' +
    'the wobble is a genuine, non-eliminable arithmetic floor?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). Across all six tickets, the O(x^2) coefficient of the ' +
    'Route M Bettin-Conrey transform -- both the numerical w_lin linear-coefficient fit residual and ' +
    'the analytic kappa_smooth constant -- is shown to be governed by one genuine, sign-swinging, ' +
    'non-smooth arithmetic wobble (imp-97597 RESULT 3). It survives larger-b runs (imp-97645), ' +
    'window-width changes (imp-97664), smooth-model subtraction, and grid refinement (imp-97660); its ' +
    'closed form reduces to one uncomputed mixed-kernel scalar (imp-97597) whose normalisation is ' +
    'constrained only in order of magnitude (imp-97663); and the analytic constant it caps stays ' +
    'measured-not-pinned at |kappa_smooth| <~ 1e-2 (imp-97611). So the cohort as a whole is a ' +
    'GENUINE-ARITHMETIC-WOBBLE-FLOOR family: nothing in it eliminates the wobble or pins the constant. ' +
    'Establishes nothing new; moves no bound; RH open; NO QED. Platt-Trudgian Lambda <= 0.2 remains ' +
    'SOTA.',
  citation:
    'imp-97597 (double expansion; localises kappaK); imp-97611 (honest-status restatement); ' +
    'imp-97645 (larger-b cross-check); imp-97660 (failed-remedy measurement); imp-97663 ' +
    '(order-of-magnitude constraint); imp-97664 (window-width cross-check).',
});

export default IMP97696_WLIN_KAPPA_SMOOTH_WOBBLE_FLOOR_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97696_WLIN_KAPPA_SMOOTH_WOBBLE_FLOOR_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97696-cohort-has-all-six-members',
    why: 'The whole point of the index is grouping exactly these six tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97696_WLIN_KAPPA_SMOOTH_WOBBLE_FLOOR_COHORT_INDEX.cohort.map((c) => c.id);
      return [
        'imp-97597',
        'imp-97611',
        'imp-97645',
        'imp-97660',
        'imp-97663',
        'imp-97664',
      ].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97696-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them ' +
      'without re-reading all six tickets.',
    holds: () => {
      const idx = IMP97696_WLIN_KAPPA_SMOOTH_WOBBLE_FLOOR_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 6 &&
        idx.kappaSmoothPinned === false &&
        idx.kappaSmoothMeasuredUpper === 1e-2
      );
    },
  },
  {
    id: 'imp97696-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97696_WLIN_KAPPA_SMOOTH_WOBBLE_FLOOR_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97696_WLIN_KAPPA_SMOOTH_WOBBLE_FLOOR_COHORT_INDEX.verdict) &&
      /remains SOTA/.test(IMP97696_WLIN_KAPPA_SMOOTH_WOBBLE_FLOOR_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97696_WLIN_KAPPA_SMOOTH_WOBBLE_FLOOR_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97696-wlin-kappa-smooth-wobble-floor-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
