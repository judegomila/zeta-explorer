/**
 * @module imp-3541-cosh-cancellation-margin-viz-data
 * @fileoverview imp-3541 -- lightweight, import-light literal data for a
 *   visualization of the imp-3509 cosh cancellation-safety margin.
 *
 *   imp-3509 derived and measured the relative cancellation error
 *   rho(k) = eps/(cosh(x_k)-1) of the near-cancelling cosh(a tau)-1 term on
 *   the imp-3490 k-ladder, alongside the competing O(a^2) tail
 *   tail(k) = (a^2/12)(M_4/M_2). rho(k) GROWS like k^2 while tail(k) SHRINKS
 *   like 1/k^2, so the safety margin tail(k)/rho(k) collapses like k^{-4}
 *   but stays orders of magnitude above 1 through the tested ladder (k<=24),
 *   crossing 1 only at the closed-form crossover k* ~ 1400-1730.
 *
 *   Measured rungs (k<=24) are the imp-3509 ladder values on both base cells;
 *   the k=40..k* points are closed-form extrapolations of the SAME formulas
 *   (rho(k)=eps/(cosh(a0*T_A/k)-1), tail(k)=(a0/k)^2/12 * M_4/M_2) evaluated
 *   past the tested range, reproduced as baked literals from a one-off
 *   evaluation of imp-3509-cosh-cancellation-safety-k-ladder.js so importing
 *   this module into a page costs nothing at load time.
 *
 *   @see imp-3509-cosh-cancellation-safety-k-ladder.js (the source derivation and measurement)
 *
 *   Ticket: imp-3541 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// S3 cell: base (a0, u0) = (0.5, 6). Measured ladder k<=24, extrapolated beyond.
export const IMP3541_S3_RUNGS = Object.freeze([
  { k: 2, rho: 1.6418443230684507e-16, tail: 0.00011049006278592906, margin: 672963089335.0087, measured: true },
  { k: 3, rho: 4.088612089815557e-16, tail: 0.00004910669457152403, margin: 120106024961.00162, measured: true },
  { k: 4, rho: 7.535025448373483e-16, tail: 0.000027622515696482266, margin: 36658822038.14572, measured: true },
  { k: 6, rho: 1.7398074487896616e-15, tail: 0.000012276673642881007, margin: 7056340430.903182, measured: true },
  { k: 8, rho: 3.1212190439144276e-15, tail: 0.0000069056289241205666, margin: 2212478146.186107, measured: true },
  { k: 12, rho: 7.0685352854787474e-15, tail: 0.0000030691684107202518, margin: 434201469.8611466, measured: true },
  { k: 16, rho: 1.2594928385291451e-14, tail: 0.0000017264072310301416, margin: 137071619.48187545, measured: true },
  { k: 24, rho: 2.838473089039084e-14, tail: 7.672921026800629e-7, margin: 27031861.096129555, measured: true },
  { k: 40, rho: 7.891219583409635e-14, tail: 2.762251569648227e-7, margin: 3500411.4895694163, measured: false },
  { k: 80, rho: 3.1575976661675005e-13, tail: 6.905628924120568e-8, margin: 218698.8227826441, measured: false },
  { k: 160, rho: 1.2631500790119497e-12, tail: 1.726407231030142e-8, margin: 13667.475145792312, measured: false },
  { k: 320, rho: 5.052711335921345e-12, tail: 4.316018077575355e-9, margin: 854.1984274643593, measured: false },
  { k: 640, rho: 2.0210956365318944e-11, tail: 1.0790045193938387e-9, margin: 53.38710845199587, measured: false },
  { k: 1200, rho: 7.105423656662775e-11, tail: 3.0691684107202524e-10, margin: 4.319472784486658, measured: false },
  { k: 1729.971207182063, rho: 1.4767444687417658e-10, tail: 1.4767448388471338e-10, margin: 1.0000002506224848, measured: false },
]);

// S4 cell: base (a0, u0) = (0.4, 10). Measured ladder k<=24, extrapolated beyond.
export const IMP3541_S4_RUNGS = Object.freeze([
  { k: 2, rho: 2.7390745697078833e-16, tail: 0.00007071364018299461, margin: 258166173951.72296, measured: true },
  { k: 3, rho: 6.580367782192668e-16, tail: 0.00003142828452577538, margin: 47760680810.00641, measured: true },
  { k: 4, rho: 1.1972304404536968e-15, tail: 0.000017678410045748653, margin: 14766088004.786552, measured: true },
  { k: 6, rho: 2.738844317611406e-15, tail: 0.000007857071131443845, margin: 2868754197.1338243, measured: true },
  { k: 8, rho: 4.897483060294815e-15, tail: 0.000004419602511437163, margin: 902423235.9817729, measured: true },
  { k: 12, rho: 1.1065296709646022e-14, tail: 0.0000019642677828609613, margin: 177516051.706832, measured: true },
  { k: 16, rho: 1.9700332377624248e-14, tail: 0.0000011049006278592908, margin: 56085380.01695055, measured: true },
  { k: 24, rho: 4.437193204722983e-14, tail: 4.910669457152403e-7, margin: 11067062.511331372, measured: true },
  { k: 40, rho: 1.2332111307346738e-13, tail: 1.7678410045748651e-7, margin: 1433526.636693338, measured: false },
  { k: 80, rho: 4.933954496201073e-13, tail: 4.419602511437163e-8, margin: 89575.25884845637, measured: false },
  { k: 160, rho: 1.9736928145375945e-12, tail: 1.1049006278592907e-8, margin: 5598.138776819491, measured: false },
  { k: 320, rho: 7.894882278904948e-12, tail: 2.7622515696482268e-9, margin: 349.87875335759435, measured: false },
  { k: 640, rho: 3.1579640137967524e-11, tail: 6.905628924120567e-10, margin: 21.867345207072443, measured: false },
  { k: 1000, rho: 7.709878414474943e-11, tail: 2.8285456073197844e-10, margin: 3.668729200721661, measured: false },
  { k: 1383.9769657456504, rho: 1.4767444687417658e-10, tail: 1.4767448388471338e-10, margin: 1.0000002506224848, measured: false },
]);

export const IMP3541_K_STAR_S3 = 1729.971207182063;
export const IMP3541_K_STAR_S4 = 1383.9769657456504;
export const IMP3541_MAX_TESTED_K = 24;
