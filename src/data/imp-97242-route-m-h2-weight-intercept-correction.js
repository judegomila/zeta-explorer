/**
 * @module imp-97242-route-m-h2-weight-intercept-correction
 * @fileoverview imp-97242 -- MEASUREMENT ONLY. Size the imp-97207 "fourth unpinned piece":
 *   the H2-weight intercept correction between the UNWEIGHTED series T(N) intercept c1_T and the
 *   H2-weighted interior Int(N) intercept a_int.
 *
 *   ------------------------------------------------------------------------------------------
 *   BACKGROUND
 *   ------------------------------------------------------------------------------------------
 *   imp-97207 derived the unweighted-series intercept in closed structural form
 *       T(M) = 2 s0 log M + c1_T + o(1),   c1_T = 2 s0 (gamma-3/2) + 2 cQ (zeta(2)-5/4) + 2 R,
 *   but noted that the H2-WEIGHTED interior series Int(N) (imp-96708 sandwich weight
 *   H2(min index) in [1, zeta(2)]) has an intercept that differs from c1_T by a FURTHER
 *   weight-dependent constant -- a fourth unpinned piece it never sized. imp-96771 already
 *   reconciled the two SLOPES (interior 5.6564 vs unweighted T 3.495176, effective weight
 *   ~1.618 inside [1, zeta(2)]); this leaf does the analogous job for the INTERCEPT.
 *
 *   ------------------------------------------------------------------------------------------
 *   THE MEASUREMENT (direct, from the two committed OLS fits on the imp-96750 windows)
 *   ------------------------------------------------------------------------------------------
 *   Unweighted T(N):   T ~ c1_T + s_T log M,  c1_T = -7.565782, s_T = 3.495176   (imp-96708 fit)
 *   H2-weighted Int:   Int ~ a_int + s_int log N, a_int = -14.9289, s_int = 5.6564 (imp-96667)
 *
 *   ADDITIVE H2-weight intercept correction (the imp-97207 "fourth piece"):
 *       dH2 = a_int - c1_T = -14.9289 - (-7.565782) = -7.363 (measured).
 *
 *   Because the weight also scales the SLOPE by H2_slope = s_int/s_T ~ 1.618, part of dH2 is
 *   just that slope factor acting on the unweighted intercept; splitting it out isolates the
 *   genuinely intercept-SPECIFIC piece (the part not predictable from the slope weight alone):
 *       multiplicative part      = (H2_slope - 1) * c1_T   ~ -4.678  (slope weight on c1_T)
 *       intercept-specific piece = a_int - H2_slope * c1_T ~ -2.685  (the residual)
 *       check: multiplicative + intercept-specific = dH2.
 *
 *   ------------------------------------------------------------------------------------------
 *   VERDICT
 *   ------------------------------------------------------------------------------------------
 *   The H2-weight intercept correction is MEASURED at dH2 ~ -7.363 (of which ~-4.68 is the
 *   slope weight scaling c1_T and ~-2.69 is intercept-specific). This sizes the fourth unpinned
 *   piece from imp-97207 -- it is LARGE (comparable to c1_T itself) and negative, confirming it
 *   cannot be neglected in pinning F as a value. It stays a MEASUREMENT: both c1_T and a_int are
 *   OLS fits (not certified), so dH2 inherits their uncertainty; nothing is pinned, no bound
 *   moves. The intercept-specific residual (~-2.69) is the genuinely new weight-dependent
 *   constant that even a full evaluation of (cQ, R) would not supply.
 *
 * @see imp-97207-route-m-farfield-intercept-derivation (names the H2-weight correction as the 4th piece)
 * @see imp-96708-route-m-interior-second-moment-dichotomy (unweighted T fit c1_T=-7.565782, s_T=3.495176)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (H2-weighted interior a_int=-14.9289, s_int=5.6564)
 * @see imp-96771 (the analogous SLOPE reconciliation: effective H2 weight ~1.618 in [1,zeta(2)])
 *
 * Ticket: imp-97242 (numerical, opus-4-8, api-pool). Measurement only; no bound moved; NO QED.
 */

// -- Baked measured inputs (literals from the committed sibling fits; measured, not certified). ---
export const IMP97242_C1_T = -7.565782; // imp-96708 IMP96708_FIT.a: unweighted T(N) OLS intercept
export const IMP97242_S_T = 3.495176; // imp-96708 IMP96708_FIT.s: unweighted T(N) OLS slope
export const IMP97242_A_INT = -14.9289; // imp-96667/imp-97207 IMP97207_A_INTERIOR: H2-weighted Int intercept
export const IMP97242_S_INT = 5.6564; // imp-96667/imp-96708 IMP96708_SANDWICH.weightedInteriorSlope667

// -- The measured H2-weight intercept correction and its multiplicative/intercept-specific split. -
export const IMP97242_H2_SLOPE = IMP97242_S_INT / IMP97242_S_T; // ~1.618 effective slope weight
export const IMP97242_DH2 = IMP97242_A_INT - IMP97242_C1_T; // ~ -7.363 (the "fourth piece", additive)
export const IMP97242_MULTIPLICATIVE_PART = (IMP97242_H2_SLOPE - 1) * IMP97242_C1_T; // ~ -4.678
export const IMP97242_INTERCEPT_SPECIFIC = IMP97242_A_INT - IMP97242_H2_SLOPE * IMP97242_C1_T; // ~ -2.685

