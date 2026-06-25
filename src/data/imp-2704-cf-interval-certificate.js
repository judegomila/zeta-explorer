/**
 * @module imp-2704-cf-interval-certificate
 *
 * imp-2704 (medium, numerical): Machine-checked interval certificate for the
 * E_flow prefactor constant
 *     C_F = (log(T0 / 2pi) + 1) / (2pi)                          (imp-398 / imp-838)
 * at the surviving finite beat N* = 1e4 (T0 = effectiveHeightForN(1e4),
 * gamma_N ~ 9.879e3).
 *
 * C_F = 1.330578 is analytically pinned (imp-398, no placeholder) and used as a
 * float64 point value inside imp-2643/imp-2644. But T0 = effectiveHeightForN(1e4)
 * reaches C_F through a transcendental (log of a Newton-inverted height), so the
 * carried 1.330578 is a point computation, not a certified bracket. This module
 * upgrades it to an OUTWARD-ROUNDED INTERVAL, mirroring the verified-computing
 * pattern of imp-2762-tc-a1-trap-interval.js (the TC_A1 sibling) and
 * interval-dyson-collision.js (imp-318): it wraps T0 in a CERTIFIED enclosure,
 * propagates it through the C_F formula with one-ULP outward rounding, and emits
 * a rigorous [lo, hi] bracket. Build assertions then lock:
 *
 *   (A) the T0 enclosure [T0_lo, T0_hi] genuinely brackets the Riemann-von
 *       Mangoldt root, certified by monotonicity of the strictly-increasing
 *       count N(T) = (T/2pi)(log(T/2pi) - 1): N(T0_lo) < 1e4 < N(T0_hi);
 *   (B) the carried float64 literal 1.330578 lies STRICTLY inside the
 *       outward-rounded C_F bracket (so consumers hard-coding 1.330578 use a
 *       value the certificate vouches for), as does the precise float
 *       cFlowPinned(T0) = 1.3305782332;
 *   (C) an upper bracket on the whole E_flow prefactor-times-Gronwall product:
 *           E_flow_hi = C_F_hi . (log(T0_hi) / T0_lo) . exp(C_G . tc_hi) <= 1.3e-3,
 *       with the Gronwall factor bounded RIGOROUSLY (not via Math.exp) by the
 *       elementary tail estimate exp(x) <= 1 + x + x^2 for 0 <= x <= 1, at the
 *       explicit Gronwall C_G = 2 (imp-2644 Lemma B) on the A1 trap ceiling
 *       tc_hi = 2.37e-4 (imp-2762).
 *
 * HONEST DESIGN -- NO FALSE QED
 * -----------------------------
 * The T0 enclosure half-width is taken from the displayed precision of
 * gamma_N ~ 9.879e3 (last shown digit = units => half-width 0.5), matching the
 * displayed-digit-halfwidth convention of imp-2762. That choice is not assumed
 * correct: assertion (A) PROVES the resulting [T0_lo, T0_hi] brackets the true
 * height by the count-monotonicity straddle, so the C_F bracket is a genuine
 * enclosure regardless of the half-width picked.
 *
 * The E_flow_hi formula in (C) is the ticket's deliberately loose upper bound:
 * log(T0)/T0 is decreasing for T0 > e, so using log(T0_hi) (over-estimate) over
 * T0_lo (over-estimate of 1/T0) yields a valid -- if slightly conservative --
 * ceiling on the true prefactor C_F . log(T0)/T0. The certificate is
 * silent-regression armour for the load-bearing C_F float; it changes no Lambda
 * value.
 *
 * @see imp-2644-eflow-gronwall-cg-discharge (C_F prefactor float, C_G = 2 Lemma B)
 * @see imp-2762-tc-a1-trap-interval (sibling TC_A1 interval certificate, tc_hi)
 * @see interval-dyson-collision (imp-318 outward-rounded interval pattern)
 * @see interval-arithmetic (imp-068 Interval class with outward-rounded log)
 * @see lambda-rh-height-mapping (effectiveHeightForN, zeroCountAtHeight)
 */

import { Interval } from '../math/interval-arithmetic.js';
import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const N_STAR = 1e4;
const EFLOW_TARGET = 1.3e-3;

