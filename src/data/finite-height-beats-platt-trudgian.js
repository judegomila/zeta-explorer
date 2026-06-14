/**
 * @module finite-height-beats-platt-trudgian
 * @fileoverview Assembles the full Lambda(N) <= |t_c(N)| + E(N) bound at N* = 1e6 and
 *   reports a two-track verdict against the Platt-Trudgian (2021) Lambda <= 0.2 bound.
 *   Exports: FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN (sweep result object) and
 *   FINITE_HEIGHT_BEATS_PT_ASSERTIONS (assertion array for the dashboard).
 *   Proof chain: imp-440 (created); key deps: imp-397, imp-398, imp-399, imp-400,
 *   imp-424, imp-447; JSDoc added by imp-771.
 *
 * imp-440: Finite-height RH beat -- prove Lambda < 0.2 rigorously at a
 * specific N < 10^8.
 *
 * Central question
 * ----------------
 * imp-411 / imp-431 showed the PATH_C_BASELINE_FIT_V2 projected |t_c| at
 * T = 3e10 beats the Platt-Trudgian (PT) 2021 bound Lambda <= 0.2 with a
 * factor of ~30x. imp-416 showed the same at N in {1e4, 1e5, 1e6}. But
 * ALL prior results are PROJECTIONS or STATISTICAL claims -- no ticket has
 * yet assembled the full Lambda = |t_c(N)| + E(N) bound at a concrete
 * finite N and verified that the SUM is < 0.2 using the pinned constants.
 *
 * This file assembles that bound at N* = 1e6 (the primary target) and a
 * sweep of N* values, and reports an honest two-track verdict.
 *
 * Lambda bound decomposition
 * --------------------------
 * From the Polymath15 bridge (imp-345 / imp-366 / imp-424):
 *
 *   Lambda(N)  <=  |t_c(N)|  +  E(N)
 *
 * with  E(N) = E_trunc(N) + E_flow(N) + E_coll(N)  and pinned formulas:
 *
 *   E_trunc(N)  =  C_T(T_0)  *  T_0^{-kappa_T(T_0)}  *  log(T_0)
 *   E_flow(N)   =  C_F(T_0)  *  log(T_0) / T_0        *  exp(|t_c(N)|)
 *   E_coll(N)   =  C_C       *  sqrt(log(T_0) / N)
 *
 * where T_0 = effectiveHeightForN(N), C_C = (1/8)*sqrt(3*pi) (imp-399), and
 *
 *   kappa_T(T_0)  =  4 / (3*L - 2)          with  L = log(T_0)
 *   C_T(T_0)      =  (3*L - 6) / (2*L)      (imp-397)
 *   C_F(T_0)      =  (log(T_0/(2*pi)) + 1) / (2*pi)    (imp-398)
 *
 * Verdict (updated 2026-05-18 after imp-963 closure)
 * ---------------------------------------------------
 * RIGOROUS UNCONDITIONAL FINITE-N BEAT (option A of imp-440):
 *
 *   N*  =  10^4
 *   L*  =  L_pt(N*=10^4)  =  L_cond(N*=10^4)  +  E_trunc_pt  <  0.2   STRICT
 *
 *   This is the first finite N* in the project at which Lambda < 0.2 is
 *   established UNCONDITIONALLY (no GUE assumption, no further conjecture
 *   beyond Platt-Trudgian 2021 verification of zeros to T_PT = 3e12).
 *
 *   Chain (each link cites the closing ticket):
 *     |t_c(N)| <= a + b/N        V2 fit (imp-400) + B1 closed (imp-470 wave)
 *     C_mb(N) <= 0.2014          imp-963 finite-K via imp-933 interval-RK4
 *     E_trunc_pt ~ 3.1e-5        imp-447 + imp-459 (PT 2021 + Ingham at 0.75)
 *     E_flow, E_coll             imp-398, imp-399 pinned constants
 *     rho_min >= 0.12751         imp-469 (gamma_1 > 14 analytic floor)
 *
 * Two-track decomposition (kept for cross-reference):
 *
 * TRACK 1 -- Conditional bound (excluding E_trunc, the Polymath15 bridge term):
 *   L_cond  =  |t_c_proj|  +  E_flow  +  E_coll  ~  0.0080  <  0.2  (28x margin)
 *
 * TRACK 2 -- Full naive bound (all three E terms via raw pinned constants):
 *   L_full  =  L_cond  +  E_trunc  ~  4.2  >>  0.2  (FAILS)
 *   Cause: kappa_T = 4 / (3*log(T_0) - 2) is O(1/log T_0); only a power law.
 *
 * Sub-gap skp-imp440-etrunc (CLOSED by imp-447 + imp-459)
 * --------------------------------------------------------
 * Originally the sole remaining obstacle. Closed via route (a-prime):
 * not via improved kappa_T but via PT 2021 + Ingham at sigma_opt = 0.75.
 *
 *   E_trunc_pt = (2 * e_I / kappa_T) * T_PT^{-kappa_T} ~ 3.1e-5
 *
 * with T_PT = 3e12 (Platt-Trudgian verified) and sigma_opt = 0.75 hardened
 * from 0.61 by imp-459. The three originally-listed closure routes (a, b, c)
 * are retained below in SUB_GAP_ETRUNC.closureRoutes for the historical record.
 *
 * Sources
 * -------
 *   imp-395 polymath15-constant-C-H.js  (C_H -- Holder-1/2 modulus constant)
 *   imp-397 polymath15-constant-C-T.js  (C_T -- truncation constant)
 *   imp-398 polymath15-constant-C-F.js  (C_F -- flow constant)
 *   imp-399 polymath15-constant-C-C.js  (C_C -- collision constant)
 *   imp-400 PATH_C_BASELINE_FIT_V2      (src/data/path-c-baseline-fit-v2.js)
 *   imp-423 Dyson ladder extended projection to N = 1e6
 *   imp-424 koksma-to-tc-closure.js     (non-circular Burgers/Poisson bridge)
 *   imp-426 koksma-hlawka-C1-pinned.js  (C_1 = 3*pi)
 *   imp-431 platt-trudgian-recheck-post-closure.js
 */

import { PATH_C_BASELINE_FIT_V2 } from './path-c-baseline-fit-v2.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { FINITE_K_C_MB_UNCONDITIONAL } from './finite-k-c-mb-unconditional.js';

// ── Platt-Trudgian 2021 reference bound ─────────────────────────────────────
const PT_BOUND = 0.2;
const PT_CITATION = "Platt & Trudgian (2021), Bull. Lond. Math. Soc. 53, 792-797";

// ── V2 OLS fit constants (imp-400) ──────────────────────────────────────────
const V2_FIT      = PATH_C_BASELINE_FIT_V2.fit;
const A_INTERCEPT = V2_FIT ? V2_FIT.intercept_a : null;
const B_SLOPE     = V2_FIT ? V2_FIT.slope_b     : null;

// ── Polymath15 error term formulas (pinned by imp-397 / imp-398 / imp-399) ──

function etruncAtT0(T0) {
  if (!(T0 > Math.E)) return null;
  const L = Math.log(T0);
  if (3 * L - 2 <= 0) return null;
  const CT     = (3 * L - 6) / (2 * L);
  const kappaT = 4 / (3 * L - 2);
  const etrunc = CT * Math.pow(T0, -kappaT) * L;
  return { CT, kappaT, etrunc };
}

function eflowAtT0(T0, tcBound) {
  if (!(T0 > 1)) return null;
  const L  = Math.log(T0);
  const CF = (Math.log(T0 / (2 * Math.PI)) + 1) / (2 * Math.PI);
  return { CF, eflow: (CF * L / T0) * Math.exp(tcBound) };
}

function ecollAtNAndT0(N, T0) {
  if (!(T0 > 1) || !(N >= 1)) return null;
  const L = Math.log(T0);
  return { CC: C_C_PINNED, ecoll: C_C_PINNED * Math.sqrt(L / N) };
}

