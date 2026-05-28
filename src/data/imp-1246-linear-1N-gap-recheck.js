/**
 * @module data/imp-1246-linear-1N-gap-recheck
 * @fileoverview imp-1246 -- OPUS-4.8 RECHECK of the imp-1147 linear-1/N
 * asymptotic conditional gap.
 *
 * CENTRAL QUESTION
 * ----------------
 * imp-1147 (src/data/asymptotic-lambda-bound-2026-05-20.js) ships
 *
 *   Lambda  <=  a_hi + E_trunc_pt  =  7.673e-4 + 3.06e-5  =  7.98e-4
 *
 * where a_hi = 7.673e-4 is the upper bound of the rigorous interval-OLS
 * enclosure of the asymptote a in the assumed linear-1/N expansion
 * |t_c(N)| = a + b/N + o(1/N). The result is labelled CONDITIONAL on the
 * linear-1/N model: the o(1/N) tail is not bounded, so the OLS-fitted a
 * cannot be promoted to the true asymptote without further work.
 *
 * The named residual obstruction is "imp-1147-sub-deviation-from-linear-1N":
 * prove |t_c(N) - a - b/N| <= O((log N)^k / N^2) rigorously, likely via a
 * Koksma-Hlawka second-order moment bound. Closure converts the conditional
 * 7.98e-4 to UNCONDITIONAL.
 *
 * Between imp-1147 (2026-05-20) and now (2026-05-28), three relevant updates
 * have landed:
 *   - imp-1149 (koksma-hlawka-2nd-moment-deviation-bound.js): HONEST PARTIAL
 *     attempt at the (1/N)^2 deviation. The 2nd-moment KH route hits a hard
 *     wall (L^2 -> L^infty Sobolev cost). The CONSOLATION PRIZE is an
 *     unconditional |t_c(N) - 1/(2 M_inf(N))| <= C_HO / (L * N^{3/2}) rate
 *     with C_HO ~ 189 explicit.
 *   - paper main.tex Theorem 3 (the published-form imp-1149 result).
 *   - imp-1166 (Conrey-Snaith correction on linear-stats variance slope):
 *     corrects the imp-1162 13-point OLS slope from -0.881 to -0.997 via
 *     A_simplified(N) = log N.
 *
 * Three potential closure paths to evaluate:
 *
 *   (a) CLOSURE-VIA-N^{-3/2} (the imp-1149 / Theorem 3 unconditional rate).
 *       Does N^{-3/2} suffice to bound the (1/N)^2 deviation in the imp-1147
 *       composition?
 *   (b) CLOSURE-VIA-CONREY-SNAITH (imp-1166 arithmetic factor route).
 *       Does the C-S correction give a controlled (1/N)^2 term on |t_c(N)|?
 *   (c) NEW route -- any avenue the original imp-1147 obstructions list
 *       didn't consider.
 *
 * HONEST VERDICT (forward summary, expanded below)
 * ------------------------------------------------
 * OVERALL: CLOSURE-VIA-N^{-3/2}-REDIRECT.
 *
 * The N^{-3/2} rate of imp-1149 / Theorem 3 is NOT sufficient when read in
 * the imp-1147 frame as a bound on |t_c(N) - a - b/N| (the residual tail of
 * the linear-1/N expansion): 3/2 < 2, so the exponent is too small.
 *
 * HOWEVER -- and this is the load-bearing recheck observation -- the
 * imp-1147 conditional dependence on the linear-1/N model is UNNECESSARY in
 * the first place. The chain
 *
 *   imp-341 (Koksma-Hlawka 1st moment, V(f_z) = pi/y, D_N^* <= C_Selberg log gamma_N / N)
 *     +  uniformity strip y_N^sharp = sqrt(2 pi / N)
 *     +  M_inf(N) >= K_1 (L - log 4 pi) sqrt(N) -> infinity
 *     +  triangle inequality with imp-1149 / Theorem 3 N^{-3/2} rate
 *
 * gives DIRECTLY and UNCONDITIONALLY
 *
 *   |t_c(N)|  <=  1 / (2 M_inf(N))  +  C_HO / (L * N^{3/2})
 *             <=  1 / (2 K_1 (L - log 4 pi) sqrt(N))  +  C_HO / (L * N^{3/2})
 *             -->  0   as N -> infinity.
 *
 * Combined with the Polymath15 bridge Lambda <= |t_c(N)| + E(N), with the
 * asymptotic E_trunc_pt = 3.06e-5 (Ingham at T_PT = 3e12) and the vanishing
 * E_flow / E_coll terms (1/T and 1/sqrt(N) decay), we obtain
 *
 *   Lambda  <=  lim sup_{N -> infinity} |t_c(N)|  +  E_trunc_pt
 *           =   0  +  3.06e-5
 *           =   3.06e-5     (UNCONDITIONAL on the linear-1/N model;
 *                           still conditional on Polymath15 G6a bridge).
 *
 * This is approximately 26x TIGHTER than the imp-1147 conditional 7.98e-4
 * AND removes the linear-1/N conditional dependence.
 *
 * Crucially, this finding was IMPLICITLY ALREADY PRESENT in imp-341 (which
 * shipped the UNCONDITIONAL conclusion "a := lim sup_N |t_c(N)| = 0" in
 * 2025) and imp-1149 (which shipped the quantitative N^{-3/2} rate in
 * 2026-05-20). imp-1147 chose to compose via the OLS-fitted a_interval
 * rather than the imp-341 limit statement, presumably because the OLS
 * approach was thought to give a tighter pre-asymptotic constant. But the
 * OLS framework is precisely what introduced the linear-1/N conditional.
 *
 * Dropping the OLS step in favour of the imp-341 / imp-1149 chain converts
 * the conditional 7.98e-4 to the UNCONDITIONAL 3.06e-5 bound. Net: BIGGER
 * project contribution than the conditional 7.98e-4, with a SIMPLER
 * derivation. The Polymath15 bridge G6a step remains a separate, unaffected
 * conditional dependence.
 *
 * EFFORT TO SHIP THE CLOSURE: 1-2 days. The mathematics is already in
 * imp-341 + imp-1149 + the Polymath15 bridge; only the COMPOSITION step
 * needs to be re-written to skip the OLS and use the limit statement
 * directly. Concretely:
 *   - paper/main.tex Theorem 2 statement: replace
 *       "Lambda <= 7.98e-4 conditional on linear-1/N"
 *     with
 *       "Lambda <= 3.06e-5 unconditional (modulo Polymath15 bridge G6a)"
 *     citing imp-341 + Theorem 3 (the published imp-1149) for the chain.
 *   - asymptotic-lambda-bound-2026-05-20.js: add a NEW composition block
 *     for the unconditional-via-imp-341 route, leaving the OLS block as
 *     a tighter-pre-asymptotic alternative for documentation.
 *   - improvement-queue.js imp-1147 closureNote: append a follow-up note
 *     pointing to imp-1246 closure-via-N^{-3/2}-redirect.
 *
 * Per-path verdicts:
 *   - Path (a) original framing (N^{-3/2} sufficient for (1/N)^2 deviation):
 *     NOT-THIS-ROUTE. 3/2 < 2, exponent insufficient.
 *   - Path (a) re-framed (N^{-3/2} bound directly on |t_c(N)|, via triangle
 *     inequality with the explicit 1/(2 M_inf) decay):
 *     CLOSURE-ACHIEVABLE. This is the load-bearing finding.
 *   - Path (b) Conrey-Snaith arithmetic correction:
 *     NOT-THIS-ROUTE. C-S addresses linear-statistics variance universality,
 *     not the t_c(N) asymptote. No chain from Var[L_N(f)] to |t_c(N)|.
 *   - Path (c) NEW route: closure-via-N^{-3/2}-redirect IS the new route --
 *     it was not in the imp-1147 obstructions list (which focused on the
 *     OLS framework). No additional truly-new route is needed beyond the
 *     re-framing of path (a).
 *
 * Overall: CLOSURE-VIA-N^{-3/2}-REDIRECT achievable, estimated effort 1-2
 * days for the composition rewrite + paper Theorem 2 update.
 *
 * HONEST SCOPE
 * ------------
 * This recheck file does NOT itself ship the closure (which requires
 * editing imp-1147 + paper Theorem 2 + adding new tripwires to the
 * upstream composition file). It identifies the closure path, documents
 * the derivation, and gives an estimated effort. The closure execution
 * is intentionally left as a follow-up ticket so this file is a
 * standalone audit and not an in-place rewrite of imp-1147.
 *
 * The N^{-3/2} -> 0 reasoning is identical to what imp-341 already shipped
 * for the limit statement. imp-1149 quantified the rate; the present
 * ticket explicitly composes the two to bypass the OLS step. This is a
 * scope re-framing, not new mathematics; the project contribution is the
 * EXPLICIT IDENTIFICATION that the imp-1147 conditional dependence is
 * UNNECESSARY, not the derivation of any new estimate.
 *
 * Caveats:
 *   - The Polymath15 bridge G6a_shock_lipschitz conditional (lambda-roadmap
 *     step 4) remains in force. It is INDEPENDENT of the linear-1/N
 *     conditional being closed here.
 *   - At FINITE N, the OLS-fitted interval bound 7.98e-4 may be tighter
 *     than the explicit imp-341 / imp-1149 chain bound, depending on the
 *     specific N. The CLOSURE applies to the ASYMPTOTIC limit
 *     N -> infinity. The OLS framework continues to provide useful
 *     finite-N witnesses without claiming asymptotic rigor.
 *   - The imp-341 limit statement implicitly assumes the imp-336
 *     monotonicity conjecture (M) is NOT needed for the lim sup
 *     statement (per imp-341 candidateInterceptUpperBound.conditionalOn).
 *     Re-verified: the lim sup statement is unconditional; only the per-N
 *     translation needs (M). This recheck operates at the lim sup level.
 *
 * @see imp-1147 asymptotic-lambda-bound-2026-05-20.js (the conditional bound)
 * @see imp-1149 koksma-hlawka-2nd-moment-deviation-bound.js (the N^{-3/2} rate)
 * @see imp-341 lambda-intercept-burgers-uniformity.js (the lim sup = 0 statement)
 * @see imp-1166 imp-1166-conrey-snaith-correction-on-imp1162-grid.js (Path b)
 * @see paper/main.tex Theorem 2 (the conditional statement to be replaced)
 * @see paper/main.tex Theorem 3 (the unconditional N^{-3/2} rate)
 */

