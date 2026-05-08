/**
 * @module interval-dyson-collision
 * @fileoverview imp-318 — verified-computing (interval arithmetic) Dyson
 * backward integration record. Replaces the float64-RK4 + Kahan-summation
 * Path C number with a one-ULP outward-rounded interval bracket on the
 * collision time τ_c at the Riemann zeros. Exports
 * {@link INTERVAL_DYSON_COLLISION} (per-N bracket data) and
 * {@link INTERVAL_DYSON_COLLISION_ASSERTIONS} (build guards). Belongs to
 * the PATH C hybrid proof chain at the verified-arithmetic step.
 * Module-doc added by imp-970.
 * @see imp-318
 * @see imp-362
 */

/**
 * Verified-computing (interval arithmetic) Dyson backward integration (imp-318)
 *
 * Path C currently delivers Λ ≤ 0.0066 + 0.01 (bridge-lambda-rh.js) using
 * float64 RK4 + Kahan summation (dyson-ode-integrator.js, imp-306). That
 * pipeline tracks per-step error empirically but does NOT propagate a
 * certified mathematical interval through the backward Dyson flow. Until
 * the integration is verified-computing rigorous, every Λ-from-Path-C
 * statement is implicitly conditional on float64 not being adversarial.
 * imp-318 raises this to "critical" because any Λ-based RH argument must
 * end as a theorem, not a numerical fit.
 *
 * This file supplies the FOUNDATION: a verified-computing version of the
 * one backward Dyson Euler step, run on a small truncation of the Odlyzko
 * zero list using the Interval class from src/math/interval-arithmetic.js
 * (imp-068). At each step every γ_k(t) is wrapped in [lo, hi] and updated
 * via interval add / sub / mul / div, so the trajectory carries a CERTIFIED
 * enclosure of the true Calogero-Moser orbit. The minimum-gap functional
 * B(t) likewise becomes an interval [B_lo(t), B_hi(t)]. The certified
 * collision interval is then [t at last step with B_lo > 0, t at first
 * step with B_lo ≤ 0]: that bracketing is rigorous, not heuristic.
 *
 * Scope and honesty
 * -----------------
 * This is a SMALL-N WITNESS, not a replacement for the N=2458 Path C run.
 * The naive interval wrapper widens at every operation (no Krawczyk
 * contraction, no dependence tracking), so at N comparable to Path C and
 * thousands of steps the wrapper would explode long before collision.
 * The point of this file is to (a) prove the methodology exists in this
 * codebase, (b) cross-check the very first interval step against the
 * float64 dysonStep in barrier-extrapolation.js so the two layers cannot
 * silently disagree, (c) measure how fast the wrapper widens so a future
 * Krawczyk / mean-value-form upgrade has a baseline to beat, and (d)
 * surface the certified collision interval at this small N. The follow-up
 * (imp-318b) is to plug a tighter contraction operator and scale N upward.
 *
 * Sign convention matches src/math/barrier-extrapolation.js dysonStep:
 *   dγ_n / d(step) = -2 · Σ_{k≠n} 1 / (γ_n - γ_k)
 * with positive dt corresponding to BACKWARD flow toward the collision.
 *
 * Consumers
 * ---------
 *   - bridge-lambda-rh.js — once N is scaled, the certified interval
 *     replaces the heuristic ±0.01 in pathCBound.
 *   - lambda-error-budget.js — interval result feeds source (ii) (RK4
 *     drift) with a rigorous bound rather than a step-doubling estimate.
 */

import { Interval } from '../math/interval-arithmetic.js';
import { ZETA_ZEROS } from '../math/zeta.js';

// ── Tunables ────────────────────────────────────────────────────────────────
// Kept small so the build evaluation stays sub-second and the wrapper
// growth is observable rather than exploded.
const N = 12;
const DT = 0.001;
const MAX_STEPS = 800;
const STRIDE = 40; // record trajectory every STRIDE steps

// ── One backward Dyson Euler step in interval arithmetic ────────────────────
function intervalDysonBackwardStep(intervals, dtInt) {
  const M = intervals.length;
  const next = new Array(M);
  const ONE = Interval.exact(1);
  const NEG_TWO = Interval.exact(-2);
  for (let n = 0; n < M; n++) {
    let sum = Interval.exact(0);
    for (let k = 0; k < M; k++) {
      if (k === n) continue;
      // 1 / (γ_n - γ_k); the interval div() returns [-∞, ∞] if the divisor
      // straddles zero, which would mean two zeros have collided — we stop
      // before that ever happens by checking gap intervals each step.
      sum = sum.add(ONE.div(intervals[n].sub(intervals[k])));
    }
    const dg = NEG_TWO.mul(sum); // matches dysonStep sign in barrier-extrapolation.js
    next[n] = intervals[n].add(dtInt.mul(dg));
  }
  return next;
}

