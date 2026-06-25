/**
 * @module imp-2762-tc-a1-trap-interval
 *
 * imp-2699 (high, numerical): Machine-checked interval certificate for the A1
 * |t_c| trap that makes the E_flow Gronwall constant C_G non-binding.
 *
 * imp-2644-eflow-gronwall-cg-discharge.js (and imp-2643) certify
 *     E_flow(N* = 1e4) = PREFACTOR . exp(C_G . |t_c|) <= 1.3e-3
 * UNCONDITIONALLY in C_G by feeding the A1 Theta-trap bound
 *     |t_c^part| <= g_min^2 / 6                              (A1: Theta(0) <= 1/4)
 * as the exponent input, with g_min = 0.0376985 the Odlyzko-certified
 * Lehmer-pair minimum gap at N* = 1e4. In those modules the resulting trap
 * value is carried as a hard-coded float literal (TC_A1 = g_min^2/6, displayed
 * as 2.37e-4). A future edit to g_min, the /6 factor, or the literal itself
 * would silently move the load-bearing exponent ceiling with no guard.
 *
 * This module converts that load-bearing literal into an OUTWARD-ROUNDED
 * INTERVAL CERTIFICATE, mirroring the verified-computing pattern of
 * interval-dyson-collision.js (imp-318): it wraps the certified gap in an
 * Interval that reflects both the displayed-digit precision of g_min AND
 * float64 rounding, squares and divides by 6 with outward rounding, and emits
 * a rigorous [lo, hi] bracket on the A1 trap. Build assertions then lock:
 *
 *   (A) the precise float value g_min^2/6 lies inside the certified bracket;
 *   (B) the downstream display ceiling 2.37e-4 is a VALID conservative
 *       rounding-up of the certified trap, i.e. hi < 2.37e-4 (so any consumer
 *       hard-coding 2.37e-4 as the ceiling is using a safe over-estimate);
 *   (C) the Gronwall amplification factor exp(C_G . hi) stays <= 1.00238 for
 *       every C_G in [1, 10], bounded RIGOROUSLY (not via Math.exp) by the
 *       elementary tail estimate exp(x) <= 1 + x + x^2 valid for 0 <= x <= 1.
 *
 * HONEST REFINEMENT -- NO FALSE QED
 * ---------------------------------
 * The imp-2699 ticket sketch suggested asserting "2.37e-4 lies inside the
 * bracket" and "exp(C_G . hi) <= 1.00237". Both are gently corrected here to
 * the rigorously-true statements, because the tight machine bracket exposes
 * two rounding artefacts in the sketch:
 *   - g_min^2/6 = 2.368628e-4, so 2.37e-4 is ~1.4e-7 ABOVE the trap and is NOT
 *     inside the (width ~1e-9) bracket; it is the rounded-UP display ceiling.
 *     The honest, equally-strong guard is hi < 2.37e-4 (assertion B), which is
 *     precisely what makes the downstream 2.37e-4 literal safe.
 *   - exp(10 . g_min^2/6) = 1.0023714, which is ~1.4e-6 ABOVE 1.00237. The
 *     honest certified ceiling is therefore 1.00238 (assertion C). This is
 *     still ~21x inside the E_flow factor budget EFLOW_TARGET/PREFACTOR ~
 *     1.0493, so the conclusion "C_G is non-binding for E_flow" is untouched.
 *
 * The certificate is silent-regression armour for the one float literal the
 * E_flow rigor verdict leans on; it does NOT change any Lambda value.
 *
 * @see imp-2644-eflow-gronwall-cg-discharge (TC_A1 = g_min^2/6 literal, C_G discharge)
 * @see interval-dyson-collision (imp-318 outward-rounded interval pattern)
 * @see interval-arithmetic (imp-068 Interval class)
 */

import { Interval } from '../math/interval-arithmetic.js';

