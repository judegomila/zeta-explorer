import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION } from '../data/imp-96190-fixed-strip-n-decaying-tail-obstruction.js';

function MovingTailTable({ rows, frozenFloor }) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.85rem',
        color: '#cbd5e1',
      }}
    >
      <thead>
        <tr style={{ borderBottom: '2px solid #334155' }}>
          {['H', 'log H', 'kappa(H)', 'H^-kappa(H)', 'E_trunc(H) [branch B]', 'vs. branch A floor'].map((h) => (
            <th key={h} style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.H} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#e2e8f0' }}>{r.H.toExponential(1)}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.logH}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.kappa}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>{r.powerFactor}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#f87171', fontWeight: 600 }}>
              {r.E_trunc_moving}
            </td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#64748b' }}>
              {(r.E_trunc_moving / frozenFloor).toExponential(2)}x
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp96212TwoBranchEtruncObstructionViz() {
  const data = IMP96190_FIXED_STRIP_N_DECAYING_TAIL_OBSTRUCTION;
  const { branches, heightCancellationIdentity, movingTailTable, honestStatusBanner } = data;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="imp-96190: The Two-Branch E_trunc Obstruction" />

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
        <div style={{ color: '#f87171', fontWeight: 600, marginBottom: '0.3rem' }}>
          {honestStatusBanner.tier}
        </div>
        <strong style={{ color: '#f87171' }}>{honestStatusBanner.label}:</strong>{' '}
        {honestStatusBanner.body}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        <strong style={{ color: '#e2e8f0' }}>Branch A</strong> ({branches.frozen.label}) freezes at
        E_trunc&nbsp;=&nbsp;{branches.frozen.E_trunc} &mdash; the imp-96166 floor, N-independent, no
        decay. <strong style={{ color: '#e2e8f0' }}>Branch B</strong> ({branches.coupled.label}) forces
        the moving exponent {branches.coupled.kappaOfH}, and the exact height-cancellation
        H<sup>-kappa(H)</sup>&nbsp;=&nbsp;exp(-4/3)&nbsp;=&nbsp;{branches.coupled.heightCancellation}
        pins the only decay lever to a constant, so the honest tail{' '}
        <strong style={{ color: '#e2e8f0' }}>{branches.coupled.closedForm}</strong> grows with slope{' '}
        {branches.coupled.slopePerLogH} per unit of log H instead of shrinking.
      </p>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.6rem 0.9rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.78rem',
          color: '#94a3b8',
          fontFamily: 'monospace',
        }}
      >
        {heightCancellationIdentity}
      </div>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Branch B: the honest moving tail along the N-coupled height ladder
      </h3>
      <MovingTailTable rows={movingTailTable} frozenFloor={branches.frozen.E_trunc} />

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
        <strong style={{ color: '#94a3b8' }}>Reading the table:</strong> the power factor
        H<sup>-kappa(H)</sup> is pinned at exp(-4/3)&nbsp;=&nbsp;0.263597 for every height on the
        ladder &mdash; the height cancels out exactly, so the only remaining H-dependence is the
        growing prefactor. The branch-B tail already exceeds the branch-A floor by several orders of
        magnitude at H&nbsp;=&nbsp;T_PT itself, and keeps climbing as H grows, the opposite of the
        decay a fixed-strip route would need.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96190
        baked branches and moving-tail table verbatim (no re-derivation). Changes no bound, establishes
        no operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
