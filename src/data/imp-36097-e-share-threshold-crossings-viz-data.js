/**
 * @module imp-36097-e-share-threshold-crossings-viz-data
 *
 * imp-36097 (numerical, measurement): LOCATE the heights N at which the E_flow and
 * E_coll fractional SHARES of the imp-35889 three-way split
 * E(N) = E_trunc + E_flow + E_coll first fall below fixed thresholds. imp-36046 baked
 * only the SHARES at three chosen tail landmarks (the E_flow < 1%-of-E_trunc crossing
 * N ~4.623e8, the roadmap sigma < 0.1 landmark N ~3.21e11, and the sole-survivor
 * height N* ~4.7214e13 where shareFlow ~4.14e-7, shareColl ~0.99%); it never located
 * WHERE shareFlow crosses 1e-3 / 1e-5 / 1e-6 nor WHERE shareColl first drops below 1%.
 * This module fills those four missing crossing heights by bisection on log N over the
 * EXACT same imp-3406 / imp-33582 / imp-2642 sub-terms imp-36046 / imp-35997 use.
 *
 * SETUP (identical sub-terms to imp-35997 / imp-36046; no fresh model).
 *   E_trunc = 3.06e-5 (imp-2631, N-independent fixed-strip route),
 *   E_flow  = C_F (log T0 / T0) exp|t_c|  with C_F = (log(T0 / 2pi) + 1) / 2pi (imp-398),
 *   E_coll  = C_C sqrt(log T0 / N)        with C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional).
 * Both shareFlow = E_flow / E(N) and shareColl = E_coll / E(N) are monotonically
 * decreasing on this far-tail stretch, so each threshold crossing is the unique root
 * located by bisecting log N.
 *
 * WHAT THE MEASUREMENT SHOWS (the honest finding). The four crossing heights are:
 *   - shareFlow < 1e-3 first at N ~3.010e9  (log10 N ~9.479,  log T0 ~20.776): still
 *     collision-heavy, shareColl ~0.510, shareTrunc ~0.489 (near the sigma = 0.5 elbow).
 *   - shareFlow < 1e-5 first at N ~1.266e12 (log10 N ~12.102, log T0 ~26.539):
 *     truncation-dominated, shareTrunc ~0.946, shareColl ~0.0543.
 *   - shareFlow < 1e-6 first at N ~1.754e13 (log10 N ~13.244, log T0 ~29.066):
 *     shareTrunc ~0.984, shareColl ~0.0159.
 *   - shareColl < 1%   first at N ~4.624e13 (log10 N ~13.665, log T0 ~30.001):
 *     shareTrunc ~0.990, shareColl ~0.0100 -- essentially AT the imp-35971 sole-survivor
 *     height N* ~4.7214e13 (which sits just above, at shareColl ~0.99%), confirming the
 *     sole-survivor landmark IS the E_coll < 1% crossing to within the tabulation.
 * So the E_flow thresholds are crossed decades apart (~9.5, ~12.1, ~13.2 in log10 N),
 * and the E_coll < 1% crossing coincides with the sole-survivor height, as expected.
 *
 * MEASUREMENT / PRESENTATION ONLY. Extends the imp-36046 tail with the four missing
 * crossing heights; reuses the pinned imp-3406 / imp-33582 constants and the imp-35889
 * sub-terms unchanged; derives no remainder; discharges nothing; changes no bound;
 * C_C GUE-conditional (imp-2642 / imp-2643 / imp-486) untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-36046-e-share-tail-landmarks-viz-data.js (the tail landmarks this extends with crossing heights)
 * @see imp-35997-eflow-max-share-height.js (same parts(N) sub-terms; the E_flow-share maximum)
 * @see imp-35971-etrunc-sole-survivor-height.js (the sole-survivor height the E_coll < 1% crossing coincides with)
 * @see imp-35889-e-share-decomposition-at-knees.js (the three-way split this ladder traces)
 *
 * Ticket: imp-36097 (numerical, medium). Measurement only, RH-free; changes no bound; NO QED.
 */

