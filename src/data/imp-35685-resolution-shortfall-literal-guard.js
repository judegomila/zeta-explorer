/**
 * @module imp-35685-resolution-shortfall-literal-guard
 *
 * imp-35685 (meta, regression-guard): REGRESSION-GUARD pinning the imp-35652
 * resolution-shortfall literals -- s_min(N_PEAK) = 1.0275e-2, shortfall =
 * 97.32x; s_min(N_CROSS) = 6.7302e-4, shortfall = 1485.84x;
 * C_C = (1/8) sqrt(3 pi) = 0.38374752 -- so a silent literal drift in the
 * imp-35652 module trips the build. This import-light module INDEPENDENTLY
 * recomputes s_min(M) = M^{-1/3} and the resolution shortfall
 * 1/s_min(M) = M^{1/3} from the two imp-35337/imp-35475 landmark N values
 * (N_PEAK = 9.2186e5, N_CROSS = 3.280294352e9), and cross-checks that the
 * imp-35652 baked IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE
 * resolutionScaleTable/C_C reproduce the same figures. Regression-guard only;
 * recomputes an established assessment/scoping figure; changes no bound;
 * establishes no operator positivity; C_C = (1/8) sqrt(3 pi)
 * (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional
 * (imp-486) UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (source scoping module pinned here)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz)
 * Literature: Ben Arous-Bourgade (2013, smallest GUE gaps ~ n^{-4/3}).
 */

import { IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE } from './imp-35652-req3-option-a-restricted-support-surrogate-scope.js';

const N_PEAK = 9.2186e5;
const N_CROSS = 3.280294352e9;

const sMinScale = (M) => Math.pow(M, -1 / 3);
const S_MIN_PEAK = sMinScale(N_PEAK);
const S_MIN_CROSS = sMinScale(N_CROSS);
const RES_SHORTFALL_PEAK = 1 / S_MIN_PEAK;
const RES_SHORTFALL_CROSS = 1 / S_MIN_CROSS;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI);

export const IMP35685_RESOLUTION_SHORTFALL_LITERAL_GUARD = {
  id: 'imp-35685',
  pinnedLiterals: {
    sMinPeak: +S_MIN_PEAK.toExponential(4),
    shortfallPeak: +RES_SHORTFALL_PEAK.toFixed(2),
    sMinCross: +S_MIN_CROSS.toExponential(4),
    shortfallCross: +RES_SHORTFALL_CROSS.toFixed(2),
    C_C: +C_C.toPrecision(8),
  },
};

export const IMP35685_RESOLUTION_SHORTFALL_LITERAL_GUARD_ASSERTIONS = [
  {
    // (1) peak literal reproduces to printed-digit tolerance
    id: 'imp35685-peak-literals-pinned',
    description: 's_min(N_PEAK) = 1.0275e-2 and its resolution shortfall = 97.32x reproduce independently',
    holds: () =>
      Math.abs(S_MIN_PEAK - 0.010275) < 5e-6 &&
      Math.abs(RES_SHORTFALL_PEAK - 97.32) < 0.01,
  },
  {
    // (2) crossover literal reproduces to printed-digit tolerance
    id: 'imp35685-cross-literals-pinned',
    description: 's_min(N_CROSS) = 6.7302e-4 and its resolution shortfall = 1485.84x reproduce independently',
    holds: () =>
      Math.abs(S_MIN_CROSS - 0.00067302) < 5e-8 &&
      Math.abs(RES_SHORTFALL_CROSS - 1485.84) < 0.01,
  },
  {
    // (3) the C_C ansatz constant (imp-2642/imp-2643) is untouched
    id: 'imp35685-cc-constant-pinned',
    description: 'C_C = (1/8) sqrt(3 pi) = 0.38374752 is unchanged',
    holds: () => Math.abs(C_C - 0.38374752) < 1e-6,
  },
  {
    // (4) cross-check: the imp-35652 baked record reproduces the same figures computed here
    id: 'imp35685-source-module-cross-check',
    description: 'the imp-35652 baked resolutionScaleTable/C_C reproduce the same peak/cross literals computed here',
    holds: () => {
      const t = IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE.resolutionScaleTable;
      return (
        Math.abs(t.peak.sMinMeanSpacingUnits - S_MIN_PEAK) < 1e-6 &&
        Math.abs(t.peak.resolutionShortfall - RES_SHORTFALL_PEAK) < 0.01 &&
        Math.abs(t.cross.sMinMeanSpacingUnits - S_MIN_CROSS) < 1e-7 &&
        Math.abs(t.cross.resolutionShortfall - RES_SHORTFALL_CROSS) < 0.01 &&
        Math.abs(IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE.C_C - C_C) < 1e-6
      );
    },
  },
];

for (const a of IMP35685_RESOLUTION_SHORTFALL_LITERAL_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35685-resolution-shortfall-literal-guard assertion failed: ${a.id}`);
  }
}
