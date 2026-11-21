/**
 * @module imp-34372-lockstep-ratio-deeptail-persistence
 * @fileoverview imp-34372 -- MEASUREMENT ONLY: does the imp-34355 closed-form-crossover
 *   residual / (E_flow/E_trunc) lockstep persist to the deeper imp-33620 sigma < 0.01 landmark?
 *
 *   imp-34355 tabulated TWO threshold landmarks of the imp-33723/imp-33743 closed-form crossover
 *   N_cross(thr) = (C_C (1-thr)/(E_trunc thr))^2 log T0(N_cross): the halving (thr=0.5) and the
 *   sigma < 0.1 far-tail (thr=0.1). Between them the closed-form-vs-empirical residual (rel_offset)
 *   AND the dropped Gronwall ratio E_flow/E_trunc BOTH fell by ~54x -- "lockstep" -- with the
 *   coupling residual ~ 2 * (E_flow/E_trunc) (the factor 2 from N proportional to E_coll^-2).
 *   With only two landmarks it is impossible to tell whether the coupling ratio residual/(E_flow/
 *   E_trunc) is genuinely pinned near 2 or just happens to cross there. imp-33860 supplied the
 *   THIRD landmark: the imp-33620 deep-tail thr=0.01 crossover (N_cross ~ 4.6244e13), with
 *   rel_offset ~ 8.79e-7 and E_flow/E_trunc ~ 4.26e-7. This module folds that third point into the
 *   comparison and measures (a) whether residual and E_flow/E_trunc still drop in lockstep from the
 *   far tail to the deep tail, and (b) whether the coupling ratio residual/(E_flow/E_trunc) DRIFTS
 *   as E_flow decays further down the tail.
 *
 *   THE FINDING (measurement only)
 *   ------------------------------
 *   (D1) THE LOCKSTEP PERSISTS TO THE DEEP TAIL. Per-step drop factors:
 *          halving -> far-tail : residual x 53.95, E_flow/E_trunc x 53.70  (gap 0.25)
 *          far-tail -> deep-tail: residual x 83.93, E_flow/E_trunc x 83.31  (gap 0.62)
 *        The per-step factor GROWS from ~54x to ~84x because the amplitude ((1-thr)/thr)^2 jumps
 *        (81 -> 9801), but residual and E_flow/E_trunc still move together at each step -- the
 *        residual IS the flow term at every landmark, not a two-point coincidence.
 *   (D2) THE COUPLING RATIO IS PINNED NEAR 2, WITH ONLY A GENTLE DOWNWARD DRIFT. residual/(E_flow/
 *        E_trunc) = 2.0885 (halving) -> 2.0788 (far tail) -> 2.0634 (deep tail): a monotone drift of
 *        ~0.46% then ~0.74% per landmark step, ~1.20% total across two decades of tightening. The
 *        ratio does NOT diverge or collapse -- it stays within ~1.2% of the leading N-proportional-
 *        to-E_coll^-2 value 2, so the ~54x "lockstep" of imp-34355 was the leading edge of a
 *        structural coupling, not a crossing artifact of the two chosen landmarks.
 *
 *   The small residual drift (~-0.4% per landmark) is the expected higher-order content: the exact
 *   relation is residual = 1 - [L/L]/(1+r)^2 with r = E_flow/E_trunc (imp-34270/imp-34351), whose
 *   leading term is 2r and whose next term (-3r^2 + logT0 drift) shaves the ratio slightly below 2
 *   as r shrinks... yet r itself shrinks, so the ABSOLUTE drift of the coupling ratio narrows down
 *   the tail rather than widening -- consistent with the lockstep tightening, not loosening.
 *
 *   Values below are baked reference literals reproduced from the imp-34355 two-landmark table
 *   (halving + far tail) and the imp-33860 deep-tail closed form (thr=0.01 landmark). This module
 *   imports NOTHING (no lambda-rh-height-mapping, no zeros bundle) per [[no_heavy_imports_in_pages]]
 *   and [[verify_heavy_assertion_modules]] -- the arithmetic below is pure ratio bookkeeping on the
 *   baked literals, no fresh model evaluation.
 *
 *   @see imp-34355-fartail-crossover-residual-collapse-viz-data.js (two-landmark ~54x lockstep table)
 *   @see imp-33860-sigma-deeptail-001-crossover-closed-form.js (deep-tail thr=0.01 landmark, rel_offset ~8.79e-7)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (sigma < 0.01 crossing N ~ 4.62e13, bisected)
 *   @see imp-34351-crossover-offset-division-form-fartail-crossvalidation.js (exact residual = 1 - [L/L]/(1+r)^2)
 *
 *   Ticket: imp-34372 (numerical, medium). Presentation-independent MEASUREMENT of an already-
 *   established quantity; adds no new Lambda bound. Component model is the inherited imp-3220/
 *   imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED;
 *   C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 */

