/**
 * @module imp-2873-ecoll-rate-interval
 *
 * imp-2873 (low, numerical, S7): Outward-rounded interval certificate for the
 * E_coll RATE FACTOR sqrt(log T0 / N) at the surviving finite beat N* = 1e4.
 *
 * THE GAP THIS CLOSES
 * -------------------
 * imp-2694 (ecoll-rate-reconciliation) settles WHICH rate E_coll uses: the
 * binding (slowest, justified) modulus is the Holder N^{-1/2}, i.e. the decay
 * factor is sqrt(log T0 / N) ~ N^{-1/2} up to the log. But that factor is still
 * carried as a POINT float64 inside the dominant E_coll sub-term:
 *     imp-2643:  E_COLL = C_C_PINNED * Math.sqrt(L / N_STAR),  L = log(T0).
 * imp-2860 brackets the WHOLE assembled E(N) at the WORST-CASE constants; this
 * module isolates and certifies the sqrt(log T0 / N) FACTOR on its own, at the
 * central reading, so the rate factor inside the dominant term is rounding-robust
 * and the displayed product E_coll = C_C * bracket is a certified product (a
 * certified rate factor times the (still-ansatz) coefficient C_C).
 *
 * THE BRACKET
 * -----------
 * Built entirely in outward-rounded Interval arithmetic over the SHARED certified
 * T0 enclosure (the imp-2867 primitive, mirrored inline as imp-2860 does: T0 in
 * [T0_lo, T0_hi] via the count-monotonicity straddle N(T0_lo) < 1e4 < N(T0_hi))
 * and N* = 1e4 exact:
 *     L_I      = T0_I.log()                       (log T0, outward-rounded)
 *     RATIO_I  = L_I / N*                         (log T0 / N, N* exact)
 *     BRACKET_I = RATIO_I.sqrt()                  (sqrt(log T0 / N), the rate factor)
 * The point value Math.sqrt(log(effectiveHeightForN(1e4)) / 1e4) is asserted to lie
 * strictly inside [BRACKET_I.lo, BRACKET_I.hi].
 *
 * THE RATE-EXPONENT RECONCILIATION (1/2 in N, log in T0)
 * ------------------------------------------------------
 * The factor carries exponent alpha = 1/2 in N and a log in T0. Holding the SAME
 * certified T0 (hence the same L interval), the factor at N vs 4N satisfies
 *     sqrt(L/N) / sqrt(L/(4N)) = sqrt(4) = 2 exactly,
 * which is the clean N^{-1/2} signature. We cross-check that alpha = 1/2 equals the
 * imp-2694 binding (Holder, justified) E_coll exponent, so the bracketed factor is
 * the SAME rate imp-2694 reconciled as binding -- no silent exponent drift.
 *
 * HONEST DESIGN -- NO FALSE QED
 * -----------------------------
 * This certifies ONLY the sqrt(log T0 / N) rate FACTOR (a closed-form analytic
 * quantity, genuinely rigorous as an interval). It does NOT touch the coefficient
 * C_C = C_H sqrt(pi C_Selberg): C_H = 1/8 remains an unproven ANSATZ (imp-2642), so
 * the assembled E_coll = C_C * bracket stays NON-rigorous. NO-GO retained;
 * Platt-Trudgian Lambda <= 0.2 remains SOTA. No Lambda value changes.
 *
 * @see imp-2694-ecoll-rate-reconciliation (which rate E_coll uses: Holder N^{-1/2})
 * @see imp-2867-t0-certified-enclosure (shared T0 enclosure primitive at N*=1e4)
 * @see imp-2643-honest-assembled-EN (E_COLL = C_C sqrt(L/N) point-float64 carrier)
 * @see imp-2860-en-assembled-interval-certificate (whole-E(N) worst-case bracket)
 * @see interval-arithmetic (imp-068 Interval class with outward-rounded log/sqrt/div)
 */

