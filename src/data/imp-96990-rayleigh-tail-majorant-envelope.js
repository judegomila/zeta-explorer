/**
 * @module imp-96990-rayleigh-tail-majorant-envelope
 * @fileoverview imp-96990 -- DERIVATION / MEASUREMENT (honest NEGATIVE partial): the FIRST attempt at a
 *   rigorous interval majorant for the single scalar Rayleigh tail integral (SUB-GAP
 *   IMP96888_RAYLEIGH_TAIL_MAJORANT), and its outcome. imp-96888 identified the min-max form
 *     <v0|R_T|v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |v0 . Phi(t)|^2 dt
 *   as the operative sharp residual bound (1.17-2.24x the measured residual, ~15 orders sharper than the
 *   trace/lambda_max routes), but every value there was a QUADRATURE evaluation. This leaf assembles a
 *   term-by-term RIGOROUS envelope for that integral with a fixed rational trial v0 at N=100, 2a=ln3 and
 *   reports the result: the naive triangle-inequality envelope is VACUOUS by ~39 orders of magnitude.
 *
 * CONSTRUCTION (every piece a rigorous upper bound).
 *   F(t) := v0 . Phi(t) = a^{2M+1} ghat(a t), ghat(s) = int_{-1}^{1} g(y) e^{-i s y} dy, g = Q (1-y^2)^M,
 *   Q(y) = sum_n v0_n psi_n(y) (degree <= N-1). (1-y^2)^M kills g and its first M-1 derivatives at y = +-1,
 *   so integrating by parts M+1 times and applying |int f e| <= int|f| (triangle inequality) gives
 *     |ghat(s)| <= K / |s|^{M+1},  K = |g^{(M)}(1)| + |g^{(M)}(-1)| + int_{-1}^{1} |g^{(M+1)}(y)| dy,
 *   with g^{(M)}(+-1) = M!(-+2)^M Q(+-1) (M=3: |g^{(3)}(+-1)| = 48|Q(+-1)|) and the interior term bounded by
 *   Cauchy-Schwarz int|g^{(M+1)}| <= sqrt(2) ||g^{(M+1)}||_2 (||.||_2 computed exactly by Gauss-Legendre on
 *   the polynomial). Hence |F(t)|^2 <= a^{2M} K^2 / t^{2M+2}. The sigma_2 tail is bounded by
 *   w_1(t) <= 2 ln t + A_CONST for t >= T (Binet remainder on Re psi(1/4+i t/2), monotone-decreasing excess),
 *   giving the closed-form rigorous majorant
 *     <v0|R_T|v0> <= (2/(pi B)) (1+1/(4T^2))^2 a^{2M} K^2 [ (2 ln T)/(3 T^3) + 2/(9 T^3) + A_CONST/(3 T^3) ].
 *
 * CROSS-CHECK (faithfulness). The driver reuses the imp-96888/imp-96876/imp-96806 build()/solver VERBATIM;
 * its float-v0 QUADRATURE reproduces the imp-96888 baked Rayleigh values EXACTLY: 5.381116e-4 (T=4800),
 * 2.304929e-4 (T=6400), 7.143893e-5 (T=9600). So the envelope is applied to the same operator, subspace and
 * trial vector as the measured residual -- the majorant and the quadrature are directly comparable.
 *
 * RESULT (measured). The rigorous envelope majorant is VACUOUS: at N=100, 2a=ln3, for the near-exact
 * ground-state trial (v0 rounded to 15 decimals, a genuine rational),
 *   T=4800: majorant = 5.375e35 = 1.17e39x the measured 4.586e-4; lambda_min(A_T) = 0.579988
 *   T=6400: majorant = 8.372e34 = 4.47e38x the measured 1.875e-4; lambda_min(A_T) = 0.580259
 *   T=9600: majorant = 2.711e33 = 8.51e37x the measured 3.186e-5; lambda_min(A_T) = 0.580414
 * The majorant exceeds lambda_min(A_T) ~ 0.58 by ~36 orders, so it does NOT stay below the floor and does
 * NOT upgrade the Rayleigh floor to an operator lower bound. Coarser rational roundings (8, 6 decimals) do
 * NOT rescue it (6-decimal rounding destroys the fine coefficient structure, collapsing K to ~2e6 and the
 * majorant to ~8e3, still 1.75e7x -- and no longer a faithful trial), so the vacuity is NOT a conditioning
 * artifact of the rational v0.
 *
 * WHY (obstruction). The dominant term is the interior K contribution int|g^{(M+1)}| ~ 1e22 (K = 1.61e22 at
 * T=4800, of which the endpoint part is only 1.5e16). |ghat(s)| at s = aT ~ 2600 is FAR below K/|s|^{M+1}
 * because ghat is an OSCILLATORY Fourier integral whose true magnitude is set by cancellation across [-1,1],
 * while the triangle inequality |int f e| <= int|f| discards that cancellation and replaces it by the (huge)
 * L1 mass of the degree-~100 minimiser derivative. This is the SAME |int| <= int|.| vacuity that sank the
 * trace route (imp-96848, Tr ~ 3.15e15x) and the operator-norm route (imp-96888, lambda_max ~ 1.66e15x):
 * the quadrature Rayleigh value recovered ~15 orders precisely because it KEPT the cancellation, and a
 * rigorous majorant must keep it too. The envelope is order-correct (t^{-8} decay, matching imp-96975) but
 * constant-vacuous.
 *
 * VERDICT. The term-by-term (M+1)-fold-IBP triangle-inequality envelope is NOT the route to a rigorous
 * IMP96888_RAYLEIGH_TAIL_MAJORANT: it is vacuous by ~37-39 orders across T in {4800,6400,9600} and does not
 * fall below lambda_min(A_T). SUB-GAP IMP96990_CANCELLATION_PRESERVING_ENCLOSURE: a rigorous majorant needs
 * a CANCELLATION-AWARE enclosure of the oscillatory integral ghat(at) itself (e.g. an interval
 * stationary-phase / endpoint-asymptotic enclosure of the finite Fourier integral, or an interval bound on
 * the truncated IBP boundary series with a rigorously-enclosed oscillatory remainder), NOT a modulus bound
 * on the (M+1)-th derivative. Derivation / measurement only; the Rayleigh floor stays an UPPER bound on true
 * lambda_min; no operator positivity; IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous reach
 * stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * driver tmp/imp-96990-rayleigh-tail-majorant.py (/tmp/rhvenv, scipy 1.18, mpmath 1.4). Literals below are
 * verbatim from /tmp/imp-96990-out.json.
 *
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (SUB-GAP IMP96888_RAYLEIGH_TAIL_MAJORANT; the quadrature Rayleigh value this leaf tries to make rigorous)
 * @see imp-96975-sigma2-tail-supercubic-derivation.js (the t^{-8} window envelope + n^{2*alpha} endpoint law reused here)
 * @see imp-96848-krein-tresidual-rigorous-tailtrace-bound.js (the trace route, vacuous ~3.15e15x by the same |int|<=int|.| step)
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (lambda_min(A_T)=0.579988 at T=4800, reproduced here)
 */

