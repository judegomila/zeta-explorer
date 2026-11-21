/**
 * @module imp-97564-realizability-fraction-resolution-sweep
 * @fileoverview imp-97564 -- EXTEND the imp-97457 realizable-psi search to higher resolution to test whether the
 *   43.84% attainment fraction (best band-limited psi vs the bathtub envelope) SATURATES or CLIMBS. imp-97457
 *   measured R = lambda_max(P_a M_{sigma_2^-} P_a) = 1343.796 on grids h = 0.02/0.01/0.005, window t in [-12,12],
 *   giving realizable/bathtub = 43.84%, and reported it "grid-stable to ~1e-3". This leaf separates the two
 *   resolution axes -- grid spacing h and window half-width T -- and finds they behave completely differently.
 *
 * FINDING 1 -- GRID REFINEMENT (h -> 0 at T = 12) CONFIRMS 43.84% IS GRID-CONVERGED. Refining h from 0.02 down
 *   to 0.0025 (N = 1200 -> 9600) leaves the fraction pinned at 0.43837 to five digits (R = 1343.78/1343.796/
 *   1343.795/1343.795; envelope 3065.43): the imp-97457 grid-stability claim is correct. So the finer grid does
 *   NOT climb -- 43.84% is the exact converged value FOR THE [-12,12] WINDOW.
 *
 * FINDING 2 -- THE WINDOW WAS THE HIDDEN TRUNCATION: WIDENING T CLIMBS THE FRACTION TO ~0.51. Holding h = 0.01
 *   (grid-converged) and widening the window T = 12 -> 64 makes R climb monotonically 1343.796 -> 1489.564 ->
 *   1514.830 -> 1531.402 -> 1541.827 -> 1549.627, with the fraction climbing 0.43837 -> 0.48592 -> 0.49417 ->
 *   0.49957 -> 0.50297 -> 0.50552. The increments decelerate (+145.8, +25.3, +16.6, +10.4, +7.8), and a 1/T
 *   Richardson extrapolation from the last two rungs gives R_inf ~ 1573 (fraction ~ 0.513). So the imp-97457
 *   43.84% was a [-12,12] WINDOW-TRUNCATION artifact -- a band-limited psi (which cannot be compactly supported)
 *   captures more of the wells when given more room -- and the true realizable fraction is ~0.51, not 0.4384.
 *
 * FINDING 3 -- THE REALIZABILITY GAP PERSISTS (STILL ~HALF), BUT IS SMALLER THAN imp-97457 MEASURED. Even at the
 *   extrapolated R_inf ~ 1573 the realizable psi still captures only ~51% of the 3065.43 envelope, so the
 *   qualitative imp-97457 verdict survives: band-limitedness is a LARGE loss, not a minor correction, and the
 *   realizable negative-part floor stays finite and far above the bathtub floor -3065.435. But the deeper measured
 *   R shifts the imp-97457 gap attribution: the realizable floor is c_sharp >= -R with R ~ 1550 (T=64) trending to
 *   ~1573, deeper than the reported -1343.796, so the realizability SHARE of the gap (envelope - R ~ 1492 -> ~1515,
 *   was +1721.639) SHRINKS toward parity with the far-field share (R + c_sharp ~ 1550 -> ~1573), and the ordering
 *   imp-97457 called "realizability slightly the larger" moves to approximate parity / a mild far-field lead.
 *
 * VERDICT. The imp-97457 43.84% fraction does NOT saturate: it is a GRID-CONVERGED but WINDOW-TRUNCATED value.
 *   Grid refinement (h -> 0) confirms 43.84% exactly at T = 12, but widening the window climbs the fraction
 *   monotonically to 0.50552 at T = 64 and a 1/T extrapolation puts the infinite-line limit at ~0.513 (R_inf ~
 *   1573). The realizable psi still captures only ~half the bathtub envelope, so the realizability gap persists
 *   and the qualitative imp-97457 conclusion holds, but the realizable negative-part floor is deeper (~ -1573
 *   extrapolated vs the reported -1343.796) and the realizability/far-field gap shares move toward parity. This is
 *   a MEASUREMENT: R is a finite-section IEEE-double / Lanczos eigenvalue on a truncated window, not an interval
 *   enclosure, and R_inf is a 1/T extrapolation, not a certified limit; no rigorous bound is promoted; the scalar
 *   bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96;
 *   no refereed bound is changed; RH open; NO QED.
 *   SUB-GAP IMP97564_REALIZABLE_FRACTION_WINDOW_LIMIT_NEEDS_CERTIFIED_INFINITE_LINE_EIGENVALUE.
 *
 * @see imp-97457-krein-bathtub-realizability-gap.js (the 43.84% T=12 measurement this extends and corrects)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (bathtub floor -3065.435; item (a) band-limit obstruction)
 * @see imp-97414-krein-full-projector-second-moment-execution.js (full P_a M_sigma2 P_a; unbounded above)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2; pole-free Weil positivity; reach 2a<=0.96)
 *
 * Runners: tmp/imp-97564-resolution-sweep.py (grid axis + first window rungs), tmp/imp-97564-window-tail.py
 *   (window tail T up to 64). numpy sinc-projector matrix, scipy eigsh (k=1, largest algebraic) for N>3000,
 *   mpmath dps=30 symbol; venv /tmp/rhvenv. Measurement only; NO QED.
 * Ticket: imp-97564 (numerical, medium, opus-4-8). Changes no bound; no refereed bound is changed.
 */

