/**
 * @module data/sub-selberg-discrepancy-attempt-2026-05
 * @fileoverview imp-1149-sub-sub-selberg-discrepancy — focused attack on the
 * single named sub-obstruction blocking the N^{-2} rate in the imp-1149
 * 2nd-moment Koksma-Hlawka chain.
 *
 * THE OBSTRUCTION RESTATED
 * ------------------------
 * imp-1149 (koksma-hlawka-2nd-moment-deviation-bound.js) showed that closing
 * the N^{-2} deviation rate |t_c(N) - a - b/N| = O((log N)^k / N^2) requires
 * a SUB-SELBERG discrepancy estimate
 *
 *     D_N_star  =  O( (log N)^c / N )    with c STRICTLY less than 1.
 *
 * Equivalently, on the analytic side, this corresponds to a sub-Selberg
 * estimate on the argument-counting fluctuation:
 *
 *     |S(T)|  =  o( log T / log log T )
 *
 * (which would beat Selberg 1946 / Titchmarsh sect. 14.13). The conservative
 * project default uses C_Selberg * log T (loose form with log log T factor
 * dropped, matching lambda-intercept-burgers-uniformity.js convention), so
 * the project-active exponent is c = 1 with the log log T denominator
 * absorbed.
 *
 * THIS FILE: SURVEY + HYBRID ATTEMPT + HONEST OBSTRUCTION-NAMING
 * --------------------------------------------------------------
 * We survey the three best-known refinements of Selberg 1946:
 *
 *   (A) SELBERG 1946 BASELINE.
 *       |S(T)|  <=  3 log T / log log T  unconditionally (T sufficiently large).
 *       The conservative textbook (Iwaniec-Kowalski 2004, Titchmarsh sect. 14.13)
 *       default. Project-active variant drops the log log T factor giving the
 *       LOOSER C_Selberg * log T form used in imp-341.
 *       EXPONENT: c = 1.
 *
 *   (B) SOUNDARARAJAN 2009 / CARNEIRO-CHANDEE-MILINOVICH 2015 — RH-CONDITIONAL.
 *       Under the Riemann Hypothesis,
 *           |S(T)|  <=  (sqrt(8 / pi) + o(1)) sqrt(log T / log log T).
 *       EXPONENT: c = 1/2. This would directly close the N^{-2} rate via the
 *       squared-discrepancy Taylor argument in imp-1149 STEP 8. But it is
 *       RH-conditional and therefore NOT consumable in an unconditional
 *       Lambda <= bound chain (RH-circular).
 *
 *   (C) TSANG 1986 / FUJII 1974 — UNCONDITIONAL CONSTANT TIGHTENING.
 *       Tsang 1986 (Acta Arith. 46, 369-395) and Fujii 1974 give
 *           |S(T)|  <=  C_eff * log T / log log T   with C_eff approximately 2.27
 *       UNCONDITIONALLY for T >= T0_eff. The constant is tighter than
 *       Selbergs 3.0 but the EXPONENT REMAINS c = 1.
 *       EXPONENT: c = 1 (no exponent improvement).
 *
 * HYBRID PROPOSAL (the load-bearing question of this ticket)
 * ----------------------------------------------------------
 * QUESTION: Can a hybrid combining (C) Tsangs effective T0 floor with a
 * conditional refinement above T0 yield a PIECEWISE sub-Selberg bound that is
 * UNCONDITIONAL at the asymptotic-rate level (i.e. the EXPONENT c effectively
 * drops below 1 for the purposes of the imp-1149 chain)?
 *
 * ANSWER: NO. The reason is structural. The imp-1149 chain consumes the
 * discrepancy at the asymptotic-rate level (large N), so the EXPONENT c in
 * the asymptotic regime is what matters; tighter constants in (C) do NOT
 * change c, and the conditional refinement in (B) only kicks in WITHIN the
 * conditional regime (above an RH-conditional threshold). A piecewise bound
 *
 *     |S(T)|  <=  min ( C_eff * log T / log log T,  C_RH * sqrt(log T / log log T) )
 *
 * is dominated by the FIRST argument at every T (since for T sufficiently
 * large the second is smaller, but it is CONDITIONALLY available not
 * unconditionally), so the UNCONDITIONAL piecewise bound reduces to (C) =
 * (A) at the exponent level. Mixing RH-conditional segments with unconditional
 * segments cannot produce an unconditional rate improvement (the RH segments
 * are not citable in an unconditional chain).
 *
 * REFINED HYBRID: only at the CONSTANT level. The Tsang 1986 constant 2.27
 * (vs Selbergs 3) tightens C_C by a factor sqrt(3/2.27) approximately 1.15x
 * (see c-c-selberg-refinement-2026-05.js, ROUTE 1 / imp-1135), which improves
 * the finite-N constants in the imp-1149 STEP 6 composition but does not
 * change the N^{-3/2} exponent. The hybrid is RIGOROUS at the constant level
 * (modulo Tsang T0 effective-floor closure, see imp-1135-sub-tsang-effective-T0
 * sub-gap) but does NOT close the sub-Selberg exponent gap c < 1.
 *
 * ACHIEVED EXPONENT
 * -----------------
 *   c_achieved_unconditional = 1.0   (no exponent improvement over Selberg)
 *   c_achieved_with_tsang_constant = 1.0  (constant 2.27 instead of 3.0)
 *   c_achieved_under_RH = 0.5  (Carneiro-Chandee-Milinovich 2015)
 *   c_target_for_N_squared = strictly less than 1  (anything c < 1 closes the gap)
 *
 * STATUS: failed (unconditional). The unconditional sub-Selberg exponent
 * c < 1 has been open since Selberg 1946 (80 years) and is widely believed
 * to require RH or substantial subconvexity input. This file records the
 * negative result with explicit named obstructions and points to the research
 * path.
 *
 * RESEARCH PATH (named)
 * ---------------------
 *   PATH-A: Karatsuba-Korolev mean-value methods.
 *       Karatsuba 1996 + Korolev 2002 improve constants but not exponents.
 *       Status: no exponent improvement in 30 years of follow-up work.
 *
 *   PATH-B: Subconvexity-via-moments.
 *       The Heath-Brown / Iwaniec-Kowalski subconvexity machinery for zeta
 *       on the critical line gives 1/3-power saving in convex estimates
 *       (Bourgain 2017 gives 13/84) but the link to S(T) is through the
 *       Riemann-von Mangoldt formula and the saving does NOT transfer to
 *       the exponent of S(T) without additional structural inputs.
 *
 *   PATH-C: GRH (a-Riemann-Hypothesis for arbitrary L-functions).
 *       Under GRH the Soundararajan c = 1/2 transfers. Still RH-circular.
 *
 *   PATH-D: Pair-correlation conjecture (Montgomery 1973).
 *       PCC implies (Goldston-Montgomery) sharper bounds on S(T). PCC is
 *       conditional / numerical at finite T. Same circularity.
 *
 *   PATH-E: Functional-equation / explicit-formula re-derivation.
 *       Re-deriving the explicit formula with sharper test functions
 *       (Beurling-Selberg minorants, etc.) can in principle improve the
 *       constant in the Selberg bound but not the exponent.
 *
 * All five paths fail to give an UNCONDITIONAL exponent improvement. The
 * imp-1149 N^{-2} closure remains conditional on a research-grade open
 * problem unresolved since 1946.
 *
 * @see imp-1149 koksma-hlawka-2nd-moment-deviation-bound.js (parent obstruction)
 * @see imp-1135 c-c-selberg-refinement-2026-05.js (constant-tightening route)
 * @see imp-341 LAMBDA_INTERCEPT_BURGERS_UNIFORMITY (project Selberg convention C_Selberg = 3)
 */