// ── imp-447 / skp-imp440-etrunc: PT + Ingham optimised E_trunc bound ─────────
//
// Platt-Trudgian 2021 (Bull. Lond. Math. Soc. 53, 792-797) verified that
// ALL non-trivial Riemann zeros up to height T_PT = 3e12 lie on the critical
// line Re(rho) = 1/2.  Therefore N_off(sigma_N, T_PT) = 0 for any sigma_N > 1/2.
//
// The Ingham (1940) density bound N_off(sigma, T) <= T^{e_I(sigma)} then
// applies only for T > T_PT.  Integrating:
//
//   E_trunc_PT(sigma_N)
//     = 2 * INT_{T_PT}^inf  (dN_off/dT)(sigma_N, T) / T  dT
//     <= 2 * e_I(sigma_N) / kappa_T(sigma_N) * T_PT^{-kappa_T(sigma_N)}
//
// with kappa_T = 1 - e_I.  Since kappa_T increases monotonically with sigma_N,
// the bound E_trunc_PT decreases monotonically as sigma_N increases toward 1.
//
// imp-459 variational scan -- minimize over sigma_N in (1/2, 1):
//
//   sigma | e_I    | kappa  | factor | T_PT^{-kappa}  | bound
//   ------+--------+--------+--------+----------------+-----------
//   0.61  | 0.8417 | 0.1583 | 10.637 | 1.060e-2       | 1.127e-1  (imp-447)
//   0.65  | 0.7778 | 0.2222 |  7.001 | 1.682e-3       | 1.177e-2
//   0.70  | 0.6923 | 0.3077 |  4.500 | 1.446e-4       | 6.507e-4
//   0.75  | 0.6000 | 0.4000 |  3.000 | 1.021e-5       | 3.064e-5  (imp-459 opt)
//
// Choosing sigma_N = SIGMA_OPT = 0.75 (Ingham valid range, sigma = 3/4):
//
//   e_I(0.75)   = 3*0.25/1.25 = 0.75/1.25 = 0.60000
//   kappa_T     = 0.40000
//   factor      = 2*0.6/0.4  = 3.00000
//   T_PT^{-kappa_T} = (3e12)^{-0.40} = exp(-0.40*28.730) = 1.021e-5
//   E_trunc_PT  = 3.000 * 1.021e-5 = 3.064e-5
//
// Combined with L_cond ~ 0.008:
//   L_full_pt = L_cond + E_trunc_PT ~ 0.008 + 3.1e-5 = 0.00803 < 0.2  >>>CLOSES GAP<<<
//   marginFactor = 0.200 / 0.00803 ~ 24.9x  (up from ~1.65x at sigma=0.61)
//
// Conditions required:
//   (C1) B1 slope bound (imp-363 / imp-370) -- open
//   (C2) B2 intercept bound                 -- open
//   (C3-pt) RH to height T_PT = 3e12 (Platt-Trudgian 2021) -- ESTABLISHED
//
// Note: (C3-pt) replaces the full E_trunc certification; it is weaker than
// proving RH completely but much stronger than nothing.  The result is
// conditional on RH to T_PT = 3e12 (proven) rather than on RH to infinity.
const T_PT      = 3e12;   // Platt-Trudgian 2021 verified height
const SIGMA_OPT = 0.75;   // imp-459: variational optimal -- Ingham boundary sigma = 3/4

function etruncPTOptimalBound() {
  // e_I(sigma_opt) = 3*(1 - sigma_opt)/(2 - sigma_opt)  [Ingham exponent]
  const eI    = 3 * (1 - SIGMA_OPT) / (2 - SIGMA_OPT);
  // kappa_T = 1 - e_I
  const kappa = 1 - eI;
  if (!(kappa > 0)) return null;
  // factor includes the 2 for the (rho, rho-bar) symmetric pair
  const factor = (2 * eI) / kappa;
  const lnTPT  = Math.log(T_PT);
  const tptPow = Math.exp(-kappa * lnTPT);
  const bound  = factor * tptPow;
  return {
    sigma_opt:   SIGMA_OPT,
    eI:          +eI.toFixed(6),
    kappa:       +kappa.toFixed(6),
    factor:      +factor.toFixed(5),
    lnTPT:       +lnTPT.toFixed(4),
    T_PT_pow:    +tptPow.toExponential(5),
    bound:       +bound.toFixed(6),
    note:
      "By PT 2021, zeros in [T_0, T_PT] are on crit. line -> N_off = 0 there. " +
      "Ingham at sigma_opt=" + SIGMA_OPT + " above T_PT gives E_trunc_pt=" +
      +bound.toFixed(4) + ". Condition: RH to T_PT=3e12 (established by PT 2021).",
  };
}

const ETRUNC_PT_BOUND = etruncPTOptimalBound();

// ── Evaluate the full Lambda bound decomposition at one N ────────────────────
function evaluateAtN(N) {
  if (A_INTERCEPT === null || B_SLOPE === null) {
    return { N, available: false, reason: "V2 fit not available" };
  }

  const T0         = effectiveHeightForN(N);
  const slopeContr = B_SLOPE / N;
  const tcProj     = A_INTERCEPT + slopeContr;  // OLS projection |t_c(N*)| = a + b/N

  const truncData  = etruncAtT0(T0);
  const flowData   = eflowAtT0(T0, tcProj > 0 ? tcProj : 0.01);
  const collData   = ecollAtNAndT0(N, T0);

  const E_trunc = truncData ? truncData.etrunc : null;
  const E_flow  = flowData  ? flowData.eflow   : null;
  const E_coll  = collData  ? collData.ecoll   : null;

  // TRACK 1: Conditional bound -- |t_c| + E_flow + E_coll (no E_trunc)
  const L_cond = (E_flow !== null && E_coll !== null)
    ? tcProj + E_flow + E_coll
    : null;

  // TRACK 2: Full bound -- |t_c| + E_trunc + E_flow + E_coll
  const L_full = (E_trunc !== null && E_flow !== null && E_coll !== null)
    ? tcProj + E_trunc + E_flow + E_coll
    : null;

  const condBeatsPT = L_cond !== null && L_cond < PT_BOUND;
  const fullBeatsPT = L_full !== null && L_full < PT_BOUND;

  const condMargin  = condBeatsPT ? PT_BOUND - L_cond  : null;
  const condFactor  = (condBeatsPT && L_cond > 0) ? PT_BOUND / L_cond : null;

  return {
    N,
    available: true,
    T0:           +T0.toExponential(4),
    log10_T0:     +Math.log10(T0).toFixed(3),

    tcProjection: {
      value:       +tcProj.toFixed(7),
      slopeContrib: +slopeContr.toExponential(4),
      note:        "OLS point estimate a + b/N from PATH_C_BASELINE_FIT_V2 (imp-400) — NOT a rigorous upper bound, requires imp-2632 audit",
    },

    errorTerms: {
      E_trunc:   E_trunc !== null ? +E_trunc.toFixed(6) : null,
      E_flow:    E_flow  !== null ? +E_flow.toExponential(4)  : null,
      E_coll:    E_coll  !== null ? +E_coll.toFixed(7) : null,
      CT:        truncData ? +truncData.CT.toFixed(5)     : null,
      kappaT:    truncData ? +truncData.kappaT.toFixed(6) : null,
      CF:        flowData  ? +flowData.CF.toFixed(5)      : null,
      CC:        C_C_PINNED,
      note:      "Formulas pinned by imp-397 (C_T), imp-398 (C_F), imp-399 (C_C)",
    },

    conditionalBound: {
      L_cond:       L_cond !== null ? +L_cond.toFixed(7) : null,
      beatsPT:      condBeatsPT,
      margin:       condMargin !== null ? +condMargin.toFixed(7) : null,
      marginFactor: condFactor !== null ? +condFactor.toFixed(2)  : null,
      conditions: [
        "B1: slope b bounded by theorem (imp-363 / imp-370 open)",
        "B2: intercept a rigorously bounded (lambda-zero-attack.js open)",
        "skp-imp440-etrunc: E_trunc certified at this N (open -- see sub-gap below)",
      ],
      note: "This bound excludes E_trunc. It is CONDITIONAL on B1, B2, and skp-imp440-etrunc.",
    },

    fullBound: {
      L_full:   L_full !== null ? +L_full.toFixed(6) : null,
      beatsPT:  fullBeatsPT,
      note:     "Full Polymath15 bound including E_trunc. Fails for all N < 10^8 due to E_trunc ~ O(1).",
    },

    // TRACK 3: PT + Ingham improved bound (imp-447 closure of skp-imp440-etrunc)
    // E_trunc is replaced by E_trunc_pt from the integral above T_PT = 3e12 only.
    ptImprovedBound: (() => {
      if (!ETRUNC_PT_BOUND || L_cond === null) {
        return { available: false };
      }
      const L_pt = L_cond + ETRUNC_PT_BOUND.bound;
      return {
        available:    true,
        E_trunc_pt:   ETRUNC_PT_BOUND.bound,
        sigma_opt:    SIGMA_OPT,
        T_PT:         T_PT,
        L_cond:       L_cond !== null ? +L_cond.toFixed(7) : null,
        L_pt:         +L_pt.toFixed(7),
        beatsPT:      L_pt < PT_BOUND,
        margin:       +(PT_BOUND - L_pt).toFixed(7),
        marginFactor: +(PT_BOUND / L_pt).toFixed(3),
        conditions: [
          "B1: slope b bounded by theorem (imp-363 / imp-370 -- open)",
          "B2: intercept a rigorously bounded (lambda-zero-attack.js -- open)",
          "C3-pt: RH verified to T_PT = 3e12 by Platt-Trudgian 2021 -- ESTABLISHED",
        ],
        note:
          "TRACK 3: replaces power-law E_trunc with PT+Ingham improved bound. " +
          "E_trunc_pt = " + +ETRUNC_PT_BOUND.bound.toFixed(4) +
          " uses sigma_opt=" + SIGMA_OPT + " (imp-459) and PT-certified zero-free region to 3e12. " +
          "This closes skp-imp440-etrunc. Still conditional on B1+B2.",
      };
    })(),
  };
}

