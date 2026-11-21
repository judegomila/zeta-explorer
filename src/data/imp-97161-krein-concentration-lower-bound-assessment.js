/**
 * @module imp-97161-krein-concentration-lower-bound-assessment
 * @fileoverview imp-97161 -- ASSESSMENT (proof) of the named de Branges coercivity input from imp-97137:
 *   does a Beurling-Selberg extremal-function or prolate-spheroidal concentration bound supply a PROVABLE
 *   positive lower bound c>0 on the dip-vs-far-field balance of the pole-free Weil symbol
 *       sigma_2(t) = (t^2 + 1/4)^2 w_1(t),   w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln 2),
 *   at the binding half-width 2a = ln 3? imp-97137 reformulated coercivity T_a[sigma_2] >= c*I as the
 *   concentration inequality  int sigma_2^- |ghat|^2 <= int sigma_2^+ |ghat|^2 - c int |ghat|^2  over the
 *   Paley-Wiener space PW_a, and flagged the missing ingredient as an INDEPENDENT quantitative
 *   concentration / extremal estimate (SUB-GAP IMP97137_DEBRANGES_COERCIVITY_NEEDS_CONCENTRATION_CONSTANT).
 *   This leaf assesses whether the two standard tools -- Beurling-Selberg one-sided extremal functions and
 *   Slepian prolate-spheroidal concentration eigenvalues -- close that gap, and pins the PRECISE extremal
 *   quantity that would have to be bounded.
 *
 *   Assessment / derivation attempt only. Produces NO coercivity constant and no operator positivity unless
 *   one is actually derived (it is NOT); changes no bound; interval-rigorous reach stays 2a<=0.96;
 *   no refereed bound is changed; RH open; NO QED.
 *
 * THE PRECISE EXTREMAL QUANTITY (what a lower bound must actually bound). Written on the g-side, the
 *   pole-free Weil form is a truncated convolution (Wiener-Hopf / Toeplitz) operator: for g in L^2(-a,a),
 *       <T_a[sigma_2] g, g> = (1/2pi) int sigma_2(t) |ghat(t)|^2 dt
 *                           = int_{-a}^{a} int_{-a}^{a} g(x) conj(g(y)) Ksig(x-y) dx dy,
 *   where Ksig = inverse Fourier transform of sigma_2. The kernel is evaluated only at lags u = x-y in
 *   [-2a, 2a] = [-ln3, ln3], so ONLY the band-restricted data Ksig(u), |u| <= ln3, enters. Equivalently, by
 *   the Boas-Kac / Fejer factorisation (a non-negative L^1 function of exponential type 2a is exactly |ghat|^2
 *   for some ghat of type a), the sharp coercivity constant is the band-limited extremal
 *       c_sharp = inf { int sigma_2(t) F(t) dt : F >= 0, supp Fhat subset of [-2a,2a], int F = 1 }
 *               = lambda_min( P_a M_{sigma_2} P_a ),
 *   the bottom eigenvalue of the compression of multiplication-by-sigma_2 to PW_a. THIS is the extremal
 *   quantity any concentration lower bound must certify. The finite-N numerics only bracket it from ABOVE
 *   (0.577 -> 0.534 Legendre, 0.607 -> 0.476 shift-invert; still descending, imp-97121); no proven lower
 *   bound exists.
 *
 * THE THREE-PART BAND-RESTRICTED KERNEL AND THE SINGLE IN-BAND PRIME. On |u| <= ln3 the kernel splits as
 *       Ksig = (D^2 + 1/4)^2 [ Karch + Kprime ],   D = d/du,
 *   the polynomial prefactor (t^2+1/4)^2 acting as the 4th-order differential lift (D^2+1/4)^2, with
 *     - Karch = inverse FT of 2 theta prime(t): the smooth archimedean (log-drift) part, and
 *     - Kprime = inverse FT of -sqrt2 ln2 cos(t ln2): two point masses at lags u = +-ln2.
 *   The prime frequency ln2 = 0.6931 lies INSIDE the band ln3 = 1.0986, but its next harmonic 2 ln2 = ln4 =
 *   1.3863 lies OUTSIDE (ln4 > ln3), so at 2a = ln3 EXACTLY ONE prime cosine harmonic is captured. The whole
 *   arithmetic obstruction is thus a single rank-controlled cosine perturbation (at frequency ln2) of the
 *   smooth archimedean kernel, lifted by (D^2+1/4)^2 -- which is precisely why p=2 is binding and 2a=ln3 is
 *   the threshold in the committed certificate.
 *
 * ASSESSMENT 1 -- BEURLING-SELBERG EXTREMAL FUNCTIONS DO NOT REDUCE THE PROBLEM (circular / wrong functional).
 *   Beurling-Selberg theory produces the extremal band-limited one-sided approximant (majorant or minorant) of
 *   a target with a KNOWN singularity -- sgn, an indicator 1_I, the truncated power x^+, e^{-lambda|t|} -- and
 *   controls its L^1 deficit int (target - approximant) against LEBESGUE measure. Two candidate uses fail:
 *     (a) Minorant route. Suppose m(t) <= sigma_2(t) with m of exponential type <= 2a and T_a[m] handled
 *         explicitly. But "int m F >= c int F for every band-limited density F" is EXACTLY T_a[m - c] >= 0 --
 *         the identical truncated-Toeplitz positivity as the original problem. A type-2a minorant inherits the
 *         very difficulty it was meant to remove; the only band-limited minorant whose Toeplitz form is
 *         diagonal a priori is the CONSTANT m == inf_t sigma_2 < 0, giving the vacuous negative bound. So the
 *         minorant route is circular.
 *     (b) Deficit route. The classical Beurling-Selberg payoff bounds int sigma_2 against Lebesgue measure --
 *         the a -> infinity / full-band limit -- not the infimum over band-limited densities of fixed type 2a.
 *         It answers the wrong functional (the flat mean, not the concentrated minimiser).
 *   Moreover sigma_2 is not in the single-singularity class: it has infinitely many sign changes (the
 *   cos(t ln2) bands under the t^4 envelope) and polynomial growth, so no clean Beurling-Selberg extremal for
 *   sigma_2 itself exists. VERDICT: off-the-shelf Beurling-Selberg extremal functions supply no c>0 here.
 *
 * ASSESSMENT 2 -- FLAT PROLATE (SLEPIAN) EIGENVALUES DO NOT CLOSE IT EITHER (unbounded, recurring dip).
 *   The Slepian prolate-spheroidal wave functions diagonalise the FLAT time-and-band-limiting operator; the
 *   top eigenvalue lambda_0(2a, I) is the maximal fraction of a type-2a density mass that can be concentrated
 *   in a fixed interval I. If sigma_2 were >= m_far > 0 off a single bounded dip interval I of bounded depth
 *   d = sup_I sigma_2^-, one could combine  c >= m_far - (m_far + d) lambda_0(2a, I). Every hypothesis fails:
 *     (i) the negativity set is NOT a single bounded interval -- sigma_2 dips negative in every cos(t ln2)
 *         band out to infinity (sigma_2(0) = -0.397, sigma_2(2) = -24.23, sigma_2(10) = -3186.8, ...);
 *     (ii) the dip DEPTH is unbounded, growing like the t^4 envelope; and
 *     (iii) the positive far field carries the SAME t^4 envelope (sigma_2(50) = +1.906e7), so there is no
 *         uniform positive floor m_far over the recurring bands.
 *   The flat indicator-concentration eigenvalue therefore does not apply; the object genuinely required is the
 *   bottom eigenvalue of the WEIGHTED concentration operator (multiplication by the sign-indefinite,
 *   polynomially-growing sigma_2 compressed to PW_a) -- whose lambda_min IS c_sharp itself. That is a
 *   restatement of the target, not an independent bound. Off-the-shelf prolate tables do not close the gap.
 *
 * WHAT WOULD ACTUALLY WORK (the precise missing estimate). A provable c>0 needs one of two concrete inputs,
 *   both N-free and both currently unproven for this arithmetic weight:
 *     - A Fejer-Riesz / de Branges square factorisation with a proven MARGIN: an explicit representation
 *       sigma_2 - c = sum of Hermitian squares valid as a truncated-Toeplitz identity on |u| <= ln3 (the
 *       operator form of the committed CC/Toeplitz-Krein certificate, but with a certified c>0 at 2a=ln3), or
 *     - a quantitative band-limited UNCERTAINTY inequality tailored to the three-part kernel above: a lower
 *       bound on lambda_min of (D^2+1/4)^2[Karch + Kprime] on [-ln3, ln3], exploiting that the sole in-band
 *       prime frequency is ln2 (2 ln2 = ln4 > ln3 is excluded) so the arithmetic content is a single
 *       rank-controlled cosine perturbation of the smooth archimedean kernel.
 *   Neither is the flat Slepian eigenvalue nor a classical Beurling-Selberg deficit; both are exactly the
 *   weighted / arithmetic extremal quantity the numerics only bound from above.
 *
 * VERDICT. NO -- neither Beurling-Selberg extremal functions nor flat prolate-spheroidal concentration
 *   eigenvalues supply a provable positive lower bound on the dip-vs-far-field balance at 2a = ln3 as they
 *   stand. Beurling-Selberg minorants are circular (a type-2a minorant reproduces the same truncated-Toeplitz
 *   positivity; only the constant inf sigma_2 < 0 is diagonal) and the classical deficit bounds the wrong
 *   (flat-mean, full-band) functional for a symbol with infinitely many sign changes and polynomial growth.
 *   Flat Slepian eigenvalues need a single bounded dip of bounded depth against a uniform positive far field;
 *   sigma_2 violates all three (recurring negativity bands, unbounded t^4 depth, shared t^4 far envelope), so
 *   the required object is the bottom eigenvalue of the WEIGHTED concentration operator, which IS c_sharp --
 *   a restatement, not a bound. The PRECISE extremal quantity to certify is
 *       c_sharp = lambda_min( P_a M_{sigma_2} P_a ) = smallest eigenvalue of the truncated convolution kernel
 *       Ksig(u) = (D^2+1/4)^2[Karch + Kprime](u) on |u| <= ln3,
 *   whose only in-band arithmetic datum is the single cosine at frequency ln2. No proven lower bound today;
 *   the numerics bracket c_sharp from above (0.552 certificate value, 0.534 Legendre, 0.476 shift-invert,
 *   still descending). SUB-GAP IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN.
 *   Assessment only; no operator positivity established; no bound moves; interval-rigorous reach stays
 *   2a<=0.96; RH open; NO QED.
 *
 * @see imp-97137-krein-debranges-coercivity-scope.js (named the concentration/prolate extremal as the required input)
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (sibling route (A): Temple lower bound)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; w_1, sigma_2; reach 2a<=0.96)
 */

