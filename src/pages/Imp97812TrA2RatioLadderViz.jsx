import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP97812_RATIO_LADDER_ROWS,
  IMP97812_GEOMETRIC_LIMIT,
  IMP97812_ALGEBRAIC_LIMIT,
} from '../data/imp-97812-tra2-ratio-ladder-viz-data.js';

function RatioLadderChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const steps = IMP97812_RATIO_LADDER_ROWS.map((r) => r.step);
  const yMin = 0.65;
  const yMax = 1.01;

  const xS = (step) => padL + ((step - steps[0]) / (steps[steps.length - 1] - steps[0])) * cW;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const path = IMP97812_RATIO_LADDER_ROWS.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.step).toFixed(1) + ',' + yS(r.ratio).toFixed(2)).join(' ');

  const yTicks = [0.65, 0.75, 0.85, 0.95, 1.0];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke="#1e293b" strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      <line x1={padL} y1={yS(1)} x2={padL + cW} y2={yS(1)} stroke="#475569" strokeWidth={1} strokeDasharray="5 3" />
      <text x={padL + 4} y={yS(1) - 5} fill="#64748b" fontSize={9}>
        ratio = 1 (a geometric tail would need a FLAT line, not this climb)
      </text>

      <path d={path} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {IMP97812_RATIO_LADDER_ROWS.map((r) => (
        <circle key={r.step} cx={xS(r.step)} cy={yS(r.ratio)} r={3} fill="#38bdf8" />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />

      {IMP97812_RATIO_LADDER_ROWS.map((r) => (
        <g key={'x' + r.step}>
          <line x1={xS(r.step)} y1={padT + cH} x2={xS(r.step)} y2={padT + cH + 5} stroke="#334155" strokeWidth={1} />
          <text x={xS(r.step)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            r{r.step} (K={r.Kbig})
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        block-ratio step
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill="#64748b" fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        ratio d_(i+1) / d_i
      </text>
    </svg>
  );
}

function DriftChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 200;
  const svgH = padT + cH + padB;

  const rows = IMP97812_RATIO_LADDER_ROWS.slice(1);
  const drifts = rows.map((r) => r.driftFromPrev);
  const yMax = Math.max(...drifts) * 1.15;
  const barW = (cW / rows.length) * 0.5;

  const xS = (i) => padL + ((i + 0.5) / rows.length) * cW;
  const yS = (v) => padT + cH * (1 - v / yMax);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />
      {rows.map((r, i) => (
        <rect
          key={r.step}
          x={xS(i) - barW / 2}
          y={yS(r.driftFromPrev)}
          width={barW}
          height={padT + cH - yS(r.driftFromPrev)}
          fill="#f59e0b"
        />
      ))}
      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#334155" strokeWidth={1} />
      {rows.map((r, i) => (
        <g key={'x' + r.step}>
          <text x={xS(i)} y={padT + cH + 17} textAnchor="middle" fill="#64748b" fontSize={8.5}>
            r{r.step}-r{r.step - 1}
          </text>
          <text x={xS(i)} y={yS(r.driftFromPrev) - 6} textAnchor="middle" fill="#94a3b8" fontSize={8.5}>
            {r.driftFromPrev.toFixed(6)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill="#64748b" fontSize={10}>
        successive drift toward 1 (shrinking = algebraic signature)
      </text>
    </svg>
  );
}

export default function Imp97812TrA2RatioLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="tr(A2) Uniform-Block Ratio Ladder: Algebraic vs Geometric (imp-97684)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The imp-97641/imp-97684 tr(A2) tail is built from five uniform 80-step blocks
        (K = 560, 640, 720, 800, 880, 960). The block-to-block ratio r_i = d_(i+1)/d_i climbs
        monotonically toward 1 across all four measured steps, with a DECELERATING increment
        at every step. A pure geometric tail requires a constant (flat) ratio; the sustained
        climb with a shrinking drift is instead the signature of an algebraic (power-law) tail.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        block ratio r_i vs step, climbing toward 1
      </p>
      <RatioLadderChart />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        successive drift (r_i - r_(i-1)) toward 1, shrinking at every step
      </p>
      <DriftChart />

      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#38bdf8' }}>&#9644;</span> measured block ratio r_i</span>
        <span><span style={{ color: '#f59e0b' }}>&#9644;</span> drift toward 1 between successive ratios</span>
        <span>geometric limit &asymp; {(IMP97812_GEOMETRIC_LIMIT / 1e6).toFixed(3)}M, algebraic limit &asymp; {(IMP97812_ALGEBRAIC_LIMIT / 1e6).toFixed(3)}M</span>
      </div>

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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> presentation only -- every ratio,
        drift and extrapolated limit is reused verbatim from imp-97684 (a measurement, not a
        derivation); no new computation. Changes no bound; establishes no operator positivity;
        Platt-Trudgian Lambda &le; 0.2 remains SOTA; RH open; NO QED.
      </div>
    </div>
  );
}