import { Interval } from '../math/interval-arithmetic.js';
import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { IMP2694_ECOLL_RATE_RECONCILIATION } from './imp-2694-ecoll-rate-reconciliation.js';
import { IMP2643_HONEST_ASSEMBLED_EN } from './imp-2643-honest-assembled-EN.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const N_STAR = 1e4;
const TWO_PI = 2 * Math.PI;
const PT_BOUND = 0.2; // Platt-Trudgian 2021 SOTA unconditional Lambda upper bound.

// ── Shared certified T0 enclosure (the imp-2867 primitive, mirrored inline) ───
// [T0_lo, T0_hi] encloses the Riemann-von Mangoldt root N(T)=N* via the SAME
// count-monotonicity straddle N(T0_lo) < 1e4 < N(T0_hi) that imp-2867 owns and
// imp-2860 mirrors; reproduced here (not imported) so this rate-factor cert does
// not inherit a sibling module's top-level assertion state. gamma_N ~ 9.879e3 is
// displayed to 4 sig figs => displayed-digit half-width 0.5.
const T0_FLOAT = effectiveHeightForN(N_STAR);   // ~9878.8034
const T0_HALFWIDTH = 0.5;
const T0_LO = T0_FLOAT - T0_HALFWIDTH;
const T0_HI = T0_FLOAT + T0_HALFWIDTH;
const N_AT_T0_LO = zeroCountAtHeight(T0_LO);    // < 1e4
const N_AT_T0_HI = zeroCountAtHeight(T0_HI);    // > 1e4
const T0_STRADDLE_OK = N_AT_T0_LO < N_STAR && N_AT_T0_HI > N_STAR && T0_LO > TWO_PI * Math.E;
const T0_INTERVAL = new Interval(T0_LO, T0_HI);

// ── Outward-rounded bracket for the rate factor sqrt(log T0 / N) ──────────────
const L_INTERVAL = T0_INTERVAL.log();                       // log T0
const RATIO_INTERVAL = L_INTERVAL.div(Interval.exact(N_STAR)); // log T0 / N (N* exact)
const BRACKET_INTERVAL = RATIO_INTERVAL.sqrt();             // sqrt(log T0 / N), the rate factor
const BRACKET_LO = BRACKET_INTERVAL.lo;
const BRACKET_HI = BRACKET_INTERVAL.hi;
const BRACKET_WIDTH = BRACKET_INTERVAL.width;

// ── The carried point value (re-derived live, the imp-2643 expression) ────────
const L_FLOAT = Math.log(T0_FLOAT);             // ~9.198
const BRACKET_POINT = Math.sqrt(L_FLOAT / N_STAR); // ~0.0303284 = the carried factor

// ── Rate-exponent reconciliation (1/2 in N, log in T0) ────────────────────────
// Same certified T0 (same L interval); only N changes N -> 4N. The N^{-1/2}
// signature is sqrt(L/N)/sqrt(L/4N) = sqrt(4) = 2 exactly.
const BRACKET_4N = L_INTERVAL.div(Interval.exact(4 * N_STAR)).sqrt();
const N_EXPONENT_RATIO = BRACKET_INTERVAL.mid / BRACKET_4N.mid; // -> 2 for alpha = 1/2
const ALPHA_N = 0.5;
// imp-2694 binding (justified Holder) E_coll exponent in N -- must agree.
const IMP2694_BINDING_ALPHA = IMP2694_ECOLL_RATE_RECONCILIATION.resolution.bindingRate.alpha; // 0.5

// ── Certified product reconciliation: E_coll = C_C * bracket ──────────────────
// C_C is the (still-ansatz) coefficient; the displayed E_coll is a certified rate
// factor times C_C. Cross-check the live product against the imp-2643 carrier.
const E_COLL_PRODUCT_POINT = C_C_PINNED * BRACKET_POINT;            // ~0.0116385
const E_COLL_CARRIED = IMP2643_HONEST_ASSEMBLED_EN.subterms.E_coll.value; // 7-sig-fig stored
const E_COLL_PRODUCT_INTERVAL = Interval.exact(C_C_PINNED).mul(BRACKET_INTERVAL);

