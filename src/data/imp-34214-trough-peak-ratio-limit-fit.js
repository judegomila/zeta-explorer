/**
 * @module imp-34214-trough-peak-ratio-limit-fit
 *
 * imp-34214 (numerical, frontier-direction): imp-34085 extended the imp-33810 ladder two further
 * quarter-decade steps and tabulated the imp-33843 log-linear-OLS amplitude ratio |trough|/|peak|
 * across five widening windows -- 0.6151 -> 0.6293 -> 0.6492 -> 0.6868 -> 0.7200 across
 * kEnd = 11, 11.5, 12, 12.5, 13 (window width w = kEnd - 6 = 5.0, 5.5, 6.0, 6.5, 7.0) -- and reported
 * by INSPECTION that the per-window increment GROWS (+0.0142, +0.0199, +0.0376, +0.0332) rather than
 * shrinking, so no saturating limit is visible. imp-34085 never FIT the ratio to a convergence form.
 * Following the imp-34129 slope-drift convergence-fit method (grid-search the nonlinear rate/exponent,
 * OLS the linear coefficients at each), this module fits the imp-34085 ratio sequence versus window
 * width w under BOTH a constant-plus-exponential approach ratio = r_inf + c exp(-lam w) and a
 * constant-plus-power-law approach ratio = r_inf + c w^(-p), reports the two fitted limits r_inf with
 * their goodness-of-fit, and asks whether the ratio converges to a fixed value or merely creeps.
 *
 * THE MEASUREMENT (imp-34085 ratio sequence imported verbatim; reuse gate below)
 * -----------------------------------------------------------------------------
 *   Input      The imp-34085 ratioSequence |trough|/|peak| per widening window, reused EXACTLY (a
 *              reuse gate checks the imported ratios reproduce the imp-34085 published 0.6151..0.7200
 *              and that the window widths are w = kEnd - 6 = 5.0..7.0), so this is a pure downstream
 *              fit of the inherited measurement, not a fresh ladder re-run.
 *   Exp form   ratio = r_inf + c exp(-lam w): grid-search lam in [0.01, 2.0] step 1e-3, OLS (r_inf, c)
 *              at each lam, keep the min-SSR lam. r_inf is the extrapolated w -> inf limit.
 *   Power form ratio = r_inf + c w^(-p): grid-search p in [0.1, 4.0] step 5e-3, OLS (r_inf, c) at each
 *              p, keep the min-SSR p. r_inf is the extrapolated w -> inf limit.
 *   Diagnosis  A GENUINE saturating approach seats its rate/exponent at an INTERIOR grid optimum and
 *              extrapolates to a limit inside the physical ceiling (the amplitude ratio |trough|/|peak|
 *              lives in (0, 1)). A boundary-pinned optimum with a limit far above 1 signals the data
 *              has no saturating limit -- the fit degenerates toward near-linear growth by pushing the
 *              rate to zero. A floor-probe (drop the lam grid floor 0.01 -> 0.001) then shows the SSR
 *              keeps improving while r_inf balloons, i.e. no stable extrapolated limit exists.
 *
 * THE FINDING (fit only -- convergence REFUTED: both saturating forms fail, limits are non-physical)
 * -------------------------------------------------------------------------------------------------
 *   (R1) BOTH SATURATING FORMS PIN TO THE LOWER GRID BOUNDARY. The exponential fit seats at the
 *        smallest allowed rate lam = 0.01 and the power fit at the smallest exponent p = 0.1 -- neither
 *        finds an interior optimum. Both push their rate/exponent toward zero, where the saturating
 *        curve flattens into near-linear growth: that is exactly what a NON-converging, still-creeping
 *        sequence forces a saturating model to do.
 *   (R2) THE EXTRAPOLATED LIMITS ARE NON-PHYSICAL (FAR ABOVE THE |trough|/|peak| <= 1 CEILING). The
 *        exponential limit r_inf ~ 6.00 and the power-law limit r_inf ~ 3.80 both exceed 1 by a wide
 *        margin -- impossible for an amplitude RATIO, which cannot have the interior trough exceed the
 *        endpoint peak by 6x. The fits report a "limit" only as an artifact of the boundary-pinned rate;
 *        it is not a value the ratio approaches. In-sample R^2 (~0.965 exp, ~0.945 power) looks
 *        respectable ONLY because 5 points against 3 free parameters cannot expose the mis-specification.
 *   (R3) A FLOOR-PROBE CONFIRMS NO STABLE LIMIT: DROPPING THE lam GRID FLOOR INFLATES r_inf WITHOUT
 *        BOUND. Re-fitting the exponential form with the grid floor lowered 0.01 -> 0.001 LOWERS the SSR
 *        further (the optimum still runs to the new floor) while r_inf jumps ~6.0 -> ~54.1. The limit is
 *        a moving target set by the grid floor, not a convergent extrapolation -- the direct signature
 *        of a sequence with no saturating limit, corroborating the imp-34085 growing-increment reading.
 *
 * The punchline: fitting the imp-34085 |trough|/|peak| ratio versus window width to the two saturating
 * approach forms of the imp-34129 method REFUTES convergence. Both forms pin their rate/exponent to the
 * lower grid boundary and extrapolate to non-physical limits (r_inf ~ 6.0 exponential, ~3.8 power, both
 * >> the amplitude-ratio ceiling of 1), and a floor-probe shows the "limit" inflates without bound as
 * the grid floor drops -- so the imp-34085 ratio does NOT converge to a fixed value; it creeps, exactly
 * as imp-34085 read from its growing per-window increments. This is the OPPOSITE outcome to the sibling
 * imp-34129 widening-SLOPE drift, which did seat an interior exponential optimum at a finite limit ~-1.0.
 *
 * MEASUREMENT / CONVERGENCE-FIT ONLY. A diagnostic curve-fit of an inherited descriptive ratio, NOT an
 * RH bound and distinct from any log-linear-vs-power-law FORM selection (the imp-33843 log-linear verdict
 * is untouched). The imp-34085 ratio and the two convergence surrogates are descriptive, not derived; the
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34085-trough-peak-ratio-convergence (the |trough|/|peak| ratio sequence fit here)
 * @see imp-34129-widening-slope-drift-convergence-fit (the exp-vs-power convergence-fit method reused; the
 *      sibling widening-SLOPE drift that DID converge, contrasted here)
 * @see imp-34022-argmin-argmax-migration-symmetry (the original near-constant amplitude-ratio reading)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose peak/trough amplitudes form the ratio)
 * @see imp-486 (C_mb GUE-conditional, untouched)
 */

import { IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE } from './imp-34085-trough-peak-ratio-convergence.js';

// ---- 0. Import the imp-34085 ratio sequence verbatim (reuse gate below) ----
const SRC = IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.ratioSequence; // [{window,kEnd,peak,trough,ratio}]
const KENDS = SRC.map((r) => r.kEnd); // 11, 11.5, 12, 12.5, 13
const WIDTHS = SRC.map((r) => r.kEnd - 6); // window width w = 5.0, 5.5, 6.0, 6.5, 7.0
const RATIOS = SRC.map((r) => r.ratio); // 0.6151, 0.6293, 0.6492, 0.6868, 0.7200
const IMP34085_STEPS = IMP34085_TROUGH_PEAK_RATIO_CONVERGENCE.ratioStepIncrements; // +0.0142..+0.0332 (GROWING)

// ---- OLS of ys against a single regressor xs (returns intercept a, slope b) ----
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}
function fitStats(ys, pred) {
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < ys.length; i++) {
    ssTot += (ys[i] - my) ** 2;
    ssRes += (ys[i] - pred[i]) ** 2;
  }
  return { ssRes, r2: 1 - ssRes / ssTot };
}

// Exponential approach ratio = r_inf + c exp(-lam w): grid-search lam, OLS (r_inf, c) at each lam.
function fitExpApproach(w, y, lamLo, lamHi, step) {
  let best = null;
  for (let lam = lamLo; lam <= lamHi + 1e-12; lam += step) {
    const xs = w.map((x) => Math.exp(-lam * x));
    const { a: rInf, b: c } = ols(xs, y);
    const pred = w.map((x) => rInf + c * Math.exp(-lam * x));
    const { ssRes, r2 } = fitStats(y, pred);
    if (!best || ssRes < best.ssResRaw) {
      best = { lam: +lam.toFixed(4), rInfRaw: rInf, cRaw: c, ssResRaw: ssRes, r2Raw: r2 };
    }
  }
  return {
    lam: best.lam,
    rInf: +best.rInfRaw.toFixed(6),
    c: +best.cRaw.toFixed(6),
    ssr: +best.ssResRaw.toExponential(4),
    r2: +best.r2Raw.toFixed(6),
    rInfRaw: best.rInfRaw,
    ssResRaw: best.ssResRaw,
  };
}
// Power approach ratio = r_inf + c w^(-p): grid-search p, OLS (r_inf, c) at each p.
function fitPowApproach(w, y, pLo, pHi, step) {
  let best = null;
  for (let p = pLo; p <= pHi + 1e-12; p += step) {
    const xs = w.map((x) => Math.pow(x, -p));
    const { a: rInf, b: c } = ols(xs, y);
    const pred = w.map((x) => rInf + c * Math.pow(x, -p));
    const { ssRes, r2 } = fitStats(y, pred);
    if (!best || ssRes < best.ssResRaw) {
      best = { p: +p.toFixed(4), rInfRaw: rInf, cRaw: c, ssResRaw: ssRes, r2Raw: r2 };
    }
  }
  return {
    p: best.p,
    rInf: +best.rInfRaw.toFixed(6),
    c: +best.cRaw.toFixed(6),
    ssr: +best.ssResRaw.toExponential(4),
    r2: +best.r2Raw.toFixed(6),
    rInfRaw: best.rInfRaw,
    ssResRaw: best.ssResRaw,
  };
}

