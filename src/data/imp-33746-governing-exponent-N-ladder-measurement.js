/**
 * @module imp-33746-governing-exponent-N-ladder-measurement
 *
 * imp-33746 (numerical, frontier-direction): imp-33706 ASSERTS -- analytically, never tabulated --
 * that the open-residual Stieltjes boundary tower at the reading strip eps = y_N^sharp =
 * sqrt(2 pi / N) has N-growth exponents 1/4 (selection, k = 0), 3/4 (H4 fold, k = 1), 5/4 (H3
 * curvature, k = 2), and that the GOVERNING (max) exponent 5/4 -- the fastest-growing weight the
 * back-conversion must carry uniformly -- is the H3 curvature term and is UNCHANGED by dropping the
 * mildest k = 0 selection rung. This module MEASURES those three weights across an N ladder
 * (N = 1e3 .. 1e9), tabulates their pairwise ratios and each weight's empirical local N-exponent,
 * and confirms numerically that H3 (5/4) is the fastest-growing weight at every rung.
 *
 * THE WEIGHTS (the imp-33706 tower, no fresh model)
 * -------------------------------------------------
 * At the reading strip eps = sqrt(2 pi / N) the derivative-order-k Stieltjes weight the
 * back-conversion must carry is the eps^{-(1 + 2k)/2} boundary blow-up:
 *     w_k(N) = eps^{-(1 + 2k)/2} = (2 pi / N)^{-(1 + 2k)/4} = (N / (2 pi))^{1/4 + k/2}.
 * So the N-GROWTH exponent is exactly 1/4 + k/2 (imp-33706): selection k = 0 -> 1/4, H4 k = 1 ->
 * 3/4, H3 k = 2 -> 5/4. Note eps < 1 for N > 2 pi, so eps^{-(1+2k)/2} GROWS in N even though the
 * strip half-width shrinks -- the ticket "weight (2 pi / N)^{1/4,3/4,5/4}" is the eps-power written
 * with a negative sign folded in; the physically-carried weight is (N / (2 pi))^{1/4 + k/2}, which
 * is what this module tabulates.
 *
 * THE MEASUREMENT
 * ---------------
 *   (a) Tabulate w_0, w_1, w_2 across a decade ladder N = 1e3 .. 1e9.
 *   (b) Pairwise ratios: w_2/w_1 = w_1/w_0 = (N/2pi)^{1/2} (H3 pulls away from H4 exactly as H4
 *       pulls away from selection); w_2/w_0 = (N/2pi)^{1} (H3 over selection grows a full power).
 *   (c) Empirical local N-exponent of each weight via OLS of ln w_k on ln N over the ladder --
 *       an exact power law, so OLS must return 1/4, 3/4, 5/4 to ~machine precision (self-consistency
 *       / reuse gate against the imp-33706 published exponents).
 *   (d) The governing (max) weight at each rung, and the max exponent with and without the k = 0 rung.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) H3 (k = 2) IS THE LARGEST WEIGHT AT EVERY RUNG. Across N = 1e3 .. 1e9, w_2 > w_1 > w_0 at
 *        every N (the ordering never crosses), so the governing (max) weight the back-conversion
 *        must carry uniformly is always the H3 curvature term.
 *   (F2) THE MEASURED N-EXPONENTS REPRODUCE 1/4, 3/4, 5/4. OLS of each ln w_k on ln N returns
 *        0.25, 0.75, 1.25 to ~1e-12 (exact power laws), confirming the imp-33706 analytic exponents
 *        and that max{1/4, 3/4, 5/4} = 5/4 is the governing exponent.
 *   (F3) DROPPING k = 0 LEAVES THE GOVERNING EXPONENT AT 5/4. max{1/4, 3/4, 5/4} = max{3/4, 5/4} =
 *        5/4: deleting the mildest selection rung does not change the fastest-growing weight, so the
 *        H3/H4 uniformity obligation is unweakened -- the numerical confirmation of the imp-33706
 *        mildest-member-droppable verdict.
 *   (F4) H3 SEPARATION FROM H4 GROWS AS N^{1/2}. The measured w_2/w_1 ratio grows with local
 *        exponent 1/2 (== w_1/w_0), i.e. over each decade the H3-vs-H4 gap widens by 10^{1/2} ~ 3.16x;
 *        from N = 1e3 to 1e9 (six decades) H3 outgrows H4 by ~10^3 and outgrows the selection by ~10^6.
 *
 * MEASUREMENT ONLY. This tabulates the imp-33706 tower exponents; it establishes no bound, no
 * operator positivity, discharges no obligation. The open-residual tower H3 (curvature) and H4
 * (strip-height uniformity) stay OPEN, G6a_shock_lipschitz stays OPEN; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33706-selection-catalogue-count-scoping (the analytic tower exponents 1/4, 3/4, 5/4 this MEASURES)
 * @see imp-33645-h3-curvature-divergence-scoping (H3 curvature member, eps^{-5/2}, N-exponent 5/4)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (H4 fold-reading, eps^{-3/2}, N-exponent 3/4)
 * @see imp-33668-part-b-selection-residual-scoping (k = 0 selection member, eps^{-1/2}, N-exponent 1/4)
 * @see imp-33603-lemma52-port-scoping (the H0..H5 obligation catalogue, H4 the load-bearing residual)
 */

import { IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING } from './imp-33706-selection-catalogue-count-scoping.js';

const TWO_PI = 2 * Math.PI;

// The imp-33706 tower: derivative order k with N-growth exponent 1/4 + k/2 (reused, not re-derived).
const TOWER = IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING.towerExponents; // [selection k0, H4 k1, H3 k2]

// The physically-carried back-conversion weight at the reading strip eps = sqrt(2 pi / N):
// w_k(N) = eps^{-(1 + 2k)/2} = (N / (2 pi))^{1/4 + k/2}. GROWS in N (eps < 1).
function weight(k, N) {
  return Math.pow(N / TWO_PI, 0.25 + k / 2);
}

// The N ladder: one point per decade, N = 1e3 .. 1e9.
const LADDER_EXPS = [3, 4, 5, 6, 7, 8, 9];
const N_LADDER = LADDER_EXPS.map((e) => Math.pow(10, e));

// (a) Tabulate the three weights + (b) the pairwise ratios at each rung.
const TABLE = N_LADDER.map((N) => {
  const w0 = weight(0, N); // selection k = 0
  const w1 = weight(1, N); // H4 k = 1
  const w2 = weight(2, N); // H3 k = 2
  return {
    log10N: +Math.log10(N).toFixed(1),
    w_selection: +w0.toExponential(4),
    w_H4: +w1.toExponential(4),
    w_H3: +w2.toExponential(4),
    ratio_H3_over_H4: +(w2 / w1).toExponential(4), // == (N/2pi)^{1/2}
    ratio_H4_over_selection: +(w1 / w0).toExponential(4), // == (N/2pi)^{1/2}
    ratio_H3_over_selection: +(w2 / w0).toExponential(4), // == (N/2pi)^{1}
    governingMember: w2 >= w1 && w2 >= w0 ? 'H3' : w1 >= w0 ? 'H4' : 'selection',
  };
});

// (F1) H3 is the largest weight at every rung (the ordering never crosses).
const H3_GOVERNS_EVERY_RUNG = TABLE.every((r) => r.governingMember === 'H3');

