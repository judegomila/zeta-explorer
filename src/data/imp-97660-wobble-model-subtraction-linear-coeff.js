/**
 * @module imp-97660-wobble-model-subtraction-linear-coeff
 * @fileoverview imp-97660 -- NUMERICAL MEASUREMENT (no bound moved): build and test a WOBBLE-MODEL
 *   SUBTRACTION (the imp-97460 O(x^2) arithmetic wobble tail) and/or a refined small-x node grid to
 *   isolate the imp-97618/imp-97645 w_lin linear coefficient below the ~6e-3 plateau.
 *
 *   BACKGROUND. w_lin(x) = 2C/pi + log(x)/pi - x/pi with C = (log 2pi - gamma)/2. imp-97645 showed the
 *   linear coefficient (forced to -1/pi by imp-97460) does NOT tighten with larger Vasyunin b: w(x) is
 *   already b-converged at b = 400000, and the 6.4e-3 fit gap is the genuine O(x^2) arithmetic wobble
 *   (imp-97597 RESULT 3 mixed-kernel epsilon*z^2 sub-gap) sampled at the fixed small-x nodes. imp-97645
 *   CONCLUSION says tightening below 6e-3 needs a wobble-model subtraction or a finer/smaller-x grid,
 *   NOT more b. This ticket TESTS both of those two named remedies at b = 400000.
 *
 *   METHOD. Direct cotangent-sum limit w(x) = lim_b (V(x b, b) + V(b, x b)) / b, V(a,q) =
 *   Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q), evaluated at b = 400000, a = round(x b) windowed +-40,
 *   on a finer small-x grid x in {0.005 .. 0.12}. Then:
 *     (baseline) 3-coef leading block {1, log x, x} on x <= 0.05  (reproduces imp-97618 ~6.4e-3).
 *     (A) WOBBLE-MODEL SUBTRACTION: extend the basis with a smooth x^2 term {1, log x, x, x^2}.
 *     (B) refined SMALLER-x grid: 3-coef block on x <= 0.02, plus a full cutoff sweep x_max in
 *         {0.12 .. 0.02}.
 *
 *   ==========================================================================================
 *   RESULT -- NEITHER named remedy gives a CONTROLLED sub-6e-3 isolation. The wobble is genuinely
 *   arithmetic (sign-swinging, non-smooth), so a smooth polynomial cannot subtract it and grid
 *   refinement only re-samples different phases of it.
 *   ==========================================================================================
 *   (A) The smooth-x^2 wobble-model subtraction makes the linear coefficient WORSE, not better:
 *       linear err 6.33e-3 (baseline 3-coef, x<=0.05) -> 1.44e-2 (4-coef, x<=0.05) -> 1.93e-2
 *       (4-coef, x<=0.12). The fitted x^2 coefficient is itself unstable (+0.101 on x<=0.12 vs
 *       -0.271 on x<=0.05). Reason: the residual w - w_lin is a SIGN-SWINGING arithmetic wobble
 *       (resid/x^2 runs -8.71e-1, -1.32e-1, -5.54e-2, ..., +1.74e-2, ..., +1.90e-2, +1.47e-2 across
 *       the grid -- no fixed sign or magnitude), so a smooth x^2 basis term is MISSPECIFIED and, being
 *       near-collinear with x on a narrow small-x window, it bleeds error INTO the linear coefficient.
 *   (B) The smaller-x / finer grid does NOT give a controlled convergence either: the 3-coef linear
 *       err is NON-MONOTONE in the cutoff x_max -- 9.68e-4 (x<=0.12), 3.10e-3 (0.08), 4.34e-5 (0.06),
 *       8.51e-3 (0.05), 6.33e-3 (0.04), 9.02e-5 (0.03), 4.82e-3 (0.025), 4.14e-3 (0.02). It bounces
 *       between ~4e-5 and ~9e-3 depending on exactly which nodes land on a favorable phase of the
 *       wobble; some cutoffs DO drop far below 6e-3 (4.3e-5 at 0.06, 9.0e-5 at 0.03) but that is the
 *       fit accidentally hitting a wobble node, NOT a systematic approach to -1/pi. The one-node
 *       sensitivity is stark: x<=0.05 gives 6.33e-3 with n=9 but 8.51e-3 with n=10 (one extra node).
 *
 *   CONCLUSION: the two operational remedies imp-97645 named -- a wobble-model subtraction (as a smooth
 *   x^2 term) and a finer/smaller-x node grid -- do NOT achieve a controlled isolation of the linear
 *   coefficient below ~6e-3. The smooth subtraction is worse than doing nothing; grid refinement only
 *   samples different phases of the sign-swinging wobble. This SHARPENS the imp-97597 RESULT 3 sub-gap:
 *   the residual is a genuinely arithmetic (non-smooth, sign-swinging) O(x^2) term, so removing it
 *   needs the EXACT arithmetic wobble model (the imp-97597 psi_s integral representation / imp-97563
 *   Bettin-Conrey mean-value route), NOT any smooth-polynomial subtraction or node-grid tweak. The
 *   linear coefficient stays FORCED by imp-97460 but is NOT numerically pinnable below ~6e-3 by these
 *   two routes.
 *
 *   Measurement only. The linear term is already forced by imp-97460; no coefficient is newly pinned;
 *   the RESULT 3 mixed-kernel sub-gap STANDS (now sharpened); no bound moves; the rigorous anchor stays
 *   the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x; no operator
 *   positivity; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-97645-wlin-largeb-linear-coeff-crossval (named the two remedies tested here)
 * @see imp-97618-wlin-leading-laurent-crossval (b=400000 baseline)
 * @see imp-97597-route-m-psi-s-integral-rep-double-expansion (RESULT 3 mixed-kernel sub-gap, sharpened)
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (w_lin forced; O(x^2) wobble localised)
 *
 * Ticket: imp-97660 (numerical, opus-4-8, api-pool). Wobble-model subtraction test; neither remedy
 * gives controlled sub-6e-3 isolation; offline Vasyunin scan tmp/imp-97660-wobble-subtraction.mjs;
 * NO bound moved; NO QED.
 */

