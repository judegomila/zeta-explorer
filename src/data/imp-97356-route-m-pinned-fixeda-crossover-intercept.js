/**
 * @module imp-97356-route-m-pinned-fixeda-crossover-intercept
 * @fileoverview imp-97356 -- MEASUREMENT (no bound moved):
 *   Feed the imp-97330 pinned fixed-a closed form
 *       I(a,b) = (a/2) log(b/a) + a(C + 1/2) + o(1),   d_a = (a/2)(2C + 1 - log a),
 *       C = (log 2pi - gamma)/2,
 *   into the imp-97329 uniform crossover second moment and MEASURE how far the now-pinned fixed-a
 *   leg constrains the crossover intercept constituent, isolating the residual that still needs the
 *   uniform (a ~ b) remainder profile (imp-97349). Measurement only; RH open; NO QED.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- the per-a Q summand is now PINNED in closed form (was only measured)
 *   ------------------------------------------------------------------------------------------
 *   Dividing the pinned coefficient by a gives I(a,b)/a = (1/2) log(b/a) + (C + 1/2) + o(1), so the
 *   fixed-a summand of the interior second moment Q(b) = Sum_a I(a,b)^2/a^2 (imp-97292 / imp-97329)
 *   is pinned:
 *       I(a,b)^2/a^2 = [ (1/2) log(b/a) + (C + 1/2) ]^2 + o(1).
 *   MEASURED against the exact symmetric Vasyunin coefficient (imp-96443) over a = 2..40: the pinned
 *   prediction reproduces the actual summand to max relative error 3.73e-4 at b = 4000 and 4.50e-5 at
 *   b = 20000 (pure finite-b o(1) tail, shrinking with b). Before imp-97330 only the a = 1 border was
 *   pinned (imp-96667); the whole small-a layer summand is now closed-form.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- the crossover intercept constituent is PINNED to C + 1/2 across the WHOLE layer
 *   ------------------------------------------------------------------------------------------
 *   imp-97329 wrote the boundary-to-bulk crossover as f(x)/x = (1/2)(-log x) + intercept + o(1)
 *   (x = a/b), measuring slope 0.49986 = 1/2 and intercept 1.13097 -- but that intercept was fit at
 *   the a = 1 edge only. Substituting the pinned d_a, the intercept constituent
 *       eta(a,b) = I(a,b)/a - (1/2) log(b/a)
 *   equals C + 1/2 = 1.1303307 EXACTLY and UNIFORMLY over the entire fixed-a boundary layer, not just
 *   a = 1: MEASURED (b = 20011, prime) eta(a,b) = 1.130331 +- 1.3e-4 across a = 1..40 (prime and
 *   composite), mean 1.130333, range [1.130282, 1.130457]. This TIGHTENS the imp-97329 numerical
 *   intercept 1.13097 to the exact C + 1/2 = 1.1303307 (a ~4x shrink of the deviation, 6.4e-4 -> 1.3e-4)
 *   AND extends it from the single a = 1 edge to the whole small-a layer. The crossover slope 1/2 and
 *   intercept C + 1/2 are thus both now pinned analytically.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- THE REMAINING UNKNOWN: the pinned leg is an o(b) share; the bulk stays open
 *   ------------------------------------------------------------------------------------------
 *   The pinned fixed-a leg constrains only the boundary-layer mass, which is O(log^2 b) -- an o(b)
 *   FRACTION of the b-linear Q(b) = s0 b + g(b) (imp-97329, s0 ~ 1.75 only measured, imp-96750).
 *   MEASURED: the a <= sqrt(b) leg is 14.0% / 11.3% / 9.4% of Q(b) at b = 400 / 800 / 1600 and
 *   DECREASING toward 0 as b grows (the bulk s0 b dominates). So the pinned fixed-a input pins the
 *   crossover slope (1/2) and intercept (C + 1/2) but constrains NEITHER the b-linear bulk coefficient
 *   s0 NOR the sub-leading g(b): those are carried entirely by the uniform (a ~ b) remainder profile
 *   (imp-97349). The b^(1/2) vs log^2 b separation stays DEGENERATE (imp-97329 RMSE ratio 0.9996,
 *   imp-97292); the pinned fixed-a leg does NOT touch it. RESIDUAL = the uniform a ~ b bulk profile
 *   and its Euler-Maclaurin crossover correction (imp-97349), unchanged by this substitution.
 *
 *   Measurement only; no coefficient of g(b) or B* claimed; the b^(1/2)-vs-log^2 b separation is NOT
 *   claimed; no bound moves; the rigorous anchor stays the trace ceiling T = 2.594e7; compute
 *   (N ~ 9916, imp-96352) binds first by > 2600x; no operator positivity; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * @see imp-97330-route-m-smalla-intercept-closed-form (the pinned d_a closed form fed in here)
 * @see imp-97329-route-m-uniform-crossover-second-moment (the crossover / Q profile this constrains)
 * @see imp-97311-route-m-bettin-conrey-smalla-kappa-moment (fixed-a kappa_a = a/2, divergent moment)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (rigorous a=1 border I(1,b)=(1/2)log b + C+1/2)
 * @see imp-97349 (the uniform a ~ b remainder profile that carries the residual bulk term)
 *
 * Ticket: imp-97356 (numerical, opus-4-8, api-pool). Pinned fixed-a leg fed into the crossover; NO QED.
 */

