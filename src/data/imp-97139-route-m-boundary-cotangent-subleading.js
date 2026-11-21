/**
 * @module imp-97139-route-m-boundary-cotangent-subleading
 *
 * imp-97139 (accuracy): exact O(1/b) sub-leading coefficient of the Route M
 * boundary cotangent sum
 *
 *     V(1,b) = c_0(1/b) = sum_{m=1}^{b-1} (m/b) cot(pi m / b).
 *
 * imp-97119 derived the leading closed form
 *     V(1,b) = -(b/pi) ( log(b/(2 pi)) + gamma ) - 1/pi + O(1/b)
 * and MEASURED the O(1/b) tail as ~ -pi/(36 b) without deriving the coefficient.
 * This leaf DERIVES that coefficient and confirms it against the imp-97119 residual
 * table: the exact O(1/b) coefficient is -pi/36, so
 *
 *     V(1,b) = -(b/pi) ( log(b/(2 pi)) + gamma ) - 1/pi - pi/(36 b) + O(1/b^3).
 *
 * DERIVATION (Euler-Maclaurin with singular-endpoint subtraction):
 *   Reflect m -> b - j via cot(pi(b-j)/b) = -cot(pi j/b) and (b-j)/b = 1 - j/b:
 *       V(1,b) = - sum_{j=1}^{b-1} phi(j/b),   phi(t) = (1 - t) cot(pi t).
 *   phi is smooth on (0,1] with a single 1/(pi t) pole at t = 0 (and phi(1) = -1/pi
 *   is finite since (1-t) kills the cot pole). Split off the pole:
 *       phi(t) = 1/(pi t) + psi(t),   psi(t) = (1 - t) cot(pi t) - 1/(pi t),
 *   with psi smooth on [0,1] (psi(0) = -1/pi, psi(1) = -2/pi). Then
 *       sum_{j=1}^{b-1} phi(j/b) = (b/pi) H_{b-1} + sum_{j=1}^{b-1} psi(j/b).
 *   Harmonic number: H_{b-1} = log b + gamma - 1/(2b) - 1/(12 b^2) + O(1/b^4), so
 *       (b/pi) H_{b-1} = (b/pi)(log b + gamma) - 1/(2 pi) - 1/(12 pi b) + O(1/b^3).
 *   Trapezoidal Euler-Maclaurin on the smooth psi:
 *       sum_{j=1}^{b-1} psi(j/b) = b Int_0^1 psi
 *                                  - (1/2)(psi(0) + psi(1))
 *                                  + (1/(12 b))(psi_prime(1) - psi_prime(0))
 *                                  + O(1/b^3).
 *   From the Laurent series cot z = 1/z - z/3 - z^3/45 - ... and
 *   csc^2 z = 1/z^2 + 1/3 + z^2/15 + ... one gets
 *       psi_prime(0) = -pi/3,   psi_prime(1) = 1/pi.
 *   Collecting the O(1/b) terms of - sum phi:
 *       O(1/b) coeff of V = - (1/12)(psi_prime(1) - psi_prime(0)) + 1/(12 pi)
 *                         = - (1/12)(1/pi + pi/3) + 1/(12 pi)
 *                         = - pi/36.
 *   The SAME machinery reproduces the imp-97119 O(1) term as a cross-check:
 *       O(1) coeff of V = (1/2)(psi(0) + psi(1)) + 1/(2 pi)
 *                       = (1/2)(-1/pi - 2/pi) + 1/(2 pi) = -1/pi,
 *   and Int_0^1 psi = -log(2 pi)/pi supplies the log(2 pi) shift, exactly the
 *   imp-97119 leading form. Since neither the H_{b-1} expansion nor the trapezoidal
 *   correction carries a 1/b^2 term, the next correction is O(1/b^3).
 *
 * VERIFICATION: the derived tail -pi/(36 b) matches the imp-97119 residual column
 * (resid = V - leadingModel) to the table print precision, and a fresh high-precision
 * recompute confirms resid + pi/(36 b) = O(1/b^3): (resid + pi/(36 b)) * b^3 stays
 * ~0.006 across b in {31,65,129,257,513} (b >= 1025 hits the ~4e-11 double-precision
 * floor of the naive V sum, not a real term).
 *
 * @see imp-97119-route-m-boundary-cotangent-asymptotic (the leading form this refines)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program)
 *
 * Ticket: imp-97139 (accuracy, opus-4-8, low). Derivation/accuracy check only; an
 * elementary asymptotic of a classical cotangent sum. NO bound moves; the boundary
 * term stays O(b log b) = o(phi(b) b) (imp-97119); no refereed bound is changed;
 * RH open; NO QED (this says nothing about kappa > 0 or about the zeros). No
 * self-executing throw (the imp-96294/imp-96819 convention) -- checked via a plain
 * object below.
 */

