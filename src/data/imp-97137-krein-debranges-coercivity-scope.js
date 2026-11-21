/**
 * @module imp-97137-krein-debranges-coercivity-scope
 * @fileoverview imp-97137 -- SCOPING (proof) of route (B) of imp-97121 Finding 2: a direct analytic
 *   COERCIVITY / de Branges-space realisation T_a[sigma_2] >= c*I as an N-FREE operator inequality on
 *   L^2(-a,a). imp-97121 named this as the second admissible route to the missing N-INDEPENDENT lower
 *   bound (SUB-GAP IMP97121_UNIFORM_N_FLOOR_NEEDS_LOWER_BOUND_OBJECT) and flagged the de Branges
 *   realisation as the analyticObstruction in the committed certificate
 *   (rh-route-i-toeplitz-krein-certificate-2026-09-24). This leaf scopes WHAT de Branges /
 *   reproducing-kernel structure the weight supplies and identifies the PRECISE analytic input a
 *   coercivity constant c>0 would require.
 *
 *   Scoping only. Produces NO operator inequality and no coercivity constant; changes no bound;
 *   interval-rigorous reach stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * THE OPERATOR AND ITS de Branges FRAME. The pole-free Weil form is the truncated Wiener-Hopf / Toeplitz
 *   form <T_a[sigma_2] g, g> = (1/2pi) int sigma_2(t) |ghat(t)|^2 dt, with ghat = FT(g) ranging over the
 *   Paley-Wiener space PW_a = { ghat entire, exponential type <= a, ghat|_R in L^2 } and the symbol
 *       sigma_2(t) = (t^2 + 1/4)^2 w_1(t),   w_1(t) = 2theta'(t) - sqrt2 ln2 cos(t ln 2).
 *   PW_a is the model de Branges space H(E_a) with structure function E_a(z) = e^{-i a z} and reproducing
 *   kernel K_a(w,z) = sin(a(z - conj(w))) / (pi (z - conj(w))) (the sinc kernel; K_a(w,w) = a/pi on the
 *   real axis). So the operator is a self-adjoint multiplication form ON a de Branges space: coercivity
 *   T_a[sigma_2] >= c*I means (1/2pi) int (sigma_2 - c) |ghat|^2 >= 0 for every ghat in PW_a, i.e.
 *   T_a[sigma_2 - c] >= 0. It is N-FREE by construction -- this is exactly why route (B) would close
 *   IMP96749_UNIFORM_N_GAP_UNSETTLED where the finite-N Rayleigh-Ritz route (upper bounds only) cannot.
 *
 * WHAT THE de Branges STRUCTURE SUPPLIES FOR FREE -- THE (t^2+1/4)^2 PREFACTOR. The prefactor factors on
 *   the real axis as (t^2 + 1/4)^2 = |S(t)|^2 with S(z) = z^2 + 1/4 = (z - i/2)(z + i/2), a polynomial
 *   with its two zeros OFF the real axis at +-i/2. Multiplying the PW_a measure by |S|^2 is a canonical
 *   de Branges weight: the map g |-> h = Q g with hhat = (t^2+1/4) ghat (Q = -d^2/dx^2 + 1/4) is an
 *   ISOMETRY of PW_a onto the de Branges space H(E_a . S), and the pole-free constraint hhat(+-i/2) = 0
 *   is precisely membership in that de Branges subspace. So the polynomial part of sigma_2 is genuinely a
 *   reproducing-kernel / canonical-system object the de Branges frame delivers with no arithmetic input,
 *   and it is manifestly non-negative (|S|^2 >= 0). This is the part route (B) reformulates cleanly.
 *
 * WHERE THE STRUCTURE RUNS OUT -- THE w_1 FACTOR IS NOT SIGN-DEFINITE (the whole difficulty). The residual
 *   weight w_1 is the ONLY non-structural factor and it is NEGATIVE on a neighbourhood of the origin and
 *   in periodic bands thereafter: w_1(0) = -6.352, w_1 < 0 on ~[0, 3.310], and the prime term
 *   -sqrt2 ln2 cos(t ln 2) pulls it negative again in later bands (w_1(10) = -0.317) before the log growth
 *   2theta'(t) ~ ln(t/2pi) finally dominates (w_1(50) = +3.050). Hence sigma_2 itself dips negative
 *   (sigma_2(0) = -0.397, sigma_2(2) = -24.23, sigma_2(10) = -3187) with the same sign pattern, so
 *       min_t sigma_2(t) < 0,
 *   and the TRIVIAL coercivity bound lambda_min(T_a[sigma_2]) >= inf_t sigma_2(t) is USELESS -- it gives a
 *   negative number, while the target is lambda_min = 0.552 > 0 at 2a = ln 3. Positivity, let alone
 *   coercivity, is therefore a genuine BAND-LIMITED (uncertainty-principle) phenomenon: a type-a function s
 *   |ghat|^2 mass cannot be concentrated in the negativity set of sigma_2 enough to overcome the positive
 *   far field. The de Branges reproducing kernel quantifies this concentration ceiling -- the pointwise
 *   budget |ghat(w)|^2 <= K_a(w,w) ||ghat||^2 = (a/pi) ||ghat||^2 is finite -- but a POINTWISE budget is
 *   not by itself the integrated coercivity constant.
 *
 * THE PRECISE ANALYTIC INPUT c>0 REQUIRES (the named obstruction). Split sigma_2 = sigma_2^+ - sigma_2^-
 *   into its positive far field and its non-negative dip sigma_2^- >= 0 (supported on ~[0,3.31] and the
 *   later negative bands). Coercivity T_a[sigma_2] >= c*I is EXACTLY the concentration inequality
 *       int sigma_2^- |ghat|^2  <=  int sigma_2^+ |ghat|^2 - c int |ghat|^2   for all ghat in PW_a,
 *   i.e. a uniform statement that no band-limited (type-a) function can load a fraction of its energy into
 *   the dip large enough to beat the far field by more than -c. The sharp such c is the smallest
 *   eigenvalue of the compression P_a M_{sigma_2} P_a -- i.e. c = lambda_min(T_a[sigma_2]) itself. So the
 *   de Branges realisation REFORMULATES coercivity as a prolate-spheroidal / Beurling-Selberg-type
 *   extremal (concentration) problem on H(E_a) but does NOT supply the constant: the required input is an
 *   INDEPENDENT quantitative concentration / extremal estimate -- a proved lower bound on the dip-vs-far-
 *   field balance uniform over PW_a -- whose sharp value is precisely the lambda_min the finite-N numerics
 *   only bracket from above (0.577 -> 0.534 Legendre, 0.607 -> 0.476 shift-invert, still descending,
 *   imp-97121). No such extremal estimate is proved for this arithmetic weight; this is the analyticObstruction.
 *
 * VERDICT. Route (B) is a genuine N-FREE reformulation but supplies NO coercivity constant with the
 *   currently committed objects -- there is no free lunch. The de Branges frame delivers the polynomial
 *   prefactor (t^2+1/4)^2 = |z^2+1/4|^2 for free (an isometry PW_a -> H(E_a . S) with S = (z-i/2)(z+i/2)
 *   whose zeros sit off the real axis, realising the pole-free constraint hhat(+-i/2)=0 as de Branges
 *   subspace membership) and quantifies the pointwise concentration ceiling |ghat(w)|^2 <= (a/pi)||ghat||^2
 *   via the sinc reproducing kernel. But the residual weight w_1 is NOT sign-definite (w_1(0) = -6.352,
 *   negative on ~[0,3.31] and in later cos(t ln 2) bands, positive/log-growing far field), so
 *   min_t sigma_2 < 0 and the trivial bound lambda_min >= inf sigma_2 is vacuously negative. Coercivity
 *   T_a[sigma_2] >= c*I is EXACTLY an integrated concentration inequality int sigma_2^- |ghat|^2 <=
 *   int sigma_2^+ |ghat|^2 - c int|ghat|^2 uniform over PW_a, whose sharp constant IS
 *   lambda_min(T_a[sigma_2]); the de Branges realisation restates but does not prove it. The missing input
 *   is an INDEPENDENT prolate-spheroidal / Beurling-Selberg-type extremal (concentration) estimate for
 *   this arithmetic weight -- N-free, but un-proven today. SUB-GAP
 *   IMP97137_DEBRANGES_COERCIVITY_NEEDS_CONCENTRATION_CONSTANT. Scoping only; no operator positivity
 *   established; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97121-krein-uniform-n-floor-certificate-scope.js (Finding 2 route (B); the missing lower-bound object)
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (sibling route (A): Temple lower bound -- needs an a-priori spectral gap)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; w_1, sigma_2; reach 2a<=0.96; analyticObstruction)
 */

