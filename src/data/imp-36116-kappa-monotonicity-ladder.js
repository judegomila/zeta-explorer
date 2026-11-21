/**
 * @module imp-36116-kappa-monotonicity-ladder
 *
 * imp-36116 (numerical, S-frontier): is the per-N conditioning number
 * kappa(N) = Sum|t_k| / |Sum t_k| NON-MONOTONE in N across the full imp-35812
 * clustered-order ladder?
 *
 * imp-36062 observed a single rung-to-rung dip near the KBN separation onset --
 * kappa(N=34000) ~ 361.5 is LESS than kappa(N=33000) ~ 362.8, yet N=33000 is still
 * bit-identical -- and therefore keyed the onset to N, not to a hard kappa cutoff.
 * This module tests whether that dip is an isolated near-onset fluke or a ladder-wide
 * property, by computing kappa(N) at FINE N resolution over the whole ladder
 * [1000 .. N(T_PT) ~ 488602] in a single O(N_max) incremental pass and characterizing
 * its monotonicity profile: the fraction of rung-to-rung steps that DECREASE, the count
 * of local dips below the running maximum, the largest single-step drop, and the
 * envelope growth rate (sqrt(N) vs ln(N) least-squares fits).
 *
 * kappa is ORDER-INDEPENDENT -- it depends only on the multiset of terms, not on the
 * summation order -- so the imp-35852 clustered same-sign worst ORDER does not change it;
 * it is the pure conditioning of the sum. Terms and constants are imp-36023/imp-36062
 * verbatim: t_k = cos(alpha*k + beta*sqrt(k)) / sqrt(k), and the kappa denominator
 * |Sum t_k| is the exact bit-for-bit sum of the fp64 terms accumulated as dyadic
 * rationals on a 2^{-96} fixed-point BigInt grid (error-free), so the conditioning never
 * inherits summation roundoff.
 *
 * FINDINGS (624 checkpoints: dense every 100 across N in [30000,45000], else every 1000):
 *   kappa(1000)   ~ 61.90     kappa(33000) ~ 362.81     kappa(34000) ~ 361.45  (imp-36062 dip CONFIRMED)
 *   kappa(488602) ~ 1391.0    grid max     ~ 1392.7 (NOT at the endpoint -- an interior rung is larger)
 *   rung-to-rung steps: 623   rises 410   dips 213   ties 0   -> 34.2% of steps DECREASE
 *   local dips below the running max: 302        largest single-step drop: ~7.82 at N=486000
 *   envelope kappa ~ -1.04 + 1.991*sqrt(N)   R^2 ~ 0.99990   (clean sqrt(N) growth)
 *   envelope kappa ~ -3049 + 328.0*ln(N)     R^2 ~ 0.93912   (much worse -- growth is sqrt(N), not log)
 *
 * READING: the imp-36062 dip is NOT a near-onset artifact -- kappa is non-monotone
 * EVERYWHERE on the ladder: 34% of the fine-resolution rung-to-rung steps decrease, and
 * 302 checkpoints sit below a previously-attained kappa. The smooth ENVELOPE grows like
 * 1.99*sqrt(N) (R^2 ~ 0.9999), which is exactly the sqrt(N) conditioning growth expected for
 * a sum of N well-separated oscillatory terms with |Sum t_k| that stays O(1) while
 * Sum|t_k| ~ 2*sqrt(N); but the PER-RUNG value oscillates around that envelope by more than a
 * full unit (the 1.36 dip at the onset, up to a 7.82 drop near N=486000). A hard cutoff
 * "kappa >= K triggers the KBN/Kahan separation" is therefore ill-posed: because kappa
 * back-tracks so often, any threshold K is crossed, then un-crossed, then re-crossed as N
 * grows, so it cannot cleanly order the rungs by summation difficulty. This confirms the
 * imp-36062 conclusion ladder-wide: the separation onset is characterized by N, not kappa.
 * Both compensated schemes sit at the ~1e-19 floor regardless (imp-36023/imp-36099), so
 * precision is NOT the binding constraint anywhere; the obstruction stays the ENGINEERING of
 * the certified length-N interval sum (MECHANICAL, imp-35725), and the W1 A + B - C
 * certificate at T_PT stays GREENFIELD (imp-35681 Part A). MEASUREMENT ONLY; certifies no W1
 * bound; evaluates no true H_0; instantiates no interval; verifies no inequality; changes no
 * bound; establishes no positivity; the C_mb GUE-conditional constant (imp-486) is untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36062-kbn-kahan-separation-onset (noted the single kappa dip 361.5 lt 362.8; keyed onset to N)
 * @see imp-36099-kbn-kahan-ratio-scaling-fit (the KBN/Kahan ratio itself is rounding-noise, no clean law)
 * @see imp-36023-kbn-combined-worst-ladder (per-N kappa + KBN/Kahan floor on the clustered worst order)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see imp-35760 (barrier-relevant retained-term count N(T_PT) ~ 488602)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (conditioning of a sum)
 */

