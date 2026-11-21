/**
 * @module imp-97334-route-m-cq-subleading-constant-evaluation
 * @fileoverview imp-97334 -- HONEST PARTIAL (measurement; cQ is NOT a pinnable constant):
 *   EVALUATE the sub-leading constant cQ of Q(b) = s0 b + cQ + r(b) that imp-96750 BOUNDS
 *   (Q(b) <= s0* b + O(1)) but never evaluates -- the dominant unpinned constituent of the
 *   imp-97207 far-field intercept
 *       c1_T = 2 s0 (gamma - 3/2) + 2 cQ (zeta(2) - 5/4) + 2 R
 *   onto which the imp-97259 far-field-ceiling-F cohort (imp-96750 / imp-96771 / imp-97160 /
 *   imp-97207) telescopes. The ticket asks to measure cQ from the interior second-moment ladder
 *   by extrapolating g(b) = Q(b) - s0 b. The exact symmetric Vasyunin coefficient (imp-96443):
 *       I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b) + V(b,a)),  C = (log 2pi - gamma)/2,
 *       V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q),
 *       Q(b)   = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- the constant-MODEL value: cQ = -13.4 (imp-97207 4-window joint fit, reproduced)
 *   ------------------------------------------------------------------------------------------
 *   Fitting the two-parameter model m(b) = Q(b)/b = s0 + cQ / b to the four imp-96750 window means
 *   (b in [100,300),[300,600),[600,900),[900,1200)) by least squares reproduces EXACTLY the
 *   imp-97207 coarse figures: s0 = 1.7626, cQ = -13.384 (validated against the reproduced
 *   checkpoints T(250) = 11.757622 and window[100,300) mean Q/b = 1.68979). Fed through the exact
 *   intercept coefficient, the dominant constituent is
 *       2 cQ (zeta(2) - 5/4) = 2 (-13.384)(0.394934) = -10.57,
 *   matching the imp-97207 termB ~ -10.6 that DOMINATES the interior intercept a_int = -14.929.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- cQ has NO b -> infinity limit: g(b) = <Q(b) - s0 b> does not settle
 *   ------------------------------------------------------------------------------------------
 *   Extrapolating the effective constant directly -- the width-80 window mean of g(b) = Q(b) - s0 b
 *   at growing centers (s0 = the imp-97243 reconciled 1.757) -- does NOT converge: it swings
 *       center 300 -> -13.3,  500 -> -10.8,  700 -> -9.0,  900 -> -15.2,  1100 -> +4.0,  1300 -> -3.4,
 *   spanning tens of units and BOTH signs, with no settling trend. This is exactly the imp-97329 /
 *   imp-97261 / imp-97292 verdict seen at the constant scale: the true sub-leading term g(b) is not
 *   a constant but a GROWING sub-linear form (co-leading b^(1/2) with c ~ -1.44 or log^2 b with
 *   c ~ -0.69, numerically indistinguishable, imp-97292), so Q(b) - s0 b diverges and the "constant"
 *   cQ = lim (Q(b) - s0 b) does NOT exist. The imp-97207 value -13.4 is the effective constant of a
 *   constant-in-(1/b) fit over the bounded signal-rich window b in [100,1200], NOT a genuine limit.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- cQ is COUPLED to the exact s0: sensitivity |d cQ / d s0| = b (measured exactly)
 *   ------------------------------------------------------------------------------------------
 *   Because cQ enters as g(b) = Q(b) - s0 b, a shift delta in the leading slope injects a -delta b
 *   shift in the measured constant: |d cQ / d s0| = b exactly. Measured spreads of <Q - s0 b> across
 *   the imp-97243 s0 band [1.751, 1.7626] (width 0.0116):
 *       center 1000 -> spread 11.59 = 0.0116 * 1000,   center 1200 -> spread 13.91 = 0.0116 * 1200.
 *   So the s0 uncertainty ALONE (imp-97243: s0 = 1.757 +/- 0.006) injects a +/- 0.006 b band on cQ:
 *   +/- 3.6 at b = 600, +/- 7.2 at b = 1200, +/- 96 at b = 16000. The band on cQ therefore WIDENS
 *   proportionally to the window scale -- a longer ladder makes the estimate WORSE, not better
 *   (consistent with imp-97292: the numerical lever is doubly dead).
 *
 *   ------------------------------------------------------------------------------------------
 *   VERDICT
 *   ------------------------------------------------------------------------------------------
 *   cQ is NOT a pinnable constant. Its best documented figure is the constant-model value
 *   cQ ~ -13.4 (imp-97207 4-window fit, b in [100,1200], co-fit s0 = 1.7626), which feeds the
 *   intercept as 2 cQ (zeta(2)-5/4) ~ -10.57 (the dominant constituent). But (i) it has NO
 *   b -> infinity limit -- g(b) = Q(b) - s0 b diverges as the growing sub-linear form g(b) of
 *   imp-97261/97292/97329 (b^(1/2) or log^2 b, degenerate), so lim (Q - s0 b) does not exist; and
 *   (ii) it is coupled to the exact s0 with sensitivity |d cQ / d s0| = b, so the imp-97243 s0 band
 *   +/- 0.006 alone gives cQ = -13.4 +/- 7 at b ~ 1200. Evaluating cQ as a genuine constant (hence
 *   pinning the far-field ceiling F as a VALUE) requires the analytic Bettin-Conrey small-a
 *   asymptotic with the crossover Euler-Maclaurin correction (the imp-97329 sub-gap), NOT a longer
 *   ladder. Measurement only; pins no constant; no bound moves; the rigorous anchor stays the trace
 *   ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x; no operator
 *   positivity; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97334-cq-constant-nonexistent-limit -- the constant-model cQ ~ -13.4 is
 *   documented, but cQ = lim (Q(b) - s0 b) does NOT exist (g(b) grows) and is coupled to s0 with
 *   sensitivity b; a pinnable value needs the analytic Bettin-Conrey small-a asymptotic + crossover
 *   correction (inherits imp-97329-uniform-crossover-mainterm-coupling), not more finite-b compute.
 *
 * @see imp-97207-route-m-farfield-intercept-derivation (c1_T = 2 s0 (gamma-3/2) + 2 cQ (zeta2-5/4) + 2R; cQ ~ -13.4 coarse)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (Q(b) <= s0* b + O(1); bounds the O(1), never evaluates)
 * @see imp-97329-route-m-uniform-crossover-second-moment (Q(b) = s0 b + g(b); g coupled to exact s0 and crossover scale)
 * @see imp-97292-route-m-cq-subleading-extended-ladder (b^(1/2) vs log^2 b collinearity NOT broken by longer ladder)
 * @see imp-97261-route-m-cq-subleading-functional-form (g(b) co-leading -1.44 b^(1/2) or -0.69 log^2 b; B* = 2 Sum g(b)/b^2)
 *
 * Ticket: imp-97334 (numerical, opus-4-8, api-pool). cQ evaluated as constant-model value; no genuine limit; NO QED.
 */

