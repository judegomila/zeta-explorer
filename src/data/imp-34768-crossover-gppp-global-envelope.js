/**
 * @module imp-34768-crossover-gppp-global-envelope
 *
 * imp-34768 (numerical, S-frontier): imp-34757 confirmed the imp-34731 closed form
 * g_double_prime(N) = -4 pi^2 K (u+1)/(T^2 u^3) is the sharp band supremum at each post-peak
 * decade's LEFT endpoint, but only PER-BAND (B(band)/max_band = 1.000 on each of [1e9,1e10],
 * [1e10,1e11], [1e11,1e12] separately). Two questions were left open: the NEXT derivative
 * g_triple_prime(N) was never derived in closed form on the same footing, and it was never
 * checked whether a SINGLE global envelope constant B(1e9) dominates |g_double_prime| across the
 * ENTIRE [1e9,1e12] union rather than merely within each decade. This module closes both on the
 * inherited imp-33723 surrogate crossover map.
 *
 * WHAT THIS ADDS (measurement/derivation, no new mathematics)
 * ----------------------------------------------------------
 * Reusing the imp-34731/imp-34757 closed form and central-difference machinery VERBATIM, and the
 * Riemann-von Mangoldt map derivatives dT/dN = 2 pi / u and du/dN = 2 pi / (T u), this module:
 *   (G1) DERIVES g_triple_prime(N) in closed form on the identical footing:
 *            g_triple_prime(N) = 8 pi^3 K (2 u^2 + 4 u + 3) / (T^3 u^5),  T = T0(N), u = log(T/2pi).
 *        The derivation: g_double_prime = -4 pi^2 K f with f = (u+1)/(T^2 u^3); differentiating
 *        d(log f)/dN = (2 pi/(T u))[1/(u+1) - 3/u - 2] = -(2 pi/(T u)) (2u^2+4u+3)/(u(u+1)),
 *        so df/dN = -2 pi (2u^2+4u+3)/(T^3 u^5) and g_triple_prime = -4 pi^2 K df/dN yields the
 *        stated form. Note 2u^2+4u+3 > 0 always, so g_triple_prime(N) > 0 on the whole ramp:
 *        the NEGATIVE g_double_prime is strictly INCREASING toward 0, i.e. |g_double_prime| is
 *        strictly DECREASING, on the entire post-peak union (not just decade-by-decade).
 *   (G2) TABULATES the closed-form-vs-central-difference agreement of g_triple_prime on the SAME
 *        dense log-spaced probe grid imp-34757 used (21 probes per band on the three post-peak
 *        bands, 63 total), against the standard 4-point third-derivative central-difference
 *        stencil [g(N+2h) - 2 g(N+h) + 2 g(N-h) - g(N-2h)] / (2 h^3).
 *   (G3) ASSESSES the SINGLE GLOBAL envelope: since g_triple_prime > 0 everywhere, |g_double_prime|
 *        is globally monotone decreasing over [1e9,1e12], so its global supremum is the LEFT
 *        endpoint value B(1e9). Tabulating |g_double_prime| on a dense grid spanning the whole
 *        union confirms the global-envelope ratio B(1e9)/max_union |g_double_prime| = 1.000 --
 *        the imp-34757 per-band sharp supremum PROMOTES to a single global constant B(1e9).
 *
 * THE CLOSED FORMS (inherited g_double_prime from imp-34731; g_triple_prime new here)
 * ----------------------------------------------------------------------------------
 *     g(N) = K log T0(N),   K = (C_C/E_trunc)^2 ~ 1.5727e8,   T = T0(N),   u = log(T/2pi),
 *     g_double_prime(N) = -4 pi^2 K (u+1) / (T^2 u^3),
 *     g_triple_prime(N) =  8 pi^3 K (2 u^2 + 4 u + 3) / (T^3 u^5).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (G2) CLOSED-FORM g_triple_prime MATCHES THE FD STENCIL. Over 63 probes on three post-peak
 *        bands the closed form agrees with the 4-point third-derivative central difference of g to
 *        < 1e-5 relative everywhere (max ~ few e-6), on the same footing imp-34757 validated
 *        g_double_prime.
 *   (G3) A SINGLE GLOBAL ENVELOPE B(1e9) DOMINATES THE WHOLE UNION. g_triple_prime > 0 everywhere
 *        makes |g_double_prime| globally monotone decreasing, so B(1e9)/max_union = 1.000 -- the
 *        per-band supremum of imp-34757 is really one global envelope constant B(1e9), no separate
 *        per-decade bookkeeping is needed to dominate |g_double_prime| across [1e9,1e12].
 *
 * MEASUREMENT/DERIVATION ONLY. This guards the curvature (and now the third-order) behaviour of
 * the INHERITED imp-3220/imp-3406 surrogate crossover map; it changes NO bound. The C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34757-crossover-gpp-dense-cross-check (dense g_double_prime FD check; per-band supremum)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; 5-probe check)
 * @see imp-34750-crossover-gpp-postpeak-perdecade-bound (per-decade B ladder across [1e9,1e12])
 * @see imp-33723-sigma-half-vs-crossover-closed-form (fixed point N = K log T0(N))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const FOUR_PI2 = 4 * Math.PI * Math.PI;
const EIGHT_PI3 = 8 * Math.PI * Math.PI * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)

// The inherited crossover map g(N) = K log T0(N) (imp-33723).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));

// CLOSED FORM (inherited imp-34731): g_double_prime = -4 pi^2 K (u+1) / (T^2 u^3).
function gDoublePrimeClosed(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return -(FOUR_PI2 * K_AMPL * (u + 1)) / (T * T * u * u * u);
}

// CLOSED FORM (new, G1): g_triple_prime = 8 pi^3 K (2 u^2 + 4 u + 3) / (T^3 u^5).
function gTriplePrimeClosed(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (EIGHT_PI3 * K_AMPL * (2 * u * u + 4 * u + 3)) / (T * T * T * u * u * u * u * u);
}

// Numerical g_triple_prime via the standard 4-point third-derivative central-difference stencil.
function gTriplePrimeFD(N) {
  const h = N * 1e-3; // wider than the imp-34757 g_double_prime step: third-derivative FD needs it
  return (g(N + 2 * h) - 2 * g(N + h) + 2 * g(N - h) - g(N - 2 * h)) / (2 * h * h * h);
}

// The single global-envelope bound: |g_double_prime| at the left endpoint of the whole union.
function envelopeBound(lo) {
  const T = effectiveHeightForN(lo);
  const u = Math.log(T / TWO_PI);
  return (FOUR_PI2 * K_AMPL * (u + 1)) / (T * T * u * u * u);
}

// Same three post-peak bands imp-34757 used, forming the union [1e9, 1e12].
const BANDS = [
  [1e9, 1e10],
  [1e10, 1e11],
  [1e11, 1e12],
];
const UNION_LO = 1e9;
const UNION_HI = 1e12;

const PROBES_PER_BAND = 21; // identical dense grid to imp-34757
const GLOBAL_GRID = 121; // dense monotonicity grid across the WHOLE union

// (G2) dense closed-form-vs-FD agreement of g_triple_prime on the same per-band probe grid.
const BAND_ROWS = BANDS.map(([lo, hi]) => {
  let maxRelErr = 0;
  for (let k = 0; k < PROBES_PER_BAND; k++) {
    const N = lo * Math.pow(hi / lo, k / (PROBES_PER_BAND - 1));
    const c = gTriplePrimeClosed(N);
    const f = gTriplePrimeFD(N);
    const rel = Math.abs(c - f) / Math.abs(c);
    if (rel > maxRelErr) maxRelErr = rel;
  }
  return { band: [lo, hi], maxRelErr };
});

// (G3) single GLOBAL envelope: |g_double_prime| monotone decreasing across the WHOLE union, and
// g_triple_prime strictly positive everywhere (the analytic reason for that monotonicity).
let globalMaxAbs = 0;
let globallyMonotone = true;
let tripleAllPositive = true;
let prev = Infinity;
for (let k = 0; k < GLOBAL_GRID; k++) {
  const N = UNION_LO * Math.pow(UNION_HI / UNION_LO, k / (GLOBAL_GRID - 1));
  const a = Math.abs(gDoublePrimeClosed(N));
  if (a > globalMaxAbs) globalMaxAbs = a;
  if (a > prev * (1 + 1e-12)) globallyMonotone = false;
  if (gTriplePrimeClosed(N) <= 0) tripleAllPositive = false;
  prev = a;
}

const B_GLOBAL = envelopeBound(UNION_LO); // B(1e9)
const GLOBAL_ENVELOPE_RATIO = B_GLOBAL / globalMaxAbs; // ~1.000 (left endpoint is the global max)
const OVERALL_MAX_REL_ERR = Math.max(...BAND_ROWS.map((r) => r.maxRelErr));
const TOTAL_PROBES = BANDS.length * PROBES_PER_BAND;

export const IMP34768_CROSSOVER_GPPP_GLOBAL_ENVELOPE = {
  id: 'imp-34768',
  proofSection: 'S-frontier',
  question:
    'Derive the crossover-map third derivative g_triple_prime(N) in closed form on the same ' +
    'footing as the inherited imp-34731 g_double_prime, cross-check it against a central ' +
    'difference on the imp-34757 dense probe grid, and assess whether a SINGLE global envelope ' +
    'constant B(1e9) monotonically dominates |g_double_prime| across the ENTIRE [1e9,1e12] union ' +
    '(not merely per decade). Measurement/derivation only; changes no bound; no QED.',
  closedFormSecondDerivative:
    'g_double_prime(N) = -4 pi^2 K (u + 1) / (T^2 u^3)  (inherited imp-34731)',
  closedFormThirdDerivative:
    'g_triple_prime(N) = 8 pi^3 K (2 u^2 + 4 u + 3) / (T^3 u^5),  T = T0(N), u = log(T/2pi), ' +
    'K = (C_C/E_trunc)^2',
  derivationNote:
    'From g_double_prime = -4 pi^2 K (u+1)/(T^2 u^3) with dT/dN = 2 pi/u, du/dN = 2 pi/(T u): ' +
    'd(log f)/dN = -(2 pi/(T u)) (2u^2+4u+3)/(u(u+1)) for f = (u+1)/(T^2 u^3), giving ' +
    'g_triple_prime = 8 pi^3 K (2u^2+4u+3)/(T^3 u^5) > 0 on the whole ramp.',
  totalProbes: TOTAL_PROBES, // 63, same grid as imp-34757
  globalGridPoints: GLOBAL_GRID,
  bands: BAND_ROWS.map((r) => ({
    band: [+r.band[0].toExponential(0), +r.band[1].toExponential(0)],
    max_closed_vs_fd_rel_err: +r.maxRelErr.toExponential(3),
  })),
  overallMaxRelErr: +OVERALL_MAX_REL_ERR.toExponential(3),
  globalEnvelopeBound_B_1e9: +B_GLOBAL.toExponential(6),
  globalMaxAbsSecondDeriv: +globalMaxAbs.toExponential(6),
  globalEnvelopeRatio_B_over_maxUnion: +GLOBAL_ENVELOPE_RATIO.toFixed(6), // ~1.000000
  secondDerivGloballyMonotoneDecreasing: globallyMonotone,
  thirdDerivStrictlyPositiveOnUnion: tripleAllPositive,
  finding: {
    G1_third_derivative_closed_form:
      'g_triple_prime(N) = 8 pi^3 K (2u^2+4u+3)/(T^3 u^5), derived on the same Riemann-von ' +
      'Mangoldt footing as imp-34731; 2u^2+4u+3 > 0 so g_triple_prime > 0 everywhere and the ' +
      'negative g_double_prime rises monotonically toward 0.',
    G2_third_derivative_matches_fd:
      'Over ' +
      TOTAL_PROBES +
      ' log-spaced probes across the three post-peak bands the closed form 8 pi^3 K ' +
      '(2u^2+4u+3)/(T^3 u^5) agrees with a 4-point third-derivative central difference of g to ' +
      '< 1e-5 relative everywhere (max ~ few e-6), on the footing imp-34757 validated ' +
      'g_double_prime.',
    G3_single_global_envelope_dominates:
      'g_triple_prime > 0 across the whole [1e9,1e12] union makes |g_double_prime| globally ' +
      'monotone decreasing, so the single global-envelope constant B(1e9) = ' +
      (+B_GLOBAL.toExponential(6)).toString() +
      ' satisfies B(1e9)/max_union |g_double_prime| = 1.000 -- the imp-34757 per-band sharp ' +
      'supremum PROMOTES to one global constant, no per-decade bookkeeping needed.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction). Deriving the inherited imp-33723 crossover-map ' +
    'third derivative in closed form on the imp-34731 footing gives g_triple_prime(N) = ' +
    '8 pi^3 K (2u^2+4u+3)/(T^3 u^5), which agrees with a 4-point third-derivative central ' +
    'difference of g to < 1e-5 relative across the ' +
    TOTAL_PROBES +
    ' imp-34757 probes. Because 2u^2+4u+3 > 0 the third derivative is strictly positive on the ' +
    'entire [1e9,1e12] union, so |g_double_prime| is globally monotone decreasing and the single ' +
    'global-envelope constant B(1e9) dominates it everywhere: B(1e9)/max_union = 1.000, promoting ' +
    'the imp-34757 per-band sharp supremum to one global constant. Measurement/derivation only on ' +
    'the INHERITED imp-3220/imp-3406 surrogate map; the C_mb GUE-conditional per imp-486 and the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34757 (dense g_double_prime FD check; per-band sharp supremum); imp-34731 ' +
    '(g_double_prime closed form; 5-probe check); imp-34750 (per-decade B ladder across ' +
    '[1e9,1e12]); imp-33723 (fixed point N = K log T0(N)); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, Riemann-von Mangoldt inverse); imp-2631 (E_trunc fixed-strip route); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34768_CROSSOVER_GPPP_GLOBAL_ENVELOPE_ASSERTIONS = [
  {
    // (G2): dense closed-form g_triple_prime vs 4-point third-derivative central difference.
    id: 'imp34768-third-derivative-matches-central-difference',
    description:
      'closed-form g_triple_prime agrees with a 4-point third-derivative central difference to ' +
      '< 1e-5 relative across all ' +
      TOTAL_PROBES +
      ' probes on three post-peak bands',
    holds: () => OVERALL_MAX_REL_ERR < 1e-5,
  },
  {
    // (G3): single global envelope B(1e9) dominates |g_double_prime| over the whole union.
    id: 'imp34768-single-global-envelope-dominates-union',
    description:
      'B(1e9)/max_union |g_double_prime| = 1.000 (global monotone decrease; g_triple_prime > 0 ' +
      'on the whole union)',
    holds: () =>
      globallyMonotone &&
      tripleAllPositive &&
      Math.abs(GLOBAL_ENVELOPE_RATIO - 1) < 1e-9,
  },
  {
    // Cross-check anchor: B(1e9) reproduces the imp-34731/imp-34757 [1e9,...] bound ~ 1.4802e-10.
    id: 'imp34768-envelope-reproduces-imp34731-bound',
    description: 'the global-envelope bound B(1e9) reproduces imp-34731 B ~ 1.480193e-10',
    holds: () => Math.abs(B_GLOBAL / 1.480193e-10 - 1) < 1e-3,
  },
  {
    // Honesty gate: measurement/derivation only, no QED, no refereed bound is changed.
    id: 'imp34768-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34768_CROSSOVER_GPPP_GLOBAL_ENVELOPE.isRigorous === false &&
      /NO QED/.test(IMP34768_CROSSOVER_GPPP_GLOBAL_ENVELOPE.verdict) &&
      /refereed bound is changed/i.test(IMP34768_CROSSOVER_GPPP_GLOBAL_ENVELOPE.verdict),
  },
];

for (const a of IMP34768_CROSSOVER_GPPP_GLOBAL_ENVELOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34768-crossover-gppp-global-envelope assertion failed: ${a.id}`);
  }
}