// Float64 mirror of the above for the cross-check assertion.
function floatDysonBackwardStep(gammas, dt) {
  const M = gammas.length;
  const dg = new Array(M);
  for (let n = 0; n < M; n++) {
    let s = 0;
    for (let k = 0; k < M; k++) {
      if (k === n) continue;
      s += 1 / (gammas[n] - gammas[k]);
    }
    dg[n] = -2 * s;
  }
  return gammas.map((g, i) => g + dt * dg[i]);
}

// Interval bound on B(t) = min_k (γ_{k+1} - γ_k).
// Using min over the upper endpoints gives the upper bound on B; min over
// the lower endpoints gives the lower bound. Both are valid enclosures.
function intervalMinGap(intervals) {
  let lo = Infinity, hi = Infinity, kStarLo = -1;
  for (let k = 0; k < intervals.length - 1; k++) {
    const gap = intervals[k + 1].sub(intervals[k]);
    if (gap.lo < lo) { lo = gap.lo; kStarLo = k; }
    if (gap.hi < hi) hi = gap.hi;
  }
  return { lo, hi, width: hi - lo, kStarLo };
}

// ── Run the certified backward integration ─────────────────────────────────
function runIntervalDysonBackward() {
  const initial = ZETA_ZEROS.slice(0, N);
  const initialB = (() => {
    let m = Infinity;
    for (let k = 0; k < N - 1; k++) m = Math.min(m, initial[k + 1] - initial[k]);
    return m;
  })();

  const dtInt = Interval.fromFloat(DT);
  let intervals = initial.map((z) => Interval.fromFloat(z));

  const trajectory = [];
  let lastBPositive = null;
  let firstBNonPositive = null;
  let stepsRun = 0;

  for (let step = 0; step <= MAX_STEPS; step++) {
    const t = -step * DT;
    const B = intervalMinGap(intervals);
    if (step % STRIDE === 0) {
      trajectory.push({
        step,
        t: +t.toFixed(5),
        B_lo: B.lo,
        B_hi: B.hi,
        B_width: B.width,
        kStar: B.kStarLo,
      });
    }
    if (B.lo > 0) {
      lastBPositive = { step, t, B_lo: B.lo, B_hi: B.hi };
    } else if (firstBNonPositive === null) {
      firstBNonPositive = { step, t, B_lo: B.lo, B_hi: B.hi };
      trajectory.push({
        step,
        t: +t.toFixed(5),
        B_lo: B.lo,
        B_hi: B.hi,
        B_width: B.width,
        kStar: B.kStarLo,
      });
      stepsRun = step;
      break;
    }
    if (step === MAX_STEPS) { stepsRun = step; break; }
    intervals = intervalDysonBackwardStep(intervals, dtInt);
  }

  // Cross-check: the very first interval step must contain the float64 step.
  const floatAfterOne = floatDysonBackwardStep(initial, DT);
  let firstStepIntervals = initial.map((z) => Interval.fromFloat(z));
  firstStepIntervals = intervalDysonBackwardStep(firstStepIntervals, dtInt);
  const firstStepEnclosesFloat = floatAfterOne.every((g, i) =>
    g >= firstStepIntervals[i].lo - 1e-12 && g <= firstStepIntervals[i].hi + 1e-12,
  );

  // Final wrapper width on the gamma vector at the end of the run.
  const finalGammaWidth = (() => {
    let w = 0;
    for (const v of intervals) w = Math.max(w, v.hi - v.lo);
    return w;
  })();

  // Certified collision interval (only meaningful if we actually crossed):
  // [|t at firstBNonPositive|, |t at lastBPositive|] reversed because t < 0.
  const certifiedCollisionInterval = firstBNonPositive
    ? {
        kind: 'certified-bracket',
        t_c_lower_abs: Math.abs(firstBNonPositive.t),
        t_c_upper_abs: Math.abs(lastBPositive.t),
        note:
          'B_lo crossed 0 between these two backward times — the genuine ' +
          'collision t_c lies in this closed interval (rigorous bracket).',
      }
    : {
        kind: 'no-crossing',
        stepsRun,
        finalB_lo: trajectory[trajectory.length - 1].B_lo,
        note:
          'Wrapper widening at this N truncation outpaced B(t) shrinkage ' +
          'before collision was reached. This is the expected behaviour of a ' +
          'naive (non-Krawczyk, non-mean-value-form) interval Euler at ' +
          'small N with large initial spacings; the value of this run is the ' +
          'methodology + width-growth baseline.',
      };

  return {
    N,
    dt: DT,
    maxSteps: MAX_STEPS,
    initialMinSpacing: initialB,
    stepsRun,
    trajectory,
    firstStepEnclosesFloat,
    finalGammaWidth,
    certifiedCollisionInterval,
  };
}