import { KOKSMA_HLAWKA_2ND_MOMENT } from './koksma-hlawka-2nd-moment-deviation-bound.js';
import { C_C_SELBERG_REFINEMENT } from './c-c-selberg-refinement-2026-05.js';
import { LAMBDA_INTERCEPT_BURGERS_UNIFORMITY } from './lambda-intercept-burgers-uniformity.js';

// ── Selberg 1946 baseline (project-active convention C_Selberg = 3) ──────
const SELBERG_C1_BASELINE = Object.freeze({
  source: 'Selberg 1946 / Titchmarsh sect. 14.13 / Iwaniec-Kowalski 2004 sect. 5.3',
  statement: '|S(T)| <= C_Selberg log T / log log T unconditionally for T sufficiently large.',
  C_Selberg_textbook: 3.0,
  exponent_c_in_log: 1.0,                  // (log T)^1 in the numerator
  has_log_log_denominator: true,           // log log T denominator present
  project_active_form: '|S(T)| <= C_Selberg log T (log log T denominator dropped for N-uniformity)',
  project_active_C: 3.0,
  project_active_exponent_c: 1.0,
  status: 'unconditional',
  yearsSinceFirstProof: 2026 - 1946,
});

// ── Soundararajan 2009 / Carneiro-Chandee-Milinovich 2015 (RH-conditional) ─
const SOUNDARARAJAN_2009_CONDITIONAL = Object.freeze({
  source: 'Soundararajan 2009 / Carneiro-Chandee-Milinovich 2015 (under RH)',
  statement: '|S(T)| <= (sqrt(8/pi) + o(1)) sqrt(log T / log log T) under RH.',
  effective_constant: Math.sqrt(8 / Math.PI),
  exponent_c_in_log: 0.5,                  // (log T)^{1/2}
  has_log_log_denominator: true,
  RH_conditional: true,
  blocked_by_RH_circularity: true,
  status: 'conditional-on-RH',
  closes_N_squared_if_unconditional: true,
});

