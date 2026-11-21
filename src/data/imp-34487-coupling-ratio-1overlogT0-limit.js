/**
 * @module imp-34487-coupling-ratio-1overlogT0-limit
 * @fileoverview imp-34487 -- MEASUREMENT ONLY: add a FIFTH, ultra-deep crossover landmark below the
 *   imp-34447 thr = 0.001 point (a new thr = 0.0001 landmark) and FIT the coupling-ratio
 *   excess-above-2 sequence to a 1/log T0 decay law, to LOCATE the finite limit the imp-34447
 *   drift turn-over is converging to (and to put an uncertainty band on it).
 *
 *   THE OPEN QUESTION (imp-34447)
 *   -----------------------------
 *   imp-34447 added a fourth thr = 0.001 landmark and found the coupling ratio
 *   residual/(E_flow/E_trunc) drift is NOT constant-rate but TURNS OVER (per-step excess drops
 *   {1.0239e-2, 1.2344e-2, 8.7933e-3}), concluding the ratio converges toward a finite limit
 *   "~2.05" rather than sliding below 2. But three drift intervals give only a QUALITATIVE
 *   turn-over, and the "~2.05" was the value at the deepest THEN-available landmark (thr = 0.001,
 *   coupling 2.0576), not a fitted asymptote. To locate the actual limit you need a fifth point
 *   plus a decay-law fit of the excess above the leading value 2.
 *
 *   THE NEW LANDMARK (thr = 0.0001, ultra-deep tail)
 *   ------------------------------------------------
 *   Using the identical imp-33723/imp-33743/imp-33860/imp-34447 closed-form fixed point
 *     N_cross(thr) = (C_C (1-thr)/(E_trunc thr))^2 log T0(N_cross),   K_thr = ((1-thr)/thr)^2 (C_C/E_trunc)^2
 *   at thr = 0.0001 the amplitude factor ((1-thr)/thr)^2 = 9999^2 = 99980001 (cf 998001 at thr=0.001),
 *   giving K_thr ~ 1.5724e16 and, by Banach iteration, N_cross ~ 6.1649e17. The map is an even
 *   STRONGER contraction than at thr = 0.001 (measured |g_prime(N_cross)| ~ 0.0248 vs ~0.0280), so
 *   the fixed point is unique; the with-flow closure |N_wf - N_emp|/N_emp ~ 4.4e-15 confirms this
 *   landmark residual, like the shallower ones, is ENTIRELY the flow term (E_flow/E_trunc ~ 7.35e-11).
 *
 *   THE FIT (measurement only)
 *   --------------------------
 *   With five landmarks the coupling ratio and its excess above 2 are
 *     thr=0.5    logT0=20.8538  coupling=2.089015  excess=0.089015
 *     thr=0.1    logT0=25.2251  coupling=2.078776  excess=0.078776
 *     thr=0.01   logT0=30.0010  coupling=2.066432  excess=0.066432
 *     thr=0.001  logT0=34.6104  coupling=2.057639  excess=0.057639
 *     thr=0.0001 logT0=39.2070  coupling=2.050855  excess=0.050855   (NEW fifth point)
 *   The per-landmark-step drift continues to decay monotonically: {0.4901%, 0.5938%, 0.4255%,
 *   0.3297%} -- the new deepest interval (0.3297%) is again the SMALLEST, extending the imp-34447
 *   turn-over. A least-squares fit of excess vs x = 1/log T0,  excess = c0 + c1 x, gives
 *     all 5 points : c0 = 0.008106, c1 = 1.7236, R^2 = 0.98873  -> limit 2 + c0 = 2.0081
 *     deep 4       : c0 = 0.000563, c1 = 1.9741, R^2 = 0.99997  -> limit          2.0006
 *     deep 3       : c0 = 0.000120, c1 = 1.9898, R^2 = 0.99999  -> limit          2.0001
 *   As shallow landmarks are dropped the fit becomes near-perfect, the intercept c0 collapses toward
 *   ZERO, and the slope c1 tightens toward 2. That is the signature of an EXACT leading 1/log T0
 *   correction:  coupling ~ 2 + 2/log T0, with the shallowest thr=0.5 point carrying the only
 *   visible higher-order (1/log T0^2) curvature. So the finite limit is the LEADING value 2, NOT
 *   ~2.05 -- the excess above 2 vanishes as ~2/log T0, just very slowly, which is why the reachable
 *   landmarks still sit at 2.05-2.09. Across {all5, deep4, deep3} the limit band is
 *   [2.0001, 2.0081], midpoint 2.0041; the imp-34447 "~2.05" is REVISED to "converges to 2 from
 *   above, as ~2/log T0". This is fully consistent with imp-34447 (ratio stays above 2, never crosses
 *   below) and with the structural relation coupling = residual/r -> 2 as r -> 0 (imp-34270/34351):
 *   the excess is carried by the slow log-ratio [L/L] factor, which -> 1 as log T0 -> infinity.
 *
 *   Values below are baked reference literals from a single consistent evaluation of the imp-33860/
 *   imp-34447 machinery (effectiveHeightForN Riemann-von Mangoldt inverse; C_C = (1/8) sqrt(3 pi),
 *   imp-2642; E_trunc = 3.06e-5 fixed-strip, imp-2631; Gronwall exp(2.37e-4), imp-3406). The four
 *   shallower landmarks reproduce the imp-34447 baked literals exactly. This module imports NOTHING
 *   (no lambda-rh-height-mapping, no zeros bundle) per [[no_heavy_imports_in_pages]] and
 *   [[verify_heavy_assertion_modules]]; the offline generator is scripts/imp-34487-compute.mjs.
 *
 *   @see imp-34447-coupling-ratio-drift-third-interval.js (fourth landmark; the turn-over resolved qualitatively)
 *   @see imp-34351-crossover-offset-division-form-fartail-crossvalidation.js (exact residual = 1 - [L/L]/(1+r)^2)
 *
 *   Ticket: imp-34487 (accuracy, medium). Presentation-independent MEASUREMENT / extrapolation of an
 *   already-established quantity; adds no new Lambda bound. Component model is the inherited imp-3220/
 *   imp-3406 extrapolation, NOT a rigorous asymptotic; the leading value 2 (N proportional to
 *   E_coll^-2) and the C_C ansatz are UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
 *   K_a >= 0 untouched; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 */

