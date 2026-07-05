/**
 * @module imp-34028-sigma-postpeak-ramp-crossover-scale
 *
 * imp-34028 (numerical, frontier-direction): imp-3406 established that the
 * GUE-conditional share sigma(N) = E_coll/E(N) has an interior MAXIMUM at
 * N_max ~ 9.219e5 (sigma_max ~ 0.9494) and then decays monotonically to 0, driven
 * entirely by the constant truncation floor E_trunc outliving the vanishing E_coll.
 * imp-3406 reported the DIRECTION of that decay but never fit its RATE, and every
 * subsequent decay-rate fit (imp-3529 local pointwise exponent, imp-33255 / imp-33274
 * OLS effective exponent) ANCHORED at or past the imp-3444 crossover N_x ~ 3.28e9 --
 * roughly 3.5 decades LATER than the interior peak. The immediate post-peak arm, from
 * N_max out THROUGH the crossover, was never characterised, and the crossover was never
 * quantified as a decay SCALE (imp-3444/imp-3556/imp-3580 pin it only as a landmark
 * where sigma = 1/2). This module fills that gap: it measures the LOCAL decay exponent
 * p(N) = -d ln sigma / d ln N right from the peak, fits an effective power law across
 * the peak-to-crossover arm, and asks whether the floor sets a characteristic N-scale.
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-3529 / imp-33274)
 * ------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * As N -> inf, E_coll ~ sqrt(log T0 / N) and E_flow decays super-polynomially, but
 * E_trunc is a CONSTANT floor, so sigma -> E_coll/E_trunc -> 0 with leading exponent 1/2.
 *
 * THE MEASUREMENT
 * ---------------
 *   (1) Local decay exponent p(N) = -d ln sigma / d ln N by symmetric log-space central
 *       difference (step 1e-4 in ln N), sampled from the peak out to the far tail.
 *   (2) An OLS effective exponent over the full peak-to-crossover arm [N_max, N_x],
 *       8 points/decade, to test whether that arm is a single power law.
 *   (3) The crossover scale N_x = root of E_coll(N) = E_trunc (bisection in ln N), the
 *       odds ratio E_coll/E_trunc there, sigma(N_x), and p(N_x); plus the closed-form
 *       identity N_x = (C_C/E_trunc)^2 * log T0(N_x) that fixes the scale from the floor.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE POST-PEAK ARM IS A DECAY RAMP, NOT A SETTLED POWER LAW. From the interior
 *        peak N_max ~ 9.219e5 -- where p = -d ln sigma / d ln N = 0 by definition
 *        (~1.3e-10 numerically, the maximum) -- the local exponent rises MONOTONELY
 *        toward the imp-3463 far-tail 1/2: p ~ 0.010 (1e6.5) -> 0.073 (1e8) -> 0.171
 *        (1e9) -> 0.301 (1e10) -> 0.402 (1e11) -> 0.453 (1e12) -> 0.484 (1e15). A single
 *        OLS power law over the WHOLE peak-to-crossover arm [N_max, N_x] gives p_eff
 *        ~ 0.069 with R^2 ~ 0.842 and max log-residual ~0.174 -- a POOR fit, so the arm
 *        is a curved RAMP, NOT the settled sqrt(1/N) law the past-crossover windows show
 *        (imp-33274 reaches R^2 -> 1). The decay RATE is not constant on this arm.
 *   (F2) THE E_trunc CROSSOVER SETS THE CHARACTERISTIC N-SCALE. E_trunc outliving the
 *        vanishing E_coll fixes a single characteristic crossover scale N_x ~ 3.280e9
 *        (log10 ~ 9.516), the root of E_coll(N_x) = E_trunc (odds ratio E_coll/E_trunc
 *        = 1.000000000, reproducing imp-3444/imp-3556). There sigma = 0.499526 (the
 *        imp-3556 half-decay coincidence) and p(N_x) ~ 0.238 -- the arm is HALF-WAY up
 *        the ramp to the far-tail 1/2. Because log T0 varies slowly, the crossover
 *        satisfies N_x = (C_C/E_trunc)^2 * log T0(N_x) to a ratio of 1.000000, so the
 *        scale is fixed by the floor as N_x ~ (C_C/E_trunc)^2 log T0 -- it scales ~ 1/E_trunc^2.
 *   (F3) THE CROSSOVER SEPARATES RAMP FROM SETTLED LAW. Below N_x the local exponent is
 *        still ramping (p < 0.24); above N_x it settles toward 1/2 (imp-33274, R^2 -> 1).
 *        So the E_trunc crossover N_x is the characteristic scale DIVIDING the curved
 *        peak-to-crossover ramp from the far-tail sqrt(1/N) decay -- the constant floor
 *        outliving the vanishing GUE-conditional collision term BOTH forces the turnover
 *        (imp-3406) AND sets the scale at which the decay assumes its asymptotic character.
 *
 * The punchline: the immediate post-peak decay of sigma(N) is a curved RAMP -- the local
 * exponent climbs from 0 at the peak through ~0.238 at the E_trunc crossover N_x ~ 3.28e9
 * on toward the imp-3463 far-tail 1/2 -- so no single power law fits the peak-to-crossover
 * arm (OLS R^2 ~ 0.84). The crossover N_x, set purely by the floor via N_x = (C_C/E_trunc)^2
 * log T0, is the characteristic N-scale that divides that ramp from the settled sqrt(1/N) tail.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the inherited imp-3220/imp-3406 component
 * model is NOT a rigorous asymptotic; changes no bound; no positivity, no bridge closure,
 * no RH claim, imp-3066 K_a >= 0 untouched, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm; direction only)
 * @see imp-3529-sigma-postpeak-decay-exponent (LOCAL pointwise exponent p(N), anchored past crossover)
 * @see imp-33274-sigma-postpeak-later-window-decay-exponent (past-crossover OLS exponent -> 1/2, R^2 -> 1)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N_x ~ 3.280e9)
 * @see imp-3556 / imp-3580-sigma-crossover-floor-invariance (sigma = 1/2 <=> E_coll = E_trunc, floor-invariant)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
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
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, super-poly negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Interior MAX of sigma(N): ternary search in ln N (reproduces imp-3406 N_max ~ 9.219e5).
function interiorMax() {
  let lo = Math.log(1e4);
  let hi = Math.log(1e8);
  for (let i = 0; i < 400; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigma(Math.exp(m1)) < sigma(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}
const N_MAX = interiorMax(); // ~9.219e5

// The E_coll = E_trunc crossover: bisection on sign(E_coll - E_trunc). Reproduces imp-3444.
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
const N_CROSS = ecollEqualsEtrunc(); // ~3.280294e9

// Local decay exponent p(N) = -d ln sigma / d ln N via symmetric log-space central difference.
function localExponent(N, h = 1e-4) {
  const l = Math.log(N);
  const sp = Math.log(sigma(Math.exp(l + h)));
  const sm = Math.log(sigma(Math.exp(l - h)));
  return -(sp - sm) / (2 * h);
}

// OLS fit of ln sigma on ln N over [loN, hiN], sampled uniformly in log10 N.
// Returns effective exponent p_eff = -slope, R^2, and max |log residual|.
function olsEffectiveExponent(loN, hiN, ptsPerDecade = 8) {
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

const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote

// The local-exponent RAMP: p(N) climbing from ~0 at the peak toward 1/2 far out.
const RAMP_LOG10N = [
  Math.log10(N_MAX),
  6.5,
  7.0,
  7.5,
  8.0,
  8.5,
  Math.log10(N_CROSS),
  10.0,
  11.0,
  12.0,
  15.0,
  20.0,
];
const RAMP_LADDER = RAMP_LOG10N.map((d) => {
  const N = Math.pow(10, d);
  return {
    log10N: +d.toFixed(4),
    sigma: +sigma(N).toExponential(4),
    pLocal: +localExponent(N).toFixed(5),
    ecollOverEtrunc: +(parts(N).E_coll / E_TRUNC_PT).toFixed(4),
  };
});

// OLS over the peak-to-crossover arm: a POOR single-power-law fit (the arm is a ramp).
const ARM_FIT = olsEffectiveExponent(N_MAX, N_CROSS);

// Closed-form crossover scale: N_x = (C_C/E_trunc)^2 * log T0(N_x) (floor sets the scale).
const N_CROSS_CLOSED_FORM = (C_C_PINNED / E_TRUNC_PT) ** 2 * parts(N_CROSS).L;

export const IMP34028_SIGMA_POSTPEAK_RAMP_CROSSOVER_SCALE = {
  id: 'imp-34028',
  proofSection: 'S-frontier',
  question:
    'Fit the post-peak DECAY RATE of the GUE-conditional share sigma(N) = E_coll/E(N) past ' +
    'its interior maximum N_max ~ 9.22e5 (imp-3406), and identify whether the constant ' +
    'truncation floor E_trunc outliving the vanishing E_coll sets a characteristic crossover ' +
    'N-scale. Measurement/fit only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'local decay exponent p(N) = -d ln sigma / d ln N (log-space central difference) sampled ' +
    'from the peak outward; OLS effective exponent p_eff = -slope of ln sigma on ln N over the ' +
    'peak-to-crossover arm [N_max, N_cross]; and the crossover scale N_cross = root of ' +
    'E_coll = E_trunc with the odds ratio, sigma, p there and the closed-form N_cross identity',
  interiorMax: {
    N_max: +N_MAX.toExponential(6), // ~9.218633e5 (imp-3406)
    log10_N_max: +Math.log10(N_MAX).toFixed(4), // ~5.9647
    sigma_max: +sigma(N_MAX).toFixed(6), // ~0.949429
    pLocal_at_max: +localExponent(N_MAX).toExponential(3), // ~0 (maximum, by definition)
  },
  crossoverScale: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9 (imp-3444)
    log10_N_cross: +Math.log10(N_CROSS).toFixed(4), // ~9.5159
    oddsRatio_ecoll_over_etrunc: +(parts(N_CROSS).E_coll / E_TRUNC_PT).toFixed(9), // 1.000000000
    sigma_at_cross: +sigma(N_CROSS).toFixed(6), // ~0.499526 (imp-3556 half-decay)
    pLocal_at_cross: +localExponent(N_CROSS).toFixed(5), // ~0.23806 (half-way up the ramp to 1/2)
    N_cross_closedForm: +N_CROSS_CLOSED_FORM.toExponential(6), // (C_C/E_trunc)^2 * log T0(N_cross)
    closedFormRatio: +(N_CROSS_CLOSED_FORM / N_CROSS).toFixed(6), // ~1.000000 (floor fixes the scale)
  },
  fartailExponent: HALF, // imp-3463 sqrt(1/N) asymptote, approached from below
  rampLadder: RAMP_LADDER,
  armFit: {
    window: 'peak-to-crossover [N_max, N_cross]',
    p_eff: +ARM_FIT.p_eff.toFixed(5), // ~0.06882 -- low, the arm is not a settled power law
    R2: +ARM_FIT.R2.toFixed(4), // ~0.8425 -- POOR single-power-law fit (ramp, not power law)
    maxResidualLn: +ARM_FIT.maxResLn.toExponential(3), // ~1.740e-1
    nPoints: ARM_FIT.nPoints,
  },
  finding: {
    F1_postpeak_arm_is_a_ramp:
      'From the interior peak N_max ~ 9.22e5 (where p = -d ln sigma / d ln N = 0 by ' +
      'definition, ~1.3e-10 numerically) the local exponent rises MONOTONELY toward the ' +
      'imp-3463 far-tail 1/2: p ~ 0.010 (1e6.5) -> 0.073 (1e8) -> 0.171 (1e9) -> 0.301 ' +
      '(1e10) -> 0.402 (1e11) -> 0.453 (1e12) -> 0.484 (1e15). A single OLS power law over ' +
      'the whole peak-to-crossover arm gives p_eff ~ 0.069, R^2 ~ 0.842, max log-residual ' +
      '~0.174 -- a POOR fit, so the arm is a curved RAMP, not the settled sqrt(1/N) law the ' +
      'past-crossover windows show (imp-33274, R^2 -> 1). The decay rate is not constant here.',
    F2_etrunc_sets_characteristic_scale:
      'E_trunc outliving the vanishing E_coll fixes a single characteristic crossover scale ' +
      'N_cross ~ 3.280e9 (log10 ~ 9.516), the root of E_coll = E_trunc (odds ratio ' +
      '1.000000000, reproducing imp-3444/imp-3556). There sigma = 0.499526 (imp-3556 ' +
      'half-decay) and p(N_cross) ~ 0.238 -- half-way up the ramp to 1/2. Because log T0 ' +
      'varies slowly the crossover satisfies N_cross = (C_C/E_trunc)^2 log T0(N_cross) to a ' +
      'ratio of 1.000000, so the scale is fixed by the floor as N_cross ~ (C_C/E_trunc)^2 ' +
      'log T0 -- it scales ~ 1/E_trunc^2.',
    F3_crossover_divides_ramp_from_settled_law:
      'Below N_cross the local exponent is still ramping (p < 0.24); above N_cross it settles ' +
      'toward 1/2 (imp-33274, R^2 -> 1). The E_trunc crossover N_cross is thus the ' +
      'characteristic scale dividing the curved peak-to-crossover ramp from the far-tail ' +
      'sqrt(1/N) decay: the constant floor outliving the vanishing GUE-conditional collision ' +
      'term BOTH forces the turnover (imp-3406) AND sets the scale at which the decay ' +
      'assumes its asymptotic character.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Fitting the post-peak decay of sigma(N) ' +
    'right from the interior maximum N_max ~ 9.22e5 (imp-3406): the local exponent p(N) = ' +
    '-d ln sigma / d ln N climbs MONOTONELY from 0 at the peak through ~0.238 at the E_trunc ' +
    'crossover N_cross ~ 3.28e9 on toward the imp-3463 far-tail 1/2, so a single OLS power law ' +
    'over the peak-to-crossover arm is a POOR fit (p_eff ~ 0.069, R^2 ~ 0.842) -- the arm is a ' +
    'curved RAMP, not a settled law. The constant truncation floor E_trunc outliving the ' +
    'vanishing E_coll DOES set a characteristic crossover N-scale N_cross ~ 3.280e9, the root ' +
    'of E_coll = E_trunc (odds ratio 1.000000000, reproducing imp-3444/imp-3556), fixed by the ' +
    'floor via N_cross = (C_C/E_trunc)^2 log T0 (ratio 1.000000, so ~ 1/E_trunc^2) and dividing ' +
    'the ramp from the far-tail sqrt(1/N) tail (imp-33274). The inherited imp-3220/imp-3406 ' +
    'component model is NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; no positivity, no bridge closure, no RH claim, imp-3066 ' +
    'K_a >= 0 untouched, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-3406 (interior MAX N ~ 9.22e5, monotone decay-to-0, DIRECTION only); imp-3529 (LOCAL ' +
    'pointwise exponent, anchored past crossover); imp-33274/imp-33255 (past-crossover OLS ' +
    'exponent -> 1/2, R^2 -> 1); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); imp-3556/' +
    'imp-3580 (sigma = 1/2 <=> E_coll = E_trunc, floor-invariant); imp-3463 (far-tail 1/2 from ' +
    'below); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'polymath15-constant-C-C; lambda-rh-height-mapping.',
};

export const IMP34028_SIGMA_POSTPEAK_RAMP_CROSSOVER_SCALE_ASSERTIONS = [
  {
    // Reuse gate: N_max reproduces imp-3406 (~9.22e5) and N_cross reproduces imp-3444 (~3.280e9),
    // proving the identical inherited sub-term model is in use (no fresh model).
    id: 'imp34028-reproduces-imp3406-peak-and-imp3444-crossover',
    description: 'N_max ~ 9.22e5 (imp-3406) and N_cross ~ 3.280294e9 (imp-3444); sigma_max ~ 0.9494',
    holds: () =>
      Math.abs(N_MAX / 9.219e5 - 1) < 5e-3 &&
      Math.abs(N_CROSS / 3.280294e9 - 1) < 1e-3 &&
      Math.abs(sigma(N_MAX) - 0.949429) < 1e-4,
  },
  {
    // (F1): the local exponent vanishes at the peak (a maximum) and rises MONOTONELY along the
    // ramp toward 1/2, staying strictly below it, with the far point within ~2e-2 of 1/2.
    id: 'imp34028-local-exponent-ramps-from-zero-toward-half',
    description: 'p(N_max) ~ 0; p(N) strictly increases along the ladder; all in [0, 1/2); far point within 2e-2 of 1/2',
    holds: () => {
      if (Math.abs(localExponent(N_MAX)) > 1e-6) return false;
      for (let i = 1; i < RAMP_LADDER.length; i++) {
        if (!(RAMP_LADDER[i].pLocal > RAMP_LADDER[i - 1].pLocal)) return false;
      }
      const last = RAMP_LADDER[RAMP_LADDER.length - 1];
      return (
        RAMP_LADDER.every((r) => r.pLocal >= 0 && r.pLocal < HALF) && HALF - last.pLocal < 2e-2
      );
    },
  },
  {
    // (F1): the peak-to-crossover arm is a POOR single power law (R^2 well below the
    // past-crossover R^2 -> 1), confirming it is a curved ramp rather than a settled law.
    id: 'imp34028-peak-to-crossover-arm-is-not-a-power-law',
    description: 'OLS over [N_max, N_cross]: p_eff low (<0.2) and R^2 poor (<0.95), a ramp not a power law',
    holds: () => ARM_FIT.p_eff > 0 && ARM_FIT.p_eff < 0.2 && ARM_FIT.R2 < 0.95 && ARM_FIT.maxResLn > 0.05,
  },
  {
    // (F2): the crossover scale is set by the floor -- odds ratio E_coll/E_trunc = 1 there, and
    // the closed-form N_cross = (C_C/E_trunc)^2 log T0(N_cross) reproduces N_cross to 1e-4.
    id: 'imp34028-crossover-scale-set-by-floor',
    description: 'odds ratio E_coll/E_trunc = 1 at N_cross; closed-form (C_C/E_trunc)^2 log T0 reproduces N_cross',
    holds: () =>
      Math.abs(parts(N_CROSS).E_coll / E_TRUNC_PT - 1) < 1e-6 &&
      Math.abs(N_CROSS_CLOSED_FORM / N_CROSS - 1) < 1e-4 &&
      Math.abs(sigma(N_CROSS) - 0.5) < 1e-3,
  },
  {
    // (F2/F3): the crossover sits HALF-WAY up the ramp -- p(N_cross) is a genuine intermediate
    // value between the peak (0) and the far-tail 1/2, dividing ramp from settled law.
    id: 'imp34028-crossover-is-halfway-up-the-ramp',
    description: 'p(N_cross) is intermediate (~0.238), strictly between 0 and 1/2',
    holds: () => {
      const p = localExponent(N_CROSS);
      return p > 0.15 && p < 0.35 && Math.abs(p - 0.238) < 0.02;
    },
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = imp-3463 1/2, no QED, PT SOTA.
    id: 'imp34028-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, fartail exponent 1/2 (imp-3463), no QED, PT stays SOTA',
    holds: () =>
      IMP34028_SIGMA_POSTPEAK_RAMP_CROSSOVER_SCALE.isRigorous === false &&
      IMP34028_SIGMA_POSTPEAK_RAMP_CROSSOVER_SCALE.fartailExponent === 0.5 &&
      /NO QED/.test(IMP34028_SIGMA_POSTPEAK_RAMP_CROSSOVER_SCALE.verdict) &&
      /remains SOTA/.test(IMP34028_SIGMA_POSTPEAK_RAMP_CROSSOVER_SCALE.verdict),
  },
];

for (const a of IMP34028_SIGMA_POSTPEAK_RAMP_CROSSOVER_SCALE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34028-sigma-postpeak-ramp-crossover-scale assertion failed: ${a.id}`);
  }
}
