/**
 * @module imp-36239-i5-rounding-vs-i2-truncation-crossover
 * @fileoverview imp-36239 -- Measure the crossover minimum-gap delta* (as a function of
 *   the particle count N) at which the imp-36192 I5 per-step floating-point rounding
 *   contribution ~ O(stages * N * eps) overtakes the imp-36192 I2 per-step local-truncation
 *   term ~ dt^5 * delta^-9 in the interval-RK4 backward-Dyson integrator. The two per-step
 *   error channels scale oppositely in the min gap delta: I2 (truncation) BLOWS UP as
 *   delta -> 0 toward the collision front (imp-36233 confirmed the delta^-9 exponent
 *   exactly, prefactor 1680), while I5 (rounding floor) is essentially delta-independent
 *   (it depends on the op-count stages * N, not on the gap). So there is a crossover gap
 *   delta*(N): for delta < delta* truncation dominates, for delta > delta* the rounding
 *   floor dominates -- i.e. I5 overtakes I2 as one moves OUT of the boundary layer into
 *   the bulk. This module locates delta*(N) and quantifies how negligible I5 is where I2
 *   is vacuous (the near-front region), which is exactly the "I5 small vs I2 near the
 *   front" claim imp-36192 asserted but never measured.
 *   Measurement ONLY: bounds no truncation error; instantiates no step certificate;
 *   supplies no rounding-error certificate; G-step-error stays OPEN; changes no bound;
 *   NO QED; no refereed bound is changed.
 *
 *   THE TWO COMPETING PER-STEP CHANNELS (imp-36192 I2 vs I5)
 *   -------------------------------------------------------
 *   I2 (a-priori local truncation, the CRUX): a classical RK4 step carries a local error
 *   ~ C_RK4 * dt^5 * |x^(5)|, and imp-36233 MEASURED |x^(5)| = 1680 * delta^-9 exactly for
 *   the colliding Dyson pair. Using the Taylor-remainder leading coefficient 1680/5! = 14
 *   as the modeled prefactor c2 (the exact RK4 scheme error-constant is an O(1) factor
 *   absorbed here -- this is a SCALING model, not a certified constant), the per-step
 *   truncation channel is I2(dt, delta) = c2 * dt^5 * delta^-9.
 *
 *   I5 (per-step outward-rounded arithmetic floor, imp-35761 class): each of the `stages`
 *   RK stages evaluates the Dyson RHS f_k = -sum_{j!=k} 1/(x_k - x_j), an O(N) sum of poles
 *   for each particle, so a single step touches ~ stages * N floating-point operations, each
 *   contributing a directed-rounding error ~ eps (machine epsilon). The per-step rounding
 *   floor is therefore I5(stages, N) = stages * N * eps -- delta-independent to leading order.
 *
 *   THE CROSSOVER
 *   -------------
 *   Setting I2 = I5 and solving for the gap gives the crossover
 *       delta*(N) = ( c2 * dt^5 / (stages * N * eps) )^{1/9}.
 *   Because the exponent is 1/9, delta* is EXTREMELY insensitive to N: a factor-4886 change
 *   in N (from N=100 to the T_PT anchor N ~ 488602) moves the crossover by only 4886^{1/9}
 *   ~ 2.57x. Likewise delta* ~ dt^{5/9} in the step size.
 *
 *   THE HEADLINE (measurement, NO QED)
 *   ----------------------------------
 *   At the representative dt = 1e-5 the crossover sits at delta* ~ 0.025 .. 0.063 across
 *   N in [1e2, 488602] -- an ORDER-ONE gap, deep in the BULK, ~250x ABOVE the near-front
 *   boundary layer (delta ~ 1e-4). So the crossover confirms the ORDER of the two channels:
 *   in the bulk (delta >~ 0.03) the rounding floor I5 dominates the truncation I2; in the
 *   boundary layer (delta << delta*) truncation I2 dominates by a huge margin. Quantifying
 *   the latter: at the front delta = 1e-4, I2 exceeds I5 by ~ 3.2e21 (for the N ~ 488602
 *   anchor) -- ~21 orders of magnitude -- so I5 is utterly negligible where I2 is vacuous,
 *   exactly the imp-36192 "I5 small vs I2 near the front" statement, now measured.
 *
 *   WHAT THIS DOES NOT DO
 *   ---------------------
 *   Locating the delta* crossover is a structural fact about which per-step channel leads
 *   in which regime; it bounds neither channel absolutely. It certifies no truncation
 *   bound (I2 stays a modeled scaling with an absorbed O(1) constant), certifies no
 *   rounding bound (I5 stays the imp-35761-class op-count floor), supplies no adaptive
 *   step control, and leaves G-step-error OPEN. It is a measurement of the CROSSOVER, not
 *   a resolution of either obligation.
 */

