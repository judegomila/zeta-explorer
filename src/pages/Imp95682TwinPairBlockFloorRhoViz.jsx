import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95682_ROWS,
  IMP95682_HALF_RETENTION_RHO,
  IMP95682_CAVEAT_BANNER,
} from '../data/imp-95682-twin-pair-block-floor-rho-viz-data.js';

const ROWS = IMP95682_ROWS;

const SERIES = [
  { key: 'log10F', label: 'F = lambda_min(seam Gram)', color: '#38bdf8' },
  { key: 'log10FoverAopt', label: 'F / A_opt (block advantage)', color: '#f59e0b' },
  { key: 'log10FoverBlock', label: 'F / blockIso (retained fraction)', color: '#a78bfa' },
];

// Semilog-x (rho), log10-y (all three curves) chart spanning the full
// ~12-order-of-magnitude interpolation between the two imp-95642 endpoints.
function BlockFloorRhoChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = 300;
  const svgH = padT + plotH + padB;

  const xMin = ROWS[0].log10Rho;
  const xMax = ROWS[ROWS.length - 1].log10Rho;
  const xOf = (log10Rho) => padL + ((log10Rho - xMin) / (xMax - xMin)) * plotW;

  const allY = ROWS.flatMap((r) => SERIES.map((s) => r[s.key]));
  const yMax = Math.ceil(Math.max(...allY) + 0.5);
  const yMin = Math.floor(Math.min(...allY) - 0.5);
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const halfRetentionX = xOf(Math.log10(IMP95682_HALF_RETENTION_RHO));
  const halfRetentionY = yOf(Math.log10(0.5));
  const rho1X = xOf(ROWS[0].log10Rho);

  const yTicks = [];
  for (let t = Math.ceil(yMin / 3) * 3; t <= yMax; t += 3) yTicks.push(t);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <g key={`yt-${t}`}>
          <line
            x1={padL}
            x2={padL + plotW}
            y1={yOf(t)}
            y2={yOf(t)}
            stroke="#1e293b"
            strokeWidth={1}
          />
          <text x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill="#64748b" fontSize={9.5}>
            {`10^${t}`}
          </text>
        </g>
      ))}

      {ROWS.map((r) => (
        <text
          key={`xt-${r.rho}`}
          x={xOf(r.log10Rho)}
          y={padT + plotH + 16}
          textAnchor="middle"
          fill="#64748b"
          fontSize={9}
        >
          {r.rho}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        rho = D / delta (log scale)
      </text>

      {/* rho = 1 scalar endpoint marker */}
      <line
        x1={rho1X}
        x2={rho1X}
        y1={padT}
        y2={padT + plotH}
        stroke="#475569"
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={rho1X + 4} y={padT + 10} fill="#94a3b8" fontSize={9}>
        rho=1 (scalar A_opt)
      </text>

      {/* half-retention crossing marker for F/blockIso */}
      <line
        x1={padL}
        x2={padL + plotW}
        y1={halfRetentionY}
        y2={halfRetentionY}
        stroke="#a78bfa"
        strokeWidth={1}
        strokeDasharray="2,4"
        opacity={0.6}
      />
      <circle cx={halfRetentionX} cy={halfRetentionY} r={3.5} fill="#a78bfa" />
      <text x={halfRetentionX + 6} y={halfRetentionY - 6} fill="#a78bfa" fontSize={9}>
        {`~1/2 retention, rho~${IMP95682_HALF_RETENTION_RHO}`}
      </text>

      {SERIES.map((s) => (
        <polyline
          key={s.key}
          fill="none"
          stroke={s.color}
          strokeWidth={2}
          points={ROWS.map((r) => `${xOf(r.log10Rho)},${yOf(r[s.key])}`).join(' ')}
        />
      ))}
      {SERIES.map((s) =>
        ROWS.map((r) => (
          <circle
            key={`${s.key}-${r.rho}`}
            cx={xOf(r.log10Rho)}
            cy={yOf(r[s.key])}
            r={2.5}
            fill={s.color}
          />
        )),
      )}
    </svg>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
      {SERIES.map((s) => (
        <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{ width: 12, height: 3, background: s.color, display: 'inline-block' }}
          />
          <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Imp95682TwinPairBlockFloorRhoViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Twin-Pair Block Floor F(delta, rho) Monotone Interpolation (imp-95659 / imp-95682)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95659 tabulated the per-pair block floor F(delta, rho) = lambda_min(seam
        Gram) across the cross/in-pair ratio rho = D&#47;delta. This chart shows all
        three measured curves on one log10-y axis: F itself (sweeping ~12 orders of
        magnitude), the block advantage F&#47;A_opt over the scalar lattice floor
        (only ~1.09x at rho = 1, exceeding 1e3x by rho = 1.5), and the fraction of
        the isolated block floor retained F&#47;blockIso (crossing ~1&#47;2 near
        rho ~ 15, marked below).
      </p>

      <BlockFloorRhoChart />
      <Legend />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>rho</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F / A_opt</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F / blockIso</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.rho} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.rho}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.F.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.FoverAopt.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.FoverBlock.toExponential(4)}
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP95682_CAVEAT_BANNER}
      </div>
    </div>
  );
}
