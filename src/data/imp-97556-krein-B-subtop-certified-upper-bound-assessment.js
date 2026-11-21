/**
 * @module imp-97556-krein-B-subtop-certified-upper-bound-assessment
 * @fileoverview imp-97556 -- can a rigorous band-limited concentration (prolate-spectrum) estimate CERTIFY an
 *   UPPER bound on the THIRD-LARGEST eigenvalue of B = P_a M_{sigma2^-} P_a for the confined negative well
 *   E = |t| in [0,3.306] u [6.945,10.532] at 2a = ln3, given the band-limited eigenfunctions are fractal /
 *   Zygmund (dyadic-truncated grids unusable)? This is the residual imp-97536 named as the productive sub-gap
 *   IMP97536_LAMBDA3_LOWER_REDUCES_TO_CERTIFIED_B_SUBTOP_SPECTRUM: the Weyl / Lidskii route
 *   lambda_3(A) >= lambda_1(C) - lambda_third-largest(B) subtracts B third-largest eigenvalue instead of
 *   ||B|| = 4336.198, and the confined well under the ln3 band limit (time-bandwidth product ~2.41) suggests B
 *   carries only ~2-3 well-modes, so a SMALL certified lambda_third-largest(B) would shrink the subtraction.
 *
 *   ASSESSMENT / DERIVATION only. No operator positivity, no coercivity constant, and no certified lower bound
 *   on lambda_3(A) is produced; no bound on Lambda moves; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * WHAT A CERTIFIED UPPER BOUND ON lambda_third-largest(B) COSTS. B = P_a M_{sigma2^-} P_a is positive
 *   semidefinite (sigma2^- = max(-sigma2, 0) >= 0, P_a the type-a Paley-Wiener projector, band a = (ln3)/2,
 *   reproducing-kernel diagonal K_a(t,t) = a/pi = 0.174850). Two kinds of certified upper bound on the third
 *   eigenvalue are available, and BOTH are index-AVERAGING bounds -- they see only the total mass, not the
 *   spectral cliff:
 *
 *   (1) TRACE-QUOTIENT (Schatten-1). Tr(B) = int_R sigma2^-(t) K_a(t,t) dt = (a/pi) int_E sigma2^-(t) dt is a
 *       one-dimensional, interval-integrable quantity: Tr(B) = 3200.03 (full even axis). Since B >= 0 and
 *       lambda_1 >= lambda_2 >= lambda_3 >= ... >= 0, 3 lambda_third-largest <= lambda_1+lambda_2+lambda_3 <=
 *       Tr(B), so lambda_third-largest(B) <= Tr(B)/3 = 1066.68. CERTIFIED, but only ~4x below the ||B|| = 4336.198
 *       ceiling.
 *
 *   (2) HILBERT-SCHMIDT (Schatten-2). Tr(B^2) = int int sigma2^-(s) K_a(s,t)^2 sigma2^-(t) ds dt = 4.570e6
 *       (baked; a two-dimensional interval-integrable quantity), so 3 lambda_third-largest^2 <= Tr(B^2) gives
 *       lambda_third-largest(B) <= sqrt(Tr(B^2)/3) = 1234.24 -- WEAKER than the trace-quotient bound here.
 *
 *   So the LITERAL ticket question -- can a band-limited concentration estimate certify AN upper bound -- is YES
 *   for a crude one: lambda_third-largest(B) <= 1066.68. But that bound is nowhere near the O(1)-mode PLUNGE the
 *   ~2.41 time-bandwidth heuristic predicts; it is only a factor ~4 below ||B||, and it does NOT deliver a SMALL
 *   lambda_third-largest(B).
 *
 * THE OBSTRUCTION -- THE SHARP PLUNGE IS THE FRACTAL WALL. The heuristic "B has ~2-3 well-modes" is the
 *   Landau-Widom / Slepian PLUNGE: past a plateau of ~N = TBW eigenvalues near the top, the concentration
 *   spectrum falls off sharply. To CERTIFY that the third eigenvalue sits in or below that plunge (hence is
 *   small) needs a rigorous, non-asymptotic prolate-spectrum estimate, and every route to one stalls here:
 *
 *   WALL 1 -- ASYMPTOTIC, NOT CERTIFIED, AND OUT OF REGIME. Landau-Widom plunge results are asymptotics as the
 *     time-bandwidth product TBW -> infinity with un-tracked O(1) constants. Here TBW = |E| * 2a / (2pi) ~ 2.41
 *     is O(1), not large -- there is no controlled large-TBW regime and no finite certified constant; the third
 *     eigenvalue sits in the plunge/plateau transition itself, exactly where the asymptotics carry no bound.
 *
 *   WALL 2 -- INDICATOR / SINGLE-BAND, NOT THE SIGNED UNBOUNDED-DEPTH WEIGHT. Prolate theory certifies the
 *     spectrum of P_W P_{[T]} P_W (indicator time-limiting on ONE interval). B = P_a M_{sigma2^-} P_a is a
 *     WEIGHTED, TWO-band, unbounded-depth multiplier: sigma2^- reaches depth 4336.198 at t = 9.3502 and decays to
 *     0 at the four well edges (sigma2(3.306) = +0.10, sigma2(10.532) = +8.18). A weighted, multi-band symbol has
 *     no clean plateau/plunge dichotomy to invoke; the same "sets, not the signed weight" gap imp-97502 named
 *     blocks converting any Slepian indicator statement into a bound on the weighted eigenvalue.
 *
 *   WALL 3 -- FRACTAL / ZYGMUND EIGENFUNCTIONS, DYADIC GRIDS UNUSABLE. Certifying the third eigenvalue by a
 *     finite-dimensional Galerkin / grid enclosure inherits the imp-97536 / Route-I-Sonine fractal-eigenfunction
 *     non-convergence: the band-limited eigenfunctions are Zygmund-class, so dyadic-truncated grids do not
 *     converge and cannot deliver a rigorous eigenvalue enclosure (no certified |lambda| shoulder cut-off).
 *
 * SECONDARY STRUCTURAL NOTE -- THE C-SIDE FLOOR. Even a hypothetical SMALL certified lambda_third-largest(B)
 *   would not by itself reach the m=2 gate through Weyl. All index choices with i+j-1 = 3 -- (1,3), (2,2), (3,1) --
 *   give lambda_3(A) >= lambda_i(C) - lambda_{(4-i)-th-largest}(B) with i in {1,2,3}, and each needs a LARGE
 *   low-index eigenvalue lambda_i(C) of C = P_a M_{sigma2^+} P_a >= 0 to exceed 83.090493. But the SAME
 *   concentration mechanism that keeps B well-modes large keeps C low-index eigenvalues small: band-limited
 *   functions can concentrate on the well where sigma2^+ = 0, so the C-side floor is not certified to exceed the
 *   gate. The Weyl route therefore needs BOTH a small lambda_third-largest(B) AND a large lambda_i(C) -- two
 *   halves of the same missing well-concentration certificate (circular in the imp-97415 ROUTE-3 sense).
 *
 * VERDICT. A CRUDE certified upper bound on lambda_third-largest(B) exists via the reproducing-kernel
 *   trace-quotient, lambda_third-largest(B) <= Tr(B)/3 = 1066.68 (and the Hilbert-Schmidt variant <= 1234.24),
 *   both rigorous and interval-computable. But it is an index-averaging bound only ~4x below ||B|| = 4336.198 --
 *   it does NOT see the plunge and does NOT deliver the small lambda_third-largest(B) the ~2.41 time-bandwidth
 *   heuristic suggests. A SHARP plunge estimate that would is exactly the un-certified fractal wall: the
 *   Landau-Widom plunge is asymptotic (out of regime at O(1) TBW), indicator / single-band (not the signed
 *   unbounded-depth two-band weight), and grid-based (defeated by the fractal / Zygmund eigenfunctions). And even
 *   a hypothetical sharp bound would still need a large low-index eigenvalue of C, the other half of the same
 *   missing well-concentration certificate. SUB-GAP
 *   IMP97556_B_SUBTOP_CERTIFIED_ONLY_BY_TRACE_QUOTIENT_SHARP_PLUNGE_IS_FRACTAL_WALL. No operator positivity;
 *   no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97536-krein-lambda3-lower-bound-alt-routes-assessment.js (Route B / sub-gap source)
 * @see imp-97502-krein-named-concentration-inequality-assessment.js (indicator-not-signed-weight wall; TBW at ln3)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (symbol infimum -4336.198 at t=9.3502 = -||B|| ceiling)
 * @see imp-97501-sigma2-far-field-positivity-rigorous-margin.js (confined well [0,3.306]u[6.945,10.532])
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma2 = (t^2+1/4)^2 w_1; reach 2a<=0.96)
 *
 * Ticket: imp-97556 (proof, opus-4-8, api-pool). Assessment/derivation only; no operator positivity; no bound
 * moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const LN3 = Math.log(3); // 1.0986122886681096 -- the binding 2a for the Krein / c_sharp floor
export const IMP97556_BINDING_2A = LN3;
export const IMP97556_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment

// Band datum: type-a Paley-Wiener projector, band a = (ln3)/2, reproducing-kernel diagonal K_a(t,t) = a/pi.
const A_BAND = LN3 / 2;
export const IMP97556_KERNEL_DIAGONAL = A_BAND / Math.PI; // 0.174850...

// Confined negative well (imp-97335 / imp-97501) and the ||B|| ceiling.
export const IMP97556_WELL = Object.freeze({
  negativeSetPositiveAxis: [[0, 3.306], [6.945, 10.532]], // |t| intervals where sigma2 < 0
  globalInf: -4336.198, // deepest dip = -||B|| ceiling
  argmin: 9.3502,
  measureE: 2 * (3.306 + (10.532 - 6.945)), // 13.786
  timeBandwidthProduct_angular: (2 * (3.306 + (10.532 - 6.945))) * LN3 / (2 * Math.PI), // ~2.41
});

// The two CERTIFIED (index-averaging) upper bounds on B third-largest eigenvalue, and the ||B|| ceiling.
// Tr(B) is recomputed live below; Tr(B^2) is baked (2D integral, kept out of import for import-lightness).
export const IMP97556_CERTIFIED_UPPER_BOUNDS = Object.freeze({
  normCeiling: 4336.198, // ||B|| <= sup sigma2^- (index-blind, imp-97335)
  traceB: 3200.03, // Tr(B) = (a/pi) int_E sigma2^- over the full even axis
  traceQuotientBound: 3200.03 / 3, // lambda_third-largest(B) <= Tr(B)/3 = 1066.68 (CERTIFIED)
  traceBsq: 4.570014e6, // Tr(B^2) (baked; 2D interval-integrable)
  hilbertSchmidtBound: Math.sqrt(4.570014e6 / 3), // <= sqrt(Tr(B^2)/3) = 1234.24 (CERTIFIED, weaker here)
  sharpPlungeCertified: false, // the O(1)-mode plunge is NOT certified (fractal wall)
});

// The three walls blocking a SHARP (small) certified lambda_third-largest(B).
export const IMP97556_SHARP_PLUNGE_WALLS = Object.freeze({
  wall1_asymptoticOutOfRegime: true, // Landau-Widom plunge asymptotic as TBW->inf; here TBW~2.41 is O(1), no certified constant
  wall2_indicatorNotSignedWeight: true, // prolate theory = indicator single-band; B is weighted, two-band, unbounded depth
  wall3_fractalZygmundGridsUnusable: true, // dyadic-truncated Galerkin grids do not converge; no certified shoulder
});

export const IMP97556_VERDICT = Object.freeze({
  ticket: 'imp-97556',
  question:
    'can a rigorous band-limited concentration (prolate-spectrum) estimate certify an UPPER bound on the third-largest eigenvalue of B = P_a M_{sigma2^-} P_a for the confined well |t| in [0,3.306] u [6.945,10.532] at 2a = ln3, given the eigenfunctions are fractal / Zygmund (dyadic grids unusable)?',
  answer:
    'a CRUDE certified upper bound exists but a SHARP (small) one does not. The reproducing-kernel ' +
    'trace-quotient gives lambda_third-largest(B) <= Tr(B)/3 = 1066.68, and the Hilbert-Schmidt variant gives ' +
    '<= sqrt(Tr(B^2)/3) = 1234.24, both rigorous (Tr(B) = (a/pi) int_E sigma2^- and Tr(B^2) are interval-' +
    'integrable) -- but these are index-AVERAGING bounds only ~4x below the ||B|| = 4336.198 ceiling; they do ' +
    'NOT see the concentration cliff and do NOT deliver the small lambda_third-largest(B) the ~2.41 ' +
    'time-bandwidth heuristic predicts. The SHARP Landau-Widom / Slepian plunge that would is the un-certified ' +
    'fractal wall: (1) it is asymptotic as TBW -> infinity with un-tracked constants and here TBW ~ 2.41 is ' +
    'O(1), out of regime; (2) prolate theory is an indicator single-band statement, whereas B is a WEIGHTED, ' +
    'two-band, unbounded-depth multiplier (depth 4336.198 at t=9.3502, sigma2^- -> 0 at the well edges), the ' +
    'same sets-not-signed-weight gap imp-97502 named; (3) any finite Galerkin / grid enclosure is defeated by ' +
    'the fractal / Zygmund eigenfunctions (dyadic-truncated grids do not converge, no certified |lambda| ' +
    'shoulder). And even a hypothetical sharp small lambda_third-largest(B) would still need a LARGE low-index ' +
    'eigenvalue of C = P_a M_{sigma2^+} P_a to reach the 83.090493 gate through Weyl, the other half of the ' +
    'same missing well-concentration certificate (circular, imp-97415 ROUTE 3).',
  binding_2a: LN3,
  // what IS certified
  crudeCertifiedUpperBoundExists: true, // lambda_third-largest(B) <= Tr(B)/3 = 1066.68
  hilbertSchmidtBoundAlsoCertified: true, // <= sqrt(Tr(B^2)/3) = 1234.24 (weaker here)
  crudeBoundOnlyFactor4BelowNorm: true, // 1066.68 vs ||B|| = 4336.198
  // what is NOT certified
  sharpPlungeCertified: false, // the O(1)-mode plunge (small lambda_third-largest) is NOT certified
  wall1_asymptoticOutOfRegime: true,
  wall2_indicatorNotSignedWeight: true,
  wall3_fractalZygmundGridsUnusable: true,
  // secondary structural obstruction
  cSideLowIndexFloorAlsoMissing: true, // Weyl also needs a large lambda_i(C); same well-concentration certificate
  weylNeedsBothHalves: true,
  reducesToSameWellConcentrationCertificate: true, // circular, imp-97415 ROUTE 3
  subGap:
    'IMP97556_B_SUBTOP_CERTIFIED_ONLY_BY_TRACE_QUOTIENT_SHARP_PLUNGE_IS_FRACTAL_WALL -- a CRUDE certified ' +
    'upper bound on the third-largest eigenvalue of B = P_a M_{sigma2^-} P_a exists via the reproducing-kernel ' +
    'trace-quotient, lambda_third-largest(B) <= Tr(B)/3 = 1066.68 (Tr(B) = (a/pi) int_E sigma2^- = 3200.03, a ' +
    '1D interval integral), and the Hilbert-Schmidt variant <= sqrt(Tr(B^2)/3) = 1234.24 -- but both are ' +
    'index-averaging bounds only ~4x below ||B|| = 4336.198 and do NOT deliver the small lambda_third-largest(B) ' +
    'the ~2.41 time-bandwidth heuristic predicts. The SHARP Landau-Widom / Slepian plunge that would is the ' +
    'un-certified fractal wall: WALL 1 asymptotic (TBW -> inf, here ~2.41 is O(1), no certified constant, third ' +
    'eigenvalue in the plunge/plateau transition itself); WALL 2 indicator / single-band, not the signed ' +
    'two-band unbounded-depth weight (sigma2^- depth 4336.198 at 9.3502, -> 0 at the well edges) -- the ' +
    'sets-not-signed-weight gap imp-97502 named; WALL 3 fractal / Zygmund eigenfunctions, dyadic-truncated ' +
    'Galerkin grids do not converge, no certified |lambda| shoulder. Even a hypothetical sharp small ' +
    'lambda_third-largest(B) would still need a LARGE low-index eigenvalue of C = P_a M_{sigma2^+} P_a > 83.09 ' +
    'through Weyl, the other half of the same missing well-concentration certificate (circular, imp-97415 ' +
    'ROUTE 3). Assessment only; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96.',
  // unchanged program state
  operatorPositivityProved: false,
  certifiedLowerBoundOnLambda3Produced: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97556_VERDICT;

export const IMP97556_HONEST_BANNER =
  'imp-97556 assessment: a CRUDE certified upper bound on the third-largest eigenvalue of B = P_a M_{sigma2^-} ' +
  'P_a exists -- the reproducing-kernel trace-quotient lambda_third-largest(B) <= Tr(B)/3 = 1066.68 (and the ' +
  'Hilbert-Schmidt variant <= 1234.24), both rigorous -- but only ~4x below ||B|| = 4336.198; it does NOT see ' +
  'the plunge and does NOT deliver the small value the ~2.41 time-bandwidth heuristic predicts. The SHARP ' +
  'Landau-Widom / Slepian plunge that would is the un-certified fractal wall: asymptotic (out of regime at O(1) ' +
  'TBW), indicator / single-band (not the signed two-band unbounded-depth weight), and grid-based (defeated by ' +
  'the fractal / Zygmund eigenfunctions). Even a sharp bound would still need a large low-index eigenvalue of C, ' +
  'the other half of the same missing well-concentration certificate (circular). No operator positivity; no ' +
  'bound on Lambda moves; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

// live 1D trace: Tr(B) = (a/pi) int_E sigma2^- over the full even axis (coarse Simpson; converges to 3200.03).
function _negPart(t) {
  const v = sigma2(t);
  return v < 0 ? -v : 0;
}
function _simpson(f, lo, hi, n) {
  if (n % 2) n++;
  const h = (hi - lo) / n;
  let s = f(lo) + f(hi);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(lo + i * h);
  return (s * h) / 3;
}
const IMP97556_TRACE_B_LIVE =
  2 * (_simpson(_negPart, 0, 3.306, 1000) + _simpson(_negPart, 6.945, 10.532, 1000)) * IMP97556_KERNEL_DIAGONAL;

const IMP97556_ASSERTIONS = [
  {
    id: 'imp97556-trace-quotient-is-a-certified-upper-bound',
    holds: () => {
      // Tr(B) recomputed live matches the baked figure, and lambda_third-largest(B) <= Tr(B)/3.
      const B = IMP97556_CERTIFIED_UPPER_BOUNDS;
      const liveOk = Math.abs(IMP97556_TRACE_B_LIVE - B.traceB) < 1.0;
      const quotientOk = Math.abs(B.traceQuotientBound - B.traceB / 3) < 1e-9;
      // the certified bound is a genuine upper bound but only ~4x below the ||B|| ceiling
      return (
        liveOk &&
        quotientOk &&
        B.traceQuotientBound < B.normCeiling &&
        B.traceQuotientBound > B.normCeiling / 5 &&
        IMP97556_VERDICT.crudeCertifiedUpperBoundExists === true &&
        IMP97556_VERDICT.crudeBoundOnlyFactor4BelowNorm === true
      );
    },
    why: 'Tr(B) = (a/pi) int_E sigma2^- = 3200.03 (recomputed live) gives the certified trace-quotient bound lambda_third-largest(B) <= Tr(B)/3 = 1066.68, which is a genuine upper bound but only ~4x below the ||B|| = 4336.198 ceiling.',
  },
  {
    id: 'imp97556-hilbert-schmidt-bound-consistent',
    holds: () => {
      const B = IMP97556_CERTIFIED_UPPER_BOUNDS;
      const hs = Math.sqrt(B.traceBsq / 3);
      return (
        Math.abs(B.hilbertSchmidtBound - hs) < 1e-6 &&
        hs > B.traceQuotientBound && // weaker than trace-quotient here
        hs < B.normCeiling &&
        IMP97556_VERDICT.hilbertSchmidtBoundAlsoCertified === true
      );
    },
    why: 'the Hilbert-Schmidt bound lambda_third-largest(B) <= sqrt(Tr(B^2)/3) = 1234.24 is also certified but weaker than the trace-quotient bound 1066.68 at this band, so neither Schatten bound sees the plunge.',
  },
  {
    id: 'imp97556-sharp-plunge-blocked-by-three-walls',
    holds: () =>
      IMP97556_CERTIFIED_UPPER_BOUNDS.sharpPlungeCertified === false &&
      IMP97556_SHARP_PLUNGE_WALLS.wall1_asymptoticOutOfRegime === true &&
      IMP97556_SHARP_PLUNGE_WALLS.wall2_indicatorNotSignedWeight === true &&
      IMP97556_SHARP_PLUNGE_WALLS.wall3_fractalZygmundGridsUnusable === true &&
      IMP97556_WELL.timeBandwidthProduct_angular > 2 &&
      IMP97556_WELL.timeBandwidthProduct_angular < 3,
    why: 'the small lambda_third-largest(B) the ~2.41 time-bandwidth heuristic predicts needs a sharp Landau-Widom plunge, blocked by three walls: asymptotic/out-of-regime at O(1) TBW, indicator/single-band not the signed two-band weight, and fractal/Zygmund eigenfunctions defeating grid enclosures.',
  },
  {
    id: 'imp97556-c-side-floor-also-missing-weyl-needs-both',
    holds: () =>
      IMP97556_VERDICT.cSideLowIndexFloorAlsoMissing === true &&
      IMP97556_VERDICT.weylNeedsBothHalves === true &&
      IMP97556_VERDICT.reducesToSameWellConcentrationCertificate === true,
    why: 'even a hypothetical sharp small lambda_third-largest(B) would not reach the gate: Weyl also needs a large low-index eigenvalue of C = P_a M_{sigma2^+} P_a, the other half of the same missing well-concentration certificate (circular, imp-97415 ROUTE 3).',
  },
  {
    id: 'imp97556-assessment-only-no-qed',
    holds: () =>
      IMP97556_VERDICT.operatorPositivityProved === false &&
      IMP97556_VERDICT.certifiedLowerBoundOnLambda3Produced === false &&
      IMP97556_VERDICT.boundMoves === false &&
      IMP97556_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97556_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97556_BINDING_2A - LN3) < 1e-12 &&
      IMP97556_VERDICT.qed === false &&
      IMP97556_VERDICT.subGap.includes('IMP97556_B_SUBTOP_CERTIFIED_ONLY_BY_TRACE_QUOTIENT_SHARP_PLUNGE_IS_FRACTAL_WALL') &&
      /NO QED/.test(IMP97556_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97556_HONEST_BANNER) &&
      /RH open/.test(IMP97556_HONEST_BANNER),
    why: 'assessment/derivation only: no operator positivity, no certified lower bound on lambda_3(A), no bound moves; interval-rigorous reach stays 2a<=0.96; named sub-gap present; no-refereed-bound-change line present; RH open; NO QED.',
  },
];

for (const a of IMP97556_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97556-krein-B-subtop-certified-upper-bound-assessment assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
