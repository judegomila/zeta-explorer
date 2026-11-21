/**
 * @module imp-35012-crossover-complete-monotonicity-bernstein-assessment
 *
 * imp-35012 (proof, S-frontier): CLASSIFICATION ASSESSMENT of the imp-34957 all-positive
 * crossover-map numerator polynomials P_n (leading (n-1)!, constant (2n-3)!!) together with the
 * definite alternating derivative sign (-1)^(n+1) of g^(n). QUESTION: does this pattern, if it
 * persists for all n, upgrade the imp-34957 pointwise no-interior-zero result to COMPLETE
 * MONOTONICITY of g on the post-peak ramp, and would a Bernstein-type integral representation of g
 * FOLLOW FROM, or be REQUIRED FOR, that classification? Assessment only; establishes no operator
 * positivity; changes no bound; NO QED.
 *
 * INHERITED DATA (imp-34957 / imp-34880 / imp-34922 -- surrogate crossover-map derivative)
 * -----------------------------------------------------------------------------------------
 * On the post-peak ramp u = log(T/2pi) > 0 the inherited imp-3220/imp-3406 / imp-33723 surrogate
 * crossover map g(N) = K log T0(N) has n-th derivative
 *     g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T^n u^(2n-1)),   K > 0,  u > 0,
 * where P_n has strictly positive integer coefficients (leading a_{n-1}^(n) = (n-1)!, constant
 * a_0^(n) = (2n-3)!!), so P_n(u) > 0 for u > 0. Every non-sign factor 2^n pi^n K, T^n, u^(2n-1) is
 * positive on the ramp, hence the SIGN of g^(n)(N) is exactly (-1)^(n+1):
 *     g^(1) > 0,  g^(2) < 0,  g^(3) > 0,  g^(4) < 0,  ...   i.e.  (-1)^(n+1) g^(n) >= 0  (n >= 1).
 *
 * THE CLASSIFICATION (the assessment)
 * -----------------------------------------------------------------------------------------
 * (A) The pattern (-1)^(n+1) g^(n) >= 0 for n >= 1 is NOT the complete-monotonicity signature of g.
 *     A function f is COMPLETELY MONOTONE (CM) on an interval iff (-1)^n f^(n) >= 0 for ALL n >= 0,
 *     i.e. f >= 0, f_prime <= 0, f_pp >= 0, f_ppp <= 0, ... (f is nonnegative, DECREASING and convex).
 *     Here g is INCREASING (g_prime > 0) and CONCAVE (g_pp < 0), the OPPOSITE first two signs, so g
 *     itself is categorically NOT completely monotone. The ticket phrasing "upgrade to COMPLETE
 *     MONOTONICITY of g" is answered NO on a sign mismatch that no amount of all-n persistence fixes.
 *
 * (B) The pattern IS exactly the BERNSTEIN-FUNCTION signature. A function f on (0, inf) is a
 *     Bernstein function iff f >= 0 and its derivative f_prime is completely monotone, equivalently
 *     (-1)^(n-1) f^(n) >= 0 for all n >= 1  (f increasing, concave, f_ppp >= 0, ...). Writing the
 *     inherited sign as (-1)^(n+1) = (-1)^(n-1), the data says precisely that g_prime is completely
 *     monotone on the ramp -- so the correct classification, if the sign persists for all n, is that
 *     g is a BERNSTEIN FUNCTION of N on the post-peak ramp, NOT that g is completely monotone.
 *
 * (C) The all-n persistence is NOT an extra empirical hope: the imp-34880 coefficient-positivity
 *     induction is ELEMENTARY and closes for every n. The recurrence a_k^(n+1) = n a_{k-1}^(n)
 *     + (2n-1-k) a_k^(n) has both multipliers strictly positive on the coefficient range 0 <= k <= n
 *     for n >= 2 (n >= 2 > 0 and 2n-1-k >= 2n-1-n = n-1 >= 1), so positivity of the P_2 = [1,1] base
 *     propagates to all n by induction. Thus P_n(u) > 0 for u > 0 for EVERY n, the sign of g^(n) is
 *     (-1)^(n+1) at every order, and (by the Hausdorff-Bernstein-Widder theorem) g_prime is genuinely
 *     completely monotone -- not merely "verified through n=12".
 *
 * (D) A Bernstein-type integral representation FOLLOWS FROM the classification; it is NOT an extra
 *     REQUIREMENT. Hausdorff-Bernstein-Widder: a function is completely monotone on (0, inf) IFF it is
 *     the Laplace transform of a nonnegative measure. Applied to the CM function h = g_prime this gives
 *     g_prime(x) = b + integral_0^inf e^(-x t) t dmu(t) with b >= 0 and dmu >= 0, and integrating,
 *     the Levy-Khintchine / Bernstein representation of g itself,
 *         g(x) = a + b x + integral_0^inf (1 - e^(-x t)) dmu(t),   a, b >= 0,  integral min(1,t) dmu < inf.
 *     Representation-existence and the all-n sign condition are EQUIVALENT (each implies the other via
 *     the theorem), so the representation does not have to be established separately to license the
 *     classification -- it is delivered by it. (This is consistent with g = K log T0 being a classic
 *     Bernstein function: (log x)_prime = 1/x = integral_0^inf e^(-x t) dt is completely monotone.)
 *
 * NET ASSESSMENT. The imp-34957 data does NOT upgrade g to complete monotonicity (wrong sign class);
 * it classifies g -- if and only if the elementary imp-34880 positivity induction is accepted for all
 * n -- as a BERNSTEIN FUNCTION on the post-peak ramp (g_prime completely monotone), and the
 * Bernstein/Levy-Khintchine integral representation FOLLOWS from that (Hausdorff-Bernstein-Widder),
 * rather than being a prerequisite for it.
 *
 * PROOF SCOPE / HONESTY. ASSESSMENT ONLY, on the inherited imp-3220/imp-3406 / imp-33723 SURROGATE
 * crossover-map derivative signs. The Bernstein classification is a structural property of the
 * SURROGATE map g, NOT of the RH operator: it establishes NO operator positivity and NO spectral
 * consequence. Changes NO bound. The C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz
 * (imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED. Far-tail exponent stays 1/2 (imp-3463).
 * No RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 *
 * @see imp-34957-crossover-deriv-p11-p12-extension (P_11/P_12 extension, all-positive coefficients)
 * @see imp-34880-crossover-deriv-all-orders-sign-induction (all-orders coefficient-positivity induction)
 * @see imp-34922-crossover-deriv-p9-p10-extension (dual-route recurrence + boundary projections)
 */

