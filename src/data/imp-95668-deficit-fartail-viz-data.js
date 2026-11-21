/**
 * @module imp-95668-deficit-fartail-viz-data
 * @fileoverview imp-95668 -- lightweight viz-data module reshaping the imp-95638
 *   far-tail deficit invariant derivation into a single plotted curve: the
 *   closed-form finite-N excess D(N) = 1/2 + (ln(u/2pi)-1)/(2u) against the
 *   imp-95614 X4 measured plateau (0.5094/0.5085/0.5056/0.5027 at
 *   log10 N = 24/44/100/300) and the exact 1/2 asymptote.
 *
 *   Self-computing from the already-derived imp-95638 SAMPLES rows -- no
 *   re-derivation, no fresh quadrature, no heavy imports. Viz data only;
 *   changes no bound; no QED.
 *
 *   @see imp-95638-deficit-invariant-fartail-limit.js (the derivation this reshapes)
 */

import { IMP95638_DEFICIT_INVARIANT_FARTAIL_LIMIT } from './imp-95638-deficit-invariant-fartail-limit.js';

const { samples, limit, closedFormExcess } = IMP95638_DEFICIT_INVARIANT_FARTAIL_LIMIT;

// imp-95614 X4 measured plateau values quoted verbatim in the imp-95638 F3 finding.
const MEASURED_PLATEAU = { 24: 0.5094, 44: 0.5085, 100: 0.5056, 300: 0.5027 };

export const IMP95668_DEFICIT_SERIES = Object.freeze(
  samples
    .filter((s) => s.log10N <= 300)
    .map((s) =>
      Object.freeze({
        log10N: s.log10N,
        excess: s.excess,
        measured: MEASURED_PLATEAU[s.log10N],
      }),
    ),
);

export const IMP95668_LIMIT = limit; // exact 1/2 asymptote

export const IMP95668_CLOSED_FORM_EXCESS = closedFormExcess;

export const IMP95668_CAVEAT_BANNER =
  'HONEST STATUS: this is a reshaped VIEW of the already-derived imp-95638 closed-form ' +
  'excess D(N) = 1/2 + (ln(u/2pi)-1)/(2u), itself built on the inherited imp-3220/imp-3406 ' +
  'component model (NOT a rigorous asymptotic). The measured imp-95614 X4 plateau is not a ' +
  'distinct constant -- it is the finite-N head of the exact 1/2 limit. Introduces no new ' +
  'cited input and changes no bound; no refereed bound is changed. ' +
  'No QED.';

export const IMP95668_DEFICIT_FARTAIL_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95668-series-matches-source-samples',
    description: 'the plotted series has one point per imp-95638 sample row with log10N <= 300',
    holds: () => IMP95668_DEFICIT_SERIES.length === samples.filter((s) => s.log10N <= 300).length,
  },
  {
    id: 'imp95668-series-excess-decreases-toward-half',
    description: 'the excess curve decreases monotonically toward the 1/2 limit across the plotted window',
    holds: () =>
      IMP95668_DEFICIT_SERIES.every(
        (p, i) => i === 0 || p.excess < IMP95668_DEFICIT_SERIES[i - 1].excess,
      ) && IMP95668_DEFICIT_SERIES.every((p) => p.excess > IMP95668_LIMIT),
  },
  {
    id: 'imp95668-excess-matches-measured-within-2e-3',
    description: 'the closed-form excess tracks the imp-95614 measured plateau to within 2e-3',
    holds: () => IMP95668_DEFICIT_SERIES.every((p) => Math.abs(p.excess - p.measured) < 2e-3),
  },
  {
    id: 'imp95668-limit-is-one-half',
    description: 'the asymptote plotted alongside the curve is exactly 1/2',
    holds: () => IMP95668_LIMIT === 0.5,
  },
  {
    id: 'imp95668-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags no QED',
    holds: () => /HONEST STATUS/.test(IMP95668_CAVEAT_BANNER) && /No QED/.test(IMP95668_CAVEAT_BANNER),
  },
];

for (const a of IMP95668_DEFICIT_FARTAIL_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95668-deficit-fartail-viz-data assertion failed: ${a.id}`);
  }
}
