import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96576_GROUPED,
  IMP96576_SUMMARY,
  IMP96576_HONEST_BANNER,
} from '../data/imp-96576-route-i-certified-minimizer-window-anatomy-viz-data.js';

// signed bar chart: positive bars rise above the zero baseline, negative bars
// drop below it. Bars for the two p = 2 dips (I_1, I_2) are tinted differently
// from the plain positive/negative windows so the binding negativity stands out.
function WindowBarPanel() {
  const rows = IMP96576_GROUPED;
  const svgW = 700;
  const padL = 56;
  const padR = 16;
  const svgH = 320;
  const padT = 20;
  const padB = 56;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.part)));
  const minY = -maxAbs * 1.1;
  const maxY = maxAbs * 1.1;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;
  const zeroY = yOf(0);
  const barSlot = plotW / rows.length;
  const barW = barSlot * 0.62;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
      {[minY, minY / 2, 0, maxY / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {rows.map((r, i) => {
        const x = padL + i * barSlot + (barSlot - barW) / 2;
        const y = r.part >= 0 ? yOf(r.part) : zeroY;
        const h = Math.abs(yOf(r.part) - zeroY);
        const color = r.dip ? '#f87171' : r.part >= 0 ? '#38bdf8' : '#fb923c';
        return (
          <g key={r.label}>
            <rect x={x} y={y} width={barW} height={Math.max(h, 1)} fill={color} opacity={0.85} />
            <text
              x={x + barW / 2}
              y={r.part >= 0 ? y - 6 : y + h + 12}
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize={9.5}
            >
              {r.part >= 0 ? '+' : ''}
              {r.part.toFixed(5)}
            </text>
            <text
              x={x + barW / 2}
              y={padT + plotH + 14}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize={8}
              transform={`rotate(-20 ${x + barW / 2} ${padT + plotH + 14})`}
            >
              {r.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp96576RouteICertifiedMinimizerWindowAnatomyViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route I: Certified-Minimizer Window Anatomy" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96576_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The Route I exact symbol-side certificate proves W(h) &ge; {IMP96576_SUMMARY.certifiedLowerBound.toExponential(4)}{' '}
        &middot; ||h||<sup>2</sup> for every pole-free h in L<sup>2</sup>(-a, a), 2a &le; ln&nbsp;3 (T = 400, N = 320
        Galerkin bound). Its certified minimizer &mdash; even, |&hcirc;(t)|<sup>2</sup> peaking at t&nbsp;=&nbsp;
        {IMP96576_SUMMARY.peakT} &mdash; decomposes its true form value {IMP96576_SUMMARY.trueW.toExponential(4)} into
        six signed window contributions: the archimedean well is nearly cancelled by pole-freeness, a positive
        shoulder dominates, the first p&nbsp;=&nbsp;2 resonance dip I<sub>1</sub> carries the binding negativity, a
        second positive shoulder partially restores it, a shallow second dip I<sub>2</sub> takes a little back, and a
        long positive tail contributes the rest.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Signed window contributions to ||h||<sup>2</sup>-normalized W(h)
      </h3>
      <WindowBarPanel />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the red bars (I<sub>1</sub>, I<sub>2</sub>)
        are the two p&nbsp;=&nbsp;2 resonance dips where the Toeplitz symbol is negative; blue bars are positive
        windows, orange the small negative archimedean well. I<sub>1</sub> alone (
        {IMP96576_GROUPED[2].part.toFixed(5)}) is more than 20&times; the archimedean well in magnitude and is not
        cancelled by any single other window &mdash; the certificate's positivity margin comes from summing across
        all six.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96576 baked viz-data
        (window parts copied verbatim from the certificate module's own anatomy literal). {IMP96576_HONEST_BANNER}
      </div>
    </div>
  );
}
