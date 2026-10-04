import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97589_CURVE_SAMPLES,
  IMP97589_LANDMARKS,
  IMP97589_VERDICT,
} from '../data/imp-97589-sigma-landmark-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97589: charts the imp-97520 sigma(N) = E_coll/E_N conditional-share
// decay curve with the four tabulated landmarks overlaid (interior peak,
// below-0.9, halving, below-0.1 downslope crossings).

const COLOR_CURVE = ED.series1;
const COLOR_LANDMARK = ED.series3;

function LandmarkPanel() {
  const svgW = 680;
  const svgH = 300;
  const padL = 64;
  const padR = 20;
  const padT = 16;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const samples = IMP97589_CURVE_SAMPLES;
  const logNMin = samples[0].logN;
  const logNMax = samples[samples.length - 1].logN;
  const vMax = 1;
  const vMin = 0;

  const xOf = (logN) => padL + ((logN - logNMin) / (logNMax - logNMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - vMin) / (vMax - vMin)) * plotH;

  const curvePoints = samples.map((p) => `${xOf(p.logN)},${yOf(p.sigma)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <polyline points={curvePoints} fill="none" stroke={COLOR_CURVE} strokeWidth={1.75} />

      {IMP97589_LANDMARKS.map((lm) => (
        <g key={lm.label}>
          <line x1={xOf(lm.logN)} y1={padT} x2={xOf(lm.logN)} y2={padT + plotH} stroke={COLOR_LANDMARK} strokeWidth={1} strokeDasharray="2 2" />
          <circle cx={xOf(lm.logN)} cy={yOf(lm.sigma)} r={3.5} fill={COLOR_LANDMARK} />
          <text x={xOf(lm.logN)} y={padT + 10} textAnchor="middle" fill={COLOR_LANDMARK} fontSize={8}>
            {lm.label}
          </text>
        </g>
      ))}

      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {[3, 5, 7, 9, 11, 13].map((logN) => (
        <text key={`xt${logN}`} x={xOf(logN)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          1e{logN}
        </text>
      ))}

      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <text key={`yt${v}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}

      <text x={padL + plotW / 2} y={svgH - 2} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        N (log) &mdash; <tspan fill={COLOR_CURVE}>sigma(N) = E_coll/E_N</tspan>, landmarks in{' '}
        <tspan fill={COLOR_LANDMARK}>green</tspan>
      </text>
    </svg>
  );
}

export default function Imp97589SigmaLandmarkLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-97520: sigma(N) Conditional-Share Landmark Ladder" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-1)' }}>Honest status:</strong> presentation
        only, charting the already-tabulated imp-97520 landmark ladder with
        the exact inherited sigma(N) sub-terms. No bound moves; establishes no
        operator positivity; Platt-Trudgian Lambda&le;0.2 remains SOTA; RH
        open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The conditional-share curve sigma(N) = E_coll/E_N rises to an interior
        peak (sigma&nbsp;&asymp;&nbsp;0.9494 at N&nbsp;&asymp;&nbsp;9.22e5),
        then decays through three downslope crossings: stays above 0.9 until
        N&nbsp;&asymp;&nbsp;2.57e7, halves (sigma=1/2) at
        N&nbsp;&asymp;&nbsp;3.27e9, and drops below 0.1 at
        N&nbsp;&asymp;&nbsp;3.21e11 &mdash; a span of&nbsp;
        {IMP97589_VERDICT.decadesSpanPeakToTail} decades from peak to tail.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        sigma(N) decay curve with the four landmarks
      </h3>
      <LandmarkPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page
        consuming the imp-97520 tabulated ladder object verbatim; no re-solve.
        Establishes no bound; RH open; NO QED.
      </div>
    </div>
  );
}