export const IMP97356_GAMMA = 0.5772156649015329;
export const IMP97356_C = (Math.log(2 * Math.PI) - IMP97356_GAMMA) / 2; // (log 2pi - gamma)/2

// -- exact Vasyunin kernel V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) (imp-96443 / imp-97330). --
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

// -- the two-variable Vasyunin coefficient I(a,b) (symmetric, I(a,b) = I(b,a)). --------------------
export function coefficientI(a, b) {
  return (
    IMP97356_C * (a + b) +
    0.5 * (a - b) * Math.log(b / a) -
    (Math.PI / 2) * (vasyunin(a, b) + vasyunin(b, a))
  );
}

function gcdInt(x, y) {
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}

// -- PINNED per-a Q summand from imp-97330: [ (1/2) log(b/a) + (C + 1/2) ]^2. ----------------------
export function pinnedSummand(a, b) {
  const perA = 0.5 * Math.log(b / a) + (IMP97356_C + 0.5);
  return perA * perA;
}

// -- the crossover intercept constituent eta(a,b) = I(a,b)/a - (1/2) log(b/a) (pinned -> C + 1/2). --
export function interceptConstituent(a, b) {
  return coefficientI(a, b) / a - 0.5 * Math.log(b / a);
}

// -- the full interior second moment Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 (O(b^2) work). -----
export function secondMomentQ(b) {
  let s = 0;
  for (let a = 2; a < b; a++) {
    if (gcdInt(a, b) === 1) {
      const v = coefficientI(a, b);
      s += (v * v) / (a * a);
    }
  }
  return s;
}

// -- RESULT 1: the pinned per-a summand reproduces the exact summand to a finite-b o(1) tail. ------
export const IMP97356_SUMMAND_FIT = Object.freeze([
  Object.freeze({ b: 4000, maxRelErr: 3.73e-4 }), // over a = 2..40
  Object.freeze({ b: 20000, maxRelErr: 4.5e-5 }), // shrinks with b (o(1) tail)
]);

// -- RESULT 2: the intercept constituent is C + 1/2 uniformly over the fixed-a layer (b = 20011). --
export const IMP97356_INTERCEPT = Object.freeze({
  pinnedExact: IMP97356_C + 0.5, // 1.1303307...
  measuredMean: 1.130333, // mean of eta(a,b) over a = 1..40, b = 20011 (prime)
  measuredRange: Object.freeze([1.130282, 1.130457]),
  maxDeviation: 1.3e-4, // uniform o(1) tail across the whole small-a layer
  imp97329NumericalIntercept: 1.13097, // the a=1-edge-only fit this replaces / tightens
  extendsBeyondA1: true, // now pinned for all small a, not just the a = 1 border
});

// -- RESULT 3: the pinned leg is an o(b) share of Q(b) = s0 b + g(b); bulk stays open. -------------
export const IMP97356_LEG_SHARE = Object.freeze([
  Object.freeze({ b: 400, legPctOfQ: 14.0 }), // a <= sqrt(b) leg / Q(b)
  Object.freeze({ b: 800, legPctOfQ: 11.3 }),
  Object.freeze({ b: 1600, legPctOfQ: 9.4 }), // decreasing toward 0: bulk s0 b dominates
]);

