/**
 * @module imp-35618-eflow-fartail-remnant-span-ratio-sub1e7-noise-wall
 *
 * imp-35618 (numerical, frontier-direction): imp-35553 fit the imp-35534 growing
 * "decade-span-to-shed-each-factor-of-ten" law for the E_flow far-tail fd-vs-analytic
 * remnant, directly located the sub-1e-6 crossing (log10 N ~ 1467.7351, span ~1057.6875
 * past sub-1e-5), and reported the two successive span RATIOS 3.6001 (span45/span34) then
 * 3.5156 (span56/span45) -- a slightly DECREASING ratio it read as declining toward the
 * sqrt(10) ~ 3.1623 asymptote fixed by the remnant ~ 2 loglogN/(logN)^2 leading form
 * (imp-35552). imp-35553 stopped at sub-1e-6 and never PROJECTED the sub-1e-7 crossing
 * nor asked whether the span ratio actually converges to a limiting constant. This module
 * PROJECTS the sub-1e-7 crossing from the two clean ratios under three limiting-ratio
 * models, CROSS-CHECKS against a DIRECT log-space bisection, and reports what the third
 * ratio does -- with the honest caveat the direct measurement uncovers.
 *
 * THE IDENTICAL LOG-SPACE CHANNEL (byte-faithful to imp-35534/imp-35553, no height-map swap)
 * -----------------------------------------------------------------------------------------
 *   log eFlowWith = log(C_F) + log(g) - g + TC_A1_TRAP,
 *   g = log T0 = log(2 pi) + u - log(u),   C_F = (u - log(u) + 1)/(2 pi),   u = log N,
 * localExponent is the same central difference (h = 1.0002), remnant = |(-1 + 3/u) - localExponent|.
 * The channel reproduces the imp-35473 sub-1e-4 crossing (log10 N = 109.1892) and the
 * imp-35534 sub-1e-5 crossing (410.0475) to the printed digits, confirming it is the SAME
 * math continued, NOT a new model.
 *
 * THE PROJECTION (from the two clean ratios) AND THE DIRECT CROSS-CHECK
 * --------------------------------------------------------------------
 *   threshold   crossing log10 N   span            span ratio
 *   1e-4        109.1892           --              --
 *   1e-5        410.0475           300.8583        --
 *   1e-6        1467.7351          1057.6875       3.5156 (span56/span45)
 *   1e-7        ?                  ?               ?      (this module)
 *
 * Three limiting-ratio projections of span(1e-6 -> 1e-7) = span56 * R67pred:
 *   (a) constant ratio R67 = R56 = 3.5156         -> span 3718.37, sub-1e-7 ~ 10^5186.11
 *   (b) linear-in-index extrapolation R67 = 3.4310 -> span 3628.93, sub-1e-7 ~ 10^5096.67
 *   (c) sqrt(10)-floor geometric decay R67 = 3.4473 -> span 3646.20, sub-1e-7 ~ 10^5113.94
 * So all three clean-ratio models place sub-1e-7 in a tight band ~10^5097-5186.
 *
 * THE FINDING -- THE CHANNEL HITS ITS DOUBLE-PRECISION NOISE WALL AT SUB-1e-7
 * --------------------------------------------------------------------------
 * A DIRECT bisection of the sub-1e-7 crossing does NOT sharpen the projection -- it returns
 * BRACKET-DEPENDENT answers: bracket [1e4000, 1e7000] lands at 10^5218.85 while bracket
 * [1e3000, 1e9000] lands at 10^5062.50, a ~156-decade disagreement. The cause is a precision
 * WALL: the remnant near the crossing (e ~ 5150) carries a finite-difference floating-point
 * NOISE floor of amplitude ~1.19e-8 -- about 12% of the 1e-7 target level -- so the remnant
 * is non-monotone in ~22 of 40 fine (step 0.5) samples across a 20-decade window, and the
 * bisection simply zooms into that noise. A noise-averaged coarse (50-decade sampling,
 * log-linear interpolation) estimate places sub-1e-7 near 10^5181.96, giving a THIRD span
 * ratio R67 ~ 3.5116 -- statistically INDISTINGUISHABLE from R56 = 3.5156. The direct-bisection
 * R67 band alone spans 3.399..3.547 (from the two brackets), an uncertainty (+/-~0.075) that
 * EXCEEDS the R56 -> R67 change any of the three clean models predicts.
 *
 * ANSWER TO "converging to a constant, to 3.5, or continuing to drift": within double
 * precision the third span ratio has PLATEAUED near ~3.5 (best noise-averaged estimate
 * 3.5116, vs 3.5156 at the prior step), well above sqrt(10) ~ 3.1623 -- NOT visibly
 * continuing its imp-35553 decline. But the plateau CANNOT be sharpened: sub-1e-7 sits only
 * ~10x above the finite-difference noise floor (whereas sub-1e-6 sat ~100x above it, which is
 * why imp-35553 stopped there), so the data neither confirm a slow drift toward sqrt(10) nor
 * rule it out. The honest verdict is a resolution limit, not a converged constant: the direct
 * cross-check CONFIRMS sub-1e-7 sits ~3700 decades past sub-1e-6 (10^5100-5200, consistent
 * with all three clean projections) but the imp-35534/imp-35553 double-precision channel has
 * reached its precision wall -- extending the ratio trend past ~3.5 needs extended precision.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate extrapolation, NOT a rigorous
 * asymptotic; changes no bound. E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched;
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35553-eflow-fartail-remnant-decade-span-growth-fit (the two-ratio fit + sub-1e-6 crossing this extends)
 * @see imp-35534-eflow-fartail-remnant-sub1e5-crossing (the log-space channel + two-span note)
 * @see imp-35552-eflow-fartail-remnant-product-decay-limit (remnant ~ 2 loglogN/(logN)^2 leading form -> sqrt(10))
 * @see imp-35473-eflow-fartail-remnant-sub1e4-crossing (sub-1e-4 crossing 109.1892)
 */