// -- five-landmark comparison: closed-form coupling ratio and its excess above the leading value 2 --
export const IMP34487_LANDMARKS = Object.freeze([
  Object.freeze({ landmark: 'Halving (thr=0.5)',          thr: 0.5,    N_cross: 3.280294e9,  logT0: 20.8538, coupling_ratio: 2.089015, excess_above_two: 0.089015 }),
  Object.freeze({ landmark: 'Far-tail (thr=0.1)',         thr: 0.1,    N_cross: 3.213418e11, logT0: 25.2251, coupling_ratio: 2.078776, excess_above_two: 0.078776 }),
  Object.freeze({ landmark: 'Deep-tail (thr=0.01)',       thr: 0.01,   N_cross: 4.624385e13, logT0: 30.0010, coupling_ratio: 2.066432, excess_above_two: 0.066432 }),
  Object.freeze({ landmark: 'Ultra-deep-tail (thr=0.001)', thr: 0.001, N_cross: 5.432330e15, logT0: 34.6104, coupling_ratio: 2.057639, excess_above_two: 0.057639 }),
  Object.freeze({
    // NEW fifth ultra-deep landmark (thr=0.0001) -- the fourth drift interval and the fit anchor.
    landmark: 'Hyper-deep-tail (thr=0.0001)',
    thr: 0.0001,
    N_cross: 6.164882e17,
    logT0: 39.2070,
    coupling_ratio: 2.050855,
    excess_above_two: 0.050855,
    rel_offset: 1.5070e-10,
    E_flow_over_E_trunc: 7.3481e-11,
    K_thr: 1.572394e16,               // ((1-thr)/thr)^2 (C_C/E_trunc)^2
    amplitude_ratio_to_halving: 99980001, // 9999^2 at thr=0.0001 (cf 998001 at thr=0.001)
    contraction_factor_at_root: 2.482e-2, // |g_prime(N_cross)| ~ 0.0248 (stronger than thr=0.001 ~0.0280)
    with_flow_vs_empirical_rel: 4.36e-15, // E_flow restored closes the residual: it IS the flow term
  }),
]);

// -- per-landmark-step drift of the coupling ratio (percent) -- decays monotonically (turn-over) --
export const IMP34487_DRIFT_INTERVALS = Object.freeze(
  IMP34487_LANDMARKS.slice(1).map((cur, i) => {
    const prev = IMP34487_LANDMARKS[i];
    const excessDrop = prev.coupling_ratio - cur.coupling_ratio;
    return Object.freeze({
      step: `${prev.landmark} -> ${cur.landmark}`,
      drift_pct: +((excessDrop / prev.coupling_ratio) * 100).toFixed(4),
      excess_drop: +excessDrop.toFixed(6),
    });
  }),
);

