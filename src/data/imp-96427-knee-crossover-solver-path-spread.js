/**
 * @module imp-96427-knee-crossover-solver-path-spread
 *
 * imp-96427 (accuracy, frontier-direction): ISOLATE the inter-METHOD (solver-path)
 * spread in the imp-96404 knee/crossover landmarks between the imp-96363
 * closed-form Lambert-W height inversion and the Newton main-term inverse
 * (effectiveHeightForN), as a residual DISTINCT from the count-model choice.
 *
 * BACKGROUND
 * ----------
 * imp-96404 measured how far the imp-96351 exponent-ramp knee (log10 N* ~ 9.529)
 * and the sigma = 1/2 crossover of the conditional share
 * sigma(N) = E_coll/(E_trunc+E_flow+E_coll) move when the COUNT MODEL is swapped
 * from the Riemann-von Mangoldt main term to the +7/8-corrected count. That is an
 * inter-COUNT-MODEL comparison: it changes the equation gamma_N solves.
 *
 * This ticket asks the complementary question. imp-96363 recorded that the RvM
 * MAIN-term count N(T) = (T/2pi)(log(T/2pi) - 1) inverts in closed form via the
 * principal Lambert branch, gamma_N = 2pi * exp(1 + W(N/e)), reproducing the
 * Newton inverse to relative 3.9e-16 at N = 1e6. Both effectiveHeightForN (Newton)
 * and gammaLambertMain (Lambert-W) therefore invert the SAME main-term equation:
 * any difference between the knee/crossover landmarks they produce is a pure
 * SOLVER-PATH residual (floating-point / iteration-vs-closed-form), carrying NO
 * count-model content. Measuring it separates that residual from the ~1/N
 * count-model shift imp-96404 reported, and confirms the imp-96404 conclusions are
 * not artifacts of the Newton iteration.
 *
 * THE QUANTITY (identical model to imp-3406/imp-33582/imp-96351/imp-96404)
 * -----------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * The ONLY thing that changes between the two runs is the SOLVER used to invert the
 * identical main-term count: Newton (effectiveHeightForN) vs closed-form Lambert-W.
 * The OLS local-exponent estimator, the tenth-decade kneeOnGrid D2 zero-crossing,
 * and the sigma = 1/2 bisection crossover are the SAME as imp-96404 (no fresh terms).
 *
 * THE MEASUREMENT
 * ---------------
 *   Recompute the tenth-decade knee across [1e9,1e12], the sigma = 1/2 crossover,
 *   and the knee-minus-crossover gap under both solver paths for the same main-term
 *   count, and report the inter-method spread of each landmark plus the relative
 *   gamma_N spread between the two solvers at the knee height.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE SOLVER-PATH KNEE SPREAD IS FLOATING-POINT NOISE. The tenth-decade D2
 *        zero-crossing sits at log10 N* ~ 9.528998 under BOTH the Newton and the
 *        Lambert-W inversion of the main-term count; the inter-method spread is
 *        ~ 1.2e-13 in log10 -- about three orders of magnitude SMALLER than the
 *        ~1.3e-10 count-model (+7/8) shift imp-96404 measured, and ~10 orders below
 *        the 0.001 knee-location resolution of imp-96351. The two solvers agree on
 *        gamma_N at the knee height to relative ~8.1e-16 (machine precision).
 *   (F2) THE CROSSOVER IS SOLVER-PATH INVARIANT AND THE GAP SURVIVES. The
 *        sigma = 1/2 crossover coincides to full double precision (spread 0 in
 *        log10) between the two solvers, so the knee-minus-crossover gap (~0.01482
 *        in log10, knee above the crossover, the imp-96388/imp-96404 landmark) is
 *        preserved to ~1.2e-13. The knee/crossover coincidence is thus a property of
 *        the component model and the count, NOT of the height-inversion algorithm:
 *        imp-96404s conclusions carry no detectable Newton-solver artifact.
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
 * @see imp-96404-sigma-knee-plus78-count-model-shift (inter-COUNT-MODEL shift of the same landmarks)
 * @see imp-96363-ecoll-independent-second-anchor (Lambert-W closed form reproduces Newton gamma to 3.9e-16)
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (baseline knee at log10 N* ~ 9.529)
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (knee sits ~0.015 log10 above the crossover)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Newton main-term inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-96351/imp-96404 exactly

const IMP96351_KNEE_LOG10 = 9.529;
const IMP96404_PLUS78_KNEE_SHIFT = 1.3e-10; // count-model (+7/8) knee shift, for scale contrast

// Principal Lambert W by Halley iteration (independent of any Newton count loop),
// reproduced verbatim from imp-96363 so the two paths compare apples-to-apples.
function lambertW(x) {
  let w = x < Math.E ? x / Math.E : Math.log(x) - Math.log(Math.log(x));
  for (let i = 0; i < 100; i += 1) {
    const ew = Math.exp(w);
    const f = w * ew - x;
    const wp = w + 1;
    const dw = f / (ew * wp - ((w + 2) * f) / (2 * wp));
    w -= dw;
    if (Math.abs(dw) < 1e-15) break;
  }
  return w;
}

// Closed-form Lambert-W inversion of the SAME RvM main term effectiveHeightForN
// inverts by Newton: (T/2pi)(log(T/2pi)-1)=N  =>  T = 2pi * exp(1 + W(N/e)).
function gammaLambertMain(N) {
  return TWO_PI * Math.exp(1 + lambertW(N / Math.E));
}

// sigma(N) with a pluggable height map (only the T0 SOLVER differs between runs).
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

// OLS local decay exponent, identical estimator to imp-96351/imp-96404.
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

// Tenth-decade D2 zero-crossing (knee), identical to imp-96351/imp-96404 kneeOnGrid.
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

const sigmaNewton = makeSigma(effectiveHeightForN);
const sigmaLambert = makeSigma(gammaLambertMain);

// Reuse gate: the Newton path reproduces the imp-96351 knee on its quarter-decade.
const REUSE_KNEE = kneeOnGrid(sigmaNewton, 9.0, 11.0, 0.25, 40);

// Primary tenth-decade knee across [1e9,1e12] under both SOLVER paths.
const LO_D = 9.0;
const HI_D = 12.0;
const W_PRIMARY = 0.1;
const PPD_PRIMARY = 100;
const KNEE_NEWTON = kneeOnGrid(sigmaNewton, LO_D, HI_D, W_PRIMARY, PPD_PRIMARY);
const KNEE_LAMBERT = kneeOnGrid(sigmaLambert, LO_D, HI_D, W_PRIMARY, PPD_PRIMARY);
const KNEE_SPREAD_LOG10 = KNEE_LAMBERT.cstar - KNEE_NEWTON.cstar;

// sigma = 1/2 crossover under both solver paths (imp-96388 landmark).
const CROSS_NEWTON = crossoverLog10(sigmaNewton, 8.0, 11.0);
const CROSS_LAMBERT = crossoverLog10(sigmaLambert, 8.0, 11.0);
const CROSS_SPREAD_LOG10 = CROSS_LAMBERT - CROSS_NEWTON;

// knee-minus-crossover gap (the imp-96388/imp-96404 coincidence) under both paths.
const GAP_NEWTON = KNEE_NEWTON.cstar - CROSS_NEWTON;
const GAP_LAMBERT = KNEE_LAMBERT.cstar - CROSS_LAMBERT;
const GAP_SPREAD_LOG10 = GAP_LAMBERT - GAP_NEWTON;

// Relative gamma_N spread between the two solvers at the knee height.
const N_KNEE = Math.pow(10, KNEE_NEWTON.cstar);
const GAMMA_NEWTON_AT_KNEE = effectiveHeightForN(N_KNEE);
const GAMMA_LAMBERT_AT_KNEE = gammaLambertMain(N_KNEE);
const GAMMA_REL_SPREAD_AT_KNEE =
  (GAMMA_LAMBERT_AT_KNEE - GAMMA_NEWTON_AT_KNEE) / GAMMA_NEWTON_AT_KNEE;

// Ratio of the count-model (+7/8) knee shift to the solver-path knee spread, showing
// the solver residual is orders of magnitude below the count-model effect.
const SOLVER_VS_COUNTMODEL_RATIO =
  KNEE_SPREAD_LOG10 === 0 ? Infinity : IMP96404_PLUS78_KNEE_SHIFT / Math.abs(KNEE_SPREAD_LOG10);

export const IMP96427_KNEE_CROSSOVER_SOLVER_PATH_SPREAD = Object.freeze({
  id: 'imp-96427',
  proofSection: 'S-frontier',
  question:
    'How large is the inter-METHOD (solver-path) spread in the imp-96404 knee, sigma = 1/2 crossover, ' +
    'and knee-minus-crossover gap between the imp-96363 closed-form Lambert-W inversion and the Newton ' +
    'main-term inverse (effectiveHeightForN) -- a residual distinct from the count-model choice? ' +
    'Curvature diagnostic only; measurement/fit; NOT an RH bound; NO QED.',
  measuredQuantity:
    'log10 N* spread of the tenth-decade D2 zero-crossing (knee) across [1e9,1e12] between the Lambert-W ' +
    'and Newton inversions of the SAME main-term count, plus the sigma = 1/2 crossover spread, the ' +
    'knee-minus-crossover gap spread, and the relative gamma_N spread at the knee height',
  window: '[1e9,1e12]',
  primaryWidthDecades: W_PRIMARY,
  primaryPtsPerDecade: PPD_PRIMARY,
  imp96351KneeLog10: IMP96351_KNEE_LOG10,
  imp96404Plus78KneeShift: IMP96404_PLUS78_KNEE_SHIFT,
  reuseKneeLog10: REUSE_KNEE.cstar === null ? null : +REUSE_KNEE.cstar.toFixed(4),
  kneeNewtonLog10Nstar: KNEE_NEWTON.cstar === null ? null : +KNEE_NEWTON.cstar.toFixed(9),
  kneeLambertLog10Nstar: KNEE_LAMBERT.cstar === null ? null : +KNEE_LAMBERT.cstar.toFixed(9),
  kneeSpreadLog10: +KNEE_SPREAD_LOG10.toExponential(3),
  crossNewtonLog10: +CROSS_NEWTON.toFixed(9),
  crossLambertLog10: +CROSS_LAMBERT.toFixed(9),
  crossSpreadLog10: +CROSS_SPREAD_LOG10.toExponential(3),
  gapNewtonLog10: +GAP_NEWTON.toFixed(9),
  gapLambertLog10: +GAP_LAMBERT.toFixed(9),
  gapSpreadLog10: +GAP_SPREAD_LOG10.toExponential(3),
  gammaRelSpreadAtKnee: +GAMMA_REL_SPREAD_AT_KNEE.toExponential(3),
  solverVsCountModelRatio:
    Number.isFinite(SOLVER_VS_COUNTMODEL_RATIO) ? +SOLVER_VS_COUNTMODEL_RATIO.toExponential(2) : null,
  kneeSignChangesNewton: KNEE_NEWTON.signChanges,
  kneeSignChangesLambert: KNEE_LAMBERT.signChanges,
  finding: {
    F1_solver_path_knee_spread_is_floating_point_noise:
      'The tenth-decade D2 zero-crossing sits at log10 N* ~ ' +
      (KNEE_NEWTON.cstar === null ? 'null' : KNEE_NEWTON.cstar.toFixed(6)) +
      ' under BOTH the Newton and Lambert-W inversions of the main-term count; the inter-method spread ' +
      'is ~ ' + KNEE_SPREAD_LOG10.toExponential(2) + ' in log10 -- about ' +
      (Number.isFinite(SOLVER_VS_COUNTMODEL_RATIO) ? SOLVER_VS_COUNTMODEL_RATIO.toExponential(1) : 'inf') +
      'x SMALLER than the ~' + IMP96404_PLUS78_KNEE_SHIFT.toExponential(1) + ' count-model (+7/8) shift ' +
      'imp-96404 measured, and ~10 orders below the 0.001 knee resolution of imp-96351. The two solvers ' +
      'agree on gamma_N at the knee height to relative ~' + GAMMA_REL_SPREAD_AT_KNEE.toExponential(2) +
      ' (machine precision).',
    F2_crossover_invariant_gap_survives:
      'The sigma = 1/2 crossover coincides to ~' + Math.abs(CROSS_SPREAD_LOG10).toExponential(1) +
      ' in log10 between the two solvers, so the knee-minus-crossover gap (~' + GAP_NEWTON.toFixed(5) +
      ' in log10, knee above the crossover, the imp-96388/imp-96404 landmark) is preserved to ~' +
      Math.abs(GAP_SPREAD_LOG10).toExponential(1) + '. The knee/crossover coincidence is a property of ' +
      'the component model and the count, NOT of the height-inversion algorithm: imp-96404s conclusions ' +
      'carry no detectable Newton-solver artifact.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Inverting the SAME RvM main-term count by the ' +
    'closed-form Lambert-W path (imp-96363) instead of the Newton inverse (effectiveHeightForN) moves ' +
    'the imp-96404 landmarks only by floating-point noise: the tenth-decade knee shifts ~' +
    KNEE_SPREAD_LOG10.toExponential(2) + ' in log10 (gamma_N agrees to relative ~' +
    GAMMA_REL_SPREAD_AT_KNEE.toExponential(2) + ' at the knee height N* ~ 3.38e9), about ' +
    (Number.isFinite(SOLVER_VS_COUNTMODEL_RATIO) ? SOLVER_VS_COUNTMODEL_RATIO.toExponential(1) : 'inf') +
    'x below the ~' + IMP96404_PLUS78_KNEE_SHIFT.toExponential(1) + ' count-model (+7/8) shift. The ' +
    'sigma = 1/2 crossover coincides to ~' + Math.abs(CROSS_SPREAD_LOG10).toExponential(1) + ', so the ' +
    'knee-minus-crossover gap (~' + GAP_NEWTON.toFixed(5) + ' log10, knee above crossover) survives to ~' +
    Math.abs(GAP_SPREAD_LOG10).toExponential(1) + '. This isolates a pure solver-path residual distinct ' +
    'from the count-model choice and confirms the imp-96404 knee/crossover conclusions are not Newton ' +
    'iteration artifacts. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_H isRigorousUpperBound ' +
    'stays false (imp-2642/imp-2701); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96404 (inter-COUNT-MODEL +7/8 knee shift ~1.3e-10, crossover shift ~6e-12); imp-96363 ' +
    '(closed-form Lambert-W reproduces the Newton main-term gamma to relative 3.9e-16 at N=1e6); ' +
    'imp-96351 (baseline knee at log10 N* ~ 9.529); imp-96388 (knee ~0.015 log10 above the E_coll = ' +
    'E_trunc crossover); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Newton main-term inverse).',
});

export default IMP96427_KNEE_CROSSOVER_SOLVER_PATH_SPREAD;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96427_ASSERTIONS = [
  {
    id: 'imp96427-reuse-gate-reproduces-imp96351-knee',
    description: 'the Newton quarter-decade recomputation reproduces the imp-96351 knee at log10 N* ~ 9.529',
    holds: () =>
      REUSE_KNEE.signChanges === 1 &&
      REUSE_KNEE.cstar !== null &&
      Math.abs(REUSE_KNEE.cstar - IMP96351_KNEE_LOG10) < 0.005,
  },
  {
    id: 'imp96427-both-solver-paths-one-sign-change',
    description: 'both the Newton and Lambert-W solver paths resolve exactly one D2 sign change',
    holds: () => KNEE_NEWTON.signChanges === 1 && KNEE_LAMBERT.signChanges === 1,
  },
  {
    id: 'imp96427-solver-knee-spread-is-noise',
    description: 'the Lambert-vs-Newton knee spread is floating-point noise (~1e-13), far below the count-model shift',
    holds: () =>
      KNEE_NEWTON.cstar !== null &&
      KNEE_LAMBERT.cstar !== null &&
      Math.abs(KNEE_SPREAD_LOG10) < 1e-9,
  },
  {
    id: 'imp96427-solver-spread-below-countmodel-shift',
    description: 'the solver-path knee spread is orders of magnitude below the imp-96404 +7/8 count-model shift',
    holds: () => Math.abs(KNEE_SPREAD_LOG10) < IMP96404_PLUS78_KNEE_SHIFT / 100,
  },
  {
    id: 'imp96427-gamma-spread-machine-precision',
    description: 'the two solvers agree on gamma_N at the knee height to relative machine precision (~1e-15)',
    holds: () => Math.abs(GAMMA_REL_SPREAD_AT_KNEE) < 1e-12,
  },
  {
    id: 'imp96427-crossover-and-gap-solver-invariant',
    description: 'the sigma = 1/2 crossover and the knee-minus-crossover gap are solver-path invariant',
    holds: () =>
      Math.abs(CROSS_SPREAD_LOG10) < 1e-9 &&
      Math.abs(GAP_SPREAD_LOG10) < 1e-9 &&
      GAP_NEWTON > 0, // the knee sits above the crossover (imp-96388 ordering)
  },
  {
    id: 'imp96427-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP96427_KNEE_CROSSOVER_SOLVER_PATH_SPREAD.isRigorous === false &&
      /NO QED/.test(IMP96427_KNEE_CROSSOVER_SOLVER_PATH_SPREAD.verdict) &&
      /refereed bound is changed/i.test(IMP96427_KNEE_CROSSOVER_SOLVER_PATH_SPREAD.verdict),
  },
];

for (const a of IMP96427_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96427-knee-crossover-solver-path-spread assertion failed: ${a.id}`);
  }
}
