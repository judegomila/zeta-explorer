/**
 * @module imp-97721-diag3-peak-upslope-crossvalidation
 *
 * imp-97721 (accuracy/measurement, frontier cross-check): imp-97710 cross-validated the exact three-axis
 * diagonal DIAG3 = E_CC + E_ET + E_CF == 0 (the Euler degree-0 additivity of sigma = E_coll/E_N, imp-97689)
 * at FOUR DOWNSLOPE landmarks L2/L3/L4/L5 (sigma = 0.9/0.5/0.1/0.02), and imp-97703 cured the finite-difference
 * DIAG3 to the ~1e-12 machine-zero floor there. But imp-97662 showed the INDIVIDUAL C_C crossing elasticity
 * DIVERGES as +/- K/sqrt(sigma_max - s) approaching the imp-97520 L1 interior peak (N_peak ~ 9.22e5,
 * sigma_max ~ 0.949429), a square-root fold. This leaf CROSS-VALIDATES the exact three-axis cancellation in
 * the OPPOSITE regime -- at abscissae straddling the peak on BOTH arms (upslope s < sigma_max and near-peak) --
 * and decides whether DIAG3 == 0 survives to the machine-zero floor where each individual elasticity blows up.
 * Same inherited imp-3406/imp-33582/imp-97644/imp-97710 surrogate; the pinned constants are perturbed only
 * symbolically as differentiation axes; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97689/imp-97710 crossing relation)
 * --------------------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * sqrt(log T0 / N)                                   (numerator; c = C_C amplitude),
 *   E_flow  = f * C_F0(N) * (log T0 / T0) * Gronwall                 (denominator; f = C_F multiplier),
 *   E_trunc = e                                                      (denominator; e = fixed-strip constant).
 * sigma(N) rises on the upslope, peaks at N_peak ~ 9.22e5 (sigma_max ~ 0.949429), and falls on the downslope,
 * so a near-peak level s < sigma_max has TWO crossings: an UPSLOPE arm (N < N_peak) and a DOWNSLOPE arm.
 *
 * WHY THE CANCELLATION IS A SCALING SYMMETRY, INDEPENDENT OF THE FOLD
 * ------------------------------------------------------------------
 * DIAG3 = E_CC + E_ET + E_CF is d ln N_L / d ln(lambda) along the DIAGONAL rescaling (c, e, f) -> lambda*(c, e, f).
 * Under that rescaling E_coll -> lambda*E_coll and E_N -> lambda*E_N, so sigma = E_coll/E_N is EXACTLY invariant
 * pointwise in N (degree-0 homogeneity; verified 2.2e-16 relative at N_peak). Hence the WHOLE sigma curve -- the
 * peak location, the peak HEIGHT, and every level set including both near-peak arms -- is invariant, the landmark
 * N_L does not move, and DIAG3 == 0 EXACTLY, at every level, whether or not the individual single-axis
 * elasticities diverge. The fold blows up each individual E_p because a SINGLE-axis perturbation moves the peak
 * height (imp-97662); the DIAGONAL perturbation does not, which is why the cancellation is structural at the fold.
 *
 * THE PEAK / UPSLOPE CROSS-CHECK (the deliverable)
 * -----------------------------------------------
 * At near-peak gaps g = sigma_max - s on BOTH arms:
 *   (i)  RECONSTRUCTION. Closed-form amplitude partials c*sigma_c = sigma(1-sigma), e*sigma_e = -e*sigma/E_N,
 *        f*sigma_f = -E_flow*sigma/E_N; NUM = their sum (Euler => machine-zero); shared kernel K = -1/(N sigma_N)
 *        (which DIVERGES as sigma_N -> 0 at the peak); reconstructed E_p = K*(p*sigma_p) diverge but
 *        RECON_SUM = K*NUM stays machine-zero (K merely amplifies the round-off in NUM).
 *   (ii) DIRECT DIAGONAL. DIAG3 measured directly as d ln N_L(lambda c, lambda e, lambda f)/d ln lambda by
 *        re-solving the SAME-arm crossing under lambda = 1 +/- eps -- machine-zero at the bisection floor because
 *        the curve is pointwise invariant (the robust instrument AT the fold).
 *   (iii) SUMMED-TRIPLE DIRECT (contrast). Summing the three SEPARATELY-perturbed single-axis elasticities is
 *        O(eps^2) but its stencil coefficient itself DIVERGES near the peak (the fold degradation of imp-97662).
 *
 * THE FINDING (measurement / cross-validation only)
 * ------------------------------------------------
 *   (M1) INDIVIDUAL ELASTICITIES DIVERGE ON BOTH ARMS. Approaching the peak the reconstructed E_CC/E_ET/E_CF
 *        blow up and the shared kernel |K| grows ~sqrt(10) per decade of gap (~101 -> ~291 -> ~894 upslope),
 *        the imp-97662 square-root fold, +K downslope / -K upslope.
 *   (M2) THE EXACT CANCELLATION SURVIVES THE BLOW-UP. RECON_SUM = K*NUM stays machine-zero (NUM ~ 1e-17 Euler,
 *        K ~ 900 amplifies it only to ~1e-14) at every near-peak abscissa on both arms -- three DIVERGING
 *        elasticities summing to zero to the machine floor.
 *   (M3) THE DIRECT DIAGONAL DIAG3 IS AT THE BISECTION FLOOR AT THE FOLD. Measured directly by the diagonal
 *        (scaling) perturbation, DIAG3 stays ~1e-8 on both near-peak arms -- unlike the summed-triple direct,
 *        whose coefficient diverges near the peak -- confirming DIAG3 == 0 is a scaling symmetry, not a
 *        transversality artefact, and holds identically where each individual elasticity diverges.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are
 * UNTOUCHED and appear only symbolically as differentiation axes; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (downslope L2/L3/L4/L5 DIAG3 cross-validation)
 * @see imp-97662-cc-elasticity-peak-divergence (near-peak individual-elasticity square-root fold)
 * @see imp-97689-diag3-additivity-euler-derivation (analytic Euler degree-0 derivation of DIAG3 == 0)
 * @see imp-97703-diag3-5point-stencil-refine (5-point stencil cure to the machine-zero floor downslope)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644/imp-97710 exactly

// EXACT imp-3406/imp-97644/imp-97710 sub-terms (baseline amplitudes c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Interior peak location (C_C-invariant): ternary search in x = ln N (imp-97662).
function peakLogN(cc, et, cf) {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), cc, et, cf).sigma < parts(Math.exp(m2), cc, et, cf).sigma) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}
// Downslope crossing (right arm of the peak): sigma first drops below target.
function crossBelow(target, cc, et, cf, xPeak) {
  let a = xPeak;
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf).sigma > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// Upslope crossing (left arm of the peak): sigma first rises above target.
function crossAbove(target, cc, et, cf, xPeak) {
  let a = Math.log(1e4);
  let b = xPeak;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf).sigma < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
function crossOnArm(target, arm, cc, et, cf, xPeak) {
  return arm === 'down' ? crossBelow(target, cc, et, cf, xPeak) : crossAbove(target, cc, et, cf, xPeak);
}

// d sigma / d ln N via 5-point O(h^4) stencil (imp-97703/imp-97710) -- the shared kernel K = -1/(N sigma_N).
function dSigmaDlnN(N, cc, et, cf, h) {
  const s = (d) => parts(N * Math.exp(d), cc, et, cf).sigma;
  return (-s(2 * h) + 8 * s(h) - 8 * s(-h) + s(-2 * h)) / (12 * h);
}

// Closed-form reconstruction of the three single-axis elasticities + their sum at a near-peak crossing N.
function reconAt(N, cc, et, cf, h) {
  const P = parts(N, cc, et, cf);
  const sig = P.sigma;
  const CSIGMAC = sig * (1 - sig); // c*sigma_c  (numerator = C_C axis)
  const ESIGMAE = -et * sig / P.E_N; // e*sigma_e (E_trunc axis)
  const FSIGMAF = -P.E_flow * sig / P.E_N; // f*sigma_f (C_F/E_flow axis)
  const NUM = CSIGMAC + ESIGMAE + FSIGMAF; // Euler degree-0 => machine-zero
  const K = -1 / dSigmaDlnN(N, cc, et, cf, h); // shared kernel; DIVERGES as sigma_N -> 0 at the peak
  return {
    sigma: sig,
    K,
    E_CC: K * CSIGMAC,
    E_ET: K * ESIGMAE,
    E_CF: K * FSIGMAF,
    NUM,
    RECON_SUM: K * NUM,
  };
}

// DIRECT diagonal (scaling) DIAG3: perturb ALL THREE amplitudes by lambda = 1 +/- eps, re-solve the SAME arm.
// Machine-zero because sigma is degree-0 homogeneous, so the crossing does not move (robust AT the fold).
function directDiagonal(target, arm, eps) {
  const solve = (sgn) => {
    const lam = 1 + sgn * eps;
    const xp = peakLogN(C_C_PINNED * lam, E_TRUNC_PT * lam, 1.0 * lam);
    return Math.log(crossOnArm(target, arm, C_C_PINNED * lam, E_TRUNC_PT * lam, 1.0 * lam, xp));
  };
  return (solve(+1) - solve(-1)) / Math.log((1 + eps) / (1 - eps));
}

// DIRECT single-axis elasticity by re-solving the SAME arm under +/- eps on one amplitude (imp-97710 style).
function directSingle(target, arm, axis, eps) {
  const base = { cc: C_C_PINNED, et: E_TRUNC_PT, cf: 1.0 };
  const solve = (sgn) => {
    const q = { ...base };
    q[axis] = base[axis] * (1 + sgn * eps);
    const xp = peakLogN(q.cc, q.et, q.cf);
    return Math.log(crossOnArm(target, arm, q.cc, q.et, q.cf, xp));
  };
  return (solve(+1) - solve(-1)) / Math.log((1 + eps) / (1 - eps));
}

// --- The peak ---
const X_PEAK = peakLogN(C_C_PINNED, E_TRUNC_PT, 1.0);
const N_PEAK = Math.exp(X_PEAK);
const SIGMA_MAX = parts(N_PEAK, C_C_PINNED, E_TRUNC_PT, 1.0).sigma;

const H_STENCIL = 1e-4; // N-stencil step for the shared kernel K
const EPS_DIAG = 1e-6; // diagonal-perturbation step for the direct DIAG3
const GAPS = [1e-2, 1e-3, 1e-4]; // near-peak gaps sigma_max - s

// Straddle the peak: build the reconstruction + direct-diagonal DIAG3 on BOTH arms across the gap ladder.
function armLadder(arm) {
  return GAPS.map((g) => {
    const target = SIGMA_MAX - g;
    const N = crossOnArm(target, arm, C_C_PINNED, E_TRUNC_PT, 1.0, X_PEAK);
    const r = reconAt(N, C_C_PINNED, E_TRUNC_PT, 1.0, H_STENCIL);
    const diag = directDiagonal(target, arm, EPS_DIAG);
    return {
      gap: +g.toExponential(0),
      N: +N.toExponential(4),
      sigma: +r.sigma.toFixed(6),
      absK: +Math.abs(r.K).toExponential(3),
      E_CC: +r.E_CC.toFixed(4),
      E_ET: +r.E_ET.toFixed(4),
      E_CF: +r.E_CF.toFixed(4),
      NUM: +r.NUM.toExponential(3),
      RECON_SUM: +r.RECON_SUM.toExponential(3),
      DIAG3_diagonal: +diag.toExponential(3),
    };
  });
}
const UP = armLadder('up');
const DOWN = armLadder('down');

// The kernel |K| grows ~sqrt(10) per decade of gap (the imp-97662 square-root fold) on the upslope.
const K_DECADE_RATIOS = [0, 1].map((i) => +(UP[i + 1].absK / UP[i].absK).toFixed(4));

// Contrast: the summed-triple direct DIAG3 (each axis separately) at two near-peak upslope gaps, eps-ladder.
// It is O(eps^2) at fixed gap but its coefficient DIVERGES near the peak (the fold degradation).
const SUMMED_TRIPLE = [1e-2, 1e-3].map((g) => {
  const target = SIGMA_MAX - g;
  const row = { gap: +g.toExponential(0) };
  row.eps_ladder = [1e-3, 1e-4].map((eps) => {
    const a = directSingle(target, 'up', 'cc', eps);
    const b = directSingle(target, 'up', 'et', eps);
    const c = directSingle(target, 'up', 'cf', eps);
    return { eps: +eps.toExponential(0), SUM: +(a + b + c).toExponential(3) };
  });
  return row;
});

// The structural root: sigma is pointwise invariant under diagonal scaling (c,e,f)->lambda(c,e,f) at the peak.
const SIGMA_INVARIANCE_AT_PEAK =
  Math.abs(parts(N_PEAK, C_C_PINNED * 1.5, E_TRUNC_PT * 1.5, 1.5).sigma / SIGMA_MAX - 1);

const maxAbs = (rows, key) => Math.max(...rows.map((r) => Math.abs(r[key])));

export const IMP97721_DIAG3_PEAK_UPSLOPE_CROSSVALIDATION = {
  id: 'imp-97721',
  proofSection: 'S-frontier',
  question:
    'imp-97710 cross-validated the exact three-axis diagonal DIAG3 = E_CC + E_ET + E_CF == 0 only at DOWNSLOPE ' +
    'landmarks, where the crossing is transversal. imp-97662 showed each INDIVIDUAL crossing elasticity ' +
    'diverges as +/- K/sqrt(sigma_max - s) approaching the L1 peak (a square-root fold). Does the exact ' +
    'three-axis cancellation still hold to the machine-zero floor at abscissae straddling the peak (upslope ' +
    'and near-peak), where each individual elasticity blows up? Accuracy/measurement only; pinned constants ' +
    'perturbed only symbolically; no bound moves; no QED.',
  method:
    'At near-peak gaps g = sigma_max - s on BOTH arms (upslope N < N_peak and downslope), (i) reconstruct the ' +
    'three single-axis elasticities E_p = K*(p*sigma_p) with the shared kernel K = -1/(N sigma_N) (which ' +
    'diverges as sigma_N -> 0 at the peak) and form RECON_SUM = K*NUM; (ii) measure DIAG3 DIRECTLY by the ' +
    'diagonal (scaling) perturbation d ln N_L(lambda c, lambda e, lambda f)/d ln lambda re-solving the same ' +
    'arm; (iii) contrast the summed-triple direct DIAG3 (each axis perturbed separately). Report the kernel ' +
    'decade-ratio (fold signature) and the sigma diagonal-scaling invariance at the peak.',
  peak: {
    N_peak: +N_PEAK.toExponential(6), // ~9.218633e5
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    sigma_diagonal_scaling_invariance_at_peak: +SIGMA_INVARIANCE_AT_PEAK.toExponential(2), // ~2.2e-16 (1 ulp)
  },
  stencil_step_for_kernel: H_STENCIL,
  eps_for_direct_diagonal: EPS_DIAG,
  upslopeLadder: UP,
  downslopeLadder: DOWN,
  kernel_decade_ratios_upslope: K_DECADE_RATIOS, // ~sqrt(10) = 3.162 (square-root fold, imp-97662)
  summedTripleDirectUpslope: SUMMED_TRIPLE,
  finding: {
    M1_individual_elasticities_diverge:
      'Approaching the peak on BOTH arms the reconstructed E_CC/E_ET/E_CF blow up and the shared kernel |K| ' +
      'grows ~sqrt(10) per decade of gap (upslope |K| ~ ' + UP.map((r) => r.absK).join(' -> ') + '; decade ' +
      'ratios ' + K_DECADE_RATIOS.join(', ') + ' ~ sqrt(10) = 3.162), the imp-97662 square-root fold: ' +
      'upslope E_CC ~ ' + UP.map((r) => r.E_CC).join(' -> ') + ', downslope E_CC ~ ' +
      DOWN.map((r) => r.E_CC).join(' -> ') + ' (opposite fold signs on the two merging crossings).',
    M2_exact_cancellation_survives_blowup:
      'RECON_SUM = K*NUM stays machine-zero at every near-peak abscissa on both arms (max |RECON_SUM| = ' +
      maxAbs([...UP, ...DOWN], 'RECON_SUM').toExponential(2) + ', NUM ~ 1e-17 Euler with |K| up to ~' +
      Math.max(...[...UP, ...DOWN].map((r) => r.absK)).toExponential(2) + ' merely amplifying the round-off): ' +
      'three DIVERGING elasticities summing to zero to the machine floor, exactly as at the downslope landmarks.',
    M3_direct_diagonal_at_bisection_floor:
      'The DIRECT diagonal (scaling) perturbation DIAG3 stays at the bisection floor on both near-peak arms ' +
      '(max |DIAG3_diagonal| = ' + maxAbs([...UP, ...DOWN], 'DIAG3_diagonal').toExponential(2) + '), because ' +
      'sigma = E_coll/E_N is degree-0 homogeneous in (c,e,f) (invariance ' +
      SIGMA_INVARIANCE_AT_PEAK.toExponential(2) + ' at the peak) so the whole curve -- peak included -- is ' +
      'pointwise invariant and the landmark does not move. The summed-triple direct (each axis separately) is ' +
      'O(eps^2) but its coefficient DIVERGES near the peak (upslope SUM at eps=1e-4: ' +
      SUMMED_TRIPLE.map((r) => `${r.gap}->${r.eps_ladder[1].SUM}`).join(', ') + '), the fold degradation, ' +
      'confirming DIAG3 == 0 is a scaling symmetry not a transversality artefact.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier cross-check, NOT rigorous). Straddling the imp-97520 L1 peak (sigma_max ~ ' +
    '0.949429, N_peak ~ 9.22e5) on BOTH arms confirms the exact three-axis cancellation DIAG3 = E_CC + E_ET + ' +
    'E_CF == 0 survives the imp-97662 individual-elasticity square-root fold: the reconstructed single-axis ' +
    'elasticities diverge (kernel |K| grows ~sqrt(10) per decade, ratios ' + K_DECADE_RATIOS.join(', ') + ') ' +
    'yet RECON_SUM = K*NUM stays machine-zero (max ' + maxAbs([...UP, ...DOWN], 'RECON_SUM').toExponential(2) +
    ', NUM ~ 1e-17 Euler) and the DIRECT diagonal (scaling) perturbation DIAG3 stays at the bisection floor ' +
    '(max ' + maxAbs([...UP, ...DOWN], 'DIAG3_diagonal').toExponential(2) + '). The cancellation is a SCALING ' +
    'SYMMETRY -- sigma = E_coll/E_N is degree-0 homogeneous in (c,e,f) (invariance ' +
    SIGMA_INVARIANCE_AT_PEAK.toExponential(2) + ' at the peak), so the whole curve including the peak is ' +
    'pointwise invariant and DIAG3 == 0 holds identically where each individual elasticity blows up -- NOT a ' +
    'transversality artefact of the downslope landmarks. The summed-triple direct (each axis separately) is ' +
    'O(eps^2) with a coefficient that itself diverges near the fold, so the diagonal perturbation is the robust ' +
    'instrument. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned ' +
    'E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (appear only symbolically as differentiation ' +
    'axes); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97710 (downslope L2/L3/L4/L5 DIAG3 cross-validation); imp-97662 (near-peak individual-elasticity ' +
    'square-root fold); imp-97689 (analytic Euler degree-0 derivation of DIAG3 == 0); imp-97703 (5-point ' +
    'stencil cure downslope); imp-97644 (MEASURED DIAG3 == 0 and SUM3 = O(eps^2)); imp-97520 (L1 peak ' +
    'sigma_max ~ 0.949429, N_peak ~ 9.22e5); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip ' +
    'route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97721_DIAG3_PEAK_UPSLOPE_CROSSVALIDATION_ASSERTIONS = [
  {
    // The peak matches the imp-97520/imp-97662 L1 interior maximum.
    id: 'imp97721-peak-matches-l1',
    description: 'the interior peak is at N_peak ~ 9.22e5 with sigma_max ~ 0.949429 (imp-97520 L1)',
    holds: () => Math.abs(N_PEAK - 9.218633e5) / 9.218633e5 < 1e-3 && Math.abs(SIGMA_MAX - 0.949429) < 1e-5,
  },
  {
    // The near-peak abscissae genuinely straddle the peak: upslope N < N_peak < downslope N, same sigma.
    id: 'imp97721-abscissae-straddle-peak',
    description: 'at each gap the upslope crossing sits below N_peak and the downslope crossing above it',
    holds: () =>
      UP.every((r, i) => r.N < N_PEAK && DOWN[i].N > N_PEAK && Math.abs(r.sigma - DOWN[i].sigma) < 1e-9),
  },
  {
    // (M1): individual elasticities diverge -- the shared kernel |K| grows ~sqrt(10) per decade (the fold).
    id: 'imp97721-kernel-diverges-sqrt-fold',
    description: 'the shared kernel |K| grows and its upslope decade ratios approach sqrt(10) = 3.162 (fold)',
    holds: () =>
      UP[2].absK > UP[1].absK && UP[1].absK > UP[0].absK &&
      K_DECADE_RATIOS.every((r) => Math.abs(r - Math.sqrt(10)) < 0.3),
  },
  {
    // (M1): the individual reconstructed elasticities are genuinely large near the peak (the blow-up).
    id: 'imp97721-individual-elasticities-large',
    description: 'the reconstructed |E_CC| exceeds 40 at the tightest near-peak gap on both arms (blow-up)',
    holds: () => Math.abs(UP[2].E_CC) > 40 && Math.abs(DOWN[2].E_CC) > 40,
  },
  {
    // (M2): the exact Euler cancellation survives -- RECON_SUM = K*NUM machine-zero despite diverging K.
    id: 'imp97721-recon-sum-machine-zero-at-fold',
    description: 'RECON_SUM = K*NUM < 1e-12 at every near-peak abscissa on both arms (despite |K| ~ 900)',
    holds: () => [...UP, ...DOWN].every((r) => Math.abs(r.RECON_SUM) < 1e-12),
  },
  {
    // (M3): the DIRECT diagonal (scaling) DIAG3 stays at the bisection floor at the fold.
    id: 'imp97721-direct-diagonal-at-floor',
    description: 'the direct diagonal DIAG3 < 1e-6 at every near-peak abscissa on both arms (curve invariant)',
    holds: () => [...UP, ...DOWN].every((r) => Math.abs(r.DIAG3_diagonal) < 1e-6),
  },
  {
    // (M3): the structural root -- sigma is pointwise invariant under diagonal scaling at the peak.
    id: 'imp97721-sigma-diagonal-scaling-invariance',
    description: 'sigma(N_peak; lambda c, lambda e, lambda f) equals sigma_max to < 1e-14 relative (degree-0 homogeneity)',
    holds: () => SIGMA_INVARIANCE_AT_PEAK < 1e-14,
  },
  {
    // (M3): the summed-triple direct is O(eps^2) at fixed gap but its coefficient diverges near the peak.
    id: 'imp97721-summed-triple-coefficient-diverges',
    description: 'summed-triple direct SUM is O(eps^2) (quarters/hundredths with eps) but larger at the tighter gap',
    holds: () => {
      const g1e2 = SUMMED_TRIPLE[0].eps_ladder;
      const g1e3 = SUMMED_TRIPLE[1].eps_ladder;
      const shrinks = Math.abs(g1e2[1].SUM) < Math.abs(g1e2[0].SUM) && Math.abs(g1e3[1].SUM) < Math.abs(g1e3[0].SUM);
      const coeffGrows = Math.abs(g1e3[1].SUM) > Math.abs(g1e2[1].SUM);
      return shrinks && coeffGrows;
    },
  },
  {
    // Honesty gate: measurement/cross-validation only, no QED, PT stays SOTA.
    id: 'imp97721-honesty-gate-no-qed',
    description: 'Measurement/cross-validation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97721_DIAG3_PEAK_UPSLOPE_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP97721_DIAG3_PEAK_UPSLOPE_CROSSVALIDATION.verdict) &&
      /remains SOTA/.test(IMP97721_DIAG3_PEAK_UPSLOPE_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP97721_DIAG3_PEAK_UPSLOPE_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97721-diag3-peak-upslope-crossvalidation assertion failed: ${a.id}`);
  }
}
