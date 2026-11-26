import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA1000 } from '../data/imp-96186-route-bd-online-margin-floor-gamma1000.js';
import { ED } from '../styles/tokens.js';

const cellStyle = { textAlign: 'right', padding: '0.4rem 0.6rem' };
const headStyle = { ...cellStyle, color: ED.inkSoft };

function ColumnTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--ink)' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--rule)' }}>
          {['stage', 'T', 'near-collisions', 'rho(32,T)'].map((h) => (
            <th key={h} style={headStyle}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={`${r.stage}-${r.T}`} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ ...cellStyle, textAlign: 'left', color: 'var(--ink)' }}>{r.stage}</td>
            <td style={cellStyle}>{r.T}</td>
            <td style={cellStyle}>{r.numCollisions ?? '—'}</td>
            <td style={cellStyle}>{r.rho.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RefitTable({ refit }) {
  const rows = [
    {
      law: 'log-linear: rho = a + b ln T',
      params: `a=${refit.logLinear.a}, b=${refit.logLinear.b}`,
      R2: refit.logLinear.R2,
      extra: `naive crossing T~${refit.logLinear.naiveCrossT.toLocaleString()}`,
    },
    {
      law: 'reciprocal-log: rho = c + d/ln T',
      params: `c=${refit.reciprocalLogFloor.c}, d=${refit.reciprocalLogFloor.d}`,
      R2: refit.reciprocalLogFloor.R2,
      extra: `fitted floor c=${refit.reciprocalLogFloor.floor}`,
    },
  ];
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--ink)' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--rule)' }}>
          {['law', 'fitted params', 'R²', 'reading'].map((h) => (
            <th key={h} style={h === 'law' ? { ...headStyle, textAlign: 'left' } : headStyle}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.law} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ ...cellStyle, textAlign: 'left', color: 'var(--ink)' }}>{r.law}</td>
            <td style={cellStyle}>{r.params}</td>
            <td style={cellStyle}>{r.R2.toFixed(5)}</td>
            <td style={{ ...cellStyle, textAlign: 'left', color: 'var(--ink-faint)' }}>{r.extra}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HistoryTable({ floorByDepth, r2GapByDepth }) {
  const depths = ['gamma200', 'gamma500', 'gamma1000'];
  const labels = { gamma200: 'γ₂₀₀ (T~396)', gamma500: 'γ₅₀₀ (T~811)', gamma1000: 'γ₁₀₀₀ (T~1419)' };
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--ink)' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--rule)' }}>
          {['census depth', 'fitted floor c', 'R² gap (recip - loglin)'].map((h) => (
            <th key={h} style={h === 'census depth' ? { ...headStyle, textAlign: 'left' } : headStyle}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {depths.map((d) => (
          <tr key={d} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ ...cellStyle, textAlign: 'left', color: 'var(--ink)' }}>{labels[d]}</td>
            <td style={cellStyle}>{floorByDepth[d]}</td>
            <td style={cellStyle}>{r2GapByDepth[d]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp96216RouteBDMarginColumnGamma1000TableViz() {
  const D = ROUTE_BD_ONLINE_MARGIN_FLOOR_GAMMA1000;
  const columnRows = [
    ...D.validation.bakedT.map((T, i) => ({ stage: 'imp-96148 baked', T, rho: D.validation.bakedRho[i] })),
    ...D.validation.prevExtT.map((T, i) => ({ stage: 'imp-96167 extension', T, rho: D.validation.prevExtRho[i] })),
    ...D.extendedT.map((T, i) => ({ stage: 'imp-96186 extension', T, numCollisions: D.extendedNumCollisions[i], rho: D.extendedRho[i] })),
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="imp-96186: Worst-Support On-Line Margin ρ(32,T) — 17-Point Column to γ₁₀₀₀" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a reader-facing table of the
        imp-96186 measurement, which extends the worst-support (N=32) on-line signed-force margin
        column rho(32,T) from gamma_500 (T~811, imp-96167) to gamma_1000 (T~1419) and re-fits both
        candidate laws on the full 17-point column. It changes no Lambda bound and establishes no
        operator positivity. NO QED.
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Full 17-point column (baked + imp-96167 extension + imp-96186 extension)
      </h3>
      <ColumnTable rows={columnRows} />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Both laws re-fit on the full column
      </h3>
      <RefitTable refit={D.refit} />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Floor / R&sup2; gap history across census depth
      </h3>
      <HistoryTable floorByDepth={D.refit.floorByDepth} r2GapByDepth={D.refit.r2GapByDepth} />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the tables:</strong> deepening the census from
        gamma_500 to gamma_1000 does NOT continue the imp-96167 trend. The fitted floor is
        non-monotone (0.14256 &rarr; 0.16030 &rarr; 0.11063) and the R&sup2; gap between the two laws
        COLLAPSES (0.02406 &rarr; 0.02792 &rarr; 0.00214), so at gamma_1000 the reciprocal-log-floor
        and log-linear laws are almost statistically indistinguishable. What is unchanged: the
        measured margin stays strictly positive out to T~1419 (rho=0.4580) with no crossing, and the
        genuine uniform-in-T obstruction stays OFF the line (Weil-positivity strength), inaccessible
        to this on-line construction.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96186
        baked column and refit literals verbatim (no re-derivation). Changes no bound, establishes no
        operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
