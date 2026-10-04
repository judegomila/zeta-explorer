import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97409_PROVED_EXAMPLES,
  IMP97409_OPEN_PRIMORIAL_LADDER,
  IMP97409_OMEGA_CLASS_SUMMARY,
  IMP97409_VERDICT,
} from '../data/imp-97409-b4-ceiling-sign-condition-omega-classes-viz-data.js';
import { STATUS, ED } from '../styles/tokens.js';

// imp-97409: renders the imp-97290/imp-97393 b/4-ceiling sign+magnitude condition across omega
// classes -- proved through omega<=2 (primes, semiprimes), open for omega>=3, with the primorial
// ladder showing the magnitude ratio |Delta(b)|/(b/2) climbing slowly toward 1/2 from below.

const STATUS_COLOR = {
  proved: STATUS.proved.fg,
  open: STATUS.open.fg,
};

function magRatioColor(status) {
  return status === 'proved' ? ED.series3 : ED.series2;
}

function MagRatioChart({ rows }) {
  const svgW = 720;
  const rowH = 40;
  const padL = 90;
  const padT = 16;
  const svgH = padT + rows.length * rowH + 12;
  const barX = padL;
  const barMaxW = 380;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* ceiling reference line at magRatio = 1 (scaled to barMaxW at magRatio=1) */}
      {rows.map((row, idx) => {
        const y = padT + idx * rowH;
        const barW = Math.max(3, Math.min(barMaxW, row.magRatio * barMaxW));
        const fill = magRatioColor(row.status);
        return (
          <g key={`${row.omega}-${row.b}`}>
            <text x={padL - 10} y={y + rowH / 2 + 4} textAnchor="end" fill={ED.ink} fontSize={11} fontFamily="monospace">
              &omega;={row.omega} (b={row.b})
            </text>
            <rect x={barX} y={y + 8} width={barMaxW} height={rowH - 20} fill={ED.paper3} rx={3} />
            <rect x={barX} y={y + 8} width={barW} height={rowH - 20} fill={fill} rx={2} opacity={0.85} />
            {/* 1/2 reference tick */}
            <line
              x1={barX + barMaxW / 2}
              y1={y + 4}
              x2={barX + barMaxW / 2}
              y2={y + rowH - 6}
              stroke={ED.brassDeco}
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <text x={barX + barMaxW + 10} y={y + rowH / 2 + 4} fill={ED.inkSoft} fontSize={10.5} fontFamily="monospace">
              {row.magRatio.toFixed(6)}
            </text>
          </g>
        );
      })}
      <text x={barX + barMaxW / 2} y={padT - 4} fill={ED.brass} fontSize={9} textAnchor="middle" fontFamily="monospace">
        1/2
      </text>
    </svg>
  );
}

export default function Imp97409B4CeilingSignConditionOmegaClassesViz() {
  const provedRows = IMP97409_PROVED_EXAMPLES.filter((r) => r.magRatio !== null).map((r) => ({ ...r, status: 'proved' }));
  const openRows = IMP97409_OPEN_PRIMORIAL_LADDER.map((r) => ({ ...r, status: 'open' }));
  const allRows = [...provedRows, ...openRows];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="b/4-Ceiling Sign Condition Across Omega Classes" />

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
        <strong style={{ color: 'var(--ink)' }}>Honest status:</strong> {IMP97409_VERDICT.ceilingReduction}.
        PROVED through &omega;&le;{IMP97409_VERDICT.provedThrough} (primes: imp-97265, semiprimes:
        imp-97290). OPEN from &omega;={IMP97409_VERDICT.firstOpenOmega} (imp-97393): no violation of
        either condition was found in a full squarefree sweep over [2, 300000], and{' '}
        {IMP97409_VERDICT.magnitudeAsymptote}. The binding residual is {IMP97409_VERDICT.bindingResidual}.
        This is a measurement/status display, not a new bound; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '0.5rem', maxWidth: 700 }}>
        Magnitude ratio |&Delta;(b)|/(b/2) per representative b, green = proved omega class (primes,
        semiprimes), red = open omega class (primorial ladder, the imp-97393 magnitude-worst family).
        The dashed line marks the ceiling value 1/2: every measured bar stays strictly below it.
      </p>
      <MagRatioChart rows={allRows} />

      <table style={{ width: '100%', marginTop: '1.5rem', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule)', textAlign: 'left' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>&omega;</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>class</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>status</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>source</th>
          </tr>
        </thead>
        <tbody>
          {IMP97409_OMEGA_CLASS_SUMMARY.map((row) => (
            <tr key={`${row.omega}`} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.omega}</td>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', color: row.status.startsWith('proved') ? STATUS_COLOR.proved : STATUS_COLOR.open }}>
                {row.status}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.source}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-97409
        viz-data leaf (semiprime magRatio column derived by exact algebra from the imp-97290 ratio
        field; primorial ladder reused verbatim from imp-97393; no re-derivation). Changes no bound,
        establishes no operator positivity; Platt-Trudgian &Lambda;&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