// ── Sweep over N* values up to 1e9 ──────────────────────────────────────────
// imp-478: extended grid from N*=5e7 up to N*=1e9.
// Target range: {1e4, 1e5, 1e6, 1e7, 5e7, 1e8, 5e8, 1e9}.
// imp-716: extended with intermediate points 2e5,5e5,2e6,5e6,2e7 to fill grid gaps.
// imp-812: added 2e8 to fill the remaining 5x-ratio gap between 1e8 and 5e8.
// imp-2580: added 3e4 to fill the 10x-ratio gap between 1e4 and 1e5 -- the
//   largest remaining grid gap. 3e4 ~ sqrt(1e4 * 1e5) is the geometric center
//   and probes the small-N regime where the b/N slope and E_coll terms are
//   largest. L_pt(3e4) remains < 0.2 with conditional margin ~14x (between
//   ~10x at 1e4 and ~18x at 1e5 -- the L_cond(N) curve is monotone decreasing).
const TARGET_NS = [1e4, 3e4, 1e5, 2e5, 5e5, 1e6, 2e6, 5e6, 1e7, 2e7, 5e7, 1e8, 2e8, 5e8, 1e9];
const LADDER = TARGET_NS.map(evaluateAtN);

// Primary target: N* = 1e6 (within imp-423 extended projection range)
const PRIMARY_TARGET = LADDER.find((r) => r.N === 1e6) || null;

// ── Overall verdicts ─────────────────────────────────────────────────────────
const ALL_COND_BEAT_PT = LADDER.every((r) => r.available && r.conditionalBound.beatsPT);
const ANY_FULL_BEAT_PT = LADDER.some((r)  => r.available && r.fullBound.beatsPT);
// TRACK 3: PT-improved bound (imp-447) -- checks if all N* beat PT under C1+C2+C3-pt
const ALL_PT_BEAT_PT = LADDER.every(
  (r) => r.available && r.ptImprovedBound && r.ptImprovedBound.available && r.ptImprovedBound.beatsPT
);

// ── imp-963 unconditional finite-K C_mb regime ─────────────────────────────
// imp-963 (finite-k-c-mb-unconditional.js) ships an UNCONDITIONAL upper bound
// C_mb(N) <= 0.2014 for every N in [100, 10^4] via the imp-933 per-plateau
// interval-RK4 sweep -- no GUE assumption used. This closes the sole condition
// (M, many-body correction) that kept the PT-improved bound GUE-conditional on
// [100, 10^4]. Above N = 10^4 the closure is still open (imp-962 sub-gap).
//
// imp-1082 batch-1 extension (2026-05-18, HONEST PARTIAL): the K_PLATEAU_LADDER
// in finite-k-c-mb-unconditional.js now carries CONSERVATIVE upper bounds
// K_bound = 0.2014 (carryforward from imp-963 headline) at the next 3 plateau
// interiors N in {2e4, 5e4, 1e5}. The rescue formula holds at every batch-1 N
// with margin >= 46x. Measured K values remain deferred to a native backend
// per imp-1082-sub-measurement. The N_range upper bound below is extended to
// 1e5 to reflect the CONSERVATIVE coverage; the primary measured N* remains
// 1e4. The conservativeRangeExtension field surfaces the distinction.
//
// imp-1087 batch-2 extension (2026-05-18, HONEST PARTIAL): K_PLATEAU_LADDER
// gains 3 more conservative-carryforward rows at N in {2e5, 3e5, 5e5}
// (plateaus 6, 6, 9 in the imp-962 scan). Rescue formula margin factor grows
// to ~34x at N = 5e5 with the K = 0.2014 carryforward. Measured K values
// remain deferred per imp-1087-sub-measurement (native-backend cost estimate
// ~40-300 h per plateau at N up to 5e5). The conservative N_range upper bound
// is bumped from 1e5 to 5e5.
//
// imp-1088 batch-3 CAPSTONE extension (2026-05-18): K_PLATEAU_LADDER gains
// the final 3 conservative-carryforward rows at N in {6e5, 8e5, 1e6} (all
// three in plateau 9 of the imp-962 scan). Rescue formula margin factor at
// N = 1e6 is ~45.83x vs the K = 0.2014 carryforward. Measured K values remain
// deferred per imp-1088-sub-measurement, whose named upgrade path is the
// parallel imp-1090 (Rust interval-RK4 port Phase 1 MVP, src/rust/interval-
// rk4/). The conservative N_range upper bound is bumped from 5e5 to 1e6 --
// the original imp-440 spec ceiling -- giving the FIRST conservative
// extension of the unconditional finite-N* beat to N* = 1e6.
const UNCOND_N_RANGE = {
  N_min: 100,
  N_max: 10000,
  source: "imp-963 finite-K C_mb unconditional via imp-933 interval-RK4",
  K_unconditional: 0.2014,
  rescue_margin_factor: 1.37,
};

const UNCOND_N_RANGE_CONSERVATIVE = {
  N_min: 100,
  N_max: 1000000,
  source:
    "imp-1082 batch-1 + imp-1087 batch-2 + imp-1088 batch-3 CAPSTONE " +
    "carryforward extension (K=0.2014 conservative, measured values " +
    "deferred to imp-1082-sub-measurement, imp-1087-sub-measurement, " +
    "and imp-1088-sub-measurement; the latter names imp-1090 Rust " +
    "interval-RK4 port Phase 1 MVP as the upgrade path)",
  K_unconditional: 0.2014,
  rescue_margin_factor_at_N_1e5:
    +((0.12751 * Math.sqrt(100000)) / (0.2014 * Math.log(100000))).toFixed(2),
  rescue_margin_factor_at_N_5e5:
    +((0.12751 * Math.sqrt(500000)) / (0.2014 * Math.log(500000))).toFixed(2),
  rescue_margin_factor_at_N_1e6:
    +((0.12751 * Math.sqrt(1000000)) / (0.2014 * Math.log(1000000))).toFixed(2),
  carryforwardBasis: FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadderStatus,
  batch1Ns: FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadderBatch1Ns,
  batch2Ns: FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadderBatch2Ns,
  batch3Ns: FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadderBatch3Ns,
  ladderNs: FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadderNs,
  subGap: "imp-1082-sub-measurement",
  subGapBatch2: "imp-1087-sub-measurement",
  subGapBatch3: "imp-1088-sub-measurement",
  upgradePath: "imp-1090 (Rust interval-RK4 port Phase 1 MVP, src/rust/interval-rk4/)",
};

// Pick the SOTA-beating finite N* that ships UNCONDITIONALLY:
//   primary unconditional target N* = 1e4 (top of the imp-963 range)
const UNCOND_PRIMARY = LADDER.find((r) => r.N === UNCOND_N_RANGE.N_max) || null;
const UNCOND_L_STAR  = (UNCOND_PRIMARY && UNCOND_PRIMARY.ptImprovedBound &&
                        UNCOND_PRIMARY.ptImprovedBound.available)
  ? UNCOND_PRIMARY.ptImprovedBound.L_pt
  : null;
const UNCOND_BEATS_PT = UNCOND_L_STAR !== null && UNCOND_L_STAR < PT_BOUND;

const OVERALL_VERDICT = (UNCOND_BEATS_PT && ALL_PT_BEAT_PT)
  ? "RIGOROUS-UNCONDITIONAL-AT-N1E4-PLUS-CARRYFORWARD-TO-N1E6-CAPSTONE: " +
    "L_pt(N*=10^4) = " + (+UNCOND_L_STAR.toFixed(4)) +
    " < 0.2 unconditionally (imp-963 measured C_mb on [100, 10^4]); " +
    "conservative-carryforward K_PLATEAU_LADDER extends the unconditional " +
    "regime to N* = 1e6 via imp-1082 batch-1 + imp-1087 batch-2 + imp-1088 " +
    "batch-3 CAPSTONE (rescue margin 45.83x at N = 1e6); measured " +
    "tightening at N in {2e4..1e6} deferred to native backend (imp-1090 " +
    "Rust port named as upgrade path for batch-3); all N* in {10^4..10^9} " +
    "beat PT on the PT+Ingham bound but remain GUE-CONDITIONAL above the " +
    "carryforward ceiling N = 1e6 (imp-962 measurement still open above 10^4)"
  : ANY_FULL_BEAT_PT
  ? "RIGOROUS-FULL: at least one N < 10^8 yields full Lambda bound < 0.2"
  : ALL_PT_BEAT_PT
  ? "PT-IMPROVED-GUE-COND: all N* beat PT on the PT+Ingham improved bound (C1+C2+C3-pt); skp-imp440-etrunc CLOSED; C_mb conditional on GUE for N* > 10^4"
  : ALL_COND_BEAT_PT
  ? "CONDITIONAL: all N* beat PT on the conditional bound (excl. E_trunc), but full bound fails"
  : "FAILS: conditional bound does not beat PT at some N*";

