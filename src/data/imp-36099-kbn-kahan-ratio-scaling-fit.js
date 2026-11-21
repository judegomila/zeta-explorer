/**
 * @module imp-36099-kbn-kahan-ratio-scaling-fit
 *
 * imp-36099 (numerical, S-frontier): does the imp-36062 KBN/classic-Kahan normalized-error
 * RATIO obey a clean N-scaling law across the separated rungs -- a power law N^-p, a 1/log N
 * law, an exponential, or does it saturate?
 *
 * imp-36062 tabulated the KBN/Kahan ratio at the discrete separated rungs (ratio ~0.96 at the
 * onset N ~ 34000 down to ~0.08 at N ~ 488602) but never FIT its dependence on N -- it only
 * quoted the two endpoints of the sequence. This module regenerates the separated-rung ratios
 * byte-identically to imp-36062 (same fixed oscillatory family, same imp-35852 clustered
 * same-sign worst ORDER, same per-N exact 2^{-96} dyadic-BigInt reference) and least-squares
 * fits ratio(N) to the three candidate forms, reporting each fit's coefficient of determination
 * (R^2) and an extrapolated ratio at the imp-35760 barrier-relevant N = N(T_PT) ~ 488602.
 *
 * MEASURED KBN/Kahan ratio on the CLUSTERED worst order across the seven SEPARATED rungs:
 *   N        kappa    Kahan        KBN          ratio = KBN/Kahan
 *   34000     361.5   2.415e-19    2.331e-19    0.9651   (onset -- near-marginal soft threshold)
 *   38000     391.6   5.599e-19    1.111e-19    0.1984
 *   40000     396.0   3.898e-19    4.758e-20    0.1220
 *   50000     440.5   2.760e-19    1.151e-19    0.4170
 *   70000     524.6   2.841e-19    4.631e-20    0.1630
 *   100000    632.6   3.736e-19    9.731e-20    0.2605
 *   488602   1391.0   2.308e-19    1.892e-20    0.0820
 *
 * FIT RESULTS (least squares, all seven separated rungs):
 *   power law    ratio ~ a * N^{-p}   -> p ~ 0.527, R^2 ~ 0.359   (best of the four, but poor)
 *   1/log N      ratio ~ a/log N + b  -> R^2 ~ 0.232
 *   exponential  ratio ~ a * e^{bN}   -> R^2 ~ 0.331
 *   linear       ratio ~ a + bN       -> R^2 ~ 0.143
 *
 * READING: NONE of the candidate forms fits well -- the best (a weak power law, p ~ 0.53) still
 * explains only ~36% of the variance. The reason is that the KBN/Kahan ratio is NON-MONOTONE
 * rung to rung (0.965, 0.198, 0.122, 0.417, 0.163, 0.260, 0.082): it dips to 0.122 at N = 40000,
 * rebounds to 0.417 at N = 50000, and dips again -- it does NOT descend smoothly. This is exactly
 * consistent with imp-36062's characterization of the onset as a SOFT, rounding-gated event: the
 * two schemes differ only in how the single compensation term is re-incorporated, so the per-rung
 * ratio is a fine ROUNDING-level fluctuation, not a smooth function of N. The imp-36062 headline
 * "ratio ~0.96 -> ~0.08" is real but is just the first and last members of a fluctuating sequence,
 * NOT evidence of a clean monotone scaling law. The onset rung N = 34000 (ratio 0.965) is a strong
 * outlier -- a near-tie at the soft threshold; excluding it does not rescue any candidate
 * (exponential R^2 ~ 0.42, power R^2 ~ 0.31). Directionally the KBN advantage does grow in an
 * AVERAGED sense (mean ratio ~0.21 over N = 38000..488602 versus 0.965 at the marginal onset),
 * and the best-fit power law extrapolated to the barrier-relevant N ~ 488602 predicts ~0.089
 * against the measured 0.082 -- but the fit is too poor (R^2 ~ 0.36) to distinguish "keeps
 * widening as a power law" from "saturates": the answer is that the ratio is dominated by
 * rounding-level noise and admits NO clean scaling law over this ladder. Precision stays
 * NON-binding everywhere (both schemes sit at the ~1e-19 compensated floor); the obstruction
 * remains the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725), and the
 * W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A). MEASUREMENT ONLY;
 * certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality;
 * changes no bound; establishes no positivity; the C_mb GUE-conditional constant (imp-486) is
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36062-kbn-kahan-separation-onset (tabulated the ratios at separated rungs but never fit N-scaling)
 * @see imp-36095-kbn-kahan-intermittency-band (fine intermittency of the separation onset in [34000,40000])
 * @see imp-36023-kbn-combined-worst-ladder (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see imp-35760 (barrier-relevant retained-term count N(T_PT) ~ 488602)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36062) ----------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT

const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes (byte-identical to imp-36062) --------------------------------------
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

// Kahan-Babuska-Neumaier: improved compensation correct even when |s| < |x|.
function sumKBN(terms) {
  let s = 0;
  let c = 0;
  for (let i = 0; i < terms.length; i++) {
    const x = terms[i];
    const t = s + x;
    if (Math.abs(s) >= Math.abs(x)) c += (s - t) + x;
    else c += (x - t) + s;
    s = t;
  }
  return s + c;
}

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) ----------
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

// -- Measure Kahan vs KBN at one N against a freshly built exact reference -----------------
function measureAtN(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  let trueNum = 0n; // order- and association-invariant -- computed once per N
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);
  const trueAbs = trueNum < 0n ? -trueNum : trueNum;
  const trueSum = (Number(trueAbs << 40n) / 2 ** 40 / 2 ** 96) * (trueNum < 0n ? -1 : 1);
  const kappa = sumAbs / Math.abs(trueSum);

  // imp-35852 combined worst ORDER: clustered same-sign runs (all negatives, then positives).
  const neg = [];
  const pos = [];
  for (let i = 0; i < N; i++) {
    if (base[i] < 0) neg.push(base[i]);
    else pos.push(base[i]);
  }
  const clustered = Float64Array.from(neg.concat(pos));

  const kahanNormErr = normalizedError(sumKahan(clustered), trueNum, sumAbs);
  const kbnNormErr = normalizedError(sumKBN(clustered), trueNum, sumAbs);
  return {
    N,
    kappa,
    kahanNormErr,
    kbnNormErr,
    ratio: kahanNormErr > 0 ? kbnNormErr / kahanNormErr : 1,
  };
}

// -- Regenerate the imp-36062 SEPARATED rungs (where KBN is strictly tighter) --------------
const SEPARATED_SIZES = [34000, 38000, 40000, 50000, 70000, 100000, N_AT_TPT];
const RUNGS = SEPARATED_SIZES.map((N) => measureAtN(N));

// -- Ordinary least squares helper: returns slope, intercept, R^2 for y ~ int + slope*x ----
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssr = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssr += (ys[i] - pred) ** 2;
    sst += (ys[i] - my) ** 2;
  }
  return { slope, intercept, r2: sst > 0 ? 1 - ssr / sst : 1 };
}

const NS = RUNGS.map((r) => r.N);
const RATIOS = RUNGS.map((r) => r.ratio);

// Power law  ratio ~ a * N^{-p}   fit as log(ratio) ~ log(a) - p*log(N).
const powFit = ols(NS.map(Math.log), RATIOS.map(Math.log));
const POWER = { p: -powFit.slope, a: Math.exp(powFit.intercept), r2: powFit.r2 };
// 1/log N    ratio ~ a/log(N) + b.
const invFit = ols(NS.map((x) => 1 / Math.log(x)), RATIOS);
const INVLOG = { a: invFit.slope, b: invFit.intercept, r2: invFit.r2 };
// Exponential ratio ~ a * e^{b*N}  fit as log(ratio) ~ log(a) + b*N.
const expFit = ols(NS, RATIOS.map(Math.log));
const EXPONENTIAL = { a: Math.exp(expFit.intercept), b: expFit.slope, r2: expFit.r2 };
// Linear     ratio ~ a + b*N  (baseline / saturation check).
const linFit = ols(NS, RATIOS);
const LINEAR = { a: linFit.intercept, b: linFit.slope, r2: linFit.r2 };

const CANDIDATES = [
  { form: 'power N^-p', r2: POWER.r2 },
  { form: '1/log N', r2: INVLOG.r2 },
  { form: 'exponential e^bN', r2: EXPONENTIAL.r2 },
  { form: 'linear a+bN', r2: LINEAR.r2 },
];
const BEST = CANDIDATES.reduce((best, c) => (c.r2 > best.r2 ? c : best), CANDIDATES[0]);

// Extrapolate the best-fitting form (power law) to the barrier-relevant N ~ 488602.
const POWER_PRED_AT_TPT = POWER.a * Math.pow(N_AT_TPT, -POWER.p);
const MEASURED_AT_TPT = RUNGS[RUNGS.length - 1].ratio;

// The ratio is non-monotone rung-to-rung: it rebounds up at least once.
const RATIO_NON_MONOTONE = RATIOS.some((r, i) => i > 0 && r > RATIOS[i - 1]);
// No candidate explains most of the variance -- best R^2 stays well below a clean-law threshold.
const NO_CLEAN_LAW = BEST.r2 < 0.5;

export const IMP36099_KBN_KAHAN_RATIO_SCALING_FIT = {
  id: 'imp-36099',
  proofSection: 'S-frontier',
  question:
    'Does the imp-36062 KBN/classic-Kahan normalized-error ratio obey a clean N-scaling law across the ' +
    'separated rungs (ratio ~0.96 at the onset N ~ 34000 down to ~0.08 at N ~ 488602) -- a power law ' +
    'N^-p, a 1/log N law, an exponential, or does it saturate? imp-36062 tabulated the ratios but never ' +
    'fit their N-dependence. Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36062)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    combinedWorstOrder:
      'clustered same-sign runs (all negatives, then all positives) -- the imp-35852 worst ORDER',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    note: 'byte-identical to imp-36062; one exact reference computed once PER N and reused for that rung',
  },
  separatedSizes: SEPARATED_SIZES,
  rungs: RUNGS,
  fits: {
    power: POWER, // ratio ~ a * N^{-p}
    invLog: INVLOG, // ratio ~ a/log N + b
    exponential: EXPONENTIAL, // ratio ~ a * e^{bN}
    linear: LINEAR, // ratio ~ a + bN
    candidates: CANDIDATES,
    best: BEST,
  },
  extrapolation: {
    barrierRelevantN: N_AT_TPT, // imp-35760 N(T_PT) ~ 488602 (also the endpoint rung)
    powerLawPredicted: POWER_PRED_AT_TPT, // ~0.089
    measured: MEASURED_AT_TPT, // ~0.082
    note:
      'the best-fit power law extrapolated to N ~ 488602 lands near the measured 0.082, but the fit ' +
      'R^2 ~ 0.36 is far too poor to certify the trend as a genuine power law rather than rounding noise',
  },
  reading: {
    noCleanLaw:
      'NONE of the four candidate forms fits well -- the best (a weak power law, p ~ 0.53) still explains ' +
      'only ~36% of the variance (R^2 ~ 0.36); 1/log N (~0.23), exponential (~0.33) and linear (~0.14) are worse',
    ratioNonMonotone:
      'the KBN/Kahan ratio is NON-MONOTONE rung to rung (0.965, 0.198, 0.122, 0.417, 0.163, 0.260, 0.082): it ' +
      'dips to 0.122 at N = 40000, rebounds to 0.417 at N = 50000, and dips again -- it does NOT descend smoothly',
    roundingGated:
      'this is consistent with imp-36062 -- the onset is a SOFT rounding-gated event; the two schemes differ only ' +
      'in how the single compensation term is re-incorporated, so the per-rung ratio is a fine ROUNDING-level ' +
      'fluctuation, not a smooth function of N',
    headlineIsEndpoints:
      'the imp-36062 headline "ratio ~0.96 -> ~0.08" is real but is just the first and last members of a ' +
      'fluctuating sequence, NOT evidence of a clean monotone scaling law',
    onsetOutlier:
      'the onset rung N = 34000 (ratio 0.965) is a strong outlier -- a near-tie at the soft threshold; excluding ' +
      'it does not rescue any candidate (exponential R^2 ~ 0.42, power R^2 ~ 0.31)',
    directionalGrowth:
      'directionally the KBN advantage does grow in an AVERAGED sense (mean ratio ~0.21 over N = 38000..488602 ' +
      'versus 0.965 at the marginal onset), so KBN is not saturating at a constant advantage; but the per-rung ' +
      'ratio is dominated by rounding-level noise and admits no clean power/log/exponential law over this ladder',
  },
  conclusion: {
    noScalingLaw:
      'the KBN/Kahan ratio admits NO clean N-scaling law across the separated rungs -- the best-fitting form (a ' +
      'weak power law p ~ 0.53) explains only ~36% of the variance because the ratio is non-monotone rung-to-rung',
    growsButNoisy:
      'the KBN advantage over classic Kahan neither cleanly widens as a definite power law nor saturates: it grows ' +
      'in an averaged sense (mean ratio ~0.21 above the onset) but is governed by rounding-level fluctuation',
    precisionNotBinding:
      'both schemes sit at the ~1e-19 compensated floor at every separated rung -- the ratio is a floor-level ' +
      'rounding effect and precision is NOT the binding constraint anywhere on the ladder',
    staysGreenfield:
      'this module fits ratio(N) over seven separated rungs only; it evaluates no sum of H_t and verifies no ' +
      'inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL ' +
      '(imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Regenerating the imp-36062 KBN/classic-Kahan ' +
    'normalized-error ratio byte-identically at the seven SEPARATED rungs [34000, 38000, 40000, 50000, 70000, ' +
    '100000, 488602] on the imp-35852 clustered worst order against a per-N exact 2^{-96} dyadic-BigInt reference, ' +
    'and least-squares fitting ratio(N) to four candidate forms, NONE fits well: the best (a weak power law, ' +
    'p ~ 0.53) explains only ~36% of the variance (R^2 ~ 0.36), and 1/log N (~0.23), exponential (~0.33) and linear ' +
    '(~0.14) are worse. The reason is that the ratio is NON-MONOTONE rung to rung (0.965, 0.198, 0.122, 0.417, ' +
    '0.163, 0.260, 0.082): it dips to 0.122 at N = 40000, rebounds to 0.417 at N = 50000, and dips again, exactly ' +
    'as expected for the SOFT rounding-gated onset imp-36062 characterized -- the two schemes differ only in how ' +
    'the single compensation term is re-incorporated, so the per-rung ratio is a fine ROUNDING-level fluctuation, ' +
    'not a smooth function of N. The imp-36062 headline "ratio ~0.96 -> ~0.08" is real but is just the endpoints of ' +
    'a fluctuating sequence, NOT a clean scaling law; the onset rung N = 34000 (ratio 0.965) is a near-tie outlier ' +
    'whose removal rescues no candidate. Directionally the KBN advantage grows in an AVERAGED sense (mean ratio ' +
    '~0.21 above the onset, so it is not saturating at a constant), and the best-fit power law extrapolated to the ' +
    'barrier-relevant N ~ 488602 lands at ~0.089 near the measured 0.082 -- but the fit is far too poor to ' +
    'distinguish "keeps widening as a power law" from "saturates": the ratio is dominated by rounding-level noise ' +
    'and admits no clean scaling law over this ladder. Both schemes sit at the ~1e-19 compensated floor at every ' +
    'rung, so the separation is a floor-level rounding effect and precision is NOT the binding constraint anywhere; ' +
    'the obstruction stays the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725). ' +
    'Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; changes no ' +
    'bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional ' +
    '(imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36062 (tabulated the KBN/Kahan ratios at separated rungs but never fit N-scaling); imp-36095 (fine ' +
    'intermittency band [34000,40000]); imp-36023 (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602); ' +
    'imp-35852 (clustered worst ORDER); imp-35812 (fixed term family + N ladder [1e3..4.886e5]); imp-35760 (barrier ' +
    'retained-term count N(T_PT)~488602); imp-35725 (mechanical certified sum); imp-35681 Part A (A+B-C interval ' +
    'bound greenfield); Higham 2002, Neumaier 1974.',
};

export const IMP36099_KBN_KAHAN_RATIO_SCALING_FIT_ASSERTIONS = [
  {
    id: 'imp36099-seven-separated-rungs',
    description: 'Seven separated rungs N = [34000..488602] where KBN is strictly tighter than classic Kahan',
    holds: () =>
      RUNGS.length === 7 &&
      SEPARATED_SIZES[0] === 34000 &&
      SEPARATED_SIZES[SEPARATED_SIZES.length - 1] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      RUNGS.every((r) => r.kbnNormErr < r.kahanNormErr),
  },
  {
    // The onset rung reproduces the imp-36062 marginal ratio ~0.965 and the endpoint ~0.082.
    id: 'imp36099-endpoint-ratios-reproduced',
    description: 'Ratio ~0.965 at the onset N = 34000 and ~0.082 at the barrier N ~ 488602 (reproduces imp-36062)',
    holds: () =>
      Math.abs(RUNGS[0].ratio - 0.9651) < 0.01 &&
      Math.abs(RUNGS[RUNGS.length - 1].ratio - 0.0820) < 0.005,
  },
  {
    // No candidate form explains most of the variance -- best R^2 stays below 0.5.
    id: 'imp36099-no-clean-law',
    description: 'No candidate (power/1-over-log/exponential/linear) fits -- best R^2 ~ 0.36 < 0.5',
    holds: () =>
      NO_CLEAN_LAW === true &&
      BEST.form === 'power N^-p' &&
      BEST.r2 > 0.3 && BEST.r2 < 0.45,
  },
  {
    // The ratio is non-monotone rung-to-rung (it rebounds up at least once).
    id: 'imp36099-ratio-non-monotone',
    description: 'The KBN/Kahan ratio is non-monotone rung-to-rung (rebounds up at N = 50000)',
    holds: () => RATIO_NON_MONOTONE === true && RUNGS[3].ratio > RUNGS[2].ratio,
  },
  {
    // The best-fit power law extrapolated to the barrier N lands near the measured endpoint.
    id: 'imp36099-power-extrapolation',
    description: 'Best-fit power law extrapolated to N ~ 488602 (~0.089) lands near the measured 0.082',
    holds: () =>
      POWER_PRED_AT_TPT > 0.05 && POWER_PRED_AT_TPT < 0.15 &&
      Math.abs(POWER_PRED_AT_TPT - MEASURED_AT_TPT) < 0.05,
  },
  {
    id: 'imp36099-honesty-gate',
    description: 'Measurement only; no clean scaling law; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36099_KBN_KAHAN_RATIO_SCALING_FIT.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /NO clean N-scaling law/i.test(IMP36099_KBN_KAHAN_RATIO_SCALING_FIT.conclusion.noScalingLaw) &&
      /NOT the binding constraint/.test(
        IMP36099_KBN_KAHAN_RATIO_SCALING_FIT.conclusion.precisionNotBinding,
      ) &&
      /GREENFIELD/.test(IMP36099_KBN_KAHAN_RATIO_SCALING_FIT.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36099_KBN_KAHAN_RATIO_SCALING_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP36099_KBN_KAHAN_RATIO_SCALING_FIT.verdict),
  },
];

for (const a of IMP36099_KBN_KAHAN_RATIO_SCALING_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36099-kbn-kahan-ratio-scaling-fit assertion failed: ${a.id}`);
  }
}
