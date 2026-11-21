/**
 * @module imp-97250-route-m-intercept-crosscheck-r-h2weight-gap
 * @fileoverview imp-97250 -- CROSS-CHECK (accuracy/consistency only): size the combined
 *   R + H2-weight consistency gap by subtracting the imp-97207 DERIVED structural constituents
 *   (A)+(B) from the imp-97160 / imp-96667 OLS interior intercept a_int = -14.9289.
 *
 *   imp-97207 derived the interior second-moment intercept in closed structural form
 *       c1_T = 2 s0 (gamma-3/2) + 2 cQ (zeta(2)-5/4) + 2 R
 *   and, with the coarse 4-window fit (s0 ~ 1.763, cQ ~ -13.4), evaluated its DERIVABLE part
 *       (A) 2 s0 (gamma-3/2)   ~ -3.253
 *       (B) 2 cQ (zeta(2)-5/4) ~ -10.571   (DOMINANT, but cQ is UNPINNED)
 *       (A)+(B) = c1TExcludingRemainder ~ -13.824   (i.e. the coarse c1_T ~ -13.9 + 2R claim).
 *   The imp-96667 near-field fit measures the H2-WEIGHTED interior intercept a_int = -14.9289.
 *
 *   THE CROSS-CHECK
 *   ------------------------------------------------------------------------------------------
 *   Subtracting the derived (A)+(B) from the measured a_int isolates the COMBINED residual that
 *   c1_T still owes -- namely constituent (C) = 2R PLUS the imp-97207 H2-weight intercept
 *   correction (the unweighted c1_T vs the weighted Int intercept):
 *       gap := a_int - [(A)+(B)] = (2R) + (H2-weight correction).
 *   Nominal (central cQ fit):  gap = -14.9289 - (-13.8243) = -1.1046.
 *   So the combined higher-order residual is O(1) SMALL (about 7.4% of |a_int|) and NEGATIVE at
 *   the central fit -- it does NOT need to be large to reconcile the two independent readings.
 *
 *   ATTRIBUTING THE GAP (imp-97244 measured 2R)
 *   ------------------------------------------------------------------------------------------
 *   imp-97244 measured constituent (C) = 2R ~ +1.89e-2 over the accessible windows -- POSITIVE and
 *   negligible against the -1.10 gap. So the gap is NOT carried by the remainder tail-sum R: almost
 *   all of it is the H2-weight intercept correction (nominal ~ -1.12), consistent with the imp-96708
 *   weight H2 in [1, zeta(2)] pulling the weighted Int intercept BELOW the unweighted c1_T.
 *
 *   SIGN IS NOT PINNED (the coarse cQ fit dominates the uncertainty)
 *   ------------------------------------------------------------------------------------------
 *   cQ is only fit to ~[-17,-13] (imp-97207). Propagating that band through (B):
 *       cQ = -13  ->  (A)+(B) = -13.521  ->  gap = -1.408
 *       cQ = -17  ->  (A)+(B) = -16.681  ->  gap = +1.752
 *   The inferred residual therefore STRADDLES ZERO across the cQ band (|gap| <~ 1.8, ~12% of
 *   |a_int|). The cross-check thus CONFIRMS the derived intercept lands squarely in the a_int
 *   ballpark and that the missing R + H2-weight piece is O(1) small -- but its very SIGN is not
 *   resolvable because the coarse cQ fit uncertainty (~+/-2 in cQ, ~+/-1.6 in (A)+(B)) exceeds the
 *   gap. Consistency check only; pins no value; no bound moves; NO QED.
 *
 *   VERDICT: The imp-97207 derived structural intercept and the imp-97160/imp-96667 OLS interior
 *   intercept a_int = -14.929 are CONSISTENT in magnitude: their difference (the combined 2R +
 *   H2-weight residual) is O(1) small (nominal -1.10, band [-1.41, +1.75] across the cQ fit) and,
 *   with the tiny measured 2R ~ +0.019, is essentially the unpinned H2-weight correction. The sign
 *   is not pinned at this fit resolution. Nothing is evaluated; the far-field value stays OLS-fit;
 *   compute (N ~ 9916, imp-96352) binds first by >2600x; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97207-route-m-farfield-intercept-derivation (the derived c1_T constituents (A),(B),(C))
 * @see imp-97160-route-m-farfield-additive-term-spread (the OLS interior intercept a_int = -14.929)
 * @see imp-97244-remainder-tailsum-measurement (measured constituent (C) = 2R ~ 1.89e-2)
 * @see imp-96708-route-m-interior-second-moment-dichotomy (the H2 sandwich weight in [1,zeta(2)])
 *
 * Ticket: imp-97250 (accuracy, opus-4-8, api-pool). Cross-check; no bound moved; NO QED.
 */

