/**
 * @module imp-35068-crossover-triangle-ramanujan-polynomial-identification
 *
 * imp-35068 (numerical, S-frontier): IDENTIFIES the imp-34957/imp-34922 crossover-map
 * numerator-polynomial coefficient triangle a_k^(n) as a KNOWN combinatorial object -- the
 * (reversed) RAMANUJAN POLYNOMIAL triangle -- and records the generating-function / combinatorial
 * closed form that this identification supplies.
 *
 * BACKGROUND. imp-34922/imp-34957/imp-34975 tabulated the numerator polynomials P_n(u) of the
 * inherited imp-33723 surrogate crossover-map derivative
 *     g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T^n u^(2n-1)),   u = log(T/2pi)
 * as coefficient rows a_k^(n) (ascending powers of u), with the interior recurrence
 *     a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n),
 * closed forms only for the two EXTREME coefficients (leading a_{n-1}^(n) = (n-1)!, constant
 * a_0^(n) = (2n-3)!!), and imp-34974 later added the row-sum P_n(1) = n^(n-1) (called
 * "Cayley-type") and the subleading a_{n-2}^(n) = (n-1)(n-1)!. Nobody had asked whether the FULL
 * interior triangle is a NAMED combinatorial triangle. This module answers that: it is.
 *
 * IDENTIFICATION (the answer to imp-35068)
 * ----------------------------------------
 * The a_k^(n) triangle is the coefficient triangle of the RAMANUJAN POLYNOMIALS R_n(x), READ IN
 * REVERSE. The Ramanujan polynomials are the classical family (Ramanujan; Berndt-Evans-Wilson;
 * Shor; Zeng 1998) defined by the operator recurrence
 *     R_1(x) = 1,      R_(n+1)(x) = n (1 + x) R_n(x) + x^2 dR_n/dx.
 * Writing R_n(x) = sum_j r_j^(n) x^j (ascending in x), the identification is
 *     P_n(u) = u^(n-1) R_n(1/u),   equivalently   a_k^(n) = r_(n-1-k)^(n)
 * i.e. the P_n coefficient row is the R_n coefficient row reversed. This module GENERATES R_n
 * INDEPENDENTLY from the classical n(1+x)R_n + x^2 dR_n/dx recurrence (structurally unrelated to
 * the imp-34957 route) and verifies coefficient-for-coefficient in EXACT integer arithmetic that
 * reverse(R_n) == P_n for every n = 2..12.
 *
 * WHAT THE IDENTIFICATION SUPPLIES (closed forms that were previously ad hoc)
 * --------------------------------------------------------------------------
 *  - GENERATING FUNCTION / COMBINATORIAL MEANING. The Ramanujan polynomials REFINE Cayley: R_n(x)
 *    enumerates rooted labeled forests/trees on n vertices by a statistic (Zeng: number of
 *    "improper edges"), so R_n(1) = n^(n-1) is exactly Cayley (rooted labeled trees, OEIS A000169).
 *    Their exponential generating function is expressible through the TREE FUNCTION
 *    T(z) = sum_(n>=1) n^(n-1) z^n / n! = -W(-z) (Lambert W), which is the closed-form generating
 *    object imp-34974 lacked a name for. The triangle itself is the classical Ramanujan-polynomial
 *    triangle (cf. OEIS A054589).
 *  - THE TWO EXTREME CLOSED FORMS ARE THE RAMANUJAN BOUNDARY VALUES. Under the reversal, the P_n
 *    leading a_(n-1)^(n) = (n-1)! is the R_n CONSTANT term r_0^(n) = (n-1)!, and the P_n constant
 *    a_0^(n) = (2n-3)!! is the R_n LEADING term r_(n-1)^(n) = (2n-3)!!. Both are standard for the
 *    Ramanujan polynomials, so the imp-34922 boundary closed forms are not coincidences but the two
 *    ends of a named triangle.
 *  - ROW SUM. P_n(1) = R_n(1) = n^(n-1) (OEIS A000169), IDENTIFYING imp-34974s "Cayley-type" row
 *    sum as the actual rooted-labeled-tree count that Ramanujan-polynomial theory delivers.
 *  - ALTERNATING SUM. P_n(-1) = (-1)^(n-1) R_n(-1). Computed exactly: 0, 1, 2, 13, 74, 593, 5298,
 *    55781, 659722, 8745185, 127941538 for n = 2..12 (the unsigned Ramanujan values |R_n(-1)|),
 *    pinning the alternating-sum sequence the ticket asked to characterize.
 *
 * PROOF SCOPE / HONESTY. IDENTIFICATION/CHARACTERIZATION of a combinatorial triangle attached
 * to the derivatives of the INHERITED imp-3220/imp-3406 / imp-33723 surrogate crossover map. This
 * module verifies the match numerically (exact integer arithmetic, dual independent recurrences)
 * n = 2..12. UPGRADE 2026-08-28: the identification and both formerly-open conjectures are now
 * KERNEL-VERIFIED UNCONDITIONAL THEOREMS for all n (Lean 4, standard axioms, independently
 * faithfulness-reviewed): theorem_1_reversal (P_n = reversed R_n), theorem_2_ramanujan_value
 * (R_n(1) = n^(n-1), proved FROM SCRATCH via Abel's binomial theorem + the tree-function ODE in
 * Q[[X]] — machinery mathlib lacks), corollary_1_row_sum, corollary_2_subleading
 * (a_{n-2}^{(n)} = (n-1)(n-1)!). See formalization/lean-aristotle/ramanujan_reversal/.
 * (Proof direction: corollary_1 is proved directly from the tree series; theorem_2 follows via
 * the reversal.) Establishes NO
 * RH-level result, NO operator positivity, and changes NO bound. The C_mb GUE-conditional per
 * imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED. No RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34957-crossover-deriv-p11-p12-extension (the P_11/P_12 triangle being identified)
 * @see imp-34974-crossover-boundary-projection-recurrence-derivation (the "Cayley-type" row sum n^(n-1))
 * @see imp-34922-crossover-deriv-p9-p10-extension (the boundary closed forms (n-1)! and (2n-3)!!)
 */

