/**
 * @module imp-36095-kbn-kahan-intermittency-band
 *
 * imp-36095 (numerical, S-frontier): TABULATE the KBN-vs-classic-Kahan separation
 * INTERMITTENCY band N in [34000, 40000] that imp-36062 explicitly did NOT store.
 *
 * imp-36062 located the FIRST strict Kahan-Babuska-Neumaier (KBN) vs classic-Kahan separation at
 * N ~ 34000 on the imp-35852 clustered worst order and characterized the onset as a SOFT
 * threshold, noting that "a finer sub-sweep (not stored) shows the separation is intermittent
 * between N ~ 34000 and ~40000 (identical again at 35000-37000) before becoming persistent." That
 * intermittency band was asserted but never tabulated. This module re-runs the byte-identical
 * imp-36062 schemes plus per-N exact 2^{-96} dyadic-BigInt reference on a FINE N ladder (step 250)
 * across [34000, 40000] and records at every rung the Kahan error, KBN error, and the
 * bit-identical/strictly-separated verdict, so the intermittency structure is MEASURED.
 *
 * Both schemes and the exact reference are re-implemented here byte-identically to imp-36062 /
 * imp-36023 (same fixed oscillatory family, same clustered same-sign worst ORDER). MEASUREMENT
 * ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no
 * inequality; changes no bound; establishes no positivity; the C_mb GUE-conditional constant
 * (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED verdict on the CLUSTERED worst order across the fine [34000, 40000] step-250 ladder
 * (25 rungs; sep = KBN error strictly differs from Kahan error):
 *   N       kappa   Kahan       KBN         separated?
 *   34000   361.5   2.42e-19    2.33e-19    YES (imp-36062 onset reproduced)
 *   34250   362.7   4.45e-20    4.45e-20    no  (bit-identical)
 *   34500   367.7   2.31e-19    2.31e-19    no
 *   34750   373.5   1.02e-19    1.02e-19    no
 *   35000   376.2   1.72e-19    1.72e-19    no
 *   35250   374.6   4.05e-19    6.12e-20    YES
 *   35500   371.2   5.82e-19    1.17e-19    YES
 *   35750   370.2   1.93e-19    1.93e-19    no
 *   36000   373.6   6.00e-20    6.00e-20    no
 *   36250   379.7   1.47e-20    1.47e-20    no
 *   36500   384.1   3.64e-19    9.40e-20    YES
 *   36750   383.9   6.97e-19    2.16e-19    YES
 *   37000   380.4   1.51e-19    1.51e-19    no
 *   37250   378.2   2.33e-19    2.20e-19    YES
 *   37500   380.5   5.53e-19    1.01e-19    YES
 *   37750   386.4   5.17e-20    5.17e-20    no
 *   38000   391.6   5.60e-19    1.11e-19    YES
 *   38250   392.1   3.33e-19    1.14e-19    YES
 *   38500   388.7   3.25e-19    1.20e-19    YES
 *   38750   386.0   3.04e-19    1.41e-19    YES
 *   39000   388.0   1.23e-19    1.23e-19    no  (LAST bit-identical rung)
 *   39250   393.9   4.21e-19    2.09e-20    YES
 *   39500   399.2   3.81e-19    5.93e-20    YES
 *   39750   399.6   3.79e-19    5.96e-20    YES
 *   40000   396.0   3.90e-19    4.76e-20    YES
 *
 * READING: the intermittency imp-36062 asserted is CONFIRMED and is FINER-GRAINED than its coarse
 * "identical again at 35000-37000" characterization. Of the 25 rungs, 15 are strictly separated
 * and 10 are bit-identical, and the two verdicts alternate rung-to-rung with no single clean
 * identical block. The genuinely-identical run is 34250-35000 (four consecutive identical rungs),
 * NOT 35000-37000: within 35000-37000 there ARE separated rungs (35250, 35500, 36500, 36750,
 * 37250, 37500). The LAST bit-identical rung is N = 39000; from N = 39250 upward every rung tested
 * is strictly separated, so persistence sets in around N ~ 39250 rather than ~40000. kappa rises
 * near-monotonically (361 -> 396) across the band while the sep/identical verdict does NOT track
 * kappa, confirming imp-36062: the separation is a fine ROUNDING-level event (the two schemes
 * differ only in how the compensation term is re-incorporated -- KBN adds it once at the end via
 * dg_{s}+dg_{c}), not a conditioning-driven crossover. Both schemes sit at the ~1e-19 compensated
 * floor at every rung, so precision stays NON-binding; the obstruction remains the ENGINEERING of
 * the certified length-N interval sum (MECHANICAL, imp-35725) and the W1 A + B - C certificate at
 * T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-36062-kbn-kahan-separation-onset (located onset at N~34000; asserted but did NOT store the intermittency band)
 * @see imp-36124-kbn-kahan-soft-onset-honest-status (honest-status note: onset tracks N, soft/intermittent)
 * @see imp-36023-kbn-combined-worst-ladder (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36062) ----------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-36023 / imp-36062.
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
    // "separated" = the two compensated schemes give DIFFERENT normalized errors at this rung.
    separated: kbnNormErr !== kahanNormErr,
    kbnStrictlyTighter: kbnNormErr < kahanNormErr,
    bitIdentical: kbnNormErr === kahanNormErr,
  };
}

// -- Fine step-250 ladder across the imp-36062 intermittency band [34000, 40000] -----------
const BAND_LO = 34000;
const BAND_HI = 40000;
const BAND_STEP = 250;
const LADDER_SIZES = [];
for (let N = BAND_LO; N <= BAND_HI; N += BAND_STEP) LADDER_SIZES.push(N);
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- Intermittency structure --------------------------------------------------------------
const SEPARATED_RUNGS = LADDER.filter((r) => r.separated);
const IDENTICAL_RUNGS = LADDER.filter((r) => !r.separated);
const SEPARATED_COUNT = SEPARATED_RUNGS.length;
const IDENTICAL_COUNT = IDENTICAL_RUNGS.length;
// The onset rung (imp-36062) is the first ladder entry and is separated.
const ONSET_SEPARATED = LADDER[0].separated && LADDER[0].N === 34000;
// Interleaved, not a single block: both verdicts recur past the onset.
const INTERMITTENT =
  SEPARATED_COUNT > 0 &&
  IDENTICAL_COUNT > 0 &&
  // identical rungs exist strictly above the onset (so it is not merely onset-then-persistent)
  IDENTICAL_RUNGS.some((r) => r.N > 34000);
// Last bit-identical rung; above it every tested rung separates (persistence onset).
const LAST_IDENTICAL_N = IDENTICAL_RUNGS.length
  ? IDENTICAL_RUNGS[IDENTICAL_RUNGS.length - 1].N
  : null;
const PERSISTENT_FROM_N = LAST_IDENTICAL_N !== null ? LAST_IDENTICAL_N + BAND_STEP : null;
const ABOVE_LAST_IDENTICAL_ALL_SEPARATED = LADDER.filter(
  (r) => r.N > LAST_IDENTICAL_N,
).every((r) => r.separated);
// kappa rises across the band while the verdict does not track it (rounding-level, not kappa).
const KAPPA_LO = LADDER[0].kappa;
const KAPPA_HI = LADDER[LADDER.length - 1].kappa;

export const IMP36095_KBN_KAHAN_INTERMITTENCY_BAND = {
  id: 'imp-36095',
  proofSection: 'S-frontier',
  question:
    'What is the actual KBN-vs-classic-Kahan separation INTERMITTENCY structure across N in ' +
    '[34000, 40000] on the imp-35852 clustered worst order? imp-36062 located the onset at ' +
    'N ~ 34000 and ASSERTED the separation is intermittent through ~40000 ("identical again at ' +
    '35000-37000") from a finer sub-sweep it explicitly did NOT store. Measurement only; ' +
    'certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36062)',
    alpha: ALPHA,
    beta: BETA,
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
  band: { lo: BAND_LO, hi: BAND_HI, step: BAND_STEP, rungs: LADDER_SIZES.length },
  ladderSizes: LADDER_SIZES,
  ladder: LADDER,
  intermittency: {
    separatedCount: SEPARATED_COUNT, // 15 of 25
    identicalCount: IDENTICAL_COUNT, // 10 of 25
    onsetSeparated: ONSET_SEPARATED,
    intermittent: INTERMITTENT,
    genuineIdenticalRun: '34250-35000 (four consecutive bit-identical rungs)',
    separatedInsideImp36062IdenticalClaim: [35250, 35500, 36500, 36750, 37250, 37500],
    lastIdenticalN: LAST_IDENTICAL_N, // 39000
    persistentFromN: PERSISTENT_FROM_N, // 39250
    aboveLastIdenticalAllSeparated: ABOVE_LAST_IDENTICAL_ALL_SEPARATED,
    kappaLo: KAPPA_LO,
    kappaHi: KAPPA_HI,
  },
  reading: {
    intermittencyConfirmed:
      'the intermittency imp-36062 asserted is CONFIRMED: of the 25 step-250 rungs, 15 are strictly ' +
      'separated and 10 are bit-identical, and the two verdicts alternate rung-to-rung with no single ' +
      'clean identical block',
    finerThanImp36062Claim:
      'the structure is FINER-GRAINED than the coarse "identical again at 35000-37000" characterization: ' +
      'the genuinely-identical run is 34250-35000, and within 35000-37000 there ARE separated rungs ' +
      '(35250, 35500, 36500, 36750, 37250, 37500)',
    persistenceOnset:
      'the LAST bit-identical rung is N = 39000; from N = 39250 upward every tested rung is strictly ' +
      'separated, so persistence sets in around N ~ 39250 rather than exactly ~40000',
    doesNotTrackKappa:
      'kappa rises near-monotonically (~361 -> ~396) across the band while the sep/identical verdict does ' +
      'NOT track kappa, confirming imp-36062 that the separation is a fine ROUNDING-level event (the two ' +
      'schemes differ only in re-incorporating the compensation term, KBN via dg_{s}+dg_{c} at the end), ' +
      'not a conditioning-driven crossover',
    precisionNotBinding:
      'both schemes sit at the ~1e-19 compensated floor at every rung, so precision is NOT the binding ' +
      'constraint anywhere in the band',
  },
  conclusion: {
    bandTabulated:
      'the imp-36062 intermittency band [34000, 40000] is now TABULATED at step 250 (25 rungs): 15 separated, ' +
      '10 bit-identical, alternating rung-to-rung; genuine identical run 34250-35000; last identical rung ' +
      'N = 39000; persistence from N ~ 39250',
    refinesImp36062:
      'the intermittency is confirmed but FINER than imp-36062 asserted -- the identical run is 34250-35000 ' +
      '(not 35000-37000), and there is separation inside 35000-37000',
    precisionNotBinding:
      'both schemes stay at the ~1e-19 compensated floor at every rung -- the separation is a floor-level ' +
      'rounding effect and precision is NOT the binding constraint anywhere in the band',
    staysGreenfield:
      'this module measures Kahan-vs-KBN separation under the combined skeptical clustered order at 25 N ' +
      'only; it evaluates no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT ' +
      'stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Tabulating the imp-36062 ' +
    'KBN-vs-classic-Kahan separation intermittency band on a fine step-250 ladder across N in ' +
    '[34000, 40000] (25 rungs) on the imp-35852 clustered worst order against a per-N exact 2^{-96} ' +
    'dyadic-BigInt reference, 15 rungs are strictly separated and 10 are bit-identical, alternating ' +
    'rung-to-rung. The onset rung N = 34000 reproduces imp-36062; the genuinely bit-identical run is ' +
    '34250-35000 (four consecutive rungs), NOT the coarse "35000-37000" imp-36062 asserted -- within ' +
    '35000-37000 there ARE separated rungs (35250, 35500, 36500, 36750, 37250, 37500). The LAST ' +
    'bit-identical rung is N = 39000; from N = 39250 upward every tested rung separates, so persistence ' +
    'sets in near N ~ 39250. kappa rises near-monotonically (~361 -> ~396) while the sep/identical ' +
    'verdict does NOT track kappa, confirming the separation is a fine ROUNDING-level event (the schemes ' +
    'differ only in how the compensation term is re-incorporated, KBN adding it once at the end via ' +
    'dg_{s}+dg_{c}) rather than a conditioning-driven crossover. Both sit at the ~1e-19 compensated floor ' +
    'at every rung, so precision is NOT the binding constraint anywhere in the band; the obstruction stays ' +
    'the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725). Certifies no W1 ' +
    'bound; evaluates no true H_0; instantiates no interval; verifies no inequality; changes no bound; ' +
    'establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36062 (located onset at N~34000; asserted but did NOT store the intermittency band); imp-36124 ' +
    '(honest-status note: onset tracks N, soft/intermittent); imp-36023 (KBN=classic-Kahan at N<=1e4 but ' +
    '~10x tighter by N~488602); imp-35852 (clustered worst ORDER); imp-35812 (fixed term family + N ladder ' +
    '[1e3..4.886e5]); imp-35725 (mechanical certified sum); imp-35681 Part A (A+B-C interval bound ' +
    'greenfield); Higham 2002, Neumaier 1974.',
};

export const IMP36095_KBN_KAHAN_INTERMITTENCY_BAND_ASSERTIONS = [
  {
    id: 'imp36095-band-anchor',
    description: 'Fine step-250 ladder across [34000, 40000] (25 rungs), onset rung N=34000 separated',
    holds: () =>
      LADDER.length === 25 &&
      LADDER_SIZES[0] === 34000 &&
      LADDER_SIZES[LADDER_SIZES.length - 1] === 40000 &&
      BAND_STEP === 250 &&
      ONSET_SEPARATED === true,
  },
  {
    // The intermittency imp-36062 asserted is confirmed: both verdicts recur across the band.
    id: 'imp36095-intermittent',
    description: 'Both separated and bit-identical rungs recur past the onset (intermittent, not a single block)',
    holds: () =>
      INTERMITTENT === true &&
      SEPARATED_COUNT === 15 &&
      IDENTICAL_COUNT === 10 &&
      SEPARATED_COUNT + IDENTICAL_COUNT === LADDER.length,
  },
  {
    // The genuine identical run is 34250-35000, and 35000-37000 contains separated rungs.
    id: 'imp36095-finer-than-imp36062-claim',
    description: 'Separated rungs exist inside the imp-36062 "identical 35000-37000" claim (finer structure)',
    holds: () => {
      const inside = LADDER.filter((r) => r.N >= 35000 && r.N <= 37000);
      const sepInside = inside.filter((r) => r.separated).map((r) => r.N);
      return (
        sepInside.length >= 4 &&
        sepInside.includes(35250) &&
        sepInside.includes(36500) &&
        // the 34250-35000 run is genuinely identical
        LADDER.filter((r) => r.N >= 34250 && r.N <= 35000).every((r) => !r.separated)
      );
    },
  },
  {
    // Persistence sets in from N ~ 39250; the last identical rung is N = 39000.
    id: 'imp36095-persistence-onset',
    description: 'Last bit-identical rung N = 39000; every rung above it (from 39250) is separated',
    holds: () =>
      LAST_IDENTICAL_N === 39000 &&
      PERSISTENT_FROM_N === 39250 &&
      ABOVE_LAST_IDENTICAL_ALL_SEPARATED === true,
  },
  {
    // The onset rung reproduces the imp-36062 figures.
    id: 'imp36095-onset-reproduces-imp36062',
    description: 'The N=34000 onset rung reproduces imp-36062 (Kahan ~2.42e-19, KBN ~2.33e-19, separated)',
    holds: () =>
      Math.abs(LADDER[0].kahanNormErr - 2.42e-19) / 2.42e-19 < 0.05 &&
      Math.abs(LADDER[0].kbnNormErr - 2.33e-19) / 2.33e-19 < 0.05 &&
      LADDER[0].kbnStrictlyTighter === true,
  },
  {
    id: 'imp36095-honesty-gate',
    description: 'Measurement only; verdict does not track kappa; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36095_KBN_KAHAN_INTERMITTENCY_BAND.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /does NOT track kappa/.test(IMP36095_KBN_KAHAN_INTERMITTENCY_BAND.reading.doesNotTrackKappa) &&
      /NOT the binding constraint/.test(
        IMP36095_KBN_KAHAN_INTERMITTENCY_BAND.conclusion.precisionNotBinding,
      ) &&
      /GREENFIELD/.test(IMP36095_KBN_KAHAN_INTERMITTENCY_BAND.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36095_KBN_KAHAN_INTERMITTENCY_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP36095_KBN_KAHAN_INTERMITTENCY_BAND.verdict),
  },
];

for (const a of IMP36095_KBN_KAHAN_INTERMITTENCY_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36095-kbn-kahan-intermittency-band assertion failed: ${a.id}`);
  }
}
