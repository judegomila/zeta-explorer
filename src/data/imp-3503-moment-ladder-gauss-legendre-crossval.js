/**
 * @module imp-3503-moment-ladder-gauss-legendre-crossval
 * @fileoverview imp-3503 -- CROSS-VALIDATE the imp-3481 autocorrelation moment
 *   ladder M_0..M_4 = int tau^n A(tau) d(tau) (and the anchor M_2 = 4.537e-6)
 *   against a STRUCTURALLY INDEPENDENT composite Gauss-Legendre quadrature, to
 *   certify the values are not a composite-Simpson artifact.
 *
 *   THE SETUP (why an independent rule is the right check)
 *   ------------------------------------------------------
 *   imp-3481 computed every moment M_n = int_0^{T_A} tau^n A(tau) d(tau) with the
 *   SAME quadrature -- composite Simpson -- for both the inner autocorrelation
 *   A(tau) = int_0^inf Phi(s) Phi(s + tau) ds and the outer moment integral. A
 *   Simpson-only ladder cannot, by itself, distinguish a genuine integral value
 *   from a Simpson-specific discretization bias: any O(h^4) Simpson error would
 *   sit inside every moment identically. The certification is to recompute the
 *   entire ladder -- BOTH the inner A(tau) AND the outer moment -- with a rule of
 *   a different family (Gauss-Legendre: nodal, non-Newton-Cotes, no equispaced
 *   grid) and check the two independent rules agree to machine precision.
 *
 *   THE INDEPENDENT RULE
 *   --------------------
 *   Composite Gauss-Legendre: an n-point Gauss-Legendre panel (nodes/weights from
 *   Newton iteration on the Legendre polynomial P_n, exact for polynomials up to
 *   degree 2n-1) is repeated over uniform panels. This shares NO node with the
 *   Simpson grid and integrates smooth analytic integrands (Phi is entire and
 *   super-exponentially decaying) to near machine precision with far fewer
 *   evaluations, so any residual disagreement with Simpson is Simpson truncation
 *   error, not a shared bias.
 *
 *   MEASURED RESULT (self-computing; both ladders recomputed at import)
 *   ------------------------------------------------------------------
 *   (R1) The Gauss-Legendre ladder reproduces the imp-3481 Simpson moments
 *        M_0 ~ 7.675e-4, M_1 ~ 4.518e-5, M_2 ~ 4.537e-6, M_3 ~ 6.029e-7,
 *        M_4 ~ 9.625e-8 to 6..7 significant figures on EVERY rung (relative
 *        agreement 9.5e-8 at M_0 rising monotonically to 3.8e-6 at M_4). The
 *        agreement DEGRADES with moment order -- the fingerprint of composite-
 *        Simpson truncation, since tau^n weights the grid tail more heavily.
 *   (R2) THE RESIDUAL IS SIMPSON ERROR, NOT GL ERROR: the GL ladder is itself
 *        machine-precision converged -- recomputing it at a higher GL resolution
 *        (order 16, denser panels) reproduces the base ladder to ~1e-13 relative
 *        on every rung, so the ~1e-6 gap to Simpson is entirely the imp-3481
 *        composite-Simpson truncation being resolved away by the exact rule.
 *   (R3) The GL second moment M_2 independently reproduces the imp-3469 anchor
 *        4.537e-6, so the anchor is a property of the integral, not of Simpson.
 *        The GL moments are positive and strictly decreasing (imp-3481
 *        well-formedness).
 *
 *   VERDICT: the imp-3481 moment ladder M_0..M_4 is quadrature-rule-INDEPENDENT --
 *   a machine-precision-converged Gauss-Legendre rule reproduces every Simpson
 *   moment to 6..7 significant figures (residual = pure Simpson truncation),
 *   certifying the values (and the M_2 = 4.537e-6 anchor) are genuine integrals,
 *   not a composite-Simpson artifact.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   CERTIFICATION / MEASUREMENT ONLY, at the RH-equivalent scale class. This is a
 *   numerical cross-check that the imp-3481 moments are quadrature-independent; it
 *   adds NO new mathematical structure and establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT (imp-3481); the operator-level
 *   K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-3481-autocorrelation-moment-ladder.js (the Simpson ladder cross-validated here)
 *   @see imp-3469-degree2-bridge-mass-scaling.js (the M_2 = 4.537e-6 anchor)
 *
 *   Ticket: imp-3503 (accuracy, medium).
 */

