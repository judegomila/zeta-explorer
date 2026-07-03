/**
 * @module imp-3621-outer-simpson-truncation-moments-m5-m10
 * @fileoverview imp-3621 -- BOUND the OUTER composite-Simpson truncation of the
 *   imp-3600 higher moments M_5..M_10 against the imp-3603 Gauss-Legendre OUTER
 *   reference, to certify the p=2 exponent-ladder inputs carry NO residual
 *   outer-quadrature bias (relative gap per moment << the imp-3600 ~1e-9 fit
 *   tolerance) -- so the imp-3600 |p_fit-2| read-outs are not outer-quadrature
 *   artifacts.
 *
 *   WHAT imp-3603 VALIDATED, AND THE RESIDUAL WORRY
 *   -----------------------------------------------
 *   imp-3603 removed Simpson from BOTH the inner A(tau) reference (GL-24/100) and
 *   the outer moment weighting (GL outer) to confirm the K_n^inner O(h^4) decay is
 *   not a self-reference artifact -- but only for the LOW moments M_0..M_4. imp-3600
 *   then introduced the HIGHER moments M_5..M_10 on the NM=1600 [0,T_A] composite-
 *   Simpson OUTER grid and fed C_5=M_7/(42 M_5), C_6=M_8/(56 M_6) and the D_5,D_6
 *   next-order brackets into the p=2 exponent-derivation ladder, reporting the
 *   fit-bias law reproduces the actual least-squares slope to ~1e-9. Those higher
 *   moments never received an OUTER-truncation cross-check: if the NM=1600 Simpson
 *   outer rule carried a residual O(h^4) bias on tau^m A(tau) at m up to 10, that
 *   bias could leak into the C_n/D_n ratios and MASQUERADE as part of the ~1e-9
 *   |p_fit-2| read-out. This module measures that outer-truncation gap directly.
 *
 *   THE MEASUREMENT (this module)
 *   -----------------------------
 *   Hold the INNER rule identical to imp-3600 (composite Simpson, INNER_N=1200 on
 *   [0,7]) on BOTH paths, so ONLY the outer quadrature differs, and compare:
 *     (i)  M_m^Simpson : the imp-3600 outer rule -- composite Simpson on the NM=1600
 *          [0,T_A] grid (exactly imp-3600 aWeightedMass), for m = 5..10;
 *     (ii) M_m^GL      : the same tau^m A(tau) integrand re-weighted with the
 *          imp-3603 Gauss-Legendre OUTER rule (GL-24, 200 panels on [0,T_A]),
 *   and report the per-moment relative gap |M_m^Simpson - M_m^GL| / |M_m^GL|.
 *   The GL outer reference is itself certified converged by a panel-doubling self-
 *   check (GL-24/100 vs GL-24/200 agree to machine precision), so the gap is a
 *   clean bound on the OUTER-Simpson truncation of each imp-3600 moment.
 *
 *   MEASURED RESULT (self-computing)
 *   --------------------------------
 *   (R1) THE GL OUTER REFERENCE IS CONVERGED. max_m of the GL-24/100 vs GL-24/200
 *        relative disagreement is at the rounding floor (~1e-15), so the outer GL
 *        reference is not itself the limiting error.
 *   (R2) EVERY MOMENT GAP IS FAR BELOW THE FIT TOLERANCE. The relative outer-Simpson
 *        gap is ~1.31e-10 at M_5 and drops to the ~1e-15 rounding floor for M_6..M_10
 *        (M_6 ~3.9e-13, M_7 ~1.8e-13, M_8..M_10 ~1e-15); the maximum, ~1.31e-10, is
 *        more than an ORDER OF MAGNITUDE below the imp-3600 ~1e-9 slope-model / fit
 *        tolerance.
 *   (R3) THE LADDER INPUTS ARE CONVERGED. The C_5=M_7/(42 M_5), C_6=M_8/(56 M_6) and
 *        D_5,D_6 brackets reconstructed from the Simpson-outer moments match those
 *        from the GL-outer moments to << 1e-9, so the imp-3600 closed coefficients
 *        and the |p_fit-2| read-outs (~6.99e-6, ~1.14e-5) carry no residual
 *        outer-quadrature bias -- the fitted-slope shortfall is the derived O(a^2)
 *        curvature, not an outer-Simpson artifact.
 *
 *   VERDICT: the imp-3600 higher-moment exponent-ladder inputs M_5..M_10 are OUTER-
 *   quadrature-converged; the outer composite-Simpson truncation is bounded below
 *   the ~1e-9 fit tolerance at every rung, extending the imp-3603 M_0..M_4
 *   Simpson-free confirmation to the M_5..M_10 rungs imp-3600 actually feeds the
 *   p=2 ladder.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   CROSS-VALIDATION / MEASUREMENT ONLY, at the RH-equivalent scale class. This
 *   bounds an OUTER composite-Simpson truncation against an independent Gauss-
 *   Legendre outer quadrature; it adds NO new mathematical structure and
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT (imp-3481); the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3600-remainder-tail-exponent-ladder-n56.js (the M_5..M_10 exponent-ladder inputs bounded here)
 *   @see imp-3603-inner-truncation-gauss-legendre-crossval.js (the GL-outer machinery, M_0..M_4 only)
 *   @see imp-3581-remainder-tail-exponent-derivation.js (the closed C_n/D_n and p_fit bias law)
 *
 *   Ticket: imp-3621 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation (imp-3600)
const T_A = 6;                                  // outer tau cap (imp-3600/imp-3581)
const INNER_CAP = 7;                            // A(tau) inner upper limit (imp-3600)
const INNER_N = 1200;                           // imp-3600 inner composite-Simpson panel count

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686 / imp-3600). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

/** INNER autocorrelation A(tau) = int_0^7 Phi(s)Phi(s+tau)ds -- IDENTICAL on both outer paths. */
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, INNER_CAP, INNER_N);
}

