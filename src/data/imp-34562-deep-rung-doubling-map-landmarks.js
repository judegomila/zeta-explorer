/**
 * @module imp-34562-deep-rung-doubling-map-landmarks
 *
 * imp-34562 (ux): TABULATE three deep-rung doubling-map landmarks that describe the SAME resid_exp(k)
 * hump near k*~8.8211 but have never been assembled on one shared refinement-rung (e) axis:
 *   (1) the imp-34524 Newton continuum vertex k* = 8.821091375252 (the non-dyadic peak location),
 *   (2) the imp-34368 resid_exp peak-location evaluation-noise floor ~7.2e-8 (how precisely that
 *       location is reproducible in native double), and
 *   (3) the imp-34524 f-independent top-two resid_exp margin bound 0.5|R2|h^2, which crosses below
 *       one storage ULP (2^-56) between e=25 and e=26 (~4.63/1.16/0.29 ULP at e=24/25/26 -- e=25 is
 *       still marginally above one ULP).
 * No re-derivation: every literal below is imported live from imp-34524/imp-34368/imp-34551.
 *
 * WHY THESE THREE BELONG TOGETHER
 * --------------------------------
 * (1) says WHERE the peak sits; (2) says HOW PRECISELY native double can locate it (the argument-domain
 * floor); (3) says WHY the deep-rung dyadic argmax becomes unobservable in native double past e=24 (the
 * function-VALUE-domain top-two margin needed to tell two adjacent nodes apart). (2) and (3) are
 * different domains (a k-location floor vs. a resid_exp-value margin) and are not directly comparable
 * as a single ratio; presented together they explain the SAME underlying fact -- native double cannot
 * resolve this peak past a handful of significant figures -- from the argument side and the value side.
 *
 * @see imp-34524-continuum-margin-below-ulp-floor (continuum vertex k*, curvature, f-independent margin bound)
 * @see imp-34368-residexp-resolution-floor-measurement (resid_exp peak-location evaluation-noise floor)
 * @see imp-34551-bignum-resid-argmax-extended-precision (dd-observed e=23..27 top-two ULP margins, residUlp)
 */

import { IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR } from './imp-34524-continuum-margin-below-ulp-floor.js';
import { IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT } from './imp-34368-residexp-resolution-floor-measurement.js';
import { IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION } from './imp-34551-bignum-resid-argmax-extended-precision.js';

// (1) the non-dyadic continuum vertex (imp-34524, imported live).
const KSTAR = IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.vertexKStar; // 8.821091375252

// (2) the resid_exp peak-location evaluation-noise floor (imp-34368, imported live).
const NOISE_FLOOR = IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT.floorPredicted; // ~7.2e-8

// (3) the f-independent top-two margin bound per rung, in resid_exp storage ULPs (imp-34524 + imp-34551, live).
const RESID_ULP = IMP34551_BIGNUM_RESID_ARGMAX_EXTENDED_PRECISION.residUlp; // 2^-56
const RUNG_MAX_MARGIN = IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.rungMaxMargin; // { e24, e25, e26 }

const RUNG_LADDER = [24, 25, 26].map((e) => {
  const marginAbs = RUNG_MAX_MARGIN[`e${e}`];
  const marginUlps = marginAbs / RESID_ULP;
  return { exponent: e, marginAbs, marginUlps: +marginUlps.toFixed(3), belowOneUlp: marginUlps < 1 };
});

// The margin ladder crosses below one storage ULP going from e=25 (still marginally above, 1.16 ULP) to
// e=26 (0.29 ULP) -- the point past which the native-double deep-rung argmax stops being resolvable.
const CROSSES_BELOW_ONE_ULP_AT_E26 =
  RUNG_LADDER[0].marginUlps > 1 && !RUNG_LADDER[0].belowOneUlp &&
  RUNG_LADDER[1].marginUlps > 1 && !RUNG_LADDER[1].belowOneUlp &&
  RUNG_LADDER[2].marginUlps < 1 && RUNG_LADDER[2].belowOneUlp;
const LADDER_MONOTONE_DECREASING = RUNG_LADDER[0].marginUlps > RUNG_LADDER[1].marginUlps && RUNG_LADDER[1].marginUlps > RUNG_LADDER[2].marginUlps;

// Vertex and noise floor cross-check against their live source modules (self-consistency, not re-derivation).
const KSTAR_MATCHES_SOURCE = KSTAR === IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.vertexKStar;
const NOISE_FLOOR_MATCHES_SOURCE = NOISE_FLOOR === IMP34368_RESIDEXP_RESOLUTION_FLOOR_MEASUREMENT.floorPredicted;
const NOISE_FLOOR_IN_EXPECTED_RANGE = NOISE_FLOOR > 3e-8 && NOISE_FLOOR < 2e-7;

