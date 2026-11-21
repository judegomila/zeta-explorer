/**
 * @fileoverview imp-96948 -- MARGIN LADDER (numerical): sweep the imp-96938 Ritz floor-margin across
 * intermediate 2a rungs {0.96, 1.00, 1.04, 1.06, ln3} on the SAME pole-free Gegenbauer Galerkin build
 * to locate where the certified ~12 positivity margin (2a=0.96) collapses toward the ~0.5 open-case
 * margin (2a=ln3), and whether it degrades smoothly or has a knee approaching ln3. imp-96938 measured
 * the floor only at the two endpoints and found the drift DIRECTION is scheme-generic and the ABSOLUTE
 * floor MARGIN is the only discriminant; this leaf fills in the intermediate 2a rungs. Driver
 * tmp/imp-96948-margin-ladder.py, /tmp/rhvenv scipy 1.18; reuses the imp-96938/imp-96911/imp-96889/
 * imp-96768 pole-free build VERBATIM. eta is the top eigenvalue of the compression
 * R_N = P_N (K+m)^{-1} P_N in a nested Nbig space at cutoff T; the Ritz floor lam1_ritz = 1/eta - m is
 * an UPPER bound on lambda_1(T), so the floor is an upper estimate NOT a certified LB. Measurement
 * only. NO QED.
 *
 * SETUP. Fixed N=16, shift m=1, cutoff T=800, nested-Nbig ladder 24..240, floor(2a) reported at the
 * most adverse cell Nbig=240 (where the floor sits lowest for a fixed 2a, per imp-96938 Finding 1).
 * The 2a=0.96 and 2a=ln3 rows reproduce the imp-96938 IMP96938_ETA_NBIG_T800 floors to 6 digits
 * (12.008850 at 2a=0.96, 0.475605 at 2a=ln3 -- a reproduction cross-check).
 *
 * FINDING 1 -- THE MARGIN DEGRADES SMOOTHLY AND MONOTONICALLY, NO KNEE. The adverse (Nbig=240) Ritz
 * floor falls monotonically across the whole 2a ladder: 12.0089 (2a=0.96) -> 4.5254 (2a=1.00) ->
 * 1.4084 (2a=1.04) -> 0.7911 (2a=1.06) -> 0.4756 (2a=ln3). There is NO sudden knee approaching ln3 --
 * the decay is continuous, and in fact the steepest fractional drops happen EARLY (just past the
 * certified reach), not near ln3.
 *
 * FINDING 2 -- THE COLLAPSE IS FRONT-LOADED, NOT AT ln3. The inter-rung ratio of the adverse floor is
 * SMALLEST right after leaving the certified endpoint (0.96->1.00 ratio 0.3768; 1.00->1.04 ratio
 * 0.3112) and RISES toward ln3 (1.04->1.06 ratio 0.5617; 1.06->ln3 ratio 0.6012). So the margin loses
 * most of its size in the first 0.08 of 2a beyond the certified reach (12.01 -> 1.41, a ~8.5x drop
 * over 2a in [0.96,1.04]), then the decay decelerates as it approaches ln3. The open ln3 case sits in
 * the SHALLOW tail of the collapse, not at a cliff edge.
 *
 * FINDING 3 -- THE MARGIN CROSSES ORDER-UNITY WELL BEFORE ln3. The adverse floor drops below 1.0
 * between 2a=1.04 (1.4084) and 2a=1.06 (0.7911), i.e. near 2a~1.05, so by the time 2a reaches ln3
 * (~1.0986) the margin (0.4756) is already an order of magnitude below the certified-endpoint value.
 * The Ritz floor stays POSITIVE (as an upper estimate) at every rung, but positivity of an upper
 * estimate is not a certified LB, so this says nothing about the sign of the true lambda_1 past the
 * certified reach.
 *
 * VERDICT. Filling in the imp-96938 floor-margin between the certified-positive 2a=0.96 endpoint and
 * the open 2a=ln3 case shows the ~12 margin collapses to ~0.5 SMOOTHLY and MONOTONICALLY with 2a, with
 * NO knee near ln3: adverse (Nbig=240) floors 12.0089 -> 4.5254 -> 1.4084 -> 0.7911 -> 0.4756 across
 * 2a in {0.96,1.00,1.04,1.06,ln3}. The collapse is FRONT-LOADED -- the steepest fractional drop is
 * right past the certified reach (ratio 0.377 then 0.311 per 0.04 step) and the decay DECELERATES
 * toward ln3 (ratio 0.562 then 0.601), so ln3 lies in the shallow tail of the collapse, not at a
 * cliff. The margin falls through order-unity near 2a~1.05, well before ln3. This sharpens imp-96938
 * SUB-GAP IMP96938_DRIFT_DIRECTION_IS_SCHEME_GENERIC_MARGIN_IS_THE_ONLY_DISCRIMINANT by mapping the
 * margin(2a) profile: the discriminating quantity decays as a smooth front-loaded curve, so the open
 * case is separated from the certified case by a continuous margin loss rather than a threshold event.
 * SUB-GAP IMP96948_MARGIN_COLLAPSE_IS_SMOOTH_FRONT_LOADED_NO_KNEE_AT_LN3.
 * Ritz value is an UPPER bound (floor is an upper estimate, not a certified LB); interval-rigorous
 * certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96938-krein-drift-calibration-096.js (the two-endpoint calibration this leaf fills in)
 * @see imp-96911-krein-eta-nconvergence-scout.js (the ln3-only coupled-(N,T) drift)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; interval reach 2a <= 0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// interval-rigorous certificate reach (unchanged by this measurement)
export const IMP96948_RIGOROUS_REACH_2A = 0.96;
export const IMP96948_SHIFT_M = 1.0;
export const IMP96948_T_CUTOFF = 800.0;
export const IMP96948_N_TRIAL = 16;
export const IMP96948_NBIG_ADVERSE = 240; // most adverse cell (floor lowest for fixed 2a)

// adverse (Nbig=240) Ritz floor at fixed N=16, m=1, T=800 across the 2a ladder.
// floor = 1/eta - m is an UPPER estimate on lambda_1(T), NOT a certified LB.
// The 2a=0.96 and 2a=ln3 rows reproduce imp-96938 to 6 digits (12.008850 / 0.475605).
export const IMP96948_MARGIN_LADDER = Object.freeze([
  Object.freeze({ twoA: 0.96, a: 0.480000, floorAdverse: 12.008850, floorNbig24: 21.015490, swing: 9.006640 }),
  Object.freeze({ twoA: 1.00, a: 0.500000, floorAdverse: 4.525400, floorNbig24: 8.812825, swing: 4.287425 }),
  Object.freeze({ twoA: 1.04, a: 0.520000, floorAdverse: 1.408415, floorNbig24: 3.119627, swing: 1.711212 }),
  Object.freeze({ twoA: 1.06, a: 0.530000, floorAdverse: 0.791130, floorNbig24: 1.724768, swing: 0.933638 }),
  Object.freeze({ twoA: LN3, a: 0.549306, floorAdverse: 0.475605, floorNbig24: 0.607102, swing: 0.131497 }),
]);

// inter-rung ratios of the adverse floor (knee detector): smaller ratio == steeper fractional drop.
// ratios RISE toward ln3, so the collapse is front-loaded (steepest just past the certified reach).
export const IMP96948_ADVERSE_FLOOR_RATIOS = Object.freeze([
  Object.freeze({ step: '0.96->1.00', ratio: 0.376839 }),
  Object.freeze({ step: '1.00->1.04', ratio: 0.311224 }),
  Object.freeze({ step: '1.04->1.06', ratio: 0.561717 }),
  Object.freeze({ step: '1.06->ln3', ratio: 0.601172 }),
]);

export const IMP96948_VERDICT = Object.freeze({
  ticket: 'imp-96948',
  question: 'where between the certified-positive 2a=0.96 endpoint (floor ~12) and the open 2a=ln3 case (floor ~0.5) does the imp-96938 Ritz floor-margin collapse, and does it degrade smoothly or with a knee ?',
  shift_m: 1.0,
  T_cutoff: 800.0,
  N_trial: 16,
  Nbig_adverse: 240,
  // Finding 1: smooth monotone decay, no knee
  floorMonotoneDecreasing: true, // 12.0089 -> 4.5254 -> 1.4084 -> 0.7911 -> 0.4756
  hasKneeNearLn3: false,
  // Finding 2: front-loaded collapse (steepest fractional drop right past the certified reach)
  collapseIsFrontLoaded: true,   // inter-rung ratios rise 0.3768 -> 0.3112 -> 0.5617 -> 0.6012 toward ln3
  steepestFractionalDropStep: '1.00->1.04', // ratio 0.311224 (smallest ratio == steepest drop)
  // Finding 3: margin crosses order-unity near 2a~1.05, well before ln3
  floorMax_a096: 12.008850,      // 2a=0.96, Nbig=240
  floorMin_ln3: 0.475605,        // 2a=ln3,  Nbig=240
  orderUnityCrossing2A: 1.05,    // adverse floor passes below 1.0 between 2a=1.04 and 2a=1.06
  floorPositiveAtAllRungs: true, // upper estimate stays > 0 (NOT a certified LB)
  reproducesImp96938Endpoints: true, // 12.008850 (0.96) and 0.475605 (ln3) match imp-96938 to 6 digits
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96948_MARGIN_COLLAPSE_IS_SMOOTH_FRONT_LOADED_NO_KNEE_AT_LN3 -- filling in the imp-96938 Ritz floor-margin between the certified-positive 2a=0.96 endpoint and the open 2a=ln3 case shows the ~12 margin collapses to ~0.5 SMOOTHLY and MONOTONICALLY with 2a: adverse (Nbig=240, N=16, m=1, T=800) floors 12.0089 (2a=0.96) -> 4.5254 (2a=1.00) -> 1.4084 (2a=1.04) -> 0.7911 (2a=1.06) -> 0.4756 (2a=ln3), the endpoints reproducing imp-96938 to 6 digits. There is NO knee near ln3 -- the collapse is FRONT-LOADED: the inter-rung fractional drop is steepest right past the certified reach (ratio 0.3768 then 0.3112 per 0.04 step over 2a in [0.96,1.04], an ~8.5x floor drop) and DECELERATES toward ln3 (ratio 0.5617 then 0.6012), so the open ln3 case sits in the shallow tail of the collapse, not at a cliff edge. The adverse floor falls through order-unity near 2a~1.05, well before ln3, and stays positive at every rung -- but positivity of an UPPER estimate is not a certified LB, so this says nothing about the sign of the true lambda_1 past the certified reach. This sharpens imp-96938 IMP96938_DRIFT_DIRECTION_IS_SCHEME_GENERIC_MARGIN_IS_THE_ONLY_DISCRIMINANT by mapping the margin(2a) profile: the discriminating quantity decays as a smooth front-loaded curve, so the open case is separated from the certified case by a continuous margin loss rather than a threshold event',
  qed: false,
});
export default IMP96948_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96948_ASSERTIONS = [
  {
    id: 'imp96948-reproduces-imp96938-endpoints',
    holds: () => {
      const first = IMP96948_MARGIN_LADDER[0];
      const last = IMP96948_MARGIN_LADDER[IMP96948_MARGIN_LADDER.length - 1];
      // 2a=0.96 adverse floor matches imp-96938 floorMin_a096 12.0088505; 2a=ln3 matches floorMin_ln3 0.4756055
      return Math.abs(first.twoA - 0.96) < 1e-9 &&
        Math.abs(first.floorAdverse - 12.0088505) < 1e-4 &&
        Math.abs(last.twoA - LN3) < 1e-9 &&
        Math.abs(last.floorAdverse - 0.4756055) < 1e-4 &&
        IMP96948_VERDICT.reproducesImp96938Endpoints === true;
    },
    why: 'the ladder endpoints reproduce imp-96938 to 6 digits (adverse floor 12.008850 at 2a=0.96 and 0.475605 at 2a=ln3), confirming the same pole-free Gegenbauer build is used.',
  },
  {
    id: 'imp96948-floor-monotone-decreasing-no-knee',
    holds: () => {
      const g = IMP96948_MARGIN_LADDER;
      for (let i = 1; i < g.length; i++) {
        if (!(g[i].twoA > g[i - 1].twoA)) return false;         // 2a increasing
        if (!(g[i].floorAdverse < g[i - 1].floorAdverse)) return false; // floor strictly falling
      }
      return IMP96948_VERDICT.floorMonotoneDecreasing === true &&
        IMP96948_VERDICT.hasKneeNearLn3 === false;
    },
    why: 'the adverse (Nbig=240) Ritz floor falls monotonically as 2a increases (12.0089 -> 4.5254 -> 1.4084 -> 0.7911 -> 0.4756), a smooth decay with no sudden knee near ln3.',
  },
  {
    id: 'imp96948-collapse-is-front-loaded',
    holds: () => {
      const r = IMP96948_ADVERSE_FLOOR_RATIOS;
      // the smallest ratio (steepest fractional drop) is one of the EARLY steps, not the last one
      const minRatio = Math.min(...r.map((x) => x.ratio));
      const lastRatio = r[r.length - 1].ratio;
      // the two early ratios are both below the two late ratios (front-loaded collapse)
      const frontLoaded = r[0].ratio < r[2].ratio && r[1].ratio < r[3].ratio && r[1].ratio < r[2].ratio;
      return minRatio < lastRatio && frontLoaded &&
        IMP96948_VERDICT.collapseIsFrontLoaded === true;
    },
    why: 'the inter-rung fractional drop of the adverse floor is steepest right past the certified reach (ratios 0.3768, 0.3112) and decelerates toward ln3 (0.5617, 0.6012), so the collapse is front-loaded and ln3 sits in its shallow tail.',
  },
  {
    id: 'imp96948-margin-crosses-unity-before-ln3-and-no-qed',
    holds: () => {
      const g = IMP96948_MARGIN_LADDER;
      const at104 = g.find((x) => Math.abs(x.twoA - 1.04) < 1e-9);
      const at106 = g.find((x) => Math.abs(x.twoA - 1.06) < 1e-9);
      // adverse floor passes below 1.0 between 2a=1.04 and 2a=1.06, i.e. before ln3 (~1.0986)
      const crossesBeforeLn3 = at104.floorAdverse > 1.0 && at106.floorAdverse < 1.0 && 1.06 < LN3;
      return crossesBeforeLn3 &&
        IMP96948_VERDICT.floorPositiveAtAllRungs === true &&
        g.every((x) => x.floorAdverse > 0) &&
        IMP96948_VERDICT.operatorPositivityProved === false &&
        IMP96948_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
        IMP96948_RIGOROUS_REACH_2A === 0.96 &&
        IMP96948_VERDICT.qed === false;
    },
    why: 'the adverse floor drops through order-unity near 2a~1.05 (1.4084 at 2a=1.04, 0.7911 at 2a=1.06), well before ln3, and stays positive at every rung -- but the floor is an UPPER estimate not a certified LB, no operator positivity is established, and the interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP96948_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96948 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
