import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96231_INPUT,
  IMP96231_MODELS,
  IMP96231_SELECTION,
  IMP96231_PEAK_SIGNIFICANCE,
  IMP96231_HONEST_BANNER,
} from '../data/imp-96231-route-m-band-vs-drift-identifiability.js';

const MODEL_ROWS = [
  { key: 'band_q4q5', label: 'band (q4 + q5 Vasyunin conductors)', akaikeWeight: IMP96231_SELECTION.akaikeWeightBand },
  { key: 'poly_deg2', label: 'drift, degree-2 polynomial', akaikeWeight: null },
  { key: 'poly_deg3', label: 'drift, degree-3 polynomial', akaikeWeight: null },
  { key: 'poly_deg4', label: 'drift, degree-4 polynomial', akaikeWeight: IMP96231_SELECTION.akaikeWeightPoly4 },
];

const tdStyle = { padding: '0.4rem 0.6rem', fontFamily: 'monospace' };
const thStyle = { padding: '0.4rem 0.6rem' };

export default function Imp96262ModelSelectionScoresViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96231: Band-vs-Drift Model-Selection Scores" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96231_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        imp-96231 scored the fixed q4 + q5 Vasyunin conductor band against low-order smooth
        (non-spectral) drift polynomials on the {IMP96231_INPUT.nPoints} imp-96147 residual rows
        (log N span {IMP96231_INPUT.logNSpan}), using R&sup2;, AICc, BIC, exact leave-one-out
        (LOO) PRESS, and Akaike weights. The band decisively beats every drift alternative.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        model comparison: band vs low-order drift polynomials
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={thStyle}>model</th>
            <th style={thStyle}>k (params)</th>
            <th style={thStyle}>R&sup2;</th>
            <th style={thStyle}>AICc</th>
            <th style={thStyle}>BIC</th>
            <th style={thStyle}>LOO PRESS</th>
            <th style={thStyle}>Akaike weight</th>
          </tr>
        </thead>
        <tbody>
          {MODEL_ROWS.map((row) => {
            const m = IMP96231_MODELS[row.key];
            return (
              <tr key={row.key} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
                <td style={{ padding: '0.4rem 0.6rem' }}>{row.label}</td>
                <td style={tdStyle}>{m.k}</td>
                <td style={tdStyle}>{m.R2.toFixed(4)}</td>
                <td style={tdStyle}>{m.aicc.toFixed(2)}</td>
                <td style={tdStyle}>{m.bic.toFixed(2)}</td>
                <td style={tdStyle}>{m.press.toExponential(4)}</td>
                <td style={{ ...tdStyle, color: row.akaikeWeight != null ? 'var(--series-2)' : 'var(--ink-faint)' }}>
                  {row.akaikeWeight != null ? row.akaikeWeight.toFixed(4) : 'n/a (not the k=5 comparator pair)'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        free-tone permutation significance (5000 shuffles, w scanned 1..12)
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={thStyle}>quantity</th>
            <th style={thStyle}>value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>best free-tone R&sup2; (at w = {IMP96231_PEAK_SIGNIFICANCE.bestFreeToneW})</td>
            <td style={tdStyle}>{IMP96231_PEAK_SIGNIFICANCE.bestFreeToneR2.toFixed(4)}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>permutation p-value ({IMP96231_PEAK_SIGNIFICANCE.permutations} shuffles)</td>
            <td style={{ ...tdStyle, color: 'var(--series-2)' }}>{IMP96231_PEAK_SIGNIFICANCE.pValue.toFixed(4)}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>null median R&sup2;</td>
            <td style={tdStyle}>{IMP96231_PEAK_SIGNIFICANCE.nullMedianR2.toFixed(4)}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>null 95th-percentile R&sup2;</td>
            <td style={tdStyle}>{IMP96231_PEAK_SIGNIFICANCE.null95R2.toFixed(4)}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>null max R&sup2; (5000 shuffles)</td>
            <td style={tdStyle}>{IMP96231_PEAK_SIGNIFICANCE.nullMaxR2.toFixed(4)}</td>
          </tr>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the tables:</strong> at equal parameter
        count (k = 5) the band beats the degree-4 drift polynomial by &Delta;AICc ={' '}
        {IMP96231_SELECTION.deltaAiccBandMinusPoly4.toFixed(1)} (a |&Delta;| &gt;&gt; 10 gap is
        decisive) and by Akaike weight {IMP96231_SELECTION.akaikeWeightBand.toFixed(3)} vs{' '}
        {IMP96231_SELECTION.akaikeWeightPoly4.toFixed(4)}. The band also has smaller LOO PRESS
        than the degree-2 and degree-3 drifts, so the advantage is out-of-sample, not overfitting.
        Separately, the best free single tone (R&sup2; = {IMP96231_PEAK_SIGNIFICANCE.bestFreeToneR2.toFixed(3)})
        sits above the 95th-percentile permutation null, confirming the oscillation itself is
        statistically real (p = {IMP96231_PEAK_SIGNIFICANCE.pValue.toFixed(4)}) -- but that same
        free tone is statistically indistinguishable from the fixed band, so the specific q4 + q5
        conductor content is not uniquely identified by this test.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page tabulating the
        imp-96231 baked model-selection scores verbatim (no new computation). Measurement only;
        changes no bound, establishes no operator positivity, makes no RH claim. RH open. NO QED.
      </div>
    </div>
  );
}