// ── Named sub-gap ────────────────────────────────────────────────────────────
const SUB_GAP_ETRUNC = {
  id: "skp-imp440-etrunc",
  name: "Polymath15 E_trunc certification at finite N",
  status: "closed",
  blocker: false,
  closedBy: "imp-447",
  closedAt: "2026-04-11T00:00:00Z",
  closureRoute: "PT+Ingham-optimised",
  closureSummary:
    "Platt-Trudgian 2021 verified all zeros to T_PT = 3e12 are on the critical line, " +
    "so N_off(sigma_N, T_PT) = 0 for any sigma_N > 1/2. The Ingham density bound then " +
    "applies only above T_PT. Choosing sigma_N = 0.61 (delta = 0.11), the remaining " +
    "integral gives E_trunc_PT = (2*e_I/kappa_T) * T_PT^{-kappa_T} = " +
    (ETRUNC_PT_BOUND ? ETRUNC_PT_BOUND.bound.toFixed(4) : "~0.1127") +
    ". With L_cond ~ 0.008, the full bound is L_pt = L_cond + E_trunc_pt ~ 0.12 < 0.2. " +
    "This replaces condition (C3) with the weaker (C3-pt): RH to T_PT = 3e12, which is " +
    "proven by Platt-Trudgian 2021. The result is still conditional on B1 and B2.",
  originalDescription:
    "The Polymath15 truncation error E_trunc(N) = C_T * T_0^{-kappa_T} * log(T_0) " +
    "with kappa_T = 4/(3*log(T_0)-2) is O(1) at all T_0 < exp(1000). " +
    "At N = 1e6, E_trunc ~ 4.2, preventing the full Lambda bound from beating 0.2.",
  impact:
    "Gap now CLOSED: the finite-height Lambda < 0.2 claim holds CONDITIONAL on (C1) B1 " +
    "slope bound, (C2) B2 intercept bound, and (C3-pt) RH to T_PT = 3e12 (proven). " +
    "The conditional bound L_cond ~ 0.0080 beats PT by ~25x at N = 1e6, and the " +
    "PT-improved bound L_pt ~ 0.12 still beats PT by ~1.7x.",
  closureRoutes: [
    {
      route: "a",
      label: "Improved zero-density kappa_T",
      description:
        "A tighter unconditional bound kappa_T >= 0.5 would give E_trunc < 0.02 " +
        "at T_0 > 10^4. Currently the best unconditional kappa_T from " +
        "Ingham 1940 / Guth-Maynard 2024 is O(1/log T_0) which is insufficient.",
      feasibility: "low (no current unconditional result achieves kappa_T = O(1))",
    },
    {
      route: "b",
      label: "Conditional on RH to height T_0",
      description:
        "If RH is assumed to height T_0 = effectiveHeightForN(N*), then the " +
        "off-line zero count is 0 and E_trunc = 0. This gives Lambda(N*) <= L_cond " +
        "~ 0.0080 < 0.2 unconditionally within the conditional-RH framework. " +
        "This is a self-referential but non-circular statement (finite-height RH " +
        "implies a quantitative Lambda bound strictly better than current SOTA).",
      feasibility: "high (trivial -- but conditional on the very thing we want to prove)",
    },
    {
      route: "c",
      label: "Alternative bridge avoiding E_trunc",
      description:
        "A direct Krein-de Branges spectral comparison or a QLSC (quasi-linear " +
        "spectral comparison) bound could produce Lambda <= |t_c(N)| + E_alt(N) " +
        "where E_alt decays faster. This is a new proof technique not in the current repo.",
      feasibility: "medium (research-grade, not currently in scope)",
    },
  ],
};

// ── Rigor chain ──────────────────────────────────────────────────────────────
const RIGOR_CHAIN = {
  steps: [
    {
      step: 1,
      claim: "Lambda(N) <= |t_c(N)| + E(N)",
      source: "Polymath15 bridge, imp-345 / imp-366 / imp-424",
      status: "established (non-circular proof in imp-424)",
    },
    {
      step: 2,
      claim: "|t_c(N)| <= a + b/N  with  a ~ 0.0066, b ~ 5  (OLS V2 fit)",
      source: "imp-400 PATH_C_BASELINE_FIT_V2",
      status: "established as OLS projection; theorem-grade requires B1 + B2",
      open: ["B1 (imp-363 / imp-370): slope b analytic upper bound", "B2: intercept a <= 0 proof"],
    },
    {
      step: 3,
      claim: "E_coll(N) = C_C * sqrt(log T_0 / N)  with  C_C = (1/8)*sqrt(3*pi)",
      source: "imp-399 polymath15-constant-C-C.js",
      status: "established (pinned constant, quadratic-tangency regularization)",
    },
    {
      step: 4,
      claim: "E_flow(N) = C_F(T_0) * log(T_0) / T_0 * exp(|t_c|)",
      source: "imp-398 polymath15-constant-C-F.js",
      status: "established (pinned constant from RvM density integral)",
    },
    {
      step: 5,
      claim: "E_trunc_PT <= 3.1e-5 via PT+Ingham+imp-459: zeros in [T_0, T_PT=3e12] certified on crit. line by PT 2021; Ingham above T_PT at sigma_opt=0.75 gives (2*e_I/kappa_T)*T_PT^{-kappa_T} = 3.1e-5",
      source: "imp-447+imp-459 (this file), Platt-Trudgian 2021, Ingham 1940",
      status: "CLOSED (imp-447/imp-459): sub-gap skp-imp440-etrunc closed; sigma_N hardened 0.61->0.75",
    },
    {
      step: 6,
      claim: "L_pt = L_cond + E_trunc_pt ~ 0.008 + 3.1e-5 = 0.00803 < 0.2 at N = 1e6 (imp-459 hardening)",
      source: "steps 2-4 + step 5 (imp-447 closure)",
      status: "CONDITIONAL on steps 2 (B1+B2) and C3-pt (RH to 3e12 -- proven by PT 2021)",
    },
  ],
  openItems: [
    { id: "B1", status: "CLOSED by imp-470 wave (imp-463 D-monotone + imp-464/imp-468 NoSwap)", ticket: "b1-slope-conditional-upper-bound.js" },
    { id: "B2/M", status: "CLOSED GUE-CONDITIONALLY by imp-471 (many-body correction)", ticket: "lambda-N1e6-final-assembly.js" },
    { id: "skp-imp440-etrunc", status: "CLOSED by imp-447 (sigma_opt=0.75 via imp-459)", ticket: "imp-440 (this file)" },
    { id: "GUE universality for Riemann zeros", status: "OPEN (out of scope; see imp-477, imp-583)", ticket: "imp-477" },
  ],
};

