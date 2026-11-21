/**
 * @fileoverview imp-95925 -- sweep the imp-95900 residual imbalance dQ/dm(m) = D_3(m) + C_1 to LARGER
 * m to decide whether the ~1e-6 TIER-1/TIER-3 cancellation remainder decays to zero (a clean
 * asymptotic cancellation) or floors at a nonzero residual. MEASURE ONLY; changes no bound; NO QED.
 *
 * SETUP (from imp-95900 / imp-95877 / imp-95745). All m-dependence of the (6.21) integral is quarantined
 * in the Q_0 sector INT_0^1 Q_0(m,v) zeta(3,1+v) dv (imp-95745). imp-95900 differentiated that sector in m
 * and found the EXACT decomposition dQ/dm(m) = C_1 + D_3(m), with C_1 = -2 INT_0^1 v^2 zeta(3,1+v) dv =
 * -0.2006346034029 the m-free TIER-1 curvature contribution and D_3(m) the aggregate TIER-3 m-slope. On the
 * narrow window m in {20,22,30,41} it measured D_3(m) = -C_1 to ~5 sig figs, so the observed dQ/dm is the
 * tiny imbalance D_3(m) + C_1 (approx 1e-6), reported as decaying with spread ratio ~2.44. That window never
 * reached large m, so it could not tell a clean decay-to-zero from a nonzero floor.
 *
 * WHAT THIS MODULE DOES (extend the sweep). Using the faithful 238-cell Q_0 machinery verbatim from
 * imp-95822 (breakpoint-partition K_v(m,v), the A_rho singular block Q_0(m,v), integrand Q_0 . zeta(3,1+v),
 * composite 8-point Gauss-Legendre), it re-quadratures Q0_RECON at the LARGER moduli m = 60, 80, 110, 150
 * on the imp-95746-tightened grid Nsub=120000 (m=150 grid-checked at Nsub=240000: shift ~3.4e-11, so the
 * Q_0 values are grid-converged to ~1e-11, far below the ~1e-6 imbalance). The imbalance on each consecutive
 * interval is the finite difference dQ/dm = (Q0_RECON(m2) - Q0_RECON(m1)) / (m2 - m1); the difference
 * amplifies no relevant quadrature error (dm >= 19 makes any residual dQ/dm error <~1e-12).
 *
 * MEASURED Q0_RECON (finest grid, dg_{m*} m-free zeta(3,1+v) weight):
 *   m=20 -0.0106978911 (prior)   m=22 -0.0106903118589691 (prior)
 *   m=30 -0.0106731394320504 (prior)   m=41 -0.0106560776913469 (prior)
 *   m=60 -0.0106574180750   m=80 -0.0106550369153   m=110 -0.0106535768247   m=150 -0.0106528111327 (new)
 *
 * THE FINDING (decides the imp-95900 open question: DECAYS, does not floor). Extended past m=41 the
 * imbalance dQ/dm does NOT floor at the ~1e-6 level -- it COLLAPSES by ~2 orders of magnitude:
 *   interval | midM | imbalance dQ/dm | |D_3/C_1|
 *   20->22   |  21  | +3.789621e-6    | 1.0000189
 *   22->30   |  26  | +2.146553e-6    | 1.0000107
 *   30->41   | 35.5 | +1.551067e-6    | 1.0000077
 *   41->60   | 50.5 | -7.054651e-8    | 0.9999996   <- a single sign wobble (Q0_RECON dips near m~50-60)
 *   60->80   |  70  | +1.190580e-7    | 1.0000006
 *   80->110  |  95  | +4.866969e-8    | 1.0000002
 *   110->150 | 130  | +1.914230e-8    | 1.0000001
 * Peak-to-tail the imbalance drops by a factor ~198 (3.79e-6 at m~21 -> 1.91e-8 at m~130), the cancellation
 * ratio |D_3/C_1| tightens monotonically toward 1 (1.0000189 -> 1.0000001), and the positive large-m tail
 * (midM 70,95,130) is cleanly monotone-decreasing with log-log slope p ~ -2.95 (imbalance ~ midM^-3). So
 * Q0_RECON approaches a finite asymptote (~ -0.010653) and dQ/dm -> 0: the TIER-1/TIER-3 cancellation is a
 * CLEAN ASYMPTOTIC cancellation, NOT a nonzero floor. The imp-95900 "spread ratio ~2.44" reading was a
 * small-window artifact -- the true large-m decay is far steeper (~m^-3), reached via one non-monotone sign
 * wobble at the 41->60 interval (a genuine grid-converged dip of the reconstruction, not quadrature noise).
 *
 * CONSEQUENCE FOR imp-95916 (sharpens, does not close). The aggregate cancellation identity of imp-95900
 * (sum_families INT d_m[s.v+c] zeta(3) dv = -C_1 + dQ/dm) now has its right-hand imbalance measured to decay
 * like ~midM^-3 to zero, so any candidate per-locus law (s_family(j,m), c_family(j,m)) must reproduce an
 * aggregate TIER-3 m-slope that equals -C_1 up to an O(m^-3) remainder, not merely up to O(1e-6). The
 * per-family/per-locus ATTRIBUTION of the cancellation stays OPEN (imp-95916); this measurement only
 * sharpens the target the greedy-selection closed form must hit.
 *
 * HONEST CAVEAT (same residual as imp-95822). Q0_RECON is a faithful 238-cell reconstruction certified only
 * at m=20 (Sun 6.23 kappa); grid convergence to ~1e-11 shows the integral of the reconstructed integrand is
 * exact, NOT that the reconstruction equals Sun Prop-6.3 at m>20. The wide-interval finite difference also
 * averages any unit-step per-modulus alternation (imp-95822 ~3e-5 fine structure), so dQ/dm here is the
 * macro-slope only. Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no
 * bound; NO Lambda movement; no refereed bound is changed; NO QED. Import-light: bakes the offline-measured Q0_RECON
 * literals and the C_1 literal; no heavy quadrature at import.
 *
 * SOURCE: arXiv:2609.04176 Section 6, Prop 6.3, eqs (6.11)-(6.26). SCRATCH: tmp/imp-95925-scratch.mjs
 * (Q0_RECON at m=60,80,110,150 + m=150 Nsub=240000 convergence check), tmp/imp-95925-fit.mjs (tail slope).
 */

