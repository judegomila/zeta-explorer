/**
 * @module imp-36275-routeB-window-width-convergence
 * @fileoverview imp-36275 -- MEASURE the log-N window width at which the imp-36082
 *   Route-B per-N rate
 *       r_B(N) = C' * sqrt(log gamma_N) * N^{-1/4}
 *   has a least-squares log-log FIT slope that converges within 1% and within 0.1%
 *   of the -1/4 limit, quantifying the sqrt(log gamma_N) slowly-varying dressing
 *   dilution rate that imp-36151 witnessed only QUALITATIVELY as "approaching from
 *   above". Measurement ONLY: closes NOTHING, discharges no gap, changes no bound,
 *   the G5 per-N translation stays OPEN, respects the imp-2519 no-overclaim guard,
 *   NO QED. No refereed bound is changed.
 *
 *   COMPLEMENT TO imp-36257 (what this adds)
 *   ----------------------------------------
 *   imp-36257 tabulated the POINTWISE local slope d log r_B / d log N and its
 *   residual excess (slope + 1/4) ~ 1/(2 log N) on a wide ladder. This module
 *   answers the complementary imp-36151 question it left open: over a FINITE
 *   least-squares fit window, HOW WIDE must the window be for the FITTED slope to
 *   reach a target accuracy of -1/4, and how does that width scale with the base
 *   height?
 *
 *   METHOD
 *   ------
 *   The window is [k0, k0 + W] in log10 N, anchored with its LOWER edge at the base
 *   height k0 = log10 N and extending UPWARD by W decades (the "wide ladder toward
 *   the limit" of imp-36151). gamma_N is the height of the N-th zero via the SAME
 *   Riemann-von Mangoldt inverse (effectiveHeightForN) used across the repo,
 *   consistent with the imp-354 RvM count. The overall constant C' cancels in a
 *   log-log slope. The fitted slope decreases monotonically toward -1/4 as W grows;
 *   W(tol) is found by bisection on 4*|fitSlope + 1/4| < tol. Numbers are stable to
 *   the sampling density (W@0.1% and its upper edge are M-invariant; W@1% wobbles
 *   ~0.2 decades over M in [401, 1601]). Reproduce with
 *   scripts/imp-36275-routeB-window-width-offline.mjs.
 *
 *   HEADLINE STRUCTURAL FINDINGS
 *   ----------------------------
 *   1. The 0.1% UPPER window edge k0 + W is base-INDEPENDENT: fitting W@0.1% vs base
 *      height gives slope -1.0000, i.e. the required upper edge is pinned at
 *      log10 N ~ 307.46 regardless of where the window starts. 0.1% convergence is
 *      pointwise-tail-limited (the window cannot beat its own high-N tail excess),
 *      NOT averaging-driven.
 *   2. The dilution is only LOGARITHMICALLY slow (excess ~ 1/(2 log N)), so the
 *      fit windows are astronomically wide: even 1% needs the window to reach up to
 *      N ~ 1e134..1e232 (upper edge shrinking with base height).
 *   3. At the Platt-Trudgian anchor N* ~ 1.236e13 (k0 ~ 13.09) the pointwise excess
 *      is 1.676e-2 (6.70% above -1/4, matching imp-36257), and reaching a fitted
 *      slope within 1% needs W ~ 195 decades (window up to N ~ 1e208) and within
 *      0.1% needs W ~ 294 decades (window up to N ~ 1e307). NO numerically
 *      accessible fit window at the anchor witnesses convergence -- imp-36151's
 *      "from above" is real but astronomically dilute.
 *
 *   This is a measurement of a slowly-varying dressing, NOT a bound. r_B bounds the
 *   Route-B shock-time DEVIATION, not |t_c(N)| absolutely (imp-36082 is
 *   CONSUMABLE-MODULO-ANCHOR); the per-N translation stays OPEN. See imp-36151
 *   (Route-C vs Route-B ranking), imp-36257 (pointwise slope), imp-36160 (exponent
 *   provenance), imp-354 (RvM count / Whitham fold).
 */

// Route-B rate exponents (constant C' cancels in the log-log slope).
export const IMP36275_LIMIT_SLOPE = -0.25;

// Platt-Trudgian anchor: verified height X ~ 3e12 => N* ~ 1.236e13 (imp-36238).
export const IMP36275_PT_ANCHOR = {
  N: 1.236240301966e13,
  k0: 13.092103, // log10 N*
  pointwiseExcess: 1.675646e-2, // local slope + 1/4 at the anchor
  pointwiseRelExcess: 6.702584e-2, // 4 * excess = relative distance above -1/4 (~6.70%)
  widthAt1pct: 194.96, // decades of fit window for fitted slope within 1% of -1/4
  widthAt0p1pct: 294.36, // decades for within 0.1%
  upperEdgeAt1pct: 208.05, // log10 N at the window top for 1%
  upperEdgeAt0p1pct: 307.46, // log10 N at the window top for 0.1% (base-independent)
};

