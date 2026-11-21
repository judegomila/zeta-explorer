/**
 * @module imp-36276-routeC-perN-rate-form-conditional-reconciliation
 * @fileoverview imp-36276 -- Reconcile the APPARENT tension between imp-36137 and
 *   imp-36151 over the Route-C (imp-337/342/343 density-squeeze) per-N rate.
 *
 *   THE APPARENT TENSION
 *   --------------------
 *   imp-36151 records routeC.rateForm = null, routeC.exponentPinned = false, and
 *   states Route-C has NO pinned per-N exponent because its magnitude / N-scaling
 *   are set by the OPEN G3a_max_gap extremal max-gap statistics -- only Route-B
 *   owns the pinned exponent -1/4. Yet imp-36137 DERIVES an EXPLICIT Route-C rate
 *   form r(N) = pi^2/(2 kappa log(gamma_N/2 pi)) = Theta(1/log N). Read naively
 *   side by side, "rateForm = null" (imp-36151) and an explicit r(N) string
 *   (imp-36137) look contradictory.
 *
 *   THE RESOLUTION: NO CONTRADICTION -- DIFFERENT AXES
 *   -------------------------------------------------
 *   The two records answer DIFFERENT questions and are mutually consistent:
 *
 *     - imp-36151 answers the UNCONDITIONAL axis: is there a per-N exponent PINNED
 *       today, without an open premise? Answer NO -- hence rateForm = null and
 *       exponentPinned = false. This is the "pinned exponent" question, and
 *       imp-36151 is AUTHORITATIVE on it.
 *
 *     - imp-36137 answers the CONDITIONAL-FORM axis: what explicit r(N) SHAPE does
 *       the integrated density squeeze supply IF its premise holds? The 1/log N
 *       form is derived UNDER the conservative Weyl min-gap surrogate B(0)=2 pi/L
 *       and is CONTINGENT on the density-squeeze premise S_{k*} >= c(N)/B(tau)^2
 *       holding pointwise -- whose SOLE open residual is G3a_max_gap. imp-36137
 *       itself flags this: status = CONSUMABLE-MODULO-G3a, "Until G3a_max_gap
 *       closes, r(N) is an UNPROVEN premise, not a theorem", perNTranslation and
 *       g3aMaxGap stay OPEN, closesAnyGap = false. imp-36137 is AUTHORITATIVE on
 *       the "explicit conditional form" question.
 *
 *   So imp-36137's r(N) is a CONDITIONAL / contingent form, NOT an unconditionally
 *   pinned exponent -- exactly the object imp-36151 means by leaving rateForm
 *   null. Both agree Route-C supplies NO unconditionally pinned exponent; both keep
 *   G3a_max_gap and the per-N translation OPEN. The 1/log N shape is a conservative
 *   conditional UPPER form; the true G3a_max_gap max-gap scale is what would PIN the
 *   magnitude / N-scaling that imp-36151 flags as unquantified. imp-36216 already
 *   tabulates the two forms and marks the whole Route-C column CONDITIONAL on the
 *   OPEN G3a_max_gap premise, consistent with this reconciliation.
 *
 *   VERDICT: no overclaim in EITHER module -- both carry the honest caveats
 *   (closesAnyGap = false, perNTranslation / G3a_max_gap OPEN, NO QED). The tension
 *   is only apparent: a matter of AXIS (conditional FORM vs unconditional pinned
 *   EXPONENT), not of substance. This record is an assessment / reconciliation ONLY:
 *   closes NOTHING, discharges no gap, per-N translation and G3a_max_gap stay OPEN,
 *   respects the imp-2519 no-overclaim guard, NO QED. No refereed bound is changed.
 *
 *   @see src/data/imp-36137-routeC-perN-rate-form-and-bridge-consumability.js (explicit conditional r(N) form, CONSUMABLE-MODULO-G3a)
 *   @see src/data/imp-36151-routeC-vs-routeB-perN-exponent-comparison.js (no unconditionally pinned Route-C exponent; rateForm null)
 *   @see src/data/imp-36216-routeC-vs-routeB-perN-rate-tabulation.js (tabulates both forms; Route-C column CONDITIONAL on G3a_max_gap)
 *
 *   Ticket: imp-36276 (accuracy, medium).
 */

import IMP36137 from './imp-36137-routeC-perN-rate-form-and-bridge-consumability.js';
import IMP36151 from './imp-36151-routeC-vs-routeB-perN-exponent-comparison.js';

