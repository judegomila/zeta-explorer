import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34499_RUNG_ROWS,
  IMP34499_SLOPE_SPREAD_PCT,
  IMP34499_KSTAR,
} from '../data/imp-34499-bridge-slope-three-rung-viz-data.js';

// Horizontal bar chart: the three bridge-slope m reads, all negative, landing in an ~8.4% band.
function SlopeBandBars() {
  const svgW = 680;
  const svgH = 190;
  const padL = 150;
  const padR = 90;
  const padT = 20;
  const padB = 20;
  const rowH = 44;
  const cW = svgW - padL - padR;

  const values = IMP34499_RUNG_ROWS.map((r) => Math.abs(r.mSlope));
  const vMin = Math.min(...values);
  const vMax = Math.max(...values);
  const scaleMax = vMax * 1.12;
  const xAt = (v) => padL + (v / scaleMax) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={16} fill="#94a3b8" fontSize={10.5} fontWeight={700}>
        |m| bridge-slope read at each rung (all negative; band width &asymp; {IMP34499_SLOPE_SPREAD_PCT.toFixed(2)}%)
      </text>
      {IMP34499_RUNG_ROWS.map((r, i) => {
        const y = padT + 20 + i * rowH;
        const w = xAt(Math.abs(r.mSlope)) - padL;
        return (
          <g key={r.key}>
            <text x={padL - 10} y={y + rowH / 2 - 6} textAnchor="end" fill="#94a3b8" fontSize={10}>
              {r.label}
            </text>
            <text x={padL - 10} y={y + rowH / 2 + 8} textAnchor="end" fill="#64748b" fontSize={9}>
              k = {r.k}
            </text>
            <rect x={padL} y={y} width={Math.max(w, 1)} height={rowH - 14} fill={r.color} rx={3} />
            <text x={padL + w + 8} y={y + (rowH - 14) / 2 + 4} fill={r.color} fontSize={10.5} fontFamily="monospace">
              m = {r.mSlope.toExponential(4)}
            </text>
          </g>
        );
      })}
      {/* dashed band marking the min/max spread across the three reads */}
      <line
        x1={xAt(vMin)}
        y1={padT + 8}
        x2={xAt(vMin)}
        y2={padT + 20 + 3 * rowH - 8}
        stroke="#64748b"
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <line
        x1={xAt(vMax)}
        y1={padT + 8}
        x2={xAt(vMax)}
        y2={padT + 20 + 3 * rowH - 8}
        stroke="#64748b"
        strokeWidth={1}
        strokeDasharray="3,3"
      />
    </svg>
  );
}

// Small table: coefficient R and exponent p read at each rung, showing R1=R2 exact, R3 offset,
// and p pinned to ~1 (coefficient-independent) at all three.
function CoefficientExponentTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '6px 10px', color: '#94a3b8' }}>rung</th>
          <th style={{ textAlign: 'right', padding: '6px 10px', color: '#94a3b8' }}>k</th>
          <th style={{ textAlign: 'right', padding: '6px 10px', color: '#94a3b8' }}>coeff R = E_star/m</th>
          <th style={{ textAlign: 'right', padding: '6px 10px', color: '#94a3b8' }}>exponent p</th>
        </tr>
      </thead>
      <tbody>
        {IMP34499_RUNG_ROWS.map((r) => (
          <tr key={r.key} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
            <td style={{ padding: '6px 10px', color: r.color, fontWeight: 700 }}>{r.label}</td>
            <td style={{ padding: '6px 10px', textAlign: 'right', color: '#cbd5e1', fontFamily: 'monospace' }}>
              {r.k}
            </td>
            <td style={{ padding: '6px 10px', textAlign: 'right', color: '#cbd5e1', fontFamily: 'monospace' }}>
              {r.coeffR.toExponential(4)}
            </td>
            <td style={{ padding: '6px 10px', textAlign: 'right', color: '#cbd5e1', fontFamily: 'monospace' }}>
              {r.exponentP.toFixed(4)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp34499BridgeSlopeThreeRungViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Bridge-Slope Three-Rung Table (imp-34499 / imp-34454)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34454 tabulated the imp-34398 bridge quantity -- the resid_exp local slope m near the
        simple zero k* &asymp; {IMP34499_KSTAR} -- three ways: a near-zero bisected slope, the
        leading monomial's own flank-canonical prediction, and imp-34310's independently measured
        flank ratio. The three reads land in an &asymp;{IMP34499_SLOPE_SPREAD_PCT.toFixed(2)}% band,
        while the coefficient R&nbsp;=&nbsp;E_star/m and the exponent p&nbsp;=&nbsp;&minus;1 are two
        readings of the ONE leading Laurent monomial. No viz existed for this table.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        the bridge-slope reads across three rungs
      </p>
      <SlopeBandBars />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.75rem', marginBottom: '0.5rem' }}>
        coefficient R and exponent p at each rung
      </p>
      <CoefficientExponentTable />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> Viz-data only, the three-rung
        table is reused verbatim from imp-34454. Measurement only within the inherited
        imp-3220/imp-3406 component model, NOT a rigorous asymptotic; C_mb GUE-conditional per
        imp-486 UNTOUCHED; changes no bound; no RH verdict, NO QED. Platt-Trudgian Lambda&le;0.2
        remains SOTA.
      </div>
    </div>
  );
}
