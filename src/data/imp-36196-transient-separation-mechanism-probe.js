/**
 * @module imp-36196-transient-separation-mechanism-probe
 *
 * imp-36196 (numerical, S-frontier): measure/characterize the imp-36112 TRANSIENT
 * KBN-vs-classic-Kahan separation episode at N ~ 1500-3000 and assess whether ANY coarse
 * closed-form law (a conditioning number or a term-cancellation event count) PREDICTS it,
 * since imp-36112 records the transient episode only as a "conditioning/rounding-level event"
 * with NO derived mechanism.
 *
 * BACKGROUND. imp-36076 densified the imp-36023 ladder and found that on the imp-35852
 * clustered same-sign worst order, classic single-compensation Kahan and Kahan-Babuska-Neumaier
 * (KBN) are BIT-IDENTICAL at N = 1000, 10000, 20000, 30000 but SEPARATE (ratio 2.3-3.7x) at
 * N = 1500, 2000, 3000 and again at every rung from 50000 up. imp-36112 merged that with the
 * imp-36062 ladder into a two-episode record (transient N~1500-3000, tie plateau N~10000-33000,
 * persistent separation from N~34000) and explicitly flagged the transient episode as lacking a
 * closed-form mechanistic account. imp-36076 offered a QUALITATIVE mechanism -- "the separation
 * fires when the clustered running sum magnitude dips below an incoming term, the |s| < |x| case
 * KBN corrects and classic Kahan does not." This module TESTS that qualitative mechanism, and two
 * other natural closed-form candidates, against the measured separated/tied flag.
 *
 * THREE CANDIDATE CLOSED-FORM PREDICTORS, each recomputed live below and each REFUTED:
 *
 *   (C1) KBN else-branch firing count -- the literal imp-36076 mechanism. The KBN loop takes its
 *        else branch exactly when |running s| < |incoming x|. Counting NON-TRIVIAL firings
 *        (excluding the trivial s = 0 first-term event, for which 0 >= |x| is false at every N):
 *        the count is IDENTICALLY ZERO at every rung of the ladder. The |s| < |x| event never
 *        fires for a nonzero running sum on this clustered order, so it cannot discriminate the
 *        separated rungs from the tied ones. The imp-36076 qualitative mechanism, taken literally,
 *        is NOT the operative event.
 *
 *   (C2) catastrophic-cancellation conditioning number kappa(N) = (sum |t_k|) / |sum t_k|. This is
 *        MONOTONE INCREASING across the ladder (~62 at N=1000 up to ~889 at N=200000) while the
 *        separated/tied flag flips on (1500-3000), off (10000-30000), then on (50000+). A monotone
 *        quantity cannot track an intermittent on/off/on flag, so kappa(N) does NOT predict the
 *        transient episode either.
 *
 *   (C3) classic-Kahan compensation-loss event count -- iterations where the carried compensation c
 *        is dropped because (t_k - c) rounds back to t_k. This count is UNCORRELATED with the flag:
 *        tied rungs carry MORE loss events than separated ones (e.g. tied N=10000 has 3, separated
 *        N=2000 has 0), so it does not predict separation.
 *
 * READING. All three natural coarse predictors FAIL. The transient N ~ 1500-3000 separation is
 * therefore genuinely ORDER-/BIT-SPECIFIC: it lives in the exact low-order rounding of the
 * compensation FOLD (classic Kahan folds c back into each addition via y = t_k - c and can lose it
 * when |c| falls below half an ulp of the term, whereas KBN accumulates c separately and recovers
 * it in one final s + c), and depends on the precise magnitude alignment of terms in the clustered
 * order rather than on any global conditioning statistic or branch-count. So imp-36112's description
 * of the episode as a "conditioning/rounding-level event, not a derived law" is CONFIRMED as the
 * accurate characterization: no coarse closed-form law of the three natural candidates predicts it.
 *
 * RELATION TO imp-36178. imp-36178 independently took the mechanism DOWN a further level: it too
 * refuted the imp-36076 |s| < |x| mechanism (candidate C1 here) and, by measuring the terminal
 * difference of the two Float64 results, identified the operative event as a BINARY 0-or-1-ULP
 * terminal-rounding toggle whose firing is set by the equidistributed irrational-phase fractional
 * position of the exact-sum tail on the double grid, with no closed form in N. This module is the
 * COMPLEMENTARY assessment specifically named in the imp-36196 description -- whether a CONDITIONING
 * NUMBER or a TERM-CANCELLATION count predicts the episode -- two candidate laws imp-36178 did not
 * test; both are refuted here, consistent with imp-36178's "no clean law in N" verdict.
 *
 * NAMED SUB-GAP (still open): an exact bit-level predictor of the intermittent separation flag from
 * the term magnitudes alone -- a per-rung fold-underflow criterion -- remains unidentified (imp-36178
 * localizes it to the 1-ULP terminal toggle but supplies no closed form in N for WHEN it fires).
 *
 * Precision remains NON-binding throughout regardless (imp-36076: worst classic Kahan / u ~ 2% at
 * N ~ 3000), so this refinement changes no bound: the obstruction stays the ENGINEERING of the
 * certified length-N interval sum (MECHANICAL, imp-35725); the W1 A + B - C certificate at T_PT
 * stays GREENFIELD (imp-35681 Part A).
 *
 * MEASUREMENT/ASSESSMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity; the C_mb
 * GUE-conditional constant (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36112-compensated-summation-storyline-crossref (records the transient episode as lacking a derived mechanism)
 * @see imp-36178-transient-separation-mechanism (independent derivation: 1-ULP terminal-rounding toggle, no closed form in N)
 * @see imp-36076-kahan-kbn-separation-onset (finer small-N ladder; the qualitative |s|<|x| mechanism tested here)
 * @see imp-36023-kbn-combined-worst-ladder (coarse four-rung KBN N-flat floor)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see imp-35681-w1-a-b-c-certificate-scope (A+B-C interval bound greenfield)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974)
 */