export const IMP36097_E_SHARE_THRESHOLD_CROSSINGS = [
  {
    label: 'shareFlow<1e-3',
    quantity: 'E_flow',
    threshold: 1e-3,
    N: 3.010234e9,
    log10_N: 9.4786,
    logT0: 20.7762,
    shareTrunc: 0.489260,
    shareFlow: 1.0000e-3,
    shareColl: 0.509740,
    dominant: 'E_coll',
    note: 'E_flow share first below 1e-3 near the sigma = 0.5 elbow: still collision-heavy (shareColl ~0.510), shareTrunc ~0.489.',
  },
  {
    label: 'shareFlow<1e-5',
    quantity: 'E_flow',
    threshold: 1e-5,
    N: 1.265845e12,
    log10_N: 12.1024,
    logT0: 26.5391,
    shareTrunc: 0.945690,
    shareFlow: 1.0000e-5,
    shareColl: 0.054300,
    dominant: 'E_trunc',
    note: 'E_flow share first below 1e-5: truncation-dominated (shareTrunc ~0.946), E_coll runner-up ~0.054.',
  },
  {
    label: 'shareFlow<1e-6',
    quantity: 'E_flow',
    threshold: 1e-6,
    N: 1.753527e13,
    log10_N: 13.2439,
    logT0: 29.0663,
    shareTrunc: 0.984110,
    shareFlow: 1.0000e-6,
    shareColl: 0.015889,
    dominant: 'E_trunc',
    note: 'E_flow share first below 1e-6: shareTrunc ~0.984, E_coll ~0.0159 (approaching the sole-survivor regime).',
  },
  {
    label: 'shareColl<1pct',
    quantity: 'E_coll',
    threshold: 1e-2,
    N: 4.624381e13,
    log10_N: 13.6651,
    logT0: 30.0010,
    shareTrunc: 0.990000,
    shareFlow: 4.2126e-7,
    shareColl: 1.0000e-2,
    dominant: 'E_trunc',
    note: 'E_coll share first below 1%: essentially AT the imp-35971 sole-survivor height N* ~4.7214e13 (which sits just above at shareColl ~0.99%).',
  },
];

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP36097_ASSERTIONS = [
  {
    id: 'imp36097-crossings-ordered-by-N',
    description: 'The four threshold crossings are ordered by strictly increasing N (tighter threshold -> higher N)',
    holds: () =>
      IMP36097_E_SHARE_THRESHOLD_CROSSINGS.every(
        (c, i, arr) => i === 0 || c.N > arr[i - 1].N,
      ),
  },
  {
    id: 'imp36097-shares-sum-to-one',
    description: 'shareTrunc + shareFlow + shareColl sums to ~1 at each crossing',
    holds: () =>
      IMP36097_E_SHARE_THRESHOLD_CROSSINGS.every(
        (c) => Math.abs(c.shareTrunc + c.shareFlow + c.shareColl - 1) < 1e-4,
      ),
  },
  {
    id: 'imp36097-flow-crossings-hit-their-thresholds',
    description: 'At each E_flow crossing the recorded shareFlow equals its threshold to tabulation precision',
    holds: () =>
      IMP36097_E_SHARE_THRESHOLD_CROSSINGS.filter((c) => c.quantity === 'E_flow').every(
        (c) => Math.abs(c.shareFlow / c.threshold - 1) < 1e-3,
      ),
  },
  {
    id: 'imp36097-coll-crossing-hits-1pct',
    description: 'At the E_coll crossing the recorded shareColl equals 1% to tabulation precision',
    holds: () => {
      const c = IMP36097_E_SHARE_THRESHOLD_CROSSINGS[3];
      return c.quantity === 'E_coll' && Math.abs(c.shareColl - 1e-2) < 1e-5;
    },
  },
  {
    id: 'imp36097-coll-1pct-coincides-with-sole-survivor',
    description: 'The E_coll < 1% crossing (N ~4.624e13) sits just below the imp-35971 sole-survivor N* ~4.7214e13',
    holds: () => {
      const c = IMP36097_E_SHARE_THRESHOLD_CROSSINGS[3];
      return c.N < 4.7214e13 && c.N > 4.5e13;
    },
  },
  {
    id: 'imp36097-flow-share-becomes-truncation-dominated',
    description: 'The E_flow crossing at 1e-3 is still collision-heavy while the 1e-5 and 1e-6 crossings are truncation-dominated',
    holds: () => {
      const [f3, f5, f6] = IMP36097_E_SHARE_THRESHOLD_CROSSINGS;
      return f3.dominant === 'E_coll' && f5.dominant === 'E_trunc' && f6.dominant === 'E_trunc';
    },
  },
];

for (const a of IMP36097_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36097-e-share-threshold-crossings-viz-data assertion failed: ${a.id}`);
  }
}
