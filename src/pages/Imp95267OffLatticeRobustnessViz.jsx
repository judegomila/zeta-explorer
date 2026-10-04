import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95267_OFFLATTICE_TABLE,
  IMP95267_ONLATTICE_RATIO,
  IMP95267_WITNESS,
} from '../data/imp-95267-offlattice-robustness-viz-data.js';
import { ED } from '../styles/tokens.js';

// mean and worst BL^2/Lambda ratio vs jitter eps on the dyadic lattice
// (imp-95232 FINDING 2). Both curves start at the on-lattice near-sharp
// ratio (~1.028) and grow with eps; the worst curve spans 1.03 to 9.4,
// so a log y-axis is used to keep the mean curve's shape legible.
function DegradationCurve() {
  const rows = IMP95267_OFFLATTICE_TABLE;
  const svgW = 640;
  const padL = 52;
  const padR = 24;
  const plotW = svgW - padL - padR;
  const svgH = 340;
  const padT = 24;
  const padB = 56;
  const plotH = svgH - padT - padB;

  const minX = 0;
  const maxX = 0.3;
  const minLog = Math.log10(1);
  const maxLog = Math.log10(10);
  const xOf = (v) => padL + ((v - minX) / (maxX - minX)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - minLog) / (maxLog - minLog)) * plotH;

  const xTicks = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3];
  const yTicks = [1, 2, 3, 5, 10];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />

      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}x
          </text>
        </g>
      ))}

      {/* on-lattice baseline */}
      <line
        x1={padL}
        y1={yOf(IMP95267_ONLATTICE_RATIO)}
        x2={padL + plotW}
        y2={yOf(IMP95267_ONLATTICE_RATIO)}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="5 4"
      />
      <text x={padL + 6} y={yOf(IMP95267_ONLATTICE_RATIO) - 6} fill={ED.brass} fontSize={8.5}>
        on-lattice baseline (1.028)
      </text>

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        jitter eps (site perturbation 1 + eps*U[-1,1])
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        BL^2 / Lambda ratio (log scale)
      </text>

      <polyline
        points={rows.map((r) => `${xOf(r.eps)},${yOf(r.meanRatio)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2.25}
        opacity={0.9}
      />
      <polyline
        points={rows.map((r) => `${xOf(r.eps)},${yOf(r.worstRatio)}`).join(' ')}
        fill="none"
        stroke={ED.series2}
        strokeWidth={2.25}
        opacity={0.9}
      />

      {rows.map((r) => (
        <g key={`pts${r.eps}`}>
          <circle cx={xOf(r.eps)} cy={yOf(r.meanRatio)} r={3.5} fill={ED.series1} stroke={ED.paper} strokeWidth={1.25} />
          <circle cx={xOf(r.eps)} cy={yOf(r.worstRatio)} r={3.5} fill={ED.series2} stroke={ED.paper} strokeWidth={1.25} />
        </g>
      ))}

      <circle cx={xOf(0.2)} cy={yOf(IMP95267_WITNESS.ratio)} r={5} fill="none" stroke={ED.series3} strokeWidth={2} />
      <text x={xOf(0.2) + 8} y={yOf(IMP95267_WITNESS.ratio) - 8} fill={ED.series3} fontSize={8.5}>
        witness (1.008)
      </text>

      <text x={padL + plotW - 4} y={padT + 12} textAnchor="end" fill={ED.series1} fontSize={8.5}>
        mean ratio (400 trials)
      </text>
      <text x={padL + plotW - 4} y={padT + 24} textAnchor="end" fill={ED.series2} fontSize={8.5}>
        worst ratio (400 trials)
      </text>
    </svg>
  );
}

export default function Imp95267OffLatticeRobustnessViz() {
  const rows = IMP95267_OFFLATTICE_TABLE;
  const last = rows[rows.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Off-Lattice Robustness of the Raw Blaschke-Lagrange Bound (imp-95232 / imp-95267)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> this chart illustrates a
        MEASUREMENT (imp-95232 FINDING 2) of how the RAW Blaschke-Lagrange bound behaves under
        site jitter; it is not the count-uniform BL-LAT collar (a separate, ~70x looser object
        per FINDING 1), changes no bound, establishes no operator positivity, and carries no RH
        claim. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        On the dyadic lattice (rho = 2, N = 10, rates 1, 2, 4, &hellip;, 512, depth x = 6), the
        raw BL&sup2;/&Lambda; ratio is near-sharp at {IMP95267_ONLATTICE_RATIO}. Perturbing each
        site by a factor 1 + eps&middot;U[-1,1] (400 deterministic-PRNG trials per eps, sites kept
        distinct), the ratio degrades slowly in the mean and moderately in the worst case, and BL
        keeps firing (BL&sup2; &lt; 1) on every trial through eps = 0.3, where the worst ratio
        reaches {last.worstRatio}&times; the on-lattice value.
      </p>

      <DegradationCurve />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the y-axis is
        log-scaled because the worst-case ratio spans 1.03&times; to 9.4&times; across eps in
        [0.01, 0.3], while the mean stays close to the dashed amber on-lattice baseline. The
        worst case grows faster because BL is separation-priced: a jitter that closes the gap
        between two neighbouring dyadic sites inflates the (nu_i + nu_j)/|nu_i - nu_j| factor in
        the bound. The green ring marks the fixed deterministic eps = 0.2 witness (ratio
        1.008), showing a typical draw stays close to on-lattice even where the worst case has
        already climbed to 1.58&times;.
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
        imp-95267 baked viz-data (the imp-95232 FINDING 2 offLatticeTable / offLatticeWitness
        literals, copied verbatim, not re-derived). Changes no bound, establishes no operator
        positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
