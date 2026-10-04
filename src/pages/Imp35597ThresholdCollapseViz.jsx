import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35597_LANDMARKS,
  IMP35597_POLYLOG_CURVE,
  IMP35597_POWERLAW_CURVE,
  IMP35597_SUMMARY,
} from '../data/imp-35597-threshold-collapse-viz-data.js';
import { ED } from '../styles/tokens.js';

// Log-scaled horizontal bar for a "log T0 needed" value against a shared max.
function ThresholdBar({ label, value, maxLog, color, sub }) {
  const pct = Math.max(2, (value / maxLog) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
      <span style={{ width: 90, fontSize: '0.75rem', color: 'var(--ink-soft)', fontFamily: 'monospace' }}>
        {label}
      </span>
      <div style={{ flex: 1, background: 'color-mix(in srgb, var(--paper-3) 35%, transparent)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, background: color, height: 14 }} />
      </div>
      <span style={{ width: 130, textAlign: 'right', fontSize: '0.75rem', color: 'var(--ink)', fontFamily: 'monospace' }}>
        {value.toFixed(2)}
        {sub ? ` (${sub})` : ''}
      </span>
    </div>
  );
}

export default function Imp35597ThresholdCollapseViz() {
  const maxLog = 205; // baseline of 200 plus headroom

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route-(i) Subleading-Rate Threshold-Collapse Curve (imp-35597 / imp-35571)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.82rem',
          color: 'var(--ink)',
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>Scoping only:</strong> quantifies how a{' '}
        <em>proved</em> subleading rate would lower the imp-35538 REQ-4 log T0
        &nbsp;&ge;&nbsp;200 threshold -- no such rate is proved for the zeta zeros (imp-35571).
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The natural LEADING rate O(1/log T0) needs log T0 &ge; 1/B = {IMP35597_LANDMARKS.logT0NeededLeading}{' '}
        (T0 &ge; e^200) to hit the 0.5% relative crossover budget. A poly-log rate O(1/(log T0)^a) instead
        needs log T0 &ge; 200^(1/a); a power-law rate O(T0^-delta) needs log T0 &ge; 5.2983/delta. Both
        families collapse the threshold as the exponent grows.
      </p>

      <h3 style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
        Poly-log family: log T0 needed = 200^(1/a)
      </h3>
      {IMP35597_POLYLOG_CURVE.map((row) => (
        <ThresholdBar
          key={`polylog-${row.a}`}
          label={`a = ${row.a}`}
          value={row.logT0Needed}
          maxLog={maxLog}
          color={ED.series1}
        />
      ))}

      <h3 style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem', marginBottom: '0.3rem' }}>
        Power-law family: log T0 needed = 5.2983 / delta
      </h3>
      {IMP35597_POWERLAW_CURVE.map((row) => (
        <ThresholdBar
          key={`powerlaw-${row.delta}`}
          label={`δ = ${row.delta}`}
          value={row.logT0Needed}
          maxLog={maxLog}
          color={ED.series5}
        />
      ))}

      <h3 style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem', marginBottom: '0.3rem' }}>
        Landmark log-heights
      </h3>
      <ThresholdBar
        label="peak"
        value={IMP35597_LANDMARKS.logT0Peak}
        maxLog={maxLog}
        color={ED.series3}
        sub="interior sigma-peak"
      />
      <ThresholdBar
        label="crossover"
        value={IMP35597_LANDMARKS.logT0Cross}
        maxLog={maxLog}
        color={ED.series3}
        sub="E_coll = E_trunc"
      />
      <ThresholdBar
        label="T_PT anchor"
        value={IMP35597_LANDMARKS.logT_PT}
        maxLog={maxLog}
        color={ED.series3}
        sub="Platt-Trudgian"
      />
      <ThresholdBar
        label="baseline"
        value={IMP35597_LANDMARKS.logT0NeededLeading}
        maxLog={maxLog}
        color={ED.series2}
        sub="e^200 leading rate"
      />

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
        An a = 2 poly-log rate drops the threshold to ~{IMP35597_SUMMARY.a2LogT0Needed} -- just above
        the peak (~{IMP35597_LANDMARKS.logT0Peak}) and below both the crossover
        (~{IMP35597_LANDMARKS.logT0Cross}) and the PT anchor (~{IMP35597_LANDMARKS.logT_PT}). A
        power-law rate with delta as small as ~{IMP35597_SUMMARY.deltaAtCrossoverHeight} already puts
        the threshold at the crossover height. The e^200 wall is entirely an artifact of the LEADING
        rate -- but no subleading rate is proved for the zeta zeros (imp-35571).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Measurement only:</strong> viz-data re-exporting the
        imp-35571 candidates/landmark table verbatim plus dense curve series for plotting; no new
        derivation, no bound changed. Discharges nothing: route-(i) stays imp-486 GUE-conditional and
        the imp-35337a surrogate-vs-true fidelity sub-gap stays OPEN; the C_C = (1/8)&nbsp;sqrt(3&nbsp;pi)
        ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631) are UNTOUCHED; no RH verdict,
        NO QED.
      </div>
    </div>
  );
}
