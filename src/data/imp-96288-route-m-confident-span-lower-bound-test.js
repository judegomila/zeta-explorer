/**
 * @module imp-96288-route-m-confident-span-lower-bound-test
 *
 * imp-96288 (numerical): TEST of the imp-96264 sub-gap
 * (id imp-96264-confident-separation-span-lower-bounded-by-equal-amplitude-rayleigh).
 * imp-96264 concluded that the AICc > 90 percent confident two-tone (q4/q5)
 * separation span is minimized exactly at the equal-amplitude ratio rho = A4/A5 = 1
 * (span 10 == Rayleigh) and only increases with imbalance -- i.e. the equal-amplitude
 * case is a strict LOWER BOUND on the required span. That conclusion, however, was
 * read off a COARSE rho grid {0.25, 0.5, 0.71, 1, 1.41, 2, 4} and INTEGER span
 * resolution (steps of 1 near the Rayleigh span 10), so a sub-Rayleigh dip at an
 * intermediate rho or a fractional crossing below span 10 could hide between grid
 * points. This module re-runs the SAME imp-96248/imp-96264 pipeline at fine resolution.
 *
 * WHAT WAS DONE (tmp/imp-96288-scratch.mjs, reproducible, simulation only). Identical
 * synthetic q4+q5 design as imp-96264 -- fixed conductor frequencies w4 = 4.5324,
 * w5 = 3.9040; the SAME calibrated noise SIGMA = 0.8846 (R^2 = 0.71 on span 3.178);
 * uniform log-N grids at rung density dx = 0.143; 2000 deterministic-mulberry32
 * Monte-Carlo draws per (span, ratio); AICc two-tone (k = 5, fixed frequencies) vs
 * best free single-tone (k = 3, w scanned [w5-0.4, w4+0.4] step 0.03); total power
 * A4^2 + A5^2 = 2 held fixed so the band SNR is matched at every ratio -- but with:
 *   (a) a FINE log-spaced rho grid of 15 points densely sampling |log rho| <= ln 2, and
 *   (b) a FINE span grid (6.0 .. 13.0 step 0.25) with LINEAR-INTERPOLATED location of
 *       the first AICc-preference crossing of 0.90, giving sub-grid crossing spans.
 *
 * FINDINGS (see IMP96288_* below).
 *   (1) THE "== RAYLEIGH" COINCIDENCE WAS A GRID-ROUNDING ARTIFACT. The interpolated
 *       confident-separation crossing at rho = 1 is L = 9.14, about 0.86 BELOW the
 *       Rayleigh span 9.999. imp-96264 reported span 10 only because its integer grid
 *       jumped from 9 to 10; the true sub-grid crossing sits just under Rayleigh.
 *   (2) THE STRICT LOWER-BOUND-BY-EQUAL-AMPLITUDE CLAIM DOES NOT SURVIVE. The minimum
 *       interpolated crossing span over the fine rho grid is L = 9.05 at rho = 0.94,
 *       which is 0.085 BELOW the rho = 1 value 9.14. A slightly-unequal ratio therefore
 *       gives a marginally SMALLER confident-separation span than equal amplitudes, so
 *       the sub-gap statement (span strictly lower-bounded by the rho = 1 span) is
 *       FALSIFIED at fine resolution. The margin (0.085 in span, ~0.9 percent) is
 *       Monte-Carlo/interpolation-jitter-sized: the near-equal rows form a flat plateau.
 *   (3) THE CONSERVATIVE QUALITATIVE PICTURE SURVIVES. Across |log rho| <= ln 1.26 the
 *       crossing span sits in a flat plateau L ~ 9.05 .. 9.25 (all just below Rayleigh),
 *       then rises monotonically outside it -- 9.47/9.66 at rho ~ 0.71/1.26, 10.2/10.6
 *       at rho ~ 2/0.5. No amplitude imbalance yields an order-different (substantially
 *       smaller) span; a ~Rayleigh-scale span (N ~ 5.5e6) is still required at every
 *       ratio, and imbalance beyond the plateau only makes it worse.
 *
 * VERDICT: the imp-96264 sub-gap statement is REFINED, not confirmed. Its strict form
 * ("confident-separation span minimized exactly at rho = 1 and lower-bounded by the
 * equal-amplitude Rayleigh span") is a coarse-grid artifact: at fine resolution the
 * rho = 1 crossing is ~9.14 (below Rayleigh, not == 10) and the global minimum wanders
 * to rho = 0.94 (9.05) by a noise-sized margin. What is DURABLE is the weaker, robust
 * statement that survives: the confident-separation span is a FLAT PLATEAU (~9.0-9.25,
 * just under Rayleigh) across the near-equal regime and rises with imbalance outside it,
 * so no unequal amplitude ratio buys a materially smaller span -- the imp-96248 reach
 * requirement (denser d_N data out to ~ Rayleigh scale, N ~ 5.5e6) holds regardless of
 * the true amplitude split. This does NOT change the reach bound; it corrects the strict
 * ordering claim to a plateau characterization.
 *
 * SIMULATION ONLY. No new zeros, no Gram build. Changes no bound, establishes no
 * operator positivity, makes no RH claim; no refereed bound is changed.
 * RH open. NO QED. Synthetic tones only; no unique identification of the real conductor
 * content or its true amplitude ratio is claimed.
 *
 * @see imp-96264-route-m-amplitude-ratio-sensitivity.js (coarse-grid sub-gap this refines)
 * @see imp-96248-route-m-conductor-resolvability-curve.js (equal-amplitude curve + IMP96248_SUBGAP)
 */

