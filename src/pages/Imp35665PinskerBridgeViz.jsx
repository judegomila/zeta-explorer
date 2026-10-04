import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import {
  IMP35665_ROWS,
  IMP35665_ECOLL_CROSS,
  IMP35665_RAW_RATIO,
} from '../data/imp-35665-pinsker-common-functional-bridge-viz-data.js';

// Table of the three KL fits, their Pinsker TV upper bounds, and the E_coll-multiple ratios.
function PinskerTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', fontFamily: 'monospace' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>KL fit</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>KL (g_true)</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>TV &le; sqrt(KL/2)</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>TV upper bound / E_coll</th>
        </tr>
      </thead>
      <tbody>
        {IMP35665_ROWS.map((row) => (
          <tr key={row.key} style={{ borderBottom: '1px solid color-mix(in srgb, var(--rule) 50%, transparent)' }}>
            <td style={{ padding: '0.4rem 0.6rem', color: 'var(--series-1)' }}>{row.label}</td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: 'var(--ink)' }}>
              {row.kl.toExponential(4)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: 'var(--ink)' }}>
              {row.tvUpperBound.toExponential(4)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: 'var(--series-2)' }}>
              {row.tvUbOverEcoll.toFixed(1)}x
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp35665PinskerBridgeViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Pinsker Common-Functional Bridge: an Upper Bound Only (imp-35665 / imp-35556)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35556 assessed whether the imp-35530 g_true (a KL divergence, second-order in the
        spacing-pdf deviation) and the surrogate E_coll (a first-order amplitude, E_coll ={' '}
        {IMP35665_ECOLL_CROSS.toExponential(3)} at the crossover) are dimensionally comparable. The
        Pinsker inequality TV(p_emp, p_GUE) &le; sqrt(KL/2) reduces the quadratic KL to a
        first-order total-variation amplitude that shares E_coll&apos;s order. The table below
        shows the three KL fits and the resulting TV upper bounds.
      </p>

      <PinskerTable />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem' }}>
        The raw KL/E_coll ratio at the crossover is {IMP35665_RAW_RATIO.toFixed(2)}x (the imp-35530
        figure). Under the Pinsker reduction that multiplier changes completely -- to{' '}
        {IMP35665_ROWS[0].tvUbOverEcoll.toFixed(1)}x, {IMP35665_ROWS[1].tvUbOverEcoll.toFixed(1)}x,
        and {IMP35665_ROWS[2].tvUbOverEcoll.toFixed(1)}x across the three fits -- showing the
        ~10.5x is not preserved under any common-functional reduction.
      </p>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--brass-deco) 6%, transparent)',
          borderLeft: '3px solid var(--brass-deco)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        <strong style={{ color: 'var(--brass)' }}>UPPER BOUND ONLY:</strong> sqrt(KL/2) upper-bounds the
        total-variation deviation TV; it does NOT lower-bound the true deviation. So this bridge
        cannot certify the direction g_true &gt; E_coll, let alone the ~10.5x gap magnitude. The
        only dimension-robust reading is that E_coll sits well inside the admissible band{' '}
        [0, {IMP35665_ROWS[0].tvUpperBound.toExponential(3)}] the projected KL permits -- consistent
        with, but not proof of, the surrogate under-stating the true deviation. A lower bound needs
        the OPEN surrogate-to-observable dictionary (imp-35337a).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Measurement only:</strong> viz-data only, re-exporting
        the imp-35556 Pinsker-bridge literals verbatim; no new derivation, no bound changed.
        Discharges nothing: imp-35556a (no in-repo common functional lower-bounding E_coll from KL)
        and imp-35337a stay OPEN; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound;
        establishes no operator positivity; no RH verdict, NO QED.
      </div>

      <RelatedLinks
        links={[
          { to: '/viz-imp35663-decade-span-growth', label: 'imp-35663 Decade-Span Growth' },
          {
            to: '/viz-imp35664-fartail-crossing-height-map-sensitivity',
            label: 'imp-35664 Far-Tail-Crossing Height-Map Sensitivity',
          },
          {
            to: '/viz-imp35561-peak-height-map-sensitivity',
            label: 'imp-35561 Peak Height-Map Sensitivity',
          },
        ]}
      />
    </div>
  );
}
