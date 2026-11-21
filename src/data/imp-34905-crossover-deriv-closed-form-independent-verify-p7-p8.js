/**
 * @module imp-34905-crossover-deriv-closed-form-independent-verify-p7-p8
 *
 * imp-34905 (proof, S-frontier): INDEPENDENT verification of the imp-34880 all-orders closed-form
 * cross-checks, plus a two-order EXTENSION to P_7 and P_8.
 *
 * imp-34880 proved by induction that every numerator polynomial P_n (n >= 2) of the inherited
 * imp-33723 crossover-map derivative
 *     g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T^n u^(2n-1)),   u = log(T/2pi)
 * has strictly positive coefficients -- so g^(n) has the definite sign (-1)^(n+1) with no interior
 * zero on the post-peak ramp -- and offered two closed-form cross-checks on the extreme coefficients:
 *     leading coefficient   a_{n-1}^(n) = (n-1)!
 *     constant coefficient  a_0^(n)     = (2n-3)!!.
 * imp-34880 reproduced the measured P_3..P_6 from the coefficient recurrence
 *     a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n)
 * and asserted the two closed forms through n = 60, but only TABULATED the explicit polynomials up
 * to P_6. This module (a) regenerates P_2..P_8 by a SECOND, structurally-independent route (the
 * raw polynomial-operator recurrence P_(n+1) = n u P_n + (2n-1) P_n - u P_n_prime, built from
 * multiply-by-u / differentiate primitives rather than the pre-solved coefficient formula), (b)
 * confirms both routes agree with the measured P_3..P_6 literals, (c) EXTENDS the explicit
 * coefficient cross-check two orders further, baking the independently hand-derived P_7 and P_8
 * literals and verifying them, and (d) reconfirms the (n-1)! / (2n-3)!! closed forms and strict
 * positivity (hence the definite sign (-1)^(n+1)) persist at every order through n = 8.
 *
 * INDEPENDENT SECOND ROUTE (polynomial-operator form)
 * ---------------------------------------------------
 * imp-34880 iterates the ALREADY-SOLVED coefficient recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k.
 * Here we instead apply the operator form P_(n+1) = n (u P_n) + (2n-1) P_n - u (dP_n/du) directly,
 * using only three polynomial primitives -- multiply-by-u (index shift), differentiate
 * (a_k -> (k+1) a_{k+1}), and scaled add -- so the -u P_n_prime subtraction is carried out
 * explicitly rather than pre-absorbed into the (2n-1-k) multiplier. Agreement of the two routes at
 * every order is a genuine cross-check that the pre-solved multiplier in imp-34880 was assembled
 * correctly (in particular that the sole subtractive term never flips a coefficient negative).
 *
 * INDEPENDENTLY DERIVED P_7, P_8 (baked reference literals)
 * ---------------------------------------------------------
 * Applying the coefficient recurrence by hand from P_6 = [945,2205,2380,1526,600,120] (ascending):
 *     P_7 (n=6, multiplier 11-k): a_k^(7) = 6 a_{k-1}^(6) + (11-k) a_k^(6)
 *         [10395, 27720, 34650, 26488, 13356, 4320, 720]
 *     P_8 (n=7, multiplier 13-k): a_k^(8) = 7 a_{k-1}^(7) + (13-k) a_k^(7)
 *         [135135, 405405, 575190, 507430, 305620, 128052, 35280, 5040]
 * Closed-form spot-checks: leading a_6^(7) = 720 = 6!, constant a_0^(7) = 10395 = 11!!;
 * leading a_7^(8) = 5040 = 7!, constant a_0^(8) = 135135 = 13!!. All coefficients strictly positive,
 * none marginal (smallest is the leading 720 at P_7 / 5040 at P_8 -- far from zero).
 *
 * PROOF SCOPE / HONESTY. This is an INDEPENDENT re-verification of the imp-34880 surrogate-map lemma
 * and a two-order extension of its explicit table -- a VERIFICATION on the inherited imp-3220/imp-3406
 * / imp-33723 surrogate crossover-map derivative SIGNS ONLY. It establishes NO RH-level result, NO
 * operator positivity, and changes NO bound. The C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz
 * (imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED. No RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34880-crossover-deriv-all-orders-sign-induction (the all-orders induction being verified)
 * @see imp-34859-crossover-gpppppp6-sixth-deriv-fourth-band (g_sixth_deriv < 0; order-by-order)
 * @see imp-34842-crossover-gpppp5-fifth-deriv-fourth-band (g_fifth_deriv > 0; fifth order)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; the P_2 base)
 */

