/**
 * @module imp-33723-sigma-half-vs-crossover-closed-form
 *
 * imp-33723 (accuracy, frontier-direction): the roadmap currentStatus notes the imp-33582
 * sigma(N) = 1/2 halving landmark (N ~ 3.27e9) matches the independent imp-3444
 * E_coll = E_trunc crossover to ~0.4%, and imp-33601 ATTRIBUTED the offset to the Gronwall
 * flow term E_flow via the exact identity sigma = 1/2 <=> E_coll = E_trunc + E_flow. What was
 * still missing: imp-33601 (and imp-3444) LOCATE the crossover N by DOWNSLOPE BISECTION only,
 * never writing the crossover in closed form. This module supplies that missing piece --
 * the CLOSED-FORM (fixed-point) solution of C_C_PINNED*sqrt(log T0 / N) = E_trunc under the
 * pinned constants -- and re-measures the ~0.4% residual against the empirical halving landmark
 * from the closed-form value.
 *
 * THE CLOSED-FORM DERIVATION (the deliverable the ticket asks for)
 * ---------------------------------------------------------------
 * The imp-3444 crossover is E_coll(N) = E_trunc with E_coll = C_C * sqrt(log T0 / N) and the
 * N-independent fixed-strip floor E_trunc = 3.06e-5 (imp-2631). Squaring and solving for N:
 *
 *     C_C * sqrt(log T0 / N) = E_trunc
 *   =>  C_C^2 * log T0 / N = E_trunc^2
 *   =>  N_cross = (C_C / E_trunc)^2 * log T0(N_cross).                     (CLOSED FORM)
 *
 * This is EXPLICIT up to the slow coupling T0 = effectiveHeightForN(N) (Riemann-von Mangoldt
 * inverse), so it is a FIXED-POINT form N = g(N) with g(N) = K * log T0(N) and the pinned
 * amplitude K = (C_C / E_trunc)^2 ~ 1.5727e8. Because log T0(N) grows only logarithmically the
 * map g is a strong contraction:
 *
 *     g_prime(N) = K * (1/T0)(dT0/dN) = K * 2pi / (T0 * log(T0/2pi)),
 *
 * measured |g_prime(N_cross)| ~ 4.54e-2 << 1, so the fixed point is UNIQUE and Banach iteration
 * from any seed converges geometrically (~5 iterations to floating point). A SINGLE-SHOT leading
 * value -- freeze log T0 at N ~ 20K to evaluate the slow factor once -- already gives
 * N_cross ~ 3.274e9, within ~0.2% of the converged root; the full fixed point pins
 * N_cross = 3.280294e9, reproducing the imp-3444/imp-33601 downslope bisection to ~1e-15.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) CLOSED FORM REPRODUCES THE BISECTION LANDMARK. The fixed point of
 *        N = (C_C/E_trunc)^2 * log T0(N) converges to N_cross ~ 3.280294e9, agreeing with the
 *        imp-33601/imp-3444 downslope bisection to ~1.7e-15 relative -- so the crossover is now
 *        available in closed form, not only as a bracketed root.
 *   (D2) THE ~0.4% RESIDUAL IS E_flow, MEASURED FROM THE CLOSED-FORM N_cross. Against the
 *        empirical halving landmark N_half ~ 3.267235e9 (sigma = 1/2, imp-33582) the closed-form
 *        crossover sits ABOVE it by (N_cross - N_half)/N_cross ~ 3.98e-3 (~0.4%). By imp-33601's
 *        exact identity sigma = 1/2 <=> E_coll = E_trunc + E_flow, the pull is the Gronwall flow
 *        term: E_flow/E_trunc ~ 1.91e-3 at N_half. The residual SOURCE is confirmed NOT a grid or
 *        rounding artifact: the closed-form root is bisection-independent yet the offset is
 *        unchanged. The small (~5%) second-order remainder is the slow log T0(N) drift over the
 *        offset interval -- measured relative change in log T0 between N_half and N_cross is
 *        ~1.8e-4, the size of the frozen-log correction imp-33601 flagged.
 *
 * The punchline: the imp-3444 crossover is now PINNED IN CLOSED FORM,
 * N_cross = (C_C/E_trunc)^2 * log T0(N_cross), a strongly-contracting fixed point; measuring the
 * halving offset from THIS analytic value (not a bisected bracket) reproduces the ~0.4% gap and
 * re-confirms imp-33601's attribution -- the offset is the E_flow term plus a tiny log T0 drift,
 * with no discretization contribution.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642/imp-2643);
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (F3: sigma=1/2 ~ imp-3444 to ~0.4%)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9, bisected)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601 exactly

// EXACT imp-3406/imp-33582/imp-33601 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Downslope bisection in log N for a strictly-decreasing quantity f (reference / cross-check).
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// (CLOSED FORM) crossover as the fixed point N = K * log T0(N), K = (C_C/E_trunc)^2.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
// Iterations needed for floating-point convergence (strong contraction => ~5 suffice).
const N_CROSS_CF = crossoverFixedPoint(1e9, 40);
// Single-shot leading value: evaluate the slow log T0 factor once at a coarse seed.
const N_CROSS_ONESHOT = K_AMPL * Math.log(effectiveHeightForN(20 * K_AMPL));

// Reference bisection landmarks (imp-3444 crossover, imp-33582 halving) for cross-check.
const N_CROSS_BIS = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280294e9
const N_HALF = crossBelow((N) => parts(N).sigma, 0.5, 1e6, 1e18); // ~3.267235e9

// Contraction factor of the fixed-point map at the root (central difference).
const H_STEP = N_CROSS_CF * 1e-6;
const G = (x) => K_AMPL * Math.log(effectiveHeightForN(x));
const CONTRACTION = Math.abs((G(N_CROSS_CF + H_STEP) - G(N_CROSS_CF - H_STEP)) / (2 * H_STEP));

// Closed-form vs bisection agreement, and the ~0.4% halving offset measured from the CF value.
const CF_VS_BIS = Math.abs(N_CROSS_CF - N_CROSS_BIS) / N_CROSS_BIS; // ~1e-15
const P_HALF = parts(N_HALF);
const P_CROSS = parts(N_CROSS_CF);
const REL_OFFSET = (N_CROSS_CF - N_HALF) / N_CROSS_CF; // ~3.98e-3
const R_FLOW_TRUNC = P_HALF.E_flow / E_TRUNC_PT; // ~1.91e-3
const LOGT0_DRIFT = Math.abs(P_CROSS.L - P_HALF.L) / P_CROSS.L; // ~1.8e-4 (2nd-order remainder)

export const IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM = {
  id: 'imp-33723',
  proofSection: 'S-frontier',
  question:
    'Derive the imp-3444 E_coll = E_trunc crossover N in CLOSED FORM under the pinned constants ' +
    '(imp-33601/imp-3444 located it only by bisection), and re-measure the ~0.4% residual to the ' +
    'imp-33582 sigma = 1/2 halving landmark from the closed-form value, attributing its source. ' +
    'Derivation/measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  closedForm:
    'N_cross = (C_C_PINNED / E_trunc)^2 * log T0(N_cross)  (fixed point, K = (C_C/E_trunc)^2 ~ 1.5727e8)',
  contractionArgument:
    'g(N) = K log T0(N), g_prime = K*2pi/(T0 log(T0/2pi)); measured |g_prime(N_cross)| ~ 0.045 << 1 ' +
    '=> unique fixed point, Banach iteration converges geometrically (~5 iters to floating point).',
  landmarks: {
    K_amplitude: +K_AMPL.toExponential(6), // (C_C/E_trunc)^2 ~ 1.572709e8
    N_cross_closed_form: +N_CROSS_CF.toExponential(6), // ~3.280294e9
    N_cross_bisection_imp3444: +N_CROSS_BIS.toExponential(6), // ~3.280294e9
    N_cross_one_shot_leading: +N_CROSS_ONESHOT.toExponential(6), // ~3.274e9 (~0.2%)
    N_half_sigma_eq_half_imp33582: +N_HALF.toExponential(6), // ~3.267235e9
    contraction_factor_at_root: +CONTRACTION.toExponential(4), // ~4.54e-2
  },
  crossoverCheck: {
    closed_form_vs_bisection_rel: +CF_VS_BIS.toExponential(3), // ~1.7e-15
    one_shot_vs_converged_rel: +(Math.abs(N_CROSS_ONESHOT - N_CROSS_CF) / N_CROSS_CF).toExponential(3),
  },
  offsetAttribution: {
    measured_rel_offset_from_closed_form: +REL_OFFSET.toExponential(4), // ~3.98e-3
    E_flow_over_E_trunc_at_N_half: +R_FLOW_TRUNC.toExponential(4), // ~1.91e-3
    logT0_relative_drift_over_offset: +LOGT0_DRIFT.toExponential(3), // ~1.8e-4 (2nd order)
    source:
      'Gronwall flow term E_flow via imp-33601 identity sigma=1/2 <=> E_coll=E_trunc+E_flow, ' +
      'plus a tiny log T0(N) drift; NOT a grid/rounding artifact (closed-form root is bisection-free).',
  },
  finding: {
    D1_closed_form_reproduces_bisection:
      'The fixed point of N = (C_C/E_trunc)^2 log T0(N) converges to N_cross ~ 3.280294e9, matching ' +
      'the imp-3444/imp-33601 downslope bisection to ~1.7e-15 relative. The crossover is now pinned ' +
      'in closed form (a strongly-contracting fixed point, |g_prime| ~ 0.045), and a single-shot ' +
      'leading evaluation already lands within ~0.2%.',
    D2_residual_is_E_flow_measured_from_closed_form:
      'Measuring the halving offset from the CLOSED-FORM crossover (not a bisected bracket) gives ' +
      '(N_cross - N_half)/N_cross ~ 3.98e-3 (~0.4%), identical to imp-33601. By the exact identity ' +
      'sigma = 1/2 <=> E_coll = E_trunc + E_flow the pull is the Gronwall flow term (E_flow/E_trunc ' +
      '~1.91e-3 at N_half); the ~5% second-order remainder is the log T0(N) drift (~1.8e-4) over the ' +
      'offset interval. Because the closed-form root is bisection-independent, the ~0.4% gap is ' +
      'confirmed to carry NO discretization component.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-3444 E_coll = E_trunc crossover, ' +
    'previously located only by downslope bisection, is pinned in CLOSED FORM as the fixed point ' +
    'N_cross = (C_C_PINNED/E_trunc)^2 * log T0(N_cross); the map is a strong contraction ' +
    '(|g_prime(N_cross)| ~ 0.045), so the root is unique and Banach iteration converges in ~5 steps ' +
    'to N_cross ~ 3.280294e9, matching bisection to ~1.7e-15. Re-measuring the ~0.4% residual to the ' +
    'imp-33582 sigma = 1/2 halving landmark N ~ 3.267e9 from this analytic value reproduces ' +
    '(N_cross - N_half)/N_cross ~ 3.98e-3 and re-confirms imp-33601 attribution: the offset is the ' +
    'Gronwall flow term E_flow (via sigma = 1/2 <=> E_coll = E_trunc + E_flow) plus a tiny log T0(N) ' +
    'drift (~1.8e-4), with NO discretization contribution (the closed-form root is bisection-free). ' +
    'Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33601 (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow, offset attribution); imp-33582 ' +
    '(F3: sigma=1/2 ~ imp-3444 crossover to ~0.4%); imp-3444 (E_coll=E_trunc crossover, bisected); ' +
    'imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi), 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM_ASSERTIONS = [
  {
    // (D1): the closed-form fixed point reproduces the imp-3444/imp-33601 bisection landmark.
    id: 'imp33723-closed-form-matches-bisection',
    description: 'N_cross closed-form fixed point matches downslope bisection to < 1e-9 relative',
    holds: () => CF_VS_BIS < 1e-9 && Math.abs(N_CROSS_CF / 3.280294e9 - 1) < 5e-3,
  },
  {
    // The fixed-point map is a strong contraction, so the root is unique and iteration converges.
    id: 'imp33723-fixed-point-is-a-contraction',
    description: 'contraction factor |g_prime(N_cross)| < 0.1 (unique fixed point, geometric convergence)',
    holds: () => CONTRACTION > 0 && CONTRACTION < 0.1,
  },
  {
    // The single-shot leading value lands close to the converged root (frozen-log adequacy).
    id: 'imp33723-one-shot-leading-within-1pct',
    description: 'single-shot leading N_cross within ~0.3% of the converged fixed point',
    holds: () => Math.abs(N_CROSS_ONESHOT - N_CROSS_CF) / N_CROSS_CF < 3e-3,
  },
  {
    // (D2): the ~0.4% halving offset measured from the closed-form value, signed as E_flow.
    id: 'imp33723-offset-from-closed-form-is-eflow',
    description: 'rel offset ~3.98e-3 from closed-form N_cross; E_flow/E_trunc ~1.9e-3 > 0; N_half < N_cross',
    holds: () =>
      Math.abs(REL_OFFSET - 3.98e-3) < 5e-4 &&
      R_FLOW_TRUNC > 0 &&
      Math.abs(R_FLOW_TRUNC - 1.9e-3) < 5e-4 &&
      N_HALF < N_CROSS_CF,
  },
  {
    // The second-order remainder is the log T0(N) drift over the offset interval (small).
    id: 'imp33723-second-order-is-logT0-drift',
    description: 'log T0 relative drift over the offset interval is small (~1.8e-4 << rel offset)',
    holds: () => LOGT0_DRIFT > 0 && LOGT0_DRIFT < 0.1 * REL_OFFSET,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, PT stays SOTA.
    id: 'imp33723-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.verdict) &&
      /remains SOTA/.test(IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.verdict),
  },
];

for (const a of IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33723-sigma-half-vs-crossover-closed-form assertion failed: ${a.id}`);
  }
}