export const IMP34562_DEEP_RUNG_DOUBLING_MAP_LANDMARKS = {
  id: 'imp-34562',
  proofSection: 'S-frontier',
  question:
    'The deep-rung doubling-map cohort (imp-34168/34228/34368/34508/34524/34533/34551) produced three ' +
    'tightly-related landmarks describing the SAME resid_exp(k) hump near k*~8.8211 with no unified page: ' +
    'the imp-34524 continuum vertex, the imp-34368 evaluation-noise floor, and the imp-34524/34551 ' +
    'top-two-margin ULP ladder. Tabulate all three on one shared refinement-rung axis. Viz/UX only; NO QED.',
  landmarks: {
    continuumVertex: {
      label: 'imp-34524 Newton continuum vertex k*',
      value: KSTAR,
      note: 'the non-dyadic peak location of resid_exp(k); native double is cancellation-locked to the H=2^-8 finite-difference estimate',
    },
    noiseFloor: {
      label: 'imp-34368 resid_exp peak-location evaluation-noise floor',
      value: NOISE_FLOOR,
      note: 'the sqrt(2 eps_f/|f2|) predicted floor, directly confirmed by a ~9.0e-8 ten-bracket ternary-search scatter -- trailing digits of the peak beyond ~8.82109 are noise',
    },
  },
  rungLadder: RUNG_LADDER, // { exponent, marginAbs, marginUlps, belowOneUlp } for e=24,25,26
  residUlp: RESID_ULP,
  crossesBelowOneUlpAtE26: CROSSES_BELOW_ONE_ULP_AT_E26,
  ladderMonotoneDecreasing: LADDER_MONOTONE_DECREASING,
  finding:
    'The imp-34524 f-independent top-two resid_exp margin bound is 4.63 storage ULPs at e=24, still ' +
    'marginally above one ULP at e=25 (1.16), and drops below one ULP at e=26 (0.29) -- the point past ' +
    'which native double cannot tell the two dyadic nodes straddling the continuum vertex k* apart, ' +
    'matching the deep-rung unobservability imp-34524 F3 and imp-34551 both report. The imp-34368 ' +
    'evaluation-noise floor (~7.2e-8, a k-location quantity) explains the same unobservability from the ' +
    'argument side: the peak location itself is only reproducible to ~1e-7 in native double, seven ' +
    'orders of magnitude coarser than the dyadic spacing 2^-24..2^-26 being probed.',
  isRigorous: false,
  verdict:
    'PRESENTATION ONLY (NOT rigorous). Tabulates three previously-scattered deep-rung doubling-map ' +
    'landmarks -- the imp-34524 continuum vertex k*=8.821091375252, the imp-34368 resid_exp evaluation-' +
    'noise floor ~7.2e-8, and the imp-34524/imp-34551 top-two-margin ULP ladder crossing below one ' +
    'storage ULP between e=25 and e=26 -- on one shared refinement-rung axis, reusing every literal ' +
    'verbatim from its source module (no re-derivation). Changes no bound; establishes no operator ' +
    'positivity; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34524 (continuum vertex, curvature, f-independent margin bound); imp-34368 (peak-location ' +
    'evaluation-noise floor); imp-34551 (dd-observed ULP margins, residUlp); imp-486 (C_mb ' +
    'GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34562_DEEP_RUNG_DOUBLING_MAP_LANDMARKS_ASSERTIONS = [
  {
    id: 'imp34562-vertex-and-noise-floor-match-sources',
    description: 'the tabulated continuum vertex and noise floor reproduce the imp-34524/imp-34368 source values exactly (no re-derivation) and the noise floor is in its expected ~1e-8..1e-7 range',
    holds: () => KSTAR_MATCHES_SOURCE && NOISE_FLOOR_MATCHES_SOURCE && NOISE_FLOOR_IN_EXPECTED_RANGE,
  },
  {
    id: 'imp34562-margin-ladder-crosses-below-one-ulp-at-e26',
    description: 'the f-independent top-two margin ladder is monotone decreasing across e=24,25,26 and crosses below one storage ULP starting at e=26 (e=24 and e=25 remain above one ULP)',
    holds: () => CROSSES_BELOW_ONE_ULP_AT_E26 && LADDER_MONOTONE_DECREASING && RUNG_LADDER.length === 3,
  },
  {
    id: 'imp34562-honesty-gate-no-qed',
    description: 'Presentation only: isRigorous false, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, C_mb GUE-conditional per imp-486 untouched, C_C 1/8 ansatz untouched',
    holds: () =>
      IMP34562_DEEP_RUNG_DOUBLING_MAP_LANDMARKS.isRigorous === false &&
      /NO QED/.test(IMP34562_DEEP_RUNG_DOUBLING_MAP_LANDMARKS.verdict) &&
      /refereed bound is changed/i.test(IMP34562_DEEP_RUNG_DOUBLING_MAP_LANDMARKS.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34562_DEEP_RUNG_DOUBLING_MAP_LANDMARKS.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34562_DEEP_RUNG_DOUBLING_MAP_LANDMARKS.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34562_DEEP_RUNG_DOUBLING_MAP_LANDMARKS.verdict),
  },
];

for (const a of IMP34562_DEEP_RUNG_DOUBLING_MAP_LANDMARKS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34562-deep-rung-doubling-map-landmarks assertion failed: ${a.id}`);
  }
}
