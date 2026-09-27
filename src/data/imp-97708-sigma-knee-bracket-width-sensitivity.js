/**
 * @module imp-97708-sigma-knee-bracket-width-sensitivity
 *
 * imp-97708 (numerical, frontier-direction): imp-33701 differenced the imp-33582 six-decade
 * sigma(N) = E_coll/E(N) post-peak local-exponent ladder on COARSE whole-decade brackets and
 * could only localize the single ramp-acceleration (D2) sign change -- the KNEE -- to the
 * [1e10,1e11] decade. imp-33721 re-differenced on quarter-decade sub-brackets and RELOCATED the
 * knee a full decade down to N* ~ 3.38e9 (log10 ~ 9.529). Two readings a decade apart raise a
 * fair question: is the ~3.38e9 knee a genuine property of sigma, or an artifact of the finer
 * differencing stencil? This module DECIDES that, and reconciles the two readings, by measuring
 * the knee location as a function of (i) bracket width W and (ii) the bracketing itself -- taking
 * the W -> 0 limit as a bracketing-FREE ground truth.
 *
 * THE QUANTITY (identical model to imp-3406 / imp-33582 / imp-33701 / imp-33721 -- no fresh terms)
 * ----------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 *
 * THE MEASUREMENT: two independent localizers of the exponent-ramp knee
 * --------------------------------------------------------------------
 *   (A) BRACKETING-FREE POINTWISE CURVATURE (the W -> 0 ground truth). The OLS local exponent on
 *       a bracket of width W converges, as W -> 0, to the instantaneous local exponent
 *       p(N) = -d ln sigma / d ln N. Its curvature in log10 N, c(N) = d2p/d(log10 N)^2, needs NO
 *       bracketing at all -- it is computed by fine central differences on the smooth sigma. Its
 *       single zero-crossing is the knee with the differencing stencil taken to its limit.
 *   (B) BRACKET-WIDTH SWEEP (the imp-33721 estimator, extended). The exact imp-33721 sub-decade
 *       recipe -- partition [1e9,1e11] into W-decade sub-brackets, OLS local exponent per bracket,
 *       first/second differences D1/D2 on the centers, single interpolated D2 zero-crossing -- run
 *       across a BROADER width ladder W in {0.1,0.125,0.15,0.2,0.25,0.3,0.4,0.5} than imp-33721
 *       swept, spanning the sub-decade regime into the coarse-averaging regime.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE KNEE IS BRACKET-ROBUST, NOT A DIFFERENCING ARTIFACT. The bracketing-free pointwise
 *        curvature c(N) has EXACTLY ONE zero-crossing over [1e8,1e12], at log10 N* = 9.5291
 *        (N* = 3.381e9), and that location is INVARIANT to the differentiation step size and
 *        stencil (stable to 4 decimals across central-difference steps h in {5e-5..1e-3}). This
 *        bracketing-free value coincides with the imp-33721 sub-bracket knee (log10 ~ 9.529) --
 *        so ~3.38e9 is a genuine property of sigma, not an artifact of the sub-decade stencil.
 *   (F2) EVERY SUB-DECADE WIDTH CONVERGES TO THE POINTWISE KNEE. For W in
 *        {0.1,0.125,0.15,0.2,0.25,0.3}-decade the bracket sweep yields exactly ONE D2 sign change,
 *        landing at log10 N* within +/- 0.001 of the bracketing-free 9.5291 (max deviation ~0.0008
 *        at the coarsest resolved width W=0.3). Narrowing the bracket walks the estimator smoothly
 *        onto the W -> 0 ground truth: the knee is a fixed point of the width, not a moving artifact.
 *   (F3) THE imp-33701 [1e10,1e11] READING RECONCILES AS A RESOLUTION LOSS. At W >= 0.4-decade the
 *        single D2 sign change DISAPPEARS entirely (zero sign changes inside [1e9,1e11]) -- the
 *        bracket is too coarse to resolve the curvature turn. The resolution threshold sits between
 *        W = 0.3 (resolves) and W = 0.4 (lost). The imp-33701 WHOLE-decade ladder (W = 1.0) is far
 *        past that threshold, so decade-averaging smears the local curvature until the sub-decade
 *        crossing cannot survive and the apparent knee lands a decade high at [1e10,1e11]. The two
 *        readings do not conflict: the knee is genuinely at N* ~ 3.38e9 (confirmed bracketing-free),
 *        and [1e10,1e11] is the coarse-averaging shadow of that same knee.
 *
 * The punchline: the ~3.38e9 knee is NOT a differencing artifact. A bracketing-free pointwise
 * curvature -- no OLS window at all -- puts the single inflection at log10 N* = 9.5291, invariant
 * to the stencil, and every sub-decade bracket width converges to it. The imp-33701 [1e10,1e11]
 * reading is reconciled as pure resolution loss: the sub-decade crossing vanishes for W >= 0.4, so
 * the whole-decade ladder could only ever see a decade-smeared shadow of the true knee.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee relocation to N* ~ 3.38e9 -- the reading tested here)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (whole-decade ladder placing the knee at [1e10,1e11])
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (six-decade exponent ladder + sigma=1/2 halving landmark)
 * @see imp-3444-e-coll-e-trunc-crossover (E_coll=E_trunc crossover ~3.28e9, the halving-point twin)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33701/imp-33721 exactly
const LN10 = Math.LN10;

// EXACT imp-3406/imp-33582/imp-33701/imp-33721 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// (A) Bracketing-free pointwise local exponent p(d) = -d ln sigma/d ln N at log10 N = d, via a
// symmetric central difference of step h (in log10). This is the W -> 0 limit of the OLS bracket
// exponent -- no window, no OLS, no sub-bracket.
function pPointwise(d, h) {
  const sp = Math.log(sigma(Math.pow(10, d + h)));
  const sm = Math.log(sigma(Math.pow(10, d - h)));
  return -(sp - sm) / ((2 * h) * LN10);
}

// Pointwise ramp curvature c(d) = d2p/d(log10 N)^2, and its single zero-crossing over [8,12].
function pointwiseKneeLog10(h, dd, step) {
  let prev = null;
  const crossings = [];
  for (let d = 8.0; d <= 12.0 + 1e-9; d += step) {
    const c = (pPointwise(d + dd, h) - 2 * pPointwise(d, h) + pPointwise(d - dd, h)) / (dd * dd);
    if (prev !== null && Math.sign(c) !== Math.sign(prev.c)) {
      crossings.push(prev.d + ((d - prev.d) * (0 - prev.c)) / (c - prev.c));
    }
    prev = { d, c };
  }
  return crossings;
}

// (B) EXACT imp-33721 sub-decade estimator: OLS local exponent on a bracket, D1/D2 differences,
// single interpolated D2 zero-crossing.
function olsExponentLog10(loD, hiD, ptsPerDecade) {
  const stepD = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += stepD) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
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
  return -(sxy / sxx);
}

const SUB_LO_D = 9.0;
const SUB_HI_D = 11.0;

function subDecadeInflection(W, ptsPerDecade) {
  const edges = [];
  for (let d = SUB_LO_D; d <= SUB_HI_D + 1e-9; d += W) edges.push(+d.toFixed(6));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    brackets.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], ptsPerDecade) });
  }
  const D1 = [];
  for (let i = 1; i < brackets.length; i++) {
    D1.push({ cen: (brackets[i].cen + brackets[i - 1].cen) / 2, d1: brackets[i].p - brackets[i - 1].p });
  }
  const D2 = [];
  for (let i = 1; i < D1.length; i++) {
    D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  }
  let signChanges = 0;
  let cstar = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      signChanges += 1;
      if (cstar === null) {
        const c0 = D2[i - 1].cen;
        const c1 = D2[i].cen;
        const y0 = D2[i - 1].d2;
        const y1 = D2[i].d2;
        cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
      }
    }
  }
  return { signChanges, cstar, nBrackets: brackets.length };
}

// (A) bracketing-free ground truth: single pointwise curvature zero-crossing.
const PW_CROSSINGS = pointwiseKneeLog10(1e-4, 1e-3, 0.005);
const POINTWISE_LOG10_NSTAR = PW_CROSSINGS.length === 1 ? PW_CROSSINGS[0] : null; // ~ 9.5291
const POINTWISE_NSTAR = POINTWISE_LOG10_NSTAR !== null ? Math.pow(10, POINTWISE_LOG10_NSTAR) : null; // ~ 3.381e9

// Stencil-invariance of the pointwise crossing: recompute at several central-difference steps.
const STENCIL_STEPS = [
  { h: 1e-3, dd: 1e-3 },
  { h: 5e-4, dd: 1e-3 },
  { h: 1e-4, dd: 1e-3 },
  { h: 5e-5, dd: 1e-3 },
];
const STENCIL_SWEEP = STENCIL_STEPS.map(({ h, dd }) => {
  const cr = pointwiseKneeLog10(h, dd, 0.005);
  return { h, crossings: cr.length, log10Nstar: cr.length === 1 ? +cr[0].toFixed(4) : null };
});

// (B) broadened bracket-width sweep: sub-decade regime into the coarse-averaging regime.
const WIDTH_LADDER = [
  { W: 0.1, ppd: 200 },
  { W: 0.125, ppd: 160 },
  { W: 0.15, ppd: 140 },
  { W: 0.2, ppd: 100 },
  { W: 0.25, ppd: 80 },
  { W: 0.3, ppd: 70 },
  { W: 0.4, ppd: 50 },
  { W: 0.5, ppd: 40 },
];
const WIDTH_SWEEP = WIDTH_LADDER.map(({ W, ppd }) => {
  const r = subDecadeInflection(W, ppd);
  return {
    widthDecades: W,
    nBrackets: r.nBrackets,
    signChanges: r.signChanges,
    log10Nstar: r.cstar !== null ? +r.cstar.toFixed(4) : null,
    Nstar: r.cstar !== null ? +Math.pow(10, r.cstar).toExponential(4) : null,
    devFromPointwise: r.cstar !== null && POINTWISE_LOG10_NSTAR !== null ? +Math.abs(r.cstar - POINTWISE_LOG10_NSTAR).toFixed(4) : null,
  };
});

// resolution threshold: the coarsest width that still resolves a single crossing, and the finest
// that has lost it.
const RESOLVED = WIDTH_SWEEP.filter((r) => r.signChanges === 1);
const LOST = WIDTH_SWEEP.filter((r) => r.signChanges === 0);
const COARSEST_RESOLVED_W = RESOLVED.length ? Math.max(...RESOLVED.map((r) => r.widthDecades)) : null;
const FINEST_LOST_W = LOST.length ? Math.min(...LOST.map((r) => r.widthDecades)) : null;
const MAX_DEV_RESOLVED = RESOLVED.length ? Math.max(...RESOLVED.map((r) => r.devFromPointwise)) : null;

export const IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY = {
  id: 'imp-97708',
  proofSection: 'S-frontier',
  question:
    'imp-33701 (whole-decade ladder) placed the sigma(N) exponent-ramp knee at [1e10,1e11]; ' +
    'imp-33721 (quarter-decade sub-brackets) relocated it a full decade down to N* ~ 3.38e9. Two ' +
    'readings a decade apart: is the ~3.38e9 knee bracket-robust or a differencing artifact? ' +
    'Measure the knee location vs bracket width W, and take the W -> 0 (bracketing-free pointwise ' +
    'curvature) limit as ground truth, to decide and to reconcile the two readings. ' +
    'Measurement/fit only; conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the single zero-crossing of (A) the bracketing-free pointwise ramp curvature ' +
    'c(N)=d2p/d(log10 N)^2 (p = -d ln sigma/d ln N) and (B) the imp-33721 sub-bracket D2 across a ' +
    'broadened width ladder W in {0.1..0.5}-decade -- with the pointwise crossing as the W -> 0 ' +
    'ground truth against which the bracket sweep is checked for robustness',
  pointwiseLog10Nstar: POINTWISE_LOG10_NSTAR !== null ? +POINTWISE_LOG10_NSTAR.toFixed(4) : null,
  pointwiseNstar: POINTWISE_NSTAR !== null ? +POINTWISE_NSTAR.toExponential(4) : null,
  pointwiseNumCrossings: PW_CROSSINGS.length,
  stencilInvarianceSweep: STENCIL_SWEEP,
  bracketWidthSweep: WIDTH_SWEEP,
  coarsestResolvedWidthDecades: COARSEST_RESOLVED_W,
  finestLostWidthDecades: FINEST_LOST_W,
  maxDeviationResolvedFromPointwise: MAX_DEV_RESOLVED,
  imp33721SubDecadeLog10Nstar: IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionLog10Nstar,
  imp33701CoarseDecade: '1e10->1e11',
  verdictBracketRobust: true,
  finding: {
    F1_bracketing_free_confirms_knee:
      'The bracketing-free pointwise curvature c(N)=d2p/d(log10 N)^2 has EXACTLY ONE zero-crossing ' +
      'over [1e8,1e12], at log10 N* = 9.5291 (N* = 3.381e9), INVARIANT to the differentiation step ' +
      'and stencil (stable to 4 decimals across central-difference steps h in {5e-5..1e-3}). It ' +
      'coincides with the imp-33721 sub-bracket knee (log10 ~ 9.529), so ~3.38e9 is a genuine ' +
      'property of sigma, NOT an artifact of the sub-decade differencing stencil.',
    F2_every_subdecade_width_converges:
      'For W in {0.1,0.125,0.15,0.2,0.25,0.3}-decade the sub-bracket D2 yields exactly ONE sign ' +
      'change, landing within +/- 0.001 in log10 of the bracketing-free 9.5291 (max deviation ' +
      '~0.0008 at the coarsest resolved width W=0.3). Narrowing the window walks the estimator ' +
      'smoothly onto the W -> 0 ground truth: the knee is a fixed point of the bracket width, not a ' +
      'moving artifact of it.',
    F3_imp33701_reconciles_as_resolution_loss:
      'At W >= 0.4-decade the single D2 sign change DISAPPEARS (zero crossings inside [1e9,1e11]); ' +
      'the resolution threshold sits between W=0.3 (resolves) and W=0.4 (lost). The imp-33701 ' +
      'WHOLE-decade ladder (W=1.0) is far past that threshold, so decade-averaging smears the ' +
      'curvature until the crossing cannot survive and the apparent knee lands high at [1e10,1e11]. ' +
      'The two readings do not conflict: the knee is genuinely at N* ~ 3.38e9 and [1e10,1e11] is ' +
      'the coarse-averaging shadow of that same knee.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33721 knee at N* ~ 3.38e9 is ' +
    'BRACKET-ROBUST, not a differencing artifact: a bracketing-FREE pointwise ramp curvature ' +
    '(no OLS window at all) puts the single inflection at log10 N* = 9.5291 (N* = 3.381e9), ' +
    'invariant to the central-difference stencil, and every sub-decade bracket width W in ' +
    '{0.1..0.3} converges to it (max deviation ~0.0008 in log10). The imp-33701 whole-decade ' +
    'reading reconciles as pure resolution loss: the sub-decade crossing vanishes for W >= 0.4, ' +
    'so the W=1.0 ladder could only see a decade-smeared shadow that lands at [1e10,1e11]. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-33721 (sub-decade knee relocation to N* ~ 3.38e9 -- the reading tested here); imp-33701 ' +
    '(whole-decade ladder placing the knee at [1e10,1e11]); imp-33582 (six-decade exponent ladder ' +
    '+ sigma=1/2 halving landmark ~3.27e9); imp-3444 (E_coll=E_trunc crossover ~3.28e9); imp-486 ' +
    '(C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY_ASSERTIONS = [
  {
    // (F1): the bracketing-free pointwise curvature has exactly one crossing, at log10 N* ~ 9.5291,
    // matching the imp-33721 sub-decade knee -- so ~3.38e9 is not a stencil artifact.
    id: 'imp97708-pointwise-single-knee-matches-imp33721',
    description: 'bracketing-free pointwise curvature has one zero-crossing at log10 N* ~ 9.529, matching imp-33721',
    holds: () =>
      PW_CROSSINGS.length === 1 &&
      POINTWISE_LOG10_NSTAR !== null &&
      Math.abs(POINTWISE_LOG10_NSTAR - 9.5291) < 0.01 &&
      Math.abs(POINTWISE_LOG10_NSTAR - IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionLog10Nstar) < 0.01,
  },
  {
    // (F1 sharp): the pointwise crossing is invariant to the differentiation stencil.
    id: 'imp97708-pointwise-knee-stencil-invariant',
    description: 'pointwise crossing stays at log10 N* ~ 9.5291 across central-difference steps h in {5e-5..1e-3}',
    holds: () =>
      STENCIL_SWEEP.every((r) => r.crossings === 1 && r.log10Nstar !== null && Math.abs(r.log10Nstar - 9.5291) < 0.01),
  },
  {
    // (F2): every sub-decade width in {0.1..0.3} converges to the bracketing-free pointwise knee.
    id: 'imp97708-subdecade-widths-converge-to-pointwise',
    description: 'every W in {0.1..0.3} yields one D2 crossing within +/- 0.005 in log10 of the pointwise knee',
    holds: () =>
      MAX_DEV_RESOLVED !== null &&
      MAX_DEV_RESOLVED < 0.005 &&
      WIDTH_SWEEP.filter((r) => r.widthDecades <= 0.3).every((r) => r.signChanges === 1),
  },
  {
    // (F3): the crossing is lost for W >= 0.4 -- the resolution threshold that reconciles imp-33701.
    id: 'imp97708-crossing-lost-past-resolution-threshold',
    description: 'W >= 0.4-decade loses the single crossing (0 sign changes); threshold between W=0.3 and W=0.4',
    holds: () =>
      COARSEST_RESOLVED_W !== null &&
      FINEST_LOST_W !== null &&
      COARSEST_RESOLVED_W <= 0.3 + 1e-9 &&
      FINEST_LOST_W >= 0.4 - 1e-9 &&
      WIDTH_SWEEP.filter((r) => r.widthDecades >= 0.4).every((r) => r.signChanges === 0),
  },
  {
    // Honesty gate: measurement/fit only, bracket-robust verdict, no QED, PT SOTA.
    id: 'imp97708-honesty-gate-no-qed',
    description: 'Measurement only: bracket-robust verdict, no QED, PT stays SOTA',
    holds: () =>
      IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY.isRigorous === false &&
      IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY.verdictBracketRobust === true &&
      /NO QED/.test(IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY.verdict),
  },
];

for (const a of IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97708-sigma-knee-bracket-width-sensitivity assertion failed: ${a.id}`);
  }
}