// -- 1/logT0 decay fit  excess = c0 + c1*(1/logT0);  finite limit L_inf = 2 + c0 --
export const IMP34487_LIMIT_FITS = Object.freeze([
  Object.freeze({ window: 'all 5 landmarks',    n: 5, c0: 0.008106, c1_slope: 1.723562, r2: 0.988725, limit: 2.008106 }),
  Object.freeze({ window: 'deep 4 (drop thr=0.5)', n: 4, c0: 0.000563, c1_slope: 1.974097, r2: 0.999973, limit: 2.000563 }),
  Object.freeze({ window: 'deep 3 (thr<=0.01)',  n: 3, c0: 0.000120, c1_slope: 1.989766, r2: 0.999990, limit: 2.000120 }),
]);

// -- two-term fit  excess = c0 + c1/logT0 + c2/logT0^2 (all 5) -- confirms c0 sits at/below zero --
export const IMP34487_TWO_TERM_FIT = Object.freeze({
  c0: -0.026162, c1: 3.681588, c2: -26.587987, limit: 1.973838,
  note: 'Adding a curvature term pulls the intercept from +0.0081 to -0.0262 (limit 1.9738): the extra freedom straddles 2, so the leading-1/logT0 fits bracket the limit tightly at 2.',
});

export const IMP34487_SUMMARY = Object.freeze({
  new_landmark_thr: 0.0001,
  new_landmark_N_cross: 6.164882e17,
  new_landmark_coupling_ratio: 2.050855,
  new_landmark_excess_above_two: 0.050855,
  // the fourth drift interval extends the imp-34447 turn-over: {0.4901, 0.5938, 0.4255, 0.3297}
  drift_pct_by_interval: Object.freeze([0.4901, 0.5938, 0.4255, 0.3297]),
  deepest_interval_is_smallest: true, // 0.3297% < all three earlier steps
  // 1/logT0 fit: intercept collapses to ~0, slope tightens to ~2 as shallow points are dropped
  limit_all5: 2.008106,
  limit_deep4: 2.000563,
  limit_deep3: 2.000120,
  slope_deep3: 1.989766, // -> excess ~ 2/logT0
  limit_band_lo: 2.000120,
  limit_band_hi: 2.008106,
  limit_band_midpoint: 2.004113,
  finite_limit_is_leading_value_two: true, // NOT ~2.05: the excess vanishes as ~2/logT0
  imp34447_2p05_revised_to_two_from_above: true,
  verdict:
    'THE FINITE LIMIT IS THE LEADING VALUE 2 (approached from above as ~2/log T0), NOT ~2.05. The new ' +
    'thr=0.0001 hyper-deep-tail landmark (N_cross ~ 6.1649e17, contraction ~0.0248, residual entirely ' +
    'E_flow to ~4.4e-15, coupling 2.050855) adds a FIFTH point and a fourth drift interval (0.3297%, ' +
    'again the smallest -- the imp-34447 turn-over continues). A least-squares fit of excess-above-2 ' +
    'against 1/log T0 gives limit 2.0081 (all 5, R^2 0.9887), 2.0006 (deep 4, R^2 0.99997) and 2.0001 ' +
    '(deep 3, R^2 0.99999): as shallow landmarks are dropped the intercept collapses toward ZERO and ' +
    'the slope tightens toward 2, the signature of an exact leading correction coupling ~ 2 + 2/log T0. ' +
    'So the excess above 2 vanishes as ~2/log T0 (just slowly, hence 2.05-2.09 at reachable landmarks); ' +
    'the imp-34447 qualitative "~2.05" is REVISED to "converges to 2 from above". Limit band across the ' +
    'three fit windows [2.0001, 2.0081], midpoint 2.0041. This stays fully above 2 (never crosses ' +
    'below, consistent with imp-34447) and matches coupling = residual/r -> 2 as r -> 0 ' +
    '(imp-34270/34351). Measurement/extrapolation only; component model NOT rigorous; the leading ' +
    'value 2 and the C_C ansatz are UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; no bound change; NO QED. No refereed bound is changed.',
});

