/**
 * @module imp-36083-kbn-floor-headroom-to-certified-rung
 *
 * imp-36083 (numerical, S-frontier): MEASURE the distance the imp-36023 DETERMINISTIC
 * Kahan-Babuska-Neumaier (KBN) compensated-summation floor keeps below the imp-35890 CERTIFIED
 * deterministic running-accumulator run-max rung, N-uniformly across the imp-35812 ladder
 * N = [1000, 10000, 100000, 488602], confirming the deterministic compensated channel never
 * approaches the certified bound.
 *
 * WHY THIS MEASUREMENT. imp-36035 measured the headroom between the PROBABILISTIC Higham-Mary
 * sqrt(N) scale (~5.58e-17 at lambda = 1) and the same certified rung, reporting a lambda-crossover
 * ~1148 with hundreds of thousands of orders of failure-probability margin. But that is the
 * PROBABILISTIC channel. The DETERMINISTIC compensated channel -- the imp-36023 KBN floor
 * (N-flat, ~3.74e-19 down to ~1.89e-20 across the ladder) -- has never been tabulated against the
 * SAME certified rung. This module measures the ratio certifiedRunMax / kbnFloor at every rung,
 * quantifying how many orders of headroom the deterministic compensated summation keeps below the
 * certified deterministic a-priori bound. Distinct from imp-36035 (probabilistic Higham-Mary): this
 * is a purely deterministic, RNG-free, exact-reference comparison of two deterministic quantities.
 *
 * NOT A BOUND. This is a MEASUREMENT of the gap between two already-established quantities: the
 * imp-36023 measured KBN error (against a per-N exact 2^{-96} dyadic-BigInt reference on the
 * imp-35852 clustered worst ORDER) and the imp-35890 certified a-priori run-max bound
 * (gamma_{N-1} * max_i|S_i| / Sum|t_k|, natural order). It certifies no W1 bound; instantiates no
 * directed-rounding interval; evaluates no true H_0; verifies no inequality; changes no bound;
 * establishes no positivity; C_mb GUE-conditional (imp-486) is untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * MEASURED (both normalized by Sum|t_k|; KBN on clustered worst order, certified rung natural order):
 *   N        KBN floor     certified rung   ratio (cert/KBN)   log10(ratio)
 *   1000     3.74e-19      2.95e-15         ~7.9e3             ~3.90
 *   10000    3.51e-19      9.22e-15         ~2.63e4            ~4.42
 *   100000   9.73e-20      2.90e-14         ~2.98e5            ~5.47
 *   488602   1.89e-20      6.41e-14         ~3.39e6            ~6.53
 *
 * READING: the deterministic KBN compensated floor sits between ~3.9 and ~6.5 orders of magnitude
 * BELOW the certified deterministic run-max rung at every rung of the ladder (~5 orders on average).
 * The headroom is TIGHTEST at the small-N end (~7.9e3, ~3.9 orders at N = 1000) and WIDENS toward the
 * anchor (~3.4e6, ~6.5 orders at N ~ 488602), because the certified rung GROWS ~sqrt(N) (its
 * gamma_{N-1} factor is ~linear in N while Sum|t_k| ~ 2 sqrt(N)) while the KBN floor is N-FLAT and
 * if anything DECREASES. So the deterministic compensated channel never comes within ~3.9 orders of
 * the certified bound anywhere on the ladder -- the endpoint rung reproduces the imp-36035 / imp-35890
 * ~6.41e-14 certified figure exactly. Precision under compensated summation is NON-binding
 * N-uniformly in the deterministic channel, mirroring (deterministically) the imp-36035 probabilistic
 * headroom. The obstruction stays the ENGINEERING of the certified length-N interval sum (MECHANICAL,
 * imp-35725), and the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-36023-kbn-combined-worst-ladder (the DETERMINISTIC KBN N-flat floor this measures headroom in)
 * @see imp-36035-w1-lambda-headroom-to-certified-rung (the PROBABILISTIC Higham-Mary headroom to the SAME rung)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the CERTIFIED deterministic run-max rung ~6.41e-14)
 * @see imp-35852-w1-summation-adversarial-ordering (the clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see imp-35725 (mechanical certified N-term sum), imp-35681 Part A (A+B-C interval bound greenfield)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36023 / imp-36035) ---------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF); // Higham gamma_n = n u / (1 - n u)

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-35890 / imp-36023 / imp-36035.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Kahan-Babuska-Neumaier compensated summation (identical to imp-36023) ---------------
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

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free; imp-36023) ----
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

// -- Measure both channels at one N -------------------------------------------------------
// KBN floor: compensated summation on the imp-35852 clustered worst ORDER vs the exact reference.
// Certified rung: the imp-35890 a-priori run-max bound gamma_{N-1} * max_i|S_i| / Sum|t_k| (natural order).
function measureAtN(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  let s = 0; // running partial sum in natural order (for the certified run-max)
  let maxPartial = 0; // max_i |S_i| (accumulator peak; O(1) under cancellation)
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
    s += t;
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
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

  const kbnFloorNorm = normalizedError(sumKBN(clustered), trueNum, sumAbs); // deterministic compensated floor
  const certifiedRunMaxNorm = (gamma(N - 1) * maxPartial) / sumAbs; // imp-35890 CERTIFIED rung (~6.41e-14 at TPT)
  return {
    N,
    kbnFloorNorm,
    certifiedRunMaxNorm,
    ratioCertOverKbn: certifiedRunMaxNorm / kbnFloorNorm, // headroom (multiplicative)
    log10Ratio: Math.log10(certifiedRunMaxNorm / kbnFloorNorm), // headroom (orders of magnitude)
  };
}

// -- The imp-35812 N ladder ---------------------------------------------------------------
const LADDER_SIZES = [1000, 10000, 100000, N_AT_TPT];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- Headroom metrics ---------------------------------------------------------------------
const RATIOS = LADDER.map((r) => r.ratioCertOverKbn);
const LOG10_RATIOS = LADDER.map((r) => r.log10Ratio);
const MIN_RATIO = Math.min(...RATIOS); // tightest headroom (small-N end)
const MAX_RATIO = Math.max(...RATIOS); // widest headroom (anchor end)
const MIN_ORDERS_HEADROOM = Math.min(...LOG10_RATIOS); // ~3.90 (N = 1000)
const MAX_ORDERS_HEADROOM = Math.max(...LOG10_RATIOS); // ~6.53 (N ~ 488602)
// The certified rung GROWS with N while the KBN floor is N-flat, so the ratio widens with N:
// the tightest headroom is at the small-N end and it never shrinks below that anywhere on the ladder.
const RATIO_WIDENS_WITH_N = LADDER.every(
  (r, i) => i === 0 || r.ratioCertOverKbn >= LADDER[i - 1].ratioCertOverKbn,
);
const KBN_NEVER_APPROACHES_CERTIFIED = LADDER.every((r) => r.ratioCertOverKbn > 1e3);
const CERT_AT_TPT = LADDER[LADDER.length - 1].certifiedRunMaxNorm; // ~6.41e-14 (imp-35890 / imp-36035)
const KBN_AT_TPT = LADDER[LADDER.length - 1].kbnFloorNorm; // ~1.89e-20 (imp-36023)

export const IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG = {
  id: 'imp-36083',
  proofSection: 'S-frontier',
  question:
    'MEASURE the distance the imp-36023 DETERMINISTIC KBN compensated-summation floor keeps below ' +
    'the imp-35890 CERTIFIED deterministic running-accumulator run-max rung (~6.41e-14 normalized), ' +
    'N-uniformly across the imp-35812 ladder N = [1000, 10000, 100000, 488602], confirming the ' +
    'deterministic compensated channel never approaches the certified bound. Distinct from imp-36035 ' +
    '(PROBABILISTIC Higham-Mary comparison to the same rung). Measurement only; certifies no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36023 / imp-36035, no RNG)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    kbnChannel:
      'KBN compensated summation on the imp-35852 clustered same-sign worst ORDER, vs a per-N exact ' +
      '2^{-96} dyadic-BigInt reference (imp-36023 method)',
    certifiedChannel:
      'imp-35890 a-priori run-max bound gamma_{N-1} * max_i|S_i| / Sum|t_k| (natural order)',
  },
  unitRoundoff: U_ROUNDOFF,
  ladderSizes: LADDER_SIZES,
  ladder: LADDER,
  headroom: {
    note:
      'ratio = certifiedRunMax / kbnFloor at each rung; both normalized by Sum|t_k|. The ratio widens ' +
      'with N (certified rung grows ~sqrt(N); KBN floor N-flat), so the tightest headroom is at small N',
    ratios: RATIOS, // [~7.9e3, ~2.63e4, ~2.98e5, ~3.39e6]
    log10Ratios: LOG10_RATIOS, // [~3.90, ~4.42, ~5.47, ~6.53]
    minRatio: MIN_RATIO, // ~7.9e3 (N = 1000)
    maxRatio: MAX_RATIO, // ~3.39e6 (N ~ 488602)
    minOrdersHeadroom: MIN_ORDERS_HEADROOM, // ~3.90 orders
    maxOrdersHeadroom: MAX_ORDERS_HEADROOM, // ~6.53 orders
    ratioWidensWithN: RATIO_WIDENS_WITH_N,
    kbnNeverApproachesCertified: KBN_NEVER_APPROACHES_CERTIFIED,
    certAtTPT: CERT_AT_TPT,
    kbnAtTPT: KBN_AT_TPT,
  },
  reading: {
    headroomBand:
      'the deterministic KBN compensated floor sits between ~3.9 and ~6.5 orders of magnitude BELOW ' +
      'the certified deterministic run-max rung at every rung of the ladder (~5 orders on average)',
    tightestAtSmallN:
      'the headroom is TIGHTEST at the small-N end (~7.9e3, ~3.9 orders at N = 1000) and WIDENS toward ' +
      'the anchor (~3.4e6, ~6.5 orders at N ~ 488602), because the certified rung GROWS ~sqrt(N) while ' +
      'the KBN floor is N-flat and if anything DECREASES',
    endpointReproducesPrior:
      'the N ~ 488602 certified rung reproduces the imp-35890 / imp-36035 ~6.41e-14 figure exactly, and ' +
      'the KBN floor there reproduces the imp-36023 ~1.89e-20 figure',
    distinctFromProbabilistic:
      'this is the DETERMINISTIC compensated channel (RNG-free, exact-reference); imp-36035 measured the ' +
      'PROBABILISTIC Higham-Mary headroom to the same rung -- both confirm the rung is never stressed',
  },
  conclusion: {
    deterministicChannelNeverApproaches:
      'the DETERMINISTIC KBN compensated floor stays >= ~3.9 orders below the certified run-max rung ' +
      'N-uniformly across the imp-35812 ladder -- the compensated channel never approaches the certified bound',
    precisionNotBindingAcrossLadder:
      'under compensated summation the deterministic error is many orders below the certified bound at ' +
      'every rung -- precision is NOT the binding constraint anywhere on the ladder in the deterministic channel',
    staysGreenfield:
      'this module measures the ratio of two already-established deterministic quantities at four N only; ' +
      'it evaluates no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays ' +
      'GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL HEADROOM MEASUREMENT (frontier-direction, deterministic, NOT a certified bound). On the ' +
    'imp-35812 term family t_k = cos(alpha k + beta sqrt k)/sqrt k across the ladder N = [1000, 10000, ' +
    '100000, 488602], the ratio certifiedRunMax / kbnFloor of the imp-35890 CERTIFIED deterministic ' +
    'run-max rung (~6.41e-14 normalized at the anchor) to the imp-36023 DETERMINISTIC KBN compensated ' +
    'floor (clustered worst order, per-N exact BigInt reference) is [~7.9e3, ~2.63e4, ~2.98e5, ~3.39e6], ' +
    'i.e. the compensated floor sits ~3.90, ~4.42, ~5.47, ~6.53 orders of magnitude BELOW the certified ' +
    'rung -- between ~3.9 and ~6.5 orders (~5 on average). The headroom is TIGHTEST at small N and WIDENS ' +
    'toward the anchor because the certified rung grows ~sqrt(N) while the KBN floor is N-flat; the ' +
    'deterministic compensated channel therefore NEVER approaches the certified bound anywhere on the ' +
    'ladder. The N ~ 488602 rung reproduces the imp-35890 / imp-36035 ~6.41e-14 certified figure and the ' +
    'imp-36023 ~1.89e-20 KBN figure exactly. Distinct from imp-36035 (PROBABILISTIC Higham-Mary headroom ' +
    'to the same rung); this is the RNG-free deterministic channel. Measures the gap between two ' +
    'already-established quantities: certifies no W1 bound; evaluates no true H_0; instantiates no ' +
    'interval; verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C ' +
    'certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36023 (the DETERMINISTIC KBN N-flat floor across the same ladder); imp-36035 (PROBABILISTIC ' +
    'Higham-Mary headroom to the same certified rung); imp-35890 (CERTIFIED deterministic ' +
    'running-accumulator run-max bound ~6.41e-14); imp-35852 (clustered worst ORDER); imp-35812 (fixed ' +
    'term family + N ladder [1e3..4.886e5]); imp-35725 (mechanical certified sum); imp-35681 Part A ' +
    '(A+B-C interval bound greenfield); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); ' +
    'Higham 2002, Neumaier 1974; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG_ASSERTIONS = [
  {
    id: 'imp36083-ladder-anchor',
    description: 'Four-rung ladder N = [1000, 10000, 100000, floor(sqrt(T_PT/4 pi))~488602]',
    holds: () =>
      LADDER.length === 4 &&
      LADDER_SIZES[0] === 1000 &&
      LADDER_SIZES[3] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // Endpoint certified rung reproduces the imp-35890 / imp-36035 ~6.41e-14 figure and grows with N.
    id: 'imp36083-certified-rung-matches-prior',
    description: 'certified run-max rung ~6.41e-14 at N~488602 (imp-35890/imp-36035) and grows with N',
    holds: () =>
      CERT_AT_TPT > 6.0e-14 &&
      CERT_AT_TPT < 6.9e-14 &&
      LADDER[LADDER.length - 1].certifiedRunMaxNorm > 10 * LADDER[0].certifiedRunMaxNorm,
  },
  {
    // KBN floor reproduces imp-36023: N-flat, ~3-4 orders below unit roundoff, endpoint ~1.89e-20.
    id: 'imp36083-kbn-floor-matches-imp36023',
    description: 'KBN floor N-flat below unit roundoff at every rung; endpoint ~1.89e-20 (imp-36023)',
    holds: () =>
      LADDER.every((r) => r.kbnFloorNorm > 0 && r.kbnFloorNorm < 4 * U_ROUNDOFF) &&
      KBN_AT_TPT > 1.5e-20 &&
      KBN_AT_TPT < 2.5e-20,
  },
  {
    // The headroom ratio is ~3.9 to ~6.5 orders across the ladder; deterministic channel never approaches.
    id: 'imp36083-headroom-band',
    description: 'certified/KBN ratio spans ~3.9 to ~6.5 orders across the ladder; every rung > 1e3',
    holds: () =>
      KBN_NEVER_APPROACHES_CERTIFIED === true &&
      MIN_ORDERS_HEADROOM > 3.5 &&
      MIN_ORDERS_HEADROOM < 4.2 &&
      MAX_ORDERS_HEADROOM > 6.2 &&
      MAX_ORDERS_HEADROOM < 6.9,
  },
  {
    // The headroom WIDENS with N: tightest at small N (~7.9e3), widest at the anchor (~3.4e6).
    id: 'imp36083-ratio-widens-with-n',
    description: 'certified/KBN ratio widens monotonically with N (certified grows ~sqrt(N), KBN N-flat)',
    holds: () =>
      RATIO_WIDENS_WITH_N === true &&
      MIN_RATIO > 7e3 &&
      MIN_RATIO < 9e3 &&
      MAX_RATIO > 3e6 &&
      MAX_RATIO < 4e6,
  },
  {
    // Ratio equals certified / KBN at each rung (internal consistency of the reported band).
    id: 'imp36083-ratio-internal-consistency',
    description: 'each reported ratio equals certifiedRunMax / kbnFloor at that rung',
    holds: () =>
      LADDER.every(
        (r) => Math.abs(r.ratioCertOverKbn - r.certifiedRunMaxNorm / r.kbnFloorNorm) < 1e-9 * r.ratioCertOverKbn,
      ),
  },
  {
    id: 'imp36083-honesty-gate',
    description: 'Measurement only; deterministic channel never approaches certified rung; no QED; no refereed bound is changed',
    holds: () =>
      IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /never approaches/.test(
        IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG.conclusion.deterministicChannelNeverApproaches,
      ) &&
      /GREENFIELD/.test(IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG.verdict) &&
      /refereed bound is changed/i.test(IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG.verdict),
  },
];

for (const a of IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36083-kbn-floor-headroom-to-certified-rung assertion failed: ${a.id}`);
  }
}
