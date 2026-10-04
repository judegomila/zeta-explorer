import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import { IMP35824_WATERFALL_GRID } from '../data/imp-35824-krawczyk-surplus-waterfall-viz-data.js';
import { ED } from '../styles/tokens.js';

const LEADING_COLOR = ED.series8;
const SHIFT_COLOR = ED.series1;
const CURVATURE_COLOR = ED.series7;

function StackedBarChart({ rows }) {
  const w = 640;
  const h = 320;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 56;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const yMax = Math.max(...rows.map((r) => r.exact)) * 1.08;
  const yPix = (v) => padT + plotH - (v / yMax) * plotH;
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
            {(v * yMax).toFixed(0)}
          </text>
        </g>
      ))}

      {rows.map((r, i) => {
        const cx = padL + ((i + 0.5) / rows.length) * plotW;
        const x = cx - barW / 2;
        const yLeadingTop = yPix(r.leading);
        const yShiftTop = yPix(r.leading + r.shift);
        const yCurvatureTop = yPix(r.leading + r.shift + r.curvature);
        return (
          <g key={r.key}>
            <rect x={x} y={yLeadingTop} width={barW} height={padT + plotH - yLeadingTop} fill={LEADING_COLOR} />
            <rect x={x} y={yShiftTop} width={barW} height={yLeadingTop - yShiftTop} fill={SHIFT_COLOR} />
            <rect
              x={x}
              y={yCurvatureTop}
              width={barW}
              height={yShiftTop - yCurvatureTop}
              fill={CURVATURE_COLOR}
            />
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              {r.label}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90,14,${padT + plotH / 2})`}
      >
        Krawczyk headroom surplus
      </text>
    </svg>
  );
}

function WaterfallTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
          <th style={{ padding: '0.4rem 0.6rem' }}>band anchor</th>
          <th style={{ padding: '0.4rem 0.6rem', color: LEADING_COLOR }}>leading (S_inf.a/2)</th>
          <th style={{ padding: '0.4rem 0.6rem', color: SHIFT_COLOR }}>+ a-shift</th>
          <th style={{ padding: '0.4rem 0.6rem', color: CURVATURE_COLOR }}>+ curvature O(a^2)</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>= exact surplus</th>
          <th style={{ padding: '0.4rem 0.6rem' }}>curvature share</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>{r.label}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.leading.toFixed(4)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: SHIFT_COLOR }}>
              +{r.shift.toFixed(4)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: CURVATURE_COLOR }}>
              +{r.curvature.toFixed(4)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.exact.toFixed(4)}</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              {(r.curvatureFraction * 100).toFixed(1)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35824SurplusWaterfallViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Krawczyk Surplus Waterfall: Shift vs Curvature Residual (imp-35824 / imp-35762)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-35266 (D3) attributed the ~1.2 residual between the exact Krawczyk
        headroom surplus and the leading estimate S_inf . a/2 to the
        a(N(1-delta)) &gt; a(N) seed shift. imp-35762 isolated that residual
        and found it splits additively into a tiny a-shift piece and a
        dominant O(a^2) curvature piece. This waterfall stacks the leading
        estimate, the a-shift residual, and the curvature residual across the
        three imp-34693 admissible seed band anchors (band-bottom, N_cross,
        band-top), reproducing the exact surplus at each.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Additive surplus decomposition across the seed band
      </h3>
      <StackedBarChart rows={IMP35824_WATERFALL_GRID} />

      <div style={{ marginTop: '1.5rem' }}>
        <WaterfallTable rows={IMP35824_WATERFALL_GRID} />
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The a-shift residual (blue) stays a thin sliver (~1.7-2.6%) at every
        band anchor, while the O(a^2) curvature residual (pink) accounts for
        the overwhelming majority (~97-98%) of the gap between the leading
        estimate and the exact surplus -- the D3 attribution to the shift was
        imprecise; the true driver is curvature.
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
        the already-derived imp-35762 additive split (no new derivation, no
        heavy data-module import); measurement on the inherited
        imp-3220/imp-3406 surrogate; imp-34714a REMAINS OPEN; C_C 1/8
        (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes
        no bound, establishes no operator positivity, no RH verdict. NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35823-required-height-ladder', label: 'Merged Required-Height Ladder' },
          { to: '/rh-proof-state', label: 'RH Proof State Dashboard' },
          { to: '/improvements', label: 'Improvements Log' },
        ]}
      />
    </div>
  );
}
