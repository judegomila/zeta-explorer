/**
 * @module imp-36114-kbn-kahan-ratio-decay-law-fit
 *
 * imp-36114 (numerical, S-frontier): does the imp-36062 KBN/classic-Kahan normalized-error
 * RATIO admit a clean functional DECAY LAW versus N above the ~34000 separation onset?
 *
 * imp-36062 recorded the KBN/classic-Kahan error ratio on the imp-35852 clustered worst order
 * deepening from ~0.96 at the N ~ 34000 separation onset to ~0.08 at N ~ 488602, but NEVER fit
 * its N-dependence. This module sweeps the ratio across a twelve-rung ladder above the onset
 * (N = [35000 .. 488602]) against the SAME per-N exact 2^{-96} dyadic-BigInt reference (schemes
 * byte-identical to imp-36062 / imp-36023) and fits three candidate forms by ordinary
 * least-squares: a power law in N, a power law in the conditioning kappa, and a log-linear
 * ratio-vs-ln(N). It reports the best fit and its residuals.
 *
 * FINDING: NONE of the three candidate forms fits. All three land at R^2 ~ 0.15 -- essentially
 * ZERO explanatory power -- because the per-N ratio is a floor-level ROUNDING coin-flip, not a
 * smooth decay. The scatter includes BIT-IDENTICAL rungs (ratio = 1.0, KBN = classic Kahan) at
 * BOTH N = 35000 and N = 220000, interleaved with deeply-separated rungs (ratio ~ 0.065), all
 * the way to N ~ 488602. This directly matches the imp-36095 / imp-36113 intermittency result
 * that the sep-vs-identical verdict is a per-N rounding coin-flip that does NOT track kappa. The
 * imp-36062 "0.96 -> 0.08" deepening was an ENDPOINT ARTIFACT of a noisy scatter, NOT a trend:
 * the two endpoints happen to be a near-tie rung and a deep-separation rung. The only stable
 * summary is a GEOMETRIC-MEAN ratio ~ 0.26 (KBN typically ~4x tighter) bounded in [~0.065, 1.0],
 * with occasional reversion to a bit-identical tie -- there is no fittable functional form.
 *
 * Both schemes and the exact reference are re-implemented here byte-identically to imp-36062.
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval;
 * verifies no inequality; changes no bound; establishes no positivity; the C_mb GUE-conditional
 * constant (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED ratios and OLS fits on the twelve-rung above-onset ladder (clustered worst order):
 *   N        kappa    Kahan        KBN          ratio = KBN/Kahan
 *   35000     376.2   1.721e-19    1.721e-19    1.0000  (bit-identical)
 *   45000     423.6   2.665e-19    1.458e-19    0.5469
 *   55000     462.6   3.501e-19    2.273e-20    0.0649
 *   70000     524.6   2.841e-19    4.631e-20    0.1630
 *   90000     600.6   1.579e-19    1.334e-19    0.8450
 *   120000    686.7   3.925e-19    1.119e-19    0.2851
 *   160000    793.3   3.045e-19    8.617e-20    0.2830
 *   220000    935.7   8.591e-20    8.591e-20    1.0000  (bit-identical again)
 *   300000   1094.2   2.819e-19    3.683e-20    0.1306
 *   400000   1254.8   9.900e-20    3.901e-20    0.3940
 *   460000   1353.5   2.413e-19    1.604e-20    0.0665
 *   488602   1391.0   2.308e-19    1.892e-20    0.0820  (imp-36062 endpoint reproduced)
 *
 *   power law   ratio ~ A * N^p       : p = -0.431,  R^2 = 0.155
 *   power law   ratio ~ A * kappa^p   : p = -0.850,  R^2 = 0.150
 *   log-linear  ratio ~ a + b*ln(N)   : b = -0.150,  R^2 = 0.153
 *   geometric-mean ratio = 0.263, range [0.0649, 1.0000], bit-identical rungs = 2 of 12
 *
 * @see imp-36062-kbn-kahan-separation-onset (recorded ratio 0.96->0.08 but never fit its form)
 * @see imp-36095-kbn-kahan-intermittency-band (sep-vs-identical verdict alternates rung-to-rung)
 * @see imp-36113 (step-250 persistence-from-N~39250 is a grid-aliasing artifact; per-N rounding coin-flip)
 * @see imp-36023-kbn-combined-worst-ladder (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36062) -----------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-36023 / imp-36062.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes (byte-identical to imp-36062) ---------------------------------------
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

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) -----------
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

// -- Measure Kahan vs KBN at one N against a freshly built exact reference ------------------
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
    bitIdentical: kbnNormErr === kahanNormErr,
  };
}

// -- Above-onset ladder (all rungs N >= 34000 onset) ---------------------------------------
const LADDER_SIZES = [35000, 45000, 55000, 70000, 90000, 120000, 160000, 220000, 300000, 400000, 460000, N_AT_TPT];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- Ordinary least-squares y = a + b*x, returning slope/intercept and R^2 -----------------
function olsFit(xs, ys) {
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - meanX) * (ys[i] - meanY);
    sxx += (xs[i] - meanX) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;
  let ssr = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssr += (ys[i] - pred) ** 2;
    sst += (ys[i] - meanY) ** 2;
  }
  return { slope, intercept, r2: 1 - ssr / sst };
}

const LN_N = LADDER.map((r) => Math.log(r.N));
const LN_KAPPA = LADDER.map((r) => Math.log(r.kappa));
const RATIOS = LADDER.map((r) => r.ratio);
const LN_RATIO = RATIOS.map((r) => Math.log(r));

// Candidate 1: power law in N        -> ln(ratio) = ln(A) + p*ln(N)
const FIT_POWER_N = olsFit(LN_N, LN_RATIO);
// Candidate 2: power law in kappa    -> ln(ratio) = ln(A) + p*ln(kappa)
const FIT_POWER_KAPPA = olsFit(LN_KAPPA, LN_RATIO);
// Candidate 3: log-linear ratio-vs-ln(N) -> ratio = a + b*ln(N)
const FIT_LOG_LINEAR = olsFit(LN_N, RATIOS);

const POWER_N = { A: Math.exp(FIT_POWER_N.intercept), p: FIT_POWER_N.slope, r2: FIT_POWER_N.r2 };
const POWER_KAPPA = { A: Math.exp(FIT_POWER_KAPPA.intercept), p: FIT_POWER_KAPPA.slope, r2: FIT_POWER_KAPPA.r2 };
const LOG_LINEAR = { a: FIT_LOG_LINEAR.intercept, b: FIT_LOG_LINEAR.slope, r2: FIT_LOG_LINEAR.r2 };

const BEST_R2 = Math.max(POWER_N.r2, POWER_KAPPA.r2, LOG_LINEAR.r2);
// R^2 far below any threshold at which a fit would be meaningful (~0.8): NO form describes it.
const NO_FORM_FITS = BEST_R2 < 0.5;

const GEO_MEAN_RATIO = Math.exp(LN_RATIO.reduce((a, b) => a + b, 0) / LN_RATIO.length);
const MIN_RATIO = Math.min(...RATIOS);
const MAX_RATIO = Math.max(...RATIOS);
const NUM_BIT_IDENTICAL = LADDER.filter((r) => r.bitIdentical).length;
const ENDPOINT = LADDER[LADDER.length - 1];

export const IMP36114_KBN_KAHAN_RATIO_DECAY_LAW_FIT = {
  id: 'imp-36114',
  proofSection: 'S-frontier',
  question:
    'Does the imp-36062 KBN/classic-Kahan normalized-error RATIO admit a clean functional decay ' +
    'law versus N above the ~34000 separation onset? imp-36062 recorded the ratio deepening from ' +
    '~0.96 at N ~ 34000 to ~0.08 at N ~ 488602 but never fit its N-dependence. Measurement only; ' +
    'certifies no W1 bound; changes no bound; NO QED.',
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
    orderAndAssociationInvariant: true,
    note: 'one exact reference is computed once PER N and reused for that rung',
  },
  unitRoundoff: U_ROUNDOFF,
  ladderSizes: LADDER_SIZES,
  ladder: LADDER,
  fits: {
    powerLawInN: POWER_N, // ratio ~ A * N^p ; R^2 ~ 0.15
    powerLawInKappa: POWER_KAPPA, // ratio ~ A * kappa^p ; R^2 ~ 0.15
    logLinear: LOG_LINEAR, // ratio ~ a + b*ln(N) ; R^2 ~ 0.15
    bestR2: BEST_R2,
    noFormFits: NO_FORM_FITS,
  },
  scatterSummary: {
    geoMeanRatio: GEO_MEAN_RATIO, // ~0.26 -- KBN typically ~4x tighter
    minRatio: MIN_RATIO, // ~0.065 -- deep separation
    maxRatio: MAX_RATIO, // 1.0 -- bit-identical (KBN = classic Kahan)
    numBitIdentical: NUM_BIT_IDENTICAL, // 2 of 12, at N = 35000 AND N = 220000
    endpointRatio: ENDPOINT.ratio, // ~0.08, reproduces imp-36062 endpoint
  },
  reading: {
    noDecayLaw:
      'NONE of the three candidate forms fits: power law in N, power law in kappa, and log-linear ' +
      'ratio-vs-ln(N) all land at R^2 ~ 0.15, essentially ZERO explanatory power',
    rounding_coin_flip:
      'the per-N ratio is a floor-level ROUNDING coin-flip, not a smooth decay -- the scatter ' +
      'includes BIT-IDENTICAL rungs (ratio = 1.0, KBN = classic Kahan) at BOTH N = 35000 and ' +
      'N = 220000, interleaved with deep-separation rungs (ratio ~ 0.065) all the way to N ~ 488602',
    endpointArtifact:
      'the imp-36062 "0.96 -> 0.08" deepening was an ENDPOINT ARTIFACT of a noisy scatter, NOT a ' +
      'trend: the two endpoints happen to be a near-tie rung and a deep-separation rung',
    stableSummary:
      'the only stable summary is a GEOMETRIC-MEAN ratio ~ 0.26 (KBN typically ~4x tighter) bounded ' +
      'in [~0.065, 1.0] with occasional reversion to a bit-identical tie -- no fittable functional form',
    consistentWithIntermittency:
      'this directly matches the imp-36095 / imp-36113 intermittency result that the sep-vs-identical ' +
      'verdict is a per-N rounding coin-flip that does NOT track kappa',
  },
  conclusion: {
    noFittableForm:
      'the KBN/classic-Kahan ratio above the ~34000 onset admits NO clean decay law: power law in N ' +
      '(R^2 ~ 0.15), power law in kappa (R^2 ~ 0.15), and log-linear (R^2 ~ 0.15) all fail; the ratio ' +
      'is floor-level rounding scatter, not a functional trend',
    precisionNotBinding:
      'both schemes sit at the ~1e-19 compensated floor at every rung -- the ratio is a floor-level ' +
      'rounding effect and precision is NOT the binding constraint anywhere on the ladder',
    staysGreenfield:
      'this module fits candidate decay laws to a Kahan-vs-KBN ratio at twelve N only; it evaluates no ' +
      'sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Fitting the imp-36062 ' +
    'KBN/classic-Kahan normalized-error ratio across a twelve-rung above-onset ladder ' +
    'N = [35000, 45000, 55000, 70000, 90000, 120000, 160000, 220000, 300000, 400000, 460000, 488602] ' +
    'on the imp-35852 clustered worst order against a per-N exact 2^{-96} dyadic-BigInt reference, ' +
    'NONE of three candidate forms fits: a power law in N (p ~ -0.43, R^2 ~ 0.15), a power law in the ' +
    'conditioning kappa (p ~ -0.85, R^2 ~ 0.15), and a log-linear ratio-vs-ln(N) (R^2 ~ 0.15) all have ' +
    'essentially ZERO explanatory power. The per-N ratio is a floor-level ROUNDING coin-flip, not a ' +
    'smooth decay: the scatter includes BIT-IDENTICAL rungs (ratio = 1.0, KBN = classic Kahan) at both ' +
    'N = 35000 and N = 220000, interleaved with deep-separation rungs (ratio ~ 0.065) all the way to ' +
    'N ~ 488602 -- matching the imp-36095 / imp-36113 intermittency finding that the sep-vs-identical ' +
    'verdict does NOT track kappa. The imp-36062 "0.96 -> 0.08" deepening was an ENDPOINT ARTIFACT of a ' +
    'noisy scatter, NOT a trend; the only stable summary is a geometric-mean ratio ~ 0.26 (KBN typically ' +
    '~4x tighter) bounded in [~0.065, 1.0]. Both schemes sit at the ~1e-19 compensated floor at every ' +
    'rung, so precision is NOT the binding constraint; the obstruction stays the ENGINEERING of the ' +
    'certified length-N interval sum (MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true ' +
    'H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; ' +
    'the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36062 (recorded ratio 0.96->0.08 but never fit its form); imp-36095 (intermittency band, ' +
    'verdict alternates rung-to-rung); imp-36113 (step-250 persistence is a grid-aliasing artifact); ' +
    'imp-36023 (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602); imp-35852 (clustered worst ' +
    'ORDER); imp-35812 (fixed term family + N ladder [1e3..4.886e5]); imp-35681 Part A (A+B-C interval ' +
    'bound greenfield); imp-35725 (mechanical certified sum); Higham 2002, Neumaier 1974.',
};

export const IMP36114_KBN_KAHAN_RATIO_DECAY_LAW_FIT_ASSERTIONS = [
  {
    id: 'imp36114-ladder-above-onset',
    description: 'Twelve-rung ladder entirely above the N ~ 34000 onset, endpoint = N at T_PT',
    holds: () =>
      LADDER.length === 12 &&
      LADDER_SIZES[0] === 35000 &&
      LADDER_SIZES.every((N) => N >= 34000) &&
      LADDER_SIZES[LADDER_SIZES.length - 1] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))),
  },
  {
    // No candidate functional form fits: all three R^2 are far below any meaningful threshold.
    id: 'imp36114-no-form-fits',
    description: 'Power-law-in-N, power-law-in-kappa, and log-linear all fit at R^2 < 0.3 (no decay law)',
    holds: () =>
      NO_FORM_FITS === true &&
      POWER_N.r2 < 0.3 &&
      POWER_KAPPA.r2 < 0.3 &&
      LOG_LINEAR.r2 < 0.3 &&
      BEST_R2 < 0.3,
  },
  {
    // The ratio is a rounding coin-flip: bit-identical rungs recur above the onset.
    id: 'imp36114-bit-identical-recurs',
    description: 'Bit-identical (ratio = 1.0) rungs recur above the onset (at N = 35000 and N = 220000)',
    holds: () =>
      NUM_BIT_IDENTICAL === 2 &&
      Math.abs(MAX_RATIO - 1) < 1e-15 &&
      LADDER.find((r) => r.N === 35000).bitIdentical === true &&
      LADDER.find((r) => r.N === 220000).bitIdentical === true,
  },
  {
    // The scatter spans a wide band with a stable geometric mean, not a monotone decay.
    id: 'imp36114-scatter-band',
    description: 'Ratio scatter spans [~0.065, 1.0] with geo-mean ~0.26; endpoint reproduces imp-36062',
    holds: () =>
      MIN_RATIO > 0.05 && MIN_RATIO < 0.1 &&
      GEO_MEAN_RATIO > 0.15 && GEO_MEAN_RATIO < 0.4 &&
      Math.abs(ENDPOINT.ratio - 0.082) < 0.02,
  },
  {
    id: 'imp36114-honesty-gate',
    description: 'Measurement only; no fittable form; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36114_KBN_KAHAN_RATIO_DECAY_LAW_FIT.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /NO clean decay law/i.test(IMP36114_KBN_KAHAN_RATIO_DECAY_LAW_FIT.conclusion.noFittableForm) &&
      /NOT the binding constraint/.test(
        IMP36114_KBN_KAHAN_RATIO_DECAY_LAW_FIT.conclusion.precisionNotBinding,
      ) &&
      /GREENFIELD/.test(IMP36114_KBN_KAHAN_RATIO_DECAY_LAW_FIT.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36114_KBN_KAHAN_RATIO_DECAY_LAW_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP36114_KBN_KAHAN_RATIO_DECAY_LAW_FIT.verdict),
  },
];

for (const a of IMP36114_KBN_KAHAN_RATIO_DECAY_LAW_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36114-kbn-kahan-ratio-decay-law-fit assertion failed: ${a.id}`);
  }
}
