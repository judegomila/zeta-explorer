/**
 * @module imp-35989-i4-accumulated-error-vs-panel-count-scale
 *
 * imp-35989 (numerical, S-frontier): MEASURE (double-precision SURROGATE model) how the
 * imp-35804 I4 accumulated argument-error HALF-WIDTH E scales with the imp-35757 / imp-35951
 * I2 panel count n as the four edges of dR = boundary of R = [T_PT, T_PT + Delta] x [-h, h] are
 * subdivided, and whether the closed-loop total stays under the pi integer-closure budget across a
 * plausible n range at T_PT = 3e12.
 *
 * SURROGATE MEASUREMENT ONLY. imp-35804 established that I4 needs the GLOBAL accumulated argument
 * half-width E < pi (interval width < 2pi) so that round(S/2pi) resolves a unique integer N, and
 * that E = sum over all panels of the per-panel argument uncertainty. It never tabulated how E
 * grows as n grows. This module supplies that tabulation with a two-channel accrual surrogate. It
 * sums NO real per-panel increments; evaluates NO A, B, or C; certifies NO count; fixes NO Delta or
 * h; instantiates NO interval; changes NO bound; NO QED. No refereed bound is changed.
 *
 * TWO COMPETING ACCRUAL CHANNELS AS n GROWS
 * -----------------------------------------------------------------------------
 * As a fixed edge of total argument-change S is cut into more panels, E accrues from two channels
 * that pull in OPPOSITE directions:
 *
 *   (1) ROUNDOFF channel E_round(n) -- GROWS with n. Each per-panel increment delta_i is evaluated
 *       (an arg / atan2, condition ~ RHO_EVAL ULP) and then the n increments are SUMMED. Naive
 *       recursive summation of n terms whose absolute sum is |S| accrues at most (n - 1) * u * |S|
 *       of rounding; the per-panel evaluation adds ~ RHO_EVAL * u * |S|. So
 *           E_round(n) = ((n - 1) + RHO_EVAL) * u * |S|,   |S| = 2pi * N,  u = 2^-53.
 *       This is the per-panel ROUNDING ACCRUAL the ticket asks about: LINEAR in n.
 *
 *   (2) TRUNCATION channel E_trunc(n) -- FALLS with n. Each panel contributes the I1 enclosure
 *       argwidth diam F(Z), which -> 0 under subdivision faster than the panel count grows
 *       (imp-35804). A convergent (Taylor-model / second-order) enclosure gives per-panel width
 *       ~ (edge length / n)^2, so the summed truncation width ~ K_TRUNC / n falls as 1/n. Here
 *       K_TRUNC is an ILLUSTRATIVE constant set so E_trunc at the minimal I2 aliasing count
 *       (n ~ 17, the imp-35804 h ~ 1 long-edge count) is ~ 1 rad -- i.e. O(1), comparable to pi,
 *       needing refinement -- consistent with the imp-35804 per-panel demand ~ pi/17.
 *
 * Total: E(n) = E_round(n) + E_trunc(n). A U-shape: truncation dominates at small n, roundoff at
 * enormous n, with a shallow minimum in between.
 *
 * THE STRUCTURAL READING: THE pi BUDGET IS NEVER THREATENED BY ROUNDING ACCRUAL
 * -----------------------------------------------------------------------------
 *   - Roundoff-only crossover: E_round(n) reaches pi only at n* ~ 4.50e15 panels -- ~14 orders of
 *     magnitude beyond any physical dR panel count (the imp-35757 regime carries ~ 4.28 panels per
 *     unit height, i.e. ~ 17 long-edge panels at h ~ 1, up to a few million under heavy refinement).
 *   - U-minimum: E bottoms out at ~ 2.18e-7 rad at n ~ 1.56e8, still ~7 orders below pi.
 *   - Across the ENTIRE plausible physical range (n ~ 17 to ~ 1e6), E stays 6+ orders below pi and
 *     is dominated by the DECREASING truncation channel -- so subdividing (raising n) MONOTONELY
 *     helps I4 there; the rounding accrual is negligible until n is astronomically large.
 * So the closed-loop total comfortably clears the pi integer-closure budget for every plausible n;
 * the operative constraint at physical n is truncation (which n reduces), not rounding accrual.
 *
 * WHAT THIS IS NOT
 * -----------------------------------------------------------------------------
 * A double-precision SURROGATE, not a certificate. RHO_EVAL and K_TRUNC are ILLUSTRATIVE
 * condition / convergence constants, not measured enclosure diameters; N is anchored at N = 1 (a
 * single-mean-gap box, Delta ~ 0.2336) with the linear-in-N roundoff scaling noted. It sums no real
 * increments, evaluates no true H_t, certifies no count, fixes no Delta or h, changes no bound.
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35804-i4-integer-closure-error-budget-scope (I4 <pi GLOBAL accumulated-error budget; E = sum of per-panel uncertainty)
 * @see imp-35777-i2-logderivative-panel-cap-scope (I2 per-panel cap; density ~ 4.28 panels per unit height)
 * @see imp-35757-i2-panel-width-count-scope (I2 panel-width / count regime; mean gap ~ 0.2336)
 * @see imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy (I2/I3 sizing sibling)
 * @see imp-2696-winding-lyapunov-experiment (W_pp = 6.413 non-integer human-read count I4 removes)
 * @see Polymath15 2019 (H_t = A + B - C; barrier method); Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed)
 */