// -- Operative constants (import-light; matching imp-36076) ------------------------------
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16

// Same representative oscillatory term as imp-36076 / imp-36023.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Summation schemes, instrumented for the three candidate predictors -------------------
// Classic Kahan, counting compensation-loss events: iterations where the carried c is dropped
// because (t_k - c) rounds back to t_k (c below half an ulp of the term).
function sumKahanInstrumented(terms) {
  let s = 0;
  let c = 0;
  let lostEvents = 0;
  for (let i = 0; i < terms.length; i++) {
    if (c !== 0 && terms[i] - c === terms[i]) lostEvents++;
    const y = terms[i] - c;
    const t = s + y;
    c = t - s - y;
    s = t;
  }
  return { sum: s, lostEvents };
}

// KBN, counting NON-TRIVIAL else-branch firings (|s| < |x| with s != 0) -- excludes the trivial
// s = 0 first-term event that fires at every N.
function sumKBNInstrumented(terms) {
  let s = 0;
  let c = 0;
  let nontrivialElse = 0;
  for (let i = 0; i < terms.length; i++) {
    const x = terms[i];
    const t = s + x;
    if (Math.abs(s) >= Math.abs(x)) {
      c += (s - t) + x;
    } else {
      c += (x - t) + s;
      if (s !== 0) nontrivialElse++;
    }
    s = t;
  }
  return { sum: s + c, nontrivialElse };
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

// -- Measure the flag + the three candidate predictors at one N on the clustered order ----
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

  // imp-35852 combined worst ORDER: clustered same-sign runs (all negatives, then all positives).
  const neg = [];
  const pos = [];
  for (let i = 0; i < N; i++) {
    if (base[i] < 0) neg.push(base[i]);
    else pos.push(base[i]);
  }
  const clustered = Float64Array.from(neg.concat(pos));

  const kahanI = sumKahanInstrumented(clustered);
  const kbnI = sumKBNInstrumented(clustered);
  const kahanNormErr = normalizedError(kahanI.sum, trueNum, sumAbs);
  const kbnNormErr = normalizedError(kbnI.sum, trueNum, sumAbs);
  const ratio = kbnNormErr > 0 ? kahanNormErr / kbnNormErr : 1;

  // True final sum magnitude (exact reference collapsed to a double) for the conditioning number.
  const trueSumDouble = Number(trueNum << 80n) / 2 ** 80 / 2 ** 96;
  const conditioningNumber = sumAbs / Math.abs(trueSumDouble); // kappa(N) = (sum |t_k|)/|sum t_k|

  return {
    N,
    separated: ratio > 1.05, // classic Kahan strictly worse than KBN at this rung
    ratio,
    nontrivialElse: kbnI.nontrivialElse, // candidate C1
    conditioningNumber, // candidate C2
    kahanLostEvents: kahanI.lostEvents, // candidate C3
  };
}

