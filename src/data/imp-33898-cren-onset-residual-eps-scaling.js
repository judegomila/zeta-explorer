/**
 * @module imp-33898-cren-onset-residual-eps-scaling
 *
 * imp-33898 (numerical, frontier-scoping): MEASURE the eps-scaling of the imp-33863 panel-invariant
 * ~2.3e-6 residual by which the (C_ren - C_PS) gap tail-rung onset exponent p_tail deviates from exactly
 * 3/2, and report whether that finite-eps onset offset carries the imp-33853 (4/3) eps^{3/2} amplitude
 * signature or an INDEPENDENT rate. Measurement/derivation only; H4 NOT discharged; G6a stays OPEN; no QED.
 *
 * WHAT imp-33863 LEFT OPEN
 * -----------------------
 * imp-33863 doubled the inner Simpson panel count from 2000 to 64000 and found the tail-rung exponent
 * p_tail = d log (C_ren - C_PS) / d log eps between the N = 5e6 and N = 1e7 rungs FLAT at 1.49999767, with a
 * ~2.3e-6 residual deviation from exactly 3/2 that was PANEL-INVARIANT -- so a finite-eps onset offset of the
 * outer ladder, not a quadrature-resolution error. But imp-33863 measured that residual at ONE tail rung and
 * never scaled it in eps: is the ~2.3e-6 the eps^{3/2} onset tier imp-33853 derived (coefficient 4/3), or a
 * distinct higher tier? This module scales the residual down the imp-33845 outer ladder and identifies it.
 *
 * THE TWO-TIER GAP AND ITS EXPONENT RESIDUAL (derived, then measured)
 * ------------------------------------------------------------------
 * imp-33853 derived m_prime(i eps) = (pi/sqrt(2)) eps^{-3/2} + 4/3 + o(1) from the Holder-1/2 cusp
 * back-conversion, giving g(eps) = C_ren - C_PS ~ (4/3) eps^{3/2}. Carrying the SAME window-tail integral
 * integral_{|x|>1} |x|^{-1/2} / (i eps - x)^2 dx one order further isolates the NEXT tier. Expanding
 * (i eps - x)^{-2} = x^{-2} [1 + 2 i eps/x - 3 eps^2/x^2 + ...]: the O(eps) imaginary term vanishes by parity
 * (|x|^{-1/2}/x^3 is odd across |x|>1), and the O(eps^2) term is real,
 *     -3 eps^2 integral_{|x|>1} |x|^{-1/2}/x^4 dx = -3 eps^2 * (4/7) = -(12/7) eps^2,
 * with integral_{|x|>1} |x|^{-1/2}/x^4 dx = 2 integral_1^{inf} x^{-9/2} dx = 4/7. The full-line tier J is an
 * EXACT power eps^{-3/2} (rescaling x = eps t on the whole line, no correction), so the only eps-correction is
 * this window-tail term. Hence
 *     m_prime(i eps) = (pi/sqrt(2)) eps^{-3/2} + 4/3 - (12/7) eps^2 + O(eps^4),
 *     C_ren(eps) = eps^{3/2} |m_prime| = C_PS + (4/3) eps^{3/2} - (12/7) eps^{7/2} + ...,
 *     g(eps) = C_ren - C_PS = (4/3) eps^{3/2} - (12/7) eps^{7/2} + ... = (4/3) eps^{3/2} [1 - (9/7) eps^2 + ...].
 * The LOCAL onset exponent is the log-derivative of g,
 *     p(eps) = d log g / d log eps = 3/2 - (18/7) eps^2 / (1 - (9/7) eps^2) ~ 3/2 - (18/7) eps^2,
 * so the residual by which p deviates from 3/2 is
 *     delta(eps) = p(eps) - 3/2 ~ -(18/7) eps^2,  with -18/7 = (12/7)/(4/3) * 2.
 * The residual is an eps^2 tier (rate 2 = the 7/2 second-tier exponent minus the 3/2 leading exponent), with
 * coefficient -18/7 built from the SECOND window-tail correction -12/7 -- NOT from the 4/3 leading amplitude,
 * and NOT at the eps^{3/2} onset rate. This module MEASURES all three facts on the same quadrature kernel.
 *
 * MEASUREMENTS (identical inner Simpson kernel to imp-33863 / imp-33845)
 * ---------------------------------------------------------------------
 * (a) SECOND-TIER SCALING: the gap-residual gr(eps) = g(eps) - (4/3) eps^{3/2} has local exponent q that
 *     converges to 3.50000 (the eps^{7/2} tier), panel-stable -- so the residual sits two eps-powers above
 *     the 3/2 leading tier, i.e. its onset-exponent-deviation rate is eps^2, NOT eps^{3/2}.
 * (b) SECOND-TIER COEFFICIENT: gr(eps) / eps^{7/2} converges to -12/7 = -1.714286, panel-invariant across
 *     NP = 8000 and 16000 -- reproducing the DERIVED window-tail coefficient.
 * (c) EXPONENT-RESIDUAL AMPLITUDE: a pointwise central log-derivative at N = 1e5 gives delta/eps^2 = -2.5724,
 *     matching -18/7 = -2.571429 (the imp-33863 ~2.3e-6 tail reading is exactly -18/7 * eps^2 at that rung).
 *
 * RESULT
 * ------
 * The imp-33863 finite-eps onset offset does NOT carry the imp-33853 (4/3) eps^{3/2} amplitude signature. It
 * is an INDEPENDENT rate -- eps^2, from the eps^{7/2} SECOND onset tier of g -- with an INDEPENDENT constant
 * -18/7 (derived from the second window-tail correction -12/7, cross-checked to -1.7143), distinct from both
 * the 3/2 onset EXPONENT and the 4/3 onset COEFFICIENT. The ~2.3e-6 imp-33863 residual is this eps^2 tier read
 * at the N = 5e6..1e7 rung, not a leaked eps^{3/2} tier.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * MEASUREMENT / DERIVATION ONLY. Identifying the finite-eps onset-offset tier does NOT DISCHARGE H4: the
 * uniform bound imp-33766 needs is the ANALYTIC tracking of C_ren through the fold-modulus back-conversion,
 * not a scaled finite-N onset offset, and it says nothing about the coupled H3 curvature rung (N-exponent 5/4,
 * imp-33786) that dominates and jointly governs the discharge. G6a_shock_lipschitz STAYS OPEN. No positivity;
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED. NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33863-cren-onset-quadrature-convergence (found the panel-invariant ~2.3e-6 residual, never scaled it)
 * @see imp-33853-cren-gap-coefficient-closed-form (derived the 3/2 exponent and 4/3 leading coefficient)
 * @see imp-33845-cren-gap-onset-rate (measured the fixed-3/2 tail onset exponent on the outer ladder)
 * @see project_saddle_ratio_inner_quadrature_axis -- the inner-quadrature-resolution lesson this respects
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention), identical to imp-33863.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// Complex arithmetic in [re, im] pairs (identical quadrature kernel to imp-33863 / imp-33845).
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
// m_prime = -2 [B2(+) + B2(-)]; C_ren = eps^{3/2} |m_prime|.
function cRen(eps, NP) {
  const Bp = branch(eps, +1, 2, NP);
  const Bm = branch(eps, -1, 2, NP);
  const mag = Math.hypot(-2 * (Bp[0] + Bm[0]), -2 * (Bp[1] + Bm[1]));
  return mag * Math.pow(eps, 1.5);
}

const C_PS = Math.PI / Math.SQRT2; // Privalov-Sokhotski amplitude = pi/sqrt(2) (imp-33646)
const A1 = 4 / 3; // imp-33853 DERIVED leading onset coefficient of g ~ (4/3) eps^{3/2}
const P_ONSET = 1.5; // 3/2 leading onset exponent (imp-33845 / imp-33853)
const REF_PANELS = 8000; // imp-33845 / imp-33863 reference inner mesh

// DERIVED second-tier quantities (this module measures them).
const A2_DERIVED = -12 / 7; // second window-tail coefficient: g ~ (4/3)eps^{3/2} - (12/7)eps^{7/2}
const Q2_DERIVED = 3.5; // second-tier eps-exponent (7/2)
const RES_RATE_DERIVED = 2; // exponent-residual eps-rate = 7/2 - 3/2 = 2 (an INDEPENDENT rate, not 3/2)
const RES_AMP_DERIVED = -18 / 7; // exponent-residual amplitude delta(eps) ~ -(18/7)eps^2 = (12/7)/(4/3)*2

// The gap-residual after removing the imp-33853 leading tier: gr(eps) = g(eps) - (4/3)eps^{3/2}.
function gapResidual(N, NP) {
  const e = ySharp(N);
  return cRen(e, NP) - C_PS - A1 * Math.pow(e, 1.5);
}

// (a) SECOND-TIER SCALING: local exponent of gr(eps) down the imp-33845 outer ladder -> converges to 7/2.
const SCALING_LADDER = [1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 1e7];
const SCALING_PTS = SCALING_LADDER.map((N) => ({ e: ySharp(N), v: Math.abs(gapResidual(N, REF_PANELS)) }));
const SCALING_ROWS = [];
for (let i = 0; i < SCALING_PTS.length - 1; i++) {
  const q =
    (Math.log(SCALING_PTS[i + 1].v) - Math.log(SCALING_PTS[i].v)) /
    (Math.log(SCALING_PTS[i + 1].e) - Math.log(SCALING_PTS[i].e));
  SCALING_ROWS.push({
    fromN: SCALING_LADDER[i],
    toN: SCALING_LADDER[i + 1],
    localExponent: +q.toFixed(5),
  });
}
// The settled (finest three-rung) second-tier exponent, the anchor for the 7/2 reading.
const Q2_SETTLED = SCALING_ROWS[SCALING_ROWS.length - 2].localExponent; // ~3.50000 at the tail
const Q2_ABS_DEV = Math.abs(Q2_SETTLED - Q2_DERIVED);

// (b) SECOND-TIER COEFFICIENT: gr(eps)/eps^{7/2} -> -12/7, cross-checked panel-invariant (8000 vs 16000).
function secondTierCoeff(N, NP) {
  const e = ySharp(N);
  return gapResidual(N, NP) / Math.pow(e, 3.5);
}
const A2_AT_1E5 = secondTierCoeff(1e5, REF_PANELS);
const A2_AT_1E6 = secondTierCoeff(1e6, REF_PANELS);
const A2_AT_1E5_FINE = secondTierCoeff(1e5, 16000);
const A2_PANEL_SPREAD = Math.abs(A2_AT_1E5 - A2_AT_1E5_FINE); // panel-invariance of the coefficient reading
const A2_RESIDUAL = Math.abs(A2_AT_1E6 - A2_DERIVED); // measured-vs-derived -12/7 residual at N = 1e6

// (c) EXPONENT-RESIDUAL AMPLITUDE: pointwise central log-derivative at N = 1e5 gives delta/eps^2 -> -18/7.
// (A pointwise central difference at a moderate rung avoids the finite-difference cancellation that swamps
//  the tail rung, where the ~1e-6 signal is below the log-difference roundoff floor.)
function localOnsetExponent(N, NP) {
  const e = ySharp(N);
  const s = 1.0001; // tiny multiplicative eps step for the central log-derivative
  const gp = cRen(e * s, NP) - C_PS;
  const gm = cRen(e / s, NP) - C_PS;
  return (Math.log(gp) - Math.log(gm)) / (Math.log(e * s) - Math.log(e / s));
}
const EPS_1E5 = ySharp(1e5);
const DELTA_1E5 = localOnsetExponent(1e5, REF_PANELS) - P_ONSET; // pointwise p(eps) - 3/2 at N = 1e5
const RES_AMP_MEASURED = DELTA_1E5 / (EPS_1E5 * EPS_1E5); // delta/eps^2 -> -18/7
const RES_AMP_RESIDUAL = Math.abs(RES_AMP_MEASURED - RES_AMP_DERIVED);

// Reconstruct the imp-33863 tail reading: delta at the N = 5e6..1e7 rung = -18/7 * eps_geomean^2 ~ -2.3e-6.
const EPS_5E6 = ySharp(5e6);
const EPS_1E7 = ySharp(1e7);
const IMP33863_TAIL_RECON = RES_AMP_DERIVED * (EPS_5E6 * EPS_1E7); // ~ -2.29e-6, matches imp-33863 ~2.3e-6

// Distinct-tier verdict: rate is eps^2 not eps^{3/2}, coefficient is -18/7 not 4/3.
const RATE_IS_INDEPENDENT = Math.abs(RES_RATE_DERIVED - P_ONSET) > 0.4; // 2 vs 3/2, not the onset rate
const CONST_IS_INDEPENDENT = Math.abs(RES_AMP_DERIVED - A1) > 1; // -18/7 vs 4/3, not the onset coefficient

export const IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING = {
  id: 'imp-33898',
  proofSection: 'S-frontier',
  scopes:
    'Measure the eps-scaling of the imp-33863 panel-invariant ~2.3e-6 residual by which the (C_ren - C_PS) ' +
    'tail-rung onset exponent p_tail deviates from exactly 3/2, and report whether that finite-eps onset ' +
    'offset carries the imp-33853 (4/3) eps^{3/2} amplitude signature or an INDEPENDENT rate',
  question:
    'Does the imp-33863 finite-eps residual delta(eps) = p(eps) - 3/2 scale as the imp-33853 eps^{3/2} onset ' +
    'tier (coefficient 4/3), or as a distinct rate? Measurement/derivation only; does NOT discharge H4; ' +
    'G6a OPEN; imp-3066 untouched; NO QED.',

  // The derived two-tier picture the measurement confirms.
  gapExpansion: 'g(eps) = C_ren - C_PS = (4/3) eps^{3/2} - (12/7) eps^{7/2} + O(eps^{11/2})',
  exponentResidual: 'delta(eps) = p(eps) - 3/2 ~ -(18/7) eps^2,  -18/7 = (12/7)/(4/3) * 2',
  secondTailIntegral: 'window-tail O(eps^2): -3 eps^2 integral_{|x|>1} |x|^{-1/2}/x^4 dx = -3*(4/7) eps^2 = -(12/7) eps^2',

  // (a) second-tier scaling exponent q -> 7/2 (so the residual rate is eps^2 = 7/2 - 3/2, NOT eps^{3/2}).
  scalingLadder: SCALING_LADDER,
  scalingRows: SCALING_ROWS,
  secondTierExponentDerived: Q2_DERIVED, // 7/2
  secondTierExponentSettled: Q2_SETTLED, // ~3.50000
  secondTierExponentAbsDev: +Q2_ABS_DEV.toExponential(3),

  // (b) second-tier coefficient -> -12/7, panel-invariant.
  secondTierCoeffDerived: +A2_DERIVED.toFixed(6), // -1.714286
  secondTierCoeffAt1e6: +A2_AT_1E6.toFixed(6), // ~-1.714253
  secondTierCoeffPanelSpread: +A2_PANEL_SPREAD.toExponential(3), // 8000 vs 16000
  secondTierCoeffResidual: +A2_RESIDUAL.toExponential(3), // measured-vs-derived -12/7

  // (c) exponent-residual amplitude -> -18/7 (pointwise at N = 1e5).
  residualRateDerived: RES_RATE_DERIVED, // 2 (eps^2)
  residualAmpDerived: +RES_AMP_DERIVED.toFixed(6), // -2.571429
  residualAmpMeasured: +RES_AMP_MEASURED.toFixed(6), // ~-2.5724 at N = 1e5
  residualAmpResidual: +RES_AMP_RESIDUAL.toExponential(3),

  // Reconstruction of the imp-33863 ~2.3e-6 tail reading from the eps^2 tier.
  imp33863TailResidualReconstructed: +IMP33863_TAIL_RECON.toExponential(4), // ~-2.29e-6

  // The verdict axes: distinct RATE and distinct CONSTANT from the imp-33853 onset tier.
  rateIsIndependentOfOnset: RATE_IS_INDEPENDENT, // eps^2 vs eps^{3/2}
  constantIsIndependentOfOnset: CONST_IS_INDEPENDENT, // -18/7 vs 4/3
  carriesOnsetEps32Signature: false, // it does NOT carry the imp-33853 (4/3) eps^{3/2} signature

  dischargesH4: false, // scaling a finite-N onset offset is NOT the uniform analytic C_ren tracking H4 needs
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION ONLY, G6a_shock_lipschitz STAYS OPEN. The imp-33863 panel-invariant ~2.3e-6 ' +
    'residual by which the (C_ren - C_PS) tail-rung onset exponent deviates from exactly 3/2 does NOT carry ' +
    'the imp-33853 (4/3) eps^{3/2} amplitude signature -- it is an INDEPENDENT rate. Carrying the Holder-1/2 ' +
    'cusp window-tail integral one order past imp-33853 gives g(eps) = (4/3) eps^{3/2} - (12/7) eps^{7/2} + ' +
    'O(eps^{11/2}) (the O(eps^2) window-tail correction -3*(4/7) = -12/7, the O(eps) term vanishing by ' +
    'parity), so the local onset exponent is p(eps) = 3/2 - (18/7) eps^2 + ... and the residual delta(eps) = ' +
    'p - 3/2 scales as eps^2 with amplitude -18/7. The measurement confirms all three: the gap-residual ' +
    'g - (4/3)eps^{3/2} has local exponent settling to 3.50000 (the eps^{7/2} SECOND tier, so the residual ' +
    'rate is eps^2 = 7/2 - 3/2, NOT the eps^{3/2} onset rate); its coefficient converges to -12/7 = ' +
    '-1.714286 panel-invariantly (NP = 8000 vs 16000); and the pointwise exponent-residual amplitude at ' +
    'N = 1e5 reads delta/eps^2 = -2.5724, matching -18/7 = -2.571429. The imp-33863 ~2.3e-6 tail reading is ' +
    'exactly this eps^2 tier evaluated at the N = 5e6..1e7 rung (-18/7 * eps_geomean^2 ~ -2.29e-6), not a ' +
    'leaked eps^{3/2} tier. So the finite-eps onset offset is a DISTINCT higher tier: independent rate (eps^2, ' +
    'not eps^{3/2}) and independent constant (-18/7 from the second window-tail correction -12/7, not the 4/3 ' +
    'leading amplitude). This does NOT DISCHARGE H4: the uniform bound requires the ANALYTIC tracking of ' +
    'C_ren through the fold-modulus back-conversion, not a scaled finite-N onset offset, and it says nothing ' +
    'about the coupled H3 curvature rung (N-exponent 5/4, imp-33786) that dominates and jointly governs the ' +
    'discharge. No positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING_ASSERTIONS = [
  {
    // (a) the residual sits at the eps^{7/2} second tier -> its onset-exponent-deviation rate is eps^2, not eps^{3/2}.
    id: 'imp33898-residual-is-eps-squared-tier-not-onset-rate',
    description: 'gap-residual g-(4/3)eps^{3/2} has local exponent -> 7/2, so delta rate = eps^2 (7/2-3/2), NOT eps^{3/2}',
    holds: () =>
      Math.abs(IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.secondTierExponentSettled - 3.5) < 1e-2 &&
      IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.residualRateDerived === 2 &&
      IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.rateIsIndependentOfOnset === true,
  },
  {
    // (b) the second-tier coefficient reproduces the DERIVED -12/7, panel-invariantly.
    id: 'imp33898-second-tier-coefficient-minus-twelve-sevenths',
    description: 'gr/eps^{7/2} -> -12/7 = -1.714286 (measured-vs-derived < 1e-3, panel spread 8000/16000 < 1e-4)',
    holds: () =>
      IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.secondTierCoeffResidual < 1e-3 &&
      IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.secondTierCoeffPanelSpread < 1e-4 &&
      IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.secondTierCoeffDerived === +(-12 / 7).toFixed(6),
  },
  {
    // (c) the exponent-residual amplitude reads -18/7, distinct from the 4/3 onset coefficient.
    id: 'imp33898-residual-amplitude-minus-eighteen-sevenths-not-four-thirds',
    description: 'pointwise delta/eps^2 -> -18/7 = -2.571429 (residual < 1e-2), an independent constant, not 4/3',
    holds: () =>
      IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.residualAmpResidual < 1e-2 &&
      IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.constantIsIndependentOfOnset === true &&
      IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.carriesOnsetEps32Signature === false,
  },
  {
    // (d) the imp-33863 ~2.3e-6 tail residual is reconstructed by the eps^2 tier at the N = 5e6..1e7 rung.
    id: 'imp33898-reconstructs-imp33863-tail-residual',
    description: 'the imp-33863 ~2.3e-6 tail offset = -18/7 * eps_geomean^2 at N = 5e6..1e7 (|recon| in [1e-6, 5e-6])',
    holds: () => {
      const r = Math.abs(IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.imp33863TailResidualReconstructed);
      return r > 1e-6 && r < 5e-6;
    },
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33898-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.isRigorous === false &&
      IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.dischargesH4 === false &&
      /NO QED/.test(IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.verdict) &&
      /STAYS OPEN/.test(IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.verdict) &&
      /remains the rigorous SOTA/.test(IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING.verdict,
      ),
  },
];

for (const a of IMP33898_CREN_ONSET_RESIDUAL_EPS_SCALING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33898-cren-onset-residual-eps-scaling assertion failed: ${a.id}`);
  }
}
