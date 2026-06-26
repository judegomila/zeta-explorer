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
    tag: '1e13 height-mismatch',
    id: 'imp-2630',
    badge: 'imp-2630 WITHDRAWN',
    claim: 'Lambda in [0.099, 0.137] < 0.2 at height gamma = 1e13 (imp-2622 headline)',
    caughtBy: '4-route adversarial fanout (etrunc-kappa-pinning workflow), 2026-06-14, unanimous',
    correction: 'kappa_T frozen at T0=3000 (0.182) but multiplied against T0=1e13; height-consistent kappa_T=0.046 gives E_trunc=7.65 >> 0.2; thin-strip route grows with height, never drops below 0.2 at scale',
    status: 'WITHDRAWN',
    date: '2026-06-14',
  },
  {
    n: 2,
    tag: 'kappa_T constant',
    id: 'imp-2625',
    badge: 'imp-2625 CORRECTED',
    claim: 'kappa_T rigorously pinned as height-uniform (0.182 valid at all instantiation heights)',
    caughtBy: 'Height-mismatch audit (imp-2622-height-mismatch-refutation.js)',
    correction: 'kappa_T = 4delta/(3-2delta) degrades with height; not a uniform constant across the full height range',
    status: 'CORRECTED',
    date: '2026-06-14',
  },
  {
    n: 3,
    tag: 'sup |Im m| bound',
    id: 'imp-2621',
    badge: 'imp-2621 REGRADED',
    claim: 'sup Im m_inf(x+iy) >= pi * rho_inf / y_N_sharp ~ sqrt(N) * log gamma_N (1/y continuum amplification)',
    caughtBy: 'E_pp fanout referee T1, 2026-06-12',
    correction: 'For bounded density, Im m_inf <= pi * sup rho uniformly in y; no 1/y blow-up for the continuum transform; true divergence is the atomic self-term sqrt(N/2pi) with no 1/log gain',
    status: 'REGRADED',
    date: '2026-06-12',
  },
  {
    n: 4,
    tag: 'imp-1287 Wiener-Hopf',
    id: 'imp-2660',
    badge: 'imp-2660 RETRACTED',
    claim: '||K_a|| <= 1/a (Wiener-Hopf bound) closes Conj 27.2 for every a >= 0.1996 (imp-1287)',
    caughtBy: 'Adversarial Volterra workflow, 2026-06-17; measured ||K_{0.5}|| = 3.0 / 9.5 / 27 / 74 at T=4/6/8/10',
    correction: 'Causal sinh-convolution is non-Toeplitz; Laplace symbol a/(z^2-a^2) has a pole at z=a in Re(z)>0; ||K_a|| ~ e^{aT} (unbounded); claimed 1/a bound is 37x wrong at T=10',
    status: 'RETRACTED',
    date: '2026-06-17',
  },
  {
    n: 5,
    tag: 'imp-2633 E_coll rigorously pinned',
    id: 'imp-2661',
    badge: 'imp-2661 CORRECTED',
    claim: 'imp-2633: E_coll RIGOROUSLY-PINNED (no placeholder constants)',
    caughtBy: 'imp-2661 CORRECTED; imp-2640 NEGATIVE verdict on C_H',
    correction: MAXFANOUT_STATUS.imp2633Contradiction,
    status: 'CORRECTED',
    date: '2026-06-17',
  },
  {
    n: 6,
    tag: '§27 LINK B collapse',
    id: 'imp-2666',
    badge: 'imp-2666 DOWNGRADED',
    claim: 'Section-27 LINK B: ||V||<=1 <=> K_a>=0 (Phi-uniform two-way collapse)',
    caughtBy: 'imp-2666 DOWNGRADED; 4-route adversarial workflow, 2026-06-17',
    correction: SECTION27_REFUTATION.scaleObstruction + '. ' + SECTION27_REFUTATION.collapseConsequence,
    status: 'DOWNGRADED',
    date: '2026-06-17',
  },
];

export const OVERCLAIM_COUNT = CAUGHT_OVERCLAIMS.length;

if (CAUGHT_OVERCLAIMS.length !== 6) {
  throw new Error('overclaim-ledger: expected exactly 6 entries, got ' + CAUGHT_OVERCLAIMS.length);
}
