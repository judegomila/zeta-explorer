/**
 * @module imp-124892-sigma-ramp-floor-elasticity-continuous-locus
 *
 * imp-124892 (numerical, frontier-direction): imp-124848 gave the sigma-ramp INTERIOR-PEAK
 * floor-elasticity the full imp-33708 ten-floor OLS treatment (p_peak_lsq ~ -1.412) and confirmed it
 * is a genuinely SOFTER exponent than the imp-124772 far-tail KNEE (p_knee_lsq ~ -2.106) -- a ~0.69
 * gap. But those two exponents are read at TWO ISOLATED LANDMARKS: the argmax peak N*_peak(floor) and
 * a single downslope-crossing knee. imp-124848 F3 leaves open whether the exponent moves CONTINUOUSLY
 * between them and, if so, whether that motion is monotone. This module tabulates the floor-elasticity
 * as a CONTINUOUS locus by running the imp-33708 0.5x..5x E_trunc floor-ladder OLS at a SWEEP of
 * sigma-threshold levels between the peak and the far tail, one exponent p(thr) per level.
 *
 * THE CONSTRUCTION (identical formulas / floor ladder to imp-33708 and imp-124772)
 * ------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),   E_trunc = 3.06e-5 * factor,
 *     E_coll = C_C_PINNED * sqrt(log T0 / N),  E_flow = C_F (log T0 / T0) Gronwall,
 * with the imp-2631 base floor and the imp-398 C_F prefactor (byte-for-byte the imp-33708 model, so
 * thr = 0.5 and thr = 0.1 reproduce the imp-33708 far-tail landmark exponents). For each threshold
 * level thr in a sweep between the base peak value sigma_max ~ 0.9494 and the deep tail 0.05, we
 * log10-bisect the DOWNSLOPE crossing N_cross(thr, floor) for every one of the ten floor factors and
 * OLS-fit log10 N_cross on log10 E_trunc; the slope IS the threshold-crossing floor-elasticity p(thr).
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F0) THE THRESHOLD-CROSSING ELASTICITY NEVER REACHES THE PEAK-LOCUS -1.412. Across the whole valid
 *        threshold continuum p(thr) stays confined to the tail band [-2.250, -2.077]; its shallowest
 *        member (deepest tail, thr = 0.05) is p ~ -2.077, still ~0.66 STEEPER than the imp-124848
 *        peak-locus exponent -1.412. The downslope-crossing family does not cross into peak territory.
 *   (F1) IN THE CLEAN TAIL THE MOTION IS MONOTONE -- TOWARD -2.08, NOT -1.4. For thr <= 0.80
 *        (R^2 > 0.9999) p(thr) shallows STRICTLY and monotonically as thr decreases, from ~ -2.176
 *        (thr = 0.80) toward the clean dimensional -2.077 asymptote (thr = 0.05), tracking
 *        E_flow/E_trunc -> 0. So the far-tail exponent drifts toward -2.08, AWAY from the peak -1.4.
 *   (F2) APPROACHING THE PEAK THE EXPONENT HUMPS THEN DESTABILISES. Going the other way |p| does NOT
 *        soften toward -1.4 -- it STEEPENS to a maximum ~ -2.250 near thr ~ 0.855, then the OLS
 *        degrades (R^2 falls to ~ 0.993 at thr = 0.90) as the near-peak downslope crossing becomes
 *        square-root-singular in the floor (near a smooth maximum sigma ~ sigma_max - c(logN)^2, so the
 *        crossing moves as sqrt of the level gap, not a power law). Above thr ~ 0.910 -- the SMALLEST
 *        per-floor sigma_max (the 5x floor peaks at 0.9103) -- the crossing ceases to exist for the
 *        largest floors, so the threshold-crossing locus TERMINATES before reaching the peak.
 *   (F3) NO MONOTONE THRESHOLD BRIDGE FROM -2.1 TO -1.4: THE TWO LANDMARKS ARE DIFFERENT LOCI. The
 *        imp-124848 peak (-1.412) is an ARGMAX locus N*_peak(floor); the imp-124772 knee / imp-33708
 *        far tail (-2.106) is a DOWNSLOPE-CROSSING locus N_cross(thr, floor). The continuous
 *        threshold-crossing sweep stays near -2.1 (steepening to -2.25 as it nears the peak, then
 *        terminating) and never approaches -1.412 -- so the imp-124848 ~0.69 gap is a
 *        BETWEEN-CONSTRUCTION gap, not two ends of one continuous curve.
 *
 * VERDICT: the sigma-ramp floor-elasticity, tabulated as a continuous threshold-crossing locus p(thr),
 * is CONFINED to the tail band [-2.25, -2.08] and is monotone only in the clean tail (shallowing toward
 * -2.077); it steepens to -2.25 near the peak and terminates at thr ~ 0.91 before reaching the argmax
 * peak. The imp-124848 peak-locus -1.412 and the imp-124772 far-tail knee -2.106 measure structurally
 * different loci (argmax vs downslope crossing); there is NO monotone threshold-crossing bridge between
 * them, so the ~0.69 gap is between two constructions, not two ends of one curve.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit (peak-locus p_peak ~ -1.412; the softer landmark)
 * @see imp-124772-knee-floor-elasticity-multifloor-fit (far-tail knee p_knee ~ -2.106; the steeper landmark)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x floor ladder + downslope-crossing recipe reused here)
 * @see imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 floor); imp-398 (E_flow C_F prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124848-sigma-interior-peak-floor-elasticity-multifloor-fit.js';
import { IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124772-knee-floor-elasticity-multifloor-fit.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor
const GRONWALL = Math.exp(1.0 * 2.37e-4); // matches imp-33708/imp-124848 exactly

// Byte-for-byte the imp-33708 sub-terms; only the E_trunc floor is a parameter.
function partsWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { E_flow, sigma: E_coll / (E_trunc + E_flow + E_coll) };
}
const sigmaWith = (N, E_trunc) => partsWith(N, E_trunc).sigma;

// Base-floor peak of sigma(N): golden-section on log10 N (the imp-33684 argmax locale).
function peakLog10(E_trunc, lo = 3, hi = 12) {
  const gr = (Math.sqrt(5) - 1) / 2;
  let a = lo;
  let b = hi;
  let c = b - gr * (b - a);
  let d = a + gr * (b - a);
  for (let i = 0; i < 200; i++) {
    if (sigmaWith(10 ** c, E_trunc) < sigmaWith(10 ** d, E_trunc)) a = c;
    else b = d;
    c = b - gr * (b - a);
    d = a + gr * (b - a);
  }
  return (a + b) / 2;
}

// Downslope sigma < thr crossing, log10-bisected on N > N_peak (imp-33708 bracketing).
function crossLog10(thr, E_trunc, loExp, hiExp = 18) {
  let lo = loExp;
  let hi = hiExp;
  for (let i = 0; i < 300; i++) {
    const m = (lo + hi) / 2;
    if (sigmaWith(10 ** m, E_trunc) > thr) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];

const PEAK_LOG10_N = peakLog10(E_TRUNC_BASE);
const PEAK_SIGMA = sigmaWith(10 ** PEAK_LOG10_N, E_TRUNC_BASE); // ~ 0.9494
// Smallest per-floor peak height (the 5x floor); thresholds above it lose crossings for large floors.
const MIN_SIGMA_MAX = Math.min(
  ...FLOOR_FACTORS.map((f) => {
    const Et = E_TRUNC_BASE * f;
    return sigmaWith(10 ** peakLog10(Et), Et);
  }),
); // ~ 0.9103 (5x floor)

// OLS of log10 N_cross on log10 E_trunc over all ten floors at one threshold level.
function elasticityAt(thr) {
  const xs = [];
  const ys = [];
  for (const f of FLOOR_FACTORS) {
    const Et = E_TRUNC_BASE * f;
    xs.push(Math.log10(Et));
    ys.push(crossLog10(thr, Et, PEAK_LOG10_N + 1e-6));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const r = ys[i] - (slope * xs[i] + intercept);
    ssRes += r * r;
  }
  const baseLog10N = crossLog10(thr, E_TRUNC_BASE, PEAK_LOG10_N + 1e-6);
  const base = partsWith(10 ** baseLog10N, E_TRUNC_BASE);
  return {
    threshold: thr,
    log10_N_cross: +baseLog10N.toFixed(4),
    N_cross: +(10 ** baseLog10N).toExponential(3),
    eflowOverEtrunc: +(base.E_flow / E_TRUNC_BASE).toExponential(3),
    p: +slope.toFixed(4),
    r2: +(1 - ssRes / syy).toFixed(6),
  };
}

// Threshold sweep from just below the peak (all ten floors still cross) down into the deep tail.
const THRESHOLDS = [0.9, 0.855, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05];
const LOCUS = THRESHOLDS.map(elasticityAt);

const PEAK_LOCUS_EXPONENT = IMP124848_SIGMA_INTERIOR_PEAK_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pPeakLsq; // ~ -1.412
const KNEE_EXPONENT = IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pKneeLsq; // ~ -2.106

const P_VALUES = LOCUS.map((r) => r.p);
const MIN_ABS_P = Math.min(...P_VALUES.map(Math.abs)); // ~2.077 (deepest tail)
const MAX_ABS_P = Math.max(...P_VALUES.map(Math.abs)); // ~2.250 (hump near thr ~ 0.855)
const HUMP = LOCUS.reduce((a, b) => (Math.abs(b.p) > Math.abs(a.p) ? b : a));
const TAIL_ASYMPTOTE = LOCUS[LOCUS.length - 1].p; // ~ -2.077
const GAP_MIN_TO_PEAK = +Math.abs(MIN_ABS_P - Math.abs(PEAK_LOCUS_EXPONENT)).toFixed(4); // ~0.66

// Clean-tail (thr <= 0.80, R^2 > 0.9999) monotone-shallowing check.
const CLEAN_TAIL = LOCUS.filter((r) => r.threshold <= 0.8);
let CLEAN_TAIL_MONOTONE = true;
for (let i = 1; i < CLEAN_TAIL.length; i++) {
  if (!(Math.abs(CLEAN_TAIL[i].p) < Math.abs(CLEAN_TAIL[i - 1].p))) CLEAN_TAIL_MONOTONE = false;
}

export const IMP124892_SIGMA_RAMP_FLOOR_ELASTICITY_CONTINUOUS_LOCUS = {
  id: 'imp-124892',
  proofSection: 'S-frontier',
  question:
    'imp-124848 read the sigma-ramp interior-peak floor-elasticity (p_peak ~ -1.412) and the ' +
    'imp-124772 far-tail knee (p_knee ~ -2.106) at two isolated landmarks with a ~0.69 gap. Tabulate ' +
    'the floor-elasticity as a CONTINUOUS locus by running the imp-33708 0.5x..5x floor-ladder OLS at ' +
    'a sweep of sigma-threshold levels between the peak and the far tail, one exponent p(thr) per ' +
    'level, and derive where the exponent transitions from ~ -1.4 to ~ -2.1 and whether it is ' +
    'monotone. Measurement/fit only; conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the ten-floor OLS slope p(thr) of log10 N_cross on log10 E_trunc for a sweep of downslope ' +
    'sigma-threshold levels thr, with R^2, crossing N and E_flow/E_trunc per level, versus the ' +
    'imp-124848 peak-locus -1.412 and imp-124772 far-tail knee -2.106',
  model: {
    peakSigma: +PEAK_SIGMA.toFixed(5), // ~0.9494 (base-floor sigma_max)
    minSigmaMax: +MIN_SIGMA_MAX.toFixed(5), // ~0.9103 (5x floor; the locus termination level)
    peakLog10N: +PEAK_LOG10_N.toFixed(4), // ~5.965
    floorFactors: FLOOR_FACTORS,
    note:
      'thresholds above the smallest per-floor sigma_max (~0.9103, the 5x floor) lose a downslope ' +
      'crossing for the largest floors, so the threshold-crossing locus terminates before the argmax peak',
  },
  locus: LOCUS,
  humpThreshold: HUMP.threshold, // ~0.855
  maxAbsExponent: +MAX_ABS_P.toFixed(4), // ~2.250 (steepest, near-peak hump)
  minAbsExponent: +MIN_ABS_P.toFixed(4), // ~2.077 (deepest tail)
  tailAsymptoteExponent: TAIL_ASYMPTOTE, // ~ -2.077
  cleanTailMonotone: CLEAN_TAIL_MONOTONE, // true (shallowing toward -2.077 as thr decreases)
  peakLocusExponent: PEAK_LOCUS_EXPONENT, // ~ -1.412 (imp-124848 argmax locus)
  kneeExponent: KNEE_EXPONENT, // ~ -2.106 (imp-124772 downslope-crossing locus)
  gapMinExponentToPeak: GAP_MIN_TO_PEAK, // ~0.66 (shallowest crossing exponent is still this far from the peak -1.412)
  finding: {
    F0_never_reaches_peak_locus:
      'across the whole valid threshold continuum p(thr) stays in the tail band [-2.250, -2.077]; the ' +
      'shallowest member (deepest tail thr = 0.05) is ~ -2.077, still ~0.66 steeper than the imp-124848 ' +
      'peak-locus -1.412 -- the downslope-crossing family never crosses into peak territory.',
    F1_clean_tail_monotone_toward_minus_two:
      'for thr <= 0.80 (R^2 > 0.9999) p(thr) shallows strictly and monotonically as thr decreases, from ' +
      '~ -2.176 (thr = 0.80) toward the clean dimensional -2.077 asymptote (thr = 0.05), tracking ' +
      'E_flow/E_trunc -> 0 -- the motion is toward -2.08, AWAY from the peak -1.4.',
    F2_hump_then_terminates_near_peak:
      'going toward the peak |p| does NOT soften toward -1.4 -- it STEEPENS to a max ~ -2.250 near ' +
      'thr ~ 0.855, then the OLS degrades (R^2 ~ 0.993 at thr = 0.90) as the near-peak crossing becomes ' +
      'square-root-singular in the floor; above thr ~ 0.910 (the 5x floor sigma_max) the crossing ' +
      'ceases to exist for the largest floors, so the threshold-crossing locus terminates before the peak.',
    F3_two_landmarks_are_different_loci:
      'the imp-124848 peak (-1.412) is an ARGMAX locus N*_peak(floor); the imp-124772 knee / far tail ' +
      '(-2.106) is a DOWNSLOPE-CROSSING locus N_cross(thr, floor). The continuous threshold-crossing ' +
      'sweep stays near -2.1 (steepening to -2.25 near the peak, then terminating) and never approaches ' +
      '-1.412, so the imp-124848 ~0.69 gap is a between-construction gap, not two ends of one curve.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The sigma-ramp floor-elasticity, tabulated as a ' +
    'continuous threshold-crossing locus p(thr) over the imp-33708 0.5x..5x ladder, is CONFINED to the ' +
    'tail band [-2.250, -2.077]: monotone only in the clean tail (thr <= 0.80, R^2 > 0.9999, shallowing ' +
    'toward the -2.077 clean-dimensional asymptote), steepening to a hump ~ -2.250 near thr ~ 0.855, ' +
    'then destabilising (R^2 ~ 0.993 at thr = 0.90) and TERMINATING at thr ~ 0.910 (the 5x floor ' +
    'sigma_max) before reaching the argmax peak. It never approaches the imp-124848 peak-locus -1.412 ' +
    '(shallowest crossing exponent still ~0.66 away). So the imp-124848 peak (-1.412, argmax locus) and ' +
    'the imp-124772 far-tail knee (-2.106, downslope-crossing locus) measure structurally DIFFERENT ' +
    'loci; there is NO monotone threshold-crossing bridge between them, and the ~0.69 gap is a ' +
    'between-construction gap, not two ends of one continuous curve. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124848 (interior-peak floor-elasticity p_peak ~ -1.412, argmax locus); imp-124772 (far-tail ' +
    'knee p_knee ~ -2.106, downslope-crossing locus); imp-33708 (0.5x..5x floor ladder + downslope ' +
    'crossing recipe reused here); imp-33684 (interior-peak sensitivity ~ -1.375); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc = 3.06e-5 floor); imp-398 (E_flow C_F prefactor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP124892_SIGMA_RAMP_FLOOR_ELASTICITY_CONTINUOUS_LOCUS_ASSERTIONS = [
  {
    // The sweep resolved a valid ten-floor OLS at every threshold level (all crossings downslope of the peak).
    id: 'imp124892-locus-fully-resolved',
    description: 'every threshold level yields a finite exponent with a crossing beyond the base peak',
    holds: () =>
      LOCUS.length === THRESHOLDS.length &&
      LOCUS.every((r) => Number.isFinite(r.p) && r.log10_N_cross > PEAK_LOG10_N),
  },
  {
    // F0: the threshold-crossing elasticity never reaches the imp-124848 peak-locus -1.412.
    id: 'imp124892-never-reaches-peak-locus',
    description: 'all p(thr) in [-2.30,-2.05]; shallowest crossing exponent still > 0.5 from the peak -1.412',
    holds: () =>
      P_VALUES.every((p) => p > -2.3 && p < -2.05) &&
      MIN_ABS_P > Math.abs(PEAK_LOCUS_EXPONENT) + 0.5 &&
      GAP_MIN_TO_PEAK > 0.5,
  },
  {
    // F1: the clean-tail exponent shallows monotonically toward the ~ -2.08 dimensional asymptote.
    id: 'imp124892-clean-tail-monotone-toward-minus-two',
    description: 'for thr <= 0.80 the exponent shallows strictly toward -2.08 as thr decreases',
    holds: () => CLEAN_TAIL_MONOTONE && TAIL_ASYMPTOTE > -2.09 && TAIL_ASYMPTOTE < -2.07,
  },
  {
    // F2: the exponent HUMPS steeper near the peak and the fit degrades there (not a soft approach to -1.4).
    id: 'imp124892-hump-and-degradation-near-peak',
    description: 'max |p| ~ 2.25 at an intermediate threshold, and R^2 at thr=0.90 is well below the tail R^2',
    holds: () => {
      const near = LOCUS.find((r) => r.threshold === 0.9);
      const tail = LOCUS.find((r) => r.threshold === 0.5);
      return (
        MAX_ABS_P > 2.2 &&
        HUMP.threshold > 0.8 &&
        HUMP.threshold < 0.9 &&
        near.r2 < tail.r2 &&
        near.r2 < 0.999
      );
    },
  },
  {
    // Reproduction gate: thr=0.5 and thr=0.1 reproduce the imp-33708/imp-124772 far-tail exponents.
    id: 'imp124892-reproduces-imp33708-fartail-exponents',
    description: 'thr=0.5 gives p ~ -2.105 and thr=0.1 gives p ~ -2.082 (the imp-33708 far-tail band)',
    holds: () => {
      const h = LOCUS.find((r) => r.threshold === 0.5);
      const d = LOCUS.find((r) => r.threshold === 0.1);
      return Math.abs(h.p - -2.105) < 0.01 && Math.abs(d.p - -2.082) < 0.01;
    },
  },
  {
    // Termination: the sweep peak height gap makes the locus stop below the argmax peak.
    id: 'imp124892-locus-terminates-below-peak',
    description: 'the smallest per-floor sigma_max (~0.910) is below the base peak (~0.949), so the locus ends before the peak',
    holds: () => MIN_SIGMA_MAX < PEAK_SIGMA - 0.02 && MIN_SIGMA_MAX < 0.92 && PEAK_SIGMA > 0.94,
  },
  {
    // Honesty gate: measurement/fit only, no QED, no refereed bound is changed.
    id: 'imp124892-honesty-gate-no-qed',
    description: 'Measurement only: continuous locus, two-different-loci verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP124892_SIGMA_RAMP_FLOOR_ELASTICITY_CONTINUOUS_LOCUS.isRigorous === false &&
      /NO QED/.test(IMP124892_SIGMA_RAMP_FLOOR_ELASTICITY_CONTINUOUS_LOCUS.verdict) &&
      /refereed bound is changed/i.test(IMP124892_SIGMA_RAMP_FLOOR_ELASTICITY_CONTINUOUS_LOCUS.verdict),
  },
];

for (const a of IMP124892_SIGMA_RAMP_FLOOR_ELASTICITY_CONTINUOUS_LOCUS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124892-sigma-ramp-floor-elasticity-continuous-locus assertion failed: ${a.id}`,
    );
  }
}
