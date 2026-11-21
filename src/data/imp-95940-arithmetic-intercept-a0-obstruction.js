/**
 * @module imp-95940-arithmetic-intercept-a0-obstruction
 *
 * imp-95940 -- DERIVE or BOUND the O(1) arithmetic intercept a_0 (prime-sum constant)
 * of the saturated box number variance, to pin the imp-95921 C0 offset-crossing height to
 * a POINT rather than the RANGE [~5.8e17, ~1.36e28]; or record a PRECISE OBSTRUCTION to
 * pinning it. HONEST PARTIAL: this module does NOT pin a_0 to a point. It (i) reduces the
 * imp-95921 sub-gap from an opaque O(1) remainder to a SINGLE named scalar, (ii) writes the
 * crossing height as an explicit closed-form function of a_0 and exposes its
 * DOUBLE-EXPONENTIAL sensitivity, and (iii) records the two precise obstructions that block
 * both the empirical and the semiclassical routes. Assessment only; changes no bound; NO QED.
 *
 * SETUP (imp-95921). The saturated box number variance and its offset above the
 * single-endpoint Selberg term are
 *     Sigma^2_sat(T) = (1/pi^2) loglog(T/2pi) + (1/pi^2)(gamma + 1 + a_0),
 *     offset(T)      = Sigma^2_sat(T) - (1/2pi^2) loglog(T/2pi)
 *                    = (1/2pi^2) loglog(T/2pi) + (1/pi^2)(gamma + 1 + a_0).
 * imp-95921 pinned the loglog SLOPE 1/2pi^2 = 0.05066 analytically (the box has two
 * decorrelated endpoints, so its variance is 2 x Selberg Var S while offset subtracts one
 * endpoint) but left the additive O(1) arithmetic intercept (gamma + 1 + a_0) UNPINNED, so
 * the height where offset crosses C0 = 0.3337 (the max accessible offset) is a RANGE, not a
 * point -- the named sub-gap imp-95921-subgap-arithmetic-intercept. This module attacks a_0.
 *
 * STEP 1 -- REDUCE the sub-gap to ONE number: a_0 = b - gamma - 1, b = Fujii/Goldston const.
 * The saturated box variance equals TWICE the Selberg variance of S(T) = (1/pi) arg
 * zeta(1/2 + iT). The variance of S(T) has a RIGOROUS number-theoretic asymptotic
 * (Selberg; Goldston 1987; Fujii): Var S(T) = (1/2pi^2)(loglog(T/2pi) + b) + o(1), whose
 * additive constant b is a specific CONVERGENT PRIME SUM (an arithmetic constant, not the
 * smooth universal gamma + 1). Doubling gives Sigma^2_sat = (1/pi^2)(loglog(T/2pi) + b), so
 * matching the setup line term-by-term forces
 *     gamma + 1 + a_0 = b   ==>   a_0 = b - gamma - 1.
 * Thus a_0 is NOT a free O(1): pinning a_0 is EXACTLY pinning the Selberg-Goldston-Fujii
 * variance-of-S constant b. This collapses the sub-gap from an opaque remainder to a single
 * named scalar -- the (i) contribution -- and identifies the rigorous target.
 *
 * STEP 2 -- the EMPIRICAL back-out of a_0, and why it does NOT pin it (OBSTRUCTION 1).
 * Each accessible height gives a_0(T) = pi^2 * measuredVar(T) - loglog(T/2pi) - gamma - 1.
 * Over the six imp-95710 / imp-95562 heights T = 1e4..5e5 this yields
 *     a_0(T) in {0.2410, -0.3674, -0.6149, 0.5612, -0.1617, -0.3546},
 * a spread of ~1.18 that STRADDLES ZERO with mean -0.116. The per-height estimates disagree
 * by more than their own magnitude, i.e. the six accessible offsets are NOISE-DOMINATED and
 * do NOT resolve a_0 -- the exact same obstruction imp-95897 recorded as the R^2 = 0.0007
 * raw-slope regression. The empirical route therefore CANNOT pin a_0; it only brackets it.
 *
 * STEP 3 -- WHY the range spans ~40 orders: DOUBLE-EXPONENTIAL sensitivity (OBSTRUCTION 2).
 * Solving offset(T_x) = C0 for the crossing height gives the closed form
 *     T_x(a_0) = 2pi * exp( exp( 2pi^2 C0 - 2(gamma + 1 + a_0) ) ),
 * a DOUBLE exponential in a_0. Its log-sensitivity at the empirical mean is
 * d ln T_x / d a_0 ~ -78, so a shift of only Delta a_0 = 0.03 moves T_x by a factor ~10, and
 * the full empirical spread [-0.615, +0.561] sweeps T_x from ~6.4e46 down to ~1.5e5 (BELOW
 * 3e12). To fix T_x within a single order of magnitude one must pin a_0 to O(0.01) -- an
 * accuracy neither the noise-dominated data (spread ~1.18) NOR the semiclassical box model
 * (which supplies only the slope) can reach. This is the precise mechanism turning an
 * unpinned O(1) into the wide imp-95921 ceiling range; it is intrinsic, not a data defect.
 *
 * OBSTRUCTION (the precise statement, both legs). Pinning a_0 to a point is blocked by two
 * independent walls: (1) EMPIRICALLY the six accessible offsets are noise-dominated (per-height
 * a_0 spread ~1.18 straddling zero, R^2 = 0.0007), and (2) ANALYTICALLY the semiclassical
 * Berry / Bogomolny-Keating box-variance saturation model that fixes the loglog SLOPE 1/2pi^2
 * does NOT itself supply the additive intercept -- a_0 = b - gamma - 1 is the independent
 * Selberg-Goldston-Fujii arithmetic constant b of Var S(T) (a convergent prime sum), an
 * arithmetic input the box model cannot generate from the smooth density alone. Because T_x
 * depends double-exponentially on a_0, closing the sub-gap REQUIRES importing b to O(0.01),
 * which is exactly the number-theoretic input this component model lacks.
 *
 * WHAT THIS DELIVERS (honest partial). It does NOT pin a_0 or collapse the ceiling to a point
 * (no bound moves). It (i) reduces the sub-gap to the single scalar b = gamma + 1 + a_0 (the
 * Fujii variance-of-S constant) via a_0 = b - gamma - 1, (ii) gives the explicit crossing map
 * T_x(a_0) and its d ln T_x / d a_0 ~ -78 double-exponential sensitivity that quantifies the
 * ~40-order width, and (iii) records the two-leg obstruction. The renamed, sharpened sub-gap
 * is imp-95940-subgap-fujii-varS-constant: import the rigorous Selberg-Goldston-Fujii Var S(T)
 * constant b to O(0.01) to collapse the crossing to a point.
 *
 * VERDICT. ASSESSMENT / PRECISE OBSTRUCTION (frontier, NOT rigorous). The arithmetic intercept
 * is a_0 = b - gamma - 1 where b is the Selberg-Goldston-Fujii constant of Var S(T) (since the
 * saturated box variance equals 2 x Var S), so pinning a_0 is EXACTLY pinning the rigorous
 * prime-sum constant b -- reducing the imp-95921 sub-gap to one named scalar. Neither route
 * pins it: the six accessible offsets back out a_0 with a ~1.18 spread straddling zero
 * (noise-dominated, R^2 = 0.0007), and the semiclassical box model supplies only the loglog
 * slope, not the arithmetic intercept. Because the crossing height obeys T_x(a_0) =
 * 2pi exp(exp(2pi^2 C0 - 2(gamma + 1 + a_0))) with d ln T_x / d a_0 ~ -78, a_0 must be pinned
 * to O(0.01) to fix T_x within an order of magnitude, which is why the ceiling is the wide
 * range [~5.8e17, ~1.36e28] rather than a point. Sharpened sub-gap
 * imp-95940-subgap-fujii-varS-constant (import b to O(0.01)). Assessment only; changes no
 * bound; NO QED; Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author unrefereed;
 * the zero-side route stays PCC / GRH-gated; no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. The six imp-95710 / imp-95562 measured
 * sd(C - E) literals and the imp-95722 / imp-95921 closed forms are recomputed here exactly;
 * a_0 and T_x figures are derived analytically from those literals.
 *
 * @see imp-95921-c0-offset-approach-analytic-bracket (named the sub-gap; slope pinned, intercept not)
 * @see imp-95897-c0-offset-monotonicity-envelope-safety (noise-dominated data, R^2 = 0.0007)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (r_cap envelope; C0 = max offset)
 * @see imp-95973-six-point-noise-domination-wall-glossary-headword (shared nav index: this
 *   thread's a_0 spread ~1.18 sits alongside the sibling imp-95941/imp-95946 six-point-wall
 *   findings under one index note)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const PI2 = Math.PI * Math.PI;

const logLog = (T) => Math.log(Math.log(T / TWO_PI)); // loglog(T/2pi)
const SELBERG_C = 1 / (2 * PI2); // 1/2pi^2 -- single-endpoint Selberg / residual offset slope

// Same six measured literals imp-95710 / imp-95897 / imp-95921 baked (imp-95562 over 10^6 ordinates).
const MEASURED = [
  { Tc: 1.0e4, sd: 0.6218 },
  { Tc: 3.0e4, sd: 0.5823 },
  { Tc: 7.0e4, sd: 0.5689 },
  { Tc: 1.5e5, sd: 0.6714 },
  { Tc: 3.0e5, sd: 0.6199 },
  { Tc: 5.0e5, sd: 0.6078 },
];

// STEP 2: per-height back-out a_0(T) = pi^2 measuredVar - loglog(T/2pi) - gamma - 1.
const a0Rows = MEASURED.map((m) => {
  const measuredVar = m.sd * m.sd;
  const ll = logLog(m.Tc);
  const offset = measuredVar - SELBERG_C * ll;
  const interceptG1a0 = PI2 * offset - 0.5 * ll; // = gamma + 1 + a_0 = b (Fujii constant)
  const a0 = interceptG1a0 - EULER - 1;
  return { Tc: m.Tc, loglog: ll, offset, interceptG1a0, a0 };
});

const a0Vals = a0Rows.map((r) => r.a0);
const a0Min = Math.min(...a0Vals);
const a0Max = Math.max(...a0Vals);
const a0Mean = a0Vals.reduce((s, x) => s + x, 0) / a0Vals.length;
const a0Spread = a0Max - a0Min; // ~1.18, straddling zero -> noise-dominated

// STEP 3: crossing height as an explicit DOUBLE-exponential function of a_0.
const C0 = 0.3337213835371905; // imp-95722 / imp-95921 pinned max accessible offset
const crossingT = (a0) => TWO_PI * Math.exp(Math.exp(2 * PI2 * C0 - 2 * (EULER + 1 + a0)));

const crossingAtMin = crossingT(a0Min); // ~6.4e46 (most-negative a_0)
const crossingAtMax = crossingT(a0Max); // ~1.5e5 (most-positive a_0, BELOW 3e12)
const crossingAtMean = crossingT(a0Mean); // ~5.8e17 (matches imp-95921 mean anchor)

// log-sensitivity d ln T_x / d a_0 at the empirical mean (central difference).
const EPS = 1e-4;
const dLnTxDa0 = (Math.log(crossingT(a0Mean + EPS)) - Math.log(crossingT(a0Mean - EPS))) / (2 * EPS); // ~-78

// a_0 pinning accuracy needed to fix T_x within one order of magnitude: |Delta a_0| ~ ln10/|slope|.
const a0AccuracyForOneDecade = Math.log(10) / Math.abs(dLnTxDa0); // ~0.03

export const IMP95940_ARITHMETIC_INTERCEPT_A0_OBSTRUCTION = {
  ticket: 'imp-95940',
  proofSection: 'S-frontier',
  question:
    'Derive or rigorously bound the O(1) arithmetic intercept a_0 (prime-sum constant) of the ' +
    'saturated box number variance to pin the imp-95921 C0 offset-crossing height to a POINT ' +
    'rather than the range [~5.8e17, ~1.36e28], or record a precise obstruction. Assessment only; NO QED.',
  method:
    'Match Sigma^2_sat = (1/pi^2)(loglog(T/2pi) + gamma + 1 + a_0) against the rigorous ' +
    'Selberg-Goldston-Fujii asymptotic Var S(T) = (1/2pi^2)(loglog(T/2pi) + b) using ' +
    'Sigma^2_sat = 2 Var S, giving a_0 = b - gamma - 1; back a_0 out of the six accessible offsets; ' +
    'write the crossing height as T_x(a_0) and evaluate its double-exponential sensitivity.',
  identity: {
    a0EqualsFujiiMinusG1: 'a_0 = b - gamma - 1, with b the Selberg-Goldston-Fujii Var S(T) constant',
    saturatedEqualsTwiceVarS: 'Sigma^2_sat(T) = 2 Var S(T), so gamma + 1 + a_0 = b',
    crossingClosedForm: 'T_x(a_0) = 2pi exp( exp( 2pi^2 C0 - 2(gamma + 1 + a_0) ) )',
  },
  a0Rows,
  a0Empirical: {
    values: a0Vals,
    min: a0Min, // ~-0.615
    max: a0Max, // ~+0.561
    mean: a0Mean, // ~-0.116
    spread: a0Spread, // ~1.18 -- exceeds |a_0|, straddles zero -> noise-dominated (cannot pin)
    note:
      'The six accessible offsets back out a_0 with a spread larger than its own magnitude, ' +
      'straddling zero -- the same noise wall imp-95897 recorded as R^2 = 0.0007. Empirical route brackets, does not pin.',
  },
  crossingSensitivity: {
    crossingAtMin, // ~6.4e46
    crossingAtMean, // ~5.8e17 (matches the imp-95921 mean-anchor ceiling)
    crossingAtMax, // ~1.5e5 (below 3e12) -- shows how wildly a_0 controls T_x
    dLnTxDa0, // ~-78 -- double-exponential log-sensitivity at the empirical mean
    a0AccuracyForOneDecade, // ~0.03 -- a_0 must be pinned this tight to fix T_x within a decade
    note:
      'T_x is a DOUBLE exponential in a_0 (d ln T_x / d a_0 ~ -78), so pinning T_x within one ' +
      'order of magnitude needs a_0 to O(0.01) -- unreachable by noise-dominated data or the slope-only model.',
  },
  obstruction: {
    leg1Empirical:
      'The six accessible offsets are noise-dominated: per-height a_0 spread ~1.18 straddles zero ' +
      '(R^2 = 0.0007), so the data brackets but cannot pin a_0.',
    leg2Analytic:
      'The semiclassical Berry / Bogomolny-Keating box-variance saturation model fixes only the ' +
      'loglog SLOPE 1/2pi^2; the intercept a_0 = b - gamma - 1 is the independent Selberg-Goldston-Fujii ' +
      'arithmetic constant b of Var S(T) (a convergent prime sum) that the box model does not supply.',
    amplifier:
      'Because T_x depends double-exponentially on a_0, closing the sub-gap requires b to O(0.01), ' +
      'exactly the number-theoretic input this component model lacks.',
    subGap: 'imp-95940-subgap-fujii-varS-constant',
  },
  findings: {
    subGapReducedToOneScalar:
      'a_0 = b - gamma - 1 with b the rigorous Selberg-Goldston-Fujii Var S(T) constant (since ' +
      'Sigma^2_sat = 2 Var S), collapsing the opaque O(1) remainder to a single named target scalar.',
    empiricalRouteFails:
      'Backing a_0 out of the six accessible offsets gives a ~1.18 spread straddling zero ' +
      '(noise-dominated, R^2 = 0.0007) -- brackets a_0, does not pin it.',
    doubleExponentialAmplifier:
      'T_x(a_0) = 2pi exp(exp(2pi^2 C0 - 2(gamma + 1 + a_0))) has d ln T_x / d a_0 ~ -78, so the ~1.18 ' +
      'a_0 spread sweeps T_x from ~6.4e46 to ~1.5e5; a_0 must be pinned to O(0.01) to fix T_x within a decade.',
    preciseObstruction:
      'Pinning a_0 needs the arithmetic constant b to O(0.01), which the slope-only semiclassical model ' +
      'cannot generate and the noise-dominated data cannot resolve -- the sharpened sub-gap imp-95940-subgap-fujii-varS-constant.',
  },
  isRigorous: false,
  decision:
    'SUB-GAP REDUCED, NOT CLOSED. The arithmetic intercept is a_0 = b - gamma - 1 where b is the ' +
    'rigorous Selberg-Goldston-Fujii Var S(T) constant, collapsing the imp-95921 sub-gap to one named ' +
    'scalar. It is NOT pinned to a point: the six accessible offsets back a_0 out with a ~1.18 spread ' +
    'straddling zero (noise-dominated, R^2 = 0.0007), and the semiclassical box model fixes only the ' +
    'loglog slope, not the arithmetic intercept. Because T_x depends double-exponentially on a_0 ' +
    '(d ln T_x / d a_0 ~ -78), a_0 must be pinned to O(0.01) to fix T_x within a decade -- the precise ' +
    'obstruction imp-95940-subgap-fujii-varS-constant (import b to O(0.01)).',
  verdict:
    'ASSESSMENT / PRECISE OBSTRUCTION (frontier, NOT rigorous). The saturated box number variance equals ' +
    '2 x Var S(T), so its intercept is a_0 = b - gamma - 1 with b the Selberg-Goldston-Fujii Var S(T) ' +
    'constant (a convergent prime sum) -- pinning a_0 is EXACTLY pinning b, reducing the imp-95921 sub-gap ' +
    'to a single named scalar. Neither route pins it: the six accessible offsets back a_0 out with a ~1.18 ' +
    'spread straddling zero (noise-dominated, R^2 = 0.0007), and the semiclassical box model supplies only ' +
    'the loglog slope 1/2pi^2, not the arithmetic intercept. Because the crossing obeys T_x(a_0) = ' +
    '2pi exp(exp(2pi^2 C0 - 2(gamma + 1 + a_0))) with d ln T_x / d a_0 ~ -78, a_0 must be pinned to O(0.01) ' +
    'to fix T_x within an order of magnitude, which is why the ceiling is the wide range [~5.8e17, ~1.36e28] ' +
    'rather than a point. Sharpened sub-gap imp-95940-subgap-fujii-varS-constant (import b to O(0.01)). ' +
    'Assessment only; changes no bound; NO QED; Catalan G irrationality OPEN; Sun arXiv:2609.04176 ' +
    'single-author unrefereed; the zero-side route stays PCC / GRH-gated; no refereed bound is changed.',
  citation:
    'imp-95921 (named sub-gap; slope pinned, intercept unpinned); imp-95897 (noise-dominated data, ' +
    'R^2 = 0.0007); imp-95722 (r_cap envelope, C0 = max offset); Selberg / Goldston 1987 / Fujii ' +
    '(rigorous Var S(T) = (1/2pi^2)(loglog + b) asymptotic, b a convergent prime sum).',
};

// --- self-executing internal-consistency assertions (baked-literal re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the intercept identity holds row-by-row: gamma + 1 + a_0(T) reproduces from the measured offset.
  for (const r of a0Rows) {
    if (!approx(r.interceptG1a0, EULER + 1 + r.a0, 1e-12))
      throw new Error('imp-95940: a_0 back-out inconsistent with gamma + 1 + a_0 identity');
  }
  // OBSTRUCTION 1: the empirical spread exceeds the mean magnitude and straddles zero (noise-dominated).
  if (!(a0Spread > 1.0)) throw new Error('imp-95940: empirical a_0 spread must be O(1) (noise-dominated)');
  if (!(a0Min < 0 && a0Max > 0)) throw new Error('imp-95940: empirical a_0 must straddle zero');
  // crossing closed form reproduces the imp-95921 mean-anchor ceiling ~5.8e17.
  if (!(crossingAtMean > 1e17 && crossingAtMean < 1e18))
    throw new Error('imp-95940: mean-anchor crossing must reproduce the imp-95921 ~5.8e17 ceiling');
  // OBSTRUCTION 2: double-exponential sensitivity is steep and negative (higher a_0 -> lower T_x).
  if (!(dLnTxDa0 < -50)) throw new Error('imp-95940: crossing must be double-exponentially sensitive to a_0');
  if (!(a0AccuracyForOneDecade < 0.1))
    throw new Error('imp-95940: a_0 must be pinned to O(0.01) to fix T_x within a decade');
  // the a_0 spread sweeps T_x across many orders of magnitude (the ~40-order range).
  if (!(crossingAtMin / crossingAtMax > 1e30))
    throw new Error('imp-95940: empirical a_0 spread must sweep T_x across many orders of magnitude');
  // HONESTY gates: assessment only, sub-gap named, no false pin, no refereed bound is changed.
  if (IMP95940_ARITHMETIC_INTERCEPT_A0_OBSTRUCTION.isRigorous !== false)
    throw new Error('imp-95940: isRigorous must be false');
  if (!/NO QED/.test(IMP95940_ARITHMETIC_INTERCEPT_A0_OBSTRUCTION.verdict))
    throw new Error('imp-95940: verdict dropped the NO QED banner');
  if (!/imp-95940-subgap-fujii-varS-constant/.test(IMP95940_ARITHMETIC_INTERCEPT_A0_OBSTRUCTION.verdict))
    throw new Error('imp-95940: verdict dropped the named sub-gap');
  if (!/refereed bound is changed/i.test(IMP95940_ARITHMETIC_INTERCEPT_A0_OBSTRUCTION.verdict))
    throw new Error('imp-95940: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95940_ARITHMETIC_INTERCEPT_A0_OBSTRUCTION;