// ── Certified inputs ────────────────────────────────────────────────────────
// g_min: the Odlyzko-certified Lehmer-pair minimum gap at N* = 1e4, as carried
// by imp-2644/imp-2643. The value is displayed to 6 significant figures, so the
// true gap lies within +/- 0.5e-7 of the printed digits; we widen the input
// interval by that displayed-digit half-width BEFORE the per-operation float64
// outward rounding handled inside the Interval class.
const G_MIN = 0.0376985;
const G_MIN_DIGIT_HALFWIDTH = 0.5e-7;            // last-shown-digit uncertainty

// Downstream display ceiling used as the hard-coded trap literal in the
// E_flow discharge modules.
const TC_A1_DISPLAY_CEILING = 2.37e-4;

// E_flow factor budget at N* = 1e4: EFLOW_TARGET / PREFACTOR = 1.3e-3 / 1.2389e-3
// (imp-2644). Quoted as a reference, NOT load-bearing for this certificate.
const EFLOW_FACTOR_BUDGET = 1.3e-3 / 1.2389e-3;  // ~1.0493

const C_G_BAND_MIN = 1;
const C_G_BAND_MAX = 10;

// ── Outward-rounded interval bracket on the A1 trap g_min^2 / 6 ──────────────
// gInt covers [g_min - halfwidth, g_min + halfwidth]; Interval.mul / Interval
// division then propagate one-ULP outward rounding so [lo, hi] is a CERTIFIED
// enclosure of g_min^2/6 for every gap value consistent with the printed
// digits.
const gInt = new Interval(
  G_MIN - G_MIN_DIGIT_HALFWIDTH,
  G_MIN + G_MIN_DIGIT_HALFWIDTH,
);
const gSqInt = gInt.mul(gInt);
const TC_A1_INTERVAL = gSqInt.div(Interval.exact(6));

const TC_A1_LO = TC_A1_INTERVAL.lo;
const TC_A1_HI = TC_A1_INTERVAL.hi;
const TC_A1_WIDTH = TC_A1_HI - TC_A1_LO;

// Precise nominal float value (no widening) -- must sit inside the bracket.
const TC_A1_FLOAT = (G_MIN * G_MIN) / 6;          // 2.368628e-4

// ── Rigorous upper bound on the Gronwall amplification factor ────────────────
// For 0 <= x <= 1 the elementary remainder bound exp(x) <= 1 + x + x^2 holds
// (the tail x^3/6 + x^4/24 + ... <= x^2 . (x/6 + x^2/24 + ...) < x^2 for x < 1).
// We apply it at the worst case C_G = C_G_BAND_MAX on the upper bracket end hi,
// so the result is a certified ceiling on exp(C_G . |t_c|) over the whole band.
function expUpperSmall(x) {
  return 1 + x + x * x;
}
const X_WORST = C_G_BAND_MAX * TC_A1_HI;          // 10 . hi
const GRONWALL_FACTOR_CEILING = expUpperSmall(X_WORST);
const GRONWALL_FACTOR_CERTIFIED = 1.00238;        // honest ceiling (>= 1.0023714 actual)