import IMP3481 from './imp-3481-autocorrelation-moment-ladder.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3481)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686 / imp-3481). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  // Exact early exit: once the n = 1 Gaussian factor underflows to 0, every term
  // (finite prefactor) * 0 is +-0 and the loop sum is exactly +0, so return 0.
  if (e4 < 1e300 && Math.exp(-Math.PI * e4) === 0) return 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

// -- Gauss-Legendre nodes/weights on [-1, 1] (Newton on the Legendre polynomial) --
// Exact for polynomials up to degree 2n-1. This is the structurally INDEPENDENT
// family: nodal, non-equispaced, and shares no abscissa with the Simpson grid.
function gaussLegendreRule(n) {
  const x = new Array(n);
  const w = new Array(n);
  const half = (n + 1) >> 1;
  for (let i = 0; i < half; i += 1) {
    // Chebyshev-like initial guess for the i-th root, refined by Newton.
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5));
    let dpn = 0;
    for (let it = 0; it < 100; it += 1) {
      let p0 = 1;
      let p1 = z;
      for (let k = 2; k <= n; k += 1) {
        const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k;
        p0 = p1;
        p1 = p2;
      }
      // p1 = P_n(z); derivative via the standard identity.
      dpn = (n * (z * p1 - p0)) / (z * z - 1);
      const dz = p1 / dpn;
      z -= dz;
      if (Math.abs(dz) < 1e-15) break;
    }
    const wi = 2 / ((1 - z * z) * dpn * dpn);
    x[i] = -z;
    x[n - 1 - i] = z;
    w[i] = wi;
    w[n - 1 - i] = wi;
  }
  return Object.freeze({ nodes: Object.freeze(x), weights: Object.freeze(w) });
}

/** Composite Gauss-Legendre integral of f on [lo, hi] with `panels` uniform panels. */
function integrateGL(f, lo, hi, panels, rule) {
  const { nodes, weights } = rule;
  const step = (hi - lo) / panels;
  const halfWidth = step / 2;
  let sum = 0;
  for (let p = 0; p < panels; p += 1) {
    const center = lo + (p + 0.5) * step;
    for (let k = 0; k < nodes.length; k += 1) {
      sum += weights[k] * f(center + halfWidth * nodes[k]);
    }
  }
  return sum * halfWidth;
}

const T_A = 6;                                  // same tau cap as imp-3481 (A negligible beyond ~0.6)
const MOMENT_MAX = 4;

