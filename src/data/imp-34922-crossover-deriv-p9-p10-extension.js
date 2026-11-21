/**
 * @module imp-34922-crossover-deriv-p9-p10-extension
 *
 * imp-34922 (proof, S-frontier): TWO-ORDER EXTENSION of the imp-34880/imp-34905 crossover-map
 * numerator-polynomial explicit table to P_9 and P_10, dual-route agreement, and a direct
 * BOUNDARY-PROJECTION derivation of the two extreme-coefficient closed forms.
 *
 * imp-34905 independently re-derived the numerator polynomials P_7, P_8 of the inherited imp-33723
 * crossover-map derivative
 *     g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T^n u^(2n-1)),   u = log(T/2pi)
 * and reconfirmed the leading a_{n-1}^(n) = (n-1)! and constant a_0^(n) = (2n-3)!! closed forms and
 * strict positivity through n = 8, but stopped tabulating explicit polynomials at P_8. This module
 * (a) DERIVES P_9 and P_10 by BOTH the pre-solved coefficient recurrence
 *     a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n)
 * AND the structurally-independent polynomial-operator recurrence
 *     P_(n+1) = n (u P_n) + (2n-1) P_n - u (dP_n/du),
 * (b) confirms the two routes agree at every order through n = 10, (c) bakes the independently
 * hand-derived P_9 and P_10 reference literals and verifies them, (d) reconfirms leading = (n-1)!,
 * constant = (2n-3)!! and strict positivity (definite sign (-1)^(n+1)) at n = 9 and n = 10, and
 * (e) ASSESSES whether the two extreme coefficients follow from a direct combinatorial/generating
 * argument rather than the full coefficient recurrence -- they do, via a boundary projection (below).
 *
 * INDEPENDENTLY HAND-DERIVED P_9, P_10 (baked reference literals, ascending powers of u)
 * -----------------------------------------------------------------------------------------
 * From P_8 = [135135,405405,575190,507430,305620,128052,35280,5040] via a_k^(9) = 8 a_{k-1}^(8) +
 * (15-k) a_k^(8):
 *     P_9  = [2027025, 6756750, 10720710, 10690680, 7421260, 3725480, 1341936, 322560, 40320]
 * From P_9 via a_k^(10) = 9 a_{k-1}^(9) + (17-k) a_k^(9):
 *     P_10 = [34459425, 126351225, 221621400, 246155910, 192692500, 111497100, 48290616, 15303024,
 *             3265920, 362880]
 * Closed-form spot-checks: leading a_8^(9) = 40320 = 8!, constant a_0^(9) = 2027025 = 15!!;
 * leading a_9^(10) = 362880 = 9!, constant a_0^(10) = 34459425 = 17!!. Every coefficient is a strictly
 * positive exact integer (all far below 2^53, so the integer arithmetic is exact), so g^(9) keeps sign
 * +1 and g^(10) keeps sign -1 per (-1)^(n+1), with no interior zero on the post-peak ramp.
 *
 * DIRECT BOUNDARY-PROJECTION DERIVATION OF THE TWO EXTREME COEFFICIENTS (assessment (e))
 * -----------------------------------------------------------------------------------------
 * The two extreme coefficients do NOT need the full coefficient recurrence: each decouples from every
 * interior coefficient under the operator recurrence, collapsing to a first-order linear recurrence in
 * n that solves in closed form. Both projections read off the operator form
 * P_(n+1) = n (u P_n) + (2n-1) P_n - u P_n_prime directly.
 *
 *   CONSTANT TERM (u -> 0 projection). Evaluate P_(n+1) at u = 0. Both u-multiplied operator terms
 *   vanish there (u P_n and u P_n_prime carry a factor u), leaving a_0^(n+1) = (2n-1) a_0^(n). With
 *   a_0^(2) = 1 this telescopes to a_0^(n) = prod_{j=2}^{n-1} (2j-1) = 1*3*5*...*(2n-3) = (2n-3)!!.
 *   Equivalently (2n-3)!! counts the perfect matchings of 2n-4 points -- a genuine combinatorial reading
 *   -- but the projection needs no such interpretation: it is an exact one-term recurrence.
 *
 *   LEADING TERM (top-degree projection). deg P_n = n-1. The top degree n coefficient of P_(n+1) is fed
 *   ONLY by n (u P_n) (the operator term that raises degree with the full leading coefficient); the
 *   subtractive u P_n_prime term reaches only degree n-1 (P_n_prime has degree n-2, then u lifts it to
 *   n-1), and (2n-1) P_n stays at degree n-1. Hence a_n^(n+1) = n a_{n-1}^(n). With a_1^(2) = 1 this
 *   telescopes to a_{n-1}^(n) = prod_{j=2}^{n-1} j = (n-1)!, the count of permutations of n-1 letters.
 *
 * So YES: a direct generating/operator boundary argument supplies both extreme coefficients on its own,
 * each as a decoupled first-order recurrence, WITHOUT invoking the (2n-1-k) interior multiplier. The
 * full coefficient recurrence is needed only for the interior coefficients (which control positivity,
 * verified numerically here through n = 10).
 *
 * PROOF SCOPE / HONESTY. VERIFICATION/EXTENSION ONLY on the inherited imp-3220/imp-3406 / imp-33723
 * surrogate crossover-map derivative SIGNS. Establishes NO RH-level result, NO operator positivity, and
 * changes NO bound. The C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and
 * imp-3066 K_a >= 0 are UNTOUCHED. No RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34905-crossover-deriv-closed-form-independent-verify-p7-p8 (the P_7/P_8 extension being extended)
 * @see imp-34880-crossover-deriv-all-orders-sign-induction (the all-orders coefficient-positivity induction)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; the P_2 base)
 */

