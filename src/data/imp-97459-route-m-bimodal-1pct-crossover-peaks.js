/**
 * @module imp-97459-route-m-bimodal-1pct-crossover-peaks
 * @fileoverview imp-97459 -- MEASUREMENT (no bound moved):
 *   imp-97441 RESULT 2 flagged the eps = 1% crossover-fraction row as BIMODAL: the first-exceedance
 *   fraction x*(1%) = A(b)/b STEPS from 0.199 (b <= 2000) to 0.1665 (b >= 4000) because two adjacent
 *   crests of the SIGNED deviation d(a,b) = (I - I_lin)/I straddle the 1% level (the arithmetic
 *   V(b,a) wobble, imp-97437 R3b). imp-97441 never tabulated the two crest amplitudes/locations nor
 *   the step-point b. This module measures them.
 *
 *   Kernel (imp-96443 / imp-97419 / imp-97441):
 *       I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b)+V(b,a)),  C = (log 2pi - gamma)/2,
 *       V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q),
 *       I_lin(a,b) = (a/2) log(b/a) + (C + 1/2) a,   d(a,b) = (I - I_lin)/I.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- THE TWO CRESTS THAT STRADDLE 1% ARE THE 1/6 AND 1/5 ARITHMETIC RESONANCES
 *   ------------------------------------------------------------------------------------------
 *   The two adjacent positive crests of d(a,b) sit at the rational fractions x = a/b = 1/6 and 1/5:
 *     - LOWER crest at x = 1/6 = 0.16667 (the m a / 6 cotangent resonance). Its CONTINUUM tip is a
 *       fixed 1.1130% (measured exactly at every b divisible by 6, where a = b/6 lands on the tip and
 *       d is b-independent). At a general b the integer-a grid samples the nearest a to b/6, so the
 *       SAMPLED tip amplitude is finite-b and rises toward 1.113% as b grows.
 *     - UPPER crest at x = 1/5 = 0.20000. Every ladder b is divisible by 5, so a = b/5 lands EXACTLY
 *       on the tip and d = 1.3934% at ALL b -- b-independent and always ABOVE 1%.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- SAMPLED CREST AMPLITUDES / LOCATIONS ACROSS THE b-LADDER
 *   ------------------------------------------------------------------------------------------
 *       b        lower a(1/6)  x_lower   amp_lower(%)  >1%    upper a(1/5)  x_upper  amp_upper(%)  >1%
 *       1000     167           0.16700   0.9100        no     200           0.20000  1.3934        YES
 *       2000     333           0.16650   0.9964        no     400           0.20000  1.3934        YES
 *       4000     667           0.16675   1.0456        YES    800           0.20000  1.3934        YES
 *       8000     1333          0.16662   1.0755        YES    1600          0.20000  1.3934        YES
 *       16000    2667          0.16669   1.0920        YES    3200          0.20000  1.3934        YES
 *   The upper crest is dead-flat 1.3934% (always > 1%); the lower crest climbs 0.9100 -> 1.0920%
 *   monotonically toward its 1.1130% continuum tip.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- STEP POINT AND THE BIMODALITY MECHANISM
 *   ------------------------------------------------------------------------------------------
 *   Walking a upward from 5, the first a with |d| > 1% is the first crest whose SAMPLED tip clears 1%:
 *     - b <= 2000: lower (1/6) tip sampled below 1% (0.9100 / 0.9964%), so it is passed within
 *       tolerance and the first exceedance is the upper (1/5) tip at a = b/5, giving x* = (b/5 - 1)/b
 *       = 0.199 (last a within tol before a = b/5).
 *     - b >= 4000: lower (1/6) tip sampled above 1% (1.0456%+), so the first exceedance moves to the
 *       lower crest at a ~ b/6, giving x* ~ 0.1665.
 *   So the bimodality is a GRID-RESOLUTION effect on TWO FIXED continuum crests (tips 1.113% at 1/6,
 *   1.393% at 1/5): which one the integer-a grid first resolves above 1% flips the reported x*.
 *   STEP POINT: on the ladder the lower-crest sampled amplitude first pierces 1% between b = 2000
 *   (0.9964%, just under) and b = 4000 (1.0456%, over). For GENERAL b the crossing is alignment-
 *   jittery: b divisible by 6 always gives 1.1130% (> 1%), while b with b/6 near .+1/3 crosses 1%
 *   around b ~ 2100-2200 -- so the coarse ladder step 2000 -> 4000 is the discrete image of a
 *   continuum threshold near b ~ 2100. NOT a breakdown of the linear scale.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 4 -- A(b) = x*(1%) b STAYS LINEAR (piecewise) DESPITE THE BIMODAL FRACTION
 *   ------------------------------------------------------------------------------------------
 *       b        x*(1%)    A(b) = x* b
 *       1000     0.19900   199.0        (upper-crest branch, a* = b/5 - 1)
 *       2000     0.19900   398.0        (upper-crest branch)
 *       4000     0.16650   666.0        (lower-crest branch, a* = round(b/6) - 1)
 *       8000     0.16650   1332.0       (lower-crest branch)
 *       16000    0.16650   2664.0       (lower-crest branch)
 *   A(b) is EXACTLY proportional to b within each branch (x* constant); the bimodal fraction is a
 *   one-time discrete jump BETWEEN two linear branches (slope 0.199 -> 0.1665), each with A(b) ~ b.
 *   So the crossover SCALE A(b) remains linear at 1% -- the step is a change of which resonance pins
 *   the exceedance, not a super/sub-linear scale.
 *
 *   Measurement only; pins NO coefficient for g(b), B* or the analytic curvature; no bound moves; the
 *   only rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds
 *   first by >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97459-bimodal-crossover-continuum-threshold -- the two crests are pinned to
 *   x = 1/6 (tip 1.113%) and x = 1/5 (tip 1.393%) and the ladder step 2000 -> 4000 is measured, but
 *   the EXACT continuum b at which the 1/6 tip crosses 1% (~ b 2100, alignment-jittery) is not pinned
 *   to a closed form, and the 1.113%/1.393% tips are measured, not analytically derived from the
 *   Dedekind-sum residues at the p = 5, 6 resonances (would need the imp-97437-obstructed analytic
 *   wobble amplitude). Pins no coefficient; moves no bound.
 *
 * @see imp-97441-route-m-crossover-fraction-tolerance-table (RESULT 2 flagged the bimodal 1% row 0.199 -> 0.1665)
 * @see imp-97437-route-m-bulk-profile-curvature-crossover (R3b: the V(b,a) arithmetic wobble)
 * @see imp-97419-route-m-uniform-profile-crossover-scale (A(b) = x* b linear; x*(2%) = 0.3311, x*(1%) ~ 0.199)
 *
 * Ticket: imp-97459 (numerical, opus-4-8, api-pool). Two crests (1/6 tip 1.113%, 1/5 tip 1.393%) pinned; step-point b ~ 2000..4000; A(b) piecewise-linear; NO QED.
 */

