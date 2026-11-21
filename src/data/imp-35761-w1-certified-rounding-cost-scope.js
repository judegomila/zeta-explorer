/**
 * @module imp-35761-w1-certified-rounding-cost-scope
 *
 * imp-35761 (numerical, S-frontier): ESTIMATE the ABSOLUTE certified-rounding cost
 * of the N ~ 4.886e5-term interval sum that imp-35725 names as the MECHANICAL (not
 * analytic) obstruction to instantiating A_t^{eff} / B_t^{eff} at the barrier anchor
 * T_PT = 3e12 -- model the worst-case ulp accumulation ~ N * eps under directed
 * rounding at double vs extended precision, and contrast it with the shrinking
 * analytic-tail scale of E_A, E_B.
 *
 * imp-35725 concluded that at the deep T_PT truncation the RELATIVE analytic tails
 * shrink with height, so the real cost of the W1 A + B - C instantiation is
 * certifying an interval sum of N = floor(sqrt(T_PT / 4 pi)) ~ 488602 terms with
 * rigorous rounding -- but it never BUDGETED that mechanical cost. This module supplies
 * the missing number: the standard worst-case forward error of a length-N recursive
 * floating-point sum grows like gamma_{N-1} = (N-1) u / (1 - (N-1) u) ~ N u times the
 * sum of term magnitudes (Higham, Accuracy and Stability of Numerical Algorithms), so
 * under DIRECTED (interval) rounding the accumulated RELATIVE width is O(N * eps). We
 * tabulate that width at three arithmetic precisions and compare it against the O(1)
 * barrier margin and the shrinking analytic tail.
 *
 * ORDER-OF-MAGNITUDE ESTIMATE ONLY. Evaluates no sum; instantiates no interval; verifies
 * no inequality; changes no bound; establishes no positivity; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * FORWARD-ERROR MODEL (worst-case directed rounding)
 * -----------------------------------------------------------------------------
 * Summing N floating-point terms by the naive recursive scheme, each of the N-1
 * additions commits a rounding error bounded by the unit roundoff u; the classical
 * running bound is
 *      | fl(sum) - sum |  <=  gamma_{N-1} * Sum |term_k|,   gamma_n = n u / (1 - n u).
 * With n u << 1 this is ~ N u * Sum|term_k|, i.e. a RELATIVE width ~ N u about the true
 * partial sum. Interval / directed-rounding arithmetic certifies by carrying each
 * endpoint outward one ulp per operation, so the certified interval WIDTH inherits the
 * same O(N * eps) growth (eps = 2 u the machine epsilon). This is the WORST case: the
 * errors are assumed to add coherently. Compensated (Kahan) summation removes the
 * N-dependence and pairwise summation replaces N by log2(N) ~ 18.9, so the linear model
 * here is a pessimistic ceiling, not the achievable cost.
 *
 * NUMBERS AT T_PT (N ~ 488602)
 * -----------------------------------------------------------------------------
 *   double   (binary64,  53-bit mantissa, eps ~ 2.22e-16):  N * eps ~ 1.08e-10
 *   extended (x87 80-bit, 64-bit mantissa, eps ~ 1.08e-19):  N * eps ~ 5.30e-14
 *   quad     (binary128, 113-bit mantissa, eps ~ 1.93e-34):  N * eps ~ 9.41e-29
 *   pairwise (double, log2(N) ~ 18.9 additions):             log2(N) * eps ~ 4.20e-15
 *
 * READING: even at plain double the worst-case certified RELATIVE width ~ 1.08e-10 sits
 * ~10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35725 requiredBudget),
 * so DOUBLE precision already leaves ample strict headroom for the rounding contribution.
 * Extended / quad or a pairwise scheme buy further orders that are NOT needed for the
 * margin. The certified-rounding accumulation therefore EXCEEDS the shrinking analytic
 * tail (imp-35725 E_A, E_B relative tails, many orders below O(1) and falling with height)
 * as the DOMINANT numerical contributor at fixed precision -- but both stay far under the
 * margin. CONCLUSION: precision is NOT the wall; the obstruction is the ENGINEERING of
 * the certified length-N interval sum + strict-inequality check, exactly as imp-35725
 * classified it MECHANICAL. The W1 A + B - C certificate at T_PT stays GREENFIELD.
 *
 * @see imp-35725-w1-effective-error-cap-budget (names the mechanical N-term certified-rounding cost)
 * @see imp-35760-w1-margin-allocation-scope (allocates the barrier margin the cap must fit inside)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (Part D: N(x)=floor(sqrt(x/4 pi)) retained terms)
 * @see imp-35759 (arbitrary-precision working-digit cost of the exact de Bruijn evaluator)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (recursive-sum forward-error bound)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C); Platt-Trudgian 2021 (barrier base)
 */

