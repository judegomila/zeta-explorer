import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97787_CURVE,
  IMP97787_LANDMARKS,
  IMP97787_SUMMARY,
} from '../data/imp-97787-fartail-diagnostic-hump-min-crossover-viz-data.js';

const CURVE_COLOR = '#60a5fa';
const HUMP_COLOR = '#f472b6';
const MIN_COLOR = '#facc15';
const CROSSOVER_COLOR = '#34d399';

// Line chart of the imp-97759 non-monotone far-tail diagnostic shape across log10 N = 2..50 on a
// symlog-style y-scale (linear below 1, log above), with the hump, local minimum, and the
// imp-97759 >1% E_trunc-floor-sensitivity crossover all marked.
function HumpMinCrossoverChart() {
  const svgW = 680;
  const padL = 55;
  const padR = 20;
  const padT = 24;
  const padB = 45;
  const svgH = 340;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logNMin = IMP97787_CURVE[0].log10N;
  const logNMax = IMP97787_CURVE[IMP97787_CURVE.length - 1].log10N;

  // Symlog transform: identity below 1 (compressed), log10-scaled above 1, so the curve's
  // sub-1 dip and its 0..15 hump both read clearly.
  const yTransform = (v) => (v <= 1 ? v : 1 + Math.log10(v));
  const yMinT = yTransform(0.9);
  const yMaxT = yTransform(Math.max(...IMP97787_CURVE.map((p) => p.diag)) * 1.05);

  const xOf = (logN) => padL + ((logN - logNMin) / (logNMax - logNMin)) * plotW;
  const yOf = (v) => padT + plotH - ((yTransform(v) - yMinT) / (yMaxT - yMinT)) * plotH;

  const curvePath = IMP97787_CURVE.map(
    (p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.log10N)},${yOf(p.diag)}`
  ).join(' ');

  const landmarks = [
    { ...IMP97787_LANDMARKS.hump, color: HUMP_COLOR },
    { ...IMP97787_LANDMARKS.minimum, color: MIN_COLOR },
    { ...IMP97787_LANDMARKS.crossover, color: CROSSOVER_COLOR },
  ];

  const xTicks = [2, 10, 18, 26, 34, 42, 50].filter((t) => t >= logNMin && t <= logNMax);
  const yTicks = [1, 2, 5, 10, 15];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#334155" strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#334155" strokeWidth={1} />

      {/* limit = 1 reference line */}
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke="#475569" strokeWidth={1} strokeDasharray="2 3" />
      <text x={padL + 4} y={yOf(1) - 4} fill="#64748b" fontSize={9}>
        limit = 1
      </text>

      {yTicks.map((t) => (
        <text key={t} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
          {t}
        </text>
      ))}
      {xTicks.map((t) => (
        <text key={t} x={xOf(t)} y={svgH - 24} textAnchor="middle" fill="#94a3b8" fontSize={9}>
          1e{t}
        </text>
      ))}

      <path d={curvePath} fill="none" stroke={CURVE_COLOR} strokeWidth={2} />

      {landmarks.map((lm) => (
        <g key={lm.label}>
          <line
            x1={xOf(lm.log10N)}
            y1={padT}
            x2={xOf(lm.log10N)}
            y2={padT + plotH}
            stroke={lm.color}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <circle cx={xOf(lm.log10N)} cy={yOf(lm.diag)} r={4} fill={lm.color} />
        </g>
      ))}

      <text x={padL + 6} y={padT + 12} fill="#94a3b8" fontSize={10}>
        diag(N) = (1/2 - p) * 2 log T0
      </text>
    </svg>
  );
}

export default function Imp97787FarTailDiagnosticHumpMinCrossoverViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Tail Diagnostic: Hump, Minimum, Floor-Sensitivity Crossover (imp-97787 / imp-97759)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(52,211,153,0.06)',
          borderLeft: '3px solid #34d399',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#34d399' }}>Honest status:</strong> a measurement/presentation-only
        page. The curve is reused byte-for-byte from imp-97806; the hump and minimum landmarks are
        reused verbatim from imp-97782/imp-97777, and the crossover landmark is reused verbatim
        from imp-97759 F1. Conditional-share diagnostic, NOT an RH bound; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97787_SUMMARY.reading}
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        diag(N) across log10 N = 2..50 (symlog y-axis: linear below 1, log10 above)
      </h3>
      <HumpMinCrossoverChart />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
        {[
          { color: HUMP_COLOR, lm: IMP97787_LANDMARKS.hump },
          { color: MIN_COLOR, lm: IMP97787_LANDMARKS.minimum },
          { color: CROSSOVER_COLOR, lm: IMP97787_LANDMARKS.crossover },
        ].map(({ color, lm }) => (
          <div
            key={lm.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              color: '#cbd5e1',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
            {lm.label}: log10 N &asymp; {lm.log10N}, diag &asymp; {lm.diag}
          </div>
        ))}
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP97787_SUMMARY.verdict}
      </div>
    </div>
  );
}