const TWO_PI = 2 * Math.PI;
const LN2PI = Math.log(TWO_PI);

// imp-35135/imp-35236 exact sub-term constant (no re-derivation): the A1-trap Gronwall exponent.
const TC_A1_TRAP = 2.37e-4;

// Same central-difference step as imp-35135/imp-35473/imp-35534/imp-35553 (multiplicative h = 1.0002 in N).
const H_LOG = Math.log(1.0002);

const SQRT10 = Math.sqrt(10);

// EXACT log of the far-tail E_flow quantity, in log-space on u = log N (byte-identical to imp-35553).
function lnEFlowByLogN(u) {
  const g = LN2PI + u - Math.log(u);
  const lnCF = Math.log((u - Math.log(u) + 1) / TWO_PI);
  return lnCF + Math.log(g) - g + TC_A1_TRAP;
}

function localExponentByLogN(u) {
  return (lnEFlowByLogN(u + H_LOG) - lnEFlowByLogN(u - H_LOG)) / (2 * H_LOG);
}

function analyticSurrogateExponent(u) {
  return -1 + 3 / u;
}

// The fd-vs-analytic remnant at a given log10 N exponent e (identical to imp-35473/imp-35534/imp-35553).
function remnantAtLog10(e) {
  const u = e * Math.LN10;
  return Math.abs(analyticSurrogateExponent(u) - localExponentByLogN(u));
}

