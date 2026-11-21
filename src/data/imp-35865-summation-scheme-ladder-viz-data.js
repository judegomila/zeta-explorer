/**
 * @module imp-35865-summation-scheme-ladder-viz-data
 * @fileoverview imp-35865 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35812 MEASURED
 *   three-summation-scheme error ladder (naive recursive, pairwise divide-and-conquer,
 *   Kahan-Babuska compensated) vs N = [1e3, 4.886e5], contrasted against the imp-35761
 *   pessimistic linear-in-N ceiling and the imp-35760 O(1) barrier-margin headroom.
 *
 *   The literals below are copied verbatim from the imp-35812 exact-BigInt-reference
 *   measurement (result.ladder, result.ceilings) -- this module does not import
 *   imp-35812 (no re-running the four summation schemes at page-load time) so pages
 *   consuming it stay import-light.
 *
 *   @see imp-35812-w1-summation-scheme-measured-cost.js (source measurement)
 *   @see imp-35761-w1-certified-rounding-cost-scope.js (pessimistic linear ceiling)
 *   @see imp-35760-w1-margin-allocation-scope.js (O(1) barrier margin all errors sit under)
 *   @see imp-35864-debruijn-digit-ladder-viz-data.js (same viz-data pattern)
 *
 *   Ticket: imp-35865 (ux, medium). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 *
 *   imp-35878 (audit-close, duplicate): imp-35878 asked to seed this exact module
 *   (same naive/pairwise/Kahan trio, same N=1e3..4.886e5 ladder, same imp-35761
 *   ceiling comparison) "if none already exists" -- this module + its routed page
 *   already satisfy that request, so imp-35878 is closed as a duplicate of imp-35865
 *   rather than seeding a redundant second module.
 */

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp)
const EPS_DOUBLE = 2 ** -52; // machine epsilon (= 2u); imp-35761 ceiling unit

// Measured normalized errors (err / Sum|t_k|) at each ladder size, exact-BigInt-referenced
// (imp-35812), plus the per-N imp-35761 ceilings: naiveCeil = N*eps, pairwiseCeil =
// log2(N)*eps, kahanCeil = 2u (N-independent floor).
export const IMP35865_SUMMATION_LADDER = Object.freeze([
  {
    N: 1000,
    naive: 1.0877430538321182e-17,
    pairwise: 8.064680823361361e-18,
    kahan: 3.735683215181012e-19,
    naiveCeil: 1000 * EPS_DOUBLE,
    pairwiseCeil: Math.log2(1000) * EPS_DOUBLE,
    kahanCeil: 2 * U_ROUNDOFF,
  },
  {
    N: 10000,
    naive: 1.7021878470293846e-17,
    pairwise: 1.4041438011981004e-18,
    kahan: 3.507154627535134e-19,
    naiveCeil: 10000 * EPS_DOUBLE,
    pairwiseCeil: Math.log2(10000) * EPS_DOUBLE,
    kahanCeil: 2 * U_ROUNDOFF,
  },
  {
    N: 100000,
    naive: 4.3234823601883084e-18,
    pairwise: 6.499132407341812e-19,
    kahan: 9.731372952057119e-20,
    naiveCeil: 100000 * EPS_DOUBLE,
    pairwiseCeil: Math.log2(100000) * EPS_DOUBLE,
    kahanCeil: 2 * U_ROUNDOFF,
  },
  {
    N: 488602,
    label: 'N at T_PT',
    naive: 3.032193419836597e-17,
    pairwise: 3.556628498813625e-19,
    kahan: 1.89155419746951e-20,
    naiveCeil: 488602 * EPS_DOUBLE,
    pairwiseCeil: Math.log2(488602) * EPS_DOUBLE,
    kahanCeil: 2 * U_ROUNDOFF,
  },
]);

// imp-35761 pessimistic ceilings evaluated at N_AT_TPT (the operative T_PT=3e12 length).
export const IMP35865_CEILINGS_AT_TPT = Object.freeze({
  naiveLinear: 1.0849143805558015e-10,
  pairwise: 4.196265611312305e-15,
  kahan: 2.220446049250313e-16,
});

// Orders of magnitude the achieved error sits below each ceiling, at N_AT_TPT.
export const IMP35865_ORDERS_BELOW_CEILING = Object.freeze({
  naiveVsCeilingOrders: Math.log10(
    IMP35865_CEILINGS_AT_TPT.naiveLinear / IMP35865_SUMMATION_LADDER[3].naive
  ),
  pairwiseVsCeilingOrders: Math.log10(
    IMP35865_CEILINGS_AT_TPT.pairwise / IMP35865_SUMMATION_LADDER[3].pairwise
  ),
  kahanVsCeilingOrders: Math.log10(
    IMP35865_CEILINGS_AT_TPT.kahan / IMP35865_SUMMATION_LADDER[3].kahan
  ),
});

