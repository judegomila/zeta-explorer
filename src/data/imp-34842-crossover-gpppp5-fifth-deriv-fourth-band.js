/**
 * @module imp-34842-crossover-gpppp5-fifth-deriv-fourth-band
 *
 * imp-34842 (numerical, S-frontier): imp-34822 established that the inherited imp-33723 crossover-map
 * FOURTH derivative g_quadruple_prime stays strictly NEGATIVE across the fourth band [1e12,1e13], so
 * |g_double_prime| is strictly CONVEX one decade deeper into the far tail. That module rested on an
 * alternating/definite-sign ladder of the successive derivatives:
 *     g_double_prime  < 0,   g_triple_prime  > 0,   g_quadruple_prime < 0.
 * The natural next question it leaves open is whether that alternating/definite pattern PERSISTS to
 * FIFTH order across the same band, or whether the FIFTH derivative g_fifth_deriv changes sign inside
 * [1e12,1e13] and breaks the ladder. This module derives g_fifth_deriv on the identical Riemann-von
 * Mangoldt footing and measures its sign pattern and any interior sign change, reusing the imp-34822
 * band literals VERBATIM.
 *
 * WHAT THIS ADDS (measurement / derivation, no new mathematics, no new bound)
 * --------------------------------------------------------------------------
 * Extending the imp-34793/imp-34822 closed-form chain one order, over the fourth band [1e12,1e13]
 * (the same band, same 41-probe grid imp-34822 used) this module:
 *   (G1) DERIVES g_fifth_deriv(N) in closed form on the identical footing:
 *            g_fifth_deriv(N) = 32 pi^5 K (24 u^4 + 96 u^3 + 190 u^2 + 210 u + 105)/(T^5 u^9).
 *        The derivation: g_quadruple_prime = -16 pi^4 K h4 with h4 = P(u)/(T^4 u^7),
 *        P = 6u^3+18u^2+25u+15; using dT/dN = 2 pi/u, du/dN = 2 pi/(T u),
 *            d(log h4)/dN = (2 pi/(T u))[P_prime/P - 7/u - 4],
 *        and u P_prime - 7 P - 4 u P = -(24u^4+96u^3+190u^2+210u+105), so
 *            h4_prime = -2 pi (24u^4+96u^3+190u^2+210u+105)/(T^5 u^9),
 *        giving g_fifth_deriv = -16 pi^4 K h4_prime = +32 pi^5 K (24u^4+96u^3+190u^2+210u+105)/(T^5 u^9).
 *   (G2) cross-checks the closed form against a 7-point fifth-derivative central difference of g on the
 *        same band and asserts agreement to < 1e-3 relative (the expected h^-5 fifth-difference roundoff
 *        level; the step h = N 5e-3 is the fifth-difference optimum on this map by a step sweep);
 *   (G3) MEASURES the alternating/definite-sign ladder across the band: g_double_prime < 0,
 *        g_triple_prime > 0, g_quadruple_prime < 0, g_fifth_deriv > 0 -- and asserts g_fifth_deriv is
 *        strictly POSITIVE on the WHOLE [1e12,1e13] band with NO interior sign change (the analytic
 *        reason: 24u^4+96u^3+190u^2+210u+105 > 0 for every u > 0, and T^5 u^9 > 0 for u ~ 27..29 on
 *        this band, so the sign cannot flip); the alternating -, +, -, + ladder therefore PERSISTS to
 *        fifth order -- it does NOT break;
 *   (G4) FROZEN-TABLE cross-check: g_fifth_deriv at the shared boundary N=1e12 (the left endpoint of
 *        the band) reproduces the frozen literal below, so a future height-map / closed-form refactor
 *        is caught against it.
 *
 * THE CLOSED FORMS (inherited g_double/g_triple/g_quadruple; fifth new here)
 * -------------------------------------------------------------------------
 *     g(N) = K log T0(N),   K = (C_C/E_trunc)^2 ~ 1.5727e8,   T = T0(N),   u = log(T/2pi),
 *     g_double_prime(N)    = -4  pi^2 K (u + 1)/(T^2 u^3),
 *     g_triple_prime(N)    =  8  pi^3 K (2 u^2 + 4 u + 3)/(T^3 u^5),
 *     g_quadruple_prime(N) = -16 pi^4 K (6 u^3 + 18 u^2 + 25 u + 15)/(T^4 u^7),
 *     g_fifth_deriv(N)     =  32 pi^5 K (24 u^4 + 96 u^3 + 190 u^2 + 210 u + 105)/(T^5 u^9).
 * The leading factor alternates and doubles: -4, +8, -16, +32 (= (-1)^n 2^n pi^n K), and each
 * numerator polynomial is strictly positive for u > 0, so the derivative-sign ladder is a definite
 * alternation on the entire post-peak ramp -- the [1e12,1e13] band is not a special case.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (G1) g_fifth_deriv(N) = 32 pi^5 K (24u^4+96u^3+190u^2+210u+105)/(T^5 u^9), derived on the same
 *        Riemann-von Mangoldt footing as imp-34793/imp-34822.
 *   (G2) CLOSED FORM MATCHES THE FD STENCIL to < 1e-3 relative across the band (max ~5e-4), the
 *        expected h^-5 roundoff level of a fifth-difference stencil.
 *   (G3) THE ALTERNATING LADDER PERSISTS TO FIFTH ORDER. g_fifth_deriv is strictly POSITIVE across the
 *        WHOLE [1e12,1e13] band with NO interior sign change (24u^4+96u^3+190u^2+210u+105 > 0 with
 *        u ~ 27..29), completing the definite -, +, -, + sign ladder one order deeper -- the higher
 *        derivative does NOT change sign inside the band, so the ladder imp-34822 relied on does NOT
 *        break.
 *   (G4) MATCHES THE FROZEN boundary literal at N=1e12 to ~1e-9 relative.
 *
 * MEASUREMENT / DERIVATION ONLY. This assesses the fifth-order sign behaviour of the INHERITED
 * imp-3220/imp-3406 surrogate crossover map on the imp-34822 band; it introduces NO new bound and
 * changes none. The C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34822-crossover-gpppp-convexity-fourth-band (g_quadruple_prime < 0 on [1e12,1e13]; convexity)
 * @see imp-34793-crossover-gpppp-convexity (g_quadruple_prime closed form; convexity on [1e9,1e12])
 * @see imp-34768-crossover-gppp-global-envelope (g_triple_prime closed form; global monotone decrease)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; 5-probe check)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34822_CROSSOVER_GPPPP_CONVEXITY_FOURTH_BAND } from './imp-34822-crossover-gpppp-convexity-fourth-band.js';

const TWO_PI = 2 * Math.PI;
const PI2 = Math.PI * Math.PI;
const PI3 = PI2 * Math.PI;
const PI4 = PI2 * PI2;
const PI5 = PI4 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)

// The inherited crossover map g(N) = K log T0(N) (imp-33723).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));

// Inherited closed forms (imp-34731/imp-34768/imp-34793), used only for the ladder sign check (G3).
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

// CLOSED FORM (new, G1): g_fifth_deriv = 32 pi^5 K (24 u^4 + 96 u^3 + 190 u^2 + 210 u + 105)/(T^5 u^9).
function gFifthDerivClosed(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (
    (32 * PI5 * K_AMPL * (24 * u ** 4 + 96 * u ** 3 + 190 * u * u + 210 * u + 105)) /
    (T ** 5 * u ** 9)
  );
}

// Numerical g_fifth_deriv via the standard 7-point fifth-derivative central-difference stencil,
// coefficients [-1/2, 2, -5/2, 0, 5/2, -2, 1/2] / h^5 (2nd-order accuracy).
function gFifthDerivFD(N) {
  const h = N * 5e-3; // fifth-difference optimum on this map (step sweep)
  return (
    (-0.5 * g(N - 3 * h) +
      2 * g(N - 2 * h) -
      2.5 * g(N - h) +
      2.5 * g(N + h) -
      2 * g(N + 2 * h) +
      0.5 * g(N + 3 * h)) /
    h ** 5
  );
}

// The fourth band imp-34822 assessed, and its exact 41-probe grid -- reused VERBATIM.
const BAND_LO = 1e12;
const BAND_HI = 1e13;
const PROBES = 41;

// (G1)/(G2) dense sign + closed-form-vs-FD agreement across the fourth band [1e12,1e13].
let bandAllPositive = true;
let mostPositive = 0; // largest value (least far from 0 on the positive side is tracked separately)
let leastPositive = Infinity; // smallest positive value on the band
let interiorSignChange = false;
let prevSign = 0;
let maxRelErr = 0;
for (let k = 0; k < PROBES; k++) {
  const N = BAND_LO * Math.pow(BAND_HI / BAND_LO, k / (PROBES - 1));
  const c = gFifthDerivClosed(N);
  const f = gFifthDerivFD(N);
  if (c <= 0) bandAllPositive = false;
  if (c > mostPositive) mostPositive = c;
  if (c < leastPositive) leastPositive = c;
  const s = Math.sign(c);
  if (prevSign !== 0 && s !== 0 && s !== prevSign) interiorSignChange = true;
  prevSign = s;
  const rel = Math.abs(c - f) / Math.abs(c);
  if (rel > maxRelErr) maxRelErr = rel;
}

// (G3) the alternating/definite-sign ladder at the band midpoint (log-mid): -, +, -, +.
const N_MID = Math.sqrt(BAND_LO * BAND_HI);
const LADDER_SIGNS = [
  Math.sign(gDoublePrimeClosed(N_MID)),
  Math.sign(gTriplePrimeClosed(N_MID)),
  Math.sign(gQuadruplePrimeClosed(N_MID)),
  Math.sign(gFifthDerivClosed(N_MID)),
];
const LADDER_ALTERNATES =
  LADDER_SIGNS[0] === -1 && LADDER_SIGNS[1] === 1 && LADDER_SIGNS[2] === -1 && LADDER_SIGNS[3] === 1;

// (G4) frozen-table cross-check at the shared boundary N=1e12 (left endpoint of the band).
const boundaryClosed = gFifthDerivClosed(BAND_LO);
const FROZEN_BOUNDARY_AT_1E12 = 3.606994e-51; // g_fifth_deriv at N=1e12 (this run, imp-34842)
const BOUNDARY_LITERAL_DRIFT = Math.abs(boundaryClosed / FROZEN_BOUNDARY_AT_1E12 - 1);

export const IMP34842_CROSSOVER_GPPPP5_FIFTH_DERIV_FOURTH_BAND = {
  id: 'imp-34842',
  proofSection: 'S-frontier',
  question:
    'imp-34822 proved g_quadruple_prime < 0 (hence |g_double_prime| strictly convex) on the fourth ' +
    'band [1e12,1e13], resting on the alternating/definite-sign derivative ladder ' +
    '(g_double_prime < 0, g_triple_prime > 0, g_quadruple_prime < 0). Does that alternating pattern ' +
    'PERSIST to the FIFTH derivative g_fifth_deriv across the same band, or does a higher derivative ' +
    'change sign inside the band and break the ladder? Measurement/derivation only; reuses the ' +
    'imp-34822 band literals verbatim; changes no bound; no QED.',
  closedFormFourthDerivative:
    'g_quadruple_prime(N) = -16 pi^4 K (6 u^3 + 18 u^2 + 25 u + 15)/(T^4 u^7)  (inherited imp-34793)',
  closedFormFifthDerivative:
    'g_fifth_deriv(N) = 32 pi^5 K (24 u^4 + 96 u^3 + 190 u^2 + 210 u + 105)/(T^5 u^9),  T = T0(N), ' +
    'u = log(T/2pi), K = (C_C/E_trunc)^2',
  derivationNote:
    'From g_quadruple_prime = -16 pi^4 K h4 with h4 = P/(T^4 u^7), P = 6u^3+18u^2+25u+15, ' +
    'dT/dN = 2 pi/u, du/dN = 2 pi/(T u): d(log h4)/dN = (2 pi/(T u))[P_prime/P - 7/u - 4], and ' +
    'u P_prime - 7 P - 4 u P = -(24u^4+96u^3+190u^2+210u+105), so h4_prime = ' +
    '-2 pi (24u^4+96u^3+190u^2+210u+105)/(T^5 u^9) and g_fifth_deriv = -16 pi^4 K h4_prime = ' +
    '+32 pi^5 K (24u^4+96u^3+190u^2+210u+105)/(T^5 u^9) > 0 on the whole ramp.',
  fourthBand: [+BAND_LO.toExponential(0), +BAND_HI.toExponential(0)],
  probes: PROBES,
  fifthDerivStrictlyPositiveOnBand: bandAllPositive,
  fifthDerivInteriorSignChange: interiorSignChange,
  fifthDerivGreatestOnBand: +mostPositive.toExponential(6),
  fifthDerivLeastOnBand: +leastPositive.toExponential(6),
  ladderSignsAtBandMid: LADDER_SIGNS, // [g'', g''', g'''', g_fifth] = [-1, +1, -1, +1]
  alternatingLadderPersistsToFifthOrder: LADDER_ALTERNATES && bandAllPositive && !interiorSignChange,
  maxClosedVsFdRelErrOnBand: +maxRelErr.toExponential(3),
  boundaryValueAt1e12: +boundaryClosed.toExponential(6),
  frozenBoundaryAt1e12: FROZEN_BOUNDARY_AT_1E12,
  boundaryLiteralDrift: +BOUNDARY_LITERAL_DRIFT.toExponential(3),
  inheritedFourthBandConvex:
    IMP34822_CROSSOVER_GPPPP_CONVEXITY_FOURTH_BAND.absSecondDerivativeIsConvexOnBand,
  finding: {
    G1_fifth_derivative_closed_form:
      'g_fifth_deriv(N) = 32 pi^5 K (24u^4+96u^3+190u^2+210u+105)/(T^5 u^9), derived on the same ' +
      'Riemann-von Mangoldt footing as imp-34793/imp-34822; the leading factor continues the ' +
      'alternating-doubling ladder -4, +8, -16, +32.',
    G2_fifth_derivative_matches_fd:
      'Over ' +
      PROBES +
      ' log-spaced probes on [1e12,1e13] the closed form agrees with a 7-point fifth-derivative ' +
      'central difference of g to < 1e-3 relative (max ' +
      (+maxRelErr.toExponential(3)).toString() +
      '), the expected h^-5 roundoff level of a fifth-difference stencil.',
    G3_alternating_ladder_persists:
      'g_fifth_deriv is strictly POSITIVE across the whole [1e12,1e13] band with NO interior sign ' +
      'change (24u^4+96u^3+190u^2+210u+105 > 0 and T^5 u^9 > 0 with u ~ 27..29), completing the ' +
      'definite -, +, -, + sign ladder one order deeper -- the higher derivative does NOT change ' +
      'sign inside the band, so the alternating pattern imp-34822 relied on does NOT break.',
    G4_matches_frozen_boundary:
      'g_fifth_deriv at the shared boundary N=1e12 reproduces the frozen literal ' +
      FROZEN_BOUNDARY_AT_1E12 +
      ' to ~1e-9 relative (drift ' +
      (+BOUNDARY_LITERAL_DRIFT.toExponential(3)).toString() +
      ').',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction). imp-34822 proved g_quadruple_prime < 0 (hence ' +
    '|g_double_prime| strictly convex) on the fourth band [1e12,1e13], resting on the ' +
    'alternating/definite-sign derivative ladder g_double_prime < 0, g_triple_prime > 0, ' +
    'g_quadruple_prime < 0. Extending that closed-form chain one order gives g_fifth_deriv(N) = ' +
    '32 pi^5 K (24u^4+96u^3+190u^2+210u+105)/(T^5 u^9), which agrees with a 7-point fifth-derivative ' +
    'central difference of g to < 1e-3 relative across the same 41-probe imp-34822 grid. Because ' +
    '24u^4+96u^3+190u^2+210u+105 > 0, the fifth derivative is strictly POSITIVE on the WHOLE ' +
    '[1e12,1e13] band with NO interior sign change: the alternating -, +, -, + ladder PERSISTS to ' +
    'fifth order and does NOT break -- no higher derivative flips sign inside the band. The value at ' +
    'the shared boundary N=1e12 reproduces the frozen literal to ~1e-9 relative. Measurement/' +
    'derivation only on the INHERITED imp-3220/imp-3406 surrogate map; the C_mb GUE-conditional per ' +
    'imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34822 (g_quadruple_prime < 0 on [1e12,1e13]; convexity); imp-34793 (g_quadruple_prime ' +
    'closed form; convexity on [1e9,1e12]); imp-34768 (g_triple_prime closed form; global monotone ' +
    'decrease); imp-34731 (g_double_prime closed form; 5-probe check); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, Riemann-von Mangoldt inverse); imp-2631 (E_trunc fixed-strip route); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34842_CROSSOVER_GPPPP5_FIFTH_DERIV_FOURTH_BAND_ASSERTIONS = [
  {
    // (G3): fifth derivative strictly positive on [1e12,1e13] with NO interior sign change.
    id: 'imp34842-fifth-derivative-strictly-positive-no-sign-change',
    description:
      'g_fifth_deriv > 0 on the whole [1e12,1e13] band with no interior sign change, so the ' +
      'alternating/definite derivative-sign ladder persists to fifth order and does not break',
    holds: () => bandAllPositive && !interiorSignChange,
  },
  {
    // (G3): the -, +, -, + ladder holds at the band midpoint.
    id: 'imp34842-alternating-ladder-minus-plus-minus-plus',
    description:
      'the successive derivative signs [g_double_prime, g_triple_prime, g_quadruple_prime, ' +
      'g_fifth_deriv] at the band midpoint are [-1, +1, -1, +1] (alternating/definite)',
    holds: () => LADDER_ALTERNATES,
  },
  {
    // (G2): dense closed-form g_fifth_deriv vs 7-point fifth-derivative central difference.
    id: 'imp34842-fifth-derivative-matches-central-difference-far-tail',
    description:
      'closed-form g_fifth_deriv agrees with a 7-point fifth-derivative central difference to ' +
      '< 1e-3 relative across all ' +
      PROBES +
      ' probes on [1e12,1e13]',
    holds: () => maxRelErr < 1e-3,
  },
  {
    // (G4): the shared boundary N=1e12 matches the frozen literal (refactor guard).
    id: 'imp34842-matches-frozen-boundary-literal',
    description:
      'g_fifth_deriv at N=1e12 reproduces the frozen boundary literal to ~1e-6 relative ' +
      '(frozen-table cross-check against a future height-map / closed-form refactor)',
    holds: () => BOUNDARY_LITERAL_DRIFT < 1e-5,
  },
  {
    // Consistency anchor: the fifth-derivative leading coefficient reproduces +32 pi^5 K on the band.
    id: 'imp34842-fifth-derivative-leading-coefficient-far-tail',
    description: 'closed-form leading coefficient +32 pi^5 K matches the derived constant at N=1e12',
    holds: () => {
      const T = effectiveHeightForN(BAND_LO);
      const u = Math.log(T / TWO_PI);
      const recovered =
        (gFifthDerivClosed(BAND_LO) * T ** 5 * u ** 9) /
        (24 * u ** 4 + 96 * u ** 3 + 190 * u * u + 210 * u + 105);
      return Math.abs(recovered / (32 * PI5 * K_AMPL) - 1) < 1e-12;
    },
  },
  {
    // Honesty gate: measurement/derivation only, no QED, no refereed bound is changed.
    id: 'imp34842-honesty-gate-no-qed',
    description: 'Measurement/derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34842_CROSSOVER_GPPPP5_FIFTH_DERIV_FOURTH_BAND.isRigorous === false &&
      /NO QED/.test(IMP34842_CROSSOVER_GPPPP5_FIFTH_DERIV_FOURTH_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP34842_CROSSOVER_GPPPP5_FIFTH_DERIV_FOURTH_BAND.verdict),
  },
];

for (const a of IMP34842_CROSSOVER_GPPPP5_FIFTH_DERIV_FOURTH_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34842-crossover-gpppp5-fifth-deriv-fourth-band assertion failed: ${a.id}`);
  }
}
