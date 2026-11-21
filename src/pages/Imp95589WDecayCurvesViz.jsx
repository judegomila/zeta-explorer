import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95557_LITERALS, IMP95557_W_DECAY_SCALING } from '../data/imp-95557-w-decay-scaling.js';
import { ED } from '../styles/tokens.js';

const { tables, lehmerCollisionEps, tightestResolvableW } = IMP95557_LITERALS;

const SERIES = [
  { key: 'dyadic', label: 'dyadic nu=2^k (spread, decelerating)', color: ED.series2 },
  { key: 'arithmetic', label: 'arithmetic nu=1..n (dense)', color: ED.series1 },
  { key: 'geometric15', label: 'geometric r=1.5 (dense)', color: ED.series3 },
];

// log-log-in-y line chart: x = node count n (linear), y = log10(W) (log scale),
// spanning down to the Lehmer collision threshold so the resolvable-vs-threshold
// gap imp-95557 measured is visible directly.
function WDecayChart() {
  const svgW = 640;
  const padL = 56;
  const padR = 16;
  const padT = 20;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const allN = tables.dyadic.map((r) => r.n);
  const nMin = Math.min(...allN);
  const nMax = Math.max(...allN);
  const yTop = 0; // log10(1) = 0
  const yBottom = Math.floor(Math.log10(lehmerCollisionEps)) - 0.5; // ~ -11.5
  const xOf = (n) => padL + ((n - nMin) / (nMax - nMin)) * plotW;
  const yOf = (w) => padT + ((yTop - Math.log10(w)) / (yTop - yBottom)) * plotH;

  const yTicks = [];
  for (let e = 0; e >= yBottom; e -= 2) yTicks.push(e);

  const thresholdY = yOf(lehmerCollisionEps);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((e) => (
        <line key={`g${e}`} x1={padL} y1={padT + ((yTop - e) / (yTop - yBottom)) * plotH} x2={padL + plotW} y2={padT + ((yTop - e) / (yTop - yBottom)) * plotH} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}
      {yTicks.map((e) => (
        <text key={`ty${e}`} x={padL - 6} y={padT + ((yTop - e) / (yTop - yBottom)) * plotH + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {`1e${e}`}
        </text>
      ))}

      <line x1={padL} y1={thresholdY} x2={padL + plotW} y2={thresholdY} stroke={ED.brassDeco} strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={padL + plotW - 4} y={thresholdY - 5} textAnchor="end" fill={ED.brass} fontSize={9}>
        Lehmer collision threshold 1.15e-11
      </text>

      {SERIES.map((s) => {
        const rows = tables[s.key];
        const pts = rows.map((r) => `${xOf(r.n)},${yOf(r.W)}`).join(' ');
        return (
          <g key={s.key}>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth={2} />
            {rows.map((r) => (
              <circle key={r.n} cx={xOf(r.n)} cy={yOf(r.W)} r={2.6} fill={s.color} />
            ))}
          </g>
        );
      })}

      {allN
        .filter((n, i, arr) => arr.indexOf(n) === i)
        .map((n) => (
          <text key={`xn${n}`} x={xOf(n)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {n}
          </text>
        ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        node count n
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        W(S) = mu_S(0) / M1 (log scale)
      </text>

      {SERIES.map((s, i) => (
        <g key={`lg${s.key}`}>
          <rect x={padL + i * 200} y={4} width={10} height={10} fill={s.color} />
          <text x={padL + i * 200 + 14} y={13} fill={ED.inkSoft} fontSize={9}>
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Imp95589WDecayCurvesViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="PD-Persistence Window W(S) Decay Curves vs Node Count (imp-95557)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a
        measurement/presentation-only page rendering the frozen imp-95557
        W(S) decay tables verbatim (no re-derivation). It changes no bound
        and proves no RH-relevant theorem. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95557 tabulated the imp-95531 PD-persistence window
        W(S) = &mu;<sub>S</sub>(0) / M1(S) as the node count n grows, for
        three structured node families. Densely spaced families (arithmetic,
        geometric r=1.5) collapse near-exponentially; the widely spread
        dyadic family (nu = 2<sup>k</sup>) decelerates instead of following a
        single exponential. The dashed gold line marks the Lehmer collision
        threshold 1.15e-11: every curve stays far above it (the tightest
        resolvable value, {tightestResolvableW.toExponential(2)}, is still
        2.4e5&times; the threshold) across the whole range where double
        precision resolves &mu;<sub>S</sub>(0) &gt; 0.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        W(S) vs node count n, by family (log scale)
      </h3>
      <WDecayChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>family</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>n</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>mu_S(0)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>M1</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>W(S)</th>
          </tr>
        </thead>
        <tbody>
          {SERIES.flatMap((s) =>
            tables[s.key].map((r, i) => (
              <tr key={`${s.key}${r.n}`} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
                <td style={{ padding: '3px 0', color: i === 0 ? s.color : 'transparent' }}>{i === 0 ? s.label : ''}</td>
                <td style={{ textAlign: 'right' }}>{r.n}</td>
                <td style={{ textAlign: 'right' }}>{r.mu0.toExponential(4)}</td>
                <td style={{ textAlign: 'right' }}>{r.M1.toExponential(4)}</td>
                <td style={{ textAlign: 'right' }}>{r.W.toExponential(4)}</td>
              </tr>
            ))
          )}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {IMP95557_W_DECAY_SCALING.verdict}
      </div>
    </div>
  );
}
