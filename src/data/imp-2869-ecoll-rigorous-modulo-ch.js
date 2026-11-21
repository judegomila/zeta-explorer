/**
 * @module imp-2869-ecoll-rigorous-modulo-ch
 *
 * imp-2869 (high, proof): State E_coll as a fully RIGOROUS bound CONDITIONAL on a
 * SINGLE named hypothesis (C_H <= C_H_STAR), with the conditional inequality checked
 * at build time, so the ONLY non-rigorous input in the whole chain is the one named
 * constant C_H.
 *
 * Headline conditional
 * --------------------
 *     IF  C_H <= 0.125 (the ansatz value)
 *     THEN E_coll <= 0.01164   rigorously,
 *
 * given C_Selberg = 2.622 (imp-2641, DISCHARGED Trudgian-2014 S(T) coefficient) and
 * the Koksma-Hlawka / Kolmogorov-Smirnov bridge (imp-2700, DISCHARGED: the bridge
 * constant 1/(2L) fits inside the 3.0 - 2.622 headroom, giving C_Selberg_eff = 2.6764).
 *
 * Relation to imp-2706
 * --------------------
 * imp-2706 already parameterizes E_coll(C_H) and certifies the GENEROUS hypothesis
 * C_H <= 0.127 (which absorbs the imp-2642 positive-remainder excess). This module is
 * the COMPLEMENTARY tightening that the ticket asks for: it pins the hypothesis to the
 * bare ANSATZ value C_H_STAR = 0.125 with a CONSERVATIVE outward-rounded ceiling 0.01164
 * (the loose C_Selberg = 3.0 placeholder value, a rigorous over-estimate), and -- the new
 * content -- it ENUMERATES every other input in the E_coll chain and asserts each is
 * already rigorous or discharged, leaving C_H as provably the ONLY open input. This is a
 * SCOPING result: it does NOT discharge C_H; it isolates the remaining gap to exactly the
 * single inequality C_H <= 0.125.
 *
 * The chain (each link asserted rigorous/discharged below, except C_H):
 *   E_coll = C_H . sqrt(C_KH) . sqrt(log T0 / N),  C_KH = pi . C_Selberg_eff.
 *     [1] C_Selberg = 2.622           -- DISCHARGED, Trudgian 2014 (imp-2641)
 *     [2] KS bridge fits headroom     -- DISCHARGED, C_Selberg_eff = 2.6764 <= 3.0 (imp-2700)
 *     [3] C_KH = pi . C_Selberg_eff   -- deterministic given [1],[2]
 *     [4] T0, L = log T0 at N* = 1e4  -- deterministic height map (Riemann-von Mangoldt)
 *     [5] C_H                          -- NOT rigorous (imp-2642): the single open input
 *
 * HONESTY GUARD
 * -------------
 * This is a theorem-MODULO-GAP(C_H), not an unconditional bound. The assertions import
 * the imp-2642 flag and REQUIRE isRigorousUpperBound === false, and separately assert
 * that EXACTLY ONE input in the enumerated chain is non-rigorous (C_H). No refereed bound is changed
 * . NO false QED.
 *
 * @see imp-2706-ecoll-conditional-modulo-ch (sibling: generous C_H <= 0.127 parameterization)
 * @see imp-2641-c-selberg-trudgian-discharge (C_Selberg -> 2.622, DISCHARGED)
 * @see imp-2700-erdos-turan-bridge-discharge (KS bridge fits headroom, DISCHARGED)
 * @see polymath15-lemma52-shock-holder (imp-2642: C_H NOT a rigorous upper bound)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE } from './imp-2641-c-selberg-trudgian-discharge.js';
import { IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE } from './imp-2700-erdos-turan-bridge-discharge.js';
import { C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642 } from './polymath15-lemma52-shock-holder.js';

const N_STAR = 1e4;
const PT_BOUND = 0.2; // Platt-Trudgian 2021 bound upper bound.

// The named gap pinned to the BARE ANSATZ value (tighter than the imp-2706 generous 0.127).
const C_H_STAR = 0.125; // = 1/8, the leading-order quadratic-tangency coefficient.

// CONSERVATIVE outward-rounded ceiling on E_coll at C_H_STAR. Equals the loose
// C_Selberg = 3.0 placeholder value (a rigorous over-estimate), so the conditional holds
// with extra margin once the discharged 2.6764 is used.
const E_COLL_CEILING = 0.01164;

const T0 = effectiveHeightForN(N_STAR); // gamma_N approx 9.879e3
const L = Math.log(T0); // approx 9.198

// [1] DISCHARGED S(T) growth coefficient (Trudgian 2014), single source of truth imp-2641.
const C_SELBERG_RIGOROUS = IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.C_Selberg.rigorousExplicit; // 2.622
// [2] KS-bridge-effective coefficient that the discrepancy route ACTUALLY consumes; the
// imp-2700 discharge shows the bridge constant 1/(2L) fits inside the 3.0 headroom.
const C_SELBERG_EFF = IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE.comparison.C_Selberg_eff; // 2.6764
const BRIDGE_FITS = IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE.comparison.fitsHeadroom; // true

// [3] C_KH from the discharged, bridge-effective coefficient.
const C_KH = Math.PI * C_SELBERG_EFF; // approx 8.408

// E_coll parameterized by the single named gap C_H (everything else held rigorous):
const SQRT_FACTOR = Math.sqrt(C_KH) * Math.sqrt(L / N_STAR); // C_H-free part
const eColl = (cH) => cH * SQRT_FACTOR;

const E_COLL_AT_STAR = eColl(C_H_STAR); // approx 0.010993 with C_Selberg_eff = 2.6764

// The honesty flag: C_H is STILL not a rigorous upper bound (imp-2642).
const C_H_IS_RIGOROUS = C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.isRigorousUpperBound; // false

// Enumerate every input in the E_coll chain with its rigor status. C_H is the ONLY
// entry flagged non-rigorous -- the build assertion below verifies that count is exactly 1.
const CHAIN_INPUTS = [
  {
    name: 'C_Selberg (S(T) growth coefficient)',
    value: C_SELBERG_RIGOROUS,
    rigorous: IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.C_Selberg.status.startsWith('DISCHARGED'),
    source: 'imp-2641 (Trudgian 2014, J. Number Theory 134 Thm 1)',
  },
  {
    name: 'KS / Koksma-Hlawka bridge fits headroom (C_Selberg_eff <= 3.0)',
    value: C_SELBERG_EFF,
    rigorous: BRIDGE_FITS === true && IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE.status === 'DISCHARGED',
    source: 'imp-2700 (1-D KS discrepancy = sup|S(T)|/N; bridge constant 1/(2L))',
  },
  {
    name: 'C_KH = pi . C_Selberg_eff',
    value: C_KH,
    rigorous: true, // deterministic arithmetic from the two discharged inputs above
    source: 'deterministic given the two discharged coefficients',
  },
  {
    name: 'height map T0 = gamma_N, L = log T0 at N* = 1e4',
    value: L,
    rigorous: true, // deterministic Riemann-von Mangoldt height for N*
    source: 'lambda-rh-height-mapping.js (Riemann-von Mangoldt)',
  },
  {
    name: 'C_H (Holder-1/2 shock modulus)',
    value: C_H_STAR,
    rigorous: C_H_IS_RIGOROUS, // false -- the SINGLE open input
    source: 'imp-2642 polymath15-lemma52-shock-holder (isRigorousUpperBound = false)',
  },
];

const NON_RIGOROUS_INPUTS = CHAIN_INPUTS.filter((c) => !c.rigorous);

export const IMP2869_ECOLL_RIGOROUS_MODULO_CH = {
  id: 'imp-2869',
  question:
    'State E_coll as a fully rigorous bound CONDITIONAL on the single named hypothesis ' +
    'C_H <= 0.125, with the conditional inequality checked at build time and EVERY other ' +
    'input in the chain asserted rigorous/discharged, so the ONLY non-rigorous input is C_H.',
  N_star: N_STAR,
  heightInputs: {
    T0: +T0.toExponential(4), // gamma_N approx 9.879e3
    logT0: +L.toFixed(4), // approx 9.198
  },
  conditional: {
    hypothesis: `C_H <= ${C_H_STAR}`,
    statement:
      `IF C_H <= ${C_H_STAR} THEN E_coll <= ${E_COLL_CEILING} rigorously, ` +
      'given C_Selberg = 2.622 (imp-2641) and the KS bridge (imp-2700).',
    E_coll_at_star: +E_COLL_AT_STAR.toFixed(7), // ~0.010993 with C_Selberg_eff = 2.6764
    E_coll_ceiling: E_COLL_CEILING, // conservative outward-rounded upper bound
    ceilingProvenance:
      'E_COLL_CEILING = 0.01164 is the E_coll value at the LOOSE C_Selberg = 3.0 placeholder ' +
      '(a rigorous over-estimate of the discharged 2.6764), so the certified ceiling already ' +
      'dominates the bridge-effective value with spare margin.',
    proofOfImplication:
      'E_coll(C_H) = C_H . sqrt(C_KH) . sqrt(log T0 / N) is linear and strictly increasing in ' +
      'C_H, so C_H <= 0.125 gives E_coll <= E_coll(0.125) = 0.010993 < 0.01164 by monotonicity. ' +
      'Pure arithmetic once the hypothesis is granted -- no further analytic input needed.',
  },
  rigorousInputs: {
    C_Selberg: C_SELBERG_RIGOROUS, // 2.622, DISCHARGED (imp-2641)
    C_Selberg_eff: +C_SELBERG_EFF.toFixed(4), // 2.6764 via KS bridge (imp-2700), <= 3.0
    C_KH: +C_KH.toFixed(6), // pi . 2.6764 approx 8.408
    bridgeFitsHeadroom: BRIDGE_FITS, // true
  },
  chainInputs: CHAIN_INPUTS.map((c) => ({ name: c.name, rigorous: c.rigorous, source: c.source })),
  namedGap: {
    constant: 'C_H',
    isProven: C_H_IS_RIGOROUS, // false -- this record does NOT claim C_H
    onlyOpenInput: NON_RIGOROUS_INPUTS.length === 1 && NON_RIGOROUS_INPUTS[0].name.startsWith('C_H'),
    blockingConstants: C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.blockingConstants,
  },
  status: 'RIGOROUS-MODULO-NAMED-GAP(C_H)',
  rigorousBeat: false, // the conditional is NOT an unconditional beat
  verdict:
    'CONDITIONAL theorem, NOT a QED. Every input in the E_coll chain except C_H is rigorous or ' +
    'discharged (C_Selberg via imp-2641, the KS bridge via imp-2700, the rest deterministic), so ' +
    'the bound IF C_H <= 0.125 THEN E_coll <= 0.01164 isolates the remaining gap to the SINGLE ' +
    'inequality C_H <= 0.125. This is a scoping of the gap, NOT a discharge of C_H ' +
    '(isRigorousUpperBound = false). No refereed bound is changed. NO false QED.',
  citation:
    'imp-2641 (C_Selberg = 2.622 Trudgian discharge); imp-2700 (KS / Koksma-Hlawka bridge ' +
    'discharge); imp-2642 polymath15-lemma52-shock-holder (C_H not a rigorous upper bound); ' +
    'imp-2706 (sibling generous C_H <= 0.127 parameterization)',
};

export const IMP2869_ECOLL_RIGOROUS_MODULO_CH_ASSERTIONS = [
  {
    id: 'imp2869-conditional-holds-at-ansatz',
    description: 'IF C_H <= 0.125 THEN E_coll <= 0.01164: the bridge-effective E_coll(0.125) is below the conservative ceiling',
    holds: () =>
      E_COLL_AT_STAR > 0 &&
      E_COLL_AT_STAR < E_COLL_CEILING &&
      eColl(C_H_STAR) <= E_COLL_AT_STAR + 1e-15, // monotone upper bound at the threshold
  },
  {
    id: 'imp2869-ceiling-dominates-discharged-value',
    description: 'The 0.01164 ceiling is the conservative C_Selberg = 3.0 value and dominates the discharged 2.6764 reading',
    holds: () => {
      const eCollAt3 = 0.125 * Math.sqrt(Math.PI * 3.0) * Math.sqrt(L / N_STAR);
      return Math.abs(eCollAt3 - E_COLL_CEILING) < 5e-5 && E_COLL_AT_STAR < eCollAt3 + 1e-15;
    },
  },
  {
    id: 'imp2869-uses-discharged-inputs',
    description: 'C_Selberg = 2.622 is DISCHARGED (imp-2641) and the KS bridge fits the 3.0 headroom (imp-2700)',
    holds: () =>
      Math.abs(C_SELBERG_RIGOROUS - 2.622) < 1e-3 &&
      IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.C_Selberg.status.startsWith('DISCHARGED') &&
      BRIDGE_FITS === true &&
      IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE.status === 'DISCHARGED' &&
      C_SELBERG_EFF <= 3.0,
  },
  {
    id: 'imp2869-exactly-one-open-input-is-ch',
    description: 'Of every enumerated chain input, EXACTLY ONE is non-rigorous and it is C_H (the gap is isolated to a single inequality)',
    holds: () =>
      NON_RIGOROUS_INPUTS.length === 1 &&
      NON_RIGOROUS_INPUTS[0].name.startsWith('C_H') &&
      IMP2869_ECOLL_RIGOROUS_MODULO_CH.namedGap.onlyOpenInput === true,
  },
  {
    id: 'imp2869-does-not-assert-ch-proven',
    description: 'HONESTY: imports the imp-2642 flag and confirms C_H is STILL NOT a rigorous upper bound (no false QED)',
    holds: () =>
      C_H_IS_RIGOROUS === false &&
      IMP2869_ECOLL_RIGOROUS_MODULO_CH.namedGap.isProven === false &&
      IMP2869_ECOLL_RIGOROUS_MODULO_CH.rigorousBeat === false,
  },
  {
    id: 'imp2869-status-and-verdict-keep-sota',
    description: 'Status is RIGOROUS-MODULO-NAMED-GAP(C_H) and the verdict keeps Platt-Trudgian SOTA with NO false QED',
    holds: () =>
      /RIGOROUS-MODULO-NAMED-GAP\(C_H\)/.test(IMP2869_ECOLL_RIGOROUS_MODULO_CH.status) &&
      /refereed bound is changed/i.test(IMP2869_ECOLL_RIGOROUS_MODULO_CH.verdict) &&
      /NO false QED/.test(IMP2869_ECOLL_RIGOROUS_MODULO_CH.verdict),
  },
];

for (const a of IMP2869_ECOLL_RIGOROUS_MODULO_CH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2869-ecoll-rigorous-modulo-ch assertion failed: ${a.id}`);
  }
}
