/**
 * @module imp-3577-sigma-deep-threshold-crossings
 *
 * imp-3577 (numerical, frontier-direction): imp-3556 root-solved the six post-peak
 * conditional-share threshold crossings (sigma(N) = E_coll/E(N) first below
 * 0.9, 0.75, 0.5, 0.25, 0.1, 0.01) and derived the cancellation-free ODDS-RATIO
 * spacing law N = K logT0(N) ((1-sigma)/sigma)^2, K = (C_C_PINNED/E_trunc)^2 =
 * 1.5727e8, matching the exact roots with relative error equal to the neglected
 * E_flow term (24.6% at sigma=0.9 shrinking to 1e-4% at sigma=0.01). imp-3556 then
 * ASSERTED, without extending the ladder, that this E_flow error keeps shrinking
 * "to machine level on the far tail". This module CLOSES that gap by pushing the
 * exact bisection root-solve two decades of sigma DEEPER, to sigma = 1e-3 and
 * sigma = 1e-4, on the identical imp-3220/imp-3406/imp-3463 sub-terms, solving the
 * closed-form logT0(N) self-consistency by fixed point, and CERTIFYING that (i) the
 * E_flow relative error continues its monotone decay toward machine level and
 * (ii) the far-tail p -> 1/2 sqrt(1/N) steepening (imp-3463) governs the spacing.
 *
 * THE QUANTITY (identical to imp-3220 / imp-3406 / imp-3463 / imp-3529 / imp-3556)
 * ------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * Same C_C_PINNED = (1/8) sqrt(3 pi), same Gronwall = exp(2.37e-4). No re-derivation.
 *
 * (A) DEEP ROOT-SOLVED CROSSINGS (400-iter bisection in ln N; residual < 1e-9)
 * --------------------------------------------------------------------------
 *   sigma<0.01  at N = 4.624381e13   (log10 N = 13.6651,  p = 0.47909,  E_coll/E_trunc = 1.010e-2)
 *   sigma<1e-3  at N = 5.432330e15   (log10 N = 15.7350,  p = 0.48551,  E_coll/E_trunc = 1.001e-3)
 *   sigma<1e-4  at N = 6.164882e17   (log10 N = 17.7899,  p = 0.48754,  E_coll/E_trunc = 1.000e-4)
 * The sigma=0.01 row reproduces imp-3556 exactly; the two deep rows extend the ladder.
 *
 * (B) E_flow RELATIVE ERROR CONTINUES ITS MONOTONE DECAY TOWARD MACHINE LEVEL
 * --------------------------------------------------------------------------
 * The odds-ratio closed form N = K logT0(N) ((1-sigma)/sigma)^2 neglects only E_flow.
 * Its relative error vs the exact root keeps shrinking, tracking E_flow/E_trunc:
 *   sigma=0.01  rel_err = 8.793e-5 %   (E_flow/E_trunc = 4.255e-7)
 *   sigma=1e-3  rel_err = 1.165e-6 %   (E_flow/E_trunc = 5.660e-9)
 *   sigma=1e-4  rel_err = 1.507e-8 %   (E_flow/E_trunc = 7.348e-11)
 * Each deeper threshold drops the error by ~two orders (E_flow ~ logT0/T0 collapses as
 * T0 climbs past 1e13 -> 1e17), confirming the imp-3556 far-tail machine-level claim.
 *
 * (C) FAR-TAIL SPACING GOVERNED BY p -> 1/2 (imp-3463 sqrt(1/N) STEEPENING)
 * ------------------------------------------------------------------------
 * With E_flow negligible the odds ratio (1-sigma)/sigma -> 1/sigma, so the spacing law
 * gives N ~ K logT0 / sigma^2: one decade of sigma costs ~TWO decades of N. Measured
 * spacings 0.01->1e-3->1e-4 are 2.070 and 2.055 decades of N per decade of sigma, and
 * the local decay exponent p = -d ln sigma/d ln N climbs 0.4791 -> 0.4855 -> 0.4875,
 * approaching the imp-3463 far-tail value 1/2 from below. Confirmed structural.
 *
 * THE FINDING (measurement / certification only)
 * ----------------------------------------------
 *   (G1) The two deep crossings sigma<1e-3 (N=5.432e15) and sigma<1e-4 (N=6.165e17),
 *        root-solved to residual < 1e-9 on the exact sub-terms, extend the imp-3556
 *        ladder monotonically and reproduce its sigma=0.01 crossing exactly.
 *   (G2) The odds-ratio closed-form rel_err continues its monotone decay: 8.79e-5% ->
 *        1.16e-6% -> 1.51e-8% (sigma = 0.01 -> 1e-3 -> 1e-4), tracking E_flow/E_trunc
 *        toward machine level -- the imp-3556 far-tail claim now CERTIFIED two decades
 *        of sigma deeper.
 *   (G3) The far-tail spacing is governed by p -> 1/2: one decade of sigma spans ~2.06
 *        decades of N and the local exponent climbs 0.4791 -> 0.4855 -> 0.4875 toward
 *        the imp-3463 sqrt(1/N) value 1/2.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian
 * Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-3556-sigma-threshold-crossings-rootsolve (six shallower crossings, odds-ratio law)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form sigma ~ (C_C/E_trunc) sqrt(logT0/N), p -> 1/2)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX, monotone decay-to-0 right arm)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N), exact sub-terms)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3556)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3463/imp-3556 exactly

// EXACT imp-3556 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// (A) ROOT-SOLVE the deep post-peak crossing where sigma first drops below the target
// level (400-iter bisection in ln N; sigma is strictly decreasing on the right arm, so
// the bracket [1e6, 1e80] contains exactly one crossing for these deep levels). Certified
// root: the residual |sigma(N_cross) - level| lands at machine epsilon.
function deepCrossing(target) {
  let a = Math.log(1e6);
  let b = Math.log(1e80);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Local decay exponent p(N) = -d ln sigma/d ln N (central difference), approaching the
// imp-3463 far-tail value 1/2 from below on the deep tail.
function localDecayExponent(N) {
  const h = 1e-4;
  const lnN = Math.log(N);
  return -(Math.log(sigma(Math.exp(lnN + h))) - Math.log(sigma(Math.exp(lnN - h)))) / (2 * h);
}

// (C) THE ODDS-RATIO CLOSED FORM (imp-3556): N = K logT0(N) ((1-sigma)/sigma)^2,
//     K = (C_C_PINNED/E_trunc)^2. Solved as a fixed point on log T0(N). The relative
//     error vs the exact root IS the neglected E_flow -- it must keep shrinking here.
const K_ODDS = (C_C_PINNED / E_TRUNC_PT) ** 2; // 1.572709e8
function closedFormCrossing(s) {
  const r = ((1 - s) / s) ** 2;
  let N = K_ODDS * r * Math.log(1e9);
  for (let i = 0; i < 120; i++) N = K_ODDS * r * Math.log(effectiveHeightForN(N));
  return N;
}

// Ladder including the imp-3556 sigma=0.01 anchor plus the two DEEP thresholds.
const LEVELS = [0.01, 1e-3, 1e-4];
const CROSSINGS = LEVELS.map((level) => {
  const N = deepCrossing(level);
  const p = parts(N);
  const closedN = closedFormCrossing(level);
  return {
    sigma_below: level,
    N: +N.toExponential(6),
    log10N: +Math.log10(N).toFixed(4),
    p_local: +localDecayExponent(N).toFixed(5),
    E_coll_over_E_trunc: +(p.E_coll / E_TRUNC_PT).toExponential(4),
    E_flow_over_E_trunc: +(p.E_flow / E_TRUNC_PT).toExponential(4),
    N_closed_form: +closedN.toExponential(6),
    rel_err_pct: +((closedN / N - 1) * 100).toExponential(4), // = neglected E_flow
    residual: +Math.abs(sigma(N) - level).toExponential(2), // certified root: ~machine eps
  };
});

// (C) Far-tail decade spacing: one decade of sigma costs ~2 decades of N as p -> 1/2.
const DECADE_SPACINGS = [];
for (let i = 1; i < CROSSINGS.length; i++) {
  const dLog10N = CROSSINGS[i].log10N - CROSSINGS[i - 1].log10N;
  const dLog10Sigma = Math.log10(CROSSINGS[i - 1].sigma_below) - Math.log10(CROSSINGS[i].sigma_below);
  DECADE_SPACINGS.push({
    from: CROSSINGS[i - 1].sigma_below,
    to: CROSSINGS[i].sigma_below,
    delta_log10N: +dLog10N.toFixed(4),
    decades_N_per_decade_sigma: +(dLog10N / dLog10Sigma).toFixed(4),
  });
}

export const IMP3577_SIGMA_DEEP_THRESHOLD_CROSSINGS = {
  id: 'imp-3577',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-3556 odds-ratio crossing law N=K logT0 ((1-sigma)/sigma)^2 to the ' +
    'DEEP conditional-share thresholds sigma=1e-3 and sigma=1e-4, and certify the neglected ' +
    'E_flow relative error keeps shrinking toward machine level on the far tail. ' +
    'Measurement/certification only; conditional-share diagnostic, NOT an RH bound; no QED.',
  quantity: 'sigma(N) = E_coll/(E_trunc+E_flow+E_coll); deep crossings root-solved by bisection in ln N',
  K: +K_ODDS.toExponential(6), // 1.572709e8 (identical to imp-3556)
  deepCrossings: CROSSINGS,
  farTailSpacing: DECADE_SPACINGS,
  finding: {
    G1_deep_roots:
      'The two deep crossings sigma<1e-3 (N=5.432e15) and sigma<1e-4 (N=6.165e17), ' +
      'root-solved to residual < 1e-9 on the exact sub-terms, extend the imp-3556 ladder ' +
      'monotonically and reproduce its sigma=0.01 crossing (N=4.624e13) exactly.',
    G2_eflow_error_keeps_shrinking:
      'The odds-ratio closed-form rel_err continues its monotone decay: 8.79e-5% -> 1.16e-6% ' +
      '-> 1.51e-8% (sigma=0.01 -> 1e-3 -> 1e-4), tracking E_flow/E_trunc toward machine ' +
      'level -- the imp-3556 far-tail claim now CERTIFIED two decades of sigma deeper.',
    G3_p_to_half_spacing:
      'The far-tail spacing is governed by p -> 1/2: one decade of sigma spans ~2.06 decades ' +
      'of N and the local exponent climbs 0.4791 -> 0.4855 -> 0.4875 toward the imp-3463 ' +
      'sqrt(1/N) value 1/2.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/CERTIFICATION (frontier-direction, NOT rigorous). The imp-3556 post-peak ' +
    'crossing ladder is EXTENDED two decades of sigma deeper: sigma<1e-3 at N=5.432330e15 and ' +
    'sigma<1e-4 at N=6.164882e17, root-solved to residual < 1e-9 on the exact imp-3220/imp-3406/' +
    'imp-3463 sub-terms (the sigma=0.01 anchor N=4.624381e13 reproduced exactly). The odds-ratio ' +
    'closed form N=K logT0(N) ((1-sigma)/sigma)^2 with K=(C_C/E_trunc)^2=1.573e8, solved by ' +
    'fixed point, matches the deep exact roots with relative error equal to the neglected E_flow ' +
    'that CONTINUES its monotone decay toward machine level: 8.79e-5% at sigma=0.01, 1.16e-6% at ' +
    '1e-3, 1.51e-8% at 1e-4 (tracking E_flow/E_trunc = 4.26e-7 -> 5.66e-9 -> 7.35e-11 as ' +
    'E_flow ~ logT0/T0 collapses past T0=1e13 -> 1e17) -- confirming the imp-3556 far-tail claim. ' +
    'The far-tail spacing is governed by the imp-3463 p -> 1/2 sqrt(1/N) steepening: one decade of ' +
    'sigma spans ~2.06 decades of N (measured 2.070, 2.055) and the local decay exponent climbs ' +
    '0.4791 -> 0.4855 -> 0.4875 toward 1/2. Measurement/certification only; no positivity, no ' +
    'bridge closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a>=0 positivity ' +
    'UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-3556 (six shallower crossings, odds-ratio spacing law, K=(C_C/E_trunc)^2); imp-3463 ' +
    '(far-tail sqrt(logT0/N) leading form, p -> 1/2); imp-3444 (E_coll=E_trunc crossover); ' +
    'imp-3406 (interior MAX, monotone right arm); imp-3220 (U-shaped sigma(N) exact sub-terms); ' +
    'imp-2642 (C_H=1/8 ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip ' +
    'route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3577_SIGMA_DEEP_THRESHOLD_CROSSINGS_ASSERTIONS = [
  {
    // (G1) The deep crossings are CERTIFIED roots (residual < 1e-9) and extend the imp-3556
    // ladder monotonically in N (sigma strictly decreasing on the right arm).
    id: 'imp3577-deep-crossings-root-solved-and-monotone',
    description: 'sigma<0.01, 1e-3, 1e-4 root-solved to residual < 1e-9 and monotone increasing in N',
    holds: () => {
      for (const c of CROSSINGS) if (!(c.residual < 1e-9)) return false;
      for (let i = 1; i < CROSSINGS.length; i++) {
        if (!(CROSSINGS[i].N > CROSSINGS[i - 1].N)) return false;
      }
      return true;
    },
  },
  {
    // (G1) The sigma=0.01 anchor reproduces the imp-3556 crossing, and the two deep crossings
    // land at the certified N ~ 5.43e15 (1e-3) and ~ 6.16e17 (1e-4).
    id: 'imp3577-anchors-and-deep-values',
    description: 'sigma=0.01 anchor matches imp-3556 (4.624e13); deep crossings at ~5.43e15 and ~6.16e17',
    holds: () => {
      const at = (lvl) => CROSSINGS.find((c) => c.sigma_below === lvl).N;
      return (
        Math.abs(at(0.01) / 4.624381e13 - 1) < 1e-4 &&
        Math.abs(at(1e-3) / 5.432330e15 - 1) < 1e-4 &&
        Math.abs(at(1e-4) / 6.164882e17 - 1) < 1e-4
      );
    },
  },
  {
    // (G2) The odds-ratio closed-form rel_err CONTINUES its monotone decay toward machine level
    // on the deep tail (each deeper threshold drops the error by ~two orders).
    id: 'imp3577-eflow-error-keeps-shrinking',
    description: 'closed-form rel_err strictly decreases 8.79e-5% -> 1.16e-6% -> 1.51e-8% toward machine level',
    holds: () => {
      const errs = CROSSINGS.map((c) => Math.abs(c.rel_err_pct));
      for (let i = 1; i < errs.length; i++) if (!(errs[i] < errs[i - 1])) return false;
      return errs[0] < 1e-3 && errs[errs.length - 1] < 1e-6;
    },
  },
  {
    // (G2) The rel_err tracks E_flow/E_trunc: both collapse monotonically as T0 climbs, and the
    // deepest threshold has E_flow/E_trunc below 1e-10 (machine-level flow correction).
    id: 'imp3577-eflow-ratio-tracks-error',
    description: 'E_flow/E_trunc collapses monotonically (4.26e-7 -> 5.66e-9 -> 7.35e-11) tracking the rel_err',
    holds: () => {
      const rat = CROSSINGS.map((c) => c.E_flow_over_E_trunc);
      for (let i = 1; i < rat.length; i++) if (!(rat[i] < rat[i - 1])) return false;
      return rat[rat.length - 1] < 1e-10;
    },
  },
  {
    // (G3) Far-tail spacing governed by p -> 1/2: one decade of sigma spans ~2 decades of N.
    id: 'imp3577-two-decades-N-per-decade-sigma',
    description: 'deep crossings span ~2.06 decades of N per decade of sigma (within 0.1 of 2)',
    holds: () => DECADE_SPACINGS.every((d) => Math.abs(d.decades_N_per_decade_sigma - 2) < 0.1),
  },
  {
    // (G3) The local decay exponent climbs monotonically toward the imp-3463 far-tail value 1/2
    // from below (0.4791 -> 0.4855 -> 0.4875).
    id: 'imp3577-p-approaches-one-half',
    description: 'local decay exponent climbs monotonically toward 1/2 from below on the deep tail',
    holds: () => {
      const ps = CROSSINGS.map((c) => c.p_local);
      for (let i = 1; i < ps.length; i++) if (!(ps[i] > ps[i - 1])) return false;
      return ps.every((p) => p < 0.5) && ps[ps.length - 1] > 0.48;
    },
  },
  {
    // Honesty gate: measurement/certification only, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp3577-honesty-gate-no-qed',
    description: 'Measurement/certification only: no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP3577_SIGMA_DEEP_THRESHOLD_CROSSINGS.isRigorous === false &&
      /NO QED/.test(IMP3577_SIGMA_DEEP_THRESHOLD_CROSSINGS.verdict) &&
      /remains the rigorous SOTA/.test(IMP3577_SIGMA_DEEP_THRESHOLD_CROSSINGS.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3577_SIGMA_DEEP_THRESHOLD_CROSSINGS.verdict),
  },
];

for (const a of IMP3577_SIGMA_DEEP_THRESHOLD_CROSSINGS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3577-sigma-deep-threshold-crossings assertion failed: ${a.id}`);
  }
}
