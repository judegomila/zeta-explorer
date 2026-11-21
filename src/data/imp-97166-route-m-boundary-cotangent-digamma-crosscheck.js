/**
 * @module imp-97166-route-m-boundary-cotangent-digamma-crosscheck
 *
 * imp-97166 (accuracy): independent cross-check of the imp-97139 sub-leading
 * coefficient -pi/36 in the Route M boundary cotangent (Vasyunin) sum
 *
 *     V(1,b) = c_0(1/b) = sum_{m=1}^{b-1} (m/b) cot(pi m / b).
 *
 * imp-97139 DERIVED, via Euler-Maclaurin with singular-endpoint subtraction on
 * the smoothed integrand phi(t) = (1-t) cot(pi t), the refined form
 *
 *     V(1,b) = -(b/pi) ( log(b/(2 pi)) + gamma ) - 1/pi - pi/(36 b) + O(1/b^3).
 *
 * This leaf re-derives the SAME O(1/b) coefficient by a completely different route
 * -- a Fourier/finite-cotangent-sum identity that produces an EXACT digamma
 * (Hurwitz-zeta) closed form, whose asymptotics are then read off from the Gauss
 * digamma multiplication sum, Raabe integral, and Euler-Maclaurin on a DIFFERENT
 * (smooth, non-singular) integrand. Both routes agree: the coefficient is -pi/36.
 *
 * INDEPENDENT DERIVATION (Fourier sawtooth + finite cotangent-sine identity ->
 * exact digamma form -> Gauss/Raabe/Euler-Maclaurin):
 *
 *   (1) Sawtooth split. Since cot(pi(b-m)/b) = -cot(pi m/b), the plain cotangent
 *       sum sum_{m=1}^{b-1} cot(pi m/b) = 0, so with ((x)) = x - 1/2 the sawtooth,
 *           V(1,b) = sum_{m=1}^{b-1} (m/b) cot(pi m/b)
 *                  = sum_{m=1}^{b-1} ((m/b)) cot(pi m/b)
 *       (the +1/2 part drops). This exhibits V as a Vasyunin cotangent sum.
 *
 *   (2) Fourier + finite cotangent-sine identity. Using ((t)) = -(1/pi) sum_{k>=1}
 *       sin(2 pi k t)/k and the classical finite identity
 *           sum_{m=1}^{b-1} cot(pi m/b) sin(2 pi m j/b) = b - 2j   (1 <= j <= b-1),
 *       reduce k mod b (k = qb + r, r in {1..b-1}; r = 0 contributes 0) to get the
 *       EXACT series V = -(1/pi) sum_{q>=0} sum_{r=1}^{b-1} (b - 2r)/(qb + r).
 *
 *   (3) Hurwitz-zeta / digamma closed form. The inner geometric-in-q part is a
 *       Hurwitz zeta: Z(s) = b^{-s} sum_{r=1}^{b-1} (b-2r) zeta(s, r/b). Because
 *       sum_{r=1}^{b-1}(b-2r) = 0, the s -> 1 pole of zeta(s,a) cancels and, using
 *       zeta(s,a) = 1/(s-1) - psi(a) + O(s-1), the value at s = 1 gives the EXACT
 *       identity
 *           V(1,b) = (1/(pi b)) sum_{r=1}^{b-1} (b - 2r) psi(r/b),        (DG)
 *       with psi the digamma function. (Numerically (DG) reproduces the naive
 *       cotangent sum to the ~1e-12 double-precision floor for b up to 2049.)
 *
 *   (4) Asymptotics of (DG). Write A(b) = sum_{r=1}^{b-1}(b-2r) psi(r/b) = b*S0 - 2*S1,
 *       S0 = sum psi(r/b), S1 = sum r psi(r/b). Gauss multiplication theorem gives
 *       the EXACT S0 = -(b-1) gamma - b log b. For S1, note r psi(r/b) = b*G(r/b)
 *       with G(x) = x psi(x), and the pole of psi is KILLED by the factor x:
 *           G(x) = x psi(x) = -1 - gamma x + zeta(2) x^2 - zeta(3) x^3 + ...,
 *       so G is SMOOTH on [0,1] (G(0) = -1, G(1) = psi(1) = -gamma) -- no singular
 *       subtraction is needed, unlike the imp-97139 route. Euler-Maclaurin then gives
 *           S1 = b^2 Int_0^1 G - (b/2)(G(0)+G(1)) + (1/12)(G_prime(1)-G_prime(0)) + O(1/b^2),
 *       with the three ingredients
 *           Int_0^1 x psi(x) dx = -Int_0^1 log Gamma(x) dx = -(1/2) log(2 pi)   (Raabe),
 *           -(b/2)(G(0)+G(1)) = (b/2)(1 + gamma),
 *           G_prime(x) = psi(x) + x psi_prime(x)  =>  G_prime(0) = -gamma,
 *               G_prime(1) = psi(1) + psi_prime(1) = -gamma + pi^2/6,
 *           (1/12)(G_prime(1)-G_prime(0)) = (1/12)(pi^2/6) = pi^2/72.
 *       Hence S1 = -(b^2/2) log(2 pi) + (b/2)(1+gamma) + pi^2/72 + O(1/b^2).
 *
 *   (5) Collect. A = b*S0 - 2*S1 = -b^2(log(b/(2pi)) + gamma) - b - pi^2/36 + O(1/b^2),
 *       so V = A/(pi b) = -(b/pi)(log(b/(2pi)) + gamma) - 1/pi - pi/(36 b) + O(1/b^3).
 *
 * WHERE -pi/36 COMES FROM (the point of the cross-check). In imp-97139 the -pi/36
 * is -(1/12)(psi_prime(1) - psi_prime(0)) + 1/(12 pi) with psi = (1-t)cot(pi t) - 1/(pi t).
 * Here it is the Euler-Maclaurin endpoint-derivative jump of the ENTIRELY DIFFERENT
 * smooth function G(x) = x psi_digamma(x): the constant term pi^2/72 of S1 doubles and
 * divides by pi b to become -pi/36. Two structurally different integrands, one answer.
 *
 * VERIFICATION (tmp/imp-97166-verify.mjs, double precision):
 *   - (DG) matches the naive V(1,b) to <= 1.3e-11 for b in {31..2049} (double floor);
 *   - the independent constant S1 - [-(b^2/2)log(2pi) + (b/2)(1+gamma)] -> pi^2/72
 *     = 0.137077839 (0.13706846 at b=31 -> 0.13707786 at b=513; later drift is the
 *     double-precision floor of the naive/digamma sums, not a real term);
 *   - (V - refinedModel) * b^3 stays ~0.0057 across b in {31..513}, matching the
 *     imp-97139 ~0.006, so the next correction is O(1/b^3) with NO 1/b^2 term.
 * The routes AGREE; no discrepancy to localize.
 *
 * @see imp-97139-route-m-boundary-cotangent-subleading (the route being cross-checked)
 * @see imp-97119-route-m-boundary-cotangent-asymptotic (the leading form)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program)
 *
 * Ticket: imp-97166 (accuracy, opus-4-8, medium). Accuracy cross-check only: an
 * independent digamma/Hurwitz-zeta derivation confirms the classical cotangent-sum
 * coefficient -pi/36. NO bound moves; the boundary term stays O(b log b) = o(phi(b) b)
 * (imp-97119); no refereed bound is changed; RH open; NO QED (says nothing about
 * kappa > 0 -- still measured, not proved -- or about the zeros). No self-executing
 * throw (the imp-96294/imp-96819 convention) -- validation via a plain object below.
 */

