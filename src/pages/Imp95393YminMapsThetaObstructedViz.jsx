import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95255_CURRENCY_PER_WINDOW_MAP_ASSESSMENT } from '../data/imp-95255-currency-per-window-map-assessment.js';
import { ED, alpha } from '../styles/tokens.js';

const DATA = IMP95255_CURRENCY_PER_WINDOW_MAP_ASSESSMENT;
const RATIOS = DATA.constants.yminOverXmin;

function VerdictBadge({ maps }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.15rem 0.6rem',
        borderRadius: 999,
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.03em',
        color: maps ? '#052e16' : '#450a0a',
        background: maps ? 'var(--series-3)' : 'var(--series-2)',
      }}
    >
      {maps ? 'MAPS' : 'OBSTRUCTED'}
    </span>
  );
}

function CurrencyCard({ symbol, name, maps, reason, evidence }) {
  return (
    <div
      style={{
        flex: '1 1 300px',
        minWidth: 280,
        padding: '1rem 1.1rem',
        borderRadius: 8,
        background: 'color-mix(in srgb, var(--ink-soft) 5%, transparent)',
        border: `1px solid ${maps ? alpha(ED.series3, 0.35) : alpha(ED.series2, 0.35)}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ color: 'var(--ink)', fontSize: '1.05rem', fontWeight: 600 }}>
          {symbol} <span style={{ color: 'var(--ink-soft)', fontWeight: 400, fontSize: '0.85rem' }}>({name})</span>
        </span>
        <VerdictBadge maps={maps} />
      </div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.82rem', margin: '0 0 0.6rem 0' }}>{reason}</p>
      {evidence}
    </div>
  );
}

export default function Imp95393YminMapsThetaObstructedViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Currency Split Verdict: y_min MAPS, theta OBSTRUCTED (imp-95255)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> an assessment, not a new
        theorem or bound. It classifies two model-family currencies (imp-95233) against the
        existing imp-95220/imp-95222 transcription; it moves no Lambda bound and adds no
        certificate. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95233 HONEST LIMITS (c) lumped y_min and theta together as "not yet mapped to the
        paper per-window quantities." imp-95255 assesses that claim leg by leg and finds the two
        currencies split: one currency rides the existing geometry map for free, the other has no
        image under it at all.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <CurrencyCard
          symbol="y_min"
          name="per-window depth"
          maps
          reason="Built only from rates and centers (mu, u), exactly the data the imp-95220 width-law port supplies. Inherits the same isolation group Q that imp-95222 QG-2 already carries for x_min."
          evidence={
            <table style={{ width: '100%', fontSize: '0.75rem', color: 'var(--ink)', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--ink-faint)' }}>
                  <th style={{ textAlign: 'left', paddingBottom: 2 }}>pD</th>
                  <th style={{ textAlign: 'right', paddingBottom: 2 }}>y_min / x_min</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(RATIOS).map(([key, ratio]) => {
                  const [p, D] = key.split(',').map(Number);
                  return (
                    <tr key={key} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
                      <td style={{ padding: '2px 0' }}>{p * D}</td>
                      <td style={{ textAlign: 'right' }}>{ratio.toFixed(6)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          }
        />
        <CurrencyCard
          symbol="theta"
          name="per-window phase"
          maps={false}
          reason="A scale-invariant amplitude-SIGN functional. The transcription is geometry + modulus only (mu(d), u(d), |c| = 1/p) and carries no per-window sign pattern, so theta has no preimage under it."
          evidence={
            <div style={{ fontSize: '0.75rem', color: 'var(--ink)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
                <span>fixed-amplitude family (paper spec, all 1/p)</span>
                <span>theta = 1 exactly</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
                <span>signed amplitudes, same geometry</span>
                <span>theta &lt; 1</span>
              </div>
            </div>
          }
        />
      </div>

      <div
        style={{
          marginTop: '0.5rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>The wall:</strong> {DATA.wall}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page reading the existing
        imp-95255 assessment module (import-light, no zeros bundle). Sub-gap
        imp-95212-subgap-fresnel-airy-envelope-port remains STILL OPEN. Changes no bound,
        establishes no operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains SOTA. NO QED.
      </div>
    </div>
  );
}
