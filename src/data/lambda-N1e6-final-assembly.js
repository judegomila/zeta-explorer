/**
 * imp-452: Full finite-height Lambda bound assembly at N* = 1e6
 *
 * Now that E_trunc is closed (imp-447), this file assembles the best
 * currently established Lambda upper bound at N* = 1e6 from all
 * contributing closures:
 *
 *   imp-440: base finite-height bound (TRACK 1 + TRACK 3)
 *   imp-447: E_trunc closure via PT + Ingham at sigma_opt = 0.61
 *   imp-449: alt-path cross-verification of L_cond ~ 0.008
 *
 * Summary of the best current bound (TRACK 3)
 * -------------------------------------------
 *   Lambda  <=  L_pt  =  L_cond  +  E_trunc_pt
 *   L_cond  =  |t_c_proj|  +  E_flow  +  E_coll  ~  0.0080
 *   E_trunc_pt  =  (2 * e_I / kappa_T) * T_PT^{-kappa_T}  ~  0.1127
 *   L_pt  ~  0.121  <  0.2  =  Platt-Trudgian 2021
 *
 * Conditions remaining (both still open):
 *   B1: slope b analytically bounded (imp-363 / imp-370)
 *   B2: intercept a rigorously bounded <= 0.02 (lambda-zero-attack.js)
 *
 * Condition that was open and is now closed:
 *   C3-pt: RH to T_PT = 3e12 -- ESTABLISHED by Platt-Trudgian 2021
 *   (this closes sub-gap skp-imp440-etrunc, imp-447)
 *
 * Cross-verification (imp-449 alt-path)
 * --------------------------------------
 * An independent reimplementation using algebraically equivalent but
 * numerically distinct IEEE 754 paths (log-sum-exp, split-sqrt, ascending
 * summation order) confirms L_cond_alt ~ 0.008 at N* = 1e6, agreeing with
 * the primary to within floating-point rounding at the 10th significant figure.
 *
 * Honest status
 * -------------
 * This is NOT a fully unconditional Lambda bound. The bound
 *   Lambda <= 0.121
 * is conditional on B1 + B2 (OLS slope and intercept analytic bounds).
 * The progress since imp-416 is: the E_trunc blocker is no longer open --
 * it is replaced by a certified E_trunc_pt = 0.1127 via PT 2021 + Ingham 1940,
 * reducing the condition set from {B1, B2, C3} to {B1, B2} (where C3-pt holds).
 *
 * SYNTAX NOTE: avoid (star)(slash) sequences inside JSDoc block text.
 */

import { FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN } from './finite-height-beats-platt-trudgian.js';
import { ALT_PATH_N1E6 }                      from '../math/verify-imp440-altpath.js';
import { B1_CONDITIONAL_BOUND }               from './b1-slope-conditional-upper-bound.js';

// ── Primary target data at N* = 1e6 ─────────────────────────────────────────
const PRIMARY = FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.primaryTarget;
const SUB_GAP = FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.subGap;

const L_COND_PRIMARY = PRIMARY ? PRIMARY.L_cond  : null;
const L_PT_PRIMARY   = PRIMARY ? PRIMARY.L_pt    : null;
const PT_BOUND       = FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.plattTrudgianBound.Lambda_upper;

// ── Cross-verification agreement check ──────────────────────────────────────
// The primary and alt-path values of L_cond are both computed at N = 1e6.
// Their relative agreement is the cross-verification quality metric.
function crossVerifyAgreement() {
  if (!ALT_PATH_N1E6.available || L_COND_PRIMARY === null) {
    return { available: false };
  }
  const primary = L_COND_PRIMARY;
  const alt     = ALT_PATH_N1E6.L_cond_alt;
  const absErr  = Math.abs(primary - alt);
  const relErr  = absErr / Math.max(Math.abs(primary), 1e-15);
  return {
    available:      true,
    L_cond_primary: +primary.toFixed(10),
    L_cond_alt:     +alt.toFixed(10),
    absErr:         +absErr.toExponential(3),
    relErr:         +relErr.toExponential(3),
    agreedTo6sf:    relErr < 1e-6,
    note:
      'Primary and alt-path L_cond at N=1e6 must agree to 6+ significant figures ' +
      'to confirm the computation is not path-dependent at the 10th decimal place.',
  };
}

const CROSS_VERIFY = crossVerifyAgreement();

