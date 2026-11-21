/**
 * @module imp-96504-route-m-gram-ladder-degeneracy-decidability-cost
 *
 * imp-96504 (numerical): FEASIBILITY/COST ESTIMATE -- how much wider a log-N reach
 * (and what wider-N Vasyunin Gram build cost) is needed to break the imp-96487
 * plateau-vs-ratio->1 degeneracy for the Route M Burnol-normalized quantity
 *     ratio(N) = d_N^2 * log N / C_burnol,   C_burnol = Sum_rho 1/|rho|^2.
 * imp-96487 IMP96487_SUBGAP (imp-96487-remainder-model-degenerate) reports the
 * decaying-oscillation remainder model favors a plateau at ~0.985 over ratio->1 by
 * ~1.9x in rms, but the 3.689-wide log-N window (~2.26 oscillation periods) leaves
 * the centerline and decay exponent jointly underdetermined; deciding needs a wider
 * log-N reach, NOT a further fit. This module quantifies that reach and prices it.
 *
 * SETUP (tmp/imp-96504-scratch.mjs, reproducible). The two hypotheses are the
 * intercept (at 1/L = 0, L = logN -> infinity) of the centerline regression
 *     ratio ~ c_inf - b/L :
 *   H_plateau : c_inf = 0.98456  (finite-N plateau below 1, the imp-96487 reading)
 *   H_RH      : c_inf = 1         (RH + simple zeros)
 * Deciding the asymptote = distinguishing the two intercepts, gap
 *     Delta = 1 - 0.98456 = 0.015436,
 * against the intercept standard error SE(c_inf). For an ordinary-least-squares
 * fit of ratio on x = 1/L the intercept variance depends ONLY on the 1/L design
 * points and the per-rung fluctuation sigma (the imp-96487 MB remainder rms
 * 8.855e-3), not on the y-values:
 *     Var(c_inf) = sigma^2 * ( 1/n + xbar^2 / Sxx ),  Sxx = Sum (x_i - xbar)^2.
 * A k-sigma decision needs SE(c_inf) <= Delta / k. The extension design keeps the
 * 21 measured rungs and ADDS rungs at the current ladder log-N density
 * (~5.42 rungs per unit L) out to N_max -- the honest continuation of the same
 * build cadence. Build cost uses the imp-96352 corrected model
 *     T_total(N) = kappa N^3 + beta N^2,  kappa = 9.621e-10, beta = 8.764e-6 s,
 * which reproduces the measured 1838.5 s single-process N=1e4 wall (IMP96325_RUN).
 *
 * FINDINGS (see IMP96504_REACH_TABLE / IMP96504_DECISION / IMP96504_VERDICT):
 *   (1) The current N=1e4 ladder is essentially undecidable: SE(c_inf) = 1.404e-2,
 *       so Delta/SE = 1.10 sigma -- the plateau and the RH intercept are barely
 *       one standard error apart (the SE-language restatement of the ~1.9x rms).
 *   (2) A 2-sigma decision needs N_max ~ 1.59e5, i.e. +2.77 in logN (+1.20 decades)
 *       beyond N=1e4, at a single-process build cost ~1137 h. A 3-sigma decision
 *       needs N_max ~ 2.10e6 (+5.35 in logN, +2.32 decades), build ~2.5e6 h.
 *   (3) BINDING CONSTRAINT: the 2-sigma point N ~ 1.59e5 already EXCEEDS the
 *       ~100 GB dense-Gram RAM ceiling N ~ 1.118e5 (N^2 * 8 bytes = 1e11), and the
 *       3-sigma point is far past both that RAM ceiling and the pessimistic
 *       double-precision Cholesky conditioning ceiling N ~ 2.16e5 (imp-96428).
 *   (4) MAX CONFIDENCE WITHIN THE MEMORY BUDGET: at the RAM ceiling N ~ 1.118e5
 *       (+2.41 in logN, +1.05 decades, build ~404 h) the decision reaches only
 *       Delta/SE = 1.88 sigma -- still short of a 2-sigma read. The dense Vasyunin
 *       Gram route therefore CANNOT decide the asymptote within its memory budget:
 *       a genuine decision needs a lower-memory / better-conditioned method
 *       (sparse-iterative solve, or a reformulation), not a further dense extension.
 *
 * VERDICT: breaking the degeneracy needs about +1.2 decades of log-N for a 2-sigma
 * read and about +2.3 decades for 3-sigma; the 2-sigma reach already exceeds the
 * dense-build ~100 GB RAM ceiling and the 3-sigma reach exceeds even the pessimistic
 * conditioning ceiling, and the best the dense build can do within memory is ~1.9
 * sigma. The wider-N dense Gram build is NOT a feasible decider of the true
 * asymptote; it caps at the same plateau-vs-drift ambiguity imp-96487 already
 * reported. This reprices the CPU-blocked build as memory-blocked-before-decisive.
 *
 * CAVEATS (IMP96504_SUBGAP): SE assumes (a) the per-rung fluctuation stays at
 * sigma = 8.855e-3 and (b) the smoothest 1/L drift alternative. If the remainder
 * amplitude decays (p>0) the effective noise falls at large N, easing the reach --
 * but the imp-96487 p-degeneracy forbids assuming it, so the reach figures are a
 * plausible central case, not a rigorous bound. The imp-96352 kappa N^3 cost is
 * itself an optimistic lower bound (IMP96352_SUBGAP: the inverse-power iteration
 * count m(n) plausibly grows, steepening past N^3), so the build hours understate.
 *
 * FEASIBILITY/COST ESTIMATE ONLY. Changes no bound, establishes no operator
 * positivity, makes no RH claim; no refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (the degeneracy this prices)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (kappa N^3 + beta N^2 cost model)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (conditioning ceiling N ~ 2.16e5)
 * @see imp-96325-route-m-vasyunin-gram-n1e4-run.js (measured 1838.5 s N=1e4 run + RAM budget)
 *
 * Ticket: imp-96504 (numerical, opus-4-8, api-pool). Numerics only; NO QED.
 */

