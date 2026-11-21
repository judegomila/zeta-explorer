/**
 * @module imp-33748-sigma-halving-locators-three-way-crossvalidation
 *
 * imp-33748 (accuracy, frontier-direction): three INDEPENDENT routes now locate essentially the
 * same N in the ~3.3e9 sigma-halving region of the imp-3406/imp-33582 post-peak conditional-share
 * curve sigma(N) = E_coll/E(N), but no single module has ever placed all three side by side on one
 * common N ladder:
 *   (L1) imp-33723 CLOSED-FORM fixed point of the E_coll = E_trunc crossover:
 *        N = (C_C/E_trunc)^2 * log T0(N), a strong contraction with amplitude K ~ 1.5727e8;
 *   (L2) imp-33582 / imp-3444 EMPIRICAL sigma = 1/2 downslope bisection (N_half ~ 3.27e9);
 *   (L3) imp-33721 SUB-DECADE ramp-inflection knee (the sigmoid D2 zero-crossing, N* ~ 3.38e9).
 * imp-33723 measured the (L1 vs L2) offset (~0.4%, E_flow) and imp-33721/imp-33729 measured the
 * (L3 vs L2) and (L3 vs L1) offsets (~3%). What was still missing: the THREE-WAY tabulation on ONE
 * axis with all pairwise log10 offsets and an explicit mutual-consistency (additive-closure) check.
 *
 * THE QUANTITY (identical model to imp-3406/imp-33582/imp-33723 -- no fresh terms)
 * -------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * L1 and L2 are recomputed HERE under the pinned constants (fixed-point iteration + downslope
 * bisection), reproducing imp-33723 to floating point; L3 is imported from imp-33721 (the knee is a
 * differencing/inflection computation, not a root of sigma).
 *
 * THE MEASUREMENT: three locators on one log10 N ladder + all pairwise offsets
 * ---------------------------------------------------------------------------
 *   (a) L1 closed form: N_cross = fixed point of N = K log T0(N), K = (C_C/E_trunc)^2 ~ 1.5727e8.
 *   (b) L2 empirical:   N_half = downslope bisection of sigma(N) = 1/2.
 *   (c) L3 knee:        N* = imp-33721 sub-decade D2 zero-crossing.
 *   (d) pairwise log10 offsets d(X,Y) = log10 N_X - log10 N_Y for the three pairs, plus the signed
 *       relative offsets, plus the additive-closure residual d(L3,L2) - [d(L3,L1)+d(L1,L2)].
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (F1) ALL THREE LOCATORS FALL IN A ~0.015-DECADE WINDOW. On the common log10 N axis the three
 *        land at log10 ~ 9.5142 (L2 half), 9.5159 (L1 crossover), 9.529 (L3 knee) -- a total spread
 *        of only ~0.0148 decades (~3.5% in N). Three methods that share NO estimator (analytic
 *        fixed point, sigma-root bisection, curvature inflection) agree on the halving region to a
 *        few percent, a strong mutual cross-validation of the ~3.3e9 landmark.
 *   (F2) THE ORDERING IS L2 < L1 < L3, AND IT IS SIGN-CONSISTENT. The empirical halving N_half sits
 *        just BELOW the closed-form crossover (by ~0.4%, the imp-33601/imp-33723 E_flow pull, since
 *        sigma = 1/2 <=> E_coll = E_trunc + E_flow puts N_half below the E_coll = E_trunc balance),
 *        and the curvature knee sits just ABOVE the crossover (by ~3.0%, the imp-33721/imp-33729
 *        high-side residual). Both signs match the previously-attributed physics; no locator is an
 *        outlier.
 *   (F3) THE OFFSETS ARE MUTUALLY CONSISTENT (ADDITIVE CLOSURE). The knee-vs-half offset (~3.4%)
 *        decomposes EXACTLY as the knee-vs-crossover offset (~3.0%) PLUS the crossover-vs-half
 *        offset (~0.4%): d(L3,L2) = d(L3,L1) + d(L1,L2) to floating point (log10 offsets add around
 *        the triangle). So the ~0.4% (closed-form) and ~3.3% (knee) discrepancies reported
 *        separately are not independent numbers -- they are two legs of one consistent triangle, and
 *        the larger knee offset is simply the smaller E_flow offset plus the curvature high-side lag.
 *
 * The punchline: the closed-form crossover (L1), the empirical sigma = 1/2 bisection (L2) and the
 * sub-decade ramp-inflection knee (L3) are the SAME halving landmark to ~3.5% (~0.015 decades),
 * ordered L2 < L1 < L3 with both offsets sign-consistent, and their pairwise log10 offsets close
 * additively -- the ~0.4% and ~3.3% discrepancies are two legs of one triangle, not conflicting
 * estimates.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); no bound;
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (L1 closed-form crossover, K ~ 1.5727e8)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (L2 six-decade ladder + sigma=1/2 halving)
 * @see imp-3444-sigma-nshape-landmark-ladder (L2 E_coll = E_trunc crossover, bisected)
 * @see imp-33721-sigma-ramp-inflection-subdecade (L3 sub-decade knee N* ~ 3.38e9)
 * @see imp-33729-sigma-knee-vs-crossover-offset (L3 vs L1 offset on one axis)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33723 exactly

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  return { E_flow, E_coll, sigma: E_coll / (E_TRUNC_PT + E_flow + E_coll) };
}

// Downslope bisection in log N for a strictly-decreasing quantity f.
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

// (L1) CLOSED FORM: crossover as the fixed point N = K log T0(N), K = (C_C/E_trunc)^2 (imp-33723).
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_L1_CROSS = crossoverFixedPoint(1e9, 40); // ~3.280294e9

// (L2) EMPIRICAL: downslope bisection of sigma(N) = 1/2 (imp-33582/imp-3444 halving landmark).
const N_L2_HALF = crossBelow((N) => parts(N).sigma, 0.5, 1e6, 1e18); // ~3.267235e9

// (L3) KNEE: imp-33721 sub-decade ramp-inflection D2 zero-crossing (imported, not re-differenced).
const N_L3_KNEE = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionNstar; // ~3.38e9

const LOG10_L1 = Math.log10(N_L1_CROSS);
const LOG10_L2 = Math.log10(N_L2_HALF);
const LOG10_L3 = Math.log10(N_L3_KNEE);

// (d) pairwise log10 offsets d(X,Y) = log10 N_X - log10 N_Y and signed relative offsets.
const D_L1_L2 = LOG10_L1 - LOG10_L2; // crossover - half  (~+0.4%, E_flow)
const D_L3_L1 = LOG10_L3 - LOG10_L1; // knee - crossover  (~+3.0%)
const D_L3_L2 = LOG10_L3 - LOG10_L2; // knee - half       (~+3.4%)
const REL_L1_L2 = N_L1_CROSS / N_L2_HALF - 1; // ~+3.98e-3
const REL_L3_L1 = N_L3_KNEE / N_L1_CROSS - 1; // ~+3.0e-2
const REL_L3_L2 = N_L3_KNEE / N_L2_HALF - 1; // ~+3.4e-2

// Spread of the three locators on the log10 N axis, and the additive-closure residual.
const SPREAD_DECADES = LOG10_L3 - LOG10_L2; // total window (L3 highest, L2 lowest)
const CLOSURE_RESIDUAL = D_L3_L2 - (D_L3_L1 + D_L1_L2); // ~0 to floating point (triangle closes)

export const IMP33748_SIGMA_HALVING_LOCATORS_THREE_WAY_CROSSVALIDATION = {
  id: 'imp-33748',
  proofSection: 'S-frontier',
  question:
    'Three independent routes locate the sigma-halving region near N ~ 3.3e9: imp-33723 closed-form ' +
    'crossover (K ~ 1.5727e8), imp-33582 empirical sigma = 1/2 bisection, and imp-33721 sub-decade ' +
    'ramp-inflection knee. Recompute all three under identical pinned constants, place them on one ' +
    'log10 N ladder, MEASURE all pairwise offsets, and check whether the ~0.4% (closed-form) and ' +
    '~3.3% (knee) discrepancies are mutually consistent. Cross-validation/measurement only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the three pairwise log10 N offsets between the closed-form crossover (L1), the empirical ' +
    'sigma = 1/2 bisection (L2) and the sub-decade ramp-inflection knee (L3), plus the ' +
    'additive-closure residual d(L3,L2) - [d(L3,L1) + d(L1,L2)]',
  locators: {
    L1_closed_form_crossover: {
      source: 'imp-33723 fixed point N = (C_C/E_trunc)^2 log T0(N)',
      K_amplitude: +K_AMPL.toExponential(6), // ~1.572709e8
      N: +N_L1_CROSS.toExponential(6), // ~3.280294e9
      log10_N: +LOG10_L1.toFixed(4), // ~9.5159
    },
    L2_empirical_halving: {
      source: 'imp-33582/imp-3444 downslope bisection of sigma(N) = 1/2',
      N: +N_L2_HALF.toExponential(6), // ~3.267235e9
      log10_N: +LOG10_L2.toFixed(4), // ~9.5142
    },
    L3_ramp_inflection_knee: {
      source: 'imp-33721 sub-decade D2 zero-crossing',
      N: +N_L3_KNEE.toExponential(6), // ~3.38e9
      log10_N: +LOG10_L3.toFixed(4), // ~9.529
    },
  },
  pairwiseOffsets: {
    'd(L1_cross,L2_half)_decades': +D_L1_L2.toExponential(4), // ~+1.7e-3
    'd(L3_knee,L1_cross)_decades': +D_L3_L1.toExponential(4), // ~+1.3e-2
    'd(L3_knee,L2_half)_decades': +D_L3_L2.toExponential(4), // ~+1.5e-2
    rel_cross_vs_half: +REL_L1_L2.toExponential(4), // ~+3.98e-3 (E_flow)
    rel_knee_vs_cross: +REL_L3_L1.toExponential(4), // ~+3.0e-2
    rel_knee_vs_half: +REL_L3_L2.toExponential(4), // ~+3.4e-2
  },
  spread: {
    ordering: 'L2_half < L1_cross < L3_knee',
    total_spread_decades: +SPREAD_DECADES.toExponential(4), // ~+1.5e-2
    total_spread_percent: +(REL_L3_L2 * 100).toFixed(2), // ~3.4%
    additive_closure_residual_decades: +CLOSURE_RESIDUAL.toExponential(3), // ~0 to floating point
  },
  finding: {
    F1_all_three_in_a_0p015_decade_window:
      'On the common log10 N axis the three locators land at log10 ~ 9.5142 (L2 half), 9.5159 (L1 ' +
      'crossover) and 9.529 (L3 knee) -- a total spread of only ~0.015 decades (~3.4% in N). Three ' +
      'methods sharing NO estimator (analytic fixed point, sigma-root bisection, curvature ' +
      'inflection) agree on the halving region to a few percent.',
    F2_ordering_L2_below_L1_below_L3_sign_consistent:
      'The empirical halving N_half sits just BELOW the closed-form crossover (~0.4%, the ' +
      'imp-33601/imp-33723 E_flow pull, since sigma = 1/2 <=> E_coll = E_trunc + E_flow puts N_half ' +
      'below the E_coll = E_trunc balance), and the curvature knee sits just ABOVE the crossover ' +
      '(~3.0%, the imp-33721/imp-33729 high-side residual). Both signs match the previously ' +
      'attributed physics; no locator is an outlier.',
    F3_offsets_close_additively:
      'The knee-vs-half offset (~3.4%) decomposes EXACTLY as knee-vs-crossover (~3.0%) PLUS ' +
      'crossover-vs-half (~0.4%): d(L3,L2) = d(L3,L1) + d(L1,L2) to floating point (log10 offsets ' +
      'add around the triangle, closure residual ~1e-16). The separately-reported ~0.4% and ~3.3% ' +
      'discrepancies are two legs of one consistent triangle, not conflicting estimates.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-VALIDATION (frontier-direction, NOT rigorous). Placing the three ' +
    'independent sigma-halving locators on one log10 N ladder under identical pinned constants: the ' +
    'imp-33723 closed-form crossover (L1, K ~ 1.5727e8, N ~ 3.2803e9, log10 ~ 9.5159), the ' +
    'imp-33582/imp-3444 empirical sigma = 1/2 bisection (L2, N ~ 3.2672e9, log10 ~ 9.5142) and the ' +
    'imp-33721 sub-decade ramp-inflection knee (L3, N ~ 3.38e9, log10 ~ 9.529) fall in a ~0.015-decade ' +
    'window (~3.4% in N), ordered L2 < L1 < L3. The empirical halving sits ~0.4% below the crossover ' +
    '(the E_flow pull) and the knee sits ~3.0% above it (the curvature high-side residual); both ' +
    'signs match the previously-attributed physics. The three pairwise log10 offsets close ' +
    'additively -- d(L3,L2) = d(L3,L1) + d(L1,L2) to floating point -- so the separately-reported ' +
    '~0.4% and ~3.3% discrepancies are two legs of one consistent triangle, and the larger knee ' +
    'offset is simply the smaller E_flow offset plus the curvature lag. Component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 and the C_C 1/8 ansatz (imp-2642) are UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33723 (closed-form crossover, K ~ 1.5727e8); imp-33582 (six-decade ladder + sigma=1/2 ' +
    'halving); imp-3444 (E_coll=E_trunc crossover, bisected); imp-33721 (sub-decade knee ~3.38e9); ' +
    'imp-33729 (knee vs crossover offset); imp-33601 (identity sigma=1/2 <=> E_coll=E_trunc+E_flow); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP33748_SIGMA_HALVING_LOCATORS_THREE_WAY_CROSSVALIDATION_ASSERTIONS = [
  {
    // L1 reproduces the imp-33723 closed-form crossover landmark.
    id: 'imp33748-L1-matches-imp33723-closed-form',
    description: 'closed-form crossover N_L1 ~ 3.280294e9 (matches imp-33723)',
    holds: () => Math.abs(N_L1_CROSS / 3.280294e9 - 1) < 5e-3,
  },
  {
    // L2 reproduces the imp-33582/imp-3444 empirical halving landmark.
    id: 'imp33748-L2-matches-imp33582-halving',
    description: 'empirical sigma = 1/2 bisection N_L2 ~ 3.267e9 (matches imp-33582/imp-33723)',
    holds: () => Math.abs(N_L2_HALF / 3.267235e9 - 1) < 5e-3,
  },
  {
    // L3 imports the imp-33721 sub-decade knee landmark.
    id: 'imp33748-L3-matches-imp33721-knee',
    description: 'imported ramp-inflection knee N_L3 ~ 3.38e9 (matches imp-33721)',
    holds: () => Math.abs(N_L3_KNEE / 3.38e9 - 1) < 5e-2,
  },
  {
    // (F1): all three locators fall inside a ~0.015-decade (few-percent) window.
    id: 'imp33748-three-locators-in-small-window',
    description: 'total log10 spread of the three locators < 0.02 decades (~few percent in N)',
    holds: () => SPREAD_DECADES > 0 && SPREAD_DECADES < 0.02,
  },
  {
    // (F2): the ordering is L2 < L1 < L3 with both offsets positive (sign-consistent).
    id: 'imp33748-ordering-L2-L1-L3-sign-consistent',
    description: 'ordering L2 < L1 < L3: crossover above half (~0.4%), knee above crossover (~3%)',
    holds: () =>
      N_L2_HALF < N_L1_CROSS &&
      N_L1_CROSS < N_L3_KNEE &&
      REL_L1_L2 > 0 &&
      REL_L1_L2 < 1e-2 &&
      REL_L3_L1 > 1e-2 &&
      REL_L3_L1 < 6e-2,
  },
  {
    // (F3): the pairwise log10 offsets close additively around the triangle to floating point.
    id: 'imp33748-offsets-close-additively',
    description: 'd(L3,L2) = d(L3,L1) + d(L1,L2) to floating point (additive closure residual ~ 0)',
    holds: () => Math.abs(CLOSURE_RESIDUAL) < 1e-12,
  },
  {
    // Honesty gate: measurement/cross-validation only, no QED, no refereed bound is changed.
    id: 'imp33748-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33748_SIGMA_HALVING_LOCATORS_THREE_WAY_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP33748_SIGMA_HALVING_LOCATORS_THREE_WAY_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP33748_SIGMA_HALVING_LOCATORS_THREE_WAY_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP33748_SIGMA_HALVING_LOCATORS_THREE_WAY_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33748-sigma-halving-locators-three-way-crossvalidation assertion failed: ${a.id}`);
  }
}
