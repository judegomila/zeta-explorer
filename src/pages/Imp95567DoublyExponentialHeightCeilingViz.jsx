import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95567_CURVES,
  IMP95567_FIRST_EXCLUSION_EDGE,
  IMP95567_SUMMARY,
} from '../data/imp-95567-height-ceiling-viz-data.js';

const CURVE_COLORS = { 0.1: '#60a5fa', 0.25: '#fbbf24', 0.5: '#f87171' };

// Chart: ln(E(T, delta)) = ln ln(H_ceil(T,delta) / 2pi) vs support T, one line per
// displacement delta. Plotting the double-log lets all three curves share one
// linear y-axis even though H_ceil itself spans hundreds of orders of magnitude
// between delta = 0.1 and delta = 0.5 -- the doubly-exponential signature shows up
// here as each curve's slope steepening toward 2*delta as T grows.
function HeightCeilingChart() {
  const svgW = 700;
  const padL = 56;
  const padR = 20;
  const padT = 22;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const allPoints = IMP95567_CURVES.flatMap((c) => c.points);
  const xMin = Math.min(...allPoints.map((p) => p.T));
  const xMax = Math.max(...allPoints.map((p) => p.T));
  const yMin = Math.floor(Math.min(...allPoints.map((p) => p.loglogH)) - 0.5);
  const yMax = Math.ceil(Math.max(...allPoints.map((p) => p.loglogH)) + 0.5);

  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + ((yMax - v) / (yMax - yMin)) * plotH;

  const edgeBandX1 = xOf(IMP95567_FIRST_EXCLUSION_EDGE.X3e12);
  const edgeBandX2 = xOf(IMP95567_FIRST_EXCLUSION_EDGE.X1p9e16);

  const xTicks = [1, 2, 3, 4, 5, 6, 7, 8].filter((v) => v >= xMin && v <= xMax);
  const yTicks = [];
  for (let t = yMax; t >= yMin; t -= Math.max(1, Math.round((yMax - yMin) / 6))) yTicks.push(t);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke="#1e293b" strokeWidth={1} />
      ))}

      {/* verified-zero-window first-exclusion band at the edge delta = 1/2 */}
      <rect
        x={edgeBandX1}
        y={padT}
        width={Math.max(edgeBandX2 - edgeBandX1, 1)}
        height={plotH}
        fill="rgba(248,113,113,0.10)"
      />
      <text x={edgeBandX1 + 3} y={padT + 10} fill="#f87171" fontSize={9}>
        T_X band [3.882, 4.147] (X = 3e12..1.9e16)
      </text>

      {IMP95567_CURVES.map((c) => {
        const path = c.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.T)} ${yOf(p.loglogH)}`).join(' ');
        return <path key={c.delta} d={path} fill="none" stroke={CURVE_COLORS[c.delta]} strokeWidth={2} />;
      })}

      {xTicks.map((v) => (
        <text key={`tx${v}`} x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={9.5}>
          {v}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
          {t}
        </text>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        support T
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        ln E = ln ln(H_ceil / 2&pi;)
      </text>
    </svg>
  );
}

export default function Imp95567DoublyExponentialHeightCeilingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="RES-T Doubly-Exponential Detectable-Height Ceiling (imp-95533 / imp-95559)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a
        measurement/presentation-only page re-plotting the frozen imp-95533 LEMMA
        RES-T (L4) height-ceiling law (no re-derivation, no new term). It changes no
        bound and proves no RH-relevant theorem. Platt&ndash;Trudgian &Lambda; &le;
        0.2 remains state of the art. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The type-T Fejer packet used by THEOREM RES-T detects an off-line zero
        quadruple of displacement &delta; = &beta; &minus; 1/2 only up to a height
        ceiling H_ceil(T,&delta;) = 2&pi; e<sup>E</sup>, E(T,&delta;) = &delta;&sup2;
        S(T&delta;)&#8308; T&sup3;, S(x) = sinh(x/2)/(x/2). Because S(T&delta;)&#8308;
        grows like e<sup>2T&delta;</sup>, the ceiling is <em>doubly</em> exponential in
        the support T: the chart below plots ln E = ln ln(H_ceil/2&pi;), which itself
        grows in T with slope approaching the predicted 2&delta; once T&delta; enters
        the asymptotic regime &mdash; steepest for the edge &delta; = 1/2 (red), shallower
        for &delta; = 0.25 (gold) and 0.1 (blue). The shaded band marks the edge-displacement
        first-exclusion support T_X across the verified-zero window X &isin; [3e12, 1.9e16].
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        ln E(T, &delta;) vs support T, for &delta; = 0.1 / 0.25 / 0.5
      </h3>
      <HeightCeilingChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>verified height X</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>first-exclusion T_X (&delta; = 1/2)</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>1e6</td>
            <td style={{ textAlign: 'right' }}>{IMP95567_FIRST_EXCLUSION_EDGE.X1e6.toFixed(3)}</td>
          </tr>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>3e12 (window lo)</td>
            <td style={{ textAlign: 'right', color: '#f87171' }}>{IMP95567_FIRST_EXCLUSION_EDGE.X3e12.toFixed(3)}</td>
          </tr>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>1.9e16 (window hi)</td>
            <td style={{ textAlign: 'right', color: '#f87171' }}>{IMP95567_FIRST_EXCLUSION_EDGE.X1p9e16.toFixed(3)}</td>
          </tr>
          <tr style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
            <td style={{ padding: '3px 0' }}>1e20</td>
            <td style={{ textAlign: 'right' }}>{IMP95567_FIRST_EXCLUSION_EDGE.X1e20.toFixed(3)}</td>
          </tr>
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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> {IMP95567_SUMMARY.ceilingLaw}
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page
        rendering the frozen imp-95533/imp-95559 RES-T (L4) height-ceiling law (no
        re-derivation). Supplies no T &gt; T_X existence proof (that residual reduces
        to the pointwise Hilbert-transform wall shared with imp-95519/imp-95543);
        changes no bound, establishes no operator positivity, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
