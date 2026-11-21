/**
 * @module imp-34975-crossover-deriv-p13-p14-2p53-ceiling
 *
 * imp-34975 (numerical, S-frontier): TWO-ORDER EXTENSION of the imp-34957 crossover-map
 * numerator-polynomial explicit table to P_13 and P_14, dual-route agreement, closed-form
 * spot-checks, AND location of the 2^53 exact-integer arithmetic ceiling that imp-34957 flagged
 * but never determined.
 *
 * imp-34957 extended the imp-34922 numerator polynomials of the inherited imp-33723 crossover-map
 * derivative
 *     g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T^n u^(2n-1)),   u = log(T/2pi)
 * to P_11 and P_12 by BOTH the pre-solved coefficient recurrence
 *     a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n)
 * AND the structurally-independent polynomial-operator recurrence
 *     P_(n+1) = n (u P_n) + (2n-1) P_n - u (dP_n/du),
 * confirmed dual-route agreement through n = 12, reconfirmed leading a_{n-1}^(n) = (n-1)! and
 * constant a_0^(n) = (2n-3)!! with strict positivity, and NOTED the largest P_12 coefficient
 * (~1.66e11) sits far below 2^53 so double arithmetic is exact -- but never located the order at
 * which the largest coefficient first crosses 2^53. This module (a) DERIVES P_13 and P_14 by BOTH
 * the same two recurrences from the imp-34957 P_12, in EXACT BigInt arithmetic; (b) confirms the two
 * routes agree at every order through n = 16 (two beyond P_14, to bracket the ceiling); (c) bakes the
 * independently hand-derived P_13 and P_14 reference literals and verifies them; (d) reconfirms
 * leading = (n-1)!, constant = (2n-3)!! and strict positivity at n = 13 and n = 14; and (e) LOCATES
 * the 2^53 ceiling.
 *
 * INDEPENDENTLY HAND-DERIVED P_13, P_14 (baked reference literals, ascending powers of u)
 * -----------------------------------------------------------------------------------------
 * From P_12 = [13749310575,59580345825,124398524250,166126590630,158684886360,114677563000,
 * 64507963520,28501833360,9788386608,2513964960,439084800,39916800] via
 * a_k^(13) = 12 a_{k-1}^(12) + (23-k) a_k^(12):
 *     P_13 = [316234143225, 1475759335050, 3327333159150, 4815314103600, 5008531928400,
 *             3968414770320, 2472766135840, 1230124896000, 488847799440, 152656148736,
 *             35875681920, 5748019200, 479001600]
 * From P_13 via a_k^(14) = 13 a_{k-1}^(13) + (25-k) a_k^(13):
 *     P_14 = [7905853580625, 39529267903125, 95713534016100, 149192241348150, 167778253843200,
 *             144479210475600, 98571948595120, 54288207893920, 24302036238480, 8797519772496,
 *             2522665162368, 546856133760, 80951270400, 6227020800]
 * Closed-form spot-checks: leading a_12^(13) = 479001600 = 12!, constant a_0^(13) = 316234143225 =
 * 23!!; leading a_13^(14) = 6227020800 = 13!, constant a_0^(14) = 7905853580625 = 25!!. Every
 * coefficient is a strictly positive exact integer, so g^(13) keeps sign +1 and g^(14) keeps sign
 * -1 per (-1)^(n+1), with no interior zero on the post-peak ramp.
 *
 * 2^53 EXACT-INTEGER CEILING (the open question imp-34957 flagged)
 * ---------------------------------------------------------------
 * Tabulating the largest coefficient max_k a_k^(n) in exact BigInt across n = 2..16:
 *     n=12 max = 166126590630     (~1.66e11)
 *     n=13 max = 5008531928400    (~5.01e12)
 *     n=14 max = 167778253843200  (~1.68e14)
 *     n=15 max = 5947591217267700 (~5.95e15)  <  2^53 = 9007199254740992
 *     n=16 max = 222498829460407500 (~2.22e17) >  2^53
 * So the largest P_n coefficient FIRST exceeds 2^53 at n = 16. Consequently double-precision
 * float64 represents every coefficient EXACTLY through n = 15 (P_15 max ~5.95e15 < 2^53), and BigInt
 * is required for exact coefficient arithmetic only from n = 16 onward. The imp-34957 P_11/P_12 table
 * and this P_13/P_14 extension (P_14 max ~1.68e14) are comfortably inside the exact-double regime;
 * the ceiling sits four orders past the imp-34957 stopping point.
 *
 * PROOF SCOPE / HONESTY. VERIFICATION/EXTENSION ONLY on the inherited imp-3220/imp-3406 / imp-33723
 * surrogate crossover-map derivative SIGNS and the arithmetic-exactness bookkeeping. Establishes NO
 * RH-level result, NO operator positivity, and changes NO bound. The C_mb GUE-conditional per
 * imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED. No RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34957-crossover-deriv-p11-p12-extension (the P_11/P_12 extension being extended)
 * @see imp-34922-crossover-deriv-p9-p10-extension (the P_9/P_10 extension + boundary-projection)
 * @see imp-34880-crossover-deriv-all-orders-sign-induction (the all-orders coefficient-positivity)
 */

