/**
 * @module imp-36022-etrunc-ecoll-crossover-reconciliation
 *
 * imp-36022 (accuracy, reconciliation): RECONCILE the apparent ~0.024-decade discrepancy
 * between the imp-35968 E_trunc = E_coll crossover height (quoted as N_cross ~ 3.1e9,
 * log10 N ~ 9.49) and the imp-35950 / imp-35994 value (N_cross ~ 3.267e9, log10 ~ 9.514)
 * for the SAME sigma = 1/2 landmark, and identify the source of the gap.
 *
 * THE TWO EVALUATIONS. Both modules use the byte-identical imp-3406 / imp-33582 sub-terms
 * (E_trunc = 3.06e-5 fixed; E_flow = C_F (log T0 / T0) exp|t_c|; E_coll = C_C sqrt(log T0 / N))
 * and the same imp-35853 downslope bisection. They differ ONLY in what balance they bisect:
 *   - imp-35950 / imp-35994 solve sigma(N) = E_coll / (E_trunc + E_flow + E_coll) = 0.5,
 *     i.e. E_coll = E_trunc + E_flow (collision term equals EVERYTHING else).
 *   - imp-35968 solves the raw ratio E_coll / E_trunc = 1, i.e. E_coll = E_trunc
 *     (E_flow EXCLUDED from the balance).
 * Because E_flow > 0, the sigma = 0.5 target needs a fractionally LARGER E_coll than the raw
 * ratio target; since E_coll decreases in N, the sigma = 0.5 point sits at a fractionally
 * LOWER N than the ratio = 1 point. This E_flow-inclusion choice is the ONLY genuine
 * definitional difference, and it is TINY.
 *
 * WHAT THE RECONCILIATION SHOWS (the honest finding).
 *   - imp-35968 STORED value: N_cross = 3.2803e9, log10 N = 9.5159, log T0 = 20.858, sigma
 *     = 0.49953 (just below 1/2, since E_flow is on the collision-lean side of the ratio).
 *   - imp-35950 STORED value: N_cross = 3.2672e9, log10 N = 9.5142, log T0 = 20.854, sigma
 *     = 0.50000.
 *   - The two STORED values AGREE to ~0.0017 decade -- and that residual is EXACTLY the
 *     E_flow-inclusion tilt (sigma = 0.5 lands just below ratio = 1, as predicted). It is
 *     NOT a bisection-tolerance artifact (both run 300 bisection steps to machine epsilon)
 *     and NOT a genuine input difference (E_trunc, C_C, the height inverse are identical).
 *   - The claimed ~0.024-decade gap is SPURIOUS: it comes solely from imp-35968 DOCSTRING
 *     PROSE, which hand-quotes "N_cross ~ 3.1e9 (log10 ~ 9.49, log T0 ~ 21.28)". Those prose
 *     numbers are STALE -- they contradict imp-35968 OWN computed / stored object
 *     (3.28e9, 9.516, 20.858) by ~0.026 decade, whereas imp-35968 dynamically-formatted
 *     verdict text (toExponential(3) / toFixed(2)) correctly reads 3.280e9 / 9.52. The
 *     frontier scout that raised this ticket read the stale prose, not the stored value.
 *
 * RECONCILED VALUE. log10 N_cross ~ 9.514..9.516 (N_cross ~ 3.27..3.28e9, log T0 ~ 20.85),
 * the two definitions separated by only ~0.0017 decade attributable entirely to whether
 * E_flow joins the truncation side of the balance. The nominal ~0.024-decade discrepancy is
 * a documentation artifact, not a computational one.
 *
 * Measurement / reconciliation only; imports and compares the pinned imp-35968 / imp-35950
 * stored objects unchanged; reuses the imp-3406 / imp-33582 sub-terms to exhibit the
 * E_flow-inclusion mechanism; derives no remainder; discharges nothing; changes no bound;
 * establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643),
 * E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a
 * stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35968-e-trunc-coll-crossover-location (raw ratio E_coll/E_trunc = 1; stale docstring prose)
 * @see imp-35950-etrunc-ecoll-crossover-height (sigma = 0.5 bisection; N_cross ~ 3.267e9)
 * @see imp-35994-crossover-height-elasticities (same sigma = 0.5 locator; reused N_cross ~ 3.267e9)
 * @see imp-35337-sigma-landmarks-double-double-certification (E_trunc = E_coll crossover at sigma = 0.5)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION } from './imp-35968-e-trunc-coll-crossover-location.js';
import { IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT } from './imp-35950-etrunc-ecoll-crossover-height.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any reconciliation here)

// EXACT imp-3406 / imp-33582 sub-terms (byte-identical to imp-35950 / imp-35968; no fresh model).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N, logT0: L, E_trunc: E_TRUNC_PT, E_flow, E_coll, E_N };
}
const sigma = (N) => parts(N).sigma;

// Interior peak (reproduces imp-33582 / imp-35813 N ~ 9.22e5) -- anchors the downslope search.
function dSigmadN(N) {
  const h = N * 1e-6;
  return (sigma(N + h) - sigma(N - h)) / (2 * h);
}
function locatePeak() {
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PEAK = locatePeak();

// imp-35950 method: bisect sigma(N) = 0.5 (E_coll = E_trunc + E_flow).
function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// imp-35968 method: bisect the raw ratio E_coll / E_trunc = 1 (E_flow excluded).
function locateRatioCrossover() {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    const p = parts(Math.exp(m));
    if (p.E_coll / p.E_trunc > 1) a = m; // still collision-heavy -> go higher
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const N_RATIO = locateRatioCrossover(); // imp-35968 definition
const N_SIGMA = crossBelow(0.5); // imp-35950 / imp-35994 definition
const P_RATIO = parts(N_RATIO);
const P_SIGMA = parts(N_SIGMA);

const log10 = (x) => Math.log10(x);
const lgRatio = log10(N_RATIO); // ~ 9.5159
const lgSigma = log10(N_SIGMA); // ~ 9.5142

// The genuine gap between the two definitions (positive: ratio point above sigma point).
const trueGapDecades = lgRatio - lgSigma; // ~ +0.0017
// imp-35968 STORED object value (what the module actually computed and exported).
const stored35968Log10 = IMP35968_E_TRUNC_COLL_CROSSOVER_LOCATION.log10_N_cross; // 9.5159
// imp-35950 STORED object value.
const stored35950Log10 = IMP35950_ETRUNC_ECOLL_CROSSOVER_HEIGHT.crossover.log10N; // 9.5142
// gap between the two STORED values (should equal trueGapDecades to rounding).
const storedGapDecades = stored35968Log10 - stored35950Log10; // ~ +0.0017
// The stale docstring prose number quoted in the ticket rationale.
const STALE_PROSE_LOG10 = 9.49; // imp-35968 docstring header (NOT its stored value)
// The phantom "~0.024-decade discrepancy": stale prose vs imp-35950 stored value.
const phantomGapDecades = stored35950Log10 - STALE_PROSE_LOG10; // ~ +0.024
// imp-35968 STORED value disagrees with its OWN docstring prose by ~0.026 decade.
const stored35968VsOwnProse = stored35968Log10 - STALE_PROSE_LOG10; // ~ +0.026

export const IMP36022_ETRUNC_ECOLL_CROSSOVER_RECONCILIATION = {
  id: 'imp-36022',
  proofSection: 'S-frontier',
  question:
    'imp-35968 quotes the E_trunc = E_coll (sigma = 1/2) crossover at N_cross ~ 3.1e9 (log10 ~ 9.49) ' +
    'while imp-35950 / imp-35994 record N_cross ~ 3.267e9 (log10 ~ 9.514) for the identical landmark on ' +
    'the same surrogate. What is the source of the apparent ~0.024-decade discrepancy -- an ' +
    'E_flow-in-denominator choice, a bisection-tolerance artifact, or a genuine input difference -- and ' +
    'what is the reconciled value?',
  method:
    'Reuse the byte-identical imp-3406 / imp-33582 sub-terms and re-run BOTH balances on the same ' +
    'downslope bisection: imp-35968 raw ratio E_coll / E_trunc = 1 and imp-35950 sigma(N) = 0.5 ' +
    '(E_coll = E_trunc + E_flow). Import the two pinned STORED objects and compare their recorded ' +
    'log10 N_cross against each other and against the stale docstring prose number the ticket rationale ' +
    'quotes, isolating the definitional (E_flow-inclusion) residual from the documentation artifact.',
  N_cross_ratio_def: +N_RATIO.toExponential(6), // imp-35968 raw ratio def
  log10_ratio_def: +lgRatio.toFixed(4), // ~ 9.5159
  sigma_at_ratio_def: +P_RATIO.sigma.toFixed(6), // ~ 0.49953 (< 1/2, E_flow on collision-lean side)
  N_cross_sigma_def: +N_SIGMA.toExponential(6), // imp-35950 sigma = 0.5 def
  log10_sigma_def: +lgSigma.toFixed(4), // ~ 9.5142
  sigma_at_sigma_def: +P_SIGMA.sigma.toFixed(6), // = 0.5 exactly
  logT0_ratio_def: +P_RATIO.logT0.toFixed(4), // ~ 20.858
  logT0_sigma_def: +P_SIGMA.logT0.toFixed(4), // ~ 20.854
  trueGapDecades: +trueGapDecades.toFixed(6), // ~ +0.0017 (E_flow-inclusion residual)
  stored35968Log10: +stored35968Log10.toFixed(4), // 9.5159
  stored35950Log10: +stored35950Log10.toFixed(4), // 9.5142
  storedGapDecades: +storedGapDecades.toFixed(6), // ~ +0.0017 (the two modules AGREE)
  staleProseLog10: STALE_PROSE_LOG10, // 9.49 (imp-35968 docstring header, NOT its stored value)
  phantomGapDecades: +phantomGapDecades.toFixed(6), // ~ +0.024 (spurious: stale prose vs stored)
  stored35968VsOwnProse: +stored35968VsOwnProse.toFixed(6), // ~ +0.026 (35968 code disagrees with its prose)
  reconciledLog10N_cross: +((stored35968Log10 + stored35950Log10) / 2).toFixed(4), // ~ 9.5151
  gapSource: 'E_flow-inclusion definitional choice (~0.0017 decade); nominal ~0.024 gap is a stale-docstring artifact in imp-35968',
  gapIsBisectionArtifact: false,
  gapIsGenuineInputDifference: false,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'RECONCILIATION (NOT rigorous). The two modules use byte-identical imp-3406 / imp-33582 sub-terms, ' +
    'the same height inverse and the same 300-step downslope bisection; they differ ONLY in the balance ' +
    'bisected. imp-35968 solves the raw ratio E_coll / E_trunc = 1 (E_flow excluded) and lands at ' +
    'N_cross ~ ' + N_RATIO.toExponential(3) + ' (log10 ~ ' + lgRatio.toFixed(4) + ', sigma ~ ' +
    P_RATIO.sigma.toFixed(4) + '); imp-35950 / imp-35994 solve sigma(N) = 0.5 (E_coll = E_trunc + E_flow) ' +
    'and land at N_cross ~ ' + N_SIGMA.toExponential(3) + ' (log10 ~ ' + lgSigma.toFixed(4) + '). Because ' +
    'E_flow > 0, sigma = 0.5 needs a fractionally larger E_coll than the raw ratio, so it sits ~' +
    trueGapDecades.toFixed(4) + ' decade BELOW the ratio point -- the ONLY genuine difference, and it is ' +
    'the E_flow-inclusion choice, NOT a bisection-tolerance artifact (both to machine epsilon) and NOT ' +
    'an input difference (E_trunc, C_C, the height inverse are identical). The two STORED objects AGREE ' +
    'to ~' + storedGapDecades.toFixed(4) + ' decade (imp-35968 log10 ' + stored35968Log10.toFixed(4) +
    ' vs imp-35950 log10 ' + stored35950Log10.toFixed(4) + '). The nominal ~0.024-decade discrepancy is ' +
    'SPURIOUS: it compares imp-35950 against imp-35968 STALE DOCSTRING PROSE (3.1e9, log10 9.49, log T0 ' +
    '21.28), which contradicts imp-35968 OWN computed / stored value (3.28e9, log10 ' +
    stored35968Log10.toFixed(4) + ') by ~' + stored35968VsOwnProse.toFixed(4) + ' decade, while imp-35968 ' +
    'dynamically-formatted verdict text reads the correct 3.280e9 / 9.52. RECONCILED VALUE: log10 ' +
    'N_cross ~ ' + ((stored35968Log10 + stored35950Log10) / 2).toFixed(4) + ' (N_cross ~ 3.27..3.28e9, ' +
    'log T0 ~ 20.85), the two definitions separated by only ~' + trueGapDecades.toFixed(4) + ' decade. ' +
    'Reconciliation only; imports the pinned imp-35968 / imp-35950 objects unchanged; derives no ' +
    'remainder; discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) ' +
    'sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) ' +
    'are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35968 (raw ratio E_coll/E_trunc = 1; stale docstring prose 3.1e9 / 9.49); imp-35950 (sigma = 0.5 ' +
    'bisection, N_cross ~ 3.267e9); imp-35994 (same sigma = 0.5 locator reused); imp-35337 (E_trunc = ' +
    'E_coll crossover at sigma = 0.5); imp-33582 (sigma-decay model); imp-3220 / imp-3406 (RvM surrogate ' +
    'log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 ' +
    '(GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 ' +
    '(Lambda <= 0.2).',
};

export const IMP36022_ETRUNC_ECOLL_CROSSOVER_RECONCILIATION_ASSERTIONS = [
  {
    // (1) same imp-33582 model in use: reproduces the interior peak both source modules anchor on.
    id: 'imp36022-reproduces-imp33582-peak',
    description: 'peak N ~ 9.22e5 -- confirms the identical imp-33582 sigma model / downslope locator is in use',
    holds: () => Math.abs(N_PEAK / 9.22e5 - 1) < 5e-3,
  },
  {
    // (2) the ratio definition reproduces imp-35968 STORED log10 N_cross (~ 9.5159), NOT its prose 9.49.
    id: 'imp36022-ratio-def-matches-imp35968-stored',
    description: 'raw ratio E_coll/E_trunc = 1 gives log10 N_cross ~ 9.5159, matching imp-35968 STORED value',
    holds: () => Math.abs(lgRatio - stored35968Log10) < 5e-4 && Math.abs(stored35968Log10 - 9.5159) < 5e-3,
  },
  {
    // (3) the sigma definition reproduces imp-35950 STORED log10 N_cross (~ 9.5142).
    id: 'imp36022-sigma-def-matches-imp35950-stored',
    description: 'sigma(N) = 0.5 gives log10 N_cross ~ 9.5142, matching imp-35950 STORED value',
    holds: () => Math.abs(lgSigma - stored35950Log10) < 5e-4 && Math.abs(stored35950Log10 - 9.5142) < 5e-3,
  },
  {
    // (4) the two STORED values AGREE to ~0.0017 decade -- the E_flow-inclusion residual, sigma below ratio.
    id: 'imp36022-two-modules-agree-to-eflow-residual',
    description: 'stored gap ~ +0.0017 decade (< 0.005); sigma = 0.5 point sits BELOW the ratio = 1 point',
    holds: () =>
      Math.abs(storedGapDecades - trueGapDecades) < 1e-3 &&
      storedGapDecades > 0 &&
      storedGapDecades < 5e-3 &&
      N_SIGMA < N_RATIO,
  },
  {
    // (5) the E_flow-inclusion mechanism: at ratio pt E_coll = E_trunc; at sigma pt E_coll = E_trunc + E_flow.
    id: 'imp36022-eflow-inclusion-is-the-mechanism',
    description: 'ratio def balances E_coll = E_trunc; sigma def balances E_coll = E_trunc + E_flow (E_flow > 0)',
    holds: () =>
      Math.abs(P_RATIO.E_coll / P_RATIO.E_trunc - 1) < 1e-4 &&
      Math.abs(P_SIGMA.E_coll / (P_SIGMA.E_trunc + P_SIGMA.E_flow) - 1) < 1e-4 &&
      P_SIGMA.E_flow > 0 &&
      P_RATIO.sigma < 0.5, // E_flow tilts the ratio-point sigma just below 1/2
  },
  {
    // (6) the nominal ~0.024-decade gap is a STALE-PROSE artifact, not a computational one.
    id: 'imp36022-nominal-gap-is-stale-prose-artifact',
    description: 'the ~0.024 gap is stale-prose only: imp-35968 STORED value disagrees with its own 9.49 prose by ~0.026, but agrees with imp-35950',
    holds: () =>
      Math.abs(phantomGapDecades - 0.024) < 3e-3 &&
      Math.abs(stored35968VsOwnProse) > 0.02 && // imp-35968 code contradicts its own docstring prose
      storedGapDecades < stored35968VsOwnProse && // the real inter-module gap is far smaller than the prose gap
      IMP36022_ETRUNC_ECOLL_CROSSOVER_RECONCILIATION.gapIsBisectionArtifact === false &&
      IMP36022_ETRUNC_ECOLL_CROSSOVER_RECONCILIATION.gapIsGenuineInputDifference === false,
  },
  {
    // (7) honesty gate: reconciliation only, conditional, no bound moves, imp-486 kept, imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp36022-measurement-only-no-qed',
    description: 'reconciliation only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP36022_ETRUNC_ECOLL_CROSSOVER_RECONCILIATION;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP36022_ETRUNC_ECOLL_CROSSOVER_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36022-etrunc-ecoll-crossover-reconciliation assertion failed: ${a.id}`);
  }
}