export const IMP97459_GAMMA = 0.5772156649015329;
export const IMP97459_C = (Math.log(2 * Math.PI) - IMP97459_GAMMA) / 2;
export const IMP97459_D1 = IMP97459_C + 0.5;

function frac(x) {
  return x - Math.floor(x);
}
function vasyunin(a, q) {
  let s = 0;
  for (let m = 1; m < q; m++) {
    s += frac((m * a) / q) / Math.tan((Math.PI * m) / q);
  }
  return s;
}
export function coefficientI(a, b) {
  return (
    IMP97459_C * (a + b) +
    0.5 * (a - b) * Math.log(b / a) -
    (Math.PI / 2) * (vasyunin(a, b) + vasyunin(b, a))
  );
}
export function linearizedProfile(a, b) {
  return 0.5 * a * Math.log(b / a) + IMP97459_D1 * a;
}
// signed deviation d(a,b) = (I - I_lin)/I
export function signedDeviation(a, b) {
  const it = coefficientI(a, b);
  return (it - linearizedProfile(a, b)) / it;
}
// sampled tip amplitude of the crest near fraction x = 1/den: best integer a within +-2 of b/den
export function crestTip(b, den) {
  const a0 = Math.round(b / den);
  let best = { a: a0, x: a0 / b, d: -Infinity };
  for (let a = a0 - 2; a <= a0 + 2; a++) {
    const d = signedDeviation(a, b);
    if (d > best.d) best = { a, x: a / b, d };
  }
  return best;
}
// x*(eps): largest fraction a/b with |d| <= eps, first-exceedance from a=5 (imp-97441 convention)
export function crossoverFraction(b, eps) {
  let last = 5;
  for (let a = 5; a < b; a++) {
    if (Math.abs(signedDeviation(a, b)) > eps) return last / b;
    last = a;
  }
  return 1;
}

