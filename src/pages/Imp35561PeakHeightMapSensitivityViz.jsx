import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35561_PEAK_LADDER,
  IMP35561_BASE,
  IMP35561_SUMMARY,
} from '../data/imp-35561-peak-height-map-sensitivity-viz-data.js';

// Table of the six height maps: N_max, sigma_max, and their shift from the RvM-inverse BASE row.
function SensitivityTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', fontFamily: 'monospace' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>height map</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>N_max</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>sigma_max</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>d(log10 N)</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>d(sigma)</th>
        </tr>
      </thead>
      <tbody>
        {IMP35561_PEAK_LADDER.map((row) => {
          const isBase = row.dLog10N === 0 && row.dSigma === 0;
          return (
            <tr key={row.heightMap} style={{ borderBottom: '1px solid color-mix(in srgb, var(--rule) 50%, transparent)' }}>
              <td style={{ padding: '0.4rem 0.6rem', color: isBase ? 'var(--series-1)' : 'var(--ink)' }}>
                {row.heightMap}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: 'var(--ink)' }}>
                {row.Nmax.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: 'var(--ink)' }}>
                {row.sigmaMax.toFixed(8)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: 'var(--ink)' }}>
                {row.dLog10N >= 0 ? '+' : ''}
                {row.dLog10N.toFixed(5)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: 'var(--ink)' }}>
                {row.dSigma >= 0 ? '+' : ''}
                {row.dSigma.toExponential(2)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Imp35561PeakHeightMapSensitivityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Peak Height-Map Sensitivity: Robust Height, Drifting Location (imp-35561 / imp-35536)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35337 located the sigma double-surrogate interior PEAK holding the height map FIXED at
        the exact Riemann-von Mangoldt inverse: N_max = {IMP35561_BASE.Nmax.toExponential(4)},
        sigma_max = {IMP35561_BASE.sigmaMax.toFixed(8)}. imp-35536 re-ran that same peak locator
        under five alternative height maps -- the closed surrogate 2&pi;N/logN (which diverges from
        the RvM inverse by ~32 percent at this scale) and four RvM multiplicative perturbations
        (&plusmn;2 percent, &plusmn;5 percent) -- to test whether the peak is a genuine feature or a
        surrogate artifact.
      </p>

      <SensitivityTable />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem' }}>
        Across all {IMP35561_SUMMARY.rowCount} height maps, sigma_max stays inside [
        {IMP35561_SUMMARY.sigmaMaxLo.toFixed(4)}, {IMP35561_SUMMARY.sigmaMaxHi.toFixed(4)}] -- a
        spread of only {IMP35561_SUMMARY.sigmaMaxSpread.toExponential(2)} (under 1 percent) -- while
        N_max drifts by up to {IMP35561_SUMMARY.maxDLog10N.toFixed(5)} decades under the full
        surrogate swap. The peak HEIGHT is robust to the height-map choice; only the peak LOCATION
        should be quoted to about one significant figure.
      </p>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Status sharpening (imp-35574):</strong>{' '}
        "Quoted to one significant figure" does NOT mean height-map-insensitive. imp-35574 forms
        the imp-35458 crossover damping factor for the peak LOCATION itself and finds it below 1
        (~0.55) -- a ~24 percent raw height-map gap maps to a ~44 percent N_max shift, mild
        AMPLIFICATION rather than the ~18x log-damping the E_coll = E_trunc crossover enjoys. Only
        the peak HEIGHT sigma_max is height-map-robust; the peak LOCATION N_max is NOT a
        log-damped landmark and must keep being quoted only to ~one significant figure.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--series-1)' }}>Not a symmetric extremum (imp-35451 / imp-35557):</strong>{' '}
        the robust-sigma_max / one-sig-fig-N_max framing above should not be read as a clean,
        symmetric peak. A negative cubic coefficient c3 &asymp; -2.62e-4 (imp-35451) makes the
        rising arm wider than the falling arm, and imp-35557 shows this skew INHERITS the same
        height-map robustness as sigma_max itself: under the RvM &times; {'{'}1.02, 0.98{'}'}
        {' '}pair, c3 stays negative to within ~0.9 percent per arm and the arm-imbalance slope
        A_skew stays near 11.0.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Measurement only:</strong> viz-data only, re-exporting
        the imp-35536 peakLadder table verbatim; no new derivation, no bound changed. Discharges
        nothing: the imp-35337a surrogate-vs-true fidelity sub-gap stays OPEN; the C_C = (1/8)&nbsp;
        sqrt(3&nbsp;pi) ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631) are UNTOUCHED;
        changes no bound; establishes no operator positivity; no RH verdict, NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35663-decade-span-growth', label: 'imp-35663 Decade-Span Growth' },
          {
            to: '/viz-imp35664-fartail-crossing-height-map-sensitivity',
            label: 'imp-35664 Far-Tail-Crossing Height-Map Sensitivity',
          },
          {
            to: '/viz-imp35665-pinsker-common-functional-bridge',
            label: 'imp-35665 Pinsker Common-Functional Bridge',
          },
        ]}
      />
    </div>
  );
}
