/**
 * @module imp-35900-multiple-not-pt-anchor-asymptote-honest-status
 * @fileoverview imp-35900 -- standalone HONEST-STATUS note recording the imp-35853 finding
 *   that the ~6.96x PT-anchor required-height multiple is NOT an asymptote the continuous
 *   sigma-curve settles onto. Read-only note: imports the imp-35853 module verbatim (no
 *   re-derivation, no new numerics), restates the finding, and states the conclusion plainly
 *   for a reader who lands on this ticket without having read imp-35853 in full: the multiple
 *   200 / log T0 keeps DESCENDING below ~6.96x for smaller sigma / larger height, so ~6.96x is
 *   only the value the multiple takes AT the Platt-Trudgian-verified height (log T0 ~ 28.73,
 *   T_PT = 3e12) -- it is a point value on the curve, not a floor the curve flattens onto.
 *
 *   Ticket: imp-35900 (content, low). Note only; re-reads nothing new; changes no bound;
 *   no refereed bound is changed; NO QED.
 *
 *   @see imp-35853-req4-required-height-continuous-sigma-knee.js (source module this note restates)
 *   @see imp-35813-req4-required-height-sigma-landmark-extend.js (discrete sigma-landmark rungs)
 *   @see imp-35538-route-i-remainder-derivation-requirements.js (REQ 4; binding log-height 200)
 */

import { IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE } from './imp-35853-req4-required-height-continuous-sigma-knee.js';

const SRC = IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE;

export const IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS = Object.freeze({
  id: 'imp-35900',
  title:
    'Honest-status note: the ~6.96x PT-anchor required-height multiple is NOT an asymptote the ' +
    'sigma-curve settles onto -- it is the value AT the anchor, and the multiple keeps descending below it',
  sourceModule: 'imp-35853-req4-required-height-continuous-sigma-knee.js',

  ptAnchor: Object.freeze({ ...SRC.ptAnchor }),
  multipleFlattensOntoPtFloor: SRC.multipleFlattensOntoPtFloor,
  flattestPoint: Object.freeze({ ...SRC.flattestPoint }),

  conclusion:
    'The imp-35853 continuous sigma-sweep shows the required-height multiple 200 / log T0 does NOT ' +
    'flatten onto its ~6.96x Platt-Trudgian-anchor value in sigma-space. Its rate of descent reaches a ' +
    'shallow minimum (~3.5) at a mid-downslope flattest point (sigma ~ 0.407, multiple ~ 9.25x), then ' +
    'RE-STEEPENS on the deep approach to the anchor (|slope| climbing back to ~19 near sigma ~ 0.019). ' +
    'So ~6.96x is the multiple the curve happens to take AT the PT-verified height (log T0 ~ 28.73, ' +
    'T_PT = 3e12) -- a point value, not a settled-onto floor -- and the multiple would keep descending ' +
    'below 6.96x for any smaller sigma / larger height reached beyond the PT anchor.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    isAsymptote: false,
    changesAnyBound: false,
    reDerivesAnything: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT-ONLY restatement of imp-35853: the ~6.96x PT-anchor required-height multiple is NOT an ' +
    'asymptote -- the multiple keeps descending below 6.96x for smaller sigma / larger height, so 6.96x is ' +
    'the value at the Platt-Trudgian anchor, not a floor. Note only; changes no bound; NO QED.',
});

export const IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp35900-does-not-flatten-onto-floor',
    why: 'The core claim of this note must match the imp-35853 source verdict: the multiple does not flatten onto the PT-anchor value.',
    holds: () =>
      IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS.multipleFlattensOntoPtFloor === false &&
      SRC.multipleFlattensOntoPtFloor === false,
  },
  {
    id: 'imp35900-pt-anchor-value-matches-source',
    why: 'The recorded PT-anchor multiple must match the imp-35853 source value (~6.96x at log T0 ~ 28.73).',
    holds: () =>
      Math.abs(IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS.ptAnchor.multiple - 6.9614) < 5e-3 &&
      Math.abs(IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS.ptAnchor.logT0 - 28.73) < 5e-3,
  },
  {
    id: 'imp35900-resteepens-on-deep-approach',
    why: 'The conclusion must record that the slope re-steepens on the deep approach (min slope < max slope at the flattest point), so there is no settled-onto floor.',
    holds: () =>
      IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS.flattestPoint.minAbsSlope <
      IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS.flattestPoint.maxAbsSlope,
  },
  {
    id: 'imp35900-conclusion-mentions-descending-below',
    why: 'The conclusion text must plainly state the multiple keeps descending below 6.96x for smaller sigma / larger height.',
    holds: () => /descending\s+below\s+6\.96x/.test(IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp35900-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim a proof, an asymptote, or a bound change.',
    holds: () =>
      IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS.honestCaveat.isAsymptote === false &&
      IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp35900-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35900-multiple-not-pt-anchor-asymptote-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP35900_MULTIPLE_NOT_PT_ANCHOR_ASYMPTOTE_HONEST_STATUS;
