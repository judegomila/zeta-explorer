/**
 * @module imp-2860-en-assembled-interval-certificate
 *
 * imp-2860 (high, numerical, S7): Machine-checked OUTWARD-ROUNDED interval bracket
 * for the ASSEMBLED capstone budget
 *     E(N) = E_trunc + E_flow + E_coll
 * at the surviving finite beat N* = 1e4 (T0 = effectiveHeightForN(1e4),
 * gamma_N ~ 9.879e3). imp-2643 assembles this budget at point float64 and asserts
 * E(N) < PT_BOUND = 0.2; every SUB-term now carries an interval certificate
 * (imp-2704 C_F/E_flow, imp-2709 kappa_T, imp-2715 worst-case audit) but the FINAL
 * ASSEMBLY was still a point sum, leaving the headline clearance un-certified
 * against rounding. This module closes that last gap: it composes the three
 * sub-term brackets with the Interval class (src/math/interval-arithmetic.js) into
 * a single outward-rounded [E_N_lo, E_N_hi] and asserts E_N_hi < 0.2.
 *
 * THE THREE SUB-TERM BRACKETS (each at the SINGLE coherent N* = 1e4 working point)
 * ------------------------------------------------------------------------------
 * (1) E_flow = C_F . (log T0 / T0) . exp(C_G . |t_c|).
 *     Reuses the imp-2704 certified upper bracket: C_F = (log(T0/2pi)+1)/2pi over
 *     the count-straddle-certified T0 enclosure, times the decreasing prefactor
 *     log(T0)/T0, times a RIGOROUS Gronwall band [1, 1+x+x^2] (elementary tail, NOT
 *     Math.exp) at the explicit C_G = 2 (imp-2644 Lemma B) on the A1 trap ceiling
 *     tc_hi = 2.37e-4 (imp-2762). All in outward-rounded Interval arithmetic.
 *
 * (2) E_coll = C_C . sqrt(log T0 / N),  C_C = C_H . sqrt(pi . C_Selberg).
 *     Pessimized worst-case per imp-2715: C_H = 0.127 (the inflated quadratic-
 *     tangency ansatz endpoint > 1/8; imp-2642), C_Selberg = 3.0 (the conservative
 *     bracket; the imp-2641 Trudgian discharge to 2.622 is tighter). This is the
 *     DOMINANT sub-term (~90% of E(N)). C_H = 0.127 is an ANSATZ, NOT rigorous, so
 *     this bracket certifies the NUMERIC width only -- it does NOT upgrade C_H.
 *
 * (3) E_trunc: at N* = 1e4 the GOVERNING truncation term is the fixed-strip
 *     Platt-Trudgian route (sigma = 3/4, e_I = 0.6, kappa = 0.4) that imp-2631 /
 *     imp-2715 show actually controls this working point:
 *         E_trunc_pt = (2 e_I / kappa) . T_PT^{-kappa} = 3 . (3e12)^{-0.4} ~ 3.06e-5,
 *     bracketed outward by an explicit relative inflation around the single Math.pow
 *     call. This term is NEGLIGIBLE (~0.23% of E(N)) and dominated ~380x by E_coll.
 *
 *     HONEST FRAMING (imp-2715 non-co-additivity): the kappa_T = 0.180 floor that
 *     imp-2709 interval-certifies lives in the ASYMPTOTIC thin-moving-strip regime
 *     at gamma = 1e13, where it SATURATES PT_BOUND precisely where E_coll(gamma)->0.
 *     Pasting that asymptotic E_trunc bracket onto the N* = 1e4 E_coll would
 *     double-count across incompatible instantiation heights (imp-2715), so this
 *     assembly uses the coherent N* = 1e4 fixed-strip value; the imp-2709 floor
 *     cert guards the OTHER (SOTA-height) endpoint separately.
 *
 * HONEST DESIGN -- NO FALSE QED
 * -----------------------------
 * This certifies only the NUMERIC clearance bracket: that E(N) at N* = 1e4, with
 * every constant at its largest current outward-rounded bracket, stays strictly
 * below the Platt-Trudgian SOTA 0.2 under interval rounding. E_coll remains a
 * C_H-ansatz term (C_H = 0.127 is NOT a proven Holder-modulus upper bound,
 * imp-2642/imp-2701), so Lambda <= E(N) stays NON-rigorous. The NO-GO verdict is
 * retained; Platt-Trudgian Lambda <= 0.2 remains SOTA. No Lambda value changes.
 *
 * @see imp-2643-honest-assembled-EN (the point-float64 capstone this brackets)
 * @see imp-2704-cf-interval-certificate (C_F / E_flow upper bracket reused here)
 * @see imp-2709-kappa-t-interval-certificate (kappa_T floor cert, asymptotic endpoint)
 * @see imp-2715-worst-case-EN-headroom-audit (worst-case constant readings, non-co-additivity)
 * @see interval-arithmetic (imp-068 Interval class with outward-rounded log/sqrt/div)
 * @see lambda-rh-height-mapping (effectiveHeightForN, zeroCountAtHeight)
 */