// ---- P_n triangle via the imp-34957 pre-solved coefficient recurrence (ascending powers of u) ----
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
const P = { 2: [1, 1] };
for (let n = 2; n <= 11; n++) P[n + 1] = nextCoeffRoute(P[n], n);

// ---- Ramanujan polynomials R_n(x) via the CLASSICAL operator recurrence (independent route) ------
// R_1 = 1;  R_(n+1)(x) = n (1 + x) R_n(x) + x^2 dR_n/dx.  Coefficient arrays ascending in x.
const polyMul = (a, b) => {
  const r = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) r[i + j] += a[i] * b[j];
  return r;
};
const polyAdd = (a, b) => {
  const L = Math.max(a.length, b.length);
  const r = new Array(L).fill(0);
  for (let i = 0; i < a.length; i++) r[i] += a[i];
  for (let i = 0; i < b.length; i++) r[i] += b[i];
  return r;
};
const polyDeriv = (a) => {
  const r = [];
  for (let k = 1; k < a.length; k++) r.push(k * a[k]);
  return r.length ? r : [0];
};
const trimTrailingZeros = (a) => {
  let end = a.length;
  while (end > 1 && a[end - 1] === 0) end--;
  return a.slice(0, end);
};
const R = { 1: [1] };
for (let n = 1; n <= 11; n++) {
  // n(1+x)R_n : multiply R_n by the linear factor [n, n] (= n + n x)
  const term1 = polyMul([n, n], R[n]);
  // x^2 dR_n/dx : multiply the derivative by [0, 0, 1] (= x^2)
  const term2 = polyMul([0, 0, 1], polyDeriv(R[n]));
  R[n + 1] = trimTrailingZeros(polyAdd(term1, term2));
}

const arraysEqual = (a, b) => a.length === b.length && a.every((c, i) => c === b[i]);

// ---- (V1) IDENTIFICATION: reverse(R_n) == P_n for every n = 2..12 (exact integer arithmetic) -----
let reversedRamanujanMatchesTriangleThroughN12 = true;
for (let n = 2; n <= 12; n++) {
  if (!arraysEqual(R[n].slice().reverse(), P[n])) {
    reversedRamanujanMatchesTriangleThroughN12 = false;
  }
}

// ---- (V2) the two Ramanujan boundary values ARE the imp-34922 extreme closed forms ---------------
// Under reversal: R_n constant r_0^(n) = (n-1)! (= P_n leading); R_n leading r_(n-1)^(n) = (2n-3)!!
// (= P_n constant).
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
let ramanujanConstantIsFactorialThroughN12 = true; // r_0^(n) = (n-1)!
let ramanujanLeadingIsDoubleFactorialThroughN12 = true; // r_(n-1)^(n) = (2n-3)!!
for (let n = 2; n <= 12; n++) {
  if (R[n][0] !== factorial(n - 1)) ramanujanConstantIsFactorialThroughN12 = false;
  if (R[n][R[n].length - 1] !== oddDoubleFactorial(2 * n - 3)) {
    ramanujanLeadingIsDoubleFactorialThroughN12 = false;
  }
}

