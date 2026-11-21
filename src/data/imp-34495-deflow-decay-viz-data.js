/**
 * @module imp-34495-deflow-decay-viz-data
 * @fileoverview viz-data companion to imp-34448. imp-34448 fit the imp-34373 deflow(kEnd) =
 *   resid_full - resid_noflow monotone falloff to a decay law, finding the local exponent
 *   p(N) = -d log|deflow| / d log N rising toward an asymptotic pInf ~ 1.000, and extrapolated the
 *   E_flow share of the residual deeper toward and past the imp-34169 pole -- but had no
 *   accompanying visualization. This module reshapes the imp-34448 exports VERBATIM (no
 *   recomputation) into a rising-exponent series and a share-extrapolation table, tagging rows past
 *   the double-precision floor as fit-extrapolated rather than directly observed.
 *
 *   Import-light: reuses only the imp-34448 IMP34448_DEFLOW_DECAY_EXPONENT export (no 16.7MB zeros
 *   bundle), per [[no_heavy_imports_in_pages]].
 *
 *   NO QED. Viz-data reshaping only; the imp-34448 exponent fit and share extrapolation are
 *   UNCHANGED; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; no refereed bound is changed.
 *
 *   @see imp-34448-deflow-decay-exponent.js (source of the exponent series + extrapolation table)
 */

import { IMP34448_DEFLOW_DECAY_EXPONENT } from './imp-34448-deflow-decay-exponent.js';

export const IMP34495_LOCAL_EXPONENTS = IMP34448_DEFLOW_DECAY_EXPONENT.localExponentSample;
export const IMP34495_EXTRAPOLATION_TABLE = IMP34448_DEFLOW_DECAY_EXPONENT.extrapolationTable;
export const IMP34495_ASYMPTOTIC_EXPONENT = IMP34448_DEFLOW_DECAY_EXPONENT.asymptoticDecayExponent;
export const IMP34495_FP_FLOOR_KEND = IMP34448_DEFLOW_DECAY_EXPONENT.fpFloorKend;
export const IMP34495_CROSSING_KEND = IMP34448_DEFLOW_DECAY_EXPONENT.crossingKend;
export const IMP34495_CROSSING_SHARE = IMP34448_DEFLOW_DECAY_EXPONENT.crossingShareFit;

export const IMP34495_DEFLOW_DECAY_VIZ_DATA = {
  id: 'imp-34495',
  localExponents: IMP34495_LOCAL_EXPONENTS,
  extrapolationTable: IMP34495_EXTRAPOLATION_TABLE,
  asymptoticExponent: IMP34495_ASYMPTOTIC_EXPONENT,
  fpFloorKend: IMP34495_FP_FLOOR_KEND,
  crossingKend: IMP34495_CROSSING_KEND,
  crossingShare: IMP34495_CROSSING_SHARE,
  isRigorous: false,
};

export const IMP34495_ASSERTIONS = [
  {
    id: 'imp-34495-local-exponents-reproduce-imp34448-verbatim',
    description: 'the local exponent sample reproduces the imp-34448 export exactly (===)',
    holds: () => IMP34495_LOCAL_EXPONENTS === IMP34448_DEFLOW_DECAY_EXPONENT.localExponentSample,
  },
  {
    id: 'imp-34495-local-exponents-rising-toward-one',
    description: 'the plotted local exponents strictly increase and stay below the asymptotic value',
    holds: () =>
      IMP34495_LOCAL_EXPONENTS.every((q, i) => i === 0 || q.p > IMP34495_LOCAL_EXPONENTS[i - 1].p) &&
      IMP34495_LOCAL_EXPONENTS.every((q) => q.p < IMP34495_ASYMPTOTIC_EXPONENT + 0.02),
  },
  {
    id: 'imp-34495-extrapolation-table-reproduces-imp34448',
    description: 'the extrapolation table reproduces the imp-34448 export exactly (===)',
    holds: () => IMP34495_EXTRAPOLATION_TABLE === IMP34448_DEFLOW_DECAY_EXPONENT.extrapolationTable,
  },
  {
    id: 'imp-34495-floor-rows-flagged-not-directly-measurable',
    description: 'every extrapolation row at/after the double-precision floor is flagged NOT directly measurable',
    holds: () =>
      IMP34495_EXTRAPOLATION_TABLE.every(
        (r) => r.kEnd < IMP34495_FP_FLOOR_KEND === r.directlyMeasurable
      ),
  },
  {
    id: 'imp-34495-share-strictly-shrinks',
    description: 'the extrapolated share strictly decreases from the crossing out to the deepest row',
    holds: () =>
      IMP34495_EXTRAPOLATION_TABLE.every(
        (r, i) => i === 0 || r.shareFit < IMP34495_EXTRAPOLATION_TABLE[i - 1].shareFit
      ),
  },
];

for (const a of IMP34495_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34495-deflow-decay-viz-data assertion failed: ${a.id}`);
  }
}
