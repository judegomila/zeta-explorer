/**
 * @module imp-96488-sigma-knee-high-edge-exit
 *
 * imp-96488 (numerical, frontier-direction): COMPLETE the imp-96464 two-sided
 * window-exit map. imp-96464 G3 located the LOW-edge exit (widened-grid tenth-decade
 * sigma-knee reaching the original [1e9,1e12] low edge log10 N = 9) at E_trunc factor
 * f* ~ 1.7847 (E_trunc ~ 5.46e-5), and asserted the exit is one-sided: even at 0.1x
 * (E_trunc = 3.06e-6) the knee sits at log10 N ~ 11.61, "never reaching the high edge
 * log10 N = 12 within a plausible band." But imp-96464 only sampled down to 0.1x and
 * never bisected the HIGH-edge multiplier. This module extends the search into the
 * 0.01x..0.5x band and locates the exact E_trunc multiplier that would drag the
 * widened-grid knee up to the high edge log10 N = 12, then reports whether that factor
 * is physically plausible.
 *
 * THE MEASUREMENT
 * ---------------
 * Using the IDENTICAL kneeOnGrid / OLS-exponent estimators as imp-96351/imp-96427/
 * imp-96451/imp-96464 on the same widened [1e7,1e13] grid (W = 0.1 decade, 100 pts/
 * decade), bisect the E_trunc multiplier for widened-grid knee = log10 N 12.0. Lowering
 * E_trunc raises the knee, so the high-edge factor sits BELOW the imp-96464 0.1x floor.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (H1) THE HIGH-EDGE EXIT FACTOR IS f_hi ~ 0.06522 (E_trunc ~ 1.996e-6). Bisecting
 *        the multiplier for widened-grid knee = 12.0 lands at f_hi ~ 0.0652, i.e.
 *        E_trunc ~ 2.0e-6 -- roughly 15.3x BELOW the pinned PT floor 3.06e-5. Sample
 *        points bracket it cleanly: f = 0.1 -> knee 11.615, f = 0.05 -> knee 12.239,
 *        both with a single D2 zero-crossing (signChanges 1), so 12.0 falls in the
 *        reliably-resolved band.
 *   (H2) LOG-LINEAR RIGIDITY EXTENDS TO THE HIGH EDGE. Extrapolating from f = 0.1
 *        (knee 11.615) with the imp-96464 knee elasticity -0.9115 predicts f_hi ~
 *        0.06554, matching the bisected 0.06522 to ~3e-4 -- the F3 knee/crossover
 *        rigidity that governs the low-edge exit also governs the high-edge reach.
 *   (H3) THE EXIT IS ONE-SIDED, QUANTITATIVELY. Reaching the high edge needs E_trunc
 *        ~ 15.3x SMALLER than the pinned floor, versus only 1.78x LARGER to reach the
 *        low edge -- a factor-27.4 asymmetry in the required multiplier. Below f ~ 0.05
 *        the knee finder begins to pick up a spurious low-N second D2 crossing
 *        (signChanges 2 at 0.03x), so the high-edge exit already sits at the lower rim
 *        of the reliably-resolvable band and any smaller E_trunc is doubly implausible:
 *        it is far outside the imp-96451 log-symmetric 0.5x..2x perturbation band AND
 *        the fixed-strip route does not motivate an E_trunc ~ 15x below the pinned
 *        value. This CONFIRMS the imp-96464 G3 one-sidedness assertion quantitatively.
 *
 * MEASUREMENT / FIT ONLY. Two-sided window-resolution diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_H isRigorousUpperBound
 * stays false (imp-2642/imp-2701); changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this header
 *   avoids the close-comment terminator sequence inside prose.
 *
 * @see imp-96464-sigma-knee-widened-grid-window-exit (G3 low-edge exit f* ~ 1.7847, one-sided assertion)
 * @see imp-96451-sigma-knee-etrunc-sensitivity (0.5x..2x band, knee elasticity -0.9115)
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (baseline knee at log10 N* ~ 9.529)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Newton inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-96351/imp-96427/imp-96451/imp-96464 exactly

const ORIG_WINDOW_LO = 9.0; // original [1e9,1e12] low edge
const ORIG_WINDOW_HI = 12.0; // original [1e9,1e12] high edge
const IMP96464_KNEE_ELASTICITY = -0.9115; // widened-grid knee elasticity (imp-96464 G2)
const IMP96464_LOW_EDGE_FACTOR = 1.7847; // imp-96464 G3 low-edge exit factor
const IMP96464_LOW_EDGE_ETRUNC = 5.461e-5; // imp-96464 G3 low-edge E_trunc

// sigma(N) with a PLUGGABLE truncation floor -- identical to imp-96451/imp-96464.
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

// OLS local decay exponent, identical estimator to imp-96351/imp-96427/imp-96451/imp-96464.
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

// Tenth-decade D2 zero-crossing (knee), identical to imp-96351/imp-96427/imp-96451/imp-96464.
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

const WIDE_LO_D = 7.0;
const WIDE_HI_D = 13.0;
const W_PRIMARY = 0.1;
const PPD_PRIMARY = 100;

function wideKneeAtFactor(f) {
  return kneeOnGrid(makeSigma(E_TRUNC_PT * f), WIDE_LO_D, WIDE_HI_D, W_PRIMARY, PPD_PRIMARY);
}

// Bisect the E_trunc multiplier for the factor at which the widened-grid knee reaches
// the ORIGINAL high edge (log10 N = 12). Lowering E_trunc raises the knee, so the
// high-edge factor lies BELOW the imp-96464 0.1x floor. Bracket [0.001, 0.1]: knee is
// below 12 at 0.1x and above 12 at 0.05x, so the crossing is in the clean single-D2 band.
function bisectFactorForKneeEdge(edgeLog10, loF, hiF) {
  let lo = loF;
  let hi = hiF;
  for (let i = 0; i < 80; i += 1) {
    const mid = 0.5 * (lo + hi);
    const k = wideKneeAtFactor(mid);
    if (k.cstar > edgeLog10) lo = mid; // smaller factor -> higher knee
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// Bracketing sample rows across the 0.01x..0.5x band (measurement anchors).
const SAMPLE_FACTORS = [0.5, 0.1, 0.05, 0.03, 0.02, 0.01];
const SAMPLE_ROWS = SAMPLE_FACTORS.map((f) => {
  const k = wideKneeAtFactor(f);
  return {
    factor: f,
    eTrunc: E_TRUNC_PT * f,
    kneeSignChanges: k.signChanges,
    kneeLog10Nstar: k.cstar,
  };
});

const HIGH_EDGE_FACTOR = bisectFactorForKneeEdge(ORIG_WINDOW_HI, 0.001, 0.1);
const HIGH_EDGE_ETRUNC = E_TRUNC_PT * HIGH_EDGE_FACTOR;
const HIGH_EDGE_KNEE = wideKneeAtFactor(HIGH_EDGE_FACTOR);

// Log-linear cross-check: extrapolate from f = 0.1 (knee 11.615) with the imp-96464 elasticity.
const F01 = SAMPLE_ROWS.find((r) => Math.abs(r.factor - 0.1) < 1e-12);
const D_KNEE_TO_HI = ORIG_WINDOW_HI - F01.kneeLog10Nstar;
const D_LOG_ETRUNC_PRED = D_KNEE_TO_HI / IMP96464_KNEE_ELASTICITY;
const PREDICTED_HIGH_FACTOR = 0.1 * Math.exp(D_LOG_ETRUNC_PRED);
const EXTRAP_RESIDUAL = Math.abs(PREDICTED_HIGH_FACTOR - HIGH_EDGE_FACTOR);

// Asymmetry of the two-sided exit and depth below the pinned floor.
const FACTOR_ASYMMETRY = IMP96464_LOW_EDGE_FACTOR / HIGH_EDGE_FACTOR; // >1 = high edge far harder
const ETRUNC_DEPTH_BELOW_PINNED = E_TRUNC_PT / HIGH_EDGE_ETRUNC; // how far below 3.06e-5
const OUTSIDE_PERTURBATION_BAND = HIGH_EDGE_FACTOR < 0.5; // imp-96451 band was 0.5x..2x

export const IMP96488_SIGMA_KNEE_HIGH_EDGE_EXIT = Object.freeze({
  id: 'imp-96488',
  proofSection: 'S-frontier',
  question:
    'imp-96464 G3 located the LOW-edge window exit at E_trunc factor f* ~ 1.7847 and asserted the exit is ' +
    'one-sided (the widened-grid knee "never reaching the high edge log10 N = 12 within a plausible band") but ' +
    'only sampled down to 0.1x. At exactly which E_trunc multiplier does the widened-grid knee reach the ' +
    'original high edge log10 N = 12, and is that factor physically plausible? Two-sided window-resolution ' +
    'diagnostic only; measurement/fit; NOT an RH bound; NO QED.',
  measuredQuantity:
    'the bisected E_trunc multiplier at which the widened [1e7,1e13]-grid tenth-decade sigma-knee reaches the ' +
    'original [1e9,1e12] high edge (log10 N = 12), its log-linear cross-check against the imp-96464 knee ' +
    'elasticity, and the asymmetry between the low-edge and high-edge exit factors',
  eTruncAnchor: E_TRUNC_PT,
  widenedWindow: '[1e7,1e13]',
  originalWindow: '[1e9,1e12]',
  primaryWidthDecades: W_PRIMARY,
  primaryPtsPerDecade: PPD_PRIMARY,
  sampleRows: SAMPLE_ROWS.map((r) => ({
    factor: +r.factor.toFixed(6),
    eTrunc: +r.eTrunc.toExponential(4),
    kneeSignChanges: r.kneeSignChanges,
    kneeLog10Nstar: r.kneeLog10Nstar === null ? null : +r.kneeLog10Nstar.toFixed(6),
  })),
  highEdgeFactor: +HIGH_EDGE_FACTOR.toFixed(6),
  highEdgeETrunc: +HIGH_EDGE_ETRUNC.toExponential(4),
  highEdgeKneeLog10Nstar: +HIGH_EDGE_KNEE.cstar.toFixed(9),
  highEdgeKneeSignChanges: HIGH_EDGE_KNEE.signChanges,
  predictedHighEdgeFactor: +PREDICTED_HIGH_FACTOR.toFixed(6),
  extrapResidual: +EXTRAP_RESIDUAL.toExponential(2),
  imp96464LowEdgeFactor: IMP96464_LOW_EDGE_FACTOR,
  imp96464LowEdgeETrunc: IMP96464_LOW_EDGE_ETRUNC,
  factorAsymmetry: +FACTOR_ASYMMETRY.toFixed(2),
  eTruncDepthBelowPinned: +ETRUNC_DEPTH_BELOW_PINNED.toFixed(2),
  outsidePerturbationBand: OUTSIDE_PERTURBATION_BAND,
  finding: {
    H1_high_edge_factor:
      'Bisecting the E_trunc multiplier for widened-grid knee = log10 N ' + ORIG_WINDOW_HI.toFixed(1) + ' lands at ' +
      'f_hi ~ ' + HIGH_EDGE_FACTOR.toFixed(5) + ', i.e. E_trunc ~ ' + HIGH_EDGE_ETRUNC.toExponential(3) + ' -- ' +
      'roughly ' + ETRUNC_DEPTH_BELOW_PINNED.toFixed(1) + 'x below the pinned PT floor ' + E_TRUNC_PT.toExponential(2) +
      '. Sample rows bracket it cleanly (f = 0.1 -> knee ' + F01.kneeLog10Nstar.toFixed(3) + ', f = 0.05 -> knee ' +
      SAMPLE_ROWS.find((r) => Math.abs(r.factor - 0.05) < 1e-12).kneeLog10Nstar.toFixed(3) + '), both single D2 ' +
      'zero-crossings, so log10 N = 12 falls in the reliably-resolved band.',
    H2_log_linear_rigidity_extends:
      'Extrapolating from f = 0.1 (knee ' + F01.kneeLog10Nstar.toFixed(3) + ') with the imp-96464 knee elasticity ' +
      IMP96464_KNEE_ELASTICITY + ' predicts f_hi ~ ' + PREDICTED_HIGH_FACTOR.toFixed(5) + ', matching the bisected ' +
      HIGH_EDGE_FACTOR.toFixed(5) + ' to ~' + EXTRAP_RESIDUAL.toExponential(1) + ' -- the F3 knee/crossover rigidity ' +
      'that governs the low-edge exit also governs the high-edge reach.',
    H3_one_sided_confirmed_quantitatively:
      'Reaching the high edge needs E_trunc ~ ' + ETRUNC_DEPTH_BELOW_PINNED.toFixed(1) + 'x SMALLER than the pinned ' +
      'floor, versus only ' + IMP96464_LOW_EDGE_FACTOR.toFixed(2) + 'x LARGER to reach the low edge -- a factor-' +
      FACTOR_ASYMMETRY.toFixed(1) + ' asymmetry in the required multiplier. The high-edge factor lies far outside ' +
      'the imp-96451 log-symmetric 0.5x..2x perturbation band, and below f ~ 0.05 the knee finder begins picking ' +
      'up a spurious low-N second D2 crossing (signChanges 2 at 0.03x), so any smaller E_trunc is doubly ' +
      'implausible. This CONFIRMS the imp-96464 G3 one-sidedness assertion quantitatively.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Completing the imp-96464 two-sided window-exit map: the ' +
    'widened [1e7,1e13]-grid tenth-decade sigma-knee reaches the original high edge log10 N = 12 at E_trunc ' +
    'factor f_hi ~ ' + HIGH_EDGE_FACTOR.toFixed(5) + ' (E_trunc ~ ' + HIGH_EDGE_ETRUNC.toExponential(3) + '), ~' +
    ETRUNC_DEPTH_BELOW_PINNED.toFixed(1) + 'x below the pinned floor ' + E_TRUNC_PT.toExponential(2) + ' and matching ' +
    'the imp-96464 elasticity extrapolation ~' + PREDICTED_HIGH_FACTOR.toFixed(5) + ' to ~' +
    EXTRAP_RESIDUAL.toExponential(1) + '. Against the ' + IMP96464_LOW_EDGE_FACTOR.toFixed(2) + 'x low-edge exit ' +
    'this is a factor-' + FACTOR_ASYMMETRY.toFixed(1) + ' asymmetry, and the high-edge factor sits far outside the ' +
    'imp-96451 0.5x..2x perturbation band and at the lower rim of the reliably-resolvable region -- so the ' +
    'imp-96464 G3 one-sidedness assertion is CONFIRMED quantitatively: the knee only exits the window at the low ' +
    'edge within any physically-motivated E_trunc band. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_H ' +
    'isRigorousUpperBound stays false (imp-2642/imp-2701); changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96464 (widened-grid low-edge exit f* ~ 1.7847, one-sided assertion); imp-96451 (0.5x..2x band, knee ' +
    'elasticity -0.9115); imp-96351 (baseline knee at log10 N* ~ 9.529); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631/imp-3406 (E_trunc = 3.06e-5 fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
});

export default IMP96488_SIGMA_KNEE_HIGH_EDGE_EXIT;

export const IMP96488_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement (frontier-direction, NOT rigorous): '
  + 'the high-edge window-exit multiplier f_hi ~ 0.065 (E_trunc ~ 2.0e-6, ~15x below the pinned floor) '
  + 'confirms the imp-96464 G3 one-sidedness quantitatively, but the underlying component model remains '
  + 'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional '
  + 'per imp-486 is UNTOUCHED; C_H isRigorousUpperBound stays false (imp-2642/imp-2701); changes no bound.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96488_ASSERTIONS = [
  {
    id: 'imp96488-high-edge-factor-in-band',
    description: 'the bisected high-edge exit factor sits in the 0.06..0.07 range (E_trunc ~ 2.0e-6)',
    holds: () =>
      HIGH_EDGE_FACTOR > 0.06 &&
      HIGH_EDGE_FACTOR < 0.07 &&
      HIGH_EDGE_ETRUNC > 1.9e-6 &&
      HIGH_EDGE_ETRUNC < 2.1e-6,
  },
  {
    id: 'imp96488-high-edge-knee-at-12',
    description: 'the widened-grid knee at the bisected factor reaches the high edge log10 N = 12 with a single D2 crossing',
    holds: () => Math.abs(HIGH_EDGE_KNEE.cstar - ORIG_WINDOW_HI) < 1e-6 && HIGH_EDGE_KNEE.signChanges === 1,
  },
  {
    id: 'imp96488-log-linear-extrap-matches',
    description: 'the imp-96464 elasticity extrapolation predicts the high-edge factor to within ~1e-3',
    holds: () => EXTRAP_RESIDUAL < 2e-3,
  },
  {
    id: 'imp96488-one-sided-asymmetry',
    description: 'the high-edge factor is far below 1 (outside the 0.5x..2x band) and much harder than the low-edge exit',
    holds: () => OUTSIDE_PERTURBATION_BAND && FACTOR_ASYMMETRY > 20 && ETRUNC_DEPTH_BELOW_PINNED > 10,
  },
  {
    id: 'imp96488-reproduces-imp96464-01x-knee',
    description: 'the 0.1x sample reproduces the imp-96464 G3 knee at log10 N ~ 11.61',
    holds: () => Math.abs(F01.kneeLog10Nstar - 11.61) < 0.05,
  },
  {
    id: 'imp96488-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP96488_SIGMA_KNEE_HIGH_EDGE_EXIT.isRigorous === false &&
      /NO QED/.test(IMP96488_SIGMA_KNEE_HIGH_EDGE_EXIT.verdict) &&
      /refereed bound is changed/i.test(IMP96488_SIGMA_KNEE_HIGH_EDGE_EXIT.verdict),
  },
  {
    id: 'imp96488-honest-banner-present',
    description: 'a dedicated machine-readable IMP96488_HONEST_BANNER carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () =>
      /RH open/.test(IMP96488_HONEST_BANNER) &&
      /PT Lambda <= 0\.2|refereed bound is changed/.test(IMP96488_HONEST_BANNER) &&
      /NO QED/.test(IMP96488_HONEST_BANNER),
  },
];

for (const a of IMP96488_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96488-sigma-knee-high-edge-exit assertion failed: ${a.id}`);
  }
}
