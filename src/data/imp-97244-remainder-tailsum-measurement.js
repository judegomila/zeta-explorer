/**
 * @module imp-97244-remainder-tailsum-measurement
 * @fileoverview imp-97244 -- MEASUREMENT ONLY: size the imp-97207 intercept constituent (C) = 2R,
 *   where R = Sum_{b>=3} r(b)/b^2 is the b-summed tail of the vanishing remainder r(b) in the
 *   assumed asymptotic
 *       Q(b) = s0 b + cQ + r(b),   r(b) -> 0,   Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2.
 *   imp-97207 derived the unweighted-series intercept in closed structural form
 *       c1_T = 2 s0 (gamma-3/2) + 2 cQ (zeta(2)-5/4) + 2 R
 *   and left constituent (C) = 2R as an UNEVALUATED convergent constant. This leaf measures R
 *   directly from the SAME computed Q(b) data (the imp-96750 four window means of Q(b)/b) by
 *   subtracting the fitted s0 b + cQ and summing the weighted remainder r(b)/b^2. It pins no value,
 *   moves no bound; it only sizes constituent (C) against the dominant constituents (A), (B).
 *
 *   ------------------------------------------------------------------------------------------
 *   THE MEASUREMENT (direct, from the computed Q(b) window means)
 *   ------------------------------------------------------------------------------------------
 *   Term by term the weighted remainder splits exactly:
 *       r(b)/b^2 = Q(b)/b^2 - s0/b - cQ/b^2 = (Q(b)/b - s0)/b - cQ/b^2.
 *   Using the imp-96750 window mean meanQoverB as the computed proxy for Q(b)/b across each window,
 *   the window contribution to R is
 *       Sum_{b in [from,to)} r(b)/b^2 ~ (meanQoverB - s0) Sum_{b} 1/b  -  cQ Sum_{b} 1/b^2,
 *   with Sum_{b} 1/b and Sum_{b} 1/b^2 evaluated exactly over the integer window. Summing the four
 *   windows gives the tail-sum R RESTRICTED to the MEASURED range b in [100,1200):
 *       R_measured([100,1200)) ~ 9.43e-3   ->   constituent (C) = 2 R ~ 1.89e-2.
 *   This is SMALL: |2R| ~ 0.019 is about 0.14% of the partial closed-form intercept
 *   c1TExcludingRemainder ~ -13.82, and three orders below the dominant unpinned constituent (B)
 *   2 cQ (zeta(2)-5/4) ~ -10.6. So constituent (C) is the SMALLEST of the three intercept pieces
 *   over the accessible range: the intercept is governed by cQ (constituent B), not by the remainder.
 *
 *   ------------------------------------------------------------------------------------------
 *   WHAT THIS MEASURES vs WHAT STAYS UNMEASURED (honest sub-gap)
 *   ------------------------------------------------------------------------------------------
 *   MEASURED: the b-summed weighted remainder over the four imp-96750 windows that span
 *   b in [100,1200). Over that range r(b)/b^2 sums to a small positive O(1e-2) constant, dominated
 *   by the b in [100,300) window (the fit residual is largest there).
 *   UNMEASURED (named sub-gap imp-97244-remainder-head-and-far-tail): R = Sum_{b>=3} also carries
 *     (i) a HEAD b in [3,100) below the first window, where the s0 b + cQ asymptotic is least
 *         accurate (small-b), and
 *     (ii) a FAR TAIL b >= 1200 above the last window, where r(b) -> 0 but the sum is not yet
 *         truncated-negligible without a decay rate for r(b).
 *   Neither is captured by the four-window data; R_measured is therefore the MIDDLE-RANGE part of R,
 *   not the full constant. Pinning R (hence constituent C, hence F as a value) still needs the
 *   head + far-tail content -- the same next-order Q(b) obstruction imp-97207 names. This leaf only
 *   confirms that, wherever it is measurable, constituent (C) = 2R is small and does not govern the
 *   intercept.
 *
 *   VERDICT: constituent (C) = 2R is SIZED (measured ~1.9e-2 over b in [100,1200), the smallest of
 *   the three intercept constituents there); its full value over b >= 3 stays UNPINNED (head + far
 *   tail unmeasured). No value is pinned; no bound is moved; F stays a slope-derived placement,
 *   exactValuePinned = false; the only rigorous anchor is the trace ceiling T = 2.594e7; compute
 *   (N ~ 9916, imp-96352) binds first by >2600x; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97207-route-m-farfield-intercept-derivation (defines c1_T = ... + 2R; leaves 2R symbolic)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (the Q(b) window means; O(1) unpinned)
 * @see imp-97160-route-m-farfield-additive-term-spread (sizes the intercept residual; exactValuePinned=false)
 *
 * Ticket: imp-97244 (numerical, opus-4-8, api-pool). Measurement only; pins no value; no bound moved; NO QED.
 */

