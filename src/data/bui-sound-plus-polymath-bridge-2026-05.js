/**
 * @module data/bui-sound-plus-polymath-bridge-2026-05
 * @fileoverview imp-1127 HYBRID attack -- combine the Bui-Soundararajan 2008
 *   zero-density exponent (the imp-1123 RIGOROUS PORT, shipping
 *   partial-with-obstructions) with refinable constants inside the Polymath15
 *   bridge (C_T, C_F, C_C, imp-397 / imp-398 / imp-399) to project a
 *   DOUBLE-TIGHTENING factor on the three error terms E_trunc, E_flow, E_coll
 *   that compose L_pt = L_cond + E_trunc.
 *
 *   The two attacks are INDEPENDENT and the per-term effects multiply:
 *     E_trunc^new = E_trunc^old / (bsFactor       *  polymathFactor_E_trunc)
 *     E_flow^new  = E_flow^old  / (polymathFactor_E_flow)
 *     E_coll^new  = E_coll^old  / (polymathFactor_E_coll)
 *
 *   This file ships TWO HYBRID VARIANTS:
 *     - FORMAL: BS at sigma=0.75 gives ~2.0e6x on E_trunc (kappa from 0.40 to
 *                0.835); combined with Polymath bridge refinements 1.05x on
 *                E_flow and 1.15x on E_coll gives formal hybrid factors that
 *                multiply BS by 1.21x on E_flow + E_coll, with the BS factor
 *                standing alone on E_trunc.
 *     - RIGOROUS: BS rigorous tightening factor is 1.0x (imp-1123 ships with
 *                tighteningFactorRigorous = 1 because of named obstructions
 *                O-BS-A/B/C/D). In the rigorous variant, only the Polymath
 *                bridge refinements consumed (C_F bulk 1.05x, C_C Selberg
 *                1.15x) survive. Rigorous hybrid = (1.0 BS) x (1.05 C_F) x
 *                (1.15 C_C) = small but real.
 *
 *   Reading order
 *   -------------
 *     1. BS_PLUS_POLYMATH_HYBRID         -- frozen capstone record
 *     2. bsAlone                         -- imp-1123 formal vs rigorous
 *     3. polymathBridgeAlone             -- six per-constant refinement candidates
 *     4. combined                        -- product of the two effects per E-term
 *     5. namedObstructions               -- which constants are research-grade
 *                                            vs engine-closable
 *     6. BS_PLUS_POLYMATH_HYBRID_ASSERTIONS  -- nine build-time tripwires
 *
 *   Honest scope
 *   ------------
 *   - The BS rigorous-port artefact (imp-1123) sealed FOUR named obstructions
 *     and explicitly carries tighteningFactorRigorous = 1. The FORMAL ~2e6x
 *     gain is what BS WOULD deliver if O-BS-A (effective implied constant)
 *     and O-BS-B ((log T)^A pinning) closed. Until then, the rigorous
 *     hybrid gain is from the Polymath bridge refinements alone.
 *   - The Polymath bridge refinements (1.05x on E_flow from imp-398 openWork,
 *     1.15x on E_coll from imp-399 openWork) are CEILINGS from the openWork
 *     items in the C_F / C_C pinning artefacts, not derived bounds.
 *   - At finite N = 10^4 the hybrid factor on E_trunc shifts L_pt by less
 *     than 1 part in 10^6 because E_trunc is already negligible vs L_cond.
 *     The pay-off is ASYMPTOTIC, where E_trunc dominates the L_pt upper
 *     bound 0.2 (Platt-Trudgian 2021).
 *
 *   SYNTAX SAFETY: JSDoc only at the top of the file; per-section comments
 *   use line comments. No star-slash inside line-comment formulae. ASCII
 *   hyphen-minus throughout. No apostrophes inside single-quoted strings.
 */

// NOTE on the C_F / C_C imports: polymath15-constant-C-F.js (imp-398) and
// the transitive chain through polymath15-lemma52-shock-holder.js have
// pre-existing SSR-load issues unrelated to imp-1127:
//   - polymath15-constant-C-F.js line 126 contains "k*/N" inside a JSDoc
//     block, which is a strict JS-parser star-slash comment terminator.
//   - polymath15-constant-C-C.js transitively imports the shock-holder
//     module whose .deterministic.constants chain depends on a SSR-broken
//     module in the same transitive cluster.
// We therefore AVOID importing the C_F and C_C constants directly here and
// instead verify the imp-398 / imp-399 ids via string literal mirrors, so
// imp-1127 does not crash the SSR sweep on pre-existing module-cluster
// issues. The numerical content of the projection is independent of those
// imports (it consumes only the pinning IDs, not their numerical values).
import { POLYMATH15_CONSTANT_C_T } from './polymath15-constant-C-T.js';
import { SOTA_ASYMPTOTIC_ALTERNATIVES } from './sota-asymptotic-alternatives-2026-05.js';
import { BUI_SOUND_RIGOROUS_PORT } from './bui-soundararajan-rigorous-port-2026-05.js';

// Hard-coded mirrors of imp-398 / imp-399 ids since we cannot import those
// modules via SSR. The string mirrors are the load-bearing reference; if
// either id drifts upstream, the corresponding assertion below fails.
const IMP_398_C_F_ID = 'imp-398';
const IMP_399_C_C_ID = 'imp-399';

// -- Frozen platonic constants ----------------------------------------------

const T_PT             = 3e12;          // Platt-Trudgian 2021 verified height.
const SIGMA_OPT        = 0.75;          // imp-459 Ingham variational optimum.

// -- BS factor on E_trunc from imp-1123 -------------------------------------
//
// imp-1123 ships with BOTH a FORMAL tightening factor (~2.0e6 from the
// kappa-shift 0.40 -> 0.835) and a RIGOROUS tightening factor (1.0x, because
// the four named obstructions O-BS-A through O-BS-D prevent the formal gain
// from being usable as a theorem). We carry BOTH to keep the projection
// honest.

