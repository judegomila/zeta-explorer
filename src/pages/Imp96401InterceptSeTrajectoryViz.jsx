import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96401_FULL_SERIES,
  IMP96401_SUMMARY,
  IMP96401_FINDING,
  IMP96401_HONEST_BANNER,
} from '../data/imp-96401-intercept-se-trajectory-viz-data.js';
import { ED } from '../styles/tokens.js';

function InterceptTrajectoryChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const yMax = Math.max(...IMP96401_FULL_SERIES.map((p) => p.intercept + p.twoSE)) * 1.05;
  const yMin = Math.min(0, ...IMP96401_FULL_SERIES.map((p) => p.intercept - p.twoSE)) * 1.05;

  const xOf = (i) => padL + (i / (IMP96401_FULL_SERIES.length - 1)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const measured = IMP96401_FULL_SERIES.filter((p) => !p.isProjection);
  const projected = IMP96401_FULL_SERIES[IMP96401_FULL_SERIES.length - 1];

  const bandTop = IMP96401_FULL_SERIES.map((p) => `${xOf(p.index).toFixed(2)},${yOf(p.twoSE).toFixed(2)}`).join(' L');
  const bandBottom = [...IMP96401_FULL_SERIES].reverse()
    .map((p) => `${xOf(p.index).toFixed(2)},${yOf(-p.twoSE).toFixed(2)}`).join(' L');
  const bandPath = `M${bandTop} L${bandBottom} Z`;

  const linePath = measured
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.index).toFixed(2)},${yOf(p.intercept).toFixed(2)}`)
    .join(' ');

  const yTicks = [yMin, yMin / 2, 0, yMax / 2, yMax].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.2} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}
      {IMP96401_FULL_SERIES.map((p) => (
        <text
          key={`x${p.depth}`}
          x={xOf(p.index)}
          y={padT + plotH + 14}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={8}
        >
          {p.depth.replace('gamma', 'g')}
        </text>
      ))}

      {/* +/-2 SE band around zero */}
      <path d={bandPath} fill={ED.brassDeco} opacity={0.12} stroke="none" />
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />

      {/* measured intercept trajectory */}
      <path d={linePath} fill="none" stroke={ED.series6} strokeWidth={2} />
      {measured.map((p) => (
        <circle key={p.depth} cx={xOf(p.index)} cy={yOf(p.intercept)} r={4} fill={ED.series6} />
      ))}

      {/* projected gamma_8000 point, visually distinct (hollow, dashed connector) */}
      <line
        x1={xOf(measured[measured.length - 1].index)}
        y1={yOf(measured[measured.length - 1].intercept)}
        x2={xOf(projected.index)}
        y2={yOf(projected.intercept)}
        stroke={ED.series7}
        strokeWidth={1.5}
        strokeDasharray="4,3"
      />
      <circle
        cx={xOf(projected.index)}
        cy={yOf(projected.intercept)}
        r={5}
        fill="none"
        stroke={ED.series7}
        strokeWidth={2}
      />

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {'census depth; dashed yellow band = +/-2 SE of zero; hollow pink = projected (not measured)'}
      </text>

      <g transform={`translate(${padL + 8}, ${padT})`}>
        <circle cx={7} cy={4} r={4} fill={ED.series6} />
        <text x={16} y={8} fill={ED.inkSoft} fontSize={8}>
          {'measured intercept c (gamma200 .. gamma4000)'}
        </text>
        <circle cx={7} cy={18} r={4} fill="none" stroke={ED.series7} strokeWidth={2} />
        <text x={16} y={22} fill={ED.inkSoft} fontSize={8}>
          {`projected gamma8000: c~${projected.intercept.toFixed(4)}, c/seC~${projected.cOverSE.toFixed(2)}`}
        </text>
      </g>
    </svg>
  );
}

export default function Imp96401InterceptSeTrajectoryViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96367: Reciprocal-Log Margin-Floor Intercept-vs-Census-Depth Trajectory" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96401_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The fitted reciprocal-log margin-floor intercept falls from{' '}
        {IMP96401_SUMMARY.g500Peak.toFixed(5)} at gamma500 to {IMP96401_SUMMARY.g4000.toFixed(5)}{' '}
        at gamma4000, near-halving per census doubling, while its standard error stays flat.
        Extrapolating one more doubling to gamma8000 puts the intercept inside the +/-2 SE band
        around zero — the labeled projection below, not a measurement.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Intercept vs census depth, with the +/-2 SE band and the gamma8000 projection
      </h3>
      <InterceptTrajectoryChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the cyan line is the
        measured intercept at each census depth (gamma200 through gamma4000); the yellow shaded
        band is +/-2 standard errors around zero at each point. The hollow pink point is the
        one-doubling gamma8000 projection, connected by a dashed line to flag that it is
        extrapolated, not measured — it already lands inside the band.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP96401_FINDING}
      </div>
    </div>
  );
}
