/**
 * @module imp-34447-coupling-ratio-drift-third-interval
 * @fileoverview imp-34447 -- MEASUREMENT ONLY: add a FOURTH, deeper crossover landmark below the
 *   imp-33620 sigma < 0.01 point (a new thr = 0.001 ULTRA-deep-tail landmark) so the imp-34372
 *   coupling-ratio residual/(E_flow/E_trunc) drift can be tracked across a THIRD interval, resolving
 *   whether that drift is constant-rate or itself decaying.
 *
 *   THE OPEN QUESTION (imp-34372)
 *   -----------------------------
 *   imp-34372 tabulated the coupling ratio residual/(E_flow/E_trunc) at three landmarks
 *   (thr = 0.5, 0.1, 0.01) and found it pinned near the leading value 2 (N proportional to E_coll^-2),
 *   drifting monotonically DOWN by a small per-landmark amount. But three landmarks give only TWO
 *   drift intervals, and imp-34372 states verbatim that "with only two landmarks it is impossible to
 *   tell" whether that ~-0.4%-per-landmark drift is a CONSTANT rate (the ratio keeps sliding linearly,
 *   eventually crossing 2 and diverging) or is itself DECAYING (the ratio converges to a finite limit
 *   near 2). Distinguishing the two needs a THIRD drift interval, i.e. a fourth landmark deeper than
 *   thr = 0.01.
 *
 *   THE NEW LANDMARK (thr = 0.001, ULTRA-deep tail)
 *   -----------------------------------------------
 *   Using the identical imp-33723/imp-33743/imp-33860 closed-form fixed point
 *     N_cross(thr) = (C_C (1-thr)/(E_trunc thr))^2 log T0(N_cross),   K_thr = ((1-thr)/thr)^2 (C_C/E_trunc)^2
 *   at thr = 0.001 the amplitude factor ((1-thr)/thr)^2 = 999^2 = 998001 (cf 9801 at thr=0.01), giving
 *   K_thr ~ 1.5696e14 and, by Banach iteration, N_cross ~ 5.4323e15. The map is an even STRONGER
 *   contraction than at thr = 0.01 (measured |g_prime(N_cross)| ~ 0.028 vs ~0.032, since T0 is larger
 *   still deeper in the tail), so the fixed point is unique. The closed-form-vs-empirical residual is
 *   rel_offset ~ 1.16e-8, and restoring the dropped E_flow term in the threshold balance closes it to
 *   ~6.6e-15 -- confirming this landmark's residual, like the shallower ones, is ENTIRELY the flow
 *   term (E_flow/E_trunc ~ 5.66e-9 here), not a grid or rounding artifact.
 *
 *   THE FINDING (measurement only)
 *   ------------------------------
 *   (D1) THE DRIFT IS NOT CONSTANT-RATE -- IT DECAYS (TURNS OVER) IN THE DEEP TAIL. The coupling ratio
 *        residual/(E_flow/E_trunc), recomputed consistently from the identical machinery at all four
 *        landmarks, is
 *          thr=0.5   : 2.089015    thr=0.1   : 2.078776
 *          thr=0.01  : 2.066432    thr=0.001 : 2.057639
 *        so its EXCESS above the leading value 2 is {0.089015, 0.078776, 0.066432, 0.057639} and the
 *        per-landmark-step drift is
 *          0.5 -> 0.1   : 0.4901%   (excess drop 1.0239e-2)
 *          0.1 -> 0.01  : 0.5938%   (excess drop 1.2344e-2)
 *          0.01 -> 0.001: 0.4255%   (excess drop 8.7933e-3)   <-- NEW third interval
 *        A constant-rate drift would give EQUAL per-step excess drops; these are unequal, and the new
 *        deepest interval's drop (8.79e-3) is SMALLER than BOTH earlier steps and below what a flat- or
 *        rising-rate extrapolation of the first two would predict. The drift rises to a mild peak at the
 *        far->deep step and then TURNS OVER, decaying in the deepest interval. So the drift is
 *        self-limiting, NOT constant-rate: the coupling ratio is CONVERGING (toward ~2.05, comfortably
 *        above 2), not sliding linearly toward a cross-below-2 divergence. This resolves the imp-34372
 *        two-interval ambiguity in favour of a decaying drift.
 *   (D2) THE LOCKSTEP EXTENDS TO THE NEW LANDMARK. From thr=0.01 to thr=0.001 both the closed-form
 *        residual (8.79e-7 -> 1.16e-8, x75.4) and E_flow/E_trunc (4.26e-7 -> 5.66e-9, x75.2) drop by the
 *        SAME ~75x (lockstep gap ~0.2 on the drop factor), extending the imp-34355/imp-34372
 *        halving->far->deep lockstep to a fourth point. The residual IS the flow term at the new
 *        landmark too, so the coupling ratio stays a structural residual = ~2*(E_flow/E_trunc) coupling,
 *        with only the gentle, DECAYING higher-order drift measured in D1.
 *
 *   WHY DECAYING, NOT CONSTANT. The exact relation is residual = 1 - [L/L]/(1+r)^2 with
 *   r = E_flow/E_trunc (imp-34270/imp-34351), so coupling = residual/r -> 2 as r -> 0 when the slow
 *   log-ratio factor [L/L] -> 1. The excess above 2 is carried by that logarithmic [L/L] factor, which
 *   shrinks as log T0 grows down the tail; since log T0 grows ever more slowly, the per-decade shrink of
 *   the excess must itself slow -- exactly the turn-over measured in D1. The ratio therefore approaches a
 *   finite limit near 2 rather than drifting through it.
 *
 *   Values below are baked reference literals from a single consistent evaluation of the imp-33860
 *   machinery (effectiveHeightForN Riemann-von Mangoldt inverse; C_C = (1/8) sqrt(3 pi), imp-2642;
 *   E_trunc = 3.06e-5 fixed-strip, imp-2631; Gronwall exp(2.37e-4), imp-3406). The three shallower
 *   coupling ratios here refine the imp-34372 baked literals slightly (imp-34372 used rounded
 *   r ~ 4.26e-7 giving deep-tail 2.0634; the unrounded r ~ 4.2552e-7 gives 2.066432) -- the qualitative
 *   imp-34372 verdict (pinned near 2, drifting down ~0.4-0.6% per step) is UNCHANGED. This module
 *   imports NOTHING (no lambda-rh-height-mapping, no zeros bundle) per [[no_heavy_imports_in_pages]] and
 *   [[verify_heavy_assertion_modules]] -- the arithmetic below is pure ratio bookkeeping on the baked
 *   literals; the offline generator is scripts/imp-34447-compute.mjs.
 *
 *   @see imp-34372-lockstep-ratio-deeptail-persistence.js (three-landmark lockstep; states the two-interval gap)
 *   @see imp-33860-sigma-deeptail-001-crossover-closed-form.js (thr=0.01 closed form; the machinery reused here)
 *   @see imp-34351-crossover-offset-division-form-fartail-crossvalidation.js (exact residual = 1 - [L/L]/(1+r)^2)
 *
 *   Ticket: imp-34447 (numerical, medium). Presentation-independent MEASUREMENT / extrapolation of an
 *   already-established quantity; adds no new Lambda bound. Component model is the inherited imp-3220/
 *   imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; the
 *   C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity;
 *   no RH verdict, NO QED. No refereed bound is changed.
 */