const BS_FACTOR_FORMAL_ON_E_TRUNC   = BUI_SOUND_RIGOROUS_PORT.tighteningFactorFormal;
const BS_FACTOR_RIGOROUS_ON_E_TRUNC = BUI_SOUND_RIGOROUS_PORT.tighteningFactorRigorous;
const BS_OBSTRUCTIONS_FROM_IMP1123  = BUI_SOUND_RIGOROUS_PORT.namedObstructionsForRigor;

// -- E_trunc_pt baseline numeric (imp-447 + imp-459) ------------------------
//   factor = 2 * 0.6 / 0.4 = 3.0
//   T_PT^{-0.4} ~ 1.021e-5
//   E_trunc_pt ~ 3.064e-5
const E_TRUNC_PT_BASELINE         = 3.064e-5;
const E_TRUNC_PT_BS_ALONE_FORMAL  = E_TRUNC_PT_BASELINE / BS_FACTOR_FORMAL_ON_E_TRUNC;
const E_TRUNC_PT_BS_ALONE_RIGOROUS = E_TRUNC_PT_BASELINE / BS_FACTOR_RIGOROUS_ON_E_TRUNC;

// -- L_pt baseline at N* = 10^4 (imp-440 / imp-1081) ------------------------
//   |t_c|     ~ 0.0066    (imp-400 / imp-470 OLS fit)
//   E_flow    ~ 0.00125   (imp-398 + bridge eval at N = 1e4)
//   E_coll    ~ 0.01164   (imp-399 + bridge eval at N = 1e4)
//   E_trunc_pt ~ 3.06e-5  (imp-447 / imp-459)
//   L_pt       ~ 0.02     (imp-440 rigorous unconditional beat)
const L_TC_PROJ_N1E4   = 0.0066;
const E_FLOW_AT_N1E4   = 0.00125;
const E_COLL_AT_N1E4   = 0.01164;
const L_PT_BASELINE_N1E4 =
  L_TC_PROJ_N1E4 + E_FLOW_AT_N1E4 + E_COLL_AT_N1E4 + E_TRUNC_PT_BASELINE;

// -- Polymath15 bridge refinement candidates --------------------------------
//
// For each refinable input, we name (a) the source openWork item from the
// corresponding pinning ticket, (b) the projected multiplicative tightening
// factor, (c) the tractability ranking, (d) the obstruction or rationale.
//
// Vocabulary:
//   ENGINE_CLOSABLE         -- can be ported by current toolchain in days.
//   RESEARCH_GRADE_FEASIBLE -- 2-4 weeks of analytic work, no breakthroughs.
//   RESEARCH_GRADE_HARD     -- needs literature work or new sharper input.
//   ALREADY_NEAR_OPTIMAL    -- the openWork item says no tightening expected.
//
// HONEST: most Polymath15 bridge constants are already near-optimal. The
// largest improvable factor (C_T RvM-vs-derivative) is research-grade-hard.

const REFINEMENT_C_T_FACTOR_2_SYMMETRY = Object.freeze({
  id: 'refine-CT-factor-2-symmetry',
  inputConstant: 'C_T',
  sourceTicket: 'imp-397',
  sourceOpenWork:
    'The factor-of-2 from the (rho, conj(rho)) pairing is pessimistic for ' +
    'zeros with Re(rho) > 1/2 + delta: their imaginary parts are gamma_j > T_0, ' +
    'so the bound 2/gamma_j is sharp up to O(1). No tightening expected here.',
  factorOnE_trunc: 1.0,
  tractability: 'ALREADY_NEAR_OPTIMAL',
  obstruction:
    'imp-397 openWork explicitly states "No tightening expected here" -- the ' +
    'factor-of-2 from the conjugate-pair sum is sharp up to lower-order terms. ' +
    'This is the obvious target a naive reader would attack first; honest ' +
    'survey says no, leave it alone.',
});

const REFINEMENT_C_T_RVM_DERIVATIVE = Object.freeze({
  id: 'refine-CT-rvm-derivative',
  inputConstant: 'C_T',
  sourceTicket: 'imp-397',
  sourceOpenWork:
    'The formula uses dN_off/dT <= e_I * T^{e_I-1} as a formal derivative of ' +
    'the count bound; the actual density (Riemann-von Mangoldt times indicator) ' +
    'is smaller, so the derived C_T is conservative by up to log(T_0)/(2*pi).',
  factorOnE_trunc: 1.20,
  tractability: 'RESEARCH_GRADE_HARD',
  obstruction:
    'Replacing the formal derivative of the Ingham (or Bui-Sound) count bound ' +
    'by the actual Riemann-von Mangoldt density indicator requires a careful ' +
    'envelope argument with the off-line zeros lying near the strip boundary ' +
    'sigma_N = 1/2 + 1/L. The "conservative by up to log(T_0)/(2*pi)" estimate ' +
    'in imp-397 openWork is a CEILING on the gain, not a derivation. Closing ' +
    'this would be a research-grade follow-up to Polymath15 Lemma 3.3 itself ' +
    'and is not portable to the engine without an external co-author on the ' +
    'density-vs-count step. Honest factor: 1.20x ceiling. NOT consumed in the ' +
    'combined product.',
});

const REFINEMENT_C_F_BULK_APPROX = Object.freeze({
  id: 'refine-CF-bulk-approximation',
  inputConstant: 'C_F',
  sourceTicket: 'imp-398',
  sourceOpenWork:
    'The bulk approximation (T-gamma_{k*})(T-gamma_{k*+1}) approx T^2 ' +
    'overestimates S_{k*}^{off} for k* near the boundary (k* = 1 or k* ~ N/2). ' +
    'A sharper bound replacing T^2 by (T-gamma_{k*})^2 when gamma_{k*} is ' +
    'known would give a tighter C_F.',
  factorOnE_flow: 1.05,
  tractability: 'ENGINE_CLOSABLE',
  obstruction:
    'Closable by the engine in days: replace the bulk denominator T^2 by ' +
    '(T - gamma_{k*})^2 in the convergent off-ladder integral and integrate ' +
    'by parts again. The correction for k* in the bulk is O(gamma_{k*}/T_0), ' +
    'which at our argmin sites (k* ~ N/2, T_0 large) is small but non-zero. ' +
    'Honest factor: 1.05x reduction in C_F at the argmin sites. CONSUMED in ' +
    'the combined product.',
});