import { IMP97457_REALIZABILITY } from './imp-97457-krein-bathtub-realizability-gap.js';

const LN3 = Math.log(3);
const A = LN3 / 2;

export const IMP97564_BINDING_2A = LN3;
export const IMP97564_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement

// Baked from tmp/imp-97564-resolution-sweep.py -- grid refinement at fixed window T=12.
// Columns: h, N, R = lambda_max(P_a M_sigma2^- P_a), envelope = (a/pi)*topArea, fraction = R/envelope.
export const IMP97564_GRID_LADDER = Object.freeze([
  Object.freeze({ h: 0.02,   N: 1200, R: 1343.7790, envelope: 3065.4676, fraction: 0.43836 }),
  Object.freeze({ h: 0.01,   N: 2400, R: 1343.7963, envelope: 3065.4290, fraction: 0.43837 }),
  Object.freeze({ h: 0.005,  N: 4800, R: 1343.7955, envelope: 3065.4335, fraction: 0.43837 }),
  Object.freeze({ h: 0.0025, N: 9600, R: 1343.7947, envelope: 3065.4343, fraction: 0.43837 }),
]);

// Baked from tmp/imp-97564-resolution-sweep.py + tmp/imp-97564-window-tail.py -- window widening at fixed
// (grid-converged) spacing h=0.01. Envelope is window-independent (deepest measure pi/a only).
export const IMP97564_WINDOW_LADDER = Object.freeze([
  Object.freeze({ T: 12, N: 2400,  R: 1343.7963, envelope: 3065.4290, fraction: 0.43837 }),
  Object.freeze({ T: 20, N: 4000,  R: 1489.5641, envelope: 3065.4290, fraction: 0.48592 }),
  Object.freeze({ T: 28, N: 5600,  R: 1514.8301, envelope: 3065.4290, fraction: 0.49417 }),
  Object.freeze({ T: 36, N: 7200,  R: 1531.4020, envelope: 3065.4290, fraction: 0.49957 }),
  Object.freeze({ T: 48, N: 9600,  R: 1541.8268, envelope: 3065.4290, fraction: 0.50297 }),
  Object.freeze({ T: 64, N: 12800, R: 1549.6271, envelope: 3065.4290, fraction: 0.50552 }),
]);

// 1/T Richardson extrapolation of R from the last two window rungs (T=48, T=64): R(T) = R_inf - c/T.
const _t1 = IMP97564_WINDOW_LADDER[IMP97564_WINDOW_LADDER.length - 2];
const _t2 = IMP97564_WINDOW_LADDER[IMP97564_WINDOW_LADDER.length - 1];
const _c = (_t2.R - _t1.R) / (1 / _t1.T - 1 / _t2.T);
const EXTRAP_R_INF = _t2.R + _c / _t2.T;                     // ~1573.0 (1/T extrapolation, NOT certified)
const ENVELOPE = _t2.envelope;                               // 3065.429
const EXTRAP_FRACTION = EXTRAP_R_INF / ENVELOPE;            // ~0.513

