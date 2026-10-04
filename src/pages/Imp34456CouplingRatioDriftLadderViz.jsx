import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34456_LADDER,
  IMP34456_DRIFT_INTERVALS,
} from '../data/imp-34456-coupling-ratio-drift-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// Line-with-points chart: coupling ratio residual/(E_flow/E_trunc) at each landmark, pinned
// near the leading value 2 (dashed reference line), drifting monotonically DOWN.
function CouplingRatioLadderLine() {
  const svgW = 640;
  const svgH = 280;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = 2.0;
  const yMax = 2.1;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const n = IMP34456_LADDER.length;
  const xAt = (i) => padL + (cW * i) / (n - 1);

  const yTicks = [2.0, 2.02, 2.04, 2.06, 2.08, 2.1];

  const points = IMP34456_LADDER.map((r, i) => `${xAt(i)},${yAt(r.coupling_ratio)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yAt(2)}
        x2={padL + cW}
        y2={yAt(2)}
        stroke={ED.series7}
        strokeWidth={1.25}
        strokeDasharray="5,4"
      />
      <text x={padL + cW - 4} y={yAt(2) - 6} textAnchor="end" fill={ED.series7} fontSize={9.5}>
        leading value = 2
      </text>

      <polyline points={points} fill="none" stroke={ED.series1} strokeWidth={2} />

      {IMP34456_LADDER.map((r, i) => (
        <g key={r.landmark}>
          <circle cx={xAt(i)} cy={yAt(r.coupling_ratio)} r={4} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
          <text
            x={xAt(i)}
            y={yAt(r.coupling_ratio) - 10}
            textAnchor="middle"
            fill={ED.inkSoft}
            fontSize={9}
            fontFamily="monospace"
          >
            {r.coupling_ratio.toFixed(4)}
          </text>
          <text x={xAt(i)} y={padT + cH + 18} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
            {r.landmark}
          </text>
          <text x={xAt(i)} y={padT + cH + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5} fontFamily="monospace">
            thr={r.thr}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Bar chart: per-landmark-step drift, rising to a mild peak then turning over -- NOT a
// constant rate.
function DriftIntervalBars() {
  const svgW = 640;
  const svgH = 220;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 60;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMax = 0.7;
  const yAt = (v) => padT + cH - (v / yMax) * cH;

  const n = IMP34456_DRIFT_INTERVALS.length;
  const slot = cW / n;
  const barW = slot * 0.4;

  const yTicks = [0, 0.2, 0.4, 0.6];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1) + '%'}
          </text>
        </g>
      ))}

      {IMP34456_DRIFT_INTERVALS.map((r, i) => {
        const xCenter = padL + slot * i + slot / 2;
        const x = xCenter - barW / 2;
        const top = yAt(r.drift_pct);
        const bottom = padT + cH;
        const isSmallest = i === 2;
        return (
          <g key={r.step}>
            <rect
              x={x}
              y={top}
              width={barW}
              height={bottom - top}
              fill={isSmallest ? ED.series3 : ED.series7}
              stroke={ED.paper}
              strokeWidth={0.75}
            />
            <text x={xCenter} y={top - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
              {r.drift_pct.toFixed(4) + '%'}
            </text>
            <text x={xCenter} y={padT + cH + 16} textAnchor="middle" fill={ED.ink} fontSize={8.5}>
              {r.step}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp34456CouplingRatioDriftLadderViz() {
  const last = IMP34456_LADDER[IMP34456_LADDER.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Coupling Ratio Drift Ladder (imp-34372 / imp-34447)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34372 measured the coupling ratio residual/(E_flow/E_trunc) at three closed-form
        crossover landmarks and found it pinned near the leading value 2 (N proportional to
        E_coll^-2), drifting monotonically down by a small amount per landmark. imp-34447 added a
        fourth, deeper landmark (thr=0.001), supplying a third drift interval that resolves the
        open question: is the drift constant-rate or decaying? At the deepest landmark the ratio
        is {last.coupling_ratio.toFixed(4)} &mdash; still comfortably above 2.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Coupling ratio stays pinned near 2 across all four landmarks, drifting monotonically down
      </p>
      <CouplingRatioLadderLine />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Per-landmark-step drift rises to a mild peak then TURNS OVER (green bar) &mdash; not a
        constant rate
      </p>
      <DriftIntervalBars />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>landmark</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>thr</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>coupling ratio</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>excess above 2</th>
          </tr>
        </thead>
        <tbody>
          {IMP34456_LADDER.map((row) => (
            <tr key={row.landmark} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.landmark}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.thr}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.coupling_ratio.toFixed(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.excess_above_two.toFixed(6)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Summary:</strong> the per-landmark-step drift is
        {' '}
        {IMP34456_DRIFT_INTERVALS.map((d) => d.drift_pct.toFixed(4) + '%').join(', ')}
        {' '}&mdash; unequal, rising to a mild peak at the far-tail-to-deep-tail step then turning
        over in the deepest interval, so the coupling ratio is converging toward a finite limit
        near 2 rather than sliding through it.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-34372/imp-34447 measurements; no new derivation, no bound changed.
        Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
        asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz untouched; imp-3066
        K_a&ge;0 untouched; NO QED.
      </div>
    </div>
  );
}
