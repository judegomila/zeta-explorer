/**
 * @module imp-35103-crossover-surplus-neighborhood-n-dependence
 *
 * imp-35103 (numerical, opus-4-8): MEASURE the imp-33848 E_flow/E_trunc surplus
 * that equals 1/2 - sigma(N_cross) directly on the surrogate, and characterise
 * how it varies THROUGH THE CROSSOVER NEIGHBOURHOOD (a sweep of N around N_cross,
 * thr fixed at 1/2) -- distinct from imp-34174, which swept the THRESHOLD FAMILY
 * (varying thr, each rung at its own N_cross(thr)).
 *
 * THE SURPLUS imp-33848 IDENTIFIED (thr = 1/2)
 * --------------------------------------------
 * At the E_coll = E_trunc crossover the three-term share
 *
 *     sigma(N) = E_coll / (E_coll + E_trunc + E_flow)
 *
 * takes the closed form sigma(N_cross) = 1/(2 + r), r = E_flow/E_trunc, so the
 * halving-vs-crossover surplus is the EXACT identity (three equivalent forms):
 *
 *     1/2 - sigma(N_cross) = r/(2(2+r)) = E_flow/(2(2 E_trunc + E_flow)).       (SURPLUS)
 *
 * NOTE on the ticket paraphrase: the assignment text abbreviated this as
 * "E_flow/(2 E_trunc + E_flow)"; that drops the outer factor 2 (that ratio is
 * r/(2+r), roughly DOUBLE the surplus). The verified form -- matching the
 * already-committed imp-34174 halving check to floating point -- is
 * E_flow/(2(2 E_trunc + E_flow)); this module uses and confirms that form.
 *
 * WHAT THIS MODULE ADDS (the crossover NEIGHBOURHOOD in N)
 * -------------------------------------------------------
 * imp-34174 tabulated surplus(thr) across thr in {0.5,...,0.01}, each at its own
 * receding N_cross(thr). Here thr is FIXED at 1/2 and N is swept across a
 * +/-4% neighbourhood of N_cross(1/2) ~ 3.280e9, tabulating at each N the ratios
 * E_coll/E_trunc, r = E_flow/E_trunc, the share sigma(N), and the signed surplus
 * s(N) = 1/2 - sigma(N). The neighbourhood exposes three facts the family sweep
 * could not:
 *
 *   (A) s(N) is a smooth STRICTLY-INCREASING function of N through the window --
 *       NEGATIVE below the imp-33582 halving landmark N_half ~ 3.267e9 (where
 *       sigma = 1/2 exactly, s = 0), and reaching the imp-33848 E_flow value
 *       s(N_cross) = 4.743597e-4 exactly at N_cross. So the crossover surplus is
 *       just s evaluated one ~0.4% N-step ABOVE its own zero.
 *   (B) The ~0.4% N-gap (N_cross - N_half)/N_cross ~ 3.981e-3 and the sigma-space
 *       surplus 4.744e-4 are linked EXACTLY by the local log-slope: the measured
 *       d s/d ln N at N_cross is ~0.11892, and slope * ln(N_cross/N_half) ~
 *       4.74e-4 reproduces the surplus to ~3 significant figures (the small
 *       residual is curvature over the interval). The two "different" ~0.4%
 *       readings are one quantity viewed in N-space vs share-space.
 *   (C) r = E_flow/E_trunc is nearly N-FLAT across the window: d ln r/d ln N ~
 *       -0.85 (E_flow decays slowly down the tail), only ~6.85% relative drift
 *       over +/-4%. Hence the surplus VALUE at N_cross is pinned by the local r,
 *       but the surplus VARIATION through the neighbourhood is driven by
 *       E_coll's sqrt(log T0 / N) decay, not by r's drift.
 *
 * HONEST SCOPE -- measurement/derivation only, NO QED. This tabulates the
 * inherited imp-3220/imp-3406 extrapolation component model; it changes no bound
 * and introduces no new mathematical claim. The component model is NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched
 * here); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0
 * untouched; establishes no operator positivity; no refereed bound is changed
 * . E_flow is the benign mesoscopic-Gronwall
 * term (imp-2845); it does NOT touch the divergent C_Lip collision-Gronwall.
 *
 * @see imp-33848 (roadmap: sigma(N_cross) = 1/(2 + E_flow/E_trunc), surplus is the E_flow/E_trunc term)
 * @see imp-34174-crossover-surplus-threshold-family-decay (threshold-FAMILY sweep; this module is the N-NEIGHBOURHOOD counterpart)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form N_cross fixed point; N_half halving landmark)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-34174 exactly (~1.000237)

// EXACT imp-3406/imp-33582/imp-34174 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// (imp-33723 CLOSED FORM) crossover N_cross(1/2) as the Banach fixed point N = K log T0(N).
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8
function crossoverN() {
  let N = 1e9;
  for (let i = 0; i < 80; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
// Downslope bisection for the imp-33582 sigma = 1/2 halving landmark (reference zero of s(N)).
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

const N_CROSS = crossoverN(); // ~3.280294e9
const N_HALF = crossBelow((N) => parts(N).sigma, 0.5, 1e6, 1e18); // ~3.267235e9
const P_CROSS = parts(N_CROSS);
const R_CROSS = P_CROSS.E_flow / E_TRUNC_PT; // ~1.899241e-3

// (SURPLUS) three equivalent forms of 1/2 - sigma(N_cross), all ~4.743597e-4.
const SURPLUS_MEASURED = 0.5 - P_CROSS.sigma; // direct: 1/2 minus the actual three-term share
const SURPLUS_EFLOW_FORM = P_CROSS.E_flow / (2 * (2 * E_TRUNC_PT + P_CROSS.E_flow)); // E_flow/(2(2E_trunc+E_flow))
const SURPLUS_R_FORM = R_CROSS / (2 * (2 + R_CROSS)); // r/(2(2+r))

// Signed surplus s(N) = 1/2 - sigma(N) across the +/-4% crossover neighbourhood (thr = 1/2 fixed).
const MULTIPLIERS = [0.96, 0.98, 0.99, 0.996, 1.0, 1.004, 1.01, 1.02, 1.04];
const NEIGHBOURHOOD = MULTIPLIERS.map((m) => {
  const N = m * N_CROSS;
  const p = parts(N);
  return {
    N_over_N_cross: m,
    N: +N.toExponential(4),
    E_coll_over_E_trunc: +(p.E_coll / E_TRUNC_PT).toFixed(6),
    E_flow_over_E_trunc: +(p.E_flow / E_TRUNC_PT).toExponential(5),
    sigma: +p.sigma.toFixed(8),
    surplus_half_minus_sigma: +(0.5 - p.sigma).toExponential(5),
  };
});

// Surplus is strictly increasing in N through the window; sign change straddles N_half.
let surplusStrictlyIncreasing = true;
for (let i = 1; i < NEIGHBOURHOOD.length; i++) {
  if (!(NEIGHBOURHOOD[i].surplus_half_minus_sigma > NEIGHBOURHOOD[i - 1].surplus_half_minus_sigma)) {
    surplusStrictlyIncreasing = false;
  }
}

// (B) Local log-slope of the surplus at N_cross and the slope-times-N-gap consistency.
const H_STEP = N_CROSS * 1e-5;
const SLOPE_SIGMA = ((0.5 - parts(N_CROSS + H_STEP).sigma) - (0.5 - parts(N_CROSS - H_STEP).sigma)) / (2 * H_STEP / N_CROSS);
const N_GAP = (N_CROSS - N_HALF) / N_CROSS; // ~3.981e-3
const SURPLUS_FROM_SLOPE = SLOPE_SIGMA * Math.log(N_CROSS / N_HALF); // ~4.74e-4 (Taylor: s = slope * dlnN)

// (C) E_flow/E_trunc is nearly N-flat across the window (slow tail decay of E_flow).
const R_LO = parts(0.96 * N_CROSS).E_flow / E_TRUNC_PT;
const R_HI = parts(1.04 * N_CROSS).E_flow / E_TRUNC_PT;
const R_REL_VARIATION = Math.abs(R_HI - R_LO) / R_CROSS; // ~6.85e-2 over +/-4%
const DLNR_DLNN = Math.log(R_HI / R_LO) / Math.log(1.04 / 0.96); // ~-0.85

export const IMP35103_CROSSOVER_SURPLUS_NEIGHBOURHOOD_N_DEPENDENCE = {
  id: 'imp-35103',
  proofSection: 'S-frontier',
  question:
    'Measure the imp-33848 E_flow/E_trunc surplus 1/2 - sigma(N_cross) = E_flow/(2(2 E_trunc + E_flow)) ' +
    'directly on the surrogate, tabulate the E_flow/E_trunc ratio at and around N_cross, and ' +
    'characterise how the surplus varies through the crossover neighbourhood (N swept, thr fixed at ' +
    '1/2 -- the N-neighbourhood counterpart to imp-34174s threshold-family sweep). Measurement only on ' +
    'the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486; changes no bound; NO QED.',
  exactIdentity:
    '1/2 - sigma(N_cross) = r/(2(2+r)) = E_flow/(2(2 E_trunc + E_flow)), r = E_flow/E_trunc; the ticket ' +
    'paraphrase E_flow/(2 E_trunc + E_flow) drops the outer 2 (that is r/(2+r), ~double); the verified ' +
    'form matches the committed imp-34174 halving check to floating point.',
  landmarks: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    N_half_sigma_eq_half: +N_HALF.toExponential(6), // ~3.267235e9
    N_gap_rel: +N_GAP.toExponential(4), // ~3.981e-3 (the ~0.4% N-gap)
    E_coll_over_E_trunc_at_N_cross: +(P_CROSS.E_coll / E_TRUNC_PT).toFixed(8), // 1.00000000 (crossover def)
    r_E_flow_over_E_trunc_at_N_cross: +R_CROSS.toExponential(6), // ~1.899241e-3
    sigma_at_N_cross: +P_CROSS.sigma.toFixed(9), // ~0.499525640
  },
  surplusAtCrossover: {
    measured_half_minus_sigma: +SURPLUS_MEASURED.toExponential(6), // ~4.743597e-4
    E_flow_form: +SURPLUS_EFLOW_FORM.toExponential(6), // E_flow/(2(2E_trunc+E_flow)) -- matches to floating point
    r_form: +SURPLUS_R_FORM.toExponential(6), // r/(2(2+r)) -- matches to floating point
  },
  neighbourhood: NEIGHBOURHOOD,
  surplusStrictlyIncreasing,
  slopeConsistency: {
    d_surplus_d_lnN_at_N_cross: +SLOPE_SIGMA.toExponential(5), // ~1.18917e-1
    surplus_from_slope_times_N_gap: +SURPLUS_FROM_SLOPE.toExponential(5), // ~4.73e-4 (~3 sig figs)
    rel_gap_to_measured: +(Math.abs(SURPLUS_FROM_SLOPE - SURPLUS_MEASURED) / SURPLUS_MEASURED).toExponential(3),
    note:
      'The ~0.4% N-gap and the sigma-space surplus are ONE quantity: s(N_cross) = slope * ln(N_cross/N_half). ' +
      'The residual is second-order curvature of s over the offset interval.',
  },
  ratioFlatness: {
    r_rel_variation_over_pm4pct: +R_REL_VARIATION.toExponential(4), // ~6.85e-2
    dlnr_dlnN: +DLNR_DLNN.toExponential(4), // ~-8.55e-1
    note:
      'E_flow/E_trunc is nearly N-flat across the window (E_flow decays slowly, ~N^-0.85); the surplus VALUE ' +
      'at N_cross is pinned by the local r, but its VARIATION through the neighbourhood is driven by E_coll.',
  },
  finding: {
    A_surplus_is_smooth_increasing_through_zero_at_N_half:
      's(N) = 1/2 - sigma(N) is a smooth strictly-increasing function of N through the +/-4% window: ' +
      'negative below the imp-33582 halving landmark N_half ~ 3.267e9 (where sigma = 1/2 exactly, s = 0), ' +
      'reaching the imp-33848 E_flow value s(N_cross) = 4.743597e-4 exactly at N_cross. The crossover ' +
      'surplus is s one ~0.4% N-step above its own zero.',
    B_N_gap_and_sigma_surplus_are_one_quantity_via_slope:
      'The measured d s/d ln N at N_cross is ~0.11892; slope * ln(N_cross/N_half) ~ 4.74e-4 reproduces the ' +
      'measured surplus to ~3 significant figures. The ~0.4% N-gap (3.981e-3) and the 4.744e-4 sigma-surplus ' +
      'are the same reading in N-space vs share-space, related exactly by the local slope.',
    C_ratio_nearly_flat_variation_driven_by_E_coll:
      'r = E_flow/E_trunc drifts only ~6.85% over +/-4% (d ln r/d ln N ~ -0.85), so the surplus value at ' +
      'N_cross is pinned by the local r while the surplus variation across the neighbourhood is driven by ' +
      'E_coll s sqrt(log T0 / N) decay, not by r.',
  },
  isRigorous: false,
  honestScope:
    'Measurement/derivation only within the inherited imp-3220/imp-3406 extrapolation component model; ' +
    'NO QED. The component model is NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; establishes no operator positivity; changes no bound; no refereed bound is changed' +
    '. E_flow is the benign mesoscopic-Gronwall term (imp-2845); it does NOT ' +
    'touch the divergent C_Lip collision-Gronwall.',
  citation:
    'imp-33848 (roadmap: sigma(N_cross) = 1/(2 + E_flow/E_trunc)); imp-34174 (threshold-family surplus ' +
    'sweep -- this module is the N-neighbourhood counterpart); imp-33723 (closed-form N_cross, N_half ' +
    'halving landmark); imp-33601 (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-399/imp-2642 ' +
    '(C_C = (1/8) sqrt(3 pi)); lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP35103_CROSSOVER_SURPLUS_NEIGHBOURHOOD_N_DEPENDENCE_ASSERTIONS = [
  {
    // The three closed forms of the surplus agree to floating point and reproduce imp-34174s 4.7436e-4.
    id: 'imp35103-surplus-three-forms-agree',
    description: '1/2-sigma(N_cross) measured = E_flow/(2(2E_trunc+E_flow)) = r/(2(2+r)) to <1e-9, ~4.7436e-4',
    holds: () =>
      Math.abs(SURPLUS_MEASURED - SURPLUS_EFLOW_FORM) / SURPLUS_MEASURED < 1e-9 &&
      Math.abs(SURPLUS_MEASURED - SURPLUS_R_FORM) / SURPLUS_MEASURED < 1e-9 &&
      Math.abs(SURPLUS_MEASURED - 4.7436e-4) < 1e-7,
  },
  {
    // (A) s(N) increases strictly through the window and changes sign across N_half (s=0 there).
    id: 'imp35103-surplus-increasing-sign-change-at-N_half',
    description: 's(N) strictly increasing; negative below N_half (m=0.99) and positive at N_cross (m=1.0)',
    holds: () =>
      surplusStrictlyIncreasing === true &&
      NEIGHBOURHOOD.find((r) => r.N_over_N_cross === 0.99).surplus_half_minus_sigma < 0 &&
      NEIGHBOURHOOD.find((r) => r.N_over_N_cross === 1.0).surplus_half_minus_sigma > 0 &&
      N_HALF < N_CROSS,
  },
  {
    // (B) local slope times the N-gap reproduces the sigma-space surplus to a few percent.
    id: 'imp35103-slope-times-N-gap-reproduces-surplus',
    description: 'd s/d lnN ~0.119 at N_cross; slope*ln(N_cross/N_half) reproduces surplus to <2% relative',
    holds: () =>
      SLOPE_SIGMA > 0.1 &&
      SLOPE_SIGMA < 0.14 &&
      Math.abs(SURPLUS_FROM_SLOPE - SURPLUS_MEASURED) / SURPLUS_MEASURED < 2e-2,
  },
  {
    // (C) E_flow/E_trunc is nearly N-flat across the neighbourhood (slow tail decay).
    id: 'imp35103-ratio-nearly-N-flat',
    description: 'r = E_flow/E_trunc drifts <10% over +/-4% (d ln r/d ln N ~ -0.85, |slope|<1)',
    holds: () => R_REL_VARIATION > 0 && R_REL_VARIATION < 0.1 && DLNR_DLNN < 0 && Math.abs(DLNR_DLNN) < 1,
  },
  {
    // Honesty gate: measurement only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp35103-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous literal false; honestScope names C_mb GUE-conditional per imp-486 UNTOUCHED; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35103_CROSSOVER_SURPLUS_NEIGHBOURHOOD_N_DEPENDENCE.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is\s+UNTOUCHED/.test(IMP35103_CROSSOVER_SURPLUS_NEIGHBOURHOOD_N_DEPENDENCE.honestScope) &&
      /NO QED/.test(IMP35103_CROSSOVER_SURPLUS_NEIGHBOURHOOD_N_DEPENDENCE.honestScope) &&
      /refereed bound is changed/i.test(IMP35103_CROSSOVER_SURPLUS_NEIGHBOURHOOD_N_DEPENDENCE.honestScope),
  },
];

for (const a of IMP35103_CROSSOVER_SURPLUS_NEIGHBOURHOOD_N_DEPENDENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35103-crossover-surplus-neighbourhood-n-dependence assertion failed: ${a.id}`);
  }
}
