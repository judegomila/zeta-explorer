import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3700_SCALE_TABLE,
  IMP3700_K_HALF,
  IMP3700_Y_HALF_OVER_D,
  IMP3700_FLOOR_K1,
  IMP3700_FLOOR_K50,
} from '../data/imp-3700-mesoscopic-shock-scale-separation-viz-data.js';

const FLOOR_COLOR = '#38bdf8';
const HALF_COLOR = '#f59e0b';
const MESO_COLOR = '#34d399';
const REF_COLOR = '#64748b';

function FloorCollapseChart() {
  const svgW = 620;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const kMin = 1;
  const kMax = 50;
  const yMin = Math.log10(IMP3700_FLOOR_K50) - 0.5;
  const yMax = 0.05;

  const xS = (k) => padL + ((k - kMin) / (kMax - kMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const path = IMP3700_SCALE_TABLE.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.k).toFixed(1) + ',' + yS(r.floor).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[1, 10, 20, 30, 40, 50].map((k) => (
        <g key={k}>
          <line x1={xS(k)} y1={padT} x2={xS(k)} y2={padT + cH} stroke="#1e293b" strokeWidth={0.7} />
          <text x={xS(k)} y={padT + cH + 15} textAnchor="middle" fill="#64748b" fontSize={9}>
            {k}
          </text>
        </g>
      ))}

      <line x1={xS(IMP3700_K_HALF)} y1={padT} x2={xS(IMP3700_K_HALF)} y2={padT + cH} stroke={HALF_COLOR} strokeWidth={1.25} strokeDasharray="4,3" />
      <text x={xS(IMP3700_K_HALF) + 4} y={padT + 14} fill={HALF_COLOR} fontSize={9}>
        k~8.76 (floor=1/2)
      </text>

      <path d={path} fill="none" stroke={FLOOR_COLOR} strokeWidth={1.75} />

      {IMP3700_SCALE_TABLE.map((r) => (
        <circle
          key={r.k}
          cx={xS(r.k)}
          cy={yS(r.floor)}
          r={3.5}
          fill={r.k === 1 ? MESO_COLOR : FLOOR_COLOR}
          stroke="#052e1f"
          strokeWidth={1}
        />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={10}>
        k (strip height y = y_star / k, y_star = 4d)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        floor(k) = exp(-k^2 E_meso) (log scale)
      </text>
      <text x={padL + 8} y={padT + 26} fill={MESO_COLOR} fontSize={9}>
        k=1 (y_star=4d): mesoscopic floor {IMP3700_FLOOR_K1.toFixed(3)} (imp-3642)
      </text>
    </svg>
  );
}

function ScaleTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#94a3b8' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>k</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>y / d</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>floor(k)</th>
        </tr>
      </thead>
      <tbody>
        {IMP3700_SCALE_TABLE.map((r) => (
          <tr key={r.k} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{r.k}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.y_over_d}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: FLOOR_COLOR }}>{r.floor.toExponential(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp3700MesoscopicShockScaleSeparationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Mesoscopic-vs-Shock Scale Separation (imp-3671)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3671 assessed whether the imp-3642 mesoscopic density-floor measurement V0(gamma) supplies a
        quantitative Lipschitz modulus for the open Step-4 Polymath15-bridge sub-gap G6a_shock_lipschitz.
        The Gronwall floor exp(-2s/y_star^2) measured at the mesoscopic strip height y_star = 4d is{' '}
        {IMP3700_FLOOR_K1.toFixed(3)} (imp-3642), but writing the strip height as y = y_star / k, the same
        floor collapses as floor_meso^{'{k^2}'} toward the nearest-pair front.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Gronwall floor(k) collapsing from mesoscopic (k=1, 0.991) toward the nearest-pair scale (k=50, ~1.5e-10)
      </p>
      <FloorCollapseChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Measured rungs
      </p>
      <ScaleTable />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the mesoscopic reading (green
        marker, k=1) sits at floor {IMP3700_FLOOR_K1.toFixed(3)}, essentially trivial contraction. The floor
        crosses 1/2 already at k ~ {IMP3700_K_HALF.toFixed(2)} (strip height ~{IMP3700_Y_HALF_OVER_D.toFixed(3)} d,
        still above the mean spacing), and is numerically vacuous ({IMP3700_FLOOR_K50.toExponential(2)}) by
        k=50, the nearest-pair proxy scale. This is the quantitative picture behind imp-3671's obstruction
        S2: the Gronwall contraction the mesoscopic V0 reading respects does not survive down to the
        microscopic shock front.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> visualization only -- this charts the
        imp-3671 STRUCTURALLY SILENT verdict (obstruction S2, scale mismatch). Combined with the independent
        type/dimension obstruction S1, G6a_shock_lipschitz stays OPEN. RH-equivalent, necessary-but-not-sufficient.
        The imp-3066 K_a &ge; 0 sign-positivity obstruction remains untouched; Platt-Trudgian &Lambda; &le; 0.2
        remains the rigorous SOTA.
      </div>
    </div>
  );
}
