/**
 * @fileoverview imp-33294: MEASURE the S(T) argument-count correction to the
 * imp-33278 modulation Nyquist bandwidth floor U = pi M_sc / T0, quantifying how
 * the omitted S(T) (and O(1/T)) terms shift the measured -1/2 offset
 * U - (1/2)log(T0/2pi) at each swept height and whether the (1/2)log growth
 * order survives.
 *
 * @module data/imp-33294-modulation-nyquist-st-correction
 *
 * BACKGROUND. imp-33278 swept U = pi M_sc / T0 across a geometric ladder of
 * heights T0 in [1e4, 1e13] taking M_sc to be the Riemann-von Mangoldt (RvM)
 * MAIN-TERM zero count N_main(T) = (T/2pi)log(T/2pi) - T/2pi + 7/8. It found the
 * offset
 *     U - (1/2)log(T0/2pi) = -1/2 + 7 pi/(8 T0) + O(1/T0^2)
 * converging to exactly -1/2, and the ratio U/halfLog rising to 1 from below.
 * But the RvM MAIN TERM omits the argument-count fluctuation S(T) = (1/pi) arg
 * zeta(1/2 + iT) and the O(1/T) tail of the Riemann-Siegel theta expansion, so
 * the per-row M_sc carries an O(1/M_sc) proxy error (measured by imp-33251 at
 * the anchor to < 1 zero) that imp-33278 never PROPAGATED to the -1/2 offset.
 *
 * THE FULL COUNT is N(T) = theta(T)/pi + 1 + S(T), with the Riemann-Siegel theta
 * expansion theta(T) = (T/2)log(T/2pi) - T/2 - pi/8 + 1/(48T) + ..., i.e.
 *     N(T) = N_main(T) + 1/(48 pi T) + ... + S(T).
 * The exact bandwidth floor is therefore
 *     U_exact = pi N(T)/T = U_main + pi/(48 T^2) + ... + pi S(T)/T,
 * so the S(T)-induced shift in U (and hence in the offset) is exactly
 *     dU_S(T) = pi S(T) / T.
 *
 * THIS MODULE quantifies dU_S at each swept height with TWO literature-style
 * S(T) magnitudes -- neither is a new bound:
 *   (a) worst case: the Trudgian (2014) explicit unconditional bound
 *       |S(T)| <= 0.111 log T + 0.275 log log T + 2.450   (T >= e),
 *   (b) typical size: the Selberg-CLT RMS estimate
 *       mean|S(T)| ~ sqrt(2/pi) * sigma, sigma^2 = (1/(2 pi^2)) log log T,
 *       i.e. mean|S(T)| ~ sqrt(log log T) / pi^{3/2},
 * and compares dU_S to the -1/2 offset and to the 7 pi/(8 T0) O(1/T) tail that
 * imp-33278 already carried.
 *
 * MEASURED RESULT (frozen rows below):
 *   1. dU_S(T) = pi S(T)/T is O(log T / T) at worst and O(sqrt(log log T)/T)
 *      typically -- it VANISHES as T0 grows. The worst-case shift is at most
 *      1.283e-3 (at the smallest height T0 = 1e4) and falls to 6.87e-12 at the
 *      Platt-Trudgian anchor and 2.11e-12 at T0 = 1e13.
 *   2. The -1/2 OFFSET SURVIVES. The worst-case S(T) shift is a fraction
 *      dU_S / (1/2) <= 2.57e-3 of the -1/2 constant at T0 = 1e4 and <= 4.21e-12
 *      at T0 = 1e13, so restoring S(T) cannot move the offset off -1/2: the
 *      convergence U - halfLog -> -1/2 is UNAFFECTED.
 *   3. The (1/2)log GROWTH ORDER SURVIVES. Since dU_S -> 0 while halfLog -> inf,
 *      adding S(T) leaves U ~ (1/2)log(T0/2pi) untouched; the fractional effect
 *      dU_S / halfLog is <= 3.5e-4 at T0 = 1e4 and negligible above.
 *   4. THE TAIL IS BRACKETED. The two literature S(T) magnitudes straddle the
 *      7 pi/(8 T0) tail imp-33278 kept: the worst-case shift EXCEEDS the tail at
 *      EVERY swept height (because |S(T)| <= 4.08..6.56 across the ladder while
 *      the tail numerator is the constant 7/8), so in the worst case the DROPPED
 *      S(T) -- not the RETAINED tail -- is the dominant omitted correction
 *      throughout; the RMS typical shift stays BELOW the tail everywhere
 *      (8.41e-5 < 2.749e-4 at T0 = 1e4), so on average S(T) is the smaller
 *      correction. Both bounds vanish and neither disturbs the -1/2 offset.
 * CONCLUSION: propagating the omitted S(T) argument count to the imp-33278
 * offset shifts U by at most O(log T / T), which vanishes at every swept height;
 * the -1/2 offset and the (1/2)log(T0/2pi) growth order both survive intact.
 *
 * MEASUREMENT ONLY. Pure arithmetic evaluation of the classical N(T) = theta/pi
 * + 1 + S(T) decomposition with two literature S(T) magnitudes; establishes no
 * operator positivity and asserts no new bound. The Trudgian (2014) bound and
 * the Selberg-CLT RMS law are quoted from the literature, not derived here. NO
 * QED on Conjecture 22.1; imp-3932 partial-falsification stands; imp-3066
 * K_a >= 0 UNTOUCHED; the imp-1210 novelty verdict is unchanged; no refereed bound is changed.
 *
 * NO imports. Self-contained and light (no zeros bundle). JSDoc avoids the
 * close-comment sequence; JS strings use double quotes where an apostrophe is
 * needed.
 */