// -- Transient-focused ladder: straddles the transient episode, the tie plateau, and re-onset -
const LADDER_SIZES = [1000, 1500, 2000, 3000, 10000, 20000, 30000, 50000, 100000, 200000];
const LADDER = LADDER_SIZES.map((N) => measureAtN(N));

// -- Candidate-predictor verdicts ---------------------------------------------------------
// C1: the KBN else-branch never fires non-trivially, so it cannot discriminate separated from tied.
const C1_ELSE_ALWAYS_ZERO = LADDER.every((r) => r.nontrivialElse === 0);

// C2: the conditioning number is MONOTONE increasing across the ladder, so it cannot track the
// intermittent on/off/on separated flag.
const C2_CONDITIONING_MONOTONE = LADDER.every(
  (r, i) => i === 0 || r.conditioningNumber > LADDER[i - 1].conditioningNumber,
);

// C3: the Kahan compensation-loss count is uncorrelated with the flag -- there exists a TIED rung
// with strictly more loss events than some SEPARATED rung (the opposite of a predictive law).
const SEP = LADDER.filter((r) => r.separated);
const TIED = LADDER.filter((r) => !r.separated);
const C3_LOSS_UNCORRELATED =
  TIED.some((t) => SEP.some((s) => t.kahanLostEvents > s.kahanLostEvents));

// The flag itself is intermittent (sep at 1500-3000, tie at 10000-30000, sep at 50000+) --
// confirms this ladder actually reproduces the imp-36076 transient episode being explained.
const TRANSIENT = LADDER.filter((r) => r.N >= 1500 && r.N <= 3000);
const TIE_PLATEAU = LADDER.filter((r) => r.N >= 10000 && r.N <= 30000);
const REONSET = LADDER.filter((r) => r.N >= 50000);
const FLAG_IS_INTERMITTENT =
  TRANSIENT.length > 0 && TRANSIENT.every((r) => r.separated) &&
  TIE_PLATEAU.length > 0 && TIE_PLATEAU.every((r) => !r.separated) &&
  REONSET.length > 0 && REONSET.every((r) => r.separated);

const ALL_THREE_CANDIDATES_FAIL =
  C1_ELSE_ALWAYS_ZERO && C2_CONDITIONING_MONOTONE && C3_LOSS_UNCORRELATED;

