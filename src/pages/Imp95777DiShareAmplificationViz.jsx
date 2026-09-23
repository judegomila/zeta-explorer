import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  J_SHARE_ROWS,
  VARIATION_SHARE_ROWS,
  AMPLIFICATION_RATIO,
  IMP95777_SUMMARY,
} from '../data/imp-95777-di-share-amplification-viz-data.js';

// Stacked horizontal bar: how much of J is rho-free bulk vs rho-carrying dI.
function JShareBar() {
  const svgW = 640;
  const barH = 34;
  const padL = 8;
  const padR = 8;
  const barW = svgW - padL - padR;

  let x = padL;
  return (
    <svg width={svgW} height={barH + 26} style={{ display: 'block', maxWidth: '100%' }}>
      {J_SHARE_ROWS.map((r) => {
        const w = barW * r.shareOfJ;
        const seg = (
          <g key={r.label}>
            <rect x={x} y={0} width={w} height={barH} fill={r.color} opacity={0.85} />
            <text x={x + w / 2} y={barH / 2 + 4} textAnchor="middle" fill="#0f172a" fontSize={11} fontWeight={600}>
              {(100 * r.shareOfJ).toFixed(1)}%
            </text>
            <text x={x + w / 2} y={barH + 16} textAnchor="middle" fill="#94a3b8" fontSize={9.5}>
              {r.label}
            </text>
          </g>
        );
        x += w;
        return seg;
      })}
    </svg>
  );
}

// Grouped bar chart: fractional variation of J (whole) vs dI (rho-carrying part).
function VariationBarChart() {
  const svgW = 420;
  const padL = 90;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = 140;
  const svgH = padT + plotH + padB;

  const mags = VARIATION_SHARE_ROWS.map((r) => Math.abs(r.fractionalVariation));
  const maxMag = Math.max(...mags);
  const barW = plotW / VARIATION_SHARE_ROWS.length;
  const scale = (v) => (Math.abs(v) / maxMag) * (plotH - 30);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1} />
      {VARIATION_SHARE_ROWS.map((r, i) => {
        const h = scale(r.fractionalVariation);
        const x = padL + i * barW + barW * 0.25;
        const w = barW * 0.5;
        const y = padT + plotH - h;
        return (
          <g key={r.label}>
            <rect x={x} y={y} width={w} height={h} fill={i === 0 ? '#60a5fa' : '#f59e0b'} opacity={0.85} />
            <text x={x + w / 2} y={y - 6} textAnchor="middle" fill="#cbd5e1" fontSize={9.5}>
              {(100 * r.fractionalVariation).toFixed(4)}%
            </text>
            <text x={x + w / 2} y={svgH - padB + 14} textAnchor="middle" fill="#64748b" fontSize={9}>
              {r.label}
            </text>
          </g>
        );
      })}
      <text x={16} y={padT + plotH / 2} textAnchor="middle" fill="#94a3b8" fontSize={9} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
        |fractional variation|
      </text>
    </svg>
  );
}

export default function Imp95777DiShareAmplificationViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="dI's 40% Share, 100% Drift, 2.484x Amplification (imp-95777 / imp-95724 / imp-95749)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a measurement/presentation-only
        page reshaping the frozen imp-95724 exact split and imp-95749 conditional variation (no
        re-derivation, no new computation). The dI variation is CONDITIONAL on the imp-95720/95745
        +4 offset hypothesis, verified only at m=20. Changes no bound; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA; NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP95777_SUMMARY.reading}
      </p>

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        Share of J at the anchor rho = 1/20:
      </p>
      <JShareBar />

      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1.5rem 0 0.5rem' }}>
        Fractional variation carried by J as a whole vs by dI alone (dI drifts{' '}
        <strong style={{ color: '#f59e0b' }}>{AMPLIFICATION_RATIO.toFixed(3)}x</strong> further):
      </p>
      <VariationBarChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>quantity</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>share of J</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>fractional variation</th>
          </tr>
        </thead>
        <tbody>
          {VARIATION_SHARE_ROWS.map((r) => (
            <tr key={r.label} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{r.label}</td>
              <td style={{ textAlign: 'right' }}>{(100 * r.shareOfJ).toFixed(1)}%</td>
              <td style={{ textAlign: 'right' }}>{r.fractionalVariation.toExponential(3)}</td>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> {IMP95777_SUMMARY.verdict}
      </div>
    </div>
  );
}