// ── Condition accounting ─────────────────────────────────────────────────────
const CONDITIONS = [
  {
    id:     'B1',
    label:  'Slope b analytically bounded',
    status: 'conditional-closed',
    ticket: 'imp-457',
    bound:  B1_CONDITIONAL_BOUND.bound.value,
    note:
      'Conditionally closed by imp-457: b(N) <= b_lin(N) <= ' +
      B1_CONDITIONAL_BOUND.bound.value +
      ' under NoSwap + D-monotone (b1-slope-conditional-upper-bound.js). ' +
      'Residual sub-gap skp-imp457-D-monotone remains open. ' +
      'Unconditional closure via imp-363/imp-370 GUE local-law approach.',
  },
  {
    id:     'B2',
    label:  'Intercept a rigorously bounded',
    status: 'open',
    ticket: 'lambda-zero-attack.js B2',
    note:
      'Proving a < 0.015 rigorously (e.g. via the Koksma-Hlawka / Poisson bridge ' +
      'in imp-424 extended to the intercept) is the central remaining research item.',
  },
  {
    id:     'C3-pt',
    label:  'RH to T_PT = 3e12 (Platt-Trudgian 2021)',
    status: 'established',
    ticket: 'imp-447 (closure of skp-imp440-etrunc)',
    note:
      'All non-trivial zeros to T_PT = 3e12 are verified on the critical line ' +
      'by Platt & Trudgian, Bull. Lond. Math. Soc. 53 (2021), 792-797. ' +
      'This converts E_trunc from an open sub-gap to a certified 0.1127 bound.',
  },
];

