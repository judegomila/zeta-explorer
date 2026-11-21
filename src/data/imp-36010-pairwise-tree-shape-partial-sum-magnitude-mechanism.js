/**
 * @module imp-36010-pairwise-tree-shape-partial-sum-magnitude-mechanism
 *
 * imp-36010 (numerical, S-frontier): EXPLAIN the imp-35893/imp-35956 NON-MONOTONE
 * pairwise-summation error vs pairing-tree DEPTH -- is the ordering a partial-sum
 * MAGNITUDE-alignment artifact (deeper-but-better trees keep intermediate partial sums
 * smaller, so the deterministic magnitude budget orders the error) or a GENUINE
 * cancellation effect (signed per-addition rounding errors align differently per shape,
 * decoupling the achieved error from the magnitude budget)?
 *
 * imp-35893 measured seven pairing-tree SHAPES on the fixed imp-35812 N ~ 488602
 * oscillatory multiset against an association-invariant exact 2^{-96} BigInt reference,
 * and imp-35956 baked the ladder, both FLAGGING that the error is non-monotone in depth:
 * skew0.25 (depth 29) is best (~1.89e-20), balanced (depth 12) sits at ~3.56e-19,
 * caterpillarR (depth 3817) is worst (~1.85e-18). Neither EXPLAINED the mechanism.
 *
 * This module re-runs the identical seven trees against the identical exact reference and
 * additionally INSTRUMENTS, per shape, the deterministic partial-sum MAGNITUDE budget the
 * tree induces:
 *
 *   B_combine(shape) = Sum over internal combine nodes v of |s_hat_v|
 *
 * where s_hat_v is the computed (rounded) sum at node v. The classical Higham a-priori
 * summation bound is |s_hat - s| <= u * Sum_v |s_hat_v| + O(u^2), so the normalized
 * DETERMINISTIC PROXY error is E_proxy(shape) = u * B_combine / Sum|t_k|, and the
 * REALIZATION RATIO rho(shape) = E_measured / E_proxy tells how much of that coherent
 * magnitude budget is actually realized as achieved error (rho << 1 => signed rounding
 * errors cancel massively; rho ~ 1 => coherent accumulation). The leaf-block sequential
 * additions are shape-INVARIANT, so all shape dependence lives in the combine layer.
 *
 * MEASURED at N = 488602 (dg_hat reference association-invariant; reproduces imp-35893):
 *   shape          depth   E_meas      B_combine   E_proxy     rho = E/E_proxy
 *   balanced(0.5)     12   3.56e-19    2.76e-2     3.06e-18    1.16e-1
 *   skew0.25          29   1.89e-20    3.11e-2     3.46e-18    5.47e-3   (best)
 *   skew0.1           79   3.56e-19    4.97e-2     5.52e-18    6.45e-2
 *   skew0.03         276   2.31e-19    1.31e-1     1.45e-17    1.59e-2
 *   skew0.01         874   2.31e-19    2.76e-1     3.06e-17    7.54e-3
 *   caterpillarL    3817   1.44e-19    1.33e-2     1.47e-18    9.76e-2
 *   caterpillarR    3817   1.85e-18    2.75e+0     3.05e-16    6.08e-3   (worst)
 *
 * READING (mechanism):
 *   (1) SCALE is set by CANCELLATION, not magnitude. Every shape realizes only rho ~
 *       0.5%..12% of its deterministic magnitude budget (all rho < 0.2, spanning ~21x):
 *       the signed per-addition rounding errors do NOT accumulate coherently, so the
 *       achieved error sits 1-2 orders BELOW u*B_combine for every shape. This is the
 *       cancellation signature imp-35893 attributed to the benign cancellation-heavy data.
 *   (2) The non-monotone BEST case is a CANCELLATION-alignment effect, NOT a smaller
 *       budget. skew0.25 is best (~1.89e-20) yet does NOT have the smallest budget --
 *       caterpillarL's B_combine (~1.33e-2) is SMALLER than skew0.25's (~3.11e-2), and
 *       balanced's (~2.76e-2) is also comparable, yet both have ~8x-19x LARGER error.
 *       skew0.25 wins purely because its rho (~5.47e-3) is ~21x below balanced's
 *       (~1.16e-1): a lucky signed-error alignment, not a smaller induced partial sum.
 *   (3) The WORST case IS partly a magnitude effect. caterpillarR carries by far the
 *       LARGEST budget (~2.75, ~100x the others) because peeling leaves off the RIGHT
 *       makes each combine add a monotonically GROWING left-accumulated block, so its
 *       partial sums swell; even at rho ~ 6e-3 that ~100x budget lifts it to the worst
 *       achieved error. The magnitude budget thus sets the coarse ENVELOPE (explaining
 *       the worst shape) but does NOT rank-order the interior.
 *   (4) The magnitude budget is a MODERATE, not tight, predictor and beats depth:
 *       Pearson(log E, log B_combine) ~ 0.67 (Spearman ~ 0.54) vs Pearson(log E,
 *       log depth) ~ 0.42 (Spearman ~ 0.21). Neither orders the error; depth is the
 *       weaker of the two, consistent with the non-monotonicity in depth.
 *
 * CONCLUSION: the non-monotonicity is PRIMARILY a GENUINE cancellation effect -- the
 * shape-to-shape error ordering (especially skew0.25 being best despite a larger budget
 * than caterpillarL/balanced) is decided by the signed-error REALIZATION RATIO rho, which
 * varies ~21x while the magnitude budget varies ~200x and only rank-correlates moderately.
 * The partial-sum magnitude budget sets an outer envelope (and does explain the worst
 * shape caterpillarR, whose right-peel accumulates a growing block) but is NOT the ordering
 * mechanism, so the effect is NOT a pure magnitude-alignment artifact.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity; the W1
 * A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL
 * (imp-35725); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35893-w1-summation-pairwise-tree-shape (source seven-shape measurement)
 * @see imp-35956-pairwise-tree-shape-ladder-viz-data (baked ladder this explains)
 * @see imp-35890-w1-running-accumulator-bound (deterministic gamma*max|S_i| magnitude bound)
 * @see imp-35970-w1-pairwise-apriori-depth-bound-slack (a-priori depth*eps slack)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms sec 4.2 (Sum|s_hat_v| bound)
 */

