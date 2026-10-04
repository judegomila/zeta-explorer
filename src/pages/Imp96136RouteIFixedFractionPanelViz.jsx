import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96136_ROWS,
  IMP96136_CONTROL_ROWS,
  IMP96136_LAW,
  IMP96136_CAVEAT_BANNER,
} from '../data/imp-96136-route-i-fixed-fraction-panel-viz-data.js';
import { ED } from '../styles/tokens.js';

// measured f_out(rho) vs the target 1 - 1/rho across the ten {oo,2,3} S-unit cusps,
// plotted against log2(rho) since the S-units are dense multiplicatively.
function FixedFractionChart() {
  const svgW = 620;
  const svgH = 300;
  const padL = 44;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = IMP96136_ROWS.map((r) => Math.log2(r.rho));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const xOf = (x) => padL + ((x - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - v * plotH; // f_out, target in [0, 1]

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
        fraction
      </text>
      <text x={padL + plotW - 60} y={svgH - 6} fill={ED.inkSoft} fontSize={10}>
        log2(rho) &#8594;
      </text>

      {/* target curve 1 - 1/rho, drawn as connected segments across the sorted rows */}
      <polyline
        fill="none"
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="5,3"
        points={IMP96136_ROWS.map((r) => `${xOf(Math.log2(r.rho))},${yOf(r.target)}`).join(' ')}
      />
      <text x={padL + 4} y={yOf(0.92)} fill={ED.series2} fontSize={9}>
        target 1 - 1/rho
      </text>

      {/* measured f_out points */}
      <polyline
        fill="none"
        stroke={ED.series1}
        strokeWidth={1}
        strokeDasharray="2,3"
        points={IMP96136_ROWS.map((r) => `${xOf(Math.log2(r.rho))},${yOf(r.fOut)}`).join(' ')}
      />
      {IMP96136_ROWS.map((row) => {
        const x = xOf(Math.log2(row.rho));
        const y = yOf(row.fOut);
        return (
          <g key={row.label}>
            <circle cx={x} cy={y} r={3.5} fill={ED.brassDeco} />
            <text x={x} y={y - 8} fill={ED.brass} fontSize={8} textAnchor="middle">
              {row.fOut.toFixed(3)}
            </text>
            <text x={x} y={svgH - padB + 16} fill={ED.inkFaint} fontSize={8} textAnchor="middle">
              {row.label}
            </text>
          </g>
        );
      })}

      {/* pure-p=2 control points (rho = 2, 4, 8): same law, different (isolated) prime set */}
      {IMP96136_CONTROL_ROWS.map((row) => {
        const x = xOf(Math.log2(row.rho));
        const y = yOf(row.fOut);
        return (
          <circle
            key={row.label}
            cx={x}
            cy={y}
            r={3.5}
            fill="none"
            stroke={ED.series3}
            strokeWidth={1.5}
          />
        );
      })}
      <text x={padL + 4} y={yOf(0.84)} fill={ED.series3} fontSize={9}>
        &#9711; control f_out (pure p=2, rho=2/4/8)
      </text>
    </svg>
  );
}

export default function Imp96136RouteIFixedFractionPanelViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I: {oo,2,3} Fixed-Fraction Cusp-Allocation Law (imp-96110 / imp-96136)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96136_CAVEAT_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP96136_LAW}. Measured f_out (yellow points / blue dotted line) tracks the target
        1 - 1/rho (red dashed line) at every {'{oo,2,3}'} S-unit cusp rho = 2^a 3^b, and the same
        law holds independently at the pure-p=2 control points (green rings, rho = 2, 4, 8) --
        11 distinct rho values in all, spanning both the mixed and single-prime allocations.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        f_out(rho) vs 1 - 1/rho across the S-units
      </h3>
      <FixedFractionChart />

      <table
        style={{
          width: '100%',
          fontSize: '0.78rem',
          color: 'var(--ink)',
          borderCollapse: 'collapse',
          marginTop: '1.25rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>S-unit rho</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>measured f_out</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>target 1 - 1/rho</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>deficit</th>
          </tr>
        </thead>
        <tbody>
          {IMP96136_ROWS.map((row) => (
            <tr key={row.label} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{row.label}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>{row.fOut.toFixed(6)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-2)' }}>{row.target.toFixed(6)}</td>
              <td style={{ textAlign: 'right' }}>{row.deficit.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        pure-p=2 control (rho = 2, 4, 8): same law from a single-prime allocation
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
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>rho</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>measured f_out</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>target 1 - 1/rho</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>deficit</th>
          </tr>
        </thead>
        <tbody>
          {IMP96136_CONTROL_ROWS.map((row) => (
            <tr key={row.label} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{row.label}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-3)' }}>{row.fOut.toFixed(6)}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-2)' }}>{row.target.toFixed(6)}</td>
              <td style={{ textAlign: 'right' }}>{row.deficit.toFixed(6)}</td>
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
        imp-96110 ten-point {'{oo,2,3}'} S-unit table verbatim (no re-derivation). The
        fixed-fraction law survives and generalizes the p = 2 half-cusp allocation, but this is
        an obstruction (dense log^2 cusps), not a rescue -- the compact-Toeplitz foothold is lost
        through cusp density and order. Supplies no new bound, establishes no operator
        positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