export const IMP97660_GAMMA = 0.5772156649015329;
export const IMP97660_C = (Math.log(2 * Math.PI) - IMP97660_GAMMA) / 2; // (log 2pi - gamma)/2
export const IMP97660_CONST_TARGET = (2 * IMP97660_C) / Math.PI; // 2C/pi
export const IMP97660_LOG_TARGET = 1 / Math.PI; // log coefficient
export const IMP97660_LIN_TARGET = -1 / Math.PI; // linear coefficient (the one under test)

export function imp97660WLin(x) {
  return IMP97660_CONST_TARGET + Math.log(x) / Math.PI - x / Math.PI;
}

// -- direct-limit residuals w(x) - w_lin(x) at b = 400000 (half = 40), finer small-x grid. -----------
//    resid/x^2 is SIGN-SWINGING -- the arithmetic wobble is NOT a smooth quadratic.
export const IMP97660_RESID_B400K = Object.freeze([
  Object.freeze({ x: 0.005, resid: -2.1774e-5, ratio: -8.7094e-1 }),
  Object.freeze({ x: 0.008, resid: -8.4369e-6, ratio: -1.3183e-1 }),
  Object.freeze({ x: 0.01, resid: -5.5372e-6, ratio: -5.5372e-2 }),
  Object.freeze({ x: 0.013, resid: -2.6432e-6, ratio: -1.5640e-2 }),
  Object.freeze({ x: 0.017, resid: -3.8117e-6, ratio: -1.3189e-2 }),
  Object.freeze({ x: 0.02, resid: -8.9299e-6, ratio: -2.2325e-2 }),
  Object.freeze({ x: 0.025, resid: -2.1361e-5, ratio: -3.4178e-2 }),
  Object.freeze({ x: 0.03, resid: 1.5626e-5, ratio: 1.7362e-2 }),
  Object.freeze({ x: 0.04, resid: -9.1291e-5, ratio: -5.7057e-2 }),
  Object.freeze({ x: 0.05, resid: -1.6262e-4, ratio: -6.5048e-2 }),
  Object.freeze({ x: 0.06, resid: 6.8304e-5, ratio: 1.8973e-2 }),
  Object.freeze({ x: 0.08, resid: 9.3796e-5, ratio: 1.4656e-2 }),
  Object.freeze({ x: 0.10, resid: -7.9425e-4, ratio: -7.9425e-2 }),
  Object.freeze({ x: 0.12, resid: 2.3633e-4, ratio: 1.6412e-2 }),
]);

// -- (A) smooth-x^2 wobble-model subtraction: linear err gets WORSE, x^2 coefficient unstable. --------
export const IMP97660_WOBBLE_SUBTRACTION = Object.freeze({
  baseline3CoefX05: Object.freeze({ n: 9, linErr: 6.3284e-3 }), // 3-coef {1,logx,x}, reproduces imp-97618
  fourCoefX05: Object.freeze({ n: 9, linErr: 1.4388e-2, quadCoef: -0.2713993389077942 }),
  fourCoefX12: Object.freeze({ n: 14, linErr: 1.9334e-2, quadCoef: 0.10095514168093557 }),
});

