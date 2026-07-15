import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
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
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>height map</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>N_max</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>sigma_max</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>d(log10 N)</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>d(sigma)</th>
        </tr>
      </thead>
      <tbody>
        {IMP35561_PEAK_LADDER.map((row) => {
          const isBase = row.dLog10N === 0 && row.dSigma === 0;
          return (
            <tr key={row.heightMap} style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
              <td style={{ padding: '0.4rem 0.6rem', color: isBase ? '#38bdf8' : '#cbd5e1' }}>
                {row.heightMap}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#cbd5e1' }}>
                {row.Nmax.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#cbd5e1' }}>
                {row.sigmaMax.toFixed(8)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#cbd5e1' }}>
                {row.dLog10N >= 0 ? '+' : ''}
                {row.dLog10N.toFixed(5)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#cbd5e1' }}>
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

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35337 located the sigma double-surrogate interior PEAK holding the height map FIXED at
        the exact Riemann-von Mangoldt inverse: N_max = {IMP35561_BASE.Nmax.toExponential(4)},
        sigma_max = {IMP35561_BASE.sigmaMax.toFixed(8)}. imp-35536 re-ran that same peak locator
        under five alternative height maps -- the closed surrogate 2&pi;N/logN (which diverges from
        the RvM inverse by ~32 percent at this scale) and four RvM multiplicative perturbations
        (&plusmn;2 percent, &plusmn;5 percent) -- to test whether the peak is a genuine feature or a
        surrogate artifact.
      </p>

      <SensitivityTable />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '1.25rem' }}>
        Across all {IMP35561_SUMMARY.rowCount} height maps, sigma_max stays inside [
        {IMP35561_SUMMARY.sigmaMaxLo.toFixed(4)}, {IMP35561_SUMMARY.sigmaMaxHi.toFixed(4)}] -- a
        spread of only {IMP35561_SUMMARY.sigmaMaxSpread.toExponential(2)} (under 1 percent) -- while
        N_max drifts by up to {IMP35561_SUMMARY.maxDLog10N.toFixed(5)} decades under the full
        surrogate swap. The peak HEIGHT is robust to the height-map choice; only the peak LOCATION
        should be quoted to about one significant figure.
      </p>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Measurement only:</strong> viz-data only, re-exporting
        the imp-35536 peakLadder table verbatim; no new derivation, no bound changed. Discharges
        nothing: the imp-35337a surrogate-vs-true fidelity sub-gap stays OPEN; the C_C = (1/8)&nbsp;
        sqrt(3&nbsp;pi) ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631) are UNTOUCHED;
        changes no bound; establishes no operator positivity; no RH verdict, NO QED.
        Platt-Trudgian Lambda&nbsp;&le;&nbsp;0.2 remains SOTA.
      </div>
    </div>
  );
}
