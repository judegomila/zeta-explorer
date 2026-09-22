import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { PRECISION_REPLAY_LADDER } from '../data/imp-95277-precision-replay-ladder.js';

function AxisFrame({ children, svgW, svgH, padL, padR, padT, padB, xTicks, yTicks, xOf, yOf, xLabel, yLabel }) {
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      {xTicks.map((v) => (
        <line key={`x${v}`} x1={xOf(v)} y1={padT + plotH} x2={xOf(v)} y2={padT + plotH + 4} stroke="#334155" strokeWidth={1} />
      ))}
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(v)} x2={padL} y2={yOf(v)} stroke="#334155" strokeWidth={1} />
          <text x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
            {v}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9.5}>
        {xLabel}
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={9.5}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {children}
    </svg>
  );
}

// bar chart of CPU-days per limb band, upper (schoolbook) and lower (linear) brackets
function CostLadderPanel() {
  const rows = PRECISION_REPLAY_LADDER.rungs;
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const svgH = 320;
  const padT = 20;
  const padB = 56;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;
  const maxY = 200;
  const groupW = plotW / rows.length;
  const barW = groupW / 3;
  const xOf = (i) => padL + groupW * (i + 0.5);
  const yOf = (v) => padT + plotH - (v / maxY) * plotH;

  return (
    <AxisFrame
      svgW={svgW}
      svgH={svgH}
      padL={padL}
      padR={padR}
      padT={padT}
      padB={padB}
      xTicks={rows.map((_, i) => i)}
      yTicks={[0, 50, 100, 150, 200]}
      xOf={xOf}
      yOf={yOf}
      xLabel="mantissa-limb band"
      yLabel="tier-2 full-window CPU-days"
    >
      {rows.map((r, i) => (
        <g key={r.limbs}>
          <rect
            x={xOf(i) - barW}
            y={yOf(r.cpuDaysLower)}
            width={barW}
            height={yOf(0) - yOf(r.cpuDaysLower)}
            fill="#38bdf8"
            opacity={0.85}
          />
          <rect
            x={xOf(i)}
            y={yOf(r.cpuDaysUpper)}
            width={barW}
            height={yOf(0) - yOf(r.cpuDaysUpper)}
            fill="#fb923c"
            opacity={0.85}
          />
          <text x={xOf(i) - barW / 2} y={yOf(r.cpuDaysLower) - 6} textAnchor="middle" fill="#94a3b8" fontSize={8}>
            {r.cpuDaysLower.toFixed(1)}
          </text>
          <text x={xOf(i) + barW / 2} y={yOf(r.cpuDaysUpper) - 6} textAnchor="middle" fill="#e2e8f0" fontSize={8}>
            {r.cpuDaysUpper.toFixed(1)}
          </text>
          <text x={xOf(i)} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
            {r.limbs}L
          </text>
          <text x={xOf(i)} y={padT + plotH + 28} textAnchor="middle" fill="#475569" fontSize={7.5}>
            {r.bitsLow}-{r.bitsHigh}b
          </text>
        </g>
      ))}
      <text x={padL + 8} y={padT + 14} fill="#38bdf8" fontSize={9}>
        lower (linear-in-limbs, f_lo = L/2)
      </text>
      <text x={padL + 8} y={padT + 27} fill="#fb923c" fontSize={9}>
        upper (schoolbook, f_up = L^2/4)
      </text>
    </AxisFrame>
  );
}

export default function Imp95392PrecisionReplayCostLadderViz() {
  const rows = PRECISION_REPLAY_LADDER.rungs;
  const last = rows[rows.length - 1];
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Tier-2 Precision-Replay Cost Ladder, CPU-Days vs Bit-Band (imp-95277)" />

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
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a derivation from the frozen
        imp-95214/imp-95238/imp-95257 ledgers, not a wall-clock measurement -- no native FLINT/Arb
        replay is launched. It changes no Lambda bound. Platt&ndash;Trudgian &Lambda; &le; 0.2
        remains state of the art. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The tier-2 full-window W1-CERT price ({PRECISION_REPLAY_LADDER.baselineCpuDays} CPU-days at
        the 128-bit / {PRECISION_REPLAY_LADDER.baselineLimbs}-limb baseline) grows with target
        precision by the FLINT/Arb limb-quantized schoolbook multiply factor. The price is flat
        within each 64-bit band and jumps only at mantissa-limb boundaries, up to{' '}
        {last.cpuDaysUpper.toFixed(1)} CPU-days (upper bracket) at {last.bitsLow}-{last.bitsHigh}{' '}
        bits ({last.limbs} limbs).
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        CPU-days by mantissa-limb band, upper (schoolbook) vs lower (linear) bracket
      </h3>
      <CostLadderPanel />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> each band is a flat plateau
        (129 and 192 bits both cost the same 3-limb price) and the jump between bands is L&sup2;/4
        for the upper bracket, not per-bit-linear. The 3-limb rung (129-192 bits) reproduces the
        imp-95257 headline exactly: 2.25x, ~47.5 CPU-days. The factor is common to the level-1 and
        tier-2 routes, so the tier-2 dominance and the do-not-run-level-1 recommendation are
        precision-invariant at every rung -- only the absolute tier-2 budget climbs.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page consuming the imp-95277
        ladder module (values copied verbatim, no re-derivation). Changes no bound, establishes no
        operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA.
        NO QED.
      </div>
    </div>
  );
}
