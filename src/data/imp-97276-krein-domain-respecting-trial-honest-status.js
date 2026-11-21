/**
 * @fileoverview imp-97276 -- import-light honest-status note recording the imp-97228 VERDICT: no
 * accessible domain-respecting (smooth mode-cutoff) Krein trial vector yields a finite, small Temple
 * defect eta2 = ||T_a[sigma_2] psi - mu psi||^2 at 2a=ln3. imp-97228 swept a raised-cosine (Hann) taper
 * of cutoff width w over the committed polynomial Ritz coefficients (imp-97162 baseline eta2 ~ 2.42e9)
 * and found: (1) tapering reduces eta2 by AT MOST ~1 order of magnitude (minimum ~1.67e8 at w=8, still
 * ~3e8 times mu), never to O(1) or O(mu); (2) that minimum is bought by destroying the approximation
 * (mu blows up to 0.895, far above the 0.5 uniform-N target -- no window has both small eta2 and
 * near-floor mu); (3) eta2 STILL GROWS with the evaluation space Nbig for EVERY taper width, so the
 * divergence is a t-space (t^4 weight of sigma_2) phenomenon, not a mode-space one -- no finite
 * mode-space window can cure it.
 *
 * WHY A NOTE (not a re-derivation). imp-97228 already carries the full sweep, its own self-executing
 * assertions, and the exact verdict flags. This module only records the honest status for the frontier
 * index: the obstruction is intrinsic to the unbounded operator acting within the polynomial/Gegenbauer
 * basis, uncurable by trial-vector choice inside that basis, and what would be needed to escape it.
 *
 * WHAT REMAINS OPEN (imp-97228 named residual, unaffected by this note):
 *   a finite small eta2 would require a trial vector from OUTSIDE the polynomial/Gegenbauer family --
 *   e.g. a genuine t-space smooth-cutoff/Gaussian function projected exactly onto dom(A) -- not yet
 *   built (SUB-GAP IMP97228_DOMAIN_RESPECTING_TRIAL_NO_FINITE_ETA2).
 * No bound on Lambda moves; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-97228-krein-domain-respecting-trial-eta2.js (source of every verdict flag below)
 * @see imp-97162-krein-temple-defect-eta2-measurement.js (SUB-GAP IMP97162_TEMPLE_DEFECT_ETA2_HUGE this note's source sharpens)
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (INGREDIENT 1/2 double obstruction)
 *
 * Ticket: imp-97276 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * no refereed bound is changed.
 */

import IMP97228_DEFAULT, { IMP97228_VERDICT, IMP97228_BEST, IMP97228_RIGOROUS_REACH_2A } from './imp-97228-krein-domain-respecting-trial-eta2.js';

export const IMP97276_STATUS = Object.freeze({
  ticket: 'imp-97276',
  sourceTicket: 'imp-97228',
  eta2StaysAstronomical: IMP97228_VERDICT.eta2StaysAstronomical,
  reductionAtMostOneOrderOfMagnitude: IMP97228_VERDICT.reductionAtMostOneOrderOfMagnitude,
  eta2MinBoughtByMuBlowup: IMP97228_VERDICT.eta2MinBoughtByMuBlowup,
  noWindowWithSmallEta2AndNearFloorMu: IMP97228_VERDICT.noWindowWithSmallEta2AndNearFloorMu,
  everyTaperStillDivergesInNbig: IMP97228_VERDICT.everyTaperStillDivergesInNbig,
  obstructionIsTSpaceNotModeSpace: IMP97228_VERDICT.obstructionIsTSpaceNotModeSpace,
  smoothModeCutoffCannotCure: IMP97228_VERDICT.smoothModeCutoffCannotCure,
  noAccessibleDomainRespectingTrialGivesFiniteSmallEta2: IMP97228_VERDICT.noAccessibleDomainRespectingTrialGivesFiniteSmallEta2,
  sharpensImp97162DoubleObstruction: IMP97228_VERDICT.sharpensImp97162DoubleObstruction,
  eta2MinReached: IMP97228_BEST.eta2Min,
  intervalRigorousReach2a: IMP97228_RIGOROUS_REACH_2A,
  subGap: IMP97228_VERDICT.subGap,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97276_HONEST_BANNER =
  'imp-97228 result recorded: no accessible domain-respecting (smooth mode-cutoff) Krein trial vector ' +
  'yields a finite, small Temple defect eta2 at 2a=ln3. A raised-cosine taper of the Ritz coefficients ' +
  'reduces eta2 by at most ~1 order of magnitude (2.42e9 -> 1.67e8, still ~3e8 times mu), and only by ' +
  'driving mu to ~0.895 -- far above the 0.5 uniform-N target, so no taper gives both small eta2 and a ' +
  'near-floor mu. Every taper width still diverges in the evaluation space Nbig, showing the obstruction ' +
  'is an intrinsic t-space (t^4 sigma_2 weight) phenomenon, not a mode-space artifact -- uncurable by ' +
  'trial-vector choice within the polynomial/Gegenbauer basis. A finite small eta2 would need a trial ' +
  'from outside this basis, not yet built. No bound on Lambda moves; interval-rigorous reach stays ' +
  '2a<=0.96; no refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97276_ASSERTIONS = [
  {
    id: 'imp97276-status-matches-committed-imp97228-verdict',
    holds: () =>
      IMP97276_STATUS.eta2StaysAstronomical === IMP97228_VERDICT.eta2StaysAstronomical &&
      IMP97276_STATUS.reductionAtMostOneOrderOfMagnitude === IMP97228_VERDICT.reductionAtMostOneOrderOfMagnitude &&
      IMP97276_STATUS.eta2MinBoughtByMuBlowup === IMP97228_VERDICT.eta2MinBoughtByMuBlowup &&
      IMP97276_STATUS.everyTaperStillDivergesInNbig === IMP97228_VERDICT.everyTaperStillDivergesInNbig &&
      IMP97276_STATUS.noAccessibleDomainRespectingTrialGivesFiniteSmallEta2 === IMP97228_VERDICT.noAccessibleDomainRespectingTrialGivesFiniteSmallEta2 &&
      IMP97276_STATUS.subGap === IMP97228_VERDICT.subGap &&
      IMP97228_DEFAULT === IMP97228_VERDICT,
    why: 'this honest-status note must reproduce the exact verdict flags and sub-gap bookkeeping already established by imp-97228, not a re-derivation.',
  },
  {
    id: 'imp97276-honesty-gate-no-qed',
    holds: () =>
      IMP97276_STATUS.anyBoundMoved === false &&
      IMP97276_STATUS.operatorPositivityProved === false &&
      IMP97276_STATUS.rhResolved === false &&
      IMP97276_STATUS.qed === false &&
      IMP97276_STATUS.intervalRigorousReach2a === 0.96 &&
      /NO QED/.test(IMP97276_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97276_HONEST_BANNER) &&
      /RH open/.test(IMP97276_HONEST_BANNER),
    why: 'documentation only: no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97276_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97276-krein-domain-respecting-trial-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97276_STATUS, banner: IMP97276_HONEST_BANNER };
