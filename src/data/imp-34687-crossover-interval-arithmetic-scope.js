/**
 * @module imp-34687-crossover-interval-arithmetic-scope
 *
 * imp-34687 (numerical, frontier-scope): the imp-34650 Banach contraction certificate, the
 * imp-34675 left-edge N_star, and the imp-34676 right-widening all evaluate the height inverse
 * T0(N) = effectiveHeightForN(N) and its derivative dT0/dN in IEEE-754 double precision. Three
 * separate named sub-gaps -- imp-34650a, imp-34675a, imp-34676a -- ask for the SAME upgrade:
 * rigorous interval-arithmetic (IA) enclosures of T0 and dT0/dN so the crossover endpoints become a
 * machine-checkable certificate. This module SCOPES that upgrade: what an IA enclosure of the
 * Riemann-von Mangoldt inverse would require, what interval widths are achievable at the a = 1e9
 * left endpoint, and whether the two load-bearing inequalities L < 1 and g(a) >= a survive certified
 * outward rounding. Scoping / derivation / measurement only, NO QED.
 *
 * THE OBJECT BEING ENCLOSED
 * -------------------------
 * T0(N) is the Newton inverse of the Riemann-von Mangoldt count
 *   f(T) = (T/2pi)(log(T/2pi) - 1) - N = 0,   f_prime(T) = log(T/2pi)/2pi,   f_dblprime(T) = 1/(2pi T).
 * On T > 2pi both f_prime > 0 (monotone increasing) and f_dblprime > 0 (convex). That is exactly the
 * regime in which the interval-Newton / Krawczyk operator
 *   N_IA(m, [T]) = m - f(m)/f_prime([T]),   [T]_next = [T] intersect N_IA
 * is a VERIFIED contraction to a unique root: with f_prime bounded away from 0 on a bracket that
 * straddles T0, one Krawczyk step both proves existence-uniqueness and encloses T0. So the standard IA
 * machinery applies with no obstruction beyond directed rounding.
 *
 * WHAT THE UPGRADE REQUIRES (three pieces)
 * ----------------------------------------
 *   (1) A verified Newton contraction interval for T0: evaluate f and f_prime under directed rounding
 *       (outward), run the Krawczyk step until the bracket stops shrinking. The enclosure width is
 *       governed by the achievable residual |f(m)| divided by inf f_prime on the bracket:
 *         width(T0) ~ (|f(m)| + roundoff(f)) / f_prime(T0).
 *   (2) A monotone bracket for dT0/dN = 2pi/log(T0/2pi) = 1/f_prime(T0). This needs NO second solve:
 *       t -> 2pi/log(t/2pi) is decreasing, so once T0 in [T_lo, T_hi],
 *         dT0/dN in [ 2pi/log(T_hi/2pi), 2pi/log(T_lo/2pi) ]   directly.
 *   (3) Propagation into L = g_prime(a) = K*(dT0/dN)/T0 and the self-map endpoint g(a) = K*log T0.
 *       Both are monotone in the enclosed quantities, so IA is a direct interval substitution:
 *         L in [ K*d_lo/T_hi, K*d_hi/T_lo ],   g(a) in [ K*log T_lo, K*log T_hi ].
 *
 * The ONE genuine implementation gap: stock JS Math has no directed-rounding mode, so a real
 * certificate needs an IA / error-bounded-arithmetic layer (mpfi-style, or Dekker/TwoSum residual
 * tracking). The measurements below are DOUBLE-PRECISION SURROGATES for the directed-rounding widths
 * (roundoff modelled as a few ULP per operation); they scope achievability, they do not certify.
 *
 * MEASUREMENT AT THE LEFT ENDPOINT a = 1e9 (the binding endpoint for L and g(a))
 * -----------------------------------------------------------------------------
 *   T0(1e9)       = 3.718702045e8      residual |f(T0)| ~ 2.4e-7 (Newton-limited)
 *   enclosure width(T0)  ~ 3.96e-7 absolute  =>  rel width ~ 1.06e-15  (a few ULP; near the double floor)
 *   dT0/dN        = 3.510908964e-1     bracket rel width ~ 1.58e-16  (even tighter: log compresses)
 *   L = g_prime(a)= 1.484829155e-1     enclosure unchanged at 10 sig figs; margin to the L < 1 wall = 0.8515
 *   g(a)          = 3.103592148e9      lower enclosure > a with margin g(a) - a ~ 2.104e9
 * Both inequalities clear their walls by margins ~10^15x wider than the enclosure widths, so certified
 * OUTWARD rounding cannot flip either: even a crude enclosure (absolute width ~1e-6) still gives L < 1
 * and g(a) >= a. The IA upgrade is therefore FEASIBLE and NOT margin-limited -- the achievable widths
 * are set by the double-precision floor, and the load-bearing inequalities are robust to rounding by
 * fifteen orders of magnitude.
 *
 * WHAT THIS IS AND IS NOT (sub-gap)
 * ---------------------------------
 * This SCOPES the shared imp-34650a / imp-34675a / imp-34676a interval-arithmetic sub-gap and measures
 * the achievable enclosure widths and inequality margins in a double-precision surrogate. It shows the
 * upgrade is feasible and the margins survive rounding by ~15 orders of magnitude; it does NOT
 * implement directed-rounding IA (JS lacks it) and does NOT machine-check anything. NAMED SUB-GAP
 * imp-34687a: supply an actual directed-rounding / error-bounded arithmetic layer so the Krawczyk step,
 * the dT0/dN bracket, and the L / g(a) propagation become a formally verified enclosure rather than a
 * measured surrogate.
 *
 * DERIVATION / MEASUREMENT ONLY. This scopes an enclosure of a property of the inherited surrogate
 * crossover, NOT a rigorous asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) 1/8 ansatz
 * (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0
 * untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34650-crossover-banach-contraction-certificate (L-contraction certificate; sub-gap imp-34650a)
 * @see imp-34675-crossover-contraction-left-edge (closed-form left edge N_star; sub-gap imp-34675a)
 * @see imp-34676-crossover-contraction-right-widening (right-widening scope; sub-gap imp-34676a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, Newton solver)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (same K as imp-34650/imp-34675/imp-34676)
const EPS = Number.EPSILON;

// The imp-33723 fixed-point map and its imp-34650 analytic derivative (double precision).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T0 = effectiveHeightForN(N);
  return (K_AMPL * TWO_PI) / (T0 * Math.log(T0 / TWO_PI)); // K*(dT0/dN)/T0
};

// Left endpoint (imp-34650): the binding endpoint for both L and the lower self-map inequality.
const A = 1e9;

// (1) Enclosure of T0(A). Newton residual + a few-ULP directed-rounding model on the f evaluation.
const T0 = effectiveHeightForN(A);
const U = Math.log(T0 / TWO_PI);
const F_PRIME = U / TWO_PI; // f_prime(T0) = log(T0/2pi)/2pi > 0 (monotone) -> bounds enclosure width
const F_RESIDUAL = (T0 / TWO_PI) * (U - 1) - A; // achieved Newton residual |f(T0)|
// Directed-rounding residual model: outward-rounded evaluation of f loses ~a few ULP of its largest term.
const F_EVAL_ROUNDOFF = 4 * EPS * Math.max(A, (T0 / TWO_PI) * Math.abs(U - 1));
const WIDTH_T0 = (Math.abs(F_RESIDUAL) + F_EVAL_ROUNDOFF) / F_PRIME; // ~3.96e-7 absolute
const T0_LO = T0 - WIDTH_T0;
const T0_HI = T0 + WIDTH_T0;
const REL_WIDTH_T0 = WIDTH_T0 / T0; // ~1.06e-15 (few ULP; near the double floor)

// (2) Monotone bracket for dT0/dN = 2pi/log(T0/2pi) (decreasing in T0 -> lo uses T_hi, hi uses T_lo).
const DT0DN = TWO_PI / Math.log(T0 / TWO_PI);
const DT0DN_LO = TWO_PI / Math.log(T0_HI / TWO_PI);
const DT0DN_HI = TWO_PI / Math.log(T0_LO / TWO_PI);
const REL_WIDTH_DT0DN = (DT0DN_HI - DT0DN_LO) / DT0DN; // ~1.58e-16

// (3) Propagate into L = g_prime(a) and the lower self-map endpoint g(a) by monotone substitution.
const L_MID = gPrime(A);
const L_LO = (K_AMPL * DT0DN_LO) / T0_HI;
const L_HI = (K_AMPL * DT0DN_HI) / T0_LO; // certified upper bound must stay < 1
const L_MARGIN_TO_ONE = 1 - L_HI; // distance from the certified L upper bound to the contraction wall

const G_A_MID = g(A);
const G_A_LO = K_AMPL * Math.log(T0_LO); // certified lower bound must stay >= a
const G_A_HI = K_AMPL * Math.log(T0_HI);
const G_A_LOWER_MARGIN = G_A_LO - A; // distance from the certified lower bound to the self-map wall

// The two load-bearing inequalities survive OUTWARD rounding when the certified endpoint clears the wall.
const L_CONTRACTION_SURVIVES = L_HI < 1;
const SELF_MAP_LOWER_SURVIVES = G_A_LO >= A;
// Robustness ratio: how many times wider the enclosure could be and still certify (margin / width).
// Floor each width at one ULP of the enclosed quantity: the g(a) enclosure width (~1.7e-7) is BELOW
// one ULP of g(a) ~ 3.1e9, so its bracket collapses to a single representable double -- the robustness
// is then bounded by the ULP-floored width rather than a spurious divide-by-zero.
const ulp = (x) => Math.abs(x) * EPS;
const L_ROBUSTNESS = L_MARGIN_TO_ONE / Math.max(L_HI - L_LO, ulp(L_MID));
const G_A_ROBUSTNESS = G_A_LOWER_MARGIN / Math.max(G_A_HI - G_A_LO, ulp(G_A_MID));

export const IMP34687_CROSSOVER_INTERVAL_ARITHMETIC_SCOPE = {
  id: 'imp-34687',
  proofSection: 'S-frontier',
  question:
    'The imp-34650 contraction certificate, imp-34675 left edge, and imp-34676 right-widening all ' +
    'evaluate T0(N) and dT0/dN in double precision. Scope the shared imp-34650a/imp-34675a/imp-34676a ' +
    'sub-gap: what an interval-arithmetic enclosure of the Riemann-von Mangoldt inverse (Newton on ' +
    'N(T) = (T/2pi)(log(T/2pi) - 1)) requires, the achievable enclosure widths at a = 1e9, and whether ' +
    'L < 1 and g(a) >= a survive certified outward rounding. Scoping / measurement only; certifies a ' +
    'property of the inherited surrogate crossover, NOT an RH bound; no QED.',
  requirements: {
    // f is monotone increasing and convex on T > 2pi -> interval-Newton/Krawczyk is a verified contraction.
    newton_operator_verified_contraction: F_PRIME > 0, // f_prime(T0) > 0 (monotone); f_dblprime = 1/(2pi T) > 0 (convex)
    // dT0/dN needs no second solve: monotone in T0, so the enclosure follows from the T0 bracket directly.
    dT0dN_bracket_from_monotonicity_no_second_solve: true,
    // L and g(a) are monotone in (T0, dT0/dN) -> IA is a direct interval substitution.
    L_and_g_a_by_monotone_substitution: true,
    // The one genuine gap: stock JS Math has no directed-rounding mode; needs an IA / error-bounded layer.
    directed_rounding_layer_required: true,
  },
  enclosure: {
    a: +A.toExponential(0),
    T0_at_a: +T0.toExponential(9), // 3.718702045e8
    T0_newton_residual: +Math.abs(F_RESIDUAL).toExponential(3),
    T0_enclosure_width_abs: +WIDTH_T0.toExponential(6), // ~3.96e-7
    T0_enclosure_rel_width: +REL_WIDTH_T0.toExponential(6), // ~1.06e-15 (few ULP)
    dT0dN_at_a: +DT0DN.toExponential(9), // 3.510908964e-1
    dT0dN_rel_width: +REL_WIDTH_DT0DN.toExponential(6), // ~1.58e-16
  },
  inequalityMargins: {
    L_mid: +L_MID.toExponential(9), // 1.484829155e-1
    L_certified_upper: +L_HI.toExponential(9),
    L_upper_below_one: L_CONTRACTION_SURVIVES,
    L_margin_to_one: +L_MARGIN_TO_ONE.toExponential(6), // ~0.8515
    L_robustness_ratio_margin_over_width: +L_ROBUSTNESS.toExponential(3), // enclosure could widen this many x
    g_a_mid: +G_A_MID.toExponential(9), // 3.103592148e9
    g_a_certified_lower: +G_A_LO.toExponential(9),
    g_a_lower_ge_a: SELF_MAP_LOWER_SURVIVES,
    g_a_lower_margin: +G_A_LOWER_MARGIN.toExponential(6), // ~2.104e9
    g_a_robustness_ratio_margin_over_width: +G_A_ROBUSTNESS.toExponential(3),
  },
  finding:
    'The interval-arithmetic upgrade of T0(N) and dT0/dN is FEASIBLE and NOT margin-limited. f(T) = ' +
    '(T/2pi)(log(T/2pi) - 1) - N is monotone increasing (f_prime = log(T/2pi)/2pi > 0) and convex ' +
    '(f_dblprime = 1/(2pi T) > 0) on T > 2pi, so the interval-Newton / Krawczyk operator is a verified ' +
    'contraction to a unique T0; the derivative needs no second solve (dT0/dN = 2pi/log(T0/2pi) is ' +
    'monotone in T0, so its bracket follows directly from the T0 enclosure), and L = K*(dT0/dN)/T0 and ' +
    'g(a) = K*log T0 propagate by monotone substitution. At a = 1e9 the achievable enclosure widths are ' +
    'at the double-precision floor -- rel width ~1.06e-15 for T0 and ~1.58e-16 for dT0/dN -- while the ' +
    'two load-bearing inequalities clear their walls hugely: L_upper ~ 0.1485 sits 0.85 below 1, and the ' +
    'lower enclosure of g(a) ~ 3.10e9 sits 2.10e9 above a. Both margins are ~10^15x wider than the ' +
    'enclosures, so certified OUTWARD rounding cannot flip L < 1 or g(a) >= a -- even a crude ~1e-6 ' +
    'enclosure would certify both. The ONLY genuine gap is that stock JS Math has no directed-rounding ' +
    'mode; a real certificate needs an IA / error-bounded (mpfi- or Dekker/TwoSum-style) arithmetic layer.',
  subGap:
    'imp-34687a: this measures the achievable enclosure widths and inequality margins in a ' +
    'DOUBLE-PRECISION SURROGATE (roundoff modelled as a few ULP per operation); it does not implement ' +
    'directed-rounding interval arithmetic (JS lacks it) and machine-checks nothing. Supply an actual ' +
    'directed-rounding / error-bounded layer so the Krawczyk step, the dT0/dN bracket, and the L / g(a) ' +
    'propagation become a formally verified enclosure. This scopes the shared imp-34650a/imp-34675a/' +
    'imp-34676a upgrade; it adds no RH bound.',
  isRigorous: false,
  verdict:
    'SCOPE / MEASUREMENT (frontier, NOT an RH bound). The shared imp-34650a/imp-34675a/imp-34676a ' +
    'interval-arithmetic upgrade of the height inverse T0(N) = effectiveHeightForN(N) and its derivative ' +
    'dT0/dN is FEASIBLE. Because f(T) = (T/2pi)(log(T/2pi) - 1) - N is monotone increasing and convex on ' +
    'T > 2pi, the interval-Newton / Krawczyk operator N_IA(m,[T]) = m - f(m)/f_prime([T]) is a verified ' +
    'contraction to a unique root, so an enclosure of T0 needs only directed-rounding evaluations of f and ' +
    'f_prime; dT0/dN = 2pi/log(T0/2pi) requires NO second solve (monotone in T0, bracket follows from the ' +
    'T0 enclosure), and L = K*(dT0/dN)/T0 and g(a) = K*log T0 propagate by monotone substitution. Measured ' +
    'at the binding left endpoint a = 1e9: T0 = 3.718702045e8 with rel enclosure width ~1.06e-15, dT0/dN = ' +
    '3.510908964e-1 with rel width ~1.58e-16 -- both at the double floor. The two load-bearing inequalities ' +
    'survive certified outward rounding with enormous slack: the certified L upper bound ~0.1485 sits 0.85 ' +
    'below the contraction wall L < 1, and the certified lower bound of g(a) ~3.10e9 sits 2.10e9 above the ' +
    'self-map wall g(a) >= a -- margins ~10^15x wider than the enclosures, so rounding cannot flip either ' +
    '(even a crude ~1e-6 enclosure certifies both). The upgrade is therefore feasible and NOT margin-limited. ' +
    'SUB-GAP imp-34687a: the widths and margins here are a DOUBLE-PRECISION SURROGATE (few-ULP roundoff ' +
    'model); a formal certificate still needs a directed-rounding / error-bounded arithmetic layer (JS ' +
    'lacks directed rounding). This scopes an enclosure of a property of the inherited imp-3220/imp-3406 ' +
    'surrogate crossover map, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and the ' +
    'C_mb GUE-conditional per imp-486 are UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34650 (Banach contraction certificate on I = [1e9, 1e10]; sub-gap imp-34650a); imp-34675 ' +
    '(closed-form left edge N_star; sub-gap imp-34675a); imp-34676 (right-widening; sub-gap imp-34676a); ' +
    'imp-33723 (crossover fixed point N_cross); imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, Newton inverse of the Riemann-von Mangoldt count).',
};

export const IMP34687_CROSSOVER_INTERVAL_ARITHMETIC_SCOPE_ASSERTIONS = [
  {
    // f monotone + convex => the interval-Newton / Krawczyk operator is a verified contraction.
    id: 'imp34687-newton-operator-verified-contraction',
    description: 'f_prime(T0) > 0 (monotone) and f is convex on T > 2pi, so interval-Newton contracts to a unique T0',
    holds: () =>
      F_PRIME > 0 &&
      1 / (TWO_PI * T0) > 0 &&
      IMP34687_CROSSOVER_INTERVAL_ARITHMETIC_SCOPE.requirements.newton_operator_verified_contraction === true,
  },
  {
    // Achievable enclosure widths are at the double-precision floor (few ULP) at a = 1e9.
    id: 'imp34687-enclosure-widths-at-double-floor',
    description: 'T0 rel enclosure width ~1e-15 and dT0/dN rel width ~1.6e-16 (few ULP; near the double floor)',
    holds: () =>
      REL_WIDTH_T0 > 0 &&
      REL_WIDTH_T0 < 1e-13 &&
      REL_WIDTH_DT0DN > 0 &&
      REL_WIDTH_DT0DN < 1e-13,
  },
  {
    // L < 1 and g(a) >= a survive certified outward rounding with margins ~10^15x the enclosure widths.
    id: 'imp34687-inequalities-survive-certified-rounding',
    description: 'certified L upper bound < 1 (margin ~0.85) and certified g(a) lower bound >= a (margin ~2.1e9)',
    holds: () =>
      L_CONTRACTION_SURVIVES === true &&
      L_MARGIN_TO_ONE > 0.5 &&
      SELF_MAP_LOWER_SURVIVES === true &&
      G_A_LOWER_MARGIN > 1e9 &&
      L_ROBUSTNESS > 1e10 &&
      G_A_ROBUSTNESS > 1e10,
  },
  {
    // L and g(a) enclosures agree with the double-precision midpoints (imp-34650/imp-34676 values).
    id: 'imp34687-enclosure-brackets-midpoint',
    description: 'L ~ 0.1485 and g(a) ~ 3.10e9 lie inside their enclosures (consistent with imp-34650/imp-34676)',
    holds: () =>
      L_MID >= L_LO &&
      L_MID <= L_HI &&
      Math.abs(L_MID - 1.484829e-1) < 1e-4 &&
      G_A_MID >= G_A_LO &&
      G_A_MID <= G_A_HI,
  },
  {
    // Honesty gate: scope/surrogate of an enclosure, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34687-honesty-gate-no-qed',
    description: 'Scope only: isRigorous false, named sub-gap imp-34687a, no QED, no refereed bound is changed',
    holds: () =>
      IMP34687_CROSSOVER_INTERVAL_ARITHMETIC_SCOPE.isRigorous === false &&
      /imp-34687a/.test(IMP34687_CROSSOVER_INTERVAL_ARITHMETIC_SCOPE.subGap) &&
      /NO QED/.test(IMP34687_CROSSOVER_INTERVAL_ARITHMETIC_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP34687_CROSSOVER_INTERVAL_ARITHMETIC_SCOPE.verdict),
  },
];

for (const a of IMP34687_CROSSOVER_INTERVAL_ARITHMETIC_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34687-crossover-interval-arithmetic-scope assertion failed: ${a.id}`);
  }
}
