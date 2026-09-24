import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96318_CROSSING_SERIES,
  IMP96318_PLATEAU,
  IMP96318_ANCHORS,
  IMP96318_HONEST_BANNER,
} from '../data/imp-96318-confident-span-crossing-viz-data.js';

function CrossingChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 60;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = IMP96318_CROSSING_SERIES[0].logRho;
  const xMax = IMP96318_CROSSING_SERIES[IMP96318_CROSSING_SERIES.length - 1].logRho;
  const yMin = 8.8;
  const yMax = 10.8;

  const xOf = (logRho) => padL + ((logRho - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const pathOf = (points) => points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.logRho).toFixed(2)} ${yOf(p.crossSpan).toFixed(2)}`)
    .join(' ');

  const yTicks = [9.0, 9.5, 10.0, 10.5];
  const xTickRhos = [0.5, 0.71, 1.0, 1.41, 2.0];

  const plateauX1 = xOf(Math.log(IMP96318_PLATEAU.rhoLow));
  const plateauX2 = xOf(Math.log(IMP96318_PLATEAU.rhoHigh));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* near-equal plateau band */}
      <rect x={plateauX1} y={padT} width={plateauX2 - plateauX1} height={plotH} fill="#f472b6" opacity={0.08} />

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#334155" strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>{v.toFixed(1)}</text>
        </g>
      ))}

      {/* Rayleigh span reference line */}
      <line x1={padL} y1={yOf(IMP96318_ANCHORS.rayleighSpan)} x2={padL + plotW} y2={yOf(IMP96318_ANCHORS.rayleighSpan)} stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="2 3" opacity={0.6} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      <path d={pathOf(IMP96318_CROSSING_SERIES)} fill="none" stroke="#f472b6" strokeWidth={1.75} opacity={0.95} />

      {IMP96318_CROSSING_SERIES.map((p) => (
        <circle
          key={`d-${p.rho}`}
          cx={xOf(p.logRho)}
          cy={yOf(p.crossSpan)}
          r={p.isGlobalMin ? 3.6 : p.isEqualAmplitude ? 3.2 : 2.2}
          fill={p.isGlobalMin ? '#facc15' : p.isEqualAmplitude ? '#38bdf8' : '#f472b6'}
        />
      ))}

      {xTickRhos.map((v) => (
        <text key={`x${v}`} x={xOf(Math.log(v))} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={7.5}>
          {v}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        amplitude ratio rho = A4/A5 (log scale, fine grid)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke="#f472b6" strokeWidth={1.75} />
        <text x={22} y={3} fill="#94a3b8" fontSize={8.5}>
          confident-separation crossing span L(rho) (AICc &gt; 0.90, fine grid)
        </text>
        <circle cx={9} cy={16} r={3.2} fill="#38bdf8" />
        <text x={22} y={19} fill="#94a3b8" fontSize={8.5}>
          equal-amplitude rho = 1 (L = {IMP96318_ANCHORS.eqSpanRho1.toFixed(3)})
        </text>
        <circle cx={9} cy={32} r={3.6} fill="#facc15" />
        <text x={22} y={35} fill="#94a3b8" fontSize={8.5}>
          global minimum, rho = {IMP96318_ANCHORS.minSpanRho} (L = {IMP96318_ANCHORS.minSpan.toFixed(3)})
        </text>
        <line x1={0} y1={46} x2={18} y2={46} stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="2 3" />
        <text x={22} y={49} fill="#94a3b8" fontSize={8.5}>Rayleigh span ({IMP96318_ANCHORS.rayleighSpan.toFixed(3)})</text>
      </g>
    </svg>
  );
}

export default function Imp96318ConfidentSpanCrossingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96288: Confident Two-Tone Separation Span Crossing L(rho)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96318_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96264 read the confident (AICc &gt; 0.90) two-tone separation span as strictly
        minimized at the equal-amplitude ratio rho = 1, exactly at the Rayleigh span. imp-96288
        re-ran the same pipeline at fine rho/span resolution and found that was a coarse-grid
        artifact: the rho = 1 crossing sits at {IMP96318_ANCHORS.eqSpanRho1.toFixed(3)}, below
        the Rayleigh span {IMP96318_ANCHORS.rayleighSpan.toFixed(3)}, and the true minimum
        ({IMP96318_ANCHORS.minSpan.toFixed(3)}) sits at a slightly unequal ratio
        rho = {IMP96318_ANCHORS.minSpanRho}, only {IMP96318_ANCHORS.marginVsEqual.toFixed(3)} below
        the equal-amplitude value.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        L(rho) vs amplitude ratio rho (flat plateau near rho = 1, rising with imbalance)
      </h3>
      <CrossingChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the shaded band marks the
        near-equal-amplitude window (rho in [{IMP96318_PLATEAU.rhoLow}, {IMP96318_PLATEAU.rhoHigh}])
        where the crossing span stays inside a flat plateau ({IMP96318_PLATEAU.label}), all just
        below the dashed Rayleigh reference line. The blue dot (rho = 1) and yellow dot (the global
        minimum at rho = {IMP96318_ANCHORS.minSpanRho}) sit only {IMP96318_ANCHORS.marginVsEqual.toFixed(3)}{' '}
        apart -- a noise-sized margin. Outside the plateau the span rises monotonically with
        imbalance in either direction, reaching past 10.5 at rho = 2 or rho = 0.5.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96288
        baked fine-grid crossing curve verbatim (only the log(rho) axis reshaping is computed here).
        Synthetic q4+q5 two-tone Monte-Carlo simulation, not a measurement of the real conductor
        content or its amplitude ratio. Changes no bound, establishes no operator positivity, no RH
        claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
