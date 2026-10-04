import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95682_ROWS,
  IMP95682_HALF_RETENTION_RHO,
  IMP95682_CAVEAT_BANNER,
} from '../data/imp-95682-twin-pair-block-floor-rho-viz-data.js';
import { IMP95707_TWIN_PAIR_BLOCK_TOEPLITZ_INTERIOR_LIMIT } from '../data/imp-95707-twin-pair-block-toeplitz-interior-limit.js';
import { IMP95807_FINF_DUAL_INDEPENDENT_RECOMPUTE } from '../data/imp-95807-finf-dual-independent-recompute.js';
import { ED } from '../styles/tokens.js';

const ROWS = IMP95682_ROWS;
const BIAS_TABLE = IMP95707_TWIN_PAIR_BLOCK_TOEPLITZ_INTERIOR_LIMIT.table;
const FINF_RECOMPUTE_CELLS = IMP95807_FINF_DUAL_INDEPENDENT_RECOMPUTE.cells;

const SERIES = [
  { key: 'log10F', label: 'F = lambda_min(seam Gram)', color: ED.series1 },
  { key: 'log10FoverAopt', label: 'F / A_opt (block advantage)', color: ED.brass },
  { key: 'log10FoverBlock', label: 'F / blockIso (retained fraction)', color: ED.series5 },
];

// Semilog-x (rho), log10-y (all three curves) chart spanning the full
// ~12-order-of-magnitude interpolation between the two imp-95642 endpoints.
function BlockFloorRhoChart() {
  const svgW = 660;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = 300;
  const svgH = padT + plotH + padB;

  const xMin = ROWS[0].log10Rho;
  const xMax = ROWS[ROWS.length - 1].log10Rho;
  const xOf = (log10Rho) => padL + ((log10Rho - xMin) / (xMax - xMin)) * plotW;

  const allY = ROWS.flatMap((r) => SERIES.map((s) => r[s.key]));
  const yMax = Math.ceil(Math.max(...allY) + 0.5);
  const yMin = Math.floor(Math.min(...allY) - 0.5);
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const halfRetentionX = xOf(Math.log10(IMP95682_HALF_RETENTION_RHO));
  const halfRetentionY = yOf(Math.log10(0.5));
  const rho1X = xOf(ROWS[0].log10Rho);

  const yTicks = [];
  for (let t = Math.ceil(yMin / 3) * 3; t <= yMax; t += 3) yTicks.push(t);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <g key={`yt-${t}`}>
          <line
            x1={padL}
            x2={padL + plotW}
            y1={yOf(t)}
            y2={yOf(t)}
            stroke={ED.ruleSoft}
            strokeWidth={1}
          />
          <text x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
            {`10^${t}`}
          </text>
        </g>
      ))}

      {ROWS.map((r) => (
        <text
          key={`xt-${r.rho}`}
          x={xOf(r.log10Rho)}
          y={padT + plotH + 16}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9}
        >
          {r.rho}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        rho = D / delta (log scale)
      </text>

      {/* rho = 1 scalar endpoint marker */}
      <line
        x1={rho1X}
        x2={rho1X}
        y1={padT}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <text x={rho1X + 4} y={padT + 10} fill={ED.inkSoft} fontSize={9}>
        rho=1 (scalar A_opt)
      </text>

      {/* half-retention crossing marker for F/blockIso */}
      <line
        x1={padL}
        x2={padL + plotW}
        y1={halfRetentionY}
        y2={halfRetentionY}
        stroke={ED.series5}
        strokeWidth={1}
        strokeDasharray="2,4"
        opacity={0.6}
      />
      <circle cx={halfRetentionX} cy={halfRetentionY} r={3.5} fill={ED.series5} />
      <text x={halfRetentionX + 6} y={halfRetentionY - 6} fill={ED.series5} fontSize={9}>
        {`~1/2 retention, rho~${IMP95682_HALF_RETENTION_RHO}`}
      </text>

      {SERIES.map((s) => (
        <polyline
          key={s.key}
          fill="none"
          stroke={s.color}
          strokeWidth={2}
          points={ROWS.map((r) => `${xOf(r.log10Rho)},${yOf(r[s.key])}`).join(' ')}
        />
      ))}
      {SERIES.map((s) =>
        ROWS.map((r) => (
          <circle
            key={`${s.key}-${r.rho}`}
            cx={xOf(r.log10Rho)}
            cy={yOf(r[s.key])}
            r={2.5}
            fill={s.color}
          />
        )),
      )}
    </svg>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
      {SERIES.map((s) => (
        <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{ width: 12, height: 3, background: s.color, display: 'inline-block' }}
          />
          <span style={{ color: 'var(--ink-soft)', fontSize: '0.78rem' }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Imp95682TwinPairBlockFloorRhoViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Twin-Pair Block Floor F(delta, rho) Monotone Interpolation (imp-95659 / imp-95682)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95659 tabulated the per-pair block floor F(delta, rho) = lambda_min(seam
        Gram) across the cross/in-pair ratio rho = D&#47;delta. This chart shows all
        three measured curves on one log10-y axis: F itself (sweeping ~12 orders of
        magnitude), the block advantage F&#47;A_opt over the scalar lattice floor
        (only ~1.09x at rho = 1, exceeding 1e3x by rho = 1.5), and the fraction of
        the isolated block floor retained F&#47;blockIso (crossing ~1&#47;2 near
        rho ~ 15, marked below).
      </p>

      <BlockFloorRhoChart />
      <Legend />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>rho</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F / A_opt</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F / blockIso</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.rho} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.rho}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.F.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.FoverAopt.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.FoverBlock.toExponential(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: '1.5rem 0 0.75rem', maxWidth: 700 }}>
        The finite-80 table above is a proxy: imp-95707 quantified how far it sits from the true
        infinite-lattice infimum F_inf (block-Toeplitz Szego, cancellation-free at delta = ln 1.5).
        The interior finite-size overestimate runs from +5.65% at the rho = 1 endpoint down to
        +2.25% by rho = 2, then keeps decaying toward 0% as rho grows further &mdash; a shrinking
        one-sided bias, not a qualitative error.
      </p>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>rho</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F_inf (dual, imp-95707)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F (finite-80 proxy)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>bias%</th>
          </tr>
        </thead>
        <tbody>
          {BIAS_TABLE.map((r) => (
            <tr key={`bias-${r.rho}`} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.rho}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.Finf.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.Ffinite.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {r.biasPct.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', margin: '1.5rem 0 0.75rem', maxWidth: 700 }}>
        imp-95807 independently re-derived F_inf via the cancellation-free theta = 0
        Poisson dual at all 13 cells of the union grid above and checked each one
        against its baked literal. Every cell reproduces to relative error &lt; 1e-6;
        the worst is the imp-95707 float64 ln1.5&#47;rho=1 entry at 2.42e-7 (storage
        precision of that 10-sig-fig literal, not a disagreement of the dual) &mdash;
        the other twelve sit at relErr &lt;= 3.68e-9.
      </p>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>delta</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rho</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F_inf (baked)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>F_inf (dual recompute)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>relErr</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>source</th>
          </tr>
        </thead>
        <tbody>
          {FINF_RECOMPUTE_CELLS.map((c) => (
            <tr
              key={`finf-${c.delta}-${c.rho}`}
              style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}
            >
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.delta}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.rho}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {c.Finf.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {c.Frecomputed.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {c.relErr.toExponential(3)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{c.source}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95682_CAVEAT_BANNER}
      </div>
    </div>
  );
}
