/**
 * @module imp-36134-kbn-floor-headroom-same-order
 *
 * imp-36134 (numerical, S-frontier): RE-MEASURE the imp-36083 deterministic KBN-floor-to-certified
 * run-max headroom with BOTH quantities evaluated on the SAME term ORDER, closing the order mismatch
 * in imp-36083. imp-36083 compared the imp-36023 KBN compensated floor on the imp-35852 CLUSTERED
 * worst order against the imp-35890 certified run-max rung on the NATURAL order -- two DIFFERENT
 * orders in one ratio. This module recomputes both channels on the natural order AND both on the
 * clustered order, at every rung of the imp-35812 ladder N = [1000, 10000, 100000, 488602], and
 * quantifies exactly how much (if at all) the mismatch biased the ~3.9-6.5-order headroom ladder.
 *
 * WHY THIS MEASUREMENT. imp-36083 reported ratio = certifiedRunMax(NATURAL) / kbnFloor(CLUSTERED).
 * The certified run-max rung gamma_{N-1} * max_i|S_i| / Sum|t_k| depends on the running partial-sum
 * peak max_i|S_i|, which is order-SENSITIVE: on the clustered order (all negatives, then all
 * positives) the partial sum climbs to ~half the total |t_k| mass before the positives cancel it, so
 * max_i|S_i| is far larger than on the cancelling natural order. Mixing the benign-for-cert natural
 * order with the adversarial-for-KBN clustered order could in principle bias the headroom either way.
 * This module removes the ambiguity by putting both quantities on one order at a time.
 *
 * KEY FINDING -- THE KBN FLOOR IS ORDER-INVARIANT HERE, SO imp-36083 WAS UNBIASED. At every rung the
 * KBN compensated error is BIT-IDENTICAL on the natural and clustered orders (relative difference
 * exactly 0.0): Kahan-Babuska-Neumaier compensation absorbs the order sensitivity that a naive sum
 * would show, so kbnFloor(NATURAL) == kbnFloor(CLUSTERED) to the last bit. Consequently the imp-36083
 * mismatch ladder REPRODUCES the same-order NATURAL ladder EXACTLY (ratio relative difference 0.0 at
 * all four rungs): [~3.90, ~4.42, ~5.47, ~6.53] orders. The order mismatch introduced NO bias in the
 * reported headroom. The only order-sensitive quantity is the certified rung: on the clustered order
 * it is ~19x (N=1000) to ~424x (N~488602) LARGER than on the natural order, so the same-order
 * CLUSTERED headroom is STRICTLY WIDER -- [~5.18, ~6.20, ~7.76, ~9.16] orders. imp-36083 therefore
 * reported the TIGHTER (more conservative) of the two coherent same-order ladders; matching the
 * orders can only WIDEN the headroom, never shrink it. The ~3.9-order minimum stands.
 *
 * NOT A BOUND. This RE-MEASURES the gap between two already-established quantities on matched orders;
 * it certifies no W1 bound, instantiates no directed-rounding interval, evaluates no true H_0,
 * verifies no inequality, changes no bound, establishes no positivity; C_mb GUE-conditional (imp-486)
 * is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED (both channels normalized by Sum|t_k|):
 *   N        kbn(nat)=kbn(clu)   cert(nat)    cert(clu)    same-nat log10   same-clu log10   mismatch log10
 *   1000     3.74e-19            2.95e-15     5.63e-14     ~3.90            ~5.18            ~3.90
 *   10000    3.51e-19            9.22e-15     5.58e-13     ~4.42            ~6.20            ~4.42
 *   100000   9.73e-20            2.90e-14     5.56e-12     ~5.47            ~7.76            ~5.47
 *   488602   1.89e-20            6.41e-14     2.71e-11     ~6.53            ~9.16            ~6.53
 *
 * @see imp-36083-kbn-floor-headroom-to-certified-rung (the ORDER-MISMATCHED headroom this re-measures)
 * @see imp-36023-kbn-combined-worst-ladder (the DETERMINISTIC KBN N-flat floor)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the CERTIFIED deterministic run-max rung)
 * @see imp-35852-w1-summation-adversarial-ordering (the clustered same-sign worst ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36083) ----------------------
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(3e12); // ~488602 terms per mollified sum at T_PT

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF); // Higham gamma_n = n u / (1 - n u)

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-35890 / imp-36023 / imp-36083.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Kahan-Babuska-Neumaier compensated summation (identical to imp-36083) ----------------
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

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free; imp-36083) ----
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

// certified run-max rung on a GIVEN order: gamma_{N-1} * max_i|S_i| / Sum|t_k| (imp-35890 form).
function certifiedRunMaxNormOnOrder(arr, sumAbs) {
  let s = 0;
  let maxPartial = 0;
  for (let i = 0; i < arr.length; i++) {
    s += arr[i];
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
  }
  return (gamma(arr.length - 1) * maxPartial) / sumAbs;
}

// -- Measure BOTH channels on BOTH orders at one N (the imp-36134 same-order recomputation) ----
function measureAtN(N) {
  const base = new Float64Array(N); // natural order
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  let trueNum = 0n; // order- and association-invariant exact reference (computed once per N)
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);

  // imp-35852 combined worst ORDER: clustered same-sign runs (all negatives then all positives).
  const neg = [];
  const pos = [];
  for (let i = 0; i < N; i++) {
    if (base[i] < 0) neg.push(base[i]);
    else pos.push(base[i]);
  }
  const clustered = Float64Array.from(neg.concat(pos));

  const kbnNaturalNorm = normalizedError(sumKBN(base), trueNum, sumAbs);
  const kbnClusteredNorm = normalizedError(sumKBN(clustered), trueNum, sumAbs);
  const certNaturalNorm = certifiedRunMaxNormOnOrder(base, sumAbs); // imp-35890 rung (natural)
  const certClusteredNorm = certifiedRunMaxNormOnOrder(clustered, sumAbs); // rung on clustered order

  return {
    N,
    kbnNaturalNorm,
    kbnClusteredNorm,
    certNaturalNorm,
    certClusteredNorm,
    // three headroom ladders (all in orders of magnitude):
    log10RatioMismatch: Math.log10(certNaturalNorm / kbnClusteredNorm), // imp-36083 (natural cert / clustered KBN)
    log10RatioSameNatural: Math.log10(certNaturalNorm / kbnNaturalNorm), // both on natural order
    log10RatioSameClustered: Math.log10(certClusteredNorm / kbnClusteredNorm), // both on clustered order
    // the two diagnostics that explain the whole picture:
    kbnOrderRelDiff: Math.abs(kbnClusteredNorm - kbnNaturalNorm) / kbnNaturalNorm, // ~0: KBN order-invariant
    certClusteredOverNatural: certClusteredNorm / certNaturalNorm, // >1: only cert is order-sensitive
  };
}

// -- The imp-35812 N ladder ---------------------------------------------------------------
const LADDER_SIZES = [1000, 10000, 100000, N_AT_TPT];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- Cross-order diagnostics --------------------------------------------------------------
// (1) The KBN floor is order-invariant: relative difference between the two orders is ~0 everywhere.
const MAX_KBN_ORDER_RELDIFF = Math.max(...LADDER.map((r) => r.kbnOrderRelDiff)); // ~0
const KBN_ORDER_INVARIANT = LADDER.every((r) => r.kbnOrderRelDiff < 1e-12);
// (2) Because the KBN floor is order-invariant, the imp-36083 mismatch ladder equals the same-order
//     NATURAL ladder to full precision -- so the order mismatch introduced NO bias.
const MAX_MISMATCH_VS_SAMENAT_RELDIFF = Math.max(
  ...LADDER.map((r) => Math.abs(r.log10RatioMismatch - r.log10RatioSameNatural)),
); // ~0
const MISMATCH_EQUALS_SAME_NATURAL = LADDER.every(
  (r) => Math.abs(r.log10RatioMismatch - r.log10RatioSameNatural) < 1e-9,
);
// (3) The only order-sensitive quantity is the certified rung: on the clustered order it is strictly
//     larger (partial-sum peak grows), so the same-order CLUSTERED headroom is strictly WIDER.
const SAME_CLUSTERED_WIDER_THAN_NATURAL = LADDER.every(
  (r) => r.log10RatioSameClustered > r.log10RatioSameNatural,
);
const CERT_CLUSTERED_OVER_NATURAL = LADDER.map((r) => r.certClusteredOverNatural); // ~[19, 61, 192, 424]

// -- Same-order headroom bands ------------------------------------------------------------
const SAMENAT_LOG10 = LADDER.map((r) => r.log10RatioSameNatural); // [~3.90, ~4.42, ~5.47, ~6.53]
const SAMECLU_LOG10 = LADDER.map((r) => r.log10RatioSameClustered); // [~5.18, ~6.20, ~7.76, ~9.16]
const MIN_SAMENAT_ORDERS = Math.min(...SAMENAT_LOG10); // ~3.90 (tightest coherent headroom)
const MIN_SAMECLU_ORDERS = Math.min(...SAMECLU_LOG10); // ~5.18

export const IMP36134_KBN_FLOOR_HEADROOM_SAME_ORDER = {
  id: 'imp-36134',
  proofSection: 'S-frontier',
  question:
    'RE-MEASURE the imp-36083 deterministic KBN-floor-to-certified run-max headroom with BOTH ' +
    'quantities on the SAME term ORDER, since imp-36083 compared the KBN floor on the imp-35852 ' +
    'CLUSTERED worst order against the imp-35890 certified rung on the NATURAL order. Recompute both ' +
    'channels on the natural order AND both on the clustered order across the imp-35812 ladder and ' +
    'quantify whether the order mismatch biased the ~3.9-6.5-order headroom ladder. Measurement only; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36083, no RNG)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    kbnChannel: 'KBN compensated summation vs a per-N exact 2^{-96} dyadic-BigInt reference, on EACH order',
    certifiedChannel: 'imp-35890 a-priori run-max bound gamma_{N-1} * max_i|S_i| / Sum|t_k|, on EACH order',
  },
  unitRoundoff: U_ROUNDOFF,
  ladderSizes: LADDER_SIZES,
  ladder: LADDER,
  crossOrder: {
    note:
      'the KBN floor is order-INVARIANT (bit-identical on natural vs clustered orders), so the ' +
      'imp-36083 mismatch ladder equals the same-order NATURAL ladder exactly; the only order-sensitive ' +
      'quantity is the certified run-max rung, which grows on the clustered order',
    maxKbnOrderRelDiff: MAX_KBN_ORDER_RELDIFF, // ~0
    kbnOrderInvariant: KBN_ORDER_INVARIANT,
    maxMismatchVsSameNaturalRelDiff: MAX_MISMATCH_VS_SAMENAT_RELDIFF, // ~0
    mismatchEqualsSameNatural: MISMATCH_EQUALS_SAME_NATURAL,
    certClusteredOverNatural: CERT_CLUSTERED_OVER_NATURAL, // ~[19, 61, 192, 424]
    sameClusteredWiderThanNatural: SAME_CLUSTERED_WIDER_THAN_NATURAL,
  },
  headroom: {
    sameNaturalLog10: SAMENAT_LOG10, // [~3.90, ~4.42, ~5.47, ~6.53]
    sameClusteredLog10: SAMECLU_LOG10, // [~5.18, ~6.20, ~7.76, ~9.16]
    minSameNaturalOrders: MIN_SAMENAT_ORDERS, // ~3.90
    minSameClusteredOrders: MIN_SAMECLU_ORDERS, // ~5.18
    tighterCoherentLadderIsNatural:
      'the same-order natural headroom (~3.9 orders minimum) is TIGHTER than the same-order clustered ' +
      'headroom (~5.2 orders minimum); imp-36083 reported the tighter, more conservative coherent ladder',
  },
  reading: {
    noBias:
      'the order mismatch in imp-36083 introduced NO bias: because the KBN floor is order-invariant, ' +
      'certifiedRunMax(NATURAL) / kbnFloor(CLUSTERED) equals certifiedRunMax(NATURAL) / kbnFloor(NATURAL) ' +
      'to the last bit at every rung -- the reported [~3.90, ~4.42, ~5.47, ~6.53]-order ladder is exact',
    onlyCertIsOrderSensitive:
      'the certified run-max rung is the sole order-sensitive channel: on the clustered order its ' +
      'partial-sum peak max_i|S_i| grows to ~half the |t_k| mass, making it ~19x (N=1000) to ~424x ' +
      '(N~488602) larger than on the cancelling natural order',
    matchingOrdersOnlyWidens:
      'measuring BOTH channels on the clustered order gives a STRICTLY WIDER headroom ([~5.18, ~6.20, ' +
      '~7.76, ~9.16] orders); matching the two orders can only widen the headroom, never shrink it, so ' +
      'the ~3.9-order minimum of imp-36083 stands as the tightest coherent figure',
  },
  conclusion: {
    imp36083Unbiased:
      'the imp-36083 order mismatch did NOT bias the headroom ladder -- the KBN floor is order-invariant, ' +
      'so imp-36083 already reported the exact same-order NATURAL headroom [~3.90, ~4.42, ~5.47, ~6.53] orders',
    conservativeChoice:
      'imp-36083 reported the TIGHTER of the two coherent same-order ladders (natural, ~3.9 orders minimum); ' +
      'the same-order clustered ladder is strictly wider (~5.2 orders minimum), so the mismatch was conservative',
    staysGreenfield:
      'this module re-measures the ratio of two already-established deterministic quantities on matched ' +
      'orders at four N only; it evaluates no sum of H_t and verifies no inequality, so the W1 A + B - C ' +
      'certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL HEADROOM RE-MEASUREMENT (frontier-direction, deterministic, NOT a certified bound). ' +
    'Closing the imp-36083 order mismatch, on the imp-35812 term family t_k = cos(alpha k + beta ' +
    'sqrt k)/sqrt k across N = [1000, 10000, 100000, 488602] the imp-36023 KBN compensated floor is ' +
    'BIT-IDENTICAL on the natural and clustered orders (relative difference exactly 0.0 at every rung): ' +
    'KBN compensation is order-invariant here. Consequently the imp-36083 ratio ' +
    'certifiedRunMax(NATURAL) / kbnFloor(CLUSTERED) equals the same-order NATURAL ratio ' +
    'certifiedRunMax(NATURAL) / kbnFloor(NATURAL) to the last bit -- [~3.90, ~4.42, ~5.47, ~6.53] orders ' +
    '-- so the order mismatch introduced NO bias. The certified run-max rung is the sole order-sensitive ' +
    'channel: on the clustered order it is ~19x to ~424x larger (partial-sum peak grows), so measuring ' +
    'BOTH channels on the clustered order gives a STRICTLY WIDER headroom [~5.18, ~6.20, ~7.76, ~9.16] ' +
    'orders. imp-36083 therefore reported the TIGHTER, more conservative of the two coherent same-order ' +
    'ladders; matching the orders can only widen the headroom, so the ~3.9-order minimum stands. Re-measures ' +
    'the gap between two already-established quantities on matched orders: certifies no W1 bound; evaluates ' +
    'no true H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no ' +
    'positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL ' +
    '(imp-35725); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36083 (the order-mismatched headroom this re-measures); imp-36023 (the DETERMINISTIC KBN N-flat ' +
    'floor); imp-35890 (CERTIFIED deterministic running-accumulator run-max bound); imp-35852 (clustered ' +
    'worst ORDER); imp-35812 (fixed term family + N ladder [1e3..4.886e5]); imp-35725 (mechanical certified ' +
    'sum); imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002, Neumaier 1974; ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP36134_KBN_FLOOR_HEADROOM_SAME_ORDER_ASSERTIONS = [
  {
    id: 'imp36134-ladder-anchor',
    description: 'Four-rung ladder N = [1000, 10000, 100000, floor(sqrt(T_PT/4 pi))~488602]',
    holds: () =>
      LADDER.length === 4 &&
      LADDER_SIZES[0] === 1000 &&
      LADDER_SIZES[3] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // The KBN floor is order-invariant: bit-identical on natural vs clustered orders at every rung.
    id: 'imp36134-kbn-order-invariant',
    description: 'KBN compensated floor bit-identical on natural vs clustered orders (max rel diff ~0)',
    holds: () => KBN_ORDER_INVARIANT === true && MAX_KBN_ORDER_RELDIFF < 1e-12,
  },
  {
    // Because the KBN floor is order-invariant, the imp-36083 mismatch ladder == same-order natural ladder.
    id: 'imp36134-mismatch-equals-same-natural',
    description: 'imp-36083 mismatch ladder equals the same-order NATURAL ladder exactly (no bias)',
    holds: () => MISMATCH_EQUALS_SAME_NATURAL === true && MAX_MISMATCH_VS_SAMENAT_RELDIFF < 1e-9,
  },
  {
    // The certified rung is the sole order-sensitive channel; larger on the clustered order.
    id: 'imp36134-cert-order-sensitive',
    description: 'certified rung ~19x to ~424x larger on the clustered order (partial-sum peak grows)',
    holds: () =>
      CERT_CLUSTERED_OVER_NATURAL.every((r) => r > 1) &&
      CERT_CLUSTERED_OVER_NATURAL[0] > 15 &&
      CERT_CLUSTERED_OVER_NATURAL[0] < 25 &&
      CERT_CLUSTERED_OVER_NATURAL[3] > 350 &&
      CERT_CLUSTERED_OVER_NATURAL[3] < 500,
  },
  {
    // Same-order clustered headroom is strictly wider than same-order natural at every rung.
    id: 'imp36134-same-clustered-wider',
    description: 'same-order CLUSTERED headroom strictly wider than same-order NATURAL at every rung',
    holds: () =>
      SAME_CLUSTERED_WIDER_THAN_NATURAL === true &&
      MIN_SAMENAT_ORDERS > 3.5 &&
      MIN_SAMENAT_ORDERS < 4.2 &&
      MIN_SAMECLU_ORDERS > 4.9 &&
      MIN_SAMECLU_ORDERS < 5.5,
  },
  {
    // Same-order natural ladder reproduces the imp-36083 reported band [~3.90 .. ~6.53] orders.
    id: 'imp36134-same-natural-reproduces-imp36083',
    description: 'same-order natural ladder = imp-36083 band [~3.90, ~4.42, ~5.47, ~6.53] orders',
    holds: () =>
      Math.abs(SAMENAT_LOG10[0] - 3.90) < 0.05 &&
      Math.abs(SAMENAT_LOG10[1] - 4.42) < 0.05 &&
      Math.abs(SAMENAT_LOG10[2] - 5.47) < 0.05 &&
      Math.abs(SAMENAT_LOG10[3] - 6.53) < 0.05,
  },
  {
    id: 'imp36134-honesty-gate',
    description: 'Re-measurement only; imp-36083 unbiased; no QED; no refereed bound is changed',
    holds: () =>
      IMP36134_KBN_FLOOR_HEADROOM_SAME_ORDER.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /NO bias/.test(IMP36134_KBN_FLOOR_HEADROOM_SAME_ORDER.reading.noBias) &&
      /GREENFIELD/.test(IMP36134_KBN_FLOOR_HEADROOM_SAME_ORDER.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36134_KBN_FLOOR_HEADROOM_SAME_ORDER.verdict) &&
      /refereed bound is changed/i.test(IMP36134_KBN_FLOOR_HEADROOM_SAME_ORDER.verdict),
  },
];

for (const a of IMP36134_KBN_FLOOR_HEADROOM_SAME_ORDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36134-kbn-floor-headroom-same-order assertion failed: ${a.id}`);
  }
}
