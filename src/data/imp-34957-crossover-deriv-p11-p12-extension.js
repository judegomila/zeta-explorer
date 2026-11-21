/**
 * @module imp-34957-crossover-deriv-p11-p12-extension
 *
 * imp-34957 (numerical, S-frontier): TWO-ORDER EXTENSION of the imp-34922 crossover-map
 * numerator-polynomial explicit table to P_11 and P_12, dual-route agreement, and re-confirmation
 * of the two extreme-coefficient closed forms and the definite-sign property two orders further.
 *
 * imp-34922 extended the imp-34880/imp-34905 numerator polynomials of the inherited imp-33723
 * crossover-map derivative
 *     g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T^n u^(2n-1)),   u = log(T/2pi)
 * to P_9 and P_10 by BOTH the pre-solved coefficient recurrence
 *     a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n)
 * AND the structurally-independent polynomial-operator recurrence
 *     P_(n+1) = n (u P_n) + (2n-1) P_n - u (dP_n/du),
 * confirmed dual-route agreement through n = 10, reconfirmed leading a_{n-1}^(n) = (n-1)! and
 * constant a_0^(n) = (2n-3)!! with strict positivity (definite sign (-1)^(n+1)), and stopped at P_10.
 * This module (a) DERIVES P_11 and P_12 by BOTH the same two recurrences from the imp-34922 P_10,
 * (b) confirms the two routes agree at every order through n = 12, (c) bakes the independently
 * hand-derived P_11 and P_12 reference literals and verifies them, and (d) reconfirms leading =
 * (n-1)!, constant = (2n-3)!! and strict positivity at n = 11 and n = 12, two orders further.
 *
 * INDEPENDENTLY HAND-DERIVED P_11, P_12 (baked reference literals, ascending powers of u)
 * -----------------------------------------------------------------------------------------
 * From P_10 = [34459425,126351225,221621400,246155910,192692500,111497100,48290616,15303024,
 * 3265920,362880] via a_k^(11) = 10 a_{k-1}^(10) + (19-k) a_k^(10):
 *     P_11 = [654729075, 2618916300, 5031076050, 6154708560, 5351946600, 3487884400, 1742749008,
 *             666542448, 188955360, 36288000, 3628800]
 * From P_11 via a_k^(12) = 11 a_{k-1}^(11) + (21-k) a_k^(11):
 *     P_12 = [13749310575, 59580345825, 124398524250, 166126590630, 158684886360, 114677563000,
 *             64507963520, 28501833360, 9788386608, 2513964960, 439084800, 39916800]
 * Closed-form spot-checks: leading a_10^(11) = 3628800 = 10!, constant a_0^(11) = 654729075 = 19!!;
 * leading a_11^(12) = 39916800 = 11!, constant a_0^(12) = 13749310575 = 21!!. Every coefficient is a
 * strictly positive exact integer (the largest, ~1.66e11, is far below 2^53, so the integer
 * arithmetic is exact), so g^(11) keeps sign +1 and g^(12) keeps sign -1 per (-1)^(n+1), with no
 * interior zero on the post-peak ramp. The two extreme coefficients again satisfy the decoupled
 * boundary-projection recurrences a_0^(n+1) = (2n-1) a_0^(n) (u -> 0) and a_n^(n+1) = n a_{n-1}^(n)
 * (top-degree) established in imp-34922, independent of the interior (2n-1-k) multiplier.
 *
 * PROOF SCOPE / HONESTY. VERIFICATION/EXTENSION ONLY on the inherited imp-3220/imp-3406 / imp-33723
 * surrogate crossover-map derivative SIGNS. Establishes NO RH-level result, NO operator positivity, and
 * changes NO bound. The C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and
 * imp-3066 K_a >= 0 are UNTOUCHED. No RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34922-crossover-deriv-p9-p10-extension (the P_9/P_10 extension being extended)
 * @see imp-34905-crossover-deriv-closed-form-independent-verify-p7-p8 (the P_7/P_8 extension)
 * @see imp-34880-crossover-deriv-all-orders-sign-induction (the all-orders coefficient-positivity induction)
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
  // dP/du: coefficient of u^k in the derivative is (k+1) a_{k+1}.
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

// Generate P_2..P_12 by BOTH routes from the base P_2 = u + 1.
const P2_BASE = [1, 1];
const coeffRoute = { 2: P2_BASE.slice() };
const opRoute = { 2: P2_BASE.slice() };
for (let n = 2; n <= 11; n++) {
  coeffRoute[n + 1] = nextCoeffRoute(coeffRoute[n], n);
  opRoute[n + 1] = nextOperatorRoute(opRoute[n], n);
}

// ---- Reference literals -------------------------------------------------------------------------
// Inherited P_9, P_10 (imp-34922), ascending powers of u.
const INHERITED_P9_P10 = {
  9: [2027025, 6756750, 10720710, 10690680, 7421260, 3725480, 1341936, 322560, 40320],
  10: [
    34459425, 126351225, 221621400, 246155910, 192692500, 111497100, 48290616, 15303024, 3265920,
    362880,
  ],
};
// Independently hand-derived two-order EXTENSION (this ticket): P_11 and P_12.
const EXTENDED_P11_P12 = {
  11: [
    654729075, 2618916300, 5031076050, 6154708560, 5351946600, 3487884400, 1742749008, 666542448,
    188955360, 36288000, 3628800,
  ],
  12: [
    13749310575, 59580345825, 124398524250, 166126590630, 158684886360, 114677563000, 64507963520,
    28501833360, 9788386608, 2513964960, 439084800, 39916800,
  ],
};

const arraysEqual = (a, b) => a.length === b.length && a.every((c, i) => c === b[i]);

// ---- Cross-checks -------------------------------------------------------------------------------
// (V1) the two routes agree at EVERY order through n = 12.
let twoRoutesAgreeThroughN12 = true;
for (let n = 2; n <= 12; n++) {
  if (!arraysEqual(coeffRoute[n], opRoute[n])) twoRoutesAgreeThroughN12 = false;
}

// (V2) both routes reproduce the inherited imp-34922 P_9, P_10 literals exactly.
let routesMatchInheritedP9P10 = true;
for (const n of [9, 10]) {
  if (!arraysEqual(coeffRoute[n], INHERITED_P9_P10[n])) routesMatchInheritedP9P10 = false;
  if (!arraysEqual(opRoute[n], INHERITED_P9_P10[n])) routesMatchInheritedP9P10 = false;
}

// (V3) both routes reproduce the baked P_11, P_12 hand-derived literals exactly (the extension).
let routesMatchExtendedP11P12 = true;
for (const n of [11, 12]) {
  if (!arraysEqual(coeffRoute[n], EXTENDED_P11_P12[n])) routesMatchExtendedP11P12 = false;
  if (!arraysEqual(opRoute[n], EXTENDED_P11_P12[n])) routesMatchExtendedP11P12 = false;
}

// (V4) both extreme-coefficient closed forms hold at every order through n = 12.
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
let leadingIsFactorialThroughN12 = true;
let constantIsDoubleFactorialThroughN12 = true;
for (let n = 2; n <= 12; n++) {
  const P = opRoute[n];
  if (P[P.length - 1] !== factorial(n - 1)) leadingIsFactorialThroughN12 = false; // a_{n-1}^(n) = (n-1)!
  if (P[0] !== oddDoubleFactorial(2 * n - 3)) constantIsDoubleFactorialThroughN12 = false; // a_0^(n) = (2n-3)!!
}

// (V5) strict positivity through n = 12 (definite sign (-1)^(n+1)); record the extreme coefficients.
let allCoeffsStrictlyPositiveThroughN12 = true;
let smallestCoefficientThroughN12 = Infinity;
let largestCoefficientThroughN12 = 0;
for (let n = 2; n <= 12; n++) {
  for (const c of opRoute[n]) {
    if (!(c > 0) || !Number.isInteger(c)) allCoeffsStrictlyPositiveThroughN12 = false;
    if (c < smallestCoefficientThroughN12) smallestCoefficientThroughN12 = c;
    if (c > largestCoefficientThroughN12) largestCoefficientThroughN12 = c;
  }
}
// Integer arithmetic is exact only below 2^53; the largest coefficient stays far below it.
const allCoefficientsExactIntegers = largestCoefficientThroughN12 < Number.MAX_SAFE_INTEGER;

// (V6) the decoupled boundary-projection recurrences (imp-34922) continue to hold through n = 12:
// constant a_0^(n+1) = (2n-1) a_0^(n) (u -> 0); leading a_n^(n+1) = n a_{n-1}^(n) (top-degree).
let constantProjectionRecurrenceHolds = true;
let leadingProjectionRecurrenceHolds = true;
for (let n = 2; n <= 11; n++) {
  const P = opRoute[n];
  const Pn1 = opRoute[n + 1];
  if (Pn1[0] !== (2 * n - 1) * P[0]) constantProjectionRecurrenceHolds = false;
  if (Pn1[Pn1.length - 1] !== n * P[P.length - 1]) leadingProjectionRecurrenceHolds = false;
}

const extensionVerificationPasses =
  twoRoutesAgreeThroughN12 &&
  routesMatchInheritedP9P10 &&
  routesMatchExtendedP11P12 &&
  leadingIsFactorialThroughN12 &&
  constantIsDoubleFactorialThroughN12 &&
  allCoeffsStrictlyPositiveThroughN12 &&
  allCoefficientsExactIntegers &&
  constantProjectionRecurrenceHolds &&
  leadingProjectionRecurrenceHolds;

export const IMP34957_CROSSOVER_DERIV_P11_P12_EXTENSION = {
  id: 'imp-34957',
  proofSection: 'S-frontier',
  question:
    'Do the imp-34922 crossover-map numerator-polynomial closed forms -- leading (n-1)! and constant ' +
    '(2n-3)!! -- and strict positivity / definite sign (-1)^(n+1) of g^(n) persist two orders further to ' +
    'P_11 and P_12 under BOTH the coefficient recurrence and the independent operator route? ' +
    'Verification/extension on the inherited surrogate map; changes no bound; NO QED.',
  extendedP11: EXTENDED_P11_P12[11],
  extendedP12: EXTENDED_P11_P12[12],
  dualRoute:
    'Route A: pre-solved coefficient recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k. Route B: operator ' +
    'recurrence P_(n+1) = n (u P_n) + (2n-1) P_n - u (dP_n/du) via multiply-by-u / differentiate / ' +
    'scaled-add primitives. The two routes agree at every order through n = 12.',
  twoRoutesAgreeThroughN12,
  routesMatchInheritedP9P10,
  routesMatchExtendedP11P12,
  leadingCoefficientClosedForm:
    'a_{n-1}^(n) = (n-1)!  (verified n=2..12; 3628800 = 10! at n=11, 39916800 = 11! at n=12)',
  constantCoefficientClosedForm:
    'a_0^(n) = (2n-3)!!  (verified n=2..12; 654729075 = 19!! at n=11, 13749310575 = 21!! at n=12)',
  leadingIsFactorialThroughN12,
  constantIsDoubleFactorialThroughN12,
  allCoeffsStrictlyPositiveThroughN12,
  allCoefficientsExactIntegers,
  smallestCoefficientThroughN12,
  largestCoefficientThroughN12,
  boundaryProjection: {
    constantProjectionRecurrenceHolds, // a_0^(n+1) = (2n-1) a_0^(n) from the u -> 0 projection
    leadingProjectionRecurrenceHolds, // a_n^(n+1) = n a_{n-1}^(n) from the top-degree projection
    summary:
      'The two imp-34922 decoupled first-order boundary-projection recurrences continue to hold two ' +
      'orders further: constant a_0^(n+1) = (2n-1) a_0^(n) (telescoping to (2n-3)!!) and leading ' +
      'a_n^(n+1) = n a_{n-1}^(n) (telescoping to (n-1)!), each independent of the interior (2n-1-k) ' +
      'multiplier, verified n=2..12.',
  },
  extensionVerificationPasses,
  finding: {
    V1_two_routes_agree:
      'Route A (coefficient recurrence) and Route B (operator recurrence) generate identical P_2..P_12 ' +
      '(agree=' +
      twoRoutesAgreeThroughN12 +
      '), confirming the pre-solved (2n-1-k) multiplier stays consistent two orders beyond imp-34922.',
    V2_extension_P11_P12:
      'Two-order extension: independently hand-derived P_11 = ' +
      '[654729075,2618916300,5031076050,6154708560,5351946600,3487884400,1742749008,666542448,' +
      '188955360,36288000,3628800] and P_12 = ' +
      '[13749310575,59580345825,124398524250,166126590630,158684886360,114677563000,64507963520,' +
      '28501833360,9788386608,2513964960,439084800,39916800] are reproduced exactly by both routes ' +
      '(match=' +
      routesMatchExtendedP11P12 +
      '); all coefficients strictly positive, so g^(11) has sign +1 and g^(12) has sign -1 per (-1)^(n+1).',
    V3_closed_forms_persist:
      'Both closed forms persist through n=12: leading a_{n-1}^(n) = (n-1)! and constant a_0^(n) = ' +
      '(2n-3)!! (leadingOK=' +
      leadingIsFactorialThroughN12 +
      ', constantOK=' +
      constantIsDoubleFactorialThroughN12 +
      '). At n=11: 3628800=10! and 654729075=19!!; at n=12: 39916800=11! and 13749310575=21!!.',
    V4_boundary_projection:
      'The two decoupled boundary-projection recurrences established in imp-34922 continue to hold: ' +
      'constant a_0^(n+1)=(2n-1)a_0^(n) (holds=' +
      constantProjectionRecurrenceHolds +
      ') and leading a_n^(n+1)=n a_{n-1}^(n) (holds=' +
      leadingProjectionRecurrenceHolds +
      '), each decoupled from the interior (2n-1-k) multiplier, verified through n=12.',
  },
  isRigorous: true, // exact integer arithmetic; closed forms, positivity, and the boundary recurrences are verified
  rigorousScope:
    'Two-order extension (P_11, P_12) and dual-route re-verification of the imp-34880/imp-34905/imp-34922 ' +
    'coefficient-positivity / closed-form cross-checks for the derivatives of the INHERITED ' +
    'imp-3220/imp-3406 / imp-33723 surrogate crossover map ONLY. Establishes NO RH-level result, NO ' +
    'operator positivity, changes NO bound.',
  changesBound: false,
  verdict:
    'VERIFICATION/EXTENSION (frontier-direction, surrogate-map lemma). Both the pre-solved coefficient ' +
    'recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k and the independent operator recurrence P_(n+1) = ' +
    'n u P_n + (2n-1) P_n - u P_n_prime generate identical P_2..P_12 in exact integer arithmetic. The ' +
    'two-order extension to P_11 = [654729075,2618916300,5031076050,6154708560,5351946600,3487884400,' +
    '1742749008,666542448,188955360,36288000,3628800] and P_12 = [13749310575,59580345825,124398524250,' +
    '166126590630,158684886360,114677563000,64507963520,28501833360,9788386608,2513964960,439084800,' +
    '39916800] reproduces the independently hand-derived literals exactly. Both closed forms hold at ' +
    'every order through n=12: leading a_{n-1}^(n) = (n-1)! (3628800 at n=11, 39916800 at n=12) and ' +
    'constant a_0^(n) = (2n-3)!! (654729075 at n=11, 13749310575 at n=12), all coefficients strictly ' +
    'positive, so g^(n) keeps the definite sign (-1)^(n+1) with no interior zero on the post-peak ramp ' +
    'two orders beyond the imp-34922 table, and the two decoupled boundary-projection recurrences ' +
    'continue to hold. This is a VERIFICATION of the INHERITED imp-3220/imp-3406 surrogate-map derivative ' +
    'signs ONLY: the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and ' +
    'imp-3066 K_a >= 0 are UNTOUCHED; establishes no operator positivity; changes no bound; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34922 (P_9/P_10 extension + boundary-projection derivation); imp-34905 (P_7/P_8 independent ' +
    'extension); imp-34880 (all-orders coefficient-positivity induction + (n-1)!/(2n-3)!! cross-checks); ' +
    'imp-34731 (g_double_prime closed form; P_2 base); imp-33723 (crossover map g(N)=K log T0(N)); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP34957_CROSSOVER_DERIV_P11_P12_EXTENSION_ASSERTIONS = [
  {
    // (V1): the two routes agree at every order through n = 12.
    id: 'imp34957-two-routes-agree-through-n12',
    description:
      'the coefficient recurrence a_k^(n+1)=n a_{k-1}+(2n-1-k)a_k and the operator recurrence ' +
      'P_(n+1)=n u P_n+(2n-1)P_n - u P_n_prime generate identical P_2..P_12',
    holds: () => twoRoutesAgreeThroughN12,
  },
  {
    // (V2): both routes reproduce the inherited imp-34922 P_9, P_10 literals.
    id: 'imp34957-routes-match-inherited-P9-P10',
    description:
      'both routes reproduce the inherited imp-34922 P_9 and P_10 numerator polynomials exactly',
    holds: () => routesMatchInheritedP9P10,
  },
  {
    // (V3): two-order extension -- both routes reproduce the baked P_11, P_12 hand-derived literals.
    id: 'imp34957-extension-P11-P12-reproduced',
    description:
      'the independently hand-derived P_11 and P_12 literals are reproduced exactly by both routes ' +
      '(two-order extension of the imp-34922 explicit table, strictly positive, exact integers)',
    holds: () =>
      routesMatchExtendedP11P12 &&
      allCoeffsStrictlyPositiveThroughN12 &&
      allCoefficientsExactIntegers,
  },
  {
    // (V4): both extreme-coefficient closed forms persist through n = 12.
    id: 'imp34957-closed-forms-persist-through-n12',
    description:
      'the leading a_{n-1}^(n) = (n-1)! and constant a_0^(n) = (2n-3)!! closed forms hold at every ' +
      'order n=2..12 (3628800=10!, 654729075=19!! at n=11; 39916800=11!, 13749310575=21!! at n=12)',
    holds: () => leadingIsFactorialThroughN12 && constantIsDoubleFactorialThroughN12,
  },
  {
    // (V5): the two decoupled boundary-projection recurrences continue to hold through n = 12.
    id: 'imp34957-boundary-projection-recurrences-hold',
    description:
      'the two extreme coefficients continue to follow the imp-34922 boundary projections: constant ' +
      'a_0^(n+1)=(2n-1)a_0^(n) (u->0) and leading a_n^(n+1)=n a_{n-1}^(n) (top-degree), each decoupled ' +
      'from the interior (2n-1-k) multiplier, through n=12',
    holds: () => constantProjectionRecurrenceHolds && leadingProjectionRecurrenceHolds,
  },
  {
    // Aggregate: the extension verification passes end-to-end.
    id: 'imp34957-extension-verification-passes',
    description:
      'the two-order extension closes: dual-route agreement through n=12 + inherited P_9,P_10 + extended ' +
      'P_11,P_12 + both closed forms + strict positivity + both boundary-projection recurrences',
    holds: () =>
      extensionVerificationPasses &&
      IMP34957_CROSSOVER_DERIV_P11_P12_EXTENSION.extensionVerificationPasses,
  },
  {
    // Honesty gate: surrogate-map verification, changes no bound, no QED, no refereed bound is changed.
    id: 'imp34957-honesty-gate-no-qed',
    description:
      'verification scope is the surrogate-map derivative signs only: changes no bound, no QED, ' +
      'no refereed bound is changed',
    holds: () =>
      IMP34957_CROSSOVER_DERIV_P11_P12_EXTENSION.changesBound === false &&
      /NO QED/.test(IMP34957_CROSSOVER_DERIV_P11_P12_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP34957_CROSSOVER_DERIV_P11_P12_EXTENSION.verdict) &&
      /surrogate/.test(IMP34957_CROSSOVER_DERIV_P11_P12_EXTENSION.rigorousScope),
  },
];

for (const a of IMP34957_CROSSOVER_DERIV_P11_P12_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34957-crossover-deriv-p11-p12-extension assertion failed: ${a.id}`);
  }
}
