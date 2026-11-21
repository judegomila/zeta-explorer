/**
 * @module imp-35935-adversarial-ordering-viz-data
 * @fileoverview imp-35935 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35852 MEASURED
 *   adversarial-ordering summation-scheme error grid: naive recursive, pairwise
 *   divide-and-conquer, and Kahan-Babuska compensated normalized error, under five
 *   term orderings (original, signedAsc, magAsc, magDesc, clustered) on the SAME
 *   N = floor(sqrt(T_PT/4 pi)) ~ 488602-term oscillatory sum at T_PT = 3e12.
 *
 *   The literals below are copied verbatim from the imp-35852 exact-BigInt-referenced
 *   adversarial-ordering measurement -- this module does not import imp-35852 (no
 *   re-running the five orderings x three schemes at page-load time) so pages
 *   consuming it stay import-light, following the imp-35865 / imp-35934 baked-literal
 *   pattern.
 *
 *   @see imp-35852-w1-summation-adversarial-ordering.js (source measurement)
 *   @see imp-35812-w1-summation-scheme-measured-cost.js (single-ordering baseline this stresses)
 *   @see imp-35934-kappa-sweep-viz-data.js (same baked-literal viz-data pattern, kappa-axis sibling)
 *   @see imp-35865-summation-scheme-ladder-viz-data.js (same viz-data pattern, N-axis sibling)
 *
 *   Ticket: imp-35935 (ux, medium). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

const U_ROUNDOFF = 2 ** -53; // unit roundoff u

// Measured orderings (imp-35852), in the order the module ran them.
// naiveNormErr/pairwiseNormErr/kahanNormErr = err / Sum|t_k| (Higham gamma scale),
// against the exact-BigInt 2^{-96} fixed-point reference (permutation-invariant).
export const IMP35935_ORDERINGS = Object.freeze([
  { ordering: 'original', naiveNormErr: 3.032193419836597e-17, pairwiseNormErr: 3.556628498813625e-19, kahanNormErr: 1.89155419746951e-20, naiveOrdersBelowCoherentCeiling: 6.553638564869477 },
  { ordering: 'signedAsc', naiveNormErr: 9.18485132373028e-16, pairwiseNormErr: 3.1483500457883534e-17, kahanNormErr: 1.89155419746951e-20, naiveOrdersBelowCoherentCeiling: 5.0723233350936505 },
  { ordering: 'magAsc', naiveNormErr: 2.686344698787335e-19, pairwiseNormErr: 6.432128617347911e-19, kahanNormErr: 1.89155419746951e-20, naiveOrdersBelowCoherentCeiling: 8.606233727336187, label: 'best naive' },
  { ordering: 'magDesc', naiveNormErr: 3.044679366231799e-17, pairwiseNormErr: 1.2675101814948872e-18, kahanNormErr: 1.89155419746951e-20, naiveOrdersBelowCoherentCeiling: 6.551853901789488 },
  { ordering: 'clustered', naiveNormErr: 4.860423268802226e-15, pairwiseNormErr: 3.1483500457883534e-17, kahanNormErr: 2.308033859293433e-19, naiveOrdersBelowCoherentCeiling: 4.348721374475812, label: 'worst naive' },
]);

// imp-35761 pessimistic ceilings (normalized errors), for direct contrast.
export const IMP35935_CEILINGS = Object.freeze({
  naiveCoherentLinear: 1.0849143805558015e-10, // N * eps (coherent directed rounding)
  pairwise: 4.196265611312305e-15, // log2(N) * eps
  kahan: 2.220446049250313e-16, // unit-roundoff floor ~ 2u
});

export const IMP35935_SUMMARY = Object.freeze({
  naiveOriginalNormErr: 3.032193419836597e-17,
  naiveWorstNormErr: 4.860423268802226e-15,
  worstOrdering: 'clustered',
  naiveWorstOverOriginal: 160.2939719150288,
  naiveWorstOrdersBelowCoherentCeiling: 4.348721374475812,
  pairwiseWorstNormErr: 3.1483500457883534e-17,
  kahanWorstNormErr: 2.308033859293433e-19,
  kahanOrderingSensitivity: 12.201785507288573,
});

export const IMP35935_ADVERSARIAL_ORDERING_VIZ_DATA = {
  ticket: 'imp-35935',
  sourceTicket: 'imp-35852',
  orderings: IMP35935_ORDERINGS,
  ceilings: IMP35935_CEILINGS,
  summary: IMP35935_SUMMARY,
  uRoundoff: U_ROUNDOFF,
  note:
    'Exact-BigInt-referenced measurement (imp-35852) of naive/pairwise/Kahan-Babuska summation ' +
    'normalized error under five term orderings (original, signedAsc, magAsc, magDesc, clustered) ' +
    'on the SAME N ~ 4.886e5-term oscillatory sum at T_PT = 3e12. The worst ordering (clustered ' +
    'same-sign runs) raises naive error ~160x above the oscillatory baseline yet stays >1e4x below ' +
    'the coherent N*eps ceiling; pairwise/Kahan stay ordering-robust.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35852 exact-BigInt-referenced ' +
    'adversarial-ordering measurement; adds no new derivation and changes no bound. Measurement ' +
    'only; certifies no W1 bound; evaluates no true H_0; instantiates no interval; verifies no ' +
    'inequality; establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
    '(imp-35681 Part A). NO QED. No refereed bound is changed.',
};

export const IMP35935_VIZ_ASSERTIONS = [
  {
    id: 'imp35935-five-orderings-present',
    description: 'exactly five orderings present, matching imp-35852',
    holds: () =>
      IMP35935_ORDERINGS.length === 5 &&
      IMP35935_ORDERINGS.map((r) => r.ordering).join(',') ===
        'original,signedAsc,magAsc,magDesc,clustered',
  },
  {
    id: 'imp35935-kahan-floor-every-ordering',
    description:
      'at every ordering, kahanNormErr is the smallest (<=pairwiseNormErr and <=naiveNormErr); ' +
      'pairwise is NOT always below naive (magAsc is the classical-best ordering for naive)',
    holds: () =>
      IMP35935_ORDERINGS.every((r) => r.kahanNormErr <= r.pairwiseNormErr && r.kahanNormErr <= r.naiveNormErr),
  },
  {
    id: 'imp35935-clustered-is-worst-naive',
    description: 'clustered ordering has the largest naiveNormErr and matches the summary worst',
    holds: () => {
      const worst = IMP35935_ORDERINGS.reduce((a, b) => (b.naiveNormErr > a.naiveNormErr ? b : a));
      return worst.ordering === 'clustered' && worst.naiveNormErr === IMP35935_SUMMARY.naiveWorstNormErr;
    },
  },
  {
    id: 'imp35935-worst-naive-below-coherent-ceiling',
    description: 'even the worst naive error stays >1e4x below the coherent N*eps ceiling',
    holds: () =>
      IMP35935_CEILINGS.naiveCoherentLinear / IMP35935_SUMMARY.naiveWorstNormErr > 1e4 &&
      IMP35935_SUMMARY.naiveWorstOrdersBelowCoherentCeiling > 4,
  },
  {
    id: 'imp35935-pairwise-kahan-ordering-robust',
    description: 'pairwise stays below its log2(N)*eps ceiling and Kahan stays below 2u at every ordering',
    holds: () =>
      IMP35935_ORDERINGS.every(
        (r) => r.pairwiseNormErr < IMP35935_CEILINGS.pairwise && r.kahanNormErr < IMP35935_CEILINGS.kahan
      ),
  },
  {
    id: 'imp35935-honesty-gate-no-qed',
    description: 'honest status references measurement-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP35935_ADVERSARIAL_ORDERING_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP35935_ADVERSARIAL_ORDERING_VIZ_DATA.honest) &&
      /NO QED/.test(IMP35935_ADVERSARIAL_ORDERING_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP35935_ADVERSARIAL_ORDERING_VIZ_DATA.honest),
  },
];

for (const a of IMP35935_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35935-adversarial-ordering-viz-data assertion failed: ${a.id}`);
  }
}
