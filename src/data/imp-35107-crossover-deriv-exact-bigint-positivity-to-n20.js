/**
 * @module imp-35107-crossover-deriv-exact-bigint-positivity-to-n20
 *
 * imp-35107 (proof, S-frontier): INDEPENDENT from-source EXACT-ARITHMETIC re-verification of the
 * imp-34880 all-orders numerator-polynomial positivity induction that underpins the imp-35012
 * Bernstein-function classification, recomputing the coefficient triangle P_n WELL BEYOND the n=12
 * order the induction had actually been exercised through (target n ~ 20), in exact BigInt.
 *
 * WHY A NEW EXACT RECOMPUTATION (the gap this closes)
 * ---------------------------------------------------
 * The inherited imp-33723 crossover map g(N) = K log T0(N) has n-th derivative
 *     g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T^n u^(2n-1)),   u = log(T/2pi) > 0,
 * whose sign is (-1)^(n+1) iff the numerator polynomial P_n(u) is strictly positive on the ramp,
 * i.e. iff every coefficient a_k^(n) is strictly positive. imp-34880 PROVED that by the coefficient
 * recurrence
 *     a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n),   a_{-1}^(n) = 0, a_n^(n) = 0,   P_2 = [1, 1],
 * and it did generate a table to n = 60 -- but in DOUBLE-precision float. imp-34975 then LOCATED the
 * 2^53 exact-integer ceiling: the largest coefficient first exceeds 2^53 at n = 16, so the imp-34880
 * double-precision table is inexact from n = 16 onward and imp-34975 itself only exact-certified
 * through n = 16 (with baked P_13/P_14 literals). imp-35012 leans on the induction holding for ALL n,
 * yet the elementary check had only ever been exercised (with hand literals / exact arithmetic) through
 * roughly n = 12-16. This module recomputes the triangle FROM SOURCE in exact BigInt out to n = 22,
 * so the positivity that licenses the Bernstein classification is CERTIFIED exactly across the whole
 * target n ~ 20 window, several orders past both the n = 12 induction-exercise point AND the n = 16
 * float exactness ceiling -- no rounding can hide a sign flip.
 *
 * WHAT IS CHECKED (exact BigInt, n = 2..22)
 * -----------------------------------------
 *   (E1) Every recurrence multiplier is strictly positive over the support 0 <= k <= n-1 of P_n:
 *        the left multiplier n >= 2 > 0, and the right multiplier 2n-1-k >= 2n-1-(n-1) = n >= 2 > 0.
 *        The global floor over all n >= 2, k <= n-1 is n = 2 (achieved at k = n-1) -- the no-leak
 *        margin. (Off the support, k = n adds only the strictly positive new leading term n a_{n-1}.)
 *   (E2) Every coefficient a_k^(n) is a strictly positive exact integer for n = 2..22 (2^53-agnostic:
 *        BigInt is exact at every order), so P_n has strictly positive coefficients at every order.
 *   (E3) P_n(u) > 0 for u > 0, evaluated EXACTLY at three positive-integer ramp points u in {1, 2, 3}
 *        by BigInt Horner -- each a sum of strictly positive terms, hence > 0. (The structural reason:
 *        all coefficients > 0 forces P_n(u) > 0 for EVERY u > 0, so g^(n) has definite sign
 *        (-1)^(n+1) with no interior zero on the post-peak ramp.)
 *   (E4) The two extreme-coefficient closed forms hold in exact BigInt at every order: leading
 *        a_{n-1}^(n) = (n-1)! and constant a_0^(n) = (2n-3)!!.
 *   (E5) Cross-checks against the independently-derived baked literals: P_6 (imp-34880) and P_14
 *        (imp-34975) reproduce EXACTLY from the from-source recurrence.
 *
 * VERDICT. The exact-BigInt recomputation confirms, with no floating-point exposure, that the
 * imp-34880 induction does NOT leak anywhere in the target n ~ 20 window: both recurrence multipliers
 * stay strictly positive on the support of P_n and every P_n coefficient is a strictly positive
 * integer through n = 22, so P_n(u) > 0 for u > 0 and g^(n) keeps the definite sign (-1)^(n+1) at
 * every order -- the exact structural support the imp-35012 Bernstein-function classification requires.
 *
 * PROOF SCOPE / HONESTY. VERIFICATION ONLY on the inherited imp-3220/imp-3406 / imp-33723 SURROGATE
 * crossover-map derivative signs. Establishes NO operator positivity, NO spectral consequence, and
 * changes NO bound. The C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and
 * imp-3066 K_a >= 0 are UNTOUCHED. No RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34880-crossover-deriv-all-orders-sign-induction (the all-orders positivity induction, in double)
 * @see imp-34975-crossover-deriv-p13-p14-2p53-ceiling (locates the 2^53 exact-integer ceiling at n=16)
 * @see imp-35012-crossover-complete-monotonicity-bernstein-assessment (the Bernstein classification that leans on all-n positivity)
 */

