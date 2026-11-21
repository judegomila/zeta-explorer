/**
 * @module imp-97182-krein-fejer-riesz-margin-factorisation-attempt
 * @fileoverview imp-97182 -- ATTEMPT (proof) of imp-97161 WHAT-WOULD-WORK route 1: a Fejer-Riesz /
 *   de Branges square factorisation
 *       sigma_2 - c = sum of Hermitian squares
 *   valid as a truncated-Toeplitz identity on |u| <= 2a = ln3 with a CERTIFIED margin c > 0 -- the
 *   operator form of the committed CC/Toeplitz-Krein certificate but with a strictly positive constant
 *   at the binding half-width 2a = ln3 (not merely the interval-verified reach 2a <= 0.96). Here
 *       sigma_2(t) = (t^2 + 1/4)^2 w_1(t),   w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln 2).
 *
 *   ATTEMPT / DERIVATION ONLY. The prefactor square is executed exactly; the margin is NOT certified.
 *   Produces NO coercivity constant c > 0 and no operator positivity at 2a = ln3; changes no bound;
 *   interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * STEP 1 -- THE PREFACTOR IS A MANIFEST HERMITIAN SQUARE (this half of the SOS is FREE and exact).
 *   The polynomial prefactor is symbol-positive and factors on the nose:
 *       (t^2 + 1/4)^2 = | (t - i/2)^2 |^2 = | q(t) |^2,   q(t) = (t - i/2)^2,
 *   the classical Fejer-Riesz/Boas-Kac spectral factor (one zero of t^2+1/4 in each half-plane; the
 *   upper-half-plane-analytic outer factor is (t - i/2), squared). Operator-side, multiplication by
 *   (t^2 + 1/4)^2 in the Fourier variable IS the self-adjoint differential lift squared:
 *       t^2  <->  -D^2  (D = d/dx),     (t^2 + 1/4)^2  <->  A^2,   A = (-D^2 + 1/4) = A* (self-adjoint).
 *   So the (D^2+1/4)^2 lift named in imp-97161 is literally A^2 -- a Hermitian square with no residual.
 *
 * STEP 2 -- THE LIFT REDUCES sigma_2-COERCIVITY TO w_1-COERCIVITY ON LIFTED DATA (exact, mod boundary).
 *   For g supported on (-a, a), set h = A g = (-D^2 + 1/4) g, so hhat(t) = (t^2 + 1/4) ghat(t) and
 *   |hhat|^2 = (t^2 + 1/4)^2 |ghat|^2. Then, as a quadratic-form identity,
 *       <T_a[sigma_2] g, g> = (1/2pi) int (t^2+1/4)^2 w_1 |ghat|^2 dt
 *                           = (1/2pi) int w_1 |hhat|^2 dt = <T[w_1] h, h> + (boundary terms),
 *   the boundary terms being the distributional jumps of g, g prime at +-a produced by the local
 *   differential lift. So the WHOLE margin question at the pole-free (order-2) level reduces to the
 *   FIRST-ORDER (order-0) archimedean+single-cosine symbol w_1 tested on the lifted band-limited data h.
 *
 * STEP 3 -- THE RESIDUAL w_1 CARRIES THE NEGATIVITY AND IS THE UNRESOLVED sigma_1 OBJECT (no margin).
 *   The prefactor square is positive but the residual w_1 is NOT: w_1(0) = -6.352 < 0 (hence
 *   sigma_2(0) = (1/4)^2 w_1(0) = -0.397 < 0), and the truncated positivity T[w_1] >= 0 on type-a data
 *   at 2a = ln3 is exactly the FIRST-ORDER Weil object sigma_1 whose sign near ln3 is UNRESOLVED (the
 *   half-pole-free CC Q-trick, sign open near ln3; Route I record). So peeling off the free prefactor
 *   square leaves precisely the open positivity, with NO certified positive margin -- Step 1 gains
 *   structure but not a constant.
 *
 * STEP 4 -- WHY THE MARGIN CANNOT COME FROM FEJER-RIESZ AT ALL (the theorem is an EQUIVALENCE).
 *   Two readings of "sigma_2 - c = sum of Hermitian squares" and why each fails to manufacture c > 0:
 *     (a) SYMBOL level (factor sigma_2 - c = |Q(t)|^2 pointwise with Q of exponential type a): impossible
 *         for EVERY c >= 0 because sigma_2 dips negative (sigma_2(0) = -0.397 < 0), so sigma_2 - c < 0
 *         somewhere and no pointwise square exists. The positivity is genuinely TRUNCATED (band-limited),
 *         not pointwise; symbol Fejer-Riesz/Boas-Kac is simply unavailable.
 *     (b) OPERATOR / truncated level (the kernel Ksig(x-y) - c delta(x-y) is a positive-definite kernel on
 *         (-a,a)^2, i.e. a Mercer sum of Hermitian squares): by Mercer this holds if and only if
 *         c <= lambda_min(P_a M_{sigma_2} P_a) = c_sharp. Producing the truncated SOS WITH margin c is thus
 *         LOGICALLY EQUIVALENT to certifying c <= c_sharp -- exactly the open quantity the numerics only
 *         bracket from ABOVE (0.552 certificate -> 0.534 Legendre -> 0.476 shift-invert -> 0.504 at N=132,
 *         still descending; imp-97183). Fejer-Riesz is a factorisation TOOL that re-expresses positivity
 *         once known; it is not a positivity CERTIFICATE that generates a margin.
 *   The ONE place a Fejer-Riesz-type square IS constructive with a margin -- the LP/Krein DUAL square, i.e.
 *   the committed certificate F = sigma_2 + nu >= 0 -- has its interval-verified positive-margin wall at
 *   a >= 0.50, and a = ln3/2 = 0.5493 lies PAST that wall, so no strictly positive epsilon is certified
 *   there either.
 *
 * VERDICT. Route 1 of imp-97161 does NOT yield a certified c > 0 at 2a = ln3, and the obstruction is
 *   precise and structural, not a lack of effort. The prefactor (t^2+1/4)^2 = |(t-i/2)^2|^2 = A^2 is a
 *   FREE exact Hermitian square (the self-adjoint lift squared), and applying it reduces sigma_2-coercivity
 *   to w_1-coercivity on the lifted data h = (-D^2+1/4) g (mod boundary terms). But the residual w_1 is the
 *   first-order sigma_1 Weil symbol -- negative at the origin (w_1(0) = -6.352) and with sign UNRESOLVED
 *   near ln3 -- so no positive margin survives. And Fejer-Riesz cannot supply one in principle: the
 *   symbol-level square is unavailable because sigma_2 dips negative, while the truncated (Mercer) square
 *   with margin c exists iff c <= c_sharp = lambda_min(P_a M_{sigma_2} P_a) -- the equivalence collapses the
 *   margin onto c_sharp itself, the unknown the numerics bracket only from above. The constructive LP-dual
 *   square (the committed certificate) has its positive-margin wall at a >= 0.50 < ln3/2 = 0.5493.
 *   SUB-GAP IMP97182_FEJER_RIESZ_MARGIN_IS_CSHARP_ITSELF. Attempt only; no operator positivity established;
 *   no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.
 *
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (named this route 1; c_sharp = lambda_min(P_a M_sigma2 P_a))
 * @see imp-97183-krein-csharp-extprec-ladder.js (c_sharp bracketed from above only, 0.625 -> 0.504, still descending)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; w_1, sigma_1, sigma_2; reach 2a<=0.96)
 */

