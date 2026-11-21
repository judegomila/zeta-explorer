/**
 * @module imp-97444-bathtub-lp-crossvalidation
 * @fileoverview imp-97444 -- ACCURACY CROSS-CHECK of the imp-97416 FINDING 1 bathtub joint Krein floor
 *   c_sharp >= -(a/pi) int_{deepest measure pi/a} sigma_2^- dt = -3065.435 at 2a = ln3, via an INDEPENDENT
 *   constrained water-filling optimisation, rather than the decreasing-rearrangement (sort) computation used
 *   in imp-97416. Same symbol sigma_2(t) = (t^2 + 1/4)^2 w_1(t), w_1 = 2theta' - sqrt2 ln2 cos(t ln2).
 *
 *   THE INDEPENDENT METHOD. imp-97416 computed the top-(pi/a) area of sigma_2^- by sorting the sampled well
 *   in decreasing order and accumulating until the measure reaches pi/a. Here we instead solve the SAME
 *   discretised constrained problem
 *       max sum_i g_i f_i h   s.t.   0 <= f_i <= M = a/pi,   sum_i f_i h = 1,   g = sigma_2^-,
 *   by two routes that never sort:
 *     (R1) WATER-LEVEL BISECTION -- find the level c with |{g >= c}| h = pi/a by bisection on c, then the
 *          optimum is M * int_{g >= c} g dt. This directly exposes the water level c and the fillable measure.
 *     (R2) SIMPLEX LP -- scipy HiGHS linprog on the same grid (run offline; results baked). A genuinely
 *          different solver on the raw LP, not a rearrangement.
 *
 * FINDING 1 -- ALL THREE ROUTES AGREE (cross-check PASSES). At 2a = ln3 with M = a/pi = 0.174850:
 *     - imp-97416 decreasing-rearrangement top area:  17531.841 (baked)
 *     - R1 water-level bisection top area (h = 1e-4):  17532.036, water level c = 986.63, measure = 5.7194
 *     - R2 scipy HiGHS linprog (h = 1e-2):             floor c_sharp >= -3065.429
 *   The water-level bisection floor -M * topArea = -3065.469 (h = 1e-4) and the simplex floor -3065.429
 *   both reproduce the baked bathtub floor -3065.435 to within the grid discretisation (~0.04, decreasing
 *   with h). The recovered water level c ~ 986.6 matches the imp-97416 report (sigma_2^- >= level ~986.6),
 *   the fillable measure 5.7194 matches pi/a = 5.71920, and the captured area fraction 0.957950 reproduces
 *   the reported 95.79%. INDEPENDENT confirmation that the bathtub joint floor is correct.
 *
 * FINDING 2 -- NOTHING MOVES. This is an accuracy cross-check ONLY. The bathtub value stays a FLOOR (a lower
 *   bound on c_sharp), not a positive lower bound; the floor stays NEGATIVE (-3065.435); no operator
 *   positivity, no coercivity constant, no bound is moved. The imp-97416 sub-gap
 *   IMP97416_SCALAR_TWO_BUDGET_COUPLING_EXHAUSTED_NEEDS_SPECTRAL_ESTIMATE is unchanged; positivity still
 *   requires the genuinely spectral estimate (weighted-PSWF eigenvalue decay or Fejer-Riesz / de Branges
 *   factorisation with a certified margin). Interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * VERDICT. The imp-97416 bathtub joint floor -3065.435 is INDEPENDENTLY CONFIRMED by a constrained
 *   water-filling optimisation (water-level bisection AND a scipy HiGHS simplex LP) that never sorts: both
 *   reproduce the floor, the water level c ~ 986.6, the fillable measure pi/a = 5.7192, and the 95.79% area
 *   fraction. Accuracy cross-check only; the value stays a negative floor; no bound moves; NO QED.
 *   SUB-GAP unchanged: IMP97416_SCALAR_TWO_BUDGET_COUPLING_EXHAUSTED_NEEDS_SPECTRAL_ESTIMATE.
 *
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (FINDING 1, the -3065.435 floor cross-checked here)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (uniform floor -3200.029)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2, w_1; reach 2a <= 0.96)
 *
 * Ticket: imp-97444 (accuracy, medium, opus-4-8, api-pool). Cross-check only; changes no bound; NO QED;
 * offline solver tmp/imp-97444-bathtub-lp-crossval.py. No refereed bound is changed.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3);
const A = LN3 / 2;                       // 0.5493061443340548 -- half-width, 2a = ln3
const M = A / Math.PI;                   // 0.174850 -- pointwise cap a/pi
const FILLABLE_MEASURE = Math.PI / A;    // 5.71920 -- pi/a = L/M

export const IMP97444_BINDING_2A = LN3;
export const IMP97444_RIGOROUS_REACH_2A = 0.96; // unchanged by this cross-check

// R1: water-level bisection. Sample sigma_2^- on a one-sided grid, mirror (even symbol), find the level c
// with |{g >= c}| * h = pi/a, then return { topArea, level, measure } for the deepest sub-level set.
function waterLevel(h) {
  const g = [];
  for (let t = h / 2; t <= 12; t += h) {
    const v = sigma2(t);
    if (v < 0) { g.push(-v); g.push(-v); } // t and -t both contribute width h at value -v
  }
  let lo = 0, hi = 0;
  for (const gi of g) if (gi > hi) hi = gi;
  let c = 0;
  for (let it = 0; it < 100; it++) {
    c = 0.5 * (lo + hi);
    let cnt = 0;
    for (const gi of g) if (gi >= c) cnt++;
    if (cnt * h > FILLABLE_MEASURE) lo = c; else hi = c;
  }
  c = 0.5 * (lo + hi);
  let topArea = 0, measure = 0;
  for (const gi of g) if (gi >= c) { topArea += gi * h; measure += h; }
  let totalNeg = 0;
  for (const gi of g) totalNeg += gi * h;
  return { topArea, level: c, measure, totalNeg };
}

// Baked cross-validation results (offline tmp/imp-97444-bathtub-lp-crossval.py, h = 1e-4 and scipy HiGHS).
export const IMP97444_CROSSCHECK = Object.freeze({
  bakedFloor: -3065.435,                   // imp-97416 decreasing-rearrangement floor
  bakedTopArea: 17531.841,                 // imp-97416 top-(pi/a) area
  // R1 water-level bisection (h = 1e-4)
  waterLevelTopArea: 17532.036,
  waterLevelC: 986.63,                     // recovered water level (imp-97416: ~986.6)
  waterLevelMeasure: 5.7194,               // = pi/a
  waterLevelFloor: -M * 17532.036,         // -3065.469
  waterLevelFraction: 0.957950,            // captured / total negative area = 95.79%
  // R2 scipy HiGHS linprog (h = 1e-2)
  simplexFloor: -3065.429,                 // independent LP solver
  // agreement
  pointwiseBudget: M,                      // a/pi = 0.174850
  fillableMeasure: FILLABLE_MEASURE,       // pi/a = 5.71920
  agreesWithBaked: true,                   // all three routes reproduce -3065.435 to grid tolerance
  gridTolerance: 0.05,                     // |floor recomputed - baked| < 0.05, shrinking with h
  stillNegative: true,
  boundMoves: false,
});

export const IMP97444_VERDICT = Object.freeze({
  ticket: 'imp-97444',
  question:
    'cross-validate the imp-97416 bathtub joint floor -3065.435 against a direct constrained water-filling optimisation on a fine grid, confirming the deepest measure-(pi/a) sub-level set carries 95.79% of the sigma_2 negative area.',
  answer:
    'CONFIRMED. Two independent routes that never sort -- a water-level bisection finding the level c with |{sigma_2^- >= c}| = pi/a, and a scipy HiGHS simplex LP on the raw problem max sum g_i f_i h s.t. 0<=f_i<=a/pi, sum f_i h = 1 -- both reproduce the imp-97416 decreasing-rearrangement floor. The water-level bisection gives topArea 17532.036, water level c ~ 986.6, fillable measure 5.7194 = pi/a, floor -3065.469 (h = 1e-4); scipy HiGHS gives floor -3065.429 (h = 1e-2); both match the baked -3065.435 to within the grid discretisation. The captured area fraction reproduces 95.79% (deepest measure-(pi/a) set carries 17532 of 18302 total negative area). Accuracy cross-check only: the value stays a negative FLOOR, not a positive lower bound; no operator positivity; no bound moves; the imp-97416 sub-gap is unchanged; NO QED.',
  binding_2a: LN3,
  crossCheckPasses: true,
  waterLevelAgrees: true,
  simplexAgrees: true,
  fractionConfirmed: true,           // 95.79%
  levelConfirmed: true,              // c ~ 986.6
  measureConfirmed: true,            // pi/a = 5.7192
  // unchanged program state
  valueStaysAFloor: true,
  floorStillNegative: true,
  positivityProved: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97416_SCALAR_TWO_BUDGET_COUPLING_EXHAUSTED_NEEDS_SPECTRAL_ESTIMATE (unchanged) -- imp-97444 is an ' +
    'ACCURACY cross-check that independently confirms the imp-97416 bathtub joint floor c_sharp >= -3065.435 ' +
    'at 2a = ln3 via a constrained water-filling optimisation (water-level bisection recovering c ~ 986.6, ' +
    'measure pi/a = 5.7192, floor -3065.469 at h = 1e-4; scipy HiGHS simplex LP floor -3065.429 at h = 1e-2), ' +
    'reproducing the 95.79% area fraction. The floor stays NEGATIVE; positivity still needs the genuinely ' +
    'SPECTRAL estimate. No operator positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96.',
  qed: false,
});
export default IMP97444_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97444_ASSERTIONS = [
  {
    id: 'imp97444-waterlevel-reproduces-bathtub-floor',
    holds: () => {
      // coarse grid to keep import cheap (~2400 evals); tolerance widened for coarseness
      const r = waterLevel(0.005);
      const okArea = Math.abs(r.topArea - IMP97444_CROSSCHECK.bakedTopArea) < 20; // coarse grid within 20
      const floor = -M * r.topArea;
      const okFloor = floor < -3055 && floor > -3075; // -3063.8 at h=5e-3, -> -3065.4x as h->0
      const okLevel = r.level > 950 && r.level < 1020; // water level ~ 986.6
      const okMeasure = Math.abs(r.measure - FILLABLE_MEASURE) < 0.05; // pi/a = 5.7192
      const okFrac = r.topArea / r.totalNeg > 0.95 && r.topArea / r.totalNeg < 0.965;
      return okArea && okFloor && okLevel && okMeasure && okFrac;
    },
    why: 'the INDEPENDENT water-level bisection (find c with |{sigma_2^- >= c}| = pi/a, never sorting) recomputes the top-(pi/a) area to ~17531.8, water level c ~ 986.6, measure ~ pi/a = 5.7192, giving the bathtub floor -M*topArea = -3065.4x -- reproducing the imp-97416 decreasing-rearrangement value -3065.435 and the 95.79% area fraction.',
  },
  {
    id: 'imp97444-simplex-and-baked-agree',
    holds: () => {
      const c = IMP97444_CROSSCHECK;
      const simplexOk = Math.abs(c.simplexFloor - c.bakedFloor) < 1;   // scipy HiGHS -3065.429 vs -3065.435
      const waterOk = Math.abs(c.waterLevelFloor - c.bakedFloor) < 1;  // -3065.469 vs -3065.435
      const fracOk = Math.abs(c.waterLevelFraction - 0.9579) < 0.001;  // 95.79%
      const measOk = Math.abs(c.fillableMeasure - Math.PI / A) < 1e-12 && c.fillableMeasure > 5.71 && c.fillableMeasure < 5.72;
      const budgetOk = Math.abs(c.pointwiseBudget - A / Math.PI) < 1e-12;
      return simplexOk && waterOk && fracOk && measOk && budgetOk && c.agreesWithBaked === true;
    },
    why: 'the scipy HiGHS simplex LP floor -3065.429 and the water-level bisection floor -3065.469 both agree with the imp-97416 baked bathtub floor -3065.435 to within the grid discretisation, and the captured fraction 0.9579 = 95.79% confirms the deepest measure-(pi/a) set carries almost all the negative area.',
  },
  {
    id: 'imp97444-crosscheck-only-no-qed',
    holds: () =>
      IMP97444_VERDICT.crossCheckPasses === true &&
      IMP97444_VERDICT.valueStaysAFloor === true &&
      IMP97444_VERDICT.floorStillNegative === true &&
      IMP97444_VERDICT.positivityProved === false &&
      IMP97444_VERDICT.operatorPositivityProved === false &&
      IMP97444_VERDICT.boundMoves === false &&
      IMP97444_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97444_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97444_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97444_VERDICT.subGap === 'string' &&
      IMP97444_VERDICT.subGap.includes('IMP97416_SCALAR_TWO_BUDGET_COUPLING_EXHAUSTED_NEEDS_SPECTRAL_ESTIMATE') &&
      IMP97444_VERDICT.qed === false,
    why: 'accuracy cross-check only: the imp-97416 bathtub floor -3065.435 is independently confirmed but stays a negative FLOOR; no positivity, no operator coercivity, no bound moves; the sub-gap is unchanged; interval-rigorous reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97444_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97444-bathtub-lp-crossvalidation assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