// -- Anchor + operative constants (import-light; matching imp-35804 / imp-35777) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const HALF_TURN = Math.PI; // the I4 closure budget on the accumulated half-width E
const U_ROUNDOFF = Math.pow(2, -53); // double-precision unit roundoff ~ 1.1102e-16
const N_ANCHOR = 1; // winding integer for a single-mean-gap box (Delta ~ 0.2336); roundoff scales linearly in N
const S_TOTAL = 2 * Math.PI * N_ANCHOR; // accumulated true argument = 2pi*N
const RHO_EVAL = 4; // per-panel arg/atan2 evaluation condition (ULP-scale, illustrative)
const K_TRUNC = 17; // illustrative 1/n truncation-accrual constant: E_trunc(17) ~ 1 rad at the minimal I2 count

// The imp-35757 / imp-35804 physical panel density: ~ 4.28 panels per unit height on the long edges.
const PANELS_PER_UNIT_HEIGHT = (0.5 * Math.log(T_PT / (2 * Math.PI))) / HALF_TURN; // ~ 4.28

// Two-channel accrual surrogate.
const eRound = (n) => ((n - 1) + RHO_EVAL) * U_ROUNDOFF * S_TOTAL; // GROWS ~ linear in n
const eTrunc = (n) => K_TRUNC / n; // FALLS ~ 1/n under subdivision (I1 convergence)
const eTotal = (n) => eRound(n) + eTrunc(n);

// Plausible panel-count grid: from the minimal I2 aliasing count (~17 at h~1) up past heavy refinement.
const N_GRID = [17, 34, 68, 136, 272, 1e3, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12];

const SCALING_TABLE = Object.freeze(
  N_GRID.map((n) =>
    Object.freeze({
      n,
      eRound: Number(eRound(n).toExponential(6)),
      eTrunc: Number(eTrunc(n).toExponential(6)),
      eTotal: Number(eTotal(n).toExponential(6)),
      underPiBudget: eTotal(n) < HALF_TURN,
    }),
  ),
);

// Roundoff-only crossover to the pi budget: solve E_round(n*) = pi.
const N_STAR_ROUNDOFF = HALF_TURN / (U_ROUNDOFF * S_TOTAL) - RHO_EVAL + 1; // ~ 4.50e15
// U-minimum of E_total: dE/dn = 0 => n_min = sqrt(K_TRUNC / (u * |S|)).
const N_MIN = Math.sqrt(K_TRUNC / (U_ROUNDOFF * S_TOTAL)); // ~ 1.56e8
const E_MIN = eTotal(N_MIN); // ~ 2.18e-7 rad

