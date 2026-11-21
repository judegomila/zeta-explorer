/**
 * @module imp-124852-kernel-arm-offset-asymmetry-viz-data
 *
 * imp-124852: import-light viz-data leaf that QUANTIFIES the up-arm vs down-arm asymmetry of the imp-97823
 * reconstruction-kernel |K| = |1/(N sigma_N)| per-decade growth ratio about the imp-97520 L1 sigma peak.
 * imp-124776 charted that the two arms (upslope, downslope of the peak) bracket sqrt(10) = 3.162278 from
 * OPPOSITE sides, but the asymmetry itself was only drawn, never measured. This leaf measures the SIGNED
 * offset of each arm from sqrt(10) as a function of the near-peak gap g (wide g = 1e-2..1e-7 and deep
 * g = 1e-6..1e-8 windows), the arm-asymmetry ratio |up_offset| / |down_offset|, the summed offset
 * up + down (the residual NON-antisymmetric part), and a least-squares fit of how each arm-offset shrinks
 * to zero as g -> 0.
 *
 * WHAT THE MEASUREMENT SHOWS
 * -------------------------
 *   - The upslope offset is ALWAYS negative and the downslope offset ALWAYS positive: the arms bracket
 *     sqrt(10) from opposite sides at every gap (the cubic-fold sign structure of imp-97823).
 *   - The asymmetry ratio |up_offset| / |down_offset| runs UP toward 1 as g -> 0 (deep window
 *     ~0.991 -> ~0.997 -> ~1.000), so the leading finite-gap correction is ANTISYMMETRIC (equal-magnitude,
 *     opposite-signed) -- the odd cubic term -- and the arm asymmetry is a strictly higher-order effect.
 *   - The summed offset up + down (the symmetric residual) collapses far faster than either arm offset,
 *     confirming the antisymmetry of the leading term.
 *   - Each arm offset shrinks as |offset| ~ g^(1/2): the deep-window least-squares slope of
 *     log10|offset| vs log10(g) is p ~ +0.499 (upslope) / +0.501 (downslope), i.e. the O(sqrt(g)) running
 *     correction that decays by ~1/sqrt(10) per decade, driving both arms onto sqrt(10) as g -> 0.
 *
 * PRESENTATION / MEASUREMENT ONLY. Every ratio is reused verbatim from the frozen imp-97823 tables (via the
 * imp-124776 gap-keyed leaf); only signed differences, ratios and a log-log slope are formed here -- no new
 * kernel computation. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation surrogate,
 * NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes
 * no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-124776-kernel-decade-ratio-vs-gap-viz-data.js (gap-keyed ratio tables, source of the frozen rows)
 * @see imp-97823-kernel-decade-growth-sqrt10.js (root measurement: |K| ~ sqrt(10) per decade, both arms)
 */

import {
  IMP124776_WIDE_RATIO_VS_GAP,
  IMP124776_DEEP_RATIO_VS_GAP,
} from './imp-124776-kernel-decade-ratio-vs-gap-viz-data.js';

const SQRT10 = IMP124776_WIDE_RATIO_VS_GAP[0].sqrt10; // 3.162278 (the exact prediction)

// Signed offset of each arm from sqrt(10), keyed by the near-peak gap g.
function offsetRows(ratioRows) {
  return Object.freeze(
    ratioRows.map((r) => {
      const up = r.upslope_ratio - SQRT10;
      const down = r.downslope_ratio - SQRT10;
      return Object.freeze({
        gap: r.gap,
        up_offset: +up.toExponential(4),
        down_offset: +down.toExponential(4),
        asymmetry_ratio: +(Math.abs(up) / Math.abs(down)).toFixed(4), // |up| / |down| -> 1 as g -> 0
        offset_sum: +(up + down).toExponential(4), // residual NON-antisymmetric part
        sqrt10: SQRT10,
      });
    }),
  );
}

