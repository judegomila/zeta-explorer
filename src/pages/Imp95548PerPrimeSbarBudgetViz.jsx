import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  PER_PRIME_SBAR_BUDGET_ROWS,
  PER_PRIME_SBAR_BUDGET_SUMMARY,
} from '../data/imp-95548-per-prime-sbar-budget-viz-data.js';
import { ED } from '../styles/tokens.js';

function PerPrimeSbarBudgetChart() {
  const rows = PER_PRIME_SBAR_BUDGET_ROWS;
  const { rEx } = PER_PRIME_SBAR_BUDGET_SUMMARY;
  const svgW = 760;
  const svgH = 400;
  const padL = 44;
  const padR = 24;
  const padT = 20;
  const padB = 78;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const yMax = 2.0;
  const yOf = (v) => padT + plotH - (v / yMax) * plotH;
  const barW = plotW / rows.length;
  const xOf = (i) => padL + i * barW + barW / 2;

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  const linePath = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${yOf(r.cumSqrt)}`)
    .join(' ');

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
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <line
            x1={padL}
            y1={yOf(v)}
            x2={padL + plotW}
            y2={yOf(v)}
            stroke={ED.ruleSoft}
            strokeWidth={1}
            strokeDasharray="2 4"
          />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {/* R_ex budget line (compared against the cumulative sqrt-sum overlay) */}
      <line
        x1={padL}
        y1={yOf(rEx)}
        x2={padL + plotW}
        y2={yOf(rEx)}
        stroke={ED.series2}
        strokeWidth={1.75}
        strokeDasharray="6 3"
      />
      <text x={padL + plotW - 4} y={yOf(rEx) - 5} textAnchor="end" fill={ED.series2} fontSize={9}>
        R_ex = {rEx.toFixed(4)}
      </text>

      {/* per-prime S-bar bars */}
      {rows.map((r, i) => {
        const x = padL + i * barW + barW * 0.18;
        const w = barW * 0.64;
        const y = yOf(r.sBar);
        const h = padT + plotH - y;
        return (
          <g key={`bar-${r.p}`}>
            <rect x={x} y={y} width={w} height={h} fill={ED.series1} opacity={0.85} />
            <text
              x={x + w / 2}
              y={padT + plotH + 14}
              textAnchor="end"
              fill={ED.inkSoft}
              fontSize={8}
              transform={`rotate(-55 ${x + w / 2} ${padT + plotH + 14})`}
            >
              {r.p}
            </text>
          </g>
        );
      })}

      {/* cumulative sqrt-sum overlay */}
      <path d={linePath} fill="none" stroke={ED.series4} strokeWidth={2} />
      {rows.map((r, i) => (
        <circle key={`pt-${r.p}`} cx={xOf(i)} cy={yOf(r.cumSqrt)} r={2.4} fill={ED.series4} />
      ))}

      <text x={padL + plotW - 4} y={yOf(rows[rows.length - 1].cumSqrt) - 8} textAnchor="end" fill={ED.series4} fontSize={9}>
        sqrt(sum S-bar) = {rows[rows.length - 1].cumSqrt.toFixed(4)}
      </text>
    </svg>
  );
}

export default function Imp95548PerPrimeSbarBudgetViz() {
  const s = PER_PRIME_SBAR_BUDGET_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Per-Prime S-bar Budget: the l2-Collapse Route vs R_ex = 0.2797" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a reader-facing bar chart
        of the perm-arch section 5(i) small-prime-weld over-budget picture (imp-95541 /
        imp-95536), not a new theorem. It changes no Lambda bound and establishes no operator
        positivity. RH does not
        follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Blue bars are the measured S&#772;<sub>p</sub> weld strength for each of the 25 primes
        p &le; 97 (p = 2 uses the caveatP2-corrected value 0.397, since the odd-p closed form
        returns 0 at p = 2). The orange line is the running cumulative
        &radic;(&Sigma;<sub>p&prime;&le;p</sub> S&#772;<sub>p&prime;</sub>) &mdash; the quantity
        the &#8467;&sup2;-collapse (MAJ) route needs to stay under the dashed red R_ex budget
        line to remain viable at Q = 1.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        S&#772;<sub>p</sub> per prime and cumulative &radic;-sum vs R_ex
      </h3>
      <PerPrimeSbarBudgetChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the cumulative
        &radic;-sum overlay crosses the R_ex line at the very first prime (p = 2:
        &radic;S&#772;<sub>2</sub> = 0.630 already exceeds R_ex = 0.2797), so every cumulative
        subset {'{2,...,p}'} is over budget &mdash; the crossover happens at the first prime, not
        somewhere down the list. The overlay climbs to &radic;(&Sigma;<sub>p&le;97</sub>
        S&#772;<sub>p</sub>) = {s.finalCumSqrt.toFixed(4)}, an overshoot of
        {' '}{s.overBudgetFactorAtQ1.toFixed(2)}&times; at Q = 1. Individually (bar-by-bar
        against R_ex&sup2; = 0.078225, not the R_ex line shown), p = {s.lastSingleWeldAboveBudgetPrime}
        {' '}is the last single weld still above its own per-weld budget; every larger prime
        falls below on its own even though the cumulative RMS keeps rising.
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
        perm-arch-sieve-universality-no-go-2026-09-22 smallPrimeClosure / perPrimeMeasurement
        literals verbatim (src/data/perm-arch-sieve-universality-no-go-2026-09-22.js). Changes
        no bound, establishes no operator positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
