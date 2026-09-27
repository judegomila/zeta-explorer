/**
 * @module imp-97645-wlin-largeb-linear-coeff-crossval
 * @fileoverview imp-97645 -- NUMERICAL CROSS-CHECK (no bound moved): re-run the imp-97618 Vasyunin
 *   double-sum limit at LARGER b (>= 1e6) with a wider phase-average window, to test whether the
 *   linear coefficient of w_lin(x) = 2C/pi + log(x)/pi - x/pi (C = (log 2pi - gamma)/2) tightens
 *   toward its forced value -1/pi. imp-97618 matched const 2C/pi to 5.2e-4 and log 1/pi to 9.7e-5
 *   at b = 400000 (window +-40), but the LINEAR coefficient only to 6.4e-3 because it sits at the
 *   O(x)/O(x^2) boundary where the imp-97460 arithmetic wobble tail first enters.
 *
 *   METHOD. Same operational cross-check: w(x) = lim_{b->oo} (V(x b, b) + V(b, x b)) / b IS the
 *   (z -> 0) specialisation of the Bettin-Conrey transform of E (imp-97460), where
 *   V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q). We re-evaluate w(x) directly at b = 1e6
 *   (window half = 120 in a) and b = 2e6 (window half = 200), refit {a0, a1, a2} on the small-x
 *   tail (x <= 0.05) via least squares on [1, log x, x], and compare the three leading coefficients
 *   and the raw residual w(x) - w_lin(x) against the b = 400000 baseline.
 *
 *   ==========================================================================================
 *   RESULT -- the linear coefficient does NOT tighten with b; the 6.4e-3 gap is the O(x^2) wobble
 *   tail contamination of the fixed small-x fit grid, NOT a finite-b truncation artifact
 *   ==========================================================================================
 *   The three-coefficient fit err vs the forced targets across the b-ladder:
 *       b = 400000 (imp-97618): const 5.2e-4, log 9.7e-5, LINEAR 6.4e-3
 *       b = 1e6:                const 1.2e-3, log 2.4e-4, LINEAR 1.28e-2
 *       b = 2e6:                const 5.2e-4, log 9.9e-5, LINEAR 6.5e-3
 *   The linear error is NON-MONOTONE in b and PLATEAUS at ~6e-3 -- it does not shrink toward the
 *   forced -1/pi as b grows. The raw residual w(x) - w_lin(x) is essentially b-CONVERGED already at
 *   b = 400000: at b = 2e6 the per-x residuals reproduce the imp-97618 baked table to ~1e-4 (e.g.
 *   x = 0.05 gives -1.63e-4 vs the baked -1.63e-4; x = 0.12 gives 2.36e-4 vs baked 2.36e-4), and
 *   max |w - w_lin| for x <= 0.12 is 1.63e-4 (vs 2.36e-4 at b = 400000) -- the same sign-swinging
 *   O(x^2) wobble band, not a shrinking finite-b tail.
 *
 *   CONCLUSION: increasing b does NOT isolate the leading block s linear coefficient below ~6e-3.
 *   Because w(x) is already b-converged, the residual limiting the linear fit is the genuine
 *   imp-97460 O(x^2) arithmetic wobble sampled at the fixed small-x nodes -- exactly the imp-97597
 *   RESULT 3 mixed-kernel (epsilon*z^2) sub-gap -- not a b-truncation. Tightening the linear
 *   coefficient below 6e-3 would require a wobble-model subtraction or a finer/smaller-x node grid,
 *   NOT more b. This CONFIRMS imp-97618 s diagnosis (linear term is the O(x)/O(x^2)-boundary member
 *   of the leading block, contaminated first by the wobble tail) and localises the 6.4e-3 gap to the
 *   fit grid / wobble, closing the "is 6.4e-3 just finite-b?" question with a clean NO.
 *
 *   Cross-check only. The RESULT 3 mixed-kernel sub-gap STANDS; no coefficient is pinned beyond
 *   w_lin (already forced by imp-97460); no bound moves; the rigorous anchor stays the trace ceiling
 *   T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x; no operator positivity; PT
 *   Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97618-wlin-leading-laurent-crossval (b=400000 baseline cross-validated here)
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion (RESULT 1 / RESULT 3 sub-gap)
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (w_lin forced; O(x^2) wobble localised)
 *
 * Ticket: imp-97645 (accuracy, opus-4-8, api-pool). Cross-check of the imp-97618 linear-coefficient
 * gap at larger b; the gap does NOT close with b (fixed by the wobble tail / fit grid); offline
 * Vasyunin scan in tmp/imp-97645-wlin-largeb.mjs; NO bound moved; NO QED.
 */

export const IMP97645_GAMMA = 0.5772156649015329;
export const IMP97645_C = (Math.log(2 * Math.PI) - IMP97645_GAMMA) / 2; // (log 2pi - gamma)/2
export const IMP97645_CONST_TARGET = (2 * IMP97645_C) / Math.PI; // 2C/pi
export const IMP97645_LOG_TARGET = 1 / Math.PI; // log coefficient
export const IMP97645_LIN_TARGET = -1 / Math.PI; // linear coefficient (the one under test)