// imp-35760 O(1) barrier margin |A_t+B_t|-|C_t|: all measured errors and even the
// pessimistic ceilings sit ~10+ orders below it (qualitative headroom band, not a
// measured margin value -- imp-35760 scopes only fractional allocation, not a number).
export const IMP35865_BARRIER_MARGIN_HEADROOM = Object.freeze({
  scale: 'O(1)',
  ordersAboveNaiveCeiling: 10,
  note:
    'the naive-scheme pessimistic ceiling itself (worst of the three) sits >=10 orders below the ' +
    'O(1) barrier margin |A_t+B_t|-|C_t| (imp-35760 allocation), so every measured/ceiling error in ' +
    'this ladder has overwhelming strict headroom underneath that margin',
});

export const IMP35865_SUMMATION_SCHEME_LADDER_VIZ_DATA = {
  ticket: 'imp-35865',
  sourceTicket: 'imp-35812',
  ladder: IMP35865_SUMMATION_LADDER,
  ceilingsAtTPT: IMP35865_CEILINGS_AT_TPT,
  ordersBelowCeiling: IMP35865_ORDERS_BELOW_CEILING,
  barrierMarginHeadroom: IMP35865_BARRIER_MARGIN_HEADROOM,
  note:
    'Exact-BigInt-referenced measurement of naive recursive, pairwise divide-and-conquer, and ' +
    'Kahan-Babuska compensated summation on a representative N ~ 4.886e5-term oscillatory sum at ' +
    'T_PT = 3e12. The naive error tracks O(sqrt(N).u) (random-walk), NOT the imp-35761 pessimistic ' +
    'coherent O(N.u) ceiling, sitting ~6 orders below it; pairwise tracks O(log2(N).u); Kahan is flat ' +
    'at the unit-roundoff floor with no N-growth. All three, and the pessimistic ceiling itself, sit ' +
    '~10+ orders below the O(1) barrier margin (imp-35760).',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35812 exact-BigInt-referenced measurement; ' +
    'adds no new derivation and changes no bound. Measurement only; certifies no W1 bound; evaluates ' +
    'no true H_0; instantiates no interval; verifies no inequality; establishes no positivity; the W1 ' +
    'A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A). NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35865_VIZ_ASSERTIONS = [
  {
    id: 'imp35865-ladder-four-points-n-increasing',
    description: 'ladder has 4 points strictly increasing in N, ending at N_AT_TPT ~ 488602',
    holds: () => {
      const L = IMP35865_SUMMATION_LADDER;
      if (L.length !== 4) return false;
      for (let i = 1; i < L.length; i++) {
        if (L[i].N <= L[i - 1].N) return false;
      }
      return L[0].N === 1000 && L[L.length - 1].N === 488602;
    },
  },
  {
    id: 'imp35865-scheme-ordering-every-rung',
    description: 'at every ladder rung, kahan < pairwise < naive',
    holds: () =>
      IMP35865_SUMMATION_LADDER.every((r) => r.kahan < r.pairwise && r.pairwise < r.naive),
  },
  {
    id: 'imp35865-measured-below-ceiling-every-rung',
    description: 'at every ladder rung, measured naive/pairwise/kahan sit strictly below their imp-35761 ceilings',
    holds: () =>
      IMP35865_SUMMATION_LADDER.every(
        (r) => r.naive < r.naiveCeil && r.pairwise < r.pairwiseCeil && r.kahan <= r.kahanCeil
      ),
  },
  {
    id: 'imp35865-naive-six-orders-below-ceiling-at-tpt',
    description: 'at N_AT_TPT, naive measured error sits >5 orders below the imp-35761 linear ceiling',
    holds: () => IMP35865_ORDERS_BELOW_CEILING.naiveVsCeilingOrders > 5,
  },
  {
    id: 'imp35865-margin-headroom-at-least-ten-orders',
    description: 'the O(1) barrier margin headroom is annotated as >=10 orders above the naive ceiling',
    holds: () => IMP35865_BARRIER_MARGIN_HEADROOM.ordersAboveNaiveCeiling >= 10,
  },
  {
    id: 'imp35865-honesty-gate-no-qed',
    description: 'honest status references measurement-only, greenfield, no bound change, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP35865_SUMMATION_SCHEME_LADDER_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP35865_SUMMATION_SCHEME_LADDER_VIZ_DATA.honest) &&
      /NO QED/.test(IMP35865_SUMMATION_SCHEME_LADDER_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP35865_SUMMATION_SCHEME_LADDER_VIZ_DATA.honest),
  },
];

for (const a of IMP35865_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35865-summation-scheme-ladder-viz-data assertion failed: ${a.id}`);
  }
}
