/**
 * imp-2864 — Erdos-Turan bridge route lock (tripwire for the imp-2700 DISCHARGED verdict).
 *
 * PURPOSE
 *   imp-2700 resolves the Erdos-Turan bridge O(1) constant as DISCHARGED for the
 *   1-D KS / Stieltjes route that the chain actually uses:
 *       C_Selberg_eff = 2.622 (Trudgian S(T) growth) + 0.0544 (half-gap KS bridge)
 *                     = 2.6764 <= 3.0,  margin ~0.324.
 *   This verdict explicitly RECONCILES the apparent imp-2759 exponential-sum
 *   negative (effective coefficient ~9.98, ~26x the headroom): that blow-up is
 *   the WRONG route (sharp Erdos-Turan fed the scalar aggregate S(T)), which
 *   koksma_hlawka_ineq does not take.
 *
 *   The discharge is fragile precisely because it hinges on a ROUTE CHOICE. A
 *   future edit that re-attributes starDiscrepancy_N to the exponential-sum
 *   Erdos-Turan route (or flips the routeAnalysis.erdosTuranNeeded flag) would
 *   silently swap the 0.0544 bridge for the ~9.98 blow-up and BREAK the discharge
 *   with no build-time signal. This module is a build-time lock that throws the
 *   moment the route invariant, the headroom fit, or the gap classification
 *   drifts.
 *
 * INVARIANTS LOCKED
 *   (a) The discharged effective coefficient stays inside the placeholder:
 *       C_Selberg_eff = 2.6764 < 3.0, fitsHeadroom === true, margin > 0.
 *   (b) The route invariant holds: koksma_hlawka_ineq feeds the 1-D Koksma-Hlawka
 *       test function (Var(f) <= pi/y), so starDiscrepancy_N is the Kolmogorov-
 *       Smirnov discrepancy = sup|S(T)|/N — the Erdos-Turan inequality is NOT
 *       invoked (routeAnalysis.erdosTuranNeeded === false).
 *   (c) The named gap GAP-E-COLL-C-SELBERG-ET stays SECONDARY (non-binding), not
 *       promoted to BINDING / BINDING-BLOCKER.
 *
 * HONEST SCOPE
 *   This locks the CLASSIFICATION only. It does not upgrade C_H, does not make
 *   E_coll a rigorous N-uniform bound, and does not turn the conditional discharge
 *   into an unconditional one. It only guarantees that the route the discharge
 *   depends on cannot be silently re-pointed at the fatal exponential-sum detour.
 *
 * Side-effect imported by assertion-sweep-2026-04-12.js so the throws below stay
 * reachable from the production import graph (dead-assertion audit, imp-501 / imp-2702).
 *
 * @see imp-2700-erdos-turan-bridge-discharge.js (the DISCHARGED verdict this locks)
 * @see imp-2759-erdos-turan-bridge-constant.js (the exponential-sum ~9.98 negative this guards against)
 * @see imp-2713-en-named-gap-registry.js (the GAP-E-COLL-C-SELBERG-ET SECONDARY classification)
 */

import { IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE } from './imp-2700-erdos-turan-bridge-discharge.js';
import { EN_GAP_REGISTRY } from './imp-2713-en-named-gap-registry.js';

const D = IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE;
const C_SELBERG_EFF = D.comparison.C_Selberg_eff;       // ~2.6764
const PLACEHOLDER = D.comparison.placeholder;            // 3.0
const FITS_HEADROOM = D.comparison.fitsHeadroom;         // true
const MARGIN = D.comparison.marginToPlaceholder;         // ~0.3236

const ROUTE = D.routeAnalysis;

const ET_GAP = EN_GAP_REGISTRY.find((g) => g.id === 'GAP-E-COLL-C-SELBERG-ET');

export const IMP2864_ERDOS_TURAN_ROUTE_LOCK = {
  id: 'imp-2864',
  title: 'Erdos-Turan bridge route lock (locks the imp-2700 DISCHARGED verdict against the imp-2759 negative)',
  guards: {
    cSelbergEff: C_SELBERG_EFF,                          // ~2.6764
    placeholder: PLACEHOLDER,                            // 3.0
    fitsHeadroom: FITS_HEADROOM,                         // true
    margin: MARGIN,                                      // ~0.3236
    erdosTuranNeeded: ROUTE.erdosTuranNeeded,            // false (the route invariant)
    gapStatus: ET_GAP ? ET_GAP.status : null,            // SECONDARY
    gapSeverity: ET_GAP ? ET_GAP.severity : null,        // SECONDARY
  },
  rationale:
    'The imp-2700 discharge fits only because koksma_hlawka_ineq feeds the 1-D KS ' +
    'route (Var(f) <= pi/y), where the bridge is the half-gap term 0.0544. If a ' +
    'refactor re-routes through exponential sums (sharp Erdos-Turan fed scalar S(T)), ' +
    'the bridge jumps to the imp-2759 ~9.98 blow-up and the discharge is fatally ' +
    'broken. This lock fails the build the moment the headroom fit, the ' +
    'erdosTuranNeeded route flag, or the GAP-E-COLL-C-SELBERG-ET SECONDARY ' +
    'classification drifts. It locks CLASSIFICATION only; it does not upgrade C_H.',
  source: 'imp-2700 (DISCHARGED for 1-D KS route); imp-2759 (exponential-sum ~9.98 negative); imp-2713 (gap registry); imp-2864 (this lock)',
};

export const IMP2864_ERDOS_TURAN_ROUTE_LOCK_ASSERTIONS = [
  {
    id: 'imp2864-discharged-coeff-below-placeholder',
    description: '(a) Discharged C_Selberg_eff = 2.6764 stays strictly below the 3.0 placeholder with positive margin',
    holds: () =>
      Math.abs(C_SELBERG_EFF - 2.6764) < 5e-3 &&
      C_SELBERG_EFF < PLACEHOLDER &&
      FITS_HEADROOM === true &&
      MARGIN > 0.3 && MARGIN < 0.35,
  },
  {
    id: 'imp2864-route-invariant-1d-ks-not-erdos-turan',
    description: '(b) Route invariant: koksma_hlawka_ineq uses the 1-D Var(f) <= pi/y test function (KS discrepancy = sup|S(T)|/N), NOT the Erdos-Turan inequality',
    holds: () =>
      ROUTE.erdosTuranNeeded === false &&
      /Var\(f\) <= pi\/y/.test(ROUTE.consumer) &&
      /Kolmogorov-Smirnov/.test(ROUTE.discrepancyKind) &&
      /sup_T \|S\(T\)\|\/N/.test(ROUTE.identity),
  },
  {
    id: 'imp2864-gap-stays-secondary-non-binding',
    description: '(c) GAP-E-COLL-C-SELBERG-ET stays SECONDARY (non-binding), not promoted to BINDING / BINDING-BLOCKER',
    holds: () =>
      !!ET_GAP &&
      ET_GAP.status === 'SECONDARY' &&
      ET_GAP.severity === 'SECONDARY' &&
      ET_GAP.severity !== 'BINDING-BLOCKER',
  },
];

for (const a of IMP2864_ERDOS_TURAN_ROUTE_LOCK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2864-erdos-turan-route-lock assertion failed: ${a.id}`);
  }
}
