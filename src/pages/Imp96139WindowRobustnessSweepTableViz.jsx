import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP96112_MAX_ANCHOR_MARGIN_WINDOW_ROBUSTNESS } from '../data/imp-96112-max-anchor-margin-window-robustness.js';

function WindowRobustnessTable({ rows }) {
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
          {['config', 'axis', 'k', 'span', 'overlap', 'n_win', 'r(T) measured', 'margin (rel.)'].map((h) => (
            <th key={h} style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.tag} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#e2e8f0' }}>{r.tag}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.axis}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.k}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.span}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.overlap}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.nWin}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.measuredRatio.toFixed(4)}</td>
            <td
              style={{
                textAlign: 'right',
                padding: '0.4rem 0.6rem',
                color: r.caps ? '#64748b' : '#f87171',
                fontWeight: r.caps ? 400 : 600,
              }}
            >
              {r.marginRelPct >= 0 ? '+' : ''}
              {r.marginRelPct.toFixed(1)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp96139WindowRobustnessSweepTableViz() {
  const data = IMP96112_MAX_ANCHOR_MARGIN_WINDOW_ROBUSTNESS;
  const { robustness, target, rows } = data;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="imp-96112: sd(C − E) Window-Robustness Sweep at T = 5e4" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a reader-facing table of the
        imp-96112 measurement, re-running the imp-95562 band() estimator at T&nbsp;=&nbsp;5e4 across a
        12-config sweep of half-width, span and box-overlap to check whether the imp-96090 max-anchor
        cap and its tight +3.0% margin are robust to the window choice. It changes no Lambda bound and
        establishes no operator positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the
        art. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Every config is compared against the FIXED canonical max-anchor envelope r_cap<sup>max</sup>
        (T&nbsp;=&nbsp;5e4)&nbsp;=&nbsp;{target.rCapMax.toFixed(4)} (imp-95722 closed form, window-independent).
        All {robustness.configsTested} swept configs cap ({robustness.capsCount}/{robustness.configsTested}),
        with margin ranging {robustness.marginRangePct.min >= 0 ? '+' : ''}
        {robustness.marginRangePct.min.toFixed(1)}% ({robustness.tightestConfig.tag}) to +
        {robustness.marginRangePct.max.toFixed(1)}% ({robustness.widestConfig.tag}).
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Per-config max-anchor margin at T = 5e4
      </h3>
      <WindowRobustnessTable rows={rows} />

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
        <strong style={{ color: '#94a3b8' }}>Reading the table:</strong> zero of the twelve configs
        breach the max-anchor envelope, so the sign of the margin does not depend on the window choice.
        The finest windows (k&nbsp;=&nbsp;0.5, overlap&nbsp;=&nbsp;0.50) sit near the imp-96090 headline
        +3.0%, while coarser windows (k&nbsp;&ge;&nbsp;1.5, narrow span&nbsp;=&nbsp;0.20) give margins up
        to +51.4%. The tight end tracks resolution, not a fragile anchor choice.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96112
        baked sweep verbatim (no re-derivation). Changes no bound, establishes no operator positivity,
        no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
