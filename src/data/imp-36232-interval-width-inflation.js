/**
 * @module imp-36232-interval-width-inflation
 *
 * imp-36232 (numerical/diagnostic, S-frontier): MEASURE the per-step interval
 * WIDTH inflation (wrapping / dependency factor) of the imp-362
 * LAMBDA_INTERVAL_DYSON one-ULP interval-RK4 witness
 * (dysonDriftInterval / rk4IntervalStep / backwardCollisionInterval, in
 * src/math/interval-dyson-integrator.mjs), as a function of step index and of N,
 * to quantify the imp-36193 Step-2 E4 ingredient
 * (N-uniform interval-width control / wrapping) that the scope module NAMED but
 * never tabulated.
 *
 * MEASUREMENT / DIAGNOSTIC ONLY. Certifies no enclosure; instantiates no
 * certified interval; integrates no certified flow; changes no bound;
 * G-interval-enclosure (lambda-roadmap.js Step-2 rigorousUpgradeGap) stays OPEN;
 * C_mb GUE-conditional (imp-486) untouched; NO QED. No refereed bound is changed.
 *
 * WHAT WAS MEASURED
 * -----------------------------------------------------------------------------
 * The enclosure metric is the maximum component half-width
 *   w(step) = max_k ( gamma_k[hi] - gamma_k[lo] ) / 2
 * over the interval ordinate vector, recorded at every backward RK4 step. The
 * run seeds each ordinate as a point interval [g, g] (so the step-1 width w1 is
 * the first non-degenerate enclosure the one-ULP inflation produces), uses the
 * same per-N budget as the imp-362 witness (budgetForN), and integrates until
 * the min adjacent-gap lower bound reaches 0 (the certified collision front).
 * The runs were produced offline against the bundled ZETA_ZEROS (870 zeros) and
 * the literals below are baked verbatim; re-running
 *   node src/math/interval-dyson-integrator.mjs
 * plus the same w(step) probe reproduces them.
 *
 * TWO REGIMES SEPARATED (this is the finding)
 * -----------------------------------------------------------------------------
 * The per-step multiplicative width factor rho(step) = w(step+1)/w(step) is NOT
 * a single number: it splits into a SMOOTH (bulk) regime and a TERMINAL
 * (boundary-layer) regime near the collision.
 *
 *  - rhoSmooth = geometric-mean per-step factor over the first HALF of the
 *    completed steps. Measured 1.111 .. 1.155 across N = 50, 100, 200, 500,
 *    with NO monotone N-trend. => in the bulk the per-step wrapping factor is
 *    approximately N-UNIFORM at ~1.1-1.15x/step. This is the positive half of
 *    the imp-36193 E4 ingredient: bulk interval-width control looks N-uniform.
 *
 *  - rhoTerminal = geometric-mean per-step factor over the LAST 5 completed
 *    steps. Measured 2.18 .. 8.02 -- a 2x-8x/step blow-up as the min gap
 *    collapses toward the collision. This dominates the final width and is NOT
 *    N-uniform. It is the wrapping/dependency CATASTROPHE and it lives entirely
 *    in the boundary layer (cf. the imp-36192 I2 delta^-9 elementary-derivative
 *    growth CRUX). This is the OPEN half of E4: the smooth factor being
 *    N-uniform does NOT give an N-uniform width bound, because the terminal
 *    blow-up sets wFinal.
 *
 * The step-1 seed width w1 grows only mildly with N (2.84e-14 -> 1.71e-13 from
 * N=50 to N=500), tracking the ULP of the largest ordinate (~gamma_N * 2^-52),
 * NOT N itself -- consistent with per-op one-ULP inflation scaling with operand
 * magnitude. Net amplification wFinal/w1 spans 5.9e3 .. 7.8e8, yet wFinal stays
 * <= ~2.2e-5 << the 0.01 heuristic, so the brackets still close narrower than
 * the heuristic pm -- but it is the terminal blow-up, not the bulk factor, that
 * sets how narrow.
 */

