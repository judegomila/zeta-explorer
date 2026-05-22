/**
 * @module connes-adelic-lambda-2026-05
 * @fileoverview Connes adelic spectral interpretation: small numerical
 * positivity check of the truncated Weil-Connes trace formula at t = 0.02
 * (matching the imp-440 finite-N Lambda regime). HONEST SCOPE: a SURVEY +
 * SMALL NUMERICAL CONSISTENCY CHECK, not a rigorous adelic port. Ticket
 * imp-1109.
 */
// imp-1109 -- Connes adelic spectral interpretation: small numerical positivity
// check of the truncated Weil-Connes trace formula at t = 0.02 (matching the
// imp-440 finite-N Lambda regime).
//
// SCOPE (honest): this is a SURVEY plus a SMALL NUMERICAL CONSISTENCY CHECK,
// not a rigorous port of imp-440 to the adelic side. The Connes 1999 adelic
// class space C_Q = A_Q^* / Q^* gives a conjectural spectral interpretation of
// Riemann zeros; the conjectural reformulation of the de Bruijn-Newman Lambda
// as Lambda = -inf{t : Tr(K_t) >= 0 under the Connes/Weil trace formula} is not
// itself published in this form -- it is a working hypothesis we make explicit
// here to translate our finite-N Lambda computation into the adelic language.
//
// MATH SUMMARY:
//
//   The Connes trace formula on the adele class space (the Weil explicit
//   formula) reads, for a test function h on the spectrum and its Fourier
//   transform g(u) = (1 / (2 pi)) integral h(r) exp(-i r u) dr :
//
//     sum_{zeros gamma} h(gamma)
//        = h(i/2) + h(-i/2)
//          + W_inf(h)
//          + sum_p W_p(h)
//
//   with the FINITE-PRIME local terms
//
//     W_p(h) = log(p) * sum_{k >= 1} p^{-k/2}
//                     * [ g(k log p) + g(-k log p) ]
//
//   and an archimedean term W_inf(h) involving the digamma function. Under
//   de Bruijn-Newman style heat-flow deformation H_t, the test function gets
//   a Gaussian damping in its Fourier variable u :
//
//       g_t(u) = g(u) * exp(-t * u^2)
//
//   The conjectural Lambda reformulation is:
//
//     Lambda = - inf { t : the trace formula sum (zero side) on C_Q
//                          under heat-flow H_t remains non-negative
//                          for every admissible positive test function h }
//
// PRIME-SIDE TRUNCATED TRACE AT t :
//
//   Restricting the formula to the FINITE PLACES {p_1, ..., p_k} and taking a
//   delta-like positive test function localized at u = 0 (so g(u) is a Gaussian
//   bump scaled to width 1; the standard Selberg/Connes positivity-test choice),
//   the prime-side truncated trace under H_t is
//
//       Tr_p,k(t) = sum_{p in P} log(p) * sum_{k=1..K} p^{-k/2}
//                   * exp( - t * (k * log p)^2 )
//                   * a_p(k)
//
//   with a_p(k) = 1 the standard Selberg-style normalization. EVERY TERM IS
//   POSITIVE for any t >= 0, so the prime-side truncated trace is positive at
//   t = 0.02 essentially trivially. This is the EXPECTED outcome: the
//   prime-side of the Weil/Connes trace formula is unconditionally positive
//   (it is the "geometric" side); positivity of the FULL trace formula
//   (zero side minus archimedean term) is what is equivalent to RH and where
//   Lambda enters. We compute the prime-side number as a CONSISTENCY CHECK :
//   if positivity were to fail at t = 0.02 for any prime, that would expose a
//   sign / coefficient bug in the formula transcription.
//
// CITATIONS:
//   - Connes, A. (1999). "Trace formula in noncommutative geometry and the
//     zeros of the Riemann zeta function". Selecta Math. 5, 29-106.
//   - Weil, A. (1952). "Sur les formules explicites de la theorie des nombres
//     premiers". Comm. Sem. Math. Univ. Lund.
//   - Berry, M. V. and Keating, J. P. (1999). "H = xp and the Riemann zeros".
//     In: Supersymmetry and Trace Formulae, Plenum, pp. 355-367.
//   - de Bruijn, N. G. (1950) / Newman, C. M. (1976) -- Lambda definition.
//   - Polymath15 (2019) and Rodgers-Tao (2020) -- Lambda >= 0 lower bound and
//     numerical upper bounds via heat-flow.

