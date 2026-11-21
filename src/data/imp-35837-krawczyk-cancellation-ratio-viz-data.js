/**
 * @module imp-35837-krawczyk-cancellation-ratio-viz-data
 * @fileoverview imp-35837 -- VIZ DATA ONLY for the imp-35766 measurement of the imp-35266
 *   Krawczyk 2:1 surplus-split ratio R(N) = -dFP/dG ABOVE the imp-34693 admissible seed band:
 *   the deviation R - 2 DECREASES monotonically from band-top (~4.170e-4) to the Platt-Trudgian
 *   anchor N(T_PT=3e12) ~ 1.236e13 (~3.995e-4) and stays essentially flat out to N ~ 1e17
 *   (~3.998e-4), then diverges SPURIOUSLY upward beyond N ~ 1e18 (~5.785e-4 at N=1e20) as
 *   double-precision catastrophic cancellation in dG = S_inf(M_G - 1) takes over.
 *
 *   imp-35766 tabulated this four-landmark ladder but shipped no chart. Values below are baked
 *   reference literals reproduced verbatim from the imp-35766 measurement block (R_band_top,
 *   R_at_PT_anchor, R_1e17_still_reliable, R_1e20_float_artifact). This module does NOT import
 *   lambda-rh-height-mapping.js -- no fresh computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35766-krawczyk-cancellation-ratio-beyond-band.js (source of the baked literals)
 *   @see imp-35266-krawczyk-headroom-surplus-decomposition.js (the -dFP/dG ~ 2.00042 split)
 *   @see imp-35404-krawczyk-headroom-cancellation-viz-data.js (sibling viz-data pattern followed here)
 *
 *   Ticket: imp-35837 (ux, low). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

// -- four-landmark ratio-deviation ladder: N (zero-count index), R = -dFP/dG, dev = R - 2 --
export const IMP35837_LADDER = Object.freeze([
  Object.freeze({ label: 'band-top', N: 3.45e9, R: 2.000416987, dev: 4.16987e-4, reliable: true }),
  Object.freeze({ label: 'PT anchor', N: 1.236e13, R: 2.000399532, dev: 3.99532e-4, reliable: true }),
  Object.freeze({ label: 'N = 1e17', N: 1e17, R: 2.000399772, dev: 3.99772e-4, reliable: true }),
  Object.freeze({ label: 'N = 1e20', N: 1e20, R: 2.000578453, dev: 5.78453e-4, reliable: false }),
]);

export const IMP35837_SUMMARY = Object.freeze({
  devTightensBandTopToPT: IMP35837_LADDER[1].dev < IMP35837_LADDER[0].dev,
  devFlatPTTo1e17: Math.abs(IMP35837_LADDER[2].dev - IMP35837_LADDER[1].dev) < 5e-6,
  devSpuriousUpturnBeyond1e17: IMP35837_LADDER[3].dev > IMP35837_LADDER[2].dev,
});

export default Object.freeze({
  id: 'imp-35837-krawczyk-cancellation-ratio-viz-data',
  ticket: 'imp-35837',
  sources: ['imp-35766-krawczyk-cancellation-ratio-beyond-band.js'],
  ladder: IMP35837_LADDER,
  summary: IMP35837_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35837_ASSERTIONS = [
  {
    id: 'imp35837-four-landmarks-present-in-order',
    holds: () =>
      IMP35837_LADDER.length === 4 &&
      IMP35837_LADDER.map((r) => r.label).join(',') === 'band-top,PT anchor,N = 1e17,N = 1e20',
    why: 'The ladder must cover exactly the four imp-35766 landmarks (band-top, PT anchor, N=1e17, N=1e20) in ascending-N order.',
  },
  {
    id: 'imp35837-ratio-stays-near-two-throughout',
    holds: () => IMP35837_LADDER.every((r) => Math.abs(r.R - 2) < 1e-3),
    why: 'imp-35766 B1: -dFP/dG must stay within 1e-3 of 2 at every landmark, including the float-artifact one.',
  },
  {
    id: 'imp35837-deviation-tightens-band-top-to-PT-and-stays-flat-to-1e17',
    holds: () => IMP35837_SUMMARY.devTightensBandTopToPT === true && IMP35837_SUMMARY.devFlatPTTo1e17 === true,
    why: 'imp-35766 B1/B2: the balance tightens (dev decreases) from band-top to the PT anchor, then stays essentially N-frozen out to N ~ 1e17.',
  },
  {
    id: 'imp35837-spurious-upturn-beyond-1e17',
    holds: () => IMP35837_SUMMARY.devSpuriousUpturnBeyond1e17 === true,
    why: 'imp-35766 B3: beyond N ~ 1e18 the measured deviation diverges upward due to double-precision cancellation in dG, not a real break in the leading-order balance.',
  },
];

for (const assertion of IMP35837_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35837-krawczyk-cancellation-ratio-viz-data assertion failed: ${assertion.id}`);
  }
}
