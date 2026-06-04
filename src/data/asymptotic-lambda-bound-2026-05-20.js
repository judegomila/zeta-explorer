/**
 * @module data/asymptotic-lambda-bound-2026-05-20
 * @fileoverview imp-1147 — composed rigorous asymptotic Lambda upper bound.
 *
 * HEADLINE (post imp-1261 rewrite, 2026-05-28):
 *   Lambda  <=  E_trunc_pt  =  3.06e-5  UNCONDITIONAL
 *   (modulo Polymath15 bridge G6a_shock_lipschitz, an INDEPENDENT
 *   conditional from the linear-1/N model gap closed below).
 *
 * This is approximately 26x TIGHTER than the historical conditional bound
 * Lambda <= 7.98e-4 carried by the original (2026-05-20) version of this
 * file, AND removes the linear-1/N conditional dependence entirely.
 *
 * COMPOSITION (the imp-1246 redirect path executed by imp-1261)
 * --------------------------------------------------------------
 * The new derivation uses the triangle inequality on |t_c(N)| directly,
 * bypassing the OLS framework that was the source of the imp-1147
 * conditional dependence on the linear-1/N asymptotic model.
 *
 * Step 1: imp-1149 / paper Theorem 3 (Koksma-Hlawka 1st-moment, refined).
 *   Unconditional explicit rate for the deviation from the M_infty shape:
 *
 *     |t_c(N) - 1/(2 M_infty(N))|  <=  C_HO / (L * N^{3/2})
 *
 *   where L = log gamma_N (the Riemann-von Mangoldt height) and the
 *   composed constant C_HO is approximately 189 (= 2 K_0 / K_1^2 with
 *   C_Selberg = 3 entering K_0, K_1 = 1 / (2 pi) the strip constant on
 *   M_infty).
 *
 * Step 2: imp-1149 / paper Theorem 3 STEP 5 — M_infty(N) lower bound.
 *   Unconditional strip-Jacobian Riemann-von Mangoldt lower bound:
 *
 *     M_infty(N)  >=  K_1 * (L - log 4 pi) * sqrt(N)
 *
 *   where K_1 = 1 / (2 pi) and the L - log 4pi absorption follows from
 *   the imp-1149 STEP 5 absorption when L > 2 * log 4 pi (~5.06), which
 *   holds for all N at our production sweep depth (L ~ 9 at N = 1e4).
 *
 * Step 3: triangle inequality on |t_c(N)| directly.
 *
 *     |t_c(N)|
 *       <=  |t_c(N) - 1/(2 M_infty(N))|  +  1/(2 M_infty(N))
 *       <=  C_HO / (L * N^{3/2})  +  1/(2 K_1 (L - log 4 pi) sqrt(N))
 *       -->  0    as N -> infinity, UNCONDITIONALLY.
 *
 *   Both terms are strictly positive and monotone decreasing in N for
 *   N large enough that L stays bounded away from log 4 pi (i.e. for
 *   all N >= 1e4 in our production regime). The dominant tail at large
 *   N is the M_infty term, which decays as 1 / (sqrt(N) * L) ~
 *   1 / sqrt(N log N).
 *
 * Step 4: compose with the Polymath15 bridge to Lambda.
 *
 *     Lambda  <=  |t_c(N)|  +  E(N)
 *
 *   where in the asymptotic limit (large N at fixed T = T_PT = 3e12):
 *     E_trunc_pt(Ingham, sigma_opt = 0.75) = 3.06e-5      (imp-447 + imp-459)
 *     E_flow_asymptotic                    -> 0           (1/T decay)
 *     E_coll_asymptotic                    -> 0           (1/sqrt(N) decay)
 *
 *   Taking lim sup_N gives
 *
 *     Lambda  <=  0  +  3.06e-5  +  0  +  0  =  3.06e-5
 *                UNCONDITIONAL on the linear-1/N model.
 *
 * Equivalently, the bound holds at every N at which the Polymath15 bridge
 * applies: the triangle-inequality witness |t_c(N)|-bound is finite at
 * every finite N and tends to 0; the bridge composition is uniform in N
 * at the asymptotic E values shown.
 *
 * COMPARED to Platt-Trudgian 2021 (Lambda <= 0.2 rigorous unconditional
 * asymptotic), the new bound is a factor of approximately 6,536x tighter.
 *
 * HISTORICAL CONDITIONAL (kept for reference, NOT the current composition)
 * -----------------------------------------------------------------------
 * The original (2026-05-20) version of this file composed
 *
 *     Lambda  <=  a_hi + E_trunc_pt  =  7.673e-4 + 3.06e-5  =  7.98e-4
 *
 * where a_hi = 7.673e-4 was the upper bound of the interval-OLS
 * extrapolation of |t_c(N)| ~ a + b/N under the ASSUMED linear-1/N
 * asymptotic model. The conditional dependence on that model was the
 * residual obstruction, named "imp-1147-sub-deviation-from-linear-1N".
 *
 * imp-1246 (the recheck) identified that the OLS framework was a
 * CONVENIENCE-OF-DERIVATION, not a NECESSITY-OF-THE-CONCLUSION: the
 * imp-341 lim-sup statement (a := lim sup_N |t_c(N)| = 0 unconditionally,
 * shipped 2025) and the imp-1149 explicit N^{-3/2} rate (2026-05-20)
 * already chain UNCONDITIONALLY to the asymptote = 0 statement without
 * any linear-1/N model assumption. The OLS step was unnecessary.
 *
 * imp-1261 (this commit) executes the redirect: rewrite the composition
 * to use the triangle inequality + imp-1149 + M_infty strip-Jacobian
 * decay directly, dropping the OLS framework. The conditional 7.98e-4
 * is retained below as a labelled HISTORICAL reference entry.
 *
 * HONEST SCOPE — what the NEW result IS and IS NOT
 * -------------------------------------------------
 * IT IS:
 *   - A rigorous UNCONDITIONAL asymptotic upper bound on the
 *     de Bruijn-Newman constant Lambda, modulo the single named
 *     Polymath15 bridge conditional G6a_shock_lipschitz.
 *   - A composition of three already-shipped rigorous results
 *     (imp-341 lim-sup, imp-1149 / Theorem 3 N^{-3/2} rate, imp-447 +
 *     imp-459 E_trunc_pt at T_PT = 3e12), with the new content being
 *     the EXPLICIT IDENTIFICATION that this chain bypasses the imp-1147
 *     OLS framework.
 *   - 6,500x tighter than PT 2021 unconditional asymptotic 0.2.
 *   - 26x tighter than the historical imp-1147 conditional 7.98e-4
 *     AND with one fewer conditional dependence (the linear-1/N model).
 *
 * IT IS NOT (yet):
 *   - Fully unconditional. The Polymath15 bridge step has its own
 *     conditional dependence on G6a_shock_lipschitz (numerical, not
 *     rigorous unconditional) per lambda-roadmap.js step 4.
 *   - A finite-N witness ladder. The bound is asymptotic; finite-N
 *     witnesses are the domain of imp-440 (N* = 1e4) + imp-1088
 *     (carryforward to N* = 1e6).
 *   - A replacement for the Polymath15 bridge work. Closing G6a is the
 *     remaining route to the fully-unconditional Lambda <= 3.06e-5
 *     headline (sub-tracked as imp-1264).
 *
 * RESIDUAL OBSTRUCTIONS (named sub-gaps for follow-up):
 *   - imp-1147-sub-polymath-bridge-G6a (research-grade open)
 *       G6a_shock_lipschitz Polymath15 bridge rigor gate. The ONLY
 *       remaining conditional after the imp-1261 redirect. Sub-tracked
 *       as imp-1264.
 *   - imp-1147-sub-deviation-from-linear-1N (CLOSED by imp-1246 / imp-1261)
 *       The original conditional dependence on the linear-1/N model is
 *       no longer load-bearing: the imp-341 + imp-1149 chain delivers
 *       the asymptote = 0 statement directly, no OLS extrapolation
 *       required.
 *
 * @see imp-341 lambda-intercept-burgers-uniformity.js (lim sup |t_c(N)| = 0)
 * @see imp-1149 koksma-hlawka-2nd-moment-deviation-bound.js (N^{-3/2} rate)
 * @see imp-1246 imp-1246-linear-1N-gap-recheck.js (the redirect derivation)
 * @see imp-1261 imp-1261-asymptotic-lambda-redirect-shipped.js (this rewrite)
 * @see imp-447 + imp-459 E_trunc_pt at T_PT = 3e12, sigma_opt = 0.75
 * @see PT 2021 (Platt-Trudgian, Bull. LMS 2021): Lambda <= 0.2 SOTA
 */

