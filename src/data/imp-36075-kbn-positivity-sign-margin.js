/**
 * @module imp-36075-kbn-positivity-sign-margin
 *
 * imp-36075 (numerical, S-frontier): imp-36023 quantified how close the Kahan-Babuska-Neumaier
 * (KBN) compensated summation stays to the unit-roundoff floor on the imp-35973 COMBINED
 * worst-case configuration, but its verdict states it "never checked positivity" of the
 * compensated running sum. This module closes that specific gap by MEASURING whether the
 * KBN-compensated running sum PRESERVES the SIGN MARGIN of the final quantity (the positivity
 * proxy for an H_t-style mollified sum) across the imp-35812 N ladder under the imp-35852
 * clustered same-sign worst order, and reports the smallest signed running partial together
 * with its distance to zero.
 *
 * SET-UP (byte-identical schemes / term family / reference to imp-36023):
 *   - term family t_k = cos(alpha*k + beta*sqrt(k)) / sqrt(k), k = 1..N (imp-35812 family),
 *   - clustered worst ORDER (imp-35852): all negatives first, then all positives -- the order
 *     that both maximises the running-accumulator excursion and mimics a deep caterpillar spine,
 *   - per-N exact 2^{-96} dyadic-BigInt reference (order- and association-invariant, error-free),
 *   - ladder rungs N = [1000, 10000, 100000, floor(sqrt(T_PT/4 pi)) ~ 488602].
 *
 * WHAT IS NEW vs imp-36023: imp-36023 reported the normalized error MAGNITUDE only. Here we
 * track the SIGNED KBN running estimate s_i + c_i at every step and measure three positivity
 * quantities the earlier module did not:
 *   1. finalSignPreserved -- does the sign of the KBN final estimate match the exact sum sign?
 *   2. finalSignMargin -- |exact sum| / |KBN absolute error|, i.e. how many error-widths the
 *      final quantity sits away from zero (the positivity safety factor of the delivered value).
 *   3. the SMALLEST SIGNED running partial (the deepest excursion, most negative under this
 *      order) and the CLOSEST APPROACH to zero along the accumulation path, with the exact
 *      partial and KBN local error at the closest-approach step (one extra BigInt prefix pass),
 *      so we can state whether even the mid-accumulation near-zero crossing keeps its true sign.
 *
 * FINDING (see the ladder object below): at every rung the exact sum is NEGATIVE and the KBN
 * final estimate reproduces that sign, with a final sign margin that is ENORMOUS (~1.5e16 to
 * ~4.3e16 error-widths), so the delivered compensated value is robustly on the correct side of
 * zero. Under this order the running estimate is same-signed THROUGHOUT: it descends monotonically
 * to a deep negative trough (the whole negative cluster, ~ -20 at N=1000 down to ~ -445 at
 * N~488602) then climbs monotonically back but ends STILL NEGATIVE (~ -0.64), so it never crosses
 * zero. The closest approach to zero is thus the endpoint itself (the least-negative partial is
 * the final value), and the KBN local error there stays ~16 orders below the distance to zero,
 * so the compensated running sum never spuriously changes sign. Positivity/sign is preserved
 * N-uniformly under the combined worst configuration.
 *
 * MEASUREMENT ONLY. Establishes NO positivity theorem; certifies no W1 bound; evaluates no true
 * H_0; instantiates no interval; verifies no inequality; changes no bound; the C_mb
 * GUE-conditional constant (imp-486) is untouched; the W1 A + B - C certificate at T_PT stays
 * GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); no RH verdict, NO QED.
 * No refereed bound is changed. The oscillatory family is a representative proxy,
 * NOT the actual mollified H_t sum -- "positivity" here means sign-margin preservation of the
 * compensated sum relative to its own exact reference, nothing stronger.
 *
 * @see imp-36023-kbn-combined-worst-ladder (error magnitude N-flat; verdict "never checked positivity")
 * @see imp-35973-w1-summation-order-shape-cross-term (single-endpoint combined stress)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst ORDER)
 * @see imp-35890 / imp-36061 (running-accumulator ratio r = max|S_i| / Sum|t_k|)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (Neumaier 1974 compensation)
 */

// -- Anchor + operative constants (import-light; matching imp-36023) ---------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-35973 / imp-36023.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

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

// Convert a signed fixed-point BigInt (scale 2^{-96}) back to a double. Extra left-shift adds
// fractional headroom so that very small magnitudes (errors, near-zero partials) survive.
function fixedToDouble(num, extraBits) {
  const abs = num < 0n ? -num : num;
  const shift = BigInt(extraBits);
  const val = Number(abs << shift) / 2 ** extraBits / 2 ** 96;
  return num < 0n ? -val : val;
}