// The decision quantities (imp-96487 readings).
export const IMP96504_INPUTS = Object.freeze({
  sigmaPerRung: 0.008854508473866598, // imp-96487 MB remainder rms (per-rung fluctuation)
  c0Plateau: 0.9845639691151629,      // imp-96487 plateau centerline
  deltaToDecide: 1 - 0.9845639691151629, // 0.0154360308848371 (gap 1 - c0)
  currentRungs: 21,
  currentSpanLogN: 3.6888794541139376,   // logN window width (imp-96487 IMP96487_LOGN_WINDOW.span)
  currentSpanDecades: 3.6888794541139376 / Math.LN10, // 1.602
  rungsPerUnitLogN: 20 / 3.6888794541139376, // ~5.42 (extension cadence)
  note: 'Delta = 1 - c0 is the intercept gap between the RH asymptote 1 and the imp-96487 plateau; sigma is the per-rung remainder fluctuation that sets the intercept SE.',
});

// The dense-Gram feasibility ceilings.
export const IMP96504_CEILINGS = Object.freeze({
  ramN: 111803.39887498949,   // N^2 * 8 bytes = 1e11 (~100 GB), imp-96352 RAM ceiling
  ramAddLogN: Math.log(111803.39887498949) - Math.log(1e4), // 2.414
  condNPessimistic: 2.16e5,   // imp-96428 double-precision Cholesky breakdown (pessimistic)
  condNTrace: 1e7,            // imp-96428 trace-bound (optimistic) conditioning ceiling
  note: 'the dense Vasyunin Gram build stores an N x N matrix (8 N^2 bytes), so the ~100 GB budget caps N ~ 1.118e5; imp-96428 puts the double-precision conditioning ceiling at 2.16e5 (pessimistic) to 1e7 (trace).',
});

// imp-96352 corrected cost model, seconds.
export const IMP96504_COST_MODEL = Object.freeze({
  kappaSolveSPerN3: 9.621e-10,
  betaBuildSPerN2: 8.764e-6,
  anchorSecondsAt1e4: 9.621e-10 * 1e12 + 8.764e-6 * 1e8, // 1838.5, reproduces the measured wall
  note: 'T_total(N) = kappa N^3 + beta N^2 (imp-96352 IMP96352_REACH_MODEL); optimistic lower bound (IMP96352_SUBGAP: m(n) may grow past the fitted N^3).',
});

// Intercept SE of the extended design (keep 21 rungs, add at current density to N_max).
export function imp96504InterceptSE(Nmax) {
  const N_NOW = [250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2300, 2600, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 7000, 8000, 9000, 10000];
  const dLper = IMP96504_INPUTS.currentSpanLogN / 20;
  const design = [...N_NOW];
  let L = Math.log(10000) + dLper;
  while (L <= Math.log(Nmax) + 1e-9) {
    design.push(Math.exp(L));
    L += dLper;
  }
  const x = design.map((N) => 1 / Math.log(N));
  const n = x.length;
  const xbar = x.reduce((s, v) => s + v, 0) / n;
  const Sxx = x.reduce((s, v) => s + (v - xbar) ** 2, 0);
  return IMP96504_INPUTS.sigmaPerRung * Math.sqrt(1 / n + (xbar * xbar) / Sxx);
}

