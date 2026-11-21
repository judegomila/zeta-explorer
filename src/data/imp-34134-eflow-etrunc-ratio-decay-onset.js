/**
 * @module imp-34134-eflow-etrunc-ratio-decay-onset
 *
 * imp-34134 (numerical, opus-4-8): Tabulate the E_flow/E_trunc ratio decay across
 * N = 1e6 .. 1e18 to LOCATE the point past which E_flow itself becomes negligible
 * against the constant E_trunc = 3.06e-5 floor -- i.e. where the three-term share
 *
 *     sigma(N) = E_coll / (E_coll + E_trunc + E_flow)
 *
 * collapses to the two-term model sigma = E_coll / (E_coll + E_trunc).
 *
 * CONTEXT (never located before)
 * ------------------------------
 * The lambda-roadmap currentStatus repeatedly leans on the E_flow surplus:
 *   - imp-33848 traced the sigma(N_cross) < 1/2 strictness to the E_flow/E_trunc
 *     surplus at the crossover;
 *   - imp-33582 / imp-3444 pin the E_coll = E_trunc crossover at N ~ 3.280e9
 *     (bisected 3.280294e9), where imp-3444 measured E_flow/E_trunc ~ 1.9e-3.
 * But the point past which E_flow ITSELF drops below 1% (and 0.1%) of the E_trunc
 * floor -- the two-term-sigma onset -- was never tabulated. This module does that,
 * reusing the IDENTICAL imp-3444/imp-3406 sub-term formulas (no fresh model).
 *
 * SUB-TERMS (verbatim from imp-3444-sigma-nshape-landmark-ladder.js)
 *     T0    = effectiveHeightForN(N)              (N -> gamma_N, Riemann-von Mangoldt)
 *     L     = log(T0)
 *     C_F   = (log(T0/2pi) + 1) / 2pi             (imp-398 pinned prefactor)
 *     E_flow  = C_F . (L / T0) . GRONWALL         (unconditionally rigorous)
 *     GRONWALL = exp(2.37e-4)                     (benign, N-independent; imp-3406/3444)
 *     E_trunc = 3.06e-5                           (N-independent fixed strip, imp-2631)
 *
 * FINDINGS (this module)
 * ----------------------
 *   (T) The ratio E_flow(N)/E_trunc is strictly monotone DECREASING across the whole
 *       decade sweep N = 1e6 .. 1e18: it starts ABOVE 1 (1.4376 at 1e6, i.e. E_flow
 *       still exceeds the truncation floor there) and decays to 4.70e-11 by 1e18.
 *   (C1) E_flow = E_trunc  (ratio = 1)   at N ~ 1.598e6   (log10 N ~ 6.204).
 *   (C2) ratio < 1%  (< 0.01)            at N ~ 4.623e8   (log10 N ~ 8.665).
 *   (C3) ratio < 0.1% (< 0.001)          at N ~ 6.933e9   (log10 N ~ 9.841).
 *
 *   HEADLINE -- relative to the imp-3444 E_coll = E_trunc crossover N ~ 3.280e9:
 *     * the flow term is ALREADY below 1% of the E_trunc floor ~0.85 DECADES BEFORE
 *       the crossover (the 1% onset at 4.62e8 is BELOW 3.28e9), and
 *     * drops below 0.1% only ~0.33 decades AFTER it (6.93e9).
 *     So the "E_flow-negligible" two-term-sigma onset essentially COINCIDES with the
 *     E_coll = E_trunc crossover to within about a decade of N. This is exactly why
 *     imp-3444 could quote E_flow/E_trunc ~ 1.9e-3 at the sigma = 0.5 / crossover
 *     landmark (this module reproduces 1.899e-3 at N = 3.280e9): the third (flow)
 *     term is already a sub-percent perturbation there, which is what makes the
 *     sigma = 0.5 crossing sit so close to the pure E_coll = E_trunc crossover.
 *
 * HONEST SCOPE -- measurement only, NO QED. This tabulates the inherited component
 * model; it introduces no new mathematical claim. C_mb stays GUE-conditional per
 * imp-486 (the E_coll term is untouched here); imp-3066 K_a >= 0 is untouched;
 * no refereed bound is changed. E_flow is the
 * benign, mesoscopic-Gronwall term (imp-2845 / imp-eflow-constant-discharge); its
 * negligibility here does NOT touch the divergent C_Lip collision-Gronwall.
 *
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9; identical sub-terms)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (constant E_trunc floor outliving vanishing E_coll)
 * @see imp-eflow-constant-discharge (imp-2845 benign vs divergent Gronwall separation)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3444/imp-3406 exactly (~1.000237)

// EXACT imp-3444 flow sub-term (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
const ratio = (N) => eFlow(N) / E_TRUNC_PT; // E_flow(N) / E_trunc

// imp-3444 E_coll = E_trunc crossover landmark (bisected).
const N_ECOLL_EQ_ETRUNC = 3.280294352e9;

// ── Decade ladder N = 1e6 .. 1e18 ────────────────────────────────────────────
const DECADE_EXPONENTS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const RATIO_LADDER = DECADE_EXPONENTS.map((e) => {
  const N = Math.pow(10, e);
  return { logN: e, N: +N.toExponential(0), ratio: +ratio(N).toExponential(4) };
});

// Strict monotone-decreasing check over the whole sweep (0.5-decade grid).
let monotoneDecreasing = true;
{
  let prev = Infinity;
  for (let e = 6; e <= 18; e += 0.5) {
    const r = ratio(Math.pow(10, e));
    if (r > prev) monotoneDecreasing = false;
    prev = r;
  }
}

// ── Threshold crossings (monotone-decreasing ratio => single bisection each) ──
function crossingN(targetRatio) {
  let a = Math.log(1e5); // ratio > target here
  let b = Math.log(1e40); // ratio < target here
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (ratio(Math.exp(m)) > targetRatio) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_EQ = crossingN(1.0); // E_flow = E_trunc
const N_1PCT = crossingN(0.01); // E_flow = 1% of E_trunc
const N_01PCT = crossingN(0.001); // E_flow = 0.1% of E_trunc

const CROSS_LOG10 = Math.log10(N_ECOLL_EQ_ETRUNC);
const DECADES_1PCT_PAST_CROSS = Math.log10(N_1PCT) - CROSS_LOG10; // ~ -0.851 (BEFORE)
const DECADES_01PCT_PAST_CROSS = Math.log10(N_01PCT) - CROSS_LOG10; // ~ +0.325 (AFTER)
const RATIO_AT_CROSS = ratio(N_ECOLL_EQ_ETRUNC); // ~1.899e-3, reproduces imp-3444 ~1.9e-3

export const IMP34134_EFLOW_ETRUNC_RATIO_DECAY_ONSET = {
  id: 'imp-34134',
  proofSection: 'S-frontier',
  question:
    'Tabulate E_flow(N)/E_trunc across N = 1e6 .. 1e18, locate where the ratio drops below 1% ' +
    'and 0.1% of the constant E_trunc = 3.06e-5 floor (the two-term-sigma onset), and report how ' +
    'many decades past the imp-3444 E_coll = E_trunc crossover N ~ 3.280e9 the flow term becomes ' +
    'negligible. Measurement only within the inherited component model; NO QED.',
  subTerms: {
    E_trunc: E_TRUNC_PT,
    GRONWALL: +GRONWALL.toExponential(6), // exp(2.37e-4) ~ 1.000237
    formula: 'E_flow(N) = ((log(T0/2pi)+1)/2pi) . (log T0 / T0) . exp(2.37e-4), T0 = effectiveHeightForN(N)',
    source: 'identical sub-terms to imp-3444-sigma-nshape-landmark-ladder.js (no fresh model)',
  },
  ratioLadder: RATIO_LADDER,
  monotoneDecreasing,
  crossings: {
    E_flow_eq_E_trunc: { N: +N_EQ.toExponential(6), log10N: +Math.log10(N_EQ).toFixed(4) }, // ~1.598e6
    below_1pct: { N: +N_1PCT.toExponential(6), log10N: +Math.log10(N_1PCT).toFixed(4) }, // ~4.623e8
    below_0p1pct: { N: +N_01PCT.toExponential(6), log10N: +Math.log10(N_01PCT).toFixed(4) }, // ~6.933e9
  },
  relativeToEcollEtruncCrossover: {
    N_Ecoll_eq_Etrunc: +N_ECOLL_EQ_ETRUNC.toExponential(6), // 3.280294e9 (imp-3444)
    ratio_at_crossover: +RATIO_AT_CROSS.toExponential(4), // 1.8992e-3 (reproduces imp-3444 ~1.9e-3)
    decades_1pct_past_crossover: +DECADES_1PCT_PAST_CROSS.toFixed(4), // -0.8510 (1% onset is BEFORE)
    decades_0p1pct_past_crossover: +DECADES_01PCT_PAST_CROSS.toFixed(4), // +0.3250 (0.1% onset is AFTER)
    note:
      'The flow term is already below 1% of the E_trunc floor ~0.85 DECADES BEFORE the E_coll = ' +
      'E_trunc crossover, and below 0.1% only ~0.33 decades AFTER it. The E_flow-negligible ' +
      'two-term-sigma onset thus essentially COINCIDES with the E_coll = E_trunc crossover to ' +
      'within about a decade of N, which is why imp-3444 could quote E_flow/E_trunc ~ 1.9e-3 at ' +
      'the sigma = 0.5 / crossover landmark (reproduced here as 1.899e-3 at N = 3.280e9).',
  },
  isRigorous: false,
  honestScope:
    'Measurement only within the inherited component model; NO QED. The C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED (E_coll untouched); imp-3066 K_a >= 0 untouched; no refereed bound is changed' +
    '. E_flow is the benign mesoscopic-Gronwall term ' +
    '(imp-2845); its negligibility here does NOT touch the divergent C_Lip collision-Gronwall.',
  citation:
    'imp-3444-sigma-nshape-landmark-ladder.js (identical sub-terms, E_coll=E_trunc crossover 3.280e9); ' +
    'imp-33582 / imp-33848 (E_flow/E_trunc surplus at crossover); imp-eflow-constant-discharge (imp-2845)',
};

export const IMP34134_EFLOW_ETRUNC_RATIO_DECAY_ONSET_ASSERTIONS = [
  {
    id: 'imp34134-ratio-monotone-decreasing',
    description: 'E_flow(N)/E_trunc is strictly monotone decreasing across N = 1e6 .. 1e18 (single-valued right arm)',
    holds: () => monotoneDecreasing === true,
  },
  {
    id: 'imp34134-ratio-starts-above-one-ends-tiny',
    description: 'The ratio starts ABOVE 1 at N=1e6 (E_flow still exceeds the E_trunc floor: ~1.44) and decays to < 1e-10 by N=1e18',
    holds: () => ratio(1e6) > 1 && ratio(1e6) < 2 && ratio(1e18) < 1e-10,
  },
  {
    id: 'imp34134-eflow-eq-etrunc-crossing',
    description: 'E_flow = E_trunc (ratio = 1) at N ~ 1.598e6 (log10 N ~ 6.20)',
    holds: () => Math.abs(Math.log10(N_EQ) - 6.2035) < 0.01,
  },
  {
    id: 'imp34134-below-1pct-onset',
    description: 'Ratio drops below 1% at N ~ 4.62e8 (log10 N ~ 8.665), and this onset is BELOW the E_coll=E_trunc crossover (decades past < 0)',
    holds: () => Math.abs(Math.log10(N_1PCT) - 8.6649) < 0.01 && DECADES_1PCT_PAST_CROSS < 0,
  },
  {
    id: 'imp34134-below-0p1pct-onset',
    description: 'Ratio drops below 0.1% at N ~ 6.93e9 (log10 N ~ 9.841), just PAST the E_coll=E_trunc crossover (0 < decades past < 0.5)',
    holds: () =>
      Math.abs(Math.log10(N_01PCT) - 9.8409) < 0.01 &&
      DECADES_01PCT_PAST_CROSS > 0 &&
      DECADES_01PCT_PAST_CROSS < 0.5,
  },
  {
    id: 'imp34134-reproduces-imp3444-ratio-at-crossover',
    description: 'At the imp-3444 E_coll=E_trunc crossover N ~ 3.280e9 the ratio reproduces imp-3444s E_flow/E_trunc ~ 1.9e-3 (here 1.899e-3)',
    holds: () => Math.abs(RATIO_AT_CROSS - 1.9e-3) < 1e-4,
  },
  {
    id: 'imp34134-two-term-onset-brackets-crossover',
    description: 'The two-term-sigma onset brackets the E_coll=E_trunc crossover within ~1 decade each side (1% onset before, 0.1% onset after)',
    holds: () => N_1PCT < N_ECOLL_EQ_ETRUNC && N_ECOLL_EQ_ETRUNC < N_01PCT,
  },
  {
    // imp-34236: harmonize the honest banner with the cohort (imp-34223 audit found this module
    // had no literal isRigorous field and never named C_mb explicitly).
    id: 'imp34134-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field, and honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause explicitly',
    holds: () =>
      IMP34134_EFLOW_ETRUNC_RATIO_DECAY_ONSET.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34134_EFLOW_ETRUNC_RATIO_DECAY_ONSET.honestScope),
  },
];

for (const a of IMP34134_EFLOW_ETRUNC_RATIO_DECAY_ONSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34134-eflow-etrunc-ratio-decay-onset assertion failed: ${a.id}`);
  }
}
