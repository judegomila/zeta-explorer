/**
 * imp-96038 -- viz panel for the Route A finite-N reflection-Gram lambda_min(N)
 * descent (rh-route-a-reflection-positivity-primon-gas-2026-09-23.js).
 *
 * That module measures the Pick reflection Gram of the completed N-prime primon
 * gas F_N = A - sum_{p<=p_N} log p/(p^s-1) on the fixed node set nu in
 * {0.05,...,1.5}: lambda_min runs -142.669 (N=0, no primes) down to -4213.156
 * (N=1229, p_N=9973), strictly monotone, never PSD at any finite N. Its
 * ROUTE_A_LAMMIN_SCALING record separately cross-validates that -lambda_min
 * scales like p_N^{1/2-nu_min} (R^2 >= 0.996), with the fitted exponent
 * approaching the predicted 0.45 (nu_min=0.05) FROM BELOW as p_N grows. Neither
 * the ladder nor that scaling law was ever plotted. This module bakes the
 * ladder (N, p_N, lambda_min) as literals copied verbatim from the source
 * record, plus a p_N^{0.45} reference curve anchored through the final rung
 * (N=1229) so the two can be compared on one log-x chart.
 *
 * Import-light: imports only the frozen ROUTE_A_N_LADDER / ROUTE_A_LITERALS /
 * ROUTE_A_LAMMIN_SCALING records from the source module (no zeros bundle; that
 * module itself has zero imports and does no self-executing work at import
 * time).
 *
 * @see rh-route-a-reflection-positivity-primon-gas-2026-09-23 (A3 test, source of record)
 */

import {
  ROUTE_A_N_LADDER,
  ROUTE_A_LITERALS,
  ROUTE_A_LAMMIN_SCALING,
} from './rh-route-a-reflection-positivity-primon-gas-2026-09-23.js';

// p_N (the N-th prime) for each rung of ROUTE_A_N_LADDER; N=0 has no primes
// (pure archimedean factor only), recorded as null and displayed at p_N=1 in
// the chart (log(1)=0, a harmless left-edge placement, not a claim of a prime).
export const ROUTE_A_PRIME_AT_N = Object.freeze([null, 2, 3, 5, 11, 29, 97, 229, 541, 1223, 2741, 6133, 9973]);

export const ROUTE_A_LAMMIN_DESCENT = Object.freeze(
  ROUTE_A_N_LADDER.map((N, i) =>
    Object.freeze({
      N,
      pN: ROUTE_A_PRIME_AT_N[i],
      pNDisplay: ROUTE_A_PRIME_AT_N[i] ?? 1,
      lamMin: ROUTE_A_LITERALS.finiteGasLamMin[i],
    })
  )
);

// Reference curve: -lamMin ~ C * p_N^{exponent}, exponent = the PREDICTED
// 1/2 - nu_min (nu_min=0.05) from ROUTE_A_LAMMIN_SCALING.globalFit, anchored
// (C fixed) so the curve passes exactly through the final measured rung
// (p_N=9973). Not a re-fit: a single-point anchor of the already-documented
// predicted exponent, for visual comparison against the measured ladder.
const LAST = ROUTE_A_LAMMIN_DESCENT[ROUTE_A_LAMMIN_DESCENT.length - 1];
export const ROUTE_A_SCALING_REFERENCE = Object.freeze({
  exponent: ROUTE_A_LAMMIN_SCALING.globalFit.predicted, // 0.45
  nuMin: ROUTE_A_LAMMIN_SCALING.globalFit.nuMin, // 0.05
  anchorPN: LAST.pN,
  anchorLamMin: LAST.lamMin,
  prefactor: Math.abs(LAST.lamMin) / Math.pow(LAST.pN, ROUTE_A_LAMMIN_SCALING.globalFit.predicted),
  measuredGlobalExponent: ROUTE_A_LAMMIN_SCALING.globalFit.exponent, // 0.3807, fitted below-p_N=9973
  measuredTailExponent: ROUTE_A_LAMMIN_SCALING.tailFit.exponent, // 0.4125, p_N>=541 tail fit
});

export function routeAReferenceCurveValue(pN) {
  return -ROUTE_A_SCALING_REFERENCE.prefactor * Math.pow(pN, ROUTE_A_SCALING_REFERENCE.exponent);
}

