/**
 * @module imp-96464-sigma-knee-widened-grid-window-exit
 *
 * imp-96464 (numerical, frontier-direction): RE-MEASURE the imp-96451
 * tenth-decade sigma-knee on a WIDENED log10-N grid so the E_trunc > 5e-5 branch
 * resolves, and LOCATE (by bisection in the E_trunc multiplier) the exact factor
 * at which the knee crosses out of the original [1e9,1e12] window.
 *
 * BACKGROUND
 * ----------
 * imp-96451 perturbed the N-independent truncation floor E_trunc = 3.06e-5 over a
 * log-symmetric 0.5x..2x band and found (F1/F2) that both the tenth-decade knee
 * (D2 zero-crossing of the OLS local exponent) and the sigma = 1/2 crossover move
 * with elasticity d(log10 N*)/d(log E_trunc) ~ -0.911, close to the analytic
 * -2/ln10 leading term, and (F3) that the knee tracks the crossover rigidly so
 * the ~0.0148 log10 knee-minus-crossover gap is preserved. But imp-96451 ran the
 * knee finder on the FIXED [1e9,1e12] grid: at 2x (E_trunc = 6.12e-5) the crossover
 * falls to log10 N ~ 8.88, below the grid, so the D2 zero-crossing was NOT resolved
 * (kneeSignChanges 0). Its F4 therefore could only say the knee "leaves the window
 * past E_trunc ~ 5e-5" without re-measuring it on a wider grid.
 *
 * THE MEASUREMENT
 * ---------------
 * Re-run the SAME kneeOnGrid / crossover estimators (identical to imp-96351/imp-96427/
 * imp-96451) on a WIDENED log10-N grid [1e7,1e13] across the same 0.5x..2x E_trunc
 * band, so the knee is resolved at EVERY factor (including 2x). Then bisect in the
 * E_trunc multiplier to locate the exact factor at which the widened-grid knee
 * crosses out of the original [1e9,1e12] window (the low edge log10 N = 9, since
 * raising E_trunc drags the knee DOWN). Report the widened-grid knee elasticity and
 * whether it still equals the crossover elasticity (imp-96451 F3 rigidity) once the
 * window no longer clips the knee.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (G1) THE WIDENED GRID RESOLVES THE KNEE AT EVERY FACTOR. On [1e7,1e13] the D2
 *        zero-crossing is found (kneeSignChanges 1) at all seven factors 0.5x..2x,
 *        including 2x where the fixed [1e9,1e12] grid returned kneeSignChanges 0.
 *        At 2x the widened-grid knee sits at log10 N* ~ 8.896, just below the
 *        original low edge -- so imp-96451 F4 was a window-clipping artefact, not a
 *        disappearance of the knee.
 *   (G2) THE ELASTICITY IS UNCHANGED OFF-WINDOW. The widened-grid knee elasticity
 *        d(log10 N*)/d(log E_trunc) ~ -0.9115 equals the crossover elasticity
 *        ~ -0.9113 to three figures -- the imp-96451 F3 rigidity survives once the
 *        window no longer clips the knee, and matches the on-window imp-96451
 *        elasticities to all reported digits. The knee-minus-crossover gap stays in
 *        the narrow 0.01448..0.01483 band across the full 0.5x..2x sweep.
 *   (G3) THE KNEE EXITS THE ORIGINAL WINDOW AT E_trunc ~ 5.46e-5. Bisecting the
 *        multiplier for widened-grid knee = log10 N 9.0 gives factor f* ~ 1.7847,
 *        i.e. E_trunc ~ 5.461e-5 -- a precise value for the imp-96451 F4 "~5e-5"
 *        estimate. The exit is one-sided: the knee only crosses the LOW edge; even
 *        at 0.1x (E_trunc = 3.06e-6) it sits at log10 N ~ 11.61, never reaching the
 *        high edge log10 N = 12 within a plausible band.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share window-resolution diagnostic, NOT an RH
 * bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_H
 * isRigorousUpperBound stays false (imp-2642/imp-2701); changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 *
 * @see imp-96451-sigma-knee-etrunc-sensitivity (fixed-window knee sensitivity; F4 knee off-window at 2x)
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (baseline knee at log10 N* ~ 9.529)
 * @see imp-96427-knee-crossover-solver-path-spread (same estimators, solver-path noise ~1e-13)
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (knee sits ~0.015 log10 above the crossover)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Newton main-term inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-96351/imp-96427/imp-96451 exactly

const IMP96451_KNEE_ELASTICITY = -0.9115; // on-window value to compare against
const ORIG_WINDOW_LO = 9.0; // original [1e9,1e12] low edge
const ORIG_WINDOW_HI = 12.0; // original [1e9,1e12] high edge

// sigma(N) with a PLUGGABLE truncation floor (only E_trunc varies across runs) -- identical to imp-96451.
function makeSigma(E_trunc) {
  return function sigma(N) {
    const T0 = effectiveHeightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = C_F * (L / T0) * GRONWALL;
    const E_coll = C_C_PINNED * Math.sqrt(L / N);
    return E_coll / (E_trunc + E_flow + E_coll);
  };
}

// OLS local decay exponent, identical estimator to imp-96351/imp-96427/imp-96451.
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

// Tenth-decade D2 zero-crossing (knee), identical to imp-96351/imp-96427/imp-96451 kneeOnGrid.
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

// Widened grid: [1e7,1e13] so the knee resolves for every factor across the 0.5x..2x band.
const FACTORS = [0.5, Math.SQRT1_2, 0.9, 1.0, 1.1, Math.SQRT2, 2.0];
const WIDE_LO_D = 7.0;
const WIDE_HI_D = 13.0;
const W_PRIMARY = 0.1;
const PPD_PRIMARY = 100;

const ROWS = FACTORS.map((f) => {
  const Et = E_TRUNC_PT * f;
  const sigma = makeSigma(Et);
  const knee = kneeOnGrid(sigma, WIDE_LO_D, WIDE_HI_D, W_PRIMARY, PPD_PRIMARY);
  const cross = crossoverLog10(sigma, 4.0, 14.0);
  return {
    factor: f,
    eTrunc: Et,
    kneeSignChanges: knee.signChanges,
    kneeLog10Nstar: knee.cstar,
    crossoverLog10N: cross,
    gapLog10: knee.cstar === null ? null : knee.cstar - cross,
  };
});

// Widened-grid elasticities via the same log-centred 1/sqrt2..sqrt2 finite difference as imp-96451.
const FLANK_LO = ROWS.find((r) => Math.abs(r.factor - Math.SQRT1_2) < 1e-12);
const FLANK_HI = ROWS.find((r) => Math.abs(r.factor - Math.SQRT2) < 1e-12);
const D_LOG_ETRUNC = Math.log(FLANK_HI.eTrunc) - Math.log(FLANK_LO.eTrunc);
const KNEE_ELASTICITY = (FLANK_HI.kneeLog10Nstar - FLANK_LO.kneeLog10Nstar) / D_LOG_ETRUNC;
const CROSS_ELASTICITY = (FLANK_HI.crossoverLog10N - FLANK_LO.crossoverLog10N) / D_LOG_ETRUNC;

// Widened-grid knee at an arbitrary multiplier (helper for the window-exit bisection).
function wideKneeAtFactor(f) {
  const knee = kneeOnGrid(makeSigma(E_TRUNC_PT * f), WIDE_LO_D, WIDE_HI_D, W_PRIMARY, PPD_PRIMARY);
  return knee.cstar;
}

// Bisect the E_trunc multiplier for the factor at which the widened-grid knee first
// crosses the ORIGINAL [1e9,1e12] LOW edge (log10 N = 9). Raising E_trunc lowers the knee.
function bisectFactorForKneeEdge(edgeLog10, loF, hiF) {
  let lo = loF;
  let hi = hiF;
  for (let i = 0; i < 80; i += 1) {
    const mid = 0.5 * (lo + hi);
    if (wideKneeAtFactor(mid) > edgeLog10) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

const EXIT_FACTOR_LOW_EDGE = bisectFactorForKneeEdge(ORIG_WINDOW_LO, 1.0, 2.0);
const EXIT_ETRUNC_LOW_EDGE = E_TRUNC_PT * EXIT_FACTOR_LOW_EDGE;

// One-sidedness check: the knee never reaches the high edge (12.0) within a plausible band.
const KNEE_AT_TENTH = wideKneeAtFactor(0.1); // E_trunc = 3.06e-6

// Full-band 2x row (the one imp-96451 could not resolve) and half row for the shift.
const F2 = ROWS.find((r) => r.factor === 2.0);
const F05 = ROWS.find((r) => r.factor === 0.5);
const RESOLVED_GAPS = ROWS.filter((r) => r.gapLog10 !== null).map((r) => r.gapLog10);
const GAP_MIN = Math.min(...RESOLVED_GAPS);
const GAP_MAX = Math.max(...RESOLVED_GAPS);
const ALL_RESOLVED = ROWS.every((r) => r.kneeSignChanges === 1 && r.kneeLog10Nstar !== null);

export const IMP96464_SIGMA_KNEE_WIDENED_GRID_WINDOW_EXIT = Object.freeze({
  id: 'imp-96464',
  proofSection: 'S-frontier',
  question:
    'Once the imp-96451 tenth-decade sigma-knee is re-measured on a WIDENED log10-N grid [1e7,1e13] so the ' +
    'E_trunc > 5e-5 branch resolves, does the knee elasticity still equal the crossover elasticity (imp-96451 ' +
    'F3 rigidity) off-window, and at exactly which E_trunc multiplier does the knee cross out of the original ' +
    '[1e9,1e12] window? Window-resolution diagnostic only; measurement/fit; NOT an RH bound; NO QED.',
  measuredQuantity:
    'the D2 zero-crossing knee on the widened [1e7,1e13] grid across the 0.5x..2x E_trunc band, the widened-grid ' +
    'knee/crossover elasticities d(log10 N*)/d(log E_trunc), and the bisected E_trunc multiplier at which the ' +
    'knee crosses the original [1e9,1e12] low edge (log10 N = 9)',
  eTruncAnchor: E_TRUNC_PT,
  widenedWindow: '[1e7,1e13]',
  originalWindow: '[1e9,1e12]',
  primaryWidthDecades: W_PRIMARY,
  primaryPtsPerDecade: PPD_PRIMARY,
  perturbationFactors: FACTORS,
  rows: ROWS.map((r) => ({
    factor: +r.factor.toFixed(6),
    eTrunc: +r.eTrunc.toExponential(4),
    kneeSignChanges: r.kneeSignChanges,
    kneeLog10Nstar: r.kneeLog10Nstar === null ? null : +r.kneeLog10Nstar.toFixed(9),
    crossoverLog10N: +r.crossoverLog10N.toFixed(9),
    gapLog10: r.gapLog10 === null ? null : +r.gapLog10.toFixed(6),
    inOriginalWindow:
      r.kneeLog10Nstar !== null && r.kneeLog10Nstar >= ORIG_WINDOW_LO && r.kneeLog10Nstar <= ORIG_WINDOW_HI,
  })),
  allFactorsResolved: ALL_RESOLVED,
  kneeElasticity: +KNEE_ELASTICITY.toFixed(6),
  crossoverElasticity: +CROSS_ELASTICITY.toFixed(6),
  imp96451KneeElasticity: IMP96451_KNEE_ELASTICITY,
  elasticityMatchAbs: +Math.abs(KNEE_ELASTICITY - CROSS_ELASTICITY).toExponential(3),
  dLogEtruncSpan: +D_LOG_ETRUNC.toFixed(6),
  gapMin: +GAP_MIN.toFixed(6),
  gapMax: +GAP_MAX.toFixed(6),
  exitFactorLowEdge: +EXIT_FACTOR_LOW_EDGE.toFixed(6),
  exitETruncLowEdge: +EXIT_ETRUNC_LOW_EDGE.toExponential(4),
  kneeAtTenthFactor: +KNEE_AT_TENTH.toFixed(6),
  knee2xLog10Nstar: F2.kneeLog10Nstar === null ? null : +F2.kneeLog10Nstar.toFixed(6),
  finding: {
    G1_widened_grid_resolves_every_factor:
      'On the widened [1e7,1e13] grid the D2 zero-crossing is found (kneeSignChanges 1) at all seven factors ' +
      '0.5x..2x, including 2x where the fixed [1e9,1e12] grid returned kneeSignChanges 0. At 2x the widened-grid ' +
      'knee sits at log10 N* ~ ' + F2.kneeLog10Nstar.toFixed(3) + ', just below the original low edge -- so the ' +
      'imp-96451 F4 non-resolution was a window-clipping artefact, not a disappearance of the knee.',
    G2_elasticity_unchanged_off_window:
      'The widened-grid knee elasticity d(log10 N*)/d(log E_trunc) ~ ' + KNEE_ELASTICITY.toFixed(4) + ' equals the ' +
      'crossover elasticity ~ ' + CROSS_ELASTICITY.toFixed(4) + ' to three figures (|diff| ~ ' +
      Math.abs(KNEE_ELASTICITY - CROSS_ELASTICITY).toExponential(1) + '), so the imp-96451 F3 rigidity survives ' +
      'once the window no longer clips the knee, and matches the on-window imp-96451 value ~' +
      IMP96451_KNEE_ELASTICITY + '. The knee-minus-crossover gap stays in the ' + GAP_MIN.toFixed(5) + '..' +
      GAP_MAX.toFixed(5) + ' band across the whole sweep.',
    G3_knee_exits_window_at_5p46e5:
      'Bisecting the multiplier for widened-grid knee = log10 N ' + ORIG_WINDOW_LO.toFixed(1) + ' gives factor ' +
      'f* ~ ' + EXIT_FACTOR_LOW_EDGE.toFixed(4) + ', i.e. E_trunc ~ ' + EXIT_ETRUNC_LOW_EDGE.toExponential(3) +
      ' -- a precise value for the imp-96451 F4 "~5e-5" estimate. The exit is one-sided: even at 0.1x ' +
      '(E_trunc = 3.06e-6) the knee sits at log10 N ~ ' + KNEE_AT_TENTH.toFixed(2) + ', never reaching the high ' +
      'edge log10 N = ' + ORIG_WINDOW_HI.toFixed(1) + ' within a plausible band, so the knee only crosses the LOW edge.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Re-measuring the imp-96451 tenth-decade sigma-knee on a ' +
    'widened [1e7,1e13] grid resolves the D2 zero-crossing at EVERY factor across the 0.5x..2x E_trunc band ' +
    '(including 2x, log10 N* ~ ' + F2.kneeLog10Nstar.toFixed(3) + ', which the fixed [1e9,1e12] grid clipped to ' +
    'kneeSignChanges 0). Off-window the knee elasticity d(log10 N*)/d(log E_trunc) ~ ' + KNEE_ELASTICITY.toFixed(3) +
    ' still equals the crossover elasticity ~ ' + CROSS_ELASTICITY.toFixed(3) + ' to three figures, so the ' +
    'imp-96451 F3 rigidity is a genuine property of the component model, not a window artefact. Bisecting the ' +
    'E_trunc multiplier locates the knee exiting the original [1e9,1e12] window at f* ~ ' +
    EXIT_FACTOR_LOW_EDGE.toFixed(4) + ' (E_trunc ~ ' + EXIT_ETRUNC_LOW_EDGE.toExponential(3) + '), a precise value ' +
    'for the imp-96451 F4 "~5e-5" estimate; the exit is one-sided (low edge only). The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; C_H isRigorousUpperBound stays false (imp-2642/imp-2701); changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96451 (fixed-window knee sensitivity, F4 knee off-window at 2x); imp-96351 (baseline knee at ' +
    'log10 N* ~ 9.529); imp-96427 (same estimators, solver-path noise ~1e-13); imp-96388 (knee ~0.015 log10 ' +
    'above the crossover); imp-486 (C_mb GUE-conditional); imp-2631/imp-3406 (E_trunc = 3.06e-5 fixed-strip ' +
    'route); lambda-rh-height-mapping (effectiveHeightForN, Newton inverse).',
});

export default IMP96464_SIGMA_KNEE_WIDENED_GRID_WINDOW_EXIT;

export const IMP96464_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement (frontier-direction, NOT rigorous): '
  + 'the widened-grid re-measurement resolves the imp-96451 F4 window-clipping artefact and refines '
  + 'its ~5e-5 E_trunc exit estimate, but the underlying component model remains the inherited '
  + 'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per '
  + 'imp-486 is UNTOUCHED; C_H isRigorousUpperBound stays false (imp-2642/imp-2701); changes no '
  + 'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96464_ASSERTIONS = [
  {
    id: 'imp96464-widened-grid-resolves-every-factor',
    description: 'the widened [1e7,1e13] grid resolves the knee (kneeSignChanges 1) at all seven factors, including 2x',
    holds: () => ALL_RESOLVED && F2.kneeSignChanges === 1 && F2.kneeLog10Nstar !== null,
  },
  {
    id: 'imp96464-2x-knee-below-original-low-edge',
    description: 'the 2x widened-grid knee sits just below the original [1e9,1e12] low edge (explaining imp-96451 F4)',
    holds: () => F2.kneeLog10Nstar < ORIG_WINDOW_LO && F2.kneeLog10Nstar > 8.5,
  },
  {
    id: 'imp96464-knee-tracks-crossover-off-window',
    description: 'the widened-grid knee and crossover elasticities coincide to three figures (F3 rigidity off-window)',
    holds: () => Math.abs(KNEE_ELASTICITY - CROSS_ELASTICITY) < 1e-3,
  },
  {
    id: 'imp96464-elasticity-matches-imp96451',
    description: 'the widened-grid knee elasticity matches the on-window imp-96451 value ~-0.9115',
    holds: () => Math.abs(KNEE_ELASTICITY - IMP96451_KNEE_ELASTICITY) < 5e-3,
  },
  {
    id: 'imp96464-window-exit-factor-refines-5e-5',
    description: 'the bisected low-edge exit factor gives E_trunc ~ 5.5e-5, refining the imp-96451 F4 ~5e-5 estimate',
    holds: () =>
      EXIT_FACTOR_LOW_EDGE > 1.7 &&
      EXIT_FACTOR_LOW_EDGE < 1.85 &&
      EXIT_ETRUNC_LOW_EDGE > 5.2e-5 &&
      EXIT_ETRUNC_LOW_EDGE < 5.7e-5,
  },
  {
    id: 'imp96464-exit-is-one-sided',
    description: 'the knee never reaches the high edge (12.0) even at 0.1x, so the window exit is low-edge only',
    holds: () => KNEE_AT_TENTH < ORIG_WINDOW_HI && KNEE_AT_TENTH > ORIG_WINDOW_LO,
  },
  {
    id: 'imp96464-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP96464_SIGMA_KNEE_WIDENED_GRID_WINDOW_EXIT.isRigorous === false &&
      /NO QED/.test(IMP96464_SIGMA_KNEE_WIDENED_GRID_WINDOW_EXIT.verdict) &&
      /refereed bound is changed/i.test(IMP96464_SIGMA_KNEE_WIDENED_GRID_WINDOW_EXIT.verdict),
  },
  {
    id: 'imp96464-honest-banner-present',
    description: 'a dedicated machine-readable IMP96464_HONEST_BANNER carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () =>
      /RH open/.test(IMP96464_HONEST_BANNER) &&
      /PT Lambda <= 0\.2|refereed bound is changed/.test(IMP96464_HONEST_BANNER) &&
      /NO QED/.test(IMP96464_HONEST_BANNER),
  },
];

for (const a of IMP96464_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96464-sigma-knee-widened-grid-window-exit assertion failed: ${a.id}`);
  }
}
