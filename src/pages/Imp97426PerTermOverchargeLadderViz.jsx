import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97426_LADDER,
  IMP97426_MAGNITUDE_THRESHOLD,
  IMP97426_INV_G2,
} from '../data/imp-97426-per-term-overcharge-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// imp-97426: bar chart of the imp-97392 per-term over-charge constant
// maxGroup(omega) * g(2)/2 against the 1/2 MAGNITUDE ceiling, marking
// omega<=3 PROVED (below threshold) and omega>=4 OVER-CHARGE (at/above it).

function LadderBarChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rows = IMP97426_LADDER;
  const maxVal = Math.max(...rows.map((r) => r.perTermConst)) * 1.12;
  const yOf = (v) => padT + plotH - (v / maxVal) * plotH;
  const barW = plotW / rows.length;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, 1, 2, 3, 4, 5].filter((v) => v <= maxVal).map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <line
        x1={padL}
        y1={yOf(IMP97426_MAGNITUDE_THRESHOLD)}
        x2={padL + plotW}
        y2={yOf(IMP97426_MAGNITUDE_THRESHOLD)}
        stroke={ED.series3}
        strokeWidth={1.5}
        strokeDasharray="5 3"
      />
      <text x={padL + plotW - 4} y={yOf(IMP97426_MAGNITUDE_THRESHOLD) - 5} textAnchor="end" fill={ED.series3} fontSize={9}>
        MAGNITUDE ceiling 1/2
      </text>
      {rows.map((r, i) => {
        const x = padL + i * barW + barW * 0.18;
        const w = barW * 0.64;
        const y = yOf(r.perTermConst);
        const h = padT + plotH - y;
        const color = r.status === 'PROVED' ? ED.series3 : ED.series2;
        return (
          <g key={r.omega}>
            <rect x={x} y={y} width={w} height={h} fill={color} opacity={0.85} rx={2} />
            <text x={x + w / 2} y={y - 6} textAnchor="middle" fill={color} fontSize={9.5} fontWeight={600}>
              {r.perTermConst.toFixed(4)}
            </text>
            <text x={x + w / 2} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
              omega={r.omega}
            </text>
            <text x={x + w / 2} y={padT + plotH + 30} textAnchor="middle" fill={color} fontSize={8}>
              {r.status}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97426PerTermOverchargeLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M b/4-Ceiling Per-Term Over-Charge Constant Ladder by omega" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> presentation of the
        imp-97392 per-term MAGNITUDE bound, reused verbatim. The omega&ge;4 gap is
        OPEN, not disproved &mdash; the per-term bound alone over-charges there; a
        uniform proof would need the retained Moebius cancellation between the
        positive-mu and negative-mu signed groups. No new bound; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-97290/imp-97392 reduce the b/4 ceiling |E1(b)| &le; b/4 to a SIGN condition
        plus a MAGNITUDE condition |Delta(b)| &le; b/2. The per-term (triangle-on-groups)
        proof of MAGNITUDE charges every proper-divisor term d&middot;g(b/d) &le; b&middot;g(2)/2, so
        the largest signed group of size maxGroup(&omega;) forces a constant
        maxGroup(&omega;)&middot;g(2)/2. That per-term bound works only while
        maxGroup(&omega;) stays below 1/g(2) = {IMP97426_INV_G2.toFixed(6)}: true for
        &omega;&le;3 (max group 3), false from &omega;=4 (max group 8).
      </p>

      <LadderBarChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the green
        dashed line marks the 1/2 MAGNITUDE ceiling. &omega;=2 (0.3069) and &omega;=3
        (0.4603) sit below it &mdash; PROVED, with genuine slack. &omega;=4 (1.2274)
        jumps well past the ceiling, and &omega;=5 (2.3014), &omega;=6 (4.9096) climb
        further &mdash; OVER-CHARGE: the per-term bound cannot close MAGNITUDE there on
        its own.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming
        the imp-97392 groupCounts kernel verbatim; no re-derivation. Establishes no new
        bound; the omega&ge;4 MAGNITUDE gap stays open; RH open; NO QED.
      </div>
    </div>
  );
}
