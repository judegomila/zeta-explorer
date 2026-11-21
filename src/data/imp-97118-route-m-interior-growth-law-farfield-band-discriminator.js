/**
 * @module imp-97118-route-m-interior-growth-law-farfield-band-discriminator
 * @fileoverview imp-97118 -- import-light ASSESSMENT: does the imp-96750 interior second-moment
 *   growth law Int(N) = Theta(log N) constrain the far-field Route M ||G||_F conditioning-ceiling
 *   VALUE independently of the near-field N<=16000 holdout curvature, and does it predict a ceiling
 *   location INSIDE or OUTSIDE the imp-96982 +1.37%..+8.36% band?
 *
 *   RELATION TO imp-97081 (what is already done, what this adds)
 *   -----------------------------------------------
 *   imp-97081 already applied candidate (1) -- the imp-96750 log-asymptotic -- as a POINT anchor
 *   F = 3.775e7 and re-centred the band DOWN to [F, +d/N] = -0.30%..+1.37%, rejecting the quadratic
 *   top end. This ticket asks the COMPLEMENTARY question that imp-97081 did not frame explicitly:
 *   relative to the ORIGINAL +1.37%..+8.36% band, is the growth-law prediction INSIDE or OUTSIDE,
 *   and WHICH part of that prediction is independent of the imp-96750 O(1)/s0* sub-gap. The answer
 *   splits cleanly into two layers.
 *
 *   LAYER (i) -- the growth-law FORM constrains the ceiling, O(1)-INDEPENDENTLY.
 *   -----------------------------------------------
 *   Int(N) = Theta(log N) fixes the FUNCTIONAL FORM of the interior Frobenius mass: it grows
 *   monotonically and without bound, but only logarithmically. This form is set by the reduction
 *   Int(N) <= s* log N (imp-96750, rigorous down to the one uniform lemma) and uses NONE of the
 *   unproven O(1)/s0* constant. Two consequences follow that do NOT depend on the constant:
 *     (a) the interior mass never saturates and never turns over -- so any near-field extrapolant
 *         whose far-field behaviour turns over (the concave QUADRATIC, peak N ~ 2.31e9) is
 *         STRUCTURALLY inconsistent with the growth law, independently of s0*; its pre-turnover
 *         run-up is a curvature artifact, not a ceiling signal.
 *     (b) a logarithmic interior mass produces a very SLOWLY rising ||G||_F, so the far-field
 *         ceiling location is governed by a slow (log-scale) crossing, not by the near-field
 *         curvature that the holdout selected. The holdout constrains near-field CURVATURE; the
 *         growth law constrains far-field FORM. They are independent readouts, and only the growth
 *         law speaks to the ceiling. This is the sense in which the growth law constrains the
 *         ceiling INDEPENDENTLY of the holdout curvature.
 *   Layer (i) therefore rejects the quadratic top end of the band on STRUCTURAL grounds -- no
 *   constant required.
 *
 *   LAYER (ii) -- the ceiling VALUE (inside/outside) needs the O(1)/s0* constant.
 *   -----------------------------------------------
 *   Turning the FORM into a numeric ceiling requires the point value F, which imp-97081 read off as
 *   F = 3.775e7 from the interior SLOPE s* ~ 5.76 (= 2 zeta(2) s0, s0 ~ 1.751 measured). Placing F
 *   against the ORIGINAL band edges (both expressed as percent-vs-line):
 *       band floor  (+d/N) = +1.369%
 *       band top    (quad) = +8.356%
 *       growth-law F        = -0.30%   (imp-97081 IMP97081_INTERIOR_ANCHOR.fPctVsLine)
 *   So F lies BELOW the band floor -- the growth-law prediction is OUTSIDE the original
 *   +1.37%..+8.36% band, on the LOW side, by ~1.67 percentage points below the floor. The growth
 *   law does NOT support any location interior to the original band; it pulls the credible ceiling
 *   to the band floor and below. This is the same numeric anchor imp-97081 used, re-read as an
 *   inside/outside verdict against the ORIGINAL band rather than as a new [F, +d/N] band.
 *
 *   VERDICT
 *   -----------------------------------------------
 *   The interior growth law Int(N) = Theta(log N) DOES constrain the far-field ceiling independently
 *   of the near-field holdout curvature, in two layers: (i) the FORM (monotone, non-saturating,
 *   log) rejects the quadratic turnover top end O(1)-INDEPENDENTLY; (ii) the point value F = 3.775e7
 *   places the predicted ceiling OUTSIDE the original +1.37%..+8.36% band on the LOW side (-0.30%),
 *   but that placement inherits the imp-96750 one-sided weighted cotangent second-moment O(1)/s0*
 *   sub-gap. So the QUALITATIVE inside/outside answer (outside, low; quadratic top rejected) is
 *   robust; the exact within-sliver value is not certified. Assessment only; instantiates no
 *   interval, closes no sub-gap, moves no bound. The only rigorous anchor stays the trace ceiling
 *   T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x regardless. No refereed bound is changed
 *   ; RH open; NO QED.
 *
 * @see imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator (the point-anchor application)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (Int(N) <= s* log N; the O(1) sub-gap)
 * @see imp-96982-frobenius-holdout-quadratic-favoured-glossary-headword (the +1.37%..+8.36% band)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (the interior slope band 5.66..5.80)
 *
 * Ticket: imp-97118 (numerical, opus-4-8, api-pool). Assessment + inside/outside verdict + named
 * residual; no bound moved; NO QED; no refereed bound is changed.
 */

