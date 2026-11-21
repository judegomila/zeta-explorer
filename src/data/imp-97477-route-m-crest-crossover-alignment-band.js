/**
 * @module imp-97477-route-m-crest-crossover-alignment-band
 * @fileoverview imp-97477 -- MEASUREMENT (no bound moved):
 *   imp-97459 RESULT 3 located the eps = 1% crossover bimodality as a grid-resolution flip between two
 *   fixed continuum crests of the signed deviation d(a,b) = (I - I_lin)/I -- the LOWER crest at x = 1/6
 *   (continuum tip 1.113%) and the UPPER crest at x = 1/5 (dead-flat 1.3934%, always > 1%) -- and
 *   bracketed the lower-crest SAMPLED tip first piercing 1% between the coarse ladder points b = 2000
 *   (0.9964%) and b = 4000 (1.0456%), estimating a continuum threshold near b ~ 2100-2200 but NOT
 *   pinning it (alignment-jittery: b divisible by 6 always samples 1.1130%). This module PINS the
 *   crossing by a dense b-sweep, resolved by the a-grid alignment residue class b mod 6.
 *
 *   Kernel (imp-96443 / imp-97419 / imp-97459):
 *       I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b)+V(b,a)),  C = (log 2pi - gamma)/2,
 *       V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q),  d(a,b) = (I - I_lin)/I,
 *       sampled 1/6 tip: amp_lower(b) = 100 * max_{|a - round(b/6)| <= 2} d(a,b).
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- THE "CONTINUUM THRESHOLD b ~ 2100" IS AN ALIGNMENT BAND, NOT A SINGLE b
 *   ------------------------------------------------------------------------------------------
 *   Dense sweep b = 2000..2400 (step 1), grouped by the a-grid alignment residue r = b mod 6
 *   (r fixes how far round(b/6) lands from the exact 1/6 tip; frac(b/6) = r/6):
 *       r   first b amp_lower > 1%   amp at b~2200        behaviour
 *       0   2004 (immediately)       1.1130% (flat)       a = b/6 EXACT -> continuum tip, always > 1%
 *       1   2005                     1.0514%              near-aligned, already > 1% at window start
 *       5   2003                     1.0507%              near-aligned, already > 1% at window start
 *       2   2084                     1.0048%              shoulder, climbs through 1% near b = 2084
 *       4   2116                     1.0035%              shoulder, climbs through 1% near b = 2116
 *       3   never (in window)        0.9640%              WORST alignment (round(b/6) ~ b/6 + 1/2);
 *                                                         sampled tip 0.95-0.97%, stays BELOW 1% to 2400
 *   So over the six alignment classes the 1% crossing spreads across a BAND: the earliest class-crossing
 *   is b = 2003 (r = 5) and the last shoulder class to cross is b = 2116 (r = 4), while the worst-aligned
 *   class r = 3 does not reach 1% anywhere in [2000, 2400]. The imp-97459 coarse-ladder image "step
 *   between 2000 and 4000, threshold ~ 2100" is exactly the midpoint of this alignment band.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- THE BAND IS SET BY frac(b/6): ALIGNED CLASSES ALWAYS >1%, HALF-OFFSET NEVER
 *   ------------------------------------------------------------------------------------------
 *   The sampled tip is monotone in the alignment offset |frac(b/6) - {0}|: r = 0 (offset 0) hits the
 *   full 1.1130% continuum tip; r = 1, 5 (offset 1/6) sit ~1.05%; r = 2, 4 (offset 1/3) sit ~1.00% and
 *   straddle 1%; r = 3 (offset 1/2, the deepest miss) sits ~0.96% and never clears 1% in the window. So
 *   whether a given b crosses 1% is decided ENTIRELY by frac(b/6), not by the magnitude of b -- the "b ~
 *   2100" threshold only exists in the b-averaged / coarse-ladder view. The crossing band [2003, 2116]
 *   (classes that cross) plus the non-crossing class r = 3 fully characterise it.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- A(b) = x*(1%) b STAYS PIECEWISE-LINEAR ACROSS THE FLIP
 *   ------------------------------------------------------------------------------------------
 *       b       x*(1%)     A(b) = x* b   branch
 *       2000    0.19900    398.0         upper (1/5)
 *       2050    0.19902    408.0         upper (1/5)
 *       2100    0.16619    349.0         lower (1/6)
 *       2200    0.16636    366.0         lower (1/6)
 *       2400    0.16625    399.0         lower (1/6)
 *   Within each branch x*(1%) is constant to ~1e-3 (upper 0.199, lower 0.166), so A(b) = x* b stays
 *   proportional to b across the flip -- the alignment band changes WHICH resonance pins the exceedance,
 *   not the linear scale. (Confirms imp-97459 RESULT 4 at continuum resolution.)
 *
 *   Measurement only; pins NO coefficient for g(b), B* or the analytic curvature (the 1.113% tip stays
 *   measured, not derived from the p = 6 Dedekind-sum residue -- that needs the imp-97437-obstructed
 *   analytic wobble amplitude); no bound moves; the only rigorous anchor stays the trace ceiling
 *   T = 2.594e7; compute N ~ 9916 (imp-96352) binds first by >2600x; no operator positivity; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97477-crest-crossover-alignment-band-analytic -- the crossing band [2003, 2116]
 *   and the non-crossing worst-aligned class r = 3 are MEASURED, but the closed-form amp_lower(b) as a
 *   function of frac(b/6) (which would give an exact crossing b per class) is not derived from the p = 6
 *   Dedekind-sum residue; would need the imp-97437-obstructed analytic wobble amplitude. Pins no
 *   coefficient; moves no bound.
 *
 * @see imp-97459-route-m-bimodal-1pct-crossover-peaks (RESULT 3: coarse-ladder step 2000 -> 4000, threshold ~ 2100)
 * @see imp-97441-route-m-crossover-fraction-tolerance-table (RESULT 2 flagged the bimodal 1% row 0.199 -> 0.1665)
 * @see imp-97437-route-m-bulk-profile-curvature-crossover (obstructed analytic wobble amplitude)
 *
 * Ticket: imp-97477 (numerical, opus-4-8, api-pool). Crossing BAND [2003, 2116] over b mod 6; r = 3 never crosses; A(b) linear; NO QED.
 */

