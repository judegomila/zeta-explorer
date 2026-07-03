import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3672_V0_FIT_TABLE,
  IMP3672_INVARIANT_SLOPE,
  IMP3672_SHRINK_COMPARISON,
  IMP3672_FLOW_FACTOR_COMPARISON,
} from '../data/imp-3672-direct-dyson-flow-crosscheck-viz-data.js';

const V0_COLOR = '#38bdf8';
const FIT_COLOR = '#f59e0b';
const DIRECT_COLOR = '#34d399';
const IMP398_COLOR = '#f87171';

function V0FitChart() {
  const svgW = 620;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const xMin = 0;
  const xMax = 20;
  const yMin = 0;
  const yMax = 10;

  const xS = (x) => padL + ((x - xMin) / (xMax - xMin)) * cW;
  const yS = (y) => padT + cH * (1 - (y - yMin) / (yMax - yMin));

  const fitPath = `M${xS(xMin).toFixed(1)},${yS(xMin * IMP3672_INVARIANT_SLOPE).toFixed(1)} L${xS(xMax).toFixed(1)},${yS(xMax * IMP3672_INVARIANT_SLOPE).toFixed(1)}`;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {[0, 5, 10, 15, 20].map((x) => (
        <g key={x}>
          <line x1={xS(x)} y1={padT} x2={xS(x)} y2={padT + cH} stroke="#1e293b" strokeWidth={0.7} />
          <text x={xS(x)} y={padT + cH + 15} textAnchor="middle" fill="#64748b" fontSize={9}>
            {x}
          </text>
        </g>
      ))}
      {[0, 2.5, 5, 7.5, 10].map((y) => (
        <g key={y}>
          <line x1={padL} y1={yS(y)} x2={padL + cW} y2={yS(y)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 8} y={yS(y) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {y}
          </text>
        </g>
      ))}

      <path d={fitPath} fill="none" stroke={FIT_COLOR} strokeWidth={1.25} strokeDasharray="4,3" />

      {IMP3672_V0_FIT_TABLE.map((r) => (
        <circle key={r.logGamma} cx={xS(r.logDensity)} cy={yS(r.V0)} r={4} fill={V0_COLOR} stroke="#052e1f" strokeWidth={1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      <text x={padL + cW / 2} y={padT + cH + 30} textAnchor="middle" fill="#64748b" fontSize={10}>
        log(gamma / 2 pi) (local density)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        V0(gamma) (measured mesoscopic density floor)
      </text>
      <text x={padL + 8} y={padT + 18} fill={FIT_COLOR} fontSize={9}>
        fit: V0 = {IMP3672_INVARIANT_SLOPE} * log(gamma/2pi)
      </text>
    </svg>
  );
}

function ShrinkBarChart() {
  const svgW = 480;
  const padL = 140;
  const padR = 24;
  const padT = 16;
  const rowH = 42;
  const cW = svgW - padL - padR;
  const svgH = padT + rowH * 2 + 16;
  const xMax = 0.5;
  const xS = (v) => (v / xMax) * cW;

  const bars = [
    { label: 'direct (imp-3642)', value: IMP3672_SHRINK_COMPARISON.rDirect, color: DIRECT_COLOR },
    { label: 'imp-398 bare-log', value: IMP3672_SHRINK_COMPARISON.rImp398, color: IMP398_COLOR },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {bars.map((b, i) => (
        <g key={b.label} transform={`translate(0, ${padT + i * rowH})`}>
          <text x={padL - 10} y={rowH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={10}>
            {b.label}
          </text>
          <rect x={padL} y={rowH / 2 - 10} width={xS(b.value)} height={20} fill={b.color} rx={2} />
          <text x={padL + xS(b.value) + 8} y={rowH / 2 + 4} fill={b.color} fontSize={10}>
            {b.value.toFixed(4)}
          </text>
        </g>
      ))}
    </svg>
  );
}

function FitTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#94a3b8' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #334155' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>log gamma</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>log(gamma / 2 pi)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>V0(gamma)</th>
        </tr>
      </thead>
      <tbody>
        {IMP3672_V0_FIT_TABLE.map((r) => (
          <tr key={r.logGamma} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{r.logGamma}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{r.logDensity}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: V0_COLOR }}>{r.V0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp3672DirectDysonFlowCrosscheckViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Direct-Dyson-Flow Crosscheck (imp-3642)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-3642 ran a direct RK4 integration of the attractive backward-Dyson flow and measured the
        mesoscopic density floor V0(gamma) across a ladder of heights spanning the imp-398 anchor (log
        gamma = 9.1981) to the imp-3620 crossover (log gamma = 20.8576). V0 turns out to be exactly linear
        in the LOCAL DENSITY log(gamma / 2 pi), not the bare RvM height log gamma_N -- the invariant V0 /
        log(gamma / 2 pi) = {IMP3672_INVARIANT_SLOPE} is constant across the whole ladder.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        V0(gamma) vs. local density log(gamma / 2 pi): linear fit
      </p>
      <V0FitChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Measured ladder
      </p>
      <FitTable />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Anchor-to-crossover shrink factor: density-corrected vs. bare-log
      </p>
      <ShrinkBarChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the charts:</strong> the top chart confirms the direct
        flow reproduces the imp-398 1/log SHAPE -- every measured V0(gamma) point falls exactly on the fitted
        line through the origin, slope {IMP3672_INVARIANT_SLOPE}. But the anchor-to-crossover SHRINK the flow
        actually measures is r = {IMP3672_SHRINK_COMPARISON.rDirect} (green bar), not the imp-398 / imp-3620
        bare-log value {IMP3672_SHRINK_COMPARISON.rImp398} (red bar) -- the gap is entirely the 2 pi inside
        the log (local density vs. bare height). This means the imp-398 closed form over-states the
        surviving crossover collision time t_c(N_x) by ~{IMP3672_SHRINK_COMPARISON.overstatePct}%. Re-anchored
        to the same 2.37e-4 A1 trap, the direct C_G=1 flow factor is {IMP3672_FLOW_FACTOR_COMPARISON.direct}
        (vs. imp-3620's {IMP3672_FLOW_FACTOR_COMPARISON.imp398}), still deep inside the imp-3604 bracket
        [1, 1.000474] at ~{(IMP3672_FLOW_FACTOR_COMPARISON.bracketFractionDirect * 100).toFixed(1)}% of it.
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
        imp-3642 measurement/derivation result (frontier-direction, not rigorous). RH-equivalent,
        necessary-but-not-sufficient. The imp-3066 K_a &ge; 0 sign-positivity obstruction remains untouched;
        Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>
    </div>
  );
}