// -- (B) finer/smaller-x grid cutoff sweep: 3-coef linear err is NON-MONOTONE in x_max. --------------
export const IMP97660_CUTOFF_SWEEP = Object.freeze([
  Object.freeze({ xMax: 0.12, n: 14, linErr: 9.6840e-4 }),
  Object.freeze({ xMax: 0.08, n: 12, linErr: 3.0993e-3 }),
  Object.freeze({ xMax: 0.06, n: 11, linErr: 4.3410e-5 }),
  Object.freeze({ xMax: 0.05, n: 10, linErr: 8.5077e-3 }),
  Object.freeze({ xMax: 0.04, n: 9, linErr: 6.3284e-3 }),
  Object.freeze({ xMax: 0.03, n: 8, linErr: 9.0233e-5 }),
  Object.freeze({ xMax: 0.025, n: 7, linErr: 4.8174e-3 }),
  Object.freeze({ xMax: 0.02, n: 6, linErr: 4.1447e-3 }),
]);

export const IMP97660_VERDICT = Object.freeze({
  id: 'imp-97660',
  proofSection: 'S-frontier',
  question:
    'Does a wobble-model subtraction (the imp-97460 O(x^2) arithmetic wobble tail, tested as a smooth ' +
    'x^2 basis term) and/or a finer/smaller-x node grid isolate the w_lin linear coefficient below the ' +
    '~6e-3 plateau, letting the fit converge to the forced -1/pi?',
  smoothQuadSubtractionHelps: false, // NO -- linear err gets WORSE (6.3e-3 -> 1.4e-2/1.9e-2)
  smoothQuadCoefStable: false, // x^2 coef flips sign across windows (+0.101 vs -0.271)
  wobbleIsSignSwinging: true, // resid/x^2 has no fixed sign/magnitude -> not a smooth quadratic
  gridRefinementGivesControlledConvergence: false, // NO -- linear err non-monotone in x_max
  gridErrNonMonotone: true, // 9.7e-4, 3.1e-3, 4.3e-5, 8.5e-3, 6.3e-3, 9.0e-5, 4.8e-3, 4.1e-3
  linearCoefControlledBelow6e3: false, // NO controlled route; some cutoffs dip low by luck of phase
  result3SubGapSharpened: true, // residual confirmed genuinely arithmetic (non-smooth)
  anyCoefficientNewlyPinned: false, // w_lin already forced by imp-97460; nothing new pinned
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'Testing the two remedies imp-97645 named, at the b-converged b = 400000: (A) a smooth-x^2 ' +
    'wobble-model subtraction makes the linear coefficient WORSE -- err 6.33e-3 (baseline 3-coef) -> ' +
    '1.44e-2 (4-coef x<=0.05) -> 1.93e-2 (4-coef x<=0.12), with an unstable x^2 coefficient ' +
    '(+0.101 vs -0.271) -- because the residual w - w_lin is a sign-swinging arithmetic wobble ' +
    '(resid/x^2 runs -0.87 .. +0.02, no fixed sign) that a smooth quadratic cannot model and, being ' +
    'near-collinear with x on a narrow window, bleeds error into the linear term. (B) A finer/smaller-x ' +
    'grid does NOT converge either: the 3-coef linear err is non-monotone in the cutoff (9.7e-4, ' +
    '3.1e-3, 4.3e-5, 8.5e-3, 6.3e-3, 9.0e-5, 4.8e-3, 4.1e-3), bouncing between ~4e-5 and ~9e-3 by ' +
    'which nodes hit a favorable wobble phase, with stark one-node sensitivity (x<=0.05: 6.3e-3 at ' +
    'n=9 vs 8.5e-3 at n=10). Neither remedy gives a controlled sub-6e-3 isolation. This SHARPENS the ' +
    'imp-97597 RESULT 3 sub-gap: the residual is genuinely arithmetic (non-smooth, sign-swinging), so ' +
    'removing it needs the EXACT wobble model (imp-97597 psi_s integral rep / imp-97563 Bettin-Conrey ' +
    'mean value), not a smooth-polynomial subtraction or node-grid tweak. The linear coefficient stays ' +
    'forced by imp-97460 but is NOT numerically pinnable below ~6e-3 by these routes. No coefficient ' +
    'newly pinned; RESULT 3 sub-gap STANDS (sharpened); no bound moves; the rigorous anchor stays ' +
    'T = 2.594e7; compute binds first by >2600x; no operator positivity; PT Lambda <= 0.2 SOTA; ' +
    'RH open; NO QED.',
});

export const IMP97660_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Numerical measurement only: neither remedy imp-97645 ' +
  'named isolates the w_lin linear coefficient below ~6e-3. A smooth-x^2 wobble-model subtraction makes ' +
  'it WORSE (6.3e-3 -> 1.4e-2/1.9e-2, unstable x^2 coef) because the wobble is sign-swinging and ' +
  'not a smooth quadratic; a finer/smaller-x grid gives a NON-MONOTONE linear err (4e-5 .. 9e-3 by ' +
  'wobble phase), not controlled convergence. The residual is genuinely arithmetic -> needs the EXACT ' +
  'wobble model (imp-97597 psi_s / imp-97563), not a smooth subtraction. No coefficient newly pinned; ' +
  'RESULT 3 sub-gap STANDS (sharpened); no bound moves; the rigorous anchor stays T = 2.594e7; ' +
  'compute binds first by >2600x.';

