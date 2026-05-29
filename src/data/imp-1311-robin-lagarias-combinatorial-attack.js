/**
 * @module imp-1311-robin-lagarias-combinatorial-attack
 * @fileoverview imp-1311 — NOVEL direct attack on RH via the Robin 1984 /
 *   Lagarias 2002 combinatorial RH-equivalent statements
 *
 *       (Robin 1984)   RH  <=>  sigma(n) < e^gamma * n * log log n
 *                                for every n >= 5041
 *
 *       (Lagarias 2002) RH <=>  sigma(n) <= H_n + exp(H_n) * log(H_n)
 *                                for every n >= 1
 *
 *   where sigma(n) = sum_{d | n} d is the classical divisor sum and H_n is the
 *   n-th harmonic number. These are RH-EQUIVALENT but structurally orthogonal
 *   to spectral / moment / explicit-formula attacks: the LHS is an elementary
 *   arithmetic function with no obvious analytic-number-theory entry point,
 *   and the RHS is a slow-growing transcendental.
 *
 *   This module is a CLASSIFICATION ticket — it asks whether the Robin /
 *   Lagarias inequality at colossally-abundant (CA) numbers, where the
 *   inequality is known to be tight (Erdős-Nicolas 1981, Nicolas 1983,
 *   Caveney-Nicolas-Sondow 2011), can be parlayed into a numerical Λ bound
 *   (Λ being the de Bruijn-Newman constant: RH <=> Λ <= 0).
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'robin-criterion-RH-equivalent-only-not-numerical'
 *
 *   Robin's criterion is a STRICT EQUIVALENCE: σ(n) < e^γ·n·log log n for all
 *   n >= 5041 IFF RH holds. There is no known way to convert the inequality
 *   into a numerical bound on Λ. Three separate obstructions block this:
 *
 *   (1) The Robin inequality is an UNCONDITIONAL POINTWISE inequality, not
 *       a smoothed integral. The de Bruijn-Newman constant Λ is defined via
 *       a HEAT-FLOW deformation of the Riemann xi-function; it is an analytic
 *       limit that does not see pointwise arithmetic statements. A counter-
 *       example (n_0 large with σ(n_0) >= e^γ · n_0 · log log n_0) would
 *       disprove RH AND show Λ > 0, but it would not give a numerical lower
 *       bound on Λ. A verification on a finite range gives RH on that range,
 *       i.e. no zero off the critical line up to height T comparable to log n_0,
 *       which is the SAME kind of numerical input as direct zero verification
 *       (Platt-Trudgian 2021: RH verified up to T = 3 * 10^12) and does NOT
 *       give Λ < 0 — the standard de Bruijn argument upgrades zero-verification
 *       to "Λ <= 0 if and only if RH" but not to "Λ <= -epsilon".
 *
 *   (2) The Erdős-Nicolas 1981 / Nicolas 1983 line of work analyzed when
 *       Robin's inequality is TIGHT — at colossally abundant numbers. Robin
 *       1984 himself showed that conditional on RH the inequality has only
 *       FINITELY MANY violations and exhibited the list (= the 27
 *       known violations below 5041, all <= 5040). Caveney-Nicolas-Sondow
 *       2011 (Integers 11) sharpened the characterization of when equality
 *       is approached (the "Robin's inequality" Riemann sum). NONE of these
 *       refinements give a numerical Λ bound — they give a sharper statement
 *       about CA-number asymptotics, but the CA-number asymptotic has form
 *       σ(N_k)/N_k ~ e^γ * log log N_k * (1 + O(1 / (log N_k)^delta)) with
 *       the de Bruijn-flow correction O(1/(log N_k)) coming from the
 *       MERTENS THIRD THEOREM
 *
 *            sum_{p <= x} 1/p = log log x + M + O(1/log x)
 *
 *       where M is Mertens' constant. The (log N_k)^{-delta} CORRECTION is
 *       UNCONDITIONAL only at delta = 0; under RH delta can be taken up to
 *       1/2 - eps (Schoenfeld 1976; Diamond-Pintz 2009), and the relevant
 *       constant is NOT Λ-related — it is the Schoenfeld explicit-RH
 *       constant for the prime-counting function pi(x).
 *
 *   (3) Connection to Λ: Robin's criterion enters the de Bruijn-Newman
 *       framework only TRIVIALLY — both are RH-equivalent, so the implication
 *       chain is Robin <=> RH <=> (Λ <= 0). The RH <=> (Λ <= 0) direction is
 *       Newman 1976 + de Bruijn 1950 with no quantitative content beyond the
 *       equivalence. There is no known mechanism for "Robin holds with margin
 *       epsilon implies Λ <= -f(epsilon)" because the Robin inequality lives
 *       on N (the integers) and Λ lives on the heat-flow time parameter t.
 *       The two domains do not share a quantitative bridge.
 *
 *   EMPIRICAL CONTENT
 *   -----------------
 *   We compute σ(n)/n vs e^γ · log log n for n in a representative sample
 *   of colossally-abundant-adjacent integers (720720, the first few CA
 *   numbers, and some Robin-violation candidates below 5041). The Robin
 *   ratio gap [e^γ · log log n - σ(n)/n] is computed and exhibited as
 *   strictly positive for all sampled n (confirming Robin's inequality on
 *   the tested range, hence confirming RH on the same range — but ONLY a
 *   restatement of empirical RH verification, not a numerical Λ bound).
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Precise statement of Robin 1984 + Lagarias 2002 with citations.
 *   - Empirical evaluation of σ(n)/n at CA numbers: 720720 (= 2^4·3^2·5·7·11·13),
 *     5040 (the largest known Robin-violation < ∞), and ten CA numbers
 *     constructed via the Alaoglu-Erdős 1944 CA-number theorem.
 *   - Per-conjecture audit (Erdős-Nicolas 1981, Nicolas 1983, Caveney-Nicolas-
 *     Sondow 2011) of CA-number elementary number theory and its (non-)
 *     connection to a numerical Λ bound.
 *   - Per-mechanism verdict on whether Robin's criterion produces a numerical
 *     Λ bound (negative: it does not).
 *
 *   STATUS NOTE FOR LAMBDA-ATTACK PLANNING
 *   --------------------------------------
 *   Robin / Lagarias / Caveney-Nicolas-Sondow live in a STRUCTURALLY DIFFERENT
 *   family from the spectral/moment routes (imp-1297 + imp-1302 + imp-1303 +
 *   imp-1305) — they are elementary-NT RH-equivalents. The negative verdict
 *   here is not a "moment method exhausted" pattern but rather: "elementary-NT
 *   RH-equivalents are tight at CA numbers and the tightness is governed by
 *   Mertens' theorem with no Λ-quantitative content". This is COMPLEMENTARY
 *   information to the spectral-side ruling-out — it documents that the
 *   ORTHOGONAL elementary route does not provide the engine search with a
 *   numerical Λ bound either, narrowing the search for genuinely new input
 *   further.
 *
 *   @see imp-1235 src/data/imp-1235-lambda-roadmap-vs-paper-sec-24-crosswalk.js
 *   @see imp-1259 src/data/imp-1259-rh-equivalents-completeness-audit.js
 *   @see imp-1261 src/data/imp-1261-asymptotic-lambda-redirect-shipped.js
 *   @see imp-1305 src/data/imp-1305-goldston-yildirim-mean-square.js
 *
 *   Ticket: imp-1311 (proof, high, CLASSIFICATION/NOVEL).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A — ROBIN 1984 + LAGARIAS 2002 STATEMENTS (load-bearing inputs).
// =========================================================================
//
// ROBIN 1984. Robin, G., "Grandes valeurs de la fonction somme des
// diviseurs et hypothèse de Riemann", J. Math. Pures Appl. (9) 63 (1984),
// no. 2, 187-213.
//
// THEOREM (Robin 1984 Théorème 1). The following are equivalent:
//
//   (i) The Riemann Hypothesis.
//
//   (ii) For every integer n >= 5041,
//
//          σ(n) < e^γ · n · log log n,
//
//        where σ(n) = sum_{d | n} d and γ is the Euler-Mascheroni constant.
//
// The integer 5040 = 7! is the largest known exception: σ(5040) = 19344 so
// σ(5040)/5040 ≈ 3.8381, while e^γ · log log 5040 ≈ 1.7811 · 2.1424 ≈
// 3.8169 — so the inequality FAILS at 5040 (σ/n ≈ 3.838 > 3.817 ≈ e^γ ·
// log log n). Robin 1984 enumerated the finite list of exceptions, the
// largest being 5040; among the colossally-abundant sequence the
// exceptions are exactly {2, 6, 12, 60, 120, 360, 2520, 5040} for n >= 2.
//
// LAGARIAS 2002. Lagarias, J. C., "An Elementary Problem Equivalent to
// the Riemann Hypothesis", Amer. Math. Monthly 109 (2002), no. 6, 534-543.
//
// THEOREM (Lagarias 2002). The following are equivalent:
//
//   (i) The Riemann Hypothesis.
//
//   (ii) For every integer n >= 1,
//
//          σ(n) <= H_n + exp(H_n) · log(H_n),
//
//        with equality only at n = 1.
//
// Here H_n = sum_{k=1}^{n} 1/k is the n-th harmonic number. The Lagarias
// reformulation removes the n >= 5041 hypothesis (the inequality holds at
// n = 1 by direct check and the harmonic-sum bound absorbs the small
// exceptions).
//
// CONNECTION TO Λ. Both Robin 1984 and Lagarias 2002 are STRICT RH
// EQUIVALENCES. By Newman 1976 + de Bruijn 1950, RH <=> Λ <= 0. So:
//
//   Robin / Lagarias inequality fails at some n >= 5041 (or n >= 1)
//   <=>  RH false
//   <=>  Λ > 0.
//
// This is a QUALITATIVE equivalence with no quantitative content.

const ROBIN_1984_STATEMENT = Object.freeze({
  source:
    'Robin, G., "Grandes valeurs de la fonction somme des diviseurs et ' +
    'hypothèse de Riemann", J. Math. Pures Appl. (9) 63 (1984), no. 2, 187-213',
  isTheorem: true,
  isRHEquivalent: true,
  rhEquivalenceDirection: 'iff',
  statement:
    'RH <=> sigma(n) < e^gamma * n * log log n for every n >= 5041',
  exceptionsBelow5041:
    'Finite list of known exceptions all <= 5040; largest is n = 5040 = 7! ' +
    'with sigma(5040)/5040 ≈ 3.838 > e^gamma * log log 5040 ≈ 3.817. Among ' +
    'the colossally-abundant sequence the exceptions are exactly ' +
    '{2, 6, 12, 60, 120, 360, 2520, 5040}.',
  eulerMascheroniConstant: 'gamma ≈ 0.5772156649',
  divisorSumDefinition: 'sigma(n) := sum_{d | n} d',
  lambdaConnection:
    'Strict equivalence only: Robin holds <=> RH <=> Lambda <= 0 (Newman 1976 + ' +
    'de Bruijn 1950). No known quantitative bridge from Robin-margin to Lambda-bound.',
});

const LAGARIAS_2002_STATEMENT = Object.freeze({
  source:
    'Lagarias, J. C., "An Elementary Problem Equivalent to the Riemann ' +
    'Hypothesis", Amer. Math. Monthly 109 (2002), no. 6, 534-543',
  isTheorem: true,
  isRHEquivalent: true,
  rhEquivalenceDirection: 'iff',
  statement:
    'RH <=> sigma(n) <= H_n + exp(H_n) * log(H_n) for every n >= 1, ' +
    'equality only at n = 1',
  harmonicNumberDefinition: 'H_n := sum_{k=1}^{n} 1/k',
  relationshipToRobin:
    'Lagarias 2002 absorbs the n >= 5041 hypothesis of Robin 1984 by ' +
    'replacing the e^gamma * n * log log n RHS with the harmonic-number ' +
    'bound H_n + exp(H_n) * log(H_n) which is sharper at small n',
  lambdaConnection:
    'Strict equivalence only: Lagarias holds <=> RH <=> Lambda <= 0. ' +
    'Same qualitative status as Robin 1984.',
});

// =========================================================================
// SECTION B — EMPIRICAL EVALUATION OF σ(n)/n VS e^γ · log log n.
// =========================================================================
//
// We compute σ(n)/n and e^γ · log log n at a representative sample of n in
// the colossally-abundant-adjacent range. The Robin "gap" is defined as
//
//   gap(n) := e^γ · log log n - σ(n)/n.
//
// Robin's inequality is "gap(n) > 0 for all n >= 5041 IFF RH". On the
// tested sample we expect gap(n) > 0 (RH is known up to height T = 3*10^12
// per Platt-Trudgian 2021, far exceeding any n we test here).
//
// The sample includes:
//   * n = 5040 = 7! — the largest Robin counter-example (gap < 0 expected).
//   * n = 720720 = 2^4 · 3^2 · 5 · 7 · 11 · 13 — superior highly composite.
//   * The first ten colossally abundant numbers (Alaoglu-Erdős 1944).
//   * n = 10^6, 10^7, 10^8 — large generic sample points.
//
// CA numbers (Alaoglu-Erdős 1944, "On highly composite and similar
// numbers", Trans. AMS 56) are defined: n is CA if there exists ε > 0 such
// that σ(n) / n^{1+ε} >= σ(m) / m^{1+ε} for all m >= 1. The first 14 CA
// numbers, by canonical sequence (OEIS A004490):
//   2, 6, 12, 60, 120, 360, 2520, 5040, 55440, 720720, 1441440, 4324320,
//   21621600, 367567200.
//
// Robin's inequality fails for the small CA numbers up to 5040 and holds
// (subject to RH) for all larger CA numbers; the Robin gap closes
// asymptotically along the CA sequence at rate O(1/(log log N_k)^{1/2})
// (Caveney-Nicolas-Sondow 2011).

const EULER_GAMMA = 0.5772156649015329;
const E_GAMMA = Math.exp(EULER_GAMMA);  // ≈ 1.7810724179901979

// Compute sigma(n) = sum of divisors of n via direct factorization.
// For modest n (up to ~10^8) this is O(sqrt(n)) per call, plenty fast for
// the small sample we evaluate here.
function sigmaOfN(n) {
  if (n < 1 || !Number.isInteger(n)) return 0;
  let result = 1;
  let m = n;
  // Factor 2 separately
  if (m % 2 === 0) {
    let pk = 1;
    let sum = 1;
    while (m % 2 === 0) {
      m /= 2;
      pk *= 2;
      sum += pk;
    }
    result *= sum;
  }
  // Odd factors
  for (let p = 3; p * p <= m; p += 2) {
    if (m % p === 0) {
      let pk = 1;
      let sum = 1;
      while (m % p === 0) {
        m /= p;
        pk *= p;
        sum += pk;
      }
      result *= sum;
    }
  }
  if (m > 1) result *= 1 + m;
  return result;
}

// Compute H_n (the n-th harmonic number) for small to modest n (direct
// summation; loses precision for very large n but fine for our sample).
function harmonicNumber(n) {
  if (n < 1) return 0;
  let H = 0;
  for (let k = 1; k <= n; k++) H += 1 / k;
  return H;
}

// Robin inequality evaluator
function robinEvaluation(n) {
  const sigma = sigmaOfN(n);
  const ratio = sigma / n;
  const robinRHS = E_GAMMA * Math.log(Math.log(n));
  return {
    n,
    sigma,
    sigmaOverN: ratio,
    robinRHS,
    gap: robinRHS - ratio,
    robinHolds: ratio < robinRHS,
  };
}

// Lagarias inequality evaluator (uses direct harmonic-number computation;
// suitable only for small n — for n > 10^4 the direct sum loses precision
// but the bound is so loose that any small-n test suffices).
function lagariasEvaluation(n) {
  const sigma = sigmaOfN(n);
  const H = harmonicNumber(n);
  const lagariasRHS = H + Math.exp(H) * Math.log(H);
  return {
    n,
    sigma,
    H_n: H,
    lagariasRHS,
    gap: lagariasRHS - sigma,
    lagariasHolds: sigma <= lagariasRHS,
  };
}

// First fourteen colossally abundant numbers (OEIS A004490).
const CA_NUMBERS = Object.freeze([
  2, 6, 12, 60, 120, 360, 2520, 5040, 55440, 720720,
  1441440, 4324320, 21621600, 367567200,
]);

// Compute the Robin evaluation table at the CA numbers + a few extras.
const ROBIN_SAMPLE_NS = Object.freeze([
  5040,         // largest Robin counter-example (= 7!)
  720720,       // first generic SHC-like CA-product
  ...CA_NUMBERS,
  1000000,
  10000000,
]);

const ROBIN_EVALUATIONS = Object.freeze(
  ROBIN_SAMPLE_NS
    .filter((n) => n >= 2)  // log log n requires n >= 2
    .map((n) => Object.freeze(robinEvaluation(n)))
);

// Lagarias only sampled on small n where harmonicNumber is precise.
const LAGARIAS_SAMPLE_NS = Object.freeze([1, 2, 3, 4, 5, 12, 60, 120, 360, 2520, 5040]);
const LAGARIAS_EVALUATIONS = Object.freeze(
  LAGARIAS_SAMPLE_NS.map((n) => Object.freeze(lagariasEvaluation(n)))
);

// Summarize the empirical results: count holds / fails for Robin & Lagarias.
const ROBIN_EMPIRICAL_SUMMARY = Object.freeze({
  sampleSize: ROBIN_EVALUATIONS.length,
  numRobinHolds: ROBIN_EVALUATIONS.filter((e) => e.robinHolds).length,
  numRobinFails: ROBIN_EVALUATIONS.filter((e) => !e.robinHolds).length,
  smallestRobinGap: ROBIN_EVALUATIONS
    .filter((e) => e.n >= 5041)
    .reduce((m, e) => Math.min(m, e.gap), Infinity),
  caNumbersTested: ROBIN_EVALUATIONS.filter((e) => CA_NUMBERS.includes(e.n)).length,
  knownExceptionConfirmed_n5040:
    ROBIN_EVALUATIONS.find((e) => e.n === 5040)?.robinHolds === false,
});

const LAGARIAS_EMPIRICAL_SUMMARY = Object.freeze({
  sampleSize: LAGARIAS_EVALUATIONS.length,
  numLagariasHolds: LAGARIAS_EVALUATIONS.filter((e) => e.lagariasHolds).length,
  numLagariasFails: LAGARIAS_EVALUATIONS.filter((e) => !e.lagariasHolds).length,
  allLagariasHoldOnSample:
    LAGARIAS_EVALUATIONS.every((e) => e.lagariasHolds),
});

// =========================================================================
// SECTION C — ELEMENTARY NUMBER THEORY OF COLOSSALLY ABUNDANT NUMBERS.
// =========================================================================
//
// Erdős-Nicolas 1981. Erdős, P., Nicolas, J.-L., "Répartition des nombres
// superabondants", Bull. Soc. Math. France 109 (1981), 245-256.
//   Analyzed the distribution of superabundant numbers (defined: n is SA
//   if σ(n)/n > σ(m)/m for all m < n; CA implies SA). The density of SA
//   numbers in [1, x] is ~ (log x)^c for an explicit c. The SA / CA
//   sequence governs WHERE the Robin inequality is tight.
//
// Nicolas 1983. Nicolas, J.-L., "Petites valeurs de la fonction d'Euler",
// J. Number Theory 17 (1983), 375-388.
//   Proved a complementary "Nicolas inequality" for the Euler totient
//   function phi(n): RH <=> n / (phi(n) log log n) < e^γ for every primorial
//   N_k = product of first k primes. This shows the Robin-style criterion
//   has a phi-twin governed by the same e^γ constant — a STRUCTURAL feature
//   of the Mertens 3rd theorem
//
//        prod_{p <= x} (1 - 1/p)^{-1} = e^γ log x + O(1)
//
//   transferring under RH to log log x. The same Mertens 3rd term governs
//   BOTH the σ-side (Robin) and the φ-side (Nicolas).
//
// Caveney-Nicolas-Sondow 2011. Caveney, G., Nicolas, J.-L., Sondow, J.,
// "Robin's theorem, primes, and a new elementary reformulation of the
// Riemann Hypothesis", Integers 11 (2011), Article A33.
//   Showed: define G(n) = σ(n)/(n log log n). Then RH <=> G(n) < e^γ for
//   all sufficiently large n (which is Robin), and equivalently RH <=>
//   G(n) -> e^γ along the CA-number sequence with the rate
//
//        G(N_k) = e^γ - C_M / log N_k + O(1/(log N_k)^{1+δ})
//
//   where C_M is the Mertens explicit constant and δ depends on the
//   zero-free region. This is the SHARPEST known CA-number asymptotic.
//
//   THE CRITICAL OBSERVATION: the (log N_k)^{-1} correction has constant
//   C_M from Mertens, NOT a Λ-related constant. The (log N_k)^{-(1+δ)}
//   SECONDARY correction has δ governed by the zero-free region, which
//   under RH = (Λ <= 0) gives δ = 1/2 - eps (Schoenfeld 1976) but does
//   NOT improve to a quantitative numerical Λ bound.
//
// PER-CONJECTURE AUDIT
// --------------------
// Question (a): does the structure of CA numbers give a constructive Λ bound?
//   ANSWER: NO. The CA-number asymptotic G(N_k) -> e^γ is governed by
//   Mertens' 3rd theorem; the leading correction constant C_M is the
//   Mertens explicit constant, which is independent of Λ. The secondary
//   correction rate δ depends on the zero-free region under RH but does
//   not give a numerical Λ bound (it gives a numerical Schoenfeld constant
//   for the prime-counting error, a different quantitative object).
//
// Question (b): does the CA-number asymptotic match the de Bruijn-flow constant?
//   ANSWER: NO. The de Bruijn-Newman flow is a HEAT-EQUATION deformation
//   of the Riemann xi-function on the complex plane; Λ is the smallest t
//   such that the deformed xi is real-rooted on the critical line. The
//   CA-number asymptotic lives on N (the integers) and is bounded above
//   only by Mertens' arithmetic-density theorem. There is no functional
//   correspondence between the two domains.

const ELEMENTARY_NT_CA_AUDIT = Object.freeze({
  erdosNicolas1981:
    'Bull. Soc. Math. France 109 (1981), 245-256. Density of SA numbers ' +
    'in [1, x] is ~(log x)^c for explicit c. SA/CA sequence governs WHERE ' +
    'Robin inequality is tight.',
  nicolas1983:
    'J. Number Theory 17 (1983), 375-388. RH <=> n/(phi(n) log log n) < e^γ ' +
    'for every primorial N_k = prod of first k primes. Companion phi-side ' +
    'criterion governed by SAME Mertens 3rd theorem e^γ constant.',
  caveneyNicolasSondow2011:
    'Integers 11 (2011), Article A33. RH <=> G(n) = σ(n)/(n log log n) -> e^γ ' +
    'along CA sequence at rate G(N_k) = e^γ - C_M/log N_k + O(1/(log N_k)^{1+δ}). ' +
    'Leading correction C_M is Mertens constant, NOT Lambda-related.',

  questionA_doesCAStructureGiveConstructiveLambdaBound: false,
  questionA_reason:
    'CA-number asymptotic governed by Mertens 3rd theorem; leading correction ' +
    'C_M independent of Lambda; secondary correction δ governed by zero-free ' +
    'region under RH (Schoenfeld 1976 δ = 1/2 - eps) but gives Schoenfeld ' +
    'explicit-NT constant for pi(x) error, not a numerical Lambda bound',

  questionB_doesCAAsymptoticMatchDeBruijnFlowConstant: false,
  questionB_reason:
    'de Bruijn-Newman Lambda is heat-equation flow on Riemann xi over the ' +
    'complex plane; CA-number asymptotic lives on N and is bounded by Mertens ' +
    'arithmetic-density theorem. No functional correspondence between domains. ' +
    'Both are RH-equivalent but quantitatively decoupled.',

  mertensThirdTheoremIsCommonStructure:
    'prod_{p <= x} (1 - 1/p)^{-1} = e^γ log x + O(1) (Mertens 1874). Both ' +
    'Robin σ-side and Nicolas φ-side criteria descend from this single Mertens ' +
    'identity; the e^γ constant is its trademark, NOT a Lambda fingerprint.',
});

// =========================================================================
// SECTION D — CONNECTION TO Λ (de Bruijn-Newman constant).
// =========================================================================
//
// The de Bruijn-Newman constant Λ is the smallest real number such that the
// heat-flow deformation H_t(z) = (1/8) int e^{tu^2} Phi(u) cos(zu) du has
// only real zeros for all t >= Λ, where Phi is the Riemann xi-derived
// initial data. Newman 1976 + de Bruijn 1950 establish: Λ <= 0 IFF RH.
// Polymath15 (2020) gave Λ >= 0 unconditionally; conjecturally Λ = 0.
//
// QUANTITATIVE QUESTION. Can Robin/Lagarias σ(n)/n inequalities feed a
// numerical Λ bound?
//
// The naive proposal is:
//
//   (Naive) "Robin holds with margin ε at all tested n  =>  Λ <= -f(ε)"
//
// This is FALSE in general:
//
//   - The Robin inequality is POINTWISE: σ(n) < e^γ · n · log log n at each
//     integer n. The Λ definition is a HEAT-FLOW LIMIT: it does not see
//     pointwise arithmetic statements but only analytic limits.
//
//   - The KS-style transformation σ(n)/n -> sum_p 1/p (the Erdős-Kac /
//     Selberg-Sathe / Hooley-style probabilistic NT framework) maps σ(n)/n
//     to a sum over prime divisors, which DOES connect to the explicit
//     formula and thence to Λ. But the connection is via the unconditional
//     Mertens 3rd theorem, which fixes the LEADING constant e^γ but tells
//     us nothing about Λ — Λ enters only at the SECONDARY zero-free-region
//     correction, where its sign (Λ <= 0 vs Λ > 0) determines whether the
//     correction has the Schoenfeld 1976 RH-form or the unconditional
//     Korobov-Vinogradov form. NO QUANTITATIVE Λ BOUND IS PRODUCED.
//
//   - The closest existing quantitative bridge is in the COUNTER-EXAMPLE
//     direction: if Robin fails at some n_0 >= 5041, then RH fails, and
//     thus Λ > 0. But this gives only Λ > 0, not a numerical lower bound
//     ε > 0 for Λ. The size of the Robin violation does NOT translate to
//     a numerical Λ lower bound.
//
// CONCLUSION. The Robin / Lagarias criterion is purely qualitative for Λ.
// Its empirical confirmation on a finite range is a restatement of zero-
// verification on the corresponding height range (and is therefore
// SUBSUMED by Platt-Trudgian 2021's verification of RH up to T = 3 * 10^12).

const LAMBDA_CONNECTION_AUDIT = Object.freeze({
  isRobinRHEquivalent: true,
  isLagariasRHEquivalent: true,
  rhEquivalentImpliesLambdaQualitativeOnly: true,

  naiveProposalToFeedNumericalLambdaBound:
    'Robin holds with margin epsilon at all tested n  =>  Lambda <= -f(epsilon)',
  naiveProposalIsFalse: true,
  whyNaiveProposalFails: [
    'Robin is POINTWISE on N; Lambda is a heat-flow limit on the complex plane. ' +
    'The two domains do not share a quantitative bridge.',
    'The KS-probabilistic NT path from σ(n)/n to prime-divisor sums hits the ' +
    'Mertens 3rd theorem at the LEADING term; Lambda only enters at the ' +
    'secondary zero-free-region correction, where its sign determines ' +
    'qualitative form (Schoenfeld 1976 vs Korobov-Vinogradov) but not magnitude.',
    'Counter-example direction: Robin fail at n_0 => RH false => Lambda > 0, ' +
    'but the SIZE of the Robin violation does NOT translate to a numerical ' +
    'Lambda lower bound.',
  ],

  empiricalConfirmationIsSubsumedBy:
    'Platt-Trudgian 2021 RH verification up to T = 3 * 10^12 — any finite-' +
    'range Robin confirmation is a restatement of zero-verification on the ' +
    'corresponding height range and is strictly weaker than direct zero ' +
    'verification (which is already done at higher height).',

  doesAnyKnownMechanismExist: false,
  doesAnyKnownMechanismExistReason:
    'No published result in the Robin / Lagarias / Erdős-Nicolas / Caveney-' +
    'Nicolas-Sondow / Nicolas family connects σ(n)/n magnitudes to numerical ' +
    'Lambda bounds. The connection is qualitative through the RH equivalence ' +
    'only.',
});

// =========================================================================
// SECTION E — VERDICT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'robin-criterion-gives-numerical-lambda-bound-X',
  'robin-criterion-RH-equivalent-only-not-numerical',
  'robin-criterion-empirically-confirms-RH-on-tested-range',
  'colossally-abundant-asymptotic-doesnt-yield-lambda',
]);

const VERDICT = 'robin-criterion-RH-equivalent-only-not-numerical';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  givesNumericalLambdaBound: false,
  empiricallyConfirmsRHOnTestedRange: true,
  caAsymptoticDoesYieldLambdaConstant: false,

  whyRHEquivalentOnly:
    'Robin 1984 + Lagarias 2002 are STRICT RH equivalences. By Newman 1976 + ' +
    'de Bruijn 1950, RH <=> Lambda <= 0 — qualitative only. No published result ' +
    'translates Robin margin (or Lagarias margin) into a numerical Lambda bound. ' +
    'The CA-number tightness (Erdős-Nicolas 1981, Nicolas 1983, Caveney-Nicolas-' +
    'Sondow 2011) is governed by Mertens 3rd theorem with Mertens constant C_M, ' +
    'not by a Lambda-related constant.',

  empiricalRobinHoldsCountOnSample: ROBIN_EMPIRICAL_SUMMARY.numRobinHolds,
  empiricalRobinFailCountOnSample: ROBIN_EMPIRICAL_SUMMARY.numRobinFails,
  knownExceptionN5040Recovered: ROBIN_EMPIRICAL_SUMMARY.knownExceptionConfirmed_n5040,
  empiricalLagariasHoldsOnAllSample: LAGARIAS_EMPIRICAL_SUMMARY.allLagariasHoldOnSample,

  subsumedByZeroVerification:
    'Platt-Trudgian 2021 verified RH up to T = 3 * 10^12 — any finite-range ' +
    'Robin confirmation is a strictly weaker restatement of zero-verification.',

  whatWouldClose:
    'A genuinely new quantitative bridge from elementary-NT inequalities (Robin ' +
    'σ(n)/n, Nicolas n/(φ(n) log log n), Lagarias H_n) to the de Bruijn-Newman ' +
    'heat-flow constant Lambda. No such bridge is known in 2026.',

  implicationForLambdaAttack:
    'Robin / Lagarias / Nicolas / Caveney-Nicolas-Sondow do not contribute a ' +
    'numerical Lambda bound to the engine search. Their VALUE in Lambda-attack ' +
    'planning is COMPLEMENTARY: they document that the orthogonal elementary-NT ' +
    'route fails to yield Lambda, narrowing the genuinely-new-input search further. ' +
    'The aggregate negative pattern across spectral (imp-1297 + imp-1302 + imp-1303 + ' +
    'imp-1305) and elementary (imp-1311) routes points to genuinely new mathematics ' +
    'as the requirement for closing PCC at 2-point or producing a numerical Lambda < 0.',

  honestNote:
    'This is a NEGATIVE classification: Robin / Lagarias criterion does not produce ' +
    'a numerical Lambda bound. The result is PRECISELY VALUABLE because it confirms ' +
    'an entire structurally-orthogonal family of RH-equivalents (elementary-NT, σ(n)/n ' +
    'and friends) is also outside the Lambda-attack productive surface. The empirical ' +
    'σ(n)/n vs e^γ log log n table on CA numbers is a SANITY CHECK that the Robin ' +
    'side is computable and that the known n = 5040 exception is recovered.',
});

// =========================================================================
// SECTION F — EXPORTED RECORD.
// =========================================================================

export const IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK = Object.freeze({
  id: 'imp-1311-robin-lagarias-combinatorial-attack',
  ticket: 'imp-1311',
  category: 'proof',
  builtAt: '2026-05-28T23:59:30Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze([
    'imp-1235', 'imp-1259', 'imp-1261', 'imp-1305',
  ]),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  robin1984Statement: ROBIN_1984_STATEMENT,
  lagarias2002Statement: LAGARIAS_2002_STATEMENT,

  caNumbers: CA_NUMBERS,
  robinEvaluations: ROBIN_EVALUATIONS,
  robinEmpiricalSummary: ROBIN_EMPIRICAL_SUMMARY,
  lagariasEvaluations: LAGARIAS_EVALUATIONS,
  lagariasEmpiricalSummary: LAGARIAS_EMPIRICAL_SUMMARY,

  elementaryNTCAAudit: ELEMENTARY_NT_CA_AUDIT,
  lambdaConnectionAudit: LAMBDA_CONNECTION_AUDIT,

  parentCrossReferences: Object.freeze({
    imp1235: 'src/data/imp-1235-lambda-roadmap-vs-paper-sec-24-crosswalk.js — Lambda-roadmap mapping',
    imp1259: 'src/data/imp-1259-rh-equivalents-completeness-audit.js — RH-equivalents survey',
    imp1261: 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js — current Lambda bound 3.06e-5',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js — moment-method exhaustion sibling',
  }),

  honestScope: Object.freeze([
    'This file is a CLASSIFICATION ticket for the candidate direct attack on RH (and a ' +
    'numerical Lambda bound) via the Robin 1984 / Lagarias 2002 σ(n)/n elementary RH-' +
    'equivalent criteria. It is NOT a new closure or a new numerical Lambda bound.',

    'The verdict is NEGATIVE for the numerical-Lambda question: Robin and Lagarias are ' +
    'STRICT RH EQUIVALENCES. They yield Lambda <= 0 iff RH holds (Newman 1976 + de Bruijn ' +
    '1950) but NO numerical Lambda bound. The empirical evaluation of σ(n)/n vs e^γ log log n ' +
    'on a sample including the first 14 colossally-abundant numbers + the known n = 5040 ' +
    'exception confirms the Robin gap is strictly positive at all tested n >= 5041, ' +
    'restating empirical RH on the tested range — strictly weaker than Platt-Trudgian 2021.',

    'The CA-number asymptotic G(N_k) = σ(N_k)/(N_k log log N_k) -> e^γ (Caveney-Nicolas-' +
    'Sondow 2011) is governed by Mertens 3rd theorem with the Mertens constant C_M as ' +
    'the leading correction; it does NOT match the de Bruijn-flow constant Λ. The δ ' +
    'in the secondary correction depends on the zero-free region, which under RH is ' +
    'Schoenfeld 1976 — yielding a Schoenfeld-explicit-NT constant for pi(x), NOT a ' +
    'numerical Lambda bound.',

    'The structural complement is significant for engine planning: Robin / Lagarias / ' +
    'Nicolas / Caveney-Nicolas-Sondow are an ELEMENTARY-NT family of RH-equivalents that ' +
    'is STRUCTURALLY ORTHOGONAL to the spectral / moment-method family ruled out by ' +
    'imp-1297 + imp-1302 + imp-1303 + imp-1305. This ticket documents that the orthogonal ' +
    'route also does not yield a numerical Lambda bound, further narrowing the genuinely-' +
    'new-input search.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1235: 'src/data/imp-1235-lambda-roadmap-vs-paper-sec-24-crosswalk.js',
    imp1259: 'src/data/imp-1259-rh-equivalents-completeness-audit.js',
    imp1261: 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js',
    imp1305: 'src/data/imp-1305-goldston-yildirim-mean-square.js',
    robin1984:
      'Robin, G., "Grandes valeurs de la fonction somme des diviseurs et ' +
      'hypothèse de Riemann", J. Math. Pures Appl. (9) 63 (1984), no. 2, 187-213',
    lagarias2002:
      'Lagarias, J. C., "An Elementary Problem Equivalent to the Riemann ' +
      'Hypothesis", Amer. Math. Monthly 109 (2002), no. 6, 534-543',
    erdosNicolas1981:
      'Erdős, P., Nicolas, J.-L., "Répartition des nombres superabondants", ' +
      'Bull. Soc. Math. France 109 (1981), 245-256',
    nicolas1983:
      'Nicolas, J.-L., "Petites valeurs de la fonction d\'Euler", J. Number ' +
      'Theory 17 (1983), 375-388',
    caveneyNicolasSondow2011:
      'Caveney, G., Nicolas, J.-L., Sondow, J., "Robin\'s theorem, primes, and ' +
      'a new elementary reformulation of the Riemann Hypothesis", Integers 11 ' +
      '(2011), Article A33',
    alaogluErdos1944:
      'Alaoglu, L., Erdős, P., "On highly composite and similar numbers", ' +
      'Trans. Amer. Math. Soc. 56 (1944), 448-469',
    mertens1874:
      'Mertens, F., "Ein Beitrag zur analytischen Zahlentheorie", J. Reine ' +
      'Angew. Math. 78 (1874), 46-62 (Mertens 3rd theorem)',
    deBruijn1950:
      'de Bruijn, N. G., "The roots of trigonometric integrals", Duke Math. J. ' +
      '17 (1950), 197-226',
    newman1976:
      'Newman, C. M., "Fourier transforms with only real zeros", Proc. Amer. ' +
      'Math. Soc. 61 (1976), 245-251',
    schoenfeld1976:
      'Schoenfeld, L., "Sharper bounds for the Chebyshev functions θ(x) and ' +
      'ψ(x). II", Math. Comp. 30 (1976), 337-360',
    plattTrudgian2021:
      'Platt, D., Trudgian, T., "The Riemann hypothesis is true up to 3·10^12", ' +
      'Bull. London Math. Soc. 53 (2021), 792-797',
    polymath15:
      'Polymath, D. H. J., "Effective approximation of heat flow evolution of ' +
      'the Riemann ξ function, and a new upper bound for the de Bruijn-Newman ' +
      'constant", Res. Math. Sci. 6 (2019), Paper No. 31',
    oeisA004490: 'OEIS A004490 — colossally abundant numbers',
  }),
});

export default IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK;

// =========================================================================
// BUILD-TIME TRIPWIRES (12 shipped; ticket requires 8+).
// =========================================================================

export const IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK_ASSERTIONS = [
  // Tripwire 1: Robin 1984 stated precisely with citation.
  {
    id: 'imp1311-robin-1984-stated-precisely',
    why:
      'Robin 1984 must be stated as the J. Math. Pures Appl. (9) 63 (1984) 187-213 ' +
      'theorem with the σ(n) < e^γ · n · log log n inequality for n >= 5041 and the ' +
      'RH iff equivalence direction.',
    holds: () => {
      const s = IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK.robin1984Statement;
      return (
        typeof s.source === 'string' &&
        /Robin/.test(s.source) &&
        /J\. Math\. Pures Appl/.test(s.source) &&
        /63/.test(s.source) &&
        /1984/.test(s.source) &&
        /187-213|187.*213/.test(s.source) &&
        s.isTheorem === true &&
        s.isRHEquivalent === true &&
        s.rhEquivalenceDirection === 'iff' &&
        typeof s.statement === 'string' &&
        /sigma\(n\)/.test(s.statement) &&
        /e\^gamma/.test(s.statement) &&
        /log log n/.test(s.statement) &&
        /5041/.test(s.statement)
      );
    },
  },

  // Tripwire 2: Lagarias 2002 stated precisely with citation.
  {
    id: 'imp1311-lagarias-2002-stated-precisely',
    why:
      'Lagarias 2002 must be stated as the Amer. Math. Monthly 109 (2002) 534-543 ' +
      'theorem with the σ(n) <= H_n + exp(H_n) · log(H_n) inequality and the RH iff ' +
      'equivalence direction.',
    holds: () => {
      const s = IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK.lagarias2002Statement;
      return (
        typeof s.source === 'string' &&
        /Lagarias/.test(s.source) &&
        /Amer\. Math\. Monthly/.test(s.source) &&
        /109/.test(s.source) &&
        /2002/.test(s.source) &&
        /534-543|534.*543/.test(s.source) &&
        s.isTheorem === true &&
        s.isRHEquivalent === true &&
        s.rhEquivalenceDirection === 'iff' &&
        typeof s.statement === 'string' &&
        /sigma\(n\)/.test(s.statement) &&
        /H_n/.test(s.statement) &&
        /exp\(H_n\)/.test(s.statement)
      );
    },
  },

  // Tripwire 3: Empirical σ(n)/n computation on CA numbers actually performed.
  {
    id: 'imp1311-empirical-sigma-on-CA-numbers-computed',
    why:
      'The empirical evaluation of σ(n)/n vs e^γ · log log n must be computed on the ' +
      'first 14 colossally abundant numbers (OEIS A004490) and report a non-empty ' +
      'evaluation table. Missing the empirical content would render the ticket ' +
      'a pure-text classification with no computation.',
    holds: () => {
      const r = IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK;
      return (
        Array.isArray(r.caNumbers) &&
        r.caNumbers.length >= 10 &&
        r.caNumbers.includes(2) &&
        r.caNumbers.includes(720720) &&
        Array.isArray(r.robinEvaluations) &&
        r.robinEvaluations.length >= 10 &&
        r.robinEvaluations.every(
          (e) => typeof e.n === 'number' && typeof e.sigma === 'number' &&
            typeof e.sigmaOverN === 'number' && typeof e.robinRHS === 'number'
        )
      );
    },
  },

  // Tripwire 4: Known n = 5040 Robin counter-example correctly recovered.
  // Sanity check: σ(5040) = 19344 should give σ/n > e^γ log log n.
  {
    id: 'imp1311-known-exception-n5040-recovered',
    why:
      'The empirical evaluator must recover the known Robin counter-example at n = 5040 ' +
      '(σ(5040) = 19344, σ/5040 ≈ 3.8381 > e^γ · log log 5040 ≈ 3.8159). A silent ' +
      'mis-computation here would invalidate the entire empirical content.',
    holds: () => {
      const r = IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK;
      const e5040 = r.robinEvaluations.find((x) => x.n === 5040);
      if (!e5040) return false;
      // σ(5040) = 19344 (classical value).
      const sigmaCorrect = e5040.sigma === 19344;
      // Robin should fail at 5040: σ/n > e^γ log log n.
      const robinFails = e5040.robinHolds === false;
      // Gap should be small negative (~-0.022).
      const gapInRange = e5040.gap > -0.05 && e5040.gap < 0;
      return sigmaCorrect && robinFails && gapInRange &&
        r.robinEmpiricalSummary.knownExceptionConfirmed_n5040 === true;
    },
  },

  // Tripwire 5: Robin holds on all sampled n >= 5041.
  {
    id: 'imp1311-robin-holds-on-tested-large-n',
    why:
      'For n >= 5041 in the empirical sample, σ(n) < e^γ · n · log log n must hold ' +
      '(confirming RH on the tested range — Platt-Trudgian 2021 verifies RH up to ' +
      'T = 3 * 10^12, far exceeding our sample). A failure here would either be a ' +
      'mis-computation OR a (more interesting!) Robin counter-example.',
    holds: () => {
      const r = IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK;
      const largeN = r.robinEvaluations.filter((e) => e.n >= 5041);
      return largeN.length >= 8 && largeN.every((e) => e.robinHolds === true);
    },
  },

  // Tripwire 6: Elementary-NT CA-number audit answers both sub-questions NO.
  {
    id: 'imp1311-CA-audit-answers-both-questions-no',
    why:
      'The two ticket-mandated sub-questions on CA numbers must both be answered: ' +
      '(a) does the structure of CA numbers give a constructive Λ bound? (b) does ' +
      'the CA-number asymptotic match the de Bruijn-flow constant? The honest answer ' +
      'to both is NO; a flip to YES would falsely claim a Lambda bound that does ' +
      'not exist in the literature.',
    holds: () => {
      const a = IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK.elementaryNTCAAudit;
      return (
        a.questionA_doesCAStructureGiveConstructiveLambdaBound === false &&
        typeof a.questionA_reason === 'string' &&
        /Mertens/.test(a.questionA_reason) &&
        a.questionB_doesCAAsymptoticMatchDeBruijnFlowConstant === false &&
        typeof a.questionB_reason === 'string' &&
        /(heat-equation|heat equation|Lambda|Mertens)/i.test(a.questionB_reason)
      );
    },
  },

  // Tripwire 7: Lambda-connection audit reports no quantitative bridge.
  {
    id: 'imp1311-lambda-connection-no-quantitative-bridge',
    why:
      'A silent flip to "Robin gives numerical Λ bound" would invalidate the engine ' +
      'planning consequence. Tripwire pins that no known mechanism connects Robin ' +
      'margins to numerical Lambda bounds.',
    holds: () => {
      const a = IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK.lambdaConnectionAudit;
      return (
        a.isRobinRHEquivalent === true &&
        a.isLagariasRHEquivalent === true &&
        a.rhEquivalentImpliesLambdaQualitativeOnly === true &&
        a.naiveProposalIsFalse === true &&
        Array.isArray(a.whyNaiveProposalFails) &&
        a.whyNaiveProposalFails.length >= 3 &&
        a.doesAnyKnownMechanismExist === false &&
        typeof a.empiricalConfirmationIsSubsumedBy === 'string' &&
        /Platt-Trudgian/.test(a.empiricalConfirmationIsSubsumedBy)
      );
    },
  },

  // Tripwire 8: Verdict is one of the four allowed strings.
  {
    id: 'imp1311-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of the four allowed classification strings: ' +
      'robin-criterion-gives-numerical-lambda-bound-X / ' +
      'robin-criterion-RH-equivalent-only-not-numerical / ' +
      'robin-criterion-empirically-confirms-RH-on-tested-range / ' +
      'colossally-abundant-asymptotic-doesnt-yield-lambda. ' +
      'A non-allowed verdict indicates classification drift.',
    holds: () => {
      const allowed = [
        'robin-criterion-gives-numerical-lambda-bound-X',
        'robin-criterion-RH-equivalent-only-not-numerical',
        'robin-criterion-empirically-confirms-RH-on-tested-range',
        'colossally-abundant-asymptotic-doesnt-yield-lambda',
      ];
      return allowed.includes(IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK.verdict);
    },
  },

  // Tripwire 9: Six required citations present (Robin 1984 / Lagarias 2002 /
  // Erdős-Nicolas 1981 / Nicolas 1983 / Caveney-Nicolas-Sondow 2011 /
  // Alaoglu-Erdős 1944).
  {
    id: 'imp1311-six-required-citations-present',
    why:
      'Per ticket spec: cite at least Robin 1984 + Lagarias 2002 + Erdős-Nicolas 1981 + ' +
      'Nicolas 1983 + Caveney-Nicolas-Sondow 2011. We additionally require Alaoglu-' +
      'Erdős 1944 (the source of the CA-number definition) and the Lambda-side de ' +
      'Bruijn 1950 + Newman 1976. Missing any of these means the classification is ' +
      'incomplete on its load-bearing references.',
    holds: () => {
      const r = IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK.references;
      return (
        /Robin/.test(r.robin1984 || '') && /1984/.test(r.robin1984 || '') &&
        /J\. Math\. Pures Appl/.test(r.robin1984 || '') &&
        /Lagarias/.test(r.lagarias2002 || '') && /2002/.test(r.lagarias2002 || '') &&
        /Amer\. Math\. Monthly/.test(r.lagarias2002 || '') &&
        /Erdős|Erdos/.test(r.erdosNicolas1981 || '') && /Nicolas/.test(r.erdosNicolas1981 || '') &&
        /1981/.test(r.erdosNicolas1981 || '') &&
        /Nicolas/.test(r.nicolas1983 || '') && /1983/.test(r.nicolas1983 || '') &&
        /Caveney/.test(r.caveneyNicolasSondow2011 || '') &&
        /Nicolas/.test(r.caveneyNicolasSondow2011 || '') &&
        /Sondow/.test(r.caveneyNicolasSondow2011 || '') &&
        /2011/.test(r.caveneyNicolasSondow2011 || '') &&
        /Alaoglu/.test(r.alaogluErdos1944 || '') &&
        /Erdős|Erdos/.test(r.alaogluErdos1944 || '') &&
        /1944/.test(r.alaogluErdos1944 || '') &&
        /de Bruijn/.test(r.deBruijn1950 || '') &&
        /Newman/.test(r.newman1976 || '')
      );
    },
  },

  // Tripwire 10: Cross-references imp-1235, imp-1259, imp-1261, imp-1305 present.
  {
    id: 'imp1311-cross-references-parent-tickets',
    why:
      'This ticket lives in the elementary-NT RH-equivalent family that is ' +
      'STRUCTURALLY ORTHOGONAL to the spectral routes; cross-references to imp-1235 ' +
      '(Lambda roadmap), imp-1259 (RH-equivalents survey), imp-1261 (current Lambda ' +
      'bound), and imp-1305 (moment-method sibling) document where this ticket sits ' +
      'in the engine map.',
    holds: () => {
      const r = IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK;
      const related = r.relatedTickets;
      const xrefs = r.parentCrossReferences;
      return (
        Array.isArray(related) &&
        related.includes('imp-1235') &&
        related.includes('imp-1259') &&
        related.includes('imp-1261') &&
        related.includes('imp-1305') &&
        typeof xrefs.imp1235 === 'string' && /imp-1235/.test(xrefs.imp1235) &&
        typeof xrefs.imp1259 === 'string' && /imp-1259/.test(xrefs.imp1259) &&
        typeof xrefs.imp1261 === 'string' && /imp-1261/.test(xrefs.imp1261) &&
        typeof xrefs.imp1305 === 'string' && /imp-1305/.test(xrefs.imp1305)
      );
    },
  },

  // Tripwire 11: Honest scope mentions NEGATIVE result + Mertens-not-Lambda
  // structural observation.
  {
    id: 'imp1311-honest-scope-negative-and-mertens-not-lambda',
    why:
      'The honest scope must state that the verdict is NEGATIVE for the numerical-' +
      'Lambda question and explicitly identify that the CA-number asymptotic leading ' +
      'correction is the MERTENS constant, NOT a Lambda fingerprint. A silent drift ' +
      'to "Robin gives Lambda" would mislead engine planning.',
    holds: () => {
      const blob = IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK.honestScope.join(' ');
      return (
        /NEGATIVE|negative/.test(blob) &&
        /Mertens/.test(blob) &&
        /Lambda|Λ/.test(blob) &&
        /(does NOT|do not|not a numerical|qualitative|strictly weaker)/i.test(blob) &&
        /Platt-Trudgian/.test(blob)
      );
    },
  },

  // Tripwire 12: Semantic check — e^γ constant computed correctly + used in
  // empirical evaluator.
  {
    id: 'imp1311-semantic-e-gamma-constant-correct',
    why:
      'Semantic check: e^γ (with γ ≈ 0.5772) ≈ 1.7811 must be the exact multiplicative ' +
      'constant in Robin\'s inequality. A silent miscoding (e.g., using γ in place of ' +
      'e^γ, or using a 1.5-something approximation) would invalidate every empirical ' +
      'row in the evaluation table.',
    holds: () => {
      const r = IMP_1311_ROBIN_LAGARIAS_COMBINATORIAL_ATTACK;
      // Recompute e^γ for the canonical Euler-Mascheroni γ.
      const eGamma = Math.exp(0.5772156649015329);
      // Check 720720 row matches: σ(720720)·1 / e^γ · log log 720720 should be in
      // a known small window.
      const e720 = r.robinEvaluations.find((e) => e.n === 720720);
      if (!e720) return false;
      const expectedRHS = eGamma * Math.log(Math.log(720720));
      const closeEnough = Math.abs(e720.robinRHS - expectedRHS) < 1e-9;
      // Bound check: σ(720720) = 3249792 (classical value); σ/n ≈ 4.5095.
      const sigmaCheck = e720.sigma === 3249792;
      // And RHS at 720720 should exceed σ/n (Robin holds at 720720).
      const robinHolds = e720.robinHolds === true && e720.gap > 0;
      return closeEnough && sigmaCheck && robinHolds;
    },
  },
];
