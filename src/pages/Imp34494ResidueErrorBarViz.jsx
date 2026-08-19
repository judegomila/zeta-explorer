import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34494_LADDER,
  IMP34494_OUTLIERS,
  IMP34494_ERROR_BAND,
  IMP34494_SHIFTS,
} from '../data/imp-34494-residue-error-bar-viz-data.js';

// Residue values in units of 1e-8 for a readable axis: quad/cubic/quartic ladder points shaded
// inside the measured error band, with the two excluded rung-swap outliers marked OUTSIDE it.
const SCALE = 1e8;
const ALL_POINTS = [...IMP34494_LADDER, ...IMP34494_OUTLIERS];

function ResidueErrorBarChart() {
  const svgW = 680;
  const svgH = 220;
  const padL = 60;
  const padR = 60;
  const padT = 60;
  const padB = 60;
  const cW = svgW - padL - padR;
  const axisY = padT + (svgH - padT - padB) / 2;

  const values = ALL_POINTS.map((p) => p.residue * SCALE);
  const bandMin = IMP34494_ERROR_BAND.min * SCALE;
  const bandMax = IMP34494_ERROR_BAND.max * SCALE;
  const domainMin = Math.min(...values) - 0.08;
  const domainMax = Math.max(...values) + 0.08;
  const xAt = (v) => padL + ((v - domainMin) / (domainMax - domainMin)) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* measured error band */}
      <rect
        x={xAt(bandMin)}
        y={padT}
        width={xAt(bandMax) - xAt(bandMin)}
        height={svgH - padT - padB}
        fill="rgba(56,189,248,0.12)"
        stroke="#38bdf8"
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <text x={(xAt(bandMin) + xAt(bandMax)) / 2} y={padT - 12} textAnchor="middle" fill="#38bdf8" fontSize={9.5}>
        measured band &plusmn;{(IMP34494_ERROR_BAND.rel * 100).toFixed(2)}%
      </text>

      {/* shared axis */}
      <line x1={padL} y1={axisY} x2={padL + cW} y2={axisY} stroke="#334155" strokeWidth={1.5} />

      {/* ladder points: quad -> cubic -> quartic, inside the band */}
      {IMP34494_LADDER.map((p, i) => (
        <g key={p.key}>
          <line x1={xAt(p.residue * SCALE)} y1={axisY - 6} x2={xAt(p.residue * SCALE)} y2={axisY + 6} stroke="#e2e8f0" strokeWidth={1.5} />
          <circle cx={xAt(p.residue * SCALE)} cy={axisY} r={5} fill="#4ade80" stroke="#0a0f1a" strokeWidth={1} />
          <text
            x={xAt(p.residue * SCALE)}
            y={i % 2 === 0 ? axisY - 16 : axisY + 26}
            textAnchor="middle"
            fill="#cbd5e1"
            fontSize={9}
          >
            {p.label}
          </text>
          <text
            x={xAt(p.residue * SCALE)}
            y={i % 2 === 0 ? axisY - 5 : axisY + 37}
            textAnchor="middle"
            fill="#64748b"
            fontSize={8}
            fontFamily="monospace"
          >
            {p.residue.toExponential(5)}
          </text>
        </g>
      ))}

      {/* excluded rung-swap outliers, outside the band */}
      {IMP34494_OUTLIERS.map((p) => (
        <g key={p.key}>
          <line
            x1={xAt(p.residue * SCALE) - 5}
            y1={axisY - 5}
            x2={xAt(p.residue * SCALE) + 5}
            y2={axisY + 5}
            stroke="#f87171"
            strokeWidth={2}
          />
          <line
            x1={xAt(p.residue * SCALE) - 5}
            y1={axisY + 5}
            x2={xAt(p.residue * SCALE) + 5}
            y2={axisY - 5}
            stroke="#f87171"
            strokeWidth={2}
          />
          <text x={xAt(p.residue * SCALE)} y={padB + 12} textAnchor="middle" fill="#f87171" fontSize={9}>
            excluded: {p.label}
          </text>
          <text
            x={xAt(p.residue * SCALE)}
            y={svgH - padB + 24}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={8}
            fontFamily="monospace"
          >
            {p.residue.toExponential(5)}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={10}>
        residue R at k* (units of 1e-8)
      </text>
    </svg>
  );
}

export default function Imp34494ResidueErrorBarViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Measured Residue Error Bar: Nested Quad/Cubic/Quartic Re-Reads at k* (imp-34494 / imp-34449)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34449 converted the imp-34397 heuristic ~1-2% residue caveat into a measured error bar
        by extending the 3-rung local quadratic through the imp-34237 rungs nearest the pole k* to
        a 4-rung cubic and 5-rung quartic. The three successive re-reads land inside a
        &plusmn;{(IMP34494_ERROR_BAND.rel * 100).toFixed(2)}% band around R&nbsp;=&nbsp;
        {IMP34494_ERROR_BAND.central.toExponential(3)}, with the order-by-order shift shrinking
        from {(IMP34494_SHIFTS.quadToCubic * 100).toFixed(2)}% to{' '}
        {(IMP34494_SHIFTS.quadToQuartic * 100).toFixed(2)}% -- the signature of a converging
        Taylor sequence. No viz existed for this measurement; this page also plots the two
        rung-SWAP outliers imp-34449 flagged (F4) and excluded, which land well outside the band.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        residue ladder (valid nested re-reads) vs excluded rung-swap outliers, shared axis
      </p>
      <ResidueErrorBarChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>re-read</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residue R</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>status</th>
          </tr>
        </thead>
        <tbody>
          {ALL_POINTS.map((p) => (
            <tr key={p.key} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{p.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.residue.toExponential(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem', color: p.valid ? '#4ade80' : '#f87171' }}>
                {p.valid ? 'valid nested re-read' : 'excluded (rung swap)'}
              </td>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> Viz-data only, the ladder and
        error band reused verbatim from imp-34449; the two outliers independently re-derived here
        by the same Newton divided-difference method on the same imp-34237 rows (not copied from
        the imp-34449 doc-comment). Surrogate finite-difference re-read, NOT a rigorous asymptotic;
        the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; no RH verdict, NO QED.
        Platt-Trudgian Lambda&le;0.2 remains SOTA.
      </div>
    </div>
  );
}
