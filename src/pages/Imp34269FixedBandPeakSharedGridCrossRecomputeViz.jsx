import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34269_SHARED_KENDS,
  IMP34269_SUB_RUNG_OFFSET,
  IMP34269_CROSS_ROWS,
  IMP34269_MAX_RAW_DIFF,
} from '../data/imp-34269-fixed-band-peak-shared-grid-cross-recompute-viz-data.js';
import { ED } from '../styles/tokens.js';

// Panel 1: the six shared-boundary peaks -- independent recompute overlaid on both stored modules
// (they coincide exactly at plotted precision, which is the point of the cross-recompute).
function SharedPeakChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 16.85;
  const maxX = 19.65;
  const minY = 0.62;
  const maxY = 0.85;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const path = IMP34269_CROSS_ROWS.map((r) => `${xAt(r.kEnd)},${yAt(r.recomputedPeak)}`).join(' ');
  const xTicks = IMP34269_SHARED_KENDS;
  const yTicks = [0.65, 0.7, 0.75, 0.8, 0.85];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xAt(k)} y1={padT + cH - 4} x2={xAt(k)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (shared boundary)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        fixed-band peak (independent recompute)
      </text>

      <polyline points={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      {IMP34269_CROSS_ROWS.map((r) => (
        <circle
          key={'pt' + r.kEnd}
          cx={xAt(r.kEnd)}
          cy={yAt(r.recomputedPeak)}
          r={4}
          fill={r.recomputedAtK === 6.5 ? '#c4b5fd' : ED.brassDeco}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

// Panel 2: the pre-rounding raw diff between the independent recompute and the stored imp-34196 value --
// all six sit well inside +-1e-6, the toFixed(6) storage floor.
function RawDiffChart() {
  const svgW = 680;
  const svgH = 220;
  const padL = 56;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 16.85;
  const maxX = 19.65;
  const minY = -4e-7;
  const maxY = 1e-7;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const path = IMP34269_CROSS_ROWS.map((r) => `${xAt(r.kEnd)},${yAt(r.rawDiff)}`).join(' ');
  const xTicks = IMP34269_SHARED_KENDS;
  const yTicks = [-4e-7, -3e-7, -2e-7, -1e-7, 0, 1e-7];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}
      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xAt(k)} y1={padT + cH - 4} x2={xAt(k)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k.toFixed(2)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (shared boundary)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        raw diff vs. imp-34196 (pre-rounding)
      </text>

      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.ruleSoft} strokeWidth={1} strokeDasharray="3,3" />
      <polyline points={path} fill="none" stroke={ED.series3} strokeWidth={2} />
      {IMP34269_CROSS_ROWS.map((r) => (
        <circle key={'pt' + r.kEnd} cx={xAt(r.kEnd)} cy={yAt(r.rawDiff)} r={3.5} fill={ED.series3} stroke={ED.paper} strokeWidth={0.75} />
      ))}
    </svg>
  );
}

export default function Imp34269FixedBandPeakSharedGridCrossRecomputeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Fixed-Band Peak Shared-Grid Cross-Recompute (imp-34269 / imp-34196 / imp-34109)" />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
        <Link to="/viz-imp34281-m2-ceiling-cohort-index" style={{ color: 'var(--ink-faint)' }}>
          &larr; back to the M2-ceiling cohort index
        </Link>
      </p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 740 }}>
        imp-34196 (a 0.25 kEnd grid) asserts it measures the SAME thing as imp-34109 (a 0.5 kEnd grid),
        but never tabulated the shared-kEnd peaks side by side -- its reuse gate checked only a single
        anchor. imp-34269 cross-recomputes the fixed-band (k&le;10) peak at the six shared boundaries
        (kEnd = {IMP34269_SHARED_KENDS[0].toFixed(2)} .. {IMP34269_SHARED_KENDS[IMP34269_SHARED_KENDS.length - 1].toFixed(2)})
        from a SECOND, independently-written flat routine. Every recomputed peak matches BOTH stored
        modules to |diff| &lt; 1e-6 (max {IMP34269_MAX_RAW_DIFF.toExponential(2)} before the toFixed(6)
        storage floor), the band argmax rung agrees at every node (un-locking from k = 6.50 to 6.25 at
        kEnd = 19.0), and probing each boundary at kEnd + {IMP34269_SUB_RUNG_OFFSET.toFixed(3)} (finer
        than the 0.25 ladder spacing) leaves every peak UNCHANGED -- the 0.25-grid bins are
        step-function-flat at sub-rung resolution.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        independently recomputed fixed-band peak at the six shared kEnd boundaries (violet = argmax rung
        6.50, gold = argmax rung 6.25 -- the un-lock at kEnd = 19.0)
      </p>
      <SharedPeakChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        raw (pre-rounding) diff between the independent recompute and the stored imp-34196 value -- all
        six points sit well inside &plusmn;1e-6
      </p>
      <RawDiffChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>kEnd</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>recomputed peak</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>argmax k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>imp-34196</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>imp-34109</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>raw diff</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sub-rung increment</th>
          </tr>
        </thead>
        <tbody>
          {IMP34269_CROSS_ROWS.map((r) => (
            <tr key={r.kEnd} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.kEnd.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.recomputedPeak.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.recomputedAtK.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.imp34196Peak.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.imp34109Peak.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace', color: 'var(--series-3)' }}>
                {r.rawDiff.toExponential(3)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.subRungIncrement}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked
        literals reproducing the imp-34269 measurement; no new derivation, no bound changed.
        Verification/cross-recompute only -- neither imp-34196 nor imp-34109 is strengthened or
        overturned, this only certifies they measure the same thing. Descriptive OLS surrogate,
        NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
        K_a&ge;0 untouched; NO QED.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Same fixed-band-peak cohort:</strong> this cross-recompute
        sits alongside the{' '}
        <Link to="/viz-imp34268-fixed-band-peak-reaccel-convexity-stitch" style={{ color: 'var(--ink-soft)' }}>
          re-acceleration convexity stitch
        </Link>{' '}
        (imp-34268) in the same fixed-band peak family. See the{' '}
        <Link to="/viz-imp34281-m2-ceiling-cohort-index" style={{ color: 'var(--ink-soft)' }}>
          full M2-ceiling cohort index
        </Link>{' '}
        for the other viz surfaces sharing this ceiling.
      </div>
    </div>
  );
}
