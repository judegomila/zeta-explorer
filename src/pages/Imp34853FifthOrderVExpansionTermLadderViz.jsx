import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34821_SIGMA_KNEE_FIFTH_ORDER_V_EXPANSION } from '../data/imp-34821-sigma-knee-fifth-order-v-expansion.js';
import { ED } from '../styles/tokens.js';

const D = IMP34821_SIGMA_KNEE_FIFTH_ORDER_V_EXPANSION;

// -- log-scale magnitude ladder: |delta_k| bars on a log10 axis, decreasing left to right. --
function MagnitudeLadder({ magnitudes }) {
  const svgW = 660;
  const padL = 60;
  const padR = 30;
  const padT = 20;
  const padB = 46;
  const colW = (svgW - padL - padR) / magnitudes.length;
  const plotH = 200;
  const svgH = plotH + padT + padB;

  const logs = magnitudes.map((m) => Math.log10(Math.abs(m.value)));
  const maxLog = Math.max(...logs);
  const minLog = Math.min(...logs);
  const yOf = (log) => padT + ((maxLog - log) / (maxLog - minLog)) * plotH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} x2={svgW - padR} y1={padT} y2={padT} stroke={ED.ruleSoft} strokeWidth={1} />
      <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {magnitudes.map((m, i) => {
        const x = padL + colW * i + colW / 2;
        const y = yOf(logs[i]);
        const barY = y;
        const barH = padT + plotH - y;
        return (
          <g key={m.label}>
            <rect x={x - 18} y={barY} width={36} height={barH} fill={ED.series1} opacity={0.75} rx={3} />
            <text x={x} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={11} fontFamily="monospace">
              {m.label}
            </text>
            <text x={x} y={barY - 6} textAnchor="middle" fill={ED.series1} fontSize={10} fontFamily="monospace">
              {m.value.toExponential(2)}
            </text>
          </g>
        );
      })}
      <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        |delta_k| at the crossover, log10 scale -- monotonically decreasing across five orders
      </text>
    </svg>
  );
}

// -- ratio ladder: successive |delta_(k+1)/delta_k| values against a y=1 reference line. --
function RatioLadder({ ratios }) {
  const svgW = 660;
  const padL = 60;
  const padR = 30;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 160;
  const svgH = plotH + padT + padB;

  const vMax = 0.02;
  const yOf = (v) => padT + (1 - v / vMax) * plotH;
  const xOf = (i) => padL + (plotW / (ratios.length - 1 || 1)) * i;

  const points = ratios.map((r, i) => `${xOf(i)},${yOf(r.value)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} x2={svgW - padR} y1={yOf(0)} y2={yOf(0)} stroke={ED.ruleSoft} strokeWidth={1} />
      <polyline points={points} fill="none" stroke={ED.series5} strokeWidth={2} />
      {ratios.map((r, i) => (
        <g key={r.label}>
          <circle cx={xOf(i)} cy={yOf(r.value)} r={4} fill={ED.series5} />
          <text x={xOf(i)} y={yOf(r.value) - 10} textAnchor="middle" fill={ED.series5} fontSize={10} fontFamily="monospace">
            {r.value.toExponential(2)}
          </text>
          <text x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={11} fontFamily="monospace">
            {r.label}
          </text>
        </g>
      ))}
      <text x={svgW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        successive-term ratios |delta_(k+1)/delta_k| -- all sub-unity, last ratio DECREASING (no divergence turn-up)
      </text>
    </svg>
  );
}

export default function Imp34853FifthOrderVExpansionTermLadderViz() {
  const { expansion, residualBudget } = D;

  const magnitudes = [
    { label: 'delta_1', value: expansion.delta1AtCrossover },
    { label: 'delta_2', value: expansion.delta2AtCrossover },
    { label: 'delta_3', value: expansion.delta3AtCrossover },
    { label: 'delta_4', value: expansion.delta4AtCrossover },
    { label: 'delta_5', value: expansion.delta5AtCrossover },
  ];

  const ratios = [
    { label: '|d2/d1|', value: expansion.ratio2over1 },
    { label: '|d3/d2|', value: expansion.ratio3over2 },
    { label: '|d4/d3|', value: expansion.ratio4over3 },
    { label: '|d5/d4|', value: expansion.ratio5over4 },
  ];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Fifth-Order v-Expansion Term Ladder (imp-34853 / imp-34821)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34821 restored the fifth-order term delta_5 of the slowly-varying-v expansion of the logistic
        exponent-knee condition. The ordered magnitudes {'{'}
        {magnitudes.map((m) => Math.abs(m.value).toExponential(2)).join(', ')}
        {'}'} keep the rapidly-converging pattern seen at lower orders, with every successive ratio well below 1
        and the last ratio decreasing -- no divergence turn-up across the five orders computed.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        |delta_k| magnitude ladder (log scale)
      </p>
      <MagnitudeLadder magnitudes={magnitudes} />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Successive ratio ladder
      </p>
      <RatioLadder ratios={ratios} />

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        The self-consistent SC-to-exactF residual stays on the same flat +{residualBudget.fifthOrderSelfConsistentToExactFLog10.toExponential(2)}
        {' '}dex plateau reached at third order: adding delta_5 moves the self-consistent knee by only
        {' '}{residualBudget.fifthMinusFourthSelfConsistentLog10.toExponential(2)} dex from the fourth-order value,
        well below the {expansion.fdFloorDex.toExponential(1)} dex finite-difference floor. Any truncation at
        order &ge; 3 lands on the same plateau -- the residual is set by discretization, not a missing v-order.
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page presenting the imp-34821
        literals verbatim (no new computation). Component model is the inherited imp-3220/imp-3406 surrogate
        crossover map, NOT a rigorous asymptotic; sub-gap imp-34756/imp-34770/imp-34797 REMAINS OPEN (a
        Richardson/higher-precision resolution of the FD-discretization floor below the milli-dex scale is
        deferred, not attempted here). The C_C&nbsp;=&nbsp;(1/8)&radic;(3&pi;) ansatz (imp-2642/imp-2643) is
        UNTOUCHED; C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; no operator positivity;
        no RH verdict, NO QED.
      </div>
    </div>
  );
}
