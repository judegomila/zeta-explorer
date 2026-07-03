/**
 * @module sigma-n-subterms
 *
 * imp-3479 (meta, consolidation assessment): imp-3220/imp-3323/imp-3406/imp-3443/
 * imp-3444/imp-3446 each re-implement the sigma(N) bridge-budget sub-term formula
 * inline (effectiveHeightForN, C_C_PINNED, the imp-398 C_F prefactor, the imp-2631
 * E_trunc floor). A line-level check confirms imp-3323/imp-3406/imp-3444/imp-3446
 * carry a BYTE-IDENTICAL parts(N) function body plus identical TWO_PI / E_TRUNC_PT /
 * GRONWALL / TC_A1_TRAP constants; imp-3443 differs only by taking eTrunc as a
 * parameter for its sensitivity sweep instead of the fixed E_TRUNC_PT; imp-3220
 * renames the function to bridgeRow and layers display-precision formatting on top
 * of the same core computation.
 *
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll)
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)        (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                             (N-independent, imp-2631)
 *
 * ASSESSMENT: the duplication is real and exact, so a shared helper is justified.
 * Retrofitting the six already-shipped, assertion-backed modules is deliberately
 * OUT OF SCOPE here -- each module's baked reference literals and build-time
 * tripwires were authored and verified against its own inline copy, and swapping
 * the implementation underneath six live modules in one ticket is a bigger, riskier
 * change than this consolidation ticket calls for. This helper exists so any FUTURE
 * sigma(N) ticket can import it instead of re-typing the formula, stopping the
 * drift risk at its source (the imp-3479 ask).
 *
 * @see imp-3220-en-bridge-fidelity-frontier (bridgeRow, the original formula)
 * @see imp-3323-sigma-argmin-locator (parts, identical body)
 * @see imp-3406-sigma-highN-extrapolation (parts, identical body)
 * @see imp-3443-nmax-etrunc-sensitivity (parts, eTrunc parameterized)
 * @see imp-3444-sigma-nshape-landmark-ladder (parts, identical body)
 * @see imp-3446-nmax-closed-form (parts, identical body)
 */
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

export const SIGMA_N_TWO_PI = 2 * Math.PI;
export const SIGMA_N_E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4; // Gronwall correction exponent (imp-3220)
export const SIGMA_N_GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

/**
 * Core E(N) = eTrunc + E_flow + E_coll bridge-budget sub-terms shared by
 * imp-3220/imp-3323/imp-3406/imp-3443/imp-3444/imp-3446. Pass eTrunc to override
 * the pinned imp-2631 floor (the imp-3443 sensitivity sweep); omit it to use the
 * default SIGMA_N_E_TRUNC_PT.
 */
export function sigmaNSubterms(N, eTrunc = SIGMA_N_E_TRUNC_PT) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / SIGMA_N_TWO_PI) + 1) / SIGMA_N_TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * SIGMA_N_GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = eTrunc + E_flow + E_coll;
  return { T0, L, C_F, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// imp-3406 headline peak: sigma(N) attains its interior maximum sigma_max ~ 0.9494290
// at N_max ~ 9.218633e5 (re-derived analytically in imp-3446). Any drift in the shared
// sub-term formula would move this reference value.
const REFERENCE_N_MAX = 9.218633e5;
const REFERENCE_SIGMA_MAX = 0.9494290142463586;

export const SIGMA_N_SUBTERMS_ASSERTIONS = [
  {
    id: 'sigma-n-subterms-reproduces-imp3406-peak',
    why:
      'The shared helper must reproduce the imp-3406/imp-3446 headline sigma_max ' +
      '~0.9494290 at N_max ~9.218633e5, or downstream sigma(N) tickets adopting it ' +
      'would silently disagree with the six already-shipped modules it consolidates.',
    holds: () => Math.abs(sigmaNSubterms(REFERENCE_N_MAX).sigma - REFERENCE_SIGMA_MAX) < 1e-9,
  },
  {
    id: 'sigma-n-subterms-eTrunc-override-matches-default',
    why:
      'imp-3443 parameterizes eTrunc for its sensitivity sweep; passing the default ' +
      'SIGMA_N_E_TRUNC_PT explicitly must be identical to omitting eTrunc entirely.',
    holds: () =>
      sigmaNSubterms(1e5, SIGMA_N_E_TRUNC_PT).sigma === sigmaNSubterms(1e5).sigma,
  },
  {
    id: 'sigma-n-subterms-sigma-in-unit-interval',
    why:
      'sigma(N) is a conditional-share fraction E_coll/(E_trunc+E_flow+E_coll); every ' +
      'term is positive, so sigma must sit strictly between 0 and 1 for any physical N.',
    holds: () => {
      const s = sigmaNSubterms(1e5).sigma;
      return s > 0 && s < 1;
    },
  },
];
