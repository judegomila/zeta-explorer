import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95753_AXIS_LANDMARKS,
  IMP95753_GAP_DECADES,
  IMP95753_GEOMETRIC_MEAN_GAP_T,
  IMP95753_CAVEAT_BANNER,
} from '../data/imp-95753-crossover-height-window-viz-data.js';
import {
  IMP95772_CEILING_LANDMARK,
  IMP95772_REACH_ANNOTATION,
  IMP95772_CAVEAT_BANNER,
} from '../data/imp-95772-deadzone-ceiling-reach-viz-data.js';
import { ED } from '../styles/tokens.js';

const LANDMARK_COLOR = {
  conservatism_top: ED.series1,
  crossover: ED.series4,
  window_bottom: ED.series5,
};

function CrossoverAxis() {
  const svgW = 640;
  const svgH = 160;
  const padL = 40;
  const padR = 40;
  const axisY = 60;
  const axisW = svgW - padL - padR;

  const lo = IMP95753_AXIS_LANDMARKS[0].log10T - 0.6;
  const hi = IMP95753_AXIS_LANDMARKS[2].log10T + 0.6;
  const xOf = (log10T) => padL + ((log10T - lo) / (hi - lo)) * axisW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={axisY} x2={padL + axisW} y2={axisY} stroke={ED.rule} strokeWidth={2} />

      {IMP95753_AXIS_LANDMARKS.map((m) => {
        const x = xOf(m.log10T);
        const color = LANDMARK_COLOR[m.name];
        return (
          <g key={m.name}>
            <line x1={x} y1={axisY - 22} x2={x} y2={axisY + 22} stroke={color} strokeWidth={2} />
            <circle cx={x} cy={axisY} r={5} fill={color} />
            <text x={x} y={axisY - 30} textAnchor="middle" fill={color} fontSize={10.5} fontWeight={700}>
              {`log10 T = ${m.log10T}`}
            </text>
            <text x={x} y={axisY + 40} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
              {m.label}
            </text>
          </g>
        );
      })}

      {/* imp-95772 direct-measurement ceiling: a thin dashed marker, close beside the top landmark */}
      {(() => {
        const x = xOf(IMP95772_CEILING_LANDMARK.log10T);
        return (
          <g>
            <line
              x1={x}
              y1={axisY - 14}
              x2={x}
              y2={axisY + 14}
              stroke={ED.brassDeco}
              strokeWidth={1.5}
              strokeDasharray="3,2"
            />
            <text x={x} y={axisY + 52} textAnchor="middle" fill={ED.brass} fontSize={8.5}>
              gamma_1e6 ceiling
            </text>
          </g>
        );
      })()}

      {/* gap-decade brackets between consecutive landmarks */}
      {[0, 1].map((i) => {
        const a = IMP95753_AXIS_LANDMARKS[i];
        const b = IMP95753_AXIS_LANDMARKS[i + 1];
        const xa = xOf(a.log10T);
        const xb = xOf(b.log10T);
        const decades = i === 0 ? IMP95753_GAP_DECADES.belowCrossover : IMP95753_GAP_DECADES.aboveCrossover;
        return (
          <g key={`gap-${i}`}>
            <line x1={xa} y1={axisY + 60} x2={xb} y2={axisY + 60} stroke={ED.rule} strokeWidth={1} />
            <text x={(xa + xb) / 2} y={axisY + 74} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
              {`~${decades.toFixed(2)} decades`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp95753CrossoverHeightWindowViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Common-RvM-Height Dead Zone (imp-95729 / imp-95753)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95729 placed three frontier landmarks on a single log-T (Riemann-von Mangoldt height)
        axis: the imp-95710 measured number-variance conservatism top, the imp-3444
        E_coll = E_trunc crossover, and the imp-95519 verified-height window bottom. The crossover
        lands inside the ~{IMP95753_GAP_DECADES.total.toFixed(2)}-decade gap between the other two,
        which neither the measured conservatism nor the verified window reaches -- and it sits
        within {IMP95753_GAP_DECADES.logMidpointOffset.toFixed(2)} decades of that gap&apos;s
        log-midpoint.
      </p>

      <CrossoverAxis />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>T</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log10 T</th>
          </tr>
        </thead>
        <tbody>
          {IMP95753_AXIS_LANDMARKS.map((m) => (
            <tr key={m.name} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{m.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{m.T.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{m.log10T}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Geometric mean of the outer two landmarks (5e5, 3e12):{' '}
        <span style={{ fontFamily: 'monospace' }}>{IMP95753_GEOMETRIC_MEAN_GAP_T.toExponential(4)}</span> --
        within {IMP95753_GAP_DECADES.logMidpointOffset.toFixed(2)} decades of the measured
        crossover height, confirming the near-log-midpoint placement.
      </p>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink)',
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>imp-95772 measurement-reach:</strong> {IMP95772_REACH_ANNOTATION.text}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95753_CAVEAT_BANNER}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status (imp-95772):</strong> {IMP95772_CAVEAT_BANNER}
      </div>
    </div>
  );
}