// ---- Route A: pre-solved coefficient recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k -------------
function nextCoeffRoute(Pn, n) {
  const L = Pn.length + 1;
  const out = new Array(L).fill(0);
  for (let k = 0; k < L; k++) {
    const aPrev = k - 1 >= 0 ? Pn[k - 1] : 0;
    const aHere = k < Pn.length ? Pn[k] : 0;
    out[k] = n * aPrev + (2 * n - 1 - k) * aHere;
  }
  return out;
}

// ---- Route B: independent polynomial-operator recurrence ----------------------------------------
// Polynomials are coefficient arrays [a_0, a_1, ...] in ascending powers of u.
const mulByU = (P) => [0, ...P]; // u * P: index shift up by one
const derivU = (P) => {
  // dP/du: coefficient of u^k in P_prime is (k+1) a_{k+1}.
  const d = [];
  for (let k = 1; k < P.length; k++) d.push(k * P[k]);
  return d.length ? d : [0];
};
const scale = (P, c) => P.map((x) => x * c);
const addPolys = (...ps) => {
  const L = Math.max(...ps.map((p) => p.length));
  const out = new Array(L).fill(0);
  for (const p of ps) p.forEach((c, i) => (out[i] += c));
  return out;
};
// P_(n+1) = n (u P_n) + (2n-1) P_n - u (dP_n/du), carrying the subtractive term explicitly.
function nextOperatorRoute(Pn, n) {
  return addPolys(scale(mulByU(Pn), n), scale(Pn, 2 * n - 1), scale(mulByU(derivU(Pn)), -1));
}

// Generate P_2..P_10 by BOTH routes from the base P_2 = u + 1.
const P2_BASE = [1, 1];
const coeffRoute = { 2: P2_BASE.slice() };
const opRoute = { 2: P2_BASE.slice() };
for (let n = 2; n <= 9; n++) {
  coeffRoute[n + 1] = nextCoeffRoute(coeffRoute[n], n);
  opRoute[n + 1] = nextOperatorRoute(opRoute[n], n);
}