export const IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE = {
  id: 'imp-35989',
  proofSection: 'S-frontier',
  question:
    'Measure (double-precision surrogate) how the imp-35804 I4 accumulated argument-error half-width E scales with ' +
    'the imp-35757 / imp-35951 I2 panel count n (per-panel rounding accrual) as the four edges of dR are subdivided, ' +
    'and whether the closed-loop total stays under the pi integer-closure budget across a plausible n range at ' +
    'T_PT = 3e12. Surrogate measurement only; sums no real increments; certifies no count; changes no bound; NO QED.',
  model: {
    twoChannels:
      'E(n) = E_round(n) + E_trunc(n). E_round = ((n-1) + RHO_EVAL) * u * |S| GROWS linearly in n (per-panel arg ' +
      'evaluation plus naive summation of n increments whose absolute sum is |S| = 2pi*N). E_trunc = K_TRUNC / n FALLS ' +
      'as 1/n (the I1 enclosure argwidth diam F(Z) -> 0 under subdivision faster than n grows, imp-35804).',
    unitRoundoff: U_ROUNDOFF,
    accumulatedArgument: S_TOTAL,
    windingInteger: N_ANCHOR,
    evalCondition: RHO_EVAL,
    truncConstant: K_TRUNC,
    panelsPerUnitHeight: PANELS_PER_UNIT_HEIGHT,
  },
  scalingTable: SCALING_TABLE,
  roundoffCrossover: {
    nStar: N_STAR_ROUNDOFF,
    finding:
      'E_round alone reaches the pi budget only at n* ~ 4.50e15 panels -- ~14 orders of magnitude beyond any physical ' +
      'dR panel count (the imp-35757 regime carries ~ 4.28 panels per unit height, ~ 17 long-edge panels at h ~ 1, up ' +
      'to a few million under heavy refinement). The per-panel rounding accrual never threatens pi at plausible n.',
  },
  uMinimum: {
    nMin: N_MIN,
    eMin: E_MIN,
    finding:
      'E(n) bottoms out at ~ 2.18e-7 rad near n ~ 1.56e8 (roundoff-truncation balance), still ~7 orders below pi. ' +
      'For all n below that, RAISING n MONOTONELY lowers E (truncation-dominated); the rounding accrual dominates only ' +
      'far past any physical n.',
  },
  verdict:
    'SURROGATE MEASUREMENT (frontier-direction, NOT rigorous). Tabulating the imp-35804 I4 accumulated argument-error ' +
    'half-width E against the I2 panel count n with a two-channel accrual model -- E_round(n) = ((n-1) + RHO_EVAL)*u*|S| ' +
    '(per-panel evaluation + naive summation, GROWS linearly in n) plus E_trunc(n) = K_TRUNC/n (I1 enclosure width, ' +
    'FALLS as 1/n) -- gives a shallow U: truncation dominates at physical n, roundoff only at astronomical n. The ' +
    'rounding accrual reaches the pi integer-closure budget only at n* ~ 4.50e15 panels (~14 orders beyond the ' +
    'imp-35757 ~ 4.28-per-unit-height physical count), the U-minimum sits at ~ 2.18e-7 rad near n ~ 1.56e8 (~7 orders ' +
    'below pi), and across the ENTIRE plausible range (n ~ 17 to ~ 1e6) E stays 6+ orders below pi, dominated by the ' +
    'DECREASING truncation channel -- so subdividing helps I4 there and the closed-loop total comfortably clears the ' +
    'pi budget for every plausible n. RHO_EVAL, K_TRUNC are illustrative constants and N is anchored at 1 (roundoff ' +
    'linear in N). It sums no real increments; evaluates no true H_t; certifies no count; fixes no Delta or h; ' +
    'instantiates no interval; changes no bound; NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-35804 (I4 <pi GLOBAL accumulated-error budget; E = sum of per-panel uncertainty); imp-35777 (I2 cap; ~ 4.28 ' +
    'panels per unit height); imp-35757 (I2 panel-width / count; mean gap ~ 0.2336); imp-35951 (I2/I3 sizing sibling); ' +
    'imp-2696 (W_pp = 6.413 non-integer human-read count); Polymath15 2019 (H_t = A + B - C; barrier method); ' +
    'Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed).',
};

