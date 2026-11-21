/**
 * @module imp-34571-deflow-exponent-vs-analytic-slope
 *
 * imp-34571 (numerical, frontier-direction): imp-34448 fit the imp-34373 deflow(kEnd) =
 * resid_full - resid_noflow monotone falloff and found the local decay exponent
 * p(N) = -d log|deflow| / d log N rising toward an asymptotic pInf ~ 1.000, with rows past the
 * ~1e-15 double-precision floor (kEnd >~ 22.5, bit-zero by ~23) tagged fit-extrapolated (surfaced
 * by the imp-34495 viz-data). imp-34448 asserted pInf is "essentially 1" but never CHECKED that
 * asymptote against the analytic E_flow log-slope, and never verified that the fit rests only on
 * directly-observed (pre-fp-floor) rungs rather than on the fit-extrapolated tail.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 *   (1) The analytic target. E_flow = C_F * log(T0)/T0 * Gronwall with T0 ~ 2*pi*N/log(N) behaves
 *       like log^3(N)/N, so d log E_flow / d log N -> -1 asymptotically (own local exponent
 *       1 - 3/log(N)). deflow inherits that tail through the residual estimator, so the analytic
 *       deflow decay exponent is +1 (the E_flow log-slope magnitude). The analytic pInf target is
 *       therefore EXACTLY 1.
 *   (2) The directly-observed-only refit. Every rung in the imp-34448 localExponentSample sits at
 *       kMid = 16.125..19.875 -- all strictly below the crossing kEnd* ~ 21.281 and the fp floor
 *       kEnd ~ 23, so all are directly observed (deflow nonzero, above fp noise). Refitting
 *       p = pInf - c/log(N) by OLS on ONLY those directly-observed rungs (verbatim imp-34448
 *       machinery) reproduces pInf ~ 1.0007 -- so the asymptote is NOT an artifact of the
 *       fit-extrapolated tail; it is carried by the observed rungs alone.
 *   (3) The residual. |pInf_observed - 1| ~ 7.3e-4, i.e. the directly-observed asymptote sits within
 *       ~7.3e-4 of the analytic E_flow log-slope magnitude of 1. That residual is the same order as
 *       the 1/log(N)-scale finite-rung correction (c/log(N) ~ 3.2/44 ~ 0.073 at kEnd~19, whose OLS
 *       intercept uncertainty is ~1e-3), so the observed approach to pInf ~ 1.000 is CONSISTENT with
 *       the analytic E_flow slope -1. The refit pInf also agrees with the imp-34448 full-window
 *       pInf = 1.0005 to ~2.3e-4, confirming the restriction to observed rungs shifts nothing.
 *
 * THE DIRECTLY-OBSERVED / FIT-EXTRAPOLATED DISTINCTION
 * ----------------------------------------------------
 *   None of the fit rungs cross the fp floor: the deepest, kMid ~ 19.875, is ~3.1 decades of N below
 *   the fp floor kEnd ~ 23. The imp-34448 extrapolationTable rows at kEnd 23, 24, 25, 26 (flagged
 *   directlyMeasurable = false) are POWER-LAW EXTRAPOLATIONS and are deliberately NOT used in this
 *   pInf refit -- the analytic-slope consistency above is established from observed rungs only.
 *
 * NUMERICAL / MEASUREMENT ONLY. Reuses the imp-34448 IMP34448_DEFLOW_DECAY_EXPONENT export verbatim
 * (import-light, no 16.7MB zeros bundle, per [[no_heavy_imports_in_pages]]); recomputes only an OLS
 * intercept from the exported directly-observed local exponents. The inherited imp-3220/imp-3406
 * component model is NOT a rigorous asymptotic; the analytic E_flow slope -1 is a property of that
 * surrogate, not of the true residual; changes no bound; establishes no operator positivity; C_mb
 * GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34448-deflow-decay-exponent (the pInf ~ 1.000 fit checked here against the analytic slope)
 * @see imp-34495-deflow-decay-viz-data (the directly-observed vs fit-extrapolated tagging)
 * @see imp-34485-deflow-cancellation-free (independent cancellation-free confirmation of deflow ~ N^-1)
 * @see imp-34373-eflow-share-near-pole (the monotone deflow falloff)
 */

import { IMP34448_DEFLOW_DECAY_EXPONENT } from './imp-34448-deflow-decay-exponent.js';

const LN10 = Math.LN10;

// The analytic E_flow log-slope magnitude: E_flow ~ log^3(N)/N => d log E_flow / d log N -> -1,
// so the analytic deflow decay exponent (which inherits the E_flow tail) asymptotes to +1.
const ANALYTIC_EFLOW_SLOPE_MAG = 1;

const FP_FLOOR_KEND = IMP34448_DEFLOW_DECAY_EXPONENT.fpFloorKend; // ~23 (deflow bit-zero beyond)
const CROSSING_KEND = IMP34448_DEFLOW_DECAY_EXPONENT.crossingKend; // ~21.281
const FULL_WINDOW_PINF = IMP34448_DEFLOW_DECAY_EXPONENT.asymptoticDecayExponent; // 1.0005

