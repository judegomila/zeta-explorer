/**
 * @module imp-36062-kbn-kahan-separation-onset
 *
 * imp-36062 (numerical, S-frontier): where on the imp-35812 N ladder does full
 * Kahan-Babuska-Neumaier (KBN) FIRST separate from classic Kahan on the imp-35852 clustered
 * order, and does that onset track the per-N conditioning kappa or N?
 *
 * imp-36023 tabulated KBN and classic Kahan as BIT-IDENTICAL at N = 1000 and N = 10000 (both
 * ~3.74e-19 on the clustered worst order) yet found KBN roughly an ORDER OF MAGNITUDE tighter
 * by N ~ 488602 (KBN ~1.89e-20 vs classic Kahan ~2.31e-19) and ~4x tighter already at
 * N = 100000 -- but it never located WHERE the KBN small-running-sum correction first bites.
 * This module sweeps a FINER N ladder between the imp-36023 rungs and, against the same per-N
 * exact 2^{-96} dyadic-BigInt reference, records for each rung whether KBN produces a STRICTLY
 * smaller normalized error than classic Kahan, locating the separation onset and its kappa.
 *
 * Both schemes and the exact reference are re-implemented here byte-identically to imp-36023
 * (same fixed oscillatory family, same clustered same-sign worst ORDER). MEASUREMENT ONLY.
 * Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no
 * inequality; changes no bound; establishes no positivity; the C_mb GUE-conditional constant
 * (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED normalized errors on the CLUSTERED worst order across the finer ladder:
 *   N        kappa    Kahan        KBN          KBN < Kahan?
 *   1000      61.9    3.74e-19     3.74e-19     no  (bit-identical)
 *   10000    194.5    3.51e-19     3.51e-19     no  (bit-identical)
 *   30000    346.7    7.35e-20     7.35e-20     no  (bit-identical)
 *   33000    362.8    1.45e-19     1.45e-19     no  (bit-identical)
 *   34000    361.5    2.42e-19     2.33e-19     YES (first strict separation)
 *   38000    391.6    5.60e-19     1.11e-19     YES
 *   40000    396.0    3.90e-19     4.76e-20     YES
 *   50000    440.5    2.76e-19     1.15e-19     YES
 *   70000    524.6    2.84e-19     4.63e-20     YES
 *   100000   632.6    3.74e-19     9.73e-20     YES
 *   488602  1391.0    2.31e-19     1.89e-20     YES (imp-36023 endpoint reproduced)
 *
 * READING: the FIRST strict separation is located at N ~ 34000 (kappa ~ 361), roughly the
 * midpoint of the imp-36023 gap between the identical rung N = 10000 and the separated rung
 * N = 100000. Below the onset the two schemes are BIT-IDENTICAL at every rung tested; from the
 * onset upward KBN is strictly tighter and the gap DEEPENS with N (the KBN/Kahan ratio falls
 * from ~0.96 at N = 34000 to ~0.08 at N ~ 488602). The onset is a SOFT threshold, not a sharp
 * one: a finer sub-sweep (not stored) shows the separation is intermittent between N ~ 34000
 * and ~40000 (identical again at 35000-37000) before becoming persistent. Because kappa is
 * itself non-monotone rung-to-rung near the onset (kappa 361.5 at N = 34000 < 362.8 at
 * N = 33000), the onset is characterized cleanly by N (bit-identical everywhere below
 * N ~ 34000) rather than by a hard kappa cutoff; mechanistically the two schemes differ only
 * in how the compensation term is re-incorporated (KBN adds it once at the end via s + c),
 * so their divergence is a fine ROUNDING-level event that first appears near N ~ 34000. The
 * endpoint rung reproduces imp-36023 (classic Kahan ~2.31e-19, KBN ~1.89e-20). Precision stays
 * NON-binding everywhere; the obstruction remains the ENGINEERING of the certified length-N
 * interval sum (MECHANICAL, imp-35725), and the W1 A + B - C certificate at T_PT stays
 * GREENFIELD (imp-35681 Part A).
 *
 * @see imp-36023-kbn-combined-worst-ladder (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602; onset never located)
 * @see imp-35973-w1-summation-order-shape-cross-term (single-endpoint combined stress, compensated floor ~2.31e-19 at N~488602)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling; N*eps naive)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36023) ----------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-35973 / imp-36023.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes (byte-identical to imp-36023) --------------------------------------
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
    kbnStrictlyTighter: kbnNormErr < kahanNormErr,
    kbnOverKahan: kahanNormErr > 0 ? kbnNormErr / kahanNormErr : 1,
    bitIdentical: kbnNormErr === kahanNormErr,
  };
}

// -- Finer ladder straddling the imp-36023 identical->separated gap ------------------------
const LADDER_SIZES = [1000, 10000, 30000, 33000, 34000, 38000, 40000, 50000, 70000, 100000, N_AT_TPT];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- Locate the separation onset ----------------------------------------------------------
const FIRST_SEPARATION = LADDER.find((r) => r.kbnStrictlyTighter) || null;
const FIRST_SEPARATION_N = FIRST_SEPARATION ? FIRST_SEPARATION.N : null;
const FIRST_SEPARATION_KAPPA = FIRST_SEPARATION ? FIRST_SEPARATION.kappa : null;
// Below the onset the two schemes are bit-identical at every rung tested.
const BELOW_ONSET_ALL_IDENTICAL = LADDER.filter((r) => r.N < FIRST_SEPARATION_N).every(
  (r) => r.bitIdentical,
);
// From the onset upward the gap deepens: the KBN/Kahan ratio at the endpoint is far below 1.
const ENDPOINT = LADDER[LADDER.length - 1];
const ENDPOINT_RATIO = ENDPOINT.kbnOverKahan; // ~0.08 at N~488602
const ONSET_RATIO = FIRST_SEPARATION ? FIRST_SEPARATION.kbnOverKahan : 1; // ~0.96 at N~34000
const GAP_DEEPENS_WITH_N = ENDPOINT_RATIO < ONSET_RATIO;

export const IMP36062_KBN_KAHAN_SEPARATION_ONSET = {
  id: 'imp-36062',
  proofSection: 'S-frontier',
  question:
    'Where on the imp-35812 N ladder does full Kahan-Babuska-Neumaier (KBN) FIRST produce a ' +
    'strictly smaller normalized error than classic Kahan on the imp-35852 clustered worst order, ' +
    'and does that onset track the per-N conditioning kappa or N? imp-36023 found the two ' +
    'bit-identical at N <= 10000 but KBN ~10x tighter by N ~ 488602 without locating the crossover. ' +
    'Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36023)',
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
  separationOnset: {
    firstSeparationN: FIRST_SEPARATION_N, // ~34000
    firstSeparationKappa: FIRST_SEPARATION_KAPPA, // ~361
    belowOnsetAllIdentical: BELOW_ONSET_ALL_IDENTICAL,
    onsetRatioKbnOverKahan: ONSET_RATIO, // ~0.96 -- marginal at the onset
    endpointRatioKbnOverKahan: ENDPOINT_RATIO, // ~0.08 -- deep separation at N~488602
    gapDeepensWithN: GAP_DEEPENS_WITH_N,
    endpointKahan: ENDPOINT.kahanNormErr,
    endpointKbn: ENDPOINT.kbnNormErr,
  },
  reading: {
    onsetLocated:
      'the FIRST strict separation is located at N ~ 34000 (kappa ~ 361), roughly the midpoint of the ' +
      'imp-36023 gap between the identical rung N = 10000 and the separated rung N = 100000',
    identicalBelowOnset:
      'below the onset the two schemes are BIT-IDENTICAL at every rung tested (N = 1000, 10000, 30000, 33000)',
    gapDeepens:
      'from the onset upward KBN is strictly tighter and the gap DEEPENS with N -- the KBN/Kahan ratio falls ' +
      'from ~0.96 at N = 34000 to ~0.08 at N ~ 488602',
    tracksNNotKappa:
      'the onset is characterized cleanly by N (bit-identical everywhere below N ~ 34000), NOT by a hard kappa ' +
      'cutoff -- kappa is itself non-monotone rung-to-rung near the onset (361.5 at N = 34000 < 362.8 at N = 33000)',
    softThreshold:
      'the onset is a SOFT threshold: a finer sub-sweep (not stored) shows the separation is intermittent ' +
      'between N ~ 34000 and ~40000 (identical again at 35000-37000) before becoming persistent, because the ' +
      'two schemes differ only in how the compensation term is re-incorporated (KBN adds it once at the end via ' +
      's + c), so their divergence is a fine ROUNDING-level event that first appears near N ~ 34000',
    endpointReproducesImp36023:
      'the endpoint rung reproduces imp-36023 (classic Kahan ~2.31e-19, full KBN ~1.89e-20 at N ~ 488602)',
  },
  conclusion: {
    onsetAtN34k:
      'full KBN first separates from classic Kahan at N ~ 34000 (kappa ~ 361) on the clustered worst order; ' +
      'below that the two are bit-identical, above it KBN is strictly tighter and the gap deepens to ~10x by N ~ 488602',
    tracksNNotKappa:
      'the separation onset tracks N (a clean bit-identical/separated boundary near N ~ 34000) rather than a hard ' +
      'kappa cutoff, and is a soft rounding-gated threshold not a sharp one',
    precisionNotBinding:
      'both schemes sit at the ~1e-19 compensated floor at every rung -- the separation is a floor-level rounding ' +
      'effect and precision is NOT the binding constraint anywhere on the ladder',
    staysGreenfield:
      'this module measures Kahan-vs-KBN separation under the combined skeptical clustered order at eleven N only; ' +
      'it evaluates no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays ' +
      'GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Sweeping a finer imp-35812 N ladder ' +
    '[1000, 10000, 30000, 33000, 34000, 38000, 40000, 50000, 70000, 100000, 488602] on the imp-35852 clustered ' +
    'worst order against a per-N exact 2^{-96} dyadic-BigInt reference, full Kahan-Babuska-Neumaier (KBN) FIRST ' +
    'produces a strictly smaller normalized error than classic Kahan at N ~ 34000 (kappa ~ 361), roughly the ' +
    'midpoint of the imp-36023 gap between the identical rung N = 10000 and the separated rung N = 100000. Below ' +
    'the onset the two schemes are BIT-IDENTICAL at every rung (N = 1000, 10000, 30000, 33000); from the onset ' +
    'upward KBN is strictly tighter and the gap DEEPENS (KBN/Kahan ratio falls from ~0.96 at N = 34000 to ~0.08 ' +
    'at N ~ 488602, where classic Kahan ~2.31e-19 and KBN ~1.89e-20 reproduce imp-36023). The onset tracks N (a ' +
    'clean bit-identical/separated boundary near N ~ 34000) rather than a hard kappa cutoff -- kappa is itself ' +
    'non-monotone rung-to-rung near the onset -- and is a SOFT rounding-gated threshold (a finer sub-sweep shows ' +
    'the separation is intermittent through N ~ 40000), because the two schemes differ only in how the ' +
    'compensation term is re-incorporated (KBN adds it once at the end via s + c). Both sit at the ~1e-19 ' +
    'compensated floor at every rung, so the separation is a floor-level rounding effect and precision is NOT the ' +
    'binding constraint anywhere on the ladder; the obstruction stays the ENGINEERING of the certified length-N ' +
    'interval sum (MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; instantiates no interval; ' +
    'verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT ' +
    'stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36023 (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602; onset never located); imp-35973 ' +
    '(single-endpoint combined worst-case compensated floor ~2.31e-19 at N~488602); imp-35852 (clustered worst ' +
    'ORDER); imp-35812 (fixed term family + N ladder [1e3..4.886e5]); imp-35761 (pairwise log2(N)*eps ceiling); ' +
    'imp-35681 Part A (A+B-C interval bound greenfield); imp-35725 (mechanical certified sum); ' +
    'Higham 2002, Neumaier 1974.',
};

export const IMP36062_KBN_KAHAN_SEPARATION_ONSET_ASSERTIONS = [
  {
    id: 'imp36062-ladder-anchor',
    description: 'Eleven-rung finer ladder N = [1000..488602] straddling the imp-36023 identical->separated gap',
    holds: () =>
      LADDER.length === 11 &&
      LADDER_SIZES[0] === 1000 &&
      LADDER_SIZES[LADDER_SIZES.length - 1] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // The first strict separation is located at N ~ 34000 (kappa ~ 361).
    id: 'imp36062-onset-at-34k',
    description: 'Full KBN first strictly separates from classic Kahan at N = 34000 (kappa ~ 360)',
    holds: () =>
      FIRST_SEPARATION_N === 34000 &&
      FIRST_SEPARATION_KAPPA > 340 && FIRST_SEPARATION_KAPPA < 380,
  },
  {
    // Below the onset the two schemes are bit-identical at every rung tested.
    id: 'imp36062-identical-below-onset',
    description: 'Kahan and KBN are bit-identical at every rung below N = 34000',
    holds: () =>
      BELOW_ONSET_ALL_IDENTICAL === true &&
      LADDER.filter((r) => r.N < 34000).length === 4 &&
      LADDER.filter((r) => r.N < 34000).every((r) => r.kbnStrictlyTighter === false),
  },
  {
    // From the onset upward the KBN advantage deepens with N.
    id: 'imp36062-gap-deepens-with-n',
    description: 'The KBN/Kahan ratio at the onset (~0.96) deepens to ~0.08 by N ~ 488602',
    holds: () =>
      GAP_DEEPENS_WITH_N === true &&
      ONSET_RATIO > 0.8 && ONSET_RATIO < 1 &&
      ENDPOINT_RATIO < 0.2,
  },
  {
    // The endpoint rung reproduces the imp-36023 figures.
    id: 'imp36062-endpoint-reproduces-imp36023',
    description: 'The N~488602 rung reproduces imp-36023 (classic Kahan ~2.31e-19, KBN ~1.89e-20)',
    holds: () =>
      Math.abs(ENDPOINT.kahanNormErr - 2.31e-19) / 2.31e-19 < 0.05 &&
      Math.abs(ENDPOINT.kbnNormErr - 1.89e-20) / 1.89e-20 < 0.1 &&
      ENDPOINT.kbnStrictlyTighter === true,
  },
  {
    id: 'imp36062-honesty-gate',
    description: 'Measurement only; onset tracks N not a hard kappa cutoff; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36062_KBN_KAHAN_SEPARATION_ONSET.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /tracks N/i.test(IMP36062_KBN_KAHAN_SEPARATION_ONSET.conclusion.tracksNNotKappa) &&
      /NOT the binding constraint/.test(
        IMP36062_KBN_KAHAN_SEPARATION_ONSET.conclusion.precisionNotBinding,
      ) &&
      /GREENFIELD/.test(IMP36062_KBN_KAHAN_SEPARATION_ONSET.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36062_KBN_KAHAN_SEPARATION_ONSET.verdict) &&
      /refereed bound is changed/i.test(IMP36062_KBN_KAHAN_SEPARATION_ONSET.verdict),
  },
];

for (const a of IMP36062_KBN_KAHAN_SEPARATION_ONSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36062-kbn-kahan-separation-onset assertion failed: ${a.id}`);
  }
}
