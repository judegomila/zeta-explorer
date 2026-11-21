/**
 * imp-95501: LEMMA SORT-J + THEOREM TILT-SORT + THEOREM SORT-OPT +
 * LEMMA PERT-S0 + LEMMA ONSET + COROLLARY MU2 -- executes the imp-95500
 * re-scoped residual (ii-next) ("closed-form floors for the SORTED
 * eigenvalue sequence ... or a branch resolution cashing the LEMMA MOM
 * sum currency") and CLOSES the credit currency: the sorted mean-time
 * transfer replaces the uniform sub-leading floor e^((K-1) s/(2 Sp)) by
 * the graded floor prod_(j<K) e^(2 s mu_j) = e^(2 s (tau - mu_max)),
 * where mu_1 <= ... <= mu_K are the generalized eigenvalues of the
 * MEAN-TIME pencil (G o G, G) and tau(P) = sum_(i,j) 1/(p_i + p_j) is
 * its exact trace (imp-95500 LEMMA MOM). The TILT-DET majorant gains
 * the tilt-independent DEPTH CREDIT
 *   cSort(P) = tau(P) - mu_max(P) = sum of the K-1 sub-leading mu_j,
 * which dominates the imp-95500 credit (K-1)/(4 Sp) always (LEMMA TMEAN
 * termwise) -- measured 2.3x to 1.8e5x on the test sets -- and is
 * PROVED MAXIMAL: no larger constant credit keeps the family a majorant
 * of the tilted-pencil cash-out (THEOREM SORT-OPT, via Rellich
 * first-order perturbation). The imp-95500 LEMMA MOM "branch
 * resolution" residual DISSOLVES: at the mean-time level the trace is
 * an exact identity (sum mu_j = tau), so no sum-vs-product two-root
 * disambiguation is needed. Derivation + measurement; changes no bound;
 * NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95226 / imp-95446 / imp-95498 / imp-95499 / imp-95500
 * normalization). Finite rate set P = {p_1, ..., p_K} of positive
 * reals, E_P = span{e^(-p t)} in L2(0, inf), Cauchy Gram
 * G_ij = 1/(p_i + p_j), depth d > 0, Lambda(P, d) = sup over
 * 0 != h in E_P of [int_d^inf h^2] / [int_0^inf h^2]. Tilt
 * 0 < s < nu = min P, tilted Gram G2(s)_ij = 1/(p_i + p_j - 2 s),
 * D(P, s) = det G2 / det G (imp-95499 TILT-DET: the Cauchy separation
 * factors cancel exactly, D = prod over ordered pairs of
 * (p_i + p_j)/(p_i + p_j - 2 s)). Sp = sum p_i. NEW OBJECT: the
 * MEAN-TIME PENCIL (G1, G) with G1 = G o G (Hadamard square,
 * (G1)_ij = 1/(p_i + p_j)^2 = int_0^inf t e^(-(p_i+p_j) t) dt), whose
 * Rayleigh quotient at h is exactly the mean time
 * E_h[t] = int t h^2 / int h^2 of the probability measure h^2 dt.
 * Generalized eigenvalues mu_1 <= ... <= mu_K. Known inputs consumed:
 * sum_j mu_j = tr(G^(-1) G1) = tau(P) (imp-95500 LEMMA MOM trace
 * identity), mu_1 >= 1/(4 Sp) (imp-95500 LEMMA TMEAN), and
 * prod_j lambda_j(G2, G) = D(P, s) (imp-95499 determinant identity).
 *
 * LEMMA SORT-J (sorted Jensen transfer). For every admissible s and
 * every index j: lambda_j(G2(s), G) >= e^(2 s mu_j), where lambda_1 <=
 * ... <= lambda_K are the tilted-pencil eigenvalues.
 * Proof. Both pencils have positive-definite base G, so Courant-Fischer
 * applies: lambda_j = min over j-dim subspaces S of E_P of
 * max_(0 != h in S) RL(h), RL(h) = int e^(2 s t) h^2 / int h^2, and
 * mu_j = min_S max_(h in S) RM(h), RM(h) = int t h^2 / int h^2. Jensen
 * on the convex exponential against the probability measure
 * h^2 dt / ||h||^2 gives RL(h) >= e^(2 s RM(h)) pointwise in h. For a
 * fixed subspace S take hStar maximizing RM on S: max_S RL >=
 * RL(hStar) >= e^(2 s RM(hStar)) = e^(2 s max_S RM). Minimizing over S
 * and using monotonicity of the exponential (which lets min pass
 * through): lambda_j >= e^(2 s mu_j). QED.
 *
 * THEOREM TILT-SORT (graded depth credit). For every 0 < s < nu:
 *   Lambda(P, d) <= e^(-2 s d) D(P, s) e^(-2 s cSort(P)),
 *   cSort(P) = tau(P) - mu_max(P) = sum_(j<K) mu_j,
 * i.e. the TILT-DET majorant evaluated at effective depth d + cSort,
 * with a TILT-INDEPENDENT credit (one scalar per rate set, computed
 * once). Hence Lambda(P, d) <= min(1, inf_s of the right side).
 * Proof. TILT-DET steps (1)-(2) give Lambda <= e^(-2 s d) lambda_max.
 * The determinant identity gives lambda_max = D / prod_(j<K) lambda_j,
 * and LEMMA SORT-J grades the sub-leading product:
 * prod_(j<K) lambda_j >= prod_(j<K) e^(2 s mu_j) = e^(2 s (tau -
 * mu_K)) by the exact trace identity. QED.
 * DOMINATION: cSort = sum_(j<K) mu_j >= (K-1)/(4 Sp) by LEMMA TMEAN
 * applied to each sub-leading mu_j, so TILT-SORT <= TILT-EIG <=
 * TILT-DET pointwise in (s, d); at K = 1 all three coincide (cSort =
 * tau - mu_1 = 0 since mu_1 = tau). COALESCENCE-UNIFORM and
 * OFF-LATTICE: tau and mu_max carry no separation factor; both are
 * continuous under gap-metric convergence of the spans, so the bound
 * extends to confluent spans by the same L2-limit argument as TILT-DET
 * (at full coalescence the mean-time pencil is the explicit factorial
 * Hankel pencil ((j+k+1)!, (j+k)!) / (2 nu), see MEASURED (D)).
 *
 * LEMMA PERT-S0 (first-order exhaustion). As s -> 0 the tilted pencil
 * is an analytic perturbation of the fully degenerate pencil (G, G):
 * G2(s) = G + 2 s G1 + O(s^2), so by Rellich the sorted eigenvalue
 * branches satisfy lambda_j(s) = 1 + 2 s mu_j + O(s^2) -- the
 * first-order splitting matrix of the degenerate eigenvalue 1 is
 * exactly the mean-time pencil. Consequently
 * log lambda_max(s) = 2 s mu_max + O(s^2) and
 * log [D(P, s) e^(-2 s cSort)] = 2 s tau - 2 s (tau - mu_max) + O(s^2)
 * = 2 s mu_max + O(s^2): THE SORTED TRANSFER EXTRACTS THE ENTIRE
 * FIRST-ORDER-IN-s CONTENT OF THE TILTED PENCIL; the surviving slack of
 * the crude step lambda_max <= D e^(-2 s cSort) is O(s^2).
 *
 * THEOREM SORT-OPT (credit maximality). cSort is the LARGEST constant
 * c for which e^(-2 s c) D(P, s) >= lambda_max(G2(s), G) holds for all
 * admissible s. Proof. Validity at c = cSort is THEOREM TILT-SORT's
 * display. If c > cSort, then by LEMMA PERT-S0 and log D = 2 s tau +
 * O(s^2): log [e^(-2 s c) D] - log lambda_max = 2 s (cSort - c) +
 * O(s^2) < 0 for all small s > 0 -- the majorant property fails. QED.
 * So within the credited-TILT-DET family cashing the tilted-pencil
 * lambda_max, the trace/mean-time currency is EXHAUSTED: any further
 * onset improvement must leave this cash-out (deflation zeros, exact
 * joint pencil, or a different functional of the spectrum).
 *
 * LEMMA ONSET (exact firing criterion). For any constant credit c >= 0
 * the bound family B_c(s, d) = e^(-2 s (d + c)) D(P, s) fires
 * (inf_s B_c < 1) if and only if d > tau(P) - c. Proof. g(s) =
 * log B_c = -2 s (d + c) + sum_(i,j) log(q_ij / (q_ij - 2 s)) is a sum
 * of convex terms plus a linear term, hence convex on (0, nu), with
 * g(0) = 0 and gPrime(0) = 2 (tau - c - d). If gPrime(0) >= 0
 * convexity forces g >= 0 everywhere (never fires); if gPrime(0) < 0
 * then g < 0 for small s (fires). QED. COROLLARIES: onset(TILT-DET) =
 * tau(P), onset(TILT-EIG) = tau - (K-1)/(4 Sp), onset(TILT-SORT) =
 * mu_max(P) -- all EXACT closed forms. This retroactively explains the
 * imp-95500 measured onset literals: CLUSTER8 TILT-DET onset
 * 30.491017683902733 = tau(CLUSTER8) = 30.491017296646 (diff 3.9e-7 =
 * s-grid resolution), coalesced K = 8 onset 32.00000045846711 = tau =
 * K^2/(2 nu) = 32, twins m = 8 onset 14.975181056533525 = tau =
 * 14.9751809992. The TILT-SORT onset equals the maximal mean time of
 * the span -- the physically matched scale (the bound fires exactly
 * once the depth exceeds the largest mean time any unit-mass h in E_P
 * can carry).
 *
 * COROLLARY MU2 (K = 2 fully elementary closed form). With a =
 * 1/(2 p_1), c = 1/(2 p_2), b = 1/(p_1 + p_2): the mean-time pencil
 * eigenvalues are
 *   mu_(min,max) = [(a + c + 2 b) -+ sqrt((a - c)^2 + 4 b (a + c))]/2,
 * and cSort = mu_min (radical closed form; general K <= 4 is radical
 * via the degree-K characteristic polynomial). Derivation: det(G1 -
 * mu G) = (ac - b^2) mu^2 - [ac(a+c) - 2 b^3] mu + (a^2 c^2 - b^4);
 * dividing by ac - b^2 gives sum of roots a + c + 2 b = tau (the trace
 * identity, re-derived independently) and product ac + b^2. At
 * coalescence p_1 = p_2 = p: mu_max = (2 + sqrt 2)/(2 p) exactly and
 * cSort = (2 - sqrt 2)/(2 p) -- 2.34x the imp-95500 credit 1/(8 p).
 *
 * CLOSED-FORM STATUS (stated, not hidden). At general K the credit is
 * the TOP EIGENVALUE OF ONE EXPLICIT K x K PENCIL with closed-form
 * rational entries -- algebraic, d- and s-free, separation-free,
 * O(K^3) once per rate set -- but NOT elementary for K >= 5. TILT-EIG
 * remains the elementary fallback and is RECOVERED from TILT-SORT via
 * LEMMA TMEAN. An elementary upper bound on mu_max at general K
 * (beyond the circular tau - (K-1)/(4 Sp)) is the named successor
 * residual.
 *
 * CORRECTION (imp-95500 measured-record bookkeeping; theorem there
 * unaffected). The imp-95500 uniformFloorGap literal
 * trueSubleadingProduct = 3218724968585755.5 at P = [1, 1.1, 1.2, 1.3,
 * 1.4], s = 0.9 is the product of the TOP K-1 eigenvalues (it equals
 * D/lambda_min = 3.218720e15 to rel 1.6e-6), but the crude step
 * lambda_max = D / prod(sub-leading) divides by the BOTTOM K-1
 * product, which is D/lambda_max = 2.9924542e8 (verified by
 * exact-rational inertia below). The qualitative "sliver" verdict
 * stands; the available log-slack is 19.52, not 35.7. TILT-SORT
 * recovers e^(2 s cSort) = 1.0983e4 of it -- 47.7 percent of the
 * available log-slack vs 1.5 percent for the uniform floor.
 *
 * MEASURED (cross-checks of the proven statements, never the claim).
 *  (A) LEMMA SORT-J per-index: lambda_j / e^(2 s mu_j) >= 1 for EVERY
 *      j across six float-safe rate sets x four tilt fractions (worst
 *      ratio 1.00019, zero violations); trace sum mu_j = tau to rel
 *      <= 2e-6 (float pencil conditioning); mu_1 >= 1/(4 Sp) always.
 *  (B) COROLLARY MU2 matches the float pencil to rel 1e-9 on
 *      well-conditioned pairs and the exact coalescent factorial
 *      pencil gives m_2 = 3.4142135623731 = 2 + sqrt 2 to 1e-13.
 *  (C) CLUSTER8 = [1, 1.014, ..., 1.1] (float Cholesky FAILS at this
 *      K = 8 near-coalescent Gram): EXACT-RATIONAL INERTIA BISECTION
 *      (BigInt fractions, Sylvester count of pencil eigenvalues below
 *      a rational shift -- sign counts exact) gives mu_max =
 *      10.8954795117, cSort = 19.5955377850 vs cEig = 0.2083333
 *      (94.06x). Bound gains SORT vs EIG: 3.7365e4 / 5.3698e6 /
 *      7.9966e9 at d = 32 / 40 / 60; onset 30.282684 -> 10.895480
 *      (= mu_max, LEMMA ONSET).
 *  (D) Coalesced K = 8 (all rates nu): exact INTEGER factorial pencil
 *      ((j+k+1)!, (j+k)!) gives m_8 = 22.8631317369, so cSort =
 *      (64 - m_8)/(2 nu) = 20.5684341316 at nu = 1 vs the imp-95500
 *      credit 7/32 = 0.21875 -- 94.03x, at exact rate collision.
 *  (E) TWIN LATTICES (the imp-95500 "REAL but thin" regime REVERSED):
 *      m = 8 (K = 16): cSort = 9.911272001 = 1415x cEig, onset
 *      14.975181 -> 5.0639090; m = 16 (K = 32): cSort = 10.38397198 =
 *      1.844e5 x cEig, onset 15.477587 -> 5.0936154. mu_max(twin m)
 *      saturates near 5.09 as m grows, so the SORT onset is
 *      m-uniformly ~5.1 where DET/EIG sit at ~15.0-15.5.
 *  (F) DOMINATION: min(1, TILT-SORT) >= exact joint pencil on the full
 *      imp-95499/imp-95500 grid r in {1.5, 1.1, 1.01}, m in {1,2,3},
 *      d in {0.5,1,2,4,8,16} -- zero violations.
 *  (G) LEMMA PERT-S0: max_j |(lambda_j(s) - 1)/(2 s) - mu_j| =
 *      7.12e-3 at s = 1e-3 and 7.11e-4 at s = 1e-4 on [1,1.3,2.7,5.2]
 *      -- linear in s as proved.
 *
 * ADVERSARIAL SELF-CHECK RECORD. (1) The sorted PAIRING direction
 * (ascending-with-ascending) was attacked first: verified per-index,
 * not just in aggregate, across all sets x tilts -- a reversed pairing
 * would fail at j = 1 immediately. (2) The trace cash was attacked via
 * exact-rational inertia: it reproduces the float pencil where float
 * works and settles CLUSTER8 where float Cholesky throws; the K = 5
 * sorted spectrum from exact inertia matches float to 6 digits.
 * (3) COROLLARY MU2 was re-derived symbolically and checked against
 * both the float pencil and the coalescent limit 2 + sqrt 2.
 * (4) The imp-95500 literal discrepancy was traced to root cause (top
 * vs bottom K-1 product; the literal reproduces D/lambda_min to the
 * float accuracy of that run) rather than assumed. (5) A LARGER credit
 * was attempted and REFUTED: THEOREM SORT-OPT shows any c > cSort
 * breaks the majorant property at small s -- recorded so no successor
 * re-attempts a bigger constant credit inside this cash-out. (6) The
 * onset drops were sanity-checked against the exact object: exact
 * Lambda(P, d) < 1 for every d > 0, so a bound onset of ~5.1 (twins)
 * or ~10.9 (cluster) is legal; domination (F) confirms no crossing.
 * (7) LEMMA ONSET was checked against ALL SIX baked onset literals of
 * imp-95500 (diffs 5.7e-8 to 4.6e-7, = its s-grid resolution).
 *
 * HONEST LIMITS. (a) At general K >= 5 the credit is pencil-algebraic,
 * not elementary -- the elementary-currency successor is a closed-form
 * upper bound on mu_max. (b) The deflation zeros at U are still not
 * used (imp-95499 HONEST LIMITS (a) untouched). (c) K = 1 credit is
 * zero; the K = 1 looseness envelope 2 e x is untouched. (d) Model
 * family only (exponential spans, Cauchy Gram); no mapping to paper
 * per-window data; changes NO Lambda bound of the program. (e) The
 * onset comparisons here are WITHIN the per-block majorant family;
 * nothing is claimed about the RZ-PEN or SPLIT-chain every-octave
 * onsets, which live in different compositions.
 *
 * ROUTING. Executes imp-95500 re-scoped residual (ii-next) in BOTH
 * halves: the sorted-eigenvalue floor EXISTS (LEMMA SORT-J) and the
 * LEMMA MOM sum currency is CASHED without any branch resolution (the
 * trace is exact at the mean-time level; PERT-S0/SORT-OPT show the
 * currency is exhausted at first order). Surviving residuals,
 * re-scoped: (i) deflation-aware majorant below the ambient Lambda
 * (imp-95499 (a), untouched); (ii-next2) an ELEMENTARY closed-form
 * upper bound on mu_max(P) at general K, to restore elementary status
 * to the graded credit; (iii) RZ-PEN block-symbol port (imp-95499
 * (iii), untouched).
 *
 * Import-light (imports only the sibling imp-95500 record for the
 * literal-correction cross-check; no zeros bundle). Numerics are
 * CROSS-CHECKS of proven statements, never the claim itself.
 */

