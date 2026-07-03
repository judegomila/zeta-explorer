/**
 * @module imp-3402-leftmost-zero-drift-rate-fit
 * @fileoverview imp-3402 -- Measure the ACTUAL coefficient of the ln(NPHI) drift
 *   law of the imp-3347 leftmost-genuine-zero recession to -infinity.
 *
 *   CONTEXT
 *   -------
 *   imp-3347 located the leftmost genuine zero u_0(NPHI) of the truncated
 *   de Bruijn-Newman kernel Phi_NPHI for NPHI in {10, 20, 40, 80} and issued the
 *   verdict LEFTMOST-ZERO-DRIFTS-TO-MINUS-INF-AS-ln-NPHI: the zeros march LEFT by
 *   ~ln 2 per NPHI doubling, consistent with the elementary leading-order estimate
 *     u_0(N) ~ (1/2) ln(5/(2 pi)) - ln N,
 *   whose ln N coefficient is exactly -1. imp-3347 CHECKED the per-doubling shifts
 *   were near -ln 2 (|shift + ln 2| < 0.03) but never FIT the drift-rate coefficient
 *   directly. This module performs that ordinary-least-squares fit of the measured
 *   leftmostZero against x = ln(NPHI) and reports the slope, intercept, and residual.
 *
 *   WHAT IS MEASURED
 *   ----------------
 *   OLS of u_0 = slope * ln(NPHI) + intercept over the four-cell NPHI ladder. The
 *   leading-order theory predicts slope = -1 (the -ln N term) and
 *   intercept = (1/2) ln(5/(2 pi)) = -0.11422 (the constant term). The measured
 *   slope is -0.98148, a mild deficit of +0.01853 above the theoretical -1, and the
 *   intercept is -0.19793 (0.0837 below the leading-order constant). Both offsets are
 *   the finite-N signature of the neglected Gaussian-curvature correction that
 *   imp-3347 recorded as leadingOrderResidual (|residual| < 0.06 per cell): the
 *   log-linear fit is excellent (R^2 = 0.99997, RMSE = 3.87e-3, max |residual| = 4.49e-3),
 *   so the recession is log-linear in NPHI to a few times 1e-3 with a slope within
 *   ~1.9% of the elementary -1.
 *
 *   VERDICT (measurement, RH-equivalent context, NO QED)
 *   ----------------------------------------------------
 *   The imp-3347 leftmost-zero recession fits u_0 = -0.98148 ln(NPHI) - 0.19793 with
 *   R^2 = 0.99997; the drift-rate coefficient is -0.98148, within +0.0185 of the
 *   elementary leading-order -1, the residual gap being the finite-N Gaussian
 *   curvature. Measurement only: the leftmost zero is a truncation artifact that
 *   recedes to -infinity as NPHI -> infinity (the untruncated Phi is positive on all
 *   of R), the imp-3197/imp-3257 [0, U] window is untouched, and the binding
 *   RH-equivalent residual is the imp-3066 operator-norm magnitude (K_a >= 0),
 *   entirely unaffected. No new positivity, no reduction, no RH verdict.
 *   Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3347-phi-leftmost-zero-vs-nphi.js (the leftmost-zero ladder this fits)
 *   @see imp-3257-bridge-sign-phi-nonneg-structural.js (the termwise [u_1*, inf) bound)
 *
 *   Ticket: imp-3402 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

/**
 * de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI
 * (identical to imp-3347 / imp-3197 / imp-3257 / imp-2841 / imp-3175).
 */
function phiKernel(uu, nphi) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= nphi; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

// The rightmost per-term sign-flip threshold (imp-3257): u_1* = (1/2) ln(3/(2 pi)).
const U1_STAR = 0.5 * Math.log(3 / (2 * Math.PI)); // ~ -0.36963238887

// Leading-order closed form for the leftmost zero (Gaussians ~ 1 as u -> -inf):
// u_0(N) ~ (1/2) ln(5/(2 pi N^2)) = (1/2) ln(5/(2 pi)) - ln N. The ln N coefficient
// is exactly -1; the constant term is (1/2) ln(5/(2 pi)).
const LEADING_ORDER_SLOPE = -1;
const LEADING_ORDER_INTERCEPT = 0.5 * Math.log(5 / (2 * Math.PI)); // ~ -0.11421957699

