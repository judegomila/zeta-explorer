import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP124815_PAIR_RATIO_LADDER_ROWS, IMP124815_SUMMARY } from '../data/imp-124815-pairratio-ladder-viz-data.js';

const log10 = (v) => Math.log10(v);

function RatioSeriesChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const rows = IMP124815_PAIR_RATIO_LADDER_ROWS;
  const logMeasured = rows.map((r) => log10(r.measured_ECF_over_EET));
  const logTarget = rows.map((r) => log10(r.target_Eflow_over_Etrunc));
  const yMin = Math.floor(Math.min(...logMeasured, ...logTarget)) - 0.5;
  const yMax = Math.ceil(Math.max(...logMeasured, ...logTarget)) + 0.5;

  const xS = (i) => padL + (i / (rows.length - 1)) * cW;
  const yS = (logV) => padT + cH * (1 - (logV - yMin) / (yMax - yMin));

  const measuredPath = rows.map((r, i) => (i === 0 ? 'M' : 'L') + xS(i).toFixed(1) + ',' + yS(logMeasured[i]).toFixed(2)).join(' ');
  const targetPath = rows.map((r, i) => (i === 0 ? 'M' : 'L') + xS(i).toFixed(1) + ',' + yS(logTarget[i]).toFixed(2)).join(' ');

  const yTicks = [];
  for (let t = Math.ceil(yMin); t <= Math.floor(yMax); t++) yTicks.push(t);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(t) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            1e{t}
          </text>
        </g>
      ))}

      <path d={targetPath} fill="none" stroke="#a78bfa" strokeWidth={3.5} strokeOpacity={0.55} />
      <path d={measuredPath} fill="none" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="4 3" />
      {rows.map((r, i) => (
        <circle key={r.key} cx={xS(i)} cy={yS(logMeasured[i])} r={2.6} fill="#38bdf8" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {rows.map((r, i) => (
        <g key={'x' + r.key}>
          <line x1={xS(i)} y1={padT + cH} x2={xS(i)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(i)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {r.key}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        landmark (sigma 0.9 -&gt; 0.001, N_L climbing 2.6e7 -&gt; 5.4e15)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        ratio (log scale)
      </text>
    </svg>
  );
}

function ReldiffChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const rows = IMP124815_PAIR_RATIO_LADDER_ROWS;
  const logAbs = rows.map((r) => log10(r.abs_reldiff));
  const yMin = Math.floor(Math.min(...logAbs)) - 0.5;
  const yMax = Math.ceil(Math.max(...logAbs)) + 0.5;
  const barW = (cW / rows.length) * 0.5;

  const xS = (i) => padL + ((i + 0.5) / rows.length) * cW;
  const yS = (logV) => padT + cH * (1 - (logV - yMin) / (yMax - yMin));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />
      {rows.map((r, i) => (
        <rect
          key={r.key}
          x={xS(i) - barW / 2}
          y={yS(logAbs[i])}
          width={barW}
          height={padT + cH - yS(logAbs[i])}
          fill="#f59e0b"
        />
      ))}
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      {rows.map((r, i) => (
        <g key={'x' + r.key}>
          <text x={xS(i)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {r.key}
          </text>
          <text x={xS(i)} y={yS(logAbs[i]) - 6} textAnchor="middle" fill="#94a3b8" fontSize={8}>
            {r.abs_reldiff.toExponential(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        |reldiff| growing as the flow share collapses (log scale)
      </text>
    </svg>
  );
}

export default function Imp124815PairRatioLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Pair-Ratio Identity Ladder: Measured vs Analytic (imp-124770)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-97665 derived the EXACT pair-ratio identity E_CF/E_ET = E_flow/E_trunc for the
        crossing-elasticity axes. imp-124770 tabulated it as a ladder across the imp-97520
        landmarks L2..L7 (sigma 0.9 down to 0.001, N_L climbing seven decades from 2.6e7 to
        5.4e15). The measured 5-point E_CF/E_ET tracks the analytic E_flow/E_trunc target closely
        at every rung, while the relative disagreement between the two grows monotonically as the
        flow share E_flow/E_N collapses toward the far tail -- a stencil / round-off artefact, not
        a deviation from the identity.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        measured E_CF/E_ET vs analytic E_flow/E_trunc across L2..L7
      </p>
      <RatioSeriesChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        |reldiff| = (E_CF/E_ET) / (E_flow/E_trunc) - 1, growing down the ladder
      </p>
      <ReldiffChart />

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#a78bfa' }}>&#9644;</span> analytic target E_flow/E_trunc</span>
        <span><span style={{ color: '#38bdf8' }}>&#9644;</span> measured 5-point E_CF/E_ET</span>
        <span><span style={{ color: '#f59e0b' }}>&#9644;</span> |reldiff| between the two</span>
      </div>

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP124815_SUMMARY.verdict}
      </div>
    </div>
  );
}
