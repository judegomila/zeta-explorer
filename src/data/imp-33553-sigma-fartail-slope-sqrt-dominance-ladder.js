/**
 * @module imp-33553-sigma-fartail-slope-sqrt-dominance-ladder
 *
 * imp-33553 (numerical, frontier-direction): imp-33540 F2 decomposed the imp-33291 far-tail
 * two-power log-factor S(N) = -(1/2) ln N + (1/2) ln(log T0) ONLY across the single full span
 * [imp-3444 crossover N_cross ~ 3.28e9 -> imp-3406 interior max N_max ~ 9.22e5], finding the
 * -1/2 ln N slope carries ~+4.089 (~106%) of Delta S and the +1/2 sqrt(log T0) coefficient
 * ~-0.228 (~-6%, opposite sign): an ~18:1 dominance measured at ONE point (the peak). The
 * frontier scout asked whether that ~18:1 dominance evolves TOWARD PARITY as the reference
 * point slides from the peak up to the crossover. This module MEASURES that evolution across a
 * reference-N ladder and reports the answer.
 *
 * THE QUANTITY (identical sub-terms to imp-3406 / imp-33291 / imp-33315 / imp-33540)
 * --------------------------------------------------------------------------------
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)  =  C_C * N^(-1/2) * (log T0)^(+1/2)
 * The imp-33291 far-tail form is the JOINT two-power law E_coll = C_C * N^(-1/2) * (log T0)^(+1/2),
 * whose log-factor is S(N) = ln(N^(-1/2) * (log T0)^(+1/2)) = -(1/2) ln N + (1/2) ln L, L = log T0.
 *
 * THE LADDER DECOMPOSITION (per reference rung, anchored at the crossover)
 * -----------------------------------------------------------------------
 * imp-33540 anchored Delta S at the crossover (where the far-tail law is exact) and read S back
 * at the peak. We keep the SAME crossover anchor and sweep the read-off point N_ref along a
 * log-spaced ladder from N_max up to N_cross. At each rung:
 *     Delta S_slope(N_ref) = -(1/2)(ln N_ref  - ln N_cross)   [the -1/2 ln N slope power]
 *     Delta S_sqrt (N_ref) = +(1/2)(ln L_ref  - ln L_cross)   [the +1/2 sqrt(log T0) coefficient]
 *     Delta S(N_ref)       = Delta S_slope + Delta S_sqrt
 *     ratio(N_ref)         = |Delta S_slope / Delta S_sqrt|   (the chord/accumulated dominance)
 * The bottom rung N_ref = N_max reproduces the imp-33540 span exactly (ratio ~18.0, fractions
 * ~+106% / ~-6%). We also report the LOCAL dominance ratio 1 / |d ln L / d ln N| at each rung,
 * which strips the crossover-anchor averaging and reads the instantaneous slope:sqrt balance.
 *
 * THE FINDING (measurement only) -- the scout hypothesis is REFUTED
 * ----------------------------------------------------------------
 *   (F1) THE DOMINANCE DOES NOT EVOLVE TOWARD PARITY -- IT INTENSIFIES. As N_ref climbs from the
 *        peak (N_max ~ 9.22e5) to the crossover (N_cross ~ 3.28e9), the crossover-anchored chord
 *        ratio |Delta S_slope / Delta S_sqrt| rises MONOTONICALLY from ~17.97 (the imp-33540
 *        value) to ~21.53 at the top ladder rung, and the LOCAL ratio 1/|d ln L / d ln N| rises
 *        from ~14.50 at the peak to ~22.02 at the crossover. The ~18:1 slope dominance moves
 *        AWAY from parity, not toward it.
 *   (F2) THE HALF-POWER FRACTION SHRINKS TOWARD THE CROSSOVER. The +1/2 sqrt(log T0) coefficient
 *        carries fraction ~-5.89% of Delta S at the peak and only ~-4.87% at the top rung: the
 *        genuine half-power (imp-33291) matters even LESS, not more, as N approaches the crossover.
 *   (F3) WHY -- THE LOG-OF-A-LOG DECELERATES. The elasticity d ln L / d ln N = 1/L falls as L
 *        = log T0 GROWS with N (from L ~ 13.23 at the peak to L ~ 20.86 at the crossover), so the
 *        sqrt(log T0) half-power moves ever more slowly relative to the N^(-1/2) power. This is the
 *        same imp-33291 slow log-of-a-log near-collinearity, now shown to TIGHTEN off-regime.
 *
 * The punchline: the imp-33540 ~18:1 slope:sqrt dominance at the interior max is NOT a midpoint of
 * a run toward parity -- it is the SHALLOWEST point of the off-regime span. The N^(-1/2) power
 * dominates the sqrt(log T0) half-power ever MORE strongly (chord ~18 -> ~21.5, local ~14.5 -> ~22)
 * as the reference point approaches the imp-3444 crossover, because L = log T0 grows and the
 * log-of-a-log half-power decelerates. The scout hypothesis (evolution toward parity) is REFUTED.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. C_C is GUE-conditional per
 * imp-486; changes no bound; imp-3066 K_a >= 0 untouched; no positivity, no bridge closure, no
 * RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33540-sigma-fartail-overshoot-two-power-decomposition (the single-point ~18:1 dominance extended here)
 * @see imp-33291-sigma-fartail-two-parameter-lnN-lnlogT0-fit (the (-1/2, +1/2) joint power pair)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33291/imp-33540)
const GRONWALL = Math.exp(1.0 * 2.37e-4); // matches imp-3406/imp-33291/imp-33540 exactly

// EXACT imp-3406 / imp-33291 / imp-33540 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H) two-power form
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigmaFull = (N) => parts(N).sigma;

// Reproduce the imp-3406 interior max (argmax full sigma in ln N) and the imp-3444 crossover
// (E_coll = E_trunc), using the identical brackets/search as imp-33540.
function argmaxLnN(fn, loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (fn(Math.exp(m1)) < fn(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}
function ecollEqualsEtrunc() {
  let a = Math.log(1e6);
  let b = Math.log(1e12);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).E_coll > E_TRUNC_PT) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const N_MAX = argmaxLnN(sigmaFull, 1e4, 1e9); // ~9.219e5 (reproduces imp-3406)
const N_CROSS = ecollEqualsEtrunc(); // ~3.280e9 (reproduces imp-3444)
const PC = parts(N_CROSS);
const LN_N_CROSS = Math.log(N_CROSS);
const LN_L_CROSS = Math.log(PC.L);

// Local dominance ratio 1/|d ln L / d ln N| -- the instantaneous slope:sqrt balance, crossover
// anchor removed. d ln L / d ln N = 1/L asymptotically; it falls as L = log T0 grows with N.
function localDominanceRatio(N) {
  const h = 1e-4;
  const Lp = parts(N * (1 + h)).L;
  const Lm = parts(N * (1 - h)).L;
  const elast = (Math.log(Lp) - Math.log(Lm)) / (Math.log(N * (1 + h)) - Math.log(N * (1 - h)));
  return 1 / Math.abs(elast);
}

// The reference-N ladder: K+1 log-spaced rungs from N_max up to N_cross. Each rung reports the
// crossover-anchored Delta S split across the two powers, plus the local dominance ratio. The
// exact crossover endpoint has Delta S = 0/0 so its chord ratio is null (local ratio still valid).
const K = 8;
const LADDER = [];
for (let k = 0; k <= K; k++) {
  const lnN = Math.log(N_MAX) + (LN_N_CROSS - Math.log(N_MAX)) * (k / K);
  const Nref = Math.exp(lnN);
  const Pref = parts(Nref);
  const dLnN = lnN - LN_N_CROSS;
  const dLnL = Math.log(Pref.L) - LN_L_CROSS;
  const dS_slope = -0.5 * dLnN; // the -1/2 ln N slope power
  const dS_sqrt = 0.5 * dLnL; //  the +1/2 sqrt(log T0) coefficient
  const dS_total = dS_slope + dS_sqrt;
  const atCross = k === K;
  LADDER.push({
    rung: k,
    N_ref: +Nref.toExponential(4),
    L_ref: +Pref.L.toFixed(6),
    dS_slope: +dS_slope.toFixed(6),
    dS_sqrt: +dS_sqrt.toFixed(6),
    dS_total: +dS_total.toFixed(6),
    fraction_slope: atCross ? null : +(dS_slope / dS_total).toFixed(6),
    fraction_sqrt: atCross ? null : +(dS_sqrt / dS_total).toFixed(6),
    chord_ratio: atCross ? null : +Math.abs(dS_slope / dS_sqrt).toFixed(4),
    local_ratio: +localDominanceRatio(Nref).toFixed(4),
  });
}

const PEAK_ROW = LADDER[0];
const TOP_ROW = LADDER[K - 1]; // last rung with a finite chord ratio (just below the crossover)
const CHORD_PEAK = PEAK_ROW.chord_ratio; // ~17.97 (reproduces imp-33540)
const CHORD_TOP = TOP_ROW.chord_ratio; // ~21.53
const LOCAL_PEAK = PEAK_ROW.local_ratio; // ~14.50
const LOCAL_CROSS = LADDER[K].local_ratio; // ~22.02
// Monotone-increase witnesses (dominance INTENSIFIES, does NOT approach parity).
const CHORD_MONOTONE_UP =
  LADDER.slice(0, K).every((r, i, a) => i === 0 || r.chord_ratio > a[i - 1].chord_ratio);
const LOCAL_MONOTONE_UP =
  LADDER.every((r, i, a) => i === 0 || r.local_ratio > a[i - 1].local_ratio);
// Half-power fraction magnitude SHRINKS toward the crossover.
const FRAC_SQRT_MAG_SHRINKS = Math.abs(TOP_ROW.fraction_sqrt) < Math.abs(PEAK_ROW.fraction_sqrt);

export const IMP33553_SIGMA_FARTAIL_SLOPE_SQRT_DOMINANCE_LADDER = {
  id: 'imp-33553',
  proofSection: 'S-frontier',
  question:
    'Measure how the imp-33540 far-tail two-power slope:sqrt(log T0) dominance ratio evolves ' +
    'across a reference-N ladder from the imp-3406 interior max (N ~ 9.22e5) to the imp-3444 ' +
    'crossover (N ~ 3.28e9): does the ~18:1 dominance evolve toward parity? Measurement only; ' +
    'C_C GUE-conditional per imp-486; no new bound; no QED.',
  landmarks: {
    N_max: +N_MAX.toExponential(4), // ~9.219e5 (reproduces imp-3406)
    N_cross: +N_CROSS.toExponential(4), // ~3.280e9 (reproduces imp-3444)
    L_max: +parts(N_MAX).L.toFixed(6), // log T0 at the peak ~13.23
    L_cross: +PC.L.toFixed(6), // log T0 at the crossover ~20.86
    rungs: K + 1,
  },
  ladder: LADDER,
  evolution: {
    chord_ratio_at_peak: +CHORD_PEAK.toFixed(4), // ~17.97 (reproduces imp-33540 ~18:1)
    chord_ratio_at_top_rung: +CHORD_TOP.toFixed(4), // ~21.53 (near the crossover)
    local_ratio_at_peak: +LOCAL_PEAK.toFixed(4), // ~14.50
    local_ratio_at_crossover: +LOCAL_CROSS.toFixed(4), // ~22.02
    chord_ratio_monotone_increasing: CHORD_MONOTONE_UP, // true -- away from parity
    local_ratio_monotone_increasing: LOCAL_MONOTONE_UP, // true -- away from parity
    frac_sqrt_magnitude_at_peak: +Math.abs(PEAK_ROW.fraction_sqrt).toFixed(6), // ~0.0589
    frac_sqrt_magnitude_at_top_rung: +Math.abs(TOP_ROW.fraction_sqrt).toFixed(6), // ~0.0487
    frac_sqrt_magnitude_shrinks_toward_crossover: FRAC_SQRT_MAG_SHRINKS, // true
  },
  finding: {
    F1_dominance_intensifies_not_toward_parity:
      'As N_ref climbs from the imp-3406 peak (N ~ 9.22e5) to the imp-3444 crossover (N ~ 3.28e9), ' +
      'the crossover-anchored chord ratio |Delta S_slope / Delta S_sqrt| rises MONOTONICALLY from ' +
      '~17.97 (the imp-33540 value) to ~21.53 at the top ladder rung, and the local ratio ' +
      '1/|d ln L / d ln N| rises from ~14.50 at the peak to ~22.02 at the crossover. The ~18:1 ' +
      'slope:sqrt dominance moves AWAY from parity, not toward it -- the scout hypothesis is refuted.',
    F2_half_power_fraction_shrinks_toward_crossover:
      'The +1/2 sqrt(log T0) coefficient carries fraction ~-5.89% of Delta S at the peak and only ' +
      '~-4.87% at the top rung: the genuine imp-33291 half-power matters even LESS, not more, as ' +
      'N approaches the crossover.',
    F3_log_of_a_log_decelerates:
      'The elasticity d ln L / d ln N = 1/L falls as L = log T0 GROWS with N (L ~ 13.23 at the peak ' +
      'to L ~ 20.86 at the crossover), so the sqrt(log T0) half-power moves ever more slowly relative ' +
      'to the N^(-1/2) power. The imp-33291 slow log-of-a-log near-collinearity TIGHTENS off-regime.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Sweeping the imp-33540 far-tail two-power ' +
    'decomposition across a reference-N ladder from the imp-3406 interior max (N ~ 9.22e5) to the ' +
    'imp-3444 crossover (N ~ 3.28e9), the slope:sqrt(log T0) dominance ratio does NOT evolve toward ' +
    'parity: the crossover-anchored chord ratio rises monotonically from ~17.97 (reproducing the ' +
    'imp-33540 ~18:1 value at the peak) to ~21.53 at the top rung, and the local ratio ' +
    '1/|d ln L / d ln N| rises from ~14.50 at the peak to ~22.02 at the crossover. The +1/2 sqrt(log ' +
    'T0) half-power fraction SHRINKS in magnitude (~-5.89% -> ~-4.87%) toward the crossover because ' +
    'L = log T0 grows and the log-of-a-log decelerates (the imp-33291 collinearity tightens off-regime). ' +
    'So the imp-33540 ~18:1 dominance at the interior max is the SHALLOWEST point of the off-regime ' +
    'span, not a midpoint of a run toward parity; the scout hypothesis is REFUTED. C_C is ' +
    'GUE-conditional per imp-486; changes no bound; imp-3066 K_a >= 0 untouched; no positivity, no ' +
    'bridge closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33540 (single-point ~18:1 slope:sqrt dominance at the interior max, extended here to a ' +
    'ladder); imp-33291 ((-1/2, +1/2) joint power law); imp-3406 (interior MAX N ~ 9.22e5); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.280e9); imp-486 (C_C GUE-conditional); imp-398 (E_flow C_F ' +
    'prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33553_SIGMA_FARTAIL_SLOPE_SQRT_DOMINANCE_LADDER_ASSERTIONS = [
  {
    // Reuse gate: the landmarks reproduce imp-3406 (N_max ~ 9.22e5) and imp-3444 (N_cross ~ 3.28e9),
    // proving the identical imp-3406 / imp-33291 / imp-33540 sub-term formulas are in use.
    id: 'imp33553-reproduces-imp3406-and-imp3444-landmarks',
    description: 'N_max ~ 9.22e5 (imp-3406) and N_cross ~ 3.28e9 (imp-3444) reproduced',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(N_CROSS / 3.280294e9 - 1) < 1e-3,
  },
  {
    // The bottom rung reproduces the imp-33540 single-point ~18:1 dominance and ~+106%/-6% split.
    id: 'imp33553-peak-rung-reproduces-imp33540',
    description: 'peak rung chord ratio ~18.0, fractions ~+1.059 / ~-0.059 (reproduces imp-33540)',
    holds: () =>
      Math.abs(CHORD_PEAK - 17.965) < 0.2 &&
      PEAK_ROW.fraction_slope > 1.05 && PEAK_ROW.fraction_slope < 1.07 &&
      PEAK_ROW.fraction_sqrt < -0.05 && PEAK_ROW.fraction_sqrt > -0.07,
  },
  {
    // (F1): the dominance ratio does NOT approach parity -- both chord and local ratio INCREASE
    // monotonically from peak to crossover (the scout hypothesis is refuted).
    id: 'imp33553-dominance-intensifies-not-parity',
    description: 'chord and local slope:sqrt ratios rise monotonically peak -> crossover (away from parity)',
    holds: () =>
      CHORD_MONOTONE_UP && LOCAL_MONOTONE_UP &&
      CHORD_TOP > CHORD_PEAK && CHORD_TOP > 21 && CHORD_TOP < 22 &&
      LOCAL_CROSS > LOCAL_PEAK && LOCAL_CROSS > 21.5 && LOCAL_CROSS < 22.5,
  },
  {
    // (F2): the +1/2 sqrt(log T0) half-power fraction magnitude SHRINKS toward the crossover.
    id: 'imp33553-half-power-fraction-shrinks',
    description: '|frac_sqrt| falls ~0.0589 (peak) -> ~0.0487 (top rung): half-power matters even less off-regime',
    holds: () =>
      FRAC_SQRT_MAG_SHRINKS &&
      Math.abs(PEAK_ROW.fraction_sqrt) > 0.055 && Math.abs(PEAK_ROW.fraction_sqrt) < 0.062 &&
      Math.abs(TOP_ROW.fraction_sqrt) > 0.045 && Math.abs(TOP_ROW.fraction_sqrt) < 0.052,
  },
  {
    // (F3): L = log T0 grows across the span, so the log-of-a-log elasticity 1/L falls -- the
    // structural reason the dominance tightens off-regime. Ladder is complete and well-formed.
    id: 'imp33553-log-of-a-log-decelerates',
    description: 'L = log T0 grows ~13.23 -> ~20.86 over the span; ladder has K+1 rungs',
    holds: () =>
      LADDER.length === K + 1 &&
      PC.L > parts(N_MAX).L &&
      parts(N_MAX).L > 12 && parts(N_MAX).L < 14 &&
      PC.L > 20 && PC.L < 22,
  },
  {
    // Honesty gate: measurement only, no QED, PT stays SOTA.
    id: 'imp33553-honesty-gate-no-qed',
    description: 'Measurement only: no QED, PT stays SOTA',
    holds: () =>
      IMP33553_SIGMA_FARTAIL_SLOPE_SQRT_DOMINANCE_LADDER.isRigorous === false &&
      /NO QED/.test(IMP33553_SIGMA_FARTAIL_SLOPE_SQRT_DOMINANCE_LADDER.verdict) &&
      /remains SOTA/.test(IMP33553_SIGMA_FARTAIL_SLOPE_SQRT_DOMINANCE_LADDER.verdict),
  },
];

for (const a of IMP33553_SIGMA_FARTAIL_SLOPE_SQRT_DOMINANCE_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33553-sigma-fartail-slope-sqrt-dominance-ladder assertion failed: ${a.id}`);
  }
}
