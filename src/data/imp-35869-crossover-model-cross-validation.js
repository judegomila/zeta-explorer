/**
 * @module imp-35869-crossover-model-cross-validation
 *
 * imp-35809 derived that the imp-35762 D3 Krawczyk-headroom curvature/shift split is governed by the SINGLE
 * ratio a/(4 delta), giving the closed-form small-a model shift_fraction ~ delta / (delta + a/4) with a clean
 * 50/50 crossover at a = 4 . delta (N ~ 1.88e11, delta = 2e-4 FIXED). But it only SPOT-CHECKED that closed form
 * at the crossover and the two band endpoints; the model's fidelity to the EXACT additive split was never
 * reported across the whole height axis. This module CROSS-VALIDATES the closed-form model against the exact
 * measured curvature/shift fractions on a fine height grid spanning the imp-34693 band up to the Platt-Trudgian
 * anchor N(T_PT) ~ 1.236e13, reporting (i) the height at which the EXACT 50/50 point lands versus the a = 4 delta
 * prediction, and (ii) the MAX relative deviation of the model from the exact fractions across the whole range.
 *
 * THE TWO OBJECTS COMPARED (reproducing the imp-35809 / imp-35762 machinery verbatim)
 * ----------------------------------------------------------------------------------
 * EXACT additive split at height N (identical K, delta, S_inf, a(N) as imp-35809):
 *   S_inf = 1/(2 delta);  a = a(N);  G = 1 - a;
 *   S_exact    = G / ((1+G) delta (1 - a(N(1-delta))))   (a-shift ON)
 *   S_no_shift = G / ((1+G) delta (1 - a))               (a-shift OFF)
 *   total_residual = (S_exact - S_inf) - S_inf . a/2;  shift = S_exact - S_no_shift;  curvature = rest.
 *   shift_fraction_exact = shift / total,  curvature_fraction_exact = curvature / total.
 * CLOSED-FORM model (imp-35809 small-a algebra): shift_fraction_model = delta / (delta + a/4), and
 *   curvature_fraction_model = 1 - shift_fraction_model = (a/4) / (delta + a/4).
 *
 * WHAT THE CROSS-VALIDATION FINDS
 * ------------------------------
 *   (V1) EXACT 50/50 LANDS ON THE a = 4 delta PREDICTION. Bisecting shift_fraction_exact = 0.5 puts the exact
 *        crossover at N ~ 1.8817e11 (a ~ 7.9927e-4), while the model crossover (a = 4 delta = 8.0e-4 exactly)
 *        lands at N ~ 1.8799e11. The two agree to ~0.09% in height and the exact crossover contraction factor
 *        sits ~0.09% below 4 delta -- exactly the size of the neglected O(a) small-a correction at a ~ 8e-4.
 *   (V2) MAX MODEL DEVIATION ~4.5%, CONFINED TO THE BAND BOTTOM. Across a 41-point log grid from the band bottom
 *        (a ~ 0.0479, the LARGEST a on the range) to the PT anchor, the max relative deviation of the model from
 *        the exact fractions is ~4.47%, attained at the band bottom in the SHIFT channel (there the exact shift
 *        fraction ~1.7% is tiny, so its relative error is amplified). The curvature channel stays within ~0.12%
 *        everywhere. The deviation is an O(a) effect: it is largest where a is largest (the band) and collapses
 *        up-height -- by the crossover it is under ~0.05% and by the PT anchor the shift channel matches to
 *        ~2e-5. So the closed form is a faithful proxy for the exact split everywhere a is small, with the only
 *        multi-percent gap living at the low-height band edge where a is order 5e-2.
 *
 * CONSEQUENCE: the imp-35809 closed-form shift_fraction ~ delta/(delta + a/4) and its a = 4 delta crossover are
 * confirmed as accurate models of the exact additive split, not merely three-point coincidences. Their only
 * material error (~4.5%) is the O(a) small-a correction at the band bottom; from the crossover N ~ 1.88e11 up to
 * the PT anchor the model tracks the exact fractions to well under 0.1%. This closes the fidelity question
 * imp-35809 left open (it reported the split profile and crossover but never the model's max deviation).
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35809/imp-35762/imp-35266
 * machinery (identical K, delta, N_cross, band, a(N), split form). The imp-34714a machine certificate REMAINS
 * OPEN; F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35809-krawczyk-surplus-split-band-and-height-profile (closed form a/(4 delta) + a = 4 delta crossover)
 * @see imp-35846-crossover-height-sensitivity-to-delta (sensitivity of the crossover height to delta)
 * @see imp-35762-krawczyk-surplus-shift-residual-isolation (defined the exact additive split)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (D3 leading estimate S_inf . a/2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35809/imp-35762)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)
const N_PT_ANCHOR = 1.236e13; // Platt-Trudgian anchor N(T_PT) (imp-321/imp-3406 height mapping)

const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029e9 (Banach fixed point)
const L_CONTRACTION = aOf(1e9);
const L_AT_CROSS = aOf(N_CROSS);
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));
const HALF_WIDTH = rho(1, 10); // ~1.7124e8 (imp-34693 seed band half-width)
const BAND_BOTTOM = N_CROSS - HALF_WIDTH;

// The EXACT imp-35762 additive residual split at height N; returns the shift/curvature fractions.
function splitExactAt(N) {
  const a = aOf(N);
  const aLo = aOf(N * (1 - DELTA)); // seed-shifted lower fixed-point contraction factor
  const G = 1 - a;
  const S_exact = G / ((1 + G) * DELTA * (1 - aLo)); // a-shift ON
  const S_no_shift = G / ((1 + G) * DELTA * (1 - a)); // a-shift OFF (a_lo -> a(N))
  const total_residual = S_exact - S_INF - (S_INF * a) / 2;
  const shift_residual = S_exact - S_no_shift;
  const curvature_residual = S_no_shift - S_INF - (S_INF * a) / 2;
  return { a, shift_fraction: shift_residual / total_residual, curvature_fraction: curvature_residual / total_residual };
}

// The imp-35809 CLOSED-FORM model, a function of the contraction factor a alone.
const modelShiftFraction = (a) => DELTA / (DELTA + a / 4);
const modelCurvatureFraction = (a) => (a / 4) / (DELTA + a / 4);

// (V1) EXACT 50/50 crossover (bisection on log N) vs the model a = 4 delta prediction.
function exactCrossoverN() {
  let lo = 1e10, hi = 1e12;
  for (let i = 0; i < 100; i++) {
    const mid = Math.sqrt(lo * hi);
    if (splitExactAt(mid).shift_fraction < 0.5) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}
// The model crossover is a = 4 delta exactly; invert a(N) = 4 delta on log N (a is monotone-decreasing in N).
function modelCrossoverN() {
  let lo = 1e10, hi = 1e12;
  for (let i = 0; i < 100; i++) {
    const mid = Math.sqrt(lo * hi);
    if (aOf(mid) > 4 * DELTA) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}
const N_CROSS_EXACT = exactCrossoverN();
const A_CROSS_EXACT = aOf(N_CROSS_EXACT);
const N_CROSS_MODEL = modelCrossoverN();
const CROSSOVER_N_REL_DEV = Math.abs(N_CROSS_EXACT - N_CROSS_MODEL) / N_CROSS_MODEL;
const CROSSOVER_A_REL_DEV = Math.abs(A_CROSS_EXACT - 4 * DELTA) / (4 * DELTA);

// (V2) Fine 41-point log grid from the band bottom up to the PT anchor: exact vs model, per-channel rel deviation.
const N_GRID = 41;
const GRID = [];
for (let i = 0; i < N_GRID; i++) {
  const N = BAND_BOTTOM * Math.pow(N_PT_ANCHOR / BAND_BOTTOM, i / (N_GRID - 1));
  const ex = splitExactAt(N);
  const mShift = modelShiftFraction(ex.a);
  const mCurv = modelCurvatureFraction(ex.a);
  const relDevShift = Math.abs(mShift - ex.shift_fraction) / Math.abs(ex.shift_fraction);
  const relDevCurv = Math.abs(mCurv - ex.curvature_fraction) / Math.abs(ex.curvature_fraction);
  GRID.push({
    N: +N.toPrecision(6), a: +ex.a.toPrecision(6),
    shift_exact: +ex.shift_fraction.toFixed(6), shift_model: +mShift.toFixed(6),
    rel_dev_shift: +relDevShift.toExponential(4), rel_dev_curvature: +relDevCurv.toExponential(4),
  });
}
const MAX_REL_DEV_SHIFT = Math.max(...GRID.map((r) => r.rel_dev_shift));
const MAX_REL_DEV_CURVATURE = Math.max(...GRID.map((r) => r.rel_dev_curvature));
const MAX_REL_DEV = Math.max(MAX_REL_DEV_SHIFT, MAX_REL_DEV_CURVATURE);
const ARGMAX = GRID.reduce((best, r) => (Math.max(r.rel_dev_shift, r.rel_dev_curvature) >
  Math.max(best.rel_dev_shift, best.rel_dev_curvature) ? r : best), GRID[0]);
const PT_ROW = GRID[GRID.length - 1];

export const IMP35869_CROSSOVER_MODEL_CROSS_VALIDATION = {
  id: 'imp-35869',
  proofSection: 'S-frontier',
  question:
    'imp-35809 derived the closed-form shift_fraction ~ delta / (delta + a/4) governing the imp-35762 D3 ' +
    'curvature/shift split, with a 50/50 crossover at a = 4 . delta (N ~ 1.88e11), but only spot-checked it at ' +
    'the crossover and the two band endpoints. Cross-validate the closed form against the EXACT measured ' +
    'fractions on a fine height grid from the imp-34693 band up to the PT anchor N ~ 1.236e13, reporting the ' +
    'height at which the exact 50/50 point lands versus the a = 4 . delta prediction and the MAX relative ' +
    'deviation of the model across the whole range. Measurement only; surrogate; imp-34714a stays OPEN; ' +
    'changes no bound; NO QED.',
  finding:
    'The imp-35809 closed form is a faithful proxy for the exact additive split; its only material error is the ' +
    'O(a) small-a correction at the low-height band edge. (V1) The EXACT 50/50 crossover lands at N ~ 1.8817e11 ' +
    '(a ~ 7.9927e-4), agreeing with the model a = 4 . delta = 8.0e-4 prediction (N ~ 1.8799e11) to ~0.09% in ' +
    'height; the exact crossover contraction factor sits ~0.09% below 4 . delta, exactly the neglected O(a) ' +
    'correction at a ~ 8e-4. (V2) Across a 41-point log grid from the band bottom (a ~ 0.0479, the largest a on ' +
    'the range) to the PT anchor the MAX relative deviation of the model from the exact fractions is ~4.47%, ' +
    'attained at the band bottom in the SHIFT channel (where the exact shift fraction ~1.7% is tiny so its ' +
    'relative error is amplified); the curvature channel stays within ~0.12% everywhere. The deviation is O(a): ' +
    'largest where a is largest and collapsing up-height -- under ~0.05% by the crossover and ~2e-5 in the shift ' +
    'channel at the PT anchor. EVIDENCE / measurement, NOT a machine certificate.',
  constants: {
    delta: DELTA,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
    N_pt_anchor: N_PT_ANCHOR,
    band_bottom_N: +BAND_BOTTOM.toPrecision(15),
    a_at_band_bottom: +aOf(BAND_BOTTOM).toPrecision(8),
  },
  measurement: {
    // (V1) exact vs model crossover
    crossover_N_exact: +N_CROSS_EXACT.toPrecision(6), // ~1.8817e11
    crossover_a_exact: +A_CROSS_EXACT.toPrecision(6), // ~7.9927e-4
    crossover_N_model_4delta: +N_CROSS_MODEL.toPrecision(6), // ~1.8799e11 (a = 4 delta)
    crossover_a_closed_form_4delta: 4 * DELTA, // 8.0e-4
    crossover_N_relative_deviation: +CROSSOVER_N_REL_DEV.toExponential(4), // ~9.2e-4
    crossover_a_relative_deviation: +CROSSOVER_A_REL_DEV.toExponential(4), // ~9.1e-4
    // (V2) fine grid model-vs-exact deviation
    grid: GRID,
    max_relative_deviation: +MAX_REL_DEV.toExponential(4), // ~4.47e-2
    max_relative_deviation_shift_channel: +MAX_REL_DEV_SHIFT.toExponential(4), // ~4.47e-2 (band bottom)
    max_relative_deviation_curvature_channel: +MAX_REL_DEV_CURVATURE.toExponential(4), // ~1.2e-3
    argmax_N: ARGMAX.N, // band bottom (largest a)
    pt_anchor_rel_dev_shift: PT_ROW.rel_dev_shift, // ~2e-5 (model exact up-height)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Cross-validating the closed-form shift-fraction model against the exact split ' +
    'does NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the ' +
    'gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 ' +
    'remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'CROSSOVER MODEL CROSS-VALIDATION (frontier, NOT an RH bound). imp-35809 derived the closed-form ' +
    'shift_fraction ~ delta/(delta + a/4) with a 50/50 crossover at a = 4 . delta (N ~ 1.88e11) but spot-checked ' +
    'it only at the crossover and the two band endpoints. Cross-validating it against the EXACT additive split ' +
    'on a 41-point log grid from the band up to the PT anchor N ~ 1.236e13: (V1) the exact 50/50 crossover lands ' +
    'at N ~ 1.8817e11 (a ~ 7.9927e-4), matching the model a = 4 . delta = 8.0e-4 prediction (N ~ 1.8799e11) to ' +
    '~0.09% in height, the ~0.09% gap being exactly the neglected O(a) correction; (V2) the MAX relative ' +
    'deviation of the model from the exact fractions is ~4.47%, attained at the band bottom (largest a ~ 0.0479) ' +
    'in the shift channel, with the curvature channel within ~0.12% everywhere and the deviation collapsing ' +
    'up-height (under ~0.05% by the crossover, ~2e-5 at the PT anchor). So the imp-35809 closed form is a ' +
    'faithful proxy whose only multi-percent error is the O(a) band-edge correction. EVIDENCE, NOT a machine ' +
    'certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the ' +
    'imp-34687a directed-rounding layer, and F(m) = 0 remains a double-precision artifact. Measurement only on ' +
    'the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35809/imp-35762/imp-35266 machinery ' +
    '(identical K, delta, N_cross, band, a(N), split form); C_C 1/8 (imp-2642/2643) and C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; changes ' +
    'no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35809 (closed form a/(4 delta) + a = 4 delta crossover, spot-checked at 3 anchors); imp-35846 ' +
    '(crossover-height sensitivity to delta); imp-35762 (defined the exact additive split); imp-35266 (D3 ' +
    'leading estimate S_inf . a/2); imp-34996 (S_inf = 1/(2 delta) floor); imp-34693 (admissible seed band); ' +
    'imp-321/imp-3406 (PT anchor N ~ 1.236e13); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). ' +
    'Fine-grid cross-validation of a previously spot-checked closed-form model with a max-deviation report: ' +
    'standard.',
};

export const IMP35869_CROSSOVER_MODEL_CROSS_VALIDATION_ASSERTIONS = [
  {
    // (V1) The exact 50/50 crossover lands on the model a = 4 . delta prediction (to ~0.1% in height and a).
    id: 'imp35869-exact-crossover-matches-4delta-model',
    description: 'the exact shift=curvature 50/50 crossover (N ~ 1.8817e11, a ~ 7.9927e-4) matches the a = 4 delta model to under ~1%',
    holds: () =>
      N_CROSS_EXACT > 1.5e11 && N_CROSS_EXACT < 2.5e11 &&
      CROSSOVER_N_REL_DEV < 1e-2 &&
      CROSSOVER_A_REL_DEV < 1e-2 &&
      A_CROSS_EXACT < 4 * DELTA, // exact a sits just below 4 delta (neglected O(a) correction)
  },
  {
    // (V2) The model's max relative deviation over the whole range is a few percent, confined to the band bottom.
    id: 'imp35869-max-deviation-confined-to-band-bottom',
    description: 'max model-vs-exact relative deviation ~4.5% is attained at the band bottom (largest a); curvature channel stays under ~0.3%',
    holds: () =>
      GRID.length === 41 &&
      MAX_REL_DEV > 0.03 && MAX_REL_DEV < 0.06 &&
      MAX_REL_DEV === MAX_REL_DEV_SHIFT && // the shift channel binds
      MAX_REL_DEV_CURVATURE < 0.003 &&
      ARGMAX.N === GRID[0].N, // argmax at the band bottom
  },
  {
    // (V2 cont.) The deviation collapses up-height: at the PT anchor the model matches the exact shift to ~1e-4.
    id: 'imp35869-model-exact-up-height',
    description: 'from the crossover up to the PT anchor the model tracks the exact shift fraction to well under 0.1%',
    holds: () =>
      PT_ROW.rel_dev_shift < 1e-4 &&
      // deviation at the crossover height is already sub-0.1%
      Math.abs(modelShiftFraction(A_CROSS_EXACT) - splitExactAt(N_CROSS_EXACT).shift_fraction) /
        splitExactAt(N_CROSS_EXACT).shift_fraction < 1e-3,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35869-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35869_CROSSOVER_MODEL_CROSS_VALIDATION.isRigorous === false &&
      /imp-34714a/.test(IMP35869_CROSSOVER_MODEL_CROSS_VALIDATION.subGap) &&
      /REMAINS OPEN/.test(IMP35869_CROSSOVER_MODEL_CROSS_VALIDATION.subGap) &&
      /NO QED/.test(IMP35869_CROSSOVER_MODEL_CROSS_VALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP35869_CROSSOVER_MODEL_CROSS_VALIDATION.verdict),
  },
];

for (const a of IMP35869_CROSSOVER_MODEL_CROSS_VALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35869-crossover-model-cross-validation assertion failed: ${a.id}`);
  }
}