// -- Anchor + operative constants (import-light; matching imp-36062) ----------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 retained terms per mollified sum at T_PT

const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

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

function fixedToDouble(num) {
  const abs = num < 0n ? -num : num;
  return (Number(abs << 40n) / 2 ** 40 / 2 ** 96) * (num < 0n ? -1 : 1);
}

// -- Fine grid: dense (every 100) through the imp-36062 onset neighbourhood, coarser
//    (every 1000) across the rest of the ladder up to N(T_PT). ------------------------------
const cpSet = new Set();
for (let N = 1000; N <= N_AT_TPT; N += 1000) cpSet.add(N);
for (let N = 30000; N <= 45000; N += 100) cpSet.add(N);
cpSet.add(33000);
cpSet.add(34000);
cpSet.add(N_AT_TPT);
const CHECKPOINTS = Array.from(cpSet)
  .filter((N) => N <= N_AT_TPT)
  .sort((a, b) => a - b);
const cp = new Set(CHECKPOINTS);

// -- Single incremental pass k = 1 .. N_max, recording kappa at each checkpoint ------------
const ROWS = [];
{
  let sumAbs = 0; // Sum|t_k| -- all positive, well conditioned in fp64
  let trueNum = 0n; // exact fixed-point Sum t_k
  const N_max = CHECKPOINTS[CHECKPOINTS.length - 1];
  for (let k = 1; k <= N_max; k++) {
    const t = TERM(k);
    sumAbs += Math.abs(t);
    trueNum += doubleToFixedBigInt(t);
    if (cp.has(k)) {
      const kappa = sumAbs / Math.abs(fixedToDouble(trueNum));
      ROWS.push({ N: k, kappa });
    }
  }
}

// -- Monotonicity characterization ---------------------------------------------------------
let RISES = 0;
let DIPS = 0;
let TIES = 0;
let MAX_DROP = 0;
let MAX_DROP_AT = 0;
let runningMax = -Infinity;
let DIPS_BELOW_RUNNING_MAX = 0;
for (let i = 1; i < ROWS.length; i++) {
  const d = ROWS[i].kappa - ROWS[i - 1].kappa;
  if (d < 0) {
    DIPS++;
    if (-d > MAX_DROP) {
      MAX_DROP = -d;
      MAX_DROP_AT = ROWS[i].N;
    }
  } else if (d > 0) {
    RISES++;
  } else {
    TIES++;
  }
  runningMax = Math.max(runningMax, ROWS[i - 1].kappa);
  if (ROWS[i].kappa < runningMax) DIPS_BELOW_RUNNING_MAX++;
}
const STEPS = ROWS.length - 1;
const DIP_FRACTION = DIPS / STEPS;

// -- Envelope growth: centered OLS for kappa ~ intercept + slope*x -------------------------
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = sxx > 0 && syy > 0 ? (sxy * sxy) / (sxx * syy) : 1;
  return { slope, intercept, r2 };
}
const KS = ROWS.map((r) => r.kappa);
const FIT_SQRT = ols(ROWS.map((r) => Math.sqrt(r.N)), KS);
const FIT_LOG = ols(ROWS.map((r) => Math.log(r.N)), KS);

