import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP124918_WIDE_BRACKET_ROWS,
  IMP124918_DEEP_BRACKET_ROWS,
  IMP124918_SUMMARY,
} from '../data/imp-124918-kernel-ratio-bracket-viz-data.js';
import { ED } from '../styles/tokens.js';

const SQRT10 = IMP124918_WIDE_BRACKET_ROWS[0].sqrt10;

function BracketTable({ title, rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', marginBottom: '1.25rem' }}>
      <caption
        style={{
          captionSide: 'top',
          textAlign: 'left',
          color: 'var(--ink-faint)',
          fontWeight: 700,
          fontSize: '0.82rem',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </caption>
      <thead>
        <tr style={{ borderBottom: `1px solid ${ED.rule}` }}>
          <th style={{ textAlign: 'left', padding: '0.3rem 0.4rem', color: 'var(--ink-faint)' }}>decade</th>
          <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: 'var(--ink-faint)' }}>gap g</th>
          <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: 'var(--ink-faint)' }}>upslope</th>
          <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: 'var(--ink-faint)' }}>downslope</th>
          <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: 'var(--ink-faint)' }}>bracket width</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.decade} style={{ borderBottom: `1px solid ${ED.ruleSoft}` }}>
            <td style={{ padding: '0.3rem 0.4rem', color: 'var(--ink-soft)' }}>{r.decade}</td>
            <td style={{ padding: '0.3rem 0.4rem', textAlign: 'right', color: 'var(--ink-soft)' }}>
              {r.gap.toExponential(0)}
            </td>
            <td style={{ padding: '0.3rem 0.4rem', textAlign: 'right', color: 'var(--ink)' }}>{r.upslope_ratio}</td>
            <td style={{ padding: '0.3rem 0.4rem', textAlign: 'right', color: 'var(--ink)' }}>{r.downslope_ratio}</td>
            <td style={{ padding: '0.3rem 0.4rem', textAlign: 'right', color: 'var(--brass)', fontWeight: 700 }}>
              {r.bracket_width.toExponential(3)}
            </td>
          </tr>
        ))}
        <tr>
          <td style={{ padding: '0.3rem 0.4rem', color: 'var(--ink-faint)', fontStyle: 'italic' }}>sqrt(10)</td>
          <td colSpan={4} style={{ padding: '0.3rem 0.4rem', textAlign: 'right', color: 'var(--ink-faint)' }}>
            {SQRT10}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default function Imp124918KernelRatioBracketViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Kernel Decade-Ratio Bracket: Shared-Axis Overlay (imp-124918)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The imp-124776 (gap-keyed) and imp-97843 (decade-index-keyed) sibling leaves export the same
        reconstruction-kernel |K| per-decade ratio under two different axis framings. Here both are merged
        onto one shared row per decade -- carrying the decade index, the actual gap g, both arm ratios, and a
        bracket_width = |upslope - downslope| column -- so the two-arm bracketing of sqrt(10) = {SQRT10} is
        visible directly as a single shrinking number rather than as two separate tables.
      </p>

      <BracketTable title="wide ladder (far-from-peak running correction regime)" rows={IMP124918_WIDE_BRACKET_ROWS} />
      <BracketTable title="deep window (converging onto sqrt(10) near the peak)" rows={IMP124918_DEEP_BRACKET_ROWS} />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP124918_SUMMARY.verdict}
      </div>
    </div>
  );
}