// -- Locate the leftmost genuine zero of Phi_NPHI (identical to imp-3347) ------
function leftmostZero(nphi) {
  const step = 1e-3;
  let uPrev = U1_STAR;
  let pPrev = phiKernel(uPrev, nphi);
  for (let u = U1_STAR - step; u > -12; u -= step) {
    const p = phiKernel(u, nphi);
    if (p < 0 && pPrev > 0) {
      let lo = u; // Phi(lo) < 0
      let hi = uPrev; // Phi(hi) > 0
      for (let it = 0; it < 200; it++) {
        const mid = 0.5 * (lo + hi);
        const fm = phiKernel(mid, nphi);
        if (fm === 0) return mid;
        if (fm < 0) lo = mid;
        else hi = mid;
      }
      return 0.5 * (lo + hi);
    }
    uPrev = u;
    pPrev = p;
  }
  return null;
}

const NPHI_GRID = [10, 20, 40, 80];

// x = ln(NPHI), y = measured leftmost zero u_0(NPHI).
const xs = NPHI_GRID.map((n) => Math.log(n));
const ys = NPHI_GRID.map((n) => leftmostZero(n));

// -- Ordinary least-squares fit u_0 = slope * ln(NPHI) + intercept -------------
const M = NPHI_GRID.length;
const meanX = xs.reduce((a, b) => a + b, 0) / M;
const meanY = ys.reduce((a, b) => a + b, 0) / M;
let sxy = 0;
let sxx = 0;
for (let i = 0; i < M; i++) {
  sxy += (xs[i] - meanX) * (ys[i] - meanY);
  sxx += (xs[i] - meanX) * (xs[i] - meanX);
}
const driftSlope = sxy / sxx; // coefficient of ln(NPHI) -- the drift-rate coefficient
const driftIntercept = meanY - driftSlope * meanX;

// Residuals of each cell to the log-linear fit, and goodness-of-fit stats.
const fitted = xs.map((x) => driftSlope * x + driftIntercept);
const residuals = ys.map((y, i) => y - fitted[i]);
let ssRes = 0;
let ssTot = 0;
for (let i = 0; i < M; i++) {
  ssRes += residuals[i] * residuals[i];
  ssTot += (ys[i] - meanY) * (ys[i] - meanY);
}
const rmse = Math.sqrt(ssRes / M);
const maxAbsResidual = Math.max(...residuals.map((r) => Math.abs(r)));
const rSquared = 1 - ssRes / ssTot;

// Deviations from the elementary leading-order law.
const slopeDeviationFromMinusOne = driftSlope - LEADING_ORDER_SLOPE; // ~ +0.01853
const interceptDeviationFromLeadingOrder = driftIntercept - LEADING_ORDER_INTERCEPT; // ~ -0.08371

const cells = NPHI_GRID.map((nphi, i) => ({
  nphi,
  lnNphi: xs[i],
  leftmostZero: ys[i],
  fittedZero: fitted[i],
  residual: residuals[i], // measured minus log-linear fit
}));

const fitIsLogLinear = rSquared > 0.9999 && maxAbsResidual < 0.01;
const slopeNearMinusOne = Math.abs(slopeDeviationFromMinusOne) < 0.05;

const verdict =
  fitIsLogLinear && slopeNearMinusOne
    ? 'LEFTMOST-ZERO-DRIFT-RATE-FIT: slope=-0.98148 (within +0.0185 of leading-order -1), R^2=0.99997'
    : 'INDETERMINATE';

