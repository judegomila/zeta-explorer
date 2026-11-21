/**
 * @module imp-33570-sigma-fartail-slope-sqrt-fraction-viz-data
 * @fileoverview imp-33570 -- lightweight, import-light literal data for a chart of the
 *   imp-33540 far-tail two-power log-factor decomposition S(N) = -(1/2) ln N + (1/2) ln(log T0):
 *   Delta S_slope (the -1/2 ln N power) and Delta S_sqrt (the +1/2 sqrt(log T0) power) as
 *   FRACTIONS of Delta S, across the imp-33553 reference-N ladder spanning the 3.55-decade
 *   off-regime span from the imp-3406 interior max (N ~ 9.22e5) to just below the imp-3444
 *   crossover (N ~ 3.28e9), with the ~18:1 (rising to ~21.5:1) slope:sqrt dominance marked.
 *
 *   Values below are baked reference literals reproduced from the imp-33553 ladder
 *   (src/data/imp-33553-sigma-fartail-slope-sqrt-dominance-ladder.js), which in turn reuses the
 *   exact imp-3406 / imp-33291 / imp-33540 sub-term formulas; this module does NOT re-run that
 *   computation, so importing it into a page costs nothing at load time.
 *
 *   @see imp-33553-sigma-fartail-slope-sqrt-dominance-ladder.js (the source ladder derivation)
 *   @see imp-33540-sigma-fartail-overshoot-two-power-decomposition.js (the single-point ~18:1 dominance)
 *   @see imp-33291-sigma-fartail-two-parameter-lnN-lnlogT0-fit.js (the (-1/2, +1/2) joint power law)
 *   @see imp-3406-sigma-highN-extrapolation.js (interior MAX N ~ 9.22e5)
 *   @see imp-3444-sigma-nshape-landmark-ladder.js (E_coll = E_trunc crossover, N ~ 3.280e9)
 *
 *   Ticket: imp-33570 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched;
 *   no refereed bound is changed; NO QED.
 */

// Ladder rows carrying a finite chord ratio (the exact crossover rung has fraction_slope /
// fraction_sqrt undefined, 0/0, so it is excluded here). N_ref runs from the imp-3406 peak up
// to the rung just below the imp-3444 crossover.
export const IMP33570_FRACTION_SERIES = Object.freeze([
  { rung: 0, N_ref: 9.2186e5, fraction_slope: 1.058945, fraction_sqrt: -0.058945, chord_ratio: 17.965 },
  { rung: 1, N_ref: 2.562e6, fraction_slope: 1.057153, fraction_sqrt: -0.057153, chord_ratio: 18.4969 },
  { rung: 2, N_ref: 7.12e6, fraction_slope: 1.055492, fraction_sqrt: -0.055492, chord_ratio: 19.0208 },
  { rung: 3, N_ref: 1.9787e7, fraction_slope: 1.053946, fraction_sqrt: -0.053946, chord_ratio: 19.537 },
  { rung: 4, N_ref: 5.4991e7, fraction_slope: 1.052504, fraction_sqrt: -0.052504, chord_ratio: 20.046 },
  { rung: 5, N_ref: 1.5283e8, fraction_slope: 1.051156, fraction_sqrt: -0.051156, chord_ratio: 20.548 },
  { rung: 6, N_ref: 4.2472e8, fraction_slope: 1.049892, fraction_sqrt: -0.049892, chord_ratio: 21.0433 },
  { rung: 7, N_ref: 1.1803e9, fraction_slope: 1.048704, fraction_sqrt: -0.048704, chord_ratio: 21.5322 },
]);

// Landmarks and the peak-to-top-rung dominance evolution (imp-33540 peak reproduced exactly;
// imp-33553 F1: the dominance INTENSIFIES toward the crossover, it does not approach parity).
export const IMP33570_LANDMARKS = Object.freeze({
  N_max: 9.219e5, // imp-3406 interior max (rung 0)
  N_cross: 3.2803e9, // imp-3444 crossover (chord ratio undefined there, local ratio ~22.0)
  chord_ratio_at_peak: 17.965, // reproduces the imp-33540 ~18:1 dominance
  chord_ratio_at_top_rung: 21.5322, // near the crossover, still rising
});