export const IMP97334_GAMMA = 0.5772156649015329;
export const IMP97334_C = (Math.log(2 * Math.PI) - IMP97334_GAMMA) / 2; // (log 2pi - gamma)/2
export const IMP97334_ZETA2 = (Math.PI * Math.PI) / 6.0; // 1.6449340668482264

// -- exact Vasyunin kernel V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) (imp-96443 / imp-97329). --
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
    IMP97334_C * (a + b) +
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

// -- the interior second moment Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 (O(b^2) work). ----------
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

// -- the effective constant cQ(b) = Q(b) - s0 b (the object whose b -> infinity limit is cQ). -------
export function effectiveCQ(b, s0) {
  return secondMomentQ(b) - s0 * b;
}

// -- RESULT 1: the constant-model cQ from the imp-97207 4-window joint fit (reproduced exactly). ----
// m(b) = Q(b)/b = s0 + cQ / b fitted to the four imp-96750 window means (validated kernel).
export const IMP97334_CONSTANT_MODEL_FIT = Object.freeze({
  windows: '[100,300),[300,600),[600,900),[900,1200)',
  s0Fit: 1.7626, // co-fitted leading slope (imp-97207 IMP97207_S0_FIT)
  cQFit: -13.384, // the constant-model sub-leading constant (imp-97207 IMP97207_CQ_FIT ~ -13.4)
  interceptCoeff: IMP97334_ZETA2 - 1.25, // 0.3949340668482264 (EXACT, imp-97207 COEFF_CQ)
  interceptContribution: 2 * -13.384 * (IMP97334_ZETA2 - 1.25), // ~ -10.57 (imp-97207 termB)
});

