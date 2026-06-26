/**
 * @module imp-2870-en-cert-liveness-tripwire
 *
 * imp-2870 (high, meta): Tripwire asserting every E(N) sub-term interval
 * certificate module remains wired into the executable assertion graph.
 *
 * These seven cert modules self-execute their assertions on import. This
 * module imports all of them so the sweep (which loads THIS file) transitively
 * runs every sub-cert, and then asserts each exported *_ASSERTIONS array is
 * non-empty -- catching any module that silently clears its array.
 *
 * Modules covered:
 *   imp-2641  C_Selberg Trudgian discharge          (C_Selberg pinned to Trudgian 2014)
 *   imp-2644  E_flow Gronwall C_G discharge         (C_G <= 203 non-binding certification)
 *   imp-2700  Erdos-Turan bridge discharge          (E_trunc_pt <= 3.06e-5 bridge)
 *   imp-2704  C_F interval certificate             (E_flow prefactor bracket)
 *   imp-2709  kappa_T interval certificate         (E_trunc kappa_T bracket)
 *   imp-2715  worst-case E(N) headroom audit        (assembled E(N) slack check)
 *   imp-2762  t_c A1-trap interval                 (collision time upper bracket)
 *
 * @see imp-2713-en-named-gap-registry (gap registry; imp-2625/imp-2627 already wired)
 */

import { IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE_ASSERTIONS }
  from './imp-2641-c-selberg-trudgian-discharge.js';
import { IMP2644_EFLOW_GRONWALL_CG_DISCHARGE_ASSERTIONS }
  from './imp-2644-eflow-gronwall-cg-discharge.js';
import { IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE_ASSERTIONS }
  from './imp-2700-erdos-turan-bridge-discharge.js';
import { IMP2704_CF_INTERVAL_CERTIFICATE_ASSERTIONS }
  from './imp-2704-cf-interval-certificate.js';
import { IMP2709_KAPPA_T_INTERVAL_CERTIFICATE_ASSERTIONS }
  from './imp-2709-kappa-t-interval-certificate.js';
import { IMP2715_WORST_CASE_EN_HEADROOM_ASSERTIONS }
  from './imp-2715-worst-case-EN-headroom-audit.js';
import { IMP2762_TC_A1_TRAP_INTERVAL_ASSERTIONS }
  from './imp-2762-tc-a1-trap-interval.js';

export const IMP2870_EN_CERT_LIVENESS_ASSERTIONS = [
  {
    id: 'imp2870-liveness-imp2641-c-selberg',
    description: 'imp-2641 C_Selberg Trudgian discharge assertions array is non-empty (liveness guard).',
    holds: () => IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE_ASSERTIONS.length > 0,
  },
  {
    id: 'imp2870-liveness-imp2644-eflow-gronwall',
    description: 'imp-2644 E_flow Gronwall C_G discharge assertions array is non-empty (liveness guard).',
    holds: () => IMP2644_EFLOW_GRONWALL_CG_DISCHARGE_ASSERTIONS.length > 0,
  },
  {
    id: 'imp2870-liveness-imp2700-erdos-turan',
    description: 'imp-2700 Erdos-Turan bridge discharge assertions array is non-empty (liveness guard).',
    holds: () => IMP2700_ERDOS_TURAN_BRIDGE_DISCHARGE_ASSERTIONS.length > 0,
  },
  {
    id: 'imp2870-liveness-imp2704-cf-interval',
    description: 'imp-2704 C_F interval certificate assertions array is non-empty (liveness guard).',
    holds: () => IMP2704_CF_INTERVAL_CERTIFICATE_ASSERTIONS.length > 0,
  },
  {
    id: 'imp2870-liveness-imp2709-kappa-t-interval',
    description: 'imp-2709 kappa_T interval certificate assertions array is non-empty (liveness guard).',
    holds: () => IMP2709_KAPPA_T_INTERVAL_CERTIFICATE_ASSERTIONS.length > 0,
  },
  {
    id: 'imp2870-liveness-imp2715-worst-case-headroom',
    description: 'imp-2715 worst-case E(N) headroom audit assertions array is non-empty (liveness guard).',
    holds: () => IMP2715_WORST_CASE_EN_HEADROOM_ASSERTIONS.length > 0,
  },
  {
    id: 'imp2870-liveness-imp2762-tc-a1-trap',
    description: 'imp-2762 t_c A1-trap interval assertions array is non-empty (liveness guard).',
    holds: () => IMP2762_TC_A1_TRAP_INTERVAL_ASSERTIONS.length > 0,
  },
];

for (const a of IMP2870_EN_CERT_LIVENESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2870-en-cert-liveness-tripwire assertion failed: ${a.id}`);
  }
}
