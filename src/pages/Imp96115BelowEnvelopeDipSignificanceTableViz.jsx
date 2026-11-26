import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP96089_MEAN_ANCHOR_WINDOW_COUNT_SIGNIFICANCE_VERDICT } from '../data/imp-96089-mean-anchor-window-count-significance-verdict.js';

function fmtT(Tc) {
  if (Tc >= 1e5) return `${(Tc / 1e5).toFixed(1)}e5`;
  return `${(Tc / 1e4).toFixed(0)}e4`;
}

function BelowEnvelopeDipTable({ rows }) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.85rem',
        color: 'var(--ink)',
      }}
    >
      <thead>
        <tr style={{ borderBottom: '2px solid var(--rule)' }}>
          {['T', 'n_w', 'chi-square crossover', 'z-score (sigma)', 'verdict'].map((h) => (
            <th key={h} style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.Tc} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{fmtT(r.Tc)}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.nWindows}</td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>
              {r.nwCrossover.toFixed(0)}
            </td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.zScore.toFixed(2)}</td>
            <td
              style={{
                textAlign: 'right',
                padding: '0.4rem 0.6rem',
                color: r.verdict === 'SIGNIFICANT' ? 'var(--series-2)' : 'var(--ink-faint)',
                fontWeight: r.verdict === 'SIGNIFICANT' ? 600 : 400,
              }}
            >
              {r.verdict}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp96115BelowEnvelopeDipSignificanceTableViz() {
  const data = IMP96089_MEAN_ANCHOR_WINDOW_COUNT_SIGNIFICANCE_VERDICT;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="imp-96089: Below-Envelope Dip Significance Verdict (T = 1e4 / 1.5e5 / 3e5)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a reader-facing table of the
        imp-96089 measurement, deciding which of the three imp-96049 below-envelope mean-anchor
        dips is a real number-variance excursion versus sampling noise. It changes no Lambda bound
        and establishes no operator positivity. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Each height&apos;s quasi-independent window count n_w(T) is recovered exactly from the
        imp-95562 non-overlapping tiling geometry (deterministic, no zeros bundle). The chi-square
        crossover is the window count below which the dip falls inside 1-sigma sampling noise; the
        z-score is the dip size in units of that sampling error. Only T&nbsp;=&nbsp;1.5e5, where
        n_w&nbsp;=&nbsp;291 sits well above its crossover of 79, clears z&nbsp;&ge;&nbsp;1.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Significance verdict by height
      </h3>
      <BelowEnvelopeDipTable rows={data.belowEnvelopeVerdict} />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the table:</strong> T&nbsp;=&nbsp;1e4 and
        T&nbsp;=&nbsp;3e5 fall far short of their crossovers (0.37&sigma; and 0.08&sigma;) and are
        NOISE. T&nbsp;=&nbsp;1.5e5, the deepest of the three dips, is SIGNIFICANT at 1.92&sigma; --
        the same height where imp-96070 (LOO residual) and imp-96071 (binding uniform correction)
        already flagged the mean anchor as failing to cap the measured ratio. The dead-zone
        r_cap&nbsp;&lt;&nbsp;1 headline therefore keeps resting on the out-of-sample-safer
        imp-95722 max anchor.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96089
        baked verdict verbatim (no re-derivation). Changes no bound, establishes no operator
        positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
