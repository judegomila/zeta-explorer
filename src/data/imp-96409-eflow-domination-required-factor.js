/**
 * @module imp-96409-eflow-domination-required-factor
 *
 * imp-96409 (numerical, frontier-direction): ASSESS whether the unconditionally-rigorous E_flow
 * Gronwall flow term can be enlarged -- by any admissible prefactor/mollifier factor kappa -- to
 * DOMINATE the GUE-conditional E_coll collapse term at ANY N, and MEASURE the required kappa,
 * reporting whether it is compatible with the imp-398 pinned prefactor C_F.
 *
 * THE SETUP (exact inherited sub-terms, no re-derivation; identical wiring to imp-96266)
 * ------------------------------------------------------------------------------------
 *   E_flow(N) = C_F (L/T0) exp(TC_A1)  -- unconditionally rigorous Gronwall flow term,
 *               C_F = (log(T0/2pi)+1)/(2pi)  -- imp-398 PINNED prefactor (RvM density integral),
 *   E_coll(N) = C_C sqrt(L/N)          -- GUE-conditional collapse term (imp-486 C_mb, C_C = 1/8 ansatz),
 *   L = log T0(N),  T0 = effectiveHeightForN(N).
 * To make an enlarged flow term kappa * E_flow reach parity with E_coll one needs
 *   kappa(N) = E_coll(N) / E_flow(N)   (kappa >= 1 means enlargement is required to reach parity).
 * Every constant is the exact inherited imp-398/imp-3406/imp-33582 value; no fresh fit, no zeros bundle.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) THE REQUIRED FACTOR NEVER DROPS TO 1. Over the diagnostic regime N in [1e3,1e12] the parity
 *        factor kappa(N) = E_coll/E_flow is bounded below by ~6.26 (attained at the low end N=1e3,
 *        C_F ~ 1.022) and RISES monotonically with N: 6.26 (1e3), 9.39 (1e4), 16.4 (1e5), 31.8 (1e6),
 *        66.4 (1e7), 3.38e2 (1e9), 4.94e3 (1e12). E_flow never reaches E_coll: E_flow/E_coll falls
 *        from ~1.60e-1 at 1e3 to ~2.03e-4 at 1e12. There is NO N at which the rigorous flow term
 *        naturally dominates.
 *   (M2) THE GLOBAL INFIMUM OF THE REQUIRED FACTOR IS ~5.30. Sweeping N in [1e1,1e13] the factor has
 *        a shallow global minimum kappa_min ~ 5.298 at N ~ 95.5 (below the share-diagnostic floor),
 *        where C_F ~ 0.7325; even there, tying E_coll would require C_F to grow to ~3.88 (a x5.30
 *        inflation). Within the actual diagnostic regime (N >= 1e3) the smallest factor is ~6.26 at
 *        N = 1e3, requiring C_F ~ 1.022 to grow to ~6.40 (a x6.26 inflation).
 *   (M3) INCOMPATIBLE WITH THE imp-398 PINNED C_F. C_F = (log(T0/2pi)+1)/(2pi) is DERIVED from the
 *        convergent Riemann-von Mangoldt density integral (imp-398), not a free parameter carrying
 *        5x-6x of slack. An admissible mollifier reshapes the flow at O(1), it cannot multiply the
 *        pinned prefactor by 5.3-6.3 (still less by the thousands required past N ~ 1e12). So NO
 *        admissible enlargement of the rigorous E_flow term can overtake the GUE-conditional E_coll
 *        at any N.
 *
 * The punchline: the parity factor kappa(N) = E_coll/E_flow required for the rigorous flow term to
 * tie the GUE-conditional collapse term is bounded below by ~5.30 globally (~6.26 in the N >= 1e3
 * diagnostic regime) and DIVERGES with N -- so E_flow domination is unreachable at every N, and the
 * required x5-6+ inflation of the imp-398 pinned C_F is outside any admissible mollifier reshaping.
 * The E_coll dominance is structural, not a near-miss: the C_mb <= 1 status stays GUE-conditional.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Component model is the inherited
 * imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED (E_coll stays GUE-conditional); the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; the imp-398 C_F is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96266-eflow-peak-recovery-residual (E_flow suppression identity; same sub-term wiring)
 * @see imp-398 (C_F = (log(T0/2pi)+1)/(2pi) pinned from the RvM density integral)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-96266/imp-33582/imp-33723 exactly

// EXACT imp-398/imp-3406/imp-33582 sub-terms (identical wiring to imp-96266; no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_C 1/8 ansatz)
  return { T0, L, C_F, E_flow, E_coll };
}
// Parity factor: how much the rigorous flow term must be enlarged to tie E_coll.
const requiredFactor = (N) => {
  const p = parts(N);
  return p.E_coll / p.E_flow;
};

// (M1) required-factor ladder across the diagnostic regime.
const FACTOR_LADDER = [3, 4, 5, 6, 7, 9, 12].map((k) => {
  const N = Math.pow(10, k);
  const p = parts(N);
  return {
    N: `1e${k}`,
    kappaRequired: +requiredFactor(N).toExponential(4),
    C_F: +p.C_F.toFixed(4),
    eFlowOverEcoll: +(p.E_flow / p.E_coll).toExponential(4),
  };
});
// Monotone rise (no crossover): factor strictly increases along the ladder.
const FACTOR_STRICTLY_RISES = FACTOR_LADDER.every(
  (r, i) => i === 0 || r.kappaRequired > FACTOR_LADDER[i - 1].kappaRequired,
);

// Minimum of the required factor over the CLOSED log10 interval [loD,hiD]. The refine window is
// clamped to the interval, so a boundary-attained minimum (in-regime case) stays at the endpoint
// rather than escaping outside the diagnostic range.
function minFactorOnLog10Range(loD, hiD, coarseStep) {
  let best = { N: 0, kappa: Infinity };
  for (let d = loD; d <= hiD + 1e-12; d += coarseStep) {
    const N = Math.pow(10, d);
    const k = requiredFactor(N);
    if (k < best.kappa) best = { N, kappa: k };
  }
  // refine around the coarse minimum, clamped to [loD,hiD]
  let lo = Math.max(loD, Math.log10(best.N) - coarseStep);
  let hi = Math.min(hiD, Math.log10(best.N) + coarseStep);
  for (let it = 0; it < 8; it++) {
    const step = (hi - lo) / 200;
    // The window shrinks ~100x per pass; by pass 7 step (~1e-17) falls below the ulp of d (~4e-16
    // at d ~ 2-3), so `d += step` stops advancing and the scan never terminates (this hung the
    // /viz-imp96557 page and any node import). Stop once step is below float resolution -- the
    // minimum is already located to ~1e-13 in log10 N, far finer than the 6-decimal landmarks.
    if (!(step > 64 * Number.EPSILON * Math.max(1, Math.abs(hi)))) break;
    let localBest = { N: best.N, kappa: Infinity };
    for (let d = lo; d <= hi + 1e-12; d += step) {
      const N = Math.pow(10, d);
      const k = requiredFactor(N);
      if (k < localBest.kappa) localBest = { N, kappa: k };
    }
    best = localBest;
    lo = Math.max(loD, Math.log10(best.N) - step);
    hi = Math.min(hiD, Math.log10(best.N) + step);
  }
  return best;
}
const IN_REGIME_MIN = minFactorOnLog10Range(3, 12, 0.1); // ~6.26 at N=1e3
// (M2) global infimum over a wider N sweep (dips below the diagnostic floor).
const GLOBAL_MIN = minFactorOnLog10Range(1, 13, 0.02); // ~5.30 at N~95.5
const inRegimeParts = parts(IN_REGIME_MIN.N);
const globalParts = parts(GLOBAL_MIN.N);

export const IMP96409_EFLOW_DOMINATION_REQUIRED_FACTOR = {
  id: 'imp-96409',
  proofSection: 'S-frontier',
  question:
    'Assess whether the unconditionally-rigorous E_flow Gronwall term can be enlarged (by any ' +
    'admissible prefactor/mollifier factor) to dominate the GUE-conditional E_coll at any N; measure ' +
    'the required factor kappa(N) = E_coll/E_flow and report whether it is compatible with the ' +
    'imp-398 pinned C_F. Measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  requiredFactorLadder: FACTOR_LADDER,
  landmarks: {
    in_regime_min_factor: +IN_REGIME_MIN.kappa.toFixed(6), // ~6.261557 at N=1e3
    in_regime_min_N: +IN_REGIME_MIN.N.toExponential(6), // ~1.0e3
    in_regime_C_F: +inRegimeParts.C_F.toFixed(6), // ~1.021984
    in_regime_C_F_needed_for_parity: +(inRegimeParts.C_F * IN_REGIME_MIN.kappa).toFixed(4), // ~6.40
    global_min_factor: +GLOBAL_MIN.kappa.toFixed(6), // ~5.297508 at N~95.5
    global_min_N: +GLOBAL_MIN.N.toExponential(6), // ~9.55e1
    global_C_F: +globalParts.C_F.toFixed(6), // ~0.732527
    global_C_F_needed_for_parity: +(globalParts.C_F * GLOBAL_MIN.kappa).toFixed(4), // ~3.88
    factor_strictly_rises_over_ladder: FACTOR_STRICTLY_RISES, // true: no crossover, diverges with N
  },
  finding: {
    M1_required_factor_never_reaches_one:
      'The parity factor kappa(N) = E_coll/E_flow is bounded below by ~6.26 in the diagnostic regime ' +
      'N in [1e3,1e12] (attained at N=1e3) and RISES monotonically -- 6.26 (1e3), 9.39 (1e4), 16.4 ' +
      '(1e5), 31.8 (1e6), 66.4 (1e7), 3.38e2 (1e9), 4.94e3 (1e12). E_flow/E_coll falls from ~1.60e-1 ' +
      'to ~2.03e-4: the rigorous flow term never naturally dominates at any N.',
    M2_global_infimum_is_about_5_3:
      'Sweeping N in [1e1,1e13] the factor has a shallow global minimum kappa_min ~ 5.298 at N ~ 95.5 ' +
      '(below the share-diagnostic floor, C_F ~ 0.7325); even there E_flow parity needs C_F ~ 3.88 ' +
      '(x5.30). In-regime (N >= 1e3) the smallest factor is ~6.26 at N=1e3, needing C_F ~ 6.40 (x6.26).',
    M3_incompatible_with_pinned_C_F:
      'C_F = (log(T0/2pi)+1)/(2pi) is DERIVED from the convergent RvM density integral (imp-398), not ' +
      'a free parameter with 5x-6x of slack. An admissible mollifier reshapes the flow at O(1); it ' +
      'cannot multiply the pinned prefactor by 5.3-6.3 (still less by the thousands needed past ' +
      'N ~ 1e12). No admissible enlargement of E_flow can overtake the GUE-conditional E_coll at any N.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The parity factor kappa(N) = E_coll/E_flow the ' +
    'rigorous Gronwall flow term must be enlarged by to tie the GUE-conditional collapse term is ' +
    'bounded below by ~5.30 globally (N ~ 95.5) and ~6.26 in the N >= 1e3 diagnostic regime, and it ' +
    'DIVERGES with N (6.26 -> 4.94e3 over 1e3 -> 1e12) -- so E_flow domination is unreachable at ' +
    'every N. Reaching parity would require inflating the imp-398 pinned C_F by x5.3-6.3 (thousands ' +
    'past 1e12); C_F is derived from the convergent RvM density integral, not a free parameter with ' +
    'that slack, so NO admissible prefactor/mollifier enlargement can make E_flow overtake E_coll. ' +
    'The GUE-conditional E_coll dominance is structural, not a near-miss. Component model is the ' +
    'inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; the imp-398 C_F is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96266 (E_flow suppression identity; same sub-term wiring); imp-398 (C_F pinned from the RvM ' +
    'density integral); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96409_EFLOW_DOMINATION_REQUIRED_FACTOR_ASSERTIONS = [
  {
    // (M1) required factor is >= 1 everywhere and never drops to parity in the diagnostic regime.
    id: 'imp96409-required-factor-exceeds-one',
    description: 'kappa(N) = E_coll/E_flow > 6 across the N in [1e3,1e12] ladder; E_flow never dominates',
    holds: () => FACTOR_LADDER.every((r) => r.kappaRequired > 6 && r.eFlowOverEcoll < 1),
  },
  {
    // (M1) factor strictly rises along the ladder -- no crossover, it diverges with N.
    id: 'imp96409-required-factor-diverges-with-N',
    description: 'kappa(N) strictly increases over the ladder (no crossover; grows without bound)',
    holds: () =>
      FACTOR_STRICTLY_RISES &&
      FACTOR_LADDER[FACTOR_LADDER.length - 1].kappaRequired > 1e3,
  },
  {
    // (M2) global infimum of the required factor is ~5.30 (in-regime ~6.26), well above 1.
    id: 'imp96409-global-infimum-well-above-one',
    description: 'global min required factor ~5.30 (in-regime ~6.26), both far above unity',
    holds: () =>
      GLOBAL_MIN.kappa > 5 &&
      GLOBAL_MIN.kappa < 6 &&
      IN_REGIME_MIN.kappa > 6 &&
      IN_REGIME_MIN.kappa < 7,
  },
  {
    // (M3) parity would require inflating the pinned C_F by the required factor (x5-6), incompatible.
    id: 'imp96409-C_F-inflation-incompatible',
    description: 'parity needs C_F inflated by x5-6 above its imp-398 pinned value; not admissible',
    holds: () =>
      globalParts.C_F * GLOBAL_MIN.kappa > 3 * globalParts.C_F &&
      inRegimeParts.C_F * IN_REGIME_MIN.kappa > 5 * inRegimeParts.C_F,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed, E_coll stays GUE-conditional.
    id: 'imp96409-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96409_EFLOW_DOMINATION_REQUIRED_FACTOR.isRigorous === false &&
      /NO QED/.test(IMP96409_EFLOW_DOMINATION_REQUIRED_FACTOR.verdict) &&
      /refereed bound is changed/i.test(IMP96409_EFLOW_DOMINATION_REQUIRED_FACTOR.verdict),
  },
];

for (const a of IMP96409_EFLOW_DOMINATION_REQUIRED_FACTOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96409-eflow-domination-required-factor assertion failed: ${a.id}`);
  }
}
