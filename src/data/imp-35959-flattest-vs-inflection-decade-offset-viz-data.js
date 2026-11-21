/**
 * @module imp-35959-flattest-vs-inflection-decade-offset-viz-data
 *
 * imp-35959 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-35891 two-knee N-axis cross-location: the imp-35853 REQ-4 required-height
 * "flattest point" (sigma ~ 0.407, N_flat ~ 7.21e9, log10 N ~ 9.858) against the
 * imp-33701 sigma-exponent decay-rate inflection decade ([1e10,1e11]), showing
 * the ~1-decade offset the two markers span on a shared log10-N axis, plus the
 * two-decade [1e9,1e11] window both fall inside. Follows the imp-35791
 * import-light pattern: baked literals only, no re-derivation, no heavy import.
 *
 * MEASUREMENT / PRESENTATION ONLY. Reuses the recorded imp-35891 literals;
 * changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35891-flattest-point-vs-sigmoid-knee-crosslocation.js (source: both markers baked here)
 * @see imp-35853-req4-required-height-continuous-sigma-knee.js (flattest-point locator, sigma ~ 0.407)
 * @see imp-33701-sigma-postpeak-ramp-curvature-inflection.js (exponent-ramp inflection, [1e10,1e11])
 * @see imp-35791-beat-parity-Nsigma-ladder-viz-data.js (the import-light pattern this module follows)
 *
 * Ticket: imp-35959 (ux, low). Presentation only, RH-free; changes no bound; NO QED.
 */

export const IMP35959_KNEE_MARKERS = [
  {
    label: 'flattestPoint',
    N: 7.211e9,
    log10_N: 9.858,
    sigma: 0.4068,
    decade: '1e9->1e10',
    note: 'imp-35853 REQ-4 required-height-multiple flattest point (mid-downslope minimum of |d multiple / d sigma|); reproduces the independent imp-35889 height.',
  },
  {
    label: 'inflectionDecadeMidpoint',
    N: 3.1623e10,
    log10_N: 10.5,
    sigma: null,
    decade: '1e10->1e11',
    note: 'Midpoint of the imp-33701 sigma-decay-exponent inflection decade (second-difference sign change of the per-decade local decay exponent); no single sigma level, a decade not a point.',
  },
];

export const IMP35959_SHARED_WINDOW = {
  log10_lo: 9,
  log10_hi: 11,
  N_lo: 1e9,
  N_hi: 1e11,
  note: 'Both markers fall inside this shared two-decade [1e9,1e11] downslope window (imp-35891 F2).',
};

export const IMP35959_DECADE_OFFSET = 1; // imp-35891 DECADE_OFFSET: inflection decade (10) - flattest decade (9)

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35959_ASSERTIONS = [
  {
    id: 'imp35959-markers-ordered-by-log10N',
    description: 'The two markers are ordered by strictly increasing log10 N',
    holds: () =>
      IMP35959_KNEE_MARKERS.every(
        (m, i) => i === 0 || m.log10_N > IMP35959_KNEE_MARKERS[i - 1].log10_N,
      ),
  },
  {
    id: 'imp35959-flattest-point-matches-imp35891',
    description: 'The flattest-point marker reproduces the recorded imp-35891 literal (N ~7.21e9, log10 N ~9.858, sigma ~0.4068)',
    holds: () => {
      const m = IMP35959_KNEE_MARKERS[0];
      return (
        Math.abs(m.N / 7.211e9 - 1) < 1e-3 &&
        Math.abs(m.log10_N - 9.858) < 1e-3 &&
        Math.abs(m.sigma - 0.4068) < 1e-4 &&
        m.decade === '1e9->1e10'
      );
    },
  },
  {
    id: 'imp35959-inflection-midpoint-consistent',
    description: 'The inflection-decade midpoint marker log10 N is 10.5 (center of [1e10,1e11]) and N = 10^10.5',
    holds: () => {
      const m = IMP35959_KNEE_MARKERS[1];
      return (
        m.log10_N === 10.5 &&
        Math.abs(m.N / Math.pow(10, 10.5) - 1) < 1e-3 &&
        m.decade === '1e10->1e11'
      );
    },
  },
  {
    id: 'imp35959-one-decade-offset',
    description: 'The offset between the two markers spans ~1 decade, matching the imp-35891 DECADE_OFFSET = 1',
    holds: () => {
      const [flat, infl] = IMP35959_KNEE_MARKERS;
      return (
        IMP35959_DECADE_OFFSET === 1 &&
        infl.log10_N - flat.log10_N > 0.5 &&
        infl.log10_N - flat.log10_N < 1.5
      );
    },
  },
  {
    id: 'imp35959-both-markers-inside-shared-window',
    description: 'Both markers fall inside the shared [1e9,1e11] window',
    holds: () =>
      IMP35959_KNEE_MARKERS.every(
        (m) => m.log10_N >= IMP35959_SHARED_WINDOW.log10_lo && m.log10_N <= IMP35959_SHARED_WINDOW.log10_hi,
      ),
  },
];

for (const a of IMP35959_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35959-flattest-vs-inflection-decade-offset-viz-data assertion failed: ${a.id}`);
  }
}
