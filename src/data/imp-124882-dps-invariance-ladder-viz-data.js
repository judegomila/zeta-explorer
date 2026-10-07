/**
 * @module imp-124882-dps-invariance-ladder-viz-data
 *
 * imp-124882: import-light viz-data leaf charting the imp-124849 dps-invariance ladder -- the DIAG3 E_CF
 * round-off floor R and the induced eps-ladder crossover sigma_crit as the mpmath working precision dps is
 * swept 15..140 at the shared headline step eps=1e-3. Reuses the imp-124849 DPS_LADDER verbatim -- no new
 * computation.
 *
 * PRESENTATION ONLY. Conditional-share diagnostic, NOT an RH bound; no bound moves; NO QED.
 *
 * @see imp-124849-extprec-ecf-floor-sigmacrit.js (IMP124849_EXTPREC_ECF_FLOOR_SIGMACRIT, source dps ladder)
 */

import { IMP124849_EXTPREC_ECF_FLOOR_SIGMACRIT } from './imp-124849-extprec-ecf-floor-sigmacrit.js';

const SRC = IMP124849_EXTPREC_ECF_FLOOR_SIGMACRIT;

export const IMP124882_DPS_ROWS = Object.freeze(
  SRC.dpsLadder.map((r) =>
    Object.freeze({
      dps: r.dps,
      R: r.R,
      sigma_crit: r.sigma_crit,
    })
  )
);

export const IMP124882_SUMMARY = Object.freeze({
  dp_baseline: SRC.dp_baseline,
  extprec_floor: SRC.extprec_floor,
  L5_sigma: SRC.L5_sigma,
  L6_sigma: SRC.L6_sigma,
  law:
    `At dps=15 (~double precision) R=${IMP124882_DPS_ROWS[0].R.toExponential(3)} and sigma_crit=` +
    `${IMP124882_DPS_ROWS[0].sigma_crit.toFixed(6)}, reproducing the imp-124810 pin. For every dps>=30 the ` +
    `floor jumps to a dps-INVARIANT R=${SRC.extprec_floor.R.toExponential(4)} and sigma_crit stabilizes at ` +
    `${SRC.extprec_floor.sigma_crit} -- at L5 (${SRC.L5_sigma}), never reaching L6 (${SRC.L6_sigma}). Raising ` +
    'the working precision beyond dps=30 buys nothing.',
  verdict:
    'Presentation only: every dps / R / sigma_crit value plotted here is reused verbatim from imp-124849 ' +
    '(a measurement/sensitivity port, not a rigorous asymptotic). Conditional-share diagnostic on the inherited ' +
    'imp-3220/imp-3406 extrapolation; changes no bound; imp-3066 K_a >= 0 untouched; Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA; RH open; NO QED.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP124882_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp124882-seven-rows',
    description: 'exactly seven dps rungs (15,30,45,60,80,100,140)',
    holds: () => IMP124882_DPS_ROWS.length === 7,
  },
  {
    id: 'imp124882-dps15-matches-dp-baseline',
    description: 'the dps=15 rung matches the imp-124810 double-precision pin',
    holds: () =>
      IMP124882_DPS_ROWS[0].dps === 15 && Math.abs(IMP124882_DPS_ROWS[0].R - SRC.dp_baseline.R_inf) < 5e-14,
  },
  {
    id: 'imp124882-dps-invariant-above-30',
    description: 'R and sigma_crit are identical across every dps>=30 rung',
    holds: () =>
      IMP124882_DPS_ROWS.filter((r) => r.dps >= 30).every(
        (r) => r.R === SRC.extprec_floor.R && r.sigma_crit === SRC.extprec_floor.sigma_crit
      ),
  },
  {
    id: 'imp124882-sigma-crit-never-below-L6',
    description: 'sigma_crit stays strictly above L6 at every dps rung',
    holds: () => IMP124882_DPS_ROWS.every((r) => r.sigma_crit > SRC.L6_sigma),
  },
  {
    id: 'imp124882-honesty-gate-no-qed',
    description: 'the verdict restates no-bound-moved / NO-QED honesty markers',
    holds: () => /changes no bound/.test(IMP124882_SUMMARY.verdict) && /NO QED/.test(IMP124882_SUMMARY.verdict),
  },
];

for (const assertion of IMP124882_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-124882 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP124882_SUMMARY;