const kappaAt = (N) => (ROWS.find((r) => r.N === N) || {}).kappa;
const KAPPA_33000 = kappaAt(33000);
const KAPPA_34000 = kappaAt(34000);
const KAPPA_1000 = kappaAt(1000);
const KAPPA_TPT = kappaAt(N_AT_TPT);
const KAPPA_MIN = Math.min(...KS);
const KAPPA_MAX = Math.max(...KS);
const MAX_IS_INTERIOR = KAPPA_MAX > KAPPA_TPT + 1e-9; // grid max is NOT the endpoint rung
const ONSET_DIP_CONFIRMED = KAPPA_34000 < KAPPA_33000;
const SQRT_ENVELOPE_WINS = FIT_SQRT.r2 >= FIT_LOG.r2;

export const IMP36116_KAPPA_MONOTONICITY_LADDER = {
  id: 'imp-36116',
  proofSection: 'S-frontier',
  question:
    'Is the per-N conditioning number kappa(N) = Sum|t_k| / |Sum t_k| NON-MONOTONE in N across the full ' +
    'imp-35812 clustered-order ladder? imp-36062 found the single dip kappa(34000) ~ 361.5 lt kappa(33000) ~ 362.8 ' +
    'near the KBN separation onset and keyed the onset to N, not to a hard kappa cutoff. This module computes ' +
    'kappa(N) at fine resolution over the whole ladder and characterizes its monotonicity profile and envelope ' +
    'growth rate. Measurement only; kappa is order-independent; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36062)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    orderIndependent:
      'kappa depends only on the multiset of terms, NOT on the summation order, so the imp-35852 clustered ' +
      'same-sign worst ORDER does not change it -- kappa is the pure conditioning of the sum',
  },
  reference: {
    method:
      'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt (error-free), ' +
      'so the kappa denominator |Sum t_k| never inherits summation roundoff',
    pass: 'single incremental O(N_max) pass k = 1 .. 488602, recording kappa at 624 checkpoints',
    grid: 'dense every 100 across N in [30000,45000] (the imp-36062 onset neighbourhood), else every 1000',
  },
  checkpointCount: ROWS.length,
  kappa: {
    at1000: KAPPA_1000, // ~61.90
    at33000: KAPPA_33000, // ~362.81
    at34000: KAPPA_34000, // ~361.45  (imp-36062 dip)
    atTPT: KAPPA_TPT, // ~1391.0
    gridMin: KAPPA_MIN,
    gridMax: KAPPA_MAX, // ~1392.7 -- an interior rung, larger than the endpoint
    maxIsInterior: MAX_IS_INTERIOR,
  },
  onsetDip: {
    kappa33000: KAPPA_33000,
    kappa34000: KAPPA_34000,
    drop: KAPPA_34000 - KAPPA_33000, // ~ -1.36
    confirmed: ONSET_DIP_CONFIRMED,
    note: 'reproduces the imp-36062 observation kappa(34000) ~ 361.5 lt kappa(33000) ~ 362.8',
  },
  monotonicity: {
    steps: STEPS,
    rises: RISES,
    dips: DIPS,
    ties: TIES,
    dipFraction: DIP_FRACTION, // ~0.342 -- 34% of steps DECREASE
    dipsBelowRunningMax: DIPS_BELOW_RUNNING_MAX, // ~302
    maxSingleStepDrop: MAX_DROP, // ~7.82
    maxDropAt: MAX_DROP_AT, // ~486000
  },
  envelope: {
    sqrtFit: FIT_SQRT, // kappa ~ -1.04 + 1.991*sqrt(N), R^2 ~ 0.99990
    logFit: FIT_LOG, // kappa ~ -3049 + 328.0*ln(N), R^2 ~ 0.93912
    sqrtWins: SQRT_ENVELOPE_WINS,
    note:
      'the smooth envelope grows like ~1.99*sqrt(N) (R^2 ~ 0.9999) -- the sqrt(N) conditioning growth expected when ' +
      '|Sum t_k| stays O(1) while Sum|t_k| ~ 2*sqrt(N); log(N) fits far worse (R^2 ~ 0.94)',
  },
  reading: {
    nonMonotoneEverywhere:
      'the imp-36062 dip is NOT a near-onset artifact -- kappa is non-monotone EVERYWHERE on the ladder: ~34% of the ' +
      'fine-resolution rung-to-rung steps decrease and ~302 checkpoints sit below a previously-attained kappa',
    envelopeIsSqrtN:
      'the smooth ENVELOPE grows like 1.99*sqrt(N) (R^2 ~ 0.9999) -- exactly the sqrt(N) conditioning growth for a sum ' +
      'of N well-separated oscillatory terms whose signed value stays O(1) while Sum|t_k| ~ 2*sqrt(N); but the PER-RUNG ' +
      'value oscillates around that envelope by more than a full unit (a 1.36 dip at the onset, up to 7.82 near N=486000)',
    thresholdIllPosed:
      'a hard cutoff kappa >= K to trigger the KBN/Kahan separation is ill-posed: because kappa back-tracks so often, ' +
      'any threshold K is crossed, then un-crossed, then re-crossed as N grows, so it cannot cleanly order the rungs by ' +
      'summation difficulty -- confirming the imp-36062 choice to characterize the onset by N, not kappa',
    precisionNotBinding:
      'both compensated schemes sit at the ~1e-19 floor at every rung regardless of kappa (imp-36023/imp-36099), so ' +
      'precision is NOT the binding constraint anywhere on the ladder',
  },
  conclusion: {
    kappaNonMonotone:
      'kappa(N) is NON-MONOTONE across the full imp-35812 ladder -- ~34% of the fine-resolution rung-to-rung steps ' +
      'decrease (213 of 623), with 302 checkpoints below the running max and a largest single-step drop of ~7.82; the ' +
      'imp-36062 onset dip (361.5 lt 362.8) is one instance of a ladder-wide property, not a near-onset fluke',
    envelopeSqrtN:
      'its smooth envelope grows cleanly like ~1.99*sqrt(N) (R^2 ~ 0.9999, far better than log N at ~0.94), but the ' +
      'per-rung value oscillates around that envelope by more than a full unit',
    thresholdIllPosed:
      'so kappa cannot serve as a clean hard-threshold predictor of summation difficulty: any cutoff K is repeatedly ' +
      'crossed and un-crossed as N grows -- the KBN separation onset is properly characterized by N, not kappa',
    staysGreenfield:
      'this module computes only the conditioning kappa(N); it evaluates no sum of H_t and verifies no inequality, so ' +
      'the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725), and precision ' +
      'is not the binding constraint anywhere',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Computing kappa(N) = Sum|t_k| / |Sum t_k| at ' +
    'fine resolution (624 checkpoints, dense every 100 across N in [30000,45000], else every 1000) over the whole ' +
    'imp-35812 ladder [1000 .. 488602] in one exact O(N_max) incremental pass, with the denominator accumulated as a ' +
    '2^{-96} dyadic-BigInt fixed-point sum so it never inherits summation roundoff, the imp-36062 dip is confirmed to ' +
    'be a LADDER-WIDE property, not a near-onset fluke: kappa is NON-MONOTONE everywhere -- ~34% of the rung-to-rung ' +
    'steps decrease (213 of 623), 302 checkpoints sit below a previously-attained kappa, and the largest single-step ' +
    'drop is ~7.82 near N=486000; the grid maximum ~1392.7 is at an interior rung, larger than the endpoint ~1391.0. ' +
    'The onset observation reproduces exactly: kappa(33000) ~ 362.81 gt kappa(34000) ~ 361.45. The smooth ENVELOPE ' +
    'grows cleanly like ~1.99*sqrt(N) (R^2 ~ 0.9999, versus ~0.94 for a log-N fit) -- the sqrt(N) conditioning growth ' +
    'expected when the signed sum stays O(1) while Sum|t_k| ~ 2*sqrt(N) -- but the per-rung value oscillates around that ' +
    'envelope by more than a full unit, so a hard cutoff kappa >= K to trigger the KBN/Kahan separation is ill-posed: ' +
    'any threshold K is crossed, un-crossed, then re-crossed as N grows and cannot cleanly order the rungs by summation ' +
    'difficulty. This confirms the imp-36062 conclusion ladder-wide -- the separation onset is characterized by N, not ' +
    'kappa. Both compensated schemes sit at the ~1e-19 floor at every rung regardless of kappa, so precision is NOT the ' +
    'binding constraint anywhere; the obstruction stays the ENGINEERING of the certified length-N interval sum ' +
    '(MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no ' +
    'inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; ' +
    'C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36062 (noted the single kappa dip 361.5 lt 362.8; keyed the onset to N); imp-36099 (the KBN/Kahan ratio is ' +
    'rounding-noise, no clean law); imp-36023 (per-N kappa + KBN/Kahan floor on the clustered worst order); imp-35852 ' +
    '(clustered worst ORDER); imp-35812 (fixed term family + N ladder [1e3..4.886e5]); imp-35760 (barrier retained-term ' +
    'count N(T_PT)~488602); imp-35725 (mechanical certified sum); imp-35681 Part A (A+B-C interval bound greenfield); ' +
    'Higham 2002, Accuracy and Stability of Numerical Algorithms.',
};

