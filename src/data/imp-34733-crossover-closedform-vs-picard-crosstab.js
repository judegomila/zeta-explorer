/**
 * @module imp-34733-crossover-closedform-vs-picard-crosstab
 *
 * imp-34733 (numerical, frontier-direction): the N_cross ~ 3.280294e9 landmark (the imp-3444
 * E_coll = E_trunc crossover on the decaying right arm of the imp-3220/imp-3406 conditional share
 * sigma(N)) is reached by TWO inherited routes that have never been directly tabulated against each
 * other:
 *   (A) imp-33723 CLOSED FORM -- the Banach fixed point of N = g(N), g(N) = K log T0(N),
 *       K = (C_C/E_trunc)^2 ~ 1.5727e8, evaluated by 40 iterates from the seed 1e9;
 *   (B) imp-34693/imp-34676 PICARD terminal value -- the SAME map g iterated to double-precision
 *       agreement (12-14 iterates from far seeds, 1 iterate exactly at the fixed point), here taken
 *       to 80 iterates from 1e9 and cross-checked from far seeds 1e10 and 1e300.
 * This module computes both to full IEEE-754 double precision and MEASURES their relative difference,
 * confirming it sits at (indeed below) the ~2.3e-16 floating-point floor with NO systematic offset,
 * then cross-checks that residual against the ~0.4% structural gap to the imp-33582 sigma = 1/2
 * halving landmark N_half ~ 3.267235e9.
 *
 * THE MEASUREMENT
 * ---------------
 *   (M1) BIT-IDENTICAL CROSSOVER. Route (A) 40-iterate closed-form value and route (B) 80-iterate
 *        Picard value land on the EXACT SAME double, 3280294351.65240669 -- relative difference
 *        exactly 0, i.e. at (below) the ~2.3e-16 floating-point floor. Far seeds 1e10 and 1e300
 *        iterated to convergence reproduce the identical double. This is expected and honest: both
 *        routes iterate the SAME strongly-contracting map g (|g_prime(N_cross)| ~ 0.045 << 1), so
 *        they share a unique double-precision fixed point; the check confirms the seed and
 *        iteration-count differences (40 vs 80 iterates, near vs far seed) introduce NO systematic
 *        offset. The two "independent routes" locate ONE landmark, not two.
 *   (M2) RESIDUAL vs THE ~0.4% HALVING GAP. The bit-agreement residual (~0, < floor) sits >12 orders
 *        of magnitude below the genuinely-structural halving gap (N_cross - N_half)/N_cross ~ 3.98e-3
 *        (~0.4%, the imp-33601/imp-33723 Gronwall E_flow displacement). So the crossover-route
 *        agreement is a REPRODUCIBILITY floor, while the halving offset is a real ~0.4% separation to
 *        a DISTINCT landmark -- the two are not remotely comparable, confirming the halving landmark
 *        is not an alternate spelling of the crossover.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A floating-point consistency check of two INHERITED routes to the same surrogate-model landmark.
 * Both routes share the map g and the pinned amplitude K, so bit-agreement is the expected outcome;
 * the deliverable is confirming there is no systematic offset and quantifying its size against the
 * ~0.4% halving gap. Values are IEEE-754 double-precision evaluations via effectiveHeightForN; this
 * adds no interval enclosure (compare the imp-34693a sub-gap) and no new derivation.
 *
 * MEASUREMENT ONLY. Consistency check of two inherited routes, NOT a rigorous asymptotic and NOT an
 * RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation; the C_C = (1/8)
 * sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (route A: closed-form fixed point N_cross)
 * @see imp-34693-crossover-contraction-seed-band (route B: Picard terminal value, iterate counts)
 * @see imp-34676-crossover-contraction-right-widening (right-widening of the same contraction map)
 * @see imp-3444-sigma-nshape-landmark-ladder (bisected crossover + the halving landmark N_half)
 * @see imp-34441-3p28e9-landmark-cluster-reconciliation (the four ~3.28e9 locators tabulated)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-33723 exactly
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-33723/imp-34693)
const FP_FLOOR = 2.3e-16; // the ~machine-epsilon relative agreement floor named in the ticket

// The shared imp-33723/imp-34693 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}

// Route A (imp-33723 CLOSED FORM): 40 iterates from 1e9, exactly as imp-33723 evaluates it.
const N_CROSS_CLOSED_FORM = iterate(1e9, 40);
// Route B (imp-34693/imp-34676 PICARD terminal value): 80 iterates from 1e9, plus far-seed replays.
const N_CROSS_PICARD_80 = iterate(1e9, 80);
const N_CROSS_PICARD_FAR_1E10 = iterate(1e10, 200);
const N_CROSS_PICARD_FAR_1E300 = iterate(1e300, 200);

// (M1) Relative differences between the two routes (bit-identical => exactly 0, below the floor).
const REL_CF_VS_PICARD = Math.abs(N_CROSS_CLOSED_FORM - N_CROSS_PICARD_80) / N_CROSS_PICARD_80;
const REL_CF_VS_FAR_1E10 = Math.abs(N_CROSS_CLOSED_FORM - N_CROSS_PICARD_FAR_1E10) / N_CROSS_PICARD_FAR_1E10;
const REL_CF_VS_FAR_1E300 = Math.abs(N_CROSS_CLOSED_FORM - N_CROSS_PICARD_FAR_1E300) / N_CROSS_PICARD_FAR_1E300;
const BIT_IDENTICAL = N_CROSS_CLOSED_FORM === N_CROSS_PICARD_80; // strict double equality

// (M2) Cross-check: the ~0.4% halving gap to the imp-33582 sigma = 1/2 landmark (reference).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { sigma: E_coll / (E_TRUNC_PT + E_flow + E_coll) };
}
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
const N_HALF = crossBelow((N) => parts(N).sigma, 0.5, 1e6, 1e18); // ~3.267235e9
const HALVING_GAP = (N_CROSS_CLOSED_FORM - N_HALF) / N_CROSS_CLOSED_FORM; // ~3.98e-3

export const IMP34733_CROSSOVER_CLOSEDFORM_VS_PICARD_CROSSTAB = {
  id: 'imp-34733',
  proofSection: 'S-frontier',
  question:
    'imp-33723 derives N_cross ~ 3.280294e9 as a CLOSED-FORM Banach fixed point; imp-34693/imp-34676 ' +
    'reach it as the terminal value of iterating the SAME Picard map g. These two routes have never ' +
    'been directly cross-tabulated. Compute both to full double precision, MEASURE the relative ' +
    'difference, confirm it sits at the ~2.3e-16 floating-point floor with no systematic offset, and ' +
    'cross-check that residual against the ~0.4% gap to the imp-33582 sigma = 1/2 halving landmark. ' +
    'Measurement only; consistency check of two inherited routes; NOT an RH bound; no QED.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6), // (C_C/E_trunc)^2 ~ 1.572709e8
    fp_floor_reference: FP_FLOOR, // 2.3e-16 (the ticket floor)
  },
  routes: {
    // Both stored to 15 sig figs to expose the bit-agreement below the toExponential(6) export used elsewhere.
    N_cross_closed_form_40_iters: +N_CROSS_CLOSED_FORM.toPrecision(15), // 3.28029435165241e9
    N_cross_picard_80_iters: +N_CROSS_PICARD_80.toPrecision(15), // identical double
    N_cross_picard_far_seed_1e10: +N_CROSS_PICARD_FAR_1E10.toPrecision(15), // identical double
    N_cross_picard_far_seed_1e300: +N_CROSS_PICARD_FAR_1E300.toPrecision(15), // identical double
    N_half_sigma_eq_half_imp33582: +N_HALF.toPrecision(15), // ~3.26723519819216e9
  },
  crossTab: {
    rel_closed_form_vs_picard80: REL_CF_VS_PICARD, // exactly 0 (< 2.3e-16 floor)
    rel_closed_form_vs_far_1e10: REL_CF_VS_FAR_1E10, // exactly 0
    rel_closed_form_vs_far_1e300: REL_CF_VS_FAR_1E300, // exactly 0
    bit_identical: BIT_IDENTICAL, // true (strict === )
    at_or_below_fp_floor: REL_CF_VS_PICARD <= FP_FLOOR, // true
    halving_gap_rel: +HALVING_GAP.toExponential(4), // ~3.981e-3
    residual_vs_halving_gap_orders_of_magnitude:
      'the crossover-route residual (~0, < 2.3e-16) is >12 orders of magnitude below the ~3.98e-3 ' +
      'halving gap -- reproducibility floor vs a real ~0.4% separation to a distinct landmark',
  },
  finding:
    'The two inherited routes to N_cross are the SAME strongly-contracting map g(N) = K log T0(N) ' +
    '(|g_prime(N_cross)| ~ 0.045 << 1) truncated differently: imp-33723 takes 40 iterates from 1e9, ' +
    'imp-34693/imp-34676 iterate to double-precision agreement. Cross-tabulated at full IEEE-754 ' +
    'precision they land on the EXACT SAME double, 3280294351.65240669 -- relative difference exactly ' +
    '0, i.e. at (below) the ~2.3e-16 floating-point floor named in the ticket, with far seeds 1e10 and ' +
    '1e300 reproducing the identical double. There is NO systematic offset: the map has a unique ' +
    'double-precision fixed point and both routes land on it bit-for-bit. Cross-checked against the ' +
    'imp-33582 sigma = 1/2 halving landmark, this reproducibility residual sits >12 orders of magnitude ' +
    'below the genuinely-structural halving gap (N_cross - N_half)/N_cross ~ 3.98e-3 (the imp-33601/' +
    'imp-33723 Gronwall E_flow displacement) -- so the two crossover routes locate ONE landmark while ' +
    'the halving landmark N_half ~ 3.267235e9 remains a distinct point ~0.4% below it.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT an RH bound). The imp-33723 closed-form Banach fixed point ' +
    'and the imp-34693/imp-34676 Picard terminal value for N_cross are cross-tabulated at full double ' +
    'precision for the first time: they are two truncations (40 iterates from 1e9 vs iterate-to-' +
    'convergence, including far seeds 1e10/1e300) of the SAME contraction map g(N) = K log T0(N), and ' +
    'they land on the EXACT SAME double 3280294351.65240669 -- relative difference exactly 0, i.e. at ' +
    '(below) the ~2.3e-16 floating-point floor, with NO systematic offset (the map has a unique ' +
    'double-precision fixed point). Cross-checked against the imp-33582 sigma = 1/2 halving landmark, ' +
    'this bit-agreement residual sits >12 orders of magnitude below the structural halving gap ' +
    '(N_cross - N_half)/N_cross ~ 3.98e-3, confirming the two crossover routes are one landmark while ' +
    'the ~0.4% halving offset is a real separation to a distinct point (the Gronwall E_flow ' +
    'displacement per imp-33601/imp-33723). Consistency check of two inherited routes for a surrogate ' +
    'landmark, IEEE-754 double precision, no interval enclosure (compare the imp-34693a sub-gap); the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; ' +
    'imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-33723 (closed-form crossover fixed point N_cross); imp-34693/imp-34676 (Picard terminal value, ' +
    'iterate counts, right-widening); imp-3444 (bisected crossover + halving landmark); imp-33601 ' +
    '(sigma=1/2 <=> E_coll=E_trunc+E_flow offset attribution); imp-34441 (four ~3.28e9 locators ' +
    'reconciled); imp-2642 (C_C = (1/8) sqrt(3 pi) 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP34733_CROSSOVER_CLOSEDFORM_VS_PICARD_CROSSTAB_ASSERTIONS = [
  {
    // (M1): the closed-form and Picard routes agree at or below the ~2.3e-16 floating-point floor.
    id: 'imp34733-routes-agree-at-fp-floor',
    description: 'closed-form (40 iters) vs Picard (80 iters) relative difference <= 2.3e-16 floor, bit-identical',
    holds: () => REL_CF_VS_PICARD <= FP_FLOOR && BIT_IDENTICAL === true,
  },
  {
    // Far seeds (1e10, 1e300) reproduce the SAME double: no systematic seed-dependent offset.
    id: 'imp34733-far-seeds-reproduce-same-double',
    description: 'Picard from far seeds 1e10 and 1e300 matches the closed-form value at the fp floor',
    holds: () => REL_CF_VS_FAR_1E10 <= FP_FLOOR && REL_CF_VS_FAR_1E300 <= FP_FLOOR,
  },
  {
    // The landmark value is the inherited N_cross ~ 3.280294e9.
    id: 'imp34733-value-is-N-cross',
    description: 'both routes land on N_cross ~ 3.280294e9',
    holds: () => Math.abs(N_CROSS_CLOSED_FORM / 3.280294e9 - 1) < 5e-3,
  },
  {
    // (M2): the route-agreement residual is far below the ~0.4% halving gap (distinct-landmark check).
    id: 'imp34733-residual-below-halving-gap',
    description: 'route residual (~0) is orders of magnitude below the ~3.98e-3 halving gap; N_half < N_cross',
    holds: () =>
      Math.abs(HALVING_GAP - 3.98e-3) < 5e-4 &&
      REL_CF_VS_PICARD < HALVING_GAP &&
      N_HALF < N_CROSS_CLOSED_FORM,
  },
  {
    // Honesty gate: measurement of a surrogate consistency property, not rigorous, no QED, no refereed bound is changed.
    id: 'imp34733-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34733_CROSSOVER_CLOSEDFORM_VS_PICARD_CROSSTAB.isRigorous === false &&
      /NO QED/.test(IMP34733_CROSSOVER_CLOSEDFORM_VS_PICARD_CROSSTAB.verdict) &&
      /refereed bound is changed/i.test(IMP34733_CROSSOVER_CLOSEDFORM_VS_PICARD_CROSSTAB.verdict),
  },
];

for (const a of IMP34733_CROSSOVER_CLOSEDFORM_VS_PICARD_CROSSTAB_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34733-crossover-closedform-vs-picard-crosstab assertion failed: ${a.id}`);
  }
}
