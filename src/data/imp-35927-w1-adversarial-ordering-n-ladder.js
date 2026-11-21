/**
 * @module imp-35927-w1-adversarial-ordering-n-ladder
 *
 * imp-35927 (numerical, S-frontier): MEASURE whether the imp-35852 clustered-sign-run
 * skeptical naive-summation amplification (~160x worst-of-four at the single length
 * N = floor(sqrt(T_PT / 4 pi)) ~ 488602) GROWS with N toward the coherent O(N u) ceiling
 * or SATURATES, by re-running the four hostile permutations up an N ladder.
 *
 * imp-35852 stressed the summation ORDERING at ONE length (N ~ 488602) and found the
 * clustered stable-sign-partition ordering pushes the naive normalized error up ~160x
 * (to ~4.86e-15), climbing from ~6.55 to ~4.35 orders below the coherent N eps ceiling
 * (~1.08e-10) yet still > 1e4x below it. Whether that ~4.35-order safety margin ERODES
 * as N grows was never measured: the coherence argument predicts the coherent ceiling
 * N eps grows LINEARLY while the achieved naive error may grow only SUB-linearly, so the
 * fractional gap to the ceiling -- and hence the safety margin -- could widen, hold, or
 * shrink. This module re-runs the SAME four hostile permutations (signedAsc, magAsc,
 * magDesc, clustered) plus the oscillatory baseline against the SAME exact BigInt dyadic
 * 2^{-96} reference on an N ladder (1e4, 1e5, 4.886e5, 1e6, 1e7) and measures how the
 * clustered-ordering naive error and its orders-below-ceiling margin SCALE with N.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity; C_mb
 * GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MACHINERY (identical to imp-35852; the exact reference is permutation-invariant)
 * -----------------------------------------------------------------------------
 *   term family : t_k = cos(alpha k + beta sqrt(k)) / sqrt(k), k = 1 .. N (imp-35812).
 *   reference   : each IEEE-754 double summed as a dyadic rational on a 2^{-96}
 *                 fixed-point grid in BigInt (error-free, computed once per N).
 *   normalized  : |schemeResult - trueSum| / Sum|t_k| (the Higham gamma scale).
 *   ceilings    : naive coherent = N eps (imp-35761); pairwise = log2(N) eps.
 *
 * BAKED GRID (measured offline by scripts/imp-35927-probe.mjs; the term family is
 * deterministic so recomputation reproduces these bit-for-bit -- the N = 1e7 rung takes
 * ~10 s, too heavy to recompute at import, so the grid is baked and a live N = 1e4
 * recompute below re-verifies the machinery reproduces the baked value). Normalized
 * errors; ob = orders below the coherent N eps ceiling = log10(N eps / naive):
 *   N          kappa     clustered naive   ob      signedAsc naive   worst ordering
 *   1e4        ~1.9e2    ~4.90e-16         3.656   ~2.42e-15         signedAsc
 *   1e5        ~6.3e2    ~8.54e-16         4.415   ~3.87e-15         signedAsc
 *   4.886e5    ~1.4e3    ~4.86e-15         4.349   ~9.18e-16         clustered  (imp-35852 anchor)
 *   1e6        ~2.0e3    ~1.50e-14         4.171   ~3.06e-14         signedAsc
 *   1e7        ~6.3e3    ~1.85e-14         5.079   ~1.93e-14         signedAsc
 *
 * READING (clustered amplification SATURATES; margin does NOT erode -- it WIDENS):
 *   1. The clustered naive normalized error grows FAR SUB-linearly in N: a least-squares
 *      fit of log10(naive) vs log10(N) over the ladder gives exponent ~0.60 (near the
 *      random-walk sqrt(N) rate 0.5, and WELL below the coherent-accumulation rate 1.0).
 *      From N = 1e4 to 1e7 (1000x) the clustered naive error grows only ~38x, and from
 *      1e6 to 1e7 (10x) it barely moves (~1.50e-14 -> ~1.85e-14): the amplification is
 *      SATURATING, not tracking the coherent ceiling.
 *   2. Because the coherent ceiling N eps grows linearly (exponent 1.0) while the
 *      clustered naive error grows ~0.60, the orders-below-ceiling margin INCREASES at
 *      ~+0.4 orders/decade: it rises from ~3.66 (N = 1e4) to ~5.08 (N = 1e7). The
 *      ~4.35-order safety margin imp-35852 measured at the anchor N does NOT erode with
 *      N; it is robust and slowly WIDENING. Every rung stays > 1e3x (> 3.6 orders) below
 *      the coherent O(N u) ceiling.
 *   3. SECONDARY FINDING (ordering identity is N-dependent): clustered is the worst of
 *      the four hostile orderings ONLY at the imp-35852 anchor N ~ 488602. At every other
 *      rung the signed-ascending ordering (most-negative-first, maximizing intermediate
 *      partial-sum magnitude) is the worst naive case. Both hostile orderings, however,
 *      share the same sub-linear N-scaling and the same widening margin.
 *   4. Pairwise and Kahan-Babuska stay ORDERING- and N-robust: their normalized errors do
 *      NOT grow with N (pairwise clustered ~6.5e-17 at N = 1e4 falls to ~1.3e-17 at
 *      N = 1e7; Kahan clustered ~3.5e-19 falls to ~2.5e-20), staying far below their
 *      log2(N) eps and 2u ceilings at every rung.
 * All schemes at all rungs and orderings remain ~10+ orders below the O(1) barrier margin
 * |A_t + B_t| - |C_t| (imp-35760). CONCLUSION: the clustered skeptical amplification
 * SATURATES sub-linearly and the safety margin below the coherent ceiling WIDENS with N,
 * so growing N does NOT erode the precision headroom -- precision stays NON-binding at
 * every length; the obstruction remains the ENGINEERING of the certified length-N interval
 * sum (MECHANICAL, imp-35725). The W1 A + B - C certificate at T_PT stays GREENFIELD
 * (imp-35681 Part A).
 *
 * @see imp-35852-w1-summation-adversarial-ordering (single-N ordering stress this scales up)
 * @see imp-35812-w1-summation-scheme-measured-cost (single-ordering baseline)
 * @see imp-35761-w1-certified-rounding-cost-scope (coherent linear ceiling N eps)
 * @see imp-35725-w1-effective-error-cap-budget (mechanical N-term certified cost)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (ordering / error growth)
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35852) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35852 anchor)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

const ALPHA = 0.6180339887498949; // golden-ratio fractional part (same as imp-35812/35852)
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes (identical to imp-35852) -----------------------------------------
function sumNaive(terms) {
  let s = 0;
  for (let i = 0; i < terms.length; i++) s += terms[i];
  return s;
}
function sumKahan(terms) {
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
const FRAC_BITS = 96n;
const _buf = new ArrayBuffer(8);
const _dv = new DataView(_buf);
function doubleToFixedBigInt(x) {
  if (x === 0) return 0n;
  _dv.setFloat64(0, x);
  const hi = _dv.getUint32(0);
  const lo = _dv.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  let exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  if (exp === 0) {
    exp = -1074;
  } else {
    mant |= 1n << 52n;
    exp = exp - 1075;
  }
  const shift = BigInt(exp) + FRAC_BITS;
  let num = sign * mant;
  num = shift >= 0n ? num << shift : num >> -shift;
  return num;
}
function normalizedError(schemeResult, trueNum, sumAbs) {
  const err = doubleToFixedBigInt(schemeResult) - trueNum;
  const absErr = err < 0n ? -err : err;
  const absErrDouble = Number(absErr << 80n) / 2 ** 80 / 2 ** 96;
  return absErrDouble / sumAbs;
}

// -- Live measurement of one N rung under all five orderings (used only at light N) -----
function measureRung(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);
  const trueAbs = trueNum < 0n ? -trueNum : trueNum;
  const trueSum = (Number(trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (trueNum < 0n ? -1 : 1);
  const kappa = sumAbs / Math.abs(trueSum);

  const builders = {
    original: () => Float64Array.from(base),
    signedAsc: () => Float64Array.from(base).sort((x, y) => x - y),
    magAsc: () => Float64Array.from(base).sort((x, y) => Math.abs(x) - Math.abs(y)),
    magDesc: () => Float64Array.from(base).sort((x, y) => Math.abs(y) - Math.abs(x)),
    clustered: () => {
      const neg = [];
      const pos = [];
      for (let i = 0; i < N; i++) {
        if (base[i] < 0) neg.push(base[i]);
        else pos.push(base[i]);
      }
      return Float64Array.from(neg.concat(pos));
    },
  };
  const ceilNaive = N * EPS_DOUBLE;
  const o = {};
  for (const [name, build] of Object.entries(builders)) {
    const a = build();
    const naive = normalizedError(sumNaive(a), trueNum, sumAbs);
    o[name] = {
      naive,
      pairwise: normalizedError(sumPairwise(a), trueNum, sumAbs),
      kahan: normalizedError(sumKahan(a), trueNum, sumAbs),
    };
  }
  return { N, kappa, sumAbs, ceilNaive, o };
}

// -- Baked ladder grid (measured offline by scripts/imp-35927-probe.mjs; deterministic) --
// naive / pairwise / kahan are normalized errors (divided by Sum|t_k|).
const LADDER = [
  { N: 10000, kappa: 194.4670652362559, sumAbs: 126.5312891388387,
    clustered: { naive: 4.901324488117225e-16, pairwise: 6.457907730345619e-17, kahan: 3.507154627535134e-19 },
    signedAsc: { naive: 2.4231099280544253e-15, pairwise: 4.773191558944709e-17, kahan: 3.507154627535134e-19 },
    magAsc: { naive: 8.423580857004555e-18 }, magDesc: { naive: 2.983004358680934e-18 },
    original: { naive: 1.7021878470293846e-17 } },
  { N: 100000, kappa: 632.5551797827795, sumAbs: 401.81831583126194,
    clustered: { naive: 8.539452308511136e-16, pairwise: 5.314686680602713e-17, kahan: 3.7361348512737615e-19 },
    signedAsc: { naive: 3.872714688314499e-15, pairwise: 8.831860806465702e-17, kahan: 9.731372952057119e-20 },
    magAsc: { naive: 3.2182833377610886e-18 }, magDesc: { naive: 3.494583093367894e-18 },
    original: { naive: 4.3234823601883084e-18 } },
  { N: 488602, kappa: 1391.0045053572817, sumAbs: 889.1781123229804,
    clustered: { naive: 4.860423268802226e-15, pairwise: 3.1483500457883534e-17, kahan: 2.308033859293433e-19 },
    signedAsc: { naive: 9.18485132373028e-16, pairwise: 3.1483500457883534e-17, kahan: 1.89155419746951e-20 },
    magAsc: { naive: 2.686344698787335e-19 }, magDesc: { naive: 3.044679366231799e-17 },
    original: { naive: 3.032193419836597e-17 } },
  { N: 1000000, kappa: 1994.3719174981852, sumAbs: 1272.4229319895092,
    clustered: { naive: 1.4965414108980636e-14, pairwise: 1.421210638868677e-17, kahan: 7.717330412977027e-20 },
    signedAsc: { naive: 3.0631718863704675e-14, pairwise: 1.421210638868677e-17, kahan: 7.717330412977027e-20 },
    magAsc: { naive: 1.8222267713590298e-18 }, magDesc: { naive: 2.8021649167985077e-18 },
    original: { naive: 2.0839847914434185e-18 } },
  { N: 10000000, kappa: 6292.575965080787, sumAbs: 4025.5208068450406,
    clustered: { naive: 1.8498172727033986e-14, pairwise: 1.2827380370262994e-17, kahan: 2.4718880983988212e-20 },
    signedAsc: { naive: 1.9300022370018438e-14, pairwise: 4.365566526611859e-17, kahan: 2.4718880983988212e-20 },
    magAsc: { naive: 1.901965537468249e-19 }, magDesc: { naive: 2.1901072760091872e-17 },
    original: { naive: 1.5888717316375473e-17 } },
];

// Derive per-rung ceilings + orders-below-ceiling + worst hostile ordering from the grid.
const NAMES = ['original', 'signedAsc', 'magAsc', 'magDesc', 'clustered'];
const RUNGS = LADDER.map((r) => {
  const ceilNaive = r.N * EPS_DOUBLE;
  const ceilPairwise = Math.log2(r.N) * EPS_DOUBLE;
  const clusteredOb = Math.log10(ceilNaive / r.clustered.naive);
  const worst = NAMES.filter((n) => n !== 'original').reduce((a, b) => (r[b].naive > r[a].naive ? b : a));
  return {
    N: r.N,
    kappa: r.kappa,
    sumAbs: r.sumAbs,
    ceilNaive,
    ceilPairwise,
    clusteredNaiveNormErr: r.clustered.naive,
    clusteredOrdersBelowCoherentCeiling: clusteredOb,
    clusteredFractionOfCoherentCeiling: r.clustered.naive / ceilNaive,
    clusteredPairwiseNormErr: r.clustered.pairwise,
    clusteredKahanNormErr: r.clustered.kahan,
    signedAscNaiveNormErr: r.signedAsc.naive,
    worstHostileOrdering: worst,
    worstHostileNaiveNormErr: r[worst].naive,
  };
});

// -- Log-log least-squares slope (scaling exponent) of a per-rung field vs N -------------
function loglogSlope(field) {
  const xs = RUNGS.map((r) => Math.log10(r.N));
  const ys = RUNGS.map((r) => Math.log10(field(r)));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  return sxy / sxx;
}

const CLUSTERED_NAIVE_EXPONENT = loglogSlope((r) => r.clusteredNaiveNormErr); // ~0.60 (sub-linear)
const COHERENT_CEILING_EXPONENT = loglogSlope((r) => r.ceilNaive); // exactly 1.0 (N eps grows linearly)
const CLUSTERED_OB_SLOPE = loglogSlope((r) => 10 ** r.clusteredOrdersBelowCoherentCeiling); // margin trend

const FIRST = RUNGS[0];
const LAST = RUNGS[RUNGS.length - 1];
const ANCHOR = RUNGS.find((r) => r.N === N_AT_TPT);
const CLUSTERED_GROWTH_OVER_LADDER = LAST.clusteredNaiveNormErr / FIRST.clusteredNaiveNormErr; // ~38x over 1000x N
const OB_MIN = Math.min(...RUNGS.map((r) => r.clusteredOrdersBelowCoherentCeiling));
const OB_CHANGE_OVER_LADDER = LAST.clusteredOrdersBelowCoherentCeiling - FIRST.clusteredOrdersBelowCoherentCeiling;
const PAIRWISE_MAX = Math.max(...RUNGS.map((r) => r.clusteredPairwiseNormErr));
const KAHAN_MAX = Math.max(...RUNGS.map((r) => r.clusteredKahanNormErr));

// -- Light machinery-integrity recompute: the smallest rung must reproduce its baked value.
const LIVE_N = 10000;
const LIVE = measureRung(LIVE_N);
const LIVE_CLUSTERED_NAIVE = LIVE.o.clustered.naive;
const BAKED_CLUSTERED_NAIVE_1E4 = LADDER[0].clustered.naive;
const LIVE_MATCH_REL =
  Math.abs(LIVE_CLUSTERED_NAIVE - BAKED_CLUSTERED_NAIVE_1E4) / BAKED_CLUSTERED_NAIVE_1E4;

export const IMP35927_W1_ADVERSARIAL_ORDERING_N_LADDER = {
  id: 'imp-35927',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35852 clustered-sign-run skeptical naive-summation amplification (~160x, worst of four ' +
    'orderings at N ~ 488602) GROW with N toward the coherent O(N u) ceiling or SATURATE, and does the ' +
    '~4.35-order orders-below-ceiling safety margin erode as N grows? Measurement only; certifies no W1 ' +
    'bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha k + beta sqrt(k)) / sqrt(k), k = 1 .. N (same family as imp-35812 / imp-35852)',
    alpha: ALPHA,
    beta: BETA,
    anchorN: N_AT_TPT,
    note: 'the exact sum is permutation-invariant; one exact BigInt reference per N serves all orderings',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    offlineProbe: 'scripts/imp-35927-probe.mjs (deterministic; the N = 1e7 rung is too heavy for import)',
    liveIntegrityCheck: {
      N: LIVE_N,
      recomputedClusteredNaive: LIVE_CLUSTERED_NAIVE,
      bakedClusteredNaive: BAKED_CLUSTERED_NAIVE_1E4,
      relativeMatch: LIVE_MATCH_REL,
      note: 'the smallest rung is recomputed live at import and must reproduce its baked value',
    },
  },
  ladder: RUNGS,
  scaling: {
    clusteredNaiveExponent: CLUSTERED_NAIVE_EXPONENT,
    coherentCeilingExponent: COHERENT_CEILING_EXPONENT,
    clusteredGrowthOverLadder: CLUSTERED_GROWTH_OVER_LADDER,
    ordersBelowCeilingChangeOverLadder: OB_CHANGE_OVER_LADDER,
    ordersBelowCeilingMin: OB_MIN,
    note:
      'clustered naive normalized error grows ~N^0.6 (near the sqrt(N) random-walk rate 0.5, well below the ' +
      'coherent rate 1.0); the coherent ceiling N eps grows exactly linearly, so orders-below-ceiling INCREASES',
  },
  reading: {
    clusteredSaturatesSublinear:
      'the clustered naive normalized error grows FAR sub-linearly (~N^0.6); over the 1000x ladder N = 1e4..1e7 ' +
      'it grows only ~38x and barely moves across the top decade (~1.50e-14 -> ~1.85e-14) -- the amplification ' +
      'SATURATES, it does not track the coherent O(N u) ceiling',
    marginWidensNotErodes:
      'because the coherent ceiling grows linearly while the clustered error grows ~N^0.6, the orders-below- ' +
      'ceiling margin INCREASES with N (from ~3.66 at N = 1e4 to ~5.08 at N = 1e7, ~+0.4 orders/decade); the ' +
      '~4.35-order safety margin imp-35852 measured at the anchor does NOT erode -- it slowly WIDENS',
    stillFarBelowCeiling:
      'every rung stays > 1e3x (> 3.6 orders) below the coherent O(N u) ceiling; full sign-coherence of the N ' +
      'rounding errors is not realizable at any measured length',
    worstOrderingIsNdependent:
      'clustered is the worst of the four hostile orderings ONLY at the imp-35852 anchor N ~ 488602; at every ' +
      'other rung signed-ascending (most-negative-first) is the worst naive case, though both share the same ' +
      'sub-linear N-scaling and widening margin',
    compensatedSchemesNrobust:
      'pairwise and Kahan-Babuska normalized errors do NOT grow with N (pairwise ~6.5e-17 -> ~1.3e-17, Kahan ' +
      '~3.5e-19 -> ~2.5e-20 across the ladder) and stay far below their log2(N) eps and 2u ceilings at every rung',
    allUnderMargin:
      'all schemes at all rungs and orderings remain ~10+ orders below the O(1) barrier margin ' +
      '|A_t + B_t| - |C_t| (imp-35760 allocation)',
  },
  conclusion: {
    amplificationSaturates:
      'the clustered skeptical amplification SATURATES sub-linearly with N; it does not grow toward the ' +
      'coherent O(N u) ceiling',
    marginRobust:
      'the orders-below-ceiling safety margin does NOT erode with N -- it WIDENS at ~+0.4 orders/decade because ' +
      'the coherent ceiling grows linearly while the achieved error grows only ~N^0.6',
    precisionNotBinding:
      'achievable double precision leaves growing strict headroom under worst-case ordering as N increases; ' +
      'precision is NOT the binding constraint at any measured length',
    staysGreenfield:
      'this module measures scheme errors under worst-case orderings across N only; it evaluates no sum of H_t ' +
      'and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) ' +
      'and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-running the imp-35852 four hostile ' +
    'orderings (signedAsc, magAsc, magDesc, clustered) plus the oscillatory baseline against the SAME exact ' +
    'BigInt 2^{-96} reference on an N ladder (1e4, 1e5, 4.886e5, 1e6, 1e7), the clustered naive normalized ' +
    'error grows FAR sub-linearly (~N^0.6, log-log LSQ) -- only ~38x over the 1000x ladder and nearly flat ' +
    'across the top decade -- so the skeptical amplification SATURATES rather than tracking the coherent ' +
    'O(N u) ceiling. Because the ceiling N eps grows exactly linearly, the orders-below-ceiling safety margin ' +
    'does NOT erode: it INCREASES from ~3.66 (N = 1e4) to ~5.08 (N = 1e7), ~+0.4 orders/decade, and every rung ' +
    'stays > 1e3x below the coherent ceiling. Clustered is the worst hostile ordering ONLY at the anchor ' +
    'N ~ 488602; signed-ascending dominates at the other rungs (same sub-linear scaling). Pairwise and ' +
    'Kahan-Babuska stay N- and ordering-robust, not growing with N and far below their log2(N) eps / 2u ' +
    'ceilings. All schemes at all rungs remain ~10+ orders below the O(1) barrier margin |A_t + B_t| - |C_t|. ' +
    'Precision is NOT the binding constraint at any length; the obstruction stays the ENGINEERING of the ' +
    'certified length-N interval sum (MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; ' +
    'instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the W1 ' +
    'A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35852 (single-N ordering stress this scales up); imp-35812 (single-ordering baseline); imp-35761 ' +
    '(coherent linear ceiling N eps); imp-35725 (mechanical N-term certified cost); imp-35760 (barrier-margin ' +
    'allocation); imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002 (ordering / summation error ' +
    'growth); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35927_W1_ADVERSARIAL_ORDERING_N_LADDER_ASSERTIONS = [
  {
    // Ladder spans 3 decades and includes the imp-35852 anchor N = floor(sqrt(T_PT/4 pi)).
    id: 'imp35927-n-ladder-anchor',
    description: 'N ladder has 5 rungs spanning 1e4..1e7 and includes the imp-35852 anchor N ~ 488602',
    holds: () =>
      RUNGS.length === 5 &&
      FIRST.N === 10000 &&
      LAST.N === 10000000 &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      ANCHOR !== undefined &&
      Math.abs(ANCHOR.clusteredNaiveNormErr - 4.860423268802226e-15) < 1e-25,
  },
  {
    // Clustered naive grows SUB-linearly: log-log exponent well below the coherent rate 1.0.
    id: 'imp35927-clustered-sublinear-saturates',
    description: 'Clustered naive normalized error grows sub-linearly (log-log exponent in (0.3, 0.85), << 1.0 coherent)',
    holds: () =>
      CLUSTERED_NAIVE_EXPONENT > 0.3 &&
      CLUSTERED_NAIVE_EXPONENT < 0.85 &&
      Math.abs(COHERENT_CEILING_EXPONENT - 1.0) < 1e-9 &&
      CLUSTERED_GROWTH_OVER_LADDER < 100, // ~38x over the 1000x N ladder (linear would be ~1000x)
  },
  {
    // Orders-below-ceiling margin does NOT erode: it stays > 3.5 and net-INCREASES over the ladder.
    id: 'imp35927-margin-does-not-erode',
    description: 'Orders-below-ceiling margin stays > 3.5 at every rung and net-increases from N=1e4 to N=1e7 (widens)',
    holds: () =>
      OB_MIN > 3.5 &&
      OB_CHANGE_OVER_LADDER > 0.5 &&
      CLUSTERED_OB_SLOPE > 0 &&
      RUNGS.every((r) => r.clusteredOrdersBelowCoherentCeiling > 3.5),
  },
  {
    // Every rung stays >1e3x below the coherent O(N u) ceiling (never approaches it).
    id: 'imp35927-far-below-coherent-ceiling',
    description: 'Clustered naive stays >1e3x below the coherent N eps ceiling at every rung',
    holds: () =>
      RUNGS.every((r) => r.ceilNaive / r.clusteredNaiveNormErr > 1e3) &&
      RUNGS.every((r) => r.clusteredFractionOfCoherentCeiling < 1e-3),
  },
  {
    // Worst hostile ordering is N-dependent: clustered at the anchor, signedAsc off-anchor.
    id: 'imp35927-worst-ordering-n-dependent',
    description: 'Clustered is worst only at the anchor N; signed-ascending is worst at the off-anchor rungs',
    holds: () =>
      ANCHOR.worstHostileOrdering === 'clustered' &&
      RUNGS.filter((r) => r.N !== N_AT_TPT).every((r) => r.worstHostileOrdering === 'signedAsc'),
  },
  {
    // Pairwise / Kahan stay N-robust: do NOT grow with N and stay far below their ceilings.
    id: 'imp35927-compensated-n-robust',
    description: 'Pairwise/Kahan clustered errors do not grow with N (top rung <= bottom rung) and stay below ceilings',
    holds: () =>
      LAST.clusteredPairwiseNormErr <= FIRST.clusteredPairwiseNormErr &&
      LAST.clusteredKahanNormErr <= FIRST.clusteredKahanNormErr &&
      RUNGS.every((r) => r.clusteredPairwiseNormErr < r.ceilPairwise) &&
      PAIRWISE_MAX < 1e-14 &&
      KAHAN_MAX < 2 * U_ROUNDOFF,
  },
  {
    // Machinery integrity: the live-recomputed smallest rung reproduces its baked value.
    id: 'imp35927-live-machinery-integrity',
    description: 'Live N=1e4 recompute reproduces the baked clustered naive value within 1e-6 relative',
    holds: () => LIVE_MATCH_REL < 1e-6 && LIVE.o.clustered.naive > 0,
  },
  {
    // Honesty gate: measurement only; amplification saturates + margin widens; no QED; no refereed bound is changed.
    id: 'imp35927-honesty-gate',
    description: 'Measurement only; amplification saturates, margin widens; obstruction mechanical/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35927_W1_ADVERSARIAL_ORDERING_N_LADDER.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /SATURATES sub-linearly/.test(IMP35927_W1_ADVERSARIAL_ORDERING_N_LADDER.conclusion.amplificationSaturates) &&
      /does NOT erode/.test(IMP35927_W1_ADVERSARIAL_ORDERING_N_LADDER.conclusion.marginRobust) &&
      /GREENFIELD/.test(IMP35927_W1_ADVERSARIAL_ORDERING_N_LADDER.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35927_W1_ADVERSARIAL_ORDERING_N_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP35927_W1_ADVERSARIAL_ORDERING_N_LADDER.verdict),
  },
];

for (const a of IMP35927_W1_ADVERSARIAL_ORDERING_N_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35927-w1-adversarial-ordering-n-ladder assertion failed: ${a.id}`);
  }
}
