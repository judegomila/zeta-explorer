/**
 * @module imp-2872-c-c-pinned-value-lock
 *
 * imp-2872 (medium, accuracy): Narrowly-scoped regression tripwire pinning
 * C_C_PINNED to the (1/8)*sqrt(3*pi) ANSATZ value.
 *
 * C_C_PINNED (polymath15-constant-C-C.js) = (1/8)*sqrt(3*pi) ~ 0.38375 is the
 * single most load-bearing non-rigorous constant in the program: it is the
 * prefactor of the DOMINANT E_coll term in the assembled E(N), and it is
 * asserted as an ANSATZ in imp-2701 and imp-2715. The constant module carries
 * its own imp-2714 module-load throw-guard, but there was no DEDICATED,
 * value-locked tripwire owning C_C as a single fact. This module is that lock.
 *
 * What it pins (and why each matters):
 *   1. C_C_PINNED reproduces the LITERAL (1/8)*sqrt(3*pi) to 1e-12. A silent
 *      edit substituting a different "fixed" C_C would re-introduce the
 *      withdrawn beat overclaim (imp-2643 NO-GO).
 *   2. C_C_PINNED carries the C_H = 1/8 DERIVATION, i.e. it equals
 *      C_H_REGULARIZED * sqrt(3*pi) with C_H_REGULARIZED === 1/8 exactly. This
 *      catches a silent substitution where someone hard-codes ~0.38375 while
 *      detaching it from the C_H source (a "discharged"-looking value with no
 *      live C_H derivation behind it).
 *   3. The ANSATZ label stays attached: C_C_IS_ANSATZ === true. Flipping C_C to
 *      a RIGOROUS value is NOT a numeric edit here -- it requires first
 *      discharging the C_H = 1/8 Holder-1/2 modulus ansatz (imp-2642), which is
 *      an OPEN gap (imp-2643 NO-GO). Until C_H is discharged, C_C stays an
 *      ansatz on the dominant term and Lambda <= E(N) is not a rigorous beat.
 *
 * Self-executes its assertions on import (throws on failure) so that a
 * side-effect import into the sweep makes a future drift fail the build.
 *
 * @see polymath15-constant-C-C.js (imp-399/imp-2714: the C_C definition + guard)
 * @see imp-2701-ch-rigor-lock.js (C_H not rigorous; finite-N no rigorous beat)
 * @see imp-2862-ckh-cc-interval-certificate.js (outward-rounded C_C bracket)
 */

import {
  C_C_PINNED,
  C_C_IS_ANSATZ,
  C_C_ANSATZ_NOTE,
} from './polymath15-constant-C-C.js';
import { C_H_REGULARIZED } from './g6a-sub-constant-value.js';

// The literal ansatz value, re-multiplied independently of the constant module.
const C_C_ANSATZ_LITERAL = (1 / 8) * Math.sqrt(3 * Math.PI);

export const IMP2872_C_C_PINNED_VALUE_LOCK_ASSERTIONS = [
  {
    id: 'imp2872-c-c-equals-one-eighth-sqrt-3pi',
    description:
      'C_C_PINNED reproduces the literal (1/8)*sqrt(3*pi) ~ 0.38375 ansatz value to 1e-12.',
    holds: () => Math.abs(C_C_PINNED - C_C_ANSATZ_LITERAL) < 1e-12,
    why:
      'C_C = (1/8)*sqrt(3*pi) is the prefactor of the dominant E_coll term. A ' +
      'silent edit substituting a different fixed C_C would re-introduce the ' +
      'withdrawn rigorous-beat overclaim (imp-2643 NO-GO).',
  },
  {
    id: 'imp2872-c-h-derivation-1-8-still-live',
    description:
      'C_C_PINNED carries the C_H=1/8 derivation: C_H_REGULARIZED === 1/8 and C_C === C_H*sqrt(3*pi).',
    holds: () =>
      Math.abs(C_H_REGULARIZED - 1 / 8) < 1e-15 &&
      Math.abs(C_C_PINNED - C_H_REGULARIZED * Math.sqrt(3 * Math.PI)) < 1e-12,
    why:
      'C_C must remain C_H * sqrt(C_KH) with C_H = 1/8 from the imp-395 quadratic-' +
      'tangency regularization -- NOT a silently-substituted "discharged" number ' +
      'detached from its C_H source. This catches a hard-coded ~0.38375 with no ' +
      'live C_H derivation behind it.',
  },
  {
    id: 'imp2872-c-c-stays-ansatz-not-discharged',
    description:
      'C_C carries the ANSATZ label (C_C_IS_ANSATZ === true); flipping to rigorous requires discharging C_H (imp-2642) first.',
    holds: () =>
      C_C_IS_ANSATZ === true && typeof C_C_ANSATZ_NOTE === 'string' && C_C_ANSATZ_NOTE.length > 0,
    why:
      'The 1/8 inside C_C is the exact leading-order tangency coefficient, NOT a ' +
      'proven Holder-1/2 modulus upper bound (imp-2642). Turning C_C into a ' +
      'rigorous value is NOT a numeric edit -- it requires discharging the C_H ' +
      'ansatz first (imp-2642, OPEN; imp-2643 NO-GO). The label must stay attached.',
  },
];

for (const a of IMP2872_C_C_PINNED_VALUE_LOCK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-2872-c-c-pinned-value-lock assertion failed: ${a.id} -- ${a.description}`,
    );
  }
}
