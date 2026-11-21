/**
 * @module imp-97142-route-m-farfield-ceiling-slope-band-interval
 * @fileoverview imp-97142 -- import-light MEASUREMENT: size the imp-97118 LAYER-(ii) O(1)/s0*
 *   dependence of the far-field Route M conditioning ceiling VALUE F = 3.775e7 by propagating the
 *   imp-96667 interior-slope band s* in 5.66..5.80 through the F = slope-derived placement, and
 *   report the resulting fPctVsLine INTERVAL against the ORIGINAL imp-96982 +1.37%..+8.36% band.
 *
 *   WHAT imp-97118 LEFT OPEN
 *   -----------------------------------------------
 *   imp-97118 split the growth-law discrimination into two layers. LAYER (i) -- the FORM
 *   Int(N) = Theta(log N) -- rejects the quadratic turnover top end O(1)-INDEPENDENTLY (a log
 *   interior mass never turns over). LAYER (ii) -- the numeric ceiling VALUE F = 3.775e7,
 *   placed at fPctVsLine = -0.30% -- inherits the imp-96750 one-sided weighted-cotangent
 *   second-moment O(1)/s0* sub-gap, because F is read off the interior second-moment SLOPE
 *   s* = 2 zeta(2) s0 with s0 ~ 1.751 measured (=> s* ~ 5.76). imp-97118 stated the point value
 *   as a single number and flagged that it inherits the sub-gap, but never PROPAGATED the
 *   imp-96667 interior-slope band s* in 5.66..5.80 into an fPctVsLine INTERVAL. This ticket does
 *   exactly that -- a sensitivity size, not a certificate.
 *
 *   THE PROPAGATION (linear in the slope)
 *   -----------------------------------------------
 *   F is read off the interior second-moment SLOPE (imp-97081: "F is derived from the interior
 *   second-moment SLOPE, NOT from fitting the 18-rung ||G||_F ladder"). The Frobenius target
 *   therefore scales LINEARLY with s*: F(s*) = F_center * (s* / s*_center), with the central
 *   anchor F_center = 3.775e7 at s*_center = 5.76. Propagating the imp-96667 band endpoints:
 *       s* = 5.66  ->  F = 3.7095e7  ->  fPctVsLine = -2.035%
 *       s* = 5.76  ->  F = 3.7750e7  ->  fPctVsLine = -0.304%   (the imp-97118 point value)
 *       s* = 5.80  ->  F = 3.8012e7  ->  fPctVsLine = +0.389%
 *   (line baseline N* = 3.7865e7; fPctVsLine = (F - line)/line * 100.) So the LAYER-(ii) value,
 *   once the slope uncertainty is carried, is an INTERVAL fPctVsLine in [-2.035%, +0.389%]
 *   (width ~2.42 pp), NOT a single -0.30% point.
 *
 *   INSIDE / OUTSIDE VERDICT AGAINST THE ORIGINAL BAND -- how much survives s0*
 *   -----------------------------------------------
 *   The ORIGINAL imp-96982 band is +1.369% (floor, +d/N) .. +8.356% (top, quadratic). The ENTIRE
 *   propagated interval lies BELOW the +1.369% floor: even the most-favourable slope end
 *   (s* = 5.80, fPctVsLine = +0.389%) sits ~0.98 pp UNDER the floor. So the qualitative
 *   inside/outside verdict of imp-97118 -- "outside the original band, on the LOW side; quadratic
 *   top rejected" -- SURVIVES the full imp-96667 slope band: it does not depend on which slope in
 *   5.66..5.80 is correct. What does NOT survive is any claim to a value within the imp-97081
 *   [F, +d/N] sliver: the slope band alone spreads F across ~2.42 pp, so the exact within-sliver
 *   placement is not pinned. This SIZES the LAYER-(ii) sub-gap: the inside/outside bit is robust,
 *   the exact value is not, and the slope band is the dominant source of the spread.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A sensitivity MEASUREMENT: it propagates a measured slope band into an fPctVsLine interval and
 *   reports which conclusions survive. It instantiates no interval CERTIFICATE, closes no sub-gap,
 *   moves no bound, establishes no operator positivity. The imp-96667 band 5.66..5.80 is itself
 *   measured, and the O(1) additive term (needed to fix F as a value, not just a slope) is a
 *   SECOND, separate residual not captured here -- so the true LAYER-(ii) spread is at least this
 *   wide. The only rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916,
 *   imp-96352) binds first by >2600x regardless. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97118-route-m-interior-growth-law-farfield-band-discriminator (LAYER (ii); the sub-gap this sizes)
 * @see imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator (the point anchor F, slope derivation)
 * @see imp-96982-frobenius-holdout-quadratic-favoured-glossary-headword (the original +1.37%..+8.36% band)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (Int(N) <= s* log N; the O(1)/s0* sub-gap)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (the interior slope band 5.66..5.80)
 *
 * Ticket: imp-97142 (numerical, opus-4-8, api-pool). Measurement + propagated interval + survival
 * verdict; no bound moved; NO QED; no refereed bound is changed.
 */

