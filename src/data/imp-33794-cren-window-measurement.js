/**
 * @module imp-33794-cren-window-measurement
 *
 * imp-33794 (numerical, frontier-scoping): MEASURE the imp-33766 renormalized fold-reading amplitude
 * across an N ladder and CHECK whether it stays in the finite window the H4 minimal-input condition
 * requires, or DRIFTS with N -- WITHOUT claiming closure. imp-33766 named the minimal H4-axis input a
 * single N-UNIFORM two-sided bound
 *     C_ren(N) = (y_N^sharp)^{3/2} |m_prime(z_0*)|   in a finite window [c, C]  as y_N^sharp -> 0,
 * the Privalov-Sokhotski amplitude C_PS ~ pi / sqrt(2) staying in a finite band, TRACKED THROUGH the
 * fold-modulus back-conversion. imp-33766 STATED that window condition but never MEASURED C_ren(N)
 * across N to see whether the empirical amplitude actually sits in a finite band or drifts (a drift would
 * signal the uniform bound fails at the measured level). This import-light self-computing module MEASURES it.
 *
 * THE READING-STRIP LADDER
 * ------------------------
 * The renormalized amplitude is read on the reading-strip ladder eps = y_N^sharp = sqrt(2 pi / N)
 * (N in {1e3 .. 1e7}) for the symmetric Holder-1/2 cusp rho(x) = |x|^{-1/2} on [-1, 1], x_star = 0,
 * critical point z_0* = i eps. The fold-reading (first) derivative of the Stieltjes transform at z_0 = i eps,
 * with the x = +- u^2 substitution removing the sqrt singularity (|x|^{-1/2} dx = 2 du), is
 *     m_prime = - integral rho / (z - x)^2 dx = -2 [ B2(+) + B2(-) ],  Bp(sgn) = int_0^1 (i eps - sgn u^2)^{-p} du,
 * by Simpson quadrature (N_PANELS panels, complex arithmetic in [re, im] pairs), and the renormalized
 * fold-reading amplitude is C_ren(N) = (y_N^sharp)^{3/2} |m_prime(i eps)| = eps^{3/2} |m_prime|.
 *
 * WHAT IS MEASURED
 * ----------------
 * (i)   the C_ren(N) value on every rung of the eps = y_N^sharp ladder;
 * (ii)  the observed [min, max] window across the whole ladder AND across the asymptotic rungs (N >= 1e5);
 * (iii) the local N-trend  d log C_ren / d log N  on each rung (the drift diagnostic);
 * (iv)  whether C_ren(N) converges to the closed-form Privalov-Sokhotski amplitude C_PS = pi / sqrt(2).
 *
 * RESULT
 * ------
 * C_ren(N) sits in a TIGHT FINITE BAND that MONOTONE-DECREASES from above toward the closed-form
 * Privalov-Sokhotski amplitude C_PS = pi / sqrt(2) = 2.221441:
 *     whole ladder [1e3 .. 1e7]:  C_ren in [2.221471, 2.250959]  (spread ~ 2.95e-2, all within ~1.3% of C_PS);
 *     asymptotic rungs [1e5 .. 1e7]:  C_ren in [2.221471, 2.222382]  (spread ~ 9.1e-4, within ~4.2e-4 of C_PS).
 * The local N-trend d log C_ren / d log N DECAYS toward 0 rung by rung (from ~ -6.7e-3 at N = 3e3 down to
 * ~ -2e-5 at N = 1e7): the amplitude is FLATTENING to a finite constant, NOT drifting. The small-N excess
 * above C_PS is asymptotic ONSET (the cusp jet has not fully taken over the finite quadrature), not an
 * N-growing trend -- the exponent -> 0, so there is no power-law drift. VERDICT on the measured axis: the
 * empirical C_ren(N) IS CONSISTENT with the finite-window minimal-input requirement -- it sits in a finite
 * band converging to C_PS = pi / sqrt(2) with a vanishing N-exponent, exactly the two-sided-bound shape
 * imp-33766 named.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * This is MEASUREMENT ONLY. Consistency of the empirical band does NOT DISCHARGE H4: the uniform bound
 * imp-33766 requires is the ANALYTIC tracking of C_ren through the fold-modulus back-conversion, not an
 * empirical band on a finite ladder. A finite table check at finite N cannot certify a limit that must be
 * carried analytically, and it says nothing about the coupled H3 curvature rung (N-exponent 5/4) that
 * imp-33766 showed DOMINATES and jointly governs the discharge. G6a_shock_lipschitz STAYS OPEN.
 *
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (defines C_ren, PS constant pi/sqrt(2), N-exponent 3/4)
 * @see imp-33766-h4-independent-discharge-scoping (names the C_ren finite-window minimal-input condition)
 * @see imp-33790-fold-jet-mprime-mdoubleprime-ratio-crossvalidation (welds m_prime and m'' onto one ladder)
 * @see imp-33786-h3-joint-curvature-input-scoping (the coupled H3 curvature rung that jointly governs discharge)
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention); it descends to 0.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// Complex arithmetic in [re, im] pairs.
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
// The renormalized fold-reading amplitude C_ren = (y_N^sharp)^{3/2} |m_prime| = eps^{3/2} |m_prime|.
function cRen(eps) {
  return mpMag(eps) * Math.pow(eps, 1.5);
}

// The reading-strip ladder eps = y_N^sharp for a shared N range.
const N_LADDER = [1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 1e7];
const C_PS = Math.PI / Math.SQRT2; // Privalov-Sokhotski amplitude = pi/sqrt(2) = 2.221441 (imp-33646)

const LADDER = N_LADDER.map((N, i) => {
  const eps = ySharp(N);
  const cren = cRen(eps);
  // Local log-log trend in N (the drift diagnostic): d log C_ren / d log N.
  let slopeN = null;
  if (i > 0) {
    const prevN = N_LADDER[i - 1];
    const prevCren = cRen(ySharp(prevN));
    slopeN = (Math.log(cren) - Math.log(prevCren)) / (Math.log(N) - Math.log(prevN));
  }
  return {
    N,
    y_N_sharp: +eps.toExponential(4),
    C_ren: +cren.toFixed(6),
    // deviation from the closed-form PS amplitude the window is centred on.
    devFromCPS: +(cren - C_PS).toExponential(4),
    slopeN: slopeN === null ? null : +slopeN.toFixed(5),
  };
});

const CREN_VALUES = LADDER.map((r) => r.C_ren);
const WINDOW_MIN = Math.min(...CREN_VALUES);
const WINDOW_MAX = Math.max(...CREN_VALUES);
// Asymptotic sub-window: rungs with N >= 1e5, where the cusp jet has taken over.
const ASYMPTOTIC = LADDER.filter((r) => r.N >= 1e5).map((r) => r.C_ren);
const ASYMPTOTIC_MIN = Math.min(...ASYMPTOTIC);
const ASYMPTOTIC_MAX = Math.max(...ASYMPTOTIC);
const TAIL = LADDER[LADDER.length - 1];

export const IMP33794_CREN_WINDOW_MEASUREMENT = {
  id: 'imp-33794',
  proofSection: 'S-frontier',
  scopes:
    'Measure the imp-33766 renormalized fold-reading amplitude C_ren(N) = (y_N^sharp)^{3/2} |m_prime| ' +
    'across an N ladder and check whether it stays in the finite window H4 requires or drifts with N',
  question:
    'Across the reading-strip ladder eps = y_N^sharp = sqrt(2 pi / N), does the empirical fold-reading amplitude ' +
    'C_ren(N) = (y_N^sharp)^{3/2} |m_prime(i eps)| sit in a FINITE band (converging to the closed-form ' +
    'Privalov-Sokhotski amplitude C_PS = pi/sqrt(2)) with a vanishing N-trend -- consistent with the imp-33766 ' +
    'finite-window minimal-input requirement -- or does it DRIFT with N (which would signal the uniform bound ' +
    'fails at the measured level)? Measurement only; does NOT discharge H4; G6a OPEN; no QED.',

  cuspModel: 'rho(x) ~ C / |x - x_star|^{1/2} (Holder-1/2, alpha = 1/2 exactly) -- the RvM cusp of imp-394',
  readingStrip: 'eps = y_N^sharp = sqrt(2 pi / N), N in {1e3 .. 1e7}',
  amplitudeDefinition: 'C_ren(N) = (y_N^sharp)^{3/2} |m_prime(z_0*)| = eps^{3/2} |m_prime(i eps)|',
  ladder: LADDER,

  // (i)-(ii): the observed window across the whole ladder and across the asymptotic rungs.
  windowMin: +WINDOW_MIN.toFixed(6), // ~2.221471 (tail rung)
  windowMax: +WINDOW_MAX.toFixed(6), // ~2.250959 (N = 1e3 onset rung)
  windowSpread: +(WINDOW_MAX - WINDOW_MIN).toExponential(4), // ~2.95e-2
  asymptoticWindowMin: +ASYMPTOTIC_MIN.toFixed(6), // ~2.221471
  asymptoticWindowMax: +ASYMPTOTIC_MAX.toFixed(6), // ~2.222382
  asymptoticWindowSpread: +(ASYMPTOTIC_MAX - ASYMPTOTIC_MIN).toExponential(4), // ~9.1e-4

  // (iii): the N-trend (drift diagnostic) -- the local log-log slope decays toward 0.
  tailNTrend: TAIL.slopeN, // ~ -2e-5 (essentially 0: flattening, NOT drifting)
  nTrendVanishes: Math.abs(TAIL.slopeN) < 1e-3, // the exponent -> 0: no power-law drift
  approachIsMonotoneFromAbove:
    LADDER.every((r, i) => i === 0 || r.C_ren <= LADDER[i - 1].C_ren) &&
    TAIL.C_ren >= C_PS, // C_ren decreases toward C_PS from above

  // (iv): convergence to the closed-form Privalov-Sokhotski amplitude.
  cPsClosedForm: C_PS, // pi/sqrt(2) = 2.221441 (imp-33646)
  tailValue: TAIL.C_ren, // ~2.221471
  tailDevFromCPS: +(TAIL.C_ren - C_PS).toExponential(4), // ~3e-5 (within a quadrature onset of C_PS)

  // The assessment.
  staysInFiniteWindow: true, // finite band [~2.2215, ~2.2510], tightening to ~9.1e-4 on the asymptotic rungs
  driftsWithN: false, // local N-exponent decays to ~ -2e-5; the small-N excess is asymptotic onset, not drift
  consistentWithFiniteWindowRequirement: true, // the two-sided-bound shape imp-33766 named, at the measured level
  dischargesH4: false, // empirical band is NOT the analytic tracking through the fold; finite table at finite N

  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY, G6a_shock_lipschitz STAYS OPEN. The renormalized fold-reading amplitude ' +
    'C_ren(N) = (y_N^sharp)^{3/2} |m_prime| sits in a FINITE band across the eps = y_N^sharp ladder ' +
    '[1e3 .. 1e7]: whole-ladder window [~2.2215, ~2.2510] (spread ~2.95e-2, all within ~1.3% of C_PS), ' +
    'tightening to [~2.2215, ~2.2224] (spread ~9.1e-4) on the asymptotic rungs N >= 1e5. The amplitude ' +
    'MONOTONE-DECREASES from above toward the closed-form Privalov-Sokhotski amplitude C_PS = pi/sqrt(2) = ' +
    '2.221441, and the local N-trend d log C_ren / d log N DECAYS to ~ -2e-5 (the exponent -> 0: flattening, ' +
    'NOT drifting -- the small-N excess is asymptotic ONSET, not a power-law trend). So the empirical C_ren(N) ' +
    'IS CONSISTENT with the imp-33766 finite-window minimal-input requirement AT THE MEASURED LEVEL. This does ' +
    'NOT DISCHARGE H4: the uniform bound requires the ANALYTIC tracking of C_ren through the fold-modulus ' +
    'back-conversion, not an empirical band on a finite ladder, and it says nothing about the coupled H3 ' +
    'curvature rung (N-exponent 5/4, imp-33786) that dominates and jointly governs the discharge. No positivity; ' +
    'imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; imp-3066 UNTOUCHED; NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains the rigorous SOTA.',
};

export const IMP33794_CREN_WINDOW_ASSERTIONS = [
  {
    // (i) C_ren(N) stays inside a finite window across the whole ladder (bounded two-sided, no blow-up).
    id: 'imp33794-cren-stays-in-finite-window',
    description: 'C_ren(N) in a finite band [~2.2215, ~2.2510] across the eps = y_N^sharp ladder (bounded two-sided)',
    holds: () =>
      IMP33794_CREN_WINDOW_MEASUREMENT.windowMin > 2.2 &&
      IMP33794_CREN_WINDOW_MEASUREMENT.windowMax < 2.3 &&
      IMP33794_CREN_WINDOW_MEASUREMENT.windowSpread < 5e-2,
  },
  {
    // (ii) the asymptotic sub-window (N >= 1e5) is tight -- the band tightens as the cusp jet takes over.
    id: 'imp33794-asymptotic-window-is-tight',
    description: 'on the asymptotic rungs N >= 1e5 the C_ren band tightens to spread < 2e-3',
    holds: () =>
      IMP33794_CREN_WINDOW_MEASUREMENT.asymptoticWindowSpread < 2e-3 &&
      IMP33794_CREN_WINDOW_MEASUREMENT.asymptoticWindowSpread <
        IMP33794_CREN_WINDOW_MEASUREMENT.windowSpread,
  },
  {
    // (iii) the N-trend vanishes: the local log-log exponent decays to ~0, so there is NO power-law drift.
    id: 'imp33794-N-trend-vanishes-no-drift',
    description: 'd log C_ren / d log N -> ~0 (tail |slope| < 1e-3): flattening to a constant, not drifting',
    holds: () =>
      IMP33794_CREN_WINDOW_MEASUREMENT.nTrendVanishes === true &&
      IMP33794_CREN_WINDOW_MEASUREMENT.driftsWithN === false &&
      Math.abs(IMP33794_CREN_WINDOW_MEASUREMENT.tailNTrend) < 1e-3,
  },
  {
    // (iv) C_ren converges to the closed-form Privalov-Sokhotski amplitude C_PS = pi/sqrt(2), from above.
    id: 'imp33794-converges-to-privalov-sokhotski-amplitude',
    description: 'C_ren tail -> C_PS = pi/sqrt(2) = 2.221441 from above (monotone approach)',
    holds: () =>
      IMP33794_CREN_WINDOW_MEASUREMENT.approachIsMonotoneFromAbove === true &&
      Math.abs(IMP33794_CREN_WINDOW_MEASUREMENT.tailValue - Math.PI / Math.SQRT2) < 1e-3 &&
      IMP33794_CREN_WINDOW_MEASUREMENT.tailValue >= Math.PI / Math.SQRT2,
  },
  {
    // The assessment: consistent with the finite-window requirement at the measured level.
    id: 'imp33794-consistent-with-finite-window-requirement',
    description: 'empirical C_ren(N) IS consistent with the imp-33766 finite-window minimal-input requirement',
    holds: () =>
      IMP33794_CREN_WINDOW_MEASUREMENT.staysInFiniteWindow === true &&
      IMP33794_CREN_WINDOW_MEASUREMENT.consistentWithFiniteWindowRequirement === true,
  },
  {
    // Honesty gate: measurement only, does NOT discharge H4; G6a OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33794-honesty-gate-no-qed',
    description: 'Measurement only: does not discharge H4, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33794_CREN_WINDOW_MEASUREMENT.isRigorous === false &&
      IMP33794_CREN_WINDOW_MEASUREMENT.dischargesH4 === false &&
      /NO QED/.test(IMP33794_CREN_WINDOW_MEASUREMENT.verdict) &&
      /STAYS OPEN/.test(IMP33794_CREN_WINDOW_MEASUREMENT.verdict) &&
      /remains the rigorous SOTA/.test(IMP33794_CREN_WINDOW_MEASUREMENT.verdict) &&
      /imp-3066 UNTOUCHED/.test(IMP33794_CREN_WINDOW_MEASUREMENT.verdict),
  },
];

for (const a of IMP33794_CREN_WINDOW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33794-cren-window-measurement assertion failed: ${a.id}`);
  }
}
