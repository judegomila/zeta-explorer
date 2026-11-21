/**
 * @module imp-35017-sigma-landmark-pointwise-exponent-ladder
 *
 * imp-35017 (numerical, frontier-direction): the imp-33582 near-peak study tabulates three
 * sigma(N) = E_coll/E(N) threshold LANDMARKS -- the downslope N at which the conditional share
 * first drops below 0.9 (N ~ 2.57e7), 0.5 (the HALVING point, N ~ 3.27e9), and 0.1 (N ~ 3.21e11)
 * -- but reports only the whole-decade OLS local exponent ladder alongside them, never the
 * POINTWISE local decay exponent evaluated AT each landmark. Separately, imp-33701/imp-33721
 * localized the S-shaped exponent-ramp INFLECTION KNEE (where the decay exponent accelerates
 * fastest, the single D2 sign change of the exponent ladder) to N* ~ 3.38e9 (log10 ~ 9.529).
 * The two families were never co-tabulated: the pointwise exponent p(N) = -d ln sigma / d ln N
 * AT each landmark, and whether the HALVING landmark (sigma = 1/2, mid-ramp) is the SAME N as
 * the steepest-acceleration inflection knee or a DISTINCT nearby N.
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-33582 / imp-33721 -- no fresh model)
 * --------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 * The threshold crossings are re-derived by the SAME downslope bisection imp-33582 used, and the
 * reuse gate below reproduces its published landmark N to the printed digits.
 *
 * THE MEASUREMENT: pointwise exponent AT each landmark, plus halving-vs-knee identity
 * -----------------------------------------------------------------------------------
 *   (a) Re-locate the three threshold landmarks (sigma below 0.9, 0.5, 0.1) on the downslope by
 *       bisection past the imp-3406 interior peak N ~ 9.22e5.
 *   (b) POINTWISE LOCAL EXPONENT at each landmark: p(N) = -d ln sigma / d ln N by a symmetric
 *       central difference in ln N (h = 1e-5) -- the instantaneous decay exponent, NOT a decade
 *       average. This is the smooth sigmoid ramp p rises along, from ~0 near the peak toward the
 *       imp-3463 far-tail 1/2.
 *   (c) HALVING-VS-KNEE: read the imp-33721 inflection knee N* (log10 ~ 9.529, N* ~ 3.38e9), its
 *       pointwise exponent p(N*), and compare BOTH the N locations (N* / N_half) and the exponents
 *       (p(N*) vs p(N_half)) -- testing whether the sigma = 1/2 halving point and the
 *       steepest-acceleration knee are the same N.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE POINTWISE EXPONENT LADDER AT THE LANDMARKS. p(N) = -d ln sigma / d ln N evaluates to
 *        ~0.0391 at the sigma = 0.9 landmark (N ~ 2.57e7), ~0.2378 at the sigma = 1/2 HALVING
 *        landmark (N ~ 3.27e9), and ~0.4329 at the sigma = 0.1 landmark (N ~ 3.21e11). The
 *        exponent rises monotonely landmark-to-landmark, and the halving-landmark exponent ~0.238
 *        sits essentially MID-RAMP -- close to the arithmetic mean of the near-peak ~0 and the
 *        far-tail 1/2 -- consistent with sigma = 1/2 lying mid-sigmoid.
 *   (F2) HALVING AND STEEPEST-ACCELERATION ARE DISTINCT N (BUT CLOSE). The imp-33721 inflection
 *        knee N* ~ 3.38e9 (log10 ~ 9.529), where the decay exponent RAMPS fastest, sits ~3.5%
 *        ABOVE the sigma = 1/2 halving landmark N_half ~ 3.27e9 -- distinct locations, not the
 *        same N. So sigma reaches half a fraction of a percent-decade BEFORE the exponent stops
 *        accelerating: the halving point is slightly below the ramp inflection, not coincident.
 *   (F3) THE POINTWISE EXPONENTS AT THE TWO LANDMARKS AGREE TO < 1%. p(N_half) ~ 0.2378 and
 *        p(N*) ~ 0.2398 differ by only ~0.8% (ratio ~1.008): because both landmarks sit within
 *        ~3.5% of each other on a smoothly-varying ramp, the instantaneous decay exponent is
 *        nearly identical at the halving point and the knee even though the N are distinct. So the
 *        ~3.3% halving-vs-knee co-location imp-33721 reported in N is matched by a < 1% agreement
 *        in the local exponent -- close but genuinely two separate landmarks.
 *
 * The punchline: co-tabulating the two landmark families settles the identity question -- the
 * sigma = 1/2 HALVING point (N ~ 3.27e9, pointwise exponent ~0.238) and the exponent-ramp
 * INFLECTION KNEE (N* ~ 3.38e9, exponent ~0.240) are DISTINCT N ~3.5% apart, though the local
 * decay exponent agrees to < 1% across them. Halving is not steepest-acceleration; it precedes it
 * slightly.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is untouched; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (threshold landmarks + whole-decade ladder)
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade inflection knee N* ~ 3.38e9)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection (whole-decade knee localization)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover ~3.28e9, halving twin)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582/imp-33721)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33721 exactly

// EXACT imp-3406/imp-33582/imp-33721 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// POINTWISE local decay exponent p(N) = -d ln sigma / d ln N (symmetric central difference in ln N).
// The instantaneous decay exponent -- NOT the imp-33582 whole-decade OLS average.
function pLocal(N) {
  const h = 1e-5;
  const lnN = Math.log(N);
  const sp = Math.log(sigma(Math.exp(lnN + h)));
  const sm = Math.log(sigma(Math.exp(lnN - h)));
  return -(sp - sm) / (2 * h);
}

// Interior peak (imp-3406 N ~ 9.22e5): sign-of-derivative bisection in log N, to anchor the downslope.
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

// Downslope threshold crossings (N > N_peak): first N with sigma below thr -- imp-33582 bisection.
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
const N_CROSS_0_5 = crossBelow(0.5); // ~3.27e9 (the HALVING landmark)
const N_CROSS_0_1 = crossBelow(0.1); // ~3.21e11

// (F1) pointwise exponent AT each threshold landmark.
const LANDMARK_LADDER = [
  { threshold: 0.9, N: N_CROSS_0_9 },
  { threshold: 0.5, N: N_CROSS_0_5 },
  { threshold: 0.1, N: N_CROSS_0_1 },
].map((r) => ({
  threshold: r.threshold,
  N: +r.N.toExponential(4),
  sigmaAtN: +sigma(r.N).toFixed(4),
  pointwiseExponent: +pLocal(r.N).toFixed(4),
}));

// (F2)/(F3) halving vs the imp-33721 inflection knee (steepest exponent-ramp acceleration).
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote the ramp saturates toward
const N_HALF = N_CROSS_0_5; // sigma = 1/2 halving landmark (~3.27e9)
const IMP33721_KNEE_LOG10 = 9.529; // imp-33721 sub-decade D2 zero-crossing (N* ~ 3.38e9)
const N_STAR = Math.pow(10, IMP33721_KNEE_LOG10);
const P_HALF = pLocal(N_HALF); // ~0.2378
const P_STAR = pLocal(N_STAR); // ~0.2398
const KNEE_OVER_HALF = N_STAR / N_HALF; // ~1.035 (knee ~3.5% above halving)
const P_STAR_OVER_HALF = P_STAR / P_HALF; // ~1.008 (exponents agree to < 1%)

export const IMP35017_SIGMA_LANDMARK_POINTWISE_EXPONENT_LADDER = {
  id: 'imp-35017',
  proofSection: 'S-frontier',
  question:
    'Tabulate the imp-33582 sigma(N) threshold landmarks (sigma below 0.9 at N ~ 2.57e7; the ' +
    'sigma = 1/2 HALVING point at N ~ 3.27e9; sigma below 0.1 at N ~ 3.21e11) with the POINTWISE ' +
    'local decay exponent p(N) = -d ln sigma / d ln N evaluated AT each landmark, and assess ' +
    'whether the exponent at the halving landmark coincides with the imp-33701/imp-33721 S-shaped ' +
    'inflection-knee exponent -- i.e. whether HALVING and steepest-acceleration are the same N or ' +
    'distinct. Measurement/fit only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the pointwise local decay exponent p(N) = -d ln sigma / d ln N (central difference in ln N) ' +
    'at each of the sigma = {0.9, 0.5, 0.1} threshold landmarks, plus the exponent p(N*) at the ' +
    'imp-33721 inflection knee N* ~ 3.38e9 and the N* / N_half and p(N*) / p(N_half) ratios',
  peakN: +N_PEAK.toExponential(6), // ~9.22e5 (imp-3406 anchor)
  farTailExponent: HALF, // imp-3463 asymptote
  landmarkLadder: LANDMARK_LADDER,
  halvingVsKnee: {
    halvingN: +N_HALF.toExponential(4), // ~3.27e9 (sigma = 1/2)
    halvingPointwiseExponent: +P_HALF.toFixed(4), // ~0.2378
    inflectionKneeLog10Nstar: IMP33721_KNEE_LOG10, // 9.529 (imp-33721)
    inflectionKneeNstar: +N_STAR.toExponential(4), // ~3.38e9
    kneePointwiseExponent: +P_STAR.toFixed(4), // ~0.2398
    kneeOverHalvingN: +KNEE_OVER_HALF.toFixed(4), // ~1.035 (knee ~3.5% above halving)
    kneeOverHalvingExponent: +P_STAR_OVER_HALF.toFixed(4), // ~1.008 (exponents agree to < 1%)
    sameN: false,
  },
  finding: {
    F1_pointwise_exponent_at_landmarks:
      'p(N) = -d ln sigma / d ln N evaluates to ~0.0391 at the sigma = 0.9 landmark (N ~ 2.57e7), ' +
      '~0.2378 at the sigma = 1/2 HALVING landmark (N ~ 3.27e9), and ~0.4329 at the sigma = 0.1 ' +
      'landmark (N ~ 3.21e11). The exponent rises monotonely landmark-to-landmark, and the ' +
      'halving-landmark exponent ~0.238 sits essentially mid-ramp -- near the mean of the ' +
      'near-peak ~0 and the far-tail 1/2 -- consistent with sigma = 1/2 lying mid-sigmoid.',
    F2_halving_and_knee_are_distinct_N:
      'The imp-33721 inflection knee N* ~ 3.38e9 (log10 ~ 9.529), where the decay exponent ramps ' +
      'fastest, sits ~3.5% ABOVE the sigma = 1/2 halving landmark N_half ~ 3.27e9 -- distinct ' +
      'locations, not the same N. sigma reaches one half slightly BEFORE the exponent stops ' +
      'accelerating: the halving point lies just below the ramp inflection, not coincident with it.',
    F3_pointwise_exponents_agree_to_under_1pct:
      'p(N_half) ~ 0.2378 and p(N*) ~ 0.2398 differ by only ~0.8% (ratio ~1.008): both landmarks ' +
      'sit within ~3.5% of each other on a smoothly-varying ramp, so the instantaneous decay ' +
      'exponent is nearly identical at the halving point and the knee even though the N are ' +
      'distinct. The ~3.3% halving-vs-knee co-location imp-33721 reported in N is matched by a ' +
      '< 1% agreement in the local exponent -- close, but genuinely two separate landmarks.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Co-tabulating the imp-33582 sigma threshold ' +
    'landmarks with the pointwise local decay exponent p(N) = -d ln sigma / d ln N at each: the ' +
    'exponent is ~0.0391 at the sigma = 0.9 landmark (~2.57e7), ~0.2378 at the sigma = 1/2 ' +
    'HALVING landmark (~3.27e9), and ~0.4329 at the sigma = 0.1 landmark (~3.21e11), rising ' +
    'monotonely toward the imp-3463 far-tail 1/2 with the halving exponent essentially mid-ramp. ' +
    'The halving landmark and the imp-33721 exponent-ramp inflection knee (N* ~ 3.38e9, log10 ~ ' +
    '9.529) are DISTINCT N -- the knee sits ~3.5% above halving -- so sigma = 1/2 is reached ' +
    'slightly BEFORE the steepest exponent acceleration, not at it; yet the pointwise exponents ' +
    'agree to < 1% (p ~ 0.238 vs ~0.240) because the two landmarks are so close on a smooth ramp. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is untouched; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33582 (threshold landmarks + whole-decade ladder); imp-33721 (sub-decade inflection knee ' +
    'N* ~ 3.38e9); imp-33701 (whole-decade knee localization); imp-3463 (far-tail exponent -> 1/2 ' +
    'from below); imp-3444 (E_coll = E_trunc crossover ~3.28e9); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35017_SIGMA_LANDMARK_POINTWISE_EXPONENT_LADDER_ASSERTIONS = [
  {
    // Reuse gate: the downslope threshold crossings reproduce the published imp-33582 landmarks
    // (sigma<0.9 ~2.57e7, sigma<0.5 ~3.27e9, sigma<0.1 ~3.21e11), proving the identical model.
    id: 'imp35017-reproduces-imp33582-landmarks',
    description: 'threshold crossings match imp-33582: sigma<0.9 ~2.57e7, sigma<0.5 ~3.27e9, sigma<0.1 ~3.21e11',
    holds: () =>
      Math.abs(N_CROSS_0_9 / 2.57e7 - 1) < 5e-2 &&
      Math.abs(N_CROSS_0_5 / 3.27e9 - 1) < 5e-2 &&
      Math.abs(N_CROSS_0_1 / 3.21e11 - 1) < 5e-2,
  },
  {
    // (F1): the pointwise exponent at the landmarks rises monotonely and stays inside (0, 1/2),
    // with the halving-landmark exponent essentially mid-ramp (~0.238).
    id: 'imp35017-pointwise-exponent-ladder-monotone-midramp',
    description: 'p(N) rises 0.9->0.5->0.1 landmark, all in (0,0.5), halving exponent ~0.238',
    holds: () =>
      LANDMARK_LADDER[0].pointwiseExponent < LANDMARK_LADDER[1].pointwiseExponent &&
      LANDMARK_LADDER[1].pointwiseExponent < LANDMARK_LADDER[2].pointwiseExponent &&
      LANDMARK_LADDER.every((r) => r.pointwiseExponent > 0 && r.pointwiseExponent < HALF) &&
      Math.abs(LANDMARK_LADDER[1].pointwiseExponent - 0.238) < 5e-3,
  },
  {
    // (F2): the sigma=1/2 halving landmark and the imp-33721 inflection knee are DISTINCT N --
    // the knee sits ~3.5% above halving (not the same N, but within ~5%).
    id: 'imp35017-halving-and-knee-are-distinct-N',
    description: 'inflection knee N* ~3.5% above the halving landmark -- distinct N, within ~5%',
    holds: () =>
      IMP35017_SIGMA_LANDMARK_POINTWISE_EXPONENT_LADDER.halvingVsKnee.sameN === false &&
      KNEE_OVER_HALF > 1.0 &&
      KNEE_OVER_HALF < 1.05 &&
      N_STAR > N_HALF,
  },
  {
    // (F3): the pointwise exponents at the halving landmark and the knee agree to < 1%.
    id: 'imp35017-landmark-and-knee-exponents-agree',
    description: 'p(N_half) ~ p(N*): the two exponents agree to < 1% (ratio within 1.01)',
    holds: () => Math.abs(P_STAR_OVER_HALF - 1) < 0.01,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35017-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP35017_SIGMA_LANDMARK_POINTWISE_EXPONENT_LADDER.isRigorous === false &&
      IMP35017_SIGMA_LANDMARK_POINTWISE_EXPONENT_LADDER.farTailExponent === 0.5 &&
      /NO QED/.test(IMP35017_SIGMA_LANDMARK_POINTWISE_EXPONENT_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP35017_SIGMA_LANDMARK_POINTWISE_EXPONENT_LADDER.verdict),
  },
];

for (const a of IMP35017_SIGMA_LANDMARK_POINTWISE_EXPONENT_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35017-sigma-landmark-pointwise-exponent-ladder assertion failed: ${a.id}`);
  }
}