export const IMP97564_RESOLUTION = Object.freeze({
  // Finding 1 -- grid refinement saturates the fraction exactly at T=12.
  gridConvergedFractionT12: 0.43837,                         // stable across h = 0.02..0.0025
  gridStableTo: 1e-4,
  // Finding 2 -- window widening climbs the fraction; 43.84% was a truncation artifact.
  windowFractionT12: IMP97564_WINDOW_LADDER[0].fraction,     // 0.43837 (imp-97457 window)
  windowFractionT64: _t2.fraction,                           // 0.50552 (widest measured)
  windowFractionClimbs: true,
  extrapR_inf: EXTRAP_R_INF,                                 // ~1573 (1/T Richardson)
  extrapFraction: EXTRAP_FRACTION,                           // ~0.513
  envelope: ENVELOPE,                                        // 3065.429
  // Finding 3 -- gap persists (~half) but is smaller than imp-97457 measured.
  imp97457WindowFraction: IMP97457_REALIZABILITY.realizableFraction, // 0.4384 (parent, T=12)
  imp97457ReportedR: IMP97457_REALIZABILITY.realizableNegIntegral,   // 1343.796 (parent, T=12)
  extrapRealizableFloor: -EXTRAP_R_INF,                      // ~ -1573 (deeper than parent -1343.796)
  realizabilityGapPersists: true,                            // still only ~half the envelope
  measuredNotIntervalCertified: true,
});

export const IMP97564_VERDICT = Object.freeze({
  ticket: 'imp-97564',
  question:
    'extend the imp-97457 realizable-psi search to higher band-limit resolution: does the 43.84% attainment fraction (best band-limited psi vs the bathtub envelope) saturate near 43.84% or keep climbing toward the -3065.435 envelope?',
  answer:
    'it does NOT saturate at 43.84% -- that value is grid-converged but window-truncated. Refining the grid h from 0.02 to 0.0025 at the imp-97457 window T=12 pins the fraction at 0.43837 to five digits (R stable ~1343.795), confirming the imp-97457 grid-stability. But holding h=0.01 and widening the window T=12->64 climbs R monotonically 1343.796->1549.627 and the fraction 0.43837->0.50552 (decelerating increments), and a 1/T Richardson extrapolation gives R_inf ~ 1573, fraction ~ 0.513. So the 43.84% was a [-12,12] truncation artifact: a band-limited psi (never compactly supported) captures more of the wells given more room, and the true realizable fraction is ~0.51. The realizable psi still captures only ~half the 3065.43 envelope, so the imp-97457 realizability gap persists and the qualitative "band-limitedness is a large loss" verdict holds; but the realizable negative-part floor is deeper (c_sharp >= -R ~ -1573 extrapolated, vs the reported -1343.796), which shrinks the realizability share of the imp-97457 gap attribution toward parity with the far-field share. Measurement only: R is a finite-section IEEE-double/Lanczos eigenvalue on a truncated window and R_inf is a 1/T extrapolation, neither an interval enclosure; no rigorous bound promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.',
  binding_2a: LN3,
  gridConvergedFractionT12: 0.43837,
  windowFractionT64: _t2.fraction,
  extrapR_inf: EXTRAP_R_INF,
  extrapFraction: EXTRAP_FRACTION,
  extrapRealizableFloor: -EXTRAP_R_INF,
  realizabilityGapPersists: true,
  fractionIsWindowTruncationArtifact: true,
  // measurement-only guardrails
  measuredNotIntervalCertified: true,
  rigorousLowerBoundPromoted: false,
  operatorPositivityProved: false,
  scalarBoundStillNegativeFloor: true,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP97564_REALIZABLE_FRACTION_WINDOW_LIMIT_NEEDS_CERTIFIED_INFINITE_LINE_EIGENVALUE',
  qed: false,
});
export default IMP97564_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Kept import-light: no eigenvalue recompute (heavy). Assertions verify the baked ladders are internally
// consistent (fraction = R/envelope), the two resolution axes behave as reported, and the guardrails hold.