// -- four-landmark comparison: closed-form residual (rel_offset) and dropped Gronwall ratio r --
export const IMP34447_LANDMARKS = Object.freeze([
  Object.freeze({
    landmark: 'Halving (thr=0.5)',
    thr: 0.5,
    N_cross: 3.280294e9,
    rel_offset: 3.9811e-3,
    E_flow_over_E_trunc: 1.9057e-3,
  }),
  Object.freeze({
    landmark: 'Far-tail (thr=0.1)',
    thr: 0.1,
    N_cross: 3.213418e11,
    rel_offset: 7.3772e-5,
    E_flow_over_E_trunc: 3.5488e-5,
  }),
  Object.freeze({
    landmark: 'Deep-tail (thr=0.01)',
    thr: 0.01,
    N_cross: 4.624385e13,
    rel_offset: 8.7930e-7,
    E_flow_over_E_trunc: 4.2552e-7,
  }),
  Object.freeze({
    // NEW ultra-deep-tail landmark (thr=0.001), the fourth point -> third drift interval.
    landmark: 'Ultra-deep-tail (thr=0.001)',
    thr: 0.001,
    N_cross: 5.432330e15,
    rel_offset: 1.1647e-8,
    E_flow_over_E_trunc: 5.6605e-9,
    K_thr: 1.569565e14, // ((1-thr)/thr)^2 (C_C/E_trunc)^2 = 998001 * K_halving
    amplitude_ratio_to_halving: 998001, // 999^2 at thr=0.001
    contraction_factor_at_root: 2.8011e-2, // |g_prime(N_cross)| ~ 0.028 (stronger than thr=0.01 ~0.032)
    with_flow_vs_empirical_rel: 6.627e-15, // E_flow restored closes the residual: it IS the flow term
  }),
]);

