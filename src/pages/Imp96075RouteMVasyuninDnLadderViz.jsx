import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96075_DN_LADDER,
  IMP96075_RESIDUAL_POINTS,
  IMP96075_MELLIN_SUMMARY,
  IMP96075_HONEST_BANNER,
  IMP96075_LATER_DENSE_LADDER_NOTE,
} from '../data/imp-96075-route-m-vasyunin-dn-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// line chart of d_N^2 log N / Sum_rho 1/|rho|^2 vs N: the exact-Gram NB
// distance converging onto the Burnol floor (ratio -> 1)
function DnLadderPanel() {
  const rows = IMP96075_DN_LADDER;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 300;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const minLogN = Math.log(rows[0].N);
  const maxLogN = Math.log(rows[rows.length - 1].N);
  const minY = 0.95;
  const maxY = 1.3;
  const xOf = (N) => padL + ((Math.log(N) - minLogN) / (maxLogN - minLogN)) * plotW;
  const yOf = (v) => padT + plotH - ((v - minY) / (maxY - minY)) * plotH;
  const yTicks = [0.95, 1, 1.1, 1.2, 1.3];

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xLabel="N (log scale)"
      yLabel="d_N² log N / Σ_ρ 1/|ρ|²"
    >
      <line x1={padL} y1={yOf(1)} x2={padL + plotW} y2={yOf(1)} stroke={ED.series2} strokeWidth={1} strokeDasharray="4 3" opacity={0.6} />
      <text x={padL + plotW - 4} y={yOf(1) - 5} textAnchor="end" fill={ED.series2} fontSize={9}>
        Burnol floor (ratio = 1)
      </text>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <polyline
        points={rows.map((r) => `${xOf(r.N)},${yOf(r.ratioToBurnol)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2}
        opacity={0.9}
      />
      {rows.map((r) => (
        <circle key={r.N} cx={xOf(r.N)} cy={yOf(r.ratioToBurnol)} r={2.5} fill={ED.series1} />
      ))}
      {[5, 50, 500].map((N) => (
        <text key={N} x={xOf(N)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          N={N}
        </text>
      ))}
    </AxisFrame>
  );
}

// bar chart of the three baked |1+zeta D_N|^2/(1/4+t^2) residual points,
// normalized by 1/|rho|^2: forced to 1 at a zero, then median / max
// between zeros
function ResidualPointsPanel() {
  const rows = IMP96075_RESIDUAL_POINTS;
  const svgW = 480;
  const padL = 60;
  const padR = 24;
  const svgH = 260;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const maxY = 1.05;
  const barW = plotW / rows.length / 2;
  const xOf = (i) => padL + (plotW / rows.length) * (i + 0.5);
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xLabel="baked point"
      yLabel="|1+ζD_N|²/(¼+t²) × |ρ|²"
    >
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      {rows.map((r, i) => (
        <g key={r.label}>
          <rect
            x={xOf(i) - barW / 2}
            y={yOf(r.value)}
            width={barW}
            height={yOf(0) - yOf(r.value)}
            fill={i === 0 ? ED.series2 : ED.series1}
            opacity={0.85}
          />
          <text x={xOf(i)} y={yOf(r.value) - 6} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
            {r.value.toFixed(3)}
          </text>
          <text x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
            {r.label}
          </text>
        </g>
      ))}
    </AxisFrame>
  );
}

export default function Imp96075RouteMVasyuninDnLadderViz() {
  const first = IMP96075_DN_LADDER[0];
  const last = IMP96075_DN_LADDER[IMP96075_DN_LADDER.length - 1];
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Route M: Vasyunin-Gram NB Distance Ladder and the Zero-Pinned Mellin Residual" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96075_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Route M (rh-route-m-nyman-beurling-vasyunin-reciprocity) builds the exact Vasyunin
        cotangent-sum Gram for the Nyman-Beurling criterion and computes the distance d_N to the
        indicator function at N up to {last.N}. The ratio d_N&sup2; log N / &Sigma;_&rho; 1/|&rho;|&sup2;
        falls from {first.ratioToBurnol.toFixed(3)} at N={first.N} to {last.ratioToBurnol.toFixed(3)} at
        N={last.N} &mdash; the exact Gram already sits on the Burnol lower-bound floor at this size.
      </p>

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
        <strong style={{ color: 'var(--series-2)' }}>Update (imp-96119):</strong> {IMP96075_LATER_DENSE_LADDER_NOTE}
      </div>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        d_N ladder: convergence onto the Burnol floor
      </h3>
      <DnLadderPanel />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.25rem 0 0.5rem' }}>
        The residual |1+&zeta;D_N|&sup2;/(&frac14;+t&sup2;), normalized by 1/|&rho;|&sup2;
      </h3>
      <ResidualPointsPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the residual is forced to
        equal 1 (in these normalized units) at every one of the {IMP96075_MELLIN_SUMMARY.zerosBelowT}{' '}
        zeros below T={IMP96075_MELLIN_SUMMARY.T} (since &zeta;(&rho;)=0 exactly), then drops to a
        median of {IMP96075_RESIDUAL_POINTS[1].value.toFixed(3)} and a max of{' '}
        {IMP96075_RESIDUAL_POINTS[2].value.toFixed(3)} between zeros. {Math.round(IMP96075_MELLIN_SUMMARY.fracCaptured * 100)}%
        of d_N&sup2; is captured below T={IMP96075_MELLIN_SUMMARY.T}, and d_N&sup2;/&Sigma;_&rho;
        1/|&rho;|&sup2; ({IMP96075_MELLIN_SUMMARY.dN2OverBurnol.toFixed(5)}) matches 1/log N (
        {IMP96075_MELLIN_SUMMARY.oneOverLogN.toFixed(5)}) to 0.2%: each zero contributes its own
        1/|&rho;|&sup2; times the Dirichlet-polynomial resolution width 1/log N &mdash; the same
        mollifier-spike mechanism Burnol identified, not a new modular effect.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96075
        baked viz-data (values copied verbatim from the Route M NB_DISTANCE_LADDER and
        RECIPROCITY_STRUCTURAL_TEST.mellinResidual records, no re-derivation). {IMP96075_HONEST_BANNER}
      </div>
    </div>
  );
}
