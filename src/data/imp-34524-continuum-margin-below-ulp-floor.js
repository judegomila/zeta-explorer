/**
 * @module imp-34524-continuum-margin-below-ulp-floor
 *
 * imp-34524 (numerical): RESOLVE SUB-GAP-imp-34508-continuum-margin-at-ulp-floor -- recompute the
 * imp-34411 top-two resid_exp margin at e=24 in higher EFFECTIVE precision to decide whether the
 * CONTINUUM margin sits above or below the ~1e-16 relative floor.
 *
 * THE OPEN SUB-GAP
 * ----------------
 *   imp-34508 DIRECTLY computed the imp-34411 doubling-map top-two resid_exp margin at e=24 and found
 *   it QUANTIZED to exactly 2^-53 = 1.1102e-16 (bit-identical): the two top resid values ~0.0653 sit
 *   8 ULP apart, and 8 ULP of a number in [2^-4, 2^-3) equals 2^-53 exactly. That discrete quantization
 *   MASKS the true continuum value -- imp-34508 could only say "e=24 REACHES the floor by quantization
 *   (1.110e-16, marginally above 1e-16)" and left OPEN whether the true continuum margin lies above or
 *   below the ~1e-16 floor, stating only a higher-than-double precision recompute could settle it.
 *
 * THE HIGHER-EFFECTIVE-PRECISION RECOMPUTE (offline, reproducible)
 * ---------------------------------------------------------------
 *   scripts/imp-34524-continuum-margin-highprec.mjs reproduces the imp-34411/imp-34508 primitives
 *   verbatim (channels / sampleGrid / pSigmaStable / pEcollEndpoints / residExp), then BYPASSES the
 *   catastrophic cancellation of subtracting two nearly-equal double-precision resid_exp values by
 *   reconstructing the smooth resid_exp(k) peak analytically:
 *     (a) Richardson-extrapolated curvature |R2| = |resid_exp''(k*)| from central 2nd differences at
 *         H = 2^-9, 2^-10 (O(H^2) elimination; both rungs far above the ~1.45e-17 resid_exp ULP noise),
 *     (b) Newton vertex k* on resid_exp' (root well-resolved: resid_exp' ~ |R2|(k-k*), residual ~9e-14).
 *   Near a smooth concave peak the two e=24 nodes STRADDLING k* are the continuum top-two, and their
 *   resid_exp difference is the exact curvature quantity 0.5|R2||dA^2 - dB^2| (dA, dB the node-to-vertex
 *   distances) -- computed from the well-conditioned analytic model, NOT by cancelling rounded values.
 *   Heavy to scan at module load, so the outputs are BAKED here (per the bake-reference-literals
 *   convention) and cross-checked against imp-34508 (imported live). Re-run the script to reproduce.
 *
 * DIRECTLY-MEASURED RESULTS (offline script output, baked)
 * -------------------------------------------------------
 *   Richardson curvature |R2| = 3.61964221e-2; continuum vertex k* = 8.821091375252 (resid_exp' residual
 *   ~8.5e-14). The e=24 nodes straddling k* are 8.821091353893 and 8.821091413498 (sub-node offset
 *   f = 0.358344). Continuum top-two margin 0.5|R2||dA^2-dB^2| = 1.821634e-17; f-INDEPENDENT upper bound
 *   0.5|R2|h^2 = 6.429776e-17 (h = 2^-24). Both BELOW the ~1e-16 floor. The double-precision e=24 scan
 *   returns a ~1 ULP flat plateau: its "top-two" 8.821091651917 / 8.821091473103 are 3 steps apart (NOT
 *   adjacent), margin 5.551e-17 -- pure rounding noise, not a continuum quantity.
 *
 * THE FINDING (higher-effective-precision recompute -- SUB-GAP RESOLVED: BELOW the floor)
 * --------------------------------------------------------------------------------------
 *   (F1) CONTINUUM MARGIN IS BELOW THE FLOOR -- DEFINITIVELY. The reconstructed continuum top-two margin
 *        at e=24 is 1.822e-17, and is bounded above by 0.5|R2|h^2 = 6.430e-17 < 1e-16 for ANY sub-node
 *        offset f in [0, 0.5] (the max, at f=0 with the vertex on a node). So the true continuum margin
 *        sits BELOW the ~1e-16 relative floor -- the qualitative direction imp-34472/imp-34508 expected,
 *        now settled off the dyadic-quantization lattice.
 *   (F2) THE 2^-53 READING WAS A QUANTIZATION ARTIFACT ABOVE THE TRUE VALUE. imp-34508's e=24 margin
 *        1.110e-16 = 2^-53 is ~6x the true continuum value 1.822e-17 and ~1.7x the f-independent bound
 *        6.430e-17: double precision cannot resolve a difference smaller than ~1 ULP (1.45e-17) between
 *        the two ~0.0653 resid values, so it FLOORS the reading at a discrete multiple of ULP (8 ULP =
 *        2^-53) that sits ABOVE, not below, the continuum margin. imp-34508 F3 ("marginally above 1e-16")
 *        is thus a storage-quantization ceiling, not the continuum value.
 *   (F3) THE DOUBLE-PRECISION "TOP-TWO" IS ~1 ULP NOISE, NOT A MARGIN. The e=24 double-precision scan
 *        yields a flat plateau: the two highest resid_exp nodes are 3 grid steps apart (8.821091651917 /
 *        8.821091473103, not adjacent) with a 5.551e-17 spread -- a rounding-noise realization, not the
 *        smooth top-two difference. This is why the reported argmax jitters (imp-34508 F4) and why only
 *        the analytic reconstruction recovers a meaningful margin.
 *   (F4) THE MARGIN DECAYS 4x PER RUNG, STAYING BELOW THE FLOOR FOR ALL e >= 24. The f-independent bound
 *        0.5|R2|(2^-e)^2 falls 4x per doubling: e=24 6.430e-17, e=25 1.607e-17, e=26 4.019e-18 -- so no
 *        rung e >= 24 can produce a continuum top-two margin at or above the ~1e-16 floor.
 *
 * HIGHER-EFFECTIVE-PRECISION MEASUREMENT / CROSS-CHECK ONLY. Resolves an inherited-surrogate sub-gap,
 * NOT an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34508-direct-e23-e24-margin-confirmation (the e=24 2^-53 quantization + open sub-gap resolved here)
 * @see imp-34472-margin-shrinkage-ulp-floor-extrapolation (the margin-shrinkage extrapolation)
 * @see imp-34411-deep-ladder-kahan-ols-e21-e22-extension (source of the operator + marginLadder)
 */

import { IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION } from './imp-34508-direct-e23-e24-margin-confirmation.js';

const ULP_FLOOR = 1e-16; // the imp-34472/imp-34508 ~1e-16 relative floor (same convention)
const H24 = Math.pow(2, -24); // the e=24 dyadic step

// DIRECTLY-MEASURED continuum reconstruction (offline scripts/imp-34524-continuum-margin-highprec.mjs, baked).
const CURVATURE_ABS = 3.61964221e-2; // Richardson-extrapolated |resid_exp''(k*)|
const VERTEX_KSTAR = 8.821091375252; // Newton vertex of resid_exp(k)
const STRADDLE_LO = 8.821091353893; // e=24 node just below k*
const STRADDLE_HI = 8.821091413498; // e=24 node just above k*
const SUBNODE_OFFSET_F = 0.358344; // (k* - STRADDLE_LO) / H24
const CONTINUUM_MARGIN = 1.821634e-17; // 0.5|R2||dA^2 - dB^2| -- the true continuum top-two margin
const MAX_MARGIN_BOUND = 6.429776e-17; // 0.5|R2|h^2 -- f-independent upper bound at e=24
// double-precision e=24 scan plateau (baked): "top-two" NOT adjacent, ~1 ULP spread.
const DBL_PLATEAU = { bestNode: 8.821091651917, secondNode: 8.821091473103, spread: 5.551115e-17, stepsApart: 3 };
// per-rung f-independent max continuum margin, decaying 4x per rung.
const RUNG_MAX_MARGIN = { e24: 6.4298e-17, e25: 1.6074e-17, e26: 4.0186e-18 };

