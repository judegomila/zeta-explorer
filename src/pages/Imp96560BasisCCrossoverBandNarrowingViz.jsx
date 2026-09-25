import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96560_BANDS,
  IMP96560_ANCHOR,
  IMP96560_AXIS,
  IMP96560_FINDING,
  IMP96560_HONEST_BANNER,
} from '../data/imp-96560-basis-c-crossover-band-narrowing-viz-data.js';

function BandNarrowingChart() {
  const svgW = 680;
  const svgH = 220;
  const padL = 46;
  const padR = 46;
  const padT = 24;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xOfLog10 = (log10L) => padL
    + ((log10L - IMP96560_AXIS.log10Min) / (IMP96560_AXIS.log10Max - IMP96560_AXIS.log10Min)) * plotW;

  const rowY = [padT + plotH * 0.28, padT + plotH * 0.72];
  const barH = 26;

  const ticks = [];
  for (let d = Math.ceil(IMP96560_AXIS.log10Min); d <= Math.floor(IMP96560_AXIS.log10Max); d += 1) {
    ticks.push(d);
  }

  const anchorX = xOfLog10(Math.log10(IMP96560_ANCHOR.L));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {ticks.map((d) => (
        <g key={`t${d}`}>
          <line
            x1={xOfLog10(d)}
            y1={padT}
            x2={xOfLog10(d)}
            y2={padT + plotH}
            stroke="#334155"
            strokeWidth={0.5}
            opacity={0.2}
          />
          <text x={xOfLog10(d)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8}>
            {`1e${d}`}
          </text>
        </g>
      ))}

      <line
        x1={anchorX}
        y1={padT - 6}
        x2={anchorX}
        y2={padT + plotH}
        stroke="#f87171"
        strokeWidth={1.5}
        strokeDasharray="3,2"
      />
      <text x={anchorX} y={padT - 10} textAnchor="middle" fill="#f87171" fontSize={8}>
        {`PT anchor L=${IMP96560_ANCHOR.L.toExponential(1)}`}
      </text>

      {IMP96560_BANDS.map((b, i) => {
        const x0 = xOfLog10(Math.log10(b.lo));
        const x1 = xOfLog10(Math.log10(b.hi));
        const y = rowY[i] - barH / 2;
        return (
          <g key={b.key}>
            <rect
              x={x0}
              y={y}
              width={Math.max(x1 - x0, 1.5)}
              height={barH}
              fill={b.key === 'before' ? '#a78bfa' : '#facc15'}
              opacity={0.85}
            />
            <text x={x0} y={y - 6} fill="#94a3b8" fontSize={8}>
              {b.label}
            </text>
            <text x={x0} y={y + barH + 12} fill="#64748b" fontSize={8}>
              {`[${b.lo.toExponential(2)}, ${b.hi.toExponential(2)}] (width ratio ${b.widthRatio.toFixed(2)}x)`}
            </text>
          </g>
        );
      })}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
    </svg>
  );
}

export default function Imp96560BasisCCrossoverBandNarrowingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96479/imp-96444: Basis-C Corroboration-Reach Crossover Band Narrowing" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96560_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96444 replaced the imp-96430 jittery min-over-coarse-ppp basis-C floor
        estimator with a de-jittered median-over-resolved-ppp estimator. The re-measured
        corroboration-reach crossover band is a proper subset of the original band,
        narrowing its width ratio from ~1.92x to ~1.27x, and both bands sit
        five-to-six decades past the Platt&ndash;Trudgian anchor L = 5.9e6.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        crossover band before (min-sweep) vs after (median-sweep) de-jittering, log10(L) axis
      </h3>
      <BandNarrowingChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the purple bar is
        the original imp-96430 band [1.3e12, 2.5e12]; the yellow bar is the imp-96444
        de-jittered band [1.38e12, 1.76e12], a proper subset sitting at the purple band's
        lower end. The dashed red line marks the PT anchor L = 5.9e6 for scale -- the
        narrowed band's lower edge is still {IMP96560_FINDING.decadesPastAnchorLo.toFixed(1)}
        {' '}decades past the anchor, and its upper edge {IMP96560_FINDING.decadesPastAnchorHi.toFixed(1)}
        {' '}decades past it.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-96479 baked band endpoints verbatim (only the log10(L) projection is computed
        here, no re-fit, no zeros-bundle import). Documentation/accuracy-audit diagnostic
        only: no gap closed, no bound changed, Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA. RH open. NO QED.
      </div>
    </div>
  );
}
