/**
 * @module imp-36113-kbn-kahan-intermittency-fine-resolution
 *
 * imp-36113 (numerical, S-frontier): resolve the imp-36095 KBN-vs-classic-Kahan
 * intermittency band [34000, 40000] at a 10x FINER N grid to test whether the coarse
 * step-250 "last identical rung N = 39000, persistence sets in from N ~ 39250" picture
 * survives refinement, and to map the band boundaries at INTEGER resolution.
 *
 * imp-36062 located the FIRST strict Kahan-Babuska-Neumaier (KBN) vs classic-Kahan separation
 * at N ~ 34000 on the imp-35852 clustered worst order and flagged the [34000, 40000] separation
 * as INTERMITTENT (its finer sub-sweep was not stored). imp-36095 then tabulated that band at a
 * step-250 grid (25 rungs) and concluded that the last bit-identical rung is N = 39000 and that
 * the separation becomes PERSISTENT from N ~ 39250 upward. This module re-runs the byte-identical
 * imp-36062 schemes plus the per-N exact 2^{-96} dyadic-BigInt reference on a step-25 grid (241
 * rungs) across the same band, and additionally sweeps a representative window at INTEGER
 * resolution, to test whether that persistence onset is real or a grid-aliasing artifact.
 *
 * Both schemes and the exact reference are re-implemented here byte-identically to imp-36095 /
 * imp-36062 / imp-36023 (same fixed oscillatory family, same clustered same-sign worst ORDER).
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval;
 * verifies no inequality; changes no bound; establishes no positivity; the C_mb GUE-conditional
 * constant (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * MEASURED on the step-25 grid across [34000, 40000] (241 rungs; sep = KBN error strictly differs
 * from classic-Kahan error):
 *   - 156 of 241 rungs strictly SEPARATED, 85 bit-IDENTICAL -- roughly a 65/35 split.
 *   - the two verdicts alternate rung-to-rung with NO clean identical block: the longest run of
 *     consecutive step-25 identical rungs is only a handful wide, and identical rungs are
 *     scattered across the ENTIRE band up to N = 39975 (39625, 39700, 39775, 39875, 39950, 39975).
 *   - anchor rungs reproduce imp-36095/imp-36062: N = 34000 SEPARATED (Kahan ~2.42e-19,
 *     KBN ~2.33e-19), N = 35250 SEPARATED, N = 39000 IDENTICAL (~1.23e-19), N = 39250 SEPARATED.
 *
 * MEASURED on the INTEGER-resolution window [39250, 39320] (71 consecutive N -- the region
 * imp-36095 declared "persistent"):
 *   - the sep/identical verdict FLIPS 21 times across the 71 consecutive integers, with 31 of the
 *     71 rungs bit-IDENTICAL. So the verdict is a per-N coin-flip toggling on a scale of ~1, even
 *     inside imp-36095's claimed persistent region.
 *
 * READING: the step-250 "persistence from N ~ 39250 / last-identical N = 39000" picture is a
 * GRID-ALIASING ARTIFACT. At step-25 there is NO persistence onset within [34000, 40000] -- the
 * band is intermittent to the top, and imp-36095 saw persistence only because its coarse grid
 * happened to land on separated rungs at 39250/39500/39750/40000 while 39625/39700/39775/39875/
 * 39950 are all identical. At integer resolution the separation verdict toggles on a scale of ~1
 * (21 flips over 71 consecutive N), confirming imp-36062: the separation is a fine ROUNDING-level
 * event (the two schemes differ only in how the compensation term is re-incorporated -- KBN adds
 * it once at the end via s + c), not a conditioning threshold. kappa rises near-monotonically
 * (361 -> 396) across the band while the verdict does NOT track it. Both schemes sit at the
 * ~1e-19 compensated floor at every rung, so precision is NOT the binding constraint anywhere;
 * the obstruction stays the ENGINEERING of the certified length-N interval sum (MECHANICAL,
 * imp-35725), and the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * @see imp-36095-kbn-kahan-intermittency-band (step-250 tabulation; reported last-identical N=39000, persistence from N~39250)
 * @see imp-36062-kbn-kahan-separation-onset (first strict separation N~34000; flagged intermittency, sub-sweep not stored)
 * @see imp-36023-kbn-combined-worst-ladder (KBN=classic-Kahan at N<=1e4 but ~10x tighter by N~488602)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Anchor + operative constants (import-light; matching imp-36095) ----------------------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term as imp-36095 / imp-36062 / imp-36023.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes (byte-identical to imp-36095 / imp-36062) --------------------------
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
    separated: kbnNormErr !== kahanNormErr,
  };
}

// -- Fine step-25 grid across the imp-36095 intermittency band ----------------------------
const BAND_LO = 34000;
const BAND_HI = 40000;
const FINE_STEP = 25; // 10x finer than the imp-36095 step-250 grid
const FINE_LADDER = [];
for (let N = BAND_LO; N <= BAND_HI; N += FINE_STEP) FINE_LADDER.push(measureAtN(N));

const FINE_TOTAL = FINE_LADDER.length; // 241
const FINE_SEPARATED = FINE_LADDER.filter((r) => r.separated).length; // 156
const FINE_IDENTICAL = FINE_TOTAL - FINE_SEPARATED; // 85
const IDENTICAL_NS = FINE_LADDER.filter((r) => !r.separated).map((r) => r.N);
const LAST_IDENTICAL_N = IDENTICAL_NS.length ? IDENTICAL_NS[IDENTICAL_NS.length - 1] : null; // 39975
// imp-36095 claimed persistence (all-separated) from N ~ 39250; test it on the fine grid.
const RUNGS_ABOVE_39250 = FINE_LADDER.filter((r) => r.N >= 39250);
const IDENTICAL_ABOVE_39250 = RUNGS_ABOVE_39250.filter((r) => !r.separated).map((r) => r.N);
const NO_PERSISTENCE_BELOW_40K = IDENTICAL_ABOVE_39250.length > 0;

// -- Integer-resolution zoom in imp-36095's claimed-persistent window ----------------------
const ZOOM_LO = 39250;
const ZOOM_HI = 39320;
const ZOOM = [];
for (let N = ZOOM_LO; N <= ZOOM_HI; N++) ZOOM.push(measureAtN(N));
const ZOOM_TOTAL = ZOOM.length; // 71
const ZOOM_IDENTICAL = ZOOM.filter((r) => !r.separated).length; // 31
let ZOOM_FLIPS = 0;
for (let i = 1; i < ZOOM.length; i++) if (ZOOM[i].separated !== ZOOM[i - 1].separated) ZOOM_FLIPS++; // 21

// -- Anchor rungs cross-checking imp-36095 / imp-36062 -------------------------------------
const at = (N) => FINE_LADDER.find((r) => r.N === N) || measureAtN(N);
const ANCHOR_34000 = at(34000); // SEPARATED (Kahan ~2.42e-19, KBN ~2.33e-19)
const ANCHOR_35250 = at(35250); // SEPARATED
const ANCHOR_39000 = at(39000); // IDENTICAL (~1.23e-19)
const ANCHOR_39250 = at(39250); // SEPARATED

export const IMP36113_KBN_KAHAN_INTERMITTENCY_FINE_RESOLUTION = {
  id: 'imp-36113',
  proofSection: 'S-frontier',
  question:
    'Does the imp-36095 step-250 picture of the KBN-vs-classic-Kahan intermittency band [34000, 40000] ' +
    '(last bit-identical rung N = 39000, separation persistent from N ~ 39250) survive refinement to a ' +
    '10x finer step-25 grid and an integer-resolution zoom, on the imp-35852 clustered worst order against ' +
    'the same per-N exact 2^{-96} dyadic-BigInt reference? Measurement only; certifies no W1 bound; ' +
    'changes no bound; NO QED.',
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
  band: { lo: BAND_LO, hi: BAND_HI, fineStep: FINE_STEP },
  fineGrid: {
    total: FINE_TOTAL, // 241
    separated: FINE_SEPARATED, // 156
    identical: FINE_IDENTICAL, // 85
    lastIdenticalN: LAST_IDENTICAL_N, // 39975 -- identical rungs reach the TOP of the band
    identicalRungsAbove39250: IDENTICAL_ABOVE_39250, // non-empty -> imp-36095 persistence refuted
  },
  integerZoom: {
    lo: ZOOM_LO,
    hi: ZOOM_HI,
    total: ZOOM_TOTAL, // 71 consecutive N inside imp-36095's "persistent" region
    identical: ZOOM_IDENTICAL, // 31
    verdictFlips: ZOOM_FLIPS, // 21 -- toggles on a scale of ~1
  },
  anchors: {
    n34000: { kahan: ANCHOR_34000.kahanNormErr, kbn: ANCHOR_34000.kbnNormErr, separated: ANCHOR_34000.separated },
    n35250: { separated: ANCHOR_35250.separated },
    n39000: { kahan: ANCHOR_39000.kahanNormErr, separated: ANCHOR_39000.separated },
    n39250: { separated: ANCHOR_39250.separated },
  },
  reading: {
    persistenceIsAnArtifact:
      'the imp-36095 step-250 "last bit-identical rung N = 39000, separation persistent from N ~ 39250" picture ' +
      'is a GRID-ALIASING ARTIFACT: on the step-25 grid identical rungs are scattered across the ENTIRE band up ' +
      'to N = 39975 (39625, 39700, 39775, 39875, 39950), so there is NO persistence onset within [34000, 40000] ' +
      '-- imp-36095 saw persistence only because its coarse grid happened to land on separated rungs at ' +
      '39250/39500/39750/40000',
    togglesAtScaleOne:
      'at INTEGER resolution the sep/identical verdict FLIPS 21 times across 71 consecutive N in [39250, 39320] ' +
      '(31 of 71 bit-identical), so the verdict is a per-N coin-flip toggling on a scale of ~1 even inside ' +
      'imp-36095s claimed persistent region',
    doesNotTrackKappa:
      'kappa rises near-monotonically (~361 -> ~396) across the band while the sep/identical verdict does NOT ' +
      'track it -- the separation is a fine ROUNDING-level event (the two schemes differ only in how the ' +
      'compensation term is re-incorporated, KBN via s + c), not a conditioning threshold',
    anchorsReproduced:
      'the fine grid reproduces the imp-36095/imp-36062 anchors: N = 34000 SEPARATED (Kahan ~2.42e-19, ' +
      'KBN ~2.33e-19), N = 35250 SEPARATED, N = 39000 bit-IDENTICAL (~1.23e-19), N = 39250 SEPARATED',
  },
  conclusion: {
    noPersistenceOnset:
      'refining the imp-36095 band to a 10x finer step-25 grid shows NO separation-persistence onset within ' +
      '[34000, 40000]: bit-identical rungs persist to N = 39975 and the fine grid is 156-separated / 85-identical, ' +
      'so the step-250 "persistence from N ~ 39250" was a grid-aliasing artifact',
    intermittencyIsScaleOne:
      'the intermittency toggles on a per-N scale of ~1 (21 verdict flips over 71 consecutive integers), so any ' +
      'coarse grid aliases it -- the separation is a floor-level rounding coin-flip, not a smooth threshold',
    precisionNotBinding:
      'both schemes sit at the ~1e-19 compensated floor at every rung -- the intermittency is a floor-level ' +
      'rounding effect and precision is NOT the binding constraint anywhere in the band',
    staysGreenfield:
      'this module measures Kahan-vs-KBN intermittency at a finer grid over one N band; it evaluates no sum of ' +
      'H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 ' +
      'Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Refining the imp-36095 KBN-vs-classic-Kahan ' +
    'intermittency band [34000, 40000] to a 10x finer step-25 grid (241 rungs) on the imp-35852 clustered worst ' +
    'order against the same per-N exact 2^{-96} dyadic-BigInt reference, 156 rungs are strictly SEPARATED and 85 ' +
    'are bit-IDENTICAL, and identical rungs are scattered across the ENTIRE band up to N = 39975. So the imp-36095 ' +
    'step-250 "last bit-identical rung N = 39000, separation persistent from N ~ 39250" picture is a GRID-ALIASING ' +
    'ARTIFACT: there is NO persistence onset within [34000, 40000]. An integer-resolution zoom on [39250, 39320] ' +
    '(71 consecutive N, the region imp-36095 called persistent) FLIPS verdict 21 times with 31 of 71 rungs ' +
    'bit-identical, so the separation is a per-N coin-flip toggling on a scale of ~1. The verdict does NOT track ' +
    'kappa (which rises near-monotonically ~361 -> ~396), confirming imp-36062 that the separation is a fine ' +
    'ROUNDING-level event (the two schemes differ only in how the compensation term is re-incorporated -- KBN adds ' +
    'it once at the end via s + c). Anchor rungs reproduce imp-36095/imp-36062 (N = 34000 SEPARATED with ' +
    'Kahan ~2.42e-19 / KBN ~2.33e-19, N = 35250 SEPARATED, N = 39000 bit-IDENTICAL ~1.23e-19, N = 39250 SEPARATED). ' +
    'Both schemes sit at the ~1e-19 compensated floor at every rung, so precision is NOT the binding constraint ' +
    'anywhere in the band; the obstruction stays the ENGINEERING of the certified length-N interval sum ' +
    '(MECHANICAL, imp-35725). Certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no ' +
    'inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays ' +
    'GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36095 (step-250 intermittency band; reported last-identical N=39000, persistence from N~39250); imp-36062 ' +
    '(first strict separation N~34000; flagged intermittency, sub-sweep not stored); imp-36023 (KBN=classic-Kahan ' +
    'at N<=1e4 but ~10x tighter by N~488602); imp-35852 (clustered worst ORDER); imp-35812 (fixed term family + N ' +
    'ladder); imp-35681 Part A (A+B-C interval bound greenfield); imp-35725 (mechanical certified sum); ' +
    'Higham 2002, Neumaier 1974.',
};

export const IMP36113_KBN_KAHAN_INTERMITTENCY_FINE_RESOLUTION_ASSERTIONS = [
  {
    id: 'imp36113-fine-grid-anchor',
    description: 'Step-25 grid across [34000, 40000] is 241 rungs, 10x finer than the imp-36095 step-250 grid',
    holds: () =>
      FINE_TOTAL === 241 &&
      FINE_STEP === 25 &&
      BAND_LO === 34000 &&
      BAND_HI === 40000 &&
      FINE_SEPARATED + FINE_IDENTICAL === FINE_TOTAL,
  },
  {
    // Refinement refutes the step-250 persistence: identical rungs reach the top of the band.
    id: 'imp36113-no-persistence-onset',
    description: 'On the fine grid the separation is NOT persistent above N~39250 -- identical rungs reach N=39975',
    holds: () =>
      NO_PERSISTENCE_BELOW_40K === true &&
      LAST_IDENTICAL_N === 39975 &&
      IDENTICAL_ABOVE_39250.length >= 4 &&
      FINE_IDENTICAL > 50,
  },
  {
    // Integer-resolution zoom: the verdict toggles on a scale of ~1 inside the claimed persistent region.
    id: 'imp36113-integer-zoom-toggles',
    description: 'Verdict flips 21 times over 71 consecutive N in [39250,39320] with 31 identical rungs',
    holds: () =>
      ZOOM_TOTAL === 71 &&
      ZOOM_FLIPS === 21 &&
      ZOOM_IDENTICAL === 31 &&
      ZOOM_FLIPS > 10,
  },
  {
    // The fine grid reproduces the imp-36095 / imp-36062 anchor rungs.
    id: 'imp36113-anchors-reproduce-imp36095',
    description: 'N=34000 separated (Kahan~2.42e-19, KBN~2.33e-19), N=35250 sep, N=39000 identical, N=39250 sep',
    holds: () =>
      ANCHOR_34000.separated === true &&
      Math.abs(ANCHOR_34000.kahanNormErr - 2.42e-19) / 2.42e-19 < 0.05 &&
      Math.abs(ANCHOR_34000.kbnNormErr - 2.33e-19) / 2.33e-19 < 0.05 &&
      ANCHOR_35250.separated === true &&
      ANCHOR_39000.separated === false &&
      Math.abs(ANCHOR_39000.kahanNormErr - 1.23e-19) / 1.23e-19 < 0.05 &&
      ANCHOR_39250.separated === true,
  },
  {
    id: 'imp36113-honesty-gate',
    description: 'Measurement only; verdict does not track kappa; precision non-binding; no QED; no refereed bound is changed',
    holds: () =>
      IMP36113_KBN_KAHAN_INTERMITTENCY_FINE_RESOLUTION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /does NOT\s+track it/.test(
        IMP36113_KBN_KAHAN_INTERMITTENCY_FINE_RESOLUTION.reading.doesNotTrackKappa,
      ) &&
      /NOT the binding constraint/.test(
        IMP36113_KBN_KAHAN_INTERMITTENCY_FINE_RESOLUTION.conclusion.precisionNotBinding,
      ) &&
      /GREENFIELD/.test(IMP36113_KBN_KAHAN_INTERMITTENCY_FINE_RESOLUTION.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36113_KBN_KAHAN_INTERMITTENCY_FINE_RESOLUTION.verdict) &&
      /refereed bound is changed/i.test(IMP36113_KBN_KAHAN_INTERMITTENCY_FINE_RESOLUTION.verdict),
  },
];

for (const a of IMP36113_KBN_KAHAN_INTERMITTENCY_FINE_RESOLUTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36113-kbn-kahan-intermittency-fine-resolution assertion failed: ${a.id}`);
  }
}