import {
  IMP97081_NEARFIELD_CEILINGS,
  IMP97081_INTERIOR_ANCHOR,
} from './imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator.js';

// -- Inputs (baked from the sibling modules; all measured, none certified). ----------------------
const LINE_NSTAR = IMP97081_NEARFIELD_CEILINGS.lineNStar; // 3.7865e7 baseline
const F_CENTER = IMP97081_INTERIOR_ANCHOR.fCeiling; // 3.775e7 at s* = 5.76
const S_CENTER = IMP97081_INTERIOR_ANCHOR.sStar; // 5.76 = 2 zeta(2) s0
const SLOPE_LO = IMP97081_INTERIOR_ANCHOR.interiorSlopeBand.lo; // 5.66 (imp-96667)
const SLOPE_HI = IMP97081_INTERIOR_ANCHOR.interiorSlopeBand.hi; // 5.80 (imp-96667)

// F scales LINEARLY with the interior second-moment slope: F(s*) = F_center * (s*/s*_center).
const fOfSlope = (s) => F_CENTER * (s / S_CENTER);
// Percent vs the line baseline: (F - line)/line * 100.
const pctVsLine = (F) => ((F - LINE_NSTAR) / LINE_NSTAR) * 100;

// -- The propagated ceiling values at the slope-band endpoints. ----------------------------------
export const IMP97142_SLOPE_PROPAGATION = Object.freeze({
  slopeLo: SLOPE_LO, // 5.66
  slopeCenter: S_CENTER, // 5.76
  slopeHi: SLOPE_HI, // 5.80
  fLo: fOfSlope(SLOPE_LO), // ~3.7095e7 (slope 5.66)
  fCenter: fOfSlope(S_CENTER), // 3.775e7 (slope 5.76; = the imp-97118 point value)
  fHi: fOfSlope(SLOPE_HI), // ~3.8012e7 (slope 5.80)
});

// -- The resulting fPctVsLine INTERVAL (the ticket deliverable). ---------------------------------
export const IMP97142_FPCT_INTERVAL = Object.freeze({
  loPct: pctVsLine(fOfSlope(SLOPE_LO)), // ~ -2.035% (slope 5.66)
  centerPct: pctVsLine(fOfSlope(S_CENTER)), // ~ -0.304% (imp-97118 point value)
  hiPct: pctVsLine(fOfSlope(SLOPE_HI)), // ~ +0.389% (slope 5.80)
  widthPp: pctVsLine(fOfSlope(SLOPE_HI)) - pctVsLine(fOfSlope(SLOPE_LO)), // ~2.42 pp
});

// -- The ORIGINAL imp-96982 band edges and the survival verdict. ---------------------------------
export const IMP97142_SURVIVAL = Object.freeze({
  bandFloorPct: IMP97081_NEARFIELD_CEILINGS.tailPctVsLine, // +1.369% (+d/N floor)
  bandTopPct: IMP97081_NEARFIELD_CEILINGS.quadPctVsLine, // +8.356% (quadratic top)
  // Does the WHOLE propagated interval stay below the original band floor?
  entireIntervalBelowFloor:
    pctVsLine(fOfSlope(SLOPE_HI)) < IMP97081_NEARFIELD_CEILINGS.tailPctVsLine,
  // Margin of the interval TOP below the floor (the tightest case, slope 5.80).
  topMarginBelowFloorPp:
    IMP97081_NEARFIELD_CEILINGS.tailPctVsLine - pctVsLine(fOfSlope(SLOPE_HI)), // ~0.98 pp
  // The inside/outside verdict is robust to the slope band; the exact value is not.
  insideOutsideVerdictSurvives: true, // whole interval outside-low regardless of slope in [5.66,5.80]
  exactValuePinned: false, // slope band alone spreads F across ~2.42 pp
});

