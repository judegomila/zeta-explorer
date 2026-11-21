/**
 * @module imp-34880-crossover-deriv-all-orders-sign-induction
 *
 * imp-34880 (proof, S-frontier): the imp-34793/imp-34822/imp-34842/imp-34859 chain established the
 * alternating/definite derivative-sign ladder of the inherited imp-33723 crossover map
 *     g(N) = K log T0(N),   K = (C_C/E_trunc)^2,   T = T0(N),   u = log(T/2pi)
 * ONE ORDER AT A TIME up to the sixth derivative, each order resting on the strict positivity of a
 * numerator polynomial P_n(u). Writing every derivative in the common form
 *     g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T^n u^(2n-1))
 * the measured chain is
 *     P_2 = u + 1
 *     P_3 = 2u^2 + 4u + 3
 *     P_4 = 6u^3 + 18u^2 + 25u + 15
 *     P_5 = 24u^4 + 96u^3 + 190u^2 + 210u + 105
 *     P_6 = 120u^5 + 600u^4 + 1526u^3 + 2380u^2 + 2205u + 945
 * -- each with STRICTLY POSITIVE coefficients, so each P_n(u) > 0 for u > 0 and the sign of g^(n) is
 * exactly (-1)^(n+1). But imp-34859 PROVED nothing beyond order six: the all-orders statement was
 * open. This module DERIVES the recurrence relating P_(n+1) to P_n and u P_n_prime implied by
 * differentiating g^(n) once more, and PROVES by induction that every P_n (n >= 2) has strictly
 * positive coefficients -- upgrading the order-by-order chain to a single ALL-ORDERS definite-sign
 * statement, and pinning the exact term one might fear could break positivity (it cannot).
 *
 * THE RECURRENCE (derivation, H1)
 * -------------------------------
 * Write g^(n) = c_n h_n with c_n = (-1)^(n+1) 2^n pi^n K and h_n = P_n(u)/(T^n u^(2n-1)). On the
 * Riemann-von Mangoldt footing dT/dN = 2 pi/u, du/dN = 2 pi/(T u) (note (1/T) dT/dN = du/dN):
 *     d(log h_n)/dN = (2 pi/(T u)) [ P_n_prime/P_n - n - (2n-1)/u ],
 * so
 *     h_n_prime = (2 pi / (T^(n+1) u^(2n+1))) [ u P_n_prime - n u P_n - (2n-1) P_n ].
 * Then g^(n+1) = c_n h_n_prime = (-1)^(n+1) 2^(n+1) pi^(n+1) K [u P_n_prime - n u P_n - (2n-1) P_n]
 *              / (T^(n+1) u^(2n+1)). Matching this to the target form g^(n+1) = (-1)^(n+2) 2^(n+1)
 * pi^(n+1) K P_(n+1)(u)/(T^(n+1) u^(2n+1)) and cancelling the (-1) gives the DERIVATIVE RECURRENCE
 *     P_(n+1)(u) = n u P_n(u) + (2n-1) P_n(u) - u P_n_prime(u).
 * (Cross-check: for n = 4 this is P_5 = 4 u P_4 + 7 P_4 - u P_4_prime, exactly the imp-34842 assembly
 * u P_prime - 7 P - 4 u P = -P_5; for n = 5 it is P_6 = 5 u P_5 + 9 P_5 - u P_5_prime, the imp-34859
 * assembly. The recurrence reproduces P_3..P_6 from P_2 EXACTLY.)
 *
 * In coefficients (P_n = sum_{k=0}^{n-1} a_k^(n) u^k, degree n-1):
 *     a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n),   a_{-1}^(n) = 0, a_n^(n) = 0.
 *
 * THE ALL-ORDERS INDUCTION (H2) -- IT DOES NOT LEAK
 * -------------------------------------------------
 * Claim: for every n >= 2 all coefficients a_k^(n) (k = 0..n-1) are strictly positive.
 *   Base: P_2 = u + 1 has coefficients {1, 1} > 0.
 *   Step: assume a_k^(n) > 0 for all k = 0..n-1. In a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n):
 *     * n a_{k-1}^(n) >= 0, and > 0 exactly when a_{k-1}^(n) exists (k in 1..n), since n >= 2 > 0;
 *     * (2n-1-k) a_k^(n): the coefficient a_k^(n) exists only for k <= n-1, and for every such k
 *       the multiplier obeys 2n-1-k >= 2n-1-(n-1) = n >= 2 > 0 -- STRICTLY POSITIVE.
 *   So k = 0 gives (2n-1) a_0^(n) > 0; k = n gives n a_{n-1}^(n) > 0 (the new leading term); and every
 *   interior 1 <= k <= n-1 is a sum of two strictly-positive terms. Hence all a_k^(n+1) > 0. QED.
 *
 * THE EXACT TERM ONE MIGHT FEAR (assessment)
 * ------------------------------------------
 * The only subtractive contribution is -u P_n_prime, which lowers a_k by -k a_k^(n). In ISOLATION
 * that could dominate for large k. But it never appears alone: differentiating g^(n) also produces
 * the +(2n-1) P_n term, and the two COMBINE into the single multiplier (2n-1-k). Because
 * deg P_n = n-1 caps k at n-1, that multiplier is bounded below by n >= 2 across the ENTIRE support
 * of P_n -- the derivative term can never overpower. The induction therefore has NO leak: there is
 * no order n and no coefficient k at which positivity fails, so g^(n) has the definite sign
 * (-1)^(n+1) with P_n(u) > 0 (no interior zero) on the whole post-peak ramp u > 0, for ALL n >= 2.
 *
 * TWO CLOSED-FORM CROSS-CHECKS ON THE RECURRENCE (H3)
 * --------------------------------------------------
 * The recurrence forces two exact closed forms for the extreme coefficients:
 *     leading coefficient   a_{n-1}^(n) = (n-1)!            [L_{n+1} = n L_n, L_2 = 1]
 *     constant coefficient  a_0^(n)     = (2n-3)!!          [c_{n+1} = (2n-1) c_n, c_2 = 1]
 * i.e. 1, 2, 6, 24, 120 (leading) and 1, 3, 15, 105, 945 (constant) for n = 2..6 -- both strictly
 * positive and matching the measured P_2..P_6 literals.
 *
 * PROOF SCOPE / HONESTY. The induction is a COMPLETE, rigorous proof of the coefficient-positivity
 * (hence all-orders definite-sign (-1)^(n+1)) statement for the derivatives of the INHERITED
 * imp-3220/imp-3406 surrogate crossover map. It is a statement about that map's derivative signs
 * ONLY. It establishes NO RH-level result, NO operator positivity, and changes NO bound. The C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * imp-3066 K_a >= 0 is UNTOUCHED. No RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34859-crossover-gpppppp6-sixth-deriv-fourth-band (g_sixth_deriv < 0; sixth order, order-by-order)
 * @see imp-34842-crossover-gpppp5-fifth-deriv-fourth-band (g_fifth_deriv > 0; fifth order)
 * @see imp-34793-crossover-gpppp-convexity (g_quadruple_prime closed form; fourth order)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; the P_2 base case)
 */