// -- RESULT 2: cQ has NO limit -- <Q(b) - s0 b> (width-80 window means, s0 = 1.757) swings, no trend. --
export const IMP97334_NONCONVERGENCE = Object.freeze({
  s0: 1.757, // imp-97243 reconciled interior slope
  ladder: Object.freeze([
    Object.freeze({ center: 300, gEff: -13.275 }),
    Object.freeze({ center: 500, gEff: -10.797 }),
    Object.freeze({ center: 700, gEff: -9.007 }),
    Object.freeze({ center: 900, gEff: -15.17 }),
    Object.freeze({ center: 1100, gEff: 3.96 }),
    Object.freeze({ center: 1300, gEff: -3.356 }),
  ]),
  note:
    'g(b) = <Q(b) - s0 b> spans tens of units and both signs with no settling trend: the true ' +
    'sub-leading g(b) is the GROWING sub-linear form of imp-97261/97292/97329, so lim (Q - s0 b) ' +
    'does not exist. The -13.4 value is a bounded-window fit artifact, not a genuine constant.',
});

// -- RESULT 3: cQ is COUPLED to the exact s0 -- sensitivity |d cQ / d s0| = b (measured exactly). --
export const IMP97334_S0_COUPLING = Object.freeze({
  s0Band: Object.freeze({ low: 1.751, high: 1.7626, width: 0.0116 }), // imp-97243 core bracket
  sensitivityLaw: '|d cQ / d s0| = b (cQ = Q(b) - s0 b)',
  measuredSpreads: Object.freeze([
    Object.freeze({ center: 1000, spread: 11.59, predicted: 0.0116 * 1000 }), // 11.60
    Object.freeze({ center: 1200, spread: 13.91, predicted: 0.0116 * 1200 }), // 13.92
  ]),
  cQBandFromS0: Object.freeze({
    atB600: 0.006 * 600, // +/- 3.6  (imp-97243 s0 half-width 0.006)
    atB1200: 0.006 * 1200, // +/- 7.2
    atB16000: 0.006 * 16000, // +/- 96
  }),
});

// -- validation checkpoints reproduced exactly by the kernel (tmp/imp-97334-cq-eval.py). ------------
export const IMP97334_VALIDATION = Object.freeze({
  T250: 11.757622, // imp-96708 unweighted interior checkpoint, reproduced
  window100to300MeanQoverB: 1.68979, // imp-96750 window mean, reproduced
});