export const ROUTE_A_CAVEAT_BANNER =
  'Measurement only: the finite-N completed-gas Pick reflection Gram is NOT PSD ' +
  'at any N (lambda_min strictly decreasing, -143 -> -4213 across N=0..1229); ' +
  'this REFUTES reflection positivity for the truncated primon gas, but the ' +
  'infinite-N (untruncated) statement RP <=> Weil positivity <=> RH is an exact ' +
  'EQUIVALENCE (Lagarias-Pick), not a stronger route. Every plotted lambda_min ' +
  'point and the p_N^{0.45} reference exponent are copied verbatim from ' +
  'rh-route-a-reflection-positivity-primon-gas-2026-09-23.js (no re-derivation). ' +
  'Changes no bound; RH open; no refereed bound is changed; NO QED.';

const rel = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);

export const ROUTE_A_LAMMIN_DESCENT_ASSERTIONS = [
  {
    id: 'imp96038-thirteen-rungs-matching-source',
    description: 'exactly 13 rungs, N and lamMin copied exactly from ROUTE_A_N_LADDER / ROUTE_A_LITERALS.finiteGasLamMin',
    holds: () =>
      ROUTE_A_LAMMIN_DESCENT.length === 13 &&
      ROUTE_A_LAMMIN_DESCENT.every((r, i) => r.N === ROUTE_A_N_LADDER[i] && r.lamMin === ROUTE_A_LITERALS.finiteGasLamMin[i]),
  },
  {
    id: 'imp96038-pN-matches-nth-prime',
    description: 'baked p_N literals are the correct N-th prime for every N>=1 in the ladder (independent small sieve cross-check)',
    holds: () => {
      const M = 10000;
      const sieve = new Uint8Array(M + 1);
      const primes = [];
      for (let i = 2; i <= M; i++) {
        if (!sieve[i]) {
          primes.push(i);
          for (let j = i * i; j <= M; j += i) sieve[j] = 1;
        }
      }
      return ROUTE_A_LAMMIN_DESCENT.every((r) => (r.N === 0 ? r.pN === null : r.pN === primes[r.N - 1]));
    },
  },
  {
    id: 'imp96038-lamMin-strictly-descends',
    description: 'lambda_min is strictly decreasing (more negative) across the ladder, matching the -143 -> -4213 headline',
    holds: () =>
      ROUTE_A_LAMMIN_DESCENT.every((r, i) => i === 0 || r.lamMin < ROUTE_A_LAMMIN_DESCENT[i - 1].lamMin) &&
      rel(ROUTE_A_LAMMIN_DESCENT[0].lamMin, -142.669, 1e-6) &&
      rel(ROUTE_A_LAMMIN_DESCENT[ROUTE_A_LAMMIN_DESCENT.length - 1].lamMin, -4213.156, 1e-6),
  },
  {
    id: 'imp96038-reference-curve-anchored-and-below-measured',
    description: 'the anchored p_N^{0.45} reference curve passes exactly through the last rung and lies strictly weaker (smaller magnitude) than every earlier measured rung, consistent with the documented "approaches from below" verdict',
    holds: () => {
      const anchoredOK = rel(routeAReferenceCurveValue(LAST.pN), LAST.lamMin, 1e-9);
      const belowEverywhereElse = ROUTE_A_LAMMIN_DESCENT.filter((r) => r.pN && r.pN < LAST.pN).every(
        (r) => Math.abs(routeAReferenceCurveValue(r.pN)) < Math.abs(r.lamMin)
      );
      return anchoredOK && belowEverywhereElse;
    },
  },
  {
    id: 'imp96038-exponents-match-source-scaling-record',
    description: 'predicted/measured exponents equal the ROUTE_A_LAMMIN_SCALING globalFit/tailFit fields exactly',
    holds: () =>
      ROUTE_A_SCALING_REFERENCE.exponent === ROUTE_A_LAMMIN_SCALING.globalFit.predicted &&
      ROUTE_A_SCALING_REFERENCE.measuredGlobalExponent === ROUTE_A_LAMMIN_SCALING.globalFit.exponent &&
      ROUTE_A_SCALING_REFERENCE.measuredTailExponent === ROUTE_A_LAMMIN_SCALING.tailFit.exponent,
  },
  {
    id: 'imp96038-caveat-banner-honest',
    description: 'banner states RH open, NO QED, and the equivalence (not strength) framing',
    holds: () =>
      /RH open/.test(ROUTE_A_CAVEAT_BANNER) && /NO QED/.test(ROUTE_A_CAVEAT_BANNER) && /EQUIVALENCE/.test(ROUTE_A_CAVEAT_BANNER),
  },
];

for (const a of ROUTE_A_LAMMIN_DESCENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96038-route-a-reflection-gram-lammin-descent-viz-data assertion failed: ${a.id}`);
  }
}
