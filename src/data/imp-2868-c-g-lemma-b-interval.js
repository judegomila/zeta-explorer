/**
 * @module imp-2868-c-g-lemma-b-interval
 *
 * imp-2868 (low, numerical): Machine-checked OUTWARD-ROUNDED interval certificate
 * for the A1 Gronwall amplification constant
 *     C_G = 2 / y_star^2                                         (Lemma B)
 * underlying the imp-2644 C_G discharge. imp-2644 discharges C_G as non-binding
 * for the E_flow term for EVERY C_G <= 203 (the A1 safety-band ceiling
 * C_G_max(A1) ~ 203.24), citing the physically-derived Lemma-B value
 * C_G = 2/y_star^2 <= 2. That <= 2 bound rests on the order-one density-floor
 * strip floor y_star >= 1, which imp-2644 carries as a bare point assertion.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * It upgrades the carried point claim "C_G <= 2" to a genuine outward-rounded
 * interval bracket. Because C_G(y_star) = 2/y_star^2 is strictly DECREASING in
 * y_star, an upper bracket on C_G follows from a certified LOWER bracket on
 * y_star:
 *     y_star >= y_star_lo  =>  C_G <= 2 / y_star_lo^2.
 * Taking the Lemma-B order-one floor y_star_lo = 1 and propagating it through the
 * Interval class (imp-068, EPS-outward-rounded mul/div) gives a rigorous bracket
 * C_G in (0, C_G_hi] with C_G_hi = 2 (to within one outward-rounding ULP). The
 * build assertions then lock:
 *   (A) C_G_hi is an outward-rounded upper bracket equal to 2 to within rounding;
 *   (B) C_G_hi << 203, i.e. the physically-derived value sits with a ~100x safety
 *       margin strictly inside the imp-2644 discharged band [0, 203];
 *   (C) CROSS-CHECK against imp-2688-c-g-loglipschitz-bound.js: the SHARPER
 *       mesoscopic Lemma-C strip there (y_star ~ 17.56 at N* = 1e4, N-uniform
 *       supremum C_G = 2/y_inf^2 ~ 0.2524) gives a C_G that is far below this
 *       conservative ceiling 2 and trivially inside [0, 203]. The mesoscopic
 *       y_star ~ 17.56 also independently corroborates the y_star >= 1 floor with
 *       a ~17x margin.
 *
 * HONEST SCOPE -- NO FALSE QED
 * ----------------------------
 * This certifies ONLY that the physically-derived Lemma-B value of C_G sits
 * strictly inside the already-discharged band. It does NOT change the DISCHARGED
 * status: imp-2644 already certifies E_flow <= 1.3e-3 UNCONDITIONALLY for every
 * C_G <= 203, so the discharge holds regardless of where in [0, 203] the true
 * C_G lands. The y_star >= 1 floor is the carried Lemma-B input; this module
 * brackets C_G GIVEN that floor (and corroborates the floor via imp-2688), it
 * does not re-derive the floor from the backward-flow geometry. No Lambda value
 * changes; this is silent-regression armour around the last un-bracketed constant
 * in the rigorous E_flow term.
 *
 * @see imp-2644-eflow-gronwall-cg-discharge (C_G <= 2 point claim; band C_G <= 203)
 * @see imp-2688-c-g-loglipschitz-bound (sharper mesoscopic y_star ~ 17.56, N-uniform sup ~0.2524)
 * @see backward-flow-stability-gronwall (Lemma B: amplification exp(2 S / y_star^2), C_G = 2/y_star^2)
 * @see imp-2704-cf-interval-certificate (sibling outward-rounded E_flow constant cert)
 * @see interval-arithmetic (imp-068 Interval class, EPS-outward-rounded mul/div/pow)
 */

import { Interval } from '../math/interval-arithmetic.js';
import { IMP2688_C_G_LOGLIPSCHITZ_BOUND } from './imp-2688-c-g-loglipschitz-bound.js';

// ── imp-2644 discharged-band ceiling (C_G_max on the rigorous A1 |t_c| input) ──
const A1_BAND_CEILING = 203; // C_G_max(A1) ~ 203.24; E_flow <= 1.3e-3 for all C_G <= this