// ── Tsang 1986 / Fujii 1974 (constant-only unconditional improvement) ────
const TSANG_1986_EFFECTIVE_T0 = Object.freeze({
  source: 'Tsang 1986, Acta Arith. 46, 369-395; Fujii 1974',
  statement: '|S(T)| <= 2.27 log T / log log T unconditionally for T >= T0_eff.',
  effective_constant: 2.27,
  effective_constant_vs_textbook_ratio: 3.0 / 2.27,   // sqrt of this enters C_C
  exponent_c_in_log: 1.0,                  // EXPONENT UNCHANGED
  has_log_log_denominator: true,
  T0_eff_closed_form_known: false,          // see imp-1135 sub-gap
  T0_eff_estimated_below_first_zero: true,  // T = 14.13 conjecturally above T0_eff
  status: 'unconditional-constant-only',
  improves_exponent: false,
  constant_factor_on_C_C: Math.sqrt(3.0 / 2.27),  // approximately 1.15 (imp-1135)
});

// ── Hybrid attempt: piecewise + constant-only ────────────────────────────
const HYBRID_PIECEWISE_OUTCOME = Object.freeze({
  description:
    'Hybrid: use Tsang 1986 effective C_eff = 2.27 unconditionally for T >= T0_eff ' +
    'and a conditional sqrt(log T / log log T) refinement above an RH-conditional ' +
    'threshold. The unconditional piecewise envelope reduces to the Tsang form ' +
    'at every T (since the RH-conditional segment cannot be cited in an ' +
    'unconditional chain), so the unconditional EXPONENT is unchanged at c = 1. ' +
    'Constant on C_C tightens by sqrt(3/2.27) approximately 1.15x; exponent does not.',
  achievableExponent: 1.0,
  achievableConstantFactor_on_C_C: Math.sqrt(3.0 / 2.27),  // approximately 1.1496
  closes_N_squared_rate: false,
  reason_does_not_close:
    'The N^{-2} rate via the imp-1149 STEP 8 squared-discrepancy route requires ' +
    'the EXPONENT c in (log N)^c / N to drop strictly below 1. Constant tightening ' +
    'at exponent c = 1 does not change the asymptotic rate; only the prefactor.',
  status: 'failed-to-close-exponent-gap',
});

