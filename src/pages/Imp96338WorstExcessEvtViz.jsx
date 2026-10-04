import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96338_SERIES,
  IMP96338_AGGREGATES,
  IMP96338_HONEST_BANNER,
} from '../data/imp-96338-worst-excess-evt-viz-data.js';
import { ED } from '../styles/tokens.js';

function WorstExcessEvtChart() {
  const svgW = 700;
  const svgH = 360;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 56;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const n = IMP96338_SERIES.length;
  const yMin = 0;
  const yMax = 4;

  const xOf = (i) => padL + ((i + 0.5) / n) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const yTicks = [0, 1, 2, 3, 4];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v}</text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {IMP96338_SERIES.map((p, i) => {
        const x = xOf(i);
        const barW = (plotW / n) * 0.34;
        return (
          <g key={`band-${p.Tc}`}>
            {/* +/-1 Gumbel-sd band around E[max] */}
            <rect
              x={x - barW}
              y={yOf(p.bandHigh)}
              width={barW * 2}
              height={Math.max(0, yOf(p.bandLow) - yOf(p.bandHigh))}
              fill={ED.series1}
              opacity={0.28}
            />
            {/* leading order sqrt(2 ln n) reference tick */}
            <line x1={x - barW} y1={yOf(p.evtLeadingSqrt2LnN)} x2={x + barW} y2={yOf(p.evtLeadingSqrt2LnN)} stroke={ED.rule} strokeWidth={1} strokeDasharray="2 2" />
            {/* E[max] center line */}
            <line x1={x - barW} y1={yOf(p.expectedMax)} x2={x + barW} y2={yOf(p.expectedMax)} stroke={ED.series1} strokeWidth={1.5} />
            {/* observed worstSigma point */}
            <circle
              cx={x}
              cy={yOf(p.worstSigma)}
              r={4.5}
              fill={p.consistentWithGaussianTail ? ED.brassDeco : ED.series2}
              stroke={ED.paper}
              strokeWidth={0.75}
            />
          </g>
        );
      })}

      {IMP96338_SERIES.map((p, i) => (
        <text key={`x-${p.Tc}`} x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={7.8}>
          {`T=${p.Tc.toExponential(0)}`}
        </text>
      ))}
      {IMP96338_SERIES.map((p, i) => (
        <text key={`n-${p.Tc}`} x={xOf(i)} y={padT + plotH + 28} textAnchor="middle" fill={ED.inkFaint} fontSize={7.2}>
          {`n=${p.nWindows}`}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        imp-95562 height (Tc, batch size nWindows)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <circle cx={9} cy={0} r={4.5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={0.75} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>observed worstSigma = maxPosExcess / sdDiscrepancy</text>
        <rect x={2} y={10} width={14} height={9} fill={ED.series1} opacity={0.28} />
        <text x={22} y={18} fill={ED.inkSoft} fontSize={8.5}>E[max] +/- 1 Gumbel sd band (batch of n iid N(0,1))</text>
        <line x1={2} y1={30} x2={16} y2={30} stroke={ED.rule} strokeWidth={1} strokeDasharray="2 2" />
        <text x={22} y={33} fill={ED.inkSoft} fontSize={8.5}>leading order sqrt(2 ln n)</text>
      </g>
    </svg>
  );
}

export default function Imp96338WorstExcessEvtViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96271: Worst-Excess Extreme-Value Test" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96338_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96271 tested the imp-95562 "Gaussian-tailed, no anomalous pointwise spikes" claim: if the
        per-window C&nbsp;&minus;&nbsp;E discrepancy were i.i.d. standard Gaussian, the worst observed
        excess worstSigma should track the extreme-value maximum of nWindows i.i.d. draws. At all six
        heights the observed point (yellow) sits inside or near the E[max] &plusmn; 1 Gumbel-sd band
        (blue), with deviation ranging over [{IMP96338_AGGREGATES.deviationRangeGumbelSd.min.toFixed(2)},
        {' '}{IMP96338_AGGREGATES.deviationRangeGumbelSd.max.toFixed(2)}] Gumbel sd &mdash; well within the
        wider &plusmn;2.5 sd consistency envelope every height satisfies.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        worstSigma vs E[max] &plusmn; Gumbel-sd band, across the six imp-95562 heights
      </h3>
      <WorstExcessEvtChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> each column is one imp-95562
        height, sorted by ascending batch size n. The blue band is the +/-1 Gumbel-standard-deviation
        interval around E[max], the expected maximum of n i.i.d. standard Gaussians; the dashed grey tick
        is the cruder leading-order estimate sqrt(2&nbsp;ln&nbsp;n). The yellow dot is the actual observed
        worstSigma. Only the smallest batch (T&nbsp;=&nbsp;1e4, n&nbsp;=&nbsp;75) sits above its leading-order
        tick, and even there the dot is a routine draw just outside the plotted band, well inside the wider
        consistency envelope imp-96271 used to reach its verdict.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96271 baked
        rows and aggregates verbatim (only the +/-1 sd band arithmetic is computed here). This is a
        measurement comparison, not a new derivation: it establishes no operator positivity, moves no
        Lambda bound, and touches nothing on the zero side. Changes no bound, no RH claim;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