// ---- (V3) ROW SUM identified: P_n(1) = R_n(1) = n^(n-1) (OEIS A000169, rooted labeled trees) -----
let rowSumIsCayleyThroughN12 = true;
const rowSums = [];
for (let n = 2; n <= 12; n++) {
  const rs = P[n].reduce((a, b) => a + b, 0);
  rowSums.push(rs);
  if (rs !== Math.pow(n, n - 1)) rowSumIsCayleyThroughN12 = false;
}
// n^(n-1) stays below 2^53 through n = 12 (12^11 ~ 7.43e11), so the row sums are exact integers.
const rowSumsExactThroughN12 = Math.pow(12, 11) < Number.MAX_SAFE_INTEGER;

// ---- (V4) ALTERNATING SUM characterized: P_n(-1) = (-1)^(n-1) R_n(-1) ----------------------------
const alternatingSums = [];
let alternatingSumMatchesRamanujanThroughN12 = true;
for (let n = 2; n <= 12; n++) {
  const altP = P[n].reduce((acc, c, i) => acc + c * (i % 2 ? -1 : 1), 0);
  alternatingSums.push(altP);
  const Rm1 = R[n].reduce((acc, c, i) => acc + c * (i % 2 ? -1 : 1), 0); // R_n(-1)
  if (altP !== Math.pow(-1, n - 1) * Rm1) alternatingSumMatchesRamanujanThroughN12 = false;
}
// Baked reference literal for the alternating-sum sequence (= |R_n(-1)|), n = 2..12.
const ALTERNATING_SUM_SEQUENCE = [0, 1, 2, 13, 74, 593, 5298, 55781, 659722, 8745185, 127941538];
const alternatingSumMatchesBakedLiteral = arraysEqual(alternatingSums, ALTERNATING_SUM_SEQUENCE);

const identificationPasses =
  reversedRamanujanMatchesTriangleThroughN12 &&
  ramanujanConstantIsFactorialThroughN12 &&
  ramanujanLeadingIsDoubleFactorialThroughN12 &&
  rowSumIsCayleyThroughN12 &&
  rowSumsExactThroughN12 &&
  alternatingSumMatchesRamanujanThroughN12 &&
  alternatingSumMatchesBakedLiteral;