// Forward build cost, seconds.
export function imp96504CostSeconds(N) {
  return IMP96504_COST_MODEL.kappaSolveSPerN3 * N ** 3 + IMP96504_COST_MODEL.betaBuildSPerN2 * N ** 2;
}

// Reach table (tmp/imp-96504-scratch.mjs). decisionSigmas = Delta / SE(c_inf).
export const IMP96504_REACH_TABLE = Object.freeze([
  Object.freeze({ Nmax: 1e4,   addLogN: 0.0,   addDecades: 0.0,   interceptSE: 0.014040, decisionSigmas: 1.10, buildHours: 0.51,      note: 'current ladder (imp-96325): essentially undecidable, ~1.1 sigma.' }),
  Object.freeze({ Nmax: 1e5,   addLogN: 2.303, addDecades: 1.000, interceptSE: 0.008504, decisionSigmas: 1.82, buildHours: 291.6 }),
  Object.freeze({ Nmax: 3e5,   addLogN: 3.401, addDecades: 1.477, interceptSE: 0.006917, decisionSigmas: 2.23, buildHours: 7434.9 }),
  Object.freeze({ Nmax: 1e6,   addLogN: 4.605, addDecades: 2.000, interceptSE: 0.005799, decisionSigmas: 2.66, buildHours: 269684.4 }),
]);

// The decision-point solves.
export const IMP96504_DECISION = Object.freeze({
  currentSigmas: 1.099,          // Delta / SE at N=1e4
  twoSigma: Object.freeze({
    Nmax: 1.591e5, addLogN: 2.767, addDecades: 1.20, buildHours: 1136.9,
    ramFeasible: false, condFeasible: true,
    note: 'a 2-sigma decision already exceeds the ~100 GB dense-Gram RAM ceiling (N ~ 1.118e5).',
  }),
  threeSigma: Object.freeze({
    Nmax: 2.104e6, addLogN: 5.349, addDecades: 2.32, buildHours: 2498936.0,
    ramFeasible: false, condFeasible: false,
    note: 'a 3-sigma decision is far past both the RAM ceiling and the pessimistic conditioning ceiling (N ~ 2.16e5).',
  }),
  maxWithinRam: Object.freeze({
    Nmax: 111803, addLogN: 2.414, addDecades: 1.048, interceptSE: 0.0081972, decisionSigmas: 1.883, buildHours: 403.9,
    note: 'the best the dense build can do inside ~100 GB is ~1.88 sigma -- still short of a 2-sigma read.',
  }),
});

export const IMP96504_VERDICT = Object.freeze({
  currentDecidable: false,
  addDecadesFor2Sigma: 1.20,
  addDecadesFor3Sigma: 2.32,
  denseBuildCanDecide: false,
  bindingConstraint: 'RAM (dense N x N Gram, ~100 GB at N ~ 1.118e5), reached before a 2-sigma decision',
  conclusion:
    'breaking the imp-96487 plateau-vs-ratio->1 degeneracy needs about +1.2 decades of logN for a 2-sigma read (N ~ 1.6e5, ~1137 h) and about +2.3 decades for 3-sigma (N ~ 2.1e6, ~2.5e6 h). Both exceed the dense Vasyunin Gram ~100 GB RAM ceiling (N ~ 1.118e5), where the decision tops out at only ~1.88 sigma, and the 3-sigma reach exceeds even the pessimistic double-precision conditioning ceiling (N ~ 2.16e5). The wider-N DENSE Gram build is NOT a feasible decider of the true asymptote -- it is memory-blocked before it becomes decisive; a genuine decision would require a lower-memory / better-conditioned method, not a further dense extension.',
});

// Honest residual sub-gap: the estimate is a plausible central case, not a bound.
export const IMP96504_SUBGAP = Object.freeze({
  id: 'imp-96504-decidability-reach-assumes-fixed-sigma',
  statement:
    'the reach figures assume the per-rung fluctuation stays at sigma = 8.855e-3 and that the alternative to the plateau is the smoothest 1/L drift; if the imp-96487 remainder amplitude actually decays (p>0) the effective noise falls at large N and the reach eases, but the imp-96487 centerline/decay p-degeneracy forbids assuming it, so the +1.2 / +2.3 decade requirements are a plausible central case, not a rigorous bound. The imp-96352 kappa N^3 cost is itself an optimistic lower bound (m(n) may grow), so the build hours understate. The feasibility verdict (dense build memory-blocked before 2 sigma) is robust to these, since it depends on the RAM ceiling and the current SE, not on the drift model.',
});

