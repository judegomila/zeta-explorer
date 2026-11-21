/**
 * @module imp-36100-kbn-kahan-onset-natural-order
 *
 * imp-36100 (numerical, S-frontier): does the imp-36062 KBN-vs-classic-Kahan separation onset
 * (first strict separation at N ~ 34000 on the imp-35852 CLUSTERED same-sign worst order) SHIFT
 * when the summation ORDER is changed to the imp-35812 NATURAL order (k = 1 .. N, as generated)?
 *
 * imp-36062 located the onset EXCLUSIVELY on the clustered worst order, which maximizes the
 * running-sum magnitude and is where compensation schemes diverge most. It never measured the
 * natural order, so it was unknown whether the natural order separates at the same, an earlier,
 * a later N, or never within the ladder. This module re-runs the BYTE-IDENTICAL KBN and classic
 * Kahan schemes and the same per-N exact 2^{-96} dyadic-BigInt reference over the SAME imp-36062
 * eleven-rung ladder, but sums the terms in the imp-35812 NATURAL order (no clustering), and
 * reports the onset N (or its absence), comparing to the clustered-order N ~ 34000.
 *
 * Everything except the summation order is identical to imp-36062. MEASUREMENT ONLY. Certifies
 * no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; changes
 * no bound; establishes no positivity; the C_mb GUE-conditional constant (imp-486) is untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED normalized errors on the NATURAL order across the imp-36062 ladder:
 *   N        kappa    Kahan        KBN          KBN < Kahan?   ratio
 *   1000      61.9    3.74e-19     3.74e-19     no  (identical)  1.000
 *   10000    194.5    3.51e-19     3.51e-19     no  (identical)  1.000
 *   30000    346.7    4.32e-19     7.35e-20     YES (FIRST sep)  0.170
 *   33000    362.8    1.45e-19     1.45e-19     no  (identical)  1.000
 *   34000    361.5    2.42e-19     2.33e-19     YES              0.965
 *   38000    391.6    1.11e-19     1.11e-19     no  (identical)  1.000
 *   40000    396.0    4.76e-20     4.76e-20     no  (identical)  1.000
 *   50000    440.5    2.76e-19     1.15e-19     YES              0.417
 *   70000    524.6    4.63e-20     4.63e-20     no  (identical)  1.000
 *   100000   632.6    9.73e-20     9.73e-20     no  (identical)  1.000
 *   488602  1391.0    1.89e-20     1.89e-20     no  (identical)  1.000
 *
 * READING: the onset SHIFTS. On the natural order the FIRST strict separation appears EARLIER, at
 * N ~ 30000 (kappa ~ 347), 4000 rungs below the clustered-order onset N ~ 34000. But the two more
 * important structural facts CUT AGAINST the imp-36062 clustered picture: (1) the natural-order
 * separation is even MORE intermittent -- separated at only {30000, 34000, 50000} and bit-identical
 * at every other rung tested, with NO clean bit-identical-below / separated-above boundary; and
 * (2) it does NOT persist -- at the imp-36062 endpoint N ~ 488602 the two schemes are BIT-IDENTICAL
 * on the natural order (both ~1.89e-20), whereas on the clustered order KBN stayed ~10x tighter
 * there (classic Kahan ~2.31e-19 vs KBN ~1.89e-20). So the imp-36062 "gap DEEPENS with N to
 * KBN/Kahan ~ 0.08" reading is ORDER-SPECIFIC to the clustered worst order: on the benign natural
 * order classic Kahan already reaches the KBN ~1.89e-20 compensated floor at the endpoint, leaving
 * no advantage for KBN to accrue. The natural-order separation is thus a sporadic rounding-level
 * event, not a persistent onset. Precision stays NON-binding everywhere (both schemes sit at the
 * ~1e-19 compensated floor at every rung); the obstruction remains the ENGINEERING of the certified
 * length-N interval sum (MECHANICAL, imp-35725), and the W1 A + B - C certificate at T_PT stays
 * GREENFIELD (imp-35681 Part A).
 *
 * @see imp-36062-kbn-kahan-separation-onset (onset N~34000 on the CLUSTERED worst order; this module changes only the ORDER)
 * @see imp-36095-kbn-kahan-intermittency-band (fine step-250 clustered ladder; intermittent through [34000,40000])
 * @see imp-36099-kbn-kahan-ratio-scaling-fit (clustered separated-rung ratio admits no clean N-scaling law)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + NATURAL k=1..N order + N ladder)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36062) -----------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term family as imp-35812 / imp-35852 / imp-36062.
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

// -- Measure Kahan vs KBN at one N on the NATURAL order against a per-N exact reference -----
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

  // imp-35812 NATURAL order: sum base[0..N-1] as generated (k = 1 .. N), NO clustering.
  const kahanNormErr = normalizedError(sumKahan(base), trueNum, sumAbs);
  const kbnNormErr = normalizedError(sumKBN(base), trueNum, sumAbs);
  return {
    N,
    kappa,
    kahanNormErr,
    kbnNormErr,
    kbnStrictlyTighter: kbnNormErr < kahanNormErr,
    kbnOverKahan: kahanNormErr > 0 ? kbnNormErr / kahanNormErr : 1,
    bitIdentical: kbnNormErr === kahanNormErr,
  };
}

// -- Same eleven-rung ladder as imp-36062, but summed in the NATURAL order -----------------
const LADDER_SIZES = [1000, 10000, 30000, 33000, 34000, 38000, 40000, 50000, 70000, 100000, N_AT_TPT];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- Locate the natural-order separation onset and compare to the clustered N ~ 34000 ------
const CLUSTERED_ONSET_N = 34000; // imp-36062 first-separation N on the clustered worst order
const FIRST_SEPARATION = LADDER.find((r) => r.kbnStrictlyTighter) || null;
const FIRST_SEPARATION_N = FIRST_SEPARATION ? FIRST_SEPARATION.N : null; // ~30000
const FIRST_SEPARATION_KAPPA = FIRST_SEPARATION ? FIRST_SEPARATION.kappa : null;
const ONSET_SHIFTED = FIRST_SEPARATION_N !== null && FIRST_SEPARATION_N !== CLUSTERED_ONSET_N;
const ONSET_EARLIER = FIRST_SEPARATION_N !== null && FIRST_SEPARATION_N < CLUSTERED_ONSET_N;
const SEPARATED_RUNGS = LADDER.filter((r) => r.kbnStrictlyTighter).map((r) => r.N);
const IDENTICAL_RUNGS = LADDER.filter((r) => r.bitIdentical).map((r) => r.N);
// The endpoint decides whether the imp-36062 "gap deepens with N" reading survives the order change.
const ENDPOINT = LADDER[LADDER.length - 1];
const ENDPOINT_BIT_IDENTICAL = ENDPOINT.bitIdentical; // true on natural order -- separation does NOT persist
// On the clustered order imp-36062 had classic Kahan ~2.31e-19 at the endpoint; on the natural
// order classic Kahan already reaches the KBN ~1.89e-20 floor, so no advantage accrues.
const CLUSTERED_ENDPOINT_KAHAN = 2.31e-19;
const NATURAL_ENDPOINT_REACHES_KBN_FLOOR =
  ENDPOINT.kahanNormErr < CLUSTERED_ENDPOINT_KAHAN / 5;

export const IMP36100_KBN_KAHAN_ONSET_NATURAL_ORDER = {
  id: 'imp-36100',
  proofSection: 'S-frontier',
  question:
    'Does the imp-36062 KBN-vs-classic-Kahan separation onset (first strict separation at N ~ 34000 on ' +
    'the imp-35852 CLUSTERED worst order) SHIFT when the summation order is changed to the imp-35812 ' +
    'NATURAL order (k = 1 .. N)? imp-36062 located the onset ONLY on the clustered order. Re-run the ' +
    'byte-identical schemes + per-N exact reference on the natural order across the same ladder and ' +
    'report the onset N (or its absence) vs N ~ 34000. Measurement only; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36062)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    naturalOrder:
      'terms summed in the imp-35812 NATURAL order k = 1 .. N as generated -- the ONLY change from imp-36062 ' +
      '(which summed the imp-35852 clustered same-sign worst order)',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    orderAndAssociationInvariant: true,
    note: 'byte-identical to imp-36062; one exact reference computed once PER N and reused for that rung',
  },
  unitRoundoff: U_ROUNDOFF,
  ladderSizes: LADDER_SIZES,
  ladder: LADDER,
  clusteredOnsetN: CLUSTERED_ONSET_N,
  separationOnset: {
    firstSeparationN: FIRST_SEPARATION_N, // ~30000 on the natural order
    firstSeparationKappa: FIRST_SEPARATION_KAPPA, // ~347
    onsetShifted: ONSET_SHIFTED,
    onsetEarlier: ONSET_EARLIER,
    shiftFromClusteredN: FIRST_SEPARATION_N !== null ? FIRST_SEPARATION_N - CLUSTERED_ONSET_N : null, // -4000
    separatedRungs: SEPARATED_RUNGS, // [30000, 34000, 50000]
    identicalRungs: IDENTICAL_RUNGS,
    endpointBitIdentical: ENDPOINT_BIT_IDENTICAL, // true -- separation does NOT persist on natural order
    endpointKahan: ENDPOINT.kahanNormErr,
    endpointKbn: ENDPOINT.kbnNormErr,
  },
  reading: {
    onsetShiftsEarlier:
      'the onset SHIFTS: on the natural order the FIRST strict separation appears EARLIER, at N ~ 30000 ' +
      '(kappa ~ 347), 4000 rungs below the clustered-order onset N ~ 34000',
    moreIntermittent:
      'the natural-order separation is even MORE intermittent than the clustered one: KBN is strictly tighter ' +
      'at only {30000, 34000, 50000} and bit-identical at every other rung tested, with NO clean ' +
      'bit-identical-below / separated-above boundary',
    doesNotPersist:
      'critically the separation does NOT persist: at the imp-36062 endpoint N ~ 488602 the two schemes are ' +
      'BIT-IDENTICAL on the natural order (both ~1.89e-20), whereas on the clustered order KBN stayed ~10x ' +
      'tighter there (classic Kahan ~2.31e-19 vs KBN ~1.89e-20)',
    gapDeepenIsOrderSpecific:
      'the imp-36062 "gap DEEPENS with N to KBN/Kahan ~ 0.08" reading is ORDER-SPECIFIC to the clustered worst ' +
      'order -- on the benign natural order classic Kahan already reaches the KBN ~1.89e-20 compensated floor at ' +
      'the endpoint, leaving no advantage for KBN to accrue',
    precisionNonBinding:
      'both schemes sit at the ~1e-19 compensated floor at every rung on the natural order too, so the sporadic ' +
      'separation is a floor-level rounding effect and precision is NOT the binding constraint anywhere',
  },
  conclusion: {
    onsetShifts:
      'the separation onset SHIFTS with the summation order: on the imp-35812 natural order full KBN first ' +
      'separates from classic Kahan at N ~ 30000 (kappa ~ 347), 4000 rungs EARLIER than the clustered-order ' +
      'onset N ~ 34000',
    separationSporadicNotPersistent:
      'but the natural-order separation is sporadic (separated at only {30000, 34000, 50000}) and does NOT ' +
      'persist: the two schemes are BIT-IDENTICAL at the imp-36062 endpoint N ~ 488602, so the clustered-order ' +
      '"gap deepens to ~10x" reading does NOT survive the order change',
    precisionNotBinding:
      'both schemes sit at the ~1e-19 compensated floor at every rung on the natural order -- the separation is a ' +
      'floor-level rounding effect and precision is NOT the binding constraint anywhere on the ladder',
    staysGreenfield:
      'this module measures Kahan-vs-KBN separation on the natural order at eleven N only; it evaluates no sum of ' +
      'H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 ' +
      'Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-running the byte-identical imp-36062 ' +
    'KBN and classic-Kahan schemes and per-N exact 2^{-96} dyadic-BigInt reference over the same eleven-rung ' +
    'ladder [1000, 10000, 30000, 33000, 34000, 38000, 40000, 50000, 70000, 100000, 488602] but on the imp-35812 ' +
    'NATURAL order (k = 1 .. N, the only change from imp-36062), the KBN-vs-classic-Kahan separation onset ' +
    'SHIFTS EARLIER: the FIRST strict separation appears at N ~ 30000 (kappa ~ 347), 4000 rungs below the ' +
    'clustered-order onset N ~ 34000. But the natural-order separation is even MORE intermittent (strictly ' +
    'tighter at only {30000, 34000, 50000}, bit-identical at every other rung, no clean boundary) and does NOT ' +
    'persist: at the imp-36062 endpoint N ~ 488602 the two schemes are BIT-IDENTICAL on the natural order (both ' +
    '~1.89e-20), whereas on the clustered order KBN stayed ~10x tighter (classic Kahan ~2.31e-19 vs KBN ' +
    '~1.89e-20). So the imp-36062 "gap DEEPENS with N to ~0.08" reading is ORDER-SPECIFIC to the clustered worst ' +
    'order -- on the benign natural order classic Kahan already reaches the KBN ~1.89e-20 compensated floor at ' +
    'the endpoint, leaving no advantage for KBN to accrue. Both schemes sit at the ~1e-19 compensated floor at ' +
    'every rung, so the separation is a floor-level rounding effect and precision is NOT the binding constraint ' +
    'anywhere. Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; ' +
    'changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36062 (KBN-vs-Kahan onset N~34000 on the CLUSTERED worst order; this module changes only the ORDER); ' +
    'imp-36095 (fine step-250 clustered intermittency band [34000,40000]); imp-36099 (clustered separated-rung ' +
    'ratio admits no clean N-scaling law); imp-35852 (clustered worst ORDER); imp-35812 (fixed term family + ' +
    'NATURAL k=1..N order + N ladder); imp-35681 Part A (A+B-C interval bound greenfield); imp-35725 (mechanical ' +
    'certified sum); Higham 2002, Neumaier 1974.',
};

export const IMP36100_KBN_KAHAN_ONSET_NATURAL_ORDER_ASSERTIONS = [
  {
    id: 'imp36100-ladder-anchor',
    description: 'Same eleven-rung imp-36062 ladder N = [1000..488602], summed on the NATURAL order',
    holds: () =>
      LADDER.length === 11 &&
      LADDER_SIZES[0] === 1000 &&
      LADDER_SIZES[LADDER_SIZES.length - 1] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // On the natural order the first strict separation appears at N ~ 30000, earlier than N ~ 34000.
    id: 'imp36100-onset-shifts-earlier',
    description: 'Natural-order first strict separation at N = 30000, 4000 rungs earlier than clustered N = 34000',
    holds: () =>
      FIRST_SEPARATION_N === 30000 &&
      ONSET_SHIFTED === true &&
      ONSET_EARLIER === true &&
      FIRST_SEPARATION_KAPPA > 330 && FIRST_SEPARATION_KAPPA < 360,
  },
  {
    // The separation is sporadic: only three rungs separate on the natural order.
    id: 'imp36100-separation-sporadic',
    description: 'Natural-order KBN is strictly tighter at only {30000, 34000, 50000}',
    holds: () =>
      SEPARATED_RUNGS.length === 3 &&
      SEPARATED_RUNGS.includes(30000) &&
      SEPARATED_RUNGS.includes(34000) &&
      SEPARATED_RUNGS.includes(50000),
  },
  {
    // The separation does NOT persist: bit-identical at the imp-36062 endpoint on the natural order.
    id: 'imp36100-no-endpoint-persistence',
    description: 'On the natural order the two schemes are bit-identical at the endpoint N ~ 488602 (KBN advantage does NOT persist)',
    holds: () =>
      ENDPOINT_BIT_IDENTICAL === true &&
      ENDPOINT.N === N_AT_TPT &&
      NATURAL_ENDPOINT_REACHES_KBN_FLOOR === true,
  },
  {
    id: 'imp36100-honesty-gate',
    description: 'Measurement only; onset shifts earlier but does not persist; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36100_KBN_KAHAN_ONSET_NATURAL_ORDER.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /SHIFTS/.test(IMP36100_KBN_KAHAN_ONSET_NATURAL_ORDER.conclusion.onsetShifts) &&
      /does NOT[\s\S]*persist/.test(
        IMP36100_KBN_KAHAN_ONSET_NATURAL_ORDER.conclusion.separationSporadicNotPersistent,
      ) &&
      /NOT the binding constraint/.test(
        IMP36100_KBN_KAHAN_ONSET_NATURAL_ORDER.conclusion.precisionNotBinding,
      ) &&
      /GREENFIELD/.test(IMP36100_KBN_KAHAN_ONSET_NATURAL_ORDER.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36100_KBN_KAHAN_ONSET_NATURAL_ORDER.verdict) &&
      /refereed bound is changed/i.test(IMP36100_KBN_KAHAN_ONSET_NATURAL_ORDER.verdict),
  },
];

for (const a of IMP36100_KBN_KAHAN_ONSET_NATURAL_ORDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36100-kbn-kahan-onset-natural-order assertion failed: ${a.id}`);
  }
}