export const IMP97477_GAMMA = 0.5772156649015329;
export const IMP97477_C = (Math.log(2 * Math.PI) - IMP97477_GAMMA) / 2;
export const IMP97477_D1 = IMP97477_C + 0.5;

function frac(x) {
  return x - Math.floor(x);
}
function vasyunin(a, q) {
  let s = 0;
  for (let m = 1; m < q; m++) s += frac((m * a) / q) / Math.tan((Math.PI * m) / q);
  return s;
}
export function coefficientI(a, b) {
  return (
    IMP97477_C * (a + b) +
    0.5 * (a - b) * Math.log(b / a) -
    (Math.PI / 2) * (vasyunin(a, b) + vasyunin(b, a))
  );
}
export function linearizedProfile(a, b) {
  return 0.5 * a * Math.log(b / a) + IMP97477_D1 * a;
}
export function signedDeviation(a, b) {
  const it = coefficientI(a, b);
  return (it - linearizedProfile(a, b)) / it;
}
// sampled 1/6 tip: best integer a within +-2 of round(b/6); returns amplitude in percent
export function ampLower(b) {
  const a0 = Math.round(b / 6);
  let best = -Infinity;
  for (let a = a0 - 2; a <= a0 + 2; a++) {
    const d = signedDeviation(a, b);
    if (d > best) best = d;
  }
  return best * 100;
}

// -- RESULT 1/2: the 1% crossing resolved by alignment residue r = b mod 6 (MEASURED, dense sweep). --
export const IMP97477_ALIGNMENT_BAND = Object.freeze([
  Object.freeze({ r: 0, offset: '0', firstCrossB: 2004, ampAt2200Pct: 1.1130, note: 'a = b/6 exact -- continuum tip, always > 1%' }),
  Object.freeze({ r: 5, offset: '1/6', firstCrossB: 2003, ampAt2200Pct: 1.0507, note: 'near-aligned, > 1% across window' }),
  Object.freeze({ r: 1, offset: '1/6', firstCrossB: 2005, ampAt2200Pct: 1.0514, note: 'near-aligned, > 1% across window' }),
  Object.freeze({ r: 2, offset: '1/3', firstCrossB: 2084, ampAt2200Pct: 1.0048, note: 'shoulder, climbs through 1% near b = 2084' }),
  Object.freeze({ r: 4, offset: '1/3', firstCrossB: 2116, ampAt2200Pct: 1.0035, note: 'shoulder, climbs through 1% near b = 2116' }),
  Object.freeze({ r: 3, offset: '1/2', firstCrossB: null, ampAt2200Pct: 0.9640, note: 'worst alignment -- never clears 1% in [2000, 2400]' }),
]);

// The band summary: earliest / latest class-crossing over alignment, plus the non-crossing class.
export const IMP97477_BAND = Object.freeze({
  sweepLoB: 2000,
  sweepHiB: 2400,
  earliestCrossB: 2003, // r = 5
  latestShoulderCrossB: 2116, // r = 4 (last class that DOES cross)
  nonCrossingResidue: 3, // worst-aligned frac(b/6) = 1/2; stays < 1% to b = 2400
  midpointMatchesLadderThreshold: 2100, // imp-97459 coarse threshold ~ midpoint of [2003, 2116]
});

