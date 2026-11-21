/**
 * @module imp-96451-sigma-knee-etrunc-sensitivity
 *
 * imp-96451 (numerical, frontier-direction): MEASURE the sensitivity of the
 * imp-96427/imp-96351 tenth-decade sigma-knee (log10 N* ~ 9.529) and the
 * sigma = 1/2 crossover to perturbation of the N-independent truncation floor
 * E_trunc = 3.06e-5 -- the ONE term in the component model that is NOT
 * GUE-conditional.
 *
 * BACKGROUND
 * ----------
 * imp-96427 recomputes the conditional share
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5 (N-independent),
 * and shows the tenth-decade knee (D2 zero-crossing of the OLS local exponent
 * across [1e9,1e12]) and the sigma = 1/2 crossover are SOLVER-PATH invariant
 * (Newton vs Lambert-W agree to ~1e-13). What imp-96427 did NOT test is how
 * those two landmarks move when the fixed truncation floor E_trunc itself is
 * perturbed. E_trunc is the sole non-conditional term (the imp-2631/imp-3406
 * fixed-strip route), so its sensitivity separates the part of the landmark
 * location pinned by the rigorous floor from the part carried by the
 * GUE-conditional E_coll.
 *
 * THE MEASUREMENT
 * ---------------
 * Perturb E_trunc by a log-symmetric band of multiplicative factors
 * (0.5x .. 2x) about 3.06e-5, holding the height map (Newton effectiveHeightForN),
 * C_C_PINNED, C_F, and Gronwall FIXED, and recompute for each factor:
 *   - the tenth-decade knee across [1e9,1e12] (same kneeOnGrid as imp-96351/96427),
 *   - the sigma = 1/2 crossover (bisection in log10 N),
 *   - the knee-minus-crossover gap (imp-96388 landmark).
 * Report the elasticities d(log10 N*)/d(log E_trunc) at the anchor, computed by
 * a log-centred finite difference between the 1/sqrt2 and sqrt2 factors.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE KNEE AND CROSSOVER ARE MATERIALLY SENSITIVE TO E_trunc, unlike the
 *        floating-point-noise solver-path spread of imp-96427. Both landmarks
 *        move with elasticity d(log10 N*)/d(log E_trunc) ~ -0.911: a factor-2
 *        rise in E_trunc drags the knee and the crossover DOWN by ~0.63 in
 *        log10 N*. The rigorous truncation floor therefore sets the landmark
 *        location to leading order -- it is NOT primarily pinned by the
 *        GUE-conditional E_coll.
 *   (F2) THE ELASTICITY MATCHES THE ANALYTIC LEADING TERM. At the crossover
 *        E_coll ~ E_trunc + E_flow ~ E_trunc (E_flow is ~1e-8 here), so
 *        C_C sqrt(L/N) ~ E_trunc gives log10 N ~ const - 2 log10 E_trunc, i.e.
 *        d(log10 N*)/d(log E_trunc) ~ -2/ln 10 = -0.8686. The measured -0.911
 *        exceeds this by ~5 percent from the slowly-growing L = log T0 factor.
 *   (F3) THE KNEE TRACKS THE CROSSOVER RIGIDLY. The knee elasticity (~-0.9115)
 *        equals the crossover elasticity (~-0.9113) to three figures, so the
 *        knee-minus-crossover gap (~0.01482 in log10, knee above the crossover)
 *        is PRESERVED across the whole 0.5x .. 2x band (range 0.01471 .. 0.01483).
 *        The imp-96388 knee/crossover coincidence is an E_trunc-independent
 *        property of the component model, even though its ABSOLUTE height is not.
 *   (F4) AT 2x THE KNEE LEAVES THE WINDOW. At E_trunc = 6.12e-5 the crossover
 *        falls to log10 N ~ 8.88, below the [1e9,1e12] knee grid, so the D2
 *        zero-crossing is not resolved on the fixed window (kneeSignChanges 0):
 *        the tenth-decade knee is only observable while E_trunc stays under
 *        ~5e-5 for this window.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature/sensitivity diagnostic,
 * NOT an RH bound. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; C_H isRigorousUpperBound stays false (imp-2642/imp-2701); changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 *
 * @see imp-96427-knee-crossover-solver-path-spread (solver-path spread of the same landmarks, ~1e-13 noise)
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (baseline knee at log10 N* ~ 9.529)
 * @see imp-96388-sigma-peak-vs-knee-cross-tabulation (knee sits ~0.015 log10 above the crossover)
 * @see imp-96404-sigma-knee-plus78-count-model-shift (inter-count-model shift of the same landmarks)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Newton main-term inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-96351/imp-96427 exactly

const IMP96351_KNEE_LOG10 = 9.529;
const ANALYTIC_CROSS_ELASTICITY = -2 / Math.log(10); // -0.868589: E_coll ~ E_trunc leading term

// sigma(N) with a PLUGGABLE truncation floor (only E_trunc varies across runs).
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

// OLS local decay exponent, identical estimator to imp-96351/imp-96427.
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

// Tenth-decade D2 zero-crossing (knee), identical to imp-96351/imp-96427 kneeOnGrid.
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

// Log-symmetric perturbation band about E_trunc = 3.06e-5.
const FACTORS = [0.5, Math.SQRT1_2, 0.9, 1.0, 1.1, Math.SQRT2, 2.0];
const LO_D = 9.0;
const HI_D = 12.0;
const W_PRIMARY = 0.1;
const PPD_PRIMARY = 100;

const ROWS = FACTORS.map((f) => {
  const Et = E_TRUNC_PT * f;
  const sigma = makeSigma(Et);
  const knee = kneeOnGrid(sigma, LO_D, HI_D, W_PRIMARY, PPD_PRIMARY);
  const cross = crossoverLog10(sigma, 6.0, 12.0);
  return {
    factor: f,
    eTrunc: Et,
    kneeSignChanges: knee.signChanges,
    kneeLog10Nstar: knee.cstar,
    crossoverLog10N: cross,
    gapLog10: knee.cstar === null ? null : knee.cstar - cross,
  };
});

// Anchor row and the two log-centred flank rows for the finite-difference elasticity.
const BASE = ROWS.find((r) => r.factor === 1.0);
const FLANK_LO = ROWS.find((r) => Math.abs(r.factor - Math.SQRT1_2) < 1e-12);
const FLANK_HI = ROWS.find((r) => Math.abs(r.factor - Math.SQRT2) < 1e-12);
const D_LOG_ETRUNC = Math.log(FLANK_HI.eTrunc) - Math.log(FLANK_LO.eTrunc);
const KNEE_ELASTICITY = (FLANK_HI.kneeLog10Nstar - FLANK_LO.kneeLog10Nstar) / D_LOG_ETRUNC;
const CROSS_ELASTICITY = (FLANK_HI.crossoverLog10N - FLANK_LO.crossoverLog10N) / D_LOG_ETRUNC;

// Full-band 0.5x -> 2x crossover shift (the knee is off-window at 2x, so quote the crossover).
const F05 = ROWS.find((r) => r.factor === 0.5);
const F2 = ROWS.find((r) => r.factor === 2.0);
const CROSS_SHIFT_HALF_TO_DOUBLE = F2.crossoverLog10N - F05.crossoverLog10N;

// Gap preservation across the rows where the knee is resolved.
const RESOLVED_GAPS = ROWS.filter((r) => r.gapLog10 !== null).map((r) => r.gapLog10);
const GAP_MIN = Math.min(...RESOLVED_GAPS);
const GAP_MAX = Math.max(...RESOLVED_GAPS);
const GAP_SPAN = GAP_MAX - GAP_MIN;

export const IMP96451_SIGMA_KNEE_ETRUNC_SENSITIVITY = Object.freeze({
  id: 'imp-96451',
  proofSection: 'S-frontier',
  question:
    'How far do the imp-96427/imp-96351 tenth-decade sigma-knee (log10 N* ~ 9.529) and the sigma = 1/2 ' +
    'crossover move when the N-independent truncation floor E_trunc = 3.06e-5 -- the one non-GUE-conditional ' +
    'term -- is perturbed over a plausible band, and what are the elasticities d(log10 N*)/d(log E_trunc)? ' +
    'Curvature/sensitivity diagnostic only; measurement/fit; NOT an RH bound; NO QED.',
  measuredQuantity:
    'tenth-decade knee (D2 zero-crossing across [1e9,1e12]) and sigma = 1/2 crossover as functions of a ' +
    'log-symmetric 0.5x..2x perturbation of E_trunc about 3.06e-5, with the anchor elasticities ' +
    'd(log10 N*)/d(log E_trunc) and the knee-minus-crossover gap across the band',
  eTruncAnchor: E_TRUNC_PT,
  window: '[1e9,1e12]',
  primaryWidthDecades: W_PRIMARY,
  primaryPtsPerDecade: PPD_PRIMARY,
  imp96351KneeLog10: IMP96351_KNEE_LOG10,
  perturbationFactors: FACTORS,
  rows: ROWS.map((r) => ({
    factor: +r.factor.toFixed(6),
    eTrunc: +r.eTrunc.toExponential(4),
    kneeSignChanges: r.kneeSignChanges,
    kneeLog10Nstar: r.kneeLog10Nstar === null ? null : +r.kneeLog10Nstar.toFixed(9),
    crossoverLog10N: +r.crossoverLog10N.toFixed(9),
    gapLog10: r.gapLog10 === null ? null : +r.gapLog10.toFixed(6),
  })),
  kneeElasticity: +KNEE_ELASTICITY.toFixed(6),
  crossoverElasticity: +CROSS_ELASTICITY.toFixed(6),
  analyticCrossElasticity: +ANALYTIC_CROSS_ELASTICITY.toFixed(6),
  dLogEtruncSpan: +D_LOG_ETRUNC.toFixed(6),
  crossShiftHalfToDouble: +CROSS_SHIFT_HALF_TO_DOUBLE.toFixed(6),
  gapMin: +GAP_MIN.toFixed(6),
  gapMax: +GAP_MAX.toFixed(6),
  gapSpan: +GAP_SPAN.toExponential(3),
  baseGapLog10: +BASE.gapLog10.toFixed(6),
  finding: {
    F1_knee_and_crossover_are_materially_sensitive:
      'Both landmarks move with elasticity d(log10 N*)/d(log E_trunc) ~ ' + KNEE_ELASTICITY.toFixed(4) +
      ' (knee) and ' + CROSS_ELASTICITY.toFixed(4) + ' (crossover): a factor-2 rise in E_trunc drags the ' +
      'crossover DOWN by ~' + Math.abs(CROSS_SHIFT_HALF_TO_DOUBLE / 2).toFixed(3) + ' in log10 N per doubling. ' +
      'Unlike the ~1e-13 solver-path noise of imp-96427, the landmark location is set to leading order by ' +
      'the rigorous truncation floor, NOT by the GUE-conditional E_coll.',
    F2_elasticity_matches_analytic_leading_term:
      'At the crossover E_coll ~ E_trunc + E_flow ~ E_trunc, so C_C sqrt(L/N) ~ E_trunc gives ' +
      'log10 N ~ const - 2 log10 E_trunc, i.e. d(log10 N*)/d(log E_trunc) ~ -2/ln10 = ' +
      ANALYTIC_CROSS_ELASTICITY.toFixed(4) + '. The measured ' + CROSS_ELASTICITY.toFixed(4) +
      ' exceeds this by ~5 percent from the slowly-growing L = log T0 factor.',
    F3_knee_tracks_crossover_gap_preserved:
      'The knee elasticity (' + KNEE_ELASTICITY.toFixed(4) + ') equals the crossover elasticity (' +
      CROSS_ELASTICITY.toFixed(4) + ') to three figures, so the knee-minus-crossover gap (~' +
      BASE.gapLog10.toFixed(5) + ' log10, knee above the crossover) is PRESERVED across the whole band ' +
      '(range ' + GAP_MIN.toFixed(5) + '..' + GAP_MAX.toFixed(5) + ', span ~' + GAP_SPAN.toExponential(1) +
      '). The imp-96388 coincidence is E_trunc-independent even though its absolute height is not.',
    F4_knee_leaves_window_at_double:
      'At E_trunc = ' + F2.eTrunc.toExponential(2) + ' (2x) the crossover falls to log10 N ~ ' +
      F2.crossoverLog10N.toFixed(2) + ', below the [1e9,1e12] knee grid, so the D2 zero-crossing is not ' +
      'resolved (kneeSignChanges ' + F2.kneeSignChanges + '): the tenth-decade knee is only observable ' +
      'while E_trunc stays under ~5e-5 for this window.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Perturbing the N-independent truncation floor ' +
    'E_trunc over 0.5x..2x about 3.06e-5 moves BOTH the tenth-decade knee and the sigma = 1/2 crossover ' +
    'with elasticity d(log10 N*)/d(log E_trunc) ~ ' + CROSS_ELASTICITY.toFixed(3) + ', close to the analytic ' +
    'leading term -2/ln10 = ' + ANALYTIC_CROSS_ELASTICITY.toFixed(3) + ' (E_coll ~ E_trunc at the crossover): ' +
    'a factor-2 change in E_trunc shifts the landmarks by ~0.63 in log10 N*. This is FAR from the ~1e-13 ' +
    'solver-path noise of imp-96427 -- the rigorous floor sets the landmark location to leading order, not ' +
    'the GUE-conditional E_coll. The knee tracks the crossover rigidly (elasticities equal to three figures), ' +
    'so the ~' + BASE.gapLog10.toFixed(5) + ' log10 knee-minus-crossover gap (imp-96388) survives the whole band ' +
    '(span ~' + GAP_SPAN.toExponential(1) + '); at 2x the crossover drops below the window and the knee is no ' +
    'longer resolved. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_H isRigorousUpperBound stays false ' +
    '(imp-2642/imp-2701); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96427 (solver-path knee/crossover spread ~1e-13, same component model); imp-96351 (baseline knee ' +
    'at log10 N* ~ 9.529); imp-96388 (knee ~0.015 log10 above the E_coll = E_trunc crossover); imp-96404 ' +
    '(inter-count-model +7/8 knee shift ~1.3e-10); imp-486 (C_mb GUE-conditional); imp-2631/imp-3406 ' +
    '(E_trunc = 3.06e-5 fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN, Newton inverse).',
});

export default IMP96451_SIGMA_KNEE_ETRUNC_SENSITIVITY;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96451_ASSERTIONS = [
  {
    id: 'imp96451-anchor-knee-reproduces-imp96351',
    description: 'the unperturbed (f=1) knee reproduces the imp-96351 baseline knee at log10 N* ~ 9.529',
    holds: () =>
      BASE.kneeSignChanges === 1 &&
      BASE.kneeLog10Nstar !== null &&
      Math.abs(BASE.kneeLog10Nstar - IMP96351_KNEE_LOG10) < 0.005,
  },
  {
    id: 'imp96451-landmarks-are-materially-sensitive',
    description: 'both knee and crossover elasticities are O(1) negative -- materially sensitive to E_trunc, not noise',
    holds: () =>
      KNEE_ELASTICITY < -0.7 &&
      KNEE_ELASTICITY > -1.1 &&
      CROSS_ELASTICITY < -0.7 &&
      CROSS_ELASTICITY > -1.1,
  },
  {
    id: 'imp96451-elasticity-near-analytic-leading-term',
    description: 'the crossover elasticity sits within ~10 percent of the analytic -2/ln10 leading term',
    holds: () => Math.abs(CROSS_ELASTICITY - ANALYTIC_CROSS_ELASTICITY) < 0.1,
  },
  {
    id: 'imp96451-knee-tracks-crossover',
    description: 'the knee and crossover elasticities coincide to three figures (knee tracks crossover)',
    holds: () => Math.abs(KNEE_ELASTICITY - CROSS_ELASTICITY) < 1e-3,
  },
  {
    id: 'imp96451-gap-preserved-across-band',
    description: 'the knee-minus-crossover gap is preserved (span < 5e-4) with the knee above the crossover',
    holds: () => GAP_SPAN < 5e-4 && GAP_MIN > 0,
  },
  {
    id: 'imp96451-knee-off-window-at-double',
    description: 'at 2x E_trunc the crossover drops below the window and the tenth-decade knee is not resolved',
    holds: () => F2.kneeSignChanges === 0 && F2.crossoverLog10N < LO_D,
  },
  {
    id: 'imp96451-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP96451_SIGMA_KNEE_ETRUNC_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP96451_SIGMA_KNEE_ETRUNC_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP96451_SIGMA_KNEE_ETRUNC_SENSITIVITY.verdict),
  },
];

for (const a of IMP96451_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96451-sigma-knee-etrunc-sensitivity assertion failed: ${a.id}`);
  }
}