// ---------------------------------------------------------------------------
// Constants.
// ---------------------------------------------------------------------------
const EPS = Number.EPSILON; // 2.220446049250313e-16, IEEE-754 double machine epsilon
const DT = 1e-5; // representative step (matches imp-36192 / imp-36244 baked dt)
const C2 = 1680 / 120; // = 14; Taylor-remainder leading coeff of the RK4 LTE (imp-36233: |x^(5)| = 1680*delta^-9)
const TRUNC_EXPONENT = 9; // I2 ~ dt^5 * delta^-9 (imp-36233 CONFIRMS -9 exactly)
const STAGES_RK4 = 4; // classical RK4 stages (per-step RHS evaluations)
const N_ANCHOR = 488602; // floor(sqrt(T_PT / 4pi)), T_PT = 3e12 (Platt-Trudgian anchor)
const FRONT_DELTA = 1e-4; // representative near-front boundary-layer gap (imp-36192)

// ---------------------------------------------------------------------------
// The two competing per-step error channels (imp-36192 I2 and I5).
// ---------------------------------------------------------------------------
// I2: per-step a-priori local truncation ~ c2 * dt^5 * delta^-9 (modeled scaling).
function truncationChannel(dt, delta) {
  return C2 * Math.pow(dt, 5) * Math.pow(delta, -TRUNC_EXPONENT);
}
// I5: per-step outward-rounded arithmetic floor ~ stages * N * eps (imp-35761 class).
function roundingChannel(stages, N) {
  return stages * N * EPS;
}

// Crossover gap: solve truncationChannel(dt, delta*) = roundingChannel(stages, N).
//   delta* = ( c2 * dt^5 / (stages * N * eps) )^{1/9}
function crossoverDelta(dt, stages, N) {
  const numerator = C2 * Math.pow(dt, 5);
  const denominator = roundingChannel(stages, N);
  return Math.pow(numerator / denominator, 1 / TRUNC_EXPONENT);
}

// ---------------------------------------------------------------------------
// Sweep N across a geometric ladder up to the T_PT anchor.
// ---------------------------------------------------------------------------
const N_LADDER = [1e2, 1e3, 1e4, 1e5, N_ANCHOR];

const CROSSOVER_MEASUREMENTS = N_LADDER.map((N) => {
  const deltaStar = crossoverDelta(DT, STAGES_RK4, N);
  const i2AtStar = truncationChannel(DT, deltaStar);
  const i5 = roundingChannel(STAGES_RK4, N);
  return {
    N,
    deltaStar,
    // by construction the two channels balance at delta*; residual measures numeric closure
    balanceResidual: Math.abs(i2AtStar / i5 - 1),
    // ratio of the two channels AT the near-front boundary layer (delta = 1e-4):
    // I2 / I5 quantifies how negligible the rounding floor is where truncation is vacuous
    frontI2overI5: truncationChannel(DT, FRONT_DELTA) / i5,
  };
});

// log-log slope of delta*(N) vs N: predicted -1/9 (crossover ~ N^{-1/9}).
function loglogSlopeNvsDelta(points) {
  const n = points.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const p of points) {
    const x = Math.log(p.N);
    const y = Math.log(p.deltaStar);
    sx += x; sy += y; sxx += x * x; sxy += x * y;
  }
  return (n * sxy - sx * sy) / (n * sxx - sx * sx);
}

const CROSSOVER_N_EXPONENT = loglogSlopeNvsDelta(CROSSOVER_MEASUREMENTS); // ~ -1/9
const PREDICTED_N_EXPONENT = -1 / TRUNC_EXPONENT; // -0.1111...
const STEP_SCALING_EXPONENT = 5 / TRUNC_EXPONENT; // delta* ~ dt^{5/9}

