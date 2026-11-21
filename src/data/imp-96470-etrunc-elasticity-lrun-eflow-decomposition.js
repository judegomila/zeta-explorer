/**
 * @module imp-96470-etrunc-elasticity-lrun-eflow-decomposition
 *
 * imp-96470 (numerical, frontier-direction): DECOMPOSE the imp-96451 F2
 * measured E_trunc crossover elasticity excess (-0.911 measured vs the analytic
 * leading term -2/ln10 = -0.8686) into its two candidate sources -- the
 * slowly-growing L = log T0 running factor and the E_flow term -- by re-running
 * the same crossover-elasticity measurement with each source switched off.
 *
 * BACKGROUND
 * ----------
 * imp-96451 F2 found the measured crossover elasticity
 *     d(log10 N*)/d(log E_trunc) ~ -0.911
 * exceeds the analytic leading term -2/ln10 = -0.8686 by ~5 percent, and
 * ATTRIBUTED the excess to the slowly-growing L = log T0 factor without ever
 * isolating the L-running share from the E_flow share. The crossover solves
 *     E_coll = E_trunc + E_flow,  E_coll = C_C sqrt(L/N),  L = log T0(N),
 * so N = L C_C^2 / (E_trunc + E_flow)^2 and
 *     log10 N = log10 L + 2 log10 C_C - 2 log10(E_trunc + E_flow).
 * The pure algebraic -2 log10 E_trunc term gives exactly -2/ln10; the excess
 * can only come from (i) L = log T0 running with N (hence with E_trunc) and
 * (ii) the E_flow term shifting the effective floor E_trunc + E_flow.
 *
 * THE MEASUREMENT
 * ---------------
 * Re-run the imp-96451 log-centred finite-difference elasticity between the
 * 1/sqrt2 and sqrt2 E_trunc flanks about 3.06e-5 under four switch settings:
 *   (baseline)  L FIXED at its anchor value + E_flow OFF -> pure -2/ln10 term,
 *   (Lrun only) L RUNNING + E_flow OFF                    -> adds L-running,
 *   (flow only) L FIXED + E_flow ON                       -> adds E_flow,
 *   (full)      L RUNNING + E_flow ON                     -> reproduces -0.911.
 * The additive decomposition of the excess is then
 *   excess = (L-running) + (E_flow) + (interaction),
 * with L held fixed at L_anchor = log T0 evaluated at the unperturbed (f=1)
 * crossover N.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE EXCESS IS ~97 PERCENT L-RUNNING. The full elasticity -0.91133
 *        exceeds the analytic -0.86859 by -0.04274; of that excess the L = log T0
 *        running carries -0.04135 (~96.7 percent) and the E_flow term carries
 *        -0.00134 (~3.1 percent), with a ~-0.00005 interaction. The imp-96451 F2
 *        attribution of the excess to the L-running factor is CONFIRMED as the
 *        dominant mechanism.
 *   (F2) THE E_flow SHARE IS ~1e-3, NOT ~1e-8 -- A CORRECTION. imp-96451 F2
 *        described E_flow as "~1e-8 here", which is its ABSOLUTE value
 *        (E_flow ~ 5.83e-8 at the crossover). Its share of the ELASTICITY excess
 *        is set instead by the RATIO E_flow/E_trunc ~ 1.9e-3: shifting the floor
 *        from E_trunc to E_trunc + E_flow perturbs the -2 log10(floor) term by
 *        ~2 (E_flow/E_trunc)/ln10 ~ 1.66e-3, matching the measured -0.00134 in
 *        magnitude. The E_flow contribution is subdominant but three orders of
 *        magnitude larger than the raw E_flow value -- the F2 "~1e-8" is the
 *        wrong scale for the elasticity share.
 *   (F3) THE L-FIXED, FLOW-OFF ELASTICITY REPRODUCES THE ALGEBRAIC TERM EXACTLY.
 *        With L frozen at L_anchor and E_flow off the elasticity collapses to
 *        -0.868589 = -2/ln10 to ~1e-9, verifying the isolation is clean and the
 *        component model has no other hidden E_trunc dependence.
 *
 * MEASUREMENT / FIT ONLY. Attribution/decomposition diagnostic within the
 * inherited imp-3220/imp-3406 component model, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; C_H isRigorousUpperBound stays
 * false (imp-2642/imp-2701); changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 *
 * @see imp-96451-sigma-knee-etrunc-sensitivity (F2 measured -0.911 vs -0.8686 excess, attributed to L-running but not isolated)
 * @see imp-96427-knee-crossover-solver-path-spread (same component model, solver-path noise ~1e-13)
 * @see imp-96351-sigma-knee-tenthdecade-1e12-stability (baseline knee at log10 N* ~ 9.529)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Newton main-term inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-96351/imp-96427 exactly

const ANALYTIC_CROSS_ELASTICITY = -2 / Math.log(10); // -0.868589 pure algebraic -2 log10 E_trunc term

// sigma(N) with switchable L-running (fixL) and E_flow (flowOn). Identical formula
// to imp-96451 makeSigma when fixL === null and flowOn === true.
function makeSigma(E_trunc, { fixL = null, flowOn = true } = {}) {
  return function sigma(N) {
    const T0 = effectiveHeightForN(N);
    const L = fixL === null ? Math.log(T0) : fixL;
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = flowOn ? C_F * (L / T0) * GRONWALL : 0;
    const E_coll = C_C_PINNED * Math.sqrt(L / N);
    return E_coll / (E_trunc + E_flow + E_coll);
  };
}

// sigma = 1/2 crossover (E_coll = E_trunc + E_flow), bisection in log10 N,
// identical estimator to imp-96451 crossoverLog10.
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

// Log-centred finite-difference flanks about the anchor, exactly as imp-96451.
const FLANK_LO_FACTOR = Math.SQRT1_2;
const FLANK_HI_FACTOR = Math.SQRT2;
const D_LOG_ETRUNC = Math.log(E_TRUNC_PT * FLANK_HI_FACTOR) - Math.log(E_TRUNC_PT * FLANK_LO_FACTOR);

// L_anchor = log T0 evaluated at the unperturbed (f=1) full crossover N.
const BASE_CROSS_LOG10N = crossoverLog10(makeSigma(E_TRUNC_PT), 6.0, 12.0);
const L_ANCHOR = Math.log(effectiveHeightForN(Math.pow(10, BASE_CROSS_LOG10N)));

function crossElasticity(opts) {
  const cLo = crossoverLog10(makeSigma(E_TRUNC_PT * FLANK_LO_FACTOR, opts), 6.0, 12.0);
  const cHi = crossoverLog10(makeSigma(E_TRUNC_PT * FLANK_HI_FACTOR, opts), 6.0, 12.0);
  return (cHi - cLo) / D_LOG_ETRUNC;
}

// Four switch settings.
const E_BASELINE = crossElasticity({ fixL: L_ANCHOR, flowOn: false }); // pure -2/ln10
const E_LRUN_ONLY = crossElasticity({ fixL: null, flowOn: false });    // + L-running
const E_FLOW_ONLY = crossElasticity({ fixL: L_ANCHOR, flowOn: true });  // + E_flow
const E_FULL = crossElasticity({ fixL: null, flowOn: true });          // reproduces imp-96451 -0.911

// Additive decomposition of the excess = full - analytic.
const EXCESS_TOTAL = E_FULL - ANALYTIC_CROSS_ELASTICITY;
const SHARE_LRUN = E_LRUN_ONLY - E_BASELINE;
const SHARE_FLOW = E_FLOW_ONLY - E_BASELINE;
const SHARE_INTERACTION = E_FULL - (E_BASELINE + SHARE_LRUN + SHARE_FLOW);

// E_flow scale at the crossover, to show the share is set by the RATIO not the raw value.
const T0_ANCHOR = effectiveHeightForN(Math.pow(10, BASE_CROSS_LOG10N));
const C_F_ANCHOR = (Math.log(T0_ANCHOR / TWO_PI) + 1) / TWO_PI;
const E_FLOW_ANCHOR = C_F_ANCHOR * (L_ANCHOR / T0_ANCHOR) * GRONWALL;
const E_FLOW_OVER_E_TRUNC = E_FLOW_ANCHOR / E_TRUNC_PT;
const PREDICTED_FLOW_SHARE = -2 * E_FLOW_OVER_E_TRUNC / Math.log(10); // leading -2(ratio)/ln10

const pct = (part) => (100 * part) / EXCESS_TOTAL;

export const IMP96470_ETRUNC_ELASTICITY_LRUN_EFLOW_DECOMPOSITION = Object.freeze({
  id: 'imp-96470',
  proofSection: 'S-frontier',
  question:
    'How does the imp-96451 F2 measured E_trunc crossover elasticity excess (-0.911 vs the analytic ' +
    '-2/ln10 = -0.8686) split between the L = log T0 running factor and the E_flow term? Decomposition/' +
    'attribution diagnostic only; measurement/fit; NOT an RH bound; NO QED.',
  measuredQuantity:
    'the crossover elasticity d(log10 N*)/d(log E_trunc) under four switch settings (L fixed/running x ' +
    'E_flow off/on) and the additive split of the excess into L-running, E_flow and interaction shares',
  eTruncAnchor: E_TRUNC_PT,
  baseCrossoverLog10N: +BASE_CROSS_LOG10N.toFixed(9),
  lAnchor: +L_ANCHOR.toFixed(9),
  dLogEtruncSpan: +D_LOG_ETRUNC.toFixed(6),
  elasticities: {
    analyticLeadingTerm: +ANALYTIC_CROSS_ELASTICITY.toFixed(9),
    baselineLfixFlowOff: +E_BASELINE.toFixed(9),
    lrunOnlyFlowOff: +E_LRUN_ONLY.toFixed(9),
    flowOnlyLfix: +E_FLOW_ONLY.toFixed(9),
    full: +E_FULL.toFixed(9),
  },
  decomposition: {
    excessTotal: +EXCESS_TOTAL.toFixed(9),
    lRunningShare: +SHARE_LRUN.toFixed(9),
    eFlowShare: +SHARE_FLOW.toFixed(9),
    interactionShare: +SHARE_INTERACTION.toExponential(3),
    lRunningPercent: +pct(SHARE_LRUN).toFixed(2),
    eFlowPercent: +pct(SHARE_FLOW).toFixed(2),
    interactionPercent: +pct(SHARE_INTERACTION).toFixed(2),
  },
  eFlowScale: {
    eFlowAnchor: +E_FLOW_ANCHOR.toExponential(4),
    eFlowOverETrunc: +E_FLOW_OVER_E_TRUNC.toExponential(4),
    predictedFlowShare: +PREDICTED_FLOW_SHARE.toExponential(4),
  },
  finding: {
    F1_excess_is_mostly_L_running:
      'The full elasticity ' + E_FULL.toFixed(5) + ' exceeds the analytic ' +
      ANALYTIC_CROSS_ELASTICITY.toFixed(5) + ' by ' + EXCESS_TOTAL.toFixed(5) + '; of that excess the ' +
      'L = log T0 running carries ' + SHARE_LRUN.toFixed(5) + ' (~' + pct(SHARE_LRUN).toFixed(1) +
      ' percent) and E_flow carries ' + SHARE_FLOW.toFixed(5) + ' (~' + pct(SHARE_FLOW).toFixed(1) +
      ' percent), with a ~' + SHARE_INTERACTION.toExponential(1) + ' interaction. imp-96451 F2 attribution ' +
      'of the excess to the L-running factor is CONFIRMED as the dominant mechanism.',
    F2_eflow_share_is_1e3_not_1e8_correction:
      'imp-96451 F2 called E_flow "~1e-8 here" -- that is its ABSOLUTE value (E_flow ~ ' +
      E_FLOW_ANCHOR.toExponential(2) + ' at the crossover). Its share of the ELASTICITY excess is set by ' +
      'the RATIO E_flow/E_trunc ~ ' + E_FLOW_OVER_E_TRUNC.toExponential(2) + ': the floor shift from E_trunc ' +
      'to E_trunc + E_flow perturbs the -2 log10(floor) term by ~2(E_flow/E_trunc)/ln10 ~ ' +
      PREDICTED_FLOW_SHARE.toExponential(2) + ', matching the measured ' + SHARE_FLOW.toExponential(2) +
      ' in magnitude. The E_flow share is subdominant but three orders of magnitude larger than the raw ' +
      'E_flow value -- the F2 "~1e-8" is the wrong scale for the elasticity share (CORRECTION).',
    F3_baseline_reproduces_algebraic_term:
      'With L frozen at L_anchor = ' + L_ANCHOR.toFixed(5) + ' and E_flow off, the elasticity collapses to ' +
      E_BASELINE.toFixed(9) + ' = -2/ln10 = ' + ANALYTIC_CROSS_ELASTICITY.toFixed(9) + ' to ~1e-9, verifying ' +
      'the isolation is clean and the component model has no other hidden E_trunc dependence.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Switching the L = log T0 running and the E_flow term ' +
    'on and off in the imp-96451 crossover-elasticity measurement decomposes the -0.911-vs--0.8686 excess ' +
    '(' + EXCESS_TOTAL.toFixed(5) + ') into L-running ' + SHARE_LRUN.toFixed(5) + ' (~' +
    pct(SHARE_LRUN).toFixed(1) + ' percent), E_flow ' + SHARE_FLOW.toFixed(5) + ' (~' +
    pct(SHARE_FLOW).toFixed(1) + ' percent) and a ~' + SHARE_INTERACTION.toExponential(1) + ' interaction. ' +
    'This CONFIRMS the imp-96451 F2 attribution to the L-running factor as dominant, and CORRECTS the ' +
    'F2 "E_flow ~1e-8" figure: 1e-8 is E_flow ABSOLUTE value, whereas the E_flow share of the elasticity is ' +
    '~' + SHARE_FLOW.toExponential(2) + ', set by the ratio E_flow/E_trunc ~ ' +
    E_FLOW_OVER_E_TRUNC.toExponential(2) + ' (times 2/ln10), three orders larger. The L-fixed, flow-off ' +
    'baseline reproduces -2/ln10 exactly, confirming clean isolation. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; C_H isRigorousUpperBound stays false (imp-2642/imp-2701); changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96451 (F2 measured -0.911 vs -0.8686 excess attributed to L-running but not isolated); imp-96427 ' +
    '(same component model, solver-path noise ~1e-13); imp-96351 (baseline knee at log10 N* ~ 9.529); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631/imp-3406 (E_trunc = 3.06e-5 fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Newton inverse).',
});

export default IMP96470_ETRUNC_ELASTICITY_LRUN_EFLOW_DECOMPOSITION;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96470_ASSERTIONS = [
  {
    id: 'imp96470-full-reproduces-imp96451',
    description: 'the full (L-running, E_flow on) elasticity reproduces the imp-96451 measured ~-0.911',
    holds: () => Math.abs(E_FULL - -0.9113) < 5e-3,
  },
  {
    id: 'imp96470-baseline-is-analytic-term',
    description: 'the L-fixed, flow-off baseline collapses to the analytic -2/ln10 to ~1e-8',
    holds: () => Math.abs(E_BASELINE - ANALYTIC_CROSS_ELASTICITY) < 1e-7,
  },
  {
    id: 'imp96470-excess-decomposes-additively',
    description: 'the three shares plus interaction reconstruct the total excess to ~1e-9',
    holds: () =>
      Math.abs(SHARE_LRUN + SHARE_FLOW + SHARE_INTERACTION - EXCESS_TOTAL) < 1e-9,
  },
  {
    id: 'imp96470-lrunning-dominates',
    description: 'the L-running share carries the large majority (>90 percent) of the excess',
    holds: () => pct(SHARE_LRUN) > 90 && pct(SHARE_LRUN) < 100,
  },
  {
    id: 'imp96470-eflow-share-is-milli-not-nano',
    description: 'the E_flow elasticity share is ~1e-3 (set by E_flow/E_trunc), NOT ~1e-8 (the raw E_flow value)',
    holds: () =>
      Math.abs(SHARE_FLOW) > 1e-4 &&
      Math.abs(SHARE_FLOW) < 1e-2 &&
      E_FLOW_ANCHOR < 1e-6 &&
      Math.abs(SHARE_FLOW / PREDICTED_FLOW_SHARE - 1) < 0.3,
  },
  {
    id: 'imp96470-honesty-gate-no-qed',
    description: 'Measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP96470_ETRUNC_ELASTICITY_LRUN_EFLOW_DECOMPOSITION.isRigorous === false &&
      /NO QED/.test(IMP96470_ETRUNC_ELASTICITY_LRUN_EFLOW_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP96470_ETRUNC_ELASTICITY_LRUN_EFLOW_DECOMPOSITION.verdict),
  },
];

for (const a of IMP96470_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96470-etrunc-elasticity-lrun-eflow-decomposition assertion failed: ${a.id}`);
  }
}