import { w1, sigma1, sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor
export const IMP97182_BINDING_2A = LN3;
export const IMP97182_RIGOROUS_REACH_2A = 0.96; // unchanged by this attempt
export const IMP97182_LP_MARGIN_WALL_A = 0.50; // committed LP-dual positive-margin wall; ln3/2 = 0.5493 > 0.50

// STEP 1 -- the prefactor spectral factor q(t) = (t - i/2)^2, so |q(t)|^2 = (t^2 + 1/4)^2 exactly.
// Returns [Re q, Im q] as a check that |q|^2 reproduces the prefactor (a manifest Hermitian square).
export function prefactorSpectralFactor(t) {
  // q(t) = (t - i/2)^2 = (t^2 - 1/4) - i t
  return { re: t * t - 0.25, im: -t };
}
export function prefactorFromFactor(t) {
  const { re, im } = prefactorSpectralFactor(t);
  return re * re + im * im; // = (t^2 + 1/4)^2
}

// The still-descending upper brackets on c_sharp = lambda_min(P_a M_sigma2 P_a) (imp-97161 / imp-97183);
// any Fejer-Riesz margin c is <= c_sharp by the Mercer equivalence, so it inherits these upper bounds and
// has NO proven positive floor.
export const IMP97182_CSHARP_UPPER_BRACKETS = Object.freeze({
  certificate_ln3: 0.552, // committed certificate value at (ln3)/2
  legendreN100: 0.533852, // imp-96772, descending upper bound
  shiftInvertNbig: 0.475606, // imp-96911, descending upper bound
  extPrecN132_T800: 0.503767, // imp-97183, still descending at dps=50
  provenLowerBound: null, // none -- the margin equals this missing object
});

export const IMP97182_VERDICT = Object.freeze({
  ticket: 'imp-97182',
  question:
    'can a Fejer-Riesz / de Branges square factorisation sigma_2 - c = sum of Hermitian squares be produced as a truncated-Toeplitz identity on |u| <= ln3 with a CERTIFIED margin c > 0 at 2a = ln3?',
  answer:
    'NO -- not with a certified c > 0, and the obstruction is structural. The prefactor (t^2+1/4)^2 = |(t-i/2)^2|^2 = A^2 (A = -D^2+1/4 self-adjoint) is a FREE exact Hermitian square, and applying the lift reduces sigma_2-coercivity to w_1-coercivity on the lifted data h = (-D^2+1/4) g (mod boundary terms). But the residual w_1 is the first-order sigma_1 Weil symbol -- w_1(0) = -6.352 < 0 and sign UNRESOLVED near ln3 (the half-pole-free CC Q-trick) -- so no positive margin survives peeling off the prefactor. Fejer-Riesz cannot supply the margin in principle: the SYMBOL square sigma_2 - c = |Q|^2 is unavailable for every c >= 0 because sigma_2 dips negative (sigma_2(0) = -0.397 < 0), and the TRUNCATED (Mercer) square with margin c exists iff c <= c_sharp = lambda_min(P_a M_sigma2 P_a) -- the equivalence collapses the margin onto c_sharp itself, which the numerics only bracket from above (0.552 -> 0.504, still descending; imp-97183). The one constructive margin route, the LP-dual square (committed certificate), has its positive-margin wall at a >= 0.50 < ln3/2 = 0.5493.',
  binding_2a: LN3,
  // Step 1 -- prefactor is a manifest Hermitian square
  prefactorIsManifestSquare: true, // (t^2+1/4)^2 = |(t-i/2)^2|^2
  prefactorEqualsSelfAdjointLiftSquared: true, // (t^2+1/4)^2 <-> A^2, A = -D^2 + 1/4 = A*
  prefactorSquareIsFreeAndExact: true, // this half of the SOS has no residual
  // Step 2 -- exact reduction to w_1 on lifted data
  liftReducesSigma2ToW1OnLiftedData: true, // <T_a[sigma_2] g,g> = <T[w_1] h,h> + boundary, h = A g
  reductionExactModBoundaryTerms: true,
  // Step 3 -- residual carries the negativity, no margin
  residualW1IsFirstOrderSigma1Object: true,
  residualW1NegativeAtOrigin: true, // w_1(0) = -6.352 < 0
  residualW1SignUnresolvedNearLn3: true, // half-pole-free CC Q-trick, open near ln3
  prefactorSquareYieldsNoPositiveMargin: true,
  // Step 4 -- Fejer-Riesz is an equivalence, cannot manufacture a margin
  symbolLevelSquareUnavailable: true, // sigma_2 dips negative -> sigma_2 - c not pointwise nonneg for any c>=0
  truncatedSquareMarginEqualsCsharp: true, // Mercer: SOS with margin c exists iff c <= c_sharp
  fejerRieszIsEquivalenceNotCertificate: true, // re-expresses positivity, does not generate it
  cSharpBracketedFromAboveOnly: true, // 0.552 -> 0.504 descending; no proven lower bound
  lpDualSquareMarginWallBelowLn3Half: true, // wall a >= 0.50 < ln3/2 = 0.5493
  // overall
  certifiedMarginProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  uniformNGapClosed: false,
  subGap:
    'IMP97182_FEJER_RIESZ_MARGIN_IS_CSHARP_ITSELF -- a Fejer-Riesz / de Branges square factorisation sigma_2 - c = sum of Hermitian squares with a certified margin c > 0 at 2a = ln3 is NOT an independent input to Route I coercivity; it inherits exactly the missing estimate. The polynomial prefactor (t^2+1/4)^2 = |(t-i/2)^2|^2 = A^2 (A = -D^2+1/4 self-adjoint) is a free exact Hermitian square, and applying the differential lift gives the exact quadratic-form identity <T_a[sigma_2] g,g> = <T[w_1] h,h> + boundary terms with h = A g -- reducing pole-free (order-2) coercivity to first-order coercivity of the archimedean+single-cosine symbol w_1 on the lifted band-limited data. But the residual w_1 is the first-order sigma_1 Weil object: w_1(0) = -6.352 < 0 (so sigma_2(0) = (1/4)^2 w_1(0) = -0.397 < 0) and its truncated positivity at 2a = ln3 is the half-pole-free CC Q-trick whose sign near ln3 is UNRESOLVED, so peeling off the prefactor leaves the open positivity with NO certified positive margin. Fejer-Riesz cannot supply the margin in principle because the theorem is an EQUIVALENCE: (a) the symbol-level square sigma_2 - c = |Q(t)|^2 (Q of exponential type a) is unavailable for every c >= 0 since sigma_2 dips negative, the positivity being genuinely truncated/band-limited not pointwise; and (b) the truncated (Mercer) square, Ksig(x-y) - c delta(x-y) a positive-definite kernel on (-a,a)^2, exists if and only if c <= c_sharp = lambda_min(P_a M_sigma2 P_a), so producing it WITH margin c is logically equivalent to certifying c <= c_sharp -- exactly the open quantity the numerics only bracket from above (0.552 certificate, 0.534 Legendre, 0.476 shift-invert, 0.504 at N=132 dps=50, still descending; imp-97183) with no proven lower bound. The one constructive margin route, the LP/Krein dual square (the committed certificate F = sigma_2 + nu >= 0), has its interval-verified positive-margin wall at a >= 0.50, and a = ln3/2 = 0.5493 lies past it. Closing the gap needs the SAME coupled N/T lower-bound object (imp-97183) or a direct analytic realisation P_a M_sigma2 P_a >= c*I -- a de Branges coercivity constant, not a factorisation identity. Attempt only; no operator positivity established; no bound moves; interval-rigorous reach stays 2a <= 0.96',
  qed: false,
});
export default IMP97182_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97182_ASSERTIONS = [
  {
    id: 'imp97182-prefactor-is-manifest-hermitian-square',
    holds: () => {
      // (t^2+1/4)^2 = |(t-i/2)^2|^2 exactly, at several sample points -- the free prefactor square.
      const ok = [0, 0.3, 0.7, 1.0, 2.5].every((t) => {
        const lhs = (t * t + 0.25) ** 2;
        const rhs = prefactorFromFactor(t);
        return Math.abs(lhs - rhs) < 1e-12 * (1 + Math.abs(lhs));
      });
      return ok &&
        IMP97182_VERDICT.prefactorIsManifestSquare === true &&
        IMP97182_VERDICT.prefactorEqualsSelfAdjointLiftSquared === true &&
        IMP97182_VERDICT.prefactorSquareIsFreeAndExact === true;
    },
    why: 'the polynomial prefactor factors as a manifest Hermitian square (t^2+1/4)^2 = |(t-i/2)^2|^2 = A^2 with A = -D^2+1/4 self-adjoint -- this half of the SOS is free and exact with no residual.',
  },
  {
    id: 'imp97182-reduction-lands-on-negative-residual-w1',
    holds: () => {
      // sigma_2 = prefactor * w_1 exactly, and the residual w_1 is negative at the origin (carries the
      // negativity) so peeling off the free prefactor square leaves the unresolved first-order object.
      const t = 0.4;
      const identity = Math.abs(sigma2(t) - (t * t + 0.25) ** 2 * w1(t)) < 1e-12 * (1 + Math.abs(sigma2(t)));
      const residualNegAtOrigin = w1(0) < 0 && sigma2(0) < 0;
      const sigma1IsPrefactorOnceW1 = Math.abs(sigma1(t) - (t * t + 0.25) * w1(t)) < 1e-12 * (1 + Math.abs(sigma1(t)));
      return identity && residualNegAtOrigin && sigma1IsPrefactorOnceW1 &&
        IMP97182_VERDICT.liftReducesSigma2ToW1OnLiftedData === true &&
        IMP97182_VERDICT.residualW1NegativeAtOrigin === true &&
        IMP97182_VERDICT.prefactorSquareYieldsNoPositiveMargin === true;
    },
    why: 'sigma_2 = (t^2+1/4)^2 w_1 so the lift reduces coercivity to w_1 on lifted data, but w_1(0) = -6.352 < 0 (hence sigma_2(0) = -0.397 < 0) -- the residual is the negative first-order sigma_1 object, so no positive margin survives.',
  },
  {
    id: 'imp97182-symbol-square-unavailable-margin-is-csharp',
    holds: () =>
      // sigma_2 dips negative -> no pointwise square for any c>=0; the truncated square margin is c_sharp,
      // bracketed from above only with no proven lower bound, and the LP-dual wall sits below ln3/2.
      sigma2(0) < 0 &&
      IMP97182_CSHARP_UPPER_BRACKETS.provenLowerBound === null &&
      IMP97182_CSHARP_UPPER_BRACKETS.extPrecN132_T800 < IMP97182_CSHARP_UPPER_BRACKETS.certificate_ln3 &&
      IMP97182_LP_MARGIN_WALL_A < LN3 / 2 &&
      IMP97182_VERDICT.symbolLevelSquareUnavailable === true &&
      IMP97182_VERDICT.truncatedSquareMarginEqualsCsharp === true &&
      IMP97182_VERDICT.fejerRieszIsEquivalenceNotCertificate === true &&
      IMP97182_VERDICT.lpDualSquareMarginWallBelowLn3Half === true,
    why: 'the symbol-level square is unavailable because sigma_2 dips negative; the truncated Mercer square with margin c exists iff c <= c_sharp, which is bracketed from above only (0.552 -> 0.504, no proven lower bound); and the constructive LP-dual margin wall a >= 0.50 lies below ln3/2 = 0.5493.',
  },
  {
    id: 'imp97182-attempt-only-no-qed',
    holds: () =>
      IMP97182_VERDICT.certifiedMarginProduced === false &&
      IMP97182_VERDICT.operatorPositivityProved === false &&
      IMP97182_VERDICT.boundMoves === false &&
      IMP97182_VERDICT.uniformNGapClosed === false &&
      IMP97182_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97182_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97182_BINDING_2A - LN3) < 1e-12 &&
      IMP97182_VERDICT.qed === false,
    why: 'attempt only: the prefactor square is executed exactly but no certified margin c>0 is produced, no operator positivity is established, the uniform-in-N gap stays open, no bound moves, interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97182_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97182-krein-fejer-riesz-margin-factorisation-attempt assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
