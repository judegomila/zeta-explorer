import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33267_RECONCILIATION,
  IMP33267_SIMPSON_LADDER,
  IMP33267_CORRECTION_C,
} from '../data/imp-33267-a-weight-dual-path-tau25-30-viz-data.js';
import { ED } from '../styles/tokens.js';

function LadderChart({ series, color }) {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const ns = series.rungs.map((r) => r.n);
  const xMin = Math.log10(ns[0]);
  const xMax = Math.log10(series.limit >= 100000 ? 2.5e8 : 3e7);
  const yMin = series.rungs[0].negLnA - (series.limit - series.rungs[0].negLnA) * 0.15;
  const yMax = series.limit + (series.limit - series.rungs[0].negLnA) * 0.05;

  const xS = (n) => padL + ((Math.log10(n) - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = series.rungs.map(
    (r, i) => (i === 0 ? 'M' : 'L') + xS(r.n).toFixed(1) + ',' + yS(r.negLnA).toFixed(2),
  ).join(' ');

  const yTicks = [yMin, (yMin + series.limit) / 2, series.limit].map((v) => v);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(series.limit)}
        x2={padL + cW}
        y2={yS(series.limit)}
        stroke={ED.series7}
        strokeWidth={1.2}
        strokeDasharray="4,3"
      />
      <text x={padL + cW - 4} y={yS(series.limit) - 5} textAnchor="end" fill={ED.series7} fontSize={8.5}>
        graded-GL limit = {series.limit.toFixed(4)}
      </text>

      <path d={path} fill="none" stroke={color} strokeWidth={2.4} />
      {series.rungs.map((r) => (
        <circle key={r.n} cx={xS(r.n)} cy={yS(r.negLnA)} r={4} fill={color} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {series.rungs.map((r) => (
        <g key={'x' + r.n}>
          <line x1={xS(r.n)} y1={padT + cH} x2={xS(r.n)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(r.n)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {r.n.toExponential(1)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        uniform-Simpson n (log scale)
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        -ln A(tau={series.tau})
      </text>
    </svg>
  );
}

function RelGapChart() {
  const svgW = 620;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 180;
  const svgH = padT + cH + padB;

  const rows = IMP33267_RECONCILIATION;
  const yMin = -12;
  const yMax = -10.5;

  const xS = (i) => padL + ((i + 0.5) / rows.length) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));
  const barW = (cW / rows.length) * 0.4;

  const yTicks = [1e-11, 3e-11, 1e-10];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 4} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {rows.map((r, i) => (
        <rect
          key={r.tau}
          x={xS(i) - barW / 2}
          y={yS(r.relGap)}
          width={barW}
          height={padT + cH - yS(r.relGap)}
          fill={ED.series1}
        />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {rows.map((r, i) => (
        <g key={'x' + r.tau}>
          <line x1={xS(i)} y1={padT + cH} x2={xS(i)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(i)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            tau={r.tau}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 34} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        tau
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,12,' + (padT + cH / 2) + ')'}
      >
        relative gap (log)
      </text>
    </svg>
  );
}

export default function Imp33267AWeightDualPathTau25To30Viz() {
  const r25 = IMP33267_RECONCILIATION[0];
  const r30 = IMP33267_RECONCILIATION[1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="A-Weight Dual-Path -ln A(tau) Reconciliation at tau = 2.5, 3.0 (imp-3850 / imp-33267)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3850 extended the imp-3736 two-path reconciliation of -ln A(tau) -- a peak-adapted
        graded Gauss-Legendre quadrature vs a uniform log-Simpson quadrature, both on the same
        completed-Riemann kernel -- from tau in &#123;1.5, 2.0&#125; up to tau in &#123;2.5, 3.0&#125;.
        This window was flagged an orphan by the imp-3886 0-for-6 surfacing audit: the two paths
        land on -ln A(2.5) = {r25.gradedGLNegLnA.toFixed(6)} and
        -ln A(3.0) = {r30.gradedGLNegLnA.toFixed(6)}, agreeing to sub-1e-6 absolute
        (sub-1e-11 relative).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Uniform-Simpson -ln A(tau=2.5) climbing monotonically onto the graded-GL limit (dashed)
      </p>
      <LadderChart series={IMP33267_SIMPSON_LADDER[0]} color={ED.series3} />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Uniform-Simpson -ln A(tau=3.0) climbing monotonically onto the graded-GL limit (dashed)
      </p>
      <LadderChart series={IMP33267_SIMPSON_LADDER[1]} color={ED.series5} />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Relative gap between the two independent paths at full convergence
      </p>
      <RelGapChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the top two charts show
        the uniform log-Simpson quadrature under-resolving the near-s=0 peak (width
        ~1/(4 pi e<sup>4 tau</sup>), collapsing to ~5e-6 at tau=2.5 and ~6e-7 at tau=3.0) and
        climbing monotonically -- with no overshoot -- onto the cutoff- and grade-invariant
        graded-GL limit (dashed) as n is pushed to the peak-width-dictated refinement
        (n={r25.simpsonN.toExponential(2)} at tau=2.5, n={r30.simpsonN.toExponential(2)} at
        tau=3.0). The bottom chart shows the resulting relative gap between the two structurally
        independent paths at full convergence: {r25.relGap.toExponential(2)} at tau=2.5 and{' '}
        {r30.relGap.toExponential(2)} at tau=3.0 -- both about ten significant figures of
        agreement. This reproduces the imp-3730 subleading-correction rungs
        c(2.5) = {IMP33267_CORRECTION_C[2.5].published} and c(3.0) = {IMP33267_CORRECTION_C[3].published}{' '}
        (c(tau) = -ln A(tau) - pi e<sup>4 tau</sup>) to within 1e-4, giving them an independent
        second-path anchor.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> accuracy/convergence
        reconciliation only, RH-equivalent, necessary-but-not-sufficient. It reconciles two
        quadratures for a fixed autocorrelation weight used inside a mass-feasibility diagnostic;
        it establishes NO operator positivity. The operator-level K_a &ge; 0 sign-positivity
        (off-diagonal endpoint-Hankel step, imp-3066) remains untouched. No QED.
      </div>
    </div>
  );
}