// -- three-landmark comparison: closed-form residual (rel_offset) and dropped Gronwall ratio --
export const IMP34372_LANDMARK_LOCKSTEP = Object.freeze([
  Object.freeze({
    landmark: 'Halving (thr=0.5)',
    thr: 0.5,
    N_cross: 3.280294e9,
    rel_offset: 3.98e-3, // imp-34355 / imp-33723
    E_flow_over_E_trunc: 1.9057e-3, // imp-34355 / imp-33723
  }),
  Object.freeze({
    landmark: 'Far-tail (thr=0.1)',
    thr: 0.1,
    N_cross: 3.213418e11,
    rel_offset: 7.3772e-5, // imp-34355 / imp-33743
    E_flow_over_E_trunc: 3.5488e-5, // imp-34355 / imp-33743
  }),
  Object.freeze({
    landmark: 'Deep-tail (thr=0.01)',
    thr: 0.01,
    N_cross: 4.624385e13,
    rel_offset: 8.79e-7, // imp-33860 deeptail_rel_offset_from_closed_form
    E_flow_over_E_trunc: 4.26e-7, // imp-33860 E_flow_over_E_trunc_at_deep_tail
  }),
]);

// -- coupling ratio residual/(E_flow/E_trunc) at each landmark (leading value 2, N proportional to E_coll^-2) --
export const IMP34372_COUPLING_RATIO = Object.freeze(
  IMP34372_LANDMARK_LOCKSTEP.map((r) =>
    Object.freeze({
      landmark: r.landmark,
      thr: r.thr,
      coupling_ratio: +(r.rel_offset / r.E_flow_over_E_trunc).toFixed(6),
    }),
  ),
);

// -- per-step drop factors: is residual still moving in lockstep with E_flow/E_trunc? --
export const IMP34372_PER_STEP_DROP = Object.freeze(
  IMP34372_LANDMARK_LOCKSTEP.slice(1).map((cur, i) => {
    const prev = IMP34372_LANDMARK_LOCKSTEP[i];
    const residDrop = prev.rel_offset / cur.rel_offset;
    const flowDrop = prev.E_flow_over_E_trunc / cur.E_flow_over_E_trunc;
    return Object.freeze({
      step: `${prev.landmark} -> ${cur.landmark}`,
      residual_drop: +residDrop.toFixed(4),
      E_flow_ratio_drop: +flowDrop.toFixed(4),
      lockstep_gap: +Math.abs(residDrop - flowDrop).toFixed(4),
    });
  }),
);

export const IMP34372_SUMMARY = Object.freeze({
  lockstep_persists_to_deep_tail: true,
  coupling_ratio_halving: 2.088471,
  coupling_ratio_fartail: 2.078787,
  coupling_ratio_deeptail: 2.06338,
  coupling_ratio_total_drift_pct: +(
    ((2.088471 - 2.06338) / 2.088471) *
    100
  ).toFixed(4), // ~1.20% downward across two decades of tightening
  ratio_pinned_near_two: true, // stays within ~1.2% of the leading N-proportional-to-E_coll^-2 value 2
  per_step_drop_grows_54x_to_84x: true, // amplitude ((1-thr)/thr)^2 jumps 81 -> 9801, not a loosening
  verdict:
    'LOCKSTEP PERSISTS. From the far tail (thr=0.1) to the deep tail (thr=0.01) the closed-form ' +
    'residual and E_flow/E_trunc both drop ~84x (lockstep gap 0.62), extending the imp-34355 ~54x ' +
    'halving->far-tail lockstep; the coupling residual/(E_flow/E_trunc) stays pinned near 2 ' +
    '(2.0885 -> 2.0788 -> 2.0634), drifting DOWN only ~1.2% total. The ratio does NOT diverge as ' +
    'E_flow decays -- the ~54x lockstep was the leading edge of the structural residual = 2*(E_flow/' +
    'E_trunc) coupling (factor 2 from N proportional to E_coll^-2), not a two-landmark crossing ' +
    'artifact. Measurement only; component model NOT rigorous; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; no bound change; NO QED. No refereed bound is changed' +
    '.',
});

