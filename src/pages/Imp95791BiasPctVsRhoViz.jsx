import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95762_TWIN_PAIR_BLOCK_FLOOR_FINITE80_DD_EIGENSOLVER } from '../data/imp-95762-twin-pair-block-floor-finite80-dd-eigensolver.js';

// The three delta=ln1.2 cells, ordered by descending rho (2 -> 1.5 -> 1),
// so the deep corner (rho=1, biasPct=51.63) reads as the rightmost bar.
const LN12_CELLS = IMP95762_TWIN_PAIR_BLOCK_FLOOR_FINITE80_DD_EIGENSOLVER.cells
  .filter((c) => c.delta === 'ln1.2')
  .sort((a, b) => b.rho - a.rho);

const BAR_COLOR = { validation: '#60a5fa', resolved: '#f59e0b' };
const DEEP_CORNER_COLOR = '#f87171';

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
        <line key={`gy${t}`} x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke="#1e293b" strokeWidth={1} />
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
            <text x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={9.5}>
              {`rho=${c.rho}`}
            </text>
            <text x={xOf(i)} y={padT + plotH + 30} textAnchor="middle" fill="#475569" fontSize={8}>
              {isDeepCorner ? 'deep corner' : c.status}
            </text>
          </g>
        );
      })}

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {yTicks.map((t) => (
        <text key={`ty${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
          {t}%
        </text>
      ))}
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        biasPct
      </text>
      <text x={padL + plotW / 2} y={16} textAnchor="middle" fill="#94a3b8" fontSize={10.5}>
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
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> presentation only. imp-95762
        ported an independent double-double primal eigensolver to cross-check the imp-95744
        cancellation-free dual F_inf at the same three delta=ln1.2 grid cells; this page re-plots
        those frozen literals verbatim (no re-derivation). Model seam family only; changes no
        Lambda bound; NO QED; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
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

      <table style={{ width: '100%', fontSize: '0.78rem', color: '#cbd5e1', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: '#64748b' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>rho</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>F_inf (imp-95744 dual)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>lambda_min (imp-95762 DD-primal)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>biasPct</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>status</th>
          </tr>
        </thead>
        <tbody>
          {LN12_CELLS.map((c) => (
            <tr key={c.rho} style={{ borderTop: '1px solid rgba(148,163,184,0.15)' }}>
              <td style={{ padding: '3px 0' }}>{c.rho}</td>
              <td style={{ textAlign: 'right' }}>{c.Finf.toExponential(4)}</td>
              <td style={{ textAlign: 'right' }}>{c.lminDD.toExponential(4)}</td>
              <td style={{ textAlign: 'right', color: c.rho === 1 ? DEEP_CORNER_COLOR : '#60a5fa' }}>
                {c.biasPct.toFixed(2)}%
              </td>
              <td style={{ textAlign: 'right', color: '#64748b' }}>{c.status}</td>
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page rendering the frozen
        imp-95762 / imp-95744 literals (no re-derivation). Supplies no new bound, establishes no
        operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