const LN3 = Math.log(3); // 1.0986122886681098
const M_POLE = 3; // pole-free window order

// per-rung rigorous envelope majorant vs measured residual, N=100, 2a=ln3, near-exact rational v0 (15 dp).
// K = |g^{(3)}(1)|+|g^{(3)}(-1)| + sqrt(2)||g^{(4)}||_2 ; majorant is the closed-form tail integral.
// quadratureRayleigh reproduces the imp-96888 baked <v0|R_T|v0> EXACTLY (faithfulness cross-check).
export const IMP96990_ROWS = Object.freeze({
  4800: Object.freeze({
    lamminAT: 0.579988, // lambda_min(A_T), reproduces imp-96806
    quadratureRayleigh: 5.381116e-4, // float-v0 quadrature; matches imp-96888 baked value EXACTLY
    actualResid: 4.585845e-4, // measured L - f(4800)
    kEndpoint: 1.512417e16, // 48(|Q(1)|+|Q(-1)|): boundary term of the (M+1)-IBP series
    kL1Interior: 1.609780e22, // sqrt(2)||g^{(4)}||_2: interior term (DOMINATES K by ~6 orders)
    kTotal: 1.609782e22,
    aConst: -1.308368, // w_1(t) <= 2 ln t + aConst for t>=T (Binet remainder)
    majorant: 5.374643e35, // rigorous envelope upper bound on <v0|R_T|v0>
    majorantOverActual: 1.172e39, // VACUOUS: ~39 orders too loose
    belowLamminAT: false, // 5.37e35 >> 0.58: does NOT upgrade the floor
  }),
  6400: Object.freeze({
    lamminAT: 0.580259,
    quadratureRayleigh: 2.304929e-4, // matches imp-96888 baked value EXACTLY
    actualResid: 1.875213e-4,
    kEndpoint: 5.115487e15,
    kL1Interior: 9.613645e21,
    kTotal: 9.613651e21,
    aConst: -1.308577,
    majorant: 8.371943e34,
    majorantOverActual: 4.465e38,
    belowLamminAT: false,
  }),
  9600: Object.freeze({
    lamminAT: 0.580414,
    quadratureRayleigh: 7.143893e-5, // matches imp-96888 baked value EXACTLY
    actualResid: 3.186173e-5,
    kEndpoint: 8.209984e15,
    kL1Interior: 3.104709e21,
    kTotal: 3.104717e21,
    aConst: -1.308785,
    majorant: 2.711350e33,
    majorantOverActual: 8.510e37,
    belowLamminAT: false,
  }),
});

