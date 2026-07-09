import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35138_SIGMA_DEEP_TAIL_THRESHOLD_LADDER_VIZ_DATA } from '../data/imp-35138-sigma-deep-tail-threshold-ladder-viz-data.js';

const D = IMP35138_SIGMA_DEEP_TAIL_THRESHOLD_LADDER_VIZ_DATA;
const GRID = D.grid;

const LANDMARKS = [
  { log10N: Math.log10(D.thresholdCrossings.sigma_below_0_5_at_N), label: 'σ=0.5 (N~3.27e9)', color: '#38bdf8' },
  { log10N: Math.log10(D.thresholdCrossings.sigma_below_0_1_at_N), label: 'σ=0.1 (N~3.21e11)', color: '#facc15' },
  { log10N: Math.log10(D.thresholdCrossings.sigma_below_0_01_at_N), label: 'σ=0.01 (N~4.62e13)', color: '#fb923c' },
  { log10N: Math.log10(D.thresholdCrossings.sigma_below_0_001_at_N), label: 'σ=0.001 (N~5.43e15)', color: '#f87171' },
];

// sigma(N) on a log10(N) x-axis, log10(sigma) y-axis, spanning the full deep-tail range with
// all four threshold-crossing landmarks marked.
function SigmaDeepTailChart() {
  const svgW = 680;
  const padL = 50;
  const padR = 20;
  const padT = 44;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xMin = GRID[0].log10N;
  const xMax = GRID[GRID.length - 1].log10N;
  const yMin = Math.log10(GRID[GRID.length - 1].sigma) - 0.3;
  const yMax = 0;
  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (sigma) => padT + plotH - ((Math.log10(sigma) - yMin) / (yMax - yMin)) * plotH;

  const path = GRID.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.log10N)} ${yOf(r.sigma)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill="#94a3b8" fontSize={11} fontWeight={700}>
        Conditional share &sigma;(N) = E_coll/E(N), log-log, N in [1e6, 1e16] (imp-35041)
      </text>
      {[0.5, 0.1, 0.01, 0.001, 0.0001].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {LANDMARKS.map((m) => (
        <line
          key={m.label}
          x1={xOf(m.log10N)}
          y1={padT}
          x2={xOf(m.log10N)}
          y2={padT + plotH}
          stroke={m.color}
          strokeWidth={1.25}
          strokeDasharray="4 3"
        />
      ))}
      <path d={path} fill="none" stroke="#a78bfa" strokeWidth={2.25} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {[6, 8, 10, 12, 14, 16].map((dec) => (
        <text key={dec} x={xOf(dec)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
          1e{dec}
        </text>
      ))}
      {LANDMARKS.map((m, i) => (
        <g key={`legend-${m.label}`}>
          <circle cx={padL + 4} cy={padT - 12 - i * 12} r={3} fill={m.color} />
          <text x={padL + 12} y={padT - 8 - i * 12} fill={m.color} fontSize={8.5}>
            {m.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Per-factor-10 decade-spacing bars, converging on the imp-3463 far-tail 2-decades-per-10x asymptote.
function DecadeSpacingChart() {
  const svgW = 680;
  const padL = 50;
  const padR = 20;
  const padT = 28;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 140;
  const svgH = padT + plotH + padB;

  const bars = [
    { key: '0.5→0.1', value: D.decadeSpacing.from_0_5_to_0_1 },
    { key: '0.1→0.01', value: D.decadeSpacing.from_0_1_to_0_01 },
    { key: '0.01→0.001', value: D.decadeSpacing.from_0_01_to_0_001 },
  ];
  const yMax = 2.5;
  const barW = plotW / bars.length;
  const yOf = (v) => padT + plotH - (v / yMax) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 10} fill="#94a3b8" fontSize={11} fontWeight={700}>
        Decade spacing per factor-10 drop in &sigma;, converging on the far-tail sqrt(1/N) signature
      </text>
      <line
        x1={padL}
        y1={yOf(2)}
        x2={padL + plotW}
        y2={yOf(2)}
        stroke="#f87171"
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 150} y={yOf(2) - 4} fill="#f87171" fontSize={9}>
        sqrt(1/N) asymptote: 2 decades
      </text>
      {bars.map((b, i) => (
        <g key={b.key}>
          <rect
            x={padL + i * barW + barW * 0.2}
            y={yOf(b.value)}
            width={barW * 0.6}
            height={padT + plotH - yOf(b.value)}
            fill="#a78bfa"
            fillOpacity={0.55}
            stroke="#a78bfa"
            strokeWidth={1}
          />
          <text
            x={padL + i * barW + barW / 2}
            y={yOf(b.value) - 6}
            textAnchor="middle"
            fill="#cbd5e1"
            fontSize={10}
          >
            {b.value.toFixed(2)}
          </text>
          <text
            x={padL + i * barW + barW / 2}
            y={padT + plotH + 16}
            textAnchor="middle"
            fill="#64748b"
            fontSize={9}
          >
            {b.key}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
    </svg>
  );
}

export default function Imp35138SigmaDeepTailThresholdLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N) Deep-Tail Threshold Ladder (imp-35138 / imp-35041)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-33582 mapped the E(N)-bridge conditional share &sigma;(N) = E_coll/E(N) down to
        &sigma;&nbsp;&lt;&nbsp;0.1 at N&nbsp;&sim;&nbsp;3.21e11. imp-35041 extended the same threshold map
        two decades deeper: &sigma; first drops below 0.01 at N&nbsp;&sim;&nbsp;4.62e13 and below 0.001 at
        N&nbsp;&sim;&nbsp;5.43e15, with the per-factor-10 crossing spacing (1.99, 2.16, 2.07 decades)
        clustering near the far-tail sqrt(1/N) asymptote of 2 decades per factor-10. This page renders the
        full &sigma;(N) curve across N&nbsp;in&nbsp;[1e6,&nbsp;1e16] with all four crossings marked, plus the
        decade-spacing ladder itself, for the first time.
      </p>

      <SigmaDeepTailChart />
      <div style={{ marginTop: '1.5rem' }}>
        <DecadeSpacingChart />
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>threshold</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>&sigma; &lt; 0.5</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.thresholdCrossings.sigma_below_0_5_at_N.toExponential(4)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>&sigma; &lt; 0.1</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.thresholdCrossings.sigma_below_0_1_at_N.toExponential(4)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>&sigma; &lt; 0.01</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.thresholdCrossings.sigma_below_0_01_at_N.toExponential(4)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>&sigma; &lt; 0.001</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.thresholdCrossings.sigma_below_0_001_at_N.toExponential(4)}
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem' }}>
        E_flow stays negligible throughout the deep tail: E_flow/E_coll &asymp;{' '}
        {D.eflowNegligibility.eflow_over_ecoll_at_0_01.toExponential(2)} at the 0.01 crossing and &asymp;{' '}
        {D.eflowNegligibility.eflow_over_ecoll_at_0_001.toExponential(2)} at the 0.001 crossing, so both new
        crossings are set purely by the E_coll-vs-E_trunc balance.
      </p>

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> Viz-only page rendering the imp-35041
        deep-tail threshold-crossing literals verbatim via the shared sigma-n-subterms.js helper (no new
        computation). Measurement on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic;
        C_mb GUE-conditional per imp-486 untouched; establishes no operator positivity; imp-3066
        K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; no RH verdict, NO QED. Platt-Trudgian
        Lambda&nbsp;&le;&nbsp;0.2 remains SOTA.
      </div>
    </div>
  );
}