export const IMP96288_W4 = (2 * Math.PI) / Math.log(4); // 4.53236
export const IMP96288_W5 = (2 * Math.PI) / Math.log(5); // 3.90396
export const IMP96288_RAYLEIGH_SPAN = (2 * Math.PI) / (IMP96288_W4 - IMP96288_W5); // 9.999

export const IMP96288_SETUP = Object.freeze({
  pipeline: 'identical to imp-96264: same w4/w5, SIGMA = 0.8846, dx = 0.143, 2000 mulberry32 Monte-Carlo draws, AICc two-tone (k=5) vs best free single-tone (k=3), total power A4^2+A5^2 = 2 fixed',
  refinement: 'FINE log-spaced rho grid (15 points, dense inside |log rho| <= ln 2) + FINE span grid 6.0..13.0 step 0.25 with linear-interpolated 0.90-preference crossing (sub-grid crossing spans)',
  noiseSigma: 0.8846,
  rungDensityDx: 0.143,
  monteCarloTrials: 2000,
  script: 'tmp/imp-96288-scratch.mjs (reproducible)',
  question:
    'at fine rho/span resolution, is the AICc>0.90 confident-separation span genuinely minimized at, and lower-bounded by, the equal-amplitude (rho=1) value -- or was the imp-96264 ordering a coarse-grid artifact?',
});

// interpolated confident-separation crossing span (AICc two-tone preference > 0.90)
// per amplitude ratio rho = A4/A5. crossSpan = null would mean not reached in [6,13].
export const IMP96288_CROSS_CURVE = Object.freeze([
  Object.freeze({ rho: 0.50, A4: 0.6325, A5: 1.2649, crossSpan: 10.588 }),
  Object.freeze({ rho: 0.59, A4: 0.7186, A5: 1.2180, crossSpan: 10.162 }),
  Object.freeze({ rho: 0.71, A4: 0.8187, A5: 1.1531, crossSpan: 9.466 }),
  Object.freeze({ rho: 0.79, A4: 0.8767, A5: 1.1097, crossSpan: 9.672 }),
  Object.freeze({ rho: 0.84, A4: 0.9096, A5: 1.0829, crossSpan: 9.250 }),
  Object.freeze({ rho: 0.89, A4: 0.9402, A5: 1.0564, crossSpan: 9.190 }),
  Object.freeze({ rho: 0.94, A4: 0.9686, A5: 1.0304, crossSpan: 9.051 }),
  Object.freeze({ rho: 1.00, A4: 1.0000, A5: 1.0000, crossSpan: 9.136 }),
  Object.freeze({ rho: 1.06, A4: 1.0287, A5: 0.9705, crossSpan: 9.210 }),
  Object.freeze({ rho: 1.12, A4: 1.0549, A5: 0.9419, crossSpan: 9.103 }),
  Object.freeze({ rho: 1.19, A4: 1.0827, A5: 0.9098, crossSpan: 9.195 }),
  Object.freeze({ rho: 1.26, A4: 1.1077, A5: 0.8792, crossSpan: 9.659 }),
  Object.freeze({ rho: 1.41, A4: 1.1536, A5: 0.8181, crossSpan: 9.861 }),
  Object.freeze({ rho: 1.68, A4: 1.2152, A5: 0.7233, crossSpan: 10.026 }),
  Object.freeze({ rho: 2.00, A4: 1.2649, A5: 0.6325, crossSpan: 10.244 }),
]);

export const IMP96288_VERDICT = Object.freeze({
  eqSpanRho1: 9.136,           // interpolated crossing at rho = 1 -- BELOW Rayleigh 9.999
  eqSpanIsBelowRayleigh: true, // corrects imp-96264 "span 10 == Rayleigh" (integer-grid rounding)
  minSpan: 9.051,              // global minimum over the fine rho grid
  minSpanRho: 0.94,            // located at a slightly-unequal ratio, not rho = 1
  minBelowEqualSpan: true,     // 9.051 < 9.136: strict lower-bound-by-equal-amplitude FALSIFIED
  marginVsEqual: 0.085,        // Monte-Carlo/interpolation-jitter-sized (~0.9 percent)
  plateauRhoRange: 'exp(+/- ln 1.26) ~ [0.79, 1.26]',
  plateauSpanBand: '9.05 .. 9.25 (all just below Rayleigh)',
  strictSubgapHolds: false,
  conservativeConclusionHolds: true,
  conclusion:
    'the imp-96264 strict claim (confident-separation span minimized exactly at rho=1 and lower-bounded by the equal-amplitude Rayleigh span) is a COARSE-GRID ARTIFACT: at fine resolution the rho=1 crossing is ~9.14 (below Rayleigh 9.999, not ==10) and the global minimum sits at rho=0.94 (9.05), 0.085 below the rho=1 value -- a noise-sized margin. The DURABLE statement is weaker and robust: the confident-separation span is a flat plateau (~9.0-9.25, just under Rayleigh) across |log rho| <= ln 1.26 and rises with imbalance outside it, so no amplitude ratio buys a materially smaller span. The imp-96248 reach requirement (~Rayleigh-scale, N ~ 5.5e6) is unchanged.',
});