// -- imp-3600 OUTER path: composite Simpson on the fixed NM=1600 [0,T_A] grid -------
const NM = 1600;                                // imp-3600 outer panel count (even -> Simpson)
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** int_0^{T_A} tau^m A(tau) d(tau) by composite Simpson on the imp-3600 grid (aWeightedMass). */
function outerMomentSimpson(m) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * Math.pow(tau, m) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

// -- imp-3603 OUTER reference: Gauss-Legendre outer rule (Newton-on-Legendre) -------
function gaussLegendreRule(n) {
  const x = new Array(n);
  const w = new Array(n);
  const half = (n + 1) >> 1;
  for (let i = 0; i < half; i += 1) {
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

const GL24_RULE = gaussLegendreRule(24);        // imp-3603-class high-order outer rule

/** int_0^{T_A} tau^m A(tau) d(tau) via a composite Gauss-Legendre OUTER rule (same inner A). */
function outerMomentGL(m, panels) {
  const step = T_A / panels;
  const halfWidth = step / 2;
  let sum = 0;
  for (let p = 0; p < panels; p += 1) {
    const center = (p + 0.5) * step;
    for (let k = 0; k < GL24_RULE.nodes.length; k += 1) {
      const tau = center + halfWidth * GL24_RULE.nodes[k];
      sum += GL24_RULE.weights[k] * Math.pow(tau, m) * autocorr(tau);
    }
  }
  return sum * halfWidth;
}

// -- The imp-3600 higher-moment ladder inputs under test ----------------------------
const MOMENTS_UNDER_TEST = Object.freeze([5, 6, 7, 8, 9, 10]);
const GL_REF_PANELS = 200;                      // converged GL outer reference
const GL_SELF_PANELS = 100;                     // panel-doubling self-convergence check

// (R1) GL outer reference self-convergence (GL-24/100 vs GL-24/200) -- machine precision.
let maxGlSelfDisagreement = 0;
// (R2) per-moment outer-Simpson relative gap vs the converged GL outer reference.
const perMoment = MOMENTS_UNDER_TEST.map((m) => {
  const mSimpson = outerMomentSimpson(m);
  const mGLref = outerMomentGL(m, GL_REF_PANELS);
  const mGLself = outerMomentGL(m, GL_SELF_PANELS);
  const relGap = Math.abs(mSimpson - mGLref) / Math.abs(mGLref);
  const glSelfRel = Math.abs(mGLself - mGLref) / Math.abs(mGLref);
  if (glSelfRel > maxGlSelfDisagreement) maxGlSelfDisagreement = glSelfRel;
  return Object.freeze({ m, mSimpson, mGLref, relGap, glSelfRel });
});

const maxRelGap = Math.max(...perMoment.map((r) => r.relGap));
const worstMoment = perMoment.reduce((a, b) => (b.relGap > a.relGap ? b : a)).m;

// -- (R3) exponent-ladder inputs: C_5, C_6, D_5, D_6 from both outer rules ----------
// C_n = M_(n+2)/((n+1)(n+2)M_n);  D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - C_n  (imp-3581).
const SIMP = {};
const GLR = {};
for (let m = 5; m <= 14; m += 1) {              // n=6 D_6 needs M_10; keep M_11..M_14 for the brackets
  SIMP[m] = outerMomentSimpson(m);
  GLR[m] = outerMomentGL(m, GL_REF_PANELS);
}
function leadingCoeff(src, n) {
  return src[n + 2] / ((n + 1) * (n + 2) * src[n]);
}
function nextOrderCoeff(src, n) {
  return (
    src[n + 4] / ((n + 3) * (n + 4) * src[n + 2]) -
    src[n + 2] / ((n + 1) * (n + 2) * src[n])
  );
}
const C5_simp = leadingCoeff(SIMP, 5);
const C5_gl = leadingCoeff(GLR, 5);
const C6_simp = leadingCoeff(SIMP, 6);
const C6_gl = leadingCoeff(GLR, 6);
const D5_simp = nextOrderCoeff(SIMP, 5);
const D5_gl = nextOrderCoeff(GLR, 5);
const D6_simp = nextOrderCoeff(SIMP, 6);
const D6_gl = nextOrderCoeff(GLR, 6);
const c5RelGap = Math.abs(C5_simp - C5_gl) / Math.abs(C5_gl);
const c6RelGap = Math.abs(C6_simp - C6_gl) / Math.abs(C6_gl);
const d5RelGap = Math.abs(D5_simp - D5_gl) / Math.abs(D5_gl);
const d6RelGap = Math.abs(D6_simp - D6_gl) / Math.abs(D6_gl);
const maxCoeffGap = Math.max(c5RelGap, c6RelGap, d5RelGap, d6RelGap);

// -- Classification -----------------------------------------------------------------
const FIT_TOL = 1e-9;             // imp-3600 slope-model / fit tolerance (~6e-10..1e-9)
const GL_REF_CONVERGED_TOL = 1e-12;  // GL outer reference self-agreement (machine precision)

const referenceConverged = maxGlSelfDisagreement < GL_REF_CONVERGED_TOL;
const momentsConverged = maxRelGap < FIT_TOL;
const coeffsConverged = maxCoeffGap < FIT_TOL;

const verdict =
  referenceConverged && momentsConverged && coeffsConverged
    ? 'IMP3600-M_5..M_10-OUTER-SIMPSON-TRUNCATION-BOUNDED-BELOW-~1e-9-FIT-TOLERANCE-BY-INDEPENDENT-GL-OUTER-REFERENCE-EXPONENT-LADDER-INPUTS-CARRY-NO-RESIDUAL-OUTER-QUADRATURE-BIAS'
    : 'INDETERMINATE';

export const IMP3621_OUTER_SIMPSON_TRUNCATION_MOMENTS_M5_M10 = Object.freeze({
  id: 'imp-3621-outer-simpson-truncation-moments-m5-m10',
  ticket: 'imp-3621',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  boundsInputsOf: 'imp-3600-remainder-tail-exponent-ladder-n56.js',
  reuses: 'imp-3603-inner-truncation-gauss-legendre-crossval.js',
  relatedDerivation: 'imp-3581-remainder-tail-exponent-derivation.js',

  summary:
    'BOUNDS the OUTER composite-Simpson truncation of the imp-3600 higher moments M_5..M_10 against an independent ' +
    'imp-3603-class Gauss-Legendre OUTER reference (GL-24, 200 panels on [0,T_A]), holding the INNER A(tau) rule ' +
    'identical (composite Simpson, INNER_N=1200 on [0,7]) on both paths so ONLY the outer quadrature differs. MEASURED: ' +
    'the GL outer reference self-converges to machine precision (GL-24/100 vs GL-24/200 relative disagreement ~1e-15); ' +
    'the per-moment outer-Simpson relative gap is ~1.31e-10 at M_5 and drops to the ~1e-15 rounding floor for M_6..M_10 ' +
    '(M_6 ~3.9e-13, M_7 ~1.8e-13, M_8..M_10 ~1e-15), so the maximum ~1.31e-10 is more than an order of magnitude below ' +
    'the imp-3600 ~1e-9 slope-model/fit tolerance; and the C_5=M_7/(42 M_5), C_6=M_8/(56 M_6), D_5, D_6 exponent-ladder ' +
    'brackets reconstructed from the Simpson-outer moments match the GL-outer ones to << 1e-9. VERDICT: the imp-3600 ' +
    'M_5..M_10 ladder inputs are outer-quadrature-converged and the |p_fit-2| read-outs (~6.99e-6, ~1.14e-5) are NOT ' +
    'outer-Simpson artifacts, extending the imp-3603 M_0..M_4 Simpson-free confirmation to the higher rungs imp-3600 ' +
    'actually feeds the p=2 ladder. CROSS-VALIDATION/MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; adds no ' +
    'new structure; operator positivity (imp-3066) untouched; no RH verdict.',

  method: Object.freeze({
    moment: 'M_m = int_0^{T_A} tau^m A(tau)d(tau), A(tau)=int_0^7 Phi(s)Phi(s+tau)ds, NPHI=10 (imp-3600 recipe)',
    innerRuleHeldFixed: 'composite Simpson, INNER_N=' + INNER_N + ' on [0,' + INNER_CAP + '] -- IDENTICAL on both outer paths, so only the outer quadrature differs',
    outerSimpson: 'imp-3600 outer rule: composite Simpson on the NM=' + NM + ' [0,' + T_A + '] grid',
    outerGLReference: 'imp-3603-class Gauss-Legendre outer rule: GL-' + GL24_RULE.nodes.length + ', ' + GL_REF_PANELS + ' panels on [0,' + T_A + ']',
    referenceSelfCheck: 'GL-24/' + GL_SELF_PANELS + ' vs GL-24/' + GL_REF_PANELS + ' relative disagreement -- reference converged if machine-small',
    gapMetric: 'relGap_m = |M_m^Simpson - M_m^GL| / |M_m^GL|, m in {' + MOMENTS_UNDER_TEST.join(', ') + '}',
    ladderInputs: 'C_n = M_(n+2)/((n+1)(n+2)M_n), D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - C_n (imp-3581), at n=5,6',
    fitTolerance: FIT_TOL,
    selfComputing: true,
  }),

  measured: Object.freeze({
    perMoment: Object.freeze(perMoment),         // {m, mSimpson, mGLref, relGap, glSelfRel}
    maxRelGap,                                    // ~1.31e-10 (at M_5), << 1e-9
    worstMoment,                                  // 5
    maxGlSelfDisagreement,                        // ~1e-15: GL outer reference converged
    exponentLadderInputs: Object.freeze({
      C5_simp, C5_gl, c5RelGap,
      C6_simp, C6_gl, c6RelGap,
      D5_simp, D5_gl, d5RelGap,
      D6_simp, D6_gl, d6RelGap,
      maxCoeffGap,                                // << 1e-9: closed coefficients unchanged by outer rule
    }),
    referenceConverged,
    momentsConverged,
    coeffsConverged,
    verdict,
  }),

  interpretation: Object.freeze({
    referenceIsConverged:
      'The GL-24 outer reference self-converges to machine precision under panel doubling (100 vs 200 panels agree to ' +
      '~1e-15), so it is a trustworthy independent yardstick for the outer-Simpson truncation and not itself the ' +
      'limiting error.',
    outerTruncationBounded:
      'Holding the inner A(tau) rule identical on both paths, the outer composite-Simpson relative gap peaks at ' +
      '~1.31e-10 (M_5) and falls to the ~1e-15 rounding floor for M_6..M_10 -- more than an order of magnitude below ' +
      'the imp-3600 ~1e-9 fit tolerance at every rung.',
    ladderInputsUnbiased:
      'The C_5, C_6, D_5, D_6 exponent-ladder brackets are identical (to << 1e-9) whether built from the Simpson-outer ' +
      'or GL-outer moments, so the imp-3600 |p_fit-2| read-outs (~6.99e-6, ~1.14e-5) are the derived O(a^2) curvature ' +
      'bias, NOT a residual outer-quadrature artifact -- extending the imp-3603 M_0..M_4 result to M_5..M_10.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module bounds an OUTER composite-Simpson truncation against an independent Gauss-Legendre outer ' +
      'quadrature. It adds no new mathematical structure and establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT (imp-3481). The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------------
export const IMP3621_OUTER_SIMPSON_TRUNCATION_MOMENTS_M5_M10_ASSERTIONS = [
  {
    id: 'imp3621-gl-outer-reference-converged',
    why: 'THE REFERENCE ANCHOR: the GL-24 outer reference must self-converge under panel doubling (GL-24/100 vs ' +
         'GL-24/200) to < 1e-12 relative (measured ~1e-15), so it is a trustworthy yardstick, not the limiting error.',
    holds: () => maxGlSelfDisagreement < GL_REF_CONVERGED_TOL,
  },
  {
    id: 'imp3621-max-outer-simpson-gap-below-fit-tolerance',
    why: 'THE KEY CERTIFICATION: the max per-moment outer-Simpson relative gap over M_5..M_10 must sit below the ' +
         'imp-3600 ~1e-9 fit tolerance (measured ~1.31e-10 at M_5), so the exponent-ladder inputs carry no residual ' +
         'outer-quadrature bias.',
    holds: () => maxRelGap < FIT_TOL,
  },
  {
    id: 'imp3621-every-moment-gap-below-fit-tolerance',
    why: 'Each individual M_5..M_10 outer-Simpson gap must be below the ~1e-9 fit tolerance -- not just the maximum.',
    holds: () => perMoment.every((r) => r.relGap < FIT_TOL),
  },
  {
    id: 'imp3621-exponent-ladder-coeffs-outer-rule-invariant',
    why: 'The C_5, C_6, D_5, D_6 exponent-ladder brackets reconstructed from the Simpson-outer moments must match the ' +
         'GL-outer ones to << 1e-9, so the imp-3600 |p_fit-2| read-outs are not outer-quadrature artifacts.',
    holds: () => maxCoeffGap < FIT_TOL,
  },
  {
    id: 'imp3621-simpson-and-gl-moments-reproduce-imp3600-C5',
    why: 'Sanity: both outer rules reproduce the imp-3600 leading coefficient C_5 = M_7/(42 M_5) ~ 1.06348e-3, ' +
         'confirming the moments under test are the same ladder inputs imp-3600 fed the p=2 fit.',
    holds: () =>
      Math.abs(C5_gl - 1.06348e-3) / 1.06348e-3 < 1e-4 &&
      Math.abs(C5_simp - 1.06348e-3) / 1.06348e-3 < 1e-4,
  },
  {
    id: 'imp3621-verdict-certifies-no-outer-quadrature-bias',
    why: 'The classified verdict must certify the M_5..M_10 outer-Simpson truncation is bounded below the fit ' +
         'tolerance with the ladder inputs carrying no residual outer-quadrature bias, not indeterminate.',
    holds: () =>
      verdict ===
      'IMP3600-M_5..M_10-OUTER-SIMPSON-TRUNCATION-BOUNDED-BELOW-~1e-9-FIT-TOLERANCE-BY-INDEPENDENT-GL-OUTER-REFERENCE-EXPONENT-LADDER-INPUTS-CARRY-NO-RESIDUAL-OUTER-QUADRATURE-BIAS',
  },
  {
    id: 'imp3621-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: cross-validation/measurement only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3621_OUTER_SIMPSON_TRUNCATION_MOMENTS_M5_M10.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3621_OUTER_SIMPSON_TRUNCATION_MOMENTS_M5_M10_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3621-outer-simpson-truncation-moments-m5-m10 assertion failed: ${assertion.id}`);
  }
}

export default IMP3621_OUTER_SIMPSON_TRUNCATION_MOMENTS_M5_M10;
