import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96702_GAP_BARS,
  IMP96702_GAP_RATIOS,
  IMP96702_REACH_ROWS,
  IMP96702_CEILING,
  IMP96702_HONEST_BANNER,
} from '../data/imp-96702-route-m-reach-projection-viz-data.js';
import { ED } from '../styles/tokens.js';

const GAP_COLORS = {
  gapFull: ED.series2,
  sigmaScatter: ED.series1,
  sigmaMB: ED.series3,
};

function GapBar({ entry, maxValue }) {
  const widthPct = Math.max(2, (entry.value / maxValue) * 100);
  return (
    <div key={entry.key} style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
        <span>{entry.label}</span>
        <span>{entry.value.toExponential(4)}</span>
      </div>
      <div style={{ height: 8, background: 'color-mix(in srgb, var(--ink-soft) 12%, transparent)', borderRadius: 4 }}>
        <div
          style={{ width: `${widthPct}%`, height: '100%', background: GAP_COLORS[entry.key], borderRadius: 4 }}
        />
      </div>
    </div>
  );
}

function ReachRow({ row, maxLog10 }) {
  const widthPct = Math.max(2, (row.log10N1 / maxLog10) * 100);
  return (
    <div key={row.key} style={{ marginBottom: '0.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
        <span>{row.label}</span>
        <span>
          N1 = {row.N1.toExponential(3)} (+{row.ordersBeyondCeil.toFixed(2)} orders)
        </span>
      </div>
      <div style={{ height: 6, background: 'color-mix(in srgb, var(--ink-soft) 12%, transparent)', borderRadius: 3 }}>
        <div style={{ width: `${widthPct}%`, height: '100%', background: 'var(--series-5)', borderRadius: 3 }} />
      </div>
    </div>
  );
}

export default function Imp96702RouteMReachProjectionViz() {
  const maxGapValue = Math.max(...IMP96702_GAP_BARS.map((b) => b.value)) * 1.05;
  const maxLog10 = Math.max(...IMP96702_REACH_ROWS.map((r) => r.log10N1)) * 1.02;
  const ceilPct = (IMP96702_CEILING.log10CeilN / maxLog10) * 100;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M Reach Projection: Gap Floor vs Compute Ceiling" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96702_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96569 measured that the RH-vs-plateau centerline gap (gapFull) is smaller than either
        fluctuation scale it must clear, then projected nine reach-N corners (confidence z x drift
        exponent q) under an optimistic SE-of-mean model. Every corner lands beyond the imp-96352
        compute ceiling N&nbsp;~&nbsp;9916.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Gap floor: gapFull vs the two fluctuation scales
      </h3>
      <div style={{ maxWidth: 700, marginBottom: '0.5rem' }}>
        {IMP96702_GAP_BARS.map((b) => (
          <GapBar key={b.key} entry={b} maxValue={maxGapValue} />
        ))}
      </div>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', maxWidth: 700, marginBottom: '1.5rem' }}>
        gapFull / sigma_scatter = {IMP96702_GAP_RATIOS.gapToScatter.toFixed(3)}, gapFull / sigma_MB
        = {IMP96702_GAP_RATIOS.gapToMB.toFixed(3)} &mdash; both below 2, so a per-rung-scatter-limited
        reading can never reach 2 sigma.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Reach-N corners (log10 N) vs the compute ceiling
      </h3>
      <div style={{ maxWidth: 700, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: `${ceilPct}%`,
            top: 0,
            bottom: 0,
            width: 1,
            borderLeft: '1px dashed var(--series-2)',
          }}
        />
        {IMP96702_REACH_ROWS.map((r) => (
          <ReachRow key={r.key} row={r} maxLog10={maxLog10} />
        ))}
      </div>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', maxWidth: 700, marginTop: '0.25rem' }}>
        Dashed line marks the imp-96352 wall-clock compute ceiling N&nbsp;~&nbsp;
        {IMP96702_CEILING.ceilN.toLocaleString()} (log10 = {IMP96702_CEILING.log10CeilN.toFixed(2)}).
        Every corner sits to its right.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        imp-96702 viz-data leaf (every gap, sigma, and reach-N value reused verbatim from
        imp-96569). {IMP96702_HONEST_BANNER}
      </div>
    </div>
  );
}
