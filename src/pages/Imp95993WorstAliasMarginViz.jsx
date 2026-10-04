import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95993_A1,
  IMP95993_MARGIN_ROWS,
  IMP95993_CAVEAT_BANNER,
} from '../data/imp-95993-worst-alias-margin-viz-data.js';
import { ED } from '../styles/tokens.js';

// dMin (Airy clearance threshold, descending) vs dSeam (seam depth, ascending)
// across the four imp-95917 witness windows -- the gap between the two bars is
// the imp-95962 margin.
function WorstAliasMarginChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 20;
  const padT = 30;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 240;
  const svgH = padT + plotH + padB;

  const n = IMP95993_MARGIN_ROWS.length;
  const groupW = plotW / n;
  const barW = groupW * 0.3;

  const yMax = Math.max(...IMP95993_MARGIN_ROWS.map((r) => r.dSeam)) * 1.1;
  const yOf = (v) => padT + plotH - (v / yMax) * plotH;
  const yTicks = [0, 1, 2, 3, 4, 5, 6, 7].filter((t) => t <= yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}

      {IMP95993_MARGIN_ROWS.map((r, i) => {
        const cx = padL + groupW * i + groupW / 2;
        const dMinX = cx - barW - 3;
        const dSeamX = cx + 3;
        return (
          <g key={r.label}>
            <rect
              x={dMinX}
              y={yOf(r.dMin)}
              width={barW}
              height={plotH - (yOf(r.dMin) - padT)}
              fill={ED.series2}
              opacity={0.85}
            />
            <rect
              x={dSeamX}
              y={yOf(r.dSeam)}
              width={barW}
              height={plotH - (yOf(r.dSeam) - padT)}
              fill={ED.series3}
              opacity={0.85}
            />
            <line
              x1={dMinX}
              y1={yOf(r.dMin)}
              x2={dSeamX + barW}
              y2={yOf(r.dMin)}
              stroke={ED.rule}
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
              {r.label}
            </text>
            <text x={cx} y={padT + plotH + 28} textAnchor="middle" fill={ED.series5} fontSize={9}>
              margin {r.margin.toFixed(3)}
            </text>
          </g>
        );
      })}

      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {t}
        </text>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        witness window (p,k)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        collar depth
      </text>

      <rect x={padL + plotW - 150} y={padT - 4} width={9} height={9} fill={ED.series2} opacity={0.85} />
      <text x={padL + plotW - 138} y={padT + 4} fill={ED.inkSoft} fontSize={9}>
        dMin = a_1/mu_ctrl (threshold)
      </text>
      <rect x={padL + plotW - 150} y={padT + 8} width={9} height={9} fill={ED.series3} opacity={0.85} />
      <text x={padL + plotW - 138} y={padT + 16} fill={ED.inkSoft} fontSize={9}>
        dSeam (seam depth)
      </text>
    </svg>
  );
}

export default function Imp95993WorstAliasMarginViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Worst-Alias Collar-Depth Margin vs k (imp-95962 / imp-95993)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP95993_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        At each imp-95917 witness window, the Fresnel-Airy sign obligation K_k &ge; 0 needs a
        collar depth d &ge; a_1/mu at the controlling (smallest-mu) alias, first Airy zero
        magnitude a_1&nbsp;=&nbsp;{IMP95993_A1.toFixed(6)}. imp-95962 measured that threshold
        (dMin) exactly and compared it to the alias own seam depth (dSeam). Across the four
        witness windows (3,4)&nbsp;&hellip;&nbsp;(11,7), dMin falls while dSeam rises, so the
        margin dSeam&nbsp;&minus;&nbsp;dMin grows monotonically.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        dMin (threshold, red) vs dSeam (seam depth, green) per window
      </h3>
      <WorstAliasMarginChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>window (p,k)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>ctrl h</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>mu_ctrl</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>dMin = a_1/mu</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>dSeam</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>margin</th>
          </tr>
        </thead>
        <tbody>
          {IMP95993_MARGIN_ROWS.map((r) => (
            <tr key={r.label} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.label}</td>
              <td style={{ textAlign: 'right' }}>{r.ctrlH}</td>
              <td style={{ textAlign: 'right' }}>{r.muCtrl.toFixed(6)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-2)' }}>{r.dMin.toFixed(6)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-3)' }}>{r.dSeam.toFixed(6)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-5)' }}>{r.margin.toFixed(6)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page rendering the frozen
        imp-95962 measurement verbatim (no re-derivation). Supplies no new bound, establishes no
        operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA.
        NO QED.
      </div>
    </div>
  );
}
