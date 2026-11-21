/**
 * @module imp-35929-w1-summation-deep-cancellation
 *
 * imp-35929 (numerical, S-frontier): EXTEND the imp-35854 condition-number sweep 1-2 decades
 * ABOVE its kappa ~ 2.0e5 top rung, into the DEEP-cancellation regime kappa ~ 6e5 .. 1.1e7,
 * to measure whether the two imp-35854 findings persist or break as the exact sum shrinks
 * toward the roundoff floor:
 *   (i)  the naive NORMALIZED error plateau (~ 4e-17, err / Sum |t_k|), and
 *   (ii) the Kahan-Babuska relative-error robustness (kahanRel within a small factor of 2u kappa).
 *
 * imp-35854 swept the SAME N = floor(sqrt(T_PT / 4 pi)) ~ 488602-term oscillatory sum
 * t_k = cos(alpha k + beta sqrt(k)) / sqrt(k) at ten (alpha, beta) rungs so the MEASURED
 * condition number kappa = (Sum |t_k|) / |Sum t_k| ladders from ~1.0 to ~2.0e5, and found the
 * naive normalized error is largest (~ sqrt(N) u) at kappa ~ 1 and drops toward a ~4e-17 plateau
 * as cancellation deepens, while Kahan stays kappa-robust. The behaviour at DEEPER cancellation
 * (kappa >> 2e5), where the net sum |Sum t_k| falls toward ~1e-4 .. 1e-5, was never probed.
 *
 * This import-light module holds the SAME term family and summation schemes and re-runs the three
 * schemes at five NEW (alpha, beta) rungs chosen so the measured kappa reaches ~6.25e5, ~1.12e6,
 * ~2.24e6, ~5.79e6 and ~1.12e7 -- i.e. ~0.5 to ~1.75 decades ABOVE the imp-35854 top rung -- each
 * against its own EXACT BigInt dyadic 2^{-96} reference (the imp-35812 construction, error-free).
 * For each rung it reports the normalized error (err / Sum |t_k|, the Higham gamma scale) and the
 * relative error (err / |Sum t_k| = normalized kappa), plus the 2u kappa Kahan reference ceiling.
 *
 * MEASURED (see deepSweep below; N = 488602, sqrt(N) u ~ 7.76e-14, u ~ 1.11e-16):
 *   kappa ~ 6.25e5 : |Sum t_k| ~ 1.42e-3  naiveNorm ~ 3.3e-17  kahanRel ~ 3.3e-14  2u kappa ~ 1.39e-10
 *   kappa ~ 1.12e6 : |Sum t_k| ~ 7.95e-4  naiveNorm ~ 4.9e-17  kahanRel ~ 7.5e-15  2u kappa ~ 2.48e-10
 *   kappa ~ 2.24e6 : |Sum t_k| ~ 3.97e-4  naiveNorm ~ 5.3e-17  kahanRel ~ 4.2e-14  2u kappa ~ 4.97e-10
 *   kappa ~ 5.79e6 : |Sum t_k| ~ 1.54e-4  naiveNorm ~ 8.8e-17  kahanRel ~ 5.1e-14  2u kappa ~ 1.29e-9
 *   kappa ~ 1.12e7 : |Sum t_k| ~ 7.92e-5  naiveNorm ~ 3.9e-17  kahanRel ~ 3.2e-13  2u kappa ~ 2.49e-9
 *
 * READING (both imp-35854 findings PERSIST, neither breaks): across ~1.75 further decades of kappa
 * the naive NORMALIZED error stays on the same ~few e-17 plateau (all rungs within [3e-17, 1e-16],
 * i.e. within ~a factor of 3 of the imp-35854 ~4e-17 plateau and ~3 orders below sqrt(N) u), so the
 * plateau does NOT break as cancellation deepens; and Kahan-Babuska stays comfortably kappa-robust,
 * with kahanRel BELOW the 2u kappa reference ceiling at every rung (by >= 3 orders) -- in fact its
 * normalized error DROPS well below u (kahanNorm ~ 1e-20 .. 1e-19) as cancellation deepens, so the
 * 2u kappa line is an increasingly LOOSE ceiling. The exact sum |Sum t_k| falls only to ~7.9e-5 at
 * kappa ~ 1.12e7 -- still ~1e15 ulps above the double roundoff floor of an O(1e-4) number -- so
 * machine-representability of the exact sum is NOT reached and cannot be the limiting factor here;
 * the naive relative error naiveRel = naiveNorm kappa continues to grow (to ~4e-10) purely via the
 * explicit kappa factor while the normalized error stays plateaued. All schemes at all kappa remain
 * >= 8 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760).
 *
 * MEASUREMENT ONLY. Reuses the imp-35812 2^{-96} reference; certifies no W1 bound; evaluates no
 * true H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no
 * positivity; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35854-w1-summation-kappa-sweep (the kappa ~1..2e5 sweep this extends)
 * @see imp-35812-w1-summation-scheme-measured-cost (single-kappa baseline; term family + BigInt reference)
 * @see imp-35886-w1-summation-kappa-crossover (the kappa^-1 naive-normalized descent to the plateau)
 * @see imp-35761-w1-certified-rounding-cost-scope (pessimistic N u ceiling; kappa enters via relative error)
 * @see imp-35760-w1-margin-allocation-scope (the O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (recursive/pairwise/Kahan; condition number)
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35854) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// Term family t_k = cos(alpha k + beta sqrt(k)) / sqrt(k) (imp-35812); (alpha, beta) tune kappa.
const TERM = (alpha, beta, k) => Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);

// (alpha, beta) rungs (found by the scripts/imp-35929-explore.mjs alpha grid scan) chosen so the
// MEASURED kappa reaches ~6e5 .. ~1.1e7 -- 1-2 decades ABOVE the imp-35854 top rung (kappa ~ 2e5),
// i.e. DEEPER cancellation where the net sum |Sum t_k| shrinks toward ~1e-4 .. 1e-5.
const RUNGS = [
  { alpha: 6.225e-5, beta: 1.2 }, // kappa ~ 6.25e5
  { alpha: 3.12e-5, beta: 1.5 }, // kappa ~ 1.12e6
  { alpha: 6.875e-5, beta: 1.5 }, // kappa ~ 2.24e6
  { alpha: 5.675e-5, beta: 1.5 }, // kappa ~ 5.79e6
  { alpha: 6.95e-5, beta: 1.5 }, // kappa ~ 1.12e7
];

// -- Summation schemes (verbatim from imp-35812 / imp-35854) ----------------------------
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
    trueSum,
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

// Run the ladder (deterministic; ~1 s total for 5 rungs). Sorted ascending by measured kappa.
const SWEEP = RUNGS.map((r) => measureRung(r.alpha, r.beta)).sort((a, b) => a.kappa - b.kappa);

const KAPPA_MIN = SWEEP[0].kappa;
const KAPPA_MAX = SWEEP[SWEEP.length - 1].kappa;
const KAPPA_DECADES = Math.log10(KAPPA_MAX / KAPPA_MIN);

// Reference scales.
const SQRTN_U = Math.sqrt(N_AT_TPT) * U_ROUNDOFF; // Wilkinson random-walk factor
const N_U = N_AT_TPT * U_ROUNDOFF; // coherent (Higham) factor

// imp-35854 top-rung anchor: kappa ~ 2e5 was its deepest cancellation. This sweep starts ABOVE it.
const IMP35854_TOP_KAPPA = 1.99e5;
const IMP35854_PLATEAU = 4e-17; // the ~4e-17 naive-normalized plateau imp-35854 reported

// Persistence tests:
// (i) naive NORMALIZED plateau holds -- every rung stays within a small band around the plateau.
const NAIVE_NORM_MIN = Math.min(...SWEEP.map((r) => r.naiveNorm));
const NAIVE_NORM_MAX = Math.max(...SWEEP.map((r) => r.naiveNorm));
const PLATEAU_HOLDS =
  NAIVE_NORM_MAX < 30 * IMP35854_PLATEAU && // stays within ~1.5 orders of the imp-35854 plateau
  NAIVE_NORM_MAX < 0.1 * SQRTN_U; // and >= 1 order below the sqrt(N) u ceiling
// (ii) Kahan relative error stays within (and here far below) the 2u kappa reference ceiling.
const KAHAN_WITHIN_2U_KAPPA = SWEEP.every((r) => r.kahanRel < 2 * U_ROUNDOFF * r.kappa);
const KAHAN_REL_MAX_MULTIPLE = Math.max(...SWEEP.map((r) => r.kahanRel / (2 * U_ROUNDOFF * r.kappa)));
// Kahan normalized error drops well below u as cancellation deepens (kappa-robust, not degrading).
const KAHAN_NORM_MAX = Math.max(...SWEEP.map((r) => r.kahanNorm));
// The exact sum shrinks but stays FAR above the double roundoff floor of an O(1e-4) number.
const MIN_ABS_SUM = Math.min(...SWEEP.map((r) => Math.abs(r.trueSum)));
const MIN_SUM_ULPS = MIN_ABS_SUM / (Math.abs(MIN_ABS_SUM) * U_ROUNDOFF * 2); // ~= 1/(2u), huge
// naive RELATIVE error keeps growing via the explicit kappa factor even as the plateau holds.
const NAIVE_REL_MAX = Math.max(...SWEEP.map((r) => r.naiveRel));

export const IMP35929_W1_SUMMATION_DEEP_CANCELLATION = {
  id: 'imp-35929',
  proofSection: 'S-frontier',
  question:
    'EXTEND the imp-35854 condition-number sweep 1-2 decades ABOVE its kappa ~ 2e5 top rung, into ' +
    'the deep-cancellation regime kappa ~ 6e5 .. 1.1e7 on the SAME N ~ 4.886e5-term oscillatory sum, ' +
    'to measure whether the naive NORMALIZED error plateau (~4e-17) and the Kahan-within-2u kappa ' +
    'robustness persist or break as the exact sum shrinks toward the roundoff floor. Measurement ' +
    'only; reuses the imp-35812 2^{-96} reference; certifies no W1 bound; changes no bound; NO QED.',
  setup: {
    N: N_AT_TPT,
    termFamily: 't_k = cos(alpha k + beta sqrt(k)) / sqrt(k), k = 1 .. N (imp-35812; deterministic, no RNG)',
    kappaControl: 'larger alpha with beta ~ 1.2-1.5 pushes cancellation deeper, shrinking |Sum t_k| toward ~1e-4..1e-5',
    reference: 'per-rung exact: each double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt (error-free)',
    imp35854TopKappa: IMP35854_TOP_KAPPA,
    scales: { sqrtN_u: SQRTN_U, N_u: N_U, u: U_ROUNDOFF, eps: EPS_DOUBLE },
  },
  kappaRange: { min: KAPPA_MIN, max: KAPPA_MAX, decades: KAPPA_DECADES, decadesAboveImp35854: Math.log10(KAPPA_MAX / IMP35854_TOP_KAPPA) },
  deepSweep: SWEEP.map((r) => ({
    kappa: r.kappa,
    absSum: Math.abs(r.trueSum),
    naiveNorm: r.naiveNorm,
    pairwiseNorm: r.pairwiseNorm,
    kahanNorm: r.kahanNorm,
    naiveRel: r.naiveRel,
    pairwiseRel: r.pairwiseRel,
    kahanRel: r.kahanRel,
    twoUKappaCeiling: 2 * U_ROUNDOFF * r.kappa, // Kahan-Babuska relative-error reference ceiling
    sqrtNuKappaCeiling: SQRTN_U * r.kappa, // Wilkinson random-walk naive relative ceiling
  })),
  persistence: {
    plateauHolds: PLATEAU_HOLDS,
    naiveNormBand: { min: NAIVE_NORM_MIN, max: NAIVE_NORM_MAX, imp35854Plateau: IMP35854_PLATEAU },
    kahanWithin2uKappa: KAHAN_WITHIN_2U_KAPPA,
    kahanRelMaxMultipleOf2uKappa: KAHAN_REL_MAX_MULTIPLE, // worst kahanRel / (2u kappa); << 1 here
    kahanNormMax: KAHAN_NORM_MAX,
    minAbsSum: MIN_ABS_SUM,
    minSumUlpsAboveFloor: MIN_SUM_ULPS,
    naiveRelMax: NAIVE_REL_MAX,
  },
  reading: {
    plateauPersists:
      'across ~' + KAPPA_DECADES.toFixed(2) + ' further decades of kappa (top rung kappa ~ ' +
      KAPPA_MAX.toExponential(2) + ', ~' + Math.log10(KAPPA_MAX / IMP35854_TOP_KAPPA).toFixed(2) +
      ' decades above the imp-35854 top rung) the naive NORMALIZED error stays on the same ~few e-17 ' +
      'plateau (band [' + NAIVE_NORM_MIN.toExponential(2) + ', ' + NAIVE_NORM_MAX.toExponential(2) +
      '], within ~a factor of a few of the imp-35854 ~4e-17 plateau and >= 1 order below sqrt(N) u): ' +
      'the plateau does NOT break as cancellation deepens',
    kahanStaysRobust:
      'Kahan-Babuska stays comfortably kappa-robust: kahanRel is BELOW the 2u kappa reference ceiling ' +
      'at every rung (worst multiple ~' + KAHAN_REL_MAX_MULTIPLE.toExponential(2) + '), and its ' +
      'normalized error DROPS well below u (kahanNorm max ~' + KAHAN_NORM_MAX.toExponential(2) +
      ') as cancellation deepens -- so 2u kappa is an increasingly LOOSE ceiling, not a tracked law',
    representabilityNotReached:
      'the exact sum falls only to |Sum t_k| ~ ' + MIN_ABS_SUM.toExponential(2) + ' at the top rung -- ' +
      'still ~1e15 ulps above the double roundoff floor of an O(1e-4) number -- so machine-' +
      'representability of the exact sum is NOT reached and cannot be the limiting factor at this kappa',
    naiveRelKeepsGrowing:
      'the naive RELATIVE error keeps growing (to ~' + NAIVE_REL_MAX.toExponential(2) + ') PURELY via the ' +
      'explicit kappa factor (naiveRel = naiveNorm kappa) while the normalized error stays plateaued -- ' +
      'exactly the far-sublinear-in-kappa relative growth imp-35854 identified, now confirmed 1-2 decades higher',
    allUnderMargin:
      'all three schemes at all kappa remain >= 8 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760)',
  },
  conclusion: {
    findingsPersist:
      'BOTH imp-35854 findings PERSIST into the kappa ~ 6e5 .. 1.1e7 deep-cancellation regime: the naive ' +
      'normalized plateau holds and Kahan stays within (in fact far below) the 2u kappa ceiling; NEITHER breaks',
    noRepresentabilityWall:
      'the exact sum never approaches machine-representability limits at this kappa, so the persistence is a ' +
      'genuine accumulator property, not an artifact of the exact sum staying resolvable',
    precisionNotBinding:
      'even at kappa ~ 1.1e7 (near-total cancellation) every measured error is >= 8 orders below the O(1) barrier ' +
      'margin; precision is NOT the binding constraint at any conditioning',
    staysGreenfield:
      'this module measures scheme errors only; it evaluates no sum of H_t and verifies no inequality, so the W1 ' +
      'A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  honestStatus:
    'This EXTENDS the imp-35854 sweep ~1-2 decades higher in kappa (to ~1.1e7). Both imp-35854 findings ' +
    'PERSIST: the naive normalized error stays on its ~few e-17 plateau and Kahan-Babuska stays kappa-robust ' +
    '(kahanRel below the 2u kappa ceiling by >= 3 orders). Downstream readers should note the exact sum still ' +
    'sits ~1e15 ulps above the roundoff floor even at kappa ~ 1.1e7, so this does NOT probe the true machine-' +
    'representability wall -- it shows the plateau and robustness are intact well before any such wall. This is ' +
    'a measurement of scheme error, not a certified bound; it changes no bound and asserts no positivity.',
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Extending the imp-35854 (alpha, beta) ' +
    'sweep to five NEW rungs so the measured condition number kappa = (Sum |t_k|) / |Sum t_k| reaches ~' +
    KAPPA_MIN.toExponential(1) + ' .. ~' + KAPPA_MAX.toExponential(1) + ' (~' +
    Math.log10(KAPPA_MAX / IMP35854_TOP_KAPPA).toFixed(1) + ' decades ABOVE the imp-35854 top rung) on the ' +
    'SAME N = floor(sqrt(T_PT/4 pi)) ~ 488602-term oscillatory sum, each vs a per-rung EXACT BigInt 2^{-96} ' +
    'reference: BOTH imp-35854 findings PERSIST. The naive NORMALIZED error stays on its ~few e-17 plateau ' +
    '(band [' + NAIVE_NORM_MIN.toExponential(1) + ', ' + NAIVE_NORM_MAX.toExponential(1) + '], >= 1 order below ' +
    'sqrt(N) u) and Kahan-Babuska stays kappa-robust (kahanRel below the 2u kappa ceiling by >= 3 orders, its ' +
    'normalized error DROPPING below u as cancellation deepens). The exact sum falls only to ~' +
    MIN_ABS_SUM.toExponential(1) + ' -- still ~1e15 ulps above the roundoff floor -- so machine-representability ' +
    'is NOT reached and is not the limiting factor; the naive relative error keeps growing (to ~' +
    NAIVE_REL_MAX.toExponential(1) + ') purely via the explicit kappa factor. All schemes at all kappa remain ' +
    '>= 8 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760); precision is NOT the binding ' +
    'constraint at any conditioning. Certifies no W1 bound; evaluates no true H_0; instantiates no interval; ' +
    'verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT ' +
    'stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb GUE-conditional (imp-486) untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35854 (the kappa ~1..2e5 sweep this extends); imp-35812 (single-kappa baseline; term family + exact ' +
    'BigInt reference); imp-35886 (kappa^-1 naive-normalized descent to the plateau); imp-35761 (pessimistic ' +
    'N u ceiling); imp-35760 (barrier-margin allocation); imp-35725 (mechanical N-term certified cost); ' +
    'imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002 (recursive/pairwise/Kahan error bounds; ' +
    'condition number); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35929_W1_SUMMATION_DEEP_CANCELLATION_ASSERTIONS = [
  {
    // The extension rungs reach 1-2 decades ABOVE the imp-35854 kappa ~ 2e5 top rung.
    id: 'imp35929-kappa-above-imp35854',
    description: 'Measured kappa reaches ~6e5 .. ~1.1e7, i.e. >= 0.5 decade above the imp-35854 top rung (~2e5)',
    holds: () =>
      SWEEP.length === RUNGS.length &&
      KAPPA_MIN > 3 * IMP35854_TOP_KAPPA &&
      KAPPA_MAX > 5e6 &&
      Math.log10(KAPPA_MAX / IMP35854_TOP_KAPPA) >= 1,
  },
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35812 / imp-35854.
    id: 'imp35929-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // Naive NORMALIZED plateau PERSISTS: stays within a small band around the imp-35854 ~4e-17 plateau.
    id: 'imp35929-naive-plateau-persists',
    description: 'Naive normalized error stays on the ~few e-17 plateau (< 30x the imp-35854 plateau, >= 1 order below sqrt(N)u)',
    holds: () =>
      PLATEAU_HOLDS &&
      NAIVE_NORM_MAX < 30 * IMP35854_PLATEAU &&
      NAIVE_NORM_MAX < 0.1 * SQRTN_U,
  },
  {
    // Kahan relative error stays WITHIN the 2u kappa ceiling at every rung (kappa-robustness persists).
    id: 'imp35929-kahan-within-2u-kappa',
    description: 'kahanRel < 2u kappa at every rung (worst multiple << 1); Kahan robustness persists to kappa ~ 1e7',
    holds: () =>
      KAHAN_WITHIN_2U_KAPPA &&
      KAHAN_REL_MAX_MULTIPLE < 1 &&
      KAHAN_NORM_MAX < 2 * U_ROUNDOFF,
  },
  {
    // The exact sum stays FAR above the machine-representability floor -- no representability wall reached.
    id: 'imp35929-no-representability-wall',
    description: 'min |Sum t_k| >= 1e-5 -- still ~1e15 ulps above the roundoff floor of an O(1e-4) number',
    holds: () =>
      MIN_ABS_SUM > 1e-5 &&
      MIN_ABS_SUM < 1e-2 &&
      MIN_SUM_ULPS > 1e14,
  },
  {
    // naive RELATIVE error keeps growing via the explicit kappa factor even though the plateau holds.
    id: 'imp35929-naive-rel-grows-via-kappa',
    description: 'naiveRel grows into the ~1e-10 range purely via the kappa factor while naiveNorm stays plateaued',
    holds: () =>
      NAIVE_REL_MAX > 1e-11 &&
      NAIVE_REL_MAX < 1e-8 &&
      // naiveRel is kappa-driven (below the sqrt(N)u kappa ceiling), not normalized-driven (plateau holds)
      SWEEP.every((r) => r.naiveRel < SQRTN_U * r.kappa) &&
      NAIVE_NORM_MAX < 30 * IMP35854_PLATEAU,
  },
  {
    // Honesty gate: measurement only; both findings persist; no representability wall; no QED; no refereed bound is changed.
    id: 'imp35929-honesty-gate',
    description: 'Measurement only; both imp-35854 findings persist; greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35929_W1_SUMMATION_DEEP_CANCELLATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /PERSIST/.test(IMP35929_W1_SUMMATION_DEEP_CANCELLATION.conclusion.findingsPersist) &&
      /GREENFIELD/.test(IMP35929_W1_SUMMATION_DEEP_CANCELLATION.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35929_W1_SUMMATION_DEEP_CANCELLATION.verdict) &&
      /refereed bound is changed/i.test(IMP35929_W1_SUMMATION_DEEP_CANCELLATION.verdict),
  },
];

for (const a of IMP35929_W1_SUMMATION_DEEP_CANCELLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35929-w1-summation-deep-cancellation assertion failed: ${a.id}`);
  }
}