// ---- Route A: pre-solved coefficient recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k (BigInt) ----
function nextCoeffRoute(Pn, n) {
  const nb = BigInt(n);
  const L = Pn.length + 1;
  const out = new Array(L).fill(0n);
  for (let k = 0; k < L; k++) {
    const aPrev = k - 1 >= 0 ? Pn[k - 1] : 0n;
    const aHere = k < Pn.length ? Pn[k] : 0n;
    out[k] = nb * aPrev + BigInt(2 * n - 1 - k) * aHere;
  }
  return out;
}

// ---- Route B: independent polynomial-operator recurrence (BigInt) -------------------------------
// Polynomials are coefficient arrays [a_0, a_1, ...] in ascending powers of u.
const mulByU = (P) => [0n, ...P]; // u * P: index shift up by one
const derivU = (P) => {
  // dP/du: coefficient of u^k in the derivative is (k+1) a_{k+1}.
  const d = [];
  for (let k = 1; k < P.length; k++) d.push(BigInt(k) * P[k]);
  return d.length ? d : [0n];
};
const scale = (P, c) => P.map((x) => x * c);
const addPolys = (...ps) => {
  const L = Math.max(...ps.map((p) => p.length));
  const out = new Array(L).fill(0n);
  for (const p of ps) p.forEach((c, i) => (out[i] += c));
  return out;
};
// P_(n+1) = n (u P_n) + (2n-1) P_n - u (dP_n/du), carrying the subtractive term explicitly.
function nextOperatorRoute(Pn, n) {
  return addPolys(
    scale(mulByU(Pn), BigInt(n)),
    scale(Pn, BigInt(2 * n - 1)),
    scale(mulByU(derivU(Pn)), -1n)
  );
}

// Generate P_2..P_16 by BOTH routes from the base P_2 = u + 1 (two orders past P_14 to bracket 2^53).
const P2_BASE = [1n, 1n];
const coeffRoute = { 2: P2_BASE.slice() };
const opRoute = { 2: P2_BASE.slice() };
for (let n = 2; n <= 15; n++) {
  coeffRoute[n + 1] = nextCoeffRoute(coeffRoute[n], n);
  opRoute[n + 1] = nextOperatorRoute(opRoute[n], n);
}

// ---- Reference literals -------------------------------------------------------------------------
// Inherited P_11, P_12 (imp-34957), ascending powers of u.
const INHERITED_P11_P12 = {
  11: [
    654729075n, 2618916300n, 5031076050n, 6154708560n, 5351946600n, 3487884400n, 1742749008n,
    666542448n, 188955360n, 36288000n, 3628800n,
  ],
  12: [
    13749310575n, 59580345825n, 124398524250n, 166126590630n, 158684886360n, 114677563000n,
    64507963520n, 28501833360n, 9788386608n, 2513964960n, 439084800n, 39916800n,
  ],
};
// Independently hand-derived two-order EXTENSION (this ticket): P_13 and P_14.
const EXTENDED_P13_P14 = {
  13: [
    316234143225n, 1475759335050n, 3327333159150n, 4815314103600n, 5008531928400n, 3968414770320n,
    2472766135840n, 1230124896000n, 488847799440n, 152656148736n, 35875681920n, 5748019200n,
    479001600n,
  ],
  14: [
    7905853580625n, 39529267903125n, 95713534016100n, 149192241348150n, 167778253843200n,
    144479210475600n, 98571948595120n, 54288207893920n, 24302036238480n, 8797519772496n,
    2522665162368n, 546856133760n, 80951270400n, 6227020800n,
  ],
};