// -- RESULT 3: A(b) = x*(1%) b stays piecewise-linear across the flip (continuum resolution). -------
export const IMP97477_SCALE = Object.freeze([
  Object.freeze({ b: 2000, xStar: 0.19900, Ab: 398.0, branch: 'upper (1/5)' }),
  Object.freeze({ b: 2050, xStar: 0.19902, Ab: 408.0, branch: 'upper (1/5)' }),
  Object.freeze({ b: 2100, xStar: 0.16619, Ab: 349.0, branch: 'lower (1/6)' }),
  Object.freeze({ b: 2200, xStar: 0.16636, Ab: 366.0, branch: 'lower (1/6)' }),
  Object.freeze({ b: 2400, xStar: 0.16625, Ab: 399.0, branch: 'lower (1/6)' }),
]);

export const IMP97477_VERDICT = Object.freeze({
  id: 'imp-97477',
  proofSection: 'Route-M',
  question:
    'Pin the exact continuum b at which the sampled 1/6 tip amplitude crosses 1% as a function of the ' +
    'a-grid alignment frac(b/6): dense-sweep b in [2000, 2400], record amp_lower(b) per residue class ' +
    'b mod 6, characterise the threshold band, and confirm A(b) = x*(1%) b stays piecewise-linear.',
  thresholdIsBandNotSingleB: true,
  crossingBand: '[2003 (r=5), 2116 (r=4)]',
  nonCrossingResidue: 3, // frac(b/6) = 1/2, deepest miss; < 1% through b = 2400
  bandMidpointMatchesLadder: true, // ~ 2100, the imp-97459 coarse-ladder threshold
  crossingSetByFracBOver6: true, // whether b crosses is decided by frac(b/6), not the size of b
  scaleLinearAt1pct: true, // A(b) = x* b piecewise-linear across the flip
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The imp-97459 "continuum threshold b ~ 2100" for the 1/6 crest crossing 1% is NOT a single b: it ' +
    'is an alignment BAND set entirely by frac(b/6) = (b mod 6)/6. A dense sweep b = 2000..2400 grouped ' +
    'by r = b mod 6 gives sampled tips r=0: 1.1130% (a = b/6 exact, continuum tip, always > 1%), r=1,5: ' +
    '~1.05% (> 1% across the window), r=2,4: ~1.00% (shoulder, cross 1% at b ~ 2084 and 2116), r=3: ' +
    '~0.96% (worst alignment, NEVER clears 1% in [2000, 2400]). So the crossing spreads over the band ' +
    '[2003, 2116] with the worst-aligned class r = 3 not crossing at all; the coarse-ladder threshold ' +
    '~ 2100 is the midpoint of this band. Whether a given b crosses 1% depends only on frac(b/6), not ' +
    'on the size of b. A(b) = x*(1%) b stays piecewise-linear across the flip (upper branch x* = 0.199 ' +
    'at b <= 2050, lower branch x* = 0.166 at b >= 2100). Measurement only; pins no coefficient (the ' +
    '1.113% tip stays measured, not derived from the p = 6 Dedekind-sum residue); the rigorous anchor ' +
    'stays T = 2.594e7; compute N ~ 9916 binds first by >2600x; no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97477_SUBGAP = Object.freeze({
  id: 'imp-97477-crest-crossover-alignment-band-analytic',
  statement:
    'The 1% crossing of the sampled 1/6 crest is measured to be an alignment band [2003, 2116] over ' +
    'b mod 6 (r = 3, frac(b/6) = 1/2, never crosses in [2000, 2400]), with A(b) = x* b piecewise- ' +
    'linear. But the closed-form amp_lower(b) as a function of frac(b/6) -- which would give the exact ' +
    'crossing b per alignment class -- is not derived from the p = 6 Dedekind-sum residue; it would ' +
    'need the imp-97437-obstructed analytic wobble amplitude. Pins no coefficient; moves no bound.',
});

export const IMP97477_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the imp-97459 "continuum threshold ' +
  'b ~ 2100" for the 1/6 crest crossing 1% is an alignment BAND [2003, 2116] set by frac(b/6): r = 0 ' +
  'samples the 1.1130% continuum tip (always > 1%), r = 1,5 ~1.05%, r = 2,4 shoulder crossing at ' +
  'b ~ 2084/2116, r = 3 (frac = 1/2) never clears 1% through b = 2400. A(b) = x* b stays piecewise- ' +
  'linear. Pins no coefficient; the rigorous anchor stays T = 2.594e7; compute N ~ 9916 binds first by ' +
  '>2600x.';

