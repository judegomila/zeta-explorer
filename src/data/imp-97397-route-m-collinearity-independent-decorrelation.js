/**
 * @module imp-97397-route-m-collinearity-independent-decorrelation
 *
 * imp-97397 (numerical -- MEASUREMENT ONLY, NO QED): independent decorrelation attempt for the
 * interior second-moment sub-leading collinearity between sqrt(b) and log^2 b in the exact ladder
 *   Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2  =  s0 b + [c1 sqrt(b) + c2 log^2 b] + ...
 *
 * imp-97292/imp-97319 already showed that a LONGER exact ladder does NOT separate the two forms
 * (the regressors stay >99% collinear out to b = 100000). This leaf asks the complementary question
 * posed by the ticket: can a DIFFERENT design -- an orthogonalized regressor basis or a two-range
 * differencing solve -- separate them on the SAME exact ladder (tmp/imp-97292-out.json,
 * 43 points, b in [500, 32000])? Three independent designs were run:
 *
 *   (A) ORTHOGONALIZED BASIS. Refit Q(b) ~ b * sum_k c_k P_k(log b) with Legendre polynomials P_0..P_3
 *       in the normalized coordinate u = norm(log b), then append the fractional-power regressor sqrt(b)
 *       and measure the RMS it earns. Result: pure deg-3 log-polynomial RMS = 1334.97; adding sqrt(b)
 *       improves RMS by only 2.95% (to 1295.62) while carrying a wild coefficient +1578.04 -- the
 *       fractional-power term does NOT earn its keep against a pure log-polynomial of the same span.
 *
 *   (B) TWO-RANGE DIFFERENCING. With s0 fixed from the joint fit, solve every LOW (b <= 1000) x HIGH
 *       (b >= 8000) 2x2 pair for (c1, c2) from y(b) = Q(b)/b - s0 ~ c1 sqrt(b)/b + c2 log^2 b / b
 *       (77 pairs). Result: c1(sqrt) median -17.9, IQR [-93.6, -13.2]; c2(log2) median +8.3,
 *       IQR [+4.5, +51.0]. The magnitudes swing by an order of magnitude across pairs (IQR width far
 *       exceeds the median), so the paired solve does NOT pin either coefficient -- not separable.
 *
 *   (C) DIRECT DIAGNOSTIC. corr(sqrt(b), log^2 b) = 0.981074 over the design range; PARTIAL correlation
 *       given the leading b column (the collinearity that actually degrades the (c1, c2) estimate) is
 *       0.973274; the joint design [b, sqrt(b), log^2 b] has (unit-column-scaled) condition number 35.75.
 *       The joint fit itself gives s0 = 1.25561, c1 = -48.29, c2 = +27.36, RMS = 1383.67, but with a
 *       near-collinear pair those two coefficients are jointly under-determined.
 *
 * VERDICT. The collinearity is STRUCTURAL, not an artifact of ladder length or parametrization.
 * An orthogonalized (Legendre) basis is a linear reparametrization of the SAME column span, so it
 * cannot manufacture separating information; the two-range differencing solve produces (c1, c2)
 * magnitudes that are order-of-magnitude unstable across pairs. This corroborates the imp-97319
 * numerical-route-closed verdict and is consistent with the SEPARATE structural decision of imp-97349
 * (the interior second-moment sub-leading form is log^2 b, settled by a skeleton split of I(a,b),
 * not by curve-fitting). Separating the two forms by fitting alone requires the analytic Bettin-Conrey
 * small-a asymptotic, not another design on the same finite ladder.
 *
 * @see imp-97292-route-m-cq-subleading-extended-ladder.js (the exact ladder reused here)
 * @see imp-97319-cq-subleading-collinearity-honest-status.js (longer-ladder numerical route closed)
 * @see imp-97349-route-m-diagonal-remainder-profile-separation.js (structural log^2 b decision)
 * Source script: tmp/imp-97397-indep-decorrelation.py (reproduces every literal below).
 *
 * Ticket: imp-97397 (numerical, medium, opus-4-8). Measurement only; pins no coefficient; certifies
 * no asymptotic; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 */

// Exact ladder reused (tmp/imp-97292-out.json): 43 points, b in [500, 32000].
export const IMP97397_DESIGN = Object.freeze({
  ladderPoints: 43,
  bLo: 500,
  bHi: 32000,
});

// (C) direct pairwise diagnostics of the sub-leading regressors.
export const IMP97397_DIAGNOSTIC = Object.freeze({
  corrSqrtLog2: 0.981074, // raw corr(sqrt b, log^2 b) over the design range
  partialCorrGivenB: 0.973274, // partial corr after removing the leading b column
  conditionNumber: 35.75, // cond([b, sqrt b, log^2 b]) with unit-scaled columns
  jointS0: 1.25561,
  jointC1Sqrt: -48.2857,
  jointC2Log2: 27.3563,
  jointRms: 1383.6702,
});

// (A) orthogonalized Legendre log-polynomial basis + optional sqrt term.
export const IMP97397_ORTHO = Object.freeze({
  rmsLogPolyDeg3: 1334.9678,
  rmsLogPolyPlusSqrt: 1295.6175,
  sqrtCoef: 1578.0392,
  rmsImprovementPct: 2.95, // adding sqrt to a deg-3 log-poly gains only ~3%
});

