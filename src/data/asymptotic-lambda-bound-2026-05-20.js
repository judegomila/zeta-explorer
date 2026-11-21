/**
 * @module data/asymptotic-lambda-bound-2026-05-20
 * @fileoverview imp-1147 — composed asymptotic Lambda upper-bound attempt.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ AUDIT CORRECTION 2026-07 (SUPERSEDED OVERCLAIM)                         │
 * │                                                                        │
 * │ The headline this file once carried —                                  │
 * │   "Lambda <= 3.06e-5 UNCONDITIONAL (modulo Polymath15 G6a only)" —      │
 * │ IS FALSE and is retracted. A 3-auditor, source-grounded review         │
 * │ established that 3.06e-5 is NOT a rigorous sub-PT bound. It is          │
 * │ conditional on MULTIPLE independent, still-open gates:                  │
 * │                                                                        │
 * │  (a) the RH-EQUIVALENT Hölder-1/2 shock modulus C_H / G6a — NOT one     │
 * │      lemma away and NOT the sole gate: imp-2640's Gronwall discharge    │
 * │      is NEGATIVE / RH-hard-confirmed, and imp-35147 shows C_H is        │
 * │      equivalent to a uniform all-height minimal-gap lower bound         │
 * │      (i.e. RH-EQUIVALENT). rh-dag.js marks the G6a node severity:open   │
 * │      and calls the earlier "closed" framing a WITHDRAWN overclaim.      │
 * │  (b) an uncertified / mis-stated E_trunc constant: imp-34791 found a    │
 * │      prefactor bug (honest value ≈ 5.1e-5, NOT 3.06e-5) and the         │
 * │      imp-1324 Ramaré line wrong by ~9.5e7; even the sharpest explicit   │
 * │      constant is still 16.7x short of PT 0.2. (lambda-roadmap           │
 * │      obligation G-Etrunc-Eflow-constants, closed:false.)                │
 * │  (c) an UNSUPPLIED E(N) -> 0: imp-35164 shows that on the current       │
 * │      surrogate E(N) FLOORS at E_trunc and does NOT vanish, so the       │
 * │      "asymptotic -> 3.06e-5" statement is unsupplied. (obligation       │
 * │      G-EN-ladder-verify, closed:false.)                                 │
 * │  (d) the |t_c(N)| -> 0 leg bounds a Stieltjes-transform PROXY, not the  │
 * │      true first-collision time; particle-vs-proxy identification        │
 * │      (imp-2563 R_A) is OPEN, and the quantitative M_infty rate step     │
 * │      K_1 (L - log 4pi) sqrt(N) is repo-REFUTED (imp-2621 falsified the  │
 * │      continuum amplification) — only the bare limit survives.           │
 * │                                                                        │
 * │ The ONLY unconditional Λ upper bound remains Platt–Trudgian             │
 * │ Λ ≤ 0.2 (SOTA). The genuinely-unconditional content here is            │
 * │ limsup_N |t_c^proxy(N)| = 0 (RvM counting + Trudgian C_Selberg = 3, no  │
 * │ GUE / no RH) — but it is INERT: it does not by itself bound Λ.          │
 * │                                                                        │
 * │ The narrative below (headline + "IT IS / IT IS NOT" + composition) is   │
 * │ retained as the SUPERSEDED record. Read `honestScope`, `numericalStatus`│
 * │ and `residualObstructions` on the exported object for the live status.  │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * SUPERSEDED HEADLINE (post imp-1261 rewrite, 2026-05-28; RETRACTED 2026-07):
 *   Lambda  <=  E_trunc_pt  =  3.06e-5  ["UNCONDITIONAL"]
 *   (framed then as modulo Polymath15 bridge G6a_shock_lipschitz ONLY — the
 *   audit above shows this framing understated the gate set and mispriced
 *   the constant; do NOT cite this as a result).
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
 * HONEST SCOPE — what this IS and IS NOT (corrected 2026-07)
 * ---------------------------------------------------------
 * IT IS:
 *   - An UNCONDITIONAL statement only at the level of the inert limit
 *     limsup_N |t_c^proxy(N)| = 0 (RvM counting + Trudgian C_Selberg = 3;
 *     no GUE, no RH). This limit does NOT by itself bound Λ.
 *   - A genuine removal of ONE historical conditional: the linear-1/N OLS
 *     model (closed by imp-1246 / imp-1261). That closure is real, but it
 *     does not make the composed Λ bound rigorous.
 *
 * IT IS NOT:
 *   - A rigorous sub-PT bound on Λ. The composed 3.06e-5 is conditional on
 *     multiple independent, still-open gates (see AUDIT CORRECTION banner):
 *       (a) the RH-EQUIVALENT Hölder-1/2 shock modulus C_H / G6a
 *           (imp-2640 NEGATIVE, imp-35147 RH-equivalent) — not one lemma
 *           away and not the sole gate;
 *       (b) an uncertified / mis-stated E_trunc constant (imp-34791
 *           prefactor bug -> honest ≈ 5.1e-5; imp-1324 Ramaré line refuted);
 *       (c) an unsupplied E(N) -> 0 (imp-35164: E(N) floors at E_trunc,
 *           does not vanish);
 *       (d) proxy-vs-particle identification (imp-2563 R_A open) on a
 *           repo-refuted M_infty rate step (imp-2621).
 *   - Unconditional. The ONLY unconditional Λ upper bound remains
 *     Platt–Trudgian Λ ≤ 0.2 (SOTA).
 *   - "6,500x tighter than PT" / "second project result" — those claims
 *     are retracted: they priced an uncertified count as if it were a
 *     rigorous bound.
 *
 * NON-CIRCULARITY (kept, verified by the audit):
 *   - C_H / G6a is INDEPENDENT of imp-341's Burgers uniformity (the route
 *     is not circular).
 *   - For the ASYMPTOTIC route, E_coll is gated by C_H (= G6a), NOT by GUE
 *     / C_mb (that GUE dependence is the separate finite-N Route-A path).
 *
 * RESIDUAL OBSTRUCTIONS (named sub-gaps; see residualObstructions export):
 *   - imp-1147-sub-polymath-bridge-G6a  (RH-EQUIVALENT / open)
 *   - imp-1147-sub-etrunc-constant-uncertified  (imp-34791)
 *   - imp-1147-sub-EN-ladder-does-not-vanish  (imp-35164)
 *   - imp-1147-sub-proxy-particle-identification  (imp-2563 R_A)
 *   - imp-1147-sub-Minf-rate-refuted  (imp-2621)
 *   - imp-1147-sub-deviation-from-linear-1N  (CLOSED by imp-1246 / imp-1261;
 *       the ONE conditional genuinely removed — but its removal does not
 *       make the composed bound rigorous)
 *
 * @see imp-341 lambda-intercept-burgers-uniformity.js (lim sup |t_c(N)| = 0)
 * @see imp-1149 koksma-hlawka-2nd-moment-deviation-bound.js (N^{-3/2} rate)
 * @see imp-1246 imp-1246-linear-1N-gap-recheck.js (the redirect derivation)
 * @see imp-1261 imp-1261-asymptotic-lambda-redirect-shipped.js (this rewrite)
 * @see imp-447 + imp-459 E_trunc_pt at T_PT = 3e12, sigma_opt = 0.75
 * @see PT 2021 (Platt-Trudgian, Bull. LMS 2021): no refereed bound is changed
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

// Composed asymptotic value (NOT a rigorous Lambda upper bound — see the
// AUDIT CORRECTION banner and numericalStatus). Formally the composition once
// read lim sup_N |t_c(N)| = 0 ==> Lambda <= 0 + E_trunc_pt = E_trunc_pt, but
// E(N) does not actually vanish (imp-35164) and E_trunc is uncertified
// (imp-34791). Retained only for the composition arithmetic on the record.
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
  verifiedAt: '2026-06-10T08:49:52Z', // imp-2581: all 10 exported assertions re-verified (node eval), build clean; counts/refs unchanged

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

  // ── SUPERSEDED composition (imp-1261 redirect; NOT a rigorous bound) ──────
  // Retained on the record. The audit (2026-07) refuted this as a Lambda bound:
  // the M_infty rate step is repo-refuted (imp-2621), the |t_c| leg bounds a
  // Stieltjes PROXY (imp-2563 R_A open), E(N) does not vanish (imp-35164), and
  // E_trunc is uncertified (imp-34791). Only limsup |t_c^proxy| = 0 is
  // unconditional, and it is INERT.
  composition: {
    method: 'triangle-inequality-via-imp341-imp1149-chain (SUPERSEDED — not a rigorous bound)',
    derivation:
      'SUPERSEDED (audit 2026-07): the chain once read ' +
      '|t_c(N)| <= |t_c(N) - 1/(2 M_infty(N))| + 1/(2 M_infty(N)) ' +
      '<= C_HO / (L * N^{3/2}) + 1/(2 K_1 (L - log 4 pi) sqrt(N)) -> 0, but the ' +
      'quantitative M_infty rate is repo-refuted (imp-2621) and the leg bounds a ' +
      'Stieltjes PROXY (imp-2563 R_A open) — only the bare INERT limit ' +
      'limsup |t_c^proxy| = 0 survives. Composing with the Polymath15 bridge does ' +
      'NOT give a rigorous Lambda bound: E(N) floors and does not vanish ' +
      '(imp-35164) and E_trunc is uncertified (imp-34791, honest ~= 5.1e-5).',

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

  // ── AUDIT CORRECTION 2026-07: numerical status of the 3.06e-5 value ───────
  // The value is NOT a certified Lambda upper bound. It is a mispriced count
  // artifact: imp-34791 found a prefactor bug (honest value ~= 5.1e-5, NOT
  // 3.06e-5), the imp-1324 Ramaré line is wrong by ~9.5e7, and the sharpest
  // explicit constant is still 16.7x short of even PT 0.2.
  numericalStatus: {
    headlineValue: E_TRUNC_PT_INGHAM,        // 3.06e-5 (as historically stated)
    honestValueEstimate: 5.1e-5,             // imp-34791 corrected prefactor
    // imp-95361 consistency audit: the corrected E_trunc was recorded as a
    // STANDALONE constant (honestValueEstimate) but was never propagated through
    // the composition. composition.lambdaAsymptoticUpper (= 0 + 3.06e-5 + 0 + 0)
    // still carries the RETRACTED prefactor, kept only as the arithmetic-on-record
    // value. Propagating the imp-34791-corrected E_trunc through the identical
    // formula (limsup |t_c| + E_trunc + E_flow + E_coll = 0 + ~5.1e-5 + 0 + 0)
    // gives an honest COMPOSED value ~= 5.1e-5 -- still conditional and NOT a
    // rigorous Lambda bound. No bound changes; 3.06e-5 stays reachable for the
    // paper trail.
    honestComposedValue: 5.1e-5,             // imp-95361: honest E_trunc propagated through the composition
    honestComposedNote:
      'imp-95361 audit: the honest composed conditional value (limsup |t_c| + ' +
      'corrected E_trunc + E_flow + E_coll = 0 + ~5.1e-5 + 0 + 0) is ~= 5.1e-5, ' +
      'NOT the arithmetic-on-record 3.06e-5 that composition.lambdaAsymptoticUpper ' +
      'still carries. Both remain non-rigorous and conditional on the same open gates.',
    isRigorousLambdaBound: false,
    prefactorBug: 'imp-34791: prefactor 3->5 correction; honest E_trunc ~= 5.1e-5, not 3.06e-5',
    ramareLineWrong: 'imp-1324 Ramaré line wrong by ~9.5e7',
    shortfallVsPT: 'sharpest explicit constant still 16.7x short of PT 0.2',
    note:
      '3.06e-5 is a mispriced count artifact, NOT a rigorous Lambda upper bound. ' +
      'The only unconditional Lambda upper bound remains Platt-Trudgian Lambda <= 0.2.',
  },

  honestScope: {
    isRigorous: false,
    isUnconditional: false,               // NOT a rigorous unconditional Lambda bound
    unconditionalOnLinear1N: true,        // the linear-1/N OLS conditional WAS genuinely removed (imp-1246/1261)
    isRigorousSubPTBound: false,          // NOT a rigorous bound below PT 0.2
    moduloPolymath15G6a: true,            // conditional on G6a — but G6a is RH-EQUIVALENT and NOT the sole gate
    conditionalOn: [
      'RH-EQUIVALENT Hölder-1/2 shock modulus C_H (a.k.a. Polymath15 bridge ' +
      'G6a_shock_lipschitz): imp-2640 Gronwall discharge is NEGATIVE / RH-hard-' +
      'confirmed; imp-35147 shows C_H is equivalent to a uniform all-height ' +
      'minimal-gap lower bound (RH-EQUIVALENT). NOT one lemma away, NOT the sole gate.',
      'Uncertified / mis-stated E_trunc constant: imp-34791 prefactor bug (honest ' +
      '~= 5.1e-5, not 3.06e-5); imp-1324 Ramaré line wrong ~9.5e7. lambda-roadmap ' +
      'obligation G-Etrunc-Eflow-constants is closed:false.',
      'Unsupplied E(N) -> 0: imp-35164 shows E(N) FLOORS at E_trunc on the current ' +
      'surrogate and does NOT vanish, so the asymptotic -> 3.06e-5 statement is ' +
      'unsupplied. lambda-roadmap obligation G-EN-ladder-verify is closed:false.',
      'Proxy-vs-particle identification: the |t_c(N)| -> 0 leg bounds a Stieltjes-' +
      'transform PROXY, not the true first-collision time; identification (imp-2563 ' +
      'R_A) is OPEN.',
      'Refuted M_infty rate step: the quantitative rate K_1 (L - log 4pi) sqrt(N) is ' +
      'repo-REFUTED (imp-2621 falsified the continuum amplification); only the bare ' +
      'limit survives (via the atomic self-term sqrt(N/2pi), unconditional).',
    ],
    genuinelyUnconditional: [
      'limsup_N |t_c^proxy(N)| = 0 IS unconditional (RvM counting + Trudgian ' +
      'C_Selberg = 3; no GUE, no RH) -- but it is INERT: it does not by itself bound Lambda.',
      'C_H / G6a is independent of imp-341 Burgers uniformity (the route is not circular).',
      'For the ASYMPTOTIC route, E_coll is gated by C_H (= G6a), NOT by GUE / C_mb ' +
      '(that GUE dependence is the separate finite-N Route-A path).',
    ],
    removedConditionalsViaRedirect: [
      'linear-1/N asymptotic model for |t_c(N)| (closed by imp-1246 / imp-1261)',
    ],
    summary:
      'AUDIT CORRECTION 2026-07: Lambda <= 3.06e-5 (asymptotic) is NOT a rigorous ' +
      'sub-PT bound. It is conditional on (a) the RH-EQUIVALENT Hölder-1/2 shock ' +
      'modulus C_H / G6a (imp-2640 NEGATIVE, imp-35147 RH-equivalent) -- not one ' +
      'lemma away; (b) an uncertified / mis-stated E_trunc constant (imp-34791 ' +
      'prefactor bug -> honest ~= 5.1e-5; imp-1324 Ramaré line refuted); (c) an ' +
      'unsupplied E(N) -> 0 (imp-35164: E(N) floors, does not vanish); plus the ' +
      '|t_c| -> 0 leg bounds a Stieltjes PROXY (imp-2563 R_A open) on a repo-' +
      'refuted rate step (imp-2621). The ONLY unconditional Lambda upper bound ' +
      'remains Platt-Trudgian Lambda <= 0.2 (SOTA). The genuinely-unconditional ' +
      'content here is limsup |t_c^proxy| = 0, which is INERT (does not bound Lambda). ' +
      'The one conditional genuinely removed is the linear-1/N OLS model (imp-1246 / ' +
      'imp-1261), but its removal does not make the composed bound rigorous.',
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
      severity: 'RH-EQUIVALENT-open',
      effortEstimate: 'RH-hard (equivalent to a uniform all-height minimal-gap bound)',
      blocker: true,
      description:
        'The Hölder-1/2 shock modulus C_H (a.k.a. Polymath15 bridge ' +
        'G6a_shock_lipschitz). NOT one lemma away and NOT the sole gate: ' +
        'imp-2640 Gronwall discharge is NEGATIVE / RH-hard-confirmed and imp-35147 ' +
        'shows C_H is equivalent to a uniform all-height minimal-gap lower bound ' +
        '(RH-EQUIVALENT). rh-dag.js marks the G6a node severity:open and calls the ' +
        'earlier "closed" framing a WITHDRAWN overclaim. (The g6a-sub-hyperbolic-' +
        'closure only closes a red-herring sub-sub-gap — the real-vs-complex Whitham ' +
        'transplant — NOT the modulus itself.)',
    },
    {
      id: 'imp-1147-sub-etrunc-constant-uncertified',
      severity: 'uncertified-constant-open',
      effortEstimate: 'explicit-constant discharge (unported barrier lemma)',
      blocker: true,
      description:
        'The E_trunc constant is uncertified / mis-stated independent of G6a. ' +
        'imp-34791 found a prefactor bug (honest value ~= 5.1e-5, NOT 3.06e-5) and ' +
        'the imp-1324 Ramaré line wrong by ~9.5e7; the sharpest explicit constant ' +
        'is still 16.7x short of even PT 0.2. lambda-roadmap obligation ' +
        'G-Etrunc-Eflow-constants is closed:false.',
    },
    {
      id: 'imp-1147-sub-EN-ladder-does-not-vanish',
      severity: 'unsupplied-rate-open',
      effortEstimate: 'needs a vanishing-strip supply (imp-35149 Knob A, T_v(N) -> inf), open',
      blocker: true,
      description:
        'The asymptotic "-> 3.06e-5" statement requires E(N) -> 0, which is ' +
        'UNSUPPLIED: imp-35164 shows that on the current surrogate E(N) FLOORS at ' +
        'the fixed-strip constant E_trunc and does NOT vanish. lambda-roadmap ' +
        'obligation G-EN-ladder-verify is closed:false.',
    },
    {
      id: 'imp-1147-sub-proxy-particle-identification',
      severity: 'identification-open',
      effortEstimate: 'particle-vs-proxy identification (imp-2563 R_A), open',
      blocker: true,
      description:
        'The |t_c(N)| -> 0 leg bounds a Stieltjes-transform PROXY, not the true ' +
        'first-collision time. The particle-vs-proxy identification (imp-2563 R_A) ' +
        'is OPEN, so the leg does not directly bound the physical collision time.',
    },
    {
      id: 'imp-1147-sub-Minf-rate-refuted',
      severity: 'rate-step-refuted',
      effortEstimate: 'n/a (quantitative rate refuted; only bare limit survives)',
      blocker: true,
      description:
        'The quantitative M_infty rate step K_1 (L - log 4pi) sqrt(N) is repo-' +
        'REFUTED: imp-2621 falsified the continuum amplification. Only the bare ' +
        'limit limsup |t_c^proxy| = 0 survives (via the atomic self-term ' +
        'sqrt(N/2pi), unconditional) -- and that limit is INERT for bounding Lambda.',
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
    why: 'ARITHMETIC ONLY (audit 2026-07): the composed value 3.06e-5 is numerically ' +
         'below PT 0.2. This is NOT a claim of a rigorous sub-PT bound — 3.06e-5 is ' +
         'a mispriced count artifact (numericalStatus.isRigorousLambdaBound=false; ' +
         'honest ~= 5.1e-5) conditional on multiple open gates. The only ' +
         'unconditional Lambda upper bound remains PT Lambda <= 0.2. The assertion ' +
         'merely pins the composition arithmetic on the record.',
  },
  {
    id: 'imp1147-improvement-factor-above-100x',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.comparison.improvementFactor > 100,
    why: 'ARITHMETIC ONLY (audit 2026-07): PT/value is a large ratio, but this is a ' +
         'ratio of an UNCERTIFIED value, NOT a rigorous improvement over PT. The ' +
         '"6,500x tighter" framing is RETRACTED (see AUDIT CORRECTION banner). This ' +
         'assertion pins the arithmetic ratio only; honestScope.isRigorousSubPTBound ' +
         'is false.',
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
    id: 'imp1147-honest-scope-flags-not-unconditional',
    holds: () => ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.isUnconditional === false &&
                 ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.isRigorous === false &&
                 ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.unconditionalOnLinear1N === true &&
                 Array.isArray(ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.removedConditionalsViaRedirect) &&
                 ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.removedConditionalsViaRedirect.some(
                   (c) => c.includes('linear-1/N')
                 ),
    why: 'AUDIT CORRECTION 2026-07: the composed 3.06e-5 is NOT a rigorous ' +
         'unconditional Lambda bound, so honestScope.isUnconditional and isRigorous ' +
         'MUST both be false. The ONE conditional genuinely removed by the imp-1261 ' +
         'redirect is the linear-1/N OLS model (unconditionalOnLinear1N=true, listed ' +
         'in removedConditionalsViaRedirect) — its removal does NOT make the bound ' +
         'rigorous. This pins the honest flags so a future edit cannot re-promote the ' +
         'value to unconditional rigor.',
  },
  {
    id: 'imp1147-polymath15-g6a-listed-as-rh-equivalent-not-sole',
    holds: () => {
      const c = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.conditionalOn;
      const g6a = Array.isArray(c) && c.find((x) => x.includes('G6a') || x.includes('C_H'));
      return !!g6a && (g6a.includes('RH-EQUIVALENT') || g6a.includes('RH-equivalent')) &&
             (g6a.includes('NOT the sole') || g6a.includes('not the sole'));
    },
    why: 'AUDIT CORRECTION 2026-07: C_H / G6a must be listed as RH-EQUIVALENT ' +
         '(imp-2640 NEGATIVE, imp-35147 RH-equivalent) and explicitly NOT the sole ' +
         'gate — the old framing that G6a was "the SOLE remaining conditional" is ' +
         'RETRACTED. This pins the honest characterisation so a future edit cannot ' +
         're-frame it as one-lemma-away.',
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
  {
    id: 'imp1147-full-gate-set-listed-not-sole-g6a',
    holds: () => {
      const c = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.conditionalOn;
      if (!Array.isArray(c) || c.length < 5) return false;
      const joined = c.join(' | ');
      // Every audited gate class must be present (not just G6a).
      return (
        (joined.includes('C_H') || joined.includes('G6a')) &&   // RH-equivalent shock modulus
        joined.includes('E_trunc') &&                            // uncertified constant (imp-34791)
        joined.includes('E(N)') &&                               // unsupplied E(N) -> 0 (imp-35164)
        (joined.includes('PROXY') || joined.includes('proxy')) &&// proxy identification (imp-2563)
        joined.includes('imp-2621')                              // refuted M_infty rate step
      );
    },
    why: 'AUDIT CORRECTION 2026-07: honestScope.conditionalOn MUST enumerate the ' +
         'full gate set (RH-equivalent C_H/G6a; uncertified E_trunc constant, ' +
         'imp-34791; unsupplied E(N) -> 0, imp-35164; Stieltjes proxy identification, ' +
         'imp-2563; and the repo-refuted M_infty rate step, imp-2621) — NOT the ' +
         'single G6a gate the superseded headline claimed. This tripwire prevents a ' +
         'regression back to the sole-G6a overclaim.',
  },
  {
    id: 'imp1147-numerical-status-flags-non-rigorous',
    holds: () => {
      const n = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.numericalStatus;
      return !!n && n.isRigorousLambdaBound === false &&
             typeof n.honestValueEstimate === 'number' && n.honestValueEstimate > 3.06e-5 &&
             typeof n.note === 'string' && n.note.includes('NOT a rigorous');
    },
    why: 'AUDIT CORRECTION 2026-07: numericalStatus must flag 3.06e-5 as NOT a ' +
         'rigorous Lambda bound (isRigorousLambdaBound=false), carry the corrected ' +
         'honest value estimate (~5.1e-5 > 3.06e-5 per imp-34791), and state that ' +
         'the only unconditional bound is PT 0.2. Pins the mispriced-count-artifact ' +
         'status on the record.',
  },
];
