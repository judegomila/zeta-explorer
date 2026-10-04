import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33550_ROWS,
  IMP33550_GLOBAL_MAX,
  IMP33550_ENDPOINT,
  IMP33550_BEST_FIT,
} from '../data/imp-33550-max-bj-realised-elasticity-viz-data.js';
import { ED } from '../styles/tokens.js';

const LINE_COLOR = ED.series1;
const PEAK_COLOR = ED.series7;
const ENDPOINT_COLOR = ED.series4;

function MaxBjPlateauChart() {
  const svgW = 700;
  const padL = 44;
  const padR = 20;
  const padT = 24;
  const padB = 56;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const logMin = Math.log10(IMP33550_ROWS[0].endN) - 0.1;
  const logMax = Math.log10(IMP33550_ROWS[IMP33550_ROWS.length - 1].endN) + 0.1;
  const yMax = 7;

  const xS = (endN) => padL + ((Math.log10(endN) - logMin) / (logMax - logMin)) * cW;
  const yS = (v) => padT + cH * (1 - v / yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0, 1, 2, 3, 4, 5, 6, 7].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <polyline
        points={IMP33550_ROWS.map((r) => `${xS(r.endN)},${yS(r.maxBj)}`).join(' ')}
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth={1.4}
        opacity={0.85}
      />
      {IMP33550_ROWS.map((r) => (
        <circle key={r.plateauIndex} cx={xS(r.endN)} cy={yS(r.maxBj)} r={3.2} fill={LINE_COLOR} />
      ))}

      {/* global interior maximum, plateau 5 */}
      <circle
        cx={xS(IMP33550_GLOBAL_MAX.endN)}
        cy={yS(IMP33550_GLOBAL_MAX.maxBj)}
        r={5.5}
        fill="none"
        stroke={PEAK_COLOR}
        strokeWidth={2}
      />
      <text
        x={xS(IMP33550_GLOBAL_MAX.endN)}
        y={yS(IMP33550_GLOBAL_MAX.maxBj) - 10}
        textAnchor="middle"
        fill={PEAK_COLOR}
        fontSize={9}
      >
        global max {IMP33550_GLOBAL_MAX.maxBj.toFixed(4)} (plateau 5)
      </text>

      {/* endpoint, plateau 9 -- sits below the peak */}
      <circle
        cx={xS(IMP33550_ENDPOINT.endN)}
        cy={yS(IMP33550_ENDPOINT.maxBj)}
        r={4}
        fill={ENDPOINT_COLOR}
      />
      <text
        x={xS(IMP33550_ENDPOINT.endN)}
        y={yS(IMP33550_ENDPOINT.maxBj) + 16}
        textAnchor="end"
        fill={ENDPOINT_COLOR}
        fontSize={9}
      >
        endpoint {IMP33550_ENDPOINT.maxBj.toFixed(4)} (N=1e6)
      </text>

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {[1e4, 1e5, 1e6].map((n) => (
        <g key={n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {n.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        plateau endN (log scale)
      </text>

      <text x={12} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,12,${padT + cH / 2})`}>
        max_j B_j
      </text>
    </svg>
  );
}

export default function Imp33550MaxBjRealisedElasticityViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Realised-Elasticity sup_j B_j Growth Fit (imp-33309)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 780 }}>
        imp-33290 proved the swap 8/s_min(j)^2 -&gt; 8*B_j (B_j = P_j/D_j) is still a valid upper
        bound and collapses the certified ratio onto the flat K_real floor, but it relocates the
        imp-33250 N-uniformity residual dg2 onto sup_{'{'}N,j{'}'} B_j. imp-33309 tabulated and fit
        max_j B_j across all 10 imp-3725 plateaus of N in [1e4,1e6]. The chart below plots that
        series against the plateau's endN (log scale).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        max_j B_j per plateau over N in [1e4, 1e6]
      </p>
      <MaxBjPlateauChart />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', margin: '1rem 0 1.25rem' }}>
        The global maximum, {IMP33550_GLOBAL_MAX.maxBj.toFixed(4)}, sits at the interior plateau 5
        (endN &sim; {IMP33550_GLOBAL_MAX.endN.toLocaleString()}), NOT at the N=1e6 endpoint (
        {IMP33550_ENDPOINT.maxBj.toFixed(4)}). A genuine monotone-in-N growth law forbids this dip
        after the peak. The best of four candidate fits ({IMP33550_BEST_FIT.label}) has exponent
        &alpha; &sim; {IMP33550_BEST_FIT.exponent.toFixed(3)} with R&sup2; &sim;{' '}
        {IMP33550_BEST_FIT.r2.toFixed(2)} -- every fit is poor and the residual scatter dwarfs any
        trend.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue line is the raw
        per-plateau max_j B_j series. The pink-ringed marker is the global interior maximum at
        plateau 5; the amber marker is the N=1e6 endpoint, which retracts below that peak. Over
        &sim;1.72 decades of N the sequence rises then dips rather than following a clean growth
        law, so the measurement cannot distinguish a slow unbounded drift from a bounded lattice
        fluctuation.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> fit-only feasibility, NOT
        certification. sup_{'{'}N,j{'}'} B_j (the imp-33250 dg2 residual) is neither certified
        bounded nor demonstrated unbounded -- the obstruction stays OPEN both ways. Changes no
        bound; imp-3910 C &le; 54.56 stands; imp-3066 K_a &ge; 0 UNTOUCHED. RH-equivalent, NO QED.
      </div>
    </div>
  );
}
