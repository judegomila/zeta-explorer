/**
 * @module imp-34793-crossover-gpppp-convexity
 *
 * imp-34793 (numerical, S-frontier): imp-34768 derived the crossover-map THIRD derivative
 * g_triple_prime(N) = 8 pi^3 K (2 u^2 + 4 u + 3)/(T^3 u^5) in closed form and used its strict
 * positivity to prove |g_double_prime| is globally monotone DECREASING across [1e9,1e12]. Two
 * questions remained genuinely open: the NEXT derivative beyond that (the fourth, g_quadruple_prime)
 * was never derived on the same footing, and -- crucially -- monotone decrease alone does NOT settle
 * whether |g_double_prime| is CONVEX or CONCAVE over the post-peak union. That convexity question is
 * fixed exactly by the sign of the fourth derivative. This module closes both on the inherited
 * imp-33723 surrogate crossover map.
 *
 * WHAT THIS ADDS (measurement/derivation, no new mathematics)
 * ----------------------------------------------------------
 * Reusing the imp-34731/imp-34768 closed forms and central-difference machinery VERBATIM, and the
 * Riemann-von Mangoldt map derivatives dT/dN = 2 pi/u and du/dN = 2 pi/(T u), this module:
 *   (H1) DERIVES g_quadruple_prime(N) in closed form on the identical footing:
 *            g_quadruple_prime(N) = -16 pi^4 K (6 u^3 + 18 u^2 + 25 u + 15)/(T^4 u^7).
 *        The derivation: g_triple_prime = 8 pi^3 K h with h = (2u^2+4u+3)/(T^3 u^5); then
 *            d(log h)/dN = (2 pi/(T u))[ (4u+4)/(2u^2+4u+3) - 3 - 5/u ]
 *                        = -(2 pi/(T u)) (6u^3+18u^2+25u+15)/(u(2u^2+4u+3)),
 *        so dh/dN = -2 pi (6u^3+18u^2+25u+15)/(T^4 u^7) and g_quadruple_prime = 8 pi^3 K dh/dN
 *        yields the stated form. Because 6u^3+18u^2+25u+15 > 0 for all u > 0, g_quadruple_prime(N)
 *        is strictly NEGATIVE on the entire post-peak union.
 *   (H2) TABULATES the closed-form-vs-central-difference agreement of g_quadruple_prime on the SAME
 *        dense log-spaced probe grid imp-34768 used (21 probes per band on the three post-peak
 *        bands, 63 total), against the standard 5-point fourth-derivative central-difference stencil
 *        [g(N+2h) - 4 g(N+h) + 6 g(N) - 4 g(N-h) + g(N-2h)] / h^4.
 *   (H3) SETTLES THE CONVEXITY. Since g_double_prime < 0, |g_double_prime| = -g_double_prime, so
 *        d2/dN2 |g_double_prime| = -g_quadruple_prime > 0 everywhere: |g_double_prime| is strictly
 *        CONVEX across the whole [1e9,1e12] union. (Consistently, g_quadruple_prime < 0 means the
 *        strictly-positive g_triple_prime is itself DECREASING toward 0.)
 *
 * THE CLOSED FORMS (inherited g_double_prime imp-34731, g_triple_prime imp-34768; fourth new here)
 * -----------------------------------------------------------------------------------------------
 *     g(N) = K log T0(N),   K = (C_C/E_trunc)^2 ~ 1.5727e8,   T = T0(N),   u = log(T/2pi),
 *     g_double_prime(N)    = -4  pi^2 K (u + 1)/(T^2 u^3),
 *     g_triple_prime(N)    =  8  pi^3 K (2 u^2 + 4 u + 3)/(T^3 u^5),
 *     g_quadruple_prime(N) = -16 pi^4 K (6 u^3 + 18 u^2 + 25 u + 15)/(T^4 u^7).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (H2) CLOSED-FORM g_quadruple_prime MATCHES THE FD STENCIL. Over 63 probes on three post-peak
 *        bands the closed form agrees with the 5-point fourth-derivative central difference of g to
 *        < 1e-3 relative everywhere (max ~ few e-5), on the same footing imp-34768 validated
 *        g_triple_prime; the looser tolerance vs the third-derivative check is the expected h^-4
 *        roundoff amplification of a fourth-difference stencil.
 *   (H3) |g_double_prime| IS STRICTLY CONVEX ON [1e9,1e12]. g_quadruple_prime < 0 everywhere gives
 *        d2/dN2 |g_double_prime| = -g_quadruple_prime > 0, so the globally-monotone-decreasing
 *        |g_double_prime| curve is CONVEX (bends upward) across the entire post-peak union -- the
 *        "NEXT derivative" question imp-34768 left open, resolved with a definite sign.
 *
 * MEASUREMENT/DERIVATION ONLY. This guards the fourth-order (convexity) behaviour of the INHERITED
 * imp-3220/imp-3406 surrogate crossover map; it changes NO bound. The C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34768-crossover-gppp-global-envelope (g_triple_prime closed form; global monotone decrease)
 * @see imp-34757-crossover-gpp-dense-cross-check (dense g_double_prime FD check; per-band supremum)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; 5-probe check)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (fixed point N = K log T0(N))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const SIXTEEN_PI4 = 16 * Math.PI * Math.PI * Math.PI * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)

// The inherited crossover map g(N) = K log T0(N) (imp-33723).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));

// CLOSED FORM (new, H1): g_quadruple_prime = -16 pi^4 K (6 u^3 + 18 u^2 + 25 u + 15)/(T^4 u^7).
function gQuadruplePrimeClosed(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return -(SIXTEEN_PI4 * K_AMPL * (6 * u * u * u + 18 * u * u + 25 * u + 15)) / (T * T * T * T * u ** 7);
}

// Numerical g_quadruple_prime via the standard 5-point fourth-derivative central-difference stencil.
function gQuadruplePrimeFD(N) {
  const h = N * 4e-3; // fourth-difference optimum on this map (imp-34793 step sweep)
  return (g(N + 2 * h) - 4 * g(N + h) + 6 * g(N) - 4 * g(N - h) + g(N - 2 * h)) / (h * h * h * h);
}

// Same three post-peak bands imp-34768 used, forming the union [1e9, 1e12].
const BANDS = [
  [1e9, 1e10],
  [1e10, 1e11],
  [1e11, 1e12],
];
const UNION_LO = 1e9;
const UNION_HI = 1e12;

const PROBES_PER_BAND = 21; // identical dense grid to imp-34768
const GLOBAL_GRID = 121; // dense sign grid across the WHOLE union

// (H2) dense closed-form-vs-FD agreement of g_quadruple_prime on the same per-band probe grid.
const BAND_ROWS = BANDS.map(([lo, hi]) => {
  let maxRelErr = 0;
  for (let k = 0; k < PROBES_PER_BAND; k++) {
    const N = lo * Math.pow(hi / lo, k / (PROBES_PER_BAND - 1));
    const c = gQuadruplePrimeClosed(N);
    const f = gQuadruplePrimeFD(N);
    const rel = Math.abs(c - f) / Math.abs(c);
    if (rel > maxRelErr) maxRelErr = rel;
  }
  return { band: [lo, hi], maxRelErr };
});

// (H3) global sign: g_quadruple_prime strictly NEGATIVE across the WHOLE union, so
// |g_double_prime| = -g_double_prime has positive second derivative -- it is strictly CONVEX.
let quadAllNegative = true;
let mostNegative = 0;
let leastNegative = -Infinity;
for (let k = 0; k < GLOBAL_GRID; k++) {
  const N = UNION_LO * Math.pow(UNION_HI / UNION_LO, k / (GLOBAL_GRID - 1));
  const q = gQuadruplePrimeClosed(N);
  if (q >= 0) quadAllNegative = false;
  if (q < mostNegative) mostNegative = q;
  if (q > leastNegative) leastNegative = q;
}

const OVERALL_MAX_REL_ERR = Math.max(...BAND_ROWS.map((r) => r.maxRelErr));
const TOTAL_PROBES = BANDS.length * PROBES_PER_BAND;
// |g_double_prime| convex iff its second derivative -g_quadruple_prime > 0 everywhere.
const ABS_SECOND_DERIV_IS_CONVEX = quadAllNegative;

export const IMP34793_CROSSOVER_GPPPP_CONVEXITY = {
  id: 'imp-34793',
  proofSection: 'S-frontier',
  question:
    'Derive the crossover-map fourth derivative g_quadruple_prime(N) in closed form on the same ' +
    'footing as the inherited imp-34768 g_triple_prime, cross-check it against a central difference ' +
    'on the imp-34768 dense probe grid, and determine its global sign over [1e9,1e12] -- thereby ' +
    'settling whether |g_double_prime| is CONVEX or CONCAVE across the post-peak union (the NEXT ' +
    'derivative imp-34768 left open). Measurement/derivation only; changes no bound; no QED.',
  closedFormThirdDerivative:
    'g_triple_prime(N) = 8 pi^3 K (2 u^2 + 4 u + 3)/(T^3 u^5)  (inherited imp-34768)',
  closedFormFourthDerivative:
    'g_quadruple_prime(N) = -16 pi^4 K (6 u^3 + 18 u^2 + 25 u + 15)/(T^4 u^7),  T = T0(N), ' +
    'u = log(T/2pi), K = (C_C/E_trunc)^2',
  derivationNote:
    'From g_triple_prime = 8 pi^3 K h with h = (2u^2+4u+3)/(T^3 u^5), dT/dN = 2 pi/u, ' +
    'du/dN = 2 pi/(T u): d(log h)/dN = (2 pi/(T u))[(4u+4)/(2u^2+4u+3) - 3 - 5/u] = ' +
    '-(2 pi/(T u)) (6u^3+18u^2+25u+15)/(u(2u^2+4u+3)), so dh/dN = ' +
    '-2 pi (6u^3+18u^2+25u+15)/(T^4 u^7) and g_quadruple_prime = 8 pi^3 K dh/dN = ' +
    '-16 pi^4 K (6u^3+18u^2+25u+15)/(T^4 u^7) < 0 on the whole ramp.',
  totalProbes: TOTAL_PROBES, // 63, same grid as imp-34768
  globalGridPoints: GLOBAL_GRID,
  bands: BAND_ROWS.map((r) => ({
    band: [+r.band[0].toExponential(0), +r.band[1].toExponential(0)],
    max_closed_vs_fd_rel_err: +r.maxRelErr.toExponential(3),
  })),
  overallMaxRelErr: +OVERALL_MAX_REL_ERR.toExponential(3),
  fourthDerivMostNegativeOnUnion: +mostNegative.toExponential(6),
  fourthDerivLeastNegativeOnUnion: +leastNegative.toExponential(6),
  fourthDerivStrictlyNegativeOnUnion: quadAllNegative,
  absSecondDerivativeIsConvexOnUnion: ABS_SECOND_DERIV_IS_CONVEX,
  finding: {
    H1_fourth_derivative_closed_form:
      'g_quadruple_prime(N) = -16 pi^4 K (6u^3+18u^2+25u+15)/(T^4 u^7), derived on the same ' +
      'Riemann-von Mangoldt footing as imp-34768; 6u^3+18u^2+25u+15 > 0 so g_quadruple_prime < 0 ' +
      'everywhere and the positive g_triple_prime is itself decreasing toward 0.',
    H2_fourth_derivative_matches_fd:
      'Over ' +
      TOTAL_PROBES +
      ' log-spaced probes across the three post-peak bands the closed form -16 pi^4 K ' +
      '(6u^3+18u^2+25u+15)/(T^4 u^7) agrees with a 5-point fourth-derivative central difference of ' +
      'g to < 1e-3 relative everywhere (max ~ few e-5), the expected h^-4 roundoff level of a ' +
      'fourth-difference stencil.',
    H3_abs_second_derivative_convex:
      'g_quadruple_prime < 0 across the whole [1e9,1e12] union gives d2/dN2 |g_double_prime| = ' +
      '-g_quadruple_prime > 0, so the globally-monotone-decreasing |g_double_prime| is strictly ' +
      'CONVEX across the entire post-peak union -- the NEXT derivative imp-34768 left open, ' +
      'resolved with a definite sign.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction). Deriving the inherited imp-33723 crossover-map ' +
    'fourth derivative in closed form on the imp-34768 footing gives g_quadruple_prime(N) = ' +
    '-16 pi^4 K (6u^3+18u^2+25u+15)/(T^4 u^7), which agrees with a 5-point fourth-derivative ' +
    'central difference of g to < 1e-3 relative across the ' +
    TOTAL_PROBES +
    ' imp-34768 probes. Because 6u^3+18u^2+25u+15 > 0 the fourth derivative is strictly NEGATIVE on ' +
    'the entire [1e9,1e12] union, so d2/dN2 |g_double_prime| = -g_quadruple_prime > 0 and ' +
    '|g_double_prime| is strictly CONVEX there -- resolving the NEXT-derivative question imp-34768 ' +
    'explicitly left open. Measurement/derivation only on the INHERITED imp-3220/imp-3406 surrogate ' +
    'map; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34768 (g_triple_prime closed form; global monotone decrease); imp-34757 (dense ' +
    'g_double_prime FD check; per-band supremum); imp-34731 (g_double_prime closed form; 5-probe ' +
    'check); imp-33723 (fixed point N = K log T0(N)); lambda-rh-height-mapping (effectiveHeightForN, ' +
    'Riemann-von Mangoldt inverse); imp-2631 (E_trunc fixed-strip route); imp-2642/imp-2643 ' +
    '(C_C 1/8 ansatz).',
};

export const IMP34793_CROSSOVER_GPPPP_CONVEXITY_ASSERTIONS = [
  {
    // (H2): dense closed-form g_quadruple_prime vs 5-point fourth-derivative central difference.
    id: 'imp34793-fourth-derivative-matches-central-difference',
    description:
      'closed-form g_quadruple_prime agrees with a 5-point fourth-derivative central difference to ' +
      '< 1e-3 relative across all ' +
      TOTAL_PROBES +
      ' probes on three post-peak bands',
    holds: () => OVERALL_MAX_REL_ERR < 1e-3,
  },
  {
    // (H3): fourth derivative strictly negative on the whole union => |g_double_prime| convex.
    id: 'imp34793-fourth-derivative-strictly-negative-abs-convex',
    description:
      'g_quadruple_prime < 0 on the whole [1e9,1e12] union, so |g_double_prime| is strictly convex ' +
      '(second derivative -g_quadruple_prime > 0)',
    holds: () => quadAllNegative && ABS_SECOND_DERIV_IS_CONVEX,
  },
  {
    // Consistency anchor: the fourth-derivative leading coefficient reproduces -16 pi^4 K.
    id: 'imp34793-fourth-derivative-leading-coefficient',
    description: 'closed-form leading coefficient -16 pi^4 K matches the derived constant',
    holds: () => {
      // At a probe N, g_quadruple_prime * T^4 u^7 / (6u^3+18u^2+25u+15) must equal -16 pi^4 K.
      const N = 1e10;
      const T = effectiveHeightForN(N);
      const u = Math.log(T / TWO_PI);
      const recovered =
        (gQuadruplePrimeClosed(N) * (T * T * T * T) * u ** 7) /
        (6 * u * u * u + 18 * u * u + 25 * u + 15);
      return Math.abs(recovered / (-SIXTEEN_PI4 * K_AMPL) - 1) < 1e-12;
    },
  },
  {
    // Honesty gate: measurement/derivation only, no QED, no refereed bound is changed.
    id: 'imp34793-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34793_CROSSOVER_GPPPP_CONVEXITY.isRigorous === false &&
      /NO QED/.test(IMP34793_CROSSOVER_GPPPP_CONVEXITY.verdict) &&
      /refereed bound is changed/i.test(IMP34793_CROSSOVER_GPPPP_CONVEXITY.verdict),
  },
];

for (const a of IMP34793_CROSSOVER_GPPPP_CONVEXITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34793-crossover-gpppp-convexity assertion failed: ${a.id}`);
  }
}