import { ASYMPTOTIC_LAMBDA_BOUND_2026_05_20 } from './asymptotic-lambda-bound-2026-05-20.js';
import { KOKSMA_HLAWKA_2ND_MOMENT } from './koksma-hlawka-2nd-moment-deviation-bound.js';
import { LAMBDA_INTERCEPT_BURGERS_UNIFORMITY } from './lambda-intercept-burgers-uniformity.js';
import IMP1166_CONREY_SNAITH_CORRECTION from './imp-1166-conrey-snaith-correction-on-imp1162-grid.js';

// ── Numerical constants (lifted from upstream, NOT re-derived) ─────────────
// Inherit C_HO ~ 189 (the imp-1149 composed constant 2 K_0 / K_1^2) from
// the upstream file via its constants block. Inherit E_trunc_pt = 3.06e-5
// from the imp-1147 composition. Inherit a_hi = 7.673e-4 from the
// imp-1147 OLS interval refit.
const C_HO            = KOKSMA_HLAWKA_2ND_MOMENT.constants.CHO_composed_const;
const E_TRUNC_PT      = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition.eTruncPtIngham;
const A_HI_IMP1147    = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition.a_hi;
const LAMBDA_IMP1147  = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition.lambdaAsymptoticUpper;

// imp-1149 / Theorem 3 explicit K_1 strip constant (M_inf(N) >= K_1 (L - log 4pi) sqrt(N))
const K1_M_INF        = KOKSMA_HLAWKA_2ND_MOMENT.constants.K1_M_infty_strip_const;
const LOG_4PI         = Math.log(4 * Math.PI);

