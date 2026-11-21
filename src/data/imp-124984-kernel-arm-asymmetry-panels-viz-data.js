/**
 * @module imp-124984-kernel-arm-asymmetry-panels-viz-data
 *
 * imp-124984: import-light, two-panel chart data for the imp-124852 kernel arm-asymmetry
 * measurement. Baked from the frozen imp-124852 record (no zeros bundle, no new computation):
 *
 *   Panel 1 -- asymmetry ratio |up_offset| / |down_offset| vs the near-peak gap g, over the
 *   deep window (3 rungs, the window where imp-124852 established monotonic approach), tending
 *   to 1 as g -> 0.
 *
 *   Panel 2 -- separates the ANTISYMMETRIC leading finite-gap correction (the per-arm offset
 *   magnitude, which decays as g^(1/2)) from the higher-order SYMMETRIC residual (the summed
 *   offset up + down, which decays faster, as g^1) over the two genuine deep-window rungs (g =
 *   1e-6, 1e-7; the g = 1e-8 row is excluded, same as the imp-124852 sum-collapse fit, since its
 *   offset_sum is a double-precision subtraction-cancellation artifact, not a physical residual),
 *   so the two orders can be read off the same gap axis.
 *
 * Presentation only. Every value is reused verbatim from imp-124852 (via imp-124776); this leaf
 * only reshapes those rows into two chart-ready panels. No new kernel computation, no bound
 * moves, no operator positivity established; no refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-124852-kernel-arm-offset-asymmetry-viz-data.js (source of every value used here)
 * @see imp-124899 (the existing single-panel asymmetry-ratio + arm-offset page built on imp-124852 directly)
 */

import {
  IMP124852_DEEP_OFFSET_VS_GAP,
  IMP124852_SUM_COLLAPSE_FIT,
} from './imp-124852-kernel-arm-offset-asymmetry-viz-data.js';

// Panel 1: asymmetry ratio |up|/|down| vs gap g (deep window, 3 rungs), tending to 1 as g -> 0.
export const IMP124984_PANEL1_ASYMMETRY_RATIO_VS_GAP = Object.freeze(
  IMP124852_DEEP_OFFSET_VS_GAP.map((r) =>
    Object.freeze({
      gap: r.gap,
      asymmetry_ratio: r.asymmetry_ratio,
      distance_to_one: +(1 - r.asymmetry_ratio).toExponential(4), // -> 0 as g -> 0
    }),
  ),
);

// Panel 2: antisymmetric leading correction (per-arm offset magnitude, ~g^1/2) vs the
// higher-order symmetric residual (offset_sum magnitude, ~g^1). Same genuine-row filter as the
// imp-124852 sum-collapse fit: excludes g = 1e-8, whose offset_sum is a rounding-cancellation
// artifact (|offset_sum| < 1e-12) rather than a physical residual.
const GENUINE_FLOOR = 1e-12;
export const IMP124984_PANEL2_LEADING_VS_RESIDUAL = Object.freeze(
  IMP124852_DEEP_OFFSET_VS_GAP.filter((r) => Math.abs(r.offset_sum) > GENUINE_FLOOR).map((r) => {
    const leadingAntisymmetric = Math.abs(r.up_offset); // the g^(1/2) leading-order arm offset
    const symmetricResidual = Math.abs(r.offset_sum); // the g^1 higher-order symmetric residual
    return Object.freeze({
      gap: r.gap,
      leading_antisymmetric: +leadingAntisymmetric.toExponential(4),
      symmetric_residual: +symmetricResidual.toExponential(4),
      // how many orders of magnitude the symmetric residual sits below the leading term
      order_gap: +(leadingAntisymmetric > 0 && symmetricResidual > 0
        ? Math.log10(leadingAntisymmetric / symmetricResidual)
        : 0
      ).toFixed(3),
    });
  }),
);

