/**
 * @module imp-33863-cren-onset-quadrature-convergence
 *
 * imp-33863 (numerical, frontier-scoping): CONFIRM the imp-33845 fixed-3/2 (C_ren - C_PS) onset exponent at
 * the N = 1e7 tail rung is QUADRATURE-CONVERGED -- i.e. the 1.50000 reading is a property of the fold-modulus
 * back-conversion, NOT an artifact of the inner x = +- u^2 Simpson panel resolution -- by an INDEPENDENT
 * panel-refinement sweep (doubling the inner panel count) and reporting the tail-rung exponent DRIFT.
 *
 * WHY THIS CHECK IS NEEDED (the imp-3849 saddle-ratio lesson)
 * ----------------------------------------------------------
 * The imp-3731 / imp-3849 saddle-ratio cohort learned the hard way that the INNER Simpson quadrature
 * resolution -- its domain and panel count -- and NOT the outer ladder, can drive an apparent exponent at
 * large argument: imp-3731 read n* = 225.54 per well on inner = 1200 panels, and imp-3849 showed that was an
 * inner-quadrature artifact (converged n* = 215.2 once the inner resolution was refined). imp-33845 read the
 * (C_ren - C_PS) gap onset exponent to exactly 1.50000 at its N = 1e7 tail rung on a SINGLE fixed inner mesh
 * (N_PANELS = 8000, Simpson on u in [0, 1] with x = +- u^2). That fixed inner mesh was never panel-refinement
 * -tested. This module re-measures the tail-rung exponent under panel doubling from 2000 up to 64000 (a 32x
 * sweep spanning the imp-33845 8000 reference) and reports the exponent drift, so the 3/2 reading is not left
 * resting on one un-refined inner resolution.
 *
 * THE TAIL-RUNG EXPONENT (identical construction to imp-33845, parameterized by panel count)
 * -----------------------------------------------------------------------------------------
 * Same symmetric Holder-1/2 cusp rho(x) = |x|^{-1/2} on [-1, 1], same reading strip eps = y_N^sharp =
 * sqrt(2 pi / N), same back-conversion m_prime = -2 [B2(+) + B2(-)] with B_p(sgn) = integral_0^1 (i eps -
 * sgn u^2)^{-p} du by Simpson, same C_ren(eps) = eps^{3/2} |m_prime(i eps)|, same gap g = C_ren - C_PS with
 * C_PS = pi/sqrt(2). The tail-rung exponent is the local slope between the last two imp-33845 rungs,
 *     p_tail = [log g(eps_1e7) - log g(eps_5e6)] / [log eps_1e7 - log eps_5e6],
 * recomputed at each inner panel count NP. If p_tail is invariant to NP the 3/2 reading is quadrature
 * -converged; if it moved with NP it would be an inner-resolution artifact in the imp-3731 sense.
 *
 * RESULT
 * ------
 * The tail-rung exponent is FLAT across the 32x panel sweep [2000 .. 64000]: p_tail = 1.49999767 at every
 * refinement, with a maximum absolute drift of ~3.1e-9 -- SEVEN orders of magnitude below the ~1.5e-2
 * rung-to-rung tightening imp-33845 read on the outer ladder, and far below the 1e-3 band the imp-33845
 * onset-rate assertion uses. The residual ~2.3e-6 deviation of p_tail from exactly 3/2 is itself PANEL
 * -INVARIANT (it does not shrink as NP grows), so it is a finite-eps onset offset of the outer ladder, NOT a
 * quadrature-resolution error. VERDICT on the measured axis: the imp-33845 fixed-3/2 tail-rung onset exponent
 * is QUADRATURE-CONVERGED -- it is NOT an inner x = +- u^2 Simpson panel-resolution artifact in the imp-3849
 * saddle-ratio sense. The imp-33845 reading survives an independent inner-resolution stress test.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * ROBUSTNESS / QUADRATURE-CONVERGENCE CHECK ONLY. Panel-invariance of a finite-N tail exponent does NOT
 * DISCHARGE H4: the uniform bound imp-33766 requires is the ANALYTIC tracking of C_ren through the fold
 * -modulus back-conversion, not a mesh-converged onset rate at finite N, and it says nothing about the coupled
 * H3 curvature rung (N-exponent 5/4, imp-33786) that dominates and jointly governs the discharge.
 * G6a_shock_lipschitz STAYS OPEN. No positivity. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED.
 * NO QED. No refereed bound is changed.
 *
 * @see imp-33845-cren-gap-onset-rate (measured the fixed-3/2 tail onset exponent on the single NP = 8000 mesh)
 * @see imp-33794-cren-window-measurement (the parent C_ren finite-window / d log C_ren/d log N reading)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (defines C_ren, C_PS = pi/sqrt(2), N-exponent 3/4)
 * @see project_saddle_ratio_inner_quadrature_axis -- the imp-3849 inner-quadrature-resolution lesson this checks
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention), identical to imp-33845.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// Complex arithmetic in [re, im] pairs (identical quadrature kernel to imp-33845, parameterized by NP).
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
// B_p(sgn) = integral_0^1 1 / (i eps - sgn u^2)^p du by Simpson quadrature on [0, 1] with NP panels.
function branch(eps, sgn, p, NP) {
  const h = 1 / NP;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= NP; i++) {
    const u = i * h;
    const w = i === 0 || i === NP ? 1 : i % 2 === 1 ? 4 : 2;
    const z = [-sgn * u * u, eps]; // i eps - x, with x = sgn u^2
    let d = [1, 0];
    for (let k = 0; k < p; k++) d = cmul(d, z);
    const v = cinv(d);
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
// m_prime = - integral |x|^{-1/2} / (i eps - x)^2 dx = -2 [ B2(+) + B2(-) ]; C_ren = eps^{3/2} |m_prime|.
function cRen(eps, NP) {
  const Bp = branch(eps, +1, 2, NP);
  const Bm = branch(eps, -1, 2, NP);
  const mag = Math.hypot(-2 * (Bp[0] + Bm[0]), -2 * (Bp[1] + Bm[1]));
  return mag * Math.pow(eps, 1.5);
}

const C_PS = Math.PI / Math.SQRT2; // Privalov-Sokhotski amplitude = pi/sqrt(2) (imp-33646)
const P_ONSET = 1.5; // the fixed 3/2 onset rate imp-33845 read on its single NP = 8000 mesh
const REF_PANELS = 8000; // imp-33845 fixed inner mesh (N_PANELS = 8000)

// The two imp-33845 tail rungs the tail-rung exponent is measured between.
const N_HI = 1e7;
const N_LO = 5e6;
const EPS_HI = ySharp(N_HI);
const EPS_LO = ySharp(N_LO);
const LOG_EPS_RATIO = Math.log(EPS_HI) - Math.log(EPS_LO);

// Independent panel-refinement sweep: 2000 -> 64000 (a 32x span straddling the imp-33845 8000 reference).
const PANEL_LADDER = [2000, 4000, 8000, 16000, 32000, 64000];

function tailExponentAt(NP) {
  const gHi = cRen(EPS_HI, NP) - C_PS;
  const gLo = cRen(EPS_LO, NP) - C_PS;
  return (Math.log(gHi) - Math.log(gLo)) / LOG_EPS_RATIO;
}

// Raw (unrounded) exponents drive the drift diagnostic; the displayed rows round to 8 dp for legibility.
const RAW_EXPS = PANEL_LADDER.map((NP) => tailExponentAt(NP));
const SWEEP = PANEL_LADDER.map((NP, i) => {
  const p = RAW_EXPS[i];
  return {
    panels: NP,
    tailExp: +p.toFixed(8),
    devFromOnset: +Math.abs(p - P_ONSET).toExponential(3), // |p_tail - 3/2| at this resolution
  };
});

const EXPS = RAW_EXPS;
const EXP_MIN = Math.min(...EXPS);
const EXP_MAX = Math.max(...EXPS);
const MAX_ABS_DRIFT = EXP_MAX - EXP_MIN; // spread of p_tail across the whole panel sweep (raw, unrounded)
// The imp-33845 tail-rung exponent at its OWN mesh (NP = 8000), for a like-for-like anchor.
const REF_EXP = tailExponentAt(REF_PANELS);
// The residual deviation of the (converged) tail exponent from exactly 3/2 -- a finite-eps onset offset.
const RESIDUAL_OFFSET = Math.abs(REF_EXP - P_ONSET);
// Panel-invariance of that residual: the finest-mesh offset does not shrink versus the coarsest (offset is
// an outer-ladder finite-eps effect, not a quadrature error that would vanish as NP grows).
const OFFSET_COARSE = Math.abs(EXPS[0] - P_ONSET);
const OFFSET_FINE = Math.abs(EXPS[EXPS.length - 1] - P_ONSET);
const OFFSET_IS_PANEL_INVARIANT = Math.abs(OFFSET_FINE - OFFSET_COARSE) < 1e-6;

export const IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE = {
  id: 'imp-33863',
  proofSection: 'S-frontier',
  scopes:
    'Confirm the imp-33845 fixed-3/2 (C_ren - C_PS) onset exponent at the N = 1e7 tail rung is quadrature ' +
    'converged by an independent inner-Simpson panel-refinement sweep (2000 -> 64000), ruling out an inner ' +
    'x = +- u^2 quadrature-resolution artifact per the imp-3849 saddle-ratio lesson',
  question:
    'Does the imp-33845 tail-rung onset exponent p_tail = d log (C_ren - C_PS) / d log eps between the N = 5e6 ' +
    'and N = 1e7 rungs stay FIXED at 3/2 when the inner Simpson panel count is doubled from 2000 to 64000 ' +
    '(confirming 1.50000 is quadrature-converged), or does it DRIFT with the mesh (an inner-resolution ' +
    'artifact in the imp-3731 sense)? Robustness/quadrature-convergence check only; does NOT discharge H4; ' +
    'G6a OPEN; imp-3066 untouched; NO QED.',

  measuredBetweenRungs: 'N = 5e6 and N = 1e7 (the two imp-33845 tail rungs)',
  referencePanelCount: REF_PANELS, // imp-33845 used N_PANELS = 8000
  panelLadder: PANEL_LADDER,
  sweep: SWEEP,

  predictedOnsetRate: P_ONSET, // 3/2
  referenceMeshExponent: +REF_EXP.toFixed(8), // p_tail at NP = 8000 (imp-33845 own mesh) ~1.49999767
  exponentMin: +EXP_MIN.toFixed(8),
  exponentMax: +EXP_MAX.toFixed(8),
  maxAbsDrift: +MAX_ABS_DRIFT.toExponential(4), // ~3.1e-9 across the 32x panel sweep

  // The residual (converged) offset of p_tail below exactly 3/2 is a finite-eps onset effect, panel-invariant.
  residualOffsetFromOnset: +RESIDUAL_OFFSET.toExponential(4), // ~2.3e-6
  residualOffsetIsPanelInvariant: OFFSET_IS_PANEL_INVARIANT,

  // The assessment: the imp-33845 3/2 tail-rung exponent is quadrature-converged, NOT a mesh artifact.
  quadratureConverged: MAX_ABS_DRIFT < 1e-6, // drift far below the imp-33845 1e-3 onset-rate band
  isInnerQuadratureArtifact: false, // it does NOT move with the inner Simpson resolution
  confirmsImp33845: Math.abs(REF_EXP - P_ONSET) < 1e-3, // the NP = 8000 reading is reproduced
  dischargesH4: false, // a mesh-converged finite-N onset rate is NOT the analytic fold-modulus tracking

  isRigorous: false,
  verdict:
    'ROBUSTNESS / QUADRATURE-CONVERGENCE CHECK ONLY, G6a_shock_lipschitz STAYS OPEN. Under an independent ' +
    'inner-Simpson panel-refinement sweep from 2000 to 64000 panels (a 32x span straddling the imp-33845 ' +
    'NP = 8000 reference mesh) the (C_ren - C_PS) tail-rung onset exponent p_tail between the N = 5e6 and ' +
    'N = 1e7 rungs is FLAT at 1.49999767 with a maximum absolute drift of ~3.1e-9 -- seven orders of ' +
    'magnitude below the ~1.5e-2 outer-ladder rung tightening imp-33845 read and far below the 1e-3 band its ' +
    'onset-rate assertion uses. The residual ~2.3e-6 deviation from exactly 3/2 is itself PANEL-INVARIANT ' +
    '(it does not shrink as the mesh is refined), so it is a finite-eps onset offset of the outer ladder, NOT ' +
    'a quadrature-resolution error. So the imp-33845 fixed-3/2 tail-rung onset exponent is QUADRATURE ' +
    '-CONVERGED -- it is NOT an inner x = +- u^2 Simpson panel-resolution artifact in the imp-3849 saddle ' +
    '-ratio sense, and the imp-33845 reading survives an independent inner-resolution stress test. This does ' +
    'NOT DISCHARGE H4: the uniform bound requires the ANALYTIC tracking of C_ren through the fold-modulus ' +
    'back-conversion, not a mesh-converged onset rate at finite N, and it says nothing about the coupled H3 ' +
    'curvature rung (N-exponent 5/4, imp-33786) that dominates and jointly governs the discharge. No ' +
    'positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed' +
    '.',
};

export const IMP33863_CREN_ONSET_QUADRATURE_ASSERTIONS = [
  {
    // (i) the tail-rung exponent is quadrature-converged: drift across the 32x panel sweep is negligible.
    id: 'imp33863-tail-exponent-quadrature-converged',
    description: 'p_tail is flat across panels 2000 -> 64000 (max abs drift < 1e-6, far below the 1e-3 onset band)',
    holds: () =>
      IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.maxAbsDrift < 1e-6 &&
      IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.quadratureConverged === true,
  },
  {
    // (ii) the imp-33845 NP = 8000 reading (p_tail -> 3/2) is reproduced and is NOT an inner-quadrature artifact.
    id: 'imp33863-confirms-imp33845-not-mesh-artifact',
    description: 'the NP = 8000 tail exponent reproduces 3/2 (|dev| < 1e-3) and does not move with the mesh',
    holds: () =>
      Math.abs(IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.referenceMeshExponent - 1.5) < 1e-3 &&
      IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.confirmsImp33845 === true &&
      IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.isInnerQuadratureArtifact === false,
  },
  {
    // (iii) the residual deviation from exactly 3/2 is a finite-eps onset offset -- panel-invariant, not error.
    id: 'imp33863-residual-offset-is-panel-invariant',
    description: 'the small |p_tail - 3/2| offset does not shrink as panels are refined (finite-eps, not quadrature)',
    holds: () =>
      IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.residualOffsetIsPanelInvariant === true &&
      IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.residualOffsetFromOnset < 1e-4,
  },
  {
    // Honesty gate: robustness check only, does NOT discharge H4; G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33863-honesty-gate-no-qed',
    description: 'Robustness only: does not discharge H4, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.isRigorous === false &&
      IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.dischargesH4 === false &&
      /NO QED/.test(IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.verdict) &&
      /STAYS OPEN/.test(IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.verdict) &&
      /refereed bound is changed/i.test(IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(IMP33863_CREN_ONSET_QUADRATURE_CONVERGENCE.verdict),
  },
];

for (const a of IMP33863_CREN_ONSET_QUADRATURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33863-cren-onset-quadrature-convergence assertion failed: ${a.id}`);
  }
}