const arraysEqual = (a, b) => a.length === b.length && a.every((c, i) => c === b[i]);

// ---- Cross-checks -------------------------------------------------------------------------------
// (V1) the two routes agree at EVERY order through n = 16 (two beyond P_14, bracketing the ceiling).
let twoRoutesAgreeThroughN16 = true;
for (let n = 2; n <= 16; n++) {
  if (!arraysEqual(coeffRoute[n], opRoute[n])) twoRoutesAgreeThroughN16 = false;
}

// (V2) both routes reproduce the inherited imp-34957 P_11, P_12 literals exactly.
let routesMatchInheritedP11P12 = true;
for (const n of [11, 12]) {
  if (!arraysEqual(coeffRoute[n], INHERITED_P11_P12[n])) routesMatchInheritedP11P12 = false;
  if (!arraysEqual(opRoute[n], INHERITED_P11_P12[n])) routesMatchInheritedP11P12 = false;
}

// (V3) both routes reproduce the baked P_13, P_14 hand-derived literals exactly (the extension).
let routesMatchExtendedP13P14 = true;
for (const n of [13, 14]) {
  if (!arraysEqual(coeffRoute[n], EXTENDED_P13_P14[n])) routesMatchExtendedP13P14 = false;
  if (!arraysEqual(opRoute[n], EXTENDED_P13_P14[n])) routesMatchExtendedP13P14 = false;
}

// (V4) both extreme-coefficient closed forms hold at every order through n = 14.
function factorialBig(m) {
  let f = 1n;
  for (let j = 2n; j <= BigInt(m); j++) f *= j;
  return f;
}
function oddDoubleFactorialBig(m) {
  // (2n-3)!! = 1*3*5*...*(2n-3); for n=2 (m=1) the product is 1.
  let f = 1n;
  for (let j = 1; j <= m; j += 2) f *= BigInt(j);
  return f;
}
let leadingIsFactorialThroughN14 = true;
let constantIsDoubleFactorialThroughN14 = true;
for (let n = 2; n <= 14; n++) {
  const P = opRoute[n];
  if (P[P.length - 1] !== factorialBig(n - 1)) leadingIsFactorialThroughN14 = false; // a_{n-1}^(n) = (n-1)!
  if (P[0] !== oddDoubleFactorialBig(2 * n - 3)) constantIsDoubleFactorialThroughN14 = false; // a_0^(n) = (2n-3)!!
}

// (V5) strict positivity through n = 14 (definite sign (-1)^(n+1)).
let allCoeffsStrictlyPositiveThroughN14 = true;
for (let n = 2; n <= 14; n++) {
  for (const c of opRoute[n]) {
    if (!(c > 0n)) allCoeffsStrictlyPositiveThroughN14 = false;
  }
}

// (V6) 2^53 exact-integer ceiling: the largest coefficient max_k a_k^(n) per order, and the first n
// where it exceeds 2^53. Doubles represent every integer exactly below 2^53.
const TWO_POW_53 = 2n ** 53n; // 9007199254740992
const maxCoefficientByOrder = {};
for (let n = 2; n <= 16; n++) {
  let mx = 0n;
  for (const c of opRoute[n]) if (c > mx) mx = c;
  maxCoefficientByOrder[n] = mx;
}
let firstOrderExceeding2p53 = null;
for (let n = 2; n <= 16; n++) {
  if (maxCoefficientByOrder[n] > TWO_POW_53) {
    firstOrderExceeding2p53 = n;
    break;
  }
}
// Cross-check the ceiling location: n=15 max stays under 2^53, n=16 max is over.
const ceilingIsN16 =
  firstOrderExceeding2p53 === 16 &&
  maxCoefficientByOrder[15] < TWO_POW_53 &&
  maxCoefficientByOrder[16] > TWO_POW_53;
