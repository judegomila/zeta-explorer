import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34134_EFLOW_ETRUNC_RATIO_DECAY_ONSET } from '../data/imp-34134-eflow-etrunc-ratio-decay-onset.js';

// log-log chart: x = log10(N), y = log10(ratio). The whole decade sweep renders
// as a monotone-decreasing curve; the three onset landmarks (ratio = 1, 1%, 0.1%)
// and the imp-3444 E_coll=E_trunc crossover are marked directly on it.
function RatioDecayChart({ data }) {
  const { ratioLadder, crossings, relativeToEcollEtruncCrossover } = data;

  const svgW = 680;
  const svgH = 360;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = ratioLadder.map((r) => r.logN);
  const ys = ratioLadder.map((r) => Math.log10(r.ratio));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys) - 0.5;
  const maxY = Math.max(...ys) + 0.5;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const dataPath = xs.map((x, i) => `${xAt(x)},${yAt(ys[i])}`).join(' ');

  const landmarks = [
    { key: 'eq', label: 'ratio=1', log10N: crossings.E_flow_eq_E_trunc.log10N, y: 0, color: '#facc15' },
    { key: '1pct', label: '1%', log10N: crossings.below_1pct.log10N, y: -2, color: '#f87171' },
    { key: '0p1pct', label: '0.1%', log10N: crossings.below_0p1pct.log10N, y: -3, color: '#fb923c' },
  ];

  const crossoverLog10N = Math.log10(relativeToEcollEtruncCrossover.N_Ecoll_eq_Etrunc);

  const xTicks = [6, 8, 10, 12, 14, 16, 18];
  const yTicks = [1, 0, -2, -4, -6, -8, -10];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line
        x1={xAt(crossoverLog10N)}
        y1={padT}
        x2={xAt(crossoverLog10N)}
        y2={padT + cH}
        stroke="#38bdf8"
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={xAt(crossoverLog10N) + 4} y={padT + 10} fill="#38bdf8" fontSize={8.5}>
        E_coll=E_trunc crossover
      </text>
      <polyline points={dataPath} fill="none" stroke="#4ade80" strokeWidth={2} />
      {xs.map((x, i) => (
        <circle key={`pt-${x}`} cx={xAt(x)} cy={yAt(ys[i])} r={2.75} fill="#4ade80" stroke="#0a0f1a" strokeWidth={0.5} />
      ))}
      {landmarks.map((m) => (
        <g key={m.key}>
          <circle cx={xAt(m.log10N)} cy={yAt(m.y)} r={4} fill={m.color} stroke="#0a0f1a" strokeWidth={0.75} />
          <text x={xAt(m.log10N)} y={yAt(m.y) - 8} textAnchor="middle" fill={m.color} fontSize={8.5}>
            {m.label}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <text key={`xt-${t}`} x={xAt(t)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {`1e${t}`}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`yt-${t}`} x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
          {`1e${t}`}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        N (log scale)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90, 14, ${padT + cH / 2})`}
      >
        E_flow / E_trunc (log scale)
      </text>
    </svg>
  );
}

export default function Imp34221EflowEtruncRatioDecayOnsetViz() {
  const data = IMP34134_EFLOW_ETRUNC_RATIO_DECAY_ONSET;
  const { crossings, relativeToEcollEtruncCrossover } = data;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow / E_trunc Ratio Decay Ladder and Onset Landmarks (imp-34134)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34134 tabulated the E_flow(N)/E_trunc ratio across N = 1e6 .. 1e18 and
        located the point past which the flow term becomes negligible against the
        constant E_trunc = {data.subTerms.E_trunc} floor. The ratio starts above 1 at
        N=1e6 and decays strictly monotonically, dropping below 1% at N~
        {crossings.below_1pct.N} and below 0.1% at N~{crossings.below_0p1pct.N}.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        E_flow/E_trunc vs N, with the ratio=1, 1%, and 0.1% onsets marked against the
        imp-3444 E_coll=E_trunc crossover
      </p>
      <RatioDecayChart data={data} />

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
        <strong style={{ color: '#94a3b8' }}>Onset landmarks:</strong> E_flow = E_trunc
        at N~{crossings.E_flow_eq_E_trunc.N} (log10 N~{crossings.E_flow_eq_E_trunc.log10N}); ratio
        falls below 1% at N~{crossings.below_1pct.N} (log10 N~{crossings.below_1pct.log10N}), which is
        ~{Math.abs(relativeToEcollEtruncCrossover.decades_1pct_past_crossover).toFixed(2)} decades BEFORE
        the imp-3444 E_coll=E_trunc crossover N~{relativeToEcollEtruncCrossover.N_Ecoll_eq_Etrunc}; ratio
        falls below 0.1% at N~{crossings.below_0p1pct.N} (log10 N~{crossings.below_0p1pct.log10N}), only
        ~{relativeToEcollEtruncCrossover.decades_0p1pct_past_crossover.toFixed(2)} decades AFTER it. The
        two-term-sigma onset thus essentially coincides with the crossover to within about a decade of N.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> {data.honestScope}
      </div>
    </div>
  );
}
