import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34488_CONDITIONALITY_GAP_RATIO_THREE_LANDMARKS } from '../data/imp-34488-conditionality-gap-ratio-three-landmarks.js';

const { landmarks, gapGrowth } = IMP34488_CONDITIONALITY_GAP_RATIO_THREE_LANDMARKS;

export default function Imp34522ConditionalityGapLandmarksViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Decay Landmark Ladder: E(N) and the Conditionality Gap (imp-34522)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The three named sigma(N) = E_coll/E(N) decay landmarks -- the imp-3444 E_coll = E_trunc
        crossover (N &sim; 3.28e9, sigma &sim; 0.5), the imp-33582 sigma &lt; 0.1 knee
        (N &sim; 3.21e11), and the imp-33620 sigma &lt; 0.01 far tail (N &sim; 4.62e13) -- were
        previously scattered across imp-34488/34474/34453 JSDoc. This page tabulates their E(N),
        the conditionality-gap ratio L_pt/E(N), and the ceiling fraction in one place.
      </p>

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
            <th style={{ padding: '0.4rem 0.6rem' }}>Landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>sigma</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>E(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>L_pt / E(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ceiling fraction</th>
          </tr>
        </thead>
        <tbody>
          {landmarks.map((row) => (
            <tr key={row.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {Number(row.N).toExponential(3)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.sigma}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {Number(row.E_N).toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', color: 'var(--series-5)', fontFamily: 'monospace' }}>
                {row.L_pt_over_E_N}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.ceiling_fraction}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Ceiling L_pt / E_trunc = {gapGrowth.ceiling_L_pt_over_E_trunc}. The gap ratio grows{' '}
        {gapGrowth.growth_cross_to_sigma01}x from the crossover to the sigma &lt; 0.1 knee, then
        only {gapGrowth.growth_sigma01_to_sigma001}x from there to the sigma &lt; 0.01 far tail
        (cumulative {gapGrowth.growth_cross_to_sigma001}x) -- a decelerating, bounded saturation
        toward the ceiling, not unbounded growth.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> these are bridge-conditionality
        quantities per imp-2564, NOT &Lambda; bounds. R(N) = L_pt/E(N) measures a GUE-conditional
        margin (C_mb per imp-486) over the unconditional finite-height beat L_pt &sim; 0.121, within
        the inherited imp-3220/imp-3406 component model, which is not a rigorous asymptotic. No
        positivity, no bridge closure, no bound change, no RH claim, NO QED.
      </div>
    </div>
  );
}
