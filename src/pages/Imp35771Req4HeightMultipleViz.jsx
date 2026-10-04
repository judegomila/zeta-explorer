import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35771_REQUIRED_HEIGHT_MULTIPLE_LADDER,
  IMP35771_SUMMARY,
} from '../data/imp-35771-req4-required-height-multiple-viz-data.js';
import { ED } from '../styles/tokens.js';

const MULTIPLE_COLOR = ED.series7;
const GAP_COLOR = ED.series1;

function MultipleBars({ rows }) {
  const w = 640;
  const h = 240;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 56;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const yMax = Math.max(...rows.map((r) => r.requiredMultiple)) * 1.1;
  const barW = plotW / rows.length / 2;

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill={ED.paper} rx={2} />

      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line
            x1={padL}
            x2={padL + plotW}
            y1={padT + plotH - v * plotH}
            y2={padT + plotH - v * plotH}
            stroke={ED.ruleSoft}
            strokeWidth={0.7}
          />
          <text x={padL - 8} y={padT + plotH - v * plotH + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
            {(v * yMax).toFixed(1)}x
          </text>
        </g>
      ))}

      {rows.map((r, i) => {
        const cx = padL + ((i + 0.5) / rows.length) * plotW;
        const barH = (r.requiredMultiple / yMax) * plotH;
        return (
          <g key={r.key}>
            <rect
              x={cx - barW / 2}
              y={padT + plotH - barH}
              width={barW}
              height={barH}
              fill={MULTIPLE_COLOR}
              rx={2}
            />
            <text x={cx} y={padT + plotH - barH - 6} textAnchor="middle" fill={ED.ink} fontSize={10}>
              {r.requiredMultiple.toFixed(2)}x
            </text>
            <text
              x={cx}
              y={padT + plotH + 16}
              textAnchor="middle"
              fill={ED.inkFaint}
              fontSize={9}
            >
              {r.label.split(' (')[0]}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
    </svg>
  );
}

function LadderTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>log T0</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>required multiple (200/log T0)</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>residual gap (200-log T0)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>{r.label}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.logT0.toFixed(2)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: MULTIPLE_COLOR }}>
              {r.requiredMultiple.toFixed(2)}x
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: GAP_COLOR }}>
              {r.logHeightGap.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35771Req4HeightMultipleViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="REQ-4 Required-Height Multiple Ladder (imp-35771 / imp-35722)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35580 bar-charted the four imp-35538 REQ-4 raw log-heights (peak,
        crossover, PT anchor, and the {IMP35771_SUMMARY.logT0Needed}-needed
        height) but never formed a ratio column. imp-35722 later computed the
        required-height multiple {IMP35771_SUMMARY.logT0Needed} / log T0 at
        each of the three base landmarks -- the factor by which each
        log-height must grow to reach the binding log T0 &ge;{' '}
        {IMP35771_SUMMARY.logT0Needed} (T0 &ge; e^200 ~ 7.23e86) that an
        O(1/log T0) route-(i) remainder needs to meet the 0.5% crossover
        budget. This page charts that multiple, plus the residual log-height
        gap column.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Required-height multiple (200/log T0) across the three landmarks
      </h3>
      <MultipleBars rows={IMP35771_REQUIRED_HEIGHT_MULTIPLE_LADDER} />

      <div style={{ marginTop: '1.5rem' }}>
        <LadderTable rows={IMP35771_REQUIRED_HEIGHT_MULTIPLE_LADDER} />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The multiple descends as log T0 rises across the peak
        (~{IMP35771_SUMMARY.peakMultiple.toFixed(2)}x) to the crossover
        (~{IMP35771_SUMMARY.crossMultiple.toFixed(2)}x) to the PT anchor
        (~{IMP35771_SUMMARY.ptMultiple.toFixed(2)}x) -- yet even the deepest
        verified height still falls short, since every multiple stays above 1.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only of
        the already-derived imp-35722 required-height ladder (no new
        derivation, no heavy data-module import); C_mb GUE-conditional
        (imp-486) UNTOUCHED; imp-35337a stays OPEN; changes no bound,
        establishes no operator positivity, no RH verdict. NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35823-required-height-ladder', label: 'Merged Required-Height Ladder Across Peak / Sigma / PT Rungs' },
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
