import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY } from '../data/imp-35194-background-field-sup-n-uniformity.js';
import { ED } from '../styles/tokens.js';

const D = IMP35194_BACKGROUND_FIELD_SUP_N_UNIFORMITY;
const ROWS = D.fractionTable; // ordered widest -> tightest min-gap fraction (0.5 -> 0.05)
const N_KEYS = ['N50', 'N100', 'N200'];
const N_COLORS = { N50: ED.series1, N100: ED.series5, N200: ED.series7 };

// Chart 1: beta(N) vs. min-gap fraction, log-log axes, three near-overlapping lines (N-uniformity).
function BetaChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 20;
  const padT = 34;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = 240;
  const svgH = padT + plotH + padB;

  const xMin = Math.log10(0.04);
  const xMax = Math.log10(0.6);
  const yMin = Math.log10(2);
  const yMax = Math.log10(30);
  const xOf = (frac) => padL + ((Math.log10(frac) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [0.05, 0.1, 0.25, 0.5];
  const yTicks = [2, 5, 10, 20, 30];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 14} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        beta(N) vs. min-gap fraction (log-log), N = 50, 100, 200
      </text>

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((t) => (
        <text key={t} x={xOf(t)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {t}
        </text>
      ))}

      {N_KEYS.map((key) => {
        const path = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.fraction)} ${yOf(r.beta[key])}`).join(' ');
        return (
          <g key={key}>
            <path d={path} fill="none" stroke={N_COLORS[key]} strokeWidth={2} opacity={0.85} />
            {ROWS.map((r) => (
              <circle key={r.fraction} cx={xOf(r.fraction)} cy={yOf(r.beta[key])} r={2.5} fill={N_COLORS[key]} />
            ))}
          </g>
        );
      })}

      {N_KEYS.map((key, i) => (
        <text key={key} x={padL + plotW - 96} y={padT + 12 + i * 13} fill={N_COLORS[key]} fontSize={9.5} fontWeight={700}>
          {key.replace('N', 'N=')}
        </text>
      ))}
    </svg>
  );
}

// Chart 2: beta * g_min product vs. min-gap fraction, decreasing toward the front (beta ~ 1/g_min).
function ProductChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 20;
  const padT = 34;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = 180;
  const svgH = padT + plotH + padB;

  const xMin = Math.log10(0.04);
  const xMax = Math.log10(0.6);
  const yMin = 1.0;
  const yMax = 1.4;
  const xOf = (frac) => padL + ((Math.log10(frac) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [0.05, 0.1, 0.25, 0.5];
  const yTicks = [1.0, 1.1, 1.2, 1.3, 1.4];
  const path = ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.fraction)} ${yOf(r.product)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 14} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        beta * g_min vs. min-gap fraction (front-coupling band, N = {D.frontGrowth.headlineN})
      </text>

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(1)}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((t) => (
        <text key={t} x={xOf(t)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {t}
        </text>
      ))}

      <path d={path} fill="none" stroke={ED.series3} strokeWidth={2.25} />
      {ROWS.map((r) => (
        <circle key={r.fraction} cx={xOf(r.fraction)} cy={yOf(r.product)} r={2.75} fill={ED.series3} />
      ))}
      <text x={padL + 10} y={padT + 14} fill={ED.series3} fontSize={9.5} fontWeight={700}>
        beta * g_min &rarr; ~1 toward the front
      </text>
    </svg>
  );
}

export default function Imp35233BetaFrontLawNUniformityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Background-Field Sup: N-Uniformity vs. Front-Growth (imp-35233 / imp-35194)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.finding} This page plots the two findings side by side: beta(N) collapses onto a single
        curve across N&nbsp;=&nbsp;50,&nbsp;100,&nbsp;200 at matched min-gap fraction (top), while the
        product beta&nbsp;*&nbsp;g_min narrows from ~{D.frontGrowth.productWidest} toward
        ~{D.frontGrowth.productTightest} as the fraction shrinks toward the collision front (bottom),
        the signature of beta&nbsp;~&nbsp;1/g_min.
      </p>

      <BetaChart />
      <div style={{ height: '1.25rem' }} />
      <ProductChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>min-gap fraction</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>beta(N=50)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>beta(N=100)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>beta(N=200)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rel. spread</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>beta * g_min</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.fraction} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.fraction}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.beta.N50}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.beta.N100}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.beta.N200}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {(r.relSpreadAcrossN * 100).toFixed(2)}%
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.product}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-35194 measured fraction table verbatim (no new computation). MEASUREMENT ONLY,
        frontier-diagnostic probe of the imp-35167 M2 background-field-sup obstruction; does NOT
        certify N-uniformity over the full trajectory (the sup diverges as g_min&nbsp;&rarr;&nbsp;0);
        M5 horizon-front mismatch stays OPEN; imp-2563 sandwich untouched (valid CONDITIONAL bracket);
        C_mb GUE-conditional per imp-486 untouched; changes no bound, establishes no operator
        positivity, no RH verdict, NO QED.
      </div>
    </div>
  );
}