export const IMP35068_CROSSOVER_TRIANGLE_RAMANUJAN_IDENTIFICATION = {
  id: 'imp-35068',
  proofSection: 'S-frontier',
  question:
    'Is the imp-34957 crossover-map numerator-polynomial coefficient triangle a_k^(n) a KNOWN ' +
    'combinatorial triangle, and if so what generating-function / closed form does that supply? ' +
    'Identification/characterization on the inherited surrogate map; changes no bound; NO QED.',
  identification:
    'YES -- the a_k^(n) triangle is the RAMANUJAN POLYNOMIAL coefficient triangle READ IN REVERSE. ' +
    'With R_1(x)=1 and R_(n+1)(x)=n(1+x)R_n(x)+x^2 dR_n/dx (classical Ramanujan recurrence), one has ' +
    'P_n(u)=u^(n-1) R_n(1/u), i.e. a_k^(n)=r_(n-1-k)^(n). Verified coefficient-for-coefficient in ' +
    'exact integer arithmetic n=2..12 by generating R_n independently from the classical recurrence.',
  ramanujanRecurrence: 'R_1(x)=1;  R_(n+1)(x) = n (1 + x) R_n(x) + x^2 dR_n/dx',
  reversalMap: 'P_n(u) = u^(n-1) R_n(1/u);  a_k^(n) = r_(n-1-k)^(n)  (row reversal)',
  reversedRamanujanMatchesTriangleThroughN12,
  boundaryValues: {
    ramanujanConstantIsFactorialThroughN12, // r_0^(n) = (n-1)! = P_n leading
    ramanujanLeadingIsDoubleFactorialThroughN12, // r_(n-1)^(n) = (2n-3)!! = P_n constant
    summary:
      'The imp-34922 extreme closed forms are the two ENDS of the Ramanujan triangle: R_n constant ' +
      'r_0^(n)=(n-1)! (= P_n leading a_(n-1)^(n)) and R_n leading r_(n-1)^(n)=(2n-3)!! (= P_n ' +
      'constant a_0^(n)), verified n=2..12.',
  },
  rowSum: {
    rowSumIsCayleyThroughN12,
    rowSumsExactThroughN12,
    sequence: rowSums, // 2, 9, 64, ..., 12^11
    closedForm:
      'P_n(1) = R_n(1) = n^(n-1) (OEIS A000169, rooted labeled trees; Cayley). Identifies the ' +
      'imp-34974 "Cayley-type" row sum as the rooted-labeled-tree count from Ramanujan-polynomial theory.',
  },
  alternatingSum: {
    alternatingSumMatchesRamanujanThroughN12,
    alternatingSumMatchesBakedLiteral,
    sequence: alternatingSums, // 0, 1, 2, 13, 74, 593, 5298, 55781, 659722, 8745185, 127941538
    closedForm:
      'P_n(-1) = (-1)^(n-1) R_n(-1); the unsigned values |R_n(-1)| are 0,1,2,13,74,593,5298,55781,' +
      '659722,8745185,127941538 for n=2..12.',
  },
  generatingFunctionNote:
    'Ramanujan polynomials REFINE Cayley: R_n(x) enumerates rooted labeled forests/trees by a ' +
    'statistic (Zeng 1998, number of improper edges), R_n(1)=n^(n-1). Their EGF is carried by the ' +
    'tree function T(z)=sum n^(n-1) z^n/n! = -W(-z) (Lambert W) -- the closed-form generating object ' +
    'the earlier ad hoc tabulation lacked a name for. Triangle cf. OEIS A054589; row sums OEIS A000169.',
  identificationPasses,
  isRigorous: true, // exact integer arithmetic n=2..12 in THIS module; 2026-08-28 UPGRADE: the reversal identity P_n(u) = u^{n-1} R_n(1/u), the row sum P_n(1) = n^{n-1}, AND the subleading a_{n-2}^{(n)} = (n-1)(n-1)! are now KERNEL-VERIFIED UNCONDITIONAL THEOREMS for all n (Lean 4, standard axioms only, independently faithfulness-reviewed) — see formalization/lean-aristotle/ramanujan_reversal/ (theorem_1_reversal, theorem_2_ramanujan_value, corollary_1_row_sum, corollary_2_subleading; Abel's binomial theorem + the tree-function ODE proved from scratch en route)
  rigorousScope:
    'IDENTIFICATION of the numerator-polynomial coefficient triangle of the INHERITED imp-3220/' +
    'imp-3406 / imp-33723 surrogate crossover map as the (reversed) Ramanujan polynomial triangle. ' +
    'The match is verified numerically (exact integers, dual independent recurrences) n=2..12; the ' +
    'generating-function / rooted-tree statements are standard Ramanujan-polynomial theory, cited not ' +
    're-proved. Establishes NO RH-level result, NO operator positivity, changes NO bound.',
  changesBound: false,
  verdict:
    'IDENTIFICATION (frontier-direction, surrogate-map combinatorics). The imp-34957/imp-34922 ' +
    'crossover-map numerator-polynomial coefficient triangle a_k^(n) IS the classical RAMANUJAN ' +
    'POLYNOMIAL triangle read in reverse: with R_1=1, R_(n+1)(x)=n(1+x)R_n(x)+x^2 dR_n/dx, one has ' +
    'P_n(u)=u^(n-1) R_n(1/u), verified coefficient-for-coefficient in exact integer arithmetic ' +
    'n=2..12 against an INDEPENDENTLY generated Ramanujan recurrence. This names the object: the two ' +
    'imp-34922 extreme closed forms are the two ends of the Ramanujan triangle ((n-1)! constant and ' +
    '(2n-3)!! leading of R_n), the imp-34974 "Cayley-type" row sum P_n(1)=n^(n-1) is IDENTIFIED as ' +
    'the rooted-labeled-tree count (OEIS A000169) that Ramanujan-polynomial theory delivers, and the ' +
    'generating function is the tree function T(z)=-W(-z) refining Cayley (Zeng 1998). The ' +
    'alternating sum is P_n(-1)=(-1)^(n-1)R_n(-1) = 0,1,2,13,74,593,5298,55781,659722,8745185,' +
    '127941538 for n=2..12. This is an IDENTIFICATION of a combinatorial triangle attached to the ' +
    'INHERITED surrogate-map derivatives ONLY: the C_mb GUE-conditional per imp-486, the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are UNTOUCHED; establishes no operator ' +
    'positivity; changes no bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34957 (P_11/P_12 triangle extension); imp-34974 ("Cayley-type" row sum n^(n-1), subleading ' +
    '(n-1)(n-1)!); imp-34922 (boundary closed forms (n-1)! and (2n-3)!!); imp-33723 (crossover map ' +
    'g(N)=K log T0(N)); imp-2642/imp-2643 (C_C 1/8 ansatz); imp-486 (C_mb GUE-conditional). ' +
    'External: Ramanujan polynomials (Berndt-Evans-Wilson; Shor 1995; Zeng 1998); OEIS A054589 ' +
    '(Ramanujan-polynomial triangle), OEIS A000169 (n^(n-1), rooted labeled trees).',
};

