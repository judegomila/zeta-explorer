/**
 * @module imp-34174-crossover-surplus-threshold-family-decay
 *
 * imp-34174 (numerical, opus-4-8): Tabulate the imp-33848 crossover surplus
 * across the imp-33743 generalised threshold family and MEASURE its decay deep
 * in the tail.
 *
 * THE SURPLUS imp-33848 IDENTIFIED (thr = 1/2)
 * --------------------------------------------
 * imp-33848 showed that at the E_coll = E_trunc crossover the three-term share
 *
 *     sigma(N) = E_coll / (E_coll + E_trunc + E_flow)
 *
 * takes the closed form sigma(N_cross) = 1/(2 + E_flow/E_trunc), which is
 * strictly below 1/2 whenever the Gronwall flow term E_flow (imp-398) is
 * positive. The halving-vs-crossover surplus is therefore
 *
 *     1/2 - sigma(N_cross) = E_flow / (2 (2 E_trunc + E_flow))                 (thr = 1/2)
 *
 * -- purely the E_flow/E_trunc term (the ~0.4% gap between the sigma = 1/2
 * halving landmark and the E_coll = E_trunc crossover, per imp-33601).
 *
 * THE imp-33743 GENERALISATION AND THIS MODULE
 * --------------------------------------------
 * imp-33743 generalised the crossover to an arbitrary threshold thr via the
 * leading (E_flow-dropped) balance E_coll = E_trunc thr/(1-thr), giving the
 * Banach fixed point N_cross(thr) = (C_C (1-thr)/(E_trunc thr))^2 log T0(N_cross).
 * At each such crossover the ACTUAL three-term share (E_flow restored) is
 *
 *     sigma(N_cross(thr)) = thr / (1 + (1-thr) E_flow/E_trunc),
 *
 * so the shortfall of the actual share below its target thr -- the E_flow
 * surplus, the direct generalisation of imp-33848 -- is the CLOSED FORM
 *
 *     surplus(thr) = thr - sigma(N_cross(thr)) = thr (1-thr) r / (1 + (1-thr) r),
 *     r = E_flow(N_cross(thr)) / E_trunc.                                     (SURPLUS)
 *
 * At thr = 1/2 this collapses to r/(4 + 2r) = E_flow/(2(2 E_trunc + E_flow)),
 * reproducing the imp-33848 halving surplus 1/2 - sigma(N_cross) EXACTLY.
 *
 * This module tabulates surplus(thr) and N_cross(thr) across
 * thr in {0.5, 0.3, 0.1, 0.05, 0.01}, reuses the IDENTICAL imp-33743 sub-terms
 * (no fresh model), and locates the threshold at which the surplus first drops
 * below 1e-4.
 *
 * FINDINGS (this module)
 * ----------------------
 *   (T) As thr shrinks the crossover N_cross(thr) RECEDES deep into the tail
 *       (3.280e9 -> 4.624e13 from thr=0.5 to thr=0.01), E_flow/E_trunc decays
 *       there (1.899e-3 -> 4.255e-7, the imp-33620 vanishing-E_flow reading),
 *       and the surplus collapses monotonically: 4.744e-4, 8.681e-5, 3.194e-6,
 *       4.279e-7, 4.213e-9.
 *   (C) The thr = 1/2 surplus 4.744e-4 reproduces imp-33848s 1/2 - sigma(N_cross)
 *       and equals E_flow/(2(2 E_trunc + E_flow)) at N_cross = 3.280e9 to
 *       floating-point.
 *   (X) The surplus first drops below 1e-4 at thr ~ 0.3137 (N_cross ~ 1.687e10):
 *       already by thr = 0.3 (surplus 8.681e-5) the halving-scale ~5e-4 gap has
 *       thinned below 1e-4, and by the imp-33582 far-tail thr = 0.1 landmark it
 *       is a sub-1e-5 perturbation.
 *
 * HONEST SCOPE -- measurement/derivation only, NO QED. This tabulates the
 * inherited imp-33743/imp-33848 extrapolation component model; it changes no
 * bound and introduces no new mathematical claim. The component model is NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED (the
 * E_coll term is untouched here); the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; imp-3066 K_a >= 0 is untouched; establishes no operator positivity;
 * Platt-Trudgian Lambda <= 0.2 remains the SOTA unconditional bound. E_flow is
 * the benign mesoscopic-Gronwall term (imp-2845); its vanishing here does NOT
 * touch the divergent C_Lip collision-Gronwall.
 *
 * @see imp-33848 (roadmap: sigma(N_cross) = 1/(2 + E_flow/E_trunc), surplus = E_flow/E_trunc term)
 * @see imp-33743-sigma-fartail-crossover-closed-form (generalised crossover N_cross(thr), identical sub-terms)
 * @see imp-34134-eflow-etrunc-ratio-decay-onset (E_flow/E_trunc decay ladder; imp-33620 vanishing-E_flow reading)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (exact identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33743 exactly (~1.000237)

// EXACT imp-33743 sub-terms (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL; // unconditionally rigorous, decays down the tail
}
// Actual three-term share at N (E_coll GUE-conditional via the C_C ansatz).
function sigmaActual(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return E_coll / (E_coll + E_TRUNC_PT + eFlow(N));
}

// (imp-33743 CLOSED FORM) crossover N_cross(thr) as the Banach fixed point of
// N = ((1-thr)/thr)^2 * (C_C/E_trunc)^2 * log T0(N). Strong contraction => ~10 iters suffice.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
function crossoverN(thr) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 80; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}

// (SURPLUS) closed form surplus(thr) = thr(1-thr)r/(1 + (1-thr)r), r = E_flow(N_cross)/E_trunc.
function surplusClosedForm(thr) {
  const N = crossoverN(thr);
  const r = eFlow(N) / E_TRUNC_PT;
  return (thr * (1 - thr) * r) / (1 + (1 - thr) * r);
}

// ── Threshold family ladder ──────────────────────────────────────────────────
const THRESHOLDS = [0.5, 0.3, 0.1, 0.05, 0.01];
const SURPLUS_LADDER = THRESHOLDS.map((thr) => {
  const N = crossoverN(thr);
  const r = eFlow(N) / E_TRUNC_PT;
  const sigmaAtCross = sigmaActual(N);
  const surplusMeasured = thr - sigmaAtCross; // direct: target thr minus actual three-term share
  const surplusCf = (thr * (1 - thr) * r) / (1 + (1 - thr) * r); // closed form
  return {
    thr,
    N_cross: +N.toExponential(6),
    E_flow_over_E_trunc: +r.toExponential(4),
    sigma_at_crossover: +sigmaAtCross.toFixed(8),
    surplus_measured: +surplusMeasured.toExponential(4),
    surplus_closed_form: +surplusCf.toExponential(4),
    closed_form_vs_measured_rel: +(Math.abs(surplusCf - surplusMeasured) / surplusMeasured).toExponential(3),
  };
});

// Monotone-decreasing surplus across the shrinking-thr sweep (0.5 -> 0.01, 0.02 grid).
let surplusMonotoneDecreasing = true;
{
  let prev = Infinity;
  for (let thr = 0.5; thr >= 0.01 - 1e-9; thr -= 0.02) {
    const s = surplusClosedForm(thr);
    if (s > prev) surplusMonotoneDecreasing = false;
    prev = s;
  }
}

// thr* at which the surplus first drops below 1e-4 (surplus increases with thr => bisection in thr).
function thrForSurplus(target) {
  let a = 0.01; // surplus < target here
  let b = 0.5; // surplus > target here
  for (let i = 0; i < 100; i++) {
    const m = (a + b) / 2;
    if (surplusClosedForm(m) > target) b = m;
    else a = m;
  }
  return (a + b) / 2;
}
const THR_SURPLUS_1EM4 = thrForSurplus(1e-4); // ~0.3137
const N_AT_THR_1EM4 = crossoverN(THR_SURPLUS_1EM4); // ~1.687e10

// imp-33848 halving cross-check: 1/2 - sigma(N_cross) = E_flow/(2(2 E_trunc + E_flow)).
const N_HALF_CROSS = crossoverN(0.5);
const E_FLOW_HALF = eFlow(N_HALF_CROSS);
const HALVING_SURPLUS_MEASURED = 0.5 - sigmaActual(N_HALF_CROSS);
const HALVING_SURPLUS_EFLOW_FORM = E_FLOW_HALF / (2 * (2 * E_TRUNC_PT + E_FLOW_HALF));

export const IMP34174_CROSSOVER_SURPLUS_THRESHOLD_FAMILY_DECAY = {
  id: 'imp-34174',
  proofSection: 'S-frontier',
  question:
    'Tabulate the imp-33848 crossover surplus surplus(thr) = thr - sigma(N_cross(thr)) = ' +
    'thr(1-thr)r/(1+(1-thr)r) (r = E_flow/E_trunc) across the imp-33743 generalised threshold ' +
    'family thr in {0.5,0.3,0.1,0.05,0.01} with their N_cross(thr) = (C_C(1-thr)/(E_trunc thr))^2 ' +
    'log T0, measure how the E_flow/E_trunc surplus shrinks as N_cross recedes (imp-33620 ' +
    'vanishing-E_flow), and report the thr at which the surplus drops below 1e-4. ' +
    'Measurement/derivation only within the extrapolation component model; changes no bound; NO QED.',
  closedForm:
    'surplus(thr) = thr - sigma(N_cross(thr)) = thr(1-thr)r/(1+(1-thr)r), r = E_flow(N_cross)/E_trunc; ' +
    'at thr=1/2 this is E_flow/(2(2 E_trunc + E_flow)) = imp-33848 1/2 - sigma(N_cross); ' +
    'sigma(N_cross(thr)) = thr/(1 + (1-thr) E_flow/E_trunc) from E_coll = E_trunc thr/(1-thr) (imp-33743).',
  subTerms: {
    E_trunc: E_TRUNC_PT,
    GRONWALL: +GRONWALL.toExponential(6), // exp(2.37e-4) ~ 1.000237
    formula: 'E_flow(N) = ((log(T0/2pi)+1)/2pi) . (log T0 / T0) . exp(2.37e-4), T0 = effectiveHeightForN(N)',
    source: 'identical sub-terms to imp-33743-sigma-fartail-crossover-closed-form.js (no fresh model)',
  },
  surplusLadder: SURPLUS_LADDER,
  surplusMonotoneDecreasing,
  halvingCheck: {
    N_cross: +N_HALF_CROSS.toExponential(6), // 3.280294e9 (imp-3444/imp-33723)
    surplus_measured: +HALVING_SURPLUS_MEASURED.toExponential(6), // ~4.743597e-4
    surplus_via_E_flow_form: +HALVING_SURPLUS_EFLOW_FORM.toExponential(6), // matches to floating point
    reproduces_imp33848: 'surplus(1/2) = 1/2 - sigma(N_cross) = E_flow/(2(2 E_trunc + E_flow)) exactly',
  },
  surplusBelow1em4: {
    thr_star: +THR_SURPLUS_1EM4.toFixed(6), // ~0.313723
    N_cross_at_thr_star: +N_AT_THR_1EM4.toExponential(6), // ~1.686719e10
    note:
      'The surplus first drops below 1e-4 at thr ~ 0.3137 (N_cross ~ 1.687e10): already by thr = 0.3 ' +
      '(surplus 8.68e-5) the halving-scale ~5e-4 gap has thinned below 1e-4, and by the imp-33582 ' +
      'far-tail thr = 0.1 landmark it is a sub-1e-5 perturbation.',
  },
  finding: {
    T_surplus_collapses_as_N_cross_recedes:
      'As thr shrinks (0.5 -> 0.01) the crossover N_cross(thr) recedes from 3.280e9 to 4.624e13, ' +
      'E_flow/E_trunc decays there from 1.899e-3 to 4.255e-7 (the imp-33620 vanishing-E_flow reading), ' +
      'and the surplus collapses monotonically: 4.744e-4, 8.681e-5, 3.194e-6, 4.279e-7, 4.213e-9. ' +
      'The closed form thr(1-thr)r/(1+(1-thr)r) matches the directly measured thr - sigma(N_cross) at ' +
      'every rung to floating point.',
    C_reproduces_imp33848_halving_surplus:
      'At thr = 1/2 the surplus 4.744e-4 reproduces imp-33848s 1/2 - sigma(N_cross) and equals ' +
      'E_flow/(2(2 E_trunc + E_flow)) at N_cross = 3.280e9 to floating point.',
    X_below_1em4_at_thr_0p314:
      'The surplus first drops below 1e-4 at thr ~ 0.3137 (N_cross ~ 1.687e10), between the halving ' +
      'landmark (thr=0.5, surplus 4.74e-4) and the thr=0.3 rung (surplus 8.68e-5).',
  },
  isRigorous: false,
  honestScope:
    'Measurement/derivation only within the inherited imp-33743/imp-33848 extrapolation component ' +
    'model; NO QED. The component model is NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; ' +
    'imp-3066 K_a >= 0 untouched; establishes no operator positivity; changes no bound; ' +
    'Platt-Trudgian Lambda <= 0.2 remains the SOTA unconditional bound. E_flow is the benign ' +
    'mesoscopic-Gronwall term (imp-2845); its vanishing here does NOT touch the divergent C_Lip ' +
    'collision-Gronwall.',
  citation:
    'imp-33848 (roadmap: sigma(N_cross) = 1/(2 + E_flow/E_trunc), surplus is the E_flow/E_trunc term); ' +
    'imp-33743-sigma-fartail-crossover-closed-form.js (generalised crossover N_cross(thr), identical ' +
    'sub-terms); imp-34134 (E_flow/E_trunc decay ladder); imp-33601 (exact identity sigma=1/2 <=> ' +
    'E_coll=E_trunc+E_flow); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi)); lambda-rh-height-mapping.',
};

export const IMP34174_CROSSOVER_SURPLUS_THRESHOLD_FAMILY_DECAY_ASSERTIONS = [
  {
    // The surplus decreases monotonically as thr shrinks (N_cross recedes, E_flow/E_trunc vanishes).
    id: 'imp34174-surplus-monotone-decreasing-in-thr',
    description: 'surplus(thr) is monotone decreasing as thr shrinks 0.5 -> 0.01 (N_cross recedes deep into the tail)',
    holds: () => surplusMonotoneDecreasing === true && SURPLUS_LADDER[0].surplus_closed_form > SURPLUS_LADDER[4].surplus_closed_form,
  },
  {
    // The closed form surplus(thr) = thr(1-thr)r/(1+(1-thr)r) matches the directly measured thr - sigma(N_cross).
    id: 'imp34174-closed-form-matches-measured-surplus',
    description: 'closed-form surplus matches the directly measured thr - sigma(N_cross(thr)) at every rung to < 1e-6 relative',
    holds: () => SURPLUS_LADDER.every((row) => row.closed_form_vs_measured_rel < 1e-6),
  },
  {
    // thr = 1/2 reproduces imp-33848s 1/2 - sigma(N_cross) = E_flow/(2(2 E_trunc + E_flow)).
    id: 'imp34174-halving-reproduces-imp33848',
    description: 'at thr=1/2 the surplus ~4.744e-4 equals E_flow/(2(2 E_trunc + E_flow)) to floating point (imp-33848)',
    holds: () =>
      Math.abs(HALVING_SURPLUS_MEASURED - HALVING_SURPLUS_EFLOW_FORM) / HALVING_SURPLUS_MEASURED < 1e-9 &&
      Math.abs(HALVING_SURPLUS_MEASURED - 4.7436e-4) < 1e-7,
  },
  {
    // The E_flow/E_trunc surplus vanishes deep in the tail: sub-1e-5 by the far-tail thr=0.1 landmark.
    id: 'imp34174-surplus-vanishes-in-tail',
    description: 'surplus at the imp-33582 far-tail thr=0.1 landmark (N_cross ~3.21e11) is a sub-1e-5 perturbation',
    holds: () => {
      const row = SURPLUS_LADDER.find((r) => r.thr === 0.1);
      return row.surplus_closed_form > 0 && row.surplus_closed_form < 1e-5;
    },
  },
  {
    // thr* where the surplus first drops below 1e-4 sits between the thr=0.5 and thr=0.3 rungs.
    id: 'imp34174-surplus-below-1em4-threshold',
    description: 'surplus drops below 1e-4 at thr* ~ 0.3137 (N_cross ~1.687e10), between the halving and thr=0.3 rungs',
    holds: () =>
      Math.abs(THR_SURPLUS_1EM4 - 0.313723) < 1e-3 &&
      THR_SURPLUS_1EM4 > 0.3 &&
      THR_SURPLUS_1EM4 < 0.5 &&
      Math.abs(surplusClosedForm(THR_SURPLUS_1EM4) - 1e-4) < 1e-9,
  },
  {
    // Honesty gate: derivation/measurement only, isRigorous literal false, C_mb clause named, no QED, PT SOTA.
    id: 'imp34174-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; PT SOTA',
    holds: () =>
      IMP34174_CROSSOVER_SURPLUS_THRESHOLD_FAMILY_DECAY.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34174_CROSSOVER_SURPLUS_THRESHOLD_FAMILY_DECAY.honestScope) &&
      /NO QED/.test(IMP34174_CROSSOVER_SURPLUS_THRESHOLD_FAMILY_DECAY.honestScope) &&
      /remains the SOTA/.test(IMP34174_CROSSOVER_SURPLUS_THRESHOLD_FAMILY_DECAY.honestScope),
  },
];

for (const a of IMP34174_CROSSOVER_SURPLUS_THRESHOLD_FAMILY_DECAY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34174-crossover-surplus-threshold-family-decay assertion failed: ${a.id}`);
  }
}
