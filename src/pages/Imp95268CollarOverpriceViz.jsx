import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95268_ONLATTICE_BASELINE,
  IMP95268_COLLAR_OVERPRICE_VS_X,
} from '../data/imp-95268-collar-overprice-viz-data.js';
import { ED } from '../styles/tokens.js';

// bar chart: BL-LAT collar over-pricing factor (collar / Lambda) vs depth x
// (imp-95232 FINDING 1), against the near-sharp raw BL ratio (~1.03) shown
// as a dashed reference line -- log scale, since the collar factor (~69-79x)
// dwarfs the raw ratio by ~70x.
function CollarOverpriceChart() {
  const rows = IMP95268_COLLAR_OVERPRICE_VS_X;
  const svgW = 560;
  const padL = 52;
  const padR = 24;
  const plotW = svgW - padL - padR;
  const svgH = 300;
  const padT = 24;
  const padB = 48;
  const plotH = svgH - padT - padB;

  const minLog = Math.log10(1);
  const maxLog = Math.log10(100);
  const yOf = (v) => padT + plotH - ((Math.log10(v) - minLog) / (maxLog - minLog)) * plotH;

  const barW = plotW / rows.length;
  const yTicks = [1, 2, 5, 10, 20, 50, 100];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}x
          </text>
        </g>
      ))}

      {rows.map((row, i) => {
        const cx = padL + barW * (i + 0.5);
        const barTop = yOf(row.latOverLambda);
        return (
          <g key={`x${row.x}`}>
            <rect
              x={cx - barW * 0.28}
              y={barTop}
              width={barW * 0.56}
              height={padT + plotH - barTop}
              fill={ED.series5}
              opacity={0.85}
            />
            <text x={cx} y={barTop - 6} textAnchor="middle" fill={ED.series5} fontSize={9}>
              {row.latOverLambda}x
            </text>
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              x={row.x}
            </text>
          </g>
        );
      })}

      <line
        x1={padL}
        y1={yOf(IMP95268_ONLATTICE_BASELINE.blRatio)}
        x2={padL + plotW}
        y2={yOf(IMP95268_ONLATTICE_BASELINE.blRatio)}
        stroke={ED.series3}
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      <text x={padL + 6} y={yOf(IMP95268_ONLATTICE_BASELINE.blRatio) - 6} fill={ED.series3} fontSize={8.5}>
        raw BL near-sharp ratio ({IMP95268_ONLATTICE_BASELINE.blRatio}x)
      </text>

      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        depth x (dyadic lattice, rho=2, N=10)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        overprice factor (log scale)
      </text>
    </svg>
  );
}

export default function Imp95268CollarOverpriceViz() {
  const b = IMP95268_ONLATTICE_BASELINE;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="BL-LAT Collar Over-Pricing at Finite N (imp-95232 / imp-95268)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-5) 6%, transparent)',
          borderLeft: '3px solid var(--series-5)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-5)' }}>Honest status:</strong> this chart illustrates a
        MEASUREMENT (imp-95232 FINDING 1) of how far the count-uniform BL-LAT collar sits above
        the exact Lambda at finite N; it changes no bound, establishes no operator positivity,
        and carries no RH claim.
        NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        On the exact dyadic lattice (rho = 2, N = 10, x = 6): Lambda = {b.lambdaExact.toExponential(4)},
        BL&sup2; = {b.blSquared.toExponential(4)} (ratio {b.blRatio}, near-sharp), but the count-uniform
        BL-LAT collar c(2)&#8308;e&#8315;&#178;&#832;(1+&tau;)&sup2; = {b.latCollar.toExponential(4)} sits a
        factor {b.latOverLambda} above Lambda and {b.latOverBlSquared} above BL&sup2;. The bar chart
        below tracks this over-pricing factor across depth x; it stays x-stable (roughly 69&ndash;79x)
        and slowly approaches the c(2)&#8308;/BL&sup2; asymptote from above as x grows, while the raw BL
        ratio (dashed green reference) stays pinned near 1.03&times;.
      </p>

      <CollarOverpriceChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the y-axis is log-scaled
        because the collar overprice (~69&ndash;79x) dwarfs the raw BL near-sharp ratio (~1.03x) by
        roughly 70x. The over-pricing exists because c(2)&sup2; is the INFINITE two-sided Blaschke
        product used to make the collar count-uniform (valid at unbounded N), while each finite-N
        per-rate product in the raw BL bound is far smaller. So the collar's only merit &mdash;
        firing at unbounded count &mdash; comes at the cost of being loose at any fixed N; the
        near-sharp 1.028 reported by imp-95226 is a property of the raw BL evaluation, not of the
        count-uniform certificate that is actually proven.
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
        imp-95268 baked viz-data (the imp-95232 FINDING 1 onLatticeBaseline / collarOverpriceVsX
        literals, copied verbatim, not re-derived). Changes no bound, establishes no operator
        positivity, no RH claim. NO QED.
      </div>
    </div>
  );
}
