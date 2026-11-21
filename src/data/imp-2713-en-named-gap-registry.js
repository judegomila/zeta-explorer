/**
 * @module imp-2713-en-named-gap-registry
 *
 * imp-2713 (high, meta): Named-gap registry enumerating every undischargeable
 * placeholder in the E(N) = E_trunc + E_flow + E_coll Polymath15 bridge program.
 *
 * Exports EN_GAP_REGISTRY (4-entry array) and EN_GAP_REGISTRY_ASSERTIONS (8
 * build-time tripwires cross-checking registry entries against live source modules).
 *
 * Gap severity vocabulary:
 *   BINDING-BLOCKER -- blocks the rigorous Lambda < 0.2 beat; must be discharged first
 *   SECONDARY       -- non-binding at current constants but not yet fully discharged
 *   MINOR           -- proven O(1) but not explicitly certified; negligible contribution
 *   DISCHARGED      -- rigorously shown non-binding; no longer an obstacle
 *
 * Summary:
 *   GAP-E-COLL-C-H          BINDING-BLOCKER  E_coll dominant term (~90% of E(N))
 *   GAP-E-COLL-C-SELBERG-ET SECONDARY        non-binding at current constants
 *   GAP-E-TRUNC-C-T         MINOR            ~0.24% of E(N), negligible
 *   GAP-E-FLOW-C-G          DISCHARGED       imp-2644: non-binding for C_G <= 203
 *
 * @see imp-2643-honest-assembled-EN (capstone E(N) constant classification)
 * @see imp-2644-eflow-gronwall-cg-discharge (C_G discharge certification)
 * @see polymath15-lemma52-shock-holder (C_H verdict: isRigorousUpperBound=false)
 * @see imp-2641-c-selberg-trudgian-discharge (C_Selberg explicit Trudgian 2014 value)
 */

import { IMP2643_HONEST_ASSEMBLED_EN } from './imp-2643-honest-assembled-EN.js';
import { IMP2644_EFLOW_GRONWALL_CG_DISCHARGE } from './imp-2644-eflow-gronwall-cg-discharge.js';
import { C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642 } from './polymath15-lemma52-shock-holder.js';
import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE } from './imp-2641-c-selberg-trudgian-discharge.js';

export const EN_GAP_REGISTRY = [
  {
    id: "GAP-E-COLL-C-H",
    term: "E_coll",
    constant: "C_H",
    status: "UNDISCHARGEABLE",
    severity: "BINDING-BLOCKER",
    description:
      "C_H = C_shock * C_Lip / 4 is NOT a rigorous N-uniform upper bound. " +
      "The value 1/8 is the leading-order quadratic-tangency coefficient for the " +
      "two-particle R=0 dynamics, not the Holder modulus. C_Lip is non-N-uniform: " +
      "the Gronwall backward-flow integral diverges as g -> 0 at the microscopic " +
      "collision scale (imp-2640). E_coll is the dominant sub-term (~90% of E(N)), " +
      "so this gap blocks the rigorous Lambda < PT_BOUND = 0.2 beat.",
    dischargeRequirements: [
      "Polymath15 Lemma 5.2 C_cusp for C_shock (cusp-density W_1^{1/2} concentration)",
      "Non-Gronwall microscopic gap-stability modulus for an N-uniform C_Lip",
    ],
    sourceTickets: ["imp-2640", "imp-2642", "imp-2643"],
  },
  {
    id: "GAP-E-COLL-C-SELBERG-ET",
    term: "E_coll",
    constant: "C_Selberg (Erdos-Turan bridge)",
    status: "SECONDARY",
    severity: "SECONDARY",
    description:
      "C_Selberg discharged to the explicit Trudgian 2014 value 2.622 (imp-2641), " +
      "but the Erdos-Turan bridge O(1) constant in the dyson_star_discrepancy axiom " +
      "must be shown to fit inside the headroom 3.0 - 2.622 = 0.378. Non-binding at " +
      "current constants because C_Selberg = 3.0 was already conservative.",
    dischargeRequirements: [
      "Explicit upper bound on the Erdos-Turan bridge O(1) constant below 0.378",
    ],
    sourceTickets: ["imp-2641", "imp-2682", "imp-2700"],
  },
  {
    id: "GAP-E-TRUNC-C-T",
    term: "E_trunc",
    constant: "C_T",
    status: "MINOR-OPEN",
    severity: "MINOR",
    description:
      "C_T proven O(1) via Ingham 1940 + Guth-Maynard 2024 exponents (imp-2625), " +
      "but not yet a certified small explicit value. At N* = 1e4 this term contributes " +
      "~0.24% of E(N), so even a generous C_T cannot move the verdict. " +
      "Not the binding blocker.",
    dischargeRequirements: [
      "Explicit certified upper bound on C_T from Polymath15 Lemma 3.3 constants",
    ],
    sourceTickets: ["imp-2625", "imp-2643", "imp-2698"],
  },
  {
    id: "GAP-E-FLOW-C-G",
    term: "E_flow",
    constant: "C_G",
    status: "DISCHARGED",
    severity: "DISCHARGED",
    description:
      "Gronwall amplification constant C_G = 1.0 placeholder in E_flow is rigorously " +
      "non-binding. E_flow <= 1.3e-3 for every C_G <= 203 via the A1 Theta-trap " +
      "unconditional bound |t_c| <= 2.37e-4 (imp-2644). The physically derived Gronwall " +
      "constant C_G = 2 / y_star^2 <= 2 (Lemma B, backward-flow-stability-gronwall.js) " +
      "is well inside the 203-wide safety band.",
    dischargeRequirements: [],
    sourceTickets: ["imp-2644", "imp-2633"],
  },
];

