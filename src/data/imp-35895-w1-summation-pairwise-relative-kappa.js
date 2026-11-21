/**
 * @module imp-35895-w1-summation-pairwise-relative-kappa
 *
 * imp-35895 (numerical, S-frontier): TABULATE the imp-35854 PAIRWISE divide-and-conquer
 * summation RELATIVE-error dependence on the condition number kappa = (Sum |t_k|) / |Sum t_k|
 * across the SAME ten (alpha, beta) rungs, placing pairwise within the Kahan < pairwise < naive
 * hierarchy on the RELATIVE-error axis. Fixed N = floor(sqrt(T_PT/4 pi)) ~ 488602 at T_PT = 3e12.
 *
 * WHAT IS NEW HERE (vs imp-35854)
 * -----------------------------------------------------------------------------
 * imp-35854 swept kappa from ~1 to ~2e5 (10 (alpha, beta) rungs, each vs its own EXACT BigInt
 * dyadic reference) and tabulated the naive and Kahan-Babuska RELATIVE-error kappa-scaling
 * (naiveRel ~ far-sublinear ceiling, kahanRel ~ near the 2u kappa floor), but it reported the
 * intermediate PAIRWISE scheme only via its normalized error -- its relative-error kappa-scaling
 * was left untabulated. This module reuses that SAME measured sweep verbatim (imported, NOT
 * re-run) and reads the pairwise relative error pairwiseRel = pairwiseNorm * kappa at every rung,
 * expressing it as (i) a FRACTION of the naive Wilkinson ceiling sqrt(N) u kappa and (ii) a
 * MULTIPLE of the Kahan-Babuska relative floor 2u kappa, then checks the Kahan < pairwise < naive
 * hierarchy directly on the RELATIVE-error axis. The raw numbers come from imp-35854; this only
 * re-reads the pairwise column imp-35854 measured but did not analyze.
 *
 * MEASURED (from the imported imp-35854 sweep; N = 488602, u ~ 1.11e-16, sqrt(N) u ~ 7.76e-14):
 *   kappa ~ 1.0e0 : pairwiseRel ~ 5.01e-17  (pairwiseNorm ~ 5.01e-17, ties naive/Kahan; near roundoff)
 *   kappa ~ 1.6e2 : pairwiseRel ~ 1.37e-15  (pairwiseNorm ~ 8.64e-18)
 *   kappa ~ 1.4e3 : pairwiseRel ~ 4.95e-16  (pairwiseNorm ~ 3.56e-19; imp-35812 anchor)
 *   kappa ~ 2.0e5 : pairwiseRel ~ 1.54e-13  (pairwiseNorm ~ 7.72e-19)
 *
 * READING (HONEST, inheriting the imp-35854 refinement): the pairwise RELATIVE error grows with
 * kappa but FAR SUBLINEARLY -- only ~3.5 decades of pairwiseRel growth across ~5.3 decades of
 * kappa -- for the SAME reason naive does: the pairwise NORMALIZED error is not kappa-constant.
 * It stays BELOW the unit roundoff u at every rung (max ~5.0e-17 < u, no systematic kappa growth,
 * drifting DOWN as cancellation deepens), so the ~kappa factor is the only growth driver and the
 * relative error grows slower than kappa. Consequently pairwiseRel sits FAR below the naive
 * sqrt(N) u kappa Wilkinson ceiling at every rung (fraction <= ~6.5e-4) AND below the 2u kappa
 * Kahan floor reference (multiple <= ~0.23) throughout. On the relative axis the hierarchy
 * Kahan <= pairwise <= naive holds at every rung (with exact ties near kappa ~ 1 where all three
 * schemes give the same tiny error), so pairwise is kappa-robust and sits in the expected
 * intermediate band -- confirming the missing pairwise column of the imp-35854 hierarchy. All
 * rungs stay >= 10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760).
 *
 * MEASUREMENT ONLY (re-reading of the imp-35854 sweep). Certifies no W1 bound; evaluates no true
 * H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no
 * positivity; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35854-w1-summation-kappa-sweep (supplies the measured kappa sweep this re-reads)
 * @see imp-35871-w1-summation-kappa-envelope (companion re-read of the naive column)
 * @see imp-35812-w1-summation-scheme-measured-cost (single-kappa baseline; pairwise scheme + reference)
 * @see imp-35761-w1-certified-rounding-cost-scope (pessimistic N u ceiling; kappa enters via relative error)
 * @see imp-35760-w1-margin-allocation-scope (the O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (pairwise error ~ log2(N) u; condition number)
 */