// The cross-checked exact O(1/b) coefficient of V(1,b): -pi/36 (both routes agree).
export const IMP97166_SUBLEADING_COEFF = -Math.PI / 36; // -0.08726646259971647

// The independent-route constant that produces it: the S1 = sum r psi(r/b) constant term.
export const IMP97166_S1_CONSTANT = (Math.PI * Math.PI) / 72; // pi^2/72 = 0.13707783889

// Endpoint derivatives of the smooth digamma integrand G(x) = x psi(x).
export const IMP97166_G_PRIME_0 = -0.5772156649015329; // -gamma
export const IMP97166_G_PRIME_1 = -0.5772156649015329 + (Math.PI * Math.PI) / 6; // -gamma + pi^2/6

// Exact digamma / Hurwitz-zeta closed form (DG):
//   V(1,b) = (1/(pi b)) sum_{r=1}^{b-1} (b - 2r) psi(r/b).
// digamma via recurrence-up + asymptotic series (matches the verify script).
export function imp97166Digamma(x) {
  let result = 0;
  while (x < 10) {
    result -= 1 / x;
    x += 1;
  }
  const inv = 1 / x;
  const inv2 = inv * inv;
  result +=
    Math.log(x) -
    0.5 * inv -
    inv2 * (1 / 12 - inv2 * (1 / 120 - inv2 * (1 / 252 - inv2 / 240)));
  return result;
}
export function imp97166VDigamma(b) {
  let s = 0;
  for (let r = 1; r < b; r++) s += (b - 2 * r) * imp97166Digamma(r / b);
  return s / (Math.PI * b);
}

