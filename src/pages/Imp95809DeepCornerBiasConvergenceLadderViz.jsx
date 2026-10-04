import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95809_CELL,
  IMP95809_FINF,
  IMP95809_LOG_ROWS,
  IMP95809_LOG_N_MIN,
  IMP95809_LOG_N_MAX,
  IMP95809_LOG_BIAS_MIN,
  IMP95809_LOG_BIAS_MAX,
  IMP95809_CAVEAT_BANNER,
} from '../data/imp-95809-deep-corner-bias-convergence-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// Log-log chart of biasPct vs N: the monotone super-linear descent of the
// finite-size bias toward zero as the finite-80 truncation is extended.
function BiasLadderChart() {
  const svgW = 480;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xPad = 0.06;
  const yPad = 0.08;
  const xSpan = IMP95809_LOG_N_MAX - IMP95809_LOG_N_MIN;
  const ySpan = IMP95809_LOG_BIAS_MAX - IMP95809_LOG_BIAS_MIN;
  const xOf = (logN) =>
    padL + ((logN - IMP95809_LOG_N_MIN) / xSpan + xPad) * (plotW / (1 + 2 * xPad));
  const yOf = (logB) =>
    padT +
    plotH -
    ((logB - IMP95809_LOG_BIAS_MIN) / ySpan + yPad) * (plotH / (1 + 2 * yPad));

  const points = IMP95809_LOG_ROWS.map((r) => `${xOf(r.logN)},${yOf(r.logBias)}`).join(' ');

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

      <polyline points={points} fill="none" stroke={ED.series1} strokeWidth={2} />

      {IMP95809_LOG_ROWS.map((r, i) => (
        <g key={r.nPoints}>
          <circle
            cx={xOf(r.logN)}
            cy={yOf(r.logBias)}
            r={4.5}
            fill={i === 0 ? ED.series2 : ED.series1}
          />
          <text
            x={xOf(r.logN)}
            y={yOf(r.logBias) - 10}
            textAnchor="middle"
            fill={i === 0 ? ED.series2 : ED.inkSoft}
            fontSize={9.5}
            fontFamily="monospace"
          >
            N={r.nPoints}
          </text>
          <text
            x={xOf(r.logN)}
            y={yOf(r.logBias) + 18}
            textAnchor="middle"
            fill={ED.inkFaint}
            fontSize={9}
            fontFamily="monospace"
          >
            {r.biasPct.toFixed(2)}%
          </text>
        </g>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (lattice points), log scale
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        biasPct, log scale
      </text>
    </svg>
  );
}

export default function Imp95809DeepCornerBiasConvergenceLadderViz() {
  const first = IMP95809_LOG_ROWS[0];
  const last = IMP95809_LOG_ROWS[IMP95809_LOG_ROWS.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Deep-Corner Finite-N Bias Convergence Ladder (imp-95788)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        At the deepest twin-pair block-Toeplitz cell (delta&nbsp;=&nbsp;{IMP95809_CELL.delta},
        rho&nbsp;=&nbsp;{IMP95809_CELL.rho}), imp-95788 re-ran the imp-95762 double-double
        eigensolver at N&nbsp;=&nbsp;80,&nbsp;120,&nbsp;160,&nbsp;200 lattice points against the
        fixed imp-95744 dual infimum F_inf&nbsp;=&nbsp;{IMP95809_FINF.toExponential(4)}. The
        finite-size bias biasPct&nbsp;=&nbsp;100*(lambda_min/F_inf&nbsp;-&nbsp;1) collapses
        monotonically from {first.biasPct.toFixed(2)}% at N&nbsp;=&nbsp;{first.nPoints} to{' '}
        {last.biasPct.toFixed(2)}% at N&nbsp;=&nbsp;{last.nPoints} &mdash; a super-linear (faster
        than 1/N) descent on log-log axes toward zero, confirming F_inf as the true N&nbsp;
        &rarr;&nbsp;infinity limit.
      </p>

      <BiasLadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>N (points)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>lambda_min (DD)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>biasPct</th>
          </tr>
        </thead>
        <tbody>
          {IMP95809_LOG_ROWS.map((r) => (
            <tr key={r.nPoints} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.nPoints}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.lminDD.toExponential(6)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.biasPct.toFixed(4)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95809_CAVEAT_BANNER}
      </div>
    </div>
  );
}
