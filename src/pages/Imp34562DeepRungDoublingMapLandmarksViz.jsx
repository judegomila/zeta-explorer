import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34562_DEEP_RUNG_DOUBLING_MAP_LANDMARKS } from '../data/imp-34562-deep-rung-doubling-map-landmarks.js';

const { landmarks, rungLadder, residUlp, finding } = IMP34562_DEEP_RUNG_DOUBLING_MAP_LANDMARKS;

export default function Imp34562DeepRungDoublingMapLandmarksViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Deep-Rung Doubling-Map Landmarks: Vertex, Noise Floor, ULP Margin (imp-34562)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Three landmarks describing the same resid_exp(k) hump near k*&sim;8.8211 -- the imp-34524
        Newton continuum vertex, the imp-34368 evaluation-noise floor, and the imp-34524/imp-34551
        top-two-margin ULP ladder -- were previously scattered across separate module JSDoc. This
        page tabulates all three on one shared refinement-rung axis.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ padding: '0.75rem 1rem', background: 'color-mix(in srgb, var(--ink-soft) 6%, transparent)', borderRadius: 6 }}>
          <div style={{ color: 'var(--ink-soft)', fontSize: '0.75rem' }}>{landmarks.continuumVertex.label}</div>
          <div style={{ color: 'var(--series-5)', fontFamily: 'monospace', fontSize: '1.1rem', marginTop: '0.25rem' }}>
            {landmarks.continuumVertex.value}
          </div>
          <div style={{ color: 'var(--ink-faint)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
            {landmarks.continuumVertex.note}
          </div>
        </div>
        <div style={{ padding: '0.75rem 1rem', background: 'color-mix(in srgb, var(--ink-soft) 6%, transparent)', borderRadius: 6 }}>
          <div style={{ color: 'var(--ink-soft)', fontSize: '0.75rem' }}>{landmarks.noiseFloor.label}</div>
          <div style={{ color: 'var(--series-5)', fontFamily: 'monospace', fontSize: '1.1rem', marginTop: '0.25rem' }}>
            {Number(landmarks.noiseFloor.value).toExponential(2)}
          </div>
          <div style={{ color: 'var(--ink-faint)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
            {landmarks.noiseFloor.note}
          </div>
        </div>
      </div>

      <table
        style={{
          width: '100%',
          marginTop: '1rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>Rung e</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>f-independent margin bound</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>margin in storage ULPs</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>below one ULP?</th>
          </tr>
        </thead>
        <tbody>
          {rungLadder.map((row) => (
            <tr key={row.exponent} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.exponent}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {Number(row.marginAbs).toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.marginUlps}</td>
              <td
                style={{
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'monospace',
                  color: row.belowOneUlp ? 'var(--series-2)' : 'var(--series-3)',
                }}
              >
                {row.belowOneUlp ? 'yes -- unresolvable in native double' : 'no'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
        Storage ULP near the resid_exp peak (2<sup>-56</sup>): {Number(residUlp).toExponential(4)}.
      </p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1rem' }}>{finding}</p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only, reusing every
        literal verbatim from the imp-34524/imp-34368/imp-34551 source modules -- no re-derivation. The
        component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; the
        surrogate resid_exp(k) is descriptive, not derived; the C_mb GUE-conditional per imp-486 and the
        C_C 1/8 ansatz (imp-2642/imp-2643) are untouched. Changes no bound, establishes no operator
        positivity, imp-3066 K_a &ge; 0 untouched, no RH claim, NO QED.
      </div>
    </div>
  );
}
