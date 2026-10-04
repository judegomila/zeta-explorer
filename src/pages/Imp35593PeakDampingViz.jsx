import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35593_PEAK,
  IMP35593_RAW_HEIGHT_GAP,
  IMP35593_BARS,
  IMP35593_SUMMARY,
} from '../data/imp-35593-peak-damping-viz-data.js';
import { ED } from '../styles/tokens.js';

// Horizontal paired bars: one row per metric, peak (blue) vs crossover (amber), signed.
function PairedBars({ rows, unit, maxAbs }) {
  return (
    <div style={{ marginTop: '0.75rem' }}>
      {rows.map((row) => {
        const pct = Math.max(2, (Math.abs(row.value) / maxAbs) * 100);
        const color = row.landmark === 'peak location' ? ED.series1 : ED.brass;
        return (
          <div key={row.landmark} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ width: 100, fontSize: '0.78rem', color: 'var(--ink-soft)', fontFamily: 'monospace' }}>
              {row.landmark}
            </span>
            <div style={{ flex: 1, background: 'color-mix(in srgb, var(--paper-3) 35%, transparent)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, background: color, height: 14 }} />
            </div>
            <span style={{ width: 90, textAlign: 'right', fontSize: '0.78rem', color: 'var(--ink)', fontFamily: 'monospace' }}>
              {row.value > 0 ? '+' : ''}
              {row.value.toFixed(2)}
              {unit}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Imp35593PeakDampingViz() {
  const rawGapRows = IMP35593_BARS.rawHeightGapPct.map((b) => ({ landmark: b.landmark, value: b.pct }));
  const shiftRows = IMP35593_BARS.relativeShiftPct.map((b) => ({ landmark: b.landmark, value: b.pct }));
  const dampingRows = IMP35593_BARS.dampingFactor.map((b) => ({ landmark: b.landmark, value: b.factor }));

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Peak-Location vs Crossover Height-Map Damping (imp-35593 / imp-35574)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35458 found the E_coll = E_trunc CROSSOVER landmark log-damps a ~18 percent raw
        height-map gap into only a ~
        {Math.abs(IMP35593_BARS.relativeShiftPct[1].pct).toFixed(2)} percent shift (damping factor
        ~{IMP35593_SUMMARY.dampingFactorCrossover}). imp-35574 asked whether the interior sigma
        PEAK location enjoys the same insulation, and found it does not: a ~
        {IMP35593_RAW_HEIGHT_GAP.raw_height_gap_pct.toFixed(2)} percent raw gap maps into a ~
        {IMP35593_PEAK.relative_shift_pct.toFixed(2)} percent shift -- a damping factor of only ~
        {IMP35593_SUMMARY.dampingFactorPeak.toFixed(3)}, i.e. mild AMPLIFICATION, not damping.
      </p>

      <h3 style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
        Raw height-map gap at the fixed landmark (surrogate vs RvM inverse)
      </h3>
      <PairedBars rows={rawGapRows} unit="%" maxAbs={25} />

      <h3 style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem', marginBottom: '0.3rem' }}>
        Relative landmark shift (surrogate map vs RvM map)
      </h3>
      <PairedBars rows={shiftRows} unit="%" maxAbs={44} />

      <h3 style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem', marginBottom: '0.3rem' }}>
        Damping factor = (1 - raw-height ratio) / |relative shift|
      </h3>
      <PairedBars rows={dampingRows} unit="x" maxAbs={18} />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
          borderLeft: '3px solid var(--series-1)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.85rem',
          color: 'var(--ink)',
        }}
      >
        The crossover is ~{IMP35593_SUMMARY.crossoverVsPeakRatio.toFixed(2)}x more strongly
        log-damped than the peak location. Mechanism: the crossover N solves E_coll = E_trunc, so N
        is proportional to log T0 and the height enters only logarithmically; the peak location
        solves dg_sigma/dN = 0, a stationarity balancing E_coll against E_flow with no
        log-proportional insulation, so a height-map change moves the balance point close to
        one-for-one.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Measurement only:</strong> viz-data only, re-exporting
        the imp-35574 peak/rawHeightGapAtPeak/dampingComparison fields verbatim; no new derivation,
        no bound changed. Discharges nothing: the imp-35337a surrogate-vs-true fidelity sub-gap
        stays OPEN; the C_C = (1/8)&nbsp;sqrt(3&nbsp;pi) ansatz (imp-2642/imp-2643) and
        E_trunc = 3.06e-5 (imp-2631) are UNTOUCHED; changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