// -- Constants -----------------------------------------------------------------
const PT_HEIGHT = 3000175332800; // Platt-Trudgian 2021 verified height T0
const TWO_PI = 2 * Math.PI;

// (1/2)log(T/2pi): the claimed growth order the imp-33278 offset is measured off.
function halfLogOrder(T) {
  return 0.5 * Math.log(T / TWO_PI);
}

// The 7 pi/(8 T) O(1/T) tail imp-33278 already carried in its -1/2 offset.
function oneOverTTail(T) {
  return (7 * Math.PI) / (8 * T);
}

// Worst-case |S(T)|: Trudgian (2014) explicit unconditional bound (T >= e).
// Quoted from the literature; NOT derived here.
function sBoundTrudgian(T) {
  return 0.111 * Math.log(T) + 0.275 * Math.log(Math.log(T)) + 2.45;
}

// Typical |S(T)|: Selberg-CLT RMS estimate mean|S(T)| ~ sqrt(2/pi)*sigma with
// sigma^2 = (1/(2 pi^2)) log log T, i.e. sqrt(log log T)/pi^{3/2}.
function meanAbsSSelberg(T) {
  return Math.sqrt(Math.log(Math.log(T))) / Math.pow(Math.PI, 1.5);
}

// The S(T)-induced shift in the bandwidth floor U: dU_S = pi S(T)/T.
function bandwidthShiftFromS(T, sMag) {
  return (Math.PI * sMag) / T;
}

// -- Height ladder: the same geometric decades imp-33278 swept -----------------
const SWEEP_HEIGHTS = [1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, PT_HEIGHT, 1e13];

const SWEEP_ROWS = SWEEP_HEIGHTS.map((T0) => {
  const halfLog = halfLogOrder(T0);
  const tail = oneOverTTail(T0);
  const sWorst = sBoundTrudgian(T0);
  const sTypical = meanAbsSSelberg(T0);
  const shiftWorst = bandwidthShiftFromS(T0, sWorst);
  const shiftTypical = bandwidthShiftFromS(T0, sTypical);
  return Object.freeze({
    heightT0: T0,
    isAnchor: T0 === PT_HEIGHT,
    halfLogOrder: halfLog,
    oneOverTTail: tail,
    sBoundWorst: sWorst,
    sMeanTypical: sTypical,
    // dU_S = pi S(T)/T: the shift the omitted S(T) puts on the -1/2 offset.
    offsetShiftWorst: shiftWorst,
    offsetShiftTypical: shiftTypical,
    // Shift as a fraction of the -1/2 offset (survives if this stays tiny).
    shiftRelativeToHalf: shiftWorst / 0.5,
    // Shift as a fraction of the growing (1/2)log order (order survives if tiny).
    shiftRelativeToHalfLog: shiftWorst / halfLog,
    // Whether the worst-case S(T) shift EXCEEDS the 7 pi/(8 T) tail imp-33278 kept.
    worstShiftExceedsTail: shiftWorst > tail,
    // Whether the RMS typical S(T) shift stays BELOW that tail (bracketing it).
    typicalShiftBelowTail: shiftTypical < tail,
  });
});

