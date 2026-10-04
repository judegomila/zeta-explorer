import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96337_RUNG_SERIES,
  IMP96337_THRESHOLD_SERIES,
  IMP96337_ANCHORS,
  IMP96337_HONEST_BANNER,
  IMP96376_DENSITY_GROWTH_SERIES,
  IMP96376_FIRST_PRIME5_RUNG,
} from '../data/imp-96337-mixed-ladder-margin-viz-data.js';
import { ED } from '../styles/tokens.js';

function RungMarginChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 60;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const log2 = (v) => Math.log(v) / Math.log(2);
  const xMin = log2(1);
  const xMax = log2(30);
  const yMin = 0;
  const yMax = 0.4;

  const xOf = (u) => padL + ((log2(u) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const yTicks = [0, 0.1, 0.2, 0.3, 0.4];
  const xTicks = [2, 3, 4, 6, 8, 12, 16, 24];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(1)}</text>
        </g>
      ))}

      {/* ceiling (s_2 = 0.353553) reference line -- the modulus-1 gap sits above this */}
      <line x1={padL} y1={yOf(IMP96337_ANCHORS.ceiling)} x2={padL + plotW} y2={yOf(IMP96337_ANCHORS.ceiling)} stroke={ED.rule} strokeWidth={0.75} strokeDasharray="2 3" opacity={0.6} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {IMP96337_RUNG_SERIES.map((p) => (
        <g key={`rung-${p.u}`}>
          <line x1={xOf(p.u)} y1={yOf(0)} x2={xOf(p.u)} y2={yOf(p.s)} stroke={ED.series7} strokeWidth={4} opacity={0.9} />
          <line x1={xOf(p.u)} y1={yOf(p.s)} x2={xOf(p.u)} y2={yOf(IMP96337_ANCHORS.ceiling)} stroke={ED.series1} strokeWidth={4} opacity={0.55} />
        </g>
      ))}

      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {v}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        u = 2^a 3^b (log2 axis, leading ten S-units, u = 2..24)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series7} strokeWidth={4} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>rung magnitude s_u = u^(-1/2)/2</text>
        <line x1={0} y1={16} x2={18} y2={16} stroke={ED.series1} strokeWidth={4} opacity={0.55} />
        <text x={22} y={19} fill={ED.inkSoft} fontSize={8.5}>margin below ceiling, s_2 - s_u</text>
        <line x1={0} y1={30} x2={18} y2={30} stroke={ED.rule} strokeWidth={0.75} strokeDasharray="2 3" />
        <text x={22} y={33} fill={ED.inkSoft} fontSize={8.5}>ceiling s_2 = {IMP96337_ANCHORS.ceiling.toFixed(6)} (attained only at u = 2)</text>
      </g>
    </svg>
  );
}

function ThresholdCountChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 50;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 0.05;
  const xMax = 0.30;
  const yMin = 0;
  const yMax = 20;

  const xOf = (t) => padL + plotW - ((t - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  // step path: for a series sorted threshold-ascending (count non-increasing),
  // draw a right-continuous step from each row out to the next threshold.
  const stepPath = IMP96337_THRESHOLD_SERIES.map((row, i) => {
    const isFirst = i === 0;
    const seg = `${isFirst ? 'M' : 'L'} ${xOf(row.threshold).toFixed(2)} ${yOf(row.count).toFixed(2)}`;
    const next = IMP96337_THRESHOLD_SERIES[i + 1];
    if (!next) return seg;
    return `${seg} L ${xOf(next.threshold).toFixed(2)} ${yOf(row.count).toFixed(2)}`;
  }).join(' ');

  const yTicks = [0, 5, 10, 15, 20];
  const xTicks = IMP96337_THRESHOLD_SERIES.map((r) => r.threshold);

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

      <path d={stepPath} fill="none" stroke={ED.brassDeco} strokeWidth={1.75} opacity={0.95} />

      {IMP96337_THRESHOLD_SERIES.map((row) => (
        <circle key={`t-${row.threshold}`} cx={xOf(row.threshold)} cy={yOf(row.count)} r={2.8} fill={ED.brassDeco} />
      ))}

      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {v.toFixed(2)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        threshold t (descending right-to-left, larger t = fewer qualifying rungs)
      </text>
    </svg>
  );
}

function DensityGrowthChart() {
  const svgW = 680;
  const svgH = 300;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const log10 = (v) => Math.log(v) / Math.LN10;
  const xMin = log10(1e2);
  const xMax = log10(1e9);
  const yMin = log10(1);
  const yMax = log10(2000);

  const xOf = (U) => padL + ((log10(U) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((log10(v) - yMin) / (yMax - yMin)) * plotH;

  const pathFor = (key) => IMP96376_DENSITY_GROWTH_SERIES
    .map((row, i) => `${i === 0 ? 'M' : 'L'} ${xOf(row.U).toFixed(2)} ${yOf(row[key]).toFixed(2)}`)
    .join(' ');

  const yTicks = [1, 10, 100, 1000];
  const xTicks = IMP96376_DENSITY_GROWTH_SERIES.map((r) => r.U);

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

      <path d={pathFor('cubicAsymptotic')} fill="none" stroke={ED.rule} strokeWidth={1.25} strokeDasharray="2 3" opacity={0.85} />
      <path d={pathFor('twoPrimeCount')} fill="none" stroke={ED.series1} strokeWidth={1.75} opacity={0.9} />
      <path d={pathFor('threePrimeCount')} fill="none" stroke={ED.series7} strokeWidth={1.75} opacity={0.9} />

      {IMP96376_DENSITY_GROWTH_SERIES.map((row) => (
        <g key={`d-${row.U}`}>
          <circle cx={xOf(row.U)} cy={yOf(row.twoPrimeCount)} r={2.6} fill={ED.series1} />
          <circle cx={xOf(row.U)} cy={yOf(row.threePrimeCount)} r={2.6} fill={ED.series7} />
        </g>
      ))}

      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {v.toExponential(0)}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        U (log10 axis) &mdash; S-unit count(u &le; U)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series7} strokeWidth={1.75} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>three-prime {'{'}oo,2,3,5{'}'} count, ~(ln U)^3</text>
        <line x1={0} y1={16} x2={18} y2={16} stroke={ED.series1} strokeWidth={1.75} />
        <text x={22} y={19} fill={ED.inkSoft} fontSize={8.5}>two-prime {'{'}oo,2,3{'}'} count, ~(ln U)^2</text>
        <line x1={0} y1={30} x2={18} y2={30} stroke={ED.rule} strokeWidth={1.25} strokeDasharray="2 3" />
        <text x={22} y={33} fill={ED.inkSoft} fontSize={8.5}>cubic leading term (ln U)^3/(6 ln2 ln3 ln5)</text>
      </g>
    </svg>
  );
}

export default function Imp96337MixedLadderMarginViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96270: Mixed {oo,2,3} Ladder Spectral-Gap Margin" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96337_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96270 tabulated the mixed 2^a 3^b {'{'}oo,2,3{'}'} S-unit prolate ladder tail: every rung
        magnitude s_u = u^(-1/2)/2 sits at or below the ceiling s_2 = {IMP96337_ANCHORS.ceiling.toFixed(6)},
        {' '}a wide gap {IMP96337_ANCHORS.gapBelowOne.toFixed(6)} below the modulus-1 boundary, attained
        only once at u = 2. The second rung already drops to {IMP96337_ANCHORS.secondRung.toFixed(6)}
        {' '}(ratio {IMP96337_ANCHORS.secondRungRatio.toFixed(6)} = sqrt(2/3) to the ceiling), and the
        count of rungs within any margin of the ceiling is finite.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Rung magnitude s_u and margin below the ceiling (leading ten S-units)
      </h3>
      <RungMarginChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Rung-count within threshold (finite lattice-point count, t = 0.30..0.05)
      </h3>
      <ThresholdCountChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        imp-96376: three-prime {'{'}oo,2,3,5{'}'} tail density vs the two-prime count
      </h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '0.75rem', maxWidth: 760 }}>
        Adding the prime 5 does not raise the ceiling: the new smallest rung u = 5 sits at
        s&#8325; = {IMP96376_FIRST_PRIME5_RUNG.s.toFixed(6)}, a margin
        {' '}{IMP96376_FIRST_PRIME5_RUNG.marginBelowCeiling.toFixed(6)} below s&#8322; = {IMP96337_ANCHORS.ceiling.toFixed(6)}.
        What changes is density: the S-unit count(u &le; U) grows from the two-prime (ln U)&sup2; to the
        three-prime (ln U)&sup3;, converging toward the cubic leading term from above as U grows.
      </p>
      <DensityGrowthChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the top chart stacks each rung's
        magnitude (pink) below its margin to the ceiling (blue); only u = 2 touches the dashed ceiling
        line, and every other rung sits with clear daylight beneath it. The bottom step chart shows the
        count of rungs at or above a threshold only grows to 19 by t = 0.05 &mdash; a finite,
        slowly-growing lattice-point count, not a dense accumulation toward modulus 1.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96270
        baked leadingMagnitudes and countAboveThreshold fields verbatim (only the margin and threshold
        reordering are computed here), extended by imp-96376 with the imp-96333 three-prime
        cubicGrowthSamples and firstNewRung fields. This is a tabulation of the already-reduced
        imp-96143 fact (I): it diagonalizes nothing, establishes no operator positivity, and does not
        touch the finitely-many top confined states outside the ladder (the actual residual). Changes
        no bound, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
