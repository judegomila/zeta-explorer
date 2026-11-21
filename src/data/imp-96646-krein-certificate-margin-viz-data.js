/**
 * @module imp-96646-krein-certificate-margin-viz-data
 *
 * imp-96646 (ux): import-light viz-data leaf for the Route I Krein sigma_2
 * interval-certificate margin (rh-route-i-toeplitz-krein-certificate-payload,
 * 2026-09-24). Three interval-verified sigma_2 certificate rungs (2a = 0.90,
 * 0.94, 0.96) carry an exactly-linear certified margin eps(2a) = 200(1-2a)
 * and a super-exponential tail l1-norm (log10(l1) ~ 73.25*(2a) - 64.24); the
 * eps-fit projects eps -> 0 at 2a = 1.0, coinciding with the observed
 * double-precision LP conditioning wall (a >= 0.50, HiGHS status 4)
 * independently confirmed by the l1-norm blow-up. That finding had two
 * literal tables (epsMarginDecay, normGrowthLaw) but no chart.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every number here is reused verbatim from
 * TOEPLITZ_KREIN_LITERALS (rh-route-i-toeplitz-krein-certificate-2026-09-24.js);
 * only the chart-friendly reshape (paired anchor rows, landmark segments) is
 * new. Changes no bound, establishes no operator positivity, no RH claim;
 * the interval-rigorous reach stays exactly 2a <= 0.96 (past ln 2, short of
 * ln 3); no refereed bound is changed. RH open. NO QED.
 *
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (source literals: epsMarginDecay, normGrowthLaw, priorRange)
 * @see imp-96641-gmin-gue-envelope-viz-data.js (sibling viz-data leaf, same convention)
 *
 * Ticket: imp-96646 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { TOEPLITZ_KREIN_LITERALS } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const EPS = TOEPLITZ_KREIN_LITERALS.epsMarginDecay;
const NORM = TOEPLITZ_KREIN_LITERALS.normGrowthLaw;
const PRIOR = TOEPLITZ_KREIN_LITERALS.priorRange;

// paired anchor rows: twoA, certified eps margin, tail l1-norm (all three baked rungs)
export const IMP96646_ANCHORS = Object.freeze(
  EPS.anchors.map((row, i) =>
    Object.freeze({
      twoA: row.twoA,
      eps: row.eps,
      verified: row.verified,
      l1: NORM.anchors[i].l1,
      log10L1: Math.log10(NORM.anchors[i].l1),
    }),
  ),
);

// linear certified-margin fit: eps(2a) = slope*(2a) + intercept, projected to eps = 0
export const IMP96646_EPS_FIT = Object.freeze({
  slope: EPS.lsFit.slope,
  intercept: EPS.lsFit.intercept,
  r2: EPS.lsFit.r2,
  zeroTwoA: EPS.epsZeroTwoA,
  zeroA: EPS.epsZeroA,
});

// log-linear tail-norm fit: log10(l1)(2a) = slope*(2a) + intercept
export const IMP96646_L1_FIT = Object.freeze({
  slope: NORM.log10Slope,
  intercept: NORM.log10Intercept,
});

// double-precision LP conditioning wall band (from the l1-norm-vs-coefficient-dynamic-range fit)
export const IMP96646_WALL_BAND = Object.freeze({
  loTwoA: NORM.doublePrecWallTwoA.log10L1_9,
  hiTwoA: NORM.doublePrecWallTwoA.log10L1_12,
});

// landmark 2a values for the reach diagram
export const IMP96646_LANDMARKS = Object.freeze({
  ln2: Math.LN2,
  compactCertificate: PRIOR.compactCertificate,
  interceptRigorousReach: PRIOR.thisModule,
  wallLoTwoA: IMP96646_WALL_BAND.loTwoA,
  wallHiTwoA: IMP96646_WALL_BAND.hiTwoA,
  ln3: PRIOR.ln3,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96646_ASSERTIONS = [
  {
    id: 'imp96646-three-anchors-monotone-eps-down-l1-up',
    holds: () =>
      IMP96646_ANCHORS.length === 3 &&
      IMP96646_ANCHORS.every((r) => r.verified === true) &&
      IMP96646_ANCHORS[0].eps > IMP96646_ANCHORS[1].eps &&
      IMP96646_ANCHORS[1].eps > IMP96646_ANCHORS[2].eps &&
      IMP96646_ANCHORS[0].l1 < IMP96646_ANCHORS[1].l1 &&
      IMP96646_ANCHORS[1].l1 < IMP96646_ANCHORS[2].l1,
    why: 'all three baked rungs must be interval-verified, with eps strictly decreasing and l1 strictly increasing as 2a grows.',
  },
  {
    id: 'imp96646-eps-fit-reproduces-anchors-and-zero-crossing',
    holds: () =>
      IMP96646_ANCHORS.every(
        (r) => Math.abs(IMP96646_EPS_FIT.slope * r.twoA + IMP96646_EPS_FIT.intercept - r.eps) < 1e-9,
      ) && Math.abs(IMP96646_EPS_FIT.slope * IMP96646_EPS_FIT.zeroTwoA + IMP96646_EPS_FIT.intercept) < 1e-9,
    why: 'the linear eps fit must reproduce all three baked anchors exactly and cross zero exactly at zeroTwoA.',
  },
  {
    id: 'imp96646-l1-fit-reproduces-anchors-within-013-dex',
    holds: () =>
      IMP96646_ANCHORS.every(
        (r) => Math.abs(IMP96646_L1_FIT.slope * r.twoA + IMP96646_L1_FIT.intercept - r.log10L1) < 0.13,
      ),
    why: 'the log-linear l1-norm fit must reproduce all three baked anchors to within the 0.13 dex the source module records.',
  },
  {
    id: 'imp96646-reach-ordering-ln2-lt-096-lt-wall-lt-ln3',
    holds: () =>
      IMP96646_LANDMARKS.ln2 < IMP96646_LANDMARKS.interceptRigorousReach &&
      IMP96646_LANDMARKS.interceptRigorousReach <= IMP96646_LANDMARKS.wallLoTwoA &&
      IMP96646_LANDMARKS.wallLoTwoA < IMP96646_LANDMARKS.wallHiTwoA &&
      IMP96646_LANDMARKS.wallHiTwoA < IMP96646_LANDMARKS.ln3,
    why: 'the reach diagram must order the landmarks ln2 < 0.96 (rigorous reach) <= wall band < ln3, matching the module verdict.',
  },
];

for (const a of IMP96646_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96646-krein-certificate-margin-viz-data assertion failed: ${a.id}`);
  }
}