// ---- Independent polynomial-operator recurrence (SECOND route) ----------------------------------
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
function nextPoperator(Pn, n) {
  return addPolys(scale(mulByU(Pn), n), scale(Pn, 2 * n - 1), scale(mulByU(derivU(Pn)), -1));
}

// Generate P_2..P_8 by the operator route from the base P_2 = u + 1.
const P2_BASE = [1, 1];
const opRoute = { 2: P2_BASE.slice() };
for (let n = 2; n <= 7; n++) opRoute[n + 1] = nextPoperator(opRoute[n], n);

// ---- Reference literals ------------------------------------------------------------------------
// Measured P_2..P_6 (from imp-34731/34793/34842/34859), ascending powers of u.
const MEASURED_P2_TO_P6 = {
  2: [1, 1],
  3: [3, 4, 2],
  4: [15, 25, 18, 6],
  5: [105, 210, 190, 96, 24],
  6: [945, 2205, 2380, 1526, 600, 120],
};
// Independently hand-derived two-order EXTENSION (this ticket): P_7 and P_8.
const EXTENDED_P7_P8 = {
  7: [10395, 27720, 34650, 26488, 13356, 4320, 720],
  8: [135135, 405405, 575190, 507430, 305620, 128052, 35280, 5040],
};

const arraysEqual = (a, b) => a.length === b.length && a.every((c, i) => c === b[i]);

// ---- Cross-checks ------------------------------------------------------------------------------
// (V1) the independent operator route reproduces the measured P_2..P_6 exactly.
let operatorMatchesMeasuredP2toP6 = true;
for (const n of [2, 3, 4, 5, 6]) {
  if (!arraysEqual(opRoute[n], MEASURED_P2_TO_P6[n])) operatorMatchesMeasuredP2toP6 = false;
}

// (V2) the independent operator route reproduces the baked P_7, P_8 literals exactly (extension).
let operatorMatchesExtendedP7P8 = true;
for (const n of [7, 8]) {
  if (!arraysEqual(opRoute[n], EXTENDED_P7_P8[n])) operatorMatchesExtendedP7P8 = false;
}

// (V3) both extreme-coefficient closed forms hold at EVERY order through n = 8.
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
let leadingIsFactorialThroughN8 = true;
let constantIsDoubleFactorialThroughN8 = true;
for (let n = 2; n <= 8; n++) {
  const P = opRoute[n];
  if (P[P.length - 1] !== factorial(n - 1)) leadingIsFactorialThroughN8 = false; // a_{n-1}^(n) = (n-1)!
  if (P[0] !== oddDoubleFactorial(2 * n - 3)) constantIsDoubleFactorialThroughN8 = false; // a_0^(n) = (2n-3)!!
}

// (V4) strict positivity through n = 8, with the smallest coefficient recorded so we can report
// whether any coefficient is MARGINAL (close to zero). Across n=2..8 the minimum is the P_2/P_3
// leading terms (1, 2), rising thereafter -- nothing marginal, definite sign (-1)^(n+1) persists.
let allCoeffsStrictlyPositiveThroughN8 = true;
let smallestCoefficientThroughN8 = Infinity;
for (let n = 2; n <= 8; n++) {
  for (const c of opRoute[n]) {
    if (!(c > 0) || !Number.isInteger(c)) allCoeffsStrictlyPositiveThroughN8 = false;
    if (c < smallestCoefficientThroughN8) smallestCoefficientThroughN8 = c;
  }
}
// A coefficient is "marginal" only if it sits within a small absolute band of zero; the smallest
// coefficient anywhere through n=8 is 1 (the P_2 base), so none are marginal.
const anyMarginalCoefficient = smallestCoefficientThroughN8 < 1;

const independentVerificationPasses =
  operatorMatchesMeasuredP2toP6 &&
  operatorMatchesExtendedP7P8 &&
  leadingIsFactorialThroughN8 &&
  constantIsDoubleFactorialThroughN8 &&
  allCoeffsStrictlyPositiveThroughN8 &&
  !anyMarginalCoefficient;

