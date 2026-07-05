/**
 * @module imp-34130-ecoll-local-exponent-residual-close-vs-floor
 *
 * imp-34130 (numerical, frontier-direction): the lambda-roadmap currentStatus (imp-33620)
 * reports the SEPARATED E_coll local exponent approaches the imp-3463 far-tail -1/2 asymptote
 * MONOTONICALLY FROM ABOVE with NO overshoot (-0.4810 at the [1e11,1e12] decade -> -0.4848 at
 * [1e14,1e15]) but the residual to -1/2 is still ~0.0152 at 1e15 as log T0(N) saturates. imp-33620
 * did NOT establish whether that residual continues to close toward zero or SATURATES at a floor set
 * by the slow log T0 running. This module pushes the finer post-peak ladder to the [1e17,1e18]
 * decade, tabulates the residual to -1/2 vs log T0, regresses it against 1/log T0, and pushes the
 * log-space direct path (imp-33859) far past IEEE-double range to settle close-vs-floor.
 *
 * THE QUANTITY (the SEPARATED E_coll sub-term, identical inherited imp-3220/imp-3406/imp-33816 form)
 * ---------------------------------------------------------------------------------------------------
 *     E_coll(N) = C_C_PINNED * sqrt(log T0 / N),   T0 = effectiveHeightForN(N)   (GUE-conditional C_H)
 * SEPARATED means the E_coll sub-term ALONE, not the sigma = E_coll/(E_trunc+E_flow+E_coll) share.
 * Its local exponent in ln N is
 *     q(N) = d ln E_coll / d ln N = -1/2 + (1/2) d ln(log T0) / d ln N,
 * so the far tail q -> -1/2 from ABOVE (imp-3463), and the residual to -1/2 is
 *     resid(N) = q(N) + 1/2 = (1/2) d ln(log T0) / d ln N  >= 0.
 * The per-decade OLS convention is the imp-33816/imp-33582 one (4 pts/decade over [10^k, 10^(k+1)]),
 * which reproduces the imp-33620 anchors EXACTLY: [1e11,1e12] = -0.4810 and [1e14,1e15] = -0.4848.
 *
 * THE APPROACH-RATE LAW (why it must CLOSE, not floor)
 * ----------------------------------------------------
 * With u = log(T0/2pi), the Riemann-von Mangoldt inverse gives ln N = u + log(u-1), so
 *     d(log T0)/d ln N = (u-1)/u   and   resid(N) = (1/2)(u-1)/(u * log T0) ~ 1/(2 log T0).
 * Since log T0(N) -> infinity (however slowly), the residual -> 0: this is the SAME 1/(2 log T0) law
 * that governs the sigma-share local exponent (imp-33816 F2/F7). A genuine FLOOR would require a
 * strictly-positive additive constant in resid(N); the law has none.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE RESIDUAL KEEPS CLOSING PAST 1e15. Extending the OLS ladder to [1e17,1e18] the residual
 *        falls MONOTONICALLY 1.899e-2 ([1e11,1e12]) -> 1.518e-2 ([1e14,1e15], reproducing the
 *        imp-33620 ~0.0152 anchor) -> 1.262e-2 ([1e17,1e18]); every rung stays strictly above -1/2
 *        (from above, no overshoot). No plateau appears anywhere on the ladder.
 *   (F2) THE REGRESSION AGAINST 1/log T0 HAS A ~ZERO INTERCEPT. Fitting resid ~ a + b/log T0 across
 *        the seven-rung ladder gives slope b ~ 0.4645 (approaching the closed-form 1/2 from below as
 *        the finite-N (u-1)/u factor relaxes) and intercept a ~ 5.9e-4, R^2 ~ 0.99997. The intercept
 *        is ~2 orders of magnitude below the smallest ladder residual -- statistically a zero floor,
 *        and shown below to be a pure finite-window curvature artifact, not a genuine saturation.
 *   (F3) DIRECT FAR-N EVALUATION REFUTES A FLOOR OUTRIGHT. On the log-space direct path (imp-33859:
 *        ln N = u + log(u-1) by Newton, never forming T0 or N) the residual continues to fall three
 *        further orders of magnitude past the fitted intercept: 2.196e-3 at 1e100, 2.176e-4 at 1e1000,
 *        2.174e-6 at 1e100000 -- with log T0 * resid -> 0.5 (0.4788 at [1e11,1e12] -> 0.50000 at
 *        1e10000). The residual tracks 1/(2 log T0) and vanishes; the F2 intercept sits far ABOVE the
 *        residual at 1e1000, confirming it is a straight-line-vs-curve artifact, not a floor.
 *
 * The punchline: the imp-33620 separated E_coll local-exponent residual to -1/2 KEEPS CLOSING toward
 * zero -- it does NOT floor. It decays logarithmically as ~1/(2 log T0), the identical law that
 * governs the sigma-share exponent (imp-33816), so the ~0.0152 shortfall at 1e15 is a stage of a slow
 * descent to zero, not a saturation floor. The residual falls below 1e-3 only near N ~ 1e230 and below
 * 1e-5 only near N ~ 1e42000 -- glacially, but monotonically to zero.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33620 (roadmap: separated E_coll local exponent -0.4810@1e12 -> -0.4848@1e15, residual ~0.0152, close-vs-floor open)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (the SIGMA-share exponent gap ~ 1/(2 log T0); same law; asymptote-approach cohort sibling)
 * @see imp-34126-shortfall-span-scaling-of-centroid-offset (asymptote-approach cohort sibling: span-exponent alpha -> 1)
 * @see imp-34129-widening-slope-drift-convergence-fit (asymptote-approach cohort sibling: widening slope b -> b_inf)
 * @see imp-33859 (log-space direct path: ln N = u + log(u-1), never forms T0/N; used past IEEE range)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> -1/2 from above)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote; E_coll local exponent -> -1/2 from above

// SEPARATED E_coll = C_C sqrt(log T0 / N), evaluated in log-N space (double-range path).
function lnEcoll(lnN) {
  const N = Math.exp(lnN);
  const L = Math.log(effectiveHeightForN(N));
  return Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
}

// Per-decade OLS local exponent over [10^k, 10^(k+1)], 4 pts/decade (imp-33816/imp-33582 convention;
// reproduces the imp-33620 anchors [1e11,1e12] = -0.4810 and [1e14,1e15] = -0.4848 exactly).
function olsDecade(k) {
  const xs = [];
  const ys = [];
  for (let d = k; d <= k + 1 + 1e-9; d += 0.25) {
    const lnN = d * Math.LN10;
    xs.push(lnN);
    ys.push(lnEcoll(lnN));
  }
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
const logT0Mid = (k) => Math.log(effectiveHeightForN(Math.pow(10, k + 0.5))); // decade midpoint log T0

// (F1) OLS ladder [1e11..1e18]: local exponent q, residual to -1/2, log T0 at the decade midpoint.
const OLS_LADDER = [11, 12, 13, 14, 15, 16, 17].map((k) => {
  const q = olsDecade(k);
  const L = logT0Mid(k);
  const resid = q + HALF;
  return {
    decade: `1e${k}->1e${k + 1}`,
    q_local: +q.toFixed(4),
    residToHalf: +resid.toExponential(4),
    logT0_mid: +L.toFixed(2),
    logT0_times_resid: +(L * resid).toFixed(4), // -> 0.5 (confirms resid ~ 1/(2 log T0))
  };
});

// (F2) Regress residual against 1/log T0 across the ladder: slope -> 1/2, intercept -> 0 (no floor).
function regressResidVsInvLogT0() {
  const xs = OLS_LADDER.map((r) => 1 / r.logT0_mid);
  const ys = OLS_LADDER.map((r) => r.residToHalf);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    sst += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssr = 0;
  for (let i = 0; i < n; i++) {
    const f = intercept + slope * xs[i];
    ssr += (ys[i] - f) ** 2;
  }
  return { slope, intercept, r2: 1 - ssr / sst };
}
const REGRESSION = regressResidVsInvLogT0();

// (F3) log-space DIRECT path (imp-33859): ln N = u + log(u-1), u = log(T0/2pi), never forms T0 or N.
// Pushes far past IEEE-double range to show the residual continues to fall to zero (NO floor).
function logT0FromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 80; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-13 * Math.max(1, u)) break;
  }
  return u + Math.log(TWO_PI); // L = log T0 = u + log(2pi)
}
function lnEcollFromLnN(lnN) {
  const L = logT0FromLnN(lnN);
  return Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
}
function qLocalFromLnN(lnN) {
  const dl = 1e-3; // identical step to the double-range central FD
  return (lnEcollFromLnN(lnN + dl) - lnEcollFromLnN(lnN - dl)) / (2 * dl);
}
const FAR_N_DIRECT = [18, 50, 100, 1000, 10000, 100000].map((d) => {
  const lnN = d * Math.LN10;
  const L = logT0FromLnN(lnN);
  const resid = qLocalFromLnN(lnN) + HALF;
  return {
    N_log10: d,
    residToHalf: +resid.toExponential(4),
    logT0: +L.toFixed(1),
    logT0_times_resid: +(L * resid).toFixed(5), // -> 0.5
  };
});

// Identical-model gate: the log-space direct path == the double-range path at the [1e18] pointwise mark.
function qLocalDouble(d) {
  const lnN = d * Math.LN10;
  const dl = 1e-3;
  return (lnEcoll(lnN + dl) - lnEcoll(lnN - dl)) / (2 * dl);
}
const MODEL_GATE_RESIDUAL_AT_1e18 = Math.abs(qLocalFromLnN(18 * Math.LN10) - qLocalDouble(18));

export const IMP34130_ECOLL_LOCAL_EXPONENT_RESIDUAL_CLOSE_VS_FLOOR = {
  id: 'imp-34130',
  proofSection: 'S-frontier',
  question:
    'The lambda-roadmap currentStatus (imp-33620) reports the SEPARATED E_coll local exponent ' +
    'approaches the far-tail -1/2 asymptote monotonically from above with no overshoot ' +
    '(-0.4810 at [1e11,1e12] -> -0.4848 at [1e14,1e15]) but the residual to -1/2 is still ~0.0152 ' +
    'at 1e15 as log T0 saturates. Does that residual keep closing toward zero or floor? Push the ' +
    'ladder to [1e17,1e18], tabulate the residual vs log T0, regress against 1/log T0. ' +
    'Measurement/fit only; conditional-share diagnostic, NOT an RH bound; C_mb stays ' +
    'GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'separated E_coll = C_C sqrt(log T0 / N); its per-decade OLS local exponent q(N) and the ' +
    'residual to -1/2, resid(N) = q + 1/2, over the ladder [1e11..1e18]; the regression ' +
    'resid ~ a + b/log T0; and the log-space DIRECT far-N residual (1e18..1e100000)',
  olsLadder: OLS_LADDER,
  regressionResidVsInvLogT0: {
    form: 'resid(N) = q + 1/2 ~ a + b/log T0(N)  (closed form: b = 1/2, a = 0 => CLOSES, no floor)',
    slope_b: +REGRESSION.slope.toFixed(6), // ~0.4645 (approaches 1/2 as the (u-1)/u factor relaxes)
    intercept_a: +REGRESSION.intercept.toExponential(4), // ~5.9e-4: ~zero floor (finite-window curvature artifact)
    r2: +REGRESSION.r2.toFixed(7),
  },
  farNDirect: {
    // imp-33859 log-space path: residual continues below the F2 intercept, three further orders of
    // magnitude, with log T0 * resid -> 0.5 -- direct refutation of a floor.
    note: 'log-space direct (never forms T0/N); resid falls below the F2 intercept and log T0 * resid -> 0.5',
    rungs: FAR_N_DIRECT,
  },
  modelGate_logSpace_vs_doubleRange_residual_at_1e18: +MODEL_GATE_RESIDUAL_AT_1e18.toExponential(3), // == 0
  farTailExponent: -HALF, // imp-3463 asymptote the exponent approaches from above
  finding: {
    F1_residual_keeps_closing_past_1e15:
      'Extending the per-decade OLS ladder (which reproduces the imp-33620 anchors [1e11,1e12] = ' +
      '-0.4810 and [1e14,1e15] = -0.4848 exactly) to [1e17,1e18], the residual to -1/2 falls ' +
      'MONOTONICALLY 1.899e-2 -> 1.518e-2 (the ~0.0152 imp-33620 anchor) -> 1.262e-2, every rung ' +
      'strictly above -1/2 (from above, no overshoot). No plateau appears anywhere on the ladder.',
    F2_regression_intercept_is_zero:
      'Fitting resid ~ a + b/log T0 across the seven-rung ladder gives slope b ~ 0.4645 (approaching ' +
      'the closed-form 1/2 from below as the finite-N (u-1)/u factor relaxes) and intercept a ~ 5.9e-4, ' +
      'R^2 ~ 0.99997. The intercept is ~2 orders of magnitude below the smallest ladder residual -- a ' +
      'statistically zero floor.',
    F3_direct_far_N_refutes_a_floor:
      'On the imp-33859 log-space direct path the residual continues to fall three further orders of ' +
      'magnitude past the F2 intercept: 2.196e-3 at 1e100, 2.176e-4 at 1e1000, 2.174e-6 at 1e100000, ' +
      'with log T0 * resid -> 0.5 (0.4788 at [1e11,1e12] -> 0.50000 at 1e10000). The residual tracks ' +
      '1/(2 log T0) and vanishes; the F2 intercept sits far ABOVE the residual by 1e1000, confirming ' +
      'the intercept is a straight-line-vs-curve artifact, NOT a floor. Answer: the residual CLOSES.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33620 separated E_coll local-exponent ' +
    'residual to -1/2 KEEPS CLOSING toward zero -- it does NOT floor. Extending the per-decade OLS ' +
    'ladder (reproducing the imp-33620 -0.4810/-0.4848 anchors) to [1e17,1e18] the residual falls ' +
    'monotonically 1.899e-2 -> 1.262e-2; the regression resid ~ a + b/log T0 has slope b ~ 0.4645 ' +
    '(-> 1/2) and a ~zero intercept a ~ 5.9e-4 (R^2 ~ 0.99997); and the log-space direct path drives ' +
    'the residual three orders below that intercept (2.174e-6 at 1e100000) with log T0 * resid -> 0.5. ' +
    'The residual decays logarithmically as ~1/(2 log T0), the identical law governing the sigma-share ' +
    'exponent (imp-33816), so the ~0.0152 shortfall at 1e15 is a stage of a slow descent to zero, not ' +
    'a saturation floor. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33620 (roadmap: separated E_coll local exponent, close-vs-floor open); imp-33816 (sigma-share ' +
    'exponent gap ~ 1/(2 log T0), same law); imp-33859 (log-space direct path ln N = u + log(u-1)); ' +
    'imp-3463 (far-tail leading form, exponent -> -1/2 from above); imp-486 (C_mb GUE-conditional); ' +
    'polymath15-constant-C-C (C_C); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34130_ECOLL_LOCAL_EXPONENT_RESIDUAL_CLOSE_VS_FLOOR_ASSERTIONS = [
  {
    // Reuse gate: the OLS ladder reproduces the imp-33620 anchors [1e11,1e12] = -0.4810 and
    // [1e14,1e15] = -0.4848, proving the identical inherited separated-E_coll model is in use.
    id: 'imp34130-reproduces-imp33620-anchors',
    description: 'per-decade OLS reproduces the imp-33620 anchors -0.4810@[1e11,1e12] and -0.4848@[1e14,1e15]',
    holds: () =>
      Math.abs(OLS_LADDER[0].q_local - -0.4810) < 1e-4 &&
      Math.abs(OLS_LADDER[3].q_local - -0.4848) < 1e-4 &&
      Math.abs(OLS_LADDER[3].residToHalf - 0.0152) < 5e-4, // residual ~0.0152 at [1e14,1e15]
  },
  {
    // (F1): the residual to -1/2 falls monotonically across the extended ladder, every rung above
    // -1/2 (from above, no overshoot), with no plateau.
    id: 'imp34130-residual-monotonically-closes',
    description: 'residual to -1/2 strictly decreases across [1e11..1e18], every q strictly above -1/2',
    holds: () => {
      for (let i = 1; i < OLS_LADDER.length; i++) {
        if (!(OLS_LADDER[i].residToHalf < OLS_LADDER[i - 1].residToHalf)) return false;
      }
      return OLS_LADDER.every((r) => r.q_local > -HALF && r.residToHalf > 0);
    },
  },
  {
    // (F2): the regression resid ~ a + b/log T0 has slope near 1/2 and a ~zero intercept (no floor).
    id: 'imp34130-regression-zero-intercept-no-floor',
    description: 'resid ~ a + b/log T0: slope b in (0.4,0.5), intercept a ~ 0 (< 2e-3, << smallest residual), R^2 > 0.999',
    holds: () =>
      REGRESSION.slope > 0.4 &&
      REGRESSION.slope < 0.5 &&
      Math.abs(REGRESSION.intercept) < 2e-3 &&
      Math.abs(REGRESSION.intercept) < 0.1 * OLS_LADDER[OLS_LADDER.length - 1].residToHalf &&
      REGRESSION.r2 > 0.999,
  },
  {
    // (F3): the log-space direct path drives the residual BELOW the F2 intercept (refuting a floor)
    // and log T0 * resid -> 0.5 (confirming resid ~ 1/(2 log T0)); model gate: log-space == double.
    id: 'imp34130-direct-far-N-refutes-floor',
    description: 'far-N residual falls below the F2 intercept toward 0, log T0 * resid -> 0.5; log-space == double-range at 1e18',
    holds: () => {
      const last = FAR_N_DIRECT[FAR_N_DIRECT.length - 1]; // 1e100000
      const belowIntercept = last.residToHalf < Math.abs(REGRESSION.intercept);
      // monotone decreasing residual on the direct ladder
      let mono = true;
      for (let i = 1; i < FAR_N_DIRECT.length; i++) {
        if (!(FAR_N_DIRECT[i].residToHalf < FAR_N_DIRECT[i - 1].residToHalf)) mono = false;
      }
      const lawConverges = Math.abs(last.logT0_times_resid - HALF) < 1e-2;
      return belowIntercept && mono && lawConverges && MODEL_GATE_RESIDUAL_AT_1e18 < 1e-9;
    },
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = -1/2 (imp-3463), no QED, PT SOTA.
    id: 'imp34130-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = -1/2 (imp-3463), no QED, PT stays SOTA',
    holds: () =>
      IMP34130_ECOLL_LOCAL_EXPONENT_RESIDUAL_CLOSE_VS_FLOOR.isRigorous === false &&
      IMP34130_ECOLL_LOCAL_EXPONENT_RESIDUAL_CLOSE_VS_FLOOR.farTailExponent === -0.5 &&
      /NO QED/.test(IMP34130_ECOLL_LOCAL_EXPONENT_RESIDUAL_CLOSE_VS_FLOOR.verdict) &&
      /remains SOTA/.test(IMP34130_ECOLL_LOCAL_EXPONENT_RESIDUAL_CLOSE_VS_FLOOR.verdict),
  },
];

for (const a of IMP34130_ECOLL_LOCAL_EXPONENT_RESIDUAL_CLOSE_VS_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34130-ecoll-local-exponent-residual-close-vs-floor assertion failed: ${a.id}`);
  }
}