export const IMP36116_KAPPA_MONOTONICITY_LADDER_ASSERTIONS = [
  {
    id: 'imp36116-fine-grid-over-full-ladder',
    description: 'kappa(N) sampled at 624 checkpoints over the full ladder up to N(T_PT) ~ 488602',
    holds: () =>
      ROWS.length === 624 &&
      ROWS[0].N === 1000 &&
      ROWS[ROWS.length - 1].N === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))),
  },
  {
    // The imp-36062 onset dip reproduces: kappa(34000) is strictly below kappa(33000).
    id: 'imp36116-onset-dip-reproduced',
    description: 'imp-36062 dip reproduced: kappa(33000) ~ 362.81 gt kappa(34000) ~ 361.45',
    holds: () =>
      ONSET_DIP_CONFIRMED === true &&
      Math.abs(KAPPA_33000 - 362.81) < 0.05 &&
      Math.abs(KAPPA_34000 - 361.45) < 0.05 &&
      KAPPA_34000 < KAPPA_33000,
  },
  {
    // kappa is non-monotone ladder-wide: a large fraction of rung-to-rung steps decrease.
    id: 'imp36116-non-monotone-ladder-wide',
    description: 'kappa non-monotone everywhere: ~34% of the 623 rung-to-rung steps decrease, ~302 below running max',
    holds: () =>
      STEPS === 623 &&
      DIPS === 213 &&
      RISES === 410 &&
      TIES === 0 &&
      Math.abs(DIP_FRACTION - 0.342) < 0.01 &&
      DIPS_BELOW_RUNNING_MAX === 302,
  },
  {
    // The grid maximum is at an interior rung, not the endpoint -- a direct non-monotonicity witness.
    id: 'imp36116-max-is-interior',
    description: 'grid max kappa ~ 1392.7 exceeds the endpoint kappa(488602) ~ 1391.0 (interior peak)',
    holds: () =>
      MAX_IS_INTERIOR === true &&
      Math.abs(KAPPA_MAX - 1392.7) < 0.5 &&
      Math.abs(KAPPA_TPT - 1391.0) < 0.5 &&
      MAX_DROP > 5 && MAX_DROP < 10,
  },
  {
    // The smooth envelope is a clean sqrt(N) law and beats the log(N) fit.
    id: 'imp36116-sqrt-envelope',
    description: 'envelope kappa ~ 1.99*sqrt(N) with R^2 ~ 0.9999, beating the log(N) fit (~0.94)',
    holds: () =>
      SQRT_ENVELOPE_WINS === true &&
      Math.abs(FIT_SQRT.slope - 1.991) < 0.02 &&
      FIT_SQRT.r2 > 0.999 &&
      FIT_LOG.r2 < 0.96,
  },
  {
    id: 'imp36116-honesty-gate',
    description: 'Measurement only; kappa non-monotone; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36116_KAPPA_MONOTONICITY_LADDER.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /NON-MONOTONE/.test(IMP36116_KAPPA_MONOTONICITY_LADDER.conclusion.kappaNonMonotone) &&
      /NOT the binding constraint/.test(IMP36116_KAPPA_MONOTONICITY_LADDER.reading.precisionNotBinding) &&
      /GREENFIELD/.test(IMP36116_KAPPA_MONOTONICITY_LADDER.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36116_KAPPA_MONOTONICITY_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP36116_KAPPA_MONOTONICITY_LADDER.verdict),
  },
];

for (const a of IMP36116_KAPPA_MONOTONICITY_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36116-kappa-monotonicity-ladder assertion failed: ${a.id}`);
  }
}
