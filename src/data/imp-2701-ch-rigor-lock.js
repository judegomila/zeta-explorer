/**
 * imp-2701 — C_H honest-classification tripwire lock.
 *
 * PURPOSE
 *   The honest NO-GO verdict on the finite-height Lambda < 0.2 beat hinges on a
 *   single source of truth: C_H is NOT a rigorous upper bound on the Holder-1/2
 *   modulus (imp-2642). imp-2643 reads
 *     C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.isRigorousUpperBound (false)
 *   to gate its RIGOROUS_BEAT flag and keep the verdict at NO-GO / stays SOTA.
 *
 *   A future edit flipping that flag to true (or any sibling re-introducing
 *   C_H = 1/8 as "rigorous") would SILENTLY re-introduce the withdrawn overclaim
 *   that the finite-N route rigorously beats Platt-Trudgian. This module is a
 *   build-time lock that throws the moment any of the three honest-classification
 *   invariants is violated.
 *
 * INVARIANTS LOCKED (all must hold while C_H is unproven)
 *   (a) C_H is NOT classified as a rigorous upper bound
 *       (isRigorousUpperBound === false).
 *   (b) The finite-N route module that exports a rigorousBeat field
 *       (IMP2643_HONEST_ASSEMBLED_EN) resolves rigorousBeat === false while
 *       C_H is unproven, and its C_C constant is the (1/8) sqrt(3 pi) ANSATZ
 *       (C_C_PINNED), not a discharged rigorous value.
 *   (c) The verdict string still contains both "NO-GO" and "stays SOTA"
 *       (no false QED).
 *
 * This file is side-effect-imported by assertion-sweep-2026-04-12.js so the
 * throws below stay reachable from the production import graph (per the repo
 * dead-assertion audit pattern, imp-501 / imp-2702).
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642 } from './polymath15-lemma52-shock-holder.js';
import { IMP2643_HONEST_ASSEMBLED_EN } from './imp-2643-honest-assembled-EN.js';

// (1) C_H rigor flag — the single source of truth gating the honest verdict.
const C_H_IS_RIGOROUS = C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.isRigorousUpperBound;

// (2) Finite-N=1e4 route rigorousBeat flag (imp-2643) — must stay false while C_H is unproven.
const FINITE_N_RIGOROUS_BEAT = IMP2643_HONEST_ASSEMBLED_EN.rigorousBeat;

// (3) The DOMINANT E_coll constant is the C_H = 1/8 ansatz, C_C = (1/8) sqrt(3 pi).
const C_C_ANSATZ_VALUE = 0.125 * Math.sqrt(3 * Math.PI); // approx 0.38375

export const IMP2701_CH_RIGOR_LOCK = {
  id: 'imp-2701',
  title: 'C_H honest-classification tripwire lock',
  guards: {
    cHIsRigorous: C_H_IS_RIGOROUS,                 // must be false
    finiteNRigorousBeat: FINITE_N_RIGOROUS_BEAT,   // must be false
    cCPinnedIsAnsatz: Math.abs(C_C_PINNED - C_C_ANSATZ_VALUE) < 1e-9, // C_C = (1/8) sqrt(3 pi)
    verdictNoGo: /NO-GO/.test(IMP2643_HONEST_ASSEMBLED_EN.verdict),
    verdictStaysSota: /stays SOTA/.test(IMP2643_HONEST_ASSEMBLED_EN.verdict),
  },
  rationale:
    'C_H is the linchpin of the honest NO-GO verdict. This lock fails the build if ' +
    'the C_H rigor flag, the finite-N rigorousBeat flag, or the NO-GO/stays-SOTA ' +
    'verdict string is ever flipped to re-introduce the withdrawn finite-N beat overclaim.',
  source: 'imp-2642 (C_H not rigorous); imp-2643 (honest assembled E(N), NO-GO); imp-2701 (this lock)',
};

export const IMP2701_CH_RIGOR_LOCK_ASSERTIONS = [
  {
    id: 'imp2701-ch-not-rigorous',
    description: '(a) C_H is NOT classified as a rigorous upper bound (isRigorousUpperBound === false)',
    holds: () => C_H_IS_RIGOROUS === false,
  },
  {
    id: 'imp2701-finite-N-no-rigorous-beat',
    description: '(b) The finite-N route rigorousBeat resolves to false while C_H is unproven, on the C_C ansatz',
    holds: () =>
      FINITE_N_RIGOROUS_BEAT === false &&
      Math.abs(C_C_PINNED - C_C_ANSATZ_VALUE) < 1e-9,
  },
  {
    id: 'imp2701-verdict-nogo-stays-sota',
    description: '(c) The honest verdict string still contains both NO-GO and stays SOTA (no false QED)',
    holds: () =>
      /NO-GO/.test(IMP2643_HONEST_ASSEMBLED_EN.verdict) &&
      /stays SOTA/.test(IMP2643_HONEST_ASSEMBLED_EN.verdict),
  },
];

for (const a of IMP2701_CH_RIGOR_LOCK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2701-ch-rigor-lock assertion failed: ${a.id}`);
  }
}