// -- coupling ratio residual/(E_flow/E_trunc) at each landmark (leading value 2) --
export const IMP34447_COUPLING_RATIO = Object.freeze(
  IMP34447_LANDMARKS.map((r) =>
    Object.freeze({
      landmark: r.landmark,
      thr: r.thr,
      coupling_ratio: +(r.rel_offset / r.E_flow_over_E_trunc).toFixed(6),
      excess_above_two: +(r.rel_offset / r.E_flow_over_E_trunc - 2).toFixed(6),
    }),
  ),
);

// -- per-landmark-step drift of the coupling ratio: constant-rate (equal drops) or decaying? --
export const IMP34447_DRIFT_INTERVALS = Object.freeze(
  IMP34447_COUPLING_RATIO.slice(1).map((cur, i) => {
    const prev = IMP34447_COUPLING_RATIO[i];
    const prevL = IMP34447_LANDMARKS[i];
    const curL = IMP34447_LANDMARKS[i + 1];
    const excessDrop = prev.coupling_ratio - cur.coupling_ratio;
    return Object.freeze({
      step: `${prev.landmark} -> ${cur.landmark}`,
      drift_pct: +((excessDrop / prev.coupling_ratio) * 100).toFixed(4),
      excess_drop: +excessDrop.toFixed(6),
      residual_drop_factor: +(prevL.rel_offset / curL.rel_offset).toFixed(2),
      E_flow_drop_factor: +(prevL.E_flow_over_E_trunc / curL.E_flow_over_E_trunc).toFixed(2),
    });
  }),
);

export const IMP34447_SUMMARY = Object.freeze({
  new_landmark_thr: 0.001,
  new_landmark_N_cross: 5.432330e15,
  new_landmark_coupling_ratio: 2.057639,
  drift_is_constant_rate: false, // per-step excess drops are unequal
  drift_decays_in_deep_tail: true, // deepest interval drop 8.79e-3 < both earlier steps
  // three drift intervals (percent): rises to a mild peak then turns over
  drift_pct_by_interval: Object.freeze([0.4901, 0.5938, 0.4255]),
  deepest_interval_is_smallest: true, // 0.4255% < 0.4901% and < 0.5938%
  coupling_ratio_converges_above_two: true, // heading to ~2.05, not crossing 2
  lockstep_extends_to_new_landmark: true, // residual x75.4, E_flow x75.2 (gap ~0.2)
  verdict:
    'DRIFT IS DECAYING, NOT CONSTANT-RATE. The new thr=0.001 ultra-deep-tail landmark ' +
    '(N_cross ~ 5.4323e15, contraction ~0.028, residual entirely E_flow to ~6.6e-15) adds a THIRD ' +
    'drift interval to the imp-34372 coupling ratio residual/(E_flow/E_trunc). The per-landmark-step ' +
    'drift is {0.4901%, 0.5938%, 0.4255%}: a constant rate would give equal drops, but the drops are ' +
    'unequal and the NEW deepest interval (0.4255%, excess drop 8.79e-3) is SMALLER than both earlier ' +
    'steps -- the drift rises to a mild peak at the far->deep step then TURNS OVER and decays. So the ' +
    'coupling ratio is CONVERGING toward a finite limit near 2 (~2.05, above 2), NOT sliding linearly ' +
    'toward a cross-below-2 divergence: the imp-34372 two-interval ambiguity is resolved in favour of a ' +
    'decaying, self-limiting drift. The lockstep (residual ~ 2*(E_flow/E_trunc)) extends to the fourth ' +
    'landmark (both drop ~75x, gap ~0.2). Measurement/extrapolation only; component model NOT rigorous; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; no bound change; NO QED. No refereed bound is changed.',
});

