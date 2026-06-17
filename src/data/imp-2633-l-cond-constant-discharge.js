/**
 * @module imp-2633-l-cond-constant-discharge
 *
 * imp-2633 (high, proof): Discharge the E_flow Gronwall constant and the E_coll
 * collision constant in L_cond to EXPLICIT rigorous numeric values at the
 * surviving finite-N* = 1e4 beat, thread the constants from their source
 * modules, and report the honest L_cond total with each sub-term pinned.
 *
 * BACKGROUND
 * ----------
 * The surviving finite-N* = 1e4 beat composes its binding term as
 *     L_cond = |t_c_proj| + E_flow + E_coll
 * (imp-2631 showed L_cond, NOT E_trunc, is what binds L_pt at N* = 1e4).
 * Two of the three sub-terms are constant-discharge work:
 *   - E_flow(N) = C_F . log(T0)/T0 . exp(C_G . |t_c|)         (imp-398)
 *   - E_coll(N) = C_C . sqrt(log(T0)/N)                       (imp-399)
 * This module pins both at N* = 1e4 and states which constants are rigorous
 * vs. which remain honest placeholders, naming the exact lemma that blocks each
 * residual placeholder. It does NOT change any Lambda value -- it is the honest
 * bookkeeping half of making L_cond a clean theorem.
 *
 * THE DISCHARGE AT N* = 1e4 (T0 = gamma_N approx 9.879e3, L = log T0 approx 9.198)
 * --------------------------------------------------------------------------------
 * (1) E_flow prefactor C_F -- RIGOROUSLY PINNED (imp-398 / imp-838).
 *     C_F(N) = (log(T0/2pi) + 1) / (2pi) is the analytically pinned off-ladder
 *     drift amplitude from the imp-322 boundary identity; at N* = 1e4 it is the
 *     explicit value C_F = 1.330578. No placeholder.
 *
 * (2) E_flow Gronwall exponential exp(C_G . |t_c|) -- NON-BINDING at N* = 1e4.
 *     The amplification constant C_G is an order-unity placeholder (C_G = 1.0,
 *     set in imp-2622-bridge-recomposition.js). BUT the exponent input |t_c| is
 *     microscopic at N* = 1e4 (|t_c_proj| approx 0.0071), so the whole Gronwall
 *     factor is essentially 1 REGARDLESS of C_G: it lies in [1.0071, 1.0736] for
 *     any C_G in [1, 10]. The amplification therefore moves E_flow by at most
 *     ~7%, so the C_G placeholder is NOT a binding obstruction to L_cond rigor
 *     at this N*. The two residual placeholders it does carry are named below.
 *
 * (3) E_coll collision constant C_C -- NUMERICAL ESTIMATE, NOT rigorously pinned
 *     (CORRECTED by imp-2661, reconciling with imp-2640 NEGATIVE).
 *     C_C = C_H . sqrt(C_KH) = (1/8) . sqrt(3 pi) = 0.383748 factors into:
 *       - C_KH = pi . C_Selberg = 3 pi (C_Selberg = 3.0) -- GENUINELY RIGOROUS but
 *         loose, from the Koksma-Hlawka / Selberg uniformity (imp-341/imp-366);
 *       - C_H = 1/8 -- a NUMERICAL PLACEHOLDER. imp-2640 (polymath15-lemma52-
 *         shock-holder.js l.404-457) proved C_H = C_shock . C_Lip / 4 is
 *         UNDISCHARGEABLE to an explicit N-uniform constant: the only bound on the
 *         gap-Lipschitz modulus C_Lip is the backward-flow Gronwall Jacobian
 *         ||DM|| <= 2/g^2, whose integral int 2/g^2 dt diverges logarithmically as
 *         g -> 0 at the microscopic collision scale g_min ~ sqrt(2 pi / N).
 *     The earlier "C_H = 1/8 from the quadratic-tangency regularization (imp-395)"
 *     reading is a numerical/heuristic value, NOT a theorem-backed N-uniform
 *     constant. So at N* = 1e4 E_coll = 0.0116385 is a NUMERICAL ESTIMATE
 *     contingent on the undischargeable C_H placeholder, not a rigorous value.
 *
 * HONEST L_cond TOTAL AT N* = 1e4
 * -------------------------------
 *     |t_c_proj|  approx 0.0071     (PROJECTED -- OLS point estimate, imp-2632)
 *     E_flow      approx 1.248e-3   (C_F pinned; Gronwall factor approx 1.007)
 *     E_coll      approx 1.164e-2   (NUMERICAL -- C_H contingent on the
 *                                    undischargeable C_Lip, imp-2640)
 *     ---------------------------------------------------------------
 *     L_cond      approx 0.0200 < PT_BOUND = 0.2     (margin factor approx 10x)
 * NOTE (imp-2661): because E_coll carries the undischargeable C_H placeholder and
 * |t_c_proj| is an OLS projection, this L_cond is a NUMERICAL ESTIMATE, not a
 * rigorous value -- it does not yield a rigorous Lambda < 0.2. No false QED.
 * E_coll is the largest sub-term (~58%), confirming the imp-2632 correction that
 * E_coll -- not |t_c_proj| -- dominates L_cond at the surviving N* = 1e4.
 *
 * WHAT REMAINS A PLACEHOLDER, AND THE EXACT LEMMA BLOCKING IT
 * ----------------------------------------------------------
 *   P1 (the binding one). |t_c_proj| approx 0.0071 is the OLS POINT ESTIMATE
 *      a + b/N from PATH_C_BASELINE_FIT_V2 (imp-400), NOT a rigorous upper bound
 *      (imp-2632). Blocking lemmas: B1 (analytic slope upper bound, imp-363/370,
 *      closed only under the CM model by imp-470) + B2 (analytic intercept upper
 *      bound, lambda-zero-attack.js, closed only GUE-conditionally by imp-471).
 *   P2 (non-binding here). C_G, the Gronwall amplification constant in
 *      exp(C_G . |t_c|), is an order-unity placeholder (= 1.0, imp-2622).
 *      Blocking lemma: a rigorous upper bound on the backward-flow log-Lipschitz
 *      amplification constant over the horizon |t_c| (the imp-838 / Gronwall
 *      propagation step). Non-binding at N* = 1e4 because |t_c| is microscopic
 *      (factor <= 1.074 for any C_G <= 10), but it must be pinned for the
 *      theorem to be unconditional in C_G as well.
 *
 *   P3 (binding for E_coll rigor). C_H = 1/8 in C_C = C_H . sqrt(C_KH) is a
 *      NUMERICAL placeholder. Blocking lemma: imp-2640 -- C_H = C_shock . C_Lip / 4
 *      is undischargeable to an explicit N-uniform constant because the only bound
 *      on the gap-Lipschitz C_Lip (the backward-flow Gronwall Jacobian 2/g^2)
 *      diverges at the microscopic collision scale. Only the C_KH = 3 pi factor
 *      (C_Selberg = 3.0, imp-341/366) is genuinely rigorous (and loose).
 *
 * NET (CORRECTED by imp-2661): of the two sub-terms this ticket targets, E_coll is
 * a NUMERICAL ESTIMATE -- its C_KH factor is rigorous (loose) but its C_H factor is
 * the undischargeable placeholder of imp-2640 -- and E_flow is discharged up to its
 * |t_c| exponent input (C_F pinned, Gronwall factor harmlessly bounded near 1).
 * L_cond therefore has TWO binding residuals: |t_c_proj| (P1, OLS projection) and
 * C_H inside E_coll (P3). The honest L_cond is a numerical estimate, not a theorem.
 *
 * @see finite-height-beats-platt-trudgian (the N* = 1e4 beat; evaluateAtN formulas)
 * @see polymath15-constant-C-F (imp-398, C_F prefactor)
 * @see polymath15-constant-C-C (imp-399, C_C collision constant)
 * @see imp-2622-bridge-recomposition (C_G = 1.0 / TC_GRONWALL_BOUND placeholders)
 * @see imp-2632 TC_PROJ_STRESS_TEST (|t_c_proj| is OLS-projected, not rigorous)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const PT_BOUND = 0.2;
const N_STAR = 1e4;

// |t_c_proj| at N* = 1e4: OLS point estimate (imp-400 V2 fit), NOT rigorous.
// Read as the imp-2632 audited value so this module stays consistent with the
// stress-test record without re-deriving the V2 regression here.
const TC_PROJ_N1E4 = 0.0071;

// ── (1) E_flow prefactor C_F -- analytically pinned (imp-398 / imp-838) ──────
// C_F(N) = (log(T0/2pi) + 1) / (2pi), the off-ladder drift amplitude.
function cFlowPinned(T0) {
  return (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
}

// ── (2) Gronwall amplification factor exp(C_G * |t_c|) ───────────────────────
// C_G = 1.0 is an order-unity placeholder (imp-2622). The factor is essentially
// 1 at N* = 1e4 because |t_c| is microscopic; we record the band over a generous
// C_G range to show the placeholder is non-binding here.
const C_G_PLACEHOLDER = 1.0;
const gronwallFactor = (cG, tc) => Math.exp(cG * tc);

// ── (3) E_coll collision constant C_C -- rigorously pinned (imp-399) ─────────
// C_C = C_H * sqrt(C_KH) = (1/8) * sqrt(3 pi). Imported as C_C_PINNED.

const T0_N1E4 = effectiveHeightForN(N_STAR);
const L_N1E4 = Math.log(T0_N1E4);
const C_F_N1E4 = cFlowPinned(T0_N1E4);

const E_FLOW_N1E4 =
  C_F_N1E4 * (L_N1E4 / T0_N1E4) * gronwallFactor(C_G_PLACEHOLDER, TC_PROJ_N1E4);
const E_COLL_N1E4 = C_C_PINNED * Math.sqrt(L_N1E4 / N_STAR);
const L_COND_N1E4 = TC_PROJ_N1E4 + E_FLOW_N1E4 + E_COLL_N1E4;

// Gronwall-factor band over C_G in [1, 10] -- shows the placeholder is non-binding.
const GRONWALL_BAND = [1, 2, 5, 10].map((cG) => ({
  C_G: cG,
  factor: +gronwallFactor(cG, TC_PROJ_N1E4).toFixed(5),
  E_flow: +(C_F_N1E4 * (L_N1E4 / T0_N1E4) * gronwallFactor(cG, TC_PROJ_N1E4)).toExponential(4),
}));

export const IMP2633_L_COND_CONSTANT_DISCHARGE = {
  id: 'imp-2633',
  question:
    'Discharge the E_flow Gronwall constant and the E_coll collision constant in L_cond to explicit rigorous values at N* = 1e4; report the honest L_cond total with each sub-term pinned.',
  N_star: N_STAR,
  heightInputs: {
    T0: +T0_N1E4.toExponential(4),       // gamma_N approx 9.879e3
    logT0: +L_N1E4.toFixed(4),           // approx 9.198
  },
  subterms: {
    tcProj: {
      value: TC_PROJ_N1E4,
      status: 'PROJECTED-NOT-RIGOROUS',
      source: 'OLS point estimate a + b/N from PATH_C_BASELINE_FIT_V2 (imp-400)',
      blockingLemma:
        'B1 (analytic slope bound, imp-363/370; CM-model only via imp-470) + B2 (analytic intercept bound, lambda-zero-attack.js; GUE-conditional via imp-471)',
    },
    E_flow: {
      value: +E_FLOW_N1E4.toExponential(4),
      C_F: +C_F_N1E4.toFixed(6),
      C_F_status: 'RIGOROUSLY-PINNED (imp-398 / imp-838)',
      C_F_formula: '(log(T0/2pi) + 1) / (2pi)',
      gronwallFactor_CG1: +gronwallFactor(C_G_PLACEHOLDER, TC_PROJ_N1E4).toFixed(5),
      gronwallBand: GRONWALL_BAND,
      C_G_status: 'ORDER-UNITY-PLACEHOLDER (C_G = 1.0, imp-2622); NON-BINDING at N*=1e4',
      C_G_blockingLemma:
        'rigorous upper bound on the backward-flow log-Lipschitz amplification constant over horizon |t_c| (imp-838 Gronwall propagation step)',
      note:
        'C_F pinned; Gronwall factor in [1.0071, 1.0736] for C_G in [1,10] because |t_c| is microscopic, so the C_G placeholder shifts E_flow by <= ~7%.',
    },
    E_coll: {
      value: +E_COLL_N1E4.toFixed(7),
      C_C: +C_C_PINNED.toFixed(6),
      C_C_status:
        'NUMERICAL-ESTIMATE (corrected by imp-2661); contingent on the undischargeable C_H placeholder (imp-2640)',
      C_C_formula: 'C_H * sqrt(C_KH) = (1/8) * sqrt(3 pi)',
      C_KH_status: 'RIGOROUS-BUT-LOOSE: C_KH = pi * C_Selberg = 3 pi, C_Selberg = 3.0 (imp-341/366)',
      C_H_status:
        'NUMERICAL-PLACEHOLDER: C_H = C_shock * C_Lip / 4 is UNDISCHARGEABLE to an N-uniform constant (imp-2640) -- the gap-Lipschitz C_Lip only has the Gronwall 2/g^2 bound, which diverges at the microscopic collision scale',
      C_H_blockingLemma:
        'imp-2640 polymath15-lemma52-shock-holder.js l.404-457 (int 2/g^2 dt diverges as g -> 0 at g_min ~ sqrt(2 pi / N))',
    },
  },
  L_cond: +L_COND_N1E4.toFixed(7),
  beatsPT: L_COND_N1E4 < PT_BOUND,
  marginFactor: +(PT_BOUND / L_COND_N1E4).toFixed(2),
  dominantSubterm: 'E_coll',  // confirms imp-2632 correction at N* = 1e4
  honestVerdict:
    'CORRECTED by imp-2661 (reconciling with imp-2640 NEGATIVE): E_coll = 0.0116385 ' +
    'is a NUMERICAL ESTIMATE, not a rigorous value. Its C_C = (1/8) sqrt(3 pi) factors ' +
    'into a genuinely-rigorous-but-loose C_KH = 3 pi (C_Selberg = 3.0, imp-341/366) ' +
    'and a C_H = 1/8 placeholder that imp-2640 proved UNDISCHARGEABLE (C_H = C_shock . ' +
    'C_Lip / 4; the gap-Lipschitz C_Lip only has the Gronwall 2/g^2 bound, which ' +
    'diverges at the collision scale). E_flow is discharged up to its |t_c| exponent ' +
    'input (C_F = 1.330578 pinned by imp-398, Gronwall factor approx 1.007 non-binding ' +
    'for any reasonable C_G). L_cond approx 0.0200 < 0.2 therefore holds NUMERICALLY ' +
    'but is NOT a rigorous bound: it carries TWO binding placeholders, |t_c_proj| (the ' +
    'OLS projection, imp-2632) and C_H inside E_coll (imp-2640). No false QED.',
  reconciliation:
    'imp-2661: previously this module classified E_coll / C_C as RIGOROUSLY-PINNED, ' +
    'contradicting imp-2640 (C_H undischargeable). Corrected here to NUMERICAL-ESTIMATE; ' +
    'only the C_KH = 3 pi (C_Selberg = 3.0) factor remains genuinely rigorous (loose).',
  citation:
    'imp-398 polymath15-constant-C-F.js (C_F); imp-399 polymath15-constant-C-C.js (C_C); imp-2622-bridge-recomposition.js (C_G placeholder); imp-2632 finite-height-beats-platt-trudgian.js (|t_c_proj| OLS stress-test)',
};

export const IMP2633_L_COND_CONSTANT_DISCHARGE_ASSERTIONS = [
  {
    id: 'imp2633-CF-pinned-explicit',
    description: 'E_flow prefactor C_F at N*=1e4 is the analytically pinned value (log(T0/2pi)+1)/(2pi) approx 1.3306',
    holds: () => Math.abs(C_F_N1E4 - 1.330578) < 1e-4,
  },
  {
    id: 'imp2633-CC-numerical-value',
    description: 'E_coll collision constant C_C evaluates to the numerical value (1/8) sqrt(3 pi) approx 0.38375; its C_H = 1/8 factor is a placeholder (imp-2640), NOT rigorously pinned',
    holds: () => Math.abs(C_C_PINNED - (1 / 8) * Math.sqrt(3 * Math.PI)) < 1e-12,
  },
  {
    id: 'imp2661-ecoll-classified-numerical',
    description: 'imp-2661 reconciliation: E_coll C_C_status is downgraded to NUMERICAL-ESTIMATE (no longer claims RIGOROUSLY-PINNED), matching the imp-2640 NEGATIVE verdict on C_H',
    holds: () => {
      const s = IMP2633_L_COND_CONSTANT_DISCHARGE.subterms.E_coll.C_C_status;
      return s.includes('NUMERICAL-ESTIMATE') && !s.includes('RIGOROUSLY-PINNED');
    },
  },
  {
    id: 'imp2633-gronwall-factor-nonbinding',
    description: 'Gronwall factor exp(C_G |t_c|) stays in [1.007, 1.074] for C_G in [1,10] at N*=1e4 -- the C_G placeholder is non-binding',
    holds: () => {
      const lo = gronwallFactor(1, TC_PROJ_N1E4);
      const hi = gronwallFactor(10, TC_PROJ_N1E4);
      return lo > 1.0 && lo < 1.01 && hi < 1.08;
    },
  },
  {
    id: 'imp2633-ecoll-explicit-value',
    description: 'E_coll evaluates to the numerical value approx 0.01164 at N*=1e4 (contingent on the C_H placeholder, imp-2640)',
    holds: () => Math.abs(E_COLL_N1E4 - 0.0116385) < 1e-5,
  },
  {
    id: 'imp2633-L-cond-total-beats-PT',
    description: 'L_cond numerical estimate at N*=1e4 is approx 0.020 and numerically beats PT_BOUND = 0.2 by ~10x (NOT a rigorous bound: carries the |t_c_proj| and C_H placeholders)',
    holds: () =>
      L_COND_N1E4 > 0.019 &&
      L_COND_N1E4 < 0.021 &&
      L_COND_N1E4 < PT_BOUND &&
      PT_BOUND / L_COND_N1E4 > 9,
  },
  {
    id: 'imp2633-ecoll-dominant-at-nstar',
    description: 'E_coll is the largest L_cond sub-term at N*=1e4 (confirms imp-2632 correction)',
    holds: () =>
      E_COLL_N1E4 > E_FLOW_N1E4 &&
      E_COLL_N1E4 > TC_PROJ_N1E4 &&
      IMP2633_L_COND_CONSTANT_DISCHARGE.dominantSubterm === 'E_coll',
  },
];

for (const a of IMP2633_L_COND_CONSTANT_DISCHARGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2633-l-cond-constant-discharge assertion failed: ${a.id}`);
  }
}
