/**
 * @module imp-97817-fartail-diagnostic-hump-peak-cc-sensitivity
 *
 * imp-97817 (numerical, frontier-direction): imp-97782 pinned the FULL imp-97723 diagnostic small-N
 * HUMP PEAK (log10 N = 7.76832, diag = 14.89166, sigma = 0.86502) by derivative root-finding and
 * swept ONLY the imp-33708 0.5x..5x E_trunc FLOOR (location elasticity ~ -1.79, value elasticity
 * ~ -4.09). But the dominant term at the hump is sigma * log T0 with sigma ~ 0.865, and sigma depends
 * on E_coll = C_C * sqrt(log T0 / N) through the imp-2642/imp-2643 C_C = (1/8) sqrt(3 pi) ANSATZ,
 * which imp-97782 held fixed. This module measures the SAME hump-peak location and value sensitivity
 * to a C_C rescale (0.5x..2x) by the same derivative-root-finding, and compares the C_C-elasticity
 * magnitude against the E_trunc-floor elasticity.
 *
 * THE FULL DIAGNOSTIC (identical sub-terms to imp-3406 / imp-97723 / imp-97782)
 * ---------------------------------------------------------------------------
 *     sigma(N)  = E_coll / (E_trunc + E_flow + E_coll)
 *     E_trunc   = 3.06e-5                     (imp-2631 fixed strip; HELD FIXED here)
 *     E_coll    = C_C * sqrt(log T0 / N),  C_C = ccFactor * (1/8) sqrt(3 pi)   (imp-2642/imp-2643)
 *     E_flow    = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi     (imp-398)
 *     T0        = effectiveHeightForN(N)      (Riemann-von Mangoldt inverse)
 *     diag(N)   = (1 - sigma)(1 - 1/log(T0/2pi)) + sigma * log T0             (imp-97723 closed form)
 * The ONLY parameter swept here is the C_C rescale (ccFactor in {0.5, 1, 2}); every other sub-term --
 * INCLUDING the E_trunc floor -- is reused byte-for-byte, so ccFactor = 1 reproduces the imp-97782
 * baseline peak (log10 N = 7.76832, diag = 14.89166, sigma = 0.86502) exactly. The C_C ansatz is only
 * RESCALED as a sensitivity probe, not re-derived.
 *
 * PINNING THE HUMP PEAK (derivative root-finding, byte-for-byte imp-97782)
 * -----------------------------------------------------------------------
 * The peak is pinned by bisecting the LOG10-N derivative d diag / d(log10 N) (H = 1e-6 central
 * difference) to its root on [2, 16]: on the small-N side the sigma * log T0 term rises (derivative
 * > 0), then sigma decays and the diagnostic falls off the hump (derivative < 0), so the derivative
 * changes sign exactly once at the peak.
 *
 * THE MEASUREMENT: C_C-swap of the peak landmark
 * ----------------------------------------------
 * For each ccFactor the peak (location log10 N, value diag) is re-pinned, and the max spread across
 * the 0.5x..2x swap is reported for BOTH location and value, together with the local elasticities
 * d log10 N_peak / d log10(ccFactor) and d diag_peak / d log10(ccFactor), so the C_C-elasticity
 * magnitude can be set beside the imp-97782 E_trunc-floor elasticity.
 *
 * THE FINDINGS (measurement / sensitivity only)
 * ---------------------------------------------
 *   (F1) THE ccFactor = 1 PEAK REPRODUCES imp-97782 EXACTLY: log10 N = 7.76832, diag = 14.89166,
 *        sigma = 0.86502 (genuine stationary point, |deriv| < 1e-8). The C_C rescale re-uses the whole
 *        imp-97782 pinning path, so the baseline is byte-for-byte.
 *   (F2) THE PEAK IS STRONGLY C_C-SENSITIVE IN LOCATION, WITH THE OPPOSITE SIGN TO THE FLOOR. Across
 *        the 0.5x..2x C_C swap the location moves ~1.019 decades (log10 N: 7.28183 at 0.5x ->
 *        8.30108 at 2x) with elasticity d log10 N_peak / d log10(ccFactor) ~ +1.69. RAISING C_C lifts
 *        E_coll, hence sigma, so the sigma * log T0 hump reaches further into the tail and the peak
 *        slides to HIGHER N -- the mirror of the E_trunc floor (imp-97782 F2, ~ -1.79), whose
 *        magnitude it nearly matches (~1.69 vs ~1.79).
 *   (F3) THE PEAK VALUE IS ALSO STRONGLY C_C-SENSITIVE, MAGNITUDE MARGINALLY ABOVE THE FLOOR. Across
 *        the same swap diag_peak moves ~2.641 (13.52566 at 0.5x -> 16.16647 at 2x, a ~17.7% band)
 *        with elasticity d diag_peak / d log10(ccFactor) ~ +4.39 -- again the mirror sign of the
 *        floor (imp-97782 F3, ~ -4.09) and slightly LARGER in magnitude (~4.39 vs ~4.09).
 *   (F4) NEITHER PARAMETER DOMINATES; THE NEAR-MIRROR IS STRUCTURAL. At the hump E_flow is negligible,
 *        so sigma ~ E_coll / (E_trunc + E_coll) = 1 / (1 + E_trunc / E_coll): a C_C rescale by c is,
 *        to leading order, an E_trunc rescale by 1/c, forcing opposite-sign, near-equal-magnitude
 *        elasticities. The small residual gap (location |1.69| < |1.79|, value |4.39| > |4.09|) is the
 *        non-zero E_flow plus the shifted peak-N (different log T0), NOT a dominance of one parameter.
 *
 * The punchline: re-running the imp-97782 derivative root-finding under a C_C rescale (instead of an
 * E_trunc floor swap) shows the hump peak is essentially EQUALLY sensitive to the C_C ansatz and to
 * the E_trunc floor -- opposite in sign (C_C raises sigma, E_trunc lowers it), near-equal in magnitude
 * (location ~1.69 vs ~1.79, value ~4.39 vs ~4.09) -- because near the hump both parameters act on
 * sigma only through the ratio E_trunc / E_coll. The C_C ansatz is as much a lever on the hump peak as
 * the E_trunc floor is; imp-97782 measured only one arm of a near-symmetric pair.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. Uses the inherited
 * imp-3406/imp-97723 component model and the imp-97782 derivative-root pinning, NOT a rigorous
 * asymptotic; the C_C ansatz is only rescaled as a sensitivity probe, not re-derived; C_mb stays
 * GUE-conditional per imp-486; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97782-fartail-diagnostic-hump-peak-pin (pins the peak, swept ONLY the E_trunc floor)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (the full diagnostic closed form)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor swap)
 * @see polymath15-constant-C-C (the C_C = (1/8) sqrt(3 pi) ansatz, imp-2642/imp-2643)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via the RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_FIXED = 3.06e-5; // imp-2631 fixed-strip floor, HELD FIXED (imp-97782 baseline factor 1.0)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97723/imp-97782 exactly

// EXACT imp-97723/imp-97782 sub-terms; ONLY the C_C amplitude is a parameter here.
function parts(N, C_C) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C * Math.sqrt(L / N);
  const sigma = E_coll / (E_TRUNC_FIXED + E_flow + E_coll);
  return { L, sigma, Lprime: Math.log(T0 / TWO_PI) };
}
// FULL diagnostic (sigma term INCLUDED), evaluated at x = log10 N: imp-97723 closed form.
function diagAt(x, C_C) {
  const P = parts(Math.pow(10, x), C_C);
  return (1 - P.sigma) * (1 - 1 / P.Lprime) + P.sigma * P.L;
}
function sigmaAt(x, C_C) {
  return parts(Math.pow(10, x), C_C).sigma;
}

const DERIV_H = 1e-6; // central-difference step in log10 N for the derivative root-find (imp-97782)
function dDiag(x, C_C) {
  return (diagAt(x + DERIV_H, C_C) - diagAt(x - DERIV_H, C_C)) / (2 * DERIV_H);
}

// Pin the hump peak by bisecting the derivative root on [2, 16]: the sigma*log T0 term rises
// (derivative > 0) then the diagnostic falls off the hump (derivative < 0), so the derivative
// changes sign exactly once at the peak. Byte-for-byte the imp-97782 pinner.
function pinPeak(C_C) {
  let lo = 2;
  let hi = 16;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (dDiag(m, C_C) > 0) lo = m;
    else hi = m;
  }
  const log10N = (lo + hi) / 2;
  return {
    log10N,
    diag: diagAt(log10N, C_C),
    sigma: sigmaAt(log10N, C_C),
    deriv: dDiag(log10N, C_C),
  };
}

const CC_FACTORS = [0.5, 1.0, 2.0];

// --- The pinned peak at each C_C rescale (baseline = ccFactor 1.0 = imp-97782) ----------------
const PINS = CC_FACTORS.map((f) => {
  const p = pinPeak(C_C_PINNED * f);
  return { factor: f, log10N: p.log10N, diag: p.diag, sigma: p.sigma, deriv: p.deriv };
});
const BASELINE = PINS.find((p) => p.factor === 1.0);

// --- C_C-swap spreads and elasticities --------------------------------------------------------
const locs = PINS.map((p) => p.log10N);
const vals = PINS.map((p) => p.diag);
const LOC_SPREAD = Math.max(...locs) - Math.min(...locs); // ~1.019 decades
const VAL_SPREAD = Math.max(...vals) - Math.min(...vals); // ~2.641

// Local elasticity per decade of C_C factor, measured across the widest 0.5x..2x arm.
const loArm = PINS.find((p) => p.factor === 0.5);
const hiArm = PINS.find((p) => p.factor === 2.0);
const dLog10Factor = Math.log10(2.0) - Math.log10(0.5); // = log10(4) ~ 0.60206
const LOC_ELASTICITY = (hiArm.log10N - loArm.log10N) / dLog10Factor; // ~ +1.69
const VAL_ELASTICITY = (hiArm.diag - loArm.diag) / dLog10Factor; // ~ +4.39
const VAL_REL_BAND = VAL_SPREAD / BASELINE.diag; // ~0.177 (~17.7%)

// imp-97782 E_trunc-floor elasticities, for the side-by-side magnitude comparison.
const ETRUNC_LOC_ELASTICITY = -1.79; // imp-97782 F2 (d log10 N_peak / d log10(floor factor))
const ETRUNC_VAL_ELASTICITY = -4.09; // imp-97782 F3 (d diag_peak / d log10(floor factor))
const LOC_ELASTICITY_RATIO = Math.abs(LOC_ELASTICITY) / Math.abs(ETRUNC_LOC_ELASTICITY); // ~0.95
const VAL_ELASTICITY_RATIO = Math.abs(VAL_ELASTICITY) / Math.abs(ETRUNC_VAL_ELASTICITY); // ~1.07

const LADDER = PINS.map((p) => ({
  ccFactor: p.factor,
  log10N_peak: +p.log10N.toFixed(5),
  diag_peak: +p.diag.toFixed(5),
  sigma_at_peak: +p.sigma.toFixed(5),
  deriv_at_peak: +p.deriv.toExponential(2),
}));

export const IMP97817_FARTAIL_DIAGNOSTIC_HUMP_PEAK_CC_SENSITIVITY = {
  id: 'imp-97817',
  proofSection: 'S-frontier',
  question:
    'imp-97782 pinned the imp-97723 diagnostic small-N hump peak (log10 N = 7.76832, diag = ' +
    '14.89166, sigma = 0.86502) and swept ONLY the imp-33708 0.5x..5x E_trunc floor (location ' +
    'elasticity ~ -1.79, value elasticity ~ -4.09). The dominant sigma * log T0 term depends on ' +
    'E_coll = C_C * sqrt(log T0 / N) through the imp-2642/imp-2643 C_C = (1/8) sqrt(3 pi) ansatz, ' +
    'held fixed by imp-97782. MEASURE the same hump-peak location and value sensitivity to a C_C ' +
    'rescale (0.5x..2x) by the same derivative root-finding, and compare the C_C-elasticity ' +
    'magnitude against the E_trunc-floor elasticity. Measurement/sensitivity only; the C_C ansatz ' +
    'is only rescaled as a probe, not re-derived; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the hump-peak location (log10 N, derivative root of the imp-97723 diagnostic) and value (diag), ' +
    'plus sigma there, for C_C = ccFactor * (1/8) sqrt(3 pi), ccFactor in {0.5, 1, 2}, with the ' +
    'E_trunc floor held at 3.06e-5; the max spread in each across the C_C swap, the local ' +
    'elasticities d log10 N_peak / d log10(ccFactor), d diag_peak / d log10(ccFactor), and their ' +
    'magnitude ratios against the imp-97782 E_trunc-floor elasticities (-1.79, -4.09)',
  peak: {
    log10N: +BASELINE.log10N.toFixed(5), // ~7.76832 (reproduces imp-97782 exactly)
    diag: +BASELINE.diag.toFixed(5), // ~14.89166
    sigma: +BASELINE.sigma.toFixed(5), // ~0.86502
    deriv_at_pin: +BASELINE.deriv.toExponential(2),
    note:
      'ccFactor = 1 re-uses the whole imp-97782 pinning path, so the baseline peak is byte-for-byte ' +
      '(log10 N = 7.76832, diag = 14.89166, sigma = 0.86502; genuine stationary point |deriv| < 1e-8)',
  },
  ccSwap: {
    factors: CC_FACTORS,
    location_spread_decades: +LOC_SPREAD.toFixed(4), // ~1.019
    value_spread: +VAL_SPREAD.toFixed(4), // ~2.641
    value_relative_band: +VAL_REL_BAND.toFixed(4), // ~0.177
    location_elasticity_per_decade: +LOC_ELASTICITY.toFixed(4), // ~ +1.69
    value_elasticity_per_decade: +VAL_ELASTICITY.toFixed(4), // ~ +4.39
    etrunc_location_elasticity: ETRUNC_LOC_ELASTICITY, // imp-97782 -1.79
    etrunc_value_elasticity: ETRUNC_VAL_ELASTICITY, // imp-97782 -4.09
    location_elasticity_magnitude_ratio: +LOC_ELASTICITY_RATIO.toFixed(4), // ~0.95
    value_elasticity_magnitude_ratio: +VAL_ELASTICITY_RATIO.toFixed(4), // ~1.07
    note:
      'the C_C rescale slides the peak LOCATION by ~1.019 decades (elasticity ~ +1.69) AND its VALUE ' +
      'by ~17.7% (elasticity ~ +4.39): both are the OPPOSITE sign of the E_trunc floor (C_C raises ' +
      'sigma, E_trunc lowers it) and near-equal in magnitude (|1.69| vs |1.79|, |4.39| vs |4.09|), so ' +
      'the hump peak is essentially EQUALLY sensitive to the C_C ansatz and the E_trunc floor',
  },
  ladder: LADDER,
  finding: {
    F1_baseline_reproduces_imp97782:
      'The ccFactor = 1 peak reproduces imp-97782 exactly: log10 N = 7.76832, diag = 14.89166, ' +
      'sigma = 0.86502, a genuine stationary point (|deriv| < 1e-8). The C_C rescale re-uses the ' +
      'whole imp-97782 derivative-root pinning path, so the baseline is byte-for-byte.',
    F2_location_strongly_cc_sensitive_opposite_sign:
      'Across the 0.5x..2x C_C swap the peak LOCATION moves ~1.019 decades (log10 N: 7.28183 at 0.5x ' +
      '-> 8.30108 at 2x) with elasticity d log10 N_peak / d log10(ccFactor) ~ +1.69. Raising C_C ' +
      'lifts E_coll and hence sigma, so the sigma * log T0 hump reaches further into the tail and the ' +
      'peak slides to HIGHER N -- the mirror of the E_trunc floor (imp-97782 F2, ~ -1.79), whose ' +
      'magnitude it nearly matches (~1.69 vs ~1.79).',
    F3_value_also_strongly_cc_sensitive_opposite_sign:
      'Across the same swap diag_peak moves ~2.641 (13.52566 at 0.5x -> 16.16647 at 2x, a ~17.7% ' +
      'band) with elasticity d diag_peak / d log10(ccFactor) ~ +4.39 -- again the mirror sign of the ' +
      'floor (imp-97782 F3, ~ -4.09) and slightly LARGER in magnitude (~4.39 vs ~4.09).',
    F4_neither_parameter_dominates_near_mirror_is_structural:
      'Neither parameter dominates and the near-mirror is structural: at the hump E_flow is ' +
      'negligible, so sigma ~ E_coll / (E_trunc + E_coll) = 1 / (1 + E_trunc / E_coll); a C_C rescale ' +
      'by c is, to leading order, an E_trunc rescale by 1/c, forcing opposite-sign, near-equal ' +
      'elasticities. The small residual gap (location |1.69| < |1.79|, value |4.39| > |4.09|) is the ' +
      'non-zero E_flow plus the shifted peak-N (different log T0), NOT a dominance of one parameter.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier-direction, NOT rigorous). Re-running the imp-97782 ' +
    'derivative root-finding under a C_C rescale (instead of the E_trunc floor swap) reproduces the ' +
    'imp-97782 hump peak at ccFactor = 1 (log10 N = 7.76832, diag = 14.89166, sigma = 0.86502) and ' +
    'shows the peak is strongly C_C-sensitive in BOTH location -- it moves ~1.019 decades (7.28183 at ' +
    '0.5x -> 8.30108 at 2x, elasticity ~ +1.69) -- AND value -- it moves ~2.641 (13.52566 -> ' +
    '16.16647, ~17.7%, elasticity ~ +4.39). Both elasticities are the OPPOSITE sign of the imp-97782 ' +
    'E_trunc-floor elasticities (C_C raises sigma, E_trunc lowers it) and near-equal in magnitude ' +
    '(location |1.69| vs |1.79|, ratio ~0.95; value |4.39| vs |4.09|, ratio ~1.07), so the hump peak ' +
    'is essentially EQUALLY sensitive to the C_C ansatz and the E_trunc floor. The near-mirror is ' +
    'structural: at the hump E_flow is negligible, so sigma ~ 1 / (1 + E_trunc / E_coll) and a C_C ' +
    'rescale by c acts to leading order like an E_trunc rescale by 1/c; the small residual gap is the ' +
    'non-zero E_flow and the shifted peak-N, NOT a dominance of one parameter. imp-97782 measured ' +
    'only one arm of a near-symmetric pair. Measurement only; uses the inherited imp-3406/imp-97723 ' +
    'model and the imp-97782 pinning, NOT a rigorous asymptotic; the C_C ansatz is only rescaled as a ' +
    'probe, not re-derived; C_mb stays GUE-conditional (imp-486); changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97782 (pins the peak, swept ONLY the E_trunc floor); imp-97723 (full diagnostic closed ' +
    'form); imp-33708 (0.5x..5x E_trunc floor swap); polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi) ' +
    'ansatz, imp-2642/imp-2643); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 ' +
    'fixed-strip floor); lambda-rh-height-mapping (RvM inverse).',
};

export const IMP97817_FARTAIL_DIAGNOSTIC_HUMP_PEAK_CC_SENSITIVITY_ASSERTIONS = [
  {
    // (F1) The ccFactor = 1 pin reproduces the imp-97782 hump landmark byte-for-byte.
    id: 'imp97817-reproduces-imp97782-hump',
    description: 'the ccFactor = 1 peak matches the imp-97782 pin (log10 N ~ 7.76832, diag ~ 14.89166)',
    holds: () =>
      Math.abs(BASELINE.log10N - 7.76832) < 1e-3 &&
      Math.abs(BASELINE.diag - 14.89166) < 1e-2,
  },
  {
    // (F1) The pin is a genuine stationary point: derivative is at the root-find floor.
    id: 'imp97817-pin-is-stationary',
    description: 'the diagnostic derivative at the pinned peak is < 1e-8 in magnitude (genuine stationary point)',
    holds: () => Math.abs(BASELINE.deriv) < 1e-8,
  },
  {
    // (F1) sigma is near 1 at the hump (E_coll dominant), so the sigma*log T0 term dominates diag.
    id: 'imp97817-sigma-near-one-at-peak',
    description: 'sigma at the pinned peak is in [0.8, 0.95] (E_coll dominant, sigma*log T0 term dominates)',
    holds: () => BASELINE.sigma > 0.8 && BASELINE.sigma < 0.95,
  },
  {
    // (F2) The peak LOCATION is strongly C_C-sensitive: ~1 decade across the 0.5x..2x swap.
    id: 'imp97817-location-strongly-cc-sensitive',
    description: 'the peak location spread across the C_C swap is near 1 decade in log10 N',
    holds: () => LOC_SPREAD > 0.7 && LOC_SPREAD < 1.5,
  },
  {
    // (F2) The location elasticity is POSITIVE (opposite sign to the E_trunc floor) and near +1.7.
    id: 'imp97817-location-elasticity-positive-near-1p7',
    description: 'd log10 N_peak / d log10(ccFactor) is positive and near +1.7 (raising C_C pushes the peak to higher N)',
    holds: () => LOC_ELASTICITY > 1.4 && LOC_ELASTICITY < 2.0,
  },
  {
    // (F3) The peak VALUE is ALSO strongly C_C-sensitive: >10% band across the swap.
    id: 'imp97817-value-also-strongly-cc-sensitive',
    description: 'the peak value relative band across the C_C swap exceeds 10%',
    holds: () => VAL_REL_BAND > 0.1 && VAL_REL_BAND < 0.4,
  },
  {
    // (F4) The C_C elasticities are the OPPOSITE sign of the E_trunc-floor elasticities.
    id: 'imp97817-cc-elasticity-opposite-sign-to-floor',
    description: 'the C_C location and value elasticities have the opposite sign to the imp-97782 E_trunc-floor elasticities',
    holds: () =>
      LOC_ELASTICITY * ETRUNC_LOC_ELASTICITY < 0 &&
      VAL_ELASTICITY * ETRUNC_VAL_ELASTICITY < 0,
  },
  {
    // (F4) The C_C and E_trunc elasticity MAGNITUDES are comparable (within ~30%) -- neither dominates.
    id: 'imp97817-cc-elasticity-magnitude-comparable-to-floor',
    description: 'the |C_C| / |E_trunc| elasticity ratios (location and value) are both within ~30% of 1 -- neither parameter dominates',
    holds: () =>
      LOC_ELASTICITY_RATIO > 0.7 && LOC_ELASTICITY_RATIO < 1.3 &&
      VAL_ELASTICITY_RATIO > 0.7 && VAL_ELASTICITY_RATIO < 1.3,
  },
  {
    // Monotone landmark: higher C_C -> higher-N peak and higher diag value across the ladder.
    id: 'imp97817-ladder-monotone-in-cc',
    description: 'as the C_C factor increases the peak location and value both strictly increase',
    holds: () => {
      for (let i = 1; i < PINS.length; i++) {
        if (!(PINS[i].log10N > PINS[i - 1].log10N)) return false;
        if (!(PINS[i].diag > PINS[i - 1].diag)) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, no refereed bound is changed.
    id: 'imp97817-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP97817_FARTAIL_DIAGNOSTIC_HUMP_PEAK_CC_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP97817_FARTAIL_DIAGNOSTIC_HUMP_PEAK_CC_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP97817_FARTAIL_DIAGNOSTIC_HUMP_PEAK_CC_SENSITIVITY.verdict),
  },
];

for (const a of IMP97817_FARTAIL_DIAGNOSTIC_HUMP_PEAK_CC_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97817-fartail-diagnostic-hump-peak-cc-sensitivity assertion failed: ${a.id}`
    );
  }
}