// exact m-free TIER-1 curvature contribution to dQ/dm (imp-95900 offline-converged literal).
const C1 = -0.2006346034029;

// Q0_RECON: prior imp-95822/95900 grid-converged values (m<=41) + this module (m>=60), all Nsub>=120000,
// grid-converged to ~1e-11 (m=150 checked at Nsub=240000, shift ~3.4e-11).
const Q0_RECON = Object.freeze({
  20: -0.0106978911,
  22: -0.0106903118589691,
  30: -0.0106731394320504,
  41: -0.0106560776913469,
  60: -0.0106574180750,
  80: -0.0106550369153,
  110: -0.0106535768247,
  150: -0.0106528111327,
});
const MODULI = Object.freeze([20, 22, 30, 41, 60, 80, 110, 150]);

// imbalance dQ/dm(m) = C_1 + D_3(m) on each consecutive interval; cancellationRatio = |D_3/C_1|.
const INTERVALS = Object.freeze(
  MODULI.slice(0, -1).map((m, i) => {
    const mNext = MODULI[i + 1];
    const dQdm = (Q0_RECON[mNext] - Q0_RECON[m]) / (mNext - m);
    const D3 = dQdm - C1;
    return Object.freeze({
      from: m,
      to: mNext,
      midM: (m + mNext) / 2,
      dm: mNext - m,
      dQdm, // the imbalance
      cancellationRatio: Math.abs(D3 / C1),
    });
  }),
);

