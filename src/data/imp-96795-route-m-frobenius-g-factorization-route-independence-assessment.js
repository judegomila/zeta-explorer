/**
 * @module imp-96795-route-m-frobenius-g-factorization-route-independence-assessment
 *
 * imp-96795 (proof/assessment ONLY): does the orphan imp-96688 Route M Frobenius
 * g-factorization yield an INDEPENDENT third conditioning-ceiling estimate, distinct from
 * the trace (T) and Frobenius (F) route ceilings tabulated in imp-96693, or does it reduce
 * to one of them? Decide which, and name the residual obstruction. No bound is proved;
 * no refereed bound is changed; NO QED.
 *
 * -------------------------------------------------------------------------------
 * THE THREE ROUTES IN PLAY. imp-96693 tabulates three Route M lam_max conditioning ceilings
 * (the N at which cond#(N)=lam_max/lam_min reaches the IEEE-double breakdown scale 1/eps):
 *   T (trace-domination, RIGOROUS): the majorant is lam_max(G_N) <= trace(G_N) = I(1,1) H_N,
 *       the FIRST spectral moment Sum_i lam_i (imp-96548). Ceiling ~2.594e7.
 *   F (Frobenius, FIT): the majorant is lam_max(G_N) <= ||G_N||_F = sqrt(trace(G_N^2)) =
 *       sqrt(Sum_i lam_i^2), the SECOND spectral moment; the log-law slope 0.478 is FITTED
 *       and extrapolated ~four decades. Ceiling ~3.764e7 (imp-96684; ~3.775e7 at 14 rungs).
 *   M (measured, MEASURED): the imp-96443 lam_max log-fit composed ceiling ~4.109e7.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 (DECISIVE) -- imp-96688 factorizes the F-route object EXACTLY, not a new one.
 * -------------------------------------------------------------------------------
 * imp-96688 Result 1 is the exact identity ||G_N||_F^2 = Sum_{gcd(a,b)=1} I(a,b)^2/(a^2 b^2)
 * Sum_{g<=N/max(a,b)} 1/g^2. The object it factorizes is ||G_N||_F^2 = trace(G_N^2) =
 * Sum_i lam_i^2 -- literally the SECOND spectral moment that DEFINES the F-route majorant
 * lam_max <= ||G_N||_F. The g-factorization does not introduce a new spectral functional: it
 * re-expresses trace(G^2) as an arithmetic double sum. So it cannot be a route independent of
 * F; it IS the F route, viewed arithmetically.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- it is NOT the T route either (different spectral moment).
 * -------------------------------------------------------------------------------
 * The T-route majorant uses trace(G_N) = Sum_i lam_i (the FIRST moment, imp-96548), a strictly
 * different linear functional of the spectrum from trace(G_N^2) = Sum_i lam_i^2 (the SECOND
 * moment). By Cauchy-Schwarz these give genuinely different majorants (that is exactly why the
 * F ceiling 3.764e7 exceeds the T ceiling 2.594e7 by the F/T = 1.451 leg of imp-96693). The
 * g-factorization touches only trace(G^2), so it has no bearing on the T route. It therefore
 * reduces to F and is orthogonal to T -- it is not a bridge between them.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- what it DOES contribute: a structural sharpening of the F route, no new number.
 * -------------------------------------------------------------------------------
 * The g-factorization localizes the entire F-route growth into the coprime-core Vasyunin second
 * moment T(N) = Sum_{gcd(a,b)=1,a,b<=N} I(a,b)^2/(a^2 b^2), up to the bounded [1, zeta(2)]
 * inner-g factor (imp-96688 Result 2). This SHARPENS the F route: it replaces the fitted
 * ||G||_F log-law by a well-posed target -- prove T(N) ~ c (log N)^2 -- and names the precise
 * obstruction (a UNIFORM, in both free arguments, Bettin-Conrey / Maier-Rassias cotangent-sum
 * second moment against the coprimality-restricted 1/(a^2 b^2) weight, which the literature
 * supplies only for a fixed denominator). But it produces NO new ceiling value: the F ceiling
 * stays the same fitted ~3.764e7 (the factorization is exact, so it reproduces F, it does not
 * relocate it), and it produces NO rigorous bound (the growth law is not proved). Hence it is
 * not an independent estimate -- there is no third number to place beside T, F, M.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * NOT INDEPENDENT. The imp-96688 g-factorization is an exact re-expression of the F-route
 * object trace(G_N^2) = ||G_N||_F^2 (the second spectral moment), so it collapses onto the
 * Frobenius route rather than standing beside it; it has no relation to the trace route T
 * (the first moment) beyond the Cauchy-Schwarz gap that already separates F from T. Its real
 * value is a STRUCTURAL SHARPENING of the F route -- localizing F's growth into the coprime-core
 * Vasyunin second moment up to a bounded [1, zeta(2)] factor and reducing F's fit sub-gap to a
 * single well-posed uniform-cotangent-second-moment statement -- but it yields no new ceiling
 * number and no rigorous bound. The conditioning ladder stays two-rigor-levels deep (T rigorous,
 * F/M fit/measured); wall-clock compute still binds >=1500x before any of them (imp-96693/96706).
 * No bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96688-route-m-frobenius-g-factorization-assessment.js (the g-factorization assessed here)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the T/F/M ceiling ladder)
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (the fitted F ceiling this reduces to)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (the trace-domination T route it is NOT)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment.js (the harder lam_max edge, contrasted)
 *
 * Ticket: imp-96795 (proof, opus-4-8, api-pool). Assessment only; NO QED.
 */

