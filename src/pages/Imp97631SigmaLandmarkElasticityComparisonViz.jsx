import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97631_LANDMARK_ROWS,
  IMP97631_SUMMARY,
} from '../data/imp-97631-sigma-landmark-elasticity-comparison-viz-data.js';
import { ED } from '../styles/tokens.js';

// Grouped bar chart: for each landmark, one bar for the E_trunc-elasticity (can be negative) and one
// for the C_C-elasticity (mostly positive), sharing a zero baseline so the sign flip is visible.
function ElasticityComparisonChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const rows = IMP97631_LANDMARK_ROWS;
  const n = rows.length;
  const slot = plotW / n;
  const barW = slot * 0.32;
  const gap = 6;

  const maxAbs = Math.max(...rows.flatMap((r) => [Math.abs(r.etrunc), Math.abs(r.cc)]));
  const scale = (plotH / 2 - 10) / maxAbs;
  const zeroY = padT + plotH / 2;
  const yOf = (v) => zeroY - v * scale;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke={ED.rule} strokeWidth={1} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />

      {rows.map((r, i) => {
        const cx = padL + i * slot + slot / 2;
        const xEt = cx - gap / 2 - barW;
        const xCc = cx + gap / 2;
        const yEt = yOf(r.etrunc);
        const yCc = yOf(r.cc);
        return (
          <g key={r.key}>
            <rect
              x={xEt}
              y={Math.min(yEt, zeroY)}
              width={barW}
              height={Math.max(Math.abs(yEt - zeroY), 2)}
              fill={ED.series1}
              opacity={0.85}
            />
            <text
              x={xEt + barW / 2}
              y={r.etrunc < 0 ? Math.min(yEt, zeroY) - 6 : Math.max(yEt, zeroY) + 14}
              textAnchor="middle"
              fill={ED.ink}
              fontSize={9}
            >
              {r.etrunc.toFixed(2)}
            </text>
            <rect
              x={xCc}
              y={Math.min(yCc, zeroY)}
              width={barW}
              height={Math.max(Math.abs(yCc - zeroY), 2)}
              fill={ED.series2}
              opacity={0.85}
            />
            <text
              x={xCc + barW / 2}
              y={r.cc < 0 ? Math.min(yCc, zeroY) - 6 : Math.max(yCc, zeroY) + 14}
              textAnchor="middle"
              fill={ED.ink}
              fontSize={9}
            >
              {r.cc.toFixed(2)}
            </text>
            <text x={cx} y={padT + plotH + 20} textAnchor="middle" fill={ED.inkSoft} fontSize={8.5}>
              {r.label}
            </text>
          </g>
        );
      })}

      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        d(ln N) / d(ln amplitude)
      </text>

      <g transform={`translate(${padL + plotW - 150}, ${padT})`}>
        <rect x={0} y={0} width={10} height={10} fill={ED.series1} opacity={0.85} />
        <text x={14} y={9} fill={ED.inkSoft} fontSize={9}>E_trunc-elasticity (imp-97584)</text>
        <rect x={0} y={16} width={10} height={10} fill={ED.series2} opacity={0.85} />
        <text x={14} y={25} fill={ED.inkSoft} fontSize={9}>C_C-elasticity (imp-97598)</text>
      </g>
    </svg>
  );
}

export default function Imp97631SigmaLandmarkElasticityComparisonViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Landmark Elasticity Comparison: E_trunc vs C_C, the Sign Flip and the Invariant Peak (imp-97631 / imp-97584 / imp-97598)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a presentation-only page pairing
        two frozen sensitivity measurements verbatim (no re-derivation, no new computation). Changes no
        bound; establishes no operator positivity;
        RH open; NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {IMP97631_SUMMARY.reading}
      </p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
        Each of the four imp-97520 sigma(N) landmarks, paired across the two amplitude axes. The three
        downslope landmarks (L2/L3/L4) sign-flip between blue (E_trunc, negative) and red (C_C,
        positive) while staying close in magnitude to the closed-form value 2; the interior peak L1 is
        the shared outlier, going from shallow-but-nonzero on E_trunc to exactly zero on C_C:
      </p>
      <ElasticityComparisonChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>landmark</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>E_trunc-elasticity</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>C_C-elasticity</th>
            <th style={{ textAlign: 'left', paddingBottom: 4, paddingLeft: 12 }}>note</th>
          </tr>
        </thead>
        <tbody>
          {IMP97631_LANDMARK_ROWS.map((r) => (
            <tr key={r.key} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>{r.label}</td>
              <td style={{ textAlign: 'right' }}>{r.etrunc.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.cc.toFixed(4)}</td>
              <td style={{ paddingLeft: 12, color: 'var(--ink-faint)' }}>{r.note}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97631_SUMMARY.verdict}
      </div>
    </div>
  );
}