// P_2 = u + 1 (coefficient array [a_0, a_1, ...], ascending powers of u). The induction base case.
const P2 = [1, 1];

// Derivative recurrence in coefficient form (H1):
//   a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n),  a_{-1} = 0, a_n^(n) = 0.
// nextP takes P_n (length n, degree n-1) and returns P_(n+1) (length n+1, degree n).
function nextP(Pn, n) {
  const out = new Array(n + 1).fill(0);
  for (let k = 0; k <= n; k++) {
    const aPrev = k - 1 >= 0 && k - 1 < Pn.length ? Pn[k - 1] : 0; // a_{k-1}^(n)
    const aCurr = k < Pn.length ? Pn[k] : 0; // a_k^(n)
    out[k] = n * aPrev + (2 * n - 1 - k) * aCurr;
  }
  return out;
}

// Generate P_2..P_(N_MAX) by the recurrence. N_MAX = 60 keeps the factorially-growing coefficients
// well inside double range (leading term (n-1)! ~ 6e78 at n=60, no Infinity).
const N_MAX = 60;
const Ps = { 2: P2 }; // Ps[n] = coefficient array of P_n
for (let n = 2; n < N_MAX; n++) {
  Ps[n + 1] = nextP(Ps[n], n);
}

// Known measured literals P_2..P_6 (ascending powers), from imp-34731/34793/34842/34859.
const KNOWN = {
  2: [1, 1],
  3: [3, 4, 2],
  4: [15, 25, 18, 6],
  5: [105, 210, 190, 96, 24],
  6: [945, 2205, 2380, 1526, 600, 120],
};

// (H1 check) the recurrence reproduces the measured P_2..P_6 EXACTLY.
let recurrenceMatchesKnown = true;
for (const n of [2, 3, 4, 5, 6]) {
  const got = Ps[n];
  const want = KNOWN[n];
  if (got.length !== want.length || got.some((c, i) => c !== want[i])) recurrenceMatchesKnown = false;
}

