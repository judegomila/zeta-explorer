import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96399_BUILD_ONLY_ASSUMED_N,
  IMP96399_CORRECTED_REACH,
  IMP96399_OVERSTATEMENT,
  IMP96399_HONEST_BANNER,
} from '../data/imp-96399-route-m-reach-reprice-viz-data.js';
import { ED } from '../styles/tokens.js';

function RepriceBarChart() {
  const svgW = 420;
  const svgH = 220;
  const padL = 90;
  const padR = 24;
  const padT = 16;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const rows = [
    { label: 'imp-96230 BUILD-only\n(assumed)', n: IMP96399_BUILD_ONLY_ASSUMED_N.assumedN, color: ED.series2 },
    { label: 'imp-96352 corrected\n(same 399 s budget)', n: IMP96399_OVERSTATEMENT.correctedN, color: ED.series3 },
  ];
  const maxN = Math.max(...rows.map((r) => r.n)) * 1.15;
  const barH = 44;
  const gap = 36;
  const yOf = (i) => padT + i * (barH + gap);
  const xOf = (n) => padL + (n / maxN) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x={padL - 8} y={yOf(i) + barH / 2 + 4} textAnchor="end" fill={ED.inkSoft} fontSize={9}>
            {r.label.split('\n').map((line, li) => (
              <tspan key={li} x={padL - 8} dy={li === 0 ? 0 : 11}>{line}</tspan>
            ))}
          </text>
          <rect x={padL} y={yOf(i)} width={xOf(r.n) - padL} height={barH} fill={r.color} opacity={0.85} rx={3} />
          <text x={xOf(r.n) + 8} y={yOf(i) + barH / 2 + 4} fill={ED.ink} fontSize={10.5}>
            N &#8776; {r.n.toLocaleString()}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        reachable N at the same 399 s wall-clock budget
      </text>
    </svg>
  );
}

export default function Imp96399RouteMReachRepriceViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96352: Route M Reachable-N Ceiling Reprice" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96399_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The imp-96230 BUILD-only budget assumed N &#8776; {IMP96399_BUILD_ONLY_ASSUMED_N.assumedN.toLocaleString()} was
        reachable in {IMP96399_BUILD_ONLY_ASSUMED_N.budgetSeconds} s, counting only the Gram build, one dense
        eigvalsh, and 25 rung Cholesky factorizations. imp-96352 found that estimate omits the per-rung
        inverse-power lam_min solve, which measured {(100 * (1 - 399 / 1838.5)).toFixed(0)}% of the actual
        N=1e4 wall time. Repricing at the same {IMP96399_OVERSTATEMENT.atBudgetSeconds} s budget under the
        corrected cubic cost model gives a reachable N of only {IMP96399_OVERSTATEMENT.correctedN.toLocaleString()}
        &mdash; a {IMP96399_OVERSTATEMENT.overstatementFactor.toFixed(2)}x overstatement in N.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Assumed vs corrected reach at the 399 s budget
      </h3>
      <RepriceBarChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Corrected reach ladder (imp-96352)
      </h3>
      <table style={{ width: '100%', maxWidth: 500, borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--ink)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule)' }}>
            <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>Budget</th>
            <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>Reachable N</th>
          </tr>
        </thead>
        <tbody>
          {IMP96399_CORRECTED_REACH.map((row) => (
            <tr key={row.budgetSeconds} style={{ borderBottom: '1px solid color-mix(in srgb, var(--rule) 40%, transparent)' }}>
              <td style={{ padding: '0.35rem 0.5rem' }}>{row.budgetLabel}</td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{row.reachN.toLocaleString()}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page. Every figure is copied verbatim
        from imp-96352 (corrected cost model) and imp-96230 (BUILD-only budget); no new timing measurement
        is made here. The corrected reach ladder is itself an extrapolated cubic fit, not a re-measured
        wall-clock run at each budget (see imp-96352&apos;s IMP96352_SUBGAP for the unresolved inverse-power
        iteration-count caveat). Changes no bound, establishes no operator positivity; Platt&ndash;Trudgian
        &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