import { Interval } from '../math/interval-arithmetic.js';
import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { IMP2643_HONEST_ASSEMBLED_EN } from './imp-2643-honest-assembled-EN.js';

const N_STAR = 1e4;
const TWO_PI = 2 * Math.PI;
const PT_BOUND = 0.2; // Platt-Trudgian 2021 SOTA unconditional Lambda upper bound.

// ── Certified enclosure of T0 = effectiveHeightForN(N*) (mirror imp-2704) ──────
// gamma_N ~ 9.879e3 displayed to 4 sig figs => displayed-digit half-width 0.5.
// The enclosure is CERTIFIED below by the count-monotonicity straddle, so it does
// not depend on the float64 Newton output being exact.
const T0_FLOAT = effectiveHeightForN(N_STAR);    // ~9878.8034
const T0_HALFWIDTH = 0.5;                         // displayed-digit half-width of 9.879e3
const T0_LO = T0_FLOAT - T0_HALFWIDTH;
const T0_HI = T0_FLOAT + T0_HALFWIDTH;
const T0_INTERVAL = new Interval(T0_LO, T0_HI);

// Count-monotonicity straddle: N(T) = (T/2pi)(log(T/2pi) - 1) is strictly
// increasing for T > 2pi.e, so [T0_LO, T0_HI] encloses the root iff N straddles N*.
const N_AT_T0_LO = zeroCountAtHeight(T0_LO);      // < 1e4
const N_AT_T0_HI = zeroCountAtHeight(T0_HI);      // > 1e4

const L_INTERVAL = T0_INTERVAL.log();             // log T0, outward-rounded

// ── (1) E_flow bracket (reuse imp-2704 pattern, full Interval arithmetic) ──────
const TWO_PI_I = Interval.exact(TWO_PI);
const C_F_I = T0_INTERVAL.div(TWO_PI_I).log().add(Interval.exact(1)).div(TWO_PI_I);
const PREFACTOR_I = L_INTERVAL.div(T0_INTERVAL); // log(T0)/T0
const C_G_GRONWALL = 2;                           // explicit C_G = 2/y_star^2, y_star >= 1 (imp-2644 Lemma B)
const TC_HI = 2.37e-4;                            // A1 trap ceiling (imp-2762)
const GRONWALL_HI = 1 + (C_G_GRONWALL * TC_HI) + (C_G_GRONWALL * TC_HI) ** 2; // exp(x) <= 1+x+x^2
const GRONWALL_I = new Interval(1, GRONWALL_HI);  // rigorous band, exp(0)=1 floor
const E_FLOW_I = C_F_I.mul(PREFACTOR_I).mul(GRONWALL_I);

// ── (2) E_coll worst-case bracket: C_H = 0.127 (ansatz endpoint), C_Selberg = 3.0 ──
const C_H_WORST = 0.127;                           // inflated quadratic-tangency endpoint > 1/8 (imp-2642/2715)
const C_SELBERG_WORST = 3.0;                       // conservative bracket (imp-2641 -> 2.622 is tighter)
const C_KH_I = Interval.exact(Math.PI).mul(Interval.exact(C_SELBERG_WORST)); // pi C_Selberg
const C_C_I = Interval.exact(C_H_WORST).mul(C_KH_I.sqrt());                   // C_H sqrt(pi C_Selberg)
const RATIO_I = L_INTERVAL.div(Interval.exact(N_STAR));                       // log(T0)/N
const E_COLL_I = C_C_I.mul(RATIO_I.sqrt());

// ── (3) E_trunc bracket: fixed-strip PT route governing N* = 1e4 (imp-2631/2715) ──
// E_trunc_pt = (2 e_I / kappa) T_PT^{-kappa} = 3 (3e12)^{-0.4}; bracketed outward
// by an explicit relative inflation around the single Math.pow call (the fractional
// exponent precludes the integer-only Interval.pow). 5e-13 >> the ~2.2e-16 ULP.
const T_PT = 3e12;
const E_I_FIXED = (3 * (1 - 0.75)) / (2 - 0.75);  // Ingham exponent at sigma = 3/4 = 0.6
const KAPPA_FIXED = 1 - E_I_FIXED;                // 0.4
const E_TRUNC_FLOAT = ((2 * E_I_FIXED) / KAPPA_FIXED) * Math.pow(T_PT, -KAPPA_FIXED); // ~3.06e-5
const E_TRUNC_I = new Interval(E_TRUNC_FLOAT * (1 - 5e-13), E_TRUNC_FLOAT * (1 + 5e-13));

