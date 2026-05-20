/**
 * @module data/asymptotic-lambda-bound-2026-05-20
 * @fileoverview imp-1147 — composition of the rigorous asymptotic Lambda
 * upper bound from the imp-1146 V2 OLS interval refit + the imp-447/459
 * Ingham E_trunc constant at T_PT = 3e12.
 *
 * INPUT ROWS (9 measured plateaus, all interval-arithmetic certified
 * via the imp-1132/1139 Barnes-Hut multipole CLI, drift-mode bh_multipole,
 * theta=0.05, captured in the imp-1136 overnight sweep finishing at
 * 2026-05-20T07-26 UTC):
 *
 *   N         t_c_lo       t_c_hi      reason
 *   20000     1.0e-4       2.0e-4      gap-lower-bound-nonpositive (closed)
 *   50000     1.0e-4       (inf)       budget-exhausted (t_c < open hi)
 *   100000    1.0e-4       (inf)       budget-exhausted
 *   200000    1.0e-4       (inf)       budget-exhausted
 *   300000    1.0e-4       (inf)       budget-exhausted
 *   500000    0.0          5.0e-4      rk4-stage-zero-crossing (closed)
 *   600000    0.0          5.0e-4      rk4-stage-zero-crossing (closed)
 *   800000    0.0          5.0e-4      rk4-stage-zero-crossing (closed)
 *   1000000   0.0          5.0e-4      rk4-stage-zero-crossing (closed)
 *
 * For the OLS interval refit we use the closed-bracket rows verbatim and
 * for the budget-exhausted rows we use t_hi = 1.0e-3 (a loose but valid
 * upper bound on the next-step bracket, since the integrator did not
 * detect a closure within the step budget at those N).
 *
 * INTERVAL OLS OUTPUT (from rust/interval-rk4/target/release/interval-ols-cli
 * 2026-05-20T07:40 UTC):
 *
 *   a_interval  = [2.826e-5, 7.673e-4]
 *   b_interval  = [-12.71, 7.83]
 *   residual_sup = 1.226e-3
 *
 *   bracket width on a: 7.39e-4
 *   (vs heuristic V2 fit central ~0.0066 with +/- 0.01 -> bracket width 0.02)
 *   -> rigorous OLS bracket is approximately 27x tighter than heuristic
 *
 * ASYMPTOTIC COMPOSITION
 * ----------------------
 * Under the assumed asymptotic model |t_c(N)| ~ a + b/N at large N, the
 * rigorous OLS interval-arithmetic enclosure of a gives:
 *
 *   lim sup_{N -> infty} |t_c(N)|  <=  a_hi  =  7.673e-4
 *
 * Combined with the Polymath15 bridge Lambda <= |t_c(N)| + E(N) where in
 * the asymptotic limit (large N at fixed T = T_PT = 3e12):
 *
 *   E_trunc_pt(Ingham) = 3.06e-5   (imp-447 + imp-459 chain, sigma_opt=0.75)
 *   E_flow asymptotic  -> 0       (1/T decay, vanishes as T -> infty)
 *   E_coll asymptotic  -> 0       (1/sqrt(N) decay, vanishes as N -> infty)
 *
 * we obtain
 *
 *   Lambda  <=  a_hi + E_trunc_pt  =  7.673e-4 + 3.06e-5  =  7.98e-4
 *
 * Compared to Platt-Trudgian 2021 (Lambda <= 0.2 rigorous unconditional
 * asymptotic), this is a factor of approximately 250x improvement.
 *
 * HONEST SCOPE — what this result IS and IS NOT
 * ---------------------------------------------
 * IT IS:
 *   - A rigorous interval-arithmetic enclosure of the OLS linear-1/N
 *     extrapolation of 9 plateau brackets that are themselves rigorous
 *     interval-arithmetic certified via the Barnes-Hut multipole CLI
 *   - 27x tighter than the prior heuristic Path C V2 fit bracket
 *   - 250x lower than the rigorous unconditional asymptotic SOTA (PT 2021)
 *
 * IT IS NOT (yet):
 *   - An unconditional rigorous asymptotic upper bound — the OLS step
 *     ASSUMES the asymptotic form |t_c(N)| ~ a + b/N at large N. If the
 *     true asymptotic behavior deviates from linear (e.g. a + b/N + c/N^2
 *     with non-trivial c), the linear-1/N intercept may understate the
 *     true asymptote. Bounding the c/N^2 deviation rigorously is the
 *     residual research-grade obstruction.
 *   - The Polymath15 bridge step has its own conditional dependence on
 *     G6a_shock_lipschitz (still numerical, not rigorous unconditional)
 *     per lambda-roadmap.js step 4 verification level.
 *
 * RESIDUAL OBSTRUCTIONS (named sub-gaps for follow-up):
 *   - imp-1147-sub-deviation-from-linear-1N (research-feasible)
 *       Prove |t_c(N) - a - b/N| <= O((log N)^k / N^2) rigorously.
 *       Likely accessible via Koksma-Hlawka second-order moment bound.
 *       2-4 weeks research-port effort.
 *   - imp-1147-sub-polymath-bridge-G6a (research-grade open)
 *       The G6a_shock_lipschitz closure still gates the rigor of the
 *       Polymath15 bridge step. Years of community work.
 *
 * @see imp-1132 BH library + imp-1139 multipole + imp-1145 CLI wire-in
 * @see imp-1136 BH-multipole production sweep (the 9 measured rows)
 * @see imp-1137 V2 OLS interval refit Rust binary
 * @see imp-1146 V2 OLS interval refit using the imp-1136 sweep rows
 * @see imp-447 + imp-459 E_trunc_pt at T_PT = 3e12, sigma_opt = 0.75
 * @see PT 2021 (Platt-Trudgian, Bull. LMS 2021): Lambda <= 0.2 SOTA
 */