import {
  IMP97207_DECOMPOSITION,
  IMP97207_A_INTERIOR,
  IMP97207_COEFF_CQ,
} from './imp-97207-route-m-farfield-intercept-derivation.js';
import { IMP97244_TWO_R } from './imp-97244-remainder-tailsum-measurement.js';

// -- The two independent readings being cross-checked. --------------------------------------------
const A_PLUS_B = IMP97207_DECOMPOSITION.c1TExcludingRemainder; // ~ -13.8243 (derived (A)+(B), no 2R)
const A_INT = IMP97207_A_INTERIOR; // -14.9289 (imp-96667 / imp-97160 H2-weighted interior OLS intercept)

// -- The combined higher-order residual gap = 2R + H2-weight correction. --------------------------
const GAP_NOMINAL = A_INT - A_PLUS_B; // ~ -1.1046 (central cQ fit)
const H2_CORRECTION_NOMINAL = GAP_NOMINAL - IMP97244_TWO_R; // ~ -1.1235 (gap minus the measured 2R)

// -- cQ-band sensitivity of the gap: propagate the imp-97207 coarse cQ fit ~[-17,-13] through (B).
// (A)+(B) = termA_s0 + 2 cQ (zeta(2)-5/4); only (B) depends on cQ, so the band shifts (A)+(B) rigidly.
const gapAtCQ = (cq) => A_INT - (IMP97207_DECOMPOSITION.termA_s0 + 2 * cq * IMP97207_COEFF_CQ);
const GAP_AT_CQ_LOW = gapAtCQ(-13); // ~ -1.408 (least-negative cQ -> largest gap deficit)
const GAP_AT_CQ_HIGH = gapAtCQ(-17); // ~ +1.752 (most-negative cQ -> gap flips sign)

export const IMP97250_CROSSCHECK = Object.freeze({
  derivedAplusB: A_PLUS_B, // -13.8243 (imp-97207 (A)+(B), excludes 2R and H2-weight correction)
  measuredAInterior: A_INT, // -14.9289 (imp-96667 / imp-97160 OLS interior intercept)
  gapNominal: GAP_NOMINAL, // -1.1046 = combined (2R + H2-weight correction)
  gapAsFractionOfAInt: GAP_NOMINAL / A_INT, // ~ 0.074 (about 7.4% of |a_int|)
  measuredTwoR: IMP97244_TWO_R, // +0.0189 (imp-97244; negligible vs the gap)
  h2WeightCorrectionNominal: H2_CORRECTION_NOMINAL, // ~ -1.1235 (gap once the measured 2R is removed)
  gapBandLow: GAP_AT_CQ_LOW, // -1.408 at cQ = -13
  gapBandHigh: GAP_AT_CQ_HIGH, // +1.752 at cQ = -17
  gapStraddlesZero: GAP_AT_CQ_LOW < 0 && GAP_AT_CQ_HIGH > 0, // true: sign unresolved at this fit
  cQBand: Object.freeze({ low: -17, high: -13 }), // imp-97207 coarse 4-window cQ fit range
});