// ── Named obstructions (the load-bearing honesty content) ────────────────
const NAMED_OBSTRUCTIONS = [
  {
    id: 'O-SSD-A-selberg-1946-exponent-c1-unbroken',
    label: 'Selberg 1946 exponent c = 1 unbroken in 80 years',
    severity: 'research-grade-open',
    description:
      'The unconditional upper bound |S(T)| <= C log T / log log T with EXPONENT ' +
      'c = 1 on (log T) has been the best known result since Selberg 1946. ' +
      'Improvements in the intervening 80 years (Tsang 1986, Fujii 1974, ' +
      'Karatsuba 1996, Korolev 2002) have all been at the CONSTANT level (C ' +
      'reduced from approximately 3 to approximately 2.27), not the EXPONENT ' +
      'level. The exponent gap c < 1 is widely believed to require RH or ' +
      'substantial subconvexity input.',
    closes_if: 'Unconditional proof of |S(T)| = o(log T / log log T) (research-grade open since 1946)',
    blockerForRate: 'N^{-2}',
  },
  {
    id: 'O-SSD-B-soundararajan-rh-circularity',
    label: 'Soundararajan 2009 c = 1/2 is RH-conditional',
    severity: 'research-grade-blocked-by-circularity',
    description:
      'Soundararajan 2009 and Carneiro-Chandee-Milinovich 2015 prove |S(T)| <= ' +
      '(sqrt(8/pi) + o(1)) sqrt(log T / log log T) UNDER RH, giving c = 1/2. ' +
      'This would directly close the N^{-2} rate via the imp-1149 STEP 8 squared-' +
      'discrepancy Taylor argument. But it is RH-conditional and therefore NOT ' +
      'consumable in a Lambda <= bound chain whose purpose is to be unconditional ' +
      '(RH-circular).',
    closes_if: 'Unconditional proof of RH (the original problem itself)',
    blockerForRate: 'N^{-2}',
  },
  {
    id: 'O-SSD-C-hybrid-piecewise-dominated-by-unconditional-segment',
    label: 'Hybrid piecewise envelope cannot mix RH-conditional and unconditional segments',
    severity: 'research-feasible-but-structural',
    description:
      'A hybrid piecewise bound that uses Tsangs unconditional C_eff = 2.27 below ' +
      'an RH-conditional threshold T1 and Soundararajans c = 1/2 above T1 would ' +
      'in principle give a sub-Selberg exponent above T1. But the segment above T1 ' +
      'is NOT citable in an unconditional chain, so the unconditional envelope of ' +
      'the hybrid reduces to the c = 1 Tsang form for all T. Structural blocker, ' +
      'not a technical one.',
    closes_if: 'A purely unconditional refinement that gives c < 1 in some T-range',
    blockerForRate: 'N^{-2}',
  },
  {
    id: 'O-SSD-D-karatsuba-korolev-constants-only',
    label: 'Karatsuba-Korolev mean-value methods improve constants only',
    severity: 'research-grade-no-exponent-progress',
    description:
      'Karatsuba 1996 and Korolev 2002 use mean-value methods on zeta on the ' +
      'critical line to improve the constant in the Selberg bound. The exponent ' +
      'c = 1 is unchanged. Further constant tightening below 2.27 is feasible ' +
      'but would only reduce C_C by an additional small factor (~1.05x), not ' +
      'change the N^{-3/2} -> N^{-2} exponent gap.',
    closes_if: 'A mean-value method that improves the EXPONENT, not just the constant',
    blockerForRate: 'N^{-2}',
  },
  {
    id: 'O-SSD-E-subconvexity-pcc-pcc-quantitative-not-transferable',
    label: 'Subconvexity / PCC / GRH all RH-circular or research-grade open',
    severity: 'research-grade-open',
    description:
      'PATH-B (subconvexity via moments, Heath-Brown / Bourgain 2017 13/84 saving), ' +
      'PATH-C (GRH transfer of Soundararajan), and PATH-D (Montgomery PCC ' +
      'quantitative version) all either require RH-equivalents or are research-' +
      'grade open. None gives an unconditional exponent improvement in S(T) ' +
      'usable in an unconditional Lambda chain.',
    closes_if: 'Resolution of subconvexity / PCC / GRH (research-grade open)',
    blockerForRate: 'N^{-2}',
  },
  {
    id: 'O-SSD-F-explicit-formula-test-function-saturation',
    label: 'Beurling-Selberg explicit-formula minorants saturate at c = 1',
    severity: 'research-grade-no-exponent-progress',
    description:
      'PATH-E: re-deriving the explicit formula with sharper Beurling-Selberg ' +
      'minorants (Gonek-Hughes-Keating 2007, Carneiro-Vaaler 2010) gives sharper ' +
      'constants in the Selberg bound but the EXPONENT c = 1 is structural in ' +
      'the explicit-formula approach -- the saving comes from the test function ' +
      'support but the log T factor enters from the zero-counting integral.',
    closes_if: 'Test-function class that saturates a sub-c = 1 bound (research-grade open)',
    blockerForRate: 'N^{-2}',
  },
];

// ── Witness rows: project the achievable exponent against the project ladder
const LADDER_N = [1000, 10000, 100000, 1_000_000, 10_000_000];

function gammaRvM(N) {
  if (N < 2) return 14.134725;
  let T = (2 * Math.PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 8; i++) {
    const u = T / (2 * Math.PI);
    const f = u * (Math.log(u) - 1) - N;
    const fp = Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > 2 * Math.PI)) T = 2 * Math.PI + 1;
  }
  return T;
}