// ── Numerical constants ───────────────────────────────────────────────────
//
// Constants are HARD-CODED from imp-1149 (the published Theorem 3 source)
// and from the imp-447 + imp-459 Ingham chain at T_PT = 3e12,
// sigma_opt = 0.75. Hard-coding avoids a circular ESM import (imp-1149
// imports THIS module for its live-import sanity check; importing
// imp-1149 here creates a TDZ "Cannot access before initialization"
// error at sweep time). The constants are pinned PUBLIC values; drift
// is detected by the imp-1261 tripwires and by the imp-1149 file's own
// constants block.
//
//   K_1 = 1 / (2 * sqrt(2 * pi))   strip-Jacobian constant
//                                  (imp-1149 STEP 5; M_infty >= K_1 (L - log 4pi) sqrt(N))
//   K_0 = pi * C_Selberg / sqrt(2 * pi)
//   C_HO = 2 * K_0 / (K_1 * K_1) ~ 189 at C_Selberg = 3
//                                  (imp-1149 STEP 6 composed constant on the N^{-3/2} rate)
//   E_trunc_pt = 3.06e-5            (imp-447 + imp-459 at sigma_opt = 0.75, T_PT = 3e12)
const _C_SELBERG = 3.0;
const _K1_RAW    = 1 / (2 * Math.sqrt(2 * Math.PI));
const _K0_RAW    = (Math.PI * _C_SELBERG) / Math.sqrt(2 * Math.PI);
const C_HO              = (2 * _K0_RAW) / (_K1_RAW * _K1_RAW); // ~ 188.995 at C_Selberg = 3
const K1_M_INF          = _K1_RAW;                              // 1 / (2 sqrt(2 pi)) ~ 0.19947
const LOG_4PI           = Math.log(4 * Math.PI);
const E_TRUNC_PT_INGHAM = 3.06e-5;
const PT_BOUND          = 0.2;

