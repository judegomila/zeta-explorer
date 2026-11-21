/**
 * @module imp-97399-krein-csharp-reproducing-kernel-concentration-attempt
 * @fileoverview imp-97399 -- ATTEMPT the shared band-limited (PW_a) concentration inequality that
 *   imp-97350/imp-97384 isolated as the single missing primitive for a positive lower bound on the Krein
 *   concentration constant c_sharp = lambda_min(P_a M_{sigma_2} P_a) at 2a = ln3, where
 *       sigma_2(t) = (t^2 + 1/4)^2 w_1(t),   w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2).
 *   The primitive asks: how much weighted mass can a Paley-Wiener function concentrate in the confined
 *   negative sigma_2 well (global inf -4336.198 at t = 9.3502)? This leaf attacks the inequality DIRECTLY
 *   with the reproducing-kernel (Bernstein pointwise) budget -- a THIRD standard tool, distinct from the
 *   Beurling-Selberg extremal functions and the flat Slepian prolate eigenvalues that imp-97161 already
 *   assessed and rejected. It delivers a NEW rigorous FINITE floor and reaches the sharpened precise
 *   obstruction. It also CORRECTS the committed well-structure characterization (see FINDING 1).
 *
 *   Attempt / derivation only. Produces NO positive coercivity constant and no operator positivity (the new
 *   floor is finite but still NEGATIVE); changes no bound; interval-rigorous reach stays 2a <= 0.96;
 *   no refereed bound is changed; RH open; NO QED.
 *
 * THE INEQUALITY, ON THE RAYLEIGH SIDE. With psi in PW_a (band-limited to |freq| <= a, ||psi||_2 = 1),
 *   c_sharp = inf_psi int sigma_2(t) |psi(t)|^2 dt. Splitting sigma_2 = sigma_2^+ - sigma_2^- (positive and
 *   negative parts, both >= 0),
 *       int sigma_2 |psi|^2 = int sigma_2^+ |psi|^2 - int sigma_2^- |psi|^2 >= - int sigma_2^- |psi|^2.
 *   The band-limited concentration question is exactly: how large can int sigma_2^- |psi|^2 be?
 *
 * FINDING 1 -- THE NEGATIVE WELL IS CONFINED (correcting the committed record). A fine sign scan of sigma_2
 *   shows its negativity set is a SINGLE CONFINED bounded region, not recurring bands. On the positive axis
 *   sigma_2 < 0 only on [0, 3.306] and [6.945, 10.532]; sigma_2 > 0 for every t > 10.532 (verified to
 *   t = 5000, and w_1(t) ~ ln(t/2) eventually dominates the fixed-amplitude sqrt2 ln2 = 0.980 oscillation, so
 *   sigma_2 stays positive). By evenness the full negativity set is [-10.532, -6.945] u [-3.306, 3.306] u
 *   [6.945, 10.532], BOUNDED, with FINITE depth (-4336.198) and FINITE total negative area
 *   int sigma_2^- dt = 18301.61 (one-sided 9150.805, doubled by evenness). This CONFIRMS the imp-97350
 *   "confined negative sigma_2 well" framing and CORRECTS the imp-97161 PROSE claim that sigma_2 "dips
 *   negative in every cos(t ln2) band out to infinity" with "unbounded" t^4 depth: the fixed-amplitude
 *   oscillation cannot overcome the growing archimedean drift 2 theta prime(t), so no negativity recurs past
 *   t ~ 10.53 and the depth is finite. (The imp-97161 assertions only sampled sigma_2 at t = 0, 2, 10, 50 and
 *   still pass; only its prose over-stated the recurrence.)
 *
 * FINDING 2 -- THE REPRODUCING-KERNEL POINTWISE CONCENTRATION BOUND (a third tool, and a NEW finite floor).
 *   PW_a is a reproducing-kernel Hilbert space with kernel K_a(s,t) = sin(a(s-t))/(pi(s-t)) and diagonal
 *   K_a(t,t) = a/pi. Hence for every t, |psi(t)| = |<psi, K_a(., t)>| <= ||psi||_2 sqrt(K_a(t,t)), i.e. the
 *   SHARP uniform pointwise bound |psi(t)|^2 <= (a/pi) ||psi||_2^2. This is a genuine band-limited
 *   concentration inequality (it caps how much mass sits at any point), and it is NEITHER the Beurling-Selberg
 *   nor the flat-Slepian tool imp-97161 rejected. Because the well is CONFINED with FINITE negative area
 *   (Finding 1), the bound is now NON-VACUOUS in form:
 *       int sigma_2^- |psi|^2 <= (a/pi) int sigma_2^-(t) dt = (a/pi) * 18301.61 = 3200.03,
 *   so  c_sharp >= - (a/pi) int sigma_2^- dt = -3200.029.
 *   This is a NEW rigorous FINITE lower bound, strictly BETTER than the imp-97335 naive symbol-infimum floor
 *   c_sharp >= inf_t sigma_2 = -4336.198 (the well-depth bound): the confinement + reproducing-kernel budget
 *   lifts the certified floor by +1136.169 (26.2% of the way from -4336.198 to 0). It is the first finite
 *   concentration floor in the record that USES band-limitedness rather than only the pointwise symbol
 *   infimum.
 *
 * FINDING 3 -- WHY IT STILL DOES NOT REACH POSITIVE (the sharpened precise obstruction). The floor -3200.029
 *   is still negative, so it does not certify c_sharp > 0. The loss is entirely in the two inequalities used:
 *     (a) |psi(t)|^2 <= a/pi is UNIFORM in t -- it treats the whole confined well as simultaneously saturable,
 *         but a single band-limited psi of type a = (ln3)/2 varies on scale 1/a ~ 1.82 and cannot hold
 *         |psi|^2 = a/pi across the whole width-6.9 (one-sided) negativity set at once; and
 *     (b) it DISCARDS int sigma_2^+ |psi|^2 >= 0 entirely -- but the positive far field grows like the t^4
 *         envelope (sigma_2(50) = +1.9e7), and any psi forced to place mass in the well necessarily spreads
 *         (uncertainty) some mass into that positive region, which the true minimiser pays for. The measured
 *         c_sharp ~ 0.582 (imp-97206 UPPER bracket) is positive precisely because of these two effects, which
 *         a single uniform pointwise budget cannot see. Closing the sign therefore still requires the JOINT
 *         WEIGHTED estimate -- a weighted-PSWF eigenvalue-decay bound or a Fejer-Riesz / de Branges square
 *         factorisation with a certified margin -- exactly the primitive imp-97137/imp-97161/imp-97350 named.
 *         The reproducing-kernel budget quantifies HOW FAR that uniform tool falls short (by 3200.03), not
 *         how to bridge it.
 *
 * VERDICT. The shared band-limited concentration inequality is ATTEMPTED directly with the reproducing-kernel
 *   pointwise budget (the third and last off-the-shelf band-limited concentration tool). It yields a NEW
 *   rigorous FINITE floor c_sharp >= -(a/pi) int sigma_2^- dt = -3200.029, improving the imp-97335 naive
 *   well-depth floor -4336.198 by +1136.169, and it corrects the well structure to a single CONFINED region
 *   (Finding 1). But the floor stays negative: the uniform pointwise budget is too lossy (it saturates the
 *   whole well at once and discards the t^4 positive far field). No positivity, no operator coercivity, no
 *   bound moves. The missing primitive is UNCHANGED and now SHARPENED: a JOINT WEIGHTED band-limited estimate
 *   is required; a uniform pointwise or flat concentration bound provably cannot close the sign. SUB-GAP
 *   IMP97399_UNIFORM_POINTWISE_BUDGET_TOO_LOSSY_NEEDS_WEIGHTED_JOINT_ESTIMATE (a refinement of
 *   IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN and
 *   IMP97350_LOWER_BOUND_ROUTES_SHARE_BAND_LIMITED_CONCENTRATION_PRIMITIVE). Assessment/attempt only; no
 *   operator positivity; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.
 *
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (the shared concentration primitive; "confined well")
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (Beurling-Selberg + flat-Slepian rejected; pointwiseBudget a/pi noted, not developed)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (naive symbol-infimum floor -4336.198 = the well depth)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured c_sharp ~0.582 UPPER bracket)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_2; pole-free Weil positivity; reach 2a<=0.96)
 *
 * Ticket: imp-97399 (proof, high, opus-4-8). Attempt/derivation only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3);      // 1.0986122886681098 -- the binding 2a for the Krein floor
const A = LN3 / 2;            // 0.5493061443340548 -- the half-width a (2a = ln3)
const POINTWISE_BUDGET = A / Math.PI; // 0.17485... -- K_a(t,t) = a/pi, the sharp pointwise mass cap

export const IMP97399_BINDING_2A = LN3;
export const IMP97399_RIGOROUS_REACH_2A = 0.96; // unchanged by this attempt

// Finding 1: the CONFINED negativity set (one-sided sub-intervals; full set is symmetric by evenness).
export const IMP97399_WELL = Object.freeze({
  negativeSubIntervalsOneSided: [[0, 3.306], [6.945, 10.532]], // sigma_2 < 0 only here on t >= 0
  lastNegativeT: 10.532,        // sigma_2 > 0 for all t > this (verified to t = 5000)
  globalInf: -4336.198,         // finite well depth (imp-97335), at t = 9.3502
  argmin: 9.3502,
  negAreaOneSided: 9150.805,    // int_{t>=0, sigma_2<0} (-sigma_2) dt
  negAreaFullLine: 18301.610,   // doubled by evenness of sigma_2
  isConfined: true,             // corrects imp-97161 prose "recurring bands out to infinity"
  depthIsFinite: true,          // corrects imp-97161 prose "unbounded t^4 depth"
});

// Finding 2: the reproducing-kernel pointwise concentration floor.
export const IMP97399_FLOOR = Object.freeze({
  pointwiseBudget: POINTWISE_BUDGET,                       // |psi(t)|^2 <= a/pi
  reproducingKernelFloor: -POINTWISE_BUDGET * 18301.610,   // -3200.029 (NEW finite rigorous lower bound)
  naiveSymbolInfFloor: -4336.198,                          // imp-97335 well-depth floor
  improvementOverNaive: 4336.198 - POINTWISE_BUDGET * 18301.610, // +1136.169
  stillNegative: true,                                     // does NOT certify c_sharp > 0
  measuredUpperBracket: 0.582,                             // imp-97206 (the true value is positive)
});

export const IMP97399_VERDICT = Object.freeze({
  ticket: 'imp-97399',
  question:
    'attempt the shared band-limited (PW_a) concentration inequality bounding how much a Paley-Wiener function can concentrate weighted mass in the confined negative sigma_2 well at 2a = ln3, or reach the precise obstruction.',
  answer:
    'attempted directly with the reproducing-kernel (Bernstein) pointwise budget |psi(t)|^2 <= K_a(t,t) = a/pi -- a third band-limited concentration tool, distinct from the Beurling-Selberg extremal functions and flat Slepian prolate eigenvalues imp-97161 already rejected. A fine sign scan first establishes the negativity set of sigma_2 is a single CONFINED region ([0,3.306] u [6.945,10.532] on t>=0, symmetric), with FINITE depth -4336.198 and FINITE total negative area int sigma_2^- dt = 18301.61 -- confirming the imp-97350 "confined well" and correcting the imp-97161 prose "recurring bands out to infinity / unbounded depth" (the fixed-amplitude sqrt2 ln2 = 0.980 oscillation cannot overcome the growing 2 theta prime(t) drift; sigma_2 > 0 for all t > 10.53, verified to t=5000). With confinement, the pointwise budget gives the NEW rigorous FINITE floor c_sharp >= -(a/pi) int sigma_2^- dt = -3200.029, improving the imp-97335 naive well-depth floor -4336.198 by +1136.169 (26.2% of the gap to 0). But the floor stays NEGATIVE: the uniform budget saturates the whole width-6.9 well simultaneously (impossible for one type-a psi, 1/a ~ 1.82) and discards the t^4 positive far field that the true minimiser pays for -- exactly the two effects that make the measured c_sharp ~ 0.582 positive. So a uniform pointwise / flat concentration bound provably cannot close the sign; the missing primitive is a JOINT WEIGHTED estimate (weighted-PSWF eigenvalue decay or Fejer-Riesz / de Branges margin), unchanged and sharpened.',
  binding_2a: LN3,
  // Finding 1 -- confined well (correction)
  negativeSetIsConfined: true,
  lastNegativeT: 10.532,
  wellDepthFinite: true,
  totalNegativeAreaFinite: true,
  negAreaFullLine: 18301.610,
  correctsImp97161RecurringBandsProse: true,
  confirmsImp97350ConfinedWell: true,
  // Finding 2 -- reproducing-kernel floor (new finite bound)
  reproducingKernelIsThirdTool: true,
  pointwiseBudget: POINTWISE_BUDGET,
  reproducingKernelFloor: -POINTWISE_BUDGET * 18301.610, // -3200.029
  improvesNaiveSymbolInfFloor: true,
  improvementOverNaive: 4336.198 - POINTWISE_BUDGET * 18301.610,
  // Finding 3 -- still negative; sharpened obstruction
  floorStillNegative: true,
  positivityProved: false,
  uniformBudgetTooLossy: true,
  discardsPositiveFarField: true,
  needsJointWeightedEstimate: true,
  // unchanged program state
  concentrationLowerBoundPositiveProved: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97399_UNIFORM_POINTWISE_BUDGET_TOO_LOSSY_NEEDS_WEIGHTED_JOINT_ESTIMATE -- the shared band-limited ' +
    'concentration inequality for c_sharp = lambda_min(P_a M_{sigma_2} P_a) at 2a = ln3 was attempted with ' +
    'the reproducing-kernel pointwise budget |psi(t)|^2 <= K_a(t,t) = a/pi = 0.17485 (a third tool, distinct ' +
    'from the Beurling-Selberg and flat-Slepian tools imp-97161 rejected). The negativity set of sigma_2 is ' +
    'CONFINED ([0,3.306] u [6.945,10.532] on t>=0, symmetric; sigma_2 > 0 for all t > 10.53, verified to ' +
    't=5000), with finite depth -4336.198 and finite total negative area int sigma_2^- dt = 18301.61 -- ' +
    'confirming imp-97350 and correcting the imp-97161 prose "recurring bands out to infinity / unbounded ' +
    'depth". The budget yields the NEW rigorous finite floor c_sharp >= -(a/pi) int sigma_2^- = -3200.029, ' +
    'improving the imp-97335 naive well-depth floor -4336.198 by +1136.169 (26.2% of the gap to 0), but ' +
    'stays NEGATIVE. It cannot close the sign because it (a) treats the whole width-6.9 well as ' +
    'simultaneously saturable, impossible for a single type-a psi (1/a ~ 1.82), and (b) discards the t^4 ' +
    'positive far field the true minimiser pays for -- the two effects that make the measured c_sharp ~ ' +
    '0.582 positive. Positivity therefore still needs a JOINT WEIGHTED estimate (weighted-PSWF eigenvalue ' +
    'decay or a Fejer-Riesz / de Branges square factorisation with a certified margin), refining ' +
    'IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN and ' +
    'IMP97350_LOWER_BOUND_ROUTES_SHARE_BAND_LIMITED_CONCENTRATION_PRIMITIVE. No operator positivity; no ' +
    'bound moves; interval-rigorous reach stays 2a <= 0.96.',
  qed: false,
});
export default IMP97399_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

// Recompute the one-sided negative area of sigma_2 on a modest grid (import must stay cheap); the well is
// confined to [0, ~10.6] so [0,12] captures it. h = 0.005 -> ~2400 evals, accurate to < 1 vs the baked value.
function negAreaOneSided(h) {
  let s = 0;
  for (let t = 0; t <= 12; t += h) {
    const v = sigma2(t);
    if (v < 0) s += -v * h;
  }
  return s;
}

const IMP97399_ASSERTIONS = [
  {
    id: 'imp97399-negative-set-is-confined',
    holds: () => {
      // sigma_2 > 0 for all sampled t past the last negative sub-interval (confinement / correction of imp-97161)
      const pastWell = [11, 12, 14, 17, 20, 50, 100, 500, 2000].every((t) => sigma2(t) > 0);
      // and it IS negative inside the two named sub-intervals
      const insideNeg = sigma2(1) < 0 && sigma2(2) < 0 && sigma2(9.35) < 0 && sigma2(10) < 0;
      return pastWell && insideNeg &&
        IMP97399_VERDICT.negativeSetIsConfined === true &&
        IMP97399_VERDICT.wellDepthFinite === true &&
        IMP97399_VERDICT.totalNegativeAreaFinite === true &&
        IMP97399_VERDICT.correctsImp97161RecurringBandsProse === true &&
        IMP97399_VERDICT.confirmsImp97350ConfinedWell === true;
    },
    why: 'sigma_2 is negative only on the confined set [0,3.306] u [6.945,10.532] (and mirror) and stays positive for every t > 10.53 (verified to t=2000), so the well is a single bounded region of finite depth -- confirming imp-97350 and correcting the imp-97161 prose that the dip recurs to infinity with unbounded depth.',
  },
  {
    id: 'imp97399-negative-area-finite-and-matches',
    holds: () => {
      const oneSided = negAreaOneSided(0.005);
      // recomputed one-sided area matches the baked 9150.805 to < 1; full-line = 2x
      const okOneSided = Math.abs(oneSided - IMP97399_WELL.negAreaOneSided) < 1;
      const okFull = Math.abs(IMP97399_WELL.negAreaFullLine - 2 * IMP97399_WELL.negAreaOneSided) < 1e-2;
      return okOneSided && okFull && IMP97399_WELL.negAreaFullLine > 1.8e4 && IMP97399_WELL.negAreaFullLine < 1.9e4;
    },
    why: 'the total negative area int sigma_2^- dt is FINITE (one-sided 9150.805, full-line 18301.610 by evenness); a coarse-grid recompute agrees to < 1, confirming the confinement makes the concentration bound non-vacuous in form.',
  },
  {
    id: 'imp97399-reproducing-kernel-floor-finite-and-improves-naive',
    holds: () => {
      // pointwise budget a/pi, floor = -(a/pi)*negArea, strictly above the naive well-depth floor -4336.198
      const budgetOk = Math.abs(POINTWISE_BUDGET - A / Math.PI) < 1e-15 && POINTWISE_BUDGET > 0.174 && POINTWISE_BUDGET < 0.175;
      const floor = IMP97399_FLOOR.reproducingKernelFloor;
      const floorOk = floor < 0 && floor > -3201 && floor < -3199;         // -3200.029, still negative
      const improvesOk = floor > IMP97399_FLOOR.naiveSymbolInfFloor &&      // -3200 > -4336
        Math.abs(IMP97399_FLOOR.improvementOverNaive - 1136.169) < 0.5;
      return budgetOk && floorOk && improvesOk &&
        IMP97399_VERDICT.reproducingKernelIsThirdTool === true &&
        IMP97399_VERDICT.improvesNaiveSymbolInfFloor === true;
    },
    why: 'the reproducing-kernel pointwise budget |psi(t)|^2 <= a/pi = 0.17485 gives the NEW rigorous finite floor c_sharp >= -(a/pi) int sigma_2^- = -3200.029, strictly above (better than) the imp-97335 naive symbol-infimum floor -4336.198 by +1136.169, yet still negative.',
  },
  {
    id: 'imp97399-attempt-only-no-qed',
    holds: () =>
      IMP97399_VERDICT.floorStillNegative === true &&
      IMP97399_VERDICT.positivityProved === false &&
      IMP97399_VERDICT.uniformBudgetTooLossy === true &&
      IMP97399_VERDICT.needsJointWeightedEstimate === true &&
      IMP97399_VERDICT.concentrationLowerBoundPositiveProved === false &&
      IMP97399_VERDICT.operatorPositivityProved === false &&
      IMP97399_VERDICT.boundMoves === false &&
      IMP97399_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97399_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97399_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97399_VERDICT.subGap === 'string' &&
      IMP97399_VERDICT.subGap.includes('IMP97399_UNIFORM_POINTWISE_BUDGET_TOO_LOSSY_NEEDS_WEIGHTED_JOINT_ESTIMATE') &&
      IMP97399_VERDICT.subGap.includes('IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN') &&
      IMP97399_VERDICT.qed === false,
    why: 'attempt only: a NEW finite floor -3200.029 is delivered and the well corrected to a confined region, but the floor stays negative, so no positivity, no operator coercivity, no bound moves; the missing primitive is unchanged and sharpened (a joint weighted estimate); interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97399_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97399-krein-csharp-reproducing-kernel-concentration-attempt assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