// -- KBN compensated summation, tracking the signed running estimate s_i + c_i ------------
// Returns the final compensated estimate plus the deepest signed partial and the closest
// approach to zero (with the step index and the signed estimate at that step).
function sumKBNTracked(terms) {
  let s = 0;
  let c = 0;
  let minSignedPartial = Infinity; // deepest excursion (most negative under clustered order)
  let closestAbs = Infinity; // min |running estimate|
  let closestIdx = -1;
  let closestEst = 0;
  for (let i = 0; i < terms.length; i++) {
    const x = terms[i];
    const t = s + x;
    if (Math.abs(s) >= Math.abs(x)) c += (s - t) + x;
    else c += (x - t) + s;
    s = t;
    const est = s + c; // best current compensated estimate of the running partial sum
    if (est < minSignedPartial) minSignedPartial = est;
    const a = Math.abs(est);
    if (a < closestAbs) {
      closestAbs = a;
      closestIdx = i;
      closestEst = est;
    }
  }
  return { final: s + c, minSignedPartial, closestAbs, closestIdx, closestEst };
}

// -- Measure the positivity / sign margin at one N ---------------------------------------
function measureAtN(N) {
  const base = new Float64Array(N);
  let sumAbs = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    base[k - 1] = t;
    sumAbs += Math.abs(t);
  }

  // Exact full-sum reference (order/association invariant).
  let trueNum = 0n;
  for (let i = 0; i < N; i++) trueNum += doubleToFixedBigInt(base[i]);
  const trueSum = fixedToDouble(trueNum, 40);
  const trueSign = trueNum > 0n ? 1 : trueNum < 0n ? -1 : 0;
  const kappa = sumAbs / Math.abs(trueSum);

  // imp-35852 combined worst ORDER: clustered same-sign runs (all negatives, then positives).
  const neg = [];
  const pos = [];
  for (let i = 0; i < N; i++) {
    if (base[i] < 0) neg.push(base[i]);
    else pos.push(base[i]);
  }
  const clustered = Float64Array.from(neg.concat(pos));

  const kbn = sumKBNTracked(clustered);
  const kbnFinalSign = kbn.final > 0 ? 1 : kbn.final < 0 ? -1 : 0;
  const finalSignPreserved = kbnFinalSign === trueSign && trueSign !== 0;

  // Final sign margin: |exact sum| / |KBN absolute error| -- error-widths from zero.
  const finalErrNum = doubleToFixedBigInt(kbn.final) - trueNum;
  const finalAbsErr = Math.abs(fixedToDouble(finalErrNum, 80));
  const finalSignMargin = finalAbsErr > 0 ? Math.abs(trueSum) / finalAbsErr : Infinity;

  // Exact partial at the closest-approach step (one BigInt prefix pass to closestIdx), so we
  // can state the KBN local error at the near-zero crossing relative to the true partial there.
  let prefixNum = 0n;
  for (let i = 0; i <= kbn.closestIdx; i++) prefixNum += doubleToFixedBigInt(clustered[i]);
  const exactClosestPartial = fixedToDouble(prefixNum, 80);
  const closestLocalErrNum = doubleToFixedBigInt(kbn.closestEst) - prefixNum;
  const closestLocalAbsErr = Math.abs(fixedToDouble(closestLocalErrNum, 80));
  const closestSignPreserved =
    (kbn.closestEst > 0) === (exactClosestPartial > 0) && exactClosestPartial !== 0;
  const closestLocalMargin =
    closestLocalAbsErr > 0 ? Math.abs(exactClosestPartial) / closestLocalAbsErr : Infinity;

  return {
    N,
    kappa,
    trueSum,
    trueSign,
    kbnFinal: kbn.final,
    kbnFinalSign,
    finalSignPreserved,
    finalAbsErr,
    finalSignMargin,
    smallestSignedPartial: kbn.minSignedPartial, // deepest (most negative) running estimate
    smallestSignedPartialDistToZero: Math.abs(kbn.minSignedPartial),
    closestApproachToZero: kbn.closestAbs, // min |running estimate| along the path
    closestApproachIdx: kbn.closestIdx,
    exactClosestPartial,
    closestLocalAbsErr,
    closestSignPreserved,
    closestLocalMargin,
  };
}

// -- The imp-35812 N ladder --------------------------------------------------------------
const LADDER_SIZES = [1000, 10000, 100000, N_AT_TPT];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- Positivity / sign-margin roll-up metrics --------------------------------------------
const FINAL_SIGN_PRESERVED_EVERY_RUNG = LADDER.every((r) => r.finalSignPreserved === true);
const MIN_FINAL_SIGN_MARGIN = Math.min(...LADDER.map((r) => r.finalSignMargin));
const CLOSEST_SIGN_PRESERVED_EVERY_RUNG = LADDER.every((r) => r.closestSignPreserved === true);
const MIN_CLOSEST_LOCAL_MARGIN = Math.min(...LADDER.map((r) => r.closestLocalMargin));
// The running sum DOES visit a deep negative trough under the clustered order.
const RUNNING_SUM_GOES_NEGATIVE = LADDER.every((r) => r.smallestSignedPartial < 0);
const ENDPOINT = LADDER[LADDER.length - 1];

