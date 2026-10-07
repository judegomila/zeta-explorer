import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP124881_KNEE_POINTS,
  IMP124881_PEAK_POINTS,
  IMP124881_KNEE_FIT_LINE,
  IMP124881_PEAK_FIT_LINE,
  IMP124881_SUMMARY,
  IMP124881_VERDICT,
} from '../data/imp-124881-floor-elasticity-sidebyside-viz-data.js';
import { ED } from '../styles/tokens.js';

const SVG_W = 720;
const PAD_L = 70;
const PAD_R = 24;
const PAD_T = 24;
const PAD_B = 48;
const SVG_H = 340;
const C_W = SVG_W - PAD_L - PAD_R;
const C_H = SVG_H - PAD_T - PAD_B;

// Both fits share the same log10(E_trunc) x-axis (ten imp-33708 0.5x..5x floor factors).
function FloorElasticityOverlayChart() {
  const allX = [
    ...IMP124881_KNEE_POINTS.map((p) => Math.log10(p.E_trunc)),
    ...IMP124881_PEAK_POINTS.map((p) => Math.log10(p.E_trunc)),
  ];
  const allY = [
    ...IMP124881_KNEE_POINTS.map((p) => p.logY),
    ...IMP124881_PEAK_POINTS.map((p) => p.logY),
  ];
  const xMin = Math.floor(Math.min(...allX) * 10) / 10 - 0.1;
  const xMax = Math.ceil(Math.max(...allX) * 10) / 10 + 0.1;
  const yMin = Math.floor(Math.min(...allY)) - 0.3;
  const yMax = Math.ceil(Math.max(...allY)) + 0.3;

  const xS = (logX) => PAD_L + ((logX - xMin) / (xMax - xMin)) * C_W;
  const yS = (y) => PAD_T + C_H - ((y - yMin) / (yMax - yMin)) * C_H;

  const kneeLinePoints = IMP124881_KNEE_FIT_LINE.map((p) => `${xS(p.logE_trunc)},${yS(p.logY)}`).join(' ');
  const peakLinePoints = IMP124881_PEAK_FIT_LINE.map((p) => `${xS(p.logE_trunc)},${yS(p.logY)}`).join(' ');

  const xTicks = [];
  for (let t = Math.ceil(xMin * 10) / 10; t <= xMax; t += 0.5) xTicks.push(+t.toFixed(2));
  const yTicks = [];
  for (let t = Math.ceil(yMin); t <= Math.floor(yMax); t++) yTicks.push(t);

  return (
    <svg width={SVG_W} height={SVG_H} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + C_H} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={PAD_L} y1={PAD_T + C_H} x2={PAD_L + C_W} y2={PAD_T + C_H} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={PAD_L - 4} y1={yS(t)} x2={PAD_L + C_W} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={PAD_L - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}

      {xTicks.map((t) => (
        <g key={'xt' + t}>
          <line x1={xS(t)} y1={PAD_T + C_H - 4} x2={xS(t)} y2={PAD_T + C_H + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(t)} y={PAD_T + C_H + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}
      <text x={PAD_L + C_W / 2} y={SVG_H - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(E_trunc)
      </text>
      <text
        x={16}
        y={PAD_T + C_H / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${PAD_T + C_H / 2})`}
      >
        log10(N*)
      </text>

      <polyline points={kneeLinePoints} fill="none" stroke={ED.series2} strokeWidth={2} />
      <polyline points={peakLinePoints} fill="none" stroke={ED.series1} strokeWidth={2} strokeDasharray="5,3" />

      {IMP124881_KNEE_POINTS.map((p) => (
        <circle
          key={'knee' + p.floorFactor}
          cx={xS(Math.log10(p.E_trunc))}
          cy={yS(p.logY)}
          r={4}
          fill={ED.series2}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}
      {IMP124881_PEAK_POINTS.map((p) => (
        <rect
          key={'peak' + p.floorFactor}
          x={xS(Math.log10(p.E_trunc)) - 3.5}
          y={yS(p.logY) - 3.5}
          width={7}
          height={7}
          fill={ED.series1}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}

      <g transform={`translate(${PAD_L + 12}, ${PAD_T + 10})`}>
        <circle cx={0} cy={0} r={4} fill={ED.series2} stroke={ED.paper} strokeWidth={0.75} />
        <text x={10} y={3} fontSize={9} fill={ED.inkSoft}>
          far-tail knee (imp-124772), slope ~ {IMP124881_SUMMARY.knee.slope}
        </text>
        <rect x={-3.5} y={13.5} width={7} height={7} fill={ED.series1} stroke={ED.paper} strokeWidth={0.75} />
        <text x={10} y={20} fontSize={9} fill={ED.inkSoft}>
          interior peak (imp-124848), slope ~ {IMP124881_SUMMARY.peak.slope}
        </text>
      </g>
    </svg>
  );
}

export default function Imp124881FloorElasticitySidebysideViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Floor-Elasticity Side-by-Side: Interior Peak vs Far-Tail Knee (imp-124881)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a presentation-only leaf
        reusing the frozen imp-124772 (far-tail knee) and imp-124848 (interior peak) full-ladder OLS
        fits verbatim, over the same imp-33708 0.5x..5x E_trunc floor ladder. Conditional-share
        curvature diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
        asymptotic; no operator positivity established; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains
        SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Both curves fit log10 N* against log10 E_trunc over the same ten floor factors. The far-tail
        knee (imp-124772, circles) scales as N* ~ E_trunc^{IMP124881_SUMMARY.knee.slope}, an
        R^2 ~ {IMP124881_SUMMARY.knee.r2} power law. The interior peak (imp-124848, squares, dashed)
        is shallower at N* ~ E_trunc^{IMP124881_SUMMARY.peak.slope} (R^2 ~{' '}
        {IMP124881_SUMMARY.peak.r2}) and carries a ~
        {IMP124881_SUMMARY.residualRatio}x larger residual, the mechanistic signature of the still
        non-negligible E_flow term near the interior peak. The two lines sit a full ~
        {IMP124881_SUMMARY.exponentGap} apart in exponent, visually distinct across the shared floor
        range.
      </p>

      <FloorElasticityOverlayChart />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'right' }}>
            <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>quantity</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>far-tail knee (imp-124772)</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>interior peak (imp-124848)</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['OLS slope', IMP124881_SUMMARY.knee.slope, IMP124881_SUMMARY.peak.slope],
            ['R^2', IMP124881_SUMMARY.knee.r2, IMP124881_SUMMARY.peak.r2],
            ['RMS residual (decades)', IMP124881_SUMMARY.knee.rmsResidualDecades, IMP124881_SUMMARY.peak.rmsResidualDecades],
            [
              'max-abs residual (decades)',
              IMP124881_SUMMARY.knee.maxAbsResidualDecades,
              IMP124881_SUMMARY.peak.maxAbsResidualDecades,
            ],
          ].map(([label, a, b]) => (
            <tr key={label} style={{ color: 'var(--ink)', textAlign: 'right', borderTop: '1px solid var(--rule-soft)' }}>
              <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>{label}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{String(a)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{String(b)}</td>
            </tr>
          ))}
          <tr style={{ color: 'var(--ink)', textAlign: 'right', borderTop: '1px solid var(--rule-soft)' }}>
            <td style={{ textAlign: 'left', padding: '0.4rem 0.5rem' }}>exponent gap</td>
            <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }} colSpan={2}>
              {String(IMP124881_SUMMARY.exponentGap)}
            </td>
          </tr>
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP124881_VERDICT}
      </div>
    </div>
  );
}