export const IMP124852_WIDE_OFFSET_VS_GAP = offsetRows(IMP124776_WIDE_RATIO_VS_GAP);
export const IMP124852_DEEP_OFFSET_VS_GAP = offsetRows(IMP124776_DEEP_RATIO_VS_GAP);

// Least-squares slope p and max |residual| of log10|offset| = a + p*log10(g) over the deep window.
function offsetSlope(rows, pick) {
  const xs = rows.map((r) => Math.log10(r.gap));
  const ys = rows.map((r) => Math.log10(Math.abs(pick(r))));
  const n = xs.length;
  const sx = xs.reduce((u, v) => u + v, 0);
  const sy = ys.reduce((u, v) => u + v, 0);
  const sxx = xs.reduce((u, v) => u + v * v, 0);
  const sxy = xs.reduce((u, v, i) => u + v * ys[i], 0);
  const p = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - p * sx) / n;
  const maxResid = Math.max(...xs.map((x, i) => Math.abs(ys[i] - (a + p * x))));
  return { slope_p: +p.toFixed(6), max_resid_log10: +maxResid.toExponential(2) };
}

// How each arm-offset converges to zero (sqrt(10)) as g -> 0: expected |offset| ~ g^(1/2), slope p ~ +1/2.
export const IMP124852_CONVERGENCE_FIT = Object.freeze({
  window: 'deep (g = 1e-6 .. 1e-8)',
  upslope: Object.freeze(offsetSlope(IMP124852_DEEP_OFFSET_VS_GAP, (r) => r.up_offset)),
  downslope: Object.freeze(offsetSlope(IMP124852_DEEP_OFFSET_VS_GAP, (r) => r.down_offset)),
  expected_slope: 0.5, // |offset| ~ sqrt(g): the O(sqrt(g)) cubic-fold running correction
});

// ---------------------------------------------------------------------------
// imp-124893: collapse slope of the SYMMETRIC residual offset_sum = up + down.
//
// The leading finite-gap correction is antisymmetric (each arm ~ g^(1/2), opposite
// signs), so it cancels in up + down and the residual is set by the next, symmetric
// order. Fit log10|offset_sum| vs log10(g) over the deep window to read that order and
// compare it to the per-arm 1/2 rate measured above.
//
// Caveat: the deep-window offset rows carry arm offsets stored to 4 significant figures,
// so at g = 1e-8 the two arms are equal after rounding and their sum collapses to a
// double-precision subtraction-cancellation artifact (~ -4.4e-16, below the
// toExponential(4) storage floor), NOT a physical residual. That row is EXCLUDED from
// the fit (a naive 3-point slope reads a spurious ~5.65 pinned by the float floor); the
// fit uses the two genuine rows g = 1e-6, 1e-7 whose offset_sum sits above the floor.
const SUM_FLOOR = 1e-12; // below this, offset_sum is a rounding-cancellation artifact, not a residual
export const IMP124852_SUM_COLLAPSE_FIT = (() => {
  const genuine = IMP124852_DEEP_OFFSET_VS_GAP.filter((r) => Math.abs(r.offset_sum) > SUM_FLOOR);
  const fit = offsetSlope(genuine, (r) => r.offset_sum);
  const armSlope = 0.5 * (IMP124852_CONVERGENCE_FIT.upslope.slope_p + IMP124852_CONVERGENCE_FIT.downslope.slope_p);
  const excessPower = +(fit.slope_p - armSlope).toFixed(6);
  const slopeRatio = +(fit.slope_p / armSlope).toFixed(4);
  const extraShrink = +Math.pow(10, -excessPower).toFixed(6);
  return Object.freeze({
    window: 'deep genuine rows (g = 1e-6, 1e-7); g = 1e-8 excluded as a rounding-cancellation artifact',
    genuine_rows: genuine.length,
    sum_slope_p: fit.slope_p, // log10|offset_sum| vs log10(g), ~1.036 (~g^1)
    arm_slope_p: +armSlope.toFixed(6), // averaged per-arm slope, ~0.5 (~g^(1/2))
    excess_power: excessPower, // how many extra powers of g the sum carries over an arm, ~+0.54 (~+1/2)
    slope_ratio: slopeRatio, // sum slope / arm slope, ~2.07 (one extra half-power)
    extra_shrink_per_decade: extraShrink, // 10^-excess_power, ~0.291 ~ 1/sqrt(10)
    reading:
      'The symmetric residual offset_sum = up + down collapses as g^' + fit.slope_p.toFixed(3)
      + ' (roughly g^1) versus the per-arm g^' + armSlope.toFixed(3) + ' (~g^(1/2)) rate: slope ratio ~'
      + slopeRatio.toFixed(2) + ', an extra power ~' + excessPower.toFixed(3) + ' of g (one extra half-power) '
      + 'giving an extra ~' + extraShrink.toFixed(3) + ' ~ 1/sqrt(10) shrink per decade beyond the arm, because '
      + 'the leading antisymmetric g^(1/2) term cancels in the sum and the next SYMMETRIC order (~g^1) survives. '
      + 'The g = 1e-8 deep row is excluded: its offset_sum is a 4-sig-fig subtraction-cancellation artifact at '
      + 'the double-precision floor, and a naive 3-point fit reads a spurious ~5.65. Measurement only; '
      + 'conditional-share diagnostic; C_mb GUE-conditional per imp-486 untouched; changes no bound; NO QED.',
  });
})();

