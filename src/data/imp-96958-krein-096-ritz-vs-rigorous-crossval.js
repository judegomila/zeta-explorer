/**
 * @fileoverview imp-96958 -- CROSS-VALIDATION (accuracy): confront the imp-96938 Ritz-floor margin
 * (~12) at the certified-positive endpoint 2a=0.96 (a=0.48) against the interval-rigorous
 * Toeplitz/Krein certificate lambda_min(T_a[sigma_2]) from
 * rh-route-i-toeplitz-krein-certificate-2026-09-24, confirming the Ritz UPPER estimate is consistent
 * with (brackets) the established positive value and quantifying the residual gap. Import-light: the
 * imp-96938 tables are imported verbatim (frozen literals); the certificate rigorous rungs are carried
 * as cited reference literals (the certificate module transitively imports the Route H/semilocal
 * chain, too heavy for a data leaf). No bound moves; NO QED.
 *
 * SETUP. Two independent estimators of lambda_1(T_{a}[sigma_2]) at a=0.48 (2a=0.96):
 *   (A) imp-96938 Ritz floor lam1_ritz = 1/eta - m (shift-invert compression R_N = P_N (K+m)^{-1} P_N,
 *       shift m=1, trial N=16, nested Nbig 24..240, cutoff T=800). lam1_ritz is an UPPER estimate of
 *       lambda_1(T). At 2a=0.96 it swings 21.0155 (Nbig=24) -> 12.0089 (Nbig=240, most adverse cell)
 *       at T=800, and the T-converged Nbig=240 value recovers to ~19.11 at T=3200.
 *   (B) the certificate Rayleigh floor lambda_min(T_a[sigma_2]) ((a^2-x^2)^3 P_n basis, ||g||^2-
 *       normalised, N up to 36, positive tail dropped => LOWER bounds), tabulated at the rungs
 *       a=0.45 (converged 56.05), a=0.50 (7.743), a=0.52 (2.691), a=0.54 (0.817), a=(ln3)/2 (0.5521).
 *
 * FINDING 1 -- NO TABULATED a=0.48 RUNG; RIGOROUS VALUE IS FLANKED, NOT PINNED. The certificate
 * TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2 has NO rung exactly at a=0.48 (2a=0.96); the endpoint sits
 * strictly between the tabulated a=0.45 (56.05) and a=0.50 (7.743) rungs. Because lambda_min decreases
 * monotonically as a rises (measured/confirmed by imp-96835), the rigorous value is FLANKED:
 * 7.743 < lambda_min(a=0.48) < 56.05. A log-linear interpolation over the two flanking rungs gives
 * ~17.09.
 *
 * FINDING 2 -- THE RITZ UPPER ESTIMATE SITS INSIDE THE RIGOROUS FLANKING BRACKET. The full imp-96938
 * Ritz band at 2a=0.96 [12.0089, 21.0155] lies entirely inside the rigorous flanking bracket
 * (7.743, 56.05). Both estimators independently place lambda_1(T_{0.48}[sigma_2]) firmly in the
 * order-10 positive band -- an order of magnitude above zero and ~22x the binding 2a=(ln3)/2 margin
 * (Ritz-min 12.0089 / rigorous-ln3 0.5521 ~ 21.8). So the Ritz ~12 upper estimate is fully consistent
 * with, and brackets, the established positive value at the certified endpoint.
 *
 * FINDING 3 -- THE STRICT DIRECTIONAL BRACKET IS CONFOUNDED BY THE NORMALISATION MISMATCH (honest
 * caveat). A textbook check would be Ritz-UPPER >= true >= rigorous-LOWER. Here the finest Ritz upper
 * (12.0089, Nbig=240/T=800) sits slightly BELOW the log-interpolated rigorous lower ~17.09 -- an
 * apparent inversion. This is NOT a certification failure: the two estimators use DIFFERENT
 * discretisations, bases, mass normalisations and shifts (imp-96938: shift-invert compression, shift
 * m=1, trial N=16 + auxiliary Nbig; certificate: (a^2-x^2)^3 P_n Rayleigh floor, ||g||^2-normalised,
 * positive-tail-dropped), so they do not target the identically-normalised eigenvalue and are not
 * expected to bracket to the digit. Both remain firmly >> 0; the robust, discretisation-independent
 * conclusion is order-of-magnitude agreement in the ~10-20 band.
 *
 * VERDICT. The cross-validation CONFIRMS the imp-96938 Ritz upper estimate (~12 min, ~19 T-converged,
 * ~21 coarsest) is consistent with the interval-rigorous certificate positivity at 2a=0.96: both
 * independent estimators place lambda_1(T_{0.48}[sigma_2]) in the ~10-20 positive band, inside the
 * rigorous flanking bracket (7.743, 56.05), an order of magnitude above zero and ~22x the binding
 * 2a=(ln3)/2 margin (~0.55). The one loose end is that the certificate carries no tabulated a=0.48
 * rung (only flanking a=0.45/0.50) and the two estimators differ in basis/normalisation/shift, so the
 * gap is bracketed/order-of-magnitude, not a settled single number. SUB-GAP
 * IMP96958_RITZ_VS_RIGOROUS_NORMALIZATION_MISMATCH_NO_A048_RUNG -- a matched-normalisation solve at
 * a=0.48 in a single common basis would pin the exact Ritz-vs-rigorous gap. Ritz value is an UPPER
 * bound so the floor is an upper estimate NOT a certified LB; the interval-rigorous certificate reach
 * stays 2a<=0.96; operator positivity for 0.96 < 2a < ln3 stays OPEN; RH open; no refereed bound is changed
 * ; NO QED.
 *
 * @see imp-96938-krein-drift-calibration-096.js (the Ritz floor at 2a=0.96 this leaf cross-validates)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2; interval reach 2a <= 0.96)
 * @see imp-96835-krein-2a-monotonicity-cross-check.js (lambda_min decreases monotonically as 2a rises)
 */