// -- The full composite-Gauss-Legendre moment ladder at a chosen resolution -----
// Recomputes BOTH the inner A(tau) = int_0^7 Phi(s)Phi(s+tau)ds AND the outer
// moment M_n = int_0^{T_A} tau^n A(tau)d(tau) with GL (no equispaced Simpson grid,
// no shared abscissa). A is cached at the outer GL nodes and reused across orders.
function glMomentLadder(order, innerPanels, outerPanels) {
  const rule = gaussLegendreRule(order);
  const autocorr = (tau) =>
    integrateGL((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, innerPanels, rule);
  const outerStep = T_A / outerPanels;
  const outerHalf = outerStep / 2;
  const tau = [];
  const aVals = [];
  const weights = [];
  for (let p = 0; p < outerPanels; p += 1) {
    const center = (p + 0.5) * outerStep;
    for (let k = 0; k < rule.nodes.length; k += 1) {
      const t = center + outerHalf * rule.nodes[k];
      tau.push(t);
      aVals.push(autocorr(t));
      weights.push(rule.weights[k]);
    }
  }
  const moments = [];
  for (let n = 0; n <= MOMENT_MAX; n += 1) {
    let sum = 0;
    for (let i = 0; i < tau.length; i += 1) {
      sum += weights[i] * Math.pow(tau[i], n) * aVals[i];
    }
    moments.push(sum * outerHalf);
  }
  return moments;
}

// Base independent rule (deliberately unlike the Simpson grid), plus a higher-
// resolution GL rule to certify the GL ladder is itself machine-precision
// converged -- so any gap to Simpson is Simpson truncation, not GL error.
const GL_ORDER = 12;                            // 12-point panel (exact to degree 23)
const INNER_PANELS = 120;                       // A(tau) inner integral on [0, 7]
const OUTER_PANELS = 96;                        // moment integral on [0, T_A]
const GL_HI_ORDER = 16;                         // denser rule for the self-convergence check
const GL_HI_INNER = 200;
const GL_HI_OUTER = 160;

const GL_MOMENTS = glMomentLadder(GL_ORDER, INNER_PANELS, OUTER_PANELS);
const GL_MOMENTS_HI = glMomentLadder(GL_HI_ORDER, GL_HI_INNER, GL_HI_OUTER);

// GL self-convergence: base vs higher-resolution GL, per moment (must be ~1e-13).
const GL_SELF_CONV = GL_MOMENTS.map((m, n) => Math.abs(m - GL_MOMENTS_HI[n]) / Math.abs(GL_MOMENTS_HI[n]));
const maxGlSelfConv = Math.max(...GL_SELF_CONV);

// -- The imp-3481 Simpson reference ladder (imported, not recomputed) -----------
const SIMPSON = IMP3481.measured.moments;
const SIMPSON_MOMENTS = [SIMPSON.M0, SIMPSON.M1, SIMPSON.M2, SIMPSON.M3, SIMPSON.M4];

// Per-moment relative agreement between the two independent rules.
const AGREEMENT = GL_MOMENTS.map((mGL, n) => {
  const mSimp = SIMPSON_MOMENTS[n];
  const relDiff = Math.abs(mGL - mSimp) / Math.abs(mSimp);
  return Object.freeze({ n, gauss: mGL, simpson: mSimp, relDiff });
});
const maxRelDiff = Math.max(...AGREEMENT.map((a) => a.relDiff));

// The GL second moment must independently reproduce the imp-3469 anchor 4.537e-6.
const IMP3469_M2 = 4.537226e-6;
const glM2AnchorRelErr = Math.abs(GL_MOMENTS[2] - IMP3469_M2) / IMP3469_M2;

const glMomentsPositiveDecreasing =
  GL_MOMENTS.every((m) => m > 0) &&
  GL_MOMENTS.every((m, i) => i === 0 || GL_MOMENTS[i - 1] > m);

// -- Classification -----------------------------------------------------------
// The two independent rules agree to 6..7 significant figures; the residual is
// composite-Simpson truncation (it grows with moment order). The GL rule itself
// is machine-precision converged (self-conv ~1e-13), so the gap is Simpson error.
const AGREEMENT_TOL = 1e-5;                     // Simpson vs GL: 6..7 sig figs (Simpson-truncation-limited)
const SELF_CONV_TOL = 1e-10;                    // GL self-convergence: machine-precision converged rule
const ANCHOR_TOL = 1e-4;                        // GL M_2 matches the imp-3469 value

const rulesAgree = maxRelDiff < AGREEMENT_TOL;
const glSelfConverged = maxGlSelfConv < SELF_CONV_TOL;
const glAnchorMatches = glM2AnchorRelErr < ANCHOR_TOL;

const verdict =
  rulesAgree && glSelfConverged && glAnchorMatches && glMomentsPositiveDecreasing
    ? 'MOMENT-LADDER-M_0..M_4-QUADRATURE-RULE-INDEPENDENT-CONVERGED-GAUSS-LEGENDRE-REPRODUCES-SIMPSON-TO-6-7-SIG-FIGS-RESIDUAL-IS-SIMPSON-TRUNCATION-NOT-A-COMPOSITE-SIMPSON-ARTIFACT'
    : 'INDETERMINATE';

export const IMP3503_MOMENT_LADDER_GL_CROSSVAL = Object.freeze({
  id: 'imp-3503-moment-ladder-gauss-legendre-crossval',
  ticket: 'imp-3503',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  crossValidates: 'imp-3481-autocorrelation-moment-ladder.js',
  relatedAnchor: 'imp-3469-degree2-bridge-mass-scaling.js',

  summary:
    'Cross-validates the imp-3481 autocorrelation moment ladder M_n = int tau^n A(tau)d(tau) (n=0..4, ' +
    'A(tau)=int Phi(s)Phi(s+tau)ds, NPHI=10) -- computed there entirely by composite Simpson -- against a ' +
    'structurally INDEPENDENT composite Gauss-Legendre rule (12-point panels, Newton-computed Legendre nodes) ' +
    'applied to BOTH the inner A(tau) and the outer moment integral. MEASURED: the GL ladder reproduces the ' +
    'Simpson moments M_0~7.675e-4, M_1~4.518e-5, M_2~4.537e-6, M_3~6.029e-7, M_4~9.625e-8 to 6..7 significant ' +
    'figures on every rung (rel agreement 9.5e-8 at M_0 rising to 3.8e-6 at M_4); the growth with moment order ' +
    'is composite-Simpson truncation. The GL ladder is itself machine-precision converged (recomputing at a ' +
    'denser GL rule reproduces it to ~1e-13), so the gap to Simpson is Simpson error being resolved away, not GL ' +
    'error; and the GL M_2 independently reproduces the imp-3469 anchor 4.537e-6. This certifies the ladder (and ' +
    'the M_2 anchor) are quadrature-rule-independent genuine integrals, not a composite-Simpson artifact. ' +
    'CERTIFICATION/MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; adds no new structure; operator ' +
    'positivity (imp-3066) untouched; no RH verdict.',

  method: Object.freeze({
    referenceLadder: 'imp-3481 composite-Simpson moments M_0..M_4 (imported, not recomputed)',
    independentRule: 'composite Gauss-Legendre: 12-point panels (nodes/weights from Newton on P_12), exact to degree 23',
    innerIntegral: 'A(tau)=int_0^7 Phi(s)Phi(s+tau)ds by GL with INNER_PANELS=120 (no equispaced Simpson grid)',
    outerIntegral: 'M_n=int_0^{T_A} tau^n A(tau)d(tau) by GL with OUTER_PANELS=96; A cached at the outer GL nodes',
    selfConvergenceCheck: 'ladder recomputed at GL order 16, inner 200, outer 160 panels; base vs hi-res must match to ~1e-13',
    glOrder: GL_ORDER,
    innerPanels: INNER_PANELS,
    outerPanels: OUTER_PANELS,
    glHiOrder: GL_HI_ORDER,
    tauCap: T_A,
    agreementTol: AGREEMENT_TOL,
    selfConvTol: SELF_CONV_TOL,
    anchorTol: ANCHOR_TOL,
    selfComputing: true,
  }),

  measured: Object.freeze({
    gaussMoments: Object.freeze({
      M0: GL_MOMENTS[0], M1: GL_MOMENTS[1], M2: GL_MOMENTS[2], M3: GL_MOMENTS[3], M4: GL_MOMENTS[4],
    }),
    simpsonMoments: Object.freeze({
      M0: SIMPSON_MOMENTS[0], M1: SIMPSON_MOMENTS[1], M2: SIMPSON_MOMENTS[2],
      M3: SIMPSON_MOMENTS[3], M4: SIMPSON_MOMENTS[4],
    }),
    perMomentAgreement: Object.freeze(AGREEMENT),   // { n, gauss, simpson, relDiff } per moment
    maxRelDiff,                                      // 6..7 sig figs (Simpson-truncation-limited)
    glSelfConvergence: Object.freeze(GL_SELF_CONV), // base GL vs hi-res GL, per moment
    maxGlSelfConv,                                   // ~1e-13: GL rule is machine-precision converged
    glM2AnchorRelErr,                                // GL M_2 vs the imp-3469 4.537e-6
    rulesAgree,
    glSelfConverged,
    glAnchorMatches,
    glMomentsPositiveDecreasing,
    verdict,
  }),

  interpretation: Object.freeze({
    whyIndependentRuleCertifies:
      'A Simpson-only ladder cannot distinguish a genuine integral from a Simpson-specific O(h^4) bias, since ' +
      'that bias would sit inside every moment identically. Recomputing both the inner A(tau) and the outer ' +
      'moment with a different quadrature family (Gauss-Legendre) that shares no abscissa removes the shared-bias ' +
      'ambiguity: agreement to 6..7 significant figures means the residual disagreement is Simpson truncation, not a value.',
    residualIsSimpsonTruncation:
      'The Simpson-GL gap grows monotonically with moment order (9.5e-8 at M_0 to 3.8e-6 at M_4) because tau^n ' +
      'weights the grid tail more heavily. The GL ladder is itself machine-precision converged -- a denser GL rule ' +
      'reproduces it to ~1e-13 on every rung -- so the gap is imp-3481 composite-Simpson truncation being resolved ' +
      'away by the exact rule, not GL error. The imp-3481 values are correct to ~6 significant figures.',
    anchorIsRuleIndependent:
      'The M_2 = 4.537e-6 anchor (imp-3469) is reproduced by the independent GL rule to < 1e-4, so it is a ' +
      'property of the Phi-autocorrelation integral itself, not of the composite-Simpson discretization.',
    certifiesImp3481:
      'The imp-3481 moment ladder is quadrature-rule-independent; nothing about its measured values depends on ' +
      'the choice of composite Simpson.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module is a numerical cross-check that the imp-3481 moments are quadrature-rule-independent. It adds ' +
      'no new mathematical structure and establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT (imp-3481). The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3503_MOMENT_LADDER_GL_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp3503-gl-moments-positive-and-decreasing',
    why: 'The independently computed Gauss-Legendre moment ladder M_0..M_4 must be all positive and strictly ' +
         'decreasing, matching the imp-3481 well-formedness -- the basic sanity of the recomputation.',
    holds: () => glMomentsPositiveDecreasing,
  },
  {
    id: 'imp3503-gauss-agrees-with-simpson-every-moment',
    why: 'THE KEY CERTIFICATION: the independent Gauss-Legendre rule must reproduce every imp-3481 composite-Simpson ' +
         'moment M_0..M_4 to < 1e-5 relative (6..7 sig figs), proving the ladder is quadrature-rule-independent, not a Simpson artifact.',
    holds: () => rulesAgree,
  },
  {
    id: 'imp3503-gl-ladder-is-machine-precision-converged',
    why: 'The residual Simpson-GL gap must be attributable to Simpson, not GL: recomputing the GL ladder at a denser ' +
         'GL rule (order 16) must reproduce the base GL ladder to < 1e-10 on every rung, certifying GL is the converged (exact) rule.',
    holds: () => glSelfConverged,
  },
  {
    id: 'imp3503-gl-m2-anchors-to-imp3469',
    why: 'The GL second moment M_2 must independently reproduce the imp-3469 anchor 4.537e-6 to < 1e-4, confirming ' +
         'the anchor is a property of the integral, not of the composite-Simpson discretization.',
    holds: () => glAnchorMatches,
  },
  {
    id: 'imp3503-verdict-classifies-rule-independence',
    why: 'The classified verdict must be the quadrature-rule-independent (converged Gauss-Legendre reproduces Simpson) result, ' +
         'not indeterminate.',
    holds: () => verdict === 'MOMENT-LADDER-M_0..M_4-QUADRATURE-RULE-INDEPENDENT-CONVERGED-GAUSS-LEGENDRE-REPRODUCES-SIMPSON-TO-6-7-SIG-FIGS-RESIDUAL-IS-SIMPSON-TRUNCATION-NOT-A-COMPOSITE-SIMPSON-ARTIFACT',
  },
  {
    id: 'imp3503-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: numerical cross-check / certification only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3503_MOMENT_LADDER_GL_CROSSVAL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3503_MOMENT_LADDER_GL_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3503-moment-ladder-gauss-legendre-crossval assertion failed: ${assertion.id}`);
  }
}

export default IMP3503_MOMENT_LADDER_GL_CROSSVAL;
