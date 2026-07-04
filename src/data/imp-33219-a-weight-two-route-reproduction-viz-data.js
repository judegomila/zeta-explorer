/**
 * @module imp-33219-a-weight-two-route-reproduction-viz-data
 * @fileoverview imp-33219 -- lightweight, import-light literal data for a
 *   visualization of the imp-3867 two-route reproduction of the imp-3844
 *   A-weight closed-form constants c_inf = -ln((pi/2) Phi(0)) = 0.35429228409357
 *   and B = 3/(2 pi) = 0.477465, confirming they are not single-path artifacts.
 *
 *   Route (1): the DIRECT completed-Riemann kernel series (each term its own
 *   e^{-pi n^2} weight) reproduces Phi(0) to < 1e-14 against the imp-3844
 *   factored e^{-pi(n^2-1)} acc0 route, and converges by NPHI=3.
 *   Route (2): a Gauss-Laguerre collapsed-Laplace ladder (structurally
 *   distinct from the imp-3844 graded Gauss-Legendre-in-s quadrature)
 *   reproduces B via the approach coefficient (c(tau)-c_inf)/e^{-2 tau}.
 *
 *   Values below are baked reference literals reproduced from a one-off
 *   evaluation of imp-3867-a-weight-closed-form-independent-reproduction.js
 *   (its `measured` field); this module does NOT re-run that self-computing
 *   series/quadrature, so importing it into a page costs nothing at load time.
 *
 *   @see imp-3867-a-weight-closed-form-independent-reproduction.js (the source measurement)
 *   @see imp-3844-a-weight-correction-limit-closed-form.js (the closed form being reproduced)
 *
 *   Ticket: imp-33219 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Route (1): NPHI-truncation sweep of the direct completed-Riemann series Phi(0).
// Fully converged by N=3 (n>=4 terms below machine epsilon).
export const IMP33219_NPHI_SWEEP = Object.freeze([
  { N: 1, phi0: 0.44572697131799477, deltaFromNphi10: 9.699291491286899e-4 },
  { N: 2, phi0: 0.4466968996714152, deltaFromNphi10: 7.957082770460033e-10 },
  { N: 3, phi0: 0.44669690046712346, deltaFromNphi10: 0 },
  { N: 4, phi0: 0.44669690046712346, deltaFromNphi10: 0 },
  { N: 5, phi0: 0.44669690046712346, deltaFromNphi10: 0 },
  { N: 10, phi0: 0.44669690046712346, deltaFromNphi10: 0 },
  { N: 15, phi0: 0.44669690046712346, deltaFromNphi10: 0 },
]);

// The two Phi(0) routes agree to < 1e-14, giving the same c_inf.
export const IMP33219_PHI0_DIRECT = 0.44669690046712346;
export const IMP33219_PHI0_FACTORED = 0.4466969004671235;
export const IMP33219_CINF_DIRECT = 0.35429228409357494;
export const IMP33219_CINF_FACTORED = 0.35429228409357494;
export const IMP33219_CINF_EXTRAPOLATED_IMP3730 = 0.354291;

// Route (2): Gauss-Laguerre collapsed-Laplace ladder recovering B = 3/(2 pi),
// via the single-point approach coefficient bEmp(tau) = (c(tau)-c_inf)/e^{-2 tau}.
export const IMP33219_B_CLOSED = 3 / (2 * Math.PI); // 0.477465 (imp-3844 target)

export const IMP33219_B_LADDER = Object.freeze([
  { tau: 3, cTau: 0.3554798373992727, bEmp: 0.4790931973259536 },
  { tau: 3.5, cTau: 0.3547282219525099, bEmp: 0.4780639111224026 },
  { tau: 4, cTau: 0.35445252961865564, bEmp: 0.47768517787702147 },
  { tau: 4.5, cTau: 0.3543512179221244, bEmp: 0.4775457589094061 },
  { tau: 5, cTau: 0.35431396229852874, bEmp: 0.4774942399077101 },
  { tau: 6, cTau: 0.3542952177446812, bEmp: 0.47746577389592526 },
]);

export const IMP33219_B_FINITE_DIFF = 0.47746941261389503; // [6,7] two-point estimate
