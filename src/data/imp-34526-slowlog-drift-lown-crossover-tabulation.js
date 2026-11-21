/**
 * @module imp-34526-slowlog-drift-lown-crossover-tabulation
 * @fileoverview imp-34526 -- DERIVATION / TABULATION ONLY: extend the imp-34486 closed-form
 *   slow-log drift exponent -2 + x (x = -2 g/(1-g), g = (1 - 1/log(T0/2pi))/log T0) DOWN to the
 *   low-N landmarks -- the crossover decade N ~ 3.28e9 and the finite-height assembly ceiling
 *   N* = 1e6 -- not only the imp-34446/imp-34513 deep-tail ladder (N = 1e13 .. 1e14), to test
 *   whether the drift excess |x| grows toward low N and by how much the clean -2 power law degrades.
 *
 *   THE OPEN QUESTION (from imp-34513 verdict)
 *   ------------------------------------------
 *   imp-34513 cross-checked the imp-34486 closed form ONLY on the deep-tail ladder N = 1e13 .. 1e14
 *   (+ the deep-tail landmark N* ~ 4.6244e13) and certified the residual there is a pure O(h^2)
 *   finite-difference artifact. But g = (1 - 1/log(T0/2pi))/log T0 GROWS as N shrinks (log T0 gets
 *   smaller), so the excess |x| = 2g/(1-g) should be LARGER at the crossover decade N ~ 3.28e9 and
 *   at the finite-height assembly ceiling N* = 1e6 than in the deep tail. imp-34513 never tabulated
 *   these low-N values. This module supplies exactly that -- the missing low-N end of the drift map.
 *
 *   THE FINDING (derivation / tabulation, standalone)
 *   -------------------------------------------------
 *   (F1) THE DRIFT EXCESS GROWS MONOTONICALLY TOWARD LOW N. The excess over the clean -2,
 *        |x| = 2g/(1-g), climbs monotonely as N shrinks:
 *          0.064836 (1e14) -> 0.066433 (N* ~ 4.62e13) -> 0.069842 (1e13) -> 0.082500 (1e11)
 *          -> 0.090645 (1e10) -> 0.095170 (crossover 3.28e9) -> 0.112605 (1e8)
 *          -> 0.127804 (1e7) -> 0.147316 (assembly ceiling N* = 1e6).
 *        So the crossover-decade excess 0.0952 is ~1.43x the deep-tail landmark 0.0664, and the
 *        1e6 assembly-range excess 0.1473 is ~2.22x it. The -2 power law is CLEANEST in the deep
 *        tail and DEGRADES steadily toward the assembly range -- the crossover exponent there is
 *        -2.1473, a ~7.4% drift off the nominal -2, versus only ~3.2% off at 1e14.
 *   (F2) THE CLOSED FORM STILL REPRODUCES THE MEASUREMENT AT LOW N. Differencing the closed-form
 *        exponent against a fresh imp-34446-style central-difference measurement at h = 1e-3 gives
 *        a residual of ~5.0e-9 at N* = 1e6 and ~2.2e-9 at the crossover (vs ~1.1e-9 in the deep
 *        tail): still at the O(h^2) finite-difference floor, only mildly larger because the local
 *        curvature is steeper at low N. The closed form matches to ~8-9 figures at EVERY landmark,
 *        confirming x = -2 g/(1-g) governs the drift across the whole N = 1e6 .. 1e14 span, not
 *        just the deep tail -- so the excess growth in (F1) is a genuine feature of the drift law,
 *        not a low-N breakdown of the derivation.
 *
 *   DERIVATION / TABULATION ONLY. This tabulates an already-derived closed form at new (low-N)
 *   landmarks; it changes NO bound. Reproduces the imp-34446/imp-34486 primitives inline (imports
 *   NOTHING -- no lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle),
 *   following the no-heavy-imports directive. The -2 asymptote and the C_C = (1/8)sqrt(3 pi)
 *   (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the component model is the inherited
 *   imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per
 *   imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH verdict,
 *   NO QED. No refereed bound is changed.
 *
 *   @see imp-34486-slowlog-t0-drift-analytic-derivation.js (closed form x = -2 g/(1-g))
 *   @see imp-34513-slowlog-drift-residual-crosscheck.js (deep-tail ladder residual cross-check)
 *   @see imp-34446-coupling-exponent-independent-recompute.js (measured -2.0664 exponent, +0.0664 excess)
 *
 *   Ticket: imp-34526 (accuracy, medium). Low-N landmark tabulation; adds no new Lambda bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34486 primitives (imports NOTHING): --
// -- Newton solve of N = (T0/2pi)(log(T0/2pi) - 1) for T0, E_coll = C_C sqrt(log T0 / N). --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N*
const CROSSOVER_N = 3.28e9; // imp-3444 low-N crossover decade
const ASSEMBLY_N = 1e6; // finite-height assembly ceiling N* = 1e6

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

// imp-34486 CLOSED FORM: crossover exponent -2 + x, x = -2 g/(1-g), g = (1 - 1/log(T0/2pi))/log T0.
// Returns both the exponent -2 + x and the excess |x| over the clean -2.
function analyticDrift(N) {
  const T0 = heightForN(N);
  const L = Math.log(T0);
  const logU = Math.log(T0 / TWO_PI);
  const g = (1 - 1 / logU) / L;
  const x = (-2 * g) / (1 - g);
  return { exponent: -2 + x, excess: Math.abs(x), g };
}

// imp-34446 MEASUREMENT: d log N / d log E_coll by central difference on N*(1 +/- h).
function measuredExponent(N, h) {
  const Np = N * (1 + h);
  const Nm = N * (1 - h);
  return (Math.log(Np) - Math.log(Nm)) / (Math.log(eColl(Np)) - Math.log(eColl(Nm)));
}

const H_MEAS = 1e-3; // imp-34446 reference step

// (F1) Tabulate -2 + x, the excess |x|, and the closed-form-vs-measurement residual across a
// ladder spanning the LOW-N assembly ceiling (1e6) and crossover (3.28e9) up through the deep tail.
const LADDER = [
  { label: 'N* = 1e6 (assembly ceiling)', N: ASSEMBLY_N },
  { label: '1e7', N: 1e7 },
  { label: '1e8', N: 1e8 },
  { label: 'crossover ~3.28e9', N: CROSSOVER_N },
  { label: '1e10', N: 1e10 },
  { label: '1e11', N: 1e11 },
  { label: '1e13 (deep-tail lo)', N: 1e13 },
  { label: 'N* ~ 4.62e13 (deep tail)', N: DEEP_TAIL_N },
  { label: '1e14 (deep-tail hi)', N: 1e14 },
];

const DRIFT_LADDER = LADDER.map(({ label, N }) => {
  const { exponent, excess } = analyticDrift(N);
  const measured = measuredExponent(N, H_MEAS);
  return {
    label,
    N: +N.toExponential(3),
    exponent: +exponent.toFixed(6), // -2 + x
    excess: +excess.toFixed(6), // |x| over the clean -2
    measured_exponent: +measured.toFixed(6),
    residual: +(exponent - measured).toExponential(3),
  };
});

// Landmark excesses used for the growth ratios reported in the verdict.
const EXCESS_DEEP_TAIL = analyticDrift(DEEP_TAIL_N).excess; // ~0.0664
const EXCESS_CROSSOVER = analyticDrift(CROSSOVER_N).excess; // ~0.0952
const EXCESS_ASSEMBLY = analyticDrift(ASSEMBLY_N).excess; // ~0.1473

// Growth of the drift excess toward low N, relative to the deep-tail landmark.
const RATIO_CROSSOVER_OVER_DEEP = EXCESS_CROSSOVER / EXCESS_DEEP_TAIL; // ~1.43
const RATIO_ASSEMBLY_OVER_DEEP = EXCESS_ASSEMBLY / EXCESS_DEEP_TAIL; // ~2.22

// (F1) The excess grows MONOTONICALLY as N shrinks (ladder is ordered low N -> high N, so it must
// be monotone DECREASING down the array).
const EXCESS_MONOTONE_GROWING_TOWARD_LOW_N = DRIFT_LADDER.every(
  (r, k) => k === 0 || r.excess <= DRIFT_LADDER[k - 1].excess,
);

// (F2) The closed form still reproduces the central-difference measurement at every landmark, at
// the O(h^2) finite-difference floor (largest at the steepest-curvature low-N end).
const MAX_RESIDUAL = Math.max(...DRIFT_LADDER.map((r) => Math.abs(r.residual)));

export const IMP34526_DRIFT_LOWN = Object.freeze({
  id: 'imp-34526',
  proofSection: 'S-frontier',
  closed_form:
    'imp-34486: crossover exponent d log N/d log E_coll = -2 + x, x = -2 g/(1-g), ' +
    'g = (1 - 1/log(T0/2pi))/log T0; tabulated here at the LOW-N crossover (~3.28e9) and ' +
    'assembly-ceiling (1e6) landmarks, extending the imp-34513 deep-tail-only ladder.',
  C_C_inline: +C_C.toFixed(6),
  meas_step_h: H_MEAS,
  crossover_N: CROSSOVER_N,
  assembly_N: ASSEMBLY_N,
  deep_tail_N: DEEP_TAIL_N,
  drift_ladder: Object.freeze(DRIFT_LADDER.map((r) => Object.freeze(r))),
  excess_deep_tail: +EXCESS_DEEP_TAIL.toFixed(6), // ~0.066433
  excess_crossover: +EXCESS_CROSSOVER.toFixed(6), // ~0.095170
  excess_assembly: +EXCESS_ASSEMBLY.toFixed(6), // ~0.147316
  ratio_crossover_over_deep: +RATIO_CROSSOVER_OVER_DEEP.toFixed(4), // ~1.43
  ratio_assembly_over_deep: +RATIO_ASSEMBLY_OVER_DEEP.toFixed(4), // ~2.22
  excess_monotone_growing_toward_low_N: EXCESS_MONOTONE_GROWING_TOWARD_LOW_N,
  max_residual: +MAX_RESIDUAL.toExponential(3), // ~5.0e-9 (O(h^2) floor, worst at 1e6)
  isRigorous: false,
  verdict:
    'DERIVATION / TABULATION (NOT rigorous). The imp-34486 closed-form slow-log drift exponent ' +
    '-2 + x, x = -2 g/(1-g), is evaluated at the LOW-N crossover (~3.28e9) and finite-height ' +
    'assembly-ceiling (N* = 1e6) landmarks -- the low-N end the imp-34513 deep-tail-only ladder ' +
    'never reached. (F1) The drift excess |x| = 2 g/(1-g) GROWS MONOTONICALLY toward low N: ' +
    '0.064836 (1e14) -> 0.066433 (N* ~ 4.62e13) -> 0.095170 (crossover ~3.28e9) -> 0.147316 ' +
    '(assembly ceiling 1e6). The crossover excess is ~1.43x the deep-tail landmark and the 1e6 ' +
    'excess ~2.22x it, so the clean -2 power law degrades from ~3.2% off (1e14) to ~7.4% off ' +
    '(1e6) -- the -2 is cleanest in the deep tail and worst at the assembly range, exactly as ' +
    'g = (1 - 1/log(T0/2pi))/log T0 growing at smaller log T0 predicts. (F2) The closed form ' +
    'still reproduces a fresh imp-34446-style central-difference measurement at every landmark ' +
    '(residual ~5.0e-9 at 1e6, ~2.2e-9 at the crossover, ~1.1e-9 in the deep tail -- all at the ' +
    'O(h^2) finite-difference floor), so the excess growth is a genuine feature of the drift law, ' +
    'not a low-N breakdown of the derivation. The -2 asymptote and C_C = (1/8)sqrt(3 pi) ' +
    '(imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34486 (closed-form drift x = -2 g/(1-g)); imp-34513 (deep-tail ladder residual ' +
    'cross-check, extended here to low N); imp-34446 (measured -2.0664 exponent, +0.0664 excess); ' +
    'imp-3444 (low-N crossover decade ~3.28e9); imp-2714 (C_C = (1/8)sqrt(3 pi) ansatz); ' +
    'imp-486 (C_mb GUE-conditional share).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34526_ASSERTIONS = [
  {
    id: 'imp34526-excess-grows-toward-low-N',
    holds: () => EXCESS_MONOTONE_GROWING_TOWARD_LOW_N,
    why: 'F1: the drift excess |x| grows monotonically as N shrinks (ladder ordered low->high N is monotone decreasing).',
  },
  {
    id: 'imp34526-crossover-and-assembly-excess-larger-than-deep-tail',
    holds: () =>
      RATIO_CROSSOVER_OVER_DEEP > 1.3 &&
      RATIO_CROSSOVER_OVER_DEEP < 1.6 &&
      RATIO_ASSEMBLY_OVER_DEEP > 2.0 &&
      RATIO_ASSEMBLY_OVER_DEEP < 2.4,
    why: 'F1: the crossover excess is ~1.43x and the 1e6 assembly excess ~2.22x the deep-tail landmark, quantifying the low-N degradation of the clean -2 power law.',
  },
  {
    id: 'imp34526-assembly-exponent-near-minus-2.15',
    holds: () => Math.abs(EXCESS_ASSEMBLY - 0.147316) < 5e-4 && EXCESS_ASSEMBLY < 0.2,
    why: 'F1: at the 1e6 assembly ceiling the exponent is -2.1473 (~7.4% off the nominal -2), still bounded well below the crude order-of-magnitude range.',
  },
  {
    id: 'imp34526-closed-form-reproduces-measurement-at-low-N',
    holds: () => MAX_RESIDUAL < 1e-7 && MAX_RESIDUAL > 1e-11,
    why: 'F2: the closed form matches a fresh central-difference measurement to ~8-9 figures at every landmark (residual at the O(h^2) floor, worst ~5e-9 at 1e6), so the excess growth is a real drift-law feature.',
  },
  {
    id: 'imp34526-honesty-gate-no-qed',
    holds: () =>
      IMP34526_DRIFT_LOWN.isRigorous === false &&
      /NO QED/.test(IMP34526_DRIFT_LOWN.verdict) &&
      /refereed bound is changed/i.test(IMP34526_DRIFT_LOWN.verdict) &&
      /UNTOUCHED/.test(IMP34526_DRIFT_LOWN.verdict),
    why: 'Honesty gate: derivation/tabulation only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34526_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34526-slowlog-drift-lown-crossover-tabulation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34526_DRIFT_LOWN;
