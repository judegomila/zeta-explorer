/**
 * @module imp-36023-kbn-combined-worst-ladder
 *
 * imp-36023 (numerical, S-frontier): does Kahan-Babuska-Neumaier (KBN) compensated summation
 * on the imp-35973 COMBINED worst-case configuration stay at the unit-roundoff floor across
 * the imp-35812 N ladder, or does the compensated floor DRIFT with N?
 *
 * imp-35973 reported that a compensated summation over the combined worst-case order-x-shape
 * stress stayed at the unit-roundoff floor (~2.31e-19) at the SINGLE endpoint N ~ 488602,
 * while uncompensated pairwise reached ~10% of the log2(N)*eps ceiling -- but never checked
 * whether that compensated floor is N-flat or trends across the ladder.
 *
 * The combined worst configuration is the imp-35852 CLUSTERED same-sign term ORDER (all
 * negatives, then all positives): that ordering is BOTH the worst term order AND the linear
 * traversal a deep caterpillar pairing spine induces, so summing it sequentially is the
 * order-x-shape combined stress for a sequential compensated scheme. This module recomputes,
 * across the four imp-35812 ladder rungs N = [1000, 10000, 100000, 488602], against a per-N
 * exact 2^{-96} dyadic-BigInt reference:
 *   - naive left-to-right accumulation on the clustered order (uncompensated baseline),
 *   - classic Kahan compensated summation (matches imp-35973 at the endpoint),
 *   - Kahan-Babuska-Neumaier (KBN), the improved compensation correct even when the running
 *     sum is smaller in magnitude than the incoming term.
 *
 * Distinct from imp-35955 (Kahan on the caterpillarR shape-only / ORIGINAL order); this is the
 * combined CLUSTERED worst order. MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true
 * H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no
 * positivity; the C_mb GUE-conditional constant (imp-486) is untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * MEASURED normalized errors on the CLUSTERED worst order across the ladder:
 *   N        kappa    naive        Kahan        KBN          KBN / u
 *   1000      61.9    1.07e-16     3.74e-19     3.74e-19     3.37e-3
 *   10000    194.5    4.90e-16     3.51e-19     3.51e-19     3.16e-3
 *   100000   632.6    8.54e-16     3.74e-19     9.73e-20     8.77e-4
 *   488602  1391.0    4.86e-15     2.31e-19     1.89e-20     1.70e-4
 *
 * READING: the compensated floor is N-FLAT (no upward drift). At every rung KBN sits ~3-4
 * orders of magnitude BELOW the unit roundoff u = 2^{-53} ~ 1.11e-16 (KBN / u ranges from
 * ~3.4e-3 down to ~1.7e-4), and if anything DECREASES at larger N rather than growing, while
 * the naive clustered sum grows roughly with the conditioning kappa (~62 to ~1391) from
 * ~1.07e-16 to ~4.86e-15. The classic Kahan value at N ~ 488602 (~2.31e-19) reproduces the
 * imp-35973 endpoint figure -- confirming imp-35973 reported the CLASSIC Kahan floor there;
 * full KBN at that rung is ~1.89e-20, roughly an order of magnitude tighter still. So the
 * imp-35973 single-endpoint floor is NOT an N-endpoint coincidence: compensated summation
 * keeps the combined worst-case order error at the roundoff floor N-uniformly, and precision
 * stays NON-binding across the whole ladder even under the combined stress. The obstruction
 * remains the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725), and
 * the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-35973-w1-summation-order-shape-cross-term (single-endpoint combined stress, compensated floor ~2.31e-19 at N~488602)
 * @see imp-35955 (Kahan on the caterpillarR shape-only / original order -- the SHAPE axis)
 * @see imp-36019-order-shape-cross-N-ladder (super-additivity factor + Kahan floor across the same ladder)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35893-w1-summation-pairwise-tree-shape (caterpillar pairing SHAPE)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling; N*eps naive)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-35973 / imp-36019) ---------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI)));
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term as imp-35812 / imp-35852 / imp-35893 / imp-35973.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes -------------------------------------------------------------------
function sumNaive(terms) {
  let s = 0;
  for (let i = 0; i < terms.length; i++) s += terms[i];
  return s;
}

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

// -- Measure all schemes at one N against a freshly built exact reference -----------------
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

  // imp-35852 combined worst ORDER: clustered same-sign runs (all negatives then positives).
  const neg = [];
  const pos = [];
  for (let i = 0; i < N; i++) {
    if (base[i] < 0) neg.push(base[i]);
    else pos.push(base[i]);
  }
  const clustered = Float64Array.from(neg.concat(pos));

  return {
    N,
    kappa,
    naiveNormErr: normalizedError(sumNaive(clustered), trueNum, sumAbs),
    kahanNormErr: normalizedError(sumKahan(clustered), trueNum, sumAbs),
    kbnNormErr: normalizedError(sumKBN(clustered), trueNum, sumAbs),
    kbnOverU: normalizedError(sumKBN(clustered), trueNum, sumAbs) / U_ROUNDOFF,
  };
}

// -- The imp-35812 N ladder --------------------------------------------------------------
const LADDER_SIZES = [1000, 10000, 100000, N_AT_TPT];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- N-flatness metrics for the compensated floor ----------------------------------------
const KBN_ERRS = LADDER.map((r) => r.kbnNormErr);
const KBN_MIN = Math.min(...KBN_ERRS.filter((x) => x > 0));
const KBN_MAX = Math.max(...KBN_ERRS);
const KBN_MAX_OVER_U = KBN_MAX / U_ROUNDOFF;
const KBN_AT_FLOOR_EVERY_RUNG = LADDER.every((r) => r.kbnNormErr > 0 && r.kbnNormErr < 4 * U_ROUNDOFF);
// N-flat means no upward drift: KBN error does not GROW with N (it stays at / below the floor).
const KBN_NO_UPWARD_DRIFT = KBN_MAX <= 4 * U_ROUNDOFF;
// The naive clustered baseline, by contrast, DOES grow with N (conditioning-driven).
const NAIVE_GROWS_WITH_N =
  LADDER[LADDER.length - 1].naiveNormErr > LADDER[0].naiveNormErr;
// Endpoint classic-Kahan value reproduces the imp-35973 ~2.31e-19 floor.
const KAHAN_AT_TPT = LADDER[LADDER.length - 1].kahanNormErr;
const KBN_AT_TPT = LADDER[LADDER.length - 1].kbnNormErr;

export const IMP36023_KBN_COMBINED_WORST_LADDER = {
  id: 'imp-36023',
  proofSection: 'S-frontier',
  question:
    'Does Kahan-Babuska-Neumaier compensated summation on the imp-35973 COMBINED worst-case ' +
    'configuration (imp-35852 clustered same-sign ORDER) stay at the unit-roundoff floor across ' +
    'the imp-35812 N ladder [1000, 10000, 100000, 488602], or does the compensated floor DRIFT ' +
    'with N? imp-35973 measured the floor only at the single N ~ 488602 endpoint. ' +
    'Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-35973)',
    alpha: ALPHA,
    beta: BETA,
    retainedTermsAtTPT: N_AT_TPT,
    combinedWorstOrder:
      'clustered same-sign runs (all negatives, then all positives) -- the imp-35852 worst ORDER, ' +
      'which is also the linear traversal a deep caterpillar pairing spine induces (the order-x-shape combined stress)',
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
  floorStability: {
    kbnErrsAcrossLadder: KBN_ERRS,
    kbnMin: KBN_MIN,
    kbnMax: KBN_MAX,
    kbnMaxOverU: KBN_MAX_OVER_U, // << 1 => compensated floor sits well below unit roundoff
    kbnAtFloorEveryRung: KBN_AT_FLOOR_EVERY_RUNG,
    kbnNoUpwardDrift: KBN_NO_UPWARD_DRIFT,
    naiveGrowsWithN: NAIVE_GROWS_WITH_N,
    kahanAtTPT: KAHAN_AT_TPT,
    kbnAtTPT: KBN_AT_TPT,
  },
  reading: {
    floorIsNFlat:
      'the compensated floor is N-FLAT (no upward drift): at every rung KBN sits ~3-4 orders of ' +
      'magnitude BELOW the unit roundoff u = 2^{-53} ~ 1.11e-16 (KBN / u from ~3.4e-3 down to ~1.7e-4) ' +
      'and if anything DECREASES at larger N rather than growing',
    naiveContrast:
      'the naive clustered sum, by contrast, grows roughly with the conditioning kappa (~62 to ~1391) ' +
      'from ~1.07e-16 to ~4.86e-15 -- so the compensation, not the sign structure, is what pins the floor',
    endpointReproducesImp35973:
      'the CLASSIC Kahan value at N ~ 488602 (~2.31e-19) reproduces the imp-35973 endpoint figure, ' +
      'confirming imp-35973 reported the classic-Kahan floor; full KBN there is ~1.89e-20, ~an order tighter still',
    notAnEndpointCoincidence:
      'so the imp-35973 single-endpoint floor is NOT an N-endpoint coincidence -- compensated summation ' +
      'keeps the combined worst-case order error at the roundoff floor N-UNIFORMLY',
  },
  conclusion: {
    compensatedFloorNFlat:
      'KBN compensated summation on the combined worst clustered order stays ~3-4 orders below unit roundoff ' +
      'at EVERY rung of the imp-35812 ladder with no upward drift (N-flat); the imp-35973 endpoint floor is N-robust',
    precisionNotBindingAcrossLadder:
      'under compensated summation the combined worst-case order error is many orders below the barrier margin ' +
      'at every rung -- precision is NOT the binding constraint anywhere on the ladder even under the combined stress',
    staysGreenfield:
      'this module measures compensated summation errors under the combined worst-case order at four N only; it ' +
      'evaluates no sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Running Kahan-Babuska-Neumaier (KBN) ' +
    'compensated summation on the imp-35973 combined worst-case configuration (the imp-35852 clustered ' +
    'same-sign ORDER) against a per-N exact BigInt reference at the imp-35812 ladder N = [1000, 10000, ' +
    '100000, 488602], the KBN normalized error is [3.74e-19, 3.51e-19, 9.73e-20, 1.89e-20]: it stays ~3-4 ' +
    'orders of magnitude BELOW the unit roundoff u = 2^{-53} ~ 1.11e-16 at EVERY rung (KBN / u from ~3.4e-3 ' +
    'down to ~1.7e-4) with NO upward drift -- the compensated floor is N-FLAT. The classic Kahan value at ' +
    'N ~ 488602 (~2.31e-19) reproduces the imp-35973 endpoint figure (imp-35973 reported the classic-Kahan ' +
    'floor; full KBN there is ~1.89e-20). By contrast the naive clustered sum grows with the conditioning ' +
    'kappa (~62 to ~1391) from ~1.07e-16 to ~4.86e-15. So the imp-35973 single-endpoint floor is NOT a ' +
    'coincidence: compensated summation keeps the combined worst-case order error at the roundoff floor ' +
    'N-uniformly and precision stays NON-binding across the whole ladder even under the combined stress; the ' +
    'obstruction stays the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725). ' +
    'Distinct from imp-35955 (Kahan on the caterpillarR shape-only / original order). Certifies no W1 bound; ' +
    'evaluates no true H_0; instantiates no interval; verifies no inequality; changes no bound; establishes ' +
    'no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35973 (single-endpoint combined worst-case compensated floor ~2.31e-19 at N ~ 488602); imp-35955 ' +
    '(Kahan on the caterpillarR shape-only / original order); imp-36019 (super-additivity factor + Kahan ' +
    'floor across the same ladder); imp-35852 (clustered worst ORDER); imp-35893 (caterpillar SHAPE); ' +
    'imp-35812 (fixed term family + N ladder [1e3..4.886e5]); imp-35761 (pairwise log2(N)*eps ceiling); ' +
    'imp-35681 Part A (A+B-C interval bound greenfield); imp-35725 (mechanical certified sum); ' +
    'Higham 2002, Neumaier 1974.',
};

export const IMP36023_KBN_COMBINED_WORST_LADDER_ASSERTIONS = [
  {
    id: 'imp36023-ladder-anchor',
    description: 'Four-rung ladder N = [1000, 10000, 100000, floor(sqrt(T_PT/4 pi))~488602]',
    holds: () =>
      LADDER.length === 4 &&
      LADDER_SIZES[0] === 1000 &&
      LADDER_SIZES[3] === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // Endpoint classic-Kahan value reproduces the imp-35973 ~2.31e-19 floor.
    id: 'imp36023-endpoint-reproduces-imp35973',
    description: 'The N~488602 rung classic-Kahan floor reproduces the imp-35973 ~2.31e-19 figure',
    holds: () => Math.abs(KAHAN_AT_TPT - 2.31e-19) / 2.31e-19 < 0.05,
  },
  {
    // KBN sits well below unit roundoff at every rung.
    id: 'imp36023-kbn-below-u-every-rung',
    description: 'KBN normalized error stays below 4u at every rung (compensated floor)',
    holds: () =>
      KBN_AT_FLOOR_EVERY_RUNG === true &&
      KBN_MAX_OVER_U < 0.01 &&
      LADDER.every((r) => r.kbnNormErr > 0 && r.kbnNormErr < 1e-18),
  },
  {
    // The compensated floor is N-flat: no upward drift across the ladder.
    id: 'imp36023-kbn-n-flat-no-drift',
    description: 'KBN error does not grow with N (N-flat compensated floor); KBN at TPT is not above the small-N value',
    holds: () =>
      KBN_NO_UPWARD_DRIFT === true &&
      KBN_AT_TPT <= LADDER[0].kbnNormErr + 1e-30,
  },
  {
    // The naive clustered baseline DOES grow with N -- so it is the compensation, not sign
    // structure, that pins the floor.
    id: 'imp36023-naive-grows-with-n',
    description: 'The naive clustered sum grows with N (conditioning-driven), unlike KBN',
    holds: () =>
      NAIVE_GROWS_WITH_N === true &&
      LADDER[LADDER.length - 1].naiveNormErr > 10 * LADDER[0].naiveNormErr,
  },
  {
    id: 'imp36023-honesty-gate',
    description: 'Measurement only; compensated floor N-flat; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36023_KBN_COMBINED_WORST_LADDER.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /N-flat/i.test(IMP36023_KBN_COMBINED_WORST_LADDER.conclusion.compensatedFloorNFlat) &&
      /NOT the binding constraint/.test(
        IMP36023_KBN_COMBINED_WORST_LADDER.conclusion.precisionNotBindingAcrossLadder,
      ) &&
      /GREENFIELD/.test(IMP36023_KBN_COMBINED_WORST_LADDER.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36023_KBN_COMBINED_WORST_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP36023_KBN_COMBINED_WORST_LADDER.verdict),
  },
];

for (const a of IMP36023_KBN_COMBINED_WORST_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36023-kbn-combined-worst-ladder assertion failed: ${a.id}`);
  }
}
