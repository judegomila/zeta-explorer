import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95971_CROSSING_HEIGHT_ROWS,
  IMP95971_ANCHORS,
  IMP95971_PER_HEIGHT_ROWS,
  IMP95971_VERIFIED_HEIGHT,
  IMP95971_SENSITIVITY,
  IMP95971_SUBGAP,
  IMP95971_CAVEAT_BANNER,
} from '../data/imp-95971-crossing-height-map-viz-data.js';
import { ED } from '../styles/tokens.js';

const ANCHOR_COLOR = {
  'a_0 min': ED.series2,
  'a_0 mean': ED.series1,
  'a_0 max': ED.series3,
};

// log10(T_x) vs a_0 line chart. T_x is a DOUBLE exponential in a_0, so even
// on a log10 scale the curve is steeply decreasing -- the visual point is
// that a ~1.18-wide empirical a_0 spread sweeps log10(T_x) across ~50 orders.
function CrossingChart() {
  const svgW = 560;
  const padL = 64;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 300;
  const svgH = padT + plotH + padB;

  const rows = IMP95971_CROSSING_HEIGHT_ROWS;
  const a0Min = rows[0].a0;
  const a0Max = rows[rows.length - 1].a0;
  const yMin = Math.min(...rows.map((r) => r.log10Tx));
  const yMax = Math.max(...rows.map((r) => r.log10Tx));
  const yPad = 0.05 * (yMax - yMin || 1);
  const yLo = yMin - yPad;
  const yHi = yMax + yPad;

  const xOf = (a0) => padL + ((a0 - a0Min) / (a0Max - a0Min)) * plotW;
  const yOf = (log10Tx) => padT + plotH - ((log10Tx - yLo) / (yHi - yLo)) * plotH;

  const points = rows.map((r) => `${xOf(r.a0)},${yOf(r.log10Tx)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />

      <polyline points={points} fill="none" stroke={ED.series5} strokeWidth={2} />

      <line
        x1={padL}
        y1={yOf(IMP95971_VERIFIED_HEIGHT.log10T)}
        x2={padL + plotW}
        y2={yOf(IMP95971_VERIFIED_HEIGHT.log10T)}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="5 3"
      />
      <text
        x={padL + plotW - 4}
        y={yOf(IMP95971_VERIFIED_HEIGHT.log10T) - 5}
        textAnchor="end"
        fill={ED.brass}
        fontSize={9}
        fontFamily="monospace"
      >
        T=3e12 (verified height)
      </text>

      {IMP95971_PER_HEIGHT_ROWS.map((r) => (
        <circle
          key={r.Tc}
          cx={xOf(r.a0)}
          cy={yOf(Math.log10(r.Tx))}
          r={3}
          fill="none"
          stroke={ED.rule}
          strokeWidth={1.5}
        />
      ))}

      {IMP95971_ANCHORS.map((a) => (
        <g key={a.label}>
          <circle
            cx={xOf(a.a0)}
            cy={yOf(Math.log10(a.Tx))}
            r={5}
            fill={ANCHOR_COLOR[a.label]}
            stroke={ED.paper}
            strokeWidth={1.5}
          />
          <line
            x1={xOf(a.a0)}
            y1={yOf(Math.log10(a.Tx))}
            x2={xOf(a.a0)}
            y2={padT + plotH}
            stroke={ANCHOR_COLOR[a.label]}
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        </g>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        arithmetic intercept a_0
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        log10(T_x)
      </text>

      <text x={padL + 6} y={padT + 14} fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
        {yHi.toFixed(0)}
      </text>
      <text x={padL + 6} y={padT + plotH - 4} fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
        {yLo.toFixed(0)}
      </text>
    </svg>
  );
}

export default function Imp95971CrossingHeightMapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Crossing-Height Map T_x(a_0) (imp-95940)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95921 C0 offset-crossing height obeys the closed form
        T_x(a_0)&nbsp;=&nbsp;2&pi;&nbsp;exp(exp(2&pi;<sup>2</sup>&nbsp;C0&nbsp;&minus;&nbsp;2(&gamma;&nbsp;+&nbsp;1&nbsp;+&nbsp;a_0)))
        in the unpinned O(1) arithmetic intercept a_0. Because T_x is a
        DOUBLE exponential in a_0
        (d&nbsp;ln&nbsp;T_x&nbsp;/&nbsp;d&nbsp;a_0&nbsp;&asymp;&nbsp;{IMP95971_SENSITIVITY.dLnTxDa0.toFixed(1)}),
        the empirical a_0 spread of &asymp;{IMP95971_SENSITIVITY.a0Spread.toFixed(2)} (straddling
        zero, noise-dominated) sweeps the crossing height across roughly 40 orders of
        magnitude &mdash; the mechanism behind the wide imp-95921 ceiling range. The open
        circles mark the six imp-95710 / imp-95562 per-height a_0 back-out estimates; the
        dashed amber line is the imp-95519 window-bottom verified height T=3&times;10<sup>12</sup>.
      </p>

      <CrossingChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>anchor</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>a_0</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>T_x</th>
          </tr>
        </thead>
        <tbody>
          {IMP95971_ANCHORS.map((a) => (
            <tr key={a.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: ANCHOR_COLOR[a.label],
                    marginRight: 6,
                  }}
                />
                {a.label}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{a.a0.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{a.Tx.toExponential(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--brass)' }}>Named sub-gap:</strong> {IMP95971_SUBGAP} &mdash; a_0 must be
        pinned to O({IMP95971_SENSITIVITY.a0AccuracyForOneDecade.toFixed(2)}) (importing the
        Selberg-Goldston-Fujii Var&nbsp;S(T) constant b) to fix T_x within a single order of
        magnitude.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95971_CAVEAT_BANNER}
      </div>
    </div>
  );
}
