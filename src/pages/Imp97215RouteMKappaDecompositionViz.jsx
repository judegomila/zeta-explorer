import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97130_LADDER_ROWS,
  IMP97130_DECOMPOSITION_BARS,
  IMP97130_VERDICT,
} from '../data/imp-97130-route-m-kappa-decomposition-viz-data.js';

// imp-97215: the imp-97130 viz-data leaf (kappa = kappa_arith + kappa_cot decomposition) had no
// chart consumer yet. This page renders the two component convergence ladders (arithmetic part
// drifting DOWN to its exact limit, cotangent part climbing UP to its measured limit) side by
// side, plus the final three-bar stacked decomposition (arith EXACT + cot MEASURED = total).

const COMPONENT_COLOR = {
  arith: '#4ade80',
  cot: '#38bdf8',
};

function LadderChart({ rows }) {
  const svgW = 680;
  const svgH = 300;
  const padL = 60;
  const padR = 30;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const bs = rows.map((r) => r.b);
  const vals = rows.map((r) => r.value);
  const minB = Math.min(...bs);
  const maxB = Math.max(...bs);
  const minV = Math.min(...vals) - 0.03;
  const maxV = Math.max(...vals) + 0.03;

  const xAt = (b) => padL + ((Math.log10(b) - Math.log10(minB)) / (Math.log10(maxB) - Math.log10(minB))) * cW;
  const yAt = (v) => padT + cH - ((v - minV) / (maxV - minV)) * cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={svgW - padR} y={svgH - padB + 28} textAnchor="end" fill="#64748b" fontSize={9.5} fontFamily="monospace">
        log10 b &rarr;
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={9.5}
        fontFamily="monospace"
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        value
      </text>
      {['arith', 'cot'].map((comp) => {
        const compRows = rows
          .filter((r) => r.component === comp)
          .slice()
          .sort((a, b) => a.b - b.b);
        const pts = compRows.map((r) => `${xAt(r.b)},${yAt(r.value)}`).join(' ');
        return (
          <g key={comp}>
            <polyline points={pts} fill="none" stroke={COMPONENT_COLOR[comp]} strokeWidth={2} />
            {compRows.map((r) => (
              <g key={`${comp}-${r.b}`}>
                <circle cx={xAt(r.b)} cy={yAt(r.value)} r={5} fill={COMPONENT_COLOR[comp]} opacity={0.9} />
                <text
                  x={xAt(r.b)}
                  y={yAt(r.value) - 9}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize={8.5}
                  fontFamily="monospace"
                >
                  b={r.b}
                </text>
              </g>
            ))}
          </g>
        );
      })}
      <g transform={`translate(${padL + 10}, ${padT + 4})`}>
        <circle cx={0} cy={0} r={5} fill={COMPONENT_COLOR.arith} />
        <text x={10} y={4} fill="#e2e8f0" fontSize={9.5} fontFamily="monospace">
          arith (a&gt;=2, drifts down to exact)
        </text>
        <circle cx={0} cy={16} r={5} fill={COMPONENT_COLOR.cot} />
        <text x={10} y={20} fill="#e2e8f0" fontSize={9.5} fontFamily="monospace">
          cot (varying-modulus, climbs up to measured)
        </text>
      </g>
    </svg>
  );
}

function DecompositionBars({ bars }) {
  const svgW = 640;
  const rowH = 44;
  const padL = 170;
  const padR = 90;
  const padT = 16;
  const svgH = padT + bars.length * rowH + 16;
  const cW = svgW - padL - padR;
  const maxVal = Math.max(...bars.map((b) => b.value));
  const xAt = (v) => (v / maxVal) * cW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {bars.map((bar, idx) => {
        const y = padT + idx * rowH;
        const w = Math.max(4, xAt(bar.value));
        return (
          <g key={bar.key}>
            <text x={padL - 8} y={y + rowH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={10} fontFamily="monospace">
              {bar.label}
            </text>
            <rect x={padL} y={y + 8} width={cW} height={rowH - 20} fill="#1e293b" rx={3} />
            <rect x={padL} y={y + 8} width={w} height={rowH - 20} fill={bar.color} rx={3} />
            <text x={padL + w + 6} y={y + rowH / 2 + 4} fill="#e2e8f0" fontSize={9.5} fontFamily="monospace">
              {bar.value.toFixed(6)} ({bar.flag})
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97215RouteMKappaDecompositionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Kappa Decomposition: Arithmetic + Cotangent" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.06)',
          borderLeft: '3px solid #64748b',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#e2e8f0' }}>Honest status:</strong> {IMP97130_VERDICT.note}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        Convergence ladders for the two kappa components against b (log axis). The arithmetic
        part (green) is EXACT in the limit and drifts monotonically down toward it; the
        cotangent part (blue) is MEASURED and climbs monotonically up toward its own limit.
      </p>
      <LadderChart rows={IMP97130_LADDER_ROWS} />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '1.25rem 0 0.5rem', maxWidth: 700 }}>
        Final three-bar decomposition: exact arithmetic part + measured cotangent part = measured
        total kappa.
      </p>
      <DecompositionBars bars={IMP97130_DECOMPOSITION_BARS} />

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> kappa_total &asymp;{' '}
        {IMP97130_VERDICT.kappaTotal.toFixed(4)}, positive but MEASURED not proved. Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