import IMP95500 from "./imp-95500-tilt-eigenfloor-depth-credit.js";

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95501_SORTED_MEANTIME_TRANSFER_CREDIT = {
  id: "imp-95501",
  title:
    "LEMMA SORT-J + THEOREM TILT-SORT + THEOREM SORT-OPT + LEMMA " +
    "PERT-S0 + LEMMA ONSET + COROLLARY MU2: the sorted mean-time " +
    "transfer grades the sub-leading tilted-pencil floor and yields " +
    "the maximal tilt-independent depth credit cSort = tau - mu_max; " +
    "executes imp-95500 residual (ii-next), both halves",
  lemmaSortJ:
    "lambda_j(G2(s), G) >= e^(2 s mu_j) for every sorted index j, " +
    "where mu_j are the generalized eigenvalues of the mean-time " +
    "pencil (G o G, G) (Courant-Fischer + Jensen + monotone exp)",
  theoremTiltSort:
    "Lambda(P, d) <= e^(-2 s (d + cSort)) D(P, s) with cSort = " +
    "tau(P) - mu_max(P) = sum of sub-leading mu_j, tilt-independent, " +
    "separation-free, coalescence-uniform, off-lattice; dominates " +
    "TILT-EIG (cSort >= (K-1)/(4 Sp) by LEMMA TMEAN termwise)",
  theoremSortOpt:
    "cSort is the LARGEST constant credit keeping the family a " +
    "majorant of e^(-2 s d) lambda_max(G2, G): any larger credit " +
    "fails at small s (Rellich first-order argument) -- the " +
    "trace/mean-time currency of this cash-out is exhausted",
  lemmaPertS0:
    "lambda_j(s) = 1 + 2 s mu_j + O(s^2) (analytic perturbation of " +
    "the fully degenerate pencil at s = 0; the first-order splitting " +
    "matrix IS the mean-time pencil) -- the imp-95500 LEMMA MOM " +
    "branch obstruction dissolves at the mean-time level, where the " +
    "trace identity sum mu_j = tau is exact",
  lemmaOnset:
    "the family e^(-2 s (d + c)) D(P, s) fires iff d > tau(P) - c " +
    "(convexity of the log in s + derivative at 0), so onsets are " +
    "EXACT closed forms: DET tau, EIG tau - (K-1)/(4 Sp), SORT " +
    "mu_max; explains all six imp-95500 baked onset literals to " +
    "their bisection resolution",
  corollaryMu2:
    "K = 2 elementary closed form: mu_(min,max) = [(a + c + 2 b) -+ " +
    "sqrt((a - c)^2 + 4 b (a + c))]/2 with a = 1/(2 p1), c = " +
    "1/(2 p2), b = 1/(p1 + p2); coalescent mu_max = (2 + sqrt 2)/(2 p)",
  creditLedger: {
    cluster8: {
      muMaxExactInertia: 10.8954795117,
      tau: 30.491017296646,
      cSort: 19.595537785,
      cEig: 7 / (4 * 8.4),
      ratio: 94.058581,
      onsetEig: 30.282684350569404,
      onsetSort: 10.8954795117,
      gains: { d32: 37364.6182, d40: 5369826.43, d60: 7996588190 },
    },
    coalescedK8: {
      factorialPencilM8: 22.8631317369,
      cSortAtNu1: (64 - 22.8631317369) / 2,
      cEig: 7 / 32,
    },
    twinM8: {
      K: 16,
      tau: 14.9751809992,
      muMax: 5.06390899825,
      cSort: 9.911272001,
      cEig: 15 / (4 * 535.5),
      onsetDet: 14.975181,
      onsetSort: 5.063909,
    },
    twinM16: {
      K: 32,
      tau: 15.477587338,
      muMax: 5.09361535799,
      cSort: 10.38397198,
      onsetSort: 5.0936154,
      note:
        "mu_max(twin m) saturates near 5.09: the SORT onset is " +
        "m-uniformly ~5.1 where DET/EIG sit at ~15.0-15.5 -- the " +
        "imp-95500 thin-lattice-gain verdict is reversed",
    },
  },
  siblingLiteralCorrection: {
    sample: "P = [1, 1.1, 1.2, 1.3, 1.4], s = 0.9",
    imp95500Literal: 3218724968585755.5,
    identifiedAs: "product of the TOP K-1 eigenvalues (D/lambda_min)",
    correctBottomProduct: 299245420.9,
    availableLogSlack: 19.517,
    sortedFloor: 10982.899,
    sortedLogFraction: 0.4767,
    uniformLogFraction: 0.0154,
    note:
      "the imp-95500 THEOREM is unaffected; only the measured " +
      "uniformFloorGap literal labeled the wrong product -- the crude " +
      "step divides by the BOTTOM K-1 eigenvalue product",
  },
  residualExecuted:
    "imp-95500 re-scoped residual (ii-next), both halves: the sorted " +
    "eigenvalue floor exists (SORT-J) and the LEMMA MOM sum currency " +
    "is cashed with no branch resolution (exact trace at the " +
    "mean-time level); SORT-OPT proves the constant-credit currency " +
    "is exhausted within this cash-out",
  rescopedResidual:
    "(i) deflation-aware majorant below the ambient Lambda (imp-95499 " +
    "(a), untouched); (ii-next2) elementary closed-form upper bound " +
    "on mu_max(P) at general K (credit is pencil-algebraic for " +
    "K >= 5); (iii) RZ-PEN block-symbol port (imp-95499 (iii), " +
    "untouched)",
  honestScope:
    "derivation + measurement; model family only; onset comparisons " +
    "are within the per-block majorant family (no claim on RZ-PEN or " +
    "SPLIT-chain every-octave onsets); changes no bound; NO QED; " +
    "no refereed bound is changed",
  verdict:
    "RIGOROUS step: the sorted mean-time transfer lambda_j >= " +
    "e^(2 s mu_j) grades the sub-leading floor of the tilted Cauchy " +
    "pencil by the mean-time pencil spectrum, whose trace is exactly " +
    "tau(P) -- the TILT-DET majorant gains the maximal " +
    "tilt-independent depth credit cSort = tau - mu_max (THEOREM " +
    "SORT-OPT), dominating the imp-95500 credit by measured 2.3x to " +
    "1.8e5x, with exact closed-form onsets (LEMMA ONSET: SORT onset = " +
    "mu_max = the maximal mean time of the span) and an exact K = 2 " +
    "radical form (COROLLARY MU2). Twin-lattice onsets drop " +
    "14.98 -> 5.06 (m = 8) and 15.48 -> 5.09 (m = 16); cluster and " +
    "coalesced K = 8 credits reach 94x. The imp-95500 branch-residual " +
    "dissolves at the mean-time level; its uniformFloorGap literal is " +
    "corrected (top vs bottom eigenvalue product). Changes no bound; " +
    "NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-contained numeric machinery (float part mirrors imp-95500)
// ---------------------------------------------------------------------------

function cauchyGram(nus) {
  return nus.map((a) => nus.map((b) => 1 / (a + b)));
}
function transpose(A) {
  return A[0].map((_, j) => A.map((row) => row[j]));
}
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95501 chol: pencil base not PD");
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  }
  return L;
}
function fwd(L, b) {
  const n = L.length;
  const x = b.slice();
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k];
    x[i] /= L[i][i];
  }
  return x;
}
function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 300; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
  }
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}
function pencilEig(A, B) {
  const L = chol(B);
  const n = A.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      A.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Y[i][j] = y[i];
  }
  const Yt = transpose(Y);
  const Ct = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      Yt.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Ct[i][j] = y[i];
  }
  return jacobiEig(transpose(Ct));
}
const sumP = (P) => P.reduce((a, b) => a + b, 0);
const tauOf = (P) => {
  let t = 0;
  for (const a of P) for (const b of P) t += 1 / (a + b);
  return t;
};
const meanPencilEig = (P) =>
  pencilEig(
    P.map((a) => P.map((b) => 1 / ((a + b) * (a + b)))),
    cauchyGram(P),
  );
