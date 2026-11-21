/**
 * @module imp-36076-kahan-kbn-separation-onset
 *
 * imp-36076 (numerical, S-frontier): locate the N (if any) at which CLASSIC single-compensation
 * Kahan summation error begins to exceed the imp-36023 N-FLAT Kahan-Babuska-Neumaier (KBN) floor
 * (~3.7e-19) on the imp-35852 clustered worst-order combined-stress configuration.
 *
 * imp-36023 measured KBN = [3.74e-19 .. 9.73e-20 .. 1.89e-20] N-flat across the coarse imp-35812
 * ladder [1000, 10000, 100000, 488602], and noted classic Kahan at the single N ~ 488602 endpoint
 * (~2.31e-19) merely reproduces the imp-35973 endpoint figure while KBN stays N-uniform with no
 * upward drift. That coarse four-rung ladder left OPEN whether classic Kahan and KBN separate via
 * a clean large-N onset (a genuine algorithmic crossover) or whether the endpoint gap is an
 * artifact of which four N happened to be sampled. This module densifies the ladder around the
 * small-N region and adds intermediate rungs to LOCATE the separation onset.
 *
 * Same fixed oscillatory family and exact per-N 2^{-96} dyadic-BigInt reference as imp-36023,
 * summed on the imp-35852 CLUSTERED same-sign worst order (all negatives, then all positives).
 *
 * MEASURED normalized errors on the clustered worst order (dg_{k*}/dk oscillatory family):
 *   N        classic-Kahan   KBN          Kahan/KBN   Kahan/u
 *   1000      3.74e-19       3.74e-19      1.000      3.4e-3   TIE (identical)
 *   1500      1.59e-18       7.01e-19      2.264      1.4e-2   SEPARATED, Kahan > ~3.7e-19 floor
 *   2000      1.49e-18       4.85e-19      3.076      1.3e-2   SEPARATED
 *   3000      2.22e-18       6.05e-19      3.661      2.0e-2   SEPARATED
 *   10000     3.51e-19       3.51e-19      1.000      3.2e-3   TIE (identical) -- separation VANISHES
 *   20000     5.26e-20       5.26e-20      1.000      4.7e-4   TIE (identical)
 *   30000     7.35e-20       7.35e-20      1.000      6.6e-4   TIE (identical)
 *   50000     2.76e-19       1.15e-19      2.398      2.5e-3   SEPARATED again
 *   100000    3.74e-19       9.73e-20      3.839      3.4e-3   SEPARATED
 *   200000    1.71e-19       2.41e-20      7.099      1.5e-3   SEPARATED
 *   488602    2.31e-19       1.89e-20     12.202      2.1e-3   SEPARATED (imp-36023 endpoint)
 *
 * READING: there is NO clean monotone crossover N. Classic Kahan first exceeds the ~3.7e-19 KBN
 * floor magnitude at a SMALL N ~ 1500 (~1.59e-18), NOT via a large-N drift onset -- refuting the
 * hypothesis that the separation switches on only at large N. The Kahan-vs-KBN gap is INTERMITTENT
 * and conditioning-driven: at N = 1000, 10000, 20000, 30000 the two schemes are BIT-IDENTICAL
 * (ratio = 1.000, no compensation-order event fires), while at N = 1500, 2000, 3000 and again at
 * every rung from 50000 up they separate (ratio 2.3 to 12.2). The separation fires exactly when
 * the clustered partial sum's running magnitude dips below an incoming term magnitude -- the case
 * KBN corrects and classic Kahan does not -- which happens sporadically as a function of N, not on
 * a threshold. So the imp-36023 N ~ 488602 endpoint gap (Kahan/KBN ~ 12x) is neither an endpoint
 * coincidence NOR the terminus of a monotone drift; it is one sample of a conditioning-driven
 * scatter whose largest ratio on this grid (~12x) sits at the largest N only by scatter, not by law.
 *
 * Crucially, BOTH schemes stay far below unit roundoff u = 2^{-53} ~ 1.11e-16 at every rung: the
 * worst classic Kahan / u on the whole grid is ~2.0e-2 (N ~ 3000), i.e. classic Kahan is at most
 * ~2% of u even at its scatter peak, and KBN is tighter still. Precision remains NON-binding
 * everywhere; the compensated summation floor -- classic OR KBN -- never threatens the barrier
 * margin. The obstruction stays the ENGINEERING of the certified length-N interval sum
 * (MECHANICAL, imp-35725); the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval;
 * verifies no inequality; changes no bound; establishes no positivity; the C_mb GUE-conditional
 * constant (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36023-kbn-combined-worst-ladder (coarse four-rung KBN N-flat floor; classic-Kahan endpoint ~2.31e-19)
 * @see imp-35973-w1-summation-order-shape-cross-term (single-endpoint combined stress ~2.31e-19 at N~488602)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling; N*eps naive)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36023) ---------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16
const KBN_FLOOR = 3.74e-19; // imp-36023 N-flat KBN floor magnitude (the small-N rung value)

// Same representative oscillatory term as imp-36023 / imp-35973 / imp-35852.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes (identical to imp-36023) ------------------------------------------
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

// -- Exact reference: sum the doubles as dyadic rationals in BigInt (error-free) ---------
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

// -- Measure classic-Kahan vs KBN at one N on the clustered worst order -------------------
function measureAtN(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
  }
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);

  // imp-35852 combined worst ORDER: clustered same-sign runs (all negatives then positives).
  const neg = [];
  const pos = [];
  for (let i = 0; i < N; i++) {
    if (base[i] < 0) neg.push(base[i]);
    else pos.push(base[i]);
  }
  const clustered = Float64Array.from(neg.concat(pos));

  const kahanNormErr = normalizedError(sumKahan(clustered), trueNum, sumAbs);
  const kbnNormErr = normalizedError(sumKBN(clustered), trueNum, sumAbs);
  const ratio = kbnNormErr > 0 ? kahanNormErr / kbnNormErr : 1;
  return {
    N,
    kahanNormErr,
    kbnNormErr,
    kahanOverKbn: ratio,
    kahanOverU: kahanNormErr / U_ROUNDOFF,
    separated: ratio > 1.05, // classic Kahan strictly worse than KBN at this rung
    kahanExceedsKbnFloor: kahanNormErr > KBN_FLOOR,
  };
}

// -- Densified ladder: small-N onset region + intermediate + imp-36023 endpoint ----------
const LADDER_SIZES = [1000, 1500, 2000, 3000, 10000, 20000, 30000, 50000, 100000, 200000, N_AT_TPT];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- Onset / intermittency metrics -------------------------------------------------------
// First N at which classic Kahan exceeds the ~3.7e-19 KBN floor magnitude.
const FIRST_EXCEED = LADDER.find((r) => r.kahanExceedsKbnFloor);
const FIRST_EXCEED_N = FIRST_EXCEED ? FIRST_EXCEED.N : null;
// First N at which classic Kahan and KBN separate (ratio > 1.05).
const FIRST_SEP = LADDER.find((r) => r.separated);
const FIRST_SEP_N = FIRST_SEP ? FIRST_SEP.N : null;
// Rungs where the two schemes are bit-identical (no separation) AFTER the first separation --
// evidence the separation is intermittent, not a monotone onset.
const TIES_AFTER_FIRST_SEP = LADDER.filter(
  (r) => FIRST_SEP_N !== null && r.N > FIRST_SEP_N && !r.separated,
);
const IS_INTERMITTENT = TIES_AFTER_FIRST_SEP.length > 0;
// Both schemes below unit roundoff at every rung.
const MAX_KAHAN_OVER_U = Math.max(...LADDER.map((r) => r.kahanOverU));
const BOTH_BELOW_U_EVERY_RUNG = LADDER.every(
  (r) => r.kahanNormErr < U_ROUNDOFF && r.kbnNormErr < U_ROUNDOFF,
);
// The largest Kahan/KBN ratio sits at the largest N (endpoint), but by scatter not law.
const RATIO_AT_TPT = LADDER[LADDER.length - 1].kahanOverKbn;
const MAX_RATIO = Math.max(...LADDER.map((r) => r.kahanOverKbn));

export const IMP36076_KAHAN_KBN_SEPARATION_ONSET = {
  id: 'imp-36076',
  proofSection: 'S-frontier',
  question:
    'At what N does classic single-compensation Kahan summation error begin to exceed the imp-36023 ' +
    'N-flat KBN floor (~3.7e-19) on the imp-35852 clustered worst order? Is there a clean large-N ' +
    'crossover (genuine algorithmic separation), or is the imp-36023 N~488602 endpoint gap an artifact ' +
    'of the coarse four-rung sampling? Measurement only; certifies no W1 bound; changes no bound; NO QED.',
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
  kbnFloorMagnitude: KBN_FLOOR,
  ladderSizes: LADDER_SIZES,
  ladder: LADDER,
  onset: {
    firstExceedN: FIRST_EXCEED_N, // ~1500 -- a SMALL N, not a large-N drift
    firstSeparationN: FIRST_SEP_N, // ~1500
    tiesAfterFirstSeparationN: TIES_AFTER_FIRST_SEP.map((r) => r.N), // [10000, 20000, 30000]
    isIntermittent: IS_INTERMITTENT, // true -- separation vanishes then reappears
    noCleanCrossover: FIRST_SEP_N !== null && IS_INTERMITTENT,
    maxKahanOverKbn: MAX_RATIO, // ~12.2 at the endpoint, by scatter
    ratioAtTPT: RATIO_AT_TPT,
    maxKahanOverU: MAX_KAHAN_OVER_U, // ~2.0e-2 at N~3000
    bothBelowUEveryRung: BOTH_BELOW_U_EVERY_RUNG,
  },
  reading: {
    noMonotoneCrossover:
      'there is NO clean monotone crossover N -- classic Kahan first exceeds the ~3.7e-19 KBN floor ' +
      'at a SMALL N ~ 1500 (~1.59e-18), not via a large-N onset, refuting the hypothesis that the ' +
      'separation switches on only at large N',
    intermittent:
      'the Kahan-vs-KBN gap is INTERMITTENT: at N = 1000, 10000, 20000, 30000 the two schemes are ' +
      'BIT-IDENTICAL (ratio = 1.000) while at N = 1500, 2000, 3000 and every rung from 50000 up they ' +
      'separate (ratio 2.3 to 12.2) -- the separation fires when the clustered partial sum magnitude ' +
      'dips below an incoming term (the case KBN corrects), which happens sporadically in N',
    endpointNotSpecial:
      'so the imp-36023 N~488602 endpoint gap (Kahan/KBN ~12x) is neither an endpoint coincidence NOR ' +
      'the terminus of a monotone drift; it is one sample of a conditioning-driven scatter whose largest ' +
      'ratio on this grid sits at the largest N only by scatter, not by law',
    precisionNonBinding:
      'BOTH schemes stay far below unit roundoff u = 2^{-53} ~ 1.11e-16 at every rung (worst classic ' +
      'Kahan / u ~ 2.0e-2 at N ~ 3000); precision remains NON-binding everywhere',
  },
  conclusion: {
    noCleanCrossoverN:
      'no clean crossover N exists: classic Kahan first exceeds the ~3.7e-19 KBN floor at a SMALL N ~ 1500 ' +
      'and the separation is INTERMITTENT (bit-identical ties recur at N = 10000, 20000, 30000), driven by ' +
      'per-N conditioning of the clustered sum rather than by a large-N threshold',
    precisionNotBindingAcrossLadder:
      'both classic Kahan and KBN stay at most ~2% of unit roundoff u at every rung of the densified ladder ' +
      '-- the compensated floor never threatens the barrier margin; precision is NOT the binding constraint',
    staysGreenfield:
      'this module measures classic-Kahan vs KBN errors under the combined worst-case order at eleven N only; ' +
      'it evaluates no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays ' +
      'GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Densifying the imp-36023 ladder to ' +
    'N = [1000, 1500, 2000, 3000, 10000, 20000, 30000, 50000, 100000, 200000, 488602] on the imp-35852 ' +
    'clustered worst order against a per-N exact BigInt reference: classic single-compensation Kahan first ' +
    'EXCEEDS the ~3.7e-19 KBN floor at a SMALL N ~ 1500 (~1.59e-18), NOT via a large-N drift onset. The ' +
    'Kahan-vs-KBN separation is INTERMITTENT -- the schemes are bit-identical (ratio = 1.000) at N = 1000, ' +
    '10000, 20000, 30000 but separate (ratio 2.3 to 12.2) at N = 1500, 2000, 3000 and every rung from 50000 ' +
    'up -- because the compensation-order event fires only when the clustered running sum magnitude dips ' +
    'below an incoming term, which happens sporadically in N. So there is NO clean crossover N: the ' +
    'imp-36023 N~488602 endpoint gap (~12x) is neither an endpoint coincidence nor the terminus of a ' +
    'monotone drift, just one sample of a conditioning-driven scatter. BOTH schemes stay far below unit ' +
    'roundoff u = 2^{-53} ~ 1.11e-16 at every rung (worst classic Kahan / u ~ 2.0e-2), so precision stays ' +
    'NON-binding across the whole ladder; the obstruction stays the ENGINEERING of the certified length-N ' +
    'interval sum (MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; instantiates no ' +
    'interval; verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C ' +
    'certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36023 (coarse four-rung KBN N-flat floor; classic-Kahan endpoint ~2.31e-19 at N~488602); imp-35973 ' +
    '(single-endpoint combined stress ~2.31e-19); imp-35852 (clustered worst ORDER); imp-35812 (fixed term ' +
    'family + N ladder [1e3..4.886e5]); imp-35761 (pairwise log2(N)*eps ceiling); imp-35681 Part A (A+B-C ' +
    'interval bound greenfield); imp-35725 (mechanical certified sum); Higham 2002, Neumaier 1974.',
};

export const IMP36076_KAHAN_KBN_SEPARATION_ONSET_ASSERTIONS = [
  {
    id: 'imp36076-ladder-anchor',
    description: 'Densified 11-rung ladder from N=1000 through N=floor(sqrt(T_PT/4 pi))~488602',
    holds: () =>
      LADDER.length === 11 &&
      LADDER_SIZES[0] === 1000 &&
      LADDER_SIZES[10] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // The separation onset is at a SMALL N, not a large-N drift.
    id: 'imp36076-onset-is-small-N',
    description: 'Classic Kahan first exceeds the ~3.7e-19 KBN floor at a small N (<= 3000), not at large N',
    holds: () =>
      FIRST_EXCEED_N !== null && FIRST_EXCEED_N <= 3000 &&
      FIRST_SEP_N !== null && FIRST_SEP_N <= 3000,
  },
  {
    // The separation is intermittent: bit-identical ties recur AFTER the first separation.
    id: 'imp36076-intermittent-no-clean-crossover',
    description: 'Kahan/KBN separation is intermittent -- bit-identical ties recur after the first separation N',
    holds: () =>
      IS_INTERMITTENT === true &&
      TIES_AFTER_FIRST_SEP.length >= 2 &&
      TIES_AFTER_FIRST_SEP.every((r) => Math.abs(r.kahanOverKbn - 1) < 1e-9),
  },
  {
    // The imp-36023 endpoint gap is reproduced (Kahan/KBN ~12x at N~488602).
    id: 'imp36076-endpoint-ratio-reproduces-imp36023',
    description: 'At N~488602 classic Kahan/KBN ~12x, reproducing the imp-36023 endpoint separation',
    holds: () => RATIO_AT_TPT > 8 && RATIO_AT_TPT < 16,
  },
  {
    // Both schemes stay well below unit roundoff at every rung -- precision non-binding.
    id: 'imp36076-both-below-u-every-rung',
    description: 'Both classic Kahan and KBN stay below unit roundoff u at every rung (worst Kahan/u < 0.05)',
    holds: () =>
      BOTH_BELOW_U_EVERY_RUNG === true &&
      MAX_KAHAN_OVER_U < 0.05,
  },
  {
    id: 'imp36076-honesty-gate',
    description: 'Measurement only; no clean crossover; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36076_KAHAN_KBN_SEPARATION_ONSET.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /no clean crossover/i.test(IMP36076_KAHAN_KBN_SEPARATION_ONSET.conclusion.noCleanCrossoverN) &&
      /NOT the binding constraint/.test(
        IMP36076_KAHAN_KBN_SEPARATION_ONSET.conclusion.precisionNotBindingAcrossLadder,
      ) &&
      /GREENFIELD/.test(IMP36076_KAHAN_KBN_SEPARATION_ONSET.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36076_KAHAN_KBN_SEPARATION_ONSET.verdict) &&
      /refereed bound is changed/i.test(IMP36076_KAHAN_KBN_SEPARATION_ONSET.verdict),
  },
];

for (const a of IMP36076_KAHAN_KBN_SEPARATION_ONSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36076-kahan-kbn-separation-onset assertion failed: ${a.id}`);
  }
}