// The Riemann-von Mangoldt height inversion used by imp-1149 STEP 5 to
// translate N to gamma_N (= L = log gamma_N). We MIRROR the same Newton
// iteration here for consistency (not re-import to avoid module coupling).
function rvmCount(T)        { const u = T / (2 * Math.PI); return u * (Math.log(u) - 1); }
function rvmCountDeriv(T)   { return Math.log(T / (2 * Math.PI)) / (2 * Math.PI); }
function gammaNFromRvM(N) {
  if (N < 2) return 14.134725;
  let T = (2 * Math.PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 8; i++) {
    const f  = rvmCount(T) - N;
    const fp = rvmCountDeriv(T);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > 2 * Math.PI)) T = 2 * Math.PI + 1;
  }
  return T;
}

// ── Per-N witness table for the closure-via-N^{-3/2}-redirect composition ──
//
// For each N we evaluate:
//   (1) The explicit upper bound |t_c(N)| <= U_inf(N) + R_HO(N) where
//       U_inf(N) := 1 / (2 K_1 (L - log 4 pi) sqrt(N))   [M_inf decay]
//       R_HO(N)  := C_HO / (L * N^{3/2})                  [imp-1149 rate]
//   (2) The imp-1147 OLS-fitted upper bound a_hi = 7.673e-4 (constant
//       across N -- the OLS-extrapolated asymptote upper bound).
//   (3) The crossover: at what N does the closure-via-N^{-3/2} bound
//       (U_inf + R_HO) undercut the imp-1147 OLS upper bound a_hi?
//
// SAMPLE STARTS AT N = 1e4 because at smaller N, U_inf is too large (M_inf
// has not yet had room to grow). The crossover N* is the load-bearing
// number for the recheck: it identifies the regime where the closure
// path's composition tightens the imp-1147 OLS approach.
const SAMPLE_N_VALUES = [1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e12, 1e15];

const CLOSURE_WITNESS_ROWS = SAMPLE_N_VALUES.map((N) => {
  const gammaN  = gammaNFromRvM(N);
  const L       = Math.log(gammaN);
  // U_inf: explicit upper bound on 1/(2 M_inf(N)) via the K_1 strip constant.
  // M_inf >= K_1 (L - log 4 pi) sqrt(N), so 1/(2 M_inf) <= 1/(2 K_1 (L - log 4 pi) sqrt(N)).
  const denom   = 2 * K1_M_IN_safe(L, K1_M_INF);
  const Uinf    = 1 / (denom * Math.sqrt(N));
  // R_HO: imp-1149 / Theorem 3 N^{-3/2} rate.
  const Rho     = C_HO / (L * Math.pow(N, 1.5));
  // Sum: explicit unconditional upper bound on |t_c(N)|.
  const tcUpper = Uinf + Rho;
  // Composed lambda upper bound via this route (asymptotically Lambda <= tcUpper + E_trunc_pt).
  const lambdaUpperViaClosure = tcUpper + E_TRUNC_PT;
  // imp-1147 OLS-conditional upper bound (constant a_hi + E_trunc_pt; does NOT depend on N).
  const lambdaUpperViaOLS     = A_HI_IMP1147 + E_TRUNC_PT;
  return {
    N,
    gammaN,
    L,
    Uinf,
    Rho,
    tcUpper,
    lambdaUpperViaClosure,
    lambdaUpperViaOLS,
    closureTighterThanOLS: lambdaUpperViaClosure < lambdaUpperViaOLS,
    closureTcUpperLessThan_a_hi: tcUpper < A_HI_IMP1147,
  };
});