// (H2 check) all coefficients strictly positive for every generated order; record the smallest
// coefficient seen (must stay > 0) and the smallest recurrence multiplier (2n-1-k) over the support
// of P_n -- the quantity whose positivity is the WHOLE reason the induction cannot leak.
let allCoeffsStrictlyPositive = true;
let minCoeff = Infinity;
let minSupportMultiplier = Infinity; // min over n,k<=n-1 of (2n-1-k); analytically achieved at k=n-1 => n
for (let n = 2; n <= N_MAX; n++) {
  const P = Ps[n];
  for (let k = 0; k < P.length; k++) {
    if (!(P[k] > 0) || !Number.isFinite(P[k])) allCoeffsStrictlyPositive = false;
    if (P[k] < minCoeff) minCoeff = P[k];
  }
  // support of P_n is k = 0..n-1; the multiplier acting on a_k in the next step is (2n-1-k).
  for (let k = 0; k <= n - 1; k++) {
    const mult = 2 * n - 1 - k;
    if (mult < minSupportMultiplier) minSupportMultiplier = mult;
  }
}
// The analytic floor: min_{k<=n-1}(2n-1-k) = n (at k=n-1), and the smallest n used is 2, so the
// global floor of the multiplier across all orders is 2 > 0 -- the no-leak margin.
const NO_LEAK_MULTIPLIER_FLOOR = 2;

// (H3 check) the two extreme-coefficient closed forms forced by the recurrence:
//   leading a_{n-1}^(n) = (n-1)!,  constant a_0^(n) = (2n-3)!!.
function factorial(m) {
  let f = 1;
  for (let j = 2; j <= m; j++) f *= j;
  return f;
}
function oddDoubleFactorial(m) {
  // (2n-3)!! = 1*3*5*...*(2n-3); for n=2 the product is 1 (empty-ish, single factor 1).
  let f = 1;
  for (let j = 1; j <= m; j += 2) f *= j;
  return f;
}
let leadingMatchesFactorial = true;
let constantMatchesDoubleFactorial = true;
for (let n = 2; n <= N_MAX; n++) {
  const P = Ps[n];
  const leading = P[P.length - 1]; // a_{n-1}^(n)
  const constant = P[0]; // a_0^(n)
  const wantLeading = factorial(n - 1); // (n-1)!
  const wantConstant = oddDoubleFactorial(2 * n - 3); // (2n-3)!!
  if (Math.abs(leading / wantLeading - 1) > 1e-9) leadingMatchesFactorial = false;
  if (Math.abs(constant / wantConstant - 1) > 1e-9) constantMatchesDoubleFactorial = false;
}

const inductionCloses =
  recurrenceMatchesKnown &&
  allCoeffsStrictlyPositive &&
  minCoeff > 0 &&
  minSupportMultiplier >= NO_LEAK_MULTIPLIER_FLOOR &&
  leadingMatchesFactorial &&
  constantMatchesDoubleFactorial;

