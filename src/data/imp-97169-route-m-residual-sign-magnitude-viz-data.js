/**
 * @module imp-97169-route-m-residual-sign-magnitude-viz-data
 * @fileoverview imp-97169 -- VIZ DATA ONLY. Bakes the imp-97140 fixed-omega(b) cohort tables for
 *   the Route M arithmetic first-moment residual r(b) = F_arith(b)/(phi(b) b) - kappa_arith into
 *   two chart-ready series:
 *     (1) a scatter of r(b) vs b colored by the parity of omega(b) (distinct prime count), showing
 *         the sign law and its two sweep exceptions (b=2310,2730) plus the upward primorial flip
 *         (b=30030);
 *     (2) an omega-vs-GM|r(b)| ladder on a log axis, showing the magnitude decay is NOT a clean
 *         2^(-omega) (consecutive ratios 12.43 / 1.47 / 2.46, not a constant ~2x).
 *   Values are copied literals from imp-97140's frozen exports IMP97140_COHORTS and
 *   IMP97140_SIGN_LAW -- this module does NOT recompute r(b) or omega(b). Pure frozen-object data,
 *   no imports, no self-executing assertions of its own, per the
 *   [[storage_precision_assertion_tolerance]] and [[no_heavy_imports_in_pages]] conventions --
 *   needs no separate DATA_MODULES registration.
 *
 *   SIGN-CONVENTION NOTE (honesty, not a re-derivation): imp-97140 states the rule string as
 *   "sign(r(b)) = (-1)^omega(b)" but its own cohort data is omega ODD -> r>0, omega EVEN -> r<0,
 *   i.e. sign(r(b)) = -(-1)^omega(b) = (-1)^(omega(b)+1). imp-97167 independently derived this
 *   corrected form from the imp-97133 remainder. This module reports the observed sign directly
 *   per cohort point (no ambiguous exponent string) and records BOTH label conventions so a future
 *   consumer chart cannot silently propagate the imp-97140 mislabel.
 *
 *   @see imp-97140-route-m-fixed-omega-residual-cohorts.js (the frozen cohort/sign-law tables this bakes)
 *   @see imp-97167-route-m-parity-sign-law-derivation.js (derives the corrected (-1)^(omega+1) form)
 *
 *   Ticket: imp-97169 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. The residual is a measurement, not a certificate. No refereed bound is changed.
 *   RH open. NO QED.
 */

// -- baked from imp-97140 IMP97140_COHORTS (scatter series, colored by omega parity) --
export const IMP97169_SCATTER_ROWS = Object.freeze([
  // omega = 1 (odd) -> r > 0
  Object.freeze({ b: 1009, r: 1.7989e-3, omega: 1, parity: 'odd', isException: false }),
  Object.freeze({ b: 2003, r: 9.9144e-4, omega: 1, parity: 'odd', isException: false }),
  Object.freeze({ b: 1024, r: 3.3905e-4, omega: 1, parity: 'odd', isException: false }),
  Object.freeze({ b: 2187, r: 1.8859e-4, omega: 1, parity: 'odd', isException: false }),
  // omega = 2 (even) -> r < 0
  Object.freeze({ b: 1003, r: -7.4081e-5, omega: 2, parity: 'even', isException: false }),
  Object.freeze({ b: 2021, r: -3.8264e-5, omega: 2, parity: 'even', isException: false }),
  Object.freeze({ b: 1067, r: -6.8123e-5, omega: 2, parity: 'even', isException: false }),
  // omega = 3 (odd) -> r > 0
  Object.freeze({ b: 1001, r: 5.2681e-5, omega: 3, parity: 'odd', isException: false }),
  Object.freeze({ b: 1105, r: 4.7209e-5, omega: 3, parity: 'odd', isException: false }),
  Object.freeze({ b: 2015, r: 2.7150e-5, omega: 3, parity: 'odd', isException: false }),
  // omega = 4 (even) -> r < 0
  Object.freeze({ b: 1155, r: -2.0388e-5, omega: 4, parity: 'even', isException: false }),
  Object.freeze({ b: 2145, r: -1.2998e-5, omega: 4, parity: 'even', isException: false }),
  Object.freeze({ b: 1995, r: -1.3316e-5, omega: 4, parity: 'even', isException: false }),
  // sweep exceptions: odd omega=5 predicts r>0, both observed r<0 (leading term cancelled to the floor)
  Object.freeze({ b: 2310, r: -1.0677e-6, omega: 5, parity: 'odd', isException: true, factor: '2.3.5.7.11' }),
  Object.freeze({ b: 2730, r: -5.4310e-7, omega: 5, parity: 'odd', isException: true, factor: '2.3.5.7.13' }),
  // upward primorial: even omega=6 predicts r<0, observed r>0 (flip)
  Object.freeze({ b: 30030, r: 3.5980e-7, omega: 6, parity: 'even', isException: true, factor: '2.3.5.7.11.13' }),
]);

// -- baked from imp-97140 IMP97140_COHORTS.gmAbsR / gmRatios (log-axis magnitude ladder) --
export const IMP97169_MAGNITUDE_LADDER = Object.freeze([
  Object.freeze({ omega: 1, gmAbsR: 6.75e-4 }),
  Object.freeze({ omega: 2, gmAbsR: 5.43e-5 }),
  Object.freeze({ omega: 3, gmAbsR: 3.70e-5 }),
  Object.freeze({ omega: 4, gmAbsR: 1.51e-5 }),
]);

export const IMP97169_MAGNITUDE_RATIOS = Object.freeze({
  '1to2': 12.43,
  '2to3': 1.47,
  '3to4': 2.46,
  isCleanTwoPowerOmega: false, // NOT a constant ~2x per step
});

// observed parity fact (independent of exponent-string convention): omega odd -> r>0, omega even -> r<0,
// except at the leading-term-cancelled primorial floor (b=2310, 2730, 30030).
export const IMP97169_SIGN_LAW_LABELS = Object.freeze({
  observed: 'omega(b) odd => r(b) > 0; omega(b) even => r(b) < 0 (except at the primorial floor)',
  imp97140String: '(-1)^omega(b)', // as written in imp-97140 -- data-inconsistent per imp-97167
  imp97167CorrectedString: '(-1)^(omega(b)+1)', // matches the observed data; imp-97167 STEP-4 derivation
  exceptionsAreLeadingTermCancellation: true,
});

export default Object.freeze({
  id: 'imp-97169-route-m-residual-sign-magnitude-viz-data',
  ticket: 'imp-97169',
  source: 'imp-97140-route-m-fixed-omega-residual-cohorts.js',
  scatterRows: IMP97169_SCATTER_ROWS,
  magnitudeLadder: IMP97169_MAGNITUDE_LADDER,
  magnitudeRatios: IMP97169_MAGNITUDE_RATIOS,
  signLawLabels: IMP97169_SIGN_LAW_LABELS,
  suppliesUniformRemainderBound: false,
  anyBoundMoved: false,
});