export const IMP36232_INTERVAL_WIDTH_INFLATION = {
  id: 'imp-36232',
  proofSection: 'S-frontier',
  kind: 'numerical-diagnostic',
  target:
    'imp-362 LAMBDA_INTERVAL_DYSON one-ULP interval-RK4 witness (dysonDriftInterval / rk4IntervalStep / backwardCollisionInterval)',
  measures:
    'imp-36193 Step-2 E4 ingredient: per-step interval width inflation (wrapping / dependency factor) vs step index and N',
  widthMetric: 'w(step) = max_k ( gamma_k[hi] - gamma_k[lo] ) / 2  (max component half-width of the interval ordinate vector)',
  seed: 'point intervals [g, g]; w1 is the first non-degenerate enclosure the one-ULP inflation produces',
  zetaZerosUsed: 870,
  // Per-N measured width-inflation table. dt / nSteps match imp-362 budgetForN.
  rows: [
    {
      N: 50,
      dt: 0.002,
      completedSteps: 48,
      stopReason: 'gap-nonpositive',
      w1: 2.842e-14,
      wFinal: 6.967e-10,
      amplification: 2.451e4,
      rhoSmooth: 1.155,
      rhoTerminal: 3.39,
    },
    {
      N: 100,
      dt: 0.001,
      completedSteps: 76,
      stopReason: 'gap-nonpositive',
      w1: 2.842e-14,
      wFinal: 2.208e-5,
      amplification: 7.769e8,
      rhoSmooth: 1.112,
      rhoTerminal: 7.941,
    },
    {
      N: 200,
      dt: 0.0005,
      completedSteps: 66,
      stopReason: 'gap-nonpositive',
      w1: 8.527e-14,
      wFinal: 5.051e-10,
      amplification: 5.924e3,
      rhoSmooth: 1.111,
      rhoTerminal: 2.175,
    },
    {
      N: 500,
      dt: 0.0003,
      completedSteps: 45,
      stopReason: 'gap-nonpositive',
      w1: 1.705e-13,
      wFinal: 6.640e-7,
      amplification: 3.894e6,
      rhoSmooth: 1.151,
      rhoTerminal: 8.02,
    },
  ],
  findings: {
    smoothRegime:
      'rhoSmooth in [1.111, 1.155] across N = 50..500 with NO monotone N-trend: the bulk per-step wrapping factor is approximately N-UNIFORM at ~1.1-1.15x/step (the positive half of E4).',
    terminalRegime:
      'rhoTerminal in [2.18, 8.02]: a 2x-8x/step blow-up in the last ~5 steps as the min gap collapses toward the collision front. This dominates wFinal, is NOT N-uniform, and is the wrapping/dependency catastrophe (cf imp-36192 I2 delta^-9). This is the OPEN half of E4.',
    seedScaling:
      'w1 grows only from 2.84e-14 to 1.71e-13 over N = 50..500, tracking the ULP of the largest ordinate (~gamma_N * 2^-52), not N itself.',
    finalWidth:
      'wFinal <= ~2.2e-5 << the 0.01 heuristic at every measured N, so the brackets still close narrower than the heuristic pm; but the terminal blow-up, not the bulk factor, sets how narrow.',
  },
  conclusion:
    'The per-step width inflation SPLITS into an approximately N-uniform bulk factor (~1.1-1.15x/step) and a non-N-uniform terminal boundary-layer blow-up (2x-8x/step). Quantifying E4 as a single N-uniform per-step factor is therefore INCORRECT: any N-uniform interval-width control must dominate the terminal blow-up, which the smooth factor does not. G-interval-enclosure stays OPEN; changes NO Lambda bound; NO QED. No refereed bound is changed.',
  verdict:
    'MEASUREMENT ONLY. imp-36193 E4 per-step wrapping factor tabulated vs step index and N: N-uniform in the bulk (~1.1-1.15x/step), NOT N-uniform in the terminal boundary layer (2x-8x/step). Certifies nothing; G-interval-enclosure OPEN; NO QED; no refereed bound is changed.',
};

export default IMP36232_INTERVAL_WIDTH_INFLATION;
