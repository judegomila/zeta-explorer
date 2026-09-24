import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96410_AXIS,
  IMP96410_SIGMA_CURVE,
  IMP96410_LANDMARKS,
  IMP96410_SEPARATION_DECADES,
  IMP96410_FINDING,
  IMP96410_HONEST_BANNER,
} from '../data/imp-96410-sigma-peak-knee-crossover-viz-data.js';

function SigmaPeakKneeCrossoverChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xOf = (d) => padL
    + ((d - IMP96410_AXIS.log10NMin) / (IMP96410_AXIS.log10NMax - IMP96410_AXIS.log10NMin)) * plotW;
  const yOf = (s) => padT + plotH
    - ((s - IMP96410_AXIS.sigmaMin) / (IMP96410_AXIS.sigmaMax - IMP96410_AXIS.sigmaMin)) * plotH;

  const curvePath = IMP96410_SIGMA_CURVE
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.log10N).toFixed(2)},${yOf(p.sigma).toFixed(2)}`)
    .join(' ');

  const xTicks = [6, 7, 8, 9, 10, 11, 12].filter(
    (v) => v >= IMP96410_AXIS.log10NMin && v <= IMP96410_AXIS.log10NMax,
  );
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT} x2={xOf(v)} y2={padT + plotH} stroke="#334155" strokeWidth={0.5} opacity={0.3} />
          <text x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={8}>
            {`1e${v}`}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#334155" strokeWidth={0.5} opacity={0.2} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {/* sigma(N) curve on the shared log10 N axis */}
      <path d={curvePath} fill="none" stroke="#22d3ee" strokeWidth={2} />

      {/* crossover: dashed vertical line where E_coll = E_trunc (sigma = 1/2) */}
      <line
        x1={xOf(IMP96410_LANDMARKS.crossover.log10N)}
        y1={padT}
        x2={xOf(IMP96410_LANDMARKS.crossover.log10N)}
        y2={padT + plotH}
        stroke="#facc15"
        strokeWidth={1}
        strokeDasharray="3,3"
        opacity={0.6}
      />

      {/* peak and knee landmarks */}
      <circle cx={xOf(IMP96410_LANDMARKS.peak.log10N)} cy={yOf(IMP96410_LANDMARKS.peak.sigma)} r={5} fill="#f472b6" />
      <circle cx={xOf(IMP96410_LANDMARKS.knee.log10N)} cy={yOf(IMP96410_LANDMARKS.knee.sigma)} r={5} fill="#a78bfa" />

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        {'log10 N; dashed yellow line = E_coll = E_trunc crossover (sigma = 1/2)'}
      </text>

      <g transform={`translate(${padL + 8}, ${padT})`}>
        <line x1={0} y1={4} x2={16} y2={4} stroke="#22d3ee" strokeWidth={2} />
        <text x={21} y={8} fill="#94a3b8" fontSize={8}>
          {'sigma(N) = E_coll / (E_trunc + E_flow + E_coll)'}
        </text>
        <circle cx={7} cy={18} r={4} fill="#f472b6" />
        <text x={21} y={22} fill="#94a3b8" fontSize={8}>
          {`peak: log10 N=${IMP96410_LANDMARKS.peak.log10N.toFixed(4)}, sigma=${IMP96410_LANDMARKS.peak.sigma.toFixed(4)}`}
        </text>
        <circle cx={7} cy={32} r={4} fill="#a78bfa" />
        <text x={21} y={36} fill="#94a3b8" fontSize={8}>
          {`knee: log10 N=${IMP96410_LANDMARKS.knee.log10N.toFixed(4)}, sigma=${IMP96410_LANDMARKS.knee.sigma.toFixed(4)}`}
        </text>
      </g>
    </svg>
  );
}

export default function Imp96410SigmaPeakKneeCrossoverViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96388: sigma(N) Peak, Knee, and E_coll = E_trunc Crossover on One Shared log10 N Axis" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96410_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96388 cross-tabulated the imp-3220/imp-96266 sigma(N) value peak against the
        imp-96351 exponent-ramp knee on one shared log10 N axis. They sit{' '}
        {IMP96410_SEPARATION_DECADES.toFixed(4)} decades apart, with sigma falling
        monotonically between them — two independent landmarks, not the same feature seen
        at different differencing orders.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        sigma(N) peak, knee, and the E_coll = E_trunc crossover
      </h3>
      <SigmaPeakKneeCrossoverChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the cyan curve is
        sigma(N) across the shared log10 N range; the pink dot is the imp-96266 E_flow-built
        peak, the purple dot is the imp-96351 exponent-ramp knee, and the dashed yellow line
        is the imp-33723 closed-form E_coll = E_trunc crossover — the knee sits within
        ~0.013 decades of it. {IMP96410_FINDING.F2_different_source_terms}
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
        imp-96388 baked landmark literals verbatim (only the log10 curve interpolation and
        axis sampling are computed here, no re-fit, no zeros-bundle import). Derivation on
        baked literals only; changes no bound; RH open; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA. NO QED.
      </div>
    </div>
  );
}