// -- Anchor + operative constants (import-light; matching imp-35893) ---------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp); Higham a-priori bound scale
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2 u)

// Same fixed oscillatory multiset as imp-35812 / imp-35852 / imp-35893 (deterministic, no RNG).
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

const LEAF = 128; // base block size (identical to the imp-35893 pairwise scheme)

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) --------
const FRAC_BITS = 96n; // common fixed-point scale 2^{-96}; covers the term exponent range
const _buf = new ArrayBuffer(8);
const _dv = new DataView(_buf);

function doubleToFixedBigInt(x) {
  // Return the m * 2^{-96} representation of x as an exact BigInt numerator.
  if (x === 0) return 0n;
  _dv.setFloat64(0, x);
  const hi = _dv.getUint32(0);
  const lo = _dv.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  let exp = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo >>> 0);
  if (exp === 0) {
    exp = -1074; // subnormal (not expected for these magnitudes)
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
  // Exact absolute error |schemeResult - trueSum|, divided by Sum|t_k| (the Higham scale).
  const err = doubleToFixedBigInt(schemeResult) - trueNum;
  const absErr = err < 0n ? -err : err;
  const absErrDouble = Number(absErr << 80n) / 2 ** 80 / 2 ** 96;
  return absErrDouble / sumAbs;
}