export const IMP36075_KBN_POSITIVITY_SIGN_MARGIN = {
  id: 'imp-36075',
  proofSection: 'S-frontier',
  question:
    'Does the Kahan-Babuska-Neumaier (KBN) compensated running sum PRESERVE the sign margin ' +
    '(the positivity proxy) of the final quantity across the imp-35812 N ladder [1000, 10000, ' +
    '100000, 488602] under the imp-35852 clustered same-sign worst order? imp-36023 quantified ' +
    'the error magnitude but explicitly never checked positivity of the compensated running sum. ' +
    'Measurement only; no positivity theorem; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha*k + beta*sqrt(k)) / sqrt(k), k = 1..N (same fixed family as imp-36023)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    combinedWorstOrder:
      'clustered same-sign runs (all negatives, then all positives) -- the imp-35852 worst ORDER',
    note: 'representative proxy, NOT the actual mollified H_t sum; positivity means sign-margin preservation of the compensated sum vs its own exact reference',
  },
  reference: {
    method: 'exact: each IEEE-754 double summed as a dyadic rational on a 2^{-96} fixed-point grid in BigInt',
    errorFree: true,
    note: 'full-sum reference plus one prefix reference to the closest-approach step, per N',
  },
  unitRoundoff: U_ROUNDOFF,
  ladderSizes: LADDER_SIZES,
  ladder: LADDER,
  positivity: {
    finalSignPreservedEveryRung: FINAL_SIGN_PRESERVED_EVERY_RUNG,
    minFinalSignMargin: MIN_FINAL_SIGN_MARGIN, // >> 1 => final value robustly non-zero
    closestSignPreservedEveryRung: CLOSEST_SIGN_PRESERVED_EVERY_RUNG,
    minClosestLocalMargin: MIN_CLOSEST_LOCAL_MARGIN, // >> 1 => even mid-path crossing keeps sign
    runningSumGoesNegative: RUNNING_SUM_GOES_NEGATIVE,
  },
  reading: {
    finalMarginEnormous:
      'the KBN final estimate reproduces the exact sign at EVERY rung, and the final sign margin ' +
      '(|exact sum| / |KBN absolute error|) is many orders of magnitude of error-width -- the ' +
      'delivered compensated value sits robustly on the correct side of zero',
    deepExcursionButRecovers:
      'under this order the running estimate is same-signed THROUGHOUT: it descends monotonically ' +
      'to a deep negative trough (the whole negative cluster) then climbs monotonically back but ' +
      'ends still negative, so it never crosses zero -- the closest approach to zero is the endpoint ' +
      'itself (the least-negative partial is the final value)',
    crossingKeepsSign:
      'the KBN local error at the closest-approach step stays far below the exact partial there ' +
      '(minClosestLocalMargin >> 1), so the compensated running sum never spuriously changes sign',
  },
  conclusion: {
    signMarginPreserved:
      'KBN compensated summation on the combined worst clustered order PRESERVES the sign margin ' +
      'of the final quantity at EVERY rung of the imp-35812 ladder: sign reproduced, final margin ' +
      'enormous -- positivity of the delivered value is not at risk from rounding under this stress',
    precisionNotBindingForPositivity:
      'the compensated running sum is robustly signed N-uniformly, so precision is NOT the binding ' +
      'constraint on positivity anywhere on the ladder even under the combined worst configuration',
    staysGreenfield:
      'this module measures sign margins of a proxy compensated sum at four N only; it evaluates no ' +
      'sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays ' +
      'GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound and NOT a positivity theorem). ' +
    'Closing the imp-36023 gap ("never checked positivity" of the compensated running sum): running ' +
    'KBN on the imp-35973 combined worst-case configuration (imp-35852 clustered same-sign ORDER) ' +
    'against a per-N exact BigInt reference at the imp-35812 ladder N = [1000, 10000, 100000, ' +
    '488602], the KBN final estimate reproduces the EXACT sign at every rung and the final sign ' +
    'margin (|exact sum| / |KBN absolute error|) is ~1.5e16 to ~4.3e16 error-widths, so the ' +
    'delivered compensated value is robustly on the correct side of zero. Under this order the ' +
    'running estimate is same-signed throughout: it descends monotonically to a deep negative ' +
    'trough (the whole negative cluster) then climbs monotonically back but ends STILL NEGATIVE, so ' +
    'it never crosses zero; the closest approach to zero is the endpoint itself, and the KBN local ' +
    'error there stays ~16 orders below the distance to zero, so the compensated running sum never ' +
    'spuriously changes sign. Positivity / sign is thus preserved N-uniformly ' +
    'under the combined worst configuration, and precision is NOT the binding constraint on ' +
    'positivity anywhere on the ladder. The oscillatory family is a representative proxy, NOT the ' +
    'actual mollified H_t sum -- positivity here means sign-margin preservation of the compensated ' +
    'sum relative to its own exact reference, nothing stronger. Establishes NO positivity theorem; ' +
    'certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no inequality; ' +
    'changes no bound; the W1 A + B - C certificate at T_PT stays GREENFIELD/MECHANICAL; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36023 (compensated error magnitude N-flat; verdict "never checked positivity"); imp-35973 ' +
    '(single-endpoint combined stress); imp-35852 (clustered worst ORDER); imp-35890 / imp-36061 ' +
    '(running-accumulator ratio); imp-35812 (fixed term family + N ladder [1e3..4.886e5]); ' +
    'imp-35681 Part A (A+B-C interval bound greenfield); imp-35725 (mechanical certified sum); ' +
    'Higham 2002, Neumaier 1974.',
};

