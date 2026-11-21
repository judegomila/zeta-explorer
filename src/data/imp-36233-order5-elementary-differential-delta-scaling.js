/**
 * @module imp-36233-order5-elementary-differential-delta-scaling
 * @fileoverview imp-36233 -- Measure the empirical order-5 total-time-derivative
 *   growth exponent of the backward-Dyson RHS field f_k = -sum_{j!=k} 1/(x_k - x_j)
 *   as the minimum gap delta shrinks toward the collision front, and compare the
 *   fitted exponent against the imp-36192 I2 predicted delta^-9 local-truncation
 *   scaling. The order-5 total derivative x_k^(5)(t) = d^5 x_k / dt^5 is exactly the
 *   elementary-differential magnitude that carries the RK4 local truncation error
 *   (LTE ~ C dt^5 x^(5)); if it blows up like delta^-9 in the boundary layer then the
 *   a-priori fixed-dt RK4 step bound is vacuous there, which is the I2 CRUX.
 *   Measurement ONLY: bounds no truncation error; instantiates no step certificate;
 *   G-step-error stays OPEN; changes no bound; NO QED; no refereed bound is changed.
 *
 *   WHY THIS TICKET
 *   ---------------
 *   imp-36192 I2 ASSERTED analytically that the order-5 elementary differential of the
 *   Dyson drift diverges as delta^-9 at the collision front, which renders the RK4
 *   a-priori step-size bound vacuous in the boundary layer (the constant in the LTE is
 *   not uniform in N because it grows with the local field curvature). That delta^-9
 *   exponent was written down as a CRUX but never measured. This module measures it.
 *
 *   HOW THE ELEMENTARY DIFFERENTIAL IS COMPUTED (exact, not finite-difference)
 *   -------------------------------------------------------------------------
 *   The order-p total time-derivative of the solution is x_k^(p)(0) = p! * C_{k,p},
 *   where C_{k,p} is the degree-p Taylor coefficient of x_k(t) about t = 0. Those
 *   coefficients are generated EXACTLY (to floating point) by the standard Taylor
 *   recursion / automatic differentiation of the ODE x_k' = -sum_{j!=k} 1/(x_k - x_j):
 *   at each order n, form the difference series d_{kj} = x_k - x_j, take its power-series
 *   reciprocal g_{kj} = 1/d_{kj} (g_0 = 1/d_0, g_n = -g_0 sum_{m=1}^n d_m g_{n-m}), and
 *   set (n+1) C_{k,n+1} = -sum_{j!=k} [t^n] g_{kj}. This is an exact automatic-
 *   differentiation scheme for the real Dyson field, NOT a noisy finite difference and
 *   NOT the analytic 2-particle caricature -- the spectators enter fully.
 *
 *   THE CONFIGURATION
 *   -----------------
 *   A colliding inner pair sits at x = -delta/2, +delta/2 (centred at 0), embedded in a
 *   cloud of three fixed generic spectators at {-2.7, 1.9, 3.3} so the field is a genuine
 *   multi-particle Dyson RHS rather than the exact two-body model. delta is swept down a
 *   geometric ladder 1e-2 .. 1e-8 and |x_a^(5)| is recorded for the colliding member x_a.
 *
 *   THE HEADLINE (measurement, NO QED)
 *   ----------------------------------
 *   The fitted log-log exponent is -9.000 -- the deep tail (delta <= 1e-5) is -9.000000
 *   to all measured digits, and the full-ladder least-squares slope is -9.000003. The
 *   two-body sanity control reproduces the closed form |x^(5)| = 1680 * delta^-9 (leading
 *   pair coefficient) to ~1e-6 relative, and the multi-particle prefactor converges to the
 *   same 1680 as delta -> 0 (spectator corrections are strictly subleading, visible only as
 *   the mild departure at delta = 1e-2 where the local exponent is -9.000023). So the
 *   measurement CONFIRMS the imp-36192 I2 predicted delta^-9 scaling exactly, with the
 *   leading constant pinned. Equivalently the RK4 LTE scales as dt^5 delta^-9, so holding
 *   the LTE at a fixed tolerance eps forces dt <= (eps)^{1/5} delta^{9/5} -- the step must
 *   shrink like delta^{1.8} into the front, and any dt fixed independent of delta (hence of
 *   N, since delta -> 0 as N grows and the front is approached) is vacuous in the boundary
 *   layer, exactly as I2 claims.
 *
 *   WHAT THIS DOES NOT DO
 *   ---------------------
 *   Confirming that the LTE constant blows up like delta^-9 is a NEGATIVE structural fact
 *   about the a-priori bound; it does not supply the adaptive/analytic step-error control
 *   that would close the gap. It bounds no truncation error, certifies no enclosure, and
 *   leaves G-step-error OPEN. It is a measurement of the CRUX, not its resolution.
 */