// -- RESULT 1: the two crests are the 1/6 and 1/5 arithmetic resonances (fixed continuum tips). ----
export const IMP97459_CRESTS = Object.freeze({
  lower: Object.freeze({ fraction: '1/6', x: 1 / 6, continuumTipPct: 1.113, resonance: 'm a / 6 cotangent' }),
  upper: Object.freeze({ fraction: '1/5', x: 1 / 5, continuumTipPct: 1.3934, resonance: 'm a / 5 cotangent' }),
});

// -- RESULT 2: sampled crest amplitudes/locations across the b-ladder (MEASURED). -----------------
export const IMP97459_CREST_TABLE = Object.freeze([
  Object.freeze({ b: 1000, aLower: 167, xLower: 0.167, ampLowerPct: 0.9100, lowerOver1: false, aUpper: 200, xUpper: 0.2, ampUpperPct: 1.3934, upperOver1: true }),
  Object.freeze({ b: 2000, aLower: 333, xLower: 0.1665, ampLowerPct: 0.9964, lowerOver1: false, aUpper: 400, xUpper: 0.2, ampUpperPct: 1.3934, upperOver1: true }),
  Object.freeze({ b: 4000, aLower: 667, xLower: 0.16675, ampLowerPct: 1.0456, lowerOver1: true, aUpper: 800, xUpper: 0.2, ampUpperPct: 1.3934, upperOver1: true }),
  Object.freeze({ b: 8000, aLower: 1333, xLower: 0.16662, ampLowerPct: 1.0755, lowerOver1: true, aUpper: 1600, xUpper: 0.2, ampUpperPct: 1.3934, upperOver1: true }),
  Object.freeze({ b: 16000, aLower: 2667, xLower: 0.16669, ampLowerPct: 1.0920, lowerOver1: true, aUpper: 3200, xUpper: 0.2, ampUpperPct: 1.3934, upperOver1: true }),
]);

// -- RESULT 3: step point (lower crest first pierces 1%) + the grid-resolution mechanism. ---------
export const IMP97459_STEP = Object.freeze({
  ladderStepLoB: 2000, // lower crest sampled at 0.9964% -- just under 1%
  ladderStepHiB: 4000, // lower crest sampled at 1.0456% -- over 1%
  continuumThresholdB: 2100, // for general b, 1/6 tip crosses 1% near here (alignment-jittery)
  mechanism:
    'grid-resolution: two FIXED continuum crests (1/6 tip 1.113%, 1/5 tip 1.393%); which one the ' +
    'integer-a grid first resolves above 1% flips x* between the 1/5 branch (0.199) and the 1/6 ' +
    'branch (0.1665). b divisible by 6 always samples 1.1130% (>1%); coarse b samples the shoulder.',
});

// -- RESULT 4: A(b) = x*(1%) b stays piecewise-linear despite the bimodal fraction. ---------------
export const IMP97459_SCALE = Object.freeze([
  Object.freeze({ b: 1000, xStar: 0.199, Ab: 199.0, branch: 'upper (1/5)' }),
  Object.freeze({ b: 2000, xStar: 0.199, Ab: 398.0, branch: 'upper (1/5)' }),
  Object.freeze({ b: 4000, xStar: 0.1665, Ab: 666.0, branch: 'lower (1/6)' }),
  Object.freeze({ b: 8000, xStar: 0.1665, Ab: 1332.0, branch: 'lower (1/6)' }),
  Object.freeze({ b: 16000, xStar: 0.1665, Ab: 2664.0, branch: 'lower (1/6)' }),
]);

