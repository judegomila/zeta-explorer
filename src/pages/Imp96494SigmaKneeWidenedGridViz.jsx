import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96494_AXIS,
  IMP96494_CROSSOVER_POINTS,
  IMP96494_KNEE_POINTS,
  IMP96494_REFERENCE_LINE,
  IMP96494_WINDOW_EXIT,
  IMP96494_ELASTICITY,
  IMP96494_GAP,
  IMP96494_ORIGINAL_WINDOW,
  IMP96494_HONEST_BANNER,
} from '../data/imp-96494-sigma-knee-widened-grid-viz-data.js';
import { ED } from '../styles/tokens.js';

function WidenedGridKneeChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xOf = (lf) => padL
    + ((lf - IMP96494_AXIS.log10FactorMin) / (IMP96494_AXIS.log10FactorMax - IMP96494_AXIS.log10FactorMin)) * plotW;
  const yOf = (d) => padT + plotH
    - ((d - IMP96494_AXIS.log10NstarMin) / (IMP96494_AXIS.log10NstarMax - IMP96494_AXIS.log10NstarMin)) * plotH;

  const crossPath = IMP96494_CROSSOVER_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.log10Factor).toFixed(2)},${yOf(p.log10Nstar).toFixed(2)}`)
    .join(' ');
  const kneePath = IMP96494_KNEE_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.log10Factor).toFixed(2)},${yOf(p.log10Nstar).toFixed(2)}`)
    .join(' ');
  const refPath = IMP96494_REFERENCE_LINE
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.log10Factor).toFixed(2)},${yOf(p.log10Nstar).toFixed(2)}`)
    .join(' ');

  const xTicks = [0.5, Math.SQRT1_2, 1.0, Math.SQRT2, 2.0];
  const yTicks = [9, 9.5, 10, 10.5, 11].filter(
    (v) => v >= IMP96494_AXIS.log10NstarMin && v <= IMP96494_AXIS.log10NstarMax,
  );

  const windowLoY = yOf(9.0);
  const exitX = xOf(IMP96494_WINDOW_EXIT.log10Factor);
  const exitY = yOf(IMP96494_WINDOW_EXIT.log10Nstar);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line
            x1={xOf(Math.log10(v))}
            y1={padT}
            x2={xOf(Math.log10(v))}
            y2={padT + plotH}
            stroke={ED.rule}
            strokeWidth={0.5}
            opacity={0.3}
          />
          <text x={xOf(Math.log10(v))} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {`${v.toFixed(2)}x`}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.2} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {/* original [1e9,1e12] window low edge (log10 N = 9) */}
      <line
        x1={padL}
        y1={windowLoY}
        x2={padL + plotW}
        y2={windowLoY}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="2,4"
        opacity={0.6}
      />

      {/* elasticity reference slope through the anchor crossover */}
      <path d={refPath} fill="none" stroke={ED.rule} strokeWidth={1} strokeDasharray="4,3" opacity={0.7} />

      {/* widened-grid crossover and knee, fully resolved across the whole 0.5x..2x band */}
      <path d={crossPath} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      <path d={kneePath} fill="none" stroke={ED.series5} strokeWidth={2} />

      {IMP96494_CROSSOVER_POINTS.map((p) => (
        <circle key={`c${p.factor}`} cx={xOf(p.log10Factor)} cy={yOf(p.log10Nstar)} r={3} fill={ED.brassDeco} />
      ))}
      {IMP96494_KNEE_POINTS.map((p) => (
        <circle key={`k${p.factor}`} cx={xOf(p.log10Factor)} cy={yOf(p.log10Nstar)} r={3} fill={ED.series5} />
      ))}

      <circle cx={exitX} cy={exitY} r={4} fill="none" stroke={ED.series2} strokeWidth={1.5} />
      <text x={exitX + 6} y={exitY - 8} textAnchor="start" fill={ED.series2} fontSize={7.5}>
        {`f* ~ ${IMP96494_WINDOW_EXIT.factor.toFixed(4)}x`}
      </text>

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {'E_trunc multiplier (log scale); red dashed = original window low edge (log10 N = 9)'}
      </text>

      <g transform={`translate(${padL + 8}, ${padT})`}>
        <line x1={0} y1={4} x2={16} y2={4} stroke={ED.brassDeco} strokeWidth={2} />
        <text x={21} y={8} fill={ED.inkSoft} fontSize={8}>
          {`crossover (elasticity ${IMP96494_ELASTICITY.crossover.toFixed(4)})`}
        </text>
        <line x1={0} y1={18} x2={16} y2={18} stroke={ED.series5} strokeWidth={2} />
        <text x={21} y={22} fill={ED.inkSoft} fontSize={8}>
          {`widened-grid knee (elasticity ${IMP96494_ELASTICITY.knee.toFixed(4)})`}
        </text>
      </g>
    </svg>
  );
}

export default function Imp96494SigmaKneeWidenedGridViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96464: Widened-Grid sigma-Knee Resolution and Window-Exit Factor" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96494_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96451 could not resolve the tenth-decade sigma-knee at the 2x E_trunc
        factor on the fixed {IMP96494_ORIGINAL_WINDOW} grid. Re-running the same
        estimators on a widened [1e7,1e13] grid resolves the knee at every factor
        0.5x..2x, with elasticity d(log10 N*)/d(log E_trunc) ~{' '}
        {IMP96494_ELASTICITY.knee.toFixed(4)}, matching both the crossover
        elasticity ~{IMP96494_ELASTICITY.crossover.toFixed(4)} and the on-window
        imp-96451 value ~{IMP96494_ELASTICITY.onWindow}. Bisecting the multiplier
        locates the exact factor at which the knee exits the original window low
        edge: f* ~ {IMP96494_WINDOW_EXIT.factor.toFixed(4)} (E_trunc ~{' '}
        {IMP96494_WINDOW_EXIT.eTrunc.toExponential(3)}), refining the imp-96451
        "~5e-5" estimate. The knee/crossover gap stays fixed between{' '}
        {IMP96494_GAP.min.toFixed(5)} and {IMP96494_GAP.max.toFixed(5)} log10.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        widened-grid knee and crossover log10 N* vs the E_trunc multiplier
      </h3>
      <WidenedGridKneeChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the yellow
        curve is the sigma = 1/2 crossover, the purple curve is the tenth-decade
        knee, both now fully resolved across the whole 0.5x..2x band (unlike the
        imp-96451 fixed-window run, which lost the knee at 2x). The red dashed
        horizontal line marks the original [1e9,1e12] window low edge (log10 N =
        9); the ringed point marks the exact E_trunc multiplier f* at which the
        widened-grid knee crosses that edge.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        consuming the imp-96464 baked row literals verbatim (only the
        log10(factor) projection and reference line are computed here, no
        re-fit, no zeros-bundle import). Component-model curvature/sensitivity
        diagnostic only, not rigorous; changes no bound; establishes no operator
        positivity; RH open.
        NO QED.
      </div>
    </div>
  );
}
