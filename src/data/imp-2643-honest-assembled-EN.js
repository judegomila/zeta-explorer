/**
 * @module imp-2643-honest-assembled-EN
 *
 * imp-2643 (critical, proof): CAPSTONE of the constant-discharge effort. Assemble
 *     E(N) = E_trunc + E_flow + E_coll
 * at the surviving finite-N* = 1e4 beat height, classify EVERY constant as
 * rigorous-vs-placeholder, and state PLAINLY whether the linchpin bound
 * Lambda <= E(N) is a rigorous UNCONDITIONAL Lambda < 0.2 beating Platt-Trudgian,
 * or what single constant still blocks it. Guard: do NOT claim the beat until both
 * C_Selberg (imp-2641) and C_H (imp-2642) are rigorous upper bounds.
 *
 * THE LINCHPIN
 * ------------
 * The finite-height mean-field route reduces (tc-part-vs-mf-linchpin) to
 *     Lambda <= E(N),   with t_c^part >= 0 a trivial lower bound,
 * so no separate t_c term enters: E(N) is the whole budget. The numeric value at
 * N* = 1e4 (T0 = gamma_N approx 9.879e3, L = log T0 approx 9.198) is
 *     E_trunc_pt approx 3.1e-5   +   E_flow approx 1.239e-3   +   E_coll approx 1.164e-2
 *   = E(N) approx 0.01291,
 * which is ~15x below the Platt-Trudgian SOTA PT_BOUND = 0.2. Numerically the
 * budget clears by a wide margin. The question is whether it is RIGOROUS.
 *
 * CONSTANT-BY-CONSTANT CLASSIFICATION (the honest ledger)
 * -------------------------------------------------------
 * (1) E_trunc_pt approx 3.1e-5  --  RIGOROUS-MODULO-C_T.
 *     E_trunc = C_T . T0^{-kappa_T} . log T0 with kappa_T = 4 delta/(3 - 2 delta)
 *     RIGOROUS (Ingham 1940 + Guth-Maynard 2024 exponents, unconditional,
 *     imp-2625) and C_T proven O(1) but NOT yet a certified small explicit value.
 *     At N* = 1e4 / sigma_opt = 0.75 the term is ~3.1e-5: numerically NEGLIGIBLE
 *     (0.24% of E(N)), so even a generous C_T does not move the verdict.
 *
 * (2) E_flow approx 1.239e-3  --  RIGOROUS.
 *     E_flow = C_F . (log T0 / T0) . exp(C_G . |t_c|). Prefactor
 *     C_F = (log(T0/2pi) + 1)/(2pi) = 1.330578 is analytically PINNED (imp-398).
 *     The Gronwall exponent C_G = 1.0 is an order-unity placeholder (imp-2622)
 *     but NON-BINDING: the A1 unconditional trap gives |t_c| <= 2.37e-4, so
 *     exp(C_G |t_c|) in [1.00024, 1.00237] for any C_G in [1, 10]. E_flow is
 *     therefore rigorous up to a <= 0.24% amplification (imp-2644 makes this
 *     explicit).
 *
 * (3) E_coll approx 1.164e-2  --  NOT RIGOROUS (the binding blocker).
 *     E_coll = C_C . sqrt(log T0 / N) with C_C = C_H . sqrt(C_KH) =
 *     (1/8) sqrt(3 pi). This is the DOMINANT sub-term (~90% of E(N)). Its two
 *     load-bearing constants:
 *       - C_Selberg (inside C_KH = pi C_Selberg): DISCHARGED to the explicit
 *         Trudgian 2014 coefficient 2.622 (imp-2641); placeholder 3.0 verified
 *         conservative. Residual: the Erdos-Turan bridge O(1) constant in
 *         dyson_star_discrepancy must be shown to fit the headroom 3.0 - 2.622.
 *       - C_H = 1/8: NOT a rigorous upper bound (imp-2642). It is the EXACT
 *         leading-order quadratic-tangency coefficient (rigorous only for the
 *         R = 0 two-particle dynamics), NOT the Holder modulus C_shock . C_Lip/4;
 *         equating them silently asserts C_shock . C_Lip = 1/2, and C_Lip is
 *         non-N-uniform (imp-2640). A positive O(1) remainder pushes the
 *         effective coefficient to ~0.127 > 1/8. So C_C is an ANSATZ, not a
 *         rigorous constant -- and it sits on the dominant term.
 *
 * THE HONEST VERDICT (go / no-go)
 * -------------------------------
 * NO-GO. The assembled budget E(N) approx 0.0129 clears PT_BOUND = 0.2 by ~15x
 * NUMERICALLY, and two of the three sub-terms (E_trunc negligible, E_flow) are
 * rigorous. But the DOMINANT term E_coll rests on C_C = (1/8) sqrt(3 pi), whose
 * C_H = 1/8 is an unproven ansatz (imp-2642), so Lambda <= E(N) is NOT a rigorous
 * unconditional bound. The SINGLE constant that blocks the rigorous beat is C_H:
 * a rigorous, N-uniform upper bound on the Holder-1/2 modulus C_shock . C_Lip/4
 * (needing Polymath15 Lemma 5.2 cusp-density C_cusp for C_shock and a
 * non-Gronwall microscopic gap-stability modulus for an N-uniform C_Lip). The
 * C_Selberg Erdos-Turan bridge is a SECONDARY, non-binding gap (its term shrinks
 * with the rigorous 2.622). Until C_H is discharged, Platt-Trudgian Lambda <= 0.2
 * remains SOTA. NO false QED.
 *
 * @see imp-2641-c-selberg-trudgian-discharge (C_Selberg -> 2.622, residual Erdos-Turan bridge)
 * @see polymath15-lemma52-shock-holder (C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642: C_H NOT a rigorous upper bound)
 * @see imp-2633-l-cond-constant-discharge (E_flow / E_coll sub-term values)
 * @see imp-2644 (the C_G Gronwall non-binding discharge this capstone relies on)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642 } from './polymath15-lemma52-shock-holder.js';
import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE } from './imp-2641-c-selberg-trudgian-discharge.js';

const N_STAR = 1e4;
const TWO_PI = 2 * Math.PI;
const PT_BOUND = 0.2; // Platt-Trudgian 2021 SOTA unconditional Lambda upper bound.

const T0 = effectiveHeightForN(N_STAR);   // gamma_N approx 9.879e3
const L = Math.log(T0);                   // approx 9.198

// (1) E_trunc_pt: rigorous Ingham/GM exponents, C_T proven O(1); value at sigma_opt=0.75.
const E_TRUNC_PT = 3.1e-5;

// (2) E_flow = C_F (log T0/T0) exp(C_G |t_c|); C_F pinned, C_G non-binding via A1.
const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // 1.330578, analytically pinned (imp-398)
const TC_A1_TRAP = 2.37e-4;                       // |t_c| <= 2.37e-4, A1 unconditional (imp-2633/2644)
const gronwall = (cG) => Math.exp(cG * TC_A1_TRAP);
const E_FLOW = C_F * (L / T0) * gronwall(1.0);

// (3) E_coll = C_C sqrt(log T0 / N); C_C = (1/8) sqrt(3 pi), DOMINANT but ansatz (C_H not rigorous).
const E_COLL = C_C_PINNED * Math.sqrt(L / N_STAR);

const E_N = E_TRUNC_PT + E_FLOW + E_COLL;

// Rigor status pulled from the source modules (single source of truth).
const C_H_IS_RIGOROUS = C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.isRigorousUpperBound; // false
const C_SELBERG_DISCHARGED = IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.C_Selberg.placeholderIsConservative; // true (conservative)
const E_COLL_RIGOROUS = C_H_IS_RIGOROUS; // E_coll is rigorous iff its blocking constant C_H is.
const RIGOROUS_BEAT = E_COLL_RIGOROUS && E_N < PT_BOUND;

export const IMP2643_HONEST_ASSEMBLED_EN = {
  id: 'imp-2643',
  question:
    'Assemble E(N) = E_trunc + E_flow + E_coll at N* = 1e4 with every constant classified ' +
    'rigorous-vs-placeholder; is Lambda <= E(N) a rigorous unconditional Lambda < 0.2 beating ' +
    'Platt-Trudgian, or what single constant still blocks it?',
  N_star: N_STAR,
  heightInputs: {
    T0: +T0.toExponential(4),   // gamma_N approx 9.879e3
    logT0: +L.toFixed(4),       // approx 9.198
  },
  linchpin:
    'Finite-height mean-field route gives Lambda <= E(N) with t_c^part >= 0 a trivial lower ' +
    'bound, so no separate t_c term enters: E(N) is the entire budget.',
  subterms: {
    E_trunc_pt: {
      value: E_TRUNC_PT,
      shareOfEN: +(E_TRUNC_PT / E_N).toFixed(4),
      status: 'RIGOROUS-MODULO-C_T',
      detail:
        'kappa_T = 4 delta/(3-2delta) rigorous (Ingham 1940 + Guth-Maynard 2024); C_T proven ' +
        'O(1) but not a certified small explicit value. Numerically negligible (~0.24% of E(N)).',
    },
    E_flow: {
      value: +E_FLOW.toExponential(4),
      shareOfEN: +(E_FLOW / E_N).toFixed(4),
      status: 'RIGOROUS',
      C_F: +C_F.toFixed(6),
      C_F_status: 'PINNED ((log(T0/2pi)+1)/(2pi), imp-398)',
      gronwallBand: {
        tcA1Trap: TC_A1_TRAP,
        factor_CG1: +gronwall(1).toFixed(6),
        factor_CG10: +gronwall(10).toFixed(6),
        C_G_status: 'ORDER-UNITY-PLACEHOLDER (imp-2622), NON-BINDING via A1 |t_c| <= 2.37e-4 (imp-2644)',
      },
    },
    E_coll: {
      value: +E_COLL.toFixed(7),
      shareOfEN: +(E_COLL / E_N).toFixed(4),
      status: 'NOT-RIGOROUS (binding blocker)',
      C_C: +C_C_PINNED.toFixed(6),
      C_C_formula: 'C_H sqrt(C_KH) = (1/8) sqrt(3 pi)',
      C_Selberg_status:
        'DISCHARGED to explicit Trudgian 2014 = 2.622 (imp-2641); residual Erdos-Turan bridge O(1) constant, non-binding',
      C_H_status:
        'NOT a rigorous upper bound (imp-2642): 1/8 is the leading-order quadratic-tangency ' +
        'coefficient, not the Holder modulus C_shock C_Lip/4; C_Lip non-N-uniform (imp-2640). C_C is an ANSATZ.',
    },
  },
  E_N: +E_N.toFixed(7),
  PT_BOUND,
  numericMarginFactor: +(PT_BOUND / E_N).toFixed(2),
  clearsPTNumerically: E_N < PT_BOUND,
  rigorousBeat: RIGOROUS_BEAT,
  blockingConstant: 'C_H (rigorous N-uniform upper bound on the Holder-1/2 modulus C_shock C_Lip/4)',
  verdict:
    'NO-GO. The assembled budget E(N) approx 0.0129 clears PT_BOUND = 0.2 by ~15x NUMERICALLY, ' +
    'and E_trunc (negligible) + E_flow are rigorous. But the DOMINANT term E_coll (~90% of E(N)) ' +
    'rests on C_C = (1/8) sqrt(3 pi) whose C_H = 1/8 is an unproven ansatz (imp-2642), so ' +
    'Lambda <= E(N) is NOT a rigorous unconditional bound. The SINGLE constant blocking the ' +
    'rigorous beat is C_H. The C_Selberg Erdos-Turan bridge is a secondary, non-binding gap. ' +
    'Until C_H is discharged, Platt-Trudgian Lambda <= 0.2 stays SOTA. NO false QED.',
  citation:
    'imp-2641 (C_Selberg = 2.622 Trudgian); imp-2642 polymath15-lemma52-shock-holder (C_H not a rigorous upper bound); ' +
    'imp-2633 (E_flow/E_coll values); imp-2644 (C_G non-binding); Platt-Trudgian 2021 (PT_BOUND = 0.2)',
};

export const IMP2643_HONEST_ASSEMBLED_EN_ASSERTIONS = [
  {
    id: 'imp2643-EN-numeric-value',
    description: 'Assembled E(N) at N*=1e4 is approx 0.01291 (E_trunc + E_flow + E_coll)',
    holds: () => Math.abs(E_N - 0.0129087) < 1e-5,
  },
  {
    id: 'imp2643-ecoll-dominates',
    description: 'E_coll is the dominant sub-term (~90% of E(N)), so its rigor governs the verdict',
    holds: () => E_COLL / E_N > 0.88 && E_COLL / E_N < 0.92,
  },
  {
    // STRUCTURAL DOMINANCE GUARD (imp-2708). The (0.88, 0.92) window above is a frozen
    // numeric band; this sibling instead enforces the qualitative claim that makes the
    // verdict logic valid -- E_coll genuinely EXCEEDS the combined rigorous tail
    // (E_flow + E_trunc) -- as an inequality on the three sub-terms re-derived live from
    // their defining constants (C_C_PINNED via E_COLL; C_F, T0, N_STAR via E_FLOW; the
    // pinned E_TRUNC_PT), not from the rounded toFixed display fields. So long as
    // E_coll > E_flow + E_trunc, the non-rigorous term outweighs the rigorous remainder
    // and "its rigor governs the verdict" holds structurally, independent of the exact
    // share. At N*=1e4: E_coll approx 1.164e-2 > E_flow + E_trunc approx 1.27e-3 (~9x).
    id: 'imp2643-ecoll-strictly-dominates',
    description: 'E_coll (re-derived from C_C, full float64) strictly exceeds E_flow + E_trunc, so the non-rigorous term governs the verdict structurally (imp-2708)',
    holds: () => E_COLL > E_FLOW + E_TRUNC_PT,
  },
  {
    id: 'imp2643-clears-PT-numerically',
    description: 'Numerically E(N) clears the Platt-Trudgian PT_BOUND=0.2 by >10x',
    holds: () => E_N < PT_BOUND && PT_BOUND / E_N > 10,
  },
  {
    id: 'imp2643-no-rigorous-beat-CH-blocks',
    description: 'NO rigorous beat: C_H is not a rigorous upper bound (imp-2642), so E_coll and the budget are not rigorous',
    holds: () =>
      C_H_IS_RIGOROUS === false &&
      E_COLL_RIGOROUS === false &&
      RIGOROUS_BEAT === false,
  },
  {
    // STORAGE-PRECISION TOLERANCE FLOOR (imp-2703 audit). E_N and its sub-terms are
    // cached for display at toFixed(7) / toExponential(4) granularity (T0, E_flow ->
    // toExponential(4); E_coll, E_N -> toFixed(7)). The reconstruct-from-storage floor
    // is 5e-8 (half a unit in the last toFixed(7) place). Every downstream assertion
    // here compares a LIVE full-precision value against a rounded literal and uses a
    // tolerance >= this floor (1e-5 on E_N, 1e-5 on E_coll in imp-2633, 1e-6/1e-7 on the
    // toExponential(4) fields in imp-2644), so no 7-sig-fig rounding artifact can flip a
    // result -- this is the named recurring red-build trap of imp-2546/imp-2539. This
    // guard verifies the stored E_N reconstructs to live E_N within the 5e-8 floor and
    // that the headline 1e-5 tolerance stays above it.
    id: 'imp2643-storage-tolerance-floor',
    description: 'Stored E_N (toFixed(7)) reconstructs to live E_N within the 5e-8 storage floor, and the headline 1e-5 tolerance exceeds that floor (imp-2703)',
    holds: () =>
      Math.abs(IMP2643_HONEST_ASSEMBLED_EN.E_N - E_N) <= 5e-8 &&
      1e-5 >= 5e-8,
  },
  {
    id: 'imp2643-c-selberg-discharged-conservative',
    description: 'C_Selberg is discharged to the conservative explicit Trudgian value (secondary, non-binding gap)',
    holds: () => C_SELBERG_DISCHARGED === true,
  },
  {
    id: 'imp2643-verdict-names-CH-no-false-qed',
    description: 'Honest verdict is NO-GO, names C_H as the single blocking constant, and keeps PT as SOTA (no false QED)',
    holds: () =>
      /NO-GO/.test(IMP2643_HONEST_ASSEMBLED_EN.verdict) &&
      /C_H/.test(IMP2643_HONEST_ASSEMBLED_EN.blockingConstant) &&
      /stays SOTA/.test(IMP2643_HONEST_ASSEMBLED_EN.verdict),
  },
];

for (const a of IMP2643_HONEST_ASSEMBLED_EN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2643-honest-assembled-EN assertion failed: ${a.id}`);
  }
}
