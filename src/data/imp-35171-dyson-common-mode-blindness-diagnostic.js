/**
 * @module imp-35171-dyson-common-mode-blindness-diagnostic
 *
 * imp-35171 (numerical, frontier-diagnostic, MEASUREMENT ONLY): PORTS the imp-35127 S1
 * common-mode-blindness illustration from the scalar biased proxy f(y) = -y + eps to an ACTUAL
 * small-N desingularized Dyson backward flow (the 1/(x_k - x_j) pole form of imp-362). imp-35127 S1
 * showed -- only on a scalar field, explicitly "not the Dyson field" -- that classic RK4 and
 * Dormand-Prince DP5 = RK5(4) can AGREE to ~1e-10 while both carry a common-mode absolute bias
 * ~6e6x larger, a systematic error the empirical two-method gap |t_c_RK4 - t_c_DP5| (imp-2466) is
 * structurally blind to (imp-35127 I4). THIS module reproduces the phenomenon on the real
 * few-particle Dyson field at a controlled minimum gap g_min, and quantifies the shared-error-to-gap
 * ratio. It is a DIAGNOSTIC on the real field, NOT a certified bound: it discharges none of the
 * imp-35127 I1..I5 ingredients and supplies no I4 certificate. MEASUREMENT ONLY; NO QED.
 *
 * THE BACKWARD DYSON FLOW (imp-362 / imp-2520 pole form)
 * -----------------------------------------------------
 * N particles x_1 < ... < x_N flow backward toward the collision front under
 *     dx_k/ds  =  -2 sum_{j != k} 1 / (x_k - x_j),        s = -t >= 0
 * (de Bruijn-Newman units; backward-flow-stability-gronwall.js line 15). The field is SINGULAR: it
 * and every derivative blow up as inverse powers of the minimum pair gap g_min as a pair approaches,
 * which is exactly why a certified integrator bound is hard (imp-35127 I1/I2). We integrate a small
 * N = 4 configuration with a tight central pair backward toward its collision, stopping at a
 * CONTROLLED g_min before the front, with BOTH the classic RK4 and the DP5 = RK5(4) tableaux.
 *
 * THE SHARED SYSTEMATIC BIAS AND WHY THE TWO-METHOD GAP IS BLIND TO IT
 * -------------------------------------------------------------------
 * As in imp-35127 S1 we inject a deliberate common-mode bias: both schemes integrate the SAME
 * perturbed field f_k^bias = -2 sum 1/(x_k - x_j) + eps (a shared additive velocity bias, eps = 1e-3).
 * The Dyson field depends only on the DIFFERENCES x_k - x_j, so it is translation invariant; a uniform
 * additive velocity bias therefore integrates to an EXACT rigid center-of-mass translation
 * x_bias(s) = x_true(s) + eps s (1, ..., 1). Consequences, both measured below:
 *   - the two schemes' relative (gap) motion is IDENTICAL to the unbiased motion (gap-space blindness:
 *     min-gap difference at machine zero), so the empirical two-method gap |x_RK4 - x_DP5| sees only
 *     their mutual truncation DISAGREEMENT, not the eps s common-mode drift at all;
 *   - yet BOTH schemes carry the full absolute common-mode error ||eps s (1,...,1)|| = sqrt(N) eps s,
 *     which is the analytic analogue of imp-35127 S1's eps (1 - e^{-1}) bias.
 * So the two-method gap can be tiny while the absolute error is orders larger -- exactly the I4
 * common-mode blindness, now exhibited on the genuine singular Dyson field rather than a scalar proxy.
 *
 * WHAT THE g_min SWEEP ADDS BEYOND THE SCALAR S1
 * ---------------------------------------------
 * Sweeping the stop time so g_min ranges from ~0.135 down toward the front (~0.055) shows the
 * blindness ratio is WORST far from the front: there the two schemes agree to ~1e-12 (ratio ~6e6),
 * so the gap is almost totally blind. As the singular front is approached the schemes' mutual
 * truncation disagreement GROWS (the two-method gap climbs to ~3e-9) while the common-mode error
 * stays ~sqrt(N) eps s, so the ratio DROPS -- but even at g_min ~ 0.055 the gap still understates the
 * common-mode error by ~4e3x. The two-method gap is least informative about absolute accuracy exactly
 * in the smooth interior where one would most trust it.
 *
 * MEASUREMENT ONLY. Reproduces the imp-35127 S1/I4 common-mode blindness on the real small-N Dyson
 * field. It does NOT supply the imp-35127 I4 absolute per-scheme certificate, does NOT discharge any
 * of I1..I5, and does NOT touch the imp-2466 two-method cross-check (which remains a valid
 * NON-certifying cross-check). Changes no bound; establishes no operator positivity; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED; no refereed bound is changed.
 *
 * @see imp-35127-g-step-error-certified-bound-scope (scalar S1 illustration + I1..I5 enumeration; I4)
 * @see imp-2466 (empirical two-method gap "dg_{tc}/dt" style cross-check; NOT a certificate)
 * @see backward-flow-stability-gronwall (dx_k/ds = -2 sum 1/(x_k - x_j) pole form, G-gronwall)
 * @see imp-362 (interval RK4 witness, 1/(x_k - x_j) pole reduction; G-interval-enclosure)
 * @see imp-486 (C_mb GUE-conditional)
 */