export const IMP97142_VERDICT = Object.freeze({
  id: 'imp-97142',
  proofSection: 'Route-M',
  sizes: 'imp-97118 LAYER (ii)',
  question:
    'Propagating the imp-96667 interior-slope band s* in 5.66..5.80 through the F = slope-derived ' +
    'placement, what fPctVsLine INTERVAL does the far-field ceiling value take against the ' +
    'original imp-96982 +1.37%..+8.36% band, and how much of the imp-97118 inside/outside verdict ' +
    'survives the O(1)/s0* slope uncertainty?',
  fPctInterval: [
    IMP97142_FPCT_INTERVAL.loPct,
    IMP97142_FPCT_INTERVAL.hiPct,
  ], // ~[-2.035%, +0.389%]
  entireIntervalBelowOriginalFloor: true, // top +0.389% still ~0.98 pp under the +1.369% floor
  insideOutsideVerdictSurvives: true, // outside-low, quad-top rejected, for every slope in band
  exactWithinSliverValuePinned: false, // slope band alone spreads F ~2.42 pp; O(1) term is a further residual
  anyBoundMoved: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x regardless
  conclusion:
    'Propagating the imp-96667 interior-slope band s* in 5.66..5.80 through the linear F(s*) = ' +
    'F_center * (s*/5.76) placement turns the imp-97118 LAYER-(ii) point value F = 3.775e7 ' +
    '(fPctVsLine = -0.30%) into an INTERVAL: F in [3.7095e7, 3.8012e7], fPctVsLine in ' +
    '[-2.035%, +0.389%] (width ~2.42 pp). The ENTIRE interval lies BELOW the +1.369% floor of the ' +
    'original imp-96982 band -- even the most-favourable slope (s* = 5.80, +0.389%) sits ~0.98 pp ' +
    'under the floor -- so the imp-97118 inside/outside verdict (outside the original band, LOW ' +
    'side; quadratic top rejected) SURVIVES the full slope uncertainty. What does NOT survive is ' +
    'the exact within-sliver value: the slope band alone spreads F across ~2.42 pp, and the ' +
    'imp-96750 O(1) additive term is a further, separate residual not captured here, so the true ' +
    'LAYER-(ii) spread is at least this wide. Measurement only; instantiates no interval ' +
    'certificate; the rigorous anchor stays T = 2.594e7; compute (N ~ 9916) binds first by ' +
    '>2600x; changes no bound; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97142_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: propagating the imp-96667 ' +
  'interior-slope band s* in 5.66..5.80 through F(s*) = F_center * (s*/5.76) gives the far-field ' +
  'ceiling value an fPctVsLine INTERVAL of [-2.035%, +0.389%] (F in [3.7095e7, 3.8012e7]). The ' +
  'whole interval sits below the +1.369% floor of the original imp-96982 band, so the imp-97118 ' +
  'outside-low inside/outside verdict survives the slope uncertainty; the exact within-sliver ' +
  'value does not (slope band spreads F ~2.42 pp, O(1) term is a further residual). The only ' +
  'rigorous anchor is the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first ' +
  'by >2600x. No bound is claimed moved.';

export default IMP97142_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97142_ASSERTIONS = [
  {
    id: 'imp97142-center-recovers-imp97118-point-value',
    why: 'the central slope s* = 5.76 must reproduce the imp-97118 LAYER-(ii) point value ' +
      'F = 3.775e7 at fPctVsLine ~ -0.30% -- the propagation must pass through the known anchor.',
    holds: () =>
      Math.abs(IMP97142_SLOPE_PROPAGATION.fCenter - IMP97081_INTERIOR_ANCHOR.fCeiling) < 1 &&
      Math.abs(IMP97142_FPCT_INTERVAL.centerPct - IMP97081_INTERIOR_ANCHOR.fPctVsLine) < 1e-6,
  },
  {
    id: 'imp97142-interval-ordered-and-brackets-center',
    why: 'the propagated fPctVsLine interval must be ordered lo < center < hi and have a positive ' +
      'width, consistent with F scaling linearly (increasing) in the slope.',
    holds: () =>
      IMP97142_FPCT_INTERVAL.loPct < IMP97142_FPCT_INTERVAL.centerPct &&
      IMP97142_FPCT_INTERVAL.centerPct < IMP97142_FPCT_INTERVAL.hiPct &&
      IMP97142_FPCT_INTERVAL.widthPp > 2.0 &&
      IMP97142_FPCT_INTERVAL.widthPp < 3.0,
  },
  {
    id: 'imp97142-whole-interval-below-original-floor',
    why: 'the ENTIRE propagated interval (including the most-favourable slope top) must stay below ' +
      'the +1.369% original band floor -- the basis for the inside/outside verdict surviving.',
    holds: () =>
      IMP97142_SURVIVAL.entireIntervalBelowFloor === true &&
      IMP97142_FPCT_INTERVAL.hiPct < IMP97142_SURVIVAL.bandFloorPct &&
      IMP97142_SURVIVAL.topMarginBelowFloorPp > 0.5 &&
      IMP97142_SURVIVAL.insideOutsideVerdictSurvives === true &&
      IMP97142_SURVIVAL.exactValuePinned === false,
  },
  {
    id: 'imp97142-honesty-gate-no-qed',
    why: 'measurement only: no bound moved, exact value not pinned, compute binds first, and the ' +
      'honesty markers plus the sizing verdict are present.',
    holds: () =>
      IMP97142_VERDICT.anyBoundMoved === false &&
      IMP97142_VERDICT.exactWithinSliverValuePinned === false &&
      IMP97142_VERDICT.insideOutsideVerdictSurvives === true &&
      IMP97142_VERDICT.entireIntervalBelowOriginalFloor === true &&
      IMP97142_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97142_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97142_HONEST_BANNER) &&
      /imp-96667/.test(IMP97142_VERDICT.conclusion),
  },
];

for (const a of IMP97142_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97142-route-m-farfield-ceiling-slope-band-interval assertion failed: ${a.id}`,
    );
  }
}

export { IMP97142_ASSERTIONS };