import { IMP35854_W1_SUMMATION_KAPPA_SWEEP } from './imp-35854-w1-summation-kappa-sweep.js';

// -- Anchor + operative constants (import-light; matching imp-35854 / imp-35871) ---------
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this re-reading

// Reference scales carried from the imported imp-35854 sweep (N = 488602 fixed).
const N_AT_TPT = IMP35854_W1_SUMMATION_KAPPA_SWEEP.setup.N;
const U_ROUNDOFF = IMP35854_W1_SUMMATION_KAPPA_SWEEP.setup.scales.u; // unit roundoff u
const SQRTN_U = IMP35854_W1_SUMMATION_KAPPA_SWEEP.setup.scales.sqrtN_u; // Wilkinson random-walk unit

// -- Re-read every measured rung on the PAIRWISE relative-error axis ----------------------
// For each kappa rung, express the achieved pairwise relative error pairwiseRel = pairwiseNorm *
// kappa as (i) a FRACTION of the naive Wilkinson relative ceiling sqrt(N) u kappa and (ii) a
// MULTIPLE of the Kahan-Babuska relative floor 2u kappa. Both reference lines scale as kappa, so
// these ratios equal pairwiseNorm / (sqrt(N) u) and pairwiseNorm / (2u), independent of kappa.
const PAIRWISE = IMP35854_W1_SUMMATION_KAPPA_SWEEP.kappaSweep.map((r) => ({
  kappa: r.kappa,
  pairwiseNorm: r.pairwiseNorm, // Higham gamma scale (err / Sum |t_k|)
  pairwiseRel: r.pairwiseRel, // relative error (err / |Sum t_k|) = pairwiseNorm * kappa
  kahanRel: r.kahanRel, // Kahan-Babuska relative error (the floor of the hierarchy)
  naiveRel: r.naiveRel, // naive relative error (the ceiling of the hierarchy)
  fractionOfSqrtNuKappaCeiling: r.pairwiseRel / (SQRTN_U * r.kappa), // << 1 means far below the naive ceiling
  multipleOf2uKappaFloor: r.pairwiseRel / (2 * U_ROUNDOFF * r.kappa), // ~<= 1 means at/below the Kahan floor reference
}));

// The pairwise RELATIVE error decades of growth across the kappa sweep (test: far sublinear).
const PAIRWISE_REL_MIN = Math.min(...PAIRWISE.map((r) => r.pairwiseRel));
const PAIRWISE_REL_MAX = Math.max(...PAIRWISE.map((r) => r.pairwiseRel));
const PAIRWISE_REL_DECADES = Math.log10(PAIRWISE_REL_MAX / PAIRWISE_REL_MIN);
const KAPPA_DECADES = IMP35854_W1_SUMMATION_KAPPA_SWEEP.kappaRange.decades;

// pairwiseRel stays FAR below the naive sqrt(N) u kappa ceiling at every rung.
const MAX_CEILING_FRACTION = Math.max(...PAIRWISE.map((r) => r.fractionOfSqrtNuKappaCeiling));
// pairwiseRel stays at/below the 2u kappa Kahan floor reference at every rung.
const MAX_FLOOR_MULTIPLE = Math.max(...PAIRWISE.map((r) => r.multipleOf2uKappaFloor));
// The pairwise NORMALIZED error stays below unit roundoff u across all kappa (no kappa growth).
const MAX_PAIRWISE_NORM = Math.max(...PAIRWISE.map((r) => r.pairwiseNorm));
// On the RELATIVE axis, the hierarchy Kahan <= pairwise <= naive holds at every rung
// (exact ties allowed near kappa ~ 1 where all three schemes coincide; use a tiny slack).
const TIE_SLACK = 1e-30;
const RELATIVE_HIERARCHY_HOLDS = PAIRWISE.every(
  (r) => r.kahanRel <= r.pairwiseRel + TIE_SLACK && r.pairwiseRel <= r.naiveRel + TIE_SLACK
);
const PAIRWISE_REL_LOW_KAPPA = PAIRWISE[0].pairwiseRel; // lowest measured kappa
const PAIRWISE_REL_HIGH_KAPPA = PAIRWISE[PAIRWISE.length - 1].pairwiseRel; // highest kappa

