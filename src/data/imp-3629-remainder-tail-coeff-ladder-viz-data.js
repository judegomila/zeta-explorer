/**
 * @module imp-3629-remainder-tail-coeff-ladder-viz-data
 * @fileoverview imp-3629 -- lightweight, import-light literal data for a
 *   visualization of the imp-3581/imp-3600 remainder-tail coefficient ladders
 *   C_n and D_n and the |p_fit - 2| fit-bias trend across rungs n=3..6.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3581-remainder-tail-exponent-derivation.js (measured.oddCase,
 *   measured.evenCase, n=3,4) and imp-3600-remainder-tail-exponent-ladder-n56.js
 *   (measured.oddCaseN5, measured.evenCaseN6, n=5,6). This module does NOT
 *   import the heavy Phi-kernel/Simpson-quadrature assembly, so importing it
 *   into a page costs nothing at load time.
 *
 *   @see imp-3581-remainder-tail-exponent-derivation.js (closed C_n/D_n, n=3,4)
 *   @see imp-3600-remainder-tail-exponent-ladder-n56.js (closed C_n/D_n, n=5,6)
 *
 *   Ticket: imp-3629 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// C_n = M_(n+2)/((n+1)(n+2)M_n), D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - C_n,
// and the actual least-squares |p_fit - 2| at each rung's ladder.
export const IMP3629_COEFF_LADDER = Object.freeze([
  { n: 3, parity: 'odd', leadingCoeff: 0.0014573053565046356, nextOrderCoeff: -0.0003938278312105817, fittedExponentDev: 0.000011575072700775735 },
  { n: 4, parity: 'even', leadingCoeff: 0.0012328518945090997, nextOrderCoeff: -0.00030142373750736853, fittedExponentDev: 0.000017956241979311116 },
  { n: 5, parity: 'odd', leadingCoeff: 0.0010634775252940539, nextOrderCoeff: -0.00023766849331168405, fittedExponentDev: 0.000006985339597420648 },
  { n: 6, parity: 'even', leadingCoeff: 0.0009314281570017312, nextOrderCoeff: -0.00019186074726574697, fittedExponentDev: 0.000011429343070634701 },
]);

// C_n is monotone decreasing across the ladder (both parities interleaved).
export const IMP3629_CN_MONOTONE_DECREASING = IMP3629_COEFF_LADDER.every(
  (row, i) => i === 0 || row.leadingCoeff < IMP3629_COEFF_LADDER[i - 1].leadingCoeff,
);
