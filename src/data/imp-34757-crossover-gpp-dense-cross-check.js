/**
 * @module imp-34757-crossover-gpp-dense-cross-check
 *
 * imp-34757 (accuracy, S-frontier): imp-34731 validated the closed-form second derivative
 * g_double_prime(N) = -4 pi^2 K (u+1)/(T^2 u^3) of the inherited imp-33723 surrogate crossover
 * map against a second-order central difference at only FIVE probes on the single band
 * I = [1e9, 1e10] (max relative disagreement ~4e-7, tightness ratio B/max = 1.000). As a
 * standing ACCURACY GUARD on the crossover-map second derivative, this module EXTENDS that
 * closed-form-vs-finite-difference agreement check to a much denser probe set AND onto the
 * neighboring post-peak bands the imp-33582 decay ramp lives on, tabulating the max relative
 * disagreement per band and confirming the sharp-supremum ratio B/max stays ~1 on each.
 *
 * WHAT THIS ADDS (accuracy guard, no new mathematics)
 * ---------------------------------------------------
 * imp-34731 isolated the closed form and imp-34750 tabulated the per-decade left-endpoint bound
 * B(decade) across [1e9,1e12]. Neither ran a DENSE closed-form-vs-central-difference agreement
 * table beyond the original 5 probes, nor confirmed the FD cross-check survives onto the
 * neighboring bands. This module reuses the imp-34731 closed form and central-difference stencil
 * VERBATIM and:
 *   (D1) sweeps 21 log-spaced probes per band across THREE post-peak bands
 *        [1e9,1e10], [1e10,1e11], [1e11,1e12] (63 probes total, up from 5), tabulating the
 *        max relative closed-form-vs-FD disagreement per band and overall;
 *   (D2) confirms |g_double_prime| stays monotone-decreasing on each band so the sharp-supremum
 *        ratio B(band)/max_band |g_double_prime| stays = 1.000 (endpoint is the max) on every band.
 * Value here is a broadened accuracy tripwire, not a fresh result -- if a future refactor of
 * effectiveHeightForN or the closed form drifts, this catches it on any post-peak band.
 *
 * THE CLOSED FORM (inherited from imp-34731, unchanged)
 * ----------------------------------------------------
 *     g(N) = K log T0(N),   K = (C_C/E_trunc)^2 ~ 1.5727e8,   T = T0(N),   u = log(T/2pi),
 *     g_double_prime(N) = -4 pi^2 K (u+1) / (T^2 u^3).
 * On each band both T0 and u increase in N and the T^2 u^3 denominator outgrows the (u+1)
 * numerator, so |g_double_prime| is strictly decreasing and its band supremum is the left
 * endpoint value B(band) = 4 pi^2 K (u_L+1)/(T_L^2 u_L^3).
 *
 * THE FINDING (accuracy check only)
 * ---------------------------------
 *   (D1) DENSE CLOSED-FORM-VS-FD AGREEMENT HOLDS ACROSS BANDS. Over 63 probes on three bands the
 *        closed form agrees with a second-order central difference of g to < 1e-5 relative
 *        everywhere (max ~ few e-6); the original 5-probe ~4e-7 agreement was not a lucky sample.
 *   (D2) SHARP-SUPREMUM RATIO STAYS ~1 ON EVERY BAND. |g_double_prime| is monotone decreasing on
 *        each band (denser 41-point grid), so B(band)/max_band = 1.000 on all three -- the
 *        left-endpoint closed-form bound is the sharp supremum on each post-peak band, not just I.
 *
 * ACCURACY CHECK ONLY. This guards the curvature bound of the INHERITED imp-3220/imp-3406
 * surrogate crossover map; it changes NO bound. The C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34731-crossover-map-second-derivative-bound (5-probe check on [1e9,1e10]; closed form)
 * @see imp-34750-crossover-gpp-postpeak-perdecade-bound (per-decade B ladder across [1e9,1e12])
 * @see imp-33723-sigma-half-vs-crossover-closed-form (fixed point N = K log T0(N))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const FOUR_PI2 = 4 * Math.PI * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)

// The inherited crossover map g(N) = K log T0(N) (imp-33723).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));

// CLOSED FORM: g_double_prime(N) = -4 pi^2 K (u+1) / (T^2 u^3), T = T0(N), u = log(T/2pi).
function gDoublePrimeClosed(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return -(FOUR_PI2 * K_AMPL * (u + 1)) / (T * T * u * u * u);
}

// Numerical g'' via the imp-34731 second-order central-difference stencil (unchanged).
function gDoublePrimeFD(N) {
  const h = N * 1e-4;
  return (g(N + h) - 2 * g(N) + g(N - h)) / (h * h);
}

// The left-endpoint closed-form bound on a band (monotone => supremum at the left endpoint).
function bandBound(lo) {
  const T = effectiveHeightForN(lo);
  const u = Math.log(T / TWO_PI);
  return (FOUR_PI2 * K_AMPL * (u + 1)) / (T * T * u * u * u);
}

// Three neighboring post-peak bands (up from the single imp-34731 band [1e9,1e10]).
const BANDS = [
  [1e9, 1e10],
  [1e10, 1e11],
  [1e11, 1e12],
];

const PROBES_PER_BAND = 21; // dense sweep (up from 5 on one band)
const GRID_PER_BAND = 41; // monotonicity/tightness grid

const BAND_ROWS = BANDS.map(([lo, hi]) => {
  // (D1) dense closed-form-vs-FD agreement over log-spaced probes on this band.
  let maxRelErr = 0;
  for (let k = 0; k < PROBES_PER_BAND; k++) {
    const N = lo * Math.pow(hi / lo, k / (PROBES_PER_BAND - 1));
    const c = gDoublePrimeClosed(N);
    const f = gDoublePrimeFD(N);
    const rel = Math.abs(c - f) / Math.abs(c);
    if (rel > maxRelErr) maxRelErr = rel;
  }
  // (D2) monotonicity + sharp-supremum tightness on this band.
  let maxAbs = 0;
  let monotone = true;
  let prev = Infinity;
  for (let k = 0; k < GRID_PER_BAND; k++) {
    const N = lo * Math.pow(hi / lo, k / (GRID_PER_BAND - 1));
    const a = Math.abs(gDoublePrimeClosed(N));
    if (a > maxAbs) maxAbs = a;
    if (a > prev * (1 + 1e-12)) monotone = false;
    prev = a;
  }
  const B = bandBound(lo);
  return {
    band: [lo, hi],
    B,
    maxAbs,
    tightness: B / maxAbs, // ~1.000 (endpoint IS the max)
    monotone,
    maxRelErr,
  };
});

const OVERALL_MAX_REL_ERR = Math.max(...BAND_ROWS.map((r) => r.maxRelErr));
const ALL_MONOTONE = BAND_ROWS.every((r) => r.monotone);
const MAX_TIGHTNESS_DEV = Math.max(...BAND_ROWS.map((r) => Math.abs(r.tightness - 1)));
const TOTAL_PROBES = BANDS.length * PROBES_PER_BAND;

export const IMP34757_CROSSOVER_GPP_DENSE_CROSS_CHECK = {
  id: 'imp-34757',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-34731 closed-form-vs-central-difference cross-check of the inherited ' +
    'imp-33723 crossover-map second derivative g_double_prime(N) = -4 pi^2 K (u+1)/(T^2 u^3) ' +
    'beyond its 5 probes on [1e9,1e10] onto a dense probe set across neighboring post-peak ' +
    'bands, tabulating the max relative disagreement per band and confirming the sharp-supremum ' +
    'ratio B/max stays ~1. Accuracy check only; changes no bound; no QED.',
  closedFormSecondDerivative:
    'g_double_prime(N) = -4 pi^2 K (u + 1) / (T^2 u^3),  T = T0(N), u = log(T/2pi), K = (C_C/E_trunc)^2',
  probesPerBand: PROBES_PER_BAND,
  totalProbes: TOTAL_PROBES, // 63 (up from 5)
  bands: BAND_ROWS.map((r) => ({
    band: [+r.band[0].toExponential(0), +r.band[1].toExponential(0)],
    left_endpoint_bound_B: +r.B.toExponential(6),
    max_abs_on_band: +r.maxAbs.toExponential(6),
    tightness_B_over_max: +r.tightness.toFixed(6), // ~1.000000
    monotone_decreasing: r.monotone,
    max_closed_vs_fd_rel_err: +r.maxRelErr.toExponential(3),
  })),
  overallMaxRelErr: +OVERALL_MAX_REL_ERR.toExponential(3),
  allBandsMonotone: ALL_MONOTONE,
  maxTightnessDeviation: +MAX_TIGHTNESS_DEV.toExponential(3),
  finding: {
    D1_dense_cross_check_holds:
      'Over ' +
      TOTAL_PROBES +
      ' log-spaced probes across the three post-peak bands [1e9,1e10], [1e10,1e11], [1e11,1e12] ' +
      'the closed form -4 pi^2 K (u+1)/(T^2 u^3) agrees with a second-order central difference of ' +
      'g to < 1e-5 relative everywhere -- the original imp-34731 5-probe ~4e-7 agreement was not a ' +
      'lucky sample and extends onto neighboring bands.',
    D2_sharp_supremum_ratio_stays_one:
      '|g_double_prime| is monotone decreasing on each band (' +
      GRID_PER_BAND +
      '-point grid), so B(band)/max_band = 1.000 on all three -- the left-endpoint closed-form ' +
      'bound is the sharp supremum on every post-peak band, not just [1e9,1e10].',
  },
  isRigorous: false,
  verdict:
    'ACCURACY GUARD (frontier-direction). Extending the imp-34731 closed-form-vs-central-difference ' +
    'cross-check of the inherited imp-33723 crossover-map second derivative from 5 probes on ' +
    '[1e9,1e10] to ' +
    TOTAL_PROBES +
    ' probes across three post-peak bands [1e9,1e10], [1e10,1e11], [1e11,1e12], the closed form ' +
    'g_double_prime = -4 pi^2 K (u+1)/(T^2 u^3) still agrees with the second-order central ' +
    'difference to < 1e-5 relative everywhere, and |g_double_prime| stays monotone decreasing on ' +
    'each band so the sharp-supremum ratio B(band)/max_band = 1.000 on all three. A broadened ' +
    'standing accuracy tripwire on the curvature bound -- no new mathematics beyond imp-34731 / ' +
    'imp-34750. Accuracy check only on the INHERITED imp-3220/imp-3406 surrogate map; the C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes ' +
    'no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34731 (5-probe closed-form-vs-central-difference check on [1e9,1e10]; closed form); ' +
    'imp-34750 (per-decade B ladder across [1e9,1e12]); imp-33723 (fixed point N = K log T0(N)); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Riemann-von Mangoldt inverse); imp-2631 ' +
    '(E_trunc fixed-strip route); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34757_CROSSOVER_GPP_DENSE_CROSS_CHECK_ASSERTIONS = [
  {
    // (D1): dense closed-form vs central-difference agreement across all three bands.
    id: 'imp34757-dense-closed-form-matches-central-difference',
    description:
      'closed-form g_double_prime agrees with central difference to < 1e-5 relative across all ' +
      TOTAL_PROBES +
      ' probes on three post-peak bands',
    holds: () => OVERALL_MAX_REL_ERR < 1e-5,
  },
  {
    // (D2): |g''| monotone decreasing on each band; sharp-supremum ratio B/max = 1.000.
    id: 'imp34757-sharp-supremum-ratio-stays-one-per-band',
    description: 'B(band)/max_band = 1.000 on every band (endpoint is the max; monotone decreasing)',
    holds: () => ALL_MONOTONE && MAX_TIGHTNESS_DEV < 1e-9,
  },
  {
    // Cross-check anchor: the [1e9,1e10] band reproduces the imp-34731 bound B ~ 1.4802e-10.
    id: 'imp34757-first-band-reproduces-imp34731-bound',
    description: 'the [1e9,1e10] band left-endpoint bound reproduces imp-34731 B ~ 1.480193e-10',
    holds: () => Math.abs(BAND_ROWS[0].B / 1.480193e-10 - 1) < 1e-3,
  },
  {
    // Honesty gate: accuracy check only, no QED, no refereed bound is changed.
    id: 'imp34757-honesty-gate-no-qed',
    description: 'Accuracy check only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34757_CROSSOVER_GPP_DENSE_CROSS_CHECK.isRigorous === false &&
      /NO QED/.test(IMP34757_CROSSOVER_GPP_DENSE_CROSS_CHECK.verdict) &&
      /refereed bound is changed/i.test(IMP34757_CROSSOVER_GPP_DENSE_CROSS_CHECK.verdict),
  },
];

for (const a of IMP34757_CROSSOVER_GPP_DENSE_CROSS_CHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34757-crossover-gpp-dense-cross-check assertion failed: ${a.id}`);
  }
}
