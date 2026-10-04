import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34526_DRIFT_LOWN } from '../data/imp-34526-slowlog-drift-lown-crossover-tabulation.js';
import { ED } from '../styles/tokens.js';

const { drift_ladder, excess_deep_tail, excess_assembly } = IMP34526_DRIFT_LOWN;

// -- Self-contained reproduction of the imp-34446/imp-34486 height-inversion primitive (imports
// -- NOTHING -- no zeros bundle), used only to attach a log T0 x-coordinate to each imp-34526
// -- ladder landmark (which is tabulated by N, not by T0), per imp-34542.
const TWO_PI = 2 * Math.PI;

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

const POINTS = drift_ladder.map((row) => ({
  ...row,
  logT0: Math.log10(heightForN(row.N)),
}));

function CrossoverExponentChart() {
  const svgW = 680;
  const svgH = 360;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xs = POINTS.map((p) => p.logT0);
  const ys = POINTS.map((p) => p.exponent);

  const xMin = Math.min(...xs) - 0.6;
  const xMax = Math.max(...xs) + 0.6;
  const yMin = Math.min(-2, ...ys) - 0.02;
  const yMax = Math.max(...ys) + 0.02;

  const px = (x) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const py = (y) => padT + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  const pathD = POINTS.map((p, i) => {
    const x = px(p.logT0);
    const y = py(p.exponent);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const asymptoteY = py(-2);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke={ED.rule}
        strokeWidth={1.5}
      />

      {/* -2 asymptote reference line */}
      <line
        x1={padL}
        y1={asymptoteY}
        x2={padL + plotW}
        y2={asymptoteY}
        stroke={ED.series3}
        strokeWidth={1.25}
        strokeDasharray="5,4"
        opacity={0.8}
      />
      <text x={padL + 4} y={asymptoteY - 6} fill={ED.series3} fontSize={9}>
        clean &minus;2 asymptote
      </text>

      <path d={pathD} fill="none" stroke={ED.series1} strokeWidth={2} />
      {POINTS.map((p) => (
        <g key={p.label}>
          <circle cx={px(p.logT0)} cy={py(p.exponent)} r={4} fill={ED.series1} />
          <line
            x1={px(p.logT0)}
            y1={py(p.exponent)}
            x2={px(p.logT0)}
            y2={asymptoteY}
            stroke={ED.series7}
            strokeWidth={1}
            strokeDasharray="2,2"
            opacity={0.55}
          />
        </g>
      ))}

      {/* Annotate the excess x at the low-N and deep-tail ends of the ladder. */}
      <text
        x={px(POINTS[0].logT0) + 8}
        y={py(POINTS[0].exponent) + 4}
        fill={ED.series7}
        fontSize={9}
      >
        x &asymp; {excess_assembly.toFixed(4)}
      </text>
      <text
        x={px(POINTS[POINTS.length - 1].logT0) - 8}
        y={py(POINTS[POINTS.length - 1].exponent) - 10}
        fill={ED.series7}
        fontSize={9}
        textAnchor="end"
      >
        x &asymp; {excess_deep_tail.toFixed(4)}
      </text>

      <text x={padL + plotW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkSoft} fontSize={9.5}>
        log&#8321;&#8320; T0
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        crossover exponent d log N/d log E_coll = &minus;2 + x
      </text>
    </svg>
  );
}

export default function Imp34542CrossoverExponentVsLogT0Viz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Crossover Exponent -2+x vs log T0 (imp-34542)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34446 measured, and imp-34486/imp-34513 derived in closed form, the crossover exponent
        d log N/d log E_coll = &minus;2 + x, where x = &minus;2g/(1&minus;g) with g shrinking as
        log T0 grows. Plotted here against log&#8321;&#8320; T0 across the imp-34526 ladder
        (assembly ceiling N* = 1e6 up through the deep tail N = 1e14), the measured exponent climbs
        toward the clean &minus;2 asymptote as log T0 grows, with the excess x shrinking from{' '}
        {excess_assembly.toFixed(4)} at the low-N end to {excess_deep_tail.toFixed(4)} in the deep
        tail &mdash; a slow-log approach, not a fast one.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        &minus;2+x vs log&#8321;&#8320; T0, with the &minus;2 asymptote and per-landmark excess x
      </p>
      <CrossoverExponentChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>log&#8321;&#8320; T0</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>&minus;2+x</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>excess x</th>
          </tr>
        </thead>
        <tbody>
          {POINTS.map((p) => (
            <tr key={p.label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{p.label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {p.logT0.toFixed(4)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {p.exponent.toFixed(6)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
                {p.excess.toFixed(6)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginTop: '1rem' }}>
        The excess x shrinks monotonically as log T0 grows (imp-34526 F1), so the curve approaches
        the &minus;2 asymptote from above in magnitude but never reaches it at any accessible
        N &mdash; the approach is governed by g = (1&minus;1/log(T0/2&pi;))/log T0, which decays
        only as 1/log T0.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only, reproducing
        the imp-34486/imp-34513/imp-34526 closed form and its tabulated landmarks. The inherited
        component model (imp-3220/imp-3406 extrapolation) is NOT a rigorous asymptotic; the
        &minus;2 asymptote and C_C = (1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED; the
        C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a &ge; 0 untouched; changes
        no bound; no operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