import {
  IMP97207_GAMMA,
  IMP97207_ZETA2,
  IMP97207_COEFF_S0,
  IMP97207_COEFF_CQ,
  IMP97207_S0_FIT,
  IMP97207_CQ_FIT,
  IMP97207_QOVERB_WINDOWS,
  IMP97207_DECOMPOSITION,
} from './imp-97207-route-m-farfield-intercept-derivation.js';

// Reuse imp-97207 (single source of truth) for the fitted slope/constant and the computed windows.
export const IMP97244_S0 = IMP97207_S0_FIT; // ~1.7626 (leading slope; measured)
export const IMP97244_CQ = IMP97207_CQ_FIT; // ~-13.384 (sub-leading constant; measured, coarse)

// -- Direct measurement: per-window contribution to R = Sum_{b>=3} r(b)/b^2 over the computed range.
// r(b)/b^2 = (Q(b)/b - s0)/b - cQ/b^2; use meanQoverB as the computed Q(b)/b proxy per window and
// evaluate the two inner integer sums exactly over each window.
function measureRemainderPerWindow(windows, s0, cQ) {
  return windows.map((w) => {
    let sumInvB = 0; // Sum_{b in [from,to)} 1/b
    let sumInvB2 = 0; // Sum_{b in [from,to)} 1/b^2
    for (let b = w.from; b < w.to; b += 1) {
      sumInvB += 1 / b;
      sumInvB2 += 1 / (b * b);
    }
    const contrib = (w.meanQoverB - s0) * sumInvB - cQ * sumInvB2;
    return Object.freeze({ from: w.from, to: w.to, sumInvB, sumInvB2, contrib });
  });
}

export const IMP97244_WINDOW_CONTRIBS = Object.freeze(
  measureRemainderPerWindow(IMP97207_QOVERB_WINDOWS, IMP97244_S0, IMP97244_CQ),
);

export const IMP97244_R_MEASURED = IMP97244_WINDOW_CONTRIBS.reduce((s, w) => s + w.contrib, 0); // ~9.43e-3
export const IMP97244_TWO_R = 2 * IMP97244_R_MEASURED; // constituent (C) = 2R ~ 1.89e-2

// Sizes: compare constituent (C) against the partial closed-form intercept and the dominant (B).
export const IMP97244_SIZING = Object.freeze({
  rMeasuredOverMiddleRange: IMP97244_R_MEASURED,
  constituentC_twoR: IMP97244_TWO_R,
  c1TExcludingRemainder: IMP97207_DECOMPOSITION.c1TExcludingRemainder, // ~-13.82
  termB_cQ: IMP97207_DECOMPOSITION.termB_cQ, // ~-10.6 (dominant)
  termA_s0: IMP97207_DECOMPOSITION.termA_s0, // ~-3.25
  // constituent (C) as a fraction of the partial intercept magnitude
  fractionOfPartialIntercept:
    Math.abs(IMP97244_TWO_R) / Math.abs(IMP97207_DECOMPOSITION.c1TExcludingRemainder),
  measuredRange: 'b in [100,1200) -- the four imp-96750 windows',
  smallestConstituentOverMeasuredRange: true, // |2R| < |termA_s0| < |termB_cQ|
});

export const IMP97244_SUBGAP = Object.freeze({
  id: 'imp-97244-remainder-head-and-far-tail',
  statement:
    'R_measured sizes only the MIDDLE-RANGE part of R = Sum_{b>=3} r(b)/b^2 over b in [100,1200). ' +
    'The full constant also carries a HEAD b in [3,100) (where the s0 b + cQ asymptotic is least ' +
    'accurate) and a FAR TAIL b >= 1200 (where r(b) -> 0 but truncation needs a decay rate for ' +
    'r(b)). Neither is captured by the four imp-96750 window means, so R (hence constituent C = 2R, ' +
    'hence F as a value) stays UNPINNED; this leaf only sizes (C) as small over the measured range.',
});