// ── Certified LOWER bracket on y_star: the Lemma-B order-one density-floor strip
// floor y_star >= 1 (imp-2644 carried point input). C_G = 2/y_star^2 is strictly
// decreasing, so this floor yields the UPPER bracket on C_G.
const Y_STAR_LO = 1; // order-one density-floor strip floor (Lemma B / imp-2644)
const Y_STAR_LO_INTERVAL = Interval.exact(Y_STAR_LO);

// ── Outward-rounded upper bracket on C_G = 2/y_star^2 via the Interval class ──
// C_G_hi = (2 / y_star_lo^2).hi (EPS-outward-rounded div/pow). With y_star_lo = 1
// this is 2 to within one outward-rounding ULP.
const C_G_INTERVAL = Interval.exact(2).div(Y_STAR_LO_INTERVAL.pow(2));
const C_G_HI = C_G_INTERVAL.hi; // ~2 + O(EPS)

// ── Cross-check values pulled from the sharper mesoscopic strip (imp-2688) ────
const C_G_MESOSCOPIC_NSTAR = IMP2688_C_G_LOGLIPSCHITZ_BOUND.atNStar.C_G_rigorous; // ~0.006489
const C_G_NUNIFORM_SUP = IMP2688_C_G_LOGLIPSCHITZ_BOUND.nUniformity.C_G_supremum; // ~0.252414
const Y_STAR_MESOSCOPIC_NSTAR = IMP2688_C_G_LOGLIPSCHITZ_BOUND.atNStar.y_star; // ~17.5556

const SAFETY_BAND = A1_BAND_CEILING / C_G_HI; // ~100x

export const IMP2868_C_G_LEMMA_B_INTERVAL = {
  id: 'imp-2868',
  question:
    'Convert the Lemma-B Gronwall constant C_G = 2/y_star^2 (the C_G <= 2 input to the imp-2644 discharge) from a carried point assertion into an outward-rounded interval bracket from a certified y_star lower bracket, and confirm C_G_hi << 203.',
  lemmaB: {
    formula: 'C_G(y_star) = 2 / y_star^2 (Lemma B; amplification over horizon S is exp(2 S / y_star^2))',
    monotonicity: 'C_G is strictly DECREASING in y_star, so an upper bracket on C_G follows from a LOWER bracket on y_star.',
    source: 'backward-flow-stability-gronwall.js Lemma B',
  },
  yStarLowerBracket: {
    value: Y_STAR_LO, // 1 -- the order-one density-floor strip floor (imp-2644 carried input)
    note:
      'The Lemma-B order-one density-floor strip floor y_star >= 1, carried as a point assertion '
      + 'by imp-2644. This module brackets C_G GIVEN this floor; the floor itself is the Lemma-B '
      + 'input (corroborated below by the sharper mesoscopic strip of imp-2688).',
  },
  cGInterval: {
    lo: C_G_INTERVAL.lo,
    hi: C_G_HI, // ~2 (outward-rounded)
    width: C_G_INTERVAL.width,
    note:
      'Outward-rounded (imp-068 Interval) enclosure of 2/y_star^2 at the certified floor '
      + 'y_star_lo = 1; the carried Lemma-B point claim C_G <= 2 sits at this ceiling.',
  },
  dischargedBand: {
    ceiling: A1_BAND_CEILING, // 203 (imp-2644 C_G_max on A1 input)
    C_G_hi: +C_G_HI.toFixed(12),
    safetyBand: +SAFETY_BAND.toFixed(2), // ~100x
    note:
      'imp-2644 certifies E_flow <= 1.3e-3 for EVERY C_G <= 203; the physically-derived '
      + 'C_G_hi = 2 sits ~100x inside that band.',
  },
  crossCheckImp2688: {
    mesoscopic_y_star_at_Nstar: Y_STAR_MESOSCOPIC_NSTAR, // ~17.5556 (>> the y_star >= 1 floor)
    mesoscopic_C_G_at_Nstar: C_G_MESOSCOPIC_NSTAR, // ~0.006489
    N_uniform_C_G_supremum: C_G_NUNIFORM_SUP, // ~0.252414 = 2/y_inf^2
    note:
      'The sharper mesoscopic Lemma-C strip (imp-2688) gives y_star ~ 17.56 at N* = 1e4 -- '
      + '~17x above the conservative y_star >= 1 floor -- so the actual C_G ~ 0.00649 and its '
      + 'N-uniform supremum ~0.2524 are far below this certificate ceiling 2 and trivially inside [0, 203].',
  },
  honestScope:
    'Certifies ONLY that the physically-derived Lemma-B value of C_G sits strictly inside the '
    + 'already-discharged band [0, 203]. It does NOT change the DISCHARGED status (imp-2644 holds '
    + 'unconditionally for any C_G <= 203) and re-derives no geometry: the y_star >= 1 floor is the '
    + 'carried Lemma-B input, corroborated -- not proven -- by the imp-2688 mesoscopic strip. No '
    + 'Lambda value changes.',
  citation:
    'imp-2644-eflow-gronwall-cg-discharge.js (C_G <= 2 point claim; band C_G <= 203); '
    + 'imp-2688-c-g-loglipschitz-bound.js (mesoscopic y_star ~ 17.56, N-uniform sup ~0.2524); '
    + 'backward-flow-stability-gronwall.js Lemma B (C_G = 2/y_star^2); '
    + 'interval-arithmetic.js (imp-068 outward-rounded Interval)',
};