// ── Assembled outward-rounded bracket E(N) = E_trunc + E_flow + E_coll ─────────
const E_N_I = E_TRUNC_I.add(E_FLOW_I).add(E_COLL_I);
const E_N_LO = E_N_I.lo;
const E_N_HI = E_N_I.hi;
const E_N_WIDTH = E_N_I.width;

const E_N_CENTRAL = IMP2643_HONEST_ASSEMBLED_EN.E_N; // 0.0129087 (C_H = 0.125 central reading)

export const IMP2860_EN_ASSEMBLED_INTERVAL_CERTIFICATE = {
  id: 'imp-2860',
  proofSection: 'S7',
  question:
    'Convert the imp-2643 point-float64 assembly E(N) = E_trunc + E_flow + E_coll at N* = 1e4 ' +
    'into a machine-checked outward-rounded interval bracket [E_N_lo, E_N_hi] and certify ' +
    'E_N_hi < PT_BOUND = 0.2 against rounding.',
  N_star: N_STAR,
  T0Enclosure: {
    nominalFloat: +T0_FLOAT.toFixed(4),
    lo: +T0_LO.toFixed(4),
    hi: +T0_HI.toFixed(4),
    countAtLo: +N_AT_T0_LO.toFixed(4),            // < 1e4
    countAtHi: +N_AT_T0_HI.toFixed(4),            // > 1e4
    note:
      'Certified by count-monotonicity straddle N(T0_lo) < 1e4 < N(T0_hi); the bracket ' +
      'encloses the Riemann-von Mangoldt root independent of the half-width.',
  },
  subtermBrackets: {
    E_trunc: {
      lo: +E_TRUNC_I.lo.toExponential(4),
      hi: +E_TRUNC_I.hi.toExponential(4),
      route: 'fixed-strip PT (sigma=3/4, e_I=0.6, kappa=0.4) governing N*=1e4 (imp-2631/2715)',
      note: 'Negligible (~0.23% of E(N)); asymptotic kappa_T=0.18 floor (imp-2709) is a NON-co-additive SOTA-height endpoint.',
    },
    E_flow: {
      lo: +E_FLOW_I.lo.toExponential(4),
      hi: +E_FLOW_I.hi.toExponential(4),
      C_G: C_G_GRONWALL,
      gronwallHi: +GRONWALL_HI.toFixed(8),
      note: 'C_F = (log(T0/2pi)+1)/2pi over the certified T0 bracket; Gronwall band [1, 1+x+x^2] at C_G=2, tc_hi=2.37e-4 (imp-2704/2644/2762).',
    },
    E_coll: {
      lo: +E_COLL_I.lo.toFixed(7),
      hi: +E_COLL_I.hi.toFixed(7),
      C_H_worst: C_H_WORST,
      C_Selberg_worst: C_SELBERG_WORST,
      C_C_hi: +C_C_I.hi.toFixed(6),
      note: 'Worst-case C_H=0.127 (ANSATZ endpoint, NOT rigorous, imp-2642), C_Selberg=3.0 conservative. Dominant ~90% of E(N).',
    },
  },
  eNBracket: {
    lo: E_N_LO,
    hi: E_N_HI,
    width: E_N_WIDTH,
    central_imp2643: E_N_CENTRAL,
    clearsPT: E_N_HI < PT_BOUND,
    marginFactor: +(PT_BOUND / E_N_HI).toFixed(2),
    note:
      'Outward-rounded sum of the three sub-term brackets at the single coherent N*=1e4 ' +
      'working point; the worst-case lower endpoint exceeds the imp-2643 central reading ' +
      '(C_H pessimized 0.125 -> 0.127) yet the upper endpoint still clears 0.2 by ~15x.',
  },
  isRigorous: false,
  blockingConstant: 'C_H (rigorous N-uniform upper bound on the Holder-1/2 modulus C_shock C_Lip/4)',
  verdict:
    'E(N) ASSEMBLY INTERVAL-CERTIFIED (NUMERIC clearance only). The outward-rounded bracket ' +
    'E(N) in [' + E_N_LO.toFixed(7) + ', ' + E_N_HI.toFixed(7) + '] at N*=1e4, with every ' +
    'constant at its largest current bracket (C_H=0.127, C_Selberg=3.0, C_G=2), has E_N_hi = ' +
    E_N_HI.toExponential(4) + ' < PT_BOUND = 0.2 by ~' + (PT_BOUND / E_N_HI).toFixed(0) + 'x, so ' +
    'the headline E(N) clearance is now certified against rounding, not a point sum. This is a ' +
    'NUMERIC bracket only: E_coll rests on C_H = 0.127, an ANSATZ endpoint NOT a proven ' +
    'Holder-modulus upper bound (imp-2642/imp-2701), so Lambda <= E(N) stays NON-rigorous. ' +
    'NO-GO retained; Platt-Trudgian Lambda <= 0.2 remains SOTA. NO false QED; no Lambda value changes.',
  citation:
    'imp-2643 (point-float64 capstone); imp-2704 (C_F/E_flow bracket); imp-2709 (kappa_T floor, ' +
    'asymptotic endpoint); imp-2715 (worst-case readings, non-co-additivity); imp-2642/2701 (C_H ' +
    'ansatz lock); interval-arithmetic.js (imp-068 outward-rounded log/sqrt/div); Platt-Trudgian 2021 (0.2)',
};