// Every coefficient through n = 15 (hence through the P_13/P_14 extension) is an exact float64 integer.
const allExactAsDoublesThroughN15 = maxCoefficientByOrder[15] < TWO_POW_53;

const extensionVerificationPasses =
  twoRoutesAgreeThroughN16 &&
  routesMatchInheritedP11P12 &&
  routesMatchExtendedP13P14 &&
  leadingIsFactorialThroughN14 &&
  constantIsDoubleFactorialThroughN14 &&
  allCoeffsStrictlyPositiveThroughN14 &&
  ceilingIsN16 &&
  allExactAsDoublesThroughN15;

// String form of the baked literals for display (BigInt -> decimal string, no precision loss).
const asStrings = (P) => P.map((c) => c.toString());

export const IMP34975_CROSSOVER_DERIV_P13_P14_2P53_CEILING = {
  id: 'imp-34975',
  proofSection: 'S-frontier',
  question:
    'At what order n does the largest crossover-map numerator-polynomial coefficient first exceed ' +
    '2^53 (forcing BigInt), and do the imp-34957 closed forms -- leading (n-1)! and constant ' +
    '(2n-3)!! -- and strict positivity persist two orders further to P_13 and P_14 under BOTH the ' +
    'coefficient recurrence and the independent operator route? Verification/extension on the ' +
    'inherited surrogate map; changes no bound; NO QED.',
  extendedP13: asStrings(EXTENDED_P13_P14[13]),
  extendedP14: asStrings(EXTENDED_P13_P14[14]),
  dualRoute:
    'Route A: pre-solved coefficient recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k. Route B: ' +
    'operator recurrence P_(n+1) = n (u P_n) + (2n-1) P_n - u (dP_n/du). Both computed in EXACT ' +
    'BigInt integer arithmetic; the two routes agree at every order through n = 16.',
  twoRoutesAgreeThroughN16,
  routesMatchInheritedP11P12,
  routesMatchExtendedP13P14,
  leadingCoefficientClosedForm:
    'a_{n-1}^(n) = (n-1)!  (verified n=2..14; 479001600 = 12! at n=13, 6227020800 = 13! at n=14)',
  constantCoefficientClosedForm:
    'a_0^(n) = (2n-3)!!  (verified n=2..14; 316234143225 = 23!! at n=13, 7905853580625 = 25!! at n=14)',
  leadingIsFactorialThroughN14,
  constantIsDoubleFactorialThroughN14,
  allCoeffsStrictlyPositiveThroughN14,
  twoPow53: TWO_POW_53.toString(),
  maxCoefficientByOrder: Object.fromEntries(
    Object.entries(maxCoefficientByOrder).map(([n, v]) => [n, v.toString()])
  ),
  firstOrderExceeding2p53,
  ceilingIsN16,
  allExactAsDoublesThroughN15,
  ceilingSummary:
    'The largest P_n coefficient first exceeds 2^53 = 9007199254740992 at n = 16 (max ~2.22e17). ' +
    'At n = 15 the max coefficient is 5947591217267700 (~5.95e15), still below 2^53, so double ' +
    'precision represents every coefficient EXACTLY through n = 15; BigInt is required for exact ' +
    'coefficient arithmetic only from n = 16 onward. The imp-34957 P_11/P_12 table and this P_13/P_14 ' +
    'extension (P_14 max ~1.68e14) sit comfortably inside the exact-double regime -- the ceiling is ' +
    'four orders past the imp-34957 stopping point.',
  extensionVerificationPasses,
  finding: {
    V1_two_routes_agree:
      'Route A (coefficient recurrence) and Route B (operator recurrence), both in exact BigInt, ' +
      'generate identical P_2..P_16 (agree=' +
      twoRoutesAgreeThroughN16 +
      '), confirming the pre-solved (2n-1-k) multiplier stays consistent two orders beyond imp-34957 ' +
      'and past the 2^53 ceiling.',
    V2_extension_P13_P14:
      'Two-order extension: independently hand-derived P_13 and P_14 (leading 12! and 13!, constant ' +
      '23!! and 25!!) are reproduced exactly by both routes (match=' +
      routesMatchExtendedP13P14 +
      '); all coefficients strictly positive, so g^(13) has sign +1 and g^(14) has sign -1 per ' +
      '(-1)^(n+1).',
    V3_closed_forms_persist:
      'Both closed forms persist through n=14: leading a_{n-1}^(n) = (n-1)! and constant a_0^(n) = ' +
      '(2n-3)!! (leadingOK=' +
      leadingIsFactorialThroughN14 +
      ', constantOK=' +
      constantIsDoubleFactorialThroughN14 +
      '). At n=13: 479001600=12! and 316234143225=23!!; at n=14: 6227020800=13! and 7905853580625=25!!.',
    V4_2p53_ceiling:
      'The largest coefficient first exceeds 2^53 at n=' +
      firstOrderExceeding2p53 +
      ' (n=15 max 5947591217267700 < 2^53 < n=16 max 222498829460407500). Double arithmetic is ' +
      'therefore exact through n=15; BigInt is required from n=16 onward (ceilingIsN16=' +
      ceilingIsN16 +
      ').',
  },
  isRigorous: true, // exact BigInt integer arithmetic; closed forms, positivity, and the ceiling are verified
  rigorousScope:
    'Two-order extension (P_13, P_14) and dual-route re-verification of the ' +
    'imp-34880/imp-34905/imp-34922/imp-34957 coefficient-positivity / closed-form cross-checks, plus ' +
    'exact location of the 2^53 double-arithmetic ceiling (n=16), for the derivatives of the ' +
    'INHERITED imp-3220/imp-3406 / imp-33723 surrogate crossover map ONLY. Establishes NO RH-level ' +
    'result, NO operator positivity, changes NO bound.',
  changesBound: false,
  verdict:
    'VERIFICATION/EXTENSION (frontier-direction, surrogate-map lemma). Both the pre-solved ' +
    'coefficient recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k and the independent operator ' +
    'recurrence P_(n+1) = n u P_n + (2n-1) P_n - u P_n_prime, computed in EXACT BigInt, generate ' +
    'identical P_2..P_16. The two-order extension to P_13 and P_14 reproduces the independently ' +
    'hand-derived literals exactly, both closed forms hold at every order through n=14 (leading ' +
    '12!,13!; constant 23!!,25!!), all coefficients strictly positive so g^(n) keeps the definite ' +
    'sign (-1)^(n+1). The open imp-34957 question is CLOSED: the largest P_n coefficient first ' +
    'exceeds 2^53 = 9007199254740992 at n=16 (n=15 max ~5.95e15 < 2^53 < n=16 max ~2.22e17), so ' +
    'double-precision float64 is exact through n=15 and BigInt is required only from n=16 onward -- ' +
    'the ceiling sits four orders past the imp-34957 P_12 stopping point. This is a VERIFICATION of ' +
    'the INHERITED imp-3220/imp-3406 surrogate-map derivative signs and the arithmetic-exactness ' +
    'bookkeeping ONLY: the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), ' +
    'and imp-3066 K_a >= 0 are UNTOUCHED; establishes no operator positivity; changes no bound; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34957 (P_11/P_12 extension; flagged the ~1.66e11 << 2^53 gap but never located the ceiling); ' +
    'imp-34922 (P_9/P_10 extension + boundary-projection derivation); imp-34905 (P_7/P_8 independent ' +
    'extension); imp-34880 (all-orders coefficient-positivity induction + (n-1)!/(2n-3)!! ' +
    'cross-checks); imp-33723 (crossover map g(N)=K log T0(N)); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'imp-486 (C_mb GUE-conditional).',
};

