import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP3375_ROWS, IMP3375_ALL_INTERLOPER_FREE, IMP3375_MIN_CLEARANCE_OVERALL } from '../data/imp-3375-interloper-margin-viz-data.js';
import { ED } from '../styles/tokens.js';

const ROW_COLORS = [ED.series1, ED.series5, ED.series7];

function LineChart({ rows, valueKey, yMax, yTicks, yLabel, refLine }) {
  const svgW = 620;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const xS = (frac) => padL + frac * cW;
  const yS = (v) => padT + cH * (1 - v / yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={xS(f)} y1={padT} x2={xS(f)} y2={padT + cH} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={xS(f)} y={padT + cH + 15} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {f.toFixed(2)}
          </text>
        </g>
      ))}

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.5} />
          <text x={padL - 8} y={yS(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {refLine != null && (
        <>
          <line x1={padL} y1={yS(refLine)} x2={padL + cW} y2={yS(refLine)} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4,3" />
          <text x={padL + cW - 4} y={yS(refLine) - 5} textAnchor="end" fill={ED.brass} fontSize={9}>
            {refLine}
          </text>
        </>
      )}

      {rows.map((r, i) => {
        const clamped = r.trajectory.map((p) => ({ ...p, v: Math.min(p[valueKey], yMax) }));
        const path = clamped.map((p, k) => (k === 0 ? 'M' : 'L') + xS(p.frac).toFixed(1) + ',' + yS(p.v).toFixed(1)).join(' ');
        return <path key={r.id} d={path} fill="none" stroke={ROW_COLORS[i]} strokeWidth={1.5} />;
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        fraction of flow elapsed toward collapse (s / s_total)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        {yLabel}
      </text>
    </svg>
  );
}

function Legend({ rows }) {
  return (
    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '0.5rem', fontSize: '0.78rem' }}>
      {rows.map((r, i) => (
        <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--ink-soft)' }}>
          <span style={{ width: 12, height: 3, background: ROW_COLORS[i], display: 'inline-block' }} />
          {r.label} (Theta(0)={r.measuredTheta0})
        </div>
      ))}
    </div>
  );
}

function RowTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>row</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>Theta(0)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>peak rho = rho(0)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>min clearance d_1/g</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>interloper events</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.id} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem', color: ROW_COLORS[i] }}>{r.label}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.measuredTheta0}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.rho0.toFixed(4)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.minClearance.toFixed(4)}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.interloperEvents}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp3375InterloperMarginViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Corollary A1 Interloper Margin: rho(s) and Neighbour Clearance (imp-3277)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3277 quantified the Corollary A1 adjacency-persistence premise -- that no third
        particle passes through the tracked minimal pair before it collides -- by integrating the
        attractive Coulomb-gas (CM) flow on three isolated-pair models tuned to the measured
        real-zero Theta(0) = 0.1666/0.0884/0.0342 rows. Below: the isolation ratio rho(s) = g/d_1
        (tracked gap over distance to the nearest environment particle) decaying from rho(0) &lt; 1
        toward 0 as the pair collides, and its reciprocal, the neighbour clearance d_1/g, growing
        without bound -- on all three rows, with zero interloper events counted.
      </p>

      <Legend rows={IMP3375_ROWS} />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Isolation ratio rho(s) = g / d_1, decaying toward 0 (reference line at rho = 1)
      </p>
      <LineChart rows={IMP3375_ROWS} valueKey="rho" yMax={0.45} yTicks={[0, 0.1, 0.2, 0.3, 0.4]} yLabel="rho(s) = g / d_1" refLine={null} />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Neighbour clearance d_1/g = 1/rho, growing without bound (clamped display ceiling shown as flat top)
      </p>
      <LineChart rows={IMP3375_ROWS} valueKey="clearance" yMax={10} yTicks={[0, 2, 4, 6, 8, 10]} yLabel="clearance d_1 / g" refLine={1} />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Per-row summary
      </p>
      <RowTable rows={IMP3375_ROWS} />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> each line is one of the
        three real-zero rows, re-integrated (RK4) along the same attractive CM flow imp-3277 used,
        sampled at {IMP3375_ROWS[0].trajectory.length} evenly-spaced fractions of the flow's total
        elapsed time toward collapse. rho(s) starts at rho(0) = peak rho (0.385/0.271/0.162 across
        the rows) and falls monotonically; the reciprocal clearance line is clamped at a display
        ceiling of 10 once it exceeds that (the true value keeps growing as the pair converges).
        Zero environment particles were ever counted inside the tracked open interval on any row
        (interloper events = {IMP3375_ROWS.map((r) => r.interloperEvents).join('/')}), and clearance
        never dropped below {IMP3375_MIN_CLEARANCE_OVERALL.toFixed(2)} -- all interloper-free
        ({String(IMP3375_ALL_INTERLOPER_FREE)}).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only, measure-only
        -- this visualizes an independent re-integration of the imp-3277 finding on three isolated-
        pair models tuned to measured Theta(0) values; it establishes no theorem and no
        unconditional claim beyond the tested rows. RH-equivalent, necessary-but-not-sufficient. No QED.
      </div>
    </div>
  );
}
