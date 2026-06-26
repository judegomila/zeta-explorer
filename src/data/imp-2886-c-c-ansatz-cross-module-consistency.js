/**
 * @module imp-2886-c-c-ansatz-cross-module-consistency
 *
 * imp-2886 (medium, numerical): Cross-module consistency tripwire pinning that
 * EVERY module which re-derives or consumes the C_H = 1/8 / C_C ansatz computes
 * the SAME float, within 1e-9, as the single canonical source C_C_PINNED.
 *
 * WHY THIS EXISTS (the gap it closes)
 *   The dominant E_coll constant C_C = C_H . sqrt(C_KH) = (1/8) . sqrt(3 pi)
 *   approx 0.383748 is the single most load-bearing NON-rigorous number in the
 *   program (prefactor of E_coll, ~90 percent of the assembled E(N)). Its value
 *   is duplicated and re-recorded across several reconciliation modules:
 *     - polymath15-constant-C-C.js exports the canonical C_C_PINNED.
 *     - imp-2643-honest-assembled-EN.js records it as subterms.E_coll.C_C.
 *     - imp-2633-l-cond-constant-discharge.js records it as subterms.E_coll.C_C.
 *     - c-c-selberg-refinement-2026-05.js records it as oldCC.
 *   Each module carries its OWN self-check against the literal, but nothing
 *   cross-checks that the value RECORDED in one consumer still agrees with the
 *   canonical source. A silent edit to one copy (e.g. dropping the sqrt(3 pi)
 *   factor in a downstream re-derivation, or hard-coding a stale 0.3837xx) would
 *   corrupt that module while imp-2701 / imp-2872 stay green. This tripwire makes
 *   such a drift fail the build.
 *
 * SCOPE (honest): pure numeric consistency. This does NOT touch the honest NO-GO
 * classification: C_H = 1/8 stays an ANSATZ (imp-2642), C_C stays non-rigorous on
 * the dominant term, and Lambda <= E(N) is NOT a rigorous beat (imp-2643 NO-GO,
 * Platt-Trudgian Lambda <= 0.2 stays SOTA). NO false QED.
 *
 * Self-executes its assertions on import (throws on failure); side-effect
 * imported by assertion-sweep-2026-04-12.js to stay reachable from the build.
 *
 * @see polymath15-constant-C-C.js (imp-399/imp-2714: canonical C_C_PINNED + guard)
 * @see imp-2872-c-c-pinned-value-lock.js (value-lock on C_C_PINNED itself)
 * @see imp-2701-ch-rigor-lock.js (C_H not rigorous; finite-N no rigorous beat)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP2643_HONEST_ASSEMBLED_EN } from './imp-2643-honest-assembled-EN.js';
import { IMP2633_L_COND_CONSTANT_DISCHARGE } from './imp-2633-l-cond-constant-discharge.js';
import { C_C_SELBERG_REFINEMENT } from './c-c-selberg-refinement-2026-05.js';

// The closed-form ansatz literal, re-multiplied independently of every module.
const C_C_ANSATZ_LITERAL = (1 / 8) * Math.sqrt(3 * Math.PI); // approx 0.3837475

// Canonical engine-consumed value rounded to the 6-sig-fig the reconciliation
// modules store (toFixed(6)); every recorded copy must equal THIS exactly.
const C_C_CANONICAL_6DIG = +C_C_PINNED.toFixed(6); // 0.383748

// Provenance registry: the C_C value AS RECORDED in each consumer module.
const C_C_CONSUMER_VALUES = [
  { module: 'polymath15-constant-C-C.js', field: 'C_C_PINNED (6-dig)', value: C_C_CANONICAL_6DIG },
  { module: 'imp-2643-honest-assembled-EN.js', field: 'subterms.E_coll.C_C', value: IMP2643_HONEST_ASSEMBLED_EN.subterms.E_coll.C_C },
  { module: 'imp-2633-l-cond-constant-discharge.js', field: 'subterms.E_coll.C_C', value: IMP2633_L_COND_CONSTANT_DISCHARGE.subterms.E_coll.C_C },
  { module: 'c-c-selberg-refinement-2026-05.js', field: 'oldCC', value: C_C_SELBERG_REFINEMENT.oldCC },
];

const TOL = 1e-9;

export const IMP2886_C_C_ANSATZ_CROSS_MODULE_CONSISTENCY = {
  id: 'imp-2886',
  title: 'C_C = (1/8) sqrt(3 pi) cross-module ansatz consistency tripwire',
  canonical: C_C_CANONICAL_6DIG,
  literalFullPrecision: C_C_ANSATZ_LITERAL,
  consumers: C_C_CONSUMER_VALUES,
  tolerance: TOL,
  rationale:
    'The dominant E_coll constant C_C is duplicated across E_coll/E_flow ' +
    'reconciliation modules; a drifted copy would corrupt the finite-N estimate ' +
    'while the per-module rigor-locks still pass. This tripwire pins every ' +
    'recorded copy to the canonical C_C_PINNED within 1e-9.',
  scope:
    'Pure numeric consistency. Does NOT touch the honest NO-GO classification: ' +
    'C_H = 1/8 stays an ANSATZ (imp-2642), C_C stays non-rigorous on the dominant ' +
    'term, Lambda <= E(N) is NOT a rigorous beat (imp-2643 NO-GO, PT stays SOTA).',
  source: 'imp-399 (C_C definition); imp-2643/2633/1135 (consumers); imp-2886 (this cross-check)',
};

export const IMP2886_C_C_ANSATZ_CROSS_MODULE_CONSISTENCY_ASSERTIONS = [
  {
    id: 'imp2886-canonical-reproduces-literal',
    description:
      'Canonical C_C_PINNED reproduces the closed-form (1/8)*sqrt(3*pi) within 1e-9 (sqrt(3 pi) factor intact).',
    holds: () => Math.abs(C_C_PINNED - C_C_ANSATZ_LITERAL) < TOL,
    why:
      'A silent edit dropping the sqrt(3 pi) factor (or the 1/8) at the source ' +
      'would change the dominant E_coll prefactor; pin it to the closed form.',
  },
  {
    id: 'imp2886-every-consumer-matches-canonical',
    description:
      'Every reconciliation module records the SAME C_C as the canonical 6-sig-fig value (0.383748) within 1e-9.',
    holds: () =>
      C_C_CONSUMER_VALUES.every((c) => Math.abs(c.value - C_C_CANONICAL_6DIG) < TOL),
    why:
      'imp-2643 / imp-2633 / imp-1135 each independently record C_C for the E_coll ' +
      'term. If one drifts (stale literal, dropped factor), this catches it before ' +
      'the corrupted value silently feeds the finite-N E(N) estimate.',
  },
  {
    id: 'imp2886-all-consumers-mutually-equal',
    description:
      'The recorded C_C copies are mutually equal: max pairwise spread < 1e-9.',
    holds: () => {
      const vals = C_C_CONSUMER_VALUES.map((c) => c.value);
      return Math.max(...vals) - Math.min(...vals) < TOL;
    },
    why:
      'Mutual-agreement form of the check: no single module is privileged, so a ' +
      'drift in any one copy widens the spread past tolerance.',
  },
];

for (const a of IMP2886_C_C_ANSATZ_CROSS_MODULE_CONSISTENCY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-2886-c-c-ansatz-cross-module-consistency assertion failed: ${a.id} -- ${a.description}`,
    );
  }
}
