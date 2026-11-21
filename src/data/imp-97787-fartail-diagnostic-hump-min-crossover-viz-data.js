/**
 * @module imp-97787-fartail-diagnostic-hump-min-crossover-viz-data
 *
 * imp-97787: import-light viz-data leaf charting the imp-97759 non-monotone far-tail diagnostic
 * shape -- the small-N HUMP (imp-97782), the local MINIMUM (imp-97777), and the slow RISE toward
 * exactly 1 -- with the imp-97759 >1pct E_trunc-floor-sensitivity CROSSOVER (at N ~ 1e20.7) marked
 * on top. Reuses the identical byte-for-byte curve already sampled by imp-97806 (no re-derivation)
 * and adds the one landmark imp-97806 does not carry: the floor-sensitivity crossover pinned by
 * imp-97759 F1.
 *
 * PRESENTATION ONLY. No new computation; all landmarks reused verbatim from their source modules.
 * RH open; NO QED.
 *
 * @see imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover.js (crossover pin, reused verbatim)
 * @see imp-97806-full-sigma-diagnostic-curve-viz-data.js (curve + hump/minimum landmarks, reused verbatim)
 * @see imp-97782-fartail-diagnostic-hump-peak-pin.js (hump-peak pin)
 * @see imp-97777-fartail-diagnostic-local-minimum-pin.js (local-minimum pin)
 */

import {
  IMP97806_CURVE,
  IMP97806_LANDMARKS,
} from './imp-97806-full-sigma-diagnostic-curve-viz-data.js';
import { IMP97759_FARTAIL_CROSSING_ETRUNC_FLOOR_SENSITIVITY_CROSSOVER } from './imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover.js';

// Reuse the exact imp-97806 curve sample byte-for-byte (no re-derivation here).
export const IMP97787_CURVE = IMP97806_CURVE;

// The three landmarks this leaf marks: hump, local minimum (both reused from imp-97806, which
// itself reuses imp-97782 / imp-97777 verbatim), and the imp-97759 floor-sensitivity crossover.
export const IMP97787_LANDMARKS = Object.freeze({
  hump: IMP97806_LANDMARKS.hump,
  minimum: IMP97806_LANDMARKS.minimum,
  crossover: Object.freeze({
    log10N: IMP97759_FARTAIL_CROSSING_ETRUNC_FLOOR_SENSITIVITY_CROSSOVER.crossover.log10N,
    diag: IMP97759_FARTAIL_CROSSING_ETRUNC_FLOOR_SENSITIVITY_CROSSOVER.crossover.target_t,
    label: '>1% floor-sensitivity crossover (imp-97759)',
  }),
});

export const IMP97787_SUMMARY = Object.freeze({
  reading:
    'The full imp-97723 diagnostic rides a small-N hump ' +
    `(diag ~ ${IMP97787_LANDMARKS.hump.diag} at log10 N ~ ${IMP97787_LANDMARKS.hump.log10N}), ` +
    `crashes through a local minimum (diag ~ ${IMP97787_LANDMARKS.minimum.diag} at log10 N ~ ` +
    `${IMP97787_LANDMARKS.minimum.log10N}), then rises slowly toward exactly 1. Below the marked ` +
    `crossover (diag ~ ${IMP97787_LANDMARKS.crossover.diag} at log10 N ~ ` +
    `${IMP97787_LANDMARKS.crossover.log10N}) the imp-2631 E_trunc floor still shifts the rising-` +
    'branch crossing by more than 1% in log10 N; above it, the floor is negligible.',
  verdict:
    'Presentation only: the curve is reused byte-for-byte from imp-97806 (itself a fresh sampling ' +
    'of the imp-97723/imp-97759 closed form); the hump and minimum landmarks are reused verbatim ' +
    'from imp-97782/imp-97777, and the crossover landmark is reused verbatim from imp-97759 F1. ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous ' +
    'asymptotic. Changes no bound; no refereed bound is changed; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97787_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97787-curve-reused-from-imp97806',
    description: 'the sampled curve is reused byte-for-byte from imp-97806 (same length and endpoints)',
    holds: () =>
      IMP97787_CURVE === IMP97806_CURVE &&
      IMP97787_CURVE.length > 0 &&
      IMP97787_CURVE[0].log10N === 2 &&
      IMP97787_CURVE[IMP97787_CURVE.length - 1].log10N === 50,
  },
  {
    id: 'imp97787-hump-and-minimum-reused-verbatim',
    description: 'the hump and minimum landmarks match imp-97806 (and transitively imp-97782/imp-97777) exactly',
    holds: () =>
      IMP97787_LANDMARKS.hump.log10N === IMP97806_LANDMARKS.hump.log10N &&
      IMP97787_LANDMARKS.hump.diag === IMP97806_LANDMARKS.hump.diag &&
      IMP97787_LANDMARKS.minimum.log10N === IMP97806_LANDMARKS.minimum.log10N &&
      IMP97787_LANDMARKS.minimum.diag === IMP97806_LANDMARKS.minimum.diag,
  },
  {
    id: 'imp97787-crossover-reused-verbatim',
    description: 'the crossover landmark matches imp-97759 crossover.log10N / target_t exactly',
    holds: () =>
      IMP97787_LANDMARKS.crossover.log10N ===
        IMP97759_FARTAIL_CROSSING_ETRUNC_FLOOR_SENSITIVITY_CROSSOVER.crossover.log10N &&
      IMP97787_LANDMARKS.crossover.diag ===
        IMP97759_FARTAIL_CROSSING_ETRUNC_FLOOR_SENSITIVITY_CROSSOVER.crossover.target_t,
  },
  {
    id: 'imp97787-crossover-near-1e20p7',
    description: 'the crossover sits at log10 N in [20, 22], just above the local minimum',
    holds: () =>
      IMP97787_LANDMARKS.crossover.log10N > 20 &&
      IMP97787_LANDMARKS.crossover.log10N < 22 &&
      IMP97787_LANDMARKS.crossover.log10N > IMP97787_LANDMARKS.minimum.log10N,
  },
  {
    id: 'imp97787-landmarks-ordered-hump-min-crossover',
    description: 'the three landmarks appear in ascending log10 N order: hump < minimum < crossover',
    holds: () =>
      IMP97787_LANDMARKS.hump.log10N < IMP97787_LANDMARKS.minimum.log10N &&
      IMP97787_LANDMARKS.minimum.log10N < IMP97787_LANDMARKS.crossover.log10N,
  },
  {
    id: 'imp97787-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97787_SUMMARY.verdict) && /NO QED/.test(IMP97787_SUMMARY.verdict),
  },
];

for (const assertion of IMP97787_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97787 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97787_SUMMARY;