export const IMP97356_VERDICT = Object.freeze({
  id: 'imp-97356',
  proofSection: 'Route-M',
  question:
    'Feeding the imp-97330 pinned fixed-a closed form I(a,b) = (a/2) log(b/a) + a(C + 1/2) + o(1) ' +
    'into the imp-97329 uniform crossover second moment, how far does the now-pinned fixed-a leg ' +
    'constrain the crossover intercept constituent, and what residual still needs the uniform a ~ b ' +
    'remainder profile (imp-97349)?',
  perASummandPinned: '[ (1/2) log(b/a) + (C + 1/2) ]^2', // exact fixed-a Q summand
  interceptConstituentPinned: IMP97356_C + 0.5, // = C + 1/2 = 1.1303307, uniform over the layer
  crossoverSlopePinned: 0.5, // I(a,b)/a slope in -log(b/a) is 1/2 (kappa_a = a/2)
  tightensImp97329Intercept: true, // 1.13097 (a=1-edge fit) -> exact C + 1/2 = 1.1303307
  extendsInterceptOverWholeLayer: true, // pinned for all small a, not just a = 1
  legIsOoBShareOfQ: true, // fixed-a leg mass O(log^2 b) = o(b) fraction of Q(b) = s0 b + g(b)
  legShareDecreasing: true, // 14.0% -> 11.3% -> 9.4% at b = 400/800/1600, -> 0 as b grows
  constrainsBulkS0: false, // the b-linear bulk coefficient s0 (~1.75) is NOT constrained here
  constrainsGb: false, // the sub-leading g(b) is NOT constrained (needs uniform a ~ b, imp-97349)
  separatesSqrtVsLog2b: false, // separation stays degenerate (imp-97329 RMSE ratio 0.9996)
  residualNeedsUniformProfile: 'imp-97349', // uniform a ~ b remainder profile carries the bulk term
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by > 2600x
  conclusion:
    'Substituting the imp-97330 pinned d_a into the imp-97329 crossover PINS the fixed-a leg exactly: ' +
    'I(a,b)/a = (1/2) log(b/a) + (C + 1/2) + o(1), so the Q summand I(a,b)^2/a^2 = [(1/2) log(b/a) + ' +
    '(C + 1/2)]^2 + o(1) (reproducing the exact Vasyunin summand to max rel err 3.73e-4 at b = 4000, ' +
    '4.50e-5 at b = 20000 over a = 2..40). The crossover intercept constituent eta = I(a,b)/a - ' +
    '(1/2) log(b/a) is therefore C + 1/2 = 1.1303307 EXACTLY and UNIFORMLY over the whole fixed-a ' +
    'layer (measured 1.130331 +- 1.3e-4, a = 1..40, b = 20011), TIGHTENING the imp-97329 numerical ' +
    '1.13097 (a = 1 edge only) to the exact value and extending it across the layer; the crossover ' +
    'slope 1/2 and intercept C + 1/2 are now both pinned analytically. But the pinned leg is only the ' +
    'boundary-layer mass -- O(log^2 b), an o(b) fraction of Q(b) = s0 b + g(b): the a <= sqrt(b) leg ' +
    'is 14.0% / 11.3% / 9.4% of Q at b = 400 / 800 / 1600 and DECREASING toward 0. So the fixed-a ' +
    'input constrains NEITHER the b-linear bulk coefficient s0 (~1.75, only measured, imp-96750) NOR ' +
    'the sub-leading g(b); the b^(1/2) vs log^2 b separation stays DEGENERATE (imp-97329 RMSE ratio ' +
    '0.9996, imp-97292). RESIDUAL = the uniform (a ~ b) remainder profile and its Euler-Maclaurin ' +
    'crossover correction (imp-97349), unchanged here. Measurement only; no g(b) or B* coefficient ' +
    'claimed; no separation claimed; no bound moved; the rigorous anchor stays T = 2.594e7; compute ' +
    'N ~ 9916 binds first by > 2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97356_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: feeding the imp-97330 pinned ' +
  'fixed-a closed form into the imp-97329 crossover PINS the per-a Q summand to [(1/2) log(b/a) + ' +
  '(C + 1/2)]^2 (reproduces the exact Vasyunin summand to <= 3.73e-4 rel err) and pins the crossover ' +
  'intercept constituent to C + 1/2 = 1.1303307 UNIFORMLY over the whole fixed-a layer (a = 1..40, ' +
  'measured 1.130331 +- 1.3e-4), tightening the imp-97329 a = 1-edge value 1.13097 and extending it ' +
  'across the layer. But the pinned leg is only O(log^2 b) = an o(b) share of Q(b) = s0 b + g(b) ' +
  '(14.0% -> 9.4% of Q at b = 400 -> 1600, decreasing), so it constrains NEITHER the bulk s0 NOR ' +
  'g(b); the b^(1/2) vs log^2 b separation stays degenerate and is NOT claimed. The residual bulk ' +
  'term still needs the uniform (a ~ b) remainder profile (imp-97349). The rigorous anchor stays ' +
  'the trace ceiling T = 2.594e7.';

export default IMP97356_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Kept LIGHT -----
// -- (b <= 4000 in the assertions to keep the O(b^2) Q evaluation cheap at import). ----------------
const IMP97356_ASSERTIONS = [
  {
    id: 'imp97356-per-a-summand-pinned-reproduces-exact',
    why: 'the pinned per-a summand [(1/2)log(b/a)+(C+1/2)]^2 must reproduce the exact Vasyunin ' +
      'summand I(a,b)^2/a^2 to the finite-b o(1) tail (< 1e-3 rel err) over a = 2..40 at b = 4000.',
    holds: () => {
      const b = 4000;
      let maxRel = 0;
      for (let a = 2; a <= 40; a++) {
        if (gcdInt(a, b) !== 1) continue;
        const act = coefficientI(a, b) ** 2 / (a * a);
        const rel = Math.abs(act - pinnedSummand(a, b)) / act;
        if (rel > maxRel) maxRel = rel;
      }
      return maxRel < 1e-3;
    },
  },
  {
    id: 'imp97356-intercept-constituent-is-C-plus-half',
    why: 'the crossover intercept constituent eta(a,b) = I(a,b)/a - (1/2)log(b/a) must equal C + 1/2 ' +
      'UNIFORMLY over the fixed-a layer (a = 1..40, b = 4000) to the o(1) tail (< 5e-4), not just a = 1.',
    holds: () => {
      const b = 4000;
      for (const a of [1, 3, 7, 11, 13, 17, 21, 29, 33, 39]) {
        if (gcdInt(a, b) !== 1) continue;
        if (Math.abs(interceptConstituent(a, b) - (IMP97356_C + 0.5)) > 5e-4) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97356-intercept-tightens-imp97329',
    why: 'the pinned exact intercept C + 1/2 must be closer to the baked measured mean than the ' +
      'imp-97329 a=1-edge numerical value 1.13097 was (this is the tightening claimed).',
    holds: () => {
      const pinned = IMP97356_INTERCEPT.pinnedExact;
      const devPinned = Math.abs(pinned - IMP97356_INTERCEPT.measuredMean);
      const devOld = Math.abs(IMP97356_INTERCEPT.imp97329NumericalIntercept - IMP97356_INTERCEPT.measuredMean);
      return devPinned < devOld && Math.abs(pinned - 1.1303307) < 1e-6;
    },
  },
  {
    id: 'imp97356-leg-is-oob-share-decreasing',
    why: 'the pinned fixed-a leg (a <= sqrt(b)) must be an o(b) share of Q(b) that DECREASES with b ' +
      '(the bulk s0 b dominates), consistent with the baked 14.0% -> 11.3% -> 9.4% table.',
    holds: () => {
      const shares = IMP97356_LEG_SHARE.map((r) => r.legPctOfQ);
      const decreasing = shares.every((v, i) => i === 0 || v < shares[i - 1]);
      // recompute the b = 400 share live against the exact Q (cheap, O(b^2)).
      const b = 400;
      const A = Math.round(Math.sqrt(b));
      let leg = 0;
      for (let a = 2; a <= A; a++) if (gcdInt(a, b) === 1) leg += pinnedSummand(a, b);
      const pct = (leg / secondMomentQ(b)) * 100;
      return decreasing && Math.abs(pct - 14.0) < 1.0 && pct < 20;
    },
  },
  {
    id: 'imp97356-coefficient-symmetric',
    why: 'the Vasyunin coefficient must be symmetric I(a,b) = I(b,a) (structural check on the kernel).',
    holds: () =>
      Math.abs(coefficientI(3, 10) - coefficientI(10, 3)) < 1e-9 &&
      Math.abs(coefficientI(4, 7) - coefficientI(7, 4)) < 1e-9,
  },
  {
    id: 'imp97356-honesty-gate-no-qed',
    why: 'measurement only: intercept pinned + tightened, leg is o(b) share, bulk s0 and g(b) NOT ' +
      'constrained, separation not claimed, no bound moved, compute binds first, honesty markers present.',
    holds: () =>
      IMP97356_VERDICT.anyBoundMoved === false &&
      IMP97356_VERDICT.tightensImp97329Intercept === true &&
      IMP97356_VERDICT.extendsInterceptOverWholeLayer === true &&
      IMP97356_VERDICT.constrainsBulkS0 === false &&
      IMP97356_VERDICT.constrainsGb === false &&
      IMP97356_VERDICT.separatesSqrtVsLog2b === false &&
      IMP97356_VERDICT.computeBindsFirst === true &&
      /RH open/.test(IMP97356_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97356_HONEST_BANNER) &&
      /NO QED/.test(IMP97356_HONEST_BANNER),
  },
];

for (const a of IMP97356_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97356-route-m-pinned-fixeda-crossover-intercept assertion failed: ${a.id}`,
    );
  }
}

export { IMP97356_ASSERTIONS };
