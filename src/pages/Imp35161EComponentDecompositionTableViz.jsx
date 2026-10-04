import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35105_COMPONENT_TABLE,
  IMP35105_LANDMARK_TABLE,
} from '../data/imp-35105-e-component-decomposition-table.js';
import { ED } from '../styles/tokens.js';

const cellStyle = { textAlign: 'right', padding: '4px 8px' };
const headStyle = { textAlign: 'right', padding: '4px 8px', color: ED.inkSoft };

function DominantBadge({ dominant }) {
  const color =
    dominant === 'E_coll' ? ED.series3 : dominant === 'E_trunc' ? ED.series5 : dominant === 'E_flow' ? ED.brass : ED.series7;
  return <span style={{ color, fontWeight: 600 }}>{dominant}</span>;
}

function ComponentTable({ rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule)' }}>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>Row</th>
            <th style={headStyle}>N</th>
            <th style={headStyle}>E_coll</th>
            <th style={headStyle}>E_trunc</th>
            <th style={headStyle}>E_flow</th>
            <th style={headStyle}>share_coll</th>
            <th style={headStyle}>share_trunc</th>
            <th style={headStyle}>share_flow</th>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>Dominant</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <td style={{ padding: '4px 8px' }}>{r.label}</td>
              <td style={cellStyle}>{r.N.toExponential(3)}</td>
              <td style={cellStyle}>{r.E_coll.toExponential(3)}</td>
              <td style={cellStyle}>{r.E_trunc.toExponential(3)}</td>
              <td style={cellStyle}>{r.E_flow.toExponential(3)}</td>
              <td style={cellStyle}>{r.share_coll.toFixed(4)}</td>
              <td style={cellStyle}>{r.share_trunc.toFixed(4)}</td>
              <td style={cellStyle}>{r.share_flow.toFixed(4)}</td>
              <td style={{ padding: '4px 8px' }}>
                <DominantBadge dominant={r.dominant} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Imp35161EComponentDecompositionTableViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="E_coll / E_trunc / E_flow Component Decomposition Table (imp-35105 / imp-35161)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Every sigma(N) landmark reports a single share sigma = E_coll / E(N), but that number is
        the top row of a three-way budget E(N) = E_coll(N) + E_trunc + E_flow(N) whose rank order
        flips TWICE across the imp-34693 admissible band. This table lays out the absolute
        magnitude and fractional share of each component side by side on a log-spaced grid over
        N &isin; [1e6, 1e13], plus the four cluster landmarks, with the dominant term highlighted
        per row.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Log-spaced grid, N = 1e6 .. 1e13
      </p>
      <ComponentTable rows={IMP35105_COMPONENT_TABLE} />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Four cluster landmarks
      </p>
      <ComponentTable rows={IMP35105_LANDMARK_TABLE} />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the table:</strong> E_coll dominates the low-N
        rows (share &sim; 0.95 near the peak) and stays dominant on the downslope; E_trunc is the
        flat 3.06e-5 floor whose share climbs monotonically and overtakes E_coll past N_cross
        (&sim; 3.28e9); E_flow is always the smallest term but decays fastest of all, mattering
        only through the exact identity sigma = 1/2 &hArr; E_coll = E_trunc + E_flow (imp-33601).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> table only -- the component
        model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic. The
        C_mb GUE-conditional per imp-486 is untouched; changes no bound; establishes no operator
        positivity; imp-3066 K_a &ge; 0 remains untouched. No RH verdict, NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp35121-ecoll-etrunc-eflow-decomposition" style={{ color: 'var(--series-5)' }}>
          E_coll / E_trunc / E_flow Component Decomposition Chart (imp-33601 / imp-35121)
        </Link>
      </div>
    </div>
  );
}