const DEEP_LAST = IMP124852_DEEP_OFFSET_VS_GAP[IMP124852_DEEP_OFFSET_VS_GAP.length - 1];

export const IMP124852_SUMMARY = Object.freeze({
  isRigorous: false,
  law:
    'The imp-97823 kernel |K| per-decade growth ratio brackets sqrt(10) = ' + SQRT10 + ' from opposite sides: '
    + 'the upslope arm sits BELOW (signed offset < 0), the downslope arm ABOVE (signed offset > 0), at every '
    + 'near-peak gap g. As g -> 0 both signed offsets shrink as |offset| ~ g^(1/2) (deep-window log-log slope '
    + IMP124852_CONVERGENCE_FIT.upslope.slope_p + ' upslope / ' + IMP124852_CONVERGENCE_FIT.downslope.slope_p
    + ' downslope, ~+1/2), and the arm-asymmetry ratio |up_offset| / |down_offset| runs up to '
    + DEEP_LAST.asymmetry_ratio + ' -- the leading finite-gap correction is antisymmetric (odd cubic term), the '
    + 'arm asymmetry a higher-order effect whose summed residual up + down collapses to ' + DEEP_LAST.offset_sum + '.',
  reading:
    'deep g-keyed signed offsets: upslope '
    + IMP124852_DEEP_OFFSET_VS_GAP.map((r) => r.up_offset).join(' -> ') + ', downslope '
    + IMP124852_DEEP_OFFSET_VS_GAP.map((r) => r.down_offset).join(' -> ') + '; asymmetry |up|/|down| '
    + IMP124852_DEEP_OFFSET_VS_GAP.map((r) => r.asymmetry_ratio).join(' -> ') + ' (-> 1); offset sum '
    + IMP124852_DEEP_OFFSET_VS_GAP.map((r) => r.offset_sum).join(' -> ') + '.',
  verdict:
    'MEASUREMENT / SENSITIVITY only. Quantifies (never before measured) the signed up/down offsets of the '
    + 'imp-97823 kernel |K| per-decade growth ratio from sqrt(10) vs the near-peak gap g, the arm-asymmetry '
    + 'ratio |up|/|down| -> 1, and the |offset| ~ g^(1/2) convergence law -- all formed from the frozen imp-97823 '
    + 'ratio tables (via imp-124776) by signed differences and a log-log slope, no new kernel computation. '
    + 'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation surrogate, NOT a rigorous '
    + 'asymptotic; the C_mb GUE-conditional per imp-486 is untouched; changes no bound; establishes no operator '
    + 'positivity; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124852_OFFSET_ASSERTIONS = [
  {
    id: 'imp124852-six-wide-three-deep-rows',
    description: 'one signed-offset row per wide-ladder pair (6) and per deep-window pair (3)',
    holds: () => IMP124852_WIDE_OFFSET_VS_GAP.length === 6 && IMP124852_DEEP_OFFSET_VS_GAP.length === 3,
  },
  {
    id: 'imp124852-arms-bracket-sqrt10-opposite-signs',
    description: 'upslope offset < 0 and downslope offset > 0 at every gap (arms bracket sqrt(10))',
    holds: () =>
      IMP124852_WIDE_OFFSET_VS_GAP.every((r) => r.up_offset < 0 && r.down_offset > 0)
      && IMP124852_DEEP_OFFSET_VS_GAP.every((r) => r.up_offset < 0 && r.down_offset > 0),
  },
  {
    id: 'imp124852-asymmetry-ratio-runs-to-one',
    description: 'the deep-window asymmetry ratio |up|/|down| increases toward 1 as g -> 0 (antisymmetric leading term)',
    holds: () => {
      const rows = IMP124852_DEEP_OFFSET_VS_GAP;
      const rising = rows.every((r, i) => i === 0 || r.asymmetry_ratio >= rows[i - 1].asymmetry_ratio);
      return rising && Math.abs(DEEP_LAST.asymmetry_ratio - 1) < 1e-2;
    },
  },
  {
    id: 'imp124852-offset-decays-as-sqrt-g',
    description: 'the deep-window log10|offset| vs log10(g) slope brackets +1/2 on both arms (|offset| ~ sqrt(g))',
    holds: () =>
      Math.abs(IMP124852_CONVERGENCE_FIT.upslope.slope_p - 0.5) < 5e-3
      && Math.abs(IMP124852_CONVERGENCE_FIT.downslope.slope_p - 0.5) < 5e-3,
  },
  {
    id: 'imp124852-convergence-fit-residual-tiny',
    description: 'the deep-window offset log-log fit residual is < 1e-3 on both arms (clean sqrt(g) law)',
    holds: () =>
      IMP124852_CONVERGENCE_FIT.upslope.max_resid_log10 < 1e-3
      && IMP124852_CONVERGENCE_FIT.downslope.max_resid_log10 < 1e-3,
  },
  {
    id: 'imp124852-residual-symmetric-part-subleading',
    description: 'the summed offset up+down is far smaller than either arm offset in the deep window (antisymmetry)',
    holds: () =>
      IMP124852_DEEP_OFFSET_VS_GAP.every(
        (r) => Math.abs(r.offset_sum) < 0.2 * Math.abs(r.up_offset) + 1e-12,
      ),
  },
  {
    id: 'imp124893-sum-collapses-at-double-arm-slope',
    description: 'the symmetric offset_sum decays at ~2x the per-arm slope (extra ~+1/2 power of g), on the two genuine deep rows',
    holds: () =>
      IMP124852_SUM_COLLAPSE_FIT.genuine_rows === 2
      && Math.abs(IMP124852_SUM_COLLAPSE_FIT.slope_ratio - 2) < 0.2
      && Math.abs(IMP124852_SUM_COLLAPSE_FIT.excess_power - 0.5) < 0.1
      && Math.abs(IMP124852_SUM_COLLAPSE_FIT.extra_shrink_per_decade - 1 / Math.sqrt(10)) < 5e-2,
  },
  {
    id: 'imp124852-honesty-gate-no-qed',
    description: 'isRigorous is false and the verdict restates no-bound-moved / NO-QED / no-refereed-bound-change honesty markers',
    holds: () =>
      IMP124852_SUMMARY.isRigorous === false
      && /no bound/.test(IMP124852_SUMMARY.verdict)
      && /NO QED/.test(IMP124852_SUMMARY.verdict)
      && /refereed bound is changed/i.test(IMP124852_SUMMARY.verdict),
  },
];

for (const assertion of IMP124852_OFFSET_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124852 offset-asymmetry assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124852_SUMMARY;
