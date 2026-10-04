import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97316_ROW_BAND,
  IMP97316_ANCHORS_TABLE,
  IMP97316_SUMMARY,
} from '../data/imp-97316-committed-cjk-sparsity-band-viz-data.js';
import { ED, alpha } from '../styles/tokens.js';

// imp-97316: the imp-97293 committed c_{jk} overlap matrix has an exact sparsity/band support
// (nonzero iff j+k even AND k<=j+6) but shipped only as tables and counts, no chart. This page
// renders the band shape (kMin/kMax per row j) as a filled area, plus the exact anchor entries.

function BandChart({ rows, kmax }) {
  const svgW = 640;
  const svgH = 300;
  const padL = 46;
  const padR = 20;
  const padT = 16;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const maxJ = rows[rows.length - 1].j;
  const xOf = (j) => padL + (j / maxJ) * plotW;
  const yOf = (k) => padT + plotH - (k / kmax) * plotH;

  const topPath = rows.map((r) => `${xOf(r.j)},${yOf(r.kMax)}`).join(' L ');
  const bottomPath = rows
    .slice()
    .reverse()
    .map((r) => `${xOf(r.j)},${yOf(r.kMin)}`)
    .join(' L ');

  const yTicks = [0, kmax / 4, kmax / 2, (3 * kmax) / 4, kmax];
  const xTicks = [0, maxJ / 4, maxJ / 2, (3 * maxJ) / 4, maxJ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {Math.round(v)}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
            {Math.round(v)}
          </text>
        </g>
      ))}
      <path d={`M ${topPath} L ${bottomPath} Z`} fill={alpha(ED.series1, 0.28)} stroke={ED.series1} strokeWidth={1.4} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        profile row j
      </text>
      <text x={12} y={padT + 8} fill={ED.inkSoft} fontSize={9}>
        Legendre degree k
      </text>
    </svg>
  );
}

export default function Imp97316CommittedCjkSparsityBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Committed c_jk Overlap: the Exact Sparsity/Band Pattern" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> MEASUREMENT/PRESENTATION only.
        imp-97293 computed the exact 100&times;106 committed overlap matrix c_jk on the raw rational
        Gegenbauer profiles and proved its support is exactly {'{'}j+k even{'}'} AND {'{'}k&nbsp;&le;&nbsp;j+6{'}'}:
        {' '}{IMP97316_SUMMARY.nonzero} nonzero of {IMP97316_SUMMARY.total} cells
        ({IMP97316_SUMMARY.zeroByParity} parity-killed, {IMP97316_SUMMARY.zeroByDegreeBand} band-killed).
        No numeric v0, degree image, or interval majorant is produced here. Changes no bound;
        Platt&ndash;Trudgian &Lambda;&nbsp;&le;&nbsp;0.2 remains SOTA; RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 700 }}>
        The shaded band is the surviving-column range [kMin, kMax] = [j%2, j+6] for each profile row
        j = 0..99: it widens linearly with j and is never clipped by the top Legendre degree
        Kmax&nbsp;=&nbsp;105 (band width per row ranges {IMP97316_SUMMARY.minRowCount}&ndash;
        {IMP97316_SUMMARY.maxRowCount} nonzero cells).
      </p>

      <BandChart rows={IMP97316_ROW_BAND} kmax={105} />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        Exact anchor entries (from the imp-97293 offline sweep)
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', color: 'var(--ink)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule)' }}>
            <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>(j, k)</th>
            <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>c_jk (exact rational)</th>
            <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>band edge (k=j+6)?</th>
          </tr>
        </thead>
        <tbody>
          {IMP97316_ANCHORS_TABLE.map((r) => (
            <tr key={`${r.j},${r.k}`} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <td style={{ padding: '0.3rem 0.5rem' }}>({r.j}, {r.k})</td>
              <td style={{ padding: '0.3rem 0.5rem', fontFamily: 'monospace' }}>{r.value}</td>
              <td style={{ padding: '0.3rem 0.5rem' }}>{r.atBandEdge ? 'yes' : 'no'}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-97316
        viz-data leaf (sparsity census and anchors reused verbatim from imp-97293; the per-row band
        is a direct combinatorial reading of the proved support rule, cross-checked against the
        offline-swept total at import). Changes no bound, establishes no operator positivity;
        Platt-Trudgian &Lambda;&le;0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