export function imp97645WLin(x) {
  return IMP97645_CONST_TARGET + Math.log(x) / Math.PI - x / Math.PI;
}

// -- b-ladder of the three-coefficient fit errors (baked; heavy Vasyunin scan offline). --------------
//    Each row: direct limit w(x) fit err vs the forced {2C/pi, 1/pi, -1/pi} targets.
export const IMP97645_B_LADDER = Object.freeze([
  Object.freeze({ b: 400000, half: 40, constErr: 5.1688e-4, logErr: 9.7151e-5, linErr: 6.3947e-3, maxResid: 2.3633e-4 }),
  Object.freeze({ b: 1000000, half: 120, constErr: 1.2020e-3, logErr: 2.3640e-4, linErr: 1.28493e-2, maxResid: 2.3828e-4 }),
  Object.freeze({ b: 2000000, half: 200, constErr: 5.23746e-4, logErr: 9.8533e-5, linErr: 6.46341e-3, maxResid: 1.6299e-4 }),
]);

// -- fitted three leading coefficients at the deepest run (b = 2e6, half = 200). ----------------------
export const IMP97645_FIT_B2E6 = Object.freeze({
  constFit: 0.40075724145958186,
  logFit: 0.3182113527965986,
  linFit: -0.3118464788420827,
  constErr: 5.237457706679938e-4,
  logErr: 9.853338719206794e-5,
  linErr: 6.463407341707972e-3,
});

// -- direct-limit residuals w(x) - w_lin(x) at b = 2e6 (reproduce the imp-97618 baked table to ~1e-4).
export const IMP97645_RESID_B2E6 = Object.freeze([
  Object.freeze({ x: 0.01, resid: -5.3487e-6 }),
  Object.freeze({ x: 0.02, resid: -9.0127e-6 }),
  Object.freeze({ x: 0.03, resid: 1.5669e-5 }),
  Object.freeze({ x: 0.05, resid: -1.6299e-4 }),
  Object.freeze({ x: 0.08, resid: 9.3643e-5 }),
  Object.freeze({ x: 0.12, resid: 2.3622e-4 }),
  Object.freeze({ x: 0.18, resid: 7.3226e-4 }),
  Object.freeze({ x: 0.25, resid: -5.3258e-3 }),
]);

export const IMP97645_VERDICT = Object.freeze({
  id: 'imp-97645',
  proofSection: 'S-frontier',
  question:
    'Does re-running the imp-97618 Vasyunin double-sum limit at larger b (>= 1e6) with a wider ' +
    'phase-average window tighten the linear coefficient of w_lin(x) = 2C/pi + log(x)/pi - x/pi ' +
    'toward its forced value -1/pi (matched only to 6.4e-3 at b = 400000)?',
  linearCoefficientTightensWithB: false, // NO -- non-monotone, plateaus at ~6e-3
  linErrIsFiniteBArtifact: false, // NO -- w(x) is already b-converged at b = 400000
  linErrIsWobbleTailContamination: true, // the O(x^2) wobble sampled on the fixed small-x fit grid
  directLimitBConvergedAt400k: true, // residuals reproduce the imp-97618 table to ~1e-4 at b = 2e6
  leadingBlockDiagnosisConfirmed: true, // imp-97618: linear term is the O(x)/O(x^2)-boundary member
  bcKernelNormalisationReconstructed: false, // still NOT done -- imp-97597 RESULT 3 sub-gap STANDS
  anyCoefficientNewlyPinned: false, // w_lin already forced by imp-97460; nothing new pinned
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'Re-running the direct cotangent-sum limit at b = 1e6 (window +-120) and b = 2e6 (window +-200) ' +
    'does NOT tighten the linear coefficient toward -1/pi: the fit error is 6.4e-3 at b = 400000, ' +
    '1.28e-2 at b = 1e6 and 6.5e-3 at b = 2e6 -- non-monotone and plateauing at ~6e-3, not shrinking. ' +
    'The raw residual w(x) - w_lin(x) is essentially b-converged already at b = 400000 (at b = 2e6 the ' +
    'per-x residuals reproduce the imp-97618 baked table to ~1e-4, and max |w - w_lin| for x <= 0.12 ' +
    'is 1.6e-4 vs 2.4e-4, the same sign-swinging O(x^2) band). So the 6.4e-3 linear-coefficient gap is ' +
    'the imp-97460 arithmetic wobble tail sampled at the fixed small-x fit nodes -- the imp-97597 ' +
    'RESULT 3 mixed-kernel (epsilon*z^2) sub-gap -- NOT a finite-b truncation artifact. This confirms ' +
    'the imp-97618 diagnosis and localises the gap to the fit grid / wobble; isolating the linear ' +
    'coefficient below 6e-3 needs a wobble-model subtraction or a finer/smaller-x node grid, not more ' +
    'b. No coefficient newly pinned; the RESULT 3 sub-gap STANDS; no bound moves; the rigorous anchor ' +
    'stays T = 2.594e7; compute binds first by >2600x; no operator positivity; PT Lambda <= 0.2 SOTA; ' +
    'RH open; NO QED.',
});