// N-insensitivity: crossover shift from the smallest to the largest N on the ladder.
const DELTA_STAR_MIN_N = CROSSOVER_MEASUREMENTS[0].deltaStar; // N = 1e2
const DELTA_STAR_MAX_N = CROSSOVER_MEASUREMENTS[CROSSOVER_MEASUREMENTS.length - 1].deltaStar; // N ~ 488602
const N_SPAN = N_LADDER[N_LADDER.length - 1] / N_LADDER[0];
const CROSSOVER_SHIFT_FACTOR = DELTA_STAR_MIN_N / DELTA_STAR_MAX_N; // = N_SPAN^{1/9}

const IMP36239_I5_ROUNDING_VS_I2_TRUNCATION_CROSSOVER = {
  ticket: 'imp-36239',
  what:
    'Crossover min-gap delta*(N) where the imp-36192 I5 per-step rounding floor ' +
    '~ stages*N*eps overtakes the I2 per-step truncation term ~ dt^5*delta^-9 in the ' +
    'interval-RK4 backward-Dyson integrator.',
  method:
    'Solve truncationChannel(dt, delta*) = roundingChannel(stages, N) for delta*; ' +
    'delta* = (c2*dt^5/(stages*N*eps))^{1/9}, c2 = 1680/5! (imp-36233 leading coeff). ' +
    'Sweep N over 1e2 .. 488602 at the representative dt = 1e-5.',
  constants: {
    eps: EPS,
    dt: DT,
    c2: C2,
    truncExponent: TRUNC_EXPONENT,
    stagesRK4: STAGES_RK4,
    nAnchor: N_ANCHOR,
    frontDelta: FRONT_DELTA,
  },
  measurements: CROSSOVER_MEASUREMENTS,
  crossoverNExponent: CROSSOVER_N_EXPONENT,
  predictedNExponent: PREDICTED_N_EXPONENT,
  stepScalingExponent: STEP_SCALING_EXPONENT,
  deltaStarMinN: DELTA_STAR_MIN_N,
  deltaStarMaxN: DELTA_STAR_MAX_N,
  crossoverShiftFactor: CROSSOVER_SHIFT_FACTOR,
  nSpan: N_SPAN,
  verdict: 'CROSSOVER-in-bulk-I5-negligible-near-front',
  reliability: {
    closedFormCrossover: true,
    truncPrefactorFromImp36233: true,
    note:
      'Crossover delta* ~ 0.025..0.063 across N in [1e2, 488602] (bulk, ~250x above the ' +
      'front); delta* ~ N^{-1/9} so a 4886x N change shifts it only ~2.57x; at the front ' +
      'delta = 1e-4 the truncation channel exceeds the rounding floor by ~3.2e21.',
  },
  honestCaveat: {
    isProof: false,
    isNumericalMeasurement: true,
    locatesCrossover: true,
    truncChannelIsModeledScaling: true, // c2 absorbs an O(1) RK4 scheme constant
    boundsTruncationError: false,
    boundsRoundingError: false,
    certifiesStepBound: false,
    suppliesAdaptiveStepControl: false,
    gStepErrorStaysOpen: true,
    changesAnyBound: false,
    carriesRHVerdict: false,
    sota: 'Platt-Trudgian Lambda <= 0.2',
  },
};