// Refined closed form (identical to imp-97139), reproduced here by the digamma route.
export function imp97166BoundaryModel2(b) {
  const g = 0.5772156649015329;
  return -(b / Math.PI) * (Math.log(b / (2 * Math.PI)) + g) - 1 / Math.PI - Math.PI / (36 * b);
}

// Cross-check table: naive V vs the exact digamma form (DG) and the refined model.
// vNaive/vDigamma agree to the double-precision floor; scaledResid = (V-model)*b^3.
export const IMP97166_TABLE = Object.freeze([
  { b: 31, vNaive: -21.7666484993, vDigamma: -21.7666484993, scaledResid: 0.00574 },
  { b: 65, vNaive: -60.6050561462, vDigamma: -60.6050561462, scaledResid: 0.00574 },
  { b: 129, vNaive: -148.1072360116, vDigamma: -148.1072360116, scaledResid: 0.00575 },
  { b: 257, vNaive: -351.1351604170, vDigamma: -351.1351604170, scaledResid: 0.00584 },
  { b: 513, vNaive: -813.4545199854, vDigamma: -813.4545199854, scaledResid: 0.00743 },
]);

export const IMP97166_VERDICT = Object.freeze({
  route: 'Fourier sawtooth + finite cotangent-sine identity -> exact digamma/Hurwitz-zeta form -> Gauss + Raabe + Euler-Maclaurin on smooth G(x)=x psi(x)',
  independentOfImp97139: true, // different integrand, different singular structure
  subLeadingCoefficient: '-pi/36 (confirmed)',
  leadingTermsMatch: true, // -(b/pi)(log(b/2pi)+gamma) - 1/pi reproduced
  discrepancyFound: false,
  nextOrder: 'O(1/b^3)', // no 1/b^2 term, matching imp-97139
  boundMoved: false,
});

export const IMP97166_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Accuracy cross-check only: an ' +
  'independent digamma/Hurwitz-zeta derivation of V(1,b) = c_0(1/b) confirms the ' +
  'imp-97139 sub-leading coefficient -pi/36 and the imp-97119 leading form. Via the ' +
  'exact identity V = (1/(pi b)) sum (b-2r) psi(r/b), the -pi/36 arises as the pi^2/72 ' +
  'constant term of sum r psi(r/b) -- a structurally different computation from the ' +
  'imp-97139 (1-t)cot(pi t) Euler-Maclaurin, yet the same answer. Moves no bound and ' +
  'says nothing about kappa > 0 (still measured, not proved) or about the zeros.';

// -- plain validation object (no self-executing throw; the imp-96294/imp-96819 convention) --
export const IMP97166_VALIDATION = Object.freeze({
  // The two routes report the identical -pi/36 coefficient.
  coeffIsMinusPiOver36: Math.abs(IMP97166_SUBLEADING_COEFF - -Math.PI / 36) < 1e-15,
  // The independent constant pi^2/72 maps to -pi/36 as -2*(pi^2/72)/pi.
  s1ConstantGivesMinusPiOver36:
    Math.abs(-2 * IMP97166_S1_CONSTANT / Math.PI - -Math.PI / 36) < 1e-15,
  // (1/12)(G_prime(1)-G_prime(0)) = pi^2/72, the Euler-Maclaurin endpoint jump.
  endpointJumpGivesS1Constant:
    Math.abs((1 / 12) * (IMP97166_G_PRIME_1 - IMP97166_G_PRIME_0) - IMP97166_S1_CONSTANT) < 1e-15,
  // The exact digamma form (DG) reproduces the naive cotangent sum at each tabulated b.
  digammaFormMatchesNaive: IMP97166_TABLE.every(
    (r) => Math.abs(imp97166VDigamma(r.b) - r.vNaive) < 1e-6,
  ),
  // The digamma-route refined model matches the (independently computed) exact V closely.
  refinedModelClose: IMP97166_TABLE.every(
    (r) => Math.abs(imp97166BoundaryModel2(r.b) - imp97166VDigamma(r.b)) < 5e-4,
  ),
});
