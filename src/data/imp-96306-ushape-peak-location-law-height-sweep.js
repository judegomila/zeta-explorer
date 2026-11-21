/**
 * @module imp-96306-ushape-peak-location-law-height-sweep
 *
 * imp-96306 (accuracy, frontier-direction): imp-96187 (F2) derived the location-ratio law
 * N_peak/N_flow = (b/a)^(1/(a+b)) for the imp-3220 sigma U-shape, with a = d ln g_t/d ln N and
 * -b = d ln g_f/d ln N the local log-slopes of g_t = E_trunc/E_coll and g_f = E_flow/E_coll. That
 * check reproduced the imp-96162 measured 0.5769 to 0.3% at the SINGLE physical peak height and
 * ATTRIBUTED the 0.3% residual to the drift of a, b across the [N_peak, N_flow] decade -- but never
 * QUANTIFIED that residual across a height range. This module VERIFIES (P2) across the full imp-96187
 * E_trunc sweep (each scale MOVES the physical peak height L from 14.93 down to 9.48) and MEASURES how
 * the residual scales, confirming it is the locally-constant-slope approximation.
 *
 * THE MEASUREMENT (six heights, the imp-96187 0.25x..16x E_trunc sweep)
 * -------------------------------------------------------------------
 *   scale  L(peak)   measured   (P2)formula   rel_err    drift_a    drift_b
 *   0.25   14.932    0.637128   0.636060      1.68e-3    1.63e-3    1.48e-2
 *   0.50   14.090    0.609561   0.608105      2.39e-3    1.97e-3    1.88e-2
 *   1.00   13.231    0.576887   0.575190      2.94e-3    2.42e-3    2.44e-2   <- physical peak
 *   2.00   12.351    0.538301   0.535840      4.57e-3    3.04e-3    3.28e-2
 *   4.00   11.443    0.491233   0.487778      7.03e-3    3.91e-3    4.60e-2
 *  16.00    9.476    0.356602   0.348730      2.21e-2    7.32e-3    1.13e-1
 * where drift_a = |a(N_flow) - a(N_peak)|/a(N_peak) and drift_b = |b(N_flow) - b(N_peak)|/b(N_peak)
 * are the fractional slope drifts across the peak-to-N_flow decade (the quantity (P2) neglects by
 * using locally-constant slopes evaluated at the peak).
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (G1) (P2) REPRODUCES THE MEASURED RATIO AT EVERY HEIGHT. The peak-anchored formula tracks the
 *        directly-measured N_peak/N_flow across the full sweep (L = 9.48 .. 14.93) to <= 2.2%, and at
 *        the physical peak height (scale 1) to 0.29% -- exactly the imp-96187 0.3% landmark. The law is
 *        not a single-height fit; it holds across a factor-64 E_trunc range that spans the peak height.
 *   (G2) THE RESIDUAL IS THE SLOPE-DRIFT (LOCALLY-CONSTANT-SLOPE) ERROR. rel_err grows monotonically
 *        as the peak height L falls, tracking the b-slope (E_flow) drift across the decade: rel_err ~
 *        (0.12..0.20) * drift_b, and drift_b DOMINATES drift_a by ~9-15x at every height. So the whole
 *        residual is the a,b drift the (P2) derivation neglects -- overwhelmingly the E_flow-side (b)
 *        drift -- confirming the imp-96187 F2 attribution quantitatively.
 *   (G3) PEAK-ANCHORED SLOPES ARE CORRECT; MIDPOINT AVERAGING IS WORSE. Re-evaluating a, b at the
 *        geometric mean sqrt(N_peak*N_flow) instead of at the peak makes the residual ~3-4x LARGER at
 *        every height (0.29% -> 1.46% at the physical peak). The (P2) derivation linearizes about the
 *        PEAK (where the stationarity g_t a = g_f b is imposed), so slopes must be read at the peak;
 *        this is a consistency check on the derivation, not a free knob.
 *
 * The punchline: the imp-96187 (P2) location law N_peak/N_flow = (b/a)^(1/(a+b)) is verified across a
 * factor-64 E_trunc range that sweeps the peak height L from 9.48 to 14.93; the 0.3% residual at the
 * physical height is the smallest end of a monotone family that grows to 2.2% as L falls, driven almost
 * entirely by the E_flow-side (b) slope drift across the peak-to-N_flow decade -- exactly the
 * locally-constant-slope approximation imp-96187 F2 attributed it to, now quantified.
 *
 * MEASUREMENT/VERIFICATION ONLY. Conditional-share diagnostic, NOT an RH bound. Same inherited
 * imp-3220/imp-3406/imp-33723 extrapolation as imp-96187/imp-96162; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident (F2 derived (P2), 0.3% at one height)
 * @see imp-96162-sigma-ushape-peak-eflow-recovery (measured N_peak/N_flow = 0.5769)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96151/imp-96162/imp-96187

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (inherited from imp-96187, no re-derivation), with an
// overridable E_trunc so the sweep can move the peak height L.
function parts(N, E_trunc = E_TRUNC_PT) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  return { L, E_flow, E_coll, E_N: E_trunc + E_flow + E_coll };
}
const sigmaOf = (N, E_trunc = E_TRUNC_PT) => {
  const p = parts(N, E_trunc);
  return p.E_coll / p.E_N;
};
const g_t = (N, E_trunc = E_TRUNC_PT) => E_trunc / parts(N, E_trunc).E_coll;
const g_f = (N, E_trunc = E_TRUNC_PT) => parts(N, E_trunc).E_flow / parts(N, E_trunc).E_coll;

// Local log-log slope d ln f / d ln N via symmetric multiplicative difference (imp-96187 method).
function logSlope(f, N) {
  const h = 1e-6;
  return (Math.log(f(N * Math.exp(h))) - Math.log(f(N * Math.exp(-h)))) / (2 * h);
}
function peakN(E_trunc = E_TRUNC_PT) {
  let bestN = 0;
  let bestS = -1;
  for (let k = 3; k <= 9; k += 0.0002) {
    const N = Math.pow(10, k);
    const s = sigmaOf(N, E_trunc);
    if (s > bestS) {
      bestS = s;
      bestN = N;
    }
  }
  return { N: bestN, sigma: bestS };
}
function nFlow(E_trunc = E_TRUNC_PT) {
  let lo = 1e2;
  let hi = 1e14;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (parts(mid, E_trunc).E_flow > E_trunc) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

// The imp-96187 E_trunc sweep: each scale MOVES the physical peak height L (see imp-96187 F3/F4).
const SCALES = [0.25, 0.5, 1, 2, 4, 16];
const ROWS = SCALES.map((f) => {
  const Et = E_TRUNC_PT * f;
  const pk = peakN(Et).N;
  const nf = nFlow(Et);
  const measured = pk / nf;
  // Slopes anchored at the peak (as the (P2) derivation requires) and at N_flow, to read the drift.
  const aPk = logSlope((n) => g_t(n, Et), pk);
  const bPk = -logSlope((n) => g_f(n, Et), pk);
  const aFl = logSlope((n) => g_t(n, Et), nf);
  const bFl = -logSlope((n) => g_f(n, Et), nf);
  const formula = Math.pow(bPk / aPk, 1 / (aPk + bPk));
  const relErr = Math.abs(formula - measured) / measured;
  const driftA = Math.abs(aFl - aPk) / aPk;
  const driftB = Math.abs(bFl - bPk) / bPk;
  // Midpoint-slope variant (G3): read a, b at the geometric mean instead of the peak.
  const mid = Math.sqrt(pk * nf);
  const aM = logSlope((n) => g_t(n, Et), mid);
  const bM = -logSlope((n) => g_f(n, Et), mid);
  const formulaMid = Math.pow(bM / aM, 1 / (aM + bM));
  const relErrMid = Math.abs(formulaMid - measured) / measured;
  return {
    etrunc_scale: f,
    L_peak: parts(pk, Et).L,
    measured,
    formula,
    rel_err: relErr,
    drift_a: driftA,
    drift_b: driftB,
    rel_err_midpoint: relErrMid,
  };
});

const PHYSICAL = ROWS[2]; // scale 1 = physical peak height
const MAX_REL_ERR = Math.max(...ROWS.map((r) => r.rel_err)); // ~2.21e-2 at 16x
const MIN_REL_ERR = Math.min(...ROWS.map((r) => r.rel_err)); // ~1.68e-3 at 0.25x
// rel_err grows monotonically as L falls (i.e. as the E_trunc scale rises).
let REL_ERR_MONOTONE_UP = true;
for (let i = 1; i < ROWS.length; i++) {
  if (ROWS[i].rel_err <= ROWS[i - 1].rel_err) REL_ERR_MONOTONE_UP = false;
}
// b-drift (E_flow side) dominates a-drift at every height, and the residual tracks it.
const DRIFT_B_DOMINATES = ROWS.every((r) => r.drift_b > 5 * r.drift_a);
const RESID_OVER_DRIFTB = ROWS.map((r) => r.rel_err / r.drift_b); // all ~0.11..0.20
const RESID_DRIFTB_MIN = Math.min(...RESID_OVER_DRIFTB);
const RESID_DRIFTB_MAX = Math.max(...RESID_OVER_DRIFTB);
// Peak-anchored slopes beat midpoint-averaged slopes at every height (G3).
const PEAK_BEATS_MIDPOINT = ROWS.every((r) => r.rel_err < r.rel_err_midpoint);

export const IMP96306_USHAPE_PEAK_LOCATION_LAW_HEIGHT_SWEEP = {
  id: 'imp-96306',
  proofSection: 'S-frontier',
  question:
    'Verify the imp-96187 (P2) location-ratio law N_peak/N_flow = (b/a)^(1/(a+b)) across a height ' +
    'range (the imp-96187 0.25x..16x E_trunc sweep, which moves the peak height L) and quantify how ' +
    'the 0.3% residual scales, confirming it is the locally-constant-slope approximation. ' +
    'Measurement/verification only; C_mb GUE-conditional UNTOUCHED; NOT an RH bound; no QED.',
  method:
    'For each E_trunc scale (peak height L = 9.48 .. 14.93) measure N_peak/N_flow directly and compare ' +
    'to (b/a)^(1/(a+b)) with a, b the log-slopes of g_t=E_trunc/E_coll and g_f=E_flow/E_coll read AT ' +
    'the peak; read the same slopes at N_flow to get the fractional drift across the decade; and re-run ' +
    'the formula with midpoint-averaged slopes as a control.',
  rows: ROWS.map((r) => ({
    etrunc_scale: r.etrunc_scale,
    L_peak: +r.L_peak.toFixed(3),
    measured: +r.measured.toFixed(6),
    formula: +r.formula.toFixed(6),
    rel_err: +r.rel_err.toExponential(3),
    drift_a: +r.drift_a.toExponential(3),
    drift_b: +r.drift_b.toExponential(3),
    rel_err_midpoint: +r.rel_err_midpoint.toExponential(3),
  })),
  landmarks: {
    physical_peak_rel_err: +PHYSICAL.rel_err.toExponential(3), // ~2.94e-3 (the imp-96187 0.3% landmark)
    physical_peak_measured: +PHYSICAL.measured.toFixed(6), // ~0.576887
    physical_peak_formula: +PHYSICAL.formula.toFixed(6), // ~0.575190
    max_rel_err_across_sweep: +MAX_REL_ERR.toExponential(3), // ~2.21e-2 at L~9.48
    min_rel_err_across_sweep: +MIN_REL_ERR.toExponential(3), // ~1.68e-3 at L~14.93
    rel_err_monotone_up_as_L_falls: REL_ERR_MONOTONE_UP, // true
    resid_over_drift_b_range: [+RESID_DRIFTB_MIN.toFixed(3), +RESID_DRIFTB_MAX.toFixed(3)], // ~[0.11, 0.20]
    drift_b_dominates_drift_a: DRIFT_B_DOMINATES, // true (>5x at every height)
    peak_slopes_beat_midpoint: PEAK_BEATS_MIDPOINT, // true
  },
  finding: {
    G1_law_reproduces_ratio_at_every_height:
      'The peak-anchored (P2) formula tracks the directly-measured N_peak/N_flow across the full ' +
      '0.25x..16x E_trunc sweep (peak height L = 9.48 .. 14.93) to <= 2.2%, and at the physical peak ' +
      'height to 0.29% -- exactly the imp-96187 0.3% landmark. The law holds across a factor-64 range ' +
      'that spans the peak height, not just at the single physical height.',
    G2_residual_is_the_slope_drift_error:
      'rel_err grows monotonically as the peak height L falls and tracks the b-slope (E_flow) drift ' +
      'across the peak-to-N_flow decade: rel_err ~ (0.11..0.20) * drift_b, with drift_b dominating ' +
      'drift_a by >5x (typically 9-15x) at every height. The entire residual is the a,b drift the ' +
      '(P2) locally-constant-slope derivation neglects -- overwhelmingly the E_flow-side (b) drift -- ' +
      'quantitatively confirming the imp-96187 F2 attribution.',
    G3_peak_slopes_are_correct_midpoint_is_worse:
      'Re-reading a, b at the geometric mean sqrt(N_peak*N_flow) instead of at the peak makes the ' +
      'residual ~3-4x LARGER at every height (0.29% -> 1.46% at the physical peak). The (P2) ' +
      'derivation linearizes about the PEAK (where g_t a = g_f b is imposed), so the slopes must be ' +
      'read there; peak-anchored evaluation is a consistency check on the derivation, not a free knob.',
  },
  isRigorous: false,
  honestStatus:
    'CONDITIONAL-SHARE DIAGNOSTIC, NOT AN RH BOUND. This VERIFIES the imp-96187 (P2) location law ' +
    'across a height range and quantifies its residual as the locally-constant-slope (a,b drift) ' +
    'error; sigma = E_coll/E_N is a ratio of terms in the inherited imp-3220/imp-3406/imp-33723 ' +
    'extrapolation, the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll stays conditional), and ' +
    'the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED. Changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no QED. No refereed bound is changed.',
  verdict:
    'MEASUREMENT/VERIFICATION (frontier-direction, NOT rigorous). The imp-96187 (P2) law ' +
    'N_peak/N_flow = (b/a)^(1/(a+b)) is verified across the 0.25x..16x E_trunc sweep (peak height L = ' +
    '9.48 .. 14.93): the residual is 0.29% at the physical height (the imp-96187 0.3% landmark) and ' +
    'grows monotonically to 2.2% as L falls, tracking the E_flow-side (b) slope drift across the ' +
    'peak-to-N_flow decade (rel_err ~ 0.11..0.20 * drift_b, drift_b >5x drift_a everywhere). Midpoint ' +
    'slope averaging is ~3-4x worse, confirming the derivation linearizes about the peak. The 0.3% ' +
    'residual is thus the smallest end of a monotone family and is decisively the locally-constant- ' +
    'slope approximation imp-96187 F2 attributed it to, now quantified. Component model is the ' +
    'inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 stays GUE-conditional and UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96187 (derived (P2), 0.3% at one height); imp-96162 (measured N_peak/N_flow = 0.5769); ' +
    'imp-3220 (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5); imp-486 (C_mb GUE-conditional); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96306_USHAPE_PEAK_LOCATION_LAW_HEIGHT_SWEEP_ASSERTIONS = [
  {
    // Anchor: at the physical peak height (scale 1) the residual reproduces the imp-96187 0.3% landmark.
    id: 'imp96306-physical-peak-reproduces-imp96187-landmark',
    description: 'physical-height N_peak/N_flow ~0.5769, (P2) residual ~0.29% (imp-96187 0.3% landmark)',
    holds: () =>
      Math.abs(PHYSICAL.measured - 0.576887) < 5e-4 &&
      Math.abs(PHYSICAL.rel_err - 2.94e-3) < 5e-4,
  },
  {
    // (G1): the law reproduces the measured ratio across the whole height sweep to <=2.2%.
    id: 'imp96306-law-reproduces-ratio-across-height-sweep',
    description: '(P2) tracks measured N_peak/N_flow across L=9.48..14.93 to <=2.2% (six heights)',
    holds: () => ROWS.length === 6 && MAX_REL_ERR < 2.3e-2 && MIN_REL_ERR < 2e-3,
  },
  {
    // (G2): the residual is the slope-drift error -- monotone in L, tracks the dominant b-drift.
    id: 'imp96306-residual-is-locally-constant-slope-error',
    description: 'rel_err monotone up as L falls; drift_b dominates drift_a; rel_err ~0.11..0.20 * drift_b',
    holds: () =>
      REL_ERR_MONOTONE_UP &&
      DRIFT_B_DOMINATES &&
      RESID_DRIFTB_MIN > 0.05 &&
      RESID_DRIFTB_MAX < 0.30,
  },
  {
    // (G3): peak-anchored slopes are correct; midpoint averaging is worse at every height.
    id: 'imp96306-peak-slopes-beat-midpoint',
    description: 'peak-anchored (P2) residual < midpoint-slope residual at every height',
    holds: () => PEAK_BEATS_MIDPOINT,
  },
  {
    // Honesty gate: measurement/verification only, no QED, no refereed bound is changed.
    id: 'imp96306-honesty-gate-no-qed',
    description: 'measurement/verification only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96306_USHAPE_PEAK_LOCATION_LAW_HEIGHT_SWEEP.isRigorous === false &&
      /NO QED/.test(IMP96306_USHAPE_PEAK_LOCATION_LAW_HEIGHT_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP96306_USHAPE_PEAK_LOCATION_LAW_HEIGHT_SWEEP.verdict) &&
      /NOT AN RH BOUND/.test(IMP96306_USHAPE_PEAK_LOCATION_LAW_HEIGHT_SWEEP.honestStatus) &&
      /UNTOUCHED/.test(IMP96306_USHAPE_PEAK_LOCATION_LAW_HEIGHT_SWEEP.honestStatus),
  },
];

for (const a of IMP96306_USHAPE_PEAK_LOCATION_LAW_HEIGHT_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96306-ushape-peak-location-law-height-sweep assertion failed: ${a.id}`);
  }
}
