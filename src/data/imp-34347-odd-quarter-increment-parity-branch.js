/**
 * @module imp-34347-odd-quarter-increment-parity-branch
 *
 * imp-34347 (numerical, frontier-direction): imp-34269 F3 noted IN PASSING that the odd-quarter interior nodes
 * (kEnd = 17.25, 17.75, 18.25, ...) of the fixed-band (k <= 10) peak DO carry nonzero increments -- each adds a
 * real 0.25 ladder rung, unlike sub-0.25 sampling which is step-function-flat -- but imp-34269 tabulated only the
 * six SHARED 0.5-boundary peaks (17.0, 17.5, ..., 19.5) and the flat sub-rung probe; it never tabulated the
 * odd-quarter increments THEMSELVES. imp-34268 stitched all 18 windows of the same 0.25 grid (17.00 .. 21.25)
 * and found the post-minimum re-acceleration branch is CONVEX (strictly positive, growing peak third differences),
 * but read the sequence as a single stream WITHOUT separating parity. This module TABULATES the odd-quarter-node
 * increments on their own and MEASURES whether they interleave SMOOTHLY onto the imp-34268 convex branch or
 * introduce a parity / even-odd OSCILLATION the coarse 0.5 grid could not see.
 *
 * THE ANSWER: THE ODD-QUARTER INCREMENTS INTERLEAVE SMOOTHLY -- THERE IS NO PARITY OSCILLATION. Every one of the
 * seven INTERIOR odd-quarter nodes is locally CONVEX (its increment sits at or below the chord midpoint of its two
 * even-half neighbours: centered second difference >= 0), and the odd-quarter increments alone trace the SAME
 * U-shaped descent-then-convex-re-acceleration branch as the full grid, carrying the global increment MINIMUM
 * (kEnd = 18.75, 0.016669 -- the imp-34196 anchor). The 0.25 grid reveals exactly ONE locally concave node in the
 * whole 15-node interior -- the single even-half node kEnd = 19.00 immediately after the 18.75 minimum (centered
 * second difference -0.000480) -- a one-node turning-point OVERSHOOT, NOT a systematic even-odd alternation; from
 * kEnd >= 19.25 every node of BOTH parities is convex through to the imp-34169 resid_exp pole.
 *
 * THE MEASUREMENT (imp-34268/imp-34196/imp-34169 machinery reused verbatim; the parity split + interleave probe are new)
 * ------------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406 sub-terms
 *                    EXACTLY as in imp-33810/imp-34109/imp-34196/imp-34169/imp-34268. No re-derivation.
 *   Grid             kEnd = 17.00, 17.25, ..., 21.25 (18 windows, 0.25 step) -- the imp-34268 stitch grid.
 *   Fixed-band peak  the largest signed residual among rungs with k <= 10.00 -- the identical band imp-33940 /
 *                    imp-34109 / imp-34196 / imp-34169 / imp-34268 tracked.
 *   0.25 increments  peak(kEnd_i) - peak(kEnd_{i-1}), indexed by right-endpoint kEnd (17 increments).
 *   Parity split     ODD-QUARTER increments = those whose right-endpoint kEnd has fractional part 0.25 or 0.75
 *                    (17.25, 17.75, ..., 21.25; nine of them); EVEN-HALF = fractional part 0.0 or 0.5.
 *   Interleave probe at each INTERIOR node the centered second difference inc[i-1] + inc[i+1] - 2*inc[i] (>= 0 iff
 *                    the node sits at or below its neighbours chord, i.e. locally convex / smooth; < 0 iff it
 *                    overshoots the chord, i.e. a local concavity / oscillation).
 *
 * THE FINDING (measurement only -- no bound change; NO QED)
 * --------------------------------------------------------
 *   (F1) THE FULL 0.25-GRID INCREMENT SEQUENCE REPRODUCES imp-34268, AND THE GLOBAL MINIMUM FALLS ON AN
 *        ODD-QUARTER NODE. The 17 increments 0.018483 (17.25) -> ... -> 0.104154 (21.25) reproduce imp-34268 s
 *        increments exactly; the increment minimum 0.016669 is attained at kEnd = 18.75 -- an ODD-QUARTER node
 *        (the imp-34196 sub-window minimum). So the odd-quarter nodes are not a sideshow: they carry the turn.
 *   (F2) THE ODD-QUARTER INCREMENTS, TABULATED FOR THE FIRST TIME, ARE THEMSELVES U-SHAPED. The nine odd-quarter
 *        increments 0.018483 (17.25) -> 0.017599 -> 0.016949 -> 0.016669 (18.75, MIN) -> 0.018109 -> 0.019581 ->
 *        0.023432 -> 0.033665 -> 0.104154 (21.25) strictly DESCEND to the 18.75 minimum then strictly INCREASE and
 *        accelerate (odd-only first differences -0.000884, -0.000650, -0.000280 | +0.001440, +0.001472, +0.003851,
 *        +0.010233, +0.070489) -- the identical descent-then-convex-re-acceleration shape as the full grid.
 *   (F3) NO PARITY OSCILLATION -- THE ODD-QUARTER NODES INTERLEAVE SMOOTHLY ONTO THE CONVEX BRANCH. All SEVEN
 *        interior odd-quarter nodes are locally CONVEX (centered second difference >= 0: +0.000058 (17.75),
 *        +0.000091 (18.25), +0.001042 (18.75), +0.000059 (19.25), +0.000563 (19.75), +0.001420 (20.25),
 *        +0.006603 (20.75)). The ONLY locally concave node in the entire 15-node interior is the single EVEN-HALF
 *        node kEnd = 19.00 (centered second difference -0.000480), immediately after the 18.75 odd-quarter
 *        minimum -- a one-node turning-point overshoot, not a persistent even/odd alternation. From kEnd >= 19.25
 *        every node of both parities is convex (second differences grow monotonically to +0.044367 at 21.00). The
 *        coarse 0.5 grid samples 19.00 but NOT the 18.75 minimum, so it cannot resolve that 19.00 is an overshoot
 *        OF the odd-quarter dip -- the half-step refinement REVEALS the turning-point structure, not an oscillation.
 *
 * The punchline: the odd-quarter interior increments the imp-34269 F3 flagged but never tabulated carry the global
 * increment minimum (kEnd = 18.75) and trace the SAME convex descent-then-re-acceleration branch as the 0.5 grid;
 * they interleave SMOOTHLY with NO parity oscillation (all seven interior odd-quarter nodes locally convex). The
 * 0.25 grid exposes exactly ONE local concavity -- the even node kEnd = 19.00 adjacent to the minimum, a
 * discretized turning-point overshoot the 0.5 grid (which never samples the 18.75 dip) masks -- not a systematic
 * even-odd effect. The imp-34268 convex-branch reading stands: the odd-quarter refinement neither introduces an
 * oscillation nor overturns the convexity.
 *
 * MEASUREMENT / PARITY-SPLIT AND INTERLEAVE PROBE ONLY. A descriptive tabulation of the odd-quarter subsequence of
 * an inherited surrogate, NOT an RH bound and distinct from any form selection (the imp-33843
 * log-linear-over-power-law verdict and the imp-34109/imp-34196/imp-34169/imp-34268 findings are untouched). The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the peak, the
 * increments, and the convexity read are descriptive, not derived; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34269-fixed-band-peak-shared-grid-cross-recompute (F3 flagged the nonzero odd-quarter increments this tabulates)
 * @see imp-34268-fixed-band-peak-reaccel-convexity-stitch (the convex branch these odd-quarter nodes interleave onto)
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (the 0.25-grid increment minimum at kEnd = 18.75)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the kEnd 20..21 re-acceleration; resid_exp pole k* ~ 21.28)
 * @see imp-34346-fixed-band-peak-third-diff-pole-order (the divergence RATE of the peak third differences toward the pole)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose fixed-band peak this tracks)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim; its 0.25 rung spacing sets the resolution)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34268/imp-34196
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34268/imp-34196/imp-34169.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
function ols(xs, ys) {
  const b = olsSlope(xs, ys);
  const mx = xs.reduce((a, c) => a + c, 0) / xs.length;
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  return { a: my - b * mx, b };
}

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
  }
  return -olsSlope(xs, ys);
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// The imp-33810/imp-33843 surrogate quantity at a single decade [10^k, 10^(k+1)] -- verbatim imp-34268.
function eflowOverResidAt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return +(eflowAttr / residExp).toExponential(4);
}

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    R.push({ k: kk, eflow_over_resid: eflowOverResidAt(kk) });
  }
  return R;
}
// imp-33843 log-linear OLS residual vector on a ladder.
function residualVector(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { KS, RES: KS.map((k, i) => Y[i] - (F.a + F.b * k)) };
}
// Largest signed residual among rungs with k <= kMax (the boundary-independent fixed band), verbatim.
function fixedBandPeak(R, kMax) {
  const anyNonPositive = R.some((r) => !(r.eflow_over_resid > 0));
  const { KS, RES } = residualVector(R);
  let maxI = -1;
  for (let i = 0; i < RES.length; i++) {
    if (KS[i] <= kMax + 1e-9 && (maxI < 0 || RES[i] > RES[maxI])) maxI = i;
  }
  const peak = RES[maxI];
  return { peak, atK: KS[maxI], defined: !anyNonPositive && Number.isFinite(peak) };
}

// The imp-34268 stitch grid: kEnd = 17.00 .. 21.25 (18 windows, 0.25 step).
const K_ENDS = [];
for (let k = 17.0; k <= 21.25 + 1e-9; k += 0.25) K_ENDS.push(+k.toFixed(2));
const FIXED_BAND_KMAX = 10.0;

const PEAKS = K_ENDS.map((kEnd) => {
  const fp = fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX);
  return fp.defined ? +fp.peak.toFixed(6) : null;
});
const ALL_DEFINED = PEAKS.every((p) => p !== null);

// 0.25-grid increments indexed by right-endpoint kEnd (17 increments).
const INCREMENTS = [];
for (let i = 1; i < PEAKS.length; i++) INCREMENTS.push(+(PEAKS[i] - PEAKS[i - 1]).toFixed(6));
const INC_END_KENDS = K_ENDS.slice(1);

// Parity: an ODD-QUARTER right-endpoint kEnd has fractional part 0.25 or 0.75; EVEN-HALF has 0.0 or 0.5.
function isOddQuarter(ke) {
  const f = +(ke - Math.floor(ke)).toFixed(2);
  return f === 0.25 || f === 0.75;
}

const ODD_QUARTER_ROWS = INC_END_KENDS.map((ke, i) => ({ kEnd: ke, increment: INCREMENTS[i] })).filter((r) =>
  isOddQuarter(r.kEnd),
);
const EVEN_HALF_ROWS = INC_END_KENDS.map((ke, i) => ({ kEnd: ke, increment: INCREMENTS[i] })).filter(
  (r) => !isOddQuarter(r.kEnd),
);

// Odd-quarter subsequence shape: strict descent to the minimum then strict increase.
const ODD_INCS = ODD_QUARTER_ROWS.map((r) => r.increment);
const ODD_KENDS = ODD_QUARTER_ROWS.map((r) => r.kEnd);
const ODD_FIRST_DIFFS = [];
for (let i = 1; i < ODD_INCS.length; i++) ODD_FIRST_DIFFS.push(+(ODD_INCS[i] - ODD_INCS[i - 1]).toFixed(6));
const ODD_MIN = Math.min(...ODD_INCS);
const ODD_MIN_KEND = ODD_KENDS[ODD_INCS.indexOf(ODD_MIN)]; // 18.75
const ODD_DESCENDS_THEN_RISES =
  ODD_FIRST_DIFFS.slice(0, ODD_INCS.indexOf(ODD_MIN)).every((d) => d < 0) &&
  ODD_FIRST_DIFFS.slice(ODD_INCS.indexOf(ODD_MIN)).every((d) => d > 0);

// Interleave / oscillation probe: centered second difference at each INTERIOR node of the full 0.25 increment
// sequence. secondDiff >= 0 => the node sits at/below its neighbours chord (locally convex / smooth interleave);
// secondDiff < 0 => the node overshoots the chord (a local concavity / oscillation).
const INTERIOR_ROWS = [];
for (let i = 1; i < INCREMENTS.length - 1; i++) {
  const secondDiff = +(INCREMENTS[i - 1] + INCREMENTS[i + 1] - 2 * INCREMENTS[i]).toFixed(6);
  INTERIOR_ROWS.push({
    kEnd: INC_END_KENDS[i],
    parity: isOddQuarter(INC_END_KENDS[i]) ? 'odd-quarter' : 'even-half',
    increment: INCREMENTS[i],
    prevIncrement: INCREMENTS[i - 1],
    nextIncrement: INCREMENTS[i + 1],
    centeredSecondDiff: secondDiff,
    locallyConvex: secondDiff >= 0,
  });
}
const ODD_INTERIOR = INTERIOR_ROWS.filter((r) => r.parity === 'odd-quarter');
const CONCAVE_NODES = INTERIOR_ROWS.filter((r) => !r.locallyConvex);
const ALL_ODD_INTERIOR_CONVEX = ODD_INTERIOR.every((r) => r.locallyConvex);
const NO_ODD_QUARTER_OSCILLATION = ALL_ODD_INTERIOR_CONVEX; // no odd-quarter node overshoots its chord
// The sole concavity is the single even-half node kEnd = 19.00 immediately after the odd-quarter 18.75 minimum.
const SOLE_CONCAVITY_IS_EVEN_19 =
  CONCAVE_NODES.length === 1 &&
  CONCAVE_NODES[0].kEnd === 19.0 &&
  CONCAVE_NODES[0].parity === 'even-half';
// From kEnd >= 19.25 every interior node of both parities is convex.
const CONVEX_FROM_1925 = INTERIOR_ROWS.filter((r) => r.kEnd >= 19.25 - 1e-9).every((r) => r.locallyConvex);

// Reuse anchors (baked imp-34268/imp-34196 literals) for the continuation gate.
const IMP34268_INCREMENT_FIRST = 0.018483; // increment ending kEnd = 17.25 (first 0.25-grid increment)
const IMP34196_INCREMENT_MINIMUM = 0.016669; // imp-34196 sub-window increment minimum (kEnd = 18.75, odd-quarter)
const IMP34268_INCREMENT_LAST = 0.104154; // increment ending kEnd = 21.25 (last quarter-rung before the pole)
const EVEN_19_SECOND_DIFF = -0.00048; // the sole local concavity, at even-half node kEnd = 19.00

export const IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH = {
  id: 'imp-34347',
  proofSection: 'S-frontier',
  question:
    'imp-34269 F3 flagged that the odd-quarter interior nodes (kEnd = 17.25, 17.75, 18.25, ...) of the ' +
    'fixed-band (k <= 10) peak carry NONZERO increments (each adds a real 0.25 ladder rung) but never tabulated ' +
    'them; imp-34268 read the whole 0.25-grid increment sequence as convex WITHOUT separating parity. Tabulating ' +
    'the odd-quarter increments on their own, do they interleave SMOOTHLY onto the imp-34268 convex branch or ' +
    'introduce a parity / even-odd OSCILLATION the coarse 0.5 grid missed? Measurement only; no bound change; NO QED.',
  measuredQuantity:
    'On the imp-34268 0.25 kEnd grid (17.00 .. 21.25, 18 windows): the fixed-band (k <= 10) peak, its 17 ' +
    '0.25-grid increments split by right-endpoint parity (ODD-QUARTER = fractional part 0.25 or 0.75; EVEN-HALF ' +
    '= 0.0 or 0.5), the odd-quarter subsequence shape, and the centered second difference inc[i-1] + inc[i+1] - ' +
    '2*inc[i] at every interior node (>= 0 iff the node interleaves smoothly / is locally convex; < 0 iff it ' +
    'overshoots its neighbours chord)',
  kEnds: K_ENDS,
  fixedBandKMax: FIXED_BAND_KMAX,
  allWindowsDefined: ALL_DEFINED,
  peaks: PEAKS,
  increments: INCREMENTS, // 17 increments, reproduces imp-34268
  incrementEndKEnds: INC_END_KENDS,
  oddQuarterRows: ODD_QUARTER_ROWS, // {kEnd, increment} x 9 -- the odd-quarter increments, tabulated for the first time
  evenHalfRows: EVEN_HALF_ROWS, // {kEnd, increment} x 8
  oddQuarterFirstDiffs: ODD_FIRST_DIFFS, // odd-only first differences: negative before the minimum, positive after
  oddQuarterMinimum: +ODD_MIN.toFixed(6), // 0.016669
  oddQuarterMinimumKEnd: ODD_MIN_KEND, // 18.75 -- an ODD-QUARTER node carries the global increment minimum
  oddDescendsThenRises: ODD_DESCENDS_THEN_RISES, // true -- the odd-quarter subsequence is itself U-shaped
  interiorRows: INTERIOR_ROWS, // {kEnd, parity, increment, prev, next, centeredSecondDiff, locallyConvex} x 15
  oddInteriorRows: ODD_INTERIOR, // the 7 interior odd-quarter nodes
  allOddInteriorConvex: ALL_ODD_INTERIOR_CONVEX, // true -- every interior odd-quarter node interleaves smoothly
  noOddQuarterOscillation: NO_ODD_QUARTER_OSCILLATION, // true -- no odd-quarter node overshoots its chord
  concaveNodes: CONCAVE_NODES, // exactly one: even-half kEnd = 19.00
  soleConcavityIsEven19: SOLE_CONCAVITY_IS_EVEN_19, // true -- the lone concavity is the even node after the minimum
  even19SecondDiff: CONCAVE_NODES.length === 1 ? CONCAVE_NODES[0].centeredSecondDiff : null, // -0.000480
  convexFrom1925: CONVEX_FROM_1925, // true -- from kEnd >= 19.25 every node of both parities is convex
  imp34268IncrementFirst: IMP34268_INCREMENT_FIRST,
  imp34196IncrementMinimum: IMP34196_INCREMENT_MINIMUM,
  imp34268IncrementLast: IMP34268_INCREMENT_LAST,
  finding: {
    F1_full_grid_reproduces_imp34268_minimum_on_odd_quarter_node:
      'The 17 0.25-grid increments 0.018483 (17.25) -> ... -> 0.104154 (21.25) reproduce imp-34268 s increments ' +
      'exactly, and the increment minimum 0.016669 is attained at kEnd = 18.75 -- an ODD-QUARTER node (the ' +
      'imp-34196 sub-window minimum). The odd-quarter nodes carry the turn, not a sideshow.',
    F2_odd_quarter_increments_tabulated_are_U_shaped:
      'The nine odd-quarter increments 0.018483 (17.25), 0.017599, 0.016949, 0.016669 (18.75, MIN), 0.018109, ' +
      '0.019581, 0.023432, 0.033665, 0.104154 (21.25) -- tabulated here for the first time (imp-34269 F3 flagged ' +
      'them nonzero but never listed them) -- strictly DESCEND to the 18.75 minimum then strictly INCREASE and ' +
      'accelerate (odd-only first differences -0.000884, -0.000650, -0.000280 | +0.001440, +0.001472, +0.003851, ' +
      '+0.010233, +0.070489): the same descent-then-convex-re-acceleration shape as the full grid.',
    F3_no_parity_oscillation_odd_quarter_nodes_interleave_smoothly:
      'All SEVEN interior odd-quarter nodes are locally CONVEX (centered second difference >= 0: +0.000058 ' +
      '(17.75), +0.000091 (18.25), +0.001042 (18.75), +0.000059 (19.25), +0.000563 (19.75), +0.001420 (20.25), ' +
      '+0.006603 (20.75)) -- each interleaves smoothly onto the imp-34268 convex branch with NO overshoot. The ' +
      'ONLY locally concave node in the entire 15-node interior is the single EVEN-HALF node kEnd = 19.00 ' +
      '(centered second difference -0.000480), immediately after the 18.75 odd-quarter minimum -- a one-node ' +
      'turning-point overshoot, not a persistent even/odd alternation. From kEnd >= 19.25 every node of both ' +
      'parities is convex (second differences grow to +0.044367 at 21.00). The coarse 0.5 grid samples 19.00 ' +
      'but NOT the 18.75 minimum, so it cannot see that 19.00 is an overshoot OF the odd-quarter dip -- the ' +
      'half-step refinement REVEALS the turning-point structure rather than an oscillation.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / PARITY-SPLIT AND INTERLEAVE PROBE (frontier-direction, NOT rigorous). Tabulating the ' +
    'odd-quarter interior increments (kEnd = 17.25, 17.75, ..., 21.25) that imp-34269 F3 flagged as nonzero but ' +
    'never listed shows they carry the global increment minimum (0.016669 at the odd-quarter node kEnd = 18.75) ' +
    'and trace the SAME U-shaped descent-then-convex-re-acceleration branch as the full 0.25 grid (odd-only ' +
    'first differences negative before 18.75, positive and growing after). The odd-quarter nodes interleave ' +
    'SMOOTHLY onto the imp-34268 convex branch with NO parity oscillation: all seven interior odd-quarter nodes ' +
    'are locally convex (centered second difference >= 0), and the ONLY local concavity in the whole 15-node ' +
    'interior is the single even-half node kEnd = 19.00 (centered second difference -0.000480) immediately after ' +
    'the 18.75 minimum -- a one-node turning-point overshoot the coarse 0.5 grid (which never samples the 18.75 ' +
    'dip) masks, not a systematic even-odd effect; from kEnd >= 19.25 every node of both parities is convex ' +
    'through to the imp-34169 resid_exp pole. The imp-34268 convex-branch reading is not overturned -- the ' +
    'odd-quarter refinement neither introduces an oscillation nor changes the convexity. Distinct from any form ' +
    'selection; the imp-33843 log-linear-over-power-law verdict and the imp-34109/imp-34196/imp-34169/imp-34268 ' +
    'findings are untouched. The peak, the increments, and the convexity read are descriptive, not derived; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34269 (F3 flagged the nonzero odd-quarter increments this tabulates); imp-34268 (the convex branch these ' +
    'nodes interleave onto; b ~ +0.002567 local slope, positive growing third differences); imp-34196 (the ' +
    '0.25-grid increment minimum at kEnd = 18.75); imp-34169 (the kEnd 20..21 re-acceleration; resid_exp pole ' +
    'k* ~ 21.28); imp-34346 (the third-difference divergence rate toward the pole); imp-33843 (the log-linear ' +
    'OLS whose fixed-band peak this tracks); imp-33810 (the k=6.. ladder reused verbatim); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN); ' +
    'polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH_ASSERTIONS = [
  {
    // Reuse / continuation gate: 18-window 0.25 grid 17.0..21.25 all defined, 17 increments; the first
    // increment reproduces imp-34268 (0.018483 at kEnd 17.25), the last 0.104154 at kEnd 21.25.
    id: 'imp34347-reuse-gate-grid-and-increments',
    description: '18-window 0.25 grid 17.0..21.25 all defined; 17 increments; first 0.018483 (17.25), last 0.104154 (21.25)',
    holds: () =>
      K_ENDS.length === 18 &&
      K_ENDS[0] === 17.0 &&
      K_ENDS[K_ENDS.length - 1] === 21.25 &&
      ALL_DEFINED === true &&
      INCREMENTS.length === 17 &&
      Math.abs(INCREMENTS[0] - IMP34268_INCREMENT_FIRST) < 1e-6 &&
      Math.abs(INCREMENTS[INCREMENTS.length - 1] - IMP34268_INCREMENT_LAST) < 1e-6,
  },
  {
    // (F1) The global increment minimum 0.016669 falls on the ODD-QUARTER node kEnd = 18.75 (imp-34196 anchor).
    id: 'imp34347-increment-minimum-on-odd-quarter-node',
    description: 'increment minimum 0.016669 attained at odd-quarter node kEnd = 18.75 (imp-34196 sub-window minimum)',
    holds: () =>
      ODD_MIN_KEND === 18.75 &&
      isOddQuarter(18.75) === true &&
      Math.abs(ODD_MIN - IMP34196_INCREMENT_MINIMUM) < 1e-6 &&
      Math.min(...INCREMENTS) === ODD_MIN,
  },
  {
    // (F2) Nine odd-quarter increments, tabulated; the odd-only subsequence descends to the 18.75 minimum then rises.
    id: 'imp34347-odd-quarter-subsequence-U-shaped',
    description: 'nine odd-quarter increments; subsequence strictly descends to 18.75 minimum then strictly rises',
    holds: () =>
      ODD_QUARTER_ROWS.length === 9 &&
      EVEN_HALF_ROWS.length === 8 &&
      ODD_DESCENDS_THEN_RISES === true &&
      ODD_QUARTER_ROWS.every((r) => isOddQuarter(r.kEnd)),
  },
  {
    // (F3) No parity oscillation: all 7 interior odd-quarter nodes locally convex; the sole concave node is the
    // single even-half node kEnd = 19.00 (secondDiff -0.000480); every node from kEnd >= 19.25 is convex.
    id: 'imp34347-no-parity-oscillation-sole-concavity-even-19',
    description: 'all 7 interior odd-quarter nodes locally convex; only concavity is even-half kEnd 19.00 (secondDiff -0.000480); convex from kEnd >= 19.25',
    holds: () =>
      ODD_INTERIOR.length === 7 &&
      ALL_ODD_INTERIOR_CONVEX === true &&
      NO_ODD_QUARTER_OSCILLATION === true &&
      SOLE_CONCAVITY_IS_EVEN_19 === true &&
      Math.abs(CONCAVE_NODES[0].centeredSecondDiff - EVEN_19_SECOND_DIFF) < 1e-6 &&
      CONVEX_FROM_1925 === true,
  },
  {
    // Honesty gate: measurement only, no oscillation & convex reading intact, isRigorous false, imp-34268/imp-34269
    // untouched, no bound change, no QED, no refereed bound is changed, imp-3066 K_a>=0 & imp-486 C_mb untouched.
    id: 'imp34347-honesty-gate-no-qed',
    description: 'Measurement only: noOddQuarterOscillation & soleConcavityIsEven19, isRigorous false, sources untouched, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, imp-486 C_mb untouched',
    holds: () =>
      IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH.noOddQuarterOscillation === true &&
      IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH.soleConcavityIsEven19 === true &&
      IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH.verdict) &&
      /not overturned/.test(IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH.verdict) &&
      /NO QED/.test(IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH.verdict) &&
      /refereed bound is changed/i.test(IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH.verdict),
  },
];

for (const a of IMP34347_ODD_QUARTER_INCREMENT_PARITY_BRANCH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34347-odd-quarter-increment-parity-branch assertion failed: ${a.id}`);
  }
}
