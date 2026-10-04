import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95688_AXIS_LANDMARKS,
  IMP95688_GAP,
  IMP95688_CAVEAT_BANNER,
} from '../data/imp-95688-vk-crossover-height-gap-viz-data.js';
import { ED } from '../styles/tokens.js';

const LANDMARK_COLOR = {
  window_top: ED.series5,
  crossover: ED.series4,
};

function GapAxis() {
  const svgW = 640;
  const svgH = 160;
  const padL = 40;
  const padR = 40;
  const axisY = 60;
  const axisW = svgW - padL - padR;

  const [a, b] = IMP95688_AXIS_LANDMARKS;
  const lo = a.log10T - (b.log10T - a.log10T) * 0.08;
  const hi = b.log10T + (b.log10T - a.log10T) * 0.08;
  const xOf = (log10T) => padL + ((log10T - lo) / (hi - lo)) * axisW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={axisY} x2={padL + axisW} y2={axisY} stroke={ED.rule} strokeWidth={2} />

      {IMP95688_AXIS_LANDMARKS.map((m) => {
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

      <line x1={xOf(a.log10T)} y1={axisY + 60} x2={xOf(b.log10T)} y2={axisY + 60} stroke={ED.rule} strokeWidth={1} />
      <text x={(xOf(a.log10T) + xOf(b.log10T)) / 2} y={axisY + 74} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {`~${IMP95688_GAP.gapDecadesT.toFixed(2)} decades`}
      </text>
    </svg>
  );
}

export default function Imp95688VkCrossoverHeightGapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="VK-vs-Window Height Gap (imp-95632 / imp-95688)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95632 quantified the separation between the imp-95519 barrier window top
        (T = 1.9e16, log t &asymp; 37.48) and the Ford Vinogradov&ndash;Korobov / classical
        zero-free-region crossover (log t &asymp; 10242.24), where VK finally overtakes the
        classical Mossinghoff&ndash;Trudgian&ndash;Yang width. In the natural-log height
        variable log t the additive gap is {IMP95688_GAP.gapLogT.toFixed(2)}; in decades of T
        the multiplicative gap is &asymp;{IMP95688_GAP.gapDecadesT.toFixed(2)} orders of
        magnitude (a factor &asymp;{IMP95688_GAP.gapFactor.mantissa} &times;
        10^{IMP95688_GAP.gapFactor.exponent}).
      </p>

      <GapAxis />

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
          {IMP95688_AXIS_LANDMARKS.map((m) => (
            <tr key={m.name} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{m.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {m.T === null ? 'not representable (overflows double)' : m.T.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{m.log10T}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The raw crossover height T = e^10242.24 overflows IEEE-754 double precision, so both
        landmarks are compared purely in log10(T) space; the gap is carried as a mantissa
        &times; 10^exponent pair rather than a direct ratio.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95688_CAVEAT_BANNER}
      </div>
    </div>
  );
}
