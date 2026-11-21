/**
 * imp-95770: import-light viz-data for the barrier-mollifier-length-ceiling-2026-09
 * fixed-height ceiling Lambda_ceil(X) = min(1, gamma||A/B||_{Aa_sigma}), read off as a
 * function of the verified zero-checking height X = 4*pi*N^2 (N0 = sqrt(X/4pi)).
 *
 * Reuses the baked CEILING_HEIGHT_Y0 literals from that module (no new computation, no
 * re-derivation): at each height N the table brackets the truncated-mollifier crossing
 * gamma*S_A(1e8) = 1 between an obstructed row (>= 1) and an open row (< 1); linear
 * interpolation in Lambda between that bracket (same method as the module's own
 * lambdaCeilCrossing helper) gives Lambda_ceil(N). This module just re-runs that
 * interpolation across all four height rungs in CEILING_HEIGHT_Y0 (N0, 1.5e6, 2e6, 6e6)
 * to produce a plottable Lambda_ceil(X) curve, plus the X where the curve crosses the
 * 0.145 and 0.14 targets.
 *
 * MEASUREMENT ONLY. Changes no bound; NO QED; no refereed bound is changed;
 * the 0.1758354 candidate remains unrefereed.
 *
 * @see barrier-mollifier-length-ceiling-2026-09 (source CEILING_HEIGHT_Y0 / CROSSING_PIN_Y0 literals this cross-checks)
 */

import {
  N0,
  Y0,
  T_CANDIDATE,
  CEILING_HEIGHT_Y0,
  CROSSING_PIN_Y0,
} from './barrier-mollifier-length-ceiling-2026-09.js';

// Verified-zero-checking height X = 4*pi*N^2 (inverse of N0 = sqrt(X/4pi)).
const Xof = (N) => 4 * Math.PI * N * N;

// Linear-in-Lambda crossing of gSA1e8 = 1 between the first (obstructed, open) bracket
// in a height rung's rows -- identical interpolation to the source module's cross().
function bracketCross(rows) {
  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i];
    const b = rows[i + 1];
    if (a.gSA1e8 >= 1 && b.gSA1e8 < 1) {
      return a.Lambda + ((a.gSA1e8 - 1) / (a.gSA1e8 - b.gSA1e8)) * (b.Lambda - a.Lambda);
    }
  }
  return null;
}

const N_RUNGS = [N0, 1500000, 2000000, 6000000];

export const LAMBDA_CEIL_CURVE = N_RUNGS.map((N) => {
  const rows = CEILING_HEIGHT_Y0.filter((r) => r.N === N);
  return { N, X: Xof(N), lambdaCeil: bracketCross(rows) };
});

// X where the (piecewise-linear-in-N) Lambda_ceil(X) curve crosses a target value,
// found on the first adjacent pair of curve points that brackets it.
function thresholdCrossing(target) {
  for (let i = 0; i < LAMBDA_CEIL_CURVE.length - 1; i++) {
    const a = LAMBDA_CEIL_CURVE[i];
    const b = LAMBDA_CEIL_CURVE[i + 1];
    if (a.lambdaCeil >= target && b.lambdaCeil < target) {
      const frac = (a.lambdaCeil - target) / (a.lambdaCeil - b.lambdaCeil);
      const N = a.N + frac * (b.N - a.N);
      return { targetLambda: target, N, X: Xof(N) };
    }
  }
  return null;
}

export const THRESHOLD_0145 = thresholdCrossing(0.145);
export const THRESHOLD_014 = thresholdCrossing(0.14);

export const CURRENT_HEIGHT_POINT = Object.freeze({
  N: N0,
  X: Xof(N0),
  lambdaCeil: LAMBDA_CEIL_CURVE[0].lambdaCeil,
  candidateLambda: T_CANDIDATE + (Y0 * Y0) / 2,
});