export default IMP97660_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. LIGHT arithmetic --
//    only; the heavy Vasyunin double-sum scan is offline (tmp/imp-97660-wobble-subtraction.mjs), baked.
const IMP97660_ASSERTIONS = [
  {
    id: 'imp97660-C-anchor-consistent',
    why: 'C = (log 2pi - gamma)/2 must match the imp-97618 / imp-97645 anchor 0.6303307007539063.',
    holds: () => Math.abs(IMP97660_C - 0.6303307007539063) < 1e-15,
  },
  {
    id: 'imp97660-targets-consistent',
    why: 'the forced targets 2C/pi, 1/pi, -1/pi must recompute to the imp-97618 values.',
    holds: () =>
      Math.abs(IMP97660_CONST_TARGET - 0.40128098723024985) < 1e-12 &&
      Math.abs(IMP97660_LOG_TARGET - 0.3183098861837907) < 1e-12 &&
      Math.abs(IMP97660_LIN_TARGET + 0.3183098861837907) < 1e-12,
  },
  {
    id: 'imp97660-smooth-quad-subtraction-worse',
    why: 'RESULT (A): the smooth-x^2 wobble-model subtraction makes the linear err WORSE, not better -- ' +
      'both 4-coef fits exceed the 6.33e-3 baseline.',
    holds: () =>
      IMP97660_WOBBLE_SUBTRACTION.fourCoefX05.linErr > IMP97660_WOBBLE_SUBTRACTION.baseline3CoefX05.linErr &&
      IMP97660_WOBBLE_SUBTRACTION.fourCoefX12.linErr > IMP97660_WOBBLE_SUBTRACTION.baseline3CoefX05.linErr,
  },
  {
    id: 'imp97660-quad-coef-unstable',
    why: 'RESULT (A): the fitted x^2 coefficient flips sign across the two windows (+0.101 vs -0.271), ' +
      'so the wobble is not a stable smooth quadratic.',
    holds: () =>
      Math.sign(IMP97660_WOBBLE_SUBTRACTION.fourCoefX05.quadCoef) !==
      Math.sign(IMP97660_WOBBLE_SUBTRACTION.fourCoefX12.quadCoef),
  },
  {
    id: 'imp97660-wobble-sign-swinging',
    why: 'RESULT: resid/x^2 (the wobble amplitude) is genuinely sign-swinging across the grid -- both ' +
      'signs present -- so it is arithmetic, not a smooth quadratic tail.',
    holds: () => {
      const ratios = IMP97660_RESID_B400K.map((r) => r.ratio);
      return Math.min(...ratios) < 0 && Math.max(...ratios) > 0;
    },
  },
  {
    id: 'imp97660-grid-err-non-monotone',
    why: 'RESULT (B): the cutoff-sweep linear err is NON-MONOTONE in x_max -- it both rises and falls ' +
      'as the cutoff shrinks, so grid refinement is not a controlled convergence.',
    holds: () => {
      const e = IMP97660_CUTOFF_SWEEP.map((r) => r.linErr);
      let up = false, down = false;
      for (let i = 1; i < e.length; i++) {
        if (e[i] > e[i - 1]) up = true;
        if (e[i] < e[i - 1]) down = true;
      }
      return up && down; // both directions present -> non-monotone
    },
  },
  {
    id: 'imp97660-honesty-gate-no-qed',
    why: 'measurement only: neither remedy gives controlled isolation, residual is arithmetic, RESULT 3 ' +
      'sub-gap stands, no coefficient newly pinned, no bound moved, honesty markers present.',
    holds: () =>
      IMP97660_VERDICT.smoothQuadSubtractionHelps === false &&
      IMP97660_VERDICT.gridRefinementGivesControlledConvergence === false &&
      IMP97660_VERDICT.wobbleIsSignSwinging === true &&
      IMP97660_VERDICT.linearCoefControlledBelow6e3 === false &&
      IMP97660_VERDICT.anyCoefficientNewlyPinned === false &&
      IMP97660_VERDICT.anyBoundMoved === false &&
      IMP97660_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97660_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97660_HONEST_BANNER) &&
      /RH open/.test(IMP97660_HONEST_BANNER),
  },
];

for (const a of IMP97660_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97660-wobble-model-subtraction-linear-coeff assertion failed: ${a.id}`);
  }
}

export { IMP97660_ASSERTIONS };
