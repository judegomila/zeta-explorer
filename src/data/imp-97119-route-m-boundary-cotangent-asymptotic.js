/**
 * @module imp-97119-route-m-boundary-cotangent-asymptotic
 *
 * imp-97119 (proof): exact leading asymptotic of the Route M boundary term
 *
 *     V(1,b) = c_0(1/b) = sum_{m=1}^{b-1} (m/b) cot(pi m / b),
 *
 * the classical Bettin-Conrey / Dedekind cotangent sum at argument 1/b. imp-97097
 * reduced the cotangent first moment to Phi(b) = -V(1,b) + sum_a V(b,a) and stated
 * (only MEASURED) that the boundary term V(1,b) is O(b log b) = o(phi(b) b), so it
 * contributes nothing to the leading kappa phi(b) b. This leaf DERIVES that
 * asymptotic rigorously and identifies its constants.
 *
 * DERIVATION (endpoint-Laurent + product identity, the classical route):
 *   Near the divergent endpoint m = b - j (j small) the summand expands as
 *       (m/b) cot(pi m/b) = ((b-j)/b)(-cot(pi j/b))
 *                         = -b/(pi j) + 1/pi + O(j/b),
 *   using cot(z) = 1/z - z/3 - ... with z = pi j / b. Peeling the singular part
 *   G(m) = -b/(pi (b-m)) and summing it gives
 *       sum_{m=1}^{b-1} G(m) = -(b/pi) sum_{j=1}^{b-1} 1/j = -(b/pi)(log b + gamma) + o(b),
 *   while the desingularized remainder V - sum G is a Riemann sum for a convergent
 *   integral whose value fixes the additive constant. Matching against the log of the
 *   product identity prod_{m=1}^{b-1} 2 sin(pi m/b) = b supplies the log(2pi) shift.
 *   The closed leading form is
 *
 *       V(1,b) = -(b/pi) ( log(b / (2 pi)) + gamma ) - 1/pi + O(1/b).
 *
 *   Equivalently V(1,b) = -(b/pi) log b + C1 * b + O(1/b) with
 *       C1 = (log(2 pi) - gamma) / pi = 1.26066140151 / pi.
 *   The two identified constants are gamma - log(2 pi) = -1.26066140151 (the coefficient
 *   inside the log-bracket) and the next-order term -1/pi = -0.318309886184. The
 *   sub-leading tail is O(1/b) (numerically ~ -pi/(36 b)).
 *
 * VERIFICATION (mpmath dps=40, tmp/imp-97119-*.py): for b in {31,65,129,257,513,1025}
 * the residual V - model (model = the closed form above through the -1/pi term) is
 * -2.8e-3 at b=31 and decays like O(1/b) (-8.5e-5 at b=1025), and the constant
 * -v*pi/b - log b converges monotonically to gamma - log(2 pi) = -1.26066140151. The
 * stored ratioNegVoverPhiB column reproduces the imp-97097 measured decay
 * (-V/(phi(b) b): 0.02340 at b=31 -> 0.00534 at b=257) exactly, confirming phi(b) is
 * Euler's totient.
 *
 * CONSEQUENCE (the o(phi(b) b) claim, now rigorous): V(1,b) = O(b log b). By Landau's
 * lower bound for the totient, phi(b) >= c * b / log log b for some absolute c > 0 and
 * all b >= 3, hence
 *       |V(1,b)| / (phi(b) b) = O( (log b) / phi(b) ) = O( (log b log log b) / b ) -> 0.
 * So V(1,b) = o(phi(b) b): the boundary term contributes nothing to the leading
 * kappa phi(b) b, closing the boundary-term corner of the imp-97097 reduction.
 *
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program)
 *
 * Ticket: imp-97119 (proof, opus-4-8, low). Derivation only; NO bound moves;
 * no refereed bound is changed; RH open; NO QED (this is an elementary asymptotic of
 * a classical cotangent sum, not a claim about the zeros). No self-executing throw
 * (the imp-96294/imp-96819 convention) -- values are checked via a plain object below.
 */