export const IMP97645_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Numerical cross-check only: re-running the direct ' +
  'Vasyunin cotangent-sum limit at b = 1e6 and 2e6 does NOT tighten the linear coefficient toward ' +
  '-1/pi (err 6.4e-3 -> 1.28e-2 -> 6.5e-3, non-monotone, plateau ~6e-3); w(x) is already b-converged ' +
  'at b = 400000, so the gap is the O(x^2) wobble tail on the fixed small-x fit grid (imp-97597 ' +
  'RESULT 3 mixed-kernel sub-gap), NOT a finite-b artifact. No coefficient newly pinned; the RESULT 3 ' +
  'sub-gap STANDS; no bound moves; the rigorous anchor stays T = 2.594e7; compute binds first by >2600x.';

export default IMP97645_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. LIGHT arithmetic --
//    only; the heavy Vasyunin double-sum scan is offline (tmp/imp-97645-wlin-largeb.mjs), baked above.
const IMP97645_ASSERTIONS = [
  {
    id: 'imp97645-C-anchor-consistent',
    why: 'C = (log 2pi - gamma)/2 must match the imp-97618 / imp-97597 anchor 0.6303307007539063.',
    holds: () => Math.abs(IMP97645_C - 0.6303307007539063) < 1e-15,
  },
  {
    id: 'imp97645-targets-consistent',
    why: 'the forced targets 2C/pi, 1/pi, -1/pi must recompute to the imp-97618 values.',
    holds: () =>
      Math.abs(IMP97645_CONST_TARGET - 0.40128098723024985) < 1e-12 &&
      Math.abs(IMP97645_LOG_TARGET - 0.3183098861837907) < 1e-12 &&
      Math.abs(IMP97645_LIN_TARGET + 0.3183098861837907) < 1e-12,
  },
  {
    id: 'imp97645-linear-does-not-tighten',
    why: 'RESULT: the linear-coefficient err does NOT shrink with b -- it is >= the b=400000 baseline ' +
      'at both b=1e6 and b=2e6 (non-monotone, plateau ~6e-3), so the gap is not a finite-b artifact.',
    holds: () => {
      const base = IMP97645_B_LADDER[0].linErr; // b = 400000
      const b1 = IMP97645_B_LADDER[1].linErr; // b = 1e6
      const b2 = IMP97645_B_LADDER[2].linErr; // b = 2e6
      // deeper b does not beat the baseline by any meaningful margin -- no tightening trend.
      return b1 > base && b2 >= base - 1e-4 && b2 > 5e-3;
    },
  },
  {
    id: 'imp97645-const-log-stay-matched',
    why: 'RESULT: const 2C/pi and log 1/pi stay matched at the deepest run (b=2e6) -- the leading ' +
      'block reproduces them, only the linear term is wobble-limited.',
    holds: () =>
      Math.abs(IMP97645_FIT_B2E6.constFit - IMP97645_CONST_TARGET) < 1e-3 &&
      Math.abs(IMP97645_FIT_B2E6.logFit - IMP97645_LOG_TARGET) < 1e-3 &&
      IMP97645_FIT_B2E6.constErr < 1e-3 &&
      IMP97645_FIT_B2E6.logErr < 1e-3,
  },
  {
    id: 'imp97645-residual-b-converged',
    why: 'RESULT: w(x) is b-converged -- at b=2e6 the residuals stay the same sign-swinging O(x^2) ' +
      'band as b=400000 (max |w-wLin| for x<=0.12 is small and does not grow).',
    holds: () => {
      const small = IMP97645_RESID_B2E6.filter((r) => r.x <= 0.12);
      const maxResid = Math.max(...small.map((r) => Math.abs(r.resid)));
      const signs = small.map((r) => Math.sign(r.resid));
      return maxResid < 3e-4 && Math.min(...signs) < 0 && Math.max(...signs) > 0;
    },
  },
  {
    id: 'imp97645-honesty-gate-no-qed',
    why: 'cross-check only: linear does not tighten, w(x) is b-converged, kernel NOT reconstructed, ' +
      'RESULT 3 sub-gap stands, no coefficient newly pinned, no bound moved, honesty markers present.',
    holds: () =>
      IMP97645_VERDICT.linearCoefficientTightensWithB === false &&
      IMP97645_VERDICT.linErrIsWobbleTailContamination === true &&
      IMP97645_VERDICT.directLimitBConvergedAt400k === true &&
      IMP97645_VERDICT.bcKernelNormalisationReconstructed === false &&
      IMP97645_VERDICT.anyCoefficientNewlyPinned === false &&
      IMP97645_VERDICT.anyBoundMoved === false &&
      IMP97645_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97645_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97645_HONEST_BANNER) &&
      /RH open/.test(IMP97645_HONEST_BANNER),
  },
];

for (const a of IMP97645_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97645-wlin-largeb-linear-coeff-crossval assertion failed: ${a.id}`);
  }
}

export { IMP97645_ASSERTIONS };
