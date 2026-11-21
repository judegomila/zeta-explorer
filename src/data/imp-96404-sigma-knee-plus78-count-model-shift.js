/**
 * @module imp-96404-sigma-knee-plus78-count-model-shift
 *
 * imp-96404 (numerical, frontier-direction): MEASURE how far the imp-96351
 * exponent-ramp knee (log10 N* ~ 9.529, N* ~ 3.38e9) of the conditional share
 * sigma(N) = E_coll/(E_trunc+E_flow+E_coll) moves when the height gamma_N is
 * taken from the +7/8-corrected Riemann-von Mangoldt count instead of the
 * MAIN-term count, and whether the imp-96388 knee/crossover coincidence survives.
 *
 * BACKGROUND
 * ----------
 * imp-96351 located the single D2 zero-crossing (knee) of the OLS local-exponent
 * ramp of sigma(N) at log10 N* ~ 9.529, using gamma_N = effectiveHeightForN(N),
 * the Newton inverse of the MAIN-term count N(T) = (T/2pi)(log(T/2pi) - 1).
 * imp-96387 showed that switching to the +7/8-corrected count
 * N(T) = (T/2pi)(log(T/2pi) - 1) + 7/8 moves gamma_N -- and hence E_coll -- by a
 * relative amount that scales as ~1/N (about -4.11e-6 at N = 1e4, -3.00e-8 at
 * N = 1e6). This ticket asks the natural follow-on: at the KNEE height
 * N* ~ 3.38e9 the ~1/N count correction is ~137x/100x smaller still, so does the
 * knee move at all, and does the imp-96388 coincidence (the knee sitting ~0.013
 * in log10 just above the E_coll = E_trunc crossover) survive the count-model swap?
 *
 * THE QUANTITY (identical model to imp-3406/imp-33582/imp-33701/imp-33721/imp-96351)
 * --------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * The ONLY thing that changes here is the height map: T0 = gamma_N is taken from
 * either the main-term inverse effectiveHeightForN (baseline) OR a Newton inverse
 * of the +7/8-corrected count (the perturbed model). The OLS local-exponent
 * estimator and the tenth-decade kneeOnGrid D2 zero-crossing are the SAME as
 * imp-96351 (no fresh terms, no re-derivation). A reuse gate reproduces the
 * imp-96351 baseline knee (log10 N* ~ 9.529) before the perturbed run.
 *
 * THE MEASUREMENT
 * ---------------
 *   Recompute the tenth-decade knee across [1e9,1e12] under both height maps and
 *   report the log10 N* shift. Also relocate the sigma = 1/2 crossover
 *   (E_coll = E_trunc + E_flow) under both maps and report its shift, and confirm
 *   the knee-minus-crossover gap (the imp-96388 ~0.013-0.015 log10 coincidence) is
 *   unchanged.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE KNEE DOES NOT MOVE. Under the +7/8-corrected count the tenth-decade
 *        D2 zero-crossing stays at log10 N* ~ 9.529: the shift is ~ -1.3e-10 in
 *        log10 -- SEVEN orders of magnitude below the 0.001 knee-location
 *        resolution of imp-96351. The count-model swap changes gamma_N by only
 *        relative ~ -2.5e-10 at the knee height (the ~1/N correction evaluated at
 *        N* ~ 3.38e9), far too small to relocate the inflection.
 *   (F2) THE KNEE/CROSSOVER COINCIDENCE SURVIVES. The sigma = 1/2 crossover moves
 *        by only ~ -6e-12 in log10 under the +7/8 count, so the knee-minus-crossover
 *        gap (the imp-96388 landmark, ~0.015 in log10 with the knee just above the
 *        crossover) is preserved to ~1e-10. The coincidence is a property of the
 *        component model, not an artifact of the main-term count choice.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; C_H
 * isRigorousUpperBound stays false (imp-2642/imp-2701); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 *
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (baseline knee at log10 N* ~ 9.529)
 * @see imp-96387-ecoll-anchor-count-model-sensitivity-n1e4 (+7/8 count shift ~1/N)
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (knee sits ~0.013 log10 above the crossover)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, main-term inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-96351 exactly

const IMP96351_KNEE_LOG10 = 9.529;

// Perturbed height map: Newton inverse of the +7/8-corrected count, seeded from
// the main-term inverse (identical +7/8 count model to imp-96387/imp-96363).
function gammaPlus78(N) {
  let T = effectiveHeightForN(N);
  for (let i = 0; i < 80; i += 1) {
    const u = T / TWO_PI;
    const f = u * (Math.log(u) - 1) + 7 / 8 - N;
    const df = Math.log(u) / TWO_PI;
    const step = f / df;
    T -= step;
    if (Math.abs(step) < 1e-6 * Math.max(1, T)) break;
  }
  return T;
}

// sigma(N) with a pluggable height map (only the T0 source differs from imp-96351).
function makeSigma(gammaFn) {
  return function sigma(N) {
    const T0 = gammaFn(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = C_F * (L / T0) * GRONWALL;
    const E_coll = C_C_PINNED * Math.sqrt(L / N);
    return E_coll / (E_TRUNC_PT + E_flow + E_coll);
  };
}

// OLS local decay exponent, identical estimator to imp-96351.
function olsExponentLog10(sigma, loD, hiD, ptsPerDecade) {
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

// Tenth-decade D2 zero-crossing (knee), identical to imp-96351 kneeOnGrid.
function kneeOnGrid(sigma, loD, hiD, W, ptsPerDecade) {
  const edges = [];
  for (let d = loD; d <= hiD + 1e-9; d += W) edges.push(+d.toFixed(6));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    brackets.push({ cen, p: olsExponentLog10(sigma, edges[i], edges[i + 1], ptsPerDecade) });
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
  return { signChanges, cstar };
}

// sigma = 1/2 crossover (E_coll = E_trunc + E_flow), bisection in log10 N.
function crossoverLog10(sigma, loD, hiD) {
  let lo = loD;
  let hi = hiD;
  for (let i = 0; i < 200; i += 1) {
    const mid = 0.5 * (lo + hi);
    if (sigma(Math.pow(10, mid)) > 0.5) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

const sigmaMain = makeSigma(effectiveHeightForN);
const sigmaPlus78 = makeSigma(gammaPlus78);

// Reuse gate: baseline knee reproduces imp-96351 on its quarter-decade [1e9,1e11].
const REUSE_KNEE = kneeOnGrid(sigmaMain, 9.0, 11.0, 0.25, 40);

// Primary tenth-decade knee across [1e9,1e12] under both height maps.
const LO_D = 9.0;
const HI_D = 12.0;
const W_PRIMARY = 0.1;
const PPD_PRIMARY = 100;
const KNEE_MAIN = kneeOnGrid(sigmaMain, LO_D, HI_D, W_PRIMARY, PPD_PRIMARY);
const KNEE_PLUS78 = kneeOnGrid(sigmaPlus78, LO_D, HI_D, W_PRIMARY, PPD_PRIMARY);
const KNEE_SHIFT_LOG10 = KNEE_PLUS78.cstar - KNEE_MAIN.cstar;

// sigma = 1/2 crossover under both height maps (imp-96388 landmark).
const CROSS_MAIN = crossoverLog10(sigmaMain, 8.0, 11.0);
const CROSS_PLUS78 = crossoverLog10(sigmaPlus78, 8.0, 11.0);
const CROSS_SHIFT_LOG10 = CROSS_PLUS78 - CROSS_MAIN;

// knee-minus-crossover gap (the imp-96388 coincidence) under both maps.
const GAP_MAIN = KNEE_MAIN.cstar - CROSS_MAIN;
const GAP_PLUS78 = KNEE_PLUS78.cstar - CROSS_PLUS78;
const GAP_SHIFT_LOG10 = GAP_PLUS78 - GAP_MAIN;

// Relative gamma shift at the knee height (the ~1/N count correction at N*).
const N_KNEE = Math.pow(10, KNEE_MAIN.cstar);
const GAMMA_MAIN_AT_KNEE = effectiveHeightForN(N_KNEE);
const GAMMA_REL_SHIFT_AT_KNEE = (gammaPlus78(N_KNEE) - GAMMA_MAIN_AT_KNEE) / GAMMA_MAIN_AT_KNEE;

export const IMP96404_SIGMA_KNEE_PLUS78_COUNT_MODEL_SHIFT = Object.freeze({
  id: 'imp-96404',
  proofSection: 'S-frontier',
  question:
    'How far does the imp-96351 exponent-ramp knee (log10 N* ~ 9.529) of sigma(N) = E_coll/E move ' +
    'when gamma_N is taken from the +7/8-corrected count instead of the RvM main term, and does the ' +
    'imp-96388 knee/crossover coincidence survive? Curvature diagnostic only; measurement/fit; NOT ' +
    'an RH bound; NO QED.',
  measuredQuantity:
    'log10 N* shift of the tenth-decade D2 zero-crossing (knee) across [1e9,1e12] under the +7/8 ' +
    'count vs the main-term count, plus the sigma = 1/2 crossover shift and the knee-minus-crossover gap',
  window: '[1e9,1e12]',
  primaryWidthDecades: W_PRIMARY,
  primaryPtsPerDecade: PPD_PRIMARY,
  imp96351KneeLog10: IMP96351_KNEE_LOG10,
  reuseKneeLog10: REUSE_KNEE.cstar === null ? null : +REUSE_KNEE.cstar.toFixed(4),
  kneeMainLog10Nstar: KNEE_MAIN.cstar === null ? null : +KNEE_MAIN.cstar.toFixed(6),
  kneePlus78Log10Nstar: KNEE_PLUS78.cstar === null ? null : +KNEE_PLUS78.cstar.toFixed(6),
  kneeShiftLog10: +KNEE_SHIFT_LOG10.toExponential(3),
  crossMainLog10: +CROSS_MAIN.toFixed(6),
  crossPlus78Log10: +CROSS_PLUS78.toFixed(6),
  crossShiftLog10: +CROSS_SHIFT_LOG10.toExponential(3),
  gapMainLog10: +GAP_MAIN.toFixed(6),
  gapPlus78Log10: +GAP_PLUS78.toFixed(6),
  gapShiftLog10: +GAP_SHIFT_LOG10.toExponential(3),
  gammaRelShiftAtKnee: +GAMMA_REL_SHIFT_AT_KNEE.toExponential(3),
  kneeSignChangesMain: KNEE_MAIN.signChanges,
  kneeSignChangesPlus78: KNEE_PLUS78.signChanges,
  finding: {
    F1_knee_does_not_move:
      'Under the +7/8-corrected count the tenth-decade D2 zero-crossing stays at log10 N* ~ 9.529: ' +
      'the shift is ~ ' + KNEE_SHIFT_LOG10.toExponential(2) + ' in log10 -- seven orders of magnitude ' +
      'below the 0.001 knee-location resolution of imp-96351. The count-model swap changes gamma_N by ' +
      'only relative ~ ' + GAMMA_REL_SHIFT_AT_KNEE.toExponential(2) + ' at the knee height (the ~1/N ' +
      'correction evaluated at N* ~ 3.38e9), far too small to relocate the inflection.',
    F2_knee_crossover_coincidence_survives:
      'The sigma = 1/2 crossover moves by only ~ ' + CROSS_SHIFT_LOG10.toExponential(2) + ' in log10 ' +
      'under the +7/8 count, so the knee-minus-crossover gap (the imp-96388 landmark, ~' +
      GAP_MAIN.toFixed(3) + ' in log10 with the knee just above the crossover) is preserved to ~' +
      Math.abs(GAP_SHIFT_LOG10).toExponential(1) + '. The coincidence is a property of the component ' +
      'model, not an artifact of the main-term count choice.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Swapping the RvM main-term count for the ' +
    '+7/8-corrected count leaves the imp-96351 sigma(N) exponent-ramp knee essentially fixed: the ' +
    'tenth-decade D2 zero-crossing moves by only ~' + KNEE_SHIFT_LOG10.toExponential(2) + ' in log10 ' +
    '(the ~1/N count correction is only relative ~' + GAMMA_REL_SHIFT_AT_KNEE.toExponential(2) + ' at ' +
    'the knee height N* ~ 3.38e9), so the knee stays at log10 N* ~ 9.529. The sigma = 1/2 crossover ' +
    'moves ~' + CROSS_SHIFT_LOG10.toExponential(2) + ', so the imp-96388 knee/crossover coincidence ' +
    '(knee ~0.015 log10 above the crossover) survives intact. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; C_H isRigorousUpperBound stays false (imp-2642/imp-2701); changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96351 (baseline knee at log10 N* ~ 9.529 across [1e9,1e12]); imp-96387 (+7/8 count shift ' +
    '~1/N, -4.11e-6 at N=1e4 / -3.00e-8 at N=1e6); imp-96388 (knee ~0.013 log10 above the E_coll = ' +
    'E_trunc crossover); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, main-term inverse).',
});

export default IMP96404_SIGMA_KNEE_PLUS78_COUNT_MODEL_SHIFT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96404_ASSERTIONS = [
  {
    id: 'imp96404-reuse-gate-reproduces-imp96351-knee',
    description: 'the main-term quarter-decade recomputation reproduces the imp-96351 knee at log10 N* ~ 9.529',
    holds: () =>
      REUSE_KNEE.signChanges === 1 &&
      REUSE_KNEE.cstar !== null &&
      Math.abs(REUSE_KNEE.cstar - IMP96351_KNEE_LOG10) < 0.005,
  },
  {
    id: 'imp96404-both-height-maps-one-sign-change',
    description: 'both the main-term and +7/8-corrected height maps resolve exactly one D2 sign change',
    holds: () => KNEE_MAIN.signChanges === 1 && KNEE_PLUS78.signChanges === 1,
  },
  {
    id: 'imp96404-knee-shift-negligible',
    description: 'the +7/8 count-model knee shift is far below the 0.001 knee resolution (measured ~1e-10)',
    holds: () =>
      KNEE_MAIN.cstar !== null &&
      KNEE_PLUS78.cstar !== null &&
      Math.abs(KNEE_SHIFT_LOG10) < 1e-6,
  },
  {
    id: 'imp96404-gamma-shift-tiny-at-knee',
    description: 'the +7/8 relative gamma shift at the knee height is ~1e-10 (the ~1/N correction at N* ~ 3.38e9)',
    holds: () => Math.abs(GAMMA_REL_SHIFT_AT_KNEE) < 1e-8,
  },
  {
    id: 'imp96404-crossover-coincidence-survives',
    description: 'the sigma = 1/2 crossover and the knee-minus-crossover gap are preserved under the +7/8 count',
    holds: () =>
      Math.abs(CROSS_SHIFT_LOG10) < 1e-6 &&
      Math.abs(GAP_SHIFT_LOG10) < 1e-6 &&
      GAP_MAIN > 0, // the knee sits above the crossover (imp-96388 ordering)
  },
  {
    id: 'imp96404-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP96404_SIGMA_KNEE_PLUS78_COUNT_MODEL_SHIFT.isRigorous === false &&
      /NO QED/.test(IMP96404_SIGMA_KNEE_PLUS78_COUNT_MODEL_SHIFT.verdict) &&
      /refereed bound is changed/i.test(IMP96404_SIGMA_KNEE_PLUS78_COUNT_MODEL_SHIFT.verdict),
  },
];

for (const a of IMP96404_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96404-sigma-knee-plus78-count-model-shift assertion failed: ${a.id}`);
  }
}