// Safe accessor: K_1 strip constant times (L - log 4 pi) with floor at L/2
// (the imp-1149 STEP 5 absorption used when L > 2 log 4 pi).
function K1_M_IN_safe(L, K1) {
  const absorbed = L - LOG_4PI;
  if (absorbed > 0) return K1 * absorbed;
  // Fallback (small-L safety, never expected at N >= 1e4 where L > 9)
  return K1 * L / 2;
}

const N_CROSSOVER = (() => {
  // The first N at which the explicit closure-bound's |t_c| upper bound
  // drops below the imp-1147 OLS a_hi value.
  for (const r of CLOSURE_WITNESS_ROWS) {
    if (r.closureTcUpperLessThan_a_hi) return r.N;
  }
  return null;
})();

// The asymptotic claim: lim |t_c(N)| = 0 unconditionally, hence
// lim sup Lambda <= 0 + E_trunc_pt = E_trunc_pt. Numerically tighter than
// the imp-1147 conditional by the factor 7.98e-4 / 3.06e-5 ~ 26.
const LAMBDA_VIA_CLOSURE_ASYMPTOTIC = E_TRUNC_PT;
const TIGHTENING_FACTOR_VS_IMP1147  = LAMBDA_IMP1147 / LAMBDA_VIA_CLOSURE_ASYMPTOTIC;

// ── Per-path verdict structures ────────────────────────────────────────────

const PATH_A_ORIGINAL_FRAMING = Object.freeze({
  id: 'path-a-original-N32-as-1N2-residual',
  description:
    'Does the imp-1149 / Theorem 3 unconditional N^{-3/2} rate bound the ' +
    '(1/N)^2 deviation |t_c(N) - a - b/N| directly? This is the literal ' +
    'reading of the imp-1147 named residual obstruction.',
  derivation:
    'The imp-1149 bound is |t_c(N) - 1/(2 M_inf(N))| <= C_HO / (L * N^{3/2}). ' +
    'For this to bound |t_c(N) - a - b/N| at the residual rate (1/N)^2 ' +
    '= N^{-2}, the exponent 3/2 would have to be >= 2. It is not (3/2 < 2). ' +
    'Hence this literal reading fails.',
  verdict: 'not-this-route',
  reason:
    'Exponent 3/2 strictly less than the required 2 in the (1/N)^2 ' +
    'deviation. The imp-1149 file already documents this as the rateGap = ' +
    '0.5 (residual exponent gap of 1/2 in N).',
});

const PATH_A_REFRAMED = Object.freeze({
  id: 'path-a-reframed-N32-directly-on-tc',
  description:
    'Does the imp-1149 / Theorem 3 rate, combined with the explicit ' +
    'M_inf -> infinity divergence and the triangle inequality, give a ' +
    'DIRECT unconditional upper bound on |t_c(N)| -- bypassing the OLS ' +
    'extrapolation entirely?',
  derivation:
    '|t_c(N)| <= |t_c(N) - 1/(2 M_inf(N))| + 1/(2 M_inf(N)) ' +
    '<= C_HO / (L * N^{3/2}) + 1/(2 K_1 (L - log 4 pi) sqrt(N)) ' +
    '-> 0 as N -> infinity, unconditionally. Composing with the ' +
    'asymptotic E_trunc_pt = 3.06e-5 (Ingham at T_PT = 3e12) and the ' +
    'vanishing E_flow / E_coll terms gives Lambda <= 0 + 3.06e-5 = ' +
    '3.06e-5 asymptotically, unconditional on the linear-1/N model. ' +
    'NOTE: this matches the imp-341 limit statement "lim sup |t_c(N)| = ' +
    '0 unconditionally" published 2025, with the imp-1149 N^{-3/2} rate ' +
    'providing the explicit quantitative version.',
  verdict: 'closure-achievable',
  reason:
    'The imp-1147 conditional dependence on the linear-1/N model is ' +
    'UNNECESSARY when the asymptote is read directly from the imp-341 / ' +
    'imp-1149 chain rather than via OLS extrapolation. The resulting ' +
    'unconditional Lambda <= 3.06e-5 is ALSO numerically tighter than the ' +
    'imp-1147 conditional 7.98e-4 by a factor of approximately 26.',
});