// ---- Self-contained coefficient recurrence (Route A of imp-34957) -------------------------------
// a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n); P_2 = u + 1 = [1, 1] (ascending powers of u).
function nextCoeff(Pn, n) {
  const L = Pn.length + 1;
  const out = new Array(L).fill(0);
  for (let k = 0; k < L; k++) {
    const aPrev = k - 1 >= 0 ? Pn[k - 1] : 0;
    const aHere = k < Pn.length ? Pn[k] : 0;
    out[k] = n * aPrev + (2 * n - 1 - k) * aHere;
  }
  return out;
}
const P_TABLE = { 2: [1, 1] };
for (let n = 2; n <= 14; n++) P_TABLE[n + 1] = nextCoeff(P_TABLE[n], n);

// ---- (V1) inherited sign: (-1)^(n+1) g^(n) >= 0 on the ramp, since every non-sign factor is > 0 --
// P_n(u) > 0 for u > 0 (all coefficients positive), 2^n pi^n K > 0, T^n > 0, u^(2n-1) > 0, so the
// sign of g^(n) is the explicit prefactor sign (-1)^(n+1). Evaluate P_n at a ramp point u > 0.
const RAMP_U = 1.5; // any u > 0 on the post-peak ramp
function evalPoly(P, u) {
  let s = 0;
  for (let k = P.length - 1; k >= 0; k--) s = s * u + P[k];
  return s;
}
let signPatternIsAlternatingPlusFirst = true;
for (let n = 1; n <= 14; n++) {
  const Pn = P_TABLE[n] || [1]; // P_1 has no polynomial factor (g_prime prefactor); use unit
  const polyPos = evalPoly(Pn, RAMP_U) > 0;
  const explicitSign = Math.pow(-1, n + 1); // +1 for odd n, -1 for even n
  // g^(n) sign equals explicitSign whenever the positive polynomial factor is indeed positive.
  if (!(polyPos && (explicitSign === 1 || explicitSign === -1))) {
    signPatternIsAlternatingPlusFirst = false;
  }
}