export const IMP34880_CROSSOVER_DERIV_ALL_ORDERS_SIGN_INDUCTION = {
  id: 'imp-34880',
  proofSection: 'S-frontier',
  question:
    'The imp-34793/34822/34842/34859 chain established the alternating/definite derivative-sign ' +
    'ladder of the inherited imp-33723 crossover map g^(n) = (-1)^(n+1) 2^n pi^n K P_n(u)/(T^n u^(2n-1)) ' +
    'ONE ORDER AT A TIME up to the sixth derivative, each order resting on the strict positivity of a ' +
    'numerator polynomial P_n(u). Does that positivity hold for ALL orders n >= 2 (a single all-orders ' +
    'definite-sign statement), and if the induction leaks, which exact term breaks positivity? ' +
    'Derivation/assessment on the inherited surrogate map; changes no bound; NO QED.',
  derivativeRecurrence:
    'P_(n+1)(u) = n u P_n(u) + (2n-1) P_n(u) - u P_n_prime(u); in coefficients ' +
    'a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n) (a_{-1}=0, a_n^(n)=0). Derived by differentiating ' +
    'g^(n) = (-1)^(n+1) 2^n pi^n K P_n(u)/(T^n u^(2n-1)) once more on the Riemann-von Mangoldt footing ' +
    'dT/dN = 2 pi/u, du/dN = 2 pi/(T u).',
  inductionArgument:
    'Base P_2 = u+1 has coefficients {1,1} > 0. Step: if a_k^(n) > 0 for k=0..n-1 then ' +
    'a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n); n a_{k-1} >= 0 (>0 when a_{k-1} exists, n>=2), and ' +
    'the multiplier (2n-1-k) >= n >= 2 > 0 for every k <= n-1 (the whole support of P_n, since ' +
    'deg P_n = n-1). So k=0 gives (2n-1)a_0 > 0, k=n gives n a_{n-1} > 0, and every interior k is a ' +
    'sum of two strictly-positive terms. All coefficients of P_(n+1) are therefore strictly positive.',
  exactTermThatCouldLeak:
    'The only subtractive contribution is -u P_n_prime (lowering a_k by -k a_k^(n)); in isolation it ' +
    'could dominate at large k. But it never appears alone -- it combines with +(2n-1) P_n into the ' +
    'single multiplier (2n-1-k), and deg P_n = n-1 caps k at n-1, so (2n-1-k) >= n >= 2 > 0 across the ' +
    'entire support. The derivative term can never overpower; the induction has NO leak.',
  ordersGenerated: N_MAX,
  recurrenceMatchesKnownP2toP6: recurrenceMatchesKnown,
  allCoeffsStrictlyPositive,
  minCoefficientAcrossAllOrders: +minCoeff.toExponential(6),
  minSupportMultiplier, // = 2 (the analytic no-leak floor, achieved at n=2,k=1)
  noLeakMultiplierFloor: NO_LEAK_MULTIPLIER_FLOOR,
  leadingCoefficientClosedForm: 'a_{n-1}^(n) = (n-1)!  (leading term of g^(n) numerator)',
  constantCoefficientClosedForm: 'a_0^(n) = (2n-3)!!  (constant term of g^(n) numerator)',
  leadingMatchesFactorial,
  constantMatchesDoubleFactorial,
  allOrdersDefiniteSignProved: inductionCloses,
  inductionLeaks: !inductionCloses ? true : false,
  finding: {
    H1_recurrence:
      'Differentiating g^(n) once more yields P_(n+1) = n u P_n + (2n-1) P_n - u P_n_prime, which ' +
      'reproduces the measured P_3..P_6 from P_2 EXACTLY (matchesKnown=' +
      recurrenceMatchesKnown +
      ').',
    H2_induction_closes:
      'The coefficient recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k has no negative multiplier over ' +
      'the support of P_n (min (2n-1-k) = ' +
      minSupportMultiplier +
      ' >= 2 for all n>=2 since deg P_n=n-1 caps k at n-1), so strict positivity propagates from the ' +
      'P_2 base to ALL orders: every P_n (n>=2) has strictly positive coefficients (verified n=2..' +
      N_MAX +
      ', smallest coefficient ' +
      (+minCoeff.toExponential(6)).toString() +
      ' > 0). Hence P_n(u) > 0 for u>0 and g^(n) has definite sign (-1)^(n+1) with no interior zero.',
    H3_extreme_coefficient_closed_forms:
      'The recurrence forces a_{n-1}^(n) = (n-1)! and a_0^(n) = (2n-3)!! (both strictly positive), ' +
      'matching the measured P_2..P_6 leading/constant coefficients (1,2,6,24,120 and 1,3,15,105,945).',
    H4_no_leak:
      'The only subtractive term -u P_n_prime is absorbed into the positive multiplier (2n-1-k) >= n; ' +
      'there is no order and no coefficient at which positivity fails. The order-by-order ' +
      'imp-34793/34822/34842/34859 ladder is upgraded to a single all-orders definite-sign statement.',
  },
  isRigorous: true, // the coefficient-positivity induction is a complete, rigorous proof of THIS statement
  rigorousScope:
    'Rigorous proof of coefficient positivity (hence all-orders definite sign (-1)^(n+1)) for the ' +
    'derivatives of the INHERITED imp-3220/imp-3406 surrogate crossover map ONLY. Establishes NO ' +
    'RH-level result, NO operator positivity, and changes NO bound.',
  changesBound: false,
  verdict:
    'PROOF (frontier-direction, surrogate-map lemma). Differentiating the imp-33723 crossover-map ' +
    'derivative g^(n) = (-1)^(n+1) 2^n pi^n K P_n(u)/(T^n u^(2n-1)) once more on the Riemann-von ' +
    'Mangoldt footing gives the recurrence P_(n+1) = n u P_n + (2n-1) P_n - u P_n_prime, i.e. ' +
    'a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k, which reproduces the measured P_3..P_6 exactly. By ' +
    'induction from the base P_2 = u+1, every P_n (n>=2) has strictly positive coefficients: the only ' +
    'subtractive term -u P_n_prime is absorbed into the multiplier (2n-1-k), which is bounded below by ' +
    'n >= 2 > 0 across the whole support of P_n (deg P_n = n-1 caps k at n-1), so positivity cannot ' +
    'leak. Hence P_n(u) > 0 for u > 0 and g^(n) has the DEFINITE sign (-1)^(n+1) with no interior zero ' +
    'on the post-peak ramp, for ALL orders -- upgrading the order-by-order imp-34859 chain to a single ' +
    'all-orders statement (leading coefficient (n-1)! and constant (2n-3)!! give two closed-form ' +
    'cross-checks). This is a lemma about the INHERITED imp-3220/imp-3406 surrogate map derivative ' +
    'signs ONLY: the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and ' +
    'imp-3066 K_a >= 0 are UNTOUCHED; establishes no operator positivity; changes no bound; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34859 (g_sixth_deriv < 0; order-by-order); imp-34842 (g_fifth_deriv > 0); imp-34793 ' +
    '(g_quadruple_prime closed form); imp-34731 (g_double_prime closed form; P_2 base); imp-33723 ' +
    '(crossover map g(N)=K log T0(N)); imp-2642/imp-2643 (C_C 1/8 ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP34880_CROSSOVER_DERIV_ALL_ORDERS_SIGN_INDUCTION_ASSERTIONS = [
  {
    // (H1): the derivative recurrence reproduces the measured P_2..P_6 exactly.
    id: 'imp34880-recurrence-reproduces-known-P2-to-P6',
    description:
      'P_(n+1) = n u P_n + (2n-1) P_n - u P_n_prime reproduces the measured P_2..P_6 numerator ' +
      'polynomials exactly from the base P_2 = u+1',
    holds: () => recurrenceMatchesKnown,
  },
  {
    // (H2): strict coefficient positivity for every generated order (the induction, verified).
    id: 'imp34880-all-orders-coefficients-strictly-positive',
    description:
      'every P_n (n=2..' +
      N_MAX +
      ') generated by the recurrence has strictly positive coefficients (smallest > 0), so g^(n) has ' +
      'definite sign (-1)^(n+1) with no interior zero for all orders',
    holds: () => allCoeffsStrictlyPositive && minCoeff > 0,
  },
  {
    // (H2/H4): the no-leak margin -- the recurrence multiplier stays >= 2 over the support of P_n.
    id: 'imp34880-no-leak-multiplier-floor-at-least-two',
    description:
      'the recurrence multiplier (2n-1-k) is bounded below by 2 across the support k<=n-1 of every ' +
      'P_n (analytic floor n>=2 at k=n-1), so the subtractive -u P_n_prime term can never overpower',
    holds: () => minSupportMultiplier >= NO_LEAK_MULTIPLIER_FLOOR,
  },
  {
    // (H3): the two extreme-coefficient closed forms forced by the recurrence.
    id: 'imp34880-extreme-coefficient-closed-forms',
    description:
      'the leading coefficient a_{n-1}^(n) = (n-1)! and the constant a_0^(n) = (2n-3)!! for all ' +
      'n=2..' +
      N_MAX +
      ' (both strictly positive)',
    holds: () => leadingMatchesFactorial && constantMatchesDoubleFactorial,
  },
  {
    // Aggregate: the all-orders definite-sign induction closes.
    id: 'imp34880-all-orders-definite-sign-induction-closes',
    description:
      'the induction closes: recurrence matches known + all coefficients positive + no-leak ' +
      'multiplier floor + both extreme closed forms hold => all-orders definite sign (-1)^(n+1)',
    holds: () => inductionCloses && IMP34880_CROSSOVER_DERIV_ALL_ORDERS_SIGN_INDUCTION.allOrdersDefiniteSignProved,
  },
  {
    // Honesty gate: surrogate-map lemma, changes no bound, no QED, no refereed bound is changed.
    id: 'imp34880-honesty-gate-no-qed',
    description:
      'proof scope is the surrogate-map derivative signs only: changes no bound, no QED, ' +
      'no refereed bound is changed',
    holds: () =>
      IMP34880_CROSSOVER_DERIV_ALL_ORDERS_SIGN_INDUCTION.changesBound === false &&
      /NO QED/.test(IMP34880_CROSSOVER_DERIV_ALL_ORDERS_SIGN_INDUCTION.verdict) &&
      /refereed bound is changed/i.test(IMP34880_CROSSOVER_DERIV_ALL_ORDERS_SIGN_INDUCTION.verdict) &&
      /surrogate/.test(IMP34880_CROSSOVER_DERIV_ALL_ORDERS_SIGN_INDUCTION.rigorousScope),
  },
];

for (const a of IMP34880_CROSSOVER_DERIV_ALL_ORDERS_SIGN_INDUCTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34880-crossover-deriv-all-orders-sign-induction assertion failed: ${a.id}`);
  }
}
