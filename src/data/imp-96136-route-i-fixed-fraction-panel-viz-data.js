/**
 * imp-96136 -- viz panel for the imp-96110 Route I {oo,2,3} fixed-fraction cusp-allocation law.
 *
 * imp-96110 measured, at every {oo,2,3} S-unit cusp rho = 2^a 3^b, the fraction of the (now
 * log^2) cusp of delta_S23 that lands in the Sonine excess: f_out(rho) -> 1 - 1/rho, generalizing
 * the isolated p = 2 half-cusp law of Theorem 4 (rh-route-i-sonine-excess-semilocal-port). That
 * ten-point measured-vs-target table was never rendered visually. This module reshapes the frozen
 * imp-96110 baked literals into chart-ready rows sorted by rho -- no re-derivation, no fresh
 * numerics.
 *
 * Import-light: only imports the imp-96110 module's baked literals (no zeros bundle, no si
 * double-sum recomputation).
 *
 * @see imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment (the measured f_out /
 *      target 1-1/rho rows this renders)
 */

import { IMP_96110_CUSP_ALLOCATION_LITERALS, IMP_96110_P3_CUSP_ALLOCATION } from './imp-96110-route-i-p3-cusp-allocation-fixed-fraction-assessment.js';

const SRC = IMP_96110_CUSP_ALLOCATION_LITERALS;

export const IMP96136_ROWS = Object.freeze(
  [...SRC.s23Fractions]
    .sort((a, b) => a[1] - b[1])
    .map(([label, rho, fOut, target]) =>
      Object.freeze({ label, rho, fOut, target, deficit: target - fOut }),
    ),
);

// pure-p=2 control set (rho = 2, 4, 8): confirms the same 1 - 1/rho law holds outside the
// mixed {oo,2,3} S-unit family this panel otherwise renders, completing the imp-96222
// 11-point measured-vs-law picture (10 mixed S-units + this 3-point control, minus the
// rho = 2, 4 overlap already covered above).
export const IMP96136_CONTROL_ROWS = Object.freeze(
  [...SRC.p2Control]
    .sort((a, b) => a[1] - b[1])
    .map(([rho, fOut, target]) =>
      Object.freeze({ label: `${rho} (2^${Math.log2(rho)}, p=2 control)`, rho, fOut, target, deficit: target - fOut }),
    ),
);

export const IMP96136_LAW = SRC.law;

export const IMP96136_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen imp-96110 ten-point {oo,2,3} S-unit table verbatim ' +
  '(measured f_out vs target 1 - 1/rho; no re-derivation of the br23 double sum, no fresh ' +
  'numerics). The law survives and generalizes the p = 2 half-cusp allocation, but that fraction ' +
  'is inherited across a DENSE family of log^2 cusps -- an obstruction, not a rescue (the ' +
  'compact-Toeplitz foothold is lost through cusp density and order). corr23 continuity through ' +
  'the cusp is ASSUMED by analogy with p = 2, not proved. Changes no bound, establishes no ' +
  'operator positivity, no RH claim; no refereed bound is changed; NO QED.';

export const IMP96136_ASSERTIONS = [
  {
    id: 'imp96136-ten-rows-sorted-by-rho',
    description: 'exactly ten S-unit rows exist, strictly increasing in rho, matching the imp-96110 source count',
    holds: () =>
      IMP96136_ROWS.length === SRC.s23Fractions.length &&
      IMP96136_ROWS.every((row, i) => i === 0 || row.rho > IMP96136_ROWS[i - 1].rho),
  },
  {
    id: 'imp96136-rows-match-source-values-exactly',
    description: 'every rendered (rho, fOut, target) triple equals the imp-96110 baked literal exactly',
    holds: () =>
      IMP96136_ROWS.every((row) =>
        SRC.s23Fractions.some(
          ([, rho, fOut, target]) => rho === row.rho && fOut === row.fOut && target === row.target,
        ),
      ),
  },
  {
    id: 'imp96136-fout-tracks-target-within-obstruction-tolerance',
    description: 'every row tracks 1 - 1/rho within the imp-96110-documented 0.033 finite-window tolerance, approaching from below (deficit > -0.01)',
    holds: () =>
      IMP96136_ROWS.every((row) => Math.abs(row.deficit) < 0.033 && row.deficit > -0.01),
  },
  {
    id: 'imp96136-control-rows-match-p2-source-and-law',
    description: 'the three pure-p=2 control rows (rho = 2, 4, 8) match the imp-96110 p2Control literals exactly and track 1 - 1/rho within 2e-4',
    holds: () =>
      IMP96136_CONTROL_ROWS.length === SRC.p2Control.length &&
      IMP96136_CONTROL_ROWS.every((row) =>
        SRC.p2Control.some(
          ([rho, fOut, target]) => rho === row.rho && fOut === row.fOut && target === row.target,
        ) && Math.abs(row.deficit) < 2e-4,
      ),
  },
  {
    id: 'imp96136-caveat-carries-honesty-markers',
    description: 'the caveat banner names the obstruction verdict, the assumed corr23 continuity, and keeps the NO QED / SOTA guardrail',
    holds: () =>
      /obstruction, not a rescue/.test(IMP96136_CAVEAT_BANNER) &&
      /ASSUMED by analogy/.test(IMP96136_CAVEAT_BANNER) &&
      /NO QED/.test(IMP96136_CAVEAT_BANNER) &&
      /refereed bound is changed/i.test(IMP96136_CAVEAT_BANNER) &&
      /OBSTRUCTION not a rescue/.test(IMP_96110_P3_CUSP_ALLOCATION.status),
  },
];

for (const a of IMP96136_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96136-route-i-fixed-fraction-panel-viz-data assertion failed: ${a.id}`);
  }
}