export const IMP124984_SUMMARY = Object.freeze({
  isRigorous: false,
  law:
    'Panel 1: the imp-124852 arm-asymmetry ratio |up_offset|/|down_offset| climbs toward 1 as the '
    + 'near-peak gap g -> 0 (deep window, ' + IMP124984_PANEL1_ASYMMETRY_RATIO_VS_GAP.length
    + ' rungs). Panel 2: the per-arm (antisymmetric, ~g^(1/2)) offset magnitude and the summed '
    + '(symmetric, ~g^1) residual separate by a growing number of orders of magnitude as g shrinks '
    + '(genuine deep rungs, order-gap ' + IMP124984_PANEL2_LEADING_VS_RESIDUAL.map((r) => r.order_gap).join(' -> ') + ').',
  reading:
    'asymmetry ratio -> 1: ' + IMP124984_PANEL1_ASYMMETRY_RATIO_VS_GAP.map((r) => r.asymmetry_ratio).join(' -> ')
    + '; leading vs residual order-gap (genuine deep rungs): ' + IMP124984_PANEL2_LEADING_VS_RESIDUAL.map((r) => r.order_gap).join(' -> ')
    + '; symmetric-residual collapse slope ~' + IMP124852_SUM_COLLAPSE_FIT.sum_slope_p
    + ' vs per-arm slope ~' + IMP124852_SUM_COLLAPSE_FIT.arm_slope_p + '.',
  verdict:
    'PRESENTATION only. Reshapes the frozen imp-124852 arm-asymmetry record into two import-light '
    + 'chart panels (asymmetry ratio vs gap; leading antisymmetric offset vs higher-order symmetric '
    + 'residual vs gap). No new kernel computation; conditional-share diagnostic on the inherited '
    + 'imp-3220/imp-3406 extrapolation surrogate, not a rigorous asymptotic; changes no bound; '
    + 'establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124984_ASSERTIONS = [
  {
    id: 'imp124984-three-deep-two-genuine-rows',
    description: 'panel 1 carries all 3 deep-window rungs, panel 2 only the 2 genuine (non-artifact) rungs',
    holds: () =>
      IMP124984_PANEL1_ASYMMETRY_RATIO_VS_GAP.length === 3
      && IMP124984_PANEL2_LEADING_VS_RESIDUAL.length === 2,
  },
  {
    id: 'imp124984-ratio-climbs-toward-one',
    description: 'panel 1 asymmetry ratio is non-decreasing as g shrinks and its distance to 1 shrinks monotonically',
    holds: () => {
      const rows = IMP124984_PANEL1_ASYMMETRY_RATIO_VS_GAP;
      return rows.every((r, i) => i === 0 || r.asymmetry_ratio >= rows[i - 1].asymmetry_ratio)
        && rows.every((r, i) => i === 0 || Math.abs(r.distance_to_one) <= Math.abs(rows[i - 1].distance_to_one));
    },
  },
  {
    id: 'imp124984-leading-dominates-residual',
    description: 'panel 2 leading antisymmetric offset exceeds the symmetric residual at every deep rung (order_gap > 0)',
    holds: () => IMP124984_PANEL2_LEADING_VS_RESIDUAL.every((r) => r.order_gap > 0),
  },
  {
    id: 'imp124984-order-gap-widens',
    description: 'the leading-vs-residual order gap widens (or holds) as g shrinks across the deep window',
    holds: () => {
      const rows = IMP124984_PANEL2_LEADING_VS_RESIDUAL;
      return rows.every((r, i) => i === 0 || r.order_gap >= rows[i - 1].order_gap - 1e-9);
    },
  },
  {
    id: 'imp124984-honesty-gate-no-qed',
    description: 'isRigorous is false and the verdict restates no-bound-moved / NO-QED / no-refereed-bound-change honesty markers',
    holds: () =>
      IMP124984_SUMMARY.isRigorous === false
      && /no bound/.test(IMP124984_SUMMARY.verdict)
      && /NO QED/.test(IMP124984_SUMMARY.verdict)
      && /refereed bound is changed/i.test(IMP124984_SUMMARY.verdict),
  },
];

for (const assertion of IMP124984_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124984 arm-asymmetry-panels assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124984_SUMMARY;