export const IMP34905_CROSSOVER_DERIV_CLOSED_FORM_INDEPENDENT_VERIFY_P7_P8 = {
  id: 'imp-34905',
  proofSection: 'S-frontier',
  question:
    'Do the imp-34880 all-orders closed-form cross-checks -- leading coefficient (n-1)! and constant ' +
    'term (2n-3)!! of the crossover-map numerator polynomial P_n(u) -- survive INDEPENDENT ' +
    'regeneration of P_2..P_8, and does the strict positivity / definite sign (-1)^(n+1) of g^(n) ' +
    'persist two orders beyond the imp-34880 explicit table (P_7, P_8)? Verification on the inherited ' +
    'surrogate map; changes no bound; NO QED.',
  independentRoute:
    'P_(n+1) = n (u P_n) + (2n-1) P_n - u (dP_n/du), applied via multiply-by-u / differentiate / ' +
    'scaled-add polynomial primitives (the subtractive -u P_n_prime carried explicitly), structurally ' +
    'independent of the pre-solved coefficient recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k used ' +
    'in imp-34880.',
  extendedP7: EXTENDED_P7_P8[7], // [10395, 27720, 34650, 26488, 13356, 4320, 720]
  extendedP8: EXTENDED_P7_P8[8], // [135135, 405405, 575190, 507430, 305620, 128052, 35280, 5040]
  operatorMatchesMeasuredP2toP6,
  operatorMatchesExtendedP7P8,
  leadingCoefficientClosedForm: 'a_{n-1}^(n) = (n-1)!  (verified n=2..8: 1,1,2,6,24,120,720,5040)',
  constantCoefficientClosedForm:
    'a_0^(n) = (2n-3)!!  (verified n=2..8: 1,1,3,15,105,945,10395,135135)',
  leadingIsFactorialThroughN8,
  constantIsDoubleFactorialThroughN8,
  allCoeffsStrictlyPositiveThroughN8,
  smallestCoefficientThroughN8,
  anyMarginalCoefficient,
  independentVerificationPasses,
  finding: {
    V1_second_route_agrees_P2toP6:
      'The independent polynomial-operator recurrence reproduces the measured P_2..P_6 literals ' +
      'exactly (match=' +
      operatorMatchesMeasuredP2toP6 +
      '), confirming the imp-34880 pre-solved multiplier (2n-1-k) was assembled correctly.',
    V2_extension_P7_P8:
      'Two-order extension: independently hand-derived P_7 = [10395,27720,34650,26488,13356,4320,720] ' +
      'and P_8 = [135135,405405,575190,507430,305620,128052,35280,5040] are reproduced exactly by the ' +
      'operator route (match=' +
      operatorMatchesExtendedP7P8 +
      '); all coefficients strictly positive, so g^(7) has sign +1 and g^(8) has sign -1 per (-1)^(n+1).',
    V3_closed_forms_persist:
      'Both closed forms persist through n=8: leading a_{n-1}^(n) = (n-1)! and constant a_0^(n) = ' +
      '(2n-3)!! (leadingOK=' +
      leadingIsFactorialThroughN8 +
      ', constantOK=' +
      constantIsDoubleFactorialThroughN8 +
      '). At n=7: 720=6! and 10395=11!!; at n=8: 5040=7! and 135135=13!!.',
    V4_no_marginal_coefficient:
      'No coefficient is marginal: the smallest coefficient anywhere through n=8 is ' +
      smallestCoefficientThroughN8 +
      ' (the P_2 base), far from zero -- strict positivity and the definite sign (-1)^(n+1) hold with ' +
      'wide margin, with no interior zero on the post-peak ramp.',
  },
  isRigorous: true, // exact integer arithmetic; the closed forms and positivity are verified, not fitted
  rigorousScope:
    'Independent re-verification and two-order extension of the imp-34880 coefficient-positivity / ' +
    'closed-form cross-checks for the derivatives of the INHERITED imp-3220/imp-3406 surrogate ' +
    'crossover map ONLY. Establishes NO RH-level result, NO operator positivity, changes NO bound.',
  changesBound: false,
  verdict:
    'VERIFICATION (frontier-direction, surrogate-map lemma). An independent polynomial-operator ' +
    'recurrence P_(n+1) = n u P_n + (2n-1) P_n - u P_n_prime -- structurally distinct from the ' +
    'pre-solved coefficient recurrence in imp-34880 -- regenerates P_2..P_8 in exact integer ' +
    'arithmetic. It matches the measured P_2..P_6 literals, and the two-order extension to P_7 = ' +
    '[10395,27720,34650,26488,13356,4320,720] and P_8 = ' +
    '[135135,405405,575190,507430,305620,128052,35280,5040] reproduces the independently hand-derived ' +
    'literals exactly. Both closed forms hold at every order through n=8: leading a_{n-1}^(n) = (n-1)! ' +
    '(720 at n=7, 5040 at n=8) and constant a_0^(n) = (2n-3)!! (10395 at n=7, 135135 at n=8). All ' +
    'coefficients are strictly positive with the smallest anywhere being 1 (no marginal coefficient), ' +
    'so g^(n) keeps the definite sign (-1)^(n+1) with no interior zero on the post-peak ramp two ' +
    'orders beyond the imp-34880 explicit table. This is a VERIFICATION of the INHERITED ' +
    'imp-3220/imp-3406 surrogate-map derivative signs ONLY: the C_mb GUE-conditional per imp-486, the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED; establishes no operator ' +
    'positivity; changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34880 (all-orders coefficient-positivity induction + (n-1)!/(2n-3)!! cross-checks); ' +
    'imp-34859 (g_sixth_deriv < 0; order-by-order); imp-34842 (g_fifth_deriv > 0); imp-34731 ' +
    '(g_double_prime closed form; P_2 base); imp-33723 (crossover map g(N)=K log T0(N)); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP34905_CROSSOVER_DERIV_CLOSED_FORM_INDEPENDENT_VERIFY_P7_P8_ASSERTIONS = [
  {
    // (V1): the independent operator route reproduces the measured P_2..P_6 exactly.
    id: 'imp34905-independent-route-reproduces-measured-P2-to-P6',
    description:
      'the independent polynomial-operator recurrence P_(n+1) = n u P_n + (2n-1) P_n - u P_n_prime ' +
      'reproduces the measured P_2..P_6 numerator polynomials exactly',
    holds: () => operatorMatchesMeasuredP2toP6,
  },
  {
    // (V2): two-order extension -- P_7, P_8 baked literals reproduced by the independent route.
    id: 'imp34905-extension-P7-P8-reproduced-independently',
    description:
      'the independently hand-derived P_7 and P_8 literals are reproduced exactly by the operator ' +
      'recurrence (two-order extension of the imp-34880 explicit table, strictly positive)',
    holds: () => operatorMatchesExtendedP7P8 && allCoeffsStrictlyPositiveThroughN8,
  },
  {
    // (V3): both extreme-coefficient closed forms persist through n = 8.
    id: 'imp34905-closed-forms-persist-through-n8',
    description:
      'the leading a_{n-1}^(n) = (n-1)! and constant a_0^(n) = (2n-3)!! closed forms hold at every ' +
      'order n=2..8 (720=6!, 10395=11!! at n=7; 5040=7!, 135135=13!! at n=8)',
    holds: () => leadingIsFactorialThroughN8 && constantIsDoubleFactorialThroughN8,
  },
  {
    // (V4): no marginal coefficient -- definite sign (-1)^(n+1) holds with wide margin.
    id: 'imp34905-no-marginal-coefficient-through-n8',
    description:
      'no coefficient of P_2..P_8 is marginal (smallest is 1, the P_2 base); strict positivity and ' +
      'the definite sign (-1)^(n+1) hold with wide margin, no interior zero',
    holds: () => !anyMarginalCoefficient && smallestCoefficientThroughN8 >= 1,
  },
  {
    // Aggregate: the independent verification passes end-to-end.
    id: 'imp34905-independent-verification-passes',
    description:
      'independent verification closes: second route matches measured P_2..P_6 + extended P_7,P_8 + ' +
      'both closed forms through n=8 + strict positivity with no marginal coefficient',
    holds: () =>
      independentVerificationPasses &&
      IMP34905_CROSSOVER_DERIV_CLOSED_FORM_INDEPENDENT_VERIFY_P7_P8.independentVerificationPasses,
  },
  {
    // Honesty gate: surrogate-map verification, changes no bound, no QED, no refereed bound is changed.
    id: 'imp34905-honesty-gate-no-qed',
    description:
      'verification scope is the surrogate-map derivative signs only: changes no bound, no QED, ' +
      'no refereed bound is changed',
    holds: () =>
      IMP34905_CROSSOVER_DERIV_CLOSED_FORM_INDEPENDENT_VERIFY_P7_P8.changesBound === false &&
      /NO QED/.test(IMP34905_CROSSOVER_DERIV_CLOSED_FORM_INDEPENDENT_VERIFY_P7_P8.verdict) &&
      /refereed bound is changed/i.test(IMP34905_CROSSOVER_DERIV_CLOSED_FORM_INDEPENDENT_VERIFY_P7_P8.verdict) &&
      /surrogate/.test(IMP34905_CROSSOVER_DERIV_CLOSED_FORM_INDEPENDENT_VERIFY_P7_P8.rigorousScope),
  },
];

for (const a of IMP34905_CROSSOVER_DERIV_CLOSED_FORM_INDEPENDENT_VERIFY_P7_P8_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-34905-crossover-deriv-closed-form-independent-verify-p7-p8 assertion failed: ${a.id}`,
    );
  }
}
