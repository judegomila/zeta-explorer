import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96701_SERIES,
  IMP96701_N_LADDER,
  IMP96701_CEILING_TABLE,
  IMP96701_CEILING_SHIFT,
  IMP96701_HONEST_BANNER,
} from '../data/imp-96701-frobenius-majorant-eleven-rung-viz-data.js';
import { ED } from '../styles/tokens.js';

const COLORS = {
  frobenius: ED.series3,
  lamMax: ED.ink,
  trace: ED.series1,
};

// three-curve chart on a log(N) x-axis: Frobenius majorant + measured
// lam_max + trace, over the eleven-rung ladder N=250..9000. A vertical
// marker separates the imp-96648 committed eight rungs (N<=6000) from the
// imp-96684 three new rungs (N=7000,8000,9000).
function MajorantsPanel() {
  const ns = IMP96701_N_LADDER;
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
  const allY = IMP96701_SERIES.flatMap((s) => s.values);
  const minY = 0;
  const maxY = Math.max(...allY) * 1.08;

  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;
  const newRungBoundaryX = xOf(Math.log(6500));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line
        x1={newRungBoundaryX}
        y1={padT}
        x2={newRungBoundaryX}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={newRungBoundaryX + 4} y={padT + 10} fill={ED.inkFaint} fontSize={8}>
        imp-96684 new rungs &rarr;
      </text>
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
      {IMP96701_SERIES.map((s) => (
        <g key={s.key}>
          <polyline
            points={ns.map((n, i) => `${xOf(Math.log(n))},${yOf(s.values[i])}`).join(' ')}
            fill="none"
            stroke={COLORS[s.key]}
            strokeWidth={1.9}
          />
          {ns.map((n, i) => (
            <circle key={`${s.key}${n}`} cx={xOf(Math.log(n))} cy={yOf(s.values[i])} r={2.4} fill={COLORS[s.key]} />
          ))}
        </g>
      ))}
      <text x={padL + plotW / 2} y={padT + plotH + 32} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        N (log scale, ticks at the eleven ladder rungs 250..9000)
      </text>
    </svg>
  );
}

function ceilingBar(entry, maxLog10) {
  const widthPct = Math.max(2, (entry.log10CeilingN / maxLog10) * 100);
  const color =
    entry.kind === 'sharper' ? ED.series3 :
    entry.kind === 'before' ? ED.inkSoft :
    entry.kind === 'compute' ? ED.inkSoft : ED.series1;
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

export default function Imp96701FrobeniusMajorantElevenRungViz() {
  const maxLog10 = Math.max(...IMP96701_CEILING_TABLE.map((c) => c.log10CeilingN)) * 1.02;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Frobenius Majorant: Eleven-Rung Ladder N=250..9000" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96701_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96684 extended the imp-96648 eight-rung Frobenius / Wolkowicz-Styan majorant ladder
        (N&le;6000) with three new measured rungs at N=7000,8000,9000, on the same exact Vasyunin
        Gram rebuilt to NMAX=9000. The majorant slope flattens ~1.7% over the enlarged ladder
        (mirroring the imp-96649 lam_max flattening), but the re-solved rigorous-lower conditioning
        ceiling barely moves: it is ROBUST, not tightened.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Three curves over the full N=250..9000 ladder
      </h3>
      <MajorantsPanel />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.2rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        {IMP96701_SERIES.map((s) => (
          <span key={s.key} style={{ color: COLORS[s.key] }}>
            &#9632; {s.label}
          </span>
        ))}
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.75rem' }}>
        Re-solved double-precision conditioning ceilings (N, log scale)
      </h3>
      <div style={{ maxWidth: 700 }}>
        {IMP96701_CEILING_TABLE.map((c) => ceilingBar(c, maxLog10))}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> adding the three new
        rungs raises the rigorous-lower Frobenius conditioning ceiling only from{' '}
        {IMP96701_CEILING_SHIFT.frobeniusBefore.toExponential(3)} to{' '}
        {IMP96701_CEILING_SHIFT.frobeniusAfter.toExponential(3)} (
        {IMP96701_CEILING_SHIFT.frobeniusShiftFactor.toFixed(4)}x, +
        {((IMP96701_CEILING_SHIFT.frobeniusShiftFactor - 1) * 100).toFixed(2)}%) &mdash; still ~
        {(IMP96701_CEILING_SHIFT.fractionOfTraceToMeasuredGapClosed * 100).toFixed(0)}% of the way
        from the trace lower ceiling to the measured composed ceiling, residual factor{' '}
        {IMP96701_CEILING_SHIFT.residualToMeasuredFactor.toFixed(3)}. Every ceiling sits{' '}
        {IMP96701_CEILING_SHIFT.aboveComputeFactor.toFixed(0)}x above the imp-96352 wall-clock
        compute ceiling, so compute binds first regardless.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-96701 viz-data leaf (every curve and ceiling reused verbatim from imp-96648/imp-96684).{' '}
        {IMP96701_HONEST_BANNER}
      </div>
    </div>
  );
}
