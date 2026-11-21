/**
 * @module imp-35617-pinsker-tv-reranking-crossover-ordering
 *
 * imp-35617 (accuracy/assessment, S-frontier): RE-RANK the imp-35530 three
 * extrapolation-form ordering (free exponent, forced 1/logT0, forced 1/(logT0)^2)
 * inside the imp-35556 COMMON FIRST-ORDER functional. imp-35556 derived the
 * Pinsker bridge TV(p_emp,p_GUE) <= sqrt(KL/2) -- which reduces the quadratic
 * KL (O(eps^2)) to a first-order TV amplitude (O(eps)) that shares E_coll order
 * -- and printed the three per-form TV upper bounds. What imp-35556 did NOT do is
 * RE-RANK the imp-35530 forms in that functional: assess whether the g_true >>
 * E_coll ordering survives once BOTH sides are first-order amplitudes, and how the
 * ~10.5x raw factor MAPS to the TV/E_coll ratio across the three forms.
 *
 * ASSESSMENT (no new measurement; reuses the imp-35530/imp-35556 baked literals):
 *
 *   1. THE RAW-RATIO RANKING (imp-35530). KL_form / E_coll at the crossover:
 *        free       3.214e-4 / 3.060e-5 = 10.504x
 *        1/(logT0)^2 6.816e-4 / 3.060e-5 = 22.273x
 *        1/logT0    1.146e-3 / 3.060e-5 = 37.452x
 *      Rank low->high: free < p2 < p1.
 *
 *   2. THE FIRST-ORDER (TV) RANKING (Pinsker reduction). TV_form / E_coll:
 *        free       1.2677e-2 / 3.060e-5 = 414.29x
 *        1/(logT0)^2 1.8460e-2 / 3.060e-5 = 603.28x
 *        1/logT0    2.3938e-2 / 3.060e-5 = 782.28x
 *      Rank low->high: free < p2 < p1 -- IDENTICAL to the raw ranking. Because
 *      TV = sqrt(KL/2) is a MONOTONE-increasing transform of KL, the per-form
 *      ordering is PRESERVED exactly; no re-ordering occurs across the three forms.
 *
 *   3. THE ~10.5x MAP (closed form). TV_ratio = sqrt(KL/2)/E_coll, and with
 *      KL = raw_ratio * E_coll this collapses to
 *        TV_ratio = sqrt(raw_ratio / (2 * E_coll)).
 *      Because E_coll = 3.060e-5 << 1, the sqrt reduction does NOT bring g_true
 *      DOWN toward E_coll -- it AMPLIFIES the ratio (10.504x -> 414.29x for the
 *      free fit, amplification ~39.4x). The amplification factor per form is
 *      amp = TV_ratio / raw_ratio = 1/sqrt(2 * E_coll * raw_ratio), which DECREASES
 *      with raw_ratio (39.44x free, 27.09x p2, 20.89x p1).
 *
 *   4. INTER-FORM SPREAD COMPRESSES TO ITS SQUARE ROOT. The raw model bracket
 *      p1/free = 37.452 / 10.504 = 3.566x becomes, under the sqrt reduction,
 *      782.28 / 414.29 = 1.888x = sqrt(3.566). The first-order functional COMPRESSES
 *      the ~3.6x inter-form disagreement to ~1.9x while preserving its direction.
 *
 * HONEST FINDING: the ~10.5x gap does NOT survive the order-correction as a
 * SAME-ORDER inequality. Once both sides are first-order amplitudes, the gap is
 * LARGER, not comparable: in ALL THREE forms the Pinsker TV upper bound is
 * hundreds-of-x E_coll (414x/603x/782x), and the per-form ordering g_true >> E_coll
 * is preserved a fortiori. BUT this is still an UPPER bound on TV, so -- exactly as
 * imp-35556 stressed -- it cannot LOWER-bound the true deviation and so cannot
 * certify even the DIRECTION g_true > E_coll. The re-ranking sharpens imp-35556: the
 * order-mismatch fix (a common first-order functional) leaves the qualitative
 * ordering and its form-robustness intact but supplies no certified multiplier;
 * the missing lower bound is the surrogate->observable dictionary imp-35337a /
 * imp-35556a leave OPEN.
 *
 * ASSESSMENT ONLY; discharges nothing; imp-35488a, imp-35530a, imp-35530b,
 * imp-35337a, imp-35556a stay OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED;
 * C_C ansatz (imp-2642/imp-2643), E_trunc floor (imp-2631) UNTOUCHED; changes no
 * bound; no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35556-gtrue-ecoll-dimensional-comparability (the Pinsker first-order bridge; sub-gap imp-35556a)
 * @see imp-35530-crossover-gtrue-trend-extrapolation (the three extrapolation forms + raw ~10.5x ordering)
 * @see imp-35337-sigma-landmarks-double-double-certification (imp-35337a surrogate->observable dictionary, OPEN)
 * @see imp-486 (GUE-conditional caveat the analytic prediction inherits)
 */