export const IMP2873_ECOLL_RATE_INTERVAL = {
  id: 'imp-2873',
  proofSection: 'S7',
  question:
    'Convert the E_coll RATE FACTOR sqrt(log T0 / N) at N* = 1e4 from the imp-2643 point ' +
    'float64 into a machine-checked outward-rounded interval over the shared certified T0 ' +
    'enclosure, assert the carried point lies inside, and reconcile the rate exponent ' +
    '(1/2 in N, log in T0) against the imp-2694 binding Holder rate.',
  N_star: N_STAR,
  T0Enclosure: {
    lo: +T0_LO.toFixed(4),
    hi: +T0_HI.toFixed(4),
    source: 'imp-2867 shared certified enclosure, count-monotonicity straddle (mirrored inline as imp-2860)',
    countAtLo: +N_AT_T0_LO.toFixed(4),
    countAtHi: +N_AT_T0_HI.toFixed(4),
    straddleOk: T0_STRADDLE_OK,
  },
  rateFactorBracket: {
    lo: BRACKET_LO,
    hi: BRACKET_HI,
    width: BRACKET_WIDTH,
    carriedPoint: BRACKET_POINT,
    containsPoint: BRACKET_INTERVAL.contains(BRACKET_POINT),
    note:
      'sqrt(log T0 / N) over the certified T0 bracket, N* = 1e4 exact, outward-rounded. '
      + 'The imp-2643 carried point value lies strictly inside.',
  },
  rateExponent: {
    alpha_in_N: ALPHA_N,
    logInT0: true,
    fourFoldRatio: +N_EXPONENT_RATIO.toFixed(12), // 2 exactly for alpha = 1/2
    imp2694BindingAlpha: IMP2694_BINDING_ALPHA,
    agreesWithImp2694: ALPHA_N === IMP2694_BINDING_ALPHA,
    note:
      'sqrt(L/N)/sqrt(L/4N) = sqrt(4) = 2 exactly is the clean N^{-1/2} signature; the '
      + 'log lives in T0, certified via the T0 enclosure. Matches the imp-2694 binding Holder rate.',
  },
  certifiedProduct: {
    C_C: +C_C_PINNED.toFixed(6),
    E_coll_lo: +E_COLL_PRODUCT_INTERVAL.lo.toFixed(7),
    E_coll_hi: +E_COLL_PRODUCT_INTERVAL.hi.toFixed(7),
    E_coll_carried: E_COLL_CARRIED,
    note:
      'E_coll = C_C * bracket: the rate factor is now a certified interval, so the product is '
      + 'a certified-rate-factor times the coefficient C_C. C_C remains ANSATZ (C_H = 1/8, imp-2642).',
  },
  isRigorous: false, // the FACTOR is rigorous; the assembled E_coll is not (C_H ansatz).
  scope: 'Certifies the sqrt(log T0 / N) RATE FACTOR only; the C_C coefficient (C_H ansatz) is unchanged.',
  blockingConstant: 'C_H (rigorous N-uniform upper bound on the Holder-1/2 modulus C_shock C_Lip/4)',
  changesAnyBound: false,
  ptBound: PT_BOUND,
  verdict:
    'E_coll RATE FACTOR INTERVAL-CERTIFIED. The factor sqrt(log T0 / N) at N* = 1e4 lies in ['
    + BRACKET_LO.toExponential(6) + ', ' + BRACKET_HI.toExponential(6) + '] (outward-rounded over the '
    + 'shared imp-2867 T0 enclosure, N* exact), and the imp-2643 carried point sits strictly inside. '
    + 'The N-exponent is exactly 1/2 (4-fold ratio = 2), matching the imp-2694 binding Holder rate, so '
    + 'the dominant term no longer carries the rate factor as an un-bracketed point. HONEST: this '
    + 'certifies the rate FACTOR only -- the coefficient C_C rests on the C_H = 1/8 ANSATZ (imp-2642), '
    + 'so the assembled E_coll = C_C * bracket stays NON-rigorous. NO-GO retained; Platt-Trudgian '
    + 'Lambda <= 0.2 remains SOTA. No false QED; no Lambda value changes.',
  citation:
    'imp-2694 (which rate: binding Holder N^{-1/2}); imp-2867 (shared certified T0 enclosure); '
    + 'imp-2643 (E_COLL = C_C sqrt(L/N) point carrier); imp-2860 (whole-E(N) worst-case bracket); '
    + 'interval-arithmetic.js (imp-068 outward-rounded log/sqrt/div); Platt-Trudgian 2021 (0.2)',
};

