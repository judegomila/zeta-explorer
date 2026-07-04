/**
 * @module imp-33549-sigma-fartail-vs-interior-max-viz-data
 * @fileoverview imp-33549 -- lightweight, import-light literal data for a two-curve
 *   overlay chart of the imp-33315 reconciliation: the full conditional share sigma(N)
 *   (imp-3406 U-shape, interior MAX at N ~ 9.22e5) against the imp-33291 far-tail
 *   (-1/2, +1/2) power-law prediction sigma_ft(N) = E_coll/(E_trunc + E_coll), across
 *   the full N-shape from N = 1e4 to N = 1e12 (a 49-point, 6-per-decade log-spaced
 *   ladder), with the interior-max peak and the ~3.55-decade off-regime overshoot
 *   (imp-33315 F3) marked.
 *
 *   Values below are baked reference literals reproduced from the imp-33315
 *   `parts()` / `sigmaFarTail()` sub-terms (src/data/imp-33315-sigma-fartail-law-vs-
 *   interior-max-reconciliation.js), which in turn reuse the exact imp-3406 /
 *   imp-33291 formulas; this module does NOT re-run that computation, so importing
 *   it into a page costs nothing at load time.
 *
 *   @see imp-33315-sigma-fartail-law-vs-interior-max-reconciliation.js (the source derivation/measurement)
 *   @see imp-33291-sigma-fartail-two-parameter-lnN-lnlogT0-fit.js (the (-1/2, +1/2) joint power law)
 *   @see imp-3406-sigma-highN-extrapolation.js (interior MAX N ~ 9.22e5, sigma_max ~ 0.9494)
 *   @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover, N ~ 3.280e9)
 *
 *   Ticket: imp-33549 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched;
 *   Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

// Two-series ladder: N, the full sigma(N) (imp-3406 U-shape), and the imp-33291
// far-tail (-1/2, +1/2) power-law prediction sigma_ft(N), 6 points per decade
// from N = 1e4 to N = 1e12.
export const IMP33549_LADDER = Object.freeze([
  { N: 1e4, sigma_full: 0.901629, sigma_farTail: 0.997378 },
  { N: 1.4678e4, sigma_full: 0.908252, sigma_farTail: 0.99688 },
  { N: 2.1544e4, sigma_full: 0.914604, sigma_farTail: 0.996288 },
  { N: 3.1623e4, sigma_full: 0.920612, sigma_farTail: 0.99558 },
  { N: 4.6416e4, sigma_full: 0.926208, sigma_farTail: 0.994737 },
  { N: 6.8129e4, sigma_full: 0.931334, sigma_farTail: 0.99373 },
  { N: 1e5, sigma_full: 0.935932, sigma_farTail: 0.99253 },
  { N: 1.4678e5, sigma_full: 0.939951, sigma_farTail: 0.991098 },
  { N: 2.1544e5, sigma_full: 0.943337, sigma_farTail: 0.98939 },
  { N: 3.1623e5, sigma_full: 0.946038, sigma_farTail: 0.987355 },
  { N: 4.6416e5, sigma_full: 0.947994, sigma_farTail: 0.98493 },
  { N: 6.8129e5, sigma_full: 0.949142, sigma_farTail: 0.982042 },
  { N: 1e6, sigma_full: 0.949408, sigma_farTail: 0.978607 },
  { N: 1.4678e6, sigma_full: 0.948706, sigma_farTail: 0.974523 },
  { N: 2.1544e6, sigma_full: 0.946936, sigma_farTail: 0.969676 },
  { N: 3.1623e6, sigma_full: 0.943983, sigma_farTail: 0.963931 },
  { N: 4.6416e6, sigma_full: 0.93971, sigma_farTail: 0.957134 },
  { N: 6.8129e6, sigma_full: 0.933962, sigma_farTail: 0.949111 },
  { N: 1e7, sigma_full: 0.926562, sigma_farTail: 0.939666 },
  { N: 1.4678e7, sigma_full: 0.91731, sigma_farTail: 0.928585 },
  { N: 2.1544e7, sigma_full: 0.905991, sigma_farTail: 0.915634 },
  { N: 3.1623e7, sigma_full: 0.892373, sigma_farTail: 0.900565 },
  { N: 4.6416e7, sigma_full: 0.876218, sigma_farTail: 0.883126 },
  { N: 6.8129e7, sigma_full: 0.857292, sigma_farTail: 0.863069 },
  { N: 1e8, sigma_full: 0.835378, sigma_farTail: 0.840165 },
  { N: 1.4678e8, sigma_full: 0.8103, sigma_farTail: 0.814226 },
  { N: 2.1544e8, sigma_full: 0.781938, sigma_farTail: 0.785122 },
  { N: 3.1623e8, sigma_full: 0.750259, sigma_farTail: 0.75281 },
  { N: 4.6416e8, sigma_full: 0.715336, sigma_farTail: 0.717352 },
  { N: 6.8129e8, sigma_full: 0.67737, sigma_farTail: 0.67894 },
  { N: 1e9, sigma_full: 0.636702, sigma_farTail: 0.637904 },
  { N: 1.4678e9, sigma_full: 0.59381, sigma_farTail: 0.594717 },
  { N: 2.1544e9, sigma_full: 0.549302, sigma_farTail: 0.549975 },
  { N: 3.1623e9, sigma_full: 0.503882, sigma_farTail: 0.504372 },
  { N: 4.6416e9, sigma_full: 0.458311, sigma_farTail: 0.458661 },
  { N: 6.8129e9, sigma_full: 0.413355, sigma_farTail: 0.413601 },
  { N: 1e10, sigma_full: 0.369742, sigma_farTail: 0.369912 },
  { N: 1.4678e10, sigma_full: 0.32811, sigma_farTail: 0.328226 },
  { N: 2.1544e10, sigma_full: 0.288978, sigma_farTail: 0.289056 },
  { N: 3.1623e10, sigma_full: 0.252727, sigma_farTail: 0.252778 },
  { N: 4.6416e10, sigma_full: 0.219593, sigma_farTail: 0.219626 },
  { N: 6.8129e10, sigma_full: 0.189679, sigma_farTail: 0.1897 },
  { N: 1e11, sigma_full: 0.162971, sigma_farTail: 0.162985 },
  { N: 1.4678e11, sigma_full: 0.139363, sigma_farTail: 0.139371 },
  { N: 2.1544e11, sigma_full: 0.118678, sigma_farTail: 0.118683 },
  { N: 3.1623e11, sigma_full: 0.100693, sigma_farTail: 0.100697 },
  { N: 4.6416e11, sigma_full: 0.085163, sigma_farTail: 0.085165 },
  { N: 6.8129e11, sigma_full: 0.07183, sigma_farTail: 0.071831 },
  { N: 1e12, sigma_full: 0.06044, sigma_farTail: 0.060441 },
]);

// imp-3406 interior MAX (reproduced exactly by imp-33315's full sigma).
export const IMP33549_INTERIOR_MAX = Object.freeze({
  N: 9.219e5,
  sigma: 0.949429,
});

// imp-33315 F3: forced to the true peak the far-tail law overshoots by ~3.0e-2,
// ~3.55 decades below the imp-3444 crossover N_cross ~ 3.28e9.
export const IMP33549_OVERSHOOT = Object.freeze({
  N: 9.219e5,
  sigma_full: 0.949429,
  sigma_farTail: 0.9793857,
  overshoot: 0.029957,
  peak_below_crossover_decades: 3.5512,
  N_cross: 3.2803e9,
});
