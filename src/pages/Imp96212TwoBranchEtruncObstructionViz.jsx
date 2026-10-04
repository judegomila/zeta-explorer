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
        color: 'var(--ink)',
      }}
    >
      <thead>
        <tr style={{ borderBottom: '2px solid var(--rule)' }}>
          {['H', 'log H', 'kappa(H)', 'H^-kappa(H)', 'E_trunc(H) [branch B]', 'vs. branch A floor'].map((h) => (
            <th key={h} style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.H} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink)' }}>{r.H.toExponential(1)}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.logH}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.kappa}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>{r.powerFactor}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--series-2)', fontWeight: 600 }}>
              {r.E_trunc_moving}
            </td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-faint)' }}>
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
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <div style={{ color: 'var(--series-2)', fontWeight: 600, marginBottom: '0.3rem' }}>
          {honestStatusBanner.tier}
        </div>
        <strong style={{ color: 'var(--series-2)' }}>{honestStatusBanner.label}:</strong>{' '}
        {honestStatusBanner.body}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        <strong style={{ color: 'var(--ink)' }}>Branch A</strong> ({branches.frozen.label}) freezes at
        E_trunc&nbsp;=&nbsp;{branches.frozen.E_trunc} &mdash; the imp-96166 floor, N-independent, no
        decay. <strong style={{ color: 'var(--ink)' }}>Branch B</strong> ({branches.coupled.label}) forces
        the moving exponent {branches.coupled.kappaOfH}, and the exact height-cancellation
        H<sup>-kappa(H)</sup>&nbsp;=&nbsp;exp(-4/3)&nbsp;=&nbsp;{branches.coupled.heightCancellation}
        pins the only decay lever to a constant, so the honest tail{' '}
        <strong style={{ color: 'var(--ink)' }}>{branches.coupled.closedForm}</strong> grows with slope{' '}
        {branches.coupled.slopePerLogH} per unit of log H instead of shrinking.
      </p>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.6rem 0.9rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.78rem',
          color: 'var(--ink-soft)',
          fontFamily: 'monospace',
        }}
      >
        {heightCancellationIdentity}
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Branch B: the honest moving tail along the N-coupled height ladder
      </h3>
      <MovingTailTable rows={movingTailTable} frozenFloor={branches.frozen.E_trunc} />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the table:</strong> the power factor
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
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96190
        baked branches and moving-tail table verbatim (no re-derivation). Changes no bound, establishes
        no operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
