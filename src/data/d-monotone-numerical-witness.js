/**
 * @module d-monotone-numerical-witness
 * @fileoverview Numerical witness for D(tau) >= D(0) on backward CM trajectory (imp-457, imp-782).
 *
 * Exports: D_MONOTONE_N50_WITNESS, D_MONOTONE_N100_WITNESS (computed witness objects),
 * D_MONOTONE_WITNESS_RECORD (structured record with status/interpretation/limitation),
 * D_MONOTONE_ASSERTIONS (array of 8 build-time assertions checked by the engine harness).
 *
 * Proof chain step: advances sub-gap skp-imp457-D-monotone in
 * b1-slope-conditional-upper-bound.js from "plausible" to "numerically verified
 * at N=50 and N=100 on the Riemann zero list". The analytic proof remains open.
 *
 * Tickets: imp-457 (created this file), imp-782 (added @module/@fileoverview JSDoc).
 *
 * imp-457: D-monotone numerical witness at N = 50
 *
 * Sub-gap addressed
 * -----------------
 * skp-imp457-D-monotone (b1-slope-conditional-upper-bound.js):
 *   Prove D(tau) >= D(0) on [0, tau_c] under NoSwap,
 *   where D(tau) = 8 - 4 g_{k*}(tau)^2 S_{k*}(tau).
 *
 * This file advances the sub-gap from "plausible from physics" to
 * "numerically witnessed": we run the backward Calogero-Moser flow
 * starting from the first N = 50 Riemann zeros and verify that D(tau)
 * remains >= D(0) at every sampled step until B drops to STOP_FRACTION
 * of its initial value (safely away from the collision singularity).
 *
 * We also check NoSwap: if k* shifts during the run, the conditional
 * chain is not applicable for this trajectory.
 *
 * The ODE
 * -------
 * Backward CM flow: d(gamma_k)/d(tau) = -2 * Sum_{j != k} 1/(gamma_k - gamma_j)
 *
 * At each tau, the minimum-gap quantity is:
 *   B(tau)   = min_k (gamma_{k+1}(tau) - gamma_k(tau))
 *   k*(tau)  = argmin above
 *   S_{k*}   = Sum_{j != {k*, k*+1}} 1 / [(gamma_{k*+1}-gamma_j)(gamma_{k*}-gamma_j)]
 *   D(tau)   = 8 - 4 * B(tau)^2 * S_{k*}(tau)
 *
 * The D-monotone claim requires D(tau) >= D(0) on the full [0, tau_c].
 *
 * Honest status
 * -------------
 * This is a NUMERICAL WITNESS, not a proof. It establishes:
 *   "For N = 50 zeta zeros under the deterministic CM flow, D(tau)
 *    is non-decreasing and NoSwap holds along the backward trajectory
 *    until B drops to STOP_FRACTION * B(0)."
 * It does NOT prove the claim for all N or for all initial data.
 * The analytic proof of skp-imp457-D-monotone remains open.
 * This witness elevates the sub-gap status from "plausible" to
 * "verified numerically at N = 50 on the Riemann zero list".
 *
 * Connection to the bound chain
 * -----------------------------
 * If D(tau) >= D(0) on [0, tau_c], then d(B^2)/d(tau) <= -D(0) and
 * integrating gives tau_c <= B(0)^2 / D(0) = tau_lin(N), closing B1
 * (b1-slope-conditional-upper-bound.js Step 4).
 *
 * SYNTAX NOTE: the sequence (star)(slash) closes a JSDoc comment block,
 * so "k*(tau)" in running prose is written with braces instead.
 */

import { ZETA_ZEROS } from '../math/zeta.js';

const WITNESS_N     = 50;
const DTAU          = 5e-5;   // backward time step
const MAX_STEPS     = 3000;   // max tau_covered = 3000 * 5e-5 = 0.15
const STOP_FRACTION = 0.30;   // stop when B < 30% of B(0), safely pre-collision
const B_ABS_MIN     = 1e-3;   // absolute safety floor to prevent near-singularity steps

// ── Helpers ───────────────────────────────────────────────────────────────────

function findMinGap(gammas) {
  let kStar = 0;
  let B = gammas[1] - gammas[0];
  for (let k = 1; k < gammas.length - 1; k++) {
    const g = gammas[k + 1] - gammas[k];
    if (g < B) { B = g; kStar = k; }
  }
  return { kStar, B };
}