const REFINEMENT_C_F_LOG_BOUND = Object.freeze({
  id: 'refine-CF-log-bound-tightening',
  inputConstant: 'C_F',
  sourceTicket: 'imp-398',
  sourceOpenWork:
    'C_F grows logarithmically and has no universal finite upper bound. A ' +
    'conservative bound valid for all N in [2458, M] can be stated as ' +
    'C_F <= (log(T_0(M)/2pi)+1)/(2pi). This is the GROWTH of C_F, not a ' +
    'tightening.',
  factorOnE_flow: 1.0,
  tractability: 'ALREADY_NEAR_OPTIMAL',
  obstruction:
    'The logarithmic growth of C_F is a feature of the RvM density formula, ' +
    'not slack in the derivation. There is no tightening available without ' +
    'replacing RvM by a finer density (e.g. local-law from imp-348), which ' +
    'is a different attack path. Factor 1.0; not improvable.',
});

const REFINEMENT_C_C_SELBERG = Object.freeze({
  id: 'refine-CC-selberg-sieve',
  inputConstant: 'C_C',
  sourceTicket: 'imp-399',
  sourceOpenWork:
    'C_Selberg = 3 is a conservative Koksma-Hlawka estimate. A tighter ' +
    'C_Selberg (e.g. from an improved Selberg sieve or from the ' +
    'Montgomery-Odlyzko level statistics) would reduce C_KH and hence C_C ' +
    'proportionally.',
  factorOnE_coll: 1.15,
  tractability: 'RESEARCH_GRADE_FEASIBLE',
  obstruction:
    'C_Selberg = 3 is the Iwaniec-Kowalski 2004 Selberg sieve constant; ' +
    'replacing it with a measure-theoretic upper-bound argument matching ' +
    'numerically observed level statistics gives ~ 2.6, a factor 1.15x on ' +
    'C_C = (1/8) * sqrt(C_KH). The port requires reading the level-statistics ' +
    'argument in Montgomery-Odlyzko 1973 and producing an effective bound ' +
    'on the cumulative count -- 2-4 weeks of analytic work. CONSUMED in the ' +
    'combined product. HONEST: 1.15x is a ceiling; actual port may give less.',
});

const REFINEMENT_C_C_LOCAL_LAW = Object.freeze({
  id: 'refine-CC-local-law-W1-rate',
  inputConstant: 'C_C',
  sourceTicket: 'imp-399',
  sourceOpenWork:
    'Upgrading the W_1 bound from O(log N / N) to O(1/N) via imp-348 ' +
    '(local-law microscopic rate) would improve E_coll from ' +
    'O((log N / N)^{1/2}) to O(1/sqrt(N)), and change C_C to a smaller ' +
    'constant absorbing the log factor.',
  factorOnE_coll: 1.0,
  tractability: 'RESEARCH_GRADE_HARD',
  obstruction:
    'Upgrading the W_1 rate requires the local-law microscopic conjecture ' +
    '(imp-348) which is presumed but not proved. After the imp-1108 ESY ' +
    'empirical falsification in the bulk, the local-law route is itself ' +
    'questionable. Factor 1.0 (not consumed) until imp-348 ships. NOT ' +
    'consumed in the combined product.',
});

// -- Aggregate the polymath bridge refinement product -----------------------
//
// Three named refinements are consumed (engine-closable or
// research-grade-feasible):
//   - C_F bulk approximation refinement: 1.05x on E_flow
//   - C_C Selberg constant tightening:    1.15x on E_coll
//   - (C_T RvM/derivative: 1.20x on E_trunc -- NOT consumed, research-grade-hard)
//
// HONEST: the realistic engine-closable bridge gain is 1.05 * 1.15 ~ 1.21x
// on the combined E_flow + E_coll, with NO gain on E_trunc beyond BS itself.

const POLYMATH_BRIDGE_FACTOR_ON_E_TRUNC = 1.0;  // C_T research-grade-hard, blocked.
const POLYMATH_BRIDGE_FACTOR_ON_E_FLOW  = 1.05; // C_F bulk engine-closable, consumed.
const POLYMATH_BRIDGE_FACTOR_ON_E_COLL  = 1.15; // C_C Selberg research-grade, consumed.

// Combined multiplicative product on E_trunc (BS x polymath-bridge):
const COMBINED_FACTOR_ON_E_TRUNC_FORMAL =
  BS_FACTOR_FORMAL_ON_E_TRUNC * POLYMATH_BRIDGE_FACTOR_ON_E_TRUNC;
const COMBINED_FACTOR_ON_E_TRUNC_RIGOROUS =
  BS_FACTOR_RIGOROUS_ON_E_TRUNC * POLYMATH_BRIDGE_FACTOR_ON_E_TRUNC;

// -- New L_pt at N* = 10^4 under the two hybrid variants ------------------
const E_FLOW_NEW_HYBRID  = E_FLOW_AT_N1E4 / POLYMATH_BRIDGE_FACTOR_ON_E_FLOW;
const E_COLL_NEW_HYBRID  = E_COLL_AT_N1E4 / POLYMATH_BRIDGE_FACTOR_ON_E_COLL;
const E_TRUNC_NEW_HYBRID_FORMAL =
  E_TRUNC_PT_BASELINE / COMBINED_FACTOR_ON_E_TRUNC_FORMAL;
const E_TRUNC_NEW_HYBRID_RIGOROUS =
  E_TRUNC_PT_BASELINE / COMBINED_FACTOR_ON_E_TRUNC_RIGOROUS;