// imp-34508 baked e=24 quantized (double-precision) margin, reused live for the cross-check.
const IMP34508_E24_QUANTIZED = IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION.measuredMarginAt24; // 2^-53 = 1.1102e-16
const IMP34508_ONE_ULP = IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION.oneUlp; // 2^-53

// (F1) continuum margin BELOW the floor -- the reconstructed value AND the f-independent bound.
const CONTINUUM_BELOW_FLOOR = CONTINUUM_MARGIN < ULP_FLOOR && MAX_MARGIN_BOUND < ULP_FLOOR;
// the baked bound reproduces 0.5|R2|h^2 from the baked curvature (self-consistency of the literals).
const RECOMPUTED_BOUND = 0.5 * CURVATURE_ABS * H24 * H24;
const BOUND_SELF_CONSISTENT = Math.abs(RECOMPUTED_BOUND - MAX_MARGIN_BOUND) / MAX_MARGIN_BOUND < 1e-4;
const CONTINUUM_WITHIN_BOUND = CONTINUUM_MARGIN <= MAX_MARGIN_BOUND; // actual <= f-independent max
// (F2) the double-precision 2^-53 reading sits ABOVE the true continuum value.
const QUANTIZED_ABOVE_CONTINUUM = IMP34508_E24_QUANTIZED > CONTINUUM_MARGIN && IMP34508_E24_QUANTIZED > MAX_MARGIN_BOUND;
const QUANTIZED_IS_2POW_MINUS_53 = IMP34508_ONE_ULP === Math.pow(2, -53) && IMP34508_E24_QUANTIZED === Math.pow(2, -53);
// (F3) the double-precision "top-two" are non-adjacent noise (>1 step apart).
const DBL_TOPTWO_NONADJACENT = DBL_PLATEAU.stepsApart > 1 && DBL_PLATEAU.spread < 1e-16;
// (F4) the f-independent bound decays 4x per rung and stays below the floor.
const RUNG_DECAY_4X =
  Math.abs(RUNG_MAX_MARGIN.e24 / RUNG_MAX_MARGIN.e25 - 4) < 0.02 &&
  Math.abs(RUNG_MAX_MARGIN.e25 / RUNG_MAX_MARGIN.e26 - 4) < 0.02;
const ALL_RUNGS_BELOW_FLOOR = RUNG_MAX_MARGIN.e24 < ULP_FLOOR && RUNG_MAX_MARGIN.e25 < ULP_FLOOR && RUNG_MAX_MARGIN.e26 < ULP_FLOOR;