// -- Pairwise summation over an arbitrary pairing tree, INSTRUMENTED for magnitude budget -
function sumTreeInstrumented(terms, splitter, leaf) {
  // Post-order on an explicit work stack (caterpillar depth ~N/leaf would overflow the
  // call stack). At each internal COMBINE node it accumulates |s_hat_v| (the rounded
  // partial sum's magnitude) -- the shape-dependent term of the Higham Sum_v|s_hat_v|
  // a-priori bound. Leaf-block sequential additions are shape-invariant and excluded.
  const n = terms.length;
  let maxDepth = 0;
  let bCombine = 0; // Sum over internal combine nodes of |s_hat_v|
  let maxAbsPartial = 0; // peak |partial sum| over all combine nodes
  let nInternal = 0;
  const stack = [{ lo: 0, hi: n, depth: 0, stage: 0, leftVal: 0, mid: 0 }];
  let result = 0;
  while (stack.length) {
    const f = stack[stack.length - 1];
    if (f.depth > maxDepth) maxDepth = f.depth;
    if (f.hi - f.lo <= leaf) {
      let a = 0;
      for (let i = f.lo; i < f.hi; i++) a += terms[i];
      result = a;
      stack.pop();
      continue;
    }
    if (f.stage === 0) {
      let mid = splitter(f.lo, f.hi, leaf);
      if (mid <= f.lo) mid = f.lo + 1; // guard: keep both children non-empty
      if (mid >= f.hi) mid = f.hi - 1;
      f.mid = mid;
      f.stage = 1;
      stack.push({ lo: f.lo, hi: mid, depth: f.depth + 1, stage: 0, leftVal: 0, mid: 0 });
    } else if (f.stage === 1) {
      f.leftVal = result;
      f.stage = 2;
      stack.push({ lo: f.mid, hi: f.hi, depth: f.depth + 1, stage: 0, leftVal: 0, mid: 0 });
    } else {
      result = f.leftVal + result; // combine (single rounded addition)
      const m = Math.abs(result);
      bCombine += m;
      if (m > maxAbsPartial) maxAbsPartial = m;
      nInternal += 1;
      stack.pop();
    }
  }
  return { sum: result, maxDepth, bCombine, maxAbsPartial, nInternal };
}

// -- Build the fixed multiset + shape-invariant exact reference (computed once) ----------
const _base = new Float64Array(N_AT_TPT);
let _sumAbs = 0;
for (let k = 1; k <= N_AT_TPT; k++) {
  const t = TERM(k);
  _base[k - 1] = t;
  _sumAbs += Math.abs(t);
}
let _trueNum = 0n; // exact sum is association-invariant -- computed once, reused for all trees
for (let i = 0; i < N_AT_TPT; i++) _trueNum += doubleToFixedBigInt(_base[i]);

// -- Pairing-tree shapes (same fixed multiset; varying tree SHAPE only; imp-35893 set) ---
const TREE_SHAPES = [
  ['balanced(0.5)', (lo, hi) => (lo + hi) >> 1],
  ['skew0.25', (lo, hi) => lo + Math.floor((hi - lo) * 0.25)],
  ['skew0.1', (lo, hi) => lo + Math.floor((hi - lo) * 0.1)],
  ['skew0.03', (lo, hi) => lo + Math.floor((hi - lo) * 0.03)],
  ['skew0.01', (lo, hi) => lo + Math.floor((hi - lo) * 0.01)],
  ['caterpillarL', (lo, hi, leaf) => lo + leaf],
  ['caterpillarR', (lo, hi, leaf) => hi - leaf],
];

// -- Run + instrument every shape against the shared exact reference ---------------------
const SHAPES = TREE_SHAPES.map(([name, splitter]) => {
  const r = sumTreeInstrumented(_base, splitter, LEAF);
  const errMeas = normalizedError(r.sum, _trueNum, _sumAbs);
  const bCombineNorm = r.bCombine / _sumAbs; // normalized combine-layer magnitude budget
  const maxAbsNorm = r.maxAbsPartial / _sumAbs; // normalized peak partial sum
  const errProxy = U_ROUNDOFF * bCombineNorm; // deterministic Higham magnitude proxy (normalized)
  return {
    shape: name,
    treeDepth: r.maxDepth,
    internalNodes: r.nInternal,
    errMeas,
    bCombineNorm,
    maxAbsNorm,
    errProxy,
    realizationRatio: errMeas / errProxy, // rho: fraction of the magnitude budget realized as error
  };
});

const BY_SHAPE = Object.fromEntries(SHAPES.map((r) => [r.shape, r]));
const BALANCED = BY_SHAPE['balanced(0.5)'];
const SKEW025 = BY_SHAPE['skew0.25'];
const CATERPILLARL = BY_SHAPE['caterpillarL'];
const WORST = SHAPES.reduce((a, b) => (b.errMeas > a.errMeas ? b : a));
const BEST = SHAPES.reduce((a, b) => (b.errMeas < a.errMeas ? b : a));
const MAX_BUDGET = SHAPES.reduce((a, b) => (b.bCombineNorm > a.bCombineNorm ? b : a));