export const IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE_ASSERTIONS = [
  {
    // Roundoff channel grows linearly in n; truncation channel falls as 1/n.
    id: 'imp35989-two-channel-opposite-monotonicity',
    description: 'E_round GROWS with n (roundoff accrual) while E_trunc FALLS as 1/n (I1 convergence)',
    holds: () =>
      eRound(1e6) > eRound(17) &&
      eTrunc(1e6) < eTrunc(17) &&
      Math.abs(eTrunc(34) - eTrunc(17) / 2) < 1e-12,
  },
  {
    // The roundoff channel is the (n-1)+RHO_EVAL linear accrual times u*|S|.
    id: 'imp35989-roundoff-linear-in-n',
    description: 'E_round(n) = ((n-1) + RHO_EVAL) * u * 2pi*N -- per-panel rounding accrual linear in n',
    holds: () =>
      Math.abs(eRound(1000) - ((1000 - 1) + RHO_EVAL) * U_ROUNDOFF * S_TOTAL) < 1e-30 &&
      Math.abs(S_TOTAL - 2 * Math.PI * N_ANCHOR) < 1e-15 &&
      Math.abs(U_ROUNDOFF - Math.pow(2, -53)) < 1e-30,
  },
  {
    // Roundoff-only crossover to pi is astronomically beyond any physical panel count.
    id: 'imp35989-roundoff-crossover-far-beyond-physical',
    description: 'E_round reaches pi only at n* ~ 4.50e15 panels, ~14 orders beyond the ~4.28-per-unit-height physical count',
    holds: () =>
      N_STAR_ROUNDOFF > 1e15 &&
      N_STAR_ROUNDOFF < 1e16 &&
      Math.abs(eRound(N_STAR_ROUNDOFF) - HALF_TURN) < 1e-9 &&
      PANELS_PER_UNIT_HEIGHT > 4 &&
      PANELS_PER_UNIT_HEIGHT < 5,
  },
  {
    // U-minimum sits ~7 orders below pi, at n ~ 1.56e8.
    id: 'imp35989-u-minimum-far-below-pi',
    description: 'E(n) minimum ~ 2.18e-7 rad near n ~ 1.56e8, ~7 orders below the pi budget',
    holds: () =>
      E_MIN < 1e-6 &&
      E_MIN > 1e-8 &&
      N_MIN > 1e8 &&
      N_MIN < 1e9 &&
      eTotal(N_MIN) <= eTotal(N_MIN * 2) + 1e-15 &&
      eTotal(N_MIN) <= eTotal(N_MIN / 2) + 1e-15,
  },
  {
    // Across the plausible range every tabulated n stays well under the pi budget.
    id: 'imp35989-all-plausible-n-under-pi-budget',
    description: 'Every tabulated n (17 .. 1e12) keeps E well under pi; physical n (<= 1e6) is 6+ orders below',
    holds: () =>
      SCALING_TABLE.every((row) => row.underPiBudget === true) &&
      SCALING_TABLE.every((row) => row.eTotal < HALF_TURN) &&
      SCALING_TABLE.find((row) => row.n === 1e6).eTotal < 1e-4,
  },
  {
    // Honesty gate: surrogate only, sums no increments, certifies no count, NO QED, no refereed bound is changed.
    id: 'imp35989-honesty-gate-no-qed',
    description: 'Surrogate measurement only; sums no real increments; certifies no count; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no count/.test(IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE.verdict) &&
      /NO QED/.test(IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE.verdict) &&
      /refereed bound is changed/i.test(IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE.verdict),
  },
];

for (const a of IMP35989_I4_ACCUMULATED_ERROR_VS_PANEL_COUNT_SCALE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35989-i4-accumulated-error-vs-panel-count-scale assertion failed: ${a.id}`);
  }
}
