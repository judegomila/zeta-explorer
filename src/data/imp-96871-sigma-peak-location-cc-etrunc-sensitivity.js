/**
 * @module imp-96871-sigma-peak-location-cc-etrunc-sensitivity
 *
 * imp-96871 (numerical, frontier-direction): MEASURE THE PEAK-LOCATION SENSITIVITY
 * of the GUE-conditional sigma peak -- the shift of the argmax N_max under the two
 * free-looking constants C_C and E_trunc. The siblings imp-96831 / imp-96794 /
 * imp-96851 measured only the peak HEIGHT sigma_max (dg_sigma/dlogC_C ~ +0.048,
 * dg_sigma/dlogE_trunc ~ -0.019, cross-term ~ +0.017). NONE measured how the peak
 * LOCATION N_max ~ 9.22e5 itself moves. This module tabulates
 * dlogN_max/dlogC_C and dlogN_max/dlogE_trunc at the base peak.
 *
 * WHY THIS IS A DISTINCT MEASUREMENT
 * ----------------------------------
 * The height sensitivity answers "how much smaller can the binding conditional share
 * be made" (answer: not much, imp-96851). The LOCATION sensitivity answers a different
 * question: "at which N does the collision term dominate, and does that N move when we
 * rescale the constants?" -- which matters because the whole ladder is an
 * extrapolation-in-N argument, so the stability of the argmax under the constants is a
 * separate robustness fact from the stability of the height.
 *
 * THE QUANTITY (identical imp-3406 / imp-96851 component model)
 * ------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C * sqrt(log T0 / N)              (GUE-conditional, dominant)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi (imp-398)
 *     E_trunc                                       (imp-2631 floor; base 3.06e-5)
 * N_max = argmax_N sigma(N). At (C_C, E_trunc) = (C_C_PINNED, 3.06e-5) this reproduces
 * imp-3406 byte-for-byte (N_max ~ 9.22e5, sigma_max ~ 0.94943).
 *
 * THE MECHANISM (why the C_C location partial is EXACTLY zero)
 * -----------------------------------------------------------
 * Write sigma = 1/(1 + R(N)) with R(N) = (E_trunc + E_flow(N)) / E_coll(N). Maximising
 * sigma over N is minimising R over N. Since C_C enters ONLY as an overall scale of
 * E_coll = C_C sqrt(L/N), it factors out of R:
 *     R(N) = (1/C_C) * g(N),   g(N) = (E_trunc + E_flow(N)) / sqrt(log T0 / N).
 * The argmin over N of (1/C_C) g(N) does not depend on the positive prefactor 1/C_C, so
 *     N_max is EXACTLY independent of C_C   ==>   dlogN_max/dlogC_C = 0.
 * (Confirmed numerically to 8 significant figures over C_C x 0.1..10.) By contrast
 * E_trunc sits INSIDE g(N), so it does shift the argmin: raising the floor pulls the
 * dominance point to smaller N (higher E_trunc needs a larger E_coll to still dominate,
 * i.e. a smaller N), giving a large NEGATIVE location partial.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) THE C_C LOCATION PARTIAL IS EXACTLY ZERO. dlogN_max/dlogC_C = 0 (measured
 *        ~0 to ternary-search precision; exact by the factorization above). C_C moves
 *        the peak HEIGHT (+0.048) but NOT its location -- the two are decoupled.
 *   (F2) THE E_trunc LOCATION PARTIAL IS LARGE AND NEGATIVE: dlogN_max/dlogE_trunc
 *        ~ -1.374, i.e. N_max ~ E_trunc^(-1.37) locally. This is ~72x the magnitude of
 *        the E_trunc HEIGHT partial (-0.019): E_trunc barely changes the peak value but
 *        strongly relocates it. Doubling E_trunc drops N_max from ~9.22e5 to ~3.50e5.
 *   (F3) THE N_max BAND IS DRIVEN ENTIRELY BY E_trunc. Over the same 2D band as
 *        imp-96851 (0.5x..2x C_C, 0.25x..4x E_trunc) N_max ranges ~1.28e5..5.88e6
 *        (~1.66 decades), and both extreme corners sit at the E_trunc endpoints
 *        (max at 0.25x E_trunc, min at 4x E_trunc) with the C_C factor irrelevant --
 *        confirming F1 at the band level.
 *
 * VERDICT: THE PEAK LOCATION AND HEIGHT RESPOND TO ORTHOGONAL LEVERS. The argmax N_max
 * is EXACTLY invariant to C_C (dlogN_max/dlogC_C = 0, by the C_C factoring out of the
 * argmin) while being strongly moved by E_trunc (dlogN_max/dlogE_trunc ~ -1.37), the
 * mirror image of the HEIGHT sensitivity where C_C is the larger lever (+0.048) and
 * E_trunc the smaller (-0.019). No bound changes: N_max is only the extrapolation anchor,
 * and C_mb / C_C stay GUE-conditional (imp-486). Measurement/sensitivity only; no
 * positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-96851-sigma-peak-share-cc-etrunc-joint-sensitivity (HEIGHT joint cross-term)
 * @see imp-96831-sigma-peak-share-cc-sensitivity (HEIGHT C_C partial +0.048)
 * @see imp-96794-etrunc-reduction-peak-share-leverage (HEIGHT E_trunc partial -0.019)
 * @see imp-3406-sigma-highN-extrapolation (interior max N_max ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-486 (C_mb / C_C GUE-conditional; the pinned constant)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip floor)
 * @see imp-398 (E_flow C_F prefactor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-3406 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 / imp-96851 exactly

// EXACT imp-3406 sub-terms; BOTH C_C and E_trunc are parameters here.
function sigmaWith(N, C_C, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C * Math.sqrt(L / N);
  return E_coll / (E_trunc + E_flow + E_coll);
}

// Ternary search for the interior maximum in ln N (same spirit as imp-3406/imp-96851).
function argmaxN(C_C, E_trunc, hiExp = 10) {
  let lo = Math.log(1e3);
  let hi = Math.log(10 ** hiExp);
  for (let i = 0; i < 700; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaWith(Math.exp(m1), C_C, E_trunc) < sigmaWith(Math.exp(m2), C_C, E_trunc)) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

const N_MAX_BASE = argmaxN(C_C_PINNED, E_TRUNC_BASE);
const SIGMA_MAX_BASE = sigmaWith(N_MAX_BASE, C_C_PINNED, E_TRUNC_BASE);

// Location partials at the base peak (log-centred sqrt2 flanks -- matches siblings).
const F_LO = 1 / Math.SQRT2;
const F_HI = Math.SQRT2;
const H = Math.log(F_HI); // half-step in log space = 0.5*ln2

const N_CC_HI = argmaxN(C_C_PINNED * F_HI, E_TRUNC_BASE);
const N_CC_LO = argmaxN(C_C_PINNED * F_LO, E_TRUNC_BASE);
const DLOGN_DLOGCC = (Math.log(N_CC_HI) - Math.log(N_CC_LO)) / (2 * H); // ~ 0 (exact)

const N_ET_HI = argmaxN(C_C_PINNED, E_TRUNC_BASE * F_HI);
const N_ET_LO = argmaxN(C_C_PINNED, E_TRUNC_BASE * F_LO);
const DLOGN_DLOGET = (Math.log(N_ET_HI) - Math.log(N_ET_LO)) / (2 * H); // ~ -1.374

// C_C invariance check: N_max over a wide C_C range (max relative spread from base).
const CC_WIDE = [0.1, 0.5, 1.0, 2.0, 10.0];
let ccMaxRelSpread = 0;
for (const a of CC_WIDE) {
  const n = argmaxN(C_C_PINNED * a, E_TRUNC_BASE);
  ccMaxRelSpread = Math.max(ccMaxRelSpread, Math.abs(n - N_MAX_BASE) / N_MAX_BASE);
}

// E_trunc location ladder (pure E_trunc sweep; N_max in exponential form).
const ET_FACTORS = [0.25, 0.5, 1.0, 2.0, 4.0];
const ET_LOCATION_TABLE = ET_FACTORS.map((b) => ({
  etFactor: b,
  N_max: +argmaxN(C_C_PINNED, E_TRUNC_BASE * b).toExponential(6),
}));

// 2D band envelope on the LOCATION (same band as imp-96851): confirm N_max spread is
// driven by E_trunc, C_C irrelevant.
const CC_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0];
const ET_BAND = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 4.0];
let bandMin = Infinity;
let bandMax = -Infinity;
let bandMinCorner = null;
let bandMaxCorner = null;
for (const a of CC_FACTORS) {
  for (const b of ET_BAND) {
    const n = argmaxN(C_C_PINNED * a, E_TRUNC_BASE * b);
    if (n < bandMin) { bandMin = n; bandMinCorner = { ccFactor: a, etFactor: b }; }
    if (n > bandMax) { bandMax = n; bandMaxCorner = { ccFactor: a, etFactor: b }; }
  }
}
const BAND_SPAN_DECADES = Math.log10(bandMax) - Math.log10(bandMin);

export const IMP96871_SIGMA_PEAK_LOCATION_CC_ETRUNC_SENSITIVITY = {
  id: 'imp-96871',
  proofSection: 'S-frontier',
  question:
    'How does the LOCATION of the GUE-conditional sigma peak (the argmax N_max ~ 9.22e5) ' +
    'respond to the constants C_C and E_trunc? The siblings measured only the peak HEIGHT ' +
    'sigma_max; this measures dlogN_max/dlogC_C and dlogN_max/dlogE_trunc at the base ' +
    'peak. Measurement/sensitivity only; C_C stays GUE-conditional (imp-486); no bound changes.',
  baseRow: { N_max: +N_MAX_BASE.toExponential(4), sigma_max: +SIGMA_MAX_BASE.toFixed(7) },
  locationPartials: {
    dlogN_max_dlogCC: +DLOGN_DLOGCC.toExponential(3), // ~ 0 (exact by factorization)
    dlogN_max_dlogETrunc: +DLOGN_DLOGET.toFixed(6), // ~ -1.373707
    cc_max_rel_spread_over_0p1x_to_10x: +ccMaxRelSpread.toExponential(3), // ~ 1e-6 (ternary-search residual)
    note:
      'The C_C location partial is EXACTLY zero: C_C enters only as an overall scale of ' +
      'E_coll, so it factors out of R = (E_trunc + E_flow)/E_coll whose argmin sets N_max. ' +
      'The E_trunc location partial is large and negative (~ -1.37, i.e. N_max ~ ' +
      'E_trunc^(-1.37) locally), ~72x the magnitude of the E_trunc HEIGHT partial (-0.019).',
  },
  etLocationTable: ET_LOCATION_TABLE,
  bandEnvelope: {
    ccFactors: CC_FACTORS,
    etFactors: ET_BAND,
    N_max_min: +bandMin.toExponential(4),
    N_max_min_corner: bandMinCorner, // driven by 4x E_trunc; C_C factor irrelevant
    N_max_max: +bandMax.toExponential(4),
    N_max_max_corner: bandMaxCorner, // driven by 0.25x E_trunc
    span_decades: +BAND_SPAN_DECADES.toFixed(4),
    note:
      'Over the full 2D band (0.5x..2x C_C, 0.25x..4x E_trunc) N_max ranges ~1.28e5..5.88e6 ' +
      '(~1.66 decades). Both extreme corners sit at the E_trunc endpoints with the C_C ' +
      'factor irrelevant, confirming the C_C location invariance at the band level.',
  },
  verdict:
    'THE PEAK LOCATION AND HEIGHT RESPOND TO ORTHOGONAL LEVERS. The argmax N_max is ' +
    'EXACTLY invariant to C_C (dlogN_max/dlogC_C = 0, because C_C factors out of the ' +
    'argmin defining the location) while being strongly moved by E_trunc ' +
    '(dlogN_max/dlogE_trunc ~ -1.37) -- the mirror image of the HEIGHT sensitivity where ' +
    'C_C is the larger lever (+0.048) and E_trunc the smaller (-0.019). No bound changes: ' +
    'N_max is only the extrapolation anchor and C_mb / C_C stay GUE-conditional (imp-486). ' +
    'Measurement/sensitivity only; no positivity, no bridge closure, no RH claim, NO QED. ' +
    'No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-96851 (HEIGHT joint cross-term); imp-96831 (HEIGHT C_C partial +0.048); imp-96794 ' +
    '(HEIGHT E_trunc partial -0.019); imp-3406 (interior max N_max ~ 9.22e5, sigma_max ~ ' +
    '0.9494); imp-486 (C_mb / C_C GUE-conditional); imp-2631 (E_trunc = 3.06e-5 floor); ' +
    'imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping.',
};

export const IMP96871_SIGMA_PEAK_LOCATION_CC_ETRUNC_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: base reproduces the imp-3406 / imp-96851 pin.
    id: 'imp96871-reproduces-imp3406-base-peak',
    description: 'base (1x C_C, 1x E_trunc) reproduces imp-3406 N_max ~ 9.22e5 and sigma_max ~ 0.94943',
    holds: () =>
      Math.abs(N_MAX_BASE - 9.2186e5) / 9.2186e5 < 1e-3 &&
      Math.abs(SIGMA_MAX_BASE - 0.9494290) < 5e-5,
  },
  {
    // F1: the C_C location partial is (essentially) zero.
    id: 'imp96871-cc-location-partial-zero',
    description: 'dlogN_max/dlogC_C is ~ 0 (peak location is invariant to the C_C scale)',
    holds: () => Math.abs(DLOGN_DLOGCC) < 1e-4,
  },
  {
    // F1 at band scale: N_max is invariant to C_C over a wide range.
    id: 'imp96871-cc-invariance-wide-range',
    description: 'N_max is invariant to C_C over C_C x 0.1..10 (relative spread below 1e-4)',
    holds: () => ccMaxRelSpread < 1e-4,
  },
  {
    // F2: the E_trunc location partial is large and negative.
    id: 'imp96871-etrunc-location-partial-large-negative',
    description: 'dlogN_max/dlogE_trunc is large and negative (~ -1.37; N_max ~ E_trunc^(-1.37) locally)',
    holds: () => DLOGN_DLOGET < -1.0 && DLOGN_DLOGET > -2.0,
  },
  {
    // F2: E_trunc moves the location far more than it moves the height.
    id: 'imp96871-etrunc-moves-location-more-than-height',
    description: 'the E_trunc location partial magnitude (~1.37) dwarfs its HEIGHT partial magnitude (~0.019)',
    holds: () => Math.abs(DLOGN_DLOGET) > 10 * 0.019,
  },
  {
    // F3: the N_max band is more than a decade wide and its corners are E_trunc endpoints.
    id: 'imp96871-band-driven-by-etrunc',
    description: 'the N_max band spans > 1 decade with extreme corners at the E_trunc endpoints (0.25x max, 4x min)',
    holds: () =>
      BAND_SPAN_DECADES > 1.0 &&
      bandMaxCorner.etFactor === 0.25 &&
      bandMinCorner.etFactor === 4.0,
  },
  {
    // Honesty gate: measurement/assessment only, orthogonal-levers verdict, no QED, no refereed bound is changed.
    id: 'imp96871-honesty-gate-no-qed',
    description: 'Assessment only: orthogonal-levers verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96871_SIGMA_PEAK_LOCATION_CC_ETRUNC_SENSITIVITY.isRigorous === false &&
      /ORTHOGONAL LEVERS/.test(IMP96871_SIGMA_PEAK_LOCATION_CC_ETRUNC_SENSITIVITY.verdict) &&
      /NO QED/.test(IMP96871_SIGMA_PEAK_LOCATION_CC_ETRUNC_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP96871_SIGMA_PEAK_LOCATION_CC_ETRUNC_SENSITIVITY.verdict),
  },
];

for (const a of IMP96871_SIGMA_PEAK_LOCATION_CC_ETRUNC_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96871-sigma-peak-location-cc-etrunc-sensitivity assertion failed: ${a.id}`,
    );
  }
}