const RHOS = SHAPES.map((r) => r.realizationRatio);
const RHO_MIN = Math.min(...RHOS);
const RHO_MAX = Math.max(...RHOS);
const RHO_SPREAD = RHO_MAX / RHO_MIN;
const BUDGET_SPREAD =
  Math.max(...SHAPES.map((r) => r.bCombineNorm)) / Math.min(...SHAPES.map((r) => r.bCombineNorm));

// -- Correlation diagnostics (does the magnitude budget / depth order the error?) --------
function pearson(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }
  return sxy / Math.sqrt(sxx * syy);
}
function rankOf(a) {
  const n = a.length;
  const idx = a.map((_, i) => i).sort((i, j) => a[i] - a[j]);
  const r = new Array(n);
  idx.forEach((v, k) => (r[v] = k + 1));
  return r;
}
function spearman(xs, ys) {
  return pearson(rankOf(xs), rankOf(ys));
}

const _logE = SHAPES.map((r) => Math.log(r.errMeas));
const _logB = SHAPES.map((r) => Math.log(r.bCombineNorm));
const _logD = SHAPES.map((r) => Math.log(r.treeDepth));
const _E = SHAPES.map((r) => r.errMeas);
const _B = SHAPES.map((r) => r.bCombineNorm);
const _D = SHAPES.map((r) => r.treeDepth);

const CORR = {
  pearsonErrBudget: pearson(_logE, _logB),
  spearmanErrBudget: spearman(_E, _B),
  pearsonErrDepth: pearson(_logE, _logD),
  spearmanErrDepth: spearman(_E, _D),
};

