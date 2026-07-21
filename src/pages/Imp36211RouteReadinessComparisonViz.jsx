import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP36211_ROUTE_COMPARISON,
  IMP36211_RANKING_ORDER,
} from '../data/imp-36211-perN-route-readiness-comparison-viz-data.js';
import { IMP36151_ROUTEC_VS_ROUTEB_PERN_EXPONENT_COMPARISON } from '../data/imp-36151-routeC-vs-routeB-perN-exponent-comparison.js';

const ROUTE_COLORS = { C: '#34d399', B: '#38bdf8', A: '#f87171' };

// Horizontal bar chart of the three routes' weighted readiness scores,
// ordered by rank (highest score first).
function ScoreBars() {
  const svgW = 640;
  const padL = 200;
  const padR = 60;
  const rowH = 56;
  const svgH = rowH * IMP36211_ROUTE_COMPARISON.length + 20;
  const plotW = svgW - padL - padR;
  const maxScore = Math.max(...IMP36211_ROUTE_COMPARISON.map((r) => r.score));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {IMP36211_ROUTE_COMPARISON.map((route, i) => {
        const y = 10 + i * rowH;
        const barW = (route.score / maxScore) * plotW;
        return (
          <g key={route.key}>
            <text x={padL - 10} y={y + rowH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={12} fontWeight={600}>
              {route.label}
            </text>
            <rect
              x={padL}
              y={y + 10}
              width={barW}
              height={rowH - 24}
              fill={ROUTE_COLORS[route.key]}
              opacity={0.75}
              rx={3}
            />
            <text
              x={padL + barW + 8}
              y={y + rowH / 2 + 4}
              fill={ROUTE_COLORS[route.key]}
              fontSize={12}
              fontFamily="monospace"
            >
              {route.score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp36211RouteReadinessComparisonViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="G5-perN-translation Route Readiness Comparison (imp-36045 / imp-36164 / imp-36211)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Three candidate routes were assessed (imp-36045) for readiness to supply a usable UNCONDITIONAL
        per-N rate r(N) that the Step-4 E(N) bridge can consume. Weighted readiness ranking:{' '}
        <strong style={{ color: '#e2e8f0' }}>{IMP36211_RANKING_ORDER}</strong>.
      </p>

      <ScoreBars />

      <table style={{ width: '100%', marginTop: '1.25rem', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
            <th style={{ padding: '0.4rem 0.5rem' }}>Route</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>Source</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>Named blocker</th>
          </tr>
        </thead>
        <tbody>
          {IMP36211_ROUTE_COMPARISON.map((route) => (
            <tr key={route.key} style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '0.4rem 0.5rem', color: ROUTE_COLORS[route.key], fontWeight: 600 }}>
                {route.label}
              </td>
              <td style={{ padding: '0.4rem 0.5rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                {route.sourceTickets}
              </td>
              <td style={{ padding: '0.4rem 0.5rem', color: '#64748b' }}>{route.blocker}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> presentation of the imp-36045 baked
        readiness scores as a bar chart with each route's source tickets and residual blocker. Route C
        (density squeeze) wins because it produces a per-N bound by construction and its residual
        G3a_max_gap is not proven irreducible; Route A's residual C_mb is proven IRREDUCIBLE (imp-486);
        Route B's per-N upgrade re-imports GUE/ESY. Ranking closes NOTHING; discharges no gap; no RH
        verdict, NO QED. Platt-Trudgian Lambda&nbsp;&le;&nbsp;0.2 remains SOTA.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.04)',
          borderLeft: '3px solid #7f1d1d',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>What the ranking does NOT mean (imp-36151):</strong> the
        C&nbsp;&gt;&nbsp;B&nbsp;&gt;&nbsp;A order above is scored on readiness axes -- per-N form,
        unconditionality, gaps closed, residual tractability -- none of which measures per-N decay
        SPEED. Route&nbsp;B is the only route with a pinned per-N exponent
        (r_B(N) = C&prime; &radic;(log &gamma;_N) N<sup>-1/4</sup>, leading exponent&nbsp;-1/4). Route&nbsp;C
        has NO pinned exponent: its bound magnitude and N-scaling are fixed by the still-open
        G3a_max_gap extremal max-gap statistics, so there is no r_C(N) power to compare against -1/4.
        {' '}{IMP36151_ROUTEC_VS_ROUTEB_PERN_EXPONENT_COMPARISON.resolution.answer} Reading &ldquo;C&nbsp;&gt;&nbsp;B&rdquo;
        as &ldquo;C decays faster&rdquo; is unconditional-consumability readiness masquerading as a rate
        claim -- it is NOT. Closes nothing; NO QED.
      </div>
    </div>
  );
}