export const IMP36196_TRANSIENT_SEPARATION_MECHANISM_PROBE = Object.freeze({
  id: 'imp-36196',
  proofSection: 'S-frontier',
  question:
    'Is the imp-36112 transient KBN-vs-classic-Kahan separation episode at N ~ 1500-3000 predicted ' +
    'by any coarse closed-form law -- the imp-36076 qualitative |s| < |x| mechanism, a cancellation ' +
    'conditioning number, or a compensation-loss event count -- or is it order-/bit-specific? ' +
    'Measurement/assessment only; changes no bound; NO QED.',
  representativeSum: Object.freeze({
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36076)',
    alpha: ALPHA,
    beta: BETA,
    combinedWorstOrder:
      'clustered same-sign runs (all negatives, then all positives) -- the imp-35852 worst ORDER',
  }),
  unitRoundoff: U_ROUNDOFF,
  ladderSizes: LADDER_SIZES,
  ladder: LADDER.map((r) => ({
    N: r.N,
    separated: r.separated,
    ratio: Number(r.ratio.toFixed(4)),
    nontrivialElse: r.nontrivialElse,
    conditioningNumber: Number(r.conditioningNumber.toExponential(4)),
    kahanLostEvents: r.kahanLostEvents,
  })),
  candidateVerdicts: Object.freeze({
    c1_kbnElseBranchCount: Object.freeze({
      candidate: 'the literal imp-36076 mechanism: count of KBN |s| < |x| else-branch firings',
      elseAlwaysZeroNonTrivially: C1_ELSE_ALWAYS_ZERO,
      verdict:
        'REFUTED -- the non-trivial else-branch count is identically 0 at every rung, so it cannot ' +
        'discriminate separated from tied; the |s| < |x| event never fires for a nonzero running sum',
    }),
    c2_conditioningNumber: Object.freeze({
      candidate: 'kappa(N) = (sum |t_k|) / |sum t_k|, the catastrophic-cancellation conditioning number',
      monotoneIncreasing: C2_CONDITIONING_MONOTONE,
      verdict:
        'REFUTED -- kappa(N) is monotone increasing across the ladder while the separated flag is ' +
        'intermittent (on 1500-3000, off 10000-30000, on 50000+); a monotone quantity cannot track it',
    }),
    c3_kahanCompensationLossCount: Object.freeze({
      candidate: 'count of classic-Kahan iterations where the carried compensation c is dropped',
      uncorrelatedWithFlag: C3_LOSS_UNCORRELATED,
      verdict:
        'REFUTED -- uncorrelated with the flag: some TIED rung carries strictly more loss events than ' +
        'some SEPARATED rung, the opposite of a predictive law',
    }),
  }),
  flagIsIntermittent: FLAG_IS_INTERMITTENT,
  allThreeCandidatesFail: ALL_THREE_CANDIDATES_FAIL,
  reading: Object.freeze({
    orderBitSpecific:
      'all three natural coarse predictors FAIL, so the transient N ~ 1500-3000 separation is genuinely ' +
      'ORDER-/BIT-SPECIFIC: it lives in the exact low-order rounding of the compensation FOLD (classic ' +
      'Kahan folds c back via y = t_k - c and can lose it when |c| falls below half an ulp of the term, ' +
      'while KBN accumulates c separately and recovers it in one final s + c), depending on precise term ' +
      'magnitude alignment in the clustered order rather than on any global statistic or branch-count',
    imp36112Confirmed:
      'imp-36112 was right to record the episode as a conditioning/rounding-level event, not a derived ' +
      'law: none of the three natural closed-form candidates predicts it',
    precisionNonBinding:
      'precision stays NON-binding regardless (imp-36076: worst classic Kahan / u ~ 2% at N ~ 3000), so ' +
      'this refinement changes no bound',
  }),
  namedSubGap:
    'OPEN: an exact bit-level predictor of the intermittent separation flag from the term magnitudes ' +
    'alone -- a per-rung compensation-fold-underflow criterion -- remains unidentified. No coarse ' +
    'closed-form law (else-branch count, conditioning number, or loss-event count) supplies it.',
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT/ASSESSMENT (frontier-direction, NOT a certified bound). Testing three natural ' +
    'closed-form candidate predictors of the imp-36112 transient KBN-vs-classic-Kahan separation episode ' +
    'at N ~ 1500-3000 on the imp-35852 clustered worst order against an exact per-N BigInt reference: ' +
    '(C1) the literal imp-36076 |s| < |x| KBN else-branch mechanism fires ZERO times non-trivially at ' +
    'every rung; (C2) the cancellation conditioning number kappa(N) is monotone increasing while the ' +
    'separated flag is intermittent; (C3) the classic-Kahan compensation-loss count is uncorrelated with ' +
    'the flag (tied rungs carry more loss events than separated ones). All three FAIL, so the transient ' +
    'episode is order-/bit-specific, living in the exact low-order rounding of the compensation fold -- ' +
    'confirming imp-36112 that it is a conditioning/rounding-level event, not a derived law. Named ' +
    'sub-gap: an exact bit-level fold-underflow predictor of the flag remains OPEN. Precision stays ' +
    'NON-binding throughout (imp-36076: worst Kahan / u ~ 2%). Certifies no W1 bound; evaluates no true ' +
    'H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; ' +
    'the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); ' +
    'C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36112 (transient episode flagged as lacking a derived mechanism); imp-36178 (independent ' +
    'derivation: 1-ULP terminal-rounding toggle, no closed form in N); imp-36076 (finer small-N ' +
    'ladder; the qualitative |s|<|x| mechanism tested here); imp-36023 (coarse four-rung KBN N-flat ' +
    'floor); imp-35852 (clustered worst ORDER); imp-35812 (fixed term family + N ladder [1e3..4.886e5]); ' +
    'imp-35681 Part A (A+B-C interval bound greenfield); imp-35725 (mechanical certified sum); ' +
    'Higham 2002, Neumaier 1974.',
});

