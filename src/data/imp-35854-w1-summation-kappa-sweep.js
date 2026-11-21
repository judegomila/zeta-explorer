/**
 * @module imp-35854-w1-summation-kappa-sweep
 *
 * imp-35854 (numerical, S-frontier): MEASURE the imp-35812 summation-scheme error dependence
 * on the CONDITION NUMBER kappa = (Sum |t_k|) / |Sum t_k| by sweeping the oscillatory-sum
 * constants (alpha, beta) so kappa spans several decades (from a near-1 well-conditioned,
 * essentially same-sign sum to a ~2e5 ill-conditioned, heavily-cancelling sum) on the SAME
 * length N = floor(sqrt(T_PT / 4 pi)) ~ 488602-term sum at T_PT = 3e12.
 *
 * imp-35812 measured naive / pairwise / Kahan-Babuska summation at a SINGLE condition number
 * (kappa ~ 1.4e3, one fixed alpha, beta). imp-35852 stressed the ORDERING at that fixed kappa.
 * Neither varied kappa. This module holds the term family t_k = cos(alpha k + beta sqrt(k)) /
 * sqrt(k) and re-runs the three schemes at ten (alpha, beta) settings chosen so the MEASURED
 * kappa ladders from ~1.0 to ~2.0e5, each against its own EXACT BigInt dyadic reference (the
 * same 2^{-96} fixed-point construction imp-35812 used, error-free). For each rung it reports
 * both the normalized error (err / Sum |t_k|, the Higham gamma scale) and the relative error
 * (err / |Sum t_k| = normalized * kappa, the quantity you actually see in the summed value).
 *
 * CLASSICAL PREDICTION UNDER TEST
 * -----------------------------------------------------------------------------
 * The rigorous recursive-sum forward bound is |computed - true| <= gamma_{N-1} Sum |t_k| with
 * gamma_{N-1} ~ (N-1) u (coherent), so the RELATIVE error ceiling is N u kappa; the Wilkinson
 * random-walk heuristic replaces N by sqrt(N), giving the ticket hypothesis naive rel err ~
 * sqrt(N) u kappa. Kahan-Babuska replaces the gamma factor by ~ 2u (N-independent), so its
 * relative-error ceiling is ~ 2u kappa -- a floor sqrt(N)/2 ~ 350x below naive at every kappa.
 * The test: does the ACHIEVED naive relative error track sqrt(N) u kappa (linear in kappa), and
 * do pairwise / Kahan stay near the roundoff floor (kappa-robust) as cancellation deepens?
 *
 * MEASURED (see kappaSweep below; N = 488602, sqrt(N) u ~ 7.76e-14, u ~ 1.11e-16):
 *   kappa ~ 1.0e0  : naiveNorm ~ 3.5e-14  naiveRel ~ 3.5e-14   kahanRel ~ 5.0e-17
 *   kappa ~ 3.5e1  : naiveNorm ~ 2.3e-16  naiveRel ~ 8.0e-15   kahanRel ~ 3.6e-17
 *   kappa ~ 1.4e3  : naiveNorm ~ 3.0e-17  naiveRel ~ 4.2e-14   kahanRel ~ 2.6e-17  (imp-35812 anchor)
 *   kappa ~ 2.0e5  : naiveNorm ~ 4.2e-17  naiveRel ~ 8.4e-12   kahanRel ~ 2.4e-15
 *
 * READING (HONEST REFINEMENT, not a clean confirmation): the naive relative error DOES grow with
 * kappa but FAR SUBLINEARLY -- only ~2 decades of relative-error growth across ~5.3 decades of
 * kappa -- so the pessimistic sqrt(N) u kappa model is a valid CEILING but is NOT tracked, and
 * increasingly overestimates as kappa rises. The reason is direct in the data: the naive
 * NORMALIZED error is largest (~ sqrt(N) u, the random-walk ceiling) at kappa ~ 1 where the
 * essentially same-sign partial sums grow to ~ Sum |t_k|, and DROPS toward a ~4e-17 plateau at
 * large kappa, because deep cancellation keeps the running accumulator O(1), shrinking the per-
 * step rounding error u |s_i|. So the normalized error is NOT pinned at sqrt(N) u across kappa;
 * the linear-in-kappa relative model breaks precisely because the normalized factor is not
 * kappa-constant. Across ALL rungs the hierarchy Kahan < pairwise < naive holds, Kahan's
 * normalized error stays flat at the unit-roundoff floor (no kappa growth), and Kahan's relative
 * error stays within a small factor of 2u kappa (worst ~2.4e-15 at kappa ~ 2e5) -- so the
 * compensated scheme IS kappa-robust: deepening cancellation does not degrade its absolute
 * accuracy. ALL schemes at ALL kappa remain >= 10 orders below the O(1) barrier margin
 * |A_t + B_t| - |C_t| (imp-35760).
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval;
 * verifies no inequality; changes no bound; establishes no positivity; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35812-w1-summation-scheme-measured-cost (single-kappa baseline; term family + BigInt reference)
 * @see imp-35852-w1-summation-adversarial-ordering (ordering stress at the fixed kappa)
 * @see imp-35761-w1-certified-rounding-cost-scope (pessimistic N u ceiling; kappa enters via relative error)
 * @see imp-35760-w1-margin-allocation-scope (the O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (recursive/pairwise/Kahan; condition number)
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35761) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// Term family t_k = cos(alpha k + beta sqrt(k)) / sqrt(k) (imp-35812); (alpha, beta) tune kappa.
const TERM = (alpha, beta, k) => Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);

// (alpha, beta) rungs chosen so the MEASURED kappa ladders from ~1 to ~2e5. Small alpha keeps
// cos(alpha k) ~ +1 across all k (same-sign, kappa ~ 1); larger alpha / beta deepen cancellation.
// The 8th rung reuses the imp-35812 golden-ratio anchor (kappa ~ 1.4e3) as a cross-check.
const RUNGS = [
  { alpha: 5e-7, beta: 0 },
  { alpha: 7e-6, beta: 0 },
  { alpha: 9e-6, beta: 0 },
  { alpha: 1.0e-5, beta: 0.05 },
  { alpha: 1.3e-5, beta: 0.1 },
  { alpha: 1.8e-5, beta: 0.25 },
  { alpha: 4e-5, beta: 0.7 },
  { alpha: 0.6180339887498949, beta: 2.3999632297286533 }, // imp-35812 anchor
  { alpha: 5e-5, beta: 1.0 },
  { alpha: 4.99e-5, beta: 1.0 },
];

// -- Summation schemes (verbatim from imp-35812) ---------------------------------------
function sumNaive(terms) {
  let s = 0;
  for (let i = 0; i < terms.length; i++) s += terms[i];
  return s;
}

function sumKahan(terms) {
  // Kahan-Babuska compensated summation: running correction c cancels the lost low bits.
  let s = 0;
  let c = 0;
  for (let i = 0; i < terms.length; i++) {
    const y = terms[i] - c;
    const t = s + y;
    c = t - s - y;
    s = t;
  }
  return s;
}

function sumPairwise(terms) {
  // Divide-and-conquer pairwise summation: error grows like log2(N), not N.
  const rec = (lo, hi) => {
    if (hi - lo <= 128) {
      let a = 0;
      for (let i = lo; i < hi; i++) a += terms[i];
      return a;
    }
    const mid = (lo + hi) >> 1;
    return rec(lo, mid) + rec(mid, hi);
  };
  return rec(0, terms.length);
}

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) --------
const FRAC_BITS = 96n; // common fixed-point scale 2^{-96}; covers the term exponent range
const _buf = new ArrayBuffer(8);
const _dv = new DataView(_buf);

function doubleToFixedBigInt(x) {
  // Return the exact m * 2^{-96} representation of x as a BigInt numerator.
  if (x === 0) return 0n;
  _dv.setFloat64(0, x);
  const hi = _dv.getUint32(0);
  const lo = _dv.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  let exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  if (exp === 0) {
    exp = -1074; // subnormal (not expected for these magnitudes, handled for safety)
  } else {
    mant |= 1n << 52n; // restore implicit leading bit
    exp = exp - 1075; // remove exponent bias (1023) and mantissa width (52)
  }
  const shift = BigInt(exp) + FRAC_BITS;
  let num = sign * mant;
  num = shift >= 0n ? num << shift : num >> -shift;
  return num;
}

function normalizedError(schemeResult, trueNum, sumAbs) {
  // Exact absolute error |schemeResult - trueSum|, divided by Sum |t_k| (the Higham scale).
  const err = doubleToFixedBigInt(schemeResult) - trueNum;
  const absErr = err < 0n ? -err : err;
  const absErrDouble = Number(absErr << 80n) / 2 ** 80 / 2 ** 96;
  return absErrDouble / sumAbs;
}

// -- Run the three schemes at one (alpha, beta) rung, length N_AT_TPT --------------------
function measureRung(alpha, beta) {
  const N = N_AT_TPT;
  const terms = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(alpha, beta, k);
    terms[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  const naive = sumNaive(terms);
  const pairwise = sumPairwise(terms);
  const kahan = sumKahan(terms);
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(terms[i]);
  const trueAbs = trueNum < 0n ? -trueNum : trueNum;
  const trueSum = (Number(trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (trueNum < 0n ? -1 : 1);
  const kappa = sumAbs / Math.abs(trueSum);
  const naiveNorm = normalizedError(naive, trueNum, sumAbs);
  const pairwiseNorm = normalizedError(pairwise, trueNum, sumAbs);
  const kahanNorm = normalizedError(kahan, trueNum, sumAbs);
  return {
    alpha,
    beta,
    kappa,
    sumAbs,
    // normalized error (by Sum |t_k|): the Higham gamma scale, roughly scheme/N dependent
    naiveNorm,
    pairwiseNorm,
    kahanNorm,
    // relative error (by |Sum t_k|) = normalized * kappa: what appears in the summed value
    naiveRel: naiveNorm * kappa,
    pairwiseRel: pairwiseNorm * kappa,
    kahanRel: kahanNorm * kappa,
  };
}

// Run the ladder (deterministic; ~0.2 s total). Sorted ascending by measured kappa.
const SWEEP = RUNGS.map((r) => measureRung(r.alpha, r.beta)).sort((a, b) => a.kappa - b.kappa);

const KAPPA_MIN = SWEEP[0].kappa;
const KAPPA_MAX = SWEEP[SWEEP.length - 1].kappa;
const KAPPA_DECADES = Math.log10(KAPPA_MAX / KAPPA_MIN);

// Reference scales.
const SQRTN_U = Math.sqrt(N_AT_TPT) * U_ROUNDOFF; // Wilkinson random-walk factor
const N_U = N_AT_TPT * U_ROUNDOFF; // coherent (Higham) factor

// naive relative-error growth: decades of naiveRel growth across the kappa sweep.
const NAIVE_REL_MIN = Math.min(...SWEEP.map((r) => r.naiveRel));
const NAIVE_REL_MAX = Math.max(...SWEEP.map((r) => r.naiveRel));
const NAIVE_REL_DECADES = Math.log10(NAIVE_REL_MAX / NAIVE_REL_MIN);

// Every rung: measured naive relative error is BELOW the sqrt(N) u kappa random-walk ceiling.
const NAIVE_BELOW_SQRTN_CEILING = SWEEP.every((r) => r.naiveRel < SQRTN_U * r.kappa);
// Every rung: Kahan < pairwise < naive on the normalized scale (scheme hierarchy preserved).
const HIERARCHY_HOLDS = SWEEP.every((r) => r.kahanNorm <= r.pairwiseNorm && r.pairwiseNorm <= r.naiveNorm);
// Kahan normalized error stays flat at the unit-roundoff floor across all kappa (no kappa growth).
const KAHAN_NORM_MAX = Math.max(...SWEEP.map((r) => r.kahanNorm));
// naive normalized error DROPS from the ~sqrt(N) u ceiling (low kappa) toward the plateau.
const NAIVE_NORM_LOW_KAPPA = SWEEP[0].naiveNorm; // kappa ~ 1
const NAIVE_NORM_HIGH_KAPPA = SWEEP[SWEEP.length - 1].naiveNorm; // kappa ~ 2e5

export const IMP35854_W1_SUMMATION_KAPPA_SWEEP = {
  id: 'imp-35854',
  proofSection: 'S-frontier',
  question:
    'MEASURE the imp-35812 summation-scheme error dependence on the condition number ' +
    'kappa = (Sum |t_k|) / |Sum t_k| by sweeping (alpha, beta) so kappa spans several decades at ' +
    'N ~ 4.886e5, testing whether naive relative error tracks ~ sqrt(N) u kappa while pairwise / ' +
    'Kahan stay kappa-robust. Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  setup: {
    N: N_AT_TPT,
    termFamily: 't_k = cos(alpha k + beta sqrt(k)) / sqrt(k), k = 1 .. N (imp-35812; deterministic, no RNG)',
    kappaControl: 'small alpha keeps cos(alpha k) ~ +1 (same-sign, kappa ~ 1); larger alpha / beta deepen cancellation',
    reference: 'per-rung exact: each double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt (error-free)',
    scales: { sqrtN_u: SQRTN_U, N_u: N_U, u: U_ROUNDOFF, eps: EPS_DOUBLE },
  },
  kappaRange: { min: KAPPA_MIN, max: KAPPA_MAX, decades: KAPPA_DECADES },
  kappaSweep: SWEEP.map((r) => ({
    kappa: r.kappa,
    naiveNorm: r.naiveNorm,
    pairwiseNorm: r.pairwiseNorm,
    kahanNorm: r.kahanNorm,
    naiveRel: r.naiveRel,
    pairwiseRel: r.pairwiseRel,
    kahanRel: r.kahanRel,
    sqrtNuKappaCeiling: SQRTN_U * r.kappa, // Wilkinson random-walk relative ceiling
    nuKappaCeiling: N_U * r.kappa, // coherent (Higham) relative ceiling
  })),
  naiveRelGrowth: {
    kappaDecades: KAPPA_DECADES,
    naiveRelDecades: NAIVE_REL_DECADES,
    sublinear: NAIVE_REL_DECADES < KAPPA_DECADES - 1, // grows far slower than linear in kappa
    belowSqrtNuKappaCeiling: NAIVE_BELOW_SQRTN_CEILING,
  },
  reading: {
    naiveSublinearNotLinear:
      'the naive relative error grows with kappa but FAR SUBLINEARLY (~' +
      NAIVE_REL_DECADES.toFixed(1) + ' decades over ~' + KAPPA_DECADES.toFixed(1) +
      ' decades of kappa); the pessimistic sqrt(N) u kappa model is a valid CEILING (every rung sits ' +
      'below it) but is NOT tracked, overestimating increasingly as kappa rises',
    normalizedNotKappaConstant:
      'the linear-in-kappa relative model breaks because the naive NORMALIZED error is NOT kappa-constant: ' +
      'it is largest (~ sqrt(N) u) at kappa ~ 1 (same-sign partial sums grow to ~ Sum |t_k|) and DROPS ' +
      'toward a ~4e-17 plateau at large kappa (deep cancellation keeps the accumulator O(1), shrinking u |s_i|)',
    kahanKappaRobust:
      'Kahan-Babuska normalized error stays flat at the unit-roundoff floor across all kappa (no kappa growth), ' +
      'and its relative error stays within a small factor of 2u kappa -- compensation is kappa-robust',
    hierarchyPreserved:
      'the scheme hierarchy Kahan < pairwise < naive on the normalized scale holds at every kappa rung',
    allUnderMargin:
      'all three schemes at all kappa remain >= 10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760)',
  },
  conclusion: {
    hypothesisRefined:
      'the ticket hypothesis (naive rel ~ sqrt(N) u kappa, linear in kappa) is REFINED not confirmed: sqrt(N) u kappa ' +
      'bounds every rung but the achieved naive relative error grows far sublinearly, because the achieved normalized ' +
      'error decreases with kappa rather than staying pinned at the random-walk ceiling',
    kahanConfirmedRobust:
      'the kappa-robustness of pairwise / Kahan IS confirmed: normalized errors do not grow with kappa and the ' +
      'hierarchy Kahan < pairwise < naive is preserved across the full sweep',
    precisionNotBinding:
      'even at kappa ~ 2e5 (near-total cancellation) every measured error is >= 10 orders below the O(1) barrier ' +
      'margin; precision is NOT the binding constraint at any conditioning',
    staysGreenfield:
      'this module measures scheme errors only; it evaluates no sum of H_t and verifies no inequality, so the W1 ' +
      'A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  honestStatus:
    'The naive relative error grows with kappa but FAR SUBLINEARLY (~' + NAIVE_REL_DECADES.toFixed(1) +
    ' decades of naiveRel growth over ~' + KAPPA_DECADES.toFixed(1) + ' decades of kappa), so the ' +
    'pessimistic sqrt(N) u kappa Wilkinson ceiling is a valid UPPER BOUND (every rung sits below it) ' +
    'but is NOT TRACKED as a predictive law -- it increasingly OVERESTIMATES the achieved naive ' +
    'relative error as kappa rises, because the naive NORMALIZED error itself drops from ~sqrt(N) u ' +
    'at kappa ~ 1 toward a ~4e-17 plateau at kappa ~ 2e5, rather than staying kappa-constant. Downstream ' +
    'readers should not treat sqrt(N) u kappa as the achieved naive error, only as a safe ceiling.',
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Sweeping (alpha, beta) so the measured ' +
    'condition number kappa = (Sum |t_k|) / |Sum t_k| ladders from ~' + KAPPA_MIN.toFixed(2) + ' to ~' +
    KAPPA_MAX.toExponential(1) + ' (~' + KAPPA_DECADES.toFixed(1) + ' decades) on the SAME N = floor(sqrt(T_PT/4 pi)) ' +
    '~ 488602-term oscillatory sum, and measuring naive / pairwise / Kahan-Babuska errors against a per-rung EXACT ' +
    'BigInt reference: the naive RELATIVE error grows FAR SUBLINEARLY in kappa (~' + NAIVE_REL_DECADES.toFixed(1) +
    ' decades over ~' + KAPPA_DECADES.toFixed(1) + '), decisively REFINING the pessimistic sqrt(N) u kappa model -- ' +
    'that model is a valid ceiling (every rung sits below it) but is NOT tracked, because the achieved naive ' +
    'NORMALIZED error is largest (~ sqrt(N) u) at kappa ~ 1 and DROPS toward a ~4e-17 plateau as cancellation deepens ' +
    '(the accumulator stays O(1)), so the normalized factor is not kappa-constant. Pairwise / Kahan ARE kappa-robust: ' +
    'their normalized errors show no kappa growth, Kahan stays flat at the unit-roundoff floor, and the hierarchy ' +
    'Kahan < pairwise < naive holds at every rung. All schemes at all kappa remain >= 10 orders below the O(1) ' +
    'barrier margin |A_t + B_t| - |C_t| (imp-35760); precision is NOT the binding constraint at any conditioning. ' +
    'Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; changes no ' +
    'bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and ' +
    'MECHANICAL (imp-35725); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35812 (single-kappa baseline; term family + exact BigInt reference); imp-35852 (ordering stress at fixed ' +
    'kappa); imp-35761 (pessimistic N u ceiling); imp-35760 (barrier-margin allocation); imp-35725 (mechanical ' +
    'N-term certified cost); imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002 (recursive/pairwise/' +
    'Kahan error bounds; condition number); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35854_W1_SUMMATION_KAPPA_SWEEP_ASSERTIONS = [
  {
    // The (alpha, beta) sweep spans several decades of the MEASURED condition number kappa.
    id: 'imp35854-kappa-spans-decades',
    description: 'Measured kappa ladders from near-1 to ~1e5 across the (alpha, beta) rungs (>= 4 decades)',
    holds: () =>
      SWEEP.length === RUNGS.length &&
      KAPPA_MIN < 1.5 &&
      KAPPA_MAX > 5e4 &&
      KAPPA_DECADES >= 4,
  },
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35812 / imp-35674 Part D.
    id: 'imp35854-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // Naive relative error grows FAR SUBLINEARLY in kappa (pessimistic sqrt(N) u kappa NOT tracked).
    id: 'imp35854-naive-rel-sublinear',
    description: 'Naive relative error grows far sublinearly in kappa (>= 1 decade slower than linear)',
    holds: () =>
      NAIVE_REL_DECADES > 0 &&
      NAIVE_REL_DECADES < KAPPA_DECADES - 1 &&
      NAIVE_BELOW_SQRTN_CEILING,
  },
  {
    // Naive NORMALIZED error is largest at low kappa (~ sqrt(N) u) and drops at high kappa.
    id: 'imp35854-naive-norm-drops-with-kappa',
    description: 'Naive normalized error is largest near kappa~1 (~sqrt(N)u) and drops at high kappa',
    holds: () =>
      NAIVE_NORM_LOW_KAPPA > 5 * NAIVE_NORM_HIGH_KAPPA &&
      NAIVE_NORM_LOW_KAPPA < 3 * SQRTN_U &&
      NAIVE_NORM_LOW_KAPPA > 0.1 * SQRTN_U,
  },
  {
    // Kahan is kappa-robust: normalized error flat at the unit-roundoff floor across all kappa.
    id: 'imp35854-kahan-kappa-robust',
    description: 'Kahan normalized error stays at the unit-roundoff floor across all kappa (< 2u, no kappa growth)',
    holds: () =>
      KAHAN_NORM_MAX < 2 * U_ROUNDOFF &&
      SWEEP.every((r) => r.kahanNorm > 0),
  },
  {
    // Scheme hierarchy Kahan < pairwise < naive preserved at every kappa rung.
    id: 'imp35854-hierarchy-preserved',
    description: 'Kahan < pairwise < naive on the normalized scale at every kappa rung',
    holds: () => HIERARCHY_HOLDS,
  },
  {
    // Honest-status note: sqrt(N) u kappa is a valid ceiling but NOT tracked as kappa rises (imp-35942).
    id: 'imp35854-honest-status-ceiling-not-tracked',
    description: 'honestStatus states sqrt(N) u kappa is a valid ceiling but not tracked, overestimating as kappa rises',
    holds: () =>
      typeof IMP35854_W1_SUMMATION_KAPPA_SWEEP.honestStatus === 'string' &&
      /NOT TRACKED/.test(IMP35854_W1_SUMMATION_KAPPA_SWEEP.honestStatus) &&
      /OVERESTIMATES/.test(IMP35854_W1_SUMMATION_KAPPA_SWEEP.honestStatus) &&
      /valid UPPER BOUND/.test(IMP35854_W1_SUMMATION_KAPPA_SWEEP.honestStatus),
  },
  {
    // imp-35906: the docstring-quoted literals (naiveNorm~3.5e-14 at kappa~1; naiveRel~8.4e-12
    // and kahanRel~2.4e-15 at kappa~2e5) must reproduce from the live SWEEP, guarding against
    // transcription drift between the comment table and the exported kappaSweep object.
    id: 'imp35906-docstring-literals-no-drift',
    description: 'Docstring-quoted kappa~1 and kappa~2e5 literals reproduce from the live SWEEP within 5% (no transcription drift)',
    holds: () => {
      const nearKappa1 = SWEEP[0];
      const nearKappa2e5 = SWEEP[SWEEP.length - 1];
      const relClose = (measured, quoted) => Math.abs(measured - quoted) / quoted < 0.05;
      return (
        relClose(nearKappa1.naiveNorm, 3.5e-14) &&
        relClose(nearKappa2e5.naiveRel, 8.4e-12) &&
        relClose(nearKappa2e5.kahanRel, 2.4e-15)
      );
    },
  },
  {
    // Honesty gate: measurement only; hypothesis REFINED not confirmed; no QED; no refereed bound is changed.
    id: 'imp35854-honesty-gate',
    description: 'Measurement only; hypothesis refined; greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35854_W1_SUMMATION_KAPPA_SWEEP.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /REFINED/.test(IMP35854_W1_SUMMATION_KAPPA_SWEEP.conclusion.hypothesisRefined) &&
      /GREENFIELD/.test(IMP35854_W1_SUMMATION_KAPPA_SWEEP.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35854_W1_SUMMATION_KAPPA_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP35854_W1_SUMMATION_KAPPA_SWEEP.verdict),
  },
];

for (const a of IMP35854_W1_SUMMATION_KAPPA_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35854-w1-summation-kappa-sweep assertion failed: ${a.id}`);
  }
}
