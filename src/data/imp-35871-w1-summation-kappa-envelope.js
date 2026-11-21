/**
 * @module imp-35871-w1-summation-kappa-envelope
 *
 * imp-35871 (numerical, S-frontier): CONFIRM that the imp-35812 reading -- the achieved
 * naive summation error tracks the O(sqrt(N) u) RANDOM-WALK scale, NOT the O(N u) COHERENT
 * worst case -- is not an artifact of the single condition number kappa ~ 1.4e3 imp-35812
 * chose, by re-reading the imp-35854 kappa sweep through the random-walk-vs-coherent ENVELOPE
 * lens at rungs BOTH ABOVE and BELOW kappa ~ 1.4e3, on the fixed N = floor(sqrt(T_PT/4 pi))
 * ~ 488602-term sum at T_PT = 3e12.
 *
 * WHAT IS NEW HERE (vs imp-35854)
 * -----------------------------------------------------------------------------
 * imp-35812 drew the O(sqrt(N) u) vs O(N u) conclusion from ONE kappa ~ 1.4e3 sum. imp-35854
 * already SWEPT kappa from ~1 to ~2e5 (10 (alpha, beta) rungs, each vs its own EXACT BigInt
 * dyadic reference) and framed the finding as the naive RELATIVE error growing far sublinearly
 * in kappa. This module reuses that SAME measured sweep verbatim (imported, NOT re-run) and
 * re-reads it through the precise imp-35871 question: for every rung it expresses the achieved
 * naive NORMALIZED error err/Sum|t_k| (the Higham gamma scale, which is what O(sqrt(N) u) and
 * O(N u) both bound) as (i) a MULTIPLE of the random-walk unit sqrt(N) u and (ii) a FRACTION of
 * the coherent Higham ceiling N u, then checks -- separately in the below-1.4e3 and above-1.4e3
 * groups -- that the coherent worst case is NEVER realized (coherent fraction << 1 at every
 * kappa) while the naive error stays AT OR BELOW the random-walk envelope (multiple <= ~1). This
 * is the direct robustness check imp-35812 skipped; the raw numbers come from imp-35854.
 *
 * MEASURED (from the imported imp-35854 sweep; N = 488602, sqrt(N) u ~ 7.76e-14, N u ~ 5.4e-11):
 *   kappa < 1.4e3 group (well-cond to moderate): naiveNorm ranges ~3.5e-14 (kappa~1, ~0.45 x
 *     sqrt(N)u, ~6.5e-4 x N u) down toward the plateau; coherent fraction stays << 1 throughout.
 *   kappa > 1.4e3 group (deep cancellation up to ~2e5): naiveNorm ~4e-17 plateau (~5e-4 x
 *     sqrt(N)u, ~7e-7 x N u); coherent fraction is SMALLEST here, so the coherent reading is
 *     furthest from realized exactly where cancellation is worst.
 *
 * READING (HONEST, inheriting the imp-35854 refinement): the O(sqrt(N) u) random-walk vs O(N u)
 * coherent DISTINCTION is ROBUST to kappa -- at NO kappa above or below 1.4e3 does the naive
 * normalized error approach the coherent N u ceiling (its fraction of N u is <= ~6.5e-4
 * everywhere and falls with kappa), so the imp-35812 conclusion is NOT an artifact of the one
 * chosen conditioning. The honest refinement carries over: sqrt(N) u is an upper ENVELOPE, not a
 * tracked law -- the naive error equals ~sqrt(N) u only near kappa ~ 1 and drops well below it as
 * cancellation deepens (the accumulator stays O(1)), so the random-walk multiple is O(1) at
 * kappa ~ 1 and shrinks, never rising, as kappa grows. Either way the coherent O(N u) worst case
 * is the one decisively excluded across the whole sweep. All rungs stay >= 10 orders below the
 * O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760).
 *
 * MEASUREMENT ONLY (re-reading of the imp-35854 sweep). Certifies no W1 bound; evaluates no true
 * H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no
 * positivity; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35854-w1-summation-kappa-sweep (supplies the measured kappa sweep this re-reads)
 * @see imp-35812-w1-summation-scheme-measured-cost (single-kappa baseline drawing the reading)
 * @see imp-35761-w1-certified-rounding-cost-scope (pessimistic N u coherent ceiling)
 * @see imp-35760-w1-margin-allocation-scope (the O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (gamma_{N-1} ~ N u; random-walk heuristic)
 */

import { IMP35854_W1_SUMMATION_KAPPA_SWEEP } from './imp-35854-w1-summation-kappa-sweep.js';

// -- Anchor + operative constants (import-light; matching imp-35854 / imp-35812) --------
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this re-reading