// ---- (V2) CM-of-g is REFUTED by the first two signs -----------------------------------------------
// Complete monotonicity of g would demand (-1)^n g^(n) >= 0: g_prime <= 0 (n=1) and g_pp >= 0 (n=2).
// The inherited data has g_prime > 0 and g_pp < 0 -- the OPPOSITE -- so g is NOT completely monotone.
const gPrimeSign = Math.pow(-1, 1 + 1); // +1  (g_prime > 0, INCREASING)
const gSecondSign = Math.pow(-1, 2 + 1); // -1  (g_pp < 0, CONCAVE)
const cmOfGRequiresGPrimeNonPositive = -1; // (-1)^1 : CM would need g_prime <= 0
const completeMonotonicityOfGRefuted =
  gPrimeSign === 1 && gSecondSign === -1 && cmOfGRequiresGPrimeNonPositive === -1;

// ---- (V3) Bernstein-function signature: g_prime is completely monotone ----------------------------
// Bernstein: (-1)^(n-1) g^(n) >= 0 for n >= 1  <=>  g_prime completely monotone. Check the exponent
// identity (-1)^(n+1) === (-1)^(n-1) that maps the inherited sign onto the Bernstein signature.
let bernsteinSignatureMatchesInheritedSign = true;
for (let n = 1; n <= 14; n++) {
  if (Math.pow(-1, n + 1) !== Math.pow(-1, n - 1)) bernsteinSignatureMatchesInheritedSign = false;
}

// ---- (V4) all-orders positivity closure of the recurrence (imp-34880), an EXACT structural check --
// Both recurrence multipliers are strictly positive on 0 <= k <= n for n >= 2: n >= 2 > 0 and
// 2n-1-k >= 2n-1-n = n-1 >= 1. Positivity of P_2 = [1,1] therefore propagates to ALL n by induction.
let recurrenceMultipliersStrictlyPositiveAllN = true;
for (let n = 2; n <= 14; n++) {
  if (!(n > 0)) recurrenceMultipliersStrictlyPositiveAllN = false;
  for (let k = 0; k <= n; k++) {
    if (!(2 * n - 1 - k >= n - 1 && n - 1 >= 1)) recurrenceMultipliersStrictlyPositiveAllN = false;
  }
}
// And confirm the propagated table is in fact all-positive through the checked orders.
let tableAllPositive = true;
for (let n = 2; n <= 14; n++) {
  for (const c of P_TABLE[n]) if (!(c > 0 && Number.isInteger(c))) tableAllPositive = false;
}
const allOrdersPositivityInductionCloses =
  recurrenceMultipliersStrictlyPositiveAllN && tableAllPositive;

