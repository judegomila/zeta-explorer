/**
 * @module imp-97413-sigma-ladder-subdecade-knee-viz-data
 * @fileoverview imp-97413 -- lightweight, import-light literal data for a
 *   visualization that puts the imp-33582 sigma(N) post-peak per-decade local
 *   decay-exponent ladder (0.0105 -> 0.4310, ramping toward the imp-3463
 *   far-tail 1/2 asymptote) on the SAME chart as the imp-33721 sub-decade
 *   ramp-curvature knee: the single D2 (acceleration) sign change, refined
 *   to N* ~ 3.38e9 (log10 N* ~ 9.529) inside the [1e9,1e10] decade -- a full
 *   decade below the coarse [1e10,1e11] bracket imp-33701 originally reported.
 *
 *   Values below are baked reference literals reproduced from the published
 *   `perDecadeLadder` field of imp-33582-sigma-postpeak-nearpeak-threshold-decay.js
 *   and the `inflectionLog10Nstar` / `inflectionNstar` fields of
 *   imp-33721-sigma-ramp-inflection-subdecade.js; this module does NOT
 *   re-run either computation, so importing it into a page costs nothing at
 *   load time.
 *
 *   @see imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (the six-decade ladder)
 *   @see imp-33721-sigma-ramp-inflection-subdecade.js (the sub-decade knee N* ~ 3.38e9)
 *   @see imp-33607-sigma-postpeak-decay-viz-data.js (the ladder alone, no knee marker)
 *   @see imp-33762-subdecade-exponent-ramp-curvature-viz-data.js (the knee alone, no six-decade ladder)
 *
 *   Ticket: imp-97413 (ux, low). Presentation only of two already-established
 *   measurements combined on one axis; adds no new Lambda bound. imp-3066
 *   K_a>=0 UNTOUCHED. RH-EQUIVALENT. NO QED.
 */

// Six-decade per-decade local exponent ladder (imp-33582 perDecadeLadder, k = 6..11),
// each bracket labeled by its log10 N span so it can share an axis with the knee marker.
export const IMP97413_EXPONENT_LADDER = Object.freeze([
  { decade: '1e6->1e7', loD: 6, hiD: 7, p_local: 0.0105 },
  { decade: '1e7->1e8', loD: 7, hiD: 8, p_local: 0.0447 },
  { decade: '1e8->1e9', loD: 8, hiD: 9, p_local: 0.1176 },
  { decade: '1e9->1e10', loD: 9, hiD: 10, p_local: 0.236 },
  { decade: '1e10->1e11', loD: 10, hiD: 11, p_local: 0.3561 },
  { decade: '1e11->1e12', loD: 11, hiD: 12, p_local: 0.431 },
]);

export const IMP97413_EXPONENT_ASYMPTOTE = 0.5; // imp-3463 far-tail 1/2

// imp-33721 sub-decade ramp-curvature knee: the single D2 zero-crossing, refined to
// log10 N* ~ 9.529 (N* ~ 3.38e9) -- lands inside the [1e9,1e10] decade bar above.
export const IMP97413_KNEE_MARKER = Object.freeze({
  log10Nstar: 9.529,
  Nstar: 3.38e9,
  coarseDecade: '1e10->1e11', // imp-33701 whole-decade bracket the sub-decade grid corrects
  refinedDecade: '1e9->1e10', // imp-33721 sub-decade bracket the knee actually sits in
});

// imp-33582 sigma = 1/2 halving landmark, which imp-33721 F3 finds the knee sits ~3.3% above.
export const IMP97413_HALVING_LANDMARK = Object.freeze({ N: 3.27e9, log10N: Math.log10(3.27e9) });

export default Object.freeze({
  id: 'imp-97413-sigma-ladder-subdecade-knee-viz-data',
  ticket: 'imp-97413',
  source: [
    'imp-33582-sigma-postpeak-nearpeak-threshold-decay.js',
    'imp-33721-sigma-ramp-inflection-subdecade.js',
  ],
  exponentLadder: IMP97413_EXPONENT_LADDER,
  exponentAsymptote: IMP97413_EXPONENT_ASYMPTOTE,
  kneeMarker: IMP97413_KNEE_MARKER,
  halvingLandmark: IMP97413_HALVING_LANDMARK,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97413_ASSERTIONS = [
  {
    id: 'imp97413-ladder-monotone-below-asymptote',
    holds: () => {
      for (let i = 1; i < IMP97413_EXPONENT_LADDER.length; i++) {
        if (!(IMP97413_EXPONENT_LADDER[i].p_local > IMP97413_EXPONENT_LADDER[i - 1].p_local)) return false;
      }
      return IMP97413_EXPONENT_LADDER.every((r) => r.p_local > 0 && r.p_local < IMP97413_EXPONENT_ASYMPTOTE);
    },
    why: 'The plotted ladder must reproduce the imp-33582 monotone ramp toward, but never reaching, the far-tail 1/2 asymptote.',
  },
  {
    id: 'imp97413-decade-spans-contiguous',
    holds: () => {
      for (let i = 1; i < IMP97413_EXPONENT_LADDER.length; i++) {
        if (IMP97413_EXPONENT_LADDER[i].loD !== IMP97413_EXPONENT_LADDER[i - 1].hiD) return false;
      }
      return true;
    },
    why: 'The decade brackets must tile [1e6,1e12] without gaps so the knee marker lands on a defined axis position.',
  },
  {
    id: 'imp97413-knee-in-refined-decade-not-coarse',
    holds: () =>
      IMP97413_KNEE_MARKER.log10Nstar >= 9 &&
      IMP97413_KNEE_MARKER.log10Nstar < 10 &&
      IMP97413_KNEE_MARKER.refinedDecade === '1e9->1e10' &&
      IMP97413_KNEE_MARKER.coarseDecade === '1e10->1e11',
    why: 'The imp-33721 F1 finding places the refined knee a full decade below the coarse imp-33701 bracket -- both must be shown, not just the refined one.',
  },
  {
    id: 'imp97413-knee-near-halving-landmark',
    holds: () => Math.abs(IMP97413_KNEE_MARKER.Nstar / IMP97413_HALVING_LANDMARK.N - 1) < 0.05,
    why: 'imp-33721 F3: the refined knee sits within ~5% of the imp-33582 sigma=1/2 halving landmark.',
  },
];

for (const assertion of IMP97413_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97413-sigma-ladder-subdecade-knee-viz-data assertion failed: ${assertion.id}`);
  }
}