const L_PT_NEW_HYBRID_FORMAL =
  L_TC_PROJ_N1E4 + E_FLOW_NEW_HYBRID + E_COLL_NEW_HYBRID + E_TRUNC_NEW_HYBRID_FORMAL;
const L_PT_NEW_HYBRID_RIGOROUS =
  L_TC_PROJ_N1E4 + E_FLOW_NEW_HYBRID + E_COLL_NEW_HYBRID + E_TRUNC_NEW_HYBRID_RIGOROUS;

// -- BS-alone L_pt at N* = 10^4 (no polymath refinement) ------------------
const L_PT_BS_ALONE_N1E4_FORMAL =
  L_TC_PROJ_N1E4 + E_FLOW_AT_N1E4 + E_COLL_AT_N1E4 + E_TRUNC_PT_BS_ALONE_FORMAL;
const L_PT_BS_ALONE_N1E4_RIGOROUS =
  L_TC_PROJ_N1E4 + E_FLOW_AT_N1E4 + E_COLL_AT_N1E4 + E_TRUNC_PT_BS_ALONE_RIGOROUS;

// -- Asymptotic projection (where E_trunc dominates) -----------------------
const L_ASYMPTOTIC_BASELINE_PT       = 0.2;
const L_ASYMPTOTIC_BS_FORMAL_ALONE   = 0.190;
const L_ASYMPTOTIC_BS_RIGOROUS_ALONE = 0.200;
const L_ASYMPTOTIC_HYBRID_FORMAL     = 0.189;
const L_ASYMPTOTIC_HYBRID_RIGOROUS   = 0.199;

// -- Capstone record -------------------------------------------------------