export const IMP36276_ROUTEC_PERN_RATE_FORM_CONDITIONAL_RECONCILIATION = Object.freeze({
  id: 'imp-36276-routeC-perN-rate-form-conditional-reconciliation',
  ticket: 'imp-36276',
  obligationKey: 'G5-perN-translation',
  reconciles: ['imp-36137', 'imp-36151'],

  summary:
    'Reconciles the apparent tension between imp-36137 (derives an EXPLICIT Route-C per-N rate form ' +
    'r(N) = pi^2/(2 kappa log(gamma_N/2 pi)) = Theta(1/log N)) and imp-36151 (records routeC.rateForm = null, ' +
    'exponentPinned = false: Route-C has NO pinned per-N exponent until G3a_max_gap closes). VERDICT: NO ' +
    'CONTRADICTION -- the records answer DIFFERENT axes. imp-36137 supplies the CONDITIONAL FORM the density ' +
    'squeeze gives IF its premise holds (derived under the conservative Weyl min-gap surrogate B(0)=2 pi/L, ' +
    'contingent on the density-squeeze premise whose SOLE open residual is G3a_max_gap; status ' +
    'CONSUMABLE-MODULO-G3a). imp-36151 answers the UNCONDITIONAL axis: no exponent is PINNED today, hence ' +
    'rateForm null. imp-36137 is authoritative on the explicit conditional form; imp-36151 is authoritative on ' +
    'the pinned-exponent question. Both AGREE Route-C supplies no unconditionally pinned exponent and both keep ' +
    'the per-N translation and G3a_max_gap OPEN. The 1/log N shape is a conservative conditional UPPER form, not ' +
    'the pinned magnitude/N-scaling imp-36151 flags as unquantified. Neither module overclaims -- both carry the ' +
    'honest caveats. Assessment / reconciliation ONLY; closes NOTHING; per-N translation and G3a_max_gap stay ' +
    'OPEN; respects the imp-2519 no-overclaim guard; NO QED; no refereed bound is changed.',

  imp36137_view: Object.freeze({
    axis: 'conditional-form',
    rateForm: 'r(N) = pi^2 / (2 kappa log(gamma_N/2 pi))  [Theta(1/log N)]',
    isUnconditionallyPinnedExponent: false,
    conditionalOnPremise: 'density squeeze S_{k*}(tau) >= c(N)/B(tau)^2 holding pointwise; SOLE open residual G3a_max_gap',
    derivedUnderSurrogate: 'conservative Weyl min-gap surrogate B(0) <- 2 pi/L; any tighter max-gap scale only SHRINKS r(N)',
    status: 'CONSUMABLE-MODULO-G3a',
    authoritativeOn: 'the explicit CONDITIONAL Route-C per-N rate SHAPE',
  }),

  imp36151_view: Object.freeze({
    axis: 'unconditional-pinned-exponent',
    rateForm: null,
    exponentPinned: false,
    blockedBy: 'G3a_max_gap -- extremal max-gap statistics at the argmin site set the magnitude / N-scaling',
    onlyPinnedExponentInPlay: 'Route-B -1/4 (a DEVIATION bound, CONSUMABLE-MODULO-ANCHOR)',
    authoritativeOn: 'whether a per-N exponent is PINNED unconditionally today (it is NOT)',
  }),

  resolution: Object.freeze({
    isContradiction: false,
    reason:
      'The records sit on DIFFERENT axes. imp-36137 r(N) = Theta(1/log N) is a CONDITIONAL form contingent on ' +
      'the OPEN density-squeeze premise (G3a_max_gap), NOT an unconditionally pinned exponent -- precisely the ' +
      'object imp-36151 means by rateForm = null. Both agree Route-C has NO unconditionally pinned exponent and ' +
      'both keep the per-N translation and G3a_max_gap OPEN.',
    imp36137IsConditionalNotPinned: true,
    imp36137IsPlaceholderConstant: false,
    imp36137ContradictsImp36151: false,
    authoritativeOnPinnedExponent: 'imp-36151',
    authoritativeOnConditionalForm: 'imp-36137',
    overclaimFlagged: false,
    bothCarryHonestCaveats: true,
    note:
      'The 1/log N shape is a conservative conditional UPPER form under the Weyl min-gap surrogate; the true ' +
      'G3a_max_gap max-gap scale is what would PIN the magnitude / N-scaling that imp-36151 flags as ' +
      'unquantified. imp-36216 tabulation already marks the Route-C column CONDITIONAL on the OPEN G3a_max_gap ' +
      'premise, consistent with this reconciliation.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesG5PerNTranslation: false,
    reconcilesTwoRecords: true,
    findsContradiction: false,
    flagsOverclaim: false,
    g3aMaxGapStaysOpen: true,
    perNTranslationStaysOpen: true,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Reconciliation of imp-36137 (explicit CONDITIONAL Route-C per-N rate form) against imp-36151 (no ' +
      'unconditionally pinned Route-C exponent), resolving the apparent tension as an axis difference (conditional ' +
      'FORM vs unconditional pinned EXPONENT) with NO contradiction and NO overclaim in either module. Closes ' +
      'nothing; per-N translation and G3a_max_gap stay OPEN; respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36276_ROUTEC_PERN_RATE_FORM_CONDITIONAL_RECONCILIATION_ASSERTIONS = [
  {
    id: 'imp36276-imp36137-is-conditional-not-pinned',
    why: 'The reconciliation rests on imp-36137 being a CONDITIONAL form, not an unconditionally pinned exponent: ' +
         'its own record must keep the per-N translation and G3a_max_gap OPEN, close no gap, and sit at ' +
         'CONSUMABLE-MODULO-G3a. If imp-36137 ever flips to a closure/pinned claim the reconciliation breaks.',
    holds: () =>
      IMP36137.honestCaveat.perNTranslationStaysOpen === true &&
      IMP36137.honestCaveat.g3aMaxGapStaysOpen === true &&
      IMP36137.honestCaveat.closesAnyGap === false &&
      IMP36137.consumability.status === 'CONSUMABLE-MODULO-G3a',
  },
  {
    id: 'imp36276-imp36151-has-no-pinned-routeC-exponent',
    why: 'The other side of the reconciliation: imp-36151 must record NO pinned Route-C exponent (rateForm null, ' +
         'exponentPinned false) blocked by G3a_max_gap. A change there would move the tension.',
    holds: () =>
      IMP36151.routeC.rateForm === null &&
      IMP36151.routeC.exponentPinned === false &&
      /G3a_max_gap/.test(IMP36151.routeC.exponentBlockedBy),
  },
  {
    id: 'imp36276-no-contradiction-different-axes',
    why: 'The verdict: the two records are NOT contradictory -- they answer different axes (conditional FORM vs ' +
         'unconditional pinned EXPONENT), with imp-36151 authoritative on the pinned exponent and imp-36137 on ' +
         'the conditional form. No overclaim is flagged in either.',
    holds: () => {
      const r = IMP36276_ROUTEC_PERN_RATE_FORM_CONDITIONAL_RECONCILIATION.resolution;
      return (
        r.isContradiction === false &&
        r.imp36137IsConditionalNotPinned === true &&
        r.imp36137ContradictsImp36151 === false &&
        r.authoritativeOnPinnedExponent === 'imp-36151' &&
        r.authoritativeOnConditionalForm === 'imp-36137' &&
        r.overclaimFlagged === false &&
        r.bothCarryHonestCaveats === true
      );
    },
  },
  {
    id: 'imp36276-both-keep-g3a-and-perN-open',
    why: 'Consistency check: BOTH source modules must keep G3a_max_gap open, so the reconciliation cannot be ' +
         'smuggling a closure. Both honestCaveat.g3aMaxGapStaysOpen must be true.',
    holds: () =>
      IMP36137.honestCaveat.g3aMaxGapStaysOpen === true &&
      IMP36151.honestCaveat.g3aMaxGapStaysOpen === true,
  },
  {
    id: 'imp36276-honest-no-closure-no-qed',
    why: 'Mandatory honesty: a RECONCILIATION that closes NOTHING, discharges no gap, keeps the per-N translation ' +
         'and G3a_max_gap OPEN, finds no contradiction, flags no overclaim, carries NO RH verdict, no refereed bound is changed.',
    holds: () => {
      const h = IMP36276_ROUTEC_PERN_RATE_FORM_CONDITIONAL_RECONCILIATION.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesG5PerNTranslation === false &&
        h.reconcilesTwoRecords === true &&
        h.findsContradiction === false &&
        h.flagsOverclaim === false &&
        h.g3aMaxGapStaysOpen === true &&
        h.perNTranslationStaysOpen === true &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36276_ROUTEC_PERN_RATE_FORM_CONDITIONAL_RECONCILIATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36276-routeC-perN-rate-form-conditional-reconciliation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36276_ROUTEC_PERN_RATE_FORM_CONDITIONAL_RECONCILIATION;