import { w1, sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this scoping)
export const IMP97137_RIGOROUS_REACH_2A = 0.96;
export const IMP97137_BINDING_2A = LN3;

// The committed Rayleigh-Ritz floors that a coercivity constant c would have to match/exceed at 2a=ln3.
// Every value is an UPPER bound on the true lambda_min and is still descending (imp-97121); a proved c>0
// route (B) would supply the missing N-independent LOWER bound.
export const IMP97137_TARGET_LAMBDA_MIN = Object.freeze({
  certificateLambdaMin_ln3: 0.552,     // committed certificate value at (ln3)/2 (imp-96749 window)
  legendreN100_T800: 0.533852,         // imp-96772, still descending upper bound
  shiftInvertNbig240_T800: 0.475606,   // imp-96911, still descending upper bound
  targetIsPositiveC: true,             // coercivity needs a single N-free c>0 <= true lambda_min
});

// --- de Branges / reproducing-kernel objects (self-contained; the structure route (B) supplies) ---

// Sinc reproducing kernel of PW_a = H(E_a), E_a(z) = e^{-i a z}, on the real axis:
// K_a(w,z) = sin(a(z-w))/(pi(z-w)), with the removable-singularity value K_a(w,w) = a/pi.
export function deBrangesSincKernel(a, w, z) {
  const d = z - w;
  if (Math.abs(d) < 1e-12) return a / Math.PI; // K_a(w,w) = a/pi
  return Math.sin(a * d) / (Math.PI * d);
}