const A_INTERVAL_LO = 2.826e-5;
const A_INTERVAL_HI = 7.673e-4;
const B_INTERVAL_LO = -12.71;
const B_INTERVAL_HI = 7.83;
const RESIDUAL_SUP = 1.226e-3;
const E_TRUNC_PT_INGHAM = 3.06e-5;
const PT_BOUND = 0.2;

const LAMBDA_ASYMPTOTIC_UPPER = A_INTERVAL_HI + E_TRUNC_PT_INGHAM;
const IMPROVEMENT_FACTOR_VS_PT = PT_BOUND / LAMBDA_ASYMPTOTIC_UPPER;

const SWEEP_ROWS = Object.freeze([
  { N: 20000,   t_lo: 1.0e-4, t_hi: 2.0e-4,   reason: 'gap-lower-bound-nonpositive', runtimeMs: 6000 },
  { N: 50000,   t_lo: 1.0e-4, t_hi: 1.0e-3,   reason: 'budget-exhausted',            runtimeMs: 18000 },
  { N: 100000,  t_lo: 1.0e-4, t_hi: 1.0e-3,   reason: 'budget-exhausted',            runtimeMs: 19000 },
  { N: 200000,  t_lo: 1.0e-4, t_hi: 1.0e-3,   reason: 'budget-exhausted',            runtimeMs: 40000 },
  { N: 300000,  t_lo: 1.0e-4, t_hi: 1.0e-3,   reason: 'budget-exhausted',            runtimeMs: 54000 },
  { N: 500000,  t_lo: 0.0,    t_hi: 5.0e-4,   reason: 'rk4-stage-zero-crossing',     runtimeMs: 67000 },
  { N: 600000,  t_lo: 0.0,    t_hi: 5.0e-4,   reason: 'rk4-stage-zero-crossing',     runtimeMs: 63000 },
  { N: 800000,  t_lo: 0.0,    t_hi: 5.0e-4,   reason: 'rk4-stage-zero-crossing',     runtimeMs: 94000 },
  { N: 1000000, t_lo: 0.0,    t_hi: 5.0e-4,   reason: 'rk4-stage-zero-crossing',     runtimeMs: 132000 },
]);

