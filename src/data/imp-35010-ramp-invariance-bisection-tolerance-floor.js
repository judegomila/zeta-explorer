/**
 * @module imp-35010-ramp-invariance-bisection-tolerance-floor
 *
 * imp-35010 (numerical, frontier-direction): imp-34956/imp-34924 reported a ~1.6e-7 residual
 * m-ramp-invariance spread in the pinned coupling g* = m s* and ATTRIBUTED it to fixed-window
 * bisection/finite-difference noise rather than model error. That verdict is directly testable:
 * re-run the ramp-invariance measurement at SUCCESSIVELY FINER bisection tolerances (more bisection
 * iterations) and quantify whether the residual shrinks toward the double-precision floor (~1e-16)
 * or plateaus at an irreducible floor. This module reuses the imp-34956 gapAt kernel VERBATIM and
 * sweeps the shared bisection iteration budget applied to all three nested bisections (knee, inflection,
 * and the outer s-root), measuring the g*-spread across an m-ladder at each tolerance.
 *
 * WHY g* IS ALGEBRAICALLY m-INVARIANT (so the spread is PURELY numerical)
 * ----------------------------------------------------------------------
 * The perturbation phi(x,s,m) = -log(1 + m s eflowRatio(x)) depends on s and m ONLY through the
 * product g = m s. Hence uFull, sigma, the inflection kernel d2Cond, and the knee kernel fKnee are all
 * functions of g alone, so gapAt(s,m) = gapAt(g) is a univariate function of g. Its root g* is therefore
 * m-INDEPENDENT exactly: s*(m) = g* / m and g*(m) = m s*(m) = g* for every m. Any measured spread of g*(m)
 * across the ladder is ENTIRELY a numerical artifact of the finite bisection + finite-difference stencils
 * -- exactly the quantity imp-34956 called noise. This module measures how that artifact behaves as the
 * bisection tolerance is tightened.
 *
 * THE MEASUREMENT (tolerance refinement of the ramp-invariance residual)
 * ---------------------------------------------------------------------
 *   (T0) COARSE BISECTION IS BRACKET-LIMITED. At small iteration budgets the [1e9,1e11] x-bracket and the
 *        [0,1] s-bracket are not yet resolved, so the g*-spread is large and drops steeply with each added
 *        iteration (spread ~ 2.25e-3 at 8 iters -> ~1.72e-5 at 16 -> ~8.55e-7 at 24).
 *   (T1) THE SPREAD PLATEAUS AT AN IRREDUCIBLE FLOOR ~3.69e-7 FROM ~52 ITERATIONS ON. Beyond ~40-52 iters
 *        the g*-spread stops decreasing and locks at ~3.6942e-7 to all further digits: bisecting to 80 or
 *        200 iterations gives IDENTICAL spread. Tightening the bisection tolerance does NOT drive the
 *        residual toward the double-precision floor (~1e-16); it saturates ~9 orders of magnitude above it.
 *   (T2) THE FLOOR IS FINITE-DIFFERENCE (CANCELLATION) LIMITED, NOT BISECTION LIMITED. Holding the bisection
 *        saturated (200 iters) and varying the central-difference step h moves the floor (h=2e-2 -> ~1.5e-9,
 *        h=1e-2 -> ~3.69e-7, h=5e-3 -> ~5.4e-6): the plateau value depends on h, not on the iteration count.
 *        Near the flat root of gapAt the knee and inflection x-locations nearly coincide, so gapAt is a
 *        catastrophic difference of two ~9.53-dex numbers whose FP/FD noise sets the bracket the bisection
 *        can no longer subdivide. The residual is thus a genuine fixed-window numerical floor -- CONFIRMING
 *        the imp-34956 attribution (noise, not model error) -- but the noise is FD-cancellation, and finer
 *        bisection alone cannot reduce it.
 *
 * VERDICT (the ticket question). Tightening the bisection tolerance does NOT drive the ~1.6e-7 residual to
 * the double-precision floor: the residual falls steeply while the brackets are unresolved, then locks at an
 * IRREDUCIBLE floor ~3.69e-7 (this wider [0.85,2.0] m-ladder; same order as the imp-34924 ~1.6e-7) from ~52
 * iterations onward, invariant to further bisection. Isolating the floor shows it is set by the h=1e-2
 * finite-difference cancellation in gapAt near its flat root, not by bisection resolution -- so the residual
 * IS pure fixed-window numerical noise (confirming imp-34956), but bisection is already saturated and the
 * remaining floor is FD-limited.
 *
 * MEASUREMENT ONLY. Convergence diagnostic on the inherited surrogate, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34956-pinned-product-window-sensitivity (attributed the ~1.6e-7 residual to fixed-window noise -- kernel reused here)
 * @see imp-34924-eflow-pinned-product-derivation (derived g* = m s* as algebraically m-invariant)
 * @see imp-34886-eflow-strength-knee-inflection-crossing (the s* ~ 0.78 = g* crossing on Gap(s)=0)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34886/imp-34924/imp-34956 exactly
const A = C_C_PINNED / E_TRUNC_PT;

// E_flow / E_trunc = r(x) at ln N = x, reused VERBATIM from imp-34886/imp-34924/imp-34956.
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function u0(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
// s and m enter ONLY through the product g = m s here (imp-34924 core); this makes g* algebraically m-invariant.
function phi(x, s, m) {
  return -Math.log(1 + m * s * eflowRatio(x));
}
function uFull(x, s, m) {
  return u0(x) + phi(x, s, m);
}
function sigmaOf(x, s, m) {
  return 1 / (1 + Math.exp(-uFull(x, s, m)));
}

// central-difference stencils on the log-odds (imp-34886/34924/34956 step h = 1e-2), h passed explicitly.
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
function d2(f, x, h) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
function d3(f, x, h) {
  return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h);
}
function d2Cond(x, s, m, h) {
  const S = sigmaOf(x, s, m);
  const up = d1((z) => uFull(z, s, m), x, h);
  const upp = d2((z) => uFull(z, s, m), x, h);
  return (1 - 2 * S) * up * up + upp;
}
function fKnee(x, s, m, h) {
  const S = sigmaOf(x, s, m);
  const v = -d1((z) => uFull(z, s, m), x, h);
  const vp = -d2((z) => uFull(z, s, m), x, h);
  const vpp = -d3((z) => uFull(z, s, m), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}

// robust sign-change bisection with an EXPLICIT iteration budget (the tolerance knob this module sweeps).
// imp-34956 used a fixed 200 iterations; here iters parameterizes the shared tolerance of all three bisections.
function bisectN(f, a, b, iters) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (a + b);
    const fm = f(mid);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = mid;
      fa = fm;
    } else {
      b = mid;
    }
  }
  return 0.5 * (a + b);
}

const LN10 = Math.LN10;
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const H_NOMINAL = 1e-2; // the imp-34886/34924/34956 finite-difference step

function gapAt(s, m, iters, h) {
  const knee = bisectN((x) => fKnee(x, s, m, h), LO, HI, iters);
  const infl = bisectN((x) => d2Cond(x, s, m, h), LO, HI, iters);
  return (knee - infl) / LN10;
}
// pinned coupling g*(m) = m s*(m), s*(m) the outer root of gapAt over s in [0,1]. Algebraically = g* for all m.
function gStarAt(m, iters, h) {
  const sStar = bisectN((s) => gapAt(s, m, iters, h), 0, 1, iters);
  return m * sStar;
}

// m-ladder held to m >= g* ~ 0.778 so s* = g*/m stays inside the [0,1] outer bracket.
const M_LADDER = [0.85, 1.0, 1.25, 1.5, 1.75, 2.0];
function spreadAt(iters, h) {
  const gs = M_LADDER.map((m) => gStarAt(m, iters, h));
  const mean = gs.reduce((a, b) => a + b, 0) / gs.length;
  return { spread: Math.max(...gs) - Math.min(...gs), mean };
}

