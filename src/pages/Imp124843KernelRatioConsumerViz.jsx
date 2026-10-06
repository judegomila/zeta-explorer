import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP124776_WIDE_RATIO_VS_GAP,
  IMP124776_DEEP_RATIO_VS_GAP,
  IMP124776_SUMMARY,
} from '../data/imp-124776-kernel-decade-ratio-vs-gap-viz-data.js';
import {
  IMP97843_WIDE_RATIO_ROWS,
  IMP97843_DEEP_RATIO_ROWS,
  IMP97843_SUMMARY,
} from '../data/imp-97843-kernel-decade-growth-viz-data.js';
import { ED } from '../styles/tokens.js';

const SQRT10 = IMP124776_WIDE_RATIO_VS_GAP[0].sqrt10;

function RatioTable({ title, keyLabel, rows, keyField, formatKey }) {
  return (
    <div style={{ flex: '1 1 320px', minWidth: 280 }}>
      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.4rem' }}>
        {title}
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${ED.rule}` }}>
            <th style={{ textAlign: 'left', padding: '0.3rem 0.4rem', color: 'var(--ink-faint)' }}>{keyLabel}</th>
            <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: 'var(--ink-faint)' }}>upslope</th>
            <th style={{ textAlign: 'right', padding: '0.3rem 0.4rem', color: 'var(--ink-faint)' }}>downslope</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${ED.ruleSoft}` }}>
              <td style={{ padding: '0.3rem 0.4rem', color: 'var(--ink-soft)' }}>{formatKey(r[keyField])}</td>
              <td style={{ padding: '0.3rem 0.4rem', textAlign: 'right', color: 'var(--ink)' }}>{r.upslope_ratio}</td>
              <td style={{ padding: '0.3rem 0.4rem', textAlign: 'right', color: 'var(--ink)' }}>{r.downslope_ratio}</td>
            </tr>
          ))}
          <tr>
            <td style={{ padding: '0.3rem 0.4rem', color: 'var(--ink-faint)', fontStyle: 'italic' }}>sqrt(10)</td>
            <td colSpan={2} style={{ padding: '0.3rem 0.4rem', textAlign: 'right', color: 'var(--brass)', fontWeight: 700 }}>
              {SQRT10}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function Imp124843KernelRatioConsumerViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Kernel Decade-Ratio: Gap-Keyed vs Decade-Keyed (imp-124843)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        Two sibling viz-data leaves export the same imp-97823 reconstruction-kernel |K| per-decade growth
        ratio under two different axis framings: imp-124776 keys each ratio by the actual near-peak gap g,
        imp-97843 keys the same ratios by a bare decade index. Both arms (upslope and downslope of the
        imp-97520 L1 sigma peak) bracket sqrt(10) = {SQRT10} from opposite sides as the window narrows. This
        page renders both framings side by side from the frozen arrays, verbatim, for direct comparison.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        wide ladder (far-from-peak running correction regime)
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <RatioTable
          title="ratio vs gap g (imp-124776)"
          keyLabel="gap g"
          rows={IMP124776_WIDE_RATIO_VS_GAP}
          keyField="gap"
          formatKey={(g) => g.toExponential(0)}
        />
        <RatioTable
          title="ratio vs decade index (imp-97843)"
          keyLabel="decade"
          rows={IMP97843_WIDE_RATIO_ROWS}
          keyField="decade"
          formatKey={(d) => d}
        />
      </div>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        deep window (converging onto sqrt(10) near the peak)
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <RatioTable
          title="ratio vs gap g (imp-124776)"
          keyLabel="gap g"
          rows={IMP124776_DEEP_RATIO_VS_GAP}
          keyField="gap"
          formatKey={(g) => g.toExponential(0)}
        />
        <RatioTable
          title="ratio vs decade index (imp-97843)"
          keyLabel="decade"
          rows={IMP97843_DEEP_RATIO_ROWS}
          keyField="decade"
          formatKey={(d) => d}
        />
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP97843_SUMMARY.verdict}
      </div>
    </div>
  );
}