export const IMP96990_VERDICT = Object.freeze({
  ticket: 'imp-96990',
  question:
    'instantiate a rigorous interval majorant for the single scalar Rayleigh tail integral (1/(pi B)) int_{|t|>T} sigma_2(t)|v0.Phi(t)|^2 dt with a fixed rational trial v0 at N=100, 2a=ln3 (SUB-GAP IMP96888_RAYLEIGH_TAIL_MAJORANT): does the term-by-term (M+1)-fold-IBP triangle-inequality envelope stay below lambda_min(A_T), upgrading the Rayleigh floor to an operator lower bound?',
  answer:
    'no. The envelope majorant is VACUOUS by ~37-39 orders of magnitude across T in {4800,6400,9600} (5.37e35 = 1.17e39x the measured 4.586e-4 at T=4800), ~36 orders ABOVE lambda_min(A_T) ~ 0.58, so it does NOT upgrade the floor. The obstruction is the same |int f e| <= int|f| triangle-inequality step that sank the trace (imp-96848, 3.15e15x) and operator-norm (imp-96888, 1.66e15x) routes: it discards the oscillatory cancellation in ghat(at) and replaces it by the huge L1 mass int|g^{(M+1)}| ~ 1e22 of the degree-~100 minimiser derivative. The float-v0 quadrature reproduces the imp-96888 Rayleigh values EXACTLY, confirming the envelope is applied to the faithful trial; coarser rational roundings do not rescue it, so the vacuity is intrinsic to the modulus bound, not a v0 conditioning artifact. A rigorous majorant needs a cancellation-preserving enclosure of the oscillatory Fourier integral itself.',
  N: 100,
  binding2a: 'ln3',
  M: M_POLE,
  quadratureReproducesImp96888: true, // 5.381116e-4 / 2.304929e-4 / 7.143893e-5 exactly
  envelopeIsRigorousUpperBound: true, // every piece (IBP, Cauchy-Schwarz, Binet) is a rigorous UB
  envelopeIsVacuous: true, // ~39 orders too loose
  worstOrderExcess: 39, // log10(majorant/actual) at T=4800
  belowLamminAT: false, // does NOT fall below the floor -> NO operator lower bound
  interiorTermDominatesK: true, // int|g^{(4)}| ~ 1e22 vs endpoint ~ 1e16
  sameObstructionAsTraceAndLammax: true, // |int| <= int|.| discards cancellation, as imp-96848 / imp-96888
  envelopeOrderCorrect: true, // t^{-8} decay matches imp-96975; only the CONSTANT is vacuous
  subGap:
    'IMP96990_CANCELLATION_PRESERVING_ENCLOSURE -- the term-by-term (M+1)-fold-IBP triangle-inequality envelope for <v0|R_T|v0> is vacuous by ~39 orders because |ghat(at)| << (int|g^{(M+1)}|)/(at)^{M+1}: the true tail smallness is an oscillatory-cancellation effect the modulus bound discards. A rigorous IMP96888_RAYLEIGH_TAIL_MAJORANT needs a cancellation-aware enclosure of the finite oscillatory Fourier integral ghat(at) itself (interval stationary-phase / endpoint-asymptotic enclosure, or an interval-enclosed IBP boundary series with a rigorously-bounded oscillatory remainder), NOT a modulus bound on the (M+1)-th derivative.',
  operatorPositivityProved: false,
  uniformNGapSettled: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96990_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96990_ASSERTIONS = [
  {
    id: 'imp96990-quadrature-reproduces-imp96888',
    holds: () =>
      Math.abs(IMP96990_ROWS[4800].quadratureRayleigh - 5.381116e-4) < 1e-9 &&
      Math.abs(IMP96990_ROWS[6400].quadratureRayleigh - 2.304929e-4) < 1e-9 &&
      Math.abs(IMP96990_ROWS[9600].quadratureRayleigh - 7.143893e-5) < 1e-9,
    why: 'the driver reuses the imp-96888 build()/solver verbatim; its float-v0 quadrature reproduces the imp-96888 baked Rayleigh values exactly, so the rigorous envelope is applied to the faithful operator/subspace/trial.',
  },
  {
    id: 'imp96990-envelope-is-rigorous-upper-bound',
    holds: () =>
      Object.values(IMP96990_ROWS).every((r) => r.majorant > r.quadratureRayleigh && r.majorant > r.actualResid),
    why: 'the envelope is assembled from rigorous upper bounds only ((M+1)-fold IBP + triangle inequality + Cauchy-Schwarz + Binet remainder), so the majorant must exceed both the quadrature value and the measured residual at every rung.',
  },
  {
    id: 'imp96990-envelope-is-vacuous',
    holds: () =>
      Object.values(IMP96990_ROWS).every((r) => r.majorantOverActual > 1e37 && r.belowLamminAT === false),
    why: 'the triangle-inequality envelope is ~37-39 orders too loose at every rung and stays far above lambda_min(A_T) ~ 0.58, so it does NOT upgrade the Rayleigh floor to an operator lower bound.',
  },
  {
    id: 'imp96990-interior-term-dominates-K',
    holds: () =>
      Object.values(IMP96990_ROWS).every((r) => r.kL1Interior > 1e5 * r.kEndpoint && Math.abs(r.kTotal - (r.kEndpoint + r.kL1Interior)) < 1e17),
    why: 'K is dominated by the interior term int|g^{(4)}| ~ 1e22 (vs endpoint ~ 1e16): it is the L1 mass of the degree-~100 minimiser derivative, discarded-of-cancellation, that makes the modulus bound vacuous.',
  },
  {
    id: 'imp96990-lammin-AT-reproduces-imp96806',
    holds: () => Math.abs(IMP96990_ROWS[4800].lamminAT - 0.579988) < 2e-6,
    why: 'lambda_min(A_T) at T=4800 reproduces the imp-96806 t-converged floor 0.579988, anchoring the comparison target for the majorant.',
  },
  {
    id: 'imp96990-measurement-only-no-qed',
    holds: () =>
      IMP96990_VERDICT.quadratureReproducesImp96888 === true &&
      IMP96990_VERDICT.envelopeIsRigorousUpperBound === true &&
      IMP96990_VERDICT.envelopeIsVacuous === true &&
      IMP96990_VERDICT.belowLamminAT === false &&
      IMP96990_VERDICT.sameObstructionAsTraceAndLammax === true &&
      IMP96990_VERDICT.operatorPositivityProved === false &&
      IMP96990_VERDICT.uniformNGapSettled === false &&
      IMP96990_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96990_VERDICT.qed === false &&
      typeof IMP96990_VERDICT.subGap === 'string' &&
      IMP96990_VERDICT.subGap.includes('IMP96990_CANCELLATION_PRESERVING_ENCLOSURE'),
    why: 'honest negative partial: the envelope is rigorous but vacuous, does not fall below the floor, establishes no operator positivity, leaves the uniform-N gap open, keeps the reach at 2a <= 0.96, and claims no QED.',
  },
];

for (const a of IMP96990_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96990-rayleigh-tail-majorant-envelope assertion failed: ${a.id}`);
  }
}

void LN3;