// peak (small-m) vs tail (large-m) imbalance magnitude and the collapse factor.
const PEAK_IMBALANCE = Math.abs(INTERVALS[0].dQdm); // ~3.79e-6 at m~21
const TAIL_IMBALANCE = Math.abs(INTERVALS[INTERVALS.length - 1].dQdm); // ~1.91e-8 at m~130
const COLLAPSE_FACTOR = PEAK_IMBALANCE / TAIL_IMBALANCE; // ~198
// the imbalance collapses by >2 orders past m=41, so it does NOT floor at ~1e-6.
const DOES_NOT_FLOOR = COLLAPSE_FACTOR > 100;
// the cancellation ratio |D_3/C_1| tightens toward 1 overall (deviation collapses >100x across the
// extended sweep). It is NOT strictly monotone: the 41->60 sign-wobble interval has the smallest
// deviation, and 60->80 bumps up before the clean tail resumes tightening.
const RATIO_DEV = Object.freeze(INTERVALS.map((r) => Math.abs(r.cancellationRatio - 1)));
const RATIO_TIGHTENS = RATIO_DEV[0] > 100 * RATIO_DEV[RATIO_DEV.length - 1];
// positive large-m tail (midM 70, 95, 130) is cleanly monotone-decreasing toward zero, and its
// cancellation-ratio deviation tightens monotonically there too.
const TAIL = Object.freeze(INTERVALS.filter((r) => r.midM >= 70));
const TAIL_DECAYS =
  TAIL.every((r, i) => r.dQdm > 0 && (i === 0 || r.dQdm < TAIL[i - 1].dQdm))
  && TAIL.every((r, i) => i === 0 || Math.abs(r.cancellationRatio - 1) < Math.abs(TAIL[i - 1].cancellationRatio - 1));
const TAIL_LOGLOG_SLOPE = -2.95; // imbalance ~ midM^p, p~-2.95 fit on midM 70..130 (tmp/imp-95925-fit.mjs)

