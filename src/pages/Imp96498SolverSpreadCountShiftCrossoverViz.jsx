import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96498_SOLVER_SPREAD_SERIES,
  IMP96498_COUNT_SHIFT_SERIES,
  IMP96498_LANDMARKS,
  IMP96498_HONEST_BANNER,
} from '../data/imp-96498-solver-spread-count-shift-crossover-viz-data.js';
import { ED } from '../styles/tokens.js';

function CrossoverChart() {
  const svgW = 720;
  const svgH = 340;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 2;
  const xMax = 22;
  const yMin = -24;
  const yMax = -1;

  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (log10v) => padT + plotH - ((log10v - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [2, 6, 10, 14, 18, 22];
  const yTicks = [-2, -6, -10, -14, -18, -22];

  // The imp-96449 solver spread is exactly 0 at N = 1e14 (all solver paths agree bit-for-bit),
  // so log10 = -Infinity there; that rung cannot sit on a log axis and is skipped (the line
  // bridges it) instead of emitting an "Infinity" SVG coordinate.
  const spreadFinite = IMP96498_SOLVER_SPREAD_SERIES.filter((p) => Number.isFinite(p.log10Spread));
  const spreadD = spreadFinite
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N).toFixed(2)} ${yOf(p.log10Spread).toFixed(2)}`)
    .join(' ');

  const shiftD = IMP96498_COUNT_SHIFT_SERIES
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N).toFixed(2)} ${yOf(p.log10Shift).toFixed(2)}`)
    .join(' ');

  const crossX = xOf(IMP96498_LANDMARKS.ratioCrossLog10N);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>{`1e${v}`}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v}
        </text>
      ))}

      {/* crossover line */}
      <line x1={crossX} y1={padT} x2={crossX} y2={padT + plotH} stroke={ED.series5} strokeWidth={1} strokeDasharray="3 3" opacity={0.8} />
      <text x={crossX + 4} y={padT + 10} fill={ED.series5} fontSize={8}>
        crossover N=1e{IMP96498_LANDMARKS.ratioCrossLog10N}
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={shiftD} fill="none" stroke={ED.series4} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.9} />
      <path d={spreadD} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.95} />

      {spreadFinite.map((p) => (
        <circle key={`s-${p.log10N}`} cx={xOf(p.log10N)} cy={yOf(p.log10Spread)} r={2} fill={ED.series1} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 N (N = 1e2 .. 1e22)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 10})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series1} strokeWidth={2} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>solver-path spread (flat, floating-point noise)</text>
        <line x1={0} y1={14} x2={18} y2={14} stroke={ED.series4} strokeWidth={1.5} strokeDasharray="5 3" />
        <text x={22} y={17} fill={ED.inkSoft} fontSize={8.5}>~1/N count-model shift (decays steadily)</text>
      </g>
    </svg>
  );
}

export default function Imp96498SolverSpreadCountShiftCrossoverViz() {
  const { ratioCrossLog10N, solverNoiseFloor, maxRelGammaSpread, maxRelGammaSpreadLog10N } = IMP96498_LANDMARKS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96449: Solver-Path Spread vs Count-Model Shift" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96498_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The Newton and Lambert-W paths both invert the identical Riemann&ndash;von Mangoldt
        main-term count N(T), so any spread between the two gamma_N values they produce is a
        pure solver-path residual with no count-model content. imp-96449 extended that
        comparison from a single tenth-decade knee to the full N = 1e2 .. 1e22 range and asked
        whether the spread stays below the ~1/N count-model reference shift everywhere.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Solver spread (flat) vs count-model shift (decaying) on log-log, crossover marked
      </h3>
      <CrossoverChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue curve (solver
        spread) stays pinned near the machine-epsilon band across all 21 decades &mdash; it
        peaks at ~{maxRelGammaSpread.toExponential(1)} at N = 1e{maxRelGammaSpreadLog10N} with
        no growth trend. The orange dashed curve (the ~1/N count-model shift) falls in an
        almost straight line on this log-log plot, from ~6.3e-3 at N = 1e2 down to ~8.6e-23 at
        N = 1e22. The two lines cross at N ~ 1e{ratioCrossLog10N} (purple dashed): below that
        height the count-model shift dominates the solver noise, and above it the shift has
        fallen under the ~{solverNoiseFloor.toExponential(1)} solver floor.
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
        imp-96449 baked rows verbatim (only the log10 axis reshaping is computed here). The
        crossing at N ~ 1e{ratioCrossLog10N} is benign, not a real divergence: past that height
        both the solver-path residual and the count-model reference shift are numerically
        negligible (sub-ULP of a double-precision gamma_N), so neither curve carries any
        content there. Solver-path / conditioning diagnostic only, not rigorous; changes no
        bound; establishes no operator positivity; C_H isRigorousUpperBound stays false; no RH
        claim. NO QED.
      </div>
    </div>
  );
}