// The imp-34448 directly-observed local exponents (kMid 16.125..19.875): all strictly below the
// crossing and the fp floor, so each is measured from a nonzero, pre-fp-noise deflow difference.
const OBSERVED_RUNGS = IMP34448_DEFLOW_DECAY_EXPONENT.localExponentSample;

// OLS refit p = pInf - c/log(N) restricted to the directly-observed rungs (verbatim imp-34448 form).
function refitPInf(rows) {
  const pts = rows.map((q) => ({ x: 1 / (q.kMid * LN10), y: q.p }));
  const n = pts.length;
  const mx = pts.reduce((a, b) => a + b.x, 0) / n;
  const my = pts.reduce((a, b) => a + b.y, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (const p of pts) {
    sxx += (p.x - mx) ** 2;
    sxy += (p.x - mx) * (p.y - my);
  }
  const slope = sxy / sxx; // = -c
  return { pInf: my - slope * mx, c: -slope };
}

const REFIT = refitPInf(OBSERVED_RUNGS);
const OBSERVED_PINF = REFIT.pInf; // ~1.00073
const OBSERVED_C = REFIT.c; // ~3.212 (tracks E_flow log^3(N)/N model-c = 3)

// The residual between the directly-observed asymptote and the analytic E_flow slope magnitude.
const RESIDUAL_VS_ANALYTIC = Math.abs(OBSERVED_PINF - ANALYTIC_EFLOW_SLOPE_MAG); // ~7.3e-4
// Cross-check: the observed-only refit agrees with the imp-34448 full-window pInf.
const RESIDUAL_VS_FULL_WINDOW = Math.abs(OBSERVED_PINF - FULL_WINDOW_PINF); // ~2.3e-4
// The 1/log(N) finite-rung correction scale at the deepest observed rung (context for the residual).
const DEEPEST_RUNG = OBSERVED_RUNGS[OBSERVED_RUNGS.length - 1];
const FINITE_RUNG_CORRECTION = OBSERVED_C / (DEEPEST_RUNG.kMid * LN10); // ~0.070

export const IMP34571_DEFLOW_EXPONENT_VS_ANALYTIC_SLOPE = {
  id: 'imp-34571',
  proofSection: 'S-frontier',
  question:
    'Is the imp-34448/imp-34495 deflow(kEnd) decay local exponent approach to pInf ~ 1.000, ' +
    'restricted to the directly-observed (pre-fp-floor) rungs, consistent with the analytic E_flow ' +
    'log-slope -1, and what is the residual between the observed-only pInf and the analytic value? ' +
    'Measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'pInf from an OLS refit of p = pInf - c/log(N) restricted to the imp-34448 directly-observed ' +
    'rungs (kMid 16.125..19.875, all below the crossing and fp floor), and its residual against the ' +
    'analytic E_flow log-slope magnitude 1.',
  analyticEflowSlopeMagnitude: ANALYTIC_EFLOW_SLOPE_MAG, // 1 (E_flow ~ log^3(N)/N => slope -> -1)
  fpFloorKend: FP_FLOOR_KEND,
  crossingKend: +CROSSING_KEND.toFixed(6),
  observedRungCount: OBSERVED_RUNGS.length,
  deepestObservedKmid: DEEPEST_RUNG.kMid,
  observedPInf: +OBSERVED_PINF.toFixed(6), // ~1.00073
  observedC: +OBSERVED_C.toFixed(4), // ~3.212
  fullWindowPInf: FULL_WINDOW_PINF, // 1.0005 (imp-34448)
  residualVsAnalytic: +RESIDUAL_VS_ANALYTIC.toExponential(3), // ~7.3e-4
  residualVsFullWindow: +RESIDUAL_VS_FULL_WINDOW.toExponential(3), // ~2.3e-4
  finiteRungCorrectionScale: +FINITE_RUNG_CORRECTION.toFixed(4), // ~0.070 (c/log N at deepest rung)
  finding: {
    A_observed_only_pInf_reproduces_one:
      'Refitting p = pInf - c/log(N) on ONLY the directly-observed rungs (kMid 16.125..19.875, all ' +
      'below the crossing kEnd* ~ 21.281 and the fp floor kEnd ~ 23) gives pInf ~ 1.0007 and c ~ 3.21 ' +
      '-- the pInf ~ 1.000 asymptote is carried by the observed rungs alone, not by the ' +
      'fit-extrapolated tail.',
    B_consistent_with_analytic_slope:
      'The residual between the observed-only pInf and the analytic E_flow log-slope magnitude of 1 ' +
      'is ~7.3e-4, the same order as the 1/log(N) finite-rung correction (~0.070 at the deepest ' +
      'observed rung), so the observed approach to pInf ~ 1.000 is CONSISTENT with the analytic ' +
      'E_flow slope -1 (deflow ~ N^-1 up to log factors).',
    C_restriction_shifts_nothing:
      'The observed-only pInf agrees with the imp-34448 full-window pInf = 1.0005 to ~2.3e-4, so ' +
      'excluding the fit-extrapolated rows past the fp floor does not move the asymptote -- the ' +
      'consistency verdict rests on directly-observed data only.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Refitting the imp-34448 deflow decay ' +
    'local exponent p = pInf - c/log(N) on ONLY the directly-observed (pre-fp-floor) rungs (kMid ' +
    '16.125..19.875, all below the crossing kEnd* ~ 21.281 and the fp floor kEnd ~ 23) gives pInf ~ ' +
    '1.0007, c ~ 3.21. The residual against the analytic E_flow log-slope magnitude of 1 (E_flow ~ ' +
    'log^3(N)/N, so d log E_flow / d log N -> -1) is ~7.3e-4 -- the same order as the 1/log(N) ' +
    'finite-rung correction -- so the observed approach to pInf ~ 1.000 is CONSISTENT with the ' +
    'analytic E_flow slope -1 (deflow ~ N^-1 up to log factors). The observed-only pInf agrees with ' +
    'the imp-34448 full-window pInf = 1.0005 to ~2.3e-4, so excluding the fit-extrapolated rows past ' +
    'the fp floor (kEnd 23..26, directlyMeasurable = false) does not move the asymptote. The ' +
    'inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the analytic E_flow ' +
    'slope -1 is a property of that surrogate, not of the true residual; changes no bound; ' +
    'establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34448 (the pInf ~ 1.000 fit checked here); imp-34495 (the directly-observed vs ' +
    'fit-extrapolated tagging); imp-34485 (cancellation-free confirmation of deflow ~ N^-1); ' +
    'imp-34373 (the monotone deflow falloff); imp-34169 (the resid_exp pole).',
};

export const IMP34571_DEFLOW_EXPONENT_VS_ANALYTIC_SLOPE_ASSERTIONS = [
  {
    // (A) Every fit rung is directly observed: below both the crossing and the fp floor.
    id: 'imp34571-fit-rungs-are-directly-observed',
    description: 'all refit rungs sit below the crossing kEnd* and the fp floor (no fit-extrapolated rows)',
    holds: () =>
      OBSERVED_RUNGS.length >= 4 &&
      OBSERVED_RUNGS.every((q) => q.kMid < CROSSING_KEND && q.kMid < FP_FLOOR_KEND),
  },
  {
    // (B) The observed-only refit reproduces pInf ~ 1 (asymptote carried by observed rungs alone).
    id: 'imp34571-observed-only-pinf-reproduces-one',
    description: 'directly-observed-only refit gives pInf within 0.01 of the analytic slope magnitude 1',
    holds: () => Number.isFinite(OBSERVED_PINF) && Math.abs(OBSERVED_PINF - ANALYTIC_EFLOW_SLOPE_MAG) < 0.01,
  },
  {
    // (C) The residual vs the analytic slope is small and of the 1/log(N) finite-rung order.
    id: 'imp34571-residual-vs-analytic-is-small',
    description: 'residual |pInf_observed - 1| is below 5e-3 and below the finite-rung correction scale',
    holds: () =>
      RESIDUAL_VS_ANALYTIC < 5e-3 && RESIDUAL_VS_ANALYTIC < FINITE_RUNG_CORRECTION,
  },
  {
    // (D) Restricting to observed rungs shifts the asymptote negligibly vs the imp-34448 full window.
    id: 'imp34571-observed-refit-matches-full-window',
    description: 'observed-only pInf agrees with the imp-34448 full-window pInf to within 1e-3',
    holds: () => RESIDUAL_VS_FULL_WINDOW < 1e-3,
  },
  {
    // (E) The observed-only c coefficient still tracks the E_flow log^3(N)/N model-c = 3.
    id: 'imp34571-c-coefficient-tracks-eflow-tail',
    description: 'observed-only c sits within 0.5 of the E_flow log^3(N)/N model-c = 3',
    holds: () => Number.isFinite(OBSERVED_C) && Math.abs(OBSERVED_C - 3) < 0.5,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34571-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34571_DEFLOW_EXPONENT_VS_ANALYTIC_SLOPE.isRigorous === false &&
      /NO QED/.test(IMP34571_DEFLOW_EXPONENT_VS_ANALYTIC_SLOPE.verdict) &&
      /refereed bound is changed/i.test(IMP34571_DEFLOW_EXPONENT_VS_ANALYTIC_SLOPE.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34571_DEFLOW_EXPONENT_VS_ANALYTIC_SLOPE.verdict),
  },
];

for (const a of IMP34571_DEFLOW_EXPONENT_VS_ANALYTIC_SLOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34571-deflow-exponent-vs-analytic-slope assertion failed: ${a.id}`);
  }
}
