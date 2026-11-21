/**
 * @module imp-35958-e-share-decomposition-viz-data
 * @fileoverview imp-35958 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35889 three-term
 *   E(N) = E_trunc + E_flow + E_coll fractional-share decomposition at the two
 *   imp-35853 REQ-4 required-height knees (Kneedle elbow N ~ 2.13e8, flattest
 *   point N ~ 7.20e9). imp-35889 computed the exact split by re-running the
 *   pinned imp-3406 / imp-33582 sub-terms through the effectiveHeightForN /
 *   C_C_PINNED import chain; this module copies the resulting two-row table
 *   verbatim so a page can render it without pulling in that chain.
 *
 *   The literals are copied verbatim from an esbuild-bundled, plain-node
 *   evaluation of imp-35889-e-share-decomposition-at-knees.js (no dev-server
 *   ssrLoadModule, per [[verify_heavy_assertion_modules]]).
 *
 *   @see imp-35889-e-share-decomposition-at-knees.js (source measurement)
 *   @see imp-35853-req4-required-height-continuous-sigma-knee (the two knee locators)
 *   @see imp-35897-kappa-sweep-ceiling-floor-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-35958 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

// The two imp-35853 knee rows, verbatim from imp-35889 (E_trunc/E_flow/E_coll
// split and fractional shares of E(N) at each knee).
export const IMP35958_E_SHARE_KNEES_SWEEP = Object.freeze([
  {
    label: 'Kneedle-elbow',
    sigmaTarget: 0.783,
    N: 212530000,
    logT0: 18.2757,
    E_trunc: 0.0000306,
    E_flow: 5.865e-7,
    E_coll: 0.00011253,
    E_N: 0.00014372,
    shareTrunc: 0.21292,
    shareFlow: 0.004081,
    shareColl: 0.783,
    dominant: 'E_coll',
    truncOverColl: 0.2719,
  },
  {
    label: 'Flattest-point',
    sigmaTarget: 0.407,
    N: 7198500000,
    logT0: 21.603,
    E_trunc: 0.0000306,
    E_flow: 2.9628e-8,
    E_coll: 0.000021022,
    E_N: 0.000051652,
    shareTrunc: 0.59243,
    shareFlow: 0.000574,
    shareColl: 0.407,
    dominant: 'E_trunc',
    truncOverColl: 1.4556,
  },
]);

export const IMP35958_SCALES = Object.freeze({
  balanceCrossoverSigma: 0.5, // E_trunc = E_coll crossover (imp-35337), sits BETWEEN the two knees
  dominantTermFlips: true, // E_coll (elbow) -> E_trunc (flattest point)
});

export const IMP35958_E_SHARE_VIZ_DATA = {
  ticket: 'imp-35958',
  sourceTicket: 'imp-35889',
  sweep: IMP35958_E_SHARE_KNEES_SWEEP,
  scales: IMP35958_SCALES,
  note:
    'At the Kneedle elbow (sigma ~ 0.783, N ~ 2.13e8) E_coll DOMINATES E(N) with share ~ 0.783; ' +
    'E_trunc is runner-up (~ 0.213) and E_flow is negligible (~ 0.004). At the flattest point ' +
    '(sigma ~ 0.407, N ~ 7.20e9) E_trunc DOMINATES with share ~ 0.592; E_coll drops to runner-up ' +
    '(~ 0.407) and E_flow is smaller still (~ 0.0006). The dominant term FLIPS between the two ' +
    'knees because E_flow is negligible at both, so sigma ~ E_coll / (E_trunc + E_coll) and the ' +
    'E_trunc = E_coll crossover (sigma = 1/2, imp-35337) sits BETWEEN the two knees.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35889 E_trunc/E_flow/E_coll share ' +
    'decomposition at the two imp-35853 knees; adds no new derivation and changes no bound. ' +
    'Measurement only; certifies no W1 bound; establishes no operator positivity; C_C = ' +
    '(1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb ' +
    'GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35958_VIZ_ASSERTIONS = [
  {
    id: 'imp35958-two-knees-present',
    description: 'sweep has exactly the two imp-35853 knee rows, elbow before flattest point',
    holds: () =>
      IMP35958_E_SHARE_KNEES_SWEEP.length === 2 &&
      IMP35958_E_SHARE_KNEES_SWEEP[0].label === 'Kneedle-elbow' &&
      IMP35958_E_SHARE_KNEES_SWEEP[1].label === 'Flattest-point' &&
      IMP35958_E_SHARE_KNEES_SWEEP[0].N < IMP35958_E_SHARE_KNEES_SWEEP[1].N,
  },
  {
    id: 'imp35958-dominant-term-flips',
    description: 'dominant term flips E_coll (elbow) -> E_trunc (flattest point), truncOverColl crosses 1',
    holds: () => {
      const [elbow, flat] = IMP35958_E_SHARE_KNEES_SWEEP;
      return (
        elbow.dominant === 'E_coll' &&
        flat.dominant === 'E_trunc' &&
        elbow.truncOverColl < 1 &&
        flat.truncOverColl > 1 &&
        IMP35958_SCALES.dominantTermFlips === true
      );
    },
  },
  {
    id: 'imp35958-shares-sum-to-one-each-row',
    description: 'shareTrunc + shareFlow + shareColl ~ 1 at each knee, and E_coll share matches its sigma target',
    holds: () =>
      IMP35958_E_SHARE_KNEES_SWEEP.every(
        (r) =>
          Math.abs(r.shareTrunc + r.shareFlow + r.shareColl - 1) < 1e-3 &&
          Math.abs(r.shareColl - r.sigmaTarget) < 1e-3
      ),
  },
  {
    id: 'imp35958-eflow-negligible-and-decaying',
    description: 'E_flow share stays below 0.01 at both knees and is smaller at the higher (flattest-point) knee',
    holds: () => {
      const [elbow, flat] = IMP35958_E_SHARE_KNEES_SWEEP;
      return elbow.shareFlow < 0.01 && flat.shareFlow < 0.01 && flat.E_flow < elbow.E_flow;
    },
  },
  {
    id: 'imp35958-crossover-between-the-two-knees',
    description: 'the E_trunc = E_coll crossover (sigma = 1/2) sits strictly between the two knee sigma targets',
    holds: () => {
      const [elbow, flat] = IMP35958_E_SHARE_KNEES_SWEEP;
      return flat.sigmaTarget < IMP35958_SCALES.balanceCrossoverSigma && IMP35958_SCALES.balanceCrossoverSigma < elbow.sigmaTarget;
    },
  },
  {
    id: 'imp35958-honesty-gate-no-qed',
    description: 'honest status references measurement-only, imp-486 kept, imp-35337a OPEN, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP35958_E_SHARE_VIZ_DATA.honest) &&
      /imp-486/.test(IMP35958_E_SHARE_VIZ_DATA.honest) &&
      /NO QED/.test(IMP35958_E_SHARE_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP35958_E_SHARE_VIZ_DATA.honest),
  },
];

for (const a of IMP35958_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35958-e-share-decomposition-viz-data assertion failed: ${a.id}`);
  }
}