// ---- From-source EXACT coefficient recurrence a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k (BigInt) --------
// nextP takes P_n (length n, degree n-1) and returns P_(n+1) (length n+1, degree n), all BigInt.
function nextP(Pn, n) {
  const nb = BigInt(n);
  const out = new Array(n + 1);
  for (let k = 0; k <= n; k++) {
    const aPrev = k - 1 >= 0 && k - 1 < Pn.length ? Pn[k - 1] : 0n; // a_{k-1}^(n)
    const aCurr = k < Pn.length ? Pn[k] : 0n; // a_k^(n)
    out[k] = nb * aPrev + BigInt(2 * n - 1 - k) * aCurr;
  }
  return out;
}

// Target: recompute out to n = 20; generate to N_MAX = 22 to bracket the target window.
const N_MAX = 22;
const Ps = { 2: [1n, 1n] }; // Ps[n] = BigInt coefficient array of P_n (ascending powers of u)
for (let n = 2; n < N_MAX; n++) Ps[n + 1] = nextP(Ps[n], n);

// (E1) every recurrence multiplier strictly positive over the support 0 <= k <= n-1 of P_n.
let allMultipliersStrictlyPositive = true;
let minSupportMultiplier = Infinity; // min over n,k<=n-1 of (2n-1-k); analytic floor = n at k=n-1
let minLeftMultiplier = Infinity; // min over n of n; analytic floor = 2
for (let n = 2; n <= N_MAX; n++) {
  if (n < minLeftMultiplier) minLeftMultiplier = n;
  if (!(n > 0)) allMultipliersStrictlyPositive = false;
  for (let k = 0; k <= n - 1; k++) {
    const mult = 2 * n - 1 - k;
    if (!(mult > 0)) allMultipliersStrictlyPositive = false;
    if (mult < minSupportMultiplier) minSupportMultiplier = mult;
  }
}
const NO_LEAK_MULTIPLIER_FLOOR = 2; // min over all n>=2, k<=n-1 of both multipliers = 2

// (E2) every coefficient a strictly positive exact integer at every order (BigInt: exact at all n).
let allCoeffsStrictlyPositive = true;
let maxCoeff = 0n; // largest coefficient across all orders (grows factorially; BigInt keeps it exact)
for (let n = 2; n <= N_MAX; n++) {
  const P = Ps[n];
  if (P.length !== n) allCoeffsStrictlyPositive = false; // deg P_n = n-1 => length n
  for (let k = 0; k < P.length; k++) {
    if (!(typeof P[k] === 'bigint' && P[k] > 0n)) allCoeffsStrictlyPositive = false;
    if (P[k] > maxCoeff) maxCoeff = P[k];
  }
}

// (E3) P_n(u) > 0 at positive-integer ramp points u in {1,2,3}, evaluated exactly by BigInt Horner.
function evalPolyBig(P, u) {
  const ub = BigInt(u);
  let s = 0n;
  for (let k = P.length - 1; k >= 0; k--) s = s * ub + P[k];
  return s;
}
let allRampValuesStrictlyPositive = true;
for (let n = 2; n <= N_MAX; n++) {
  for (const u of [1, 2, 3]) {
    if (!(evalPolyBig(Ps[n], u) > 0n)) allRampValuesStrictlyPositive = false;
  }
}

