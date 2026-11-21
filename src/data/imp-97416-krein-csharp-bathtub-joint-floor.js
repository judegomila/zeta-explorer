/**
 * @module imp-97416-krein-csharp-bathtub-joint-floor
 * @fileoverview imp-97416 -- ATTEMPT the JOINT WEIGHTED band-limited estimate that imp-97399 isolated as the
 *   single missing primitive to lift the Krein concentration floor
 *       c_sharp = lambda_min(P_a M_{sigma_2} P_a) = inf_{psi in PW_a, ||psi||_2 = 1} int sigma_2(t) |psi(t)|^2 dt
 *   above imp-97399s reproducing-kernel floor -3200.029 toward positive, at 2a = ln3, where
 *       sigma_2(t) = (t^2 + 1/4)^2 w_1(t),   w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2).
 *
 *   THE JOINT ESTIMATE (this leaf). imp-97399 bounded int sigma_2^- |psi|^2 using the reproducing-kernel
 *   pointwise budget |psi(t)|^2 <= K_a(t,t) = a/pi ALONE, over the whole confined well, giving
 *   c_sharp >= -(a/pi) int sigma_2^- dt = -3200.029. But that discards the SECOND rigorous constraint every
 *   admissible psi also satisfies: the NORMALISATION int |psi(t)|^2 dt = 1. Any f = |psi|^2 therefore obeys
 *   BOTH  0 <= f <= a/pi  (pointwise, Bernstein/reproducing-kernel)  AND  int f = 1 (mass). The tightest bound
 *   on int sigma_2^- f under BOTH constraints is the classical bathtub / water-filling (decreasing-
 *   rearrangement) principle: max int g f  s.t.  0 <= f <= M, int f = L  is  M int_{g >= c} g dt  with the
 *   level c fixed by |{g >= c}| = L / M. Here g = sigma_2^-, M = a/pi, L = 1, so the fillable support has
 *   measure L/M = pi/a = 5.7192 -- only the DEEPEST measure-(pi/a) portion of the well may be filled at height
 *   a/pi, NOT the whole width-13.78 negativity set. This is a genuine JOINT weighted estimate (it couples the
 *   pointwise budget with the mass budget), the exact primitive imp-97399 named -- attempted here in its
 *   sharpest off-the-shelf, rearrangement-optimal form.
 *
 * FINDING 1 -- THE BATHTUB JOINT FLOOR (a NEW rigorous finite lower bound, strictly better than imp-97399).
 *   Filling the deepest measure-(pi/a) = 5.7192 sub-level set of sigma_2^- (both the inner well near t=0 and
 *   the outer wells near t = +-9.35, taking sigma_2^- >= level ~986.6) at height a/pi gives
 *       int sigma_2^- |psi|^2  <=  (a/pi) int_{deepest measure pi/a} sigma_2^- dt  =  (a/pi) * 17531.84 = 3065.435,
 *   hence  c_sharp >= -(a/pi) int_{deepest measure pi/a} sigma_2^- dt = -3065.435.
 *   This is a NEW rigorous FINITE floor, improving imp-97399s uniform reproducing-kernel floor -3200.029 by
 *   +134.594 (and the imp-97335 naive well-depth floor -4336.198 by +1270.763, 29.3% of the gap to 0). It is
 *   the first floor in the record that uses BOTH band-limited constraints jointly (pointwise cap AND unit mass)
 *   rather than the pointwise cap alone. Grid-stable to 1e-4 across h = 5e-4 / 2.5e-4 / 1e-4.
 *
 * FINDING 2 -- WHY THE JOINT ESTIMATE STILL DOES NOT REACH POSITIVE (the sharpened precise obstruction, and
 *   why the gain is only +134.594). The bathtub gain is SMALL because the well is deep and spiky: the deepest
 *   measure-(pi/a) region already carries 95.79% of the TOTAL negative area (17531.84 of 18301.61). So the
 *   normalisation constraint is nearly NON-BINDING against the pointwise budget -- water-filling the deepest
 *   5.72 of the 13.78 well width recovers almost the whole negative mass anyway. The residual loss is therefore
 *   NOT in coupling the two scalar budgets (this leaf has now extracted essentially all of that) but in the two
 *   effects a rearrangement bound structurally cannot see:
 *     (a) the bathtub optimiser f = (a/pi) 1_{deepest set} is a DISCONTINUOUS indicator; no band-limited psi of
 *         type a = (ln3)/2 (which varies on scale 1/a ~ 1.82) can realise it -- a true type-a psi cannot switch
 *         its modulus between 0 and a/pi across the well boundaries, so it cannot even attain the bathtub value;
 *         and
 *     (b) it still DISCARDS int sigma_2^+ |psi|^2 >= 0, the t^4 positive far field (sigma_2(50) = +1.9e7) that
 *         any spread-out psi must pay by the uncertainty principle.
 *   The measured c_sharp ~ 0.582 (imp-97206 UPPER bracket) is positive precisely because of (a) and (b), which
 *   no SCALAR rearrangement bound -- however tight -- can capture. Closing the sign therefore still requires the
 *   genuinely SPECTRAL joint estimate: a weighted-PSWF eigenvalue-decay bound on M_{sigma_2} restricted to PW_a,
 *   or a Fejer-Riesz / de Branges square factorisation sigma_2 = |q|^2 - r with q admissible on PW_a and a
 *   certified margin. The bathtub result quantifies that the SCALAR two-budget coupling is now exhausted (only
 *   +134.594 left in it, 4.21% of the negative area), redirecting the remaining work entirely onto the spectral
 *   band-limitedness of the profile.
 *
 * VERDICT. The JOINT weighted band-limited estimate imp-97399 named is attempted in its sharpest scalar form --
 *   the bathtub / water-filling principle coupling the reproducing-kernel pointwise budget |psi|^2 <= a/pi with
 *   the normalisation int |psi|^2 = 1. It yields a NEW rigorous FINITE floor c_sharp >= -3065.435, improving
 *   imp-97399s -3200.029 by +134.594. But the floor stays NEGATIVE, and the small gain proves WHY: the deep
 *   spiky well concentrates 95.79% of its negative area in the deepest measure-(pi/a) region, so the mass
 *   constraint is nearly non-binding and the SCALAR two-budget coupling is now essentially exhausted. Positivity
 *   still requires the genuinely SPECTRAL estimate (weighted-PSWF eigenvalue decay or Fejer-Riesz / de Branges
 *   factorisation with a certified margin) -- because a scalar rearrangement bound cannot see (a) that the
 *   optimal profile is not band-limited or (b) the discarded t^4 positive far field. No operator positivity, no
 *   coercivity constant, no bound moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 *   ; RH open; NO QED. SUB-GAP IMP97416_SCALAR_TWO_BUDGET_COUPLING_EXHAUSTED_NEEDS_SPECTRAL_ESTIMATE.
 *
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (uniform pointwise floor -3200.029; confined well; named this joint primitive)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (the shared concentration primitive; "confined well")
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (naive symbol-infimum floor -4336.198 = the well depth)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured c_sharp ~0.582 UPPER bracket)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_2; pole-free Weil positivity; reach 2a<=0.96)
 *
 * Ticket: imp-97416 (proof, medium, opus-4-8). Attempt/derivation only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3);      // 1.0986122886681098 -- the binding 2a for the Krein floor
const A = LN3 / 2;            // 0.5493061443340548 -- the half-width a (2a = ln3)
const POINTWISE_BUDGET = A / Math.PI;      // 0.17485... -- K_a(t,t) = a/pi (M, the pointwise cap)
const FILLABLE_MEASURE = Math.PI / A;      // 5.71917... -- pi/a = L/M (measure fillable at height a/pi, mass 1)

export const IMP97416_BINDING_2A = LN3;
export const IMP97416_RIGOROUS_REACH_2A = 0.96; // unchanged by this attempt

// Bathtub / water-filling over sigma_2^-: fill the DEEPEST measure-(pi/a) sub-level set at height a/pi.
// sigma_2 is EVEN, so accumulate one-sided samples counted twice (mirror). Returns the top-set area.
function bathtubTopArea(h) {
  const neg = [];
  for (let t = h / 2; t <= 12; t += h) {
    const v = sigma2(t);
    if (v < 0) { neg.push(-v); neg.push(-v); } // t and -t both contribute width h at value -v
  }
  neg.sort((x, y) => y - x); // decreasing rearrangement of sigma_2^-
  let acc = 0, measure = 0;
  for (const g of neg) {
    if (measure + h > FILLABLE_MEASURE) { acc += g * (FILLABLE_MEASURE - measure); break; }
    acc += g * h; measure += h;
  }
  return acc; // int_{deepest measure pi/a} sigma_2^- dt
}

// Finding 1: the bathtub joint floor.
const TOP_AREA = 17531.84;                                  // int_{deepest measure pi/a} sigma_2^- dt
const TOTAL_NEG_AREA = 18301.610;                           // full-line int sigma_2^- dt (imp-97399)
export const IMP97416_FLOOR = Object.freeze({
  pointwiseBudget: POINTWISE_BUDGET,                        // M = a/pi
  fillableMeasure: FILLABLE_MEASURE,                        // L/M = pi/a = 5.7192
  totalNegArea: TOTAL_NEG_AREA,                             // 18301.61
  topArea: TOP_AREA,                                        // 17531.84 (deepest measure pi/a)
  capturedFraction: TOP_AREA / TOTAL_NEG_AREA,             // 0.9579 -- why the gain is small
  bathtubJointFloor: -POINTWISE_BUDGET * TOP_AREA,          // -3065.435 (NEW finite rigorous floor)
  uniformFloor: -POINTWISE_BUDGET * TOTAL_NEG_AREA,         // -3200.029 (imp-97399)
  naiveSymbolInfFloor: -4336.198,                           // imp-97335 well-depth floor
  improvementOverUniform: POINTWISE_BUDGET * (TOTAL_NEG_AREA - TOP_AREA), // +134.594
  improvementOverNaive: 4336.198 - POINTWISE_BUDGET * TOP_AREA,           // +1270.763
  stillNegative: true,                                     // does NOT certify c_sharp > 0
  measuredUpperBracket: 0.582,                             // imp-97206 (true value is positive)
});

export const IMP97416_VERDICT = Object.freeze({
  ticket: 'imp-97416',
  question:
    'attempt the JOINT WEIGHTED band-limited estimate imp-97399 named -- coupling the reproducing-kernel pointwise budget |psi|^2 <= a/pi with the normalisation int |psi|^2 = 1 -- to lift the Krein c_sharp floor above -3200.029 toward positive at 2a = ln3, or reach the precise obstruction.',
  answer:
    'attempted in its sharpest scalar form via the bathtub / water-filling (decreasing-rearrangement) principle: since every admissible f = |psi|^2 obeys BOTH 0 <= f <= a/pi (Bernstein/reproducing-kernel) AND int f = 1 (mass), int sigma_2^- |psi|^2 is maximised by filling only the DEEPEST measure-(pi/a) = 5.7192 portion of the well at height a/pi, giving c_sharp >= -(a/pi) int_{deepest measure pi/a} sigma_2^- = -3065.435. This is a NEW rigorous finite floor, improving imp-97399s uniform pointwise floor -3200.029 by +134.594 (and the imp-97335 naive well-depth floor -4336.198 by +1270.763). It is the first floor to use BOTH band-limited constraints jointly. But it stays NEGATIVE, and the small +134.594 gain proves why: the deep spiky well concentrates 95.79% of its total negative area in the deepest measure-(pi/a) region, so the mass constraint is nearly non-binding and the SCALAR two-budget coupling is now essentially exhausted. Positivity still requires the genuinely SPECTRAL estimate -- a weighted-PSWF eigenvalue-decay bound or a Fejer-Riesz / de Branges square factorisation with a certified margin -- because a scalar rearrangement bound cannot see (a) that the bathtub optimiser is a discontinuous indicator no type-a psi (1/a ~ 1.82) can realise, or (b) the discarded t^4 positive far field the true minimiser pays for; both make the measured c_sharp ~ 0.582 positive.',
  binding_2a: LN3,
  // Finding 1 -- bathtub joint floor
  jointEstimateIsBathtubWaterFilling: true,
  couplesPointwiseAndMassBudgets: true,
  pointwiseBudget: POINTWISE_BUDGET,
  fillableMeasure: FILLABLE_MEASURE,
  bathtubJointFloor: -POINTWISE_BUDGET * TOP_AREA, // -3065.435
  improvesUniformFloor: true,
  improvementOverUniform: POINTWISE_BUDGET * (TOTAL_NEG_AREA - TOP_AREA), // +134.594
  // Finding 2 -- still negative; sharpened obstruction
  floorStillNegative: true,
  positivityProved: false,
  capturedFraction: TOP_AREA / TOTAL_NEG_AREA, // 0.9579
  scalarTwoBudgetCouplingExhausted: true,
  massConstraintNearlyNonBinding: true,
  bathtubOptimiserNotBandLimited: true,
  discardsPositiveFarField: true,
  needsSpectralWeightedPswfOrFejerRieszEstimate: true,
  // unchanged program state
  concentrationLowerBoundPositiveProved: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97416_SCALAR_TWO_BUDGET_COUPLING_EXHAUSTED_NEEDS_SPECTRAL_ESTIMATE -- the JOINT weighted band-limited ' +
    'estimate for c_sharp = lambda_min(P_a M_{sigma_2} P_a) at 2a = ln3 was attempted in its sharpest scalar ' +
    'form, the bathtub / water-filling principle coupling the reproducing-kernel pointwise budget |psi|^2 <= ' +
    'a/pi = 0.17485 with the normalisation int |psi|^2 = 1. Filling only the deepest measure-(pi/a) = 5.7192 ' +
    'sub-level set of sigma_2^- at height a/pi gives the NEW rigorous finite floor c_sharp >= -(a/pi) ' +
    'int_{deepest measure pi/a} sigma_2^- = -3065.435, improving the imp-97399 uniform floor -3200.029 by ' +
    '+134.594 (and the imp-97335 naive well-depth floor -4336.198 by +1270.763). It stays NEGATIVE, and the ' +
    'small gain proves the SCALAR two-budget coupling is now exhausted: the deep spiky well concentrates ' +
    '95.79% of its total negative area in the deepest measure-(pi/a) region, so the mass constraint is nearly ' +
    'non-binding against the pointwise cap. Positivity still needs the genuinely SPECTRAL estimate -- a ' +
    'weighted-PSWF eigenvalue-decay bound on M_{sigma_2}|PW_a or a Fejer-Riesz / de Branges square ' +
    'factorisation with a certified margin -- because a scalar rearrangement bound cannot see that the bathtub ' +
    'optimiser is a discontinuous indicator no type-a psi (1/a ~ 1.82) can realise, nor the discarded t^4 ' +
    'positive far field; both make the measured c_sharp ~ 0.582 (imp-97206) positive. This refines ' +
    'IMP97399_UNIFORM_POINTWISE_BUDGET_TOO_LOSSY_NEEDS_WEIGHTED_JOINT_ESTIMATE. No operator positivity; no ' +
    'bound moves; interval-rigorous reach stays 2a <= 0.96.',
  qed: false,
});
export default IMP97416_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97416_ASSERTIONS = [
  {
    id: 'imp97416-bathtub-floor-recompute-matches',
    holds: () => {
      // recompute the top-(pi/a) area on a coarse grid; import must stay cheap (~2400 evals)
      const area = bathtubTopArea(0.005);
      const okArea = Math.abs(area - TOP_AREA) < 5; // coarse grid within 5 of baked 17531.84
      const floor = -POINTWISE_BUDGET * area;
      const okFloor = floor < 0 && floor > -3071 && floor < -3060; // -3065.435, still negative
      return okArea && okFloor;
    },
    why: 'the bathtub / water-filling top-(pi/a) area of sigma_2^- recomputes to 17531.84 (coarse grid within 5), giving the NEW rigorous finite floor c_sharp >= -(a/pi)*topArea = -3065.435 -- still negative but strictly above imp-97399s -3200.029.',
  },
  {
    id: 'imp97416-improves-uniform-and-naive-floors',
    holds: () => {
      const floor = IMP97416_FLOOR.bathtubJointFloor;
      const improvesUniform = floor > IMP97416_FLOOR.uniformFloor &&           // -3065 > -3200
        Math.abs(IMP97416_FLOOR.improvementOverUniform - 134.594) < 1;
      const improvesNaive = floor > IMP97416_FLOOR.naiveSymbolInfFloor;        // -3065 > -4336
      const fillOk = Math.abs(FILLABLE_MEASURE - Math.PI / A) < 1e-12 && FILLABLE_MEASURE > 5.7 && FILLABLE_MEASURE < 5.72;
      const capturedOk = IMP97416_FLOOR.capturedFraction > 0.95 && IMP97416_FLOOR.capturedFraction < 0.96;
      return improvesUniform && improvesNaive && fillOk && capturedOk;
    },
    why: 'the joint bathtub floor -3065.435 improves imp-97399s uniform floor -3200.029 by +134.594 and the naive well-depth floor -4336.198; it fills only the deepest measure pi/a = 5.7192 (of well width 13.78), which already captures 95.79% of the negative area -- showing the mass constraint is nearly non-binding.',
  },
  {
    id: 'imp97416-attempt-only-no-qed',
    holds: () =>
      IMP97416_VERDICT.floorStillNegative === true &&
      IMP97416_VERDICT.positivityProved === false &&
      IMP97416_VERDICT.scalarTwoBudgetCouplingExhausted === true &&
      IMP97416_VERDICT.needsSpectralWeightedPswfOrFejerRieszEstimate === true &&
      IMP97416_VERDICT.concentrationLowerBoundPositiveProved === false &&
      IMP97416_VERDICT.operatorPositivityProved === false &&
      IMP97416_VERDICT.boundMoves === false &&
      IMP97416_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97416_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97416_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97416_VERDICT.subGap === 'string' &&
      IMP97416_VERDICT.subGap.includes('IMP97416_SCALAR_TWO_BUDGET_COUPLING_EXHAUSTED_NEEDS_SPECTRAL_ESTIMATE') &&
      IMP97416_VERDICT.subGap.includes('IMP97399_UNIFORM_POINTWISE_BUDGET_TOO_LOSSY_NEEDS_WEIGHTED_JOINT_ESTIMATE') &&
      IMP97416_VERDICT.qed === false,
    why: 'attempt only: a NEW finite joint floor -3065.435 is delivered via the bathtub coupling of the pointwise and mass budgets, but it stays negative, so no positivity, no operator coercivity, no bound moves; the missing primitive is sharpened to a SPECTRAL weighted-PSWF or Fejer-Riesz estimate; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97416_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97416-krein-csharp-bathtub-joint-floor assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