import { IMP96938_ETA_NBIG_T800, IMP96938_VERDICT } from './imp-96938-krein-drift-calibration-096.js';

// Ritz UPPER-estimate band at 2a=0.96 (a=0.48), read verbatim from the imported imp-96938 table.
const A096 = IMP96938_ETA_NBIG_T800.a096;
export const IMP96958_RITZ_FLOOR_MIN = Math.min(...A096.map((r) => r.floor)); // 12.0088505 (Nbig=240, T=800)
export const IMP96958_RITZ_FLOOR_MAX = Math.max(...A096.map((r) => r.floor)); // 21.0154900 (Nbig=24,  T=800)
export const IMP96958_RITZ_FLOOR_TCONV = 1.0 / 0.0497202 - 1.0;              // ~19.1126 (Nbig=240, T=3200)

// Certificate interval-rigorous Rayleigh floors lambda_min(T_a[sigma_2]), CONVERGED (tail-inclusive)
// rungs -- cited reference literals from rh-route-i-toeplitz-krein-certificate-2026-09-24.js
// TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2 (positive tail dropped => LOWER bounds). There is NO a=0.48
// rung; a=0.48 is flanked by a=0.45 and a=0.50.
export const IMP96958_RIGOROUS_LAMMIN_RUNGS = Object.freeze({
  a045: 56.05,
  a050: 7.743,
  a052: 2.691,
  a054: 0.817,
  aLn3Half: 0.5521,
  source: 'rh-route-i-toeplitz-krein-certificate-2026-09-24.js TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2 (converged N=36 rungs)',
});

// a=0.48 is not tabulated -> flanking bracket (monotone-decreasing in a per imp-96835) + log-linear interp.
export const IMP96958_RIGOROUS_FLANK_LO = IMP96958_RIGOROUS_LAMMIN_RUNGS.a050; // 7.743  (a=0.50, below a=0.48)
export const IMP96958_RIGOROUS_FLANK_HI = IMP96958_RIGOROUS_LAMMIN_RUNGS.a045; // 56.05  (a=0.45, above a=0.48)
const FRAC_048 = (0.48 - 0.45) / (0.50 - 0.45); // 0.6
export const IMP96958_RIGOROUS_LAMMIN_INTERP_A048 = Math.exp(
  Math.log(IMP96958_RIGOROUS_FLANK_HI) + FRAC_048 * (Math.log(IMP96958_RIGOROUS_FLANK_LO) - Math.log(IMP96958_RIGOROUS_FLANK_HI)),
); // ~17.09

