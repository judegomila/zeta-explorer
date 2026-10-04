import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96318_CROSSING_SERIES,
  IMP96318_PLATEAU,
  IMP96318_ANCHORS,
  IMP96318_HONEST_BANNER,
} from '../data/imp-96318-confident-span-crossing-viz-data.js';
import { IMP96309_VERDICT } from '../data/imp-96309-route-m-confident-span-dip-seed-ensemble.js';
import { ED } from '../styles/tokens.js';

function CrossingChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 60;
  const padR = 16;
  const padT = 16;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = IMP96318_CROSSING_SERIES[0].logRho;
  const xMax = IMP96318_CROSSING_SERIES[IMP96318_CROSSING_SERIES.length - 1].logRho;
  const yMin = 8.8;
  const yMax = 10.8;

  const xOf = (logRho) => padL + ((logRho - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const pathOf = (points) => points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.logRho).toFixed(2)} ${yOf(p.crossSpan).toFixed(2)}`)
    .join(' ');

  const yTicks = [9.0, 9.5, 10.0, 10.5];
  const xTickRhos = [0.5, 0.71, 1.0, 1.41, 2.0];

  const plateauX1 = xOf(Math.log(IMP96318_PLATEAU.rhoLow));
  const plateauX2 = xOf(Math.log(IMP96318_PLATEAU.rhoHigh));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* near-equal plateau band */}
      <rect x={plateauX1} y={padT} width={plateauX2 - plateauX1} height={plotH} fill={ED.series7} opacity={0.08} />

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{v.toFixed(1)}</text>
        </g>
      ))}

      {/* Rayleigh span reference line */}
      <line x1={padL} y1={yOf(IMP96318_ANCHORS.rayleighSpan)} x2={padL + plotW} y2={yOf(IMP96318_ANCHORS.rayleighSpan)} stroke={ED.rule} strokeWidth={0.75} strokeDasharray="2 3" opacity={0.6} />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={pathOf(IMP96318_CROSSING_SERIES)} fill="none" stroke={ED.series7} strokeWidth={1.75} opacity={0.95} />

      {IMP96318_CROSSING_SERIES.map((p) => (
        <circle
          key={`d-${p.rho}`}
          cx={xOf(p.logRho)}
          cy={yOf(p.crossSpan)}
          r={p.isGlobalMin ? 3.6 : p.isEqualAmplitude ? 3.2 : 2.2}
          fill={p.isGlobalMin ? ED.brassDeco : p.isEqualAmplitude ? ED.series1 : ED.series7}
        />
      ))}

      {xTickRhos.map((v) => (
        <text key={`x${v}`} x={xOf(Math.log(v))} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={7.5}>
          {v}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        amplitude ratio rho = A4/A5 (log scale, fine grid)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series7} strokeWidth={1.75} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>
          confident-separation crossing span L(rho) (AICc &gt; 0.90, fine grid)
        </text>
        <circle cx={9} cy={16} r={3.2} fill={ED.series1} />
        <text x={22} y={19} fill={ED.inkSoft} fontSize={8.5}>
          equal-amplitude rho = 1 (L = {IMP96318_ANCHORS.eqSpanRho1.toFixed(3)})
        </text>
        <circle cx={9} cy={32} r={3.6} fill={ED.brassDeco} />
        <text x={22} y={35} fill={ED.inkSoft} fontSize={8.5}>
          global minimum, rho = {IMP96318_ANCHORS.minSpanRho} (L = {IMP96318_ANCHORS.minSpan.toFixed(3)})
        </text>
        <line x1={0} y1={46} x2={18} y2={46} stroke={ED.rule} strokeWidth={0.75} strokeDasharray="2 3" />
        <text x={22} y={49} fill={ED.inkSoft} fontSize={8.5}>Rayleigh span ({IMP96318_ANCHORS.rayleighSpan.toFixed(3)})</text>
      </g>
    </svg>
  );
}

export default function Imp96318ConfidentSpanCrossingViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96288: Confident Two-Tone Separation Span Crossing L(rho)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96318_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96264 read the confident (AICc &gt; 0.90) two-tone separation span as strictly
        minimized at the equal-amplitude ratio rho = 1, exactly at the Rayleigh span. imp-96288
        re-ran the same pipeline at fine rho/span resolution and found that was a coarse-grid
        artifact: the rho = 1 crossing sits at {IMP96318_ANCHORS.eqSpanRho1.toFixed(3)}, below
        the Rayleigh span {IMP96318_ANCHORS.rayleighSpan.toFixed(3)}, and the true minimum
        ({IMP96318_ANCHORS.minSpan.toFixed(3)}) sits at a slightly unequal ratio
        rho = {IMP96318_ANCHORS.minSpanRho}, only {IMP96318_ANCHORS.marginVsEqual.toFixed(3)} below
        the equal-amplitude value.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        L(rho) vs amplitude ratio rho (flat plateau near rho = 1, rising with imbalance)
      </h3>
      <CrossingChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the shaded band marks the
        near-equal-amplitude window (rho in [{IMP96318_PLATEAU.rhoLow}, {IMP96318_PLATEAU.rhoHigh}])
        where the crossing span stays inside a flat plateau ({IMP96318_PLATEAU.label}), all just
        below the dashed Rayleigh reference line. The blue dot (rho = 1) and yellow dot (the global
        minimum at rho = {IMP96318_ANCHORS.minSpanRho}) sit only {IMP96318_ANCHORS.marginVsEqual.toFixed(3)}{' '}
        apart -- a noise-sized margin. Outside the plateau the span rises monotonically with
        imbalance in either direction, reaching past 10.5 at rho = 2 or rho = 0.5.
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
        <strong style={{ color: 'var(--ink-soft)' }}>imp-96309 update:</strong> the yellow dot above (the
        rho = {IMP96318_ANCHORS.minSpanRho} "global minimum", {IMP96318_ANCHORS.marginVsEqual.toFixed(3)}{' '}
        below the equal-amplitude value) is the single-seed dip that imp-96309 re-ran at 10x draws
        (span reverts to rho = 1, with 0.94 now {Math.abs(IMP96309_VERDICT.highDrawDipEqMinus094).toFixed(3)}{' '}
        above it) and across a 16-seed ensemble (signed margin {IMP96309_VERDICT.ensembleMarginMean.toFixed(4)}{' '}
        &plusmn; 0.0615, mean/sd = {IMP96309_VERDICT.ensembleMeanOverSd.toFixed(3)}, sign flipping 10-vs-6
        across seeds): {IMP96309_VERDICT.dipSurvives ? 'the dip survives' : 'CONFIRMED as Monte-Carlo/interpolation jitter, not a real sub-plateau feature'}.
        The durable finding is the flat plateau itself
        (shaded band, ~9.1 just below Rayleigh across the near-equal regime) &mdash; that picture is
        unaffected and holds regardless of which point within it is nominally lowest.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96288
        baked fine-grid crossing curve verbatim (only the log(rho) axis reshaping is computed here).
        Synthetic q4+q5 two-tone Monte-Carlo simulation, not a measurement of the real conductor
        content or its amplitude ratio. Changes no bound, establishes no operator positivity, no RH
        claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