// ---------------------------------------------------------------------------
// Self-executing assertions (run at build via run-assertions.mjs DATA_MODULES).
// ---------------------------------------------------------------------------
const IMP36239_I5_ROUNDING_VS_I2_TRUNCATION_CROSSOVER_ASSERTIONS = [
  {
    id: 'imp36239-crossover-balances-both-channels',
    why:
      'At the located delta*(N) the two per-step channels must actually balance: ' +
      'truncationChannel(dt, delta*) == roundingChannel(stages, N) to numeric closure. ' +
      'A nonzero balance residual would mean the crossover was mislocated.',
    holds: () =>
      CROSSOVER_MEASUREMENTS.length === 5 &&
      CROSSOVER_MEASUREMENTS.every((r) => r.balanceResidual < 1e-9),
  },
  {
    id: 'imp36239-crossover-lives-in-bulk-not-boundary-layer',
    why:
      'The crossover gap must sit in the BULK, well above the near-front boundary layer ' +
      '(delta ~ 1e-4) and below O(1): every delta* in (1e-3, 1). This is the ordering ' +
      'fact -- truncation leads only DEEP in the front, the rounding floor leads in the bulk.',
    holds: () =>
      CROSSOVER_MEASUREMENTS.every((r) => r.deltaStar > 1e-3 && r.deltaStar < 1),
  },
  {
    id: 'imp36239-crossover-N-exponent-minus-1over9',
    why:
      'delta* = (.../(stages*N*eps))^{1/9} predicts delta* ~ N^{-1/9}; the fitted log-log ' +
      'slope of delta* vs N must match -1/9, confirming the crossover is only weakly ' +
      'N-dependent (the 1/9 power is what makes it nearly N-insensitive).',
    holds: () =>
      Math.abs(CROSSOVER_N_EXPONENT - PREDICTED_N_EXPONENT) < 1e-9,
  },
  {
    id: 'imp36239-N-insensitivity-4886x-yields-2p57x',
    why:
      'A factor-4886 change in N (100 -> 488602) must move the crossover by only the ' +
      '1/9 power, ~2.57x -- the measured shift factor equals N_span^{1/9} and stays below 3, ' +
      'the quantitative statement that the crossover is essentially N-independent.',
    holds: () => {
      const predicted = Math.pow(N_SPAN, 1 / TRUNC_EXPONENT);
      return (
        Math.abs(CROSSOVER_SHIFT_FACTOR / predicted - 1) < 1e-9 &&
        CROSSOVER_SHIFT_FACTOR > 2 &&
        CROSSOVER_SHIFT_FACTOR < 3
      );
    },
  },
  {
    id: 'imp36239-front-rounding-negligible-vs-truncation',
    why:
      'At the near-front boundary layer (delta = 1e-4) where I2 is vacuous, the rounding ' +
      'floor I5 must be utterly negligible: I2/I5 > 1e18 for every N on the ladder. This ' +
      'QUANTIFIES the imp-36192 "I5 small vs I2 near the front" claim (measured ~3.2e21 at N_anchor).',
    holds: () =>
      CROSSOVER_MEASUREMENTS.every((r) => r.frontI2overI5 > 1e18),
  },
  {
    id: 'imp36239-step-scaling-exponent-5over9',
    why:
      'The crossover also scales as delta* ~ dt^{5/9} in the step size (numerator dt^5, ' +
      'ninth root); the recorded step-scaling exponent must be 5/9, documenting that a ' +
      'smaller step pushes the crossover deeper toward the front.',
    holds: () => Math.abs(STEP_SCALING_EXPONENT - 5 / 9) < 1e-12,
  },
  {
    id: 'imp36239-honest-no-closure-no-qed',
    why:
      'Mandatory honesty: a MEASUREMENT that locates the crossover but bounds neither ' +
      'channel absolutely (I2 is a modeled scaling with an absorbed O(1) constant, I5 is ' +
      'the imp-35761 op-count floor), certifies no step bound, keeps G-step-error OPEN, ' +
      'carries no RH verdict, and leaves PT 0.2 the SOTA. If any flip, the module over-claims.',
    holds: () => {
      const h = IMP36239_I5_ROUNDING_VS_I2_TRUNCATION_CROSSOVER.honestCaveat;
      return (
        h.isProof === false &&
        h.isNumericalMeasurement === true &&
        h.locatesCrossover === true &&
        h.truncChannelIsModeledScaling === true &&
        h.boundsTruncationError === false &&
        h.boundsRoundingError === false &&
        h.certifiesStepBound === false &&
        h.suppliesAdaptiveStepControl === false &&
        h.gStepErrorStaysOpen === true &&
        h.changesAnyBound === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36239_I5_ROUNDING_VS_I2_TRUNCATION_CROSSOVER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36239-i5-rounding-vs-i2-truncation-crossover assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36239_I5_ROUNDING_VS_I2_TRUNCATION_CROSSOVER;