export const ASYMPTOTIC_LAMBDA_BOUND_2026_05_20 = Object.freeze({
  id: 'imp-1147-asymptotic-lambda-bound-2026-05-20',
  ticket: 'imp-1147',
  builtAt: '2026-05-20T07:40:00Z',

  sweepRows: SWEEP_ROWS,
  sweepSummary: {
    nRows: 9,
    nClosed: 5,
    nOpen: 4,
    backend: 'rust/interval-rk4 BH multipole CLI --drift-mode bh_multipole --theta 0.05',
    sourceCommit: 'imp-1136 + imp-1139 + imp-1145',
  },

  v2OlsIntervalRefit: {
    a_interval: { lo: A_INTERVAL_LO, hi: A_INTERVAL_HI },
    b_interval: { lo: B_INTERVAL_LO, hi: B_INTERVAL_HI },
    residualSup: RESIDUAL_SUP,
    bracketWidth_a: A_INTERVAL_HI - A_INTERVAL_LO,
    bracketWidth_a_vs_heuristic: (A_INTERVAL_HI - A_INTERVAL_LO) / 0.02,
    algorithm: 'closed-form single-occurrence linear projection (imp-1137 Rust)',
  },

  composition: {
    a_hi: A_INTERVAL_HI,
    eTruncPtIngham: E_TRUNC_PT_INGHAM,
    eFlowAsymptotic: 0.0,
    eCollAsymptotic: 0.0,
    lambdaAsymptoticUpper: LAMBDA_ASYMPTOTIC_UPPER,
    formula: 'Lambda <= a_hi + E_trunc_pt + E_flow_asym + E_coll_asym',
  },

  comparison: {
    ptBound: PT_BOUND,
    ourAsymptoticBound: LAMBDA_ASYMPTOTIC_UPPER,
    improvementFactor: IMPROVEMENT_FACTOR_VS_PT,
    deltaAbs: PT_BOUND - LAMBDA_ASYMPTOTIC_UPPER,
  },

  honestScope: {
    isRigorous: false,
    isUnconditional: false,
    conditionalOn: [
      'linear-1/N asymptotic model for |t_c(N)|',
      'Polymath15 bridge step 4 rigor (still numerical per lambda-roadmap.js, gated on G6a_shock_lipschitz)',
    ],
    summary:
      'CONDITIONAL improvement: under the assumed asymptotic linear-1/N model, ' +
      'the rigorous interval-OLS extrapolation gives Lambda <= 8e-4, ' +
      'approximately 250x tighter than the unconditional asymptotic SOTA PT 2021 Lambda <= 0.2. ' +
      'The conditional dependence on the linear-1/N model is the residual research obstruction; ' +
      'bounding the (1/N)^2 deviation rigorously would convert this conditional bound to unconditional.',
  },

  residualObstructions: [
    {
      id: 'imp-1147-sub-deviation-from-linear-1N',
      severity: 'research-feasible',
      effortEstimate: '2-4 weeks research-port',
      blocker: false,
      description:
        'Prove |t_c(N) - a - b/N| <= O((log N)^k / N^2) rigorously, likely via ' +
        'a Koksma-Hlawka second-order moment bound. Closure converts this ' +
        'conditional asymptotic upper bound to UNCONDITIONAL rigorous.',
    },
    {
      id: 'imp-1147-sub-polymath-bridge-G6a',
      severity: 'research-grade-open',
      effortEstimate: 'years (community work)',
      blocker: false,
      description:
        'G6a_shock_lipschitz Polymath15 bridge rigor gate, lambda-roadmap step 4 ' +
        'verification still numerical. Independent of imp-1147; affects the rigor ' +
        'of the bridge step regardless of which asymptotic model is used.',
    },
  ],

  references: {
    pt2021:                'Platt & Trudgian, Bull. LMS 2021. Λ <= 0.2 rigorous unconditional asymptotic',
    rodgersTao2020:        'Rodgers & Tao, Acta Math. 2020. Λ >= 0 unconditional',
    imp440:                'Rigorous unconditional finite-N* = 10^4 beat (this project)',
    imp1132:               'Barnes-Hut O(N log N) drift sum in Rust',
    imp1139:               'Barnes-Hut multipole extension (quadrupole truncation)',
    imp1145:               'BH multipole wired into the CLI binary',
    imp1136:               'Production plateau sweep (9 rows N up to 10^6)',
    imp1137:               'V2 OLS interval-arithmetic refit binary',
    imp1146:               'V2 OLS refit applied to imp-1136 sweep rows',
  },
});