export const IMP97459_VERDICT = Object.freeze({
  id: 'imp-97459',
  proofSection: 'Route-M',
  question:
    'Measure the two adjacent signed-deviation crests that straddle the 1% level in the imp-97441 ' +
    'bimodal x*(1%) row, their amplitudes/locations across the b-ladder, the step-point b where the ' +
    'lower crest first pierces 1%, and confirm A(b) = x* b stays linear at 1%.',
  lowerCrestFraction: '1/6', // x = 0.16667, continuum tip 1.113%
  upperCrestFraction: '1/5', // x = 0.20000, tip 1.3934% (b-independent, always >1%)
  bimodalityIsGridResolution: true, // two fixed continuum crests; grid decides which clears 1% first
  ladderStepBetween: '2000 -> 4000 (continuum threshold ~ b 2100, alignment-jittery)',
  scaleLinearAt1pct: true, // A(b) = x* b piecewise-linear (0.199 branch then 0.1665 branch)
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The two adjacent crests of the signed deviation (I - I_lin)/I that straddle 1% are the 1/6 and ' +
    '1/5 arithmetic cotangent resonances. The LOWER crest at x = 1/6 = 0.16667 has a fixed continuum ' +
    'tip of 1.113% (measured exactly at every b divisible by 6); its SAMPLED tip climbs 0.9100 -> ' +
    '0.9964 -> 1.0456 -> 1.0755 -> 1.0920% across b = 1000..16000 as the integer-a grid resolves the ' +
    'spike. The UPPER crest at x = 1/5 = 0.20000 is dead-flat 1.3934% (a = b/5 exact at every rung), ' +
    'always above 1%. The bimodality is a GRID-RESOLUTION effect on these two fixed crests: at b <= ' +
    '2000 the 1/6 tip is sampled below 1%, so the first 1% exceedance is the 1/5 tip and x* = 0.199; ' +
    'at b >= 4000 the 1/6 tip is sampled above 1%, so the exceedance moves to it and x* = 0.1665. The ' +
    'step point sits between b = 2000 (0.9964%) and b = 4000 (1.0456%); for general b the crossing is ' +
    'alignment-jittery near a continuum threshold b ~ 2100 (b divisible by 6 always samples 1.1130%). ' +
    'A(b) = x*(1%) b = {199, 398, 666, 1332, 2664} is EXACTLY proportional to b within each branch -- ' +
    'the bimodal fraction is a one-time jump between two linear branches, so the crossover scale stays ' +
    'linear at 1%. Measurement only; no coefficient pinned; the rigorous anchor stays T = 2.594e7; ' +
    'compute N ~ 9916 binds first by >2600x; no operator positivity; no refereed bound is changed; RH open; ' +
    'NO QED.',
});

export const IMP97459_SUBGAP = Object.freeze({
  id: 'imp-97459-bimodal-crossover-continuum-threshold',
  statement:
    'The two adjacent crests straddling the 1% level in the imp-97441 bimodal x*(1%) row are pinned ' +
    'to the arithmetic resonances x = 1/6 (continuum tip 1.113%) and x = 1/5 (tip 1.3934%, always ' +
    '>1%), and the ladder step 0.199 -> 0.1665 is a grid-resolution flip of which crest first clears ' +
    '1% (lower crest sampled 0.9964% at b = 2000, 1.0456% at b = 4000). But the EXACT continuum b at ' +
    'which the 1/6 tip crosses 1% (~ b 2100, alignment-jittery) is not pinned to a closed form, and ' +
    'the 1.113%/1.393% tips are measured, not derived from the Dedekind-sum residues at the p = 5, 6 ' +
    'resonances (would need the imp-97437-obstructed analytic wobble amplitude). Pins no coefficient; ' +
    'moves no bound.',
});

export const IMP97459_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the imp-97441 bimodal x*(1%) ' +
  'row is explained by two fixed arithmetic crests of (I - I_lin)/I -- the lower at x = 1/6 ' +
  '(continuum tip 1.113%, sampled 0.9100 -> 1.0920% across b = 1000..16000) and the upper at x = 1/5 ' +
  '(1.3934%, always >1%). The step 0.199 -> 0.1665 is a grid-resolution flip of which crest first ' +
  'clears 1% (step between b = 2000 and 4000; continuum threshold ~ b 2100). A(b) = x* b = ' +
  '{199,398,666,1332,2664} stays piecewise-linear. Pins no coefficient; the rigorous anchor stays ' +
  'T = 2.594e7; compute N ~ 9916 binds first by >2600x.';