// (E4) extreme-coefficient closed forms in exact BigInt: leading (n-1)!, constant (2n-3)!!.
function factorialBig(m) {
  let f = 1n;
  for (let j = 2n; j <= BigInt(m); j++) f *= j;
  return f;
}
function oddDoubleFactorialBig(m) {
  // (2n-3)!! = 1*3*5*...*(2n-3); for n=2 the single factor 1 gives 1.
  let f = 1n;
  for (let j = 1n; j <= BigInt(m); j += 2n) f *= j;
  return f;
}
let leadingMatchesFactorial = true;
let constantMatchesDoubleFactorial = true;
for (let n = 2; n <= N_MAX; n++) {
  const P = Ps[n];
  if (P[P.length - 1] !== factorialBig(n - 1)) leadingMatchesFactorial = false; // a_{n-1}^(n) = (n-1)!
  if (P[0] !== oddDoubleFactorialBig(2 * n - 3)) constantMatchesDoubleFactorial = false; // a_0^(n) = (2n-3)!!
}

// (E5) cross-check against independently-derived baked literals (imp-34880 P_6, imp-34975 P_14).
const P6_KNOWN = [945n, 2205n, 2380n, 1526n, 600n, 120n]; // imp-34880 measured literal
const P14_KNOWN = [
  7905853580625n, 39529267903125n, 95713534016100n, 149192241348150n, 167778253843200n,
  144479210475600n, 98571948595120n, 54288207893920n, 24302036238480n, 8797519772496n,
  2522665162368n, 546856133760n, 80951270400n, 6227020800n,
]; // imp-34975 baked BigInt literal
function arraysEqualBig(a, b) {
  return a.length === b.length && a.every((c, i) => c === b[i]);
}
const bakedLiteralsReproduce =
  arraysEqualBig(Ps[6], P6_KNOWN) && arraysEqualBig(Ps[14], P14_KNOWN);

const exactPositivityReverified =
  allMultipliersStrictlyPositive &&
  minSupportMultiplier >= NO_LEAK_MULTIPLIER_FLOOR &&
  minLeftMultiplier >= NO_LEAK_MULTIPLIER_FLOOR &&
  allCoeffsStrictlyPositive &&
  allRampValuesStrictlyPositive &&
  leadingMatchesFactorial &&
  constantMatchesDoubleFactorial &&
  bakedLiteralsReproduce;

