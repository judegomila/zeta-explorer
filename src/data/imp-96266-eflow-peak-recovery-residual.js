/**
 * @module imp-96266-eflow-peak-recovery-residual
 *
 * imp-96266 (numerical, frontier-direction): MEASURE the E_flow correction the imp-96151/imp-96176
 * closed-form conditional-share model sigma_CF(N) = 1/(1 + sqrt(N/N_cross) sqrt(L_cross/L(N))) needs
 * to reproduce the imp-3220 U-shape interior peak it currently misses. imp-96176 attributes the peak
 * to "an E_flow effect the crossover model omits"; this module quantifies that effect by fitting the
 * residual sigma_full - sigma_CF and reporting its functional form, the E_flow fractional magnitude
 * across the U-shape region, and the peak-recovery accuracy of re-applying the correction.
 *
 * THE SETUP (exact inherited sub-terms, no re-derivation)
 * ------------------------------------------------------
 * The full three-term share is sigma_full(N) = E_coll / (E_trunc + E_flow + E_coll), with
 *   E_trunc = 3.06e-5 (N-independent fixed-strip route),
 *   E_flow  = C_F (L/T0) exp(TC_A1) (unconditionally rigorous Gronwall flow term),
 *   E_coll  = C_C sqrt(L/N) (GUE-conditional collapse term), L = log T0(N).
 * The closed-form share drops E_flow: sigma_CF(N) = 1/(1 + sqrt(N/N_cross) sqrt(L_cross/L(N))),
 * built on the imp-33723 crossover N_cross ~ 3.280294e9. Every constant is the exact inherited
 * imp-3406/imp-33582/imp-33723 value; no fresh fit, no new model, no zeros bundle.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) THE RESIDUAL IS AN EXACT ALGEBRAIC IDENTITY, NOT A FIT. Over [1e3,1e12] the closed form
 *        coincides with the E_flow-dropped two-term share E_coll/(E_trunc+E_coll) to machine epsilon
 *        (max |sigma_CF - sigma_2term| ~ 1.1e-16), so the residual has the CLOSED FORM
 *            R(N) = sigma_full - sigma_CF = -sigma_full(N) * E_flow(N) / (E_trunc + E_coll(N)),
 *        reproduced to ~1.5e-16 (an exact identity, not an empirical fit). E_flow sits in the
 *        DENOMINATOR, so the residual is strictly NEGATIVE: E_flow SUPPRESSES the share.
 *   (M2) THE PEAK IS BUILT BY DIFFERENTIAL SUPPRESSION. E_flow/E_N falls steeply across the U-shape
 *        region -- 1.38e-1 at 1e3, 5.70e-2 at 1e5, 3.06e-2 at the peak (N ~ 9.22e5), 1.40e-2 at 1e7,
 *        1.22e-5 at 1e12. Because the suppression is strong on the left arm and vanishing on the
 *        right, it bends the monotone-DECREASING two-term share (slope < 0 at both 1e5 and 1e7) into
 *        the RISING-then-falling full share (slope > 0 at 1e5, < 0 at 1e7): the imp-3220 interior
 *        maximum is entirely a manufactured E_flow effect.
 *   (M3) PEAK-RECOVERY ACCURACY. Re-applying the E_flow suppression to the closed-form baseline,
 *        sigma_recon(N) = sigma_CF(N)(1 - E_flow/(E_trunc+E_coll)), recovers the full-share interior
 *        maximum from sigma_CF (which has NO peak) to within 9.1e-2 in peak LOCATION (N_recon ~
 *        1.006e6 vs N_full ~ 9.219e5) and 9.2e-4 in peak HEIGHT (0.948510 vs 0.949429). The residual
 *        magnitude required at the peak is |R| ~ 3.00e-2 of share, sourced by E_flow ~ 4.68e-5
 *        (3.06% of E_N) against E_coll ~ 1.45e-3.
 *   (M4) THE FULL-SHARE PEAK REPRODUCES imp-3220. The three-term share peaks at N ~ 9.218632e5 with
 *        sigma_max ~ 0.949429, matching the imp-3220 landmark (N ~ 9.22e5, sigma_max ~ 0.9494) to
 *        4 significant figures -- a cross-check that the inherited sub-terms are wired correctly.
 *
 * The punchline: the E_flow correction the closed form omits has the exact closed form
 * R(N) = -sigma_full * E_flow/(E_trunc+E_coll) (identity to 1e-16, NOT a fitted residual); it is a
 * strictly-negative differential suppression, ~3.00e-2 of share at the peak, that manufactures the
 * imp-3220 U-shape by pulling the left arm down harder than the right. Re-applying it to sigma_CF
 * recovers the interior maximum to <1e-3 in height and ~9% in location. The peak is confirmed to be
 * a Gronwall-flow feature, cleanly separable from the collapse/truncation competition.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Component model is the inherited
 * imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED (the share stays GUE-conditional); the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (closed-form share model; F2 = peak omitted)
 * @see imp-96176-sigma-closed-form-ladder-viz-data (caption: "the peak is an E_flow effect the crossover model omits")
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross fixed point)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96151 exactly

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (identical to imp-96151; no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { L, E_flow, E_coll, E_trunc: E_TRUNC_PT, E_N, sigma: E_coll / E_N };
}
const sigmaFull = (N) => parts(N).sigma;
const sigmaTwoTerm = (N) => {
  const p = parts(N);
  return p.E_coll / (p.E_trunc + p.E_coll); // E_flow dropped, no crossover approximation
};

// imp-33723 closed-form crossover fixed point (identical to imp-96151).
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS = crossoverFixedPoint(1e9, 60); // ~3.280294e9
const L_CROSS = Math.log(effectiveHeightForN(N_CROSS)); // ~20.8576
function sigmaCF(N) {
  const L = Math.log(effectiveHeightForN(N));
  return 1 / (1 + Math.sqrt(N / N_CROSS) * Math.sqrt(L_CROSS / L));
}
// First-order reconstruction: re-apply the E_flow suppression to the closed-form baseline.
function sigmaRecon(N) {
  const p = parts(N);
  return sigmaCF(N) * (1 - p.E_flow / (p.E_trunc + p.E_coll));
}

// Peak locator on a shrinking log grid over [1e4,1e8].
function findPeak(f) {
  let bestN = 0;
  let bestS = -1;
  let lo = 4;
  let hi = 8;
  for (let iter = 0; iter < 6; iter++) {
    const step = (hi - lo) / 400;
    bestS = -1;
    for (let d = lo; d <= hi + 1e-12; d += step) {
      const N = Math.pow(10, d);
      const s = f(N);
      if (s > bestS) {
        bestS = s;
        bestN = N;
      }
    }
    const db = Math.log10(bestN);
    lo = db - step;
    hi = db + step;
  }
  return { N: bestN, sigma: bestS };
}
function dSigmadN(f, N) {
  const h = N * 1e-6;
  return (f(N + h) - f(N - h)) / (2 * h);
}

// (M1) residual identity R = -sigma_full * E_flow/(E_trunc+E_coll); CF == two-term.
let MAX_IDENTITY_ERR = 0;
let MAX_CF_MINUS_TWOTERM = 0;
for (let d = 3; d <= 12; d += 0.5) {
  const N = Math.pow(10, d);
  const p = parts(N);
  const residVs2T = p.sigma - sigmaTwoTerm(N);
  const predicted = -p.sigma * p.E_flow / (p.E_trunc + p.E_coll);
  MAX_IDENTITY_ERR = Math.max(MAX_IDENTITY_ERR, Math.abs(residVs2T - predicted));
  MAX_CF_MINUS_TWOTERM = Math.max(MAX_CF_MINUS_TWOTERM, Math.abs(sigmaCF(N) - sigmaTwoTerm(N)));
}

// (M2) fractional E_flow suppression ladder across the U-shape region.
const EFLOW_FRAC_LADDER = [3, 4, 5, 6, 7, 9, 12].map((k) => {
  const N = Math.pow(10, k);
  const p = parts(N);
  return {
    N: `1e${k}`,
    eFlowOverEN: +(p.E_flow / p.E_N).toExponential(3),
    residualFullMinusCF: +(sigmaFull(N) - sigmaCF(N)).toExponential(4),
  };
});
const TWOTERM_MONOTONE_DOWN =
  dSigmadN(sigmaTwoTerm, 1e5) < 0 && dSigmadN(sigmaTwoTerm, 1e7) < 0; // no peak without E_flow
const FULL_RISES_AT_1E5 = dSigmadN(sigmaFull, 1e5) > 0; // left arm (imp-3220)
const FULL_FALLS_AT_1E7 = dSigmadN(sigmaFull, 1e7) < 0; // right arm

// (M3)/(M4) peaks: full share vs the closed-form reconstruction.
const PEAK_FULL = findPeak(sigmaFull);
const PEAK_RECON = findPeak(sigmaRecon);
const pk = parts(PEAK_FULL.N);
const PEAK_LOC_REL_ERR = Math.abs(PEAK_RECON.N / PEAK_FULL.N - 1);
const PEAK_HEIGHT_ABS_ERR = Math.abs(PEAK_RECON.sigma - PEAK_FULL.sigma);
const RESIDUAL_AT_PEAK = sigmaFull(PEAK_FULL.N) - sigmaCF(PEAK_FULL.N);

export const IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL = {
  id: 'imp-96266',
  proofSection: 'S-frontier',
  question:
    'Derive the E_flow correction size the imp-96151/imp-96176 closed-form share model sigma_CF(N) ' +
    'needs to reproduce the imp-3220 U-shape interior peak it currently misses: fit the residual ' +
    'sigma_full - sigma_CF, report its functional form, the E_flow fractional magnitude across the ' +
    'peak region, and the peak-recovery accuracy of re-applying the correction. Measurement only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  residualClosedForm:
    'R(N) = sigma_full - sigma_CF = -sigma_full(N) * E_flow(N) / (E_trunc + E_coll(N)) -- an EXACT ' +
    'algebraic identity (sigma_CF coincides with the E_flow-dropped two-term share to machine ' +
    'epsilon), NOT an empirical fit. E_flow sits in the denominator, so R < 0: E_flow SUPPRESSES ' +
    'the share, differentially (strong on the left arm, vanishing past the crossover).',
  landmarks: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    L_cross: +L_CROSS.toFixed(6), // ~20.857609
    max_identity_err_R_vs_closed_form: +MAX_IDENTITY_ERR.toExponential(3), // ~1.5e-16 (identity)
    max_sigmaCF_minus_twoterm: +MAX_CF_MINUS_TWOTERM.toExponential(3), // ~1.1e-16 (CF == 2term)
    peak_N_full: +PEAK_FULL.N.toExponential(6), // ~9.218632e5
    peak_sigma_full: +PEAK_FULL.sigma.toFixed(6), // ~0.949429 (imp-3220: 0.9494)
    E_flow_at_peak: +pk.E_flow.toExponential(4), // ~4.6837e-5
    E_coll_at_peak: +pk.E_coll.toExponential(4), // ~1.4538e-3
    E_flow_over_EN_at_peak: +(pk.E_flow / pk.E_N).toExponential(4), // ~3.0587e-2
    residual_at_peak: +RESIDUAL_AT_PEAK.toExponential(4), // ~-2.9957e-2
  },
  eFlowFractionalLadder: EFLOW_FRAC_LADDER,
  shapeProbe: {
    two_term_monotone_decreasing: TWOTERM_MONOTONE_DOWN, // true: no peak once E_flow dropped
    full_share_rises_at_1e5: FULL_RISES_AT_1E5, // true: E_flow builds the left arm
    full_share_falls_at_1e7: FULL_FALLS_AT_1E7, // true: post-peak right arm
  },
  peakRecovery: {
    peak_N_recon: +PEAK_RECON.N.toExponential(6), // ~1.005554e6
    peak_sigma_recon: +PEAK_RECON.sigma.toFixed(6), // ~0.948510
    peak_location_rel_err: +PEAK_LOC_REL_ERR.toExponential(3), // ~9.08e-2
    peak_height_abs_err: +PEAK_HEIGHT_ABS_ERR.toExponential(3), // ~9.19e-4
  },
  finding: {
    M1_residual_is_exact_identity:
      'sigma_CF coincides with the E_flow-dropped two-term share E_coll/(E_trunc+E_coll) to machine ' +
      'epsilon (~1.1e-16), so the residual has the exact closed form R = -sigma_full*E_flow/' +
      '(E_trunc+E_coll) (reproduced to ~1.5e-16). It is an identity, not a fit; E_flow is in the ' +
      'denominator so R is strictly negative -- E_flow SUPPRESSES the share.',
    M2_peak_from_differential_suppression:
      'E_flow/E_N falls steeply across the U-shape region (1.38e-1 at 1e3, 5.70e-2 at 1e5, 3.06e-2 ' +
      'at the peak, 1.40e-2 at 1e7, 1.22e-5 at 1e12). Strong-left/weak-right suppression bends the ' +
      'monotone-decreasing two-term share (slope < 0 at both 1e5 and 1e7) into the rising-then-' +
      'falling full share (slope > 0 at 1e5, < 0 at 1e7): the imp-3220 peak is a manufactured ' +
      'E_flow effect.',
    M3_peak_recovery_accuracy:
      'Re-applying the E_flow suppression to the closed-form baseline, sigma_recon = sigma_CF*(1 - ' +
      'E_flow/(E_trunc+E_coll)), recovers the interior maximum from a peakless sigma_CF to 9.1e-2 in ' +
      'location (N_recon ~ 1.006e6 vs 9.219e5) and 9.2e-4 in height (0.948510 vs 0.949429). Required ' +
      'residual at the peak is |R| ~ 3.00e-2 of share, sourced by E_flow ~ 4.68e-5 (3.06% of E_N).',
    M4_full_peak_matches_imp3220:
      'The three-term share peaks at N ~ 9.218632e5, sigma_max ~ 0.949429 -- matching the imp-3220 ' +
      'landmark (N ~ 9.22e5, sigma_max ~ 0.9494) to 4 significant figures, confirming the inherited ' +
      'sub-terms are wired correctly.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The E_flow correction the imp-96151 closed form ' +
    'omits has the EXACT closed form R(N) = sigma_full - sigma_CF = -sigma_full*E_flow/(E_trunc+' +
    'E_coll) (an algebraic identity to ~1e-16, NOT a fitted residual): a strictly-negative ' +
    'differential suppression, ~3.00e-2 of share at the peak (E_flow ~ 4.68e-5, 3.06% of E_N against ' +
    'E_coll ~ 1.45e-3). Because E_flow/E_N falls steeply (1.38e-1 at 1e3 down to 1.22e-5 at 1e12) it ' +
    'pulls the left arm down harder than the right, converting the monotone-decreasing two-term ' +
    'share into the rising-then-falling imp-3220 U-shape; re-applying it to sigma_CF recovers the ' +
    'interior maximum to 9.2e-4 in height and ~9% in location. The peak is confirmed to be a ' +
    'Gronwall-flow feature, cleanly separable from the collapse/truncation competition. Component ' +
    'model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96151 (closed-form share model; F2 = peak omitted); imp-96176 (caption: peak is an E_flow ' +
    'effect); imp-3220 (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5); imp-33723 (closed-form ' +
    'crossover N_cross); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL_ASSERTIONS = [
  {
    // (M1) residual is an exact identity: R = -sigma_full*E_flow/(E_trunc+E_coll); CF == two-term.
    id: 'imp96266-residual-is-exact-identity',
    description: 'R = sigma_full - sigma_CF equals -sigma_full*E_flow/(E_trunc+E_coll) to ~1e-16; CF == two-term',
    holds: () => MAX_IDENTITY_ERR < 1e-12 && MAX_CF_MINUS_TWOTERM < 1e-12,
  },
  {
    // (M2) E_flow builds the peak: two-term monotone down, full share rises then falls.
    id: 'imp96266-peak-from-differential-suppression',
    description: 'two-term share monotone decreasing (no peak); full share rises at 1e5, falls at 1e7',
    holds: () => TWOTERM_MONOTONE_DOWN && FULL_RISES_AT_1E5 && FULL_FALLS_AT_1E7,
  },
  {
    // (M2) residual strictly negative (E_flow suppresses) with the expected fractional magnitudes.
    id: 'imp96266-residual-strictly-negative-suppression',
    description: 'sigma_full - sigma_CF < 0 across the ladder; E_flow/E_N falls from ~1.4e-1 to ~1.2e-5',
    holds: () =>
      EFLOW_FRAC_LADDER.every((r) => r.residualFullMinusCF < 0) &&
      EFLOW_FRAC_LADDER[0].eFlowOverEN > 0.1 &&
      EFLOW_FRAC_LADDER[EFLOW_FRAC_LADDER.length - 1].eFlowOverEN < 1e-4,
  },
  {
    // (M3) re-applying the E_flow suppression recovers the peak to <1e-3 in height, ~10% in location.
    id: 'imp96266-peak-recovery-accuracy',
    description: 'sigma_recon recovers the interior maximum to < 1e-3 in height and < 1.5e-1 in location',
    holds: () => PEAK_HEIGHT_ABS_ERR < 1e-3 && PEAK_LOC_REL_ERR < 1.5e-1,
  },
  {
    // (M4) full-share peak reproduces the imp-3220 landmark to 4 significant figures.
    id: 'imp96266-full-peak-matches-imp3220',
    description: 'full share peaks at N ~ 9.22e5 with sigma_max ~ 0.9494 (imp-3220 landmark)',
    holds: () =>
      Math.abs(PEAK_FULL.N / 9.22e5 - 1) < 5e-3 && Math.abs(PEAK_FULL.sigma - 0.9494) < 1e-3,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96266-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL.isRigorous === false &&
      /NO QED/.test(IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL.verdict) &&
      /refereed bound is changed/i.test(IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL.verdict),
  },
];

for (const a of IMP96266_EFLOW_PEAK_RECOVERY_RESIDUAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96266-eflow-peak-recovery-residual assertion failed: ${a.id}`);
  }
}