export const IMP2868_C_G_LEMMA_B_INTERVAL_ASSERTIONS = [
  {
    id: 'imp2868-cg-hi-outward-rounded-equals-2',
    description:
      'C_G_hi = (2/y_star_lo^2).hi is an outward-rounded upper bracket equal to 2 to within one rounding ULP (y_star_lo = 1, Lemma B).',
    holds: () =>
      Number.isFinite(C_G_HI) && C_G_HI >= 2 && C_G_HI <= 2 + 1e-12 && C_G_INTERVAL.contains(2),
  },
  {
    id: 'imp2868-cg-hi-strictly-inside-discharged-band',
    description:
      'C_G_hi << 203: the physically-derived Lemma-B value sits strictly inside the imp-2644 discharged band with a ~100x safety margin.',
    holds: () => C_G_HI < A1_BAND_CEILING && SAFETY_BAND > 100,
  },
  {
    id: 'imp2868-monotone-decreasing-larger-ystar-smaller-cg',
    description:
      'Sanity on the monotonicity used: a larger y_star (the mesoscopic ~17.56) gives a strictly smaller C_G than the conservative floor y_star = 1.',
    holds: () => {
      const cgAtMeso = 2 / (Y_STAR_MESOSCOPIC_NSTAR * Y_STAR_MESOSCOPIC_NSTAR);
      return Y_STAR_MESOSCOPIC_NSTAR > Y_STAR_LO && cgAtMeso < C_G_HI;
    },
  },
  {
    id: 'imp2868-cross-check-imp2688-inside-band',
    description:
      'CROSS-CHECK: the imp-2688 mesoscopic C_G ~ 0.006489 and its N-uniform supremum ~0.2524 both lie strictly below the certificate ceiling 2 and inside the discharged band [0, 203].',
    holds: () =>
      C_G_MESOSCOPIC_NSTAR > 0 && C_G_MESOSCOPIC_NSTAR < C_G_HI &&
      C_G_NUNIFORM_SUP > 0 && C_G_NUNIFORM_SUP < C_G_HI &&
      C_G_NUNIFORM_SUP < A1_BAND_CEILING &&
      Math.abs(C_G_MESOSCOPIC_NSTAR - 0.006489) < 1e-5 &&
      Math.abs(C_G_NUNIFORM_SUP - 0.252414) < 1e-5,
  },
  {
    id: 'imp2868-mesoscopic-corroborates-ystar-floor',
    description:
      'The carried y_star >= 1 floor is corroborated (not proven): the imp-2688 mesoscopic strip gives y_star ~ 17.56 at N* = 1e4, ~17x above the floor.',
    holds: () => Y_STAR_MESOSCOPIC_NSTAR > 10 * Y_STAR_LO,
  },
];

for (const a of IMP2868_C_G_LEMMA_B_INTERVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2868-c-g-lemma-b-interval assertion failed: ${a.id}`);
  }
}