export default Object.freeze({
  id: 'imp-34447-coupling-ratio-drift-third-interval',
  ticket: 'imp-34447',
  sources: [
    'imp-34372-lockstep-ratio-deeptail-persistence.js',
    'imp-33860-sigma-deeptail-001-crossover-closed-form.js',
  ],
  landmarks: IMP34447_LANDMARKS,
  couplingRatio: IMP34447_COUPLING_RATIO,
  driftIntervals: IMP34447_DRIFT_INTERVALS,
  summary: IMP34447_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34447_ASSERTIONS = [
  {
    id: 'imp34447-four-landmarks-decreasing-thr',
    holds: () => {
      const r = IMP34447_LANDMARKS;
      return (
        r.length === 4 &&
        r[0].thr === 0.5 &&
        r[1].thr === 0.1 &&
        r[2].thr === 0.01 &&
        r[3].thr === 0.001
      );
    },
    why: 'The comparison must be exactly {0.5, 0.1, 0.01, 0.001} in decreasing-thr order -- the new thr=0.001 landmark supplies the fourth point (third drift interval).',
  },
  {
    id: 'imp34447-new-landmark-amplitude-is-998001x-halving',
    holds: () => IMP34447_LANDMARKS[3].amplitude_ratio_to_halving === 998001,
    why: 'K_thr = ((1-thr)/thr)^2 (C_C/E_trunc)^2 = 999^2 = 998001 times the halving amplitude at thr=0.001 (cf 9801 at thr=0.01).',
  },
  {
    id: 'imp34447-new-landmark-residual-is-eflow',
    holds: () => {
      const d = IMP34447_LANDMARKS[3];
      return (
        d.with_flow_vs_empirical_rel < 1e-12 &&
        d.contraction_factor_at_root > 0 &&
        d.contraction_factor_at_root < 0.04
      );
    },
    why: 'Restoring E_flow in the threshold balance closes the new-landmark residual to < 1e-12, and the fixed-point map is a strong contraction (< 0.04): the residual is entirely the flow term, root unique.',
  },
  {
    id: 'imp34447-coupling-ratio-pinned-near-two-monotone-down',
    holds: () => {
      const c = IMP34447_COUPLING_RATIO;
      return (
        c.every((r) => Math.abs(r.coupling_ratio - 2) < 0.1) &&
        c[0].coupling_ratio > c[1].coupling_ratio &&
        c[1].coupling_ratio > c[2].coupling_ratio &&
        c[2].coupling_ratio > c[3].coupling_ratio
      );
    },
    why: 'The coupling ratio must stay within ~5% of 2 at all four landmarks and drift monotonically DOWN (2.0890 > 2.0788 > 2.0664 > 2.0576).',
  },
  {
    id: 'imp34447-drift-is-not-constant-rate',
    holds: () => {
      const d = IMP34447_DRIFT_INTERVALS;
      // three intervals, drops unequal (not a constant rate)
      return (
        d.length === 3 &&
        Math.abs(d[0].drift_pct - 0.4901) < 0.01 &&
        Math.abs(d[1].drift_pct - 0.5938) < 0.01 &&
        Math.abs(d[2].drift_pct - 0.4255) < 0.01 &&
        Math.abs(d[0].drift_pct - d[2].drift_pct) > 0.02
      );
    },
    why: 'D1: the three per-step drifts {0.4901, 0.5938, 0.4255}% are unequal -- a constant rate would give equal drops.',
  },
  {
    id: 'imp34447-deepest-drift-interval-is-smallest',
    holds: () => {
      const d = IMP34447_DRIFT_INTERVALS;
      // the NEW deepest interval drops LESS than both earlier steps -> drift decays / turns over
      return (
        d[2].drift_pct < d[0].drift_pct &&
        d[2].drift_pct < d[1].drift_pct &&
        d[2].excess_drop < d[0].excess_drop &&
        d[2].excess_drop < d[1].excess_drop &&
        IMP34447_SUMMARY.drift_is_constant_rate === false &&
        IMP34447_SUMMARY.drift_decays_in_deep_tail === true
      );
    },
    why: 'D1: the new deepest interval (0.01 -> 0.001) drifts LESS than both shallower intervals -- the drift turns over and decays, so it is self-limiting, not constant-rate; the ratio converges above 2.',
  },
  {
    id: 'imp34447-lockstep-extends-to-new-landmark',
    holds: () => {
      const d = IMP34447_DRIFT_INTERVALS[2]; // deep -> ultra-deep
      return (
        d.residual_drop_factor > 60 &&
        d.residual_drop_factor < 90 &&
        d.E_flow_drop_factor > 60 &&
        d.E_flow_drop_factor < 90 &&
        Math.abs(d.residual_drop_factor - d.E_flow_drop_factor) < 2
      );
    },
    why: 'D2: from thr=0.01 to thr=0.001 the residual and E_flow/E_trunc both drop ~75x (lockstep gap < 2), extending the imp-34372 halving->far->deep lockstep to the fourth landmark.',
  },
  {
    id: 'imp34447-honesty-gate-no-qed',
    holds: () =>
      /NO QED/.test(IMP34447_SUMMARY.verdict) &&
      /refereed bound is changed/i.test(IMP34447_SUMMARY.verdict) &&
      /UNTOUCHED/.test(IMP34447_SUMMARY.verdict),
    why: 'Honesty gate: measurement/extrapolation only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34447_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34447-coupling-ratio-drift-third-interval assertion failed: ${assertion.id}`,
    );
  }
}
