/**
 * imp-95868: import-light viz-data reshaping the imp-95845 biasPct*N^2 fit
 * (which fit the imp-95803 deep-corner drift 330414 -> 162500 over N=80..500
 * to P0 + P1/N (+P2/N^2)) into chart-ready rows for a viz page plotting
 * biasPct*N^2 vs N against the extrapolated P0 = C_Widom asymptote line and
 * the well-conditioned fit-family band [145019, 147643].
 *
 * Reuses the baked imp-95845 ladder and fit constants verbatim -- no
 * re-derivation, no new computation. Presentation only; changes no bound;
 * NO QED; no refereed bound is changed.
 *
 * @see imp-95845-deep-corner-biasN2-widom-fit.js (the fit this reshapes)
 */

import { IMP95845_DEEP_CORNER_BIASN2_WIDOM_FIT } from './imp-95845-deep-corner-biasN2-widom-fit.js';

const REF = IMP95845_DEEP_CORNER_BIASN2_WIDOM_FIT;

// The measured ladder as biasPct*N^2 points (chart-ready).
export const BIASN2_ROWS = Object.freeze(
  REF.ladder.map((r) => Object.freeze({ N: r.N, biasN2: r.biasPct * r.N * r.N })),
);

export const CWIDOM_ASYMPTOTE = REF.cWidom; // 146518.8340711524, horizontal line
export const WELL_CONDITIONED_BAND = Object.freeze([...REF.wellConditionedP0Range]); // [145019.0, 147643.1]
export const BEST_FIT_P0 = REF.bestFitP0; // 147164.3

export const IMP95868_VIZ_SUMMARY = Object.freeze({
  title:
    'biasPct*N^2 drift ladder (delta=ln1.2, rho=1) vs the extrapolated P0=C_Widom asymptote',
  reading:
    `The measured ladder drifts from ${BIASN2_ROWS[0].biasN2.toFixed(0)} at N=${BIASN2_ROWS[0].N} `
    + `down to ${BIASN2_ROWS[BIASN2_ROWS.length - 1].biasN2.toFixed(0)} at N=${BIASN2_ROWS[BIASN2_ROWS.length - 1].N}, `
    + `converging toward the closed-form Widom prefactor C_Widom = ${CWIDOM_ASYMPTOTE.toFixed(2)} `
    + `(the well-conditioned fit family brackets it: [${WELL_CONDITIONED_BAND[0].toFixed(0)}, ${WELL_CONDITIONED_BAND[1].toFixed(0)}]).`,
  verdict:
    'PRESENTATION ONLY, no new computation; reshapes the imp-95845 fit literals into chart rows. '
    + 'Model seam family only; changes no bound of the Lambda program; NO QED; '
    + 'no refereed bound is changed.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: one import, no re-derivation)
// ---------------------------------------------------------------------------

const near = (u, v, tol) => Math.abs(u - v) <= tol;

const IMP95868_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95868-rows-match-ladder-length',
    description: 'BIASN2_ROWS has one row per imp-95845 ladder rung',
    holds: () => BIASN2_ROWS.length === REF.ladder.length,
  },
  {
    id: 'imp95868-endpoints-match-imp95845',
    description: 'the first/last biasN2 rows reproduce the imp-95845 headline endpoints',
    holds: () =>
      near(BIASN2_ROWS[0].biasN2, REF.biasN2_N80, 1)
      && near(BIASN2_ROWS[BIASN2_ROWS.length - 1].biasN2, REF.biasN2_N500, 1),
  },
  {
    id: 'imp95868-asymptote-is-cwidom',
    description: 'the plotted asymptote equals the imp-95845 baked C_Widom verbatim',
    holds: () => CWIDOM_ASYMPTOTE === REF.cWidom,
  },
  {
    id: 'imp95868-band-brackets-widom',
    description: 'the well-conditioned band brackets C_Widom from both sides',
    holds: () =>
      WELL_CONDITIONED_BAND[0] < CWIDOM_ASYMPTOTE
      && WELL_CONDITIONED_BAND[1] > CWIDOM_ASYMPTOTE,
  },
  {
    id: 'imp95868-ladder-is-monotone-decreasing',
    description: 'biasN2 decreases monotonically as N increases (the imp-95803 drift direction)',
    holds: () => BIASN2_ROWS.every((r, i) => i === 0 || r.biasN2 < BIASN2_ROWS[i - 1].biasN2),
  },
  {
    id: 'imp95868-honest-status-carried',
    description: 'summary verdict restates NO QED / no-refereed-bound-change honesty markers',
    holds: () => /NO QED/.test(IMP95868_VIZ_SUMMARY.verdict) && /refereed bound is changed/i.test(IMP95868_VIZ_SUMMARY.verdict),
  },
];

for (const assertion of IMP95868_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95868 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP95868_VIZ_SUMMARY;