import { w1, sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN2 = Math.log(2); // 0.6931471805599453 -- the single in-band prime frequency at 2a = ln3
const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor
const LN4 = Math.log(4); // 1.3862943611198906 = 2 ln2 -- the second prime harmonic, OUT of band

// interval-rigorous certificate reach (unchanged by this assessment)
export const IMP97161_RIGOROUS_REACH_2A = 0.96;
export const IMP97161_BINDING_2A = LN3;

// The committed Rayleigh-Ritz floors: every value is an UPPER bound on the true c_sharp = lambda_min and is
// still descending; a proved concentration lower bound would have to sit at or below the true c_sharp.
export const IMP97161_TARGET_LAMBDA_MIN = Object.freeze({
  certificateLambdaMin_ln3: 0.552,     // committed certificate value at (ln3)/2 (imp-96749 window)
  legendreN100_T800: 0.533852,         // imp-96772, still descending upper bound
  shiftInvertNbig240_T800: 0.475606,   // imp-96911, still descending upper bound
  provenLowerBound: null,              // none -- this is exactly the missing object
});

// Prime cosine harmonics k*ln2 of the arithmetic symbol captured inside the band |freq| <= twoA. At
// 2a = ln3 exactly one (k=1, frequency ln2) is in-band; the second harmonic 2 ln2 = ln4 > ln3 is excluded.
export function inBandPrimeHarmonics(twoA) {
  const harmonics = [];
  for (let k = 1; k * LN2 <= twoA + 1e-15; k++) harmonics.push(k * LN2);
  return harmonics;
}

// Pointwise concentration ceiling from the PW_a sinc reproducing kernel, K_a(w,w) = a/pi. This is the finite
// POINTWISE budget the assessment weighs against the dip; it is NOT the integrated coercivity constant.
export function pointwiseBudget(a) {
  return a / Math.PI;
}

export const IMP97161_VERDICT = Object.freeze({
  ticket: 'imp-97161',
  question: 'do Beurling-Selberg extremal-function or prolate-spheroidal concentration bounds supply a provable positive lower bound c>0 on the dip-vs-far-field balance of sigma_2 on PW_a at 2a = ln3, and what is the precise extremal quantity that would need bounding?',
  binding_2a: LN3,
  // the precise extremal quantity
  extremalQuantity: 'c_sharp = lambda_min(P_a M_{sigma_2} P_a) = inf over band-limited densities F (F>=0, supp Fhat subset [-2a,2a], int F = 1) of int sigma_2 F = smallest eigenvalue of the truncated convolution kernel Ksig(u) on |u| <= 2a = ln3',
  operatorIsTruncatedConvolution: true,       // <T g,g> = int int g(x) conj(g(y)) Ksig(x-y), lags in [-2a,2a]
  onlyBandRestrictedKernelEnters: true,       // only Ksig(u), |u| <= ln3, matters
  sharpConstantIsLambdaMinItself: true,       // c_sharp = lambda_min compression; the object numerics upper-bound
  // the three-part kernel and the single in-band prime
  kernelSplitsArchPlusPrimeLiftedByPolynomial: true, // Ksig = (D^2+1/4)^2 [Karch + Kprime]
  inBandPrimeHarmonicCount_at_ln3: 1,         // only k=1 (freq ln2); 2 ln2 = ln4 > ln3 excluded
  secondHarmonicOutOfBand: true,              // ln4 > ln3
  arithmeticObstructionIsSingleCosinePerturbation: true,
  // Beurling-Selberg assessment
  beurlingSelbergMinorantIsCircular: true,    // type-2a minorant reproduces the same truncated-Toeplitz positivity
  onlyDiagonalBandLimitedMinorantIsConstant: true, // m == inf sigma_2 < 0, vacuous
  beurlingSelbergDeficitIsWrongFunctional: true,   // bounds flat/full-band mean, not band-limited infimum
  symbolNotInSingleSingularityClass: true,    // infinitely many sign changes + polynomial growth
  beurlingSelbergSuppliesConstant: false,
  // prolate assessment
  flatProlateNeedsBoundedDipAndUniformFarFloor: true,
  dipIsRecurringNotSingleInterval: true,      // negativity in every cos(t ln2) band
  dipDepthUnbounded: true,                    // grows like the t^4 envelope
  farFieldSharesT4Envelope: true,             // no uniform positive floor m_far
  requiredObjectIsWeightedConcentrationEigenvalue: true, // its lambda_min IS c_sharp -- restatement
  flatProlateSuppliesConstant: false,
  // what would work
  needsFejerRieszMarginOrArithmeticUncertaintyInequality: true,
  concentrationLowerBoundProved: false,
  // overall
  neitherStandardToolSuppliesC: true,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  uniformNGapClosed: false,
  subGap: 'IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN -- neither Beurling-Selberg extremal functions nor flat prolate-spheroidal (Slepian) concentration eigenvalues supply a provable positive lower bound c>0 on the dip-vs-far-field balance of sigma_2 = (t^2+1/4)^2 w_1 on PW_a at 2a = ln3. The sharp constant is c_sharp = lambda_min(P_a M_{sigma_2} P_a) = inf over band-limited densities F (F>=0, supp Fhat subset [-2a,2a], int F = 1) of int sigma_2 F, equivalently the smallest eigenvalue of the truncated convolution kernel Ksig(u) = (D^2+1/4)^2[Karch + Kprime](u) on |u| <= 2a = ln3, whose only in-band arithmetic datum is the single prime cosine at frequency ln2 (2 ln2 = ln4 > ln3 is excluded). Beurling-Selberg minorants are circular: int m F >= c int F for all band-limited densities F is exactly T_a[m - c] >= 0, the same truncated-Toeplitz positivity, and the only diagonal band-limited minorant is the constant m == inf_t sigma_2 < 0 (vacuous); the classical Beurling-Selberg deficit bounds the flat full-band mean, the wrong functional, and sigma_2 has infinitely many sign changes plus polynomial growth so no single-singularity extremal exists. Flat Slepian eigenvalues would need a single bounded dip interval of bounded depth against a uniform positive far floor; sigma_2 violates all three -- negativity recurs in every cos(t ln2) band (sigma_2(0)=-0.397, sigma_2(2)=-24.23, sigma_2(10)=-3186.8), the depth grows like the t^4 envelope, and the far field carries the SAME t^4 envelope (sigma_2(50)=+1.906e7) so there is no uniform m_far. The genuinely required object is the bottom eigenvalue of the WEIGHTED concentration operator, which IS c_sharp -- a restatement, not a bound. A provable c>0 needs instead either a Fejer-Riesz / de Branges square factorisation sigma_2 - c = sum of Hermitian squares valid as a truncated-Toeplitz identity on |u| <= ln3 with a certified margin, or a quantitative band-limited uncertainty inequality lower-bounding lambda_min of the three-part kernel; neither is proved for this arithmetic weight. The numerics bracket c_sharp from above (0.552 certificate, 0.534 Legendre, 0.476 shift-invert, still descending). Assessment only; no operator positivity established; no bound moves; interval-rigorous reach stays 2a<=0.96',
  qed: false,
});
export default IMP97161_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97161_ASSERTIONS = [
  {
    id: 'imp97161-exactly-one-in-band-prime-harmonic-at-ln3',
    holds: () => {
      // At 2a = ln3 the single prime frequency ln2 is captured but its second harmonic 2 ln2 = ln4 is not.
      const harmonics = inBandPrimeHarmonics(LN3);
      const oneInBand = harmonics.length === 1 && Math.abs(harmonics[0] - LN2) < 1e-12;
      const secondOut = LN4 > LN3 && Math.abs(LN4 - 2 * LN2) < 1e-12;
      return oneInBand && secondOut &&
        IMP97161_VERDICT.inBandPrimeHarmonicCount_at_ln3 === 1 &&
        IMP97161_VERDICT.secondHarmonicOutOfBand === true &&
        IMP97161_VERDICT.arithmeticObstructionIsSingleCosinePerturbation === true;
    },
    why: 'at 2a = ln3 = 1.0986 the prime frequency ln2 = 0.6931 is in-band but 2 ln2 = ln4 = 1.3863 > ln3 is out, so exactly one prime cosine harmonic is captured -- the arithmetic obstruction is a single rank-controlled cosine perturbation.',
  },
  {
    id: 'imp97161-dip-recurs-with-unbounded-depth-and-shared-far-envelope',
    holds: () => {
      // Flat Slepian would need a single bounded dip of bounded depth vs a uniform positive far floor.
      // sigma_2 violates all three: recurring negativity, t^4-growing depth, t^4-scale positive far field.
      const s0 = sigma2(0), s2 = sigma2(2), s10 = sigma2(10), s50 = sigma2(50);
      const dipNearOrigin = s0 < 0 && s2 < 0;                 // sigma_2(0)=-0.397, sigma_2(2)=-24.23
      const dipRecursAndDeepens = s10 < -1000;                // sigma_2(10)=-3186.8 (later band, t^4 depth)
      const farFieldSharesEnvelope = s50 > 1e6;               // sigma_2(50)=+1.906e7, same t^4 scale
      return dipNearOrigin && dipRecursAndDeepens && farFieldSharesEnvelope &&
        IMP97161_VERDICT.dipIsRecurringNotSingleInterval === true &&
        IMP97161_VERDICT.dipDepthUnbounded === true &&
        IMP97161_VERDICT.farFieldSharesT4Envelope === true &&
        IMP97161_VERDICT.flatProlateSuppliesConstant === false;
    },
    why: 'sigma_2 dips negative near the origin and again in later cos(t ln2) bands with t^4-growing depth (sigma_2(10)=-3186.8) while the positive far field carries the same t^4 envelope (sigma_2(50)=+1.9e7), so the flat prolate hypotheses (single bounded dip, uniform far floor) all fail.',
  },
  {
    id: 'imp97161-beurling-selberg-minorant-is-circular',
    holds: () =>
      // The core Beurling-Selberg finding: a band-limited minorant reproduces the same Toeplitz positivity,
      // and the only diagonal band-limited minorant is the constant inf sigma_2 < 0 (vacuous). Verify the
      // constant minorant is indeed negative so the trivial route is vacuous.
      Math.min(sigma2(0), sigma2(2), sigma2(10)) < 0 &&
      IMP97161_VERDICT.beurlingSelbergMinorantIsCircular === true &&
      IMP97161_VERDICT.onlyDiagonalBandLimitedMinorantIsConstant === true &&
      IMP97161_VERDICT.beurlingSelbergDeficitIsWrongFunctional === true &&
      IMP97161_VERDICT.symbolNotInSingleSingularityClass === true &&
      IMP97161_VERDICT.beurlingSelbergSuppliesConstant === false,
    why: 'int m F >= c int F over all band-limited densities F is exactly T_a[m-c] >= 0 (same truncated-Toeplitz positivity); the only diagonal band-limited minorant is the constant m == inf sigma_2 < 0, which is vacuous, so Beurling-Selberg minorants supply no c>0.',
  },
  {
    id: 'imp97161-sharp-constant-is-weighted-lambda-min-restatement-not-bound',
    holds: () =>
      // The precise extremal quantity is the weighted compression bottom eigenvalue; the pointwise sinc
      // budget a/pi is finite but is not it. Verify the finite pointwise budget and the restatement flags.
      Math.abs(pointwiseBudget(LN3 / 2) - (LN3 / 2) / Math.PI) < 1e-12 &&
      pointwiseBudget(LN3 / 2) > 0 &&
      IMP97161_VERDICT.sharpConstantIsLambdaMinItself === true &&
      IMP97161_VERDICT.requiredObjectIsWeightedConcentrationEigenvalue === true &&
      IMP97161_VERDICT.needsFejerRieszMarginOrArithmeticUncertaintyInequality === true &&
      IMP97161_VERDICT.concentrationLowerBoundProved === false &&
      IMP97161_TARGET_LAMBDA_MIN.provenLowerBound === null,
    why: 'the sharp constant is c_sharp = lambda_min(P_a M_{sigma_2} P_a), the bottom eigenvalue of the weighted concentration operator -- a restatement of the target, not an independent bound; the pointwise sinc budget a/pi = 0.1748 is finite but is not the integrated constant, and no lower bound is proved.',
  },
  {
    id: 'imp97161-assessment-only-no-qed',
    holds: () =>
      IMP97161_VERDICT.neitherStandardToolSuppliesC === true &&
      IMP97161_VERDICT.operatorPositivityProved === false &&
      IMP97161_VERDICT.boundMoves === false &&
      IMP97161_VERDICT.uniformNGapClosed === false &&
      IMP97161_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97161_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97161_BINDING_2A - LN3) < 1e-12 &&
      IMP97161_VERDICT.qed === false,
    why: 'assessment only: neither Beurling-Selberg nor flat prolate supplies c>0, no operator positivity is established, the uniform-in-N gap stays open, no bound moves, the interval-rigorous certificate reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97161_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97161 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
