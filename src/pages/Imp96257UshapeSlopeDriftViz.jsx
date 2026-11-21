import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96257_A_SERIES,
  IMP96257_B_SERIES,
  IMP96257_SUM_SERIES,
  IMP96257_DEEP_PROBE,
  IMP96257_ANCHORS,
  IMP96257_HONEST_BANNER,
} from '../data/imp-96257-ushape-slope-drift-viz-data.js';
import { ED } from '../styles/tokens.js';

function SlopeDriftChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 60;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = IMP96257_ANCHORS.log10NFlow;
  const xMax = IMP96257_DEEP_PROBE.log10N;
  const yMin = 0.25;
  const yMax = 1.02;

  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const aPoints = [...IMP96257_A_SERIES, { log10N: IMP96257_DEEP_PROBE.log10N, a: IMP96257_DEEP_PROBE.a }];
  const bPoints = [...IMP96257_B_SERIES, { log10N: IMP96257_DEEP_PROBE.log10N, b: IMP96257_DEEP_PROBE.b }];
  const sumPoints = [...IMP96257_SUM_SERIES, { log10N: IMP96257_DEEP_PROBE.log10N, sum: IMP96257_DEEP_PROBE.sum }];

  const pathOf = (points, key) => points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N).toFixed(2)} ${yOf(p[key]).toFixed(2)}`)
    .join(' ');

  const xTicks = [7, 8.204, 9.204, 10.204, 11.204, 12.204, 250];
  const yTicks = [0.3, 0.5, 0.7, 0.9, 1.0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v}</text>
        </g>
      ))}

      {/* (1/2, 1/2, 1) asymptote reference lines */}
      <line x1={padL} y1={yOf(0.5)} x2={padL + plotW} y2={yOf(0.5)} stroke={ED.rule} strokeWidth={0.75} strokeDasharray="2 3" opacity={0.6} />
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.rule} strokeWidth={0.75} strokeDasharray="2 3" opacity={0.6} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={pathOf(aPoints, 'a')} fill="none" stroke={ED.series3} strokeWidth={1.75} opacity={0.95} />
      <path d={pathOf(bPoints, 'b')} fill="none" stroke={ED.brassDeco} strokeWidth={1.75} opacity={0.95} />
      <path d={pathOf(sumPoints, 'sum')} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.95} />

      {aPoints.map((p) => <circle key={`a-${p.log10N}`} cx={xOf(p.log10N)} cy={yOf(p.a)} r={2.4} fill={ED.series3} />)}
      {bPoints.map((p) => <circle key={`b-${p.log10N}`} cx={xOf(p.log10N)} cy={yOf(p.b)} r={2.4} fill={ED.brassDeco} />)}
      {sumPoints.map((p) => <circle key={`s-${p.log10N}`} cx={xOf(p.log10N)} cy={yOf(p.sum)} r={2.4} fill={ED.series1} />)}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 N (from N_flow ~ {IMP96257_ANCHORS.log10NFlow.toFixed(2)} to deep probe at 250; axis compressed past 13)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series1} strokeWidth={2} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>a + b (location exponent, -&gt; 1)</text>
        <line x1={0} y1={14} x2={18} y2={14} stroke={ED.series3} strokeWidth={1.75} />
        <text x={22} y={17} fill={ED.inkSoft} fontSize={8.5}>a(N) = d ln g_t / d ln N (-&gt; 1/2)</text>
        <line x1={0} y1={28} x2={18} y2={28} stroke={ED.brassDeco} strokeWidth={1.75} />
        <text x={22} y={31} fill={ED.inkSoft} fontSize={8.5}>b(N) = -d ln g_f / d ln N (-&gt; 1/2)</text>
      </g>
    </svg>
  );
}

export default function Imp96257UshapeSlopeDriftViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96228: U-shape Slope Drift Past N_flow" />
      <p className="ed-lbl">Related: <Link to="/viz-imp96239-ushape-slope-drift">earlier run (imp-96239)</Link></p>

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96257_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96210 measured the local log-slopes a(N) and b(N) only across the peak decade
        [N_peak, N_flow] and found a monotone, b-dominated upward drift. imp-96228 extended the
        same grid a few decades past N_flow (and to a deep probe at log10 N = 250): the drift
        stays monotone with no reversal, decelerates (the per-decade increment shrinks), and
        approaches the (1/2, 1/2, 1) asymptote from below.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        a(N), b(N), a+b vs log10 N (monotone, b-dominated, saturating toward 1/2, 1/2, 1)
      </h3>
      <SlopeDriftChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> at N_flow (log10 N &asymp;{' '}
        {IMP96257_ANCHORS.log10NFlow.toFixed(2)}), a &asymp; {IMP96257_ANCHORS.aAtNFlow.toFixed(4)} and
        b &asymp; {IMP96257_ANCHORS.bAtNFlow.toFixed(4)}; b (yellow) climbs far faster than a (green)
        across the plotted grid, so it carries the bulk of the drift, while a+b (blue) rises toward
        the dashed 1 line without crossing it. The deep probe at log10 N = 250 reads a &asymp;{' '}
        {IMP96257_DEEP_PROBE.a.toFixed(4)}, b &asymp; {IMP96257_DEEP_PROBE.b.toFixed(4)}, a+b &asymp;{' '}
        {IMP96257_DEEP_PROBE.sum.toFixed(4)} &mdash; consistent with the (1/2, 1/2, 1) limit,
        approached from below.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96228
        baked grid and deep-probe literals verbatim (only the chart-axis reshaping is computed
        here). The component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, not
        a rigorous asymptotic; the C_mb GUE-conditional per imp-486 stays untouched. Changes no
        bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