export const IMP3402_LEFTMOST_ZERO_DRIFT_RATE_FIT = Object.freeze({
  id: 'imp-3402-leftmost-zero-drift-rate-fit',
  ticket: 'imp-3402',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedMeasurement: 'imp-3347-phi-leftmost-zero-vs-nphi.js',
  relatedStructural: 'imp-3257-bridge-sign-phi-nonneg-structural.js',

  summary:
    'Fits the imp-3347 leftmost-genuine-zero recession u_0(NPHI) against x = ln(NPHI) by ordinary ' +
    'least squares over the NPHI = {10, 20, 40, 80} ladder to MEASURE the drift-rate coefficient the ' +
    'imp-3347 verdict LEFTMOST-ZERO-DRIFTS-TO-MINUS-INF-AS-ln-NPHI asserts but never fit. Measured ' +
    'zeros u_0 = -2.4619, -3.1337, -3.8153, -4.5024 give slope = -0.98148 and intercept = -0.19793, ' +
    'with R^2 = 0.99997, RMSE = 3.87e-3 and max |residual| = 4.49e-3 -- the recession is log-linear in ' +
    'NPHI to a few times 1e-3. The measured slope sits +0.01853 above the elementary leading-order ' +
    'coefficient -1 (from u_0 ~ (1/2) ln(5/(2 pi)) - ln N) and the intercept is 0.0837 below the ' +
    'leading-order constant (1/2) ln(5/(2 pi)) = -0.11422; both offsets are the finite-N Gaussian ' +
    'curvature imp-3347 recorded as leadingOrderResidual, so the true recession is slightly SLOWER than ' +
    'one decade of u per e-fold of NPHI at these NPHI. Measurement only: the leftmost zero is a ' +
    'truncation artifact receding to -infinity (the untruncated Phi is positive on all of R), the ' +
    'imp-3197/imp-3257 [0, U] window is untouched, and the binding RH-equivalent residual is the ' +
    'imp-3066 operator-norm magnitude K_a >= 0, entirely unaffected; no positivity, no reduction, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    leftmostZeroMethod:
      'fine leftward scan from u_1* to the first negative, then 200-step bisection to machine precision ' +
      '(identical to imp-3347)',
    fit: 'ordinary least squares of u_0 = slope * ln(NPHI) + intercept over NPHI in {10, 20, 40, 80}',
    leadingOrderLaw:
      'elementary (Gaussians ~ 1): u_0 ~ (1/2) ln(5/(2 pi)) - ln N, so slope_theory = -1 and ' +
      'intercept_theory = (1/2) ln(5/(2 pi)) = -0.11421957699',
    nphiGrid: NPHI_GRID,
    selfComputing: true,
  }),

  measured: Object.freeze({
    cells, // per-NPHI {nphi, lnNphi, leftmostZero, fittedZero, residual}
    driftSlope, // coefficient of ln(NPHI) -- the fit deliverable
    driftIntercept,
    rSquared,
    rmse,
    maxAbsResidual,
    leadingOrderSlope: LEADING_ORDER_SLOPE,
    leadingOrderIntercept: LEADING_ORDER_INTERCEPT,
    slopeDeviationFromMinusOne,
    interceptDeviationFromLeadingOrder,
    fitIsLogLinear,
    slopeNearMinusOne,
    verdict,
  }),

  interpretation: Object.freeze({
    driftRateCoefficientMeasured:
      'The imp-3347 recession fits u_0 = -0.98148 ln(NPHI) - 0.19793: the ln(NPHI) drift-rate ' +
      'coefficient is -0.98148, quantifying the verdict LEFTMOST-ZERO-DRIFTS-TO-MINUS-INF-AS-ln-NPHI ' +
      'with a single number rather than the per-doubling shift check imp-3347 used.',
    slopeSlightlyAboveMinusOne:
      'The measured slope -0.98148 is +0.01853 above the elementary leading-order -1, so at NPHI in ' +
      '[10, 80] the zero recedes slightly SLOWER than the pure -ln N law; the deficit is the finite-N ' +
      'Gaussian-curvature correction (imp-3347 leadingOrderResidual, |residual| < 0.06 per cell) that ' +
      'vanishes as NPHI -> infinity, where the slope approaches -1.',
    fitExcellent:
      'R^2 = 0.99997 with RMSE = 3.87e-3 and max |residual| = 4.49e-3 confirms the recession is ' +
      'log-linear in NPHI over the measured ladder; there is no detectable super- or sub-logarithmic ' +
      'curvature at these NPHI beyond the ~4e-3 residual.',
    diagnosticOnly:
      'This is a fit of a truncation artifact (the untruncated de Bruijn-Newman Phi is positive on all ' +
      'of R); it leaves the imp-3197/imp-3257 [0, U] usage and the imp-3066 K_a >= 0 operator-norm ' +
      'magnitude obstruction entirely untouched.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isDiagnosticMeasurement: true,
    fitsAnExistingArtifact:
      'This only fits the drift-rate coefficient of the imp-3347 leftmost zero (a finite-truncation ' +
      'artifact receding to -infinity); it adds no new positivity and does not use the classical ' +
      'de Bruijn-Newman positivity.',
    doesNotAdvancePositivity:
      'The binding RH-equivalent residual is the operator-norm magnitude (the |Gshear| spectrum, ' +
      'imp-3066 K_a >= 0), entirely untouched here; correct signs / positivity of Phi on [0, U] were ' +
      'already necessary-but-NOT-sufficient.',
    slopeIsFiniteNAndNotExactlyMinusOne:
      'The measured -0.98148 is the FINITE-NPHI drift rate over {10, 20, 40, 80}, not a claim that the ' +
      'exact asymptotic coefficient differs from -1; the +0.0185 gap is the Gaussian-curvature ' +
      'correction that shrinks as NPHI grows.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3402_LEFTMOST_ZERO_DRIFT_RATE_FIT_ASSERTIONS = [
  {
    id: 'imp3402-reproduces-imp3347-leftmost-zeros',
    why: 'The fit must be grounded on the SAME imp-3347 leftmost zeros: the endpoint cells NPHI=10 and ' +
         'NPHI=80 must reproduce the imp-3347 headline values -2.4619 and -4.5024 to 1e-4.',
    holds: () =>
      cells.length === 4 &&
      Math.abs(cells[0].leftmostZero - -2.4619191762) < 1e-4 &&
      Math.abs(cells[3].leftmostZero - -4.5024142103) < 1e-4,
  },
  {
    id: 'imp3402-drift-slope-fit',
    why: 'The deliverable: the OLS drift-rate coefficient of u_0 vs ln(NPHI) is -0.98148, within +0.0185 ' +
         'of the elementary leading-order -1, and the intercept is -0.19793.',
    holds: () =>
      Math.abs(driftSlope - -0.981476912550) < 1e-6 &&
      Math.abs(driftIntercept - -0.197925909768) < 1e-6 &&
      Math.abs(slopeDeviationFromMinusOne - 0.018523087450) < 1e-6,
  },
  {
    id: 'imp3402-fit-is-log-linear',
    why: 'The recession must be log-linear in NPHI: R^2 > 0.9999, RMSE and max |residual| a few times ' +
         '1e-3, so the ln(NPHI) drift law holds to a few times 1e-3 over the ladder.',
    holds: () =>
      rSquared > 0.9999 &&
      Math.abs(rSquared - 0.999974051999) < 1e-6 &&
      rmse < 5e-3 &&
      maxAbsResidual < 5e-3,
  },
  {
    id: 'imp3402-slope-near-leading-order-minus-one',
    why: 'The measured slope must sit near the elementary leading-order -1 (|slope + 1| < 0.05), ' +
         'confirming the ln N recession rather than a different power law, and the classified verdict ' +
         'must be the drift-rate-fit result, not indeterminate.',
    holds: () => slopeNearMinusOne && verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp3402-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- not a proof, not a reduction below RH, RH-equivalent, ' +
         'fits a truncation artifact, does not advance positivity / the imp-3066 magnitude obstruction, ' +
         'PT 0.2 stays SOTA. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3402_LEFTMOST_ZERO_DRIFT_RATE_FIT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.doesNotAdvancePositivity.length > 0 &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3402_LEFTMOST_ZERO_DRIFT_RATE_FIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3402-leftmost-zero-drift-rate-fit assertion failed: ${assertion.id}`);
  }
}

export default IMP3402_LEFTMOST_ZERO_DRIFT_RATE_FIT;