const ECOLL_CROSS = 0.00003059999999845239; // 3.060e-5 (imp-2631 E_trunc floor at the crossover)

// imp-35530 projected g_true (KL) at logT0 = 20.858 across the three extrapolation forms (EXTRAPOLATION, imp-35530a).
const KL_CROSS_FREE = 0.0003214254410014205; // free-exponent fit
const KL_CROSS_P1 = 0.001146045615034889; // forced 1/logT0
const KL_CROSS_P2 = 0.0006815647332400637; // forced 1/(logT0)^2

// Raw KL/E_coll ratios (imp-35530: category mismatch, O(eps^2) vs O(eps)).
const rawRatio = (kl) => kl / ECOLL_CROSS;
const RAW_FREE = rawRatio(KL_CROSS_FREE); // ~10.504
const RAW_P1 = rawRatio(KL_CROSS_P1); // ~37.452
const RAW_P2 = rawRatio(KL_CROSS_P2); // ~22.273

// Pinsker first-order reduction: TV <= sqrt(KL/2); TV/E_coll ratios (imp-35556).
const pinskerTV = (kl) => Math.sqrt(kl / 2);
const tvRatio = (kl) => pinskerTV(kl) / ECOLL_CROSS;
const TV_FREE = tvRatio(KL_CROSS_FREE); // ~414.29
const TV_P1 = tvRatio(KL_CROSS_P1); // ~782.28
const TV_P2 = tvRatio(KL_CROSS_P2); // ~603.28

// Closed-form map: TV_ratio = sqrt(raw / (2 E_coll)) -- monotone in raw, so ranking is preserved.
const closedMap = (raw) => Math.sqrt(raw / (2 * ECOLL_CROSS));

// Per-form amplification and inter-form spread compression (raw bracket -> its square root).
const AMP_FREE = TV_FREE / RAW_FREE; // ~39.44x
const RAW_BRACKET = RAW_P1 / RAW_FREE; // ~3.566x (imp-35530 model bracket, p1 vs free)
const TV_BRACKET = TV_P1 / TV_FREE; // ~1.888x = sqrt(RAW_BRACKET)

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any re-ranking assessment)