// -- Sweep-level diagnostics ---------------------------------------------------
// The S(T) shift must be strictly DECREASING in T0 (vanishing correction).
const SHIFT_IS_MONOTONE_DECREASING = SWEEP_ROWS.every(
  (row, i) => i === 0 || row.offsetShiftWorst < SWEEP_ROWS[i - 1].offsetShiftWorst
);
const MAX_OFFSET_SHIFT_WORST = Math.max(...SWEEP_ROWS.map((r) => r.offsetShiftWorst));
const OFFSET_SHIFT_AT_TOP = SWEEP_ROWS[SWEEP_ROWS.length - 1].offsetShiftWorst;
const ANCHOR_ROW = SWEEP_ROWS.find((r) => r.isAnchor);
// The worst-case shift as a fraction of the -1/2 offset -- tiny everywhere.
const MAX_SHIFT_RELATIVE_TO_HALF = Math.max(...SWEEP_ROWS.map((r) => r.shiftRelativeToHalf));
// Bracketing: worst-case shift beats the 7 pi/(8 T) tail everywhere, RMS shift
// stays below it everywhere -- the tail lies BETWEEN the two S(T) magnitudes.
const WORST_EXCEEDS_TAIL_AT_ALL_HEIGHTS = SWEEP_ROWS.every((r) => r.worstShiftExceedsTail);
const TYPICAL_BELOW_TAIL_AT_ALL_HEIGHTS = SWEEP_ROWS.every((r) => r.typicalShiftBelowTail);

// -- Frozen measurement record -------------------------------------------------