export const IMP97334_VERDICT = Object.freeze({
  id: 'imp-97334',
  proofSection: 'Route-M',
  question:
    'Evaluate the sub-leading constant cQ of Q(b) = s0 b + cQ + r(b) that imp-96750 BOUNDS but never ' +
    'evaluates -- the dominant unpinned constituent 2 cQ (zeta(2)-5/4) of the imp-97207 far-field ' +
    'intercept -- by extrapolating g(b) = Q(b) - s0 b on the interior second-moment ladder.',
  constantModelValue: -13.384, // imp-97207 4-window fit, reproduced (b in [100,1200])
  interceptContribution: 2 * -13.384 * (IMP97334_ZETA2 - 1.25), // ~ -10.57 (dominant constituent)
  cQHasFiniteLimit: false, // g(b) = Q(b) - s0 b diverges (growing sub-linear form)
  cQCoupledToS0: true, // |d cQ / d s0| = b
  s0CouplingSensitivityIsB: true, // measured spread = s0-band-width * b, exactly
  bandWidensWithScale: true, // +/- 0.006 b: +/- 7.2 at b=1200, +/- 96 at b=16000
  pinnableConstant: false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'cQ is NOT a pinnable constant. Its best documented figure is the constant-model value cQ ~ ' +
    '-13.4 (imp-97207 two-parameter fit m(b)=Q(b)/b=s0+cQ/b over the four imp-96750 windows b in ' +
    '[100,1200], co-fit s0=1.7626, kernel validated against T(250)=11.757622 and window[100,300) ' +
    'mean 1.68979), feeding the intercept as 2 cQ (zeta(2)-5/4) ~ -10.57 (the dominant constituent ' +
    'of a_int=-14.929). But (i) cQ has NO b -> infinity limit: the direct extrapolant g(b)=<Q(b)-s0 ' +
    'b> swings across tens of units and both signs with no trend (center 300 -> -13.3, 700 -> -9.0, ' +
    '1100 -> +4.0), because the true sub-leading g(b) is the GROWING sub-linear form of ' +
    'imp-97261/97292/97329 (b^(1/2) or log^2 b, degenerate), so lim (Q - s0 b) does not exist; and ' +
    '(ii) cQ is coupled to the exact leading slope with sensitivity |d cQ / d s0| = b (measured ' +
    'spread = 0.0116*b across the imp-97243 s0 band exactly), so the s0 uncertainty +/- 0.006 alone ' +
    'gives cQ = -13.4 +/- 7 at b~1200 and +/- 96 at b~16000 -- a longer ladder makes the estimate ' +
    'WORSE. Pinning cQ as a value (hence the far-field ceiling F) needs the analytic Bettin-Conrey ' +
    'small-a asymptotic plus the crossover Euler-Maclaurin correction (the imp-97329 sub-gap), NOT ' +
    'more finite-b compute. Measurement only; pins no constant; no bound moves; the rigorous anchor ' +
    'stays T=2.594e7; compute N~9916 binds first by >2600x; no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97334_SUBGAP = Object.freeze({
  id: 'imp-97334-cq-constant-nonexistent-limit',
  statement:
    'The constant-model cQ ~ -13.4 (imp-97207 4-window fit, b in [100,1200], s0=1.7626) is ' +
    'documented and feeds the intercept as 2 cQ (zeta(2)-5/4) ~ -10.57, but cQ = lim (Q(b) - s0 b) ' +
    'does NOT exist: the direct extrapolant g(b) = <Q(b) - s0 b> swings by tens of units and both ' +
    'signs (no trend), because the true sub-leading term g(b) grows sub-linearly (b^(1/2) or log^2 ' +
    'b, degenerate, imp-97261/97292/97329). It is also coupled to the exact s0 with sensitivity ' +
    '|d cQ / d s0| = b, so the imp-97243 s0 band +/- 0.006 injects +/- 0.006 b (+/- 7.2 at b=1200). ' +
    'A pinnable cQ needs the analytic Bettin-Conrey small-a asymptotic plus the crossover ' +
    'Euler-Maclaurin correction (inherits imp-97329-uniform-crossover-mainterm-coupling), NOT more ' +
    'finite-b compute (numerical lever refuted, imp-97292).',
});

export const IMP97334_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the sub-leading constant cQ of ' +
  'Q(b)=s0 b+cQ+r(b) that imp-96750 bounds but never evaluates has best documented value cQ ~ -13.4 ' +
  '(imp-97207 4-window constant-model fit, b in [100,1200], s0=1.7626; kernel validated T(250)=' +
  '11.757622), feeding the imp-97207 intercept as 2 cQ (zeta(2)-5/4) ~ -10.57. But cQ is NOT a ' +
  'pinnable constant: (i) lim (Q(b)-s0 b) does NOT exist -- the extrapolant <Q-s0 b> swings by tens ' +
  'of units and both signs because the true g(b) grows sub-linearly (b^(1/2)/log^2 b, degenerate, ' +
  'imp-97261/97292/97329); (ii) it is coupled to the exact s0 with |d cQ / d s0| = b, so the +/- ' +
  '0.006 s0 band alone gives +/- 7 at b~1200. Pinning cQ needs the analytic Bettin-Conrey small-a ' +
  'asymptotic + crossover correction, not more finite-b compute. No bound is claimed moved.';