export const IMP35068_CROSSOVER_TRIANGLE_RAMANUJAN_IDENTIFICATION_ASSERTIONS = [
  {
    // (V1): the IDENTIFICATION -- reverse(R_n) == P_n for every n = 2..12.
    id: 'imp35068-reversed-ramanujan-matches-triangle',
    description:
      'the a_k^(n) triangle equals the reversed Ramanujan polynomial triangle: reverse(R_n) == P_n ' +
      'for n=2..12, with R_n generated independently from R_(n+1)=n(1+x)R_n+x^2 dR_n/dx',
    holds: () => reversedRamanujanMatchesTriangleThroughN12,
  },
  {
    // (V2): the two extreme closed forms are the Ramanujan boundary values.
    id: 'imp35068-ramanujan-boundary-values',
    description:
      'the imp-34922 extreme closed forms are the Ramanujan boundary values: R_n constant = (n-1)! ' +
      'and R_n leading = (2n-3)!!, n=2..12',
    holds: () =>
      ramanujanConstantIsFactorialThroughN12 && ramanujanLeadingIsDoubleFactorialThroughN12,
  },
  {
    // (V3): row sum identified as Cayley / OEIS A000169.
    id: 'imp35068-row-sum-cayley-a000169',
    description:
      'the row sum P_n(1)=R_n(1)=n^(n-1) (OEIS A000169, rooted labeled trees), verified exactly n=2..12',
    holds: () => rowSumIsCayleyThroughN12 && rowSumsExactThroughN12,
  },
  {
    // (V4): alternating sum characterized and matches the baked literal.
    id: 'imp35068-alternating-sum-characterized',
    description:
      'the alternating sum P_n(-1)=(-1)^(n-1)R_n(-1) matches the baked sequence ' +
      '0,1,2,13,74,593,5298,55781,659722,8745185,127941538 (n=2..12)',
    holds: () =>
      alternatingSumMatchesRamanujanThroughN12 && alternatingSumMatchesBakedLiteral,
  },
  {
    // Aggregate: the identification closes end-to-end.
    id: 'imp35068-identification-passes',
    description:
      'the identification closes: reversed-Ramanujan match + boundary values + Cayley row sum + ' +
      'alternating-sum characterization',
    holds: () =>
      identificationPasses &&
      IMP35068_CROSSOVER_TRIANGLE_RAMANUJAN_IDENTIFICATION.identificationPasses,
  },
  {
    // Honesty gate: identification scope only, changes no bound, no QED, no refereed bound is changed.
    id: 'imp35068-honesty-gate-no-qed',
    description:
      'identification scope is the surrogate-map triangle combinatorics only: changes no bound, no ' +
      'QED, no refereed bound is changed',
    holds: () =>
      IMP35068_CROSSOVER_TRIANGLE_RAMANUJAN_IDENTIFICATION.changesBound === false &&
      /NO QED/.test(IMP35068_CROSSOVER_TRIANGLE_RAMANUJAN_IDENTIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP35068_CROSSOVER_TRIANGLE_RAMANUJAN_IDENTIFICATION.verdict) &&
      /surrogate/.test(IMP35068_CROSSOVER_TRIANGLE_RAMANUJAN_IDENTIFICATION.rigorousScope),
  },
];

for (const a of IMP35068_CROSSOVER_TRIANGLE_RAMANUJAN_IDENTIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35068-crossover-triangle-ramanujan-polynomial-identification assertion failed: ${a.id}`
    );
  }
}