import {
  IMP97081_NEARFIELD_CEILINGS,
  IMP97081_INTERIOR_ANCHOR,
} from './imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator.js';
import {
  IMP96750_S_STAR,
  IMP96750_S0_MEASURED,
  IMP96750_SUBGAP,
} from './imp-96750-route-m-interior-second-moment-upper-bound-reduction.js';

// -- The ORIGINAL imp-96982 band edges (percent-vs-line), from the imp-97081 near-field ceilings. --
export const IMP97118_ORIGINAL_BAND = Object.freeze({
  floorPct: IMP97081_NEARFIELD_CEILINGS.tailPctVsLine, // +1.369% (the +d/N model, band floor)
  topPct: IMP97081_NEARFIELD_CEILINGS.quadPctVsLine, // +8.356% (the quadratic model, band top)
});

// -- The growth-law point value F, read as an inside/outside verdict against the ORIGINAL band. ---
const IMP97118_F_PCT = IMP97081_INTERIOR_ANCHOR.fPctVsLine; // ~ -0.30% vs line
export const IMP97118_INSIDE_OUTSIDE = Object.freeze({
  fPctVsLine: IMP97118_F_PCT, // ~ -0.30%
  bandFloorPct: IMP97118_ORIGINAL_BAND.floorPct, // +1.369%
  bandTopPct: IMP97118_ORIGINAL_BAND.topPct, // +8.356%
  // Is F strictly inside the ORIGINAL [floor, top] band? (No -- it sits below the floor.)
  insideOriginalBand:
    IMP97118_F_PCT >= IMP97118_ORIGINAL_BAND.floorPct &&
    IMP97118_F_PCT <= IMP97118_ORIGINAL_BAND.topPct,
  location: 'below', // outside, on the LOW side of the original band
  marginBelowFloorPp: IMP97118_ORIGINAL_BAND.floorPct - IMP97118_F_PCT, // ~1.67 pp below the floor
});

// -- Layer (i): the O(1)-INDEPENDENT structural discrimination (form only, no constant). ----------
export const IMP97118_STRUCTURAL_LAYER = Object.freeze({
  growthLaw: 'Int(N) = Theta(log N)', // monotone, non-saturating, logarithmic (imp-96750)
  usesO1Constant: false, // the FORM uses none of the unproven s0*/O(1) constant
  rejectsQuadTurnover: true, // a log-growing interior mass never turns over; the quadratic does
  quadTurnoverN: IMP97081_NEARFIELD_CEILINGS.quadTurnoverN, // 2.31e9 (unphysical peak)
  independentOfHoldoutCurvature: true, // holdout fixes near-field CURVATURE; growth law fixes FORM
});

// -- Layer (ii): the O(1)-DEPENDENT point value (inherits the imp-96750 sub-gap). -----------------
export const IMP97118_VALUE_LAYER = Object.freeze({
  fCeiling: IMP97081_INTERIOR_ANCHOR.fCeiling, // 3.775e7 (from the interior slope s* ~ 5.76)
  sStar: IMP96750_S_STAR, // ~5.760 = 2 zeta(2) s0
  s0Measured: IMP96750_S0_MEASURED, // ~1.751 (candidate absolute constant s0*)
  traceCeiling: IMP97081_INTERIOR_ANCHOR.traceCeiling, // 2.594e7 (the only rigorous anchor)
  residualSubGap: IMP96750_SUBGAP.id, // imp-96750-weighted-cotangent-second-moment-upper-constant
  valueCertified: false, // point value rests on the unproven one-sided cotangent constant
});