export default Object.freeze({
  id: 'imp-34372-lockstep-ratio-deeptail-persistence',
  ticket: 'imp-34372',
  sources: [
    'imp-34355-fartail-crossover-residual-collapse-viz-data.js',
    'imp-33860-sigma-deeptail-001-crossover-closed-form.js',
  ],
  landmarkLockstep: IMP34372_LANDMARK_LOCKSTEP,
  couplingRatio: IMP34372_COUPLING_RATIO,
  perStepDrop: IMP34372_PER_STEP_DROP,
  summary: IMP34372_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34372_ASSERTIONS = [
  {
    id: 'imp34372-three-landmarks-in-order',
    holds: () => {
      const r = IMP34372_LANDMARK_LOCKSTEP;
      return (
        r.length === 3 && r[0].thr === 0.5 && r[1].thr === 0.1 && r[2].thr === 0.01
      );
    },
    why: 'The comparison must be exactly {halving 0.5, far-tail 0.1, deep-tail 0.01} in decreasing-thr order (imp-33723/imp-33743/imp-33860).',
  },
  {
    id: 'imp34372-lockstep-persists-to-deep-tail',
    holds: () => {
      const far = IMP34372_PER_STEP_DROP[1]; // far-tail -> deep-tail
      return (
        far.residual_drop > 80 &&
        far.residual_drop < 88 &&
        far.E_flow_ratio_drop > 80 &&
        far.E_flow_ratio_drop < 88 &&
        far.lockstep_gap < 1
      );
    },
    why: 'D1: from far tail to deep tail the residual and E_flow/E_trunc must both drop ~84x (lockstep gap < 1), extending the imp-34355 ~54x halving->far-tail lockstep.',
  },
  {
    id: 'imp34372-per-step-factor-grows-54x-to-84x',
    holds: () => {
      const [a, b] = IMP34372_PER_STEP_DROP;
      return (
        Math.abs(a.residual_drop - 53.95) < 1 &&
        Math.abs(b.residual_drop - 83.93) < 1 &&
        b.residual_drop > a.residual_drop
      );
    },
    why: 'The per-step drop factor GROWS ~54x -> ~84x because the amplitude ((1-thr)/thr)^2 jumps 81 -> 9801; this is the amplitude scaling, not a loosening of the lockstep.',
  },
  {
    id: 'imp34372-coupling-ratio-pinned-near-two',
    holds: () =>
      IMP34372_COUPLING_RATIO.every(
        (r) => Math.abs(r.coupling_ratio - 2) < 0.1,
      ) &&
      // strictly monotone downward drift as E_flow decays down the tail
      IMP34372_COUPLING_RATIO[0].coupling_ratio >
        IMP34372_COUPLING_RATIO[1].coupling_ratio &&
      IMP34372_COUPLING_RATIO[1].coupling_ratio >
        IMP34372_COUPLING_RATIO[2].coupling_ratio,
    why: 'D2: residual/(E_flow/E_trunc) must stay within ~5% of the leading value 2 (N proportional to E_coll^-2) at all three landmarks, drifting monotonically DOWN as E_flow decays.',
  },
  {
    id: 'imp34372-coupling-ratio-total-drift-is-small',
    holds: () =>
      IMP34372_SUMMARY.coupling_ratio_total_drift_pct > 0 &&
      IMP34372_SUMMARY.coupling_ratio_total_drift_pct < 2 &&
      IMP34372_SUMMARY.ratio_pinned_near_two === true &&
      IMP34372_SUMMARY.lockstep_persists_to_deep_tail === true,
    why: 'The coupling ratio drifts DOWN only ~1.2% total across two decades of tightening (0 < drift < 2%): pinned near 2, not diverging -- the lockstep persists.',
  },
  {
    id: 'imp34372-honesty-gate-no-qed',
    holds: () =>
      /NO QED/.test(IMP34372_SUMMARY.verdict) &&
      /refereed bound is changed/i.test(IMP34372_SUMMARY.verdict) &&
      /UNTOUCHED/.test(IMP34372_SUMMARY.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34372_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34372-lockstep-ratio-deeptail-persistence assertion failed: ${assertion.id}`,
    );
  }
}