// Hard-coded first 5 prime-side terms; primes deliberately small per the
// ticket (low-rank discretization of C_Q at finite places).
const PRIMES = Object.freeze([2, 3, 5, 7, 11]);

// Truncate the inner sum at K_MAX = 5 prime powers per prime. With 5 primes
// this is exactly 25 terms (the ticket-specified "~25 terms" budget).
const K_MAX = 5;

// The heat-flow time we test: t = 0.02 is the order-of-magnitude finite-N
// Lambda regime explored in imp-440 (which records L_pt ~ 0.121 at N* = 1e6
// and the unconditional finite-K bound on [100, 10^4] is in the same band).
// The ticket fixed t = 0.02 for the numerical positivity probe.
const T_HEAT = 0.02;

// Selberg-style coefficient a_p(k) = 1 for all (p, k). Documented as the
// default; the Connes adelic class-space measure does not fix a unique
// a_p(k) without further normalization choices, so we report which choice
// we used.
function selbergCoefficient(_p, _k) {
  return 1;
}

// Per-(prime, k) contribution to the truncated prime-side trace at heat time t :
//   log(p) * p^{-k/2} * exp(-t * (k * log p)^2) * a_p(k)
function termContribution(p, k, t) {
  const logp = Math.log(p);
  const uk   = k * logp;                   // Fourier-side coordinate
  const damp = Math.exp(-t * uk * uk);     // heat-flow Gaussian damping
  const amp  = Math.pow(p, -k / 2);        // prime-power weight
  const a    = selbergCoefficient(p, k);   // Selberg-style normalization
  return logp * amp * damp * a;
}

// Build a per-prime breakdown: contributions[i] is an array of K_MAX numbers
// for prime PRIMES[i]. Per-prime sum is contributions[i].reduce((a,b)=>a+b).
function buildTable(t) {
  const rows = [];
  for (const p of PRIMES) {
    const terms = [];
    for (let k = 1; k <= K_MAX; k++) {
      terms.push(+termContribution(p, k, t).toFixed(10));
    }
    const sum = terms.reduce((a, b) => a + b, 0);
    rows.push({
      prime: p,
      terms: Object.freeze(terms),
      perPrimeSum: +sum.toFixed(10),
    });
  }
  return Object.freeze(rows);
}

const TABLE_AT_T_HEAT = Object.freeze(buildTable(T_HEAT).map((r) => Object.freeze(r)));

// Total truncated trace = sum of per-prime sums.
const TRUNC_TRACE_AT_T_HEAT = +TABLE_AT_T_HEAT
  .reduce((acc, r) => acc + r.perPrimeSum, 0)
  .toFixed(10);

// Positivity verdict: every term is positive by construction (log(p) > 0,
// p^{-k/2} > 0, exp(-t * u^2) > 0, a_p(k) = 1 > 0), so the per-prime sums
// and the total are all strictly positive. We still compute the verdict
// numerically as a tripwire against a future sign-bug regression.
function evaluatePositivity() {
  let minTerm = Infinity;
  let minPerPrimeSum = Infinity;
  for (const r of TABLE_AT_T_HEAT) {
    for (const v of r.terms) if (v < minTerm) minTerm = v;
    if (r.perPrimeSum < minPerPrimeSum) minPerPrimeSum = r.perPrimeSum;
  }
  const positivityHolds = (TRUNC_TRACE_AT_T_HEAT >= 0)
                         && (minPerPrimeSum >= 0)
                         && (minTerm >= 0);
  const residualMarginIfNegative = positivityHolds ? 0 : Math.abs(TRUNC_TRACE_AT_T_HEAT);
  return { positivityHolds, residualMarginIfNegative, minTerm, minPerPrimeSum };
}