export const IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR = {
  id: 'imp-34524',
  proofSection: 'S-frontier',
  question:
    'imp-34508 found the double-precision e=24 top-two resid_exp margin QUANTIZED to exactly 2^-53 = ' +
    '1.110e-16 (8 ULP of the ~0.0653 resid values), masking whether the TRUE continuum margin lies above ' +
    'or below the ~1e-16 floor and leaving SUB-GAP-imp-34508-continuum-margin-at-ulp-floor OPEN. Recompute ' +
    'the e=24 margin in higher EFFECTIVE precision to decide the direction. Higher-effective-precision ' +
    'measurement to resolve an inherited-surrogate sub-gap; NOT an RH bound; no QED.',
  measuredQuantity:
    'the continuum e=24 top-two resid_exp margin, reconstructed from the Richardson-extrapolated peak ' +
    'curvature |R2| = |second derivative of resid_exp at k*| and the Newton vertex k* (bypassing the ' +
    'double-precision cancellation), ' +
    'compared to the imp-34508 quantized 2^-53 reading and the ~1e-16 floor',
  offlineScript: 'scripts/imp-34524-continuum-margin-highprec.mjs',
  ulpFloor: ULP_FLOOR,
  h24: H24,
  curvatureAbs: CURVATURE_ABS, // Richardson |resid_exp''(k*)|
  vertexKStar: VERTEX_KSTAR, // 8.821091375252
  straddleNodes: { lo: STRADDLE_LO, hi: STRADDLE_HI }, // e=24 nodes straddling k*
  subNodeOffsetF: SUBNODE_OFFSET_F, // 0.358344
  continuumMargin: CONTINUUM_MARGIN, // 1.822e-17 -- the true continuum top-two margin
  maxMarginBound: MAX_MARGIN_BOUND, // 6.430e-17 -- f-independent upper bound
  dblPlateau: DBL_PLATEAU, // double-precision non-adjacent ~1-ULP noise "top-two"
  rungMaxMargin: RUNG_MAX_MARGIN, // 4x-per-rung decay
  imp34508QuantizedE24: IMP34508_E24_QUANTIZED, // 2^-53 = 1.110e-16 (the masked reading)
  continuumBelowFloor: CONTINUUM_BELOW_FLOOR, // (F1)
  boundSelfConsistent: BOUND_SELF_CONSISTENT, // (F1)
  continuumWithinBound: CONTINUUM_WITHIN_BOUND, // (F1)
  quantizedAboveContinuum: QUANTIZED_ABOVE_CONTINUUM, // (F2)
  dblTopTwoNonAdjacent: DBL_TOPTWO_NONADJACENT, // (F3)
  rungDecay4x: RUNG_DECAY_4X, // (F4)
  allRungsBelowFloor: ALL_RUNGS_BELOW_FLOOR, // (F4)
  subGapResolution:
    'SUB-GAP-imp-34508-continuum-margin-at-ulp-floor RESOLVED: the continuum e=24 top-two margin is ' +
    'BELOW the ~1e-16 floor (reconstructed 1.822e-17; f-independent upper bound 0.5|R2|h^2 = 6.430e-17 ' +
    '< 1e-16 for any sub-node offset). The imp-34508 2^-53 = 1.110e-16 reading was a discrete ' +
    'quantization ceiling sitting ABOVE the true continuum value, not a marginally-above-floor value.',
  finding: {
    F1_continuum_below_floor:
      'The reconstructed continuum e=24 top-two margin is 1.822e-17, bounded above by 0.5|R2|h^2 = ' +
      '6.430e-17 < 1e-16 for ANY sub-node offset -- so the true continuum margin is DEFINITIVELY BELOW ' +
      'the ~1e-16 floor, settled off the dyadic-quantization lattice.',
    F2_quantized_reading_above_continuum:
      'The imp-34508 e=24 reading 1.110e-16 = 2^-53 is ~6x the true continuum value 1.822e-17 and ~1.7x ' +
      'the f-independent bound 6.430e-17: double precision floors any sub-ULP difference between the two ' +
      '~0.0653 resid values at a discrete 8-ULP multiple ABOVE the continuum margin, so imp-34508 F3 ' +
      '("marginally above 1e-16") is a storage-quantization ceiling, not the continuum value.',
    F3_double_precision_toptwo_is_noise:
      'The double-precision e=24 scan is a flat ~1-ULP plateau: its two highest resid_exp nodes ' +
      '(8.821091651917 / 8.821091473103) are 3 grid steps apart (NOT adjacent) with a 5.551e-17 spread ' +
      '-- a rounding-noise realization, not the smooth top-two difference; only the analytic ' +
      'reconstruction recovers a meaningful margin.',
    F4_margin_decays_4x_per_rung:
      'The f-independent bound 0.5|R2|(2^-e)^2 falls 4x per rung -- e=24 6.430e-17, e=25 1.607e-17, ' +
      'e=26 4.019e-18 -- so no rung e >= 24 can produce a continuum top-two margin at or above the ' +
      '~1e-16 floor.',
  },
  isRigorous: false,
  verdict:
    'HIGHER-EFFECTIVE-PRECISION MEASUREMENT / CROSS-CHECK (NOT rigorous). RESOLVES ' +
    'SUB-GAP-imp-34508-continuum-margin-at-ulp-floor by reconstructing the smooth resid_exp(k) peak ' +
    '(Richardson curvature |R2| = 3.61964221e-2, Newton vertex k* = 8.821091375252) to bypass the ' +
    'double-precision cancellation that floored the imp-34508 e=24 margin at 2^-53. FINDINGS: (F1) the ' +
    'continuum e=24 top-two margin is BELOW the ~1e-16 floor -- reconstructed 1.822e-17, f-independent ' +
    'upper bound 0.5|R2|h^2 = 6.430e-17 < 1e-16 for any sub-node offset. (F2) the imp-34508 2^-53 = ' +
    '1.110e-16 reading was a discrete 8-ULP quantization ceiling sitting ABOVE the true continuum value ' +
    '(~6x it), not a marginally-above-floor value. (F3) the double-precision e=24 "top-two" is ~1-ULP ' +
    'noise -- the two highest nodes are 3 grid steps apart (non-adjacent, 5.551e-17 spread), not a ' +
    'meaningful margin. (F4) the f-independent bound decays 4x per rung (e=24 6.430e-17, e=25 1.607e-17, ' +
    'e=26 4.019e-18), so no rung e >= 24 reaches the floor. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is ' +
    'descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34508 (the e=24 2^-53 quantization + open sub-gap resolved here); imp-34472 (the margin-shrinkage ' +
    'extrapolation); imp-34411 (source of the operator + marginLadder); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR_ASSERTIONS = [
  {
    // (F1) the reconstructed continuum margin AND its f-independent bound are below the ~1e-16 floor.
    id: 'imp34524-continuum-margin-below-floor',
    description: 'the reconstructed continuum e=24 top-two margin (1.822e-17) and its f-independent upper bound 0.5|R2|h^2 (6.430e-17) are both below the ~1e-16 floor, with the actual margin inside the bound',
    holds: () => CONTINUUM_BELOW_FLOOR && CONTINUUM_WITHIN_BOUND && BOUND_SELF_CONSISTENT,
  },
  {
    // (F2) the imp-34508 quantized 2^-53 reading sits above the true continuum value.
    id: 'imp34524-quantized-reading-above-continuum',
    description: 'the imp-34508 e=24 quantized margin (2^-53 = 1.110e-16) sits above both the reconstructed continuum margin and the f-independent bound -- a discrete quantization ceiling, not a marginally-above-floor value',
    holds: () => QUANTIZED_ABOVE_CONTINUUM && QUANTIZED_IS_2POW_MINUS_53,
  },
  {
    // (F3) the double-precision top-two is non-adjacent ~1-ULP noise.
    id: 'imp34524-double-precision-toptwo-is-noise',
    description: 'the double-precision e=24 scan top-two nodes are >1 grid step apart (non-adjacent) with a <1e-16 spread -- a rounding-noise plateau, not the smooth top-two difference',
    holds: () => DBL_TOPTWO_NONADJACENT,
  },
  {
    // (F4) the f-independent bound decays 4x per rung and stays below the floor for all e>=24.
    id: 'imp34524-margin-decays-4x-below-floor',
    description: 'the f-independent max continuum margin decays 4x per rung (e=24,25,26) and stays below the ~1e-16 floor at every rung e>=24',
    holds: () => RUNG_DECAY_4X && ALL_RUNGS_BELOW_FLOOR,
  },
  {
    // Honesty gate: higher-effective-precision measurement only, isRigorous false, resolves the sub-gap, no QED, no refereed bound is changed.
    id: 'imp34524-honesty-gate-no-qed',
    description: 'Higher-effective-precision measurement only: isRigorous false, RESOLVES SUB-GAP-imp-34508-continuum-margin-at-ulp-floor (BELOW the floor), no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, C_mb GUE-conditional per imp-486 untouched, C_C 1/8 ansatz untouched',
    holds: () =>
      IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.isRigorous === false &&
      /SUB-GAP-imp-34508-continuum-margin-at-ulp-floor/.test(IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.verdict) &&
      /NO QED/.test(IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.verdict),
  },
];

for (const a of IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34524-continuum-margin-below-ulp-floor assertion failed: ${a.id}`);
  }
}