// ---------------------------------------------------------------------------
// Self-contained VECTOR integrators. Classic RK4 and the Dormand-Prince
// DP5 = RK5(4) 5th-order step (standard tableau), acting on an autonomous
// vector field f(x). These reproduce the two tableaux whose empirical gap
// imp-2466 reports, now on the N-particle Dyson state.
// ---------------------------------------------------------------------------
const axpy = (x, k, s) => x.map((v, i) => v + s * k[i]);

function rk4Step(f, x, dt) {
  const k1 = f(x);
  const k2 = f(axpy(x, k1, dt / 2));
  const k3 = f(axpy(x, k2, dt / 2));
  const k4 = f(axpy(x, k3, dt));
  return x.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}

// Dormand-Prince (RK5(4)) 5th-order solution step; the k7 stage vanishes in the
// 5th-order b-row and is omitted (as in imp-35127).
function dp5Step(f, x, dt) {
  const k1 = f(x);
  const k2 = f(axpy(x, k1, dt * (1 / 5)));
  const k3 = f(x.map((v, i) => v + dt * ((3 / 40) * k1[i] + (9 / 40) * k2[i])));
  const k4 = f(
    x.map((v, i) => v + dt * ((44 / 45) * k1[i] - (56 / 15) * k2[i] + (32 / 9) * k3[i])),
  );
  const k5 = f(
    x.map(
      (v, i) =>
        v +
        dt *
          ((19372 / 6561) * k1[i] -
            (25360 / 2187) * k2[i] +
            (64448 / 6561) * k3[i] -
            (212 / 729) * k4[i]),
    ),
  );
  const k6 = f(
    x.map(
      (v, i) =>
        v +
        dt *
          ((9017 / 3168) * k1[i] -
            (355 / 33) * k2[i] +
            (46732 / 5247) * k3[i] +
            (49 / 176) * k4[i] -
            (5103 / 18656) * k5[i]),
    ),
  );
  return x.map(
    (v, i) =>
      v +
      dt *
        ((35 / 384) * k1[i] +
          (500 / 1113) * k3[i] +
          (125 / 192) * k4[i] -
          (2187 / 6784) * k5[i] +
          (11 / 84) * k6[i]),
  );
}

function integrate(step, f, x0, S, n) {
  const dt = S / n;
  let x = x0.slice();
  for (let i = 0; i < n; i++) x = step(f, x, dt);
  return x;
}

// ---------------------------------------------------------------------------
// The desingularized Dyson backward field f_k = -2 sum_{j != k} 1/(x_k - x_j),
// with a shared additive velocity bias eps (common to BOTH schemes).
// ---------------------------------------------------------------------------
function dysonField(x, eps) {
  const N = x.length;
  const f = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let j = 0; j < N; j++) if (j !== k) s += 1 / (x[k] - x[j]);
    f[k] = -2 * s + eps;
  }
  return f;
}

