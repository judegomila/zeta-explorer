import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34594_RUNGS,
  IMP34594_LOCAL_SLOPES,
  IMP34594_CONSTANTS,
} from '../data/imp-34594-eflow-attr-far-side-smoothness-ladder-viz-data.js';

export default function Imp34594EflowAttrFarSideSmoothnessLadderViz() {
  const { kStar, minEflowAttr, slopeDrift } = IMP34594_CONSTANTS;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Far-Side eflow_attr Smoothness Ladder Through the Pole (imp-34572)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34572 extended the imp-34406 eflow_attr recovery to seven rungs k = 21.30 .. 21.60,
        all above the eflow_over_resid pole k* &asymp; {kStar.toFixed(5)}. On this entire far side,
        eflow_attr stays strictly positive (min +{minEflowAttr.toExponential(3)} at the far
        endpoint k = 21.60) and falls strictly monotonically, with the local per-k log-slope
        drifting by just {slopeDrift.toFixed(6)} across the whole bracket -- no kink, sign change,
        or slope jump straddles the pole.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        the seven-rung far-side ladder
      </p>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>eflow_attr</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>source</th>
          </tr>
        </thead>
        <tbody>
          {IMP34594_RUNGS.map((row) => (
            <tr key={row.k} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.k.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.eflowAttr.toExponential(6)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.source}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        local per-k log-slope d ln(eflow_attr) / dk (smooth drift, no kink)
      </p>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>k</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>local slope</th>
          </tr>
        </thead>
        <tbody>
          {IMP34594_LOCAL_SLOPES.map((row) => (
            <tr key={row.k} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.k.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.slopePerK.toFixed(6)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Summary:</strong> the three overlap rungs (k = 21.30,
        21.40, 21.50) reproduce the imp-34406 near-side bracket exactly, and the four new far-side
        rungs (k = 21.35, 21.45, 21.55, 21.60) extend it strictly past k*, staying nonzero,
        monotone-decreasing and smoothly log-sloped throughout -- so continuity of the
        eflow_over_resid numerator through the simple pole is now measured on both sides, not
        inferred on the far side.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-34572 measurement; no new derivation, no bound changed. Component model
        is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb
        GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; NO QED.
      </div>
    </div>
  );
}
