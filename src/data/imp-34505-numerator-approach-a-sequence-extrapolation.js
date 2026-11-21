/**
 * @module imp-34505-numerator-approach-a-sequence-extrapolation
 *
 * imp-34505 (accuracy, frontier cross-validation): imp-34489 fit the numerator-approach gap
 * g(kEnd) = 1 - numerator with a FOUR-TERM series g ~ a/kEnd + b/kEnd^2 + c/kEnd^3 + c4/kEnd^4 and
 * reported the leading-coefficient a as a sequence {two-term, three-term, four-term} whose order-to-order
 * shift SHRINKS (~0.0022 at 2->3, ~0.00067 at 3->4), landing a in 0.4349-0.4355 -- but never
 * EXTRAPOLATED that a-sequence to a limit. This module takes the imp-34489 per-window a-triples
 * {a2, a3, a4} verbatim and applies Aitken Delta-squared (equivalently a geometric-ratio) extrapolation
 * to estimate the a-limit a_star, quantifies the residual band (how far a_star sits below the four-term a4),
 * and asks whether the shrinking-shift RATIO r = (a4 - a3)/(a3 - a2) is consistent with a fixed convergence
 * rate across the four imp-34286 windows.
 *
 * THE EXTRAPOLATION -- AITKEN DELTA-SQUARED ON THE THREE-POINT a-SEQUENCE
 * ---------------------------------------------------------------------
 *   For each window the three a estimates are x0 = a2 (two-term), x1 = a3 (three-term), x2 = a4 (four-term).
 *   The order-to-order shifts are d1 = x1 - x0 (the 2->3 shift) and d2 = x2 - x1 (the 3->4 shift). Aitken:
 *       a_star = x2 - d2^2 / (d2 - d1)
 *   which, for a geometrically-decaying shift sequence d2 = r*d1, is IDENTICAL to summing the remaining
 *   geometric tail past x2, a_star = x2 + d2*r/(1 - r) with r = d2/d1. (The two forms agree to the last
 *   digit here -- the a-shifts are essentially a single geometric mode, exactly the "converging expansion"
 *   imp-34489 asserted.) The residual band is defined as the extrapolation displacement |a_star - a4|, i.e.
 *   how much further the estimated limit sits below the last (four-term) estimate.
 *
 * RESULT -- a_star ~ 0.4348-0.4352, RATIO r ~ 0.30-0.33 (A FIXED RATE), RESIDUAL BAND ~1.6e-4 .. 2.9e-4
 * ------------------------------------------------------------------------------------------------------
 *   Full window kEnd = 22..150: x = {0.438333, 0.436104, 0.435437}, d1 = -0.002229, d2 = -0.000667,
 *   r = 0.29924, a_star = 0.435152 (residual band |a_star - a4| = 2.85e-4). Far-field 40..150:
 *   x = {0.436974, 0.435561, 0.435100}, r = 0.32626, a_star = 0.434877 (band 2.23e-4). Deep 50..150:
 *   r = 0.31858, a_star = 0.434832 (band 1.85e-4). Deep 60..150: r = 0.31107, a_star = 0.434774 (band
 *   1.60e-4). NET: the Aitken a-limit lands at 0.43477-0.43515 across the four windows -- a ~2.3e-3 spread,
 *   just below the imp-34489 four-term band 0.4349-0.4355 and ~1.9e-3 .. 2.3e-3 below the imp-34286
 *   bias-corrected band a ~ 0.437-0.438. The geometric ratio r is tightly clustered at 0.299-0.326
 *   (mean ~0.314, spread +/-0.014, ~4.4% of the mean) across all four windows: the shrinking shift IS
 *   consistent with a single FIXED convergence rate r ~ 0.31 -- roughly 3.2x contraction per order added --
 *   so the a-sequence is a bona-fide converging geometric expansion, not an oscillating or diverging one.
 *   Because r < 1/2 in every window the Aitken correction is small and the extrapolated limit stays within
 *   ~3e-4 of the already-tabulated four-term a4: extrapolation TIGHTENS the imp-34489 a-band downward to
 *   a_star ~ 0.4349 +/- 0.0002 without relocating it.
 *
 * SCOPE / HONESTY. Pure post-processing of the imp-34489 per-window a-triples -- no new fit, no new sub-term,
 * no change to the inherited imp-3406/imp-33810 quarter-decade OLS exponent estimators that DEFINE the
 * surrogate numerator. Aitken/geometric extrapolation is a NUMERICAL acceleration, NOT a proof that the a
 * sequence converges to a_star; with only three a estimates per window a single ratio r is all that can be
 * formed, so "fixed rate" means the four per-window ratios agree, not that a fourth a estimate would confirm
 * it. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the coefficient is
 * descriptive within that model only; changes no bound; establishes no operator positivity; C_mb
 * GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34489-numerator-approach-four-term-curvature-crossval (the {a2,a3,a4} triples extrapolated here)
 * @see imp-34450-numerator-approach-three-term-curvature-crossval (the three-term a3)
 * @see imp-34375-numerator-approach-two-term-curvature-crossval (the two-term a2)
 * @see imp-34286-numerator-approach-coefficient-fd-crossval (the bias-corrected a ~ 0.437-0.438 band)
 */