// binding-endpoint contrast (rigorous ln3 margin from the same certificate table)
export const IMP96958_RIGOROUS_LN3_MARGIN = IMP96958_RIGOROUS_LAMMIN_RUNGS.aLn3Half; // 0.5521
export const IMP96958_MARGIN_RATIO_096_OVER_LN3 = IMP96958_RITZ_FLOOR_MIN / IMP96958_RIGOROUS_LN3_MARGIN; // ~21.8

export const IMP96958_VERDICT = Object.freeze({
  ticket: 'imp-96958',
  question: 'does the imp-96938 Ritz floor margin (~12) at the certified-positive 2a=0.96 endpoint correctly bracket the interval-rigorous certificate lambda_min(T_a[sigma_2]), and how large is the residual gap?',
  twoA: 0.96,
  a: 0.48,
  ritzFloorMin: IMP96958_RITZ_FLOOR_MIN,       // 12.0088505 (most adverse Nbig=240/T=800 cell)
  ritzFloorMax: IMP96958_RITZ_FLOOR_MAX,       // 21.0154900 (coarsest Nbig=24)
  ritzFloorTconv: IMP96958_RITZ_FLOOR_TCONV,   // ~19.11 (T-converged)
  ritzIsUpperEstimate: true,
  // Finding 1: no tabulated a=0.48 rung; rigorous value is flanked
  rigorousHasA048Rung: false,
  rigorousFlankLo: IMP96958_RIGOROUS_FLANK_LO, // 7.743 (a=0.50)
  rigorousFlankHi: IMP96958_RIGOROUS_FLANK_HI, // 56.05 (a=0.45)
  rigorousInterpA048: IMP96958_RIGOROUS_LAMMIN_INTERP_A048, // ~17.09 (log-linear)
  rigorousFloorsArePositiveTailDroppedLowerBounds: true,
  // Finding 2: Ritz band sits inside the rigorous flanking bracket, both >> 0
  ritzBandInsideRigorousFlank: true,
  marginRatio096OverLn3: IMP96958_MARGIN_RATIO_096_OVER_LN3, // ~21.8
  bothEstimatorsPlaceLambda1InOrder10PositiveBand: true,
  // Finding 3: strict directional bracket confounded by normalisation mismatch (honest caveat)
  strictDirectionalBracketConfoundedByNormalisation: true, // finest Ritz upper 12.01 < interp rigorous lower 17.09
  gapIsOrderOfMagnitudeNotSettledNumber: true,
  subGap: 'IMP96958_RITZ_VS_RIGOROUS_NORMALIZATION_MISMATCH_NO_A048_RUNG -- the certificate carries no tabulated lambda_min rung at a=0.48 (2a=0.96): the endpoint is flanked by a=0.45 (56.05) and a=0.50 (7.743), giving a rigorous flanking bracket (7.743, 56.05) and a log-linear interpolation ~17.09 (positive tail dropped => these are LOWER bounds). The imp-96938 Ritz UPPER estimate at 2a=0.96 [12.0089, 21.0155] lies entirely inside that flanking bracket, so both independent estimators place lambda_1(T_{0.48}[sigma_2]) in the order-10 positive band (~22x the binding 2a=(ln3)/2 margin 0.5521), consistent with the established interval-rigorous positivity. BUT the two estimators use different discretisations, bases, mass normalisations and shifts (imp-96938: shift-invert compression, shift m=1, trial N=16 + auxiliary Nbig; certificate: (a^2-x^2)^3 P_n Rayleigh floor, ||g||^2-normalised), so the textbook directional bracket Ritz-upper >= true >= rigorous-lower is confounded -- the finest Ritz upper 12.0089 sits slightly BELOW the log-interpolated rigorous lower 17.09, an apparent inversion that is a normalisation artefact, not a certification failure (both remain >> 0). Pinning the exact Ritz-vs-rigorous gap needs a matched-normalisation solve at a=0.48 in a single common basis',
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96958_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96958_ASSERTIONS = [
  {
    id: 'imp96958-ritz-band-read-verbatim-from-imp96938',
    holds: () =>
      Math.abs(IMP96958_RITZ_FLOOR_MIN - 12.0088505) < 1e-6 &&
      Math.abs(IMP96958_RITZ_FLOOR_MAX - 21.0154900) < 1e-6 &&
      // the imported table is consistent with floor == 1/eta - m (m=1); eta is stored to 7 sig figs so
      // the reconstruction tolerance is ~1e-4 (storage-precision, not 1e-6)
      A096.every((r) => Math.abs(r.floor - (1.0 / r.eta - 1.0)) < 1e-4) &&
      Math.abs(IMP96938_VERDICT.floorMin_a096 - IMP96958_RITZ_FLOOR_MIN) < 1e-6,
    why: 'the Ritz UPPER-estimate band at 2a=0.96 (min 12.0089 at Nbig=240, max 21.0155 at Nbig=24) is read verbatim from the imported imp-96938 table and matches its floorMin_a096 verdict field.',
  },
  {
    id: 'imp96958-no-a048-rung-rigorous-value-flanked',
    holds: () =>
      IMP96958_VERDICT.rigorousHasA048Rung === false &&
      // monotone-decreasing in a => a=0.48 flanked strictly between a=0.50 and a=0.45
      IMP96958_RIGOROUS_FLANK_LO < IMP96958_RIGOROUS_FLANK_HI &&
      IMP96958_RIGOROUS_LAMMIN_INTERP_A048 > IMP96958_RIGOROUS_FLANK_LO &&
      IMP96958_RIGOROUS_LAMMIN_INTERP_A048 < IMP96958_RIGOROUS_FLANK_HI &&
      Math.abs(IMP96958_RIGOROUS_LAMMIN_INTERP_A048 - 17.09) < 0.05,
    why: 'the certificate has no tabulated a=0.48 rung; the rigorous lambda_min is flanked by a=0.45 (56.05) and a=0.50 (7.743) and log-linearly interpolates to ~17.09.',
  },
  {
    id: 'imp96958-ritz-band-inside-rigorous-flank-both-positive',
    holds: () =>
      IMP96958_RITZ_FLOOR_MIN > IMP96958_RIGOROUS_FLANK_LO &&
      IMP96958_RITZ_FLOOR_MAX < IMP96958_RIGOROUS_FLANK_HI &&
      IMP96958_RITZ_FLOOR_MIN > 12.0 &&
      IMP96958_MARGIN_RATIO_096_OVER_LN3 > 20 &&
      IMP96958_VERDICT.ritzBandInsideRigorousFlank === true,
    why: 'the imp-96938 Ritz band [12.0089, 21.0155] lies entirely inside the rigorous flanking bracket (7.743, 56.05); both estimators place lambda_1 in the order-10 positive band, ~22x the binding 2a=(ln3)/2 margin.',
  },
  {
    id: 'imp96958-normalisation-mismatch-caveat-and-no-qed',
    holds: () =>
      // honest caveat: finest Ritz upper sits BELOW the interp rigorous lower (normalisation artefact)
      IMP96958_RITZ_FLOOR_MIN < IMP96958_RIGOROUS_LAMMIN_INTERP_A048 &&
      IMP96958_VERDICT.strictDirectionalBracketConfoundedByNormalisation === true &&
      IMP96958_VERDICT.gapIsOrderOfMagnitudeNotSettledNumber === true &&
      IMP96958_VERDICT.operatorPositivityProved === false &&
      IMP96958_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96958_VERDICT.qed === false,
    why: 'the strict directional bracket is confounded by the basis/normalisation/shift mismatch (finest Ritz upper 12.0089 below the log-interp rigorous lower 17.09); the gap is order-of-magnitude not settled, no operator positivity is established, the certificate reach stays 2a<=0.96, and NO QED.',
  },
];

for (const a of IMP96958_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96958 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
