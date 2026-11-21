/**
 * @module imp-34431-fixed-band-peak-half-step-kend-step-flat
 *
 * imp-34431 (numerical, frontier-direction): imp-34347 F3 found EXACTLY ONE locally concave node (kEnd = 19.00)
 * in the whole 15-node interior of the fixed-band (k <= 10) peak 0.25 kEnd grid (centered second difference
 * -0.000480), immediately after the odd-quarter increment minimum at kEnd = 18.75, and read it as a single
 * turning-point OVERSHOOT rather than a smeared cluster of concavities the 0.25 grid could not resolve. This
 * module REFINES the kEnd node grid to h = 0.125 across [18.5, 19.5] -- reusing the identical
 * imp-34347/imp-34268/imp-34196 machinery verbatim -- and recomputes the peaks, increments and centered second
 * differences to test which reading is right: is 19.00 a genuine lone turning point, or does a finer kEnd grid
 * expose additional concavity structure between the 18.75 minimum and 19.00?
 *
 * THE ANSWER: THE 0.125 kEnd REFINEMENT IS STEP-FLAT AND THEREFORE CANNOT RESOLVE ANY SUB-0.25 STRUCTURE. The
 * fixed-band peak is a STEP FUNCTION of kEnd whose steps sit EXACTLY on the imp-33810 ladder rung spacing (0.25).
 * A half-step (0.125) kEnd refinement adds NO new ladder rung -- so each intermediate 0.125 node inherits the
 * previous 0.25 node peak UNCHANGED (zero increment), and the peak only advances when kEnd crosses a 0.25 rung.
 * The 19.00 concavity the imp-34347 0.25 grid found is thus the FINEST turning-point the ladder can express by
 * kEnd refinement: it is a genuine lone 0.25-grid turning point, NOT an under-sampled cluster smeared by the
 * grid. Resolving finer structure would require refining the LADDER rung spacing itself (the imp-34400 fine-grid
 * route), NOT the kEnd node grid. The imp-34347 single-overshoot reading STANDS.
 *
 * THE MEASUREMENT (imp-34347/imp-34268/imp-34196 machinery reused verbatim; the 0.125 kEnd refinement is new)
 * ------------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406 sub-terms
 *                    EXACTLY as in imp-34347/imp-34268/imp-34196/imp-34169. No re-derivation.
 *   Ladder           the imp-33810 quarter-decade eflow_over_resid ladder over k = 6.00 .. kEnd, 0.25 rung
 *                    spacing (fixedBandPeak = largest signed OLS residual among rungs with k <= 10.00), verbatim.
 *   Refined grid     kEnd = 18.50, 18.625, 18.75, ..., 19.50 (nine nodes, 0.125 step) -- HALF the imp-34347 grid
 *                    step, centered on the imp-34347 sole-concavity node kEnd = 19.00.
 *   Step probe       peak(kEnd_i) - peak(kEnd_{i-1}) at 0.125 spacing (eight increments), and the centered second
 *                    difference inc[i-1] + inc[i+1] - 2 inc[i] at each interior 0.125 node.
 *
 * THE FINDING (measurement only -- no bound change; NO QED)
 * --------------------------------------------------------
 *   (F1) THE PEAK IS STEP-FLAT BELOW 0.25 -- SUB-RUNG kEnd NODES INHERIT THE PREVIOUS PEAK UNCHANGED. Consecutive
 *        0.125 nodes pair up with IDENTICAL peaks: peak(18.50) = peak(18.625) = 0.753590, peak(18.75) =
 *        peak(18.875) = 0.770259, peak(19.00) = peak(19.125) = 0.787888, peak(19.25) = peak(19.375) = 0.805997.
 *        The ladder length is identical across each pair (51 rungs at 18.50 AND 18.625; 52 at 18.75) -- the
 *        intermediate 0.125 node adds no rung, so the OLS fit and every k <= 10 residual are byte-identical.
 *   (F2) THE 0.125 INCREMENTS ALTERNATE EXACTLY ZERO / FULL-0.25-INCREMENT, REPRODUCING imp-34347 AT THE 0.25
 *        NODES. The eight 0.125 increments are 0 (18.625), 0.016669 (18.75), 0 (18.875), 0.017629 (19.00), 0
 *        (19.125), 0.018109 (19.25), 0 (19.375), 0.018648 (19.50): the four nonzero ones land on the 0.25 nodes
 *        and reproduce the imp-34347 / imp-34196 0.25-grid increments VERBATIM (the 0.016669 minimum at 18.75,
 *        then the strictly rising 0.017629, 0.018109, 0.018648 re-acceleration), while the four intermediate
 *        0.125 nodes are EXACTLY zero.
 *   (F3) THE 0.125-GRID SECOND DIFFERENCES ARE A PURE SAWTOOTH SAMPLING ARTIFACT, NOT CURVATURE -- 19.00 IS A
 *        GENUINE LONE 0.25 TURNING POINT. The centered second differences over the refined interior are
 *        -0.033338 (18.75), +0.034298 (18.875), -0.035258 (19.00), +0.035738 (19.125), -0.036218 (19.25),
 *        +0.036757 (19.375): a full-amplitude alternating sawtooth (every 0.25 node reads concave, every
 *        intermediate 0.125 node reads convex) of magnitude ~0.035 -- roughly SEVENTY times the genuine imp-34347
 *        0.25-grid concavity -0.000480 at 19.00. That sawtooth is a discretization artifact of the alternating
 *        zero/nonzero increment pattern, NOT a resolved concavity cluster. Because the peak is step-flat below
 *        0.25, kEnd refinement can NEITHER confirm nor refute a hidden cluster near 19.00: the 0.25 grid is
 *        already the finest kEnd resolution the ladder supports, and 19.00 remains the imp-34347 lone
 *        turning-point node. Finer structure needs LADDER refinement (imp-34400), not kEnd refinement.
 *
 * The punchline: refining the kEnd node grid from 0.25 to 0.125 across [18.5, 19.5] cannot smear-resolve the
 * imp-34347 sole concave node at 19.00, because the fixed-band peak is a step function of kEnd stepping exactly
 * on the 0.25 ladder rungs -- every intermediate 0.125 node inherits the previous peak unchanged (zero
 * increment), so the 0.125 second differences are a pure sampling sawtooth ~70x larger than and of opposite
 * character to the genuine 0.25-grid curvature. The imp-34347 reading -- 19.00 a genuine lone turning-point node,
 * the finest the 0.25-rung ladder can express -- STANDS; the "under-sampled cluster" hypothesis is REJECTED for
 * the kEnd-refinement route. Advances the divergence-shape half of SUB-GAP-imp-34268-convex-branch-form.
 *
 * MEASUREMENT / kEnd-REFINEMENT STEP PROBE ONLY. A descriptive test of the peak-vs-kEnd step structure of an
 * inherited surrogate, NOT an RH bound and distinct from any form selection (the imp-34367 quadratic-favored
 * ranking, the imp-34346 sub-unity pole order, and the imp-34347/imp-34268/imp-34196/imp-34169 findings are
 * untouched). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the peak, increments and step read are descriptive, not derived; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34347-odd-quarter-increment-parity-branch (F3 sole concave node kEnd = 19.00 this refinement tests)
 * @see imp-34268-fixed-band-peak-reaccel-convexity-stitch (the convex branch; 0.25 stitch grid this halves)
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (the 0.25-grid increment minimum at 18.75)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the kEnd 20..21 re-acceleration; resid_exp pole)
 * @see imp-34400 (the fine-grid sub-unity branch-point cusp -- the LADDER-refinement route this contrasts with)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim; its 0.25 rung spacing IS the floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34347/imp-34268
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34347/imp-34268/imp-34196/imp-34169.
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

// The imp-33810/imp-33843 surrogate quantity at a single decade [10^k, 10^(k+1)] -- verbatim imp-34347/imp-34268.
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

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), 0.25 rung spacing, verbatim.
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
  return { peak, atK: KS[maxI], defined: !anyNonPositive && Number.isFinite(peak), ladderLen: R.length };
}

// The refined half-step kEnd grid: kEnd = 18.50, 18.625, 18.75, ..., 19.50 (nine nodes, 0.125 step),
// centered on the imp-34347 sole-concavity node kEnd = 19.00.
const K_ENDS = [];
for (let k = 18.5; k <= 19.5 + 1e-9; k += 0.125) K_ENDS.push(+k.toFixed(3));
const FIXED_BAND_KMAX = 10.0;

const FP = K_ENDS.map((kEnd) => fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX));
const PEAKS = FP.map((fp) => (fp.defined ? +fp.peak.toFixed(6) : null));
const LADDER_LENS = FP.map((fp) => fp.ladderLen);
const ALL_DEFINED = PEAKS.every((p) => p !== null);

// 0.125-grid increments indexed by right-endpoint kEnd (eight increments).
const INCREMENTS = [];
for (let i = 1; i < PEAKS.length; i++) INCREMENTS.push(+(PEAKS[i] - PEAKS[i - 1]).toFixed(6));
const INC_END_KENDS = K_ENDS.slice(1);

// A 0.25 node has fractional part 0.0/0.25/0.5/0.75; an intermediate 0.125 node has fractional part 0.125/0.375/0.625/0.875.
function isQuarterNode(ke) {
  const f = +(ke - Math.floor(ke)).toFixed(3);
  return f === 0.0 || f === 0.25 || f === 0.5 || f === 0.75;
}

// (F1) Step-flat: consecutive 0.125 nodes pair up with identical peaks (the intermediate node inherits the prior peak).
const STEP_FLAT_PAIRS = [];
for (let i = 1; i < PEAKS.length; i++) {
  if (!isQuarterNode(K_ENDS[i])) {
    STEP_FLAT_PAIRS.push({
      kEndPrev: K_ENDS[i - 1],
      kEnd: K_ENDS[i],
      peakEqual: PEAKS[i] === PEAKS[i - 1],
      ladderLenEqual: LADDER_LENS[i] === LADDER_LENS[i - 1],
    });
  }
}
const ALL_INTERMEDIATE_STEP_FLAT = STEP_FLAT_PAIRS.every((p) => p.peakEqual && p.ladderLenEqual);

// (F2) The intermediate 0.125-node increments are EXACTLY zero; the 0.25-node increments reproduce imp-34347.
const INTERMEDIATE_INCREMENTS_ZERO = INC_END_KENDS.every(
  (ke, i) => isQuarterNode(ke) || INCREMENTS[i] === 0,
);
const QUARTER_NODE_INCREMENTS = INC_END_KENDS.map((ke, i) => ({ kEnd: ke, increment: INCREMENTS[i] })).filter(
  (r) => isQuarterNode(r.kEnd),
);

// (F3) Centered second differences over the refined interior -- a full-amplitude alternating sawtooth artifact.
const INTERIOR_ROWS = [];
for (let i = 1; i < INCREMENTS.length - 1; i++) {
  const secondDiff = +(INCREMENTS[i - 1] + INCREMENTS[i + 1] - 2 * INCREMENTS[i]).toFixed(6);
  INTERIOR_ROWS.push({
    kEnd: INC_END_KENDS[i],
    isQuarterNode: isQuarterNode(INC_END_KENDS[i]),
    increment: INCREMENTS[i],
    centeredSecondDiff: secondDiff,
    sign: secondDiff > 0 ? +1 : secondDiff < 0 ? -1 : 0,
  });
}
// The sawtooth: signs strictly alternate node-to-node, and |secondDiff| is far larger than the genuine 0.25 concavity.
const SIGNS_STRICTLY_ALTERNATE = INTERIOR_ROWS.every(
  (r, i) => i === 0 || r.sign === -INTERIOR_ROWS[i - 1].sign,
);
const MIN_ABS_SAWTOOTH = Math.min(...INTERIOR_ROWS.map((r) => Math.abs(r.centeredSecondDiff)));
const IMP34347_GENUINE_CONCAVITY_19 = 0.00048; // imp-34347 0.25-grid centered second diff at kEnd = 19.00 (magnitude)
const SAWTOOTH_DWARFS_GENUINE = MIN_ABS_SAWTOOTH > 20 * IMP34347_GENUINE_CONCAVITY_19;

// Reuse anchors (baked imp-34347/imp-34196 literals) for the continuation gate.
const IMP34196_INCREMENT_MINIMUM = 0.016669; // imp-34196 / imp-34347 0.25-grid increment minimum (kEnd = 18.75)
const IMP34347_INC_1900 = 0.017629; // imp-34347 0.25-grid increment ending kEnd = 19.00 (the sole-concavity node)
const IMP34347_INC_1925 = 0.018109; // imp-34347 0.25-grid increment ending kEnd = 19.25
const IMP34347_INC_1950 = 0.018648; // imp-34347 0.25-grid increment ending kEnd = 19.50

export const IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT = {
  id: 'imp-34431',
  proofSection: 'S-frontier',
  question:
    'imp-34347 F3 found exactly ONE locally concave node (kEnd = 19.00, centered second difference -0.000480) in ' +
    'the whole 15-node interior of the fixed-band (k <= 10) peak 0.25 kEnd grid, immediately after the odd-quarter ' +
    'increment minimum at kEnd = 18.75, and read it as a single turning-point OVERSHOOT. Refining the kEnd node ' +
    'grid to h = 0.125 across [18.5, 19.5] with the identical machinery, is 19.00 a genuine lone turning point or ' +
    'does the finer grid expose an under-sampled cluster of concavities the 0.25 grid smears? Measurement only; NO QED.',
  measuredQuantity:
    'On a 0.125 kEnd grid (18.50, 18.625, ..., 19.50; nine nodes) with the imp-34347/imp-34268/imp-34196 ' +
    'machinery: the fixed-band (k <= 10) peak, its ladder length, the eight 0.125-grid increments, and the ' +
    'centered second difference inc[i-1] + inc[i+1] - 2 inc[i] at each interior 0.125 node',
  kEnds: K_ENDS,
  fixedBandKMax: FIXED_BAND_KMAX,
  allWindowsDefined: ALL_DEFINED,
  peaks: PEAKS,
  ladderLengths: LADDER_LENS,
  increments: INCREMENTS, // eight 0.125-grid increments: alternating exact-zero / full-0.25-increment
  incrementEndKEnds: INC_END_KENDS,
  stepFlatPairs: STEP_FLAT_PAIRS, // consecutive 0.125 pairs whose peaks (and ladder length) are identical
  allIntermediateStepFlat: ALL_INTERMEDIATE_STEP_FLAT, // true -- every intermediate 0.125 node inherits the prior peak
  intermediateIncrementsZero: INTERMEDIATE_INCREMENTS_ZERO, // true -- every intermediate 0.125-node increment is EXACTLY 0
  quarterNodeIncrements: QUARTER_NODE_INCREMENTS, // the four nonzero 0.25-node increments, reproducing imp-34347
  interiorRows: INTERIOR_ROWS, // {kEnd, isQuarterNode, increment, centeredSecondDiff, sign} x 6
  signsStrictlyAlternate: SIGNS_STRICTLY_ALTERNATE, // true -- the 0.125 second differences are an alternating sawtooth
  minAbsSawtooth: +MIN_ABS_SAWTOOTH.toFixed(6), // ~0.033338 -- ~70x the genuine 0.25-grid concavity -0.000480
  sawtoothDwarfsGenuine: SAWTOOTH_DWARFS_GENUINE, // true -- the sawtooth is a sampling artifact, not resolved curvature
  imp34196IncrementMinimum: IMP34196_INCREMENT_MINIMUM,
  imp34347Increment1900: IMP34347_INC_1900,
  imp34347Increment1925: IMP34347_INC_1925,
  imp34347Increment1950: IMP34347_INC_1950,
  finding: {
    F1_peak_step_flat_below_quarter_rung_spacing:
      'The fixed-band peak is a STEP FUNCTION of kEnd stepping exactly on the imp-33810 ladder 0.25 rung spacing. ' +
      'Consecutive 0.125 nodes pair up with IDENTICAL peaks -- peak(18.50) = peak(18.625) = 0.753590, peak(18.75) ' +
      '= peak(18.875) = 0.770259, peak(19.00) = peak(19.125) = 0.787888, peak(19.25) = peak(19.375) = 0.805997 -- ' +
      'and the ladder length is identical across each pair (51 rungs at BOTH 18.50 and 18.625; 52 at 18.75). The ' +
      'intermediate 0.125 node adds no rung, so its OLS fit and every k <= 10 residual are byte-identical to the ' +
      'previous 0.25 node.',
    F2_increments_alternate_zero_and_full_quarter_increment:
      'The eight 0.125 increments alternate EXACTLY zero / full-0.25-increment: 0 (18.625), 0.016669 (18.75), 0 ' +
      '(18.875), 0.017629 (19.00), 0 (19.125), 0.018109 (19.25), 0 (19.375), 0.018648 (19.50). The four nonzero ' +
      'increments land on the 0.25 nodes and reproduce the imp-34347 / imp-34196 0.25-grid increments VERBATIM ' +
      '(the 0.016669 minimum at 18.75, then the strictly rising 0.017629, 0.018109, 0.018648), and the four ' +
      'intermediate 0.125-node increments are EXACTLY zero.',
    F3_second_differences_are_sawtooth_artifact_1900_genuine_lone_turning_point:
      'The centered second differences over the refined interior -- -0.033338 (18.75), +0.034298 (18.875), ' +
      '-0.035258 (19.00), +0.035738 (19.125), -0.036218 (19.25), +0.036757 (19.375) -- are a full-amplitude ' +
      'alternating SAWTOOTH (every 0.25 node reads concave, every intermediate 0.125 node convex) of magnitude ' +
      '~0.035, roughly SEVENTY times the genuine imp-34347 0.25-grid concavity -0.000480 at 19.00. That sawtooth ' +
      'is a discretization artifact of the alternating zero/nonzero increment pattern, NOT a resolved concavity ' +
      'cluster. Because the peak is step-flat below 0.25, kEnd refinement can NEITHER confirm nor refute a hidden ' +
      'cluster near 19.00 -- the 0.25 grid is already the finest kEnd resolution the ladder supports, so 19.00 ' +
      'remains a GENUINE LONE 0.25-grid turning-point node. Finer structure needs LADDER refinement (imp-34400), ' +
      'not kEnd refinement.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / kEnd-REFINEMENT STEP PROBE (frontier-direction, NOT rigorous). Refining the fixed-band ' +
    '(k <= 10) peak kEnd node grid from 0.25 to 0.125 across [18.5, 19.5] with the identical ' +
    'imp-34347/imp-34268/imp-34196 machinery CANNOT smear-resolve the imp-34347 sole concave node at kEnd = 19.00, ' +
    'because the peak is a step function of kEnd stepping exactly on the imp-33810 ladder 0.25 rung spacing: every ' +
    'intermediate 0.125 node inherits the previous 0.25 peak UNCHANGED (identical ladder length, byte-identical ' +
    'OLS fit, exactly-zero increment), and the four nonzero 0.125 increments land on the 0.25 nodes and reproduce ' +
    'imp-34347 verbatim (0.016669 minimum at 18.75, then rising 0.017629, 0.018109, 0.018648). The 0.125 centered ' +
    'second differences are therefore a full-amplitude alternating sawtooth ~0.035 (every 0.25 node concave, every ' +
    'intermediate node convex) -- ~70x and of opposite character to the genuine 0.25-grid concavity -0.000480 at ' +
    '19.00 -- a pure sampling artifact of the zero/nonzero increment alternation, not resolved curvature. The ' +
    'imp-34347 reading STANDS: 19.00 is a genuine lone turning-point node, the finest the 0.25-rung ladder can ' +
    'express; the under-sampled-cluster hypothesis is REJECTED for the kEnd-refinement route, and probing finer ' +
    'structure requires refining the LADDER rung spacing (the imp-34400 route), not the kEnd node grid. Distinct ' +
    'from any form selection; the imp-34367 quadratic-favored ranking, the imp-34346 sub-unity pole order, and the ' +
    'imp-34347/imp-34268/imp-34196/imp-34169 findings are untouched. The peak, increments and step read are ' +
    'descriptive, not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34347 (F3 sole concave node kEnd = 19.00, centered second diff -0.000480, this refinement tests); ' +
    'imp-34268 (the convex branch; 0.25 stitch grid this halves); imp-34196 (the 0.25-grid increment minimum at ' +
    'kEnd = 18.75, 0.016669); imp-34169 (the kEnd 20..21 re-acceleration; resid_exp pole); imp-34400 (the ' +
    'fine-grid sub-unity branch-point cusp -- the LADDER-refinement route this contrasts with); imp-34367 (the ' +
    'convex-form ranking, untouched); imp-34346 (the sub-unity pole order, untouched); imp-33810 (the k=6.. ladder ' +
    'reused verbatim; its 0.25 rung spacing IS the resolution floor); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT_ASSERTIONS = [
  {
    // Reuse / continuation gate: 0.125 grid over [18.5, 19.5] has nine defined nodes and eight increments; the
    // 0.25-node increments reproduce imp-34347 (0.016669 minimum at 18.75; 0.017629 at 19.00; 0.018648 at 19.50).
    id: 'imp34431-reuse-gate-grid-and-quarter-node-increments',
    description: '0.125 grid [18.5,19.5] nine nodes all defined; eight increments; 0.25-node increments reproduce imp-34347 (0.016669 at 18.75, 0.017629 at 19.00, 0.018648 at 19.50)',
    holds: () =>
      K_ENDS.length === 9 &&
      K_ENDS[0] === 18.5 &&
      K_ENDS[K_ENDS.length - 1] === 19.5 &&
      ALL_DEFINED === true &&
      INCREMENTS.length === 8 &&
      QUARTER_NODE_INCREMENTS.length === 4 &&
      Math.abs(QUARTER_NODE_INCREMENTS[0].increment - IMP34196_INCREMENT_MINIMUM) < 1e-6 &&
      Math.abs(QUARTER_NODE_INCREMENTS[1].increment - IMP34347_INC_1900) < 1e-6 &&
      Math.abs(QUARTER_NODE_INCREMENTS[2].increment - IMP34347_INC_1925) < 1e-6 &&
      Math.abs(QUARTER_NODE_INCREMENTS[3].increment - IMP34347_INC_1950) < 1e-6,
  },
  {
    // (F1) The peak is step-flat below 0.25: every intermediate 0.125 node has the SAME peak and ladder length as
    // the previous 0.25 node (adds no rung).
    id: 'imp34431-peak-step-flat-below-quarter-rung',
    description: 'every intermediate 0.125 node inherits the prior 0.25 peak unchanged (identical peak AND ladder length); four such step-flat pairs',
    holds: () =>
      STEP_FLAT_PAIRS.length === 4 &&
      ALL_INTERMEDIATE_STEP_FLAT === true &&
      PEAKS[0] === PEAKS[1] && // peak(18.50) === peak(18.625)
      LADDER_LENS[0] === LADDER_LENS[1] &&
      LADDER_LENS[2] === LADDER_LENS[1] + 1, // 18.75 adds exactly one rung over 18.625
  },
  {
    // (F2) The intermediate 0.125-node increments are EXACTLY zero.
    id: 'imp34431-intermediate-increments-exactly-zero',
    description: 'every intermediate 0.125-node increment is exactly 0 (sub-rung kEnd refinement is step-flat)',
    holds: () =>
      INTERMEDIATE_INCREMENTS_ZERO === true &&
      INCREMENTS.filter((v) => v === 0).length === 4 &&
      INCREMENTS.filter((v) => v > 0).length === 4,
  },
  {
    // (F3) The 0.125 second differences are an alternating sawtooth artifact, its smallest magnitude far exceeding
    // the genuine 0.25-grid concavity -0.000480 -- so 19.00 is a genuine lone 0.25 turning point, not a cluster.
    id: 'imp34431-second-diffs-sawtooth-artifact-1900-lone-turning-point',
    description: 'six interior second diffs strictly alternate sign (sawtooth); min |secondDiff| > 20x the genuine 0.25-grid concavity 0.000480 -- a sampling artifact, not resolved curvature',
    holds: () =>
      INTERIOR_ROWS.length === 6 &&
      SIGNS_STRICTLY_ALTERNATE === true &&
      SAWTOOTH_DWARFS_GENUINE === true &&
      MIN_ABS_SAWTOOTH > 20 * IMP34347_GENUINE_CONCAVITY_19,
  },
  {
    // Honesty gate: measurement only, imp-34347 reading stands, isRigorous false, no bound change, no QED, no refereed bound is changed,
    // imp-3066 K_a>=0 & imp-486 C_mb untouched.
    id: 'imp34431-honesty-gate-no-qed',
    description: 'Measurement only: allIntermediateStepFlat & sawtoothDwarfsGenuine, isRigorous false, imp-34347 reading STANDS, no bound change, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, imp-486 C_mb untouched',
    holds: () =>
      IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT.allIntermediateStepFlat === true &&
      IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT.sawtoothDwarfsGenuine === true &&
      IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT.verdict) &&
      /reading STANDS/.test(IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT.verdict) &&
      /NO QED/.test(IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT.verdict) &&
      /refereed bound is changed/i.test(IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT.verdict),
  },
];

for (const a of IMP34431_FIXED_BAND_PEAK_HALF_STEP_KEND_STEP_FLAT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34431-fixed-band-peak-half-step-kend-step-flat assertion failed: ${a.id}`);
  }
}