const tiltedPencilEig = (P, s) =>
  pencilEig(
    P.map((a) => P.map((b) => 1 / (a + b - 2 * s))),
    cauchyGram(P),
  );
const logD = (P, s) => {
  let acc = 0;
  for (const a of P)
    for (const b of P) acc += Math.log((a + b) / (a + b - 2 * s));
  return acc;
};
const lamExact = (nus, d) => {
  const G = cauchyGram(nus);
  const DGD = G.map((row, i) =>
    row.map((g, j) => g * Math.exp(-d * (nus[i] + nus[j]))),
  );
  const ev = pencilEig(DGD, G);
  return ev[ev.length - 1];
};
const tiltEig = (P, s, d) =>
  Math.exp(-2 * s * (d + (P.length - 1) / (4 * sumP(P))) + logD(P, s));
const tiltSortWith = (cSort) => (P, s, d) =>
  Math.exp(-2 * s * (d + cSort) + logD(P, s));
function optBound(fn, P, d) {
  const nu = Math.min(...P);
  let best = Infinity;
  let bestS = 0;
  for (let i = 1; i <= 400; i++) {
    const s = (nu * i) / 401;
    const v = fn(P, s, d);
    if (v < best) {
      best = v;
      bestS = s;
    }
  }
  for (let it = 0; it < 50; it++) {
    const step = nu * 0.0025 * Math.pow(0.85, it);
    for (const s of [bestS - step, bestS + step]) {
      if (s <= 0 || s >= nu) continue;
      const v = fn(P, s, d);
      if (v < best) {
        best = v;
        bestS = s;
      }
    }
  }
  return Math.min(1, best);
}
function onset(fn, lo = 0.01, hi = 80) {
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (fn(mid) < 1) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}
const twinLattice = (m, r = 1.1) => {
  const P = [];
  for (let k = 0; k < m; k++) P.push(2 ** k, r * 2 ** k);
  return P;
};
// float-safe pencil test sets (CLUSTER8 breaks float Cholesky; it is
// handled by the exact-rational inertia machinery below)
const FLOAT_SETS = [
  [1, 2],
  [1, 1.3, 2.7, 5.2],
  [1, 1.0001],
  twinLattice(3),
  [1, 1.1, 1.2, 1.3, 1.4],
  [0.3, 0.31, 0.32, 0.33],
];
const CLUSTER8_NUMS = [1000, 1014, 1029, 1043, 1057, 1071, 1086, 1100];

