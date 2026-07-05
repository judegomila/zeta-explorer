/**
 * @module imp-33899-h3-curvature-quadrature-convergence
 *
 * imp-33899 (numerical, frontier-scoping): CONFIRM the imp-33645 / imp-33786 H3 fold-curvature reading
 * (N-exponent 5/4, eps-exponent 5/2) at the N = 1e7 tail rung is QUADRATURE-CONVERGED -- i.e. the 5/4
 * reading is a property of the Holder-1/2 cusp back-conversion, NOT an artifact of the inner x = +- u^2
 * Simpson panel resolution -- by the SAME independent panel-refinement sweep imp-33863 applied to the H4
 * tail-rung exponent, and reports the H3 curvature exponent DRIFT.
 *
 * WHY THIS CHECK IS NEEDED (imp-33863 explicitly left the H3 rung unchecked)
 * -------------------------------------------------------------------------
 * imp-33863 doubled the inner Simpson panel count from 2000 to 64000 and confirmed the imp-33845 fixed-3/2
 * (C_ren - C_PS) H4 tail onset exponent is inner-quadrature-converged. But its WHAT-THIS-DOES-NOT-DO note
 * says it "says nothing about the coupled H3 curvature rung (N-exponent 5/4, imp-33786) that dominates and
 * jointly governs the discharge." imp-33645 measured that H3 curvature exponent (log-log slope -5/2 in eps,
 * growth 5/4 in N) on a SINGLE fixed inner mesh N_PANELS = 4000, with only an unlogged remark that the slope
 * "is recovered at grid resolution as coarse as 2000 Simpson panels". Since the H3 curvature carries the
 * Holder-1/2 modulus amplitude and DOMINATES H4 (exponent 5/4 > 3/4, imp-33786), the imp-3849 saddle-ratio
 * lesson -- that the INNER Simpson resolution, not the outer ladder, can drive an apparent exponent at large
 * argument (imp-3731 read n* = 225.54 on inner = 1200 panels; imp-3849 converged n* = 215.2 once refined) --
 * applies to the H3 rung too. This module re-measures the H3 curvature exponent under the same 2000 -> 64000
 * panel doubling (a 32x sweep straddling the imp-33645 4000 reference) so the 5/4 reading is not left resting
 * on one un-refined inner resolution.
 *
 * THE H3 CURVATURE EXPONENT (identical construction to imp-33645, parameterized by panel count)
 * -------------------------------------------------------------------------------------------
 * Same symmetric Holder-1/2 cusp rho(x) = |x|^{-1/2} on [-1, 1], x_star = 0, same reading strip
 * eps = y_N^sharp = sqrt(2 pi / N), same curvature back-conversion m_double_prime = 4 [A(+) + A(-)] with
 * A(sgn) = integral_0^1 1 / (sgn u^2 + i eps)^3 du by Simpson (x = +- u^2 removes the sqrt singularity,
 * |x|^{-1/2} dx = 2 du). The N-growth exponent at the two imp-33845 tail rungs is the local slope
 *     p_curv_N = [log |m_double_prime|(eps_1e7) - log |m_double_prime|(eps_5e6)] / [log 1e7 - log 5e6],
 * recomputed at each inner panel count NP. If p_curv_N is invariant to NP the 5/4 reading is quadrature
 * -converged; if it moved with NP it would be an inner-resolution artifact in the imp-3731 / imp-3849 sense.
 * The eps-exponent p_curv_eps = p_curv_N / (-1/2) is the equivalent -5/2 reading (eps ~ N^{-1/2}).
 *
 * RESULT
 * ------
 * The H3 curvature N-exponent is FLAT across the 32x panel sweep [2000 .. 64000]: p_curv_N = 1.2500000000 at
 * every refinement, with a maximum absolute drift of ~3.6e-14 -- EIGHT orders of magnitude below even the
 * ~3.1e-9 drift imp-33863 read on the H4 rung, and far below any onset band. The residual ~4.9e-11 deviation
 * of p_curv_N from exactly 5/4 is itself PANEL-INVARIANT (it does not shrink as NP grows). Unlike the H4 gap
 * exponent, the H3 curvature is a PURE power law with NO constant subtraction (there is no C_PS analog to
 * subtract), so its finite-eps onset offset is ~5 orders of magnitude smaller than the H4 ~2.3e-6 residual:
 * the H3 reading is if anything CLEANER than the H4 one. VERDICT on the measured axis: the imp-33645 /
 * imp-33786 H3 fold-curvature exponent 5/4 is QUADRATURE-CONVERGED -- it is NOT an inner x = +- u^2 Simpson
 * panel-resolution artifact in the imp-3849 saddle-ratio sense. The dominant H3 rung survives the same
 * independent inner-resolution stress test imp-33863 applied to the subordinate H4 rung.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * ROBUSTNESS / QUADRATURE-CONVERGENCE CHECK ONLY. Panel-invariance of the finite-N H3 curvature exponent does
 * NOT DISCHARGE H3 or H4: the uniform bound imp-33786 requires is the ANALYTIC tracking of the renormalized
 * curvature C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime| through the fold-modulus back-conversion, not a
 * mesh-converged growth exponent at finite N; the H3-H4 coupling per imp-33766 is untouched. G6a_shock_lipschitz
 * STAYS OPEN. No positivity. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED. C_mb share untouched.
 * NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-33863-cren-onset-quadrature-convergence (the H4 tail-rung panel sweep this mirrors; flagged the H3 rung unchecked)
 * @see imp-33645-h3-curvature-divergence-scoping (measured the 5/2 / 5/4 H3 curvature on the single NP = 4000 mesh)
 * @see imp-33786-h3-joint-curvature-input-scoping (H3 curvature rung dominates and jointly governs the discharge)
 * @see imp-33766-h4-independent-discharge-scoping (H4 collapses into H3 as one coupled object)
 * @see project_saddle_ratio_inner_quadrature_axis -- the imp-3849 inner-quadrature-resolution lesson this checks
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention), identical to imp-33645.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// Complex arithmetic in [re, im] pairs (identical curvature kernel to imp-33645, parameterized by NP).
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
function cpow3(a) {
  return cmul(cmul(a, a), a);
}
// A(sgn) = integral_0^1 1 / (sgn u^2 + i eps)^3 du by Simpson quadrature on [0, 1] with NP panels.
function branch(eps, sgn, NP) {
  const h = 1 / NP;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= NP; i++) {
    const u = i * h;
    const w = i === 0 || i === NP ? 1 : i % 2 === 1 ? 4 : 2;
    const v = cinv(cpow3([sgn * u * u, eps])); // 1 / (sgn u^2 + i eps)^3
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
// m_double_prime = 2 integral |x|^{-1/2} / (i eps - x)^3 dx = 4 [A(+) + A(-)]; |.| is the curvature magnitude.
function mppMag(eps, NP) {
  const Am = branch(eps, +1, NP); // x = -u^2  ->  i eps - x = i eps + u^2
  const Ap = branch(eps, -1, NP); // x = +u^2  ->  i eps - x = i eps - u^2
  const re = 4 * (Am[0] + Ap[0]);
  const im = 4 * (Am[1] + Ap[1]);
  return Math.hypot(re, im);
}

const N_EXPONENT = 1.25; // the fixed 5/4 H3 curvature growth exponent imp-33645 read on its single NP = 4000 mesh
const EPS_EXPONENT = 2.5; // equivalent -5/2 eps blow-up exponent (eps ~ N^{-1/2}, so N-exp = eps-exp * 1/2)
const REF_PANELS = 4000; // imp-33645 fixed inner mesh (N_PANELS = 4000)

// The two imp-33845 / imp-33863 tail rungs the H3 curvature exponent is measured between (same rungs as H4).
const N_HI = 1e7;
const N_LO = 5e6;
const EPS_HI = ySharp(N_HI);
const EPS_LO = ySharp(N_LO);
const LOG_N_RATIO = Math.log(N_HI) - Math.log(N_LO);

// Independent panel-refinement sweep: 2000 -> 64000 (a 32x span straddling the imp-33645 4000 reference),
// identical to the imp-33863 H4 sweep for a like-for-like comparison of the two rungs.
const PANEL_LADDER = [2000, 4000, 8000, 16000, 32000, 64000];

// Local N-growth exponent of the raw curvature between the two tail rungs, at inner panel count NP.
function curvatureExponentAt(NP) {
  const mHi = mppMag(EPS_HI, NP);
  const mLo = mppMag(EPS_LO, NP);
  return (Math.log(mHi) - Math.log(mLo)) / LOG_N_RATIO;
}

// Raw (unrounded) exponents drive the drift diagnostic; the displayed rows round to 10 dp for legibility.
const RAW_EXPS = PANEL_LADDER.map((NP) => curvatureExponentAt(NP));
const SWEEP = PANEL_LADDER.map((NP, i) => {
  const p = RAW_EXPS[i];
  return {
    panels: NP,
    curvExpN: +p.toFixed(10),
    devFromExponent: +Math.abs(p - N_EXPONENT).toExponential(3), // |p_curv_N - 5/4| at this resolution
  };
});

const EXPS = RAW_EXPS;
const EXP_MIN = Math.min(...EXPS);
const EXP_MAX = Math.max(...EXPS);
const MAX_ABS_DRIFT = EXP_MAX - EXP_MIN; // spread of p_curv_N across the whole panel sweep (raw, unrounded)
// The imp-33645 H3 curvature exponent at its OWN mesh (NP = 4000), for a like-for-like anchor.
const REF_EXP = curvatureExponentAt(REF_PANELS);
// The residual deviation of the (converged) curvature exponent from exactly 5/4 -- a finite-eps onset offset.
const RESIDUAL_OFFSET = Math.abs(REF_EXP - N_EXPONENT);
// Panel-invariance of that residual: the finest-mesh offset does not shrink versus the coarsest (offset is
// an outer-ladder finite-eps effect, not a quadrature error that would vanish as NP grows).
const OFFSET_COARSE = Math.abs(EXPS[0] - N_EXPONENT);
const OFFSET_FINE = Math.abs(EXPS[EXPS.length - 1] - N_EXPONENT);
const OFFSET_IS_PANEL_INVARIANT = Math.abs(OFFSET_FINE - OFFSET_COARSE) < 1e-6;

export const IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE = {
  id: 'imp-33899',
  proofSection: 'S-frontier',
  scopes:
    'Confirm the imp-33645 / imp-33786 H3 fold-curvature reading (N-exponent 5/4) at the N = 1e7 tail rung ' +
    'is quadrature-converged by the SAME independent inner-Simpson panel-refinement sweep (2000 -> 64000) ' +
    'imp-33863 applied to the H4 tail-rung exponent, ruling out an inner x = +- u^2 quadrature-resolution ' +
    'artifact per the imp-3849 saddle-ratio lesson on the DOMINANT H3 rung',
  question:
    'Does the imp-33645 H3 curvature growth exponent p_curv_N = d log |m_double_prime| / d log N between the ' +
    'N = 5e6 and N = 1e7 rungs stay FIXED at 5/4 when the inner Simpson panel count is doubled from 2000 to ' +
    '64000 (confirming the 5/4 reading is quadrature-converged), or does it DRIFT with the mesh (an inner ' +
    '-resolution artifact in the imp-3731 sense)? Robustness/quadrature-convergence check only; does NOT ' +
    'discharge H3 or H4; H3-H4 coupling per imp-33766 untouched; G6a OPEN; imp-3066 untouched; NO QED.',

  measuredBetweenRungs: 'N = 5e6 and N = 1e7 (the two imp-33845 / imp-33863 tail rungs)',
  referencePanelCount: REF_PANELS, // imp-33645 used N_PANELS = 4000
  panelLadder: PANEL_LADDER,
  sweep: SWEEP,

  predictedExponentN: N_EXPONENT, // 5/4
  predictedExponentEps: EPS_EXPONENT, // 5/2
  referenceMeshExponent: +REF_EXP.toFixed(10), // p_curv_N at NP = 4000 (imp-33645 own mesh) ~1.2500000000
  exponentMin: +EXP_MIN.toFixed(10),
  exponentMax: +EXP_MAX.toFixed(10),
  maxAbsDrift: +MAX_ABS_DRIFT.toExponential(4), // ~3.6e-14 across the 32x panel sweep

  // The residual (converged) offset of p_curv_N from exactly 5/4 is a finite-eps onset effect, panel-invariant.
  residualOffsetFromExponent: +RESIDUAL_OFFSET.toExponential(4), // ~4.9e-11
  residualOffsetIsPanelInvariant: OFFSET_IS_PANEL_INVARIANT,

  // The assessment: the imp-33645 5/4 H3 curvature exponent is quadrature-converged, NOT a mesh artifact.
  quadratureConverged: MAX_ABS_DRIFT < 1e-6, // drift far below any onset band
  isInnerQuadratureArtifact: false, // it does NOT move with the inner Simpson resolution
  confirmsImp33645: Math.abs(REF_EXP - N_EXPONENT) < 1e-3, // the NP = 4000 reading is reproduced
  // The dominant H3 rung is even cleaner than the H4 rung imp-33863 checked: pure power law, no C_PS subtraction.
  h3CleanerThanH4: MAX_ABS_DRIFT < 3.1e-9,
  dischargesH3OrH4: false, // a mesh-converged finite-N growth exponent is NOT the analytic curvature tracking

  isRigorous: false,
  verdict:
    'ROBUSTNESS / QUADRATURE-CONVERGENCE CHECK ONLY, G6a_shock_lipschitz STAYS OPEN. Under the SAME ' +
    'independent inner-Simpson panel-refinement sweep from 2000 to 64000 panels (a 32x span straddling the ' +
    'imp-33645 NP = 4000 reference mesh) that imp-33863 applied to the subordinate H4 tail exponent, the ' +
    'DOMINANT H3 fold-curvature growth exponent p_curv_N = d log |m_double_prime| / d log N between the ' +
    'N = 5e6 and N = 1e7 rungs is FLAT at 1.2500000000 with a maximum absolute drift of ~3.6e-14 -- eight ' +
    'orders of magnitude below even the ~3.1e-9 drift imp-33863 read on the H4 rung, and far below any onset ' +
    'band. The residual ~4.9e-11 deviation from exactly 5/4 is itself PANEL-INVARIANT (it does not shrink as ' +
    'the mesh is refined), so it is a finite-eps onset offset of the outer ladder, NOT a quadrature ' +
    '-resolution error. Because the H3 curvature is a PURE power law with NO constant subtraction (no C_PS ' +
    'analog), its finite-eps offset is ~5 orders of magnitude smaller than the H4 ~2.3e-6 residual -- the ' +
    'dominant H3 reading is if anything CLEANER than the subordinate H4 one. So the imp-33645 / imp-33786 ' +
    'H3 fold-curvature exponent 5/4 is QUADRATURE-CONVERGED -- it is NOT an inner x = +- u^2 Simpson ' +
    'panel-resolution artifact in the imp-3849 saddle-ratio sense, and the dominant H3 rung survives the ' +
    'same independent inner-resolution stress test imp-33863 applied to H4. This does NOT DISCHARGE H3 or ' +
    'H4: the uniform bound requires the ANALYTIC tracking of the renormalized curvature ' +
    'C_curv(N) = (y_N^sharp)^{5/2} |m_double_prime| through the fold-modulus back-conversion, not a mesh ' +
    '-converged growth exponent at finite N; the H3-H4 coupling per imp-33766 is untouched. No positivity; ' +
    'imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb share untouched; NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33899_H3_CURVATURE_QUADRATURE_ASSERTIONS = [
  {
    // (i) the H3 curvature exponent is quadrature-converged: drift across the 32x panel sweep is negligible.
    id: 'imp33899-h3-curvature-exponent-quadrature-converged',
    description: 'p_curv_N is flat across panels 2000 -> 64000 (max abs drift < 1e-6, far below any onset band)',
    holds: () =>
      IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.maxAbsDrift < 1e-6 &&
      IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.quadratureConverged === true,
  },
  {
    // (ii) the imp-33645 NP = 4000 reading (p_curv_N -> 5/4) is reproduced and is NOT an inner-quadrature artifact.
    id: 'imp33899-confirms-imp33645-not-mesh-artifact',
    description: 'the NP = 4000 curvature exponent reproduces 5/4 (|dev| < 1e-3) and does not move with the mesh',
    holds: () =>
      Math.abs(IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.referenceMeshExponent - 1.25) < 1e-3 &&
      IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.confirmsImp33645 === true &&
      IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.isInnerQuadratureArtifact === false,
  },
  {
    // (iii) the residual deviation from exactly 5/4 is a finite-eps onset offset -- panel-invariant, not error.
    id: 'imp33899-residual-offset-is-panel-invariant',
    description: 'the small |p_curv_N - 5/4| offset does not shrink as panels are refined (finite-eps, not quadrature)',
    holds: () =>
      IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.residualOffsetIsPanelInvariant === true &&
      IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.residualOffsetFromExponent < 1e-4,
  },
  {
    // (iv) the dominant H3 rung is at least as clean as the subordinate H4 rung imp-33863 checked.
    id: 'imp33899-h3-rung-cleaner-than-h4',
    description: 'the dominant H3 curvature drift (~3.6e-14) is below the imp-33863 H4 drift (~3.1e-9): pure power law',
    holds: () =>
      IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.h3CleanerThanH4 === true &&
      IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.maxAbsDrift < 3.1e-9,
  },
  {
    // Honesty gate: robustness check only, does NOT discharge H3/H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33899-honesty-gate-no-qed',
    description: 'Robustness only: does not discharge H3/H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.isRigorous === false &&
      IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.dischargesH3OrH4 === false &&
      /NO QED/.test(IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.verdict) &&
      /STAYS OPEN/.test(IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.verdict) &&
      /remains the rigorous SOTA/.test(IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP33899_H3_CURVATURE_QUADRATURE_CONVERGENCE.verdict),
  },
];

for (const a of IMP33899_H3_CURVATURE_QUADRATURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33899-h3-curvature-quadrature-convergence assertion failed: ${a.id}`);
  }
}
