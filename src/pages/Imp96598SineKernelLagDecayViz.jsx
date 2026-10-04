import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96598_LAG_LADDER,
  IMP96598_RHO1_GAP,
  IMP96598_TAIL_SUM,
  IMP96598_HONEST_BANNER,
} from '../data/imp-96598-sine-kernel-lag-decay-viz-data.js';
import { ED } from '../styles/tokens.js';

// rho_k vs k on a log-|rho| y-axis: direct box lag correlations (dots) vs
// the closed-form O(1/k^2) tail curve (line), with rho_1 marked far above
// the curve's k=1 extrapolation.
function LagDecayPanel() {
  const rows = IMP96598_LAG_LADDER;
  const svgW = 700;
  const padL = 60;
  const padR = 20;
  const svgH = 320;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const minX = 1;
  const maxX = rows.length;
  const logMags = rows.flatMap((r) => [r.direct, r.closed]).filter((v) => v !== null).map((v) => Math.log10(Math.abs(v)));
  const minLog = Math.min(...logMags) - 0.15;
  const maxLog = Math.max(...logMags) + 0.15;

  const xOf = (k) => padL + ((k - minX) / (maxX - minX)) * plotW;
  const yOf = (mag) => padT + plotH - ((Math.log10(mag) - minLog) / (maxLog - minLog)) * plotH;

  const closedRows = rows.filter((r) => r.closed !== null);
  const directRows = rows.filter((r) => r.direct !== null);
  const rho1Row = rows[0];

  const yTicks = [minLog, (minLog + maxLog) / 2, maxLog];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={padT + plotH - ((v - minLog) / (maxLog - minLog)) * plotH} x2={padL} y2={padT + plotH - ((v - minLog) / (maxLog - minLog)) * plotH} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={padT + plotH - ((v - minLog) / (maxLog - minLog)) * plotH + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
            {(10 ** v).toExponential(1)}
          </text>
        </g>
      ))}
      {/* gap marker: rho_1 (direct) vs. the tail curve extrapolated to k=1 */}
      <line
        x1={xOf(1)}
        y1={yOf(Math.abs(rho1Row.direct))}
        x2={xOf(1)}
        y2={yOf(Math.abs(IMP96598_RHO1_GAP.tailCoeffAtK1))}
        stroke={ED.series2}
        strokeWidth={1.4}
        strokeDasharray="4 3"
      />
      <text x={xOf(1) + 6} y={(yOf(Math.abs(rho1Row.direct)) + yOf(Math.abs(IMP96598_RHO1_GAP.tailCoeffAtK1))) / 2} fill={ED.series2} fontSize={8.5}>
        {IMP96598_RHO1_GAP.aboveTailFactor.toFixed(2)}x
      </text>
      <circle cx={xOf(1)} cy={yOf(Math.abs(IMP96598_RHO1_GAP.tailCoeffAtK1))} r={2.5} fill={ED.series2} opacity={0.6} />
      <polyline
        points={closedRows.map((r) => `${xOf(r.k)},${yOf(Math.abs(r.closed))}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={1.8}
      />
      {closedRows.map((r) => (
        <circle key={`c${r.k}`} cx={xOf(r.k)} cy={yOf(Math.abs(r.closed))} r={2.5} fill={ED.series1} />
      ))}
      {directRows.map((r) => (
        <circle key={`d${r.k}`} cx={xOf(r.k)} cy={yOf(Math.abs(r.direct))} r={3.5} fill={ED.brassDeco} stroke="#78350f" strokeWidth={0.5} />
      ))}
      <text x={padL + 8} y={padT + 12} fill={ED.brass} fontSize={9}>
        direct box lag correlations |rho_k| (k=1..6)
      </text>
      <text x={padL + 8} y={padT + 24} fill={ED.series1} fontSize={9}>
        closed-form O(1/k^2) tail |rho_k| = |ln(k^2/(k^2-1))| / (2&pi;^2&middot;&Sigma;^2)
      </text>
      <text x={padL + plotW / 2} y={padT + plotH + 34} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
        lag k (linear)
      </text>
    </svg>
  );
}

export default function Imp96598SineKernelLagDecayViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Box-Averaged GUE Sine-Kernel Lag Decay: rho_k vs k" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> {IMP96598_HONEST_BANNER}
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-96567 derived the box-averaged lag correlations rho_k directly from the GUE two-point
        cluster function T_2(x) = (sin &pi;x / &pi;x)^2 over the L = 495.779 non-overlapping box
        tiling. The k &ge; 2 tail matches an exact closed form that decays like O(1/k^2), but rho_1
        = {IMP96598_RHO1_GAP.rho1.toFixed(4)} sits {IMP96598_RHO1_GAP.aboveTailFactor.toFixed(2)}x
        above that tail curve's k=1 extrapolation ({IMP96598_RHO1_GAP.tailCoeffAtK1.toFixed(6)}) --
        {' '}{IMP96598_RHO1_GAP.mechanism}
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Direct lag correlations vs. the closed-form O(1/k^2) tail
      </h3>
      <LagDecayPanel />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> yellow dots are the direct
        double-box-integral lag correlations rho_1..rho_6; the blue curve is the exact closed-form
        tail rho_k = -(1/(2&pi;^2&middot;&Sigma;^2)) ln(k^2/(k^2-1)) for k &ge; 2, which the direct
        values match to 6 digits. The red dashed gap at k=1 shows why anchoring the O(1/k^2) law at
        rho_1 (giving rho_2 &sim; rho_1/4) mis-anchors it: rho_1 obeys a different, touching-box
        union-identity mechanism, not the tail law. The k &ge; 2 tail telescopes to a small bounded
        sum, sum<sub>k&ge;2</sub> rho_k = {IMP96598_TAIL_SUM.rhoSum.toFixed(6)}, tiny against rho_1.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the imp-96598
        viz-data (recomputed verbatim from the imp-96567 baked inputs). {IMP96598_HONEST_BANNER}
      </div>
    </div>
  );
}
