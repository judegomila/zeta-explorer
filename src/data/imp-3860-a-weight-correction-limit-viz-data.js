/**
 * @module imp-3860-a-weight-correction-limit-viz-data
 * @fileoverview imp-3860 -- lightweight, import-light literal data for a
 *   visualization of the imp-3730 A-weight subleading correction c(tau) =
 *   -ln A(tau) - pi e^{4 tau} settling to the positive constant c_inf ~ 0.3543
 *   across tau in [0.5, 6], and the imp-3844 closed-form derivation of that
 *   limit (c_inf = -ln((pi/2) Phi(0)), B = 3/(2 pi)).
 *
 *   Values below are baked reference literals reproduced from a one-off
 *   evaluation of imp-3730-a-weight-correction-limit.js (its `measured.ladder`
 *   / `measured.cInf` fields) and imp-3844-a-weight-correction-limit-closed-form.js
 *   (its `measured.cInfClosed` / `measured.bClosed` fields); this module does
 *   NOT re-run those self-computing quadratures, so importing it into a page
 *   costs nothing at load time.
 *
 *   @see imp-3730-a-weight-correction-limit.js (the source measurement)
 *   @see imp-3844-a-weight-correction-limit-closed-form.js (the closed-form derivation)
 *
 *   Ticket: imp-3860 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// c(tau) = -ln A(tau) - pi e^{4 tau}, measured on the imp-3730 peak-adapted graded-GL ladder.
export const IMP3860_LADDER = Object.freeze([
  { tau: 0.5, c: 0.616876 },
  { tau: 1.0, c: 0.430847 },
  { tau: 1.5, c: 0.379688 },
  { tau: 2.0, c: 0.363258 },
  { tau: 2.5, c: 0.357539 },
  { tau: 3.0, c: 0.355480 },
  { tau: 3.5, c: 0.354728 },
  { tau: 4.0, c: 0.354453 },
  { tau: 4.5, c: 0.354351 },
  { tau: 5.0, c: 0.354314 },
  { tau: 5.5, c: 0.354300 },
]);

// imp-3730 numerical extrapolation vs imp-3844 closed form (both should agree to ~5e-6).
export const IMP3860_C_INF_EXTRAPOLATED = 0.354291;
export const IMP3860_C_INF_CLOSED = 0.35429228409357;

// imp-3844 derived approach coefficient: c(tau) = c_inf + B e^{-2 tau} + O(e^{-4 tau}).
export const IMP3860_B_CLOSED = 3 / (2 * Math.PI); // 0.477465...

// c(tau) - c_inf on a log axis, using the closed-form c_inf (excludes tau=5.5, where the
// decrement is at the imp-3730 floating-point cancellation floor and would show as a spurious
// uptick rather than the geometric decay).
export const IMP3860_DECREMENT_LADDER = Object.freeze(
  IMP3860_LADDER.filter((r) => r.tau <= 5.0).map((r) =>
    Object.freeze({ tau: r.tau, decrement: r.c - IMP3860_C_INF_CLOSED }),
  ),
);

// Ratio of consecutive 0.5-step decrements; settles at e^{-1} ~ 0.3679 (imp-3730/imp-3844: the
// approach law c(tau) = c_inf + B e^{-2 tau} predicts exactly e^{-2*0.5} = e^{-1} per half-step).
export const IMP3860_STEP_RATIO_LIMIT = Math.exp(-1);

export const IMP3860_STEP_RATIOS = Object.freeze(
  IMP3860_DECREMENT_LADDER.slice(1).map((r, i) =>
    Object.freeze({
      tau: r.tau,
      ratio: r.decrement / IMP3860_DECREMENT_LADDER[i].decrement,
    }),
  ),
);