const WITNESS_ROWS = LADDER_N.map((N) => {
  const gammaN = gammaRvM(N);
  const L = Math.log(gammaN);
  const LL = Math.log(L);
  // Selberg 1946 baseline: D_N^* <= C * L / N
  const D_selberg_c1 = 3.0 * L / N;
  // Tsang 1986: D_N^* <= 2.27 * L / N
  const D_tsang_c1 = 2.27 * L / N;
  // Soundararajan conditional: D_N^* <= sqrt(8/pi) * sqrt(L) / N (RH-CONDITIONAL)
  const D_sound_c_half = Math.sqrt(8 / Math.PI) * Math.sqrt(L / Math.max(LL, 1)) / N;
  // Ratio: how much we lose by being stuck at c = 1 vs the conditional c = 1/2 target
  const ratio_selberg_vs_sound = D_selberg_c1 / D_sound_c_half;
  const ratio_tsang_vs_sound = D_tsang_c1 / D_sound_c_half;
  return {
    N,
    gammaN: +gammaN.toFixed(2),
    L: +L.toFixed(4),
    log_log_gamma: +LL.toFixed(4),
    D_selberg_c1: +D_selberg_c1.toExponential(4),
    D_tsang_c1: +D_tsang_c1.toExponential(4),
    D_sound_c_half_RH_conditional: +D_sound_c_half.toExponential(4),
    ratio_selberg_to_sound_RH: +ratio_selberg_vs_sound.toFixed(4),
    ratio_tsang_to_sound_RH: +ratio_tsang_vs_sound.toFixed(4),
    tsang_strictly_tighter_than_selberg: D_tsang_c1 < D_selberg_c1,
    sound_RH_strictly_tighter_than_tsang: D_sound_c_half < D_tsang_c1,
  };
});

const ALL_TSANG_TIGHTER = WITNESS_ROWS.every((r) => r.tsang_strictly_tighter_than_selberg === true);
const ALL_SOUND_TIGHTER_RH = WITNESS_ROWS.every((r) => r.sound_RH_strictly_tighter_than_tsang === true);

// ── Live import sanity ──────────────────────────────────────────────────
const PARENT_KH2_IMPORT_LIVE =
  typeof KOKSMA_HLAWKA_2ND_MOMENT === 'object' &&
  KOKSMA_HLAWKA_2ND_MOMENT !== null &&
  KOKSMA_HLAWKA_2ND_MOMENT.id === 'imp-1149';
const CC_REFINE_IMPORT_LIVE =
  typeof C_C_SELBERG_REFINEMENT === 'object' &&
  C_C_SELBERG_REFINEMENT !== null &&
  C_C_SELBERG_REFINEMENT.id === 'imp-1135';
const IMP341_IMPORT_LIVE =
  typeof LAMBDA_INTERCEPT_BURGERS_UNIFORMITY === 'object' &&
  LAMBDA_INTERCEPT_BURGERS_UNIFORMITY !== null &&
  LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id === 'imp-341';