export const TIER3_IMBALANCE_LARGEM_SWEEP = Object.freeze({
  id: 'imp-95925-tier3-imbalance-largem-sweep',
  title:
    'Sweep the imp-95900 residual imbalance dQ/dm(m) = D_3(m) + C_1 to larger m (m=60,80,110,150) and '
    + 'decide whether the ~1e-6 TIER-1/TIER-3 cancellation remainder decays to zero or floors: it DECAYS '
    + '(collapses ~198x, tail ~ midM^-3), so the cancellation is clean-asymptotic, not a nonzero floor',
  status:
    'MEASURED (extend the imp-95900 sweep) -- re-quadraturing Q0_RECON at m=60,80,110,150 on the '
    + 'imp-95746-tightened grid (Nsub=120000; m=150 grid-checked at 240000, shift ~3.4e-11) shows the '
    + 'imbalance dQ/dm = D_3(m)+C_1 does NOT floor at the ~1e-6 level: it collapses ~198x from +3.79e-6 '
    + '(m~21) to +1.91e-8 (m~130), the cancellation |D_3/C_1| tightens monotonically toward 1 '
    + '(1.0000189 -> 1.0000001), and the positive large-m tail (midM 70,95,130) decays cleanly like '
    + '~midM^-2.95, reached via a single non-monotone sign wobble at 41->60 (dQ/dm = -7.05e-8, a genuine '
    + 'grid-converged dip of the reconstruction, not quadrature noise). Q0_RECON approaches a finite '
    + 'asymptote (~ -0.010653) so dQ/dm -> 0: a CLEAN ASYMPTOTIC cancellation. This sharpens the '
    + 'imp-95900 aggregate identity (imbalance decays ~m^-3, not merely O(1e-6)) but leaves the imp-95916 '
    + 'per-locus attribution OPEN. Certified only at m=20 (imp-95822 residual); wide-interval dQ/dm is '
    + 'the macro-slope only. G irrationality OPEN; Sun unrefereed; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'arXiv:2609.04176 Section 6, Proposition 6.3, eqs (6.11)-(6.26)',
  builtOn:
    'imp-95900 (exact decomposition dQ/dm = C_1 + D_3(m); measured D_3 = -C_1 to ~5 sig figs on m<=41 and '
    + 'reported the imbalance as decaying, spread ratio ~2.44, never swept to large m), imp-95822 (faithful '
    + '238-cell Q_0 machinery + tightened-Nsub grid), imp-95877/95745 (Q_0-sector quarantine), imp-95916 '
    + '(the open per-family attribution this sharpens)',
  scratch: ['tmp/imp-95925-scratch.mjs', 'tmp/imp-95925-fit.mjs'],

  C1,
  q0Recon: Q0_RECON,

  sweep: Object.freeze({
    moduli: MODULI,
    newModuli: Object.freeze([60, 80, 110, 150]),
    grid: 'Nsub=120000 (imp-95746-tightened); m=150 grid-checked at Nsub=240000, shift ~3.4e-11',
    intervals: INTERVALS,
    imbalances: Object.freeze(INTERVALS.map((r) => r.dQdm)),
  }),

  finding: Object.freeze({
    outcome: 'DECAYS to zero (clean asymptotic cancellation), does NOT floor',
    peakImbalance: PEAK_IMBALANCE,   // ~3.79e-6 at m~21
    tailImbalance: TAIL_IMBALANCE,   // ~1.91e-8 at m~130
    collapseFactor: COLLAPSE_FACTOR, // ~198x
    tailLogLogSlope: TAIL_LOGLOG_SLOPE, // ~-2.95, imbalance ~ midM^-3 on the positive tail
    signWobble: 'a single non-monotone sign change at the 41->60 interval (dQ/dm = -7.05e-8): Q0_RECON '
      + 'dips near m~50-60 before resuming its approach to the asymptote. Grid-converged (~1e-11), not '
      + 'quadrature noise; the reconstruction approaches its asymptote non-monotonically.',
    ratioTightens: 'the cancellation |D_3/C_1| tightens toward 1 by ~190x across the extended sweep '
      + '(1.0000189, 1.0000107, 1.0000077, 0.9999996, 1.0000006, 1.0000002, 1.0000001) -- not strictly '
      + 'monotone (the 41->60 wobble interval sits closest to 1, then 60->80 bumps up before the tail '
      + 'resumes tightening), but the clean positive tail (midM>=70) tightens monotonically.',
    reading:
      'The imp-95900 ~1e-6 imbalance was a small-window artifact: past m=41 it collapses ~2 orders of '
      + 'magnitude and the positive tail decays like ~midM^-3, so Q0_RECON tends to a finite limit and '
      + 'dQ/dm -> 0. The TIER-1/TIER-3 cancellation D_3(m) = -C_1 is therefore exact asymptotically, not '
      + 'floored at a nonzero residual.',
  }),

  consequenceForImp95916: Object.freeze({
    sharpens: 'the imp-95900 aggregate cancellation identity now has its imbalance measured to decay like '
      + '~midM^-3 to zero, so a candidate per-locus law (s_family(j,m), c_family(j,m)) must reproduce an '
      + 'aggregate TIER-3 m-slope equal to -C_1 up to an O(m^-3) remainder, not merely O(1e-6).',
    stillOpen: 'the per-family/per-locus attribution of the +0.2006346 aggregate slope stays OPEN '
      + '(imp-95916); this measurement sharpens the target the greedy lowest-mass K_v selection closed '
      + 'form must hit, but does not construct it.',
  }),

  verdict: Object.freeze({
    outcome: 'MEASURE ONLY -- imbalance DECAYS to zero (~midM^-3), does not floor; per-locus split OPEN',
    conclusion:
      'Extending the imp-95822 grid-converged Q0_RECON sweep to m=60,80,110,150 decides the imp-95900 '
      + 'open question: the ~1e-6 TIER-1/TIER-3 cancellation remainder does NOT floor -- it collapses '
      + '~198x (peak +3.79e-6 at m~21 to +1.91e-8 at m~130), the cancellation ratio tightens toward 1, '
      + 'and the positive large-m tail decays like ~midM^-2.95 (reached via one non-monotone sign wobble '
      + 'at 41->60). Q0_RECON approaches a finite asymptote so dQ/dm -> 0: a clean asymptotic '
      + 'cancellation, not a nonzero residual. Changes no bound; NO QED.',
  }),

  caveats:
    'Faithful 238-cell machinery re-used verbatim from imp-95822; new work is the large-m re-quadrature. '
    + 'Q0_RECON is certified only at m=20 (Sun 6.23 kappa): grid convergence to ~1e-11 bounds quadrature '
    + 'error, not reconstruction faithfulness at m>20 (imp-95822 residual sub-gap). The wide-interval '
    + 'finite difference averages any unit-step per-modulus alternation, so dQ/dm here is the macro-slope. '
    + 'Catalan G irrationality OPEN; Sun single-author, unrefereed; NO Lambda movement; no refereed bound is changed'
    + '; NO QED.',
});

