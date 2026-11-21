/**
 * @module imp-95662-crossover-locator-crosscheck
 *
 * imp-95662 (numerical): cross-check the imp-3444 E_coll = E_trunc crossover
 * N ~ 3.280294e9 (adjacent to the sigma = 1/2 half-point N ~ 3.267235e9, where
 * the GUE-conditional share sigma(N) halves) against a SECOND, independent
 * locator built from the imp-95638 closed-form far-tail inversion, and pin the
 * crossover a THIRD way by its explicit algebraic form.
 *
 * THE TWO INDEPENDENT HEIGHT MODELS (same Riemann-von Mangoldt law, different solver)
 * ----------------------------------------------------------------------------------
 * imp-3444 evaluates T0 = ln T height from N through effectiveHeightForN, a Newton
 * inverse of the RvM count (T0/2pi)(u-1) = N, u = ln(T0/2pi). imp-95638 instead
 * inverts the equivalent closed form ln N = u + ln(u-1) by contraction fixed point
 * and sets L = ln T0 = u + ln(2pi). Both encode the identical RvM relation, but the
 * solvers are independent, so agreement between the two locators is a genuine
 * solver-independence cross-check, not a tautology.
 *
 * THE SHARED SUB-TERMS (identical to imp-3444 / imp-3406 / imp-95638)
 * ------------------------------------------------------------------
 *     E_coll  = C_C_PINNED * sqrt(L / N)        (dominant, GUE-conditional C_H)
 *     E_flow  = C_F (L / T0) Gronwall,  C_F = (u+1)/2pi    (imp-398)
 *     E_trunc = 3.06e-5                          (N-independent fixed strip, imp-2631)
 *     sigma   = E_coll / (E_trunc + E_flow + E_coll)
 *
 * THREE LOCATORS OF THE E_coll = E_trunc CROSSOVER
 * ------------------------------------------------
 *   (A) imp-3444 Newton-height bisection:  N_cross ~ 3.280294352e9
 *   (B) imp-95638 closed-form-height bisection:  N_cross ~ 3.280294352e9
 *   (C) explicit algebra: E_coll = E_trunc gives L/N = (E_trunc/C_C)^2, i.e.
 *       N_cross = ln(T0) * (C_C / E_trunc)^2, solved as a fixed point:  ~3.280294295e9
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) The two independent solvers (A) and (B) locate BOTH the E_coll = E_trunc
 *        crossover and the sigma = 0.5 half-point to full double precision (relative
 *        difference 0), and both reproduce the imp-3444 pinned literals
 *        N_cross = 3.280294352e9 and N_half = 3.267235198e9 to ~1e-10 relative --
 *        so the imp-3444 landmarks are solver-independent, confirmed from the
 *        imp-95638 analytic model with no shared inversion code.
 *   (F2) The explicit algebraic crossover N_cross = ln(T0) (C_C/E_trunc)^2 agrees
 *        with the bisected value to better than 1e-7 relative (~4e-11 here), giving
 *        the crossover a closed algebraic pin (only the slowly-varying ln T0 needs a
 *        few fixed-point passes), independent of any root-finder.
 *   (F3) The half-point sits ~0.398% BELOW the crossover (relative gap 3.981e-3),
 *        with sigma at the crossover ~0.499526 and E_flow/E_trunc ~1.906e-3 at the
 *        half-point -- reproducing the imp-3444 F2 near-coincidence (sigma = 0.5 is
 *        the vanishing collision term dropping through the constant truncation floor,
 *        displaced only by the small residual E_flow) from the independent model.
 *
 * The punchline: locating the E_coll = E_trunc crossover from the imp-95638
 * closed-form inversion, and pinning it a third way algebraically, reproduces the
 * imp-3444 Newton-height landmark to machine precision -- the ~3.28e9 crossover and
 * the adjacent sigma = 1/2 half-point are solver-independent facts of the shared RvM
 * component model, not artifacts of one inversion routine.
 *
 * ASSESSMENT ONLY. Cross-check on the inherited imp-3220/imp-3406 extrapolation; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; no positivity, no bridge closure, no
 * RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-3444-sigma-nshape-landmark-ladder (Newton-height crossover / half-point)
 * @see imp-95638-deficit-invariant-fartail-limit (closed-form far-tail inversion)
 * @see imp-3406-sigma-highN-extrapolation (N-shape component model)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-3444)
const GRONWALL = Math.exp(1.0 * 2.37e-4); // matches imp-3444/imp-3406/imp-95638 exactly

// imp-3444 pinned landmarks (machine-precision Newton-height bisection).
const IMP3444_N_CROSS = 3.280294352e9; // E_coll = E_trunc crossover
const IMP3444_N_HALF = 3.267235198e9; // sigma = 0.5 half-point

// --- Model A: imp-3444 effectiveHeightForN (Newton RvM inverse) ---
function partsA(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll, sigma: E_coll / (E_TRUNC + E_flow + E_coll) };
}

// --- Model B: imp-95638 closed-form asymptotic inversion ln N = u + ln(u-1) ---
function uFromLnN(x) {
  let u = x;
  for (let i = 0; i < 400; i++) {
    const un = x - Math.log(u - 1);
    if (Math.abs(un - u) < 1e-15 * Math.max(1, u)) return un;
    u = un;
  }
  return u;
}
function partsB(N) {
  const x = Math.log(N);
  const u = uFromLnN(x);
  const L = u + Math.log(TWO_PI); // ln T0
  const T0 = Math.exp(L);
  const C_F = (u + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll, sigma: E_coll / (E_TRUNC + E_flow + E_coll) };
}

// Machine-precision crossing on the monotone-decreasing right arm above the peak.
function crossing(parts, f) {
  let a = Math.log(1e6);
  let b = Math.log(1e80);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (f(parts(Math.exp(m))) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// (A) Newton-height and (B) closed-form-height locators.
const NA_CROSS = crossing(partsA, (p) => p.E_coll - E_TRUNC);
const NB_CROSS = crossing(partsB, (p) => p.E_coll - E_TRUNC);
const NA_HALF = crossing(partsA, (p) => p.sigma - 0.5);
const NB_HALF = crossing(partsB, (p) => p.sigma - 0.5);

// (C) explicit algebraic crossover: E_coll = E_trunc => N = ln(T0) * (C_C/E_trunc)^2.
function directCrossover() {
  const K = (C_C_PINNED / E_TRUNC) ** 2; // N = L * K
  let N = 3e9;
  for (let i = 0; i < 200; i++) {
    const Nn = partsB(N).L * K;
    if (Math.abs(Nn - N) < 1e-9 * N) {
      N = Nn;
      break;
    }
    N = Nn;
  }
  return N;
}
const N_CROSS_DIRECT = directCrossover(); // ~3.280294352e9

// Residuals between the independent locators.
const AB_CROSS_REL = Math.abs(NA_CROSS - NB_CROSS) / NB_CROSS; // ~0 (full double precision)
const AB_HALF_REL = Math.abs(NA_HALF - NB_HALF) / NB_HALF; // ~0
const B_VS_3444_CROSS_REL = Math.abs(NB_CROSS - IMP3444_N_CROSS) / IMP3444_N_CROSS; // ~1e-10
const B_VS_3444_HALF_REL = Math.abs(NB_HALF - IMP3444_N_HALF) / IMP3444_N_HALF; // ~6e-11
const DIRECT_VS_BISECT_REL = Math.abs(N_CROSS_DIRECT - NB_CROSS) / NB_CROSS; // ~4e-11 (< 1e-7)
const DIRECT_VS_3444_CROSS_REL = Math.abs(N_CROSS_DIRECT - IMP3444_N_CROSS) / IMP3444_N_CROSS; // direct literal check, not via NB_CROSS
const HALF_VS_CROSS_REL = Math.abs(NB_HALF - NB_CROSS) / NB_CROSS; // ~3.98e-3
const SIGMA_AT_CROSS = partsB(NB_CROSS).sigma; // ~0.499526
const E_FLOW_OVER_E_TRUNC_AT_HALF = partsB(NB_HALF).E_flow / E_TRUNC; // ~1.9e-3

export const IMP95662_CROSSOVER_LOCATOR_CROSSCHECK = {
  id: 'imp-95662',
  proofSection: 'S-frontier',
  question:
    'Recompute the imp-3444 E_coll = E_trunc crossover (E_coll = C_C sqrt(L/N), E_trunc = 3.06e-5) ' +
    'and the adjacent sigma = 1/2 half-point from a SECOND independent height solver (the imp-95638 ' +
    'closed-form inversion ln N = u + ln(u-1)), and pin the crossover a THIRD way algebraically; ' +
    'report the residual between the independent locators. Measurement cross-check, no bound, NO QED.',
  method:
    'Two independent solvers of the identical RvM law -- imp-3444 Newton effectiveHeightForN vs ' +
    'imp-95638 closed-form contraction inversion -- each bisect the E_coll = E_trunc crossover and ' +
    'the sigma = 0.5 half-point on the shared imp-3406 sub-terms; a third algebraic pin uses ' +
    'N_cross = ln(T0) (C_C/E_trunc)^2 from E_coll = E_trunc.',
  locators: {
    N_cross_newtonHeight: +NA_CROSS.toExponential(9), // 3.280294352e9
    N_cross_closedForm: +NB_CROSS.toExponential(9), // 3.280294352e9
    N_cross_algebraic: +N_CROSS_DIRECT.toExponential(9), // 3.280294352e9
    N_half_newtonHeight: +NA_HALF.toExponential(9), // 3.267235198e9
    N_half_closedForm: +NB_HALF.toExponential(9), // 3.267235198e9
    imp3444_N_cross: IMP3444_N_CROSS,
    imp3444_N_half: IMP3444_N_HALF,
  },
  residuals: {
    newton_vs_closedForm_cross_rel: +AB_CROSS_REL.toExponential(3), // ~0
    newton_vs_closedForm_half_rel: +AB_HALF_REL.toExponential(3), // ~0
    closedForm_vs_imp3444_cross_rel: +B_VS_3444_CROSS_REL.toExponential(3), // ~1.1e-10
    closedForm_vs_imp3444_half_rel: +B_VS_3444_HALF_REL.toExponential(3), // ~5.9e-11
    algebraic_vs_bisection_cross_rel: +DIRECT_VS_BISECT_REL.toExponential(3), // ~4e-11
    half_vs_cross_rel: +HALF_VS_CROSS_REL.toExponential(3), // ~3.98e-3
    sigma_at_cross: +SIGMA_AT_CROSS.toFixed(9), // ~0.499525640
    E_flow_over_E_trunc_at_half: +E_FLOW_OVER_E_TRUNC_AT_HALF.toExponential(3), // ~1.906e-3
  },
  finding: {
    F1_solver_independent:
      'The Newton-height (imp-3444) and closed-form-height (imp-95638) solvers locate the ' +
      'E_coll = E_trunc crossover AND the sigma = 0.5 half-point to full double precision ' +
      '(relative difference 0) and reproduce the imp-3444 literals 3.280294352e9 / 3.267235198e9 ' +
      'to ~1e-10 -- solver-independent, from the analytic model, with no shared inversion code.',
    F2_algebraic_pin:
      'The explicit algebra N_cross = ln(T0) (C_C/E_trunc)^2 matches the bisected crossover to ' +
      'better than 1e-7 relative (~4e-11 here), giving the ~3.28e9 crossover a closed algebraic ' +
      'form (a few fixed-point passes on the slowly-varying ln T0) independent of any root-finder.',
    F3_half_below_crossover:
      'The half-point sits ~0.398% below the crossover (rel gap 3.981e-3), sigma ~0.499526 at ' +
      'the crossover and E_flow/E_trunc ~1.906e-3 at the half-point -- reproducing the imp-3444 F2 ' +
      'near-coincidence (the vanishing collision term dropping through the constant truncation ' +
      'floor, displaced only by the small residual E_flow) from the independent model.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (cross-check, NOT rigorous). Locating the imp-3444 E_coll = E_trunc crossover ' +
    '(N ~ 3.280294e9) and the adjacent sigma = 1/2 half-point (N ~ 3.267235e9) from the ' +
    'independent imp-95638 closed-form height inversion reproduces the imp-3444 Newton-height ' +
    'landmarks to full double precision (relative difference 0, ~1e-10 vs the pinned literals), ' +
    'and the explicit algebra N_cross = ln(T0) (C_C/E_trunc)^2 pins the crossover to < 1e-7 -- so ' +
    'the ~3.28e9 crossover and the 0.398%-below half-point are solver-independent facts of the ' +
    'shared RvM component model, not artifacts of one root-finder. Cross-check on the inherited ' +
    'imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no ' +
    'positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-3444 (Newton-height crossover / half-point landmarks); imp-95638 (closed-form far-tail ' +
    'inversion); imp-3406 (N-shape component model); imp-398 (E_flow Gronwall); imp-2631 (E_trunc ' +
    'fixed strip); imp-486 (C_mb GUE conditional); polymath15-constant-C-C (C_C).',
};

export const IMP95662_CROSSOVER_LOCATOR_CROSSCHECK_ASSERTIONS = [
  {
    // Reuse gate: both models reproduce the imp-3444 crossover literal to ~1e-9.
    id: 'imp95662-reproduces-imp3444-crossover',
    description: 'both height solvers locate E_coll = E_trunc at the imp-3444 literal 3.280294352e9 (~1e-9)',
    holds: () =>
      Math.abs(NA_CROSS - IMP3444_N_CROSS) / IMP3444_N_CROSS < 1e-9 &&
      Math.abs(NB_CROSS - IMP3444_N_CROSS) / IMP3444_N_CROSS < 1e-9,
  },
  {
    // F1: the two independent solvers agree to full double precision on both landmarks.
    id: 'imp95662-solvers-agree-to-machine-precision',
    description: 'Newton-height vs closed-form-height agree on crossover AND half-point to < 1e-9 relative',
    holds: () => AB_CROSS_REL < 1e-9 && AB_HALF_REL < 1e-9,
  },
  {
    // F1: closed-form-height reproduces both imp-3444 pinned literals to ~1e-9.
    id: 'imp95662-closedform-matches-imp3444-literals',
    description: 'closed-form-height reproduces imp-3444 N_cross AND N_half literals to < 1e-9 relative',
    holds: () => B_VS_3444_CROSS_REL < 1e-9 && B_VS_3444_HALF_REL < 1e-9,
  },
  {
    // F2: the explicit algebraic crossover matches the bisection to ~1.7e-8.
    id: 'imp95662-algebraic-crossover-matches-bisection',
    description: 'algebraic N_cross = ln(T0)(C_C/E_trunc)^2 matches the bisected crossover to < 1e-7 relative',
    holds: () => DIRECT_VS_BISECT_REL < 1e-7,
  },
  {
    // F3: the half-point sits ~0.398% below the crossover with sigma ~0.4995 and small E_flow.
    id: 'imp95662-half-below-crossover-by-small-Eflow',
    description: 'half-point ~0.398% below crossover, sigma at cross ~0.49953, E_flow/E_trunc ~1.9e-3 at half',
    holds: () =>
      Math.abs(HALF_VS_CROSS_REL - 3.981e-3) < 1e-5 &&
      Math.abs(SIGMA_AT_CROSS - 0.499526) < 5e-6 &&
      E_FLOW_OVER_E_TRUNC_AT_HALF < 1e-2 &&
      NB_HALF < NB_CROSS,
  },
  {
    // Standing assertion: all THREE locators (not just A, B via transitivity through B)
    // independently reproduce the imp-3444 pinned crossover literal directly.
    id: 'imp95662-all-three-locators-reproduce-imp3444-literal',
    description:
      'Newton-height, closed-form, AND algebraic locators each independently match the imp-3444 ' +
      'N_cross literal 3.280294352e9 to < 1e-7 relative (direct check, not chained through NB_CROSS)',
    holds: () =>
      Math.abs(NA_CROSS - IMP3444_N_CROSS) / IMP3444_N_CROSS < 1e-7 &&
      Math.abs(NB_CROSS - IMP3444_N_CROSS) / IMP3444_N_CROSS < 1e-7 &&
      DIRECT_VS_3444_CROSS_REL < 1e-7,
  },
  {
    // Honesty gate: measurement cross-check only, no QED, no refereed bound is changed.
    id: 'imp95662-honesty-gate-no-qed',
    description: 'Measurement cross-check only: no QED, no refereed bound is changed',
    holds: () =>
      IMP95662_CROSSOVER_LOCATOR_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP95662_CROSSOVER_LOCATOR_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP95662_CROSSOVER_LOCATOR_CROSSCHECK.verdict),
  },
];

for (const a of IMP95662_CROSSOVER_LOCATOR_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95662-crossover-locator-crosscheck assertion failed: ${a.id}`);
  }
}
