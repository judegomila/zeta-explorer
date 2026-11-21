/**
 * @module imp-36174-eflow-strictness-margin-shortfall-height-ladder
 *
 * imp-36174 (numerical, S-frontier): MEASURE, within the inherited imp-3220/imp-3406
 * extrapolation component model sigma(N) = E_coll/(E_coll+E_trunc+E_flow), the
 * E_flow(N_cross) > 0 STRICTNESS MARGIN that underpins the imp-33848 closed-form
 * strict ordering N_half < N_cross, and quantify the associated shortfall
 *
 *     s(r) := 1/2 - 1/(2 + r),   r := E_flow/E_trunc,
 *
 * ACROSS A HEIGHT LADDER rather than at the single crossover point.
 *
 * WHY THIS IS DISTINCT FROM imp-35102
 * -----------------------------------
 * imp-35102 evaluated the surplus 1/2 - sigma(N_cross) at the SINGLE located crossover
 * N_cross ~ 3.280294e9 (where E_coll = E_trunc, so sigma = 1/(2+r) exactly). It confirmed
 * that number (~4.74e-4) reproduces the two closed forms. It did NOT tabulate the
 * E_flow/E_trunc-driven shortfall FUNCTIONAL s(r(N)) across heights, nor track how the
 * E_flow > 0 strictness margin decays up the ladder. This module supplies exactly that
 * missing table: at N_cross the shortfall functional COINCIDES with the actual 1/2 - sigma
 * (because E_coll = E_trunc there), and away from N_cross it is the would-be crossover
 * shortfall dictated by r(N) alone. Reporting it across a ladder shows the margin is
 * strictly positive at every height and shrinks toward 0 as the Gronwall flow term
 * E_flow ~ (log T0)^2 / (2 pi T0) decays with height -- i.e. the strictness is real but
 * asymptotically vanishing.
 *
 * THE COMPONENT MODEL (identical pinned sub-terms to imp-33601 / imp-33848 / imp-35102)
 * -----------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_coll + E_trunc + E_flow),
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)                (dominant, GUE-conditional C_H)
 *     E_flow  = C_F (log T0 / T0) * Gronwall, C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     E_trunc = 3.06e-5                                       (N-independent, imp-2631)
 *     T0      = effectiveHeightForN(N)                        (Riemann-von Mangoldt inverse)
 *
 * At the crossover E_coll = E_trunc, so
 *     sigma(N_cross) = E_trunc/(2 E_trunc + E_flow) = 1/(2 + r),
 *     surplus = 1/2 - sigma(N_cross) = r/(2(2 + r)) = s(r(N_cross)).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) E_flow(N) > 0 at every rung of the height ladder [1e8 .. 1e13] -- the strictness
 *        margin is strictly positive everywhere (product of strictly positive factors:
 *        C_F, log T0, 1/T0, Gronwall). At N_cross specifically E_flow ~ 5.81e-8 > 0, so
 *        (C1) holds with room to spare, NOT marginally.
 *   (M2) The shortfall functional s(r(N)) = 1/2 - 1/(2 + E_flow/E_trunc) is strictly
 *        positive AND strictly decreasing up the ladder: ~8.80e-3 at N=1e8 down to
 *        ~4.20e-7 at N=1e13, dropping ~roughly one order of magnitude per decade of N as
 *        E_flow/E_trunc falls. So sigma(N_cross) < 1/2 is confirmed, and the margin by which
 *        it beats 1/2 collapses with height.
 *   (M3) At the anchor rung N_cross the shortfall functional s(r(N_cross)) ~ 4.7436e-4
 *        reproduces the imp-35102 measured surplus 1/2 - sigma(N_cross) to ~6 significant
 *        figures -- confirming that the ladder functional and the actual sigma-surplus are
 *        one quantity at the crossover.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35102-nhalf-ncross-strictness-multirung-verify (single-point surplus this ladder extends)
 * @see imp-33848-nhalf-ncross-strict-ordering-closed-form (the two closed-form conditions)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (source parts(N) model + surplus identity)
 * @see imp-36182-nhalf-ncross-component-model-honest-status (model-internal-not-rigorous banner)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35102_NHALF_NCROSS_STRICTNESS_MULTIRUNG_VERIFY } from './imp-35102-nhalf-ncross-strictness-multirung-verify.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33601/imp-35102 exactly

// EXACT imp-3406/imp-33601/imp-35102 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // Gronwall flow term (strictly positive)
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, C_F, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// The E_flow/E_trunc-driven crossover shortfall functional: s(r) = 1/2 - 1/(2 + r).
const shortfall = (r) => r / (2 * (2 + r)); // = 1/2 - 1/(2 + r), simplified

// Anchor: the imp-33723/imp-35102 located crossover N_cross ~ 3.280294e9 where E_coll = E_trunc.
const N_CROSS = IMP35102_NHALF_NCROSS_STRICTNESS_MULTIRUNG_VERIFY.landmarks.N_cross_Ecoll_eq_Etrunc;

// A height LADDER spanning five decades, with the crossover as its anchor rung.
const LADDER_NS = Object.freeze([1e8, 1e9, N_CROSS, 1e10, 1e11, 1e12, 1e13]);

const LADDER = LADDER_NS.map((N) => {
  const p = parts(N);
  const r = p.E_flow / E_TRUNC_PT; // E_flow/E_trunc ratio driving the shortfall
  return {
    N: +N.toExponential(6),
    isAnchorCrossover: N === N_CROSS,
    T0: +p.T0.toExponential(6),
    E_flow: +p.E_flow.toExponential(6), // (M1) strictness margin, strictly positive
    E_flow_over_E_trunc: +r.toExponential(6),
    shortfall: +shortfall(r).toExponential(6), // (M2) s(r(N)) = 1/2 - 1/(2 + r)
    sigma: +p.sigma.toFixed(9),
  };
});

// (M1) E_flow(N) > 0 at every rung -- the strictness margin is strictly positive everywhere.
const M1_MARGIN_POSITIVE_ALL_RUNGS = LADDER.every((r) => r.E_flow > 0);

// (M2) the shortfall functional is strictly positive AND strictly decreasing up the ladder.
let M2_SHORTFALL_STRICTLY_DECREASING = true;
for (let i = 1; i < LADDER.length; i++) {
  if (!(LADDER[i].shortfall < LADDER[i - 1].shortfall)) M2_SHORTFALL_STRICTLY_DECREASING = false;
}
const M2_SHORTFALL_ALL_POSITIVE = LADDER.every((r) => r.shortfall > 0);

// (M3) at the anchor crossover, the shortfall functional matches the imp-35102 measured surplus
//      1/2 - sigma(N_cross), because E_coll = E_trunc there so sigma = 1/(2 + r).
const ANCHOR = LADDER.find((r) => r.isAnchorCrossover);
const IMP35102_SURPLUS = IMP35102_NHALF_NCROSS_STRICTNESS_MULTIRUNG_VERIFY.surplusIdentity.surplus_measured;
const ANCHOR_MATCHES_IMP35102 =
  Math.abs(ANCHOR.shortfall - IMP35102_SURPLUS) / IMP35102_SURPLUS < 1e-5;
const ANCHOR_SIGMA_BELOW_HALF = ANCHOR.sigma < 0.5;

// Decay diagnostic: how many orders of magnitude the shortfall drops top-to-bottom of the ladder.
const SHORTFALL_TOP = LADDER[0].shortfall; // N = 1e8
const SHORTFALL_BOTTOM = LADDER[LADDER.length - 1].shortfall; // N = 1e13
const SHORTFALL_DECADE_SPAN = Math.log10(SHORTFALL_TOP / SHORTFALL_BOTTOM);

export const IMP36174_EFLOW_STRICTNESS_MARGIN_SHORTFALL_HEIGHT_LADDER = {
  id: 'imp-36174',
  proofSection: 'S-frontier',
  question:
    'Measure the E_flow(N_cross) > 0 strictness margin underpinning the imp-33848 closed-form ' +
    'N_half < N_cross ordering, and quantify the shortfall 1/2 - sigma(N_cross) = 1/(2 + E_flow/E_trunc) ' +
    'shortfall ACROSS A HEIGHT LADDER (extending the single-point imp-35102 surplus). Measurement ' +
    'within the component model only; conditional-share diagnostic, NOT an RH bound; no QED.',
  model: {
    sigma: 'sigma(N) = E_coll/(E_coll + E_trunc + E_flow)',
    E_flow: 'E_flow = C_F (log T0/T0) Gronwall, C_F = (log(T0/2pi)+1)/2pi  (imp-398)',
    E_trunc: 'E_trunc = 3.06e-5  (N-independent fixed strip, imp-2631)',
    E_coll: 'E_coll = C_C_PINNED sqrt(log T0 / N)  (GUE-conditional C_H, imp-486)',
    shortfall: 's(r) = 1/2 - 1/(2 + r), r = E_flow/E_trunc; equals 1/2 - sigma only at the crossover',
  },
  anchor: {
    N_cross: N_CROSS,
    E_flow_at_N_cross: ANCHOR.E_flow, // ~5.81e-8 > 0 (the strictness margin)
    E_flow_over_E_trunc_at_N_cross: ANCHOR.E_flow_over_E_trunc, // ~1.90e-3
    shortfall_at_N_cross: ANCHOR.shortfall, // ~4.74e-4
    sigma_at_N_cross: ANCHOR.sigma, // ~0.499526 < 1/2
    imp35102_surplus_measured: IMP35102_SURPLUS, // cross-check target
  },
  ladder: LADDER,
  decay: {
    shortfall_at_1e8: SHORTFALL_TOP, // ~8.80e-3
    shortfall_at_1e13: SHORTFALL_BOTTOM, // ~4.20e-7
    orders_of_magnitude_dropped: +SHORTFALL_DECADE_SPAN.toFixed(3), // ~4.3 across five decades
  },
  finding: {
    M1_strictness_margin_positive_all_rungs:
      'E_flow(N) > 0 at every rung of the height ladder [1e8 .. 1e13]; at N_cross E_flow ~ 5.81e-8, ' +
      'so (C1) E_flow(N_cross) > 0 holds with room, not marginally.',
    M2_shortfall_positive_and_decreasing:
      'The shortfall functional s(r(N)) = 1/2 - 1/(2 + E_flow/E_trunc) is strictly positive and ' +
      'strictly decreasing up the ladder, ~8.80e-3 at N=1e8 down to ~4.20e-7 at N=1e13 (~one order ' +
      'of magnitude per decade), so sigma(N_cross) < 1/2 with a margin that collapses with height.',
    M3_anchor_matches_imp35102:
      'At the anchor crossover N_cross the shortfall functional ~4.7436e-4 reproduces the imp-35102 ' +
      'measured surplus 1/2 - sigma(N_cross) to ~6 significant figures -- the ladder functional and ' +
      'the actual sigma-surplus coincide at the crossover (where E_coll = E_trunc).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Within the inherited imp-3220/imp-3406 ' +
    'component model the E_flow(N_cross) > 0 strictness margin is confirmed strictly positive ' +
    '(E_flow ~5.81e-8), and the shortfall 1/2 - sigma(N_cross) = 1/(2 + E_flow/E_trunc) is tabulated ' +
    'across a five-decade height ladder [1e8 .. 1e13]: the E_flow/E_trunc-driven shortfall functional ' +
    'is strictly positive and strictly decreasing (~8.80e-3 -> ~4.20e-7, ~4.3 orders of magnitude), ' +
    'reproducing the imp-35102 single-point surplus ~4.74e-4 at the anchor crossover. So the strict ' +
    'ordering N_half < N_cross rests on a real but asymptotically vanishing margin. The component ' +
    'model is the inherited extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no ' +
    'bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35102 (single-point surplus this ladder extends); imp-33848 (two closed-form strictness ' +
    'conditions); imp-33723 (closed-form N_cross); imp-33601 (parts(N) model + surplus identity); ' +
    'imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP36174_EFLOW_STRICTNESS_MARGIN_SHORTFALL_HEIGHT_LADDER_ASSERTIONS = [
  {
    // Reuse gate: the anchor is the imp-35102 located crossover, proving the identical model.
    id: 'imp36174-anchor-is-imp35102-ncross',
    description: 'anchor rung N_cross ~3.280294e9 comes from imp-35102 landmarks',
    holds: () => Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3,
  },
  {
    // (M1): the E_flow > 0 strictness margin is strictly positive at every rung.
    id: 'imp36174-M1-strictness-margin-positive-all-rungs',
    description: 'E_flow(N) > 0 at every ladder rung (strictness margin > 0)',
    holds: () => M1_MARGIN_POSITIVE_ALL_RUNGS && ANCHOR.E_flow > 0,
  },
  {
    // (M2): the shortfall functional is strictly positive and strictly decreasing up the ladder.
    id: 'imp36174-M2-shortfall-positive-and-decreasing',
    description: 's(r(N)) = 1/2 - 1/(2 + E_flow/E_trunc) strictly positive and strictly decreasing',
    holds: () => M2_SHORTFALL_ALL_POSITIVE && M2_SHORTFALL_STRICTLY_DECREASING,
  },
  {
    // (M3): at the crossover the shortfall functional matches imp-35102 measured surplus,
    // and sigma(N_cross) < 1/2 -- the strict-ordering shortfall is confirmed numerically.
    id: 'imp36174-M3-anchor-matches-imp35102-surplus',
    description: 'shortfall at N_cross reproduces imp-35102 surplus (rel < 1e-5) and sigma < 1/2',
    holds: () => ANCHOR_MATCHES_IMP35102 && ANCHOR_SIGMA_BELOW_HALF,
  },
  {
    // The shortfall really spans multiple orders of magnitude across the five-decade ladder,
    // so the "across a height ladder" measurement is substantive, not a flat readout.
    id: 'imp36174-shortfall-spans-orders-of-magnitude',
    description: 'shortfall drops ~4.3 orders of magnitude across [1e8 .. 1e13]',
    holds: () => SHORTFALL_DECADE_SPAN > 3.5 && SHORTFALL_TOP > SHORTFALL_BOTTOM,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp36174-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP36174_EFLOW_STRICTNESS_MARGIN_SHORTFALL_HEIGHT_LADDER.isRigorous === false &&
      /NO QED/.test(IMP36174_EFLOW_STRICTNESS_MARGIN_SHORTFALL_HEIGHT_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP36174_EFLOW_STRICTNESS_MARGIN_SHORTFALL_HEIGHT_LADDER.verdict),
  },
];

for (const a of IMP36174_EFLOW_STRICTNESS_MARGIN_SHORTFALL_HEIGHT_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-36174-eflow-strictness-margin-shortfall-height-ladder assertion failed: ${a.id}`,
    );
  }
}

export default IMP36174_EFLOW_STRICTNESS_MARGIN_SHORTFALL_HEIGHT_LADDER;