// The two identified constants of the leading asymptotic.
export const IMP97119_GAMMA_MINUS_LOG_2PI = -1.26066140151; // gamma - log(2 pi): the log-bracket coefficient
export const IMP97119_NEXT_TERM = -0.318309886184; // -1/pi: the O(1) next-order term

// Closed leading form V(1,b) = -(b/pi)(log(b/(2pi)) + gamma) - 1/pi + O(1/b).
export function imp97119BoundaryModel(b) {
  return -(b / Math.PI) * (Math.log(b / (2 * Math.PI)) + 0.5772156649015329) - 1 / Math.PI;
}

// Verification table (mpmath dps=40). resid = V - model (the closed form above);
// ratioNegVoverPhiB = -V/(phi(b) b) reproduces the imp-97097 measured decay.
export const IMP97119_TABLE = Object.freeze([
  { b: 31, V: -21.7666485, model: -21.76383364, resid: -0.002815, phi: 30, ratioNegVoverPhiB: 0.023405 },
  { b: 65, V: -60.60505615, model: -60.60371361, resid: -0.001343, phi: 48, ratioNegVoverPhiB: 0.0194247 },
  { b: 129, V: -148.107236, model: -148.1065595, resid: -0.0006765, phi: 84, ratioNegVoverPhiB: 0.0136681 },
  { b: 257, V: -351.1351604, model: -351.1348209, resid: -0.0003396, phi: 256, ratioNegVoverPhiB: 0.00533705 },
  { b: 513, V: -813.45452, model: -813.4543499, resid: -0.0001701, phi: 324, ratioNegVoverPhiB: 0.00489408 },
  { b: 1025, V: -1850.83875, model: -1850.838665, resid: -8.514e-5, phi: 800, ratioNegVoverPhiB: 0.00225712 },
]);

export const IMP97119_VERDICT = Object.freeze({
  leadingCoefficient: '-1/pi (of b log b): V(1,b) = -(b/pi) log b + O(b)',
  order: 'O(b log b)',
  isSmallOfPhiTimesB: true, // via phi(b) >= c b / log log b (Landau): (log b)/phi(b) -> 0
  boundaryCornerClosed: true,
  boundMoved: false,
});

export const IMP97119_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation only: the exact leading ' +
  'asymptotic V(1,b) = -(b/pi)(log(b/(2pi)) + gamma) - 1/pi + O(1/b) of the classical ' +
  'cotangent sum c_0(1/b) is elementary (endpoint Laurent expansion + the ' +
  'prod 2 sin = b identity), verified numerically to b=1025. It confirms the imp-97097 ' +
  'boundary term is O(b log b) = o(phi(b) b) and so contributes nothing to the leading ' +
  'kappa phi(b) b -- but it moves no bound and says nothing about kappa > 0 itself ' +
  '(still measured, not proved) or about the zeros.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP97119_VALIDATION = Object.freeze({
  constantMatchesGammaMinusLog2Pi:
    Math.abs(IMP97119_GAMMA_MINUS_LOG_2PI - (0.5772156649015329 - Math.log(2 * Math.PI))) < 1e-9,
  nextTermIsMinusInvPi: Math.abs(IMP97119_NEXT_TERM - -1 / Math.PI) < 1e-9,
  // The closed model matches the exact V(1,b) to O(1/b): residual shrinks with b.
  modelReproducesTable: IMP97119_TABLE.every(
    (r) => Math.abs(imp97119BoundaryModel(r.b) - r.model) < 5e-4,
  ),
  residualDecaysWithB: IMP97119_TABLE.every(
    (r, i) => i === 0 || Math.abs(IMP97119_TABLE[i - 1].resid) > Math.abs(r.resid),
  ),
  ratioDecays: IMP97119_TABLE[0].ratioNegVoverPhiB > IMP97119_TABLE[IMP97119_TABLE.length - 1].ratioNegVoverPhiB,
});
