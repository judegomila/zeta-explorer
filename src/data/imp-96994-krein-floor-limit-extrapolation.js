/**
 * @fileoverview imp-96994 -- NUMERICAL: decide the imp-96977 SUB-GAP IMP96977_TRUE_LIMIT_UNSETTLED
 * by attempting to extrapolate the finite-N (N = [20, 28, 36]) positive-tail-dropped Rayleigh floors
 * to the true infinite-dim lambda_min at each certified rung 2a in [0.90, 1.00], via a
 * convergence-rate (Richardson / Aitken / 3-point power-law) fit with a fit-uncertainty band.
 *
 * RESULT (honest partial, indeterminate): the N <= 36 triples are PRE-ASYMPTOTIC -- they have NOT
 * entered a convergent tail -- so every standard 3-point extrapolant returns an UNPHYSICAL limit.
 * The sub-gap IMP96977_TRUE_LIMIT_UNSETTLED therefore STAYS OPEN; a reliable true-limit estimate
 * REQUIRES the wider N-ladder (imp-96998, still pending). NO QED.
 *
 * CONTEXT. imp-96977 tabulated, at N = [20, 28, 36], the interval-rigorous Rayleigh floors of the
 * Route I Toeplitz/Krein certificate lambda_min(T_a[sigma_2]) across a in {0.45 .. 0.50}
 * (2a in {0.90 .. 1.00}), pinning the a=0.48 (2a=0.96) certified endpoint at 18.636 (N=36). It
 * flagged that these are finite-N Rayleigh UPPER bounds monotone decreasing in N, NOT the true
 * infinite-dim lambda_min, and left SUB-GAP IMP96977_TRUE_LIMIT_UNSETTLED unextrapolated.
 *
 * METHOD. For each rung take the floor triple (l1, l2, l3) at N = [20, 28, 36] (equally spaced,
 * step h = 8) and apply three convergence-rate models:
 *   (A) Aitken Delta^2 (geometric: l_N - L ~ C r^N):  L = l3 - (l3-l2)^2 / ((l3-l2)-(l2-l1)).
 *       Well-posed only if the successive-increment ratio r = (l3-l2)/(l2-l1) lies in (0, 1)
 *       AND the returned L sits BELOW l3 (a decreasing sequence must converge downward).
 *   (B) 3-point power-law (l_N = L + C N^-p): solve the increment-ratio equation
 *       (l1-l2)/(l2-l3) = (N1^-p - N2^-p)/(N2^-p - N3^-p) for p, then back out L. A finite limit
 *       requires p > 0 (else N^-p grows and the model diverges).
 *   (C) linear-in-1/N Richardson on the last two points as a coarse cross-check.
 *
 * FINDING 1 -- THE SECOND FINITE DIFFERENCE IS NON-CONVERGENT AT EVERY RUNG. The per-step increments
 * d1 = l2-l1, d2 = l3-l2 do NOT shrink toward zero the way a convergent tail demands; at the four
 * higher-2a rungs the drop ACCELERATES (|d2| > |d1|), and at the two lower rungs it is essentially
 * constant. The increment ratio r = d2/d1 by rung:
 *   2a=0.90 r=1.005 (flat) | 0.92 r=0.955 | 0.94 r=1.141 | 0.96 r=1.444 | 0.98 r=1.490 | 1.00 r=1.221.
 * Geometric convergence needs 0 < r < 1; only 2a=0.92 is inside that window, and even there the
 * Aitken limit is negative (see Finding 2). The sequences are pre-asymptotic.
 *
 * FINDING 2 -- AITKEN Delta^2 RETURNS UNPHYSICAL LIMITS AT EVERY RUNG. For a monotone-decreasing
 * upper-bound sequence the true limit must lie BELOW l3(=N=36). Instead Aitken gives:
 *   2a=0.90 -> 727.226 (>> l3, absurd) | 0.92 -> -6.504 (negative) | 0.94 -> 40.772 (> l3) |
 *   0.96 -> 22.861 (> l3=18.636) | 0.98 -> 15.109 (> l3=12.213) | 1.00 -> 11.068 (> l3=7.743).
 * Every value is either negative or ABOVE the last computed floor -- the diagnostic that the data is
 * not yet geometric.
 *
 * FINDING 3 -- THE 3-POINT POWER-LAW FIT HAS A NEGATIVE EXPONENT AT EVERY RUNG (DIVERGENT MODEL).
 * Solving for p gives p < 0 uniformly (2a=0.90 p=-1.017 | 0.92 p=-0.840 | 0.94 p=-1.457 |
 * 0.96 p=-2.281 | 0.98 p=-2.390 | 1.00 p=-1.693); a negative exponent means the N^-p term GROWS with
 * N, so the model has no finite N -> infinity limit and its formal extrapolant L (70.6, 51.3, 32.9,
 * 21.6, 14.3, 9.5) again sits ABOVE the descending finite-N floors -- confirming Finding 2.
 *
 * FINDING 4 -- THE ONLY DEFENSIBLE STATEMENTS. (i) The true lambda_min is BELOW the N=36 floor at
 * each rung (upper-bound property, rigorous). (ii) For 2a <= 0.96 the true lambda_min is > 0 by the
 * INDEPENDENT interval-rigorous certificate (imp-96977 / rh-route-i-toeplitz-krein-certificate reach
 * 2a <= 0.96), NOT by this floor sequence. (iii) Because the floors are still descending with
 * non-shrinking increments, HOW FAR below l3 the limit lies is UNDETERMINED from N <= 36: the honest
 * fit-uncertainty band at 2a=0.96 is the open interval (0, 18.636], i.e. the ticket premise "does the
 * extrapolated limit stay comfortably positive (order 10)?" CANNOT be answered up or down from this
 * data. Positivity at 2a <= 0.96 is already secured by the certificate, independent of this question.
 *
 * SCOPE. Extrapolation/analysis only; consumes the imp-96977 baked floors, computes no new spectra,
 * moves no bound. The sub-gap IMP96977_TRUE_LIMIT_UNSETTLED STAYS OPEN pending the wider N-ladder
 * (imp-96998). Interval-rigorous certificate reach stays exactly 2a <= 0.96; operator positivity for
 * 0.96 < 2a < ln3 stays OPEN; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96977-krein-intermediate-rungs.js (the finite-N floor table + the sub-gap this leaf attacks)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (analyticObstruction: the uniform-in-N spectral gap)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// N-ladder of the imp-96977 floors (equally spaced, step h = 8).
export const IMP96994_N_LADDER = Object.freeze([20, 28, 36]);

// The imp-96977 finite-N floor triples per rung (positive-tail-dropped Rayleigh UPPER bounds).
export const IMP96994_FLOORS = Object.freeze([
  { twoA: 0.90, floors: [62.593, 59.332, 56.055] },
  { twoA: 0.92, floors: [44.273, 41.975, 39.781] },
  { twoA: 0.94, floors: [30.684, 29.260, 27.635] },
  { twoA: 0.96, floors: [20.836, 19.936, 18.636] }, // certified endpoint
  { twoA: 0.98, floors: [13.804, 13.165, 12.213] },
  { twoA: 1.00, floors: [8.838, 8.345, 7.743] },
]);

// Aitken Delta^2 geometric extrapolation (equally spaced): L = l3 - (l3-l2)^2 / ((l3-l2)-(l2-l1)).
export function aitkenLimit([l1, l2, l3]) {
  const d1 = l2 - l1;
  const d2 = l3 - l2;
  return l3 - (d2 * d2) / (d2 - d1);
}

// Successive-increment ratio r = (l3-l2)/(l2-l1). Geometric convergence needs 0 < r < 1.
export function incrementRatio([l1, l2, l3]) {
  return (l3 - l2) / (l2 - l1);
}

// Baked convergence-rate diagnostics per rung (Aitken limit, increment ratio, power-law exponent p,
// power-law formal limit L). p and L from the 3-point power-law solve l_N = L + C N^-p (Finding 3).
export const IMP96994_DIAGNOSTICS = Object.freeze([
  { twoA: 0.90, floorN36: 56.055, ratioR: 1.005, aitkenL: 727.226, powerP: -1.017, powerL: 70.586 },
  { twoA: 0.92, floorN36: 39.781, ratioR: 0.955, aitkenL: -6.504, powerP: -0.840, powerL: 51.305 },
  { twoA: 0.94, floorN36: 27.635, ratioR: 1.141, aitkenL: 40.772, powerP: -1.457, powerL: 32.934 },
  { twoA: 0.96, floorN36: 18.636, ratioR: 1.444, aitkenL: 22.861, powerP: -2.281, powerL: 21.616 },
  { twoA: 0.98, floorN36: 12.213, ratioR: 1.490, aitkenL: 15.109, powerP: -2.390, powerL: 14.322 },
  { twoA: 1.00, floorN36: 7.743, ratioR: 1.221, aitkenL: 11.068, powerP: -1.693, powerL: 9.480 },
]);

export const IMP96994_VERDICT = Object.freeze({
  ticket: 'imp-96994',
  question: 'extrapolate the imp-96977 finite-N (N up to 36) positive-tail-dropped Rayleigh floors to the true infinite-dim lambda_min at each 2a in [0.90,1.00], with a fit-uncertainty band, and decide whether the limit stays comfortably positive (order 10)',
  method: 'three 3-point convergence-rate models on the N=[20,28,36] triples: Aitken Delta^2 (geometric), 3-point power-law l_N = L + C N^-p, and linear-in-1/N Richardson',
  nLadder: IMP96994_N_LADDER,
  diagnostics: IMP96994_DIAGNOSTICS,
  secondDifferenceNonConvergent: true,       // increments flat-or-growing at every rung (Finding 1)
  aitkenUnphysicalEveryRung: true,           // negative or above-l3 at every rung (Finding 2)
  powerLawExponentNegativeEveryRung: true,   // p < 0 => divergent model at every rung (Finding 3)
  extrapolationIndeterminate: true,          // no model reaches a finite limit below l3
  trueLimitBelowN36Floor: true,              // rigorous: floors are upper bounds decreasing in N
  positivityAt096FromIndependentCertificate: true, // 2a<=0.96 positive via the certificate, not this fit
  comfortablyPositiveOrder10Decidable: false,      // ticket premise cannot be answered from N<=36
  subGapClosed: false,
  subGap: 'IMP96977_TRUE_LIMIT_UNSETTLED STAYS OPEN -- the N<=36 floor triples are pre-asymptotic (non-convergent second differences), so Aitken and 3-point power-law both return unphysical limits (negative, or above the descending finite-N floor); the true lambda_min cannot be reliably extrapolated from this data. A wider N-ladder (imp-96998) is required to reach the geometric tail.',
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96994_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96994_ASSERTIONS = [
  {
    id: 'imp96994-floors-monotone-decreasing-in-N',
    holds: () => IMP96994_FLOORS.every((r) => r.floors[0] > r.floors[1] && r.floors[1] > r.floors[2]),
    why: 'the imp-96977 floors are finite-N Rayleigh UPPER bounds, strictly monotone decreasing in N at every rung -- the true lambda_min lies below each N=36 value.',
  },
  {
    id: 'imp96994-aitken-unphysical-every-rung',
    holds: () =>
      IMP96994_FLOORS.every((r) => {
        const L = aitkenLimit(r.floors);
        // physical geometric limit would satisfy 0 < L < l3; assert every rung VIOLATES this
        return !(L > 0 && L < r.floors[2]);
      }),
    why: 'at every rung the Aitken Delta^2 limit is either negative or ABOVE the last computed floor l3 -- impossible for a convergent decreasing upper-bound sequence, so the geometric model does not apply at N<=36.',
  },
  {
    id: 'imp96994-increment-ratio-not-geometric',
    holds: () =>
      IMP96994_FLOORS.every((r) => {
        const rr = incrementRatio(r.floors);
        const diag = IMP96994_DIAGNOSTICS.find((d) => Math.abs(d.twoA - r.twoA) < 1e-9);
        // recomputed ratio matches the baked diagnostic; and no rung is a clean geometric contraction
        // with a physical Aitken limit (0<r<1 AND 0<L<l3 simultaneously)
        const matches = Math.abs(rr - diag.ratioR) < 0.01;
        const L = aitkenLimit(r.floors);
        const cleanGeometric = rr > 0 && rr < 1 && L > 0 && L < r.floors[2];
        return matches && !cleanGeometric;
      }),
    why: 'the successive-increment ratios reproduce the baked diagnostics and NO rung is a clean geometric contraction (0<r<1 with a physical limit) -- the second finite difference is non-convergent, the sequences are pre-asymptotic.',
  },
  {
    id: 'imp96994-power-law-exponent-negative-every-rung',
    holds: () =>
      IMP96994_DIAGNOSTICS.every((d) => d.powerP < 0 && d.powerL > d.floorN36),
    why: 'the 3-point power-law fit yields a NEGATIVE exponent p<0 at every rung (divergent model, N^-p grows), and its formal limit sits ABOVE the descending N=36 floor -- confirming no finite extrapolated limit exists from N<=36.',
  },
  {
    id: 'imp96994-subgap-open-no-qed',
    holds: () =>
      IMP96994_VERDICT.extrapolationIndeterminate === true &&
      IMP96994_VERDICT.subGapClosed === false &&
      IMP96994_VERDICT.comfortablyPositiveOrder10Decidable === false &&
      IMP96994_VERDICT.operatorPositivityProved === false &&
      IMP96994_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96994_VERDICT.qed === false,
    why: 'the extrapolation is indeterminate from N<=36, the sub-gap IMP96977_TRUE_LIMIT_UNSETTLED stays OPEN, no operator positivity is added, the interval-rigorous reach stays 2a<=0.96, and NO QED.',
  },
];

for (const a of IMP96994_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96994 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