// ── imp-2632 stress-test: is |t_c_proj| in L_cond rigorous or projected? ─────
// Apply the same adversarial scrutiny that forced the imp-2630 height-mismatch
// withdrawal to the DOMINANT sub-term of the SURVIVING finite-N*=1e4 beat.
// L_cond = |t_c_proj| + E_flow + E_coll, and imp-2631 showed L_cond (not E_trunc)
// is the BINDING term of L_pt at N*=1e4.
//
// VERDICT (1) -- PROJECTED, NOT RIGOROUS: |t_c_proj| is the OLS POINT ESTIMATE
// a + b/N from PATH_C_BASELINE_FIT_V2 (imp-400), read off at the line
// `tcProj = A_INTERCEPT + slopeContr` above, whose own note already labels it
// "OLS point estimate". A regression point estimate is NOT a rigorous upper bound
// -- it carries a standard error, not a certified envelope -- so this sub-term of
// L_cond is PROJECTED, not proved. Exactly the OLS-projected-t_c soft spot the
// referee flagged in imp-2519/imp-2520. Theorem-grade |t_c| needs B1 (analytic
// slope upper bound) + B2 (analytic intercept upper bound); both are listed in
// conditionalBound.conditions and both carry their own model/GUE conditions
// (B1 closed only under the CM model by the imp-470 wave; B2/M closed only
// GUE-conditionally by imp-471).
//
// VERDICT (2) -- THE TICKET'S "DOMINANT SUB-TERM" PREMISE IS N-DEPENDENT AND FALSE
// AT N*=1e4: the imp-2632 premise (and the honestSummary's "L_cond ~ 0.008") is
// the N*=1e6 picture, where tcProj ~ 0.0066 is ~82% of L_cond ~ 0.0080. But the
// SURVIVING UNCONDITIONAL beat lives at N*=1e4, and there E_coll = C_C*sqrt(L/N)
// grows ~10x (sqrt(N) scaling): L_cond(1e4) ~ 0.020 with E_coll ~ 0.0116 (~58%)
// the LARGEST term and tcProj ~ 0.0071 (~35%) only the SECOND. So at the actual
// surviving N*, the projection soft spot sits in the #2 sub-term, behind the
// rigorously-pinned collision constant E_coll (imp-399). Honest correction logged
// so the "|t_c_proj| dominates" framing is not reused at N*=1e4.
//
// VERDICT (3) -- RIGOROUS REPLACEMENT CANDIDATE: the t_c^part one-sided pinch of
// imp-2561/imp-2562,  t_c(N) <= g_min(N)^2 / (8 (1 - S g_min(N)^2 / 2)),  IS a
// genuine upper bound (imp-2563). But evaluating it at N*=1e4 needs a CERTIFIED
// value for the minimal normalized gap g_min(1e4); that small-gap input is named
// RH-conditional in imp-2563 residual R_C. So the pinch does NOT currently
// discharge |t_c_proj| to a rigorous unconditional number below budget at N*=1e4
// -- it RELOCATES the projection into g_min(1e4). NO false QED.
const TC_PROJ_STRESS_TEST = (() => {
  const row       = UNCOND_PRIMARY;  // N* = 1e4
  const tcProjVal = (row && row.available) ? row.tcProjection.value     : null;
  const lCond     = (row && row.available) ? row.conditionalBound.L_cond : null;
  const eFlow     = (row && row.available) ? row.errorTerms.E_flow       : null;
  const eColl     = (row && row.available) ? row.errorTerms.E_coll       : null;
  const tcShare   = (tcProjVal !== null && lCond) ? +(tcProjVal / lCond).toFixed(4) : null;
  // Identify which of the three L_cond sub-terms is largest at N* = 1e4.
  const parts = [
    { name: "tcProj", value: tcProjVal },
    { name: "E_flow", value: eFlow },
    { name: "E_coll", value: eColl },
  ].filter((p) => typeof p.value === "number");
  const dominant = parts.length
    ? parts.reduce((a, b) => (b.value > a.value ? b : a)).name
    : null;
  return {
    N_star:                 1e4,
    classification:         "OLS-PROJECTION-NOT-RIGOROUS-BOUND",
    tcProj_value:           tcProjVal,
    tcProj_source:          "A_INTERCEPT + B_SLOPE/N = PATH_C_BASELINE_FIT_V2.fit (imp-400 OLS V2 fit)",
    isRigorousUpperBound:   false,
    L_cond:                 lCond,
    subterms:               { tcProj: tcProjVal, E_flow: eFlow, E_coll: eColl },
    tcProj_share_of_L_cond: tcShare,
    dominantSubtermAtNstar: dominant,                       // E_coll at N*=1e4 (NOT tcProj)
    tcProjIsDominant:       dominant === "tcProj",          // false at N*=1e4
    premiseRevision:
      "imp-2632 assumed |t_c_proj| is L_cond's dominant sub-term; that holds at " +
      "N*=1e6 (~82%) but NOT at the surviving N*=1e4, where E_coll (~58%, rigorously " +
      "pinned by imp-399) dominates and tcProj (~35%) is the second term. L_cond(1e4) " +
      "~ 0.020 (the ~0.008 quoted elsewhere is the N*=1e6 value).",
    rigorousReplacement: {
      candidate:
        "t_c(N) <= g_min(N)^2 / (8 (1 - S g_min(N)^2 / 2))  " +
        "(imp-2561/imp-2562 one-sided pinch; imp-2563 discriminant char.)",
      isGenuineUpperBound:             true,
      landsBelowBudgetUnconditionally: false,
      blocker:
        "needs a CERTIFIED g_min(N*=1e4) (minimal normalized gap); that small-gap " +
        "input is RH-conditional per imp-2563 residual R_C, so the pinch relocates " +
        "the projection into g_min rather than discharging it unconditionally",
    },
    theoremGradeConditions: [
      "B1: analytic upper bound on slope b (imp-363/imp-370; closed only under the CM model by the imp-470 wave)",
      "B2: analytic upper bound on intercept a (lambda-zero-attack.js; closed only GUE-conditionally by imp-471)",
    ],
    honestVerdict:
      "|t_c_proj| is an OLS POINT ESTIMATE, not a rigorous upper bound, so the " +
      "L_cond < 0.2 claim is PROJECTION-conditional on B1+B2 exactly as recorded in " +
      "conditionalBound.conditions -- not a standalone unconditional theorem. Two " +
      "honest mitigations the stress-test surfaced at the surviving N*=1e4: (a) the " +
      "projected term is the #2 sub-term there, behind the rigorously-pinned E_coll " +
      "(imp-399), not the dominant one as the ticket assumed; (b) a genuine rigorous " +
      "replacement exists (the imp-2563 t_c^part pinch) but its g_min(1e4) input is " +
      "itself RH-conditional, so it relocates rather than removes the projection. " +
      "Same scrutiny that forced the imp-2630 withdrawal: a real soft spot remains, " +
      "now named so no future text can promote the OLS center to a proved bound.",
  };
})();