function minGap(x) {
  const s = [...x].sort((a, b) => a - b);
  let m = Infinity;
  for (let i = 1; i < s.length; i++) m = Math.min(m, s[i] - s[i - 1]);
  return m;
}

const l2 = (a, b) => Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) * (v - b[i]), 0));
const linfShift = (a, b, c) => Math.max(...a.map((v, i) => Math.abs(v - b[i] - c)));

// ---------------------------------------------------------------------------
// Small-N Dyson configuration: N = 4 with a tight central pair (initial gap
// 0.24) flowing backward toward its central collision; the outer pair is wide.
// eps = 1e-3 is the shared additive velocity bias (the Dyson analogue of the
// imp-35127 S1 scalar eps). n = 128 coarse steps for the two candidate schemes;
// N_REF = 8000 fine RK4 steps on the UNBIASED field as the true reference
// (self-convergence ~ 7e-15, verified in the assertions).
// ---------------------------------------------------------------------------
const X0 = [-1.6, -0.12, 0.12, 1.6];
const NPART = X0.length;
const EPS = 1e-3;
const N_STEP = 128;
const N_REF = 8000;

const fTrue = (x) => dysonField(x, 0);
const fBias = (x) => dysonField(x, EPS);

// The backward stop times; S grows -> g_min shrinks toward the collision front.
const S_RUNGS = [5.0e-3, 6.0e-3, 6.5e-3, 6.9e-3];

function measureRung(S) {
  const ref = integrate(rk4Step, fTrue, X0, S, N_REF); // unbiased true reference
  const rk4Bias = integrate(rk4Step, fBias, X0, S, N_STEP);
  const dp5Bias = integrate(dp5Step, fBias, X0, S, N_STEP);
  const rk4TrueCoarse = integrate(rk4Step, fTrue, X0, S, N_STEP);
  const twoMethodGap = l2(rk4Bias, dp5Bias); // scheme DISAGREEMENT
  const commonModeErr = l2(rk4Bias, ref); // ABSOLUTE common-mode error (both carry)
  const commonModePredicted = Math.sqrt(NPART) * EPS * S; // rigid drift ||eps s (1,...,1)||
  const trueFieldSchemeErr = l2(rk4TrueCoarse, ref); // coarse scheme error on UNbiased field
  // Rigid-translation invariance: x_bias - x_true should be the uniform shift eps s.
  const rigidShiftResidual = linfShift(rk4Bias, rk4TrueCoarse, EPS * S);
  // Gap-space blindness: the common-mode drift leaves the minimum gap unchanged.
  const gapDrift = Math.abs(minGap(rk4Bias) - minGap(rk4TrueCoarse));
  return {
    S,
    gMin: minGap(ref),
    twoMethodGap,
    commonModeErr,
    commonModePredicted,
    blindnessRatio: commonModeErr / twoMethodGap,
    trueFieldSchemeErr,
    rigidShiftResidual,
    gapDrift,
  };
}

const SWEEP = S_RUNGS.map(measureRung);
// Headline rung: the controlled g_min ~ 0.079 interior stop (S = 6.5e-3).
const HEAD = SWEEP[2];
const WIDEST = SWEEP[0]; // g_min ~ 0.135, blindness worst
const TIGHTEST = SWEEP[SWEEP.length - 1]; // g_min ~ 0.055, nearest the front

const round = (x, d = 4) => +x.toExponential(d);