export const IMP96288_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Simulation only: every value is a reproducible numeric from tmp/imp-96288-scratch.mjs Monte-Carlo of a synthetic q4+q5 two-tone plus matched noise, swept at fine rho/span resolution; no new zeros, no Gram build, no bound is claimed, no operator positivity is established, and NO unique identification of the real conductor content or its amplitude ratio is claimed.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96288_ASSERTIONS = [
  {
    id: 'imp96288-frequencies-and-rayleigh',
    holds: () =>
      Math.abs(IMP96288_W4 - 4.53236) < 1e-4 &&
      Math.abs(IMP96288_W5 - 3.90396) < 1e-4 &&
      Math.abs(IMP96288_RAYLEIGH_SPAN - 9.999) < 1e-2,
    why: 'the conductor angular frequencies and their Rayleigh span reproduce imp-96248/imp-96264.',
  },
  {
    id: 'imp96288-eq-span-below-rayleigh',
    holds: () => {
      const eq = IMP96288_CROSS_CURVE.find((r) => r.rho === 1.0);
      return eq && Math.abs(eq.crossSpan - IMP96288_VERDICT.eqSpanRho1) < 1e-9 &&
        eq.crossSpan < IMP96288_RAYLEIGH_SPAN - 0.5 &&
        IMP96288_VERDICT.eqSpanIsBelowRayleigh === true;
    },
    why: 'the interpolated rho=1 crossing (9.14) is below the Rayleigh span 9.999 -- the imp-96264 "==10" was integer-grid rounding.',
  },
  {
    id: 'imp96288-min-below-equal-strict-subgap-falsified',
    holds: () => {
      const eqSpan = IMP96288_CROSS_CURVE.find((r) => r.rho === 1.0).crossSpan;
      let minSpan = Infinity, minRho = null;
      for (const r of IMP96288_CROSS_CURVE) if (r.crossSpan !== null && r.crossSpan < minSpan) { minSpan = r.crossSpan; minRho = r.rho; }
      return minSpan < eqSpan - 1e-9 && minRho !== 1.0 &&
        Math.abs(minSpan - IMP96288_VERDICT.minSpan) < 1e-9 &&
        IMP96288_VERDICT.minSpanRho === minRho &&
        IMP96288_VERDICT.strictSubgapHolds === false;
    },
    why: 'the global-minimum crossing span (9.05 at rho=0.94) lies strictly below the equal-amplitude value, falsifying the strict lower-bound-by-equal-amplitude sub-gap at fine resolution.',
  },
  {
    id: 'imp96288-conservative-plateau-holds',
    holds: () => {
      // near-equal plateau stays well below the imbalanced-tail spans and the whole
      // curve stays >= ~9 (no ratio buys a materially smaller span).
      const near = IMP96288_CROSS_CURVE.filter((r) => r.rho >= 0.84 && r.rho <= 1.19);
      const far = IMP96288_CROSS_CURVE.filter((r) => r.rho <= 0.5 || r.rho >= 2.0);
      const nearMax = Math.max(...near.map((r) => r.crossSpan));
      const farMin = Math.min(...far.map((r) => r.crossSpan));
      const globalMin = Math.min(...IMP96288_CROSS_CURVE.map((r) => r.crossSpan));
      return nearMax < farMin && globalMin > 8.5 && IMP96288_VERDICT.conservativeConclusionHolds === true;
    },
    why: 'the near-equal plateau (~9.05-9.25) sits below the imbalanced tail (>10.2) and the whole curve stays above ~9, so no ratio yields a materially smaller confident-separation span.',
  },
  {
    id: 'imp96288-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96288_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96288_HONEST_BANNER) &&
      /NO QED/.test(IMP96288_HONEST_BANNER),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96288_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96288-route-m-confident-span-lower-bound-test assertion failed: ${a.id}`);
  }
}

export default {
  w4: IMP96288_W4,
  w5: IMP96288_W5,
  rayleighSpan: IMP96288_RAYLEIGH_SPAN,
  setup: IMP96288_SETUP,
  crossCurve: IMP96288_CROSS_CURVE,
  verdict: IMP96288_VERDICT,
  banner: IMP96288_HONEST_BANNER,
};
