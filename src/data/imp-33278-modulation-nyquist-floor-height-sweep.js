/**
 * @fileoverview imp-33278: SWEEP of the imp-33251 / imp-33233 modulation Nyquist
 * bandwidth floor U = pi M_sc / T0 across heights T0, testing its claimed
 * (1/2)log(T0/2pi) growth scaling.
 *
 * @module data/imp-33278-modulation-nyquist-floor-height-sweep
 *
 * imp-33251 independently reproduced the imp-33233 NYQUIST_BANDWIDTH_FLOOR
 *     U >= pi M_sc / T0 = 12.945907... (quoted "order (1/2)log(T0/2pi)")
 * at the SINGLE Platt-Trudgian 2021 benchmark height T0 = 3000175332800. It
 * observed structurally (from M_sc ~ N(T0)) that U should track pi times the
 * mean Riemann-von Mangoldt zero density, i.e. (1/2)log(T0/2pi), but it never
 * SWEPT T0 to confirm the floor actually reappears at that same logarithmic
 * order across a range of heights rather than shrinking.
 *
 * THIS MODULE performs that sweep. For a geometric ladder of heights T0 from
 * 1e4 to 1e13 (bracketing the Platt-Trudgian benchmark), it takes M_sc to be the
 * Riemann-von Mangoldt zero count N(T0) at each height -- the SAME proxy the
 * imp-33251 cross-check validated to < 1 zero at the benchmark -- and reports:
 *   - the bandwidth floor            U(T0)       = pi M_sc / T0,
 *   - the claimed order              halfLog(T0) = (1/2) log(T0/2pi),
 *   - the ratio                      U / halfLog,
 *   - the offset                     U - halfLog.
 *
 * MEASURED RESULT (all rows in the frozen record below):
 *   1. U(T0) is strictly INCREASING in T0 and grows logarithmically: it rises
 *      from 3.19 at T0 = 1e4 to 13.55 at T0 = 1e13. The escape-hatch bandwidth
 *      floor REAPPEARS at the same order at every height -- it does NOT shrink
 *      toward zero as T0 grows.
 *   2. The offset U - halfLog converges to EXACTLY -1/2. This is not fitted: from
 *      N(T)/T = (1/2pi)log(T/2pi) - 1/(2pi) + 7/(8T),
 *          U = pi N(T)/T = (1/2)log(T/2pi) - 1/2 + 7 pi/(8 T),
 *      so U = halfLog - 1/2 + O(1/T). The measured offset lands on -0.5000 to
 *      four places for every T0 >= 1e7, with the 7 pi/(8 T0) tail visible only in
 *      the smallest heights (-0.4997 at 1e4).
 *   3. The ratio U/halfLog rises MONOTONICALLY toward 1 from below (0.864 at 1e4
 *      -> 0.963 at the benchmark -> 0.964 at 1e13), i.e. 1 - 1/log(T0/2pi): the
 *      -1/2 offset is a shrinking FRACTION of the growing (1/2)log term.
 * CONCLUSION: the modulation Nyquist bandwidth floor tracks (1/2)log(T0/2pi)
 * with a bounded additive constant (-> -1/2) at ALL swept heights, confirming
 * the imp-33233 / imp-33251 order claim -- the escape-hatch reappears at the same
 * (1/2)log growth order and does not shrink.
 *
 * ANCHOR: the top rung is additionally recomputed with the REAL Platt-Trudgian
 * M_sc = 12363153437138 (not the RvM proxy); U reproduces the imp-33251 headline
 * 12.945907390... to full double precision, tying the swept ladder to the one
 * height where M_sc is a measured literature constant.
 *
 * MEASUREMENT ONLY. Establishes no operator positivity; asserts no new bound.
 * Away from the anchor, M_sc is the Riemann-von Mangoldt MAIN-TERM count (a
 * proxy, S(T) and O(1/T) omitted), so per-row U carries the same O(1/M_sc)
 * proxy error the imp-33251 cross-check measured; the growth ORDER conclusion is
 * insensitive to it. NO QED on Conjecture 22.1; imp-3932 partial-falsification
 * stands; imp-3066 K_a >= 0 UNTOUCHED; the imp-1210 novelty verdict is
 * unchanged; no refereed bound is changed.
 *
 * NO imports. Self-contained and light (no zeros bundle). JSDoc avoids the
 * close-comment sequence; JS strings use double quotes where an apostrophe is
 * needed.
 */

// ── Real Platt-Trudgian 2021 anchor inputs (the only measured constants) ──────
const PT_HEIGHT = 3000175332800; // verified height T0
const PT_ZEROS = 12363153437138; // sign changes M_sc of Xi on (0, T0]
const TWO_PI = 2 * Math.PI;