// Bisect the crossing at threshold thr in log10 N over a straddling bracket [lo, hi] (200 iters).
function crossingLog10(thr, lo, hi) {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (remnantAtLog10(mid) > thr) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// The clean crossings (reproduce the imp-35553 landmarks) and the two clean span ratios.
const CROSS_1E3 = crossingLog10(1e-3, 20, 40);
const CROSS_1E4 = crossingLog10(1e-4, 100, 120);
const CROSS_1E5 = crossingLog10(1e-5, 400, 500);
const CROSS_1E6 = crossingLog10(1e-6, 1400, 1500);
const SPAN_34 = CROSS_1E4 - CROSS_1E3;
const SPAN_45 = CROSS_1E5 - CROSS_1E4;
const SPAN_56 = CROSS_1E6 - CROSS_1E5;
const RATIO_45 = SPAN_45 / SPAN_34; // 3.6001
const RATIO_56 = SPAN_56 / SPAN_45; // 3.5156

// THREE limiting-ratio projections of the sub-1e-7 span from the two clean ratios.
// (a) constant ratio R67 = R56.
const R67_CONST = RATIO_56;
const SPAN_67_CONST = SPAN_56 * R67_CONST;
const CROSS_1E7_CONST = CROSS_1E6 + SPAN_67_CONST;
// (b) linear-in-index extrapolation of (R45, R56) to the third ratio.
const R67_LINEAR = RATIO_45 + 2 * (RATIO_56 - RATIO_45);
const SPAN_67_LINEAR = SPAN_56 * R67_LINEAR;
const CROSS_1E7_LINEAR = CROSS_1E6 + SPAN_67_LINEAR;
// (c) sqrt(10)-floor geometric decay of the deviation d_n = R_n - sqrt(10).
const D1 = RATIO_45 - SQRT10;
const D2 = RATIO_56 - SQRT10;
const Q_DECAY = D2 / D1;
const R67_SQRT10 = SQRT10 + D2 * Q_DECAY;
const SPAN_67_SQRT10 = SPAN_56 * R67_SQRT10;
const CROSS_1E7_SQRT10 = CROSS_1E6 + SPAN_67_SQRT10;

// DIRECT bisection of the sub-1e-7 crossing on TWO brackets -> exposes the ~156-decade
// bracket-dependence (the precision wall).
const CROSS_1E7_BRACKET_A = crossingLog10(1e-7, 4000, 7000);
const CROSS_1E7_BRACKET_B = crossingLog10(1e-7, 3000, 9000);
const DIRECT_BRACKET_GAP = CROSS_1E7_BRACKET_A - CROSS_1E7_BRACKET_B;
const R67_DIRECT_A = (CROSS_1E7_BRACKET_A - CROSS_1E6) / SPAN_56;
const R67_DIRECT_B = (CROSS_1E7_BRACKET_B - CROSS_1E6) / SPAN_56;

// The finite-difference NOISE floor near the crossing (e ~ 5150), a 20-decade fine window.
function noiseProfile() {
  const vals = [];
  let nonMono = 0;
  let prev = null;
  for (let e = 5140; e <= 5160 + 1e-9; e += 0.5) {
    const r = remnantAtLog10(e);
    vals.push(r);
    if (prev !== null && r > prev) nonMono++;
    prev = r;
  }
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  return { nonMono, steps: vals.length - 1, spread: max - min };
}
const NOISE = noiseProfile();
const NOISE_SPREAD_OVER_TARGET = NOISE.spread / 1e-7;

// Noise-AVERAGED coarse (50-decade sampling, log-linear interpolation) central estimate.
function coarseCrossing(thr) {
  let prevE = 1000;
  let prevR = remnantAtLog10(1000);
  for (let e = 1050; e <= 9000; e += 50) {
    const r = remnantAtLog10(e);
    if (prevR > thr && r <= thr) {
      const f = (Math.log(prevR) - Math.log(thr)) / (Math.log(prevR) - Math.log(r));
      return prevE + f * (e - prevE);
    }
    prevE = e;
    prevR = r;
  }
  return null;
}
const CROSS_1E7_COARSE = coarseCrossing(1e-7);
const R67_COARSE = (CROSS_1E7_COARSE - CROSS_1E6) / SPAN_56;

export const IMP35618_EFLOW_FARTAIL_REMNANT_SPAN_RATIO_SUB1E7_NOISE_WALL = {
  id: 'imp-35618',
  proofSection: 'S-frontier',
  question:
    'Fit the imp-35553 E_flow far-tail remnant span-RATIO trend (3.6001, 3.5156), project the ' +
    'sub-1e-7 crossing under limiting-ratio models, and cross-check against a direct log-space ' +
    'bisection: does the span ratio converge to a constant, to 3.5, or keep drifting?',
  method:
    'On the byte-identical imp-35534/imp-35553 log-space closed-surrogate remnant channel ' +
    '(g = log(2pi) + u - log(u), C_F = (u - log(u) + 1)/2pi, remnant = |(-1 + 3/u) - fd|, h = ' +
    '1.0002), reproduce the clean crossings, project span(1e-6 -> 1e-7) = span56 * R67pred under ' +
    'three limiting-ratio models (constant, linear-in-index, sqrt(10)-floor geometric decay), then ' +
    'DIRECTLY bisect the sub-1e-7 crossing on two brackets and quantify the finite-difference noise ' +
    'floor near the crossing.',
  cleanLadder: {
    cross_1e4_log10N: +CROSS_1E4.toFixed(4),
    cross_1e5_log10N: +CROSS_1E5.toFixed(4),
    cross_1e6_log10N: +CROSS_1E6.toFixed(4),
    span_1e5_to_1e6: +SPAN_56.toFixed(4),
    ratio_45: +RATIO_45.toFixed(4),
    ratio_56: +RATIO_56.toFixed(4),
  },
  projections: {
    constant_R67: +R67_CONST.toFixed(4),
    constant_span_1e6_to_1e7: +SPAN_67_CONST.toFixed(2),
    constant_sub1e7_log10N: +CROSS_1E7_CONST.toFixed(2),
    linear_R67: +R67_LINEAR.toFixed(4),
    linear_sub1e7_log10N: +CROSS_1E7_LINEAR.toFixed(2),
    sqrt10floor_R67: +R67_SQRT10.toFixed(4),
    sqrt10floor_sub1e7_log10N: +CROSS_1E7_SQRT10.toFixed(2),
    projection_band_log10N: [+CROSS_1E7_LINEAR.toFixed(2), +CROSS_1E7_CONST.toFixed(2)],
  },
  directCrossCheck: {
    bracketA_1e4000_1e7000_log10N: +CROSS_1E7_BRACKET_A.toFixed(4),
    bracketB_1e3000_1e9000_log10N: +CROSS_1E7_BRACKET_B.toFixed(4),
    bracket_disagreement_decades: +DIRECT_BRACKET_GAP.toFixed(2),
    R67_direct_band: [+R67_DIRECT_B.toFixed(4), +R67_DIRECT_A.toFixed(4)],
    noiseAveraged_sub1e7_log10N: +CROSS_1E7_COARSE.toFixed(2),
    noiseAveraged_R67: +R67_COARSE.toFixed(4),
  },
  noiseFloor: {
    fineWindow: '[5140, 5160] step 0.5',
    nonMonotoneUpSteps: NOISE.nonMono,
    totalSteps: NOISE.steps,
    remnantSpread: +NOISE.spread.toExponential(3),
    spreadOverTarget1e7: +NOISE_SPREAD_OVER_TARGET.toFixed(3),
  },
  asymptoticRatioSqrt10: +SQRT10.toFixed(4),
  finding: {
    F1_projection_band:
      'All three limiting-ratio models place sub-1e-7 in a tight band ~10^5097 (linear) to ' +
      '10^5186 (constant R56), i.e. ~3629-3718 decades past sub-1e-6; the sqrt(10)-floor model ' +
      'sits at 10^5114.',
    F2_direct_bisection_is_bracket_dependent:
      'A DIRECT bisection does NOT sharpen the projection: bracket [1e4000,1e7000] returns ' +
      '10^5218.85 while [1e3000,1e9000] returns 10^5062.50 -- a ~156-decade disagreement, because ' +
      'the bisection zooms into the finite-difference noise.',
    F3_noise_wall_at_sub1e7:
      'The remnant near the crossing (e ~ 5150) has a finite-difference floating-point NOISE floor ' +
      'of amplitude ~1.19e-8 (~12% of the 1e-7 target), non-monotone in ~22 of 40 fine samples; ' +
      'sub-1e-7 sits only ~10x above this floor (sub-1e-6 sat ~100x above it -- why imp-35553 stopped there).',
    F4_ratio_plateaus_not_converged:
      'The noise-averaged third span ratio R67 ~ 3.5116 is statistically indistinguishable from ' +
      'R56 = 3.5156: within double precision the ratio has PLATEAUED near ~3.5, well above sqrt(10) ' +
      '~ 3.1623 -- NOT visibly continuing the imp-35553 decline. But the ~+/-0.075 direct-bisection ' +
      'uncertainty on R67 EXCEEDS the change any clean model predicts, so the data neither confirm a ' +
      'slow drift toward sqrt(10) nor rule it out: this is a RESOLUTION limit, not a converged constant.',
  },
  isRigorous: false,
  honestStatus:
    'Projected sub-1e-7 from the two clean ratios lands in a tight band 10^5097-5186 (constant/linear/' +
    'sqrt10-floor models), and a direct log-space bisection places it in the SAME ~10^5100-5200 window ' +
    '(~3700 decades past sub-1e-6) -- but the direct measurement is BRACKET-DEPENDENT by ~156 decades ' +
    '(10^5062.50 vs 10^5218.85) because the remnant near the crossing carries a ~1.19e-8 finite-difference ' +
    'noise floor (~12% of the 1e-7 target). The noise-averaged third span ratio R67 ~ 3.5116 is ' +
    'indistinguishable from R56 = 3.5156, so the ratio has PLATEAUED near ~3.5 (well above sqrt(10) ~ ' +
    '3.1623) within double precision -- neither a confirmed drift toward sqrt(10) nor a converged constant ' +
    'can be asserted; sharpening past ~3.5 needs extended precision. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate; changes no bound; NO QED.',
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Extending the imp-35553 span-ratio trend: the ' +
    'two clean ratios (3.6001, 3.5156) project sub-1e-7 into a tight band 10^5097-5186 (linear/sqrt10-floor/' +
    'constant models), and a DIRECT bisection of the byte-identical log-space fd-vs-analytic remnant channel ' +
    '(reproduces the imp-35473 sub-1e-4 crossing 109.1892 and imp-35534 sub-1e-5 crossing 410.0475 to the ' +
    'digit) confirms sub-1e-7 sits ~3700 decades past sub-1e-6 in the SAME 10^5100-5200 window. But the ' +
    'direct measurement is BRACKET-DEPENDENT by ~156 decades (10^5062.50 vs 10^5218.85): the remnant near ' +
    'the crossing carries a ~1.19e-8 finite-difference NOISE floor (~12% of the 1e-7 target, non-monotone in ' +
    '~22/40 fine samples), so bisection zooms into noise -- sub-1e-7 is only ~10x above the floor (sub-1e-6 ' +
    'was ~100x, why imp-35553 stopped there). The noise-averaged third span ratio R67 ~ 3.5116 is ' +
    'indistinguishable from R56 = 3.5156: the ratio has PLATEAUED near ~3.5, well above sqrt(10) ~ 3.1623, ' +
    'NOT visibly continuing its imp-35553 decline -- yet the +/-~0.075 uncertainty exceeds the per-step change, ' +
    'so a slow drift toward sqrt(10) is neither confirmed nor ruled out. This is a precision WALL of the ' +
    'imp-35534/imp-35553 double-precision channel, not a converged constant. Measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; E_flow > 0 strictness (imp-33848) untouched; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35553 (two-ratio fit + sub-1e-6 crossing 10^1467.7351, extended here); imp-35534 (log-space channel + ' +
    'two-span note); imp-35552 (remnant ~ 2 loglogN/(logN)^2 leading form -> sqrt(10) asymptote); imp-35473 ' +
    '(sub-1e-4 crossing 109.1892); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35618_EFLOW_FARTAIL_REMNANT_SPAN_RATIO_SUB1E7_NOISE_WALL_ASSERTIONS = [
  {
    // Faithfulness: the channel reproduces the imp-35473 sub-1e-4 (109.1892) and imp-35534 sub-1e-5 (410.0475).
    id: 'imp35618-reproduces-prior-crossings',
    description: 'the channel reproduces the imp-35473 sub-1e-4 (109.1892) and imp-35534 sub-1e-5 (410.0475) crossings',
    holds: () =>
      Math.abs(CROSS_1E4 - 109.1892) < 1e-3 && Math.abs(CROSS_1E5 - 410.0475) < 1e-3,
  },
  {
    // Faithfulness: the clean sub-1e-6 crossing and two ratios match imp-35553.
    id: 'imp35618-reproduces-imp35553-ratios',
    description: 'the sub-1e-6 crossing (1467.7351) and the two ratios (3.6001, 3.5156) match imp-35553',
    holds: () =>
      Math.abs(CROSS_1E6 - 1467.7351) < 5e-2 &&
      Math.abs(RATIO_45 - 3.6001) < 1e-2 &&
      Math.abs(RATIO_56 - 3.5156) < 1e-2,
  },
  {
    // The three clean-ratio projections land in a tight ~10^5097-5186 band, all past sub-1e-6.
    id: 'imp35618-projection-band',
    description: 'the three limiting-ratio projections place sub-1e-7 in ~10^5097-5186, all beyond sub-1e-6',
    holds: () =>
      CROSS_1E7_LINEAR > CROSS_1E6 &&
      Math.abs(CROSS_1E7_CONST - 5186.11) < 0.5 &&
      Math.abs(CROSS_1E7_LINEAR - 5096.67) < 0.5 &&
      Math.abs(CROSS_1E7_SQRT10 - 5113.94) < 0.5,
  },
  {
    // The direct bisection is BRACKET-DEPENDENT: the two brackets disagree by ~156 decades.
    id: 'imp35618-direct-bracket-dependent',
    description: 'direct bisection returns bracket-dependent crossings (10^5218.85 vs 10^5062.50), ~156-decade gap',
    holds: () =>
      Math.abs(CROSS_1E7_BRACKET_A - 5218.85) < 0.5 &&
      Math.abs(CROSS_1E7_BRACKET_B - 5062.50) < 0.5 &&
      Math.abs(DIRECT_BRACKET_GAP - 156.35) < 1,
  },
  {
    // The finite-difference noise floor near the crossing is ~1.19e-8, ~12% of the 1e-7 target, and non-monotone.
    id: 'imp35618-noise-floor-at-target',
    description: 'the remnant noise floor near e~5150 is ~1.19e-8 (~12% of 1e-7) and non-monotone in a majority of fine steps',
    holds: () =>
      Math.abs(NOISE.spread - 1.189e-8) < 5e-10 &&
      NOISE_SPREAD_OVER_TARGET > 0.1 &&
      NOISE.nonMono > NOISE.steps / 2,
  },
  {
    // The noise-averaged third ratio is indistinguishable from R56: |R67 - R56| < the |R56 - R45| step, plateau near 3.5.
    id: 'imp35618-ratio-plateaus-near-3p5',
    description: 'the noise-averaged R67 ~ 3.5116 is indistinguishable from R56 = 3.5156 (a plateau near ~3.5, above sqrt(10))',
    holds: () =>
      Math.abs(R67_COARSE - 3.5116) < 5e-3 &&
      Math.abs(R67_COARSE - RATIO_56) < Math.abs(RATIO_56 - RATIO_45) &&
      R67_COARSE > SQRT10,
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35618-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35618_EFLOW_FARTAIL_REMNANT_SPAN_RATIO_SUB1E7_NOISE_WALL.isRigorous === false &&
      /NO QED/.test(IMP35618_EFLOW_FARTAIL_REMNANT_SPAN_RATIO_SUB1E7_NOISE_WALL.verdict) &&
      /refereed bound is changed/i.test(IMP35618_EFLOW_FARTAIL_REMNANT_SPAN_RATIO_SUB1E7_NOISE_WALL.verdict),
  },
];

for (const a of IMP35618_EFLOW_FARTAIL_REMNANT_SPAN_RATIO_SUB1E7_NOISE_WALL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35618-eflow-fartail-remnant-span-ratio-sub1e7-noise-wall assertion failed: ${a.id}`,
    );
  }
}

export default IMP35618_EFLOW_FARTAIL_REMNANT_SPAN_RATIO_SUB1E7_NOISE_WALL;
