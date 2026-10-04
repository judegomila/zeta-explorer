import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95737_HALF_RETENTION_SCALE_ROWS,
  IMP95737_CAPTION,
} from '../data/imp-95737-half-retention-scale-viz-data.js';
import { ED } from '../styles/tokens.js';

const ROWS = IMP95737_HALF_RETENTION_SCALE_ROWS;

const SERIES = [
  { key: 'DpredFull', label: 'Full-sum closed form (root of S(delta,D)=blockIso/2)', color: ED.series1 },
  { key: 'Dlog', label: 'Leading-log closed form (explicit)', color: ED.brass },
  { key: 'Dtrue40', label: 'True 40-pair crossover', color: ED.series5 },
  { key: 'tabulated', label: 'imp-95693 tabulated', color: ED.series3 },
];

// Small delta-axis chart: four deltas (ln1.2..ln2.0), each carrying the
// full-sum root, the explicit leading-log form, the true 40-pair crossover,
// and the imp-95693 tabulated value -- all nearly coincident, illustrating
// how tightly the derived closed forms track the tabulated D_cross.
function HalfRetentionChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 240;
  const svgH = padT + plotH + padB;

  const xMin = ROWS[0].delta;
  const xMax = ROWS[ROWS.length - 1].delta;
  const xOf = (delta) => padL + ((delta - xMin) / (xMax - xMin)) * plotW;

  const allY = ROWS.flatMap((r) => SERIES.map((s) => r[s.key]));
  const yMax = Math.ceil(Math.max(...allY) * 20) / 20;
  const yMin = Math.floor(Math.min(...allY) * 20) / 20;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const yTicks = [];
  for (let t = yMin; t <= yMax + 1e-9; t += 0.1) yTicks.push(Math.round(t * 100) / 100);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <g key={`yt-${t}`}>
          <line x1={padL} x2={padL + plotW} y1={yOf(t)} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {ROWS.map((r) => (
        <text key={`xt-${r.label}`} x={xOf(r.delta)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {r.label}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        delta (in-pair gap)
      </text>

      {SERIES.map((s) => (
        <polyline
          key={s.key}
          fill="none"
          stroke={s.color}
          strokeWidth={2}
          points={ROWS.map((r) => `${xOf(r.delta)},${yOf(r[s.key])}`).join(' ')}
        />
      ))}
      {SERIES.map((s) =>
        ROWS.map((r) => (
          <circle key={`${s.key}-${r.label}`} cx={xOf(r.delta)} cy={yOf(r[s.key])} r={2.5} fill={s.color} />
        )),
      )}
    </svg>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
      {SERIES.map((s) => (
        <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: 12, height: 3, background: s.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--ink-soft)', fontSize: '0.78rem' }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Imp95737HalfRetentionScaleViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Half-Retention Gap D_cross(delta): Closed Form vs Tabulated (imp-95703 / imp-95737)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95693 tabulated a near-fixed absolute half-retention gap D_cross ~ 3.6-4.0
        of the twin-pair block floor across a 3.8x delta range, without deriving it.
        imp-95703 derives D_cross as the root of a single-sum seam-symbol equation
        S(delta, D_cross) = blockIso&#47;2, plus an explicit leading-log closed form.
        This chart and table compare both closed forms against the true 40-pair
        crossover and the original tabulated values.
      </p>

      <HalfRetentionChart />
      <Legend />

      <table style={{ width: '100%', marginTop: '1.5rem', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>delta</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>blockIso</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>D_pred (full sum)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>D_log (leading-log)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>D_true (40-pair)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>tabulated</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.blockIso.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.DpredFull.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.Dlog.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.Dtrue40.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.tabulated.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95737_CAPTION} Derivation of
        an already-observed constant of the imp-95659&#47;imp-95693 twin-pair mechanism; model
        seam family only; changes no Lambda bound; NO QED; Platt-Trudgian Lambda &lt;= 0.2
        remains SOTA.
      </div>
    </div>
  );
}