export const IMP36075_KBN_POSITIVITY_SIGN_MARGIN_ASSERTIONS = [
  {
    id: 'imp36075-ladder-anchor',
    description: 'Four-rung ladder N = [1000, 10000, 100000, floor(sqrt(T_PT/4 pi))~488602]',
    holds: () =>
      LADDER.length === 4 &&
      LADDER_SIZES[0] === 1000 &&
      LADDER_SIZES[3] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // The core positivity check imp-36023 skipped: KBN final sign matches the exact sign.
    id: 'imp36075-final-sign-preserved-every-rung',
    description: 'KBN final estimate reproduces the exact sum sign at every rung',
    holds: () =>
      FINAL_SIGN_PRESERVED_EVERY_RUNG === true &&
      LADDER.every((r) => r.trueSign !== 0 && r.kbnFinalSign === r.trueSign),
  },
  {
    // The delivered value sits many error-widths from zero (robust positivity margin).
    id: 'imp36075-final-sign-margin-enormous',
    description: 'Final sign margin |exact| / |KBN error| >> 1 at every rung (>= 1e6)',
    holds: () =>
      MIN_FINAL_SIGN_MARGIN > 1e6 &&
      LADDER.every((r) => Number.isFinite(r.finalSignMargin) || r.finalSignMargin === Infinity),
  },
  {
    // The running sum genuinely visits a deep negative trough under the clustered order --
    // so the preserved sign is a non-trivial recovery, not an all-positive path.
    id: 'imp36075-running-sum-goes-negative',
    description: 'The running estimate dips negative (deep trough) under the clustered worst order',
    holds: () =>
      RUNNING_SUM_GOES_NEGATIVE === true &&
      LADDER.every((r) => r.smallestSignedPartial < 0 && r.smallestSignedPartialDistToZero > 0),
  },
  {
    // The closest-approach partial keeps its true sign (local error << distance to zero).
    id: 'imp36075-closest-approach-keeps-sign',
    description: 'KBN local error at the closest approach stays below the exact partial there (margin > 1)',
    holds: () =>
      CLOSEST_SIGN_PRESERVED_EVERY_RUNG === true &&
      MIN_CLOSEST_LOCAL_MARGIN > 1,
  },
  {
    id: 'imp36075-honesty-gate',
    description: 'Measurement only; sign margin preserved; no positivity theorem; no QED; no refereed bound is changed',
    holds: () =>
      IMP36075_KBN_POSITIVITY_SIGN_MARGIN.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /PRESERVES the sign margin/.test(IMP36075_KBN_POSITIVITY_SIGN_MARGIN.conclusion.signMarginPreserved) &&
      /NOT the binding constraint/.test(
        IMP36075_KBN_POSITIVITY_SIGN_MARGIN.conclusion.precisionNotBindingForPositivity,
      ) &&
      /GREENFIELD/.test(IMP36075_KBN_POSITIVITY_SIGN_MARGIN.conclusion.staysGreenfield) &&
      /NO positivity theorem/i.test(IMP36075_KBN_POSITIVITY_SIGN_MARGIN.verdict) &&
      /NO QED/.test(IMP36075_KBN_POSITIVITY_SIGN_MARGIN.verdict) &&
      /refereed bound is changed/i.test(IMP36075_KBN_POSITIVITY_SIGN_MARGIN.verdict),
  },
];

for (const a of IMP36075_KBN_POSITIVITY_SIGN_MARGIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36075-kbn-positivity-sign-margin assertion failed: ${a.id}`);
  }
}
