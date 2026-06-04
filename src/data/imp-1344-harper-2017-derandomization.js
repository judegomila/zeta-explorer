/**
 * @module imp-1344-harper-2017-derandomization
 * @fileoverview imp-1344 — NEW-INPUT classification: can Harper-type
 *   results on RANDOM multiplicative functions (the "RH for typical chi"
 *   body of work, Steinhaus / Rademacher ensembles, Harper 2019-2020) be
 *   DERANDOMIZED to the single deterministic Riemann zeta function?
 *
 *   PREMISE CORRECTION (HONEST)
 *   ---------------------------
 *   The ticket states "Harper 2017 proved RH for RANDOM Dirichlet
 *   characters chi (typical chi in Steinhaus or Rademacher sense)." This
 *   is an IMPRECISE statement of the actual literature and we correct it
 *   before classifying. There is NO standard theorem literally proving the
 *   Riemann Hypothesis for random characters. The rigorous body of work the
 *   ticket gestures at is:
 *
 *     [Harper2020] A. J. Harper, "Moments of random multiplicative
 *       functions, I: Low moments, better than squareroot cancellation"
 *       (Annals of Math. 192 (2020), 539-609). For f a Steinhaus or
 *       Rademacher random (completely) multiplicative function, the partial
 *       sum M(x) = sum_{n <= x} f(n) exhibits BETTER-THAN-SQUAREROOT
 *       cancellation: typical size x^{1/2} / (log log x)^{1/4}, governed by
 *       critical Gaussian multiplicative chaos.
 *
 *     [Harper2019] A. J. Harper, "Moments of random multiplicative
 *       functions, II: High moments" and related (Duke / Forum Math.).
 *
 *   These are statements about the TYPICAL SIZE and DISTRIBUTION of sums of
 *   a RANDOM ensemble. The random multiplicative function f is a MODEL
 *   (Wintner 1944, Keating-Snaith 2000 philosophy) for the Mobius function
 *   mu, the Liouville function lambda, character sums sum chi(n), and for
 *   zeta(1/2 + it). The "RH-analogue" for a random Euler product
 *   L_f(s) = prod_p (1 - f(p) p^{-s})^{-1} can be studied (Aymone, Heap,
 *   Zhai and others), and an ALMOST-SURE zero-free-region analogue can be
 *   established — but always via the INDEPENDENCE of the {f(p)}.
 *
 *   The honest reframing of the ticket question is therefore:
 *
 *     Can the almost-sure / typical-realization control that the random
 *     multiplicative-function ensemble enjoys be transferred to the SINGLE
 *     DETERMINISTIC realization that the Riemann zeta function is?
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'harper-random-not-derandomizable-to-deterministic-riemann'
 *
 *   The random-ensemble control does NOT derandomize to deterministic
 *   Riemann zeta for FOUR independent structural reasons:
 *
 *   (D1) ENSEMBLE-vs-REALIZATION (typical / worst-case) MISMATCH. Harper-
 *        type results are almost-sure / in-distribution statements over a
 *        random ensemble. zeta is a SINGLE deterministic object — one
 *        fixed realization. A "typical realization" statement carries NO
 *        information about any SPECIFIC realization, because the exceptional
 *        set, while of probability zero, is non-empty and could contain the
 *        deterministic point. zeta is not "sampled" from Harper's ensemble:
 *        its Euler phases p^{-it} = e^{-i t log p} are deterministic
 *        functions of one real parameter t, not iid random signs/phases.
 *
 *   (D2) INDEPENDENCE IS THE LOAD-BEARING INPUT AND IS FALSE FOR zeta. The
 *        whole Harper apparatus (the martingale / critical Gaussian
 *        multiplicative chaos structure that delivers better-than-
 *        squareroot cancellation) rests on the INDEPENDENCE of {f(p)}_p
 *        (Steinhaus: iid uniform on the unit circle; Rademacher: iid +/-1).
 *        For zeta the analogue "random phases" are p^{-it}; as a function
 *        of the single variable t these are jointly equidistributed
 *        (Kronecker-Weyl) but RIGIDLY ARITHMETICALLY CORRELATED, NOT
 *        independent. The independence that powers Harper is structurally
 *        absent on the deterministic side.
 *
 *   (D3) WRONG OBSERVABLE: PARTIAL-SUM SIZE vs ZERO LOCATION. Harper bounds
 *        the SIZE of partial sums / moments. RH is a statement about the
 *        LOCATION OF ZEROS of zeta(s). Even the random-Euler-product
 *        RH-analogue (zero-free region of L_f almost surely) is proved by
 *        Borel-Cantelli + second-moment estimates that, again, consume the
 *        INDEPENDENCE of {f(p)}. The translation size-bound -> zero-free
 *        region is itself probabilistic and does not survive fixing a
 *        single realization.
 *
 *   (D4) VORONIN UNIVERSALITY RUNS THE WRONG WAY. Voronin 1975 universality
 *        (zeta approximates any zero-free target on compacts in the strip
 *        1/2 < Re s < 1) is a DENSITY / approximation statement that is
 *        itself PROVED using mean-value / zero-distribution inputs and is
 *        valid precisely because the target is required ZERO-FREE. It
 *        cannot CERTIFY that zeta avoids zeros in any region — using it to
 *        import a random-model conclusion is circular: universality does
 *        not produce zero-freeness, it presupposes the genericity it would
 *        need to prove.
 *
 *   HONEST UNCERTAINTY NOTE ON THE TICKET PREMISE
 *   ---------------------------------------------
 *   Training-time knowledge cutoff is January 2026. The phrase
 *   "Harper 2017 proved RH for random chi" is NOT a recognized theorem at
 *   training-cutoff; the closest rigorous results are the Harper 2019-2020
 *   random-multiplicative-function moment theorems and the random-Euler-
 *   product RH-analogue literature. If a specific Harper-2017 paper proving
 *   a literal RH statement for a random character family exists and DOES
 *   admit a derandomization not captured by the (D1)-(D4) structural
 *   analysis here, this classification is OPEN-FOR-REVISION. The (D1)-(D4)
 *   obstructions are robust to the exact form because they identify load-
 *   bearing layer-level facts (independence, ensemble-vs-realization,
 *   observable mismatch, universality directionality) that ANY random ->
 *   deterministic transfer for zeta must traverse.
 *
 *   USEFUL OUTPUT
 *   -------------
 *   - Premise correction: precise statement of the closest-known rigorous
 *     Harper results, distinguished from the ticket's literal phrasing.
 *   - Walk through (a) what the random argument controls, (b) which
 *     features are essentially non-deterministic, (c) whether a hybrid
 *     semi-deterministic version applies to zeta via Voronin universality.
 *   - Four named derandomization obstructions (D1)-(D4).
 *   - Verdict in the allowed set with honest scope on the ticket premise.
 *
 *   @see imp-1184 src/data/imp-1184-direct-selberg-esy-route-audit.js
 *   @see imp-1247 src/data/imp-1247-shared-pcc-obstruction-recheck.js
 *   @see imp-1309 src/data/imp-1309-tao-entropy-pcc-attack.js (parallel
 *        NEW-INPUT classification, entropy-method family)
 *
 *   Ticket: imp-1344 (proof, medium, NEW-INPUT CLASSIFICATION).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// =========================================================================
// SECTION A - CLOSEST-KNOWN HARPER STATEMENT (premise correction).
// =========================================================================
//
// HONEST TRAINING-TIME SCOPE. The exact reference "Harper 2017, RH for
// random chi" is NOT a recognized theorem at training-cutoff (January
// 2026). The closest-known rigorous results in the random-multiplicative-
// function family that COULD underwrite the ticket framing are:
//
//   [Harper2020] A. J. Harper, "Moments of random multiplicative
//     functions, I", Annals 192 (2020). For a Steinhaus random multipli-
//     cative function f (f(p) iid uniform on the unit circle, extended
//     completely multiplicatively) the partial sum M(x) = sum_{n<=x} f(n)
//     satisfies, for 0 < q < 1,
//
//       E |M(x)|^{2q} asymptotic ( x / (1 + (1-q) sqrt(log log x)) )^{q}
//
//     i.e. BETTER-THAN-SQUAREROOT cancellation; typical |M(x)| about
//     x^{1/2} / (log log x)^{1/4}. The mechanism is critical Gaussian
//     multiplicative chaos (the Euler product on the 1/2-line is a
//     multiplicative chaos in the log-correlated field log|f| picture).
//
//   [RandomEuler] The random Euler product L_f(s) = prod_p (1 - f(p)
//     p^{-s})^{-1} has an ALMOST-SURE analytic continuation and an
//     ALMOST-SURE zero-free half-plane Re s > 1/2 + epsilon results
//     (Aymone-Heap-Zhai-type), all proved via the INDEPENDENCE of the
//     {f(p)} (second-moment + Borel-Cantelli).
//
//   [KeatingSnaith2000] J. P. Keating, N. C. Snaith, "Random matrix
//     theory and zeta(1/2 + it)", Comm. Math. Phys. 214 (2000). The
//     random-matrix / random-multiplicative MODEL for zeta value
//     distribution — a HEURISTIC correspondence, NOT a derandomization.
//
// CRUCIAL OBSERVATION. Every rigorous statement above is either (i) about
// the TYPICAL SIZE of a RANDOM sum, or (ii) an ALMOST-SURE property of a
// RANDOM Euler product. None is a deterministic statement about zeta, and
// each consumes the INDEPENDENCE of {f(p)} at a load-bearing step.

const HARPER_STATEMENT = Object.freeze({
  source:
    'CLOSEST-KNOWN: Harper 2020 (Annals 192) better-than-squareroot ' +
    'cancellation for moments of random multiplicative functions; random ' +
    'Euler product almost-sure zero-free-region analogue (Aymone-Heap-Zhai ' +
    'type); Keating-Snaith 2000 random-matrix model for zeta(1/2+it). The ' +
    'literal "Harper 2017 RH for random chi" reference is NOT recognized at ' +
    'training-cutoff (January 2026)',

  isTrainingTimePremiseUncertain: true,
  premiseCorrectionNote:
    'The ticket phrase "Harper 2017 proved RH for random chi" is imprecise. ' +
    'No standard theorem proves a literal RH for random characters. The ' +
    'rigorous content is the typical-size / almost-sure distributional ' +
    'control of a RANDOM ensemble (Harper 2019-2020 moments; random-Euler- ' +
    'product analogue). The classification corrects the premise and asks the ' +
    'well-posed question: can almost-sure ensemble control transfer to the ' +
    'single deterministic realization that zeta is.',

  closestKnownRandomResultClass:
    'Harper 2020 better-than-squareroot cancellation: typical |M(x)| about ' +
    'x^{1/2} / (log log x)^{1/4}, governed by critical Gaussian multiplicative ' +
    'chaos; random Euler product almost-sure zero-free half-plane via ' +
    'second-moment + Borel-Cantelli',

  loadBearingProbabilisticInput:
    'INDEPENDENCE of {f(p)}_p (Steinhaus: iid uniform on unit circle; ' +
    'Rademacher: iid +/-1). Drives the martingale / Gaussian multiplicative ' +
    'chaos structure and the Borel-Cantelli zero-free-region argument',

  whatIsControlled:
    'TYPICAL SIZE of random partial sums sum_{n<=x} f(n) and ALMOST-SURE ' +
    'properties of the random Euler product L_f',

  whatIsNOTControlled:
    'The location of zeros of the single deterministic zeta(s); no ' +
    'almost-sure statement constrains a fixed (probability-zero) realization',
});

// =========================================================================
// SECTION B - (a) WHAT THE RANDOM ARGUMENT CONTROLS, (b) WHICH FEATURES
//             ARE ESSENTIALLY NON-DETERMINISTIC, (c) HYBRID VIA VORONIN.
// =========================================================================
//
// (a) WHAT DOES THE HARPER ARGUMENT CONTROL?
//
//   The partial sum M(x) = sum_{n<=x} f(n) of a random multiplicative
//   function, and the moments E|M(x)|^{2q}. The control is on TYPICAL SIZE
//   (in distribution, and almost surely along subsequences). It says the
//   random object cancels better than squareroot. It does NOT control the
//   zeros of any associated Dirichlet series for a FIXED realization.
//
// (b) WHICH FEATURES ARE ESSENTIALLY NON-DETERMINISTIC?
//
//   The INDEPENDENCE of {f(p)} is essential and is the feature that fails
//   on the deterministic side. Three consequences of independence are used:
//
//     - SECOND-MOMENT ORTHOGONALITY: E[f(m) conj(f(n))] = [m = n], i.e.
//       the random characters are orthonormal. For zeta the deterministic
//       analogue p^{-it} has NO such orthogonality at a fixed t.
//
//     - MARTINGALE / CHAOS STRUCTURE: the Euler product over primes up to
//       a cutoff is a martingale in the cutoff, with independent increments.
//       The deterministic Euler product of zeta at a fixed t is a single
//       number, not a martingale with a probability space behind it.
//
//     - BOREL-CANTELLI: almost-sure zero-free regions for L_f come from
//       summable tail probabilities. A single deterministic point has no
//       tail to sum; Borel-Cantelli is vacuous for a fixed realization.
//
//   These are ESSENTIALLY NON-DETERMINISTIC: each is a property of the
//   probability measure on the ensemble, not of any single member.
//
// (c) IS THERE A HYBRID SEMI-DETERMINISTIC VERSION VIA VORONIN?
//
//   Voronin 1975 universality: for any compact K in the strip
//   1/2 < Re s < 1 and any continuous ZERO-FREE g on K, zeta approximates
//   g uniformly on K along a positive-density set of vertical shifts. One
//   might hope to "import" a random-model conclusion by realizing the
//   random target inside zeta via universality. This FAILS for two reasons:
//
//     - DIRECTIONALITY. Universality is proved FROM zero-distribution and
//       mean-value inputs (the very inputs an RH proof would have to
//       supply). It PRESUPPOSES the genericity it would be used to prove;
//       it cannot certify zero-freeness of zeta in any region.
//
//     - ZERO-FREE TARGET CONSTRAINT. Universality only approximates
//       ZERO-FREE targets. It can never witness that zeta itself avoids a
//       zero — the approximation breaks exactly at a putative zero. So the
//       hybrid route cannot transfer a "no zeros" conclusion.
//
//   The best HONEST hybrid is the "almost-all t" family of results (e.g.
//   for almost all t the local behaviour matches the conjectured model).
//   But "almost all t" in a measure sense STILL does not constrain any
//   specific zero — RH is a statement about EVERY zero, a measure-zero set
//   on which almost-all statements are silent. The random <-> zeta link
//   remains a HEURISTIC MODEL (Keating-Snaith), not a derandomizable proof.

const TRANSFER_EVALUATION = Object.freeze({
  whatRandomArgumentControls:
    'TYPICAL SIZE of random partial sums M(x) = sum_{n<=x} f(n) and moments ' +
    'E|M(x)|^{2q} (better-than-squareroot cancellation, Harper 2020); ' +
    'ALMOST-SURE zero-free region of the random Euler product L_f',

  observableNeededForRH:
    'The LOCATION of zeros of the single deterministic zeta(s): RH asserts ' +
    'every nontrivial zero has Re s = 1/2, a statement about a fixed object ' +
    'and a measure-zero zero set',

  essentiallyNonDeterministicFeatures: Object.freeze({
    secondMomentOrthogonality:
      'E[f(m) conj(f(n))] = [m=n] makes the random characters orthonormal; ' +
      'the deterministic p^{-it} at fixed t has no such orthogonality',
    martingaleChaosStructure:
      'the prime-cutoff Euler product is a martingale with INDEPENDENT ' +
      'increments (critical Gaussian multiplicative chaos); the fixed-t ' +
      'deterministic Euler product is a single number with no probability ' +
      'space behind it',
    borelCantelli:
      'almost-sure zero-free regions of L_f come from summable tail ' +
      'probabilities; a single deterministic realization has no tail to ' +
      'sum, so Borel-Cantelli is vacuous',
  }),

  hybridViaVoroninAttempted: true,
  hybridViaVoroninSucceeds: false,
  whyHybridViaVoroninFails:
    'Voronin universality (1) is PROVED from zero-distribution / mean-value ' +
    'inputs and presupposes genericity, so it cannot certify zero-freeness; ' +
    'and (2) only approximates ZERO-FREE targets, so it can never witness ' +
    'that zeta avoids a zero. Using it to import a random-model conclusion ' +
    'is circular and directionally backwards',

  bestHonestHybrid:
    'the "almost-all t" family — for almost all t the local behaviour ' +
    'matches the conjectured model — but almost-all (measure) statements are ' +
    'silent on the measure-zero zero set that RH constrains',

  derandomizesToRiemann: false,
});

// =========================================================================
// SECTION C - FOUR DERANDOMIZATION OBSTRUCTIONS (D1)-(D4).
// =========================================================================

const DERANDOMIZATION_OBSTRUCTIONS = Object.freeze({
  obstruction_D1_ensemble_vs_realization:
    'Harper-type results are almost-sure / in-distribution over a random ' +
    'ensemble; zeta is a single deterministic realization. A typical- ' +
    'realization statement carries no information about a specific ' +
    '(probability-zero) realization, and zeta is not sampled from the ' +
    'ensemble: its Euler phases p^{-it} are deterministic functions of one ' +
    'real parameter t, not iid random phases',

  obstruction_D2_independence_false_for_zeta:
    'The Harper apparatus (martingale / critical Gaussian multiplicative ' +
    'chaos delivering better-than-squareroot cancellation) rests on the ' +
    'INDEPENDENCE of {f(p)}. For zeta the analogue phases p^{-it} are ' +
    'jointly equidistributed (Kronecker-Weyl) but rigidly arithmetically ' +
    'correlated, NOT independent. The load-bearing input is structurally ' +
    'absent on the deterministic side',

  obstruction_D3_wrong_observable_size_vs_zeros:
    'Harper bounds partial-sum SIZE / moments; RH is about ZERO LOCATION. ' +
    'Even the random-Euler-product zero-free-region analogue is proved by ' +
    'Borel-Cantelli + second moment, consuming independence; the size-bound ' +
    '-> zero-free-region translation is itself probabilistic and does not ' +
    'survive fixing a single realization',

  obstruction_D4_voronin_directionality:
    'Voronin universality is proved FROM zero-distribution / mean-value ' +
    'inputs and only approximates zero-free targets; it presupposes the ' +
    'genericity it would be used to prove and cannot certify zero-freeness ' +
    'of zeta. The hybrid semi-deterministic route via universality is ' +
    'circular and directionally backwards',

  eachIndependentlySufficient: true,
  netConclusion:
    'The random-ensemble control does NOT derandomize to deterministic ' +
    'Riemann zeta. Each of (D1)-(D4) independently blocks the transfer; ' +
    'together they show the random <-> zeta link is a HEURISTIC MODEL ' +
    '(Wintner 1944 / Keating-Snaith 2000), not a derandomizable proof',
});

// =========================================================================
// SECTION D - RELATIONSHIP TO THE NEW-INPUT CLASSIFICATION FAMILY.
// =========================================================================
//
// imp-1344 sits alongside the other NEW-INPUT classifications (imp-1307
// Connes-Bost, imp-1308 Berry-Keating, imp-1309 Tao-entropy) that probe
// whether a candidate mechanism provides a genuinely new input for the
// RH attack. Like those, this is a NEGATIVE classification:
//
//   - imp-1309 (entropy family): orthogonal in its primary domain but the
//     orthogonality does not transfer to the single-zeta 2-point PCC
//     observable.
//
//   - imp-1344 (random-multiplicative family, this ticket): rigorous and
//     powerful in its primary domain (typical size / distribution of random
//     sums) but the control does not derandomize to the single
//     deterministic zeta. The shared meta-pattern is: a method that is
//     genuinely strong for a TYPICAL / AVERAGED / RANDOM object does not
//     supply control of the FIXED, WORST-CASE, DETERMINISTIC object that
//     RH is a statement about.
//
// NET: the random-multiplicative-function route is ruled OUT as a direct
// derandomization for deterministic RH. It remains valuable as a MODEL
// (predicting the right answer) but not as a proof input.

const RELATIONSHIP_TO_NEW_INPUT_FAMILY = Object.freeze({
  sharedMetaPattern:
    'A method strong for a TYPICAL / AVERAGED / RANDOM object does not ' +
    'supply control of the FIXED, WORST-CASE, DETERMINISTIC object RH ' +
    'constrains. imp-1309 (entropy) and imp-1344 (random multiplicative) ' +
    'are both instances',

  imp1309Parallel:
    'imp-1309 entropy method: orthogonal in primary domain, does not ' +
    'transfer to single-zeta 2-point PCC observable',

  imp1344Position:
    'imp-1344 random multiplicative functions: rigorous for typical size / ' +
    'distribution of random sums, does not derandomize to deterministic zeta',

  remainsValuableAsModel:
    'The random-multiplicative / random-matrix model (Keating-Snaith 2000) ' +
    'predicts the correct answer for value distribution and moments; it is a ' +
    'MODEL not a proof input. Useful for heuristics and conjecture-checking, ' +
    'not for deterministic closure',

  aggregateVerdict: 'random-multiplicative-route-is-model-not-proof-input',
});

// =========================================================================
// SECTION E - VERDICT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'harper-random-fully-derandomizes-to-riemann',
  'harper-random-derandomizes-for-restricted-family-X',
  'harper-random-improves-but-riemann-remains-open',
  'harper-random-not-derandomizable-to-deterministic-riemann',
]);

const VERDICT = 'harper-random-not-derandomizable-to-deterministic-riemann';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),

  closesRHUnconditionally: false,
  closesRHForRestrictedFamily: false,

  whatRandomMethodGives:
    'Rigorous control of the TYPICAL SIZE / DISTRIBUTION of random ' +
    'multiplicative-function sums (Harper 2020 better-than-squareroot ' +
    'cancellation) and ALMOST-SURE properties of random Euler products. ' +
    'NONE of it transfers to the single deterministic zeta',

  gapToRHPreciselyStated:
    'The gap is the ensemble-vs-realization boundary: almost-sure / typical ' +
    'control of a random ensemble gives no information about the fixed ' +
    '(probability-zero) realization that zeta is, and the load-bearing ' +
    'INDEPENDENCE of {f(p)} is false for the deterministic phases p^{-it}',

  fourObstructions: Object.freeze({
    D1_ensemble_vs_realization: true,
    D2_independence_false_for_zeta: true,
    D3_wrong_observable_size_vs_zeros: true,
    D4_voronin_directionality: true,
  }),

  whatWouldDerandomize:
    'A deterministic substitute for the INDEPENDENCE of {f(p)} that holds ' +
    'for the specific phases p^{-it} (none is known — they are rigidly ' +
    'correlated), OR a non-probabilistic route from the random-model ' +
    'conclusion to a fixed-realization zero-free statement that does not ' +
    'pass through Borel-Cantelli / second-moment orthogonality / Voronin ' +
    'universality. No such route is known at training-cutoff',

  honestNote:
    'The Harper random-multiplicative-function results are genuinely deep ' +
    'and rigorous IN THEIR PRIMARY DOMAIN (typical size of random sums, ' +
    'critical Gaussian multiplicative chaos). The verdict ' +
    'harper-random-not-derandomizable-to-deterministic-riemann reports that ' +
    'the candidate mechanism does not transfer to the deterministic target, ' +
    'NOT that the mechanism is wrong in its primary domain. The result is ' +
    'PRECISELY VALUABLE: it confirms that the most natural "RH for typical ' +
    'object" body of work — the random-multiplicative model — supplies a ' +
    'correct heuristic but not a proof input, and pins exactly why ' +
    '(independence, ensemble-vs-realization, observable mismatch, Voronin ' +
    'directionality)',

  trainingTimePremiseUncertaintyNote:
    'The ticket premise "Harper 2017 proved RH for random chi" is NOT a ' +
    'recognized theorem at training-cutoff (January 2026). Classification ' +
    'uses the closest-known rigorous form (Harper 2019-2020 moments, random- ' +
    'Euler-product analogue, Keating-Snaith model). The (D1)-(D4) ' +
    'obstructions are robust to the exact premise form because they ' +
    'identify load-bearing layer-level facts any random -> deterministic ' +
    'transfer for zeta must traverse. OPEN-FOR-REVISION if a specific ' +
    'Harper-2017 literal-RH-for-random-chi theorem with a derandomization ' +
    'not captured by (D1)-(D4) is identified',
});

// =========================================================================
// SECTION F - EXPORTED RECORD.
// =========================================================================

export const IMP_1344_HARPER_2017_DERANDOMIZATION = Object.freeze({
  id: 'imp-1344-harper-2017-derandomization',
  ticket: 'imp-1344',
  category: 'proof',
  builtAt: '2026-06-04T00:18:00Z',
  paperSourcePath: PAPER_REF,
  relatedTickets: Object.freeze(['imp-1184', 'imp-1247', 'imp-1307', 'imp-1308', 'imp-1309']),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  harperStatement: HARPER_STATEMENT,
  transferEvaluation: TRANSFER_EVALUATION,
  derandomizationObstructions: DERANDOMIZATION_OBSTRUCTIONS,
  relationshipToNewInputFamily: RELATIONSHIP_TO_NEW_INPUT_FAMILY,

  honestScope: Object.freeze([
    'This file is a NEW-INPUT CLASSIFICATION ticket for the candidate ' +
    'derandomization of Harper-type random-multiplicative-function results ' +
    'to the deterministic Riemann zeta function. It is NOT a new closure or ' +
    'a new unconditional bound.',

    'PREMISE CORRECTION: the ticket phrase "Harper 2017 proved RH for ' +
    'random chi" is NOT a recognized theorem at training-cutoff. The ' +
    'rigorous content is the Harper 2019-2020 moment theorems (better-than- ' +
    'squareroot cancellation, critical Gaussian multiplicative chaos) and ' +
    'the random-Euler-product almost-sure analogue, plus the Keating-Snaith ' +
    '2000 random-matrix model. The classification corrects the premise and ' +
    'asks the well-posed question.',

    'The verdict is NEGATIVE: ' +
    'harper-random-not-derandomizable-to-deterministic-riemann. Four ' +
    'independent structural obstructions: (D1) ensemble-vs-realization ' +
    'mismatch (typical-realization statements are silent on a fixed ' +
    'probability-zero realization); (D2) the load-bearing INDEPENDENCE of ' +
    '{f(p)} is false for the deterministic phases p^{-it}; (D3) wrong ' +
    'observable (partial-sum size vs zero location); (D4) Voronin ' +
    'universality runs the wrong way (proved from zero-distribution inputs, ' +
    'only approximates zero-free targets, cannot certify zero-freeness).',

    'The random-multiplicative / random-matrix model remains VALUABLE as a ' +
    'HEURISTIC (it predicts the correct answer for value distribution and ' +
    'moments, Keating-Snaith 2000) but is a MODEL, not a proof input. The ' +
    'shared meta-pattern with imp-1309 (entropy) is that a method strong ' +
    'for a TYPICAL / AVERAGED / RANDOM object does not control the FIXED, ' +
    'WORST-CASE, DETERMINISTIC object RH is a statement about.',

    'OPEN-FOR-REVISION if a specific Harper-2017 literal-RH-for-random-chi ' +
    'theorem with a derandomization not captured by (D1)-(D4) is identified ' +
    'after training-cutoff. The (D1)-(D4) obstructions are robust to the ' +
    'exact premise form because they are layer-level facts any random -> ' +
    'deterministic transfer for zeta must traverse.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp1184: 'src/data/imp-1184-direct-selberg-esy-route-audit.js',
    imp1247: 'src/data/imp-1247-shared-pcc-obstruction-recheck.js',
    imp1309: 'src/data/imp-1309-tao-entropy-pcc-attack.js',
    harper2020:
      'Harper, A. J., "Moments of random multiplicative functions, I: Low ' +
      'moments, better than squareroot cancellation", Annals of Math. 192 ' +
      '(2020), 539-609 — better-than-squareroot cancellation via critical ' +
      'Gaussian multiplicative chaos',
    harper2019:
      'Harper, A. J., "Moments of random multiplicative functions, II / ' +
      'high moments" and related (2019) — companion moment estimates',
    randomEulerProductAnalogue:
      'Aymone-Heap-Zhai-type results on almost-sure analytic continuation ' +
      'and zero-free regions of random Euler products L_f, all via the ' +
      'INDEPENDENCE of {f(p)} (second-moment + Borel-Cantelli)',
    keatingSnaith2000:
      'Keating, J. P., Snaith, N. C., "Random matrix theory and ' +
      'zeta(1/2+it)", Comm. Math. Phys. 214 (2000), 57-89 — random-matrix / ' +
      'random-multiplicative MODEL for zeta value distribution (heuristic)',
    wintner1944:
      'Wintner, A., "Random factorizations and Riemann hypothesis", Duke ' +
      'Math. J. 11 (1944), 267-275 — origin of the random multiplicative ' +
      'function as a model for mu / the Riemann hypothesis heuristic',
    voronin1975:
      'Voronin, S. M., "Theorem on the universality of the Riemann zeta ' +
      'function", Izv. Akad. Nauk SSSR 39 (1975), 475-486 — universality ' +
      'approximates zero-free targets on compacts in 1/2 < Re s < 1',
  }),
});

export default IMP_1344_HARPER_2017_DERANDOMIZATION;

// =========================================================================
// BUILD-TIME TRIPWIRES (8 shipped; ticket requires 8).
// =========================================================================

export const IMP_1344_HARPER_2017_DERANDOMIZATION_ASSERTIONS = [
  // Tripwire 1: Harper statement is cited with honest premise correction
  // (no overclaim of a literal "RH for random chi" theorem).
  {
    id: 'imp1344-harper-stated-with-premise-correction',
    why:
      'The ticket premise "Harper 2017 proved RH for random chi" is not a ' +
      'recognized theorem at training-cutoff. The classification must STATE ' +
      'the closest-known rigorous form (Harper 2020 moments + random-Euler- ' +
      'product analogue) and EXPLICITLY correct the premise. A silent ' +
      'overclaim that "Harper proved RH for random chi" would fabricate a ' +
      'theorem.',
    holds: () => {
      const s = IMP_1344_HARPER_2017_DERANDOMIZATION.harperStatement;
      return (
        typeof s.source === 'string' &&
        /Harper 2020|Harper.*Annals/.test(s.source) &&
        /squareroot|cancellation/i.test(s.source) &&
        s.isTrainingTimePremiseUncertain === true &&
        typeof s.premiseCorrectionNote === 'string' &&
        /imprecise|not a (standard|recognized) theorem|no standard theorem/i.test(
          s.premiseCorrectionNote
        ) &&
        typeof s.loadBearingProbabilisticInput === 'string' &&
        /INDEPENDENCE/.test(s.loadBearingProbabilisticInput)
      );
    },
  },

  // Tripwire 2: transfer evaluation walks (a) what is controlled, (b) the
  // essentially non-deterministic features, (c) the Voronin hybrid attempt.
  {
    id: 'imp1344-transfer-evaluated-three-parts',
    why:
      'The transfer evaluation must walk (a) what the random argument ' +
      'controls, (b) which features are essentially non-deterministic, and ' +
      '(c) whether a hybrid via Voronin applies. Missing any of the three ' +
      'would render the classification incomplete on its load-bearing ' +
      'question.',
    holds: () => {
      const t = IMP_1344_HARPER_2017_DERANDOMIZATION.transferEvaluation;
      return (
        typeof t.whatRandomArgumentControls === 'string' &&
        /typical size|partial sums|moments/i.test(t.whatRandomArgumentControls) &&
        typeof t.observableNeededForRH === 'string' &&
        /zero|location/i.test(t.observableNeededForRH) &&
        typeof t.essentiallyNonDeterministicFeatures === 'object' &&
        typeof t.essentiallyNonDeterministicFeatures.secondMomentOrthogonality === 'string' &&
        typeof t.essentiallyNonDeterministicFeatures.martingaleChaosStructure === 'string' &&
        typeof t.essentiallyNonDeterministicFeatures.borelCantelli === 'string' &&
        t.hybridViaVoroninAttempted === true &&
        t.hybridViaVoroninSucceeds === false &&
        t.derandomizesToRiemann === false
      );
    },
  },

  // Tripwire 3: all four derandomization obstructions (D1)-(D4) are present
  // and each independently sufficient.
  {
    id: 'imp1344-four-obstructions-present',
    why:
      'The classification rests on four independent obstructions (D1) ' +
      'ensemble-vs-realization / (D2) independence false for zeta / (D3) ' +
      'wrong observable / (D4) Voronin directionality. Missing any would ' +
      'weaken the structural argument.',
    holds: () => {
      const o = IMP_1344_HARPER_2017_DERANDOMIZATION.derandomizationObstructions;
      return (
        typeof o.obstruction_D1_ensemble_vs_realization === 'string' &&
        /(ensemble|realization|deterministic)/i.test(o.obstruction_D1_ensemble_vs_realization) &&
        typeof o.obstruction_D2_independence_false_for_zeta === 'string' &&
        /(INDEPENDENCE|correlated|Kronecker)/i.test(o.obstruction_D2_independence_false_for_zeta) &&
        typeof o.obstruction_D3_wrong_observable_size_vs_zeros === 'string' &&
        /(size|zero|Borel-Cantelli)/i.test(o.obstruction_D3_wrong_observable_size_vs_zeros) &&
        typeof o.obstruction_D4_voronin_directionality === 'string' &&
        /(Voronin|universality|zero-free)/i.test(o.obstruction_D4_voronin_directionality) &&
        o.eachIndependentlySufficient === true
      );
    },
  },

  // Tripwire 4: verdict is one of the four allowed strings.
  {
    id: 'imp1344-verdict-in-allowed-set',
    why:
      'The verdict must be one of the four allowed classification strings; ' +
      'an out-of-set verdict would mean the classification produced an ' +
      'undefined outcome.',
    holds: () => {
      const r = IMP_1344_HARPER_2017_DERANDOMIZATION;
      return (
        r.allowedVerdicts.length === 4 &&
        r.allowedVerdicts.includes(r.verdict) &&
        r.verdict === 'harper-random-not-derandomizable-to-deterministic-riemann' &&
        r.verdictDetail.isAllowedVerdict === true
      );
    },
  },

  // Tripwire 5: verdict detail reports RH remains OPEN with the gap stated.
  {
    id: 'imp1344-rh-remains-open-gap-stated',
    why:
      'The classification is NEGATIVE: it must report that RH is not closed ' +
      'and state the precise gap (ensemble-vs-realization boundary, ' +
      'independence false for p^{-it}). A silent claim of closure would be ' +
      'a fabricated QED.',
    holds: () => {
      const v = IMP_1344_HARPER_2017_DERANDOMIZATION.verdictDetail;
      return (
        v.closesRHUnconditionally === false &&
        v.closesRHForRestrictedFamily === false &&
        typeof v.gapToRHPreciselyStated === 'string' &&
        /ensemble|realization|INDEPENDENCE/i.test(v.gapToRHPreciselyStated) &&
        v.fourObstructions.D1_ensemble_vs_realization === true &&
        v.fourObstructions.D2_independence_false_for_zeta === true &&
        v.fourObstructions.D3_wrong_observable_size_vs_zeros === true &&
        v.fourObstructions.D4_voronin_directionality === true
      );
    },
  },

  // Tripwire 6: at least five required citations present.
  {
    id: 'imp1344-required-citations-present',
    why:
      'The classification must cite the load-bearing literature (Harper ' +
      '2020, random Euler product analogue, Keating-Snaith 2000, Wintner ' +
      '1944, Voronin 1975) so the premise correction and obstructions are ' +
      'verifiable. Missing citations would make the classification ' +
      'unfalsifiable.',
    holds: () => {
      const c = IMP_1344_HARPER_2017_DERANDOMIZATION.references;
      return (
        typeof c.harper2020 === 'string' && /Annals/.test(c.harper2020) &&
        typeof c.randomEulerProductAnalogue === 'string' &&
        typeof c.keatingSnaith2000 === 'string' && /2000/.test(c.keatingSnaith2000) &&
        typeof c.wintner1944 === 'string' && /1944/.test(c.wintner1944) &&
        typeof c.voronin1975 === 'string' && /1975|universality/i.test(c.voronin1975)
      );
    },
  },

  // Tripwire 7: relationship to the NEW-INPUT family names the shared
  // typical-vs-deterministic meta-pattern and the imp-1309 parallel.
  {
    id: 'imp1344-new-input-family-meta-pattern',
    why:
      'The classification must place itself in the NEW-INPUT family and ' +
      'name the shared meta-pattern (a method strong for a typical/random ' +
      'object does not control the fixed deterministic object). This is the ' +
      'engine-planning payload of the ticket.',
    holds: () => {
      const r = IMP_1344_HARPER_2017_DERANDOMIZATION.relationshipToNewInputFamily;
      return (
        typeof r.sharedMetaPattern === 'string' &&
        /(TYPICAL|RANDOM|AVERAGED)/.test(r.sharedMetaPattern) &&
        /(DETERMINISTIC|FIXED|WORST-CASE)/.test(r.sharedMetaPattern) &&
        typeof r.imp1309Parallel === 'string' && /imp-1309/.test(r.imp1309Parallel) &&
        typeof r.remainsValuableAsModel === 'string' &&
        /(MODEL|heuristic)/i.test(r.remainsValuableAsModel)
      );
    },
  },

  // Tripwire 8: honest scope flags the NEGATIVE result + premise correction
  // + training-time uncertainty + open-for-revision.
  {
    id: 'imp1344-honest-scope-negative-and-uncertainty',
    why:
      'The honest scope must flag (i) the NEGATIVE result, (ii) the premise ' +
      'correction (no literal RH-for-random-chi theorem), (iii) training- ' +
      'time uncertainty, and (iv) open-for-revision. Dropping any of these ' +
      'would risk overclaiming a result the literature does not support.',
    holds: () => {
      const r = IMP_1344_HARPER_2017_DERANDOMIZATION;
      const scope = r.honestScope.join(' ');
      return (
        r.honestScope.length >= 4 &&
        /NEGATIVE/.test(scope) &&
        /PREMISE CORRECTION|not a recognized theorem/i.test(scope) &&
        /training-cutoff/i.test(scope) &&
        /OPEN-FOR-REVISION/.test(scope) &&
        typeof r.verdictDetail.trainingTimePremiseUncertaintyNote === 'string' &&
        /OPEN-FOR-REVISION/.test(r.verdictDetail.trainingTimePremiseUncertaintyNote)
      );
    },
  },
];
