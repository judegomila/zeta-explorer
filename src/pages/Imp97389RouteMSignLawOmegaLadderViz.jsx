import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97389_OMEGA_LADDER,
  IMP97389_LADDER_SUMMARY,
} from '../data/imp-97389-route-m-sign-law-omega-ladder-viz-data.js';
import { ED, STATUS } from '../styles/tokens.js';

// imp-97389: renders the Route M sign-law T(b) < 0 omega-class ladder as a status row per omega,
// showing the proved range (omega <= 4, imp-97333/imp-97352) and the sharp Hall-deficiency wall at
// omega = 5, with the level-2-positives-vs-level-1-negatives counting margin that drives the wall.

const STATUS_COLOR = {
  vacuous: ED.series8,
  proved: STATUS.proved.fg,
  boundary: ED.series2,
};

const STATUS_LABEL = {
  vacuous: 'vacuous (b=1, out of scope)',
  proved: 'PROVED',
  boundary: 'SHARP WALL (open)',
};

function OmegaLadderChart({ rows }) {
  const svgW = 720;
  const rowH = 52;
  const padL = 60;
  const padT = 16;
  const svgH = padT + rows.length * rowH + 12;
  const barX = padL;
  const barMaxW = 300;
  const maxAbsMargin = Math.max(...rows.map((r) => (r.margin === null ? 0 : Math.abs(r.margin))), 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {rows.map((row, idx) => {
        const y = padT + idx * rowH;
        const hasMargin = row.margin !== null;
        const barW = hasMargin ? Math.max(4, (Math.abs(row.margin) / maxAbsMargin) * barMaxW) : 0;
        const barFill = row.margin > 0 ? ED.series1 : row.margin < 0 ? ED.series2 : ED.series8;
        return (
          <g key={row.omega}>
            <text x={padL - 8} y={y + rowH / 2 - 2} textAnchor="end" fill={ED.ink} fontSize={12} fontFamily="monospace">
              &omega;={row.omega}
            </text>
            <rect x={barX} y={y + 6} width={340} height={rowH - 16} fill={ED.paper3} rx={3} />
            {hasMargin && (
              <rect
                x={barX + 170}
                y={y + 10}
                width={barW}
                height={rowH - 24}
                fill={barFill}
                rx={2}
                transform={row.margin < 0 ? `translate(${-barW},0)` : undefined}
              />
            )}
            <line x1={barX + 170} y1={y + 6} x2={barX + 170} y2={y + rowH - 10} stroke={ED.rule} strokeWidth={1} />
            <text
              x={barX + 350}
              y={y + rowH / 2 - 8}
              fill={STATUS_COLOR[row.status]}
              fontSize={11}
              fontWeight={700}
              fontFamily="monospace"
            >
              {STATUS_LABEL[row.status]}
            </text>
            <text x={barX + 350} y={y + rowH / 2 + 8} fill={ED.inkSoft} fontSize={9.5} fontFamily="monospace">
              {hasMargin
                ? `C(${row.n},2)=${row.level2Positives} vs n=${row.level1Negatives} (margin ${row.margin >= 0 ? '+' : ''}${row.margin})`
                : 'n/a'}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp97389RouteMSignLawOmegaLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Sign-Law Omega-Class Ladder" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 6%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--ink)' }}>Honest status:</strong> the sign law
        T(b) = &sum;<sub>e|b,e&ge;2</sub> &mu;(e) J(e-1) &lt; 0 (squarefree b) is PROVED elementarily
        through &omega;(b) = {IMP97389_LADDER_SUMMARY.provedThrough} (imp-97333 for &omega;&le;3,
        imp-97352 for &omega;=4). The domination method hits a SHARP wall at
        &omega; = {IMP97389_LADDER_SUMMARY.sharpWallAt}: {IMP97389_LADDER_SUMMARY.countingRule}.
        &omega;&ge;5 remains open, reduced to {IMP97389_LADDER_SUMMARY.residualSubgap}. This is a
        measurement/status display, not a new bound; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        Per-&omega; status row. The bar shows the counting margin n &minus; C(n,2), where n = &omega;&minus;1
        is the number of primes past the smallest and C(n,2) is the number of level-2 positive peel
        terms that must be dominated by the n level-1 negative terms: blue = surplus (method proved
        with room), red = deficit (method fails, imp-97352 Hall-deficiency wall).
      </p>
      <OmegaLadderChart rows={IMP97389_OMEGA_LADDER} />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-97389
        viz-data leaf (every value reused verbatim from imp-97333/imp-97352, no re-derivation).
        Changes no bound, establishes no operator positivity; RH open; NO QED.
      </div>
    </div>
  );
}
