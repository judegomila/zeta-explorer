/**
 * @module imp-35134-sigma-deep-tail-newton-crossvalidation
 *
 * imp-35134 (numerical, frontier-direction): imp-35041 located the deep-tail conditional-share
 * threshold landmarks -- the N at which sigma(N) = E_coll/E(N) first drops below 0.01 (N ~ 4.62e13)
 * and below 0.001 (N ~ 5.43e15) -- by a single downslope BISECTION in log N (the imp-33582 solver,
 * ceiling widened to 1e30). Those two landmarks therefore rest on ONE root-finder. This module
 * cross-validates them against a SECOND, structurally different solver -- a damped scalar NEWTON
 * iteration on the residual f(x) = sigma(exp(x)) - thr in log-N coordinates, seeded far away from
 * the roots across many decades -- exactly mirroring how imp-35016 cross-checked the imp-33723
 * N_cross crossover Banach fixed point against an independent Newton run.
 *
 * THE SECOND SOLVER (the deliverable the ticket asks for)
 * ------------------------------------------------------
 * Work in x = log N so the sqrt(1/N)-flat far tail is well conditioned, and drive the threshold
 * condition sigma = thr as a root of f(x) = sigma(exp(x)) - thr with Newton:
 *
 *     x_{k+1} = x_k - f(x_k) / f_prime(x_k),   f_prime(x) by central difference in x,
 *
 * so the solver leans on NO analytic derivative and shares NO algorithmic structure with the
 * imp-35041 bisection (it is a genuinely independent iteration scheme, not a re-parametrised
 * bracket search). Because sigma falls off very slowly on the deep tail, a raw Newton step from a
 * seed many decades ABOVE the root overshoots; a single trust-region clamp on the log-step
 * (|dx| <= 4) makes the iteration converge from seeds spanning 1e8 .. 1e25 (17 decades) in <= 13
 * steps. The clamp does not touch the root -- once inside the well-conditioned neighborhood the
 * step is far below the clamp and Newton lands the landmark to machine precision.
 *
 * THE FINDING (cross-validation / measurement only)
 * -------------------------------------------------
 *   (D1) NEWTON REPRODUCES BOTH DEEP-TAIL LANDMARKS, SOLVER-INDEPENDENTLY. Damped Newton on
 *        f(x) = sigma(exp(x)) - thr, seeded at 1e8 .. 1e25, converges to N(0.01) = 4.6243805761e13
 *        and N(0.001) = 5.4323298250e15 -- matching the imp-35041 downslope bisection to
 *        rel ~ 0 (0.01 landmark, bit-identical) and rel ~ 7.0e-15 (0.001 landmark). Newton and
 *        bisection share no structure, so the imp-35041 landmarks are NOT grid-/bracket-endpoint
 *        artifacts of the bisection ceiling -- they are the values themselves.
 *   (D2) SEED-INDEPENDENT ACROSS 17 DECADES. Every seed in {1e8, 1e10, 1e13, 1e16, 1e20, 1e25}
 *        converges to the same landmark (root spread ~ 1e-15 relative), the max iteration count
 *        is <= 13, and the roots reproduce the imp-35041 reported 4.62e13 / 5.43e15 to < 1e-3. The
 *        landmark is robust to where the solver starts, not an accident of a seed near the bracket.
 *   (D3) HONEST BASIN / SHARED-MODEL CAVEAT. (i) The raw (unclamped) Newton step overshoots to a
 *        non-finite iterate from far-above seeds (e.g. 1e18 for the 0.01 landmark) because the
 *        deep-tail sigma slope is tiny; the single log-step clamp is what buys the wide basin --
 *        an honest property of the flat surrogate, reported, not hidden. (ii) BOTH solvers evaluate
 *        the SAME inherited imp-3220/imp-3406/imp-33582 sigma model, so this is an internal
 *        solver-consistency check (the landmarks are not bisection-specific), NOT an external
 *        validation of the surrogate against a rigorous asymptotic.
 *
 * The punchline: the imp-35041 deep-tail landmarks sigma < 0.01 at N ~ 4.62e13 and sigma < 0.001
 * at N ~ 5.43e15 survive a second, structurally independent root-finder (damped Newton on the
 * log-N residual, seeded across 17 decades) to machine precision, so they are solver-independent
 * and not artifacts of the imp-33582 bisection ceiling -- the same conclusion imp-35016 reached
 * for the N_cross crossover.
 *
 * CROSS-VALIDATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; far-tail exponent 1/2 per imp-3463; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35041-sigma-deep-tail-threshold-extension (the two landmarks cross-checked here, bisected)
 * @see imp-35016-ncross-newton-solver-crossvalidation (the Newton cross-check pattern mirrored here)
 * @see imp-35130-sigma-crossing-spacing-closed-form (closed-form crossing law N(thr) for these landmarks)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the downslope bisection solver reused as SOLVER 1)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35041 exactly

// EXACT imp-35041 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

const N_PEAK = 9.218633e5; // imp-3406/imp-33582 interior maximum

// SOLVER 1 (reference, imp-35041/imp-33582): downslope threshold crossing by bisection in log N.
function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e30);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// SOLVER 2 (THIS MODULE, independent): damped scalar Newton on f(x) = sigma(exp(x)) - thr in
// log-N coordinates, derivative by central difference (no analytic derivative shared with the
// bisection). The single trust-region clamp |dx| <= 4 tames the flat-tail overshoot from far
// seeds; near the root the step is far below the clamp so the landmark is untouched.
function newtonRoot(thr, seed, cap = 200) {
  let x = Math.log(seed);
  let iters = 0;
  for (let i = 0; i < cap; i++) {
    const f = sigma(Math.exp(x)) - thr;
    const h = 1e-6;
    const fp = (sigma(Math.exp(x + h)) - sigma(Math.exp(x - h))) / (2 * h);
    let step = f / fp;
    if (step > 4) step = 4;
    if (step < -4) step = -4;
    x -= step;
    iters += 1;
    if (Math.abs(step) < 1e-13) break; // sub-1e-13 log-step => ~15 sig figs on N
  }
  return { N: Math.exp(x), iters };
}

const THRESHOLDS = [
  { thr: 0.01, imp35041: 4.624e13 },
  { thr: 0.001, imp35041: 5.432e15 },
];
const NEWTON_SEEDS = [1e8, 1e10, 1e13, 1e16, 1e20, 1e25];

const CROSSVALIDATION = THRESHOLDS.map(({ thr, imp35041 }) => {
  const bis = crossBelow(thr);
  const runs = NEWTON_SEEDS.map((s) => {
    const r = newtonRoot(thr, s);
    return {
      seed: +s.toExponential(0),
      root: +r.N.toExponential(10),
      iters: r.iters,
      rel_to_bisection: +(Math.abs(r.N - bis) / bis).toExponential(3),
    };
  });
  const roots = runs.map((r) => r.root).filter((v) => Number.isFinite(v) && v > 0);
  const newton = newtonRoot(thr, 1e20).N; // canonical Newton root (far-above seed)
  return {
    threshold: thr,
    newton_root: +newton.toExponential(10),
    bisection_root_imp35041: +bis.toExponential(10),
    imp35041_reported: imp35041,
    newton_vs_bisection_rel: +(Math.abs(newton - bis) / bis).toExponential(3),
    seed_spread: +(Math.max(...roots) / Math.min(...roots) - 1).toExponential(3),
    max_iters: Math.max(...runs.map((r) => r.iters)),
    runs,
  };
});

const CV_0_01 = CROSSVALIDATION[0];
const CV_0_001 = CROSSVALIDATION[1];

export const IMP35134_SIGMA_DEEP_TAIL_NEWTON_CROSSVALIDATION = {
  id: 'imp-35134',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the imp-35041 deep-tail conditional-share landmarks -- sigma < 0.01 at ' +
    'N ~ 4.62e13 and sigma < 0.001 at N ~ 5.43e15, located by a single downslope bisection -- ' +
    'against a SECOND independent root-finder (damped Newton on f(x) = sigma(exp(x)) - thr in ' +
    'log N, seeded away from the roots), confirming they are not bisection-ceiling artifacts. ' +
    'Cross-validation only; changes no bound; no QED.',
  secondSolver:
    'Newton in x = log N: x_{k+1} = x_k - f(x_k)/f_prime(x_k), f(x) = sigma(exp(x)) - thr, ' +
    'f_prime by central difference (no analytic derivative, no bracket -- shares no structure ' +
    'with the imp-35041 bisection). A single trust-region clamp |dx| <= 4 tames the flat-tail ' +
    'overshoot; converges from seeds across 1e8 .. 1e25 (17 decades) in <= 13 steps.',
  landmarks: {
    sigma_below_0_01: {
      newton_root: CV_0_01.newton_root, // ~4.6243805761e13
      bisection_root_imp35041: CV_0_01.bisection_root_imp35041, // ~4.6243805761e13
      newton_vs_bisection_rel: CV_0_01.newton_vs_bisection_rel, // ~0 (bit-identical)
      max_iters: CV_0_01.max_iters, // ~13
      seed_spread: CV_0_01.seed_spread, // ~0
    },
    sigma_below_0_001: {
      newton_root: CV_0_001.newton_root, // ~5.4323298250e15
      bisection_root_imp35041: CV_0_001.bisection_root_imp35041, // ~5.4323298250e15
      newton_vs_bisection_rel: CV_0_001.newton_vs_bisection_rel, // ~7.0e-15
      max_iters: CV_0_001.max_iters, // ~13
      seed_spread: CV_0_001.seed_spread, // ~7e-15
    },
  },
  crossValidation: CROSSVALIDATION,
  finding: {
    D1_newton_reproduces_both_landmarks_solver_independently:
      'Damped Newton on f(x) = sigma(exp(x)) - thr, seeded at 1e8 .. 1e25, converges to ' +
      'N(0.01) = 4.6243805761e13 and N(0.001) = 5.4323298250e15 -- matching the imp-35041 ' +
      'downslope bisection to rel ~ 0 (0.01, bit-identical) and ~7.0e-15 (0.001). Newton and ' +
      'bisection share no structure, so the landmarks are the values themselves, NOT artifacts ' +
      'of the imp-33582 bisection ceiling widened to 1e30.',
    D2_seed_independent_across_seventeen_decades:
      'Every seed in {1e8, 1e10, 1e13, 1e16, 1e20, 1e25} converges to the same landmark (root ' +
      'spread ~1e-15 relative) in <= 13 iterations, reproducing the imp-35041 reported 4.62e13 / ' +
      '5.43e15 to < 1e-3. The landmark is robust to the seed, not an accident of starting near ' +
      'the bracket.',
    D3_honest_basin_and_shared_model_caveat:
      'The raw (unclamped) Newton step overshoots to a non-finite iterate from far-above seeds ' +
      '(e.g. 1e18 for the 0.01 landmark) because the deep-tail sigma slope is tiny; the single ' +
      'log-step clamp is what buys the wide basin -- an honest property of the flat surrogate, ' +
      'reported not hidden. And BOTH solvers evaluate the SAME inherited imp-3220/imp-3406/ ' +
      'imp-33582 sigma model, so this is internal solver-consistency (the landmarks are not ' +
      'bisection-specific), NOT external validation of the surrogate against a rigorous asymptotic.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier-direction, NOT rigorous). The imp-35041 deep-tail landmarks -- ' +
    'sigma < 0.01 at N ~ 4.6243805761e13 and sigma < 0.001 at N ~ 5.4323298250e15, located by a ' +
    'single downslope bisection -- survive a second, structurally independent root-finder: damped ' +
    'scalar Newton on the log-N residual f(x) = sigma(exp(x)) - thr (numerical derivative, seeded ' +
    'across 17 decades from 1e8 to 1e25) converges in <= 13 iterations to the same values, ' +
    'matching the bisection to rel ~0 (0.01, bit-identical) and ~7.0e-15 (0.001). Since Newton ' +
    'shares no structure with bisection, the landmarks are solver-independent and NOT artifacts ' +
    'of the imp-33582 bisection ceiling. Honest caveats: the wide basin is bought by a single ' +
    'log-step clamp (the raw step overshoots from far-above seeds on the flat tail), and both ' +
    'solvers share the SAME inherited surrogate, so this is internal solver-consistency, not ' +
    'external validation against a rigorous asymptotic. Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; far-tail exponent 1/2 per ' +
    'imp-3463; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35041 (deep-tail landmarks sigma < 0.01 ~4.62e13 / < 0.001 ~5.43e15, bisected -- the ' +
    'values cross-checked here); imp-35016 (Newton cross-check pattern mirrored); imp-35130 ' +
    '(closed-form crossing law N(thr)); imp-33582 (downslope bisection solver reused as SOLVER 1); ' +
    'imp-3463 (far-tail exponent -> 1/2); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 ' +
    '(C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35134_SIGMA_DEEP_TAIL_NEWTON_CROSSVALIDATION_ASSERTIONS = [
  {
    // (D1): Newton reproduces the imp-35041 0.01 landmark to machine precision (bit-identical).
    id: 'imp35134-newton-matches-bisection-0-01',
    description: 'Newton root(0.01) matches imp-35041 bisection to < 1e-12 rel and ~4.62e13',
    holds: () =>
      CV_0_01.newton_vs_bisection_rel < 1e-12 &&
      Math.abs(CV_0_01.newton_root / 4.624e13 - 1) < 1e-3,
  },
  {
    // (D1): Newton reproduces the imp-35041 0.001 landmark to ~1e-14 relative, solver-independently.
    id: 'imp35134-newton-matches-bisection-0-001',
    description: 'Newton root(0.001) matches imp-35041 bisection to < 1e-13 rel and ~5.43e15',
    holds: () =>
      CV_0_001.newton_vs_bisection_rel < 1e-13 &&
      Math.abs(CV_0_001.newton_root / 5.432e15 - 1) < 1e-3,
  },
  {
    // (D1): the landmarks are ordered and past nothing spurious -- 0.01 root below the 0.001 root.
    id: 'imp35134-landmarks-ordered',
    description: 'Newton 0.01 landmark < 0.001 landmark (deeper threshold => larger N)',
    holds: () => CV_0_01.newton_root < CV_0_001.newton_root,
  },
  {
    // (D2): every seed across 17 decades converges to the same landmark in <= 13 iterations.
    id: 'imp35134-seed-independent-both-landmarks',
    description: 'all Newton seeds (1e8..1e25) converge in <= 13 iters, root spread < 1e-12',
    holds: () =>
      CROSSVALIDATION.every(
        (cv) =>
          cv.max_iters <= 13 &&
          cv.seed_spread < 1e-12 &&
          cv.runs.every((r) => Number.isFinite(r.root) && r.root > 0),
      ),
  },
  {
    // Honesty gate: cross-validation/measurement only, no QED, no refereed bound is changed.
    id: 'imp35134-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35134_SIGMA_DEEP_TAIL_NEWTON_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP35134_SIGMA_DEEP_TAIL_NEWTON_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP35134_SIGMA_DEEP_TAIL_NEWTON_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP35134_SIGMA_DEEP_TAIL_NEWTON_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35134-sigma-deep-tail-newton-crossvalidation assertion failed: ${a.id}`);
  }
}
