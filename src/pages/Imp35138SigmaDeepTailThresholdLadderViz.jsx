import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35138_SIGMA_DEEP_TAIL_THRESHOLD_LADDER_VIZ_DATA } from '../data/imp-35138-sigma-deep-tail-threshold-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const D = IMP35138_SIGMA_DEEP_TAIL_THRESHOLD_LADDER_VIZ_DATA;
const GRID = D.grid;

const LANDMARKS = [
  { log10N: Math.log10(D.thresholdCrossings.sigma_below_0_5_at_N), label: 'σ=0.5 (N~3.27e9)', color: ED.series1 },
  { log10N: Math.log10(D.thresholdCrossings.sigma_below_0_1_at_N), label: 'σ=0.1 (N~3.21e11)', color: ED.brass },
  { log10N: Math.log10(D.thresholdCrossings.sigma_below_0_01_at_N), label: 'σ=0.01 (N~4.62e13)', color: ED.series4 },
  { log10N: Math.log10(D.thresholdCrossings.sigma_below_0_001_at_N), label: 'σ=0.001 (N~5.43e15)', color: ED.series2 },
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
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Conditional share &sigma;(N) = E_coll/E(N), log-log, N in [1e6, 1e16] (imp-35041)
      </text>
      {[0.5, 0.1, 0.01, 0.001, 0.0001].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
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
      <path d={path} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[6, 8, 10, 12, 14, 16].map((dec) => (
        <text key={dec} x={xOf(dec)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
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
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Decade spacing per factor-10 drop in &sigma;, converging on the far-tail sqrt(1/N) signature
      </text>
      <line
        x1={padL}
        y1={yOf(2)}
        x2={padL + plotW}
        y2={yOf(2)}
        stroke={ED.series2}
        strokeWidth={1.25}
        strokeDasharray="4 3"
      />
      <text x={padL + plotW - 150} y={yOf(2) - 4} fill={ED.series2} fontSize={9}>
        sqrt(1/N) asymptote: 2 decades
      </text>
      {bars.map((b, i) => (
        <g key={b.key}>
          <rect
            x={padL + i * barW + barW * 0.2}
            y={yOf(b.value)}
            width={barW * 0.6}
            height={padT + plotH - yOf(b.value)}
            fill={ED.series5}
            fillOpacity={0.55}
            stroke={ED.series5}
            strokeWidth={1}
          />
          <text
            x={padL + i * barW + barW / 2}
            y={yOf(b.value) - 6}
            textAnchor="middle"
            fill={ED.ink}
            fontSize={10}
          >
            {b.value.toFixed(2)}
          </text>
          <text
            x={padL + i * barW + barW / 2}
            y={padT + plotH + 16}
            textAnchor="middle"
            fill={ED.inkFaint}
            fontSize={9}
          >
            {b.key}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
    </svg>
  );
}

export default function Imp35138SigmaDeepTailThresholdLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma(N) Deep-Tail Threshold Ladder (imp-35138 / imp-35041)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
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
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>threshold</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>&sigma; &lt; 0.5</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.thresholdCrossings.sigma_below_0_5_at_N.toExponential(4)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>&sigma; &lt; 0.1</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.thresholdCrossings.sigma_below_0_1_at_N.toExponential(4)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>&sigma; &lt; 0.01</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.thresholdCrossings.sigma_below_0_01_at_N.toExponential(4)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>&sigma; &lt; 0.001</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {D.thresholdCrossings.sigma_below_0_001_at_N.toExponential(4)}
            </td>
          </tr>
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        E_flow stays negligible throughout the deep tail: E_flow/E_coll &asymp;{' '}
        {D.eflowNegligibility.eflow_over_ecoll_at_0_01.toExponential(2)} at the 0.01 crossing and &asymp;{' '}
        {D.eflowNegligibility.eflow_over_ecoll_at_0_001.toExponential(2)} at the 0.001 crossing, so both new
        crossings are set purely by the E_coll-vs-E_trunc balance.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-35041
        deep-tail threshold-crossing literals verbatim via the shared sigma-n-subterms.js helper (no new
        computation). Measurement on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic;
        C_mb GUE-conditional per imp-486 untouched; establishes no operator positivity; imp-3066
        K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; no RH verdict, NO QED.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Not effectively unconditional (imp-35334):</strong> at the
        &sigma;&nbsp;&lt;&nbsp;0.001 landmark shown above, &ge;99.9% of the surviving E(N) bridge is the
        constant E_trunc floor -- and E_trunc is only rigorous-modulo-C_T (imp-34791: an unported
        barrier-lemma conditionality, NOT GUE). So the far tail does not become unconditional; it trades
        the vanishing GUE-conditional E_coll for a bridge pinned by the C_T-conditional E_trunc. The
        chart's rightward drift toward &sigma;&nbsp;&rarr;&nbsp;0 tracks a shrinking GUE dependence, not a
        shrinking conditionality overall.
      </div>
    </div>
  );
}