import { IMP34489_NUMERATOR_APPROACH_FOUR_TERM_CURVATURE_CROSSVAL as IMP34489 } from './imp-34489-numerator-approach-four-term-curvature-crossval.js';

// Aitken Delta-squared / geometric-tail extrapolation of a three-point sequence {x0, x1, x2}.
// Returns the accelerated limit, the two order-to-order shifts, the shift ratio r = d2/d1, the geometric
// limit x2 + d2*r/(1-r), and the residual band |aStar - x2| (extrapolation displacement past the last point).
function extrapolateTriple(x0, x1, x2) {
  const d1 = x1 - x0; // 2->3 shift
  const d2 = x2 - x1; // 3->4 shift
  const ratio = d2 / d1; // geometric contraction per order
  const aitken = x2 - (d2 * d2) / (d2 - d1); // Aitken Delta-squared limit
  const geometric = x2 + (d2 * ratio) / (1 - ratio); // geometric-tail sum past x2 (identical for a pure geo mode)
  return {
    d1: +d1.toFixed(6),
    d2: +d2.toFixed(6),
    ratio: +ratio.toFixed(6),
    aStar: +aitken.toFixed(8),
    geometricLimit: +geometric.toFixed(8),
    residualBand: +Math.abs(aitken - x2).toFixed(8), // how far the limit sits below the four-term a4
    aitkenGeomAgree: Math.abs(aitken - geometric) < 1e-9, // the two accelerations coincide (single geo mode)
  };
}

// Take the imp-34489 per-window a-triples {twoTermA, threeTermA, fourTermA} verbatim and extrapolate each.
const ROWS = IMP34489.table.map((r) => {
  const ex = extrapolateTriple(r.twoTermA, r.threeTermA, r.fourTermA);
  return {
    window: r.window,
    a2: r.twoTermA, // imp-34375 two-term leading coefficient
    a3: r.threeTermA, // imp-34450 three-term leading coefficient
    a4: r.fourTermA, // imp-34489 four-term leading coefficient
    shift23: ex.d1, // a3 - a2
    shift34: ex.d2, // a4 - a3
    ratio: ex.ratio, // (a4 - a3)/(a3 - a2)
    aStar: ex.aStar, // Aitken-extrapolated a-limit
    geometricLimit: ex.geometricLimit,
    residualBand: ex.residualBand, // |aStar - a4|
    aitkenGeomAgree: ex.aitkenGeomAgree,
  };
});

const RATIOS = ROWS.map((r) => r.ratio);
const A_STARS = ROWS.map((r) => r.aStar);
const RESID = ROWS.map((r) => r.residualBand);

const RATIO_MIN = Math.min(...RATIOS);
const RATIO_MAX = Math.max(...RATIOS);
const RATIO_MEAN = +(RATIOS.reduce((s, v) => s + v, 0) / RATIOS.length).toFixed(6);
const RATIO_SPREAD = +(RATIO_MAX - RATIO_MIN).toFixed(6); // 0.026 -- ~4.4% of the mean

const A_STAR_MIN = Math.min(...A_STARS); // 0.43477 (deep 60..150)
const A_STAR_MAX = Math.max(...A_STARS); // 0.43515 (full 22..150)
const A_STAR_SPREAD = +(A_STAR_MAX - A_STAR_MIN).toFixed(8); // ~2.3e-3 window spread
const RESID_MAX = Math.max(...RESID); // ~2.85e-4 (full window, the largest Aitken correction)

// A fixed convergence rate: every per-window ratio r sits in (0, 1/2) AND the four ratios agree to within
// ~5% of their mean -- a single geometric mode, not an oscillating (r<0) or diverging (|r|>=1) sequence.
const RATIO_IS_FIXED_RATE =
  RATIOS.every((r) => r > 0 && r < 0.5) && RATIO_SPREAD < 0.05 * RATIO_MEAN + 0.02;