// S_{k*} = Sum_{j not in {k*, k*+1}} 1 / [(gamma_{k*+1}-gamma_j)(gamma_{k*}-gamma_j)]
function computeS(gammas, kStar) {
  const gk1 = gammas[kStar + 1];
  const gk  = gammas[kStar];
  let S = 0;
  for (let j = 0; j < gammas.length; j++) {
    if (j === kStar || j === kStar + 1) continue;
    const a = gk1 - gammas[j];
    const b = gk  - gammas[j];
    // a*b > 0 always: left side both positive, right side both negative
    if (Math.abs(a * b) < 1e-30) continue;
    S += 1 / (a * b);
  }
  return S;
}

// Backward CM step: gamma_k -> gamma_k + dtau * (-2 * Sum 1/(gamma_k - gamma_j))
function cmBackwardStep(gammas, dtau) {
  const N   = gammas.length;
  const vel = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    let s = 0;
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const d = gammas[n] - gammas[k];
      if (Math.abs(d) < 1e-15) continue;
      s += 1 / d;
    }
    vel[n] = -2 * s;
  }
  const next = new Float64Array(N);
  for (let i = 0; i < N; i++) next[i] = gammas[i] + dtau * vel[i];
  return next;
}

// ── Main witness computation ──────────────────────────────────────────────────

function runDMonotoneWitness(witnessN) {
  let gammas = Float64Array.from(ZETA_ZEROS.slice(0, witnessN));

  // Initial quantities at tau = 0
  const { kStar: k0, B: B0 } = findMinGap(gammas);
  const S0 = computeS(gammas, k0);
  const D0 = 8 - 4 * B0 * B0 * S0;
  const F0 = B0 * B0 * S0;

  let dMonotoneViolated = false;
  let noSwapViolated    = false;
  let stepsRun          = 0;
  let Bfinal            = B0;
  let Dfinal            = D0;
  let minDObserved      = D0;

  // Record D at evenly-spaced sample indices for inspection
  const samplePoints = [
    { tau: 0, D: +D0.toFixed(8), B: +B0.toFixed(8), F: +F0.toFixed(8) },
  ];

  for (let step = 0; step < MAX_STEPS; step++) {
    gammas = cmBackwardStep(gammas, DTAU);
    stepsRun++;

    const { kStar, B } = findMinGap(gammas);

    // Check NoSwap: k* must not have changed since tau = 0
    if (kStar !== k0) {
      noSwapViolated = true;
      break;
    }

    const S = computeS(gammas, kStar);
    const D = 8 - 4 * B * B * S;
    const F = B * B * S;

    if (D < minDObserved) minDObserved = D;
    // Allow tiny numerical tolerance for floating-point rounding
    if (D < D0 - 1e-9) dMonotoneViolated = true;

    if (step % 500 === 499) {
      samplePoints.push({
        tau: +((step + 1) * DTAU).toFixed(6),
        D:   +D.toFixed(8),
        B:   +B.toFixed(8),
        F:   +F.toFixed(8),
      });
    }

    Bfinal = B;
    Dfinal = D;

    // Stop before the collision singularity
    if (B < STOP_FRACTION * B0 || B < B_ABS_MIN) break;
  }

  const tauCovered    = +(stepsRun * DTAU).toFixed(6);
  const BratioCovered = +(1 - Bfinal / B0).toFixed(4);

  return {
    N:              witnessN,
    dtau:           DTAU,
    stepsRun,
    tauCovered,
    B0:             +B0.toFixed(8),
    D0:             +D0.toFixed(8),
    F0:             +F0.toFixed(8),
    Bfinal:         +Bfinal.toFixed(8),
    Dfinal:         +Dfinal.toFixed(8),
    BratioCovered,
    minDObserved:   +minDObserved.toFixed(8),
    dMonotoneHolds: !dMonotoneViolated,
    noSwapHolds:    !noSwapViolated,
    samplePoints,
  };
}

export const D_MONOTONE_N50_WITNESS  = runDMonotoneWitness(WITNESS_N);

// ── N = 100 witness (second independent N value for stronger evidence) ────────
export const D_MONOTONE_N100_WITNESS = runDMonotoneWitness(100);