export const IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING = {
  id: 'imp-35617',
  proofSection: 'S-frontier',
  question:
    'Re-rank the imp-35530 three extrapolation forms (free, 1/logT0, 1/(logT0)^2) in the imp-35556 common ' +
    'first-order functional TV <= sqrt(KL/2): does the g_true >> E_coll ordering survive once both sides are ' +
    'first-order amplitudes, does the ~10.5x become a same-order inequality, and how does the raw factor map?',
  rawRanking: {
    free: RAW_FREE, // ~10.504
    forced1OverLogT2: RAW_P2, // ~22.273
    forced1OverLogT: RAW_P1, // ~37.452
    orderLowToHigh: 'free < p2 < p1',
    note: 'KL_form / E_coll at the crossover (imp-35530): a category-mismatch ratio, O(eps^2) over O(eps).',
  },
  firstOrderRanking: {
    free: TV_FREE, // ~414.29
    forced1OverLogT2: TV_P2, // ~603.28
    forced1OverLogT: TV_P1, // ~782.28
    orderLowToHigh: 'free < p2 < p1',
    orderingPreserved: true,
    note:
      'TV_form / E_coll under the Pinsker reduction TV = sqrt(KL/2). Since sqrt is monotone increasing, the ' +
      'per-form ranking is IDENTICAL to the raw ranking -- no re-ordering across the three extrapolation forms.',
  },
  rawToTvMap: {
    closedForm: 'TV_ratio = sqrt(raw_ratio / (2 * E_coll))',
    ampFree: AMP_FREE, // ~39.44x -- the ~10.5x is AMPLIFIED to ~414x, not reduced to same order
    ampFormula: 'amp = TV_ratio / raw_ratio = 1 / sqrt(2 * E_coll * raw_ratio), DECREASING in raw_ratio',
    note:
      'Because E_coll = 3.060e-5 << 1, the first-order (sqrt) reduction moves g_true FURTHER from E_coll in ' +
      'ratio terms (10.504x -> 414.29x for the free fit), so the gap does NOT become same-order; it grows.',
  },
  spreadCompression: {
    rawBracket: RAW_BRACKET, // ~3.566x (imp-35530 model bracket p1/free)
    tvBracket: TV_BRACKET, // ~1.888x
    relation: 'tvBracket = sqrt(rawBracket): the sqrt reduction compresses the inter-form disagreement to its square root while preserving direction.',
  },
  honestReading:
    'The ~10.5x gap does NOT survive the order-correction as a SAME-ORDER inequality: once both sides are ' +
    'first-order amplitudes the Pinsker TV upper bound is hundreds-of-x E_coll (414x/603x/782x) in all three ' +
    'forms and the g_true >> E_coll ordering is preserved a fortiori and form-robust. BUT sqrt(KL/2) only ' +
    'UPPER-bounds TV, so (as imp-35556 stressed) it cannot lower-bound the true deviation and cannot certify ' +
    'even the direction. The re-ranking sharpens imp-35556: the common first-order functional leaves the ' +
    'qualitative ordering and its form-robustness intact but supplies no certified multiplier; the missing ' +
    'lower bound is the surrogate->observable dictionary imp-35337a / imp-35556a leave OPEN.',
  inheritsOpen: ['imp-35488a', 'imp-35530a', 'imp-35530b', 'imp-35337a', 'imp-35556a'],
  isRigorous: false,
  verdict:
    'ASSESSMENT: re-ranking the imp-35530 three extrapolation forms inside the imp-35556 common first-order ' +
    'functional TV <= sqrt(KL/2) PRESERVES the per-form ordering exactly (free < p2 < p1, both raw and TV), ' +
    'because sqrt is monotone. The ~10.5x raw factor maps by the closed form TV_ratio = sqrt(raw/(2 E_coll)) ' +
    'to ~414x (free), ~603x (p2), ~782x (p1): since E_coll << 1 the order-correction AMPLIFIES the gap rather ' +
    'than reducing it to same order, and it COMPRESSES the ~3.566x inter-form bracket to its square root ' +
    '(~1.888x). So the g_true >> E_coll ordering survives the order-correction as an even LARGER, ' +
    'UPPER-bound-only gap -- form-robust in direction but, being an upper bound, still unable to certify the ' +
    'direction. Confirms/sharpens imp-35556; the certified lower bound needs the surrogate->observable ' +
    'dictionary imp-35337a / imp-35556a leave OPEN. ASSESSMENT ONLY; discharges nothing; imp-35488a, ' +
    'imp-35530a, imp-35530b, imp-35337a, imp-35556a stay OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; ' +
    'C_C ansatz (imp-2642/imp-2643), E_trunc floor (imp-2631) UNTOUCHED; changes no bound; no operator ' +
    'positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35556 (Pinsker first-order bridge TV <= sqrt(KL/2); sub-gap imp-35556a); imp-35530 (three ' +
    'extrapolation forms + raw ~10.5x ordering; sub-gaps imp-35530a/b); imp-35337 (imp-35337a ' +
    'surrogate->observable dictionary, OPEN); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz); imp-2631 ' +
    '(E_trunc floor); imp-486 (GUE-conditional caveat); Pinsker inequality TV <= sqrt(KL/2); Platt-Trudgian ' +
    '2021 (no refereed bound is changed).',
  L_pt_unchanged: L_PT,
};