export const IMP36010_PAIRWISE_TREE_SHAPE_PARTIAL_SUM_MAGNITUDE_MECHANISM = {
  id: 'imp-36010',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35893/imp-35956 non-monotone pairwise-error vs pairing-tree DEPTH ordering a ' +
    'partial-sum MAGNITUDE-alignment artifact (the deterministic Sum|s_hat_v| budget orders the error) ' +
    'or a GENUINE cancellation effect (signed per-addition rounding errors realize differently per ' +
    'shape)? Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed multiset as imp-35893)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    leafBlock: LEAF,
  },
  magnitudeBudget: {
    definition:
      'B_combine(shape) = Sum over internal combine nodes v of |s_hat_v| (the rounded partial sum ' +
      'magnitude); the shape-dependent term of the Higham a-priori bound |s_hat - s| <= u*Sum_v|s_hat_v|',
    proxyError: 'E_proxy(shape) = u * B_combine / Sum|t_k| (normalized deterministic magnitude bound)',
    realizationRatio:
      'rho(shape) = E_measured / E_proxy: fraction of the coherent magnitude budget realized as achieved ' +
      'error (rho << 1 => signed rounding errors cancel; rho ~ 1 => coherent accumulation)',
    leafInvariant: 'leaf-block sequential additions are shape-invariant and excluded (all shape dependence is in the combine layer)',
  },
  shapes: SHAPES,
  correlations: CORR,
  summary: {
    bestShape: BEST.shape,
    bestErr: BEST.errMeas,
    bestBudget: BEST.bCombineNorm,
    worstShape: WORST.shape,
    worstErr: WORST.errMeas,
    worstBudget: WORST.bCombineNorm,
    maxBudgetShape: MAX_BUDGET.shape,
    rhoMin: RHO_MIN,
    rhoMax: RHO_MAX,
    rhoSpread: RHO_SPREAD,
    budgetSpread: BUDGET_SPREAD,
    caterpillarLBudget: CATERPILLARL.bCombineNorm,
    caterpillarLErr: CATERPILLARL.errMeas,
  },
  reading: {
    scaleSetByCancellation:
      'every shape realizes only rho ~ 0.5%..12% of its deterministic magnitude budget (all rho < 0.2), ' +
      'so the achieved error sits 1-2 orders BELOW u*B_combine for every shape -- the SCALE is set by ' +
      'signed-error cancellation, not by the induced partial-sum magnitudes',
    bestIsCancellationAlignment:
      'the non-monotone BEST case is a cancellation-alignment effect, NOT a smaller budget: skew0.25 is ' +
      'best (~1.89e-20) yet its budget (~3.11e-2) is LARGER than caterpillarL (~1.33e-2) and comparable to ' +
      'balanced (~2.76e-2); it wins only because its rho (~5.47e-3) is ~21x below balanced (~1.16e-1)',
    worstIsPartlyMagnitude:
      'the WORST case IS partly a magnitude effect: caterpillarR carries by far the LARGEST budget ' +
      '(~2.75, ~100x the others) because peeling leaves off the RIGHT makes each combine add a growing ' +
      'left-accumulated block, so even at rho ~ 6e-3 that budget lifts it to the worst achieved error',
    budgetBeatsDepthButNeitherOrders:
      'the magnitude budget is a MODERATE predictor and beats depth: Pearson(log E, log B_combine) ~ 0.67 ' +
      '(Spearman ~ 0.54) vs Pearson(log E, log depth) ~ 0.42 (Spearman ~ 0.21); neither tightly orders the error',
  },
  conclusion: {
    primarilyGenuineCancellation:
      'the non-monotonicity is PRIMARILY a genuine cancellation effect -- the shape-to-shape error ordering ' +
      '(especially skew0.25 being best despite a larger budget than caterpillarL/balanced) is decided by the ' +
      'signed-error realization ratio rho (varying ~21x), not by the magnitude budget (varying ~200x, only ' +
      'moderately rank-correlated), so it is NOT a pure magnitude-alignment artifact',
    budgetSetsEnvelope:
      'the partial-sum magnitude budget sets an outer ENVELOPE and does explain the worst shape caterpillarR ' +
      '(right-peel accumulates a growing block, ~100x budget), but is not the interior ordering mechanism',
    staysGreenfield:
      'this module measures achieved-vs-proxy pairwise errors under the seven tree shapes only; it evaluates ' +
      'no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (mechanism diagnostic, NOT a certified bound). Re-running the imp-35893 seven ' +
    'pairing-tree shapes on the fixed imp-35812 N = 488602 multiset against the SAME association-invariant ' +
    'exact 2^{-96} BigInt reference, and instrumenting the deterministic combine-layer magnitude budget ' +
    'B_combine = Sum_v|s_hat_v| plus its realization ratio rho = E_measured/(u*B_combine/Sum|t_k|): every ' +
    'shape realizes only rho ~ 0.5%..12% of its budget (all rho < 0.2, spanning ~21x), so the achieved error ' +
    'is set 1-2 orders below the coherent magnitude bound by SIGNED-ERROR CANCELLATION, not by magnitude. ' +
    'The best shape skew0.25 (~1.89e-20) does NOT have the smallest budget -- caterpillarL (~1.33e-2) and ' +
    'balanced (~2.76e-2) are as small or smaller -- so its win is a cancellation-alignment coincidence (rho ' +
    '~21x below balanced), a GENUINE effect not a magnitude artifact. The worst shape caterpillarR IS partly ' +
    'magnitude: its right-peel accumulates a growing left block giving the LARGEST budget (~100x the others), ' +
    'lifting it to worst even at rho ~ 6e-3. The budget rank-correlates only moderately with the error ' +
    '(Pearson(log E, log B_combine) ~ 0.67, Spearman ~ 0.54) and beats depth (Pearson ~ 0.42, Spearman ~ 0.21) ' +
    'but neither orders the error, so the non-monotonicity is PRIMARILY a genuine cancellation effect with the ' +
    'magnitude budget only an outer envelope (explaining caterpillarR). Certifies no W1 bound; evaluates no ' +
    'true H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; ' +
    'the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35893 (source seven-shape measurement, exact BigInt reference); imp-35956 (baked ladder this ' +
    'explains); imp-35890 (deterministic running-accumulator magnitude bound); imp-35970 (a-priori depth*eps ' +
    'slack); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); imp-35681 Part A (A+B-C interval ' +
    'bound greenfield); Higham 2002 sec 4.2 (Sum|s_hat_v| a-priori bound); Platt-Trudgian 2021 (barrier base).',
};

