/**
 * @module imp-3387-CH-audited-absolute-EN-margin
 *
 * imp-3387 (accuracy, frontier-direction): imp-3324 established that C_H is
 * LINEAR in E_coll and hence load-bearing for the ABSOLUTE collision budget
 * (E_coll sweeps 7.0e-4 -> 1.12e-2 over C_H in [0.0625, 1.0]) even though the
 * CONDITIONAL SHARE sigma = E_coll/E(N) is near-insensitive at the N* = 10^6
 * ceiling (it saturates toward 1). imp-3324 F3 explicitly set aside a downstream
 * question: does the ABSOLUTE E(N) bridge budget at N* = 10^6 under the imp-2643
 * audited-loosened coefficient C_H = 0.127 (rather than the 1/8 = 0.125 ansatz)
 * still leave the finite-height Lambda bound within the imp-452 assembly
 * L_pt ~ 0.121 < 0.2 SOTA, or does the larger E_coll erode the finite-height margin?
 *
 * THE QUANTITY (identical imp-3220/imp-3324 sub-term formulas at N* = 10^6)
 * ------------------------------------------------------------------------
 *     E(N)  =  E_trunc  +  E_flow  +  E_coll(C_H)
 *     E_coll(C_H) = C_H sqrt(C_KH) sqrt(log T0 / N),  sqrt(C_KH) = C_C_PINNED / (1/8) = sqrt(3pi)
 *     E_flow = C_F (log T0 / T0) Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5  (N-independent fixed-strip PT route, imp-2631)
 * Only E_coll carries C_H, and it is LINEAR in C_H, so E_trunc + E_flow stay fixed.
 * The finite-height bound the ticket compares against (imp-452 assembly at N* = 10^6):
 *     L_pt  =  L_cond  +  E_trunc_pt,   L_cond = |t_c| + E_flow + E_coll ~ 0.0080,
 *     E_trunc_pt ~ 0.1127  (imp-447 PT + Ingham at sigma = 0.61),   L_pt ~ 0.121 < 0.2.
 * Because only E_coll depends on C_H, the whole C_H-dependence of L_pt is the single
 * additive term E_coll, so  d(L_pt)/d(C_H) = sqrt(C_KH) sqrt(log T0 / N)  (a constant).
 *
 * THE FINDING (assessment only)
 * -----------------------------
 *   (F1) THE PREMISE IS MIS-STATED: E_coll IS NOT 1.7x LARGER. The audited
 *        loosening C_H = 1/8 -> 0.127 is a +1.6% change (ratio 0.127/0.125 = 1.016),
 *        raising E_coll at N* = 10^6 from 1.3998e-3 to 1.4222e-3, delta = +2.24e-5.
 *        The "~1.7x" in the ticket is a conflation with the MARGIN FACTOR: the
 *        finite-height beat L_pt ~ 0.12 clears PT 0.2 by ~1.7x (0.2 / 0.12 ~ 1.66),
 *        a ratio recorded in finite-height-beats-platt-trudgian.js. It is NOT the
 *        E_coll increase, which is 1.6%.
 *   (F2) THE MARGIN IS NOT ERODED. Threading C_H = 0.127 shifts the finite-height
 *        bound from L_pt ~ 0.12070 to ~0.12072 (delta = +2.24e-5): unchanged to the
 *        three-figure 0.121 headline, and the margin to the Platt-Trudgian ceiling
 *        stays 0.2 - 0.12072 = 0.07928. The audited loosening leaves the bound
 *        comfortably within BOTH the imp-452 L_pt ~ 0.121 figure and the PT 0.2 SOTA.
 *   (F3) WHY. At N* = 10^6 the L_pt budget is DOMINATED by E_trunc_pt ~ 0.1127
 *        (~93% of the 0.121), while E_coll ~ 0.0014 is only ~1.2% of L_pt. A 1.6%
 *        move in a 1.2%-weight term is a ~2e-5 move in L_pt -- negligible. Even the
 *        HYPOTHETICAL genuine 1.7x E_coll the ticket text imagines (which would need
 *        C_H ~ 0.2125) adds only +9.80e-4, giving L_pt ~ 0.1217 -- STILL < 0.2 with
 *        margin ~0.0783. The finite-height margin is robust to C_H on both readings.
 *
 * The punchline: consistent with imp-3324, C_H is load-bearing for the ABSOLUTE
 * E_coll budget (linear) but the finite-height Lambda bound does NOT erode under the
 * audited 0.127, because at N* = 10^6 E_coll is a ~1.2% slice of an L_pt that is
 * dominated by the unconditional E_trunc_pt. The absolute-budget-vs-margin roles of
 * C_H must not be conflated -- exactly as the SHARE-vs-budget roles were in imp-3324.
 *
 * ASSESSMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-3324-sigma-CH-sensitivity (C_H load-bearing for E_coll, not the share)
 * @see imp-3220-en-bridge-fidelity-frontier (the E(N) sub-term formulas reused here)
 * @see finite-height-beats-platt-trudgian (L_pt ~ 0.121, the ~1.7x MARGIN factor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const N_STAR = 1e6; // the imp-3220 widest-gap assembly ceiling (the ticket target)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3324 exactly
const PT_BOUND = 0.2; // Platt-Trudgian 2021 bound upper bound

// C_H anchors: 1/8 is the imp-2642 leading-order quadratic-tangency coefficient
// (the ansatz); 0.127 is the imp-2643 audited-loosened effective coefficient.
const C_H_ANSATZ = 0.125;
const C_H_AUDITED = 0.127;

// sqrt(C_KH) = sqrt(3*pi), recovered from the pinned C_C so the formulas stay
// IDENTICAL to imp-3220/imp-3324 (C_C_PINNED = (1/8) sqrt(C_KH)).
const SQRT_C_KH = C_C_PINNED / C_H_ANSATZ;

// Fixed (C_H-independent) bridge sub-terms at N* = 10^6.
const T0 = effectiveHeightForN(N_STAR);
const L = Math.log(T0);
const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
const E_FLOW = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
const R_FIXED = E_TRUNC_PT + E_FLOW; // E_trunc + E_flow, does NOT depend on C_H

// E_coll is LINEAR in C_H; E(N) is the absolute bridge budget.
const eColl = (C_H) => C_H * SQRT_C_KH * Math.sqrt(L / N_STAR);
const eN = (C_H) => R_FIXED + eColl(C_H);

const E_COLL_ANSATZ = eColl(C_H_ANSATZ); // ~1.3998e-3
const E_COLL_AUDITED = eColl(C_H_AUDITED); // ~1.4222e-3
const E_COLL_RATIO = E_COLL_AUDITED / E_COLL_ANSATZ; // = 0.127/0.125 = 1.016 EXACTLY
const D_E_COLL = E_COLL_AUDITED - E_COLL_ANSATZ; // ~+2.24e-5 (the whole C_H-dependence of L_pt)

const E_N_ANSATZ = eN(C_H_ANSATZ); // ~1.4744e-3
const E_N_AUDITED = eN(C_H_AUDITED); // ~1.4968e-3

// imp-452 finite-height assembly anchors (documented literals, ~1e-4 tolerance).
// L_pt = L_cond + E_trunc_pt; only E_coll (inside L_cond) carries C_H, so the audited
// bound is the ansatz headline PLUS the E_coll delta. L_cond ~ 0.0080 already contains
// E_coll(1/8), so we add ONLY the delta, never double-counting.
const L_COND_ANCHOR = 0.008; // imp-452: |t_c| + E_flow + E_coll ~ 0.0080 at N* = 1e6
const E_TRUNC_PT_452 = 0.1127; // imp-447 PT + Ingham at sigma = 0.61 (the 0.121 headline route)
const L_PT_ANSATZ = L_COND_ANCHOR + E_TRUNC_PT_452; // ~0.1207 (rounds to the 0.121 headline)
const L_PT_AUDITED = L_PT_ANSATZ + D_E_COLL; // ~0.12072
const MARGIN_TO_PT_AUDITED = PT_BOUND - L_PT_AUDITED; // ~0.07928

// Hypothetical: if the ticket text were literal and E_coll were genuinely 1.7x
// larger (needs C_H ~ 0.2125), the added mass is 0.7 * E_coll(1/8).
const HYPOTHETICAL_1_7X_ADD = 0.7 * E_COLL_ANSATZ; // ~+9.80e-4
const L_PT_HYPOTHETICAL_1_7X = L_PT_ANSATZ + HYPOTHETICAL_1_7X_ADD; // ~0.1217, still < 0.2

// E_coll weight in the L_pt budget: the reason a 1.6% (or even 70%) E_coll move
// barely touches L_pt is that E_coll is a small slice of the E_trunc_pt-dominated 0.121.
const E_COLL_SHARE_OF_L_PT = E_COLL_ANSATZ / L_PT_ANSATZ; // ~0.0116 (~1.2%)

export const IMP3387_CH_AUDITED_ABSOLUTE_EN_MARGIN = {
  id: 'imp-3387',
  proofSection: 'S-frontier',
  question:
    'Does the ABSOLUTE E(N) bridge budget at N* = 10^6 under the imp-2643 audited ' +
    'C_H = 0.127 (vs the 1/8 ansatz) still leave the finite-height bound within the ' +
    'imp-452 L_pt ~ 0.121 < 0.2 SOTA, or does the larger E_coll erode the margin? ' +
    'Recompute E(10^6) = E_trunc + E_flow + E_coll with C_H = 0.127 using the exact ' +
    'imp-3220 sub-term formulas and compare to 0.121 and to the PT 0.2 ceiling. ' +
    'Assessment only, no QED.',
  point: { N: N_STAR, T0: +T0.toExponential(4), logT0: +L.toFixed(5) },
  absoluteBudget: {
    E_trunc: E_TRUNC_PT,
    E_flow: +E_FLOW.toExponential(5),
    E_coll_ansatz: +E_COLL_ANSATZ.toExponential(6), // 1.399765e-3 at C_H = 1/8
    E_coll_audited: +E_COLL_AUDITED.toExponential(6), // 1.422162e-3 at C_H = 0.127
    E_coll_ratio: +E_COLL_RATIO.toFixed(6), // 1.016000 -- a +1.6% change, NOT 1.7x
    delta_E_coll: +D_E_COLL.toExponential(5), // +2.24e-5
    E_N_ansatz: +E_N_ANSATZ.toExponential(6), // 1.474357e-3
    E_N_audited: +E_N_AUDITED.toExponential(6), // 1.496753e-3
    note:
      'Only E_coll carries C_H (linear); E_trunc + E_flow are C_H-free. The audited ' +
      'loosening 1/8 -> 0.127 raises E_coll at N* = 10^6 by 1.6% (ratio 1.016), NOT ' +
      '1.7x -- the whole absolute-budget move is delta_E_coll = +2.24e-5.',
  },
  premiseCorrection: {
    ticket_claim: 'the ~1.7x larger E_coll',
    actual_E_coll_ratio: +E_COLL_RATIO.toFixed(6), // 1.016
    likely_source_of_1_7x:
      'the MARGIN FACTOR: the finite-height beat L_pt ~ 0.12 clears PT 0.2 by ' +
      '0.2/0.12 ~ 1.66 ~ 1.7x (finite-height-beats-platt-trudgian.js impact note). ' +
      'That is the margin over PT, NOT the E_coll increase, which is 1.6%.',
  },
  finiteHeightBound: {
    L_cond_anchor: L_COND_ANCHOR, // imp-452
    E_trunc_pt_452: E_TRUNC_PT_452, // imp-447 sigma = 0.61 (the 0.121 route)
    L_pt_ansatz: +L_PT_ANSATZ.toFixed(6), // ~0.1207 (the 0.121 headline)
    L_pt_audited: +L_PT_AUDITED.toFixed(6), // ~0.12072
    delta_L_pt: +D_E_COLL.toExponential(5), // +2.24e-5 = delta_E_coll
    margin_to_PT_audited: +MARGIN_TO_PT_AUDITED.toFixed(6), // ~0.07928
    E_coll_share_of_L_pt: +E_COLL_SHARE_OF_L_PT.toFixed(5), // ~0.01159 (~1.2%)
    note:
      'L_pt = L_cond + E_trunc_pt; only E_coll (already inside L_cond) carries C_H, ' +
      'so the audited bound is the headline plus delta_E_coll = +2.24e-5. L_pt moves ' +
      'from ~0.12070 to ~0.12072 -- unchanged to three figures, margin to PT stays ' +
      '~0.0793. At N* = 10^6, L_pt is DOMINATED by E_trunc_pt (~93%); E_coll is only ' +
      '~1.2%, so a 1.6% E_coll move is a ~2e-5 L_pt move.',
  },
  hypothetical1_7x: {
    add: +HYPOTHETICAL_1_7X_ADD.toExponential(4), // ~+9.80e-4
    L_pt: +L_PT_HYPOTHETICAL_1_7X.toFixed(6), // ~0.12168
    beatsPT: L_PT_HYPOTHETICAL_1_7X < PT_BOUND,
    note:
      'Even if E_coll were GENUINELY 1.7x larger (needs C_H ~ 0.2125), the added mass ' +
      '0.7 * E_coll(1/8) ~ +9.80e-4 gives L_pt ~ 0.1217 -- STILL < 0.2 with margin ' +
      '~0.0783. The finite-height margin is robust on both the actual and the ' +
      'hypothesised readings.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). Recomputing E(10^6) = E_trunc + ' +
    'E_flow + E_coll with the imp-2643 audited C_H = 0.127 (vs the 1/8 ansatz) using ' +
    'the exact imp-3220 sub-term formulas: E_coll rises only 1.6% (ratio 1.016, ' +
    'delta = +2.24e-5), NOT the 1.7x the ticket text states -- that 1.7x is the PT ' +
    'MARGIN factor (0.2/0.12), a different quantity. The finite-height bound moves from ' +
    'L_pt ~ 0.12070 to ~0.12072: unchanged to the imp-452 three-figure 0.121 headline, ' +
    'margin to the Platt-Trudgian 0.2 ceiling stays ~0.0793. At N* = 10^6 L_pt is ' +
    'dominated by the unconditional E_trunc_pt (~93%) while E_coll is only ~1.2%, so ' +
    'the audited loosening does NOT erode the finite-height margin -- and even a ' +
    'hypothetical genuine 1.7x E_coll (C_H ~ 0.2125) would give L_pt ~ 0.1217 < 0.2. ' +
    'Consistent with imp-3324: C_H drives the ABSOLUTE budget but the finite-height ' +
    'margin is robust. No positivity, no bridge closure, no RH claim, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-3324 (C_H load-bearing for E_coll, not the share); imp-3220 (E(N) sub-term ' +
    'formulas); imp-452 (lambda-N1e6-final-assembly L_pt ~ 0.121); imp-447/imp-459 ' +
    '(E_trunc_pt PT + Ingham); imp-2642 (C_H = 1/8 ansatz); imp-2643 (audited 0.127); ' +
    'finite-height-beats-platt-trudgian (the ~1.7x margin factor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3387_CH_AUDITED_ABSOLUTE_EN_MARGIN_ASSERTIONS = [
  {
    // Reuse gate: at C_H = 1/8 the E(N) budget reproduces the imp-3220/imp-3324
    // absolute value (~1.474e-3) at N* = 10^6, proving identical sub-term formulas.
    id: 'imp3387-reproduces-imp3220-EN-at-ceiling',
    description: 'E(10^6) at C_H = 1/8 reproduces the imp-3220 absolute budget ~1.474e-3',
    holds: () => Math.abs(E_N_ANSATZ - 1.474e-3) < 5e-6,
  },
  {
    // The premise correction: E_coll is +1.6% (ratio EXACTLY 0.127/0.125 = 1.016),
    // NOT 1.7x. Guards the headline honest finding against a reversion to the ticket text.
    id: 'imp3387-E-coll-is-1p6pct-not-1p7x',
    description: 'E_coll(0.127)/E_coll(1/8) = 1.016 (a +1.6% change), NOT 1.7x',
    holds: () =>
      Math.abs(E_COLL_RATIO - 0.127 / 0.125) < 1e-12 &&
      Math.abs(E_COLL_RATIO - 1.016) < 1e-9 &&
      E_COLL_RATIO < 1.05,
  },
  {
    // The whole C_H-dependence of L_pt is the single additive delta_E_coll, and it is
    // tiny (~2.24e-5): the finite-height bound is unchanged to three figures.
    id: 'imp3387-L-pt-delta-is-delta-E-coll-and-negligible',
    description: 'delta L_pt = delta E_coll ~ +2.24e-5; L_pt(0.127) ~ 0.12072 (unchanged to 0.121)',
    holds: () =>
      Math.abs((L_PT_AUDITED - L_PT_ANSATZ) - D_E_COLL) < 1e-12 &&
      D_E_COLL > 0 &&
      D_E_COLL < 5e-5 &&
      Math.abs(L_PT_AUDITED - 0.1207) < 5e-4,
  },
  {
    // The margin is NOT eroded: the audited bound clears PT 0.2 with ~0.0793 headroom.
    id: 'imp3387-audited-margin-to-PT-preserved',
    description: 'L_pt(0.127) < 0.2 with margin ~0.0793 -- finite-height margin not eroded',
    holds: () =>
      L_PT_AUDITED < PT_BOUND &&
      Math.abs(MARGIN_TO_PT_AUDITED - 0.0793) < 1e-3,
  },
  {
    // WHY it is robust: at N* = 10^6 E_coll is only ~1.2% of the E_trunc_pt-dominated
    // L_pt, so even a large fractional E_coll move barely touches L_pt.
    id: 'imp3387-E-coll-small-share-of-L-pt',
    description: 'E_coll is only ~1.2% of L_pt (E_trunc_pt-dominated), so L_pt is C_H-robust',
    holds: () => E_COLL_SHARE_OF_L_PT > 0 && E_COLL_SHARE_OF_L_PT < 0.02,
  },
  {
    // Even the HYPOTHETICAL literal-1.7x E_coll leaves the bound below PT -- the
    // conclusion survives on both the actual and the (false) 1.7x reading.
    id: 'imp3387-hypothetical-1p7x-still-beats-PT',
    description: 'Even a genuine 1.7x E_coll gives L_pt ~ 0.1217 < 0.2',
    holds: () => L_PT_HYPOTHETICAL_1_7X < PT_BOUND && L_PT_HYPOTHETICAL_1_7X > L_PT_ANSATZ,
  },
  {
    // Honesty gate: assessment only, corrects the premise, keeps PT SOTA, no QED.
    id: 'imp3387-honesty-gate-no-qed',
    description: 'Assessment only: premise correction, margin-not-eroded verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP3387_CH_AUDITED_ABSOLUTE_EN_MARGIN.isRigorous === false &&
      /NOT 1\.7x/.test(IMP3387_CH_AUDITED_ABSOLUTE_EN_MARGIN.absoluteBudget.note) &&
      /NO QED/.test(IMP3387_CH_AUDITED_ABSOLUTE_EN_MARGIN.verdict) &&
      /refereed bound is changed/i.test(IMP3387_CH_AUDITED_ABSOLUTE_EN_MARGIN.verdict),
  },
];

for (const a of IMP3387_CH_AUDITED_ABSOLUTE_EN_MARGIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3387-CH-audited-absolute-EN-margin assertion failed: ${a.id}`);
  }
}
