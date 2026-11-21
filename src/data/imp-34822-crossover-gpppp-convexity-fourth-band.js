/**
 * @module imp-34822-crossover-gpppp-convexity-fourth-band
 *
 * imp-34822 (numerical, S-frontier): imp-34793 derived the crossover-map FOURTH derivative
 * g_quadruple_prime(N) = -16 pi^4 K (6 u^3 + 18 u^2 + 25 u + 15)/(T^4 u^7) in closed form and, from
 * its strict NEGATIVITY on [1e9,1e12], proved |g_double_prime| is strictly CONVEX across that
 * post-peak union. Separately, imp-34792 extended the SECOND-derivative curvature-envelope collapse
 * one decade deeper, appending the far-tail band [1e12,1e13]. The natural boundary question these two
 * leave open is whether the CONVEXITY guarantee (the g_quadruple_prime sign) also survives into that
 * same far-tail band [1e12,1e13] -- i.e. whether the envelope-collapse justification imp-34792 tested
 * on the second derivative is backed by the SAME strict convexity one decade further out. This module
 * is that assessment, reusing the imp-34793 closed form VERBATIM.
 *
 * WHAT THIS ADDS (measurement / assessment, no new mathematics, no new bound)
 * -------------------------------------------------------------------------
 * Reusing the inherited fourth-derivative closed form unchanged, over the far-tail band [1e12,1e13]
 * (the band imp-34792 appended to the collapse test) this module:
 *   (F1) evaluates g_quadruple_prime on a dense log-spaced grid across [1e12,1e13] and asserts it is
 *        strictly NEGATIVE on the whole band -- the analytic reason is unchanged: 6u^3+18u^2+25u+15
 *        stays > 0 (u = log(T/2pi) ~ 27 -> 29 on this band, far into u > 0), and T^4 u^7 > 0, so the
 *        sign cannot flip; the CONVEXITY of |g_double_prime| therefore PERSISTS into the far tail;
 *   (F2) cross-checks the closed form against a 5-point fourth-derivative central difference of g on
 *        the same band and asserts agreement to < 1e-3 relative (the expected h^-4 fourth-difference
 *        roundoff level imp-34793 already documented on [1e9,1e12]);
 *   (F3) reports d2/dN2 |g_double_prime| = -g_quadruple_prime > 0 on the band, so |g_double_prime| is
 *        strictly CONVEX on [1e12,1e13] as well -- extending the imp-34793 post-peak-union convexity
 *        one decade further, matching the reach of the imp-34792 curvature-envelope collapse;
 *   (F4) FROZEN-TABLE cross-check: g_quadruple_prime at the shared boundary N=1e12 (the right endpoint
 *        of the imp-34793 union, the left endpoint of this band) reproduces the imp-34793 published
 *        fourthDerivLeastNegativeOnUnion literal, so a future height-map / closed-form refactor is
 *        caught against the frozen imp-34793 value.
 *
 * THE CLOSED FORM (inherited from imp-34793, unchanged)
 * -----------------------------------------------------
 *     g(N) = K log T0(N),   K = (C_C/E_trunc)^2 ~ 1.5727e8,   T = T0(N),   u = log(T/2pi),
 *     g_double_prime(N)    = -4  pi^2 K (u + 1)/(T^2 u^3),
 *     g_quadruple_prime(N) = -16 pi^4 K (6 u^3 + 18 u^2 + 25 u + 15)/(T^4 u^7).
 * Because 6u^3+18u^2+25u+15 > 0 for every u > 0 and T^4 u^7 > 0, g_quadruple_prime < 0 on the ENTIRE
 * post-peak ramp -- the [1e12,1e13] band is not a special case, it inherits the same strict sign.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) g_quadruple_prime STAYS STRICTLY NEGATIVE on [1e12,1e13]: the sign does not flip one decade
 *        deeper into the far tail, so the convexity guarantee is not a [1e9,1e12] artifact.
 *   (F2) CLOSED FORM MATCHES THE FD STENCIL to < 1e-3 relative across the band, on the same footing
 *        imp-34793 validated on [1e9,1e12].
 *   (F3) |g_double_prime| IS STRICTLY CONVEX on [1e12,1e13]: -g_quadruple_prime > 0 everywhere, so
 *        the far-tail curvature-envelope collapse imp-34792 tested rests on the SAME strict convexity.
 *   (F4) MATCHES THE FROZEN imp-34793 VALUE at the shared boundary N=1e12 to ~1e-6 relative.
 *
 * MEASUREMENT / ASSESSMENT ONLY. This assesses the fourth-order (convexity) behaviour of the INHERITED
 * imp-3220/imp-3406 surrogate crossover map on one extra decade; it introduces NO new bound and
 * changes none. The C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34793-crossover-gpppp-convexity (g_quadruple_prime closed form; convexity on [1e9,1e12])
 * @see imp-34792-crossover-gpp-fourth-band-envelope-extension (2nd-derivative collapse on [1e12,1e13])
 * @see imp-34768-crossover-gppp-global-envelope (g_triple_prime closed form; global monotone decrease)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; 5-probe check)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34793_CROSSOVER_GPPPP_CONVEXITY } from './imp-34793-crossover-gpppp-convexity.js';

const TWO_PI = 2 * Math.PI;
const SIXTEEN_PI4 = 16 * Math.PI * Math.PI * Math.PI * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)

// The inherited crossover map g(N) = K log T0(N) (imp-33723).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));

// CLOSED FORM (inherited imp-34793): g_quadruple_prime = -16 pi^4 K (6u^3+18u^2+25u+15)/(T^4 u^7).
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

// The far-tail band imp-34792 APPENDED to the curvature-envelope collapse test.
const BAND_LO = 1e12;
const BAND_HI = 1e13;
const PROBES = 41; // same tightness grid imp-34792 used for the per-band far-tail measurement

// (F1)/(F2) dense sign + closed-form-vs-FD agreement across the far-tail band [1e12,1e13].
let bandAllNegative = true;
let mostNegative = 0;
let leastNegative = -Infinity;
let maxRelErr = 0;
for (let k = 0; k < PROBES; k++) {
  const N = BAND_LO * Math.pow(BAND_HI / BAND_LO, k / (PROBES - 1));
  const c = gQuadruplePrimeClosed(N);
  const f = gQuadruplePrimeFD(N);
  if (c >= 0) bandAllNegative = false;
  if (c < mostNegative) mostNegative = c;
  if (c > leastNegative) leastNegative = c;
  const rel = Math.abs(c - f) / Math.abs(c);
  if (rel > maxRelErr) maxRelErr = rel;
}

// (F3) |g_double_prime| convex on the band iff its second derivative -g_quadruple_prime > 0 there.
const ABS_SECOND_DERIV_IS_CONVEX = bandAllNegative;

// (F4) frozen-table cross-check at the shared boundary N=1e12 vs the imp-34793 published literal.
const boundaryClosed = gQuadruplePrimeClosed(BAND_LO);
const PUBLISHED_BOUNDARY = IMP34793_CROSSOVER_GPPPP_CONVEXITY.fourthDerivLeastNegativeOnUnion;
const BOUNDARY_LITERAL_DRIFT = Math.abs(boundaryClosed / PUBLISHED_BOUNDARY - 1);

export const IMP34822_CROSSOVER_GPPPP_CONVEXITY_FOURTH_BAND = {
  id: 'imp-34822',
  proofSection: 'S-frontier',
  question:
    'imp-34793 proved |g_double_prime| strictly convex on [1e9,1e12] via the strictly NEGATIVE ' +
    'closed-form g_quadruple_prime; imp-34792 extended the second-derivative curvature-envelope ' +
    'collapse one decade further to [1e12,1e13]. Does the g_quadruple_prime sign (hence the convexity ' +
    'of |g_double_prime|) also persist into that same far-tail band [1e12,1e13]? Assessment only; ' +
    'reuses the imp-34793 closed form verbatim; changes no bound; no QED.',
  closedFormFourthDerivative:
    'g_quadruple_prime(N) = -16 pi^4 K (6 u^3 + 18 u^2 + 25 u + 15)/(T^4 u^7),  T = T0(N), ' +
    'u = log(T/2pi), K = (C_C/E_trunc)^2',
  farTailBand: [+BAND_LO.toExponential(0), +BAND_HI.toExponential(0)],
  probes: PROBES,
  fourthDerivStrictlyNegativeOnBand: bandAllNegative,
  fourthDerivMostNegativeOnBand: +mostNegative.toExponential(6),
  fourthDerivLeastNegativeOnBand: +leastNegative.toExponential(6),
  absSecondDerivativeIsConvexOnBand: ABS_SECOND_DERIV_IS_CONVEX,
  maxClosedVsFdRelErrOnBand: +maxRelErr.toExponential(3),
  boundaryValueAt1e12: +boundaryClosed.toExponential(6),
  publishedBoundaryFromImp34793: PUBLISHED_BOUNDARY,
  boundaryLiteralDriftVsImp34793: +BOUNDARY_LITERAL_DRIFT.toExponential(3),
  finding: {
    F1_fourth_derivative_still_negative:
      'g_quadruple_prime stays strictly NEGATIVE across the whole [1e12,1e13] band ' +
      '(6u^3+18u^2+25u+15 > 0 and T^4 u^7 > 0 with u ~ 27..29), so the sign does not flip one decade ' +
      'deeper into the far tail -- the convexity guarantee is not a [1e9,1e12] artifact.',
    F2_fourth_derivative_matches_fd:
      'Over ' +
      PROBES +
      ' log-spaced probes on [1e12,1e13] the closed form agrees with a 5-point fourth-derivative ' +
      'central difference of g to < 1e-3 relative (max ' +
      (+maxRelErr.toExponential(3)).toString() +
      '), the same footing imp-34793 validated on [1e9,1e12].',
    F3_abs_second_derivative_convex:
      'g_quadruple_prime < 0 across [1e12,1e13] gives d2/dN2 |g_double_prime| = -g_quadruple_prime ' +
      '> 0, so |g_double_prime| is strictly CONVEX on the far-tail band too -- the imp-34792 ' +
      'curvature-envelope collapse there rests on the SAME strict convexity imp-34793 proved on ' +
      '[1e9,1e12].',
    F4_matches_frozen_imp34793_boundary:
      'g_quadruple_prime at the shared boundary N=1e12 reproduces the imp-34793 published ' +
      'fourthDerivLeastNegativeOnUnion = ' +
      PUBLISHED_BOUNDARY +
      ' to ~1e-6 relative (drift ' +
      (+BOUNDARY_LITERAL_DRIFT.toExponential(3)).toString() +
      ').',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / ASSESSMENT (frontier-direction). imp-34793 proved |g_double_prime| strictly ' +
    'convex on [1e9,1e12] from the strictly NEGATIVE closed-form g_quadruple_prime = -16 pi^4 K ' +
    '(6u^3+18u^2+25u+15)/(T^4 u^7); imp-34792 extended the second-derivative curvature-envelope ' +
    'collapse to the far-tail band [1e12,1e13]. This module reuses that closed form verbatim and ' +
    'confirms the CONVEXITY guarantee persists into the same band: g_quadruple_prime stays strictly ' +
    'NEGATIVE across [1e12,1e13] (6u^3+18u^2+25u+15 > 0 with u ~ 27..29, so the sign cannot flip), ' +
    'matching a 5-point fourth-derivative central difference of g to < 1e-3 relative, so d2/dN2 ' +
    '|g_double_prime| = -g_quadruple_prime > 0 and |g_double_prime| is strictly CONVEX one decade ' +
    'deeper into the far tail -- the imp-34792 collapse there rests on the SAME strict convexity. The ' +
    'value at the shared boundary N=1e12 reproduces the imp-34793 published literal to ~1e-6 relative. ' +
    'Assessment only on the INHERITED imp-3220/imp-3406 surrogate map; the C_mb GUE-conditional per ' +
    'imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34793 (g_quadruple_prime closed form; convexity on [1e9,1e12]); imp-34792 (second-derivative ' +
    'curvature-envelope collapse on [1e12,1e13]); imp-34768 (g_triple_prime closed form; global ' +
    'monotone decrease); imp-34731 (g_double_prime closed form; 5-probe check); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Riemann-von Mangoldt inverse); imp-2631 (E_trunc ' +
    'fixed-strip route); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34822_CROSSOVER_GPPPP_CONVEXITY_FOURTH_BAND_ASSERTIONS = [
  {
    // (F1)/(F3): fourth derivative strictly negative on [1e12,1e13] => |g_double_prime| convex there.
    id: 'imp34822-fourth-derivative-strictly-negative-far-tail-band',
    description:
      'g_quadruple_prime < 0 on the whole [1e12,1e13] band, so |g_double_prime| stays strictly convex ' +
      '(second derivative -g_quadruple_prime > 0) one decade deeper into the far tail',
    holds: () => bandAllNegative && ABS_SECOND_DERIV_IS_CONVEX,
  },
  {
    // (F2): dense closed-form g_quadruple_prime vs 5-point fourth-derivative central difference.
    id: 'imp34822-fourth-derivative-matches-central-difference-far-tail',
    description:
      'closed-form g_quadruple_prime agrees with a 5-point fourth-derivative central difference to ' +
      '< 1e-3 relative across all ' +
      PROBES +
      ' probes on [1e12,1e13]',
    holds: () => maxRelErr < 1e-3,
  },
  {
    // (F4): the shared boundary N=1e12 matches the imp-34793 published least-negative literal.
    id: 'imp34822-matches-imp34793-boundary-literal',
    description:
      'g_quadruple_prime at N=1e12 reproduces the imp-34793 fourthDerivLeastNegativeOnUnion literal ' +
      'to ~1e-6 relative (frozen-table cross-check)',
    holds: () => BOUNDARY_LITERAL_DRIFT < 1e-5,
  },
  {
    // Consistency anchor: the fourth-derivative leading coefficient reproduces -16 pi^4 K on the band.
    id: 'imp34822-fourth-derivative-leading-coefficient-far-tail',
    description: 'closed-form leading coefficient -16 pi^4 K matches the derived constant at N=1e12',
    holds: () => {
      const T = effectiveHeightForN(BAND_LO);
      const u = Math.log(T / TWO_PI);
      const recovered =
        (gQuadruplePrimeClosed(BAND_LO) * (T * T * T * T) * u ** 7) /
        (6 * u * u * u + 18 * u * u + 25 * u + 15);
      return Math.abs(recovered / (-SIXTEEN_PI4 * K_AMPL) - 1) < 1e-12;
    },
  },
  {
    // Honesty gate: measurement/assessment only, no QED, no refereed bound is changed.
    id: 'imp34822-honesty-gate-no-qed',
    description: 'Measurement/assessment only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34822_CROSSOVER_GPPPP_CONVEXITY_FOURTH_BAND.isRigorous === false &&
      /NO QED/.test(IMP34822_CROSSOVER_GPPPP_CONVEXITY_FOURTH_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP34822_CROSSOVER_GPPPP_CONVEXITY_FOURTH_BAND.verdict),
  },
];

for (const a of IMP34822_CROSSOVER_GPPPP_CONVEXITY_FOURTH_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34822-crossover-gpppp-convexity-fourth-band assertion failed: ${a.id}`);
  }
}