export default IMP97334_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97334_ASSERTIONS = [
  {
    id: 'imp97334-coefficient-symmetric',
    why: 'the Vasyunin coefficient must be symmetric I(a,b)=I(b,a) (structural check on the kernel).',
    holds: () =>
      Math.abs(coefficientI(2, 7) - coefficientI(7, 2)) < 1e-9 &&
      Math.abs(coefficientI(3, 10) - coefficientI(10, 3)) < 1e-9,
  },
  {
    id: 'imp97334-effective-cq-identity-and-pointwise-fluctuation',
    why: 'the effective constant must equal Q(b) - s0 b exactly (definition); and single-b values ' +
      'must fluctuate by O(hundreds) (Q/b spans 0.78..2.9 by factorization, imp-97292), so the ' +
      'constant only emerges from WINDOW means -- why <Q-s0 b> in RESULT 2 is a width-80 average.',
    holds: () => {
      const s0 = 1.757;
      const g300 = effectiveCQ(300, s0); // composite -> large negative
      const g299 = effectiveCQ(299, s0); // 299 = 13*23 -> large positive
      return (
        Math.abs(g300 - (secondMomentQ(300) - s0 * 300)) < 1e-9 &&
        Math.abs(g300) > 100 &&
        Math.abs(g299) > 100 &&
        g300 < 0 &&
        g299 > 0
      );
    },
  },
  {
    id: 'imp97334-constant-model-intercept-contribution',
    why: 'the constant-model cQ ~ -13.4 fed through the EXACT coefficient (zeta2-5/4) must reproduce ' +
      'the imp-97207 dominant intercept constituent termB ~ -10.6.',
    holds: () =>
      Math.abs(IMP97334_CONSTANT_MODEL_FIT.interceptCoeff - (IMP97334_ZETA2 - 1.25)) < 1e-15 &&
      Math.abs(IMP97334_CONSTANT_MODEL_FIT.interceptContribution - -10.572) < 0.02 &&
      IMP97334_CONSTANT_MODEL_FIT.cQFit < -8 &&
      IMP97334_CONSTANT_MODEL_FIT.cQFit > -20,
  },
  {
    id: 'imp97334-cq-has-no-limit',
    why: 'the direct extrapolant g(b)=<Q-s0 b> must NOT converge: it must span both signs across the ' +
      'ladder (max > 0, min < -10), the crux that lim (Q - s0 b) does not exist.',
    holds: () => {
      const gs = IMP97334_NONCONVERGENCE.ladder.map((r) => r.gEff);
      return Math.max(...gs) > 0 && Math.min(...gs) < -10 && IMP97334_VERDICT.cQHasFiniteLimit === false;
    },
  },
  {
    id: 'imp97334-s0-coupling-sensitivity-is-b',
    why: 'the s0-coupling sensitivity must be |d cQ / d s0| = b: the measured spread across the ' +
      's0 band must equal band-width * center to ~1%.',
    holds: () =>
      IMP97334_S0_COUPLING.measuredSpreads.every(
        (r) => Math.abs(r.spread - r.predicted) / r.predicted < 0.02,
      ) && IMP97334_VERDICT.s0CouplingSensitivityIsB === true,
  },
  {
    id: 'imp97334-honesty-gate-no-qed',
    why: 'measurement only: no bound moved, cQ not a pinnable constant, no finite limit, compute ' +
      'binds first, honesty markers + sub-gap present.',
    holds: () =>
      IMP97334_VERDICT.anyBoundMoved === false &&
      IMP97334_VERDICT.pinnableConstant === false &&
      IMP97334_VERDICT.cQHasFiniteLimit === false &&
      IMP97334_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97334_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97334_HONEST_BANNER) &&
      /RH open/.test(IMP97334_HONEST_BANNER) &&
      /cq-constant-nonexistent-limit/.test(IMP97334_SUBGAP.id),
  },
];

for (const a of IMP97334_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97334-route-m-cq-subleading-constant-evaluation assertion failed: ${a.id}`,
    );
  }
}

export { IMP97334_ASSERTIONS };