export const IMP95770_SUMMARY = Object.freeze({
  law: 'Lambda_ceil(X) = min(1, gamma*||A/B||_{Aa_sigma}) at the fixed height X = 4*pi*N^2; a mollifier-independent Wiener-algebra ceiling on the fixed-height barrier/y-transfer certificate.',
  reading: `At the current verified height X = ${CURRENT_HEIGHT_POINT.X.toExponential(1)} the ceiling sits at Lambda_ceil ~ ${CURRENT_HEIGHT_POINT.lambdaCeil.toFixed(3)}, well below the unrefereed 0.1758354 candidate evaluated at the same height -- headroom that is entirely mollifier LENGTH, not a lower barrier Lambda. Reaching Lambda_ceil = 0.145 needs X >~ ${THRESHOLD_0145.X.toExponential(2)}; reaching 0.14 needs X >~ ${THRESHOLD_014.X.toExponential(2)}.`,
  verdict: 'PRECISE OBSTRUCTION, no new candidate; presentation only. Changes no bound; NO QED; RH open; no refereed bound is changed; 0.1758354 remains an unrefereed candidate.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const near = (u, v, tol) => Math.abs(u - v) <= tol;

const IMP95770_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95770-curve-reproduces-source-crossings',
    description: 'the four bracket-crossing Lambda_ceil(N) values reproduce CROSSING_PIN_Y0 lambdaCeil literals at N0/1.5e6/2.0e6',
    holds: () => near(LAMBDA_CEIL_CURVE[0].lambdaCeil, CROSSING_PIN_Y0.lambdaCeil.N690988, 1e-5)
      && near(LAMBDA_CEIL_CURVE[1].lambdaCeil, CROSSING_PIN_Y0.lambdaCeil.N1500000, 1e-5)
      && near(LAMBDA_CEIL_CURVE[2].lambdaCeil, CROSSING_PIN_Y0.lambdaCeil.N2000000, 1e-5),
  },
  {
    id: 'imp95770-current-height-matches-6e12',
    description: 'X(N0) reproduces the stated verified height 6.0e12 to 3 significant figures',
    holds: () => near(CURRENT_HEIGHT_POINT.X, 6.0e12, 1e10),
  },
  {
    id: 'imp95770-curve-monotone-decreasing',
    description: 'Lambda_ceil(X) is strictly decreasing across the four height rungs (taller verified height, lower ceiling)',
    holds: () => LAMBDA_CEIL_CURVE.every((p, i) => i === 0 || p.lambdaCeil < LAMBDA_CEIL_CURVE[i - 1].lambdaCeil)
      && LAMBDA_CEIL_CURVE.every((p, i) => i === 0 || p.X > LAMBDA_CEIL_CURVE[i - 1].X),
  },
  {
    id: 'imp95770-0145-threshold-matches-source-pin',
    description: '0.145 threshold height reproduces the source module Ncross/Tcross (X = 2*Tcross since X = 4*pi*N^2 vs the source T = 2*pi*N^2)',
    holds: () => near(THRESHOLD_0145.N, CROSSING_PIN_Y0.Ncross, 2000)
      && near(THRESHOLD_0145.X, 2 * CROSSING_PIN_Y0.Tcross, 2e11),
  },
  {
    id: 'imp95770-014-threshold-beyond-0145-and-within-6e6-rung',
    description: '0.14 threshold height is further out than the 0.145 threshold and falls between the N=2e6 and N=6e6 rungs',
    holds: () => THRESHOLD_014.X > THRESHOLD_0145.X && THRESHOLD_014.N > 2000000 && THRESHOLD_014.N < 6000000,
  },
  {
    id: 'imp95770-current-below-candidate',
    description: 'the ceiling at the current height sits strictly below the unrefereed 0.1758354 candidate evaluated at the same height',
    holds: () => CURRENT_HEIGHT_POINT.lambdaCeil < CURRENT_HEIGHT_POINT.candidateLambda
      && near(CURRENT_HEIGHT_POINT.candidateLambda, 0.1758354, 1e-6),
  },
  {
    id: 'imp95770-honesty-gate-no-qed',
    description: 'summary carries NO QED / RH open / SOTA-denial / unrefereed markers',
    holds: () => /NO QED/.test(IMP95770_SUMMARY.verdict) && /RH open/.test(IMP95770_SUMMARY.verdict)
      && /refereed bound is changed/i.test(IMP95770_SUMMARY.verdict) && /unrefereed/.test(IMP95770_SUMMARY.verdict),
  },
];

for (const a of IMP95770_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95770-barrier-mollifier-length-ceiling-viz-data assertion failed: ${a.id}`);
  }
}