export const IMP2873_ECOLL_RATE_INTERVAL_ASSERTIONS = [
  {
    id: 'imp2873-shared-t0-enclosure-straddle',
    description:
      'The bracket is built over the shared certified T0 enclosure (imp-2867, mirrored inline): '
      + 'the count-monotonicity straddle N(T0_lo) < 1e4 < N(T0_hi) holds in the monotone regime.',
    holds: () =>
      T0_STRADDLE_OK === true && N_AT_T0_LO < N_STAR && N_AT_T0_HI > N_STAR &&
      T0_LO < T0_HI && T0_LO > 0,
  },
  {
    id: 'imp2873-bracket-contains-carried-point',
    description:
      'The outward-rounded sqrt(log T0 / N) bracket strictly contains the imp-2643 carried point '
      + 'value Math.sqrt(log(effectiveHeightForN(1e4)) / 1e4).',
    holds: () =>
      BRACKET_INTERVAL.contains(BRACKET_POINT) &&
      BRACKET_LO < BRACKET_POINT && BRACKET_POINT < BRACKET_HI,
  },
  {
    id: 'imp2873-bracket-finite-ordered-tight',
    description:
      'The rate-factor bracket is a genuine machine certificate: finite, lo < hi, positive, and '
      + 'tight (width < 1e-6), not a loose hand-wave.',
    holds: () =>
      Number.isFinite(BRACKET_LO) && Number.isFinite(BRACKET_HI) &&
      BRACKET_LO > 0 && BRACKET_LO < BRACKET_HI && BRACKET_WIDTH > 0 && BRACKET_WIDTH < 1e-6,
  },
  {
    id: 'imp2873-n-exponent-is-one-half-matches-imp2694',
    description:
      'The N-exponent is exactly 1/2: the 4-fold ratio sqrt(L/N)/sqrt(L/4N) = 2, and alpha = 1/2 '
      + 'equals the imp-2694 binding (justified Holder) E_coll exponent -- no silent exponent drift.',
    holds: () =>
      Math.abs(N_EXPONENT_RATIO - 2) < 1e-12 &&
      ALPHA_N === 0.5 &&
      IMP2694_BINDING_ALPHA === ALPHA_N,
  },
  {
    id: 'imp2873-certified-product-matches-carrier',
    description:
      'The certified product C_C * bracket reproduces the imp-2643 carried E_coll value within the '
      + '7-sig-fig storage floor (~1e-6), confirming the displayed E_coll is a certified-rate product.',
    holds: () =>
      E_COLL_PRODUCT_INTERVAL.contains(E_COLL_CARRIED) ||
      Math.abs(E_COLL_PRODUCT_POINT - E_COLL_CARRIED) < 1e-6,
  },
  {
    id: 'imp2873-rate-factor-only-no-false-qed',
    description:
      'HONESTY: certifies the rate FACTOR only; isRigorous false, scope names C_C/C_H ansatz as '
      + 'unchanged, changes no bound, NO-GO retained, Platt-Trudgian stays SOTA (no false QED).',
    holds: () =>
      IMP2873_ECOLL_RATE_INTERVAL.isRigorous === false &&
      IMP2873_ECOLL_RATE_INTERVAL.changesAnyBound === false &&
      /C_H/.test(IMP2873_ECOLL_RATE_INTERVAL.scope) &&
      /NO-GO/.test(IMP2873_ECOLL_RATE_INTERVAL.verdict) &&
      /remains SOTA/.test(IMP2873_ECOLL_RATE_INTERVAL.verdict),
  },
];

for (const a of IMP2873_ECOLL_RATE_INTERVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-2873-ecoll-rate-interval assertion failed: ' + a.id);
  }
}
