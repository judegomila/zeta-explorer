/**
 * @module imp-34707-crossover-residual-tracked-enclosure
 *
 * imp-34707 (numerical, frontier-measurement): imp-34687 SCOPED the shared
 * imp-34650a/imp-34675a/imp-34676a interval-arithmetic sub-gap and reported enclosure widths for the
 * crossover-map height inverse T0(N) = effectiveHeightForN(N) at the binding left endpoint a = 1e9 --
 * but those widths (~1.06e-15 rel on T0) were DOUBLE-PRECISION SURROGATES: stock JS Math has no
 * directed-rounding mode, so imp-34687 modelled the f-evaluation roundoff as "a few ULP per operation"
 * (F_EVAL_ROUNDOFF = 4*EPS*max terms). This module UPGRADES that surrogate to a genuine
 * error-BOUNDED enclosure by wrapping the Newton/Krawczyk residual in a Dekker/TwoSum error-free
 * transform (EFT) layer -- pure-JS, no package install -- and MEASURES the achievable residual-tracked
 * enclosure width, then propagates it into L = g_prime(a) and g(a) = K*log T0. It reports whether the
 * residual-tracked width matches the surrogate few-ULP estimate and whether both load-bearing
 * inequalities survive. MEASUREMENT ONLY: still not mpfi-certified (JS log is not proved
 * correctly-rounded), NO QED.
 *
 * WHAT AN ERROR-FREE TRANSFORM BUYS HERE
 * --------------------------------------
 * f(T) = (T/2pi)(log(T/2pi) - 1) - N is a large-minus-large cancellation: at a = 1e9 the product
 * c*(u-1) with c = T0/2pi ~ 5.9e7 and (u-1) ~ 18.3 is ~1e9, and we subtract N = 1e9, leaving the
 * Newton residual ~1e-7. Naive double evaluation of that product-then-subtract loses the low-order
 * bits of the cancellation. TwoProd (Dekker splitting) returns the product AND its exact rounding
 * error; TwoSum returns the sum AND its exact rounding error. Adding the two error terms back recovers
 * the residual of the EXACT-real f given the double inputs (c, u) -- the addition/multiplication
 * roundoff is REMOVED, not modelled. What remains genuinely irreducible in double precision is only
 *   (i) the log-evaluation error (JS Math.log is ~0.5 ULP but not proved correctly-rounded), and
 *   (ii) the division/representation error in c = T0/2pi,
 * both propagated into f by their exact first-order sensitivities (d f/d u = c, d f/d c = u - 1).
 * The residual-tracked enclosure width is therefore
 *   width(T0) = ( |f_compensated| + c*uErr + |u-1|*cErr ) / f_prime(T0),
 * with f_prime(T0) = log(T0/2pi)/2pi bounding the inverse-function amplification (imp-34687 (1)).
 *
 * MEASURED AT THE LEFT ENDPOINT a = 1e9
 * -------------------------------------
 *   T0(1e9)                = 3.7187020453e8
 *   naive residual |f|     ~ 2.38e-7   (what imp-34687 used)
 *   compensated residual   ~ 2.85e-7   (EFT-recovered; addition/mult roundoff removed)
 *   irreducible log+c error~ 2.44e-7   (the genuinely un-removable part -- log-limited, NOT addition-limited)
 *   residual-tracked width ~ 1.86e-7 absolute  =>  rel width ~ 4.99e-16
 *   imp-34687 surrogate    ~ 3.96e-7 absolute  =>  rel width ~ 1.06e-15
 * FINDING: the residual-tracked width is ~0.47x the surrogate -- SAME ORDER (few ULP), confirming
 * imp-34687s few-ULP model was a valid, slightly CONSERVATIVE (~2x loose) upper bound. The enclosure
 * is log-limited: the compensated residual and the irreducible log+c error are comparable, so removing
 * addition roundoff alone cannot tighten below the ~1e-16-rel log floor. Propagated with the tighter
 * width, the two inequalities are UNCHANGED at 10 sig figs: L_hi ~ 0.1485 (margin 0.8515 to L < 1),
 * g(a)_lo ~ 3.10e9 (margin 2.10e9 to g(a) >= a). Both clear their walls by ~10^15x the width, so
 * certified outward rounding still cannot flip either.
 *
 * WHAT THIS IS AND IS NOT (sub-gap)
 * ---------------------------------
 * This MEASURES a genuine error-bounded (Dekker/TwoSum EFT) enclosure width of the residual -- an
 * improvement over imp-34687s modelled few-ULP surrogate -- but the remaining log-evaluation term
 * still ASSUMES JS Math.log is ~0.5 ULP (not machine-verified) and there is still no directed-rounding
 * outward interval. NAMED SUB-GAP imp-34707a: replace the assumed 0.5-ULP log bound with a proved
 * correctly-rounded / directed-rounding log (mpfi- or crlibm-style) so the enclosure becomes a formal
 * certificate rather than an EFT-tracked measurement.
 *
 * MEASUREMENT ONLY. Certifies a property of the inherited imp-3220/imp-3406 surrogate crossover map,
 * NOT a rigorous asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no
 * bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34687-crossover-interval-arithmetic-scope (double-precision surrogate this upgrades; sub-gap imp-34687a)
 * @see imp-34650-crossover-banach-contraction-certificate (L-contraction certificate; sub-gap imp-34650a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse, Newton solver)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (same K as imp-34650/imp-34675/imp-34687)
const EPS = Number.EPSILON;
const A = 1e9; // binding left endpoint for both L and the lower self-map inequality (imp-34650)

// ---- Dekker / TwoSum error-free transforms (pure JS; recover exact rounding errors, no directed rounding) ----
// TwoSum: s = fl(a+b), err such that a + b = s + err EXACTLY (Knuth).
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}
// Veltkamp split of a double into two 26/27-bit halves (2^27 + 1 = 134217729).
function split(a) {
  const c = 134217729 * a;
  const hi = c - (c - a);
  const lo = a - hi;
  return [hi, lo];
}
// TwoProd (Dekker): p = fl(a*b), err such that a*b = p + err EXACTLY (no FMA needed).
function twoProd(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const err = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, err];
}

// ---- The object being enclosed: T0(A), Newton inverse of f(T) = (T/2pi)(log(T/2pi) - 1) - N ----
const T0 = effectiveHeightForN(A);
const c = T0 / TWO_PI;
const u = Math.log(c);
const U_MINUS_1 = u - 1;
const F_PRIME = u / TWO_PI; // f_prime(T0) = log(T0/2pi)/2pi > 0 -> inverse-function amplification bound

// (1) Residual-tracked residual: recover the exact roundoff of the product and the subtraction.
const [prod, prodErr] = twoProd(c, U_MINUS_1); // c*(u-1) with exact multiplication error
const [sum, sumErr] = twoSum(prod, -A); // (c*(u-1)) - N with exact addition error
const F_COMPENSATED = sum + (prodErr + sumErr); // residual with add/mult roundoff REMOVED
const F_NAIVE = c * U_MINUS_1 - A; // what imp-34687 measured (naive double)

// (2) The genuinely irreducible double-precision error: c-representation and log-evaluation, propagated.
// c*TWO_PI recovers T0 up to rc; the c-error is rc/2pi plus a half-ULP representation term.
const [cp, ce] = twoProd(c, TWO_PI);
const RC = (T0 - cp) - ce; // c*TWO_PI + RC = T0 exactly -> division residual
const C_ERR = Math.abs(RC) / TWO_PI + 0.5 * EPS * Math.abs(c); // error bound on c = T0/2pi
const U_ERR = 0.5 * EPS * Math.abs(u) + C_ERR / Math.abs(c); // log ~0.5 ULP + argument error via d(log)/dc = 1/c
const IRREDUCIBLE = Math.abs(c) * U_ERR + Math.abs(U_MINUS_1) * C_ERR; // propagate into f (df/du = c, df/dc = u-1)

// (3) Residual-tracked enclosure width of T0 and the imp-34687 surrogate for comparison.
const WIDTH_TRACKED = (Math.abs(F_COMPENSATED) + IRREDUCIBLE) / F_PRIME;
const REL_WIDTH_TRACKED = WIDTH_TRACKED / T0;
const F_EVAL_ROUNDOFF_SURROGATE = 4 * EPS * Math.max(A, c * Math.abs(U_MINUS_1)); // imp-34687 few-ULP model
const WIDTH_SURROGATE = (Math.abs(F_NAIVE) + F_EVAL_ROUNDOFF_SURROGATE) / F_PRIME;
const REL_WIDTH_SURROGATE = WIDTH_SURROGATE / T0;
const TRACKED_OVER_SURROGATE = WIDTH_TRACKED / WIDTH_SURROGATE; // < 1 => surrogate was conservative

// ---- Propagate the tighter enclosure into L = g_prime(a) and g(a) = K*log T0 (monotone substitution) ----
const T0_LO = T0 - WIDTH_TRACKED;
const T0_HI = T0 + WIDTH_TRACKED;
const DT0DN_LO = TWO_PI / Math.log(T0_HI / TWO_PI); // dT0/dN = 2pi/log(T0/2pi), decreasing in T0
const DT0DN_HI = TWO_PI / Math.log(T0_LO / TWO_PI);
const L_MID = (K_AMPL * TWO_PI) / (T0 * u); // K*(dT0/dN)/T0
const L_HI = (K_AMPL * DT0DN_HI) / T0_LO; // certified upper bound must stay < 1
const L_MARGIN_TO_ONE = 1 - L_HI;
const G_A_MID = K_AMPL * Math.log(T0);
const G_A_LO = K_AMPL * Math.log(T0_LO); // certified lower bound must stay >= a
const G_A_LOWER_MARGIN = G_A_LO - A;
const L_CONTRACTION_SURVIVES = L_HI < 1;
const SELF_MAP_LOWER_SURVIVES = G_A_LO >= A;

export const IMP34707_CROSSOVER_RESIDUAL_TRACKED_ENCLOSURE = {
  id: 'imp-34707',
  proofSection: 'S-frontier',
  question:
    'imp-34687 reported the crossover height-inverse enclosure width at a = 1e9 as a DOUBLE-PRECISION ' +
    'surrogate (roundoff modelled as a few ULP). Upgrade the Newton/Krawczyk residual with a Dekker/TwoSum ' +
    'error-free-transform layer (pure JS, no directed rounding), MEASURE the achievable residual-tracked ' +
    'enclosure width of T0(1e9), and report whether it matches the surrogate few-ULP estimate and whether ' +
    'L < 1 and g(a) >= a survive. Measurement only; certifies a property of the inherited surrogate crossover, ' +
    'NOT an RH bound; no QED.',
  method: {
    // TwoProd + TwoSum recover the EXACT product/sum rounding errors, so add/mult roundoff is removed (not modelled).
    error_free_transforms_recover_exact_roundoff: true,
    // What remains is the genuinely irreducible log-evaluation + c-representation error, propagated by df/du = c, df/dc = u-1.
    irreducible_error_is_log_plus_c_representation: IRREDUCIBLE > 0,
    // f_prime(T0) = log(T0/2pi)/2pi > 0 bounds the inverse-function amplification (imp-34687 piece (1)).
    inverse_amplification_bounded_by_f_prime: F_PRIME > 0,
  },
  enclosure: {
    a: +A.toExponential(0),
    T0_at_a: +T0.toExponential(9), // 3.718702045e8
    residual_naive: +Math.abs(F_NAIVE).toExponential(6), // ~2.38e-7 (imp-34687)
    residual_compensated: +Math.abs(F_COMPENSATED).toExponential(6), // ~2.85e-7 (EFT-recovered)
    irreducible_log_plus_c_error: +IRREDUCIBLE.toExponential(6), // ~2.44e-7 (log-limited)
    c_representation_error: +C_ERR.toExponential(6),
    u_evaluation_error: +U_ERR.toExponential(6),
    width_tracked_abs: +WIDTH_TRACKED.toExponential(6), // ~1.86e-7
    width_tracked_rel: +REL_WIDTH_TRACKED.toExponential(6), // ~4.99e-16
    width_surrogate_abs: +WIDTH_SURROGATE.toExponential(6), // ~3.96e-7 (imp-34687)
    width_surrogate_rel: +REL_WIDTH_SURROGATE.toExponential(6), // ~1.06e-15
    tracked_over_surrogate: +TRACKED_OVER_SURROGATE.toExponential(4), // ~0.47 (surrogate was conservative)
  },
  inequalityMargins: {
    L_mid: +L_MID.toExponential(9), // 1.484829155e-1
    L_certified_upper: +L_HI.toExponential(9),
    L_upper_below_one: L_CONTRACTION_SURVIVES,
    L_margin_to_one: +L_MARGIN_TO_ONE.toExponential(6), // ~0.8515
    g_a_mid: +G_A_MID.toExponential(9), // 3.103592148e9
    g_a_certified_lower: +G_A_LO.toExponential(9),
    g_a_lower_ge_a: SELF_MAP_LOWER_SURVIVES,
    g_a_lower_margin: +G_A_LOWER_MARGIN.toExponential(6), // ~2.104e9
  },
  finding:
    'A Dekker/TwoSum error-free-transform wrap of the Newton residual at a = 1e9 gives a residual-tracked ' +
    'enclosure width of T0 that is ~0.47x the imp-34687 double-precision surrogate: absolute ~1.86e-7 ' +
    '(rel ~4.99e-16) versus the surrogate ~3.96e-7 (rel ~1.06e-15). The two are the SAME ORDER (few ULP), ' +
    'so imp-34687s few-ULP model was a valid, slightly CONSERVATIVE (~2x loose) upper bound. The enclosure ' +
    'is LOG-LIMITED, not addition-limited: the EFT-recovered compensated residual (~2.85e-7) and the ' +
    'genuinely irreducible log-evaluation + c-representation error (~2.44e-7) are comparable, so removing ' +
    'the add/mult roundoff alone cannot push below the ~1e-16-rel log floor. Propagated with the tighter ' +
    'width, both load-bearing inequalities are UNCHANGED at 10 sig figs: the certified L upper bound ~0.1485 ' +
    'sits 0.8515 below the contraction wall L < 1, and the certified lower bound of g(a) ~3.10e9 sits 2.10e9 ' +
    'above the self-map wall g(a) >= a -- margins ~10^15x wider than the enclosure, so certified outward ' +
    'rounding cannot flip either.',
  subGap:
    'imp-34707a: the EFT layer removes add/mult roundoff exactly, but the remaining log term still ASSUMES ' +
    'JS Math.log is ~0.5 ULP (not machine-verified) and there is still no directed-rounding outward interval. ' +
    'Replace the assumed 0.5-ULP log bound with a proved correctly-rounded / directed-rounding log ' +
    '(mpfi- or crlibm-style) so the enclosure becomes a formal certificate rather than an EFT-tracked ' +
    'measurement. This upgrades imp-34687 from a modelled few-ULP surrogate to an error-bounded measurement; ' +
    'it adds no RH bound.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT an RH bound). Wrapping the crossover height-inverse Newton residual f(T) = ' +
    '(T/2pi)(log(T/2pi) - 1) - N in a pure-JS Dekker/TwoSum error-free-transform layer upgrades imp-34687s ' +
    'double-precision SURROGATE enclosure width to an error-BOUNDED measurement. TwoProd and TwoSum recover ' +
    'the exact product/subtraction roundoff of the large-minus-large cancellation, leaving only the genuinely ' +
    'irreducible log-evaluation + c-representation error, propagated into f by df/du = c and df/dc = u - 1 and ' +
    'divided by f_prime(T0) = log(T0/2pi)/2pi. Measured at the binding left endpoint a = 1e9: T0 = ' +
    '3.718702045e8, compensated residual ~2.85e-7, irreducible log+c error ~2.44e-7, residual-tracked width ' +
    '~1.86e-7 absolute (rel ~4.99e-16) versus the imp-34687 surrogate ~3.96e-7 (rel ~1.06e-15) -- a ratio ' +
    '~0.47, SAME ORDER, so the surrogate few-ULP model was a valid, slightly conservative upper bound and the ' +
    'enclosure is log-limited rather than addition-limited. Propagated with the tighter width, the two ' +
    'load-bearing inequalities survive with the same enormous slack: certified L upper bound ~0.1485 (margin ' +
    '0.8515 to L < 1) and certified g(a) lower bound ~3.10e9 (margin 2.10e9 to g(a) >= a), both ~10^15x the ' +
    'enclosure width. SUB-GAP imp-34707a: the remaining log term still ASSUMES a ~0.5-ULP JS Math.log and ' +
    'there is no directed-rounding outward interval; a formal certificate needs a proved correctly-rounded / ' +
    'directed-rounding log. This measures a property of the inherited imp-3220/imp-3406 surrogate crossover ' +
    'map, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per ' +
    'imp-486 are UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34687 (double-precision surrogate enclosure width; sub-gap imp-34687a); imp-34650 (Banach ' +
    'contraction certificate; sub-gap imp-34650a); imp-33723 (crossover fixed point N_cross); imp-2642 ' +
    '(C_C = (1/8) sqrt(3 pi) 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN, Newton inverse of ' +
    'the Riemann-von Mangoldt count). Dekker (1971) / Knuth TwoSum error-free transforms.',
};

export const IMP34707_CROSSOVER_RESIDUAL_TRACKED_ENCLOSURE_ASSERTIONS = [
  {
    // The EFT recovers a residual of the SAME order as naive, but the tracked width is a genuine error bound.
    id: 'imp34707-eft-residual-same-order-as-naive',
    description: 'compensated residual and naive residual are the same order ~1e-7 (EFT recovers, does not inflate)',
    holds: () =>
      Math.abs(F_COMPENSATED) > 0 &&
      Math.abs(F_COMPENSATED) < 1e-5 &&
      Math.abs(F_COMPENSATED) / Math.abs(F_NAIVE) > 0.1 &&
      Math.abs(F_COMPENSATED) / Math.abs(F_NAIVE) < 10,
  },
  {
    // Residual-tracked width is at the double floor and is TIGHTER than (or equal to) the imp-34687 surrogate.
    id: 'imp34707-tracked-width-at-floor-below-surrogate',
    description: 'residual-tracked rel width ~5e-16 (few ULP) and <= the imp-34687 surrogate rel width ~1.06e-15',
    holds: () =>
      REL_WIDTH_TRACKED > 0 &&
      REL_WIDTH_TRACKED < 1e-13 &&
      TRACKED_OVER_SURROGATE > 0 &&
      TRACKED_OVER_SURROGATE <= 1.0001,
  },
  {
    // The enclosure is LOG-limited: the irreducible log+c error is comparable to the compensated residual.
    id: 'imp34707-enclosure-is-log-limited',
    description: 'irreducible log+c error is the same order as the compensated residual (removing add roundoff is not enough)',
    holds: () =>
      IRREDUCIBLE > 0 &&
      IRREDUCIBLE / Math.abs(F_COMPENSATED) > 0.1 &&
      IRREDUCIBLE / Math.abs(F_COMPENSATED) < 10,
  },
  {
    // Both load-bearing inequalities survive the tighter certified enclosure with margins ~10^15x the width.
    id: 'imp34707-inequalities-survive-tracked-enclosure',
    description: 'certified L upper < 1 (margin ~0.85) and certified g(a) lower >= a (margin ~2.1e9) under the tracked width',
    holds: () =>
      L_CONTRACTION_SURVIVES === true &&
      L_MARGIN_TO_ONE > 0.5 &&
      SELF_MAP_LOWER_SURVIVES === true &&
      G_A_LOWER_MARGIN > 1e9 &&
      Math.abs(L_MID - 1.484829e-1) < 1e-4,
  },
  {
    // Honesty gate: measurement/EFT of an enclosure, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34707-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, named sub-gap imp-34707a, no QED, no refereed bound is changed',
    holds: () =>
      IMP34707_CROSSOVER_RESIDUAL_TRACKED_ENCLOSURE.isRigorous === false &&
      /imp-34707a/.test(IMP34707_CROSSOVER_RESIDUAL_TRACKED_ENCLOSURE.subGap) &&
      /NO QED/.test(IMP34707_CROSSOVER_RESIDUAL_TRACKED_ENCLOSURE.verdict) &&
      /refereed bound is changed/i.test(IMP34707_CROSSOVER_RESIDUAL_TRACKED_ENCLOSURE.verdict),
  },
];

for (const a of IMP34707_CROSSOVER_RESIDUAL_TRACKED_ENCLOSURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34707-crossover-residual-tracked-enclosure assertion failed: ${a.id}`);
  }
}