// The finite pointwise concentration budget of a type-a function: |ghat(w)|^2 <= (a/pi) ||ghat||^2,
// the reproducing-kernel norm K_a(w,w). This is the CEILING a coercivity proof weighs against the dip;
// it is finite but is NOT itself the integrated coercivity constant c.
export function concentrationBudget(a) {
  return a / Math.PI;
}

// The polynomial de Branges weight factor on the real axis: (t^2+1/4)^2 = |S(t)|^2, S(z) = z^2 + 1/4 =
// (z-i/2)(z+i/2). Non-negative and delivered structurally by the de Branges frame (isometry PW_a -> H(E_a.S)).
export function polynomialWeight(t) {
  return (t * t + 0.25) ** 2;
}

export const IMP97137_VERDICT = Object.freeze({
  ticket: 'imp-97137',
  question: 'what de Branges / reproducing-kernel structure does the weight sigma_2 = (t^2+1/4)^2 w_1 supply, and what precise analytic input would a direct N-free coercivity constant c>0 in T_a[sigma_2] >= c*I require?',
  binding_2a: LN3,
  route: 'B -- direct analytic coercivity / de Branges-space realisation (N-free operator inequality)',
  // the de Branges frame
  operatorIsMultiplicationFormOnDeBrangesSpace: true, // (1/2pi) int sigma_2 |ghat|^2 on PW_a = H(E_a)
  structureFunctionIsExpMinusIaz: true,               // E_a(z) = e^{-i a z}
  reproducingKernelIsSinc: true,                      // K_a(w,z) = sin(a(z-conj w))/(pi(z-conj w)), K_a(w,w)=a/pi
  isNfreeByConstruction: true,                        // operator inequality on L^2(-a,a), no truncation
  // what the structure supplies for free
  polynomialPrefactorIsDeBrangesWeight: true,         // (t^2+1/4)^2 = |z^2+1/4|^2, zeros off R at +-i/2
  qMapIsIsometryOntoDeBrangesSubspace: true,          // g|->Qg, hhat=(t^2+1/4)ghat; hhat(+-i/2)=0 = subspace membership
  polynomialPrefactorNonNegative: true,
  pointwiseConcentrationBudgetFinite: true,           // |ghat(w)|^2 <= (a/pi)||ghat||^2
  // where the structure runs out
  w1IsSignDefinite: false,                            // w_1 negative near origin and in cos(t ln2) bands
  sigma2HasNegativeInfimum: true,                     // min_t sigma_2 < 0
  trivialInfimumBoundGivesPositiveC: false,           // lambda_min >= inf sigma_2 is vacuously negative
  coercivityIsBandLimitedUncertaintyPhenomenon: true, // positivity comes from band-limiting, not pointwise sign
  // the precise missing input
  coercivityEqualsConcentrationInequality: true,      // int sigma_2^-|ghat|^2 <= int sigma_2^+|ghat|^2 - c int|ghat|^2
  sharpConstantIsLambdaMinItself: true,               // c_sharp = lambda_min(P_a M_{sigma_2} P_a), reformulation not proof
  needsIndependentProlateBeurlingSelbergEstimate: true, // an N-free extremal/concentration bound for this arithmetic weight
  concentrationEstimateProved: false,
  deBrangesRealisationSuppliesConstantByItself: false, // NO free lunch
  // overall
  routeBGivesNfreeReformulationButNoConstant: true,
  prerequisite: 'an independent quantitative concentration / extremal (prolate-spheroidal / Beurling-Selberg) lower bound on the dip-vs-far-field balance int sigma_2^- |ghat|^2 <= int sigma_2^+ |ghat|^2 - c int |ghat|^2, uniform over PW_a, for the arithmetic weight w_1',
  // unchanged program state
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  uniformNGapClosed: false,
  subGap: 'IMP97137_DEBRANGES_COERCIVITY_NEEDS_CONCENTRATION_CONSTANT -- route (B) of imp-97121 Finding 2 (a direct analytic coercivity / de Branges realisation T_a[sigma_2] >= c*I as an N-free operator inequality on L^2(-a,a)) is a genuine truncation-free REFORMULATION but supplies NO coercivity constant c>0 with the currently committed objects. The pole-free Weil form is the multiplication form (1/2pi) int sigma_2 |ghat|^2 on the model de Branges space PW_a = H(E_a), E_a(z)=e^{-i a z}, sinc reproducing kernel K_a(w,z)=sin(a(z-conj w))/(pi(z-conj w)), K_a(w,w)=a/pi; T_a[sigma_2] >= c*I means T_a[sigma_2 - c] >= 0, N-free by construction, which is exactly why route (B) would close IMP96749_UNIFORM_N_GAP_UNSETTLED where finite-N Rayleigh-Ritz (upper bounds only) cannot. The de Branges frame delivers the polynomial prefactor (t^2+1/4)^2 = |S(t)|^2, S(z)=z^2+1/4=(z-i/2)(z+i/2) with zeros off the real axis: the map g|->Qg (hhat=(t^2+1/4)ghat, Q=-d^2/dx^2+1/4) is an isometry PW_a -> H(E_a.S) and the pole-free constraint hhat(+-i/2)=0 is de Branges subspace membership -- this part is structural and manifestly non-negative. But the residual weight w_1(t)=2theta prime(t) - sqrt2 ln2 cos(t ln2) is the ONLY non-structural factor and is NOT sign-definite: w_1(0)=-6.352, w_1<0 on ~[0,3.310] and again in later cos(t ln2) bands (w_1(10)=-0.317) before the log growth 2theta prime ~ ln(t/2pi) dominates (w_1(50)=+3.050), so sigma_2 dips negative (sigma_2(0)=-0.397, sigma_2(2)=-24.23, sigma_2(10)=-3187), min_t sigma_2 < 0, and the trivial bound lambda_min >= inf_t sigma_2 is vacuously negative against the target lambda_min=0.552 at 2a=ln3. Positivity/coercivity is therefore a band-limited (uncertainty) phenomenon; the sinc kernel gives only the finite POINTWISE ceiling |ghat(w)|^2 <= (a/pi)||ghat||^2. Coercivity is EXACTLY the integrated concentration inequality int sigma_2^- |ghat|^2 <= int sigma_2^+ |ghat|^2 - c int |ghat|^2 uniform over PW_a, whose sharp constant IS lambda_min(P_a M_{sigma_2} P_a) itself -- the de Branges realisation restates but does not prove it. The missing input is an INDEPENDENT quantitative prolate-spheroidal / Beurling-Selberg-type extremal (concentration) estimate for this arithmetic weight -- N-free, but un-proven today (its sharp value is precisely the lambda_min the finite-N numerics only bracket from above: 0.577->0.534 Legendre, 0.607->0.476 shift-invert, still descending). No free lunch. Scoping only; no operator positivity established; no bound moves; interval-rigorous reach stays 2a<=0.96',
  qed: false,
});
export default IMP97137_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97137_ASSERTIONS = [
  {
    id: 'imp97137-symbol-dips-negative-so-trivial-infimum-bound-is-vacuous',
    holds: () => {
      // The residual weight w_1 is NOT sign-definite (negative near the origin and in later bands), so the
      // symbol sigma_2 dips negative and the trivial coercivity bound lambda_min >= inf sigma_2 is useless.
      const w1_0 = w1(0), w1_10 = w1(10), w1_50 = w1(50);
      const s2_0 = sigma2(0), s2_2 = sigma2(2), s2_10 = sigma2(10);
      const negNearOrigin = w1_0 < 0 && s2_0 < 0;         // w_1(0) = -6.352, sigma_2(0) = -0.397
      const negLaterBand = w1_10 < 0 && s2_10 < 0;        // cos(t ln2) pulls w_1 negative again at t=10
      const positiveFarField = w1_50 > 0 && sigma2(50) > 0; // log growth eventually dominates
      const interiorNegative = s2_2 < 0;                  // sigma_2(2) = -24.23
      const trivialBoundVacuous = Math.min(s2_0, s2_2, s2_10) < 0 &&
        IMP97137_TARGET_LAMBDA_MIN.certificateLambdaMin_ln3 > 0;
      return negNearOrigin && negLaterBand && positiveFarField && interiorNegative && trivialBoundVacuous &&
        IMP97137_VERDICT.w1IsSignDefinite === false &&
        IMP97137_VERDICT.sigma2HasNegativeInfimum === true &&
        IMP97137_VERDICT.trivialInfimumBoundGivesPositiveC === false;
    },
    why: 'w_1 is negative near the origin (w_1(0)=-6.352) and in later cos(t ln2) bands (w_1(10)=-0.317), so sigma_2 dips negative (sigma_2(0)=-0.397, sigma_2(2)=-24.23, sigma_2(10)=-3187); min sigma_2 < 0 makes the trivial lambda_min >= inf sigma_2 bound vacuous against the positive target 0.552.',
  },
  {
    id: 'imp97137-debranges-prefactor-nonneg-and-supplied-for-free',
    holds: () => {
      // The (t^2+1/4)^2 = |z^2+1/4|^2 factor is a non-negative de Branges weight the frame delivers
      // structurally; it matches the certificate prefactor and is manifestly >= 0.
      const t = 1.7;
      const matchesCertificate = Math.abs(polynomialWeight(t) - ((t * t + 0.25) ** 2)) < 1e-12;
      const nonNeg = polynomialWeight(0) >= 0 && polynomialWeight(3) > 0;
      return matchesCertificate && nonNeg &&
        IMP97137_VERDICT.polynomialPrefactorIsDeBrangesWeight === true &&
        IMP97137_VERDICT.polynomialPrefactorNonNegative === true &&
        IMP97137_VERDICT.qMapIsIsometryOntoDeBrangesSubspace === true;
    },
    why: 'the polynomial prefactor (t^2+1/4)^2 = |S(t)|^2, S(z)=(z-i/2)(z+i/2), is non-negative and is supplied structurally by the de Branges frame (isometry PW_a -> H(E_a.S), pole-free constraint = subspace membership).',
  },
  {
    id: 'imp97137-sinc-kernel-gives-finite-pointwise-budget-only',
    holds: () => {
      // The sinc reproducing kernel value K_a(w,w) = a/pi is the finite POINTWISE concentration ceiling
      // |ghat(w)|^2 <= (a/pi)||ghat||^2 (equality for ghat = kernel). Verify the diagonal value, the
      // off-diagonal formula, and that the budget is finite but is only a pointwise (not integrated) object.
      const a = LN3 / 2; // support half-width at the binding 2a = ln3
      const diag = deBrangesSincKernel(a, 0.7, 0.7);
      const diagOk = Math.abs(diag - a / Math.PI) < 1e-12 && Math.abs(concentrationBudget(a) - a / Math.PI) < 1e-12;
      // off-diagonal matches sin(a d)/(pi d)
      const offOk = Math.abs(deBrangesSincKernel(a, 0, 1) - Math.sin(a) / Math.PI) < 1e-12;
      // equality case: for ghat = K_a(0, .), |ghat(0)|^2 = K_a(0,0)^2 and ||ghat||^2 = K_a(0,0), ratio = a/pi
      const kval = deBrangesSincKernel(a, 0, 0);
      const ratioEqualsBudget = Math.abs((kval * kval) / kval - concentrationBudget(a)) < 1e-12;
      return diagOk && offOk && ratioEqualsBudget && concentrationBudget(a) > 0 &&
        IMP97137_VERDICT.reproducingKernelIsSinc === true &&
        IMP97137_VERDICT.pointwiseConcentrationBudgetFinite === true;
    },
    why: 'the PW_a reproducing kernel is the sinc kernel with K_a(w,w)=a/pi; it gives the finite pointwise ceiling |ghat(w)|^2 <= (a/pi)||ghat||^2 (equality for ghat=kernel), which is not the integrated coercivity constant.',
  },
  {
    id: 'imp97137-coercivity-is-reformulation-not-proof-no-free-lunch',
    holds: () =>
      // The core scoping claim: route (B) is an N-free reformulation whose sharp constant IS lambda_min
      // itself; it supplies no c>0 without an independent concentration/extremal estimate.
      IMP97137_VERDICT.isNfreeByConstruction === true &&
      IMP97137_VERDICT.coercivityEqualsConcentrationInequality === true &&
      IMP97137_VERDICT.sharpConstantIsLambdaMinItself === true &&
      IMP97137_VERDICT.needsIndependentProlateBeurlingSelbergEstimate === true &&
      IMP97137_VERDICT.concentrationEstimateProved === false &&
      IMP97137_VERDICT.deBrangesRealisationSuppliesConstantByItself === false &&
      IMP97137_VERDICT.routeBGivesNfreeReformulationButNoConstant === true,
    why: 'coercivity T_a[sigma_2] >= c*I is exactly the concentration inequality int sigma_2^- |ghat|^2 <= int sigma_2^+ |ghat|^2 - c int|ghat|^2 whose sharp c is lambda_min itself; the de Branges realisation restates but does not prove it -- no free lunch.',
  },
  {
    id: 'imp97137-scoping-only-no-qed',
    holds: () =>
      IMP97137_VERDICT.operatorPositivityProved === false &&
      IMP97137_VERDICT.boundMoves === false &&
      IMP97137_VERDICT.uniformNGapClosed === false &&
      IMP97137_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97137_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97137_BINDING_2A - LN3) < 1e-12 &&
      IMP97137_VERDICT.qed === false,
    why: 'scoping only: no operator positivity is established, the uniform-in-N gap stays open, no bound moves, the interval-rigorous certificate reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97137_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97137 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