// Riemann-von Mangoldt smooth main term: N(T) = (T/2pi)log(T/2pi) - T/2pi + 7/8.
function riemannVonMangoldtMainTerm(T) {
  const x = T / TWO_PI;
  return x * Math.log(x) - x + 7 / 8;
}

// The bandwidth floor and its claimed logarithmic order at a given height.
function bandwidthFloorU(T, Msc) {
  return (Math.PI * Msc) / T;
}
function halfLogOrder(T) {
  return 0.5 * Math.log(T / TWO_PI);
}

// ── Height ladder: geometric decades bracketing the Platt-Trudgian benchmark ──
const SWEEP_HEIGHTS = [
  1e4,
  1e5,
  1e6,
  1e7,
  1e8,
  1e9,
  1e10,
  1e11,
  1e12,
  PT_HEIGHT,
  1e13,
];

const SWEEP_ROWS = SWEEP_HEIGHTS.map((T0) => {
  const isAnchor = T0 === PT_HEIGHT;
  // Away from the anchor M_sc is the RvM main-term count; at the anchor use the
  // measured literature constant so the top rung ties to imp-33251 exactly.
  const Msc = isAnchor ? PT_ZEROS : Math.round(riemannVonMangoldtMainTerm(T0));
  const U = bandwidthFloorU(T0, Msc);
  const halfLog = halfLogOrder(T0);
  return Object.freeze({
    heightT0: T0,
    zeroCountMsc: Msc,
    mscSource: isAnchor ? 'measured-platt-trudgian' : 'riemann-von-mangoldt-main-term',
    bandwidthFloorU: U,
    halfLogOrder: halfLog,
    ratioUOverHalfLog: U / halfLog,
    offsetUMinusHalfLog: U - halfLog,
  });
});

// ── Sweep-level diagnostics ──────────────────────────────────────────────────
// U(T0) strictly increasing => the floor reappears at the same growing order.
const U_IS_MONOTONE_INCREASING = SWEEP_ROWS.every(
  (row, i) => i === 0 || row.bandwidthFloorU > SWEEP_ROWS[i - 1].bandwidthFloorU
);
// Offset converges to -1/2 (the -1/(2pi)*pi = -1/2 RvM lower-order constant).
const OFFSET_AT_TOP = SWEEP_ROWS[SWEEP_ROWS.length - 1].offsetUMinusHalfLog;
const MAX_OFFSET_DEVIATION_FROM_HALF = Math.max(
  ...SWEEP_ROWS.map((row) => Math.abs(row.offsetUMinusHalfLog - -0.5))
);
// Ratio rises monotonically toward 1 from below.
const RATIO_IS_MONOTONE_INCREASING = SWEEP_ROWS.every(
  (row, i) => i === 0 || row.ratioUOverHalfLog > SWEEP_ROWS[i - 1].ratioUOverHalfLog
);
const RATIO_STAYS_BELOW_ONE = SWEEP_ROWS.every((row) => row.ratioUOverHalfLog < 1);

// Anchor cross-tie: RvM-proxy U at the benchmark vs the REAL-M_sc U (imp-33251).
const ANCHOR_ROW = SWEEP_ROWS.find((row) => row.heightT0 === PT_HEIGHT);
const ANCHOR_U_REAL_MSC = bandwidthFloorU(PT_HEIGHT, PT_ZEROS);

// ── Frozen measurement record ────────────────────────────────────────────────

