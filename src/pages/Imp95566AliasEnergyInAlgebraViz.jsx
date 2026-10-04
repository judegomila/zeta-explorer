import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP_95539_ALIAS_ENERGY_IN_ALGEBRA } from '../data/imp-95539-alias-energy-in-algebra-table.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP_95539_ALIAS_ENERGY_IN_ALGEBRA;
const ROWS = DATA.table;

// Stacked bar chart: in-algebra energy fraction (blue, bottom) vs the
// complementary leak-outside fraction (gray, top) for each alias a | P,
// ordered by gcd(a,P) ascending (q = P/gcd(a,P) descending). The bars sum to
// 1 by construction; only their split point moves across the sweep.
function StackedEnergyBarChart() {
  const svgW = 760;
  const padL = 44;
  const padR = 16;
  const padT = 22;
  const padB = 54;
  const plotW = svgW - padL - padR;
  const plotH = 220;
  const svgH = padT + plotH + padB;

  const yOf = (v) => padT + plotH - v * plotH;
  const slot = plotW / ROWS.length;
  const barW = slot * 0.6;

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

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
          {Math.round(v * 100)}%
        </text>
      ))}
      {ROWS.map((r, i) => {
        const cx = padL + slot * (i + 0.5);
        const inTop = yOf(r.inEnergy);
        const inH = plotH + padT - inTop;
        return (
          <g key={r.a}>
            <rect
              x={cx - barW / 2}
              y={inTop}
              width={barW}
              height={Math.max(inH, 0.5)}
              fill={ED.series1}
            />
            <rect
              x={cx - barW / 2}
              y={padT}
              width={barW}
              height={Math.max(inTop - padT, 0.5)}
              fill="#475569"
            />
            <text
              x={cx}
              y={padT + plotH + 14}
              textAnchor="middle"
              fill={ED.inkFaint}
              fontSize={8.5}
              transform={`rotate(-45 ${cx} ${padT + plotH + 14})`}
            >
              a={r.a}
            </text>
            <text
              x={cx}
              y={padT + plotH + 27}
              textAnchor="middle"
              fill={ED.inkFaint}
              fontSize={8}
              transform={`rotate(-45 ${cx} ${padT + plotH + 27})`}
            >
              q={r.q}
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        alias a (increasing gcd(a,P), decreasing q)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        energy share
      </text>
    </svg>
  );
}

export default function Imp95566AliasEnergyInAlgebraViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Alias Energy In-Algebra vs Leak-Outside, Across gcd(a,P) (imp-95539)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a numeric
        verification page tabulating the imp-95539 record (Theorem U, perm-arch
        line 44). Not a bound. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state
        of the art. RH open. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        A single alias e(an/P) with P = {DATA.P} (= 2&middot;3&middot;5&middot;7&middot;11&middot;13)
        has energy fraction 1/&phi;(q) inside the sieve algebra S = span{'{c_q : q|P}'},
        q = P/gcd(a,P), verified numerically to &lt; 1e-9 for every row below. The
        remaining 1 &minus; 1/&phi;(q) is character content the algebra cannot see.
        As gcd(a,P) grows the alias approaches a small-modulus character, q shrinks,
        and the in-algebra share rises from 1.736e-4 (a coprime to P, q = 30030) to
        1.0 (q = 2, where e(n/2) = (&minus;1)^n is itself c_2).
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        In-algebra energy (blue) vs leak-outside (gray) by alias a
      </h3>
      <StackedEnergyBarChart />

      <table style={{ width: '100%', fontSize: '0.75rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>a</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>gcd(a,P)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>q = P/gcd</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>phi(q)</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>in-algebra</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>leak-outside</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.a} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '2px 0' }}>{r.a}</td>
              <td style={{ textAlign: 'right' }}>{r.g}</td>
              <td style={{ textAlign: 'right' }}>{r.q}</td>
              <td style={{ textAlign: 'right' }}>{r.phiQ}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-1)' }}>{(r.inEnergy * 100).toPrecision(4)}%</td>
              <td style={{ textAlign: 'right', color: 'var(--ink-soft)' }}>{(r.leakOutside * 100).toPrecision(4)}%</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> {DATA.reading}
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
        frozen imp-95539 record (import-light, no zeros bundle, no re-derivation of the
        Ramanujan-sum projection). Changes no bound, establishes no operator positivity,
        no RH claim. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