const POSITIVITY = evaluatePositivity();

// Also compute the trace at a sweep of t-values to expose its shape; this
// is the page-rendering data, not part of the headline check.
const T_SWEEP = (() => {
  // 21 points on [0, 0.2] step 0.01 -- spans below, at, and above the
  // imp-440 finite-N Lambda regime.
  const out = [];
  for (let i = 0; i <= 20; i++) {
    const t = +(i * 0.01).toFixed(2);
    const rows = buildTable(t);
    const total = +rows.reduce((acc, r) => acc + r.perPrimeSum, 0).toFixed(10);
    out.push({ t, traceTotal: total });
  }
  return Object.freeze(out.map((r) => Object.freeze(r)));
})();

// ── Survey paragraphs (3 plain-English explanations rendered on the page). ──
//
// NOTE on character discipline: these strings live inside single-quoted JS
// literals (per the ticket no-apostrophe rule) so we use single quotes and
// no embedded apostrophes; mathematical notation uses ASCII letters and
// numerals, no Unicode primes or curly quotes. The page renders KaTeX for
// the displayed equations and these prose paragraphs as plain text.

const SURVEY_PARAGRAPHS = Object.freeze([
  {
    heading: 'The adelic class space C_Q = A_Q^* / Q^*',
    text:
      'Connes in his 1999 Selecta Mathematica paper proposes that the natural ' +
      'home for the spectral interpretation of the Riemann zeros is the adele ' +
      'class space. The ring of adeles A_Q is the restricted product over all ' +
      'places v of Q of the local completions Q_v: the archimedean place gives ' +
      'R, and each finite prime p gives the p-adic numbers Q_p. The idele class ' +
      'group C_Q = A_Q^* / Q^* is the multiplicative group of A_Q modulo the ' +
      'diagonal rational action. C_Q carries a canonical scaling action; the ' +
      'eigenvalues of this action on a suitable Hilbert space of functions on ' +
      'C_Q give an absorption spectrum that Connes conjectures coincides with ' +
      'the imaginary parts of the nontrivial Riemann zeros.',
  },
  {
    heading: 'The Connes trace formula and the Weil explicit formula',
    text:
      'The trace of the scaling action on L^2(C_Q) is the Connes / Weil explicit ' +
      'formula. For an admissible test function h on the spectrum with Fourier ' +
      'transform g, the formula reads sum over zeros gamma of h(gamma) equals ' +
      'h(i/2) plus h(-i/2) plus an archimedean contribution W_inf(h) plus a ' +
      'sum over primes of local terms W_p(h). The finite-place term is ' +
      'W_p(h) = log(p) times sum over k >= 1 of p^(-k/2) (g(k log p) + ' +
      'g(-k log p)). This is the spectral / geometric duality at the heart of ' +
      'the Weil 1952 explicit formula, recast as a noncommutative trace by ' +
      'Connes.',
  },
  {
    heading: 'Conjectural Lambda reformulation via heat-flow positivity',
    text:
      'The de Bruijn-Newman Lambda is the smallest t such that the t-heat-flow ' +
      'deformation of the Riemann xi function still has all zeros real. In the ' +
      'adelic language the heat flow corresponds to Gaussian damping of the ' +
      'test function in the Fourier variable: g_t(u) = g(u) * exp(-t u^2). ' +
      'The conjectural reformulation we explore here is Lambda equals minus the ' +
      'infimum over t such that the trace formula on C_Q remains non-negative ' +
      'for every admissible positive test function. This is not a published ' +
      'theorem -- it is the working hypothesis that lets us translate our ' +
      'imp-440 finite-N Lambda estimate into the adelic framework.',
  },
  {
    heading: 'Low-rank numerical check at t = 0.02',
    text:
      'We discretize C_Q at the smallest five primes {2, 3, 5, 7, 11} and ' +
      'truncate the k-sum at K_MAX = 5, giving exactly 25 prime-side terms. ' +
      'Using the Selberg-style coefficient a_p(k) = 1 we compute the prime-side ' +
      'truncated trace at t = 0.02 (the order-of-magnitude finite-N Lambda ' +
      'regime explored in imp-440). Every term is manifestly positive (log(p) > 0, ' +
      'p^(-k/2) > 0, Gaussian damp > 0, a_p(k) = 1), so positivity holds. The ' +
      'value of the truncated trace at t = 0.02 is reported below and broken ' +
      'down per prime in the contributions table.',
  },
  {
    heading: 'What positivity does and does not tell us',
    text:
      'The prime-side positivity is unconditional and not by itself evidence ' +
      'for RH or for a particular Lambda bound: the deep content of the ' +
      'Weil / Connes formula is that the ZERO-side minus the archimedean term ' +
      'equals the PRIME-side, and the positivity of the full trace under H_t ' +
      'is what controls Lambda. Our consistency check shows that our prime-side ' +
      'transcription is sign-correct and that no individual coefficient choice ' +
      'has flipped sign at t = 0.02. A failure here would have been a strong ' +
      'red flag against the imp-440 closure narrative; a pass is necessary ' +
      'but not sufficient consistency.',
  },
]);

