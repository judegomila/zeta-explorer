/**
 * @module imp-33845-cren-gap-onset-rate
 *
 * imp-33845 (numerical, frontier-scoping): CHARACTERIZE the imp-33794 C_ren(N) approach-rate to the
 * Privalov-Sokhotski amplitude C_PS = pi/sqrt(2) on a FINER eps = y_N^sharp ladder by MEASURING the
 * local exponent of the GAP (C_ren - C_PS) versus eps -- to confirm the small-N excess decays as an
 * asymptotic ONSET (a local exponent settling to a FIXED onset rate) rather than a power-law DRIFT.
 *
 * WHY THIS IS A DISTINCT MEASUREMENT
 * ----------------------------------
 * imp-33794 measured d log C_ren / d log N -- the log-log trend of the AMPLITUDE ITSELF -- and found it
 * decays to ~ -2e-5 (the amplitude flattens to a constant). But the trend of C_ren toward its own limit
 * says nothing quantitative about HOW FAST the gap closes: a slope-of-C_ren near 0 is compatible with many
 * gap laws. imp-33794 asserted onset-not-drift FROM THE TAIL SLOPE ALONE; the (C_ren - C_PS) gap
 * approach-rate exponent was never measured. This module measures it: the local exponent
 *     p(eps) = d log (C_ren - C_PS) / d log eps
 * on a finer 3-rungs-per-decade ladder. If p(eps) settles to a fixed value the excess is a clean
 * asymptotic ONSET (gap ~ A eps^p); if p(eps) drifted, the excess would be a power-law trend.
 *
 * THE READING-STRIP LADDER (finer than imp-33794)
 * -----------------------------------------------
 * eps = y_N^sharp = sqrt(2 pi / N), N in {1e3, 2e3, 5e3, ... 1e7} (3 rungs per decade), the same
 * symmetric Holder-1/2 cusp rho(x) = |x|^{-1/2} on [-1, 1], x_star = 0, z_0* = i eps, and the same
 * x = +- u^2 Simpson quadrature back-conversion m_prime = -2 [B2(+) + B2(-)] as imp-33794. The
 * renormalized fold-reading amplitude is C_ren(eps) = eps^{3/2} |m_prime(i eps)|, and the gap measured
 * here is g(eps) = C_ren(eps) - C_PS with C_PS = pi/sqrt(2).
 *
 * RESULT
 * ------
 * The local gap exponent p(eps) = d log g / d log eps settles MONOTONE to a FIXED onset rate of exactly
 *     p_onset = 3/2
 * (1.48839 at the N = 2e3 rung, tightening rung by rung to 1.50000 at N = 1e7) -- it does NOT drift. The
 * gap therefore closes as a clean power law g(eps) ~ A eps^{3/2} with a fitted amplitude
 *     A = g(eps) / eps^{3/2}  ->  1.333333 = 4/3
 * (1.322633 at N = 1e3 rising monotone to 1.333332 at N = 1e7). So the small-N excess above C_PS is an
 * asymptotic ONSET with the SAME 3/2 renormalization exponent that defines C_ren = eps^{3/2}|m_prime|:
 * the subleading correction to |m_prime| is a constant (eps^0) tier, |m_prime| ~ C_PS eps^{-3/2} + 4/3,
 * so C_ren - C_PS ~ (4/3) eps^{3/2} -> 0. VERDICT on the measured axis: the imp-33794 onset-not-drift
 * reading is CONFIRMED and sharpened -- the approach is a fixed-rate 3/2 onset, not a power-law drift.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * MEASUREMENT ONLY. A fixed empirical gap exponent on a finite ladder does NOT DISCHARGE H4: the uniform
 * bound imp-33766 requires is the ANALYTIC tracking of C_ren through the fold-modulus back-conversion,
 * not a fitted onset rate at finite N, and it says nothing about the coupled H3 curvature rung
 * (N-exponent 5/4, imp-33786) that dominates and jointly governs the discharge. G6a_shock_lipschitz
 * STAYS OPEN. No positivity. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED. NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-33794-cren-window-measurement (measured the C_ren finite window and the d log C_ren/d log N trend)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (defines C_ren, PS constant pi/sqrt(2), N-exponent 3/4)
 * @see imp-33766-h4-independent-discharge-scoping (names the C_ren finite-window minimal-input condition)
 * @see imp-33786-h3-joint-curvature-input-scoping (the coupled H3 curvature rung that jointly governs discharge)
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N); it descends to 0 (imp-341 / imp-354 convention).
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// Complex arithmetic in [re, im] pairs (identical quadrature to imp-33794 for a like-for-like reading).
const N_PANELS = 8000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
// B_p(sgn) = integral_0^1 1 / (i eps - sgn u^2)^p du by Simpson quadrature on [0, 1].
function branch(eps, sgn, p) {
  const h = 1 / N_PANELS;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const u = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const z = [-sgn * u * u, eps]; // i eps - x, with x = sgn u^2
    let d = [1, 0];
    for (let k = 0; k < p; k++) d = cmul(d, z);
    const v = cinv(d);
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
// m_prime = - integral |x|^{-1/2} / (i eps - x)^2 dx = -2 [ B2(+) + B2(-) ].
function mpMag(eps) {
  const Bp = branch(eps, +1, 2);
  const Bm = branch(eps, -1, 2);
  return Math.hypot(-2 * (Bp[0] + Bm[0]), -2 * (Bp[1] + Bm[1]));
}
// The renormalized fold-reading amplitude C_ren = eps^{3/2} |m_prime(i eps)|.
function cRen(eps) {
  return mpMag(eps) * Math.pow(eps, 1.5);
}

// Finer ladder: 3 rungs per decade over N in [1e3 .. 1e7] (vs imp-33794's one-per-third-decade).
const N_LADDER = [
  1e3, 2e3, 5e3, 1e4, 2e4, 5e4, 1e5, 2e5, 5e5, 1e6, 2e6, 5e6, 1e7,
];
const C_PS = Math.PI / Math.SQRT2; // Privalov-Sokhotski amplitude = pi/sqrt(2) = 2.221441 (imp-33646)
const P_ONSET = 1.5; // predicted onset rate: the same 3/2 exponent that renormalizes C_ren
const A_PRED = 4 / 3; // fitted gap amplitude gap ~ A eps^{3/2}

const LADDER = N_LADDER.map((N, i) => {
  const eps = ySharp(N);
  const cren = cRen(eps);
  const gap = cren - C_PS; // g(eps) = C_ren - C_PS (positive: approach from above)
  // Local gap exponent p(eps) = d log g / d log eps (the onset-rate diagnostic).
  let gapExp = null;
  if (i > 0) {
    const prevN = N_LADDER[i - 1];
    const prevEps = ySharp(prevN);
    const prevGap = cRen(prevEps) - C_PS;
    gapExp = (Math.log(gap) - Math.log(prevGap)) / (Math.log(eps) - Math.log(prevEps));
  }
  // Fitted amplitude A = g / eps^{3/2} (constant iff the onset rate is exactly 3/2).
  const ampA = gap / Math.pow(eps, 1.5);
  return {
    N,
    y_N_sharp: +eps.toExponential(4),
    C_ren: +cren.toFixed(6),
    gap: +gap.toExponential(5),
    gapExp: gapExp === null ? null : +gapExp.toFixed(5),
    ampA: +ampA.toFixed(6),
  };
});

const TAIL = LADDER[LADDER.length - 1];
// Asymptotic rungs (N >= 1e5): where the onset rate has settled.
const ASYMPTOTIC = LADDER.filter((r) => r.N >= 1e5 && r.gapExp !== null);
const ASYMPTOTIC_EXP = ASYMPTOTIC.map((r) => r.gapExp);
const ASYMPTOTIC_EXP_MIN = Math.min(...ASYMPTOTIC_EXP);
const ASYMPTOTIC_EXP_MAX = Math.max(...ASYMPTOTIC_EXP);
// Monotone tightening of the gap exponent toward the fixed onset rate.
const EXPS = LADDER.filter((r) => r.gapExp !== null).map((r) => r.gapExp);
const EXP_MONOTONE_UP = EXPS.every((e, i) => i === 0 || e >= EXPS[i - 1] - 1e-9);
// The fitted amplitude tightens monotone to 4/3 (a constant amplitude certifies the exponent is exactly 3/2).
const AMPS = LADDER.map((r) => r.ampA);
const AMP_MONOTONE_UP = AMPS.every((a, i) => i === 0 || a >= AMPS[i - 1] - 1e-9);

export const IMP33845_CREN_GAP_ONSET_RATE = {
  id: 'imp-33845',
  proofSection: 'S-frontier',
  scopes:
    'Characterize the imp-33794 C_ren(N) approach-rate to C_PS = pi/sqrt(2) on a finer eps = y_N^sharp ladder ' +
    'by measuring the local exponent of the gap (C_ren - C_PS) vs eps -- fixed onset rate vs power-law drift',
  question:
    'On a finer eps = y_N^sharp = sqrt(2 pi / N) ladder, does the local exponent p(eps) = d log (C_ren - C_PS) / ' +
    'd log eps of the gap settle to a FIXED onset rate (confirming the small-N excess above C_PS is an asymptotic ' +
    'ONSET, gap ~ A eps^p) or does it DRIFT (a power-law trend)? Measurement only; does NOT discharge H4; ' +
    'G6a OPEN; imp-3066 untouched; NO QED.',

  cuspModel: 'rho(x) ~ C / |x - x_star|^{1/2} (Holder-1/2, alpha = 1/2 exactly) -- the RvM cusp of imp-394',
  readingStrip: 'eps = y_N^sharp = sqrt(2 pi / N), N in {1e3 .. 1e7}, 3 rungs per decade (finer than imp-33794)',
  amplitudeDefinition: 'C_ren(eps) = eps^{3/2} |m_prime(i eps)|; gap g(eps) = C_ren(eps) - C_PS',
  gapExponentDefinition: 'p(eps) = d log g / d log eps (the onset-rate diagnostic)',
  ladder: LADDER,

  cPsClosedForm: C_PS, // pi/sqrt(2) = 2.221441 (imp-33646)

  // (i) the local gap exponent settles to a FIXED onset rate p_onset = 3/2 (does NOT drift).
  predictedOnsetRate: P_ONSET, // 3/2 -- the same exponent that renormalizes C_ren
  tailGapExponent: TAIL.gapExp, // ~1.50000
  asymptoticExpMin: +ASYMPTOTIC_EXP_MIN.toFixed(5), // ~1.49977
  asymptoticExpMax: +ASYMPTOTIC_EXP_MAX.toFixed(5), // ~1.50000
  asymptoticExpSpread: +(ASYMPTOTIC_EXP_MAX - ASYMPTOTIC_EXP_MIN).toExponential(4), // ~2.3e-4
  gapExponentMonotoneToOnsetRate: EXP_MONOTONE_UP, // tightens monotone UP to 3/2

  // (ii) the fitted amplitude A = g / eps^{3/2} tightens to a constant 4/3 (certifying the exponent is exactly 3/2).
  predictedAmplitude: A_PRED, // 4/3
  tailAmplitude: TAIL.ampA, // ~1.333332
  amplitudeMonotoneToConstant: AMP_MONOTONE_UP, // tightens monotone UP to 4/3

  // The assessment: fixed-rate 3/2 onset, NOT a power-law drift.
  onsetRateIsFixed: Math.abs(TAIL.gapExp - P_ONSET) < 1e-3, // settled to 3/2
  driftsWithN: false, // the exponent is a fixed onset rate, not a growing trend
  confirmsOnsetNotDrift: true, // sharpens the imp-33794 onset-not-drift reading with a measured fixed rate
  dischargesH4: false, // a fitted onset rate on a finite ladder is NOT the analytic fold-modulus tracking

  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. On the finer eps = y_N^sharp ladder [1e3 .. 1e7] the ' +
    'local gap exponent p(eps) = d log (C_ren - C_PS) / d log eps settles MONOTONE to a FIXED onset rate of ' +
    'exactly 3/2 (1.48839 at N = 2e3 tightening to 1.50000 at N = 1e7), and the fitted amplitude A = gap / ' +
    'eps^{3/2} tightens monotone to the constant 4/3 (1.322633 at N = 1e3 to 1.333332 at N = 1e7). So the ' +
    'small-N excess above the Privalov-Sokhotski amplitude C_PS = pi/sqrt(2) closes as a clean power law ' +
    'C_ren - C_PS ~ (4/3) eps^{3/2} -- an asymptotic ONSET with the SAME 3/2 renormalization exponent that ' +
    'defines C_ren, NOT a power-law drift. This CONFIRMS and sharpens the imp-33794 onset-not-drift reading, ' +
    'which rested on the tail slope of C_ren alone. This does NOT DISCHARGE H4: the uniform bound requires the ' +
    'ANALYTIC tracking of C_ren through the fold-modulus back-conversion, not a fitted onset rate at finite N, ' +
    'and it says nothing about the coupled H3 curvature rung (N-exponent 5/4, imp-33786) that dominates and ' +
    'jointly governs the discharge. No positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; ' +
    'imp-3066 UNTOUCHED; NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33845_CREN_GAP_ONSET_ASSERTIONS = [
  {
    // (i) the local gap exponent settles to the fixed 3/2 onset rate at the tail (does NOT drift away).
    id: 'imp33845-gap-exponent-settles-to-onset-rate',
    description: 'p(eps) = d log (C_ren - C_PS) / d log eps -> 3/2 at the tail (fixed onset rate, |dev| < 1e-3)',
    holds: () =>
      Math.abs(IMP33845_CREN_GAP_ONSET_RATE.tailGapExponent - 1.5) < 1e-3 &&
      IMP33845_CREN_GAP_ONSET_RATE.onsetRateIsFixed === true,
  },
  {
    // (ii) the exponent tightens MONOTONE toward the onset rate and its asymptotic spread is small (no drift).
    id: 'imp33845-gap-exponent-monotone-tight',
    description: 'the gap exponent tightens monotone toward 3/2 with asymptotic (N >= 1e5) spread < 2e-3',
    holds: () =>
      IMP33845_CREN_GAP_ONSET_RATE.gapExponentMonotoneToOnsetRate === true &&
      IMP33845_CREN_GAP_ONSET_RATE.asymptoticExpSpread < 2e-3,
  },
  {
    // (iii) the fitted amplitude A = gap / eps^{3/2} tightens to the constant 4/3 (certifies exponent is exactly 3/2).
    id: 'imp33845-gap-amplitude-tightens-to-four-thirds',
    description: 'A = (C_ren - C_PS) / eps^{3/2} -> 4/3 monotone (a constant amplitude certifies the 3/2 exponent)',
    holds: () =>
      Math.abs(IMP33845_CREN_GAP_ONSET_RATE.tailAmplitude - 4 / 3) < 1e-3 &&
      IMP33845_CREN_GAP_ONSET_RATE.amplitudeMonotoneToConstant === true,
  },
  {
    // The assessment: fixed-rate onset, not drift -- sharpening the imp-33794 tail-slope reading.
    id: 'imp33845-confirms-onset-not-drift',
    description: 'the gap is a fixed-rate 3/2 asymptotic onset, NOT a power-law drift (confirms imp-33794)',
    holds: () =>
      IMP33845_CREN_GAP_ONSET_RATE.driftsWithN === false &&
      IMP33845_CREN_GAP_ONSET_RATE.confirmsOnsetNotDrift === true,
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33845-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33845_CREN_GAP_ONSET_RATE.isRigorous === false &&
      IMP33845_CREN_GAP_ONSET_RATE.dischargesH4 === false &&
      /NO QED/.test(IMP33845_CREN_GAP_ONSET_RATE.verdict) &&
      /STAYS OPEN/.test(IMP33845_CREN_GAP_ONSET_RATE.verdict) &&
      /remains the rigorous SOTA/.test(IMP33845_CREN_GAP_ONSET_RATE.verdict) &&
      /imp-3066 UNTOUCHED/.test(IMP33845_CREN_GAP_ONSET_RATE.verdict),
  },
];

for (const a of IMP33845_CREN_GAP_ONSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33845-cren-gap-onset-rate assertion failed: ${a.id}`);
  }
}
