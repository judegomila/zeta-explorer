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
          <line x1={xOf(v)} y1={padT} x2={xOf(v)} y2={padT + plotH} stroke="#334155" strokeWidth={0.5} opacity={0.3} />
          <text x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill="#64748b" fontSize={8}>
            {`1e${v}`}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke="#334155" strokeWidth={0.5} opacity={0.2} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8}>
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
        stroke="#facc15"
        strokeWidth={1}
        strokeDasharray="3,3"
        opacity={0.6}
      />
      <circle cx={xOf(IMP96302_T0.log10)} cy={yOf(IMP96302_EXTRAPOLATION_FAN.detectorPowerLaw.log10)} r={4} fill="#22d3ee" />
      <circle cx={xOf(IMP96302_T0.log10)} cy={yOf(IMP96302_EXTRAPOLATION_FAN.christoffelPowerLaw.log10)} r={4} fill="#f472b6" />

      {/* detector and Christoffel power-law curves */}
      <path d={detectorPath} fill="none" stroke="#22d3ee" strokeWidth={2} />
      <path d={christoffelPath} fill="none" stroke="#f472b6" strokeWidth={2} strokeDasharray="6,3" />

      {/* shared measured points */}
      {IMP96302_MEASURED_POINTS.map((p) => (
        <g key={`m${p.gamma}`}>
          <circle cx={xOf(p.gammaLog10)} cy={yOf(p.measuredNdetLog10)} r={2.5} fill="#22d3ee" opacity={0.7} />
          <circle cx={xOf(p.gammaLog10)} cy={yOf(p.christoffelEps1e4Log10)} r={2.5} fill="#f472b6" opacity={0.7} />
        </g>
      ))}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        {'gamma (log10 scale); dashed yellow line = Platt-Trudgian height T0'}
      </text>

      <g transform={`translate(${padL + 8}, ${padT})`}>
        <line x1={0} y1={4} x2={16} y2={4} stroke="#22d3ee" strokeWidth={2} />
        <text x={21} y={8} fill="#94a3b8" fontSize={8}>
          {`detector fit N=${IMP96302_FIT_SUMMARY.detectorFit.A.toFixed(6)}*gamma^${IMP96302_FIT_SUMMARY.detectorFit.b.toFixed(6)}`}
        </text>
        <line x1={0} y1={18} x2={16} y2={18} stroke="#f472b6" strokeWidth={2} strokeDasharray="4,2" />
        <text x={21} y={22} fill="#94a3b8" fontSize={8}>
          {`Christoffel fit N=${IMP96302_FIT_SUMMARY.christoffelFit.A.toFixed(6)}*gamma^${IMP96302_FIT_SUMMARY.christoffelFit.b.toFixed(6)}`}
        </text>
        <circle cx={7} cy={32} r={4} fill="#22d3ee" />
        <text x={21} y={36} fill="#94a3b8" fontSize={8}>
          {`N needed at T0: detector ${IMP96302_EXTRAPOLATION_FAN.detectorPowerLaw.value.toExponential(2)}`}
        </text>
        <circle cx={7} cy={46} r={4} fill="#f472b6" />
        <text x={21} y={50} fill="#94a3b8" fontSize={8}>
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
          background: IMP96302_CONSISTENT ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)',
          color: IMP96302_CONSISTENT ? '#4ade80' : '#f87171',
          border: `1px solid ${IMP96302_CONSISTENT ? '#4ade80' : '#f87171'}`,
        }}
      >
        {`VERDICT: ${IMP96302_CONSISTENT ? 'CONSISTENT' : 'INCONSISTENT'}`}
      </span>

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> {IMP96302_HONEST_BANNER}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96269 re-fit the imp-96182 genuine Christoffel eps1e4 reach column as the same power
        law form the imp-96149 empirical detector column uses, over the shared gamma range
        [14.13, 77.14]. Both curves below extrapolate on a log-log grid out to the Platt-Trudgian
        verified height T0 = {IMP96302_T0.value.toExponential(4)}, landing at the same 1e15 order
        of magnitude.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Reach power laws N(gamma) and the PT-height extrapolation fan
      </h3>
      <ReachPowerLawChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the cyan solid curve is
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
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96269
        baked fit literals verbatim (only the log10 curve sampling is computed here, no re-fit,
        no zeros-bundle import). Derivation on baked literals only; changes no bound; RH open;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
