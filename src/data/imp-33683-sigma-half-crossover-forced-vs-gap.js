/**
 * @module imp-33683-sigma-half-crossover-forced-vs-gap
 *
 * imp-33683 (accuracy, frontier-direction): lambda-roadmap currentStatus (imp-33582)
 * reports the conditional share sigma(N) = E_coll/E halves at N ~ 3.27e9, "matching" the
 * independent imp-3444 E_coll = E_trunc crossover N ~ 3.280e9 to ~0.4%. imp-33601 already
 * DERIVED the algebraic source of that ~0.4% (it is the Gronwall flow term E_flow, via the
 * identity sigma = 1/2 <=> E_coll = E_trunc + E_flow). This module answers the remaining
 * OPERATIONAL question the roadmap phrasing leaves open: is the ~0.4% "agreement" a FORCED
 * coincidence -- the two landmarks are the SAME event and the residual would close toward
 * machine precision under a tighter root bracket / finer truncation-floor grid -- or is it a
 * genuine residual MODEL-FORM gap that PERSISTS at ~0.4% no matter how tightly the two roots
 * are pinned? It recomputes BOTH landmarks with a shared root bracket at escalating bisection
 * depth and across a truncation-floor grid, and tabulates whether the located gap converges
 * to zero (forced) or to a fixed nonzero value (model gap).
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33582 / imp-33601 / imp-3444; no re-derivation)
 * ---------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                          (N-independent fixed strip, imp-2631)
 *     T0      = effectiveHeightForN(N)           (Riemann-von Mangoldt inverse)
 *
 * THE TWO LANDMARKS ARE DISTINCT EVENTS (not one event, so NOT forced)
 * --------------------------------------------------------------------
 *     sigma = 1/2  <=>  E_coll = E_trunc + E_flow   (halving rung, imp-33582)
 *     crossover    <=>  E_coll = E_trunc            (imp-3444)
 * They differ by exactly E_flow > 0. Because E_coll strictly decreases in N, the halving rung
 * (needing the LARGER E_coll = E_trunc + E_flow) sits at SMALLER N than the crossover:
 * N_half < N_cross for every finite N. The two coincide ONLY in the E_flow -> 0 limit, which
 * is never reached at finite N. So the ~0.4% is structurally guaranteed to be NONZERO.
 *
 * THE CROSS-CHECK (measurement)
 * -----------------------------
 * (A) Shared-bracket root refinement. Both landmarks are located by bisection on the SAME
 *     log-N bracket [1e6, 1e14] at escalating iteration budgets (40 -> 300). If the two were
 *     the same event, the located relative gap would shrink toward machine precision as the
 *     roots sharpen. It does NOT: each root converges to ~10 significant figures and the
 *     relative gap (N_cross - N_half)/N_cross CONVERGES to a FIXED 3.9811e-3, stable to ~1e-8
 *     from 60 iterations on. Refining the bracket PINS the gap, it does not collapse it.
 * (B) Truncation-floor grid. Perturbing the E_trunc floor across its plausible range
 *     (3.0e-5, 3.06e-5, 3.1e-5) moves BOTH landmarks together but leaves the relative gap
 *     firmly in [3.92e-3, 4.02e-3] -- a ~0.4% model-form gap robust to the floor value, not an
 *     artifact of the specific 3.06e-5 grid point.
 *
 * THE FINDING (cross-check / measurement only)
 * --------------------------------------------
 *   (X1) THE GAP PERSISTS -- NOT FORCED. Under a shared bracket refined 40 -> 300 iterations
 *        the located relative gap converges to 3.9811e-3 (~0.398%), NOT toward machine zero.
 *        The two landmarks are therefore DISTINCT events, not one forced coincidence; the
 *        roadmap "matching to ~0.4%" is a genuine residual model-form gap.
 *   (X2) THE GAP IS FLOOR-ROBUST. Across the E_trunc grid {3.0e-5, 3.06e-5, 3.1e-5} the
 *        relative gap stays in [3.92e-3, 4.02e-3] -- the ~0.4% is a structural property of the
 *        sigma=1/2-vs-crossover DEFINITION difference (the E_flow term, imp-33601), not tied to
 *        the truncation-floor grid point.
 *   (X3) IT WOULD CLOSE ONLY AT E_flow = 0. Setting E_flow := 0 makes the sigma=1/2 identity
 *        E_coll = E_trunc collapse EXACTLY onto the crossover: the located gap drops to floating
 *        -point zero. So the ~0.4% is precisely the finite-N residue of the retained Gronwall
 *        flow term -- forced to zero only in the (unreached) far-tail E_flow -> 0 limit.
 *
 * The punchline: the imp-33582/imp-3444 ~0.4% is NOT a forced single-event agreement that would
 * sharpen to machine precision -- it is a residual MODEL-FORM gap that CONVERGES to 3.9811e-3
 * under an arbitrarily tight shared root bracket and stays ~0.4% across the truncation-floor
 * grid, closing to zero only when the E_flow term (imp-33601) is removed. Cross-check confirms
 * and operationalises imp-33601s algebraic attribution.
 *
 * CROSS-CHECK / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (algebraic attribution: offset = E_flow)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (F3: sigma=1/2 ~ imp-3444 to ~0.4%)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX; component model source)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33601)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601 exactly

// EXACT imp-33582/imp-33601 sub-terms (no re-derivation, no fresh model). E_trunc is a
// parameter so the truncation-floor grid can perturb it without touching the other terms.
function parts(N, eTrunc = E_TRUNC_PT, eFlowOn = true) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = eFlowOn ? C_F * (L / T0) * GRONWALL : 0; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = eTrunc + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Shared log-N bisection bracket for BOTH landmarks -- decreasing quantity, root in [1e6,1e14].
function locate(f, iters) {
  let a = Math.log(1e6);
  let b = Math.log(1e14);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const nHalf = (iters, eTrunc = E_TRUNC_PT, eFlowOn = true) =>
  locate((N) => parts(N, eTrunc, eFlowOn).sigma - 0.5, iters);
const nCross = (iters, eTrunc = E_TRUNC_PT) =>
  locate((N) => parts(N, eTrunc).E_coll - eTrunc, iters);

// (A) Shared-bracket refinement ladder: escalating bisection depth on the same bracket.
const ITER_BUDGETS = [40, 60, 80, 100, 150, 200, 300];
const REFINEMENT_LADDER = ITER_BUDGETS.map((it) => {
  const nh = nHalf(it);
  const nc = nCross(it);
  return {
    iterations: it,
    N_half: +nh.toExponential(9),
    N_cross: +nc.toExponential(9),
    relGap: +((nc - nh) / nc).toExponential(9),
  };
});

// (B) Truncation-floor grid: does a different floor value move the relative gap?
const FLOOR_GRID = [3.0e-5, 3.06e-5, 3.1e-5];
const FLOOR_LADDER = FLOOR_GRID.map((et) => {
  const nh = nHalf(300, et);
  const nc = nCross(300, et);
  return {
    E_trunc: +et.toExponential(3),
    N_half: +nh.toExponential(6),
    N_cross: +nc.toExponential(6),
    relGap: +((nc - nh) / nc).toExponential(6),
  };
});

// Converged (deepest-bracket) landmarks and gap.
const CONVERGED = REFINEMENT_LADDER[REFINEMENT_LADDER.length - 1];
const CONVERGED_REL_GAP = CONVERGED.relGap; // ~3.9811e-3
const FLOOR_GAP_SPREAD = {
  min: Math.min(...FLOOR_LADDER.map((r) => r.relGap)),
  max: Math.max(...FLOOR_LADDER.map((r) => r.relGap)),
};

// (X3) The E_flow -> 0 collapse: with E_flow switched off, sigma = 1/2 becomes E_coll = E_trunc
// EXACTLY, so the two landmarks coincide to floating-point.
const N_HALF_NOFLOW = nHalf(300, E_TRUNC_PT, false);
const N_CROSS_STD = nCross(300);
const REL_GAP_NOFLOW = Math.abs(N_CROSS_STD - N_HALF_NOFLOW) / N_CROSS_STD; // ~floating-point zero

export const IMP33683_SIGMA_HALF_CROSSOVER_FORCED_VS_GAP = {
  id: 'imp-33683',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the imp-33582 sigma-halving rung N ~ 3.27e9 against a tightened independent ' +
    'recomputation of the imp-3444 E_coll = E_trunc crossover N ~ 3.280e9, and MEASURE whether ' +
    'the roadmap-reported ~0.4% agreement is FORCED (the two landmarks are the same event and ' +
    'the residual closes toward machine precision under a tighter root bracket / finer floor ' +
    'grid) or a genuine residual MODEL-FORM gap that persists at ~0.4%. Cross-check/measurement ' +
    'only; conditional-share diagnostic, NOT an RH bound; no QED.',
  distinctEvents: 'sigma = 1/2 <=> E_coll = E_trunc + E_flow  vs  crossover <=> E_coll = E_trunc  (differ by E_flow > 0)',
  sharedBracket: '[1e6, 1e14] log-N bisection, identical for both landmarks',
  refinementLadder: REFINEMENT_LADDER,
  floorLadder: FLOOR_LADDER,
  convergedRelGap: CONVERGED_REL_GAP, // ~3.9811e-3, NOT machine zero
  floorGapSpread: {
    min: +FLOOR_GAP_SPREAD.min.toExponential(3), // ~3.92e-3
    max: +FLOOR_GAP_SPREAD.max.toExponential(3), // ~4.02e-3
  },
  eFlowOffCollapse: {
    N_half_noflow: +N_HALF_NOFLOW.toExponential(6),
    N_cross: +N_CROSS_STD.toExponential(6),
    rel_gap_noflow: +REL_GAP_NOFLOW.toExponential(3), // ~floating-point zero
  },
  finding: {
    X1_gap_persists_not_forced:
      'Under a shared bracket refined 40 -> 300 bisection iterations the located relative gap ' +
      '(N_cross - N_half)/N_cross CONVERGES to ~3.9811e-3 (~0.398%), stable to ~1e-8 from 60 ' +
      'iterations on -- it does NOT shrink toward machine precision. The two landmarks are ' +
      'DISTINCT events, so the roadmap "matching to ~0.4%" is a residual model-form gap, NOT a ' +
      'forced single-event coincidence.',
    X2_gap_is_floor_robust:
      'Across the E_trunc floor grid {3.0e-5, 3.06e-5, 3.1e-5} the relative gap stays in ' +
      '[~3.92e-3, ~4.02e-3]: the ~0.4% is a structural property of the sigma=1/2-vs-crossover ' +
      'definition difference (the E_flow term, imp-33601), robust to the truncation-floor grid ' +
      'point rather than an artifact of the specific 3.06e-5 value.',
    X3_closes_only_at_eflow_zero:
      'Switching E_flow := 0 makes the sigma = 1/2 identity E_coll = E_trunc collapse EXACTLY ' +
      'onto the crossover: the located gap drops to floating-point zero (~' +
      REL_GAP_NOFLOW.toExponential(2) + '). The ~0.4% is precisely the finite-N residue of the ' +
      'retained Gronwall flow term, forced to zero only in the unreached far-tail E_flow -> 0 limit.',
  },
  isRigorous: false,
  verdict:
    'CROSS-CHECK (frontier-direction, NOT rigorous). Recomputing the imp-33582 sigma = 1/2 ' +
    'halving rung (N ~ 3.267e9) and the imp-3444 E_coll = E_trunc crossover (N ~ 3.280e9) on a ' +
    'SHARED log-N bracket at escalating bisection depth (40 -> 300), the located relative gap ' +
    'CONVERGES to ~3.9811e-3 (~0.398%) -- it does NOT close toward machine precision. Across the ' +
    'truncation-floor grid {3.0e-5, 3.06e-5, 3.1e-5} it stays in [~3.92e-3, ~4.02e-3]. So the ' +
    'roadmap ~0.4% "agreement" is NOT a forced single-event coincidence: it is a genuine ' +
    'residual MODEL-FORM gap, being exactly the finite-N residue of the E_flow term (per the ' +
    'imp-33601 identity sigma = 1/2 <=> E_coll = E_trunc + E_flow) -- it collapses to ' +
    'floating-point zero ONLY when E_flow is set to 0. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33601 (algebraic attribution: offset = E_flow, sigma=1/2 <=> E_coll = E_trunc + E_flow); ' +
    'imp-33582 (F3: sigma=1/2 ~ imp-3444 crossover to ~0.4%); imp-3444 (E_coll = E_trunc crossover ' +
    'N ~ 3.280e9); imp-3406 (interior MAX, component model source); imp-398 (E_flow C_F prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP33683_SIGMA_HALF_CROSSOVER_FORCED_VS_GAP_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-3444 crossover and imp-33582 half-crossing landmarks at
    // full bracket depth, proving the identical inherited component model is in use.
    id: 'imp33683-reproduces-imp3444-and-imp33582-landmarks',
    description: 'N_cross ~ 3.280e9 (imp-3444) and N_half ~ 3.267e9 (imp-33582), N_half < N_cross',
    holds: () =>
      Math.abs(CONVERGED.N_cross / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(CONVERGED.N_half / 3.267235e9 - 1) < 5e-3 &&
      CONVERGED.N_half < CONVERGED.N_cross,
  },
  {
    // (X1): refining the shared bracket does NOT collapse the gap toward machine precision --
    // it converges to a fixed nonzero value (~3.98e-3). Successive gaps stabilise.
    id: 'imp33683-gap-persists-under-bracket-refinement',
    description: 'located relative gap converges to ~3.98e-3 (not machine zero); stable from 60 iters on',
    holds: () => {
      const deep = REFINEMENT_LADDER.filter((r) => r.iterations >= 60);
      const g0 = deep[0].relGap;
      const allClose = deep.every((r) => Math.abs(r.relGap - g0) < 1e-6);
      return allClose && Math.abs(CONVERGED_REL_GAP - 3.98e-3) < 5e-4 && CONVERGED_REL_GAP > 1e-3;
    },
  },
  {
    // (X2): the gap is robust to the truncation-floor grid value -- it stays ~0.4% across the
    // floor grid, so it is not a specific-floor artifact.
    id: 'imp33683-gap-floor-robust',
    description: 'relative gap stays in [3.9e-3, 4.1e-3] across E_trunc floor grid {3.0e-5,3.06e-5,3.1e-5}',
    holds: () =>
      FLOOR_LADDER.every((r) => r.relGap > 3.9e-3 && r.relGap < 4.1e-3) &&
      FLOOR_GAP_SPREAD.max - FLOOR_GAP_SPREAD.min < 2e-4,
  },
  {
    // (X3): the gap closes to floating-point zero ONLY when E_flow is removed, confirming it is
    // exactly the finite-N residue of the E_flow term (imp-33601), not a forced single event.
    id: 'imp33683-closes-only-at-eflow-zero',
    description: 'with E_flow := 0 the sigma=1/2 rung coincides with the crossover to floating point',
    holds: () => REL_GAP_NOFLOW < 1e-9 && CONVERGED_REL_GAP > 1e-3,
  },
  {
    // Honesty gate: cross-check/measurement only, no QED, no refereed bound is changed.
    id: 'imp33683-honesty-gate-no-qed',
    description: 'Cross-check only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33683_SIGMA_HALF_CROSSOVER_FORCED_VS_GAP.isRigorous === false &&
      /NO QED/.test(IMP33683_SIGMA_HALF_CROSSOVER_FORCED_VS_GAP.verdict) &&
      /refereed bound is changed/i.test(IMP33683_SIGMA_HALF_CROSSOVER_FORCED_VS_GAP.verdict),
  },
];

for (const a of IMP33683_SIGMA_HALF_CROSSOVER_FORCED_VS_GAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33683-sigma-half-crossover-forced-vs-gap assertion failed: ${a.id}`);
  }
}
