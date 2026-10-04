import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95810_REACH_ROWS,
  IMP95810_CROSSINGS,
  IMP95810_LN14_WALL,
  IMP95810_REACH_MIN,
  IMP95810_REACH_MAX,
  IMP95810_CAVEAT_BANNER,
  IMP95810_OPEN_RESIDUAL,
} from '../data/imp-95810-reach-universality-viz-data.js';
import { ED } from '../styles/tokens.js';

const SERIES = [
  { key: 'ln16', label: 'ln 1.6', color: ED.series2 },
  { key: 'ln15', label: 'ln 1.5', color: ED.series1 },
  { key: 'ln145', label: 'ln 1.45', color: ED.series3 },
  { key: 'ln14', label: 'ln 1.4', color: ED.brass },
];

// Line chart of relative C_fit error vs reach R = delta(N_max+1), one line per
// delta. Three deltas decay monotonically toward zero; ln 1.4 dips sub-1% then
// degrades at larger reach as float64 sinks toward the cancellation floor.
function ReachChart() {
  const svgW = 520;
  const padL = 60;
  const padR = 100;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 280;
  const svgH = padT + plotH + padB;

  const allErrs = IMP95810_REACH_ROWS.flatMap((r) =>
    SERIES.map((s) => r[s.key]).filter((v) => v !== null && v !== undefined),
  );
  const yMin = Math.min(...allErrs, 0);
  const yMax = Math.max(...allErrs, 0);
  const yPad = 0.08 * (yMax - yMin || 1);
  const yLo = yMin - yPad;
  const yHi = yMax + yPad;

  const xOf = (reach) =>
    padL +
    ((reach - IMP95810_REACH_MIN) / (IMP95810_REACH_MAX - IMP95810_REACH_MIN)) * plotW;
  const yOf = (relErr) => padT + plotH - ((relErr - yLo) / (yHi - yLo)) * plotH;

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
      <line
        x1={padL}
        y1={yOf(0)}
        x2={padL + plotW}
        y2={yOf(0)}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <line
        x1={padL}
        y1={yOf(-0.01)}
        x2={padL + plotW}
        y2={yOf(-0.01)}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <text x={padL + plotW + 6} y={yOf(-0.01) + 3} fill={ED.inkFaint} fontSize={9} fontFamily="monospace">
        -1%
      </text>

      {SERIES.map((s) => {
        const rows = IMP95810_REACH_ROWS.filter((r) => r[s.key] !== null && r[s.key] !== undefined);
        const points = rows.map((r) => `${xOf(r.reach)},${yOf(r[s.key])}`).join(' ');
        return (
          <g key={s.key}>
            <polyline points={points} fill="none" stroke={s.color} strokeWidth={2} />
            {rows.map((r) => (
              <circle key={r.reach} cx={xOf(r.reach)} cy={yOf(r[s.key])} r={3.5} fill={s.color} />
            ))}
            <text
              x={xOf(rows[rows.length - 1].reach) + 8}
              y={yOf(rows[rows.length - 1][s.key]) + 3}
              fill={s.color}
              fontSize={10}
              fontFamily="monospace"
            >
              {s.label}
            </text>
          </g>
        );
      })}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        reach R = delta(N_max+1)
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        relative C_fit error
      </text>
    </svg>
  );
}

export default function Imp95810ReachUniversalityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Szego Reach-Universality Cross-Validation (imp-95786)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The finite-grid low bias in the Szego edge-coefficient fit
        C_fit&nbsp;&asymp;&nbsp;pi^2/(2&nbsp;delta^2) is ~ a function of the reach
        R&nbsp;=&nbsp;delta(N_max+1) alone. At fixed R the three float64-clean deltas
        (ln&nbsp;1.6&nbsp;/&nbsp;1.5&nbsp;/&nbsp;1.45) agree to &lt;~0.5% absolute and decay
        monotonically toward zero. ln&nbsp;1.4 dips sub-1% at reach&nbsp;260 but then
        DEGRADES at larger reach as float64 sinks toward the cancellation floor &mdash;
        marking the precision-wall boundary rather than joining the clean cohort.
      </p>

      <ReachChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>reach R</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ln 1.6</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ln 1.5</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ln 1.45</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ln 1.4</th>
          </tr>
        </thead>
        <tbody>
          {IMP95810_REACH_ROWS.map((r) => (
            <tr key={r.reach} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.reach}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {(r.ln16 * 100).toFixed(2)}%
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {(r.ln15 * 100).toFixed(2)}%
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {(r.ln145 * 100).toFixed(2)}%
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.ln14 === null ? '—' : `${(r.ln14 * 100).toFixed(2)}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginTop: '1.75rem' }}>
        Sub-1% crossing reaches R*
      </h3>
      <table
        style={{
          width: '100%',
          marginTop: '0.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>delta</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>R*</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N_max*</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>250/delta law</th>
          </tr>
        </thead>
        <tbody>
          {IMP95810_CROSSINGS.map((c) => (
            <tr key={c.delta} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.delta}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.rStar.toFixed(1)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.nMaxStar}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.nMax250Law}</td>
            </tr>
          ))}
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink-soft)' }}>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>ln 1.4</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }} colSpan={3}>
              no clean R* &mdash; {IMP95810_LN14_WALL.note}
            </td>
          </tr>
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
        <strong style={{ color: 'var(--brass)' }}>
          Open residual ({IMP95810_OPEN_RESIDUAL.status}, {IMP95810_OPEN_RESIDUAL.id}):
        </strong>{' '}
        {IMP95810_OPEN_RESIDUAL.question}
        <div style={{ marginTop: '0.4rem', color: 'var(--ink-soft)' }}>{IMP95810_OPEN_RESIDUAL.context}</div>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95810_CAVEAT_BANNER}
      </div>
    </div>
  );
}
