import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95540_ALPHA_OVER_ONE_FRACTION_TABLE } from '../data/imp-95540-alpha-over-one-fraction-table.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP95540_ALPHA_OVER_ONE_FRACTION_TABLE;
const ROWS = DATA.rows;

// Bar chart: alpha > 1 majorant-mass fraction (percent) at each of the 25
// sieving primes p <= 97. This fraction is N-independent (pure combinatorics
// of h/p vs 1/(2 pi)), so it is a single flat column, not a curve over N.
// p <= 5 is exempt (fraction = 0); p >= 7 sits in a 35%-59% band.
function OverOneFractionBarChart() {
  const svgW = 760;
  const padL = 44;
  const padR = 16;
  const padT = 22;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const maxPct = Math.max(...ROWS.map((r) => r.overOnePercent)) * 1.12;
  const yOf = (v) => padT + plotH - (v / maxPct) * plotH;
  const slot = plotW / ROWS.length;
  const barW = slot * 0.62;

  const yTicks = [0, 15, 30, 45, 60];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <line
          key={`g${v}`}
          x1={padL}
          y1={yOf(v)}
          x2={padL + plotW}
          y2={yOf(v)}
          stroke={ED.ruleSoft}
          strokeWidth={1}
        />
      ))}
      {yTicks.map((v) => (
        <text key={`t${v}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}%
        </text>
      ))}
      {ROWS.map((r, i) => {
        const cx = padL + slot * (i + 0.5);
        const h = plotH - (yOf(r.overOnePercent) - padT);
        return (
          <g key={r.p}>
            <rect
              x={cx - barW / 2}
              y={yOf(r.overOnePercent)}
              width={barW}
              height={Math.max(h, 0.5)}
              fill={r.exempt ? '#475569' : ED.series1}
            />
            <text
              x={cx}
              y={padT + plotH + 14}
              textAnchor="middle"
              fill={ED.inkFaint}
              fontSize={8.5}
              transform={`rotate(-55 ${cx} ${padT + plotH + 14})`}
            >
              {r.p}
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        sieving prime p
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        alpha &gt; 1 majorant-mass share
      </text>
    </svg>
  );
}

// Line chart: alpha_max(p) = alpha_{1,p-1} at the two window endpoints
// N = 690988 (blue) and N = 54799999 (green). Only this endpoint value moves
// with N; it stays above the alpha = 1 line (red dashed) across every prime
// and across the whole window, so no alias crosses alpha = 1 as N varies.
function AlphaMaxEndpointsChart() {
  const svgW = 760;
  const padL = 50;
  const padR = 16;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = 180;
  const svgH = padT + plotH + padB;

  const allVals = ROWS.flatMap((r) => [r.alphaMaxLo, r.alphaMaxHi]);
  const top = Math.max(...allVals) + 0.006;
  const bot = Math.min(1, ...allVals) - 0.006;
  const yOf = (v) => padT + ((top - v) / (top - bot)) * plotH;
  const slot = plotW / ROWS.length;
  const xOf = (i) => padL + slot * (i + 0.5);

  const loPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${yOf(r.alphaMaxLo)}`).join(' ');
  const hiPath = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${yOf(r.alphaMaxHi)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line
        x1={padL}
        y1={yOf(1)}
        x2={padL + plotW}
        y2={yOf(1)}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={padL + 4} y={yOf(1) - 5} fill={ED.series2} fontSize={9}>
        alpha = 1
      </text>
      <path d={loPath} fill="none" stroke={ED.series1} strokeWidth={2} />
      <path d={hiPath} fill="none" stroke={ED.series3} strokeWidth={2} strokeDasharray="6 3" />
      {ROWS.map((r, i) => (
        <g key={r.p}>
          <circle cx={xOf(i)} cy={yOf(r.alphaMaxLo)} r={2.6} fill={ED.series1} />
          <circle cx={xOf(i)} cy={yOf(r.alphaMaxHi)} r={2.6} fill={ED.series3} />
          <text
            x={xOf(i)}
            y={padT + plotH + 14}
            textAnchor="middle"
            fill={ED.inkFaint}
            fontSize={8.5}
            transform={`rotate(-55 ${xOf(i)} ${padT + plotH + 14})`}
          >
            {r.p}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        sieving prime p
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        alpha_max(p)
      </text>
    </svg>
  );
}

export default function Imp95565AlphaOverOneMajorantMassFractionViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="alpha > 1 Majorant-Mass Fraction Across All 25 Sieving Primes (imp-95540)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement-only
        page tabulating the imp-95540 record, which extends the imp-95519 section 4
        spot sample to all 25 sieving primes. Changes no bound. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The alpha &gt; 1 condition k &minus; h/p &lt; 1/(2&pi;) is N-independent
        combinatorics of h/p vs 1/(2&pi;), so the majorant-mass fraction share_p carried
        by those aliases is a single N-flat column: 0% for p &le; 5 and 35.09%&ndash;59.49%
        for every p &ge; 7. Only alpha_max(N) &#61; alpha_{'{1,p-1}'}(N) moves with N,
        staying above 1 across the whole window {DATA.window.N_LO}..{DATA.window.N_HI},
        so no alias crosses alpha &#61; 1 as N varies.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        alpha &gt; 1 majorant-mass share by prime (gray = exempt, p &le; 5)
      </h3>
      <OverOneFractionBarChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        alpha_max(p) at the window endpoints &mdash; N = {DATA.window.N_LO} (blue) vs
        N = {DATA.window.N_HI} (green dashed), alpha = 1 line in red
      </h3>
      <AlphaMaxEndpointsChart />

      <table style={{ width: '100%', fontSize: '0.75rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>p</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>threshold h</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>over-one h_min</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>count/total</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>share</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>alpha_max lo</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>alpha_max hi</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>exempt</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.p} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '2px 0' }}>{r.p}</td>
              <td style={{ textAlign: 'right' }}>{r.thresholdH.toFixed(3)}</td>
              <td style={{ textAlign: 'right' }}>{r.hMin === null ? '—' : r.hMin}</td>
              <td style={{ textAlign: 'right' }}>{r.overOneCount}/{r.totalAliases}</td>
              <td style={{ textAlign: 'right' }}>{r.overOnePercent.toFixed(2)}%</td>
              <td style={{ textAlign: 'right' }}>{r.alphaMaxLo.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.alphaMaxHi.toFixed(4)}</td>
              <td style={{ textAlign: 'right', color: r.exempt ? 'var(--ink-soft)' : 'var(--series-3)' }}>{r.exempt ? 'yes' : 'no'}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the bar chart
        confirms the imp-95519 spot sample (47.38% at p = 7, 59.26% at p = 97) but shows
        the full band is wider than the "47-60% for p &ge; 7" quoted there &mdash; the
        measured minimum is 35.09% at p = 11 and the measured maximum is 59.49% at
        p = 89. The line chart shows alpha_max(p) rising toward 1 as p grows (the floor
        alias gets closer to the alpha = 1 line) but never reaching it within the
        window, and shifting down slightly as N grows from 690988 to 54799999 while
        staying strictly above 1 throughout.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        frozen imp-95540 record (import-light, no zeros bundle, no re-derivation of the
        imp-95519 majorant construction). Changes no bound, establishes no operator
        positivity, no RH claim; the zero-side route stays PCC-gated for the p &ge; 7
        primes. NO QED.
      </div>
    </div>
  );
}