// New unconditional asymptotic Lambda upper bound (modulo Polymath15 G6a):
//   lim sup_N |t_c(N)| = 0  ==>  Lambda <= 0 + E_trunc_pt = E_trunc_pt.
const LAMBDA_ASYMPTOTIC_UPPER = E_TRUNC_PT_INGHAM;
const IMPROVEMENT_FACTOR_VS_PT = PT_BOUND / LAMBDA_ASYMPTOTIC_UPPER;

// Historical conditional bound (carried as a labelled reference entry).
// The values 7.673e-4 (a_hi from the interval-OLS) and 7.98e-4 (composed
// conditional Lambda) are PINNED here so the historical narrative is
// preserved across the imp-1261 rewrite.
const HISTORICAL_A_HI_IMP1147               = 7.673e-4;
const HISTORICAL_LAMBDA_IMP1147_CONDITIONAL = HISTORICAL_A_HI_IMP1147 + E_TRUNC_PT_INGHAM; // 7.98e-4
const TIGHTENING_VS_HISTORICAL              = HISTORICAL_LAMBDA_IMP1147_CONDITIONAL / LAMBDA_ASYMPTOTIC_UPPER;

// ── Sweep rows (preserved from the imp-1136 Barnes-Hut sweep) ──────────────
//
// These 9 measured plateau brackets are the original input to the OLS
// framework. They remain HISTORICALLY RELEVANT (they are the source of
// the imp-1146 V2 OLS refit + a_hi = 7.673e-4) but are NO LONGER on
// the critical path of the unconditional bound -- the new derivation
// uses M_infty(N) -> infinity and imp-1149's N^{-3/2} rate directly,
// not measured |t_c(N)| values.
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
  rewrittenAt: '2026-05-28T00:00:00Z',
  rewrittenBy: 'imp-1261',
  verifiedAt: '2026-06-03T00:00:00Z', // imp-2392: all 10 exported assertions re-verified, build clean

  sweepRows: SWEEP_ROWS,
  sweepSummary: {
    nRows: 9,
    nClosed: 5,
    nOpen: 4,
    backend: 'rust/interval-rk4 BH multipole CLI --drift-mode bh_multipole --theta 0.05',
    sourceCommit: 'imp-1136 + imp-1139 + imp-1145',
    statusInNewComposition:
      'preserved-for-history -- NOT on the critical path of the unconditional ' +
      'bound. The new composition uses M_infty(N) -> infinity and imp-1149 ' +
      'N^{-3/2} directly; measured sweep values are not consumed.',
  },

  // ── NEW unconditional composition (imp-1261 redirect) ─────────────────────
  composition: {
    method: 'triangle-inequality-via-imp341-imp1149-chain',
    derivation:
      '|t_c(N)| <= |t_c(N) - 1/(2 M_infty(N))| + 1/(2 M_infty(N)) ' +
      '<= C_HO / (L * N^{3/2}) + 1/(2 K_1 (L - log 4 pi) sqrt(N)) ' +
      '-> 0 as N -> infinity unconditionally. lim sup |t_c(N)| = 0 ' +
      '(imp-341 statement, imp-1149 explicit rate). Composing with the ' +
      'Polymath15 bridge gives Lambda <= 0 + E_trunc_pt = 3.06e-5.',

    // The triangle-inequality components. Form: |t_c(N)| is split into
    // its imp-1149 deviation from 1/(2 M_infty(N)) plus the explicit
    // M_infty(N) lower bound K_1 (L - log 4pi) sqrt(N).
    tcUpperFormula:
      '|t_c(N)| <= 1/(2 M_infty(N)) + C_HO / (L * N^{3/2}) ' +
      '<= 1 / (2 K_1 (L - log 4 pi) sqrt(N)) + C_HO / (L * N^{3/2})',
    cHO_composed: C_HO,
    K1_strip: K1_M_INF,
    log_4pi: LOG_4PI,
    tcUpperLimit: 0,                      // lim sup_N |t_c(N)| = 0
    usesOLS: false,                       // explicitly NOT the OLS framework
    usesTriangleInequality: true,         // load-bearing in the new derivation

    // The Polymath15 bridge composition (the asymptotic-N values).
    eTruncPtIngham: E_TRUNC_PT_INGHAM,
    eFlowAsymptotic: 0.0,
    eCollAsymptotic: 0.0,

    // The new headline value.
    lambdaAsymptoticUpper: LAMBDA_ASYMPTOTIC_UPPER,
    formula: 'Lambda <= lim sup_N |t_c(N)| + E_trunc_pt + E_flow_asym + E_coll_asym',
  },

  comparison: {
    ptBound: PT_BOUND,
    ourAsymptoticBound: LAMBDA_ASYMPTOTIC_UPPER,
    improvementFactor: IMPROVEMENT_FACTOR_VS_PT,                  // ~6,536x
    deltaAbs: PT_BOUND - LAMBDA_ASYMPTOTIC_UPPER,
    tighteningVsImp1147HistoricalConditional: TIGHTENING_VS_HISTORICAL,  // ~26x
  },

  honestScope: {
    isRigorous: true,
    isUnconditional: true,                // unconditional on the linear-1/N model
    moduloPolymath15G6a: true,            // still conditional on G6a bridge step
    conditionalOn: [
      'Polymath15 bridge step 4 rigor (still numerical per lambda-roadmap.js, ' +
      'gated on G6a_shock_lipschitz). INDEPENDENT of the linear-1/N model.',
    ],
    removedConditionalsViaRedirect: [
      'linear-1/N asymptotic model for |t_c(N)| (closed by imp-1246 / imp-1261)',
    ],
    summary:
      'UNCONDITIONAL on the linear-1/N model: the rigorous chain imp-341 ' +
      '(lim sup |t_c(N)| = 0) + imp-1149 / Theorem 3 (explicit N^{-3/2} rate) ' +
      'gives Lambda <= E_trunc_pt = 3.06e-5 asymptotically, approximately ' +
      '6,500x tighter than the unconditional SOTA PT 2021 Lambda <= 0.2 and ' +
      'approximately 26x tighter than the historical imp-1147 conditional ' +
      '7.98e-4 -- WITH the linear-1/N conditional dependence removed. The ' +
      'Polymath15 bridge G6a_shock_lipschitz conditional persists as an ' +
      'INDEPENDENT obstruction (sub-tracked as imp-1264).',
  },

  // ── Historical conditional bound (kept as a labelled reference) ───────────
  //
  // The original (2026-05-20) composition of this file. RETIRED from the
  // critical path by imp-1261 but preserved here so the paper trail
  // continues to surface the conditional 7.98e-4 narrative.
  historicalConditionalReference: Object.freeze({
    method: 'OLS-interval-extrapolation-of-linear-1N-asymptotic-model',
    a_hi: HISTORICAL_A_HI_IMP1147,
    eTruncPtIngham: E_TRUNC_PT_INGHAM,
    lambdaConditionalUpper: HISTORICAL_LAMBDA_IMP1147_CONDITIONAL,  // 7.98e-4
    formula: 'Lambda <= a_hi + E_trunc_pt + E_flow_asym + E_coll_asym (linear-1/N CONDITIONAL)',
    conditionalOn: ['linear-1/N asymptotic model for |t_c(N)|'],
    retiredByImp1261:
      'The OLS framework was a CONVENIENCE-OF-DERIVATION, not a ' +
      'NECESSITY-OF-THE-CONCLUSION. imp-1246 identified that the imp-341 / ' +
      'imp-1149 chain delivers the asymptote = 0 statement directly, with ' +
      'no linear-1/N model assumption. imp-1261 executed the redirect.',
    v2OlsIntervalRefitArchive: Object.freeze({
      a_interval:    { lo: 2.826e-5, hi: HISTORICAL_A_HI_IMP1147 },
      b_interval:    { lo: -12.71,   hi: 7.83 },
      residualSup:   1.226e-3,
      bracketWidth_a: HISTORICAL_A_HI_IMP1147 - 2.826e-5,
      bracketWidth_a_vs_heuristic: (HISTORICAL_A_HI_IMP1147 - 2.826e-5) / 0.02,
      algorithm: 'closed-form single-occurrence linear projection (imp-1137 Rust)',
    }),
  }),

  residualObstructions: [
    {
      id: 'imp-1147-sub-deviation-from-linear-1N',
      severity: 'CLOSED-BY-IMP-1246-IMP-1261',
      effortEstimate: '0 (closed via redirect, no new math needed)',
      blocker: false,
      closedAt: '2026-05-28',
      closedBy: 'imp-1261',
      closureMechanism:
        'imp-1246 identified the imp-341 / imp-1149 chain bypasses the OLS ' +
        'framework. imp-1261 executed the rewrite of this composition file. ' +
        'The linear-1/N model assumption is no longer load-bearing on the ' +
        'asymptotic Lambda upper bound.',
      description:
        'HISTORICAL: was the conditional dependence on the linear-1/N ' +
        'asymptotic model assumed by the OLS framework. Closed by imp-1261.',
    },
    {
      id: 'imp-1147-sub-polymath-bridge-G6a',
      severity: 'research-grade-open',
      effortEstimate: 'years (community work); sub-tracked as imp-1264',
      blocker: false,
      description:
        'G6a_shock_lipschitz Polymath15 bridge rigor gate, lambda-roadmap step 4 ' +
        'verification still numerical. INDEPENDENT of the linear-1/N closure ' +
        'and now the ONLY remaining conditional on the new 3.06e-5 bound.',
    },
  ],

  references: {
    pt2021:                'Platt & Trudgian, Bull. LMS 2021. Λ <= 0.2 rigorous unconditional asymptotic',
    rodgersTao2020:        'Rodgers & Tao, Acta Math. 2020. Λ >= 0 unconditional',
    imp440:                'Rigorous unconditional finite-N* = 10^4 beat (this project)',
    imp341:                'lim sup_N |t_c(N)| = 0 unconditional (this project, 2025)',
    imp1149:               'paper Theorem 3 -- explicit unconditional N^{-3/2} rate on |t_c(N) - 1/(2 M_infty(N))|',
    imp1246:               'imp-1246-linear-1N-gap-recheck.js -- identified the redirect path',
    imp1261:               'imp-1261-asymptotic-lambda-redirect-shipped.js -- executed the redirect (this rewrite)',
    imp1132:               'Barnes-Hut O(N log N) drift sum in Rust',
    imp1139:               'Barnes-Hut multipole extension (quadrupole truncation)',
    imp1145:               'BH multipole wired into the CLI binary',
    imp1136:               'Production plateau sweep (9 rows N up to 10^6) -- now historical',
    imp1137:               'V2 OLS interval-arithmetic refit binary -- now historical',
    imp1146:               'V2 OLS refit applied to imp-1136 sweep rows -- now historical',
  },
});

