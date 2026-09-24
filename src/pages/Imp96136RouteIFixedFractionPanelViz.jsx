import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96136_ROWS,
  IMP96136_CONTROL_ROWS,
  IMP96136_LAW,
  IMP96136_CAVEAT_BANNER,
} from '../data/imp-96136-route-i-fixed-fraction-panel-viz-data.js';

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
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke="#64748b"
        strokeWidth={1.5}
      />
      <text x={4} y={padT + 4} fill="#94a3b8" fontSize={10}>
        fraction
      </text>
      <text x={padL + plotW - 60} y={svgH - 6} fill="#94a3b8" fontSize={10}>
        log2(rho) &#8594;
      </text>

      {/* target curve 1 - 1/rho, drawn as connected segments across the sorted rows */}
      <polyline
        fill="none"
        stroke="#f87171"
        strokeWidth={1.5}
        strokeDasharray="5,3"
        points={IMP96136_ROWS.map((r) => `${xOf(Math.log2(r.rho))},${yOf(r.target)}`).join(' ')}
      />
      <text x={padL + 4} y={yOf(0.92)} fill="#f87171" fontSize={9}>
        target 1 - 1/rho
      </text>

      {/* measured f_out points */}
      <polyline
        fill="none"
        stroke="#60a5fa"
        strokeWidth={1}
        strokeDasharray="2,3"
        points={IMP96136_ROWS.map((r) => `${xOf(Math.log2(r.rho))},${yOf(r.fOut)}`).join(' ')}
      />
      {IMP96136_ROWS.map((row) => {
        const x = xOf(Math.log2(row.rho));
        const y = yOf(row.fOut);
        return (
          <g key={row.label}>
            <circle cx={x} cy={y} r={3.5} fill="#facc15" />
            <text x={x} y={y - 8} fill="#facc15" fontSize={8} textAnchor="middle">
              {row.fOut.toFixed(3)}
            </text>
            <text x={x} y={svgH - padB + 16} fill="#64748b" fontSize={8} textAnchor="middle">
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
            stroke="#34d399"
            strokeWidth={1.5}
          />
        );
      })}
      <text x={padL + 4} y={yOf(0.84)} fill="#34d399" fontSize={9}>
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
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96136_CAVEAT_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP96136_LAW}. Measured f_out (yellow points / blue dotted line) tracks the target
        1 - 1/rho (red dashed line) at every {'{oo,2,3}'} S-unit cusp rho = 2^a 3^b, and the same
        law holds independently at the pure-p=2 control points (green rings, rho = 2, 4, 8) --
        11 distinct rho values in all, spanning both the mixed and single-prime allocations.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        f_out(rho) vs 1 - 1/rho across the S-units
      </h3>
      <FixedFractionChart />

      <table
        style={{
          width: '100%',
          fontSize: '0.78rem',
          color: '#cbd5e1',
          borderCollapse: 'collapse',
          marginTop: '1.25rem',
        }}
      >
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>S-unit rho</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>measured f_out</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>target 1 - 1/rho</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>deficit</th>
          </tr>
        </thead>
        <tbody>
          {IMP96136_ROWS.map((row) => (
            <tr key={row.label} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{row.label}</td>
              <td style={{ textAlign: 'right', color: '#60a5fa' }}>{row.fOut.toFixed(6)}</td>
              <td style={{ textAlign: 'right', color: '#f87171' }}>{row.target.toFixed(6)}</td>
              <td style={{ textAlign: 'right' }}>{row.deficit.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        pure-p=2 control (rho = 2, 4, 8): same law from a single-prime allocation
      </h3>
      <table
        style={{
          width: '100%',
          fontSize: '0.78rem',
          color: '#cbd5e1',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>rho</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>measured f_out</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>target 1 - 1/rho</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>deficit</th>
          </tr>
        </thead>
        <tbody>
          {IMP96136_CONTROL_ROWS.map((row) => (
            <tr key={row.label} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{row.label}</td>
              <td style={{ textAlign: 'right', color: '#34d399' }}>{row.fOut.toFixed(6)}</td>
              <td style={{ textAlign: 'right', color: '#f87171' }}>{row.target.toFixed(6)}</td>
              <td style={{ textAlign: 'right' }}>{row.deficit.toFixed(6)}</td>
            </tr>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page rendering the frozen
        imp-96110 ten-point {'{oo,2,3}'} S-unit table verbatim (no re-derivation). The
        fixed-fraction law survives and generalizes the p = 2 half-cusp allocation, but this is
        an obstruction (dense log^2 cusps), not a rescue -- the compact-Toeplitz foothold is lost
        through cusp density and order. Supplies no new bound, establishes no operator
        positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
