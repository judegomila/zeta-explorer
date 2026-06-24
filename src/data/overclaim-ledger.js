/**
 * @module overclaim-ledger
 *
 * Canonical shared ledger of the 6 overclaims caught and corrected during the
 * 2026 max-fanout verification sessions. Import CAUGHT_OVERCLAIMS from here
 * rather than duplicating the list across dashboard pages.
 *
 * Each entry records the original false claim, how it was caught, the
 * correction, and the current status so any consumer renders a consistent
 * transparency ledger.
 *
 * @see maxfanout-honest-status-2026-06-17 (overclaims 1-5 context)
 * @see section27-identity-refutation-2026-06-17 (overclaim 6 — LINK B refutation)
 */

import { MAXFANOUT_STATUS } from './maxfanout-honest-status-2026-06-17.js';
import { SECTION27_REFUTATION } from './section27-identity-refutation-2026-06-17.js';

export const CAUGHT_OVERCLAIMS = [
  {
    n: 1,
    id: 'imp-2630',
    claim: 'Lambda in [0.099, 0.137] < 0.2 at height gamma = 1e13 (imp-2622 headline)',
    caughtBy: '4-route adversarial fanout (etrunc-kappa-pinning workflow), 2026-06-14, unanimous',
    correction: 'kappa_T frozen at T0=3000 (0.182) but multiplied against T0=1e13; height-consistent kappa_T=0.046 gives E_trunc=7.65 >> 0.2; thin-strip route grows with height, never drops below 0.2 at scale',
    status: 'WITHDRAWN',
  },
  {
    n: 2,
    id: 'imp-2625',
    claim: 'kappa_T rigorously pinned as height-uniform (0.182 valid at all instantiation heights)',
    caughtBy: 'Height-mismatch audit (imp-2622-height-mismatch-refutation.js)',
    correction: 'kappa_T = 4delta/(3-2delta) degrades with height; not a uniform constant across the full height range',
    status: 'CORRECTED',
  },
  {
    n: 3,
    id: 'imp-2621',
    claim: 'sup Im m_inf(x+iy) >= pi * rho_inf / y_N_sharp ~ sqrt(N) * log gamma_N (1/y continuum amplification)',
    caughtBy: 'E_pp fanout referee T1, 2026-06-12',
    correction: 'For bounded density, Im m_inf <= pi * sup rho uniformly in y; no 1/y blow-up for the continuum transform; true divergence is the atomic self-term sqrt(N/2pi) with no 1/log gain',
    status: 'REGRADED',
  },
  {
    n: 4,
    id: 'imp-2660',
    claim: '||K_a|| <= 1/a (Wiener-Hopf bound) closes Conj 27.2 for every a >= 0.1996 (imp-1287)',
    caughtBy: 'Adversarial Volterra workflow, 2026-06-17; measured ||K_{0.5}|| = 3.0 / 9.5 / 27 / 74 at T=4/6/8/10',
    correction: 'Causal sinh-convolution is non-Toeplitz; Laplace symbol a/(z^2-a^2) has a pole at z=a in Re(z)>0; ||K_a|| ~ e^{aT} (unbounded); claimed 1/a bound is 37x wrong at T=10',
    status: 'RETRACTED',
  },
  {
    n: 5,
    id: 'imp-2661',
    claim: 'imp-2633: E_coll RIGOROUSLY-PINNED (no placeholder constants)',
    caughtBy: 'imp-2661 CORRECTED; imp-2640 NEGATIVE verdict on C_H',
    correction: MAXFANOUT_STATUS.imp2633Contradiction,
    status: 'CORRECTED',
  },
  {
    n: 6,
    id: 'imp-2666',
    claim: 'Section-27 LINK B: ||V||<=1 <=> K_a>=0 (Phi-uniform two-way collapse)',
    caughtBy: 'imp-2666 DOWNGRADED; 4-route adversarial workflow, 2026-06-17',
    correction: SECTION27_REFUTATION.scaleObstruction + '. ' + SECTION27_REFUTATION.collapseConsequence,
    status: 'DOWNGRADED',
  },
];

export const OVERCLAIM_COUNT = CAUGHT_OVERCLAIMS.length;
