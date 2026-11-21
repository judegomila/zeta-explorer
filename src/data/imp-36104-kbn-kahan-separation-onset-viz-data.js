/**
 * @module imp-36104-kbn-kahan-separation-onset-viz-data
 * @fileoverview imp-36104 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-36062 finer 11-rung
 *   KBN-vs-classic-Kahan separation-onset ladder on the imp-35852 clustered worst
 *   order: N, kappa, classic-Kahan normalized error, KBN normalized error, and the
 *   KBN-strictly-tighter verdict at each rung.
 *
 *   Below N ~ 34000 the two schemes are BIT-IDENTICAL at every rung tested (N = 1000,
 *   10000, 30000, 33000); the FIRST strict separation appears at N = 34000
 *   (kappa ~ 361.5), and from there the KBN/Kahan ratio deepens from ~0.96 at the
 *   onset to ~0.08 at the N ~ 488602 endpoint (reproducing imp-36023).
 *
 *   This module does not import imp-36062 or re-run its measurement (no re-deriving
 *   at page-load time); it only bakes the recorded literals (imp-36062 module
 *   doc-comment table) for direct charting.
 *
 *   @see imp-36062-kbn-kahan-separation-onset.js (source measurement)
 *   @see imp-36144-kbn-kahan-intermittency-band-viz-data.js (sibling viz-data pattern)
 *   @see imp-36094-kbn-kahan-naive-error-ladder-viz-data.js (sibling viz-data pattern)
 *   @see imp-36023-kbn-combined-worst-ladder (coarse identical/separated endpoints)
 *   @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst ORDER)
 *
 *   Ticket: imp-36104 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

const U_ROUNDOFF = 2 ** -53; // unit roundoff u ~ 1.1102e-16

// imp-36062 measured finer 11-rung ladder straddling the imp-36023 identical->separated
// gap on the imp-35852 clustered worst order.
export const IMP36104_SEPARATION_ONSET_LADDER = Object.freeze([
  { N: 1000, kappa: 61.9, kahan: 3.74e-19, kbn: 3.74e-19, kbnStrictlyTighter: false },
  { N: 10000, kappa: 194.5, kahan: 3.51e-19, kbn: 3.51e-19, kbnStrictlyTighter: false },
  { N: 30000, kappa: 346.7, kahan: 7.35e-20, kbn: 7.35e-20, kbnStrictlyTighter: false },
  { N: 33000, kappa: 362.8, kahan: 1.45e-19, kbn: 1.45e-19, kbnStrictlyTighter: false },
  { N: 34000, kappa: 361.5, kahan: 2.42e-19, kbn: 2.33e-19, kbnStrictlyTighter: true },
  { N: 38000, kappa: 391.6, kahan: 5.6e-19, kbn: 1.11e-19, kbnStrictlyTighter: true },
  { N: 40000, kappa: 396.0, kahan: 3.9e-19, kbn: 4.76e-20, kbnStrictlyTighter: true },
  { N: 50000, kappa: 440.5, kahan: 2.76e-19, kbn: 1.15e-19, kbnStrictlyTighter: true },
  { N: 70000, kappa: 524.6, kahan: 2.84e-19, kbn: 4.63e-20, kbnStrictlyTighter: true },
  { N: 100000, kappa: 632.6, kahan: 3.74e-19, kbn: 9.73e-20, kbnStrictlyTighter: true },
  { N: 488602, kappa: 1391.0, kahan: 2.31e-19, kbn: 1.89e-20, kbnStrictlyTighter: true },
]);

export const IMP36104_ONSET_MARKERS = Object.freeze({
  firstSeparationN: 34000,
  firstSeparationKappa: 361.5,
  belowOnsetAllIdentical: true,
  onsetRatioKbnOverKahan: 2.33e-19 / 2.42e-19, // ~0.963 at the onset
  endpointRatioKbnOverKahan: 1.89e-20 / 2.31e-19, // ~0.082 at N~488602
  gapDeepensWithN: true,
});

export const IMP36104_SEPARATION_ONSET_VIZ_DATA = {
  ticket: 'imp-36104',
  sourceTicket: 'imp-36062',
  ladder: IMP36104_SEPARATION_ONSET_LADDER,
  markers: IMP36104_ONSET_MARKERS,
  note:
    'imp-36062 finer 11-rung KBN-vs-classic-Kahan separation-onset ladder on the imp-35852 ' +
    'clustered worst order, straddling the imp-36023 identical(N<=1e4)/separated(N~488602) gap. ' +
    'Bit-identical at every rung below N=34000; first strict separation at N=34000 (kappa~361.5); ' +
    'the KBN/Kahan ratio deepens from ~0.96 at onset to ~0.08 at the N~488602 endpoint.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-36062 measurement exactly; adds no new ' +
    'derivation and changes no bound. Measurement only on a fixed representative term family; ' +
    'certifies no W1 bound; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) ' +
    'and MECHANICAL (imp-35725). NO QED. No refereed bound is changed.',
};

export const IMP36104_VIZ_ASSERTIONS = [
  {
    id: 'imp36104-ladder-11-rungs',
    description: 'ladder has exactly 11 rungs from N=1000 to N=488602',
    holds: () =>
      IMP36104_SEPARATION_ONSET_LADDER.length === 11 &&
      IMP36104_SEPARATION_ONSET_LADDER[0].N === 1000 &&
      IMP36104_SEPARATION_ONSET_LADDER[10].N === 488602,
  },
  {
    id: 'imp36104-identical-below-onset',
    description: 'all four rungs below N=34000 are bit-identical (kbnStrictlyTighter false)',
    holds: () =>
      IMP36104_SEPARATION_ONSET_LADDER.filter((r) => r.N < 34000).length === 4 &&
      IMP36104_SEPARATION_ONSET_LADDER.filter((r) => r.N < 34000).every(
        (r) => r.kbnStrictlyTighter === false && r.kahan === r.kbn,
      ),
  },
  {
    id: 'imp36104-onset-at-34k',
    description: 'first strict separation is located at N=34000 with kappa in (340, 380)',
    holds: () =>
      IMP36104_ONSET_MARKERS.firstSeparationN === 34000 &&
      IMP36104_ONSET_MARKERS.firstSeparationKappa > 340 &&
      IMP36104_ONSET_MARKERS.firstSeparationKappa < 380,
  },
  {
    id: 'imp36104-gap-deepens-with-n',
    description: 'KBN/Kahan ratio deepens from ~0.96 at onset to ~0.08 at the endpoint',
    holds: () =>
      IMP36104_ONSET_MARKERS.gapDeepensWithN === true &&
      IMP36104_ONSET_MARKERS.onsetRatioKbnOverKahan > 0.8 &&
      IMP36104_ONSET_MARKERS.onsetRatioKbnOverKahan < 1 &&
      IMP36104_ONSET_MARKERS.endpointRatioKbnOverKahan < 0.2,
  },
  {
    id: 'imp36104-compensated-below-unit-roundoff',
    description: 'both Kahan and KBN normalized errors stay below u at every rung',
    holds: () =>
      IMP36104_SEPARATION_ONSET_LADDER.every((r) => r.kahan < U_ROUNDOFF && r.kbn < U_ROUNDOFF),
  },
  {
    id: 'imp36104-honesty-gate-no-qed',
    description: 'honest status references measurement-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP36104_SEPARATION_ONSET_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP36104_SEPARATION_ONSET_VIZ_DATA.honest) &&
      /NO QED/.test(IMP36104_SEPARATION_ONSET_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP36104_SEPARATION_ONSET_VIZ_DATA.honest),
  },
];

for (const a of IMP36104_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36104-kbn-kahan-separation-onset-viz-data assertion failed: ${a.id}`);
  }
}