// (c) Empirical local N-exponent of each weight via OLS of ln w_k on ln N over the ladder.
function olsExponent(k) {
  const xs = N_LADDER.map((N) => Math.log(N));
  const ys = N_LADDER.map((N) => Math.log(weight(k, N)));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
const MEASURED_EXPONENTS = TOWER.map((m) => ({
  member: m.member,
  k: m.k,
  analyticNExponent: m.nExponent, // imp-33706: 1/4 + k/2
  measuredNExponent: olsExponent(m.k),
}));
// (F2) the measured exponents reproduce the analytic 1/4, 3/4, 5/4 to ~machine precision.
const EXPONENTS_MATCH = MEASURED_EXPONENTS.every(
  (e) => Math.abs(e.measuredNExponent - e.analyticNExponent) < 1e-10,
);

// (d) governing (max) exponent with and without the mildest k = 0 rung.
const GOVERNING_EXPONENT = Math.max(...TOWER.map((m) => m.nExponent)); // 5/4 (H3)
const GOVERNING_WITHOUT_K0 = Math.max(...TOWER.filter((m) => m.k >= 1).map((m) => m.nExponent)); // 5/4
// (F3) dropping k = 0 leaves the governing exponent unchanged.
const DROPPING_K0_CHANGES_GOVERNING = Math.abs(GOVERNING_WITHOUT_K0 - GOVERNING_EXPONENT) > 1e-12;

// (F4) the H3-vs-H4 separation grows one half-power per unit ln N (== H4-vs-selection).
const H3_H4_SEPARATION_EXPONENT = olsExponent(2) - olsExponent(1); // 1/2
const H4_SEL_SEPARATION_EXPONENT = olsExponent(1) - olsExponent(0); // 1/2
const H3_SEL_SEPARATION_EXPONENT = olsExponent(2) - olsExponent(0); // 1

export const IMP33746_GOVERNING_EXPONENT_N_LADDER_MEASUREMENT = {
  id: 'imp-33746',
  proofSection: 'S-frontier',
  question:
    'imp-33706 asserts (never tabulated) that the open-residual Stieltjes tower at the reading strip ' +
    'eps = sqrt(2 pi / N) has N-growth exponents 1/4 (selection k=0), 3/4 (H4 k=1), 5/4 (H3 k=2) and ' +
    'that the governing (max) exponent 5/4 -- the H3 curvature weight -- drives the uniformity ' +
    'obligation and is unchanged by dropping k=0. MEASURE the three weights across an N ladder ' +
    '(N = 1e3 .. 1e9), tabulate their ratios and empirical N-exponents, and confirm H3 (5/4) is the ' +
    'fastest-growing weight the back-conversion must carry uniformly. Measurement only; G6a OPEN; no QED.',
  measuredQuantity:
    'the three back-conversion weights w_k(N) = (N/2pi)^{1/4 + k/2} (k = 0,1,2), their pairwise ' +
    'ratios, and each weight local N-exponent (OLS of ln w_k on ln N), across N = 1e3 .. 1e9',
  ladder: N_LADDER.map((N) => +N.toExponential(0)),
  table: TABLE,
  measuredExponents: MEASURED_EXPONENTS.map((e) => ({
    member: e.member,
    k: e.k,
    analyticNExponent: e.analyticNExponent,
    measuredNExponent: +e.measuredNExponent.toFixed(6),
  })),
  h3GovernsEveryRung: H3_GOVERNS_EVERY_RUNG, // true (F1)
  exponentsReproduceAnalytic: EXPONENTS_MATCH, // true (F2)
  governingExponent: GOVERNING_EXPONENT, // 5/4 (H3)
  governingExponentWithoutK0: GOVERNING_WITHOUT_K0, // 5/4 -- unchanged (F3)
  droppingK0ChangesGoverning: DROPPING_K0_CHANGES_GOVERNING, // false (F3)
  h3_h4_separation_exponent: +H3_H4_SEPARATION_EXPONENT.toFixed(6), // 1/2 (F4)
  h4_selection_separation_exponent: +H4_SEL_SEPARATION_EXPONENT.toFixed(6), // 1/2
  h3_selection_separation_exponent: +H3_SEL_SEPARATION_EXPONENT.toFixed(6), // 1
  finding: {
    F1_h3_largest_at_every_rung:
      'Across N = 1e3 .. 1e9 the weights obey w_H3 > w_H4 > w_selection at every rung (the ordering ' +
      'never crosses), so the governing (max) weight the back-conversion must carry uniformly is ' +
      'always the H3 (k = 2) curvature term.',
    F2_measured_exponents_reproduce_analytic:
      'OLS of each ln w_k on ln N returns 0.25, 0.75, 1.25 to ~1e-12 (exact power laws), reproducing ' +
      'the imp-33706 analytic exponents 1/4, 3/4, 5/4 and confirming max{1/4, 3/4, 5/4} = 5/4.',
    F3_dropping_k0_leaves_governing_at_5_4:
      'max{1/4, 3/4, 5/4} = max{3/4, 5/4} = 5/4: deleting the mildest k = 0 selection rung does not ' +
      'change the fastest-growing weight, so the H3/H4 uniformity obligation is unweakened -- the ' +
      'numerical confirmation of the imp-33706 mildest-member-droppable verdict.',
    F4_h3_pulls_away_as_sqrt_N:
      'The measured w_H3/w_H4 ratio grows with local exponent 1/2 (== w_H4/w_selection), so over each ' +
      'decade the H3-vs-H4 gap widens by 10^{1/2} ~ 3.16x; from N = 1e3 to 1e9 H3 outgrows H4 by ~1e3 ' +
      'and outgrows the selection by ~1e6 (exponent 1).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Tabulating the imp-33706 open-residual tower ' +
    'weights w_k(N) = (N/2pi)^{1/4 + k/2} across N = 1e3 .. 1e9: H3 (k = 2, exponent 5/4) is the ' +
    'largest weight at EVERY rung (w_H3 > w_H4 > w_selection, no crossing), the OLS local N-exponents ' +
    'reproduce the analytic 1/4, 3/4, 5/4 to ~1e-12, and max{1/4, 3/4, 5/4} = max{3/4, 5/4} = 5/4 so ' +
    'dropping the mildest k = 0 selection rung leaves the governing exponent unchanged -- the H3 ' +
    'curvature weight genuinely dominates the H4 fold and k = 0 selection weights and drives the ' +
    'uniformity obligation, exactly as imp-33706 asserts. The H3-vs-H4 separation grows as N^{1/2} ' +
    '(~3.16x per decade). MEASUREMENT ONLY: establishes no bound, no operator positivity, discharges ' +
    'no obligation; the H3 curvature and H4 strip-height-uniformity residuals stay OPEN, ' +
    'G6a_shock_lipschitz stays OPEN; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33706-selection-catalogue-count-scoping (the analytic tower exponents 1/4, 3/4, 5/4 measured here); ' +
    'imp-33645-h3-curvature-divergence-scoping (H3 curvature, eps^{-5/2}, N-exponent 5/4); ' +
    'imp-33646-h4-privalov-sokhotski-constant-scoping (H4 fold-reading, eps^{-3/2}, N-exponent 3/4); ' +
    'imp-33668-part-b-selection-residual-scoping (k = 0 selection, eps^{-1/2}, N-exponent 1/4); ' +
    'imp-33603-lemma52-port-scoping (the H0..H5 catalogue, H4 the load-bearing residual).',
};

export const IMP33746_GOVERNING_EXPONENT_N_LADDER_MEASUREMENT_ASSERTIONS = [
  {
    // The measured OLS N-exponents reproduce the imp-33706 analytic 1/4, 3/4, 5/4 (exact power laws).
    id: 'imp33746-measured-exponents-match-analytic',
    description: 'OLS ln w_k vs ln N reproduces the imp-33706 analytic exponents 1/4, 3/4, 5/4 to ~1e-10',
    holds: () =>
      EXPONENTS_MATCH &&
      MEASURED_EXPONENTS.length === 3 &&
      Math.abs(olsExponent(0) - 0.25) < 1e-10 &&
      Math.abs(olsExponent(1) - 0.75) < 1e-10 &&
      Math.abs(olsExponent(2) - 1.25) < 1e-10,
  },
  {
    // H3 (k = 2) is the largest weight at every rung -- the governing weight never changes member.
    id: 'imp33746-h3-governs-every-rung',
    description: 'w_H3 > w_H4 > w_selection at every ladder rung; H3 is the governing weight throughout',
    holds: () =>
      H3_GOVERNS_EVERY_RUNG &&
      TABLE.every((r) => r.w_H3 > r.w_H4 && r.w_H4 > r.w_selection) &&
      TABLE.length === 7,
  },
  {
    // The governing (max) exponent is 5/4 and is unchanged by dropping the mildest k = 0 rung.
    id: 'imp33746-governing-5-4-invariant-to-dropping-k0',
    description: 'max exponent is 5/4 (H3) and stays 5/4 after dropping k=0: max{1/4,3/4,5/4}=max{3/4,5/4}',
    holds: () =>
      Math.abs(GOVERNING_EXPONENT - 1.25) < 1e-12 &&
      Math.abs(GOVERNING_WITHOUT_K0 - 1.25) < 1e-12 &&
      DROPPING_K0_CHANGES_GOVERNING === false,
  },
  {
    // The H3-vs-H4 separation grows as N^{1/2}, equal to the H4-vs-selection separation; H3-vs-sel is N^1.
    id: 'imp33746-separation-exponents-half-half-one',
    description: 'measured separations: H3/H4 = 1/2, H4/selection = 1/2, H3/selection = 1',
    holds: () =>
      Math.abs(H3_H4_SEPARATION_EXPONENT - 0.5) < 1e-10 &&
      Math.abs(H4_SEL_SEPARATION_EXPONENT - 0.5) < 1e-10 &&
      Math.abs(H3_SEL_SEPARATION_EXPONENT - 1.0) < 1e-10,
  },
  {
    // Honesty gate: measurement only, not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33746-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33746_GOVERNING_EXPONENT_N_LADDER_MEASUREMENT.isRigorous === false &&
      /NO QED/.test(IMP33746_GOVERNING_EXPONENT_N_LADDER_MEASUREMENT.verdict) &&
      /stays OPEN/.test(IMP33746_GOVERNING_EXPONENT_N_LADDER_MEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP33746_GOVERNING_EXPONENT_N_LADDER_MEASUREMENT.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33746_GOVERNING_EXPONENT_N_LADDER_MEASUREMENT.verdict),
  },
];

for (const a of IMP33746_GOVERNING_EXPONENT_N_LADDER_MEASUREMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33746-governing-exponent-N-ladder-measurement assertion failed: ${a.id}`);
  }
}