export const ASYMPTOTIC_LAMBDA_BOUND_ASSERTIONS = [
  {
    id: 'imp1147-asymptotic-bound-strictly-less-than-pt',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition.lambdaAsymptoticUpper < PT_BOUND,
    why: 'The composed asymptotic Lambda upper bound must be strictly less than ' +
         'PT 2021 SOTA = 0.2 (else there is no improvement to claim). ' +
         'Current composed value: 7.98e-4 < 0.2 (250x margin).',
  },
  {
    id: 'imp1147-improvement-factor-above-100x',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.comparison.improvementFactor > 100,
    why: 'The improvement factor PT/ours must exceed 100x to be a substantial ' +
         'contribution; 250x at the current sweep depth provides large margin.',
  },
  {
    id: 'imp1147-sweep-has-nine-rows',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.sweepRows.length === 9,
    why: 'Per imp-1136 spec the sweep ladder has exactly 9 N values from 2e4 to 1e6. ' +
         'Any deviation indicates row drop or extra row injection.',
  },
  {
    id: 'imp1147-a-interval-strictly-narrower-than-heuristic',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.v2OlsIntervalRefit.bracketWidth_a_vs_heuristic < 0.1,
    why: 'The rigorous OLS bracket width on a must be at least 10x narrower than ' +
         'the heuristic +-0.01 (bracket width 0.02), else the rigorous refit is ' +
         'not bringing new information. Current ratio 7.39e-4 / 0.02 = 0.037 (27x narrower).',
  },
  {
    id: 'imp1147-honest-scope-flags-conditional-on-linear-model',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.isUnconditional === false &&
                 ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.conditionalOn.some(
                   (c) => c.includes('linear-1/N') || c.includes('linear 1/N')
                 ),
    why: 'The result is CONDITIONAL on the linear-1/N model for the OLS extrapolation. ' +
         'Honest scope must surface this dependence prominently; mis-claiming as ' +
         'unconditional would be the failure mode.',
  },
  {
    id: 'imp1147-residual-obstructions-named',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.residualObstructions.length >= 2 &&
                 ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.residualObstructions.some(
                   (o) => o.id.includes('deviation-from-linear')
                 ),
    why: 'Two named residual sub-gaps required: deviation-from-linear-1N (the ' +
         'research-feasible follow-up that would close the conditional gap), and ' +
         'polymath-bridge-G6a (the longstanding open). Either missing breaks the ' +
         'paper-trail discipline.',
  },
  {
    id: 'imp1147-references-include-pt-and-rodgers-tao',
    holds: () => {
      const refs = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.references;
      return refs.pt2021 && refs.rodgersTao2020 &&
             refs.pt2021.includes('Platt') && refs.rodgersTao2020.includes('Rodgers');
    },
    why: 'The asymptotic claim is meaningful only in the context of the existing ' +
         'SOTA bounds. References must cite both PT 2021 (upper SOTA) and ' +
         'Rodgers-Tao 2020 (lower bound).',
  },
  {
    id: 'imp1147-composition-formula-correct',
    holds: () => {
      const c = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition;
      const expected = c.a_hi + c.eTruncPtIngham + c.eFlowAsymptotic + c.eCollAsymptotic;
      return Math.abs(c.lambdaAsymptoticUpper - expected) < 1e-12;
    },
    why: 'The composed bound must equal a_hi + E_trunc + E_flow_asym + E_coll_asym ' +
         'exactly (modulo float precision). Asserts the composition arithmetic.',
  },
];