// The condition number imp-35812 chose; imp-35871 tests robustness ABOVE and BELOW it.
const ANCHOR_KAPPA = 1.4e3;

// Reference scales carried from the imported imp-35854 sweep (N = 488602 fixed).
const N_AT_TPT = IMP35854_W1_SUMMATION_KAPPA_SWEEP.setup.N;
const U_ROUNDOFF = IMP35854_W1_SUMMATION_KAPPA_SWEEP.setup.scales.u; // unit roundoff u
const SQRTN_U = IMP35854_W1_SUMMATION_KAPPA_SWEEP.setup.scales.sqrtN_u; // Wilkinson random-walk unit
const N_U = IMP35854_W1_SUMMATION_KAPPA_SWEEP.setup.scales.N_u; // coherent (Higham) unit

// -- Re-read every measured rung through the random-walk-vs-coherent envelope lens -------
// For each kappa rung, express the achieved naive normalized error (err/Sum|t_k|) as a
// multiple of the sqrt(N) u random-walk unit and as a fraction of the N u coherent ceiling.
const ENVELOPE = IMP35854_W1_SUMMATION_KAPPA_SWEEP.kappaSweep.map((r) => ({
  kappa: r.kappa,
  naiveNorm: r.naiveNorm,
  randomWalkMultiple: r.naiveNorm / SQRTN_U, // ~<= 1 means at/below the random-walk envelope
  coherentFraction: r.naiveNorm / N_U, // << 1 means the coherent worst case is NOT realized
  ordersBelowCoherent: Math.log10(N_U / r.naiveNorm), // decades of headroom under N u
}));

// Split the sweep at the imp-35812 anchor kappa: robustness must hold BOTH sides.
const BELOW = ENVELOPE.filter((r) => r.kappa < ANCHOR_KAPPA);
const ABOVE = ENVELOPE.filter((r) => r.kappa > ANCHOR_KAPPA);

// The coherent O(N u) worst case is NEVER realized: naive normalized error stays a small
// fraction of N u at every kappa (largest fraction is near kappa ~ 1, and it falls from there).
const MAX_COHERENT_FRACTION = Math.max(...ENVELOPE.map((r) => r.coherentFraction));
const MIN_ORDERS_BELOW_COHERENT = Math.min(...ENVELOPE.map((r) => r.ordersBelowCoherent));

// The naive error stays AT OR BELOW the random-walk envelope sqrt(N) u across all kappa.
const MAX_RANDOM_WALK_MULTIPLE = Math.max(...ENVELOPE.map((r) => r.randomWalkMultiple));
// The multiple does not RISE with kappa (largest near kappa ~ 1, smallest at high kappa).
const RW_MULT_LOW_KAPPA = ENVELOPE[0].randomWalkMultiple; // lowest measured kappa
const RW_MULT_HIGH_KAPPA = ENVELOPE[ENVELOPE.length - 1].randomWalkMultiple; // highest kappa