const IMP97564_ASSERTIONS = [
  {
    id: 'imp97564-grid-refinement-saturates-fraction',
    holds: () => {
      // every grid rung reproduces fraction = R/envelope, and the fraction is flat across h at T=12
      const consistent = IMP97564_GRID_LADDER.every(
        (r) => Math.abs(r.fraction - r.R / r.envelope) < 5e-5,
      );
      const fracs = IMP97564_GRID_LADDER.map((r) => r.fraction);
      const spread = Math.max(...fracs) - Math.min(...fracs);
      const flat = spread < 5e-5;                                   // grid-converged
      const nearParentT12 = Math.abs(fracs[1] - IMP97457_REALIZABILITY.realizableFraction) < 2e-3;
      return consistent && flat && nearParentT12;
    },
    why: 'grid refinement h=0.02..0.0025 at T=12 pins the fraction at 0.43837 (spread <5e-5), reproducing the imp-97457 43.84% and confirming it is grid-converged for the [-12,12] window.',
  },
  {
    id: 'imp97564-window-widening-climbs-fraction',
    holds: () => {
      const L = IMP97564_WINDOW_LADDER;
      const consistent = L.every((r) => Math.abs(r.fraction - r.R / r.envelope) < 5e-5);
      // R strictly increases with T, and the fraction climbs strictly above the T=12 value
      let monotone = true;
      for (let i = 1; i < L.length; i++) {
        if (!(L[i].R > L[i - 1].R) || !(L[i].fraction > L[i - 1].fraction)) monotone = false;
      }
      const climbed = L[L.length - 1].fraction - L[0].fraction > 0.05; // 0.438 -> 0.506
      // increments decelerate (the fraction is saturating, not running away to 1)
      const d1 = L[1].R - L[0].R;
      const dLast = L[L.length - 1].R - L[L.length - 2].R;
      const decelerating = dLast < d1;
      return consistent && monotone && climbed && decelerating;
    },
    why: 'widening T=12->64 at fixed grid h=0.01 climbs R 1343.8->1549.6 and the fraction 0.43837->0.50552 monotonically with decelerating increments -- the 43.84% was a window-truncation artifact, and the fraction saturates near ~0.51 rather than at 0.4384.',
  },
  {
    id: 'imp97564-extrapolated-fraction-still-below-envelope',
    holds: () => {
      const R = IMP97564_RESOLUTION;
      // 1/T extrapolation exceeds the widest measured R but stays well below the full envelope
      const above = R.extrapR_inf > IMP97564_WINDOW_LADDER[IMP97564_WINDOW_LADDER.length - 1].R;
      const belowEnvelope = R.extrapR_inf < R.envelope;
      const fractionAboveHalf = R.extrapFraction > 0.5 && R.extrapFraction < 0.55; // ~0.513
      const floorDeeperThanParent = R.extrapRealizableFloor < -R.imp97457ReportedR; // -1573 < -1343.8
      const gapPersists = R.realizabilityGapPersists === true;
      return above && belowEnvelope && fractionAboveHalf && floorDeeperThanParent && gapPersists;
    },
    why: 'the 1/T Richardson limit R_inf ~ 1573 (fraction ~ 0.513) exceeds the widest measured R yet captures only ~half the 3065.43 envelope, so the realizability gap persists while the realizable floor (~ -1573) is deeper than the imp-97457 -1343.796.',
  },
  {
    id: 'imp97564-measurement-only-no-qed',
    holds: () =>
      IMP97564_VERDICT.measuredNotIntervalCertified === true &&
      IMP97564_VERDICT.rigorousLowerBoundPromoted === false &&
      IMP97564_VERDICT.operatorPositivityProved === false &&
      IMP97564_VERDICT.scalarBoundStillNegativeFloor === true &&
      IMP97564_VERDICT.boundMoves === false &&
      IMP97564_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97564_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97564_BINDING_2A - LN3) < 1e-12 &&
      IMP97564_VERDICT.subGap === 'IMP97564_REALIZABLE_FRACTION_WINDOW_LIMIT_NEEDS_CERTIFIED_INFINITE_LINE_EIGENVALUE' &&
      IMP97564_VERDICT.qed === false,
    why: 'measurement only: R is a finite-section IEEE-double/Lanczos eigenvalue on a truncated window and R_inf is a 1/T extrapolation, not interval enclosures, so no rigorous bound is promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97564_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97564-realizability-fraction-resolution-sweep assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
