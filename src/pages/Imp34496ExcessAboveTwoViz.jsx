import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34496_EXCESS_LADDER,
  IMP34496_EXCESS_DROPS,
} from '../data/imp-34496-excess-above-two-viz-data.js';
import { ED } from '../styles/tokens.js';

// Line-with-points chart: the excess-above-2 sequence itself, strictly decreasing across the
// four landmarks.
function ExcessLadderLine() {
  const svgW = 640;
  const svgH = 260;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = 0.05;
  const yMax = 0.095;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const n = IMP34496_EXCESS_LADDER.length;
  const xAt = (i) => padL + (cW * i) / (n - 1);

  const yTicks = [0.05, 0.06, 0.07, 0.08, 0.09];

  const points = IMP34496_EXCESS_LADDER.map((r, i) => `${xAt(i)},${yAt(r.excess_above_two)}`).join(' ');

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

      <polyline points={points} fill="none" stroke={ED.series1} strokeWidth={2} />

      {IMP34496_EXCESS_LADDER.map((r, i) => (
        <g key={r.landmark}>
          <circle cx={xAt(i)} cy={yAt(r.excess_above_two)} r={4} fill={ED.series1} stroke={ED.paper} strokeWidth={1} />
          <text
            x={xAt(i)}
            y={yAt(r.excess_above_two) - 10}
            textAnchor="middle"
            fill={ED.inkSoft}
            fontSize={9}
            fontFamily="monospace"
          >
            {r.excess_above_two.toFixed(6)}
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

// Bar chart: the absolute per-step drop of the excess -- rises to a mild peak at the middle
// step then TURNS OVER at the deepest interval (green bar), not a constant drop.
function ExcessDropBars() {
  const svgW = 640;
  const svgH = 220;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 60;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMax = 0.014;
  const yAt = (v) => padT + cH - (v / yMax) * cH;

  const n = IMP34496_EXCESS_DROPS.length;
  const slot = cW / n;
  const barW = slot * 0.4;

  const yTicks = [0, 0.004, 0.008, 0.012];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}

      {IMP34496_EXCESS_DROPS.map((r, i) => {
        const xCenter = padL + slot * i + slot / 2;
        const x = xCenter - barW / 2;
        const top = yAt(r.excess_drop);
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
              {r.excess_drop.toExponential(2)}
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

export default function Imp34496ExcessAboveTwoViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Excess-Above-2 Drift Turnover (imp-34447)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34447 measured the coupling ratio residual/(E_flow/E_trunc) at four closed-form
        crossover landmarks (thr=0.5, 0.1, 0.01, 0.001). This page tracks the excess above the
        leading value 2 in ABSOLUTE units &mdash; the sequence {'{'}0.089015, 0.078776, 0.066432,
        0.057639{'}'} &mdash; and its per-step drops. The companion imp-34456 page shows the same
        turnover in relative-percent terms; here the deepest interval drop is again the smallest,
        confirming the turnover holds in absolute units too.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Excess above 2 decreases monotonically across all four landmarks
      </p>
      <ExcessLadderLine />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Absolute per-step drop rises to a mild peak at the middle step then TURNS OVER (green bar)
        at the deepest interval
      </p>
      <ExcessDropBars />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>step</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>excess drop</th>
          </tr>
        </thead>
        <tbody>
          {IMP34496_EXCESS_DROPS.map((row) => (
            <tr key={row.step} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.step}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.excess_drop.toExponential(2)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Summary:</strong> the absolute per-step drops are
        1.02e-2, 1.23e-2, 8.79e-3 &mdash; unequal, rising to a mild peak at the far-tail-to-deep-tail
        step then turning over in the deepest interval, the same qualitative pattern imp-34447/
        imp-34456 found in relative-percent terms.
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
        reproducing the imp-34447 measurement; no new derivation, no bound changed. Component
        model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb
        GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz untouched; imp-3066 K_a&ge;0
        untouched; NO QED.
      </div>
    </div>
  );
}