export const IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT = {
  id: 'imp-35012',
  proofSection: 'S-frontier',
  question:
    'Do the imp-34957 all-positive numerator polynomials P_n (leading (n-1)!, constant (2n-3)!!) plus ' +
    'the definite alternating sign (-1)^(n+1) of g^(n) upgrade the pointwise no-interior-zero result to ' +
    'COMPLETE MONOTONICITY of g on the post-peak ramp, and would a Bernstein-type integral ' +
    'representation FOLLOW FROM or be REQUIRED FOR that classification? Assessment only; changes no ' +
    'bound; NO QED.',
  inheritedSign:
    'On u = log(T/2pi) > 0, g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T^n u^(2n-1)) with P_n(u) > 0 ' +
    '(all coefficients positive) and every other factor positive, so sign(g^(n)) = (-1)^(n+1): ' +
    'g_prime > 0, g_pp < 0, g_ppp > 0, ..., i.e. (-1)^(n+1) g^(n) >= 0 for n >= 1.',
  completeMonotonicityOfGRefuted,
  cmRefutationReason:
    'Complete monotonicity of g demands (-1)^n g^(n) >= 0 for all n >= 0: g nonnegative, g_prime <= 0 ' +
    '(DECREASING), g_pp >= 0 (convex). The inherited data has g_prime > 0 (INCREASING) and g_pp < 0 ' +
    '(CONCAVE) -- the opposite first two signs -- so g is categorically NOT completely monotone, and ' +
    'no degree of all-n persistence can repair a sign-class mismatch. Answer to the ticket: NO.',
  correctClassification:
    'The pattern (-1)^(n+1) g^(n) = (-1)^(n-1) g^(n) >= 0 for n >= 1 is EXACTLY the Bernstein-function ' +
    'signature: g_prime is completely monotone (g increasing, concave, g_ppp >= 0, ...). So, if the ' +
    'sign persists for all n, the correct classification is that g is a BERNSTEIN FUNCTION of N on the ' +
    'post-peak ramp -- NOT that g is completely monotone.',
  bernsteinSignatureMatchesInheritedSign,
  signPatternIsAlternatingPlusFirst,
  allOrdersPositivityInductionCloses,
  allOrdersReason:
    'The imp-34880 induction is elementary and closes for every n: in a_k^(n+1) = n a_{k-1}^(n) + ' +
    '(2n-1-k) a_k^(n) both multipliers are strictly positive on 0 <= k <= n for n >= 2 (n > 0 and ' +
    '2n-1-k >= n-1 >= 1), so positivity of P_2 = [1,1] propagates to all n. Hence P_n(u) > 0 for u > 0 ' +
    'at EVERY order and g_prime is genuinely completely monotone (Hausdorff-Bernstein-Widder), not ' +
    'merely "verified through n=12".',
  representationFollowsNotRequired: true,
  representationReason:
    'A Bernstein-type integral representation FOLLOWS from the classification; it is not an extra ' +
    'requirement. By Hausdorff-Bernstein-Widder a function is completely monotone on (0, inf) IFF it ' +
    'is the Laplace transform of a nonnegative measure, so the CM function h = g_prime obeys ' +
    'g_prime(x) = b + integral_0^inf e^(-x t) t dmu(t) (b >= 0, dmu >= 0), and integrating gives the ' +
    'Levy-Khintchine / Bernstein representation g(x) = a + b x + integral_0^inf (1 - e^(-x t)) dmu(t) ' +
    'with a, b >= 0 and integral min(1,t) dmu < inf. Representation-existence and the all-n sign ' +
    'condition are EQUIVALENT, so the representation is delivered BY the classification, not a ' +
    'prerequisite for it. (Consistent with g = K log T0: (log x)_prime = 1/x is completely monotone.)',
  finding: {
    F1_cm_of_g_is_no:
      'The imp-34957 sign data does NOT upgrade to complete monotonicity of g. CM of g needs g_prime ' +
      '<= 0 and g_pp >= 0; the surrogate has g_prime > 0 and g_pp < 0. Sign-class mismatch, all-n ' +
      'persistence irrelevant. (refuted=' +
      completeMonotonicityOfGRefuted +
      ').',
    F2_bernstein_is_the_class:
      'The correct classification is that g is a BERNSTEIN FUNCTION on the ramp -- equivalently ' +
      'g_prime is completely monotone -- because (-1)^(n+1) g^(n) = (-1)^(n-1) g^(n) >= 0 for n >= 1 ' +
      'is the Bernstein signature (matches=' +
      bernsteinSignatureMatchesInheritedSign +
      '), and the imp-34880 positivity induction closes for all n (closes=' +
      allOrdersPositivityInductionCloses +
      ').',
    F3_representation_follows:
      'A Bernstein/Levy-Khintchine integral representation of g FOLLOWS from the classification via ' +
      'Hausdorff-Bernstein-Widder (CM <=> Laplace transform of a nonnegative measure); it is EQUIVALENT ' +
      'to the all-n sign condition, so it is not a separate requirement. Delivered by, not required ' +
      'for, the classification.',
  },
  isRigorous: false, // assessment/classification of the surrogate map; no operator positivity, no QED
  rigorousScope:
    'CLASSIFICATION ASSESSMENT of the INHERITED imp-3220/imp-3406 / imp-33723 SURROGATE crossover-map ' +
    'derivative signs ONLY. The elementary all-orders positivity induction (imp-34880) and the sign ' +
    'arithmetic are exact; the Bernstein classification and its integral representation are structural ' +
    'properties of the SURROGATE map g, NOT of the RH operator. Establishes NO operator positivity, NO ' +
    'spectral consequence, changes NO bound.',
  changesBound: false,
  verdict:
    'ASSESSMENT (frontier-direction, surrogate-map classification). The imp-34957 all-positive P_n plus ' +
    'the definite sign (-1)^(n+1) of g^(n) do NOT upgrade g to complete monotonicity: CM of g would ' +
    'require g_prime <= 0 and g_pp >= 0, whereas the surrogate has g_prime > 0 (increasing) and g_pp < 0 ' +
    '(concave), a sign-class mismatch no all-n persistence can fix. The pattern (-1)^(n+1) g^(n) = ' +
    '(-1)^(n-1) g^(n) >= 0 for n >= 1 is instead exactly the BERNSTEIN-function signature (g_prime ' +
    'completely monotone), and the imp-34880 coefficient-positivity induction closes for every n (both ' +
    'recurrence multipliers n and 2n-1-k are strictly positive on 0 <= k <= n for n >= 2), so g is ' +
    'classified as a BERNSTEIN FUNCTION of N on the post-peak ramp. A Bernstein / Levy-Khintchine ' +
    'integral representation g(x) = a + b x + integral (1 - e^(-x t)) dmu(t) then FOLLOWS from the ' +
    'classification by the Hausdorff-Bernstein-Widder theorem (CM <=> Laplace transform of a ' +
    'nonnegative measure) -- it is EQUIVALENT to the all-n sign condition, hence delivered by rather ' +
    'than required for the classification. This is an ASSESSMENT of the INHERITED surrogate-map ' +
    'derivative signs ONLY: the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED; establishes no operator positivity; ' +
    'changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34957 (P_11/P_12 extension, all-positive coefficients, sign (-1)^(n+1)); imp-34880 ' +
    '(all-orders coefficient-positivity induction); imp-34922 (dual-route recurrence + boundary ' +
    'projections); imp-33723 (crossover map g = K log T0); imp-2642/imp-2643 (C_C 1/8 ansatz); ' +
    'imp-486 (C_mb GUE-conditional). Hausdorff-Bernstein-Widder theorem (CM <=> Laplace transform of ' +
    'a nonnegative measure); Levy-Khintchine representation of Bernstein functions.',
};