export const IMP35171_DYSON_COMMON_MODE_BLINDNESS_DIAGNOSTIC = {
  id: 'imp-35171',
  title:
    'Common-mode blindness ported from the imp-35127 S1 scalar proxy to a small-N desingularized ' +
    'Dyson backward flow: RK4 and DP5 = RK5(4) share a common-mode absolute bias their mutual gap ' +
    '|t_c_RK4 - t_c_DP5| (imp-2466) is blind to.',
  grade: 'numerical (diagnostic on the real field, NOT a certified bound)',
  field:
    'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j) + eps, N = 4, x0 = [-1.6, -0.12, 0.12, 1.6], ' +
    'eps = 1e-3 (shared additive velocity bias seen by BOTH schemes), n = 128 coarse steps.',
  translationInvarianceFact:
    'The Dyson field depends only on x_k - x_j, so a uniform additive bias eps integrates to an EXACT ' +
    'rigid center-of-mass translation x_bias(s) = x_true(s) + eps s (1,...,1): all relative (gap) ' +
    'motion is unchanged, so the two-method gap sees only mutual truncation disagreement, while both ' +
    'schemes carry the full absolute common-mode error sqrt(N) eps s.',
  headline: {
    stopTime: round(HEAD.S),
    gMin: round(HEAD.gMin),
    twoMethodGap: round(HEAD.twoMethodGap), // schemes AGREE, ~2e-10
    commonModeAbsErr: round(HEAD.commonModeErr), // both carry, ~1.3e-5
    commonModePredicted: round(HEAD.commonModePredicted), // sqrt(N) eps s
    blindnessRatio: round(HEAD.blindnessRatio), // commonMode / gap, ~6e4
    rigidShiftResidual: round(HEAD.rigidShiftResidual), // ~machine zero: exact rigid drift
    gapDrift: round(HEAD.gapDrift), // ~machine zero: gap totally blind
    trueFieldSchemeErr: round(HEAD.trueFieldSchemeErr), // coarse scheme accurate on UNbiased field
  },
  gMinSweep: SWEEP.map((r) => ({
    stopTime: round(r.S),
    gMin: round(r.gMin, 5),
    twoMethodGap: round(r.twoMethodGap),
    commonModeAbsErr: round(r.commonModeErr),
    blindnessRatio: round(r.blindnessRatio),
  })),
  sweepFinding:
    'Blindness is WORST in the smooth interior: at g_min ~ ' +
    round(WIDEST.gMin, 4) +
    ' the schemes agree to ~' +
    round(WIDEST.twoMethodGap) +
    ' (ratio ~' +
    round(WIDEST.blindnessRatio) +
    '); approaching the front to g_min ~ ' +
    round(TIGHTEST.gMin, 4) +
    ' the two-method gap GROWS to ~' +
    round(TIGHTEST.twoMethodGap) +
    ' while the common-mode error stays ~sqrt(N) eps s, so the ratio DROPS to ~' +
    round(TIGHTEST.blindnessRatio) +
    ' -- but the gap still understates the absolute error by orders even there.',
  verdict:
    'MEASUREMENT ONLY (frontier-diagnostic, NOT rigorous). The imp-35127 S1 / I4 common-mode ' +
    'blindness reproduces on the genuine small-N desingularized Dyson field, not just a scalar proxy: ' +
    'RK4 and DP5 = RK5(4) agree to ~' +
    round(HEAD.twoMethodGap) +
    ' while both carry a common-mode absolute error ~' +
    round(HEAD.commonModeErr) +
    ' (~' +
    round(HEAD.blindnessRatio) +
    'x the two-method gap), and translation invariance makes that bias an EXACT rigid drift the ' +
    'gap diagnostic cannot see at all. This supplies NO imp-35127 I4 certificate and discharges NONE ' +
    'of I1..I5; the imp-2466 two-method gap is UNTOUCHED and remains a valid NON-certifying ' +
    'cross-check. Changes no bound; establishes no operator positivity; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35127-g-step-error-certified-bound-scope (scalar S1 + I1..I5, I4 common-mode); imp-2466 ' +
    '(empirical two-method gap, cross-check not certificate); backward-flow-stability-gronwall / ' +
    'imp-362 (dx_k/ds = -2 sum 1/(x_k - x_j) pole form); imp-486 (C_mb GUE-conditional).',
  isRigorous: false,
};