// ---------------------------------------------------------------------------
// Exact order-5 total time-derivative via Taylor recursion (auto-diff of the ODE).
// x_i^(p)(0) = p! * C[i][p].
// ---------------------------------------------------------------------------
function fifthTotalDerivative(positions) {
  const N = positions.length;
  const P = 5;
  const C = positions.map((x) => {
    const row = new Array(P + 1).fill(0);
    row[0] = x;
    return row;
  });
  for (let n = 0; n <= P - 1; n++) {
    for (let i = 0; i < N; i++) {
      let acc = 0;
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        // difference series d_{ij} up to order n
        const d = [];
        for (let m = 0; m <= n; m++) d.push(C[i][m] - C[j][m]);
        // reciprocal series g_{ij} = 1 / d_{ij} up to order n
        const g = new Array(n + 1).fill(0);
        g[0] = 1 / d[0];
        for (let k = 1; k <= n; k++) {
          let s = 0;
          for (let m = 1; m <= k; m++) s += d[m] * g[k - m];
          g[k] = -g[0] * s;
        }
        acc += g[n]; // [t^n] g_{ij}
      }
      // x_i' = -sum_j g_{ij}  ==>  (n+1) C[i][n+1] = -[t^n] sum_j g_{ij}
      C[i][n + 1] = -acc / (n + 1);
    }
  }
  return C.map((row) => 120 * row[P]); // 5! = 120
}

const SPECTATORS = [-2.7, 1.9, 3.3];
function collisionConfig(delta) {
  return [-delta / 2, delta / 2, ...SPECTATORS];
}

// delta ladder 1e-2 .. 1e-8 (colliding member is index 0)
const DELTA_LADDER = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8];

const MEASUREMENTS = DELTA_LADDER.map((delta) => {
  const absFifth = Math.abs(fifthTotalDerivative(collisionConfig(delta))[0]);
  return { delta, absFifth };
});

// two-body control: exact closed form |x^(5)| = 1680 * delta^-9
const TWO_BODY_CONTROL = DELTA_LADDER.map((delta) => {
  const measured = Math.abs(fifthTotalDerivative([-delta / 2, delta / 2])[0]);
  const closedForm = 1680 * Math.pow(delta, -9);
  return { delta, measured, closedForm, relErr: Math.abs(measured / closedForm - 1) };
});

function loglogSlope(points) {
  const n = points.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const p of points) {
    const x = Math.log(p.delta);
    const y = Math.log(p.absFifth);
    sx += x; sy += y; sxx += x * x; sxy += x * y;
  }
  return (n * sxy - sx * sy) / (n * sxx - sx * sx);
}

const FULL_LADDER_SLOPE = loglogSlope(MEASUREMENTS);
const DEEP_TAIL_SLOPE = loglogSlope(MEASUREMENTS.filter((r) => r.delta <= 1e-5));
// deepest local exponent (1e-7 -> 1e-8)
const A = MEASUREMENTS[MEASUREMENTS.length - 2];
const B = MEASUREMENTS[MEASUREMENTS.length - 1];
const DEEPEST_LOCAL_EXPONENT =
  Math.log(B.absFifth / A.absFifth) / Math.log(B.delta / A.delta);

const PREDICTED_EXPONENT = -9; // imp-36192 I2
const LEADING_PREFACTOR = 1680; // pair coefficient of x^(5)
const STEP_SCALING_EXPONENT = 9 / 5; // dt <= eps^(1/5) delta^(9/5)

