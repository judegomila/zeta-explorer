/**
 * @module imp-35072-ecoll-exponent-residual-fd-crossvalidation
 *
 * imp-35072 (numerical, frontier-direction): INDEPENDENT SECOND-PATH cross-validation of the
 * imp-34130 resolution that the imp-33620 SEPARATED E_coll local-exponent residual to -1/2 decays
 * as ~1/(2 log T0) (and does NOT floor). imp-34130 identified that residual law along a SINGLE
 * route: a per-decade OLS ladder (F1) plus a regression against 1/log T0 (F2) plus a central FD
 * on the imp-33859 log-space SURROGATE path ln N = u + log(u-1) (F3). Every one of those shares
 * either the OLS convention or the Riemann-von Mangoldt inverse surrogate; a bug in the OLS
 * windowing or in the u+log(u-1) inversion would propagate to all three silently. This module
 * recomputes the residual from a STRUCTURALLY DIFFERENT path -- a from-source CENTRAL
 * FINITE-DIFFERENCE derivative of ln E_coll vs ln N evaluated ON THE TRUE effectiveHeightForN
 * height mapping (never OLS, never the u+log(u-1) surrogate) -- across the SAME [1e11..1e18] rungs,
 * and confirms the 1/(2 log T0) law to the same precision, reconciling the two paths.
 *
 * THE QUANTITY (identical inherited imp-3220/imp-3406 separated-E_coll form)
 * -------------------------------------------------------------------------
 *     E_coll(N) = C_C_PINNED * sqrt(log T0 / N),   T0 = effectiveHeightForN(N)   (GUE-conditional C_H)
 * SEPARATED = the E_coll sub-term ALONE, not the sigma = E_coll/(E_trunc+E_flow+E_coll) share.
 * Local exponent in ln N:  q(N) = d ln E_coll / d ln N,   residual  resid(N) = q(N) + 1/2 >= 0.
 *
 * THE INDEPENDENT PATH (this module, distinct from every imp-34130 route)
 * ----------------------------------------------------------------------
 * At each decade MIDPOINT log10(N) = k + 1/2 we form the local exponent by a symmetric central
 * finite difference of ln E_coll in ln N,
 *     q_FD(k) = [ ln E_coll(lnN + h) - ln E_coll(lnN - h) ] / (2h),   h = 1e-3,
 * where ln E_coll is evaluated through the TRUE effectiveHeightForN(N) map at every sample. This is
 * a POINTWISE derivative at the decade midpoint -- NOT the imp-34130/imp-33816 four-point-per-decade
 * OLS slope, and NOT the imp-33859 log-space u+log(u-1) surrogate. It shares only the underlying
 * component model (the reuse gate), so agreement is a genuine cross-check of the residual LAW, not a
 * restatement of the same arithmetic.
 *
 * THE FINDING (cross-validation / measurement only)
 * -------------------------------------------------
 *   (X1) THE FD PATH REPRODUCES THE imp-33620/imp-34130 ANCHORS. q_FD at the [1e11,1e12] and
 *        [1e14,1e15] midpoints is -0.4810 and -0.4848 (the imp-33620 anchors), and resid_FD at
 *        [1e14,1e15] is ~0.0152 -- matching the imp-34130 OLS ladder, proving the identical
 *        inherited separated-E_coll model is in use.
 *   (X2) THE FD RESIDUAL EQUALS THE CLOSED-FORM 1/(2 log T0) LAW TO ~3e-10. Against the closed form
 *        resid_cf(N) = (1/2)(u-1)/(u log T0), u = log T0 - log(2pi), the from-source FD residual
 *        agrees to a relative ~3e-10 at EVERY rung [1e11..1e18] -- a round-off-floor confirmation of
 *        the imp-34130 law along a path that never uses the u+log(u-1) inverse to GENERATE ln N.
 *   (X3) log T0 * resid_FD RISES MONOTONICALLY TOWARD 1/2. The product climbs 0.47861 ([1e11,1e12])
 *        -> 0.48638 ([1e17,1e18]), matching the imp-34130 F1/F3 product ladder and confirming
 *        resid_FD ~ 1/(2 log T0); the residual itself falls monotonically 1.899e-2 -> 1.262e-2 with
 *        no plateau, every rung strictly above -1/2 (from above).
 *   (X4) THE TWO PATHS RECONCILE. The FD (pointwise-midpoint) and OLS (decade-averaged) residuals
 *        agree to < 2e-5 absolute at every rung; the tiny gap is the expected averaging-vs-pointwise
 *        offset of a slightly convex curve over a decade, NOT a path disagreement. Both paths land
 *        on the same 1/(2 log T0) law.
 *
 * The punchline: an INDEPENDENT from-source central-difference derivative on the true height map --
 * sharing neither the OLS windowing nor the imp-33859 log-space surrogate of imp-34130 -- confirms
 * the imp-33620 separated-E_coll local-exponent residual decays as ~1/(2 log T0) (log T0 * resid ->
 * 1/2), to ~3e-10 against the closed form. The imp-34130 resolution is NOT a single-route artifact.
 *
 * CROSS-VALIDATION / MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the far-tail exponent stays 1/2 per imp-3463; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (the resolution being cross-validated: OLS ladder + 1/log T0 regression + log-space direct path)
 * @see imp-33620 (roadmap: separated E_coll local exponent -0.4810@1e12 -> -0.4848@1e15, residual ~0.0152, close-vs-floor)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (the sigma-share exponent gap ~ 1/(2 log T0); same law)
 * @see imp-33859 (log-space direct path ln N = u + log(u-1); the surrogate this path deliberately AVOIDS)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> -1/2 from above)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote; E_coll local exponent -> -1/2 from above
const FD_STEP = 1e-3; // central-difference step in ln N (step-independent to <1e-9, see qFD)

// SEPARATED E_coll = C_C sqrt(log T0 / N), evaluated in log-N space on the TRUE height map.
function lnEcoll(lnN) {
  const N = Math.exp(lnN);
  const L = Math.log(effectiveHeightForN(N));
  return Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
}

// INDEPENDENT PATH: from-source central FD derivative of ln E_coll in ln N at the decade midpoint,
// on the true effectiveHeightForN map (NOT OLS, NOT the imp-33859 u+log(u-1) surrogate).
function qFD(k) {
  const lnN = (k + 0.5) * Math.LN10;
  return (lnEcoll(lnN + FD_STEP) - lnEcoll(lnN - FD_STEP)) / (2 * FD_STEP);
}
const logT0Mid = (k) => Math.log(effectiveHeightForN(Math.pow(10, k + 0.5)));

// imp-34130 per-decade OLS local exponent (reconciliation reference ONLY; four pts/decade).
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

// Closed-form residual law (imp-34130): resid_cf = (1/2)(u-1)/(u log T0), u = log T0 - log(2pi).
function residClosedForm(L) {
  const u = L - Math.log(TWO_PI);
  return HALF * (u - 1) / (u * L);
}

const FD_LADDER = [11, 12, 13, 14, 15, 16, 17].map((k) => {
  const q = qFD(k);
  const L = logT0Mid(k);
  const residFD = q + HALF;
  const residOLS = olsDecade(k) + HALF;
  const residCF = residClosedForm(L);
  return {
    decade: `1e${k}->1e${k + 1}`,
    q_local_FD: +q.toFixed(4),
    residFD: +residFD.toExponential(4),
    residOLS: +residOLS.toExponential(4),
    residClosedForm: +residCF.toExponential(4),
    relDiffToClosedForm: +(Math.abs(residFD - residCF) / residCF).toExponential(2),
    absDiffToOLS: +Math.abs(residFD - residOLS).toExponential(2),
    logT0_mid: +L.toFixed(2),
    logT0_times_residFD: +(L * residFD).toFixed(5), // -> 0.5 confirms resid ~ 1/(2 log T0)
  };
});

// step-independence of the central FD at the [1e14,1e15] midpoint (four steps decades apart).
const FD_STEP_INDEPENDENCE = [1e-2, 1e-3, 1e-4].map((h) => {
  const lnN = 14.5 * Math.LN10;
  return (lnEcoll(lnN + h) - lnEcoll(lnN - h)) / (2 * h);
});
const FD_STEP_SPREAD = Math.max(...FD_STEP_INDEPENDENCE) - Math.min(...FD_STEP_INDEPENDENCE);

const MAX_REL_DIFF_TO_CF = Math.max(...FD_LADDER.map((r) => r.relDiffToClosedForm));
const MAX_ABS_DIFF_TO_OLS = Math.max(...FD_LADDER.map((r) => r.absDiffToOLS));

export const IMP35072_ECOLL_EXPONENT_RESIDUAL_FD_CROSSVALIDATION = {
  id: 'imp-35072',
  proofSection: 'S-frontier',
  question:
    'imp-34130 resolved the imp-33620 separated E_coll local-exponent residual to -1/2 as decaying ' +
    '~1/(2 log T0) along a SINGLE route (per-decade OLS ladder + 1/log T0 regression + a central FD ' +
    'on the imp-33859 log-space u+log(u-1) surrogate). Recompute the residual from a STRUCTURALLY ' +
    'DIFFERENT from-source path -- a central finite-difference derivative of ln E_coll vs ln N on the ' +
    'TRUE effectiveHeightForN map (never OLS, never the surrogate) -- across the same [1e11..1e18] ' +
    'rungs and confirm the 1/(2 log T0) law. Cross-validation / measurement only; C_mb stays ' +
    'GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'separated E_coll = C_C sqrt(log T0 / N); its from-source central-difference local exponent ' +
    'q_FD(N) at each decade midpoint and residual resid_FD = q_FD + 1/2 over [1e11..1e18]; compared ' +
    'against the closed-form (1/2)(u-1)/(u log T0) law and reconciled against the imp-34130 OLS ladder',
  fdStep: FD_STEP,
  fdLadder: FD_LADDER,
  fdStepIndependenceAt1e14_1e15: {
    steps: [1e-2, 1e-3, 1e-4],
    q_values: FD_STEP_INDEPENDENCE.map((v) => +v.toFixed(9)),
    spread: +FD_STEP_SPREAD.toExponential(2), // < 1e-8: the FD is step-independent, not a step artifact
  },
  maxRelDiffToClosedForm: +MAX_REL_DIFF_TO_CF.toExponential(2), // ~3e-10 across the ladder
  maxAbsDiffToOLS: +MAX_ABS_DIFF_TO_OLS.toExponential(2), // < 2e-5 (averaging-vs-pointwise offset)
  farTailExponent: -HALF, // imp-3463 asymptote the exponent approaches from above
  finding: {
    X1_fd_reproduces_anchors:
      'The from-source central-difference exponent at the [1e11,1e12] and [1e14,1e15] midpoints is ' +
      '-0.4810 and -0.4848 (the imp-33620/imp-34130 anchors) with resid_FD ~ 0.0152 at [1e14,1e15], ' +
      'proving the identical inherited separated-E_coll component model is in use.',
    X2_fd_matches_closed_form_law:
      'Against the closed form resid_cf = (1/2)(u-1)/(u log T0) the from-source FD residual agrees to ' +
      'a relative ~3e-10 at every rung [1e11..1e18] -- a round-off-floor confirmation of the imp-34130 ' +
      '1/(2 log T0) law along a path that never GENERATES ln N via the u+log(u-1) inverse.',
    X3_product_rises_to_half:
      'log T0 * resid_FD rises monotonically 0.47861 ([1e11,1e12]) -> 0.48638 ([1e17,1e18]), matching ' +
      'the imp-34130 product ladder and confirming resid_FD ~ 1/(2 log T0); the residual itself falls ' +
      'monotonically 1.899e-2 -> 1.262e-2, every rung strictly above -1/2, no plateau.',
    X4_paths_reconcile:
      'The FD (pointwise-midpoint) and OLS (decade-averaged) residuals agree to < 2e-5 absolute at ' +
      'every rung -- the expected averaging-vs-pointwise offset of a slightly convex curve, NOT a path ' +
      'disagreement. The two independent routes land on the same 1/(2 log T0) law.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier-direction, NOT rigorous). An INDEPENDENT from-source central-difference ' +
    'derivative of ln E_coll vs ln N on the TRUE effectiveHeightForN map -- sharing neither the ' +
    'imp-34130 OLS windowing nor the imp-33859 log-space u+log(u-1) surrogate -- reproduces the ' +
    'imp-33620 anchors (-0.4810@[1e11,1e12], -0.4848@[1e14,1e15], residual ~0.0152) and confirms the ' +
    'separated E_coll local-exponent residual to -1/2 decays as ~1/(2 log T0): the FD residual equals ' +
    'the closed form (1/2)(u-1)/(u log T0) to a relative ~3e-10 at every rung, log T0 * resid_FD rises ' +
    'monotonically 0.47861 -> 0.48638 toward 1/2, and the FD and OLS residuals reconcile to < 2e-5. ' +
    'The imp-34130 resolution is confirmed along a second, structurally-distinct computation path -- ' +
    'not a single-route artifact. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the far-tail exponent stays 1/2 per imp-3463; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34130 (OLS ladder + 1/log T0 regression + log-space direct path identifying resid ~ 1/(2 log T0)); ' +
    'imp-33620 (roadmap: separated E_coll local exponent, close-vs-floor); imp-33816 (sigma-share ' +
    'exponent gap ~ 1/(2 log T0), same law); imp-33859 (log-space surrogate ln N = u + log(u-1), ' +
    'AVOIDED here); imp-3463 (far-tail leading form, exponent -> -1/2 from above); imp-486 (C_mb ' +
    'GUE-conditional); polymath15-constant-C-C (C_C); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35072_ECOLL_EXPONENT_RESIDUAL_FD_CROSSVALIDATION_ASSERTIONS = [
  {
    // (X1) reuse gate: the from-source FD exponent reproduces the imp-33620/imp-34130 anchors.
    id: 'imp35072-fd-reproduces-imp33620-anchors',
    description: 'from-source central-FD exponent reproduces -0.4810@[1e11,1e12], -0.4848@[1e14,1e15], resid ~0.0152',
    holds: () =>
      Math.abs(FD_LADDER[0].q_local_FD - -0.481) < 1e-4 &&
      Math.abs(FD_LADDER[3].q_local_FD - -0.4848) < 1e-4 &&
      Math.abs(FD_LADDER[3].residFD - 0.0152) < 5e-4,
  },
  {
    // (X2) the from-source FD residual equals the closed-form 1/(2 log T0) law to a round-off floor.
    id: 'imp35072-fd-matches-closed-form-law',
    description: 'FD residual equals (1/2)(u-1)/(u log T0) to relative < 1e-8 at every rung [1e11..1e18]',
    holds: () => MAX_REL_DIFF_TO_CF < 1e-8,
  },
  {
    // (X3) log T0 * resid_FD rises monotonically toward 1/2; residual falls monotonically, all > -1/2.
    id: 'imp35072-product-rises-to-half',
    description: 'log T0 * resid_FD rises monotonically toward 0.5; resid_FD falls monotonically, every q_FD > -1/2',
    holds: () => {
      for (let i = 1; i < FD_LADDER.length; i++) {
        if (!(FD_LADDER[i].logT0_times_residFD > FD_LADDER[i - 1].logT0_times_residFD)) return false;
        if (!(FD_LADDER[i].residFD < FD_LADDER[i - 1].residFD)) return false;
      }
      const last = FD_LADDER[FD_LADDER.length - 1];
      return (
        FD_LADDER.every((r) => r.q_local_FD > -HALF && r.residFD > 0) &&
        last.logT0_times_residFD > FD_LADDER[0].logT0_times_residFD &&
        last.logT0_times_residFD < HALF
      );
    },
  },
  {
    // (X4) reconciliation: FD (pointwise) and OLS (decade-averaged) residuals agree tightly.
    id: 'imp35072-fd-ols-reconcile',
    description: 'FD and OLS residuals agree to < 2e-5 absolute at every rung (averaging-vs-pointwise offset only)',
    holds: () => MAX_ABS_DIFF_TO_OLS < 2e-5,
  },
  {
    // step-independence: the central FD is not a finite-step artifact.
    id: 'imp35072-fd-step-independent',
    description: 'central-FD exponent is step-independent to < 1e-8 across steps 1e-2, 1e-3, 1e-4',
    holds: () => FD_STEP_SPREAD < 1e-8,
  },
  {
    // honesty gate: cross-validation only, far-tail exponent = -1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35072-honesty-gate-no-qed',
    description: 'Cross-validation only: far-tail exponent = -1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP35072_ECOLL_EXPONENT_RESIDUAL_FD_CROSSVALIDATION.isRigorous === false &&
      IMP35072_ECOLL_EXPONENT_RESIDUAL_FD_CROSSVALIDATION.farTailExponent === -0.5 &&
      /NO QED/.test(IMP35072_ECOLL_EXPONENT_RESIDUAL_FD_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP35072_ECOLL_EXPONENT_RESIDUAL_FD_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP35072_ECOLL_EXPONENT_RESIDUAL_FD_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35072-ecoll-exponent-residual-fd-crossvalidation assertion failed: ${a.id}`);
  }
}
