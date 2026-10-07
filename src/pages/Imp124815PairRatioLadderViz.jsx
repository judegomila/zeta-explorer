import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP124815_PAIR_RATIO_LADDER_ROWS, IMP124815_SUMMARY } from '../data/imp-124815-pairratio-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const log10 = (v) => Math.log10(v);

function RatioSeriesChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const rows = IMP124815_PAIR_RATIO_LADDER_ROWS;
  const logMeasured = rows.map((r) => log10(r.measured_ECF_over_EET));
  const logTarget = rows.map((r) => log10(r.target_Eflow_over_Etrunc));
  const yMin = Math.floor(Math.min(...logMeasured, ...logTarget)) - 0.5;
  const yMax = Math.ceil(Math.max(...logMeasured, ...logTarget)) + 0.5;

  const xS = (i) => padL + (i / (rows.length - 1)) * cW;
  const yS = (logV) => padT + cH * (1 - (logV - yMin) / (yMax - yMin));

  const measuredPath = rows.map((r, i) => (i === 0 ? 'M' : 'L') + xS(i).toFixed(1) + ',' + yS(logMeasured[i]).toFixed(2)).join(' ');
  const targetPath = rows.map((r, i) => (i === 0 ? 'M' : 'L') + xS(i).toFixed(1) + ',' + yS(logTarget[i]).toFixed(2)).join(' ');

  const yTicks = [];
  for (let t = Math.ceil(yMin); t <= Math.floor(yMax); t++) yTicks.push(t);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(t) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            1e{t}
          </text>
        </g>
      ))}

      <path d={targetPath} fill="none" stroke={ED.series5} strokeWidth={3.5} strokeOpacity={0.55} />
      <path d={measuredPath} fill="none" stroke={ED.series1} strokeWidth={1.5} strokeDasharray="4 3" />
      {rows.map((r, i) => (
        <circle key={r.key} cx={xS(i)} cy={yS(logMeasured[i])} r={2.6} fill={ED.series1} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {rows.map((r, i) => (
        <g key={'x' + r.key}>
          <line x1={xS(i)} y1={padT + cH} x2={xS(i)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(i)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {r.key}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        landmark (sigma 0.9 -&gt; 0.001, N_L climbing 2.6e7 -&gt; 5.4e15)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        ratio (log scale)
      </text>
    </svg>
  );
}

function ReldiffChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const rows = IMP124815_PAIR_RATIO_LADDER_ROWS;
  const logAbs = rows.map((r) => log10(r.abs_reldiff));
  const yMin = Math.floor(Math.min(...logAbs)) - 0.5;
  const yMax = Math.ceil(Math.max(...logAbs)) + 0.5;
  const barW = (cW / rows.length) * 0.5;

  const xS = (i) => padL + ((i + 0.5) / rows.length) * cW;
  const yS = (logV) => padT + cH * (1 - (logV - yMin) / (yMax - yMin));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />
      {rows.map((r, i) => (
        <rect
          key={r.key}
          x={xS(i) - barW / 2}
          y={yS(logAbs[i])}
          width={barW}
          height={padT + cH - yS(logAbs[i])}
          fill={ED.brassDeco}
        />
      ))}
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      {rows.map((r, i) => (
        <g key={'x' + r.key}>
          <text x={xS(i)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {r.key}
          </text>
          <text x={xS(i)} y={yS(logAbs[i]) - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={8}>
            {r.abs_reldiff.toExponential(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        |reldiff| growing as the flow share collapses (log scale)
      </text>
    </svg>
  );
}

export default function Imp124815PairRatioLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Pair-Ratio Identity Ladder: Measured vs Analytic (imp-124770)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-97665 derived the EXACT pair-ratio identity E_CF/E_ET = E_flow/E_trunc for the
        crossing-elasticity axes. imp-124770 tabulated it as a ladder across the imp-97520
        landmarks L2..L7 (sigma 0.9 down to 0.001, N_L climbing seven decades from 2.6e7 to
        5.4e15). The measured 5-point E_CF/E_ET tracks the analytic E_flow/E_trunc target closely
        at every rung, while the relative disagreement between the two grows monotonically as the
        flow share E_flow/E_N collapses toward the far tail -- a stencil / round-off artefact, not
        a deviation from the identity.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', fontStyle: 'italic', marginBottom: '1rem', maxWidth: 760 }}>
        Honest status: this page reads as a conditional-share diagnostic -- it tracks how the
        E_CF/E_ET ratio tracks the flow share E_flow/E_N as that share collapses down the ladder,
        nothing more. It moves no bound and establishes no operator positivity; the
        Platt-Trudgian Lambda &lt;= 0.2 figure remains state of the art; RH open; NO QED.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        measured E_CF/E_ET vs analytic E_flow/E_trunc across L2..L7
      </p>
      <RatioSeriesChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        |reldiff| = (E_CF/E_ET) / (E_flow/E_trunc) - 1, growing down the ladder
      </p>
      <ReldiffChart />

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--ink-faint)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span><span style={{ color: 'var(--series-5)' }}>&#9644;</span> analytic target E_flow/E_trunc</span>
        <span><span style={{ color: 'var(--series-1)' }}>&#9644;</span> measured 5-point E_CF/E_ET</span>
        <span><span style={{ color: 'var(--brass)' }}>&#9644;</span> |reldiff| between the two</span>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP124815_SUMMARY.verdict}
      </div>
    </div>
  );
}