export const IMP36196_TRANSIENT_SEPARATION_MECHANISM_PROBE_ASSERTIONS = [
  {
    id: 'imp36196-flag-intermittent',
    description: 'The ladder reproduces the transient episode: sep at 1500-3000, tie at 10000-30000, sep at 50000+',
    holds: () => FLAG_IS_INTERMITTENT === true,
  },
  {
    id: 'imp36196-c1-else-branch-refuted',
    description: 'Candidate C1 (KBN else-branch count) is identically 0 non-trivially, so cannot discriminate',
    holds: () => C1_ELSE_ALWAYS_ZERO === true,
  },
  {
    id: 'imp36196-c2-conditioning-monotone-refuted',
    description: 'Candidate C2 (conditioning number) is monotone increasing, so cannot track the intermittent flag',
    holds: () => C2_CONDITIONING_MONOTONE === true,
  },
  {
    id: 'imp36196-c3-loss-count-uncorrelated-refuted',
    description: 'Candidate C3 (Kahan compensation-loss count) is uncorrelated -- a tied rung exceeds a separated rung',
    holds: () => C3_LOSS_UNCORRELATED === true,
  },
  {
    id: 'imp36196-all-three-fail',
    description: 'All three natural closed-form candidate predictors fail -- the episode is order-/bit-specific',
    holds: () => ALL_THREE_CANDIDATES_FAIL === true,
  },
  {
    id: 'imp36196-honesty-gate',
    description: 'Measurement only; named sub-gap open; no new bound; no refereed bound is changed; NO QED',
    holds: () =>
      IMP36196_TRANSIENT_SEPARATION_MECHANISM_PROBE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /OPEN/.test(IMP36196_TRANSIENT_SEPARATION_MECHANISM_PROBE.namedSubGap) &&
      /GREENFIELD/.test(IMP36196_TRANSIENT_SEPARATION_MECHANISM_PROBE.verdict) &&
      /NO QED/.test(IMP36196_TRANSIENT_SEPARATION_MECHANISM_PROBE.verdict) &&
      /refereed bound is changed/i.test(IMP36196_TRANSIENT_SEPARATION_MECHANISM_PROBE.verdict),
  },
];

for (const a of IMP36196_TRANSIENT_SEPARATION_MECHANISM_PROBE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36196-transient-separation-mechanism-probe assertion failed: ${a.id}`);
  }
}