const LAM_LO = 0.01;
const P_LO = 0.1;
const EXP_FIT = fitExpApproach(WIDTHS, RATIOS, LAM_LO, 2.0, 0.001);
const POW_FIT = fitPowApproach(WIDTHS, RATIOS, P_LO, 4.0, 0.005);

// (R1) Boundary diagnosis: a genuine saturating optimum is INTERIOR; a pinned one signals no saturation.
const EXP_PINS_TO_FLOOR = Math.abs(EXP_FIT.lam - LAM_LO) < 1e-9;
const POW_PINS_TO_FLOOR = Math.abs(POW_FIT.p - P_LO) < 1e-9;

// (R2) Physical ceiling: |trough|/|peak| is an amplitude ratio, so a real limit must sit in (0, 1).
const AMPLITUDE_RATIO_CEILING = 1.0;
const EXP_LIMIT_NON_PHYSICAL = EXP_FIT.rInf > AMPLITUDE_RATIO_CEILING;
const POW_LIMIT_NON_PHYSICAL = POW_FIT.rInf > AMPLITUDE_RATIO_CEILING;

// (R3) Floor-probe: dropping the lam grid floor 0.01 -> 0.001 lowers SSR while r_inf balloons => no
// stable extrapolated limit (the "limit" is a moving target set by the grid floor).
const EXP_FIT_LOWER_FLOOR = fitExpApproach(WIDTHS, RATIOS, 0.001, 2.0, 0.001);
const FLOOR_PROBE_SSR_STILL_DROPS = EXP_FIT_LOWER_FLOOR.ssResRaw < EXP_FIT.ssResRaw;
const FLOOR_PROBE_LIMIT_INFLATES = EXP_FIT_LOWER_FLOOR.rInfRaw > 2 * EXP_FIT.rInfRaw;