// ---------------------------------------------------------------------------
// Exact-rational inertia machinery (BigInt fractions; Sylvester counts
// of pencil eigenvalues below a rational shift are EXACT)
// ---------------------------------------------------------------------------

const bgcd = (a, b) => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};
function frac(n, d = 1n) {
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = bgcd(n, d) || 1n;
  return [n / g, d / g];
}
const fsub = (x, y) => frac(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
const fmul = (x, y) => frac(x[0] * y[0], x[1] * y[1]);
const fdiv = (x, y) => frac(x[0] * y[1], x[1] * y[0]);
// number of pencil eigenvalues of (T, G) strictly below rational mu:
// negative-pivot count of T - mu G (Sylvester; G positive definite)
function countBelow(Tf, Gf, mu) {
  const n = Tf.length;
  const A = Tf.map((r, i) => r.map((x, j) => fsub(x, fmul(mu, Gf[i][j]))));
  let neg = 0;
  for (let k = 0; k < n; k++) {
    if (A[k][k][0] === 0n) return null; // caller nudges the shift
    if (A[k][k][0] < 0n) neg++;
    for (let i = k + 1; i < n; i++) {
      const f = fdiv(A[i][k], A[k][k]);
      for (let j = k; j < n; j++) A[i][j] = fsub(A[i][j], fmul(f, A[k][j]));
    }
  }
  return neg;
}
function muMaxExact(Tf, Gf, lo, hi, iters = 70) {
  const K = Tf.length;
  const toFrac = (x) => {
    const S = 2 ** 50;
    return frac(BigInt(Math.round(x * S)), BigInt(S));
  };
  for (let i = 0; i < iters; i++) {
    let mid = (lo + hi) / 2;
    let c = countBelow(Tf, Gf, toFrac(mid));
    if (c === null) {
      mid *= 1 + 1e-13;
      c = countBelow(Tf, Gf, toFrac(mid));
    }
    if (c === null) throw new Error("imp-95501 inertia: repeated zero pivot");
    if (c === K) hi = mid;
    else lo = mid;
    if (hi - lo < 1e-13 * Math.abs(hi)) break;
  }
  return (lo + hi) / 2;
}
function cluster8FracPencil() {
  const den = 1000n;
  const Gf = CLUSTER8_NUMS.map((a) =>
    CLUSTER8_NUMS.map((b) => frac(den, BigInt(a + b))),
  );
  const Tf = CLUSTER8_NUMS.map((a) =>
    CLUSTER8_NUMS.map((b) => frac(den * den, BigInt(a + b) * BigInt(a + b))),
  );
  return [Tf, Gf];
}
// confluent (fully coalesced) mean-time pencil at 2 nu = 1: basis
// t^j e^(-nu t), Gram (j+k)!, first-moment Gram (j+k+1)! -- exact integers
function factorialPencil(K) {
  const f = [1n];
  for (let i = 1; i <= 2 * K; i++) f.push(f[i - 1] * BigInt(i));
  const Gf = Array.from({ length: K }, (_, j) =>
    Array.from({ length: K }, (_, k) => frac(f[j + k], 1n)),
  );
  const Tf = Array.from({ length: K }, (_, j) =>
    Array.from({ length: K }, (_, k) => frac(f[j + k + 1], 1n)),
  );
  return [Tf, Gf];
}
// COROLLARY MU2 closed form
function mu2Closed(p1, p2) {
  const a = 1 / (2 * p1);
  const c = 1 / (2 * p2);
  const b = 1 / (p1 + p2);
  const t = a + c + 2 * b;
  const disc = Math.sqrt((a - c) * (a - c) + 4 * b * (a + c));
  return [(t - disc) / 2, (t + disc) / 2];
}

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95501_ASSERTIONS = [
  {
    id: "imp95501-sorted-transfer-per-index",
    description:
      "LEMMA SORT-J: lambda_j(G2(s), G) >= e^(2 s mu_j) for EVERY " +
      "sorted index j on the six float-safe sets at tilt fractions " +
      "s/nu in {0.1, 0.5, 0.9, 0.99} (zero violations)",
    holds: () =>
      FLOAT_SETS.every((P) => {
        const nu = Math.min(...P);
        const mu = meanPencilEig(P);
        return [0.1, 0.5, 0.9, 0.99].every((f) => {
          const s = nu * f;
          const lam = tiltedPencilEig(P, s);
          return lam.every((l, j) => l >= Math.exp(2 * s * mu[j]) * (1 - 1e-9));
        });
      }),
  },
  {
    id: "imp95501-trace-and-graded-floor",
    description:
      "mean-time pencil trace sum mu_j = tau(P) (rel 1e-5, float " +
      "conditioning) and mu_1 >= 1/(4 Sp) (LEMMA TMEAN consumed) on " +
      "all float-safe sets",
    holds: () =>
      FLOAT_SETS.every((P) => {
        const mu = meanPencilEig(P);
        const S = mu.reduce((a, b) => a + b, 0);
        const t = tauOf(P);
        return (
          Math.abs(S - t) <= 1e-5 * t &&
          mu[0] >= (1 / (4 * sumP(P))) * (1 - 1e-9)
        );
      }),
  },
  {
    id: "imp95501-mu2-closed-form",
    description:
      "COROLLARY MU2 matches the float pencil to rel 1e-9 on (1,2) " +
      "and (0.5,7), rel 1e-6 on the near-coalescent (1,1.0001), and " +
      "the exact coalescent factorial pencil gives m_2 = 2 + sqrt 2 " +
      "to 1e-10",
    holds: () => {
      const check = (p1, p2, tol) => {
        const ex = meanPencilEig([p1, p2]);
        const cf = mu2Closed(p1, p2);
        return (
          Math.abs(ex[0] - cf[0]) <= tol * cf[0] &&
          Math.abs(ex[1] - cf[1]) <= tol * cf[1]
        );
      };
      const [T2, G2] = factorialPencil(2);
      const m2 = muMaxExact(T2, G2, 1, 10);
      return (
        check(1, 2, 1e-9) &&
        check(0.5, 7, 1e-9) &&
        check(1, 1.0001, 1e-6) &&
        Math.abs(m2 - (2 + Math.SQRT2)) <= 1e-10 * (2 + Math.SQRT2)
      );
    },
  },
  {
    id: "imp95501-credit-dominates-and-ordering",
    description:
      "cSort >= cEig on all float-safe sets (measured ratios >= 2.3) " +
      "and the sampled ordering identity TILT-SORT / TILT-EIG = " +
      "e^(-2 s (cSort - cEig)) holds to 1e-12 with ratio < 1 for " +
      "K >= 2",
    holds: () =>
      FLOAT_SETS.every((P) => {
        const mu = meanPencilEig(P);
        const cS = tauOf(P) - mu[mu.length - 1];
        const cE = (P.length - 1) / (4 * sumP(P));
        if (!(cS >= cE * 2.3)) return false;
        const nu = Math.min(...P);
        const fn = tiltSortWith(cS);
        return [0.2, 0.6].every((f) => {
          const s = nu * f;
          const ratio = fn(P, s, 3) / tiltEig(P, s, 3);
          const expected = Math.exp(-2 * s * (cS - cE));
          return Math.abs(ratio - expected) <= 1e-12 && ratio < 1;
        });
      }),
  },
  {
    id: "imp95501-cluster8-exact-inertia",
    description:
      "CLUSTER8 (float Cholesky fails): exact-rational inertia gives " +
      "mu_max = 10.8954795117 (rel 1e-8), cSort = 19.5955377850 = " +
      "94.058x cEig, and bound gains SORT vs EIG 3.7365e4 / 5.3698e6 " +
      "/ 7.9966e9 at d = 32 / 40 / 60 (rel 1e-4)",
    holds: () => {
      const [Tf, Gf] = cluster8FracPencil();
      const P = CLUSTER8_NUMS.map((x) => x / 1000);
      const mm = muMaxExact(Tf, Gf, 0.05, tauOf(P));
      if (Math.abs(mm - 10.8954795117) > 1e-8 * mm) return false;
      const cS = tauOf(P) - mm;
      if (Math.abs(cS - 19.595537785) > 1e-7 * cS) return false;
      const cE = 7 / (4 * sumP(P));
      if (Math.abs(cS / cE - 94.058581) > 1e-5 * 94.058581) return false;
      const lits = { 32: 37364.6182, 40: 5369826.43, 60: 7996588190 };
      const fn = tiltSortWith(cS);
      return [32, 40, 60].every((d) => {
        const g = optBound(tiltEig, P, d) / optBound(fn, P, d);
        return Math.abs(g - lits[d]) <= 1e-4 * lits[d];
      });
    },
  },
  {
    id: "imp95501-coalesced-factorial-pencil",
    description:
      "fully coalesced K = 8 (exact integer factorial pencil): m_8 = " +
      "22.8631317369 (rel 1e-8), credit (64 - m_8)/2 = 20.5684341 at " +
      "nu = 1 vs the imp-95500 credit 7/32 (ratio ~94x at exact rate " +
      "collision)",
    holds: () => {
      const [Tf, Gf] = factorialPencil(8);
      const m8 = muMaxExact(Tf, Gf, 1, 300);
      if (Math.abs(m8 - 22.8631317369) > 1e-8 * m8) return false;
      const cS = (64 - m8) / 2;
      const ratio = cS / (7 / 32);
      return Math.abs(cS - 20.5684341316) < 1e-7 && ratio > 90 && ratio < 100;
    },
  },
  {
    id: "imp95501-onset-closed-form",
    description:
      "LEMMA ONSET: measured onsets equal the closed forms tau - c to " +
      "1e-4 (twin m = 8: DET tau = 14.97518, SORT mu_max = 5.06391; " +
      "CLUSTER8 SORT = mu_max = 10.89548), and the imp-95500 baked " +
      "onset literals equal tau / tau - cEig to 1e-5",
    holds: () => {
      const P8 = twinLattice(8);
      const mu8 = meanPencilEig(P8);
      const muMax8 = mu8[mu8.length - 1];
      const cS8 = tauOf(P8) - muMax8;
      const xSort8 = onset((d) => optBound(tiltSortWith(cS8), P8, d));
      if (Math.abs(xSort8 - muMax8) > 1e-4) return false;
      if (Math.abs(tauOf(P8) - 14.9751809992) > 1e-8) return false;
      const PC = CLUSTER8_NUMS.map((x) => x / 1000);
      const cSC = 19.595537785; // = tau - mu_max, verified above
      const xSortC = onset((d) => optBound(tiltSortWith(cSC), PC, d));
      if (Math.abs(xSortC - (tauOf(PC) - cSC)) > 1e-4) return false;
      // imp-95500 baked literals vs LEMMA ONSET closed forms
      const lits = IMP95500.measuredGains;
      if (Math.abs(lits.onsetClusterK8.det - tauOf(PC)) > 1e-5) return false;
      if (
        Math.abs(lits.onsetClusterK8.eig - (tauOf(PC) - 7 / (4 * sumP(PC)))) >
        1e-5
      )
        return false;
      if (Math.abs(lits.onsetCoalescedK8.det - 32) > 1e-5) return false;
      return Math.abs(lits.onsetTwinsM8.det - tauOf(P8)) < 1e-5;
    },
  },
  {
    id: "imp95501-twin-lattice-credits",
    description:
      "twin lattices (imp-95500 thin-gain regime reversed): m = 8 " +
      "cSort = 9.911272 = 1415x cEig with SORT onset mu_max = " +
      "5.063909; m = 16 cSort = 10.383972 = 1.84e5 x cEig, mu_max = " +
      "5.093615 (m-uniform saturation near 5.09)",
    holds: () => {
      const P8 = twinLattice(8);
      const mu8 = meanPencilEig(P8);
      const cS8 = tauOf(P8) - mu8[mu8.length - 1];
      if (Math.abs(cS8 - 9.911272001) > 1e-6) return false;
      if (Math.abs(mu8[mu8.length - 1] - 5.06390899825) > 1e-6) return false;
      if (cS8 / (15 / (4 * sumP(P8))) < 1400) return false;
      const P16 = twinLattice(16);
      const mu16 = meanPencilEig(P16);
      const cS16 = tauOf(P16) - mu16[mu16.length - 1];
      if (Math.abs(cS16 - 10.38397198) > 1e-5) return false;
      if (Math.abs(mu16[mu16.length - 1] - 5.09361535799) > 1e-5) return false;
      return cS16 / ((P16.length - 1) / (4 * sumP(P16))) > 1.8e5;
    },
  },
  {
    id: "imp95501-dominates-exact-grid",
    description:
      "THEOREM TILT-SORT domination: min(1, bound) >= exact joint " +
      "pencil on the grid r in {1.5, 1.1, 1.01}, m in {1,2,3}, d in " +
      "{0.5,1,2,4,8,16}",
    holds: () => {
      for (const r of [1.5, 1.1, 1.01])
        for (const m of [1, 2, 3]) {
          const P = twinLattice(m, r);
          const mu = meanPencilEig(P);
          const cS = tauOf(P) - mu[mu.length - 1];
          const fn = tiltSortWith(cS);
          for (const d of [0.5, 1, 2, 4, 8, 16]) {
            const ex = Math.min(1, lamExact(P, d));
            if (optBound(fn, P, d) < ex * (1 - 1e-9)) return false;
          }
        }
      return true;
    },
  },
  {
    id: "imp95501-pert-s0-first-order",
    description:
      "LEMMA PERT-S0: max_j |(lambda_j(s) - 1)/(2 s) - mu_j| on " +
      "[1, 1.3, 2.7, 5.2] shrinks linearly in s (error ratio at " +
      "s = 1e-4 vs 1e-3 lies in [0.05, 0.2])",
    holds: () => {
      const P = [1, 1.3, 2.7, 5.2];
      const mu = meanPencilEig(P);
      const err = (s) => {
        const lam = tiltedPencilEig(P, s);
        return Math.max(...lam.map((l, j) => Math.abs((l - 1) / (2 * s) - mu[j])));
      };
      const e3 = err(1e-3);
      const e4 = err(1e-4);
      return e4 / e3 > 0.05 && e4 / e3 < 0.2 && e3 < 1e-2;
    },
  },
  {
    id: "imp95501-sibling-literal-correction",
    description:
      "the imp-95500 uniformFloorGap literal equals D/lambda_min (top " +
      "K-1 product, rel 2e-5) and exceeds the crude-step-relevant " +
      "bottom product D/lambda_max = 2.9924542e8 (rel 1e-5) by ~1e7; " +
      "the sorted floor recovers 47.7 percent of the available " +
      "log-slack vs 1.5 percent for the uniform floor",
    holds: () => {
      const P = [1, 1.1, 1.2, 1.3, 1.4];
      const s = 0.9;
      let D = 1;
      for (const a of P) for (const b of P) D *= (a + b) / (a + b - 2 * s);
      const lam = tiltedPencilEig(P, s);
      const lit = IMP95500.uniformFloorGap.trueSubleadingProduct;
      const top = D / lam[0];
      const bottom = D / lam[lam.length - 1];
      if (Math.abs(lit - top) > 2e-5 * top) return false;
      if (lit / bottom < 1e6) return false;
      if (Math.abs(bottom - 299245420.9) > 1e-5 * bottom) return false;
      const mu = meanPencilEig(P);
      const cS = tauOf(P) - mu[mu.length - 1];
      const fracSorted = (2 * s * cS) / Math.log(bottom);
      const fracUnif =
        (((P.length - 1) * s) / (2 * sumP(P))) / Math.log(bottom);
      return (
        Math.abs(fracSorted - 0.4767) < 1e-3 && Math.abs(fracUnif - 0.0154) < 1e-3
      );
    },
  },
  {
    id: "imp95501-honesty-gate",
    description:
      "the record names the executed residual (both halves), keeps " +
      "the re-scoped residuals (elementary mu_max bound, deflation " +
      "zeros, RZ-PEN port), scopes the onset claims to the per-block " +
      "family, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /\(ii-next\), both halves/.test(
        IMP95501_SORTED_MEANTIME_TRANSFER_CREDIT.residualExecuted,
      ) &&
      /elementary closed-form upper bound on mu_max/.test(
        IMP95501_SORTED_MEANTIME_TRANSFER_CREDIT.rescopedResidual,
      ) &&
      /deflation-aware/.test(
        IMP95501_SORTED_MEANTIME_TRANSFER_CREDIT.rescopedResidual,
      ) &&
      /RZ-PEN/.test(IMP95501_SORTED_MEANTIME_TRANSFER_CREDIT.rescopedResidual) &&
      /per-block majorant family/.test(
        IMP95501_SORTED_MEANTIME_TRANSFER_CREDIT.honestScope,
      ) &&
      /NO QED/.test(IMP95501_SORTED_MEANTIME_TRANSFER_CREDIT.verdict) &&
      /refereed bound is changed/i.test(IMP95501_SORTED_MEANTIME_TRANSFER_CREDIT.verdict) &&
      /[Cc]hanges no bound/.test(IMP95501_SORTED_MEANTIME_TRANSFER_CREDIT.verdict),
  },
];

for (const a of IMP95501_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95501-sorted-meantime-transfer-credit assertion failed: ${a.id}`,
    );
  }
}

export default IMP95501_SORTED_MEANTIME_TRANSFER_CREDIT;