export const IMP34975_CROSSOVER_DERIV_P13_P14_2P53_CEILING_ASSERTIONS = [
  {
    // (V1): the two routes agree at every order through n = 16 in exact BigInt.
    id: 'imp34975-two-routes-agree-through-n16',
    description:
      'the coefficient recurrence a_k^(n+1)=n a_{k-1}+(2n-1-k)a_k and the operator recurrence ' +
      'P_(n+1)=n u P_n+(2n-1)P_n - u P_n_prime generate identical P_2..P_16 in exact BigInt',
    holds: () => twoRoutesAgreeThroughN16,
  },
  {
    // (V2): both routes reproduce the inherited imp-34957 P_11, P_12 literals.
    id: 'imp34975-routes-match-inherited-P11-P12',
    description:
      'both routes reproduce the inherited imp-34957 P_11 and P_12 numerator polynomials exactly',
    holds: () => routesMatchInheritedP11P12,
  },
  {
    // (V3): two-order extension -- both routes reproduce the baked P_13, P_14 hand-derived literals.
    id: 'imp34975-extension-P13-P14-reproduced',
    description:
      'the independently hand-derived P_13 and P_14 literals are reproduced exactly by both routes ' +
      '(two-order extension of the imp-34957 explicit table, strictly positive exact integers)',
    holds: () => routesMatchExtendedP13P14 && allCoeffsStrictlyPositiveThroughN14,
  },
  {
    // (V4): both extreme-coefficient closed forms persist through n = 14.
    id: 'imp34975-closed-forms-persist-through-n14',
    description:
      'the leading a_{n-1}^(n) = (n-1)! and constant a_0^(n) = (2n-3)!! closed forms hold at every ' +
      'order n=2..14 (479001600=12!, 316234143225=23!! at n=13; 6227020800=13!, 7905853580625=25!! at n=14)',
    holds: () => leadingIsFactorialThroughN14 && constantIsDoubleFactorialThroughN14,
  },
  {
    // (V5): the 2^53 exact-integer ceiling is located at n = 16.
    id: 'imp34975-2p53-ceiling-at-n16',
    description:
      'the largest P_n coefficient first exceeds 2^53=9007199254740992 at n=16 (n=15 max ~5.95e15 ' +
      'stays below, n=16 max ~2.22e17 is over), so double arithmetic is exact through n=15 and BigInt ' +
      'is required only from n=16 onward',
    holds: () => ceilingIsN16 && firstOrderExceeding2p53 === 16 && allExactAsDoublesThroughN15,
  },
  {
    // Aggregate: the extension + ceiling verification passes end-to-end.
    id: 'imp34975-extension-verification-passes',
    description:
      'the two-order extension closes: dual-route agreement through n=16 + inherited P_11,P_12 + ' +
      'extended P_13,P_14 + both closed forms + strict positivity + the 2^53 ceiling at n=16',
    holds: () =>
      extensionVerificationPasses &&
      IMP34975_CROSSOVER_DERIV_P13_P14_2P53_CEILING.extensionVerificationPasses,
  },
  {
    // Honesty gate: surrogate-map verification, changes no bound, no QED, no refereed bound is changed.
    id: 'imp34975-honesty-gate-no-qed',
    description:
      'verification scope is the surrogate-map derivative signs and arithmetic-exactness bookkeeping ' +
      'only: changes no bound, no QED, no refereed bound is changed',
    holds: () =>
      IMP34975_CROSSOVER_DERIV_P13_P14_2P53_CEILING.changesBound === false &&
      /NO QED/.test(IMP34975_CROSSOVER_DERIV_P13_P14_2P53_CEILING.verdict) &&
      /refereed bound is changed/i.test(IMP34975_CROSSOVER_DERIV_P13_P14_2P53_CEILING.verdict) &&
      /surrogate/.test(IMP34975_CROSSOVER_DERIV_P13_P14_2P53_CEILING.rigorousScope),
  },
];

for (const a of IMP34975_CROSSOVER_DERIV_P13_P14_2P53_CEILING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34975-crossover-deriv-p13-p14-2p53-ceiling assertion failed: ${a.id}`);
  }
}
