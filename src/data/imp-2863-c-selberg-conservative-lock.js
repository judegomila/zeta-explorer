/**
 * imp-2863 — C_Selberg "placeholder is conservative" tripwire lock.
 *
 * PURPOSE
 *   imp-2641 establishes the explicit Trudgian-2014 S(T) growth coefficient
 *   C_Selberg_rigorous = 2.622 and shows it sits BELOW the placeholder 3.0 used
 *   inside C_KH = pi . C_Selberg. imp-2643 (and the E_coll chain it feeds)
 *   depends on placeholderIsConservative === true to keep E_coll a VALID (if
 *   loose) upper bound: the placeholder may only over-estimate, never under-
 *   estimate, the true S(T) growth.
 *
 *   There is a C_H rigor lock (imp-2701) but NO lock guarding the C_Selberg
 *   ordering. A future edit that silently inflates the explicit Trudgian
 *   coefficient above the 3.0 placeholder would INVALIDATE the conservative-
 *   upper-bound claim (E_coll could then be an under-estimate, breaking the
 *   finite-N ceiling argument) WITHOUT any build-time signal. This module is a
 *   build-time lock that throws the moment the ordering is violated.
 *
 * INVARIANTS LOCKED
 *   (a) The explicit Trudgian coefficient stays strictly below the placeholder
 *       (C_Selberg.rigorousExplicit < C_Selberg.placeholder), and the derived
 *       placeholderIsConservative flag reads true.
 *   (b) The Trudgian-2014 point value at the surviving beat height
 *       T0 = gamma_N(1e4) reproduces |S(T0)| <= ~4.157.
 *   (c) The three honest coefficient readings stay ordered
 *       0.452 (point at T0) < 1.162 (uniform over zeros) < 2.622 (uniform over
 *       T>=e) < 3.0 (placeholder) — so the placeholder is conservative under
 *       EVERY reading, not just the headline one.
 *
 * This file is side-effect-imported by assertion-sweep-2026-04-12.js so the
 * throws below stay reachable from the production import graph (per the repo
 * dead-assertion audit pattern, imp-501 / imp-2702).
 *
 * @see imp-2641-c-selberg-trudgian-discharge.js (the discharge this locks)
 * @see imp-2701-ch-rigor-lock.js (sibling lock guarding the C_H rigor flag)
 */

import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE } from './imp-2641-c-selberg-trudgian-discharge.js';

const D = IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE;

const C_SELBERG_RIGOROUS = D.C_Selberg.rigorousExplicit;   // 2.622 (Trudgian sup over [e,T0])
const C_SELBERG_PLACEHOLDER = D.C_Selberg.placeholder;     // 3.0
const POINT_VALUE_AT_T0 = D.trudgian2014.pointValueAtT0;   // ~4.157

const COEFF_POINT_T0 = D.effectiveCoefficients.pointAtTopT0;          // ~0.452
const COEFF_UNIFORM_ZEROS = D.effectiveCoefficients.uniformOverActualZeros; // ~1.162
const COEFF_UNIFORM_E = D.effectiveCoefficients.uniformOverTgeqE;    // 2.622

export const IMP2863_C_SELBERG_CONSERVATIVE_LOCK = {
  id: 'imp-2863',
  title: 'C_Selberg placeholder-is-conservative tripwire lock',
  guards: {
    rigorousBelowPlaceholder: C_SELBERG_RIGOROUS < C_SELBERG_PLACEHOLDER, // must hold
    placeholderIsConservative: D.C_Selberg.placeholderIsConservative,     // must be true
    pointValueAtT0: POINT_VALUE_AT_T0,                                    // ~4.157
    coeffOrdering: [COEFF_POINT_T0, COEFF_UNIFORM_ZEROS, COEFF_UNIFORM_E, C_SELBERG_PLACEHOLDER],
  },
  rationale:
    'If the explicit Trudgian S(T) coefficient ever exceeds the 3.0 placeholder, ' +
    'E_coll loses its conservative-upper-bound validity and the finite-N ceiling ' +
    'argument silently breaks. This lock fails the build the moment the ordering ' +
    'C_Selberg_rigorous < placeholder, the conservative flag, the T0 point value, ' +
    'or the three-reading coefficient ordering is violated.',
  source: 'imp-2641 (Trudgian 2014 explicit C_Selberg=2.622 < placeholder 3.0); imp-2863 (this lock)',
};

export const IMP2863_C_SELBERG_CONSERVATIVE_LOCK_ASSERTIONS = [
  {
    id: 'imp2863-rigorous-below-placeholder',
    description: '(a) Explicit Trudgian C_Selberg (2.622) is strictly below the 3.0 placeholder, and placeholderIsConservative reads true',
    holds: () =>
      C_SELBERG_RIGOROUS < C_SELBERG_PLACEHOLDER &&
      D.C_Selberg.placeholderIsConservative === true,
  },
  {
    id: 'imp2863-trudgian-point-value-at-T0',
    description: '(b) Trudgian-2014 point bound at T0=gamma_N(1e4) reproduces |S(T0)| <= ~4.157',
    holds: () => Math.abs(POINT_VALUE_AT_T0 - 4.157) < 1e-3,
  },
  {
    id: 'imp2863-coeff-ordering-0452-1162-2622-30',
    description: '(c) The three honest readings stay ordered 0.452 < 1.162 < 2.622 < 3.0: placeholder conservative under every reading',
    holds: () =>
      COEFF_POINT_T0 < COEFF_UNIFORM_ZEROS &&
      COEFF_UNIFORM_ZEROS < COEFF_UNIFORM_E &&
      COEFF_UNIFORM_E < C_SELBERG_PLACEHOLDER &&
      Math.abs(COEFF_POINT_T0 - 0.452) < 5e-3 &&
      Math.abs(COEFF_UNIFORM_ZEROS - 1.162) < 5e-3 &&
      Math.abs(COEFF_UNIFORM_E - 2.622) < 5e-3,
  },
];

for (const a of IMP2863_C_SELBERG_CONSERVATIVE_LOCK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2863-c-selberg-conservative-lock assertion failed: ${a.id}`);
  }
}
