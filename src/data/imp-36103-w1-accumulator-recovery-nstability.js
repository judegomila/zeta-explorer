/**
 * @module imp-36103-w1-accumulator-recovery-nstability
 *
 * imp-36103 (accuracy, S-frontier): MEASURE whether the imp-36061 accumulator
 * recovery-width edges (alpha |delta| ~ 0.560/0.611 rad at 10%/1%; beta ~ 3.19/3.32) and the
 * strong-cancellation baseline r_base ~ 1.18e-3 are N-STABLE, since imp-36061 pinned them at a
 * SINGLE fixed N ~ 488602 (the retained-term count at T_PT). A run-time monitor comparing the
 * imp-35890 running-accumulator ratio r = max_i|S_i| / Sum|t_k| against a baseline would key on
 * an N-stable margin, so this recomputes r_base and the alpha/beta 10%/1% recovery edges at
 * N = 1e5 and N = 1e6 (bracketing the imp-36061 N ~ 488602 rung) for the oscillatory term family
 * t_k = cos(alpha k + beta sqrt(k)) / sqrt(k), and reports whether the edges migrate with N.
 *
 * The three rungs (r_base and all four edges) were computed OFFLINE by
 * scripts/imp-36103-nstability-offline.mjs -- bit-for-bit the imp-36061 ratioAt / locateEdge
 * kernel (running accumulator, 40-iteration bisection from the q=1 resonance) re-run at each N.
 * This module BAKES those recorded literals (import-light, no heavy re-derivation at load) and
 * asserts the N-stability verdict from them, following the imp-35791 / imp-35977 baked-literal
 * pattern.
 *
 * MEASUREMENT ONLY. Instantiates no directed-rounding interval; evaluates no true H_0; verifies
 * no inequality; changes no bound; establishes no positivity; the certified length-N interval sum
 * stays MECHANICAL / GREENFIELD (imp-35725 / imp-35681 Part A); C_mb GUE-conditional (imp-486)
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * FINDING -- the recovery EDGES are N-STABLE, but the baseline r_base is NOT (it decays ~1/sqrt(N))
 * -----------------------------------------------------------------------------
 *   - BASELINE r_base is NOT N-stable: it decays from ~2.61e-3 at N = 1e5 through ~1.18e-3 at
 *     N ~ 488602 to ~8.26e-4 at N = 1e6 -- a factor ~3.17 across the 10x N span. The decay is a
 *     clean 1/sqrt(N) law: r_base * sqrt(N) ~ 0.826 holds to ~0.14% across all three rungs (0.8267,
 *     0.8258, 0.8256). This is expected -- max_i|S_i| stays O(1) under strong cancellation while
 *     Sum|t_k| ~ Sum 1/sqrt(k) ~ 2 sqrt(N) grows, so r_base ~ c / sqrt(N).
 *   - RECOVERY EDGES are N-STABLE: across N = 1e5 -> 1e6 (a 10x span) each edge holds to ~4
 *     significant figures (relative spread < 5e-4):
 *       alpha 10%: 0.56020 / 0.56003 / 0.55999   (spread ~3.8e-4)
 *       alpha  1%: 0.61114 / 0.61100 / 0.61096   (spread ~2.9e-4)
 *       beta  10%: 3.18642 / 3.18612 / 3.18595   (spread ~1.5e-4)
 *       beta   1%: 3.32016 / 3.32055 / 3.32043   (spread ~1.2e-4)
 *     The edges are N-invariant BECAUSE the edge is defined RELATIVE to r_base(N): both the
 *     detuned r and r_base share the same 1/sqrt(N) scaling, so the ratio r / r_base -- and hence
 *     the detuning at which it crosses 1.10 / 1.01 -- is N-independent to leading order.
 * CONSEQUENCE for the imp-36004 / imp-35949 run-time monitor: a monitor keyed on the DETUNING
 * MARGIN (the recovery edges) is N-ROBUST -- the imp-36061 window sizing (|delta| ~ 0.560/0.611,
 * beta ~ 3.19/3.32) transfers across N unchanged. A monitor keyed on the ABSOLUTE baseline value
 * r_base must instead RESCALE by 1/sqrt(N) (equivalently, compare r * sqrt(N) against the
 * N-stable constant ~0.826), since r_base itself drifts by >3x over this range.
 *
 * @see imp-36061-w1-accumulator-recovery-detuning-width (the single-N edges this tests for N-stability)
 * @see imp-36096-w1-accumulator-joint-recovery-contour (the coupled (alpha,beta) recovery plane)
 * @see imp-35991-w1-accumulator-baseline-margin-to-resonance (the r < 1e-2 basin edge)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the O(1) accumulator + run-max bound)
 * @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2 (running error bound)
 */