// ── Public export ──────────────────────────────────────────────────────────

export const CONNES_ADELIC_LAMBDA = Object.freeze({
  id: 'imp-1109-connes-adelic-lambda-2026-05',
  ticket: 'imp-1109',
  surveyParagraphs: SURVEY_PARAGRAPHS,
  traceFormulaSchematic:
    'Tr_p,K(t) = sum_{p in P} log(p) * sum_{k=1..K} p^{-k/2} ' +
    '* exp(-t * (k*log p)^2) * a_p(k), with a_p(k) = 1 (Selberg-style).',
  fullFormulaSchematic:
    'sum_{zeros gamma} h(gamma) = h(i/2) + h(-i/2) + W_inf(h) + sum_p W_p(h), ' +
    'with W_p(h) = log(p) * sum_{k>=1} p^{-k/2} * [g(k log p) + g(-k log p)].',
  lambdaConjecturalReformulation:
    'Lambda = -inf{ t : trace formula on C_Q under heat-flow H_t (g_t(u) = ' +
    'g(u) * exp(-t u^2)) remains non-negative for every admissible positive ' +
    'test function h }. NOT a published theorem; a working hypothesis used ' +
    'here to translate imp-440 finite-N Lambda into adelic language.',
  coefficientChoice: 'Selberg-style a_p(k) = 1 for all (p, k) pairs; documented as default.',
  primesUsed: PRIMES,
  kMax: K_MAX,
  numberOfTerms: PRIMES.length * K_MAX,
  tHeat: T_HEAT,
  perPrimeContributions: TABLE_AT_T_HEAT,
  truncatedTraceAtT0p02: TRUNC_TRACE_AT_T_HEAT,
  positivityHolds: POSITIVITY.positivityHolds,
  minTermValue: +POSITIVITY.minTerm.toFixed(10),
  minPerPrimeSumValue: +POSITIVITY.minPerPrimeSum.toFixed(10),
  residualMarginIfNegative: POSITIVITY.residualMarginIfNegative,
  tSweep: T_SWEEP,
  verdict:
    'CONSISTENCY CHECK PASSED: the prime-side truncated Weil-Connes trace ' +
    'at t = 0.02 over primes {2, 3, 5, 7, 11} with k <= 5 is strictly ' +
    'positive at value ' + TRUNC_TRACE_AT_T_HEAT.toFixed(6) + '. This is ' +
    'an expected pass (every term is unconditionally positive in the ' +
    'Selberg a_p(k) = 1 normalization) and serves as a sign / coefficient ' +
    'tripwire against future regressions of the formula transcription. ' +
    'It is NOT independent evidence for RH or for the imp-440 Lambda ' +
    'bound; it is a necessary-but-not-sufficient consistency probe.',
  honestScope:
    'Three honest caveats: (1) the conjectural Lambda reformulation in terms ' +
    'of trace-formula positivity under heat flow is not published in exactly ' +
    'this form; we make the working hypothesis explicit and we do not claim ' +
    'a port of the imp-440 result. (2) The Selberg a_p(k) = 1 coefficient ' +
    'choice is a default; the Connes adelic measure does not pin a unique ' +
    'a_p(k) without further normalization. Under any positive a_p(k) the ' +
    'numerical positivity holds trivially because every term is positive. ' +
    '(3) The check is over only 5 primes and 5 prime powers -- 25 terms ' +
    'total. The deep positivity question on the FULL adelic class space ' +
    '(zero side minus archimedean term) is exactly what is equivalent to RH ' +
    'and is NOT what this artefact tests.',
  citations: Object.freeze([
    'Connes, A. (1999). "Trace formula in noncommutative geometry and the zeros ' +
      'of the Riemann zeta function". Selecta Math. 5, 29-106.',
    'Weil, A. (1952). "Sur les formules explicites de la theorie des nombres ' +
      'premiers". Comm. Sem. Math. Univ. Lund.',
    'Berry, M. V. and Keating, J. P. (1999). "H = xp and the Riemann zeros".',
    'de Bruijn, N. G. (1950). "The roots of trigonometric integrals". Duke Math. J. 17.',
    'Newman, C. M. (1976). "Fourier transforms with only real zeros". Proc. AMS.',
    'Polymath15 (2019). "Effective approximation of heat flow evolution of ' +
      'the Riemann xi function".',
    'Rodgers, B. and Tao, T. (2020). "The de Bruijn-Newman constant is ' +
      'non-negative". Forum of Mathematics, Pi.',
  ]),
});

