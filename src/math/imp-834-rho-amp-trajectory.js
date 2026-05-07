/**
 * imp-964 follow-up to imp-834: numerical evaluation of the AMPLIFICATION RATIO
 *
 *   rho_amp(tau) := T_singular(tau) * B(tau)^2 / (2 * S(tau))
 *
 * along the BACKWARD Calogero-Moser trajectory, sampled at the imp-933
 * certified plateau-START N values. The static (tau = 0) analysis lives in
 * route-c-dynamical-analysis.js. THIS file extends that analysis from a
 * single instant (tau = 0) to a TRAJECTORY by integrating the backward Dyson
 * ODE forward in tau and recomputing rho_amp at each sampled time.
 *
 * GOAL OF THE TEST
 * ----------------
 * imp-834 showed that the SINGULAR contribution to dS_{k_star}/dtau is
 * NEGATIVE (-4 * T_singular) and concluded a PRELIMINARY NEGATIVE RESULT:
 * the product S_{k_star} * B^2 is monotone-decreasing along the backward
 * flow, so it cannot exceed the static ceiling 2. The single open question
 * left for the DIRECT quantity (escape hatches "weighted-S",
 * "CM-Hamiltonian-constraint", and "regularization-near-collision" remain
 * separately open) is whether rho_amp ever exceeds 1 ANYWHERE along the
 * trajectory, which would flip the sign of d(S_{k_star}*B^2)/dtau and
 * INVALIDATE the monotonicity argument.
 *
 *   d(S_{k_star} * B^2) / dtau_leading = 8 * S * (rho_amp - 1)
 *
 * So:
 *   rho_amp < 1  =>  S * B^2 decreasing  =>  imp-834 negative result HOLDS
 *   rho_amp > 1  =>  S * B^2 increasing  =>  imp-834 negative result REFUTED
 *
 * imp-834 already showed rho_amp << 1 at tau = 0 for N up to 1e5. THIS file
 * checks: does rho_amp ever climb above 1 BETWEEN tau = 0 and tau = tau_c?
 *
 * METHOD
 * ------
 * For each plateau-start N value (the H_raw-update points from
 * IMP_857_UNIFORM_K_BOUND.hRawUpdates) up to a build-time-affordable cap,
 * we
 *   (1) load the first N zeros as initial condition,
 *   (2) integrate the backward CM ODE
 *         dgamma_k / dtau = -2 * SUM_{j != k} 1/(gamma_k - gamma_j)
 *       with classical RK4 in float64 (no interval certificate is needed
 *       for the empirical question rho_amp > 1?),
 *   (3) at K_SAMPLES uniformly-spaced tau values in [0, 0.5 * t_c_pair],
 *       where t_c_pair = H_raw^2 / 8 is the two-body collision time, recompute
 *           k_star  = argmin_k (gamma_{k+1} - gamma_k)
 *           B       = gamma_{k_star+1} - gamma_{k_star}
 *           d_j     = gamma_{k_star+1} - gamma_j   (j outside {k_star, k_star+1})
 *           e_j     = gamma_{k_star}   - gamma_j
 *           S       = SUM 1/(d_j * e_j)
 *           T_sing  = SUM 1/(d_j * e_j) * (1/d_j^2 + 1/e_j^2)
 *           rho_amp = T_sing * B^2 / (2 * S)
 *       and record the trajectory row,
 *   (4) abort early (set "collisionApproached: true") if any gap drops below
 *       1e-5 (the integrator becomes unreliable near collision and we know
 *       the certified t_c_hi is much further out anyway — we only need the
 *       INTERIOR-of-trajectory check),
 *   (5) summarise per-plateau peak rho_amp and global max.
 *
 * NUMERICAL COST
 * --------------
 * Each RK4 step does 4 derivative evaluations at O(N^2) cost. With
 * K_SAMPLES = 5 sub-intervals (so 5 RK4 transports between samples,
 * each broken into RK_SUBSTEPS = 4 sub-steps), the per-N cost is
 *   5 * 4 * 4 * N^2 = 80 N^2.
 * Cap N <= MAX_N_TRAJECTORY = 500 keeps total cost under 80 * 500^2 *
 * (number of plateaus with N <= 500) ~= 5e8 ops at the worst, well within
 * a one-off research-module budget.
 *
 * For N > MAX_N_TRAJECTORY we still record the static (tau = 0) rho_amp from
 * a single configuration evaluation, so the trajectory dataset spans every
 * plateau-start N in the H_raw-updates list, even if higher-N rows have
 * trajectory: null.
 *
 * SYNTAX NOTE: avoid star-slash sequences anywhere in this JSDoc — use k*
 * with a separating brace (k_star) when adjacent to a slash, e.g. write
 * "d_{k_star}/dtau" instead of the literal "dg_{k*}/dtau" form which
 * accidentally closes the comment. Apostrophes are fine inside a JSDoc
 * block; only single-quoted JS string literals must avoid them.
 */