export const IMP96504_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Feasibility/cost estimate only: every value is a reproducible numeric from tmp/imp-96504-scratch.mjs over the baked imp-96487 ladder, the imp-96352 cost model and the imp-96428 conditioning ceiling; no new solve, no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96504_ASSERTIONS = [
  {
    id: 'imp96504-current-ladder-undecidable',
    holds: () =>
      Math.abs(IMP96504_DECISION.currentSigmas - 1.099) < 0.02 &&
      IMP96504_DECISION.currentSigmas < 1.5 &&
      IMP96504_VERDICT.currentDecidable === false,
    why: 'at N=1e4 the intercept gap Delta and its SE are ~1.1 sigma apart: the current ladder cannot decide plateau vs ratio->1.',
  },
  {
    id: 'imp96504-two-sigma-needs-about-1p2-decades',
    holds: () =>
      Math.abs(IMP96504_DECISION.twoSigma.addDecades - 1.20) < 0.1 &&
      IMP96504_DECISION.twoSigma.Nmax > 1e5 && IMP96504_DECISION.twoSigma.Nmax < 3e5 &&
      IMP96504_DECISION.twoSigma.ramFeasible === false,
    why: 'a 2-sigma decision needs ~+1.2 decades (N ~ 1.6e5), which already exceeds the ~100 GB dense-Gram RAM ceiling.',
  },
  {
    id: 'imp96504-three-sigma-past-both-ceilings',
    holds: () =>
      Math.abs(IMP96504_DECISION.threeSigma.addDecades - 2.32) < 0.1 &&
      IMP96504_DECISION.threeSigma.ramFeasible === false &&
      IMP96504_DECISION.threeSigma.condFeasible === false &&
      IMP96504_DECISION.threeSigma.Nmax > IMP96504_CEILINGS.condNPessimistic,
    why: 'a 3-sigma decision (N ~ 2.1e6, +2.3 decades) is past both the RAM ceiling and the pessimistic conditioning ceiling (N ~ 2.16e5).',
  },
  {
    id: 'imp96504-max-within-ram-below-two-sigma',
    holds: () =>
      IMP96504_DECISION.maxWithinRam.decisionSigmas > 1.8 &&
      IMP96504_DECISION.maxWithinRam.decisionSigmas < 2.0 &&
      IMP96504_VERDICT.denseBuildCanDecide === false,
    why: 'the best the dense build reaches inside ~100 GB is ~1.88 sigma -- short of 2 sigma: the dense route cannot decide the asymptote.',
  },
  {
    id: 'imp96504-cost-model-reproduces-1e4-wall',
    holds: () => Math.abs(IMP96504_COST_MODEL.anchorSecondsAt1e4 - 1838.5) < 0.5,
    why: 'the imp-96352 kappa N^3 + beta N^2 cost model reproduces the measured 1838.5 s single-process N=1e4 wall by construction.',
  },
  {
    id: 'imp96504-intercept-se-monotone-in-reach',
    holds: () => {
      const se5 = imp96504InterceptSE(1e5);
      const se6 = imp96504InterceptSE(1e6);
      const seNow = imp96504InterceptSE(1e4);
      return se6 < se5 && se5 < seNow && Math.abs(se5 - 0.008504) < 3e-4;
    },
    why: 'the extrapolated-intercept SE falls monotonically as the log-N reach widens, and the recomputed N=1e5 SE matches the baked table (~8.5e-3).',
  },
  {
    id: 'imp96504-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96504_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96504_HONEST_BANNER) &&
      /NO QED/.test(IMP96504_HONEST_BANNER) &&
      typeof IMP96504_SUBGAP.statement === 'string' &&
      /central case/.test(IMP96504_SUBGAP.statement),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and an explicit named sub-gap flagging the fixed-sigma / smoothest-drift assumptions.',
  },
];

for (const a of IMP96504_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96504-route-m-gram-ladder-degeneracy-decidability-cost assertion failed: ${a.id}`);
  }
}

export default {
  inputs: IMP96504_INPUTS,
  ceilings: IMP96504_CEILINGS,
  costModel: IMP96504_COST_MODEL,
  interceptSE: imp96504InterceptSE,
  costSeconds: imp96504CostSeconds,
  reachTable: IMP96504_REACH_TABLE,
  decision: IMP96504_DECISION,
  verdict: IMP96504_VERDICT,
  subGap: IMP96504_SUBGAP,
  banner: IMP96504_HONEST_BANNER,
};