const BINDING_BLOCKERS = EN_GAP_REGISTRY.filter((g) => g.severity === "BINDING-BLOCKER");
const DISCHARGED_GAPS  = EN_GAP_REGISTRY.filter((g) => g.severity === "DISCHARGED");

export const EN_GAP_REGISTRY_ASSERTIONS = [
  {
    id: "imp2713-registry-has-four-entries",
    description: "E(N) named-gap registry enumerates exactly 4 entries (C_H, C_Selberg-ET, C_T, C_G)",
    holds: () => EN_GAP_REGISTRY.length === 4,
  },
  {
    id: "imp2713-exactly-one-binding-blocker",
    description: "Exactly 1 gap is BINDING-BLOCKER (C_H is the sole blocker for E_coll and the whole budget)",
    holds: () => BINDING_BLOCKERS.length === 1,
  },
  {
    id: "imp2713-binding-blocker-is-C-H",
    description: "The sole BINDING-BLOCKER is GAP-E-COLL-C-H (not C_T, C_G, or C_Selberg-ET)",
    holds: () => BINDING_BLOCKERS.length === 1 && BINDING_BLOCKERS[0].id === "GAP-E-COLL-C-H",
  },
  {
    id: "imp2713-exactly-one-discharged",
    description: "Exactly 1 gap is DISCHARGED (C_G via A1 Theta-trap, imp-2644)",
    holds: () => DISCHARGED_GAPS.length === 1,
  },
  {
    id: "imp2713-discharged-gap-is-C-G",
    description: "The discharged gap is GAP-E-FLOW-C-G (C_G non-binding for all C_G <= 203)",
    holds: () => DISCHARGED_GAPS.length === 1 && DISCHARGED_GAPS[0].id === "GAP-E-FLOW-C-G",
  },
  {
    id: "imp2713-live-CH-verdict-matches-registry",
    description: "Live import confirms C_H is NOT a rigorous upper bound (isRigorousUpperBound=false), consistent with GAP-E-COLL-C-H UNDISCHARGEABLE",
    holds: () => C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.isRigorousUpperBound === false,
  },
  {
    id: "imp2713-live-imp2643-no-rigorous-beat",
    description: "Live import: imp-2643 rigorousBeat=false confirms the BINDING-BLOCKER persists and no refereed bound is changed",
    holds: () => IMP2643_HONEST_ASSEMBLED_EN.rigorousBeat === false,
  },
  {
    id: "imp2713-live-CG-discharged-matches-registry",
    description: "Live import: imp-2644 certifies E_flow <= 1.3e-3 unconditionally for C_G <= 203, confirming GAP-E-FLOW-C-G is DISCHARGED",
    holds: () => {
      const cg = IMP2644_EFLOW_GRONWALL_CG_DISCHARGE.cG;
      const ef = IMP2644_EFLOW_GRONWALL_CG_DISCHARGE.eflowCertified;
      return cg.C_G_max_A1 > 200 && ef.bound <= 1.3e-3;
    },
  },
];