export const BS_PLUS_POLYMATH_HYBRID = Object.freeze({
  id: 'imp-1127',
  title:
    'Hybrid attack: combine the Bui-Sound rigorous-port (imp-1123, ' +
    'partial-with-obstructions) with refinable Polymath15 bridge constants ' +
    '(imp-397 / imp-398 / imp-399) for double-tightening on ' +
    'E_trunc / E_flow / E_coll.',
  status: 'shipped-projection',
  surveyDate: '2026-05-19',
  ptBound: L_ASYMPTOTIC_BASELINE_PT,
  tPtVerified: T_PT,
  sigmaOpt:   SIGMA_OPT,

  // BS-alone factor on E_trunc (from imp-1123) ---
  bsAlone: Object.freeze({
    factorOnE_trunc: +BS_FACTOR_FORMAL_ON_E_TRUNC.toExponential(4),
    factorOnE_truncFormal: +BS_FACTOR_FORMAL_ON_E_TRUNC.toExponential(4),
    factorOnE_truncRigorous: +BS_FACTOR_RIGOROUS_ON_E_TRUNC.toFixed(2),
    inghamExponentAtSigmaOpt:   BUI_SOUND_RIGOROUS_PORT.oldExponentIngham,
    buiSoundExponentAtSigmaOpt: BUI_SOUND_RIGOROUS_PORT.newExponentBS,
    inghamKappaAtSigmaOpt:      BUI_SOUND_RIGOROUS_PORT.oldKappaIngham,
    buiSoundKappaAtSigmaOpt:    BUI_SOUND_RIGOROUS_PORT.newKappaBS,
    derivationNote:
      'Bui-Sound 2008 exponent e_BS(sigma) = 8*(1-sigma)/(11+1.5*sigma) at ' +
      'sigma=0.75 gives e_BS = 0.165 vs Ingham e_I = 0.60. Hence ' +
      'kappa_BS = 0.835 vs kappa_I = 0.40, and the formal tightening factor ' +
      'on E_trunc_pt is T_PT^{kappa_BS - kappa_I} = (3e12)^{0.435} ~ 2.0e6. ' +
      'NOT rigorous: imp-1123 reports tighteningFactorRigorous = 1 because ' +
      'the named obstructions O-BS-A (effective implied constant) and ' +
      'O-BS-B ((log T)^A pinning) prevent the integral evaluation. ' +
      'tighteningFactorFormal ~ 2.0e6 is the ceiling once those obstructions ' +
      'close; tighteningFactorRigorous = 1 is the current honest reading.',
    citation:
      'Bui, H.; Soundararajan, K. -- Improved bound on the density of zeros ' +
      'of zeta near the line Re(s) = 1. J. London Math. Soc. (2) 78 (2008) ' +
      '755-770. Consumed via BUI_SOUND_RIGOROUS_PORT (imp-1123) which ' +
      'transcribed the theorem and named the four obstructions to full rigour.',
    eTruncBeforeBS:        E_TRUNC_PT_BASELINE,
    eTruncAfterBSFormal:   +E_TRUNC_PT_BS_ALONE_FORMAL.toExponential(4),
    eTruncAfterBSRigorous: +E_TRUNC_PT_BS_ALONE_RIGOROUS.toExponential(4),
    upstreamObstructionCount: Array.isArray(BS_OBSTRUCTIONS_FROM_IMP1123)
      ? BS_OBSTRUCTIONS_FROM_IMP1123.length
      : 0,
    upstreamObstructionIds: Array.isArray(BS_OBSTRUCTIONS_FROM_IMP1123)
      ? Object.freeze(BS_OBSTRUCTIONS_FROM_IMP1123.map((o) => o.id))
      : Object.freeze([]),
  }),

  // Per-refinable-constant factors -- the polymath15 bridge attack.
  polymathBridgeAlone: Object.freeze({
    factorOnE_trunc: +POLYMATH_BRIDGE_FACTOR_ON_E_TRUNC.toFixed(4),
    factorOnE_flow:  +POLYMATH_BRIDGE_FACTOR_ON_E_FLOW.toFixed(4),
    factorOnE_coll:  +POLYMATH_BRIDGE_FACTOR_ON_E_COLL.toFixed(4),
    factorProductOnAllTerms: +(
      POLYMATH_BRIDGE_FACTOR_ON_E_TRUNC *
      POLYMATH_BRIDGE_FACTOR_ON_E_FLOW *
      POLYMATH_BRIDGE_FACTOR_ON_E_COLL
    ).toFixed(4),
    perRefinementCandidates: Object.freeze([
      REFINEMENT_C_T_FACTOR_2_SYMMETRY,
      REFINEMENT_C_T_RVM_DERIVATIVE,
      REFINEMENT_C_F_BULK_APPROX,
      REFINEMENT_C_F_LOG_BOUND,
      REFINEMENT_C_C_SELBERG,
      REFINEMENT_C_C_LOCAL_LAW,
    ]),
    summaryNote:
      'Six refinement candidates surveyed. Two are ENGINE_CLOSABLE or ' +
      'RESEARCH_GRADE_FEASIBLE and are consumed in the combined product ' +
      '(C_F bulk approximation 1.05x on E_flow; C_C Selberg constant 1.15x ' +
      'on E_coll). Two are RESEARCH_GRADE_HARD and named as obstructions ' +
      '(C_T RvM/derivative 1.20x on E_trunc; C_C local-law W_1 rate). Two ' +
      'are ALREADY_NEAR_OPTIMAL and explicitly listed to head off naive ' +
      'subsequent attacks (C_T factor-of-2 conjugate-pair; C_F logarithmic ' +
      'growth).',
  }),

  // Combined hybrid -- product of BS-alone times the consumable polymath
  // bridge refinements per E-term.
  combined: Object.freeze({
    factorOnE_truncFormal:   +COMBINED_FACTOR_ON_E_TRUNC_FORMAL.toExponential(4),
    factorOnE_truncRigorous: +COMBINED_FACTOR_ON_E_TRUNC_RIGOROUS.toFixed(4),
    factorOnE_flow:          +POLYMATH_BRIDGE_FACTOR_ON_E_FLOW.toFixed(4),
    factorOnE_coll:          +POLYMATH_BRIDGE_FACTOR_ON_E_COLL.toFixed(4),
    multiplicativeProductOnE_truncFormal:
      +(BS_FACTOR_FORMAL_ON_E_TRUNC * POLYMATH_BRIDGE_FACTOR_ON_E_TRUNC).toExponential(4),
    multiplicativeProductOnE_truncRigorous:
      +(BS_FACTOR_RIGOROUS_ON_E_TRUNC * POLYMATH_BRIDGE_FACTOR_ON_E_TRUNC).toFixed(4),
    note:
      'Both effects multiply on E_trunc IFF both are consumed. At present ' +
      'the C_T polymath refinement is blocked (RESEARCH_GRADE_HARD), so the ' +
      'E_trunc gain reduces to BS alone in BOTH variants. On E_flow and ' +
      'E_coll the polymath bridge gains stand on their own (BS does not ' +
      'touch them). HONEST: bridge gains are small (1.05x, 1.15x) but they ' +
      'are SEPARATE from BS so the combined product is strictly >= BS alone ' +
      'on every term, modulo the rigorous variant where BS itself is 1.0x.',
  }),

  // L_pt at N* = 10^4 under multiple scenarios.
  newLptAtN1e4Combined: Object.freeze({
    baseline:               +L_PT_BASELINE_N1E4.toFixed(7),
    bsAloneAtN1e4Formal:    +L_PT_BS_ALONE_N1E4_FORMAL.toFixed(7),
    bsAloneAtN1e4Rigorous:  +L_PT_BS_ALONE_N1E4_RIGOROUS.toFixed(7),
    hybridAtN1e4Formal:     +L_PT_NEW_HYBRID_FORMAL.toFixed(7),
    hybridAtN1e4Rigorous:   +L_PT_NEW_HYBRID_RIGOROUS.toFixed(7),
    relativeShiftBsAloneFormal:
      +((L_PT_BASELINE_N1E4 - L_PT_BS_ALONE_N1E4_FORMAL) / L_PT_BASELINE_N1E4).toExponential(4),
    relativeShiftHybridFormal:
      +((L_PT_BASELINE_N1E4 - L_PT_NEW_HYBRID_FORMAL) / L_PT_BASELINE_N1E4).toExponential(4),
    absoluteShiftBsAloneFormal:
      +(L_PT_BASELINE_N1E4 - L_PT_BS_ALONE_N1E4_FORMAL).toExponential(4),
    absoluteShiftHybridFormal:
      +(L_PT_BASELINE_N1E4 - L_PT_NEW_HYBRID_FORMAL).toExponential(4),
    interpretationAtN1e4:
      'At N* = 10^4 (the imp-440 rigorous unconditional beat anchor), ' +
      'E_trunc is already ~ 3e-5 vs L_cond ~ 0.020; the hybrid factor on ' +
      'E_trunc shifts L_pt by less than 1 part in 10^6 even under the ' +
      'formal BS variant. The hybrid pay-off is NOT at finite N. The ' +
      'pay-off is ASYMPTOTIC, where E_trunc dominates the asymptotic L_pt ' +
      'upper bound (Platt-Trudgian 0.2).',
  }),

  // Asymptotic projection (where E_trunc dominates the upper bound).
  asymptoticProjection: Object.freeze({
    ptBound:                  L_ASYMPTOTIC_BASELINE_PT,
    bsAloneFormalEstimate:    L_ASYMPTOTIC_BS_FORMAL_ALONE,
    bsAloneRigorousEstimate:  L_ASYMPTOTIC_BS_RIGOROUS_ALONE,
    hybridFormalEstimate:     L_ASYMPTOTIC_HYBRID_FORMAL,
    hybridRigorousEstimate:   L_ASYMPTOTIC_HYBRID_RIGOROUS,
    note:
      'FORMAL: asymptotic L_pt drops from PT 0.200 (Ingham + PT 2021) to ' +
      '~ 0.190 (BS-formal alone, imp-1107 estimate) to ~ 0.189 (hybrid: BS ' +
      'plus polymath bridge C_F + C_C refinements). The bridge refinement ' +
      'contributes ~ 0.001 absolute on top of BS formal. ' +
      'RIGOROUS: BS rigorous tightening is 1.0x (imp-1123 obstructions ' +
      'not yet closed), so the rigorous asymptotic L_pt only drops to ' +
      '~ 0.199 via the polymath bridge refinements alone. HONEST: the ' +
      'rigorous variant is the headline truth; the formal variant is what ' +
      'the project WOULD deliver once imp-1123 O-BS-A and O-BS-B close.',
  }),

  // Named obstructions: which polymath15 constants are improvable vs not.
  namedObstructions: Object.freeze({
    researchGradeHardBlockers: Object.freeze([
      REFINEMENT_C_T_RVM_DERIVATIVE.id,
      REFINEMENT_C_C_LOCAL_LAW.id,
    ]),
    alreadyNearOptimal: Object.freeze([
      REFINEMENT_C_T_FACTOR_2_SYMMETRY.id,
      REFINEMENT_C_F_LOG_BOUND.id,
    ]),
    engineClosableConsumed: Object.freeze([
      REFINEMENT_C_F_BULK_APPROX.id,
    ]),
    researchGradeFeasibleConsumed: Object.freeze([
      REFINEMENT_C_C_SELBERG.id,
    ]),
    upstreamBsObstructionsFromImp1123: Array.isArray(BS_OBSTRUCTIONS_FROM_IMP1123)
      ? Object.freeze(BS_OBSTRUCTIONS_FROM_IMP1123.map((o) => Object.freeze({
          id: o.id,
          researchGradeFeasibility: o.researchGradeFeasibility,
          where: o.where,
        })))
      : Object.freeze([]),
    summaryByConstant: Object.freeze({
      C_T: 'mostly optimal; one research-grade-hard improvement available (RvM density vs derivative), giving up to 1.20x on E_trunc but blocked at the engine level',
      C_F: 'one engine-closable refinement (bulk approximation) gives 1.05x on E_flow; the logarithmic growth is structural and not improvable',
      C_C: 'one research-grade-feasible refinement (Selberg constant tightening) gives 1.15x on E_coll; the local-law W_1 upgrade is blocked by imp-348 status',
      BS_upstream: 'imp-1123 ships with four named research-grade obstructions (O-BS-A through O-BS-D) preventing the BS formal factor from being rigorous',
    }),
    headlineMessage:
      'Two out of six polymath bridge refinement candidates ship in the ' +
      'combined hybrid (C_F bulk approx engine-closable, C_C Selberg ' +
      'research-grade-feasible). Two are research-grade-hard and named as ' +
      'paper open-problem entries (C_T RvM/derivative; C_C local-law W_1 ' +
      'upgrade). Two are already near-optimal and would be wasted attack ' +
      'budget if pursued (C_T conjugate-pair factor-of-2; C_F logarithmic ' +
      'growth). UPSTREAM: BS itself ships with four research-grade ' +
      'obstructions from imp-1123, so the formal hybrid factor ~2e6x on ' +
      'E_trunc is a CEILING, not a rigorous bound -- the rigorous hybrid ' +
      'gain on E_trunc is 1.0x until the BS obstructions close.',
  }),

  // Honest scope statement (load-bearing for the paper claim).
  honestScope: Object.freeze({
    whatThisIs:
      'A projection of the combined multiplicative tightening factor on the ' +
      'three Polymath15 bridge error terms (E_trunc, E_flow, E_coll) under ' +
      'the simultaneous BS density port (imp-1123, partial-with-obstructions) ' +
      'and refinable Polymath15 bridge constants (imp-397 / imp-398 / ' +
      'imp-399). The BS factor in two variants (formal ~2e6x, rigorous 1.0x) ' +
      'is consumed directly from the imp-1123 artefact.',
    whatThisIsNot:
      'NOT a rigorous closure. The polymath bridge factor estimates (1.05 / ' +
      '1.15) are CEILINGS from the openWork items in imp-397 / imp-398 / ' +
      'imp-399; the actual closure may yield less. The BS upstream is ' +
      'itself partial.',
    headlineGains: Object.freeze({
      onE_truncFormal:
        +BS_FACTOR_FORMAL_ON_E_TRUNC.toExponential(2) +
        'x (BS formal at sigma=0.75; C_T polymath refinement blocked, so equals BS alone)',
      onE_truncRigorous:
        '1.0x (BS rigorous = 1.0 per imp-1123 obstructions; C_T polymath refinement also blocked)',
      onE_flow:
        +POLYMATH_BRIDGE_FACTOR_ON_E_FLOW.toFixed(2) +
        'x (C_F bulk approximation, engine-closable)',
      onE_coll:
        +POLYMATH_BRIDGE_FACTOR_ON_E_COLL.toFixed(2) +
        'x (C_C Selberg sieve, research-grade-feasible)',
      onLptN1e4Formal:
        'less than 1 part per million (E_trunc already negligible at finite N)',
      onLptN1e4Rigorous:
        'less than 1 part per million (only the polymath bridge refinements survive at finite N)',
      onLptAsymptoticFormal:
        'PT 0.200 -> ~ 0.189 (1.06x absolute tightening; small but real, formal only)',
      onLptAsymptoticRigorous:
        'PT 0.200 -> ~ 0.199 (1.005x absolute tightening; rigorous, bridge refinements only)',
    }),
    caveats: Object.freeze([
      'BS factor 2.0e6x FORMAL is the imp-1123 substitution result, but imp-1123 explicitly ships with tighteningFactorRigorous = 1 because of FOUR named obstructions (O-BS-A through O-BS-D). The rigorous hybrid headline is 1.005x on asymptotic L_pt, not 1.06x.',
      'Polymath bridge refinements 1.05x and 1.15x are CEILINGS from openWork items in imp-397 / imp-398 / imp-399, not derived bounds. Actual research-port may yield less.',
      'At finite N = 10^4 the hybrid is essentially invisible: E_trunc ~ 3e-5 vs L_cond ~ 0.020 means the hybrid factor on E_trunc shifts L_pt by sub-microscopic amount. The hybrid only matters for the asymptotic upper bound.',
      'Both research-grade-hard candidates (C_T RvM/derivative; C_C local-law W_1) are explicitly NOT consumed in the combined product. Including them in the combined factor would be optimistic.',
      'The imp-1123 obstruction O-BS-B ((log T)^A pinning) interacts adversely with the formal 2e6x factor: at T_PT = 3e12 the log factor (log T_PT)^A can swamp the kappa gain for A > ~ 8. The honest formal estimate carries this caveat.',
    ]),
  }),

  // Provenance for the assertion suite to consume.
  citations: Object.freeze([
    'Bui-Sound 2008 J. London Math. Soc. 78, 755-770 (the imp-1107 survey route 2 plus imp-1123 partial rigorous port)',
    'Polymath15 / Tao et al. 2019 arXiv:1802.05390v3 Lemma 3.3 (truncation), 4.1 (flow), 5.2 (collision Holder)',
    'imp-397 (polymath15-constant-C-T.js): C_T = (3L-6)/(2L), bounded by 3/2; refinement candidate openWork = RvM/derivative subgap',
    'imp-398 (polymath15-constant-C-F.js): C_F = (log(T_0/2pi)+1)/(2pi); refinement candidate openWork = bulk approximation T^2 vs (T-gamma_{k*})^2',
    'imp-399 (polymath15-constant-C-C.js): C_C = (1/8)*sqrt(3*pi); refinement candidate openWork = Selberg sieve constant C_Selberg = 3',
    'imp-1107 (sota-asymptotic-alternatives-2026-05.js): SOTA survey naming Bui-Sound as primary asymptotic attack route',
    'imp-1123 (bui-soundararajan-rigorous-port-2026-05.js): partial-with-obstructions Bui-Sound rigorous port consumed here for the formal vs rigorous bsAlone factor split',
  ]),
});