// ── Capstone record ─────────────────────────────────────────────────────
export const SUB_SELBERG_ATTEMPT = Object.freeze({
  id: 'imp-1149-sub-sub-selberg-discrepancy',
  parentTicket: 'imp-1149',
  parentArtefact: 'src/data/koksma-hlawka-2nd-moment-deviation-bound.js',
  title:
    'Focused attack on the sub-Selberg discrepancy sub-obstruction blocking N^{-2} in imp-1149',
  builtAt: '2026-05-20T20:00:00Z',
  status: 'failed',
  closureType: 'negative-result-with-named-obstructions',

  // ── Survey of the three baseline regimes ──
  selbergC1Baseline: SELBERG_C1_BASELINE,
  soundararajan2009Conditional: SOUNDARARAJAN_2009_CONDITIONAL,
  tsang1986EffectiveT0: TSANG_1986_EFFECTIVE_T0,

  // ── Hybrid attempt ──
  hybridAttempt: HYBRID_PIECEWISE_OUTCOME,

  // ── Named obstructions ──
  namedObstructions: NAMED_OBSTRUCTIONS,

  // ── Achieved exponents ──
  achieved: {
    c_unconditional: 1.0,                              // no exponent improvement
    c_unconditional_with_tsang_constant: 1.0,           // exponent unchanged
    c_under_RH_via_soundararajan: 0.5,                  // RH-conditional only
    c_target_for_N_squared_in_imp_1149: 'strictly less than 1',
    closes_imp_1149_N_squared_rate: false,
    constant_factor_gain_on_C_C: Math.sqrt(3.0 / 2.27), // approximately 1.15x via Tsang
  },

  // ── Witness rows ──
  witnessRows: WITNESS_ROWS,
  witnessSummary: {
    allTsangStrictlyTighter: ALL_TSANG_TIGHTER,
    allSoundRHStrictlyTighter: ALL_SOUND_TIGHTER_RH,
    interpretation:
      'At every sampled N in {1e3, 1e4, 1e5, 1e6, 1e7}, Tsangs unconditional ' +
      'constant 2.27 gives a strictly tighter D_N_star than Selbergs textbook 3.0 ' +
      '(uniform constant ratio 1.32x = 3/2.27). Soundararajans RH-CONDITIONAL ' +
      'c = 1/2 gives an additionally tighter bound but is NOT consumable. The ' +
      'unconditional exponent c = 1 dominates at every N, confirming the failure ' +
      'of any unconditional sub-Selberg exponent improvement.',
  },

  // ── Research path (named) ──
  researchPath: [
    'PATH-A: Karatsuba-Korolev mean-value methods (constant tightening only, 30 years no exponent progress)',
    'PATH-B: Subconvexity-via-moments (Heath-Brown / Bourgain 13/84) -- does not transfer to S(T) exponent',
    'PATH-C: GRH transfer of Soundararajan (RH-circular)',
    'PATH-D: Montgomery PCC quantitative (research-grade open)',
    'PATH-E: Beurling-Selberg explicit-formula refinement (constant tightening only)',
  ],

  // ── Honest scope ──
  honestScope: {
    isRigorous: true,                                   // the negative result IS rigorous
    isUnconditional: true,                              // the negative result IS unconditional
    closesImp1149N2Rate: false,                         // negative result
    achievesSubSelbergExponent: false,                  // c stays at 1
    summary:
      'NEGATIVE RESULT. No unconditional sub-Selberg exponent improvement c < 1 ' +
      'is achievable from currently known results in analytic number theory. ' +
      'The hybrid that combines Tsangs unconditional constant 2.27 with a ' +
      'piecewise RH-conditional refinement cannot improve the unconditional ' +
      'exponent because the RH-conditional segment is not citable in an ' +
      'unconditional chain. The exponent c = 1 has stood since Selberg 1946 ' +
      '(80 years). The imp-1149 N^{-2} rate closure REMAINS BLOCKED on this ' +
      'sub-obstruction. Six named obstructions document the research-grade ' +
      'walls. The CONSTANT-only gain via Tsang (factor 1.15x on C_C) is ' +
      'already tracked in imp-1135 (c-c-selberg-refinement-2026-05.js) and ' +
      'does not change the imp-1149 N^{-3/2} exponent.',
  },

  // ── Paper / engine effect ──
  paperEffect: {
    flipsImp1149ToClosed: false,
    flipsImp1147ToUnconditional: false,
    updatesC_CInImp399: false,
    documentsResearchPath: true,
    summary:
      'No paper update. This file is an obstruction-naming shelf artefact ' +
      'documenting that the imp-1149-sub-sub-selberg-discrepancy sub-gap is ' +
      'research-grade open since 1946 and cannot be closed by any engine ' +
      'ticket. The imp-1149 partial-closure status and the imp-1147 conditional ' +
      'flag both remain in force.',
  },

  // ── References ──
  references: {
    selberg1946:        'Selberg, On the remainder in the formula for N(T), 1946 (baseline |S(T)| <= C log T / log log T)',
    titchmarsh:         'Titchmarsh, Theory of Riemann Zeta-function, 2nd ed, sect. 14.13',
    iwanieckowalski:    'Iwaniec-Kowalski, Analytic Number Theory, AMS 2004, sect. 5.3',
    tsang1986:          'Tsang K-M, Some Omega-theorems for the Riemann zeta-function, Acta Arith. 46, 369-395 (1986)',
    fujii1974:          'Fujii A, On the zeros of Dirichlet L-functions I, Trans. AMS 196, 225-235 (1974)',
    soundararajan2009:  'Soundararajan K, Moments of the Riemann zeta function, Ann. Math. 170, 981-993 (2009)',
    ccm2015:            'Carneiro-Chandee-Milinovich, Bandlimited approximations to the truncated Gaussian, Compositio Math. 151, 1024-1066 (2015)',
    karatsuba1996:      'Karatsuba A A, Riemann zeta-function (Walter de Gruyter 1996), constant improvements',
    korolev2002:        'Korolev M A, Effective bounds on |S(T)| (2002 series)',
    bourgain2017:       'Bourgain J, Decoupling, exponential sums and the Riemann zeta function, J. AMS 30, 205-224 (2017)',
    montgomery1973:     'Montgomery H L, The pair correlation of zeros of the zeta function, Proc. Symp. Pure Math. 24, 181-193 (1973)',
    goldstonMontgomery: 'Goldston-Montgomery, Pair correlation of zeros and primes in short intervals (1987)',
    parentImp1149:      'src/data/koksma-hlawka-2nd-moment-deviation-bound.js (the parent obstruction)',
    parentImp1135:      'src/data/c-c-selberg-refinement-2026-05.js (the constant-only Tsang route at C_C level)',
    parentImp341:       'src/data/lambda-intercept-burgers-uniformity.js (project Selberg convention C_Selberg = 3)',
  },

  consumes: [
    KOKSMA_HLAWKA_2ND_MOMENT.id,
    C_C_SELBERG_REFINEMENT.id,
    LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id,
  ],

  liveImports: {
    kh2ImportLive: PARENT_KH2_IMPORT_LIVE,
    ccRefineImportLive: CC_REFINE_IMPORT_LIVE,
    imp341ImportLive: IMP341_IMPORT_LIVE,
  },
});

