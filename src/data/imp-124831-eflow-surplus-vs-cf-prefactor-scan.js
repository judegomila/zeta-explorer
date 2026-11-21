/**
 * @module imp-124831-eflow-surplus-vs-cf-prefactor-scan
 *
 * imp-124831 (accuracy, frontier-direction): imp-33848 reduced the strict ordering
 * N_half < N_cross to the sigma-space surplus
 *
 *     surplus := 1/2 - sigma(N_cross) = E_flow/(2(2 E_trunc + E_flow)) = 1/2 - 1/(2 + E_flow/E_trunc),
 *
 * and imp-35102 verified that surplus at the SINGLE shipped imp-398 C_F prefactor
 * (C_F = (log(T0/2pi)+1)/2pi), reporting surplus ~4.74e-4 and an ~0.4% N-space gap. That leaves
 * OPEN how large or small the ordering gap can become inside the component model, and whether the
 * ordering can ever invert.
 *
 * This module SCANS the surplus and the N_half/N_cross ratio as the imp-398 C_F prefactor -- the
 * E_flow amplitude -- is scaled by a symbolic factor s across a plausible band (s in
 * {0, 1/4, 1/2, 1, 2, 4, 8}). C_F enters E_flow linearly, so scaling C_F by s scales E_flow by s.
 *
 * THE COMPONENT MODEL (identical pinned sub-terms to imp-33601 / imp-33848 / imp-35102 -- no
 * fresh terms; only the C_F amplitude is perturbed as a symbolic axis)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_coll + E_trunc + E_flow),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)                 (dominant, GUE-conditional C_H)
 *     E_flow  = s * C_F (log T0 / T0) * Gronwall, C_F = (log(T0/2pi)+1)/2pi  (imp-398, scaled by s)
 *     E_trunc = 3.06e-5                                       (N-independent fixed strip, imp-2631)
 *     T0      = effectiveHeightForN(N)                        (Riemann-von Mangoldt inverse)
 *
 * WHAT THE SCAN SHOWS (measurement only)
 * --------------------------------------
 *   (M1) N_cross IS INVARIANT under the C_F scale. The crossover E_coll = E_trunc depends on
 *        E_coll and E_trunc alone, neither of which contains C_F, so N_cross ~3.280294e9 is fixed
 *        for every s. The entire ordering gap therefore lives in the motion of N_half.
 *   (M2) THE SURPLUS IS NEAR-LINEAR IN THE C_F AMPLITUDE. surplus(s) = (s r / 2)/(2 + s r) with
 *        r = E_flow/E_trunc at N_cross (~1.899e-3 at s=1); for the tiny s r in this band surplus
 *        ~ s r / 4, so the measured d ln surplus / d ln s stays essentially 1 (0.9986..0.9946
 *        across the band) -- the surplus tracks the C_F amplitude one-for-one, drifting only by the
 *        second-order (2 + s r) denominator.
 *   (M3) THE N_half/N_cross RATIO FALLS LINEARLY. ratio(s) = N_half/N_cross drops ~3.98e-3 per
 *        unit s (1.0 at s=0 -> 0.9960 at s=1 -> 0.9680 at s=8), so the N-space gap grows in step
 *        with the surplus and stays the ~8.4x amplification of it (the E_coll ~ N^{-1/2} Jacobian),
 *        the amplification factor itself drifting only mildly (8.38 -> 8.48) across the band.
 *   (M4) THE ORDERING NEVER INVERTS WHILE E_flow > 0. surplus(s) > 0 and ratio(s) < 1 for every
 *        s > 0; at s = 0 the flow term vanishes, surplus -> 0 and N_half -> N_cross (the ordering
 *        collapses to non-strict equality, NOT inversion). Inversion would require s < 0, i.e.
 *        E_flow < 0, which the imp-398 Gronwall term (a product of strictly positive factors)
 *        cannot produce. So N_half <= N_cross holds identically, strictly whenever E_flow > 0.
 *
 * The punchline: the ~0.4% ordering gap is not a fragile pinned-constant coincidence -- it is the
 * linear image of the C_F amplitude. Halve C_F and the gap halves; double it and it doubles; drive
 * C_F to zero and the two landmarks merge but never cross. The strict ordering is as robust as the
 * strict positivity of the Gronwall flow term.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The C_F prefactor
 * is perturbed only as a SYMBOLIC axis (the shipped value is s = 1); the component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0
 * is untouched; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35102-nhalf-ncross-strictness-multirung-verify (single-C_F surplus + rung bracket)
 * @see imp-33848-nhalf-ncross-strict-ordering-closed-form (the two closed-form conditions)
 * @see imp-36182-nhalf-ncross-component-model-honest-status (model-internal caveat)
 * @see imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed strip); imp-486 (C_mb GUE-conditional)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33601/imp-35102 exactly

// EXACT imp-3406/imp-33601 sub-terms; the ONLY perturbation is the symbolic C_F scale s (s = 1
// reproduces the shipped model verbatim).
function parts(N, s) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = s * C_F * (L / T0) * GRONWALL; // C_F amplitude scaled by s
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H), C_F-free
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, C_F, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Downslope bisection in log N for a strictly-decreasing quantity f: first N with f < target.
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

// (M1) N_cross = crossover E_coll = E_trunc is C_F-free, so it is computed once and reused.
const N_CROSS = crossBelow((N) => parts(N, 1).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280294e9
const R_FLOW_TRUNC_UNIT = parts(N_CROSS, 1).E_flow / E_TRUNC_PT; // r at s = 1, ~1.899e-3

// The symbolic C_F-amplitude band. s = 1 is the shipped imp-398 value.
const SCALES = Object.freeze([0, 0.25, 0.5, 1, 2, 4, 8]);

const SCAN = SCALES.map((s) => {
  // At s = 0 the flow term vanishes and sigma(N_cross) = 1/2 exactly -> N_half = N_cross.
  const N_half = crossBelow((N) => parts(N, s).sigma, 0.5, 1e6, 1e18);
  const pc = parts(N_CROSS, s);
  const surplus = 0.5 - pc.sigma; // 1/2 - sigma(N_cross)
  const rs = pc.E_flow / E_TRUNC_PT; // E_flow/E_trunc at N_cross for this s (= s * R_FLOW_TRUNC_UNIT)
  const surplusClosed = 0.5 - 1 / (2 + rs); // closed form 1/2 - 1/(2 + E_flow/E_trunc)
  const Ngap = (N_CROSS - N_half) / N_CROSS; // relative N-space gap
  const ratio = N_half / N_CROSS; // N_half/N_cross ordering ratio (<= 1)
  return {
    s,
    N_half: +N_half.toExponential(6),
    ratio: +ratio.toFixed(9),
    surplus: +surplus.toExponential(6),
    surplusClosed: +surplusClosed.toExponential(6),
    Ngap: +Ngap.toExponential(4),
    NgapOverSurplus: s === 0 ? null : +(Ngap / surplus).toFixed(3),
    ordered: N_half < N_CROSS,
  };
});

// (M2) surplus elasticity d ln surplus / d ln s, measured on the s = 1..2 and s = 4..8 pairs.
function surplusAt(s) {
  return 0.5 - parts(N_CROSS, s).sigma;
}
function logElasticity(s1, s2) {
  return (
    (Math.log(surplusAt(s2)) - Math.log(surplusAt(s1))) /
    (Math.log(s2) - Math.log(s1))
  );
}
const ELASTICITY_1_2 = +logElasticity(1, 2).toFixed(6); // ~0.9986 (near-linear)
const ELASTICITY_4_8 = +logElasticity(4, 8).toFixed(6); // ~0.9946 (slight denominator sub-linearity)

// (M3) ratio slope d ratio / d s across the linear body of the band (s = 1 vs s = 2).
const RATIO_SLOPE_PER_S =
  (SCAN.find((r) => r.s === 2).ratio - SCAN.find((r) => r.s === 1).ratio) / (2 - 1); // ~-3.98e-3

export const IMP124831_EFLOW_SURPLUS_VS_CF_PREFACTOR_SCAN = {
  id: 'imp-124831',
  proofSection: 'S-frontier',
  question:
    'Measure the imp-33848 surplus 1/2 - sigma(N_cross) and the N_half/N_cross ordering ratio as ' +
    'the imp-398 C_F prefactor (the E_flow amplitude) is scaled across a symbolic band, to quantify ' +
    'how large/small the ordering gap can become in the component model and confirm the ordering ' +
    'never inverts while E_flow > 0. Measurement/derivation only; conditional-share diagnostic; ' +
    'NOT an RH bound; no QED.',
  model: {
    sigma: 'E_coll / (E_coll + E_trunc + E_flow)',
    E_flow: 's * C_F (log T0 / T0) Gronwall, C_F = (log(T0/2pi)+1)/2pi  (imp-398, scaled by s)',
    E_coll: 'C_C_PINNED sqrt(log T0 / N)  (GUE-conditional, C_F-free)',
    E_trunc: '3.06e-5  (N-independent fixed strip, imp-2631)',
    shippedScale: 's = 1 reproduces the shipped imp-398 model verbatim',
  },
  landmarks: {
    N_cross_Ecoll_eq_Etrunc: +N_CROSS.toExponential(6), // ~3.280294e9, C_F-invariant
    N_cross_is_CF_invariant: true,
    E_flow_over_E_trunc_at_N_cross_unit_scale: +R_FLOW_TRUNC_UNIT.toExponential(4), // ~1.899e-3
  },
  scan: SCAN,
  elasticity: {
    d_ln_surplus_d_ln_s_1_2: ELASTICITY_1_2, // ~0.9986
    d_ln_surplus_d_ln_s_4_8: ELASTICITY_4_8, // ~0.9946
    d_ratio_d_s: +RATIO_SLOPE_PER_S.toExponential(4), // ~-3.98e-3 per unit scale
  },
  finding: {
    M1_N_cross_invariant:
      'The crossover E_coll = E_trunc contains no C_F, so N_cross ~3.280294e9 is invariant under ' +
      'every C_F scale; the whole ordering gap is carried by the motion of N_half.',
    M2_surplus_near_linear:
      'surplus(s) = (s r / 2)/(2 + s r) with r ~1.899e-3 at s = 1; the measured d ln surplus / ' +
      'd ln s stays ~1 (0.9986 on 1..2, 0.9946 on 4..8), so the surplus tracks the C_F amplitude ' +
      'one-for-one up to the second-order (2 + s r) denominator.',
    M3_ratio_falls_linearly:
      'N_half/N_cross drops ~3.98e-3 per unit s (1.0 at s = 0 -> 0.9960 at s = 1 -> 0.9680 at ' +
      's = 8); the N-space gap grows in step and stays the ~8.4x E_coll ~ N^{-1/2} amplification ' +
      'of the sigma-surplus (8.38 -> 8.48 across the band).',
    M4_ordering_never_inverts:
      'surplus(s) > 0 and ratio(s) < 1 for every s > 0; at s = 0 the flow term vanishes and ' +
      'N_half -> N_cross (non-strict equality, NOT inversion). Inversion needs s < 0 (E_flow < 0), ' +
      'which the imp-398 Gronwall term -- a product of strictly positive factors -- cannot produce, ' +
      'so N_half <= N_cross holds identically, strictly whenever E_flow > 0.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Scaling the imp-398 C_F prefactor (the E_flow ' +
    'amplitude) by s in {0, 1/4, 1/2, 1, 2, 4, 8} leaves N_cross ~3.280294e9 invariant (E_coll = ' +
    'E_trunc is C_F-free) and drives the imp-33848 surplus 1/2 - sigma(N_cross) near-linearly ' +
    '(d ln surplus / d ln s ~1, from ~1.19e-4 at s = 1/4 to ~3.77e-3 at s = 8) while N_half/N_cross ' +
    'falls ~3.98e-3 per unit s; the ~8.4x N^{-1/2} amplification of the surplus into the N-space gap ' +
    'holds throughout. The ordering N_half <= N_cross never inverts for E_flow > 0 -- it collapses ' +
    'to equality only at s = 0 (E_flow = 0), and E_flow < 0 is impossible for the strictly-positive ' +
    'Gronwall term -- so the ~0.4% gap is the linear image of the C_F amplitude, as robust as the ' +
    'positivity of the flow term. The C_F prefactor is perturbed only as a symbolic axis (shipped ' +
    'value s = 1); the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35102 (single-C_F surplus + rung bracket); imp-33848 (two closed-form strictness ' +
    'conditions); imp-33601 (parts(N) model + surplus identity); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional); imp-36182 (model-internal ' +
    'honest-status); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP124831_EFLOW_SURPLUS_VS_CF_PREFACTOR_SCAN_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35102 crossover landmark and the s = 1 surplus, proving the
    // identical inherited component model is in use at the shipped C_F value.
    id: 'imp124831-reproduces-unit-scale-surplus',
    description: 'N_cross ~3.280e9 and the s = 1 surplus ~4.74e-4 match the imp-35102 shipped model',
    holds: () => {
      const unit = SCAN.find((r) => r.s === 1);
      return (
        Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3 &&
        Math.abs(unit.surplus - 4.743597e-4) < 5e-6 &&
        unit.ordered === true
      );
    },
  },
  {
    // (M1): N_cross is C_F-invariant -- recomputing the crossover at a different scale gives the
    // same value (E_coll = E_trunc contains no C_F).
    id: 'imp124831-Ncross-CF-invariant',
    description: 'the crossover N_cross is identical when E_coll is evaluated at any C_F scale',
    holds: () => {
      const alt = crossBelow((N) => parts(N, 7).E_coll, E_TRUNC_PT, 1e6, 1e18);
      return Math.abs(alt / N_CROSS - 1) < 1e-12;
    },
  },
  {
    // (M2): surplus matches the closed form 1/2 - 1/(2 + E_flow/E_trunc) at every scale, and the
    // log-elasticity is near 1 (near-linear in the C_F amplitude).
    id: 'imp124831-surplus-closed-form-near-linear',
    description: 'surplus = 1/2 - 1/(2 + s r) at every scale; d ln surplus / d ln s ~1',
    holds: () =>
      SCAN.filter((r) => r.s > 0).every(
        (r) => Math.abs(r.surplus - r.surplusClosed) / r.surplus < 1e-6,
      ) &&
      Math.abs(ELASTICITY_1_2 - 1) < 1e-2 &&
      Math.abs(ELASTICITY_4_8 - 1) < 1e-2,
  },
  {
    // (M3): surplus scales monotonically up with s, and the ratio monotonically down; the N-space
    // gap stays the ~8.4x amplification of the sigma-surplus.
    id: 'imp124831-surplus-up-ratio-down-amplification-stable',
    description: 'surplus increases and ratio decreases monotonically in s; Ngap ~8.4x surplus',
    holds: () => {
      const pos = SCAN.filter((r) => r.s > 0);
      for (let i = 1; i < pos.length; i++) {
        if (!(pos[i].surplus > pos[i - 1].surplus)) return false;
        if (!(pos[i].ratio < pos[i - 1].ratio)) return false;
      }
      return pos.every((r) => Math.abs(r.NgapOverSurplus - 8.4) < 0.2);
    },
  },
  {
    // (M4): ordering holds strictly for every s > 0 and collapses to non-strict equality (NOT
    // inversion) at s = 0.
    id: 'imp124831-ordering-never-inverts',
    description: 'N_half < N_cross for all s > 0; N_half = N_cross (not >) at s = 0',
    holds: () => {
      const zero = SCAN.find((r) => r.s === 0);
      return (
        SCAN.filter((r) => r.s > 0).every((r) => r.ordered === true && r.ratio < 1) &&
        zero.ordered === false &&
        Math.abs(zero.ratio - 1) < 1e-9 &&
        zero.ratio <= 1
      );
    },
  },
  {
    // Honesty gate: measurement/derivation only, no QED, no refereed bound is changed.
    id: 'imp124831-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124831_EFLOW_SURPLUS_VS_CF_PREFACTOR_SCAN.isRigorous === false &&
      /NO QED/.test(IMP124831_EFLOW_SURPLUS_VS_CF_PREFACTOR_SCAN.verdict) &&
      /refereed bound is changed/i.test(IMP124831_EFLOW_SURPLUS_VS_CF_PREFACTOR_SCAN.verdict),
  },
];

for (const a of IMP124831_EFLOW_SURPLUS_VS_CF_PREFACTOR_SCAN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124831-eflow-surplus-vs-cf-prefactor-scan assertion failed: ${a.id}`);
  }
}

export default IMP124831_EFLOW_SURPLUS_VS_CF_PREFACTOR_SCAN;
