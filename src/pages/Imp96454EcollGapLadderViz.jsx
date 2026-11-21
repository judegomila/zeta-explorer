import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96454_GAP_LADDER_POINTS,
  IMP96454_ENVELOPE_POINTS,
  IMP96454_LANDMARKS,
  IMP96454_HONEST_BANNER,
} from '../data/imp-96454-ecoll-gap-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

function GapLadderChart() {
  const svgW = 720;
  const svgH = 340;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = -1;
  const xMax = 23;
  const yMin = -17;
  const yMax = 0;

  const xOf = (log10N) => padL + ((log10N - xMin) / (xMax - xMin)) * plotW;
  const yOf = (log10v) => padT + plotH - ((log10v - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [0, 4, 8, 12, 16, 20];
  const yTicks = [-16, -12, -8, -4, 0];

  const gammaD = IMP96454_GAP_LADDER_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N).toFixed(2)} ${yOf(p.log10GammaGap).toFixed(2)}`)
    .join(' ');
  const rateD = IMP96454_GAP_LADDER_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N).toFixed(2)} ${yOf(p.log10RateGap).toFixed(2)}`)
    .join(' ');
  const envelopeD = IMP96454_ENVELOPE_POINTS
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10N).toFixed(2)} ${yOf(p.log10Envelope).toFixed(2)}`)
    .join(' ');

  const floorY = yOf(Math.log10(IMP96454_LANDMARKS.floor));

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

      {/* double-precision floor line */}
      <line x1={padL} y1={floorY} x2={padL + plotW} y2={floorY} stroke={ED.series2} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
      <text x={padL + plotW - 4} y={floorY - 4} textAnchor="end" fill={ED.series2} fontSize={8}>
        double-precision floor (~1e-16)
      </text>

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={envelopeD} fill="none" stroke={ED.series5} strokeWidth={1} strokeDasharray="2 3" opacity={0.85} />
      <path d={gammaD} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.95} />
      <path d={rateD} fill="none" stroke={ED.series4} strokeWidth={1.5} opacity={0.95} />

      {IMP96454_GAP_LADDER_POINTS.map((p) => (
        <g key={`pts-${p.N}`}>
          <circle cx={xOf(p.log10N)} cy={yOf(p.log10GammaGap)} r={2.6} fill={ED.series1} />
          <circle cx={xOf(p.log10N)} cy={yOf(p.log10RateGap)} r={2.6} fill={ED.series4} />
        </g>
      ))}

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 N (N = 1 .. 1e22)
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 8})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series1} strokeWidth={2} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>|gammaRelGap| (count-model height gap)</text>
        <line x1={0} y1={14} x2={18} y2={14} stroke={ED.series4} strokeWidth={1.5} />
        <text x={22} y={17} fill={ED.inkSoft} fontSize={8.5}>|rateRelGap| (count-model rate gap)</text>
        <line x1={0} y1={28} x2={18} y2={28} stroke={ED.series5} strokeWidth={1} strokeDasharray="2 3" />
        <text x={22} y={31} fill={ED.inkSoft} fontSize={8.5}>1/(gamma log gamma) envelope, scaled to N=1e3</text>
      </g>
    </svg>
  );
}

export default function Imp96454EcollGapLadderViz() {
  const { firstZeroGammaGap, firstZeroRateGap, odlyzko1e22GammaGap } = IMP96454_LANDMARKS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96426: E_coll Count-Model Gap Ladder" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96454_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The RvM main-term count-inversion reference height disagrees with the externally
        tabulated TRUE Odlyzko zero height at every index N by a relative gap that shrinks
        smoothly as N grows: macroscopic at the first zero, and collapsing below the
        double-precision floor by N = 1e22. imp-96426 measured four intermediate anchors
        (N = 1e3..1e6) between the two imp-96402 endpoints; this chart plots all six points.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        gammaRelGap and rateRelGap vs N on log-log, double-precision floor marked
      </h3>
      <GapLadderChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> both curves fall
        steadily across N = 1 .. 1e22, tracking the dashed reference envelope
        1/(gamma_N log gamma_N) (scaled to match the N=1e3 anchor). At N=1 the gap is
        macroscopic (gammaRelGap {firstZeroGammaGap.toExponential(2)}, rateRelGap{' '}
        {firstZeroRateGap.toExponential(2)}); by N=1e22 the gammaRelGap has collapsed to{' '}
        {odlyzko1e22GammaGap.toExponential(2)}, at the red dashed double-precision floor,
        and the rateRelGap is exactly 0 (plotted at the floor for log-axis representability).
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
        imp-96426 baked six-anchor object verbatim (only the log10 axis reshaping, an abs()
        of the two signed gaps, a floor clip for the exact-zero point, and one scale constant
        for the reference envelope are computed here). Measurement/accuracy audit only: no
        gap closed, no bound changed, G6_polymath15_bridge not closed, conditional
        C_H &le; 0.127 stays UNPROVEN, C_H isRigorousUpperBound = false (imp-2642/imp-2701). RH open. NO QED.
      </div>
    </div>
  );
}
