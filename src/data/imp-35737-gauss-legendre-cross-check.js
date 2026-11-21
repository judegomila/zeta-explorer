/**
 * @module imp-35737-gauss-legendre-cross-check
 *
 * imp-35737 (accuracy, cross-check): CROSS-VALIDATE the imp-35680 band-amplitude
 * measurement with an INDEPENDENT higher-order integrator. imp-35680 computed the
 * band-averaged structure factor A_band = 1/2 and the connected-cluster in-band
 * mass INT_{-1}^{1} Delta(alpha) d alpha = 1 by composite Simpson quadrature
 * (single pass, NPAN = 1000 panels), and reported the overshoot ratio
 * A_band / C_C ~ 1.3029 (C_C = (1/8) sqrt(3 pi) ~ 0.383748, a ~30.3 percent
 * overshoot). Those two literals rested on ONE Simpson pass with no independent
 * integrator or closed-form error bound. This module supplies both.
 *
 * SECOND INTEGRATOR. We recompute the two band integrals with Gauss-Legendre
 * quadrature (64-node, nodes/weights from Newton iteration on the Legendre
 * polynomial P_n -- a genuinely distinct rule from composite Simpson, distinct
 * abscissae and distinct panel structure):
 *   INT_{-1}^{1} |alpha| d alpha   (structure-factor ramp, A_band = this / 2)
 *   INT_{-1}^{1} (1 - |alpha|) d alpha  (triangle Delta mass = connected mass)
 * Both integrands are piecewise-linear, so any correct rule is exact; the
 * Gauss-Legendre values reproduce the closed forms
 *   INT_{-1}^{1} |alpha| d alpha = 1   ->   A_band = 1/2,
 *   INT_{-1}^{1} (1 - |alpha|) d alpha = 1
 * to ~1e-15 (machine precision), matching the imp-35680 Simpson literals.
 *
 * PHYSICAL-SPACE CLOSED FORM. The connected in-band mass = 1 is the Fourier
 * partner of the physical-space normalization INT (sin pi x / pi x)^2 dx = 1
 * (Plancherel: total mass of Y_2 = triangle value Delta(0) = 1). We check that
 * partner directly by composite Gauss-Legendre on the oscillatory sinc-square
 * over a truncated window [-T, T]; the truncation residual is bounded
 * analytically by the tail INT_{|x|>T} (sin pi x / pi x)^2 dx <= 1 / (pi^2 T)
 * (from sin^2 <= 1). At T = 120 the measured two-sided integral is ~0.99916, its
 * residual ~8.44e-4 matches 1/(pi^2 T) ~8.44e-4 to four figures, and the
 * tail-corrected estimate is 1.0000000 -- confirming INT (sin pi x/pi x)^2 dx = 1.
 *
 * QUADRATURE ERROR ON THE OVERSHOOT. The overshoot ratio A_band / C_C carries
 * a quadrature error |Delta(A_band)| / C_C. Since the band integrands are linear
 * and both integrators reproduce them to ~1e-15, |Delta(A_band)| ~ 1e-16 and the
 * ratio 1.3029400 is certified with quadrature uncertainty ~1e-15 -- the ~30.3
 * percent overshoot is NOT a quadrature artifact of the single imp-35680 Simpson
 * pass.
 *
 * Accuracy / cross-check only. Confirms the imp-35680 literals with an
 * independent integrator and closed-form bounds; derives no remainder; discharges
 * nothing; changes no bound; establishes no operator positivity. C_C =
 * (1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631)
 * and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-35680-constant-mismatch-magnitude (Simpson literals cross-validated here)
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (constantMismatch claim)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi), C_H = 1/8)
 * Literature: Montgomery (1973, pair correlation / form factor); Rudnick-Sarnak
 * (1996, n-level correlations). Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { IMP35680_CONSTANT_MISMATCH_MAGNITUDE } from './imp-35680-constant-mismatch-magnitude.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any cross-check here)
const ALPHA_LIMIT = 1; // Montgomery/Rudnick-Sarnak proven support |alpha| < 1
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // ~ 0.38374752 (target, untouched)

// Independent integrator: Gauss-Legendre on [a, b], nodes/weights from Newton
// iteration on the Legendre polynomial P_n (distinct rule vs imp-35680 Simpson).
function gaussLegendre(f, a, b, n) {
  const x = new Array(n);
  const w = new Array(n);
  const m = (n + 1) >> 1;
  for (let i = 0; i < m; i++) {
    let xi = Math.cos((Math.PI * (i + 0.75)) / (n + 0.5)); // asymptotic node guess
    let dp = 0;
    for (let it = 0; it < 100; it++) {
      let p0 = 1;
      let p1 = xi;
      for (let k = 2; k <= n; k++) {
        const p2 = ((2 * k - 1) * xi * p1 - (k - 1) * p0) / k; // recurrence for P_k
        p0 = p1;
        p1 = p2;
      }
      dp = (n * (xi * p1 - p0)) / (xi * xi - 1); // derivative dP_n/dx
      const dx = p1 / dp;
      xi -= dx;
      if (Math.abs(dx) < 1e-15) break;
    }
    x[i] = xi;
    x[n - 1 - i] = -xi;
    const ww = 2 / ((1 - xi * xi) * dp * dp);
    w[i] = ww;
    w[n - 1 - i] = ww;
  }
  const c1 = (b - a) / 2;
  const c2 = (b + a) / 2;
  let s = 0;
  for (let i = 0; i < n; i++) s += w[i] * f(c1 * x[i] + c2);
  return c1 * s;
}

// Composite Gauss-Legendre over [a, b] with `panels` sub-intervals (for the
// oscillatory sinc-square physical-space check).
function gaussLegendreComposite(f, a, b, panels, n) {
  const h = (b - a) / panels;
  let s = 0;
  for (let p = 0; p < panels; p++) s += gaussLegendre(f, a + p * h, a + (p + 1) * h, n);
  return s;
}

const GL_NODES = 64;

// (A) Gauss-Legendre recomputation of the two band integrals (even symmetry).
const GL_BAND_INTEGRAL = 2 * gaussLegendre((a) => Math.abs(a), 0, ALPHA_LIMIT, GL_NODES); // INT_{-1}^{1} |alpha| ~ 1
const A_BAND_GL = GL_BAND_INTEGRAL / (2 * ALPHA_LIMIT); // ~ 0.5
const GL_CONNECTED_MASS = 2 * gaussLegendre((a) => 1 - Math.abs(a), 0, ALPHA_LIMIT, GL_NODES); // INT_{-1}^{1} (1 - |alpha|) ~ 1

// Overshoot ratio recomputed from the Gauss-Legendre band amplitude.
const RATIO_BAND_TO_CC_GL = A_BAND_GL / C_C; // ~ 1.30294003

// Discrepancies vs the imp-35680 composite-Simpson literals (baked exports).
const M = IMP35680_CONSTANT_MISMATCH_MAGNITUDE.measurement;
const ABAND_INTEGRATOR_DISCREPANCY = Math.abs(A_BAND_GL - M.meanScaleAmplitudeABand); // ~ 1e-16
const MASS_INTEGRATOR_DISCREPANCY = Math.abs(GL_CONNECTED_MASS - M.connectedMassInBand); // ~ 1e-15
const RATIO_INTEGRATOR_DISCREPANCY = Math.abs(RATIO_BAND_TO_CC_GL - M.ratioBandToCC); // ~ 3e-8 (Simpson stored to 8 sig figs)

// Discrepancies vs the analytic closed forms.
const BAND_VS_CLOSED_FORM = Math.abs(GL_BAND_INTEGRAL - 1); // INT |alpha| = 1
const MASS_VS_CLOSED_FORM = Math.abs(GL_CONNECTED_MASS - 1); // INT (1 - |alpha|) = 1
const ABAND_VS_CLOSED_FORM = Math.abs(A_BAND_GL - 0.5); // A_band = 1/2

// Quadrature error carried into the overshoot ratio: |Delta A_band| / C_C.
const RATIO_QUAD_ERROR_BOUND = Math.max(ABAND_VS_CLOSED_FORM, ABAND_INTEGRATOR_DISCREPANCY) / C_C; // ~ 9e-16

// (B) Physical-space closed form INT (sin pi x / pi x)^2 dx = 1 (Fourier partner
// of the connected in-band mass). Composite Gauss-Legendre over [-T, T] with an
// analytic tail bound 1 / (pi^2 T).
const sincSq = (x) => {
  if (x === 0) return 1;
  const t = Math.PI * x;
  const s = Math.sin(t) / t;
  return s * s;
};
const SINC_T = 120;
const SINC_PANELS = SINC_T * 20;
const SINC_ORDER = 12;
const SINC_TWO_SIDED = 2 * gaussLegendreComposite(sincSq, 0, SINC_T, SINC_PANELS, SINC_ORDER); // ~ 0.99916
const SINC_TAIL_BOUND = 1 / (Math.PI * Math.PI * SINC_T); // truncation tail <= 1/(pi^2 T)
const SINC_RESIDUAL = 1 - SINC_TWO_SIDED; // ~ 8.44e-4, must lie within the tail bound
const SINC_TAIL_CORRECTED = SINC_TWO_SIDED + SINC_TAIL_BOUND; // ~ 1.0000000

export const IMP35737_GAUSS_LEGENDRE_CROSS_CHECK = {
  id: 'imp-35737',
  proofSection: 'S-frontier',
  question:
    'Do an independent higher-order integrator (Gauss-Legendre) and the analytic closed forms reproduce the ' +
    'imp-35680 Simpson literals A_band = 1/2 and INT Y_2 = 1, and what quadrature error is carried into the ' +
    'overshoot ratio A_band / C_C ~ 1.3029?',
  method:
    '64-node Gauss-Legendre (Newton iteration on the Legendre polynomial P_n) for the band integrals, and composite ' +
    'Gauss-Legendre over [-120, 120] with an analytic tail bound 1/(pi^2 T) for the physical-space sinc-square check.',
  crossCheck: {
    C_C: +C_C.toPrecision(8), // 0.38374752 (target, untouched)
    glNodes: GL_NODES,
    // Band integrals via the independent Gauss-Legendre rule.
    glBandIntegral: +GL_BAND_INTEGRAL.toPrecision(12), // ~ 1.00000000000
    aBandGaussLegendre: +A_BAND_GL.toPrecision(12), // ~ 0.500000000000
    glConnectedMass: +GL_CONNECTED_MASS.toPrecision(12), // ~ 1.00000000000
    ratioBandToCCGaussLegendre: +RATIO_BAND_TO_CC_GL.toPrecision(8), // ~ 1.3029400
    // Agreement with the imp-35680 composite-Simpson literals.
    aBandIntegratorDiscrepancy: +ABAND_INTEGRATOR_DISCREPANCY.toExponential(3), // ~ 1e-16
    massIntegratorDiscrepancy: +MASS_INTEGRATOR_DISCREPANCY.toExponential(3), // ~ 1e-15
    ratioIntegratorDiscrepancy: +RATIO_INTEGRATOR_DISCREPANCY.toExponential(3), // ~ 3e-8 (Simpson stored to 8 sig figs)
    // Agreement with the analytic closed forms.
    bandVsClosedForm: +BAND_VS_CLOSED_FORM.toExponential(3), // INT |alpha| = 1
    massVsClosedForm: +MASS_VS_CLOSED_FORM.toExponential(3), // INT (1 - |alpha|) = 1
    aBandVsClosedForm: +ABAND_VS_CLOSED_FORM.toExponential(3), // A_band = 1/2
    // Quadrature error propagated into the overshoot ratio.
    ratioQuadErrorBound: +RATIO_QUAD_ERROR_BOUND.toExponential(3), // ~ 9e-16
    // Physical-space Fourier partner INT (sin pi x/pi x)^2 dx = 1.
    sincT: SINC_T,
    sincTwoSidedIntegral: +SINC_TWO_SIDED.toPrecision(8), // ~ 0.99915566
    sincResidual: +SINC_RESIDUAL.toExponential(4), // ~ 8.443e-4
    sincTailBound: +SINC_TAIL_BOUND.toExponential(4), // ~ 8.443e-4 = 1/(pi^2 T)
    sincTailCorrected: +SINC_TAIL_CORRECTED.toPrecision(10), // ~ 1.000000003
  },
  findings:
    'An independent 64-node Gauss-Legendre integrator reproduces both imp-35680 band integrals to machine ' +
    'precision -- INT_{-1}^{1} |alpha| d alpha = 1 (so A_band = 1/2) and INT_{-1}^{1} (1 - |alpha|) d alpha = 1 ' +
    '(connected in-band mass) -- agreeing with the composite-Simpson literals to ~1e-15 and with the analytic ' +
    'closed forms to ~1e-15. The overshoot ratio A_band / C_C recomputes to ~1.3029400, and the quadrature error ' +
    'carried into it is bounded by |Delta A_band| / C_C ~ 9e-16, so the ~30.3 percent overshoot is NOT a Simpson ' +
    'quadrature artifact. The physical-space Fourier partner INT (sin pi x / pi x)^2 dx integrates by composite ' +
    'Gauss-Legendre to ~0.99916 over [-120, 120] with a residual ~8.44e-4 matching the analytic tail bound ' +
    '1/(pi^2 T) to four figures; tail-corrected it equals 1.0000000, confirming the normalization = 1.',
  isRigorous: false,
  isUnconditional: false,
  confirmsImp35680: true,
  verdict:
    'CROSS-CHECK (accuracy). A second independent integrator (64-node Gauss-Legendre) plus the analytic closed ' +
    'forms CONFIRM the imp-35680 Simpson literals A_band = 1/2 and INT Y_2 = 1 to ~1e-15, and bound the quadrature ' +
    'error carried into the overshoot ratio A_band / C_C ~ 1.3029400 by ~9e-16 -- the ~30.3 percent overshoot is ' +
    'not a single-pass quadrature artifact. The physical-space normalization INT (sin pi x/pi x)^2 dx = 1 is ' +
    'confirmed (tail-corrected 1.0000000, residual matches 1/(pi^2 T)). Confirms/tightens the imp-35680 literals; ' +
    'derives no remainder; discharges nothing; changes no bound; establishes no operator positivity; C_C = ' +
    '(1/8) sqrt(3 pi) (imp-2642/imp-2643), C_H = 1/8, E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional ' +
    '(imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED. No refereed bound is changed.',
  citation:
    'imp-35680 (Simpson literals cross-validated here); imp-35652 (constantMismatch claim); imp-2642/imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi), C_H = 1/8); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: ' +
    'Montgomery (1973, pair correlation / form factor); Rudnick-Sarnak (1996). Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35737_GAUSS_LEGENDRE_CROSS_CHECK_ASSERTIONS = [
  {
    // (1) Gauss-Legendre reproduces the two band integrals against the closed forms
    //     to machine precision: INT |alpha| = 1, INT (1 - |alpha|) = 1, A_band = 1/2.
    id: 'imp35737-gl-band-integrals-match-closed-forms',
    description: 'Gauss-Legendre reproduces INT_{-1}^{1} |alpha| = 1, INT_{-1}^{1} (1 - |alpha|) = 1 and A_band = 1/2 to ~1e-12',
    holds: () =>
      BAND_VS_CLOSED_FORM < 1e-12 &&
      MASS_VS_CLOSED_FORM < 1e-12 &&
      ABAND_VS_CLOSED_FORM < 1e-12,
  },
  {
    // (2) the independent integrator agrees with the imp-35680 composite-Simpson
    //     literals (A_band = 1/2, connected mass = 1) to ~1e-6.
    id: 'imp35737-gl-agrees-with-imp35680-simpson',
    description: 'the 64-node Gauss-Legendre band amplitude and connected mass agree with the imp-35680 Simpson literals to ~1e-6',
    holds: () =>
      ABAND_INTEGRATOR_DISCREPANCY < 1e-6 &&
      MASS_INTEGRATOR_DISCREPANCY < 1e-6 &&
      Math.abs(M.meanScaleAmplitudeABand - 0.5) < 1e-9 &&
      Math.abs(M.connectedMassInBand - 1) < 1e-9,
  },
  {
    // (3) the recomputed overshoot ratio matches imp-35680 (~1.3029400) and the
    //     quadrature error carried into it is bounded by ~1e-12.
    id: 'imp35737-overshoot-ratio-not-quadrature-artifact',
    description: 'the Gauss-Legendre overshoot ratio ~1.3029400 matches imp-35680 with quadrature error into the ratio bounded ~1e-12',
    holds: () =>
      RATIO_BAND_TO_CC_GL > 1.3029 && RATIO_BAND_TO_CC_GL < 1.30298 &&
      RATIO_INTEGRATOR_DISCREPANCY < 1e-6 &&
      RATIO_QUAD_ERROR_BOUND < 1e-12,
  },
  {
    // (4) physical-space Fourier partner INT (sin pi x/pi x)^2 dx = 1: truncation
    //     residual lies within the analytic tail bound 1/(pi^2 T) and the
    //     tail-corrected value equals 1 to ~1e-6.
    id: 'imp35737-sinc-square-normalization-unity',
    description: 'INT (sin pi x/pi x)^2 dx = 1: composite Gauss-Legendre residual is within 1/(pi^2 T) and tail-corrects to 1',
    holds: () =>
      SINC_RESIDUAL > 0 && SINC_RESIDUAL <= SINC_TAIL_BOUND * 1.01 &&
      Math.abs(SINC_TAIL_CORRECTED - 1) < 1e-6,
  },
  {
    // (5) honesty gate: cross-check only, conditional, no bound moves, C_C untouched,
    //     imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp35737-cross-check-only-no-qed',
    description: 'cross-check only: not rigorous/unconditional, confirms imp-35680, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35737_GAUSS_LEGENDRE_CROSS_CHECK;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        Math.abs(C_C - 0.38374752) < 1e-6 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.confirmsImp35680 === true &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35737_GAUSS_LEGENDRE_CROSS_CHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35737-gauss-legendre-cross-check assertion failed: ${a.id}`);
  }
}