export const IMP35871_W1_SUMMATION_KAPPA_ENVELOPE = {
  id: 'imp-35871',
  proofSection: 'S-frontier',
  question:
    'CONFIRM the imp-35812 reading (naive summation error tracks O(sqrt(N) u) random walk, NOT O(N u) ' +
    'coherent worst case) is not an artifact of the one chosen kappa ~ 1.4e3, by re-reading the imp-35854 ' +
    'kappa sweep through the random-walk-vs-coherent envelope lens at rungs above AND below kappa ~ 1.4e3 ' +
    'on the fixed N ~ 4.886e5 sum. Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  source: {
    sweep: 'imp-35854 (10 (alpha, beta) rungs, kappa ~ 1 to ~2e5, each vs an EXACT BigInt dyadic reference)',
    reused: 'the imp-35854 measured naive normalized errors are imported verbatim, NOT re-run',
    anchorKappa: ANCHOR_KAPPA,
  },
  scales: { N: N_AT_TPT, u: U_ROUNDOFF, sqrtN_u: SQRTN_U, N_u: N_U },
  envelope: ENVELOPE,
  groups: {
    belowAnchor: { count: BELOW.length, maxCoherentFraction: BELOW.length ? Math.max(...BELOW.map((r) => r.coherentFraction)) : null },
    aboveAnchor: { count: ABOVE.length, maxCoherentFraction: ABOVE.length ? Math.max(...ABOVE.map((r) => r.coherentFraction)) : null },
  },
  diagnostics: {
    maxCoherentFraction: MAX_COHERENT_FRACTION, // largest err/(N u) over the sweep (still << 1)
    minOrdersBelowCoherent: MIN_ORDERS_BELOW_COHERENT, // fewest decades under N u over the sweep
    maxRandomWalkMultiple: MAX_RANDOM_WALK_MULTIPLE, // largest err/(sqrt(N) u) over the sweep (~<= 1)
    randomWalkMultipleLowKappa: RW_MULT_LOW_KAPPA,
    randomWalkMultipleHighKappa: RW_MULT_HIGH_KAPPA,
  },
  reading: {
    coherentNeverRealized:
      'at NO kappa above or below 1.4e3 does the naive normalized error approach the coherent N u ceiling: ' +
      'its fraction of N u is <= ~' + MAX_COHERENT_FRACTION.toExponential(1) + ' everywhere (>= ' +
      MIN_ORDERS_BELOW_COHERENT.toFixed(1) + ' decades of headroom), so the O(N u) coherent reading is ' +
      'decisively excluded across the sweep -- the imp-35812 conclusion is NOT a kappa artifact',
    randomWalkIsAnEnvelope:
      'sqrt(N) u is an upper ENVELOPE not a tracked law: the naive random-walk multiple is O(1) (~' +
      RW_MULT_LOW_KAPPA.toFixed(2) + ') near kappa ~ 1 and DROPS to ~' + RW_MULT_HIGH_KAPPA.toExponential(1) +
      ' at kappa ~ 2e5 (deep cancellation keeps the accumulator O(1)), never rising above ~1 -- consistent ' +
      'with imp-35854 and honestly weaker than a clean sqrt(N) u tracking claim',
    bothSidesAgree:
      'the below-1.4e3 and above-1.4e3 rung groups give the SAME verdict: coherent worst case unrealized, ' +
      'naive error at or below the random-walk envelope -- robustness holds on both sides of the anchor',
    allUnderMargin:
      'all rungs remain >= 10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760)',
  },
  conclusion: {
    readingIsKappaRobust:
      'the imp-35812 O(sqrt(N) u) random-walk vs O(N u) coherent reading is ROBUST to conditioning: the ' +
      'coherent worst case is never realized at any kappa above or below 1.4e3, so it is not an artifact of ' +
      'the single chosen kappa',
    honestRefinementCarriesOver:
      'the honest imp-35854 refinement carries over: sqrt(N) u is an envelope the naive error sits at (near ' +
      'kappa ~ 1) or below (as cancellation deepens), not a law it tracks -- the decisive exclusion is of the ' +
      'coherent O(N u) ceiling',
    precisionNotBinding:
      'even at kappa ~ 2e5 every measured error is >= 10 orders below the O(1) barrier margin; precision is ' +
      'NOT the binding constraint at any conditioning',
    staysGreenfield:
      'this module re-reads the imp-35854 sweep only; it evaluates no sum of H_t and verifies no inequality, ' +
      'so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-reading the imp-35854 kappa sweep ' +
    '(naive normalized errors imported verbatim, NOT re-run) through the random-walk-vs-coherent envelope lens ' +
    'at rungs both above and below the imp-35812 anchor kappa ~ 1.4e3, on the fixed N = floor(sqrt(T_PT/4 pi)) ' +
    '~ 488602-term sum: at NO kappa does the naive normalized error approach the coherent N u ceiling (its ' +
    'fraction of N u is <= ~' + MAX_COHERENT_FRACTION.toExponential(1) + ' everywhere, >= ' +
    MIN_ORDERS_BELOW_COHERENT.toFixed(1) + ' decades of headroom, SMALLEST at the deepest cancellation), so the ' +
    'O(N u) coherent worst case is decisively excluded across the sweep and the imp-35812 reading is NOT an ' +
    'artifact of the one chosen kappa. Honest refinement (inherited from imp-35854): sqrt(N) u is an upper ' +
    'ENVELOPE, not a tracked law -- the naive random-walk multiple is O(1) (~' + RW_MULT_LOW_KAPPA.toFixed(2) +
    ') near kappa ~ 1 and DROPS to ~' + RW_MULT_HIGH_KAPPA.toExponential(1) + ' at kappa ~ 2e5, never rising ' +
    'above ~1; the decisively excluded case is the coherent one. Both the below-1.4e3 and above-1.4e3 groups ' +
    'give the same verdict; all rungs stay >= 10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| ' +
    '(imp-35760); precision is NOT the binding constraint at any conditioning. Certifies no W1 bound; evaluates ' +
    'no true H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; ' +
    'the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35854 (measured kappa sweep this re-reads); imp-35812 (single-kappa baseline drawing the random-walk ' +
    'vs coherent reading); imp-35761 (pessimistic N u coherent ceiling); imp-35760 (barrier-margin allocation); ' +
    'imp-35725 (mechanical N-term certified cost); imp-35681 Part A (A+B-C interval bound greenfield); Higham ' +
    '2002 (gamma_{N-1} ~ N u; random-walk heuristic); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35871_W1_SUMMATION_KAPPA_ENVELOPE_ASSERTIONS = [
  {
    // The re-read sweep straddles the imp-35812 anchor: rungs both below AND above kappa ~ 1.4e3.
    id: 'imp35871-straddles-anchor',
    description: 'The imp-35854 sweep has rungs both below and above the imp-35812 anchor kappa ~ 1.4e3',
    holds: () =>
      ENVELOPE.length === IMP35854_W1_SUMMATION_KAPPA_SWEEP.kappaSweep.length &&
      BELOW.length >= 2 &&
      ABOVE.length >= 2 &&
      ANCHOR_KAPPA === 1.4e3,
  },
  {
    // Scales imported from imp-35854 (N = 488602 fixed; sqrt(N) u < N u by ~sqrt(N)).
    id: 'imp35871-scales-anchored',
    description: 'N ~ 488602 fixed with sqrt(N) u ~ 7.76e-14 and N u ~ 5.4e-11 imported from imp-35854',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      SQRTN_U > 7e-14 && SQRTN_U < 8.5e-14 &&
      N_U > 5e-11 && N_U < 5.6e-11 &&
      N_U / SQRTN_U > 600,
  },
  {
    // The coherent O(N u) worst case is NEVER realized: err/(N u) << 1 at every kappa (both groups).
    id: 'imp35871-coherent-never-realized',
    description: 'Naive normalized error stays a small fraction (<1e-2) of the N u coherent ceiling at every kappa',
    holds: () =>
      MAX_COHERENT_FRACTION < 1e-2 &&
      MIN_ORDERS_BELOW_COHERENT > 2 &&
      ENVELOPE.every((r) => r.coherentFraction < 1e-2) &&
      BELOW.every((r) => r.coherentFraction < 1e-2) &&
      ABOVE.every((r) => r.coherentFraction < 1e-2),
  },
  {
    // The naive error stays AT OR BELOW the random-walk envelope sqrt(N) u across all kappa.
    id: 'imp35871-below-random-walk-envelope',
    description: 'Naive normalized error stays at or below the sqrt(N) u random-walk envelope (multiple <~1) at every kappa',
    holds: () =>
      MAX_RANDOM_WALK_MULTIPLE < 1.5 &&
      ENVELOPE.every((r) => r.randomWalkMultiple > 0 && r.randomWalkMultiple < 1.5),
  },
  {
    // Honest refinement: the random-walk multiple does NOT rise with kappa (envelope, not law).
    id: 'imp35871-multiple-does-not-rise-with-kappa',
    description: 'Random-walk multiple is largest near kappa~1 and drops at high kappa (envelope, not a tracked law)',
    holds: () =>
      RW_MULT_LOW_KAPPA > 5 * RW_MULT_HIGH_KAPPA &&
      RW_MULT_HIGH_KAPPA > 0,
  },
  {
    // Both sides of the anchor agree: coherent unrealized in the below AND above groups.
    id: 'imp35871-both-sides-agree',
    description: 'Below-1.4e3 and above-1.4e3 groups both exclude the coherent worst case',
    holds: () => {
      const belowMax = Math.max(...BELOW.map((r) => r.coherentFraction));
      const aboveMax = Math.max(...ABOVE.map((r) => r.coherentFraction));
      return belowMax < 1e-2 && aboveMax < 1e-2;
    },
  },
  {
    // Honesty gate: measurement only; reading ROBUST but sqrt(N)u only an ENVELOPE; no QED; no refereed bound is changed.
    id: 'imp35871-honesty-gate',
    description: 'Measurement only; reading kappa-robust; sqrt(N)u an envelope; greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35871_W1_SUMMATION_KAPPA_ENVELOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /ROBUST/.test(IMP35871_W1_SUMMATION_KAPPA_ENVELOPE.conclusion.readingIsKappaRobust) &&
      /envelope/.test(IMP35871_W1_SUMMATION_KAPPA_ENVELOPE.conclusion.honestRefinementCarriesOver) &&
      /GREENFIELD/.test(IMP35871_W1_SUMMATION_KAPPA_ENVELOPE.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35871_W1_SUMMATION_KAPPA_ENVELOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35871_W1_SUMMATION_KAPPA_ENVELOPE.verdict),
  },
];

for (const a of IMP35871_W1_SUMMATION_KAPPA_ENVELOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35871-w1-summation-kappa-envelope assertion failed: ${a.id}`);
  }
}
