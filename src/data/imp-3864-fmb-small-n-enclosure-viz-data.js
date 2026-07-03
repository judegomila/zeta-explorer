/**
 * @module imp-3864-fmb-small-n-enclosure-viz-data
 * @fileoverview imp-3864 -- lightweight, import-light literal data for a
 *   visualization of the imp-3729 two-sided true-flow enclosure
 *     0 <= F_mb(N) <= (H^2/8) * (1/theta_N - 1)
 *   as a function of N all the way down to N = 2, i.e. below the imp-3725
 *   certified [1e4,1e6] floor. Two segments:
 *
 *   (1) CERTIFIED band, N in [1e4,1e6]: the normalized upper edge
 *       1/theta_N - 1 = RrelUpper, baked verbatim from the imp-3725 ROWS
 *       (imp-3725-fmb-plateau-domination-lemma.js). This is the same
 *       relative-margin quantity imp-3725 certifies as RrelUpper; no new
 *       computation, just re-plotted on a different (N-down-to-2) axis.
 *
 *   (2) ILLUSTRATIVE band, N in [2,1e4]: imp-3729 is a derivation-only
 *       assessment with no computed sweep below 1e4, so this segment is a
 *       SCHEMATIC monotone model f(N) = E0 * sqrt((N-2)/(1e4-2)) anchored to
 *       f(2) = 0 (exact: Psi_N=0, theta_N=1 at N=2, the two-particle Dyson
 *       equality t_c(2)=H^2/8, F_mb(2)=0) and f(1e4) = E0 (matching the real
 *       certified left edge). It illustrates the QUALITATIVE, rigorously
 *       argued shape -- Psi_N monotone nondecreasing in N, theta_N -> 1 as
 *       N shrinks -- NOT a numerically computed sweep. Do not read off
 *       precise values in this band.
 *
 *   This module does NOT import the Odlyzko zeros bundle or the imp-3725 /
 *   imp-3729 modules themselves, so importing it into a page costs nothing
 *   at load time.
 *
 *   @see imp-3729-gap-domination-below-1e4-regime.js (the assessment this
 *        illustrates)
 *   @see imp-3725-fmb-plateau-domination-lemma.js (source of the certified
 *        RrelUpper literals)
 *
 *   Ticket: imp-3864 (ux, low). Presentation only, RH-free; imp-3066
 *   untouched; NO QED.
 */

// Certified band, N in [1e4,1e6]: {endN, RrelUpper} baked verbatim from the
// imp-3725 ROWS (RrelUpper = 1/theta_N - 1 at the plateau's dominant endN).
export const IMP3864_CERTIFIED_ROWS = Object.freeze([
  { endN: 18859, RrelUpper: 1.77610467e-3 },
  { endN: 44555, RrelUpper: 2.84864037e-3 },
  { endN: 73997, RrelUpper: 1.47266846e-3 },
  { endN: 82552, RrelUpper: 1.52541656e-3 },
  { endN: 87761, RrelUpper: 1.16374311e-3 },
  { endN: 95248, RrelUpper: 9.55668223e-4 },
  { endN: 354769, RrelUpper: 5.08097667e-4 },
  { endN: 415587, RrelUpper: 6.76643801e-4 },
  { endN: 420891, RrelUpper: 2.4577069e-4 },
  { endN: 1000000, RrelUpper: 1.04206142e-4 },
]);

// Left edge of the certified band: N=10000, psiStart=0.0141819381 (plateau 0
// start), theta = 1 - psiStart/8, RrelUpper = 1/theta - 1.
export const IMP3864_CERTIFIED_LEFT_EDGE = Object.freeze({
  N: 10000,
  RrelUpper: 1 / (1 - 0.0141819381 / 8) - 1,
});

export const IMP3864_SMALL_N_FLOOR = 2;

// Illustrative-model helper: f(2)=0 exactly, f(1e4) = the real certified
// left edge, monotone increasing in N. NOT a computed sweep -- schematic
// only, illustrating the rigorous qualitative shape (theta_N -> 1 as N
// shrinks toward the N=2 two-particle equality).
export function imp3864IllustrativeRrelUpper(N) {
  const nFloor = IMP3864_SMALL_N_FLOOR;
  const nAnchor = IMP3864_CERTIFIED_LEFT_EDGE.N;
  const e0 = IMP3864_CERTIFIED_LEFT_EDGE.RrelUpper;
  const t = (N - nFloor) / (nAnchor - nFloor);
  return e0 * Math.sqrt(Math.max(t, 0));
}

export const IMP3864_TWO_PARTICLE_EXACT = Object.freeze({
  N: 2,
  thetaN: 1,
  psiN: 0,
  tcExact: 'H^2/8',
  FmbExact: 0,
  note: 'Two-particle Dyson equality: no third particle, Psi=0, upper = lower.',
});