// -- Anchor + operative constants (import-light; matching imp-35725 / imp-35674) ----
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this estimate
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

// Machine epsilon (eps = 2 u, one ulp) per precision.
const EPS_DOUBLE = 2 ** -52; // binary64, 53-bit mantissa (~2.22e-16)
const EPS_EXTENDED = 2 ** -63; // x87 80-bit, 64-bit mantissa (~1.08e-19)
const EPS_QUAD = 2 ** -112; // binary128, 113-bit mantissa (~1.93e-34)

// Worst-case relative certified-interval width ~ N * eps (coherent directed-rounding).
const WIDTH_DOUBLE = N_AT_TPT * EPS_DOUBLE; // ~1.08e-10
const WIDTH_EXTENDED = N_AT_TPT * EPS_EXTENDED; // ~5.30e-14
const WIDTH_QUAD = N_AT_TPT * EPS_QUAD; // ~9.41e-29
const WIDTH_PAIRWISE_DOUBLE = Math.log2(N_AT_TPT) * EPS_DOUBLE; // ~4.20e-15 (pairwise ceiling)

export const IMP35761_W1_CERTIFIED_ROUNDING_COST_SCOPE = {
  id: 'imp-35761',
  proofSection: 'S-frontier',
  question:
    'Estimate the ABSOLUTE certified-rounding cost of the N ~ 4.886e5-term interval sum imp-35725 names as ' +
    'the mechanical W1 obstruction at T_PT = 3e12: model the worst-case ulp accumulation ~ N * eps under ' +
    'directed rounding at double vs extended precision and contrast it with the shrinking analytic tail. ' +
    'Order-of-magnitude estimate only; evaluates no sum; changes no bound; NO QED.',
  model: {
    scheme: 'naive recursive length-N sum; worst-case coherent directed (interval) rounding',
    forwardErrorBound: '| fl(sum) - sum | <= gamma_{N-1} * Sum|term_k|, gamma_n = n u / (1 - n u) ~ N u',
    relativeWidth: 'certified interval WIDTH ~ O(N * eps) about the true partial sum (eps = 2 u)',
    pessimism:
      'WORST case (errors add coherently); Kahan removes the N-dependence and pairwise replaces N by ' +
      'log2(N) ~ 18.9, so the linear model is a ceiling not the achievable cost',
    retainedTermsAtTPT: N_AT_TPT,
  },
  precisions: {
    double: {
      name: 'binary64 (double)',
      mantissaBits: 53,
      eps: EPS_DOUBLE,
      relativeWidth: WIDTH_DOUBLE,
      note: 'worst-case relative width ~1.08e-10, ~10 orders below the O(1) barrier margin',
    },
    extended: {
      name: 'x87 80-bit (extended)',
      mantissaBits: 64,
      eps: EPS_EXTENDED,
      relativeWidth: WIDTH_EXTENDED,
      note: 'worst-case relative width ~5.30e-14; extra orders beyond what the margin needs',
    },
    quad: {
      name: 'binary128 (quad)',
      mantissaBits: 113,
      eps: EPS_QUAD,
      relativeWidth: WIDTH_QUAD,
      note: 'worst-case relative width ~9.41e-29; far beyond any barrier-margin requirement',
    },
    pairwiseDouble: {
      name: 'binary64 pairwise summation',
      additions: Math.log2(N_AT_TPT),
      eps: EPS_DOUBLE,
      relativeWidth: WIDTH_PAIRWISE_DOUBLE,
      note: 'log2(N)-scaling ceiling ~4.20e-15 at double; N-linear pessimism is avoidable',
    },
  },
  contrast: {
    analyticTail:
      'imp-35725 E_A, E_B: relative truncation tails many orders below the O(1) main term and SHRINKING ' +
      'with height at the deep T_PT truncation',
    roundingVsTail:
      'the certified-rounding accumulation ~ N * eps is the DOMINANT numerical contributor at fixed ' +
      'precision (it grows with N while the analytic tail shrinks), yet at double it is still ~1.08e-10',
    vsMargin:
      'even the double-precision worst-case width sits ~10 orders below the O(1) barrier margin ' +
      '|A_t + B_t| - |C_t| (imp-35760 allocation), so precision is NOT the binding constraint',
  },
  conclusion: {
    precisionSufficient:
      'DOUBLE precision already leaves ample strict headroom for the rounding contribution; extended / ' +
      'quad / pairwise buy orders the margin does not require',
    obstructionIsEngineering:
      'the wall is the ENGINEERING of the certified length-N interval sum plus the strict-inequality ' +
      'check, exactly the MECHANICAL classification imp-35725 gave -- not arithmetic precision',
    staysGreenfield:
      'this module estimates the cost; it evaluates no sum and verifies no inequality, so the W1 ' +
      'A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL ESTIMATE (order-of-magnitude, frontier-direction, NOT rigorous). The mechanical W1 cost ' +
    'imp-35725 names -- certifying an N = floor(sqrt(T_PT/4 pi)) ~ 488602-term interval sum with rigorous ' +
    'rounding -- is modeled by the classical worst-case recursive-sum forward error gamma_{N-1} ~ N u, so ' +
    'the certified interval width grows like O(N * eps). At T_PT: double ~1.08e-10, extended ~5.30e-14, ' +
    'quad ~9.41e-29 relative width; a pairwise scheme caps double at ~4.20e-15 (log2(N)-scaling). This ' +
    'accumulation EXCEEDS the shrinking analytic tail (E_A, E_B) as the dominant numerical contributor at ' +
    'fixed precision, but even the plain-double worst case sits ~10 orders below the O(1) barrier margin ' +
    '|A_t + B_t| - |C_t|. CONCLUSION: arithmetic precision is NOT the binding constraint -- double already ' +
    'gives strict headroom -- so the obstruction is the ENGINEERING of the certified length-N interval sum ' +
    'and the strict-inequality check, exactly the MECHANICAL classification of imp-35725. Evaluates no sum; ' +
    'instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the W1 ' +
    'A + B - C certificate at T_PT stays GREENFIELD; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35725 (names the mechanical N-term certified-rounding cost); imp-35760 (barrier-margin allocation); ' +
    'imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); imp-35759 (arbitrary-precision working-digit ' +
    'cost); imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002 (recursive-sum forward-error ' +
    'bound); Polymath15 2019 (effective approximation H_t = A + B - C); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35761_W1_CERTIFIED_ROUNDING_COST_SCOPE_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35725 / imp-35674 Part D.
    id: 'imp35761-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      IMP35761_W1_CERTIFIED_ROUNDING_COST_SCOPE.model.retainedTermsAtTPT === N_AT_TPT,
  },
  {
    // Worst-case relative width at double ~ N * eps ~ 1.08e-10.
    id: 'imp35761-double-width',
    description: 'Double-precision worst-case relative width ~ N * eps ~ 1.08e-10',
    holds: () =>
      Math.abs(WIDTH_DOUBLE - N_AT_TPT * 2 ** -52) < 1e-30 &&
      WIDTH_DOUBLE > 1e-10 && WIDTH_DOUBLE < 2e-10,
  },
  {
    // Extended precision buys ~4 orders (N * eps ~ 5.3e-14); quad ~9.4e-29.
    id: 'imp35761-precision-ordering',
    description: 'Precision ordering: quad << extended << double << O(1) margin',
    holds: () =>
      WIDTH_QUAD < WIDTH_EXTENDED &&
      WIDTH_EXTENDED < WIDTH_DOUBLE &&
      WIDTH_DOUBLE < 1e-6 &&
      WIDTH_EXTENDED > 1e-14 && WIDTH_EXTENDED < 1e-13 &&
      WIDTH_QUAD < 1e-28,
  },
  {
    // Pairwise summation replaces N by log2(N) ~ 18.9, a ceiling below the N-linear model.
    id: 'imp35761-pairwise-ceiling',
    description: 'Pairwise double ceiling ~ log2(N) * eps ~ 4.2e-15, below the N-linear worst case',
    holds: () =>
      WIDTH_PAIRWISE_DOUBLE < WIDTH_DOUBLE &&
      WIDTH_PAIRWISE_DOUBLE > 1e-15 && WIDTH_PAIRWISE_DOUBLE < 1e-14 &&
      Math.abs(Math.log2(N_AT_TPT) - 18.9) < 0.1,
  },
  {
    // Honesty gate: precision not binding; obstruction MECHANICAL/engineering; greenfield; estimate only; no refereed bound is changed.
    id: 'imp35761-honesty-gate',
    description: 'Precision not binding; obstruction is engineering; greenfield; estimate only, no QED, no refereed bound is changed',
    holds: () =>
      IMP35761_W1_CERTIFIED_ROUNDING_COST_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /ENGINEERING/.test(IMP35761_W1_CERTIFIED_ROUNDING_COST_SCOPE.conclusion.obstructionIsEngineering) &&
      /GREENFIELD/.test(IMP35761_W1_CERTIFIED_ROUNDING_COST_SCOPE.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35761_W1_CERTIFIED_ROUNDING_COST_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35761_W1_CERTIFIED_ROUNDING_COST_SCOPE.verdict),
  },
];

for (const a of IMP35761_W1_CERTIFIED_ROUNDING_COST_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35761-w1-certified-rounding-cost-scope assertion failed: ${a.id}`);
  }
}
