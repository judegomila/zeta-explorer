import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96670_SERIES,
  IMP96670_N_LADDER,
  IMP96670_CEILING_TABLE,
  IMP96670_GAP_SUMMARY,
  IMP96670_HONEST_BANNER,
} from '../data/imp-96670-route-m-lammax-majorants-viz-data.js';
import { ED } from '../styles/tokens.js';

const COLORS = {
  lamMax: ED.ink,
  trace: ED.series1,
  rowsum: ED.series2,
  brauer: ED.series4,
  frobenius: ED.series3,
  ws: ED.series3,
};

// six-curve chart on a log(N) x-axis: measured lam_max + trace baseline +
// the two failing row-sum majorants (above trace) + the two sharper
// moment majorants (just above lam_max, below trace).
function MajorantsPanel() {
  const ns = IMP96670_N_LADDER;
  const svgW = 720;
  const padL = 48;
  const padR = 20;
  const svgH = 340;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = ns.map((n) => Math.log(n));
  const minX = Math.min(...xs) * 0.98;
  const maxX = Math.max(...xs) * 1.02;
  const allY = IMP96670_SERIES.flatMap((s) => s.values);
  const minY = 0;
  const maxY = Math.max(...allY) * 1.08;

  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[minY, maxY / 2, maxY].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}
      {IMP96670_SERIES.map((s) => (
        <g key={s.key}>
          <polyline
            points={ns.map((n, i) => `${xOf(Math.log(n))},${yOf(s.values[i])}`).join(' ')}
            fill="none"
            stroke={COLORS[s.key]}
            strokeWidth={s.kind === 'worse' ? 1.3 : 1.9}
            strokeDasharray={s.kind === 'worse' ? '4 3' : undefined}
          />
          {ns.map((n, i) => (
            <circle key={`${s.key}${n}`} cx={xOf(Math.log(n))} cy={yOf(s.values[i])} r={2.4} fill={COLORS[s.key]} />
          ))}
        </g>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N (log scale, ticks at the accessible ladder rungs 250..6000)
      </text>
    </svg>
  );
}

function ceilingBar(entry, maxLog10) {
  const widthPct = Math.max(2, (entry.log10CeilingN / maxLog10) * 100);
  const color =
    entry.kind === 'worse' ? ED.series2 : entry.kind === 'sharper' ? ED.series3 : entry.kind === 'compute' ? ED.inkSoft : ED.series1;
  return (
    <div key={entry.key} style={{ marginBottom: '0.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
        <span>{entry.label}</span>
        <span>{entry.ceilingN.toExponential(3)}</span>
      </div>
      <div style={{ height: 6, background: 'color-mix(in srgb, var(--ink-soft) 12%, transparent)', borderRadius: 3 }}>
        <div style={{ width: `${widthPct}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

export default function Imp96670RouteMLammaxMajorantsViz() {
  const maxLog10 = Math.max(...IMP96670_CEILING_TABLE.map((c) => c.log10CeilingN)) * 1.02;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M lam_max Majorants: Row-Sum vs Moment Family" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96670_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96648 measured four rigorous, unconditional upper bounds on lam_max(N) for the exact
        Route M Vasyunin Gram, alongside the measured power-iteration lam_max and the imp-96548
        trace bound. The Gershgorin row-sum and Brauer/Cassini bounds (dashed, red/orange) count
        sign-cancelling off-diagonal mass by magnitude and grow FASTER than trace, giving a
        LOWER conditioning ceiling. The Frobenius and Wolkowicz-Styan two-moment bounds (green)
        sit just above the true lam_max and BELOW trace, giving a sharper, higher ceiling.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Six curves over the accessible N=250..6000 ladder
      </h3>
      <MajorantsPanel />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        {IMP96670_SERIES.map((s) => (
          <span key={s.key} style={{ color: COLORS[s.key] }}>
            &#9632; {s.label}
          </span>
        ))}
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.75rem' }}>
        Re-solved double-precision conditioning ceilings (N, log scale)
      </h3>
      <div style={{ maxWidth: 700 }}>
        {IMP96670_CEILING_TABLE.map((c) => ceilingBar(c, maxLog10))}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the Frobenius /
        Wolkowicz-Styan majorant raises the rigorous lower conditioning ceiling from{' '}
        {IMP96670_CEILING_TABLE.find((c) => c.key === 'trace').ceilingN.toExponential(3)} (trace) to{' '}
        {IMP96670_GAP_SUMMARY.bestSharperCeilingN.toExponential(3)} (
        {IMP96670_GAP_SUMMARY.bestOverTraceFactor.toFixed(3)}x), closing{' '}
        {(IMP96670_GAP_SUMMARY.fractionOfTraceToMeasuredGapClosed * 100).toFixed(0)}% of the gap to
        the measured composed ceiling, with a residual factor{' '}
        {IMP96670_GAP_SUMMARY.residualToMeasuredFactor.toFixed(3)}. The row-sum family instead gives
        a LOWER ceiling than trace and is ruled out. Every ceiling sits{' '}
        {IMP96670_GAP_SUMMARY.bestAboveComputeFactor.toFixed(0)}x above the imp-96352 wall-clock
        compute ceiling (gray), so compute binds first regardless.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96670
        viz-data leaf (every curve and ceiling reused verbatim from imp-96648). {IMP96670_HONEST_BANNER}
      </div>
    </div>
  );
}
