/**
 * @module imp-96403-eflow-peak-location-eflowsq-vs-dedn
 *
 * imp-96403 (numerical, frontier-direction): DECIDE which of the two second-order corrections the
 * imp-96266 M3 residual analysis names -- an E_flow^2 (Taylor x^2) term OR a dE_flow/dN (flow-drift)
 * term -- is the one that closes the ~9% peak-LOCATION error of the first-order reconstruction
 * sigma_recon(N) = sigma_CF(N)(1 - E_flow/(E_trunc+E_coll)). imp-96286 already showed the E_flow^2
 * branch closes the gap ~21x; this module isolates and RULES OUT the untested dE_flow/dN (derivative)
 * branch, so the "E_flow^2 or dE_flow/dN" fork the ticket poses is settled by direct measurement.
 *
 * THE SETUP (exact inherited sub-terms, identical to imp-96266/imp-96286; no re-derivation)
 * ----------------------------------------------------------------------------------------
 * sigma_full(N) = E_coll / (E_trunc + E_flow + E_coll) = sigma_CF / (1 + x), with sigma_CF =
 * E_coll/(E_trunc+E_coll) (the E_flow-dropped closed form, coincident with the imp-96151 crossover
 * form to machine epsilon) and x(N) = E_flow(N)/(E_trunc + E_coll(N)). imp-96266 re-applies the
 * FIRST-ORDER Taylor truncation sigma_CF*(1 - x); its exact residual is err1 = sigma_CF*(1-x) -
 * sigma_full = -sigma_CF*x^2/(1+x). Every constant is the exact inherited imp-3406/imp-33582/imp-33723
 * value; no fresh fit, no new model, no zeros bundle.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE MISSING TERM HAS THE E_flow^2 FUNCTIONAL FORM. The exact first-order residual err1 =
 *        -sigma_CF*x^2/(1+x) matches the pure E_flow^2 candidate A = -sigma_CF*x^2 with ratio
 *        err1/A = 1/(1+x), which stays in [0.90, 0.99] across the peak region 1e4..1e7 (an O(x)
 *        match: x is small, so 1/(1+x) ~ 1). The correction is quadratic in the flow term.
 *   (F2) THE dE_flow/dN CANDIDATE HAS THE WRONG N-SCALING. Against the derivative candidate
 *        B = dE_flow/dN the ratio err1/B is NOT constant -- it ranges ~1.2e5 (at 1e4) to ~3.2e8
 *        (at 1e7), spanning >3 orders of magnitude across the same window. A single scale cannot
 *        turn dE_flow/dN into err1, so the missing correction is not a flow-drift (derivative) term.
 *   (F3) ONLY THE E_flow^2 CORRECTION CLOSES THE LOCATION GAP. Reconstructing with the E_flow^2 term
 *        sigma_CF*(1 - x + x^2) drops the peak-location error from 9.08e-2 to 4.37e-3 (~21x, exactly
 *        the imp-96286 result). Reconstructing with a best-least-squares-scaled dE_flow/dN correction
 *        (recon1 + c*dE_flow/dN, c fit over 1e5..1e7) does NOT close it -- the location error grows
 *        to ~9.9e-1, WORSE than the uncorrected 9.08e-2, because the wrongly-shaped derivative
 *        distorts the slope through the flat peak.
 *   (F4) WHY THE DERIVATIVE BRANCH IS A DEAD END. The pointwise reconstruction already evaluates
 *        x(N) = E_flow(N)/(E_trunc+E_coll(N)) at each N, so it ALREADY carries the exact local
 *        dE_flow/dN; there is no missing-drift degree of freedom to recover. The residual is purely
 *        the algebraic x^2 (E_flow^2) Taylor tail of 1/(1+x), consistent with imp-96286/imp-96308/
 *        imp-96329. A dE_flow/dN correction is neither needed nor the right lever.
 *
 * The punchline: of the two candidate second-order corrections imp-96266 M3 names, the E_flow^2
 * (Taylor x^2) term is the one that closes the ~9% peak-location error (~21x, per imp-96286), and the
 * dE_flow/dN (flow-drift) term is ruled out -- it has the wrong N-scaling (ratio varies >3 decades)
 * and, best-fit, makes the location error worse (9.9e-1 vs 9.08e-2). The location error is an
 * algebraic E_flow^2 effect, not a derivative effect.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Component model is the inherited
 * imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-96266-eflow-peak-recovery-residual (M3: ~9% location / <1e-3 height first-order recovery)
 * @see imp-96286-eflow-peak-location-error-order (E_flow^2 / x^2 correction closes location ~21x)
 * @see imp-96308-eflow-peak-third-order-shrink (third Taylor order further ~x shrink)
 * @see imp-96329-eflow-tail-law-global (global reconstruction-tail law err_k = -sigma_CF*(-x)^(k+1)/(1+x))
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96151/imp-96266/imp-96286

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (identical to imp-96266/imp-96286; no re-derivation).
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

// imp-33723 closed-form crossover fixed point (identical to imp-96266/imp-96286).
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
const xOf = (N) => {
  const p = parts(N);
  return p.E_flow / (p.E_trunc + p.E_coll);
};
const reconOrder1 = (N) => sigmaCF(N) * (1 - xOf(N)); // imp-96266 first-order (drops x^2)
const reconOrder2 = (N) => {
  const x = xOf(N);
  return sigmaCF(N) * (1 - x + x * x); // E_flow^2 candidate: adds the +x^2 Taylor term (imp-96286)
};
// Exact first-order residual: err1 = reconOrder1 - sigma_full = -sigma_CF*x^2/(1+x).
const err1 = (N) => reconOrder1(N) - sigmaFull(N);
// Candidate A functional form (pure E_flow^2, leading Taylor): -sigma_CF*x^2.
const candA = (N) => -sigmaCF(N) * xOf(N) ** 2;
// Candidate B functional form (flow drift, derivative): dE_flow/dN (central difference).
const dEflowdN = (N) => {
  const h = N * 1e-6;
  return (parts(N + h).E_flow - parts(N - h).E_flow) / (2 * h);
};

// Peak locator on a shrinking log grid over [1e4,1e8] (matches imp-96266/imp-96286).
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

const PEAK_FULL = findPeak(sigmaFull);
const Ns = PEAK_FULL.N;

// (F1)/(F2) functional-form ratios across the peak region 1e4..1e7.
const RATIO_GRID = [4, 4.5, 5, 5.5, 6, 6.5, 7].map((k) => {
  const N = Math.pow(10, k);
  const e = err1(N);
  return {
    N: `1e${k}`,
    err1_over_candA: +(e / candA(N)).toFixed(5), // = 1/(1+x), stays ~[0.90,0.99]
    err1_over_candB: +(e / dEflowdN(N)).toExponential(4), // NOT constant, spans >3 decades
  };
});
const RATIO_A_MIN = Math.min(...RATIO_GRID.map((r) => r.err1_over_candA));
const RATIO_A_MAX = Math.max(...RATIO_GRID.map((r) => r.err1_over_candA));
const RATIO_B_ABS = RATIO_GRID.map((r) => Math.abs(r.err1_over_candB));
const RATIO_B_SPREAD = Math.max(...RATIO_B_ABS) / Math.min(...RATIO_B_ABS); // ~2600 (wrong scaling)

// (F3) reconstruction test: E_flow^2 term vs a best-fit dE_flow/dN drift correction.
// Least-squares scale for the dE_flow/dN correction over the peak region 1e5..1e7.
let lsqNum = 0;
let lsqDen = 0;
for (let d = 5; d <= 7 + 1e-12; d += 0.05) {
  const N = Math.pow(10, d);
  const need = sigmaFull(N) - reconOrder1(N); // +sigma_CF*x^2/(1+x)
  const b = dEflowdN(N);
  lsqNum += need * b;
  lsqDen += b * b;
}
const C_DEDN = lsqNum / lsqDen; // huge negative scale (dE_flow/dN is tiny and wrongly shaped)
const reconDrift = (N) => reconOrder1(N) + C_DEDN * dEflowdN(N);

const PEAK_O1 = findPeak(reconOrder1);
const PEAK_EFLOWSQ = findPeak(reconOrder2);
const PEAK_DRIFT = findPeak(reconDrift);
const relLoc = (p) => Math.abs(p.N / Ns - 1);

const LOC_ERR_O1 = relLoc(PEAK_O1); // ~9.08e-2
const LOC_ERR_EFLOWSQ = relLoc(PEAK_EFLOWSQ); // ~4.37e-3
const LOC_ERR_DRIFT = relLoc(PEAK_DRIFT); // ~9.9e-1 (worse)
const EFLOWSQ_GAP_REDUCTION = LOC_ERR_O1 / LOC_ERR_EFLOWSQ; // ~20.8x
const X_AT_PEAK = xOf(Ns); // ~3.155e-2

export const IMP96403_EFLOW_PEAK_LOCATION_EFLOWSQ_VS_DEDN = {
  id: 'imp-96403',
  proofSection: 'S-frontier',
  question:
    'Decide which of the two second-order corrections named in imp-96266 M3 -- an E_flow^2 (Taylor ' +
    'x^2) term OR a dE_flow/dN (flow-drift) term -- closes the ~9% peak-LOCATION error of the ' +
    'first-order reconstruction sigma_CF*(1 - E_flow/(E_trunc+E_coll)). imp-96286 settled the ' +
    'E_flow^2 branch (~21x); this module isolates and rules out the dE_flow/dN branch. Measurement ' +
    'only; conditional-share diagnostic; no QED.',
  exactRelation:
    'sigma_full = sigma_CF/(1 + x), x = E_flow/(E_trunc+E_coll). The first-order residual is ' +
    'err1 = sigma_CF*(1-x) - sigma_full = -sigma_CF*x^2/(1+x): quadratic in the flow term (x^2), ' +
    'so the missing correction is E_flow^2 in form, not a flow derivative.',
  landmarks: {
    peak_N_full: +PEAK_FULL.N.toExponential(6), // ~9.218632e5
    peak_sigma_full: +PEAK_FULL.sigma.toFixed(6), // ~0.949429
    x_at_peak: +X_AT_PEAK.toExponential(4), // ~3.1552e-2
    ratio_err1_over_candA_min: +RATIO_A_MIN.toFixed(5), // ~0.90400 (= 1/(1+x) at 1e4)
    ratio_err1_over_candA_max: +RATIO_A_MAX.toFixed(5), // ~0.98605 (= 1/(1+x) at 1e7)
    ratio_err1_over_candB_spread: +RATIO_B_SPREAD.toExponential(3), // ~2.6e3 (wrong N-scaling)
    lsq_scale_dEflowdN: +C_DEDN.toExponential(4), // ~-2.6923e6 (huge; dE_flow/dN is tiny)
  },
  reconstructionLadder: {
    order1_1_minus_x: {
      peak_N: +PEAK_O1.N.toExponential(6), // ~1.005554e6
      loc_rel_err: +LOC_ERR_O1.toExponential(3), // ~9.08e-2
    },
    eflowsq_1_minus_x_plus_x2: {
      peak_N: +PEAK_EFLOWSQ.N.toExponential(6), // ~9.178312e5
      loc_rel_err: +LOC_ERR_EFLOWSQ.toExponential(3), // ~4.37e-3
    },
    dedn_drift_best_fit: {
      peak_N: +PEAK_DRIFT.N.toExponential(6), // way off
      loc_rel_err: +LOC_ERR_DRIFT.toExponential(3), // ~9.9e-1 (WORSE than order1)
    },
    eflowsq_location_gap_reduction: +EFLOWSQ_GAP_REDUCTION.toFixed(2), // ~20.76x
  },
  ratioGrid: RATIO_GRID,
  finding: {
    F1_missing_term_is_eflowsq_form:
      'The exact first-order residual err1 = -sigma_CF*x^2/(1+x) matches the pure E_flow^2 candidate ' +
      '-sigma_CF*x^2 with ratio err1/candA = 1/(1+x), which stays in ~[0.90, 0.99] across the peak ' +
      'region 1e4..1e7. The missing correction is quadratic in the flow term.',
    F2_dedn_has_wrong_scaling:
      'Against the derivative candidate dE_flow/dN the ratio err1/candB is NOT constant -- it ranges ' +
      '~1.2e5 (at 1e4) to ~3.2e8 (at 1e7), spanning >3 orders of magnitude. No single scale turns ' +
      'dE_flow/dN into err1, so the missing correction is not a flow-drift (derivative) term.',
    F3_only_eflowsq_closes_location:
      'The E_flow^2 reconstruction sigma_CF*(1 - x + x^2) drops the peak-location error from 9.08e-2 ' +
      'to 4.37e-3 (~21x, the imp-96286 result). A best-least-squares-scaled dE_flow/dN correction ' +
      '(recon1 + c*dE_flow/dN) does NOT close it -- location error grows to ~9.9e-1, WORSE than the ' +
      'uncorrected 9.08e-2, because the wrongly-shaped derivative distorts the slope through the ' +
      'flat peak.',
    F4_derivative_branch_dead_end:
      'The pointwise reconstruction already evaluates x(N) = E_flow(N)/(E_trunc+E_coll(N)) at each ' +
      'N, so it already carries the exact local dE_flow/dN; there is no missing-drift degree of ' +
      'freedom. The residual is purely the algebraic x^2 (E_flow^2) Taylor tail of 1/(1+x), ' +
      'consistent with imp-96286/imp-96308/imp-96329. A dE_flow/dN correction is neither needed nor ' +
      'the right lever.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Of the two candidate second-order corrections ' +
    'imp-96266 M3 names, the E_flow^2 (Taylor x^2) term is the one that closes the ~9% peak-location ' +
    'error: the exact first-order residual err1 = -sigma_CF*x^2/(1+x) matches the -sigma_CF*x^2 form ' +
    'to within the 1/(1+x) factor (~[0.90,0.99]) and re-applying it (sigma_CF*(1 - x + x^2)) reduces ' +
    'the location error ~21x to 4.37e-3 (the imp-96286 result). The dE_flow/dN (flow-drift) candidate ' +
    'is RULED OUT: err1/(dE_flow/dN) varies over >3 decades (wrong N-scaling), and a best-fit ' +
    'dE_flow/dN correction makes the location error WORSE (~9.9e-1 vs 9.08e-2). The pointwise ' +
    'reconstruction already carries the exact local dE_flow/dN, so the residual is purely the ' +
    'algebraic E_flow^2/x^2 Taylor tail of 1/(1+x). Measurement on the inherited sub-terms only; the ' +
    'C_mb GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96266 (M3 first-order recovery ~9% location); imp-96286 (E_flow^2/x^2 correction closes ' +
    'location ~21x); imp-96308 (third Taylor order); imp-96329 (global reconstruction-tail law); ' +
    'imp-3220 (interior peak); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96403_EFLOW_PEAK_LOCATION_EFLOWSQ_VS_DEDN_ASSERTIONS = [
  {
    // (F1) the missing term has the E_flow^2 form: err1/(-sigma_CF*x^2) = 1/(1+x) in ~[0.9,1.0].
    id: 'imp96403-missing-term-is-eflowsq-form',
    description: 'err1/candA = 1/(1+x) stays in ~[0.90,1.0) across the peak region (E_flow^2 form)',
    holds: () => RATIO_A_MIN > 0.85 && RATIO_A_MAX < 1.0 && RATIO_A_MAX > RATIO_A_MIN,
  },
  {
    // (F2) the dE_flow/dN candidate has the wrong N-scaling: err1/candB spans >3 decades.
    id: 'imp96403-dedn-has-wrong-scaling',
    description: 'err1/(dE_flow/dN) is not constant -- ratio magnitude spans more than 100x across 1e4..1e7',
    holds: () => RATIO_B_SPREAD > 100,
  },
  {
    // (F3) the E_flow^2 correction closes the location gap >10x (reproduces imp-96286).
    id: 'imp96403-eflowsq-closes-location-gap',
    description: 'sigma_CF*(1-x+x^2) reduces the peak location error >10x to < 1e-2 (imp-96286)',
    holds: () => LOC_ERR_EFLOWSQ < 1e-2 && EFLOWSQ_GAP_REDUCTION > 10,
  },
  {
    // (F3) the best-fit dE_flow/dN correction does NOT close the gap -- it makes location WORSE.
    id: 'imp96403-dedn-correction-does-not-close',
    description: 'best-fit dE_flow/dN reconstruction leaves location error worse than the uncorrected order1',
    holds: () => LOC_ERR_DRIFT > LOC_ERR_O1,
  },
  {
    // Cross-check: full-share peak reproduces the imp-3220/imp-96266 landmark.
    id: 'imp96403-full-peak-matches-landmark',
    description: 'full share peaks at N ~ 9.22e5 with sigma_max ~ 0.9494 (imp-3220 landmark)',
    holds: () =>
      Math.abs(PEAK_FULL.N / 9.22e5 - 1) < 5e-3 && Math.abs(PEAK_FULL.sigma - 0.9494) < 1e-3,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96403-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96403_EFLOW_PEAK_LOCATION_EFLOWSQ_VS_DEDN.isRigorous === false &&
      /NO QED/.test(IMP96403_EFLOW_PEAK_LOCATION_EFLOWSQ_VS_DEDN.verdict) &&
      /refereed bound is changed/i.test(IMP96403_EFLOW_PEAK_LOCATION_EFLOWSQ_VS_DEDN.verdict),
  },
];

for (const a of IMP96403_EFLOW_PEAK_LOCATION_EFLOWSQ_VS_DEDN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96403-eflow-peak-location-eflowsq-vs-dedn assertion failed: ${a.id}`);
  }
}
