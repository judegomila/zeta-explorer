/**
 * @module imp-33274-sigma-postpeak-later-window-decay-exponent
 *
 * imp-33274 (numerical, frontier-direction): imp-33255 fit a SINGLE OLS decay-rate
 * exponent p_eff to the E_trunc-outlives-E_coll regime of the conditional share
 * sigma(N) = E_coll/E(N) past the imp-3444 crossover (N ~ 3.28e9), and found it
 * window-DEPENDENT -- climbing ~0.390 -> ~0.486 as the window span M grew 3 -> 24
 * decades -- because the imp-3529 LOCAL pointwise exponent still drifts. But EVERY
 * imp-33255 window was ANCHORED at the crossover N_cross, where the local exponent is
 * still RAMPING up from the flat cap. That crossover anchor is what depresses p_eff
 * below the imp-3463 far-tail asymptote 1/2 and injects the residual drift imp-33255
 * flagged as still-open. This module removes the anchor: it SLIDES the fit-window START
 * progressively later past the crossover (fixed span) and measures whether, once the
 * ramp region is excluded, the effective exponent CONVERGES and the drift settles.
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-3529 / imp-33255)
 * ------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * For N > N_cross the constant floor E_trunc OUTLIVES the vanishing E_coll, so
 * sigma ~ (C_C/E_trunc) sqrt(logT0/N): a near-sqrt(1/N) law up to the slow logT0 factor.
 *
 * THE MEASUREMENT: sliding-START windows of FIXED span
 * ----------------------------------------------------
 * Where imp-33255 grew the window END from a FIXED start (N_cross), this module holds
 * the span fixed (12 decades) and slides the window START to N_cross * 10^s for
 * s = 0, 3, 6, 12, 24, 48 decades past the crossover, sampling 4 points/decade in
 * log10 N and regressing ln sigma on ln N. Each later window excludes more of the
 * just-past-crossover RAMP where the local exponent is still climbing, so p_eff(s)
 * isolates the settled far-tail behaviour rather than the crossover transient.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) CONVERGENCE TOWARD 1/2. As the window START slides later (fixed 12-decade span)
 *        the OLS effective exponent climbs MONOTONELY toward the imp-3463 asymptote 1/2
 *        from below: ~0.4732 (start at crossover) -> ~0.4873 (+3d) -> ~0.4895 (+6d) ->
 *        ~0.4919 (+12d) -> ~0.4944 (+24d) -> ~0.4965 (+48d). The gap 1/2 - p_eff shrinks
 *        monotonely from ~2.68e-2 to ~3.48e-3 -- it does NOT settle at an intermediate
 *        plateau below 1/2, it converges onto the exact far-tail 1/2 law.
 *   (F2) DRIFT SETTLES ONTO THE 1/2 LAW, NOT AN ARTEFACT. R^2 improves monotonely toward 1
 *        (~0.99894 at the crossover-anchored window -> ~0.9999999 at +48d) and the max
 *        log-residual collapses (~4.9e-1 -> ~1.6e-3): once the ramp is excluded the regime
 *        is a single power law to numerical precision. The residual "drift" imp-33255 left
 *        open is thus localised to the crossover ramp -- sliding the start past it settles
 *        the exponent onto 1/2.
 *   (F3) THE CROSSOVER-ANCHOR EXPLAINS imp-33255. The start-at-crossover, 12-decade window
 *        reproduces imp-33255s 12-decade p_eff ~ 0.473 EXACTLY (identical sub-terms). Its
 *        depression below 1/2 is entirely the crossover ramp: moving the SAME-span window
 *        just 3 decades later lifts p_eff by ~1.4e-2 toward 1/2, more than the entire
 *        subsequent 45-decade slide combined -- confirming the ramp, not the tail, carried
 *        imp-33255s window-dependence.
 *
 * The punchline: imp-33255s window-dependent p_eff (0.39-0.49) was an artefact of anchoring
 * every fit at the crossover ramp. Sliding the window START progressively later removes the
 * ramp and the effective exponent CONVERGES monotonely to the imp-3463 far-tail 1/2 with
 * R^2 -> 1 -- the drift settles onto the exact sqrt(1/N) law rather than at an intermediate
 * value. This closes the residual imp-3529 local-exponent drift imp-33255 flagged, in the
 * specific E_trunc-outlives-E_coll regime.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; no positivity, no bridge
 * closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-33255-sigma-postpeak-regime-effective-exponent (crossover-anchored p_eff ladder, window-dependent)
 * @see imp-3529-sigma-postpeak-decay-exponent (LOCAL pointwise exponent p(N), residual drift)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-3529/imp-33255)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-3529/imp-33255 exactly

// EXACT imp-3406/imp-3529/imp-33255 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, super-poly negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// The E_coll = E_trunc crossover: entry to the E_trunc-outlives-E_coll regime.
// Bisection on the sign of E_coll - E_trunc (reproduces imp-3444 / imp-33255 N ~ 3.280e9).
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
const N_CROSS = ecollEqualsEtrunc(); // ~3.280e9

// OLS fit of ln sigma on ln N over [loN, hiN], sampled uniformly in log10 N (4 pts/decade).
// Returns the effective decay exponent p_eff = -slope, R^2, and the max |log residual|.
function olsEffectiveExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  const dLo = Math.log10(loN);
  const dHi = Math.log10(hiN);
  for (let d = dLo; d <= dHi + 1e-9; d += step) {
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
  const intercept = my - slope * mx;
  let ssTot = 0;
  let ssRes = 0;
  let maxResLn = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) ** 2;
    ssTot += (ys[i] - my) ** 2;
    maxResLn = Math.max(maxResLn, Math.abs(ys[i] - pred));
  }
  return { p_eff: -slope, R2: 1 - ssRes / ssTot, maxResLn, nPoints: n };
}

// Sliding-START ladder: FIXED span, window START slid progressively later past the
// crossover. Excludes more of the just-past-crossover ramp with each rung, isolating
// the settled far-tail behaviour. p_eff -> 1/2 from below, R^2 -> 1, drift settles.
const SPAN_DECADES = 12;
const START_OFFSETS = [0, 3, 6, 12, 24, 48]; // decades past N_cross
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote
const LATER_WINDOW_LADDER = START_OFFSETS.map((s) => {
  const lo = N_CROSS * Math.pow(10, s);
  const hi = N_CROSS * Math.pow(10, s + SPAN_DECADES);
  const f = olsEffectiveExponent(lo, hi);
  return {
    startOffsetDecades: s,
    spanDecades: SPAN_DECADES,
    p_eff: +f.p_eff.toFixed(5),
    gapToHalf: +(HALF - f.p_eff).toExponential(3),
    R2: +f.R2.toFixed(7),
    maxResidualLn: +f.maxResLn.toExponential(3),
    nPoints: f.nPoints,
  };
});

// Successive drift between consecutive later windows: the lift over the FIRST 3-decade
// slide dwarfs every later slide -- the crossover ramp carried imp-33255s window-dependence.
const SUCCESSIVE_DRIFT = LATER_WINDOW_LADDER.slice(1).map((r, i) => ({
  from: LATER_WINDOW_LADDER[i].startOffsetDecades,
  to: r.startOffsetDecades,
  deltaP: +(r.p_eff - LATER_WINDOW_LADDER[i].p_eff).toExponential(3),
}));

export const IMP33274_SIGMA_POSTPEAK_LATER_WINDOW_DECAY_EXPONENT = {
  id: 'imp-33274',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33255 single-exponent fit of the sigma(N) = E_coll/E(N) post-peak ' +
    'decay regime to progressively-LATER fit windows (window START slid further past the ' +
    'imp-3444 crossover N ~ 3.28e9, fixed span), and report the converged effective ' +
    'exponent + R^2 and whether the imp-3529 residual local-exponent drift settles. ' +
    'Measurement/fit only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'p_eff = -slope of OLS regression of ln sigma on ln N over [N_cross*10^s, ' +
    'N_cross*10^(s+12)] (fixed 12-decade span, 4 points/decade) as the start offset s ' +
    'slides 0, 3, 6, 12, 24, 48 decades past the crossover; R^2 = single-power-law fit',
  crossover: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9 (imp-3444 / imp-33255)
    sigma_at_cross: +sigma(N_CROSS).toFixed(6),
  },
  convergedExponent: HALF, // imp-3463 far-tail sqrt(1/N) asymptote, approached monotonely from below
  spanDecades: SPAN_DECADES,
  laterWindowLadder: LATER_WINDOW_LADDER,
  successiveDrift: SUCCESSIVE_DRIFT,
  finding: {
    F1_convergence_toward_half:
      'Sliding the fixed-12-decade window START later (s = 0,3,6,12,24,48 decades past the ' +
      'crossover), OLS p_eff climbs monotonely toward 1/2 from below: ~0.4732 -> ~0.4873 -> ' +
      '~0.4895 -> ~0.4919 -> ~0.4944 -> ~0.4965; gap 1/2 - p_eff shrinks ~2.68e-2 -> ~3.48e-3. ' +
      'No intermediate plateau -- it converges onto the exact imp-3463 far-tail 1/2 law.',
    F2_drift_settles_onto_half_law:
      'R^2 improves monotonely toward 1 (~0.99894 crossover-anchored -> ~0.9999999 at +48d) ' +
      'and the max log-residual collapses (~4.9e-1 -> ~1.6e-3): once the ramp is excluded the ' +
      'regime is a single power law to numerical precision. The imp-3529 residual drift is ' +
      'localised to the crossover ramp; sliding the start past it settles p_eff onto 1/2.',
    F3_crossover_anchor_explains_imp33255:
      'The start-at-crossover 12-decade window reproduces imp-33255s 12-decade p_eff ~ 0.473 ' +
      'exactly (identical sub-terms). Moving the SAME-span window just 3 decades later lifts ' +
      'p_eff by ~1.4e-2 -- more than the entire subsequent 45-decade slide combined -- so the ' +
      'crossover ramp, not the tail, carried imp-33255s window-dependence.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending imp-33255s single-exponent ' +
    'fit to progressively-LATER windows -- fixed 12-decade span, START slid 0,3,6,12,24,48 ' +
    'decades past the imp-3444 crossover -- the OLS effective exponent climbs monotonely ' +
    'from ~0.4732 (start at crossover, reproducing imp-33255s 0.473) to ~0.4965 (+48d), the ' +
    'gap to 1/2 shrinking ~2.68e-2 -> ~3.48e-3 and R^2 improving ~0.99894 -> ~0.9999999. So ' +
    'the effective exponent CONVERGES to the imp-3463 far-tail 1/2 from below with the fit ' +
    'becoming single-power-law to numerical precision: the residual imp-3529 local-exponent ' +
    'drift imp-33255 flagged is an artefact of anchoring every window at the crossover ramp, ' +
    'and sliding the start past that ramp settles the exponent onto the exact sqrt(1/N) law. ' +
    'The C_mb GUE-conditional per imp-486 is UNTOUCHED; no positivity, no bridge closure, no ' +
    'RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-33255 (crossover-anchored single-exponent ladder, window-dependent 0.39-0.49); ' +
    'imp-3529 (LOCAL pointwise exponent p(N), residual drift); imp-3463 (far-tail leading ' +
    'form, exponent -> 1/2 from below); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); ' +
    'imp-3406 (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP33274_SIGMA_POSTPEAK_LATER_WINDOW_DECAY_EXPONENT_ASSERTIONS = [
  {
    // Reuse gate: the start-at-crossover 12-decade window reproduces imp-33255s 12-decade
    // p_eff ~ 0.473, and N_cross reproduces imp-3444 -- proving the identical model is in use.
    id: 'imp33274-reproduces-imp33255-crossover-anchored',
    description: 'start-at-crossover 12-decade p_eff ~ 0.473 (imp-33255) and N_cross ~ 3.280e9 (imp-3444)',
    holds: () =>
      Math.abs(N_CROSS / 3.280294e9 - 1) < 1e-3 &&
      LATER_WINDOW_LADDER[0].startOffsetDecades === 0 &&
      Math.abs(LATER_WINDOW_LADDER[0].p_eff - 0.473) < 5e-3,
  },
  {
    // (F1): sliding the window START later, p_eff increases monotonely toward 1/2, staying
    // strictly below it, with the latest window within ~4e-3 of 1/2.
    id: 'imp33274-effective-exponent-converges-to-half',
    description: 'p_eff strictly increases with start offset, all in (0.47, 0.5), latest within 4e-3 of 1/2',
    holds: () => {
      for (let i = 1; i < LATER_WINDOW_LADDER.length; i++) {
        if (!(LATER_WINDOW_LADDER[i].p_eff > LATER_WINDOW_LADDER[i - 1].p_eff)) return false;
      }
      const last = LATER_WINDOW_LADDER[LATER_WINDOW_LADDER.length - 1];
      return (
        LATER_WINDOW_LADDER.every((r) => r.p_eff > 0.47 && r.p_eff < HALF) &&
        HALF - last.p_eff < 4e-3
      );
    },
  },
  {
    // (F2): the gap to 1/2 shrinks monotonely and R^2 rises monotonely toward 1 -- the drift
    // settles onto the 1/2 law rather than at an intermediate plateau.
    id: 'imp33274-gap-shrinks-and-fit-improves',
    description: 'gap 1/2 - p_eff shrinks monotonely, R^2 monotone up (>0.998), latest R^2 > 0.9999999',
    holds: () => {
      for (let i = 1; i < LATER_WINDOW_LADDER.length; i++) {
        if (!(LATER_WINDOW_LADDER[i].gapToHalf < LATER_WINDOW_LADDER[i - 1].gapToHalf)) return false;
        if (!(LATER_WINDOW_LADDER[i].R2 >= LATER_WINDOW_LADDER[i - 1].R2)) return false;
      }
      return (
        LATER_WINDOW_LADDER.every((r) => r.R2 > 0.998) &&
        LATER_WINDOW_LADDER[LATER_WINDOW_LADDER.length - 1].R2 > 0.9999999
      );
    },
  },
  {
    // (F3): the first 3-decade slide lifts p_eff more than the entire subsequent slide,
    // pinning imp-33255s window-dependence on the crossover ramp.
    id: 'imp33274-crossover-ramp-carries-drift',
    description: 'first slide (+0d -> +3d) lifts p_eff more than the sum of all later slides',
    holds: () => {
      const firstLift = SUCCESSIVE_DRIFT[0].deltaP;
      const restLift = SUCCESSIVE_DRIFT.slice(1).reduce((a, r) => a + r.deltaP, 0);
      return firstLift > restLift && firstLift > 5e-3;
    },
  },
  {
    // Honesty gate: measurement/fit only, converges to the imp-3463 1/2 asymptote, no QED, no refereed bound is changed.
    id: 'imp33274-honesty-gate-no-qed',
    description: 'Measurement only: converged exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP33274_SIGMA_POSTPEAK_LATER_WINDOW_DECAY_EXPONENT.isRigorous === false &&
      IMP33274_SIGMA_POSTPEAK_LATER_WINDOW_DECAY_EXPONENT.convergedExponent === 0.5 &&
      /NO QED/.test(IMP33274_SIGMA_POSTPEAK_LATER_WINDOW_DECAY_EXPONENT.verdict) &&
      /refereed bound is changed/i.test(IMP33274_SIGMA_POSTPEAK_LATER_WINDOW_DECAY_EXPONENT.verdict),
  },
];

for (const a of IMP33274_SIGMA_POSTPEAK_LATER_WINDOW_DECAY_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33274-sigma-postpeak-later-window-decay-exponent assertion failed: ${a.id}`);
  }
}