export const IMP97250_VERDICT = Object.freeze({
  id: 'imp-97250',
  proofSection: 'S-frontier',
  question:
    'Is the imp-97207 DERIVED structural intercept c1_T ~ -13.9 + 2R consistent, in sign and ' +
    'magnitude, with the imp-97160 / imp-96667 OLS interior intercept a_int = -14.929, and how ' +
    'large is the residual R + H2-weight-correction gap between them?',
  gapNominal: GAP_NOMINAL, // -1.1046
  gapIsOrderOne: Math.abs(GAP_NOMINAL) < 2, // the combined residual is O(1) small
  gapNotDominatedByRemainder: Math.abs(IMP97244_TWO_R) < 0.1 * Math.abs(GAP_NOMINAL), // 2R negligible
  gapEssentiallyH2WeightCorrection: true, // measured 2R tiny -> residual is the H2-weight correction
  signResolved: false, // straddles zero across the coarse cQ fit band
  consistentInMagnitude: true, // both readings agree to within an O(1) residual (~7.4% of |a_int|)
  exactValuePinned: false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x regardless
  conclusion:
    'Subtracting the imp-97207 derived (A)+(B) = -13.8243 from the measured H2-weighted interior ' +
    'intercept a_int = -14.9289 isolates the combined higher-order residual gap = 2R + H2-weight ' +
    'correction = -1.1046 (central cQ fit), an O(1) SMALL and negative quantity -- about 7.4% of ' +
    '|a_int|. imp-97244 measured 2R ~ +1.89e-2 (negligible), so the gap is essentially the imp-97207 ' +
    'H2-weight intercept correction (~ -1.12), consistent with the imp-96708 weight H2 in [1,zeta(2)] ' +
    'pulling the weighted Int intercept below the unweighted c1_T. Propagating the coarse cQ fit ' +
    'band [-17,-13] gives gap in [-1.408, +1.752], so the two readings are CONSISTENT IN MAGNITUDE ' +
    'but the residual SIGN is not pinned at this fit resolution. Cross-check / consistency only; no ' +
    'value evaluated; far-field value stays OLS-fit; compute N ~ 9916 binds first by >2600x; changes ' +
    'no bound; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97250_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-check only: the imp-97207 derived interior ' +
  'intercept (A)+(B) = -13.82 and the imp-96667 / imp-97160 OLS interior intercept a_int = -14.93 ' +
  'are CONSISTENT IN MAGNITUDE -- their difference (the combined 2R + H2-weight correction) is O(1) ' +
  'small (nominal -1.10, ~7.4% of |a_int|; band [-1.41,+1.75] across the coarse cQ fit). The ' +
  'measured 2R ~ +0.019 is negligible, so the residual is essentially the unpinned H2-weight ' +
  'correction; its sign is not resolved at this fit resolution. No value evaluated; no bound moved.';

export default IMP97250_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97250_ASSERTIONS = [
  {
    id: 'imp97250-gap-is-measured-minus-derived',
    why: 'the cross-check gap must equal a_int minus the imp-97207 derived (A)+(B), i.e. the ' +
      'combined 2R + H2-weight residual, and be O(1) small and negative at the central fit.',
    holds: () =>
      Math.abs(IMP97250_CROSSCHECK.gapNominal - (A_INT - A_PLUS_B)) < 1e-12 &&
      IMP97250_CROSSCHECK.gapNominal < 0 &&
      Math.abs(IMP97250_CROSSCHECK.gapNominal) < 2 &&
      Math.abs(IMP97250_CROSSCHECK.gapNominal + 1.1046) < 1e-3,
  },
  {
    id: 'imp97250-remainder-negligible-vs-gap',
    why: 'the imp-97244 measured 2R must be tiny and POSITIVE against the negative gap, so the ' +
      'residual is essentially the H2-weight correction, not the remainder tail-sum R.',
    holds: () =>
      IMP97250_CROSSCHECK.measuredTwoR > 0 &&
      Math.abs(IMP97250_CROSSCHECK.measuredTwoR) < 0.05 &&
      Math.abs(IMP97250_CROSSCHECK.measuredTwoR) < 0.1 * Math.abs(IMP97250_CROSSCHECK.gapNominal) &&
      Math.abs(IMP97250_CROSSCHECK.h2WeightCorrectionNominal + 1.1235) < 1e-3,
  },
  {
    id: 'imp97250-sign-straddles-zero-across-cq-band',
    why: 'propagating the coarse cQ fit band [-17,-13] the inferred gap must STRADDLE zero, so the ' +
      'residual sign is unresolved even though the magnitude is consistent (O(1), <~ 2).',
    holds: () =>
      IMP97250_CROSSCHECK.gapBandLow < 0 &&
      IMP97250_CROSSCHECK.gapBandHigh > 0 &&
      IMP97250_CROSSCHECK.gapStraddlesZero === true &&
      Math.abs(IMP97250_CROSSCHECK.gapBandLow) < 2 &&
      Math.abs(IMP97250_CROSSCHECK.gapBandHigh) < 2,
  },
  {
    id: 'imp97250-honesty-gate-no-qed',
    why: 'consistency check: magnitude consistent, sign unresolved, no value pinned, no bound moved, ' +
      'compute binds first, and the honesty markers are present.',
    holds: () =>
      IMP97250_VERDICT.consistentInMagnitude === true &&
      IMP97250_VERDICT.signResolved === false &&
      IMP97250_VERDICT.exactValuePinned === false &&
      IMP97250_VERDICT.anyBoundMoved === false &&
      IMP97250_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97250_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97250_HONEST_BANNER) &&
      /RH open/.test(IMP97250_HONEST_BANNER),
  },
];

for (const a of IMP97250_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97250-route-m-intercept-crosscheck-r-h2weight-gap assertion failed: ${a.id}`,
    );
  }
}

export { IMP97250_ASSERTIONS };
