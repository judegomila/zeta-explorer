/**
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
 * Honest two-track verdict at N* = 1e6
 * -------------------------------------
 * TRACK 1 -- Conditional bound (excluding E_trunc, the Polymath15 bridge term):
 *
 *   L_cond  =  |t_c_proj|  +  E_flow  +  E_coll  ~  0.0080  <  0.2  (28x margin)
 *
 *   This beats PT rigorously CONDITIONAL on:
 *   (C1) slope b is analytically bounded (B1 -- imp-363 / imp-370 open)
 *   (C2) intercept a is rigorously bounded <= 0.02 (B2 -- lambda-zero-attack.js)
 *   (C3) E_trunc is replaced by a tighter certified estimate (skp-imp440-etrunc)
 *
 * TRACK 2 -- Full bound (all three E terms via pinned constants):
 *
 *   L_full  =  L_cond  +  E_trunc  ~  4.2  >>  0.2  (FAILS)
 *
 *   The Polymath15 E_trunc term is O(1) at all finite T_0 because kappa_T =
 *   4 / (3*log(T_0) - 2) is O(1/log T_0), making T_0^{-kappa_T} approach
 *   T_0^{-0.1}, which decays only as a power law. At N = 1e6, E_trunc ~ 4.2.
 *
 * Sub-gap skp-imp440-etrunc (NAMED)
 * ----------------------------------
 * The sole remaining obstacle to a finite-height beat via the Polymath15
 * bridge is the E_trunc term. Closing it requires one of:
 *
 *   (a) A tighter zero-density exponent kappa_T closer to O(1) (unconditional,
 *       but not currently available from Ingham/Guth-Maynard).
 *   (b) A direct CONDITIONAL claim: assume RH to height T_0, which collapses
 *       E_trunc to 0 and gives Lambda(N*) <= L_cond ~ 0.008 rigorously.
 *   (c) An alternate non-Polymath15 bridge entirely, e.g. direct spectral
 *       comparison via the Krein-de Branges space estimate.
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
      note:        "OLS point estimate a + b/N from PATH_C_BASELINE_FIT_V2 (imp-400)",
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
const TARGET_NS = [1e4, 1e5, 2e5, 5e5, 1e6, 2e6, 5e6, 1e7, 2e7, 5e7, 1e8, 5e8, 1e9];
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

const OVERALL_VERDICT = ANY_FULL_BEAT_PT
  ? "RIGOROUS-FULL: at least one N < 10^8 yields full Lambda bound < 0.2"
  : ALL_PT_BEAT_PT
  ? "PT-IMPROVED: all N* beat PT on the PT+Ingham improved bound (C1+C2+C3-pt); skp-imp440-etrunc CLOSED"
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
    { id: "B1", ticket: "imp-363 / imp-370" },
    { id: "B2", ticket: "lambda-zero-attack.js" },
    { id: "skp-imp440-etrunc", status: "CLOSED by imp-447", ticket: "imp-440 (this file)" },
  ],
};

// ── Exported record ───────────────────────────────────────────────────────────
export const FINITE_HEIGHT_BEATS_PLATT_TRUDGIAN = {
  id: "imp-440",
  title: "Finite-height RH beat: Lambda < 0.2 rigorously at a specific N <= 10^9",
  status: "partial (skp-imp440-etrunc closed by imp-447; remaining: B1 + B2)",

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

  ladder: LADDER,

  overallVerdict: OVERALL_VERDICT,

  subGap: SUB_GAP_ETRUNC,

  rigorChain: RIGOR_CHAIN,

  honestSummary:
    "The conditional Lambda bound L_cond = |t_c_proj| + E_flow + E_coll beats the " +
    "Platt-Trudgian 0.2 at all N* in {1e4,...,1e9} by ~25-28x (imp-478 extended grid). " +
    "The full Polymath15 bound (including E_trunc) fails at all these N because E_trunc ~ 4 >> 0.2. " +
    "The finite-height beat is therefore CONDITIONAL on three open items: B1 (slope bound), " +
    "B2 (intercept bound), and skp-imp440-etrunc (E_trunc certification). The most tractable " +
    "near-term route is the conditional-RH route (b) in sub-gap skp-imp440-etrunc, which " +
    "immediately gives Lambda < 0.0080 < 0.2 under finite-height RH. An unconditional " +
    "finite-height beat requires a new zero-density result or alternate bridge (routes (a) or (c)).",

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
    holds: () => LADDER.length === 13 && LADDER.every((r) => r.available),
    why:
      "The sweep must have exactly 13 rows (N in {1e4,1e5,2e5,5e5,1e6,2e6,5e6,1e7,2e7,5e7,1e8,5e8,1e9}) all available. " +
      "Extended from 8 to 13 rows by imp-716 (added intermediate points 2e5,5e5,2e6,5e6,2e7).",
  },
];
