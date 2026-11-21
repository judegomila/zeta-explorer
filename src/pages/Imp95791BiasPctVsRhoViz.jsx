import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95762_TWIN_PAIR_BLOCK_FLOOR_FINITE80_DD_EIGENSOLVER } from '../data/imp-95762-twin-pair-block-floor-finite80-dd-eigensolver.js';
import { ED } from '../styles/tokens.js';

// The three delta=ln1.2 cells, ordered by descending rho (2 -> 1.5 -> 1),
// so the deep corner (rho=1, biasPct=51.63) reads as the rightmost bar.
const LN12_CELLS = IMP95762_TWIN_PAIR_BLOCK_FLOOR_FINITE80_DD_EIGENSOLVER.cells
  .filter((c) => c.delta === 'ln1.2')
  .sort((a, b) => b.rho - a.rho);

const BAR_COLOR = { validation: ED.series1, resolved: ED.series4 };
const DEEP_CORNER_COLOR = ED.series2;

// biasPct(rho) at fixed delta=ln1.2: three bars, the imp-95744 dual F_inf
// floor and the imp-95762 DD-primal lambda_min printed above each bar.
function BiasPctChart() {
  const svgW = 480;
  const padL = 56;
  const padR = 20;
  const padT = 40;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 240;
  const svgH = padT + plotH + padB;

  const yMax = 60;
  const yOf = (v) => padT + plotH - (v / yMax) * plotH;
  const barW = plotW / LN12_CELLS.length / 2;
  const slotW = plotW / LN12_CELLS.length;
  const xOf = (i) => padL + i * slotW + slotW / 2;

  const yTicks = [0, 10, 20, 30, 40, 50, 60];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}

      {LN12_CELLS.map((c, i) => {
        const x = xOf(i) - barW / 2;
        const y = yOf(c.biasPct);
        const h = padT + plotH - y;
        const isDeepCorner = c.rho === 1;
        const color = isDeepCorner ? DEEP_CORNER_COLOR : BAR_COLOR[c.status];
        return (
          <g key={`${c.delta}-${c.rho}`}>
            <rect x={x} y={y} width={barW} height={h} fill={color} opacity={0.85} />
            <text x={xOf(i)} y={y - 6} textAnchor="middle" fill={color} fontSize={11} fontWeight={600}>
              {c.biasPct.toFixed(2)}%
            </text>
            <text x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
              {`rho=${c.rho}`}
            </text>
            <text x={xOf(i)} y={padT + plotH + 30} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
              {isDeepCorner ? 'deep corner' : c.status}
            </text>
          </g>
        );
      })}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {t}%
        </text>
      ))}
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        biasPct
      </text>
      <text x={padL + plotW / 2} y={16} textAnchor="middle" fill={ED.inkSoft} fontSize={10.5}>
        biasPct vs rho at delta = ln 1.2
      </text>
    </svg>
  );
}

export default function Imp95791BiasPctVsRhoViz() {
  const deepCorner = LN12_CELLS.find((c) => c.rho === 1);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Twin-Pair Finite-Size biasPct vs rho at delta=ln1.2 (imp-95762 / imp-95744)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> presentation only. imp-95762
        ported an independent double-double primal eigensolver to cross-check the imp-95744
        cancellation-free dual F_inf at the same three delta=ln1.2 grid cells; this page re-plots
        those frozen literals verbatim (no re-derivation). Model seam family only; changes no
        Lambda bound; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        At fixed delta&nbsp;=&nbsp;ln&nbsp;1.2 the finite-80 finite-size bias between the
        imp-95744 dual infinite-lattice infimum F_inf and the imp-95762 DD-primal finite-80
        lambda_min grows monotonically as rho falls: {LN12_CELLS[0].biasPct.toFixed(2)}%
        at rho&nbsp;=&nbsp;{LN12_CELLS[0].rho}, {LN12_CELLS[1].biasPct.toFixed(2)}% at
        rho&nbsp;=&nbsp;{LN12_CELLS[1].rho}, up to{' '}
        <strong style={{ color: DEEP_CORNER_COLOR }}>{deepCorner.biasPct.toFixed(2)}%</strong> at
        the deep corner rho&nbsp;=&nbsp;{deepCorner.rho}. The rho=2 cell was already
        float64-reachable in imp-95744 (a validation cross-check); the rho=1.5 and rho=1 cells
        were float64 negative-noise there and are resolved only by the DD primal.
      </p>

      <BiasPctChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>rho</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>F_inf (imp-95744 dual)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>lambda_min (imp-95762 DD-primal)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>biasPct</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>status</th>
          </tr>
        </thead>
        <tbody>
          {LN12_CELLS.map((c) => (
            <tr key={c.rho} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{c.rho}</td>
              <td style={{ textAlign: 'right' }}>{c.Finf.toExponential(4)}</td>
              <td style={{ textAlign: 'right' }}>{c.lminDD.toExponential(4)}</td>
              <td style={{ textAlign: 'right', color: c.rho === 1 ? DEEP_CORNER_COLOR : 'var(--series-1)' }}>
                {c.biasPct.toFixed(2)}%
              </td>
              <td style={{ textAlign: 'right', color: 'var(--ink-faint)' }}>{c.status}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page rendering the frozen
        imp-95762 / imp-95744 literals (no re-derivation). Supplies no new bound, establishes no
        operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