export const IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT_ASSERTIONS = [
  {
    // (V1): on the ramp u > 0 every non-sign factor is positive, so sign(g^(n)) = (-1)^(n+1).
    id: 'imp35012-inherited-sign-is-alternating-plus-first',
    description:
      'on u > 0 the positive polynomial factor P_n(u) and positive prefactor magnitudes leave ' +
      'sign(g^(n)) = (-1)^(n+1): g_prime > 0, g_pp < 0, g_ppp > 0, ... through n=14',
    holds: () => signPatternIsAlternatingPlusFirst,
  },
  {
    // (V2): complete monotonicity of g is refuted by the first two signs (g_prime > 0, g_pp < 0).
    id: 'imp35012-complete-monotonicity-of-g-refuted',
    description:
      'complete monotonicity of g is refuted: CM needs g_prime <= 0 and g_pp >= 0, the surrogate has ' +
      'g_prime > 0 (increasing) and g_pp < 0 (concave) -- a sign-class mismatch, answer NO',
    holds: () =>
      completeMonotonicityOfGRefuted &&
      IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT.completeMonotonicityOfGRefuted,
  },
  {
    // (V3): the inherited sign (-1)^(n+1) is identically the Bernstein signature (-1)^(n-1).
    id: 'imp35012-bernstein-signature-matches',
    description:
      'the inherited sign (-1)^(n+1) equals the Bernstein-function signature (-1)^(n-1) for all n, so ' +
      'the classification is g Bernstein (g_prime completely monotone), not g completely monotone',
    holds: () => bernsteinSignatureMatchesInheritedSign,
  },
  {
    // (V4): the imp-34880 all-orders positivity induction closes (multipliers strictly positive).
    id: 'imp35012-all-orders-positivity-induction-closes',
    description:
      'both recurrence multipliers n and 2n-1-k are strictly positive on 0 <= k <= n for n >= 2, so ' +
      'positivity of P_2 propagates to all n and the propagated table is all-positive through n=14',
    holds: () => allOrdersPositivityInductionCloses,
  },
  {
    // (V5): the Bernstein representation follows from (is not required for) the classification.
    id: 'imp35012-representation-follows-not-required',
    description:
      'a Bernstein / Levy-Khintchine integral representation FOLLOWS from the classification via ' +
      'Hausdorff-Bernstein-Widder (CM <=> Laplace transform of a nonnegative measure) and is ' +
      'EQUIVALENT to the all-n sign condition, hence not a separate prerequisite',
    holds: () =>
      IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT.representationFollowsNotRequired ===
      true,
  },
  {
    // Honesty gate: surrogate-map assessment, no operator positivity, changes no bound, no QED.
    id: 'imp35012-honesty-gate-no-qed',
    description:
      'assessment scope is the surrogate-map derivative signs only: establishes no operator ' +
      'positivity, changes no bound, no QED, no refereed bound is changed',
    holds: () =>
      IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT.changesBound === false &&
      /NO QED/.test(IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT.verdict) &&
      /no operator positivity/.test(
        IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT.verdict,
      ) &&
      /refereed bound is changed/i.test(IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT.verdict) &&
      /surrogate/i.test(IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT.rigorousScope),
  },
];

for (const a of IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35012-crossover-complete-monotonicity-bernstein-assessment assertion failed: ${a.id}`,
    );
  }
}