export const IMP35107_CROSSOVER_DERIV_EXACT_BIGINT_POSITIVITY_TO_N20 = {
  id: 'imp-35107',
  proofSection: 'S-frontier',
  question:
    'The imp-35012 Bernstein-function classification of the inherited imp-33723 crossover map leans on ' +
    'the imp-34880 all-orders numerator-polynomial positivity induction, but that induction was only ' +
    'exercised (with hand literals / exact arithmetic) through roughly n = 12-16, and the imp-34880 ' +
    'table to n = 60 was in double precision (inexact from n = 16 per the imp-34975 2^53 ceiling). Does ' +
    'a from-source EXACT-BigInt recomputation of P_n out to n ~ 20 confirm both recurrence multipliers ' +
    'n and (2n-1-k) stay strictly positive on 0 <= k <= n-1 and P_n(u) > 0 for u > 0 at every order? ' +
    'Verification only on the surrogate map; changes no bound; NO QED.',
  target: 'n ~ 20 (generated exactly to n = 22 to bracket the window)',
  ordersGenerated: N_MAX,
  recurrence:
    'a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n), a_{-1}=0, a_n^(n)=0, P_2 = [1,1] (ascending u), all BigInt.',
  allMultipliersStrictlyPositive,
  minLeftMultiplier, // = 2 (min over n>=2 of n)
  minSupportMultiplier, // = 2 (min over n>=2, k<=n-1 of 2n-1-k, at k=n-1)
  noLeakMultiplierFloor: NO_LEAK_MULTIPLIER_FLOOR,
  allCoeffsStrictlyPositive,
  largestCoefficientExact: maxCoeff.toString(), // exact BigInt, past the n=16 2^53 double ceiling
  allRampValuesStrictlyPositive,
  rampPointsChecked: [1, 2, 3],
  leadingMatchesFactorial,
  constantMatchesDoubleFactorial,
  bakedLiteralsReproduce,
  exactPositivityReverified,
  finding: {
    E1_multipliers_positive:
      'Both recurrence multipliers are strictly positive over the support 0 <= k <= n-1 of P_n: the ' +
      'left n >= 2 and the right 2n-1-k >= n >= 2, with global floor ' +
      minSupportMultiplier +
      ' (the no-leak margin). No order in n = 2..' +
      N_MAX +
      ' has a non-positive multiplier.',
    E2_coefficients_positive:
      'Every coefficient a_k^(n) is a strictly positive exact integer for n = 2..' +
      N_MAX +
      ' (BigInt, exact at every order -- the largest coefficient ' +
      maxCoeff.toString() +
      ' sits well past the n = 16 2^53 double-precision ceiling imp-34975 located, yet is carried ' +
      'exactly here). So P_n has strictly positive coefficients at every order in the target window.',
    E3_ramp_positive:
      'P_n(u) > 0 for u > 0 confirmed exactly at u in {1,2,3} by BigInt Horner (each a sum of ' +
      'strictly positive terms); structurally, all-positive coefficients force P_n(u) > 0 for EVERY ' +
      'u > 0, so g^(n) keeps the definite sign (-1)^(n+1) with no interior zero on the ramp.',
    E4_closed_forms:
      'Leading a_{n-1}^(n) = (n-1)! and constant a_0^(n) = (2n-3)!! hold in exact BigInt at every ' +
      'order n = 2..' +
      N_MAX +
      ' (both strictly positive).',
    E5_baked_cross_check:
      'The from-source recurrence reproduces the independently-derived baked literals P_6 (imp-34880) ' +
      'and P_14 (imp-34975) EXACTLY (reproduce=' +
      bakedLiteralsReproduce +
      ').',
  },
  isRigorous: true, // exact arithmetic re-verification of the coefficient-positivity of THIS surrogate map
  rigorousScope:
    'EXACT-BigInt re-verification of the coefficient positivity (hence all-orders definite sign ' +
    '(-1)^(n+1)) of the derivatives of the INHERITED imp-3220/imp-3406 / imp-33723 SURROGATE ' +
    'crossover map ONLY, out to n = 22 (target n ~ 20), past both the n = 12 induction-exercise point ' +
    'and the n = 16 float exactness ceiling. Establishes NO RH-level result, NO operator positivity, ' +
    'and changes NO bound.',
  changesBound: false,
  verdict:
    'VERIFICATION (frontier-direction, surrogate-map lemma re-check in exact arithmetic). A from-source ' +
    'exact-BigInt recomputation of the numerator-polynomial triangle P_n via the imp-34880 recurrence ' +
    'a_k^(n+1) = n a_{k-1} + (2n-1-k) a_k out to n = 22 (target n ~ 20) confirms, with NO ' +
    'floating-point exposure, that both recurrence multipliers n and 2n-1-k stay strictly positive on ' +
    'the support 0 <= k <= n-1 (global floor 2), every coefficient is a strictly positive exact ' +
    'integer at every order (the largest, carried exactly, sits past the n = 16 2^53 double-precision ' +
    'ceiling imp-34975 located), and P_n(u) > 0 for u > 0 at the ramp points u in {1,2,3} -- so g^(n) ' +
    'keeps the definite sign (-1)^(n+1) with no interior zero. The two closed forms (leading (n-1)!, ' +
    'constant (2n-3)!!) hold in BigInt at every order and the baked P_6/P_14 literals reproduce ' +
    'exactly. This is the exact structural support the imp-35012 Bernstein-function classification ' +
    'requires, several orders past where the induction had actually been exercised. VERIFICATION ONLY ' +
    'on the INHERITED surrogate map: the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED; establishes no operator positivity; ' +
    'changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34880 (all-orders coefficient-positivity induction, in double); imp-34975 (2^53 exact-integer ' +
    'ceiling at n=16, baked P_13/P_14); imp-35012 (Bernstein-function classification leaning on all-n ' +
    'positivity); imp-33723 (crossover map g = K log T0); imp-2642/imp-2643 (C_C 1/8 ansatz); imp-486 ' +
    '(C_mb GUE-conditional).',
};

