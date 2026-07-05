import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34255_WINDOW_LADDER_ROWS,
  IMP34255_KEND_LEADING_CLOSED_FORM,
  IMP34255_KEND_BISECTED_W1,
  IMP34255_LEADING_GAP,
  IMP34255_E_AT_CROSSING,
  IMP34255_ED_AT_CROSSING,
} from '../data/imp-34255-m2-ceiling-window-width-divergence-viz-data.js';

// The bisected kEnd*(w) ladder DIVERGES as the fitting window narrows -- no w -> 0 limit.
function WindowLadderChart() {
  const svgW = 680;
  const svgH = 280;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 0;
  const maxX = 1.05;
  const minY = 21.0;
  const maxY = 24.2;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const path = IMP34255_WINDOW_LADDER_ROWS.map((r) => `${xAt(r.wDecades)},${yAt(r.kEndStar)}`).join(' ');
  const xTicks = [0.125, 0.25, 0.5, 0.75, 1.0];
  const yTicks = [21, 21.5, 22, 22.5, 23, 23.5, 24];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      {xTicks.map((w) => (
        <g key={'x' + w}>
          <line x1={xAt(w)} y1={padT + cH - 4} x2={xAt(w)} y2={padT + cH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xAt(w)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {w}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        w (window width, decades)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        bisected kEnd*(w)
      </text>

      <line
        x1={xAt(1.0)}
        y1={yAt(IMP34255_KEND_LEADING_CLOSED_FORM)}
        x2={padL + cW}
        y2={yAt(IMP34255_KEND_LEADING_CLOSED_FORM)}
        stroke="#f87171"
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yAt(IMP34255_KEND_LEADING_CLOSED_FORM) - 5} textAnchor="end" fill="#f87171" fontSize={9}>
        leading closed form 21.00 (full decade)
      </text>

      <polyline points={path} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {IMP34255_WINDOW_LADDER_ROWS.map((r) => (
        <circle
          key={'pt' + r.wDecades}
          cx={xAt(r.wDecades)}
          cy={yAt(r.kEndStar)}
          r={3.5}
          fill="#c4b5fd"
          stroke="#0a0f1a"
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

export default function Imp34255M2CeilingWindowWidthDivergenceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="M2-Ceiling Window-Width Divergence Ladder (imp-34255 / imp-34189)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34189 showed that the bisected imp-34023 M2-residual sign-change crossing kEnd*(w) has
        NO w &rarr; 0 limit: it rises monotonically as the fitting window narrows, from{' '}
        {IMP34255_WINDOW_LADDER_ROWS[0].kEndStar.toFixed(3)} at a full decade (w=1) up to{' '}
        {IMP34255_WINDOW_LADDER_ROWS[IMP34255_WINDOW_LADDER_ROWS.length - 1].kEndStar.toFixed(2)} at
        w=1/8. The imp-34127 leading closed form ({IMP34255_KEND_LEADING_CLOSED_FORM.toFixed(2)}) is
        itself a full-decade reading that sits {IMP34255_LEADING_GAP.toFixed(3)} below the w=1
        bisected value ({IMP34255_KEND_BISECTED_W1.toFixed(3)}), because the expansion parameter
        e&middot;D &asymp; {IMP34255_ED_AT_CROSSING.toFixed(2)} at the crossing (e &asymp;{' '}
        {IMP34255_E_AT_CROSSING.toFixed(2)}) is O(1), not small.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        bisected kEnd*(w) diverging as the fitting window narrows -- no continuous w &rarr; 0 limit
      </p>
      <WindowLadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>w (decades)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>bisected kEnd*(w)</th>
          </tr>
        </thead>
        <tbody>
          {IMP34255_WINDOW_LADDER_ROWS.map((r) => (
            <tr key={r.wDecades} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.wDecades}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.kEndStar.toFixed(3)}</td>
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> Viz-data only, baked literals
        reproducing the imp-34189 measurement; no new derivation, no bound changed. Descriptive
        surrogate/fit, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED;
        imp-3066 K_a&ge;0 untouched; NO QED; Platt-Trudgian Lambda&le;0.2 remains SOTA.
      </div>
    </div>
  );
}