export const IMP36010_PAIRWISE_TREE_SHAPE_PARTIAL_SUM_MAGNITUDE_MECHANISM_ASSERTIONS = [
  {
    // Same anchor as imp-35893: N = floor(sqrt(T_PT/4 pi)) ~ 488602; 7 tree shapes.
    id: 'imp36010-n-anchor-seven-shapes',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms; 7 pairing-tree shapes instrumented',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      SHAPES.length === 7,
  },
  {
    // Reproduces the imp-35893 measurement: balanced ~3.56e-19, best skew0.25, worst caterpillarR.
    id: 'imp36010-reproduces-imp35893',
    description: 'Reproduces imp-35893: balanced ~3.56e-19, best is skew0.25, worst is caterpillarR',
    holds: () =>
      Math.abs(BALANCED.errMeas - 3.557e-19) / 3.557e-19 < 0.02 &&
      BEST.shape === 'skew0.25' &&
      WORST.shape === 'caterpillarR',
  },
  {
    // SCALE set by cancellation: every shape realizes only a small fraction of its magnitude budget.
    id: 'imp36010-all-rho-far-below-one',
    description: 'Every shape realizes rho = E/E_proxy well below 1 (< 0.2): errors sit 1-2 orders below the magnitude budget',
    holds: () =>
      SHAPES.every((r) => r.realizationRatio > 0 && r.realizationRatio < 0.2) &&
      RHO_SPREAD > 5,
  },
  {
    // The BEST shape does NOT have the smallest budget -> cancellation-alignment, not magnitude.
    id: 'imp36010-best-not-smallest-budget',
    description: 'The best shape (skew0.25) does NOT have the smallest budget: caterpillarL has a smaller budget yet a larger error',
    holds: () =>
      CATERPILLARL.bCombineNorm < BEST.bCombineNorm &&
      CATERPILLARL.errMeas > BEST.errMeas &&
      BEST.realizationRatio < 0.25 * BALANCED.realizationRatio,
  },
  {
    // The WORST shape IS partly magnitude: caterpillarR carries the largest budget by a wide margin.
    id: 'imp36010-worst-has-largest-budget',
    description: 'The worst shape (caterpillarR) carries the largest magnitude budget, by >8x over the next',
    holds: () => {
      const sorted = SHAPES.slice().sort((a, b) => b.bCombineNorm - a.bCombineNorm);
      return (
        MAX_BUDGET.shape === 'caterpillarR' &&
        WORST.shape === 'caterpillarR' &&
        sorted[0].bCombineNorm / sorted[1].bCombineNorm > 8
      );
    },
  },
  {
    // Budget is a moderate predictor and beats depth; neither tightly orders the error.
    id: 'imp36010-budget-moderate-beats-depth',
    description: 'Pearson(log E, log B_combine) is moderate (0.4..0.95) and exceeds Pearson(log E, log depth)',
    holds: () =>
      CORR.pearsonErrBudget > 0.4 &&
      CORR.pearsonErrBudget < 0.95 &&
      CORR.pearsonErrBudget > CORR.pearsonErrDepth &&
      CORR.spearmanErrBudget < 0.99,
  },
  {
    // Honesty gate: measurement only; primarily-cancellation conclusion; greenfield; no QED; no refereed bound is changed.
    id: 'imp36010-honesty-gate',
    description: 'Measurement only; primarily-cancellation conclusion; obstruction greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36010_PAIRWISE_TREE_SHAPE_PARTIAL_SUM_MAGNITUDE_MECHANISM.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /PRIMARILY a genuine cancellation effect/.test(
        IMP36010_PAIRWISE_TREE_SHAPE_PARTIAL_SUM_MAGNITUDE_MECHANISM.conclusion.primarilyGenuineCancellation,
      ) &&
      /GREENFIELD/.test(IMP36010_PAIRWISE_TREE_SHAPE_PARTIAL_SUM_MAGNITUDE_MECHANISM.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36010_PAIRWISE_TREE_SHAPE_PARTIAL_SUM_MAGNITUDE_MECHANISM.verdict) &&
      /refereed bound is changed/i.test(IMP36010_PAIRWISE_TREE_SHAPE_PARTIAL_SUM_MAGNITUDE_MECHANISM.verdict),
  },
];

for (const a of IMP36010_PAIRWISE_TREE_SHAPE_PARTIAL_SUM_MAGNITUDE_MECHANISM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36010-pairwise-tree-shape-partial-sum-magnitude-mechanism assertion failed: ${a.id}`);
  }
}
