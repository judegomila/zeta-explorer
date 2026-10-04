import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96395_RAMP,
  IMP96395_D2,
  IMP96395_KNEE,
  IMP96395_RAMP_AXIS,
  IMP96395_D2_AXIS,
  IMP96395_SUMMARY,
  IMP96395_HONEST_BANNER,
} from '../data/imp-96395-sigma-local-exponent-ramp-viz-data.js';
import { ED } from '../styles/tokens.js';

function RampChart() {
  const svgW = 680;
  const svgH = 220;
  const padL = 46;
  const padR = 20;
  const padT = 16;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xOf = (d) => padL
    + ((d - IMP96395_RAMP_AXIS.log10NMin) / (IMP96395_RAMP_AXIS.log10NMax - IMP96395_RAMP_AXIS.log10NMin)) * plotW;
  const yOf = (v) => padT + plotH
    - ((v - IMP96395_RAMP_AXIS.exponentMin) / (IMP96395_RAMP_AXIS.exponentMax - IMP96395_RAMP_AXIS.exponentMin)) * plotH;

  const path = IMP96395_RAMP
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.log10N).toFixed(2)},${yOf(p.exponent).toFixed(2)}`)
    .join(' ');

  const xTicks = [9, 9.5, 10, 10.5, 11, 11.5, 12];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {xTicks.map((v) => (
        <line
          key={`gx${v}`}
          x1={xOf(v)}
          y1={padT}
          x2={xOf(v)}
          y2={padT + plotH}
          stroke={ED.rule}
          strokeWidth={0.5}
          opacity={0.25}
        />
      ))}
      <path d={path} fill="none" stroke={ED.series6} strokeWidth={2} />
      <line
        x1={xOf(IMP96395_KNEE.log10N)}
        y1={padT}
        x2={xOf(IMP96395_KNEE.log10N)}
        y2={padT + plotH}
        stroke={ED.brassDeco}
        strokeWidth={1.25}
        strokeDasharray="3,3"
      />
      <circle cx={xOf(IMP96395_KNEE.log10N)} cy={yOf(IMP96395_KNEE.exponent)} r={5} fill={ED.series5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((v) => (
        <text key={`tx${v}`} x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
          {v}
        </text>
      ))}
      <text x={padL - 8} y={yOf(IMP96395_RAMP_AXIS.exponentMax) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
        {IMP96395_RAMP_AXIS.exponentMax.toFixed(3)}
      </text>
      <text x={padL - 8} y={yOf(IMP96395_RAMP_AXIS.exponentMin) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
        {IMP96395_RAMP_AXIS.exponentMin.toFixed(3)}
      </text>
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        log10 N (tenth-decade brackets, [1e9,1e12])
      </text>
    </svg>
  );
}

function D2Chart() {
  const svgW = 680;
  const svgH = 180;
  const padL = 46;
  const padR = 20;
  const padT = 16;
  const padB = 30;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xOf = (d) => padL
    + ((d - IMP96395_D2_AXIS.log10NMin) / (IMP96395_D2_AXIS.log10NMax - IMP96395_D2_AXIS.log10NMin)) * plotW;
  const yOf = (v) => padT + plotH
    - ((v - IMP96395_D2_AXIS.accelerationMin) / (IMP96395_D2_AXIS.accelerationMax - IMP96395_D2_AXIS.accelerationMin)) * plotH;

  const path = IMP96395_D2
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(p.log10N).toFixed(2)},${yOf(p.acceleration).toFixed(4)}`)
    .join(' ');

  const zeroY = yOf(0);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke={ED.rule} strokeWidth={0.75} strokeDasharray="2,2" />
      <path d={path} fill="none" stroke={ED.series7} strokeWidth={2} />
      <line
        x1={xOf(IMP96395_KNEE.log10N)}
        y1={padT}
        x2={xOf(IMP96395_KNEE.log10N)}
        y2={padT + plotH}
        stroke={ED.brassDeco}
        strokeWidth={1.25}
        strokeDasharray="3,3"
      />
      <circle cx={xOf(IMP96395_KNEE.log10N)} cy={zeroY} r={4} fill={ED.brassDeco} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        D2 (ramp acceleration) vs log10 N; dashed horizontal line = zero-crossing level
      </text>
    </svg>
  );
}

export default function Imp96395SigmaLocalExponentRampViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96351: sigma(N) Local-Exponent Ramp and Its D2 Zero-Crossing Knee across [1e9,1e12]" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96395_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96351 differenced the sigma(N) = E_coll/(E_trunc+E_flow+E_coll) local decay
        exponent on a tenth-decade grid ({IMP96395_SUMMARY.primaryNumSubBrackets} sub-brackets,
        {' '}{IMP96395_SUMMARY.ptsPerDecade} pts/decade) across the wider window
        {' '}{IMP96395_SUMMARY.windowLabel} and found the exponent ramp is sigmoid: its second
        difference D2 (acceleration) changes sign exactly {IMP96395_SUMMARY.primaryNumSignChanges}
        {' '}time, at log10 N* = {IMP96395_KNEE.log10N.toFixed(4)} (N* ~ {IMP96395_KNEE.N}).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        local-exponent ramp p_dec(N)
      </h3>
      <RampChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        second difference D2 (ramp acceleration)
      </h3>
      <D2Chart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the cyan curve is
        the OLS local exponent p_dec on each tenth-decade sub-bracket; the pink curve below
        is its second difference D2. The dashed yellow line in both marks the single knee at
        log10 N* = {IMP96395_KNEE.log10N.toFixed(4)}, where D2 crosses zero (purple dot on the
        ramp, yellow dot on the D2 zero line) — the once-only inflection imp-96351 found stable
        under both a wider window and a finer grid.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page; the sigma(N)/OLS
        exponent/D2 logic is copied verbatim from imp-96351 (no fresh model, no re-fit), only
        re-run here to expose the per-bracket series for charting. Measurement/fit only;
        inherited component model, not a rigorous asymptotic; changes no bound; RH open;
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