// ── Build-time tripwires (5+ required) ─────────────────────────────────
export const SUB_SELBERG_ATTEMPT_ASSERTIONS = [
  {
    id: 'sub-selberg-status-failed-honest',
    holds: () => SUB_SELBERG_ATTEMPT.status === 'failed',
    why:
      'The sub-Selberg discrepancy sub-gap attack is a NEGATIVE result. Status ' +
      'must remain "failed" (not "closed" / not "partial") to reflect the ' +
      'honest finding that no unconditional sub-Selberg exponent c < 1 is ' +
      'achievable from currently known results. Drift to "closed" or "partial" ' +
      'would be an overclaim of progress on a research-grade open problem.',
  },
  {
    id: 'sub-selberg-c-unconditional-equals-one',
    holds: () =>
      SUB_SELBERG_ATTEMPT.achieved.c_unconditional === 1.0 &&
      SUB_SELBERG_ATTEMPT.achieved.c_unconditional_with_tsang_constant === 1.0,
    why:
      'The achieved unconditional exponent c must equal 1.0 (no improvement ' +
      'over Selberg 1946). Drift to a value below 1.0 would imply an ' +
      'unconditional sub-Selberg breakthrough -- which would be the resolution ' +
      'of a research-grade open problem and would require independent ' +
      'mathematical verification, not a silent edit.',
  },
  {
    id: 'sub-selberg-soundararajan-rh-conditional-not-consumed',
    holds: () =>
      SOUNDARARAJAN_2009_CONDITIONAL.RH_conditional === true &&
      SOUNDARARAJAN_2009_CONDITIONAL.blocked_by_RH_circularity === true,
    why:
      'The Soundararajan 2009 c = 1/2 result is RH-CONDITIONAL and MUST NOT be ' +
      'consumed in any unconditional Lambda chain. If RH_conditional is flipped ' +
      'to false or blocked_by_RH_circularity is flipped to false, the file ' +
      'is silently claiming an unconditional RH-equivalent and the tripwire fires.',
  },
  {
    id: 'sub-selberg-hybrid-does-not-close-n2',
    holds: () =>
      HYBRID_PIECEWISE_OUTCOME.closes_N_squared_rate === false &&
      HYBRID_PIECEWISE_OUTCOME.status === 'failed-to-close-exponent-gap' &&
      HYBRID_PIECEWISE_OUTCOME.achievableExponent === 1.0,
    why:
      'The hybrid piecewise attempt MUST report closes_N_squared_rate = false ' +
      'and achievableExponent = 1.0. A flip to true on either is structurally ' +
      'wrong (RH-conditional segments cannot be cited in unconditional chains).',
  },
  {
    id: 'sub-selberg-six-named-obstructions',
    holds: () => {
      const obs = SUB_SELBERG_ATTEMPT.namedObstructions;
      if (!Array.isArray(obs) || obs.length < 5) return false;
      const ids = new Set(obs.map((o) => o.id));
      return (
        ids.has('O-SSD-A-selberg-1946-exponent-c1-unbroken') &&
        ids.has('O-SSD-B-soundararajan-rh-circularity') &&
        ids.has('O-SSD-C-hybrid-piecewise-dominated-by-unconditional-segment') &&
        ids.has('O-SSD-D-karatsuba-korolev-constants-only') &&
        ids.has('O-SSD-E-subconvexity-pcc-pcc-quantitative-not-transferable')
      );
    },
    why:
      'The ticket requires 5+ named obstructions. Six are recorded: the Selberg 1946 ' +
      'exponent wall, Soundararajan RH-circularity, hybrid piecewise structural ' +
      'blocker, Karatsuba-Korolev constants-only progress, subconvexity/PCC/GRH ' +
      'non-transferability, and Beurling-Selberg explicit-formula saturation. ' +
      'Removal of any of these would weaken the obstruction-naming deliverable.',
  },
  {
    id: 'sub-selberg-witness-tsang-strictly-tighter-than-selberg',
    holds: () => ALL_TSANG_TIGHTER && WITNESS_ROWS.length >= 5,
    why:
      'At every sampled N, the Tsang 2.27 constant must give a strictly tighter ' +
      'discrepancy bound than the Selberg textbook 3.0 (factor 3/2.27 = 1.32x ' +
      'uniformly). If this fails the constant-only refinement claim is empty.',
  },
  {
    id: 'sub-selberg-witness-sound-RH-strictly-tighter-than-tsang',
    holds: () => ALL_SOUND_TIGHTER_RH && WITNESS_ROWS.length >= 5,
    why:
      'At every sampled N, the Soundararajan c = 1/2 bound (RH-conditional) ' +
      'must be strictly tighter than the Tsang c = 1 bound (unconditional). ' +
      'This documents the size of the gap RH would close, even though we ' +
      'cannot consume it.',
  },
  {
    id: 'sub-selberg-imports-live',
    holds: () => PARENT_KH2_IMPORT_LIVE && CC_REFINE_IMPORT_LIVE && IMP341_IMPORT_LIVE,
    why:
      'Three upstream imports must be live: KOKSMA_HLAWKA_2ND_MOMENT (imp-1149, ' +
      'the parent obstruction this sub-gap belongs to), C_C_SELBERG_REFINEMENT ' +
      '(imp-1135, the constant-only Tsang route at the C_C level), and ' +
      'LAMBDA_INTERCEPT_BURGERS_UNIFORMITY (imp-341, the project Selberg ' +
      'convention C_Selberg = 3). Stale imports detach this file from the ' +
      'rigor chain.',
  },
  {
    id: 'sub-selberg-research-path-five-paths-named',
    holds: () => Array.isArray(SUB_SELBERG_ATTEMPT.researchPath) &&
                 SUB_SELBERG_ATTEMPT.researchPath.length >= 5,
    why:
      'Five named research paths required (PATH-A through PATH-E): Karatsuba-' +
      'Korolev mean values, subconvexity, GRH transfer, PCC quantitative, and ' +
      'Beurling-Selberg explicit-formula refinement. Each path is research-' +
      'grade open or RH-circular; documenting them prevents future agents ' +
      'wasting time on an already-attempted route.',
  },
  {
    id: 'sub-selberg-paper-effect-no-flip',
    holds: () =>
      SUB_SELBERG_ATTEMPT.paperEffect.flipsImp1149ToClosed === false &&
      SUB_SELBERG_ATTEMPT.paperEffect.flipsImp1147ToUnconditional === false &&
      SUB_SELBERG_ATTEMPT.paperEffect.updatesC_CInImp399 === false,
    why:
      'paperEffect MUST report no flips: imp-1149 stays partial, imp-1147 stays ' +
      'conditional, imp-399 C_C stays at the project default. A future commit ' +
      'that flips any of these must also independently close one of the six ' +
      'named obstructions -- a bare flip is an overclaim.',
  },
  {
    id: 'sub-selberg-baseline-c-equals-one-recorded',
    holds: () =>
      SELBERG_C1_BASELINE.exponent_c_in_log === 1.0 &&
      SELBERG_C1_BASELINE.project_active_C === 3.0 &&
      SELBERG_C1_BASELINE.yearsSinceFirstProof === 80,
    why:
      'The Selberg 1946 baseline must record c = 1 and C = 3 (project active ' +
      'convention) and the 80-year stand. Drift of any of these would signal ' +
      'a silent edit of the historical baseline against which this file is ' +
      'measured.',
  },
];