// ── Structured record ─────────────────────────────────────────────────────────

export const D_MONOTONE_WITNESS_RECORD = {
  id:     'skp-imp457-D-monotone-witness',
  ticket: 'imp-457',
  subGap: 'skp-imp457-D-monotone',
  title:  'Numerical witness: D(tau) >= D(0) on backward CM trajectory at N = 50 and N = 100',

  status:
    D_MONOTONE_N50_WITNESS.dMonotoneHolds  && D_MONOTONE_N50_WITNESS.noSwapHolds &&
    D_MONOTONE_N100_WITNESS.dMonotoneHolds && D_MONOTONE_N100_WITNESS.noSwapHolds
      ? 'numerical-witness-passes'
      : 'numerical-witness-fails',

  method: {
    Ns:           [WITNESS_N, 100],
    dtau:         DTAU,
    maxSteps:     MAX_STEPS,
    stopFraction: STOP_FRACTION,
    description:
      'Backward CM flow d(gamma_k)/d(tau) = -2 Sum 1/(gamma_k - gamma_j), ' +
      'explicit Euler integration. At each step: find k* = argmin gap, ' +
      'compute S_{k*}, compute D = 8 - 4*B^2*S_{k*}. ' +
      'Check D >= D(0) and k* constant (NoSwap). Run independently at N=50 and N=100.',
  },

  result: {
    N50: {
      dMonotoneHolds: D_MONOTONE_N50_WITNESS.dMonotoneHolds,
      noSwapHolds:    D_MONOTONE_N50_WITNESS.noSwapHolds,
      D0:             D_MONOTONE_N50_WITNESS.D0,
      minDObserved:   D_MONOTONE_N50_WITNESS.minDObserved,
      DfinalAtStop:   D_MONOTONE_N50_WITNESS.Dfinal,
      BratioCovered:  D_MONOTONE_N50_WITNESS.BratioCovered,
      tauCovered:     D_MONOTONE_N50_WITNESS.tauCovered,
      samplePoints:   D_MONOTONE_N50_WITNESS.samplePoints,
    },
    N100: {
      dMonotoneHolds: D_MONOTONE_N100_WITNESS.dMonotoneHolds,
      noSwapHolds:    D_MONOTONE_N100_WITNESS.noSwapHolds,
      D0:             D_MONOTONE_N100_WITNESS.D0,
      minDObserved:   D_MONOTONE_N100_WITNESS.minDObserved,
      DfinalAtStop:   D_MONOTONE_N100_WITNESS.Dfinal,
      BratioCovered:  D_MONOTONE_N100_WITNESS.BratioCovered,
      tauCovered:     D_MONOTONE_N100_WITNESS.tauCovered,
    },
    bothPass:
      D_MONOTONE_N50_WITNESS.dMonotoneHolds  && D_MONOTONE_N50_WITNESS.noSwapHolds &&
      D_MONOTONE_N100_WITNESS.dMonotoneHolds && D_MONOTONE_N100_WITNESS.noSwapHolds,
  },

  interpretation:
    D_MONOTONE_N50_WITNESS.dMonotoneHolds && D_MONOTONE_N100_WITNESS.dMonotoneHolds
      ? 'D(tau) never fell below D(0) on either the N=50 or N=100 trajectory. ' +
        'At N=50: D increased from D(0)=' + D_MONOTONE_N50_WITNESS.D0 +
        ' to ' + D_MONOTONE_N50_WITNESS.Dfinal +
        ' (' + (D_MONOTONE_N50_WITNESS.BratioCovered * 100).toFixed(1) + '% toward collision). ' +
        'At N=100: D increased from D(0)=' + D_MONOTONE_N100_WITNESS.D0 +
        ' to ' + D_MONOTONE_N100_WITNESS.Dfinal +
        ' (' + (D_MONOTONE_N100_WITNESS.BratioCovered * 100).toFixed(1) + '% toward collision). ' +
        'Two independent N values support the D-monotone assumption in ' +
        'b1-slope-conditional-upper-bound.js Step 3.'
      : 'WARNING: D-monotone VIOLATED at one or both of N=50, N=100. ' +
        'The conditional B1 closure chain may not hold for these initial conditions.',

  limitation:
    'Numerical witness only. Covers N=50 and N=100 with specific initial ' +
    'configurations (first N Riemann zeros). Does not prove the claim for all N ' +
    'or all initial data. The analytic sub-gap skp-imp457-D-monotone remains open. ' +
    'An analytic proof would require controlling dS_{k*}/d(tau) via the full CM ' +
    'equations, using g_j(tau) >= B(tau) under NoSwap.',
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const D_MONOTONE_ASSERTIONS = [
  {
    id: 'imp457-d-monotone-witness-holds-n50',
    holds: () => D_MONOTONE_N50_WITNESS.dMonotoneHolds,
    why:
      'D(tau) must be >= D(0) throughout the N=50 backward CM trajectory. ' +
      'A failure means D dips below its initial value, which would invalidate ' +
      'the D-monotone hypothesis of the conditional B1 closure (Step 3 of ' +
      'b1-slope-conditional-upper-bound.js). The conditional chain depends on ' +
      'd(B^2)/d(tau) <= -D(0), which requires D(tau) >= D(0).',
  },
  {
    id: 'imp457-noswap-witness-holds-n50',
    holds: () => D_MONOTONE_N50_WITNESS.noSwapHolds,
    why:
      'The NoSwap hypothesis must hold at N=50: k* must not shift during the ' +
      'backward CM simulation. A shift invalidates the NoSwap leg of the ' +
      'conditional B1 closure. This is the first of the two conditions named ' +
      'in b1-slope-conditional-upper-bound.js.',
  },
  {
    id: 'imp457-witness-non-trivial-coverage',
    holds: () =>
      D_MONOTONE_N50_WITNESS.stepsRun >= 100 &&
      D_MONOTONE_N50_WITNESS.BratioCovered > 0.20,
    why:
      'The simulation must cover at least 20% of the trajectory toward collision ' +
      '(B reduced by at least 20% from B0). A shorter run provides negligible ' +
      'evidence for D-monotone and would signal a bug in the stopping logic.',
  },
  {
    id: 'imp457-witness-D0-positive',
    holds: () => D_MONOTONE_N50_WITNESS.D0 > 0,
    why:
      'D(0) = 8 - 4*F(0) must be strictly positive at N=50. This matches ' +
      'dyson-slope-analytic-bound.js assertion boundary-drift-strictly-negative ' +
      'at N=50. If D(0) <= 0, the comparison bound tau_c <= B0^2/D0 is vacuous.',
  },
  {
    id: 'imp457-witness-D-increases-toward-collision',
    holds: () =>
      D_MONOTONE_N50_WITNESS.Dfinal > D_MONOTONE_N50_WITNESS.D0,
    why:
      'D must increase from D(0) toward 8 as B decreases toward 0. ' +
      'D(tau_c) -> 8 since F = B^2*S -> 0 near collision. ' +
      'A failure means the trajectory stopped before D had a chance to increase, ' +
      'which indicates the stopping criterion fired too early.',
  },
  {
    id: 'imp457-d-monotone-witness-holds-n100',
    holds: () => D_MONOTONE_N100_WITNESS.dMonotoneHolds,
    why:
      'D(tau) must be >= D(0) throughout the N=100 backward CM trajectory. ' +
      'Extends the N=50 check to a second, larger N value. A violation here ' +
      'would indicate the D-monotone property breaks down for the first 100 ' +
      'Riemann zeros, undermining the conditional B1 closure at scale N=100.',
  },
  {
    id: 'imp457-noswap-witness-holds-n100',
    holds: () => D_MONOTONE_N100_WITNESS.noSwapHolds,
    why:
      'The NoSwap hypothesis must hold at N=100: k* must not shift during the ' +
      'backward CM simulation at this larger N. Extends the N=50 NoSwap check ' +
      'to confirm the argmin index remains stable for 100 zeros.',
  },
  {
    id: 'imp457-witness-D0-positive-n100',
    holds: () => D_MONOTONE_N100_WITNESS.D0 > 0,
    why:
      'D(0) = 8 - 4*F(0) must be strictly positive at N=100. Required for the ' +
      'comparison bound tau_c <= B0^2/D0 to be meaningful. Confirms the N=100 ' +
      'initial configuration is in generic position (no accidental degeneracy).',
  },
];
