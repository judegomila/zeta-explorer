import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3928_WINDOW_ROWS,
  IMP3928_EDGE_START,
  IMP3928_EDGE_END,
  IMP3928_EDGE_OVER_HALFWIDTH_START,
  IMP3928_EDGE_OVER_HALFWIDTH_END,
  IMP3928_VISC_FLOOR_DEEPEN_FACTOR,
} from '../data/imp-3928-inviscid-window-edge-blocksize-viz-data.js';

const EDGE_COLOR = '#38bdf8';
const FLOOR_COLOR = '#facc15';
const RATIO_COLOR = '#f472b6';

function EdgeAndFloorChart() {
  const svgW = 680;
  const padL = 70;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const xMin = 100;
  const xMax = 1350;
  const yMin = 7;
  const yMax = 14;
  const xS = (m) => padL + ((m - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const points = IMP3928_WINDOW_ROWS.map((r) => `${xS(r.M)},${yS(r.edge)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[7, 8, 9, 10, 11, 12, 13, 14].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.6} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <polyline points={points} fill="none" stroke={EDGE_COLOR} strokeWidth={1.6} />
      {IMP3928_WINDOW_ROWS.map((r) => (
        <circle key={r.M} cx={xS(r.M)} cy={yS(r.edge)} r={4} fill={EDGE_COLOR} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3928_WINDOW_ROWS.map((r) => (
        <g key={'x' + r.M}>
          <line x1={xS(r.M)} y1={padT + cH} x2={xS(r.M)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.M)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {r.M}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        block size M (anchor height log gamma = 9.1981)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        window upper edge (y_star / d)
      </text>
    </svg>
  );
}

function EdgeOverHalfWidthChart() {
  const svgW = 680;
  const padL = 78;
  const padR = 24;
  const padT = 16;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const xMin = 100;
  const xMax = 1350;
  const yMin = 0;
  const yMax = 0.11;
  const xS = (m) => padL + ((m - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const points = IMP3928_WINDOW_ROWS.map((r) => `${xS(r.M)},${yS(r.edgeOverHalfWidth)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 0.02, 0.04, 0.06, 0.08, 0.1].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.6} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {(v * 100).toFixed(0)}%
          </text>
        </g>
      ))}

      <polyline points={points} fill="none" stroke={RATIO_COLOR} strokeWidth={1.6} />
      {IMP3928_WINDOW_ROWS.map((r) => (
        <circle key={r.M} cx={xS(r.M)} cy={yS(r.edgeOverHalfWidth)} r={4} fill={RATIO_COLOR} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP3928_WINDOW_ROWS.map((r) => (
        <g key={'x' + r.M}>
          <line x1={xS(r.M)} y1={padT + cH} x2={xS(r.M)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.M)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {r.M}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill="#64748b" fontSize={10}>
        block size M
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        edge / half-width (M/2)
      </text>
    </svg>
  );
}

export default function Imp3928InviscidWindowEdgeBlocksizeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Inviscid-Window Edge vs Block Size: Widens Logarithmically, Not Algebraically (imp-3896)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3896 measures how the imp-3872 clean inviscid window (y_star / d in [{IMP3928_EDGE_START}, {IMP3928_EDGE_END}]
        at block size M = 161) widens as the block M grows to 1281. The window upper edge -- the
        coarse-graining multiplier where the finite-N viscosity fraction |m_zz| / |2 m m_z| stops
        shrinking and finite-block curvature takes over -- rises from {IMP3928_EDGE_START} to {IMP3928_EDGE_END}
        while the visc floor there deepens ~{IMP3928_VISC_FLOOR_DEEPEN_FACTOR.toFixed(0)}x. But the edge grows far
        slower than the block itself: edge / (M/2) falls from {(IMP3928_EDGE_OVER_HALFWIDTH_START * 100).toFixed(1)}%
        to {(IMP3928_EDGE_OVER_HALFWIDTH_END * 100).toFixed(1)}%, sizing the separation of scales as logarithmic in
        the particle count, not algebraic.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        window upper edge (argmin visc) vs block size M -- widens monotonically, 8 (M=161) to 13 (M=1281)
      </p>
      <EdgeAndFloorChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        edge / (block half-width M/2) vs block size M -- falling from 9.9% to 2.0%: logarithmic, not linear, widening
      </p>
      <EdgeOverHalfWidthChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the top chart shows the clean-window
        upper edge climbing 8 &rarr; 10 &rarr; 11 &rarr; 13 as the block quadruples from M = 161 to 1281 (visc
        floor deepening 4.37e-4 &rarr; 1.05e-5 alongside it). The bottom chart normalizes that same edge by the
        block half-width M/2: if the window widened proportionally to the block, this ratio would stay flat --
        instead it falls by ~5x, showing the finite block edge recedes only logarithmically while the block
        grows linearly.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> this is a scale-sizing MEASUREMENT, NOT a
        certificate -- it does not widen the window to the microscopic y &rarr; 0 continuum and does not
        certify vanishing viscosity. H2 stays UNWRITTEN as a certificate, the G6a K4 caustic-regularity route
        stays WHOLLY NEW, and G6a_shock_lipschitz stays OPEN. Scoping/measurement only; no positivity, no
        bridge closure, no RH claim; imp-3066 K_a &ge; 0 positivity untouched; Platt-Trudgian &Lambda; &le; 0.2
        remains the rigorous SOTA. NO QED.
      </div>
    </div>
  );
}
