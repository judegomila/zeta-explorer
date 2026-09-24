import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR } from '../data/imp-96108-number-variance-excursion-depth-vs-max-anchor.js';

function OffsetLedgerTable({ rows }) {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.85rem',
        color: '#cbd5e1',
      }}
    >
      <thead>
        <tr style={{ borderBottom: '2px solid #334155' }}>
          {['T', 'sample', 'offset(T)', 'gap below C0_max', 'd_reach (%)'].map((h) => (
            <th key={h} style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#94a3b8' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.Tc} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: '#e2e8f0' }}>
              {r.Tc.toExponential(1)}
            </td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>
              {r.heldOut ? 'held-out' : 'fit'}
            </td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>{r.offset.toFixed(6)}</td>
            <td
              style={{
                textAlign: 'right',
                padding: '0.4rem 0.6rem',
                color: r.offsetGapBelowMax < 0.02 ? '#facc15' : '#64748b',
                fontWeight: r.offsetGapBelowMax < 0.02 ? 600 : 400,
              }}
            >
              {r.offsetGapBelowMax.toFixed(6)}
            </td>
            <td style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}>
              {r.depthToReachMaxCapPct.toFixed(2)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp96141ExcursionDepthOffsetLedgerTableViz() {
  const data = IMP96108_NUMBER_VARIANCE_EXCURSION_DEPTH_VS_MAX_ANCHOR;
  const { anchors, measuredRows, nearestUnmeasuredApproach, deepestMeasuredExcursion, deadZoneBottom } = data;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="imp-96108: Excursion-Depth-vs-Max-Anchor Offset Ledger" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 760,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a reader-facing table of the
        imp-96108 offset-space ledger, tabulating per-height offset(T), the offset headroom below the
        max anchor C0_max, and the excursion depth d_reach(T) needed to lift the mean cap up to the max
        cap at that height. It changes no Lambda bound and establishes no operator positivity.
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The max offset anchor C0_max&nbsp;=&nbsp;{anchors.C0_max.toFixed(6)} is the offset AT
        T&nbsp;=&nbsp;{anchors.maxAnchorHeight.toExponential(1)}, so that row saturates the cap (gap
        0) by construction. The nearest unmeasured (held-out) approach is T&nbsp;=
        &nbsp;{nearestUnmeasuredApproach.Tc.toExponential(1)}, gap&nbsp;
        {nearestUnmeasuredApproach.offsetGapBelowMax.toFixed(6)} offset units&nbsp;=&nbsp;the imp-96090
        +{nearestUnmeasuredApproach.maxCapMarginRelPct.toFixed(2)}% margin.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Per-height offset ledger (6 fit + 5 held-out)
      </h3>
      <OffsetLedgerTable rows={measuredRows} />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Window-bottom dead-zone (T = {deadZoneBottom.Tc.toExponential(1)}):</strong> the
        max-cap ratio r_cap<sup>max</sup>&nbsp;=&nbsp;{deadZoneBottom.rCapMax.toFixed(5)}, a margin of{' '}
        {deadZoneBottom.marginBelowOne.toFixed(3)} below 1. Reaching r&nbsp;=&nbsp;1 there would need an
        offset of {deadZoneBottom.offsetToReachOne.toFixed(4)}&nbsp;=&nbsp;
        {deadZoneBottom.offsetToReachOneInC0MaxUnits.toFixed(2)}&times;C0_max, far beyond any excursion
        on the observed &sim;0.33 offset scale (d_reach there is{' '}
        {deadZoneBottom.depthToReachMaxCapPct.toFixed(1)}%, in line with the per-height column above).
        The deepest measured excursion (T&nbsp;=&nbsp;
        {deepestMeasuredExcursion.Tc.toExponential(1)}) saturates the max cap exactly (residual 0),
        overshooting the mean cap by {deepestMeasuredExcursion.depthOverMeanCapPct.toFixed(1)}%.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96108
        baked ledger verbatim (no re-derivation of the Selberg-subtracted offset or the Odlyzko-fitted
        sd(C&nbsp;&minus;&nbsp;E) literals). Changes no bound, establishes no operator positivity, no
        RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
