import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT } from '../data/imp-35243-reentry-band-surrogate-fidelity-assessment.js';
import { ED } from '../styles/tokens.js';

// Baked literals imported verbatim from the imp-35243 data module; no new
// computation is performed here (viz/UX only).
const { demonstration_D2_extrapolation_gap: D2 } = IMP35243_REENTRY_BAND_SURROGATE_FIDELITY_ASSESSMENT;

const PT_LOG10 = D2.pt_verified_height_log10;
const REENTRY_LOG10 = PT_LOG10 + D2.reentry_decades_above_verified;
const EXIT_LOG10 = PT_LOG10 + D2.exit_decades_above_verified;

const MARKS = [
  { log10N: PT_LOG10, label: 'Platt-Trudgian verified height', sub: `10^${PT_LOG10.toFixed(2)}`, color: ED.series3 },
  { log10N: REENTRY_LOG10, label: 'reentry edge', sub: `10^${REENTRY_LOG10.toFixed(2)}`, color: ED.series5 },
  { log10N: EXIT_LOG10, label: 'exit edge', sub: `10^${EXIT_LOG10.toFixed(2)}`, color: ED.series7 },
];

function ExtrapolationGapAxis() {
  const svgW = 760;
  const padL = 40;
  const padR = 40;
  const padT = 70;
  const padB = 60;
  const plotW = svgW - padL - padR;
  const axisY = padT + 40;
  const svgH = padT + 40 + padB;

  const xMin = PT_LOG10 - 3;
  const xMax = EXIT_LOG10 + 3;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 46} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        D2: verified-height vs. reentry-band position (log10 N axis)
      </text>

      <line
        x1={xOf(PT_LOG10)}
        y1={axisY}
        x2={xOf(REENTRY_LOG10)}
        y2={axisY}
        stroke={ED.rule}
        strokeWidth={10}
      />
      <text
        x={(xOf(PT_LOG10) + xOf(REENTRY_LOG10)) / 2}
        y={axisY - 12}
        textAnchor="middle"
        fill={ED.series2}
        fontSize={10}
      >
        {D2.reentry_decades_above_verified.toFixed(1)} decades &mdash; no verified anchor
      </text>

      <line
        x1={xOf(REENTRY_LOG10)}
        y1={axisY}
        x2={xOf(EXIT_LOG10)}
        y2={axisY}
        stroke="#5b21b6"
        strokeWidth={10}
      />
      <text
        x={(xOf(REENTRY_LOG10) + xOf(EXIT_LOG10)) / 2}
        y={axisY - 12}
        textAnchor="middle"
        fill={ED.series5}
        fontSize={10}
      >
        band, width {(D2.exit_decades_above_verified - D2.reentry_decades_above_verified).toFixed(2)} decades
      </text>

      <line x1={padL} y1={axisY + 22} x2={padL + plotW} y2={axisY + 22} stroke={ED.rule} strokeWidth={1} />

      {MARKS.map((m) => (
        <g key={m.label}>
          <line x1={xOf(m.log10N)} y1={axisY - 6} x2={xOf(m.log10N)} y2={axisY + 26} stroke={m.color} strokeWidth={2} />
          <circle cx={xOf(m.log10N)} cy={axisY} r={5} fill={m.color} />
          <text x={xOf(m.log10N)} y={axisY + 40} textAnchor="middle" fill={m.color} fontSize={9} fontWeight={700}>
            {m.sub}
          </text>
          <text x={xOf(m.log10N)} y={axisY + 52} textAnchor="middle" fill={ED.inkSoft} fontSize={8}>
            {m.label}
          </text>
        </g>
      ))}

      <text x={padL + plotW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        log10 N
      </text>
    </svg>
  );
}

export default function Imp35345ExtrapolationGapViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="D2 Extrapolation Gap: Verified Height vs. Reentry Band (imp-35345)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35243 D2 demonstration places the highest Platt-Trudgian verified zero height
        (N&nbsp;&asymp;&nbsp;10^{PT_LOG10.toFixed(2)}, the height that binds &Lambda;&nbsp;&le;&nbsp;0.2) on the
        same log10&nbsp;N axis as the iters-to-floor reentry band. The reentry edge sits
        {' '}{D2.reentry_decades_above_verified.toFixed(1)} decades above the verified height and the exit edge
        {' '}{D2.exit_decades_above_verified.toFixed(1)} decades above it &mdash; a gap with no verified arithmetic
        datum anywhere inside it.
      </p>

      <ExtrapolationGapAxis />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page reusing the imp-35243 baked
        demonstration_D2_extrapolation_gap literals verbatim (no re-derivation). The gap is drawn to scale on a
        log10&nbsp;N axis only to make the {D2.reentry_decades_above_verified.toFixed(1)}&ndash;
        {D2.exit_decades_above_verified.toFixed(1)}-decade extrapolation visible; it does not certify the band
        against any independent witness. Changes no bound; establishes no operator positivity; no RH verdict, NO
        QED.
      </div>
    </div>
  );
}