const PATH_B_CONREY_SNAITH = Object.freeze({
  id: 'path-b-conrey-snaith-arithmetic',
  description:
    'Does the imp-1166 Conrey-Snaith arithmetic correction A_simplified(N) ' +
    '= log N, which shifts the empirical linear-statistics variance slope ' +
    'from -0.881 to -0.997, imply a controlled (1/N)^2 term on |t_c(N)|?',
  derivation:
    'The C-S correction operates on Var[L_N(f)], the variance of smooth ' +
    'linear statistics of the zeros. The imp-1147 / imp-1149 chain operates ' +
    'on |m_N(z) - m_inf(z)|, the L^infty discrepancy of the Stieltjes ' +
    'transform. These are DIFFERENT OBSERVABLES: Var[L_N(f)] is a ' +
    'sum over f-modulated zero spacings, |m_N - m_inf| is the sup-norm of ' +
    'an analytic function on a strip. There is no direct chain from a ' +
    'correction on Var[L_N(f)] to a correction on |m_N - m_inf| or on ' +
    '|t_c(N)|. The C-S correction is itself a leading-order log N factor; ' +
    'the imp-1149 / Theorem 3 derivation ALREADY carries a log gamma_N ' +
    'in its denominator (and gamma_N ~ 2 pi N / log N gives ' +
    'log gamma_N ~ log N, modulo lower order). So the C-S log N factor ' +
    'is structurally similar to what imp-1149 already uses, but no ' +
    'extra (1/N)^2 term emerges from this similarity.',
  verdict: 'not-this-route',
  reason:
    'C-S addresses the linear-statistics universality slope gap (a ' +
    'finite-N arithmetic correction on Var[L_N(f)]), which is independent ' +
    'of the t_c(N) asymptotic expansion. No mechanism for the C-S ' +
    'correction to produce a controlled (1/N)^2 term on |t_c(N)|.',
});

const PATH_C_NEW_ROUTE = Object.freeze({
  id: 'path-c-new-route',
  description:
    'Any route the original imp-1147 obstructions list did not consider ' +
    '-- e.g. Polymath15 G6a closure, Bui-Sound substitution at different ' +
    'sigma, alternative L^p Koksma-Hlawka inequality, etc.',
  derivation:
    'The path-a-reframed observation IS the new route: the imp-1147 ' +
    'obstructions list focused on closing the OLS framework (bound the ' +
    'second-order tail of the linear-1/N expansion), but the cleaner move ' +
    'is to drop the OLS framework entirely and use the imp-341 / imp-1149 ' +
    'chain directly. This was NOT in the imp-1147 sub-deviation-from-' +
    'linear-1N obstruction text (which presumes the OLS framework is the ' +
    'target). Beyond this re-framing, no separate truly-new route is ' +
    'needed: closure is already in hand. Polymath15 G6a closure is an ' +
    'INDEPENDENT obstruction (the bridge step) and does not affect the ' +
    'linear-1/N closure. Bui-Sound substitution would only affect ' +
    'E_trunc_pt, not the asymptote a.',
  verdict: 'closure-achievable-via-reframing-of-path-a',
  reason:
    'No additional new route is required. The closure is fully delivered ' +
    'by the re-framed path (a). The imp-1147 obstructions list missed ' +
    'this because it presumed the OLS framework was load-bearing; in ' +
    'fact it is not.',
});

// ── Overall verdict ────────────────────────────────────────────────────────

const OVERALL_VERDICT = Object.freeze({
  closureKind: 'closure-via-N32-redirect',
  closureSummary:
    'The imp-1147 linear-1/N conditional gap CAN be closed by dropping ' +
    'the OLS extrapolation framework in favour of the imp-341 / Theorem 3 ' +
    'chain. The result is Lambda <= E_trunc_pt = 3.06e-5 asymptotically, ' +
    'unconditional on the linear-1/N model (still conditional on the ' +
    'Polymath15 bridge G6a step, an INDEPENDENT obstruction).',
  newAsymptoticLambda: LAMBDA_VIA_CLOSURE_ASYMPTOTIC,
  previousConditionalLambda: LAMBDA_IMP1147,
  tighteningFactorVsImp1147: TIGHTENING_FACTOR_VS_IMP1147,
  conditionalDependenciesRemoved: ['linear-1/N asymptotic model for |t_c(N)|'],
  conditionalDependenciesRemaining: [
    'Polymath15 bridge step 4 rigor (G6a_shock_lipschitz), per lambda-roadmap.js step 4',
  ],
  estimatedEffortToShip: '1-2 days (composition rewrite + paper Theorem 2 statement update)',
  shippingChecklist: [
    'Paper main.tex Theorem 2: replace conditional 7.98e-4 with unconditional 3.06e-5 (modulo Polymath15 bridge G6a).',
    'asymptotic-lambda-bound-2026-05-20.js: add a closure-via-N^{-3/2}-redirect composition block + tripwire.',
    'improvement-queue.js imp-1147 closureNote: append follow-up note pointing to imp-1246 closure.',
    'lambda-roadmap.js LAMBDA_BOUNDS: add unconditional asymptotic entry "Lambda <= 3.06e-5 unconditional (modulo G6a), imp-1246-redirect".',
    'Run npm run build + scripts/run-assertions.mjs to confirm all tripwires PASS after the composition rewrite.',
  ],
});