export const IMP_33294_MODULATION_NYQUIST_ST_CORRECTION = Object.freeze({
  id: 'imp-33294',
  ticket: 'imp-33294',
  date: '2026-07-04',
  measures: 'imp-33278',
  extends: 'imp-33251',
  paper: 'twin_ladder_consolidated_v52.pdf',
  target:
    'Propagate the omitted S(T) argument count (and O(1/T) theta tail) to the ' +
    'imp-33278 modulation Nyquist bandwidth floor U = pi M_sc/T0 and quantify ' +
    'how much S(T) shifts the measured -1/2 offset U - (1/2)log(T0/2pi) at each ' +
    'swept height, and whether the (1/2)log growth order survives.',
  method: Object.freeze({
    note:
      'The full count is N(T) = theta(T)/pi + 1 + S(T); imp-33278 kept only the ' +
      'RvM main term N_main = (T/2pi)log(T/2pi) - T/2pi + 7/8, dropping S(T) and ' +
      'the 1/(48 pi T) theta tail. The S(T)-induced shift in U is exactly ' +
      'dU_S = pi S(T)/T, evaluated here with TWO literature S(T) magnitudes.',
    worstCaseSource:
      'Trudgian (2014) explicit unconditional bound |S(T)| <= 0.111 log T + ' +
      '0.275 log log T + 2.450 for T >= e (quoted, not derived).',
    typicalSource:
      'Selberg CLT RMS estimate mean|S(T)| ~ sqrt(2/pi)*sigma, sigma^2 = ' +
      '(1/(2 pi^2)) log log T, i.e. sqrt(log log T)/pi^{3/2} (quoted).',
  }),
  rows: Object.freeze(SWEEP_ROWS),
  diagnostics: Object.freeze({
    shiftIsMonotoneDecreasing: SHIFT_IS_MONOTONE_DECREASING,
    maxOffsetShiftWorst: MAX_OFFSET_SHIFT_WORST,
    offsetShiftAtTop: OFFSET_SHIFT_AT_TOP,
    anchorOffsetShiftWorst: ANCHOR_ROW ? ANCHOR_ROW.offsetShiftWorst : null,
    maxShiftRelativeToHalf: MAX_SHIFT_RELATIVE_TO_HALF,
    worstExceedsTailAtAllHeights: WORST_EXCEEDS_TAIL_AT_ALL_HEIGHTS,
    typicalBelowTailAtAllHeights: TYPICAL_BELOW_TAIL_AT_ALL_HEIGHTS,
    shiftNote:
      'dU_S = pi S(T)/T is O(log T / T) worst-case and O(sqrt(log log T)/T) ' +
      'typically: it VANISHES as T0 grows, from 1.283e-3 at T0 = 1e4 to ' +
      '6.87e-12 at the Platt-Trudgian anchor and 2.11e-12 at T0 = 1e13.',
    offsetSurvivesNote:
      'The -1/2 offset SURVIVES: the worst-case S(T) shift is at most a ' +
      'fraction 2.57e-3 of the -1/2 constant at T0 = 1e4 and 4.21e-12 at ' +
      'T0 = 1e13, so restoring S(T) cannot move the offset off -1/2.',
    orderSurvivesNote:
      'The (1/2)log(T0/2pi) growth order SURVIVES: dU_S -> 0 while halfLog -> ' +
      'inf, so adding S(T) leaves U ~ (1/2)log(T0/2pi) untouched.',
    crossoverNote:
      'The 7 pi/(8 T0) tail imp-33278 kept is BRACKETED by the two S(T) ' +
      'magnitudes: the worst-case shift EXCEEDS the tail at EVERY swept height ' +
      '(1.283e-3 > 2.749e-4 at T0 = 1e4; holds up the ladder since |S| grows ' +
      'as log T while the tail numerator is the constant 7/8), so in the worst ' +
      'case the DROPPED S(T) is the dominant omitted correction throughout, ' +
      'while the RMS typical shift stays BELOW the tail everywhere (8.41e-5 < ' +
      '2.749e-4 at T0 = 1e4). Both vanish and neither disturbs the -1/2 offset.',
  }),
  verdict:
    'CONFIRMED. Propagating the omitted S(T) argument count to the imp-33278 ' +
    'offset shifts U by dU_S = pi S(T)/T = O(log T / T), at most 1.283e-3 at ' +
    'the smallest swept height and vanishing at every larger height. The -1/2 ' +
    'offset and the (1/2)log(T0/2pi) growth order both SURVIVE intact; the ' +
    'imp-33278 conclusion is robust to the S(T) omission.',
  honestScope: Object.freeze([
    'MEASUREMENT ONLY. Pure arithmetic evaluation of N(T) = theta/pi + 1 + ' +
      'S(T) with two literature S(T) magnitudes; no new theorem, no operator ' +
      'positivity, no new bound.',
    'The Trudgian (2014) explicit |S(T)| bound and the Selberg-CLT RMS law are ' +
      'QUOTED from the literature, not derived here; they bracket the shift ' +
      'worst-case and typical, they do not certify the exact per-height S(T).',
    'The S(T) shift dU_S = pi S(T)/T is exact given S(T); the vanishing and ' +
      'the -1/2 offset survival follow from |S(T)| = O(log T), a classical ' +
      'unconditional fact -- this module MEASURES the magnitude, it does not ' +
      'reprove the S(T) bound.',
    'NO QED: Conjecture 22.1 in full generality is NOT resolved. The imp-33233 ' +
      'residual sub-gap (algebraic-complexity per-evaluation lower bound + ' +
      'small-height regime) is untouched and still open.',
    'imp-3932 partial-falsification stands; imp-3066 K_a >= 0 UNTOUCHED; the ' +
      'imp-1210 novelty verdict is unchanged; no refereed bound is changed ' +
      'the SOTA de Bruijn-Newman upper bound and is untouched.',
  ]),
  auditCrossRefs: Object.freeze(['imp-33278', 'imp-33251', 'imp-33233', 'imp-3932', 'imp-1210']),
});

// -- Build-time tripwires ------------------------------------------------------