// imp-34085 growing per-window increment is the structural reason a saturating form fails.
const IMP34085_INCREMENTS_GROW =
  IMP34085_STEPS[IMP34085_STEPS.length - 1] > IMP34085_STEPS[0];

const ratioConverges = false;

export const IMP34214_TROUGH_PEAK_RATIO_LIMIT_FIT = {
  id: 'imp-34214',
  proofSection: 'S-frontier',
  question:
    'imp-34085 tabulated the imp-33843 log-linear-OLS amplitude ratio |trough|/|peak| across five ' +
    'widening windows (0.6151 -> 0.6293 -> 0.6492 -> 0.6868 -> 0.7200 across kEnd = 11..13, window ' +
    'width w = kEnd - 6 = 5.0..7.0) and read by inspection that the per-window increment GROWS, but ' +
    'never FIT the ratio to a convergence form. Following the imp-34129 method, fit the ratio vs w to ' +
    'ratio = r_inf + c exp(-lam w) and ratio = r_inf + c w^(-p), report the two fitted limits with ' +
    'goodness-of-fit, and decide whether the ratio converges to a fixed value or merely creeps. ' +
    'Fit only; NOT an RH bound; no QED.',
  measuredQuantity:
    'The imp-34085 |trough|/|peak| ratio sequence fit versus window width w = kEnd - 6 to a ' +
    'constant-plus-exponential approach r_inf + c exp(-lam w) and a constant-plus-power-law approach ' +
    'r_inf + c w^(-p) (grid-search the rate/exponent, OLS the linear coefficients), the two ' +
    'extrapolated limits r_inf with SSR/R^2, and a grid-floor probe testing limit stability',
  reuseGate: {
    ratiosReproduceImp34085: RATIOS, // [0.6151, 0.6293, 0.6492, 0.6868, 0.7200]
    widths: WIDTHS, // [5.0, 5.5, 6.0, 6.5, 7.0]
    kEnds: KENDS, // [11, 11.5, 12, 12.5, 13]
  },
  expApproach: {
    form: 'ratio = r_inf + c exp(-lam w)',
    lam: EXP_FIT.lam, // 0.01 -- pinned to the lower grid boundary
    rInf: EXP_FIT.rInf, // ~6.003 -- NON-PHYSICAL (>> 1)
    c: EXP_FIT.c,
    ssr: EXP_FIT.ssr, // ~2.559e-4
    r2: EXP_FIT.r2, // ~0.9654 -- respectable-looking but mis-specified (5 pts, 3 params)
    pinsToGridFloor: EXP_PINS_TO_FLOOR, // true
    limitNonPhysical: EXP_LIMIT_NON_PHYSICAL, // true
  },
  powApproach: {
    form: 'ratio = r_inf + c w^(-p)',
    p: POW_FIT.p, // 0.1 -- pinned to the lower grid boundary
    rInf: POW_FIT.rInf, // ~3.800 -- NON-PHYSICAL (>> 1)
    c: POW_FIT.c,
    ssr: POW_FIT.ssr, // ~4.079e-4
    r2: POW_FIT.r2, // ~0.9448
    pinsToGridFloor: POW_PINS_TO_FLOOR, // true
    limitNonPhysical: POW_LIMIT_NON_PHYSICAL, // true
  },
  floorProbe: {
    lamFloorDropped: '0.01 -> 0.001',
    ssrStillDrops: FLOOR_PROBE_SSR_STILL_DROPS, // true -- optimum runs to the new floor
    rInfAtLowerFloor: +EXP_FIT_LOWER_FLOOR.rInf, // ~54.1 -- balloons vs ~6.0
    limitInflates: FLOOR_PROBE_LIMIT_INFLATES, // true -- no stable extrapolated limit
  },
  imp34085IncrementsGrow: IMP34085_INCREMENTS_GROW, // true -- structural reason the saturating fit fails
  ratioConverges, // false -- convergence REFUTED
  finding: {
    R1_both_forms_pin_to_lower_grid_boundary:
      'The exponential fit seats at the smallest allowed rate lam = 0.01 and the power fit at the ' +
      'smallest exponent p = 0.1 -- neither finds an interior optimum. Both push the rate/exponent ' +
      'toward zero, where the saturating curve flattens into near-linear growth: exactly what a ' +
      'still-creeping, non-converging sequence forces a saturating model to do.',
    R2_extrapolated_limits_non_physical:
      'The exponential limit r_inf ~ 6.00 and the power-law limit r_inf ~ 3.80 both exceed the ' +
      'amplitude-ratio ceiling of 1 by a wide margin -- impossible for |trough|/|peak|, which cannot ' +
      'have the interior trough exceed the endpoint peak by ~6x. The reported "limit" is an artifact ' +
      'of the boundary-pinned rate, not a value the ratio approaches; the in-sample R^2 (~0.965 exp, ' +
      '~0.945 power) looks respectable only because 5 points against 3 free parameters cannot expose ' +
      'the mis-specification.',
    R3_floor_probe_confirms_no_stable_limit:
      'Re-fitting the exponential form with the grid floor lowered 0.01 -> 0.001 LOWERS the SSR further ' +
      '(the optimum still runs to the new floor) while r_inf jumps ~6.0 -> ~54.1. The limit is a moving ' +
      'target set by the grid floor, not a convergent extrapolation -- the direct signature of a ' +
      'sequence with no saturating limit, corroborating the imp-34085 growing-increment reading ' +
      '(+0.0142 -> +0.0332).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CONVERGENCE-FIT (frontier-direction, NOT rigorous). Fitting the imp-34085 ' +
    '|trough|/|peak| ratio sequence (0.6151 -> 0.7200 across window width w = 5.0..7.0, reuse gate: the ' +
    'imported ratios reproduce imp-34085 exactly) versus w to the two saturating approach forms of the ' +
    'imp-34129 method REFUTES convergence. Both forms pin their rate/exponent to the lower grid boundary ' +
    '(lam = 0.01, p = 0.1) -- no interior optimum -- and extrapolate to NON-PHYSICAL limits r_inf ~ 6.0 ' +
    '(exponential) and ~3.8 (power-law), both far above the amplitude-ratio ceiling of 1 that ' +
    '|trough|/|peak| cannot exceed. A floor-probe (grid floor 0.01 -> 0.001) then LOWERS the SSR while ' +
    'r_inf balloons ~6.0 -> ~54.1, showing the "limit" is a moving target set by the grid floor, not a ' +
    'convergent extrapolation. So the imp-34085 ratio does NOT converge to a fixed value; it creeps, ' +
    'exactly as imp-34085 read from its growing per-window increments (+0.0142 -> +0.0332). This is the ' +
    'OPPOSITE outcome to the sibling imp-34129 widening-SLOPE drift, which seated an interior ' +
    'exponential optimum at a finite limit ~-1.0. Distinct from any FORM selection; the imp-33843 ' +
    'log-linear verdict is untouched. The imp-34085 ratio and the two convergence surrogates are ' +
    'descriptive, not derived; the component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34085 (the |trough|/|peak| ratio sequence fit here); imp-34129 (the exp-vs-power ' +
    'convergence-fit method reused, and the sibling widening-slope drift that DID converge); imp-34022 ' +
    '(the original near-constant amplitude-ratio reading); imp-33843 (the log-linear OLS whose ' +
    'peak/trough amplitudes form the ratio); imp-486 (C_mb GUE-conditional, untouched).',
};

export const IMP34214_TROUGH_PEAK_RATIO_LIMIT_FIT_ASSERTIONS = [
  {
    // Reuse gate: the imported ratio sequence reproduces the imp-34085 published 0.6151..0.7200 and the
    // window widths are w = kEnd - 6 = 5.0..7.0 across the five windows -- a pure downstream fit.
    id: 'imp34214-reuse-gate-reproduces-imp34085-ratio-sequence',
    description: 'imported ratios 0.6151..0.7200 over 5 windows; widths w = kEnd-6 = 5.0..7.0',
    holds: () =>
      RATIOS.length === 5 &&
      Math.abs(RATIOS[0] - 0.6151) < 1e-9 &&
      Math.abs(RATIOS[2] - 0.6492) < 1e-9 &&
      Math.abs(RATIOS[4] - 0.72) < 1e-9 &&
      WIDTHS.join(',') === '5,5.5,6,6.5,7' &&
      KENDS.join(',') === '11,11.5,12,12.5,13',
  },
  {
    // (R1) Both saturating forms pin to the LOWER grid boundary (no interior optimum) -- the signature
    // of a non-saturating sequence forcing a saturating model toward near-linear growth.
    id: 'imp34214-both-forms-pin-to-lower-grid-boundary',
    description: 'exp fit lam = 0.01 (floor); power fit p = 0.1 (floor); neither interior',
    holds: () =>
      EXP_PINS_TO_FLOOR === true &&
      POW_PINS_TO_FLOOR === true &&
      EXP_FIT.lam === 0.01 &&
      POW_FIT.p === 0.1,
  },
  {
    // (R2) The two extrapolated limits are NON-PHYSICAL: both exceed the amplitude-ratio ceiling of 1
    // (exp r_inf ~ 6.0, power r_inf ~ 3.8), so neither is a value |trough|/|peak| can approach.
    id: 'imp34214-extrapolated-limits-non-physical-above-one',
    description: 'exp r_inf ~6.0 and power r_inf ~3.8 both exceed the |trough|/|peak| ceiling of 1',
    holds: () =>
      EXP_LIMIT_NON_PHYSICAL === true &&
      POW_LIMIT_NON_PHYSICAL === true &&
      EXP_FIT.rInf > 4 &&
      EXP_FIT.rInf < 9 &&
      POW_FIT.rInf > 2 &&
      POW_FIT.rInf < 5,
  },
  {
    // (R3) Floor-probe: dropping the lam grid floor 0.01 -> 0.001 lowers the SSR further while r_inf
    // balloons (~6.0 -> ~54.1), so the "limit" is a moving target -- no stable extrapolated limit.
    id: 'imp34214-floor-probe-confirms-no-stable-limit',
    description: 'lam floor 0.01->0.001 lowers SSR and inflates r_inf ~6.0 -> ~54 (limit not stable)',
    holds: () =>
      FLOOR_PROBE_SSR_STILL_DROPS === true &&
      FLOOR_PROBE_LIMIT_INFLATES === true &&
      EXP_FIT_LOWER_FLOOR.rInfRaw > 20,
  },
  {
    // Structural cause: the imp-34085 per-window increment GROWS (+0.0142 -> +0.0332), which is why a
    // decelerating saturating form cannot fit and convergence is refuted.
    id: 'imp34214-imp34085-increments-grow-structural-cause',
    description: 'imp-34085 per-window increment grows (last > first); convergence refuted',
    holds: () =>
      IMP34085_INCREMENTS_GROW === true &&
      ratioConverges === false,
  },
  {
    // Honesty gate: fit only, convergence refuted, isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34214-honesty-gate-no-qed',
    description: 'Fit only: ratioConverges false, isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34214_TROUGH_PEAK_RATIO_LIMIT_FIT.ratioConverges === false &&
      IMP34214_TROUGH_PEAK_RATIO_LIMIT_FIT.isRigorous === false &&
      /NO QED/.test(IMP34214_TROUGH_PEAK_RATIO_LIMIT_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP34214_TROUGH_PEAK_RATIO_LIMIT_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34214_TROUGH_PEAK_RATIO_LIMIT_FIT.verdict),
  },
];

for (const a of IMP34214_TROUGH_PEAK_RATIO_LIMIT_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34214-trough-peak-ratio-limit-fit assertion failed: ${a.id}`);
  }
}