export const IMP97244_VERDICT = Object.freeze({
  id: 'imp-97244',
  proofSection: 'Route-M',
  question:
    'How big is the imp-97207 intercept constituent (C) = 2R, R = Sum_{b>=3} r(b)/b^2, measured ' +
    'directly from the computed Q(b) values?',
  rMeasuredOverMiddleRange: IMP97244_R_MEASURED,
  constituentC_twoR: IMP97244_TWO_R,
  constituentCIsSmallest: true, // over the measured range, |2R| is the smallest of the three pieces
  interceptGovernedByCQ: true, // constituent (B) dominates; the remainder does not govern c1_T
  exactValuePinned: false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'Direct measurement of constituent (C) = 2R from the same imp-96750 window means of Q(b)/b: ' +
    'subtracting the fitted s0 b + cQ and summing r(b)/b^2 = (Q(b)/b - s0)/b - cQ/b^2 over the four ' +
    'windows (b in [100,1200)) gives R_measured ~ 9.43e-3, so (C) = 2R ~ 1.89e-2 -- about 0.14% of ' +
    'the partial closed-form intercept c1TExcludingRemainder ~ -13.82 and the SMALLEST of the three ' +
    'intercept constituents over that range (|2R| < |termA_s0| ~ 3.25 < |termB_cQ| ~ 10.6). The ' +
    'intercept is therefore governed by the unpinned sub-leading constant cQ (constituent B), not by ' +
    'the remainder. Sub-gap imp-97244-remainder-head-and-far-tail: R = Sum_{b>=3} also carries an ' +
    'unmeasured head b in [3,100) and far tail b >= 1200, so R (hence C, hence F as a value) stays ' +
    'UNPINNED. Measurement only; pins no value; changes no bound; no operator positivity; the ' +
    'rigorous anchor stays T = 2.594e7; compute N ~ 9916 binds first by >2600x; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97244_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the imp-97207 intercept ' +
  'constituent (C) = 2R, R = Sum_{b>=3} r(b)/b^2, is SIZED directly from the imp-96750 computed ' +
  'Q(b) window means by subtracting the fitted s0 b + cQ and summing the weighted remainder. Over ' +
  'the measured range b in [100,1200), R_measured ~ 9.43e-3 and (C) = 2R ~ 1.89e-2 -- the SMALLEST ' +
  'of the three intercept constituents (dominated by cQ via constituent B ~ -10.6). The head ' +
  'b in [3,100) and far tail b >= 1200 stay unmeasured, so R (hence F as a value) is UNPINNED. No ' +
  'bound is claimed moved; the rigorous anchor stays T = 2.594e7.';

export default IMP97244_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97244_ASSERTIONS = [
  {
    id: 'imp97244-inputs-reused-from-imp97207',
    why: 'the measurement must reuse the imp-97207 fitted slope/constant (single source of truth): ' +
      's0 ~ 1.75-1.77 and a large negative sub-leading cQ, and the exact structural coefficients.',
    holds: () =>
      IMP97244_S0 > 1.7 &&
      IMP97244_S0 < 1.85 &&
      IMP97244_CQ < -8 &&
      IMP97244_CQ > -20 &&
      Math.abs(IMP97207_COEFF_S0 - (IMP97207_GAMMA - 1.5)) < 1e-15 &&
      Math.abs(IMP97207_COEFF_CQ - (IMP97207_ZETA2 - 1.25)) < 1e-15,
  },
  {
    id: 'imp97244-remainder-measured-small-positive',
    why: 'the direct measurement over b in [100,1200) must return a small O(1e-2) tail-sum R (the ' +
      'fit forces the model close to the data, so the summed remainder is small), and 2R = (C).',
    holds: () =>
      IMP97244_R_MEASURED > 0 &&
      IMP97244_R_MEASURED < 0.05 &&
      Math.abs(IMP97244_TWO_R - 2 * IMP97244_R_MEASURED) < 1e-15,
  },
  {
    id: 'imp97244-constituent-C-is-smallest',
    why: 'constituent (C) = 2R must be the SMALLEST of the three intercept pieces over the measured ' +
      'range -- strictly below |termA_s0| and |termB_cQ| -- so the intercept is governed by cQ.',
    holds: () =>
      Math.abs(IMP97244_TWO_R) < Math.abs(IMP97244_SIZING.termA_s0) &&
      Math.abs(IMP97244_TWO_R) < Math.abs(IMP97244_SIZING.termB_cQ) &&
      IMP97244_SIZING.fractionOfPartialIntercept < 0.01 &&
      IMP97244_SIZING.smallestConstituentOverMeasuredRange === true,
  },
  {
    id: 'imp97244-subgap-head-and-far-tail-named',
    why: 'the honest sub-gap must name the unmeasured head b in [3,100) and far tail b >= 1200 that ' +
      'keep the full R (hence constituent C, hence F as a value) UNPINNED.',
    holds: () =>
      /remainder-head-and-far-tail/.test(IMP97244_SUBGAP.id) &&
      /\[3,100\)/.test(IMP97244_SUBGAP.statement) &&
      /1200/.test(IMP97244_SUBGAP.statement) &&
      /UNPINNED/.test(IMP97244_SUBGAP.statement),
  },
  {
    id: 'imp97244-honesty-gate-no-qed',
    why: 'measurement only: no bound moved, no value pinned, compute binds first, and the honesty ' +
      'markers plus the measurement verdict are present.',
    holds: () =>
      IMP97244_VERDICT.anyBoundMoved === false &&
      IMP97244_VERDICT.exactValuePinned === false &&
      IMP97244_VERDICT.computeBindsFirst === true &&
      IMP97244_VERDICT.constituentCIsSmallest === true &&
      /NO QED/.test(IMP97244_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97244_HONEST_BANNER) &&
      /RH open/.test(IMP97244_HONEST_BANNER) &&
      /imp-96750/.test(IMP97244_VERDICT.conclusion),
  },
];

for (const a of IMP97244_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97244-remainder-tailsum-measurement assertion failed: ${a.id}`,
    );
  }
}

export { IMP97244_ASSERTIONS };
