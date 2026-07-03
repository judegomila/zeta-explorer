/**
 * @module imp-3566-cosh-sinh-margin-contrast-viz-data
 * @fileoverview imp-3566 -- lightweight, import-light literal data contrasting
 *   the imp-3509 EVEN (cosh, degree-2) and imp-3527 ODD (sinh, degree-3)
 *   catastrophic-cancellation safety margins tail(k)/rho(k) across the shared
 *   k-ladder, on the S3 cell (a0, u0) = (0.5, 6).
 *
 *   Both margins collapse like k^{-4} (rho(k) grows ~k^2, tail(k) shrinks
 *   ~1/k^2) but the sinh margin is uniformly the TIGHTER of the two: its
 *   leading cancellation coefficient (6 eps k^2/(a0 T_A)^2) is 3x the cosh
 *   coefficient (2 eps k^2/(a0 T_A)^2), since sinh(x)-x ~ x^3/6 cancels one
 *   order deeper than cosh(x)-1 ~ x^2/2. Through the tested ladder (k<=24)
 *   both stay at least SIX orders of magnitude safe (sinh: ~7.42e6 at k=24;
 *   cosh: ~2.70e7 at k=24), and the two margin curves reach 1 only at their
 *   own closed-form crossovers -- k*=1252.52 (sinh) before k*=1729.97 (cosh)
 *   -- both far beyond any tested rung.
 *
 *   Measured rungs (k<=24) are the imp-3509/imp-3527 ladder values on the S3
 *   cell; the k=40..k* points are closed-form extrapolations of the SAME
 *   formulas evaluated past the tested range, reproduced as baked literals
 *   from a one-off evaluation of the two source modules so importing this
 *   module into a page costs nothing at load time.
 *
 *   @see imp-3509-cosh-cancellation-safety-k-ladder.js (even/cosh source derivation and measurement)
 *   @see imp-3527-sinh-cancellation-safety-k-ladder.js (odd/sinh source derivation and measurement)
 *   @see imp-3541-cosh-cancellation-margin-viz-data.js (the single-curve cosh viz this contrasts against)
 *
 *   Ticket: imp-3566 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// COSH (imp-3509, even, degree-2) margin on the S3 cell. Measured k<=24, extrapolated beyond.
export const IMP3566_COSH_RUNGS = Object.freeze([
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

// SINH (imp-3527, odd, degree-3) margin on the S3 cell. Measured k<=24, extrapolated beyond.
export const IMP3566_SINH_RUNGS = Object.freeze([
  { k: 2, rho: 5.292829834041885e-16, tail: 0.00009108158478153972, margin: 172084853731.23172, measured: true },
  { k: 3, rho: 1.2673692473606458e-15, tail: 0.000040480704347350984, margin: 31940734266.39781, measured: true },
  { k: 4, rho: 2.3028343404890914e-15, tail: 0.00002277039619538493, margin: 9887987075.331177, measured: true },
  { k: 6, rho: 5.262891428399674e-15, tail: 0.000010120176086837746, margin: 1922930811.801881, measured: true },
  { k: 8, rho: 9.407534509910071e-15, tail: 0.000005692599048846233, margin: 605110620.9442594, measured: true },
  { k: 12, rho: 2.124977761414044e-14, tail: 0.0000025300440217094365, margin: 119062141.15040176, measured: true },
  { k: 16, rho: 3.782906049024701e-14, tail: 0.0000014231497622115582, margin: 37620542.08505841, measured: true },
  { k: 24, rho: 8.519854216236088e-14, tail: 6.325110054273591e-7, margin: 7423965.121633157, measured: true },
  { k: 40, rho: 2.367809750178589e-13, tail: 2.2770396195384936e-7, margin: 961664.9392404736, measured: false },
  { k: 80, rho: 9.473237034185046e-13, tail: 5.692599048846234e-8, margin: 60091.38194583296, measured: false },
  { k: 160, rho: 3.789494644615438e-12, tail: 1.4231497622115585e-8, margin: 3755.5133221621995, measured: false },
  { k: 320, rho: 1.5158178416311282e-11, tail: 3.5578744055288963e-9, margin: 234.71648820945197, measured: false },
  { k: 640, rho: 6.0632913505622e-11, tail: 8.894686013822241e-10, margin: 14.66973216287472, measured: false },
  { k: 1200, rho: 2.131627541026178e-10, tail: 2.530044021709437e-10, margin: 1.1869071744548108, measured: false },
  { k: 1252.522109786745, rho: 2.3223070658466425e-10, tail: 2.3223077320494644e-10, margin: 1.0000002868711169, measured: false },
]);

export const IMP3566_K_STAR_COSH = 1729.971207182063;
export const IMP3566_K_STAR_SINH = 1252.522109786745;
export const IMP3566_MAX_TESTED_K = 24;
export const IMP3566_MIN_MARGIN_COSH = 27031861.096129555; // at k=24, S3 cell
export const IMP3566_MIN_MARGIN_SINH = 7423965.121633157;  // at k=24, S3 cell (tighter of the two)