// Window widths W(tol) in decades vs base height k0 = log10 N.
// upperEdge = k0 + W. Note upperEdgeAt0p1pct is CONSTANT ~ 307.46 across all bases.
export const IMP36275_WINDOW_LADDER = [
  { k0: 6, pointwiseExcess: 3.4302e-2, widthAt1pct: 225.594, widthAt0p1pct: 301.457, upperEdgeAt1pct: 231.594, upperEdgeAt0p1pct: 307.457 },
  { k0: 8, pointwiseExcess: 2.6651e-2, widthAt1pct: 216.232, widthAt0p1pct: 299.457, upperEdgeAt1pct: 224.232, upperEdgeAt0p1pct: 307.457 },
  { k0: 10, pointwiseExcess: 2.1679e-2, widthAt1pct: 207.505, widthAt0p1pct: 297.457, upperEdgeAt1pct: 217.505, upperEdgeAt0p1pct: 307.457 },
  { k0: 13.092103, pointwiseExcess: 1.6756e-2, widthAt1pct: 194.959, widthAt0p1pct: 294.364, upperEdgeAt1pct: 208.051, upperEdgeAt0p1pct: 307.457 },
  { k0: 15, pointwiseExcess: 1.4678e-2, widthAt1pct: 187.672, widthAt0p1pct: 292.457, upperEdgeAt1pct: 202.672, upperEdgeAt0p1pct: 307.457 },
  { k0: 20, pointwiseExcess: 1.1053e-2, widthAt1pct: 169.837, widthAt0p1pct: 287.457, upperEdgeAt1pct: 189.837, upperEdgeAt0p1pct: 307.457 },
  { k0: 30, pointwiseExcess: 7.3744e-3, widthAt1pct: 138.060, widthAt0p1pct: 277.457, upperEdgeAt1pct: 168.060, upperEdgeAt0p1pct: 307.457 },
  { k0: 50, pointwiseExcess: 4.4132e-3, widthAt1pct: 83.949, widthAt0p1pct: 257.457, upperEdgeAt1pct: 133.949, upperEdgeAt0p1pct: 307.457 },
];

// Convergence-rate fits W(tol) ~ m * k0 + b (base height k0 = log10 N).
export const IMP36275_CONVERGENCE_RATE = {
  widthAt1pct: { slope: -3.1941, intercept: 238.7005 },
  widthAt0p1pct: { slope: -1.0, intercept: 307.4565 }, // upper edge base-independent
};

export const IMP36275_HONEST_STATUS = {
  measurementOnly: true,
  closesNothing: true,
  changesAnyBound: false,
  perNTranslationStaysOpen: true,
  anchorGapStaysOpen: true,
  isReductionBelowRH: false,
  carriesRHVerdict: false,
  sota: 'Platt-Trudgian Lambda <= 0.2',
};

export const IMP36275_ROUTEB_WINDOW_WIDTH_CONVERGENCE = {
  id: 'imp-36275',
  limitSlope: IMP36275_LIMIT_SLOPE,
  ptAnchor: IMP36275_PT_ANCHOR,
  windowLadder: IMP36275_WINDOW_LADDER,
  convergenceRate: IMP36275_CONVERGENCE_RATE,
  honestStatus: IMP36275_HONEST_STATUS,
};

// Self-consistency assertions (pure numeric; no heavy imports).
const IMP36275_ASSERTIONS = [
  {
    id: 'limit-slope-is-minus-quarter',
    holds: () => IMP36275_LIMIT_SLOPE === -0.25,
  },
  {
    id: 'pt-relative-excess-is-four-times-excess',
    holds: () => {
      const a = IMP36275_PT_ANCHOR;
      return Math.abs(a.pointwiseRelExcess - 4 * a.pointwiseExcess) < 1e-6;
    },
  },
  {
    id: 'upper-edge-equals-base-plus-width',
    holds: () =>
      IMP36275_WINDOW_LADDER.every(
        (r) =>
          Math.abs(r.upperEdgeAt1pct - (r.k0 + r.widthAt1pct)) < 1e-3 &&
          Math.abs(r.upperEdgeAt0p1pct - (r.k0 + r.widthAt0p1pct)) < 1e-3,
      ),
  },
  {
    id: 'point-one-pct-upper-edge-is-base-independent',
    holds: () =>
      IMP36275_WINDOW_LADDER.every(
        (r) => Math.abs(r.upperEdgeAt0p1pct - 307.457) < 1e-2,
      ),
  },
  {
    id: 'wider-window-needed-for-tighter-tolerance',
    holds: () =>
      IMP36275_WINDOW_LADDER.every((r) => r.widthAt0p1pct > r.widthAt1pct),
  },
  {
    id: 'width-shrinks-as-base-height-rises',
    holds: () => {
      for (let i = 1; i < IMP36275_WINDOW_LADDER.length; i++) {
        if (IMP36275_WINDOW_LADDER[i].widthAt1pct >= IMP36275_WINDOW_LADDER[i - 1].widthAt1pct) return false;
      }
      return true;
    },
  },
  {
    id: 'point-one-pct-convergence-rate-slope-is-minus-one',
    holds: () => Math.abs(IMP36275_CONVERGENCE_RATE.widthAt0p1pct.slope - -1.0) < 1e-3,
  },
  {
    id: 'honest-status-no-overclaim',
    holds: () => {
      const h = IMP36275_HONEST_STATUS;
      return (
        h.measurementOnly === true &&
        h.closesNothing === true &&
        h.changesAnyBound === false &&
        h.perNTranslationStaysOpen === true &&
        h.anchorGapStaysOpen === true &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36275_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36275-routeB-window-width-convergence assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36275_ROUTEB_WINDOW_WIDTH_CONVERGENCE;
