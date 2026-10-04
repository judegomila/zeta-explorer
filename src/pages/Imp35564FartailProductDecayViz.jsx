import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP35564_LADDER,
  IMP35564_SUMMARY,
} from '../data/imp-35564-eflow-fartail-product-decay-viz-data.js';
import { ED } from '../styles/tokens.js';

function LineChart({ series, yFormat, color, yTicks }) {
  const w = 720;
  const h = 260;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const xs = series.map((r) => r.x);
  const ys = series.map((r) => r.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys, ...yTicks);
  const yMax = Math.max(...ys, ...yTicks);
  const yPad = (yMax - yMin) * 0.08 || 1;

  const xPix = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const yPix = (y) => padT + plotH - ((y - (yMin - yPad)) / (yMax - yMin + 2 * yPad)) * plotH;

  const pathD = series
    .map((r, i) => `${i === 0 ? 'M' : 'L'}${xPix(r.x).toFixed(2)},${yPix(r.y).toFixed(2)}`)
    .join(' ');

  return (
    <svg width={w} height={h} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={w - padR} y1={yPix(t)} y2={yPix(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yPix(t) + 4} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
            {yFormat(t)}
          </text>
        </g>
      ))}
      <line x1={padL} x2={w - padR} y1={padT + plotH} y2={padT + plotH} stroke={ED.rule} strokeWidth={1} />
      {series.map((r) => (
        <text key={r.x} x={xPix(r.x)} y={h - 10} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          10^{r.x}
        </text>
      ))}
      <path d={pathD} fill="none" stroke={color} strokeWidth={2} />
      {series.map((r) => (
        <circle key={r.x} cx={xPix(r.x)} cy={yPix(r.y)} r={3} fill={color} />
      ))}
    </svg>
  );
}

export default function Imp35564FartailProductDecayViz() {
  const productSeries = IMP35564_LADDER.map((r) => ({ x: r.log10N, y: r.product }));
  const qSeries = IMP35564_LADDER.map((r) => ({ x: r.log10N, y: r.productExponent }));

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="E_flow Far-Tail Remnant*logN Product Decay Ladder (imp-35564 / imp-35535)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35535 tabulated the fd-vs-analytic remnant*log N product P(N) across N&nbsp;=&nbsp;
        1e26..1e200 on the closed surrogate channel and measured its local decay exponent
        q&nbsp;=&nbsp;d&nbsp;log&nbsp;P&nbsp;/&nbsp;d&nbsp;log&nbsp;x (x&nbsp;=&nbsp;log&nbsp;N).
        A nonzero log-floor (remnant&nbsp;~&nbsp;c/log&nbsp;N) would pin P&nbsp;-&gt;&nbsp;c with
        q&nbsp;-&gt;&nbsp;0; instead both series below show the product falling and q steepening
        away from zero across the full ladder.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Product P(N) = remnant &middot; log N
      </h3>
      <LineChart
        series={productSeries}
        yFormat={(t) => t.toFixed(3)}
        color={ED.series1}
        yTicks={[0.02, 0.03, 0.04, 0.05, 0.06]}
      />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.9rem', margin: '1.75rem 0 0.5rem' }}>
        Local decay exponent q = d log P / d log x
      </h3>
      <LineChart
        series={qSeries}
        yFormat={(t) => t.toFixed(2)}
        color={ED.series7}
        yTicks={[-0.8, -0.6, -0.4, -0.2, 0]}
      />

      <table
        style={{
          width: '100%',
          marginTop: '2rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>remnant</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>product P(N)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>q</th>
          </tr>
        </thead>
        <tbody>
          {IMP35564_LADDER.map((row) => (
            <tr key={row.log10N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>10^{row.log10N}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.remnant.toExponential(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.product.toFixed(6)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {row.productExponent.toFixed(5)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        Across all {IMP35564_SUMMARY.rungCount} rungs the product falls monotonically from{' '}
        {IMP35564_SUMMARY.productAt1e26.toFixed(6)} (N=1e26) to{' '}
        {IMP35564_SUMMARY.productAt1e200.toFixed(6)} (N=1e200) -- a{' '}
        {IMP35564_SUMMARY.dropFactor.toFixed(2)}x drop over 174 decades -- while q steepens
        monotonically from ~{IMP35564_SUMMARY.qAt1e26.toFixed(3)} toward ~
        {IMP35564_SUMMARY.qAt1e200.toFixed(3)}, pulling away from 0 rather than relaxing toward it.
        No nonzero log-floor appears through N=1e200.
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
        the imp-35535 ladder verbatim; no new derivation, no bound changed. Measurement only on the
        inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no
        bound, establishes no operator positivity, no RH verdict, NO QED.
      </div>
    </div>
  );
}