import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';
import { IMP_857_UNIFORM_K_BOUND } from './imp-857-uniform-K-bound.js';

const MAX_N_TRAJECTORY = 500;   // cap N at which we run RK4
const MIN_N_TRAJECTORY = 11;    // skip trivial few-body N < 10
const K_SAMPLES        = 5;     // number of RK4 transports per trajectory
const RK_SUBSTEPS      = 4;     // sub-steps per transport (smaller dt)
const COLLISION_GUARD  = 1e-5;  // abort if min gap drops below this

// ── ODE primitives (classical RK4 on the backward CM flow) ─────────────────

function dysonBackwardDeriv(gammas) {
  const N = gammas.length;
  const dg = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    let sum = 0;
    let comp = 0; // Kahan compensation
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const diff = gammas[n] - gammas[k];
      if (Math.abs(diff) < 1e-15) continue;
      const term = 1 / diff;
      const t = sum + term;
      comp += Math.abs(sum) >= Math.abs(term)
        ? (sum - t) + term
        : (term - t) + sum;
      sum = t;
    }
    // backward sign: minus
    dg[n] = -2 * (sum + comp);
  }
  return dg;
}

function rk4StepBackward(gammas, dt) {
  const N = gammas.length;
  const k1 = dysonBackwardDeriv(gammas);
  const y1 = new Float64Array(N);
  for (let i = 0; i < N; i++) y1[i] = gammas[i] + (dt / 2) * k1[i];
  const k2 = dysonBackwardDeriv(y1);
  const y2 = new Float64Array(N);
  for (let i = 0; i < N; i++) y2[i] = gammas[i] + (dt / 2) * k2[i];
  const k3 = dysonBackwardDeriv(y2);
  const y3 = new Float64Array(N);
  for (let i = 0; i < N; i++) y3[i] = gammas[i] + dt * k3[i];
  const k4 = dysonBackwardDeriv(y3);
  const out = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    out[i] = gammas[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
  return out;
}

// ── rho_amp evaluator at a single configuration ────────────────────────────

function rhoAmpAt(gammas) {
  const N = gammas.length;
  let B = Infinity;
  let kStar = 0;
  let minGap = Infinity;
  for (let k = 0; k < N - 1; k++) {
    const g = gammas[k + 1] - gammas[k];
    if (g < B) { B = g; kStar = k; }
    if (g < minGap) minGap = g;
  }
  if (B <= 0) {
    return { B, kStar_1idx: kStar + 1, S: NaN, T_sing: NaN, rho_amp: NaN, minGap, kStar };
  }
  const gks  = gammas[kStar];
  const gks1 = gammas[kStar + 1];
  let S = 0;
  let T_sing = 0;
  for (let j = 0; j < N; j++) {
    if (j === kStar || j === kStar + 1) continue;
    const d = gks1 - gammas[j];
    const e = gks  - gammas[j];
    const denom = d * e;
    if (denom === 0) continue;
    const inv = 1 / denom;
    S += inv;
    T_sing += inv * (1 / (d * d) + 1 / (e * e));
  }
  const rho_amp = (T_sing * B * B) / (2 * S);
  return { B, kStar_1idx: kStar + 1, S, T_sing, rho_amp, minGap, kStar };
}

// ── Trajectory runner ──────────────────────────────────────────────────────

function trajectoryAtN(N, H_raw) {
  const initial = ZEROS_EXTENDED.slice(0, N);
  let gammas = Float64Array.from(initial);

  // Two-body collision time of the tightest pair.
  const t_c_pair = (H_raw * H_raw) / 8;
  // Sample tau in [0, tau_max] with tau_max = 0.5 * t_c_pair to stay well
  // before the actual N-body collision (which is later than t_c_pair).
  const tauMax    = 0.5 * t_c_pair;
  const sampleDt  = tauMax / K_SAMPLES;
  const microDt   = sampleDt / RK_SUBSTEPS;

  const samples = [];
  let tau = 0;
  let collisionApproached = false;

  // Sample at tau = 0.
  samples.push({
    tau:        +tau.toExponential(4),
    ...formatRhoAmpRow(rhoAmpAt(gammas)),
  });

  for (let s = 0; s < K_SAMPLES; s++) {
    for (let m = 0; m < RK_SUBSTEPS; m++) {
      const next = rk4StepBackward(gammas, microDt);
      let mg = Infinity;
      for (let i = 0; i < N - 1; i++) {
        const g = next[i + 1] - next[i];
        if (g < mg) mg = g;
      }
      if (!Number.isFinite(mg) || mg < COLLISION_GUARD) {
        collisionApproached = true;
        break;
      }
      gammas = next;
      tau += microDt;
    }
    if (collisionApproached) break;
    samples.push({
      tau: +tau.toExponential(4),
      ...formatRhoAmpRow(rhoAmpAt(gammas)),
    });
  }

  // Peak rho_amp along trajectory.
  let peak = -Infinity;
  let peakAtTau = null;
  for (const r of samples) {
    if (Number.isFinite(r.rho_amp) && r.rho_amp > peak) {
      peak = r.rho_amp;
      peakAtTau = r.tau;
    }
  }

  return {
    N,
    H_raw,
    t_c_pair: +t_c_pair.toExponential(4),
    tauMax:   +tauMax.toExponential(4),
    samples,
    peakRhoAmp:      Number.isFinite(peak) ? +peak.toExponential(4) : NaN,
    peakAtTau,
    amplifies:       Number.isFinite(peak) && peak > 1,
    collisionApproached,
  };
}

function formatRhoAmpRow(r) {
  return {
    B:          Number.isFinite(r.B)      ? +r.B.toExponential(3)      : NaN,
    S:          Number.isFinite(r.S)      ? +r.S.toExponential(4)      : NaN,
    T_sing:     Number.isFinite(r.T_sing) ? +r.T_sing.toExponential(4) : NaN,
    rho_amp:    Number.isFinite(r.rho_amp)? +r.rho_amp.toExponential(4): NaN,
    kStar_1idx: r.kStar_1idx,
  };
}

// Single-shot tau = 0 baseline for N values too large to integrate.
function staticRhoAmpAtN(N, H_raw) {
  const initial = ZEROS_EXTENDED.slice(0, N);
  const gammas = Float64Array.from(initial);
  const r = rhoAmpAt(gammas);
  return {
    N,
    H_raw,
    t_c_pair: +((H_raw * H_raw) / 8).toExponential(4),
    samples: [
      { tau: 0, ...formatRhoAmpRow(r) },
    ],
    peakRhoAmp:      Number.isFinite(r.rho_amp) ? +r.rho_amp.toExponential(4) : NaN,
    peakAtTau:       0,
    amplifies:       Number.isFinite(r.rho_amp) && r.rho_amp > 1,
    collisionApproached: false,
    trajectorySkipped: 'N exceeds MAX_N_TRAJECTORY; static-only baseline reported',
  };
}

// ── Run for every plateau-start N ──────────────────────────────────────────

const PLATEAUS = IMP_857_UNIFORM_K_BOUND.plateaus;
const TRAJECTORIES = PLATEAUS
  .filter((p) => p.startN >= MIN_N_TRAJECTORY)
  .map((p) =>
    p.startN <= MAX_N_TRAJECTORY
      ? trajectoryAtN(p.startN, p.H_raw)
      : staticRhoAmpAtN(p.startN, p.H_raw),
  );

const TRAJECTORIES_RUN_COUNT     = TRAJECTORIES.filter((t) => !t.trajectorySkipped).length;
const TRAJECTORIES_STATIC_COUNT  = TRAJECTORIES.filter((t) =>  t.trajectorySkipped).length;
const ANY_AMPLIFIES              = TRAJECTORIES.some((t) => t.amplifies);
const ALL_PEAK_RHO_AMP_BELOW_ONE = TRAJECTORIES.every(
  (t) => Number.isFinite(t.peakRhoAmp) && t.peakRhoAmp < 1,
);
const GLOBAL_MAX_RHO_AMP = Math.max(
  ...TRAJECTORIES
    .map((t) => t.peakRhoAmp)
    .filter((x) => Number.isFinite(x)),
);
const GLOBAL_MAX_AT = TRAJECTORIES.find(
  (t) => t.peakRhoAmp === GLOBAL_MAX_RHO_AMP,
);

// Monotonicity check: for each trajectory, did rho_amp INCREASE between
// tau = 0 and the trajectory peak? (Static rows contribute neutral.)
const TRAJECTORIES_WITH_TAU_GROWTH = TRAJECTORIES
  .filter((t) => !t.trajectorySkipped && t.samples.length >= 2)
  .filter((t) => {
    const rho0 = t.samples[0].rho_amp;
    return Number.isFinite(rho0)
        && Number.isFinite(t.peakRhoAmp)
        && t.peakRhoAmp > rho0;
  })
  .map((t) => ({
    N: t.N,
    rhoAmp_tau0:    t.samples[0].rho_amp,
    rhoAmp_peak:    t.peakRhoAmp,
    peakAtTau:      t.peakAtTau,
    growthFactor:   +(t.peakRhoAmp / t.samples[0].rho_amp).toFixed(3),
  }));

// ── Exported record ────────────────────────────────────────────────────────

export const IMP_834_RHO_AMP_TRAJECTORY = Object.freeze({
  id: 'imp-964',
  parent: 'imp-834',
  title:
    'imp-834 follow-up: rho_amp(tau) = T_sing * B^2 / (2 * S) along backward ' +
    'Dyson trajectory at every imp-857 plateau-start N',
  status: 'numerical-trajectory-evidence',
  question:
    'Does the amplification ratio rho_amp ever exceed 1 anywhere along the ' +
    'backward CM flow at any plateau-start N? rho_amp > 1 anywhere would ' +
    'INVALIDATE the imp-834 monotonicity argument and re-open Route C.',
  method: {
    odeFamily: 'backward Calogero-Moser flow d(gamma_k)/dtau = -2 * SUM_{j!=k} 1/(gamma_k - gamma_j)',
    integrator: 'classical RK4 (float64) with Kahan-summed pairwise interactions',
    sampleScheme: `${K_SAMPLES} samples per trajectory in tau ∈ [0, 0.5 * t_c_pair], with t_c_pair = H_raw^2 / 8`,
    rkSubsteps:  RK_SUBSTEPS,
    collisionGuard: COLLISION_GUARD,
    nCap: MAX_N_TRAJECTORY,
    plateausCovered: PLATEAUS.length,
    plateausWithFullTrajectory: TRAJECTORIES_RUN_COUNT,
    plateausWithStaticOnly:     TRAJECTORIES_STATIC_COUNT,
  },
  trajectories: TRAJECTORIES,
  summary: {
    anyAmplifies:              ANY_AMPLIFIES,
    allPeakRhoAmpBelowOne:     ALL_PEAK_RHO_AMP_BELOW_ONE,
    globalMaxPeakRhoAmp:       GLOBAL_MAX_RHO_AMP,
    globalMaxAtN:              GLOBAL_MAX_AT?.N ?? null,
    globalMaxAtTau:            GLOBAL_MAX_AT?.peakAtTau ?? null,
    trajectoriesWithTauGrowth: TRAJECTORIES_WITH_TAU_GROWTH,
  },
  verdict: ANY_AMPLIFIES
    ? {
        outcome: 'imp-834-NEGATIVE-RESULT-REFUTED',
        statement:
          'At least one plateau-start N exhibits rho_amp > 1 somewhere along ' +
          'the backward trajectory. The imp-834 monotonicity argument for ' +
          'd(S * B^2)/dtau is therefore INVALID at that point, and Route C ' +
          'dynamical may yet provide c(N) > 2. Further analysis required.',
      }
    : {
        outcome: 'imp-834-NEGATIVE-RESULT-CORROBORATED',
        statement:
          'rho_amp < 1 at every sampled tau on every plateau-start N in the ' +
          'integrable range. The imp-834 monotonicity argument for ' +
          'd(S_{k_star} * B^2)/dtau holds empirically: the product is ' +
          'decreasing along the backward flow, confirming the static ceiling ' +
          'cannot be exceeded dynamically by the DIRECT quantity. The three ' +
          'remaining escape hatches (weighted-S, CM-Hamiltonian, matched ' +
          'asymptotic near collision) are unaffected and remain open.',
      },
  openSubGap: ANY_AMPLIFIES
    ? {
        id: 'imp-834-amplification-event',
        statement:
          'Specific (N, tau) pair where rho_amp first exceeds 1 needs a ' +
          'second-order analysis: is it a transient overshoot or a sustained ' +
          'amplification regime? If sustained, integrate d(S*B^2)/dtau along ' +
          'the trajectory to test the static ceiling violation.',
        difficulty: 'research-grade',
        status: 'open',
      }
    : {
        id: 'G3a_sub_fullsum_dynamical_routeC',
        statement:
          'imp-834 escape hatches: weighted-S quantity, Calogero-Moser ' +
          'Hamiltonian constraint, and matched-asymptotic regularization ' +
          'near the first collision remain unresolved by THIS trajectory ' +
          'evidence. Closing any one of them is still a research sub-gap.',
        difficulty: 'research-grade',
        status: 'open',
      },
  deliverables: [
    'Per-plateau rho_amp(tau) trajectories at every imp-857 plateau-start N up to N=' + MAX_N_TRAJECTORY,
    'Static (tau = 0) rho_amp baselines for N > ' + MAX_N_TRAJECTORY + ' where the trajectory is skipped',
    'Global summary: anyAmplifies, globalMaxPeakRhoAmp, list of trajectories with tau-growth in rho_amp',
    'Verdict: imp-834 monotonicity corroborated or refuted by trajectory evidence',
  ],
});

// ── Build-time assertions ──────────────────────────────────────────────────

export const IMP_834_RHO_AMP_TRAJECTORY_ASSERTIONS = [
  {
    id: 'imp964-trajectories-cover-every-plateau-start',
    holds: () =>
      IMP_834_RHO_AMP_TRAJECTORY.trajectories.length ===
      PLATEAUS.filter((p) => p.startN >= MIN_N_TRAJECTORY).length,
    why:
      'Every non-trivial (N >= ' + MIN_N_TRAJECTORY + ') plateau-start in the ' +
      '27 H_raw-update set must contribute a row, otherwise the trajectory ' +
      'sweep is incomplete and the monotonicity verdict is provisional.',
  },
  {
    id: 'imp964-rho-amp-finite-at-tau-zero',
    holds: () =>
      IMP_834_RHO_AMP_TRAJECTORY.trajectories.every(
        (t) => Number.isFinite(t.samples[0]?.rho_amp),
      ),
    why:
      'rho_amp(0) must be finite at every plateau-start N. A NaN or Infinity ' +
      'indicates a degenerate configuration (zero gap, NaN B, etc.) that ' +
      'invalidates the trajectory row.',
  },
  {
    id: 'imp964-verdict-matches-data',
    holds: () => {
      const v = IMP_834_RHO_AMP_TRAJECTORY.verdict.outcome;
      const a = IMP_834_RHO_AMP_TRAJECTORY.summary.anyAmplifies;
      return (a && v === 'imp-834-NEGATIVE-RESULT-REFUTED')
          || (!a && v === 'imp-834-NEGATIVE-RESULT-CORROBORATED');
    },
    why:
      'The verdict label must agree with summary.anyAmplifies. Mismatch is a ' +
      'self-consistency bug that would silently misreport the imp-834 status.',
  },
  {
    id: 'imp964-status-numerical-trajectory-evidence',
    holds: () => IMP_834_RHO_AMP_TRAJECTORY.status === 'numerical-trajectory-evidence',
    why:
      'This module delivers numerical trajectory evidence; it does NOT prove ' +
      'a closed-form bound. Flipping status to closed/proven without a rigorous ' +
      'argument would be a false claim.',
  },
];