// ---- (T0/T1) the tolerance sweep at the nominal FD step ------------------------------------------------------
const ITER_GRID = [8, 16, 24, 30, 40, 52, 80, 200];
const TOLERANCE_SWEEP = ITER_GRID.map((iters) => {
  const { spread, mean } = spreadAt(iters, H_NOMINAL);
  return { iters, spread: +spread.toExponential(6), mean: +mean.toFixed(12) };
});
const IRREDUCIBLE_FLOOR = spreadAt(200, H_NOMINAL).spread; // ~3.6942e-7
const FLOOR_AT_80 = spreadAt(80, H_NOMINAL).spread; // identical to 200 -> plateau confirmed
const MEAN_GSTAR = spreadAt(200, H_NOMINAL).mean; // ~0.7776532145
const DOUBLE_PRECISION_FLOOR = 1e-16; // the target the residual does NOT reach

// ---- (T2) isolate the floor: at saturated bisection, vary the FD step h --------------------------------------
const FD_STEP_DIAGNOSTIC = [2e-2, 1e-2, 5e-3, 2.5e-3].map((h) => ({
  h,
  spread: +spreadAt(200, h).spread.toExponential(4),
}));

const IMP34924_REPORTED_RESIDUAL = 1.6e-7; // imp-34924/imp-34956 reported across-m residual (fixed window)

