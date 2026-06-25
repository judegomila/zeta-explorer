/**
 * @module imp-2688-c-g-loglipschitz-bound
 *
 * imp-2688 (medium, proof): Pin the E_flow Gronwall amplification constant C_G in
 *     E_flow(N) = C_F . log(T0)/T0 . exp(C_G . |t_c|)            (imp-398)
 * to a RIGOROUS backward-flow log-Lipschitz bound, evaluated on the EXPLICIT
 * mesoscopic Trudgian density-floor strip where the bound is N-uniform.
 *
 * WHAT C_G IS, AND HOW THE GRONWALL STEP PINS IT
 * ----------------------------------------------
 * C_G is the per-unit-time log-Lipschitz amplification rate of the backward
 * Calogero-Moser flow z' = 2 M(z, s) that propagates the off-ladder drift
 * uniformity over the collision horizon |t_c|. The exact propagation step is
 * the imp-838 / Lemma-B inequality of backward-flow-stability-gronwall.js: along
 * the characteristics, on a strip Im z >= y_star,
 *     |dz^2 M(x + i y)| <= (2 / y^2) Im M(x + i y),
 * so the differential inequality d(Im M)/ds >= -(2 / y_star^2) Im M integrates
 * (Gronwall) to an amplification of at most exp((2/y_star^2) . S) over a horizon
 * S. Matching this to exp(C_G . |t_c|) gives the EXPLICIT log-Lipschitz constant
 *     C_G(y_star) = 2 / y_star^2.
 * C_G is therefore not an independent placeholder at all: it is the Gronwall
 * coefficient 2/y_star^2 evaluated on whichever strip the E_flow drift lives.
 *
 * THE KEY DISTINCTION -- MESOSCOPIC, NOT MICROSCOPIC (do NOT conflate w/ imp-2640)
 * ------------------------------------------------------------------------------
 * 2/y^2 blows up as the strip narrows, so WHICH strip matters decisively:
 *   - The E_flow off-ladder drift is a MACROSCOPIC boundary error. It is
 *     controlled on the Lemma-C density-floor strip
 *         y_star(N) = 2 (2 S_Tru(gamma_N) + c0) / rho_int,
 *     with S_Tru the Trudgian 2014 explicit S(T) bound (0.112 log T +
 *     0.278 log log T + 2.510), c0 = 1, rho_int = rho(gamma_N/2). This strip is
 *     MESOSCOPIC: y_star = O(1) bounded AWAY from 0 (it decreases monotonically
 *     toward the analytic asymptote y_inf = 0.448 . 2 pi ~ 2.8149 and is ~17.6 at
 *     N* = 1e4). Hence C_G = 2/y_star^2 is N-UNIFORM, bounded above by
 *     2/y_inf^2 ~ 0.2524 for every N.
 *   - The C_H / C_Lip wall (imp-2640) lives on the MICROSCOPIC collision strip
 *     y ~ g_min ~ sqrt(2 pi / N) -> 0, where the SAME 2/y^2 coefficient gives
 *     int 2/g^2 ds = (1/4) log(g0^2/(g0^2 - 8 t_c)) DIVERGENT as g -> 0 and an
 *     e-fold count S N / pi -> infinity. That is the genuinely undischargeable
 *     amplification. C_G is NOT that: it is the same inequality on a different,
 *     N-uniform strip, so it IS dischargeable. This module pins C_G precisely
 *     and confirms the mesoscopic / microscopic distinction explicitly; it makes
 *     NO claim about the imp-2640 microscopic wall.
 *
 * REFINEMENT OVER imp-2644
 * ------------------------
 * imp-2644 discharged C_G via the loose hand-claim "the drift strip has
 * y_star >= 1, so C_G = 2/y_star^2 <= 2". This module replaces that ad-hoc
 * y_star >= 1 with the ACTUAL Lemma-C density-floor strip y_star(N), which is
 * ~17.6 at N* = 1e4 (not 1), giving the SHARP value C_G(N* = 1e4) ~ 0.00649 --
 * about 300x below imp-2644's conservative 2 and ~150x below the placeholder
 * 1.0 -- and grounds the N-uniformity in the explicit Trudgian strip rather than
 * asserting it. No Lambda value changes; this tightens and rigorizes a constant.
 *
 * THE EXPLICIT C_G AND THE E_flow RE-SIZING AT N* = 1e4 (T0 = gamma_N ~ 9.879e3)
 * -----------------------------------------------------------------------------
 *   y_star(1e4)        ~ 17.5556     (mesoscopic Lemma-C density-floor strip)
 *   C_G = 2/y_star^2   ~ 0.006489    (rigorous, N-uniform; vs placeholder 1.0)
 *   prefactor C_F.L/T0 ~ 1.23890e-3  (C_F = 1.330578 pinned, imp-398)
 *   Gronwall factor exp(C_G.|t_c|):
 *       at |t_c| = 0.0071  (OLS proj.)      ~ 1.0000461   (placeholder 1.0: 1.0071253)
 *       at |t_c| = g_min^2/6 ~ 2.369e-4 (A1) ~ 1.0000015
 *   E_flow re-sizing at the OLS horizon:
 *       placeholder C_G = 1.0:  E_flow ~ 1.24773e-3
 *       rigorous   C_G = 0.0065: E_flow ~ 1.23896e-3   (~0.7% smaller, now rigorous)
 * The rigorous mesoscopic C_G shrinks the Gronwall factor from ~1.0071 to
 * ~1.00005, so E_flow is essentially the bare prefactor -- the C_G amplification
 * is genuinely negligible AND now pinned, not merely bounded by an O(1) guess.
 *
 * N-UNIFORMITY (the central honest claim)
 * ---------------------------------------
 * Across the anchored heights N in {1e4, 1e5, 1e6, 1e9, 1e12} the mesoscopic
 * y_star stays in [~7.26, ~17.56] and C_G = 2/y_star^2 in [~0.0065, ~0.038],
 * monotonically increasing in N but converging to the finite asymptotic supremum
 * 2/y_inf^2 ~ 0.2524 (y_inf = 0.448 . 2 pi). C_G is therefore bounded above by an
 * ABSOLUTE constant ~0.2524 independent of N -- the defining property the ticket
 * asks to confirm. This is the opposite of the microscopic 2/g^2 ~ N/pi -> infinity
 * of imp-2640.
 *
 * HONEST: this pins C_G (an E_flow constant); it does NOT touch the two binding
 * L_cond residuals -- |t_c_proj| (P1, OLS projection) and C_H inside E_coll (P3,
 * the imp-2640 microscopic wall). No false QED and no Lambda beat.
 *
 * @see backward-flow-stability-gronwall (Lemma B 2/y_star^2; Lemma C y_star strip)
 * @see imp-2633-l-cond-constant-discharge (P2: C_G placeholder, non-binding at N*=1e4)
 * @see imp-2644-eflow-gronwall-cg-discharge (prior loose y_star>=1 => C_G<=2 reading)
 * @see imp-2640 polymath15-lemma52-shock-holder (the MICROSCOPIC 2/g^2 wall -- NOT this)
 * @see polymath15-constant-C-F (imp-398, C_F prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const N_STAR = 1e4;

// ── Trudgian 2014 explicit S(T) bound + RvM height (same convention as Lemma C)
// of backward-flow-stability-gronwall.js. Recomputed locally (light, no heavy
// import) so this module is self-consistent with the Lemma-C density-floor strip.
const TRUDGIAN_A = 0.112;
const TRUDGIAN_B = 0.278;
const TRUDGIAN_C = 2.51;
const C0_RVM_REMAINDER = 1.0;

function rvmCount(T) {
  const u = T / TWO_PI;
  return u * (Math.log(u) - 1);
}
function rvmCountDeriv(T) {
  return Math.log(T / TWO_PI) / TWO_PI;
}
function gammaNFromRvM(N) {
  if (N < 2) return 14.134725;
  let T = (TWO_PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 8; i++) {
    const f = rvmCount(T) - N;
    const fp = rvmCountDeriv(T);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > TWO_PI)) T = TWO_PI + 1;
  }
  return T;
}
function rhoDensity(T) {
  return Math.log(T / TWO_PI) / TWO_PI;
}
function trudgianS(T) {
  const L = Math.log(T);
  return TRUDGIAN_A * L + TRUDGIAN_B * Math.log(L) + TRUDGIAN_C;
}

// ── The mesoscopic Lemma-C density-floor strip and the Gronwall C_G = 2/y_star^2
function yStarMesoscopic(N) {
  const gammaN = gammaNFromRvM(N);
  const rhoInt = rhoDensity(gammaN / 2);
  const sTru = trudgianS(gammaN);
  return (2 * (2 * sTru + C0_RVM_REMAINDER)) / rhoInt;
}
const cGFromStrip = (yStar) => 2 / (yStar * yStar);

// ── E_flow prefactor C_F . L / T0 -- analytically pinned (imp-398 / imp-838) ──
function cFlowPinned(T0) {
  return (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
}

const T0_N1E4 = effectiveHeightForN(N_STAR);
const L_N1E4 = Math.log(T0_N1E4);
const C_F_N1E4 = cFlowPinned(T0_N1E4);
const PREFACTOR = (C_F_N1E4 * L_N1E4) / T0_N1E4; // ~1.23890e-3

const Y_STAR_N1E4 = yStarMesoscopic(N_STAR); // ~17.5556
const C_G_N1E4 = cGFromStrip(Y_STAR_N1E4); // ~0.006489
const C_G_PLACEHOLDER = 1.0; // imp-2622 order-unity placeholder

// |t_c| inputs for the E_flow re-sizing: OLS projection vs rigorous A1 trap.
const TC_OLS = 0.0071; // imp-2632 OLS point estimate (NOT rigorous)
const G_MIN_N1E4 = 0.0376985; // Odlyzko-certified Lehmer-pair gap
const TC_A1 = (G_MIN_N1E4 * G_MIN_N1E4) / 6; // A1 Theta-trap ~ 2.369e-4

const eflow = (cG, tc) => PREFACTOR * Math.exp(cG * tc);

// ── N-uniformity sweep over the anchored heights ─────────────────────────────
// y_inf = 0.448 . 2 pi is the analytic asymptote of y_star (S_Tru ~ 0.112 log g,
// rho_int ~ log g / 2pi => y_star -> 2 . 2 . 0.112 . 2 pi). y_star decreases to it
// monotonically, so 2/y_inf^2 is the N-uniform SUPREMUM of C_G.
const Y_INF = 0.448 * TWO_PI; // ~2.81487
const C_G_SUP = cGFromStrip(Y_INF); // ~0.252414

const N_ANCHORS = [1e4, 1e5, 1e6, 1e9, 1e12];
const N_UNIFORM_TABLE = N_ANCHORS.map((N) => {
  const yStar = yStarMesoscopic(N);
  const cG = cGFromStrip(yStar);
  return {
    N: +N.toExponential(0),
    gammaN: +gammaNFromRvM(N).toExponential(4),
    y_star: +yStar.toFixed(4),
    C_G: +cG.toFixed(6),
    factor_at_OLS_tc: +Math.exp(cG * TC_OLS).toFixed(7),
  };
});
const C_G_MONOTONE_INCREASING = N_UNIFORM_TABLE.every(
  (r, i) => i === 0 || r.C_G > N_UNIFORM_TABLE[i - 1].C_G,
);
const C_G_BELOW_SUP = N_UNIFORM_TABLE.every((r) => r.C_G < C_G_SUP);

export const IMP2688_C_G_LOGLIPSCHITZ_BOUND = {
  id: 'imp-2688',
  question:
    'Pin the E_flow Gronwall amplification constant C_G to a rigorous backward-flow log-Lipschitz bound, evaluated on the explicit mesoscopic Trudgian density-floor strip where it is N-uniform; report the explicit C_G and the E_flow re-sizing.',
  N_star: N_STAR,
  gronwallStep: {
    inequality: 'd(Im M)/ds >= -(2 / y_star^2) Im M  (imp-838 / Lemma B; from |dz^2 M| <= (2/y^2) Im M)',
    integratesTo: 'amplification over horizon S is at most exp((2/y_star^2) . S)',
    cGFormula: 'C_G(y_star) = 2 / y_star^2  (matching exp(C_G . |t_c|))',
    source: 'backward-flow-stability-gronwall.js Lemma B',
  },
  mesoscopicStrip: {
    formula: 'y_star(N) = 2 (2 S_Tru(gamma_N) + c0) / rho_int  (Lemma C density floor)',
    S_Tru: 'Trudgian 2014: 0.112 log T + 0.278 log log T + 2.510 (T >= e)',
    c0: C0_RVM_REMAINDER,
    classification: 'MESOSCOPIC: y_star = O(1) bounded away from 0, so 2/y_star^2 is N-UNIFORM',
    contrastWithImp2640:
      'NOT the microscopic collision strip y ~ g_min ~ sqrt(2 pi/N) -> 0 where 2/g^2 ' +
      'diverges (the imp-2640 C_H/C_Lip wall, e-fold S N/pi -> infinity). Same inequality, ' +
      'different N-uniform strip -- do NOT conflate.',
  },
  atNStar: {
    T0: +T0_N1E4.toExponential(4), // gamma_N ~ 9.879e3
    logT0: +L_N1E4.toFixed(4), // ~9.198
    y_star: +Y_STAR_N1E4.toFixed(4), // ~17.5556
    C_G_rigorous: +C_G_N1E4.toFixed(6), // ~0.006489
    C_G_placeholder: C_G_PLACEHOLDER, // 1.0 (imp-2622)
    C_F: +C_F_N1E4.toFixed(6), // 1.330578 (imp-398 pinned)
    prefactor: +PREFACTOR.toExponential(5), // C_F . L / T0 ~ 1.23890e-3
  },
  eflowResizing: {
    note: 'Gronwall factor exp(C_G . |t_c|); with the rigorous mesoscopic C_G it is ~1.00005 vs ~1.0071 at the placeholder.',
    at_OLS_tc: {
      tc: TC_OLS,
      factor_rigorous: +Math.exp(C_G_N1E4 * TC_OLS).toFixed(7), // 1.0000461
      factor_placeholder: +Math.exp(C_G_PLACEHOLDER * TC_OLS).toFixed(7), // 1.0071253
      E_flow_rigorous: +eflow(C_G_N1E4, TC_OLS).toExponential(5), // 1.23896e-3
      E_flow_placeholder: +eflow(C_G_PLACEHOLDER, TC_OLS).toExponential(5), // 1.24773e-3
      shrinkPercent: +(100 * (1 - eflow(C_G_N1E4, TC_OLS) / eflow(C_G_PLACEHOLDER, TC_OLS))).toFixed(2),
    },
    at_A1_tc: {
      tc: +TC_A1.toExponential(4), // 2.369e-4
      factor_rigorous: +Math.exp(C_G_N1E4 * TC_A1).toFixed(7), // 1.0000015
      E_flow_rigorous: +eflow(C_G_N1E4, TC_A1).toExponential(5), // 1.23890e-3
    },
  },
  nUniformity: {
    y_inf_asymptote: +Y_INF.toFixed(5), // 2.81487 = 0.448 . 2 pi
    C_G_supremum: +C_G_SUP.toFixed(6), // 0.252414 = 2/y_inf^2
    table: N_UNIFORM_TABLE,
    monotoneIncreasingInN: C_G_MONOTONE_INCREASING,
    boundedBySupForAllN: C_G_BELOW_SUP,
    statement:
      'C_G = 2/y_star(N)^2 is bounded above by the absolute constant 2/y_inf^2 ~ 0.2524 for ' +
      'every N (y_star decreases monotonically to y_inf = 0.448 . 2 pi). N-uniform, finite -- ' +
      'unlike the microscopic 2/g^2 ~ N/pi -> infinity.',
  },
  honestResiduals: [
    'This pins C_G, an E_flow constant. It does NOT discharge the two BINDING L_cond residuals: |t_c_proj| (P1, OLS projection, imp-2632) and C_H inside E_coll (P3, the imp-2640 microscopic 2/g^2 wall).',
    'The y_inf = 0.448 . 2 pi asymptote and the monotone decrease of y_star are the analytic limit of the Trudgian strip and are verified numerically across the anchored heights; the directly-anchored finite-N values (1e4..1e12) are listed and are the rigorous content.',
    'No Lambda value changes: at N* = 1e4 the Gronwall factor moves from ~1.0071 (placeholder) to ~1.00005 (rigorous), shrinking E_flow by ~0.7%. This rigorizes and tightens a non-binding constant; it is not a beat.',
  ],
  honestVerdict:
    'C_G PINNED. The E_flow Gronwall log-Lipschitz amplification constant equals the ' +
    'backward-flow Gronwall coefficient C_G = 2/y_star^2 evaluated on the EXPLICIT Lemma-C ' +
    'mesoscopic density-floor strip. At N* = 1e4 the strip is y_star ~ 17.56, giving the sharp ' +
    'rigorous value C_G ~ 0.00649 (vs the order-unity placeholder 1.0 and imp-2644 loose 2). ' +
    'Because the strip is MESOSCOPIC -- y_star = O(1) bounded away from 0, decreasing to ' +
    'y_inf = 0.448 . 2 pi ~ 2.815 -- C_G is N-UNIFORM, bounded by 2/y_inf^2 ~ 0.2524 for all N. ' +
    'This is the deliberately-NOT the microscopic 2/g^2 ~ N/pi -> infinity wall of imp-2640 ' +
    '(C_H/C_Lip); same inequality, different N-uniform strip. The E_flow Gronwall factor at ' +
    'N* = 1e4 tightens from ~1.0071 to ~1.00005. NO false QED: the binding L_cond residuals ' +
    '(|t_c_proj| and C_H) are untouched and no Lambda value changes.',
  citation:
    'backward-flow-stability-gronwall.js Lemma B (2/y_star^2) + Lemma C (mesoscopic y_star, Trudgian 2014 S(T)); imp-398 polymath15-constant-C-F.js (C_F); imp-2622-bridge-recomposition.js (C_G=1.0 placeholder); imp-2640 polymath15-lemma52-shock-holder.js (microscopic 2/g^2 wall, NOT this); imp-2644 (prior loose y_star>=1 reading)',
};

export const IMP2688_C_G_LOGLIPSCHITZ_BOUND_ASSERTIONS = [
  {
    id: 'imp2688-cg-equals-gronwall-coefficient',
    description: 'C_G is the Gronwall coefficient 2/y_star^2 from the d(Im M)/ds >= -(2/y^2) Im M step',
    holds: () => Math.abs(C_G_N1E4 - 2 / (Y_STAR_N1E4 * Y_STAR_N1E4)) < 1e-15,
  },
  {
    id: 'imp2688-mesoscopic-strip-value-at-nstar',
    description: 'Mesoscopic Lemma-C density-floor strip at N*=1e4 is y_star ~ 17.556 (O(1), bounded away from 0), giving the sharp C_G ~ 0.006489',
    holds: () =>
      Math.abs(Y_STAR_N1E4 - 17.5556) < 1e-3 &&
      Math.abs(C_G_N1E4 - 0.006489) < 1e-5 &&
      Y_STAR_N1E4 > 1,
  },
  {
    id: 'imp2688-cg-tighter-than-placeholder-and-imp2644',
    description: 'The rigorous mesoscopic C_G ~ 0.0065 is far below the placeholder 1.0 and the imp-2644 loose bound 2 (the actual strip is ~17.6, not 1)',
    holds: () => C_G_N1E4 < C_G_PLACEHOLDER / 100 && C_G_N1E4 < cGFromStrip(1.0) / 100,
  },
  {
    id: 'imp2688-eflow-factor-tightened',
    description: 'E_flow Gronwall factor at N*=1e4 tightens from ~1.0071 (placeholder) to ~1.00005 (rigorous) at the OLS horizon',
    holds: () => {
      const f = Math.exp(C_G_N1E4 * TC_OLS);
      const p = Math.exp(C_G_PLACEHOLDER * TC_OLS);
      return f > 1 && f < 1.0001 && p > 1.007 && p < 1.008;
    },
  },
  {
    id: 'imp2688-cg-N-uniform-bounded-above',
    description: 'C_G = 2/y_star^2 is N-uniform: monotone increasing in N but bounded above by the absolute supremum 2/y_inf^2 ~ 0.2524 (y_inf = 0.448 . 2 pi) across N in [1e4, 1e12]',
    holds: () =>
      C_G_MONOTONE_INCREASING &&
      C_G_BELOW_SUP &&
      Math.abs(C_G_SUP - 0.252414) < 1e-5 &&
      C_G_SUP < 1,
  },
  {
    id: 'imp2688-mesoscopic-not-microscopic-wall',
    description: 'HONEST distinction: the mesoscopic y_star is bounded away from 0 (N-uniform C_G), unlike the imp-2640 microscopic g_min ~ sqrt(2 pi/N) -> 0 where 2/g^2 diverges',
    holds: () => {
      const yMicro = (N) => Math.sqrt(TWO_PI / N); // imp-2640 collision strip
      const cgMicroGrows = cGFromStrip(yMicro(1e12)) > cGFromStrip(yMicro(1e4)) * 1e6;
      const yStarBoundedBelow = yStarMesoscopic(1e12) > Y_INF;
      return cgMicroGrows && yStarBoundedBelow;
    },
  },
];

for (const a of IMP2688_C_G_LOGLIPSCHITZ_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2688-c-g-loglipschitz-bound assertion failed: ${a.id}`);
  }
}