const ZETA2 = Math.PI * Math.PI / 6; // 1.6449340668...

// The three imp-96693 conditioning ceilings and the spectral functional each route majorizes
// lam_max with. imp-96688 factorizes trace(G^2) = ||G||_F^2, which is precisely the F functional.
export const IMP96795_ROUTES = Object.freeze({
  trace: Object.freeze({
    symbol: 'T',
    functional: 'trace(G_N) = Sum_i lam_i (FIRST spectral moment)',
    majorant: 'lam_max <= trace(G_N) = I(1,1) H_N',
    label: 'rigorous',
    ceilingN: 25937000, // ~2.594e7 (imp-96693 / imp-96548)
  }),
  frobenius: Object.freeze({
    symbol: 'F',
    functional: 'trace(G_N^2) = Sum_i lam_i^2 = ||G_N||_F^2 (SECOND spectral moment)',
    majorant: 'lam_max <= ||G_N||_F = sqrt(trace(G_N^2))',
    label: 'fit',
    ceilingN: 37637000, // ~3.764e7 eleven-rung (imp-96693 / imp-96684)
  }),
  measured: Object.freeze({
    symbol: 'M',
    functional: 'lam_max directly (imp-96443 log-fit composed)',
    majorant: 'measured lam_max log-fit',
    label: 'measured',
    ceilingN: 41089000, // ~4.109e7 (imp-96693 / imp-96443)
  }),
});

// Which route the imp-96688 g-factorization reduces to, decided by the factorized object.
export const IMP96795_REDUCTION = Object.freeze({
  factorizedObject: 'imp-96688 factorizes ||G_N||_F^2 = trace(G_N^2) (an EXACT identity)',
  equalsFunctionalOf: 'F', // trace(G^2) is the second-moment functional that DEFINES the F route
  distinctFromFunctionalOf: 'T', // trace(G) is the first moment -- a different linear functional
  isIndependentThirdRoute: false,
  reason:
    'the factorized quantity trace(G_N^2)=||G_N||_F^2 is the second spectral moment, which is ' +
    'exactly the functional the Frobenius majorant lam_max<=||G_N||_F is built from; the ' +
    'g-factorization re-expresses it as an arithmetic double sum but introduces no new spectral ' +
    'functional, so it collapses onto the F route and is not a third independent estimate. It ' +
    'has no bearing on the T route (first moment), separated from F only by the Cauchy-Schwarz ' +
    'gap that already gives F/T=1.451.',
});

// What it DOES give: a structural sharpening of the F route, but no new ceiling number.
export const IMP96795_CONTRIBUTION = Object.freeze({
  kind: 'structural sharpening of the F route (not a new estimate)',
  localizes:
    'the entire F-route growth into the coprime-core Vasyunin second moment ' +
    'T(N)=Sum_{gcd(a,b)=1,a,b<=N} I(a,b)^2/(a^2 b^2), up to a bounded [1, zeta(2)] inner-g factor',
  innerFactorUpperBound: ZETA2,
  newCeilingNumberProduced: false, // exact re-expression reproduces F=3.764e7, does not relocate it
  rigorousBoundProduced: false, // the (log N)^2 growth law is not proved
  residualObstruction:
    'a UNIFORM (in both free arguments) Bettin-Conrey / Maier-Rassias cotangent-sum second ' +
    'moment for the Vasyunin sums I(a,b)^2 against the coprimality-restricted 1/(a^2 b^2) ' +
    'weight -- available only for a fixed denominator, not uniformly in two coupled arguments',
});