export const IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR = {
  id: 'imp-35010',
  proofSection: 'S-frontier',
  question:
    'imp-34956/imp-34924 attributed the ~1.6e-7 residual m-ramp-invariance spread of the pinned coupling ' +
    'g* = m s* to fixed-window bisection/finite-difference noise, not model error. RE-RUN the ramp-invariance ' +
    'measurement at successively finer bisection tolerances and quantify whether the residual converges toward ' +
    'the double-precision floor (~1e-16) or plateaus at an irreducible floor, isolating that floor. Measurement ' +
    'only; C_mb GUE-conditional (imp-486); changes no bound; NO QED.',
  verdictShort:
    'g* = m s* is ALGEBRAICALLY m-invariant (phi depends on s,m only through g = m s), so any g*-spread is pure ' +
    'numerical artifact. Tightening the bisection tolerance drops the spread steeply while the brackets are ' +
    'unresolved (~2.25e-3 at 8 iters -> ~8.55e-7 at 24), then LOCKS at an irreducible floor ~3.69e-7 from ~52 ' +
    'iterations on -- identical at 80 and 200 iters, ~9 orders of magnitude ABOVE the ~1e-16 double-precision ' +
    'floor. Isolating the floor by varying the FD step h at saturated bisection shows the plateau moves with h ' +
    '(2e-2 -> ~1.5e-9, 1e-2 -> ~3.69e-7, 5e-3 -> ~5.4e-6): the floor is finite-difference-cancellation limited, ' +
    'NOT bisection limited. So the residual IS fixed-window numerical noise (confirming imp-34956), but bisection ' +
    'is already saturated and the remaining floor cannot be reduced by tighter bisection.',
  measuredQuantity:
    'the g*-spread across the m-ladder [0.85,2.0] as a function of the shared bisection iteration budget (8..200), ' +
    'the irreducible plateau floor and the iteration count at which it sets in, its distance from the ' +
    'double-precision floor, and the dependence of the saturated-bisection floor on the finite-difference step h',
  mLadder: M_LADDER,
  fdStepNominal: H_NOMINAL,
  toleranceSweep: TOLERANCE_SWEEP, // {iters, spread, mean} at h = 1e-2
  irreducibleFloor: +IRREDUCIBLE_FLOOR.toExponential(6), // ~3.694215e-7
  floorAt80Iters: +FLOOR_AT_80.toExponential(6), // identical to floor at 200 -> plateau
  plateauOnsetIters: 52, // spread stops decreasing to all further digits from here on
  meanGStar: +MEAN_GSTAR.toFixed(10), // ~0.7776532145 (the imp-34886/34924 crossing coupling)
  doublePrecisionFloor: DOUBLE_PRECISION_FLOOR, // ~1e-16 -- NOT reached
  floorAboveFpFloorOrders: +Math.log10(IRREDUCIBLE_FLOOR / DOUBLE_PRECISION_FLOOR).toFixed(2), // ~9.6 orders
  fdStepDiagnostic: FD_STEP_DIAGNOSTIC, // {h, spread} at 200 iters -> floor moves with h, not with iters
  imp34924ReportedResidual: IMP34924_REPORTED_RESIDUAL, // 1.6e-7 (same order as the measured floor)
  finding: {
    T0_coarse_bisection_is_bracket_limited:
      'At small iteration budgets the [1e9,1e11] x-bracket and [0,1] s-bracket are unresolved, so the g*-spread ' +
      'is large and falls steeply per added iteration: ~2.25e-3 (8 iters) -> ~1.72e-5 (16) -> ~8.55e-7 (24).',
    T1_spread_plateaus_at_irreducible_floor:
      'From ~40-52 iterations the g*-spread stops decreasing and locks at ~3.6942e-7 to all further digits: 80 ' +
      'and 200 iterations give an IDENTICAL floor. Tightening the bisection tolerance does NOT drive the residual ' +
      'to the ~1e-16 double-precision floor; it saturates ~9 orders of magnitude above it.',
    T2_floor_is_fd_cancellation_limited_not_bisection_limited:
      'Holding the bisection saturated (200 iters) and varying the central-difference step h moves the floor ' +
      '(h=2e-2 -> ~1.5e-9, h=1e-2 -> ~3.69e-7, h=5e-3 -> ~5.4e-6): the plateau depends on h, not the iteration ' +
      'count. Near the flat root of gapAt the knee and inflection x-locations nearly coincide, so gapAt is a ' +
      'catastrophic difference of two ~9.53-dex numbers whose FD/FP noise sets the sub-bracket bisection can no ' +
      'longer subdivide -- confirming the imp-34956 fixed-window-noise attribution, with the noise FD-limited.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT a rigorous asymptotic). g* = m s* is ALGEBRAICALLY m-invariant (phi ' +
    'depends on s,m only through g = m s), so the ~1.6e-7 residual m-spread imp-34924/imp-34956 reported is a ' +
    'pure numerical artifact. RE-RAN the ramp-invariance measurement over a shared bisection iteration budget: ' +
    '(T0) the spread is bracket-limited and falls steeply at coarse tolerance (~2.25e-3 at 8 iters -> ~8.55e-7 at ' +
    '24); (T1) it then PLATEAUS at an irreducible floor ~3.6942e-7 from ~52 iterations on -- identical at 80 and ' +
    '200 iters, ~9 orders of magnitude above the ~1e-16 double-precision floor -- so tighter bisection does NOT ' +
    'reach the FP floor; (T2) isolating the floor by varying the FD step h at saturated bisection shows it moves ' +
    'with h (2e-2 -> ~1.5e-9, 1e-2 -> ~3.69e-7, 5e-3 -> ~5.4e-6), i.e. the floor is finite-difference-cancellation ' +
    'limited (knee-inflection near-coincidence at the flat gapAt root), NOT bisection limited. So the residual IS ' +
    'fixed-window numerical noise (CONFIRMING imp-34956) but the bisection is already saturated and the residual ' +
    'is irreducible by tolerance refinement alone. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'MEASURES that tightening the imp-34956 fixed-window bisection tolerance drives the m-ramp-invariance residual ' +
    'to an IRREDUCIBLE floor ~3.69e-7 (plateau from ~52 iters, ~9 orders above the ~1e-16 FP floor), NOT toward ' +
    'the double-precision floor; the floor is finite-difference-cancellation limited (moves with the step h at ' +
    'saturated bisection), confirming the residual is fixed-window numerical noise not model error. What stays ' +
    'OPEN (deferred, changes no bound): whether a Richardson/complex-step or analytic-derivative gapAt kernel that ' +
    'removes the h-cancellation would drive the residual the remaining ~9 orders to the true FP floor, and the ' +
    'root-free closed form for the crossing-landmark location (imp-34898) that would sidestep the flat-root ' +
    'cancellation entirely.',
  farTailExponent: 0.5, // imp-3463 asymptote
  citation:
    'imp-34956 (attributed the ~1.6e-7 residual to fixed-window bisection/FD noise -- kernel reused verbatim); ' +
    'imp-34924 (derived g* = m s* algebraically m-invariant, reported the ~1.6e-7 residual); imp-34886 (the ' +
    's* ~ 0.78 = g* crossing on Gap(s)=0); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR_ASSERTIONS = [
  {
    // (T0): coarse bisection is bracket-limited -- the spread falls steeply from 8 to 24 iterations.
    id: 'imp35010-coarse-bisection-spread-falls-steeply',
    description: 'g*-spread drops from ~2.2e-3 (8 iters) through ~1.7e-5 (16) to ~8.6e-7 (24) as the bracket resolves',
    holds: () => {
      const s8 = TOLERANCE_SWEEP.find((r) => r.iters === 8).spread;
      const s16 = TOLERANCE_SWEEP.find((r) => r.iters === 16).spread;
      const s24 = TOLERANCE_SWEEP.find((r) => r.iters === 24).spread;
      return s8 > 1e-3 && s16 < s8 * 0.1 && s24 < s16 * 0.1 && s24 > 1e-7;
    },
  },
  {
    // (T1): the spread plateaus at an irreducible floor ~3.69e-7 from ~52 iterations -- identical at 80 and 200.
    id: 'imp35010-spread-plateaus-at-irreducible-floor',
    description: 'g*-spread locks at ~3.6942e-7 from ~52 iters; 80 and 200 iters give an identical floor',
    holds: () =>
      Math.abs(IRREDUCIBLE_FLOOR - 3.6942e-7) < 5e-9 &&
      Math.abs(FLOOR_AT_80 - IRREDUCIBLE_FLOOR) < 1e-15 &&
      Math.abs(MEAN_GSTAR - 0.7776532) < 5e-6,
  },
  {
    // (T1): tightening the tolerance does NOT reach the double-precision floor -- floor is ~9 orders above it.
    id: 'imp35010-floor-far-above-double-precision',
    description: 'the irreducible floor sits ~9 orders of magnitude above the ~1e-16 double-precision floor',
    holds: () =>
      IRREDUCIBLE_FLOOR > 1e-8 &&
      IRREDUCIBLE_FLOOR / DOUBLE_PRECISION_FLOOR > 1e8 &&
      IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR.floorAboveFpFloorOrders > 8,
  },
  {
    // (T2): isolate the floor -- at saturated bisection it MOVES with the FD step h (FD-cancellation limited).
    id: 'imp35010-floor-is-fd-cancellation-limited',
    description: 'at 200 iters the floor changes with the FD step h (2e-2..2.5e-3), so it is FD- not bisection-limited',
    holds: () => {
      const at1e2 = FD_STEP_DIAGNOSTIC.find((r) => r.h === 1e-2).spread;
      const at2e2 = FD_STEP_DIAGNOSTIC.find((r) => r.h === 2e-2).spread;
      const at5e3 = FD_STEP_DIAGNOSTIC.find((r) => r.h === 5e-3).spread;
      return Math.abs(at1e2 - 3.6942e-7) < 5e-9 && at2e2 < at1e2 * 0.1 && at5e3 > at1e2 * 5;
    },
  },
  {
    // the measured floor is the same order as the imp-34924/imp-34956 reported ~1.6e-7 residual (consistency).
    id: 'imp35010-floor-same-order-as-imp34924-residual',
    description: 'the measured irreducible floor ~3.7e-7 is the same order as the imp-34924/34956 reported ~1.6e-7',
    holds: () => IRREDUCIBLE_FLOOR / IMP34924_REPORTED_RESIDUAL > 0.5 && IRREDUCIBLE_FLOOR / IMP34924_REPORTED_RESIDUAL < 5,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35010-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR.isRigorous === false &&
      IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR.farTailExponent === 0.5 &&
      typeof IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR.subGap === 'string' &&
      /NO QED/.test(IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR.verdict),
  },
];

for (const a of IMP35010_RAMP_INVARIANCE_BISECTION_TOLERANCE_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35010-ramp-invariance-bisection-tolerance-floor assertion failed: ${a.id}`);
  }
}
