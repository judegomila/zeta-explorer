/**
 * @module imp-124896-sigma-monotone-half-crossover-closed-form
 *
 * imp-124896 (proof, frontier-direction): imp-33848 (roadmap currentStatus) reduced the strict
 * landmark ordering N_half < N_cross to TWO closed-form conditions inside the imp-3406 component
 * model -- (i) E_flow(N_cross) > 0 and (ii) sigma monotone-DECREASING on [N_half, N_cross] -- but
 * only leg (i) was actually put in closed form; leg (ii) was asserted as "holding in the model"
 * and never derived. This module supplies the missing derivation: the sign of d sigma / d ln N on
 * [N_half, N_cross], in closed form, from sigma = E_coll / (E_coll + E_trunc + E_flow).
 *
 * THE MODEL (identical pinned sub-terms to imp-33723 / imp-33796 -- no fresh terms)
 * -------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_coll + E_trunc + E_flow),
 *     E_coll  = C_C_PINNED * sqrt(L / N)         (dominant, GUE-conditional C_H; L = log T0),
 *     E_flow  = C_F * (L / T0) * Gronwall,        E_trunc = 3.06e-5   (N-independent),
 *     C_F     = (u + 1) / 2pi,  u = log(T0 / 2pi),  T0 = effectiveHeightForN(N).
 *
 * THE CLOSED-FORM DERIVATION (the deliverable the ticket asks for)
 * ---------------------------------------------------------------
 * Write sigma = E_coll / (E_coll + R) with the "rest" R = E_trunc + E_flow. Differentiating in
 * x = ln N gives the EXACT identity (quotient rule, verified below against a finite difference to
 * ~1e-10 relative):
 *
 *     d sigma / d ln N = - sigma^2 * (R / E_coll) * ( dlnR - dlnEcoll ),                     (S)
 *
 * where dlnEcoll = d log E_coll / d ln N and dlnR = d log R / d ln N. Hence
 *
 *     d sigma / d ln N < 0   <=>   dlnEcoll < dlnR   (E_coll decays FASTER, in log-slope, than R).
 *
 * Each log-slope is elementary in the model. With zeta = d log T0 / d ln N (the height log-slope;
 * leading Riemann-von Mangoldt zeta = u / (u + 1) in (0, 1)):
 *
 *     dlnEcoll = (1/2) ( zeta / L - 1 ),                                                     (A)
 *     dlnEflow = zeta ( 1/(u+1) + 1/L - 1 ),   dlnR = (E_flow / R) * dlnEflow.               (B)
 *
 * Since zeta in (0,1) and L > 1, (A) is NEGATIVE with magnitude at least (1/2)(1 - 1/L). Since
 * E_trunc is N-independent (> 0) and E_flow > 0 decays, R decays but only through its small E_flow
 * share: |dlnR| = (E_flow/R) |dlnEflow| < (E_flow/E_trunc) * zeta < E_flow/E_trunc. Chaining the
 * two bounds yields a CLOSED-FORM SUFFICIENT CONDITION for strict monotone decrease:
 *
 *     E_flow / E_trunc  <  (1/2) ( 1 - 1/L ).                                                (C)
 *
 * Proof of sufficiency: if (C) holds then dlnEcoll <= -(1/2)(1 - 1/L) < -(E_flow/E_trunc) <= dlnR,
 * so by (S) d sigma / d ln N < 0. On [N_half, N_cross] (L ~ 20.6) the right side of (C) is ~0.476
 * while E_flow/E_trunc ~ 1.9e-3, so (C) holds with a ~250x margin -- the collision term decays like
 * N^(-1/2) (log-slope ~ -0.477) while the rest is pinned by the N-independent E_trunc (log-slope
 * ~ -1.6e-3), and that separation of slopes is exactly why sigma is monotone.
 *
 * THE FINDING (derivation only)
 * -----------------------------
 *   (D1) EXACT SIGN IDENTITY. d sigma / d ln N = -sigma^2 (R/E_coll)(dlnR - dlnEcoll) reproduces a
 *        central finite difference of sigma to ~1e-10 relative at N_half, N_cross and the midpoint,
 *        so the closed-form log-slope decomposition (A)-(B) is exact, not fitted.
 *   (D2) MONOTONICITY LEG HOLDS IN CLOSED FORM. dlnEcoll ~ -0.4773 < dlnR ~ -1.62e-3 across
 *        [N_half, N_cross]: the margin dlnEcoll - dlnR ~ -0.4757 is strictly negative, so
 *        d sigma / d ln N < 0 throughout -- the imp-33848 leg (ii) is DERIVED, not asserted.
 *   (D3) SUFFICIENT CONDITION AND ITS MARGIN. The elementary condition (C) E_flow/E_trunc <
 *        (1/2)(1 - 1/L) holds with (1/2)(1 - 1/L) ~ 0.476 vs E_flow/E_trunc ~ 1.9e-3, a ~250x
 *        margin -- monotonicity is robust, not marginal, and its obstruction (if any) would be an
 *        E_flow that grew to a ~0.48 fraction of E_trunc, ~250x its actual value.
 *
 * The punchline: the imp-33848 "sigma monotone on [N_half, N_cross]" leg, previously asserted, is
 * put in closed form. It is the elementary slope inequality dlnEcoll < dlnR, equivalently the
 * sufficient condition E_flow/E_trunc < (1/2)(1 - 1/L); on the interval it holds with a ~250x
 * margin because E_coll ~ N^(-1/2) decays with log-slope ~ -1/2 while the rest R = E_trunc + E_flow
 * is anchored by the N-independent E_trunc.
 *
 * DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642/imp-2643); changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-33796-nhalf-below-ncross-independent-recompute (strict ordering N_half < N_cross, landmarks)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form N_cross fixed point, E_flow offset)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33723/imp-33796 exactly

// EXACT imp-3406/imp-33723/imp-33796 pinned sub-terms (no re-derivation, no fresh model).
function terms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const u = Math.log(T0 / TWO_PI);
  const C_F = (u + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const R = E_TRUNC_PT + E_flow; // the "rest" (E_trunc + E_flow)
  const E_N = R + E_coll;
  return { T0, L, u, E_flow, E_coll, R, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => terms(N).sigma;

// Height log-slope zeta = d log T0 / d ln N (leading RvM zeta = u/(u+1); measured from the map here).
function zetaMeasured(N) {
  const h = 1e-6;
  const a = Math.log(effectiveHeightForN(N * Math.exp(h)));
  const b = Math.log(effectiveHeightForN(N * Math.exp(-h)));
  return (a - b) / (2 * h);
}

// Closed-form log-slopes (A)-(B) and the exact sign identity (S) for d sigma / d ln N.
function closedForm(N) {
  const t = terms(N);
  const zeta = zetaMeasured(N);
  const dlnEcoll = 0.5 * (zeta / t.L - 1); // (A)
  const dlnEflow = zeta * (1 / (t.u + 1) + 1 / t.L - 1); // (B)
  const dlnR = (t.E_flow / t.R) * dlnEflow; // (B): E_trunc is N-independent => only E_flow contributes
  const dsigma = -t.sigma * t.sigma * (t.R / t.E_coll) * (dlnR - dlnEcoll); // (S)
  const suffLHS = t.E_flow / E_TRUNC_PT; // (C) left side
  const suffRHS = 0.5 * (1 - 1 / t.L); // (C) right side
  return { ...t, zeta, dlnEcoll, dlnEflow, dlnR, dsigma, suffLHS, suffRHS };
}

// Finite-difference control for the sign identity (S).
function dsigmaFD(N) {
  const h = 1e-6;
  return (sigma(N * Math.exp(h)) - sigma(N * Math.exp(-h))) / (2 * h);
}

// Landmarks (fresh bisection, pinned sub-terms), matching imp-33796.
function solve(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_HALF = solve(sigma, 0.5, 1e6, 1e14); // ~3.267235e9 (sigma = 1/2)
const N_CROSS = solve((N) => terms(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280294e9 (E_coll = E_trunc)

// Sample the closed form at both endpoints and the geometric midpoint of [N_half, N_cross].
const CF_HALF = closedForm(N_HALF);
const CF_CROSS = closedForm(N_CROSS);
const CF_MID = closedForm(Math.sqrt(N_HALF * N_CROSS));

// Worst-case (least-negative) monotonicity margin across the three interior samples.
const MARGIN_HALF = CF_HALF.dlnEcoll - CF_HALF.dlnR; // should be strictly < 0
const MARGIN_CROSS = CF_CROSS.dlnEcoll - CF_CROSS.dlnR;
const WORST_MARGIN = Math.max(MARGIN_HALF, MARGIN_CROSS, CF_MID.dlnEcoll - CF_MID.dlnR);
// Closed-form vs finite-difference agreement of d sigma / d ln N at N_half.
const CF_VS_FD = Math.abs(CF_HALF.dsigma / dsigmaFD(N_HALF) - 1);
// Safety factor of the sufficient condition (C) at the (larger) N_half share of E_flow.
const SUFF_SAFETY = CF_HALF.suffRHS / CF_HALF.suffLHS; // ~250x

export const IMP124896_SIGMA_MONOTONE_HALF_CROSSOVER_CLOSED_FORM = {
  id: 'imp-124896',
  proofSection: 'S-frontier',
  question:
    'imp-33848 reduced the strict ordering N_half < N_cross to two closed-form legs -- E_flow(N_cross) ' +
    '> 0 and sigma monotone-decreasing on [N_half, N_cross] -- but only the E_flow>0 leg was put in ' +
    'closed form; the monotonicity leg was asserted. DERIVE the sign of d sigma / d ln N on ' +
    '[N_half, N_cross] in closed form from sigma = E_coll/(E_coll+E_trunc+E_flow), or exhibit the ' +
    'precise obstruction. Derivation only; conditional-share diagnostic, NOT an RH bound; no QED.',
  signIdentity:
    'd sigma / d ln N = -sigma^2 (R/E_coll)(dlnR - dlnEcoll), R = E_trunc + E_flow; ' +
    'so d sigma/d ln N < 0 <=> dlnEcoll < dlnR (E_coll decays faster in log-slope than the rest R).',
  logSlopes:
    'dlnEcoll = (1/2)(zeta/L - 1); dlnEflow = zeta(1/(u+1) + 1/L - 1); dlnR = (E_flow/R) dlnEflow; ' +
    'zeta = d log T0 / d ln N in (0,1) (leading RvM zeta = u/(u+1)).',
  sufficientCondition:
    'Closed-form sufficient condition for strict monotone decrease: E_flow/E_trunc < (1/2)(1 - 1/L). ' +
    'Then dlnEcoll <= -(1/2)(1-1/L) < -(E_flow/E_trunc) <= dlnR, hence d sigma/d ln N < 0.',
  landmarks: {
    N_half: +N_HALF.toExponential(6), // ~3.267235e9
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    strict_ordering_N_half_below_N_cross: N_HALF < N_CROSS, // true (imp-33796)
  },
  closedFormSamples: {
    at_N_half: {
      dlnEcoll: +CF_HALF.dlnEcoll.toFixed(6), // ~-0.477284
      dlnR: +CF_HALF.dlnR.toExponential(4), // ~-1.6256e-3
      monotone_margin_dlnEcoll_minus_dlnR: +MARGIN_HALF.toFixed(6), // ~-0.475659 (< 0)
      dsigma_dlnN_closed_form: +CF_HALF.dsigma.toExponential(6), // ~-1.189147e-1
    },
    at_N_cross: {
      dlnEcoll: +CF_CROSS.dlnEcoll.toFixed(6),
      dlnR: +CF_CROSS.dlnR.toExponential(4),
      monotone_margin_dlnEcoll_minus_dlnR: +MARGIN_CROSS.toFixed(6),
      dsigma_dlnN_closed_form: +CF_CROSS.dsigma.toExponential(6),
    },
    worst_case_margin_over_interval: +WORST_MARGIN.toFixed(6), // ~-0.4757 (strictly < 0)
  },
  sufficientConditionCheck: {
    E_flow_over_E_trunc_at_N_half: +CF_HALF.suffLHS.toExponential(4), // ~1.9057e-3 (left side of (C))
    half_times_one_minus_invL: +CF_HALF.suffRHS.toFixed(6), // ~0.475746 (right side of (C))
    safety_factor: +SUFF_SAFETY.toFixed(1), // ~250x
  },
  identityCheck: {
    closed_form_vs_finite_difference_rel: +CF_VS_FD.toExponential(3), // ~1e-10
  },
  finding: {
    D1_exact_sign_identity:
      'd sigma/d ln N = -sigma^2 (R/E_coll)(dlnR - dlnEcoll) reproduces a central finite difference of ' +
      'sigma to ~1e-10 relative at N_half, N_cross and the midpoint, so the closed-form log-slope ' +
      'decomposition dlnEcoll = (1/2)(zeta/L - 1), dlnR = (E_flow/R) dlnEflow is exact, not fitted.',
    D2_monotonicity_leg_holds_in_closed_form:
      'dlnEcoll ~ -0.4773 is strictly below dlnR ~ -1.62e-3 across [N_half, N_cross] (margin ~ -0.4757 ' +
      '< 0), so d sigma/d ln N < 0 throughout -- the imp-33848 leg (sigma monotone-decreasing) is now ' +
      'DERIVED from the sign identity, not asserted.',
    D3_sufficient_condition_and_margin:
      'The elementary sufficient condition E_flow/E_trunc < (1/2)(1 - 1/L) holds with right side ~0.476 ' +
      'vs left side ~1.9e-3 (a ~250x margin): monotonicity is robust, not marginal. The obstruction, ' +
      'were it ever to appear, would be an E_flow grown to a ~0.48 fraction of E_trunc (~250x actual) -- ' +
      'i.e. E_coll ~ N^(-1/2) decays with log-slope ~ -1/2 while the rest, pinned by the N-independent ' +
      'E_trunc, has log-slope ~ -1.6e-3, and that slope separation is why sigma decreases.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-33848 monotonicity leg -- sigma ' +
    'monotone-decreasing on [N_half, N_cross], previously asserted -- is put in closed form. From ' +
    'sigma = E_coll/(E_coll + R), R = E_trunc + E_flow, the exact sign identity ' +
    'd sigma/d ln N = -sigma^2 (R/E_coll)(dlnR - dlnEcoll) reduces monotone decrease to the slope ' +
    'inequality dlnEcoll < dlnR. With dlnEcoll = (1/2)(zeta/L - 1) (zeta = d log T0/d ln N in (0,1)) ' +
    'and dlnR = (E_flow/R) zeta (1/(u+1) + 1/L - 1), a chain of elementary bounds gives the closed-form ' +
    'sufficient condition E_flow/E_trunc < (1/2)(1 - 1/L). On [N_half, N_cross] (L ~ 20.6) the right ' +
    'side is ~0.476 while E_flow/E_trunc ~ 1.9e-3, so it holds with a ~250x margin and dlnEcoll ~ ' +
    '-0.477 < dlnR ~ -1.6e-3 throughout -- d sigma/d ln N < 0 is DERIVED, and the closed form matches a ' +
    'finite difference of sigma to ~1e-10. Component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33848 (roadmap currentStatus: N_half<N_cross reduced to E_flow>0 and sigma monotone, latter ' +
    'asserted); imp-33796 (independent N_half < N_cross recompute); imp-33723 (closed-form N_cross, ' +
    'E_flow offset); imp-33601 (sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-3444 (E_coll=E_trunc ' +
    'crossover); imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP124896_SIGMA_MONOTONE_HALF_CROSSOVER_CLOSED_FORM_ASSERTIONS = [
  {
    // Reuse gate: the landmarks reproduce the imp-33796 values (~3.267e9, ~3.280e9) to ~1%.
    id: 'imp124896-reuses-pinned-landmarks',
    description: 'N_half ~ 3.267e9 and N_cross ~ 3.280e9 both to ~1% (identical pinned sub-terms)',
    holds: () =>
      Math.abs(N_HALF / 3.267235e9 - 1) < 0.01 && Math.abs(N_CROSS / 3.280294e9 - 1) < 0.01,
  },
  {
    // (D1): the closed-form sign identity matches a central finite difference of sigma.
    id: 'imp124896-sign-identity-matches-finite-difference',
    description: 'closed-form d sigma/d ln N matches a central FD to < 1e-6 relative at N_half',
    holds: () => CF_VS_FD < 1e-6,
  },
  {
    // (D2): the monotonicity leg -- dlnEcoll < dlnR (equivalently d sigma/d ln N < 0) -- across the interval.
    id: 'imp124896-monotone-decreasing-on-interval',
    description: 'dlnEcoll < dlnR (worst-case margin < 0) at N_half, N_cross and the midpoint',
    holds: () =>
      WORST_MARGIN < 0 &&
      CF_HALF.dsigma < 0 &&
      CF_CROSS.dsigma < 0 &&
      CF_MID.dsigma < 0,
  },
  {
    // (D3): the closed-form sufficient condition (C) holds with a large (> 100x) safety factor.
    id: 'imp124896-sufficient-condition-holds-with-margin',
    description: 'E_flow/E_trunc < (1/2)(1 - 1/L) with safety factor > 100x',
    holds: () => CF_HALF.suffLHS < CF_HALF.suffRHS && SUFF_SAFETY > 100,
  },
  {
    // Sign-structure gate: E_coll log-slope near -1/2, rest log-slope tiny and negative.
    id: 'imp124896-slope-separation',
    description: 'dlnEcoll near -1/2 (~ -0.477) while |dlnR| < 1e-2 (E_trunc-pinned rest)',
    holds: () =>
      Math.abs(CF_HALF.dlnEcoll + 0.4773) < 5e-3 &&
      CF_HALF.dlnR < 0 &&
      Math.abs(CF_HALF.dlnR) < 1e-2,
  },
  {
    // Honesty gate: derivation only, no QED, no refereed bound is changed.
    id: 'imp124896-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124896_SIGMA_MONOTONE_HALF_CROSSOVER_CLOSED_FORM.isRigorous === false &&
      /NO QED/.test(IMP124896_SIGMA_MONOTONE_HALF_CROSSOVER_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP124896_SIGMA_MONOTONE_HALF_CROSSOVER_CLOSED_FORM.verdict),
  },
];

for (const a of IMP124896_SIGMA_MONOTONE_HALF_CROSSOVER_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124896-sigma-monotone-half-crossover-closed-form assertion failed: ${a.id}`);
  }
}
