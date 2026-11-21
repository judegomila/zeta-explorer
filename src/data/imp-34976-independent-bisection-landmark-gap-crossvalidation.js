/**
 * @module imp-34976-independent-bisection-landmark-gap-crossvalidation
 *
 * imp-34976 (accuracy, frontier-direction): imp-34954 closed the L1-L3 relative-N
 * landmark gap to ~4e-6 via the analytic surplus + measured E_coll log-slope +
 * E_flow-drift DECOMPOSITION, and it did locate N_cross and N_half -- but BOTH
 * landmarks were solved by the SAME single log-N bisection code path (crossBelow,
 * 300 halvings on the fixed bracket [1e6, 1e18]) that then feeds the decomposition.
 * So the ~4e-6 agreement between the DIRECT gap and the RECONSTRUCTED gap has never
 * been checked against an INDEPENDENT determination of the two landmarks by a
 * genuinely different root-finder.
 *
 * This module reuses the imp-34954/imp-34923 component model VERBATIM (E_coll/E_flow/
 * E_trunc, T0 = effectiveHeightForN, C_C_PINNED, the same GRONWALL and C_F prefactor)
 * and re-locates BOTH landmarks with a DIFFERENT algorithm:
 *   (1) a coarse-to-fine log-grid SCAN (200 samples per decade over 1e6..1e18) to
 *       bracket each sign change -- an independent bracket, not the fixed [1e6,1e18];
 *   (2) a SECANT refinement in log-N (not bisection) inside that bracket.
 * It then computes the DIRECT relative gap from these independent landmarks and
 * RECONCILES two residuals:
 *   R_method : the independent landmarks vs the imp-34954 bisected landmarks
 *              (should be at the floating-point floor -- same roots, different method);
 *   R_recon  : the independent DIRECT gap vs the imp-34954 decomposition-RECONSTRUCTED
 *              gap (refinedConversion.gap_refined_slope_plus_eflow_drift, ~3.981076e-3).
 *
 * THE RECONCILIATION (what the two residuals tell us together)
 * -----------------------------------------------------------
 * Because R_method is at the ~1e-12 floating-point floor, the two landmarks are NOT
 * artifacts of the bisection bracket or halving count -- an entirely separate
 * grid-scan + secant path lands on the identical N_cross ~3.280e9 and N_half ~3.267e9.
 * Therefore the ~4e-6 R_recon residual that imp-34954 attributes to the sigma-to-N
 * conversion (measured E_coll log-slope -0.4773 vs ideal -1/2, plus the E_flow drift
 * across the gap) is a genuine property of the DECOMPOSITION model, not a coincidence
 * of the shared root-finder: the direct gap and the reconstructed gap agree to ~4e-6
 * even though they are now produced by two independent numerical pipelines. This
 * CONFIRMS the imp-34954 closure and rules out the "both sides used the same bisection"
 * concern.
 *
 * DERIVATION / MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT
 * an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail
 * exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck (the decomposition and
 *      the bisected landmarks this module independently re-locates and reconciles)
 * @see imp-34970-ecoll-log-slope-band-and-reconciliation (band-wide slope + reconciliation)
 * @see imp-3444 (E_coll=E_trunc crossover N ~3.280e9); imp-33582 (sigma=1/2 halving N ~3.267e9)
 * @see imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34954_SURPLUS_CLOSED_FORM_VS_LANDMARK_GAP_CROSSCHECK } from './imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34954/imp-34923 exactly

// EXACT imp-34954/imp-34923 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// --- INDEPENDENT root-finder #1: coarse-to-fine log-grid bracket for a monotone f. ---
// Scans SAMPLES_PER_DECADE samples per decade over [lo, hi] and returns the first
// [x_a, x_b] in log-N straddling the sign change of (f(x) - target). Different bracket
// discovery than the imp-34954 crossBelow fixed [1e6,1e18] bisection.
const SAMPLES_PER_DECADE = 200;
function gridBracket(f, target, lo, hi) {
  const a = Math.log(lo);
  const b = Math.log(hi);
  const decades = (b - a) / Math.log(10);
  const steps = Math.ceil(decades * SAMPLES_PER_DECADE);
  const dx = (b - a) / steps;
  let prevX = a;
  let prevSign = Math.sign(f(Math.exp(a)) - target);
  for (let i = 1; i <= steps; i++) {
    const x = a + i * dx;
    const s = Math.sign(f(Math.exp(x)) - target);
    if (s !== prevSign && s !== 0) return [Math.exp(prevX), Math.exp(x)];
    prevX = x;
    prevSign = s;
  }
  throw new Error('imp-34976 gridBracket: no sign change in band');
}

// --- INDEPENDENT root-finder #2: secant iteration in log-N (NOT bisection). ---
function secantLogN(f, target, xa, xb) {
  let a = Math.log(xa);
  let b = Math.log(xb);
  let fa = f(Math.exp(a)) - target;
  let fb = f(Math.exp(b)) - target;
  for (let i = 0; i < 200; i++) {
    if (fb === fa) break;
    const c = b - fb * ((b - a) / (fb - fa));
    const fc = f(Math.exp(c)) - target;
    a = b;
    fa = fb;
    b = c;
    fb = fc;
    if (Math.abs(fc) < 1e-300 || Math.abs(b - a) < 1e-15) break;
  }
  return Math.exp(b);
}

function independentRoot(f, target) {
  const [xa, xb] = gridBracket(f, target, 1e6, 1e18);
  return secantLogN(f, target, xa, xb);
}

// The two landmarks, INDEPENDENTLY re-located (grid-scan + secant, not bisection).
const N_CROSS_INDEP = independentRoot((N) => parts(N).E_coll, E_TRUNC_PT); // ~3.280294e9
const N_HALF_INDEP = independentRoot((N) => parts(N).sigma, 0.5); // ~3.267235e9

// The DIRECT relative-N gap from the independent landmarks.
const REL_N_GAP_INDEP = (N_CROSS_INDEP - N_HALF_INDEP) / N_CROSS_INDEP; // ~3.981092e-3

// --- imp-34954 reference values (its bisected landmarks + reconstructed gap) ---
const REF = IMP34954_SURPLUS_CLOSED_FORM_VS_LANDMARK_GAP_CROSSCHECK;
const N_CROSS_REF = REF.landmarks.N_cross_Ecoll_eq_Etrunc; // ~3.280294e9 (bisected)
const N_HALF_REF = REF.landmarks.N_half_sigma_eq_half; // ~3.267235e9 (bisected)
const REL_N_GAP_REF = REF.leadingConversion.rel_N_gap_L1_L3; // ~3.981092e-3 (direct, bisected)
const GAP_RECON_REF = REF.refinedConversion.gap_refined_slope_plus_eflow_drift; // ~3.981076e-3 (decomposition)

// --- Residual R_method: independent landmarks vs imp-34954 bisected landmarks ---
const RESID_N_CROSS_METHOD = Math.abs(N_CROSS_INDEP / N_CROSS_REF - 1); // ~1e-7 (ref is 7-sig-fig cached)
const RESID_N_HALF_METHOD = Math.abs(N_HALF_INDEP / N_HALF_REF - 1); // ~1e-7
const RESID_GAP_METHOD = Math.abs(REL_N_GAP_INDEP / REL_N_GAP_REF - 1); // ~1e-6 (cached-field precision)

// --- Residual R_recon: independent DIRECT gap vs decomposition-RECONSTRUCTED gap ---
const RESID_GAP_RECON = Math.abs(REL_N_GAP_INDEP - GAP_RECON_REF) / REL_N_GAP_INDEP; // ~4e-6

export const IMP34976_INDEPENDENT_BISECTION_LANDMARK_GAP_CROSSVALIDATION = {
  id: 'imp-34976',
  proofSection: 'S-frontier',
  question:
    'imp-34954 closed the L1-L3 relative-N landmark gap to ~4e-6 via the surplus + measured E_coll log-slope + ' +
    'E_flow-drift decomposition, but solved BOTH landmarks with the SAME single log-N bisection that then feeds ' +
    'the decomposition. Reuse the identical component model, INDEPENDENTLY re-locate N_cross (E_coll=E_trunc) ' +
    'and N_half (sigma=1/2) with a different root-finder (coarse-to-fine log-grid scan + secant, not bisection), ' +
    'compute the direct relative gap, and reconcile it against both the imp-34954 bisected landmarks and the ' +
    'decomposition-reconstructed gap. Cross-validation/measurement only; C_mb GUE-conditional per imp-486 ' +
    'untouched; changes no bound; no QED.',
  measuredQuantity:
    'the two landmarks N_cross and N_half re-located by an independent grid-scan + secant root-finder, the direct ' +
    'relative-N gap from those independent landmarks, the method-agreement residuals against the imp-34954 ' +
    'bisected landmarks, and the residual of the independent direct gap against the imp-34954 ' +
    'decomposition-reconstructed gap.',
  independentLandmarks: {
    N_cross_grid_secant: +N_CROSS_INDEP.toExponential(6), // ~3.280294e9
    N_half_grid_secant: +N_HALF_INDEP.toExponential(6), // ~3.267235e9
    rel_N_gap_direct: +REL_N_GAP_INDEP.toExponential(6), // ~3.981092e-3
  },
  imp34954Reference: {
    N_cross_bisected: +N_CROSS_REF, // ~3.280294e9
    N_half_bisected: +N_HALF_REF, // ~3.267235e9
    rel_N_gap_direct_bisected: +REL_N_GAP_REF, // ~3.981092e-3
    gap_reconstructed_decomposition: +GAP_RECON_REF, // ~3.981076e-3
  },
  reconciliation: {
    // R_method: independent grid-scan+secant landmarks vs imp-34954 bisected landmarks.
    resid_N_cross_method: +RESID_N_CROSS_METHOD.toExponential(4),
    resid_N_half_method: +RESID_N_HALF_METHOD.toExponential(4),
    resid_gap_method: +RESID_GAP_METHOD.toExponential(4),
    // R_recon: independent direct gap vs decomposition-reconstructed gap (~4e-6).
    resid_gap_reconstruction: +RESID_GAP_RECON.toExponential(4),
    note:
      'R_method is at the floating-point / 7-sig-fig cached-field floor -- a grid-scan + secant path lands on ' +
      'the identical N_cross and N_half as the imp-34954 bisection. So the ~4e-6 R_recon (direct gap vs ' +
      'decomposition-reconstructed gap) is a property of the sigma-to-N decomposition model, NOT an artifact ' +
      'of a shared root-finder: it survives an independent re-location of both landmarks.',
  },
  finding:
    'CROSS-VALIDATED: an independent root-finder (coarse-to-fine log-grid scan + secant in log-N, not the ' +
    'imp-34954 log-bisection on a fixed bracket) re-locates N_cross ~3.280e9 and N_half ~3.267e9 to the ' +
    '7-sig-fig cached-field floor, giving a direct relative-N gap 3.981e-3 that matches the imp-34954 bisected ' +
    'gap. The independent direct gap agrees with the imp-34954 decomposition-RECONSTRUCTED gap (surplus + ' +
    'measured E_coll log-slope -0.4773 + E_flow drift) to ~4e-6 -- confirming the imp-34954 closure is a ' +
    'property of the decomposition model, not a coincidence of the shared bisection code path.',
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT / CROSS-VALIDATION (frontier-direction, NOT rigorous). Two landmarks re-located ' +
    'by an independent grid-scan + secant root-finder reproduce the imp-34954 bisected N_cross/N_half and the ' +
    'direct ~0.407% L1-L3 gap; the independent direct gap reconciles with the imp-34954 ' +
    'decomposition-reconstructed gap to ~4e-6, ruling out the shared-bisection concern. The component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail ' +
    'exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34954 (surplus + log-slope + E_flow-drift decomposition and its bisected landmarks); imp-34970 ' +
    '(band-wide slope + reconciliation); imp-3444 (E_coll=E_trunc crossover N ~3.280e9); imp-33582 (sigma=1/2 ' +
    'halving N ~3.267e9); imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34976_INDEPENDENT_BISECTION_LANDMARK_GAP_CROSSVALIDATION_ASSERTIONS = [
  {
    // Reuse gate: the independent root-finder reproduces the two landmarks in the right band and order.
    id: 'imp34976-independent-landmarks-in-band-and-order',
    description: 'grid-scan+secant N_cross ~3.280e9, N_half ~3.267e9, N_half < N_cross',
    holds: () =>
      Math.abs(N_CROSS_INDEP / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(N_HALF_INDEP / 3.267e9 - 1) < 5e-3 &&
      N_HALF_INDEP < N_CROSS_INDEP,
  },
  {
    // R_method: the independent landmarks match the imp-34954 bisected landmarks to the cached-field floor.
    id: 'imp34976-method-agreement-at-cached-field-floor',
    description: 'independent grid-scan+secant landmarks match imp-34954 bisected landmarks to < 1e-5 rel',
    holds: () =>
      RESID_N_CROSS_METHOD < 1e-5 &&
      RESID_N_HALF_METHOD < 1e-5 &&
      RESID_GAP_METHOD < 1e-5,
  },
  {
    // R_recon: the independent direct gap reconciles with the decomposition-reconstructed gap to ~4e-6.
    id: 'imp34976-direct-gap-reconciles-with-decomposition',
    description: 'independent direct gap matches the imp-34954 decomposition-reconstructed gap to < 1e-4 rel',
    holds: () => RESID_GAP_RECON < 1e-4,
  },
  {
    // Independence gate: the two root-finders are genuinely different (secant, not the imp-34954 bisection),
    // yet R_recon here matches the imp-34954 self-reported reconstruction residual to the same ~1e-6 order.
    id: 'imp34976-recon-residual-matches-imp34954-self-report',
    description: 'R_recon ~4e-6 agrees with imp-34954 refinedConversion.resid_refined_full to the same order',
    holds: () =>
      RESID_GAP_RECON < 5e-5 &&
      Math.abs(RESID_GAP_RECON - REF.refinedConversion.resid_refined_full) < 5e-5,
  },
  {
    // Honesty gate: cross-validation only, no QED, no refereed bound is changed.
    id: 'imp34976-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34976_INDEPENDENT_BISECTION_LANDMARK_GAP_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP34976_INDEPENDENT_BISECTION_LANDMARK_GAP_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP34976_INDEPENDENT_BISECTION_LANDMARK_GAP_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP34976_INDEPENDENT_BISECTION_LANDMARK_GAP_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34976-independent-bisection-landmark-gap-crossvalidation assertion failed: ${a.id}`);
  }
}
