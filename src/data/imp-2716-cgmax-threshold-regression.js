/**
 * @module imp-2716-cgmax-threshold-regression
 *
 * imp-2716 (medium, accuracy): Regression assertion locking the two C_G_max
 * thresholds that carry the imp-2644 "E_flow <= 1.3e-3 unconditional in C_G"
 * headline to their stored literals, re-derived live from the defining inputs.
 *
 * imp-2644 certifies E_flow(N* = 1e4) = C_F . log(T0)/T0 . exp(C_G . |t_c|)
 * <= 1.3e-3 for EVERY C_G up to a threshold
 *
 *     C_G_max(tc) = log( 1.3e-3 / (C_F . log(T0)/T0) ) / tc,
 *
 * evaluated at two |t_c| inputs:
 *   - the rigorous A1 trap  tc = g_min^2/6 ~ 2.369e-4  =>  C_G_max ~ 203 (the
 *     wide "unconditional in C_G" band, ~100x over the explicit Gronwall C_G=2);
 *   - the non-rigorous OLS  tc = 0.0071              =>  C_G_max ~ 6.8 (the
 *     fallback band that still contains C_G=2, so the conclusion survives even
 *     WITHOUT the A1 residuals R1/R2).
 *
 * imp-2644 itself only guards these with WIDE band assertions (200 < A1 < 210,
 * 6 < OLS < 8). That tolerates a silent ~1% drift: an inadvertent edit to T0,
 * to the A1 |t_c| input, or to the C_F prefactor formula could move the true
 * threshold from 203.24 to, say, 201 -- still inside the band, no build signal,
 * yet the headline number printed in the dossier (203) would be stale.
 *
 * This module is silent-regression armour. It re-derives BOTH thresholds from
 * source (effectiveHeightForN -> C_F -> prefactor; g_min^2/6 -> tc_A1) and pins
 * each to the stored display literal to a DOCUMENTED tolerance of 0.01 (locks
 * the 2-decimal display / ~5 significant figures). A change to any of T0, tc, or
 * C_F that shifts a threshold past the second decimal now trips the build.
 *
 * HONEST SCOPE -- NO NEW CLAIM
 * ----------------------------
 * This adds no mathematics and changes no Lambda value. The A1-based ~203 band
 * still inherits the imp-2635 residuals R1 (SG1c persistence) and R2 (imp-2636
 * units); the OLS ~6.8 band is still non-rigorous. The module only locks the two
 * carried literals to the inputs that define them, so the "unconditional in C_G"
 * headline cannot silently decouple from T0/tc/C_F.
 *
 * @see imp-2644-eflow-gronwall-cg-discharge (C_G_max literals 203.24 / 6.78)
 * @see imp-2704-cf-interval-certificate (certified C_F prefactor bracket)
 * @see imp-2762-tc-a1-trap-interval (certified A1 trap tc bracket)
 * @see lambda-rh-height-mapping (effectiveHeightForN)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const N_STAR = 1e4;
const EFLOW_TARGET = 1.3e-3;

// ── Defining inputs, re-derived independently from source ────────────────────
// C_F prefactor C_F . log(T0)/T0 at N* = 1e4 (imp-398 pinned, imp-2704 certified).
const T0 = effectiveHeightForN(N_STAR);            // ~9878.8034
const L = Math.log(T0);                            // ~9.1981
const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;  // 1.3305782 (imp-398)
const PREFACTOR = C_F * L / T0;                    // ~1.2389e-3

// |t_c| inputs: rigorous A1 trap and the non-rigorous OLS projection.
const G_MIN = 0.0376985;                           // Lehmer-pair gap, Odlyzko-certified
const TC_A1 = (G_MIN * G_MIN) / 6;                 // A1: t_c <= g_min^2/6 ~ 2.369e-4
const TC_OLS = 0.0071;                             // OLS projection (imp-2632, NOT rigorous)

// Largest C_G keeping E_flow <= 1.3e-3 for a given |t_c| input.
const cGmax = (tc) => Math.log(EFLOW_TARGET / PREFACTOR) / tc;
const C_G_MAX_A1 = cGmax(TC_A1);                   // re-derived ~203.24
const C_G_MAX_OLS = cGmax(TC_OLS);                 // re-derived ~6.78

// ── Stored display literals carried by imp-2644 (toFixed(2)) ──────────────────
const PINNED_C_G_MAX_A1 = 203.24;                  // imp-2644 cG.C_G_max_A1
const PINNED_C_G_MAX_OLS = 6.78;                   // imp-2644 cG.C_G_max_OLS
const PIN_TOL = 0.01;                              // documented: locks 2-decimal display / ~5 sig figs

const C_G_GRONWALL = 2;                            // explicit Gronwall C_G = 2/y_star^2 (imp-2644 Lemma B)

export const IMP2716_CGMAX_THRESHOLD_REGRESSION = {
  id: 'imp-2716',
  question:
    'Lock the two C_G_max thresholds (203 on the A1 trap, 6.8 on the OLS fallback) that carry the imp-2644 "E_flow <= 1.3e-3 unconditional in C_G" headline to their stored literals, re-derived live from T0, tc and C_F, so a silent input edit trips the build.',
  N_star: N_STAR,
  eflowTarget: EFLOW_TARGET,
  derivedInputs: {
    T0: +T0.toExponential(4),          // ~9.879e3
    logT0: +L.toFixed(4),              // ~9.198
    C_F: +C_F.toFixed(6),             // 1.330578
    prefactor: +PREFACTOR.toExponential(4), // ~1.2389e-3
    tc_A1: +TC_A1.toExponential(4),    // 2.369e-4
    tc_OLS: TC_OLS,                    // 0.0071
  },
  thresholds: {
    A1: {
      derived: +C_G_MAX_A1.toFixed(4),   // 203.2401
      literal: PINNED_C_G_MAX_A1,        // 203.24
      delta: +Math.abs(C_G_MAX_A1 - PINNED_C_G_MAX_A1).toFixed(5),
      tolerance: PIN_TOL,
      status: 'A1-band: wide ~100x band over Gronwall C_G=2, inherits imp-2635 R1/R2 residuals',
    },
    OLS: {
      derived: +C_G_MAX_OLS.toFixed(4),  // 6.7803
      literal: PINNED_C_G_MAX_OLS,       // 6.78
      delta: +Math.abs(C_G_MAX_OLS - PINNED_C_G_MAX_OLS).toFixed(5),
      tolerance: PIN_TOL,
      status: 'OLS-fallback: non-rigorous, but still contains C_G=2 so the conclusion survives without A1',
    },
  },
  verdict:
    'C_G_max thresholds LOCKED. The A1 threshold re-derives to '
    + C_G_MAX_A1.toFixed(2) + ' (literal 203.24) and the OLS fallback to '
    + C_G_MAX_OLS.toFixed(2) + ' (literal 6.78), each within +/-' + PIN_TOL
    + ' of its stored value. Both still exceed the explicit Gronwall C_G=2, so '
    + 'the "unconditional in C_G" headline is now pinned to its defining inputs '
    + '(T0, tc, C_F): a silent edit to any of them shifts the derived threshold '
    + 'off the literal and trips this regression. No new claim; no Lambda change.',
  citation:
    'imp-2644-eflow-gronwall-cg-discharge.js (C_G_max literals); '
    + 'imp-2704-cf-interval-certificate.js (certified C_F prefactor); '
    + 'imp-2762-tc-a1-trap-interval.js (certified A1 trap tc); '
    + 'lambda-rh-height-mapping.js (effectiveHeightForN)',
};

export const IMP2716_CGMAX_THRESHOLD_REGRESSION_ASSERTIONS = [
  {
    id: 'imp2716-cgmax-a1-locked-to-literal',
    description:
      'The A1-trap threshold C_G_max = log(1.3e-3 / (C_F.log(T0)/T0)) / (g_min^2/6), re-derived from source, matches the stored literal 203.24 to within 0.01.',
    holds: () =>
      Math.abs(C_G_MAX_A1 - PINNED_C_G_MAX_A1) < PIN_TOL
      && C_G_MAX_A1 > C_G_GRONWALL,
  },
  {
    id: 'imp2716-cgmax-ols-locked-to-literal',
    description:
      'The OLS-fallback threshold C_G_max at tc=0.0071, re-derived from source, matches the stored literal 6.78 to within 0.01 and still exceeds the Gronwall C_G=2.',
    holds: () =>
      Math.abs(C_G_MAX_OLS - PINNED_C_G_MAX_OLS) < PIN_TOL
      && C_G_MAX_OLS > C_G_GRONWALL,
  },
  {
    id: 'imp2716-thresholds-consistent-with-target',
    description:
      'Sanity: E_flow is exactly at target 1.3e-3 at each re-derived threshold (the defining equation C_F.log(T0)/T0.exp(C_G_max.tc) = 1.3e-3 closes).',
    holds: () =>
      Math.abs(PREFACTOR * Math.exp(C_G_MAX_A1 * TC_A1) - EFLOW_TARGET) < 1e-9
      && Math.abs(PREFACTOR * Math.exp(C_G_MAX_OLS * TC_OLS) - EFLOW_TARGET) < 1e-9,
  },
];

for (const a of IMP2716_CGMAX_THRESHOLD_REGRESSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2716-cgmax-threshold-regression assertion failed: ${a.id}`);
  }
}