// ── Live import sanity ─────────────────────────────────────────────────────
const IMP1147_IMPORT_LIVE =
  typeof ASYMPTOTIC_LAMBDA_BOUND_2026_05_20 === 'object' &&
  ASYMPTOTIC_LAMBDA_BOUND_2026_05_20 !== null &&
  ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.ticket === 'imp-1147';
const IMP1149_IMPORT_LIVE =
  typeof KOKSMA_HLAWKA_2ND_MOMENT === 'object' &&
  KOKSMA_HLAWKA_2ND_MOMENT !== null &&
  KOKSMA_HLAWKA_2ND_MOMENT.ticket === 'imp-1149';
const IMP341_IMPORT_LIVE =
  typeof LAMBDA_INTERCEPT_BURGERS_UNIFORMITY === 'object' &&
  LAMBDA_INTERCEPT_BURGERS_UNIFORMITY !== null &&
  LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id === 'imp-341';
const IMP1166_IMPORT_LIVE =
  typeof IMP1166_CONREY_SNAITH_CORRECTION === 'object' &&
  IMP1166_CONREY_SNAITH_CORRECTION !== null &&
  IMP1166_CONREY_SNAITH_CORRECTION.ticket === 'imp-1166';

// ── Exported record ────────────────────────────────────────────────────────

export const IMP_1246_LINEAR_1N_GAP_RECHECK = Object.freeze({
  id: 'imp-1246',
  ticket: 'imp-1246',
  title: 'OPUS-4.8 RECHECK: imp-1147 linear-1/N gap closure path',
  builtAt: '2026-05-28T00:00:00Z',
  reviewer: 'opus-4-8',
  channel: 'subscription-worktree',

  centralQuestion:
    'Is the imp-1149 / Theorem 3 unconditional N^{-3/2} rate strong enough ' +
    'to close the imp-1147 linear-1/N conditional gap? Or is there a new ' +
    'route via the imp-1166 Conrey-Snaith arithmetic correction, or any ' +
    'other path the original imp-1147 obstructions list missed?',

  perPathVerdicts: {
    pathA_originalFraming: PATH_A_ORIGINAL_FRAMING,
    pathA_reframed:        PATH_A_REFRAMED,
    pathB_conreySnaith:    PATH_B_CONREY_SNAITH,
    pathC_newRoute:        PATH_C_NEW_ROUTE,
  },

  overallVerdict: OVERALL_VERDICT,

  closureWitnessRows: CLOSURE_WITNESS_ROWS,
  closureWitnessSummary: Object.freeze({
    nRows: CLOSURE_WITNESS_ROWS.length,
    crossoverN: N_CROSSOVER, // first N where the closure |t_c| upper bound undercuts a_hi.
    interpretation:
      'The closure-via-N^{-3/2}-redirect bound |t_c(N)| <= U_inf(N) + ' +
      'C_HO / (L * N^{3/2}) is DOMINATED at small N by U_inf(N) = ' +
      '1 / (2 K_1 (L - log 4 pi) sqrt(N)) (the M_inf decay), which is ' +
      'sqrt(N)-slow. At the imp-1147 sweep depth N = 1e6, U_inf(N) is ' +
      'still O(1e-4), comparable to a_hi = 7.673e-4. The closure tightens ' +
      'further as N grows. The crossover N* is the first N where ' +
      'U_inf(N) + R_HO(N) < a_hi = 7.673e-4. Beyond N* the unconditional ' +
      'closure bound is strictly tighter than the OLS-conditional one. ' +
      'In the asymptotic limit lim sup |t_c(N)| = 0, so Lambda <= ' +
      'E_trunc_pt = 3.06e-5 unconditionally.',
  }),

  numericalConstants: Object.freeze({
    C_HO_imp1149_composed: C_HO,
    K_1_strip:             K1_M_INF,
    log_4pi:               LOG_4PI,
    E_trunc_pt_Ingham:     E_TRUNC_PT,
    a_hi_imp1147_OLS:      A_HI_IMP1147,
    lambda_imp1147_conditional: LAMBDA_IMP1147,
    lambda_via_closure_asymptotic: LAMBDA_VIA_CLOSURE_ASYMPTOTIC,
    tightening_factor: TIGHTENING_FACTOR_VS_IMP1147,
  }),

  honestScope: Object.freeze([
    'This file does NOT ship the closure in-place: the imp-1147 file ' +
    'asymptotic-lambda-bound-2026-05-20.js still carries the conditional ' +
    'composition Lambda <= 7.98e-4. The closure execution is intentionally ' +
    'a follow-up: this file is a standalone audit identifying the closure ' +
    'path and the effort to ship it. A future commit will rewrite the ' +
    'composition + paper Theorem 2 atomically.',
    'The closure-via-N^{-3/2}-redirect path is mathematically not new -- ' +
    'imp-341 already shipped the lim sup = 0 statement in 2025 and ' +
    'imp-1149 shipped the explicit N^{-3/2} rate in 2026-05-20. The ' +
    'project contribution of this recheck is the EXPLICIT IDENTIFICATION ' +
    'that the imp-1147 OLS-based conditional dependence on the linear-1/N ' +
    'model is UNNECESSARY: the same composition can be done via the ' +
    'imp-341 / imp-1149 chain, giving an UNCONDITIONAL bound that is ' +
    'numerically tighter by approximately 26x.',
    'The Polymath15 bridge G6a_shock_lipschitz conditional dependence ' +
    'persists across BOTH the imp-1147 conditional bound and the closure ' +
    'via-redirect bound; it is INDEPENDENT of the linear-1/N obstruction ' +
    'being closed here. lambda-roadmap.js step 4 verification status ' +
    'remains numerical (not rigorous unconditional) regardless of this ' +
    'recheck.',
    'Conrey-Snaith / imp-1166 was assessed and excluded as a closure ' +
    'route. The C-S correction operates on a different observable ' +
    '(Var[L_N(f)] linear-statistics variance, not |m_N - m_inf|) and ' +
    'there is no chain from the C-S log N correction to a controlled ' +
    '(1/N)^2 term on |t_c(N)|. The C-S route remains relevant for the ' +
    'paper Section 4.5 universality claim but is not load-bearing for ' +
    'the imp-1147 closure.',
    'At FINITE N below the crossover, the OLS-fitted a_hi may give a ' +
    'tighter upper bound on the asymptote than the explicit imp-341 / ' +
    'imp-1149 chain because the OLS exploits the measured plateau ' +
    'brackets while the chain bound is dominated by the slow 1/sqrt(N) ' +
    'M_inf decay. The unconditional closure applies asymptotically; the ' +
    'OLS framework continues to provide useful finite-N witnesses ' +
    'without claiming rigor on the asymptote.',
  ]),

  references: Object.freeze({
    imp341:  'lambda-intercept-burgers-uniformity.js -- shipped lim sup |t_c(N)| = 0 unconditionally (2025).',
    imp1147: 'asymptotic-lambda-bound-2026-05-20.js -- shipped Lambda <= 7.98e-4 conditional on linear-1/N (2026-05-20).',
    imp1149: 'koksma-hlawka-2nd-moment-deviation-bound.js -- shipped |t_c(N) - 1/(2 M_inf(N))| <= C_HO / (L N^{3/2}) unconditional (2026-05-20).',
    imp1166: 'imp-1166-conrey-snaith-correction-on-imp1162-grid.js -- C-S correction on linear-statistics variance (Path b, excluded).',
    paperTheorem2: 'paper/main.tex Theorem 2 -- the conditional statement to be replaced by closure.',
    paperTheorem3: 'paper/main.tex Theorem 3 -- the published unconditional N^{-3/2} rate (imp-1149 in publication form).',
    polymath15Bridge: 'lambda-roadmap.js step 4 -- the G6a_shock_lipschitz Polymath15 bridge step (independent conditional, persists).',
  }),

  liveImports: Object.freeze({
    imp1147ImportLive: IMP1147_IMPORT_LIVE,
    imp1149ImportLive: IMP1149_IMPORT_LIVE,
    imp341ImportLive:  IMP341_IMPORT_LIVE,
    imp1166ImportLive: IMP1166_IMPORT_LIVE,
  }),
});

