import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { ROUTE_BD_ONLINE_MARGIN_FLOOR_EXTENDED } from '../data/imp-96167-route-bd-online-margin-floor-extended.js';

const cellStyle = { textAlign: 'right', padding: '0.4rem 0.6rem' };
const headStyle = { ...cellStyle, color: '#94a3b8' };

function ColumnTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: '#cbd5e1' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #334155' }}>
          {['stage', 'T', 'near-collisions', 'rho(32,T)'].map((h) => (
            <th key={h} style={headStyle}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={`${r.stage}-${r.T}`} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ ...cellStyle, textAlign: 'left', color: '#e2e8f0' }}>{r.stage}</td>
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
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: '#cbd5e1' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #334155' }}>
          {['law', 'fitted params', 'R²', 'reading'].map((h) => (
            <th key={h} style={h === 'law' ? { ...headStyle, textAlign: 'left' } : headStyle}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.law} style={{ borderBottom: '1px solid #1e293b' }}>
            <td style={{ ...cellStyle, textAlign: 'left', color: '#e2e8f0' }}>{r.law}</td>
            <td style={cellStyle}>{r.params}</td>
            <td style={cellStyle}>{r.R2.toFixed(5)}</td>
            <td style={{ ...cellStyle, textAlign: 'left', color: '#64748b' }}>{r.extra}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp96199RouteBDMarginColumnGamma500TableViz() {
  const D = ROUTE_BD_ONLINE_MARGIN_FLOOR_EXTENDED;
  const columnRows = [
    ...D.validation.bakedT.map((T, i) => ({ stage: 'imp-96148 baked', T, rho: D.validation.bakedRho[i] })),
    ...D.extendedT.map((T, i) => ({ stage: 'imp-96167 extension', T, numCollisions: D.extendedNumCollisions[i], rho: D.extendedRho[i] })),
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <PageHeader title="imp-96167: Worst-Support On-Line Margin ρ(32,T) — 11-Point Column to γ₅₀₀" />

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
        imp-96167 measurement, which extends the worst-support (N=32) on-line signed-force margin
        column rho(32,T) from gamma_200 (T~396, imp-96148) to gamma_500 (T~811) and re-fits both
        candidate laws on the full 11-point column. It changes no Lambda bound and establishes no
        operator positivity. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. This
        reading was later partly corrected by imp-96186 (extension to gamma_1000): see the note
        below. NO QED.
      </div>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Full 11-point column (imp-96148 baked + imp-96167 extension)
      </h3>
      <ColumnTable rows={columnRows} />

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        Both laws re-fit on the full column
      </h3>
      <RefitTable refit={D.refit} />

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
        <strong style={{ color: '#94a3b8' }}>Reading the tables:</strong> on the 11-point column,
        the reciprocal-log-with-floor law (R&sup2;=0.99483) fits strictly better than the log-linear
        law (R&sup2;=0.96691), and the R&sup2; gap widens relative to the seven-point imp-96148
        column (0.02792 vs 0.02406). The fitted floor rises slightly from 0.14256 to 0.16030 rather
        than drifting toward zero, and the log-linear naive crossing recedes from T~93297 to
        T~347017 &mdash; the signature of an extrapolation artifact. Deepening the census further
        (imp-96186, gamma_1000) later showed the floor is non-monotone (0.16030 &rarr; 0.11063) and
        the R&sup2; gap collapses (0.02792 &rarr; 0.00214), so the "settled positive asymptote"
        reading recorded here did not survive extension &mdash; only the strictly-positive sign
        (no zero-crossing) stayed stable.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-96167
        baked column and refit literals verbatim (no re-derivation). Changes no bound, establishes no
        operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
