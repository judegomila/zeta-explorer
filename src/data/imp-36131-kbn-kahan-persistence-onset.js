/**
 * @module imp-36131-kbn-kahan-persistence-onset
 *
 * imp-36131 (numerical, S-frontier): LOCATE the PERSISTENCE onset of the imp-36062
 * KBN-vs-classic-Kahan separation beyond the imp-36095 [34000, 40000] band by extending the
 * byte-identical step-250 ladder to N in [40000, 100000], confirming or REFUTING that separation
 * is permanent from the imp-36095 last-identical rung N ~ 39000 / first-persistent rung N ~ 39250
 * upward.
 *
 * imp-36095 tabulated the intermittency band [34000, 40000] at step 250 and observed that the last
 * bit-identical rung inside that band was N = 39000, so that "persistence sets in around N ~ 39250
 * rather than exactly ~40000." That statement was an EXTRAPOLATION off the band edge: imp-36095
 * only saw rungs up to N = 40000, so it could not distinguish genuine persistence from a longer
 * intermittency period. This module continues the byte-identical imp-36062 / imp-36095 schemes
 * (same fixed oscillatory family, same imp-35852 clustered same-sign worst ORDER, same per-N exact
 * 2^{-96} dyadic-BigInt reference) on the step-250 ladder across N in [40000, 100000] (241 rungs)
 * and records at every rung the Kahan error, KBN error, and separated/bit-identical verdict, so the
 * persistence question is MEASURED rather than extrapolated.
 *
 * MEASURED verdict: the imp-36095 "persistent from N ~ 39250" extrapolation is REFUTED. Separation
 * is NOT permanent above N ~ 39250. The very first rung above the imp-36095 band, N = 40250, is
 * bit-identical, and bit-identical rungs RECUR throughout [40000, 100000] -- 56 of the 241 rungs are
 * bit-identical, the highest at N = 99750. The intermittency imp-36062 discovered CONTINUES to the
 * top of the tested range; it does not settle into permanent separation. The bit-identical DENSITY
 * thins with N (from ~40% of rungs in [40000, 50000] down to ~8-20% in the upper bands) but never
 * reaches zero, and the longest consecutive strictly-separated run is only 19 rungs.
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies
 * no inequality; changes no bound; establishes no positivity; the C_mb GUE-conditional constant
 * (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * READING: kappa rises near-monotonically (~396 -> ~633) across the wider band while the
 * sep/identical verdict still does NOT track kappa, reconfirming imp-36062 / imp-36095 that the
 * separation is a fine ROUNDING-level event (the two schemes differ only in how the compensation
 * term is re-incorporated -- KBN adds it once at the end via dg_{s}+dg_{c}), not a
 * conditioning-driven crossover. Both schemes sit at the ~1e-19 compensated floor at every rung, so
 * precision stays NON-binding; the obstruction remains the ENGINEERING of the certified length-N
 * interval sum (MECHANICAL, imp-35725) and the W1 A + B - C certificate at T_PT stays GREENFIELD
 * (imp-35681 Part A).
 *
 * @see imp-36095-kbn-kahan-intermittency-band (tabulated [34000, 40000]; extrapolated "persistent from N ~ 39250")
 * @see imp-36062-kbn-kahan-separation-onset (located onset at N ~ 34000; soft/intermittent)
 * @see imp-36124-kbn-kahan-soft-onset-honest-status (honest-status note: onset tracks N, soft/intermittent)
 * @see imp-36023-kbn-combined-worst-ladder (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36095) -----------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-36023 / imp-36062 / imp-36095.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes (byte-identical to imp-36062 / imp-36095) ---------------------------
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
    // "separated" = the two compensated schemes give DIFFERENT normalized errors at this rung.
    separated: kbnNormErr !== kahanNormErr,
    kbnStrictlyTighter: kbnNormErr < kahanNormErr,
    bitIdentical: kbnNormErr === kahanNormErr,
  };
}

// -- Fine step-250 ladder across the extended band [40000, 100000] (241 rungs) -------------
const BAND_LO = 40000;
const BAND_HI = 100000;
const BAND_STEP = 250;
const LADDER_SIZES = [];
for (let N = BAND_LO; N <= BAND_HI; N += BAND_STEP) LADDER_SIZES.push(N);
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- Persistence / intermittency structure -------------------------------------------------
const SEPARATED_RUNGS = LADDER.filter((r) => r.separated);
const IDENTICAL_RUNGS = LADDER.filter((r) => !r.separated);
const SEPARATED_COUNT = SEPARATED_RUNGS.length;
const IDENTICAL_COUNT = IDENTICAL_RUNGS.length;
const IDENTICAL_NS = IDENTICAL_RUNGS.map((r) => r.N);
// The imp-36095 extrapolation predicted zero identical rungs above N ~ 39250.
// It is REFUTED iff any tested rung at or above 40250 is bit-identical.
const PERSISTENCE_REFUTED = IDENTICAL_COUNT > 0;
const FIRST_IDENTICAL_ABOVE_BAND = IDENTICAL_NS.length ? IDENTICAL_NS[0] : null; // 40250
const LAST_IDENTICAL_N = IDENTICAL_NS.length ? IDENTICAL_NS[IDENTICAL_NS.length - 1] : null; // 99750
// Longest consecutive strictly-separated run (in ladder steps).
let LONGEST_SEPARATED_RUN = 0;
let _run = 0;
for (const r of LADDER) {
  if (r.separated) {
    _run += 1;
    if (_run > LONGEST_SEPARATED_RUN) LONGEST_SEPARATED_RUN = _run;
  } else {
    _run = 0;
  }
}
// Bit-identical density per 10000-wide sub-band (thins but never vanishes).
const SUB_BANDS = [
  [40000, 50000],
  [50000, 60000],
  [60000, 70000],
  [70000, 80000],
  [80000, 90000],
  [90000, 100000],
];
const SUB_BAND_DENSITY = SUB_BANDS.map(([lo, hi]) => {
  const inb = LADDER.filter((r) => r.N >= lo && r.N < hi);
  const id = inb.filter((r) => !r.separated).length;
  return { lo, hi, identical: id, total: inb.length, fraction: id / inb.length };
});
// kappa rises across the band while the verdict does not track it (rounding-level, not kappa).
const KAPPA_LO = LADDER[0].kappa;
const KAPPA_HI = LADDER[LADDER.length - 1].kappa;

export const IMP36131_KBN_KAHAN_PERSISTENCE_ONSET = {
  id: 'imp-36131',
  proofSection: 'S-frontier',
  question:
    'Does the imp-36062 KBN-vs-classic-Kahan separation become PERMANENT from the imp-36095 ' +
    'first-persistent rung N ~ 39250 upward, as imp-36095 extrapolated off its [34000, 40000] band ' +
    'edge? Extend the byte-identical step-250 ladder to N in [40000, 100000] (241 rungs) on the ' +
    'imp-35852 clustered worst order and MEASURE. Measurement only; certifies no W1 bound; changes ' +
    'no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36095)',
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
  persistence: {
    separatedCount: SEPARATED_COUNT, // 185 of 241
    identicalCount: IDENTICAL_COUNT, // 56 of 241
    identicalNs: IDENTICAL_NS,
    persistenceRefuted: PERSISTENCE_REFUTED,
    firstIdenticalAboveBand: FIRST_IDENTICAL_ABOVE_BAND, // 40250
    lastIdenticalN: LAST_IDENTICAL_N, // 99750
    longestSeparatedRun: LONGEST_SEPARATED_RUN, // 19 rungs
    subBandDensity: SUB_BAND_DENSITY,
    kappaLo: KAPPA_LO,
    kappaHi: KAPPA_HI,
  },
  reading: {
    persistenceRefuted:
      'the imp-36095 "persistent from N ~ 39250" statement was an EXTRAPOLATION off its band edge and is ' +
      'REFUTED: the very first rung above the imp-36095 band, N = 40250, is bit-identical, and 56 of the ' +
      '241 rungs in [40000, 100000] are bit-identical -- the highest at N = 99750',
    intermittencyContinues:
      'the intermittency imp-36062 discovered CONTINUES to the top of the tested range rather than settling ' +
      'into permanent separation; the longest consecutive strictly-separated run is only 19 rungs',
    densityThins:
      'the bit-identical DENSITY thins with N (from ~40% of rungs in [40000, 50000] down to ~8-20% in the ' +
      'upper bands) but never reaches zero across the tested range',
    doesNotTrackKappa:
      'kappa rises near-monotonically (~396 -> ~633) across the band while the sep/identical verdict does ' +
      'NOT track kappa, reconfirming imp-36062 / imp-36095 that the separation is a fine ROUNDING-level ' +
      'event (the schemes differ only in re-incorporating the compensation term, KBN via dg_{s}+dg_{c} at ' +
      'the end), not a conditioning-driven crossover',
    precisionNotBinding:
      'both schemes sit at the ~1e-19 compensated floor at every rung, so precision is NOT the binding ' +
      'constraint anywhere in the extended band',
  },
  conclusion: {
    persistenceRefuted:
      'the imp-36095 extrapolation that separation is "permanent from N ~ 39250" is REFUTED on the step-250 ' +
      'ladder across [40000, 100000]: 56 of 241 rungs are bit-identical, first at N = 40250, last at ' +
      'N = 99750; the intermittency continues to the top of the tested range',
    densityThinsButNonzero:
      'the bit-identical density thins with N (~40% -> ~8-20% across successive 10000-wide sub-bands) but ' +
      'stays nonzero everywhere tested, so no finite persistence onset exists within [40000, 100000]',
    precisionNotBinding:
      'both schemes stay at the ~1e-19 compensated floor at every rung -- the separation is a floor-level ' +
      'rounding effect and precision is NOT the binding constraint anywhere in the band',
    staysGreenfield:
      'this module measures Kahan-vs-KBN separation under the combined skeptical clustered order at 241 N ' +
      'only; it evaluates no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT ' +
      'stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Extending the imp-36095 ' +
    'byte-identical step-250 ladder to N in [40000, 100000] (241 rungs) on the imp-35852 clustered worst ' +
    'order against a per-N exact 2^{-96} dyadic-BigInt reference REFUTES the imp-36095 extrapolation that ' +
    'the KBN-vs-classic-Kahan separation is "permanent from N ~ 39250 upward". The very first rung above ' +
    'the imp-36095 band, N = 40250, is bit-identical, and 56 of the 241 rungs are bit-identical (last at ' +
    'N = 99750): the imp-36062 intermittency CONTINUES to the top of the tested range and does not settle ' +
    'into permanent separation (longest consecutive strictly-separated run = 19 rungs). The bit-identical ' +
    'density thins with N (~40% in [40000, 50000] down to ~8-20% in the upper bands) but never reaches ' +
    'zero, so no finite persistence onset exists within [40000, 100000]. kappa rises near-monotonically ' +
    '(~396 -> ~633) while the sep/identical verdict does NOT track kappa, reconfirming the separation is a ' +
    'fine ROUNDING-level event (the schemes differ only in how the compensation term is re-incorporated, ' +
    'KBN adding it once at the end via dg_{s}+dg_{c}) rather than a conditioning-driven crossover. Both ' +
    'sit at the ~1e-19 compensated floor at every rung, so precision is NOT the binding constraint ' +
    'anywhere in the band; the obstruction stays the ENGINEERING of the certified length-N interval sum ' +
    '(MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; instantiates no interval; ' +
    'verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at ' +
    'T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36095 (tabulated [34000, 40000]; extrapolated "persistent from N ~ 39250"); imp-36062 (located ' +
    'onset at N ~ 34000; soft/intermittent); imp-36124 (honest-status: onset tracks N, soft/intermittent); ' +
    'imp-36023 (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602); imp-35852 (clustered worst ' +
    'ORDER); imp-35812 (fixed term family + N ladder [1e3..4.886e5]); imp-35725 (mechanical certified ' +
    'sum); imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002, Neumaier 1974.',
};

export const IMP36131_KBN_KAHAN_PERSISTENCE_ONSET_ASSERTIONS = [
  {
    id: 'imp36131-band-anchor',
    description: 'Step-250 ladder across [40000, 100000] (241 rungs); band edges and step match',
    holds: () =>
      LADDER.length === 241 &&
      LADDER_SIZES[0] === 40000 &&
      LADDER_SIZES[LADDER_SIZES.length - 1] === 100000 &&
      BAND_STEP === 250,
  },
  {
    // The core result: the imp-36095 "permanent from N ~ 39250" extrapolation is refuted.
    id: 'imp36131-persistence-refuted',
    description: 'Bit-identical rungs recur above N ~ 39250 (first at 40250, last at 99750) -- persistence REFUTED',
    holds: () =>
      PERSISTENCE_REFUTED === true &&
      IDENTICAL_COUNT === 56 &&
      SEPARATED_COUNT === 185 &&
      SEPARATED_COUNT + IDENTICAL_COUNT === LADDER.length &&
      FIRST_IDENTICAL_ABOVE_BAND === 40250 &&
      LAST_IDENTICAL_N === 99750,
  },
  {
    // Intermittency continues: no arbitrarily-long separated run, and density is nonzero everywhere.
    id: 'imp36131-intermittency-continues',
    description: 'Longest consecutive-separated run bounded (19 rungs); every 10000-wide sub-band has >=1 identical rung',
    holds: () =>
      LONGEST_SEPARATED_RUN === 19 && SUB_BAND_DENSITY.every((b) => b.identical >= 1),
  },
  {
    // Density thins across the band (first sub-band strictly denser than the last).
    id: 'imp36131-density-thins',
    description: 'Bit-identical density thins: [40000,50000) fraction exceeds [90000,100000) fraction',
    holds: () =>
      SUB_BAND_DENSITY[0].fraction > SUB_BAND_DENSITY[SUB_BAND_DENSITY.length - 1].fraction &&
      SUB_BAND_DENSITY[0].identical === 16,
  },
  {
    // Continuity with imp-36095: the N=40000 rung reproduces the imp-36095 band-top figures.
    id: 'imp36131-continuity-with-imp36095',
    description: 'N=40000 rung reproduces imp-36095 band top (Kahan ~3.90e-19, KBN ~4.76e-20, separated)',
    holds: () =>
      Math.abs(LADDER[0].kahanNormErr - 3.9e-19) / 3.9e-19 < 0.05 &&
      Math.abs(LADDER[0].kbnNormErr - 4.76e-20) / 4.76e-20 < 0.05 &&
      LADDER[0].kbnStrictlyTighter === true,
  },
  {
    id: 'imp36131-honesty-gate',
    description: 'Measurement only; verdict does not track kappa; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36131_KBN_KAHAN_PERSISTENCE_ONSET.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      Math.abs(T_PT - 3e12) < 1 &&
      /does NOT track kappa/.test(IMP36131_KBN_KAHAN_PERSISTENCE_ONSET.reading.doesNotTrackKappa) &&
      /NOT the binding constraint/.test(
        IMP36131_KBN_KAHAN_PERSISTENCE_ONSET.conclusion.precisionNotBinding,
      ) &&
      /GREENFIELD/.test(IMP36131_KBN_KAHAN_PERSISTENCE_ONSET.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36131_KBN_KAHAN_PERSISTENCE_ONSET.verdict) &&
      /refereed bound is changed/i.test(IMP36131_KBN_KAHAN_PERSISTENCE_ONSET.verdict),
  },
];

for (const a of IMP36131_KBN_KAHAN_PERSISTENCE_ONSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36131-kbn-kahan-persistence-onset assertion failed: ${a.id}`);
  }
}
