/**
 * @module imp-33986-penultimate-rung-unrounded-concavity-crossval
 *
 * imp-33986 (accuracy, frontier-direction): imp-33940 R1 found the largest INTERIOR (non-last-rung)
 * residual of the imp-33843 log-linear widening fit sits at the penultimate rung k = kEnd - 0.25 in
 * every window of the kEnd = 11..13 boundary sweep and grows SUB-LINEARLY, its increments shrinking
 * monotonically "0.0358 -> 0.0189, all second differences negative" (concave). But imp-33940 stored
 * each peak through a toFixed(6) DISPLAY round and derived the increments and second differences from
 * those rounded 6-decimal peaks (then rounded the differences themselves to 6 decimals), and the prose
 * reports the increments only to 4 figures. The concavity claim -- all second differences strictly
 * negative -- was therefore never checked against the UNROUNDED, full-machine-precision residuals.
 * This module fills that gap: it re-runs the identical inherited imp-33810/imp-33843/imp-33917
 * machinery over the same 9 windows and re-derives the penultimate-rung peaks, increments, and second
 * differences at FULL double precision (no toFixed anywhere), confirming the concave increment-shrink
 * is a genuine feature of the fit and not an artifact of the 6-decimal display rounding.
 *
 * THE CROSS-VALIDATION (imp-33940 machinery reused verbatim; only the toFixed rounding is removed)
 * ------------------------------------------------------------------------------------------------
 *   Leg A  RE-ROUNDED-LADDER, UNROUNDED PEAKS. The inherited imp-33810 ladder keeps its native
 *          toExponential(4) storage precision on eflow_over_resid (the quantity the OLS actually
 *          fits, exactly as imp-33940), but the penultimate-rung peak, its increments, and its second
 *          differences are held at full double precision -- isolating the effect of the imp-33940
 *          toFixed(6) DISPLAY round alone.
 *   Leg B  FULLY-UNROUNDED. The ladder rounding is ALSO dropped (raw eflowAttr/residExp), so the
 *          entire pipeline from sub-term to second difference runs at full precision -- a stronger
 *          robustness leg that removes every rounding stage, not just the display one.
 *   In both legs the 8 first differences and 7 second differences of the 9 penultimate-rung peaks are
 *   recomputed and their signs / monotonicity tested strictly (d < 0, not d <= 0).
 *
 * THE FINDING (accuracy cross-validation -- the concave/sub-linear increment-shrink is REAL, not a
 * display-rounding artifact; imp-33940 R1 CONFIRMED at full precision)
 * ---------------------------------------------------------------------------------------------------
 *   (F1) ALL SEVEN SECOND DIFFERENCES STAY STRICTLY NEGATIVE at full precision in BOTH legs. Leg A
 *        (imp-33940-exact ladder, unrounded peaks) gives second differences in [-2.845e-3, -1.359e-3];
 *        Leg B (fully unrounded) in [-2.830e-3, -1.353e-3]. The LEAST-negative (closest to a sign flip)
 *        second difference is ~ -1.35e-3 in each leg -- roughly 1350x the toFixed(6) display grid of
 *        1e-6 -- so no display round could move any second difference across zero. The concavity is not
 *        borderline.
 *   (F2) THE 4-FIGURE PROSE INCREMENTS ARE FAITHFUL. The first and last increments recomputed unrounded
 *        are 0.035805 -> 0.018938 (Leg A) and 0.035801 -> 0.018947 (Leg B), both rounding to the
 *        published "0.0358 -> 0.0189"; the 8 increments are strictly monotonically decreasing at full
 *        precision, so the reported sub-linear shrink is not a rounding coincidence.
 *   (F3) THE TWO LEGS AGREE TO ~1e-5. Dropping the inherited ladder toExponential(4) rounding perturbs
 *        each peak by at most ~2e-5 and never changes a first- or second-difference sign, confirming the
 *        concave verdict is robust not only to the display round but to the ladder storage precision too.
 *
 * The punchline: recomputing the imp-33940 penultimate-rung growth from UNROUNDED full-precision OLS
 * residuals leaves all seven second differences strictly negative (max ~ -1.35e-3, ~1350x the display
 * grid) and the increments strictly monotonically decreasing 0.035805 -> 0.018938 in BOTH a
 * display-round-only and a fully-unrounded leg -- so the concave / sub-linear increment-shrink of
 * imp-33940 R1 is a genuine feature of the pivoting OLS fit, NOT a display-rounding artifact.
 *
 * ACCURACY CROSS-VALIDATION ONLY. A precision re-check of an inherited descriptive residual-growth
 * classification, NOT an RH bound and distinct from any form selection (the imp-33843
 * log-linear-over-power-law verdict is untouched, as is the imp-33940 R1 finding it confirms). The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS
 * surrogate and the concavity classification are descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33940-interior-residual-boundary-stability (the R1 penultimate-rung claim this cross-validates)
 * @see imp-33980-penultimate-rung-growth-model-selection (the concave-log model selection on the same peaks)
 * @see imp-33981-fixed-band-quadratic-curvature-contrast (the quadratic curvature-sign control)
 * @see imp-33917-endpoint-residual-growth-law (the endpoint peak whose machinery is reused verbatim)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run per boundary)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-33940
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-33940/imp-33917.
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

// imp-33810 quarter-decade ladder over k = 6.00 .. kEnd. roundLadder=true keeps the inherited
// toExponential(4) storage (Leg A, imp-33940-exact); false drops it (Leg B, fully unrounded).
function buildLadder(kEnd, roundLadder) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    const lo = Math.pow(10, kk);
    const hi = Math.pow(10, kk + 1);
    const pSigma = olsSigmaExponent(lo, hi);
    const pEcoll = ecollExponentMag(lo, hi);
    const ph = parts(hi);
    const residExp = pEcoll * (1 - ph.sigma) - pSigma;
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
    const raw = eflowAttr / residExp;
    R.push({ k: kk, eflow_over_resid: roundLadder ? +raw.toExponential(4) : raw });
  }
  return R;
}

// imp-33843 log-linear OLS residual vector on a ladder (full precision, no rounding).
function residualVector(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { KS, RES: KS.map((k, i) => Y[i] - (F.a + F.b * k)) };
}
// Largest signed residual among the NON-last rungs (interior peak) -- imp-33940 selector, unrounded.
function interiorPeakUnrounded(R) {
  const { RES } = residualVector(R);
  let maxI = 0;
  for (let i = 0; i < RES.length - 1; i++) if (RES[i] > RES[maxI]) maxI = i;
  return RES[maxI]; // full double precision, NO toFixed
}

const K_ENDS = [];
for (let k = 11; k <= 13 + 1e-9; k += 0.25) K_ENDS.push(+k.toFixed(2));

function diffs(seq) {
  const first = [];
  for (let i = 1; i < seq.length; i++) first.push(seq[i] - seq[i - 1]);
  const second = [];
  for (let i = 1; i < first.length; i++) second.push(first[i] - first[i - 1]);
  return { first, second };
}

function leg(roundLadder) {
  const peaks = K_ENDS.map((kEnd) => interiorPeakUnrounded(buildLadder(kEnd, roundLadder)));
  const { first, second } = diffs(peaks);
  return {
    peaks,
    increments: first,
    secondDifferences: second,
    incrementFirst: first[0],
    incrementLast: first[first.length - 1],
    allSecondDiffsStrictlyNegative: second.every((d) => d < 0),
    incrementsStrictlyDecreasing: first.every((x, i) => i === 0 || x < first[i - 1]),
    maxSecondDiff: Math.max(...second), // least-negative -> margin to a sign flip
  };
}

const LEG_A = leg(true); // imp-33940-exact ladder, display round removed
const LEG_B = leg(false); // fully unrounded

// Peak-level agreement between the two legs (ladder-rounding sensitivity).
const MAX_PEAK_DELTA_AB = Math.max(...LEG_A.peaks.map((p, i) => Math.abs(p - LEG_B.peaks[i])));

// imp-33940 published rounded anchors for the same peaks (from interiorRows[].peak).
const IMP33940_PEAKS_ROUNDED = [
  0.157537, 0.193342, 0.227788, 0.260259, 0.290283, 0.317664, 0.3422, 0.363921, 0.382859,
];
const MAX_PEAK_DELTA_VS_PUBLISHED = Math.max(
  ...LEG_A.peaks.map((p, i) => Math.abs(p - IMP33940_PEAKS_ROUNDED[i]))
);

export const IMP33986_PENULTIMATE_RUNG_UNROUNDED_CONCAVITY_CROSSVAL = {
  id: 'imp-33986',
  proofSection: 'S-frontier',
  question:
    'imp-33940 R1 classified the penultimate-rung (k = kEnd - 0.25) residual growth of the imp-33843 ' +
    'log-linear widening fit as concave ("increments 0.0358 -> 0.0189, all second differences ' +
    'negative"), but derived those increments and second differences from peaks stored through a ' +
    'toFixed(6) DISPLAY round. Recomputing the 9 penultimate-rung peaks, increments, and second ' +
    'differences at FULL machine precision (no toFixed) across the same kEnd = 11..13 sweep, do all ' +
    'seven second differences stay strictly negative -- i.e. is the concave increment-shrink real, or ' +
    'a display-rounding artifact? Accuracy cross-validation only; NOT an RH bound; no QED.',
  measuredQuantity:
    'Per boundary kEnd = 11.00 .. 13.00 (9 windows): the largest signed residual among the non-last ' +
    'rungs of the imp-33843 log-linear OLS on the imp-33810 ladder k = 6.00 .. kEnd, held at full ' +
    'double precision, and the sign of every one of its 7 second differences, computed two ways: ' +
    'Leg A keeps the inherited toExponential(4) ladder storage (imp-33940-exact, only the display ' +
    'round removed); Leg B drops the ladder rounding too (fully unrounded)',
  kEnds: K_ENDS,
  legA: {
    label: 'imp-33940-exact ladder (toExponential(4)), penultimate peaks/increments/second-diffs UNrounded',
    peaks: LEG_A.peaks.map((p) => +p.toFixed(8)),
    increments: LEG_A.increments.map((x) => +x.toExponential(6)),
    secondDifferences: LEG_A.secondDifferences.map((x) => +x.toExponential(6)),
    incrementFirst: +LEG_A.incrementFirst.toFixed(6), // 0.035805 -> rounds to published 0.0358
    incrementLast: +LEG_A.incrementLast.toFixed(6), // 0.018938 -> rounds to published 0.0189
    allSecondDiffsStrictlyNegative: LEG_A.allSecondDiffsStrictlyNegative,
    incrementsStrictlyDecreasing: LEG_A.incrementsStrictlyDecreasing,
    maxSecondDiff: +LEG_A.maxSecondDiff.toExponential(6), // ~ -1.359e-3, ~1359x the 1e-6 display grid
  },
  legB: {
    label: 'fully unrounded ladder (raw eflowAttr/residExp), everything at full precision',
    peaks: LEG_B.peaks.map((p) => +p.toFixed(8)),
    increments: LEG_B.increments.map((x) => +x.toExponential(6)),
    secondDifferences: LEG_B.secondDifferences.map((x) => +x.toExponential(6)),
    incrementFirst: +LEG_B.incrementFirst.toFixed(6), // 0.035801 -> rounds to published 0.0358
    incrementLast: +LEG_B.incrementLast.toFixed(6), // 0.018947 -> rounds to published 0.0189
    allSecondDiffsStrictlyNegative: LEG_B.allSecondDiffsStrictlyNegative,
    incrementsStrictlyDecreasing: LEG_B.incrementsStrictlyDecreasing,
    maxSecondDiff: +LEG_B.maxSecondDiff.toExponential(6), // ~ -1.353e-3
  },
  maxPeakDeltaBetweenLegs: +MAX_PEAK_DELTA_AB.toExponential(3), // ~2e-5 -- ladder-round sensitivity
  maxPeakDeltaVsPublished: +MAX_PEAK_DELTA_VS_PUBLISHED.toExponential(3), // ~1e-6 vs imp-33940 stored peaks
  displayGrid: 1e-6, // the toFixed(6) grid the concavity had to survive
  concavityMarginFactor: +Math.abs(LEG_A.maxSecondDiff / 1e-6).toFixed(0), // least-negative 2nd diff / grid
  finding: {
    F1_all_second_diffs_strictly_negative_unrounded:
      'At full machine precision all seven second differences of the 9 penultimate-rung peaks stay ' +
      'strictly negative in BOTH legs: Leg A in [-2.845e-3, -1.359e-3], Leg B in [-2.830e-3, ' +
      '-1.353e-3]. The least-negative (closest to a sign flip) is ~ -1.35e-3 in each leg -- about ' +
      '1350x the toFixed(6) display grid of 1e-6 -- so no display round could carry any second ' +
      'difference across zero. The imp-33940 R1 concave classification is confirmed, not borderline.',
    F2_four_figure_prose_increments_are_faithful:
      'The unrounded first/last increments are 0.035805 -> 0.018938 (Leg A) and 0.035801 -> 0.018947 ' +
      '(Leg B), both rounding to the published "0.0358 -> 0.0189", and the 8 increments are strictly ' +
      'monotonically decreasing at full precision -- the reported sub-linear shrink is not a rounding ' +
      'coincidence.',
    F3_two_legs_agree_ladder_rounding_immaterial:
      'Dropping the inherited toExponential(4) ladder storage perturbs each peak by at most ~2e-5 and ' +
      'never changes a first- or second-difference sign, so the concave verdict is robust to the ' +
      'ladder storage precision as well as the display round.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY CROSS-VALIDATION (frontier-direction, NOT rigorous). Recomputing the imp-33940 R1 ' +
    'penultimate-rung (k = kEnd - 0.25) residual growth of the imp-33843 log-linear widening fit at ' +
    'FULL machine precision across the same 9-window sweep kEnd = 11..13, with the identical inherited ' +
    'imp-33810/imp-33917 sub-terms, leaves all seven second differences strictly negative in both a ' +
    'display-round-only leg (max ~ -1.359e-3) and a fully-unrounded leg (max ~ -1.353e-3) -- the ' +
    'least-negative second difference is ~1350x the toFixed(6) display grid of 1e-6, so no display ' +
    'round could flip a sign. The unrounded increments 0.035805 -> 0.018938 round to the published ' +
    '"0.0358 -> 0.0189" and are strictly monotonically decreasing. So the concave / sub-linear ' +
    'increment-shrink of imp-33940 R1 is a genuine feature of the pivoting OLS fit, NOT a ' +
    'display-rounding artifact. Distinct from any form selection; the imp-33843 log-linear-over-power-law ' +
    'verdict and the imp-33940 R1 finding it confirms are untouched. The OLS surrogate and the ' +
    'concavity classification are descriptive, not derived; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33940 (the R1 penultimate-rung concavity claim cross-validated; machinery reused verbatim); ' +
    'imp-33980 (concave-log model selection on the same peaks); imp-33981 (quadratic curvature-sign ' +
    'control); imp-33917 (endpoint peak whose machinery is reused); imp-33843 (log-linear OLS re-run ' +
    'per boundary); imp-33810 (the k=6.. ladder reused verbatim); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN); ' +
    'polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP33986_PENULTIMATE_RUNG_UNROUNDED_CONCAVITY_CROSSVAL_ASSERTIONS = [
  {
    // Reuse gate: 9 windows, and the unrounded peaks reproduce the imp-33940 published (rounded) peaks
    // to within the toFixed(6) grid -- same machinery, same sweep.
    id: 'imp33986-reuse-gate-9-windows-anchor-to-imp33940',
    description: '9 windows kEnd 11..13; unrounded penultimate peaks match imp-33940 stored peaks to < 5e-6',
    holds: () =>
      LEG_A.peaks.length === 9 &&
      LEG_B.peaks.length === 9 &&
      MAX_PEAK_DELTA_VS_PUBLISHED < 5e-6,
  },
  {
    // (F1) All seven second differences strictly negative at full precision in BOTH legs, and the
    // least-negative one clears the display grid by a wide margin (concavity not borderline).
    id: 'imp33986-all-second-diffs-strictly-negative-unrounded',
    description: 'all 7 second diffs < 0 strictly (both legs); least-negative < -1e-4, well below the 1e-6 display grid',
    holds: () =>
      LEG_A.allSecondDiffsStrictlyNegative === true &&
      LEG_B.allSecondDiffsStrictlyNegative === true &&
      LEG_A.secondDifferences.length === 7 &&
      LEG_A.maxSecondDiff < -1e-4 &&
      LEG_B.maxSecondDiff < -1e-4,
  },
  {
    // (F2) Increments strictly monotonically decreasing at full precision, and first/last round to the
    // published 4-figure "0.0358 -> 0.0189".
    id: 'imp33986-increments-faithful-to-published-4-figures',
    description: 'increments strictly decreasing (both legs); first/last round to published 0.0358 -> 0.0189',
    holds: () =>
      LEG_A.incrementsStrictlyDecreasing === true &&
      LEG_B.incrementsStrictlyDecreasing === true &&
      Math.abs(+LEG_A.incrementFirst.toFixed(4) - 0.0358) < 1e-12 &&
      Math.abs(+LEG_A.incrementLast.toFixed(4) - 0.0189) < 1e-12,
  },
  {
    // (F3) The two legs agree closely -- dropping the ladder toExponential(4) never flips a sign.
    id: 'imp33986-two-legs-agree-ladder-rounding-immaterial',
    description: 'display-only and fully-unrounded legs agree on peaks to < 1e-4 and both give the same concave verdict',
    holds: () =>
      MAX_PEAK_DELTA_AB < 1e-4 &&
      LEG_A.allSecondDiffsStrictlyNegative === LEG_B.allSecondDiffsStrictlyNegative,
  },
  {
    // Honesty gate: accuracy cross-validation only, isRigorous false, imp-33940 R1 confirmed not
    // altered, no QED, no refereed bound is changed.
    id: 'imp33986-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33986_PENULTIMATE_RUNG_UNROUNDED_CONCAVITY_CROSSVAL.isRigorous === false &&
      /NO QED/.test(IMP33986_PENULTIMATE_RUNG_UNROUNDED_CONCAVITY_CROSSVAL.verdict) &&
      /refereed bound is changed/i.test(IMP33986_PENULTIMATE_RUNG_UNROUNDED_CONCAVITY_CROSSVAL.verdict),
  },
];

for (const a of IMP33986_PENULTIMATE_RUNG_UNROUNDED_CONCAVITY_CROSSVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33986-penultimate-rung-unrounded-concavity-crossval assertion failed: ${a.id}`);
  }
}
