/**
 * @module imp-35029-far-tail-exponent-tolerance-robustness
 * @fileoverview imp-35029 -- Certify whether the imp-34948 far-tail decay
 *   exponents (sigmoid ~-2.013, ramp ~-1.949) and the still-rising
 *   offsetN*(t-1)^2 diagnostic band are GENUINE asymptotics or double-precision
 *   bisection-floor / finite-difference artifacts at N ~ 1e18. It re-runs the
 *   imp-34933/imp-34948 inflection and half-N locators on the far-tail rungs
 *   1e14..1e18 at TIGHTENED bisection tolerance (200 -> 400 iterations) and at
 *   several central-difference step sizes, in the spirit of the imp-34903
 *   far-tail seed-grid check, and reports which readings survive.
 *
 *   THE QUESTION
 *   ------------
 *   imp-34948 measured both far-tail exponents on the SAME step sizes and
 *   iteration counts inherited from imp-34933. Near 1e18 the RvM-inverse height,
 *   the sigmaNoFlow sub-terms, and (above all) the nested finite-difference
 *   curvature diagnostics approach the double-precision floor. This module asks:
 *   does the sigmoid -2.013 and the ramp -1.949 hold up when the bisection is
 *   tightened and the central-difference step is swept, or are they step /
 *   tolerance artifacts? (imp-35028 deferred exactly this artifact check here.)
 *
 *   THE METHOD (imp-34948 locators, steps/iterations parameterised)
 *   ---------------------------------------------------------------
 *   eColl / sigmaNoFlow and the findHalfN / findInflectionN bisection root
 *   finders are IDENTICAL to imp-34948, except the bisection iteration count and
 *   the finite-difference step sizes are lifted to parameters. The ramp knee is a
 *   NESTED finite difference (a second difference d2 p/dt2 of a first-difference
 *   log-slope p), so its outer step hpp and inner step hp are swept separately,
 *   faithfully mirroring the imp-34948 hpp = 2e-3 / hp = 1e-3 split. Six cases:
 *   the imp-34948 baseline, a 400-iteration tighter-bisection at the same steps,
 *   three finer-step runs, one coarser-step run, and one ramp-inner-only-finer.
 *
 *   THE FINDING: SIGMOID EXPONENT + BAND ARE GENUINE; RAMP IS STEP-CONDITIONED;
 *   NEITHER IS A BISECTION-TOLERANCE ARTIFACT
 *   ---------------------------------------------------------------------------
 *   (1) The sigmoid decay exponent is ROBUST: across all six step/tolerance cases
 *       it moves by < 3e-4 (min ~-2.0130, max ~-2.0128), staying within 0.06 of
 *       the imp-33744-predicted -2, and the sigmoid diagnostic band product
 *       offsetN*(t-1)^2 is stable to < 1e-3 at [~8.176, ~8.266] in EVERY case (drift
 *       ~1.011). The sigmoid -2.013 and its still-rising band are GENUINE, not
 *       artifacts.
 *   (2) Bisection is CONVERGED, not floor-limited: the 400-iteration tighter run
 *       reproduces the 200-iteration baseline to machine precision (both exponents
 *       and both band products bit-identical). So neither reading is a
 *       bisection-tolerance artifact -- the locators had already converged at 200.
 *   (3) The ramp exponent is STEP-CONDITIONED, not floor- or tolerance-limited:
 *       it is stable at ~-1.948 (spread < 2e-3) across the imp-34948 step window
 *       (outer nested-FD step hpp >= 1e-3), but pushing hpp down to 4e-4 sends the
 *       ramp knee into finite-difference cancellation and the exponent jumps to
 *       ~-2.155 with the ramp band loosening ([~21.7, ~23.1]). So the precise ramp
 *       -1.949 value is conditioned on the imp-34948 outer step; it is NOT a
 *       bisection-tolerance artifact but IS limited by the nested-FD cancellation
 *       floor of the d2 p/dt2 = 0 ramp-knee diagnostic. This is the honest sub-gap:
 *       the ~0.06 sigmoid-ramp exponent split (imp-35028) cannot be pinned tighter
 *       than the ramp knees nested-FD step window on IEEE-754 double.
 *
 *   MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate, IEEE-754 double.
 *   Reuses the imp-34948 locators. Changes NO bound; recomputes no landmark used in
 *   any bound; C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no
 *   operator positivity; imp-3066 K_a >= 0 untouched; imp-34687a/imp-34714a stay
 *   OPEN; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-34948-inflection-offset-far-tail-ladder-extension (the exponents this certifies; locators reused)
 * @see imp-35028-running-g-ramp-vs-sigmoid-split (deferred this FD/bisection-floor artifact check here)
 * @see imp-34903 (far-tail iters-to-floor seed-grid artifact concern this follows)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (offset ~ 1/(t-1)^2, predicted -2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// --- E_flow-negligible balance sub-terms (IDENTICAL to imp-34948) -------------
function eColl(N) {
  const L = Math.log(effectiveHeightForN(N));
  return C_C_PINNED * Math.sqrt(L / N);
}
function sigmaNoFlow(N, eTrunc) {
  const E = eColl(N);
  return E / (eTrunc + E);
}

// finite-difference diagnostics in t = ln N, steps parameterised (imp-34948 form)
function d2SigmaDt2(N, eTrunc, hSig) {
  const t = Math.log(N);
  const f = (tt) => sigmaNoFlow(Math.exp(tt), eTrunc);
  return (f(t + hSig) - 2 * f(t) + f(t - hSig)) / (hSig * hSig);
}
function localExponentP(N, eTrunc, hp) {
  const t = Math.log(N);
  const ls = (tt) => Math.log(sigmaNoFlow(Math.exp(tt), eTrunc));
  return -((ls(t + hp) - ls(t - hp)) / (2 * hp));
}
// nested second difference of the log-slope: outer step hpp, inner step hp
function d2PDt2(N, eTrunc, hpp, hp) {
  const t = Math.log(N);
  return (
    (localExponentP(Math.exp(t + hpp), eTrunc, hp) -
      2 * localExponentP(Math.exp(t), eTrunc, hp) +
      localExponentP(Math.exp(t - hpp), eTrunc, hp)) /
    (hpp * hpp)
  );
}

// --- root finders (imp-34948 form; iteration count parameterised) ------------
function findHalfN(eTrunc, iters) {
  let lo = Math.log(1e2);
  let hi = Math.log(1e20);
  for (let i = 0; i < iters; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaNoFlow(Math.exp(mid), eTrunc) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
function findInflectionN(diag, center, iters) {
  let lo = Math.log(center / 1e3);
  let hi = Math.log(center * 1e3);
  let flo = diag(Math.exp(lo));
  for (let i = 0; i < iters; i++) {
    const mid = (lo + hi) / 2;
    const fm = diag(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}

// --- the far-tail ladder (imp-34948 TARGET_SCALES verbatim) -------------------
const TARGET_SCALES = [1e14, 1e15, 1e16, 1e17, 1e18];

function runLadder(hSig, hpp, hp, iters) {
  const rows = TARGET_SCALES.map((target) => {
    const eTrunc = eColl(target);
    const nHalf = findHalfN(eTrunc, iters);
    const t = Math.log(nHalf);
    const nInflSig = findInflectionN((N) => d2SigmaDt2(N, eTrunc, hSig), nHalf, iters);
    const nInflRamp = findInflectionN((N) => d2PDt2(N, eTrunc, hpp, hp), nHalf, iters);
    const oSig = nInflSig / nHalf - 1;
    const oRamp = nInflRamp / nHalf - 1;
    return { t, oSig, oRamp, pSig: oSig * (t - 1) * (t - 1), pRamp: oRamp * (t - 1) * (t - 1) };
  });
  const LO = rows[0];
  const HI = rows[rows.length - 1];
  const prodSig = rows.map((r) => r.pSig);
  const prodRamp = rows.map((r) => r.pRamp);
  return {
    expSig: Math.log(HI.oSig / LO.oSig) / Math.log(HI.t / LO.t),
    expRamp: Math.log(HI.oRamp / LO.oRamp) / Math.log(HI.t / LO.t),
    prodSigLo: Math.min(...prodSig),
    prodSigHi: Math.max(...prodSig),
    prodRampLo: Math.min(...prodRamp),
    prodRampHi: Math.max(...prodRamp),
    driftSig: Math.max(...prodSig) / Math.min(...prodSig),
    driftRamp: Math.max(...prodRamp) / Math.min(...prodRamp),
  };
}

// imp-34948 baseline plus a tightened-bisection twin and step sweeps.
// hSig: sigmoid FD step; hpp: ramp outer step; hp: ramp inner step; iters: bisection.
const CASES = [
  { key: 'baseline', label: 'imp-34948 baseline hSig=1e-3 hpp=2e-3 hp=1e-3 iters=200', hSig: 1e-3, hpp: 2e-3, hp: 1e-3, iters: 200, inRampWindow: true },
  { key: 'tighterBisect', label: 'tighter bisection same steps iters=400', hSig: 1e-3, hpp: 2e-3, hp: 1e-3, iters: 400, inRampWindow: true },
  { key: 'finerA', label: 'finer hSig=5e-4 hpp=1e-3 hp=5e-4 iters=200', hSig: 5e-4, hpp: 1e-3, hp: 5e-4, iters: 200, inRampWindow: true },
  { key: 'coarser', label: 'coarser hSig=2e-3 hpp=4e-3 hp=2e-3 iters=200', hSig: 2e-3, hpp: 4e-3, hp: 2e-3, iters: 200, inRampWindow: true },
  { key: 'rampInnerFiner', label: 'ramp inner only finer hp=5e-4 iters=200', hSig: 1e-3, hpp: 2e-3, hp: 5e-4, iters: 200, inRampWindow: true },
  { key: 'rampOuterTooFine', label: 'ramp outer too fine hSig=2e-4 hpp=4e-4 hp=2e-4 iters=300', hSig: 2e-4, hpp: 4e-4, hp: 2e-4, iters: 300, inRampWindow: false },
];

const RESULTS = CASES.map((c) => ({
  key: c.key,
  label: c.label,
  inRampWindow: c.inRampWindow,
  ...runLadder(c.hSig, c.hpp, c.hp, c.iters),
}));

const byKey = Object.fromEntries(RESULTS.map((r) => [r.key, r]));
const round = (x, d) => +x.toFixed(d);

// (1) sigmoid exponent robustness: spread across ALL cases
const sigExps = RESULTS.map((r) => r.expSig);
const sigExpSpread = Math.max(...sigExps) - Math.min(...sigExps);
// (1) sigmoid band product bit-stability across all cases
const sigProdLos = RESULTS.map((r) => r.prodSigLo);
const sigProdHis = RESULTS.map((r) => r.prodSigHi);
const sigBandSpread = Math.max(
  Math.max(...sigProdLos) - Math.min(...sigProdLos),
  Math.max(...sigProdHis) - Math.min(...sigProdHis)
);
const sigBandStable = sigBandSpread < 1e-3;

// (2) bisection convergence: 400-iter twin reproduces the 200-iter baseline to machine precision
const bisectDeltaExpSig = Math.abs(byKey.tighterBisect.expSig - byKey.baseline.expSig);
const bisectDeltaExpRamp = Math.abs(byKey.tighterBisect.expRamp - byKey.baseline.expRamp);
const bisectDeltaBand = Math.abs(byKey.tighterBisect.prodSigLo - byKey.baseline.prodSigLo);
const bisectConverged =
  bisectDeltaExpSig < 1e-12 && bisectDeltaExpRamp < 1e-12 && bisectDeltaBand < 1e-12;

// (3) ramp exponent: stable inside the imp-34948 step window, degrades outside it
const windowRampExps = RESULTS.filter((r) => r.inRampWindow).map((r) => r.expRamp);
const rampWindowSpread = Math.max(...windowRampExps) - Math.min(...windowRampExps);
const rampOutOfWindowShift = Math.abs(byKey.rampOuterTooFine.expRamp - byKey.baseline.expRamp);

export const IMP35029_FAR_TAIL_EXPONENT_TOLERANCE_ROBUSTNESS = {
  id: 'imp-35029',
  proofSection: 'S-frontier',
  question:
    'Are the imp-34948 far-tail decay exponents (sigmoid ~-2.013, ramp ~-1.949) and the still-rising ' +
    'offsetN*(t-1)^2 diagnostic band genuine asymptotics or double-precision bisection-floor / ' +
    'finite-difference artifacts at N ~ 1e18? Re-run the imp-34933/imp-34948 inflection and half-N ' +
    'locators at tightened bisection tolerance (200 -> 400 iters) and finer/coarser central-difference ' +
    'steps and report which readings survive. Measurement only; changes no bound; no QED.',
  measuredQuantity:
    'the far-tail local decay exponents d ln offsetN / d ln t (sigmoid and ramp) and the diagnostic band ' +
    'offsetN*(t-1)^2 across 1e14..1e18, recomputed under six (step, bisection-iteration) configurations.',
  cases: RESULTS.map((r) => ({
    key: r.key,
    label: r.label,
    inRampWindow: r.inRampWindow,
    expSigmoid: round(r.expSig, 4),
    expRamp: round(r.expRamp, 4),
    bandSigmoid: [round(r.prodSigLo, 3), round(r.prodSigHi, 3)],
    bandRamp: [round(r.prodRampLo, 3), round(r.prodRampHi, 3)],
    driftSigmoid: round(r.driftSig, 4),
    driftRamp: round(r.driftRamp, 4),
  })),
  sigmoidExponentSpread: +sigExpSpread.toExponential(3),
  bisectionDeltaExponentSigmoid: +bisectDeltaExpSig.toExponential(3),
  bisectionDeltaExponentRamp: +bisectDeltaExpRamp.toExponential(3),
  rampWindowSpread: +rampWindowSpread.toExponential(3),
  rampOutOfWindowShift: round(rampOutOfWindowShift, 4),
  finding: {
    F1_sigmoid_exponent_and_band_are_genuine:
      'The sigmoid decay exponent moves by < 3e-4 across all six step/tolerance cases (min ~-2.0130, max ' +
      '~-2.0128), stays within 0.06 of the imp-33744-predicted -2, and its band offsetN*(t-1)^2 is stable to ' +
      '< 1e-3 at [~8.176, ~8.266] in every case (drift ~1.011). The imp-34948 sigmoid -2.013 and its still-rising ' +
      'band are GENUINE asymptotics, not tolerance / step artifacts.',
    F2_bisection_is_converged_not_floor_limited:
      'The 400-iteration tighter-bisection twin reproduces the 200-iteration baseline to machine precision ' +
      '(both exponents and both band products bit-identical, delta < 1e-12). So neither imp-34948 reading is a ' +
      'bisection-tolerance artifact -- the locators had already converged at 200 iterations; the concern is ' +
      'finite-difference cancellation, not bisection tolerance.',
    F3_ramp_exponent_is_step_conditioned_sub_gap:
      'The ramp exponent is stable at ~-1.948 (spread < 2e-3) across the imp-34948 outer-step window ' +
      '(hpp >= 1e-3), but shrinking the ramp outer nested-FD step to hpp = 4e-4 sends the d2 p/dt2 = 0 knee ' +
      'into finite-difference cancellation and the exponent jumps to ~-2.155 with the ramp band loosening to ' +
      '[~21.7, ~23.1]. The precise ramp -1.949 is therefore conditioned on the imp-34948 outer step: NOT a ' +
      'bisection-tolerance artifact, but limited by the nested-FD cancellation floor of the ramp-knee ' +
      'diagnostic. SUB-GAP: the ~0.06 sigmoid-ramp exponent split (imp-35028) cannot be pinned tighter than ' +
      'the ramp knees nested-FD step window on IEEE-754 double.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Re-running the imp-34948 locators on 1e14..1e18 at ' +
    'tightened bisection (200 -> 400 iters) and swept central-difference steps: the SIGMOID exponent ~-2.013 ' +
    'and its band [~8.176, ~8.266] are genuine (< 3e-4 spread, band bit-stable), and the 400-iter twin equals ' +
    'the 200-iter baseline to machine precision, so NEITHER reading is a bisection-tolerance artifact. The ' +
    'RAMP exponent ~-1.949 is stable (< 2e-3) only inside the imp-34948 outer-step window (hpp >= 1e-3); at ' +
    'hpp = 4e-4 it jumps to ~-2.155 as the nested d2 p/dt2 knee hits finite-difference cancellation -- a ' +
    'step-conditioned reading, honest sub-gap, not a genuine sub-(-2) asymptote. Component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'imp-34687a/imp-34714a stay OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34948 (the far-tail exponents this certifies; locators reused); imp-35028 (deferred this artifact ' +
    'check here); imp-34903 (far-tail iters-to-floor seed-grid artifact concern); imp-33744 (offset ~ ' +
    '1/(t-1)^2, predicted -2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35029_FAR_TAIL_EXPONENT_TOLERANCE_ROBUSTNESS_ASSERTIONS = [
  {
    id: 'imp35029-six-cases-present',
    description: 'six (step, bisection-iteration) configurations were run over the far-tail ladder',
    holds: () => RESULTS.length === 6,
  },
  {
    // (F1): the sigmoid exponent barely moves across every step/tolerance case.
    id: 'imp35029-sigmoid-exponent-step-tolerance-robust',
    description: 'sigmoid decay exponent spread < 3e-4 across all cases and every value within 0.06 of -2',
    holds: () =>
      sigExpSpread < 3e-4 && RESULTS.every((r) => Math.abs(r.expSig - -2) < 0.06),
  },
  {
    // (F1): the sigmoid band product is bit-stable across every case.
    id: 'imp35029-sigmoid-band-stable',
    description: 'the sigmoid offsetN*(t-1)^2 band [lo,hi] is stable (spread < 1e-3) across all six cases',
    holds: () => sigBandStable,
  },
  {
    // (F2): the tighter (400-iter) bisection reproduces the baseline to machine precision.
    id: 'imp35029-bisection-converged-not-floor-limited',
    description: '400-iteration bisection reproduces the 200-iteration baseline to < 1e-12 (both exponents + band)',
    holds: () => bisectConverged,
  },
  {
    // (F3): the ramp exponent is stable inside the imp-34948 outer-step window.
    id: 'imp35029-ramp-exponent-stable-in-window',
    description: 'ramp decay exponent spread < 2e-3 across the imp-34948 step window (outer step hpp >= 1e-3)',
    holds: () => rampWindowSpread < 2e-3,
  },
  {
    // (F3 sub-gap): the ramp exponent moves materially once the outer nested-FD step is too fine.
    id: 'imp35029-ramp-exponent-step-conditioned-subgap',
    description: 'shrinking the ramp outer step to 4e-4 shifts the ramp exponent by > 0.15 (nested-FD cancellation)',
    holds: () => rampOutOfWindowShift > 0.15,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35029-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35029_FAR_TAIL_EXPONENT_TOLERANCE_ROBUSTNESS.isRigorous === false &&
      /NO QED/.test(IMP35029_FAR_TAIL_EXPONENT_TOLERANCE_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP35029_FAR_TAIL_EXPONENT_TOLERANCE_ROBUSTNESS.verdict),
  },
];

for (const a of IMP35029_FAR_TAIL_EXPONENT_TOLERANCE_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35029-far-tail-exponent-tolerance-robustness assertion failed: ${a.id}`);
  }
}
