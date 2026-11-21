import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96320_AXIS,
  IMP96320_T0,
  IMP96320_BAND95,
  IMP96320_BAND1SIGMA,
  IMP96320_POINT_ESTIMATE,
  IMP96320_SOURCE_POINTS,
  IMP96320_HONEST_BANNER,
} from '../data/imp-96320-route-l-reach-band-viz-data.js';
import { IMP96310_FEASIBILITY_HEIGHT } from '../data/imp-96310-route-l-feasibility-height.js';
import { ED } from '../styles/tokens.js';

function ReachBandChart() {
  const svgW = 680;
  const svgH = 200;
  const padL = 50;
  const padR = 30;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xOf = (log10v) => padL + ((log10v - IMP96320_AXIS.minLog10) / (IMP96320_AXIS.maxLog10 - IMP96320_AXIS.minLog10)) * plotW;

  const midY = padT + plotH / 2;
  const band95Y0 = midY - 22;
  const band95H = 44;
  const band1sY0 = midY - 12;
  const band1sH = 24;

  const xTicks = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

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

      {/* 95% covariance-propagated envelope */}
      <rect
        x={xOf(IMP96320_BAND95.loLog10)}
        y={band95Y0}
        width={xOf(IMP96320_BAND95.hiLog10) - xOf(IMP96320_BAND95.loLog10)}
        height={band95H}
        fill={ED.series1}
        opacity={0.14}
      />
      {/* 1-sigma envelope */}
      <rect
        x={xOf(IMP96320_BAND1SIGMA.loLog10)}
        y={band1sY0}
        width={xOf(IMP96320_BAND1SIGMA.hiLog10) - xOf(IMP96320_BAND1SIGMA.loLog10)}
        height={band1sH}
        fill={ED.series1}
        opacity={0.30}
      />

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {/* PT height point estimate */}
      <line
        x1={xOf(IMP96320_POINT_ESTIMATE.log10)}
        y1={band95Y0 - 6}
        x2={xOf(IMP96320_POINT_ESTIMATE.log10)}
        y2={band95Y0 + band95H + 6}
        stroke={ED.brassDeco}
        strokeWidth={2}
      />

      {/* three source point estimates */}
      {IMP96320_SOURCE_POINTS.map((p) => (
        <circle key={p.label} cx={xOf(p.log10)} cy={midY} r={3} fill={ED.series7} />
      ))}

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        reach N at the Platt-Trudgian height T0 = {IMP96320_T0.value.toExponential(4)} (log10 scale)
      </text>

      <g transform={`translate(${padL + 8}, ${padT})`}>
        <rect x={0} y={0} width={14} height={9} fill={ED.series1} opacity={0.14} />
        <text x={19} y={8} fill={ED.inkSoft} fontSize={8}>95% band [{IMP96320_BAND95.lo.toExponential(2)}, {IMP96320_BAND95.hi.toExponential(2)}]</text>
        <rect x={0} y={13} width={14} height={9} fill={ED.series1} opacity={0.30} />
        <text x={19} y={21} fill={ED.inkSoft} fontSize={8}>1-sigma band [{IMP96320_BAND1SIGMA.lo.toExponential(2)}, {IMP96320_BAND1SIGMA.hi.toExponential(2)}]</text>
        <line x1={4} y1={30} x2={4} y2={38} stroke={ED.brassDeco} strokeWidth={2} />
        <text x={19} y={37} fill={ED.inkSoft} fontSize={8}>point estimate ~{IMP96320_POINT_ESTIMATE.value.toExponential(0)}</text>
        <circle cx={7} cy={45} r={3} fill={ED.series7} />
        <text x={19} y={48} fill={ED.inkSoft} fontSize={8}>source point estimates (detector, Christoffel, pooled)</text>
      </g>
    </svg>
  );
}

export default function Imp96320RouteLReachBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96287: Route L Reach Band vs Point Estimate at the PT Height" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96320_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96269 reported three Route L reach extrapolations at the Platt-Trudgian height
        (detector, Christoffel, baked pooled) that agree as point estimates to within a factor
        2.18, all near N ~ 1e15. imp-96287 propagated the log-log fit-parameter covariance
        (n = 5, df = 3) through the ~10.4-decade extrapolation and found the honest statistical
        band is far wider than the point-estimate spread suggests.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Point estimate vs covariance-propagated bands (log scale)
      </h3>
      <ReachBandChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the three pink dots are
        the point extrapolations (detector, Christoffel, baked pooled), all clustered near the
        yellow reported reach line at ~1e15. The dark-blue band is the 1-sigma envelope
        [{IMP96320_BAND1SIGMA.lo.toExponential(2)}, {IMP96320_BAND1SIGMA.hi.toExponential(2)}]; the
        pale-blue band is the 95% envelope [{IMP96320_BAND95.lo.toExponential(2)},{' '}
        {IMP96320_BAND95.hi.toExponential(2)}] spanning {IMP96320_BAND95.decades.toFixed(2)} decades.
        Even the tightest (1-sigma) band floor sits ~14 orders of magnitude beyond any feasible
        computation, so widening the band changes nothing operationally.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>imp-96310 feasibility-height check:</strong> at no
        feasible accessible-N does the reach reach the verified height. Even at the extreme
        feasibility ceiling N = {IMP96310_FEASIBILITY_HEIGHT.extremeFeasibilityCeiling.toExponential(0)} (the
        SOTA computed-zeros count), the inverted reach fit gives &gamma;_max ={' '}
        {IMP96310_FEASIBILITY_HEIGHT.leverTestAt1e13.detector.gammaMax.toExponential(2)} (detector) /{' '}
        {IMP96310_FEASIBILITY_HEIGHT.leverTestAt1e13.christoffel.gammaMax.toExponential(2)} (Christoffel),
        still {IMP96310_FEASIBILITY_HEIGHT.leverTestAt1e13.detector.decadesShort} /{' '}
        {IMP96310_FEASIBILITY_HEIGHT.leverTestAt1e13.christoffel.decadesShort} decades short of the
        already-verified Platt&ndash;Trudgian height T0 ={' '}
        {IMP96310_FEASIBILITY_HEIGHT.T0.toExponential(4)}.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96287
        baked covariance-propagated band literals verbatim (only the log10 axis reshaping is
        computed here). Derivation on baked literals only; changes no bound; RH open. NO QED.
      </div>
    </div>
  );
}
