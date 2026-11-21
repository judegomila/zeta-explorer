/**
 * @module imp-35445-local-vs-integral-band-width-viz-data
 * @fileoverview imp-35445 -- VIZ DATA ONLY for the imp-35372 local-vs-integral reentry-band-width
 *   discrepancy: the naive localWidth(e) = OFFSET/DRIFT(10^e) UNDERSTATES the true 10.0824-decade
 *   integral band width near the reentry (-2.1152 decades) and OVERSTATES it near the exit
 *   (+2.4620 decades), crossing the true width only at one interior decade, u_cross = 31.7467.
 *
 *   imp-35372 tabulated this discrepancy but shipped no chart. Values below are baked reference
 *   literals, reproduced verbatim from the imp-35372 discrepancy_table measurement. This module
 *   does NOT import lambda-rh-height-mapping.js or polymath15-constant-C-C.js -- no fresh
 *   computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35372-reentry-band-drift-integral-half-offset.js (source of the baked literals)
 *   @see imp-35332-reentry-band-drift-analytic-derivation (DRIFT(N), the N-dependent local drift)
 *   @see imp-35111-off-by-one-reentry-band-width (band width ~10.08 decades, the integral width)
 *
 *   Ticket: imp-35445 (ux, low). Presentation only of an already-established measurement; adds
 *   no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED. No refereed bound is changed.
 */

// -- six-decade discrepancy ladder: local width (OFFSET/DRIFT) vs the true integral width --
export const IMP35445_DISCREPANCY_TABLE = Object.freeze([
  Object.freeze({ log10N: 27.084691, label: 'reentry', local_drift: 0.0186273, local_width_decades: 7.96726, discrepancy_decades: -2.1152 }),
  Object.freeze({ log10N: 29, label: 'interior', local_drift: 0.016796, local_width_decades: 8.83594, discrepancy_decades: -1.2465 }),
  Object.freeze({ log10N: 31, label: 'interior', local_drift: 0.0152316, local_width_decades: 9.74347, discrepancy_decades: -0.33895 }),
  Object.freeze({ log10N: 33, label: 'interior', local_drift: 0.0139332, local_width_decades: 10.6514, discrepancy_decades: 0.56899 }),
  Object.freeze({ log10N: 35, label: 'interior', local_drift: 0.0128384, local_width_decades: 11.5597, discrepancy_decades: 1.4773 }),
  Object.freeze({ log10N: 37.167107, label: 'exit', local_drift: 0.0118306, local_width_decades: 12.5444, discrepancy_decades: 2.462 }),
]);

export const IMP35445_ACTUAL_BAND_WIDTH_DECADES = 10.0824;
export const IMP35445_WIDTH_CROSSING_EXPONENT_LOG10N = 31.746741;

export const IMP35445_SUMMARY = Object.freeze({
  understatesAtReentry: IMP35445_DISCREPANCY_TABLE[0].discrepancy_decades < 0,
  overstatesAtExit: IMP35445_DISCREPANCY_TABLE[IMP35445_DISCREPANCY_TABLE.length - 1].discrepancy_decades > 0,
  monotoneGrowing: IMP35445_DISCREPANCY_TABLE.every(
    (row, i) => i === 0 || row.local_width_decades > IMP35445_DISCREPANCY_TABLE[i - 1].local_width_decades
  ),
});

export default Object.freeze({
  id: 'imp-35445-local-vs-integral-band-width-viz-data',
  ticket: 'imp-35445',
  sources: ['imp-35372-reentry-band-drift-integral-half-offset.js'],
  discrepancyTable: IMP35445_DISCREPANCY_TABLE,
  actualBandWidthDecades: IMP35445_ACTUAL_BAND_WIDTH_DECADES,
  widthCrossingExponentLog10N: IMP35445_WIDTH_CROSSING_EXPONENT_LOG10N,
  summary: IMP35445_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35445_ASSERTIONS = [
  {
    id: 'imp35445-six-decades-present',
    holds: () => IMP35445_DISCREPANCY_TABLE.length === 6 && IMP35445_DISCREPANCY_TABLE[0].label === 'reentry' && IMP35445_DISCREPANCY_TABLE[5].label === 'exit',
    why: 'The ladder must cover the reentry, four interior decades, and the exit in band order.',
  },
  {
    id: 'imp35445-understates-at-reentry-overstates-at-exit',
    holds: () =>
      Math.abs(IMP35445_DISCREPANCY_TABLE[0].discrepancy_decades + 2.1152) < 1e-3 &&
      Math.abs(IMP35445_DISCREPANCY_TABLE[5].discrepancy_decades - 2.462) < 1e-3,
    why: 'imp-35372: local width must understate by -2.1152 decades at the reentry and overstate by +2.4620 at the exit.',
  },
  {
    id: 'imp35445-monotone-growth-with-sign-flip',
    holds: () => IMP35445_SUMMARY.monotoneGrowing && IMP35445_SUMMARY.understatesAtReentry && IMP35445_SUMMARY.overstatesAtExit,
    why: 'imp-35372: local width grows monotonically through the band (drift decreases) and its discrepancy flips sign exactly once.',
  },
  {
    id: 'imp35445-crossing-decade-inside-band',
    holds: () =>
      IMP35445_WIDTH_CROSSING_EXPONENT_LOG10N > IMP35445_DISCREPANCY_TABLE[0].log10N &&
      IMP35445_WIDTH_CROSSING_EXPONENT_LOG10N < IMP35445_DISCREPANCY_TABLE[5].log10N &&
      Math.abs(IMP35445_WIDTH_CROSSING_EXPONENT_LOG10N - 31.7467) < 1e-3,
    why: 'imp-35372: the single decade where local width equals the true integral width must sit at log10 N ~ 31.7467, strictly inside the band.',
  },
  {
    id: 'imp35445-reconstructs-actual-band-width',
    holds: () => Math.abs(IMP35445_DISCREPANCY_TABLE[5].log10N - IMP35445_DISCREPANCY_TABLE[0].log10N - IMP35445_ACTUAL_BAND_WIDTH_DECADES) < 1e-3,
    why: 'The reentry-to-exit decade span must reconstruct the true 10.0824-decade integral band width.',
  },
];

for (const assertion of IMP35445_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35445-local-vs-integral-band-width-viz-data assertion failed: ${assertion.id}`);
  }
}
