import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35664_ROWS,
  IMP35664_BENIGN_CROSSOVER,
  IMP35664_SUMMARY,
} from '../data/imp-35664-fartail-crossings-height-map-sensitivity-viz-data.js';

// Table of the two far-tail crossings: surrogate vs RvM-inverse log10 N, decade shift,
// height divergence, and remnant inflation.
function CrossingsTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', fontFamily: 'monospace' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>crossing</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>surrogate log10 N</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>RvM-inverse log10 N</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>shift (decades)</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>height divergence</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>remnant inflation</th>
        </tr>
      </thead>
      <tbody>
        {IMP35664_ROWS.map((row) => (
          <tr key={row.key} style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
            <td style={{ padding: '0.4rem 0.6rem', color: '#38bdf8' }}>{row.label}</td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#cbd5e1' }}>
              {row.surrogate.log10N.toFixed(4)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#cbd5e1' }}>
              {row.rvmInverse.log10N.toFixed(4)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#f87171' }}>
              +{row.shiftDecades.toFixed(4)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#cbd5e1' }}>
              {(row.heightDivergence * 100).toFixed(2)}%
            </td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#cbd5e1' }}>
              {row.remnantInflation.toFixed(2)}x
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35664FartailCrossingHeightMapSensitivityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail Crossing Height-Map Sensitivity: Growing, Not Damping (imp-35664 / imp-35577)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35577 swapped ONLY the height map -- the closed surrogate T0 = 2&pi;N/logN versus the
        exact Riemann-von Mangoldt inverse -- in the imp-35413/imp-35473 E_flow far-tail
        fd-vs-analytic remnant, and re-located both threshold-crossings under each map. The table
        below shows both crossings side by side.
      </p>

      <CrossingsTable />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '1.25rem' }}>
        The decade shift GROWS deeper ({IMP35664_ROWS[0].shiftDecades.toFixed(2)} &rarr;{' '}
        {IMP35664_ROWS[1].shiftDecades.toFixed(2)} decades, a{' '}
        {IMP35664_SUMMARY.shiftRatio.toFixed(2)}x increase) even though the raw height-map
        divergence at each surrogate-crossing scale SHRINKS (
        {(IMP35664_ROWS[0].heightDivergence * 100).toFixed(2)}% &rarr;{' '}
        {(IMP35664_ROWS[1].heightDivergence * 100).toFixed(2)}%) -- because the ~2x remnant
        inflation rides an ever-slower ~1/log N decay, so a near-constant inflation costs more
        decades the deeper the crossing sits.
      </p>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(217,119,6,0.06)',
          borderLeft: '3px solid #d97706',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
        }}
      >
        <strong style={{ color: '#d97706' }}>Contrast with the benign imp-35458 crossover:</strong>{' '}
        the E_coll = E_trunc crossover shifts by only {IMP35664_BENIGN_CROSSOVER.relativeShiftPct}%
        under the identical height-map swap -- about {IMP35664_BENIGN_CROSSOVER.dampingFactor}x
        smaller than its ~{IMP35664_BENIGN_CROSSOVER.rawHeightGapPct}% raw height-map gap, because
        that crossover sees the height only through log T0. The far-tail remnant crossings do NOT
        share that log-damping: they compare a map-swapped fd against a surrogate-channel analytic
        reference, so the mismatch survives and amplifies along the slow tail instead of damping
        out. The two crossing TYPES respond in opposite directions to the same height-map swap.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Measurement only:</strong> viz-data only, re-exporting
        the imp-35577 crossings table verbatim; no new derivation, no bound changed. Discharges
        nothing: the imp-35337a surrogate-vs-true fidelity sub-gap stays OPEN; the imp-3220/imp-3406
        surrogate inheritance is UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no
        bound; establishes no operator positivity; no RH verdict, NO QED. Platt-Trudgian
        Lambda&nbsp;&le;&nbsp;0.2 remains SOTA.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35663-decade-span-growth', label: 'imp-35663 Decade-Span Growth' },
          {
            to: '/viz-imp35665-pinsker-common-functional-bridge',
            label: 'imp-35665 Pinsker Common-Functional Bridge',
          },
          {
            to: '/viz-imp35561-peak-height-map-sensitivity',
            label: 'imp-35561 Peak Height-Map Sensitivity',
          },
        ]}
      />
    </div>
  );
}
