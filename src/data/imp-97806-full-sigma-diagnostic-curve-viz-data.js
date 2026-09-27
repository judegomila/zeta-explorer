/**
 * @module imp-97806-full-sigma-diagnostic-curve-viz-data
 *
 * imp-97806: import-light viz-data leaf charting the FULL imp-97723 sigma diagnostic
 * diag(N) = (1 - sigma)(1 - 1/log(T0/2pi)) + sigma * log T0 as a single continuous curve across
 * its three-regime shape -- the small-N HUMP (imp-97759/imp-97782), the local MINIMUM
 * (imp-97759/imp-97777), and the slow RISE toward EXACTLY 1 (imp-97723) -- with the three pinned
 * landmarks marked on the curve. Recomputes the identical byte-for-byte formula used by imp-97723
 * / imp-97759 / imp-97777 / imp-97782 (no re-derivation) purely to sample the continuous shape;
 * the three marked landmarks are reused verbatim from their pinning modules.
 *
 * PRESENTATION ONLY. No new computation of the landmarks themselves; RH open; NO QED.
 *
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one.js (closed form + rise-to-1 crossings)
 * @see imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover.js (first noted the hump/minimum shape)
 * @see imp-97777-fartail-diagnostic-local-minimum-pin.js (local-minimum pin, reused verbatim)
 * @see imp-97782-fartail-diagnostic-hump-peak-pin.js (hump-peak pin, reused verbatim)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP97777_FARTAIL_DIAGNOSTIC_LOCAL_MINIMUM_PIN } from './imp-97777-fartail-diagnostic-local-minimum-pin.js';
import { IMP97782_FARTAIL_DIAGNOSTIC_HUMP_PEAK_PIN } from './imp-97782-fartail-diagnostic-hump-peak-pin.js';
import { IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE } from './imp-97723-sigma-fartail-diagnostic-asymptote-one.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // imp-2631 fixed-strip floor (baseline, factor = 1)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97723/imp-97759/imp-97777/imp-97782 exactly

// EXACT imp-97723 closed form, evaluated at x = log10 N (baseline floor only, no sweep here).
function diagAt(x) {
  const N = Math.pow(10, x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const Lprime = Math.log(T0 / TWO_PI);
  const C_F = (Lprime + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const sigma = E_coll / (E_TRUNC + E_flow + E_coll);
  return (1 - sigma) * (1 - 1 / Lprime) + sigma * L;
}

// Continuous curve sample across the three regimes: hump (~1e2..1e12), minimum (~1e18.77), rise (to ~1e50).
const CURVE_X_MIN = 2;
const CURVE_X_MAX = 50;
const CURVE_POINTS = 240;
export const IMP97806_CURVE = Object.freeze(
  Array.from({ length: CURVE_POINTS }, (_, i) => {
    const x = CURVE_X_MIN + ((CURVE_X_MAX - CURVE_X_MIN) * i) / (CURVE_POINTS - 1);
    return Object.freeze({ log10N: +x.toFixed(4), diag: +diagAt(x).toFixed(6) });
  })
);

// The three pinned landmarks, reused verbatim from their source modules (no re-derivation).
export const IMP97806_LANDMARKS = Object.freeze({
  hump: Object.freeze({
    log10N: IMP97782_FARTAIL_DIAGNOSTIC_HUMP_PEAK_PIN.peak.log10N,
    diag: IMP97782_FARTAIL_DIAGNOSTIC_HUMP_PEAK_PIN.peak.diag,
    label: 'hump peak (imp-97782)',
  }),
  minimum: Object.freeze({
    log10N: IMP97777_FARTAIL_DIAGNOSTIC_LOCAL_MINIMUM_PIN.minimum.log10N,
    diag: IMP97777_FARTAIL_DIAGNOSTIC_LOCAL_MINIMUM_PIN.minimum.diag,
    label: 'local minimum (imp-97777)',
  }),
  riseTo1: Object.freeze({
    log10N: IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE.crossings.reach_0p99_log10N,
    diag: 0.99,
    label: 'crosses 0.99 en route to 1 (imp-97723)',
  }),
});

export const IMP97806_SUMMARY = Object.freeze({
  reading:
    'The full imp-97723 diagnostic (1/2 - p) * 2 log T0 is non-monotonic: it rides a small-N hump ' +
    `(diag ~ ${IMP97806_LANDMARKS.hump.diag} at log10 N ~ ${IMP97806_LANDMARKS.hump.log10N}), ` +
    `crashes through a local minimum (diag ~ ${IMP97806_LANDMARKS.minimum.diag} at log10 N ~ ` +
    `${IMP97806_LANDMARKS.minimum.log10N}), then rises slowly along the bare Riemann-von Mangoldt ` +
    `slope toward exactly 1, crossing 0.99 near log10 N ~ ${IMP97806_LANDMARKS.riseTo1.log10N}.`,
  verdict:
    'Presentation only: the curve is a fresh sampling of the byte-for-byte imp-97723/imp-97759 ' +
    'closed form purely to show the continuous shape; the three marked landmarks are reused ' +
    'verbatim from their pinning modules (imp-97782 hump, imp-97777 minimum, imp-97723 crossing). ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, not a rigorous ' +
    'asymptotic. Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP97806_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp97806-curve-has-expected-point-count',
    description: 'the sampled curve spans log10 N = 2..50 with 240 points',
    holds: () =>
      IMP97806_CURVE.length === 240 &&
      IMP97806_CURVE[0].log10N === 2 &&
      IMP97806_CURVE[IMP97806_CURVE.length - 1].log10N === 50,
  },
  {
    id: 'imp97806-curve-shows-hump-then-dip-then-rise',
    description: 'the curve peaks above 10 in its early portion, dips below 1 near the minimum, then rises toward 1',
    holds: () => {
      const maxDiag = Math.max(...IMP97806_CURVE.map((p) => p.diag));
      const minRegion = IMP97806_CURVE.filter((p) => p.log10N > 15 && p.log10N < 25);
      const minDiag = Math.min(...minRegion.map((p) => p.diag));
      const lastDiag = IMP97806_CURVE[IMP97806_CURVE.length - 1].diag;
      return maxDiag > 10 && minDiag < 1 && lastDiag > minDiag && lastDiag < 1;
    },
  },
  {
    id: 'imp97806-landmarks-reused-verbatim',
    description: 'the three landmark values match their source pinning modules exactly',
    holds: () =>
      IMP97806_LANDMARKS.hump.log10N === IMP97782_FARTAIL_DIAGNOSTIC_HUMP_PEAK_PIN.peak.log10N &&
      IMP97806_LANDMARKS.hump.diag === IMP97782_FARTAIL_DIAGNOSTIC_HUMP_PEAK_PIN.peak.diag &&
      IMP97806_LANDMARKS.minimum.log10N === IMP97777_FARTAIL_DIAGNOSTIC_LOCAL_MINIMUM_PIN.minimum.log10N &&
      IMP97806_LANDMARKS.minimum.diag === IMP97777_FARTAIL_DIAGNOSTIC_LOCAL_MINIMUM_PIN.minimum.diag &&
      IMP97806_LANDMARKS.riseTo1.log10N === IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE.crossings.reach_0p99_log10N,
  },
  {
    id: 'imp97806-landmarks-ordered-hump-min-rise',
    description: 'the three landmarks appear in ascending log10 N order: hump < minimum < rise-to-1',
    holds: () =>
      IMP97806_LANDMARKS.hump.log10N < IMP97806_LANDMARKS.minimum.log10N &&
      IMP97806_LANDMARKS.minimum.log10N < IMP97806_LANDMARKS.riseTo1.log10N,
  },
  {
    id: 'imp97806-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /no bound/.test(IMP97806_SUMMARY.verdict) && /NO QED/.test(IMP97806_SUMMARY.verdict),
  },
];

for (const assertion of IMP97806_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97806 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP97806_SUMMARY;