export const IMP35107_CROSSOVER_DERIV_EXACT_BIGINT_POSITIVITY_TO_N20_ASSERTIONS = [
  {
    // (E1): both recurrence multipliers strictly positive over the support of P_n at every order.
    id: 'imp35107-recurrence-multipliers-strictly-positive-to-n22',
    description:
      'both recurrence multipliers n and (2n-1-k) are strictly positive over the support 0 <= k <= ' +
      'n-1 of P_n for n = 2..22 (global floor 2), so the subtractive -u dP_n/du term never overpowers',
    holds: () =>
      allMultipliersStrictlyPositive &&
      minSupportMultiplier >= NO_LEAK_MULTIPLIER_FLOOR &&
      minLeftMultiplier >= NO_LEAK_MULTIPLIER_FLOOR,
  },
  {
    // (E2): every coefficient a strictly positive exact BigInt at every order (past the n=16 ceiling).
    id: 'imp35107-all-coefficients-strictly-positive-exact-bigint',
    description:
      'every P_n coefficient (n = 2..22) is a strictly positive exact BigInt integer, certified past ' +
      'the n = 16 2^53 double-precision ceiling with no rounding exposure',
    holds: () => allCoeffsStrictlyPositive,
  },
  {
    // (E3): P_n(u) > 0 at positive-integer ramp points, evaluated exactly.
    id: 'imp35107-ramp-values-strictly-positive',
    description:
      'P_n(u) > 0 for u > 0 confirmed exactly at u in {1,2,3} by BigInt Horner at every order n = ' +
      '2..22, so g^(n) has definite sign (-1)^(n+1) with no interior zero on the ramp',
    holds: () => allRampValuesStrictlyPositive,
  },
  {
    // (E4): the two extreme-coefficient closed forms in exact BigInt.
    id: 'imp35107-extreme-coefficient-closed-forms-bigint',
    description:
      'leading a_{n-1}^(n) = (n-1)! and constant a_0^(n) = (2n-3)!! hold in exact BigInt for all ' +
      'n = 2..22 (both strictly positive)',
    holds: () => leadingMatchesFactorial && constantMatchesDoubleFactorial,
  },
  {
    // (E5): the from-source recurrence reproduces the baked P_6 / P_14 literals exactly.
    id: 'imp35107-baked-literals-reproduce-exactly',
    description:
      'the from-source exact recurrence reproduces the independently-derived baked literals P_6 ' +
      '(imp-34880) and P_14 (imp-34975) exactly',
    holds: () => bakedLiteralsReproduce,
  },
  {
    // Aggregate: the exact-arithmetic positivity re-verification closes.
    id: 'imp35107-exact-positivity-reverified',
    description:
      'the exact-BigInt re-verification closes: multipliers positive + coefficients positive + ramp ' +
      'values positive + closed forms + baked cross-check => all-orders definite sign to n = 22',
    holds: () =>
      exactPositivityReverified &&
      IMP35107_CROSSOVER_DERIV_EXACT_BIGINT_POSITIVITY_TO_N20.exactPositivityReverified,
  },
  {
    // Honesty gate: surrogate-map verification, no operator positivity, changes no bound, no QED.
    id: 'imp35107-honesty-gate-no-qed',
    description:
      'verification scope is the surrogate-map derivative signs only: establishes no operator ' +
      'positivity, changes no bound, no QED, no refereed bound is changed',
    holds: () =>
      IMP35107_CROSSOVER_DERIV_EXACT_BIGINT_POSITIVITY_TO_N20.changesBound === false &&
      /NO QED/.test(IMP35107_CROSSOVER_DERIV_EXACT_BIGINT_POSITIVITY_TO_N20.verdict) &&
      /no operator positivity/.test(IMP35107_CROSSOVER_DERIV_EXACT_BIGINT_POSITIVITY_TO_N20.verdict) &&
      /refereed bound is changed/i.test(IMP35107_CROSSOVER_DERIV_EXACT_BIGINT_POSITIVITY_TO_N20.verdict) &&
      /surrogate/i.test(IMP35107_CROSSOVER_DERIV_EXACT_BIGINT_POSITIVITY_TO_N20.rigorousScope),
  },
];

for (const a of IMP35107_CROSSOVER_DERIV_EXACT_BIGINT_POSITIVITY_TO_N20_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35107-crossover-deriv-exact-bigint-positivity-to-n20 assertion failed: ${a.id}`,
    );
  }
}