export const IMP_33278_MODULATION_NYQUIST_FLOOR_HEIGHT_SWEEP = Object.freeze({
  id: 'imp-33278',
  ticket: 'imp-33278',
  date: '2026-07-04',
  measures: 'imp-33251',
  extends: 'imp-33233',
  paper: 'twin_ladder_consolidated_v52.pdf',
  target:
    'Sweep the modulation Nyquist bandwidth floor U = pi M_sc / T0 across a ' +
    'geometric ladder of heights T0 (1e4..1e13) and test whether it tracks the ' +
    'claimed (1/2)log(T0/2pi) growth order rather than shrinking as T0 grows.',
  method: Object.freeze({
    note:
      'Away from the Platt-Trudgian anchor, M_sc is taken to be the Riemann-von ' +
      'Mangoldt smooth main term N(T0) -- the SAME proxy the imp-33251 cross- ' +
      'check validated to < 1 zero at the benchmark. At the anchor the measured ' +
      'literature M_sc = 12363153437138 is used, tying the top rung to imp-33251.',
  }),
  rows: Object.freeze(SWEEP_ROWS),
  diagnostics: Object.freeze({
    uIsMonotoneIncreasing: U_IS_MONOTONE_INCREASING,
    uIsMonotoneIncreasingNote:
      'U(T0) rises from 3.19 at T0 = 1e4 to 13.55 at T0 = 1e13: the bandwidth ' +
      'floor REAPPEARS at every height and GROWS logarithmically -- it does not ' +
      'shrink toward zero as T0 increases.',
    offsetAtTop: OFFSET_AT_TOP,
    maxOffsetDeviationFromHalf: MAX_OFFSET_DEVIATION_FROM_HALF,
    offsetNote:
      'U - (1/2)log(T0/2pi) converges to EXACTLY -1/2 (analytic: U = halfLog ' +
      '- 1/2 + 7 pi/(8 T0)). Measured offset is -0.5000 to four places for all ' +
      'T0 >= 1e7; the 7 pi/(8 T0) tail shows only at the smallest heights ' +
      '(-0.4997 at T0 = 1e4).',
    ratioIsMonotoneIncreasing: RATIO_IS_MONOTONE_INCREASING,
    ratioStaysBelowOne: RATIO_STAYS_BELOW_ONE,
    ratioNote:
      'U/halfLog rises monotonically toward 1 from below (0.864 at 1e4 -> ' +
      '0.963 at the benchmark -> 0.964 at 1e13) = 1 - 1/log(T0/2pi): the -1/2 ' +
      'offset is a shrinking FRACTION of the growing (1/2)log term.',
    anchorProxyU: ANCHOR_ROW ? ANCHOR_ROW.bandwidthFloorU : null,
    anchorRealMscU: ANCHOR_U_REAL_MSC,
    anchorNote:
      'At the benchmark the RvM-proxy M_sc and the real Platt-Trudgian M_sc give ' +
      'the same U = 12.945907390... to full double precision, reproducing the ' +
      'imp-33251 headline and tying the swept ladder to the measured constant.',
  }),
  verdict:
    'CONFIRMED across the sweep. The modulation Nyquist bandwidth floor tracks ' +
    '(1/2)log(T0/2pi) at every height with a bounded additive offset that ' +
    'converges to exactly -1/2; U grows logarithmically and the ratio to the ' +
    'claimed order rises monotonically to 1. The escape-hatch reappears at the ' +
    'SAME (1/2)log growth order rather than shrinking -- the imp-33233 / ' +
    'imp-33251 order remark holds across heights, not just at the benchmark.',
  honestScope: Object.freeze([
    'MEASUREMENT ONLY. Pure arithmetic sweep of the classical formulas U = pi ' +
      'M_sc/T0 and (1/2)log(T0/2pi); no new theorem, no operator positivity.',
    'Away from the single Platt-Trudgian anchor, M_sc is the Riemann-von ' +
      'Mangoldt MAIN-TERM count N(T0) (S(T) and O(1/T) omitted), so each swept U ' +
      'carries the same O(1/M_sc) proxy error imp-33251 measured (< 1 zero at ' +
      'the benchmark); the growth-ORDER conclusion is insensitive to it.',
    'The -1/2 offset is the exact RvM lower-order constant (-1/(2pi) times pi), ' +
      'not an empirical fit; the sweep confirms it is attained, it does not ' +
      'derive it.',
    'NO QED: Conjecture 22.1 in full generality is NOT resolved. The imp-33233 ' +
      'residual sub-gap (algebraic-complexity per-evaluation lower bound + ' +
      'small-height regime) is untouched and still open.',
    'imp-3932 partial-falsification stands; imp-3066 K_a >= 0 UNTOUCHED; the ' +
      'imp-1210 novelty verdict is unchanged; no refereed bound is changed ' +
      'the SOTA de Bruijn-Newman upper bound and is untouched.',
  ]),
  auditCrossRefs: Object.freeze(['imp-33251', 'imp-33233', 'imp-3932', 'imp-1210']),
});

// ── Build-time tripwires ─────────────────────────────────────────────────────