// ── Certified enclosure of T0 = effectiveHeightForN(N*) ──────────────────────
// gamma_N ~ 9.879e3 is displayed to 4 significant figures (last shown digit in
// the units place), so the displayed-digit half-width is 0.5. We bracket the
// computed height by this half-width and then CERTIFY the bracket by the
// monotonicity straddle below, so the enclosure does not depend on the float64
// Newton output being exact.
const T0_FLOAT = effectiveHeightForN(N_STAR);    // ~9878.8034
const T0_DIGIT_HALFWIDTH = 0.5;                  // displayed-digit half-width of 9.879e3
const T0_LO = T0_FLOAT - T0_DIGIT_HALFWIDTH;
const T0_HI = T0_FLOAT + T0_DIGIT_HALFWIDTH;
const T0_INTERVAL = new Interval(T0_LO, T0_HI);

// Count-monotonicity straddle: N(T) = (T/2pi)(log(T/2pi) - 1) is strictly
// increasing for T > 2pi.e, so [T0_LO, T0_HI] encloses the root N(T)=N* iff the
// count brackets N*. This is what makes the T0 enclosure rigorous.
const N_AT_T0_LO = zeroCountAtHeight(T0_LO);      // < 1e4
const N_AT_T0_HI = zeroCountAtHeight(T0_HI);      // > 1e4

// ── Outward-rounded interval bracket on C_F = (log(T0/2pi) + 1)/2pi ───────────
const TWO_PI_INTERVAL = Interval.exact(TWO_PI);
const U_INTERVAL = T0_INTERVAL.div(TWO_PI_INTERVAL).log();       // log(T0/2pi)
const C_F_INTERVAL = U_INTERVAL.add(Interval.exact(1)).div(TWO_PI_INTERVAL);

const C_F_LO = C_F_INTERVAL.lo;
const C_F_HI = C_F_INTERVAL.hi;
const C_F_WIDTH = C_F_HI - C_F_LO;

// Carried point values: the float64 display literal and the precise computation.
const C_F_DISPLAY_LITERAL = 1.330578;             // as hard-coded / displayed in imp-2643/2644
const C_F_FLOAT = (Math.log(T0_FLOAT / TWO_PI) + 1) / TWO_PI;   // 1.3305782332

// ── Upper bracket on the E_flow prefactor-times-Gronwall product ─────────────
// E_flow = C_F . log(T0)/T0 . exp(C_G . |t_c|). The ticket's conservative
// upper bracket uses log(T0_hi)/T0_lo (a valid over-estimate of the decreasing
// log(T0)/T0) and the rigorous exp(x) <= 1+x+x^2 tail bound at C_G = 2 on the
// A1 trap ceiling tc_hi = 2.37e-4 (imp-2762).
const C_G_GRONWALL = 2;                           // explicit Gronwall C_G = 2/y_star^2, y_star >= 1 (imp-2644 Lemma B)
const TC_HI = 2.37e-4;                            // A1 trap display ceiling (imp-2762, hi < 2.37e-4)
const LOG_T0_HI = Math.log(T0_HI) * (1 + 4e-16);  // round the log up (additive-equiv over-estimate)
function expUpperSmall(x) {                        // exp(x) <= 1 + x + x^2 for 0 <= x <= 1
  return 1 + x + x * x;
}
const GRONWALL_FACTOR_HI = expUpperSmall(C_G_GRONWALL * TC_HI);
const E_FLOW_HI = C_F_HI * (LOG_T0_HI / T0_LO) * GRONWALL_FACTOR_HI;

