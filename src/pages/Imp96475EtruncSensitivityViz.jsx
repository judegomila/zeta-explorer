import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96475_AXIS,
  IMP96475_CROSSOVER_POINTS,
  IMP96475_KNEE_POINTS,
  IMP96475_REFERENCE_LINE,
  IMP96475_WINDOW_EXIT,
  IMP96475_ELASTICITY,
  IMP96475_GAP,
  IMP96475_HONEST_BANNER,
} from '../data/imp-96475-etrunc-sensitivity-viz-data.js';
import { ED } from '../styles/tokens.js';

function EtruncSensitivityChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xOf = (lf) => padL
    + ((lf - IMP96475_AXIS.log10FactorMin) / (IMP96475_AXIS.log10FactorMax - IMP96475_AXIS.log10FactorMin)) * plotW;
  const yOf = (d) => padT + plotH
    - ((d - IMP96475_AXIS.log10NstarMin) / (IMP96475_AXIS.log10NstarMax - IMP96475_AXIS.log10NstarMin)) * plotH;

  const crossPath = IMP96475_CROSSOVER_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.log10Factor).toFixed(2)},${yOf(p.log10Nstar).toFixed(2)}`)
    .join(' ');
  const kneePath = IMP96475_KNEE_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.log10Factor).toFixed(2)},${yOf(p.log10Nstar).toFixed(2)}`)
    .join(' ');
  const refPath = IMP96475_REFERENCE_LINE
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.log10Factor).toFixed(2)},${yOf(p.log10Nstar).toFixed(2)}`)
    .join(' ');

  const xTicks = [0.5, Math.SQRT1_2, 1.0, Math.SQRT2, 2.0];
  const yTicks = [9, 9.5, 10, 10.5, 11].filter(
    (v) => v >= IMP96475_AXIS.log10NstarMin && v <= IMP96475_AXIS.log10NstarMax,
  );

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

      {/* analytic reference slope -2/ln10 through the anchor crossover */}
      <path d={refPath} fill="none" stroke={ED.rule} strokeWidth={1} strokeDasharray="4,3" opacity={0.7} />

      {/* measured crossover (sigma = 1/2) and knee (tenth-decade D2 zero-crossing) */}
      <path d={crossPath} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      <path d={kneePath} fill="none" stroke={ED.series5} strokeWidth={2} />

      {IMP96475_CROSSOVER_POINTS.map((p) => (
        <circle key={`c${p.factor}`} cx={xOf(p.log10Factor)} cy={yOf(p.log10Nstar)} r={3} fill={ED.brassDeco} />
      ))}
      {IMP96475_KNEE_POINTS.map((p) => (
        <circle key={`k${p.factor}`} cx={xOf(p.log10Factor)} cy={yOf(p.log10Nstar)} r={3} fill={ED.series5} />
      ))}

      {IMP96475_WINDOW_EXIT && (
        <g>
          <circle
            cx={xOf(Math.log10(IMP96475_WINDOW_EXIT.factor))}
            cy={yOf(IMP96475_AXIS.log10NstarMin + 0.06)}
            r={4}
            fill="none"
            stroke={ED.series2}
            strokeWidth={1.5}
          />
          <text
            x={xOf(Math.log10(IMP96475_WINDOW_EXIT.factor)) - 6}
            y={yOf(IMP96475_AXIS.log10NstarMin + 0.06) - 8}
            textAnchor="end"
            fill={ED.series2}
            fontSize={7.5}
          >
            {'knee off-window'}
          </text>
        </g>
      )}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {'E_trunc multiplier (log scale); dashed grey = analytic -2/ln10 reference slope'}
      </text>

      <g transform={`translate(${padL + 8}, ${padT})`}>
        <line x1={0} y1={4} x2={16} y2={4} stroke={ED.brassDeco} strokeWidth={2} />
        <text x={21} y={8} fill={ED.inkSoft} fontSize={8}>
          {`crossover (elasticity ${IMP96475_ELASTICITY.crossover.toFixed(4)})`}
        </text>
        <line x1={0} y1={18} x2={16} y2={18} stroke={ED.series5} strokeWidth={2} />
        <text x={21} y={22} fill={ED.inkSoft} fontSize={8}>
          {`knee (elasticity ${IMP96475_ELASTICITY.knee.toFixed(4)})`}
        </text>
      </g>
    </svg>
  );
}

export default function Imp96475EtruncSensitivityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96451: sigma-Knee / Crossover Sensitivity to the E_trunc Truncation Floor" />
      <p className="ed-lbl">Related: <Link to="/viz-imp96316-etrunc-sensitivity">earlier run (imp-96316)</Link></p>

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96475_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96451 perturbed the N-independent truncation floor E_trunc = 3.06e-5 by a
        log-symmetric 0.5x..2x band and re-measured the tenth-decade sigma-knee and the
        sigma = 1/2 crossover. Both landmarks move together with elasticity
        d(log10 N*)/d(log E_trunc) ~ {IMP96475_ELASTICITY.crossover.toFixed(4)}, close to the
        analytic leading term {IMP96475_ELASTICITY.analytic.toFixed(4)} = -2/ln10, while their
        gap stays fixed between {IMP96475_GAP.min.toFixed(5)} and {IMP96475_GAP.max.toFixed(5)}
        {' '}log10 (base {IMP96475_GAP.base.toFixed(5)}).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        knee and crossover log10 N* vs the E_trunc multiplier
      </h3>
      <EtruncSensitivityChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the yellow curve is the
        sigma = 1/2 crossover, the purple curve is the tenth-decade knee, and the dashed grey
        line is the analytic -2/ln10 reference slope through the factor = 1 anchor. The purple
        curve stops at the 2x mark, ringed in red, where the crossover drops below the
        [1e9,1e12] resolution window and the D2 zero-crossing is no longer resolved.
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
        imp-96451 baked row literals verbatim (only the log10(factor) projection and reference
        line are computed here, no re-fit, no zeros-bundle import). Component-model
        curvature/sensitivity diagnostic only, not rigorous; changes no bound; establishes no
        operator positivity; RH open; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
