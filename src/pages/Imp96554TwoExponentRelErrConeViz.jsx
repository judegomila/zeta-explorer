import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96554_CONE_SERIES,
  IMP96554_ANCHORS,
  IMP96554_LANDMARKS,
  IMP96554_HONEST_BANNER,
} from '../data/imp-96554-two-exponent-relerr-cone-viz-data.js';
import { ED } from '../styles/tokens.js';

function ConeChart() {
  const svgW = 720;
  const svgH = 360;
  const padL = 68;
  const padR = 16;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = 5.05;
  const xMax = 5.75;
  const yMin = -1.35;
  const yMax = -0.7;

  const xOf = (log10T) => padL + ((log10T - xMin) / (xMax - xMin)) * plotW;
  const yOf = (log10RelErr) => padT + plotH - ((log10RelErr - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7];
  const yTicks = [-1.3, -1.1, -0.9, -0.7];

  const coneUpperD = IMP96554_CONE_SERIES
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10T).toFixed(2)} ${yOf(Math.log10(p.coneUpperRelErr)).toFixed(2)}`)
    .join(' ');
  const coneLowerD = [...IMP96554_CONE_SERIES]
    .reverse()
    .map((p) => `L ${xOf(p.log10T).toFixed(2)} ${yOf(Math.log10(p.coneLowerRelErr)).toFixed(2)}`)
    .join(' ');
  const coneAreaD = `${coneUpperD} ${coneLowerD} Z`;

  const systematicD = IMP96554_CONE_SERIES
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10T).toFixed(2)} ${yOf(Math.log10(p.systematicRelErr)).toFixed(2)}`)
    .join(' ');
  const samplingD = IMP96554_CONE_SERIES
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.log10T).toFixed(2)} ${yOf(Math.log10(p.samplingNoiseRelErr)).toFixed(2)}`)
    .join(' ');

  const { anchor1, anchor2 } = IMP96554_ANCHORS;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.rule} strokeWidth={0.5} opacity={0.4} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {`1e${v}`}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <text key={`x${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {v.toFixed(1)}
        </text>
      ))}

      <path d={coneAreaD} fill={ED.series5} opacity={0.12} stroke="none" />

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={systematicD} fill="none" stroke={ED.series1} strokeWidth={2} opacity={0.95} />
      <path d={samplingD} fill="none" stroke={ED.series4} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.9} />

      {/* anchors */}
      <circle cx={xOf(anchor1.log10T)} cy={yOf(Math.log10(anchor1.relErr))} r={3.5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      <circle cx={xOf(anchor2.log10T)} cy={yOf(Math.log10(anchor2.relErr))} r={3.5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      <text x={xOf(anchor1.log10T) + 6} y={yOf(Math.log10(anchor1.relErr)) - 6} fill={ED.brass} fontSize={8}>
        T=1.5e5
      </text>
      <text x={xOf(anchor2.log10T) + 6} y={yOf(Math.log10(anchor2.relErr)) - 6} fill={ED.brass} fontSize={8}>
        T=3.879e5
      </text>

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log10 T
      </text>

      <g transform={`translate(${padL + 8}, ${padT + 10})`}>
        <line x1={0} y1={0} x2={18} y2={0} stroke={ED.series1} strokeWidth={2} />
        <text x={22} y={3} fill={ED.inkSoft} fontSize={8.5}>systematic (p=0, flat)</text>
        <line x1={0} y1={14} x2={18} y2={14} stroke={ED.series4} strokeWidth={1.5} strokeDasharray="5 3" />
        <text x={22} y={17} fill={ED.inkSoft} fontSize={8.5}>sampling-noise (p=-1/4)</text>
        <circle cx={9} cy={28} r={3} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
        <text x={22} y={31} fill={ED.inkSoft} fontSize={8.5}>imp-96493 measured anchor</text>
        <rect x={0} y={38} width={18} height={8} fill={ED.series5} opacity={0.3} />
        <text x={22} y={45} fill={ED.inkSoft} fontSize={8.5}>SE(p)~0.21 error cone</text>
      </g>
    </svg>
  );
}

export default function Imp96554TwoExponentRelErrConeViz() {
  const { anchor1, anchor2 } = IMP96554_ANCHORS;
  const { exponentSystematic, exponentSamplingNoise, deltaP, SE_p, separationSigma } = IMP96554_LANDMARKS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96528: Two-Exponent relErr(T) Cone" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96554_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The imp-96510 systematic-vs-noise sub-gap reduces to distinguishing two power laws for the
        below-envelope dip depth relErr(T) ~ C&middot;T^p: systematic (p={exponentSystematic}, flat)
        vs sampling-noise (p={exponentSamplingNoise}), a separation of only &Delta;p={deltaP}. Both
        lines are anchored through the imp-96493 T=1.5e5 measurement; the T=3.879e5 point is the
        actual second imp-96493 measurement, not a prediction. The shaded band is the SE(p)&asymp;
        {SE_p.toFixed(3)} error cone the fixed 10^6 Odlyzko set can reach at best.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        log-log relErr(T): two candidate exponents, SE(p) cone, and the two measured anchors
      </h3>
      <ConeChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue flat line is the
        systematic reading (relErr fixed at the T=1.5e5 depth); the orange dashed curve is the
        sampling-noise reading (relErr ~ T^(-1/4)) from the same anchor. Both predict a value at
        T=3.879e5 above the actual measurement ({anchor2.relErr.toFixed(4)} vs{' '}
        {anchor2.systematicPrediction.toFixed(4)} systematic / {anchor2.samplingNoisePrediction.toFixed(4)}{' '}
        sampling-noise) &mdash; the second anchor falls {anchor2.insideCone ? 'inside' : 'outside'} the
        SE(p) cone entirely, which is exactly the irreducible per-height scatter (&sigma;&asymp;1.11
        log-nats) imp-96528 identifies as dominant. With only two anchors and that much scatter, the
        &Delta;p={deltaP} gap between the two lines separates by at most &asymp;{separationSigma.toFixed(2)}{' '}
        sigma &mdash; far short of a decisive fit.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96528
        exponent-fit-reach verdict and the imp-96493 anchor measurements verbatim (the only new
        computation is evaluating the two power laws and the cone bounds over a plotting grid).
        Presentation / measurement diagnostic only; changes no bound; establishes no operator
        positivity; RH open; NO QED; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA; the
        zero-side route stays PCC/GRH-gated.
      </div>
    </div>
  );
}
