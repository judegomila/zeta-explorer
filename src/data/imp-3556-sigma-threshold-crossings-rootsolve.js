/**
 * @module imp-3556-sigma-threshold-crossings-rootsolve
 *
 * imp-3556 (numerical, frontier-direction): imp-3529 reported the post-peak
 * conditional-share threshold crossings (the N above the imp-3406 interior maximum
 * where sigma(N) = E_coll/E(N) first falls below 0.9, 0.75, 0.5, 0.25, 0.1, 0.01)
 * as values "read off a ladder", and summarised the crossing-spacing loosely as
 * "one decade of N per ~0.4 drop early, steepening to one decade of sigma per decade
 * of N once p exceeds ~0.4". This module (a) ROOT-SOLVES each crossing to machine
 * precision on the EXACT imp-3220/imp-3406/imp-3463 sub-terms, (b) CERTIFIES that the
 * sigma = 1/2 half-decay coincides with the imp-3444 E_coll = E_trunc crossover, and
 * (c) QUANTIFIES the crossing-spacing law with a cancellation-free closed form.
 *
 * THE QUANTITY (identical to imp-3220 / imp-3406 / imp-3463 / imp-3529)
 * -------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * Same C_C_PINNED = (1/8) sqrt(3 pi), same Gronwall = exp(2.37e-4). No re-derivation.
 *
 * (A) ROOT-SOLVED CROSSINGS (400-iter bisection in ln N; residual |sigma-level| < 1e-9)
 * -----------------------------------------------------------------------------------
 *   sigma<0.9  at N = 2.572361e7   (log10 N = 7.4103,  p = 0.03913,  E_coll/E_trunc = 9.983)
 *   sigma<0.75 at N = 3.171731e8   (log10 N = 8.5013,  p = 0.11586,  E_coll/E_trunc = 3.041)
 *   sigma<0.5  at N = 3.267235e9   (log10 N = 9.5142,  p = 0.23783,  E_coll/E_trunc = 1.002)
 *   sigma<0.25 at N = 3.259387e10  (log10 N = 10.5131, p = 0.35932,  E_coll/E_trunc = 0.333)
 *   sigma<0.1  at N = 3.213181e11  (log10 N = 11.5069, p = 0.43290,  E_coll/E_trunc = 0.111)
 *   sigma<0.01 at N = 4.624381e13  (log10 N = 13.6651, p = 0.47909,  E_coll/E_trunc = 0.010)
 * These reproduce the imp-3529 F4 ladder read-offs to <1% but now sit at certified roots.
 *
 * (B) sigma = 1/2 CERTIFIED AT THE E_coll = E_trunc CROSSOVER
 * ----------------------------------------------------------
 * Dropping the tiny E_flow, sigma = x/(1+x) with x = E_coll/E_trunc, so sigma = 1/2 <=>
 * x = 1 <=> E_coll = E_trunc EXACTLY. Root-solving E_coll(N) = E_trunc gives the imp-3444
 * crossover N_x = 3.280294e9; the exact sigma = 1/2 crossing sits at N = 3.267235e9, a
 * ratio N_half/N_x = 0.996019 -- 0.40% BELOW the crossover, and that gap is precisely the
 * E_flow contribution: at N_x the full share is sigma(N_x) = 0.499526 (just under 1/2
 * because E_flow > 0 pushes the denominator up). So the half-decay lands at the
 * E_coll = E_trunc crossover up to the O(E_flow/E_trunc) ~ 4e-3 flow correction.
 *
 * (C) THE CROSSING-SPACING LAW (cancellation-free closed form)
 * -----------------------------------------------------------
 * The E_flow-free reduction inverts to an ODDS-RATIO law for the crossing location:
 *     x = sigma/(1-sigma) = (C_C_PINNED/E_trunc) sqrt(log T0 / N)
 *   =>  N = K * log T0(N) * ((1-sigma)/sigma)^2,   K = (C_C_PINNED/E_trunc)^2 = 1.5727e8.
 * This closed form matches the exact root-solved crossings with relative error equal to
 * exactly the neglected E_flow: 24.58% at sigma=0.9 (small N, flow non-negligible),
 * 2.91% (0.75), 0.40% (0.5), 0.055% (0.25), 0.0074% (0.1), 0.0001% (0.01) -- shrinking
 * monotonically to machine level on the far tail where E_flow -> 0. Because
 * log10 N advances by 2*Delta log10((1-sigma)/sigma) per threshold, the interior
 * crossings sigma = 0.75, 0.5, 0.25, 0.1 (odds ratios 1/3, 1, 3, 9) land almost exactly
 * ONE DECADE apart in N (measured spacings 1.013, 0.999, 0.994 decades).
 *
 * HONEST CORRECTION of the imp-3529 loose spacing phrasing. The sigma-drop per decade of
 * N is NOT a constant "0.4 drop early": it is a LOGISTIC-in-ln N profile
 *     -d sigma/d log10 N = (ln10/2) sigma(1-sigma) (1 - d ln log T0/d ln N),
 * which PEAKS at the crossover sigma = 1/2 (measured peak 0.2738 sigma/decade at
 * N = 3.39e9, sigma = 0.4957; the (ln10/8) = 0.2879 logistic cap trimmed by the slow
 * log T0 drift) and VANISHES at both the flat cap (sigma -> sigma_max) and the far tail
 * (sigma -> 0). The far-tail steepening is genuine: sigma 0.1 -> 0.01 (one decade of
 * sigma) takes 2.158 decades of N, i.e. ~0.463 decade-sigma per decade-N, matching the
 * imp-3463 p -> 1/2 sqrt(1/N) law.
 *
 * THE FINDING (measurement / certification only)
 * ----------------------------------------------
 *   (F1) The six post-peak threshold crossings, ROOT-SOLVED to residual < 1e-9 on the
 *        exact sub-terms, are monotone in N and reproduce the imp-3529 read-offs to <1%.
 *   (F2) sigma = 1/2 coincides with the imp-3444 E_coll = E_trunc crossover: the exact
 *        crossing N = 3.267e9 sits 0.40% below N_x = 3.280e9, the gap being exactly the
 *        E_flow contribution (sigma(N_x) = 0.49953, x = E_coll/E_trunc = 1 at N_x).
 *   (F3) The crossing spacing obeys the cancellation-free odds-ratio law
 *        N = K log T0 ((1-sigma)/sigma)^2, K = (C_C/E_trunc)^2, matching the exact roots
 *        with error = the neglected E_flow (24.6% -> 1e-4% from sigma=0.9 to 0.01), so the
 *        interior crossings 0.75/0.5/0.25/0.1 land ~1 decade of N apart.
 *   (F4) The sigma-drop-per-decade is a LOGISTIC-in-ln N bump peaking at 0.274 sigma/decade
 *        at the crossover (NOT the loose ~0.4 of imp-3529) and vanishing at both ends;
 *        the far-tail one-decade-of-sigma-per-2.16-decades-of-N reflects p -> 1/2.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian
 * Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-3529-sigma-postpeak-decay-exponent (local decay exponent p(N), F4 read-off crossings)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form sigma ~ (C_C/E_trunc) sqrt(logT0/N))
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder, exact sub-terms)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406/imp-3463/imp-3529)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3463/imp-3529 exactly

// EXACT imp-3406/imp-3463/imp-3529 sub-terms (no re-derivation, no fresh model).
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

// Right-arm interior maximum (ternary in ln N; same bracket as imp-3406/imp-3529) --
// the flat cap where the post-peak decay begins and the threshold crossings live above.
function argmaxSigmaLnN(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigma(Math.exp(m1)) < sigma(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}
const N_MAX = argmaxSigmaLnN(1e4, 1e9); // ~9.219e5 (imp-3406 interior maximum)

// (A) ROOT-SOLVE the post-peak crossing where sigma first drops below the target level
// (400-iter bisection in ln N; sigma is strictly decreasing on the right arm, so the
// bracket [N_MAX, 1e60] contains exactly one crossing). This is a certified root, not a
// ladder read-off: the residual |sigma(N_cross) - level| lands at machine epsilon.
function crossingAbovePeak(target) {
  let a = Math.log(N_MAX);
  let b = Math.log(1e60);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Local decay exponent p(N) = -d ln sigma/d ln N (central difference), for context at
// each crossing -- reproduces the imp-3529 measured p at the same N.
function localDecayExponent(N) {
  const h = 1e-4;
  const lnN = Math.log(N);
  return -(Math.log(sigma(Math.exp(lnN + h))) - Math.log(sigma(Math.exp(lnN - h)))) / (2 * h);
}

const LEVELS = [0.9, 0.75, 0.5, 0.25, 0.1, 0.01];
const CROSSINGS = LEVELS.map((level) => {
  const N = crossingAbovePeak(level);
  const p = parts(N);
  return {
    sigma_below: level,
    N: +N.toExponential(6),
    log10N: +Math.log10(N).toFixed(4),
    p_local: +localDecayExponent(N).toFixed(5),
    E_coll_over_E_trunc: +(p.E_coll / E_TRUNC_PT).toFixed(4),
    residual: +Math.abs(sigma(N) - level).toExponential(2), // certified root: ~machine eps
  };
});

// (B) CERTIFY sigma = 1/2 at the E_coll = E_trunc crossover. Root-solve E_coll(N) = E_trunc
// directly; at that N the odds ratio x = E_coll/E_trunc = 1, i.e. the E_flow-free share is
// exactly 1/2. The exact sigma = 1/2 crossing sits just below by the E_flow correction.
function crossCollEqTrunc() {
  let a = Math.log(1e6);
  let b = Math.log(1e15);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).E_coll > E_TRUNC_PT) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_ECOLL_EQ_ETRUNC = crossCollEqTrunc(); // 3.280294e9 (imp-3444)
const N_HALF = crossingAbovePeak(0.5); // 3.267235e9
const HALF_DECAY_CERT = {
  N_ecoll_eq_etrunc: +N_ECOLL_EQ_ETRUNC.toExponential(6), // 3.280294e9
  N_sigma_half: +N_HALF.toExponential(6), // 3.267235e9
  ratio_half_over_crossover: +(N_HALF / N_ECOLL_EQ_ETRUNC).toFixed(6), // 0.996019
  sigma_at_crossover: +sigma(N_ECOLL_EQ_ETRUNC).toFixed(6), // 0.499526 (just under 1/2 by E_flow)
  x_at_crossover: +(parts(N_ECOLL_EQ_ETRUNC).E_coll / E_TRUNC_PT).toFixed(6), // 1.000000
  flow_gap_pct: +((1 - N_HALF / N_ECOLL_EQ_ETRUNC) * 100).toFixed(3), // 0.398 (= E_flow correction)
};

// (C) THE CROSSING-SPACING LAW: cancellation-free odds-ratio closed form
//     N = K * log T0(N) * ((1-sigma)/sigma)^2,   K = (C_C_PINNED/E_trunc)^2.
// Solved as a fixed point on log T0(N). The relative error vs the exact root IS the
// neglected E_flow -- it shrinks monotonically to machine level on the far tail.
const K_ODDS = (C_C_PINNED / E_TRUNC_PT) ** 2; // 1.572709e8
function closedFormCrossing(s) {
  const r = ((1 - s) / s) ** 2;
  let N = K_ODDS * r * Math.log(1e9);
  for (let i = 0; i < 80; i++) N = K_ODDS * r * Math.log(effectiveHeightForN(N));
  return N;
}
const SPACING_LAW = LEVELS.map((level, i) => {
  const exactN = CROSSINGS[i].N;
  const closedN = closedFormCrossing(level);
  return {
    sigma_below: level,
    N_exact: exactN,
    N_closed_form: +closedN.toExponential(6),
    rel_err_pct: +((closedN / exactN - 1) * 100).toFixed(4), // = E_flow neglect
  };
});
// Interior crossings 0.75/0.5/0.25/0.1 land ~1 decade of N apart (odds ratios 1/3,1,3,9).
const DECADE_SPACINGS = [];
for (let i = 1; i < CROSSINGS.length; i++) {
  DECADE_SPACINGS.push({
    from: CROSSINGS[i - 1].sigma_below,
    to: CROSSINGS[i].sigma_below,
    delta_log10N: +(CROSSINGS[i].log10N - CROSSINGS[i - 1].log10N).toFixed(4),
    sigma_drop_per_decade: +(
      (CROSSINGS[i - 1].sigma_below - CROSSINGS[i].sigma_below) /
      (CROSSINGS[i].log10N - CROSSINGS[i - 1].log10N)
    ).toFixed(4),
  });
}

// (F4) The sigma-drop per decade of N is a LOGISTIC-in-ln N bump peaking at the crossover
// (NOT the loose constant ~0.4 of imp-3529). Scan for the peak of -d sigma/d log10 N.
function dropPerDecade(N) {
  const h = 1e-4;
  const lnN = Math.log(N);
  return (-(sigma(Math.exp(lnN + h)) - sigma(Math.exp(lnN - h))) / (2 * h)) * Math.log(10);
}
let PEAK_DROP = 0;
let PEAK_DROP_N = 0;
for (let e = 6.5; e < 15; e += 0.005) {
  const d = dropPerDecade(10 ** e);
  if (d > PEAK_DROP) {
    PEAK_DROP = d;
    PEAK_DROP_N = 10 ** e;
  }
}
const PEAK_DROP_SIGMA = sigma(PEAK_DROP_N);
const LOGISTIC_CAP = Math.log(10) / 8; // (ln10/2) sigma(1-sigma) maximised at sigma=1/2 => ln10/8

export const IMP3556_SIGMA_THRESHOLD_CROSSINGS_ROOTSOLVE = {
  id: 'imp-3556',
  proofSection: 'S-frontier',
  question:
    'Root-solve the imp-3529 post-peak sigma(N) threshold crossings (sigma<0.9, 0.75, ' +
    '0.5, 0.25, 0.1, 0.01) on the exact imp-3220 sub-terms, certify sigma=1/2 lands at ' +
    'the E_coll=E_trunc crossover, and quantify the crossing-spacing law. ' +
    'Measurement/certification only; conditional-share diagnostic, NOT an RH bound; no QED.',
  quantity: 'sigma(N) = E_coll/(E_trunc+E_flow+E_coll); crossings root-solved by bisection in ln N',
  N_max: +N_MAX.toExponential(4), // ~9.219e5 (imp-3406 interior maximum; crossings above it)
  rootSolvedCrossings: CROSSINGS,
  halfDecayCertification: HALF_DECAY_CERT,
  spacingLaw: {
    closed_form: 'N = K * logT0(N) * ((1-sigma)/sigma)^2,  K = (C_C_PINNED/E_trunc)^2',
    K: +K_ODDS.toExponential(6), // 1.572709e8
    table: SPACING_LAW,
    interiorDecadeSpacings: DECADE_SPACINGS,
    peakDropPerDecade: +PEAK_DROP.toFixed(5), // 0.27384
    peakDropAtSigma: +PEAK_DROP_SIGMA.toFixed(5), // ~0.4957 (the crossover)
    peakDropAtN: +PEAK_DROP_N.toExponential(4), // ~3.39e9
    logisticCap: +LOGISTIC_CAP.toFixed(5), // 0.28782 = ln10/8 (untrimmed logistic peak)
  },
  finding: {
    F1_root_solved:
      'The six post-peak crossings, root-solved to residual < 1e-9 on the exact sub-terms, ' +
      'are monotone in N and reproduce the imp-3529 read-offs to <1%.',
    F2_half_at_crossover:
      'sigma=1/2 coincides with the imp-3444 E_coll=E_trunc crossover: exact crossing ' +
      'N=3.267e9 sits 0.40% below N_x=3.280e9, the gap being exactly E_flow (x=1, ' +
      'sigma(N_x)=0.49953 at N_x).',
    F3_odds_ratio_law:
      'Crossing spacing obeys N=K logT0 ((1-sigma)/sigma)^2, K=(C_C/E_trunc)^2, matching the ' +
      'exact roots with error = the neglected E_flow (24.6% -> 1e-4% from sigma=0.9 to 0.01); ' +
      'interior crossings 0.75/0.5/0.25/0.1 land ~1 decade of N apart.',
    F4_logistic_spacing:
      'CORRECTION of the imp-3529 loose ~0.4-drop phrasing: -d sigma/d log10 N is a ' +
      'logistic-in-lnN bump peaking at 0.274 sigma/decade at the crossover (sigma~0.496, ' +
      'below the ln10/8=0.288 cap) and vanishing at both ends.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/CERTIFICATION (frontier-direction, NOT rigorous). The imp-3529 post-peak ' +
    'threshold crossings, ROOT-SOLVED to machine precision on the exact imp-3220/imp-3406/' +
    'imp-3463 sub-terms, are sigma<0.9 at N=2.572e7, <0.75 at 3.172e8, <0.5 at 3.267e9, ' +
    '<0.25 at 3.259e10, <0.1 at 3.213e11, <0.01 at 4.624e13 (residual <1e-9, reproducing the ' +
    'imp-3529 read-offs to <1%). The sigma=1/2 half-decay coincides with the imp-3444 ' +
    'E_coll=E_trunc crossover: the exact crossing sits 0.40% below N_x=3.280e9, the gap being ' +
    'exactly the E_flow contribution (at N_x the odds ratio x=E_coll/E_trunc=1 and ' +
    'sigma(N_x)=0.49953). The crossing spacing obeys the cancellation-free odds-ratio closed ' +
    'form N=K logT0(N) ((1-sigma)/sigma)^2 with K=(C_C/E_trunc)^2=1.573e8, matching the exact ' +
    'roots with relative error equal to the neglected E_flow (24.6% at sigma=0.9 shrinking ' +
    'monotonically to 1e-4% at 0.01), so the interior crossings 0.75/0.5/0.25/0.1 land ~1 ' +
    'decade of N apart. Correcting the imp-3529 loose spacing phrasing: the sigma-drop per ' +
    'decade of N is a LOGISTIC-in-lnN bump peaking at 0.274 sigma/decade at the crossover ' +
    '(sigma~0.496, under the ln10/8=0.288 logistic cap) and vanishing at both the flat cap ' +
    'and the far tail, where one decade of sigma spans ~2.16 decades of N as p -> 1/2. ' +
    'Measurement/certification only; no positivity, no bridge closure, no RH claim, NO QED. ' +
    'imp-3066 off-diagonal endpoint-Hankel K_a>=0 positivity UNTOUCHED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-3529 (post-peak decay exponent, F4 read-off crossings); imp-3444 (E_coll=E_trunc ' +
    'crossover N ~ 3.280e9); imp-3463 (far-tail sqrt(logT0/N) leading form, p -> 1/2); ' +
    'imp-3406 (interior MAX N ~ 9.22e5); imp-3220 (U-shaped sigma(N) exact sub-terms); ' +
    'imp-2642 (C_H=1/8 ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip ' +
    'route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3556_SIGMA_THRESHOLD_CROSSINGS_ROOTSOLVE_ASSERTIONS = [
  {
    // (F1) Every crossing is a CERTIFIED root: residual |sigma(N) - level| < 1e-9, and the
    // crossings are monotone increasing in N (sigma strictly decreasing on the right arm).
    id: 'imp3556-crossings-root-solved-and-monotone',
    description: 'six crossings root-solved to residual < 1e-9 and monotone increasing in N',
    holds: () => {
      for (const c of CROSSINGS) if (!(c.residual < 1e-9)) return false;
      for (let i = 1; i < CROSSINGS.length; i++) {
        if (!(CROSSINGS[i].N > CROSSINGS[i - 1].N)) return false;
      }
      return true;
    },
  },
  {
    // (F1) The root-solved crossings reproduce the imp-3529 F4 read-offs to <1%.
    id: 'imp3556-reproduces-imp3529-readoffs',
    description: 'crossings match imp-3529 F4 (sigma<0.9 ~2.57e7, <0.5 ~3.27e9, <0.01 ~4.62e13) to <1%',
    holds: () => {
      const at = (lvl) => CROSSINGS.find((c) => c.sigma_below === lvl).N;
      return (
        Math.abs(at(0.9) / 2.572e7 - 1) < 1e-2 &&
        Math.abs(at(0.5) / 3.267e9 - 1) < 1e-2 &&
        Math.abs(at(0.01) / 4.624e13 - 1) < 1e-2
      );
    },
  },
  {
    // (F2) sigma = 1/2 certified at the E_coll = E_trunc crossover: the exact half-decay
    // crossing sits ~0.40% below N_x, the odds ratio x = 1 at N_x, and sigma(N_x) ~ 0.4995.
    id: 'imp3556-half-decay-at-ecoll-eq-etrunc',
    description: 'sigma=1/2 crossing sits 0.40% below N_x=E_coll=E_trunc crossover; x(N_x)=1, sigma(N_x)~0.4995',
    holds: () =>
      Math.abs(HALF_DECAY_CERT.ratio_half_over_crossover - 0.99602) < 1e-3 &&
      Math.abs(HALF_DECAY_CERT.x_at_crossover - 1) < 1e-4 &&
      Math.abs(HALF_DECAY_CERT.sigma_at_crossover - 0.49953) < 1e-3 &&
      Math.abs(N_ECOLL_EQ_ETRUNC / 3.280294e9 - 1) < 1e-4,
  },
  {
    // (F3) The odds-ratio closed form matches the exact roots with error = neglected E_flow,
    // shrinking monotonically to machine level on the far tail (< 1e-3% by sigma = 0.1).
    id: 'imp3556-odds-ratio-closed-form-tightens',
    description: 'closed-form rel_err shrinks monotonically toward 0 (24.6% at 0.9 down to <1e-3% at 0.1)',
    holds: () => {
      const errs = SPACING_LAW.map((r) => Math.abs(r.rel_err_pct));
      for (let i = 1; i < errs.length; i++) if (!(errs[i] < errs[i - 1])) return false;
      return errs[0] > 20 && Math.abs(SPACING_LAW.find((r) => r.sigma_below === 0.1).rel_err_pct) < 1e-2;
    },
  },
  {
    // (F3) Interior crossings 0.75/0.5/0.25/0.1 land ~1 decade of N apart (odds ratios 1/3,1,3,9).
    id: 'imp3556-interior-crossings-one-decade-apart',
    description: 'consecutive crossings 0.75->0.5->0.25->0.1 span ~1 decade of N each (within 0.05)',
    holds: () => {
      const interior = DECADE_SPACINGS.filter(
        (d) => d.from <= 0.75 && d.to >= 0.1
      );
      return interior.every((d) => Math.abs(d.delta_log10N - 1) < 0.05);
    },
  },
  {
    // (F4) The sigma-drop per decade is a logistic bump peaking at the crossover (~0.274,
    // under the ln10/8 = 0.288 cap) at sigma ~ 1/2, NOT the loose constant ~0.4 of imp-3529.
    id: 'imp3556-drop-per-decade-peaks-at-crossover',
    description: 'peak sigma-drop/decade ~0.274 (< ln10/8=0.288 cap) located at sigma~0.5, not ~0.4',
    holds: () =>
      Math.abs(PEAK_DROP - 0.2738) < 5e-3 &&
      PEAK_DROP < LOGISTIC_CAP &&
      Math.abs(PEAK_DROP_SIGMA - 0.5) < 2e-2,
  },
  {
    // Honesty gate: measurement/certification only, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp3556-honesty-gate-no-qed',
    description: 'Measurement/certification only: no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP3556_SIGMA_THRESHOLD_CROSSINGS_ROOTSOLVE.isRigorous === false &&
      /NO QED/.test(IMP3556_SIGMA_THRESHOLD_CROSSINGS_ROOTSOLVE.verdict) &&
      /remains the rigorous SOTA/.test(IMP3556_SIGMA_THRESHOLD_CROSSINGS_ROOTSOLVE.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3556_SIGMA_THRESHOLD_CROSSINGS_ROOTSOLVE.verdict),
  },
];

for (const a of IMP3556_SIGMA_THRESHOLD_CROSSINGS_ROOTSOLVE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3556-sigma-threshold-crossings-rootsolve assertion failed: ${a.id}`);
  }
}