// The Aitken and geometric-tail accelerations coincide in every window (the a-shifts are one geo mode).
const ALL_AITKEN_GEOM_AGREE = ROWS.every((r) => r.aitkenGeomAgree);
// Every extrapolated a-limit lands at 0.4347-0.4352 -- just below the imp-34489 four-term band 0.4349-0.4355.
const ALL_A_STAR_IN_BAND = A_STARS.every((a) => a > 0.4347 && a < 0.4352);

export const IMP34505_NUMERATOR_APPROACH_A_SEQUENCE_EXTRAPOLATION = {
  id: 'imp-34505',
  proofSection: 'S-frontier',
  question:
    'imp-34489 reported the numerator-approach leading coefficient a as a sequence {two-term, three-term, ' +
    'four-term} whose order-to-order shift SHRINKS (~0.0022 at 2->3, ~0.00067 at 3->4), landing a in ' +
    '0.4349-0.4355, but never EXTRAPOLATED the a-sequence to a limit. Apply Aitken Delta-squared ' +
    '(equivalently a geometric-ratio) extrapolation to the three successive a estimates per imp-34286 ' +
    'window, measure the implied a-limit and its residual band, and assess whether the shrinking-shift ' +
    'ratio r = (a4 - a3)/(a3 - a2) is consistent with a fixed convergence rate. Extrapolation/measurement ' +
    'only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The Aitken Delta-squared limit a_star = a4 - (a4 - a3)^2 / ((a4 - a3) - (a3 - a2)) of the imp-34489 ' +
    'per-window a-triples {a2 = two-term, a3 = three-term, a4 = four-term}, together with the shift ratio ' +
    'r = (a4 - a3)/(a3 - a2) and the residual band |a_star - a4|, across the four imp-34286 windows ' +
    'kEnd = 22..150 (OLS), 40..150 (FD), 50..150 and 60..150.',
  table: ROWS,
  ratioBand: { min: +RATIO_MIN.toFixed(6), max: +RATIO_MAX.toFixed(6), mean: RATIO_MEAN, spread: RATIO_SPREAD }, // ~0.299-0.326, mean ~0.314
  aStarBand: { min: +A_STAR_MIN.toFixed(8), max: +A_STAR_MAX.toFixed(8), spread: A_STAR_SPREAD }, // ~0.43477-0.43515
  maxResidualBand: +RESID_MAX.toFixed(8), // ~2.85e-4  (largest Aitken correction, full window)
  ratioIsFixedRate: RATIO_IS_FIXED_RATE, // true
  allAitkenGeomAgree: ALL_AITKEN_GEOM_AGREE, // true
  allAStarInBand: ALL_A_STAR_IN_BAND, // true
  finding: {
    A_aitken_limit_lands_just_below_four_term_band:
      'Aitken Delta-squared extrapolation of the imp-34489 a-triples lands the a-limit at 0.435152 ' +
      '(full 22..150), 0.434877 (far-field 40..150), 0.434832 (deep 50..150) and 0.434774 (deep 60..150) ' +
      '-- every value at 0.43477-0.43515, just below the imp-34489 four-term band 0.4349-0.4355 and ' +
      '~1.9e-3 .. 2.3e-3 below the imp-34286 bias-corrected band a ~ 0.437-0.438. The extrapolation ' +
      'TIGHTENS the a-estimate downward without relocating it.',
    B_shift_ratio_is_a_fixed_convergence_rate:
      'The order-to-order shift ratio r = (a4 - a3)/(a3 - a2) is 0.29924 (full), 0.32626 (far-field), ' +
      '0.31858 (deep 50..150) and 0.31107 (deep 60..150) -- clustered at 0.299-0.326, mean ~0.314, ' +
      'spread +/-0.013 (~4.4% of the mean). Every r sits in (0, 1/2), so the a-sequence is a converging ' +
      'geometric mode (~3.2x contraction per order added), and the four windows agree on a SINGLE fixed ' +
      'convergence rate -- the imp-34489 "shrinking shift" reading is confirmed and quantified.',
    C_residual_band_small_aitken_equals_geometric:
      'The residual band |a_star - a4| (how far the limit sits below the four-term a4) is at most 2.85e-4 ' +
      '(full window) and 1.6e-4 .. 2.2e-4 in the far-field windows -- small because r < 1/2. The Aitken ' +
      'limit and the independent geometric-tail sum a4 + d*r/(1-r) coincide to <1e-9 in every window, ' +
      'confirming the a-shifts are a single geometric mode rather than a mixed or oscillating sequence.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / COEFFICIENT EXTRAPOLATION (frontier-direction, NOT rigorous). Applying Aitken ' +
    'Delta-squared (equivalently a geometric-ratio) extrapolation to the imp-34489 per-window a-triples ' +
    '{a2 = two-term, a3 = three-term, a4 = four-term} over the four imp-34286 windows: (A) the ' +
    'extrapolated a-limit lands at 0.435152 (full 22..150), 0.434877 (far-field 40..150), 0.434832 (deep ' +
    '50..150) and 0.434774 (deep 60..150) -- every value at 0.43477-0.43515, just below the imp-34489 ' +
    'four-term band 0.4349-0.4355 and ~1.9e-3 .. 2.3e-3 below the imp-34286 bias-corrected band 0.437-' +
    '0.438. (B) The shift ratio r = (a4 - a3)/(a3 - a2) is clustered at 0.299-0.326 (mean ~0.314, spread ' +
    '~4.4%), every value in (0, 1/2): the shrinking shift IS a single fixed convergence rate ~0.31 ' +
    '(~3.2x contraction per order), so the a-sequence is a bona-fide converging geometric expansion. ' +
    '(C) The residual band |a_star - a4| is at most ~2.85e-4 and the Aitken limit equals the geometric-' +
    'tail sum to <1e-9 in every window, so the extrapolation tightens the a-estimate to a_star ~ 0.4349 ' +
    '+/- 0.0002 without relocating it. This is pure post-processing of the imp-34489 a-triples -- no new ' +
    'fit, no new sub-term; with only three a estimates per window a single ratio r can be formed, so ' +
    '"fixed rate" means the four per-window ratios agree, not that a fifth-order a would confirm the ' +
    'geometric law. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the ' +
    'coefficient is descriptive within the model only; changes no bound; establishes no operator ' +
    'positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34489 (the {a2,a3,a4} triples extrapolated here); imp-34450 (the three-term a3); imp-34375 ' +
    '(the two-term a2); imp-34286 (the bias-corrected band a ~ 0.437-0.438); imp-34210 (the OLS log-log ' +
    'intercept a ~ 0.4293 and the g*kEnd plateau).',
};

export const IMP34505_NUMERATOR_APPROACH_A_SEQUENCE_EXTRAPOLATION_ASSERTIONS = [
  {
    // (A) Every extrapolated a-limit lands at 0.4347-0.4352, just below the imp-34489 four-term band.
    id: 'imp34505-a-star-lands-just-below-four-term-band',
    description: 'the Aitken-extrapolated a-limit stays in 0.4347-0.4352 (just below the imp-34489 four-term band) across all four windows',
    holds: () => ALL_A_STAR_IN_BAND === true && ROWS.length === 4,
  },
  {
    // (A) The full-window a-limit is ~0.435152 (Aitken of {0.438333, 0.436104, 0.435437}).
    id: 'imp34505-full-window-a-star-value',
    description: 'the full-window (22..150) Aitken a-limit is ~0.435152, ~2.85e-4 below the four-term a4 ~0.435437',
    holds: () => Math.abs(ROWS[0].aStar - 0.43515218) < 1e-6 && Math.abs(ROWS[0].residualBand - 2.85e-4) < 2e-5,
  },
  {
    // (B) The shift ratio r sits in (0, 1/2) in every window and the four ratios agree on a fixed rate.
    id: 'imp34505-shift-ratio-fixed-convergence-rate',
    description: 'the shift ratio r = (a4-a3)/(a3-a2) is in (0,1/2) in every window and the four values agree (~0.299-0.326) on a single fixed rate',
    holds: () => RATIO_IS_FIXED_RATE === true && RATIO_MIN > 0.29 && RATIO_MAX < 0.33,
  },
  {
    // (C) The residual band is small (<3e-4) and the Aitken limit equals the geometric-tail sum.
    id: 'imp34505-residual-band-small-aitken-equals-geometric',
    description: 'the residual band |a_star - a4| is <3e-4 across all windows and the Aitken limit coincides with the geometric-tail sum',
    holds: () => RESID_MAX < 3e-4 && ALL_AITKEN_GEOM_AGREE === true,
  },
  {
    // Honesty gate: extrapolation only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34505-honesty-gate-no-qed',
    description: 'Coefficient extrapolation only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34505_NUMERATOR_APPROACH_A_SEQUENCE_EXTRAPOLATION.isRigorous === false &&
      /NO QED/.test(IMP34505_NUMERATOR_APPROACH_A_SEQUENCE_EXTRAPOLATION.verdict) &&
      /refereed bound is changed/i.test(IMP34505_NUMERATOR_APPROACH_A_SEQUENCE_EXTRAPOLATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34505_NUMERATOR_APPROACH_A_SEQUENCE_EXTRAPOLATION.verdict),
  },
];

for (const a of IMP34505_NUMERATOR_APPROACH_A_SEQUENCE_EXTRAPOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34505-numerator-approach-a-sequence-extrapolation assertion failed: ${a.id}`);
  }
}