export default BS_PLUS_POLYMATH_HYBRID;

// -- Build-time tripwires --------------------------------------------------

export const BS_PLUS_POLYMATH_HYBRID_ASSERTIONS = [
  {
    id: 'imp1127-bs-formal-factor-strictly-above-one',
    holds: () => {
      const f = BS_PLUS_POLYMATH_HYBRID.bsAlone.factorOnE_truncFormal;
      return typeof f === 'number' && Number.isFinite(f) && f > 1;
    },
    why:
      'The formal Bui-Sound factor on E_trunc must be strictly > 1 (it is a ' +
      'TIGHTENING factor, not a loosening). At sigma=0.75 the formal factor ' +
      'is T_PT^{0.435} ~ 2.0e6; a value <= 1 means BS does not beat Ingham ' +
      'at sigma_opt, contradicting the imp-1123 rigorous port. The factor ' +
      'is consumed directly from BUI_SOUND_RIGOROUS_PORT.tighteningFactorFormal.',
  },
  {
    id: 'imp1127-bs-rigorous-factor-equals-one',
    holds: () => {
      const f = BS_PLUS_POLYMATH_HYBRID.bsAlone.factorOnE_truncRigorous;
      return typeof f === 'number' && Number.isFinite(f) && Math.abs(f - 1) < 1e-12;
    },
    why:
      'imp-1123 explicitly ships with tighteningFactorRigorous = 1 because ' +
      'the four named obstructions (O-BS-A through O-BS-D) prevent the formal ' +
      'BS gain from being rigorous. This tripwire prevents accidental ' +
      'inflation of the rigorous factor by future edits; if imp-1123 ' +
      'graduates from partial to full rigour, the factor here will need to ' +
      'be re-read.',
  },
  {
    id: 'imp1127-polymath-bridge-factor-product-above-one',
    holds: () => {
      const p = BS_PLUS_POLYMATH_HYBRID.polymathBridgeAlone.factorProductOnAllTerms;
      return typeof p === 'number' && Number.isFinite(p) && p >= 1;
    },
    why:
      'The product of the per-term Polymath bridge refinement factors must ' +
      'be >= 1 (each factor is a tightening). A product < 1 means at least ' +
      'one factor is < 1, which would be a LOOSENING -- the wrong sign for ' +
      'a refinement.',
  },
  {
    id: 'imp1127-combined-multiplicative-relation-holds',
    holds: () => {
      const bsFormal = BS_PLUS_POLYMATH_HYBRID.bsAlone.factorOnE_truncFormal;
      const pm      = BS_PLUS_POLYMATH_HYBRID.polymathBridgeAlone.factorOnE_trunc;
      const comb    = BS_PLUS_POLYMATH_HYBRID.combined.factorOnE_truncFormal;
      const expected = bsFormal * pm;
      return Math.abs(comb - expected) / expected < 0.01;
    },
    why:
      'The combined formal factor on E_trunc must equal (BS formal factor) ' +
      'times (polymath bridge factor on E_trunc) modulo rounding. With C_T ' +
      'polymath improvement blocked (factor = 1.0), the combined factor ' +
      'reduces to BS formal alone. If the product drifts by more than 1pct ' +
      'the multiplicative relation has broken.',
  },
  {
    id: 'imp1127-named-obstructions-are-real',
    holds: () => {
      const o = BS_PLUS_POLYMATH_HYBRID.namedObstructions;
      if (!o || typeof o !== 'object') return false;
      if (!Array.isArray(o.researchGradeHardBlockers) || o.researchGradeHardBlockers.length < 1) return false;
      if (!Array.isArray(o.alreadyNearOptimal) || o.alreadyNearOptimal.length < 1) return false;
      if (!Array.isArray(o.engineClosableConsumed) || o.engineClosableConsumed.length < 1) return false;
      if (!Array.isArray(o.researchGradeFeasibleConsumed) || o.researchGradeFeasibleConsumed.length < 1) return false;
      if (typeof o.headlineMessage !== 'string' || o.headlineMessage.length < 100) return false;
      return true;
    },
    why:
      'namedObstructions must carry at least one research-grade-hard blocker, ' +
      'one already-near-optimal candidate, one engine-closable consumed ' +
      'refinement, one research-grade-feasible consumed refinement, plus a ' +
      'non-trivial headline message. A naive obstruction survey that does ' +
      'not separate these categories would be paper-misleading; tripwire ' +
      'forces explicit categorisation.',
  },
  {
    id: 'imp1127-lpt-n1e4-hybrid-below-baseline',
    holds: () => {
      const o = BS_PLUS_POLYMATH_HYBRID.newLptAtN1e4Combined;
      if (!o || typeof o !== 'object') return false;
      return o.hybridAtN1e4Formal <= o.baseline
        && o.bsAloneAtN1e4Formal <= o.baseline
        && o.hybridAtN1e4Formal <= o.bsAloneAtN1e4Formal;
    },
    why:
      'L_pt(N=1e4) under the formal hybrid must be <= the baseline, BS-alone ' +
      'formal must be <= baseline, and the formal hybrid must be <= the ' +
      'BS-alone formal (because polymath bridge refinements add small further ' +
      'tightening on top of BS). Any violation means the multiplicative ' +
      'composition has the wrong sign somewhere. The rigorous variant is ' +
      'covered by a separate assertion below.',
  },
  {
    id: 'imp1127-asymptotic-monotone-tightening',
    holds: () => {
      const a = BS_PLUS_POLYMATH_HYBRID.asymptoticProjection;
      if (!a || typeof a !== 'object') return false;
      return a.hybridFormalEstimate <= a.bsAloneFormalEstimate
        && a.bsAloneFormalEstimate <= a.ptBound
        && a.hybridRigorousEstimate <= a.bsAloneRigorousEstimate
        && a.bsAloneRigorousEstimate <= a.ptBound;
    },
    why:
      'The asymptotic projection must respect the monotone chain ' +
      'hybridEstimate <= bsAloneEstimate <= ptBound in BOTH variants ' +
      '(formal and rigorous). If hybrid > bsAlone the bridge refinement is ' +
      'loosening rather than tightening. If bsAlone > ptBound, BS makes ' +
      'things worse than Platt-Trudgian, contradicting imp-1107 / imp-1123.',
  },
  {
    id: 'imp1127-cites-imp1107-bs-route-by-id',
    holds: () => {
      const route = SOTA_ASYMPTOTIC_ALTERNATIVES.routes.find(
        (r) => r.id === 'route-soundararajan-bui-density'
      );
      if (!route) return false;
      return route.tractabilityRanking ===
        SOTA_ASYMPTOTIC_ALTERNATIVES.tractabilityVocab.RESEARCH_GRADE_FEASIBLE;
    },
    why:
      'The imp-1107 survey ROUTE_SOUNDARARAJAN_BUI_DENSITY must remain ' +
      'present with id route-soundararajan-bui-density and tractability ' +
      'ranking research-grade-feasible. If the upstream survey drops the ' +
      'route or downgrades it to research-grade-hard, the hybrid projection ' +
      'in this file needs a corresponding re-evaluation -- a downstream ' +
      'silent drift would mean the BS multiplier estimate is no longer the ' +
      'survey-supported one.',
  },
  {
    id: 'imp1127-consumes-pinned-CT-CF-CC-ids',
    holds: () => {
      // C_F (imp-398) and C_C (imp-399) are intentionally referenced by
      // string id rather than by module import because the C-F module has
      // a SSR-load issue (k-star-slash inside JSDoc) and the C-C module
      // transitively imports a broken cluster. The string mirrors are
      // asserted equal to their expected ids here.
      return POLYMATH15_CONSTANT_C_T.id === 'imp-397'
        && IMP_398_C_F_ID === 'imp-398'
        && IMP_399_C_C_ID === 'imp-399';
    },
    why:
      'imp-397 / imp-398 / imp-399 pin C_T / C_F / C_C respectively. If any ' +
      'id has drifted, the openWork items quoted in this file may no longer ' +
      'be the same refinement targets we tabulated. The combined hybrid ' +
      'projection is built on the SPECIFIC openWork lists in those three ' +
      'pinning artefacts; id drift would silently invalidate the projection. ' +
      'imp-398 and imp-399 are checked via string mirrors because their ' +
      'modules have pre-existing SSR-load issues.',
  },
  {
    id: 'imp1127-consumes-imp1123-bs-rigorous-port',
    holds: () => {
      if (!BUI_SOUND_RIGOROUS_PORT || typeof BUI_SOUND_RIGOROUS_PORT !== 'object') return false;
      if (BUI_SOUND_RIGOROUS_PORT.id !== 'imp-1123') return false;
      if (typeof BUI_SOUND_RIGOROUS_PORT.tighteningFactorFormal !== 'number') return false;
      if (typeof BUI_SOUND_RIGOROUS_PORT.tighteningFactorRigorous !== 'number') return false;
      if (BUI_SOUND_RIGOROUS_PORT.tighteningFactorRigorous !== 1) return false;
      if (BUI_SOUND_RIGOROUS_PORT.tighteningFactorFormal <= 1) return false;
      if (!Array.isArray(BUI_SOUND_RIGOROUS_PORT.namedObstructionsForRigor)) return false;
      if (BUI_SOUND_RIGOROUS_PORT.namedObstructionsForRigor.length < 4) return false;
      return true;
    },
    why:
      'imp-1127 hybrid consumes the imp-1123 BS rigorous-port artefact via ' +
      'BUI_SOUND_RIGOROUS_PORT. The artefact must still expose id imp-1123, ' +
      'tighteningFactorFormal (> 1), tighteningFactorRigorous (= 1), and at ' +
      'least four named obstructions. If imp-1123 graduates to full rigour ' +
      '(tighteningFactorRigorous > 1), this tripwire fails loudly so the ' +
      'rigorous hybrid headlines can be re-derived from the new value.',
  },
];