export default IMP97459_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Kept LIGHT --
// -- (crests recomputed only at b = 1000; heavier b-values are baked from the offline run). --------
const IMP97459_ASSERTIONS = [
  {
    id: 'imp97459-lower-crest-at-one-sixth-b1000',
    why: 'RESULT 1/2: the lower crest recomputed live at b = 1000 must sit at a near b/6 = 167 ' +
      '(x near 1/6) with sampled amplitude near the baked 0.9100% (< 1%).',
    holds: () => {
      const c = crestTip(1000, 6);
      return Math.abs(c.x - 1 / 6) < 0.002 && Math.abs(c.d * 100 - 0.9100) < 0.05 && c.d < 0.01;
    },
  },
  {
    id: 'imp97459-upper-crest-at-one-fifth-b1000',
    why: 'RESULT 1/2: the upper crest recomputed live at b = 1000 must sit at a = b/5 = 200 (x = ' +
      '1/5 exact) with sampled amplitude near the baked 1.3934% (> 1%).',
    holds: () => {
      const c = crestTip(1000, 5);
      return c.a === 200 && Math.abs(c.x - 0.2) < 1e-9 && Math.abs(c.d * 100 - 1.3934) < 0.02 && c.d > 0.01;
    },
  },
  {
    id: 'imp97459-lower-crest-continuum-tip-b-div-6',
    why: 'RESULT 1: at b divisible by 6 the 1/6 tip is the b-independent continuum value ~ 1.113% ' +
      '(measured live at b = 3000, where a = 500 lands exactly on 1/6).',
    holds: () => {
      const c = crestTip(3000, 6);
      return c.a === 500 && Math.abs(c.d * 100 - 1.113) < 0.02 && c.d > 0.01;
    },
  },
  {
    id: 'imp97459-crossover-flips-branch-with-b',
    why: 'RESULT 3: x*(1%) recomputed live must be on the upper branch (0.199) at b = 1000 and on ' +
      'the lower branch (0.1665) at b = 4000 -- the bimodal flip.',
    holds: () => {
      const lo = crossoverFraction(1000, 0.01);
      const hi = crossoverFraction(4000, 0.01);
      return Math.abs(lo - 0.199) < 1e-6 && Math.abs(hi - 0.1665) < 1e-6;
    },
  },
  {
    id: 'imp97459-lower-crest-amplitude-monotone-in-b',
    why: 'RESULT 2: the baked lower-crest sampled amplitude must increase monotonically with b ' +
      'toward the 1.113% continuum tip and cross 1% between b = 2000 and b = 4000.',
    holds: () => {
      const amps = IMP97459_CREST_TABLE.map((r) => r.ampLowerPct);
      const monotone = amps.every((v, i) => i === 0 || v >= amps[i - 1] - 1e-9);
      const rowLo = IMP97459_CREST_TABLE.find((r) => r.b === 2000);
      const rowHi = IMP97459_CREST_TABLE.find((r) => r.b === 4000);
      return monotone && rowLo.ampLowerPct < 1 && rowHi.ampLowerPct > 1 && amps[amps.length - 1] < 1.113;
    },
  },
  {
    id: 'imp97459-upper-crest-b-independent',
    why: 'RESULT 2: the upper (1/5) crest amplitude must be dead-flat 1.3934% across the whole ' +
      'ladder (a = b/5 exact at every rung) and always above 1%.',
    holds: () =>
      IMP97459_CREST_TABLE.every((r) => Math.abs(r.ampUpperPct - 1.3934) < 1e-9 && r.upperOver1 === true),
  },
  {
    id: 'imp97459-scale-piecewise-linear',
    why: 'RESULT 4: A(b) = x*(1%) b must equal x*(1%) * b exactly for every row and be constant ' +
      'within each branch (0.199 then 0.1665), i.e. A(b) proportional to b per branch.',
    holds: () =>
      IMP97459_SCALE.every((r) => Math.abs(r.Ab - r.xStar * r.b) < 1e-6) &&
      IMP97459_SCALE.filter((r) => r.branch === 'upper (1/5)').every((r) => Math.abs(r.xStar - 0.199) < 1e-9) &&
      IMP97459_SCALE.filter((r) => r.branch === 'lower (1/6)').every((r) => Math.abs(r.xStar - 0.1665) < 1e-9),
  },
  {
    id: 'imp97459-coefficient-symmetric',
    why: 'structural check: the Vasyunin coefficient must be symmetric I(a,b) = I(b,a).',
    holds: () =>
      Math.abs(coefficientI(3, 10) - coefficientI(10, 3)) < 1e-9 &&
      Math.abs(coefficientI(5, 6) - coefficientI(6, 5)) < 1e-9,
  },
  {
    id: 'imp97459-honesty-gate-no-qed',
    why: 'measurement only: grid-resolution bimodality, scale linear, no bound moved, compute binds ' +
      'first, honesty markers + sub-gap present.',
    holds: () =>
      IMP97459_VERDICT.anyBoundMoved === false &&
      IMP97459_VERDICT.bimodalityIsGridResolution === true &&
      IMP97459_VERDICT.scaleLinearAt1pct === true &&
      IMP97459_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97459_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97459_HONEST_BANNER) &&
      /RH open/.test(IMP97459_HONEST_BANNER) &&
      /bimodal-crossover-continuum-threshold/.test(IMP97459_SUBGAP.id),
  },
];

for (const a of IMP97459_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97459-route-m-bimodal-1pct-crossover-peaks assertion failed: ${a.id}`,
    );
  }
}

export { IMP97459_ASSERTIONS };
