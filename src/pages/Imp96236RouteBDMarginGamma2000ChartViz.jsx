import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96236_COLUMN,
  IMP96236_FIT_CURVE,
  IMP96236_REFIT,
  IMP96236_ENVELOPE,
  IMP96236_HONEST_BANNER,
} from '../data/imp-96236-route-bd-margin-gamma2000-viz-data.js';

function MarginChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 54;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const tMin = IMP96236_COLUMN[0].T;
  const tMax = IMP96236_COLUMN[IMP96236_COLUMN.length - 1].T;
  const lnMin = Math.log(tMin);
  const lnMax = Math.log(tMax);
  const xOf = (T) => padL + ((Math.log(T) - lnMin) / (lnMax - lnMin)) * plotW;

  const yMax = 0.85;
  const yOf = (rho) => padT + plotH - (rho / yMax) * plotH;

  const xTicks = [60, 200, 500, 1000, 2000, 2515];
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8];

  const logLinearPath = IMP96236_FIT_CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.T).toFixed(2)} ${yOf(p.logLinear).toFixed(2)}`).join(' ');
  const reciprocalLogPath = IMP96236_FIT_CURVE.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.T).toFixed(2)} ${yOf(p.reciprocalLog).toFixed(2)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* zero baseline -- the positivity envelope floor */}
      <line x1={padL} y1={yOf(0)} x2={padL + plotW} y2={yOf(0)} stroke="#f87171" strokeDasharray="2 3" strokeWidth={1} opacity={0.6} />
      <text x={padL + plotW - 2} y={yOf(0) - 4} textAnchor="end" fill="#f87171" fontSize={8.5}>rho=0 (no crossing observed)</text>

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#334155" strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>{v.toFixed(1)}</text>
        </g>
      ))}
      {xTicks.map((T) => (
        <g key={`x${T}`}>
          <line x1={xOf(T)} y1={padT} x2={xOf(T)} y2={padT + plotH} stroke="#334155" strokeWidth={0.5} opacity={0.3} />
          <text x={xOf(T)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={8.5}>{T}</text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      <path d={reciprocalLogPath} fill="none" stroke="#a78bfa" strokeWidth={1.5} opacity={0.85} />
      <path d={logLinearPath} fill="none" stroke="#38bdf8" strokeWidth={1.5} opacity={0.85} />

      {IMP96236_COLUMN.map((r) => (
        <circle key={`${r.stage}-${r.T}`} cx={xOf(r.T)} cy={yOf(r.rho)} r={2.6} fill="#4ade80" />
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>T (log scale)</text>
      <text x={14} y={padT + plotH / 2} textAnchor="middle" fill="#64748b" fontSize={9.5} transform={`rotate(-90 14 ${padT + plotH / 2})`}>
        rho(32,T)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <circle cx={4} cy={0} r={2.6} fill="#4ade80" />
        <text x={12} y={3} fill="#94a3b8" fontSize={8.5}>measured column (26 pts)</text>
        <line x1={0} y1={13} x2={8} y2={13} stroke="#38bdf8" strokeWidth={1.5} />
        <text x={12} y={16} fill="#94a3b8" fontSize={8.5}>log-linear fit (no floor)</text>
        <line x1={0} y1={26} x2={8} y2={26} stroke="#a78bfa" strokeWidth={1.5} />
        <text x={12} y={29} fill="#94a3b8" fontSize={8.5}>reciprocal-log fit (floor {IMP96236_REFIT.reciprocalLogFloor.floor.toFixed(5)})</text>
      </g>
    </svg>
  );
}

export default function Imp96236RouteBDMarginGamma2000ChartViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96209: Worst-Support On-Line Margin ρ(32,T) — Full 26-Point Column to γ₂₀₀₀" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96236_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Green dots are the full 26-point worst-support (N=32) on-line signed-force margin column,
        merging the imp-96148 baked cutoffs (T~60&ndash;396), the imp-96167/imp-96186 extension
        cutoffs (T~500&ndash;1419), and the imp-96209 gamma_2000 extension (T~1500&ndash;2515). Both
        candidate laws are overlaid as fitted (not re-fit) curves: the blue log-linear (no-floor)
        line now has the marginally better R&sup2; ({IMP96236_REFIT.logLinear.R2.toFixed(5)}), while
        the purple reciprocal-log-floor curve ({IMP96236_REFIT.reciprocalLogFloor.R2.toFixed(5)}) is
        pinned to a still-falling floor of {IMP96236_REFIT.reciprocalLogFloor.floor.toFixed(5)}. Every
        observed and fitted value stays strictly above the red zero line across the whole census.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        rho(32,T) column with both fitted laws (log-x scale)
      </h3>
      <MarginChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the strict-positivity /
        no-crossing envelope holds throughout &mdash; the measured minimum
        ({IMP96236_ENVELOPE.minObservedRho.toFixed(4)} at T~{Math.round(IMP96236_ENVELOPE.lastCensusT)})
        stays far above zero, and even the log-linear fit&rsquo;s naive zero-crossing
        (T~{Math.round(IMP96236_ENVELOPE.logLinearNaiveCrossT).toLocaleString()}) recedes to over{' '}
        {Math.round(IMP96236_ENVELOPE.crossExceedsCensusBy)}&times; beyond the last census cutoff.
        What is unsettled is only which curve the column will asymptote to: the reciprocal-log floor
        has fallen every time the census deepened (0.14256 &rarr; 0.16030 &rarr; 0.11063 &rarr;{' '}
        {IMP96236_REFIT.reciprocalLogFloor.floor.toFixed(5)}), and its R&sup2; edge over the log-linear
        law has now flipped sign &mdash; so the on-line margin&rsquo;s sign is settled but its
        asymptotic value is not.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96209
        baked column and refit literals verbatim (only the plotted curve samples are computed here,
        by evaluating the already-fitted formulas). Changes no bound, establishes no operator
        positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
