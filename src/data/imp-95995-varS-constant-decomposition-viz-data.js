/**
 * @module imp-95995-varS-constant-decomposition-viz-data
 *
 * imp-95995 (ux): import-light viz-data module charting the imp-95964
 * Var S(T) additive-constant decomposition b = M + P2 + K: the pinned
 * Mertens constant M and convergent prime-power double sum P2 (together
 * b_diag = M + P2, known to O(1e-12)) against the unresolved O(1)
 * boundary/cutoff constant K (~1.06 from the imp-95940 empirical a_0
 * mean), which is ~100x the O(0.01) tolerance required to collapse the
 * imp-95940 crossing-height range -- never plotted before.
 *
 * All values are copied verbatim from the imp-95964
 * IMP95964_FUJII_VARS_CONSTANT_LOCATE_OBSTRUCTION export -- no
 * re-derivation, no re-execution of the underlying prime sieve.
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . Catalan G irrationality OPEN; Sun arXiv:2609.04176 unrefereed.
 * NO QED.
 *
 * @see imp-95964-fujii-varS-constant-locate-obstruction.js (source finding:
 *   the b = M + P2 + K decomposition and the K boundary-constant obstruction)
 *
 * Ticket: imp-95995 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP95964_FUJII_VARS_CONSTANT_LOCATE_OBSTRUCTION as SRC } from './imp-95964-fujii-varS-constant-locate-obstruction.js';

const { decomposition, boundaryConstant } = SRC;

// stacked-bar segments: two resolved (M, P2, pinned to O(1e-12)) plus one
// unresolved (K, O(1), ~100x the required O(0.01) tolerance)
export const IMP95995_VARS_DECOMPOSITION_SEGMENTS = [
  { key: 'M', label: 'Mertens M', value: decomposition.mertensM, resolved: true },
  { key: 'P2', label: 'Prime-power sum P2', value: decomposition.P2, resolved: true },
  { key: 'K', label: 'Boundary constant K', value: boundaryConstant.K, resolved: false },
];

export const IMP95995_B_DIAG = decomposition.bDiag; // M + P2, pinned to O(1e-12)
export const IMP95995_B_EMPIRICAL = boundaryConstant.bEmpirical; // b_diag + K
export const IMP95995_REQUIRED_ACCURACY = boundaryConstant.requiredAccuracy; // 0.01
export const IMP95995_K_OVER_TOLERANCE =
  Math.abs(boundaryConstant.K) / boundaryConstant.requiredAccuracy;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP95995_ASSERTIONS = [
  {
    id: 'imp95995-segments-sum-to-empirical-b',
    description: 'the three segments (M, P2, K) sum to the empirical b to float precision',
    holds: () => {
      const sum = IMP95995_VARS_DECOMPOSITION_SEGMENTS.reduce((s, seg) => s + seg.value, 0);
      return Math.abs(sum - IMP95995_B_EMPIRICAL) < 1e-9;
    },
  },
  {
    id: 'imp95995-resolved-segments-match-bDiag',
    description: 'the two resolved segments (M + P2) equal bDiag',
    holds: () => {
      const resolvedSum = IMP95995_VARS_DECOMPOSITION_SEGMENTS.filter((s) => s.resolved).reduce(
        (s, seg) => s + seg.value,
        0,
      );
      return Math.abs(resolvedSum - IMP95995_B_DIAG) < 1e-9;
    },
  },
  {
    id: 'imp95995-K-flagged-unresolved-and-exceeds-tolerance',
    description:
      'K is the only unresolved segment and exceeds the required O(0.01) tolerance by >50x',
    holds: () => {
      const kSeg = IMP95995_VARS_DECOMPOSITION_SEGMENTS.find((s) => s.key === 'K');
      const unresolvedCount = IMP95995_VARS_DECOMPOSITION_SEGMENTS.filter(
        (s) => !s.resolved,
      ).length;
      return unresolvedCount === 1 && kSeg.resolved === false && IMP95995_K_OVER_TOLERANCE > 50;
    },
  },
];

for (const a of IMP95995_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95995-varS-constant-decomposition-viz-data assertion failed: ${a.id}`);
  }
}
