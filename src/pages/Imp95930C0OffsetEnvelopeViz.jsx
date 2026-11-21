import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95930_OFFSET_ROWS,
  IMP95930_ENVELOPE_BAND,
  IMP95930_CAVEAT_BANNER,
} from '../data/imp-95930-c0-offset-envelope-panel-viz-data.js';
import { ED } from '../styles/tokens.js';

// scatter of offset(T) vs log T, with the interior max (C0 anchor) highlighted
// and a horizontal band showing the r_cap(3e12) envelope drop if a lower offset
// were substituted for C0.
function OffsetScatterChart() {
  const svgW = 560;
  const svgH = 260;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logTs = IMP95930_OFFSET_ROWS.map((r) => r.logT);
  const offsets = IMP95930_OFFSET_ROWS.map((r) => r.offset);
  const minLogT = Math.min(...logTs);
  const maxLogT = Math.max(...logTs);
  const minOffset = Math.min(...offsets) * 0.95;
  const maxOffset = Math.max(...offsets) * 1.05;

  const xOf = (logT) => padL + ((logT - minLogT) / (maxLogT - minLogT)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minOffset) / (maxOffset - minOffset)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />
      <text x={4} y={padT + 4} fill={ED.inkSoft} fontSize={10}>
        offset(T)
      </text>
      <text x={padL + plotW - 40} y={svgH - 4} fill={ED.inkSoft} fontSize={10}>
        log T &#8594;
      </text>

      {IMP95930_OFFSET_ROWS.map((row, i) => {
        const x = xOf(row.logT);
        const y = yOf(row.offset);
        const color = row.isMax ? ED.series2 : ED.series1;
        return (
          <g key={row.Tc}>
            {i > 0 && (
              <line
                x1={xOf(IMP95930_OFFSET_ROWS[i - 1].logT)}
                y1={yOf(IMP95930_OFFSET_ROWS[i - 1].offset)}
                x2={x}
                y2={y}
                stroke={ED.rule}
                strokeWidth={1}
                strokeDasharray="3,3"
              />
            )}
            <circle cx={x} cy={y} r={row.isMax ? 5 : 3.5} fill={color} />
            <text x={x} y={y - 10} fill={color} fontSize={9} textAnchor="middle">
              {row.offset.toFixed(3)}
            </text>
            <text x={x} y={svgH - padB + 14} fill={ED.inkFaint} fontSize={9} textAnchor="middle">
              {row.Tc.toExponential(0)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp95930C0OffsetEnvelopeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="C0 Offset vs log T + r_cap Envelope Band (imp-95897 / imp-95930)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP95930_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95897 envelope-safety assessment tabulated the six accessible finite-height
        offsets (T = 1e4..5e5) and located the envelope anchor C0 (red) at an INTERIOR height
        (1.5e5), then quantified how far r_cap(3e12) moves if a lower offset were substituted.
        This panel renders that table and the resulting envelope band.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        offset(T) across the six accessible heights
      </h3>
      <OffsetScatterChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        r_cap(3e12) envelope band
      </h3>
      <table
        style={{
          width: '100%',
          fontSize: '0.78rem',
          color: 'var(--ink)',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>quantity</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>r_cap(3e12) with C0 = max anchor (envelope-safe)</td>
            <td style={{ textAlign: 'right', color: 'var(--series-2)' }}>
              {IMP95930_ENVELOPE_BAND.rCapMaxAnchor.toFixed(5)}
            </td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>r_cap(3e12) if the accessible min offset were substituted</td>
            <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>
              {IMP95930_ENVELOPE_BAND.rCapMinOffset.toFixed(5)}
            </td>
          </tr>
          <tr style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
            <td style={{ padding: '3px 0' }}>band drop (material margin protecting r_cap &ge; r)</td>
            <td style={{ textAlign: 'right' }}>{IMP95930_ENVELOPE_BAND.bandDrop.toFixed(5)}</td>
          </tr>
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
        imp-95897 six-offset table and envelope band verbatim (no re-derivation). The offset is
        noise-dominated with an interior max, so monotonicity over [3e12, infinity) is UNDECIDED
        by this table alone; see imp-95921 for the superseding analytic bracket. Supplies no new
        bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