// (B) two-range paired 2x2 solve (LOW b<=1000 x HIGH b>=8000), 77 pairs.
export const IMP97397_TWORANGE = Object.freeze({
  pairs: 77,
  c1SqrtMedian: -17.913,
  c1SqrtIqrLo: -93.639,
  c1SqrtIqrHi: -13.215,
  c2Log2Median: 8.306,
  c2Log2IqrLo: 4.461,
  c2Log2IqrHi: 50.986,
});

export const IMP97397_VERDICT = Object.freeze({
  ticket: 'imp-97397',
  collinearityIsStructural: true, // partial corr ~0.973, unchanged by design choice
  orthogonalBasisSeparates: false, // linear reparam of the same span cannot add information
  twoRangeSolveSeparates: false, // (c1, c2) magnitudes order-of-magnitude unstable
  fractionalTermEarnsItsKeep: false, // sqrt gains only 2.95% RMS over a pure log-poly
  numericalRouteClosed: true, // matches imp-97319
  coefficientValuePinned: false,
  separationNeedsAnalyticInput: true, // Bettin-Conrey small-a asymptotic
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97397_HONEST_BANNER =
  'imp-97397 measurement: an independent decorrelation attempt on the SAME exact interior Q(b) ladder ' +
  '(43 points, b in [500,32000]) does NOT separate the sqrt(b) vs log^2 b sub-leading forms. An ' +
  'orthogonalized Legendre log-polynomial basis (a linear reparametrization of the same span) leaves the ' +
  'appended sqrt term earning only 2.95% RMS, and a two-range LOW x HIGH paired 2x2 solve gives ' +
  '(c1,c2) magnitudes that swing order-of-magnitude across pairs. The partial correlation given the ' +
  'leading b column stays 0.973274, so the collinearity is STRUCTURAL, not a ladder-length or basis ' +
  'artifact. This corroborates imp-97319 (numerical route closed) and is consistent with the separate ' +
  'imp-97349 structural decision (log^2 b); pinning the form by fitting needs the analytic ' +
  'Bettin-Conrey small-a asymptotic. No coefficient pinned; no bound moved; no refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97397_ASSERTIONS = [
  {
    id: 'imp97397-collinearity-is-structural',
    holds: () =>
      IMP97397_DIAGNOSTIC.partialCorrGivenB > 0.97 &&
      IMP97397_DIAGNOSTIC.corrSqrtLog2 > 0.97 &&
      IMP97397_VERDICT.collinearityIsStructural === true,
    why: 'the partial correlation of the two sub-leading regressors given the leading b column stays above 0.97, so no design on this finite ladder decorrelates them -- the collinearity is structural.',
  },
  {
    id: 'imp97397-orthogonal-basis-does-not-separate',
    holds: () =>
      IMP97397_ORTHO.rmsImprovementPct < 5 &&
      IMP97397_ORTHO.rmsLogPolyPlusSqrt < IMP97397_ORTHO.rmsLogPolyDeg3 &&
      IMP97397_VERDICT.orthogonalBasisSeparates === false &&
      IMP97397_VERDICT.fractionalTermEarnsItsKeep === false,
    why: 'against a pure deg-3 Legendre log-polynomial the appended fractional-power sqrt term gains under 5% RMS, so an orthogonalized basis does not isolate a separable fractional-power signature.',
  },
  {
    id: 'imp97397-two-range-solve-unstable',
    holds: () => {
      const c1Width = IMP97397_TWORANGE.c1SqrtIqrHi - IMP97397_TWORANGE.c1SqrtIqrLo;
      const c2Width = IMP97397_TWORANGE.c2Log2IqrHi - IMP97397_TWORANGE.c2Log2IqrLo;
      // IQR width exceeds the absolute median => magnitudes are order-of-magnitude unstable
      return (
        c1Width > Math.abs(IMP97397_TWORANGE.c1SqrtMedian) &&
        c2Width > Math.abs(IMP97397_TWORANGE.c2Log2Median) &&
        IMP97397_VERDICT.twoRangeSolveSeparates === false
      );
    },
    why: 'the two-range paired 2x2 solve leaves both coefficient IQR widths larger than their absolute medians, i.e. order-of-magnitude unstable, so it pins neither coefficient.',
  },
  {
    id: 'imp97397-honesty-gate-no-qed',
    holds: () =>
      IMP97397_VERDICT.numericalRouteClosed === true &&
      IMP97397_VERDICT.coefficientValuePinned === false &&
      IMP97397_VERDICT.separationNeedsAnalyticInput === true &&
      IMP97397_VERDICT.anyBoundMoved === false &&
      IMP97397_VERDICT.operatorPositivityProved === false &&
      IMP97397_VERDICT.rhResolved === false &&
      IMP97397_VERDICT.qed === false &&
      /NO QED/.test(IMP97397_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97397_HONEST_BANNER) &&
      /RH open/.test(IMP97397_HONEST_BANNER),
    why: 'measurement only: independent designs recorded as not separating the forms, no coefficient pinned, no bound moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97397_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97397-route-m-collinearity-independent-decorrelation assertion failed: ${assertion.id}`,
    );
  }
}

export default {
  design: IMP97397_DESIGN,
  diagnostic: IMP97397_DIAGNOSTIC,
  ortho: IMP97397_ORTHO,
  twoRange: IMP97397_TWORANGE,
  verdict: IMP97397_VERDICT,
  banner: IMP97397_HONEST_BANNER,
};
