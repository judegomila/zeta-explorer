/**
 * @module imp-97717-bc-reflection-normalisation-cohort-index
 * @fileoverview imp-97717 -- META cross-reference index note grouping the Route M Bettin-Conrey
 *   reflection-normalisation cohort (imp-97617, imp-97663, imp-97681, imp-97692) as a single family:
 *   all four probe the same single remaining primitive -- the exact functional-equation reflection
 *   weight that would pin the mixed-kernel scalar kappaK (imp-97597 RESULT 3) -- from a different
 *   angle, and none of them pins it. Index/meta only; establishes nothing new; changes no bound;
 *   NO QED.
 *
 *   THE COHORT (by role). All four probe the Bettin-Conrey reflection normalisation that kappa_smooth
 *   hinges on:
 *     imp-97617 -- DERIVATION: reconstructs the gamma-factor half of the BC Mellin-Barnes kernel,
 *       N(s) = (2pi)^{-s} Gamma(s) (RESULT A, cross-confirms the w_lin constant), states the Eichler
 *       value-selection map z^m -> completed value at s = m+1 (RESULT B), and shows the z^2 order sits
 *       at the CONVERGENT s = 3 value -- so the gamma_1/double-pole coupling of imp-97597 RESULT 2 can
 *       only arrive via the functional-equation reflection s <-> (2-s or 1-s), whose exact Pochhammer
 *       index is the one remaining uncomputed primitive (RESULT C).
 *     imp-97663 -- DERIVATION + CONSTRAINT: feeds the measured band |kappa_smooth| <~ 1e-2 back into
 *       the imp-97597 decomposition kappa_smooth = (pi/2)[P2 - L2]; the bare period scale pi^3/12
 *       (~2.584) sits ~258x above the measured band, forcing (under the no-cancellation reading)
 *       |kappaK_period| <~ 3.87e-3 -- a quantified order-of-magnitude suppression, no value pinned.
 *     imp-97681 -- DERIVATION: computes the DERIVABLE half of the reflection normalisation using the
 *       imp-97617 RESULT A gamma factor -- the ratio N(3)/N(1) = 1/(2pi^2), a real closed number --
 *       and divides it out of the imp-97663 cap, re-expressing the constraint as a bound on the
 *       residual pure-number weight |W_refl| <~ 0.24/pi (~0.0764). Sharper obstruction, still no pin.
 *     imp-97692 -- HONEST-STATUS: restates the imp-97663 RESULT 2 suppression constraint
 *       (|kappaK_period| <~ 3.87e-3) as a standalone, directly-citable status record, complementing
 *       the imp-97611 no-closed-form note.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, the four tickets look like a kernel
 *   reconstruction (imp-97617), a band-to-constraint feed-back (imp-97663), a further normalisation
 *   factorisation (imp-97681), and a restated status note (imp-97692). Read together, they are one
 *   narrowing chain on a single unknown: imp-97617 splits the BC kernel into a pinned gamma-factor half
 *   and an unpinned reflection-weight half; imp-97663 turns the measured kappa_smooth band into a
 *   numeric cap on kappaK_period; imp-97681 factors the pinned gamma-factor ratio N(3)/N(1) = 1/(2pi^2)
 *   out of that cap to isolate the residual pure-number weight |W_refl| <~ 0.24/pi; imp-97692 records
 *   the intermediate cap as a standalone citable fact. This index bakes that reading so a future scout
 *   does not re-attempt the kernel reconstruction from scratch (imp-97617 already pinned the gamma
 *   half) and treats the chain as one still-open reflection-index primitive, not four independent gaps.
 *
 *   MEASURED/DERIVED (all measurements, constraints, or pinned sub-components; NOT a closed form).
 *   - the gamma-factor half of the BC kernel is pinned: N(s) = (2pi)^{-s} Gamma(s), with N(1) = 1/(2pi)
 *     and N(3)/N(1) = 1/(2pi^2) (imp-97617, imp-97681).
 *   - the Eichler value-selection map z^m -> completed value at s = m+1 places z^2 at the convergent
 *     s = 3 value, away from the s = 1 double pole (imp-97617).
 *   - |kappa_smooth| <~ 1e-2 (sign-swinging, measured-not-pinned) forces |kappaK_period| <~ 3.87e-3
 *     under the no-cancellation reading, ~258x below the bare period scale pi^3/12 (imp-97663,
 *     restated imp-97692).
 *   - dividing the pinned gamma-factor ratio 1/(2pi^2) out of that cap re-expresses the constraint as
 *     |W_refl| <~ 0.24/pi (~0.0764) on the residual pure-number reflection weight (imp-97681).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - no numeric value for kappaK, kappaK_period, kappaK_pole, or kappa_smooth; all stay
 *     measured-not-pinned.
 *   - the exact Pochhammer / argument-shift index of the BC functional-equation reflection is not
 *     computed; it is the single remaining primitive the whole cohort narrows but does not close.
 *   - the imp-97681 |W_refl| <~ 0.24/pi cap is non-discriminating (a bound, not a pin) -- it does not by
 *     itself determine the sign or magnitude of kappa_smooth beyond the already-measured band.
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No bound
 *   changes: kappa_smooth stays measured-not-pinned, no operator positivity or Lambda bound moves;
 *   RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-97617-route-m-bettin-conrey-kernel-gamma-factor-reconstruction.js (pins the gamma-factor half; surfaces the reflection-index sub-gap)
 * @see imp-97663-route-m-kappa-smooth-measured-band-reflection-constraint.js (feeds the measured band into the kappaK_period order-of-magnitude cap)
 * @see imp-97681-route-m-bc-reflection-gamma-normalisation.js (factors the pinned gamma ratio out of the cap; isolates |W_refl|)
 * @see imp-97692-kappa-smooth-suppression-constraint-honest-status.js (standalone restatement of the imp-97663 cap)
 *
 * Ticket: imp-97717 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const BC_REFLECTION_NORMALISATION_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97617',
    role: 'derivation -- reconstructs the BC Mellin-Barnes kernel gamma-factor half',
    result:
      'pins N(s) = (2pi)^{-s} Gamma(s) (cross-confirms the w_lin constant); states the Eichler ' +
      'value-selection map z^m -> s = m+1; shows z^2 selects the convergent s = 3 value, so the ' +
      'gamma_1 coupling can only arrive via a functional-equation reflection whose exact index is ' +
      'the remaining uncomputed primitive.',
  }),
  Object.freeze({
    id: 'imp-97663',
    role: 'derivation + constraint -- feeds the measured kappa_smooth band back into the imp-97597 decomposition',
    result:
      'the bare period scale pi^3/12 sits ~258x above the measured band, forcing (no-cancellation ' +
      'reading) |kappaK_period| <~ 3.87e-3 -- an order-of-magnitude constraint, no value pinned.',
  }),
  Object.freeze({
    id: 'imp-97681',
    role: 'derivation -- factors the pinned gamma-factor ratio out of the imp-97663 cap',
    result:
      'the derivable ratio N(3)/N(1) = 1/(2pi^2) divides out of the imp-97663 cap, re-expressing the ' +
      'constraint as a bound on the residual pure-number reflection weight |W_refl| <~ 0.24/pi ' +
      '(~0.0764); sharper obstruction, still not a pin.',
  }),
  Object.freeze({
    id: 'imp-97692',
    role: 'honest-status -- standalone restatement of the imp-97663 suppression constraint',
    result:
      'records |kappaK_period| <~ 3.87e-3 as a directly-citable status fact, complementing the ' +
      'imp-97611 no-closed-form note.',
  }),
]);

export const IMP97717_BC_REFLECTION_NORMALISATION_COHORT_INDEX = Object.freeze({
  id: 'imp-97717',
  proofSection: 'Route-M',
  cohort: BC_REFLECTION_NORMALISATION_COHORT,
  measuredSignal:
    'every angle tried across these four tickets on the Route M Bettin-Conrey reflection ' +
    'normalisation -- kernel reconstruction (imp-97617), band-to-constraint feed-back (imp-97663), ' +
    'gamma-ratio factorisation (imp-97681), standalone restatement (imp-97692) -- narrows the same ' +
    'single unknown (the functional-equation reflection index / residual weight W_refl) without ' +
    'closing it.',
  namedResiduals: [
    'IMP97617_REFLECTION_INDEX_UNCOMPUTED',
    'IMP97663_KAPPAK_PERIOD_ORDER_OF_MAGNITUDE_ONLY',
    'IMP97681_W_REFL_CAP_NOT_A_PIN',
    'IMP97692_SUPPRESSION_CONSTRAINT_STANDALONE_RESTATEMENT',
  ],
  gammaFactorHalfPinned: true, // N(s) = (2pi)^{-s} Gamma(s), N(3)/N(1) = 1/(2pi^2)
  reflectionIndexPinned: false,
  kappaKPeriodUpperBound: 3.87e-3,
  wReflUpperBound: 0.24 / Math.PI,
  kappaSmoothPinned: false,
  question:
    'The Route M Bettin-Conrey reflection-normalisation cohort (imp-97617/97663/97681/97692) reads ' +
    'as four separate tickets spanning kernel reconstruction, a band-to-constraint feed-back, a ' +
    'further gamma-ratio factorisation, and a restated status note. Grouped, does any of them pin ' +
    'the reflection index / kappaK, or does the cohort as a whole show a single unknown narrowed but ' +
    'not closed?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). Across all four tickets, the Route M Bettin-Conrey ' +
    'reflection normalisation is progressively factored -- the gamma-factor half N(s) = ' +
    '(2pi)^{-s} Gamma(s) is pinned (imp-97617), the measured kappa_smooth band converts to a numeric ' +
    'cap |kappaK_period| <~ 3.87e-3 (imp-97663, restated imp-97692), and dividing out the pinned ' +
    'gamma ratio 1/(2pi^2) sharpens that cap to |W_refl| <~ 0.24/pi on the residual pure-number weight ' +
    '(imp-97681) -- but the exact functional-equation reflection index stays uncomputed throughout. ' +
    'So the cohort as a whole is a SINGLE-UNKNOWN-NARROWED-NOT-CLOSED family: nothing in it pins ' +
    'kappaK or kappa_smooth. Establishes nothing new; moves no bound; RH open; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-97617 (gamma-factor reconstruction; reflection-index sub-gap); imp-97663 (measured-band ' +
    'constraint); imp-97681 (gamma-ratio factorisation; W_refl cap); imp-97692 (standalone ' +
    'restatement).',
});

export default IMP97717_BC_REFLECTION_NORMALISATION_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97717_BC_REFLECTION_NORMALISATION_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97717-cohort-has-all-four-members',
    why: 'The whole point of the index is grouping exactly these four tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97717_BC_REFLECTION_NORMALISATION_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97617', 'imp-97663', 'imp-97681', 'imp-97692'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97717-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them ' +
      'without re-reading all four tickets.',
    holds: () => {
      const idx = IMP97717_BC_REFLECTION_NORMALISATION_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 4 &&
        idx.reflectionIndexPinned === false &&
        idx.kappaSmoothPinned === false &&
        idx.gammaFactorHalfPinned === true
      );
    },
  },
  {
    id: 'imp97717-wrefl-bound-consistent',
    why: 'the imp-97681 residual-weight cap is |W_refl| <~ 0.24/pi -- verify the stored numeric ' +
      'literal matches that closed form.',
    holds: () =>
      Math.abs(
        IMP97717_BC_REFLECTION_NORMALISATION_COHORT_INDEX.wReflUpperBound - 0.24 / Math.PI,
      ) < 1e-15,
  },
  {
    id: 'imp97717-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97717_BC_REFLECTION_NORMALISATION_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97717_BC_REFLECTION_NORMALISATION_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97717_BC_REFLECTION_NORMALISATION_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97717_BC_REFLECTION_NORMALISATION_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97717-bc-reflection-normalisation-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
