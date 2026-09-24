import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96535_LEDGER_ROWS,
  IMP96535_OVERLAP_SUMMARY,
  IMP96535_HONEST_BANNER,
} from '../data/imp-96535-ledger-reconciliation-viz-data.js';

const MEMBERSHIP_LABEL = {
  both: 'both ledgers',
  'dip-only': 'imp-96089 dip table only',
  'scan-only': 'imp-96493 scan only',
};

const MEMBERSHIP_COLOR = {
  both: '#facc15',
  'dip-only': '#94a3b8',
  'scan-only': '#38bdf8',
};

function LedgerRow({ row }) {
  return (
    <tr>
      <td style={{ padding: '0.4rem 0.6rem', color: '#e2e8f0', fontFamily: 'monospace' }}>
        {row.Tc.toExponential(3)}
      </td>
      <td style={{ padding: '0.4rem 0.6rem' }}>
        <span
          style={{
            color: MEMBERSHIP_COLOR[row.membership],
            fontSize: '0.78rem',
            fontWeight: 600,
          }}
        >
          {MEMBERSHIP_LABEL[row.membership]}
        </span>
      </td>
      <td style={{ padding: '0.4rem 0.6rem', color: '#94a3b8', fontFamily: 'monospace', textAlign: 'right' }}>
        {row.nW}
      </td>
      <td style={{ padding: '0.4rem 0.6rem', color: '#94a3b8', fontFamily: 'monospace', textAlign: 'right' }}>
        {row.z.toFixed(4)}
      </td>
      <td style={{ padding: '0.4rem 0.6rem', color: row.belowClip ? '#4ade80' : '#f87171', fontSize: '0.78rem' }}>
        {row.belowClip ? 'interior' : 'clipped'}
      </td>
      <td style={{ padding: '0.4rem 0.6rem', color: '#94a3b8', fontSize: '0.78rem' }}>
        {row.membership === 'both' ? (row.agree ? 'AGREE (Δz=0)' : 'DISAGREE') : '—'}
      </td>
    </tr>
  );
}

export default function Imp96535LedgerReconciliationViz() {
  const rows = [...IMP96535_LEDGER_ROWS].sort((a, b) => a.Tc - b.Tc);
  const { overlapHeights, allOverlapAgree, maxDeltaZ, dipOnlyHeights, scanOnlyHeights, tClip } =
    IMP96535_OVERLAP_SUMMARY;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96512: Excursion Ledger Reconciliation" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96535_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Two independent significance ledgers over the same 10^6 Odlyzko ordinates were built
        separately: the imp-96089 below-envelope dip table (three heights) and the imp-96493
        interior z-score scan (ten heights). This card reconciles them height-by-height, showing
        which heights are shared, which are ledger-specific, and whether the shared heights agree.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.6rem',
          marginBottom: '1.25rem',
        }}
      >
        {[
          { label: 'Overlap heights', value: overlapHeights.map((t) => t.toExponential(1)).join(', ') },
          { label: 'Overlap agreement', value: allOverlapAgree ? 'FULL (both heights)' : 'PARTIAL' },
          { label: 'Max |Δz| on overlap', value: maxDeltaZ.toString() },
          { label: 'Dip-table-only heights', value: dipOnlyHeights.length },
          { label: 'Scan-only heights', value: scanOnlyHeights.length },
          { label: 'Clip threshold T_clip', value: tClip.toExponential(4) },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: '0.6rem 0.75rem',
              background: 'rgba(148,163,184,0.05)',
              borderRadius: 6,
              border: '1px solid #1e293b',
            }}
          >
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '0.2rem' }}>{s.label}</div>
            <div style={{ fontSize: '0.9rem', color: '#e2e8f0', fontFamily: 'monospace' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Height-by-height ledger membership and agreement
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', color: '#64748b' }}>T_c</th>
            <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', color: '#64748b' }}>Ledger</th>
            <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#64748b' }}>n_w</th>
            <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#64748b' }}>z</th>
            <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', color: '#64748b' }}>Clip status</th>
            <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', color: '#64748b' }}>Cross-check</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <LedgerRow key={row.Tc} row={row} />
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-96512 baked height-by-height comparison verbatim (the only new step is picking a
        display n_w/z per row and a membership category). Cross-validation only: changes no
        bound, establishes no operator positivity; RH open; NO QED; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA.
      </div>
    </div>
  );
}
