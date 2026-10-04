import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35587_ARM_TABLE,
  IMP35587_CONSTANTS,
  IMP35587_CUBIC,
  IMP35587_CROSS_CHECK,
  IMP35587_SUMMARY,
} from '../data/imp-35587-arm-asymmetry-viz-data.js';

// Table of the four tol rows: imbalance (W_rise - W_fall) and the width ratio, narrowing toward 0 / 1.
function AsymmetryTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', fontFamily: 'monospace' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>tol</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>W_rise (dec)</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>W_fall (dec)</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>W_rise - W_fall</th>
          <th style={{ textAlign: 'right', padding: '0.4rem 0.6rem', color: 'var(--ink-soft)' }}>ratio</th>
        </tr>
      </thead>
      <tbody>
        {IMP35587_ARM_TABLE.map((row) => (
          <tr key={row.tol} style={{ borderBottom: '1px solid color-mix(in srgb, var(--rule) 50%, transparent)' }}>
            <td style={{ padding: '0.4rem 0.6rem', color: 'var(--series-1)' }}>{row.tol.toExponential(0)}</td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: 'var(--ink)' }}>
              {row.w_rise_decades.toFixed(6)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: 'var(--ink)' }}>
              {row.w_fall_decades.toFixed(6)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: 'var(--ink)' }}>
              +{row.imbalance_decades.toExponential(3)}
            </td>
            <td style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: 'var(--ink)' }}>
              {row.ratio.toFixed(5)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Simple horizontal bar readout of the ratio approaching 1, scaled to the [1, ratioHi] span.
function RatioBars() {
  const span = IMP35587_SUMMARY.ratioHi - 1 || 1;
  return (
    <div style={{ marginTop: '1rem' }}>
      {IMP35587_ARM_TABLE.map((row) => {
        const pct = Math.max(2, ((row.ratio - 1) / span) * 100);
        return (
          <div key={row.tol} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span style={{ width: 56, fontSize: '0.78rem', color: 'var(--ink-soft)', fontFamily: 'monospace' }}>
              {row.tol.toExponential(0)}
            </span>
            <div style={{ flex: 1, background: 'color-mix(in srgb, var(--paper-3) 35%, transparent)', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${pct}%`,
                  background: 'var(--series-1)',
                  height: 14,
                }}
              />
            </div>
            <span style={{ width: 78, textAlign: 'right', fontSize: '0.78rem', color: 'var(--ink)', fontFamily: 'monospace' }}>
              {row.ratio.toFixed(5)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Imp35587ArmAsymmetryViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Peak Arm Asymmetry: W_rise - W_fall and the Width Ratio (imp-35587 / imp-35451)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35337/imp-3406 interior sigma-share peak (sigma_max ={' '}
        {IMP35587_CONSTANTS.sigma_max.toFixed(8)} at log10 N_max ={' '}
        {IMP35587_CONSTANTS.log10_N_max.toFixed(5)}) is NOT symmetric about its own peak: the
        rising (low-N) plateau arm reaches further than the falling (high-N) arm at every depth
        tol. This is produced by a NEGATIVE cubic-skew coefficient c3 ={' '}
        {IMP35587_CUBIC.c3_cubic_coefficient.toExponential(4)}, measured directly by a 5-point
        third-difference stencil and cross-checked against the arm-imbalance slope to{' '}
        {IMP35587_CROSS_CHECK.rel_agreement.toExponential(1)} relative.
      </p>

      <AsymmetryTable />

      <h3 style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.5rem', marginBottom: '0.3rem' }}>
        Width ratio W_rise / W_fall, decaying toward 1
      </h3>
      <RatioBars />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '1.25rem' }}>
        The signed imbalance W_rise - W_fall spans [{IMP35587_SUMMARY.imbalanceLo.toExponential(2)},{' '}
        {IMP35587_SUMMARY.imbalanceHi.toExponential(2)}] decades across the four tols and scales
        LINEARLY in tol, while the width ratio narrows from{' '}
        {IMP35587_SUMMARY.ratioHi.toFixed(5)} (tol = 1e-4) to {IMP35587_SUMMARY.ratioLo.toFixed(5)}{' '}
        (tol = 1e-7) -- the skew VANISHES relative to the plateau width as sqrt(tol) &rarr; 0, even
        though the absolute imbalance shrinks only linearly.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Measurement only:</strong> viz-data only, re-exporting
        the imp-35451 arm_asymmetry table and cubic-skew cross-check verbatim; no new derivation,
        no bound changed. Discharges nothing: the imp-35337a surrogate-vs-true fidelity sub-gap
        stays OPEN; the C_C = (1/8)&nbsp;sqrt(3&nbsp;pi) ansatz (imp-2642/imp-2643) and
        E_trunc = 3.06e-5 (imp-2631) are UNTOUCHED; changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