// ── Build-time tripwires ──────────────────────────────────────────────────

export const CONNES_ADELIC_LAMBDA_ASSERTIONS = [
  {
    id: 'imp1109-five-primes-used',
    holds: () =>
      CONNES_ADELIC_LAMBDA.primesUsed.length === 5 &&
      CONNES_ADELIC_LAMBDA.primesUsed[0] === 2 &&
      CONNES_ADELIC_LAMBDA.primesUsed[1] === 3 &&
      CONNES_ADELIC_LAMBDA.primesUsed[2] === 5 &&
      CONNES_ADELIC_LAMBDA.primesUsed[3] === 7 &&
      CONNES_ADELIC_LAMBDA.primesUsed[4] === 11,
    why:
      'The ticket explicitly fixes the prime set {2, 3, 5, 7, 11} for the ' +
      'low-rank discretization of C_Q at finite places. Reordering or ' +
      'swapping a prime would silently shift the per-prime contributions ' +
      'reported on the page and break the consistency-check narrative.',
  },
  {
    id: 'imp1109-twenty-five-prime-side-terms',
    holds: () =>
      CONNES_ADELIC_LAMBDA.kMax === 5 &&
      CONNES_ADELIC_LAMBDA.numberOfTerms === 25 &&
      CONNES_ADELIC_LAMBDA.perPrimeContributions.length === 5 &&
      CONNES_ADELIC_LAMBDA.perPrimeContributions.every((r) => r.terms.length === 5),
    why:
      'The ticket budgets ~25 terms for the truncated trace; this is exactly ' +
      '5 primes times K_MAX = 5 prime powers. A drift to a different ' +
      'truncation would break the side-by-side per-prime table on the page ' +
      'and the comparison against the brief.',
  },
  {
    id: 'imp1109-positivity-holds-at-t-0p02',
    holds: () =>
      CONNES_ADELIC_LAMBDA.positivityHolds === true &&
      CONNES_ADELIC_LAMBDA.truncatedTraceAtT0p02 > 0 &&
      CONNES_ADELIC_LAMBDA.minTermValue > 0 &&
      CONNES_ADELIC_LAMBDA.minPerPrimeSumValue > 0,
    why:
      'The headline finding is that the truncated prime-side trace is ' +
      'strictly positive at t = 0.02 under the Selberg a_p(k) = 1 ' +
      'normalization (every term is positive by construction). A regression ' +
      'that flips a sign in termContribution or in selbergCoefficient would ' +
      'cause the headline verdict to lie about its own number. This tripwire ' +
      'catches that.',
  },
  {
    id: 'imp1109-heat-time-is-0p02',
    holds: () => Math.abs(CONNES_ADELIC_LAMBDA.tHeat - 0.02) < 1e-12,
    why:
      'The ticket prescribes t = 0.02 (the order-of-magnitude imp-440 ' +
      'finite-N Lambda value). A drift here would mean the page header ' +
      'and the verdict prose disagree about which heat time the computation ' +
      'corresponds to; the consistency-check claim would become meaningless.',
  },
  {
    id: 'imp1109-per-prime-sum-matches-term-sum',
    holds: () => {
      for (const r of CONNES_ADELIC_LAMBDA.perPrimeContributions) {
        const direct = r.terms.reduce((a, b) => a + b, 0);
        if (Math.abs(direct - r.perPrimeSum) > 1e-8) return false;
      }
      return true;
    },
    why:
      'Each per-prime row carries a perPrimeSum field that must match ' +
      'the sum of its terms. A drift here would expose a stale-cache or ' +
      'a copy-paste regression in buildTable() and the page table would ' +
      'show two columns that contradict each other.',
  },
  {
    id: 'imp1109-total-matches-row-sum',
    holds: () => {
      const total = CONNES_ADELIC_LAMBDA.perPrimeContributions
        .reduce((a, r) => a + r.perPrimeSum, 0);
      return Math.abs(total - CONNES_ADELIC_LAMBDA.truncatedTraceAtT0p02) < 1e-8;
    },
    why:
      'The headline truncatedTraceAtT0p02 must equal the sum of perPrimeSum ' +
      'over the 5 primes. A drift would mean the headline number and the ' +
      'breakdown table on the page tell different stories.',
  },
  {
    id: 'imp1109-t-sweep-monotone-decreasing',
    holds: () => {
      // The heat-flow damping strictly decreases each individual term as t
      // grows, and per-prime sums are monotone decreasing accordingly, so
      // the total trace is monotone non-increasing across the sweep.
      const arr = CONNES_ADELIC_LAMBDA.tSweep;
      if (!Array.isArray(arr) || arr.length !== 21) return false;
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].traceTotal > arr[i - 1].traceTotal + 1e-9) return false;
      }
      return true;
    },
    why:
      'Under increasing t the Gaussian damping exp(-t * u^2) shrinks every ' +
      'term, so the truncated prime-side trace must be monotone ' +
      'non-increasing along the 21-point sweep. A monotonicity violation ' +
      'would indicate either a sign bug in the damping or a wrong index ' +
      'in T_SWEEP.',
  },
  {
    id: 'imp1109-survey-has-five-paragraphs',
    holds: () => Array.isArray(CONNES_ADELIC_LAMBDA.surveyParagraphs) &&
                 CONNES_ADELIC_LAMBDA.surveyParagraphs.length === 5 &&
                 CONNES_ADELIC_LAMBDA.surveyParagraphs.every((p) =>
                   typeof p.heading === 'string' && p.heading.length > 0 &&
                   typeof p.text === 'string' && p.text.length > 100),
    why:
      'The ticket asks for 3-5 paragraphs of survey covering the adelic ' +
      'class space, the trace formula, the Lambda reformulation, the ' +
      'numerical check, and the verdict-narrative. Drift below 5 ' +
      'substantive entries would weaken the page from a survey into a ' +
      'naked computation.',
  },
  {
    id: 'imp1109-citations-include-connes-1999',
    holds: () => {
      const cs = CONNES_ADELIC_LAMBDA.citations;
      if (!Array.isArray(cs) || cs.length < 5) return false;
      let hasConnes = false;
      let hasWeil = false;
      for (const c of cs) {
        if (/Connes/.test(c) && /1999/.test(c)) hasConnes = true;
        if (/Weil/.test(c)) hasWeil = true;
      }
      return hasConnes && hasWeil;
    },
    why:
      'A Connes-adelic survey without the Connes 1999 Selecta Math citation ' +
      'and without the Weil 1952 explicit-formula citation would not be a ' +
      'credible survey. Tripwire enforces presence of both foundational ' +
      'references and at least 5 citations total.',
  },
];