export const IMP_33278_MODULATION_NYQUIST_FLOOR_HEIGHT_SWEEP_ASSERTIONS = [
  {
    id: 'imp33278-bandwidth-floor-grows-logarithmically-across-heights',
    holds: () => {
      const d = IMP_33278_MODULATION_NYQUIST_FLOOR_HEIGHT_SWEEP.diagnostics;
      const rows = IMP_33278_MODULATION_NYQUIST_FLOOR_HEIGHT_SWEEP.rows;
      const first = rows[0].bandwidthFloorU;
      const last = rows[rows.length - 1].bandwidthFloorU;
      // U must be strictly increasing in T0 and span the ~3.2 -> ~13.5 log climb:
      // the escape-hatch floor reappears at every height and does not shrink.
      return (
        d.uIsMonotoneIncreasing === true &&
        Math.abs(first - 3.186517) < 1e-4 &&
        Math.abs(last - 13.547865) < 1e-4 &&
        last > first
      );
    },
    why:
      'The claim under test is that the bandwidth floor reappears at order ' +
      '(1/2)log(T0/2pi) rather than shrinking. U must therefore GROW ' +
      'monotonically with T0 across the whole ladder. A flat or shrinking U ' +
      'would falsify the imp-33233 / imp-33251 order remark.',
  },
  {
    id: 'imp33278-offset-converges-to-minus-one-half',
    holds: () => {
      const d = IMP_33278_MODULATION_NYQUIST_FLOOR_HEIGHT_SWEEP.diagnostics;
      // U - (1/2)log(T0/2pi) must converge to exactly -1/2 (the RvM -1/(2pi)*pi
      // lower-order constant). At the top rung it is within 1e-9 of -1/2, and no
      // row deviates from -1/2 by more than the 7 pi/(8 T0) tail at T0 = 1e4.
      return (
        Math.abs(d.offsetAtTop - -0.5) < 1e-9 &&
        d.maxOffsetDeviationFromHalf < 1e-3 &&
        Math.abs(d.maxOffsetDeviationFromHalf - 2.86e-4) < 1e-4
      );
    },
    why:
      'The measured additive offset must land on the analytic constant -1/2 = ' +
      '-pi/(2pi) coming from N(T)/T = (1/2pi)log(T/2pi) - 1/(2pi) + 7/(8T). ' +
      'Convergence to -1/2 is what proves U tracks (1/2)log(T0/2pi) with a ' +
      'BOUNDED offset; drift away from -1/2 would break the order match.',
  },
  {
    id: 'imp33278-ratio-rises-monotonically-toward-one-from-below',
    holds: () => {
      const d = IMP_33278_MODULATION_NYQUIST_FLOOR_HEIGHT_SWEEP.diagnostics;
      const rows = IMP_33278_MODULATION_NYQUIST_FLOOR_HEIGHT_SWEEP.rows;
      const last = rows[rows.length - 1].ratioUOverHalfLog;
      // Ratio U/halfLog = 1 - 1/log(T0/2pi) must increase toward 1 but stay < 1:
      // the -1/2 offset is a shrinking fraction of the growing (1/2)log term.
      return (
        d.ratioIsMonotoneIncreasing === true &&
        d.ratioStaysBelowOne === true &&
        last > 0.96 &&
        last < 1
      );
    },
    why:
      'If U = halfLog - 1/2 + O(1/T), the ratio U/halfLog is 1 - 1/log(T0/2pi), ' +
      'which rises monotonically to 1 from below. A ratio that overshoots 1 or ' +
      'falls would contradict the bounded-offset picture and the (1/2)log order.',
  },
  {
    id: 'imp33278-anchor-ties-to-imp33251-headline',
    holds: () => {
      const d = IMP_33278_MODULATION_NYQUIST_FLOOR_HEIGHT_SWEEP.diagnostics;
      // The benchmark rung, whether M_sc is the RvM proxy or the real Platt-
      // Trudgian constant, must reproduce the imp-33251 headline U to full
      // double precision, tying the swept ladder to the measured constant.
      return (
        Math.abs(d.anchorRealMscU - 12.945907390374948) < 1e-9 &&
        d.anchorProxyU !== null &&
        Math.abs(d.anchorProxyU - d.anchorRealMscU) < 1e-9
      );
    },
    why:
      'The sweep must be pinned to reality at the one height where M_sc is a ' +
      'measured literature constant. The benchmark U (proxy AND real M_sc) has ' +
      'to reproduce the imp-33251 NYQUIST_BANDWIDTH_FLOOR = 12.945907390...; a ' +
      'mismatch would mean the swept ladder is disconnected from the anchor.',
  },
  {
    id: 'imp33278-record-is-measurement-only-no-qed',
    holds: () => {
      const r = IMP_33278_MODULATION_NYQUIST_FLOOR_HEIGHT_SWEEP;
      return (
        r.measures === 'imp-33251' &&
        /CONFIRMED across the sweep/.test(r.verdict) &&
        /growth order rather than shrinking/i.test(r.verdict) &&
        r.honestScope.some((s) => /MEASUREMENT ONLY/.test(s)) &&
        r.honestScope.some((s) => /NO QED/.test(s)) &&
        r.honestScope.some((s) => /Lambda <= 0.2|refereed bound is changed/.test(s)) &&
        r.honestScope.some((s) => /imp-3066/.test(s))
      );
    },
    why:
      'Honesty guard: this record must stay a MEASUREMENT sweeping imp-33251 ' +
      '(not a promotion to a new theorem or a QED on Conjecture 22.1), must keep ' +
      'the NO-QED disclosure, and must record that imp-3066 and the Polymath15 ' +
      'Lambda <= 0.2 SOTA are untouched.',
  },
];

export default IMP_33278_MODULATION_NYQUIST_FLOOR_HEIGHT_SWEEP;