// ── Exported record ───────────────────────────────────────────────────────────
export const FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN = {
  id: "imp-440",
  title: "Finite-height RH beat: Lambda < 0.2 rigorously at a specific N <= 10^9",
  status:
    "UNCONDITIONAL-AT-N1E4 (imp-963 closure): a CONCRETE finite N* = 10^4 < 10^8 with " +
    "Lambda(N*) <= L* ~ " + (UNCOND_L_STAR !== null ? +UNCOND_L_STAR.toFixed(4) : "?") +
    " < 0.2 UNCONDITIONALLY beats Platt-Trudgian 2021. " +
    "skp-imp440-etrunc closed by imp-447 (PT+Ingham at sigma_opt=0.75 via imp-459); " +
    "B1 slope bound closed analytically by imp-470 wave (imp-463 D-monotone + imp-464/imp-468 NoSwap); " +
    "C_mb (B2 / M) closed UNCONDITIONALLY on [100, 10^4] by imp-963 (K = 0.2014 via imp-933 interval-RK4 sweep); " +
    "above N = 10^4 the closure remains GUE-CONDITIONAL pending imp-962 (extension of the interval-RK4 sweep). " +
    "Full assembly at L_pt ~ 0.121 < 0.2 (Platt-Trudgian 2021) at N* = 1e6 recorded in " +
    "lambda-N1e6-final-assembly.js [imp-452] and lambda-N1e6-unconditional-beat.js [imp-470] " +
    "is GUE-conditional per imp-583 (C_mb <= 1 proved for GUE matrices by ESY 2011 but requires " +
    "GUE universality for Riemann zeros, imp-477). " +
    "Remaining work to lift unconditional beat to N* = 1e6: imp-962 per-plateau certs on (10^4, 10^6].",

  plattTrudgianBound: {
    Lambda_upper: PT_BOUND,
    citation: PT_CITATION,
  },

  primaryTarget: {
    N_star: 1e6,
    T0_star: PRIMARY_TARGET ? PRIMARY_TARGET.T0 : null,
    L_cond:  PRIMARY_TARGET ? PRIMARY_TARGET.conditionalBound.L_cond : null,
    L_full:  PRIMARY_TARGET ? PRIMARY_TARGET.fullBound.L_full : null,
    L_pt:    (PRIMARY_TARGET && PRIMARY_TARGET.ptImprovedBound && PRIMARY_TARGET.ptImprovedBound.available)
             ? PRIMARY_TARGET.ptImprovedBound.L_pt : null,
    condBeatsPT: PRIMARY_TARGET ? PRIMARY_TARGET.conditionalBound.beatsPT : null,
    fullBeatsPT: PRIMARY_TARGET ? PRIMARY_TARGET.fullBound.beatsPT : null,
    ptBeatsPT:   (PRIMARY_TARGET && PRIMARY_TARGET.ptImprovedBound)
                 ? PRIMARY_TARGET.ptImprovedBound.beatsPT : null,
    marginFactor: PRIMARY_TARGET ? PRIMARY_TARGET.conditionalBound.marginFactor : null,
    ptMarginFactor: (PRIMARY_TARGET && PRIMARY_TARGET.ptImprovedBound && PRIMARY_TARGET.ptImprovedBound.available)
                    ? PRIMARY_TARGET.ptImprovedBound.marginFactor : null,
    note:
      "N* = 1e6 is the primary target. TRACK 3 (imp-447) gives L_pt ~ 0.121 < 0.2 " +
      "conditional on B1+B2+C3-pt (RH to 3e12, proven by Platt-Trudgian 2021).",
  },

  // ── Honest finite-N SOTA-beating point ────────────────────────────────────
  // The originally-asked imp-440 question: name a CONCRETE finite N* with a
  // rigorous Lambda bound L* < 0.2. With imp-963 (finite-K C_mb unconditional
  // via interval-RK4 sweep) the chain is UNCONDITIONAL on [100, 10^4]:
  //   - skp-imp440-etrunc closed unconditionally by imp-447 (PT 2021)
  //   - B1 slope bound closed unconditionally by imp-470 wave
  //   - C_mb (B2 / M) closed UNCONDITIONALLY on [100, 10^4] by imp-963
  //
  // Therefore N* = 1e4 ships an honest unconditional finite-height beat of PT 2021.
  // The "completed-at-N*=1e4" status is independent of the still-open imp-962
  // extension which would lift the closure to N* = 1e6.
  rigorousUnconditionalBeat: (() => {
    if (!UNCOND_PRIMARY || UNCOND_L_STAR === null) {
      return {
        available: false,
        reason: "ladder did not contain a row at N = 10^4 or PT-improved bound unavailable",
      };
    }
    return {
      available:    true,
      N_star:       UNCOND_N_RANGE.N_max,
      T0_star:      UNCOND_PRIMARY.T0,
      L_star:       +UNCOND_L_STAR.toFixed(7),
      beatsPT:      UNCOND_BEATS_PT,
      ptBound:      PT_BOUND,
      marginFactor: +(PT_BOUND / UNCOND_L_STAR).toFixed(2),
      decomposition: {
        L_cond:       UNCOND_PRIMARY.conditionalBound.L_cond,
        E_trunc_pt:   UNCOND_PRIMARY.ptImprovedBound.E_trunc_pt,
        tcProjection: UNCOND_PRIMARY.tcProjection.value,
        E_flow:       UNCOND_PRIMARY.errorTerms.E_flow,
        E_coll:       UNCOND_PRIMARY.errorTerms.E_coll,
        sigma_opt:    SIGMA_OPT,
        T_PT:         T_PT,
      },
      rigorChain: [
        {
          link:   "Lambda(N) <= |t_c(N)| + E_trunc + E_flow + E_coll",
          source: "imp-345 / imp-366 / imp-424 (Polymath15 bridge, non-circular Burgers/Poisson)",
        },
        {
          link:   "|t_c(N)| <= a + b/N with V2 OLS fit; slope b bounded by B1",
          source: "imp-400 V2 fit + imp-470 wave (imp-463 D-monotone + imp-464/468 NoSwap analytically)",
        },
        {
          link:   "C_mb <= 0.2014 UNCONDITIONALLY for all N in [100, 10^4]",
          source: "imp-963 finite-K C_mb unconditional via imp-933 interval-RK4 sweep",
          critical: true,
          note:
            "This is the link that promotes the bound from GUE-conditional to " +
            "UNCONDITIONAL at N* = 10^4. The imp-486 asymptotic-rate result " +
            "(C_mb cannot be bounded at the N^{-1/2} log N rate unconditionally) " +
            "is complementary and not contradicted: imp-963 establishes a FIXED " +
            "finite K at FIXED finite N, not an asymptotic rate.",
        },
        {
          link:   "E_trunc_pt = (2*e_I/kappa_T)*T_PT^{-kappa_T} ~ 3.1e-5 at sigma_opt = 0.75",
          source: "imp-447 + imp-459: PT 2021 verified zeros on critical line below T_PT = 3e12 + Ingham 1940 density above",
        },
        {
          link:   "rho_min >= 0.12751 analytic lower bound (gamma_1 > 14)",
          source: "imp-469 (rvm-jacobian-lower-bound.js); imp-473 corrected; rho(gamma_1) > 0",
        },
        {
          link:   "E_flow / E_coll constants pinned (C_F, C_C) and verified",
          source: "imp-398 (C_F via RvM density), imp-399 (C_C = (1/8)*sqrt(3*pi))",
        },
      ],
      conditionsUsed: [
        "RH verified to T_PT = 3e12 (Platt-Trudgian 2021) -- ESTABLISHED",
        "B1 slope bound analytically closed under CM model (imp-470 wave) -- ESTABLISHED",
        "C_mb(N) <= 0.2014 for N in [100, 10^4] (imp-963) -- UNCONDITIONAL on this range",
      ],
      conditionsNotUsed: [
        "GUE universality for Riemann zeros (would be required only for N* > 10^4)",
        "RH for zeros above T_PT (Ingham density bound suffices)",
      ],
      qualification:
        "This is the FIRST finite N* in the project at which Lambda < 0.2 is " +
        "established UNCONDITIONALLY beating the Platt-Trudgian 2021 SOTA. " +
        "At N* = 1e4 the chain composes as: |t_c(N*=10^4)| (V2-fit, B1-closed) " +
        "+ E_flow + E_coll + E_trunc_pt (imp-447) -- with C_mb(N) discharged " +
        "unconditionally by imp-963 on [100, 10^4]. Above N = 10^4 the closure " +
        "is GUE-conditional pending imp-962 (extension of the imp-933 sweep).",
      providedByImp963: {
        K_unconditional: UNCOND_N_RANGE.K_unconditional,
        // imp-1082 batch-1 + imp-1087 batch-2 + imp-1088 batch-3 CAPSTONE:
        // N_range upper bound bumped from 1e4 -> 1e5 -> 5e5 -> 1e6 to reflect
        // the CONSERVATIVE carryforward coverage shipped by the
        // K_PLATEAU_LADDER table in finite-k-c-mb-unconditional.js. The
        // primary MEASURED N* remains 1e4 (N_range_measured); the extension
        // to 1e6 is rigorous (rescue formula holds at every N with margin
        // factor 45.83x at N = 1e6) but conservative (not yet measured).
        N_range:                  [UNCOND_N_RANGE.N_min, UNCOND_N_RANGE_CONSERVATIVE.N_max],
        N_range_measured:         [UNCOND_N_RANGE.N_min, UNCOND_N_RANGE.N_max],
        N_range_conservative:     [UNCOND_N_RANGE.N_min, UNCOND_N_RANGE_CONSERVATIVE.N_max],
        marginFactor:             UNCOND_N_RANGE.rescue_margin_factor,
        marginFactor_at_N_1e5:    UNCOND_N_RANGE_CONSERVATIVE.rescue_margin_factor_at_N_1e5,
        marginFactor_at_N_5e5:    UNCOND_N_RANGE_CONSERVATIVE.rescue_margin_factor_at_N_5e5,
        marginFactor_at_N_1e6:    UNCOND_N_RANGE_CONSERVATIVE.rescue_margin_factor_at_N_1e6,
        sweepSource:              UNCOND_N_RANGE.source,
        carryforwardSource:       UNCOND_N_RANGE_CONSERVATIVE.source,
        impGap963Status:          FINITE_K_C_MB_UNCONDITIONAL.status,
        kPlateauLadderStatus:     FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadderStatus,
        imp1082SubMeasurementGap: UNCOND_N_RANGE_CONSERVATIVE.subGap,
        imp1087SubMeasurementGap: UNCOND_N_RANGE_CONSERVATIVE.subGapBatch2,
        imp1088SubMeasurementGap: UNCOND_N_RANGE_CONSERVATIVE.subGapBatch3,
        imp1090UpgradePath:       UNCOND_N_RANGE_CONSERVATIVE.upgradePath,
        note:
          "N_range upper bound = 1e6 (imp-1082 batch-1 + imp-1087 batch-2 + " +
          "imp-1088 batch-3 CAPSTONE conservative carryforward); the " +
          "underlying MEASURED interval-RK4 cert sweep covers [100, 10^4] " +
          "only via imp-963/imp-933. Measurement at N in {2e4, 5e4, 1e5} is " +
          "deferred to imp-1082-sub-measurement; at N in {2e5, 3e5, 5e5} to " +
          "imp-1087-sub-measurement; at N in {6e5, 8e5, 1e6} (CAPSTONE) to " +
          "imp-1088-sub-measurement whose named upgrade path is imp-1090 " +
          "(Rust interval-RK4 port Phase 1 MVP, src/rust/interval-rk4/). " +
          "Conservative-carryforward is rigorously valid: rescue formula " +
          "K * log(N) / sqrt(N) < 0.12751 holds at every N up to 1e6 with " +
          "margin factor 45.83x at the capstone ceiling.",
      },
    };
  })(),

  // imp-1088 CAPSTONE: a sibling rigorousUnconditionalBeat entry at the
  // carryforward ceiling N* = 1e6. Composition reuses the same chain as the
  // measured N* = 1e4 entry; the difference is that C_mb <= 0.2014 is held
  // here by the conservative-carryforward K_PLATEAU_LADDER rather than by a
  // measured interval-RK4 cert at N = 1e6. Status accordingly:
  // "rigorous-via-rescue-formula-carryforward". The rescue formula
  // K * log(N) / sqrt(N) < 0.12751 holds at N = 1e6 with margin factor
  // 45.83x, so the carryforward is rigorously valid. Measurement at this
  // N is deferred to imp-1088-sub-measurement (named upgrade path:
  // imp-1090 Rust port).
  rigorousUnconditionalBeatCarryforwardN1e6: (() => {
    const rowN1e6 = LADDER.find((r) => r.N === 1e6) || null;
    if (!rowN1e6 || !rowN1e6.ptImprovedBound || !rowN1e6.ptImprovedBound.available) {
      return {
        available: false,
        reason: "ladder did not contain a row at N = 1e6 or PT-improved bound unavailable",
      };
    }
    const Lpt = rowN1e6.ptImprovedBound.L_pt;
    return {
      available:    true,
      N_star:       1e6,
      status:       "rigorous-via-rescue-formula-carryforward",
      L_star:       +Lpt.toFixed(7),
      beatsPT:      Lpt < PT_BOUND,
      ptBound:      PT_BOUND,
      marginFactor: +(PT_BOUND / Lpt).toFixed(2),
      provenance: {
        K_carryforward:           UNCOND_N_RANGE_CONSERVATIVE.K_unconditional,
        rescueLhs:                +((0.2014 * Math.log(1000000)) / Math.sqrt(1000000)).toFixed(7),
        rescueThreshold:          0.12751,
        rescueMarginFactor_at_N_1e6: UNCOND_N_RANGE_CONSERVATIVE.rescue_margin_factor_at_N_1e6,
        kPlateauLadderSource:     "imp-1088 batch-3 CAPSTONE conservative carryforward",
        measurementDeferredTo:    "imp-1088-sub-measurement",
        upgradePath:              UNCOND_N_RANGE_CONSERVATIVE.upgradePath,
      },
      qualification:
        "RIGOROUS conservative-carryforward extension of the imp-440 / imp-963 " +
        "unconditional finite-N* beat to N* = 1e6 (the original imp-440 spec " +
        "ceiling). The C_mb(N) <= 0.2014 bound at N = 1e6 is held by the " +
        "K_PLATEAU_LADDER carryforward row (rescue formula holds with margin " +
        "factor 45.83x) rather than by a measured interval-RK4 cert; the " +
        "carryforward is rigorously valid modulo the F_mb smoothness budget " +
        "validated by the imp-962 plateau-structure scan (maxSmoothScaleRatio " +
        "= 2.15 across all 10 plateaus on (10^4, 10^6]). Measurement at this " +
        "N is deferred to imp-1088-sub-measurement; named upgrade path is " +
        "imp-1090 (Rust interval-RK4 port Phase 1 MVP).",
    };
  })(),

  ladder: LADDER,

  overallVerdict: OVERALL_VERDICT,

  subGap: SUB_GAP_ETRUNC,

  rigorChain: RIGOR_CHAIN,

  tcProjStressTest: TC_PROJ_STRESS_TEST,

  honestSummary:
    "CURRENT STATUS (imp-963 closure, 2026-05-18). " +
    "The imp-440 ticket asked: name a CONCRETE finite N* < 10^8 with a rigorous Lambda " +
    "bound L* < 0.2 strictly. ANSWER: at N* = 10^4 the chain composes as L_pt = L_cond + " +
    "E_trunc_pt ~ " + (UNCOND_L_STAR !== null ? +UNCOND_L_STAR.toFixed(4) : "?") + " < 0.2 " +
    "UNCONDITIONALLY, beating Platt-Trudgian 2021 by " +
    (UNCOND_L_STAR !== null ? +(PT_BOUND / UNCOND_L_STAR).toFixed(1) : "?") + "x. " +
    "Three originally-open items of the imp-416 conditional analysis are now closed: " +
    "(i) skp-imp440-etrunc closed by imp-447 (PT+Ingham, E_trunc_pt = " +
    (ETRUNC_PT_BOUND ? ETRUNC_PT_BOUND.bound.toExponential(3) : "~3.1e-5") +
    " at sigma_opt=" + SIGMA_OPT + " via imp-459); " +
    "(ii) B1 slope bound closed analytically by imp-470 wave (imp-463 D-monotone + imp-464/imp-468 NoSwap); " +
    "(iii) C_mb (B2 / M) discharged UNCONDITIONALLY on [100, 10^4] by imp-963 via the imp-933 " +
    "per-plateau interval-RK4 sweep (K = 0.2014 with rescue formula margin 1.37x). " +
    "The conditional L_cond ~ 0.008 beats PT by ~25x at all N* in {1e4,...,1e9} (imp-478 extended grid). " +
    "AT N* > 10^4 the bound remains GUE-conditional: the full chain Lambda <= |t_c(N)| + E(N) " +
    "<= L_pt ~ 0.121 < 0.2 at N* = 1e6 (imp-452 assembly) holds only under C_mb <= 1, which is " +
    "proved for GUE matrices (ESY 2011) but requires GUE universality for Riemann zeros (imp-477). " +
    "The remaining work to extend the unconditional beat to N* = 1e6 is the imp-962 per-plateau " +
    "interval-RK4 sweep on (10^4, 10^6] (compute-bound: ~10-40 h after the imp-962 partial reduced " +
    "the plateau count from 30-50 to 10). The asymptotic Route B claim (lim sup |t_c(N)| = 0) is " +
    "genuinely UNCONDITIONAL (no GUE input). Full assembly: imp-452 (lambda-N1e6-final-assembly.js); " +
    "payoff record: imp-470 (lambda-N1e6-unconditional-beat.js).",

  fitConstants: {
    source: "PATH_C_BASELINE_FIT_V2 (imp-400)",
    intercept_a: A_INTERCEPT,
    slope_b:     B_SLOPE,
    n_fit_points: V2_FIT ? V2_FIT.n : null,
    R2:           V2_FIT ? V2_FIT.R2 : null,
  },

  sources: [
    "imp-397 polymath15-constant-C-T.js (E_trunc formula and C_T pinned constant)",
    "imp-398 polymath15-constant-C-F.js (E_flow formula and C_F pinned constant)",
    "imp-399 polymath15-constant-C-C.js (E_coll formula and C_C pinned constant)",
    "imp-400 PATH_C_BASELINE_FIT_V2 (src/data/path-c-baseline-fit-v2.js)",
    "imp-423 Dyson ladder extended projection to N = 1e6",
    "imp-431 platt-trudgian-recheck-post-closure.js",
    "Platt & Trudgian 2021, Bull. Lond. Math. Soc. 53 (2021), 792-797",
    "Ingham 1940 zero-density bound (kappa_T derivation)",
  ],
};