export const IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING_ASSERTIONS = [
  {
    // The per-form ranking (free < p2 < p1) is identical in the raw KL/E_coll and the Pinsker TV/E_coll functionals.
    id: 'imp35617-ranking-preserved-under-monotone-sqrt',
    description: 'the free < p2 < p1 ordering is identical in the raw KL/E_coll ratios and the Pinsker TV/E_coll ratios, because TV = sqrt(KL/2) is a monotone-increasing transform',
    holds: () =>
      RAW_FREE < RAW_P2 && RAW_P2 < RAW_P1 &&
      TV_FREE < TV_P2 && TV_P2 < TV_P1 &&
      Math.abs(RAW_FREE - 10.50409937966264) < 1e-6 &&
      Math.abs(TV_FREE - 414.289284) < 1e-3 &&
      Math.abs(TV_P1 - 782.284144) < 1e-3 &&
      Math.abs(TV_P2 - 603.277504) < 1e-3 &&
      IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING.firstOrderRanking.orderingPreserved === true,
  },
  {
    // The ~10.5x maps by the closed form TV_ratio = sqrt(raw/(2 E_coll)) and the order-correction AMPLIFIES (does not reduce to same order).
    id: 'imp35617-closed-map-amplifies-not-same-order',
    description: 'the raw ratio maps to the TV ratio via sqrt(raw/(2 E_coll)); because E_coll << 1 the order-correction amplifies the gap (10.5x -> ~414x, all three forms hundreds-of-x E_coll), so it does NOT become a same-order inequality',
    holds: () => {
      const mapErr = ['free', 'p1', 'p2'].every((_, i) => {
        const raw = [RAW_FREE, RAW_P1, RAW_P2][i];
        const tv = [TV_FREE, TV_P1, TV_P2][i];
        return Math.abs(closedMap(raw) - tv) < 1e-9;
      });
      return (
        mapErr &&
        AMP_FREE > 30 && AMP_FREE < 50 && // ~39.4x amplification, NOT ~1x (would be same-order)
        TV_FREE > 400 && TV_P2 > 550 && TV_P1 > 700 && // all hundreds-of-x E_coll
        // amplification decreases with raw ratio (amp = 1/sqrt(2 E_coll raw))
        (TV_FREE / RAW_FREE) > (TV_P1 / RAW_P1)
      );
    },
  },
  {
    // The sqrt reduction compresses the inter-form bracket to its square root while preserving direction.
    id: 'imp35617-inter-form-spread-compresses-to-sqrt',
    description: 'the raw ~3.566x model bracket (p1/free) becomes ~1.888x = sqrt(3.566) under the Pinsker reduction, compressing the inter-form disagreement to its square root',
    holds: () =>
      Math.abs(RAW_BRACKET - 3.566) < 0.01 &&
      Math.abs(TV_BRACKET - Math.sqrt(RAW_BRACKET)) < 1e-9 &&
      TV_BRACKET > 1 && TV_BRACKET < RAW_BRACKET, // compressed but still directional
  },
  {
    // Honesty gate: assessment only, upper-bound-only (no direction certified), sub-gaps stay open, no bound moves, no refereed bound is changed, NO QED.
    id: 'imp35617-honest-assessment-no-bound-moves-no-qed',
    description: 'ASSESSMENT ONLY: the ordering survives as an amplified UPPER-bound-only gap that cannot certify direction, sub-gaps imp-35530a/b/imp-35337a/imp-35556a stay OPEN, no bound moves, PT 0.2 unchanged, NO QED',
    holds: () =>
      IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /UPPER-bound-only/i.test(IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING.verdict) &&
      IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING.inheritsOpen.includes('imp-35556a') &&
      IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING.inheritsOpen.includes('imp-35337a') &&
      /imp-486/.test(IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING.verdict) &&
      /changes no bound/.test(IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING.verdict) &&
      /NO QED/.test(IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING.verdict) &&
      /refereed bound is changed/i.test(IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING.verdict),
  },
];

for (const a of IMP35617_PINSKER_TV_RERANKING_CROSSOVER_ORDERING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35617-pinsker-tv-reranking-crossover-ordering assertion failed: ${a.id}`);
  }
}
