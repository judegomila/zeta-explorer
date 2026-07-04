/**
 * @module imp-33582-sigma-postpeak-nearpeak-threshold-decay
 *
 * imp-33582 (numerical, frontier-direction): the imp-3406 reconciliation reports the
 * E(N)-bridge conditional share sigma(N) = E_coll(N)/E(N) has an INTERIOR MAXIMUM at
 * N ~ 9.22e5 (sigma_max ~ 0.9494), with the 10^6 PATH-1 ceiling landing ~2.1e-5 below it
 * on the downslope, and states sigma "decays monotonically toward 0 past the peak as the
 * constant truncation floor E_trunc outlives the vanishing GUE-conditional E_coll" -- but
 * it never QUANTIFIES that near-peak decay: how fast the conditional share actually shrinks
 * once you leave the 10^6 ceiling, or at what N it crosses stated thresholds. imp-33274
 * measured the FAR tail (window START slid decades past the imp-3444 crossover N ~ 3.28e9,
 * where the local exponent has already ramped near 1/2); this module fills the complementary
 * NEAR-PEAK gap on a finer post-peak grid N in {1e6..1e12}, log-spaced.
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-3529 / imp-33255 / imp-33274)
 * ------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * No re-derivation, no fresh model: the exact inherited imp-3406 sub-terms.
 *
 * THE MEASUREMENT: near-peak decay rate + threshold crossings
 * -----------------------------------------------------------
 *   (a) Locate the interior peak N_peak by sign-of-derivative bisection (reproduces the
 *       imp-3406 N ~ 9.22e5 / sigma_max ~ 0.9494 landmark) and confirm the 10^6 ceiling
 *       lands ~2.1e-5 below it on the downslope.
 *   (b) PER-DECADE LOCAL EXPONENT ladder p_dec = -slope of OLS(ln sigma vs ln N) over each
 *       successive decade window [10^k, 10^(k+1)] for k = 6..11 (4 points/decade), measuring
 *       how the effective decay exponent RAMPS up past the peak.
 *   (c) THRESHOLD CROSSINGS: the N at which sigma first drops below 0.9, 0.5, 0.1 (bisection
 *       on the downslope, N > N_peak).
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE NEAR-PEAK DECAY IS SLOW AND RAMPS. Just past the peak the conditional share is
 *        nearly flat: the first decade [1e6,1e7] has local exponent only ~0.0105 (sigma
 *        0.9494 -> 0.9266). The exponent then climbs MONOTONELY decade by decade:
 *        ~0.0105 -> ~0.0447 -> ~0.1176 -> ~0.2360 -> ~0.3561 -> ~0.4310, approaching the
 *        imp-3463 far-tail 1/2 from below. So sigma does NOT decay at a fixed rate past the
 *        peak -- the constant E_trunc floor only slowly overtakes the sqrt(1/N) E_coll, and
 *        the decay accelerates smoothly across six decades.
 *   (F2) THRESHOLDS CROSSED LATE. sigma stays above 0.9 until N ~ 2.57e7 (>1.4 decades past
 *        the 10^6 ceiling), above 0.5 until N ~ 3.27e9, and above 0.1 until N ~ 3.21e11. So
 *        the empirical-vs-analytic conditional gap shrinks only gradually: the share is still
 *        ~0.95 at the 10^6 ceiling and takes ~3.4 decades to halve.
 *   (F3) THE 0.5 CROSSING COINCIDES WITH THE imp-3444 CROSSOVER. sigma = 1/2 lands at
 *        N ~ 3.27e9, matching the imp-3444 E_coll = E_trunc crossover N ~ 3.280e9 to ~0.4%:
 *        where the dominant collapse term equals the truncation floor (E_flow negligible),
 *        the conditional share is exactly half -- an independent consistency check that the
 *        near-peak grid and the far-tail crossover ladder share one model.
 *
 * The punchline: the imp-3406 prose "decays monotonically toward 0 past the peak" is now
 * quantified as a smoothly RAMPING decay -- local exponent ~0.01 just past the 9.22e5 peak,
 * climbing to ~0.43 by 1e12 toward the imp-3463 1/2 -- with the share holding above 0.9 out
 * to N ~ 2.57e7 and halving only at the imp-3444 crossover N ~ 3.27e9. The empirical gap the
 * 10^6 ceiling left open shrinks gradually, not abruptly.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33274-sigma-postpeak-later-window-decay-exponent (FAR-tail sliding window, p_eff -> 1/2)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm)
 * @see imp-3529-sigma-postpeak-decay-exponent (LOCAL pointwise exponent p(N))
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-3529/imp-33274)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-3529/imp-33274 exactly

// EXACT imp-3406/imp-3529/imp-33274 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Interior peak: sign-of-derivative bisection in log N (reproduces imp-3406 N ~ 9.22e5).
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
const N_PEAK = locatePeak(); // ~9.218633e5
const SIGMA_MAX = sigma(N_PEAK); // ~0.949429
const SIGMA_AT_1E6 = sigma(1e6); // ~0.949408 -- ~2.1e-5 below the peak on the downslope

// OLS local decay exponent p = -slope of ln sigma on ln N over [loN, hiN] (4 pts/decade).
function olsExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
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
  const slope = sxy / sxx;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = my - slope * mx + slope * xs[i];
    ssRes += (ys[i] - pred) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  return { p: -slope, R2: 1 - ssRes / ssTot, nPoints: n };
}

// (F1) Per-decade local exponent ladder past the peak: k = 6..11, [10^k, 10^(k+1)].
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote
const PER_DECADE_LADDER = [6, 7, 8, 9, 10, 11].map((k) => {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const f = olsExponent(lo, hi);
  return {
    decade: `1e${k}->1e${k + 1}`,
    p_local: +f.p.toFixed(4),
    sigmaLo: +sigma(lo).toFixed(4),
    sigmaHi: +sigma(hi).toFixed(4),
  };
});

// (F2)/(F3) Threshold crossings on the downslope (N > N_peak): first N with sigma below thr.
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
const N_CROSS_0_9 = crossBelow(0.9); // ~2.57e7
const N_CROSS_0_5 = crossBelow(0.5); // ~3.27e9 (~imp-3444 crossover)
const N_CROSS_0_1 = crossBelow(0.1); // ~3.21e11
const IMP3444_CROSSOVER = 3.280294e9; // imp-3444 E_coll = E_trunc landmark

export const IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY = {
  id: 'imp-33582',
  proofSection: 'S-frontier',
  question:
    'Re-derive the imp-3406 sigma(N) = E_coll/E(N) post-peak decay on a finer extrapolation ' +
    'grid beyond the 10^6 PATH-1 ceiling (N in {1e6..1e12}, log-spaced) and quantify how fast ' +
    'the conditional share shrinks past its interior maximum (N ~ 9.22e5, sigma_max ~ 0.9494): ' +
    'the per-decade local decay exponent and the N at which sigma drops below 0.9, 0.5, 0.1. ' +
    'Measurement/fit only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'p_local = -slope of OLS(ln sigma on ln N) over each decade [10^k,10^(k+1)] for k=6..11 ' +
    '(4 points/decade); plus the downslope N at which sigma first drops below 0.9, 0.5, 0.1',
  peak: {
    N_peak: +N_PEAK.toExponential(6), // ~9.218633e5 (imp-3406)
    sigma_max: +SIGMA_MAX.toFixed(6), // ~0.949429
    sigma_at_1e6: +SIGMA_AT_1E6.toFixed(6), // ~0.949408
    ceilingBelowPeak: +(SIGMA_MAX - SIGMA_AT_1E6).toExponential(3), // ~2.14e-5
  },
  farTailExponent: HALF, // imp-3463 asymptote the per-decade ladder ramps toward
  perDecadeLadder: PER_DECADE_LADDER,
  thresholdCrossings: {
    sigma_below_0_9_at_N: +N_CROSS_0_9.toExponential(4), // ~2.57e7
    sigma_below_0_5_at_N: +N_CROSS_0_5.toExponential(4), // ~3.27e9
    sigma_below_0_1_at_N: +N_CROSS_0_1.toExponential(4), // ~3.21e11
    half_crossing_vs_imp3444: +(N_CROSS_0_5 / IMP3444_CROSSOVER).toFixed(4), // ~1.00
  },
  finding: {
    F1_near_peak_decay_ramps:
      'Just past the peak the share is nearly flat -- the first decade [1e6,1e7] has local ' +
      'exponent only ~0.0105 (sigma 0.9494 -> 0.9266) -- then the exponent climbs monotonely ' +
      'decade by decade: ~0.0105 -> ~0.0447 -> ~0.1176 -> ~0.2360 -> ~0.3561 -> ~0.4310, ' +
      'approaching the imp-3463 far-tail 1/2 from below. The decay is not fixed-rate: the ' +
      'constant E_trunc floor only slowly overtakes the sqrt(1/N) E_coll, so it accelerates.',
    F2_thresholds_crossed_late:
      'sigma stays above 0.9 until N ~ 2.57e7 (>1.4 decades past the 10^6 ceiling), above 0.5 ' +
      'until N ~ 3.27e9, and above 0.1 until N ~ 3.21e11. The share is still ~0.95 at the 10^6 ' +
      'ceiling and takes ~3.4 decades to halve -- the empirical-vs-analytic gap shrinks gradually.',
    F3_half_crossing_matches_imp3444:
      'sigma = 1/2 lands at N ~ 3.27e9, matching the imp-3444 E_coll = E_trunc crossover ' +
      'N ~ 3.280e9 to ~0.4%: where the collapse term equals the truncation floor (E_flow ' +
      'negligible) the conditional share is exactly half -- an independent consistency check ' +
      'that the finer near-peak grid and the imp-3444 far-tail ladder share one model.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Re-deriving the imp-3406 sigma(N) ' +
    'post-peak decay on a finer grid past the 10^6 ceiling (interior peak reproduced at ' +
    'N ~ 9.219e5, sigma_max ~ 0.9494, the 10^6 ceiling ~2.14e-5 below on the downslope): the ' +
    'per-decade local exponent RAMPS monotonely from ~0.0105 [1e6,1e7] to ~0.4310 [1e11,1e12] ' +
    'toward the imp-3463 far-tail 1/2, so sigma decays slowly and acceleratingly rather than at ' +
    'a fixed rate. The share holds above 0.9 out to N ~ 2.57e7, halves only at N ~ 3.27e9 ' +
    '(matching the imp-3444 E_coll = E_trunc crossover ~3.280e9 to ~0.4%), and drops below 0.1 ' +
    'at N ~ 3.21e11. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33274 (FAR-tail sliding-window p_eff -> 1/2); imp-3406 (interior MAX N ~ 9.22e5, ' +
    'monotone decay-to-0 right arm); imp-3529 (LOCAL pointwise exponent p(N)); imp-3463 ' +
    '(far-tail leading form, exponent -> 1/2 from below); imp-3444 (E_coll = E_trunc crossover ' +
    'N ~ 3.280e9); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY_ASSERTIONS = [
  {
    // Reuse gate: the peak reproduces the imp-3406 N ~ 9.22e5 / sigma_max ~ 0.9494 landmark
    // and the 10^6 ceiling lands ~2.1e-5 below it -- proving the identical model is in use.
    id: 'imp33582-reproduces-imp3406-peak',
    description: 'peak N ~ 9.22e5, sigma_max ~ 0.9494, 10^6 ceiling ~2.1e-5 below on the downslope',
    holds: () =>
      Math.abs(N_PEAK / 9.22e5 - 1) < 5e-3 &&
      Math.abs(SIGMA_MAX - 0.9494) < 5e-4 &&
      SIGMA_AT_1E6 < SIGMA_MAX &&
      Math.abs(SIGMA_MAX - SIGMA_AT_1E6 - 2.1e-5) < 5e-6,
  },
  {
    // (F1): the per-decade local exponent climbs monotonely past the peak, starting near-flat
    // (<0.02 in the first decade) and staying strictly below the imp-3463 far-tail 1/2.
    id: 'imp33582-local-exponent-ramps-toward-half',
    description: 'per-decade p_local strictly increases, first decade < 0.02, all in (0, 0.5)',
    holds: () => {
      for (let i = 1; i < PER_DECADE_LADDER.length; i++) {
        if (!(PER_DECADE_LADDER[i].p_local > PER_DECADE_LADDER[i - 1].p_local)) return false;
      }
      return (
        PER_DECADE_LADDER[0].p_local < 0.02 &&
        PER_DECADE_LADDER.every((r) => r.p_local > 0 && r.p_local < HALF)
      );
    },
  },
  {
    // (F2): threshold crossings ordered and land in the measured decades, all past the peak.
    id: 'imp33582-thresholds-ordered-and-late',
    description: 'sigma<0.9 ~2.57e7, sigma<0.5 ~3.27e9, sigma<0.1 ~3.21e11; ordered, all > N_peak',
    holds: () =>
      N_CROSS_0_9 > N_PEAK &&
      N_CROSS_0_9 < N_CROSS_0_5 &&
      N_CROSS_0_5 < N_CROSS_0_1 &&
      Math.abs(N_CROSS_0_9 / 2.57e7 - 1) < 5e-2 &&
      Math.abs(N_CROSS_0_1 / 3.21e11 - 1) < 5e-2,
  },
  {
    // (F3): the sigma = 1/2 crossing coincides with the imp-3444 E_coll = E_trunc crossover.
    id: 'imp33582-half-crossing-matches-imp3444',
    description: 'sigma = 1/2 lands at N ~ 3.27e9, within 1% of the imp-3444 crossover ~3.280e9',
    holds: () => Math.abs(N_CROSS_0_5 / IMP3444_CROSSOVER - 1) < 1e-2,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, PT SOTA.
    id: 'imp33582-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, PT stays SOTA',
    holds: () =>
      IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.isRigorous === false &&
      IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.farTailExponent === 0.5 &&
      /NO QED/.test(IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.verdict) &&
      /remains SOTA/.test(IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY.verdict),
  },
];

for (const a of IMP33582_SIGMA_POSTPEAK_NEARPEAK_THRESHOLD_DECAY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33582-sigma-postpeak-nearpeak-threshold-decay assertion failed: ${a.id}`);
  }
}
