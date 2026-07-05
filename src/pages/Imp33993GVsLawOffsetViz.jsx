import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP33977_G_VS_LAW_OFFSET_VIZ_DATA } from '../data/imp-33977-g-vs-law-offset-viz-data.js';

const {
  curve,
  offsetDecaySlope,
  offsetMagnitudeMonotoneDecreasing,
  ratioMonotoneTowardOne,
  honestCaveat,
} = IMP33977_G_VS_LAW_OFFSET_VIZ_DATA;

// Log-log line chart of log10|off(N)| vs log10(N) -- the order-2 decay toward 0.
function OffsetDecayChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 52;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = curve.map((p) => p.N_log10);
  const ys = curve.map((p) => p.logAbsOffset);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const linePoints = curve.map((p) => `${xAt(p.N_log10)},${yAt(p.logAbsOffset)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={linePoints} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {curve.map((p) => (
        <circle key={`pt-${p.N_log10}`} cx={xAt(p.N_log10)} cy={yAt(p.logAbsOffset)} r={3} fill="#38bdf8" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      {curve.map((p) => (
        <text key={`xt-${p.N_log10}`} x={xAt(p.N_log10)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {p.N_log10}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        log10(N) (decade ladder)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        log10|off(N)|
      </text>
    </svg>
  );
}

// Line chart of (1 - g/law) * logT0 vs log10(N) -- the order-1 ratio deviation, converging to 1.
function RatioConvergenceChart() {
  const svgW = 640;
  const svgH = 260;
  const padL = 48;
  const padR = 24;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xs = curve.map((p) => p.N_log10);
  const ys = curve.map((p) => p.oneMinusRatioTimesL);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(1, ...ys);
  const minY = Math.min(0, ...ys);

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const linePoints = curve.map((p) => `${xAt(p.N_log10)},${yAt(p.oneMinusRatioTimesL)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yAt(1)} x2={padL + cW} y2={yAt(1)} stroke="#facc15" strokeWidth={1.5} strokeDasharray="6,3" />
      <text x={padL + cW - 4} y={yAt(1) - 6} textAnchor="end" fill="#facc15" fontSize={9.5}>
        (1 - g/law) * logT0 = 1
      </text>

      <polyline points={linePoints} fill="none" stroke="#a78bfa" strokeWidth={2} />
      {curve.map((p) => (
        <circle key={`pt-${p.N_log10}`} cx={xAt(p.N_log10)} cy={yAt(p.oneMinusRatioTimesL)} r={3} fill="#a78bfa" stroke="#0a0f1a" strokeWidth={0.75} />
      ))}
      {curve.map((p) => (
        <text key={`xt-${p.N_log10}`} x={xAt(p.N_log10)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {p.N_log10}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        log10(N) (decade ladder)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        (1 - g/law) * logT0
      </text>
    </svg>
  );
}

export default function Imp33993GVsLawOffsetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="g-vs-law Offset Decay + Ratio Convergence (imp-33977 / imp-33993)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33977 packaged the imp-33918 g-vs-law reference offset curve into self-computing
        viz-data, but no page rendered it. The top chart shows log10|off(N)| where
        off(N) = g(N) - 1/(2 log T0), decaying at slope {offsetDecaySlope} (order-2 in 1/log T0)
        across the 1e12..1e280 decade ladder. The bottom chart shows (1 - g/law) * log T0, the
        order-1 ratio deviation, converging toward 1 as N grows.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        log10|off(N)| vs log10(N) -- offset decay slope {offsetDecaySlope}
      </p>
      <OffsetDecayChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        (1 - g/law) * logT0 vs log10(N) -- ratio deviation converging to 1
      </p>
      <RatioConvergenceChart />

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> viz-data packaging only, no
        proof, no fresh derivation; offset magnitude monotone decreasing:{' '}
        {String(offsetMagnitudeMonotoneDecreasing)}; ratio monotone toward one:{' '}
        {String(ratioMonotoneTowardOne)}; imp-33918/imp-33887 untouched; {honestCaveat.sota}
      </div>
    </div>
  );
}
