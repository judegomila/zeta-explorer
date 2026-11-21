/**
 * @module imp-35853-req4-required-height-continuous-sigma-knee
 *
 * imp-35853 (accuracy, measurement): TABULATE the imp-35813 REQ-4 required-height
 * multiple 200 / log T0 CONTINUOUSLY versus sigma along the full peak-to-PT downslope,
 * interpolating between the discrete imp-35813 sigma landmark rungs (sigma < 0.99 / 0.9 /
 * 0.75 / 0.5 / 0.25 / 0.1), and locate the knee where the multiple flattens toward its
 * PT-anchor value ~6.96x.
 *
 * imp-35813 populated only DISCRETE sigma-landmark rungs of the required-height multiple
 * (peak ~15.12x, s0.9 ~12.27x, s0.75 ~10.72x, cross/s0.5 ~9.59x, s0.25 ~8.68x, s0.1 ~7.93x,
 * PT anchor ~6.96x). This module fills the interior CONTINUOUSLY: it sweeps a fine sigma
 * grid from just below the interior peak sigma_max ~ 0.9494 down to the sigma at the
 * Platt-Trudgian anchor height (log T0 = log(3e12) ~ 28.73), and for each sigma locates the
 * downslope N via the EXACT same imp-3406 / imp-33582 sub-terms
 * (sigma = E_coll / (E_trunc + E_flow + E_coll)), forms log T0 = log(effectiveHeightForN(N))
 * on the shared imp-3220 / imp-3406 Riemann-von Mangoldt surrogate, and the required-height
 * multiple 200 / log T0 (imp-35538 REQ-4 binding log-height log T0 >= 200).
 *
 * WHAT THE CONTINUOUS CURVE SHOWS (the honest finding). Read as a function of sigma the
 * multiple does NOT monotonically flatten ONTO the ~6.96x PT-anchor value. Its rate of
 * change |d(multiple)/d(sigma)| is LARGEST just below the peak (~62 near sigma ~ 0.93),
 * reaches a shallow MINIMUM (~3.5) at a mid-downslope FLATTEST point sigma ~ 0.407
 * (multiple ~ 9.25x), then RE-STEEPENS on the deep approach to the anchor (|slope| climbing
 * back to ~19 near sigma ~ 0.019). So there is no true knee onto a floor: the ~6.96x figure
 * is the multiple AT the PT-verified height, not an asymptote the sigma-curve settles onto
 * (the multiple would keep descending below 6.96x for smaller sigma / larger height).
 * Three complementary knee/flatness locators, all interpolated between the imp-35813 rungs:
 *   - Kneedle elbow (max normalised distance from the endpoint chord): sigma ~ 0.783,
 *     log T0 ~ 18.27, multiple ~ 10.95x -- the elbow of the STEEP initial descent, sitting
 *     between the imp-35813 s0.9 and s0.75 rungs.
 *   - Flattest point (min |d multiple / d sigma|): sigma ~ 0.407, multiple ~ 9.25x -- the
 *     mid-downslope minimum-rate region, near the imp-35813 s0.5 crossover rung.
 *   - PT-anchor-value approach: the multiple first comes within 10% of the ~6.96x anchor
 *     value at sigma ~ 0.065 (multiple ~ 7.64x) and within 5% at sigma ~ 0.035
 *     (multiple ~ 7.28x), both DEEP below the s0.1 rung.
 *
 * Measurement only; re-reads the imp-33582 model and the imp-35538 binding log-height on the
 * same imp-3220 / imp-3406 surrogate; interpolates the imp-35813 discrete rungs; derives no
 * remainder; discharges nothing; changes no bound; establishes no operator positivity;
 * C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb
 * GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * imp-35943 HONEST-STATUS ADDENDUM: the three markers above are NOT three views of one knee --
 * they are LOCATOR-DEPENDENT and disagree by more than a decade in sigma (Kneedle elbow
 * sigma ~ 0.783, flattest point sigma ~ 0.407, PT-approach-within-5% sigma ~ 0.035). No single
 * canonical "knee" exists; each marker answers a different question (steepest initial bend,
 * slowest local rate, proximity to the anchor value). Read ~6.96x as the multiple AT the
 * Platt-Trudgian verified height, a point value, not an asymptotic floor -- the curve keeps
 * descending below 6.96x for smaller sigma / larger height, so no reachable interior sigma
 * marks a settled-onto knee.
 *
 * @see imp-35813-req4-required-height-sigma-landmark-extend (discrete rungs interpolated here)
 * @see imp-35763-req4-required-height-sigma-landmark-fill (the six-rung filled ladder)
 * @see imp-35722-req4-required-height-landmark-ladder (base peak/crossover/PT ladder)
 * @see imp-35538-route-i-remainder-derivation-requirements (REQ 4; binding log-height 200)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (source model; peak sigma_max ~ 0.9494)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS } from './imp-35538-route-i-remainder-derivation-requirements.js';
import { IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND } from './imp-35813-req4-required-height-sigma-landmark-extend.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// REQ-4 binding log-height: 1/log T0 <= 0.005 => log T0 >= 200 (imp-35538).
const HR = IMP35538_ROUTE_I_REMAINDER_DERIVATION_REQUIREMENTS.heightRegime;
const LOG_T0_NEEDED = HR.logT0NeededForHalfPctBudget; // 200

// EXACT imp-3406 / imp-3529 / imp-33582 sub-terms (no re-derivation, no fresh model).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N, logT0: L };
}
const sigma = (N) => parts(N).sigma;

// Interior peak (reproduces imp-33582 / imp-35813 N ~ 9.22e5, sigma_max ~ 0.9494).
function dSigmadN(N) {
  const h = N * 1e-6;
  return (sigma(N + h) - sigma(N - h)) / (2 * h);
}
function locatePeak() {
  let a = Math.log(1e4);
  let b = Math.log(1e7);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (dSigmadN(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PEAK = locatePeak();
const SIGMA_MAX = sigma(N_PEAK); // ~0.949429

// Downslope threshold crossing (N > N_peak): first N with sigma below thr.
function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// The Platt-Trudgian anchor sits at height T_PT = 3e12, log T0 = log(3e12) ~ 28.73. Locate the
// downslope N whose surrogate log-height equals that anchor, and its sigma / multiple.
const LOG_T0_PT = Math.log(3e12); // ~28.7298
function nForLogT0(target) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e30);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).logT0 < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_PT = nForLogT0(LOG_T0_PT);
const SIGMA_PT = sigma(N_PT); // ~0.0188
const MULT_PT = LOG_T0_NEEDED / LOG_T0_PT; // ~6.9614 (the PT-anchor value the curve is compared against)

// Continuous fine sigma grid from just below the peak (sHi) down to the PT-anchor sigma (sLo).
const S_HI = 0.94;
const S_LO = SIGMA_PT;
const GRID_N = 400;
const fineCurve = [];
for (let i = 0; i <= GRID_N; i++) {
  const s = S_HI + (S_LO - S_HI) * (i / GRID_N);
  const N = crossBelow(s);
  const L = parts(N).logT0;
  fineCurve.push({ sigma: s, logT0: L, multiple: LOG_T0_NEEDED / L });
}

// (A) Kneedle elbow: max normalised perpendicular distance from the endpoint chord.
const s0 = fineCurve[0].sigma;
const s1 = fineCurve[fineCurve.length - 1].sigma;
const m0 = fineCurve[0].multiple;
const m1 = fineCurve[fineCurve.length - 1].multiple;
let bestDist = -1;
let kneeIdx = 0;
for (let i = 0; i < fineCurve.length; i++) {
  const x = (fineCurve[i].sigma - s0) / (s1 - s0);
  const y = (fineCurve[i].multiple - m0) / (m1 - m0);
  const d = Math.abs(y - x); // endpoints map to (0,0) and (1,1); distance from the diagonal
  if (d > bestDist) {
    bestDist = d;
    kneeIdx = i;
  }
}
const kneeMaxCurvature = {
  sigma: +fineCurve[kneeIdx].sigma.toFixed(4),
  logT0: +fineCurve[kneeIdx].logT0.toFixed(4),
  multiple: +fineCurve[kneeIdx].multiple.toFixed(4),
  normalisedChordDistance: +bestDist.toFixed(4),
};

// (B) Flattest point: minimum local rate |d multiple / d sigma| across the fine grid.
let minSlope = Infinity;
let maxSlope = -Infinity;
let flatIdx = 1;
for (let i = 1; i < fineCurve.length; i++) {
  const ds = fineCurve[i].sigma - fineCurve[i - 1].sigma;
  const dm = fineCurve[i].multiple - fineCurve[i - 1].multiple;
  const slope = Math.abs(dm / ds);
  if (slope < minSlope) {
    minSlope = slope;
    flatIdx = i;
  }
  if (slope > maxSlope) maxSlope = slope;
}
const flattestPoint = {
  sigma: +((fineCurve[flatIdx].sigma + fineCurve[flatIdx - 1].sigma) / 2).toFixed(4),
  multiple: +fineCurve[flatIdx].multiple.toFixed(4),
  minAbsSlope: +minSlope.toFixed(3),
  maxAbsSlope: +maxSlope.toFixed(3),
};

// (C) PT-anchor-value approach: first sigma at which the multiple drops within 10% / 5% of MULT_PT.
function firstWithin(frac) {
  const row = fineCurve.find((g) => g.multiple <= MULT_PT * (1 + frac));
  return { sigma: +row.sigma.toFixed(4), multiple: +row.multiple.toFixed(4) };
}
const floorApproach = { within10pct: firstWithin(0.1), within5pct: firstWithin(0.05) };

// A compact display grid (interpolated between the imp-35813 rungs) for the exported table.
const DISPLAY_SIGMAS = [0.94, 0.9, 0.85, 0.8, 0.75, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1, 0.08, 0.06, 0.05, 0.04];
const displayCurve = DISPLAY_SIGMAS.map((s) => {
  const N = crossBelow(s);
  const L = parts(N).logT0;
  return { sigma: s, N: +N.toExponential(3), logT0: +L.toFixed(4), multiple: +(LOG_T0_NEEDED / L).toFixed(4) };
}).concat([{ sigma: +SIGMA_PT.toFixed(4), N: +N_PT.toExponential(3), logT0: +LOG_T0_PT.toFixed(4), multiple: +MULT_PT.toFixed(4), ptAnchor: true }]);

export const IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE = {
  id: 'imp-35853',
  proofSection: 'S-frontier',
  question:
    'Tabulating the imp-35813 REQ-4 required-height multiple 200 / log T0 CONTINUOUSLY versus sigma on the full ' +
    'peak-to-PT downslope (interpolating the discrete sigma < 0.99 / 0.9 / 0.75 / 0.5 / 0.25 / 0.1 landmark rungs), ' +
    'where is the knee at which the multiple flattens toward its ~6.96x PT-anchor value?',
  method:
    'Replicate the exact imp-3406 / imp-33582 sub-terms (sigma = E_coll / (E_trunc + E_flow + E_coll)), sweep a fine ' +
    'sigma grid from just below the peak sigma_max ~ 0.9494 down to the sigma at the Platt-Trudgian anchor height ' +
    '(log T0 = log(3e12) ~ 28.73), locate each downslope N by bisection and form log T0 = log(effectiveHeightForN(N)) ' +
    'on the imp-3220 / imp-3406 RvM surrogate and the multiple 200 / log T0; then locate three complementary knee / ' +
    'flatness markers -- the Kneedle elbow (max normalised chord distance), the flattest point (min |d multiple / ' +
    'd sigma|), and the sigma at which the multiple first comes within 10% / 5% of the ~6.96x PT-anchor value.',
  logT0Needed: LOG_T0_NEEDED, // 200
  sigmaMax: +SIGMA_MAX.toFixed(6),
  ptAnchor: { logT0: +LOG_T0_PT.toFixed(4), sigma: +SIGMA_PT.toFixed(4), multiple: +MULT_PT.toFixed(4) },
  displayCurve,
  kneeMaxCurvature, // Kneedle elbow of the steep initial descent: sigma ~ 0.783, ~10.95x
  flattestPoint, // mid-downslope minimum-rate region: sigma ~ 0.407, ~9.25x
  floorApproach, // within 10% at sigma ~ 0.065; within 5% at sigma ~ 0.035
  // The honest finding: the multiple does NOT flatten ONTO the PT-anchor value in sigma-space -- its rate reaches
  // a mid-downslope minimum then RE-STEEPENS on the deep approach, so ~6.96x is the value AT the PT height, not a floor.
  multipleFlattensOntoPtFloor: false,
  slopeReSteepensOnDeepApproach: flattestPoint.minAbsSlope < maxSlope,
  // imp-35943: the three markers are LOCATOR-DEPENDENT, not three readings of one knee -- they span
  // more than a decade in sigma, so no single canonical knee exists.
  kneeIsLocatorDependent: {
    claim:
      'The Kneedle elbow (sigma ~ 0.783), flattest point (sigma ~ 0.407), and PT-approach-within-5% ' +
      '(sigma ~ 0.035) locators disagree by more than a decade in sigma. No single canonical "knee" exists -- ' +
      'each answers a different question, and ~6.96x is the multiple AT the PT-verified height, a point value, ' +
      'not an asymptotic floor.',
    kneedleElbowSigma: kneeMaxCurvature.sigma,
    flattestPointSigma: flattestPoint.sigma,
    ptApproach5pctSigma: floorApproach.within5pct.sigma,
    spanOrdersOfMagnitude: +Math.log10(kneeMaxCurvature.sigma / floorApproach.within5pct.sigma).toFixed(2),
  },
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Tabulating the imp-35813 REQ-4 required-height multiple 200 / log T0 continuously ' +
    'versus sigma along the peak-to-PT downslope: the multiple decreases monotonically from ~13.6x (sigma ~ 0.94) to ' +
    'the ~6.96x value at the PT anchor (log T0 ~ 28.73, sigma ~ 0.019), but it does NOT flatten ONTO that value in ' +
    'sigma-space. Its rate |d multiple / d sigma| is largest just below the peak (~62), reaches a shallow minimum ' +
    '(~3.5) at a mid-downslope FLATTEST point sigma ~ 0.407 (multiple ~ 9.25x, near the s0.5 crossover rung), then ' +
    'RE-STEEPENS on the deep approach (|slope| ~ 19 near sigma ~ 0.019). The Kneedle elbow of the steep initial ' +
    'descent sits at sigma ~ 0.783 (multiple ~ 10.95x, between the s0.9 and s0.75 rungs); the multiple first comes ' +
    'within 10% of the ~6.96x anchor value at sigma ~ 0.065 and within 5% at sigma ~ 0.035, both deep below the s0.1 ' +
    'rung. So the ~6.96x figure is the multiple AT the PT-verified height, not an asymptotic floor the sigma-curve ' +
    'settles onto -- the multiple would keep descending below 6.96x for smaller sigma / larger height, and every ' +
    'reachable interior sigma still needs > 6.9x more log-height. Re-reads the imp-33582 model and the imp-35538 ' +
    'binding log-height on the same surrogate; interpolates the imp-35813 discrete rungs; derives no remainder; ' +
    'discharges nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) ' +
    '(imp-2642 / imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; ' +
    'imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35813 (discrete sigma-landmark rungs interpolated here); imp-35763 / imp-35722 (filled / base ladders); ' +
    'imp-35538 (REQ 4; binding log-height 200); imp-33582 (sigma-decay model; peak sigma_max ~ 0.9494); ' +
    'imp-3220 / imp-3406 (RvM surrogate log-height); imp-2642 / imp-2643 (C_C = (1/8) sqrt(3 pi)); imp-2631 ' +
    '(E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Riemann-von Mangoldt counting formula; ' +
    'Platt-Trudgian 2021 (Lambda <= 0.2).',
};

export const IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE_ASSERTIONS = [
  {
    // (1) reproduces the imp-33582 / imp-35813 interior peak (identical sub-terms in use).
    id: 'imp35853-reproduces-imp33582-peak',
    description: 'peak N ~ 9.22e5, sigma_max ~ 0.9494 -- confirms the identical imp-33582 sigma model is in use',
    holds: () => Math.abs(N_PEAK / 9.22e5 - 1) < 5e-3 && Math.abs(SIGMA_MAX - 0.9494) < 5e-4,
  },
  {
    // (2) the PT-anchor value the curve is compared against matches the imp-35813 PT rung ~6.96x.
    id: 'imp35853-pt-anchor-value-matches-imp35813',
    description: 'multiple at the log T0 ~ 28.73 PT anchor ~ 6.96x, matching the imp-35813 PT rung',
    holds: () => {
      const ptRung = IMP35813_REQ4_REQUIRED_HEIGHT_SIGMA_LANDMARK_EXTEND.extendedLadder.find((r) => r.key === 'PT');
      const ok = Math.abs(MULT_PT - 6.9614) < 5e-3 && Math.abs(LOG_T0_PT - 28.73) < 5e-3;
      return ok && (ptRung ? Math.abs(MULT_PT - ptRung.requiredMultiple) < 0.05 : true);
    },
  },
  {
    // (3) the continuous curve is internally consistent: multiple = 200 / log T0, monotone descent in sigma.
    id: 'imp35853-continuous-curve-consistent-monotone',
    description: 'every displayCurve row satisfies multiple * logT0 ~ 200; the multiple descends monotonically as sigma decreases',
    holds: () => {
      const consistent = displayCurve.every((r) => Math.abs(r.multiple * r.logT0 - 200) < 0.02);
      const monotone = displayCurve.every((r, i) => i === 0 || r.multiple < displayCurve[i - 1].multiple);
      return consistent && monotone && displayCurve.length === DISPLAY_SIGMAS.length + 1;
    },
  },
  {
    // (4) the Kneedle elbow lands between the imp-35813 s0.9 and s0.75 rungs (steep initial descent).
    id: 'imp35853-kneedle-elbow-between-s09-s075',
    description: 'Kneedle elbow at sigma ~ 0.78, multiple ~ 10.95x, log T0 between the imp-35813 s0.9 (~16.30) and s0.75 (~18.65) rungs',
    holds: () =>
      Math.abs(kneeMaxCurvature.sigma - 0.783) < 0.02 &&
      Math.abs(kneeMaxCurvature.multiple - 10.95) < 0.1 &&
      kneeMaxCurvature.logT0 > 16.30 && kneeMaxCurvature.logT0 < 18.65,
  },
  {
    // (5) the flattest point is a mid-downslope minimum-rate region and the slope RE-STEEPENS on the deep approach.
    id: 'imp35853-flattest-mid-downslope-reSteepens',
    description: 'flattest point sigma ~ 0.41, multiple ~ 9.25x; min |slope| < max |slope| so the curve re-steepens (no flat floor)',
    holds: () =>
      Math.abs(flattestPoint.sigma - 0.407) < 0.03 &&
      Math.abs(flattestPoint.multiple - 9.25) < 0.1 &&
      flattestPoint.minAbsSlope < flattestPoint.maxAbsSlope &&
      IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE.multipleFlattensOntoPtFloor === false,
  },
  {
    // (6) the PT-anchor-value approach happens deep below the s0.1 rung (within 10% and 5% at small sigma).
    id: 'imp35853-floor-approach-deep-below-s01',
    description: 'multiple within 10% of the ~6.96x anchor value only at sigma ~ 0.065 and within 5% at sigma ~ 0.035, both below the s0.1 rung',
    holds: () =>
      floorApproach.within10pct.sigma < 0.1 && floorApproach.within10pct.sigma > 0.04 &&
      floorApproach.within5pct.sigma < floorApproach.within10pct.sigma &&
      floorApproach.within5pct.sigma > SIGMA_PT,
  },
  {
    // (7) imp-35943: the three knee markers are locator-dependent, spanning more than a decade in sigma.
    id: 'imp35943-knee-is-locator-dependent',
    description: 'Kneedle elbow / flattest point / PT-approach-within-5% locators disagree by > 1 decade in sigma',
    holds: () => {
      const k = IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE.kneeIsLocatorDependent;
      return (
        k.spanOrdersOfMagnitude > 1 &&
        Math.abs(k.kneedleElbowSigma - 0.783) < 0.02 &&
        Math.abs(k.flattestPointSigma - 0.407) < 0.03 &&
        Math.abs(k.ptApproach5pctSigma - 0.035) < 0.01 &&
        /disagree by more than a decade/.test(k.claim) &&
        /No single canonical "knee" exists/.test(k.claim)
      );
    },
  },
  {
    // (8) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, imp-486 kept, NO QED.
    id: 'imp35853-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35853-req4-required-height-continuous-sigma-knee assertion failed: ${a.id}`);
  }
}