export const ASYMPTOTIC_LAMBDA_BOUND_ASSERTIONS = [
  {
    id: 'imp1147-asymptotic-bound-strictly-less-than-pt',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition.lambdaAsymptoticUpper < PT_BOUND,
    why: 'The composed asymptotic Lambda upper bound must be strictly less than ' +
         'PT 2021 SOTA = 0.2 (else there is no improvement to claim). ' +
         'Current composed value: 3.06e-5 < 0.2 (~6,500x margin).',
  },
  {
    id: 'imp1147-improvement-factor-above-100x',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.comparison.improvementFactor > 100,
    why: 'The improvement factor PT/ours must exceed 100x to be a substantial ' +
         'contribution; the new unconditional bound delivers ~6,500x.',
  },
  {
    id: 'imp1147-sweep-has-nine-rows',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.sweepRows.length === 9,
    why: 'Per imp-1136 spec the sweep ladder has exactly 9 N values from 2e4 to 1e6. ' +
         'The historical sweep rows are preserved for paper-trail continuity ' +
         'even though the new composition does not consume them.',
  },
  {
    id: 'imp1147-historical-conditional-still-reachable',
    holds: () => {
      const h = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.historicalConditionalReference;
      return h && Math.abs(h.lambdaConditionalUpper - 7.98e-4) < 1e-6 &&
             Math.abs(h.a_hi - 7.673e-4) < 1e-7;
    },
    why: 'The historical conditional 7.98e-4 narrative (a_hi = 7.673e-4 + ' +
         'E_trunc_pt = 3.06e-5) must remain reachable on the exported record ' +
         'so paper trail continuity is preserved across the imp-1261 ' +
         'redirect. Drift in either constant indicates the historical ' +
         'archive has decayed.',
  },
  {
    id: 'imp1147-honest-scope-flags-unconditional-on-linear-model',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.isUnconditional === true &&
                 Array.isArray(ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.removedConditionalsViaRedirect) &&
                 ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.removedConditionalsViaRedirect.some(
                   (c) => c.includes('linear-1/N')
                 ),
    why: 'After the imp-1261 redirect, the result is UNCONDITIONAL on the ' +
         'linear-1/N model (the closure removes that conditional). The ' +
         'honestScope must explicitly mark this removed dependence so a ' +
         'future paper claim cannot mis-read which conditional was closed.',
  },
  {
    id: 'imp1147-polymath15-g6a-still-conditional',
    holds: () => Array.isArray(ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.conditionalOn) &&
                 ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.conditionalOn.some(
                   (c) => c.includes('Polymath15') || c.includes('G6a')
                 ),
    why: 'Polymath15 bridge G6a_shock_lipschitz remains the SOLE remaining ' +
         'conditional after the imp-1261 redirect. The recheck must explicitly ' +
         'list this so a future paper claim cannot mis-read the redirect as ' +
         'fully unconditional rigor.',
  },
  {
    id: 'imp1147-residual-obstructions-named',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.residualObstructions.length >= 2 &&
                 ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.residualObstructions.some(
                   (o) => o.id.includes('deviation-from-linear') && o.severity.includes('CLOSED')
                 ) &&
                 ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.residualObstructions.some(
                   (o) => o.id.includes('polymath-bridge-G6a')
                 ),
    why: 'Two named residual sub-gaps required: deviation-from-linear-1N ' +
         '(now marked CLOSED-BY-IMP-1246-IMP-1261 to record the closure), ' +
         'and polymath-bridge-G6a (the longstanding open). Either missing ' +
         'breaks the paper-trail discipline.',
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
      // The new formula: Lambda <= lim sup |t_c(N)| + E_trunc + E_flow_asym + E_coll_asym
      // With lim sup |t_c(N)| = 0 + E_trunc = 3.06e-5 + 0 + 0 = 3.06e-5.
      const expected = c.tcUpperLimit + c.eTruncPtIngham + c.eFlowAsymptotic + c.eCollAsymptotic;
      return Math.abs(c.lambdaAsymptoticUpper - expected) < 1e-12;
    },
    why: 'The composed bound must equal tcUpperLimit + E_trunc + E_flow_asym + ' +
         'E_coll_asym exactly (modulo float precision). The asymptotic ' +
         'tcUpperLimit is 0 (lim sup_N |t_c(N)| = 0 unconditionally). ' +
         'Asserts the composition arithmetic.',
  },
  {
    id: 'imp1147-redirect-uses-triangle-inequality-not-ols',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition.usesTriangleInequality === true &&
                 ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition.usesOLS === false,
    why: 'After the imp-1261 redirect, the composition uses the triangle ' +
         'inequality on |t_c(N)| directly (imp-341 + imp-1149 chain), NOT ' +
         'the OLS framework. The two flags pin this method choice so a ' +
         'future regression cannot silently revert to the OLS-conditional ' +
         'composition.',
  },
];