const IMP36233_ORDER5_ELEMENTARY_DIFFERENTIAL_DELTA_SCALING = {
  ticket: 'imp-36233',
  what:
    'Empirical order-5 total-time-derivative exponent of the backward-Dyson RHS ' +
    'f_k = -sum 1/(x_k-x_j) vs min gap delta, against the imp-36192 I2 predicted delta^-9.',
  method:
    'Exact Taylor-recursion auto-diff of the ODE; x_k^(5)(0) = 5! * C_{k,5}; ' +
    'multi-particle field (colliding pair + 3 fixed spectators); geometric delta ladder.',
  predictedExponent: PREDICTED_EXPONENT,
  measurements: MEASUREMENTS,
  fullLadderSlope: FULL_LADDER_SLOPE,
  deepTailSlope: DEEP_TAIL_SLOPE,
  deepestLocalExponent: DEEPEST_LOCAL_EXPONENT,
  leadingPrefactor: LEADING_PREFACTOR,
  twoBodyControl: TWO_BODY_CONTROL,
  stepScalingExponent: STEP_SCALING_EXPONENT,
  verdict: 'CONFIRMS-delta^-9',
  reliability: {
    exactAutoDiff: true,
    multiParticleField: true,
    spectatorsSubleading: true,
    note:
      'Deep-tail exponent -9.000000 to measured precision; full-ladder LS slope -9.000003; ' +
      'two-body control matches 1680*delta^-9 to ~1e-6 relative.',
  },
  honestCaveat: {
    isProof: false,
    isNumericalMeasurement: true,
    confirmsPredictedScaling: true,
    boundsTruncationError: false,
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
const IMP36233_ORDER5_ELEMENTARY_DIFFERENTIAL_DELTA_SCALING_ASSERTIONS = [
  {
    id: 'imp36233-delta-ladder-shape',
    why:
      'The measurement must be the requested geometric delta ladder 1e-2 .. 1e-8 with a ' +
      'strictly shrinking gap; a different ladder is no longer the requested front sweep.',
    holds: () =>
      MEASUREMENTS.length === 7 &&
      MEASUREMENTS[0].delta === 1e-2 &&
      MEASUREMENTS[MEASUREMENTS.length - 1].delta === 1e-8 &&
      MEASUREMENTS.every((r, i) => i === 0 || r.delta < MEASUREMENTS[i - 1].delta),
  },
  {
    id: 'imp36233-fitted-exponent-matches-minus9',
    why:
      'The fitted order-5 growth exponent must match the imp-36192 I2 predicted delta^-9: ' +
      'both the full-ladder LS slope and the deep-tail slope within a tight tolerance of -9.',
    holds: () =>
      Math.abs(FULL_LADDER_SLOPE - PREDICTED_EXPONENT) < 1e-4 &&
      Math.abs(DEEP_TAIL_SLOPE - PREDICTED_EXPONENT) < 1e-6 &&
      Math.abs(DEEPEST_LOCAL_EXPONENT - PREDICTED_EXPONENT) < 1e-6,
  },
  {
    id: 'imp36233-two-body-control-matches-closed-form',
    why:
      'The exact two-body caricature |x^(5)| = 1680 * delta^-9 is a known closed form; the ' +
      'auto-diff must reproduce it to ~1e-6 relative at every rung, validating the scheme.',
    holds: () => TWO_BODY_CONTROL.every((r) => r.relErr < 1e-5),
  },
  {
    id: 'imp36233-multiparticle-prefactor-converges-to-1680',
    why:
      'With spectators present the prefactor |x^(5)| * delta^9 must converge to the same ' +
      'leading pair coefficient 1680 as delta -> 0 (spectator corrections strictly subleading).',
    holds: () => {
      const deep = MEASUREMENTS[MEASUREMENTS.length - 1];
      const pref = deep.absFifth * Math.pow(deep.delta, 9);
      return Math.abs(pref / LEADING_PREFACTOR - 1) < 1e-3;
    },
  },
  {
    id: 'imp36233-step-scaling-exponent-9over5',
    why:
      'delta^-9 in the LTE (~dt^5 delta^-9) forces the fixed-tolerance step to shrink like ' +
      'delta^{9/5}=delta^{1.8}; a delta-independent dt is vacuous in the boundary layer.',
    holds: () => Math.abs(STEP_SCALING_EXPONENT - 1.8) < 1e-12,
  },
  {
    id: 'imp36233-honest-no-closure-no-qed',
    why:
      'Mandatory honesty: a MEASUREMENT that confirms the delta^-9 CRUX but bounds no ' +
      'truncation error, certifies no step bound, keeps G-step-error OPEN, carries no RH ' +
      'verdict, and leaves PT 0.2 the SOTA. If any flip, the module over-claims.',
    holds: () => {
      const h = IMP36233_ORDER5_ELEMENTARY_DIFFERENTIAL_DELTA_SCALING.honestCaveat;
      return (
        h.isProof === false &&
        h.isNumericalMeasurement === true &&
        h.confirmsPredictedScaling === true &&
        h.boundsTruncationError === false &&
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

for (const assertion of IMP36233_ORDER5_ELEMENTARY_DIFFERENTIAL_DELTA_SCALING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36233-order5-elementary-differential-delta-scaling assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36233_ORDER5_ELEMENTARY_DIFFERENTIAL_DELTA_SCALING;