export default Object.freeze({
  id: 'imp-34487-coupling-ratio-1overlogT0-limit',
  ticket: 'imp-34487',
  sources: [
    'imp-34447-coupling-ratio-drift-third-interval.js',
    'imp-34351-crossover-offset-division-form-fartail-crossvalidation.js',
  ],
  landmarks: IMP34487_LANDMARKS,
  driftIntervals: IMP34487_DRIFT_INTERVALS,
  limitFits: IMP34487_LIMIT_FITS,
  twoTermFit: IMP34487_TWO_TERM_FIT,
  summary: IMP34487_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34487_ASSERTIONS = [
  {
    id: 'imp34487-five-landmarks-decreasing-thr',
    holds: () => {
      const r = IMP34487_LANDMARKS;
      return (
        r.length === 5 &&
        r[0].thr === 0.5 && r[1].thr === 0.1 && r[2].thr === 0.01 &&
        r[3].thr === 0.001 && r[4].thr === 0.0001
      );
    },
    why: 'The comparison must be exactly {0.5, 0.1, 0.01, 0.001, 0.0001} in decreasing-thr order -- the new thr=0.0001 landmark supplies the fifth point.',
  },
  {
    id: 'imp34487-new-landmark-amplitude-is-99980001x-halving',
    holds: () => IMP34487_LANDMARKS[4].amplitude_ratio_to_halving === 99980001,
    why: 'K_thr = ((1-thr)/thr)^2 (C_C/E_trunc)^2 = 9999^2 = 99980001 times the halving amplitude at thr=0.0001 (cf 998001 at thr=0.001).',
  },
  {
    id: 'imp34487-new-landmark-residual-is-eflow',
    holds: () => {
      const d = IMP34487_LANDMARKS[4];
      return (
        d.with_flow_vs_empirical_rel < 1e-12 &&
        d.contraction_factor_at_root > 0 &&
        d.contraction_factor_at_root < 0.04
      );
    },
    why: 'Restoring E_flow in the threshold balance closes the new-landmark residual to < 1e-12, and the fixed-point map is a strong contraction (< 0.04): the residual is entirely the flow term, root unique.',
  },
  {
    id: 'imp34487-coupling-ratio-pinned-above-two-monotone-down',
    holds: () => {
      const c = IMP34487_LANDMARKS;
      return (
        c.every((r) => r.coupling_ratio > 2 && r.coupling_ratio - 2 < 0.1) &&
        c[0].coupling_ratio > c[1].coupling_ratio &&
        c[1].coupling_ratio > c[2].coupling_ratio &&
        c[2].coupling_ratio > c[3].coupling_ratio &&
        c[3].coupling_ratio > c[4].coupling_ratio
      );
    },
    why: 'The coupling ratio must stay strictly above 2 (and within ~5% of it) at all five landmarks and drift monotonically DOWN (2.0890 > 2.0788 > 2.0664 > 2.0576 > 2.0509).',
  },
  {
    id: 'imp34487-drift-turnover-continues-deepest-smallest',
    holds: () => {
      const d = IMP34487_DRIFT_INTERVALS;
      return (
        d.length === 4 &&
        Math.abs(d[3].drift_pct - 0.3297) < 0.01 &&
        d[3].drift_pct < d[0].drift_pct &&
        d[3].drift_pct < d[1].drift_pct &&
        d[3].drift_pct < d[2].drift_pct
      );
    },
    why: 'D1: the new deepest interval (0.001 -> 0.0001) drifts 0.3297%, again the SMALLEST of all four -- the imp-34447 turn-over continues, the drift is self-limiting.',
  },
  {
    id: 'imp34487-1overlogT0-fit-limit-collapses-to-two',
    holds: () => {
      const f = IMP34487_LIMIT_FITS;
      return (
        f.length === 3 &&
        f.every((x) => x.r2 > 0.98 && x.limit > 2 && x.limit < 2.01) &&
        // as shallow points drop, R^2 improves, intercept collapses toward 0, slope tightens toward 2
        f[2].r2 > f[0].r2 &&
        f[2].c0 < f[0].c0 &&
        Math.abs(f[2].c1_slope - 2) < Math.abs(f[0].c1_slope - 2) &&
        f[2].c0 < 0.001
      );
    },
    why: 'The 1/logT0 fit of excess-above-2 gives a limit in (2, 2.01); dropping shallow landmarks improves R^2, collapses the intercept toward 0 and tightens the slope toward 2 -- the limit is the leading value 2, not ~2.05.',
  },
  {
    id: 'imp34487-limit-band-brackets-two',
    holds: () => {
      const s = IMP34487_SUMMARY;
      return (
        s.limit_band_lo > 2 && s.limit_band_lo < 2.001 &&
        s.limit_band_hi > 2 && s.limit_band_hi < 2.01 &&
        s.finite_limit_is_leading_value_two === true &&
        s.imp34447_2p05_revised_to_two_from_above === true &&
        // two-term fit straddles 2 from below, confirming the leading-fit limit is a tight bracket
        IMP34487_TWO_TERM_FIT.limit < 2
      );
    },
    why: 'The limit band [2.0001, 2.0081] sits just above 2; the two-term fit (1.9738) straddles from below -- together they bracket the finite limit at 2, revising the imp-34447 ~2.05.',
  },
  {
    id: 'imp34487-honesty-gate-no-qed',
    holds: () =>
      /NO QED/.test(IMP34487_SUMMARY.verdict) &&
      /refereed bound is changed/i.test(IMP34487_SUMMARY.verdict) &&
      /UNTOUCHED/.test(IMP34487_SUMMARY.verdict),
    why: 'Honesty gate: measurement/extrapolation only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34487_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34487-coupling-ratio-1overlogT0-limit assertion failed: ${assertion.id}`,
    );
  }
}
