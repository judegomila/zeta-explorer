/**
 * @module imp-33862-knee-separation-second-path-crossval
 *
 * imp-33862 (numerical/cross-validation, frontier-direction): imp-33771 measured the ~1.5% offset
 * between the imp-33744 closed-form sigma-ramp inflection (inverted to N*_cf ~ 3.33e9) and the
 * imp-33721 DIRECT sub-decade exponent-ramp D2-zero knee (N*_D2 ~ 3.38e9), and imp-33817 confirmed
 * that residual sits ~9-26x above the D2 grid-resolution floor. BUT both the imp-33771 residual and
 * the imp-33817 floor locate the exponent-ramp knee the SAME way -- the imp-33721 quarter-decade OLS
 * sub-bracket finite-difference D2 zero-crossing locator. If that single grid locator systematically
 * mis-placed the knee, the ~1.5% separation and its "clears the floor" verdict would BOTH be
 * shared-locator artifacts. This module rules that out by locating the exponent-ramp knee a SECOND,
 * fully grid-free way -- a continuous fine-difference d2 p/dt2 = 0 root-find (no OLS sub-brackets, no
 * decade grid) -- and re-measuring the two-notion separation against it. If the ~1.5% offset
 * reproduces with the independent knee locator, it is code-path-independent, not a grid artifact.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33721 / imp-33744 / imp-33771 -- no
 * fresh terms)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(L / N),   L = log T0(N)   (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (L / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 *
 * THE TWO INDEPENDENT KNEE LOCATORS (exponent-ramp D2 zero, d2 p/dt2 = 0, p = -d ln sigma/dt)
 * -------------------------------------------------------------------------------------------
 *   PATH A (imp-33721 GRID, reproduced verbatim): quarter-decade OLS local-exponent sub-brackets
 *     across [1e9, 1e11], first/second differences D1/D2 on the sub-bracket centers, single
 *     log10-interpolated D2 sign-change -> log10 N*_grid.
 *   PATH B (CONTINUOUS, grid-free, independent): symmetric fine-difference d2 p/dt2 evaluated
 *     pointwise (h in t = ln N), bisection root-find over t in [ln 1e6, ln 1e14] -> log10 N*_cont.
 *     No decade grid, no OLS sub-brackets, no sub-bracket-width sweep -- a structurally different
 *     estimator of the SAME landmark.
 *   The closed-form SIGMOID inflection sigma_cf = 1/2 - g_prime/(2 g^2) (imp-33744) inverted through
 *   the monotone sigma(N) gives N*_cf, the fixed second endpoint of the two-notion separation.
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (M1) THE EXPONENT-RAMP KNEE IS LOCATOR-INDEPENDENT. The grid locator puts the knee at
 *        log10 N*_grid ~ 9.5285; the grid-free continuous root-find puts it at log10 N*_cont ~ 9.5291.
 *        They agree to |log10 gap| ~ 5.1e-4 (~0.12% in N) -- well inside the imp-33817 ~7e-4
 *        grid-resolution floor. The grid locator is NOT systematically mis-placing the knee.
 *   (M2) THE ~1.5% TWO-NOTION SEPARATION REPRODUCES FROM THE INDEPENDENT PATH. Measuring the
 *        closed-form-vs-knee offset with the CONTINUOUS knee gives |log10 gap| ~ 0.0071 (~1.65% in N),
 *        essentially the imp-33771 grid-path residual |log10 gap| ~ 0.0066 (~1.53% in N). Both clear
 *        the imp-33817 floor by ~an order of magnitude, so the separation is CODE-PATH-INDEPENDENT --
 *        it is a genuine sigmoid-inflection-vs-exponent-ramp-D2 two-notion gap, not a discretization
 *        artifact of the imp-33721 grid D2 locator.
 *   (M3) HONEST SCOPE OF THE SEPARATION (named sub-gap). The imp-33744 closed form is the sigmoid
 *        inflection of the E_flow-NEGLIGIBLE logistic balance. It matches the DIRECT continuous
 *        no-flow d2 sigma/dt2 = 0 inflection (log10 ~ 9.5236) to ~0.4% -- confirming the closed form
 *        is that E_flow-off landmark -- but the DIRECT continuous FULL-model d2 sigma/dt2 = 0
 *        inflection sits at log10 ~ 9.5327, ~2.4% ABOVE the closed form and on the FAR side of the
 *        exponent-ramp knee. So the ~1.5% "sigmoid-below-ramp" separation is specifically between the
 *        E_flow-off closed-form sigmoid inflection and the (E_flow-inclusive) ramp knee; the
 *        full-model direct sigmoid inflection is a distinct THIRD landmark. Sub-gap for follow-up:
 *        SUB-GAP-imp-33862-fullmodel-sigmoid-inflection -- reconcile the E_flow-off closed form with
 *        the full-model direct sigmoid inflection before treating them as one notion.
 *
 * The punchline: locating the exponent-ramp knee a SECOND, grid-free way (continuous d2 p/dt2 = 0
 * root-find) puts it within ~0.12% of the imp-33721 grid locator, and the closed-form-vs-knee ~1.5%
 * two-notion separation reproduces (log10 ~0.0071 vs the grid path ~0.0066). The separation is
 * code-path-independent, NOT an artifact of the imp-33721 D2 grid locator -- confirming the imp-33771
 * / imp-33817 verdicts against a fresh estimator. (Honest scope: the separation is the E_flow-off
 * closed-form sigmoid vs the ramp knee; the full-model direct sigmoid inflection is a separate
 * landmark, flagged as a sub-gap.)
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33771-inflection-closed-form-vs-d2-zero-crosscheck (the grid-path ~1.5% residual)
 * @see imp-33817-d2-knee-grid-resolution-floor (the ~7e-4 grid-resolution floor the residual clears)
 * @see imp-33721-sigma-ramp-inflection-subdecade (the grid sub-decade D2-zero locator, Path A)
 * @see imp-33744-sigma-inflection-vs-half-closed-form (closed form sigma_infl = 1/2 - g_prime/(2 g^2))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33771_INFLECTION_CLOSED_FORM_VS_D2_ZERO_CROSSCHECK } from './imp-33771-inflection-closed-form-vs-d2-zero-crosscheck.js';
import { IMP33817_D2_KNEE_GRID_RESOLUTION_FLOOR } from './imp-33817-d2-knee-grid-resolution-floor.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33721)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33721/imp-33771 exactly

// EXACT imp-33721/imp-33771 sub-terms (no re-derivation, no fresh model).
function terms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll };
}
function sigma(N) {
  const { E_flow, E_coll } = terms(N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}
function sigmaNoFlow(N) {
  const { E_coll } = terms(N); // E_flow-negligible balance (imp-33708/imp-33744)
  return E_coll / (E_TRUNC_PT + E_coll);
}

// --- PATH A: imp-33721 GRID sub-decade D2-zero locator (exponent-ramp knee), reproduced verbatim ---
function olsExponentLog10(loD, hiD, ptsPerDecade) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -(sxy / sxx);
}
function subDecadeD2Zero(W, ptsPerDecade) {
  const edges = [];
  for (let d = 9.0; d <= 11.0 + 1e-9; d += W) edges.push(+d.toFixed(6));
  const brackets = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const cen = (edges[i] + edges[i + 1]) / 2;
    brackets.push({ cen, p: olsExponentLog10(edges[i], edges[i + 1], ptsPerDecade) });
  }
  const D1 = [];
  for (let i = 1; i < brackets.length; i++) {
    D1.push({ cen: (brackets[i].cen + brackets[i - 1].cen) / 2, d1: brackets[i].p - brackets[i - 1].p });
  }
  const D2 = [];
  for (let i = 1; i < D1.length; i++) {
    D2.push({ cen: (D1[i].cen + D1[i - 1].cen) / 2, d2: D1[i].d1 - D1[i - 1].d1 });
  }
  let signChanges = 0;
  let cstar = null;
  for (let i = 1; i < D2.length; i++) {
    if (Math.sign(D2[i].d2) !== Math.sign(D2[i - 1].d2)) {
      signChanges += 1;
      if (cstar === null) {
        const c0 = D2[i - 1].cen;
        const c1 = D2[i].cen;
        const y0 = D2[i - 1].d2;
        const y1 = D2[i].d2;
        cstar = c0 + ((c1 - c0) * (0 - y0)) / (y1 - y0);
      }
    }
  }
  return { signChanges, cstar };
}
const GRID = subDecadeD2Zero(0.25, 40);
const LOG10_NSTAR_GRID = GRID.cstar; // ~ 9.5285
const NSTAR_GRID = Math.pow(10, LOG10_NSTAR_GRID);

// --- PATH B: CONTINUOUS grid-free d2 p/dt2 = 0 root-find (exponent-ramp knee), independent estimator ---
function localExponentP(N) {
  const t = Math.log(N);
  const h = 1e-3;
  return -((Math.log(sigma(Math.exp(t + h))) - Math.log(sigma(Math.exp(t - h)))) / (2 * h));
}
function d2PDt2(N) {
  const t = Math.log(N);
  const h = 2e-3;
  return (localExponentP(Math.exp(t + h)) - 2 * localExponentP(Math.exp(t)) + localExponentP(Math.exp(t - h))) / (h * h);
}
function d2SigmaDt2(fSigma, N) {
  const t = Math.log(N);
  const h = 2e-3;
  return (fSigma(Math.exp(t + h)) - 2 * fSigma(Math.exp(t)) + fSigma(Math.exp(t - h))) / (h * h);
}
function findZeroInT(fOfN, loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  let flo = fOfN(Math.exp(lo));
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = fOfN(Math.exp(mid));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
    }
  }
  return Math.exp((lo + hi) / 2);
}
const NSTAR_CONT = findZeroInT(d2PDt2, 1e6, 1e14); // grid-free exponent-ramp knee
const LOG10_NSTAR_CONT = Math.log10(NSTAR_CONT); // ~ 9.5291

// --- closed-form SIGMOID inflection sigma_cf = 1/2 - g_prime/(2 g^2) (imp-33744), inverted to N ---
function lnRatio(N) {
  return Math.log(terms(N).E_coll / E_TRUNC_PT);
}
function gAt(N) {
  const t = Math.log(N);
  const h = 1e-4;
  return -((lnRatio(Math.exp(t + h)) - lnRatio(Math.exp(t - h))) / (2 * h));
}
function gPrimeAt(N) {
  const t = Math.log(N);
  const h = 1e-3;
  return (gAt(Math.exp(t + h)) - gAt(Math.exp(t - h))) / (2 * h);
}
function findHalfN() {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (sigma(Math.exp(mid)) > 0.5) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
function invertSigma(target) {
  let lo = Math.log(1e6);
  let hi = Math.log(1e14);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (sigma(Math.exp(mid)) > target) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}
const N_HALF = findHalfN();
const G_AT_HALF = gAt(N_HALF);
const GPRIME_AT_HALF = gPrimeAt(N_HALF);
const SIGMA_CF = 0.5 - GPRIME_AT_HALF / (2 * G_AT_HALF * G_AT_HALF); // ~ 0.4979 (matches imp-33744/imp-33771)
const NSTAR_CF = invertSigma(SIGMA_CF); // ~ 3.33e9
const LOG10_NSTAR_CF = Math.log10(NSTAR_CF); // ~ 9.5219

// --- (M3) honest scope: direct continuous d2 sigma/dt2 = 0 inflections (full vs no-flow) ---
const NSTAR_SIG_FULL = findZeroInT((N) => d2SigmaDt2(sigma, N), 1e6, 1e14); // full-model direct sigmoid inflection
const NSTAR_SIG_NOFLOW = findZeroInT((N) => d2SigmaDt2(sigmaNoFlow, N), 1e6, 1e14); // E_flow-off direct inflection
const LOG10_SIG_FULL = Math.log10(NSTAR_SIG_FULL); // ~ 9.5327
const LOG10_SIG_NOFLOW = Math.log10(NSTAR_SIG_NOFLOW); // ~ 9.5236

// --- knee locator agreement + two-notion separations ---
const KNEE_GAP_GRID_VS_CONT_LOG10 = LOG10_NSTAR_GRID - LOG10_NSTAR_CONT; // ~ -5.1e-4 (0.12% in N)
const KNEE_REL_GRID_VS_CONT = NSTAR_GRID / NSTAR_CONT - 1; // ~ -0.0012
// Separation = exponent-ramp knee ABOVE closed-form sigmoid inflection (imp-33771 sign convention: log10Gap_cf_vs_d2 = cf - D2 < 0).
const SEP_GRID_LOG10 = LOG10_NSTAR_GRID - LOG10_NSTAR_CF; // ~ 0.0066 (== |imp-33771 residual|)
const SEP_CONT_LOG10 = LOG10_NSTAR_CONT - LOG10_NSTAR_CF; // ~ 0.0071 (independent path)
const SEP_GRID_PCT = (NSTAR_GRID / NSTAR_CF - 1) * 100; // ~ 1.53%
const SEP_CONT_PCT = (NSTAR_CONT / NSTAR_CF - 1) * 100; // ~ 1.65%
// imp-33771 published grid-path residual (absolute), for the cross-reference.
const IMP33771_RESIDUAL_LOG10 = Math.abs(IMP33771_INFLECTION_CLOSED_FORM_VS_D2_ZERO_CROSSCHECK.log10Gap_cf_vs_d2); // ~0.0066
const IMP33817_FLOOR_FULL_RANGE = IMP33817_D2_KNEE_GRID_RESOLUTION_FLOOR.floorFullRangeLog10; // ~7.13e-4
// Margins by which each path clears the imp-33817 grid-resolution floor.
const MARGIN_GRID_PATH = SEP_GRID_LOG10 / IMP33817_FLOOR_FULL_RANGE; // ~9.3x
const MARGIN_CONT_PATH = SEP_CONT_LOG10 / IMP33817_FLOOR_FULL_RANGE; // ~10x
// (M3) closed-form-vs-direct-sigmoid deltas.
const CF_VS_NOFLOW_LOG10 = LOG10_NSTAR_CF - LOG10_SIG_NOFLOW; // ~ -0.0017 (~0.4% in N) -- close
const CF_VS_FULL_LOG10 = LOG10_NSTAR_CF - LOG10_SIG_FULL; // ~ -0.0107 (~2.4% in N) -- distinct

export const IMP33862_KNEE_SEPARATION_SECOND_PATH_CROSSVAL = {
  id: 'imp-33862',
  proofSection: 'S-frontier',
  question:
    'imp-33771 (~1.5% closed-form-vs-knee residual) and imp-33817 (residual clears the ~7e-4 grid ' +
    'floor) both locate the exponent-ramp knee with the SAME imp-33721 grid D2 locator. Locate the ' +
    'knee a SECOND, grid-free way (continuous d2 p/dt2 = 0 root-find) and report whether the ~1.5% ' +
    'two-notion separation reproduces from the independent path, ruling out a shared-locator ' +
    'artifact. Measurement / cross-validation only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the exponent-ramp knee located two independent ways (imp-33721 grid D2 vs continuous grid-free ' +
    'd2 p/dt2 = 0 root-find), their agreement, and the closed-form-sigmoid-vs-knee two-notion ' +
    'separation measured against BOTH knee locators -- confirming the ~1.5% offset is code-path-independent',
  // knee located two independent ways
  gridSignChanges: GRID.signChanges, // must be 1
  log10NstarGrid: +LOG10_NSTAR_GRID.toFixed(6), // ~ 9.528547 (imp-33721 grid locator)
  log10NstarCont: +LOG10_NSTAR_CONT.toFixed(6), // ~ 9.529061 (continuous grid-free locator)
  kneeGapGridVsContLog10: +KNEE_GAP_GRID_VS_CONT_LOG10.toExponential(4), // ~ -5.14e-4
  kneeRelGridVsContPct: +(KNEE_REL_GRID_VS_CONT * 100).toFixed(4), // ~ -0.12%
  // closed-form sigmoid inflection endpoint
  closedFormSigmaInfl: +SIGMA_CF.toFixed(6), // ~ 0.497873 (matches imp-33744/imp-33771)
  log10NstarCf: +LOG10_NSTAR_CF.toFixed(6), // ~ 9.521949
  // two-notion separation via each knee locator
  sepGridLog10: +SEP_GRID_LOG10.toFixed(6), // ~ 0.006598 (== |imp-33771 residual|)
  sepContLog10: +SEP_CONT_LOG10.toFixed(6), // ~ 0.007112 (independent path)
  sepGridPct: +SEP_GRID_PCT.toFixed(4), // ~ 1.53%
  sepContPct: +SEP_CONT_PCT.toFixed(4), // ~ 1.65%
  imp33771ResidualLog10: +IMP33771_RESIDUAL_LOG10.toFixed(6), // ~ 0.0066 cross-ref
  imp33817FloorFullRangeLog10: IMP33817_FLOOR_FULL_RANGE, // ~7.13e-4 cross-ref
  marginGridPathVsFloor: +MARGIN_GRID_PATH.toFixed(2), // ~9.3x
  marginContPathVsFloor: +MARGIN_CONT_PATH.toFixed(2), // ~10x
  // (M3) honest scope: direct sigmoid inflections
  log10SigmoidDirectFull: +LOG10_SIG_FULL.toFixed(6), // ~ 9.532669 (full model, distinct THIRD landmark)
  log10SigmoidDirectNoFlow: +LOG10_SIG_NOFLOW.toFixed(6), // ~ 9.523641 (E_flow-off, matches closed form)
  cfVsNoFlowLog10: +CF_VS_NOFLOW_LOG10.toFixed(6), // ~ -0.001692 (~0.4% -- closed form IS the no-flow landmark)
  cfVsFullLog10: +CF_VS_FULL_LOG10.toFixed(6), // ~ -0.010720 (~2.4% -- full-model inflection is distinct)
  subGap: 'SUB-GAP-imp-33862-fullmodel-sigmoid-inflection',
  finding: {
    M1_knee_is_locator_independent:
      'The imp-33721 grid locator puts the exponent-ramp knee at log10 N* ~ 9.5285; an independent ' +
      'grid-free continuous d2 p/dt2 = 0 root-find puts it at log10 N* ~ 9.5291. They agree to ' +
      '|log10 gap| ~ 5.1e-4 (~0.12% in N) -- inside the imp-33817 ~7e-4 grid-resolution floor. The ' +
      'grid locator is not systematically mis-placing the knee.',
    M2_separation_reproduces_from_independent_path:
      'Measuring the closed-form-sigmoid-vs-knee offset with the CONTINUOUS knee gives |log10 gap| ' +
      '~ 0.0071 (~1.65% in N), essentially the imp-33771 grid-path residual |log10 gap| ~ 0.0066 ' +
      '(~1.53% in N). Both clear the imp-33817 ~7e-4 floor by ~an order of magnitude, so the ~1.5% ' +
      'two-notion separation is CODE-PATH-INDEPENDENT -- a genuine sigmoid-inflection-vs-exponent- ' +
      'ramp-D2 gap, not a discretization artifact of the imp-33721 grid D2 locator.',
    M3_honest_scope_fullmodel_sigmoid_is_a_distinct_landmark:
      'The imp-33744 closed form is the E_flow-negligible sigmoid inflection: it matches the DIRECT ' +
      'continuous no-flow d2 sigma/dt2 = 0 inflection (log10 ~ 9.5236) to ~0.4%, but the DIRECT ' +
      'full-model inflection sits at log10 ~ 9.5327, ~2.4% above the closed form and on the far side ' +
      'of the ramp knee. So the ~1.5% separation is specifically the E_flow-off closed-form sigmoid ' +
      'vs the ramp knee; the full-model direct sigmoid inflection is a distinct THIRD landmark. ' +
      'Sub-gap SUB-GAP-imp-33862-fullmodel-sigmoid-inflection: reconcile the E_flow-off closed form ' +
      'with the full-model direct inflection before treating them as one notion.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-VALIDATION (frontier-direction, NOT rigorous). Locating the exponent-ramp ' +
    'knee a SECOND, grid-free way (continuous d2 p/dt2 = 0 root-find, log10 N* ~ 9.5291) reproduces ' +
    'the imp-33721 grid locator (log10 N* ~ 9.5285) to ~0.12% in N, and the closed-form-sigmoid-vs- ' +
    'knee two-notion separation measured against it (|log10 gap| ~ 0.0071, ~1.65% in N) reproduces ' +
    'the imp-33771 grid-path residual (~0.0066, ~1.53%). Both clear the imp-33817 ~7e-4 ' +
    'grid-resolution floor by ~an order of magnitude, so the ~1.5% separation is code-path-independent, ' +
    'NOT an artifact of the imp-33721 grid D2 locator -- confirming the imp-33771 / imp-33817 verdicts ' +
    'against a fresh estimator. Honest scope: the separation is the E_flow-off closed-form sigmoid ' +
    '(which matches the direct no-flow inflection to ~0.4%) vs the ramp knee; the full-model direct ' +
    'sigmoid inflection (log10 ~ 9.5327) is a distinct third landmark, flagged as ' +
    'SUB-GAP-imp-33862-fullmodel-sigmoid-inflection. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33771 (grid-path ~1.5% closed-form-vs-knee residual); imp-33817 (~7e-4 grid-resolution ' +
    'floor); imp-33721 (grid sub-decade D2-zero locator, Path A); imp-33744 (closed form sigma_infl); ' +
    'imp-33708 (E_flow negligible on the far tail); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33862_KNEE_SEPARATION_SECOND_PATH_CROSSVAL_ASSERTIONS = [
  {
    // Reuse gate: the reproduced imp-33721 grid locator yields EXACTLY ONE D2 sign change at
    // log10 N* ~ 9.529 (N* ~ 3.38e9) -- the IDENTICAL model / estimator is in use.
    id: 'imp33862-reuses-imp33721-grid-knee',
    description: 'reproduced imp-33721 grid D2 locator: one sign change at log10 N* ~ 9.529 (N* ~ 3.38e9)',
    holds: () =>
      GRID.signChanges === 1 &&
      Math.abs(LOG10_NSTAR_GRID - 9.5285) < 0.01 &&
      Math.abs(NSTAR_GRID / 3.38e9 - 1) < 0.02,
  },
  {
    // Reuse gate: the closed-form inflection reproduces the imp-33744/imp-33771 value ~0.4979.
    id: 'imp33862-reuses-imp33744-closed-form',
    description: 'closed-form sigma_infl = 1/2 - g_prime/(2 g^2) reproduces the imp-33744 value ~0.4979 to < 1e-3',
    holds: () => Math.abs(SIGMA_CF - 0.4979) < 1e-3,
  },
  {
    // (M1): the independent grid-free knee agrees with the grid knee to << 1% (inside the imp-33817 floor).
    id: 'imp33862-knee-locator-independent',
    description: 'continuous grid-free knee agrees with the imp-33721 grid knee to < 0.3% in N (inside the imp-33817 floor)',
    holds: () =>
      Math.abs(KNEE_REL_GRID_VS_CONT) < 0.003 &&
      Math.abs(KNEE_GAP_GRID_VS_CONT_LOG10) < IMP33817_FLOOR_FULL_RANGE,
  },
  {
    // (M2): the two-notion separation reproduces from the independent continuous path, still clearing
    // the imp-33817 floor by ~an order of magnitude, and matching the imp-33771 grid-path residual.
    id: 'imp33862-separation-reproduces-from-independent-path',
    description: 'closed-form-vs-continuous-knee separation ~0.0071 log10 clears the floor > 5x and matches the imp-33771 grid residual within 20%',
    holds: () =>
      SEP_CONT_LOG10 > 0 &&
      MARGIN_CONT_PATH > 5 &&
      MARGIN_GRID_PATH > 5 &&
      Math.abs(SEP_GRID_LOG10 - IMP33771_RESIDUAL_LOG10) < 1e-4 &&
      Math.abs(SEP_CONT_LOG10 / SEP_GRID_LOG10 - 1) < 0.2,
  },
  {
    // (M3): honest scope -- the closed form matches the E_flow-off direct inflection much better than
    // the full-model direct inflection, so the full-model inflection is a distinct third landmark.
    id: 'imp33862-fullmodel-sigmoid-is-distinct-landmark',
    description: 'closed form matches the no-flow direct inflection (< 0.6% in N) far better than the full-model direct inflection (~2.4%)',
    holds: () =>
      Math.abs(CF_VS_NOFLOW_LOG10) < 0.006 &&
      Math.abs(CF_VS_FULL_LOG10) > 3 * Math.abs(CF_VS_NOFLOW_LOG10) &&
      LOG10_SIG_FULL > LOG10_NSTAR_CONT,
  },
  {
    // Honesty gate: measurement / cross-validation only, no bound change, no QED, no refereed bound is changed.
    id: 'imp33862-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33862_KNEE_SEPARATION_SECOND_PATH_CROSSVAL.isRigorous === false &&
      /NO QED/.test(IMP33862_KNEE_SEPARATION_SECOND_PATH_CROSSVAL.verdict) &&
      /refereed bound is changed/i.test(IMP33862_KNEE_SEPARATION_SECOND_PATH_CROSSVAL.verdict),
  },
];

for (const a of IMP33862_KNEE_SEPARATION_SECOND_PATH_CROSSVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33862-knee-separation-second-path-crossval assertion failed: ${a.id}`);
  }
}