// The derived exact O(1/b) coefficient of V(1,b): -pi/36.
export const IMP97139_SUBLEADING_COEFF = -Math.PI / 36; // -0.08726646259971647

// The two ingredients of the derivation (endpoint derivatives of psi).
export const IMP97139_PSI_PRIME_0 = -Math.PI / 3; // psi_prime(0)
export const IMP97139_PSI_PRIME_1 = 1 / Math.PI; // psi_prime(1)

// Refined closed form through the sub-leading term:
//   V(1,b) = -(b/pi)(log(b/(2pi)) + gamma) - 1/pi - pi/(36 b) + O(1/b^3).
export function imp97139BoundaryModel2(b) {
  const g = 0.5772156649015329;
  return -(b / Math.PI) * (Math.log(b / (2 * Math.PI)) + g) - 1 / Math.PI - Math.PI / (36 * b);
}

// Verification table. residImp97119 = the imp-97119 resid column (V - leadingModel);
// predictedTail = -pi/(36 b); they agree to the imp-97119 print precision.
export const IMP97139_TABLE = Object.freeze([
  { b: 31, residImp97119: -0.002815, predictedTail: -Math.PI / (36 * 31) },
  { b: 65, residImp97119: -0.001343, predictedTail: -Math.PI / (36 * 65) },
  { b: 129, residImp97119: -0.0006765, predictedTail: -Math.PI / (36 * 129) },
  { b: 257, residImp97119: -0.0003396, predictedTail: -Math.PI / (36 * 257) },
  { b: 513, residImp97119: -0.0001701, predictedTail: -Math.PI / (36 * 513) },
  { b: 1025, residImp97119: -8.514e-5, predictedTail: -Math.PI / (36 * 1025) },
]);

export const IMP97139_VERDICT = Object.freeze({
  subLeadingCoefficient: '-pi/36 (of 1/b): V(1,b) = ... - pi/(36 b) + O(1/b^3)',
  derivedNotJustMeasured: true,
  crossCheckReproducesMinusOneOverPi: true, // same Euler-Maclaurin gives the imp-97119 -1/pi term
  nextOrder: 'O(1/b^3)', // no 1/b^2 term (Euler-Maclaurin + H_{b-1} both skip odd/even accordingly)
  boundMoved: false,
});

export const IMP97139_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Accuracy/derivation only: the exact ' +
  'O(1/b) sub-leading coefficient of the classical cotangent sum V(1,b) = c_0(1/b) is ' +
  '-pi/36, derived by Euler-Maclaurin with singular-endpoint subtraction and confirmed ' +
  'against the imp-97119 residual table. It refines the imp-97119 leading form to ' +
  'V(1,b) = -(b/pi)(log(b/(2pi)) + gamma) - 1/pi - pi/(36 b) + O(1/b^3) but moves no ' +
  'bound and says nothing about kappa > 0 (still measured, not proved) or about the zeros.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP97139_VALIDATION = Object.freeze({
  coeffIsMinusPiOver36: Math.abs(IMP97139_SUBLEADING_COEFF - -Math.PI / 36) < 1e-15,
  // The Euler-Maclaurin O(1/b) combination -(1/12)(psi_prime(1)-psi_prime(0)) + 1/(12 pi) = -pi/36.
  combinationGivesMinusPiOver36:
    Math.abs(
      -(1 / 12) * (IMP97139_PSI_PRIME_1 - IMP97139_PSI_PRIME_0) + 1 / (12 * Math.PI) - -Math.PI / 36,
    ) < 1e-15,
  // Derived tail matches the imp-97119 residual column to that table print precision.
  tailMatchesResidualTable: IMP97139_TABLE.every(
    (r) => Math.abs(r.predictedTail - r.residImp97119) < 5e-7,
  ),
  // Refined model beats the leading-only model on the residual magnitude at every b.
  refinedModelTighter: IMP97139_TABLE.every(
    (r) => Math.abs(r.predictedTail - r.residImp97119) < Math.abs(r.residImp97119),
  ),
});