export const IMP97242_MEASUREMENT = Object.freeze({
  id: 'imp-97242',
  proofSection: 'Route-M',
  question:
    'How large is the imp-97207 H2-weight intercept correction -- the fourth unpinned piece ' +
    'between the unweighted-series intercept c1_T and the H2-weighted interior intercept a_int?',
  c1TUnweighted: IMP97242_C1_T,
  aIntWeighted: IMP97242_A_INT,
  h2SlopeWeight: IMP97242_H2_SLOPE,
  h2InterceptCorrection: IMP97242_DH2,
  multiplicativePart: IMP97242_MULTIPLICATIVE_PART,
  interceptSpecificPiece: IMP97242_INTERCEPT_SPECIFIC,
  measurementOnly: true,
  valuePinned: false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  conclusion:
    'The imp-97207 H2-weight intercept correction is MEASURED at dH2 = a_int - c1_T ~ -7.363 ' +
    '(a_int=-14.9289 H2-weighted interior, c1_T=-7.565782 unweighted T), of which the slope weight ' +
    'H2_slope~1.618 scaling c1_T contributes ~-4.678 and the genuinely intercept-specific residual ' +
    'a_int - H2_slope*c1_T is ~-2.685. The correction is LARGE (comparable to c1_T itself) and ' +
    'negative, so it cannot be neglected in pinning the far-field ceiling F as a value; but both ' +
    'inputs are OLS fits, so dH2 stays a MEASUREMENT, nothing is pinned, no bound moves. ' +
    'No refereed bound is changed; RH open; NO QED.',
});

export const IMP97242_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the imp-97207 H2-weight ' +
  'intercept correction is sized at dH2 = a_int - c1_T ~ -7.363 (split ~-4.68 slope-weight + ' +
  '~-2.69 intercept-specific). Both c1_T and a_int are OLS fits; no value is pinned and no bound ' +
  'is moved.';

export default IMP97242_MEASUREMENT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97242_ASSERTIONS = [
  {
    id: 'imp97242-additive-correction-consistent',
    why: 'dH2 must equal a_int - c1_T, and the multiplicative + intercept-specific split must ' +
      'reconstitute dH2 exactly (an algebraic identity, tolerance for float only).',
    holds: () =>
      Math.abs(IMP97242_DH2 - (IMP97242_A_INT - IMP97242_C1_T)) < 1e-12 &&
      Math.abs(IMP97242_MULTIPLICATIVE_PART + IMP97242_INTERCEPT_SPECIFIC - IMP97242_DH2) < 1e-12,
  },
  {
    id: 'imp97242-correction-large-and-negative',
    why: 'the measured H2-weight intercept correction must be a LARGE negative constant ' +
      '(comparable to c1_T itself), confirming it is a non-negligible fourth unpinned piece.',
    holds: () =>
      IMP97242_DH2 < -6 &&
      IMP97242_DH2 > -9 &&
      Math.abs(IMP97242_DH2) > 0.5 * Math.abs(IMP97242_C1_T),
  },
  {
    id: 'imp97242-slope-weight-in-sandwich',
    why: 'the effective slope weight H2_slope = s_int/s_T must sit inside the imp-96708 sandwich ' +
      '(1, zeta(2)] near ~1.618, matching the imp-96771 slope reconciliation.',
    holds: () => {
      const zeta2 = (Math.PI * Math.PI) / 6;
      return IMP97242_H2_SLOPE > 1 && IMP97242_H2_SLOPE <= zeta2 + 1e-9 && Math.abs(IMP97242_H2_SLOPE - 1.618) < 0.02;
    },
  },
  {
    id: 'imp97242-intercept-specific-piece-nonzero',
    why: 'the genuinely intercept-specific residual (beyond the slope-weight scaling) must be a ' +
      'non-trivial negative constant -- the new weight-dependent piece not supplied by (cQ, R).',
    holds: () =>
      IMP97242_INTERCEPT_SPECIFIC < -1 &&
      IMP97242_INTERCEPT_SPECIFIC > -5,
  },
  {
    id: 'imp97242-honesty-gate-no-qed',
    why: 'measurement only: no bound moved, no value pinned, no operator positivity, and the ' +
      'honesty markers are present.',
    holds: () =>
      IMP97242_MEASUREMENT.measurementOnly === true &&
      IMP97242_MEASUREMENT.valuePinned === false &&
      IMP97242_MEASUREMENT.anyBoundMoved === false &&
      IMP97242_MEASUREMENT.operatorPositivityEstablished === false &&
      /NO QED/.test(IMP97242_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97242_HONEST_BANNER) &&
      /RH open/.test(IMP97242_HONEST_BANNER),
  },
];

for (const a of IMP97242_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97242-route-m-h2-weight-intercept-correction assertion failed: ${a.id}`,
    );
  }
}

export { IMP97242_ASSERTIONS };