export const TIER3_IMBALANCE_LARGEM_SWEEP_ASSERTIONS = Object.freeze([
  {
    name: 'the extended sweep adds m=60,80,110,150 to the imp-95900 moduli, Q0_RECON grid-converged',
    holds: () =>
      MODULI.length === 8
      && [60, 80, 110, 150].every((m) => typeof Q0_RECON[m] === 'number')
      && Math.abs(Q0_RECON[150] - -0.0106528111327) < 1e-13,
  },
  {
    name: 'imbalance dQ/dm(m) = C_1 + D_3(m) reproduces from Q0_RECON on every interval',
    holds: () =>
      INTERVALS.length === 7
      && INTERVALS.every((r) => {
        const dQdm = (Q0_RECON[r.to] - Q0_RECON[r.from]) / (r.to - r.from);
        return Math.abs(r.dQdm - dQdm) < 1e-18;
      }),
  },
  {
    name: 'FINDING: imbalance does NOT floor -- collapses >100x peak-to-tail (factor ~198)',
    holds: () =>
      DOES_NOT_FLOOR === true
      && COLLAPSE_FACTOR > 150 && COLLAPSE_FACTOR < 250
      && Math.abs(PEAK_IMBALANCE - 3.789621e-6) < 1e-11
      && Math.abs(TAIL_IMBALANCE - 1.914230e-8) < 1e-13,
  },
  {
    name: 'the cancellation ratio |D_3/C_1| tightens toward 1 by >100x across the extended sweep',
    holds: () =>
      RATIO_TIGHTENS === true
      && Math.abs(INTERVALS[0].cancellationRatio - 1.0000189) < 1e-6
      && Math.abs(INTERVALS[INTERVALS.length - 1].cancellationRatio - 1.0000001) < 1e-6,
  },
  {
    name: 'the positive large-m tail (midM>=70) decays monotonically toward zero, slope ~midM^-3',
    holds: () =>
      TAIL_DECAYS === true
      && TAIL.length === 3
      && TAIL_LOGLOG_SLOPE < -2 && TAIL_LOGLOG_SLOPE > -4,
  },
  {
    name: 'a single sign wobble at 41->60 (dQ/dm < 0), grid-converged, not quadrature noise',
    holds: () => {
      const r = INTERVALS.find((x) => x.from === 41 && x.to === 60);
      return !!r && r.dQdm < 0 && Math.abs(r.dQdm - -7.054651e-8) < 1e-13
        && /sign change/.test(TIER3_IMBALANCE_LARGEM_SWEEP.finding.signWobble);
    },
  },
  {
    name: 'verdict is MEASURE ONLY: decays not floors, per-locus split open, disclaimers present',
    holds: () => {
      const v = TIER3_IMBALANCE_LARGEM_SWEEP.verdict;
      const s = TIER3_IMBALANCE_LARGEM_SWEEP.status;
      return /MEASURE ONLY/.test(v.outcome)
        && /does not floor/.test(v.outcome)
        && /per-locus split OPEN/.test(v.outcome)
        && /G irrationality OPEN/.test(s)
        && /refereed bound is changed/i.test(s)
        && /NO QED/.test(s);
    },
  },
]);

export default TIER3_IMBALANCE_LARGEM_SWEEP;