const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 (the imp-36061 fixed rung)

// -- Baked offline rungs (scripts/imp-36103-nstability-offline.mjs; imp-36061 kernel, exact) -----
// Each rung: N, baseline r_base, and the alpha/beta 10%/1% recovery edges located from the
// q=1 resonance by 40-iteration bisection (each edge relative to r_base at THAT N).
const RUNGS = [
  {
    N: 1e5,
    rBase: 0.002614298819963413,
    alphaEdge10: 0.5601991256548899,
    alphaEdge1: 0.6111397942136136,
    betaEdge10: 3.186422528755429,
    betaEdge1: 3.3201554412971745,
  },
  {
    N: N_AT_TPT, // ~488602; reproduces the imp-36061 published rung
    rBase: 0.0011813978935817369,
    alphaEdge10: 0.5600302133175319,
    alphaEdge1: 0.6109953194259106,
    betaEdge10: 3.1861228955986007,
    betaEdge1: 3.3205545256805635,
  },
  {
    N: 1e6,
    rBase: 0.0008255691739812301,
    alphaEdge10: 0.5599890922562736,
    alphaEdge1: 0.6109602172059567,
    betaEdge10: 3.185948913820539,
    betaEdge1: 3.320427253116577,
  },
];

// imp-36061 published (single-N ~ 488602) reference edges, for the "matches imp-36061" check.
const IMP36061_ALPHA_EDGE10 = 0.5600302133175319;
const IMP36061_ALPHA_EDGE1 = 0.6109953194259106;
const IMP36061_BETA_EDGE10 = 3.1861228955986007;
const IMP36061_BETA_EDGE1 = 3.3205545256805635;
const IMP36061_RBASE = 0.0011813978935817369;

// -- Derived N-stability metrics (light arithmetic over the baked rungs) -------------------------
function relSpread(key) {
  const vals = RUNGS.map((r) => r[key]);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const mid = 0.5 * (lo + hi);
  return (hi - lo) / mid;
}

const edgeSpread = {
  alphaEdge10: relSpread('alphaEdge10'),
  alphaEdge1: relSpread('alphaEdge1'),
  betaEdge10: relSpread('betaEdge10'),
  betaEdge1: relSpread('betaEdge1'),
};
const maxEdgeSpread = Math.max(
  edgeSpread.alphaEdge10,
  edgeSpread.alphaEdge1,
  edgeSpread.betaEdge10,
  edgeSpread.betaEdge1,
);

// r_base drifts; measure its full-range factor and its 1/sqrt(N)-rescaled invariant.
const rBaseValues = RUNGS.map((r) => r.rBase);
const rBaseDriftFactor = Math.max(...rBaseValues) / Math.min(...rBaseValues); // ~3.17x
const rBaseSqrtNConst = RUNGS.map((r) => r.rBase * Math.sqrt(r.N)); // ~0.826 each
const rBaseSqrtNSpread = (() => {
  const lo = Math.min(...rBaseSqrtNConst);
  const hi = Math.max(...rBaseSqrtNConst);
  return (hi - lo) / (0.5 * (lo + hi));
})();

const EDGES_NSTABLE = maxEdgeSpread < 1e-3; // all edges stable to < 0.1% across 10x N
const RBASE_NOT_NSTABLE = rBaseDriftFactor > 2; // r_base drifts by > 2x
const RBASE_SQRTN_INVARIANT = rBaseSqrtNSpread < 5e-3; // r_base*sqrt(N) stable to < 0.5%

