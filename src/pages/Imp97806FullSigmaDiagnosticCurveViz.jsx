import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97806_CURVE,
  IMP97806_LANDMARKS,
  IMP97806_SUMMARY,
} from '../data/imp-97806-full-sigma-diagnostic-curve-viz-data.js';
import { ED } from '../styles/tokens.js';

const CURVE_COLOR = ED.series1;
const HUMP_COLOR = ED.series7;
const MIN_COLOR = ED.series4;
const RISE_COLOR = ED.series2;

// Line chart of the full imp-97723 diagnostic curve across log10 N = 2..50 on a symlog-style
// y-scale (linear below 1, log above) so the hump, the sub-1 minimum, and the rise-to-1 all
// stay legible in one plot, with the three pinned landmarks marked.
function FullDiagnosticCurveChart() {
  const svgW = 680;
  const padL = 55;
  const padR = 20;
  const padT = 24;
  const padB = 45;
  const svgH = 340;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const logNMin = IMP97806_CURVE[0].log10N;
  const logNMax = IMP97806_CURVE[IMP97806_CURVE.length - 1].log10N;

  // Symlog transform: identity below 1 (compressed), log10-scaled above 1, so the curve's
  // sub-1 dip and its 0..15 hump both read clearly.
  const yTransform = (v) => (v <= 1 ? v : 1 + Math.log10(v));
  const yMinT = yTransform(0.9);
  const yMaxT = yTransform(Math.max(...IMP97806_CURVE.map((p) => p.diag)) * 1.05);

  const xOf = (logN) => padL + ((logN - logNMin) / (logNMax - logNMin)) * plotW;
  const yOf = (v) => padT + plotH - ((yTransform(v) - yMinT) / (yMaxT - yMinT)) * plotH;

  const curvePath = IMP97806_CURVE.map(
    (p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.log10N)},${yOf(p.diag)}`
  ).join(' ');

  const landmarks = [
    { ...IMP97806_LANDMARKS.hump, color: HUMP_COLOR },
    { ...IMP97806_LANDMARKS.minimum, color: MIN_COLOR },
    { ...IMP97806_LANDMARKS.riseTo1, color: RISE_COLOR },
  ];

  const xTicks = [2, 10, 18, 26, 34, 42, 50].filter((t) => t >= logNMin && t <= logNMax);
  const yTicks = [1, 2, 5, 10, 15];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {/* limit = 1 reference line */}
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.rule} strokeWidth={1} strokeDasharray="2 3" />
      <text x={padL + 4} y={yOf(1) - 4} fill={ED.inkFaint} fontSize={9}>
        limit = 1
      </text>

      {yTicks.map((t) => (
        <text key={t} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {t}
        </text>
      ))}
      {xTicks.map((t) => (
        <text key={t} x={xOf(t)} y={svgH - 24} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
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

      <text x={padL + 6} y={padT + 12} fill={ED.inkSoft} fontSize={10}>
        diag(N) = (1/2 - p) * 2 log T0
      </text>
    </svg>
  );
}

export default function Imp97806FullSigmaDiagnosticCurveViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Full Sigma Diagnostic Curve: Hump, Minimum, Rise-to-1 (imp-97806 / imp-97723)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement/presentation-only
        page. The continuous shape is a fresh sampling of the byte-for-byte imp-97723/imp-97759
        closed form; the three marked landmarks are reused verbatim from their pinning modules
        (imp-97782 hump, imp-97777 minimum, imp-97723 crossing). Conditional-share diagnostic, NOT
        an RH bound; no refereed bound is changed; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97806_SUMMARY.reading}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        diag(N) across log10 N = 2..50 (symlog y-axis: linear below 1, log10 above)
      </h3>
      <FullDiagnosticCurveChart />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
        {[
          { color: HUMP_COLOR, lm: IMP97806_LANDMARKS.hump },
          { color: MIN_COLOR, lm: IMP97806_LANDMARKS.minimum },
          { color: RISE_COLOR, lm: IMP97806_LANDMARKS.riseTo1 },
        ].map(({ color, lm }) => (
          <div
            key={lm.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              color: 'var(--ink)',
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
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97806_SUMMARY.verdict}
      </div>
    </div>
  );
}