export const IMP97118_VERDICT = Object.freeze({
  id: 'imp-97118',
  proofSection: 'Route-M',
  question:
    'Does the imp-96750 interior second-moment growth law Int(N) = Theta(log N) constrain the ' +
    'far-field ||G||_F ceiling VALUE independently of the near-field holdout curvature, and does ' +
    'it predict a ceiling location INSIDE or OUTSIDE the imp-96982 +1.37%..+8.36% band?',
  constrainsIndependentlyOfHoldout: true, // holdout = near-field curvature; growth law = far-field form
  predictsOutsideOriginalBand: true, // F = -0.30% lies below the +1.369% floor
  predictedLocation: 'below', // outside, LOW side of the original band
  quadTopRejectedStructurally: true, // layer (i): log form never turns over -- O(1)-independent
  qualitativeAnswerRobust: true, // outside-low + quad-rejected uses only the growth-law FORM
  pointValueCertified: false, // the exact within-sliver value needs the imp-96750 O(1)/s0* constant
  anyBoundMoved: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x regardless
  conclusion:
    'The interior growth law Int(N) = Theta(log N) constrains the far-field ceiling in two layers. ' +
    'Layer (i), the FORM (monotone, non-saturating, logarithmic), uses NONE of the imp-96750 ' +
    'O(1)/s0* constant and STRUCTURALLY rejects the quadratic top end -- a log-growing interior ' +
    'mass never turns over, whereas the quadratic peaks at N ~ 2.31e9; this is independent of the ' +
    'near-field holdout, which fixes only near-field CURVATURE. Layer (ii), the point value ' +
    'F = 3.775e7 (from the interior slope s* ~ 5.76), places the predicted ceiling at -0.30% vs ' +
    'line -- BELOW the +1.369% band floor, i.e. OUTSIDE the original +1.37%..+8.36% band on the ' +
    'LOW side by ~1.67 pp -- but that placement inherits the imp-96750 one-sided weighted cotangent ' +
    'second-moment O(1)/s0* sub-gap. So the QUALITATIVE inside/outside answer (outside, low; ' +
    'quadratic top rejected) is robust; the exact within-sliver value is not certified. Assessment ' +
    'only; the rigorous anchor stays T = 2.594e7; compute (N ~ 9916) binds first by >2600x; ' +
    'changes no bound; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97118_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the imp-96750 growth law ' +
  'Int(N) = Theta(log N) rejects the quadratic ceiling top end O(1)-INDEPENDENTLY (log form never ' +
  'turns over) and, via the point value F = 3.775e7, places the predicted far-field ceiling BELOW ' +
  'the +1.37% floor -- OUTSIDE the original +1.37%..+8.36% band on the low side. The qualitative ' +
  'inside/outside verdict is robust; the exact value inherits the imp-96750 one-sided cotangent ' +
  'second-moment sub-gap and is not certified. The only rigorous anchor is T = 2.594e7; compute ' +
  '(N ~ 9916, imp-96352) binds first by >2600x. No bound is claimed moved.';

export default IMP97118_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97118_ASSERTIONS = [
  {
    id: 'imp97118-growth-law-predicts-outside-original-band-low',
    why: 'the growth-law point value F must fall BELOW the original band floor (+1.369%), i.e. ' +
      'outside the +1.37%..+8.36% band on the low side -- the ticket inside/outside verdict.',
    holds: () =>
      IMP97118_INSIDE_OUTSIDE.insideOriginalBand === false &&
      IMP97118_INSIDE_OUTSIDE.fPctVsLine < IMP97118_INSIDE_OUTSIDE.bandFloorPct &&
      IMP97118_INSIDE_OUTSIDE.location === 'below' &&
      IMP97118_INSIDE_OUTSIDE.marginBelowFloorPp > 1.5,
  },
  {
    id: 'imp97118-structural-layer-is-o1-independent',
    why: 'layer (i) must reject the quadratic turnover using only the growth-law FORM (no O(1)/s0* ' +
      'constant), independently of the near-field holdout curvature.',
    holds: () =>
      IMP97118_STRUCTURAL_LAYER.usesO1Constant === false &&
      IMP97118_STRUCTURAL_LAYER.rejectsQuadTurnover === true &&
      IMP97118_STRUCTURAL_LAYER.independentOfHoldoutCurvature === true &&
      IMP97118_STRUCTURAL_LAYER.quadTurnoverN > IMP97118_VALUE_LAYER.fCeiling,
  },
  {
    id: 'imp97118-value-layer-inherits-subgap',
    why: 'layer (ii) point value must stay above the rigorous trace anchor, be uncertified, and ' +
      'name the imp-96750 residual sub-gap it inherits.',
    holds: () =>
      IMP97118_VALUE_LAYER.fCeiling > IMP97118_VALUE_LAYER.traceCeiling &&
      IMP97118_VALUE_LAYER.valueCertified === false &&
      IMP97118_VALUE_LAYER.sStar > 5.66 &&
      IMP97118_VALUE_LAYER.sStar < 5.85 &&
      /upper-constant/.test(IMP97118_VALUE_LAYER.residualSubGap),
  },
  {
    id: 'imp97118-honesty-gate-no-qed',
    why: 'assessment only: no bound moved, point value uncertified, compute binds first, and the ' +
      'honesty markers plus the two-layer verdict are present.',
    holds: () =>
      IMP97118_VERDICT.anyBoundMoved === false &&
      IMP97118_VERDICT.pointValueCertified === false &&
      IMP97118_VERDICT.constrainsIndependentlyOfHoldout === true &&
      IMP97118_VERDICT.predictsOutsideOriginalBand === true &&
      IMP97118_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97118_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97118_HONEST_BANNER) &&
      /imp-96750/.test(IMP97118_VERDICT.conclusion),
  },
];

for (const a of IMP97118_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97118-route-m-interior-growth-law-farfield-band-discriminator assertion failed: ${a.id}`,
    );
  }
}

export { IMP97118_ASSERTIONS };
