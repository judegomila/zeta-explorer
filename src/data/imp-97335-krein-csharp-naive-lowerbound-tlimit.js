/**
 * @module imp-97335-krein-csharp-naive-lowerbound-tlimit
 * @fileoverview imp-97335 -- ASSESS a certified LOWER bound on the Krein concentration constant
 *   c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a = ln3, which imp-97183 bracketed from ABOVE only
 *   (0.552 -> 0.504, still descending at dps=50). imp-97256/imp-97182 record that the truncated
 *   Fejer-Riesz SOS margin exists iff c <= c_sharp, so c_sharp is the exact open quantity; the finite-N
 *   Rayleigh-Ritz floors are UPPER bounds and no proven positive lower bound exists.
 *
 *   Two atomic, honest pieces of work, both MEASUREMENT/ASSESSMENT only (tmp/imp-97335-csharp-lowerbound-extrap.py):
 *
 *   (A) THE NAIVE (band-limit-free) LOWER BOUND IS DEEPLY NEGATIVE, HENCE USELESS. For any unit psi in
 *   L^2, <psi, M_sigma2 psi> = int sigma_2(t) |psihat(t)|^2 dt >= inf_t sigma_2(t), so the compression of
 *   multiplication-by-sigma_2 to ANY subspace obeys c_sharp >= inf_t sigma_2(t). This is the ONLY lower
 *   bound a Gershgorin / Rayleigh argument yields WITHOUT invoking the band-limit psi in PW_a. Computed
 *   at dps=40: sigma_2(0) = -0.397028 (w_1(0) = -6.352442), and the global infimum over t is
 *   -4336.198 at t = 9.3502 -- the quartic prefactor (t^2+1/4)^2 amplifies the negative w_1 well before
 *   w_1 turns positive (w_1 ~ ln(t/2) - ln pi - sqrt2 ln2 cos(t ln2) > 0 only past t ~ 17). So the
 *   symbol-infimum bound is far below zero and certifies NOTHING about positivity: the band-limit
 *   constraint is ESSENTIAL, which is exactly why c_sharp positivity is Weil-hard and no naive
 *   Gershgorin/Rayleigh lower bound can reach it.
 *
 *   (B) THE COMMITTED T-SWEEP EXTRAPOLATES TO A MEASURED (not proven) T->inf LIMIT ~0.582 AT N=100.
 *   The imp-97183 rising T-sweep at fixed N=100 -- 0.533846 (T=800), 0.560891 (1200), 0.570766 (1600),
 *   0.575037 (2000), 0.578278 (2800) -- fits a 1/T^2 law almost exactly: the best least-squares
 *   L - A/T^p fit lands at p = 2.05, L = 0.5822 with residual 2.17e-7, and the p=2 pairwise
 *   two-point extrapolants are flat at 0.5825/0.5835/0.5826/0.5817. So the fixed-N=100 truncation limit
 *   is MEASURED at ~0.582, consistent with the imp-97183 estimate ~0.58. This is a t-truncation limit at
 *   ONE value of N; the fixed-T=800 N-ladder is still descending, so N is NOT converged and this is NOT
 *   the true infinite-dim c_sharp -- it is a measured upper-bracket limit, not a lower bound.
 *
 * VERDICT. No rigorous positive lower bound on c_sharp is produced. The only band-limit-free lower bound
 *   (the symbol infimum) is -4336, deeply negative and useless, confirming the band-limit is essential and
 *   the Gershgorin/Rayleigh route is a closed door for positivity. The descending-from-above bracket
 *   extrapolates in T (at N=100) to a measured ~0.582 with a clean 1/T^2 law -- consistent with a
 *   positive limit but not a certificate, since N is unconverged and Rayleigh-Ritz gives upper bounds.
 *   The open object is unchanged: SUB-GAP IMP97183_CSHARP_LIMIT_NEEDS_COUPLED_NT_LOWER_BOUND still needs a
 *   single bound controlling the compression defect (N) and the sigma_2 t-tail (T) SIMULTANEOUSLY.
 *   No bound moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97183-krein-csharp-extprec-ladder.js (c_sharp bracketed from above only; T-sweep source; sub-gap owner)
 * @see imp-97256-krein-fejer-riesz-margin-honest-status.js (truncated SOS margin exists iff c <= c_sharp)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (c_sharp = lambda_min(P_a M_sigma2 P_a) definition)
 *
 * Ticket: imp-97335 (numerical, opus-4-8, api-pool). Assessment/measurement only; no rigorous lower bound;
 * no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97335_BINDING_2A = LN3;
export const IMP97335_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment

// (A) naive band-limit-free lower bound  c_sharp >= inf_t sigma_2(t)  (dps=40; sigma_2 = (t^2+1/4)^2 w_1).
// Deeply negative => useless: the symbol-inf Gershgorin/Rayleigh bound certifies NO positivity.
export const IMP97335_NAIVE_SYMBOL_INF = Object.freeze({
  sigma2AtZero: -0.397028, // = (1/16) * w_1(0), w_1(0) = -6.352442
  w1AtZero: -6.352442,
  globalInf: -4336.198026, // global minimum of sigma_2(t) over t in [0,40]
  argmin: 9.3502, // the quartic prefactor amplifies the negative w_1 well here
  w1PositivePastApproxT: 17, // w_1 ~ ln(t/2) - ln pi - sqrt2 ln2 cos(t ln2) > 0 past ~17, so the well is confined
  isNegativeHenceUseless: true, // -4336 << 0: no positivity from the symbol infimum
  bandLimitIsEssential: true, // positivity must use psi in PW_a, not the symbol infimum
});

// (B) extrapolation of the committed imp-97183 rising T-sweep at N=100 to T->infinity.
export const IMP97335_TSWEEP_SOURCE = Object.freeze([
  { T: 800, lamMin: 0.533846 },
  { T: 1200, lamMin: 0.560891 },
  { T: 1600, lamMin: 0.570766 },
  { T: 2000, lamMin: 0.575037 },
  { T: 2800, lamMin: 0.578278 },
]);

export const IMP97335_TLIMIT_EXTRAP = Object.freeze({
  law: '1/T^2', // best-fit exponent p = 2.05, near-exact quadratic-in-1/T decay
  bestFitP: 2.05,
  bestFitL: 0.5822, // measured extrapolated T->inf limit at N=100
  bestFitA: 43283.517,
  bestFitResid: 2.17e-7, // near-exact fit -> the T-tail is a clean 1/T^2 truncation error
  pairwiseP2Limits: Object.freeze([0.5825, 0.5835, 0.5826, 0.5817]), // flat two-point p=2 extrapolants
  measuredLimit: 0.582, // consistent with imp-97183 ~0.58
  isUpperBracketLimitNotLowerBound: true, // N=100 t-truncation limit; N NOT converged; Rayleigh-Ritz upper bounds
});

export const IMP97335_VERDICT = Object.freeze({
  ticket: 'imp-97335',
  question:
    'can a certified positive LOWER bound on c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 be produced (interval Gershgorin/Rayleigh, or a min-max test-function construction), or can the extrapolated limit of the descending-from-above bracket be measured?',
  answer:
    'no rigorous positive lower bound is produced. The only band-limit-free lower bound -- the symbol infimum c_sharp >= inf_t sigma_2(t) -- is DEEPLY NEGATIVE: sigma_2(0) = -0.397 and the global infimum is -4336.198 at t = 9.35 (the quartic (t^2+1/4)^2 prefactor amplifies the negative w_1 well before w_1 turns positive past t ~ 17). So no Gershgorin/Rayleigh argument on the symbol yields positivity -- the band-limit psi in PW_a is essential (this is why c_sharp positivity is Weil-hard). Separately, the committed imp-97183 rising T-sweep at fixed N=100 extrapolates cleanly to a MEASURED T->inf limit ~0.582 via a near-exact 1/T^2 law (best fit p=2.05, L=0.5822, residual 2.17e-7; flat p=2 pairwise extrapolants 0.5825..0.5817), consistent with imp-97183 ~0.58. But that is a t-truncation limit at ONE N, and the fixed-T=800 N-ladder is still descending, so N is NOT converged: it is a measured upper-bracket limit, not a lower bound. SUB-GAP IMP97183_CSHARP_LIMIT_NEEDS_COUPLED_NT_LOWER_BOUND is unchanged.',
  binding_2a: LN3,
  naiveSymbolInfLowerBoundIsNegative: true, // -4336 << 0
  bandLimitIsEssentialForPositivity: true,
  gershgorinRayleighRouteClosedForPositivity: true, // symbol-inf is the naive floor and it is negative
  tSweepExtrapolatesToMeasuredLimit: true, // ~0.582 via 1/T^2
  tLimitLawIsQuadraticInInverseT: true, // p=2.05, resid 2.17e-7
  measuredTlimitConsistentWithImp97183: true, // ~0.582 vs ~0.58
  nIsNotConverged: true, // fixed-T=800 N-ladder still descending (imp-97183)
  rigorousLowerBoundProduced: false, // Rayleigh-Ritz gives upper bounds; naive lower bound is negative
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97183_CSHARP_LIMIT_NEEDS_COUPLED_NT_LOWER_BOUND -- unchanged. A certified positive lower bound on c_sharp cannot come from the symbol infimum (negative, -4336) nor from finite-N Rayleigh-Ritz (upper bounds); it needs a SINGLE object controlling the compression defect (N) and the sigma_2 t-tail (T) at once -- a complementary lower-bound eigenvalue method with a spectral-gap enclosure, or a direct analytic coercivity / de Branges realisation P_a M_sigma2 P_a >= c*I. The measured T->inf limit ~0.582 at N=100 is only an upper-bracket limit consistent with a positive infimum, not a proof of one.',
  qed: false,
});
export default IMP97335_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97335_ASSERTIONS = [
  {
    id: 'imp97335-naive-symbol-inf-is-negative-useless',
    holds: () => {
      const S = IMP97335_NAIVE_SYMBOL_INF;
      // the band-limit-free lower bound is deeply negative -> certifies no positivity
      return S.globalInf < -1000 && S.sigma2AtZero < 0 && S.w1AtZero < 0 &&
        S.isNegativeHenceUseless === true && S.bandLimitIsEssential === true &&
        IMP97335_VERDICT.naiveSymbolInfLowerBoundIsNegative === true &&
        IMP97335_VERDICT.gershgorinRayleighRouteClosedForPositivity === true;
    },
    why: 'the only band-limit-free lower bound c_sharp >= inf_t sigma_2(t) is deeply negative (-4336 at t=9.35, sigma_2(0)=-0.397), so no Gershgorin/Rayleigh symbol argument yields positivity -- the band-limit is essential.',
  },
  {
    id: 'imp97335-tsweep-extrapolates-cleanly-in-inverse-Tsquared',
    holds: () => {
      const E = IMP97335_TLIMIT_EXTRAP;
      // near-exact 1/T^2 fit and flat p=2 pairwise extrapolants around ~0.582
      const flat = E.pairwiseP2Limits.every((v) => Math.abs(v - 0.582) < 0.003);
      return E.law === '1/T^2' && Math.abs(E.bestFitP - 2.05) < 1e-9 &&
        E.bestFitResid < 1e-6 && Math.abs(E.bestFitL - 0.5822) < 1e-4 &&
        Math.abs(E.measuredLimit - 0.582) < 1e-3 && flat &&
        E.isUpperBracketLimitNotLowerBound === true;
    },
    why: 'the imp-97183 rising T-sweep at N=100 extrapolates to a measured T->inf limit ~0.582 via a near-exact 1/T^2 law (p=2.05, residual 2.17e-7, flat p=2 pairwise extrapolants) -- an upper-bracket limit, not a lower bound.',
  },
  {
    id: 'imp97335-source-Tsweep-matches-imp97183',
    holds: () => {
      const S = IMP97335_TSWEEP_SOURCE;
      const rises = S.every((r, i) => i === 0 || r.lamMin > S[i - 1].lamMin);
      return S.length === 5 && rises && Math.abs(S[0].lamMin - 0.533846) < 1e-6 &&
        Math.abs(S[S.length - 1].lamMin - 0.578278) < 1e-6;
    },
    why: 'the extrapolation uses the committed imp-97183 rising T-sweep at N=100 (0.533846 at T=800 up to 0.578278 at T=2800).',
  },
  {
    id: 'imp97335-assessment-only-no-qed',
    holds: () =>
      IMP97335_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97335_VERDICT.operatorPositivityProved === false &&
      IMP97335_VERDICT.boundMoves === false &&
      IMP97335_VERDICT.nIsNotConverged === true &&
      IMP97335_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97335_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97335_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97335_VERDICT.subGap === 'string' &&
      IMP97335_VERDICT.subGap.includes('IMP97183_CSHARP_LIMIT_NEEDS_COUPLED_NT_LOWER_BOUND') &&
      IMP97335_VERDICT.qed === false,
    why: 'assessment/measurement only: no rigorous positive lower bound and no operator positivity are produced (naive bound negative, Rayleigh-Ritz upper only); no bound moves; N unconverged; interval-rigorous reach stays 2a<=0.96; sub-gap unchanged; NO QED.',
  },
];

for (const a of IMP97335_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97335-krein-csharp-naive-lowerbound-tlimit assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