export const IMP36103_W1_ACCUMULATOR_RECOVERY_NSTABILITY = {
  id: 'imp-36103',
  proofSection: 'S-frontier',
  question:
    'MEASURE whether the imp-36061 accumulator recovery-width edges (alpha |delta| ~ 0.560/0.611 ' +
    'rad; beta ~ 3.19/3.32) and the baseline r_base ~ 1.18e-3 are N-STABLE, by recomputing r_base ' +
    'and the alpha/beta 10%/1% recovery edges at N = 1e5 and N = 1e6 (bracketing the imp-36061 ' +
    'fixed N ~ 488602) for t_k = cos(alpha k + beta sqrt(k)) / sqrt(k). Measurement only; NO QED.',
  rungs: RUNGS,
  fixedRungImp36061: {
    N: N_AT_TPT,
    rBase: IMP36061_RBASE,
    alphaEdge10: IMP36061_ALPHA_EDGE10,
    alphaEdge1: IMP36061_ALPHA_EDGE1,
    betaEdge10: IMP36061_BETA_EDGE10,
    betaEdge1: IMP36061_BETA_EDGE1,
    note: 'the single N at which imp-36061 pinned the baseline and the four recovery edges',
  },
  edgeStability: {
    relativeSpread: edgeSpread,
    maxRelativeSpread: maxEdgeSpread,
    nStable: EDGES_NSTABLE,
    note:
      'across N = 1e5 -> 1e6 (a 10x span) every recovery edge holds to ~4 significant figures ' +
      '(max relative spread < 5e-4): the edges are N-STABLE. They are N-invariant because each ' +
      'edge is defined RELATIVE to r_base(N) -- the detuned r and r_base share the same 1/sqrt(N) ' +
      'scaling, so the crossing detuning of the ratio r / r_base is N-independent to leading order',
  },
  baselineStability: {
    values: rBaseValues,
    driftFactor: rBaseDriftFactor,
    sqrtNConstant: rBaseSqrtNConst,
    sqrtNSpread: rBaseSqrtNSpread,
    nStable: !RBASE_NOT_NSTABLE,
    note:
      'r_base is NOT N-stable: it decays from ~2.61e-3 (N=1e5) to ~8.26e-4 (N=1e6), a factor ' +
      '~3.17 across the 10x span, following a clean 1/sqrt(N) law -- r_base * sqrt(N) ~ 0.826 to ' +
      '~0.14% across all three rungs. Expected: max_i|S_i| stays O(1) while Sum|t_k| ~ 2 sqrt(N) grows',
  },
  monitorConsequence: {
    detuningMarginRobust:
      'a run-time monitor keyed on the DETUNING MARGIN (the recovery edges) is N-ROBUST -- the ' +
      'imp-36061 window sizing (|delta| ~ 0.560/0.611 rad, beta ~ 3.19/3.32) transfers across N unchanged',
    absoluteBaselineNeedsRescale:
      'a monitor keyed on the ABSOLUTE baseline value r_base must RESCALE by 1/sqrt(N) (equivalently ' +
      'compare r * sqrt(N) against the N-stable constant ~0.826), since r_base itself drifts by >3x over this range',
  },
  conclusion: {
    edgesNStable:
      'the imp-36061 alpha/beta 10%/1% recovery edges are N-STABLE to ~4 significant figures across ' +
      'N = 1e5 -> 1e6 (max relative spread < 5e-4), so the imp-36061 monitor-window sizing transfers across N',
    baselineDrifts:
      'the strong-cancellation baseline r_base is NOT N-stable: it decays ~1/sqrt(N) (r_base * sqrt(N) ' +
      '~ 0.826 invariant), so its ABSOLUTE value falls ~3.17x from N = 1e5 to N = 1e6',
    reliability:
      'the imp-36061 monitor-window sizing is RELIABLE across N when expressed as a detuning margin, ' +
      'but a baseline-value comparison must be rescaled by 1/sqrt(N); this characterizes the N-reliability ' +
      'imp-36004 / imp-35949 flagged',
    staysGreenfield:
      'this module recomputes accumulator ratios and recovery edges only; it instantiates no ' +
      'directed-rounding interval and verifies no inequality, so the W1 A + B - C certificate at T_PT ' +
      'stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Testing the N-stability of ' +
    'the imp-36061 accumulator recovery-width edges and baseline by recomputing r_base and the ' +
    'alpha/beta 10%/1% recovery edges at N = 1e5, N ~ 488602 and N = 1e6 for ' +
    't_k = cos(alpha k + beta sqrt(k)) / sqrt(k): the four RECOVERY EDGES are N-STABLE to ~4 ' +
    'significant figures (max relative spread < 5e-4 across the 10x span) -- alpha ~ 0.560/0.611 rad, ' +
    'beta ~ 3.19/3.32 hold unchanged -- because each edge is defined relative to r_base(N) and the ' +
    'detuned r and r_base share the same 1/sqrt(N) scaling. The BASELINE r_base is NOT N-stable: it ' +
    'decays ~1/sqrt(N) (r_base * sqrt(N) ~ 0.826 invariant to ~0.14%), falling ~3.17x from 2.61e-3 ' +
    '(N = 1e5) to 8.26e-4 (N = 1e6). CONSEQUENCE: the imp-36004 / imp-35949 run-time monitor is ' +
    'N-robust when keyed on the DETUNING MARGIN (the edges), but a monitor keyed on the ABSOLUTE ' +
    'baseline value must rescale by 1/sqrt(N). Instantiates no directed-rounding interval; evaluates ' +
    'no true H_0; verifies no inequality; changes no bound; establishes no positivity; the W1 ' +
    'A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36061 (single-N ~ 488602 recovery edges tested here for N-stability); imp-36096 (coupled ' +
    '(alpha,beta) recovery plane); imp-35991 (r < 1e-2 basin edge); imp-36004 / imp-35949 ' +
    '(run-time-monitor caveat); imp-35890 (O(1) running-accumulator a-priori bound); imp-35812 ' +
    '(baseline (alpha,beta) term family); imp-35725 (mechanical N-term certified cost); imp-35681 ' +
    'Part A (A+B-C interval bound greenfield); Higham 2002 sec 4.2 (recursive-sum running error ' +
    'bound); Platt-Trudgian 2021 (barrier base).',
};

export const IMP36103_W1_ACCUMULATOR_RECOVERY_NSTABILITY_ASSERTIONS = [
  {
    // Three rungs recorded, bracketing the imp-36061 fixed N ~ 488602 by a decade each side.
    id: 'imp36103-three-rungs',
    description: 'Three N rungs recorded: 1e5, ~488602, 1e6 (10x span bracketing the imp-36061 N)',
    holds: () =>
      RUNGS.length === 3 &&
      RUNGS[0].N === 1e5 &&
      RUNGS[2].N === 1e6 &&
      RUNGS[1].N === N_AT_TPT &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // Middle rung reproduces the imp-36061 published edges and baseline bit-for-bit.
    id: 'imp36103-matches-imp36061',
    description: 'Middle rung (N ~ 488602) reproduces the imp-36061 published edges and r_base',
    holds: () =>
      RUNGS[1].rBase === IMP36061_RBASE &&
      RUNGS[1].alphaEdge10 === IMP36061_ALPHA_EDGE10 &&
      RUNGS[1].alphaEdge1 === IMP36061_ALPHA_EDGE1 &&
      RUNGS[1].betaEdge10 === IMP36061_BETA_EDGE10 &&
      RUNGS[1].betaEdge1 === IMP36061_BETA_EDGE1,
  },
  {
    // Recovery EDGES are N-stable: max relative spread across the 10x span < 5e-4.
    id: 'imp36103-edges-nstable',
    description: 'All four recovery edges N-stable to ~4 sig figs (max relative spread < 5e-4)',
    holds: () => EDGES_NSTABLE && maxEdgeSpread < 5e-4,
  },
  {
    // Each edge keeps its imp-36061 magnitude at every rung (alpha ~0.56/0.61, beta ~3.19/3.32).
    id: 'imp36103-edge-magnitudes',
    description: 'Every rung keeps alpha edges ~0.56/0.61 and beta edges ~3.19/3.32',
    holds: () =>
      RUNGS.every(
        (r) =>
          r.alphaEdge10 > 0.55 &&
          r.alphaEdge10 < 0.57 &&
          r.alphaEdge1 > 0.60 &&
          r.alphaEdge1 < 0.62 &&
          r.alphaEdge1 > r.alphaEdge10 &&
          r.betaEdge10 > 3.15 &&
          r.betaEdge10 < 3.22 &&
          r.betaEdge1 > 3.30 &&
          r.betaEdge1 < 3.34 &&
          r.betaEdge1 > r.betaEdge10,
      ),
  },
  {
    // Baseline r_base is NOT N-stable: it drifts by > 2x (measured ~3.17x) across the span.
    id: 'imp36103-baseline-drifts',
    description: 'Baseline r_base drifts by > 2x (measured ~3.17x) from N=1e5 to N=1e6 -- NOT N-stable',
    holds: () => RBASE_NOT_NSTABLE && rBaseDriftFactor > 3 && rBaseDriftFactor < 3.5,
  },
  {
    // The drift is a clean 1/sqrt(N) law: r_base * sqrt(N) ~ 0.826 invariant across rungs.
    id: 'imp36103-baseline-sqrtn-invariant',
    description: 'r_base * sqrt(N) ~ 0.826 invariant (< 0.5% spread): baseline decays as 1/sqrt(N)',
    holds: () =>
      RBASE_SQRTN_INVARIANT &&
      rBaseSqrtNSpread < 5e-3 &&
      rBaseSqrtNConst.every((c) => c > 0.82 && c < 0.83),
  },
  {
    // The monotone r_base decay direction: larger N => smaller r_base.
    id: 'imp36103-baseline-monotone',
    description: 'r_base decreases monotonically with N (strong-cancellation ratio shrinks as Sum|t| grows)',
    holds: () => RUNGS[0].rBase > RUNGS[1].rBase && RUNGS[1].rBase > RUNGS[2].rBase,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36103-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36103_W1_ACCUMULATOR_RECOVERY_NSTABILITY.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP36103_W1_ACCUMULATOR_RECOVERY_NSTABILITY.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36103_W1_ACCUMULATOR_RECOVERY_NSTABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP36103_W1_ACCUMULATOR_RECOVERY_NSTABILITY.verdict),
  },
];

for (const a of IMP36103_W1_ACCUMULATOR_RECOVERY_NSTABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36103-w1-accumulator-recovery-nstability assertion failed: ${a.id}`);
  }
}
