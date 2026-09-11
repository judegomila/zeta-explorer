import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95267_OFFLATTICE_TABLE,
  IMP95267_ONLATTICE_RATIO,
  IMP95267_WITNESS,
} from '../data/imp-95267-offlattice-robustness-viz-data.js';

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
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xOf(v)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
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
        stroke="#f59e0b"
        strokeWidth={1}
        strokeDasharray="5 4"
      />
      <text x={padL + 6} y={yOf(IMP95267_ONLATTICE_RATIO) - 6} fill="#f59e0b" fontSize={8.5}>
        on-lattice baseline (1.028)
      </text>

      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        jitter eps (site perturbation 1 + eps*U[-1,1])
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        BL^2 / Lambda ratio (log scale)
      </text>

      <polyline
        points={rows.map((r) => `${xOf(r.eps)},${yOf(r.meanRatio)}`).join(' ')}
        fill="none"
        stroke="#38bdf8"
        strokeWidth={2.25}
        opacity={0.9}
      />
      <polyline
        points={rows.map((r) => `${xOf(r.eps)},${yOf(r.worstRatio)}`).join(' ')}
        fill="none"
        stroke="#f87171"
        strokeWidth={2.25}
        opacity={0.9}
      />

      {rows.map((r) => (
        <g key={`pts${r.eps}`}>
          <circle cx={xOf(r.eps)} cy={yOf(r.meanRatio)} r={3.5} fill="#38bdf8" stroke="#0a0f1a" strokeWidth={1.25} />
          <circle cx={xOf(r.eps)} cy={yOf(r.worstRatio)} r={3.5} fill="#f87171" stroke="#0a0f1a" strokeWidth={1.25} />
        </g>
      ))}

      <circle cx={xOf(0.2)} cy={yOf(IMP95267_WITNESS.ratio)} r={5} fill="none" stroke="#4ade80" strokeWidth={2} />
      <text x={xOf(0.2) + 8} y={yOf(IMP95267_WITNESS.ratio) - 8} fill="#4ade80" fontSize={8.5}>
        witness (1.008)
      </text>

      <text x={padL + plotW - 4} y={padT + 12} textAnchor="end" fill="#38bdf8" fontSize={8.5}>
        mean ratio (400 trials)
      </text>
      <text x={padL + plotW - 4} y={padT + 24} textAnchor="end" fill="#f87171" fontSize={8.5}>
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
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> this chart illustrates a
        MEASUREMENT (imp-95232 FINDING 2) of how the RAW Blaschke-Lagrange bound behaves under
        site jitter; it is not the count-uniform BL-LAT collar (a separate, ~70x looser object
        per FINDING 1), changes no bound, establishes no operator positivity, and carries no RH
        claim. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
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
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the y-axis is
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
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the
        imp-95267 baked viz-data (the imp-95232 FINDING 2 offLatticeTable / offLatticeWitness
        literals, copied verbatim, not re-derived). Changes no bound, establishes no operator
        positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