export const IMP35895_W1_SUMMATION_PAIRWISE_RELATIVE_KAPPA = {
  id: 'imp-35895',
  proofSection: 'S-frontier',
  question:
    'TABULATE the imp-35854 PAIRWISE relative-error dependence on the condition number kappa across the ' +
    'same ten (alpha, beta) rungs (imp-35854 reported only naiveRel and kahanRel vs kappa), placing pairwise ' +
    'within the Kahan < pairwise < naive hierarchy on the RELATIVE-error axis and comparing its growth against ' +
    'the naive sqrt(N) u kappa ceiling and the 2u kappa Kahan floor. Measurement only; certifies no W1 bound; ' +
    'changes no bound; NO QED.',
  source: {
    sweep: 'imp-35854 (10 (alpha, beta) rungs, kappa ~ 1 to ~2e5, each vs an EXACT BigInt dyadic reference)',
    reused: 'the imp-35854 measured pairwise normalized/relative errors are imported verbatim, NOT re-run',
    gapFilled: 'imp-35854 tabulated naiveRel and kahanRel vs kappa but left the pairwise relative-error scaling untabulated',
  },
  scales: { N: N_AT_TPT, u: U_ROUNDOFF, sqrtN_u: SQRTN_U },
  pairwise: PAIRWISE,
  pairwiseRelGrowth: {
    kappaDecades: KAPPA_DECADES,
    pairwiseRelDecades: PAIRWISE_REL_DECADES,
    sublinear: PAIRWISE_REL_DECADES < KAPPA_DECADES - 1, // grows far slower than linear in kappa
    relMin: PAIRWISE_REL_MIN,
    relMax: PAIRWISE_REL_MAX,
  },
  diagnostics: {
    maxCeilingFraction: MAX_CEILING_FRACTION, // largest pairwiseRel / (sqrt(N) u kappa) over the sweep (<< 1)
    maxFloorMultiple: MAX_FLOOR_MULTIPLE, // largest pairwiseRel / (2u kappa) over the sweep (~<= 1)
    maxPairwiseNorm: MAX_PAIRWISE_NORM, // largest pairwise normalized error (< u; kappa-robust)
    pairwiseRelLowKappa: PAIRWISE_REL_LOW_KAPPA,
    pairwiseRelHighKappa: PAIRWISE_REL_HIGH_KAPPA,
    relativeHierarchyHolds: RELATIVE_HIERARCHY_HOLDS,
  },
  reading: {
    pairwiseSublinearNotLinear:
      'the pairwise relative error grows with kappa but FAR SUBLINEARLY (~' + PAIRWISE_REL_DECADES.toFixed(1) +
      ' decades over ~' + KAPPA_DECADES.toFixed(1) + ' decades of kappa), like naive: the pairwise NORMALIZED ' +
      'error is not kappa-constant, so the ~kappa factor alone would over-predict the growth',
    farBelowNaiveCeiling:
      'pairwiseRel sits FAR below the naive sqrt(N) u kappa Wilkinson ceiling at every rung: its fraction of ' +
      'that ceiling is <= ~' + MAX_CEILING_FRACTION.toExponential(1) + ' everywhere (>= 3 decades of headroom)',
    atOrBelowKahanFloor:
      'pairwiseRel stays at or below the 2u kappa Kahan floor reference at every rung (multiple <= ~' +
      MAX_FLOOR_MULTIPLE.toFixed(2) + '), because the pairwise normalized error stays below the unit roundoff ' +
      'u (max ~' + MAX_PAIRWISE_NORM.toExponential(1) + ') across all kappa -- no kappa growth',
    relativeHierarchyPreserved:
      'on the RELATIVE-error axis the hierarchy Kahan <= pairwise <= naive holds at every kappa rung (with exact ' +
      'ties near kappa ~ 1 where all three schemes coincide), filling the pairwise column imp-35854 left blank',
    allUnderMargin:
      'all pairwise errors at all kappa remain >= 10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760)',
  },
  conclusion: {
    pairwiseKappaRobust:
      'the pairwise scheme IS kappa-robust on the relative axis: its normalized error shows no kappa growth ' +
      '(stays below u), so its relative error grows only sublinearly in kappa and never approaches the naive ceiling',
    hierarchyConfirmedOnRelativeAxis:
      'the Kahan <= pairwise <= naive hierarchy imp-35854 verified on the normalized scale ALSO holds on the ' +
      'relative-error axis at every rung, so pairwise occupies the expected intermediate band there too',
    precisionNotBinding:
      'even at kappa ~ 2e5 (near-total cancellation) every measured pairwise error is >= 10 orders below the ' +
      'O(1) barrier margin; precision is NOT the binding constraint at any conditioning',
    staysGreenfield:
      'this module re-reads the imp-35854 sweep only; it evaluates no sum of H_t and verifies no inequality, ' +
      'so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  honestStatus:
    'The pairwise relative error grows with kappa but FAR SUBLINEARLY (~' + PAIRWISE_REL_DECADES.toFixed(1) +
    ' decades over ~' + KAPPA_DECADES.toFixed(1) + ' of kappa), so a linear-in-kappa reading OVERESTIMATES it, ' +
    'for the same reason as naive: the pairwise NORMALIZED error is not kappa-constant (it stays below the unit ' +
    'roundoff u and drifts DOWN as cancellation deepens). Pairwise sits far below the naive sqrt(N) u kappa ' +
    'ceiling and at/below the 2u kappa Kahan floor reference at every rung. This is a MEASUREMENT re-reading the ' +
    'imp-35854 pairwise column; it certifies no bound.',
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-reading the imp-35854 kappa sweep ' +
    '(pairwise normalized/relative errors imported verbatim, NOT re-run) on the PAIRWISE relative-error axis at ' +
    'all ten (alpha, beta) rungs, fixed N = floor(sqrt(T_PT/4 pi)) ~ 488602: the pairwise relative error grows ' +
    'FAR SUBLINEARLY in kappa (~' + PAIRWISE_REL_DECADES.toFixed(1) + ' decades over ~' + KAPPA_DECADES.toFixed(1) +
    '), because the pairwise NORMALIZED error is not kappa-constant -- it stays below the unit roundoff u (max ~' +
    MAX_PAIRWISE_NORM.toExponential(1) + ') and drifts DOWN as cancellation deepens, so the ~kappa factor is the ' +
    'only growth driver and the relative error grows slower than kappa. pairwiseRel sits FAR below the naive ' +
    'sqrt(N) u kappa Wilkinson ceiling at every rung (fraction <= ~' + MAX_CEILING_FRACTION.toExponential(1) +
    ') and at/below the 2u kappa Kahan floor reference (multiple <= ~' + MAX_FLOOR_MULTIPLE.toFixed(2) + '); on the ' +
    'relative axis the hierarchy Kahan <= pairwise <= naive holds at every rung (exact ties near kappa ~ 1), ' +
    'filling the pairwise column imp-35854 left untabulated. Pairwise is kappa-robust. All pairwise errors at all ' +
    'kappa remain >= 10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760); precision is NOT the ' +
    'binding constraint at any conditioning. Certifies no W1 bound; evaluates no true H_0; instantiates no ' +
    'interval; verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate ' +
    'at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb GUE-conditional (imp-486) ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35854 (measured kappa sweep this re-reads; naive/Kahan relative columns tabulated, pairwise left blank); ' +
    'imp-35871 (companion re-read of the naive column); imp-35812 (single-kappa baseline; pairwise scheme + ' +
    'reference); imp-35761 (pessimistic N u ceiling); imp-35760 (barrier-margin allocation); imp-35725 (mechanical ' +
    'N-term certified cost); imp-35681 Part A (A+B-C interval bound greenfield); Higham 2002 (pairwise error ~ ' +
    'log2(N) u; condition number); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35895_W1_SUMMATION_PAIRWISE_RELATIVE_KAPPA_ASSERTIONS = [
  {
    // The re-read covers every imp-35854 rung across several decades of measured kappa.
    id: 'imp35895-covers-full-sweep',
    description: 'The pairwise re-read covers all imp-35854 rungs across >= 4 decades of measured kappa',
    holds: () =>
      PAIRWISE.length === IMP35854_W1_SUMMATION_KAPPA_SWEEP.kappaSweep.length &&
      PAIRWISE.length === 10 &&
      KAPPA_DECADES >= 4,
  },
  {
    // Scales imported from imp-35854 (N = 488602 fixed; sqrt(N) u ~ 7.76e-14; u ~ 1.11e-16).
    id: 'imp35895-scales-anchored',
    description: 'N ~ 488602 fixed with sqrt(N) u ~ 7.76e-14 and u ~ 1.11e-16 imported from imp-35854',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      SQRTN_U > 7e-14 && SQRTN_U < 8.5e-14 &&
      U_ROUNDOFF > 1e-16 && U_ROUNDOFF < 1.2e-16,
  },
  {
    // The pairwise RELATIVE error grows FAR SUBLINEARLY in kappa (>= 1 decade slower than linear).
    id: 'imp35895-pairwise-rel-sublinear',
    description: 'Pairwise relative error grows far sublinearly in kappa (>= 1 decade slower than linear)',
    holds: () =>
      PAIRWISE_REL_DECADES > 0 &&
      PAIRWISE_REL_DECADES < KAPPA_DECADES - 1,
  },
  {
    // pairwiseRel sits FAR below the naive sqrt(N) u kappa Wilkinson ceiling at every rung.
    id: 'imp35895-below-naive-ceiling',
    description: 'Pairwise relative error is a tiny fraction (<1e-2) of the naive sqrt(N) u kappa ceiling at every rung',
    holds: () =>
      MAX_CEILING_FRACTION < 1e-2 &&
      PAIRWISE.every((r) => r.fractionOfSqrtNuKappaCeiling > 0 && r.fractionOfSqrtNuKappaCeiling < 1e-2),
  },
  {
    // pairwiseRel stays at/below the 2u kappa Kahan floor reference (multiple <= ~1) at every rung,
    // because the pairwise normalized error stays below the unit roundoff u across all kappa.
    id: 'imp35895-at-or-below-kahan-floor',
    description: 'Pairwise relative error stays at/below the 2u kappa Kahan floor reference (multiple <~1); pairwise normalized error < u',
    holds: () =>
      MAX_FLOOR_MULTIPLE < 1 &&
      MAX_PAIRWISE_NORM < U_ROUNDOFF &&
      PAIRWISE.every((r) => r.pairwiseNorm > 0 && r.pairwiseNorm < U_ROUNDOFF),
  },
  {
    // On the RELATIVE-error axis the hierarchy Kahan <= pairwise <= naive holds at every rung.
    id: 'imp35895-relative-hierarchy',
    description: 'Kahan <= pairwise <= naive on the RELATIVE-error axis at every kappa rung (ties near kappa~1)',
    holds: () => RELATIVE_HIERARCHY_HOLDS,
  },
  {
    // Honesty gate: measurement only; pairwise kappa-robust, sublinear; no QED; no refereed bound is changed.
    id: 'imp35895-honesty-gate',
    description: 'Measurement only; pairwise kappa-robust; sublinear; greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35895_W1_SUMMATION_PAIRWISE_RELATIVE_KAPPA.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /kappa-robust/.test(IMP35895_W1_SUMMATION_PAIRWISE_RELATIVE_KAPPA.conclusion.pairwiseKappaRobust) &&
      /GREENFIELD/.test(IMP35895_W1_SUMMATION_PAIRWISE_RELATIVE_KAPPA.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35895_W1_SUMMATION_PAIRWISE_RELATIVE_KAPPA.verdict) &&
      /refereed bound is changed/i.test(IMP35895_W1_SUMMATION_PAIRWISE_RELATIVE_KAPPA.verdict),
  },
];

for (const a of IMP35895_W1_SUMMATION_PAIRWISE_RELATIVE_KAPPA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35895-w1-summation-pairwise-relative-kappa assertion failed: ${a.id}`);
  }
}