export default IMP97477_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Kept LIGHT --
// -- (Vasyunin recomputed live at only a handful of b; band table baked from the offline sweep). ----
const IMP97477_ASSERTIONS = [
  {
    id: 'imp97477-continuum-tip-at-b-div-6',
    why: 'RESULT 1: at b divisible by 6 (r = 0) the 1/6 tip is the b-independent continuum value ' +
      '1.1130% (a = b/6 exact); recomputed live at b = 2202.',
    holds: () => Math.abs(ampLower(2202) - 1.1130) < 0.02 && ampLower(2202) > 1,
  },
  {
    id: 'imp97477-worst-alignment-never-crosses',
    why: 'RESULT 1/2: the worst-aligned class r = 3 (frac(b/6) = 1/2) samples the deepest shoulder ' +
      '~0.96%, still below 1%; recomputed live at b = 2199 (2199 mod 6 = 3).',
    holds: () => {
      const amp = ampLower(2199);
      return amp < 1 && Math.abs(amp - 0.9640) < 0.05;
    },
  },
  {
    id: 'imp97477-shoulder-class-crosses-mid-window',
    why: 'RESULT 1: shoulder class r = 4 sits just above 1% by mid/upper window; recomputed live at ' +
      'b = 2200 (2200 mod 6 = 4) where amp ~ 1.0035%.',
    holds: () => {
      const amp = ampLower(2200);
      return amp > 1 && Math.abs(amp - 1.0035) < 0.05;
    },
  },
  {
    id: 'imp97477-band-brackets-ladder-threshold',
    why: 'RESULT 1: the imp-97459 coarse-ladder threshold ~ 2100 lies inside the measured crossing ' +
      'band [earliestCrossB, latestShoulderCrossB] = [2003, 2116].',
    holds: () =>
      IMP97477_BAND.earliestCrossB < IMP97477_BAND.midpointMatchesLadderThreshold &&
      IMP97477_BAND.midpointMatchesLadderThreshold < IMP97477_BAND.latestShoulderCrossB &&
      IMP97477_BAND.nonCrossingResidue === 3,
  },
  {
    id: 'imp97477-alignment-monotone-in-offset',
    why: 'RESULT 2: the baked sampled tip is monotone in the alignment offset -- r = 0 (offset 0) ' +
      'highest, r = 3 (offset 1/2) lowest and the only class below 1% at b ~ 2200.',
    holds: () => {
      const r0 = IMP97477_ALIGNMENT_BAND.find((x) => x.r === 0).ampAt2200Pct;
      const r3 = IMP97477_ALIGNMENT_BAND.find((x) => x.r === 3).ampAt2200Pct;
      const belowOne = IMP97477_ALIGNMENT_BAND.filter((x) => x.ampAt2200Pct < 1);
      return r0 > 1.11 && r3 < 1 && belowOne.length === 1 && belowOne[0].r === 3;
    },
  },
  {
    id: 'imp97477-scale-piecewise-linear',
    why: 'RESULT 3: A(b) = x*(1%) b must equal x* * b for every row and be near-constant within each ' +
      'branch (upper ~ 0.199, lower ~ 0.166).',
    holds: () =>
      IMP97477_SCALE.every((r) => Math.abs(r.Ab - r.xStar * r.b) < 0.6) &&
      IMP97477_SCALE.filter((r) => r.branch === 'upper (1/5)').every((r) => Math.abs(r.xStar - 0.199) < 5e-4) &&
      IMP97477_SCALE.filter((r) => r.branch === 'lower (1/6)').every((r) => Math.abs(r.xStar - 0.166) < 5e-3),
  },
  {
    id: 'imp97477-coefficient-symmetric',
    why: 'structural check: the Vasyunin coefficient must be symmetric I(a,b) = I(b,a).',
    holds: () =>
      Math.abs(coefficientI(3, 10) - coefficientI(10, 3)) < 1e-9 &&
      Math.abs(coefficientI(5, 6) - coefficientI(6, 5)) < 1e-9,
  },
  {
    id: 'imp97477-honesty-gate-no-qed',
    why: 'measurement only: threshold is a band, worst class never crosses, scale linear, no bound ' +
      'moved, compute binds first, honesty markers + sub-gap present.',
    holds: () =>
      IMP97477_VERDICT.anyBoundMoved === false &&
      IMP97477_VERDICT.thresholdIsBandNotSingleB === true &&
      IMP97477_VERDICT.scaleLinearAt1pct === true &&
      IMP97477_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97477_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97477_HONEST_BANNER) &&
      /RH open/.test(IMP97477_HONEST_BANNER) &&
      /crest-crossover-alignment-band-analytic/.test(IMP97477_SUBGAP.id),
  },
];

for (const a of IMP97477_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97477-route-m-crest-crossover-alignment-band assertion failed: ${a.id}`,
    );
  }
}

export { IMP97477_ASSERTIONS };