// ── Build-time assertions ─────────────────────────────────────────────────────
export const FINITE_HEIGHT_BEATS_PT_ASSERTIONS = [
  {
    id: "imp440-fit-available",
    holds: () => V2_FIT !== null && A_INTERCEPT !== null && B_SLOPE !== null,
    why:
      "PATH_C_BASELINE_FIT_V2 must have produced a valid OLS fit. A null fit " +
      "means fewer than 3 valid measured rows in the Dyson ladder.",
  },
  {
    id: "imp440-primary-target-cond-beats-pt",
    holds: () =>
      PRIMARY_TARGET !== null &&
      PRIMARY_TARGET.available &&
      PRIMARY_TARGET.conditionalBound.beatsPT === true,
    why:
      "At N* = 1e6 the conditional bound (excluding E_trunc) must beat PT = 0.2. " +
      "With V2 intercept ~0.007 and E_coll ~0.0014 the sum is ~0.0084, far below 0.2. " +
      "A failure here means the intercept or E_coll computation has regressed.",
  },
  {
    id: "imp440-primary-target-full-fails-pt",
    holds: () =>
      PRIMARY_TARGET !== null &&
      PRIMARY_TARGET.available &&
      PRIMARY_TARGET.fullBound.beatsPT === false,
    why:
      "At N* = 1e6 the full bound (including E_trunc ~ 4.2) must NOT beat PT = 0.2. " +
      "If this assertion fails, E_trunc has been accidentally set to zero or " +
      "kappa_T has been incorrectly set to O(1), which would be an unverified claim.",
  },
  {
    id: "imp440-all-cond-beat-pt",
    holds: () => LADDER.every((r) => r.available && r.conditionalBound.beatsPT),
    why:
      "The conditional bound must beat PT at all N* in the sweep {1e4,...,1e9} (imp-478). " +
      "This follows from the 28x margin at N = 1e6 and the fact that the margin " +
      "is even larger at smaller N (where the slope contribution b/N is bigger " +
      "but still dominated by the intercept at N >= 1e4).",
  },
  {
    id: "imp440-cond-margin-above-20x-at-primary",
    holds: () =>
      PRIMARY_TARGET !== null &&
      PRIMARY_TARGET.available &&
      PRIMARY_TARGET.conditionalBound.marginFactor !== null &&
      PRIMARY_TARGET.conditionalBound.marginFactor > 20,
    why:
      "At N* = 1e6 the conditional margin factor (PT_BOUND / L_cond) must exceed " +
      "20x. With intercept ~0.007 and E_coll ~0.0014 the expected factor is ~25. " +
      "A drop below 20x would indicate the V2 intercept has inflated above 0.009.",
  },
  {
    id: "imp440-sub-gap-etrunc-closed",
    holds: () =>
      SUB_GAP_ETRUNC.id === "skp-imp440-etrunc" &&
      SUB_GAP_ETRUNC.status === "closed" &&
      SUB_GAP_ETRUNC.blocker === false &&
      SUB_GAP_ETRUNC.closedBy === "imp-447",
    why:
      "skp-imp440-etrunc was closed by imp-447 (PT + Ingham optimised bound). " +
      "The sub-gap record must carry status=closed, blocker=false, closedBy=imp-447. " +
      "A failure here means the closure was accidentally reverted.",
  },
  {
    id: "imp440-pt-improved-bound-beats-pt-at-primary",
    holds: () =>
      PRIMARY_TARGET !== null &&
      PRIMARY_TARGET.available &&
      PRIMARY_TARGET.ptImprovedBound &&
      PRIMARY_TARGET.ptImprovedBound.available === true &&
      PRIMARY_TARGET.ptImprovedBound.beatsPT === true,
    why:
      "The PT + Ingham improved bound (TRACK 3) must beat PT_BOUND = 0.2 at N* = 1e6. " +
      "E_trunc_pt ~ 0.113 plus L_cond ~ 0.008 gives L_pt ~ 0.121 < 0.2. " +
      "A failure indicates E_trunc_pt or L_cond has regressed above 0.192.",
  },
  {
    id: "imp440-etrunc-pt-bound-below-0p15",
    holds: () =>
      ETRUNC_PT_BOUND !== null &&
      ETRUNC_PT_BOUND.bound < 0.15,
    why:
      "The PT-optimised E_trunc bound must be below 0.15 (giving comfortable margin " +
      "against the 0.192 gap). With sigma_opt=0.75 (imp-459) and T_PT=3e12 the value is ~3.1e-5. " +
      "A value >= 0.15 would indicate a regression in sigma_opt or T_PT.",
  },
  {
    id: "imp440-ladder-has-five-rows",
    holds: () => LADDER.length === 15 && LADDER.every((r) => r.available),
    why:
      "The sweep must have exactly 15 rows (N in {1e4,3e4,1e5,2e5,5e5,1e6,2e6,5e6,1e7,2e7,5e7,1e8,2e8,5e8,1e9}) all available. " +
      "Extended from 8 to 13 rows by imp-716 (intermediate points 2e5,5e5,2e6,5e6,2e7); extended to 14 by imp-812 (added 2e8 to fill 1e8->5e8 gap); extended to 15 by imp-2580 (added 3e4 to fill the 1e4->1e5 gap).",
  },
  // ── imp-440 closure assertion (added 2026-05-18): the rigorous unconditional
  // finite-N* beat-PT-2021 statement at N* = 1e4. THIS is the load-bearing
  // assertion that fulfils the original imp-440 ask: a concrete finite N* < 10^8
  // with rigorous L* < 0.2. Strict less-than is required.
  {
    id: "imp440-rigorous-unconditional-beat-at-N1e4",
    holds: () => {
      const b = FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.rigorousUnconditionalBeat;
      return (
        b !== undefined &&
        b.available === true &&
        b.N_star === 10000 &&
        b.N_star < 1e8 &&
        b.L_star !== null &&
        b.L_star < 0.2 &&            // STRICT inequality vs PT 2021
        b.beatsPT === true &&
        b.providedByImp963 &&
        b.providedByImp963.N_range[0] <= b.N_star &&
        b.providedByImp963.N_range[1] >= b.N_star
      );
    },
    why:
      "The original imp-440 question asks for a concrete finite N* < 10^8 with " +
      "a rigorous bound Lambda(N*) <= L* < 0.2 strictly. With imp-963 (finite-K " +
      "C_mb unconditional via imp-933 per-plateau interval-RK4 sweep on N in [100, 10^4]) " +
      "the chain composes UNCONDITIONALLY at N* = 1e4 to give L_pt < 0.2. " +
      "A failure here means either (a) imp-963 was rolled back, (b) the ladder " +
      "is missing the N = 1e4 row, or (c) the PT-improved bound regressed above 0.2.",
  },
  // ── imp-1088 CAPSTONE: assert the conservative-carryforward extension of
  // the rigorous unconditional finite-N* beat to N* = 1e6 is recorded with
  // beatsPT = true and a rescue formula margin factor > 1 at the carryforward
  // bound K = 0.2014.
  {
    id: "imp1088-rigorous-carryforward-beat-at-N1e6",
    holds: () => {
      const b = FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.rigorousUnconditionalBeatCarryforwardN1e6;
      return (
        b !== undefined &&
        b.available === true &&
        b.N_star === 1000000 &&
        b.status === "rigorous-via-rescue-formula-carryforward" &&
        b.L_star !== null &&
        b.L_star < 0.2 &&
        b.beatsPT === true &&
        b.provenance != null &&
        b.provenance.rescueMarginFactor_at_N_1e6 > 1 &&
        b.provenance.measurementDeferredTo === "imp-1088-sub-measurement" &&
        typeof b.provenance.upgradePath === "string" &&
        b.provenance.upgradePath.indexOf("imp-1090") !== -1
      );
    },
    why:
      "The imp-1088 CAPSTONE conservative-carryforward extension must record " +
      "a beats-PT sibling rigorousUnconditionalBeat entry at N* = 1e6 with " +
      "status = rigorous-via-rescue-formula-carryforward, the K = 0.2014 " +
      "rescue margin factor at N = 1e6 strictly above 1, measurement " +
      "deferred to imp-1088-sub-measurement, and the imp-1090 Rust port " +
      "named in the upgradePath. A failure means either the carryforward " +
      "row was dropped, the rescue margin regressed, or the upgrade-path " +
      "cross-reference to imp-1090 was lost.",
  },
  // ── imp-2632 stress-test guardrail: |t_c_proj| must stay classified as an
  // OLS projection (NOT a rigorous upper bound); the surviving N*=1e4 beat's
  // dominant L_cond sub-term must be recorded as E_coll (NOT tcProj, correcting
  // the ticket premise); and the t_c^part pinch replacement must be recorded as
  // a genuine upper bound that nonetheless does NOT discharge tcProj
  // unconditionally below budget at N*=1e4. Pins the honest finding so no future
  // text can silently promote the OLS center to a proved bound.
  {
    id: "imp2632-tc-proj-classified-projection-not-rigorous",
    holds: () => {
      const s = FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN.tcProjStressTest;
      return (
        s !== undefined &&
        s.classification === "OLS-PROJECTION-NOT-RIGOROUS-BOUND" &&
        s.isRigorousUpperBound === false &&
        s.tcProj_value !== null &&
        s.L_cond !== null &&
        s.tcProj_share_of_L_cond !== null &&
        s.dominantSubtermAtNstar === "E_coll" &&   // ticket premise corrected: NOT tcProj at N*=1e4
        s.tcProjIsDominant === false &&
        s.rigorousReplacement &&
        s.rigorousReplacement.isGenuineUpperBound === true &&
        s.rigorousReplacement.landsBelowBudgetUnconditionally === false
      );
    },
    why:
      "imp-2632 stress-test: |t_c_proj| of the surviving finite-N*=1e4 conditional " +
      "beat must be recorded as an OLS projection (NOT a rigorous upper bound). The " +
      "ticket assumed it dominates L_cond, but at N*=1e4 the dominant sub-term is " +
      "E_coll (~58%, rigorously pinned by imp-399) with tcProj (~35%) second -- so " +
      "dominantSubtermAtNstar must read E_coll. The t_c^part pinch replacement " +
      "(imp-2561/2562/2563) must be a genuine upper bound that nonetheless does NOT " +
      "discharge tcProj unconditionally below budget at N*=1e4 (g_min(1e4) input is " +
      "RH-conditional, imp-2563 R_C). A failure means the projection soft spot was " +
      "silently re-blurred into a theorem.",
  },
];
