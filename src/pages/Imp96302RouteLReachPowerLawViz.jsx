import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96302_AXIS,
  IMP96302_DETECTOR_CURVE,
  IMP96302_CHRISTOFFEL_CURVE,
  IMP96302_MEASURED_POINTS,
  IMP96302_T0,
  IMP96302_EXTRAPOLATION_FAN,
  IMP96302_FIT_SUMMARY,
  IMP96302_HONEST_BANNER,
  IMP96302_CONSISTENT,
} from '../data/imp-96302-route-l-reach-power-law-viz-data.js';
import { ED } from '../styles/tokens.js';

function ReachPowerLawChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 54;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xOf = (gammaLog10) => padL
    + ((gammaLog10 - IMP96302_AXIS.gammaMinLog10) / (IMP96302_AXIS.gammaMaxLog10 - IMP96302_AXIS.gammaMinLog10)) * plotW;
  const yOf = (nLog10) => padT + plotH
    - ((nLog10 - IMP96302_AXIS.nMinLog10) / (IMP96302_AXIS.nMaxLog10 - IMP96302_AXIS.nMinLog10)) * plotH;

  const detectorPath = IMP96302_DETECTOR_CURVE
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.gammaLog10).toFixed(2)},${yOf(p.nLog10).toFixed(2)}`)
    .join(' ');
  const christoffelPath = IMP96302_CHRISTOFFEL_CURVE
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.gammaLog10).toFixed(2)},${yOf(p.nLog10).toFixed(2)}`)
    .join(' ');

  const xTicks = [2, 4, 6, 8, 10, 12].filter(
    (v) => v >= IMP96302_AXIS.gammaMinLog10 && v <= IMP96302_AXIS.gammaMaxLog10,
  );
  const yTicks = [1, 3, 5, 7, 9, 11, 13, 15];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT} x2={xOf(v)} y2={padT + plotH} stroke={ED.rule} strokeWidth={0.5} opacity={0.3} />
          <text x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {`1e${v}`}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.2} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
            {`1e${v}`}
          </text>
        </g>
      ))}

      {/* PT-height extrapolation fan: vertical line at T0, endpoints marking the two extrapolated N */}
      <line
        x1={xOf(IMP96302_T0.log10)}
        y1={padT}
        x2={xOf(IMP96302_T0.log10)}
        y2={padT + plotH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="3,3"
        opacity={0.6}
      />
      <circle cx={xOf(IMP96302_T0.log10)} cy={yOf(IMP96302_EXTRAPOLATION_FAN.detectorPowerLaw.log10)} r={4} fill={ED.series6} />
      <circle cx={xOf(IMP96302_T0.log10)} cy={yOf(IMP96302_EXTRAPOLATION_FAN.christoffelPowerLaw.log10)} r={4} fill={ED.series7} />

      {/* detector and Christoffel power-law curves */}
      <path d={detectorPath} fill="none" stroke={ED.series6} strokeWidth={2} />
      <path d={christoffelPath} fill="none" stroke={ED.series7} strokeWidth={2} strokeDasharray="6,3" />

      {/* shared measured points */}
      {IMP96302_MEASURED_POINTS.map((p) => (
        <g key={`m${p.gamma}`}>
          <circle cx={xOf(p.gammaLog10)} cy={yOf(p.measuredNdetLog10)} r={2.5} fill={ED.series6} opacity={0.7} />
          <circle cx={xOf(p.gammaLog10)} cy={yOf(p.christoffelEps1e4Log10)} r={2.5} fill={ED.series7} opacity={0.7} />
        </g>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {'gamma (log10 scale); dashed yellow line = Platt-Trudgian height T0'}
      </text>

      <g transform={`translate(${padL + 8}, ${padT})`}>
        <line x1={0} y1={4} x2={16} y2={4} stroke={ED.series6} strokeWidth={2} />
        <text x={21} y={8} fill={ED.inkSoft} fontSize={8}>
          {`detector fit N=${IMP96302_FIT_SUMMARY.detectorFit.A.toFixed(6)}*gamma^${IMP96302_FIT_SUMMARY.detectorFit.b.toFixed(6)}`}
        </text>
        <line x1={0} y1={18} x2={16} y2={18} stroke={ED.series7} strokeWidth={2} strokeDasharray="4,2" />
        <text x={21} y={22} fill={ED.inkSoft} fontSize={8}>
          {`Christoffel fit N=${IMP96302_FIT_SUMMARY.christoffelFit.A.toFixed(6)}*gamma^${IMP96302_FIT_SUMMARY.christoffelFit.b.toFixed(6)}`}
        </text>
        <circle cx={7} cy={32} r={4} fill={ED.series6} />
        <text x={21} y={36} fill={ED.inkSoft} fontSize={8}>
          {`N needed at T0: detector ${IMP96302_EXTRAPOLATION_FAN.detectorPowerLaw.value.toExponential(2)}`}
        </text>
        <circle cx={7} cy={46} r={4} fill={ED.series7} />
        <text x={21} y={50} fill={ED.inkSoft} fontSize={8}>
          {`Christoffel ${IMP96302_EXTRAPOLATION_FAN.christoffelPowerLaw.value.toExponential(2)} (ratio ${IMP96302_EXTRAPOLATION_FAN.ratio_182_over_149.toFixed(4)})`}
        </text>
      </g>
    </svg>
  );
}

export default function Imp96302RouteLReachPowerLawViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96269: Route L Detector-vs-Christoffel Reach Power Laws and the PT-Height Extrapolation Fan" />

      <span
        style={{
          display: 'inline-block',
          marginBottom: '0.75rem',
          padding: '0.2rem 0.6rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
          background: IMP96302_CONSISTENT ? 'color-mix(in srgb, var(--series-3) 12%, transparent)' : 'color-mix(in srgb, var(--series-2) 12%, transparent)',
          color: IMP96302_CONSISTENT ? 'var(--series-3)' : 'var(--series-2)',
          border: `1px solid ${IMP96302_CONSISTENT ? ED.series3 : ED.series2}`,
        }}
      >
        {`VERDICT: ${IMP96302_CONSISTENT ? 'CONSISTENT' : 'INCONSISTENT'}`}
      </span>

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96302_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96269 re-fit the imp-96182 genuine Christoffel eps1e4 reach column as the same power
        law form the imp-96149 empirical detector column uses, over the shared gamma range
        [14.13, 77.14]. Both curves below extrapolate on a log-log grid out to the Platt-Trudgian
        verified height T0 = {IMP96302_T0.value.toExponential(4)}, landing at the same 1e15 order
        of magnitude.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Reach power laws N(gamma) and the PT-height extrapolation fan
      </h3>
      <ReachPowerLawChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the cyan solid curve is
        the imp-96149 empirical detector power law, the pink dashed curve is the imp-96182
        Christoffel eps1e4 reach re-fit; the small dots on each curve are the 5 shared measured
        gamma points. The dashed yellow vertical line marks T0; the two large dots where it meets
        each curve are the extrapolated reach orders needed at the verified height — both land near
        1e15, ~15 orders of magnitude beyond feasible computation, so Route L stays a fixed-cost
        detector rather than a lever.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96269
        baked fit literals verbatim (only the log10 curve sampling is computed here, no re-fit,
        no zeros-bundle import). Derivation on baked literals only; changes no bound; RH open;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