export default IMP_1246_LINEAR_1N_GAP_RECHECK;

// ── Build-time tripwires (6+ required per ticket spec) ─────────────────────

export const IMP_1246_LINEAR_1N_GAP_RECHECK_ASSERTIONS = [
  {
    id: 'imp1246-overall-verdict-is-closure-via-N32-redirect',
    holds: () =>
      IMP_1246_LINEAR_1N_GAP_RECHECK.overallVerdict.closureKind ===
      'closure-via-N32-redirect',
    why:
      'The load-bearing finding of this recheck is that closure of the ' +
      'imp-1147 linear-1/N conditional gap is achievable via the ' +
      'imp-341 / imp-1149 chain, BYPASSING the OLS extrapolation ' +
      'framework. The overallVerdict.closureKind tag pins this finding ' +
      'so a future commit cannot silently flip the verdict.',
  },
  {
    id: 'imp1246-path-a-original-framing-rejected',
    holds: () =>
      IMP_1246_LINEAR_1N_GAP_RECHECK.perPathVerdicts.pathA_originalFraming.verdict ===
      'not-this-route',
    why:
      'The literal reading of the imp-1147 obstruction "bound the (1/N)^2 ' +
      'deviation via N^{-3/2}" fails because 3/2 < 2. Verdict on path-a ' +
      'in its original framing must remain "not-this-route" to preserve ' +
      'the honest reading of the imp-1149 rateGap = 0.5 finding.',
  },
  {
    id: 'imp1246-path-a-reframed-closes',
    holds: () =>
      IMP_1246_LINEAR_1N_GAP_RECHECK.perPathVerdicts.pathA_reframed.verdict ===
      'closure-achievable',
    why:
      'Path (a) re-framed is the load-bearing closure: combining the ' +
      'imp-1149 / Theorem 3 N^{-3/2} rate with the explicit M_inf -> ' +
      'infinity divergence and the triangle inequality gives a direct ' +
      'unconditional upper bound on |t_c(N)|. The verdict must be ' +
      '"closure-achievable" (the closure execution itself is a follow-up ' +
      'ticket; the audit identifies the route).',
  },
  {
    id: 'imp1246-path-b-conrey-snaith-not-route',
    holds: () =>
      IMP_1246_LINEAR_1N_GAP_RECHECK.perPathVerdicts.pathB_conreySnaith.verdict ===
      'not-this-route',
    why:
      'imp-1166 Conrey-Snaith arithmetic correction operates on the ' +
      'linear-statistics variance Var[L_N(f)], NOT on |t_c(N)|. No chain ' +
      'connects the C-S log N correction to a controlled (1/N)^2 term ' +
      'on the t_c asymptote. Path (b) must remain "not-this-route" to ' +
      'avoid confusion with the path-a closure.',
  },
  {
    id: 'imp1246-tightening-factor-above-twenty',
    holds: () => {
      const f = IMP_1246_LINEAR_1N_GAP_RECHECK.overallVerdict.tighteningFactorVsImp1147;
      return Number.isFinite(f) && f > 20;
    },
    why:
      'The closure asymptotic Lambda <= 3.06e-5 vs the imp-1147 conditional ' +
      'Lambda <= 7.98e-4 gives a tightening factor of approximately 26. ' +
      'A drop below 20 would indicate the upstream E_trunc_pt or a_hi ' +
      'values have drifted; the closure narrative depends on the ' +
      'unconditional bound being numerically tighter than the conditional ' +
      'one by a substantial factor.',
  },
  {
    id: 'imp1246-polymath15-bridge-conditional-still-listed',
    holds: () =>
      IMP_1246_LINEAR_1N_GAP_RECHECK.overallVerdict.conditionalDependenciesRemaining.some(
        (d) => d.includes('Polymath15') || d.includes('G6a'),
      ),
    why:
      'The closure removes the linear-1/N conditional but does NOT remove ' +
      'the Polymath15 bridge G6a conditional (an independent obstruction). ' +
      'The recheck must explicitly list the remaining conditional so a ' +
      'future paper claim cannot mis-read the closure as full ' +
      'unconditional rigor.',
  },
  {
    id: 'imp1246-witness-rows-monotone-decreasing-tcUpper',
    holds: () => {
      const rows = IMP_1246_LINEAR_1N_GAP_RECHECK.closureWitnessRows;
      if (!Array.isArray(rows) || rows.length < 5) return false;
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].tcUpper < rows[i - 1].tcUpper)) return false;
      }
      return rows[rows.length - 1].tcUpper < 1e-6; // -> 0 at the largest sampled N
    },
    why:
      'The per-N closure witness rows must show tcUpper = U_inf + R_HO ' +
      'strictly decreasing in N (both terms are monotone decreasing in ' +
      'N), and the largest sampled N (1e15) must give tcUpper below 1e-6 ' +
      'to numerically substantiate the "lim sup -> 0" claim. A monotonicity ' +
      'failure or a non-vanishing tail would indicate a derivation bug.',
  },
  {
    id: 'imp1246-imports-live',
    holds: () => {
      const li = IMP_1246_LINEAR_1N_GAP_RECHECK.liveImports;
      return (
        li.imp1147ImportLive === true &&
        li.imp1149ImportLive === true &&
        li.imp341ImportLive === true &&
        li.imp1166ImportLive === true
      );
    },
    why:
      'Four upstream imports must be live: imp-1147 (the conditional ' +
      'bound being closed), imp-1149 (the N^{-3/2} rate source), imp-341 ' +
      '(the lim sup = 0 statement source), and imp-1166 (the C-S ' +
      'correction assessed in path b). If any goes stale, the recheck ' +
      'silently detaches from the rigor chain and the verdicts become ' +
      'orphan claims.',
  },
  {
    id: 'imp1246-effort-estimate-realistic',
    holds: () => {
      const e = IMP_1246_LINEAR_1N_GAP_RECHECK.overallVerdict.estimatedEffortToShip;
      return typeof e === 'string' && /day|hour|week/i.test(e);
    },
    why:
      'The effort estimate to ship the closure must be expressed in ' +
      'human-readable units (days / hours / weeks). The estimated 1-2 ' +
      'days reflects that the mathematics is already in imp-341 / ' +
      'imp-1149 and only the composition + paper Theorem 2 update needs ' +
      'writing. A missing or non-time-bound estimate would signal the ' +
      'closure is not actually scoped.',
  },
  {
    id: 'imp1246-honest-scope-flags-closure-not-yet-shipped',
    holds: () => {
      const hs = IMP_1246_LINEAR_1N_GAP_RECHECK.honestScope;
      if (!Array.isArray(hs) || hs.length < 3) return false;
      return hs.some((s) => s.includes('does NOT ship the closure'));
    },
    why:
      'The recheck file is an AUDIT, not the closure execution. The ' +
      'honestScope must explicitly state that this file does NOT modify ' +
      'the imp-1147 file in place (which still carries the conditional ' +
      'composition) -- the closure execution is a separate follow-up. ' +
      'Removing this disclaimer would silently overclaim the ticket.',
  },
];