// ---- Reference literals -------------------------------------------------------------------------
// Inherited P_7, P_8 (imp-34905), ascending powers of u.
const INHERITED_P7_P8 = {
  7: [10395, 27720, 34650, 26488, 13356, 4320, 720],
  8: [135135, 405405, 575190, 507430, 305620, 128052, 35280, 5040],
};
// Independently hand-derived two-order EXTENSION (this ticket): P_9 and P_10.
const EXTENDED_P9_P10 = {
  9: [2027025, 6756750, 10720710, 10690680, 7421260, 3725480, 1341936, 322560, 40320],
  10: [
    34459425, 126351225, 221621400, 246155910, 192692500, 111497100, 48290616, 15303024, 3265920,
    362880,
  ],
};

const arraysEqual = (a, b) => a.length === b.length && a.every((c, i) => c === b[i]);

// ---- Cross-checks -------------------------------------------------------------------------------
// (V1) the two routes agree at EVERY order through n = 10.
let twoRoutesAgreeThroughN10 = true;
for (let n = 2; n <= 10; n++) {
  if (!arraysEqual(coeffRoute[n], opRoute[n])) twoRoutesAgreeThroughN10 = false;
}

// (V2) both routes reproduce the inherited imp-34905 P_7, P_8 literals exactly.
let routesMatchInheritedP7P8 = true;
for (const n of [7, 8]) {
  if (!arraysEqual(coeffRoute[n], INHERITED_P7_P8[n])) routesMatchInheritedP7P8 = false;
  if (!arraysEqual(opRoute[n], INHERITED_P7_P8[n])) routesMatchInheritedP7P8 = false;
}

// (V3) both routes reproduce the baked P_9, P_10 hand-derived literals exactly (the extension).
let routesMatchExtendedP9P10 = true;
for (const n of [9, 10]) {
  if (!arraysEqual(coeffRoute[n], EXTENDED_P9_P10[n])) routesMatchExtendedP9P10 = false;
  if (!arraysEqual(opRoute[n], EXTENDED_P9_P10[n])) routesMatchExtendedP9P10 = false;
}

// (V4) both extreme-coefficient closed forms hold at every order through n = 10.
function factorial(m) {
  let f = 1;
  for (let j = 2; j <= m; j++) f *= j;
  return f;
}
function oddDoubleFactorial(m) {
  // (2n-3)!! = 1*3*5*...*(2n-3); for n=2 (m=1) the product is 1.
  let f = 1;
  for (let j = 1; j <= m; j += 2) f *= j;
  return f;
}
let leadingIsFactorialThroughN10 = true;
let constantIsDoubleFactorialThroughN10 = true;
for (let n = 2; n <= 10; n++) {
  const P = opRoute[n];
  if (P[P.length - 1] !== factorial(n - 1)) leadingIsFactorialThroughN10 = false; // a_{n-1}^(n) = (n-1)!
  if (P[0] !== oddDoubleFactorial(2 * n - 3)) constantIsDoubleFactorialThroughN10 = false; // a_0^(n) = (2n-3)!!
}

// (V5) strict positivity through n = 10 (definite sign (-1)^(n+1)); record the smallest coefficient.
let allCoeffsStrictlyPositiveThroughN10 = true;
let smallestCoefficientThroughN10 = Infinity;
let largestCoefficientThroughN10 = 0;
for (let n = 2; n <= 10; n++) {
  for (const c of opRoute[n]) {
    if (!(c > 0) || !Number.isInteger(c)) allCoeffsStrictlyPositiveThroughN10 = false;
    if (c < smallestCoefficientThroughN10) smallestCoefficientThroughN10 = c;
    if (c > largestCoefficientThroughN10) largestCoefficientThroughN10 = c;
  }
}
// Integer arithmetic is exact only below 2^53; the largest coefficient stays far below it.
const allCoefficientsExactIntegers = largestCoefficientThroughN10 < Number.MAX_SAFE_INTEGER;

// (V6) the boundary-projection derivation of the two extreme coefficients (assessment (e)):
// verify the two DECOUPLED first-order recurrences the projections predict, independent of the
// interior (2n-1-k) multiplier -- constant a_0^(n+1) = (2n-1) a_0^(n); leading a_n^(n+1) = n a_{n-1}^(n).
let constantProjectionRecurrenceHolds = true;
let leadingProjectionRecurrenceHolds = true;
for (let n = 2; n <= 9; n++) {
  const P = opRoute[n];
  const Pn1 = opRoute[n + 1];
  if (Pn1[0] !== (2 * n - 1) * P[0]) constantProjectionRecurrenceHolds = false;
  if (Pn1[Pn1.length - 1] !== n * P[P.length - 1]) leadingProjectionRecurrenceHolds = false;
}