export const IMP35171_DYSON_COMMON_MODE_BLINDNESS_DIAGNOSTIC_ASSERTIONS = [
  {
    // The fine unbiased reference is converged (self-convergence far below the measured quantities).
    id: 'imp35171-reference-converged',
    description: 'fine RK4 reference is converged: doubling N_REF moves it < 1e-10',
    holds: () => {
      const a = integrate(rk4Step, fTrue, X0, HEAD.S, N_REF);
      const b = integrate(rk4Step, fTrue, X0, HEAD.S, 2 * N_REF);
      return l2(a, b) < 1e-10;
    },
  },
  {
    // The two schemes AGREE on the biased Dyson field (two-method gap is scheme disagreement).
    id: 'imp35171-two-method-gap-tiny',
    description: 'RK4 and DP5 agree on the biased Dyson field to < 1e-6 (gap is scheme disagreement)',
    holds: () => HEAD.twoMethodGap < 1e-6,
  },
  {
    // Yet both carry the SAME absolute common-mode error, orders larger -> blindness on the real field.
    id: 'imp35171-common-mode-blindness',
    description: 'common-mode absolute error exceeds the two-method gap by > 1000x (gap blind to E_sys)',
    holds: () => HEAD.blindnessRatio > 1e3 && HEAD.commonModeErr > 1e-6,
  },
  {
    // The common-mode error matches the analytic rigid drift sqrt(N) eps s (both schemes carry it).
    id: 'imp35171-common-mode-matches-rigid-drift',
    description: 'common-mode absolute error matches the analytic rigid drift sqrt(N) eps s to < 1e-4',
    holds: () => Math.abs(HEAD.commonModeErr / HEAD.commonModePredicted - 1) < 1e-4,
  },
  {
    // Translation invariance: x_bias - x_true is EXACTLY the uniform shift eps s (machine precision).
    id: 'imp35171-rigid-translation-exact',
    description: 'biased minus true trajectory is the exact uniform shift eps s (residual < 1e-12)',
    holds: () => HEAD.rigidShiftResidual < 1e-12,
  },
  {
    // Gap-space blindness: the common-mode drift leaves the minimum gap unchanged (machine zero).
    id: 'imp35171-gap-space-blind',
    description: 'the common-mode drift leaves min-gap unchanged (translation-invariant diagnostic blind)',
    holds: () => HEAD.gapDrift < 1e-12,
  },
  {
    // Sweep: blindness is worst far from the front; ratio drops toward the front but stays > 10.
    id: 'imp35171-sweep-ratio-drops-toward-front',
    description: 'blindness ratio is largest at the widest g_min and drops (but stays > 10) toward the front',
    holds: () =>
      WIDEST.blindnessRatio > TIGHTEST.blindnessRatio &&
      WIDEST.blindnessRatio > 1e5 &&
      TIGHTEST.blindnessRatio > 10 &&
      TIGHTEST.twoMethodGap > WIDEST.twoMethodGap,
  },
  {
    // Honesty gate: measurement only, no QED, imp-2466 untouched, no refereed bound is changed.
    id: 'imp35171-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, NO QED, imp-2466 cross-check untouched, no refereed bound is changed',
    holds: () =>
      IMP35171_DYSON_COMMON_MODE_BLINDNESS_DIAGNOSTIC.isRigorous === false &&
      /NO QED/.test(IMP35171_DYSON_COMMON_MODE_BLINDNESS_DIAGNOSTIC.verdict) &&
      /imp-2466 two-method gap is UNTOUCHED/.test(
        IMP35171_DYSON_COMMON_MODE_BLINDNESS_DIAGNOSTIC.verdict,
      ) &&
      /refereed bound is changed/i.test(IMP35171_DYSON_COMMON_MODE_BLINDNESS_DIAGNOSTIC.verdict),
  },
];

for (const a of IMP35171_DYSON_COMMON_MODE_BLINDNESS_DIAGNOSTIC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35171-dyson-common-mode-blindness-diagnostic assertion failed: ${a.id}`);
  }
}
