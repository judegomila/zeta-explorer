/**
 * @module imp-36144-kbn-kahan-intermittency-band-viz-data
 * @fileoverview imp-36144 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-36095 fine step-250 KBN-vs-
 *   classic-Kahan separation INTERMITTENCY band across N in [34000, 40000] on the
 *   imp-35852 clustered worst order.
 *
 *   Shows the 25-rung sep/identical alternation: 15 rungs strictly separated (KBN error
 *   != classic-Kahan error) and 10 rungs bit-identical, interleaved rung-to-rung with no
 *   single clean identical block. The genuinely bit-identical run is 34250-35000 (four
 *   consecutive rungs); the LAST bit-identical rung is N = 39000, with persistence
 *   (every tested rung separated) setting in from N ~ 39250. kappa rises near-
 *   monotonically (~361.5 -> ~396.0) across the band while the sep/identical verdict
 *   does NOT track kappa -- a fine rounding-level event, not a conditioning-driven
 *   crossover.
 *
 *   This module does not import imp-36095 or re-run its measurement (no re-deriving at
 *   page-load time); it only bakes the recorded literals (imp-36095 module doc-comment
 *   table) for direct charting.
 *
 *   @see imp-36095-kbn-kahan-intermittency-band.js (source measurement)
 *   @see imp-36094-kbn-kahan-naive-error-ladder-viz-data.js (sibling viz-data pattern)
 *   @see imp-36062-kbn-kahan-separation-onset (located the N~34000 onset)
 *   @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst ORDER)
 *
 *   Ticket: imp-36144 (ux, medium). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

const U_ROUNDOFF = 2 ** -53; // unit roundoff u ~ 1.1102e-16

// imp-36095 measured fine step-250 ladder across [34000, 40000] (25 rungs) on the
// imp-35852 clustered worst order; separated = KBN error strictly differs from Kahan error.
export const IMP36144_INTERMITTENCY_LADDER = Object.freeze([
  { N: 34000, kappa: 361.5, kahan: 2.42e-19, kbn: 2.33e-19, separated: true },
  { N: 34250, kappa: 362.7, kahan: 4.45e-20, kbn: 4.45e-20, separated: false },
  { N: 34500, kappa: 367.7, kahan: 2.31e-19, kbn: 2.31e-19, separated: false },
  { N: 34750, kappa: 373.5, kahan: 1.02e-19, kbn: 1.02e-19, separated: false },
  { N: 35000, kappa: 376.2, kahan: 1.72e-19, kbn: 1.72e-19, separated: false },
  { N: 35250, kappa: 374.6, kahan: 4.05e-19, kbn: 6.12e-20, separated: true },
  { N: 35500, kappa: 371.2, kahan: 5.82e-19, kbn: 1.17e-19, separated: true },
  { N: 35750, kappa: 370.2, kahan: 1.93e-19, kbn: 1.93e-19, separated: false },
  { N: 36000, kappa: 373.6, kahan: 6.0e-20, kbn: 6.0e-20, separated: false },
  { N: 36250, kappa: 379.7, kahan: 1.47e-20, kbn: 1.47e-20, separated: false },
  { N: 36500, kappa: 384.1, kahan: 3.64e-19, kbn: 9.4e-20, separated: true },
  { N: 36750, kappa: 383.9, kahan: 6.97e-19, kbn: 2.16e-19, separated: true },
  { N: 37000, kappa: 380.4, kahan: 1.51e-19, kbn: 1.51e-19, separated: false },
  { N: 37250, kappa: 378.2, kahan: 2.33e-19, kbn: 2.2e-19, separated: true },
  { N: 37500, kappa: 380.5, kahan: 5.53e-19, kbn: 1.01e-19, separated: true },
  { N: 37750, kappa: 386.4, kahan: 5.17e-20, kbn: 5.17e-20, separated: false },
  { N: 38000, kappa: 391.6, kahan: 5.6e-19, kbn: 1.11e-19, separated: true },
  { N: 38250, kappa: 392.1, kahan: 3.33e-19, kbn: 1.14e-19, separated: true },
  { N: 38500, kappa: 388.7, kahan: 3.25e-19, kbn: 1.2e-19, separated: true },
  { N: 38750, kappa: 386.0, kahan: 3.04e-19, kbn: 1.41e-19, separated: true },
  { N: 39000, kappa: 388.0, kahan: 1.23e-19, kbn: 1.23e-19, separated: false },
  { N: 39250, kappa: 393.9, kahan: 4.21e-19, kbn: 2.09e-20, separated: true },
  { N: 39500, kappa: 399.2, kahan: 3.81e-19, kbn: 5.93e-20, separated: true },
  { N: 39750, kappa: 399.6, kahan: 3.79e-19, kbn: 5.96e-20, separated: true },
  { N: 40000, kappa: 396.0, kahan: 3.9e-19, kbn: 4.76e-20, separated: true },
]);

export const IMP36144_BAND_MARKERS = Object.freeze({
  bandLo: 34000,
  bandHi: 40000,
  step: 250,
  rungs: 25,
  separatedCount: 15,
  identicalCount: 10,
  genuineIdenticalRunLo: 34250,
  genuineIdenticalRunHi: 35000,
  lastIdenticalN: 39000,
  persistentFromN: 39250,
  kappaLo: 361.5,
  kappaHi: 396.0,
});

export const IMP36144_INTERMITTENCY_VIZ_DATA = {
  ticket: 'imp-36144',
  sourceTicket: 'imp-36095',
  ladder: IMP36144_INTERMITTENCY_LADDER,
  markers: IMP36144_BAND_MARKERS,
  note:
    'imp-36095 fine step-250 KBN-vs-classic-Kahan separation intermittency band across N in ' +
    '[34000, 40000] (25 rungs) on the imp-35852 clustered worst order: 15 rungs strictly ' +
    'separated, 10 bit-identical, alternating rung-to-rung. Genuine identical run 34250-35000; ' +
    'last identical rung N=39000; persistence from N~39250. kappa rises near-monotonically ' +
    '(~361.5 -> ~396.0) while the sep/identical verdict does not track it.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-36095 measurement exactly; adds no new ' +
    'derivation and changes no bound. Measurement only on a fixed representative term family; ' +
    'certifies no W1 bound; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) ' +
    'and MECHANICAL (imp-35725). NO QED. No refereed bound is changed.',
};

export const IMP36144_VIZ_ASSERTIONS = [
  {
    id: 'imp36144-ladder-25-rungs',
    description: 'ladder has exactly 25 rungs spanning [34000, 40000] at step 250',
    holds: () =>
      IMP36144_INTERMITTENCY_LADDER.length === 25 &&
      IMP36144_INTERMITTENCY_LADDER[0].N === 34000 &&
      IMP36144_INTERMITTENCY_LADDER[24].N === 40000,
  },
  {
    id: 'imp36144-separated-identical-counts',
    description: '15 separated + 10 bit-identical rungs, matching imp-36095',
    holds: () =>
      IMP36144_INTERMITTENCY_LADDER.filter((r) => r.separated).length === 15 &&
      IMP36144_INTERMITTENCY_LADDER.filter((r) => !r.separated).length === 10,
  },
  {
    id: 'imp36144-genuine-identical-run',
    description: 'the 34250-35000 run is bit-identical (four consecutive rungs)',
    holds: () =>
      IMP36144_INTERMITTENCY_LADDER.filter((r) => r.N >= 34250 && r.N <= 35000).every(
        (r) => !r.separated,
      ),
  },
  {
    id: 'imp36144-persistence-onset',
    description: 'last identical rung N=39000; every rung from N=39250 up is separated',
    holds: () => {
      const lastIdentical = IMP36144_INTERMITTENCY_LADDER.filter((r) => !r.separated).slice(-1)[0];
      return (
        lastIdentical.N === IMP36144_BAND_MARKERS.lastIdenticalN &&
        IMP36144_INTERMITTENCY_LADDER.filter((r) => r.N >= IMP36144_BAND_MARKERS.persistentFromN).every(
          (r) => r.separated,
        )
      );
    },
  },
  {
    id: 'imp36144-compensated-below-unit-roundoff',
    description: 'both Kahan and KBN normalized errors stay below u at every rung',
    holds: () => IMP36144_INTERMITTENCY_LADDER.every((r) => r.kahan < U_ROUNDOFF && r.kbn < U_ROUNDOFF),
  },
  {
    id: 'imp36144-honesty-gate-no-qed',
    description: 'honest status references measurement-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP36144_INTERMITTENCY_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP36144_INTERMITTENCY_VIZ_DATA.honest) &&
      /NO QED/.test(IMP36144_INTERMITTENCY_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP36144_INTERMITTENCY_VIZ_DATA.honest),
  },
];

for (const a of IMP36144_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36144-kbn-kahan-intermittency-band-viz-data assertion failed: ${a.id}`);
  }
}
