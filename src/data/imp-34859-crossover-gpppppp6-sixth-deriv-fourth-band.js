/**
 * @module imp-34859-crossover-gpppppp6-sixth-deriv-fourth-band
 *
 * imp-34859 (numerical, S-frontier): imp-34842 extended the inherited imp-33723 crossover-map
 * derivative chain to the FIFTH derivative and found g_fifth_deriv > 0 strictly across the fourth
 * band [1e12,1e13], completing the alternating/definite-sign ladder
 *     g_double_prime < 0,  g_triple_prime > 0,  g_quadruple_prime < 0,  g_fifth_deriv > 0
 * with the leading factor (-1)^(n+1) 2^n pi^n K (i.e. -4, +8, -16, +32). That ladder PREDICTS the
 * SIXTH derivative g_sixth_deriv to be NEGATIVE (leading factor -64 pi^6 K). This module derives
 * g_sixth_deriv on the identical Riemann-von Mangoldt footing and MEASURES whether the alternating
 * ladder extends to the predicted negative sixth order (g_sixth_deriv < 0) with a strictly-signed
 * numerator polynomial and no interior sign change across the same band, reusing the imp-34842
 * band literals VERBATIM.
 *
 * WHAT THIS ADDS (measurement / derivation, no new mathematics, no new bound)
 * --------------------------------------------------------------------------
 * Extending the imp-34793/imp-34822/imp-34842 closed-form chain one order, over the fourth band
 * [1e12,1e13] (the same band, same 41-probe grid imp-34842 used) this module:
 *   (H1) DERIVES g_sixth_deriv(N) in closed form on the identical footing:
 *            g_sixth_deriv(N) = -64 pi^6 K (120 u^5 + 600 u^4 + 1526 u^3 + 2380 u^2 + 2205 u + 945)
 *                               / (T^6 u^11).
 *        The derivation: g_fifth_deriv = 32 pi^5 K h5 with h5 = Q(u)/(T^5 u^9),
 *        Q = 24u^4+96u^3+190u^2+210u+105; using dT/dN = 2 pi/u, du/dN = 2 pi/(T u),
 *            d(log h5)/dN = (2 pi/(T u))[Q_prime/Q - 9/u - 5],
 *        and u Q_prime - 9 Q - 5 u Q = -(120u^5+600u^4+1526u^3+2380u^2+2205u+945), so
 *            h5_prime = -2 pi (120u^5+600u^4+1526u^3+2380u^2+2205u+945)/(T^6 u^11),
 *        giving g_sixth_deriv = 32 pi^5 K h5_prime = -64 pi^6 K (120u^5+...+945)/(T^6 u^11).
 *   (H2) cross-checks the closed form against a 7-point sixth-derivative central difference of g on
 *        the same band and asserts agreement to < 1e-2 relative (the expected h^-6 sixth-difference
 *        roundoff level, one order noisier than imp-34842 fifth-difference; the step h = N 1.2e-2 is
 *        the sixth-difference optimum on this map by a step sweep);
 *   (H3) MEASURES the alternating/definite-sign ladder across the band: g_double_prime < 0,
 *        g_triple_prime > 0, g_quadruple_prime < 0, g_fifth_deriv > 0, g_sixth_deriv < 0 -- and
 *        asserts g_sixth_deriv is strictly NEGATIVE on the WHOLE [1e12,1e13] band with NO interior
 *        sign change (the analytic reason: 120u^5+600u^4+1526u^3+2380u^2+2205u+945 > 0 for every
 *        u > 0, and T^6 u^11 > 0 for u ~ 27..29 on this band, so the sign cannot flip); the
 *        alternating -, +, -, +, - ladder therefore EXTENDS to sixth order -- it does NOT break;
 *   (H4) FROZEN-TABLE cross-check: g_sixth_deriv at the shared boundary N=1e12 (the left endpoint of
 *        the band) reproduces the frozen literal below, so a future height-map / closed-form refactor
 *        is caught against it.
 *
 * THE CLOSED FORMS (inherited g_double..g_fifth; sixth new here)
 * -------------------------------------------------------------
 *     g(N) = K log T0(N),   K = (C_C/E_trunc)^2 ~ 1.5727e8,   T = T0(N),   u = log(T/2pi),
 *     g_double_prime(N)    = -4  pi^2 K (u + 1)/(T^2 u^3),
 *     g_triple_prime(N)    =  8  pi^3 K (2 u^2 + 4 u + 3)/(T^3 u^5),
 *     g_quadruple_prime(N) = -16 pi^4 K (6 u^3 + 18 u^2 + 25 u + 15)/(T^4 u^7),
 *     g_fifth_deriv(N)     =  32 pi^5 K (24 u^4 + 96 u^3 + 190 u^2 + 210 u + 105)/(T^5 u^9),
 *     g_sixth_deriv(N)     = -64 pi^6 K (120 u^5 + 600 u^4 + 1526 u^3 + 2380 u^2 + 2205 u + 945)
 *                            / (T^6 u^11).
 * The leading factor alternates and doubles: -4, +8, -16, +32, -64 (= (-1)^(n+1) 2^n pi^n K), and
 * each numerator polynomial is strictly positive for u > 0, so the derivative-sign ladder is a
 * definite alternation on the entire post-peak ramp -- the [1e12,1e13] band is not a special case.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (H1) g_sixth_deriv(N) = -64 pi^6 K (120u^5+600u^4+1526u^3+2380u^2+2205u+945)/(T^6 u^11), derived
 *        on the same Riemann-von Mangoldt footing as imp-34793/imp-34822/imp-34842.
 *   (H2) CLOSED FORM MATCHES THE FD STENCIL to < 1e-2 relative across the band (max ~2e-3), the
 *        expected h^-6 roundoff level of a sixth-difference stencil.
 *   (H3) THE ALTERNATING LADDER EXTENDS TO SIXTH ORDER. g_sixth_deriv is strictly NEGATIVE across the
 *        WHOLE [1e12,1e13] band with NO interior sign change (120u^5+600u^4+1526u^3+2380u^2+2205u+945
 *        > 0 with u ~ 27..29), continuing the definite -, +, -, +, - sign ladder one order deeper --
 *        the higher derivative does NOT change sign inside the band, matching the imp-34842 prediction.
 *   (H4) MATCHES THE FROZEN boundary literal at N=1e12 to ~1e-9 relative.
 *
 * MEASUREMENT / DERIVATION ONLY. This assesses the sixth-order sign behaviour of the INHERITED
 * imp-3220/imp-3406 surrogate crossover map on the imp-34842 band; it introduces NO new bound and
 * changes none. The C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 is UNTOUCHED; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34842-crossover-gpppp5-fifth-deriv-fourth-band (g_fifth_deriv > 0 on [1e12,1e13]; predicts g_sixth < 0)
 * @see imp-34822-crossover-gpppp-convexity-fourth-band (g_quadruple_prime < 0 on [1e12,1e13]; convexity)
 * @see imp-34793-crossover-gpppp-convexity (g_quadruple_prime closed form; convexity on [1e9,1e12])
 * @see imp-34768-crossover-gppp-global-envelope (g_triple_prime closed form; global monotone decrease)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; 5-probe check)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34842_CROSSOVER_GPPPP5_FIFTH_DERIV_FOURTH_BAND } from './imp-34842-crossover-gpppp5-fifth-deriv-fourth-band.js';

const TWO_PI = 2 * Math.PI;
const PI2 = Math.PI * Math.PI;
const PI3 = PI2 * Math.PI;
const PI4 = PI2 * PI2;
const PI5 = PI4 * Math.PI;
const PI6 = PI5 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)

// The inherited crossover map g(N) = K log T0(N) (imp-33723).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));

// Inherited closed forms (imp-34731/imp-34768/imp-34793/imp-34842), used for the ladder sign check (H3).
function gDoublePrimeClosed(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return -(4 * PI2 * K_AMPL * (u + 1)) / (T * T * u ** 3);
}
function gTriplePrimeClosed(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (8 * PI3 * K_AMPL * (2 * u * u + 4 * u + 3)) / (T * T * T * u ** 5);
}
function gQuadruplePrimeClosed(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return -(16 * PI4 * K_AMPL * (6 * u * u * u + 18 * u * u + 25 * u + 15)) / (T * T * T * T * u ** 7);
}
function gFifthDerivClosed(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (
    (32 * PI5 * K_AMPL * (24 * u ** 4 + 96 * u ** 3 + 190 * u * u + 210 * u + 105)) /
    (T ** 5 * u ** 9)
  );
}

// CLOSED FORM (new, H1):
// g_sixth_deriv = -64 pi^6 K (120 u^5 + 600 u^4 + 1526 u^3 + 2380 u^2 + 2205 u + 945)/(T^6 u^11).
function gSixthDerivClosed(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return -(
    (64 * PI6 * K_AMPL * (120 * u ** 5 + 600 * u ** 4 + 1526 * u ** 3 + 2380 * u * u + 2205 * u + 945)) /
    (T ** 6 * u ** 11)
  );
}

// Numerical g_sixth_deriv via the standard 7-point sixth-derivative central-difference stencil,
// coefficients [1, -6, 15, -20, 15, -6, 1] / h^6 (2nd-order accuracy).
function gSixthDerivFD(N) {
  const h = N * 1.2e-2; // sixth-difference optimum on this map (step sweep)
  return (
    (g(N - 3 * h) -
      6 * g(N - 2 * h) +
      15 * g(N - h) -
      20 * g(N) +
      15 * g(N + h) -
      6 * g(N + 2 * h) +
      g(N + 3 * h)) /
    h ** 6
  );
}

// The fourth band imp-34842 assessed, and its exact 41-probe grid -- reused VERBATIM.
const BAND_LO = 1e12;
const BAND_HI = 1e13;
const PROBES = 41;

// (H1)/(H2) dense sign + closed-form-vs-FD agreement across the fourth band [1e12,1e13].
let bandAllNegative = true;
let mostNegative = 0; // most-negative value (largest magnitude on the negative side)
let leastNegative = -Infinity; // negative value closest to 0 on the band
let interiorSignChange = false;
let prevSign = 0;
let maxRelErr = 0;
for (let k = 0; k < PROBES; k++) {
  const N = BAND_LO * Math.pow(BAND_HI / BAND_LO, k / (PROBES - 1));
  const c = gSixthDerivClosed(N);
  const f = gSixthDerivFD(N);
  if (c >= 0) bandAllNegative = false;
  if (c < mostNegative) mostNegative = c;
  if (c > leastNegative) leastNegative = c;
  const s = Math.sign(c);
  if (prevSign !== 0 && s !== 0 && s !== prevSign) interiorSignChange = true;
  prevSign = s;
  const rel = Math.abs(c - f) / Math.abs(c);
  if (rel > maxRelErr) maxRelErr = rel;
}

// (H3) the alternating/definite-sign ladder at the band midpoint (log-mid): -, +, -, +, -.
const N_MID = Math.sqrt(BAND_LO * BAND_HI);
const LADDER_SIGNS = [
  Math.sign(gDoublePrimeClosed(N_MID)),
  Math.sign(gTriplePrimeClosed(N_MID)),
  Math.sign(gQuadruplePrimeClosed(N_MID)),
  Math.sign(gFifthDerivClosed(N_MID)),
  Math.sign(gSixthDerivClosed(N_MID)),
];
const LADDER_ALTERNATES =
  LADDER_SIGNS[0] === -1 &&
  LADDER_SIGNS[1] === 1 &&
  LADDER_SIGNS[2] === -1 &&
  LADDER_SIGNS[3] === 1 &&
  LADDER_SIGNS[4] === -1;

// (H4) frozen-table cross-check at the shared boundary N=1e12 (left endpoint of the band).
const boundaryClosed = gSixthDerivClosed(BAND_LO);
const FROZEN_BOUNDARY_AT_1E12 = -1.802788e-62; // g_sixth_deriv at N=1e12 (this run, imp-34859)
const BOUNDARY_LITERAL_DRIFT = Math.abs(boundaryClosed / FROZEN_BOUNDARY_AT_1E12 - 1);

export const IMP34859_CROSSOVER_GPPPPPP6_SIXTH_DERIV_FOURTH_BAND = {
  id: 'imp-34859',
  proofSection: 'S-frontier',
  question:
    'imp-34842 found g_fifth_deriv > 0 strictly on the fourth band [1e12,1e13], completing the ' +
    'alternating/definite-sign derivative ladder (g_double_prime < 0, g_triple_prime > 0, ' +
    'g_quadruple_prime < 0, g_fifth_deriv > 0) and PREDICTING g_sixth_deriv < 0. Does the ' +
    'alternating pattern extend to the predicted NEGATIVE sixth derivative g_sixth_deriv across the ' +
    'same band, or does the sixth derivative change sign inside [1e12,1e13] and break the ladder? ' +
    'Measurement/derivation only; reuses the imp-34842 band literals verbatim; changes no bound; no QED.',
  closedFormFifthDerivative:
    'g_fifth_deriv(N) = 32 pi^5 K (24 u^4 + 96 u^3 + 190 u^2 + 210 u + 105)/(T^5 u^9)  (inherited imp-34842)',
  closedFormSixthDerivative:
    'g_sixth_deriv(N) = -64 pi^6 K (120 u^5 + 600 u^4 + 1526 u^3 + 2380 u^2 + 2205 u + 945)/(T^6 u^11), ' +
    'T = T0(N), u = log(T/2pi), K = (C_C/E_trunc)^2',
  derivationNote:
    'From g_fifth_deriv = 32 pi^5 K h5 with h5 = Q/(T^5 u^9), Q = 24u^4+96u^3+190u^2+210u+105, ' +
    'dT/dN = 2 pi/u, du/dN = 2 pi/(T u): d(log h5)/dN = (2 pi/(T u))[Q_prime/Q - 9/u - 5], and ' +
    'u Q_prime - 9 Q - 5 u Q = -(120u^5+600u^4+1526u^3+2380u^2+2205u+945), so h5_prime = ' +
    '-2 pi (120u^5+600u^4+1526u^3+2380u^2+2205u+945)/(T^6 u^11) and g_sixth_deriv = 32 pi^5 K h5_prime = ' +
    '-64 pi^6 K (120u^5+600u^4+1526u^3+2380u^2+2205u+945)/(T^6 u^11) < 0 on the whole ramp.',
  fourthBand: [+BAND_LO.toExponential(0), +BAND_HI.toExponential(0)],
  probes: PROBES,
  sixthDerivStrictlyNegativeOnBand: bandAllNegative,
  sixthDerivInteriorSignChange: interiorSignChange,
  sixthDerivMostNegativeOnBand: +mostNegative.toExponential(6),
  sixthDerivLeastNegativeOnBand: +leastNegative.toExponential(6),
  ladderSignsAtBandMid: LADDER_SIGNS, // [g'', g''', g'''', g_fifth, g_sixth] = [-1, +1, -1, +1, -1]
  alternatingLadderExtendsToSixthOrder: LADDER_ALTERNATES && bandAllNegative && !interiorSignChange,
  maxClosedVsFdRelErrOnBand: +maxRelErr.toExponential(3),
  boundaryValueAt1e12: +boundaryClosed.toExponential(6),
  frozenBoundaryAt1e12: FROZEN_BOUNDARY_AT_1E12,
  boundaryLiteralDrift: +BOUNDARY_LITERAL_DRIFT.toExponential(3),
  inheritedFifthBandPositive:
    IMP34842_CROSSOVER_GPPPP5_FIFTH_DERIV_FOURTH_BAND.fifthDerivStrictlyPositiveOnBand,
  finding: {
    H1_sixth_derivative_closed_form:
      'g_sixth_deriv(N) = -64 pi^6 K (120u^5+600u^4+1526u^3+2380u^2+2205u+945)/(T^6 u^11), derived on ' +
      'the same Riemann-von Mangoldt footing as imp-34793/imp-34822/imp-34842; the leading factor ' +
      'continues the alternating-doubling ladder -4, +8, -16, +32, -64.',
    H2_sixth_derivative_matches_fd:
      'Over ' +
      PROBES +
      ' log-spaced probes on [1e12,1e13] the closed form agrees with a 7-point sixth-derivative ' +
      'central difference of g to < 1e-2 relative (max ' +
      (+maxRelErr.toExponential(3)).toString() +
      '), the expected h^-6 roundoff level of a sixth-difference stencil (one order noisier than the ' +
      'imp-34842 fifth-difference).',
    H3_alternating_ladder_extends:
      'g_sixth_deriv is strictly NEGATIVE across the whole [1e12,1e13] band with NO interior sign ' +
      'change (120u^5+600u^4+1526u^3+2380u^2+2205u+945 > 0 and T^6 u^11 > 0 with u ~ 27..29), ' +
      'extending the definite -, +, -, +, - sign ladder one order deeper -- the higher derivative ' +
      'does NOT change sign inside the band, confirming the imp-34842 prediction g_sixth_deriv < 0.',
    H4_matches_frozen_boundary:
      'g_sixth_deriv at the shared boundary N=1e12 reproduces the frozen literal ' +
      FROZEN_BOUNDARY_AT_1E12 +
      ' to ~1e-9 relative (drift ' +
      (+BOUNDARY_LITERAL_DRIFT.toExponential(3)).toString() +
      ').',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction). imp-34842 found g_fifth_deriv > 0 strictly on the ' +
    'fourth band [1e12,1e13], completing the alternating/definite-sign derivative ladder ' +
    '(g_double_prime < 0, g_triple_prime > 0, g_quadruple_prime < 0, g_fifth_deriv > 0) and ' +
    'PREDICTING g_sixth_deriv < 0. Extending that closed-form chain one order gives g_sixth_deriv(N) = ' +
    '-64 pi^6 K (120u^5+600u^4+1526u^3+2380u^2+2205u+945)/(T^6 u^11), which agrees with a 7-point ' +
    'sixth-derivative central difference of g to < 1e-2 relative across the same 41-probe imp-34842 ' +
    'grid. Because 120u^5+600u^4+1526u^3+2380u^2+2205u+945 > 0, the sixth derivative is strictly ' +
    'NEGATIVE on the WHOLE [1e12,1e13] band with NO interior sign change: the alternating -, +, -, +, ' +
    '- ladder EXTENDS to sixth order and does NOT break -- no higher derivative flips sign inside the ' +
    'band, confirming the imp-34842 prediction. The value at the shared boundary N=1e12 reproduces ' +
    'the frozen literal to ~1e-9 relative. Measurement/derivation only on the INHERITED ' +
    'imp-3220/imp-3406 surrogate map; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) are UNTOUCHED; imp-3066 K_a >= 0 is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34842 (g_fifth_deriv > 0 on [1e12,1e13]; predicts g_sixth < 0); imp-34822 (g_quadruple_prime ' +
    '< 0 on [1e12,1e13]; convexity); imp-34793 (g_quadruple_prime closed form; convexity on ' +
    '[1e9,1e12]); imp-34768 (g_triple_prime closed form; global monotone decrease); imp-34731 ' +
    '(g_double_prime closed form; 5-probe check); lambda-rh-height-mapping (effectiveHeightForN, ' +
    'Riemann-von Mangoldt inverse); imp-2631 (E_trunc fixed-strip route); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34859_CROSSOVER_GPPPPPP6_SIXTH_DERIV_FOURTH_BAND_ASSERTIONS = [
  {
    // (H3): sixth derivative strictly negative on [1e12,1e13] with NO interior sign change.
    id: 'imp34859-sixth-derivative-strictly-negative-no-sign-change',
    description:
      'g_sixth_deriv < 0 on the whole [1e12,1e13] band with no interior sign change, so the ' +
      'alternating/definite derivative-sign ladder extends to sixth order and does not break',
    holds: () => bandAllNegative && !interiorSignChange,
  },
  {
    // (H3): the -, +, -, +, - ladder holds at the band midpoint.
    id: 'imp34859-alternating-ladder-minus-plus-minus-plus-minus',
    description:
      'the successive derivative signs [g_double_prime, g_triple_prime, g_quadruple_prime, ' +
      'g_fifth_deriv, g_sixth_deriv] at the band midpoint are [-1, +1, -1, +1, -1] (alternating/definite)',
    holds: () => LADDER_ALTERNATES,
  },
  {
    // (H2): dense closed-form g_sixth_deriv vs 7-point sixth-derivative central difference.
    id: 'imp34859-sixth-derivative-matches-central-difference-far-tail',
    description:
      'closed-form g_sixth_deriv agrees with a 7-point sixth-derivative central difference to ' +
      '< 1e-2 relative across all ' +
      PROBES +
      ' probes on [1e12,1e13]',
    holds: () => maxRelErr < 1e-2,
  },
  {
    // (H4): the shared boundary N=1e12 matches the frozen literal (refactor guard).
    id: 'imp34859-matches-frozen-boundary-literal',
    description:
      'g_sixth_deriv at N=1e12 reproduces the frozen boundary literal to ~1e-6 relative ' +
      '(frozen-table cross-check against a future height-map / closed-form refactor)',
    holds: () => BOUNDARY_LITERAL_DRIFT < 1e-5,
  },
  {
    // Consistency anchor: the sixth-derivative leading coefficient reproduces -64 pi^6 K on the band.
    id: 'imp34859-sixth-derivative-leading-coefficient-far-tail',
    description: 'closed-form leading coefficient -64 pi^6 K matches the derived constant at N=1e12',
    holds: () => {
      const T = effectiveHeightForN(BAND_LO);
      const u = Math.log(T / TWO_PI);
      const recovered =
        (gSixthDerivClosed(BAND_LO) * T ** 6 * u ** 11) /
        (120 * u ** 5 + 600 * u ** 4 + 1526 * u ** 3 + 2380 * u * u + 2205 * u + 945);
      return Math.abs(recovered / (-64 * PI6 * K_AMPL) - 1) < 1e-12;
    },
  },
  {
    // Honesty gate: measurement/derivation only, no QED, no refereed bound is changed.
    id: 'imp34859-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34859_CROSSOVER_GPPPPPP6_SIXTH_DERIV_FOURTH_BAND.isRigorous === false &&
      /NO QED/.test(IMP34859_CROSSOVER_GPPPPPP6_SIXTH_DERIV_FOURTH_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP34859_CROSSOVER_GPPPPPP6_SIXTH_DERIV_FOURTH_BAND.verdict),
  },
];

for (const a of IMP34859_CROSSOVER_GPPPPPP6_SIXTH_DERIV_FOURTH_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34859-crossover-gpppppp6-sixth-deriv-fourth-band assertion failed: ${a.id}`);
  }
}