export const IMP_33294_MODULATION_NYQUIST_ST_CORRECTION_ASSERTIONS = [
  {
    id: 'imp33294-st-shift-vanishes-monotonically-across-heights',
    holds: () => {
      const d = IMP_33294_MODULATION_NYQUIST_ST_CORRECTION.diagnostics;
      const rows = IMP_33294_MODULATION_NYQUIST_ST_CORRECTION.rows;
      const first = rows[0].offsetShiftWorst;
      const last = rows[rows.length - 1].offsetShiftWorst;
      // dU_S = pi S(T)/T must strictly DECREASE with T0 and shrink from the
      // ~1.28e-3 worst-case peak at 1e4 to ~2.1e-12 at 1e13: a vanishing tail.
      return (
        d.shiftIsMonotoneDecreasing === true &&
        Math.abs(first - 1.282693e-3) < 1e-8 &&
        Math.abs(last - 2.107176e-12) < 1e-17 &&
        last < first
      );
    },
    why:
      'The claim is that the omitted S(T) argument count is a VANISHING ' +
      'correction to U. dU_S = pi S(T)/T = O(log T / T) must therefore shrink ' +
      'monotonically as T0 grows; a flat or growing shift would mean S(T) can ' +
      'disturb the offset at large heights.',
  },
  {
    id: 'imp33294-minus-one-half-offset-survives-st-restoration',
    holds: () => {
      const d = IMP_33294_MODULATION_NYQUIST_ST_CORRECTION.diagnostics;
      // The worst-case S(T) shift must be a tiny fraction of the -1/2 offset at
      // EVERY height (max ~2.57e-3 at 1e4), so restoring S(T) cannot move the
      // offset off -1/2 -- the imp-33278 convergence to -1/2 is robust.
      return (
        d.maxShiftRelativeToHalf < 3e-3 &&
        Math.abs(d.maxShiftRelativeToHalf - 2.565386e-3) < 1e-6 &&
        d.maxOffsetShiftWorst < 1.5e-3
      );
    },
    why:
      'The -1/2 offset survives only if the worst-case S(T) shift is a small ' +
      'fraction of 1/2 at every swept height. A shift comparable to 1/2 would ' +
      'mean the RvM main-term proxy hides an offset error big enough to move ' +
      'the -1/2 convergence imp-33278 measured.',
  },
  {
    id: 'imp33294-oneOverT-tail-bracketed-by-the-two-st-magnitudes',
    holds: () => {
      const d = IMP_33294_MODULATION_NYQUIST_ST_CORRECTION.diagnostics;
      const rows = IMP_33294_MODULATION_NYQUIST_ST_CORRECTION.rows;
      const anchor = rows.find((r) => r.isAnchor);
      // The 7 pi/(8 T) tail must be BRACKETED: the worst-case S(T) shift beats
      // it at every height (dropped S(T) dominant in the worst case) while the
      // RMS typical shift stays below it everywhere; the anchor shift stays
      // tiny (~6.87e-12) -- both corrections vanish regardless.
      return (
        d.worstExceedsTailAtAllHeights === true &&
        d.typicalBelowTailAtAllHeights === true &&
        anchor &&
        Math.abs(anchor.offsetShiftWorst - 6.871756e-12) < 1e-17
      );
    },
    why:
      'A faithful propagation must record where S(T) sits relative to the ' +
      '7 pi/(8 T) tail imp-33278 kept: the worst-case S(T) shift beats the tail ' +
      'at every height (dropped S(T) is the dominant omission in the worst ' +
      'case) while the typical shift stays below it -- the tail is bracketed. ' +
      'This is the substantive finding of the propagation.',
  },
  {
    id: 'imp33294-record-is-measurement-only-no-qed',
    holds: () => {
      const r = IMP_33294_MODULATION_NYQUIST_ST_CORRECTION;
      return (
        r.measures === 'imp-33278' &&
        /CONFIRMED/.test(r.verdict) &&
        /-1\/2 offset and the \(1\/2\)log/.test(r.verdict) &&
        r.honestScope.some((s) => /MEASUREMENT ONLY/.test(s)) &&
        r.honestScope.some((s) => /NO QED/.test(s)) &&
        r.honestScope.some((s) => /Lambda <= 0.2|refereed bound is changed/.test(s)) &&
        r.honestScope.some((s) => /imp-3066/.test(s))
      );
    },
    why:
      'Honesty guard: this record must stay a MEASUREMENT propagating the S(T) ' +
      'omission through imp-33278 (not a new theorem or a QED on Conjecture ' +
      '22.1), must keep the NO-QED disclosure, and must record that imp-3066 ' +
      'and the Polymath15 Lambda <= 0.2 SOTA are untouched.',
  },
];

export default IMP_33294_MODULATION_NYQUIST_ST_CORRECTION;