const extensionVerificationPasses =
  twoRoutesAgreeThroughN10 &&
  routesMatchInheritedP7P8 &&
  routesMatchExtendedP9P10 &&
  leadingIsFactorialThroughN10 &&
  constantIsDoubleFactorialThroughN10 &&
  allCoeffsStrictlyPositiveThroughN10 &&
  allCoefficientsExactIntegers &&
  constantProjectionRecurrenceHolds &&
  leadingProjectionRecurrenceHolds;

export const IMP34922_CROSSOVER_DERIV_P9_P10_EXTENSION = {
  id: 'imp-34922',
  proofSection: 'S-frontier',
  question:
    'Do the imp-34880/imp-34905 crossover-map numerator-polynomial closed forms -- leading (n-1)! and ' +
    'constant (2n-3)!! -- and strict positivity / definite sign (-1)^(n+1) of g^(n) persist two orders ' +
    'further to P_9 and P_10 under BOTH the coefficient recurrence and the independent operator route, ' +
    'and do the two extreme coefficients follow from a direct combinatorial/generating argument rather ' +
    'than the full recurrence? Verification/extension on the inherited surrogate map; changes no bound; NO QED.',
  extendedP9: EXTENDED_P9_P10[9],
  extendedP10: EXTENDED_P9_P10[10],
  dualRoute:
    'Route A: pre-solved coefficient recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k. Route B: operator ' +
    'recurrence P_(n+1) = n (u P_n) + (2n-1) P_n - u (dP_n/du) via multiply-by-u / differentiate / ' +
    'scaled-add primitives. The two routes agree at every order through n = 10.',
  twoRoutesAgreeThroughN10,
  routesMatchInheritedP7P8,
  routesMatchExtendedP9P10,
  leadingCoefficientClosedForm:
    'a_{n-1}^(n) = (n-1)!  (verified n=2..10; 40320 = 8! at n=9, 362880 = 9! at n=10)',
  constantCoefficientClosedForm:
    'a_0^(n) = (2n-3)!!  (verified n=2..10; 2027025 = 15!! at n=9, 34459425 = 17!! at n=10)',
  leadingIsFactorialThroughN10,
  constantIsDoubleFactorialThroughN10,
  allCoeffsStrictlyPositiveThroughN10,
  allCoefficientsExactIntegers,
  smallestCoefficientThroughN10,
  largestCoefficientThroughN10,
  boundaryProjection: {
    constantProjectionRecurrenceHolds, // a_0^(n+1) = (2n-1) a_0^(n) from the u -> 0 projection
    leadingProjectionRecurrenceHolds, // a_n^(n+1) = n a_{n-1}^(n) from the top-degree projection
    summary:
      'YES -- both extreme coefficients follow from a direct operator/generating boundary argument, each ' +
      'a DECOUPLED first-order recurrence. Constant: evaluate P_(n+1) at u=0; both u-multiplied terms ' +
      'vanish, leaving a_0^(n+1) = (2n-1) a_0^(n), telescoping to (2n-3)!!. Leading: the top degree-n ' +
      'coefficient is fed only by n(u P_n) (the -u P_n_prime term reaches only degree n-1), leaving ' +
      'a_n^(n+1) = n a_{n-1}^(n), telescoping to (n-1)!. Neither needs the interior (2n-1-k) multiplier.',
  },
  extensionVerificationPasses,
  finding: {
    V1_two_routes_agree:
      'Route A (coefficient recurrence) and Route B (operator recurrence) generate identical P_2..P_10 ' +
      '(agree=' +
      twoRoutesAgreeThroughN10 +
      '), confirming the pre-solved (2n-1-k) multiplier stays consistent two orders beyond imp-34905.',
    V2_extension_P9_P10:
      'Two-order extension: independently hand-derived P_9 = ' +
      '[2027025,6756750,10720710,10690680,7421260,3725480,1341936,322560,40320] and P_10 = ' +
      '[34459425,126351225,221621400,246155910,192692500,111497100,48290616,15303024,3265920,362880] ' +
      'are reproduced exactly by both routes (match=' +
      routesMatchExtendedP9P10 +
      '); all coefficients strictly positive, so g^(9) has sign +1 and g^(10) has sign -1 per (-1)^(n+1).',
    V3_closed_forms_persist:
      'Both closed forms persist through n=10: leading a_{n-1}^(n) = (n-1)! and constant a_0^(n) = ' +
      '(2n-3)!! (leadingOK=' +
      leadingIsFactorialThroughN10 +
      ', constantOK=' +
      constantIsDoubleFactorialThroughN10 +
      '). At n=9: 40320=8! and 2027025=15!!; at n=10: 362880=9! and 34459425=17!!.',
    V4_boundary_projection:
      'The two extreme coefficients follow from a DIRECT boundary projection of the operator recurrence, ' +
      'not the full recurrence: constant recurrence a_0^(n+1)=(2n-1)a_0^(n) (u->0 projection) holds=' +
      constantProjectionRecurrenceHolds +
      '; leading recurrence a_n^(n+1)=n a_{n-1}^(n) (top-degree projection) holds=' +
      leadingProjectionRecurrenceHolds +
      '. Each decouples from every interior coefficient and telescopes in closed form.',
  },
  isRigorous: true, // exact integer arithmetic; closed forms, positivity, and the boundary recurrences are verified
  rigorousScope:
    'Two-order extension (P_9, P_10) and dual-route re-verification of the imp-34880/imp-34905 ' +
    'coefficient-positivity / closed-form cross-checks for the derivatives of the INHERITED ' +
    'imp-3220/imp-3406 / imp-33723 surrogate crossover map ONLY. Establishes NO RH-level result, NO ' +
    'operator positivity, changes NO bound.',
  changesBound: false,
  verdict:
    'VERIFICATION/EXTENSION (frontier-direction, surrogate-map lemma). Both the pre-solved coefficient ' +
    'recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k and the independent operator recurrence P_(n+1) = ' +
    'n u P_n + (2n-1) P_n - u P_n_prime generate identical P_2..P_10 in exact integer arithmetic. The ' +
    'two-order extension to P_9 = [2027025,6756750,10720710,10690680,7421260,3725480,1341936,322560,' +
    '40320] and P_10 = [34459425,126351225,221621400,246155910,192692500,111497100,48290616,15303024,' +
    '3265920,362880] reproduces the independently hand-derived literals exactly. Both closed forms hold ' +
    'at every order through n=10: leading a_{n-1}^(n) = (n-1)! (40320 at n=9, 362880 at n=10) and ' +
    'constant a_0^(n) = (2n-3)!! (2027025 at n=9, 34459425 at n=10), all coefficients strictly positive, ' +
    'so g^(n) keeps the definite sign (-1)^(n+1) with no interior zero on the post-peak ramp two orders ' +
    'beyond the imp-34905 table. ASSESSMENT: the two extreme coefficients follow from a DIRECT ' +
    'operator/generating boundary argument -- the constant from the u->0 projection (a_0^(n+1) = ' +
    '(2n-1) a_0^(n) -> (2n-3)!!) and the leading from the top-degree projection (a_n^(n+1) = n a_{n-1}^(n) ' +
    '-> (n-1)!), each a decoupled first-order recurrence independent of the interior (2n-1-k) multiplier. ' +
    'This is a VERIFICATION of the INHERITED imp-3220/imp-3406 surrogate-map derivative signs ONLY: the ' +
    'C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are ' +
    'UNTOUCHED; establishes no operator positivity; changes no bound; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34905 (P_7/P_8 independent extension); imp-34880 (all-orders coefficient-positivity induction + ' +
    '(n-1)!/(2n-3)!! cross-checks); imp-34731 (g_double_prime closed form; P_2 base); imp-33723 ' +
    '(crossover map g(N)=K log T0(N)); imp-2642/imp-2643 (C_C 1/8 ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP34922_CROSSOVER_DERIV_P9_P10_EXTENSION_ASSERTIONS = [
  {
    // (V1): the two routes agree at every order through n = 10.
    id: 'imp34922-two-routes-agree-through-n10',
    description:
      'the coefficient recurrence a_k^(n+1)=n a_{k-1}+(2n-1-k)a_k and the operator recurrence ' +
      'P_(n+1)=n u P_n+(2n-1)P_n - u P_n_prime generate identical P_2..P_10',
    holds: () => twoRoutesAgreeThroughN10,
  },
  {
    // (V2): both routes reproduce the inherited imp-34905 P_7, P_8 literals.
    id: 'imp34922-routes-match-inherited-P7-P8',
    description:
      'both routes reproduce the inherited imp-34905 P_7 and P_8 numerator polynomials exactly',
    holds: () => routesMatchInheritedP7P8,
  },
  {
    // (V3): two-order extension -- both routes reproduce the baked P_9, P_10 hand-derived literals.
    id: 'imp34922-extension-P9-P10-reproduced',
    description:
      'the independently hand-derived P_9 and P_10 literals are reproduced exactly by both routes ' +
      '(two-order extension of the imp-34905 explicit table, strictly positive, exact integers)',
    holds: () =>
      routesMatchExtendedP9P10 &&
      allCoeffsStrictlyPositiveThroughN10 &&
      allCoefficientsExactIntegers,
  },
  {
    // (V4): both extreme-coefficient closed forms persist through n = 10.
    id: 'imp34922-closed-forms-persist-through-n10',
    description:
      'the leading a_{n-1}^(n) = (n-1)! and constant a_0^(n) = (2n-3)!! closed forms hold at every ' +
      'order n=2..10 (40320=8!, 2027025=15!! at n=9; 362880=9!, 34459425=17!! at n=10)',
    holds: () => leadingIsFactorialThroughN10 && constantIsDoubleFactorialThroughN10,
  },
  {
    // (V5): boundary-projection derivation -- the two decoupled first-order recurrences hold.
    id: 'imp34922-boundary-projection-recurrences-hold',
    description:
      'the two extreme coefficients follow from a direct boundary projection of the operator ' +
      'recurrence: constant a_0^(n+1)=(2n-1)a_0^(n) (u->0) and leading a_n^(n+1)=n a_{n-1}^(n) ' +
      '(top-degree), each decoupled from the interior (2n-1-k) multiplier',
    holds: () => constantProjectionRecurrenceHolds && leadingProjectionRecurrenceHolds,
  },
  {
    // Aggregate: the extension verification passes end-to-end.
    id: 'imp34922-extension-verification-passes',
    description:
      'the two-order extension closes: dual-route agreement through n=10 + inherited P_7,P_8 + extended ' +
      'P_9,P_10 + both closed forms + strict positivity + both boundary-projection recurrences',
    holds: () =>
      extensionVerificationPasses &&
      IMP34922_CROSSOVER_DERIV_P9_P10_EXTENSION.extensionVerificationPasses,
  },
  {
    // Honesty gate: surrogate-map verification, changes no bound, no QED, no refereed bound is changed.
    id: 'imp34922-honesty-gate-no-qed',
    description:
      'verification scope is the surrogate-map derivative signs only: changes no bound, no QED, ' +
      'no refereed bound is changed',
    holds: () =>
      IMP34922_CROSSOVER_DERIV_P9_P10_EXTENSION.changesBound === false &&
      /NO QED/.test(IMP34922_CROSSOVER_DERIV_P9_P10_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP34922_CROSSOVER_DERIV_P9_P10_EXTENSION.verdict) &&
      /surrogate/.test(IMP34922_CROSSOVER_DERIV_P9_P10_EXTENSION.rigorousScope),
  },
];

for (const a of IMP34922_CROSSOVER_DERIV_P9_P10_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34922-crossover-deriv-p9-p10-extension assertion failed: ${a.id}`);
  }
}
