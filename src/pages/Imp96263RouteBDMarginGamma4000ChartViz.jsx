import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96263_COLUMN,
  IMP96263_FIT_CURVE,
  IMP96263_REFIT,
  IMP96263_ENVELOPE,
  IMP96263_FLOOR_BY_DEPTH,
  IMP96263_HONEST_BANNER,
} from '../data/imp-96263-route-bd-margin-gamma4000-viz-data.js';
import { ED } from '../styles/tokens.js';

function MarginChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 54;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const tMin = IMP96263_COLUMN[0].T;
  const tMax = IMP96263_COLUMN[IMP96263_COLUMN.length - 1].T;
  const lnMin = Math.log(tMin);
  const lnMax = Math.log(tMax);
  const xOf = (T) => padL + ((Math.log(T) - lnMin) / (lnMax - lnMin)) * plotW;

  const yMax = 0.85;
  const yOf = (rho) => padT + plotH - (rho / yMax) * plotH;

  const xTicks = [60, 200, 500, 1000, 2000, 4506];
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8];

  const logLinearPath = IMP96263_FIT_CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.T).toFixed(2)} ${yOf(p.logLinear).toFixed(2)}`).join(' ');
  const reciprocalLogPath = IMP96263_FIT_CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.T).toFixed(2)} ${yOf(p.reciprocalLog).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* zero baseline -- the positivity envelope floor */}
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke={ED.series2} strokeDasharray="2 3" strokeWidth={1} opacity={0.6} />
      <text x={padL + plotW - 2} y={yOf(0) - 4} textAnchor="end" fill={ED.series2} fontSize={8.5}>rho=0 (no crossing observed)</text>

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(1)}</text>
        </g>
      ))}
      {xTicks.map((T) => (
        <g key={`x${T}`}>
          <line x1={xOf(T)} y1={padT} x2={xOf(T)} y2={padT + plotH} stroke={ED.rule} strokeWidth={0.5} opacity={0.3} />
          <text x={xOf(T)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>{T}</text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={reciprocalLogPath} fill="none" stroke={ED.series5} strokeWidth={1.5} opacity={0.85} />
      <path d={logLinearPath} fill="none" stroke={ED.series1} strokeWidth={1.5} opacity={0.85} />

      {IMP96263_COLUMN.map((r) => (
        <circle key={`${r.stage}-${r.T}`} cx={xOf(r.T)} cy={yOf(r.rho)} r={2.6} fill={ED.series3} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>T (log scale)</text>
      <text x={14} y={padT + plotH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5} transform={`rotate(-90 14 ${padT + plotH / 2})`}>
        rho(32,T)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <circle cx={4} cy={0} r={2.6} fill={ED.series3} />
        <text x={12} y={3} fill={ED.inkSoft} fontSize={8.5}>measured column (34 pts)</text>
        <line x1={0} y1={13} x2={8} y2={13} stroke={ED.series1} strokeWidth={1.5} />
        <text x={12} y={16} fill={ED.inkSoft} fontSize={8.5}>log-linear fit (no floor)</text>
        <line x1={0} y1={26} x2={8} y2={26} stroke={ED.series5} strokeWidth={1.5} />
        <text x={12} y={29} fill={ED.inkSoft} fontSize={8.5}>reciprocal-log fit (floor {IMP96263_REFIT.reciprocalLogFloor.floor.toFixed(5)})</text>
      </g>
    </svg>
  );
}

export default function Imp96263RouteBDMarginGamma4000ChartViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96224: Worst-Support On-Line Margin ρ(32,T) — Full 34-Point Column to γ₄₀₀₀" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96263_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Green dots are the full 34-point worst-support (N=32) on-line signed-force margin column,
        merging the imp-96148 baked cutoffs (T~60&ndash;396), the imp-96167/imp-96186/imp-96209
        extension cutoffs (T~500&ndash;2515), and the imp-96224 gamma_4000 extension (T~2600&ndash;4506).
        Both candidate laws are overlaid as fitted (not re-fit) curves: the blue log-linear (no-floor)
        line now has the clearly better R&sup2; ({IMP96263_REFIT.logLinear.R2.toFixed(5)}), while
        the purple reciprocal-log-floor curve ({IMP96263_REFIT.reciprocalLogFloor.R2.toFixed(5)}) is
        pinned to a floor that has fallen to {IMP96263_REFIT.reciprocalLogFloor.floor.toFixed(5)}. Every
        observed and fitted value stays strictly above the red zero line across the whole census.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        rho(32,T) column with both fitted laws (log-x scale)
      </h3>
      <MarginChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the strict-positivity /
        no-crossing envelope holds throughout &mdash; the measured minimum
        ({IMP96263_ENVELOPE.minObservedRho.toFixed(4)} at T~{Math.round(IMP96263_ENVELOPE.lastCensusT)})
        stays far above zero, and even the log-linear fit&rsquo;s naive zero-crossing
        (T~{Math.round(IMP96263_ENVELOPE.logLinearNaiveCrossT).toLocaleString()}) recedes to over{' '}
        {Math.round(IMP96263_ENVELOPE.crossExceedsCensusBy)}&times; beyond the last census cutoff.
        What deepening to gamma_4000 settles is the drift direction: the reciprocal-log floor keeps
        FALLING every time the census deepens (
        {IMP96263_FLOOR_BY_DEPTH.gamma1000.toFixed(5)} &rarr;{' '}
        {IMP96263_FLOOR_BY_DEPTH.gamma2000.toFixed(5)} &rarr;{' '}
        {IMP96263_FLOOR_BY_DEPTH.gamma4000.toFixed(5)}), nearly halving per doubling with no plateau
        &mdash; consistent with the floor trending to zero rather than a settled positive asymptote, so
        the on-line margin&rsquo;s sign is settled but its asymptotic value now favours the no-floor law.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96224
        baked column and refit literals verbatim (only the plotted curve samples are computed here,
        by evaluating the already-fitted formulas). Changes no bound, establishes no operator
        positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