export const IMP96795_VERDICT = Object.freeze({
  question:
    'does the imp-96688 Frobenius g-factorization yield an INDEPENDENT third conditioning-ceiling ' +
    'estimate distinct from the trace (T) and Frobenius (F) routes of imp-96693, or does it reduce?',
  reducesToRoute: 'F',
  isIndependentThirdRoute: false,
  newCeilingNumberProduced: false,
  rigorousBoundProduced: false,
  anyBoundMoved: false,
  conclusion:
    'NOT INDEPENDENT. imp-96688 factorizes ||G_N||_F^2 = trace(G_N^2), the SECOND spectral moment ' +
    'that DEFINES the Frobenius majorant, so it collapses exactly onto the F route (it reproduces ' +
    'the fitted ~3.764e7 F ceiling, it does not relocate it) and has no relation to the trace ' +
    'route T (the first moment) beyond the Cauchy-Schwarz gap already separating F from T. Its ' +
    'value is a STRUCTURAL SHARPENING of F -- localizing F growth into the coprime-core Vasyunin ' +
    'second moment up to a bounded [1, zeta(2)] factor and reducing F fit sub-gap to a single ' +
    'well-posed uniform-cotangent-second-moment statement -- but it produces no new ceiling number ' +
    'and no rigorous bound. The ladder stays two-rigor-levels deep; wall-clock compute still binds ' +
    'first. No bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96795_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: imp-96688 g-factorization is ' +
  'an EXACT re-expression of the F-route second-moment object trace(G^2)=||G||_F^2, so it reduces ' +
  'to the Frobenius route rather than giving an independent third estimate; it sharpens that route ' +
  'structurally but proves no growth law and moves no bound. The trace route T remains the only ' +
  'rigorous ceiling; F and M stay fit/measured.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96795_ASSERTIONS = [
  {
    id: 'imp96795-reduces-to-frobenius-route-not-independent',
    holds: () =>
      IMP96795_REDUCTION.isIndependentThirdRoute === false &&
      IMP96795_REDUCTION.equalsFunctionalOf === 'F' &&
      IMP96795_REDUCTION.distinctFromFunctionalOf === 'T' &&
      IMP96795_VERDICT.reducesToRoute === 'F',
    why: 'the factorized object trace(G^2)=||G||_F^2 is the second spectral moment defining the F majorant, so the g-factorization collapses onto the F route (not the T first-moment route) and is not independent.',
  },
  {
    id: 'imp96795-T-and-F-are-different-spectral-moments',
    holds: () =>
      /FIRST spectral moment/.test(IMP96795_ROUTES.trace.functional) &&
      /SECOND spectral moment/.test(IMP96795_ROUTES.frobenius.functional) &&
      IMP96795_ROUTES.trace.ceilingN < IMP96795_ROUTES.frobenius.ceilingN &&
      IMP96795_ROUTES.frobenius.ceilingN < IMP96795_ROUTES.measured.ceilingN,
    why: 'T uses the first moment trace(G) and F the second moment trace(G^2)=||G||_F^2; these are distinct linear functionals (Cauchy-Schwarz), consistent with the strict ordering T<F<M of the imp-96693 ceilings.',
  },
  {
    id: 'imp96795-contribution-is-sharpening-not-new-number',
    holds: () =>
      IMP96795_CONTRIBUTION.newCeilingNumberProduced === false &&
      IMP96795_CONTRIBUTION.rigorousBoundProduced === false &&
      IMP96795_CONTRIBUTION.innerFactorUpperBound > 1.6449 &&
      IMP96795_CONTRIBUTION.innerFactorUpperBound < 1.645 &&
      /uniform/i.test(IMP96795_CONTRIBUTION.residualObstruction) &&
      /Bettin-Conrey/.test(IMP96795_CONTRIBUTION.residualObstruction),
    why: 'the g-factorization sharpens the F route (localizing growth into the coprime-core second moment, bounded inner g-factor <= zeta(2)) but yields no new ceiling number and no rigorous bound; the residual is a missing uniform Bettin-Conrey cotangent second moment.',
  },
  {
    id: 'imp96795-honesty-gate-no-qed',
    holds: () =>
      IMP96795_VERDICT.anyBoundMoved === false &&
      IMP96795_VERDICT.isIndependentThirdRoute === false &&
      IMP96795_VERDICT.rigorousBoundProduced === false &&
      /NO QED/.test(IMP96795_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96795_HONEST_BANNER) &&
      /RH open/.test(IMP96795_HONEST_BANNER),
    why: 'assessment only: no bound moved, no independent route, no rigorous bound, and the honesty markers are present.',
  },
];

for (const a of IMP96795_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96795-route-m-frobenius-g-factorization-route-independence-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  routes: IMP96795_ROUTES,
  reduction: IMP96795_REDUCTION,
  contribution: IMP96795_CONTRIBUTION,
  verdict: IMP96795_VERDICT,
  banner: IMP96795_HONEST_BANNER,
};