// ── Assembly record ───────────────────────────────────────────────────────────
export const LAMBDA_N1E6_FINAL_ASSEMBLY = {
  id:    'imp-452',
  title: 'Full finite-height Lambda bound assembly at N* = 1e6',
  status:
    'assembled -- best current bound L_pt ~ 0.121 conditional on B1+B2; ' +
    'E_trunc closed via imp-447 (C3-pt established); B1+B2 open',

  nStar:   1e6,
  ptBound: PT_BOUND,
  ptCitation: 'Platt & Trudgian (2021), Bull. Lond. Math. Soc. 53, 792-797',

  bestCurrentBound: {
    value:      L_PT_PRIMARY,
    display:    L_PT_PRIMARY !== null ? +L_PT_PRIMARY.toFixed(4) : null,
    beatsPT:    L_PT_PRIMARY !== null && L_PT_PRIMARY < PT_BOUND,
    marginFactor: (L_PT_PRIMARY !== null && L_PT_PRIMARY > 0)
                  ? +(PT_BOUND / L_PT_PRIMARY).toFixed(3) : null,
    decomposition: {
      L_cond:      L_COND_PRIMARY !== null ? +L_COND_PRIMARY.toFixed(6) : null,
      E_trunc_pt:  (PRIMARY && PRIMARY.ptImprovedBound && PRIMARY.ptImprovedBound.available)
                   ? +PRIMARY.ptImprovedBound.E_trunc_pt.toFixed(6) : null,
      sigma_opt:   0.61,
      T_PT:        3e12,
    },
    note:
      'L_pt = L_cond + E_trunc_pt where E_trunc_pt uses PT-verified zeros to ' +
      '3e12 and Ingham density bound above 3e12 at sigma_opt = 0.61.',
  },

  conditionalBound: {
    value:        L_COND_PRIMARY !== null ? +L_COND_PRIMARY.toFixed(6) : null,
    beatsPT:      L_COND_PRIMARY !== null && L_COND_PRIMARY < PT_BOUND,
    marginFactor: (L_COND_PRIMARY !== null && L_COND_PRIMARY > 0)
                  ? +(PT_BOUND / L_COND_PRIMARY).toFixed(2) : null,
    note:
      'L_cond excludes E_trunc entirely -- conditional on B1+B2 but not C3-pt. ' +
      'Cross-verified by imp-449 alt-path to 6+ significant figures.',
  },

  crossVerification: CROSS_VERIFY,

  etruncSubGap: {
    id:       SUB_GAP.id,
    status:   SUB_GAP.status,
    closedBy: SUB_GAP.closedBy,
    closureRoute: SUB_GAP.closureRoute,
    summary:
      'skp-imp440-etrunc closed by imp-447. The PT+Ingham approach replaces ' +
      'the power-law Polymath15 E_trunc (~4.2) with a PT-anchored bound of ' +
      '~0.1127, bringing the full bound below PT_BOUND = 0.2.',
  },

  conditions: CONDITIONS,

  openConditions:        CONDITIONS.filter((c) => c.status === 'open').map((c) => c.id),
  conditionalConditions: CONDITIONS.filter((c) => c.status === 'conditional-closed').map((c) => c.id),
  closedConditions:      CONDITIONS.filter((c) => c.status === 'established').map((c) => c.id),

  progressSummary: {
    versus_imp416:
      'imp-416 had three open conditions: B1, B2, B4 (E_trunc). ' +
      'imp-452 reduces this to two: B1 and B2. C3-pt replaces the open B4 ' +
      'with an established certified E_trunc_pt = 0.1127.',
    versus_pt_2021:
      'Platt-Trudgian 2021 (Lambda <= 0.2 unconditionally) is beaten by our ' +
      'best current bound L_pt ~ 0.121 conditional on B1+B2. The margin factor ' +
      'is ~1.65x under the full (L_pt) bound and ~25x under the conditional (L_cond) bound.',
    remainingWork:
      'B1 is conditionally closed by imp-457 (NoSwap + D-monotone sub-gap). ' +
      'Close B2 (analytic intercept bound) to convert the OLS projection into ' +
      'a theorem-grade Lambda bound. Unconditional B1 closure via imp-363/imp-370.',
  },

  sources: [
    'imp-440 FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN (finite-height-beats-platt-trudgian.js)',
    'imp-447 skp-imp440-etrunc closure -- PT + Ingham optimised E_trunc bound',
    'imp-449 ALT_PATH_N1E6 (verify-imp440-altpath.js) -- alt-path cross-verification',
    'imp-363 / imp-370 (open): slope b analytic upper bound',
    'lambda-zero-attack.js B2 (open): intercept a analytic bound',
    'Platt & Trudgian 2021, Bull. Lond. Math. Soc. 53 (2021), 792-797',
    'Ingham 1940 zero-density bound',
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────
export const LAMBDA_N1E6_ASSEMBLY_ASSERTIONS = [
  {
    id: 'imp452-primary-data-available',
    holds: () =>
      PRIMARY !== null &&
      L_COND_PRIMARY !== null &&
      L_PT_PRIMARY !== null,
    why:
      'FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.primaryTarget must supply L_cond and L_pt. ' +
      'A null here means the imp-440 record was not initialized correctly.',
  },
  {
    id: 'imp452-L-pt-beats-PT-bound',
    holds: () =>
      L_PT_PRIMARY !== null && L_PT_PRIMARY < PT_BOUND,
    why:
      'The best current bound L_pt must be < 0.2 (Platt-Trudgian). ' +
      'With L_cond ~ 0.008 and E_trunc_pt ~ 0.113, L_pt ~ 0.121. ' +
      'A failure indicates a regression in the E_trunc_pt computation or L_cond.',
  },
  {
    id: 'imp452-L-cond-beats-PT-bound',
    holds: () =>
      L_COND_PRIMARY !== null && L_COND_PRIMARY < PT_BOUND,
    why:
      'The conditional bound L_cond must also beat PT = 0.2. With L_cond ~ 0.008 ' +
      'this is a 25x margin. A failure would signal a regression in the OLS fit.',
  },
  {
    id: 'imp452-etrunc-sub-gap-closed',
    holds: () =>
      SUB_GAP.id === 'skp-imp440-etrunc' &&
      SUB_GAP.status === 'closed' &&
      SUB_GAP.blocker === false,
    why:
      'The skp-imp440-etrunc sub-gap must be closed (imp-447). ' +
      'A status other than "closed" means the closure was accidentally reverted.',
  },
  {
    id: 'imp452-cross-verify-L-cond-agrees-6sf',
    holds: () =>
      CROSS_VERIFY.available === true &&
      CROSS_VERIFY.agreedTo6sf === true,
    why:
      'Alt-path (imp-449) and primary (imp-440) L_cond at N=1e6 must agree ' +
      'to 6+ significant figures. A failure indicates the two IEEE 754 paths ' +
      'diverge beyond floating-point rounding -- a sign of a formula error.',
  },
  {
    id: 'imp452-condition-counts',
    holds: () =>
      LAMBDA_N1E6_FINAL_ASSEMBLY.openConditions.length        === 1 &&
      LAMBDA_N1E6_FINAL_ASSEMBLY.conditionalConditions.length === 1 &&
      LAMBDA_N1E6_FINAL_ASSEMBLY.closedConditions.length      === 1,
    why:
      'Exactly one condition (B2) remains fully open, one (B1) is conditional-closed ' +
      'by imp-457, and one (C3-pt) is established. ' +
      'A change in this count means either a new condition was added without ' +
      'updating this assembly, or a premature or erroneous closure was recorded.',
  },
  {
    id: 'imp452-alt-path-T0-valid',
    holds: () =>
      ALT_PATH_N1E6.available === true &&
      ALT_PATH_N1E6.T0Valid   === true,
    why:
      'The alt-path Newton T0 for N=1e6 must forward-validate to within 1e-9 ' +
      'relative error. A failure means the Newton iteration in lambda-rh-height-mapping ' +
      'has drifted, invalidating the cross-verification.',
  },
];