export const IMP2704_CF_INTERVAL_CERTIFICATE = {
  id: 'imp-2704',
  question:
    'Convert the load-bearing E_flow prefactor constant C_F = (log(T0/2pi)+1)/2pi at N*=1e4 from a float64 point value into a machine-checked outward-rounded interval certificate with a certified T0 enclosure and an E_flow upper bracket.',
  N_star: N_STAR,
  T0Enclosure: {
    nominalFloat: +T0_FLOAT.toFixed(4),           // ~9878.8034
    lo: +T0_LO.toFixed(4),
    hi: +T0_HI.toFixed(4),
    digitHalfwidth: T0_DIGIT_HALFWIDTH,
    countAtLo: +N_AT_T0_LO.toFixed(4),            // < 1e4
    countAtHi: +N_AT_T0_HI.toFixed(4),            // > 1e4
    note:
      'Certified by count-monotonicity straddle N(T0_lo) < 1e4 < N(T0_hi); '
      + 'N(T) = (T/2pi)(log(T/2pi)-1) is strictly increasing, so the bracket '
      + 'encloses the Riemann-von Mangoldt root independent of the half-width.',
  },
  cFInterval: {
    lo: C_F_LO,
    hi: C_F_HI,
    width: C_F_WIDTH,
    displayLiteral: C_F_DISPLAY_LITERAL,          // 1.330578
    preciseFloat: C_F_FLOAT,                       // 1.3305782332
    note:
      'Outward-rounded enclosure of (log(T0/2pi)+1)/2pi over the certified T0 '
      + 'bracket; both the carried literal 1.330578 and the precise float '
      + '1.3305782332 lie strictly inside.',
  },
  eFlowUpperBracket: {
    formula: 'E_flow_hi = C_F_hi . (log(T0_hi)/T0_lo) . exp(C_G . tc_hi)',
    C_G: C_G_GRONWALL,                             // 2 (imp-2644 Lemma B)
    tc_hi: TC_HI,                                  // 2.37e-4 (imp-2762)
    gronwallFactorHi: +GRONWALL_FACTOR_HI.toFixed(8),
    value: +E_FLOW_HI.toExponential(6),            // ~1.2396e-3
    target: EFLOW_TARGET,
    headroom: +(EFLOW_TARGET / E_FLOW_HI).toFixed(4),  // ~1.049x
    boundMethod:
      'log(T0)/T0 decreasing for T0 > e, so log(T0_hi)/T0_lo over-estimates it; '
      + 'exp(C_G.tc_hi) bounded by 1+x+x^2 (elementary tail, NOT Math.exp).',
  },
  verdict:
    'C_F INTERVAL-CERTIFIED. (log(T0/2pi)+1)/2pi in ['
    + C_F_LO.toFixed(8) + ', ' + C_F_HI.toFixed(8)
    + '] (outward-rounded) over the count-straddle-certified T0 bracket; the '
    + 'carried float64 1.330578 sits strictly inside. The full E_flow upper '
    + 'bracket C_F_hi . log(T0_hi)/T0_lo . exp(2 . 2.37e-4) = '
    + E_FLOW_HI.toExponential(4) + ' <= 1.3e-3, so the E_flow numeric value is '
    + 'now a certified upper bracket, not a point computation. No false QED; no '
    + 'Lambda value changes.',
  citation:
    'imp-398 polymath15-constant-C-F.js (C_F pinned); '
    + 'imp-2644-eflow-gronwall-cg-discharge.js (C_F float, C_G = 2 Lemma B); '
    + 'imp-2762-tc-a1-trap-interval.js (tc_hi = 2.37e-4 trap ceiling); '
    + 'interval-arithmetic.js (imp-068 outward-rounded log); '
    + 'lambda-rh-height-mapping.js (effectiveHeightForN, zeroCountAtHeight)',
};

export const IMP2704_CF_INTERVAL_CERTIFICATE_ASSERTIONS = [
  {
    id: 'imp2704-t0-enclosure-count-straddle',
    description:
      'The T0 bracket [T0_lo, T0_hi] encloses the N*=1e4 Riemann-von Mangoldt root, certified by the count straddle N(T0_lo) < 1e4 < N(T0_hi).',
    holds: () => N_AT_T0_LO < N_STAR && N_AT_T0_HI > N_STAR && T0_LO > TWO_PI * Math.E,
  },
  {
    id: 'imp2704-cf-bracket-contains-literal-and-precise',
    description:
      'The carried float64 literal 1.330578 AND the precise float (log(T0/2pi)+1)/2pi = 1.3305782332 both lie strictly inside the outward-rounded C_F bracket.',
    holds: () =>
      C_F_INTERVAL.contains(C_F_DISPLAY_LITERAL)
      && C_F_LO < C_F_DISPLAY_LITERAL && C_F_DISPLAY_LITERAL < C_F_HI
      && C_F_INTERVAL.contains(C_F_FLOAT),
  },
  {
    id: 'imp2704-cf-bracket-tight-and-finite',
    description:
      'The C_F bracket is a genuine machine certificate: finite, positive, and tight (width < 1e-4), not a loose hand-wave.',
    holds: () =>
      Number.isFinite(C_F_WIDTH) && C_F_WIDTH > 0 && C_F_WIDTH < 1e-4 && C_F_LO > 0,
  },
  {
    id: 'imp2704-eflow-upper-bracket-below-target',
    description:
      'E_flow_hi = C_F_hi . (log(T0_hi)/T0_lo) . exp(C_G . tc_hi) <= 1.3e-3 at C_G = 2 on the A1 trap ceiling, with the Gronwall factor bounded by 1+x+x^2.',
    holds: () =>
      C_G_GRONWALL * TC_HI < 1
      && GRONWALL_FACTOR_HI >= 1
      && E_FLOW_HI <= EFLOW_TARGET
      && E_FLOW_HI > 0,
  },
];

for (const a of IMP2704_CF_INTERVAL_CERTIFICATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2704-cf-interval-certificate assertion failed: ${a.id}`);
  }
}