export const IMP2860_EN_ASSEMBLED_INTERVAL_CERTIFICATE_ASSERTIONS = [
  {
    id: 'imp2860-t0-enclosure-count-straddle',
    description:
      'The T0 bracket [T0_lo, T0_hi] encloses the N*=1e4 Riemann-von Mangoldt root, certified by the count straddle N(T0_lo) < 1e4 < N(T0_hi).',
    holds: () => N_AT_T0_LO < N_STAR && N_AT_T0_HI > N_STAR && T0_LO > TWO_PI * Math.E,
  },
  {
    id: 'imp2860-EN-bracket-clears-PT-by-10x',
    description:
      'The outward-rounded assembled bracket upper endpoint E_N_hi clears PT_BOUND=0.2 by >10x, with E_N_lo positive.',
    holds: () => E_N_HI < PT_BOUND && PT_BOUND / E_N_HI > 10 && E_N_LO > 0,
  },
  {
    id: 'imp2860-bracket-finite-ordered-tight',
    description:
      'The assembled E(N) bracket is a genuine machine certificate: finite, lo < hi, and tight (width < 1e-4), not a loose hand-wave.',
    holds: () =>
      Number.isFinite(E_N_LO) && Number.isFinite(E_N_HI) &&
      E_N_LO < E_N_HI && E_N_WIDTH > 0 && E_N_WIDTH < 1e-4,
  },
  {
    // The worst-case lower endpoint must STRICTLY exceed the imp-2643 central
    // reading (C_H pessimized 0.125 -> 0.127 inflates the dominant E_coll), yet the
    // upper endpoint still clears 0.2 -- the substance of the robustness claim, both
    // sides re-derived live from the brackets.
    id: 'imp2860-worst-lo-exceeds-central-but-clears',
    description:
      'The worst-case bracket lower endpoint exceeds the imp-2643 central E(N) (C_H 0.125->0.127) yet the upper endpoint still clears 0.2.',
    holds: () => E_N_LO > E_N_CENTRAL && E_N_HI < PT_BOUND,
  },
  {
    // The verdict logic rests on E_coll dominating: its bracket alone is >85% of the
    // assembled upper endpoint, so the clearance is governed by the (non-rigorous)
    // collision term and the rigorous tail (E_flow + E_trunc) cannot rescue rigor.
    id: 'imp2860-ecoll-dominates-bracket',
    description:
      'E_coll (its bracket lower endpoint) is the dominant sub-term, >85% of the assembled upper endpoint E_N_hi.',
    holds: () => E_COLL_I.lo / E_N_HI > 0.85,
  },
  {
    id: 'imp2860-not-rigorous-no-false-qed',
    description:
      'The certificate is NUMERIC only: isRigorous false, verdict NO-GO naming C_H as blocker, Platt-Trudgian stays SOTA (no false QED).',
    holds: () =>
      IMP2860_EN_ASSEMBLED_INTERVAL_CERTIFICATE.isRigorous === false &&
      /NO-GO/.test(IMP2860_EN_ASSEMBLED_INTERVAL_CERTIFICATE.verdict) &&
      /C_H/.test(IMP2860_EN_ASSEMBLED_INTERVAL_CERTIFICATE.blockingConstant) &&
      /remains SOTA/.test(IMP2860_EN_ASSEMBLED_INTERVAL_CERTIFICATE.verdict),
  },
];

for (const a of IMP2860_EN_ASSEMBLED_INTERVAL_CERTIFICATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2860-en-assembled-interval-certificate assertion failed: ' + a.id);
  }
}