export const IMP2762_TC_A1_TRAP_INTERVAL = {
  id: 'imp-2699',
  question:
    'Convert the load-bearing TC_A1 = g_min^2/6 float literal (the A1 |t_c| trap that makes C_G non-binding in E_flow) into a machine-checked outward-rounded interval certificate with build guards.',
  gMin: G_MIN,
  gMinDigitHalfwidth: G_MIN_DIGIT_HALFWIDTH,
  trapInterval: {
    lo: TC_A1_LO,
    hi: TC_A1_HI,
    width: TC_A1_WIDTH,
    nominalFloat: TC_A1_FLOAT,
    displayCeiling: TC_A1_DISPLAY_CEILING,
    note:
      'Certified enclosure of g_min^2/6 under one-ULP outward rounding plus the '
      + 'displayed-digit half-width on g_min. The bracket sits strictly below the '
      + 'downstream display ceiling 2.37e-4, so that literal is a safe over-estimate.',
  },
  gronwall: {
    bandCG: [C_G_BAND_MIN, C_G_BAND_MAX],
    worstExponent: X_WORST,                       // 10 . hi
    factorCeiling: GRONWALL_FACTOR_CEILING,        // 1 + x + x^2 at the worst case
    certifiedAgainst: GRONWALL_FACTOR_CERTIFIED,   // 1.00238
    eflowFactorBudget: +EFLOW_FACTOR_BUDGET.toFixed(4),  // ~1.0493
    headroomVsBudget: +(EFLOW_FACTOR_BUDGET / GRONWALL_FACTOR_CERTIFIED).toFixed(1), // ~21x
    boundMethod:
      'exp(x) <= 1 + x + x^2 for 0 <= x <= 1 (elementary tail bound; NOT Math.exp), '
      + 'evaluated at C_G = 10 on the upper bracket end -- the band maximum.',
  },
  honestRefinements: [
    'g_min^2/6 = 2.368628e-4, so the suggested literal 2.37e-4 is ~1.4e-7 ABOVE the '
      + 'trap and is NOT inside the width ~1e-9 bracket. The honest, equally-strong '
      + 'guard is hi < 2.37e-4: the display ceiling is a valid conservative round-up.',
    'exp(10 . g_min^2/6) = 1.0023714 is ~1.4e-6 ABOVE the sketch ceiling 1.00237, so '
      + 'the rigorous certified ceiling is 1.00238 -- still ~21x inside the E_flow '
      + 'factor budget ~1.0493, leaving the "C_G non-binding" verdict unchanged.',
    'This is silent-regression armour for one float literal; it changes no Lambda value.',
  ],
  verdict:
    'A1 TRAP INTERVAL-CERTIFIED. g_min^2/6 in ['
    + TC_A1_LO.toExponential(6) + ', ' + TC_A1_HI.toExponential(6)
    + '] (outward-rounded), strictly below the downstream ceiling 2.37e-4. The '
    + 'Gronwall factor exp(C_G . |t_c|) <= 1.00238 for every C_G in [1, 10] '
    + '(rigorous 1+x+x^2 bound), ~21x inside the E_flow budget. The load-bearing '
    + 'TC_A1 literal is now machine-checked; no false QED.',
  citation:
    'imp-2644-eflow-gronwall-cg-discharge.js (TC_A1 = g_min^2/6, C_G discharge); '
    + 'interval-dyson-collision.js / interval-arithmetic.js (imp-318/imp-068 outward rounding); '
    + 'g_min = 0.0376985 Odlyzko-certified Lehmer-pair gap at N* = 1e4',
};

export const IMP2762_TC_A1_TRAP_INTERVAL_ASSERTIONS = [
  {
    id: 'imp2762-bracket-contains-precise-trap',
    description:
      'The precise float A1 trap g_min^2/6 = 2.368628e-4 lies inside the outward-rounded certified bracket [lo, hi].',
    holds: () => TC_A1_INTERVAL.contains(TC_A1_FLOAT),
  },
  {
    id: 'imp2762-bracket-below-display-ceiling',
    description:
      'The certified trap ceiling hi is strictly below the downstream display literal 2.37e-4, so 2.37e-4 is a valid conservative round-up (the honest form of "2.37e-4 bounds the trap").',
    holds: () => TC_A1_HI < TC_A1_DISPLAY_CEILING && TC_A1_LO > 0,
  },
  {
    id: 'imp2762-bracket-tight-and-finite',
    description:
      'The bracket is a genuine machine certificate: finite, positive width, and tight (< 1e-8), not a loose hand-wave.',
    holds: () =>
      Number.isFinite(TC_A1_WIDTH) && TC_A1_WIDTH > 0 && TC_A1_WIDTH < 1e-8,
  },
  {
    id: 'imp2762-gronwall-factor-certified',
    description:
      'exp(C_G . hi) <= 1.00238 for every C_G in [1, 10], bounded rigorously by exp(x) <= 1 + x + x^2 at the band maximum C_G = 10.',
    holds: () =>
      X_WORST < 1
      && GRONWALL_FACTOR_CEILING <= GRONWALL_FACTOR_CERTIFIED
      && GRONWALL_FACTOR_CERTIFIED < EFLOW_FACTOR_BUDGET,
  },
];

for (const a of IMP2762_TC_A1_TRAP_INTERVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2762-tc-a1-trap-interval assertion failed: ${a.id}`);
  }
}