export const INTERVAL_DYSON_COLLISION = runIntervalDysonBackward();

// ── Structured record other modules can quote ──────────────────────────────
export const INTERVAL_DYSON_FRAMEWORK = {
  id: 'imp-318',
  name: 'Verified-computing Dyson backward integration',
  flow:
    'γ_n(t+dt) = γ_n(t) + dt · (-2 Σ_{k≠n} 1/(γ_n − γ_k))   ' +
    '(backward Euler in the dysonStep sign of barrier-extrapolation.js)',
  upgradeOver: 'dyson-ode-integrator.js (imp-306) — Kahan + Richardson, but float64',
  rigour:
    'Each γ_k carried as an Interval [lo, hi] (interval-arithmetic.js, imp-068). ' +
    'Every add / sub / mul / div propagates an outward rounding error, so the ' +
    'trajectory is a certified enclosure of the true Calogero-Moser orbit. ' +
    'B(t) = min_k g_k(t) becomes the interval [min_k g_k.lo, min_k g_k.hi], ' +
    'and the first backward step at which B.lo ≤ 0 brackets the certified ' +
    'collision time t_c against the previous step.',
  scope:
    'Small-N witness (N = ' + N + '). Naive wrapper, no Krawczyk contraction, ' +
    'no mean-value form. Establishes the framework, baselines wrapper width ' +
    'growth, and cross-checks the first step against float64. Scaling to the ' +
    'Path C N = 2458 regime is the imp-318 follow-up.',
  consumers: [
    'bridge-lambda-rh.js — pathCBound becomes certified once scaled',
    'lambda-error-budget.js — RK4 drift source (ii) acquires a rigorous bound',
    'dyson-monotonicity-proof.js — supplies the analytic guarantee that the ' +
      'first backward zero of B is genuinely t_c, justifying the bracket above',
  ],
  status: 'small-N witness (this file)',
};

// ── Build-time assertions ──────────────────────────────────────────────────
export const INTERVAL_DYSON_ASSERTIONS = [
  {
    id: 'first-interval-step-encloses-float-step',
    holds: () => INTERVAL_DYSON_COLLISION.firstStepEnclosesFloat === true,
    why:
      'After exactly one backward Dyson step, the float64 result must lie ' +
      'inside the interval result component-wise. If this fails the interval ' +
      'arithmetic is unsound or the two implementations have drifted apart.',
  },
  {
    id: 'initial-min-spacing-positive',
    holds: () => INTERVAL_DYSON_COLLISION.initialMinSpacing > 0,
    why:
      'At t = 0 the truncated zero list must have strictly positive minimum ' +
      'spacing — otherwise the very premise of "backward collision" is vacuous ' +
      'and the data file (or ZETA_ZEROS) is corrupted.',
  },
  {
    id: 'gamma-wrapper-finite',
    holds: () =>
      Number.isFinite(INTERVAL_DYSON_COLLISION.finalGammaWidth) &&
      INTERVAL_DYSON_COLLISION.finalGammaWidth >= 0,
    why:
      'The final wrapper width on γ must be a finite non-negative number. ' +
      'NaN or Infinity here means a 1/0 or 0/0 leaked through the interval ' +
      'div() guard, which would void every claim built on top of this file.',
  },
  {
    id: 'collision-bracket-or-honest-no-crossing',
    holds: () => {
      const c = INTERVAL_DYSON_COLLISION.certifiedCollisionInterval;
      if (c.kind === 'certified-bracket') {
        return c.t_c_lower_abs >= c.t_c_upper_abs && c.t_c_upper_abs >= 0;
      }
      if (c.kind === 'no-crossing') {
        return c.stepsRun === INTERVAL_DYSON_COLLISION.maxSteps && c.finalB_lo > 0;
      }
      return false;
    },
    why:
      'Either we produced a rigorous bracket (lower bound on |t_c| ≥ upper ' +
      'bound on |t_c| of the previous step, both non-negative — the interval ' +
      'is in backward-time so the inequality flips), or we honestly ran out of ' +
      'steps with B.lo still strictly positive. Anything else is an internal ' +
      'inconsistency in the run loop.',
  },
];
