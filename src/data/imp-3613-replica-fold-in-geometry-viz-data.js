/**
 * @module imp-3613-replica-fold-in-geometry-viz-data
 * @fileoverview imp-3613 -- lightweight, import-light literal data for a
 *   visualization of the imp-3582 aliasing fold-in geometry.
 *
 *   Visualizes the first-positive-baseband aliasing replica location
 *   L(xi_true, N) = 2 xi_Nyq(N) - xi_true (xi_Nyq(N) = pi N/U, U=6) for three
 *   source frequencies against the scanned band (0, 400]:
 *     - xi_true = xi_max = 400 (band-top source): crosses the band ceiling
 *       at N_replica ~ 764 -- the outer/loosest fold-in floor.
 *     - xi_true = xi_peak_max ~ 320.01 (largest genuine in-band peak):
 *       crosses at N_colocate ~ 688 -- the inner co-location floor.
 *     - xi_true = xi_star ~ 12.087 (the imp-3470 maximizer itself): crosses
 *       at N ~ 394 -- the tightest floor.
 *   Because all three lines climb with N and cross y=400 at N=394/688/764
 *   respectively, N > 764 (the largest crossing) certifies that ALL three
 *   scenarios have folded their replica out of the band already -- the
 *   imp-3558 four-rung ladder N in {1200,2400,4800,9600} sits far past every
 *   floor, so the band (0,400] is replica-free at every rung.
 *
 *   Values below are baked reference literals recomputed from the imp-3582
 *   VERBATIM formulas (xiNyqOf, replicaLoc) in
 *   imp-3582-replica-hiding-grid-threshold.js. This module does NOT import
 *   that module (or any heavy assembly), so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-3582-replica-hiding-grid-threshold.js (the source derivation)
 *   @see imp-3558-far-tail-band-max-grid-ladder-n9600.js (the four-rung ladder being certified)
 *   @see imp-3611-skew-toeplitz-krylov-gap-ladder-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-3613 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

export const IMP3613_U = 6;
export const IMP3613_XI_MAX = 400;
export const IMP3613_XI_PEAK_MAX = 320.01;
export const IMP3613_XI_STAR = 12.0870439;

function xiNyqOf(N) {
  return (Math.PI * N) / IMP3613_U;
}
function replicaLoc(xiTrue, N) {
  return 2 * xiNyqOf(N) - xiTrue;
}

// Fold-in floors: the N at which each source's first replica crosses y = xi_max.
export const IMP3613_N_REPLICA = 764; // ceil(400 * 6 / pi) ~ 763.94 -- outer/loosest floor
export const IMP3613_N_COLOCATE = 688; // ceil((400+320.01)/2 * 6/pi) ~ 687.56 -- inner co-location floor
export const IMP3613_N_STAR_FLOOR = 393.5141401248713; // (400+12.087)/2 * 6/pi -- tightest floor

// Zoomed-in linear view, N in [0, 1000]: three replica-location lines (straight
// in N since xi_Nyq is linear in N), given as two endpoints each for plotting.
export const IMP3613_LINES_ZOOM = Object.freeze([
  {
    key: 'xiMax',
    label: 'source = xi_max = 400 (band-top)',
    xiTrue: IMP3613_XI_MAX,
    crossingN: IMP3613_N_REPLICA,
    points: [0, 1000].map((N) => ({ N, L: replicaLoc(IMP3613_XI_MAX, N) })),
  },
  {
    key: 'xiPeakMax',
    label: 'source = xi_peak_max ~ 320.01 (largest genuine peak)',
    xiTrue: IMP3613_XI_PEAK_MAX,
    crossingN: IMP3613_N_COLOCATE,
    points: [0, 1000].map((N) => ({ N, L: replicaLoc(IMP3613_XI_PEAK_MAX, N) })),
  },
  {
    key: 'xiStar',
    label: 'source = xi_star ~ 12.087 (imp-3470 maximizer)',
    xiTrue: IMP3613_XI_STAR,
    crossingN: IMP3613_N_STAR_FLOOR,
    points: [0, 1000].map((N) => ({ N, L: replicaLoc(IMP3613_XI_STAR, N) })),
  },
]);

// Wide log view, N in [100, 9600]: the band-top (loosest) replica-location
// line extended out past the imp-3558 ladder, showing every rung already
// far above the y = xi_max threshold (replica-free).
export const IMP3613_LINE_WIDE = Object.freeze(
  [100, 9600].map((N) => ({ N, L: replicaLoc(IMP3613_XI_MAX, N) }))
);

export const IMP3613_LADDER = Object.freeze(
  [1200, 2400, 4800, 9600].map((N) => ({
    N,
    xiNyq: xiNyqOf(N),
    L: replicaLoc(IMP3613_XI_MAX, N),
    replicaFree: replicaLoc(IMP3613_XI_MAX, N) > IMP3613_XI_MAX,
  }))
);
